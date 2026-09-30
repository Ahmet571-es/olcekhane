'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TrailTask } from '@/lib/instruments/types';
import type { TrailPartInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, primaryPointer, usePageHidden } from './common';

type Step = 'part-intro' | 'practice' | 'ready' | 'run' | 'timeout';
type Pt = { x: number; y: number };

/** Dairenin yarıçapı ve dokunma alanı (görünüm alanının yüzdesi). Dokunma alanları birbirine değmez (en az 15 aralık). */
const R = 5.4;
const HIT = 7;
/** Tahta ekranın genişliğine ve yüksekliğine sığar: üstünde durum satırı, altında ve üstünde biraz boşluk kalır. */
const BOARD_WIDTH = 'min(100%, 34rem, calc(100dvh - 7rem))';
/** Asıl bölüm başladıktan ya da duraklatmadan dönüldükten sonraki bu süre içindeki dokunuşlar sayılmaz (çift tıklama tahtaya geçmesin). */
const TAP_GUARD_MS = 300;
/** Yanlış dokunuşların en çok bu kadarı kaydedilir (gönderilen veri sınırlı kalsın); doğru dokunuşlar her zaman kaydedilir. */
const MAX_WRONG_TAPS = 300;

type Caption = { x: number; y: number; anchor: 'start' | 'middle' | 'end' };

/**
 * "Başla" ve "Son" yazısının yeri: dairenin altı, üstü, sağı ya da solu. Yazı başka bir dairenin ya da birleştirme
 * çizgisinin üstüne binmesin diye ilk yeterince açık yer seçilir; hiçbiri açık değilse en açık olanı.
 */
function placeCaption(i: number, text: string, points: Pt[]): Caption {
  const p = points[i];
  const w = text.length * 3.4 * 0.58;
  const h = 2.6;
  const box = (x: number, y: number, anchor: Caption['anchor']) => {
    const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x : x - w;
    return [x0, y - h, x0 + w, y + 0.8] as const;
  };
  const candidates: Caption[] = [
    { x: p.x, y: p.y + R + 3.9, anchor: 'middle' },
    { x: p.x, y: p.y - R - 1.5, anchor: 'middle' },
    { x: p.x + R + 1.2, y: p.y + 1.2, anchor: 'start' },
    { x: p.x - R - 1.2, y: p.y + 1.2, anchor: 'end' },
  ];
  const gap = (c: Caption) => {
    const [x0, y0, x1, y1] = box(c.x, c.y, c.anchor);
    if (x0 < 1 || y0 < 1 || x1 > 99 || y1 > 99) return -Infinity;
    const d = (q: Pt) => Math.hypot(Math.max(x0 - q.x, 0, q.x - x1), Math.max(y0 - q.y, 0, q.y - y1));
    let score = Infinity;
    points.forEach((q, k) => {
      if (k !== i) score = Math.min(score, d(q) - R);
    });
    for (let k = 1; k < points.length; k++) {
      const [a, b] = [points[k - 1], points[k]];
      for (let s = 0; s <= 24; s++) {
        const q = { x: a.x + ((b.x - a.x) * s) / 24, y: a.y + ((b.y - a.y) * s) / 24 };
        if (Math.hypot(q.x - p.x, q.y - p.y) > R) score = Math.min(score, d(q));
      }
    }
    return score;
  };
  const scored = candidates.map((c) => ({ c, g: gap(c) }));
  return (scored.find((x) => x.g >= 2.5) ?? scored.reduce((a, b) => (b.g > a.g ? b : a))).c;
}

function Board({
  labels,
  points,
  done,
  wrong,
  onTap,
}: {
  labels: string[];
  points: Pt[];
  done: number;
  wrong: number | null;
  onTap: (i: number, t: number) => void;
}) {
  const captions = useMemo(
    () => [
      ['Başla', placeCaption(0, 'Başla', points)],
      ['Son', placeCaption(points.length - 1, 'Son', points)],
    ] as const,
    [points],
  );
  return (
    <svg
      viewBox="0 0 100 100"
      className="mx-auto block aspect-square w-full max-w-[34rem] touch-none rounded-2xl border border-rule bg-surface select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
      style={{ width: BOARD_WIDTH }}
      aria-label="Birleştirilecek daireler"
    >
      {done > 1 && (
        <polyline
          points={points
            .slice(0, done)
            .map((p) => `${p.x},${p.y}`)
            .join(' ')}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth={0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {points.map((p, i) => {
        const isDone = i < done;
        const isWrong = wrong === i;
        return (
          <g
            key={i}
            className="cursor-pointer"
            onPointerDown={(e) => {
              if (!primaryPointer(e)) return;
              e.preventDefault();
              onTap(i, e.timeStamp);
            }}
          >
            <circle cx={p.x} cy={p.y} r={HIT} fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={R}
              fill={isDone ? 'var(--ink)' : isWrong ? 'var(--danger-bg)' : 'var(--surface)'}
              stroke={isWrong ? 'var(--danger)' : 'var(--ink)'}
              strokeWidth={isWrong ? 1.2 : 0.45}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={4.3}
              fontWeight={700}
              fill={isDone ? 'var(--paper)' : 'var(--ink)'}
              style={{ pointerEvents: 'none' }}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
      {captions.map(([text, c]) => (
        <text key={text} x={c.x} y={c.y} textAnchor={c.anchor} fontSize={3.4} fontWeight={700} fill="var(--ink-2)" style={{ pointerEvents: 'none' }}>
          {text}
        </text>
      ))}
    </svg>
  );
}

/**
 * Sırayla birleştirme görevi (iz sürme düzeni): daireler sırayla dokunularak birleştirilir. Süre, bölüm
 * başladığı (daireler ekrana geldiği) andan son daireye dokunulana kadar ölçülür; yanlış dokunuşlarda süre işlemeye
 * devam eder. Bir bölüm en çok `maxMs` sürer. Sayfa gizlenirse (başka sekme, ekran kilidi) süre durur; dönülünce
 * tahta yeniden gösterilir ve süre kaldığı yerden işler.
 */
export function Trail({ task, onDone }: { task: TrailTask; onDone: (parts: TrailPartInput[]) => void }) {
  const [partIdx, setPartIdx] = useState(0);
  const [step, setStep] = useState<Step>('part-intro');
  const [done, setDone] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const doneRef = useRef(0);
  /** Bölümün başladığı an; duraklatmada geçen süre kadar ileri kaydırılır. 0: henüz başlamadı. */
  const t0 = useRef(0);
  const guardUntil = useRef(Infinity);
  const pausedAt = useRef(0);
  const limit = useRef<number | undefined>(undefined);
  const taps = useRef<number[]>([]);
  const times = useRef<number[]>([]);
  const wrongTaps = useRef(0);
  const results = useRef<TrailPartInput[]>([]);
  const finished = useRef(false);
  const boardArea = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const part = task.parts[partIdx];
  const board = step === 'practice' ? part.practice : { labels: part.labels, points: part.points };
  const isLast = partIdx + 1 >= task.parts.length;

  const reset = () => {
    doneRef.current = 0;
    setDone(0);
    setWrong(null);
    setHint(null);
  };

  const clearLimit = () => {
    window.clearTimeout(limit.current);
    limit.current = undefined;
  };

  function armLimit(ms: number) {
    clearLimit();
    limit.current = window.setTimeout(() => finishPart(null), Math.max(0, ms));
  }

  function nextPart() {
    if (isLast) {
      onDoneRef.current(results.current);
    } else {
      reset();
      setPartIdx(partIdx + 1);
      setStep('part-intro');
    }
  }

  /** Bölümü bitirir: `t` son dokunuşun zamanı; null ise süre doldu. */
  function finishPart(t: number | null) {
    if (finished.current) return;
    finished.current = true;
    clearLimit();
    results.current.push({
      index: partIdx,
      response: { taps: [...taps.current], times: [...times.current] },
      rtMs: t === null ? task.maxMs : Math.min(task.maxMs, t),
    });
    if (t === null) setStep('timeout');
    else nextPart();
  }

  // Tahta ekrana gelince, üstündeki durum satırıyla birlikte görünür alana kaydırılır (dizüstünde tahtanın altı
  // ekranın dışında kalmasın).
  useEffect(() => {
    if ((step === 'run' || step === 'practice') && !paused) boardArea.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [step, paused, partIdx]);

  // Bölüm başlayınca süre işlemeye başlar; en uzun süre dolunca bölüm biter.
  useEffect(() => {
    if (step !== 'run') return;
    finished.current = false;
    taps.current = [];
    times.current = [];
    wrongTaps.current = 0;
    t0.current = 0;
    guardUntil.current = Infinity;
    const frame = requestAnimationFrame(() => {
      t0.current = performance.now();
      guardUntil.current = t0.current + TAP_GUARD_MS;
      armLimit(task.maxMs);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearLimit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, partIdx]);

  usePageHidden(step === 'run' && !paused, () => {
    if (finished.current || !t0.current) return;
    pausedAt.current = performance.now();
    clearLimit();
    setPaused(true);
  });

  function resume() {
    const now = performance.now();
    t0.current += now - pausedAt.current;
    guardUntil.current = now + TAP_GUARD_MS;
    armLimit(task.maxMs - (now - t0.current));
    setPaused(false);
  }

  function flashWrong(i: number) {
    setWrong(i);
    window.setTimeout(() => setWrong((w) => (w === i ? null : w)), 450);
  }

  function tap(i: number, ts: number) {
    const next = doneRef.current;
    if (step === 'practice') {
      if (next >= board.labels.length) return;
      if (i === next) {
        doneRef.current = next + 1;
        setDone(next + 1);
        setHint(null);
        if (next + 1 === board.labels.length) window.setTimeout(() => setStep('ready'), 700);
      } else if (i > next) {
        flashWrong(i);
        setHint(`Sıradaki daire: ${board.labels[next]}`);
      }
      return;
    }
    if (step !== 'run' || paused || finished.current || !t0.current || ts < guardUntil.current) return;
    // Daha önce birleştirilmiş bir daireye dokunmak yok sayılır (kaydedilmez).
    if (i < next) return;
    const prev = times.current.length ? times.current[times.current.length - 1] : 0;
    const t = Math.max(prev, Math.min(task.maxMs, Math.round(ts - t0.current)));
    if (i === next) {
      taps.current.push(i);
      times.current.push(t);
      doneRef.current = next + 1;
      setDone(next + 1);
      if (next + 1 === part.labels.length) finishPart(t);
    } else {
      flashWrong(i);
      if (wrongTaps.current < MAX_WRONG_TAPS) {
        wrongTaps.current++;
        taps.current.push(i);
        times.current.push(t);
      }
    }
  }

  if (step === 'part-intro') {
    const b = part.key === 'b';
    return (
      <div key={`${step}-${partIdx}`} className="flex flex-col items-center gap-6 text-center">
        <h2 className="t-h2">
          {partIdx + 1}. bölüm: {part.name}
        </h2>
        <p className="measure text-lg">
          {b
            ? 'Bu kez bir sayıya, bir harfe sırayla dokun: 1, A, 2, B, 3, C… Harfler alfabe sırasıyla ilerler: A, B, C, Ç, D, E, F, G.'
            : '1’den başlayarak dairelere sırayla dokun (bilgisayarda tıkla): 1, 2, 3… Dokunduğun daireler bir çizgiyle birleşecek.'}{' '}
          Önce {part.practice.labels.length} dairelik kısa bir alıştırma yapacaksın.
        </p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            reset();
            setStep('practice');
          }}
        >
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'ready') {
    return (
      <div key={`${step}-${partIdx}`} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Alıştırma bitti. Şimdi asıl bölüm başlıyor: {part.labels.length} daire. Daireler ekrana gelince süre başlar. Olabildiğince hızlı ve
          dikkatli ol; yanlış bir daireye dokunursan doğrusunu bulup devam et.
        </p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            reset();
            setStep('run');
          }}
        >
          Başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'timeout') {
    return (
      <div key={`${step}-${partIdx}`} className="flex flex-col items-center gap-6 text-center">
        <h2 className="t-h2">Süre doldu</h2>
        <p className="measure text-lg">
          Bu bölüm için ayrılan {Math.round(task.maxMs / 1000)} saniye doldu; {part.labels.length} dairenin {done} tanesini birleştirdin. Sorun
          değil, {isLast ? 'görev burada bitiyor.' : 'sıradaki bölüme geçebilirsin.'}
        </p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={nextPart}>
          {isLast ? 'Bitir' : 'Sonraki bölüme geç'}
        </ArmedButton>
      </div>
    );
  }

  if (paused) {
    return <PausedScreen note="Süre sen yokken durdu; devam edince kaldığı yerden işlemeye başlar." onResume={resume} />;
  }

  return (
    <div ref={boardArea} className="flex flex-col gap-4">
      <StatusLine>{step === 'practice' ? (hint ?? 'Alıştırma: dairelere sırayla dokun.') : `${partIdx + 1}. bölüm: ${part.name}`}</StatusLine>
      <Board labels={board.labels} points={board.points} done={done} wrong={wrong} onTap={tap} />
    </div>
  );
}
