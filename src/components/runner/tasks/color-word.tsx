'use client';

import { useEffect, useRef, useState } from 'react';
import type { ColorWordTask } from '@/lib/instruments/types';
import type { ColorWordTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, ordinal, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'check' | 'check-done' | 'practice' | 'practice-done' | 'test' | 'break';
type Mode = 'check' | 'practice' | 'test';
type View =
  | { kind: 'blank' }
  | { kind: 'fixation' }
  | { kind: 'patch'; ink: number }
  | { kind: 'stimulus'; word: number; ink: number }
  | { kind: 'feedback'; text: string; good: boolean };

/** Renklerin her temada aynı görünmesi için sahne, temadan bağımsız koyu bir zemindir. */
const STAGE_BG = '#161a23';
/** Sunucudaki puanlamayla aynı: 200 ms'den kısa cevaplar kelimeye bakmadan verilmiş sayılır. */
const TOO_FAST_MS = 200;

/**
 * Renk-kelime görevi (Stroop düzeni): renk adı, kendi renginde ya da başka bir renkte yazılır; yazının rengine göre
 * cevap verilir. Önce kelimesiz bir renk denemesi (renkli şerit), sonra geri bildirimli alıştırma, sonra asıl görev
 * gelir. Tepki süresi uyaranın ekrana çizildiği andan düğmeye basılana kadar ölçülür. Sayfa gizlenirse (başka sekme,
 * ekran kilidi) görev duraklar; asıl görevde yarıda kalan deneme, dönülünce yeniden gösterilir.
 */
export function ColorWord({ task, onDone }: { task: ColorWordTask; onDone: (trials: ColorWordTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [view, setView] = useState<View>({ kind: 'blank' });
  const [block, setBlock] = useState(0);
  const [count, setCount] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [checkWrong, setCheckWrong] = useState(0);
  const [checkRight, setCheckRight] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const responder = useRef<((choice: number, t: number) => void) | null>(null);
  const out = useRef<ColorWordTrialInput[]>([]);
  const checkOut = useRef<ColorWordTrialInput[]>([]);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const perBlock = Math.ceil(task.trials.length / task.blocks);
  const running = step === 'check' || step === 'practice' || step === 'test';

  useEffect(() => {
    if (!running || paused) return;
    const mode = step as Mode;
    const first = mode === 'test' ? block * perBlock : 0;
    // Asıl görevde duraklatmadan dönülünce bölümün yarıda kalan denemesinden devam edilir; renk denemesi ve
    // alıştırma baştan başlar.
    const startAt = mode === 'test' ? Math.max(0, out.current.length - first) : 0;
    const list: { word: number | null; ink: number }[] =
      mode === 'check' ? task.check.map((ink) => ({ word: null, ink })) : mode === 'practice' ? task.practice : task.trials.slice(first, first + perBlock);
    if (mode === 'check') checkOut.current = [];
    const ac = new AbortController();
    let hits = 0;
    (async () => {
      await wait(900, ac.signal);
      for (let i = startAt; i < list.length; i++) {
        const trial = list[i];
        setView({ kind: 'fixation' });
        await wait(task.fixationMs, ac.signal);
        setView(trial.word === null ? { kind: 'patch', ink: trial.ink } : { kind: 'stimulus', word: trial.word, ink: trial.ink });
        let onset = performance.now();
        const answer = new Promise<{ choice: number; t: number }>((resolve) => {
          responder.current = (choice, t) => {
            responder.current = null;
            resolve({ choice, t });
          };
        });
        void afterPaint().then((t) => {
          onset = t;
        });
        const resp = await Promise.race([answer, wait(task.timeoutMs, ac.signal).then(() => null)]);
        responder.current = null;
        // Uyaran çizilmeden önceki basış 0 ms sayılır (çok erken); süre sınırı aşılamaz.
        const rtMs = resp ? Math.min(task.timeoutMs, Math.max(0, Math.round(resp.t - onset))) : null;
        const response = resp ? resp.choice + 1 : null;
        if (mode === 'practice') {
          const tooFast = rtMs !== null && rtMs < TOO_FAST_MS;
          const correct = !!resp && !tooFast && resp.choice === trial.ink;
          if (correct) hits++;
          const text = correct
            ? 'Doğru!'
            : !resp
              ? 'Biraz daha hızlı olmaya çalış.'
              : tooFast
                ? 'Çok hızlı bastın; önce yazının rengine bak.'
                : 'Kelimeye değil, yazının rengine bak.';
          setView({ kind: 'feedback', text, good: correct });
          await wait(900, ac.signal);
        } else if (mode === 'check') {
          checkOut.current.push({ index: task.trials.length + i, response, rtMs });
        } else {
          out.current.push({ index: first + i, response, rtMs });
          setCount(first + i + 1);
        }
        setView({ kind: 'blank' });
        const [a, b] = task.itiMs;
        await wait(a + Math.round(Math.random() * (b - a)), ac.signal);
      }
      if (mode === 'check') {
        // Sunucudaki sayımla aynı: süre içinde verilen, çok erken olmayan cevaplar.
        const valid = checkOut.current.filter((t) => t.response !== null && (t.rtMs ?? 0) >= TOO_FAST_MS);
        const right = valid.filter((t) => t.response === task.check[t.index - task.trials.length] + 1).length;
        setCheckRight(right);
        setCheckWrong(valid.length - right);
        setStep('check-done');
      } else if (mode === 'practice') {
        setPracticeScore(hits);
        setStep('practice-done');
      } else if (block + 1 < task.blocks) {
        setStep('break');
      } else {
        onDoneRef.current([...out.current, ...checkOut.current]);
      }
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => {
      responder.current = null;
      ac.abort();
    };
    // runKey aynı adımı (ör. alıştırmayı) yeniden başlatmak için kullanılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, block, runKey, paused]);

  usePageHidden(running && !paused, () => {
    responder.current = null;
    setView({ kind: 'blank' });
    setPaused(true);
  });

  const respond = (choice: number, t: number) => responder.current?.(choice, t);

  useKeys(running && !paused, (e) => {
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= task.colors.length) {
      e.preventDefault();
      if (!e.repeat) respond(n - 1, e.timeStamp);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note={step === 'test' ? 'Yaptığın denemeler kaybolmadı; kaldığın yerden devam edeceksin.' : 'Bu kısa bölüm baştan başlayacak.'}
        onResume={() => setPaused(false)}
      />
    );
  }

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Önce renkleri tanıyalım. Ekranda kelime olmadan yalnızca renkli bir şerit göreceksin; aynı rengin düğmesine bas. Bu kısa denemede{' '}
          {task.check.length} şerit gösterilir.
        </p>
        <ColorKey task={task} />
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            setCount(0);
            setStep('check');
          }}
        >
          Renk denemesine başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'check-done') {
    const flagged = checkWrong >= task.checkLimit;
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        {flagged ? (
          <p className="notice notice-warn measure text-left">
            Renk denemesinde {task.check.length} şeridin {checkWrong} tanesinde başka bir rengin düğmesine bastın; bazı renkleri birbirine
            karıştırmış olabilirsin. Renkleri ayırt etmekte zorlanıyorsan (ör. renk körlüğü) bu görevin sonucu seni doğru yansıtmayabilir;
            raporuna bununla ilgili bir not eklenecek. Yine de devam edebilirsin.
          </p>
        ) : (
          <p className="measure text-lg">
            Renk denemesi bitti: {task.check.length} şeridin {checkRight === task.check.length ? 'hepsinde' : `${checkRight} tanesinde`} doğru rengi
            buldun.{checkRight < task.check.length - checkWrong ? ' Renkli şeridi görünce hemen o rengin düğmesine basmayı unutma.' : ''}
          </p>
        )}
        <p className="measure text-lg">
          Şimdi {task.practice.length} denemelik bir alıştırma yapalım: ekranda renk adları göreceksin. Kelimeyi okumaya değil, yazının rengine bak.
          Her denemeden sonra doğru yapıp yapmadığını göreceksin.
        </p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('practice')}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const low = practiceScore < Math.ceil(task.practice.length * 0.6);
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Alıştırmada {task.practice.length} denemenin {practiceScore} tanesini doğru yaptın.{' '}
          {low
            ? 'Kelimeyi okumaya değil, yazının rengine bakmayı unutma. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl görev başlıyor; artık doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={low}
            onClick={() => {
              setStep('practice');
              setRunKey((k) => k + 1);
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!low}
            onClick={() => {
              setCount(0);
              setStep('test');
            }}
          >
            Göreve başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'break') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {ordinal(block)} bölüm bitti. Kısa bir mola ver; hazır olduğunda {ordinal(block + 1).toLocaleLowerCase('tr-TR')} bölüme geç. Yine kelimeye
          değil, yazının rengine bak.
        </p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            setBlock((b) => b + 1);
            setStep('test');
          }}
        >
          {ordinal(block + 1)} bölüme başla
        </ArmedButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="relative flex min-h-[13rem] items-center justify-center rounded-2xl p-6 select-none"
        style={{ background: STAGE_BG }}
        aria-label="Renkli kelimenin gösterildiği alan"
      >
        {view.kind === 'fixation' && <span className="font-display text-5xl font-bold text-white/70">+</span>}
        {view.kind === 'patch' && (
          <span data-patch className="block h-14 w-44 max-w-full rounded-xl" style={{ background: task.colors[view.ink].ink }} role="img" aria-label="Renkli şerit" />
        )}
        {view.kind === 'stimulus' && (
          <span className="font-display text-[clamp(2.4rem,10vw,3.8rem)] font-bold tracking-wide" style={{ color: task.colors[view.ink].ink }}>
            {task.colors[view.word].name}
          </span>
        )}
        {view.kind === 'feedback' && (
          <p className="text-2xl font-bold text-white" aria-live="polite">
            {view.text}
          </p>
        )}
      </div>
      <StatusLine>{step === 'check' ? 'Renk denemesi' : step === 'practice' ? 'Alıştırma' : `${count} / ${task.trials.length}`}</StatusLine>
      <div className="mx-auto grid w-full max-w-[36rem] grid-cols-2 gap-3 sm:grid-cols-4">
        {task.colors.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={`btn btn-secondary h-16 gap-2.5 px-3 text-base ${TOUCH_CLASSES}`}
            onPointerDown={(e) => {
              if (!primaryPointer(e)) return;
              e.preventDefault();
              respond(i, e.timeStamp);
            }}
            onClick={(e) => {
              // Klavyeyle (sekme tuşuyla gelip Enter) basıldığında; fare ve dokunuş zaten pointerdown ile sayıldı.
              if (e.detail === 0) respond(i, e.timeStamp);
            }}
          >
            <span className="size-4 shrink-0 rounded-full border border-black/20" style={{ background: c.ink }} aria-hidden="true" />
            {c.name}
            <span className="t-meta hidden sm:inline">({i + 1})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Başlamadan önce renklerin ve düğmelerin tanıtımı. */
function ColorKey({ task }: { task: ColorWordTask }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="t-small text-ink-2">Düğmeler ve renkleri:</p>
      <ul className="flex flex-wrap justify-center gap-2">
        {task.colors.map((c) => (
          <li key={c.name} className="chip gap-2 py-1 text-[0.9rem]">
            <span className="size-4 shrink-0 rounded-full border border-black/20" style={{ background: c.ink }} aria-hidden="true" />
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
