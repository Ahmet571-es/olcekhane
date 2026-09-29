import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import QRCode from 'qrcode';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { safeNextPath } from '@/lib/auth/next-path';
import { getSession } from '@/lib/auth/session';
import { otpauthUri } from '@/lib/auth/totp';
import { openSecret, twoFactorRequired, unusedRecoveryCodes } from '@/lib/auth/two-factor';
import { DisableForm, RegenerateCodesForm, SetupPanel, StartSetupForm, VerifySessionForm } from './forms';

export const metadata: Metadata = { title: 'İki aşamalı doğrulama', robots: { index: false, follow: false } };

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function TwoFactorPage(props: PageProps<'/hesap/iki-asamali'>) {
  const s = await getSession();
  if (s?.kind !== 'user' && s?.kind !== 'unverified') redirect(`/giris?sonra=${encodeURIComponent('/hesap/iki-asamali')}`);
  // Doğrulanmamış oturum (iki aşamalı doğrulama açık, bu oturumda kod girilmemiş) yalnızca oturumu
  // doğrulama formunu görür.
  const user = s.kind === 'user' ? s.user : s.unverifiedUser;
  const q = await props.searchParams;
  const zorunlu = q.zorunlu === '1';
  const next = safeNextPath(q.sonra) ?? undefined;
  const [[u], [sess], required] = await Promise.all([
    db.select({ enabledAt: users.totpEnabledAt }).from(users).where(eq(users.id, user.id)).limit(1),
    // Bekleyen kurulum yalnızca onu başlatan oturumda görünür.
    db.select({ pending: sessions.totpPendingSecret }).from(sessions).where(eq(sessions.id, s.sessionId)).limit(1),
    twoFactorRequired(user),
  ]);
  const enabled = !!u?.enabledAt;
  const verified = s.kind === 'user' && user.twoFactor;
  const left = enabled ? await unusedRecoveryCodes(user.id) : 0;

  // Bu oturumda kurulum sürüyorsa karekod ve elle girilecek anahtar.
  let setup: { qr: string; key: string } | null = null;
  if (sess?.pending) {
    const secret = openSecret(sess.pending);
    const svg = await QRCode.toString(otpauthUri(secret, user.email), { type: 'svg', errorCorrectionLevel: 'M', margin: 1 });
    setup = { qr: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, key: secret.match(/.{1,4}/g)!.join(' ') };
  }
  const kurtarma = typeof q.kurtarma === 'string' ? Number(q.kurtarma) : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link href="/hesap" className="t-small">
          Hesabım
        </Link>
        <h1 className="t-h1">İki aşamalı doğrulama</h1>
        <p className="measure text-ink-2">
          Girişte şifrenizin yanında telefonunuzdaki kimlik doğrulama uygulamasının ürettiği tek kullanımlık kod da istenir. Şifreniz
          başkasının eline geçse bile hesabınıza girilemez.
        </p>
      </div>

      {zorunlu && !enabled && (
        <p className="notice notice-info">
          Öğrencilerin bireysel sonuçlarını görebilen rehber öğretmenler ve platform yöneticileri için iki aşamalı doğrulama zorunludur (KVKK
          Kurulunun 2018/10 sayılı kararı). Kurulumu tamamladıktan sonra kaldığınız yere dönersiniz.
        </p>
      )}
      {kurtarma !== null && Number.isFinite(kurtarma) && (
        <p className="notice notice-warn">
          Bir kurtarma koduyla giriş yaptınız; {kurtarma} kurtarma kodunuz kaldı. Telefonunuzu değiştirdiyseniz aşağıdan yeni cihazınıza taşıyın.
        </p>
      )}
      {q.kapatildi === '1' && !enabled && (
        <p className="notice notice-ok" role="status">
          İki aşamalı doğrulama kapatıldı.
        </p>
      )}

      {!setup && (
        <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="durum">
          <h2 id="durum" className="t-h3">
            Durum
          </h2>
          <p className="flex flex-wrap items-center gap-2">
            {enabled ? (
              <>
                <span className="chip chip-ok">Açık</span>
                <span className="t-meta">{dateFmt.format(u!.enabledAt!)} tarihinden beri</span>
              </>
            ) : (
              <span className="chip">Kapalı</span>
            )}
          </p>
          {enabled && verified && (
            <p className="t-small text-ink-2">
              Kullanılmamış kurtarma kodu: <strong>{left}</strong>
              {left <= 3 && ' — azaldı; yeni kodlar oluşturun.'}
            </p>
          )}
        </section>
      )}

      {setup ? (
        <SetupPanel qr={setup.qr} secretKey={setup.key} email={user.email} moving={enabled} zorunlu={zorunlu} next={next} />
      ) : !enabled ? (
        <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="baslat">
          <h2 id="baslat" className="t-h3">
            Kurulum
          </h2>
          <p className="text-ink-2">
            Kurulum birkaç dakika sürer. Telefonunuz ve bir kimlik doğrulama uygulaması gerekir. Başlamak için şifrenizi yazın.
          </p>
          <StartSetupForm moving={false} zorunlu={zorunlu} next={next} />
        </section>
      ) : !verified ? (
        <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="oturum">
          <h2 id="oturum" className="t-h3">
            Bu oturumu doğrulayın
          </h2>
          <p className="text-ink-2">
            Bu oturum kimlik doğrulama uygulamasındaki kodla açılmadı. Öğrencilerin bireysel sonuçlarına ve iki aşamalı doğrulama ayarlarına
            erişmek için uygulamadaki güncel kodu ya da bir kurtarma kodunu yazın.
          </p>
          <VerifySessionForm zorunlu={zorunlu} next={next} />
        </section>
      ) : (
        <>
          <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="kodlar">
            <h2 id="kodlar" className="t-h3">
              Kurtarma kodları
            </h2>
            <p className="t-small text-ink-2">
              Yeni kodlar oluşturduğunuzda eskileri geçersiz olur. Kodlar yalnızca oluşturuldukları anda gösterilir.
            </p>
            <RegenerateCodesForm />
          </section>
          <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="tasi">
            <h2 id="tasi" className="t-h3">
              Yeni telefona taşı
            </h2>
            <p className="t-small text-ink-2">
              Şifreniz ve şu anki cihazınızdaki kod (ya da bir kurtarma kodu) istenir. Yeni cihazda kurulumu tamamlayana kadar mevcut kurulum
              geçerli kalır.
            </p>
            <StartSetupForm moving zorunlu={zorunlu} next={next} />
          </section>
          {required ? (
            <p className="t-small text-ink-2">Göreviniz gereği iki aşamalı doğrulama kapatılamaz.</p>
          ) : (
            <details className="panel p-6 md:p-8">
              <summary className="cursor-pointer font-bold">İki aşamalı doğrulamayı kapat</summary>
              <div className="mt-4">
                <DisableForm />
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
