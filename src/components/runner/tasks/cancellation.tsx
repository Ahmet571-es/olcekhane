'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cancellationSheet, isTarget } from '@/lib/instruments/cancellation';
import type { CancellationTask } from '@/lib/instruments/types';
import type { CancellationSectionInput } from '@/lib/scoring/tasks';
import { PausedScreen, afterPaint, usePageHidden } from './common';

type Step = 'ready' | 'practice' | 'practice-check' | 'countdown' | 'section' | 'done';
type CellState = 'off' | 'on' | 'hit' | 'miss' | 'wrong';

/** Bölümden önceki geri sayım (saniye). */
const COUNTDOWN = 3;

const CELL_STYLE: Record<CellState, string> = {
  off: 'hover:bg-surface-2',
  on: 'bg-marker/10',
  hit: 'bg-ok-bg',
  miss: 'outline-2 outline-dashed -outline-offset-4 outline-warn',
  wrong: 'bg-danger-bg',
};

/** Tek harf. Yalnızca kendi durumu değişince yeniden çizilir; sayfada yüzlerce harf vardır. */
const Cell = memo(function Cell({
  index,
  letter,
  state,
  onToggle,
}: {
  index: number;
  letter: string;
  state: CellState;
  onToggle?: (index: number, timeStamp: number) => void;
}) {
  const slashed = state === 'on' || state === 'hit' || state === 'wrong';
  return (
    <button
      type="button"
      aria-pressed={slashed}
      disabled={!onToggle}
      onClick={onToggle ? (e) => onToggle(index, e.timeStamp) : undefined}
      className={`relative flex h-11 touch-manipulation items-center justify-center text-[1.45rem] leading-none select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] focus-visible:z-10 disabled:cursor-default sm:h-12 sm:text-[1.7rem] ${CELL_STYLE[state]}`}
    >
      {letter}
      {slashed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[2.5px] w-[68%] -translate-x-1/2 -translate-y-1/2 -rotate-[58deg] rounded-full bg-marker"
        />
      )}
    </button>
  );
});

/** Harf sayfası: satırlar ince çizgilerle ayrılır, göz satırı kaybetmesin. */
function Sheet({
  letters,
  columns,
  marked,
  targets,
  feedback,
  onToggle,
  label,
}: {
  letters: string[];
  columns: number;
  marked: ReadonlySet<number>;
  targets: string[];
  feedback?: boolean;
  onToggle?: (index: number, timeStamp: number) => void;
  label: string;
}) {
  const rows = Math.ceil(letters.length / columns);
  return (
    <div role="group" aria-label={label} className="overflow-hidden rounded-xl border border-rule bg-surface">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid border-b border-rule last:border-b-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {letters.slice(r * columns, (r + 1) * columns).map((letter, c) => {
            const i = r * columns + c;
            const on = marked.has(i);
            const t = targets.includes(letter);
            const state: CellState = feedback ? (on ? (t ? 'hit' : 'wrong') : t ? 'miss' : 'off') : on ? 'on' : 'off';
            return <Cell key={i} index={i} letter={letter} state={state} onToggle={onToggle} />;
          })}
        </div>
      ))}
    </div>
  );
}

/** Açıklamadaki örnek harf: sayfadaki harflerle aynı görünüm. */
function Swatch({ letter, state }: { letter: string; state: CellState }) {
  return (
    <span aria-hidden="true" className={`relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-rule text-lg leading-none ${CELL_STYLE[state]}`}>
      {letter}
      {state !== 'miss' && state !== 'off' && (
        <span className="pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-[70%] -translate-x-1/2 -translate-y-1/2 -rotate-[58deg] rounded-full bg-marker" />
      )}
    </span>
  );
}

function Targets({ letters, size = 'lg' }: { letters: string[]; size?: 'sm' | 'lg' }) {
  return (
    <span className="inline-flex gap-1.5">
      <span className="sr-only">Aranan harfler: {letters.join(', ')}</span>
      {letters.map((l) => (
        <span
          key={l}
          aria-hidden="true"
          className={`inline-flex items-center justify-center rounded-lg border-[1.5px] border-ink bg-surface leading-none font-bold ${size === 'lg' ? 'h-14 w-14 text-[2rem]' : 'h-9 w-9 text-[1.35rem]'}`}
        >
          {l}
        </span>
      ))}
    </span>
  );
}

/** Kalan süre; her bölümde yeniden kurulur, sayfanın geri kalanını yeniden çizdirmez. */
function SectionTimer({ startedAt, durationMs }: { startedAt: number | null; durationMs: number }) {
  const [left, setLeft] = useState(durationMs);
  useEffect(() => {
    if (startedAt === null) return;
    const id = window.setInterval(() => setLeft(Math.max(0, durationMs - (performance.now() - startedAt))), 250);
    return () => window.clearInterval(id);
  }, [startedAt, durationMs]);
  const pct = (left / durationMs) * 100;
  return (
    <div className="flex min-w-[7rem] flex-1 items-center gap-2" aria-hidden="true">
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular w-12 text-right text-ink-3">{Math.ceil(left / 1000)} sn</span>
    </div>
  );
}

/**
 * Harf işaretleme: süreli bölümlerde, satır satır dizilmiş harfler arasında aranan harflere dokunulur.
 * Sayfalar tarayıcıda rastgele üretilen tohumdan üretilir (sunucu aynı tohumla aynı sayfayı üretip puanlar).
 * Her bölüm tam süre sürer; süre dolunca işaretler ve işaretlenme zamanları sayfada tutulur, sonraki bölüm
 * kısa bir geri sayımla başlar. Sayfa gizlenince (başka sekme ya da uygulama) süre durur: dönülünce aynı sayfada,
 * kaldığı yerden ve kalan süreyle devam edilir; gizli kalınan süre ölçüme girmez. Geri sayımda gizlenirse geri sayım
 * yeniden başlar.
 */
export function Cancellation({
  task,
  seed,
  onDone,
}: {
  task: CancellationTask;
  seed: string;
  onDone: (sections: CancellationSectionInput[]) => void;
}) {
  const sheet = useMemo(() => cancellationSheet(task, seed), [task, seed]);
  const practice = useMemo(() => task.practice.flat(), [task.practice]);
  const [step, setStep] = useState<Step>('ready');
  const [section, setSection] = useState(0);
  const [count, setCount] = useState(COUNTDOWN);
  const [marked, setMarked] = useState<ReadonlySet<number>>(() => new Set());
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  /** Bölüm duraklatıldıysa duraklatmanın başladığı an. */
  const pausedAt = useRef<number | null>(null);

  // İşaretler ve zamanları olay işleyicilerinde güncellenir; ekrandaki durum `marked` ile çizilir.
  const marks = useRef(new Map<number, number>());
  const unmarks = useRef(0);
  const active = useRef(false);
  const start = useRef(0);
  const deadline = useRef(Infinity);
  const results = useRef<CancellationSectionInput[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const toggle = useCallback((i: number, timeStamp: number) => {
    if (!active.current || timeStamp > deadline.current) return;
    const m = marks.current;
    if (m.has(i)) {
      m.delete(i);
      unmarks.current += 1;
    } else {
      m.set(i, Math.max(0, Math.round(timeStamp - start.current)));
    }
    setMarked(new Set(m.keys()));
  }, []);

  const clearMarks = useCallback(() => {
    marks.current = new Map();
    unmarks.current = 0;
    setMarked(new Set());
  }, []);

  const startCountdown = useCallback((next: number) => {
    active.current = false;
    setSection(next);
    setCount(COUNTDOWN);
    setStartedAt(null);
    setStep('countdown');
  }, []);

  function startPractice() {
    clearMarks();
    start.current = 0;
    deadline.current = Infinity;
    active.current = true;
    setStep('practice');
  }

  // Geri sayım; sıfıra gelince yeni sayfa açılır.
  useEffect(() => {
    if (step !== 'countdown' || paused) return;
    wrap.current?.scrollIntoView({ block: 'start' });
    let n = COUNTDOWN;
    const id = window.setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCount(n);
        return;
      }
      window.clearInterval(id);
      clearMarks();
      setStep('section');
    }, 1000);
    return () => window.clearInterval(id);
  }, [step, clearMarks, paused]);

  // Bölüm: süre, sayfanın ekrana gerçekten çizildiği andan başlar ve tam süre sürer.
  useEffect(() => {
    if (step !== 'section') return;
    wrap.current?.scrollIntoView({ block: 'start' });
    let cancelled = false;
    let id = 0;
    const finish = () => {
      active.current = false;
      const elapsed = Math.min(task.sectionMs, Math.round(performance.now() - start.current));
      const entries = [...marks.current.entries()].sort((a, b) => a[0] - b[0]);
      results.current = [
        ...results.current.filter((r) => r.index !== section),
        {
          index: section,
          response: { marks: entries.map((e) => e[0]), times: entries.map((e) => e[1]), unmarks: unmarks.current },
          rtMs: elapsed,
        },
      ];
      if (section + 1 < task.sections) {
        startCountdown(section + 1);
        return;
      }
      setStep('done');
      onDoneRef.current([...results.current].sort((a, b) => a.index - b.index));
    };
    void afterPaint().then((t) => {
      if (cancelled) return;
      start.current = t;
      deadline.current = t + task.sectionMs;
      active.current = true;
      setStartedAt(t);
      id = window.setInterval(() => {
        if (pausedAt.current !== null) return;
        if (performance.now() >= deadline.current) {
          window.clearInterval(id);
          finish();
        }
      }, 100);
    });
    return () => {
      cancelled = true;
      active.current = false;
      window.clearInterval(id);
    };
  }, [step, section, task.sectionMs, task.sections, startCountdown]);

  usePageHidden((step === 'section' && startedAt !== null) || step === 'countdown', () => {
    if (paused) return;
    if (step === 'section') {
      pausedAt.current = performance.now();
      active.current = false;
    }
    setPaused(true);
  });

  /** Bölüme kaldığı yerden devam: gizli kalınan süre kadar başlangıç ve bitiş ileri alınır. */
  function resume() {
    if (step === 'section' && pausedAt.current !== null) {
      const d = performance.now() - pausedAt.current;
      start.current += d;
      deadline.current += d;
      pausedAt.current = null;
      active.current = true;
      setStartedAt(start.current);
    }
    if (step === 'countdown') setCount(COUNTDOWN);
    setPaused(false);
  }

  const targetList = task.targets.join(', ');

  if (step === 'ready') {
    return (
      <div ref={wrap} className="flex flex-col items-center gap-6 text-center">
        <Targets letters={task.targets} />
        <p className="measure text-lg">
          Aradığın harfler bunlar: <strong>{targetList}</strong>. Önce iki satırlık bir alıştırma yapalım. Satırlardaki bu harflerin hepsine dokun,
          sonra <strong>Bitirdim</strong> düğmesine bas.
        </p>
        <button type="button" className="btn btn-primary btn-lg" autoFocus onClick={startPractice}>
          Alıştırmaya başla
        </button>
      </div>
    );
  }

  if (step === 'practice' || step === 'practice-check') {
    const checking = step === 'practice-check';
    const total = practice.filter((l) => isTarget(task, l)).length;
    const hits = practice.filter((l, i) => isTarget(task, l) && marked.has(i)).length;
    const wrong = practice.filter((l, i) => !isTarget(task, l) && marked.has(i)).length;
    const missed = total - hits;
    return (
      <div ref={wrap} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-bold">Alıştırma</p>
          <Targets letters={task.targets} size="sm" />
        </div>
        <Sheet
          letters={practice}
          columns={task.columns}
          marked={marked}
          targets={task.targets}
          feedback={checking}
          onToggle={checking ? undefined : toggle}
          label="Alıştırma satırları"
        />
        {!checking ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-ink-2">Soldan sağa, harf harf ilerle. Yanlış işaretlediğin bir harfe yeniden dokunursan işaret kalkar.</p>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                active.current = false;
                setStep('practice-check');
              }}
            >
              Bitirdim
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1" aria-live="polite">
              <p className="text-lg font-bold">
                {hits === total && wrong === 0 ? 'Harika, hepsi doğru!' : `${total} aranan harften ${hits} tanesini buldun.`}
              </p>
              {missed > 0 && <p>Kesikli çerçeveli {missed} harfi atladın.</p>}
              {wrong > 0 && <p>Kırmızı zeminli {wrong} harf aranan harflerden değildi.</p>}
            </div>
            <ul className="t-small flex flex-wrap gap-x-5 gap-y-2 text-ink-2">
              <li className="flex items-center gap-2">
                <Swatch letter="a" state="hit" /> doğru işaret
              </li>
              <li className="flex items-center gap-2">
                <Swatch letter="d" state="miss" /> atlanan harf
              </li>
              <li className="flex items-center gap-2">
                <Swatch letter="o" state="wrong" /> yanlış işaret
              </li>
            </ul>
            <p className="measure text-lg">
              Şimdi asıl görev başlıyor: {task.sections} bölüm, her biri {Math.round(task.sectionMs / 1000)} saniye. Sayfa aşağı doğru devam eder;
              süre dolunca bir sonraki bölüm kendiliğinden başlar. Hem hızlı hem dikkatli olmaya çalış.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary btn-lg" autoFocus onClick={() => startCountdown(0)}>
                Göreve başla
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={startPractice}>
                Alıştırmayı tekrarla
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'countdown' && paused) {
    return <PausedScreen note="Bölüm başlamadan önceki geri sayım yeniden başlayacak." cta="Devam et" onResume={resume} />;
  }

  if (step === 'countdown') {
    return (
      <div ref={wrap} className="flex flex-col items-center gap-5 py-6 text-center" aria-live="polite">
        <p className="t-meta">
          Bölüm {section + 1} / {task.sections}
        </p>
        <Targets letters={task.targets} />
        <p className="text-lg">
          {section === 0 ? 'Hazır ol. İlk satırdan başla.' : 'Yeni bir sayfa geliyor. Yine ilk satırdan başla.'}
        </p>
        <p className="tabular font-display text-6xl font-bold">{count}</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <p className="text-center text-lg" aria-live="polite">
        Görev bitti.
      </p>
    );
  }

  return (
    <div ref={wrap} className="flex flex-col gap-3" key={section}>
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule bg-paper/95 px-1 py-2 backdrop-blur-sm">
        <span className="t-meta tabular">
          Bölüm {section + 1} / {task.sections}
        </span>
        <Targets letters={task.targets} size="sm" />
        <SectionTimer startedAt={startedAt} durationMs={task.sectionMs} />
      </div>
      <Sheet
        letters={sheet[section]}
        columns={task.columns}
        marked={marked}
        targets={task.targets}
        onToggle={toggle}
        label={`Harf sayfası, bölüm ${section + 1}: ${targetList} harflerine dokun`}
      />
      <p className="t-small py-6 text-center text-ink-3">Sayfanın sonuna geldin. Süre dolunca sonraki bölüm kendiliğinden başlar.</p>
      {paused && (
        // Sayfa yerinde kalır (kaydırma konumu korunur); üstünü duraklatma ekranı örter.
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper p-4">
          <PausedScreen note="Süre de durdu; sayfada kaldığın yerden, kalan sürenle devam edeceksin." onResume={resume} />
        </div>
      )}
    </div>
  );
}
