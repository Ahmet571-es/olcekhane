'use client';

import { useEffect, useRef, useState } from 'react';
import type { GoNoGoTask } from '@/lib/instruments/types';
import type { GoNoGoTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, Stage, StatusLine, TOUCH_CLASSES, isAbort, ordinal, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test' | 'break';
type View = { kind: 'blank' } | { kind: 'stimulus'; letter: string } | { kind: 'feedback'; text: string; good: boolean };

/** Sunucudaki puanlamayla aynı: harf göründükten sonra 150 ms'den önceki basış harfe bakılmadan yapılmış sayılır. */
const TOO_EARLY_MS = 150;

/**
 * Dur-git görevi (go/no-go düzeni): harf görünce basılır, durma harfinde basılmaz. Her denemede cevap penceresi
 * harfin ekrana çizildiği andan başlar; pencere içindeki ilk basış sayılır. Harfin çizileceği kareden önceki
 * basışlar (bir önceki harfe geç kalan basış) yok sayılır. Sayfa gizlenirse görev duraklar; yarıda kalan deneme, dönülünce yeniden
 * gösterilir.
 *
 * Boşluk tuşu cevap tuşu olduğu için ara ekranlardaki düğmelere odak verilmez ve düğmeler kısa bir süre sonra
 * çalışmaya başlar: görevdeki son basış, alıştırma sonucunu ya da molayı atlatmasın.
 */
export function GoNoGo({ task, onDone }: { task: GoNoGoTask; onDone: (trials: GoNoGoTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [view, setView] = useState<View>({ kind: 'blank' });
  const [block, setBlock] = useState(0);
  const [count, setCount] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [paused, setPaused] = useState(false);
  const press = useRef<((t: number) => void) | null>(null);
  const out = useRef<GoNoGoTrialInput[]>([]);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const perBlock = Math.ceil(task.trials.length / task.blocks);
  const running = step === 'practice' || step === 'test';

  useEffect(() => {
    if (!running || paused) return;
    const isPractice = step === 'practice';
    const first = isPractice ? 0 : block * perBlock;
    const list = isPractice ? task.practice : task.trials.slice(first, first + perBlock);
    const startAt = isPractice ? 0 : Math.max(0, out.current.length - first);
    const ac = new AbortController();
    let hits = 0;
    (async () => {
      await wait(1200, ac.signal);
      for (let i = startAt; i < list.length; i++) {
        const trial = list[i];
        const presses: number[] = [];
        const shownAt = performance.now();
        // İlk kare: harfin çizileceği karenin başı (bundan önceki basışlar bir önceki harfe geç kalmış basışlardır).
        // Tepki süresi, öteki görevlerdeki gibi harfin çizildiği sonraki kareden ölçülür.
        let firstFrame = Number.POSITIVE_INFINITY;
        let onset = Number.POSITIVE_INFINITY;
        press.current = (t) => {
          presses.push(t);
        };
        setView({ kind: 'stimulus', letter: trial.letter });
        requestAnimationFrame((t1) => {
          firstFrame = t1;
          requestAnimationFrame((t2) => {
            onset = t2;
          });
        });
        await wait(task.stimulusMs, ac.signal);
        setView({ kind: 'blank' });
        await wait(task.responseMs - task.stimulusMs, ac.signal);
        press.current = null;
        if (!Number.isFinite(firstFrame)) firstFrame = shownAt;
        if (!Number.isFinite(onset)) onset = firstFrame;
        const at = presses.find((t) => t >= firstFrame);
        const rtMs = at === undefined ? null : Math.min(task.responseMs, Math.max(0, Math.round(at - onset)));
        if (isPractice) {
          const good = trial.go ? rtMs !== null && rtMs >= TOO_EARLY_MS : rtMs === null;
          if (good) hits++;
          const text = trial.go
            ? good
              ? 'Doğru!'
              : rtMs === null
                ? 'Harf görününce hemen bas.'
                : 'Çok erken bastın; harfi görünce bas.'
            : good
              ? 'Aferin, durdun!'
              : `${task.stop} görünce basma.`;
          setView({ kind: 'feedback', text, good });
          await wait(900, ac.signal);
          setView({ kind: 'blank' });
        } else {
          out.current.push({ index: first + i, response: rtMs === null ? null : 1, rtMs });
          setCount(first + i + 1);
        }
        const [a, b] = task.itiMs;
        await wait(a + Math.round(Math.random() * (b - a)), ac.signal);
      }
      if (isPractice) {
        setPracticeScore(hits);
        setStep('practice-done');
      } else if (block + 1 < task.blocks) {
        setStep('break');
      } else {
        onDoneRef.current(out.current);
      }
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => {
      press.current = null;
      ac.abort();
    };
    // runKey aynı adımı (ör. alıştırmayı) yeniden başlatmak için kullanılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, block, runKey, paused]);

  usePageHidden(running && !paused, () => {
    press.current = null;
    setView({ kind: 'blank' });
    setPaused(true);
  });

  const hit = (t: number) => {
    press.current?.(t);
    setPressed(true);
    window.setTimeout(() => setPressed(false), 120);
  };

  useKeys(running && !paused, (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) hit(e.timeStamp);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        autoFocus={false}
        note={step === 'test' ? 'Yaptığın denemeler kaybolmadı; kaldığın yerden devam edeceksin.' : 'Alıştırma baştan başlayacak.'}
        onResume={() => setPaused(false)}
      />
    );
  }

  if (step === 'ready' || step === 'practice-done') {
    const first = step === 'ready';
    const low = !first && practiceScore < Math.ceil(task.practice.length * 0.6);
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        {first ? (
          <p className="measure text-lg">
            Önce {task.practice.length} denemelik bir alıştırma yapalım. Her harfte BAS düğmesine bas; {task.stop} görünce basma. Her denemeden sonra
            doğru yapıp yapmadığını göreceksin.
          </p>
        ) : (
          <p className="measure text-lg">
            Alıştırmada {task.practice.length} denemenin {practiceScore} tanesini doğru yaptın.{' '}
            {low
              ? `Harf görünce hemen basmayı, ${task.stop} görünce durmayı unutma. İstersen alıştırmayı tekrarlayabilirsin.`
              : 'Şimdi asıl görev başlıyor; artık doğru mu yanlış mı olduğunu görmeyeceksin.'}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {!first && (
            <ArmedButton
              className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setStep('practice');
                setRunKey((k) => k + 1);
              }}
            >
              Alıştırmayı tekrarla
            </ArmedButton>
          )}
          <ArmedButton
            className={`btn btn-lg ${first || !low ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setCount(0);
              setStep(first ? 'practice' : 'test');
            }}
          >
            {first ? 'Alıştırmaya başla' : 'Göreve başla'}
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'break') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {ordinal(block)} bölüm bitti. Kısa bir mola ver; hazır olduğunda {ordinal(block + 1).toLocaleLowerCase('tr-TR')} bölüme geç.
        </p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          onClick={() => {
            setBlock((b) => b + 1);
            setStep('test');
          }}
        >
          {ordinal(block + 1)} bölüme başla
        </ArmedButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Stage label="Harflerin gösterildiği alan">
        {view.kind === 'stimulus' && <span className="font-display text-[5.5rem] font-bold leading-none">{view.letter}</span>}
        {view.kind === 'feedback' && (
          <p className={`text-2xl font-bold ${view.good ? 'text-ok' : 'text-ink'}`} aria-live="polite">
            {view.text}
          </p>
        )}
      </Stage>
      <StatusLine>{step === 'practice' ? 'Alıştırma' : `${count} / ${task.trials.length}`}</StatusLine>
      <button
        type="button"
        className={`btn btn-primary mx-auto h-24 w-full max-w-[24rem] text-2xl transition-transform ${TOUCH_CLASSES} ${pressed ? 'scale-95' : ''}`}
        onPointerDown={(e) => {
          if (!primaryPointer(e)) return;
          e.preventDefault();
          hit(e.timeStamp);
        }}
      >
        BAS <span className="t-meta hidden text-paper/70 sm:inline">(boşluk tuşu)</span>
      </button>
    </div>
  );
}
