'use client';

import { useRef, useState } from 'react';
import type { CognitiveTask } from '@/lib/instruments/types';
import { IntroStep } from '../likert-runner';
import { Cancellation } from './cancellation';
import { ColorWord } from './color-word';
import { ArmedButton, useLeaveWarning } from './common';
import { DigitSpan } from './digit-span';
import { FiguralAnalogy } from './figural-analogy';
import { Flanker } from './flanker';
import { GoNoGo } from './go-nogo';
import { MatrixReasoning } from './matrix-reasoning';
import { MentalArithmetic } from './mental-arithmetic';
import { MentalRotation } from './mental-rotation';
import { NBack } from './n-back';
import { NumberSeries } from './number-series';
import { LetterSeries } from './letter-series';
import { PaperFolding } from './paper-folding';
import { Vocabulary } from './vocabulary';
import { RuleSwitch } from './rule-switch';
import { ReactionTime } from './reaction-time';
import { SpatialSpan } from './spatial-span';
import { SymbolMatch } from './symbol-match';
import { VerbalReasoning } from './verbal-reasoning';
import { LogicalReasoning } from './logical-reasoning';
import { NumericalReasoning } from './numerical-reasoning';
import { CubeNet } from './cube-net';
import { HiddenFigures } from './hidden-figures';
import { LetterNumber } from './letter-number';
import { PatternMemory } from './pattern-memory';
import { MentalRotation3d } from './mental-rotation-3d';
import { CognitiveReflection } from './cognitive-reflection';
import { ComplexSpan } from './complex-span';
import { Perspective } from './perspective';
import { Tower } from './tower';
import { Trail } from './trail';
import { WordList } from './word-list';

type Phase = 'intro' | 'task-intro' | 'task' | 'between' | 'finishing';

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

/**
 * Görevlerin denemeleri sunucuya tek tek gönderilmez, yalnızca bu sayfada tutulur; bütün görevler
 * bitince hepsi birden `onFinish` ile verilir. `seed`, harf işaretleme sayfalarının tohumudur
 * (tarayıcıda rastgele üretilir, kimseye bağlı değildir).
 */
export function TaskRunner(props: {
  intro: { title: string; paragraphs: string[] };
  tasks: CognitiveTask[];
  seed: string;
  onFinish: (blocks: Record<string, unknown[]>) => Promise<void>;
}) {
  const { tasks, seed, onFinish } = props;
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [phase, setPhase] = useState<Phase>('intro');
  const [finishError, setFinishError] = useState<string | null>(null);
  /** Süreli bölümü (zihinden hesaplama) biten görevin sonu: süre doldu mu, işlemler mi bitti? */
  const [timedEnd, setTimedEnd] = useState<'time' | 'items' | null>(null);
  const blocks = useRef(new Map<string, unknown[]>());
  const current = tasks.findIndex((t) => !done.has(t.key));
  const task = current === -1 ? null : tasks[current];

  // Yapılan görevler yalnızca bu sayfada durur: başladıktan sonra ayrılmadan önce uyarılır.
  useLeaveWarning(phase !== 'intro');

  async function finish() {
    setPhase('finishing');
    setFinishError(null);
    try {
      await onFinish(Object.fromEntries(blocks.current));
    } catch (err) {
      setFinishError(err instanceof Error ? err.message : 'Rapor hazırlanamadı. Lütfen tekrar deneyin.');
    }
  }

  function save(block: string, trials: unknown[]) {
    blocks.current.set(block, trials);
    const t = tasks.find((x) => x.key === block);
    setTimedEnd(t?.kind === 'mental_arithmetic' ? (trials.length >= t.items.length ? 'items' : 'time') : null);
    const next = new Set(done);
    next.add(block);
    setDone(next);
    if (next.size >= tasks.length) void finish();
    else setPhase('between');
  }

  if (phase === 'intro') {
    return <IntroStep title={props.intro.title} paragraphs={props.intro.paragraphs} cta="Başla" onStart={() => setPhase('task-intro')} />;
  }

  if (phase === 'finishing' || !task) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h1 className="t-h1">Bütün görevleri bitirdin!</h1>
        {finishError ? (
          <>
            <p className="notice notice-danger text-left">{finishError}</p>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => void finish()}>
              Tekrar dene
            </button>
          </>
        ) : (
          <p className="text-lg text-ink-2">Sonuçların hesaplanıyor…</p>
        )}
      </div>
    );
  }

  if (phase === 'between') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <TaskSteps tasks={tasks} done={done} current={current} />
        <h1 className="t-h1">
          {timedEnd === 'time' ? 'Süre doldu; bu bölüm bitti.' : timedEnd === 'items' ? 'Bu bölümü süre dolmadan bitirdin.' : 'Harika, bir görevi daha bitirdin.'}
        </h1>
        <p className="text-lg">
          Sıradaki görev: <strong>{task.name}</strong>. İstersen biraz dinlenebilirsin; hazır olduğunda devam et.
        </p>
        <div>
          {/* Kısa bir gecikmeyle çalışır: görevin son tuşu (ör. Enter) bir sonraki görevin yönergesini atlatmasın. */}
          <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setPhase('task-intro')}>
            Sonraki göreve geç
          </ArmedButton>
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
          <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setPhase('task')}>
            Anladım
          </ArmedButton>
        </div>
      </div>
    );
  }

  return (
    // Üç boyutlu şekiller büyük ekranda daha geniş bir alanda çizilir (beş şekil yan yana karşılaştırılır); bakış açısı almada
    // harita ile cevap çemberi büyük ekranda yan yanadır.
    <div className={`mx-auto flex w-full flex-col gap-6 ${task.kind === 'mental_rotation_3d' || task.kind === 'perspective' || task.kind === 'hidden_figures' || task.kind === 'figural_analogy' ? 'max-w-2xl lg:max-w-4xl' : 'max-w-2xl'}`}>
      <TaskSteps tasks={tasks} done={done} current={current} />
      <h1 className="sr-only">{task.name}</h1>
      {task.kind === 'digit_span' && <DigitSpan key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'spatial_span' && <SpatialSpan key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'flanker' && <Flanker key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'symbol_match' && <SymbolMatch key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'cancellation' && (
        <Cancellation key={task.key} task={task} seed={seed} onDone={(t) => save(task.key, t)} />
      )}
      {task.kind === 'color_word' && <ColorWord key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'go_nogo' && <GoNoGo key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'trail' && <Trail key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'n_back' && <NBack key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'mental_rotation' && <MentalRotation key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'reaction_time' && <ReactionTime key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'matrix_reasoning' && <MatrixReasoning key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'number_series' && <NumberSeries key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'letter_series' && <LetterSeries key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'verbal_reasoning' && <VerbalReasoning key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'paper_folding' && <PaperFolding key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'vocabulary' && <Vocabulary key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'rule_switch' && <RuleSwitch key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'word_list' && <WordList key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'logical_reasoning' && <LogicalReasoning key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'numerical_reasoning' && <NumericalReasoning key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'cube_net' && <CubeNet key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'hidden_figures' && <HiddenFigures key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'pattern_memory' && <PatternMemory key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'letter_number' && <LetterNumber key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'mental_rotation_3d' && <MentalRotation3d key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'cognitive_reflection' && <CognitiveReflection key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'tower' && <Tower key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'complex_span' && <ComplexSpan key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'perspective' && <Perspective key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'mental_arithmetic' && <MentalArithmetic key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
      {task.kind === 'figural_analogy' && <FiguralAnalogy key={task.key} task={task} onDone={(t) => save(task.key, t)} />}
    </div>
  );
}
