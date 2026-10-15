'use client';

import { useEffect, useRef, useState } from 'react';
import { blankOf, opLimitMs, opText, opTrue } from '@/lib/instruments/complex-span';
import type { ComplexSpanOp, ComplexSpanTask } from '@/lib/instruments/types';
import type { ComplexSpanTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, Stage, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, useKeys, usePageHidden, wait } from './common';

/** Alıştırma 1 (yalnızca harfler), alıştırma 2 (yalnızca işlemler), alıştırma 3 (ikisi birlikte) ve asıl bölüm. */
type Phase = 'letters' | 'ops' | 'combo' | 'test';
type Step = 'intro' | 'op' | 'timeout' | 'letter' | 'gap' | 'recall' | 'opFeedback' | 'opsSummary' | 'setFeedback';

/** Hatırlama ekranındaki süre puana girmez; sunucu en çok 2 dakikalık süre kabul eder (uzun bir aradan sonra da geçerli). */
const MAX_INPUT_MS = 120_000;
/** Süre dolunca "Süre doldu" yazısının ekranda kaldığı süre. */
const TIMEOUT_MS = 700;
/** Harften sonra bir sonraki işlem gelmeden önceki kısa boşluk. */
const GAP_MS = 250;
/** İşlem alıştırmasında doğru cevaptan sonra "Doğru!" yazısının süresi. */
const OK_MS = 700;
/** İşlem alıştırmasında bundan az doğru yapılırsa alıştırmayı yinelemek önerilir (15 işlemde 12, yani %80). */
const OPS_RETRY_BELOW = 0.8;

interface SetData {
  letters: number[];
  /** Alıştırma 1'de işlem yoktur. */
  ops: ComplexSpanOp[] | null;
}

interface SetFeedback {
  size: number;
  correct: number;
  answer: number[];
  opsCorrect: number;
  opsN: number;
  timeouts: number;
}

const INTRO: Record<Phase, { title: string; text: string[]; cta: string }> = {
  letters: {
    title: 'Alıştırma 1: Harfleri hatırla',
    text: [
      'Önce yalnızca harflerle kısa bir alıştırma yapalım. Harfler ekranda tek tek görünecek.',
      'Hepsi bitince harfleri gösterildikleri sırayla seç. Hatırlayamadığın bir harfin yerine BOŞ düğmesine bas; böylece öteki harfler yerinde kalır. Yanlış seçersen SİL ile son harfi silebilirsin.',
    ],
    cta: 'Alıştırmaya başla',
  },
  ops: {
    title: 'Alıştırma 2: İşlemler',
    text: [
      'Şimdi yalnızca işlemlerle bir alıştırma. Önce parantezin içindeki çarpmayı, sonra toplamayı ya da çıkarmayı yap. Eşittirden sonraki sonuç doğruysa DOĞRU, yanlışsa YANLIŞ düğmesine bas.',
      'Hem doğru hem de olabildiğince çabuk cevap ver.',
    ],
    cta: 'İşlem alıştırmasına başla',
  },
  combo: {
    title: 'Alıştırma 3: İkisi birlikte',
    text: [
      'Şimdi ikisi birlikte: önce bir işlem, sonra bir harf, sonra yeni bir işlem ve yeni bir harf… Dizi bitince harfleri gösterildikleri sırayla seç.',
      'Her işlem için alıştırmadaki hızına göre belirlenen bir süre var; süre dolarsa işlem yanlış sayılır ve harfe geçilir. Acele etme ama oyalanma da.',
    ],
    cta: 'Alıştırmaya başla',
  },
  test: {
    title: 'Asıl bölüm',
    text: [
      'Alıştırmalar bitti. Şimdi asıl bölüm başlıyor. Diziler 3 ile 7 harf arasında ve karışık sırada gelecek; dizinin ne zaman biteceğini bilemezsin.',
      'İki işe de özen göster: işlemlerin en az %85’ini doğru yapmaya ve harfleri sırasıyla hatırlamaya çalış. Her dizinin sonunda kısa bir sonuç göreceksin; istersen orada biraz dinlenebilirsin.',
    ],
    cta: 'Asıl bölüme başla',
  },
};

/** "4 harfin hepsi doğru yerde", "4 harften 3 tanesi doğru yerde", "4 harfin hiçbiri doğru yerde değil". */
function share(n: number, total: number, noun: 'harf' | 'işlem', what: string): string {
  if (n === total) return `${total} ${noun}in hepsi ${what}`;
  if (n === 0) return `${total} ${noun}in hiçbiri ${what} değil`;
  return `${total} ${noun}${noun === 'harf' ? 'ten' : 'den'} ${n === 1 ? 'biri' : `${n} tanesi`} ${what}`;
}

/**
 * Fareyle ya da dokunarak basılan görev düğmeleri odağı almaz: sonraki giriş ve boşluk tuşu (TAMAM, BOŞ) son basılan
 * düğmeye ikinci kez basmasın.
 */
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

/** "(3 × 4) − 2 = 10 olur." gibi: işlemin doğru sonucunun adım adım açıklaması (işlem alıştırmasının geri bildirimi). */
function explain(op: ComplexSpanOp): string {
  const [a, b, sign, c, shown] = op;
  const p = a * b;
  const value = p + sign * c;
  return `${a} × ${b} = ${p}; ${p} ${sign > 0 ? '+' : '−'} ${c} = ${value}. Gösterilen sonuç (${shown}) ${value === shown ? 'doğruydu' : 'yanlıştı'}.`;
}

/**
 * Hesapla ve hatırla: her adımda bir işlemin sonucunun doğru olup olmadığına karar verilir (DOĞRU / YANLIŞ ya da D / Y
 * tuşları), ardından bir harf gösterilir; dizinin sonunda harfler sırayla seçilir. İşlem süre sınırı, yalnızca işlemlerden
 * oluşan alıştırmadaki cevap sürelerinden hesaplanır (lib/instruments/complex-span.ts, opLimitMs); süre dolarsa işlem
 * cevapsız (`null`) kaydedilir ve harfe geçilir. Dizi sürerken sayfa gizlenirse dizi baştan gösterilir.
 */
export function ComplexSpan({ task, onDone }: { task: ComplexSpanTask; onDone: (trials: ComplexSpanTrialInput[]) => void }) {
  const [phase, setPhase] = useState<Phase>('letters');
  const [step, setStep] = useState<Step>('intro');
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(0);
  const [recall, setRecall] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [limitMs, setLimitMs] = useState<number | null>(null);
  const [opFeedback, setOpFeedback] = useState<{ ok: boolean; op: ComplexSpanOp } | null>(null);
  const [feedback, setFeedback] = useState<SetFeedback | null>(null);
  const [opsScore, setOpsScore] = useState(0);
  const opStart = useRef(0);
  const recallStart = useRef(0);
  const answered = useRef(false);
  const answers = useRef<{ a: boolean | null; ms: number | null }[]>([]);
  const results = useRef<ComplexSpanTrialInput[]>([]);
  const practiceRts = useRef<number[]>([]);
  const practiceCorrect = useRef(0);
  const totals = useRef({ correct: 0, n: 0 });

  const blank = blankOf(task);
  const maxRecall = Math.max(...task.sets.map((s) => s.letters.length));
  const count =
    phase === 'letters'
      ? task.practiceLetters.length
      : phase === 'ops'
        ? task.practiceOps.length
        : phase === 'combo'
          ? task.practiceSets.length
          : task.sets.length;
  const current: SetData =
    phase === 'letters'
      ? { letters: task.practiceLetters[idx], ops: null }
      : phase === 'ops'
        ? { letters: [], ops: [task.practiceOps[idx]] }
        : phase === 'combo'
          ? task.practiceSets[idx]
          : task.sets[idx];
  const op = current.ops ? current.ops[phase === 'ops' ? 0 : pos] : null;

  /* İşlem ekranı: süre, işlem ekrana çizildiği andan başlar; alıştırma 2 dışında süre sınırı vardır. */
  useEffect(() => {
    if (step !== 'op' || paused) return;
    answered.current = false;
    opStart.current = performance.now();
    const ac = new AbortController();
    (async () => {
      opStart.current = await afterPaint();
      if (phase === 'ops' || limitMs === null) return;
      await wait(limitMs, ac.signal);
      if (answered.current) return;
      answered.current = true;
      answers.current.push({ a: null, ms: null });
      setStep('timeout');
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
    // `run` aynı adımın yeniden başlatılmasını tetikler (sayfa gizlenip dönülünce).
  }, [step, pos, idx, phase, run, paused, limitMs]);

  /* "Süre doldu", harf ve harften sonraki boşluk: belli bir süre sonra kendiliğinden geçilir. */
  useEffect(() => {
    if (paused || (step !== 'timeout' && step !== 'letter' && step !== 'gap')) return;
    const ac = new AbortController();
    (async () => {
      if (step === 'timeout') {
        await wait(TIMEOUT_MS, ac.signal);
        setStep('letter');
        return;
      }
      if (step === 'letter') {
        await wait(task.letterMs, ac.signal);
        setStep('gap');
        return;
      }
      await wait(GAP_MS, ac.signal);
      if (pos + 1 < current.letters.length) {
        setPos(pos + 1);
        setStep(phase === 'letters' ? 'letter' : 'op');
      } else {
        setRecall([]);
        recallStart.current = performance.now();
        setStep('recall');
      }
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
    // current ve phase her adımda o anki diziye aittir; pos, idx ve run adımı yeniden başlatır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, pos, idx, run, paused]);

  /* İşlem alıştırmasında doğru cevaptan sonra kısa bir "Doğru!" ve sonraki işlem. */
  useEffect(() => {
    if (step !== 'opFeedback' || !opFeedback?.ok || paused) return;
    const ac = new AbortController();
    wait(OK_MS, ac.signal)
      .then(() => nextOp())
      .catch((e) => {
        if (!isAbort(e)) throw e;
      });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, opFeedback]);

  const presenting = step === 'op' || step === 'timeout' || step === 'letter' || step === 'gap';
  usePageHidden(presenting && !paused, () => setPaused(true));

  function startSet() {
    answers.current = [];
    setPos(0);
    setRecall([]);
    setStep(phase === 'letters' ? 'letter' : 'op');
    setRun((r) => r + 1);
  }

  function resume() {
    setPaused(false);
    if (phase === 'ops') {
      setStep('op');
      setRun((r) => r + 1);
    } else {
      startSet();
    }
  }

  function begin() {
    if (phase === 'ops') {
      practiceRts.current = [];
      practiceCorrect.current = 0;
      setIdx(0);
      setStep('op');
      setRun((r) => r + 1);
      return;
    }
    if (phase === 'test') totals.current = { correct: 0, n: 0 };
    setIdx(0);
    startSet();
  }

  function answer(a: boolean) {
    // Sayfa gizlenip duraklatılmışken verilen cevap sayılmaz (dönülünce işlem ya da dizi yeniden gösterilir).
    if (step !== 'op' || paused || answered.current || !op) return;
    answered.current = true;
    const ms = Math.max(0, Math.round(performance.now() - opStart.current));
    if (phase === 'ops') {
      practiceRts.current.push(ms);
      const ok = a === opTrue(op);
      if (ok) practiceCorrect.current++;
      setOpFeedback({ ok, op });
      setStep('opFeedback');
      return;
    }
    answers.current.push({ a, ms: Math.min(ms, MAX_INPUT_MS) });
    setStep('letter');
  }

  function nextOp() {
    if (idx + 1 < task.practiceOps.length) {
      setIdx(idx + 1);
      setStep('op');
      return;
    }
    setLimitMs(opLimitMs(practiceRts.current, task.limit));
    setOpsScore(practiceCorrect.current);
    setStep('opsSummary');
  }

  function submitRecall() {
    if (step !== 'recall' || recall.length === 0) return;
    const size = current.letters.length;
    const response = recall.slice(0, size);
    const correct = current.letters.filter((l, k) => response[k] === l).length;
    const ops = current.ops ?? [];
    const opsCorrect = ops.filter((o, k) => answers.current[k]?.a === opTrue(o)).length;
    const timeouts = answers.current.filter((x) => x.a === null).length;
    if (phase === 'test') {
      results.current.push({
        index: idx,
        response: { recall: response, ops: answers.current.slice(0, ops.length), limitMs: limitMs ?? task.limit.maxMs },
        rtMs: Math.min(MAX_INPUT_MS, Math.round(performance.now() - recallStart.current)),
      });
      totals.current = { correct: totals.current.correct + opsCorrect, n: totals.current.n + ops.length };
    }
    setFeedback({ size, correct, answer: current.letters, opsCorrect, opsN: ops.length, timeouts });
    setStep('setFeedback');
  }

  function nextSet() {
    if (idx + 1 < count) {
      setIdx(idx + 1);
      startSet();
      return;
    }
    if (phase === 'test') {
      onDone(results.current);
      return;
    }
    setPhase(phase === 'letters' ? 'ops' : 'test');
    setIdx(0);
    setStep('intro');
  }

  /** Bir dizide aynı harf yoktur: seçilen harf ikinci kez seçilemez (BOŞ birden çok kez seçilebilir). */
  const pick = (x: number) => setRecall((r) => (r.length < maxRecall && (x === blank || !r.includes(x)) ? [...r, x] : r));

  useKeys(!paused && (presenting || step === 'recall'), (e) => {
    if (e.repeat) return;
    // Harf ve işlem gösterilirken boşluk tuşu sayfayı kaydırmasın.
    if (step !== 'op' && step !== 'recall') {
      if (e.key === ' ') e.preventDefault();
      return;
    }
    // Klavyeyle bir düğmeye gelinmişse giriş ve boşluk tuşu o düğmeye basar.
    if (e.target instanceof HTMLButtonElement && (e.key === 'Enter' || e.key === ' ')) return;
    const key = e.key.toLocaleUpperCase('tr-TR');
    if (step === 'op') {
      if (e.key === ' ') e.preventDefault();
      if (key === 'D' || key === 'Y') {
        e.preventDefault();
        answer(key === 'D');
      }
      return;
    }
    const i = task.letters.indexOf(key);
    if (i >= 0) {
      e.preventDefault();
      pick(i);
    } else if (e.key === ' ') {
      e.preventDefault();
      pick(blank);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setRecall((r) => r.slice(0, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submitRecall();
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note={phase === 'ops' ? 'Aynı işlem yeniden gösterilecek.' : 'Dizi yarıda kaldığı için aynı dizi baştan gösterilecek.'}
        cta={phase === 'ops' ? 'Devam et' : 'Diziyi yeniden göster'}
        onResume={resume}
      />
    );
  }

  if (step === 'intro') {
    const t = INTRO[phase];
    return (
      <div className="flex flex-col gap-5">
        <h2 className="t-h2">{t.title}</h2>
        {t.text.map((p) => (
          <p key={p} className="measure text-lg">
            {p}
          </p>
        ))}
        {(phase === 'ops' || phase === 'combo') && <p className="measure text-ink-2">Klavyen varsa D tuşu DOĞRU, Y tuşu YANLIŞ demektir.</p>}
        {phase === 'letters' && (
          <p className="measure text-ink-2">Klavyen varsa harfleri klavyeden de yazabilirsin; boşluk tuşu BOŞ, silme tuşu SİL, giriş tuşu TAMAM demektir.</p>
        )}
        <div>
          <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={begin}>
            {t.cta}
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'opsSummary') {
    const n = task.practiceOps.length;
    const low = opsScore < OPS_RETRY_BELOW * n;
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="t-h2">İşlem alıştırması bitti</h2>
        <p className="measure text-lg">
          {opsScore === 0
            ? `${n} işlemin hiçbirini doğru cevaplayamadın.`
            : `${n} işlemin ${opsScore === n ? 'hepsini' : opsScore === 1 ? 'birini' : `${opsScore} tanesini`} doğru cevapladın.`}
          {low ? ' İşlemlerde biraz zorlandın; istersen alıştırmayı yinele. Önce çarpmayı, sonra toplamayı ya da çıkarmayı yapmayı unutma.' : ''}
        </p>
        <p className="measure text-lg">Bundan sonra her işlem için bir süre olacak. Süre dolarsa işlem yanlış sayılır ve harfe geçilir.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {low && (
            <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={begin}>
              Alıştırmayı yinele
            </ArmedButton>
          )}
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!low}
            onClick={() => {
              setPhase('combo');
              setIdx(0);
              setStep('intro');
            }}
          >
            Devam
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'opFeedback' && opFeedback) {
    return (
      <div className="flex flex-col items-center gap-5 text-center" aria-live="polite">
        <p className={`text-2xl font-bold ${opFeedback.ok ? 'text-ok' : 'text-ink'}`}>{opFeedback.ok ? 'Doğru!' : 'Olmadı, sorun değil.'}</p>
        {!opFeedback.ok && (
          <>
            <p className="tabular measure text-lg">{explain(opFeedback.op)}</p>
            <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextOp}>
              Devam
            </ArmedButton>
          </>
        )}
      </div>
    );
  }

  if (step === 'setFeedback' && feedback) {
    const practice = phase !== 'test';
    const sofar = totals.current.n ? totals.current.correct / totals.current.n : null;
    const last = idx + 1 >= count;
    return (
      <div className="flex flex-col items-center gap-5 text-center" aria-live="polite">
        <h2 className="t-h2">{practice ? 'Alıştırma' : `Dizi ${idx + 1} / ${count}`}</h2>
        <p className="text-xl font-bold">Harfler: {share(feedback.correct, feedback.size, 'harf', 'doğru yerde')}</p>
        {practice && feedback.correct < feedback.size && (
          <p className="text-lg">
            Doğru sıra: <span className="tabular font-bold tracking-[0.2em]">{feedback.answer.map((l) => task.letters[l]).join(' ')}</span>
          </p>
        )}
        {feedback.opsN > 0 && (
          <p className="text-lg">
            İşlemler: {share(feedback.opsCorrect, feedback.opsN, 'işlem', 'doğru')}
            {feedback.timeouts > 0 ? ` (${feedback.timeouts} işlemde süre doldu)` : ''}
          </p>
        )}
        {sofar !== null && (
          <p className={`measure text-lg ${sofar < 0.85 ? 'font-bold' : 'text-ink-2'}`}>
            {sofar === 1 ? 'Şu ana kadar işlemlerin hepsini doğru yaptın.' : `Şu ana kadar doğru yaptığın işlemler: %${Math.round(sofar * 100)}.`}
            {sofar < 0.85 ? ' İşlemlere de özen göster: en az %85’ini doğru yapmaya çalış.' : ''}
          </p>
        )}
        <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={700} onClick={nextSet}>
          {!last ? (practice ? 'Sonraki alıştırma' : 'Sonraki dizi') : phase === 'test' ? 'Bitir' : 'Devam'}
        </ArmedButton>
      </div>
    );
  }

  const label = phase === 'test' ? `Dizi ${idx + 1} / ${count}` : phase === 'ops' ? `Alıştırma: işlem ${idx + 1} / ${count}` : 'Alıştırma';

  if (step === 'recall') {
    return (
      <div className="flex flex-col gap-4">
        <StatusLine>{label}</StatusLine>
        <div
          className="flex min-h-[4.5rem] flex-wrap items-center justify-center gap-2 rounded-2xl border border-rule bg-surface p-3"
          aria-live="polite"
          aria-label="Seçtiğin harfler"
        >
          {recall.length === 0 ? (
            <span className="text-lg text-ink-3">Harfleri gösterildikleri sırayla seç</span>
          ) : (
            recall.map((x, i) => (
              <span
                key={i}
                className={`flex h-14 min-w-11 items-center justify-center rounded-lg border-[1.5px] px-1 font-display text-2xl font-bold ${x === blank ? 'border-rule-strong text-base text-ink-3' : 'border-ink'}`}
              >
                {x === blank ? 'boş' : task.letters[x]}
              </span>
            ))
          )}
        </div>
        <div className="mx-auto grid w-full max-w-[22rem] grid-cols-4 gap-2.5">
          {task.letters.map((l, i) => (
            <button
              key={l}
              type="button"
              onMouseDown={keepFocus}
              onClick={() => pick(i)}
              disabled={recall.length >= maxRecall || recall.includes(i)}
              aria-pressed={recall.includes(i)}
              className={`h-14 rounded-xl border-[1.5px] border-rule-strong bg-surface font-display text-2xl font-bold hover:border-ink active:translate-y-px disabled:opacity-40 ${TOUCH_CLASSES}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="mx-auto grid w-full max-w-[22rem] grid-cols-3 gap-2.5">
          <button
            type="button"
            className={`btn btn-secondary h-14 ${TOUCH_CLASSES}`}
            disabled={recall.length >= maxRecall}
            onMouseDown={keepFocus}
            onClick={() => pick(blank)}
          >
            BOŞ
          </button>
          <button
            type="button"
            className={`btn btn-secondary h-14 ${TOUCH_CLASSES}`}
            disabled={recall.length === 0}
            onMouseDown={keepFocus}
            onClick={() => setRecall((r) => r.slice(0, -1))}
          >
            SİL
          </button>
          <button
            type="button"
            className={`btn btn-primary h-14 ${TOUCH_CLASSES}`}
            disabled={recall.length === 0}
            onMouseDown={keepFocus}
            onClick={submitRecall}
          >
            TAMAM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Stage label={step === 'op' ? 'İşlem' : 'Harf'}>
        {step === 'op' && op ? (
          <span className="tabular text-center font-display text-4xl font-bold sm:text-5xl" aria-live="off">
            {opText(op)}
          </span>
        ) : step === 'timeout' ? (
          <span className="text-2xl font-bold text-ink-2" aria-live="polite">
            Süre doldu
          </span>
        ) : step === 'letter' ? (
          <span className="font-display text-[7rem] font-bold leading-none" aria-live="off">
            {task.letters[current.letters[pos]]}
          </span>
        ) : null}
      </Stage>
      <StatusLine>{label}</StatusLine>
      {(step === 'op' || ((step === 'timeout' || step === 'letter' || step === 'gap') && phase !== 'letters')) && (
        <div className="mx-auto grid w-full max-w-[22rem] grid-cols-2 gap-3">
          <button
            type="button"
            disabled={step !== 'op'}
            onMouseDown={keepFocus}
            onClick={() => answer(true)}
            className={`h-16 rounded-xl border-[1.5px] border-ink bg-surface font-display text-xl font-bold hover:bg-surface-2 active:translate-y-px disabled:opacity-40 ${TOUCH_CLASSES}`}
          >
            DOĞRU
          </button>
          <button
            type="button"
            disabled={step !== 'op'}
            onMouseDown={keepFocus}
            onClick={() => answer(false)}
            className={`h-16 rounded-xl border-[1.5px] border-ink bg-surface font-display text-xl font-bold hover:bg-surface-2 active:translate-y-px disabled:opacity-40 ${TOUCH_CLASSES}`}
          >
            YANLIŞ
          </button>
        </div>
      )}
    </div>
  );
}
