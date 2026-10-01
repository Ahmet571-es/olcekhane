'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactionTimeTask } from '@/lib/instruments/types';
import type { ReactionTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, Stage, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';
type Message = { title: string; text?: string; good: boolean } | null;
type Input = NonNullable<ReactionTrialInput['input']>;

/** Sunucudaki puanlamayla aynı (REACTION_EARLY_MS): 150 ms'den kısa tepkiler daireye bakmadan verilmiş sayılır. */
const EARLY_MS = 150;
/**
 * Bir tepkiden sonraki ilk yarım saniyedeki basışlar (ör. çift dokunuş) bir sonraki denemede "çok erken" sayılmaz;
 * daire en erken 1 saniye sonra belirdiği için bu, beklemeden basmayı gizlemez.
 */
const GRACE_MS = 500;

const inputOf = (pointerType: string): Input => (pointerType === 'mouse' ? 'mouse' : pointerType === 'pen' ? 'pen' : 'touch');

const seconds = (ms: number) => (ms / 1000).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Kutular; `lit`: dairenin belirdiği kutu (yoksa boş). */
function Boxes({ n, lit }: { n: 1 | 2; lit: number | null }) {
  return (
    <div className={`grid w-full gap-4 ${n === 1 ? 'max-w-[11rem] grid-cols-1' : 'max-w-[26rem] grid-cols-2'}`}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex aspect-square items-center justify-center rounded-2xl border-2 border-rule-strong bg-paper">
          {lit === i && <span className="block h-1/2 w-1/2 rounded-full bg-ink" />}
        </div>
      ))}
    </div>
  );
}

/**
 * Tepki hızı görevi: önce basit bölüm (tek kutu, tek düğme), sonra seçmeli bölüm (iki kutu, iki düğme). Her denemede
 * kutular boş görünür; değişken bir beklemeden sonra kutuda bir daire belirir. Tepki süresi, dairenin ekrana çizildiği
 * andan basışa kadar ölçülür. Daire belirmeden basılırsa deneme biter ve kısa bir uyarı gösterilir. Sayfa gizlenirse
 * görev duraklar; asıl bölümde yarıda kalan deneme, dönülünce yeniden gösterilir (denemeler birbirinden bağımsızdır).
 *
 * Boşluk tuşu cevap tuşu olduğu için ara ekranlardaki düğmelere odak verilmez ve düğmeler kısa bir süre sonra çalışmaya
 * başlar: bölümdeki son basış, alıştırma sonucunu ya da bir sonraki bölümü atlatmasın.
 */
export function ReactionTime({ task, onDone }: { task: ReactionTimeTask; onDone: (trials: ReactionTrialInput[]) => void }) {
  const [partIndex, setPartIndex] = useState(0);
  const [step, setStep] = useState<Step>('ready');
  const [lit, setLit] = useState<number | null>(null);
  const [message, setMessage] = useState<Message>(null);
  const [count, setCount] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pressed, setPressed] = useState<number | null>(null);
  const responder = useRef<((choice: number, t: number, input: Input) => void) | null>(null);
  const out = useRef<ReactionTrialInput[]>([]);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const part = task.parts[partIndex];
  const offset = task.parts.slice(0, partIndex).reduce((s, p) => s + p.trials.length, 0);
  const running = step === 'practice' || step === 'test';

  useEffect(() => {
    if (!running || paused) return;
    const isPractice = step === 'practice';
    const list = isPractice ? part.practice : part.trials;
    const startAt = isPractice ? 0 : Math.max(0, out.current.length - offset);
    const ac = new AbortController();
    let hits = 0;
    (async () => {
      setLit(null);
      setMessage(null);
      await wait(800, ac.signal);
      for (let i = startAt; i < list.length; i++) {
        const trial = list[i];
        // Bekleme: kutular boş. Bekleme başladıktan kısa bir süre sonra gelen basış "çok erken"dir; deneme biter.
        setLit(null);
        const waitStart = performance.now();
        const early = { choice: null as number | null, input: undefined as Input | undefined };
        const earlyPress = new Promise<void>((resolve) => {
          responder.current = (choice, t, input) => {
            if (t - waitStart < GRACE_MS) return;
            early.choice = choice;
            early.input = input;
            responder.current = null;
            resolve();
          };
        });
        await Promise.race([wait(trial.waitMs, ac.signal), earlyPress]);
        if (ac.signal.aborted) return;
        responder.current = null;
        let response: number | null;
        let rtMs: number | null;
        let input: Input | undefined;
        if (early.choice !== null) {
          response = early.choice;
          rtMs = 0;
          input = early.input;
        } else {
          setLit(trial.box);
          let onset = performance.now();
          const answer = new Promise<{ choice: number; t: number; input: Input }>((resolve) => {
            responder.current = (choice, t, how) => {
              responder.current = null;
              resolve({ choice, t, input: how });
            };
          });
          void afterPaint().then((t) => {
            onset = t;
          });
          const resp = await Promise.race([answer, wait(task.timeoutMs, ac.signal).then(() => null)]);
          responder.current = null;
          response = resp ? resp.choice : null;
          input = resp?.input;
          // Dairenin çizildiği kareden önce gelen basış 0 sayılır (çok erken).
          rtMs = resp ? Math.min(task.timeoutMs, Math.max(0, Math.round(resp.t - onset))) : null;
        }
        setLit(null);
        const tooEarly = rtMs !== null && rtMs < EARLY_MS;
        if (isPractice) {
          const good = response !== null && !tooEarly && response === trial.box + 1;
          if (good) hits++;
          // Seçmeli bölümde fareyle basılırsa imleç düğmeler arasında yol alır: ok tuşları hatırlatılır.
          const mouseHint = part.boxes === 2 && input === 'mouse' ? ' Bilgisayarda fare yerine sol ve sağ ok tuşlarını kullan.' : '';
          setMessage(
            good
              ? { title: part.boxes === 1 ? 'Güzel!' : 'Doğru!', text: `Tepki süren: ${seconds(rtMs as number)} saniye.${mouseHint}`, good }
              : tooEarly
                ? { title: 'Çok erken bastın!', text: `Daireyi bekle; görür görmez bas.${mouseHint}`, good }
                : response === null
                  ? { title: 'Süre doldu', text: 'Daire belirince hemen bas.', good }
                  : { title: 'Daire öteki taraftaydı', text: `Dairenin olduğu taraftaki düğmeye bas.${mouseHint}`, good },
          );
          await wait(good && !mouseHint ? 1300 : 2200, ac.signal);
          setMessage(null);
        } else {
          out.current.push(input ? { index: offset + i, response, rtMs, input } : { index: offset + i, response, rtMs });
          setCount(i + 1);
          if (tooEarly) {
            setMessage({ title: 'Çok erken bastın!', text: 'Daireyi bekle.', good: false });
            await wait(1000, ac.signal);
            setMessage(null);
          }
        }
      }
      if (isPractice) {
        setPracticeScore(hits);
        setStep('practice-done');
      } else if (partIndex + 1 < task.parts.length) {
        setPartIndex((p) => p + 1);
        setCount(0);
        setStep('ready');
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
  }, [step, partIndex, runKey, paused]);

  usePageHidden(running && !paused, () => {
    responder.current = null;
    setLit(null);
    setMessage(null);
    setPaused(true);
  });

  const hit = (choice: number, t: number, input: Input) => {
    responder.current?.(choice, t, input);
    setPressed(choice);
    window.setTimeout(() => setPressed(null), 120);
  };

  useKeys(running && !paused, (e) => {
    const space = e.key === ' ' || e.code === 'Space';
    const arrow = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    // Görev sürerken boşluk ve ok tuşları sayfayı kaydırmasın (öteki bölümün tuşu da).
    if (space || arrow || e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    if (e.repeat) return;
    if (part.boxes === 1 && space) hit(1, e.timeStamp, 'key');
    if (part.boxes === 2 && arrow) hit(e.key === 'ArrowLeft' ? 1 : 2, e.timeStamp, 'key');
  });

  if (paused) {
    return (
      <PausedScreen
        autoFocus={false}
        note={step === 'test' ? 'Yaptığın denemeler kaybolmadı; kaldığın yerden devam edeceksin.' : 'Alıştırma baştan başlayacak.'}
        cta={step === 'test' ? undefined : 'Alıştırmayı baştan başlat'}
        onResume={() => setPaused(false)}
      />
    );
  }

  const choice = part.boxes === 2;

  if (step === 'ready') {
    return (
      <div key={`${step}-${partIndex}`} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {choice
            ? `${partIndex > 0 ? 'Birinci bölüm bitti. ' : ''}Şimdi yan yana iki kutu var. Daire hangi kutuda belirirse o taraftaki düğmeye bas: soldaysa SOL, sağdaysa SAĞ düğmesine. Telefonda ya da tablette iki başparmağını iki düğmenin üstünde tut; bilgisayarda fare yerine sol ve sağ ok tuşlarını kullan.`
            : 'Kutuda bir daire belirdiği anda BAS düğmesine (ya da boşluk tuşuna) olabildiğince hızlı bas. Daire belirmeden basma; bekle.'}
        </p>
        <figure className="flex w-full flex-col items-center gap-2">
          <Boxes n={part.boxes} lit={choice ? 1 : 0} />
          <figcaption className="t-small text-ink-2">{choice ? 'Daire sağdaki kutuda: SAĞ düğmesine bas.' : 'Daire belirdi: hemen BAS.'}</figcaption>
        </figure>
        <p className="measure text-lg">
          Önce {part.practice.length} denemelik bir alıştırma yapalım. Her denemeden sonra {choice ? 'doğru yapıp yapmadığını ve ' : ''}ne kadar hızlı bastığını
          göreceksin.
        </p>
        <ArmedButton className="btn btn-primary btn-lg" onClick={() => setStep('practice')}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const low = practiceScore < Math.ceil(part.practice.length * 0.6);
    return (
      <div key={`${step}-${partIndex}`} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Alıştırmada {part.practice.length} denemenin {practiceScore} tanesini doğru yaptın.{' '}
          {low
            ? choice
              ? 'Dairenin olduğu taraftaki düğmeye basmayı unutma. İstersen alıştırmayı tekrarlayabilirsin.'
              : 'Daireyi bekleyip, görür görmez basmayı unutma. İstersen alıştırmayı tekrarlayabilirsin.'
            : choice
              ? 'Şimdi asıl bölüm başlıyor; artık doğru mu yanlış mı olduğunu ve ne kadar hızlı bastığını görmeyeceksin. Daire belirmeden basarsan yine uyarı göreceksin.'
              : 'Şimdi asıl bölüm başlıyor; artık ne kadar hızlı bastığını görmeyeceksin. Daire belirmeden basarsan yine uyarı göreceksin.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setStep('practice');
              setRunKey((k) => k + 1);
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => {
              setCount(0);
              setStep('test');
            }}
          >
            Bölüme başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Stage label="Kutuların gösterildiği alan">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex min-h-[3.75rem] flex-col items-center justify-center text-center" aria-live="polite">
            {message && (
              <>
                <p className={`text-xl font-bold ${message.good ? 'text-ok' : 'text-ink'}`}>{message.title}</p>
                {message.text && <p className="text-lg">{message.text}</p>}
              </>
            )}
          </div>
          <Boxes n={part.boxes} lit={lit} />
        </div>
      </Stage>
      <StatusLine>{step === 'practice' ? 'Alıştırma' : `${partIndex === 0 ? 'Birinci' : 'İkinci'} bölüm · ${count} / ${part.trials.length}`}</StatusLine>
      {choice ? (
        <div className="mx-auto grid w-full max-w-[26rem] grid-cols-2 gap-4">
          {(['Sol', 'Sağ'] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              className={`btn btn-primary h-24 flex-col gap-0.5 text-2xl transition-transform ${TOUCH_CLASSES} ${pressed === i + 1 ? 'scale-95' : ''}`}
              onPointerDown={(e) => {
                if (!primaryPointer(e)) return;
                e.preventDefault();
                hit(i + 1, e.timeStamp, inputOf(e.pointerType));
              }}
              onClick={(e) => {
                // Klavyeyle (sekme tuşuyla gelip Enter) basıldığında; fare ve dokunuş zaten pointerdown ile sayıldı.
                if (e.detail === 0) hit(i + 1, e.timeStamp, 'key');
              }}
            >
              {label.toLocaleUpperCase('tr-TR')}
              <span className="t-meta hidden text-paper/70 sm:inline">{i === 0 ? '(← tuşu)' : '(→ tuşu)'}</span>
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className={`btn btn-primary mx-auto h-24 w-full max-w-[24rem] text-2xl transition-transform ${TOUCH_CLASSES} ${pressed === 1 ? 'scale-95' : ''}`}
          onPointerDown={(e) => {
            if (!primaryPointer(e)) return;
            e.preventDefault();
            hit(1, e.timeStamp, inputOf(e.pointerType));
          }}
        >
          BAS <span className="t-meta hidden text-paper/70 sm:inline">(boşluk tuşu)</span>
        </button>
      )}
    </div>
  );
}
