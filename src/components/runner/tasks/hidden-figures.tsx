'use client';

import { useEffect, useRef, useState } from 'react';
import { HIDDEN_EXAMPLE_AT, HIDDEN_EXAMPLE_FIGURE, HIDDEN_EXAMPLE_TARGET, type HSeg } from '@/lib/instruments/hidden';
import type { HiddenFiguresTask, HiddenItem, HiddenPracticeItem } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import type { HiddenTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Çizim renkleri (açık ve koyu temada aynı: çizimler her zaman açık zeminde). */
const PANEL_BG = '#ffffff';
const INK = '#1f2937';
/** Doğru seçenekteki vurgu yeşildir (açıklamalar "yeşille gösterilen" der; açık temadaki `--ok` rengi). */
const MARK_RIGHT = '#1b6e42';
const MARK_LURE = '#e0602a';
/** Çizgi kalınlığı ve kenar boşluğu (ızgara birimi). */
const STROKE = 0.075;
const MARGIN = 0.18;
/**
 * Izgara biriminin ekrandaki boyu (`--u`): aranan şekil ve çizimler aynı ölçekle çizilir (şekil çizimde aynı büyüklükte
 * saklıdır). Telefonda ve tablette seçenekler iki sütunda durur (telefonda sığsınlar diye birim ekranla küçülür); geniş
 * ekranda (lg) dört seçenek yan yana durur ve "Cevabı ver" düğmesi ekranda kalır. Dört sütun: 4 × (6,36 birim + 16 px) +
 * 3 × 12 px ≤ 56rem (task-runner bu görevde lg:max-w-4xl verir).
 */
const UNIT_VARS = '[--u:min(1.4rem,calc((100vw_-_5.5rem)/12.6))] sm:[--u:1.9rem] lg:[--u:1.8rem]';
const UNIT = 'var(--u, 1.4rem)';

const pathOf = (segs: readonly HSeg[]) => segs.map(([x1, y1, x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`).join('');

/** Çizgilerden oluşan bir çizim; genişliği ızgara birimiyle verilir. */
function Drawing({ segs, w, h, mark, markColor, label }: { segs: readonly HSeg[]; w: number; h: number; mark?: readonly HSeg[]; markColor?: string; label?: string }) {
  return (
    <svg
      viewBox={`${-MARGIN} ${-MARGIN} ${w + 2 * MARGIN} ${h + 2 * MARGIN}`}
      style={{ width: `calc(${UNIT} * ${w + 2 * MARGIN})` }}
      className="block h-auto"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={pathOf(segs)} fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
      {mark && <path d={pathOf(mark)} fill="none" stroke={markColor} strokeWidth={STROKE * 2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />}
    </svg>
  );
}

const sizeOf = (segs: readonly HSeg[]) => ({
  w: Math.max(...segs.flatMap((s) => [s[0], s[2]])),
  h: Math.max(...segs.flatMap((s) => [s[1], s[3]])),
});

/** Üstteki aranan şekil. */
function Target({ item }: { item: HiddenItem }) {
  const { w, h } = sizeOf(item.target);
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-center font-bold">Bu şekli bul:</p>
      <div className="rounded-xl border-2 border-ink px-4 py-3" style={{ background: PANEL_BG }}>
        <Drawing segs={item.target} w={w} h={h} label="Aranan şekil" />
      </div>
    </div>
  );
}

const EXAMPLE_MARK: HSeg[] = HIDDEN_EXAMPLE_TARGET.map(([x1, y1, x2, y2]) => [x1 + HIDDEN_EXAMPLE_AT[0], y1 + HIDDEN_EXAMPLE_AT[1], x2 + HIDDEN_EXAMPLE_AT[0], y2 + HIDDEN_EXAMPLE_AT[1]]);

function Example() {
  return (
    <figure className="flex w-full max-w-[26rem] flex-col items-center gap-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-rule p-3" style={{ background: PANEL_BG }}>
        <Drawing segs={HIDDEN_EXAMPLE_TARGET} w={3} h={2} />
        <span className="text-2xl font-bold text-ink-2" aria-hidden="true">
          →
        </span>
        <Drawing segs={HIDDEN_EXAMPLE_FIGURE} w={6} h={6} mark={EXAMPLE_MARK} markColor={MARK_RIGHT} />
      </div>
      <figcaption className="measure text-ink-2">
        Solda aranan şekil, sağda onun saklandığı bir çizim: şekil yeşille gösterilen yerde, aynı büyüklükte ve aynı yönde duruyor. Alt kenarı çizimdeki daha
        uzun bir çizginin parçası; köşelerine başka çizgiler değiyor.
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
  grid,
  selected,
  onSelect,
  onConfirm,
  marks,
}: {
  item: HiddenItem;
  grid: number;
  selected: number | null;
  onSelect?: (i: number) => void;
  onConfirm?: (now: number) => void;
  marks?: { right: number; chosen: number; shapes: readonly (readonly HSeg[])[] };
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
    <div className="mx-auto grid w-fit grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" role="radiogroup" aria-label="Seçenekler: karmaşık çizimler">
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
            aria-label={`${VERBAL_LETTERS[i]} seçeneği: karmaşık çizim${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex flex-col items-center gap-1 rounded-xl disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block overflow-hidden rounded-xl border-2 p-1.5 ${border}`} style={{ background: PANEL_BG }}>
              <Drawing segs={o} w={grid} h={grid} mark={marks?.shapes[i]} markColor={right ? MARK_RIGHT : MARK_LURE} />
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
 * Gizli şekiller: üstte basit bir şekil, altında dört karmaşık çizim; şeklin saklandığı çizim seçilir. Süre sınırı
 * yoktur; cevap süresi sorunun ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa gizliyken
 * geçen süre sayılmaz). Asıl sorularda doğru cevap tarayıcıya gönderilmez: cevaplar sunucuda puanlanır.
 */
export function HiddenFigures({ task, onDone }: { task: HiddenFiguresTask; onDone: (trials: HiddenTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<HiddenTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  /** Son etkileşim klavyeyle mi? Odak yalnızca o zaman seçeneklere taşınır (fareyle ya da dokunarak ilerleyen birinde A seçeneği seçilmiş gibi görünmesin). */
  const viaKeys = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: HiddenItem[] = step === 'practice' ? task.practice : task.items;
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
      const good = selected + 1 === (item as HiddenPracticeItem).answer;
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
      <div key={step} className={`flex flex-col items-center gap-6 text-center ${UNIT_VARS}`}>
        <p className="measure text-lg">
          Her soruda üstte basit bir şekil, altında dört karmaşık çizim göreceksin. Şekil, dört çizimden yalnızca birinin içinde saklı. Hangi çizimde
          saklı olduğunu bul.
        </p>
        <p className="measure text-lg">
          Şekil çizimde aynı büyüklükte ve aynı yönde durur: döndürülmemiş, ters çevrilmemiştir. Kenarları çizimdeki daha uzun çizgilerin parçası olabilir ve
          başka çizgiler şeklin içinden geçebilir. Bazı çizimlerde şeklin döndürülmüş biçimi ya da bir köşesi farklı bir benzeri vardır; onlar doğru cevap değildir.
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
            ? 'Şeklin en kolay ayırt edilen parçasını (ör. eğik bir kenarı ya da sivri bir köşesini) seç ve önce onu çizimlerde ara; bulunca şeklin öteki kenarlarının da orada olup olmadığına bak. Şeklin yönüne dikkat et: döndürülmüş ya da ters çevrilmiş biçimi doğru cevap değildir. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {task.items.length} soru var ve şekiller giderek daha iyi saklanıyor. Süre sınırı yok; emin olamadığında sana en uygun gelen seçeneği seç.
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
  const answerIdx = practice ? (item as HiddenPracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className={`flex scroll-mt-4 flex-col gap-4 ${UNIT_VARS}`}>
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      {/* Ekran okuyucular için her zaman sayfada duran duyuru alanı: alıştırmadaki geri bildirim buraya yazılır. */}
      <p className="sr-only" aria-live="polite">
        {fb ? (fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi.`) : ''}
      </p>
      <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-4 lg:max-w-[56rem]">
        <Target item={item} />
        <p className="text-center font-bold">Şekil hangi çizimde saklı?</p>
        {fb ? (
          <div className="flex flex-col gap-4">
            <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>
              {fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi`}
            </p>
            <p className="measure mx-auto text-lg">{(item as HiddenPracticeItem).explain}</p>
            <Options item={item} grid={task.grid} selected={null} marks={{ right: answerIdx, chosen: fb.chosen, shapes: (item as HiddenPracticeItem).marks }} />
            <div className="flex justify-center">
              <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
                {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
              </ArmedButton>
            </div>
          </div>
        ) : (
          <>
            <Options item={item} grid={task.grid} selected={selected} onSelect={setSelected} onConfirm={confirm} />
            <p className="text-center text-ink-2">
              {selected === null ? 'Şeklin saklandığını düşündüğün çizime dokun.' : `${VERBAL_LETTERS[selected]} seçeneğini seçtin. Emin olunca cevabı ver.`}
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
