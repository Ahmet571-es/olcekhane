'use client';

import { useEffect, useRef, useState } from 'react';
import type { VocabularyItem, VocabularyPracticeItem, VocabularyTask } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import { VOCABULARY_TYPE_NAMES, vocabularyQuestion } from '@/lib/instruments/vocabulary';
import type { VocabularyTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir; daha uzun düşünülen sorular bu süreyle kaydedilir. */
const MAX_RT_MS = 120_000;

/** Eş ve zıt anlamda sorulan kelime; cümlede anlam ve deyimlerde cümle (vurgulanan kısım kalın ve altı çizili). */
function Stem({ item }: { item: VocabularyItem }) {
  if (!item.mark) {
    return (
      <div className="flex justify-center rounded-2xl bg-surface-2/60 p-4">
        <span className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border-2 border-rule bg-surface px-5 py-1 text-2xl font-bold text-ink">{item.stem}</span>
      </div>
    );
  }
  const at = item.stem.indexOf(item.mark);
  return (
    <p className="rounded-2xl bg-surface-2/60 p-4 text-center text-lg leading-relaxed sm:text-xl">
      {item.stem.slice(0, at)}
      <strong className="rounded-sm bg-brass/15 text-ink underline decoration-brass decoration-2 underline-offset-4">{item.mark}</strong>
      {item.stem.slice(at + item.mark.length)}
    </p>
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
  item: VocabularyItem;
  selected: number | null;
  onSelect?: (i: number) => void;
  onConfirm?: (now: number) => void;
  /** Alıştırmanın geri bildiriminde: doğru seçenek ve (yanlışsa) seçilen seçenek. */
  marks?: { right: number; chosen: number };
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = item.options.length;
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in step) {
      e.preventDefault();
      const next = (i + step[e.key] + n) % n;
      onSelect?.(next);
      refs.current[next]?.focus();
    } else if (e.key === 'Enter') {
      // Enter seçeneği seçmez, yalnızca seçili cevabı verir; basılı tutulan tuş art arda cevap vermez.
      e.preventDefault();
      if (!e.repeat && selected !== null) onConfirm?.(e.timeStamp);
    }
  };
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Seçenekler">
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
            aria-label={`${VERBAL_LETTERS[i]} seçeneği: ${o}${right ? ' (doğru cevap)' : wrongPick ? ' (senin seçtiğin)' : ''}`}
            disabled={!onSelect}
            onClick={() => onSelect?.(i)}
            className={`flex min-h-[3.25rem] w-full items-center gap-3 rounded-xl border-2 bg-surface px-3 py-2 text-left text-lg hover:bg-surface-2 disabled:cursor-default disabled:hover:bg-surface ${border} ${TOUCH_CLASSES}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${on || right ? 'bg-ink text-surface' : 'bg-surface-2 text-ink-2'}`}
              aria-hidden="true"
            >
              {VERBAL_LETTERS[i]}
            </span>
            <span className="min-w-0 break-words">{o}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Kelime bilgisi: her soruda beş seçenekten biri seçilir. Süre sınırı yoktur; cevap süresi sorunun ekrana çizildiği andan
 * "Cevabı ver" düğmesine basılana kadar ölçülür (sayfa gizliyken geçen süre sayılmaz). Önce her soru türünden birer geri
 * bildirimli alıştırma sorusu çözülür. Asıl sorularda doğru cevap tarayıcıda bilinmez: cevaplar sunucuda puanlanır.
 */
export function Vocabulary({ task, onDone }: { task: VocabularyTask; onDone: (trials: VocabularyTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ chosen: number; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<VocabularyTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  /** Cevap verildikten sonra klavye odağı yeni sorunun seçeneklerine taşınır ("Cevabı ver" düğmesi devre dışı kalır). */
  const refocus = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: VocabularyItem[] = step === 'practice' ? task.practice : task.items;
  const item = list[index];

  // Yeni soru ekrana çizilince süre başlar; sayfa en üste (soruya) kaydırılır.
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
      const good = selected + 1 === (item as VocabularyPracticeItem).answer;
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ chosen: selected, good });
      return;
    }
    out.current.push({ index, response: selected + 1, rtMs });
    // Odak görevin içindeyse (ör. "Cevabı ver" düğmesinde) yeni sorunun seçeneklerine taşınır: devre dışı kalan düğmede
    // kalmaz ve Enter ya da boşluk tuşu sonraki soruda seçim yapılmadan cevap vermez.
    refocus.current = !!top.current && top.current.contains(document.activeElement);
    setSelected(null);
    if (index + 1 < task.items.length) setIndex(index + 1);
    else onDone(out.current);
  }

  function nextPractice() {
    // Klavyeyle ilerleyen kişinin odağı sonraki sorunun seçeneklerine taşınır.
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
    if (pick >= 0 && pick < n && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      setSelected(pick);
      // Odak seçeneklerdeyse yeni seçilen seçeneğe geçer: ok tuşları ve Enter oradan sürer.
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
          Her soruda bir kelime ya da bir cümle ve beş seçenek göreceksin; yalnızca biri doğrudur. Ne sorulduğunu kelimenin ya da cümlenin altındaki soru söyler. Seçeneğe dokun, emin olunca “Cevabı ver” düğmesine bas.
        </p>
        <p className="measure text-lg">
          Önce her soru türünden birer tane olmak üzere {task.practice.length} alıştırma sorusu çözelim. Her cevaptan sonra doğru cevabı ve nedenini göreceksin.
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
              ? 'Alıştırmadaki soruların hepsini doğru cevapladın.'
              : `Alıştırmadaki ${task.practice.length} sorunun ${practiceScore} tanesini doğru cevapladın.`}{' '}
          {low
            ? 'Soruyu ve seçeneklerin hepsini dikkatle oku; cümlede anlam ve deyim sorularında cümlenin bütününe bak. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {task.items.length} soru var ve sorular giderek zorlaşıyor. Süre sınırı yok. Emin olamadığında sana en uygun gelen seçeneği seç.
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
  const answerIdx = practice ? (item as VocabularyPracticeItem).answer - 1 : -1;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>
        {practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`} · {VOCABULARY_TYPE_NAMES[item.type]}
      </StatusLine>
      <div className="mx-auto flex w-full max-w-[36rem] flex-col gap-4">
        <Stem item={item} />
        <p className="text-center text-lg font-bold">{vocabularyQuestion(item)}</p>
        {fb ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>
              {fb.good ? 'Doğru!' : `Doğru cevap: ${VERBAL_LETTERS[answerIdx]}) ${item.options[answerIdx]}`}
            </p>
            <p className="measure mx-auto text-lg">{(item as VocabularyPracticeItem).explain}</p>
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
