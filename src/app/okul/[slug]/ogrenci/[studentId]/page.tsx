import Link from 'next/link';
import { notFound } from 'next/navigation';
import { removeStudentFromClassAction, unlinkGuardianAction, voidConsentAction } from '@/app/okul/actions';
import { studentAccess } from '@/lib/auth/dal';
import { GRADE_LABELS } from '@/lib/config';
import { hasActiveConsent, latestConsent } from '@/lib/consent';
import { studentAttempts } from '@/lib/panel/queries';
import { requireOrg } from '@/lib/school/access';
import { activeConsentSource, lastConsentRequest, lastGuardianEmailChange, linkedGuardians, studentClassesInOrg } from '@/lib/school/queries';
import { ConsentRequestForm } from '../../sinif/[classId]/forms';
import { SingleCodeIssuer } from './single-code';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const STATUS: Record<string, string> = {
  completed: 'Tamamlandı',
  in_progress: 'Devam ediyor',
  abandoned: 'Yarıda bırakıldı',
  invalidated: 'Geçersiz, silinecek',
};

export default async function CounselorStudentPage(props: PageProps<'/okul/[slug]/ogrenci/[studentId]'>) {
  const { slug, studentId } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireOrg(slug);
  if (!ctx.can.seeIndividual || !/^[0-9a-f-]{36}$/i.test(studentId)) notFound();
  const access = await studentAccess(studentId);
  if (!access.allowed || access.via !== 'counselor' || access.student.orgId !== ctx.org.id) notFound();
  const s = access.student;
  const [classesOf, consent, research, latest, request, list, guardians, emailChange, consentSource] = await Promise.all([
    studentClassesInOrg(studentId, ctx.org.id),
    hasActiveConsent(studentId, 'consent_assessment'),
    hasActiveConsent(studentId, 'consent_research'),
    latestConsent(studentId, 'consent_assessment'),
    lastConsentRequest(studentId),
    studentAttempts(studentId),
    linkedGuardians(studentId),
    lastGuardianEmailChange(studentId),
    activeConsentSource(studentId),
  ]);
  const guardianEmails = [...new Set(classesOf.map((c) => c.guardianEmail).filter((e): e is string => !!e))];
  const fromClass = typeof q.sinif === 'string' ? classesOf.find((c) => c.id === q.sinif) : undefined;
  const primaryClass = fromClass ?? classesOf[0];
  const completed = list.filter((a) => a.status === 'completed');
  // Onayı geçersiz sayma: onayın geldiği adres kayıtlardan silinir; yeni bağlantı, seçili sınıfta kalan
  // doğru adrese gider; adresi kayıtlarda kalmayan veli hesaplarının bağı kaldırılır.
  const sourceKey = consentSource?.email.toLowerCase() ?? null;
  const sourceOnFileIn = sourceKey ? classesOf.filter((c) => c.guardianEmail?.toLowerCase() === sourceKey) : [];
  const onFile = new Set(guardianEmails.map((e) => e.toLowerCase()));
  const onFileAfter = new Set([...onFile].filter((e) => e !== sourceKey));
  // Eylemle aynı seçim: önce seçili sınıftaki, yoksa başka bir sınıftaki (ada göre ilk) kayıtlı adres.
  const remaining = classesOf.filter((c) => c.guardianEmail && c.guardianEmail.toLowerCase() !== sourceKey);
  const resendFrom = remaining.find((c) => c.id === primaryClass?.id) ?? remaining[0];
  const resendTo = resendFrom?.guardianEmail ?? null;
  const willUnlink = guardians.filter((g) => !onFileAfter.has(g.email.toLowerCase()));

  const NOTICES: Record<string, { ok: boolean; text: string }> = {
    yenilendi: { ok: true, text: 'Önceki onay geçersiz sayıldı ve kayıtlı veli adresine yeni bir onay bağlantısı gönderildi.' },
    gecersiz: {
      ok: true,
      text: 'Önceki onay geçersiz sayıldı. Kayıtlı doğru bir veli adresi olmadığı için yeni bağlantı gönderilmedi; doğru adresi sınıf listesiyle aktardıktan sonra onay isteği gönderin.',
    },
    'onay-kutusu': { ok: false, text: 'Onayı geçersiz saymak için açıklamayı okuduğunuzu belirten kutuyu işaretleyin.' },
    'onay-yok': { ok: false, text: 'Öğrencinin geçerli bir veli onayı yok; geçersiz sayılacak bir onay bulunmuyor.' },
    'cok-deneme': { ok: false, text: 'Bu işlem az önce yapıldı ya da okulun bugünkü onay isteği sınırı doldu. Biraz sonra tekrar deneyin.' },
  };
  const notice = (typeof q.onay === 'string' && NOTICES[q.onay]) || (typeof q.hata === 'string' && NOTICES[q.hata]) || null;

  return (
    <div className="flex flex-col gap-10">
      {notice && (
        <p className={`notice ${notice.ok ? 'notice-ok' : 'notice-danger'}`} role="status">
          {notice.text}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {primaryClass ? (
          <Link href={`/okul/${slug}/sinif/${primaryClass.id}`} className="t-small">
            {primaryClass.name}
          </Link>
        ) : (
          <Link href={`/okul/${slug}`} className="t-small">
            Sınıflar
          </Link>
        )}
        <h1 className="t-h1">
          {s.firstName} {s.lastName ?? ''}
        </h1>
        <p className="text-ink-2">
          {GRADE_LABELS[s.grade]}
          {classesOf.length > 0 && ` · ${classesOf.map((c) => c.name).join(', ')}`}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel flex flex-col gap-3 p-6" aria-labelledby="onay">
          <h2 id="onay" className="t-h3">
            Veli onayı
          </h2>
          <p>
            {consent ? (
              <span className="chip chip-ok">Açık rıza verildi</span>
            ) : latest && !latest.granted ? (
              <span className="chip">Verilmedi ya da geri alındı</span>
            ) : (
              <span className="chip chip-brass">Bekleniyor</span>
            )}{' '}
            {latest && <span className="t-meta">{dateFmt.format(latest.createdAt)}</span>}
          </p>
          {research && <p className="t-small text-ink-2">Veli, araştırma çalışmalarına katkıya da onay verdi.</p>}
          <p className="t-small text-ink-2">
            Kayıtlı veli e-postası: <span className="break-all">{guardianEmails.length ? guardianEmails.join(', ') : 'yok'}</span>
            {emailChange && ` · ${dateFmt.format(emailChange.at)} tarihinde${emailChange.by ? ` ${emailChange.by} tarafından` : ''} değiştirildi`}
          </p>
          {request && (
            <p className="t-small text-ink-2">
              Son onay isteği {dateFmt.format(request.createdAt)} tarihinde {request.email} adresine gönderildi
              {request.respondedAt ? `; veli ${dateFmt.format(request.respondedAt)} tarihinde yanıtladı.` : '.'}
            </p>
          )}
          {!consent && primaryClass && (
            <ConsentRequestForm slug={slug} classId={primaryClass.id} studentId={studentId} label="Bu öğrencinin velisine onay isteği gönder" />
          )}
          {consent && primaryClass && (
            <details className="mt-1 border-t border-rule pt-3">
              <summary className="t-small cursor-pointer font-bold">Onay yanlış kişiden alındıysa</summary>
              <form action={voidConsentAction.bind(null, slug, studentId)} className="mt-3 flex flex-col gap-3">
                <input type="hidden" name="classId" value={primaryClass.id} />
                <p className="t-small text-ink-2">
                  Veli e-postası yanlış kaydedildiyse ve onayı başka biri verdiyse onayı geçersiz sayabilirsiniz. Bu onaya dayanan uygulamalar
                  geçersiz olur ve en geç 30 gün içinde silinir; yeni onay gelene kadar öğrenci test çözemez.
                </p>
                <ul className="t-small flex list-disc flex-col gap-1 pl-5 text-ink-2">
                  {consentSource && (
                    <li>
                      Geçerli onay <span className="break-all">{consentSource.email}</span>{' '}
                      {consentSource.via === 'link' ? 'adresine giden bağlantıyla verildi.' : 'adresli veli hesabından verildi.'}
                      {sourceOnFileIn.length > 0 &&
                        ` Bu adres ${sourceOnFileIn.length > 1 ? 'şu sınıfların' : 'şu sınıfın'} kayıtlarından silinecek: ${sourceOnFileIn.map((c) => c.name).join(', ')}.`}
                    </li>
                  )}
                  {resendTo ? (
                    <li>
                      Yeni onay bağlantısı <span className="break-all font-bold">{resendTo}</span> adresine gönderilecek
                      {resendFrom && resendFrom.id !== primaryClass.id ? ` (${resendFrom.name} kaydındaki adres).` : '.'}
                    </li>
                  ) : (
                    <li>
                      {primaryClass.name} için kayıtlı doğru bir veli adresi olmadığından yeni bağlantı gönderilmeyecek. Doğru adresi biliyorsanız
                      önce <Link href={`/okul/${slug}/sinif/${primaryClass.id}/aktar`}>listeyi doğru adresle yeniden aktarın</Link>; bilmiyorsanız
                      onayı şimdi geçersiz sayıp adresi sonra ekleyebilirsiniz.
                    </li>
                  )}
                  {willUnlink.length > 0 && (
                    <li>
                      Şu veli hesaplarının öğrenciyle bağı kaldırılacak: <span className="break-all">{willUnlink.map((g) => g.email).join(', ')}</span>
                    </li>
                  )}
                </ul>
                <label className="check">
                  <input type="checkbox" name="confirm" />
                  <span className="t-small">Onayın yanlış kişiden alındığını ve bu işlemin sonuçlarını anladım.</span>
                </label>
                <div>
                  <button type="submit" className="btn btn-secondary min-h-10">
                    {resendTo ? 'Onayı geçersiz say ve yeniden gönder' : 'Onayı geçersiz say'}
                  </button>
                </div>
              </form>
            </details>
          )}
          {guardians.length > 0 && (
            <div className="mt-1 flex flex-col gap-2 border-t border-rule pt-3">
              <p className="font-bold">Bağlı veli hesapları</p>
              <ul className="flex flex-col gap-2">
                {guardians.map((g) => (
                  <li key={g.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="t-small min-w-0">
                      {g.fullName} <span className="break-all text-ink-2">· {g.email}</span>{' '}
                      <span className="t-meta">· {dateFmt.format(g.createdAt)}</span>
                      {!onFile.has(g.email.toLowerCase()) && (
                        <span className="t-meta block">
                          {g.email.toLowerCase() === sourceKey
                            ? 'Geçerli onayı bu adres verdi ama adres okulun kayıtlarında artık yok. Adres yanlış kişiye aitse onayı geçersiz sayın.'
                            : 'Bu adres, okulun kayıtlı veli adresleri arasında artık yok.'}
                        </span>
                      )}
                    </span>
                    <form action={unlinkGuardianAction.bind(null, slug, studentId)}>
                      <input type="hidden" name="guardianshipId" value={g.id} />
                      <button type="submit" className="btn btn-quiet min-h-9 px-2 text-[0.9rem]">
                        Bağlantıyı kaldır
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
              <p className="t-meta">Bağlı veli, çocuğunun raporlarını kendi hesabından görür. Tanımadığınız bir hesap varsa bağlantıyı kaldırın.</p>
            </div>
          )}
        </section>

        <section className="panel flex flex-col gap-3 p-6" aria-labelledby="kod">
          <h2 id="kod" className="t-h3">
            Giriş kodu
          </h2>
          <p className="t-small text-ink-2">
            Kodlar güvenlik için yalnızca oluşturulduğunda gösterilir. Öğrenci kodunu kaybettiyse yeni kod üretin; eski kod geçersiz olur.
          </p>
          {primaryClass && <SingleCodeIssuer slug={slug} classId={primaryClass.id} studentId={studentId} />}
        </section>
      </div>

      <section aria-labelledby="sonuclar" className="flex flex-col gap-4">
        <h2 id="sonuclar" className="t-h2">
          Uygulamalar
        </h2>
        {list.length === 0 ? (
          <p className="text-ink-2">Henüz uygulama yok.</p>
        ) : (
          <ul className="panel divide-y divide-rule">
            {list.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <span>
                  <span className="font-bold">{a.name}</span>{' '}
                  <span className="t-meta">
                    · {STATUS[a.status] ?? a.status} · {dateFmt.format(a.completedAt ?? a.startedAt)}
                  </span>
                </span>
                {a.status === 'completed' && consent && (
                  <Link href={`/okul/${slug}/rapor/${a.id}`} className="btn btn-secondary min-h-10">
                    Raporu aç
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
        {completed.length > 0 && !consent && (
          <p className="notice notice-info">
            Velinin geçerli bir açık rızası olmadığı için sonuçlar gösterilmez. Rıza geri alındıysa ölçme verileri en geç 30 gün içinde silinir.
          </p>
        )}
        {list.some((a) => a.status === 'invalidated') && (
          <p className="t-meta">
            “Geçersiz” uygulamalar, veli rızasını geri aldığı ya da onay geçersiz sayıldığı için kullanılmaz; rıza yeniden verilse de geri
            gelmez ve en geç 30 gün içinde silinir.
          </p>
        )}
        {completed.length > 0 && consent && (
          <p className="t-meta">Her rapor görüntülemesi, KVKK gereği kimin ne zaman baktığıyla birlikte denetim kaydına yazılır.</p>
        )}
      </section>

      {classesOf.length > 0 && (
        <details className="panel p-6">
          <summary className="cursor-pointer font-bold">Sınıftan çıkar</summary>
          <p className="measure mt-3 text-ink-2">
            Öğrenci sınıf listesinden çıkarılır; kaydı ve sonuçları silinmez. Sonuçların silinmesi yalnızca velinin rızasını geri almasıyla ya da
            veli başvurusuyla yapılır.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {classesOf.map((c) => (
              <form key={c.id} action={removeStudentFromClassAction.bind(null, slug, c.id)}>
                <input type="hidden" name="studentId" value={studentId} />
                <button type="submit" className="btn btn-secondary">
                  {c.name} listesinden çıkar
                </button>
              </form>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
