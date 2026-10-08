'use client';

import { useEffect, useRef, useState } from 'react';
import type { FlankerTask } from '@/lib/instruments/types';
import type { FlankerTrialInput } from '@/lib/scoring/tasks';
import { Arrow, PausedScreen, Stage, StatusLine, afterPaint, isAbort, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';
type View =
  | { kind: 'blank' }
  | { kind: 'fixation' }
  | { kind: 'stimulus'; dir: 'L' | 'R'; congruent: boolean }
  | { kind: 'feedback'; correct: boolean; timeout: boolean };

/**
 * Ok görevi (flanker düzeni): ortadaki okun yönüne, yanlardaki oklara aldırmadan cevap verilir.
 * Tepki süresi uyaranın ekrana çizildiği andan cevaba kadar ölçülür. Sayfa gizlenince görev durur: asıl görevde
 * dönülünce yarıda kalan denemeden devam edilir, alıştırma baştan başlar.
 */
export function Flanker({ task, onDone }: { task: FlankerTask; onDone: (trials: FlankerTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [view, setView] = useState<View>({ kind: 'blank' });
  const [count, setCount] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const out = useRef<FlankerTrialInput[]>([]);
  const responder = useRef<((key: 'L' | 'R', t: number) => void) | null>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if ((step !== 'practice' && step !== 'test') || paused) return;
    const isPractice = step === 'practice';
    const list = isPractice ? task.practice : task.trials;
    const ac = new AbortController();
    let hits = 0;
    (async () => {
      await wait(900, ac.signal);
      for (let i = isPractice ? 0 : out.current.length; i < list.length; i++) {
        const trial = list[i];
        setView({ kind: 'fixation' });
        await wait(task.fixationMs, ac.signal);
        setView({ kind: 'stimulus', dir: trial.dir, congruent: trial.congruent });
        let onset = performance.now();
        const answer = new Promise<{ key: 'L' | 'R'; t: number }>((resolve) => {
          responder.current = (key, t) => {
            responder.current = null;
            resolve({ key, t });
          };
        });
        void afterPaint().then((t) => {
          onset = t;
        });
        const resp = await Promise.race([answer, wait(task.timeoutMs, ac.signal).then(() => null)]);
        responder.current = null;
        const rtMs = resp ? Math.max(0, Math.round(resp.t - onset)) : null;
        const correct = !!resp && resp.key === trial.dir && (rtMs ?? 0) >= 150;
        if (isPractice) {
          if (correct) hits++;
          setView({ kind: 'feedback', correct, timeout: !resp });
          await wait(900, ac.signal);
        } else {
          out.current.push({ index: i, response: resp ? resp.key : null, rtMs });
          setCount(i + 1);
        }
        setView({ kind: 'blank' });
        const [a, b] = task.itiMs;
        await wait(a + Math.round(Math.random() * (b - a)), ac.signal);
      }
      if (isPractice) {
        setPracticeScore(hits);
        setStep('practice-done');
      } else {
        onDoneRef.current(out.current);
      }
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => {
      responder.current = null;
      ac.abort();
    };
    // runKey aynı adımı (ör. alıştırmayı) yeniden başlatmak için kullanılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, runKey, paused]);

  const running = (step === 'practice' || step === 'test') && !paused;
  usePageHidden(running, () => {
    responder.current = null;
    setView({ kind: 'blank' });
    setPaused(true);
  });

  const respond = (key: 'L' | 'R', t: number) => responder.current?.(key, t);

  useKeys(running, (e) => {
    const k = e.key.toLocaleLowerCase('tr-TR');
    if (k === 'f' || e.key === 'ArrowLeft') {
      e.preventDefault();
      // Basılı tutulan tuş art arda cevap sayılmaz.
      if (!e.repeat) respond('L', e.timeStamp);
    } else if (k === 'j' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (!e.repeat) respond('R', e.timeStamp);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note={step === 'test' ? 'Yarıda kalan denemeden devam edeceksin.' : 'Alıştırma baştan başlayacak.'}
        onResume={() => setPaused(false)}
      />
    );
  }

  if (step === 'ready' || step === 'practice-done') {
    const first = step === 'ready';
    const low = !first && practiceScore < Math.ceil(task.practice.length * 0.6);
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        {first ? (
          <p className="measure text-lg">Önce sekiz denemelik bir alıştırma yapalım. Her denemeden sonra doğru yapıp yapmadığını göreceksin.</p>
        ) : (
          <p className="measure text-lg">
            Alıştırmada {task.practice.length} denemenin {practiceScore} tanesini doğru yaptın.{' '}
            {low ? 'Yalnızca ortadaki oka bakmayı unutma. İstersen alıştırmayı tekrarlayabilirsin.' : 'Şimdi asıl görev başlıyor; artık geri bildirim olmayacak.'}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {!first && (
            <button
              type="button"
              className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setStep('practice');
                setRunKey((k) => k + 1);
              }}
            >
              Alıştırmayı tekrarla
            </button>
          )}
          <button
            type="button"
            className={`btn btn-lg ${first || !low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus
            onClick={() => {
              setCount(0);
              if (!first) out.current = [];
              setStep(first ? 'practice' : 'test');
            }}
          >
            {first ? 'Alıştırmaya başla' : 'Göreve başla'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Stage label="Okların gösterildiği alan">
        {view.kind === 'fixation' && <span className="font-display text-5xl font-bold text-ink-2">+</span>}
        {view.kind === 'stimulus' && (
          <div className="flex items-center gap-1 sm:gap-3" aria-label={`Ortadaki ok ${view.dir === 'L' ? 'sola' : 'sağa'} bakıyor`}>
            {[0, 1, 2, 3, 4].map((i) => {
              const dir = i === 2 || view.congruent ? view.dir : view.dir === 'L' ? 'R' : 'L';
              return <Arrow key={i} dir={dir} size={60} />;
            })}
          </div>
        )}
        {view.kind === 'feedback' && (
          <p className={`text-2xl font-bold ${view.correct ? 'text-ok' : 'text-ink'}`} aria-live="polite">
            {view.correct ? 'Doğru!' : view.timeout ? 'Biraz daha hızlı olmaya çalış.' : 'Ortadaki oka bak.'}
          </p>
        )}
      </Stage>
      <StatusLine>{step === 'practice' ? 'Alıştırma' : `${count} / ${task.trials.length}`}</StatusLine>
      <div className="mx-auto grid w-full max-w-[28rem] grid-cols-2 gap-3">
        <button
          type="button"
          className="btn btn-secondary h-20 text-lg"
          onPointerDown={(e) => {
            e.preventDefault();
            if (primaryPointer(e)) respond('L', e.timeStamp);
          }}
        >
          <Arrow dir="L" size={28} /> Sol <span className="t-meta hidden sm:inline">(F)</span>
        </button>
        <button
          type="button"
          className="btn btn-secondary h-20 text-lg"
          onPointerDown={(e) => {
            e.preventDefault();
            if (primaryPointer(e)) respond('R', e.timeStamp);
          }}
        >
          <span className="t-meta hidden sm:inline">(J)</span> Sağ <Arrow dir="R" size={28} />
        </button>
      </div>
    </div>
  );
}
