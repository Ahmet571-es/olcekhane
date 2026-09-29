import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/report/print-button';
import { ReportView } from '@/components/report/report-view';
import { generateReports, getAttempt, getReport } from '@/lib/assessment/service';
import { audit } from '@/lib/audit';
import { studentAccess } from '@/lib/auth/dal';
import { hasActiveConsent } from '@/lib/consent';
import { requireOrg } from '@/lib/school/access';

/** Rehber öğretmenin bireysel rapor görünümü. Her görüntüleme denetim kaydına yazılır. */
export default async function CounselorReportPage(props: PageProps<'/okul/[slug]/rapor/[attemptId]'>) {
  const { slug, attemptId } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireOrg(slug);
  if (!ctx.can.seeIndividual || !/^[0-9a-f-]{36}$/i.test(attemptId)) notFound();
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'completed') notFound();
  const access = await studentAccess(attempt.studentId);
  if (!access.allowed || access.via !== 'counselor' || access.student.orgId !== ctx.org.id) notFound();
  // Veli rızasını geri aldıysa (ya da hiç vermediyse) okul bireysel sonuçları artık göremez.
  if (!(await hasActiveConsent(attempt.studentId, 'consent_assessment'))) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Link href={`/okul/${slug}/ogrenci/${attempt.studentId}`} className="t-small">
          {access.student.firstName} {access.student.lastName ?? ''}
        </Link>
        <h1 className="t-h1">Rapor görüntülenemiyor</h1>
        <p className="text-ink-2">
          Velinin geçerli bir açık rızası olmadığı için bu öğrencinin sonuçları gösterilmez. Rıza geri alındıysa ölçme verileri en geç 30 gün
          içinde silinir.
        </p>
      </div>
    );
  }

  const audience = q.gorunum === 'ogrenci' ? 'student' : 'parent';
  let report = await getReport(attemptId, audience);
  if (!report) {
    await generateReports(attemptId);
    report = await getReport(attemptId, audience);
  }
  if (!report) notFound();
  await audit({
    actorUserId: ctx.user.id,
    action: 'report.view',
    entity: 'attempt',
    entityId: attemptId,
    meta: { via: 'counselor', orgId: ctx.org.id, audience },
  });

  const base = `/okul/${slug}/rapor/${attemptId}`;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/okul/${slug}/ogrenci/${attempt.studentId}`} className="t-small">
          {access.student.firstName} {access.student.lastName ?? ''}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Rapor görünümü" className="inline-flex rounded-lg border border-rule-strong p-1">
            <Link
              href={base}
              aria-current={audience === 'parent' ? 'page' : undefined}
              className={`rounded-md px-3.5 py-1.5 text-[0.95rem] font-bold no-underline ${audience === 'parent' ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
            >
              Yetişkin raporu
            </Link>
            <Link
              href={`${base}?gorunum=ogrenci`}
              aria-current={audience === 'student' ? 'page' : undefined}
              className={`rounded-md px-3.5 py-1.5 text-[0.95rem] font-bold no-underline ${audience === 'student' ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
            >
              Öğrenci raporu
            </Link>
          </nav>
          <PrintButton />
        </div>
      </div>
      <p className="notice notice-info print:hidden">
        Bu rapor gizlidir ve yalnızca rehberlik çalışması için kullanılmalıdır. Sonuçları öğrenciyle ve veliyle konuşurken bir tanı gibi değil,
        tanıma sürecinin bir parçası olarak ele alın.
      </p>
      <ReportView report={report} />
    </div>
  );
}
