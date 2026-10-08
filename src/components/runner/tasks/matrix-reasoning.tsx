'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MATRIX_GRAY, MATRIX_INK, MATRIX_PAPER, cellPrims, describeCell, itemMaxCount } from '@/lib/instruments/matrix';
import type { MatrixCell, MatrixItem, MatrixPracticeItem, MatrixReasoningTask } from '@/lib/instruments/types';
import type { MatrixTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir; daha uzun düşünülen sorular bu süreyle kaydedilir. */
const MAX_RT_MS = 120_000;

/** Bir parçanın çizimi (100 × 100 birim). */
export function MatrixCellView({ cell, maxCount, label }: { cell: MatrixCell; maxCount: number; label?: string }) {
  const prims = useMemo(() => cellPrims(cell, maxCount), [cell, maxCount]);
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {prims.map((p, i) =>
        p.kind === 'circle' ? (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} />
        ) : p.kind === 'poly' ? (
          <polygon key={i} points={p.points.map((q) => `${q[0].toFixed(2)},${q[1].toFixed(2)}`).join(' ')} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} strokeLinejoin="round" />
        ) : (
          <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={MATRIX_INK} strokeWidth={p.sw} strokeLinecap="round" />
        ),
      )}
    </svg>
  );
}

/**
 * Tablo: ilk sekiz parça ve sağ altta eksik parça (seçilen seçenek, varsa, orada gösterilir). Tablonun parçaları
 * seçeneklerle tam aynı büyüklükte çizilir: büyüklüğü değişen şekiller tablo ile seçenekler arasında aynı ölçekte
 * karşılaştırılabilsin. Seçenekler dört sütunda (aralarında üç boşluk), tablo üç sütunda (iki boşluk) durur; tablonun
 * genişliği buna göre hesaplanır.
 */
const GRID_WIDTH = 'calc((100% - 1.5rem) * 0.75 + 1rem)';

function Grid({ item, filled, tone }: { item: MatrixItem; filled: MatrixCell | null; tone: 'choose' | 'right' }) {
  const max = itemMaxCount(item);
  const ring = tone === 'right' ? 'border-ok' : filled ? 'border-brass' : 'border-rule-strong';
  return (
    <div
      className="mx-auto box-content grid grid-cols-3 gap-2 rounded-2xl bg-surface-2 p-2"
      style={{ width: GRID_WIDTH }}
      role="group"
      aria-label="Tablo: 3 satır, 3 sütun"
    >
      {item.cells.map((c, i) => (
        <div key={i} className="aspect-square overflow-hidden rounded-lg border-2 border-rule" style={{ background: MATRIX_PAPER }}>
          <MatrixCellView cell={c} maxCount={max} label={`${Math.floor(i / 3) + 1}. satır, ${(i % 3) + 1}. sütun: ${describeCell(c)}`} />
        </div>
      ))}
      <div
        className={`flex aspect-square items-center justify-center overflow-hidden rounded-lg border-2 border-dashed ${ring}`}
        style={{ background: MATRIX_PAPER }}
        aria-live="polite"
      >
        {filled ? (
          <MatrixCellView
            cell={filled}
            maxCount={max}
            label={`3. satır, 3. sütun (eksik parça): ${tone === 'right' ? 'doğru cevap' : 'seçtiğin'} ${describeCell(filled)}`}
          />
        ) : (
          <span className="font-display text-4xl font-bold" style={{ color: MATRIX_GRAY }} role="img" aria-label="3. satır, 3. sütun: eksik parça">
            ?
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Sekiz seçenek: dokununca seçilir; cevap "Cevabı ver" ile verilir. Klavyede seçenekler tek bir sekme durağıdır: ok
 * tuşları seçimi değiştirir, Enter cevabı verir (1–8 tuşları da seçer).
 */
function Options({
  item,
  selected,
  onSelect,
  onConfirm,
  marks,
}: {
  item: MatrixItem;
  selected: number | null;
  onSelect?: (i: number) => void;
  onConfirm?: (now: number) => void;
  /** Alıştırmanın geri bildiriminde: doğru seçenek ve (yanlışsa) seçilen seçenek. */
  marks?: { right: number; chosen: number };
}) {
  const max = itemMaxCount(item);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = item.options.length;
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 };
    if (e.key in step) {
      e.preventDefault();
      const next = (i + step[e.key] + n) % n;
      onSelect?.(next);
      refs.current[next]?.focus();
    } else if (e.key === 'Enter' && selected !== null) {
      e.preventDefault();
      onConfirm?.(e.timeStamp);
    }
  };
  return (
    <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Seçenekler">
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
            aria-label={`Seçenek ${i + 1}: ${describeCell(o)}${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex flex-col items-center gap-1 rounded-lg disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block aspect-square w-full overflow-hidden rounded-lg border-2 ${border}`} style={{ background: MATRIX_PAPER }}>
              <MatrixCellView cell={o} maxCount={max} />
            </span>
            <span className={`text-sm font-bold tabular ${on || right ? 'text-ink' : 'text-ink-2'}`} aria-hidden="true">
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Şekil akıl yürütme: 3×3'lük tablonun eksik parçası sekiz seçenekten seçilir. Süre sınırı yoktur; cevap süresi sorunun
 * ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa gizliyken geçen süre sayılmaz). Önce
 * geri bildirimli iki alıştırma sorusu çözülür. Asıl sorularda doğru cevap tarayıcıda bilinmez: cevaplar sunucuda
 * puanlanır.
 */
export function MatrixReasoning({ task, onDone }: { task: MatrixReasoningTask; onDone: (trials: MatrixTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<MatrixTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  /** Cevap verildikten sonra klavye odağı yeni sorunun seçeneklerine taşınır ("Cevabı ver" düğmesi devre dışı kalır). */
  const refocus = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: MatrixItem[] = step === 'practice' ? task.practice : task.items;
  const item = list[index];

  // Yeni soru ekrana çizilince süre başlar; sayfa en üste (tabloya) kaydırılır.
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

  // Sayfa gizliyken (başka sekme ya da uygulama) geçen süre cevap süresine eklenmez.
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

  /** `now`: cevabın verildiği an (olayın zaman damgası; performance.now ile aynı saat). */
  function confirm(now: number) {
    if (selected === null || !item || feedback) return;
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - shownAt.current - hidden)));
    if (step === 'practice') {
      const good = selected + 1 === (item as MatrixPracticeItem).answer;
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ chosen: selected, good });
      return;
    }
    out.current.push({ index, response: selected + 1, rtMs });
    refocus.current = focusInside(top.current);
    setSelected(null);
    if (index + 1 < task.items.length) setIndex(index + 1);
    else onDone(out.current);
  }

  /** Odak görevin içinde mi (klavyeyle çözülüyorsa)? */
  function focusInside(box: HTMLElement | null): boolean {
    return !!box && box.contains(document.activeElement);
  }

  function nextPractice() {
    setFeedback(null);
    setSelected(null);
    if (index + 1 < task.practice.length) setIndex(index + 1);
    else setStep('practice-done');
  }

  useKeys(running && !feedback, (e) => {
    if (/^[1-8]$/.test(e.key)) {
      e.preventDefault();
      setSelected(Number(e.key) - 1);
    } else if (e.key === 'Enter' && selected !== null && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      confirm(e.timeStamp);
    }
  });

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda bir tablo ve altında sekiz seçenek göreceksin. Tablodaki kuralı bul, eksik parçaya uyan seçeneğe dokun; seçtiğin parça tablodaki boş yerde
          görünür. Emin olunca “Cevabı ver” düğmesine bas.
        </p>
        <p className="measure text-lg">
          Önce {task.practice.length} alıştırma sorusu çözelim. Her cevaptan sonra doğru cevabı ve nedenini göreceksin.
        </p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('practice')}>
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
              ? `Alıştırmadaki ${task.practice.length === 2 ? 'iki sorunun ikisini de' : 'soruların hepsini'} doğru cevapladın.`
              : `Alıştırmadaki ${task.practice.length} sorunun ${practiceScore} tanesini doğru cevapladın.`}{' '}
          {low
            ? 'Satırlarda neyin aynı kaldığına ve neyin değiştiğine dikkatle bak. İstersen alıştırmayı tekrarlayabilirsin.'
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
  const answerIdx = practice ? (item as MatrixPracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[30rem] flex-col gap-4">
        <Grid item={item} filled={fb ? item.options[answerIdx] : selected === null ? null : item.options[selected]} tone={fb ? 'right' : 'choose'} />
        {fb ? (
          <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru cevap ${answerIdx + 1}. seçenekti`}</p>
            <p className="measure text-lg">{(item as MatrixPracticeItem).explain}</p>
            <div className="w-full">
              <Options item={item} selected={null} marks={{ right: answerIdx, chosen: fb.chosen }} />
            </div>
            <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
              {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
            </ArmedButton>
          </div>
        ) : (
          <>
            <p className="text-center text-ink-2">{selected === null ? 'Eksik parçaya uyan seçeneğe dokun.' : `${selected + 1}. seçeneği seçtin. Emin olunca cevabı ver.`}</p>
            <Options item={item} selected={selected} onSelect={setSelected} onConfirm={confirm} />
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
