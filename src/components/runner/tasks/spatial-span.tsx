'use client';

import { useEffect, useRef, useState } from 'react';
import type { SpatialSpanTask } from '@/lib/instruments/types';
import type { SpanTrialInput } from '@/lib/scoring/tasks';
import { StatusLine, isAbort, wait } from './common';

type Step = 'ready' | 'show' | 'input' | 'feedback' | 'practice-done';

/**
 * Kutu dizisi: dokuz kutudan bazıları sırayla yanar; öğrenci aynı sırayla kutulara dokunur.
 * Kutu yerleşimi ve diziler özgündür.
 */
export function SpatialSpan({ task, onDone }: { task: SpatialSpanTask; onDone: (trials: SpanTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [practice, setPractice] = useState(true);
  const [level, setLevel] = useState(0);
  const [trial, setTrial] = useState(0);
  const [lit, setLit] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [showKey, setShowKey] = useState(0);
  const inputStart = useRef(0);
  const results = useRef<SpanTrialInput[]>([]);
  const levelHits = useRef<boolean[]>([]);

  const sequence = practice ? task.practice : task.sequences[level][trial];

  useEffect(() => {
    if (step !== 'show') return;
    const ac = new AbortController();
    (async () => {
      await wait(700, ac.signal);
      for (const b of sequence) {
        setLit(b);
        await wait(task.onMs, ac.signal);
        setLit(null);
        await wait(task.offMs, ac.signal);
      }
      setTapped([]);
      setStep('input');
      inputStart.current = performance.now();
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showKey]);

  function present() {
    setShowKey((k) => k + 1);
    setStep('show');
  }

  function tap(i: number) {
    if (step !== 'input' || tapped.length >= 12) return;
    setTapped((x) => [...x, i]);
    setFlash(i);
    window.setTimeout(() => setFlash((f) => (f === i ? null : f)), 180);
  }

  function submit() {
    if (step !== 'input' || tapped.length === 0) return;
    const rtMs = Math.round(performance.now() - inputStart.current);
    const correct = tapped.length === sequence.length && tapped.every((b, i) => b === sequence[i]);
    if (practice) {
      setLastCorrect(correct);
      setStep('feedback');
      return;
    }
    results.current.push({ length: task.startLength + level, index: trial, response: tapped, rtMs });
    levelHits.current.push(correct);
    if (trial === 0) {
      setTrial(1);
      present();
      return;
    }
    const passed = levelHits.current.some(Boolean);
    levelHits.current = [];
    if (!passed || level + 1 >= task.sequences.length) {
      onDone(results.current);
      return;
    }
    setLevel(level + 1);
    setTrial(0);
    present();
  }

  if (step === 'ready' || step === 'practice-done') {
    const first = step === 'ready';
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {first
            ? 'Önce kısa bir alıştırma yapalım. Yanan kutuları izle; hepsi bitince aynı sırayla kutulara dokun.'
            : 'Alıştırma bitti. Şimdi asıl görev başlıyor. Diziler giderek uzayacak.'}
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            if (!first) setPractice(false);
            present();
          }}
        >
          {first ? 'Alıştırmaya başla' : 'Göreve başla'}
        </button>
      </div>
    );
  }

  if (step === 'feedback') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className={`text-2xl font-bold ${lastCorrect ? 'text-ok' : 'text-ink'}`} aria-live="polite">
          {lastCorrect ? 'Doğru!' : 'Olmadı, sorun değil. Kutuların yanma sırasına dikkat et.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-secondary btn-lg" onClick={present}>
            Bir daha dene
          </button>
          <button type="button" className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('practice-done')}>
            Devam
          </button>
        </div>
      </div>
    );
  }

  const inputting = step === 'input';
  return (
    <div className="flex flex-col gap-5">
      <div className="relative mx-auto aspect-square w-full max-w-[26rem] rounded-2xl border border-rule bg-surface" aria-label="Kutuların bulunduğu alan">
        {task.boxes.map((b, i) => {
          const on = lit === i || flash === i;
          return (
            <button
              key={i}
              type="button"
              disabled={!inputting}
              onPointerDown={(e) => {
                e.preventDefault();
                tap(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  tap(i);
                }
              }}
              aria-label={`Kutu ${i + 1}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 transition-colors duration-75 ${
                on ? 'border-brass bg-brass' : 'border-ink/70 bg-surface-2'
              } ${inputting ? 'cursor-pointer hover:border-ink' : 'cursor-default'}`}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: '15%', height: '15%' }}
            />
          );
        })}
      </div>
      <StatusLine>
        {step === 'show' ? 'İzle…' : `${practice ? 'Alıştırma: ' : ''}Sıra sende · ${tapped.length} kutu seçildi`}
      </StatusLine>
      <div className="mx-auto flex w-full max-w-[20rem] gap-2.5">
        <button type="button" className="btn btn-secondary h-14 flex-1" disabled={!inputting || tapped.length === 0} onClick={() => setTapped((x) => x.slice(0, -1))}>
          Geri al
        </button>
        <button type="button" className="btn btn-primary h-14 flex-[2]" disabled={!inputting || tapped.length === 0} onClick={submit}>
          Tamam
        </button>
      </div>
    </div>
  );
}
