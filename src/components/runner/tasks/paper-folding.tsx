'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FOLD_VIEWBOX, foldPanels } from '@/lib/instruments/folding-draw';
import { HOLE_R, PAPER, type Pt } from '@/lib/instruments/folding';
import type { FoldingItem, FoldingPracticeItem, PaperFoldingTask } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import type { FoldingTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Çizim renkleri (açık ve koyu temada aynı: kâğıt her zaman açık renkli görünür). */
const PAPER_FILL = '#fdf3d8';
/** Resimlerin zemini: kâğıttan ayrılsın diye her temada aynı açık gri. */
const PANEL_BG = '#e9edf3';
/** Katlanan parçaların kâğıdın üstündeki kenarları ve son katlanan parçanın hafif dolgusu. */
const LAYER = '#b45309';
const LAYER_FILL = '#f6dfa0';
const INK = '#1f2937';
const GHOST = '#6b7280';
const ARROW = '#2f5ce0';
const HOLE = '#111827';

/** Katlama adımları: her katlamadan sonraki kâğıt (kesik çizgi kanadın önceki yeri, ok yönü) ve son resimde delikler. */
function Steps({ item }: { item: FoldingItem }) {
  const panels = useMemo(() => foldPanels(item.folds, item.punches), [item]);
  const n = item.folds.length;
  return (
    <ol className="flex flex-wrap items-end justify-center gap-1.5 sm:gap-3" aria-label={`Kâğıt ${n} kez katlandı, sonra ${item.punches.length === 1 ? 'bir yerden' : 'iki yerden'} delindi`}>
      {panels.map((p, i) => (
        <li key={i} className="flex flex-col items-center gap-1">
          <svg
            viewBox={FOLD_VIEWBOX}
            className="block h-auto w-[min(6.5rem,19vw)] rounded-lg border border-rule sm:w-32"
            style={{ background: PANEL_BG }}
            role="img"
            aria-label={i < n ? `${i + 1}. katlama` : `Katlanmış kâğıt ${item.punches.length === 1 ? 'bir yerden' : 'iki yerden'} delindi`}
          >
            {p.ghost && <polygon points={p.ghost} fill="none" stroke={GHOST} strokeWidth={0.14} strokeDasharray="0.55 0.4" />}
            <polygon points={p.paper} fill={PAPER_FILL} stroke={INK} strokeWidth={0.18} strokeLinejoin="round" />
            {p.layers.map((l, j) => (
              <polygon key={j} points={l.points} fill={l.last ? LAYER_FILL : 'none'} stroke={LAYER} strokeWidth={0.12} strokeLinejoin="round" />
            ))}
            {p.arrow && (
              <>
                <path d={p.arrow.path} fill="none" stroke={ARROW} strokeWidth={0.26} strokeLinecap="round" />
                <polygon points={p.arrow.head} fill={ARROW} />
              </>
            )}
            {p.holes?.map((h, j) => <circle key={j} cx={h[0]} cy={h[1]} r={HOLE_R} fill={HOLE} />)}
          </svg>
          <span className="text-xs font-bold text-ink-2" aria-hidden="true">
            {i < n ? `${i + 1}. katlama` : 'Delindi'}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Açılmış kâğıt: kare ve delikler. */
function Unfolded({ holes }: { holes: readonly Pt[] }) {
  return (
    <svg viewBox={FOLD_VIEWBOX} className="block h-auto w-full" aria-hidden="true">
      <rect x={0} y={0} width={PAPER} height={PAPER} fill="#ffffff" stroke={INK} strokeWidth={0.18} />
      {holes.map((h, j) => (
        <circle key={j} cx={h[0]} cy={h[1]} r={HOLE_R} fill={HOLE} />
      ))}
    </svg>
  );
}

/**
 * Beş seçenek: dokununca seçilir; cevap "Cevabı ver" ile verilir. Klavyede seçenekler tek bir sekme durağıdır: ok
 * tuşları seçimi değiştirir, Enter cevabı verir (1–5 ya da A–E tuşları da seçer).
 */
function Options({
  item,
  selected,
  onSelect,
  onConfirm,
  marks,
}: {
  item: FoldingItem;
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
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3" role="radiogroup" aria-label="Seçenekler: açılmış kâğıt">
      {item.options.map((o, i) => {
        const right = marks?.right === i;
        const wrongPick = marks && marks.chosen === i && !right;
        const on = selected === i;
        const border = right ? 'border-ok ring-2 ring-ok' : wrongPick ? 'border-danger ring-2 ring-danger' : on ? 'border-brass ring-2 ring-brass' : 'border-rule-strong';
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
            aria-label={`${VERBAL_LETTERS[i]} seçeneği: ${o.length} delik${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex flex-col items-center gap-1 rounded-lg disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block w-full overflow-hidden rounded-lg border-2 bg-surface ${border}`}>
              <Unfolded holes={o} />
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
 * Kâğıt katlama: katlama adımları gösterilir, açılmış kâğıt beş seçenekten seçilir. Süre sınırı yoktur; cevap süresi
 * sorunun ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa gizliyken geçen süre sayılmaz).
 * Asıl sorularda doğru cevap tarayıcıda bilinmez: cevaplar sunucuda puanlanır.
 */
export function PaperFolding({ task, onDone }: { task: PaperFoldingTask; onDone: (trials: FoldingTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<FoldingTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: FoldingItem[] = step === 'practice' ? task.practice : task.items;
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
      const good = selected + 1 === (item as FoldingPracticeItem).answer;
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
          Her soruda kare bir kâğıdın nasıl katlandığını soldan sağa adım adım göreceksin: kesik çizgi kâğıdın katlanan parçasının katlanmadan önceki yerini,
          ok katlanma yönünü gösterir; katlanan parçanın kâğıdın üstüne geldiği yer renkli ince bir çizgiyle görünür. Son resimde katlanmış kâğıt delinir;
          delik, o yerdeki bütün katlardan geçer.
        </p>
        <p className="measure text-lg">
          Kâğıt yeniden açılınca nasıl görünür? Kâğıt ya da kalem kullanmadan, zihninde çöz. Doğru seçeneğe dokun, emin olunca “Cevabı ver” düğmesine bas.
          Önce {countWord(task.practice.length)} alıştırma sorusu çözelim.
        </p>
        <p className="measure text-ink-2">Bilgisayarda seçenekleri 1–5 ya da A–E tuşlarıyla seçip Enter tuşuyla cevap verebilirsin.</p>
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
              ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun hepsini doğru cevapladın.`
              : `Alıştırmadaki ${task.practice.length} sorunun ${practiceScore} tanesini doğru cevapladın.`}{' '}
          {low
            ? 'Kâğıdı son katlamadan başlayarak zihninde adım adım aç: her açışta deliğin bir eşi, katlama çizgisinin öbür yanında ve çizgiye aynı uzaklıkta açılır; ama yalnızca katlanan parça o deliğe ulaşmışsa. İstersen alıştırmayı tekrarlayabilirsin.'
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
  const answerIdx = practice ? (item as FoldingPracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[36rem] flex-col gap-4">
        <Steps item={item} />
        <p className="text-center font-bold">Kâğıt açılınca nasıl görünür?</p>
        {fb ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi`}</p>
            <p className="measure mx-auto text-lg">{(item as FoldingPracticeItem).explain}</p>
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
            <p className="text-center text-ink-2">{selected === null ? 'Doğru olduğunu düşündüğün seçeneğe dokun.' : `${VERBAL_LETTERS[selected]} seçeneğini seçtin. Emin olunca cevabı ver.`}</p>
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
