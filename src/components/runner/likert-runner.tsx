'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ITEM_NOUN_ACCUSATIVE, type ItemNoun } from '@/lib/instruments/nouns';
import { useLeaveWarning } from './tasks/common';

type Option = { value: number; label: string };
type Item = { key: string; text: string };
type Phase = 'intro' | 'items' | 'review';

export function ProgressRuler({ total, done, current }: { total: number; done: number; current?: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-3" aria-hidden="true">
        <div className="absolute inset-x-0 top-[5px] h-px bg-rule-strong" />
        <div
          className="absolute inset-x-0 top-0 h-3 opacity-60"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, var(--rule-strong) 0 1px, transparent 1px calc(100% / ${total}))`,
            backgroundSize: 'calc(100% + 1px) 6px',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute left-0 top-[4px] h-[3px] rounded-full bg-ink transition-[width] duration-300" style={{ width: `${(done / total) * 100}%` }} />
        {current !== undefined && (
          <div className="absolute -top-0.5 h-4 w-[2px] bg-marker" style={{ left: `calc(${((current + 0.5) / total) * 100}% - 1px)` }} />
        )}
      </div>
    </div>
  );
}

export function IntroStep({ title, paragraphs, onStart, cta }: { title: string; paragraphs: string[]; onStart: () => void; cta: string }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="t-h1">{title}</h1>
      <div className="flex flex-col gap-3 text-lg">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div>
        <button type="button" className="btn btn-primary btn-lg" onClick={onStart} autoFocus>
          {cta}
        </button>
      </div>
    </div>
  );
}

/**
 * Cevaplar sunucuya tek tek gönderilmez, yalnızca bu sayfada tutulur; test bitince hepsi birden
 * `onFinish` ile verilir. Sayfa kapanırsa cevaplar kaybolur.
 */
export function LikertRunner(props: {
  intro: { title: string; paragraphs: string[] };
  prompt: string;
  options: Option[];
  items: Item[];
  /** Maddelerin adı ("etkinlik" ya da "cümle"); atlanan maddeler anlatılırken kullanılır. */
  itemNoun: ItemNoun;
  minAnswered: number;
  onFinish: (answers: Record<string, { value: number; rtMs: number | null }>) => Promise<void>;
}) {
  const { items, options, onFinish } = props;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answeredCount = Object.keys(answers).length;
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const shownAt = useRef<number>(0);
  const collected = useRef(new Map<string, { value: number; rtMs: number | null }>());
  const advanceTimer = useRef<number | null>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (phase === 'items') {
      shownAt.current = performance.now();
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [index, phase]);

  // Cevaplar yalnızca bu sayfada durur: tek bir cevap bile verildiyse sayfadan ayrılmadan önce uyarılır.
  useLeaveWarning(answeredCount > 0);

  const choose = useCallback(
    (value: number) => {
      const item = items[index];
      const rtMs = Math.round(performance.now() - shownAt.current);
      setAnswers((a) => ({ ...a, [item.key]: value }));
      collected.current.set(item.key, { value, rtMs });
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => {
        if (index < items.length - 1) setIndex(index + 1);
        else setPhase('review');
      }, 260);
    },
    [index, items],
  );

  useEffect(() => {
    if (phase !== 'items') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        e.preventDefault();
        choose(options[n - 1].value);
      } else if (e.key === 'ArrowLeft' && index > 0) {
        setIndex(index - 1);
      } else if (e.key === 'ArrowRight' && answers[items[index].key] !== undefined) {
        if (index < items.length - 1) setIndex(index + 1);
        else setPhase('review');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, index, options, choose, answers, items]);

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
    return <IntroStep title={props.intro.title} paragraphs={props.intro.paragraphs} cta="Başla" onStart={() => setPhase('items')} />;
  }

  if (phase === 'review') {
    const missing = items.map((it, i) => ({ ...it, i })).filter((it) => answers[it.key] === undefined);
    const canFinish = answeredCount >= props.minAnswered;
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <ProgressRuler total={items.length} done={answeredCount} />
        <h1 className="t-h1">{missing.length === 0 ? 'Hepsini cevapladın!' : 'Neredeyse bitti'}</h1>
        {missing.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-lg">
              {missing.length} {ITEM_NOUN_ACCUSATIVE[props.itemNoun]} atlamışsın. {canFinish ? 'İstersen bunları cevaplayabilir ya da testi bitirebilirsin.' : 'Testi bitirmek için bunları da cevaplaman gerekiyor.'}
            </p>
            <ul className="flex flex-col gap-2">
              {missing.slice(0, 10).map((m) => (
                <li key={m.key}>
                  <button
                    type="button"
                    className="btn btn-secondary w-full justify-start text-left font-normal"
                    onClick={() => {
                      setIndex(m.i);
                      setPhase('items');
                    }}
                  >
                    {m.i + 1}. {m.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-lg">Bitirdiğinde raporun hemen hazırlanacak.</p>
        )}
        {finishError && <p className="notice notice-danger">{finishError}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" disabled={!canFinish || finishing} onClick={finish}>
            {finishing ? 'Rapor hazırlanıyor…' : 'Testi bitir ve raporu gör'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => {
              setIndex(items.length - 1);
              setPhase('items');
            }}
          >
            Cevaplarıma dön
          </button>
        </div>
      </div>
    );
  }

  const item = items[index];
  const selected = answers[item.key];
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <ProgressRuler total={items.length} done={answeredCount} current={index} />
        <p aria-live="polite" className="tabular text-[0.9375rem] text-ink-3">
          {index + 1} / {items.length}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="t-meta">{props.prompt}</p>
        <p
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[clamp(1.6rem,4.2vw,2.35rem)] font-bold leading-tight outline-none"
          style={{ fontStretch: '92%' }}
        >
          {item.text}
        </p>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">{props.prompt}</legend>
        {options.map((o, i) => {
          const isSel = selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={isSel}
              onClick={() => choose(o.value)}
              className={`flex min-h-[3.4rem] items-center gap-4 rounded-xl border-[1.5px] px-4 text-left text-[1.0625rem] font-semibold transition-colors ${
                isSel ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface hover:border-ink'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm tabular ${
                  isSel ? 'border-paper/60' : 'border-rule-strong text-ink-3'
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {o.label}
            </button>
          );
        })}
      </fieldset>

      <div className="mt-auto flex items-center justify-between gap-3">
        <button type="button" className="btn btn-quiet" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Önceki
        </button>
        <p className="t-meta hidden sm:block">Klavyeyle 1–{options.length} tuşlarını da kullanabilirsin.</p>
        <button
          type="button"
          className="btn btn-quiet"
          disabled={selected === undefined}
          onClick={() => (index < items.length - 1 ? setIndex(index + 1) : setPhase('review'))}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
