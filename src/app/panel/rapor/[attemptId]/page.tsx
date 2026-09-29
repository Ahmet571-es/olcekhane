import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/report/print-button';
import { ReportView } from '@/components/report/report-view';
import { generateReports, getAttempt, getReport } from '@/lib/assessment/service';
import { audit } from '@/lib/audit';
import { requireUser, studentAccess } from '@/lib/auth/dal';
import { hasActiveConsent } from '@/lib/consent';

export const metadata: Metadata = { title: 'Rapor', robots: { index: false, follow: false } };

export default async function ReportPage(props: PageProps<'/panel/rapor/[attemptId]'>) {
  const { attemptId } = await props.params;
  const q = await props.searchParams;
  const user = await requireUser(`/panel/rapor/${attemptId}`);
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) notFound();
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.status !== 'completed') notFound();
  const access = await studentAccess(attempt.studentId);
  // Veli paneli yalnızca velinin (ve denetim için platform yöneticisinin) raporudur; rehber öğretmen
  // raporları okul panelinden, rıza denetimiyle açar.
  if (!access.allowed || (access.via !== 'guardian' && access.via !== 'admin')) notFound();

  const consent = await hasActiveConsent(attempt.studentId, 'consent_assessment');
  // Rıza geri alınmış verileri yalnızca veli (kendi erişim hakkı için) silinene kadar görebilir.
  if (!consent && access.via !== 'guardian') notFound();
  const audience = q.gorunum === 'ogrenci' ? 'student' : 'parent';
  let report = await getReport(attemptId, audience);
  if (!report) {
    await generateReports(attemptId);
    report = await getReport(attemptId, audience);
  }
  if (!report) notFound();

  await audit({
    actorUserId: user.id,
    action: 'report.view',
    entity: 'attempt',
    entityId: attemptId,
    meta: { via: access.via, audience },
  });

  const base = `/panel/rapor/${attemptId}`;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/panel/cocuk/${attempt.studentId}`} className="t-small">
          {access.student.firstName} profiline dön
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Rapor görünümü" className="inline-flex rounded-lg border border-rule-strong p-1">
            <Link
              href={base}
              aria-current={audience === 'parent' ? 'page' : undefined}
              className={`rounded-md px-3.5 py-1.5 text-[0.95rem] font-bold no-underline ${audience === 'parent' ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
            >
              Veli raporu
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
      {!consent && (
        <p className="notice notice-warn print:hidden">
          Bu öğrenci için geçerli bir açık rıza yok. Rıza geri alındıysa bu sonuçlar en geç 30 gün içinde kalıcı olarak silinir; bu sürede okul
          sonuçları göremez.
        </p>
      )}
      {audience === 'student' && (
        <p className="notice notice-info print:hidden">
          Bu, {access.student.firstName} için yazılmış sürüm. Raporu birlikte okumanızı öneririz; çocuğunuzun yorumlarını dinlemek sonucu anlamanın en iyi yoludur.
        </p>
      )}
      <ReportView report={report} />
    </div>
  );
}
