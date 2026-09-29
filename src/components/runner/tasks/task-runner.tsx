'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { childAssentAction } from '@/app/uygulama/actions';
import type { CognitiveTask } from '@/lib/instruments/types';
import { AssentStep, IntroStep } from '../likert-runner';
import { Cancellation } from './cancellation';
import { useLeaveWarning } from './common';
import { DigitSpan } from './digit-span';
import { Flanker } from './flanker';
import { SpatialSpan } from './spatial-span';
import { SymbolMatch } from './symbol-match';

type Phase = 'assent' | 'intro' | 'task-intro' | 'task' | 'saving' | 'between' | 'finishing';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function TaskSteps({ tasks, done, current }: { tasks: CognitiveTask[]; done: Set<string>; current: number }) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Görevler">
      {tasks.map((t, i) => {
        const isDone = done.has(t.key);
        const isCurrent = i === current && !isDone;
        return (
          <li
            key={t.key}
            className={`chip ${isDone ? 'chip-ok' : isCurrent ? 'chip-brass' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {isDone ? '✓ ' : `${i + 1}. `}
            {t.name}
          </li>
        );
      })}
    </ol>
  );
}

export function TaskRunner(props: {
  attemptId: string;
  studentName: string;
  intro: { title: string; paragraphs: string[] };
  tasks: CognitiveTask[];
  doneBlocks: string[];
  assentHtml: string | null;
  reportUrl: string;
  exitUrl: string;
}) {
  const { tasks, attemptId } = props;
  const router = useRouter();
  const [done, setDone] = useState(() => new Set(props.doneBlocks));
  const [phase, setPhase] = useState<Phase>(props.assentHtml ? 'assent' : 'intro');
  const [fatal, setFatal] = useState<string | null>(null);
  const current = tasks.findIndex((t) => !done.has(t.key));
  const task = current === -1 ? null : tasks[current];

  useLeaveWarning(phase === 'task' || phase === 'saving');

  async function save(block: string, trials: unknown[]) {
    setPhase('saving');
    let backoff = 800;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const res = await fetch(`/api/attempts/${attemptId}/task`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ block, trials }),
        });
        if (res.status === 401) {
          setFatal('Oturumun süresi dolmuş. Tamamladığın görevler kaydedildi; devam etmek için yeniden giriş yapılması gerekiyor.');
          return;
        }
        if (res.status === 409) {
          setFatal('Bu uygulama başka bir sekmede tamamlanmış ya da kapatılmış.');
          return;
        }
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          if (res.status === 400) {
            setFatal(j.error ?? 'Görev kaydedilemedi.');
            return;
          }
          throw new Error(String(res.status));
        }
        const next = new Set(done);
        next.add(block);
        setDone(next);
        setPhase(next.size >= tasks.length ? 'finishing' : 'between');
        if (next.size >= tasks.length) void finish();
        return;
      } catch {
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 8000);
      }
    }
    setFatal('Bağlantı sorunu nedeniyle görev kaydedilemedi. İnternet bağlantını kontrol edip sayfayı yenile; bu görevi yeniden yapman gerekebilir.');
  }

  async function finish() {
    setPhase('finishing');
    try {
      const res = await fetch(`/api/attempts/${attemptId}/complete`, { method: 'POST' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'Sonuçlar hesaplanamadı.');
      }
      router.replace(props.reportUrl);
    } catch (err) {
      setFatal(err instanceof Error ? err.message : 'Sonuçlar hesaplanamadı. Lütfen tekrar deneyin.');
    }
  }

  if (fatal) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <p className="notice notice-danger">{fatal}</p>
        <a href={props.exitUrl} className="btn btn-secondary self-start">
          Geri dön
        </a>
      </div>
    );
  }

  if (phase === 'assent' && props.assentHtml) {
    return (
      <AssentStep
        html={props.assentHtml}
        name={props.studentName}
        exitUrl={props.exitUrl}
        onAccept={async () => {
          await childAssentAction(attemptId);
          setPhase('intro');
        }}
      />
    );
  }

  if (phase === 'intro') {
    const resuming = done.size > 0;
    return (
      <IntroStep
        title={props.intro.title}
        paragraphs={resuming ? [`${done.size} görevi tamamlamışsın. Kaldığın yerden devam edebilirsin.`] : props.intro.paragraphs}
        cta={resuming ? 'Kaldığın yerden devam et' : 'Başla'}
        onStart={() => {
          if (!task) void finish();
          else setPhase('task-intro');
        }}
      />
    );
  }

  if (phase === 'finishing' || !task) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h1 className="t-h1">Bütün görevleri bitirdin!</h1>
        <p className="text-lg text-ink-2">Sonuçların hesaplanıyor…</p>
      </div>
    );
  }

  if (phase === 'between') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <TaskSteps tasks={tasks} done={done} current={current} />
        <h1 className="t-h1">Harika, bir görevi daha bitirdin.</h1>
        <p className="text-lg">
          Sıradaki görev: <strong>{task.name}</strong>. İstersen biraz dinlenebilirsin; hazır olduğunda devam et.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" autoFocus onClick={() => setPhase('task-intro')}>
            Sonraki göreve geç
          </button>
          <a href={props.exitUrl} className="btn btn-secondary btn-lg">
            Ara ver, sonra devam et
          </a>
        </div>
      </div>
    );
  }

  if (phase === 'task-intro') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <TaskSteps tasks={tasks} done={done} current={current} />
        <div className="flex flex-col gap-2">
          <p className="t-meta">
            Görev {current + 1} / {tasks.length}
          </p>
          <h1 className="t-h1">{task.name}</h1>
          <p className="text-lg text-ink-2">{task.measures}</p>
        </div>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-lg">
          {task.instructions.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div>
          <button type="button" className="btn btn-primary btn-lg" autoFocus onClick={() => setPhase('task')}>
            Anladım
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'saving') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
        <p className="text-lg" aria-live="polite">
          Kaydediliyor…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <TaskSteps tasks={tasks} done={done} current={current} />
      <h1 className="sr-only">{task.name}</h1>
      {task.kind === 'digit_span' && <DigitSpan key={task.key} task={task} onDone={(t) => void save(task.key, t)} />}
      {task.kind === 'spatial_span' && <SpatialSpan key={task.key} task={task} onDone={(t) => void save(task.key, t)} />}
      {task.kind === 'flanker' && <Flanker key={task.key} task={task} onDone={(t) => void save(task.key, t)} />}
      {task.kind === 'symbol_match' && <SymbolMatch key={task.key} task={task} onDone={(t) => void save(task.key, t)} />}
      {task.kind === 'cancellation' && (
        <Cancellation key={task.key} task={task} attemptId={attemptId} onDone={(t) => void save(task.key, t)} />
      )}
    </div>
  );
}
