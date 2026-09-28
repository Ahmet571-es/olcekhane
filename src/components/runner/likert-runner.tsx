'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { childAssentAction } from '@/app/uygulama/actions';

type Option = { value: number; label: string };
type Item = { key: string; text: string };
type Phase = 'assent' | 'intro' | 'items' | 'review';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

export function AssentStep({ html, onAccept, exitUrl, name }: { html: string; onAccept: () => void; exitUrl: string; name: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="t-h1">Merhaba {name}!</h1>
      <div className="prose-olc" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            onAccept();
          }}
        >
          Anladım, başlamak istiyorum
        </button>
        <a href={exitUrl} className="btn btn-secondary btn-lg">
          Şimdi değil
        </a>
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

export function LikertRunner(props: {
  attemptId: string;
  studentName: string;
  intro: { title: string; paragraphs: string[] };
  prompt: string;
  options: Option[];
  items: Item[];
  minAnswered: number;
  initialAnswers: Record<string, number>;
  assentHtml: string | null;
  reportUrl: string;
  exitUrl: string;
}) {
  const { items, options, attemptId } = props;
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>(props.initialAnswers);
  const answeredCount = Object.keys(answers).length;
  const firstUnanswered = items.findIndex((i) => answers[i.key] === undefined);
  const [phase, setPhase] = useState<Phase>(props.assentHtml ? 'assent' : 'intro');
  const [index, setIndex] = useState(firstUnanswered === -1 ? items.length - 1 : firstUnanswered);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');
  const [fatal, setFatal] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  const shownAt = useRef<number>(0);
  const pending = useRef(new Map<string, { value: number; rtMs: number | null }>());
  const flushing = useRef(false);
  const advanceTimer = useRef<number | null>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);

  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;
    let backoff = 800;
    while (pending.current.size > 0) {
      const [key, payload] = pending.current.entries().next().value as [string, { value: number; rtMs: number | null }];
      setSaveState('saving');
      try {
        const res = await fetch(`/api/attempts/${attemptId}/answer`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ itemKey: key, value: payload.value, rtMs: payload.rtMs }),
          keepalive: true,
        });
        if (res.status === 401) {
          setFatal('Oturumun süresi dolmuş. Cevapların kaydedildi; devam etmek için yeniden giriş yapılması gerekiyor.');
          break;
        }
        if (res.status === 409) {
          setFatal('Bu test başka bir sekmede tamamlanmış ya da kapatılmış.');
          break;
        }
        if (!res.ok) throw new Error(String(res.status));
        if (pending.current.get(key) === payload) pending.current.delete(key);
        backoff = 800;
      } catch {
        setSaveState('error');
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 8000);
      }
    }
    if (pending.current.size === 0) setSaveState('idle');
    flushing.current = false;
  }, [attemptId]);

  useEffect(() => {
    if (phase === 'items') {
      shownAt.current = performance.now();
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [index, phase]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (pending.current.size > 0) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const choose = useCallback(
    (value: number) => {
      const item = items[index];
      const rtMs = Math.round(performance.now() - shownAt.current);
      setAnswers((a) => ({ ...a, [item.key]: value }));
      pending.current.set(item.key, { value, rtMs });
      void flush();
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => {
        if (index < items.length - 1) setIndex(index + 1);
        else setPhase('review');
      }, 260);
    },
    [flush, index, items],
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
    await flush();
    for (let i = 0; i < 20 && pending.current.size > 0; i++) await sleep(500);
    try {
      const res = await fetch(`/api/attempts/${attemptId}/complete`, { method: 'POST' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'Test tamamlanamadı.');
      }
      router.replace(props.reportUrl);
    } catch (err) {
      setFinishing(false);
      setFatal(err instanceof Error ? err.message : 'Test tamamlanamadı. Lütfen tekrar deneyin.');
    }
  }

  if (fatal) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <p className="notice notice-danger">{fatal}</p>
        <a href={props.exitUrl} className="btn btn-secondary self-start">
          Geri dön
        </a>
      </div>
    );
  }

  if (phase === 'assent' && props.assentHtml) {
    return (
      <AssentStep
        html={props.assentHtml}
        name={props.studentName}
        exitUrl={props.exitUrl}
        onAccept={async () => {
          await childAssentAction(attemptId);
          setPhase('intro');
        }}
      />
    );
  }

  if (phase === 'intro') {
    return (
      <IntroStep
        title={props.intro.title}
        paragraphs={props.intro.paragraphs}
        cta={answeredCount > 0 ? 'Kaldığın yerden devam et' : 'Başla'}
        onStart={() => setPhase(answeredCount >= items.length ? 'review' : 'items')}
      />
    );
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
              {missing.length} cümleyi atlamışsın. {canFinish ? 'İstersen bunları cevaplayabilir ya da testi bitirebilirsin.' : 'Testi bitirmek için bunları da cevaplaman gerekiyor.'}
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
          <p className="text-lg">Cevapların kaydedildi. Bitirdiğinde raporun hemen hazırlanacak.</p>
        )}
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
        <SaveIndicator state={saveState} />
      </div>
    );
  }

  const item = items[index];
  const selected = answers[item.key];
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <ProgressRuler total={items.length} done={answeredCount} current={index} />
        <div className="flex items-center justify-between text-[0.9375rem] text-ink-3">
          <span aria-live="polite" className="tabular">
            {index + 1} / {items.length}
          </span>
          <SaveIndicator state={saveState} />
        </div>
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

export function SaveIndicator({ state }: { state: 'idle' | 'saving' | 'error' }) {
  if (state === 'error') return <span className="t-small font-bold text-warn">Bağlantı sorunu, tekrar deneniyor…</span>;
  if (state === 'saving') return <span className="t-small">Kaydediliyor…</span>;
  return <span className="t-small">Kaydedildi</span>;
}
