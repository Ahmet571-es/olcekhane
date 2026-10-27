'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ANALOGY_GRAY, ANALOGY_PAPER, describePanel, el, panelPrims } from '@/lib/instruments/analogy';
import type { AnalogyItem, AnalogyPanel, AnalogyPracticeItem, FiguralAnalogyTask } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import type { AnalogyTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);
/** "birini", "ikisini", "üçünü": alıştırmanın sonundaki cümlede. */
const countAcc = (n: number) => ['', 'birini', 'ikisini', 'üçünü', 'dördünü', 'beşini'][n] ?? `${n} tanesini`;

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;

/**
 * Panoların ekrandaki genişliği (`--p`). Sorudaki üç şekil, soru işareti ve seçenekler aynı genişlikte çizilir: büyüklük
 * değişiklikleri soru ile seçenekler arasında aynı ölçekte karşılaştırılabilsin. Telefonda soru iki satırda (birinci → ikinci,
 * üçüncü → ?), seçenekler iki sütunda durur; geniş ekranda (lg) soru tek satırda, seçenekler dört sütundadır.
 */
const PANEL_VARS = '[--p:min(7.5rem,calc((100vw_-_4.5rem)/2.7))] sm:[--p:8rem] lg:[--p:8.5rem]';

/** Bir pano (100 × 100 birim). */
function PanelView({ panel, label }: { panel: AnalogyPanel; label?: string }) {
  const prims = useMemo(() => panelPrims(panel), [panel]);
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {prims.map((p, i) =>
        p.kind === 'circle' ? (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} />
        ) : (
          <polygon key={i} points={p.points.map((q) => `${q[0].toFixed(2)},${q[1].toFixed(2)}`).join(' ')} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} strokeLinejoin="round" />
        ),
      )}
    </svg>
  );
}

function Box({ panel, label, tone = 'plain' }: { panel: AnalogyPanel | null; label: string; tone?: 'plain' | 'blank' | 'chosen' | 'right' }) {
  const border = tone === 'right' ? 'border-ok' : tone === 'chosen' ? 'border-brass' : tone === 'blank' ? 'border-rule-strong border-dashed' : 'border-rule';
  return (
    <div className={`overflow-hidden rounded-lg border-2 ${border}`} style={{ width: 'var(--p)', background: ANALOGY_PAPER }}>
      {panel ? (
        <PanelView panel={panel} label={label} />
      ) : (
        <div className="flex aspect-square items-center justify-center">
          <span className="font-display text-4xl font-bold" style={{ color: ANALOGY_GRAY }} role="img" aria-label={label}>
            ?
          </span>
        </div>
      )}
    </div>
  );
}

const Arrow = () => (
  <span className="text-2xl font-bold text-ink-2" aria-hidden="true">
    →
  </span>
);

/**
 * Soru: birinci şekil → ikinci şekil; üçüncü şekil → ? (seçilen seçenek, varsa, soru işaretinin yerinde gösterilir).
 */
function Question({ item, filled, tone }: { item: AnalogyItem; filled: AnalogyPanel | null; tone: 'chosen' | 'right' }) {
  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-2 rounded-2xl bg-surface-2 p-2 sm:p-3 lg:flex-row lg:gap-6" role="group" aria-label="Soru">
      <div className="flex items-center gap-2">
        <Box panel={item.a} label={`Birinci şekil: ${describePanel(item.a)}`} />
        <Arrow />
        <Box panel={item.b} label={`İkinci şekil: ${describePanel(item.b)}`} />
      </div>
      <div className="flex items-center gap-2 lg:border-l-2 lg:border-rule lg:pl-6" aria-live="polite">
        <Box panel={item.c} label={`Üçüncü şekil: ${describePanel(item.c)}`} />
        <Arrow />
        <Box
          panel={filled}
          tone={filled ? tone : 'blank'}
          label={filled ? `Soru işaretinin yerine ${tone === 'right' ? 'doğru cevap' : 'seçtiğin'}: ${describePanel(filled)}` : 'Soru işareti: bulunacak şekil'}
        />
      </div>
    </div>
  );
}

const EXAMPLE = {
  a: [el('hexagon')],
  b: [el('hexagon', { fill: 'gray' })],
  c: [el('star')],
  d: [el('star', { fill: 'gray' })],
};

function Example() {
  return (
    <figure className={`flex flex-col items-center gap-2 ${PANEL_VARS}`}>
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-2 p-2 sm:p-3 lg:flex-row lg:gap-6">
        <div className="flex items-center gap-2">
          <Box panel={EXAMPLE.a} label="Birinci şekil: içi boş altıgen" />
          <Arrow />
          <Box panel={EXAMPLE.b} label="İkinci şekil: gri altıgen" />
        </div>
        <div className="flex items-center gap-2 lg:border-l-2 lg:border-rule lg:pl-6">
          <Box panel={EXAMPLE.c} label="Üçüncü şekil: içi boş yıldız" />
          <Arrow />
          <Box panel={EXAMPLE.d} tone="right" label="Cevap: gri yıldız" />
        </div>
      </div>
      <figcaption className="measure text-ink-2">
        Örnek: içi boş altıgen gri oldu; başka bir şey değişmedi. Üçüncü şekil de aynı biçimde değişir: içi boş yıldız gri yıldız olur.
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
  item: AnalogyItem;
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
    <div className="mx-auto grid w-fit grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" role="radiogroup" aria-label="Seçenekler">
      {item.options.map((o, i) => {
        const right = marks?.right === i;
        const wrongPick = marks && marks.chosen === i && !right;
        const on = selected === i;
        const border = right ? 'border-ok ring-2 ring-ok' : wrongPick ? 'border-danger ring-2 ring-danger' : on ? 'border-brass ring-2 ring-brass' : 'border-rule-strong';
        return (
          <button
            key={i}
            ref={(x) => {
              refs.current[i] = x;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={(selected ?? 0) === i ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            aria-label={`${VERBAL_LETTERS[i]} seçeneği: ${describePanel(o)}${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex flex-col items-center gap-1 rounded-xl disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block overflow-hidden rounded-xl border-2 p-1 ${border}`} style={{ width: 'calc(var(--p) + 0.5rem)', background: ANALOGY_PAPER }}>
              <PanelView panel={o} />
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
 * Şekil benzetmeleri: birinci şekil ikinci şekle dönüşür; üçüncü şeklin aynı biçimde dönüşmüş hâli dört seçenekten seçilir.
 * Süre sınırı yoktur; cevap süresi sorunun ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa
 * gizliyken geçen süre sayılmaz). Asıl sorularda doğru cevap tarayıcıya gönderilmez: cevaplar sunucuda puanlanır.
 */
export function FiguralAnalogy({ task, onDone }: { task: FiguralAnalogyTask; onDone: (trials: AnalogyTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<AnalogyTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  /** Son etkileşim klavyeyle mi? Odak yalnızca o zaman seçeneklere taşınır (dokunarak ilerleyen birinde A seçilmiş gibi görünmesin). */
  const viaKeys = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: AnalogyItem[] = step === 'practice' ? task.practice : task.items;
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
    const x = top.current;
    if (x && x.getBoundingClientRect().top < 0) x.scrollIntoView({ block: 'start' });
    if (refocus.current && x) {
      refocus.current = false;
      if (viaKeys.current) x.querySelector<HTMLButtonElement>('[role="radio"][tabindex="0"]')?.focus({ preventScroll: true });
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
      const good = selected + 1 === (item as AnalogyPracticeItem).answer;
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
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda birinci şekil ikinci şekle dönüşüyor. Üçüncü şekil de aynı biçimde dönüşmeli: soru işaretinin yerine gelecek şekli dört seçenekten seç.
        </p>
        <Example />
        <p className="measure text-lg">
          Renk, büyüklük, yön (döndürme ya da ayna görüntüsü), yer ve sayı değişebilir. Bazı sorularda birden çok şey değişir; hepsini bul. Değişmeyen şeyler de
          aynı kalmalı.
        </p>
        <p className="measure text-lg">
          Doğru olduğunu düşündüğün seçeneğe dokun, emin olunca “Cevabı ver” düğmesine bas. Önce {countWord(task.practice.length)} alıştırma sorusu
          çözelim.
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
            ? `Alıştırmadaki ${countWord(task.practice.length)} sorudan hiçbirini doğru cevaplayamadın.`
            : practiceScore === task.practice.length
              ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun ${task.practice.length === 2 ? 'ikisini de' : 'hepsini'} doğru cevapladın.`
              : `Alıştırmadaki ${countWord(task.practice.length)} sorudan ${countAcc(practiceScore)} doğru cevapladın.`}{' '}
          {low
            ? 'Önce birinci ve ikinci şekil arasındaki farkları tek tek bul: renk mi, büyüklük mü, yön mü, yer mi, sayı mı değişti? Sonra her birini üçüncü şekle uygula ve değişmeyen şeyleri aynı bırak. İstersen alıştırmayı tekrarlayabilirsin. Asıl sorularda cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {task.items.length} soru var ve sorular giderek zorlaşıyor: değişiklikler çoğalıyor. Süre sınırı yok; emin olamadığında sana en uygun gelen seçeneği seç.
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
  const answerIdx = practice ? (item as AnalogyPracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className={`flex scroll-mt-4 flex-col gap-4 ${PANEL_VARS}`}>
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      {/* Ekran okuyucular için her zaman sayfada duran duyuru alanı: alıştırmadaki geri bildirim buraya yazılır. */}
      <p className="sr-only" aria-live="polite">
        {fb ? (fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi.`) : ''}
      </p>
      <Question item={item} filled={fb ? item.options[answerIdx] : selected !== null ? item.options[selected] : null} tone={fb ? 'right' : 'chosen'} />
      <p className="text-center font-bold">Soru işaretinin yerine hangi şekil gelir?</p>
      {fb ? (
        <div className="flex flex-col gap-4">
          <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru cevap ${VERBAL_LETTERS[answerIdx]} seçeneğiydi`}</p>
          <p className="measure mx-auto text-lg">{(item as AnalogyPracticeItem).explain}</p>
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
            {selected === null ? 'Doğru olduğunu düşündüğün şekle dokun.' : `${VERBAL_LETTERS[selected]} seçeneğini seçtin; soru işaretinin yerinde görebilirsin. Emin olunca cevabı ver.`}
          </p>
          <div className="flex justify-center">
            <button type="button" className="btn btn-primary btn-lg min-w-[12rem]" disabled={selected === null} onClick={(e) => confirm(e.timeStamp)}>
              Cevabı ver
            </button>
          </div>
        </>
      )}
    </div>
  );
}
