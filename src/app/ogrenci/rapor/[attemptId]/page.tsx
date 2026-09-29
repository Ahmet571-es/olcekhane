import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/report/print-button';
import { ReportView } from '@/components/report/report-view';
import { generateReports, getAttempt, getReport } from '@/lib/assessment/service';
import { audit } from '@/lib/audit';
import { requireStudent } from '@/lib/auth/dal';
import { hasActiveConsent } from '@/lib/consent';

export const metadata: Metadata = { title: 'Raporum', robots: { index: false, follow: false } };

export default async function StudentReportPage(props: PageProps<'/ogrenci/rapor/[attemptId]'>) {
  const { attemptId } = await props.params;
  const student = await requireStudent(`/ogrenci/rapor/${attemptId}`);
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) notFound();
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'completed' || attempt.studentId !== student.id) notFound();
  if (!(await hasActiveConsent(student.id, 'consent_assessment'))) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Link href="/ogrenci" className="t-small">
          Sayfama dön
        </Link>
        <h1 className="t-h1">Rapor şu anda gösterilemiyor</h1>
        <p className="text-ink-2">Velinin onayı olmadığı için raporların gösterilemiyor. Merak ettiğin bir şey varsa ailene ya da rehber öğretmenine sorabilirsin.</p>
      </div>
    );
  }
  let report = await getReport(attemptId, 'student');
  if (!report) {
    await generateReports(attemptId);
    report = await getReport(attemptId, 'student');
  }
  if (!report) notFound();
  await audit({ actorStudentId: student.id, action: 'report.view', entity: 'attempt', entityId: attemptId, meta: { via: 'self', audience: 'student' } });
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/ogrenci" className="t-small">
          Sayfama dön
        </Link>
        <PrintButton />
      </div>
      <ReportView report={report} />
    </div>
  );
}
