'use client';

import { useEffect, useRef, useState } from 'react';
import type { SymbolMatchTask } from '@/lib/instruments/types';
import type { SymbolTrialInput } from '@/lib/scoring/tasks';
import { Stage, StatusLine, SymbolGlyph, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/**
 * Sembol eşleştirme: ortadaki sembolün anahtardaki rakamı bulunur. Asıl görev süre sınırlıdır;
 * süre dolduğunda o ana kadar verilen cevaplar puanlanır.
 */
export function SymbolMatch({ task, onDone }: { task: SymbolMatchTask; onDone: (trials: SymbolTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [practiceHits, setPracticeHits] = useState(0);
  const [remaining, setRemaining] = useState(task.durationMs);
  const onset = useRef(0);
  const trials = useRef<SymbolTrialInput[]>([]);
  const finished = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const running = step === 'practice' || step === 'test';
  const list = step === 'practice' ? task.practice : task.sequence;
  const current = list[Math.min(index, list.length - 1)];

  // Her yeni sembolün ekrana çizildiği an, tepki süresinin başlangıcıdır.
  useEffect(() => {
    if (!running) return;
    onset.current = performance.now();
    let cancelled = false;
    void afterPaint().then((t) => {
      if (!cancelled) onset.current = t;
    });
    return () => {
      cancelled = true;
    };
  }, [index, running]);

  // Asıl görevin süresi.
  useEffect(() => {
    if (step !== 'test') return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const left = Math.max(0, task.durationMs - (performance.now() - start));
      setRemaining(left);
      if (left <= 0 && !finished.current) {
        finished.current = true;
        window.clearInterval(id);
        onDoneRef.current(trials.current);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [step, task.durationMs]);

  function answer(digit: number, t: number) {
    if (!running || feedback !== null || finished.current) return;
    const rtMs = Math.max(0, Math.round(t - onset.current));
    const correct = digit === current + 1;
    if (step === 'practice') {
      if (correct) setPracticeHits((h) => h + 1);
      setFeedback(correct);
      window.setTimeout(() => {
        setFeedback(null);
        if (index + 1 >= task.practice.length) setStep('practice-done');
        else setIndex(index + 1);
      }, 650);
      return;
    }
    trials.current.push({ index, response: digit, rtMs });
    if (index + 1 >= task.sequence.length) {
      finished.current = true;
      onDoneRef.current(trials.current);
      return;
    }
    setIndex(index + 1);
  }

  useKeys(running, (e) => {
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= task.symbols.length) {
      e.preventDefault();
      answer(n, e.timeStamp);
    }
  });

  const key = (
    <div className="grid grid-cols-9 gap-1 rounded-xl border border-rule bg-surface p-2 sm:gap-2" aria-label="Sembol anahtarı">
      {task.symbols.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 rounded-lg bg-surface-2 py-2">
          <SymbolGlyph d={d} size={30} />
          <span className="tabular font-bold">{i + 1}</span>
        </div>
      ))}
    </div>
  );

  if (step === 'ready' || step === 'practice-done') {
    const first = step === 'ready';
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        {key}
        <p className="measure text-lg">
          {first
            ? 'Üstteki anahtarda her sembolün altında bir rakam var. Önce altı denemelik bir alıştırma yapalım.'
            : `Alıştırmada ${task.practice.length} sembolün ${practiceHits} tanesini doğru eşleştirdin. Şimdi ${Math.round(task.durationMs / 1000)} saniye boyunca yapabildiğin kadarını yap. Hem hızlı hem doğru olmaya çalış.`}
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            setIndex(0);
            if (first) {
              setPracticeHits(0);
              setStep('practice');
            } else {
              finished.current = false;
              trials.current = [];
              setRemaining(task.durationMs);
              setStep('test');
            }
          }}
        >
          {first ? 'Alıştırmaya başla' : 'Göreve başla'}
        </button>
      </div>
    );
  }

  const pct = (remaining / task.durationMs) * 100;
  return (
    <div className="flex flex-col gap-4">
      {key}
      {step === 'test' && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
          </div>
          <span className="tabular w-14 text-right text-ink-3">{Math.ceil(remaining / 1000)} sn</span>
        </div>
      )}
      <Stage label="Eşleştirilecek sembol">
        {feedback === null ? (
          <span className="text-ink">
            <SymbolGlyph d={task.symbols[current]} size={120} title="Bu sembolün rakamını bul" />
          </span>
        ) : (
          <p className={`text-2xl font-bold ${feedback ? 'text-ok' : 'text-ink'}`} aria-live="polite">
            {feedback ? 'Doğru!' : `Olmadı; doğru rakam ${current + 1}.`}
          </p>
        )}
      </Stage>
      <StatusLine>{step === 'practice' ? 'Alıştırma' : 'Bu sembolün rakamı hangisi?'}</StatusLine>
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {task.symbols.map((_, i) => (
          <button
            key={i}
            type="button"
            className="tabular h-16 rounded-xl border-[1.5px] border-rule-strong bg-surface font-display text-xl font-bold hover:border-ink active:translate-y-px"
            onPointerDown={(e) => {
              e.preventDefault();
              answer(i + 1, e.timeStamp);
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
