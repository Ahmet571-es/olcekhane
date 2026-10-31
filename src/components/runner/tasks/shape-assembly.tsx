'use client';

import { useEffect, useRef, useState } from 'react';
import { ASSEMBLY_EXAMPLE, drawShape, fillPath, layoutPieces, parseShape, segPath } from '@/lib/instruments/assembly';
import type { AssemblyItem, AssemblyPracticeItem, ShapeAssemblyTask } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import type { AssemblyTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Çizim renkleri (açık ve koyu temada aynı: çizimler her zaman açık zeminde). */
const PANEL_BG = '#ffffff';
const INK = '#1f2937';
const FILL = '#cfe0f5';
/** Çizgi kalınlıkları ve kenar boşluğu (ızgara birimi): dış hat kalın, parçaların sınırları ince. */
const OUTLINE = 0.085;
const INNER = 0.04;
const MARGIN = 0.15;
/**
 * Izgara biriminin ekrandaki boyu (`--u`): parçalar ve seçenekler aynı ölçekle çizilir (parçaların büyüklüğü seçeneklerdeki
 * parçalarla karşılaştırılabilsin). Telefonda birim ekranla küçülür: beş parçalık bir sıra (en çok ~15 birim) sığar;
 * seçenekler iki sütunda durur. Geniş ekranda (lg) dört seçenek yan yana durur (task-runner bu görevde lg:max-w-4xl verir).
 */
const UNIT_VARS = '[--u:min(1.5rem,calc((100vw_-_4rem)/15.5))] sm:[--u:1.7rem] lg:[--u:1.8rem]';
const UNIT = 'var(--u, 1.5rem)';

/** Bir şeklin çizimi (`box`: çerçevenin kenarı, birim; şekil ortalanır). */
function Shape({ shape, box, label }: { shape: string; box?: number; label?: string }) {
  const d = drawShape(shape);
  const W = box ?? d.w;
  const H = box ?? d.h;
  const ox = (W - d.w) / 2;
  const oy = (H - d.h) / 2;
  return (
    <svg
      viewBox={`${-MARGIN - ox} ${-MARGIN - oy} ${W + 2 * MARGIN} ${H + 2 * MARGIN}`}
      style={{ width: `calc(${UNIT} * ${W + 2 * MARGIN})` }}
      className="block h-auto"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={fillPath(d.fills)} fill={FILL} stroke={FILL} strokeWidth={0.02} strokeLinejoin="round" />
      <path d={segPath(d.inner)} fill="none" stroke={INK} strokeWidth={INNER} strokeLinecap="round" />
      <path d={segPath(d.outline)} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Üstteki parçalar: dağınık, her biri kendi yönünde. */
function Pieces({ item }: { item: AssemblyItem }) {
  const boxes = layoutPieces(item.pieces);
  const W = Math.max(...boxes.map((b) => b.x + b.w));
  const H = Math.max(...boxes.map((b) => b.y + b.h));
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-center font-bold">Parçalar:</p>
      <div className="rounded-xl border-2 border-ink px-3 py-3" style={{ background: PANEL_BG }}>
        <svg
          viewBox={`${-MARGIN} ${-MARGIN} ${W + 2 * MARGIN} ${H + 2 * MARGIN}`}
          style={{ width: `calc(${UNIT} * ${W + 2 * MARGIN})` }}
          className="block h-auto"
          role="img"
          aria-label={`${item.pieces.length} parça`}
        >
          {item.pieces.map((p, i) => {
            const d = drawShape(p.shape);
            const b = boxes[i];
            return (
              <g key={i} transform={`translate(${b.x} ${b.y})`}>
                <path d={fillPath(d.fills)} fill={FILL} stroke={FILL} strokeWidth={0.02} strokeLinejoin="round" />
                <path d={segPath(d.outline)} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/** Seçeneklerin ortak çerçevesi: en büyük seçeneğin uzun kenarı (dört seçenek aynı büyüklükte kutularda durur). */
const boxOf = (item: AssemblyItem) => Math.max(...item.options.map((o) => Math.max(parseShape(o).w, parseShape(o).h)));

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
  item: AssemblyItem;
  selected: number | null;
  onSelect?: (i: number) => void;
  onConfirm?: (now: number) => void;
  marks?: { right: number; chosen: number };
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = item.options.length;
  const box = boxOf(item);
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
    <div className="mx-auto grid w-fit grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" role="radiogroup" aria-label="Seçenekler: bütün şekiller">
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
            aria-label={`${VERBAL_LETTERS[i]} seçeneği: bütün şekil${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex flex-col items-center gap-1 rounded-xl disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block overflow-hidden rounded-xl border-2 p-1.5 ${border}`} style={{ background: PANEL_BG }}>
              <Shape shape={o} box={box} />
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

function Example() {
  return (
    <figure className="flex w-full max-w-[26rem] flex-col items-center gap-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-rule p-3" style={{ background: PANEL_BG }}>
        <Pieces item={{ key: 'ornek', level: 1, type: 'slide', pieces: ASSEMBLY_EXAMPLE.pieces, options: [] }} />
        <span className="text-2xl font-bold text-ink-2" aria-hidden="true">
          →
        </span>
        <Shape shape={ASSEMBLY_EXAMPLE.whole} label="İki parçanın birleşmesiyle oluşan bütün şekil" />
      </div>
      <figcaption className="measure text-ink-2">
        Soldaki iki parça birleşince sağdaki şekil olur. Bütün şekilde parçaların birleştiği yer ince bir çizgiyle gösterilir.
      </figcaption>
    </figure>
  );
}

/**
 * Parçalardan şekil: üstte dağınık parçalar, altında dört bütün şekil; parçalar birleşince oluşan şekil seçilir. Süre sınırı
 * yoktur; cevap süresi sorunun ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa gizliyken geçen
 * süre sayılmaz). Asıl sorularda doğru cevap tarayıcıya gönderilmez: cevaplar sunucuda puanlanır.
 */
export function ShapeAssembly({ task, onDone }: { task: ShapeAssemblyTask; onDone: (trials: AssemblyTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<AssemblyTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  /** Son etkileşim klavyeyle mi? Odak yalnızca o zaman seçeneklere taşınır. */
  const viaKeys = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: AssemblyItem[] = step === 'practice' ? task.practice : task.items;
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
      if (viaKeys.current) el.querySelector<HTMLButtonElement>('[role="radio"][tabindex="0"]')?.focus({ preventScroll: true });
    }
    return () => {
      alive = false;
    };
  }, [running, step, index]);

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
      const good = selected + 1 === (item as AssemblyPracticeItem).answer;
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ chosen: selected, good });
      return;
    }
    out.current.push({ index, response: selected + 1, rtMs });
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
      <div key={step} className={`flex flex-col items-center gap-6 text-center ${UNIT_VARS}`}>
        <p className="measure text-lg">
          Her soruda üstte birkaç parça, altında dört bütün şekil göreceksin. Parçaların hepsi birleşince hangi şeklin oluşacağını bul.
        </p>
        <p className="measure text-lg">
          Parçaları zihninde kaydırabilir ve döndürebilirsin ama ters çeviremezsin (ayna görüntüsünü alamazsın). Bütün şekillerde parçaların birleştiği yerler ince
          çizgilerle gösterilir: doğru şekilde her parça, üstteki parçalardan biriyle tıpatıp aynıdır. Hiçbir parça artmaz, eksik kalmaz.
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
              ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun hepsini doğru cevapladın.`
              : `Alıştırmadaki ${task.practice.length} sorunun ${practiceScore} tanesini doğru cevapladın.`}{' '}
          {low
            ? 'Bir parça seç ve onu seçeneklerde ara: aynı biçimde ve büyüklükte bir parça var mı? Parçalar döndürülebilir ama ters çevrilemez; bütün şekildeki her parça üstteki parçalardan biriyle tıpatıp aynı olmalı. İstersen alıştırmayı tekrarlayabilirsin.'
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
  const answerIdx = practice ? (item as AssemblyPracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className={`flex scroll-mt-4 flex-col gap-4 ${UNIT_VARS}`}>
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      {/* Ekran okuyucular için her zaman sayfada duran duyuru alanı: alıştırmadaki geri bildirim buraya yazılır. */}
      <p className="sr-only" aria-live="polite">
        {fb ? (fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi.`) : ''}
      </p>
      <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-4 lg:max-w-[56rem]">
        <Pieces item={item} />
        <p className="text-center font-bold">Parçalar birleşince hangi şekil olur?</p>
        {fb ? (
          <div className="flex flex-col gap-4">
            <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>
              {fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi`}
            </p>
            <p className="measure mx-auto text-lg">{(item as AssemblyPracticeItem).explain}</p>
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
              {selected === null ? 'Parçaların oluşturduğu şekle dokun.' : `${VERBAL_LETTERS[selected]} seçeneğini seçtin. Emin olunca cevabı ver.`}
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
