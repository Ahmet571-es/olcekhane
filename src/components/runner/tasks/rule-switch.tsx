'use client';

import { useEffect, useRef, useState } from 'react';
import { RULE_NAMES, RULE_SWITCH_COLORS, ruleAnswer } from '@/lib/instruments/rule-switch';
import type { RuleSwitchRule, RuleSwitchTask, RuleSwitchTrial } from '@/lib/instruments/types';
import type { RuleSwitchTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Part = 'color' | 'shape' | 'mixed';
type Stage = { kind: 'practice'; part: Part } | { kind: 'block'; block: number };
type Step = 'intro' | 'run' | 'practice-done' | 'break';
type View =
  | { kind: 'blank' }
  | { kind: 'cue'; rule: RuleSwitchRule }
  | { kind: 'stimulus'; trial: RuleSwitchTrial }
  | { kind: 'feedback'; text: string; good: boolean };

/** Bölümler sırayla: her kuraldan önce alıştırma; iki karışık bölüm arasında mola. */
const STAGES: Stage[] = [
  { kind: 'practice', part: 'color' },
  { kind: 'block', block: 0 },
  { kind: 'practice', part: 'shape' },
  { kind: 'block', block: 1 },
  { kind: 'practice', part: 'mixed' },
  { kind: 'block', block: 2 },
  { kind: 'block', block: 3 },
];

/** Şekillerin renkleri her temada aynı görünsün diye sahne, temadan bağımsız açık bir zemindir. */
const STAGE_BG = '#eef1f6';
const INK = '#1f2937';
/** Sunucudaki puanlamayla aynı: 200 ms'den kısa cevaplar şekle bakmadan verilmiş sayılır. */
const TOO_FAST_MS = 200;

const RULE_HELP: Record<RuleSwitchRule, string> = {
  color: 'RENK: mavi ise sol, turuncu ise sağ.',
  shape: 'ŞEKİL: daire ise sol, kare ise sağ.',
};

/** Şekil: mavi ya da turuncu daire ya da kare. */
function Shape({ trial, size = 112 }: { trial: Pick<RuleSwitchTrial, 'color' | 'shape'>; size?: number }) {
  const fill = RULE_SWITCH_COLORS[trial.color].fill;
  const label = `${RULE_SWITCH_COLORS[trial.color].name.toLocaleLowerCase('tr-TR')} ${trial.shape === 0 ? 'daire' : 'kare'}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label}>
      {trial.shape === 0 ? <circle cx={50} cy={50} r={44} fill={fill} /> : <rect x={8} y={8} width={84} height={84} rx={6} fill={fill} />}
    </svg>
  );
}

/** Kural işareti: RENK koyu zeminde iki renkli nokta, ŞEKİL açık zeminde daire ve kare çizgisi. */
function Cue({ rule }: { rule: RuleSwitchRule }) {
  const color = rule === 'color';
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 font-display text-xl font-bold tracking-wider"
      style={color ? { background: INK, color: '#ffffff', borderColor: INK } : { background: '#ffffff', color: INK, borderColor: INK }}
    >
      {color ? (
        <>
          <span className="size-3.5 rounded-full" style={{ background: RULE_SWITCH_COLORS[0].fill }} aria-hidden="true" />
          <span className="size-3.5 rounded-full" style={{ background: RULE_SWITCH_COLORS[1].fill }} aria-hidden="true" />
        </>
      ) : (
        <svg width="34" height="16" viewBox="0 0 34 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke={INK} strokeWidth="2" />
          <rect x="20" y="1.5" width="13" height="13" rx="1.5" fill="none" stroke={INK} strokeWidth="2" />
        </svg>
      )}
      {RULE_NAMES[rule]}
    </span>
  );
}

/** Düğmelerin anlamı: sol mavi ve daire, sağ turuncu ve kare. */
function SideLabel({ side }: { side: 0 | 1 }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-4 shrink-0 rounded-full border border-black/20" style={{ background: RULE_SWITCH_COLORS[side].fill }} aria-hidden="true" />
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
        {side === 0 ? (
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        ) : (
          <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
      <span>
        {RULE_SWITCH_COLORS[side].name} · {side === 0 ? 'Daire' : 'Kare'}
      </span>
    </span>
  );
}

function Key() {
  return (
    <div className="grid w-full max-w-[30rem] grid-cols-2 gap-3 text-left">
      <div className="flex flex-col gap-1 rounded-xl border border-rule p-3">
        <span className="t-small text-ink-2">Sol düğme</span>
        <SideLabel side={0} />
      </div>
      <div className="flex flex-col gap-1 rounded-xl border border-rule p-3">
        <span className="t-small text-ink-2">Sağ düğme</span>
        <SideLabel side={1} />
      </div>
    </div>
  );
}

/**
 * Kural değiştirme (görev değiştirme düzeni): şeklin üstündeki işaret (RENK ya da ŞEKİL) kuralı söyler; kurala göre sol
 * ya da sağ düğmeye basılır. İşaret şekilden önce belirir ve şekille birlikte kalır. Tepki süresi şeklin ekrana
 * çizildiği andan basışa kadar ölçülür. Sayfa gizlenirse görev duraklar; asıl bölümde yarıda kalan deneme, dönülünce
 * yeniden gösterilir; alıştırma baştan başlar.
 */
export function RuleSwitch({ task, onDone }: { task: RuleSwitchTask; onDone: (trials: RuleSwitchTrialInput[]) => void }) {
  const [stage, setStage] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [view, setView] = useState<View>({ kind: 'blank' });
  const [count, setCount] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const responder = useRef<((side: number, t: number) => void) | null>(null);
  const out = useRef<RuleSwitchTrialInput[]>([]);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const current = STAGES[stage];
  const running = step === 'run';

  useEffect(() => {
    if (!running || paused) return;
    const st = current;
    // Asıl bölümde duraklatmadan dönülünce yarıda kalan denemeden devam edilir; alıştırma baştan başlar.
    const first = st.kind === 'block' ? task.trials.findIndex((t) => t.block === st.block) : 0;
    const list = st.kind === 'block' ? task.trials.filter((t) => t.block === st.block) : task.practice[st.part];
    const startAt = st.kind === 'block' ? Math.max(0, out.current.length - first) : 0;
    const ac = new AbortController();
    let hits = 0;
    (async () => {
      await wait(900, ac.signal);
      for (let i = startAt; i < list.length; i++) {
        const trial = list[i];
        setView({ kind: 'cue', rule: trial.rule });
        await wait(task.cueMs, ac.signal);
        setView({ kind: 'stimulus', trial });
        let onset = performance.now();
        const answer = new Promise<{ side: number; t: number }>((resolve) => {
          responder.current = (side, t) => {
            responder.current = null;
            resolve({ side, t });
          };
        });
        void afterPaint().then((t) => {
          onset = t;
        });
        const resp = await Promise.race([answer, wait(task.timeoutMs, ac.signal).then(() => null)]);
        responder.current = null;
        // Şekil çizilmeden önceki basış 0 ms sayılır (çok erken); süre sınırı aşılamaz.
        const rtMs = resp ? Math.min(task.timeoutMs, Math.max(0, Math.round(resp.t - onset))) : null;
        if (st.kind === 'practice') {
          const tooFast = rtMs !== null && rtMs < TOO_FAST_MS;
          const correct = !!resp && !tooFast && resp.side === ruleAnswer(trial);
          if (correct) hits++;
          const text = correct
            ? 'Doğru!'
            : !resp
              ? 'Biraz daha hızlı olmaya çalış.'
              : tooFast
                ? 'Çok hızlı bastın; önce işarete ve şekle bak.'
                : `İşarete bak: ${RULE_HELP[trial.rule]}`;
          setView({ kind: 'feedback', text, good: correct });
          await wait(correct ? 700 : 1500, ac.signal);
        } else {
          out.current.push({ index: first + i, response: resp ? resp.side + 1 : null, rtMs });
          setCount(first + i + 1);
        }
        setView({ kind: 'blank' });
        const [a, b] = task.itiMs;
        await wait(a + Math.round(Math.random() * (b - a)), ac.signal);
      }
      if (st.kind === 'practice') {
        setPracticeScore(hits);
        setStep('practice-done');
      } else if (stage + 1 >= STAGES.length) {
        onDoneRef.current(out.current);
      } else {
        setStage(stage + 1);
        setStep(STAGES[stage + 1].kind === 'practice' ? 'intro' : 'break');
      }
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => {
      responder.current = null;
      ac.abort();
    };
    // runKey aynı alıştırmayı yeniden başlatmak için kullanılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stage, runKey, paused]);

  usePageHidden(running && !paused, () => {
    responder.current = null;
    setView({ kind: 'blank' });
    setPaused(true);
  });

  const respond = (side: number, t: number) => responder.current?.(side, t);

  useKeys(running && !paused, (e) => {
    const side = e.key === 'ArrowLeft' ? 0 : e.key === 'ArrowRight' ? 1 : -1;
    if (side >= 0) {
      e.preventDefault();
      if (!e.repeat) respond(side, e.timeStamp);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note={current.kind === 'block' ? 'Yaptığın denemeler kaybolmadı; kaldığın yerden devam edeceksin.' : 'Bu alıştırma baştan başlayacak.'}
        onResume={() => setPaused(false)}
      />
    );
  }

  if (step === 'intro' && current.kind === 'practice') {
    const part = current.part;
    return (
      <div key={`${step}-${stage}`} className="flex flex-col items-center gap-6 text-center">
        {part === 'color' && (
          <>
            <p className="measure text-lg">
              Ekranda mavi ya da turuncu bir daire ya da kare göreceksin. Şeklin üstündeki işaret, hangi kurala göre basacağını söyler.
            </p>
            <Cue rule="color" />
            <p className="measure text-lg">
              Önce yalnızca <strong>RENK</strong> kuralı var: şeklin rengine bak. Şekil <strong>mavi</strong> ise <strong>sol</strong>,{' '}
              <strong>turuncu</strong> ise <strong>sağ</strong> düğmeye bas. Şeklin daire ya da kare olması bu kuralda önemli değil.
            </p>
          </>
        )}
        {part === 'shape' && (
          <>
            <p className="measure text-lg">Renk bölümü bitti. Şimdi kural değişiyor.</p>
            <Cue rule="shape" />
            <p className="measure text-lg">
              <strong>ŞEKİL</strong> kuralında şeklin biçimine bak. Şekil <strong>daire</strong> ise <strong>sol</strong>, <strong>kare</strong> ise{' '}
              <strong>sağ</strong> düğmeye bas. Şeklin rengi bu kuralda önemli değil.
            </p>
          </>
        )}
        {part === 'mixed' && (
          <>
            <p className="measure text-lg">Şekil bölümü bitti. Şimdi iki kural karışacak: her denemede şeklin üstündeki işarete bak.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Cue rule="color" />
              <Cue rule="shape" />
            </div>
            <p className="measure text-lg">
              İşaret <strong>RENK</strong> ise renge bak (mavi sol, turuncu sağ); <strong>ŞEKİL</strong> ise biçime bak (daire sol, kare sağ). İşaret
              bazen aynı kalır, bazen değişir.
            </p>
          </>
        )}
        <Key />
        <p className="measure text-ink-2">
          Telefonda ya da tablette iki başparmağını iki düğmenin üstünde tut; bilgisayarda sol ve sağ ok tuşlarını kullan. Önce kısa bir alıştırma
          yapacaksın; her denemeden sonra doğru yapıp yapmadığını göreceksin.
        </p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('run')}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done' && current.kind === 'practice') {
    const n = task.practice[current.part].length;
    const low = practiceScore < Math.ceil(n * 0.7);
    const rule = current.part === 'mixed' ? 'Her denemede şeklin üstündeki işarete bakmayı unutma.' : RULE_HELP[current.part];
    return (
      <div key={`${step}-${stage}`} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Alıştırmada {n} denemenin {practiceScore === n ? 'hepsini' : `${practiceScore} tanesini`} doğru yaptın.{' '}
          {low ? `${rule} İstersen alıştırmayı tekrarlayabilirsin.` : 'Şimdi asıl bölüm başlıyor; artık doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <Key />
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={low}
            onClick={() => {
              setStep('run');
              setRunKey((k) => k + 1);
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!low}
            onClick={() => {
              setStage(stage + 1);
              setStep('run');
            }}
          >
            Bölüme başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'break') {
    return (
      <div key={`${step}-${stage}`} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Bu bölüm bitti. Kısa bir mola ver; hazır olduğunda son bölüme geç. Yine her denemede şeklin üstündeki işarete bak: RENK ise renge, ŞEKİL ise
          biçime göre bas.
        </p>
        <Key />
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('run')}>
          Son bölüme başla
        </ArmedButton>
      </div>
    );
  }

  const status =
    current.kind === 'practice'
      ? 'Alıştırma'
      : `${count} / ${task.trials.length}`;
  return (
    <div className="flex flex-col gap-5">
      <div
        className="relative flex min-h-[15rem] flex-col items-center justify-center gap-4 rounded-2xl p-6 select-none"
        style={{ background: STAGE_BG }}
        aria-label="Şeklin gösterildiği alan"
      >
        {(view.kind === 'cue' || view.kind === 'stimulus') && <Cue rule={view.kind === 'cue' ? view.rule : view.trial.rule} />}
        <div className="flex h-[7rem] items-center justify-center">
          {view.kind === 'stimulus' && <Shape trial={view.trial} />}
          {view.kind === 'feedback' && (
            <p className="text-2xl font-bold" style={{ color: view.good ? '#15803d' : INK }} aria-live="polite">
              {view.text}
            </p>
          )}
        </div>
      </div>
      <StatusLine>{status}</StatusLine>
      <div className="mx-auto grid w-full max-w-[36rem] grid-cols-2 gap-3">
        {([0, 1] as const).map((side) => (
          <button
            key={side}
            type="button"
            className={`btn btn-secondary h-20 flex-col gap-1 px-2 text-base ${TOUCH_CLASSES}`}
            onPointerDown={(e) => {
              if (!primaryPointer(e)) return;
              e.preventDefault();
              respond(side, e.timeStamp);
            }}
            onClick={(e) => {
              // Klavyeyle (sekme tuşuyla gelip Enter) basıldığında; fare ve dokunuş zaten pointerdown ile sayıldı.
              if (e.detail === 0) respond(side, e.timeStamp);
            }}
            aria-label={side === 0 ? 'Sol düğme: mavi ya da daire' : 'Sağ düğme: turuncu ya da kare'}
          >
            <SideLabel side={side} />
            <span className="t-meta hidden sm:inline" aria-hidden="true">
              {side === 0 ? '← sol ok' : 'sağ ok →'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
