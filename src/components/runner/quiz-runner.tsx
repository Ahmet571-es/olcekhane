'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MathText } from '@/components/quiz/math-text';
import { QuizVisual } from '@/components/quiz/quiz-visuals';
import type { QuizChart, QuizFigure, QuizOptionKey, QuizTable } from '@/lib/instruments/types';
import type { QuizChoice } from '@/lib/scoring/quiz';
import { IntroStep, ProgressRuler } from './likert-runner';
import { useLeaveWarning } from './tasks/common';

/** Tarayıcıya gönderilen soru: cevap anahtarı, açıklama ve hata türleri yoktur. */
export type QuizClientItem = {
  key: string;
  text: string;
  table?: QuizTable;
  chart?: QuizChart;
  figure?: QuizFigure;
  options: { key: QuizOptionKey; text: string }[];
};

type Phase = 'intro' | 'items' | 'review';
type Answer = { choice: QuizChoice; rtMs: number | null };
const LETTER_KEYS: Record<string, QuizOptionKey> = { a: 'A', b: 'B', c: 'C', d: 'D', '1': 'A', '2': 'B', '3': 'C', '4': 'D' };

/** Cevaplar yalnızca bu sayfada tutulur; test bitince hepsi birden `onFinish` ile verilir. */
export function QuizRunner(props: {
  intro: { title: string; paragraphs: string[] };
  /** Soruların ait olduğu sınıf düzeyi (öğrencinin bir önceki sınıfı). */
  contentGrade: number;
  items: QuizClientItem[];
  onFinish: (answers: Record<string, Answer>) => Promise<void>;
}) {
  const { items, onFinish } = props;
  const [answers, setAnswers] = useState<Record<string, QuizChoice>>({});
  const answeredCount = items.filter((i) => answers[i.key] !== undefined).length;
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const shownAt = useRef(0);
  const collected = useRef(new Map<string, Answer>());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase !== 'items') return;
    shownAt.current = performance.now();
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [index, phase]);

  // Cevaplar yalnızca bu sayfada durur: tek bir cevap bile verildiyse ayrılmadan önce uyarılır.
  useLeaveWarning(answeredCount > 0);

  const choose = useCallback(
    (choice: QuizChoice) => {
      const item = items[index];
      const rtMs = Math.round(performance.now() - shownAt.current);
      setAnswers((a) => ({ ...a, [item.key]: choice }));
      collected.current.set(item.key, { choice, rtMs });
    },
    [index, items],
  );

  const next = useCallback(() => {
    if (index < items.length - 1) setIndex(index + 1);
    else setPhase('review');
  }, [index, items.length]);

  useEffect(() => {
    if (phase !== 'items') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const letter = LETTER_KEYS[e.key.toLocaleLowerCase('tr-TR')];
      if (letter) {
        e.preventDefault();
        choose(letter);
      } else if ((e.key === 'Enter' || e.key === 'ArrowRight') && answers[items[index].key] !== undefined) {
        if (e.key === 'Enter' && (e.target as HTMLElement | null)?.tagName === 'BUTTON') return;
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        setIndex(index - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, index, items, answers, choose, next]);

  async function finish() {
    setFinishing(true);
    setFinishError(null);
    try {
      await onFinish(Object.fromEntries(collected.current));
    } catch (err) {
      setFinishing(false);
      setFinishError(err instanceof Error ? err.message : 'Rapor hazırlanamadı. Lütfen tekrar deneyin.');
    }
  }

  if (phase === 'intro') {
    return (
      <IntroStep
        title={`${props.intro.title}: ${props.contentGrade}. sınıf konuları`}
        paragraphs={props.intro.paragraphs}
        cta="Başla"
        onStart={() => setPhase('items')}
      />
    );
  }

  if (phase === 'review') {
    const open = items.map((it, i) => ({ ...it, i })).filter((it) => answers[it.key] === undefined);
    const dontKnow = items.filter((i) => answers[i.key] === 'X').length;
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <ProgressRuler total={items.length} done={answeredCount} />
        <h1 className="t-h1">{open.length === 0 ? 'Bütün soruları tamamladın!' : 'Neredeyse bitti'}</h1>
        {open.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-lg">
              {open.length} soruyu henüz cevaplamadın. Testi bitirmek için bu soruları cevaplaman ya da “Bilmiyorum” olarak işaretlemen
              gerekiyor.
            </p>
            <ul className="flex flex-wrap gap-2">
              {open.map((m) => (
                <li key={m.key}>
                  <button
                    type="button"
                    className="btn btn-secondary tabular"
                    onClick={() => {
                      setIndex(m.i);
                      setPhase('items');
                    }}
                  >
                    {m.i + 1}. soru
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-lg">
            Bütün soruları cevapladın{dontKnow > 0 ? `; ${dontKnow} soruyu “Bilmiyorum” olarak işaretledin` : ''}. Testi bitirdiğinde raporun
            hemen hazırlanacak.
          </p>
        )}
        {finishError && <p className="notice notice-danger">{finishError}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" disabled={open.length > 0 || finishing} onClick={finish}>
            {finishing ? 'Rapor hazırlanıyor…' : 'Testi bitir ve raporu gör'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => {
              setIndex(0);
              setPhase('items');
            }}
          >
            Cevaplarımı gözden geçir
          </button>
        </div>
      </div>
    );
  }

  const item = items[index];
  const selected = answers[item.key];
  const isLast = index === items.length - 1;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-7">
      <div className="flex flex-col gap-3">
        <ProgressRuler total={items.length} done={answeredCount} current={index} />
        <p aria-live="polite" className="tabular text-[0.9375rem] text-ink-3">
          Soru {index + 1} / {items.length}
        </p>
      </div>

      <QuizVisual item={item} />

      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`font-display font-bold leading-snug outline-none ${
          item.text.length > 140 ? 'text-[clamp(1.2rem,2.6vw,1.4rem)]' : 'text-[clamp(1.3rem,3.2vw,1.7rem)]'
        }`}
        style={{ fontStretch: '94%' }}
      >
        <MathText text={item.text} />
      </h1>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">Cevap seçenekleri</legend>
        {item.options.map((o) => {
          const isSel = selected === o.key;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={isSel}
              onClick={() => choose(o.key)}
              className={`flex min-h-[3.4rem] items-center gap-4 rounded-xl border-[1.5px] px-4 py-2.5 text-left text-[1.125rem] transition-colors ${
                isSel ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface hover:border-ink'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.95rem] font-bold ${
                  isSel ? 'border-paper/60' : 'border-rule-strong text-ink-3'
                }`}
                aria-hidden="true"
              >
                {o.key}
              </span>
              <span className="tabular">
                <MathText text={o.text} />
              </span>
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={selected === 'X'}
          onClick={() => choose('X')}
          className={`mt-1 flex min-h-[3rem] items-center justify-center rounded-xl border-[1.5px] border-dashed px-4 text-[1rem] font-semibold transition-colors ${
            selected === 'X' ? 'border-ink bg-surface-2' : 'border-rule-strong text-ink-2 hover:border-ink'
          }`}
        >
          {selected === 'X' ? 'Bilmiyorum olarak işaretlendi' : 'Bilmiyorum'}
        </button>
      </fieldset>

      <div className="mt-auto flex items-center justify-between gap-3">
        <button type="button" className="btn btn-quiet" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Önceki soru
        </button>
        <p className="t-meta hidden text-center sm:block">Kâğıt ve kalem kullanabilirsin. Klavyede A–D tuşları da çalışır.</p>
        <button type="button" className={`btn ${selected !== undefined ? 'btn-primary' : 'btn-quiet'}`} disabled={selected === undefined} onClick={next}>
          {isLast ? 'Bitir' : 'Sonraki soru'}
        </button>
      </div>
    </div>
  );
}
