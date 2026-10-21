'use client';

import { useEffect, useRef, useState } from 'react';
import type { PatternItem, PatternMemoryTask } from '@/lib/instruments/types';
import type { PatternTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';
type Phase = 'wait' | 'show' | 'input' | 'feedback';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Desen gösterilmeden önce boş ızgaranın ekranda kaldığı süre (ms): göz ızgaraya yerleşsin. */
const WAIT_MS = 900;
/** Desenler her zaman açık zeminde, koyu karelerle çizilir (açık ve koyu temada aynı). */
const PANEL_BG = '#ffffff';
const FILL = '#1f2937';
const EMPTY = '#ffffff';
const LINE = '#9ca3af';
const RIGHT = '#1b6e42';
const WRONG = '#c2410c';

/**
 * Bir karenin ekrandaki boyu: en büyük ızgara (6 sütun) 320 piksellik telefonda da sığar. Çıkarılan pay: sayfanın iki yan
 * boşluğu (2 × 1rem), ızgaranın iç boşluğu (2 × 0,5rem), kenarı (2 × 2px), yarım rem güvenlik payı ve kareler arasındaki
 * boşluklar ((sütun − 1) × 0,25rem).
 */
const cellSize = (cols: number) => `min(3.6rem, calc((100vw - ${3.75 + (cols - 1) * 0.25}rem) / ${cols}))`;

const PRACTICE_WORD = ['', 'bir', 'iki', 'üç'];
/** Yönergedeki örnek: asıl desenlerde ve alıştırmada olmayan (simetrik) bir desen. */
const EXAMPLE: Pick<PatternItem, 'rows' | 'cols' | 'cells'> = { rows: 2, cols: 3, cells: [1, 3, 5] };

/**
 * Kareli ızgara. `filled`: koyu kareler; `onToggle` verilirse kareler düğmedir (dokununca işaretlenir ya da işaret kalkar).
 * Klavyede ızgara tek bir sekme durağıdır: ok tuşları kareler arasında gezdirir, boşluk ya da Enter işaretler.
 */
function Grid({
  item,
  filled,
  onToggle,
  marks,
  label,
}: {
  item: Pick<PatternItem, 'rows' | 'cols'>;
  filled: ReadonlySet<number>;
  onToggle?: (i: number) => void;
  /** Alıştırmanın geri bildiriminde: doğru işaretlenen, unutulan ve fazladan işaretlenen kareler. */
  marks?: { hit: ReadonlySet<number>; missed: ReadonlySet<number>; extra: ReadonlySet<number> };
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focus, setFocus] = useState(0);
  const n = item.rows * item.cols;
  const size = cellSize(item.cols);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: item.cols, ArrowUp: -item.cols };
    if (!(e.key in step)) return;
    e.preventDefault();
    const next = i + step[e.key];
    if (next < 0 || next >= n) return;
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && Math.floor(next / item.cols) !== Math.floor(i / item.cols)) return;
    setFocus(next);
    refs.current[next]?.focus();
  };
  return (
    <div
      className={`mx-auto grid w-fit gap-1 rounded-xl border-2 border-ink p-2 ${TOUCH_CLASSES}`}
      style={{ gridTemplateColumns: `repeat(${item.cols}, ${size})`, background: PANEL_BG }}
      role={onToggle ? 'group' : 'img'}
      aria-label={label}
    >
      {Array.from({ length: n }, (_, i) => {
        const on = filled.has(i);
        const missed = marks?.missed.has(i);
        const extra = marks?.extra.has(i);
        const hit = marks?.hit.has(i);
        const style: React.CSSProperties = {
          width: size,
          height: size,
          background: on ? (marks ? (extra ? WRONG : RIGHT) : FILL) : EMPTY,
          border: `2px ${missed ? 'dashed' : 'solid'} ${missed ? RIGHT : on ? (marks ? (extra ? WRONG : RIGHT) : FILL) : LINE}`,
        };
        const where = `Satır ${Math.floor(i / item.cols) + 1}, sütun ${(i % item.cols) + 1}`;
        if (!onToggle) {
          return (
            <span
              key={i}
              className={`block rounded-md ${TOUCH_CLASSES}`}
              style={style}
              title={marks ? (hit ? 'Doğru' : missed ? 'Unutulan kare' : extra ? 'Desende olmayan kare' : undefined) : undefined}
            />
          );
        }
        return (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            tabIndex={focus === i ? 0 : -1}
            aria-pressed={on}
            aria-label={where}
            onFocus={() => setFocus(i)}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onToggle(i)}
            className={`block rounded-md transition-colors duration-75 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brass ${TOUCH_CLASSES}`}
            style={style}
          />
        );
      })}
    </div>
  );
}

/**
 * Desen hatırlama: desen `task.showMs` boyunca gösterilir, sonra boş ızgarada aynı kareler işaretlenir. Asıl bölümde bir
 * büyüklükteki üç desenin hiçbiri tam doğru değilse görev biter (sunucu aynı kuralı yeniden denetler). Desen gösterilirken
 * sayfa gizlenirse görev durur ve aynı desen baştan gösterilir; işaretlerken gizli geçen süre sayılmaz.
 */
export function PatternMemory({ task, onDone }: { task: PatternMemoryTask; onDone: (trials: PatternTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [phase, setPhase] = useState<Phase>('wait');
  const [index, setIndex] = useState(0);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [paused, setPaused] = useState(false);
  const [showKey, setShowKey] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [lastGood, setLastGood] = useState(false);
  const out = useRef<PatternTrialInput[]>([]);
  const levelHits = useRef(0);
  const inputAt = useRef(0);
  /** Desen şu an gösteriliyor mu ve gösterilirken sayfa gizlendiği için bu desen kaç kez baştan gösterildi. */
  const showing = useRef(false);
  const restarts = useRef(0);
  /** Son etkileşim klavyeyle mi? Odak yalnızca o zaman boş tablodaki kareye taşınır. */
  const viaKeys = useRef(false);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const flat = task.levels.flatMap((l) => l.items);
  const practice = step === 'practice';
  const item: PatternItem | undefined = practice ? task.practice[index] : step === 'test' ? flat[index] : undefined;
  const target = new Set(item?.cells ?? []);

  // Bekle → göster → işaretle.
  useEffect(() => {
    if ((step !== 'practice' && step !== 'test') || paused) return;
    if (phase !== 'wait' && phase !== 'show') return;
    const ac = new AbortController();
    (async () => {
      setPhase('wait');
      await wait(WAIT_MS, ac.signal);
      setPhase('show');
      showing.current = true;
      await afterPaint();
      await wait(task.showMs, ac.signal);
      showing.current = false;
      setMarked(new Set());
      hiddenMs.current = 0;
      hiddenSince.current = null;
      // Süre, boş tablo ekrana gelince başlar; sayfa o arada gizlenirse gizli süre ayrıca düşülür, başlangıç kaydırılmaz.
      inputAt.current = performance.now();
      setPhase('input');
      const painted = await afterPaint();
      if (!ac.signal.aborted && document.visibilityState === 'visible' && hiddenSince.current === null) inputAt.current = painted;
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showKey, paused, step]);

  // Desen gösterilirken (ya da hemen öncesinde) sayfa gizlenirse görev durur; dönülünce aynı desen baştan gösterilir.
  usePageHidden((step === 'practice' || step === 'test') && !paused && (phase === 'wait' || phase === 'show'), () => {
    if (showing.current) restarts.current++;
    showing.current = false;
    setPaused(true);
  });

  useEffect(() => {
    const keys = () => (viaKeys.current = true);
    const pointer = () => (viaKeys.current = false);
    window.addEventListener('keydown', keys, true);
    window.addEventListener('pointerdown', pointer, true);
    return () => {
      window.removeEventListener('keydown', keys, true);
      window.removeEventListener('pointerdown', pointer, true);
    };
  }, []);

  // Klavyeyle çözen biri için odak boş tablonun ilk karesine gelir (Tamam düğmesi desen gösterilirken devre dışı kalır).
  useEffect(() => {
    if (phase !== 'input' || !viaKeys.current) return;
    top.current?.querySelector<HTMLButtonElement>('button[aria-pressed][tabindex="0"]')?.focus({ preventScroll: true });
  }, [phase, showKey]);

  // İşaretlerken sayfanın gizli kaldığı süre sayılmaz.
  useEffect(() => {
    if (phase !== 'input') return;
    const on = () => {
      if (document.visibilityState === 'hidden') hiddenSince.current = performance.now();
      else if (hiddenSince.current !== null) {
        hiddenMs.current += performance.now() - hiddenSince.current;
        hiddenSince.current = null;
      }
    };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [phase]);

  useEffect(() => {
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
  }, [step, index]);

  function present() {
    setMarked(new Set());
    setPhase('wait');
    setShowKey((k) => k + 1);
  }

  function toggle(i: number) {
    if (phase !== 'input') return;
    setMarked((m) => {
      const next = new Set(m);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function submit(now: number, skip = false) {
    if (phase !== 'input' || !item) return;
    const cells = skip ? [] : [...marked].sort((a, b) => a - b);
    const good = cells.length === target.size && cells.every((c) => target.has(c));
    if (practice) {
      if (skip) setMarked(new Set());
      setLastGood(good);
      if (good) setPracticeScore((s) => s + 1);
      setPhase('feedback');
      return;
    }
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - inputAt.current - hidden)));
    out.current.push({ index, response: { cells, restarts: restarts.current }, rtMs });
    restarts.current = 0;
    if (good) levelHits.current++;
    const endOfLevel = (index + 1) % 3 === 0;
    if (endOfLevel) {
      const failed = levelHits.current === 0;
      levelHits.current = 0;
      if (failed || index + 1 >= flat.length) {
        onDone(out.current);
        return;
      }
    }
    setIndex(index + 1);
    present();
  }

  if (paused) {
    return (
      <PausedScreen
        note="Desen yarıda kaldığı için aynı desen baştan gösterilecek."
        cta="Deseni yeniden göster"
        onResume={() => {
          setPaused(false);
          present();
        }}
      />
    );
  }

  if (step === 'ready') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Ekranda kareli bir tablo göreceksin; karelerin bazıları koyu renkli olacak. Desen {task.showMs / 1000} saniye görünecek, sonra kaybolacak.
        </p>
        <figure className="flex flex-col items-center gap-2">
          <Grid item={EXAMPLE} filled={new Set(EXAMPLE.cells)} label={`Örnek desen: ${EXAMPLE.cells.length} koyu kare`} />
          <figcaption className="text-ink-2">Örnek bir desen</figcaption>
        </figure>
        <p className="measure text-lg">
          Desen kaybolunca boş tabloda koyu olan karelere dokunarak aynı deseni yap. Yanlış işaretlediğin bir kareye yeniden dokunursan işaret kalkar. Bitince “Tamam”
          düğmesine bas; hatırlamadığın bir desende “Hatırlamıyorum” düğmesine basabilirsin.
        </p>
        <p className="measure text-ink-2">Bilgisayarda ok tuşlarıyla kareler arasında gezinip boşluk tuşuyla işaretleyebilirsin.</p>
        <p className="measure text-lg">Önce {PRACTICE_WORD[task.practice.length] ?? task.practice.length} alıştırma deseni çözelim.</p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            setIndex(0);
            setPracticeScore(0);
            setStep('practice');
            present();
          }}
        >
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const all = practiceScore === task.practice.length;
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {all
            ? 'Alıştırma desenlerinin hepsini doğru yaptın.'
            : practiceScore === 0
              ? 'Alıştırma desenlerini doğru yapamadın. Desen görünürken bütün tabloya bak; koyu karelerin nerede toplandığını ve hangi satırlarda olduğunu fark etmeye çalış.'
              : `Alıştırmadaki ${task.practice.length} desenin ${practiceScore} tanesini doğru yaptın. Desen görünürken bütün tabloya bak; koyu karelerin nerede toplandığını fark etmeye çalış.`}{' '}
          {all ? 'Şimdi asıl test başlıyor.' : 'İstersen alıştırmayı tekrarlayabilirsin.'}
        </p>
        <p className="measure text-ink-2">
          Asıl testte artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin. Desenler {task.levels[0].cells} koyu kareden başlayıp giderek büyüyecek. Bir
          büyüklükteki üç desenin hiçbirini doğru yapamazsan test biter; büyük desenlerde zorlanmak olağandır.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${all ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!all}
            onClick={() => {
              setIndex(0);
              setPracticeScore(0);
              setStep('practice');
              present();
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${all ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={all}
            onClick={() => {
              setIndex(0);
              levelHits.current = 0;
              restarts.current = 0;
              out.current = [];
              setStep('test');
              present();
            }}
          >
            Teste başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (!item) return null;
  const status = practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Desen ${index + 1}`;
  const empty = new Set<number>();

  if (phase === 'feedback' && practice) {
    const hit = new Set([...marked].filter((c) => target.has(c)));
    const missed = new Set([...target].filter((c) => !marked.has(c)));
    const extra = new Set([...marked].filter((c) => !target.has(c)));
    const parts = [
      hit.size ? 'yeşil kareler doğru işaretlediğin kareler' : '',
      missed.size ? 'kesik çizgili yeşil kareler işaretlemediğin kareler' : '',
      extra.size ? 'turuncu kareler desende olmayan kareler' : '',
    ].filter(Boolean);
    const legend = parts.length ? `${parts.join(', ').charAt(0).toLocaleUpperCase('tr-TR')}${parts.join(', ').slice(1)}.` : '';
    return (
      <div ref={top} className="flex scroll-mt-4 flex-col items-center gap-5 text-center">
        <StatusLine>{status}</StatusLine>
        <p className={`text-2xl font-bold ${lastGood ? 'text-ok' : 'text-ink'}`} aria-live="polite">
          {lastGood ? 'Doğru!' : 'Olmadı, sorun değil. Deseni karşılaştır.'}
        </p>
        <div className="flex flex-wrap items-start justify-center gap-6">
          <figure className="flex flex-col items-center gap-2">
            <Grid item={item} filled={target} label={`Desen: ${target.size} koyu kare`} />
            <figcaption className="font-bold">Desen</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <Grid item={item} filled={marked} marks={{ hit, missed, extra }} label={`Senin işaretlediğin ${marked.size} kare`} />
            <figcaption className="font-bold">Senin cevabın</figcaption>
          </figure>
        </div>
        {!lastGood && <p className="measure text-ink-2">{legend}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          {!lastGood && (
            <ArmedButton className="btn btn-secondary btn-lg" delayMs={600} onClick={present}>
              Bir daha dene
            </ArmedButton>
          )}
          <ArmedButton
            className="btn btn-primary btn-lg"
            autoFocus
            delayMs={600}
            onClick={() => {
              if (index + 1 < task.practice.length) {
                setIndex(index + 1);
                present();
              } else setStep('practice-done');
            }}
          >
            {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
          </ArmedButton>
        </div>
      </div>
    );
  }

  const inputting = phase === 'input';
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col items-center gap-5">
      <StatusLine>{status}</StatusLine>
      {inputting ? (
        <Grid key={`in-${showKey}`} item={item} filled={marked} onToggle={toggle} label="Boş tablo: desendeki karelere dokun" />
      ) : (
        <Grid key={`show-${showKey}`} item={item} filled={phase === 'show' ? target : empty} label={phase === 'show' ? 'Desen gösteriliyor' : 'Hazır ol'} />
      )}
      <p className="text-center text-ink-2" aria-live="polite">
        {phase === 'wait' ? 'Hazır ol…' : phase === 'show' ? 'Deseni aklında tut…' : `Desendeki karelere dokun · ${marked.size} kare işaretledin`}
      </p>
      <div className="flex w-full max-w-[22rem] gap-2.5">
        <button type="button" className="btn btn-secondary h-14 flex-1" disabled={!inputting} onClick={(e) => submit(e.timeStamp, true)}>
          Hatırlamıyorum
        </button>
        <button type="button" className="btn btn-primary h-14 flex-1" disabled={!inputting || marked.size === 0} onClick={(e) => submit(e.timeStamp)}>
          Tamam
        </button>
      </div>
    </div>
  );
}
