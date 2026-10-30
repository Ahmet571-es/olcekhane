'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { glyphOf, strokeEnds, symbolSearchTrials } from '@/lib/instruments/symbol-search';
import type { SymbolRef, SymbolSearchTask, SymbolSearchTrial } from '@/lib/instruments/types';
import type { SymbolSearchTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, primaryPointer, useKeys, usePageHidden } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';
type Answer = 'var' | 'yok';

/** Simgeler belirdikten sonra bundan kısa sürede gelen basış (ör. çift dokunma) cevap sayılmaz. */
const BOUNCE_MS = 200;

/** Simge: 3 × 3 nokta ızgarasında dört çizgi (ekranda ve raporda aynı kalınlıkta, uçları yuvarlak). */
export function SymbolSearchGlyph({ strokes, size, title }: { strokes: string[]; size: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="-0.45 -0.45 2.9 2.9" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill="none" stroke="currentColor" strokeWidth={0.26} strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((s) => {
          const [[x1, y1], [x2, y2]] = strokeEnds(s);
          return <line key={s} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

const sameRef = (a: SymbolRef, b: SymbolRef) => a.g === b.g && a.l === b.l;

/**
 * Simge bulma: üstte iki aranan simge, altta dört simgelik sıra; aranan simgelerden biri sırada tıpatıp aynısıyla varsa "Var",
 * yoksa "Yok". Önce geri bildirimli alıştırma (yanlışta neden yanlış olduğu, ilgili simge çerçevelenerek gösterilir), sonra
 * süreli asıl bölüm. Denemeler uygulama kimliğinden üretilir (sunucu aynı denemeleri üretip puanlar). Süre dolduğunda o ana
 * kadarki kararlar puanlanır (hiç karar yoksa boş liste). Sayfa gizlenince görev ve süre durur; dönülünce kalan süreyle aynı
 * denemeden devam edilir.
 */
export function SymbolSearch({ task, seed, onDone }: { task: SymbolSearchTask; seed: string; onDone: (trials: SymbolSearchTrialInput[]) => void }) {
  const trials = useMemo(() => symbolSearchTrials(task, seed), [task, seed]);
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  /** Alıştırmada verilen son cevap: doğruysa kısa bir "Doğru!", yanlışsa açıklama ve "Devam et". */
  const [feedback, setFeedback] = useState<{ correct: boolean; ans: Answer } | null>(null);
  const [practiceHits, setPracticeHits] = useState(0);
  const [remaining, setRemaining] = useState(task.durationMs);
  const [paused, setPaused] = useState(false);
  const onset = useRef(0);
  const records = useRef<SymbolSearchTrialInput[]>([]);
  const finished = useRef(false);
  /** Asıl bölümde, duraklatmalardan önce geçen süre (ms) ve süren dilimin başladığı an. */
  const used = useRef(0);
  const segStart = useRef(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const running = (step === 'practice' || step === 'test') && !paused;
  const list: SymbolSearchTrial[] = step === 'practice' ? task.practice : trials;
  const trial = list[Math.min(index, list.length - 1)];

  // Her yeni denemenin ekrana çizildiği an, karar süresinin başlangıcıdır.
  useEffect(() => {
    if (!running) return;
    onset.current = performance.now();
    let cancelled = false;
    void afterPaint().then((t) => {
      if (!cancelled) onset.current = t;
    });
    return () => {
      cancelled = true;
    };
  }, [index, running]);

  // Asıl bölümün süresi; duraklatılınca durur, dönülünce kalan süreden devam eder.
  useEffect(() => {
    if (step !== 'test' || paused) return;
    const start = performance.now();
    segStart.current = start;
    const id = window.setInterval(() => {
      const left = Math.max(0, task.durationMs - used.current - (performance.now() - start));
      setRemaining(left);
      if (left <= 0 && !finished.current) {
        finished.current = true;
        window.clearInterval(id);
        onDoneRef.current(records.current);
      }
    }, 200);
    return () => {
      window.clearInterval(id);
      used.current += performance.now() - start;
    };
  }, [step, paused, task.durationMs]);

  usePageHidden(running, () => setPaused(true));

  function answer(ans: Answer, t: number) {
    if (!running || feedback !== null || finished.current) return;
    // Süre dolduktan sonra (zamanlayıcı görevi bitirmeden önceki kısa arada) gelen basış sayılmaz.
    if (step === 'test' && used.current + (t - segStart.current) >= task.durationMs) return;
    const rtMs = Math.round(t - onset.current);
    if (rtMs < BOUNCE_MS) return;
    const correct = (ans === 'var') === trial.present;
    if (step === 'practice') {
      if (correct) setPracticeHits((h) => h + 1);
      setFeedback({ correct, ans });
      if (correct) window.setTimeout(() => nextPractice(), 700);
      return;
    }
    const at = Math.min(task.durationMs, Math.max(0, Math.round(used.current + (t - segStart.current))));
    const last = records.current[records.current.length - 1]?.response.at ?? 0;
    records.current.push({ index, response: { ans, at: Math.max(at, last) }, rtMs });
    if (index + 1 >= trials.length) {
      finished.current = true;
      onDoneRef.current(records.current);
      return;
    }
    setIndex(index + 1);
  }

  function nextPractice() {
    setFeedback(null);
    if (index + 1 >= task.practice.length) setStep('practice-done');
    else setIndex(index + 1);
  }

  useKeys(running && feedback === null, (e) => {
    const k = e.key.toLocaleLowerCase('tr-TR');
    const ans: Answer | null = e.key === 'ArrowLeft' || k === 'v' ? 'var' : e.key === 'ArrowRight' || k === 'y' ? 'yok' : null;
    if (!ans) return;
    e.preventDefault();
    // Basılı tutulan tuş art arda cevap sayılmaz.
    if (!e.repeat) answer(ans, e.timeStamp);
  });

  if (paused) {
    return (
      <PausedScreen
        note={step === 'test' ? 'Süre de durdu; kaldığın denemeden, kalan sürenle devam edeceksin.' : 'Alıştırmaya kaldığın yerden devam edeceksin.'}
        onResume={() => setPaused(false)}
      />
    );
  }

  const startPractice = () => {
    setIndex(0);
    setFeedback(null);
    setPracticeHits(0);
    setStep('practice');
  };
  const startTest = () => {
    setIndex(0);
    setFeedback(null);
    finished.current = false;
    records.current = [];
    used.current = 0;
    setRemaining(task.durationMs);
    setStep('test');
  };

  if (step === 'ready') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Önce {task.practice.length} denemelik bir alıştırma yapalım. Aranan simgelerden biri sırada tıpatıp aynısıyla varsa “Var”, yoksa “Yok” düğmesine bas.
        </p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={startPractice}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const n = task.practice.length;
    const seconds = Math.round(task.durationMs / 1000);
    const low = practiceHits < 4;
    const hits =
      practiceHits === 0
        ? `Alıştırmada ${n} denemenin hiçbirinde doğru karar veremedin.`
        : `Alıştırmada ${n} denemenin ${practiceHits === n ? 'hepsinde' : `${practiceHits} tanesinde`} doğru karar verdin.`;
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {hits}{' '}
          {low
            ? 'Aranan simgelerden biri sırada tıpatıp aynısıyla varsa “Var” de; bir çizgisi farklı benzer simge aynı simge sayılmaz. İstersen alıştırmayı tekrarlayabilirsin.'
            : `Şimdi ${seconds % 60 === 0 ? `${seconds / 60} dakika` : `${seconds} saniye`} boyunca yapabildiğin kadar karar ver; hem hızlı hem doğru olmaya çalış. Asıl bölümde doğru mu yanlış mı olduğunu görmeyeceksin.`}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`} autoFocus={low} onClick={startPractice}>
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`} autoFocus={!low} onClick={startTest}>
            Göreve başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  // Alıştırmada yanlış cevapta çerçevelenecek simgeler: sıradaki aranan simge ya da benzer simge ve onun aranan simgesi.
  const wrong = step === 'practice' && feedback && !feedback.correct;
  const shownTarget = trial.group.find((g) => g.l === undefined && trial.targets.includes(g.g));
  const shownLook = trial.group.find((g) => g.l !== undefined);
  const ringGroup = (ref: SymbolRef) => !!wrong && (trial.present ? !!shownTarget && sameRef(ref, shownTarget) : !!shownLook && sameRef(ref, shownLook));
  const ringTarget = (g: number) => !!wrong && (trial.present ? shownTarget?.g === g : shownLook?.g === g);
  const explain = !wrong
    ? null
    : trial.present
      ? 'Olmadı: çerçeveli simge aranan simgelerden biriyle tıpatıp aynı. Böyle bir durumda “Var” demek gerekir.'
      : trial.lookalike
        ? 'Olmadı: çerçeveli simge aranan simgeye çok benziyor ama bir çizgisi farklı; aynı simge sayılmaz. Doğru cevap “Yok”.'
        : 'Olmadı: aranan simgelerin hiçbiri sırada yok. Doğru cevap “Yok”.';

  const pct = (remaining / task.durationMs) * 100;
  return (
    <div className="flex flex-col gap-4">
      {step === 'test' && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
          </div>
          <span className="tabular w-14 text-right text-ink-3">{Math.ceil(remaining / 1000)} sn</span>
        </div>
      )}
      <div role="group" className="flex flex-col items-center gap-4 rounded-2xl border border-rule bg-surface p-4 sm:p-6" aria-label="Aranan simgeler ve sıra">
        <div className="flex flex-col items-center gap-1.5">
          <p className="t-meta">Aranan simgeler</p>
          <div className="flex gap-3 rounded-xl border-[1.5px] border-rule-strong bg-surface-2 px-4 py-2.5">
            {trial.targets.map((g) => (
              <span key={g} className={`rounded-lg p-1 text-ink ${ringTarget(g) ? 'ring-[3px] ring-brass' : ''}`}>
                <SymbolSearchGlyph strokes={task.glyphs[g]} size={56} />
              </span>
            ))}
          </div>
        </div>
        <div role="group" className="grid w-full max-w-[22rem] grid-cols-4 gap-2" aria-label="Sıra">
          {trial.group.map((ref, i) => (
            <div
              key={`${index}-${i}`}
              className={`flex aspect-square items-center justify-center rounded-xl border border-rule bg-surface-2 text-ink ${ringGroup(ref) ? 'ring-[3px] ring-brass' : ''}`}
            >
              <SymbolSearchGlyph strokes={glyphOf(task, ref)} size={50} />
            </div>
          ))}
        </div>
      </div>
      <StatusLine>
        {feedback?.correct ? 'Doğru!' : explain ?? (step === 'practice' ? `Alıştırma ${index + 1} / ${task.practice.length}` : 'Aranan simgelerden biri sırada var mı?')}
      </StatusLine>
      {wrong ? (
        <div className="flex justify-center">
          <ArmedButton className="btn btn-primary btn-lg" delayMs={600} autoFocus onClick={() => nextPractice()}>
            Devam et
          </ArmedButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {(['var', 'yok'] as const).map((a) => (
            <button
              key={a}
              type="button"
              className={`flex h-16 flex-col items-center justify-center rounded-xl border-[1.5px] border-rule-strong bg-surface font-display text-xl font-bold hover:border-ink active:translate-y-px ${TOUCH_CLASSES}`}
              onPointerDown={(e) => {
                e.preventDefault();
                if (primaryPointer(e)) answer(a, e.timeStamp);
              }}
              onClick={(e) => {
                // Klavyeyle (sekme tuşuyla gelip Enter) basıldığında; fare ve dokunuş zaten pointerdown ile sayıldı.
                if (e.detail === 0) answer(a, e.timeStamp);
              }}
            >
              {a === 'var' ? 'Var' : 'Yok'}
              <span className="hidden text-xs font-normal text-ink-3 sm:block" aria-hidden="true">
                {a === 'var' ? '← ya da V' : '→ ya da Y'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
