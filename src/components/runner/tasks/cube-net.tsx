'use client';

import { useEffect, useRef, useState } from 'react';
import { COLOR_HEX, COLOR_NAMES, CUBE_FACES, CUBE_VIEWBOX, SYMBOL_NAMES, SYMBOL_SHAPES, type CubeFace, type CubeView, type Prim } from '@/lib/instruments/cube';
import type { CubeItem, CubeNetTask, CubePracticeItem } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import type { CubeTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Çizim renkleri (açık ve koyu temada aynı: yüzler her zaman beyaz, zemin açık gri görünür). */
const PANEL_BG = '#e9edf3';
const FACE = '#ffffff';
const INK = '#1f2937';

const faceName = (f: CubeFace) => `${COLOR_NAMES[f.color]} ${SYMBOL_NAMES[f.symbol]}`;

/** Bir şeklin parçaları (birim karede). */
function Shape({ face }: { face: CubeFace }) {
  const c = COLOR_HEX[face.color];
  return (
    <>
      {SYMBOL_SHAPES[face.symbol].map((p: Prim, i) =>
        p.t === 'circle' ? (
          p.ring ? (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke={c} strokeWidth={0.09} />
          ) : (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={c} />
          )
        ) : p.t === 'rect' ? (
          p.outline ? (
            <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill="none" stroke={c} strokeWidth={0.08} />
          ) : (
            <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={c} />
          )
        ) : p.t === 'poly' ? (
          <polygon key={i} points={p.points} fill={c} />
        ) : (
          <path key={i} d={p.d} fill={c} />
        ),
      )}
    </>
  );
}

/** Açınım: altı kare, her birinde bir şekil. */
function Net({ item }: { item: CubeItem }) {
  const w = Math.max(...item.cells.map((c) => c[0])) + 1;
  const h = Math.max(...item.cells.map((c) => c[1])) + 1;
  return (
    <div className="mx-auto w-full rounded-xl border border-rule p-2 sm:p-3" style={{ background: PANEL_BG, maxWidth: `${w * 4.75}rem` }}>
      <svg
        viewBox={`-0.05 -0.05 ${w + 0.1} ${h + 0.1}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Küpün açınımı: altı kare, her karede renkli bir şekil"
      >
        {item.cells.map(([col, row], i) => (
          <g key={i} transform={`translate(${col} ${row})`}>
            <rect width={1} height={1} fill={FACE} stroke={INK} strokeWidth={0.04} />
            <Shape face={item.faces[i]} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Küp: üstten, soldan ve sağdan görünen üç yüz. */
function Cube({ view, faces }: { view: CubeView; faces: readonly CubeFace[] }) {
  return (
    <svg viewBox={CUBE_VIEWBOX} className="block h-auto w-full" aria-hidden="true">
      {CUBE_FACES.map((f) => {
        const [i, k] = view[f.pos];
        return (
          <g key={f.pos}>
            <polygon points={f.points} fill={FACE} stroke={INK} strokeWidth={0.035} strokeLinejoin="round" />
            <g transform={f.matrix}>
              <g transform={`rotate(${90 * k} 0.5 0.5)`}>
                <Shape face={faces[i]} />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** Yönergedeki örnek: açınımın üç karelik bir parçası ve bu parça katlanınca küpte nasıl göründüğü. */
const EXAMPLE_FACES: CubeFace[] = [
  { symbol: 'plus', color: 'amber' },
  { symbol: 'circle', color: 'blue' },
  { symbol: 'square', color: 'teal' },
];
const EXAMPLE_CELLS = [
  [0, 0],
  [0, 1],
  [1, 1],
] as const;

function Example() {
  return (
    <figure className="flex w-full max-w-[24rem] flex-col items-center gap-2">
      <div className="flex w-full items-center justify-center gap-4 rounded-xl border border-rule p-3" style={{ background: PANEL_BG }}>
        <svg viewBox="-0.05 -0.05 2.1 2.1" className="block h-auto w-[7rem]" aria-hidden="true">
          {EXAMPLE_CELLS.map(([col, row], i) => (
            <g key={i} transform={`translate(${col} ${row})`}>
              <rect width={1} height={1} fill={FACE} stroke={INK} strokeWidth={0.04} />
              <Shape face={EXAMPLE_FACES[i]} />
            </g>
          ))}
        </svg>
        <span className="text-2xl font-bold text-ink-2" aria-hidden="true">
          →
        </span>
        <span className="block w-[6.5rem]">
          <Cube view={{ top: [0, 0], left: [1, 0], right: [2, 0] }} faces={EXAMPLE_FACES} />
        </span>
      </div>
      <figcaption className="measure text-ink-2">
        Solda açınımın bir parçası, sağda bu parça katlanınca küpte nasıl göründüğü. Küp eğik çizildiği için şekiller yatık görünür: artı çarpı gibi, kare
        baklava gibi, daire yumurta gibi görünebilir.
      </figcaption>
    </figure>
  );
}

/**
 * Dört seçenek: dokununca seçilir; cevap "Cevabı ver" ile verilir. Klavyede seçenekler tek bir sekme durağıdır: ok
 * tuşları seçimi değiştirir, Enter cevabı verir (1–4 ya da A–D tuşları da seçer).
 */
function Options({
  item,
  selected,
  onSelect,
  onConfirm,
  marks,
}: {
  item: CubeItem;
  selected: number | null;
  onSelect?: (i: number) => void;
  onConfirm?: (now: number) => void;
  marks?: { right: number; chosen: number };
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = item.options.length;
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in step) {
      e.preventDefault();
      const next = (i + step[e.key] + n) % n;
      onSelect?.(next);
      refs.current[next]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!e.repeat && selected !== null) onConfirm?.(e.timeStamp);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" role="radiogroup" aria-label="Seçenekler: küpler">
      {item.options.map((o, i) => {
        const right = marks?.right === i;
        const wrongPick = marks && marks.chosen === i && !right;
        const on = selected === i;
        const border = right
          ? 'border-ok ring-2 ring-ok'
          : wrongPick
            ? 'border-danger ring-2 ring-danger'
            : on
              ? 'border-brass ring-2 ring-brass'
              : 'border-rule-strong';
        const seen = `üstte ${faceName(item.faces[o.top[0]])}, solda ${faceName(item.faces[o.left[0]])}, sağda ${faceName(item.faces[o.right[0]])}`;
        return (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={(selected ?? 0) === i ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            aria-label={`${VERBAL_LETTERS[i]} seçeneği: ${seen}${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex flex-col items-center gap-1 rounded-xl disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block w-full overflow-hidden rounded-xl border-2 px-3 py-2 ${border}`} style={{ background: PANEL_BG }}>
              <span className="mx-auto block max-w-[8.5rem]">
                <Cube view={o} faces={item.faces} />
              </span>
            </span>
            <span className={`text-sm font-bold ${on || right ? 'text-ink' : 'text-ink-2'}`} aria-hidden="true">
              {VERBAL_LETTERS[i]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Küp açınımı: bir küpün açınımı gösterilir; açınım katlanınca oluşabilecek küp dört seçenekten seçilir. Süre sınırı
 * yoktur; cevap süresi sorunun ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa gizliyken
 * geçen süre sayılmaz). Asıl sorularda doğru cevap tarayıcıya gönderilmez: cevaplar sunucuda puanlanır.
 */
export function CubeNet({ task, onDone }: { task: CubeNetTask; onDone: (trials: CubeTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<CubeTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: CubeItem[] = step === 'practice' ? task.practice : task.items;
  const item = list[index];

  useEffect(() => {
    if (!running) return;
    let alive = true;
    hiddenMs.current = 0;
    hiddenSince.current = document.visibilityState === 'hidden' ? performance.now() : null;
    shownAt.current = performance.now();
    void afterPaint().then((t) => {
      if (alive) shownAt.current = t;
    });
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
    if (refocus.current && el) {
      refocus.current = false;
      el.querySelector<HTMLButtonElement>('[role="radio"][tabindex="0"]')?.focus({ preventScroll: true });
    }
    return () => {
      alive = false;
    };
  }, [running, step, index]);

  useEffect(() => {
    if (!running) return;
    const on = () => {
      if (document.visibilityState === 'hidden') hiddenSince.current = performance.now();
      else if (hiddenSince.current !== null) {
        hiddenMs.current += performance.now() - hiddenSince.current;
        hiddenSince.current = null;
      }
    };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [running]);

  function confirm(now: number) {
    if (selected === null || !item || feedback) return;
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - shownAt.current - hidden)));
    if (step === 'practice') {
      const good = selected + 1 === (item as CubePracticeItem).answer;
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ chosen: selected, good });
      return;
    }
    out.current.push({ index, response: selected + 1, rtMs });
    // Odak görevin içindeyse yeni sorunun seçeneklerine taşınır.
    refocus.current = !!top.current && top.current.contains(document.activeElement);
    setSelected(null);
    if (index + 1 < task.items.length) setIndex(index + 1);
    else onDone(out.current);
  }

  function nextPractice() {
    refocus.current = true;
    setFeedback(null);
    setSelected(null);
    if (index + 1 < task.practice.length) setIndex(index + 1);
    else setStep('practice-done');
  }

  useKeys(running && !feedback, (e) => {
    const n = item?.options.length ?? 0;
    const digit = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
    const letter = VERBAL_LETTERS.indexOf(e.key.toLocaleUpperCase('tr-TR'));
    const pick = digit >= 0 ? digit : letter;
    if (pick >= 0 && pick < n) {
      e.preventDefault();
      setSelected(pick);
      const radios = top.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      if (radios && document.activeElement instanceof HTMLElement && document.activeElement.getAttribute('role') === 'radio') radios[pick]?.focus();
    } else if (e.key === 'Enter' && !e.repeat && selected !== null && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      confirm(e.timeStamp);
    }
  });

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda bir küpün açınımını göreceksin: küp kenarlarından kesilip düz bir yere açılınca oluşan altı kare. Her karede renkli bir şekil var. Altında
          dört küp göreceksin; her küp, bir köşesinden bakılınca görünen üç yüzüyle (üst, sol ve sağ yüz) çizilmiştir.
        </p>
        <p className="measure text-lg">
          Açınımı zihninde katla: dört küpten hangisi bu açınımdan oluşabilir? Açınım, şekiller küpün dışında kalacak biçimde katlanır ve küp her yöne çevrilmiş
          olabilir. Yüzlerin hangi yüzlerle yan yana geldiğine ve ok, bayrak gibi şekillerin hangi yöne baktığına dikkat et.
        </p>
        <Example />
        <p className="measure text-lg">
          Doğru seçeneğe dokun, emin olunca “Cevabı ver” düğmesine bas. Önce {countWord(task.practice.length)} alıştırma sorusu çözelim.
        </p>
        <p className="measure text-ink-2">Bilgisayarda seçenekleri 1–4 ya da A–D tuşlarıyla seçip Enter tuşuyla cevap verebilirsin.</p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            refocus.current = true;
            setStep('practice');
          }}
        >
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const low = practiceScore < task.practice.length;
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {practiceScore === 0
            ? `Alıştırmadaki ${task.practice.length} sorunun hiçbirini doğru cevaplayamadın.`
            : practiceScore === task.practice.length
              ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun ${task.practice.length === 2 ? 'ikisini de' : 'hepsini'} doğru cevapladın.`
              : `Alıştırmadaki ${task.practice.length} sorunun ${practiceScore} tanesini doğru cevapladın.`}{' '}
          {low
            ? 'Açınımda bir kareyi küpün önü say ve komşu kareleri onun çevresine zihninde katla: açınımda yan yana duran iki kare küpte de yan yana kalır, düz bir sırada aralarında tek kare olan iki kare ise küpte karşı karşıya gelir. Bir köşede buluşan üç yüzün sırası, küp nasıl çevrilirse çevrilsin değişmez. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {task.items.length} soru var ve sorular giderek zorlaşıyor. Süre sınırı yok; emin olamadığında sana en uygun gelen seçeneği seç.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={low}
            onClick={() => {
              refocus.current = true;
              setIndex(0);
              setPracticeScore(0);
              setStep('practice');
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!low}
            onClick={() => {
              refocus.current = true;
              setIndex(0);
              setSelected(null);
              setStep('test');
            }}
          >
            Teste başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (!item) return null;
  const practice = step === 'practice';
  const answerIdx = practice ? (item as CubePracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-4">
        <Net item={item} />
        <p className="text-center font-bold">Bu açınımdan hangi küp oluşabilir?</p>
        {fb ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>
              {fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi`}
            </p>
            <p className="measure mx-auto text-lg">{(item as CubePracticeItem).explain}</p>
            <Options item={item} selected={null} marks={{ right: answerIdx, chosen: fb.chosen }} />
            <div className="flex justify-center">
              <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
                {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
              </ArmedButton>
            </div>
          </div>
        ) : (
          <>
            <Options item={item} selected={selected} onSelect={setSelected} onConfirm={confirm} />
            <p className="text-center text-ink-2">
              {selected === null ? 'Doğru olduğunu düşündüğün seçeneğe dokun.' : `${VERBAL_LETTERS[selected]} seçeneğini seçtin. Emin olunca cevabı ver.`}
            </p>
            <div className="flex justify-center">
              <button type="button" className="btn btn-primary btn-lg min-w-[12rem]" disabled={selected === null} onClick={(e) => confirm(e.timeStamp)}>
                Cevabı ver
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
