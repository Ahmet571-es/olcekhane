import 'server-only';
import { and, desc, eq, sql } from 'drizzle-orm';
import { EXPERTS } from '@/content/experts';
import { publicInstruments } from '@/content/instruments';
import { db } from '@/db';
import { jobRuns, legalDocuments } from '@/db/schema';
import { lastSuccessfulRun } from '@/lib/jobs/purge';
import { missingCompanyFields } from '@/lib/site';

export type CheckStatus = 'ok' | 'warn' | 'fail' | 'info';

export interface ReadinessCheck {
  key: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

const REQUIRED_DOCS: { kind: (typeof legalDocuments.$inferSelect)['kind']; label: string }[] = [
  { kind: 'privacy_notice', label: 'KVKK aydınlatma metni' },
  { kind: 'consent_assessment', label: 'Açık rıza metni (ölçme)' },
  { kind: 'consent_research', label: 'Açık rıza metni (araştırma)' },
  { kind: 'child_info', label: 'Öğrenci bilgilendirme metni' },
  { kind: 'terms', label: 'Kullanım koşulları' },
  { kind: 'cookie_policy', label: 'Çerez politikası' },
];

/**
 * Yayına çıkmadan önce ve yayındayken yönetim panelinde gösterilen hazırlık listesi. Yalnızca
 * sunucunun kendi ayarlarına ve veritabanına bakar; gizli değerlerin kendisini asla göstermez.
 */
export async function readinessChecks(): Promise<ReadinessCheck[]> {
  const env = process.env;
  const out: ReadinessCheck[] = [];
  const prod = env.NODE_ENV === 'production';

  const appUrl = env.APP_URL ?? '';
  const urlOk = /^https:\/\//.test(appUrl) && !/localhost|127\.0\.0\.1/.test(appUrl);
  out.push({
    key: 'app_url',
    label: 'Site adresi (APP_URL)',
    status: urlOk ? 'ok' : prod ? 'fail' : 'warn',
    detail: urlOk
      ? appUrl
      : 'E-postalardaki bağlantılar, site haritası ve paylaşım kartları bu adresle üretilir. Alan adınızla ve https ile tanımlayın (ör. https://olcekhane.com).',
  });

  const secret = env.APP_SECRET ?? '';
  out.push({
    key: 'app_secret',
    label: 'Uygulama gizli anahtarı (APP_SECRET)',
    status: secret.length >= 32 ? 'ok' : 'fail',
    detail:
      secret.length >= 32
        ? 'Tanımlı (değer gösterilmez).'
        : 'Öğrenci giriş kodlarının özetleri bu anahtarla alınır. En az 32 karakterlik rastgele bir değer tanımlayın: openssl rand -hex 32',
  });

  out.push({
    key: 'smtp',
    label: 'E-posta gönderimi (SMTP_URL)',
    status: env.SMTP_URL ? 'ok' : prod ? 'fail' : 'warn',
    detail: env.SMTP_URL
      ? `Tanımlı. Gönderen: ${env.MAIL_FROM ?? 'Ölçekhane <bilgi@olcekhane.com> (varsayılan)'}`
      : 'Tanımlı değil: doğrulama, şifre yenileme, davet ve veli onayı e-postaları gönderilmiyor, yalnızca bu paneldeki e-posta kutusuna yazılıyor.',
  });

  const missing = missingCompanyFields();
  out.push({
    key: 'company',
    label: 'Şirket bilgileri (COMPANY_*)',
    status: missing.length === 0 ? 'ok' : 'fail',
    detail:
      missing.length === 0
        ? 'Aydınlatma metni ve site altbilgisi için bütün alanlar dolu.'
        : `Aydınlatma metninde ve altbilgide görünmesi zorunlu. Eksik: ${missing.join(', ')}.`,
  });

  const indexing = (env.ALLOW_INDEXING ?? 'true').toLowerCase() !== 'false';
  out.push({
    key: 'indexing',
    label: 'Arama motorlarında görünürlük (ALLOW_INDEXING)',
    status: indexing ? 'ok' : 'info',
    detail: indexing
      ? 'Açık: site haritası yayında, sayfalar dizine eklenebilir.'
      : 'Kapalı: bütün sayfalar “noindex” ile sunuluyor. Hazırlık ortamı için doğru; yayına geçerken açın.',
  });

  if (prod && env.SESSION_COOKIE_SECURE === 'false') {
    out.push({
      key: 'cookie',
      label: 'Güvenli oturum çerezi',
      status: 'fail',
      detail: 'SESSION_COOKIE_SECURE=false üretimde kullanılmamalı; oturum çerezi yalnızca https üzerinden gönderilmeli.',
    });
  }

  const docs = await Promise.all(
    REQUIRED_DOCS.map(async (d) => {
      const [row] = await db
        .select({ version: legalDocuments.version })
        .from(legalDocuments)
        .where(and(eq(legalDocuments.kind, d.kind), eq(legalDocuments.isActive, true)))
        .limit(1);
      return { ...d, ok: !!row };
    }),
  );
  const missingDocs = docs.filter((d) => !d.ok);
  out.push({
    key: 'legal',
    label: 'Hukuki metinler',
    status: missingDocs.length ? 'fail' : 'ok',
    detail: missingDocs.length
      ? `Yayında olmayan: ${missingDocs.map((d) => d.label).join(', ')}.`
      : 'Yayında. Yayın öncesinde bir hukukçunun metinleri gözden geçirmesini öneririz.',
  });

  // Aydınlatma metnindeki saklama süreleri günlük temizlik göreviyle uygulanır.
  const lastPurge = await lastSuccessfulRun();
  const purgeFresh = !!lastPurge && Date.now() - lastPurge.getTime() < 36 * 3600_000;
  const jobsOff = (env.SCHEDULED_JOBS ?? (prod ? 'true' : 'false')) === 'false';
  out.push({
    key: 'purge',
    label: 'Günlük temizlik görevi',
    status: purgeFresh ? 'ok' : prod ? 'fail' : 'warn',
    detail: purgeFresh
      ? `Son başarılı çalışma: ${new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Istanbul' }).format(lastPurge)}.`
      : `${lastPurge ? 'Son 36 saatte başarılı çalışma yok' : 'Henüz hiç çalışmadı'}. Rıza geri alınınca verilerin 30 gün içinde silinmesi sözü bu görevle yerine getirilir.${
          jobsOff ? ' Zamanlayıcı kapalı (SCHEDULED_JOBS=false).' : ''
        } Aşağıdan elle de çalıştırabilirsiniz.`,
  });

  // Veritabanı yedekleri: yedek kapsayıcısı (docker/backup.sh) her çalışmayı görev kaydına yazar.
  const [lastBackup, [lastBackupRun]] = await Promise.all([
    lastSuccessfulRun('yedek'),
    db.select({ ok: jobRuns.ok, at: jobRuns.startedAt, error: jobRuns.error }).from(jobRuns).where(eq(jobRuns.job, 'yedek')).orderBy(desc(jobRuns.startedAt)).limit(1),
  ]);
  const backupFresh = !!lastBackup && Date.now() - lastBackup.getTime() < 36 * 3600_000;
  const when = (d: Date) => new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Istanbul' }).format(d);
  out.push({
    key: 'backup',
    label: 'Veritabanı yedeği',
    status: backupFresh ? (lastBackupRun?.ok === false ? 'warn' : 'ok') : prod ? 'fail' : 'info',
    detail: backupFresh
      ? `Son başarılı yedek: ${when(lastBackup)}.${lastBackupRun?.ok === false ? ` Ondan sonraki deneme başarısız oldu (${when(lastBackupRun.at)}); yedek kapsayıcısının günlüğüne bakın: docker compose logs yedek.` : ''}`
      : lastBackup
        ? `Son 36 saatte başarılı yedek yok (son başarılı yedek: ${when(lastBackup)}). Yedek kapsayıcısının günlüğüne bakın: docker compose logs yedek.`
        : prod
          ? 'Henüz hiç yedek alınmadı. Yedek kapsayıcısı her gece çalışır; hemen almak için: docker compose exec yedek bash /usr/local/bin/yedekle simdi'
          : 'Kayıt yok: yedekler üretimde yedek kapsayıcısıyla alınır (KURULUM.md, bölüm 9).',
  });

  // Bireysel sonuçlara erişen görevlerde iki aşamalı doğrulama zorunlu; kurmamış olanlar ilk girişte yönlendirilir.
  const [pending2fa] = await db.execute<{ n: number }>(sql`
    select count(distinct u.id)::int as n from users u
    where u.deleted_at is null and u.totp_enabled_at is null
      and (u.role = 'admin' or exists (
        select 1 from memberships m join organizations o on o.id = m.org_id
        where m.user_id = u.id and m.role = 'counselor' and o.is_active and o.deleted_at is null))`);
  out.push({
    key: '2fa',
    label: 'İki aşamalı doğrulama',
    status: 'info',
    detail:
      Number(pending2fa?.n ?? 0) === 0
        ? 'Platform yöneticileri ve rehber öğretmenlerin hepsi kurmuş (KVKK Kurulu 2018/10: özel nitelikli verilere uzaktan erişimde zorunlu).'
        : `${pending2fa.n} platform yöneticisi ya da rehber öğretmen henüz kurmadı; bireysel sonuçlara erişmeden önce kurmaları istenecek.`,
  });

  out.push({
    key: 'experts',
    label: 'Uzman kadrosu',
    status: EXPERTS.length ? 'ok' : 'warn',
    detail: EXPERTS.length
      ? `${EXPERTS.length} uzman tanımlı.`
      : 'Boş: rehber yazılarında yazar ve hakem bilgisi, uzmanlar sayfasında kadro görünmüyor. Gerçek kişilerin adı ve unvanıyla src/content/experts.ts dosyasına ekleyin.',
  });

  const pending = publicInstruments().filter((i) => i.licenseStatus === 'permission_pending');
  out.push({
    key: 'licenses',
    label: 'Ölçek kullanım izinleri',
    status: pending.length ? 'fail' : 'ok',
    detail: pending.length
      ? `İzni beklenen ölçek yayında: ${pending.map((i) => i.name).join(', ')}.`
      : 'Yayındaki bütün ölçekler kamu malı ya da özgün.',
  });

  const pilots = publicInstruments().filter((i) => i.status === 'pilot');
  if (pilots.length) {
    out.push({
      key: 'pilot',
      label: 'Norm çalışması',
      status: 'info',
      detail: `${pilots.length} test pilot aşamasında; raporlar Türkiye normu yerine ölçeğin kendi aralığıyla yorumlanıyor. Psikometri bölümünden veri birikimini izleyebilirsiniz.`,
    });
  }

  out.push({
    key: 'payments',
    label: 'Ödeme sistemi',
    status: 'info',
    detail: 'Kapalı. Bütün testler ücretsiz sunuluyor; sanal POS bağlandığında ön bilgilendirme ve mesafeli satış metinleri de yayına alınmalı.',
  });

  return out;
}
