import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicInstruments } from '@/content/instruments';
import { requireUser, studentAccess } from '@/lib/auth/dal';
import { DOMAIN_LABELS, GRADE_LABELS } from '@/lib/config';
import { currentDocument, hasActiveConsent } from '@/lib/consent';
import { renderMarkdown } from '@/lib/markdown';
import { studentAttempts } from '@/lib/panel/queries';
import { fillCompany } from '@/lib/site';
import { deleteChildAction, setConsentAction, startTestAction } from '../../actions';
import { EditChildForm } from './edit-child-form';

export const metadata: Metadata = { title: 'Çocuk profili' };

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const ERRORS: Record<string, string> = {
  no_consent: 'Test başlatmak için önce açık rıza vermeniz gerekiyor.',
  grade: 'Bu test çocuğunuzun sınıf düzeyine uygun değil.',
  not_available: 'Bu test şu anda uygulanmıyor.',
  no_entitlement: 'Bu test için kullanım hakkınız bulunmuyor.',
  dogrulama: 'Test başlatmadan önce e-posta adresinizi doğrulamanız gerekiyor. Panel ana sayfasından doğrulama bağlantısını yeniden isteyebilirsiniz.',
  onay: 'Açık rıza vermek için metni okuduğunuzu belirten kutuyu işaretleyin.',
  'silme-onayi': 'Profili silmek için kutuya büyük harflerle SİL yazın.',
};

export default async function ChildPage(props: PageProps<'/panel/cocuk/[id]'>) {
  const { id } = await props.params;
  const q = await props.searchParams;
  const user = await requireUser(`/panel/cocuk/${id}`);
  const access = await studentAccess(id);
  if (!access.allowed || access.via !== 'guardian') notFound();
  const child = access.student;

  const [consent, research, attemptsList, consentDoc] = await Promise.all([
    hasActiveConsent(id, 'consent_assessment'),
    hasActiveConsent(id, 'consent_research'),
    studentAttempts(id),
    currentDocument('consent_assessment'),
  ]);
  const tests = publicInstruments().filter((t) => child.grade >= t.minGrade && child.grade <= t.maxGrade);
  const completed = attemptsList.filter((a) => a.status === 'completed');
  const error = typeof q.hata === 'string' ? ERRORS[q.hata] : undefined;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Link href="/panel" className="t-small">
          Çocuklarım
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="t-h1">
              {child.firstName} {child.lastName ?? ''}
            </h1>
            <p className="mt-1 text-ink-2">{GRADE_LABELS[child.grade]}</p>
          </div>
        </div>
        {q.yeni === '1' && (
          <p className="notice notice-ok">
            Profil oluşturuldu.{' '}
            {consent ? 'Aşağıdan ilk testi başlatabilirsiniz.' : 'Test başlatmak için aşağıdan açık rıza verebilirsiniz.'}
          </p>
        )}
        {q.riza === 'verildi' && <p className="notice notice-ok">Açık rızanız kaydedildi.</p>}
        {q.riza === 'geri-alindi' && (
          <p className="notice notice-ok">Açık rızanız geri alındı. Bu rızaya dayanan veriler en geç 30 gün içinde silinecek.</p>
        )}
        {error && <p className="notice notice-danger">{error}</p>}
      </div>

      {!consent && (
        <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="riza">
          <h2 id="riza" className="t-h2">
            Açık rıza gerekiyor
          </h2>
          <p className="measure text-ink-2">
            {child.firstName} test çözebilmeden önce, ölçme verilerinin işlenmesi için açık rızanızı istiyoruz.
          </p>
          <details className="rounded-lg border border-rule p-5">
            <summary className="cursor-pointer font-bold">{consentDoc.title}</summary>
            <div className="prose-olc t-small mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(fillCompany(consentDoc.bodyMd)) }} />
          </details>
          <form action={setConsentAction} className="flex flex-col gap-4">
            <input type="hidden" name="studentId" value={id} />
            <input type="hidden" name="kind" value="consent_assessment" />
            <input type="hidden" name="grant" value="1" />
            <label className="check">
              <input type="checkbox" name="confirm" required />
              <span>
                Açık rıza metnini okudum. Çocuğumun ölçme verilerinin bu metinde belirtilen amaçlarla işlenmesine açık rıza veriyorum.
              </span>
            </label>
            <div>
              <button type="submit" className="btn btn-primary">
                Açık rıza ver
              </button>
            </div>
          </form>
        </section>
      )}

      <section aria-labelledby="testler" className="flex flex-col gap-5">
        <div>
          <h2 id="testler" className="t-h2">
            {GRADE_LABELS[child.grade]} için testler
          </h2>
          <p className="measure mt-1 text-ink-2">
            Testi başlattığınızda cihazı çocuğunuza verin. Sessiz bir ortam ve acele etmeden çözmek en doğru sonucu verir.
          </p>
        </div>
        {!user.emailVerified && (
          <p className="notice notice-warn">Test başlatmak için önce e-posta adresinizi doğrulayın.</p>
        )}
        <ul className="panel divide-y divide-rule">
          {tests.map((t) => {
            const open = attemptsList.find((a) => a.slug === t.slug && a.status === 'in_progress');
            const done = completed.filter((a) => a.slug === t.slug);
            const disabled = !consent || !user.emailVerified;
            return (
              <li key={t.slug} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-xl font-bold">{t.name}</p>
                    {t.status === 'pilot' && <span className="chip chip-brass">Pilot</span>}
                  </div>
                  <p className="measure text-ink-2">{t.tagline}</p>
                  <p className="t-meta">
                    {DOMAIN_LABELS[t.domain]} · yaklaşık {t.estimatedMinutes} dakika
                    {done.length > 0 && ` · ${done.length} kez çözüldü`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {done[0] && (
                    <Link href={`/panel/rapor/${done[0].id}`} className="btn btn-secondary">
                      Son raporu aç
                    </Link>
                  )}
                  <form action={startTestAction}>
                    <input type="hidden" name="studentId" value={id} />
                    <input type="hidden" name="slug" value={t.slug} />
                    <button type="submit" className="btn btn-primary" disabled={disabled} aria-disabled={disabled}>
                      {open ? 'Kaldığı yerden devam et' : done.length ? 'Yeniden çöz' : 'Testi başlat'}
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="t-meta">
          Yeni testler ekleniyor. Tüm testleri ve bilimsel dayanaklarını <Link href="/testler">testler sayfasında</Link> görebilirsiniz.
        </p>
      </section>

      <section aria-labelledby="sonuclar" className="flex flex-col gap-5">
        <h2 id="sonuclar" className="t-h2">
          Sonuçlar
        </h2>
        {completed.length === 0 ? (
          <p className="text-ink-2">Henüz tamamlanmış test yok. Test bitince rapor burada görünecek.</p>
        ) : (
          <ul className="panel divide-y divide-rule">
            {completed.map((a) => (
              <li key={a.id}>
                <Link href={`/panel/rapor/${a.id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 no-underline hover:bg-surface-2">
                  <span className="font-bold">{a.name}</span>
                  <span className="t-meta">{dateFmt.format(a.completedAt!)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ayarlar" className="flex flex-col gap-5">
        <h2 id="ayarlar" className="t-h2">
          Profil ve izinler
        </h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="panel flex flex-col gap-4 p-6">
            <h3 className="t-h3">Profil bilgileri</h3>
            <EditChildForm studentId={id} firstName={child.firstName} lastName={child.lastName ?? ''} grade={child.grade} />
          </div>
          <div className="panel flex flex-col gap-4 p-6">
            <h3 className="t-h3">Açık rızalar</h3>
            <ConsentRow
              studentId={id}
              kind="consent_assessment"
              active={consent}
              title="Ölçme verilerinin işlenmesi"
              revokeNote="Geri alırsanız yeni test çözülemez ve ölçme verileri 30 gün içinde silinir."
            />
            <ConsentRow
              studentId={id}
              kind="consent_research"
              active={research}
              title="Norm ve geçerlik çalışmalarına katkı (isteğe bağlı)"
              revokeNote="Geri alırsanız veriler yeni çalışmalara dahil edilmez."
              disabled={!consent}
            />
          </div>
        </div>
        <details className="panel p-6">
          <summary className="cursor-pointer font-bold text-danger">Profili sil</summary>
          <form action={deleteChildAction} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="studentId" value={id} />
            <p className="measure">
              Profil ve bütün test sonuçları silinir. Bu işlem geri alınamaz. Onaylamak için kutuya büyük harflerle <strong>SİL</strong> yazın.
            </p>
            <input name="confirm" className="input max-w-48" aria-label="Onay" autoComplete="off" />
            <div>
              <button type="submit" className="btn btn-danger">
                Profili ve verileri sil
              </button>
            </div>
          </form>
        </details>
      </section>
    </div>
  );
}

function ConsentRow({
  studentId,
  kind,
  active,
  title,
  revokeNote,
  disabled,
}: {
  studentId: string;
  kind: string;
  active: boolean;
  title: string;
  revokeNote: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-rule pt-4 first-of-type:border-t-0 first-of-type:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">{title}</p>
        {active ? <span className="chip chip-ok">Verildi</span> : <span className="chip">Verilmedi</span>}
      </div>
      {active ? (
        <form action={setConsentAction} className="flex flex-col gap-2">
          <input type="hidden" name="studentId" value={studentId} />
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="grant" value="0" />
          <p className="t-meta">{revokeNote}</p>
          <div>
            <button type="submit" className="btn btn-secondary min-h-10">
              Rızayı geri al
            </button>
          </div>
        </form>
      ) : (
        !disabled &&
        kind === 'consent_research' && (
          <form action={setConsentAction} className="flex flex-col gap-2">
            <input type="hidden" name="studentId" value={studentId} />
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="grant" value="1" />
            <label className="check t-small">
              <input type="checkbox" name="confirm" required />
              <span>
                <Link href="/yasal/acik-riza-arastirma" target="_blank">
                  Araştırma rıza metnini
                </Link>{' '}
                okudum ve açık rıza veriyorum.
              </span>
            </label>
            <div>
              <button type="submit" className="btn btn-secondary min-h-10">
                Rıza ver
              </button>
            </div>
          </form>
        )
      )}
    </div>
  );
}
