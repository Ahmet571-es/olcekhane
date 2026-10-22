'use client';

import { useEffect, useRef, useState } from 'react';
import { ARITH_SIGN, arithAnswer, arithSpoken } from '@/lib/instruments/arithmetic';
import type { ArithItem, MentalArithmeticTask } from '@/lib/instruments/types';
import type { ArithTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, afterPaint, useKeys, usePageHidden } from './common';
import { DigitPad } from './number-series';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/**
 * İşlem ekrana geldikten sonraki bu süre (ms) içinde basılan rakamlar ve verilen cevaplar yok sayılır: "Tamam" düğmesine iki
 * kez hızlıca dokunmak ya da önceki cevabın son tuşu bir sonraki işlemi görmeden cevaplamasın.
 */
const GUARD_MS = 250;

/** İşlem ve yazılan cevap: "47 + 8 = [55]". */
function Problem({ op, item, value, tone }: { op: MentalArithmeticTask['op']; item: ArithItem; value: string; tone: 'write' | 'right' }) {
  const ring = tone === 'right' ? 'border-ok text-ok' : value ? 'border-brass' : 'border-rule-strong';
  return (
    <p
      className="tabular rounded-2xl bg-surface-2/60 px-3 py-6 text-center font-display text-[clamp(2rem,10vw,3rem)] font-bold leading-tight"
      role="img"
      aria-label={`${arithSpoken(op, item)} eşittir ${value || 'boş'}`}
    >
      <span aria-hidden="true">
        {item[0]} {ARITH_SIGN[op]} {item[1]} ={' '}
        <span className={`inline-flex h-[1.3em] min-w-[2.4em] items-center justify-center rounded-lg border-2 border-dashed bg-surface px-2 align-middle ${ring}`}>
          {value || <span className="text-ink-3">?</span>}
        </span>
      </span>
    </p>
  );
}

/**
 * Zihinden hesaplama: bir işlemin süreli bölümü. Önce geri bildirimli iki alıştırma işlemi yapılır; sonra işlemler kolaydan
 * zora tek tek gösterilir, sonuç tuş takımıyla (ya da klavyeyle) yazılır ve "Tamam" ile verilir; "Geç" de denebilir. Süre
 * dolunca o ana kadar verilen cevaplar gönderilir (ekrandaki işlem sayılmaz). Sayfa gizlenince görev ve süre durur; dönülünce
 * kalan süreyle aynı işlemden devam edilir. Cevap süresi işlemin ekrana çizildiği andan cevabın verildiği ana kadardır;
 * duraklatmadan önce işlemin ekranda kaldığı süre de sayılır, duraklatılan süre sayılmaz.
 */
export function MentalArithmetic({ task, onDone }: { task: MentalArithmeticTask; onDone: (trials: ArithTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ given: string; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(task.durationMs);
  const out = useRef<ArithTrialInput[]>([]);
  const shownAt = useRef(0);
  /** Ekrandaki işlemin duraklatmadan önce ekranda kaldığı süre (ms). */
  const carried = useRef(0);
  const used = useRef(0);
  /** Bölüm süresinin bu bölümünün (son duraklatmadan beri) başladığı an. */
  const segment = useRef(0);
  const finished = useRef(false);
  const top = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const running = (step === 'practice' || step === 'test') && !paused;
  const list = step === 'practice' ? task.practice : task.items;
  const item = list[index];

  // Yeni işlem ekrana çizilince süre başlar.
  useEffect(() => {
    if (!running) return;
    let alive = true;
    shownAt.current = performance.now();
    void afterPaint().then((t) => {
      if (alive) shownAt.current = t;
    });
    return () => {
      alive = false;
    };
  }, [running, step, index]);

  // Bölümün süresi; duraklatılınca durur, dönülünce kalan süreden devam eder.
  useEffect(() => {
    if (step !== 'test' || paused) return;
    const start = performance.now();
    segment.current = start;
    const id = window.setInterval(() => {
      const left = Math.max(0, task.durationMs - used.current - (performance.now() - start));
      setRemaining(left);
      if (left <= 0 && !finished.current) {
        finished.current = true;
        window.clearInterval(id);
        onDoneRef.current(out.current);
      }
    }, 200);
    return () => {
      window.clearInterval(id);
      used.current += performance.now() - start;
    };
  }, [step, paused, task.durationMs]);

  usePageHidden(running, () => {
    carried.current += performance.now() - shownAt.current;
    setPaused(true);
  });

  function typeDigit(d: number) {
    if (feedback || !running || performance.now() - shownAt.current < GUARD_MS) return;
    // Baştaki sıfır yazılmaz ("05" yerine "5"); cevap en çok `maxDigits` basamaklıdır.
    setValue((v) => (v === '0' ? String(d) : v.length >= task.maxDigits ? v : v + String(d)));
  }

  function erase() {
    if (feedback || !running) return;
    setValue((v) => v.slice(0, -1));
  }

  /** `now`: cevabın verildiği an (olayın zaman damgası). `skip`: "Geç". */
  function answer(now: number, skip: boolean) {
    if (!item || feedback || !running || finished.current || (!skip && value === '')) return;
    if (now - shownAt.current < GUARD_MS) return;
    // Süre dolduktan sonraki cevap sayılmaz (süre çubuğu 200 ms'de bir güncellenir).
    if (step === 'test' && used.current + (performance.now() - segment.current) >= task.durationMs) {
      finished.current = true;
      onDoneRef.current(out.current);
      return;
    }
    const rtMs = Math.max(0, Math.round(carried.current + now - shownAt.current));
    carried.current = 0;
    if (step === 'practice') {
      const good = !skip && Number(value) === arithAnswer(task.op, item);
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ given: skip ? '' : value, good });
      return;
    }
    out.current.push({ index, response: skip ? null : { answer: Number(value) }, rtMs: Math.min(rtMs, task.durationMs) });
    // Fareyle tıklanan düğme odakta kalmasın: sonraki işlemde Enter ya da boşluk tuşu onu yeniden çalıştırmasın.
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && top.current?.contains(focused)) focused.blur();
    setValue('');
    if (index + 1 < task.items.length) setIndex(index + 1);
    else {
      finished.current = true;
      onDoneRef.current(out.current);
    }
  }

  function nextPractice() {
    setFeedback(null);
    setValue('');
    if (index + 1 < task.practice.length) setIndex(index + 1);
    else setStep('practice-done');
  }

  useKeys(running && !feedback, (e) => {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      typeDigit(Number(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      erase();
    } else if (e.key === 'Enter') {
      // Yazılmış bir cevap varsa Enter, odak hangi düğmede olursa olsun cevabı verir; cevap yokken tuş takımındaki bir düğme
      // Enter'la çalışmaz.
      if (value !== '') {
        e.preventDefault();
        if (!e.repeat) answer(e.timeStamp, false);
      } else if (e.target instanceof HTMLElement && e.target.closest('[data-tuslar]')) {
        e.preventDefault();
      }
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note={step === 'test' ? 'Süre de durdu; kaldığın işlemden, kalan sürenle devam edeceksin.' : 'Alıştırmaya kaldığın yerden devam edeceksin.'}
        onResume={() => setPaused(false)}
      />
    );
  }

  const seconds = Math.round(task.durationMs / 1000);
  if (step === 'ready') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Önce {task.practice.length} alıştırma işlemi yapalım. Sonucu tuşlarla yaz ve “Tamam” düğmesine bas. Her cevaptan sonra doğru sonucu göreceksin.
        </p>
        <p className="measure text-ink-2">Bilgisayarda rakam tuşlarıyla yazıp Enter tuşuyla da cevap verebilirsin.</p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('practice')}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const low = practiceScore < task.practice.length;
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {practiceScore === task.practice.length
            ? 'Alıştırmadaki iki işlemi de doğru yaptın.'
            : practiceScore === 0
              ? 'Alıştırmadaki işlemlerin ikisi de doğru olmadı.'
              : 'Alıştırmadaki işlemlerin birini doğru yaptın.'}{' '}
          {low ? 'İstersen alıştırmayı tekrarlayabilirsin.' : 'Şimdi asıl bölüm başlıyor; artık cevabının doğru olup olmadığını görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {seconds} saniye boyunca yapabildiğin kadar işlem yap. İşlemler kolaydan zora gider; bütün işlemleri bitirmen beklenmez. Olabildiğince hızlı ama dikkatli çalış.
          Kalan süre üstteki çubukta görünür.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={low}
            onClick={() => {
              setIndex(0);
              setPracticeScore(0);
              setStep('practice');
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!low}
            onClick={() => {
              setIndex(0);
              setValue('');
              out.current = [];
              used.current = 0;
              carried.current = 0;
              finished.current = false;
              setRemaining(task.durationMs);
              setStep('test');
            }}
          >
            Başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (!item) return null;
  const practice = step === 'practice';
  const right = arithAnswer(task.op, item);
  const fb = practice ? feedback : null;
  const pct = (remaining / task.durationMs) * 100;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      {practice ? (
        <StatusLine>{`Alıştırma ${index + 1} / ${task.practice.length}`}</StatusLine>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
          </div>
          {/* Ekran okuyucu kalan süreyi istenince okur; her saniye duyurulmaz. */}
          <span role="timer" className="tabular w-14 text-right text-ink-3">
            <span className="sr-only">Kalan süre: </span>
            {Math.ceil(remaining / 1000)} sn
          </span>
        </div>
      )}
      <div className="mx-auto flex w-full max-w-[28rem] flex-col gap-4">
        <Problem op={task.op} item={item} value={fb ? String(right) : value} tone={fb ? 'right' : 'write'} />
        {fb ? (
          <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru sonuç: ${right}`}</p>
            {!fb.good && <p className="text-ink-2">{fb.given ? `Senin yazdığın: ${fb.given}` : 'Bu işlemi geçtin.'}</p>}
            <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
              {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
            </ArmedButton>
          </div>
        ) : (
          <>
            <p className="sr-only" aria-live="polite">
              {value === '' ? `${arithSpoken(task.op, item)} kaç eder?` : `Cevabın: ${value}.`}
            </p>
            <DigitPad onDigit={typeDigit} onDelete={erase} />
            <div className="flex flex-col items-center gap-3">
              <button type="button" className="btn btn-primary btn-lg min-w-[12rem]" disabled={value === ''} onClick={(e) => answer(e.timeStamp, false)}>
                Tamam
              </button>
              <button type="button" className="btn btn-secondary" onClick={(e) => answer(e.timeStamp, true)}>
                Geç
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
