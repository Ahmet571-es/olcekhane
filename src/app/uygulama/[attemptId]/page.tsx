import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { LogoMark } from '@/components/site/logo';
import { LikertRunner } from '@/components/runner/likert-runner';
import { ReadingRunner } from '@/components/runner/reading-runner';
import { TaskRunner } from '@/components/runner/tasks/task-runner';
import { AssessmentError, loadRunnerState, taskProgress } from '@/lib/assessment/service';
import { studentAccess } from '@/lib/auth/dal';
import { getSession } from '@/lib/auth/session';
import { currentDocument, hasActiveConsent } from '@/lib/consent';
import { renderMarkdown } from '@/lib/markdown';
import { passageForGrade } from '@/lib/scoring/reading';

export default async function RunnerPage(props: PageProps<'/uygulama/[attemptId]'>) {
  const { attemptId } = await props.params;
  const session = await getSession();
  if (!session) redirect(`/giris?sonra=${encodeURIComponent(`/uygulama/${attemptId}`)}`);
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) notFound();

  let state: Awaited<ReturnType<typeof loadRunnerState>>;
  try {
    state = await loadRunnerState(attemptId);
  } catch (err) {
    if (err instanceof AssessmentError) notFound();
    throw err;
  }
  const { attempt, def } = state;
  const access = await studentAccess(attempt.studentId);
  if (!access.allowed || access.via === 'admin') notFound();

  const self = access.via === 'self';
  const exitUrl = self ? '/ogrenci' : `/panel/cocuk/${attempt.studentId}`;
  const reportUrl = self ? `/ogrenci/rapor/${attemptId}` : `/panel/rapor/${attemptId}`;
  if (attempt.status === 'completed') redirect(reportUrl);

  const doneBlocks = def.engine === 'tasks' ? await taskProgress(attemptId) : [];
  const needsAssent = !(await hasActiveConsent(attempt.studentId, 'child_info'));
  const childInfo = needsAssent ? await currentDocument('child_info') : null;
  const assentHtml = childInfo ? renderMarkdown(childInfo.bodyMd) : null;

  return (
    <>
      <header className="border-b border-rule bg-surface">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size={28} />
            <span className="font-bold">{def.name}</span>
          </div>
          <Link href={exitUrl} className="btn btn-quiet min-h-10">
            Ara ver
          </Link>
        </div>
      </header>
      <main id="icerik" className="container-page flex flex-1 flex-col py-8 md:py-12">
        {attempt.status !== 'in_progress' ? (
          <div className="mx-auto max-w-xl text-center">
            <h1 className="t-h2">Bu uygulama kapatılmış</h1>
            <p className="mt-3 text-ink-2">Testi yeniden başlatmak için profil sayfasına dönün.</p>
            <Link href={exitUrl} className="btn btn-primary mt-6">
              Profil sayfasına dön
            </Link>
          </div>
        ) : def.engine === 'likert' ? (
          <LikertRunner
            attemptId={attemptId}
            studentName={access.student.firstName}
            intro={def.intro}
            prompt={def.prompt}
            options={def.options}
            items={def.items.map((i) => ({ key: i.key, text: i.text }))}
            minAnswered={Math.ceil(def.items.length * def.scoring.minAnsweredRatio)}
            initialAnswers={Object.fromEntries(
              state.answered.filter((a) => a.value !== null).map((a) => [a.itemKey, a.value as number]),
            )}
            assentHtml={assentHtml}
            reportUrl={reportUrl}
            exitUrl={exitUrl}
          />
        ) : def.engine === 'tasks' ? (
          <TaskRunner
            attemptId={attemptId}
            studentName={access.student.firstName}
            intro={def.intro}
            tasks={def.tasks}
            doneBlocks={doneBlocks}
            assentHtml={assentHtml}
            reportUrl={reportUrl}
            exitUrl={exitUrl}
          />
        ) : (
          (() => {
            const p = passageForGrade(def, attempt.gradeAtAttempt);
            return (
              <ReadingRunner
                attemptId={attemptId}
                studentName={access.student.firstName}
                intro={def.intro}
                passage={{
                  key: p.key,
                  title: p.title,
                  paragraphs: p.paragraphs,
                  questions: p.questions.map((q) => ({ key: q.key, text: q.text, options: q.options })),
                }}
                assentHtml={assentHtml}
                reportUrl={reportUrl}
                exitUrl={exitUrl}
              />
            );
          })()
        )}
      </main>
    </>
  );
}
