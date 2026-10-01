'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { shapePath } from '@/lib/instruments/rotation';
import type { MentalRotationTask, RotationShape } from '@/lib/instruments/types';
import type { RotationTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, Stage, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, ordinal, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test' | 'break';
type Shown = { shape: RotationShape; angle: number; mirror: boolean };
type View =
  | { kind: 'blank' }
  | { kind: 'stimulus'; shown: Shown }
  /** Alıştırmada geri bildirim: sağdaki şekil yavaşça düz konuma döndürülür; ayna görüntüsü düz konumda da farklı kalır. */
  | { kind: 'feedback'; shown: Shown; upright: boolean; title: string; text: string; good: boolean };

/** Sunucudaki puanlamayla aynı: 300 ms'den kısa cevaplar şekillere bakmadan verilmiş sayılır. */
const TOO_FAST_MS = 300;
/** Bütün şekiller bu yarıçaplı bir dairenin içine sığar (en büyük şekil 2,61 birim); hepsi aynı boyutta çizilir. */
const R = 2.75;

/** Bir şekil: kareler tek bir dış çizgiyle çizilir; sağdaki şekil önce yansıtılır (ayna), sonra döndürülür. */
function ShapeView({ shape, angle = 0, mirror = false, animate = false }: { shape: RotationShape; angle?: number; mirror?: boolean; animate?: boolean }) {
  const d = useMemo(() => shapePath(shape.cells), [shape]);
  return (
    <svg
      viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`}
      className={`block h-full w-full text-ink ${animate ? 'transition-transform duration-[1200ms] ease-in-out motion-reduce:transition-none' : ''}`}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <g transform={mirror ? 'scale(-1 1)' : undefined}>
        <path d={d} fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * Karşılaştırılan iki şekil yan yana: soldaki hep düz durur. Denemeler arasında çerçeveler boş kalır; böylece sahnenin
 * yüksekliği ve cevap düğmelerinin yeri her denemede aynı kalır.
 */
function Pair({ shown, rightAngle = 0, animate }: { shown: Shown | null; rightAngle?: number; animate?: boolean }) {
  return (
    <div className="grid w-full max-w-[28rem] grid-cols-2 gap-4">
      <div className="aspect-square rounded-xl border border-rule bg-paper p-3">{shown && <ShapeView shape={shown.shape} />}</div>
      <div className="aspect-square rounded-xl border border-rule bg-paper p-3">
        {shown && <ShapeView shape={shown.shape} angle={rightAngle} mirror={shown.mirror} animate={animate} />}
      </div>
    </div>
  );
}

/** Başlamadan önce kuralı gösteren örnek: alıştırma şekli, döndürülmüş hâli ve ayna görüntüsü. */
function Example({ shape }: { shape: RotationShape }) {
  const items: { angle: number; mirror: boolean; caption: string }[] = [
    { angle: 0, mirror: false, caption: 'Soldaki şekil' },
    { angle: 90, mirror: false, caption: 'Aynı (döndürülmüş)' },
    { angle: 0, mirror: true, caption: 'Ayna görüntüsü' },
  ];
  return (
    <figure className="flex w-full max-w-[30rem] flex-col items-center gap-2">
      <div className="grid w-full grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.caption} className="flex flex-col items-center gap-1.5">
            <div className="aspect-square w-full rounded-xl border border-rule bg-paper p-2">
              <ShapeView shape={shape} angle={it.angle} mirror={it.mirror} />
            </div>
            <span className="t-small text-ink-2">{it.caption}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/**
 * Zihinde döndürme görevi: yan yana iki şekil; sağdaki, soldakinin döndürülmüş hâli ya da ayna görüntüsüdür. Karar
 * süresi şekillerin ekrana çizildiği andan düğmeye basılana kadar ölçülür. Alıştırmada her cevaptan sonra sağdaki şekil
 * yavaşça düz konuma döndürülür: aynıysa soldakiyle örtüşür, ayna görüntüsüyse farklı kalır. Sayfa gizlenirse görev
 * duraklar; asıl görevde yarıda kalan deneme, dönülünce yeniden gösterilir (denemeler birbirinden bağımsızdır).
 */
export function MentalRotation({ task, onDone }: { task: MentalRotationTask; onDone: (trials: RotationTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [view, setView] = useState<View>({ kind: 'blank' });
  const [block, setBlock] = useState(0);
  const [count, setCount] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const responder = useRef<((choice: number, t: number) => void) | null>(null);
  const out = useRef<RotationTrialInput[]>([]);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const perBlock = Math.ceil(task.trials.length / task.blocks);
  const running = step === 'practice' || step === 'test';

  useEffect(() => {
    if (!running || paused) return;
    const isPractice = step === 'practice';
    const first = isPractice ? 0 : block * perBlock;
    const startAt = isPractice ? 0 : Math.max(0, out.current.length - first);
    const list: Shown[] = isPractice
      ? task.practice.map((p) => ({ shape: task.practiceShape, angle: p.angle, mirror: p.mirror }))
      : task.trials.slice(first, first + perBlock).map((t) => ({ shape: task.shapes[t.shape], angle: t.angle, mirror: t.mirror }));
    const ac = new AbortController();
    let hits = 0;
    (async () => {
      await wait(900, ac.signal);
      for (let i = startAt; i < list.length; i++) {
        const shown = list[i];
        setView({ kind: 'stimulus', shown });
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
        const rtMs = resp ? Math.min(task.timeoutMs, Math.max(0, Math.round(resp.t - onset))) : null;
        const response = resp ? resp.choice : null;
        if (isPractice) {
          const tooFast = rtMs !== null && rtMs < TOO_FAST_MS;
          const good = response !== null && !tooFast && response === (shown.mirror ? 2 : 1);
          if (good) hits++;
          const why = shown.mirror
            ? 'Sağdaki şekil, soldakinin ayna görüntüsüydü: ne kadar döndürsen de aynı olmuyor.'
            : shown.angle % 360 === 0
              ? 'Sağdaki şekil, soldakinin tıpatıp aynısıydı.'
              : 'Sağdaki şekil, soldakinin döndürülmüş hâliydi: döndürünce aynı oluyor.';
          const title = good
            ? 'Doğru!'
            : response === null
              ? 'Süre doldu'
              : tooFast
                ? 'Çok hızlı bastın'
                : shown.mirror
                  ? 'Bu şekil ayna görüntüsüydü'
                  : 'Bu şekil aynıydı';
          const text = tooFast && !good ? `Önce iki şekli karşılaştır, sonra bas. ${why}` : why;
          setView({ kind: 'feedback', shown, upright: false, title, text, good });
          await afterPaint();
          // Sayfa bu sırada gizlendiyse (duraklatma) eski geri bildirim yeniden gösterilmesin.
          if (ac.signal.aborted) return;
          setView({ kind: 'feedback', shown, upright: true, title, text, good });
          await wait(good ? 2200 : 3200, ac.signal);
        } else {
          out.current.push({ index: first + i, response, rtMs });
          setCount(first + i + 1);
        }
        setView({ kind: 'blank' });
        const [a, b] = task.itiMs;
        await wait(a + Math.round(Math.random() * (b - a)), ac.signal);
      }
      if (isPractice) {
        setPracticeScore(hits);
        setStep('practice-done');
      } else if (block + 1 < task.blocks) {
        setStep('break');
      } else {
        onDoneRef.current(out.current);
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
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (!e.repeat) respond(e.key === 'ArrowLeft' ? 1 : 2, e.timeStamp);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note={step === 'test' ? 'Yaptığın denemeler kaybolmadı; kaldığın yerden devam edeceksin.' : 'Alıştırma baştan başlayacak.'}
        cta={step === 'test' ? undefined : 'Alıştırmayı baştan başlat'}
        onResume={() => setPaused(false)}
      />
    );
  }

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Soldaki şekil hep düz durur. Sağdaki şekil ya onun döndürülmüş hâlidir ya da ayna görüntüsüdür. Ayna görüntüsünü ne kadar döndürsen de soldakiyle
          aynı olmaz.
        </p>
        <Example shape={task.practiceShape} />
        <p className="measure text-lg">
          Önce {task.practice.length} denemelik bir alıştırma yapalım. Her cevaptan sonra sağdaki şeklin döndürülüp soldakiyle karşılaştırıldığını ve doğru
          yapıp yapmadığını göreceksin.
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
            ? 'Sağdaki şekli zihninde döndürüp soldakiyle karşılaştırmayı unutma. İstersen alıştırmayı tekrarlayabilirsin.'
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
          {ordinal(block)} bölüm bitti. Kısa bir mola ver; hazır olduğunda {ordinal(block + 1).toLocaleLowerCase('tr-TR')} bölüme geç.
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
      <Stage label="Karşılaştırılacak iki şekil">
        {view.kind === 'blank' && <Pair shown={null} />}
        {view.kind === 'stimulus' && <Pair shown={view.shown} rightAngle={view.shown.angle} />}
        {view.kind === 'feedback' && (
          <div className="flex w-full flex-col items-center gap-4 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${view.good ? 'text-ok' : 'text-ink'}`}>{view.title}</p>
            <Pair shown={view.shown} rightAngle={view.upright ? 0 : view.shown.angle} animate />
            <p className="measure text-lg">{view.text}</p>
          </div>
        )}
      </Stage>
      <StatusLine>{step === 'practice' ? 'Alıştırma' : `${count} / ${task.trials.length}`}</StatusLine>
      <div className="mx-auto grid w-full max-w-[30rem] grid-cols-2 gap-3">
        {(['Aynı', 'Ayna görüntüsü'] as const).map((label, i) => (
          <button
            key={label}
            type="button"
            className={`btn btn-secondary h-20 flex-col gap-0.5 px-3 text-lg ${TOUCH_CLASSES}`}
            onPointerDown={(e) => {
              if (!primaryPointer(e)) return;
              e.preventDefault();
              respond(i + 1, e.timeStamp);
            }}
            onClick={(e) => {
              // Klavyeyle (sekme tuşuyla gelip Enter) basıldığında; fare ve dokunuş zaten pointerdown ile sayıldı.
              if (e.detail === 0) respond(i + 1, e.timeStamp);
            }}
          >
            {label}
            <span className="t-meta hidden sm:inline">{i === 0 ? '(← tuşu)' : '(→ tuşu)'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
