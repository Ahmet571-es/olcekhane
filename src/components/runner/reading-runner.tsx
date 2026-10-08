'use client';

import { useEffect, useRef, useState } from 'react';
import { IntroStep, ProgressRuler } from './likert-runner';
import { useLeaveWarning } from './tasks/common';

type Question = { key: string; text: string; options: { key: string; text: string }[] };
type Phase = 'intro' | 'ready' | 'reading' | 'questions' | 'submitting';

/**
 * Okuma süresi ve cevaplar yalnızca bu sayfada tutulur; test bitince `onFinish` ile verilir. Sayfa gizliyken (başka
 * sekme ya da uygulama, ekran kilidi) geçen süre okuma süresine sayılmaz. Sorular birer birer gelir; geçilen soruya geri
 * dönülmez (sonraki soruların kökleri öncekilerin cevabına ipucu olmasın).
 */
export function ReadingRunner(props: {
  intro: { title: string; paragraphs: string[] };
  passage: { key: string; title: string; paragraphs: string[]; questions: Question[] };
  onFinish: (result: { passageKey: string; readingMs: number; answers: Record<string, string> }) => Promise<void>;
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);
  const readingMs = useRef(0);
  /** Okuma sırasında sayfanın gizli kaldığı toplam süre ve gizlendiği an. */
  const hiddenMs = useRef(0);
  const hiddenAt = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const qs = props.passage.questions;

  useEffect(() => {
    if (phase === 'reading' || phase === 'questions') {
      headingRef.current?.focus({ preventScroll: false });
      window.scrollTo({ top: 0 });
    }
  }, [phase, qIndex]);

  // Okuma başladıktan sonra sayfadan ayrılmak bütün cevapları siler.
  useLeaveWarning(phase === 'reading' || phase === 'questions' || phase === 'submitting');

  // Okurken sayfa gizlenirse o süre okuma süresinden düşülür.
  useEffect(() => {
    if (phase !== 'reading') return;
    const on = () => {
      if (document.visibilityState === 'hidden') hiddenAt.current = performance.now();
      else if (hiddenAt.current !== null) {
        hiddenMs.current += performance.now() - hiddenAt.current;
        hiddenAt.current = null;
      }
    };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [phase]);

  async function submit() {
    setPhase('submitting');
    try {
      await props.onFinish({ passageKey: props.passage.key, readingMs: readingMs.current, answers });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rapor hazırlanamadı.');
      setPhase('questions');
    }
  }

  if (phase === 'intro') {
    return <IntroStep title={props.intro.title} paragraphs={props.intro.paragraphs} cta="Hazırım" onStart={() => setPhase('ready')} />;
  }

  if (phase === 'ready') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6">
        <h1 className="t-h1">Metnin adı: {props.passage.title}</h1>
        <p className="text-lg">Düğmeye bastığında metin açılacak ve süre başlayacak. Metni bitirince en alttaki “Okudum” düğmesine bas.</p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            startedAt.current = performance.now();
            hiddenMs.current = 0;
            hiddenAt.current = null;
            setPhase('reading');
          }}
        >
          Okumaya başla
        </button>
      </div>
    );
  }

  if (phase === 'reading') {
    return (
      <article className="mx-auto flex w-full max-w-[40rem] flex-col gap-6 pb-24">
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 outline-none">
          {props.passage.title}
        </h1>
        <div className="flex flex-col gap-5 text-[1.25rem] leading-[1.75]">
          {props.passage.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="sticky bottom-4 mt-4">
          <button
            type="button"
            className="btn btn-primary btn-lg w-full shadow-[var(--shadow)]"
            onClick={() => {
              const now = performance.now();
              const hidden = hiddenMs.current + (hiddenAt.current !== null ? now - hiddenAt.current : 0);
              readingMs.current = Math.max(1000, Math.round(now - startedAt.current - hidden));
              setPhase('questions');
            }}
          >
            Okudum
          </button>
        </div>
      </article>
    );
  }

  const q = qs[qIndex];
  const chosen = answers[q.key];
  const isLast = qIndex === qs.length - 1;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <ProgressRuler total={qs.length} done={Object.keys(answers).length} current={qIndex} />
        <p className="t-small tabular text-ink-3" aria-live="polite">
          Soru {qIndex + 1} / {qs.length}
        </p>
      </div>
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-[clamp(1.45rem,3.6vw,2rem)] font-bold leading-tight outline-none">
        {q.text}
      </h1>
      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">{q.text}</legend>
        {q.options.map((o) => {
          const sel = chosen === o.key;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={sel}
              onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.key }))}
              className={`flex min-h-[3.4rem] items-center gap-4 rounded-xl border-[1.5px] px-4 py-3 text-left text-[1.0625rem] transition-colors ${
                sel ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface hover:border-ink'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold uppercase ${
                  sel ? 'border-paper/60' : 'border-rule-strong text-ink-3'
                }`}
                aria-hidden="true"
              >
                {o.key}
              </span>
              {o.text}
            </button>
          );
        })}
      </fieldset>
      {error && <p className="notice notice-danger">{error}</p>}
      <div className="mt-auto flex items-center justify-between gap-3">
        <p className="t-meta">Seçimini kontrol et: geçtiğin soruya geri dönülmez.</p>
        {isLast ? (
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={Object.keys(answers).length < qs.length || phase === 'submitting'}
            onClick={submit}
          >
            {phase === 'submitting' ? 'Rapor hazırlanıyor…' : 'Bitir ve raporu gör'}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" disabled={!chosen} onClick={() => setQIndex(qIndex + 1)}>
            Sonraki soru
          </button>
        )}
      </div>
      {isLast && Object.keys(answers).length < qs.length && (
        <p className="t-meta">Bitirmek için bütün soruları cevaplaman gerekiyor. Emin olmadığın sorularda en uygun seçeneği işaretle.</p>
      )}
    </div>
  );
}
