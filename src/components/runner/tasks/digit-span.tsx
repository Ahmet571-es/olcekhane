'use client';

import { useEffect, useRef, useState } from 'react';
import type { DigitSpanTask } from '@/lib/instruments/types';
import type { SpanTrialInput } from '@/lib/scoring/tasks';
import { Keypad, Stage, StatusLine, isAbort, useKeys, wait } from './common';

type Step = 'ready' | 'show' | 'input' | 'feedback' | 'practice-done';

/**
 * Sayı dizisi: rakamlar tek tek gösterilir, sonra öğrenci diziyi (ileri ya da geri) tuşlar.
 * Önce geri bildirimli bir alıştırma yapılır. Her uzunlukta iki deneme vardır; ikisi de yanlışsa görev biter.
 */
export function DigitSpan({ task, onDone }: { task: DigitSpanTask; onDone: (trials: SpanTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [practice, setPractice] = useState(true);
  const [level, setLevel] = useState(0);
  const [trial, setTrial] = useState(0);
  const [shown, setShown] = useState<number | null>(null);
  const [entered, setEntered] = useState<number[]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [showKey, setShowKey] = useState(0);
  const inputStart = useRef(0);
  const results = useRef<SpanTrialInput[]>([]);
  const levelHits = useRef<boolean[]>([]);

  const sequence = practice ? task.practice : task.sequences[level][trial];
  const expected = task.direction === 'backward' ? [...sequence].reverse() : sequence;

  useEffect(() => {
    if (step !== 'show') return;
    const ac = new AbortController();
    (async () => {
      await wait(600, ac.signal);
      for (const d of sequence) {
        setShown(d);
        await wait(task.onMs, ac.signal);
        setShown(null);
        await wait(task.offMs, ac.signal);
      }
      setEntered([]);
      setStep('input');
      inputStart.current = performance.now();
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
    // showKey yeni bir sunumu tetikler; sequence her sunumda o anki denemeye aittir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showKey]);

  function present() {
    setShowKey((k) => k + 1);
    setStep('show');
  }

  function submit() {
    if (step !== 'input' || entered.length === 0) return;
    const rtMs = Math.round(performance.now() - inputStart.current);
    const correct = entered.length === expected.length && entered.every((d, i) => d === expected[i]);
    if (practice) {
      setLastCorrect(correct);
      setStep('feedback');
      return;
    }
    results.current.push({ length: task.startLength + level, index: trial, response: entered, rtMs });
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

  useKeys(step === 'input', (e) => {
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= 9) {
      e.preventDefault();
      setEntered((x) => (x.length < 12 ? [...x, n] : x));
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setEntered((x) => x.slice(0, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  });

  if (step === 'ready' || step === 'practice-done') {
    const first = step === 'ready';
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {first
            ? 'Önce kısa bir alıştırma yapalım. Sayıları dikkatle izle; hepsi bitince tuşlara bas.'
            : 'Alıştırma bitti. Şimdi asıl görev başlıyor. Diziler giderek uzayacak; elinden geleni yap.'}
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
          {lastCorrect ? 'Doğru!' : 'Olmadı, sorun değil.'}
        </p>
        {!lastCorrect && (
          <p className="text-lg">
            Doğru cevap: <span className="tabular font-bold tracking-[0.2em]">{expected.join(' ')}</span>
            {task.direction === 'backward' && ' (sondan başa doğru)'}
          </p>
        )}
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

  return (
    <div className="flex flex-col gap-6">
      <Stage label="Sayıların gösterildiği alan">
        {step === 'show' ? (
          <span className="tabular font-display text-[7rem] font-bold leading-none" aria-live="off">
            {shown ?? ''}
          </span>
        ) : (
          <div className="flex min-h-[4.5rem] flex-wrap items-center justify-center gap-2" aria-live="polite" aria-label="Girdiğin sayılar">
            {entered.length === 0 ? (
              <span className="text-lg text-ink-3">{task.direction === 'backward' ? 'Sayıları sondan başa doğru gir' : 'Sayıları sırayla gir'}</span>
            ) : (
              entered.map((d, i) => (
                <span key={i} className="tabular flex h-14 w-11 items-center justify-center rounded-lg border-[1.5px] border-ink font-display text-3xl font-bold">
                  {d}
                </span>
              ))
            )}
          </div>
        )}
      </Stage>
      <StatusLine>{step === 'show' ? 'İzle…' : practice ? 'Alıştırma: sıra sende' : 'Sıra sende'}</StatusLine>
      <Keypad
        disabled={step !== 'input'}
        canSubmit={entered.length > 0}
        onDigit={(d) => setEntered((x) => (x.length < 12 ? [...x, d] : x))}
        onDelete={() => setEntered((x) => x.slice(0, -1))}
        onSubmit={submit}
      />
    </div>
  );
}
