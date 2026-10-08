'use client';

import { useEffect, useRef, useState } from 'react';
import type { NumberSeriesItem, NumberSeriesPracticeItem, NumberSeriesTask } from '@/lib/instruments/types';
import type { NumberSeriesTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir; daha uzun düşünülen sorular bu süreyle kaydedilir. */
const MAX_RT_MS = 120_000;
/**
 * Soru ekrana geldikten sonraki bu süre (ms) içinde verilen cevaplar yok sayılır: bir düğmeye iki kez hızlıca dokunmak
 * (ör. "Bilmiyorum"), sonraki soruyu görmeden cevaplamasın.
 */
const GUARD_MS = 400;

/**
 * Dizi: sayılar yan yana kutularda; eksik sayının kutusu kesik çizgilidir ve yazılan cevap orada görünür. Kutular
 * dizinin uzunluğuna göre eşit genişlikte bölünür; yazı büyüklüğü telefonda da en uzun sayı kutuya sığacak biçimde seçilir.
 */
function Series({ item, value, tone }: { item: NumberSeriesItem; value: string; tone: 'write' | 'right' | 'wrong' }) {
  const n = item.terms.length;
  // Ekran genişliğine göre: sekiz kutuluk bir dizide 360 piksellik telefonda yaklaşık 15,5 piksel; üç basamaklı sayılar
  // kutunun kenarına değmeden sığar.
  const font = `min(1.75rem, ${(100 / n / 2.9).toFixed(2)}vw)`;
  const ring = tone === 'right' ? 'border-ok text-ok' : tone === 'wrong' ? 'border-danger' : value ? 'border-brass' : 'border-rule-strong';
  const spoken = item.terms.map((t) => (t === null ? (value ? `eksik sayı: ${value}` : 'eksik sayı') : String(t))).join(', ');
  return (
    <div className="mx-auto w-full max-w-[34rem]" role="img" aria-label={`Dizi: ${spoken}`}>
      <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-hidden="true">
        {item.terms.map((t, i) =>
          t === null ? (
            <span
              key={i}
              className={`tabular flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-surface font-display font-bold ${ring}`}
              style={{ fontSize: value.length >= 4 ? `calc(${font} * 0.78)` : font }}
              data-eksik=""
            >
              {value || <span className="text-ink-3">?</span>}
            </span>
          ) : (
            <span
              key={i}
              className="tabular flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border-2 border-rule bg-surface-2 font-display font-bold text-ink"
              style={{ fontSize: font }}
            >
              {t}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/** 0–9 tuş takımı (telefondaki gibi 1–2–3 üstte, 0 altta geniş) ve Sil düğmesi. */
function DigitPad({ onDigit, onDelete, disabled }: { onDigit: (d: number) => void; onDelete: () => void; disabled?: boolean }) {
  const key = `tabular h-14 rounded-xl border-[1.5px] border-rule-strong bg-surface font-display text-2xl font-bold hover:border-ink active:translate-y-px disabled:opacity-40 ${TOUCH_CLASSES}`;
  return (
    <div className="mx-auto grid w-full max-w-[18rem] grid-cols-3 gap-2" role="group" aria-label="Tuş takımı" data-tuslar="">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
        <button key={d} type="button" disabled={disabled} onClick={() => onDigit(d)} className={key}>
          {d}
        </button>
      ))}
      <button type="button" disabled={disabled} onClick={() => onDigit(0)} className={`${key} col-span-2`}>
        0
      </button>
      <button type="button" disabled={disabled} onClick={onDelete} className={`btn btn-secondary h-14 ${TOUCH_CLASSES}`} aria-label="Son rakamı sil">
        Sil
      </button>
    </div>
  );
}

/**
 * Sayı dizileri: dizideki eksik sayı tuş takımıyla (ya da klavyeyle) yazılır; "Bilmiyorum" da denebilir. Süre sınırı
 * yoktur; cevap süresi dizinin ekrana çizildiği andan cevabın verildiği ana kadar ölçülür (sayfa gizliyken geçen süre
 * sayılmaz). Önce geri bildirimli iki alıştırma sorusu çözülür. Asıl sorularda doğru cevap tarayıcıda bilinmez: cevaplar
 * sunucuda puanlanır.
 */
export function NumberSeries({ task, onDone }: { task: NumberSeriesTask; onDone: (trials: NumberSeriesTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ given: string; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<NumberSeriesTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const running = step === 'practice' || step === 'test';
  const list: NumberSeriesItem[] = step === 'practice' ? task.practice : task.items;
  const item = list[index];

  // Yeni soru ekrana çizilince süre başlar; sayfa en üste (diziye) kaydırılır.
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
      const good = !skip && Number(value) === (item as NumberSeriesPracticeItem).answer;
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
          Her soruda bir kurala göre ilerleyen bir sayı dizisi göreceksin. Kuralı bul ve eksik sayıyı tuşlarla yaz; yazdığın sayı dizideki boş kutuda görünür. Emin
          olunca “Cevabı ver” düğmesine bas.
        </p>
        <p className="measure text-lg">
          Önce {task.practice.length} alıştırma sorusu çözelim. Her cevaptan sonra doğru cevabı ve nedenini göreceksin.
        </p>
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
            ? 'Sayıların her adımda nasıl değiştiğine dikkatle bak; aradaki farkları kâğıda yazmak işine yarar. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          {task.items.length} soru var ve sorular giderek zorlaşıyor. Süre sınırı yok. Kuralı bulamadığın bir soruda “Bilmiyorum” diyebilirsin.
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
  const right = practice ? (item as NumberSeriesPracticeItem).answer : 0;
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[34rem] flex-col gap-4">
        <Series item={item} value={fb ? String(right) : value} tone={fb ? 'right' : 'write'} />
        {fb ? (
          <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru cevap: ${right}`}</p>
            {!fb.good && <p className="text-ink-2">{fb.given ? `Senin yazdığın: ${fb.given}` : '“Bilmiyorum” dedin.'}</p>}
            <p className="measure text-lg">{(item as NumberSeriesPracticeItem).explain}</p>
            <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
              {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
            </ArmedButton>
          </div>
        ) : (
          <>
            <p className="text-center text-ink-2" aria-live="polite">
              {value === '' ? 'Eksik sayıyı yaz.' : `Cevabın: ${value}. Emin olunca cevabı ver.`}
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
