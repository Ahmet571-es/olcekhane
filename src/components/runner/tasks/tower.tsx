'use client';

import { useEffect, useRef, useState } from 'react';
import {
  TOWER_BALLS,
  TOWER_CAPACITY,
  TOWER_MAX_MOVES,
  TOWER_PEGS,
  towerCode,
  towerMove,
  towerSame,
  towerSpeech,
  type TowerBall,
} from '@/lib/instruments/tower';
import type { TowerPracticeProblem, TowerProblem, TowerState, TowerTask } from '@/lib/instruments/types';
import type { TowerTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, useKeys, usePageHidden } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/** Problemin sonu: hedefe ulaşıldı (hamle sayısıyla), süre doldu ya da hamle sınırına ulaşıldı. */
type Ending = { kind: 'solved'; moves: number } | { kind: 'timeout' } | { kind: 'cap' };

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);

/* Çizim ölçüleri (SVG birimi). Tahta her zaman açık zeminde çizilir: renkler açık ve koyu temada aynıdır. */
const PANEL_BG = '#e9edf3';
const PEG = '#5b6473';
const BASE = '#3f4652';
const R = 19;
const D = 2 * R + 2;
const W = 300;
const H = 196;
const BASE_Y = 178;
const PEG_X = [50, 150, 250];
/** Alınan top, bütün çubukların üstünde, kendi çubuğunun hizasında durur. */
const LIFT_Y = BASE_Y - 3 * D - R - 12;

function Ball({ ball, x, y, held }: { ball: TowerBall; x: number; y: number; held?: boolean }) {
  const b = TOWER_BALLS[ball];
  return (
    <g>
      {held && <circle cx={x} cy={y} r={R + 5} fill="none" stroke="#111827" strokeWidth={3} strokeDasharray="5 4" />}
      <circle cx={x} cy={y} r={R} fill={b.fill} stroke="#1f2937" strokeWidth={1.5} />
      <text x={x} y={y + 6.5} textAnchor="middle" fontSize={18} fontWeight={700} fill={b.ink} fontFamily="system-ui, sans-serif">
        {ball}
      </text>
    </g>
  );
}

/** Üç çubuk ve toplar. `held`: alınmış topun çubuğu (top, çubukların üstünde gösterilir). */
function Board({ state, held }: { state: TowerState; held?: number | null }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
      <rect x={0} y={0} width={W} height={H} rx={14} fill={PANEL_BG} />
      {PEG_X.map((x, i) => (
        <rect key={i} x={x - 4} y={BASE_Y - TOWER_CAPACITY[i] * D - 6} width={8} height={TOWER_CAPACITY[i] * D + 6} rx={4} fill={PEG} />
      ))}
      <rect x={14} y={BASE_Y} width={W - 28} height={10} rx={5} fill={BASE} />
      {state.map((peg, i) =>
        [...peg].map((ball, k) => {
          const lifted = held === i && k === peg.length - 1;
          return <Ball key={`${i}-${k}`} ball={ball as TowerBall} x={PEG_X[i]} y={lifted ? LIFT_Y : BASE_Y - R - 1 - k * D} held={lifted} />;
        }),
      )}
    </svg>
  );
}

/** Alıştırmada fazla hamle yapılınca gösterilen en az hamleli çözüm: "Mavi topu sağdaki çubuğa koy." */
function solutionSteps(p: TowerPracticeProblem): string[] {
  let s: TowerState = p.start;
  return p.solution.map(([from, to]) => {
    const ball = s[from - 1].slice(-1) as TowerBall;
    s = towerMove(s, from - 1, to - 1) ?? s;
    return `${cap(TOWER_BALLS[ball].name)} topu ${TOWER_PEGS[to - 1]} çubuğa koy.`;
  });
}

/**
 * Kule görevi (Londra Kulesi düzeni): alttaki tahtadaki toplar, üstteki hedefle aynı düzene getirilir. Bir topu almak için
 * çubuğuna, koymak için başka bir çubuğa dokunulur (klavyede 1, 2, 3 tuşları); aynı çubuğa yeniden dokunmak topu yerine
 * bırakır ve hamle sayılmaz. Yapılan hamle geri alınamaz. En az hamle sayısı ekranda yazar.
 *
 * Asıl problemlerde süre, tahta ekrana çizildiği andan başlar ve `limitMs` sonra dolar. Taşınan ilk topun alındığı an
 * (başlamadan önce düşünme süresi; Freiburg sürümündeki gibi: alınıp yerine bırakılan top sayılmaz) ve her hamlenin anı
 * kaydedilir. Sayfa gizlenirse (başka sekme, ekran kilidi) süre durur; dönülünce
 * kaldığı yerden işler. Alıştırmada süre yoktur; fazla hamle yapılırsa en az hamleli çözüm gösterilir.
 */
export function Tower({ task, onDone }: { task: TowerTask; onDone: (trials: TowerTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [board, setBoard] = useState<TowerState>(task.practice[0].start);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(1);
  /** Aynı problem yeniden başlatılınca (alıştırmada) da hazırlık yeniden yapılsın diye artar. */
  const [round, setRound] = useState(0);
  const out = useRef<TowerTrialInput[]>([]);
  /** Problemin başladığı an (duraklatmada geçen süre kadar ileri kaydırılır); 0: tahta henüz çizilmedi. */
  const t0 = useRef(0);
  const pausedAt = useRef(0);
  const pick = useRef<number | null>(null);
  /** Elde tutulan topun alındığı an: top taşınırsa ve bu ilk hamleyse başlamadan önce düşünme süresi olur. */
  const heldAt = useRef<number | null>(null);
  const codes = useRef<number[]>([]);
  const times = useRef<number[]>([]);
  const finished = useRef(false);
  const limit = useRef<number | undefined>(undefined);
  const top = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const practice = step === 'practice';
  const testing = step === 'test';
  const list: TowerProblem[] = practice ? task.practice : task.items;
  const item = list[index];

  const clearLimit = () => {
    window.clearTimeout(limit.current);
    limit.current = undefined;
  };

  /** Problemi bitirir (asıl problemlerde kaydeder). `t`: son hamlenin anı (ms); süre dolduysa `null`. */
  function finish(e: Ending, t: number | null) {
    if (finished.current) return;
    finished.current = true;
    clearLimit();
    if (testing) {
      out.current.push({
        index,
        response: { moves: [...codes.current], times: [...times.current], pick: pick.current },
        rtMs: e.kind === 'solved' && t !== null ? t : task.limitMs,
      });
    }
    setHeld(null);
    setEnding(e);
  }

  function armLimit(ms: number) {
    clearLimit();
    limit.current = window.setTimeout(() => finish({ kind: 'timeout' }, null), Math.max(0, ms));
  }

  // Yeni problem: tahta başlangıç düzenine döner; asıl problemlerde süre tahta çizilince başlar.
  useEffect(() => {
    if (!practice && !testing) return;
    let alive = true;
    finished.current = false;
    pick.current = null;
    heldAt.current = null;
    codes.current = [];
    times.current = [];
    t0.current = 0;
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
    if (testing) {
      void afterPaint().then((t) => {
        if (!alive) return;
        t0.current = t;
        armLimit(task.limitMs);
      });
    }
    return () => {
      alive = false;
      clearLimit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, index, round]);

  // Kalan süre çubuğu (yalnızca asıl problemlerde).
  useEffect(() => {
    if (!testing || ending || paused) return;
    const id = window.setInterval(() => {
      if (!t0.current) return;
      setLeft(Math.max(0, 1 - (performance.now() - t0.current) / task.limitMs));
    }, 250);
    return () => window.clearInterval(id);
  }, [testing, ending, paused, index, round, task.limitMs]);

  usePageHidden(testing && !ending && !paused, () => {
    if (finished.current || !t0.current) return;
    pausedAt.current = performance.now();
    clearLimit();
    setPaused(true);
  });

  function resume() {
    const now = performance.now();
    t0.current += now - pausedAt.current;
    armLimit(task.limitMs - (now - t0.current));
    setPaused(false);
  }

  function load(nextStep: Step, nextIndex: number) {
    const p = (nextStep === 'practice' ? task.practice : task.items)[nextIndex];
    setBoard(p.start);
    setHeld(null);
    setMoves(0);
    setHint(null);
    setEnding(null);
    setLeft(1);
    setIndex(nextIndex);
    setStep(nextStep);
    setRound((r) => r + 1);
  }

  /** Bir çubuğa dokunuş (ya da 1–3 tuşu). `ts`: olayın zaman damgası (performance.now ile aynı saat). */
  function tap(i: number, ts: number) {
    if (!item || ending || paused || finished.current) return;
    if (testing && !t0.current) return;
    const at = testing ? Math.max(0, Math.min(task.limitMs, Math.round(ts - t0.current))) : 0;
    if (held === null) {
      if (board[i].length === 0) {
        setHint(`${cap(TOWER_PEGS[i])} çubukta top yok. Almak istediğin topun çubuğuna dokun.`);
        return;
      }
      setHeld(i);
      heldAt.current = at;
      const ball = board[i].slice(-1) as TowerBall;
      setHint(`${cap(TOWER_BALLS[ball].name)} topu aldın. Koymak istediğin çubuğa dokun; vazgeçersen aynı çubuğa yeniden dokun.`);
      return;
    }
    if (held === i) {
      setHeld(null);
      heldAt.current = null;
      setHint('Topu yerine bıraktın.');
      return;
    }
    const next = towerMove(board, held, i);
    if (!next) {
      setHint(`${cap(TOWER_PEGS[i])} çubuk dolu: en çok ${TOWER_CAPACITY[i]} top alır. Başka bir çubuğa dokun.`);
      return;
    }
    const n = moves + 1;
    if (testing) {
      if (codes.current.length === 0) pick.current = Math.min(heldAt.current ?? at, at);
      const prev = times.current.length ? times.current[times.current.length - 1] : (pick.current ?? 0);
      codes.current.push(towerCode(held, i));
      times.current.push(Math.max(prev, at));
    }
    setBoard(next);
    setHeld(null);
    heldAt.current = null;
    setMoves(n);
    setHint(null);
    if (towerSame(next, item.goal)) finish({ kind: 'solved', moves: n }, testing ? times.current[times.current.length - 1] : null);
    else if (testing && n >= TOWER_MAX_MOVES) finish({ kind: 'cap' }, null);
  }

  useKeys((practice || testing) && !ending && !paused, (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (/^[1-3]$/.test(e.key) && !e.repeat) {
      e.preventDefault();
      tap(Number(e.key) - 1, e.timeStamp);
    } else if (e.key === 'Escape' && held !== null) {
      e.preventDefault();
      setHeld(null);
      heldAt.current = null;
      setHint('Topu yerine bıraktın.');
    }
  });

  function next() {
    if (practice) {
      if (index + 1 < task.practice.length) load('practice', index + 1);
      else setStep('practice-done');
    } else if (index + 1 < task.items.length) {
      load('test', index + 1);
    } else {
      onDoneRef.current(out.current);
    }
  }

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <div className="w-full max-w-[18rem]">
          <Board state={task.practice[0].start} />
        </div>
        <p className="measure text-lg">
          Üç çubuk var: soldaki 3, ortadaki 2, sağdaki 1 top alır. Bir topu almak için çubuğuna, koymak için başka bir çubuğa dokun. Bir seferde yalnızca en
          üstteki top alınabilir.
        </p>
        <p className="measure text-lg">Önce {countWord(task.practice.length)} alıştırma problemi çözelim. Alıştırmada süre yok.</p>
        <p className="measure text-ink-2">Bilgisayarda çubukları 1, 2 ve 3 tuşlarıyla da seçebilirsin.</p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => load('practice', 0)}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Alıştırma bitti. Şimdi asıl problemler başlıyor: {task.items.length} problem var ve her problem için 1 dakika süren var. Problemler kısadan uzuna
          doğru gider.
        </p>
        <p className="measure text-lg">
          Topa dokunmadan önce çözümü kafanda düşün; yaptığın hamle geri alınamaz. Her problemde en az kaç hamle gerektiği yazar.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton className="btn btn-secondary btn-lg" onClick={() => load('practice', 0)}>
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => load('test', 0)}>
            Teste başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (paused) {
    return <PausedScreen note="Problemin süresi de durdu; döndüğünde kaldığı yerden işler." onResume={resume} />;
  }

  if (!item) return null;
  const pegLabel = (i: number) => {
    const balls = board[i];
    const content = balls.length === 0 ? 'boş' : `alttan üste ${[...balls].map((b) => TOWER_BALLS[b as TowerBall].name).join(', ')}`;
    return `${cap(TOWER_PEGS[i])} çubuk, ${TOWER_CAPACITY[i]} top alır: ${content}${held === i ? '. En üstteki top elinde.' : ''}`;
  };
  const solved = ending?.kind === 'solved';
  const optimal = solved && ending.moves === item.minMoves;

  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-3">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Problem ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[26rem] flex-col gap-3">
        <figure className="mx-auto flex w-full max-w-[15rem] flex-col items-center gap-1">
          <figcaption className="text-sm font-bold tracking-wide text-ink-2 uppercase">Hedef</figcaption>
          <div role="img" aria-label={`Hedef: ${towerSpeech(item.goal)}`} className="w-full">
            <Board state={item.goal} />
          </div>
        </figure>
        <div className="flex items-center justify-center gap-4 text-lg">
          <span>
            En az <strong className="tabular">{item.minMoves}</strong> hamle
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Yaptığın hamle: <strong className="tabular">{moves}</strong>
          </span>
        </div>
        {testing && (
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-label="Kalan süre (saniye)"
            aria-valuemin={0}
            aria-valuemax={Math.round(task.limitMs / 1000)}
            aria-valuenow={Math.round((left * task.limitMs) / 1000)}
          >
            <div className="h-full rounded-full bg-brass" style={{ width: `${Math.round(left * 1000) / 10}%` }} />
          </div>
        )}
        <p className="-mb-2 text-center text-sm font-bold tracking-wide text-ink-2 uppercase" aria-hidden="true">
          Senin tahtan
        </p>
        <div className="relative w-full">
          <Board state={board} held={held} />
          {!ending && (
            <div className="absolute inset-0 grid grid-cols-3" role="group" aria-label="Senin tahtan">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={pegLabel(i)}
                  aria-pressed={held === i}
                  onClick={(e) => tap(i, e.timeStamp)}
                  className={`h-full w-full rounded-xl focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-ink ${TOUCH_CLASSES}`}
                />
              ))}
            </div>
          )}
        </div>
        {ending ? (
          <div className="flex flex-col items-center gap-3 text-center" aria-live="polite">
            <p className={`text-xl font-bold ${optimal ? 'text-ok' : 'text-ink'}`}>
              {ending.kind === 'timeout'
                ? 'Süre doldu.'
                : ending.kind === 'cap'
                  ? 'Bu problemde hamle sınırına ulaştın.'
                  : optimal
                    ? 'Harika! En az hamlede çözdün.'
                    : `Hedefe ${ending.moves} hamlede ulaştın.`}
            </p>
            {practice && solved && !optimal && (
              <div className="measure flex flex-col gap-2 text-left text-lg">
                <p>Bu problem {item.minMoves} hamlede çözülebilirdi:</p>
                <ol className="list-decimal pl-6">
                  {solutionSteps(item as TowerPracticeProblem).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              {practice && (
                <ArmedButton
                  className={`btn btn-lg ${optimal ? 'btn-secondary' : 'btn-primary'}`}
                  autoFocus={!optimal}
                  delayMs={600}
                  onClick={() => load('practice', index)}
                >
                  Bu alıştırmayı yeniden dene
                </ArmedButton>
              )}
              <ArmedButton
                className={`btn btn-lg ${practice && !optimal ? 'btn-secondary' : 'btn-primary'}`}
                autoFocus={!practice || optimal}
                delayMs={600}
                onClick={next}
              >
                {practice ? (index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam') : index + 1 < task.items.length ? 'Sonraki problem' : 'Bitir'}
              </ArmedButton>
            </div>
          </div>
        ) : (
          <>
            <p className="min-h-[3.5rem] text-center text-ink-2" aria-live="polite">
              {hint ?? (held === null ? 'Almak istediğin topun çubuğuna dokun.' : 'Koymak istediğin çubuğa dokun.')}
            </p>
            {practice && moves > 0 && (
              <div className="flex justify-center">
                <button type="button" className="btn btn-secondary" onClick={() => load('practice', index)}>
                  Baştan başla
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
