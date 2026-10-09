'use client';

import { useEffect, useRef, useState } from 'react';
import type { NumericItem, NumericPracticeItem, NumericalReasoningTask } from '@/lib/instruments/types';
import type { NumericTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, afterPaint, useKeys } from './common';
import { DigitPad } from './number-series';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir; daha uzun düşünülen sorular bu süreyle kaydedilir. */
const MAX_RT_MS = 120_000;
/**
 * Soru ekrana geldikten sonraki bu süre (ms) içinde verilen cevaplar yok sayılır: bir düğmeye iki kez hızlıca dokunmak
 * (ör. "Bilmiyorum"), sonraki soruyu görmeden cevaplamasın.
 */
const GUARD_MS = 400;

/** Yazılan cevabın göründüğü kutu (eşitlikte □'nin yerinde, durumlarda sorunun altında). */
function AnswerBox({ value, tone, big }: { value: string; tone: 'write' | 'right'; big?: boolean }) {
  const ring = tone === 'right' ? 'border-ok text-ok' : value ? 'border-brass' : 'border-rule-strong';
  return (
    <span
      className={`tabular inline-flex items-center justify-center rounded-lg border-2 border-dashed bg-surface px-2 align-middle font-display font-bold ${ring} ${big ? 'mx-1 h-[1.5em] min-w-[2.2em]' : 'h-12 min-w-[4.5rem] text-2xl'}`}
      data-cevap=""
    >
      {value || <span className="text-ink-3">?</span>}
    </span>
  );
}

/** Soru: durumun cümleleri ve soru ya da büyük yazılmış bir eşitlik; altında yazılan cevap. */
function Problem({ item, value, tone }: { item: NumericItem; value: string; tone: 'write' | 'right' }) {
  if (item.equation) {
    const [left, right] = item.stem[0].split('□');
    const spoken = item.stem[0].replace('□', value ? `kutu: ${value}` : 'kutu');
    return (
      <div className="flex flex-col gap-3">
        <p className="text-lg font-bold">{item.question}</p>
        <p
          className="tabular rounded-2xl bg-surface-2/60 px-3 py-5 text-center font-display text-[clamp(1.5rem,7vw,2.25rem)] font-bold leading-tight"
          role="img"
          aria-label={`Eşitlik: ${spoken}`}
        >
          <span aria-hidden="true">
            {left}
            <AnswerBox value={value} tone={tone} big />
            {right}
          </span>
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-2xl bg-surface-2/60 p-4 text-lg leading-relaxed">
        {item.stem.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <p className="text-lg font-bold">{item.question}</p>
      <p className="flex flex-wrap items-center justify-center gap-2 text-lg" aria-hidden="true">
        <span className="text-ink-2">Cevabın:</span>
        <AnswerBox value={value} tone={tone} />
        {item.unit && <span>{item.unit}</span>}
      </p>
    </div>
  );
}

/**
 * Sayısal akıl yürütme: her soruda bir durumdaki ya da bir eşitlikteki eksik sayı tuş takımıyla (ya da klavyeyle) yazılır;
 * "Bilmiyorum" da denebilir. Süre sınırı yoktur; cevap süresi sorunun ekrana çizildiği andan cevabın verildiği ana kadar
 * ölçülür (sayfa gizliyken geçen süre sayılmaz). Önce geri bildirimli iki alıştırma sorusu çözülür. Asıl sorularda doğru
 * cevap, sorunun türü ve yanılgı cevapları tarayıcıda bilinmez: cevaplar sunucuda puanlanır.
 */
export function NumericalReasoning({ task, onDone }: { task: NumericalReasoningTask; onDone: (trials: NumericTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ given: string; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<NumericTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const running = step === 'practice' || step === 'test';
  const list: NumericItem[] = step === 'practice' ? task.practice : task.items;
  const item = list[index];

  // Yeni soru ekrana çizilince süre başlar; sayfa en üste (soruya) kaydırılır.
  useEffect(() => {
    if (!running) return;
    let alive = true;
    hiddenMs.current = 0;
    hiddenSince.current = document.visibilityState === 'hidden' ? performance.now() : null;
    shownAt.current = performance.now();
    void afterPaint().then((t) => {
      if (alive) shownAt.current = t;
    });
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
    return () => {
      alive = false;
    };
  }, [running, step, index]);

  // Sayfa gizliyken (başka sekme ya da uygulama) geçen süre cevap süresine eklenmez.
  useEffect(() => {
    if (!running) return;
    const on = () => {
      if (document.visibilityState === 'hidden') hiddenSince.current = performance.now();
      else if (hiddenSince.current !== null) {
        hiddenMs.current += performance.now() - hiddenSince.current;
        hiddenSince.current = null;
      }
    };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [running]);

  function typeDigit(d: number) {
    if (feedback) return;
    // Baştaki sıfır yazılmaz ("05" yerine "5"); cevap en çok `maxDigits` basamaklıdır.
    setValue((v) => (v === '0' ? String(d) : v.length >= task.maxDigits ? v : v + String(d)));
  }

  function erase() {
    if (feedback) return;
    setValue((v) => v.slice(0, -1));
  }

  /** `now`: cevabın verildiği an (olayın zaman damgası; performance.now ile aynı saat). `skip`: "Bilmiyorum". */
  function answer(now: number, skip: boolean) {
    if (!item || feedback || (!skip && value === '')) return;
    if (now - shownAt.current < GUARD_MS) return;
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - shownAt.current - hidden)));
    if (step === 'practice') {
      const good = !skip && Number(value) === (item as NumericPracticeItem).answer;
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ given: skip ? '' : value, good });
      return;
    }
    out.current.push({ index, response: skip ? null : { answer: Number(value) }, rtMs });
    // Fareyle tıklanan düğme odakta kalmasın: sonraki soruda Enter ya da boşluk tuşu onu yeniden çalıştırmasın.
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && top.current?.contains(focused)) focused.blur();
    setValue('');
    if (index + 1 < task.items.length) setIndex(index + 1);
    else onDone(out.current);
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
      // Yazılmış bir cevap varsa Enter, odak hangi düğmede olursa olsun cevabı verir (odaktaki düğme çalışmaz). Cevap
      // yokken tuş takımındaki bir düğme Enter'la çalışmaz; "Bilmiyorum" klavyeyle seçilebilir.
      if (value !== '') {
        e.preventDefault();
        answer(e.timeStamp, false);
      } else if (e.target instanceof HTMLElement && e.target.closest('[data-tuslar]')) {
        e.preventDefault();
      }
    }
  });

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda kısa bir durum ya da eksik sayısı olan bir eşitlik göreceksin. Soruyu dikkatle oku, cevabı tuşlarla yaz ve emin olunca “Cevabı ver” düğmesine bas.
          Cevaplar kesirli ya da virgüllü değildir.
        </p>
        <p className="measure text-lg">
          Önce {task.practice.length} alıştırma sorusu çözelim. Her cevaptan sonra doğru cevabı ve nedenini göreceksin.
        </p>
        <p className="measure text-ink-2">İstersen kâğıt ve kalem kullanabilirsin; hesap makinesi kullanma. Bilgisayarda rakam tuşlarıyla yazıp Enter tuşuyla cevap verebilirsin.</p>
        <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep('practice')}>
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const low = practiceScore < task.practice.length;
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {practiceScore === 0
            ? `Alıştırmadaki ${task.practice.length} sorunun hiçbirini doğru cevaplayamadın.`
            : practiceScore === task.practice.length
              ? `Alıştırmadaki ${task.practice.length === 2 ? 'iki sorunun ikisini de' : 'soruların hepsini'} doğru cevapladın.`
              : `Alıştırmadaki ${task.practice.length} sorunun ${practiceScore} tanesini doğru cevapladın.`}{' '}
          {low
            ? 'Soruyu dikkatle oku; istersen sayıları kâğıda yazarak düşün. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {task.items.length} soru var. Süre sınırı yok; acele etmeden, her soruyu dikkatle okuyarak cevap ver. Cevabı bulamadığın bir soruda “Bilmiyorum” diyebilirsin.
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
              setStep('test');
            }}
          >
            Teste başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (!item) return null;
  const practice = step === 'practice';
  const right = practice ? (item as NumericPracticeItem).answer : 0;
  const fb = practice ? feedback : null;
  const unit = item.unit ? ` ${item.unit}` : '';
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[36rem] flex-col gap-4">
        <Problem item={item} value={fb ? String(right) : value} tone={fb ? 'right' : 'write'} />
        {fb ? (
          <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru cevap: ${right}${unit}`}</p>
            {!fb.good && <p className="text-ink-2">{fb.given ? `Senin yazdığın: ${fb.given}${unit}` : '“Bilmiyorum” dedin.'}</p>}
            <p className="measure text-lg">{(item as NumericPracticeItem).explain}</p>
            <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
              {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
            </ArmedButton>
          </div>
        ) : (
          <>
            <p className="sr-only" aria-live="polite">
              {value === '' ? 'Henüz cevap yazmadın.' : `Cevabın: ${value}${unit}.`}
            </p>
            <DigitPad onDigit={typeDigit} onDelete={erase} />
            <div className="flex flex-col items-center gap-3">
              <button type="button" className="btn btn-primary btn-lg min-w-[12rem]" disabled={value === ''} onClick={(e) => answer(e.timeStamp, false)}>
                Cevabı ver
              </button>
              <button type="button" className="btn btn-secondary" onClick={(e) => answer(e.timeStamp, true)}>
                Bilmiyorum
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
