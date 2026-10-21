'use client';

import { useEffect, useRef, useState } from 'react';
import { TURKISH_ALPHABET, type LetterSeriesItem, type LetterSeriesPracticeItem, type LetterSeriesTask } from '@/lib/instruments/types';
import type { LetterSeriesTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir; daha uzun düşünülen sorular bu süreyle kaydedilir. */
const MAX_RT_MS = 120_000;
/**
 * Soru ekrana geldikten sonraki bu süre (ms) içinde verilen cevaplar yok sayılır: bir düğmeye iki kez hızlıca dokunmak
 * (ör. "Bilmiyorum"), sonraki soruyu görmeden cevaplamasın.
 */
const GUARD_MS = 400;
const ALPHABET: readonly string[] = TURKISH_ALPHABET;
/** Ekran okuyucu ve cevap satırı için: noktalı ve noktasız I birbirine karışmasın. */
const SPOKEN: Record<string, string> = { I: 'I (noktasız)', İ: 'İ (noktalı)' };
const spoken = (l: string) => SPOKEN[l] ?? l;

/**
 * Dizi: harfler yan yana kutularda; eksik harfin kutusu kesik çizgilidir ve seçilen harf orada görünür. Kutular dizinin
 * uzunluğuna göre eşit genişlikte bölünür (en uzun dizi 11 harf); yazı büyüklüğü 320 piksellik telefonda da harfler (Ğ,
 * Ş, İ gibi işaretli harfler dahil) kutuya sığacak biçimde seçilir.
 */
function Series({ item, value, tone }: { item: LetterSeriesItem; value: string; tone: 'write' | 'right' }) {
  const n = item.terms.length;
  // 11 kutulu bir dizide 320 piksellik telefonda kutu yaklaşık 20, yazı yaklaşık 15 piksel.
  const font = `min(1.75rem, ${(100 / n / 1.95).toFixed(2)}vw)`;
  const ring = tone === 'right' ? 'border-ok text-ok' : value ? 'border-brass' : 'border-rule-strong';
  const said = item.terms.map((t) => (t === null ? (value ? `eksik harf: ${spoken(value)}` : 'eksik harf') : spoken(t))).join(', ');
  return (
    <div className="mx-auto w-full max-w-[34rem]" role="img" aria-label={`Dizi: ${said}`}>
      <div className={`grid ${n > 8 ? 'gap-1' : 'gap-1.5'} sm:gap-2`} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-hidden="true">
        {item.terms.map((t, i) =>
          t === null ? (
            <span
              key={i}
              className={`flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-surface font-display leading-none font-bold ${ring}`}
              style={{ fontSize: font }}
              data-eksik=""
            >
              {value || <span className="text-ink-3">?</span>}
            </span>
          ) : (
            <span
              key={i}
              className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border-2 border-rule bg-surface-2 font-display leading-none font-bold text-ink"
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

/**
 * Harf tuş takımı: Türk alfabesinin 29 harfi alfabe sırasıyla (telefonda 6, geniş ekranda 10 sütun) ve Sil düğmesi.
 * Seçilen harfin tuşu basılı görünür.
 */
function LetterPad({ value, onLetter, onDelete }: { value: string; onLetter: (l: string) => void; onDelete: () => void }) {
  const key = `h-12 rounded-xl border-[1.5px] font-display text-xl leading-none font-bold active:translate-y-px ${TOUCH_CLASSES}`;
  return (
    <div className="mx-auto grid w-full max-w-[34rem] grid-cols-6 gap-1.5 sm:grid-cols-10 sm:gap-2" role="group" aria-label="Harf tuşları (alfabe sırasıyla)" data-tuslar="">
      {ALPHABET.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={value === l}
          aria-label={spoken(l)}
          data-harf={l}
          onClick={() => onLetter(l)}
          className={`${key} ${value === l ? 'border-ink bg-ink text-surface' : 'border-rule-strong bg-surface hover:border-ink'}`}
        >
          {l}
        </button>
      ))}
      <button type="button" onClick={onDelete} className={`btn btn-secondary h-12 px-0 ${TOUCH_CLASSES}`} aria-label="Seçilen harfi sil">
        Sil
      </button>
    </div>
  );
}

/** Klavyeden basılan tuşun harfi: Türkçe büyük harfe çevrilir ("i" → "İ", "ı" → "I"); alfabede yoksa `null`. */
function letterOf(key: string): string | null {
  if (key.length !== 1) return null;
  const up = key.toLocaleUpperCase('tr-TR');
  return ALPHABET.includes(up) ? up : null;
}

/**
 * Harf dizileri: dizideki eksik harf harf tuşlarıyla (ya da klavyeyle) seçilir; "Bilmiyorum" da denebilir. Süre sınırı
 * yoktur; cevap süresi dizinin ekrana çizildiği andan cevabın verildiği ana kadar ölçülür (sayfa gizliyken geçen süre
 * sayılmaz). Önce geri bildirimli iki alıştırma sorusu çözülür. Asıl sorularda doğru cevap tarayıcıda bilinmez: cevaplar
 * sunucuda puanlanır.
 */
export function LetterSeries({ task, onDone }: { task: LetterSeriesTask; onDone: (trials: LetterSeriesTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ given: string; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<LetterSeriesTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const running = step === 'practice' || step === 'test';
  const list: LetterSeriesItem[] = step === 'practice' ? task.practice : task.items;
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

  function pick(l: string) {
    if (feedback) return;
    setValue(l);
  }

  function erase() {
    if (feedback) return;
    setValue('');
  }

  /** `now`: cevabın verildiği an (olayın zaman damgası; performance.now ile aynı saat). `skip`: "Bilmiyorum". */
  function answer(now: number, skip: boolean) {
    if (!item || feedback || (!skip && value === '')) return;
    if (now - shownAt.current < GUARD_MS) return;
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - shownAt.current - hidden)));
    if (step === 'practice') {
      const good = !skip && value === (item as LetterSeriesPracticeItem).answer;
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ given: skip ? '' : value, good });
      return;
    }
    out.current.push({ index, response: skip ? null : { answer: value }, rtMs });
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
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const l = letterOf(e.key);
    // Klavyeyle harf yazılınca ya da silinince sorudaki odaklı düğme bırakılır: ardından basılan Enter, odakta kalan bir
    // düğmeyi (başka bir harf, "Bilmiyorum") çalıştırmasın, yazılan harfi cevap olarak versin.
    const releasePad = () => {
      const f = document.activeElement;
      if (f instanceof HTMLElement && top.current?.contains(f)) f.blur();
    };
    if (l) {
      e.preventDefault();
      releasePad();
      pick(l);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      releasePad();
      erase();
    } else if (e.key === 'Enter') {
      // "Cevabı ver" ve "Bilmiyorum" Enter'la kendileri çalışır. Odak bir harf tuşundaysa Enter o harfi seçer; o harf zaten
      // seçiliyse (ör. fareyle tıklanıp odakta kalmışsa) cevabı verir. "Sil" seçimi kaldırır. Odak bir düğmede değilse
      // Enter seçili harfi cevap olarak verir.
      // Bağlantılar ve öteki denetimler (ör. "Vazgeç") Enter'la kendileri çalışır.
      const ctl = e.target instanceof HTMLElement ? e.target.closest('a, button, input, select, textarea') : null;
      if (ctl && !ctl.closest('[data-tuslar]')) return;
      e.preventDefault();
      // Basılı tutulan Enter: ilk basış harfi seçer, tekrarlar cevabı göndermez.
      if (e.repeat) return;
      const btn = ctl instanceof HTMLButtonElement ? ctl : null;
      const l = btn?.dataset.harf;
      if (btn && !l) erase();
      else if (l && l !== value) pick(l);
      else if (value !== '') answer(e.timeStamp, false);
    }
  });

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda bir kurala göre ilerleyen bir harf dizisi göreceksin. Kuralı bul ve eksik harfi harf tuşlarından seç; seçtiğin harf dizideki boş kutuda görünür. Emin
          olunca “Cevabı ver” düğmesine bas.
        </p>
        <p className="measure text-lg">
          Diziler Türk alfabesinin 29 harfiyle yazılmıştır. Harf tuşları alfabe sırasıyla dizilmiştir; harfleri sayarken onlara bakabilirsin.
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
            ? 'Harflerin her adımda alfabede kaç harf ilerlediğine ya da hangi harfin tekrarlandığına dikkatle bak. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor.'}
        </p>
        <p className="measure text-ink-2">
          Asıl sorularda artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin. {task.items.length} soru var ve sorular giderek zorlaşıyor. Süre sınırı yok. Kuralı
          bulamadığın bir soruda “Bilmiyorum” diyebilirsin.
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
  const right = practice ? (item as LetterSeriesPracticeItem).answer : '';
  const fb = practice ? feedback : null;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`}</StatusLine>
      <div className="mx-auto flex w-full max-w-[34rem] flex-col gap-4">
        <Series item={item} value={fb ? right : value} tone={fb ? 'right' : 'write'} />
        {fb ? (
          <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
            <p className={`text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>{fb.good ? 'Doğru!' : `Doğru cevap: ${right}`}</p>
            {!fb.good && <p className="text-ink-2">{fb.given ? `Senin seçtiğin: ${spoken(fb.given)}` : '“Bilmiyorum” dedin.'}</p>}
            <p className="measure text-lg">{(item as LetterSeriesPracticeItem).explain}</p>
            <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
              {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
            </ArmedButton>
          </div>
        ) : (
          <>
            <p className="text-center text-ink-2" aria-live="polite">
              {value === '' ? 'Eksik harfi seç.' : `Cevabın: ${spoken(value)}. Emin olunca cevabı ver.`}
            </p>
            <LetterPad value={value} onLetter={pick} onDelete={erase} />
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
