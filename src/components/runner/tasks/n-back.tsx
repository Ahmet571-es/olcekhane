'use client';

import { useEffect, useRef, useState } from 'react';
import { nBackRoles } from '@/lib/instruments/sequences';
import type { NBackBlock, NBackTask } from '@/lib/instruments/types';
import type { NBackTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, Stage, StatusLine, TOUCH_CLASSES, isAbort, ordinal, primaryPointer, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test' | 'break';
type View =
  | { kind: 'blank' }
  | { kind: 'stimulus'; letter: string }
  /** Alıştırmada geri bildirim: karşılaştırılan harfler (n önceki harften bu harfe kadar) ve açıklama. */
  | { kind: 'feedback'; title: string; text: string; good: boolean; letters: string[] };

/** Sunucudaki puanlamayla aynı: harf göründükten sonra 150 ms'den önceki basış harfe verilmiş cevap sayılmaz. */
const TOO_EARLY_MS = 150;
const RULE = { 1: 'bir önceki', 2: 'iki önceki' } as const;
const LEVEL = { 1: 'Bir geri', 2: 'İki geri' } as const;

/** Kuralı gösteren örnek: karşılaştırılan iki harf vurgulanır. */
function Example({ n }: { n: 1 | 2 }) {
  const letters = n === 1 ? ['B', 'K', 'K'] : ['K', 'M', 'K'];
  return (
    <figure className="flex flex-col items-center gap-2">
      <LetterRow letters={letters} n={n} />
      <figcaption className="t-small text-ink-2">{n === 1 ? 'B, K, K: ikinci K’de basarsın.' : 'K, M, K: ikinci K’de basarsın.'}</figcaption>
    </figure>
  );
}

/** Harf sırası; son harf ile n önceki harf (karşılaştırılan iki harf) vurgulanır. */
function LetterRow({ letters, n }: { letters: string[]; n: 1 | 2 }) {
  const last = letters.length - 1;
  return (
    <div className="flex gap-2" aria-hidden="true">
      {letters.map((l, i) => (
        <span
          key={i}
          className={`flex h-14 w-12 items-center justify-center rounded-lg border-2 font-display text-2xl font-bold ${
            i === last || i === last - n ? 'border-ink bg-surface-2' : 'border-rule text-ink-3'
          }`}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

/**
 * Geriye dönük hatırlama (n-geri düzeni): harfler sabit bir hızla art arda gösterilir; harf n önceki harfle aynıysa
 * AYNI düğmesine basılır. Her denemede cevap penceresi harfin ekrana çizildiği andan bir sonraki harfe kadardır;
 * pencere içindeki ilk basış sayılır. Harf göründükten sonraki ilk 150 ms'deki basışlar (çoğunlukla bir önceki harfe geç
 * kalmış basışlar) yok sayılır. Her yeni kuraldan (n) önce geri bildirimli bir alıştırma yapılır.
 *
 * Sayfa gizlenirse görev duraklar; dönülünce o bölüm baştan başlar (n-geri düzeninde harfler birbirine bağlıdır: yarıda
 * kalan bir bölüme kaldığı yerden devam edilemez). Önceki bölümlerin denemeleri korunur.
 *
 * Boşluk tuşu cevap tuşu olduğu için ara ekranlardaki düğmelere odak verilmez ve düğmeler kısa bir süre sonra
 * çalışmaya başlar: görevdeki son basış, alıştırma sonucunu ya da molayı atlatmasın.
 */
export function NBack({ task, onDone }: { task: NBackTask; onDone: (trials: NBackTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [view, setView] = useState<View>({ kind: 'blank' });
  const [block, setBlock] = useState(0);
  const [count, setCount] = useState(0);
  const [practiceStats, setPracticeStats] = useState({ targets: 0, hits: 0, falseAlarms: 0 });
  const [runKey, setRunKey] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [paused, setPaused] = useState(false);
  const press = useRef<((t: number) => void) | null>(null);
  const out = useRef<NBackTrialInput[]>([]);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  const running = step === 'practice' || step === 'test';
  const current = task.blocks[block];
  const n = current.n;
  const practiceFor = (k: 1 | 2): NBackBlock | undefined => task.practice.find((p) => p.n === k);
  /** Bu düzeyin ilk bölümünden önce alıştırma yapılır. */
  const needsPractice = (b: number) => !!practiceFor(task.blocks[b].n) && (b === 0 || task.blocks[b - 1].n !== task.blocks[b].n);

  useEffect(() => {
    if (!running || paused) return;
    const isPractice = step === 'practice';
    const seq = isPractice ? practiceFor(current.n)! : current;
    const roles = nBackRoles(seq.letters, seq.n);
    // Bu bölümün ilk denemesinin bütün görevdeki sırası; bölüm (yeniden) başlarken bu bölümün denemeleri silinir.
    const first = task.blocks.slice(0, block).reduce((s, b) => s + b.letters.length, 0);
    if (!isPractice) out.current = out.current.slice(0, first);
    const ac = new AbortController();
    const stats = { targets: 0, hits: 0, falseAlarms: 0 };
    (async () => {
      await wait(1200, ac.signal);
      for (let i = 0; i < seq.letters.length; i++) {
        const letter = seq.letters[i];
        const presses: number[] = [];
        const shownAt = performance.now();
        // İlk kare: harfin çizileceği karenin başı. Tepki süresi, öteki görevlerdeki gibi harfin çizildiği sonraki
        // kareden ölçülür.
        let firstFrame = Number.POSITIVE_INFINITY;
        let onset = Number.POSITIVE_INFINITY;
        press.current = (t) => {
          presses.push(t);
        };
        setView({ kind: 'stimulus', letter });
        requestAnimationFrame((t1) => {
          firstFrame = t1;
          requestAnimationFrame((t2) => {
            onset = t2;
          });
        });
        await wait(task.stimulusMs, ac.signal);
        setView({ kind: 'blank' });
        await wait(task.trialMs - task.stimulusMs, ac.signal);
        press.current = null;
        if (!Number.isFinite(firstFrame)) firstFrame = shownAt;
        if (!Number.isFinite(onset)) onset = firstFrame;
        const at = presses.find((t) => t >= onset + TOO_EARLY_MS);
        const rtMs = at === undefined ? null : Math.min(task.trialMs, Math.max(0, Math.round(at - onset)));
        if (isPractice) {
          const role = roles[i];
          const did = rtMs !== null;
          const shown = seq.letters.slice(Math.max(0, i - seq.n), i + 1);
          let fb: Omit<Extract<View, { kind: 'feedback' }>, 'kind' | 'letters'> | null = null;
          if (role === 'target') {
            stats.targets++;
            if (did) stats.hits++;
            fb = did
              ? { title: 'Doğru!', text: `${letter}, ${RULE[seq.n]} harfle aynıydı.`, good: true }
              : { title: 'Bu harf aynıydı', text: `${letter}, ${RULE[seq.n]} harfle aynıydı; burada basman gerekiyordu.`, good: false };
          } else if (did) {
            stats.falseAlarms++;
            fb = {
              title: 'Bu harf aynı değildi',
              text:
                role === 'lure'
                  ? `${letter}, bir önceki harfle aynıydı ama iki önceki harfle aynı değildi; burada basmaman gerekiyordu.`
                  : `${letter}, ${RULE[seq.n]} harfle aynı değildi; burada basmaman gerekiyordu.`,
              good: false,
            };
          }
          if (fb) {
            setView({ kind: 'feedback', ...fb, letters: shown });
            await wait(fb.good ? 1300 : 2600, ac.signal);
            setView({ kind: 'blank' });
            await wait(500, ac.signal);
          }
        } else {
          out.current.push({ index: first + i, response: rtMs === null ? null : 1, rtMs });
          setCount(i + 1);
        }
      }
      if (isPractice) {
        setPracticeStats(stats);
        setStep('practice-done');
      } else if (block + 1 < task.blocks.length) {
        const next = block + 1;
        setBlock(next);
        setStep(needsPractice(next) ? 'ready' : 'break');
      } else {
        onDoneRef.current(out.current);
      }
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => {
      press.current = null;
      ac.abort();
    };
    // runKey aynı adımı (ör. alıştırmayı) yeniden başlatmak için kullanılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, block, runKey, paused]);

  usePageHidden(running && !paused, () => {
    press.current = null;
    setView({ kind: 'blank' });
    setPaused(true);
  });

  const hit = (t: number) => {
    press.current?.(t);
    setPressed(true);
    window.setTimeout(() => setPressed(false), 120);
  };

  useKeys(running && !paused, (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) hit(e.timeStamp);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        autoFocus={false}
        cta={step === 'test' ? 'Bölümü baştan başlat' : 'Alıştırmayı baştan başlat'}
        note={
          step === 'test'
            ? block > 0
              ? 'Bu bölüm baştan başlayacak; önceki bölümlerde yaptıkların kaybolmadı.'
              : 'Bu bölüm baştan başlayacak.'
            : 'Alıştırma baştan başlayacak.'
        }
        onResume={() => {
          setCount(0);
          setPaused(false);
        }}
      />
    );
  }

  if (step === 'ready') {
    const practice = practiceFor(n)!;
    return (
      <div key={`${step}-${block}`} className="flex flex-col items-center gap-6 text-center">
        {block > 0 && <p className="measure text-lg">{ordinal(block - 1)} bölüm bitti. Kısa bir mola ver.</p>}
        <h2 className="t-h2">{block > 0 ? `Şimdi kural değişiyor: ${LEVEL[n].toLocaleLowerCase('tr-TR')}` : LEVEL[n]}</h2>
        <p className="measure text-lg">
          Harf, {RULE[n]} harfle aynıysa AYNI düğmesine (ya da boşluk tuşuna) bas. Aynı değilse hiçbir şeye basma.
        </p>
        <Example n={n} />
        {n === 2 && (
          <p className="measure text-lg">
            Dikkat: art arda gelen iki aynı harf (ör. M, M) artık aynı sayılmaz. Bakman gereken harf, iki önceki harf.
          </p>
        )}
        <p className="measure text-lg">
          Önce {practice.letters.length} harflik bir alıştırma yapalım. Aynı harfi yakaladığında, kaçırdığında ya da yanlışlıkla bastığında doğru
          yapıp yapmadığını göreceksin.
        </p>
        <ArmedButton className="btn btn-primary btn-lg" onClick={() => setStep('practice')}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const s = practiceStats;
    const low = s.hits < Math.ceil(s.targets / 2) || s.falseAlarms > 2;
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Alıştırmada aynı olan {s.targets} harfin {s.hits === 0 ? 'hiçbirini yakalamadın' : `${s.hits} tanesini yakaladın`}; aynı olmayan harflerde{' '}
          {s.falseAlarms === 0 ? 'hiç basmadın' : `${s.falseAlarms} kez bastın`}.{' '}
          {low
            ? `Kuralı hatırla: harf ${RULE[n]} harfle aynıysa bas. İstersen alıştırmayı tekrarlayabilirsin.`
            : 'Şimdi asıl bölüm başlıyor; artık doğru mu yanlış mı olduğunu görmeyeceksin.'}
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
            {ordinal(block)} bölüme başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'break') {
    return (
      <div key={`${step}-${block}`} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {ordinal(block - 1)} bölüm bitti. Kısa bir mola ver; hazır olduğunda {ordinal(block).toLocaleLowerCase('tr-TR')} bölüme geç. Kural aynı:
          harf {RULE[n]} harfle aynıysa bas.
        </p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          onClick={() => {
            setCount(0);
            setStep('test');
          }}
        >
          {ordinal(block)} bölüme başla
        </ArmedButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center font-bold text-ink-2">
        {LEVEL[n]}: harf {RULE[n]} harfle aynıysa bas
      </p>
      <Stage label="Harflerin gösterildiği alan">
        {view.kind === 'stimulus' && <span className="font-display text-[5.5rem] font-bold leading-none">{view.letter}</span>}
        {view.kind === 'feedback' && (
          <div className="flex flex-col items-center gap-3 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${view.good ? 'text-ok' : 'text-ink'}`}>{view.title}</p>
            <LetterRow letters={view.letters} n={n} />
            <p className="measure text-lg">{view.text}</p>
          </div>
        )}
      </Stage>
      <StatusLine>{step === 'practice' ? 'Alıştırma' : `${ordinal(block)} bölüm: ${count} / ${current.letters.length}`}</StatusLine>
      <button
        type="button"
        className={`btn btn-primary mx-auto h-24 w-full max-w-[24rem] text-2xl transition-transform ${TOUCH_CLASSES} ${pressed ? 'scale-95' : ''}`}
        onPointerDown={(e) => {
          if (!primaryPointer(e)) return;
          e.preventDefault();
          hit(e.timeStamp);
        }}
      >
        AYNI <span className="t-meta hidden text-paper/70 sm:inline">(boşluk tuşu)</span>
      </button>
    </div>
  );
}
