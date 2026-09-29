import type { Metadata } from 'next';
import Link from 'next/link';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { guardianships } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { currentDocument, hasActiveConsent, latestConsent } from '@/lib/consent';
import { renderMarkdown } from '@/lib/markdown';
import { maskEmail } from '@/lib/mask';
import { consentRequestByToken, markConsentRequestOpened } from '@/lib/school/consent-requests';
import { accountsOpen, fillCompany } from '@/lib/site';
import { consentDecisionAction, linkStudentAction } from '../actions';

export const metadata: Metadata = { title: 'Veli onayı', robots: { index: false, follow: false } };

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const MESSAGES: Record<string, { ok: boolean; text: string }> = {
  grant: { ok: true, text: 'Açık rızanız kaydedildi. Onay bilgisini e-posta adresinize de gönderdik.' },
  decline: { ok: true, text: 'Onay vermediğiniz kaydedildi. Çocuğunuza bu platformda uygulama yapılmayacak.' },
  revoke: {
    ok: true,
    text: 'Açık rızanız geri alındı. Yeni uygulama yapılmayacak; sonuçlar gizlendi ve bu rızaya dayanan veriler en geç 30 gün içinde silinecek. Yeniden onay verseniz de eski sonuçlar geri gelmez.',
  },
  revoke_research: { ok: true, text: 'Araştırma çalışmalarına katkı rızanız geri alındı.' },
};
const ERRORS: Record<string, string> = {
  beyan: 'Onay verebilmek için aydınlatma metnini okuduğunuzu ve öğrencinin velisi olduğunuzu belirten kutuları işaretleyin.',
  'cok-deneme': 'Kısa sürede çok fazla işlem yapıldı. Lütfen biraz sonra tekrar deneyin.',
  sure: 'Bu bağlantıyla artık onay verilemez: süresi dolmuş ya da yerine yeni bir bağlantı gönderilmiş. Onay vermek için okulunuzun rehberlik servisinden yeni bir bağlantı isteyin; bu bağlantıdan verdiğiniz rızayı ise her zaman buradan geri alabilirsiniz.',
  'farkli-eposta': 'Bu bağlantı başka bir e-posta adresine gönderildi. Çocuğunuzu bağlamak için o adresle giriş yapın.',
  'onay-yok': 'Çocuğunuzu hesabınıza bağlamak için önce açık rıza vermeniz gerekiyor.',
  yakinlik: 'Çocuğunuza yakınlığınızı seçin.',
  kapali: 'Okul bölümü şu an kapalı: yeni onay verilemez ve öğrenci bir veli hesabına bağlanamaz. Daha önce verdiğiniz rızayı bu sayfadan geri alabilirsiniz.',
};

function DocDetails({ title, bodyMd }: { title: string; bodyMd: string }) {
  return (
    <details className="rounded-lg border border-rule bg-surface p-4">
      <summary className="cursor-pointer font-bold">{title}</summary>
      <div className="prose-olc t-small mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(fillCompany(bodyMd)) }} />
    </details>
  );
}

function InvalidLink() {
  return (
    <div className="w-full max-w-[34rem]">
      <h1 className="t-h1 mb-3">Bağlantı geçersiz</h1>
      <p className="text-ink-2">
        Bu bağlantının yerine daha yeni bir bağlantı gönderilmiş, okulun kayıtlarındaki veli e-postası değişmiş ya da öğrenci kaydı silinmiş
        olabilir. Size gelen en son onay e-postasındaki bağlantıyı kullanın ya da okulunuzun rehberlik servisine başvurun.
      </p>
    </div>
  );
}

export default async function ParentConsentPage(props: PageProps<'/veli-onayi/[token]'>) {
  const { token } = await props.params;
  const q = await props.searchParams;
  const req = await consentRequestByToken(token);
  if (!req) return <InvalidLink />;
  if (!req.canDecide && !req.canRevoke) {
    // Bağlantı yalnızca daha önce karar verildiği için açık kalıyor: az önce verilen kararın sonucu
    // gösterilir, öğrencinin güncel onay durumu gösterilmez (bağlantı artık yanlış kişide olabilir).
    const done = typeof q.karar === 'string' ? MESSAGES[q.karar] : undefined;
    if (!done) return <InvalidLink />;
    return (
      <div className="flex w-full max-w-[34rem] flex-col gap-4">
        <h1 className="t-h1">Veli onayı</h1>
        <p className="notice notice-ok" role="status">
          {done.text}
        </p>
        <p className="text-ink-2">Bu bağlantıyla başka bir işlem yapılamaz. Sorularınız için okulunuzun rehberlik servisine başvurun.</p>
      </div>
    );
  }
  if (!req.openedAt) await markConsentRequestOpened(req.id);
  const session = await getSession();
  const viewer = session?.kind === 'user' ? session.user : null;
  const sameEmail = !!viewer && viewer.email.toLowerCase() === req.email.toLowerCase();
  const [linked] = viewer
    ? await db
        .select({ id: guardianships.id })
        .from(guardianships)
        .where(and(eq(guardianships.studentId, req.studentId), eq(guardianships.userId, viewer.id)))
        .limit(1)
    : [];
  const back = `/veli-onayi/${encodeURIComponent(token)}`;
  const [notice, consentDoc, researchDoc, active, research, latest] = await Promise.all([
    currentDocument('privacy_notice'),
    currentDocument('consent_assessment'),
    currentDocument('consent_research'),
    hasActiveConsent(req.studentId, 'consent_assessment'),
    hasActiveConsent(req.studentId, 'consent_research'),
    latestConsent(req.studentId, 'consent_assessment'),
  ]);
  const karar = typeof q.karar === 'string' ? MESSAGES[q.karar] : undefined;
  const hata = typeof q.hata === 'string' ? ERRORS[q.hata] : undefined;
  // Hesaplar kapalıyken yeni onay alınmaz ve öğrenci hesaba bağlanamaz; verilmiş rıza geri alınabilir.
  const open = accountsOpen();
  const action = consentDecisionAction.bind(null, token);
  const linkAction = linkStudentAction.bind(null, token);

  return (
    <div className="flex w-full max-w-[42rem] flex-col gap-7">
      <div className="flex flex-col gap-3">
        <p className="t-meta">{req.orgName ?? 'Okul'} · Rehberlik servisi</p>
        <h1 className="t-h1">{req.studentFirstName} için veli onayı</h1>
        <p className="text-ink-2">
          Okulunuzun rehberlik servisi, öğrencileri daha iyi tanımak için Ölçekhane’de bilimsel ölçekler ve görevler uygulamak istiyor. Bu
          uygulamalar ancak sizin açık rızanızla yapılabilir. Onay vermemeniz çocuğunuz için hiçbir olumsuz sonuç doğurmaz.
        </p>
      </div>
      {karar && (
        <p className={`notice ${karar.ok ? 'notice-ok' : 'notice-danger'}`} role="status">
          {karar.text}
        </p>
      )}
      {hata && (
        <p className="notice notice-danger" role="alert">
          {hata}
        </p>
      )}

      <section className="panel flex flex-col gap-3 p-5" aria-labelledby="durum">
        <h2 id="durum" className="font-body text-base font-bold">
          Şu anki durum
        </h2>
        {active ? (
          <p>
            <span className="chip chip-ok">Açık rıza verildi</span>{' '}
            {latest && <span className="t-meta">{dateFmt.format(latest.createdAt)}</span>}
          </p>
        ) : latest && !latest.granted ? (
          <p>
            <span className="chip">Onay verilmedi</span> {latest && <span className="t-meta">{dateFmt.format(latest.createdAt)}</span>}
          </p>
        ) : (
          <p>
            <span className="chip chip-brass">Karar bekleniyor</span>
          </p>
        )}
        <ul className="t-small flex list-disc flex-col gap-1 pl-5 text-ink-2">
          {open && (
            <>
              <li>
                Çocuğunuzun bireysel sonuçlarını siz (hesap açarsanız), çocuğunuz ve okulun rehber öğretmeni görebilir. Ölçekhane yöneticileri
                yalnızca destek ve denetim için, her erişimi kayda geçirerek görebilir.
              </li>
              <li>Öğretmenler ve okul yönetimi bireysel sonuç göremez; yalnızca en az beş öğrencilik grupların özetlerini görür.</li>
            </>
          )}
          <li>Veriler reklam, pazarlama ya da yapay zekâ eğitimi için kullanılmaz.</li>
        </ul>
      </section>

      {open && active && req.canDecide && (
        <section className="panel flex flex-col gap-4 p-5" aria-labelledby="raporlar">
          <h2 id="raporlar" className="font-body text-base font-bold">
            Raporları kendi hesabınızda görün
          </h2>
          {linked ? (
            <p>
              {req.studentFirstName} hesabınıza bağlı. Tamamladığı testlerin raporlarını{' '}
              <Link href={`/panel/cocuk/${req.studentId}`}>veli panelinizde</Link> görebilirsiniz.
            </p>
          ) : sameEmail ? (
            <form action={linkAction} className="flex flex-col gap-4">
              <p className="text-ink-2">
                {req.studentFirstName} adlı öğrenciyi hesabınıza bağladığınızda, tamamladığı testlerin veli ve öğrenci raporlarını veli
                panelinizde görürsünüz.
              </p>
              <div className="field max-w-xs">
                <label htmlFor="relation" className="field-label">
                  Yakınlığınız
                </label>
                <select id="relation" name="relation" required className="input" defaultValue="">
                  <option value="" disabled>
                    Seçin
                  </option>
                  <option value="mother">Annesi</option>
                  <option value="father">Babası</option>
                  <option value="legal_guardian">Yasal vasisi</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">
                  Hesabıma bağla
                </button>
              </div>
            </form>
          ) : viewer ? (
            <p className="text-ink-2">
              Şu anda <strong className="break-all">{viewer.email}</strong> adresiyle giriş yaptınız. Bu onay bağlantısı {maskEmail(req.email)}{' '}
              adresine gönderildi; öğrenciyi hesabınıza bağlamak için o adresle giriş yapın. Başka bir adres kullanmak istiyorsanız okulunuzun
              rehberlik servisinden kayıtlı veli e-postanızı değiştirmesini isteyin.
            </p>
          ) : (
            <>
              <p className="text-ink-2">
                Çocuğunuzun raporlarını ücretsiz veli hesabınızdan görebilirsiniz. Bunun için bu bağlantının gönderildiği{' '}
                <strong>{maskEmail(req.email)}</strong> adresiyle hesap açın ya da giriş yapın; ardından bu sayfaya dönersiniz.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/kayit?sonra=${encodeURIComponent(back)}`} className="btn btn-primary">
                  Hesap aç
                </Link>
                <Link href={`/giris?sonra=${encodeURIComponent(back)}`} className="btn btn-secondary">
                  Giriş yap
                </Link>
              </div>
            </>
          )}
        </section>
      )}

      <section className="flex flex-col gap-3" aria-labelledby="metinler">
        <h2 id="metinler" className="t-h3">
          Metinler
        </h2>
        <DocDetails title={notice.title} bodyMd={notice.bodyMd} />
        <DocDetails title={consentDoc.title} bodyMd={consentDoc.bodyMd} />
        <DocDetails title={researchDoc.title} bodyMd={researchDoc.bodyMd} />
      </section>

      {active && !req.canRevoke ? (
        <p className="notice notice-info">
          Rıza başka bir bağlantıdan verilmiş. Geri almak için rızayı verdiğiniz bağlantıyı kullanın ya da okulunuzun rehberlik servisine başvurun.
        </p>
      ) : active ? (
        <section className="panel flex flex-col gap-4 p-5" aria-labelledby="geri-al">
          <h2 id="geri-al" className="font-body text-base font-bold">
            Rızanızı geri almak isterseniz
          </h2>
          <p className="text-ink-2">
            Geri aldığınızda {req.studentFirstName} yeni test çözemez, sonuçlar hemen gizlenir ve bu rızaya dayanan ölçme verileri en geç 30 gün
            içinde silinir. Daha sonra yeniden onay verirseniz yeni uygulamalar yapılabilir; eski sonuçlar geri gelmez.
          </p>
          <div className="flex flex-wrap gap-3">
            <form action={action}>
              <input type="hidden" name="decision" value="revoke" />
              <button type="submit" className="btn btn-danger">
                Açık rızamı geri al
              </button>
            </form>
            {research && (
              <form action={action}>
                <input type="hidden" name="decision" value="revoke_research" />
                <button type="submit" className="btn btn-secondary">
                  Yalnızca araştırma katkısını geri al
                </button>
              </form>
            )}
          </div>
        </section>
      ) : !req.canDecide ? (
        <p className="notice notice-info">
          Bu bağlantıyla artık onay verilemez: süresi dolmuş ya da yerine yeni bir bağlantı gönderilmiş. Onay vermek isterseniz okulunuzun
          rehberlik servisinden yeni bir bağlantı isteyin.
        </p>
      ) : !open ? (
        <p className="notice notice-info">Okul bölümü şu an kapalı: bu bağlantıyla onay verilemez ve okulunuz bu platformda uygulama yapamaz.</p>
      ) : (
        <form action={action} className="panel flex flex-col gap-4 p-5 md:p-6">
          <h2 className="font-body text-base font-bold">Kararınız</h2>
          <label className="check">
            <input type="checkbox" name="notice" />
            <span>Aydınlatma metnini okudum, anladım.</span>
          </label>
          <label className="check">
            <input type="checkbox" name="guardian" />
            <span>{req.studentFirstName} adlı öğrencinin velisi ya da yasal temsilcisiyim.</span>
          </label>
          <label className="check">
            <input type="checkbox" name="research" />
            <span>
              İsteğe bağlı: Çocuğumun kimliği ayrılmış verilerinin, testlerin Türkiye normlarını ve geçerliğini geliştirmek için kullanılmasına
              da açık rıza veriyorum.
            </span>
          </label>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="submit" name="decision" value="grant" className="btn btn-primary">
              Açık rıza veriyorum
            </button>
            <button type="submit" name="decision" value="decline" className="btn btn-secondary">
              Onay vermiyorum
            </button>
          </div>
          <p className="t-meta">
            “Açık rıza veriyorum” düğmesi, açık rıza metninde yazan amaçlarla çocuğunuzun ölçme verilerinin işlenmesine izin verdiğiniz anlamına
            gelir. Kararınızı bu bağlantıdan dilediğiniz zaman değiştirebilirsiniz.
          </p>
        </form>
      )}
    </div>
  );
}
