import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { LogoMark } from '@/components/site/logo';
import { LikertRunner } from '@/components/runner/likert-runner';
import { QuizRunner } from '@/components/runner/quiz-runner';
import { ReadingRunner } from '@/components/runner/reading-runner';
import { TaskRunner } from '@/components/runner/tasks/task-runner';
import { AssessmentError, loadRunnerState, taskProgress } from '@/lib/assessment/service';
import { requireAccountsOpen, studentAccess } from '@/lib/auth/dal';
import { getSession } from '@/lib/auth/session';
import { currentDocument, hasActiveConsent } from '@/lib/consent';
import type { InstrumentDef } from '@/lib/instruments/types';
import { renderMarkdown } from '@/lib/markdown';
import { formForGrade, isQuizChoice, type QuizChoice } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';

type RunnerState = Awaited<ReturnType<typeof loadRunnerState>>;

/** Hesapla çözülen testlerde cevaplar tek tek kaydedilir; ara verip kaldığı yerden sürdürülebilir. */
const PAUSE_NOTE = 'İstediğin an ara verebilirsin; cevapların kaydedilir ve sonra kaldığın yerden devam edersin.';
const withPauseNote = (intro: InstrumentDef['intro']) => ({ ...intro, paragraphs: [...intro.paragraphs, PAUSE_NOTE] });
type RunnerCommon = {
  attemptId: string;
  studentName: string;
  assentHtml: string | null;
  reportUrl: string;
  exitUrl: string;
};

/** Motor türüne göre test ekranı. Tarayıcıya yalnızca öğrencinin görmesi gerekenler gönderilir. */
function Runner({ def, state, doneBlocks, common }: { def: InstrumentDef; state: RunnerState; doneBlocks: string[]; common: RunnerCommon }) {
  switch (def.engine) {
    case 'likert':
      return (
        <LikertRunner
          {...common}
          intro={withPauseNote(def.intro)}
          prompt={def.prompt}
          options={def.options}
          items={def.items.map((i) => ({ key: i.key, text: i.text }))}
          minAnswered={Math.ceil(def.items.length * def.scoring.minAnsweredRatio)}
          initialAnswers={Object.fromEntries(state.answered.filter((a) => a.value !== null).map((a) => [a.itemKey, a.value as number]))}
        />
      );
    case 'tasks':
      return <TaskRunner {...common} intro={def.intro} tasks={def.tasks} doneBlocks={doneBlocks} />;
    case 'quiz': {
      const form = formForGrade(def, state.attempt.gradeAtAttempt);
      const initial: Record<string, QuizChoice> = {};
      for (const a of state.answered) if (isQuizChoice(a.valueText)) initial[a.itemKey] = a.valueText;
      return (
        <QuizRunner
          {...common}
          intro={withPauseNote(def.intro)}
          contentGrade={form.contentGrade}
          items={form.items.map((it) => ({
            key: it.key,
            text: it.text,
            table: it.table,
            chart: it.chart,
            figure: it.figure,
            options: it.options.map((o) => ({ key: o.key, text: o.text })),
          }))}
          initialAnswers={initial}
        />
      );
    }
    case 'reading': {
      const p = passageForGrade(def, state.attempt.gradeAtAttempt);
      return (
        <ReadingRunner
          {...common}
          intro={def.intro}
          passage={{
            key: p.key,
            title: p.title,
            paragraphs: p.paragraphs,
            questions: p.questions.map((q) => ({ key: q.key, text: q.text, options: q.options })),
          }}
        />
      );
    }
  }
}

export default async function RunnerPage(props: PageProps<'/uygulama/[attemptId]'>) {
  requireAccountsOpen();
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
        ) : (
          <Runner
            def={def}
            state={state}
            doneBlocks={doneBlocks}
            common={{ attemptId, studentName: access.student.firstName, assentHtml, reportUrl, exitUrl }}
          />
        )}
      </main>
    </>
  );
}
