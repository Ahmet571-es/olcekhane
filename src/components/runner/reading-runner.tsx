'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { childAssentAction } from '@/app/uygulama/actions';
import { AssentStep, IntroStep, ProgressRuler } from './likert-runner';

type Question = { key: string; text: string; options: { key: string; text: string }[] };
type Phase = 'assent' | 'intro' | 'ready' | 'reading' | 'questions' | 'submitting';

/** Hızlı test: sonuç sunucuya kaydedilmez; okuma süresi ve cevaplar işleyiciye verilir. */
export type LocalReading = { onFinish: (result: { passageKey: string; readingMs: number; answers: Record<string, string> }) => Promise<void> };

export function ReadingRunner(props: {
  attemptId: string;
  studentName: string;
  intro: { title: string; paragraphs: string[] };
  passage: { key: string; title: string; paragraphs: string[]; questions: Question[] };
  assentHtml: string | null;
  reportUrl: string;
  exitUrl: string;
  local?: LocalReading;
}) {
  const { local } = props;
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(props.assentHtml ? 'assent' : 'intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);
  const readingMs = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const qs = props.passage.questions;

  useEffect(() => {
    if (phase === 'reading' || phase === 'questions') {
      headingRef.current?.focus({ preventScroll: false });
      window.scrollTo({ top: 0 });
    }
  }, [phase, qIndex]);

  // Hızlı testte okuma başladıktan sonra sayfadan ayrılmak bütün cevapları siler.
  const unsaved = !!local && (phase === 'reading' || phase === 'questions' || phase === 'submitting');
  useEffect(() => {
    if (!unsaved) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsaved]);

  async function submit() {
    setPhase('submitting');
    if (local) {
      try {
        await local.onFinish({ passageKey: props.passage.key, readingMs: readingMs.current, answers });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Rapor hazırlanamadı.');
        setPhase('questions');
      }
      return;
    }
    try {
      const res = await fetch(`/api/attempts/${props.attemptId}/reading`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ passageKey: props.passage.key, readingMs: readingMs.current, answers }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'Sonuç kaydedilemedi.');
      }
      router.replace(props.reportUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sonuç kaydedilemedi.');
      setPhase('questions');
    }
  }

  if (phase === 'assent' && props.assentHtml) {
    return (
      <AssentStep
        html={props.assentHtml}
        name={props.studentName}
        exitUrl={props.exitUrl}
        onAccept={async () => {
          await childAssentAction(props.attemptId);
          setPhase('intro');
        }}
      />
    );
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
              readingMs.current = Math.round(performance.now() - startedAt.current);
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
        <button type="button" className="btn btn-quiet" disabled={qIndex === 0} onClick={() => setQIndex(qIndex - 1)}>
          Önceki soru
        </button>
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
