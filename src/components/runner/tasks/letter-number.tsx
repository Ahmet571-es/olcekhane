'use client';

import { useEffect, useRef, useState } from 'react';
import { lnAnswer, lnCheck, lnCounts, lnIsDigit } from '@/lib/instruments/letter-number';
import type { LetterNumberTask } from '@/lib/instruments/types';
import type { LetterNumberTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, useKeys, usePageHidden, wait } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';
type Phase = 'wait' | 'show' | 'input' | 'feedback';

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir (uzun bir aradan sonra verilen cevap da geçerli olsun). */
const MAX_RT_MS = 120_000;
/** Dizi başlamadan önce boş alanın ekranda kaldığı süre (ms): göz alana yerleşsin. */
const WAIT_MS = 700;

const PRACTICE_WORD = ['', 'bir', 'iki', 'üç'];

/** Fareyle basılan düğme odağı almasın: klavyeyle devam eden biri Enter'a bastığında aynı düğmeye ikinci kez basılmasın. */
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

const KEY_CLASSES = `flex h-11 w-full items-center justify-center rounded-xl border-[1.5px] border-rule-strong bg-surface font-display text-2xl font-bold hover:border-ink active:translate-y-px disabled:opacity-35 sm:h-14 ${TOUCH_CLASSES}`;

/** Girilen öğeler (ya da gösterilen bir dizi) yan yana kutucuklarda. */
function Chips({ items, empty, label }: { items: readonly string[]; empty?: string; label: string }) {
  return (
    <div className="flex min-h-[3rem] flex-wrap items-center justify-center gap-1 sm:gap-1.5" aria-label={label}>
      {items.length === 0 ? (
        <span className="text-lg text-ink-3">{empty}</span>
      ) : (
        items.map((x, i) => (
          <span key={i} className="tabular flex h-11 w-9 items-center justify-center rounded-lg border-[1.5px] border-ink font-display text-xl font-bold sm:h-13 sm:w-10 sm:text-2xl">
            {x}
          </span>
        ))
      )}
    </div>
  );
}

const RULE_HINT = 'Önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla gelir.';
const REHEARSE_HINT = 'Öğeler görünürken her birini içinden söylemek aklında tutmana yardım edebilir.';

/** Alıştırmada yanlış cevabın nedeni (kısa bir ipucu; tekil ya da çoğul, dizideki sayı ve harf sayısına göre). */
function practiceHint(seq: string, response: readonly string[]): string {
  if (response.length === 0) return `Bu dizide “Hatırlamıyorum” dedin. ${REHEARSE_HINT}`;
  const c = lnCheck(seq, response);
  const n = lnCounts(seq);
  const cap = (x: string) => `${x[0].toLocaleUpperCase('tr-TR')}${x.slice(1)}`;
  if (c.kind === 'lettersFirst') {
    return seq.length === 2
      ? 'Harfi sayıdan önce yazdın. Önce sayı, sonra harf gelir.'
      : `${n.letters === 1 ? 'Harfi' : 'Harfleri'} ${n.digits === 1 ? 'sayıdan' : 'sayılardan'} önce yazdın. ${RULE_HINT}`;
  }
  if (c.kind === 'shown') return `Öğeleri gösterildikleri sırayla yazdın. ${RULE_HINT}`;
  // Ayrılmış ya da sırası karışık cevapta hangi türün sıralanmadığı söylenir.
  const unsorted = [c.digits.ordered === false ? 'sayıları küçükten büyüğe' : '', c.letters.ordered === false ? 'harfleri alfabe sırasıyla' : ''].filter(Boolean);
  const notSorted = unsorted.length ? `${unsorted.join(', ')} dizmedin.` : '';
  if (c.kind === 'grouped') return notSorted ? `Sayıları harflerden önce yazdın; ama ${notSorted} ${RULE_HINT}` : RULE_HINT;
  if (c.kind === 'order') {
    const mixed = c.digitsBeforeLetters === false ? 'Bir ya da birkaç harf sayılardan önce geldi.' : '';
    return ['Bütün öğeleri hatırladın ama sıraları karıştı.', mixed, notSorted ? cap(notSorted) : '', RULE_HINT].filter(Boolean).join(' ');
  }
  const what = [
    c.intrusions > 0 ? `dizide olmayan ${c.intrusions === 1 ? 'bir öğe' : 'birkaç öğe'} girdin` : '',
    c.missing > 0 ? `${c.missing === 1 ? 'bir öğeyi' : 'birkaç öğeyi'} atladın` : '',
  ].filter(Boolean);
  return what.length ? `${cap(what.join(' ve '))}. ${REHEARSE_HINT}` : RULE_HINT;
}

/**
 * Harf-sayı sıralama: karışık sayılar ve harfler tek tek gösterilir; dizi bitince önce sayılar küçükten büyüğe, sonra harfler
 * alfabe sırasıyla girilir (ekrandaki tuşlarla ya da klavyeyle). Önce geri bildirimli üç alıştırma yapılır. Asıl bölümde bir
 * uzunluktaki üç dizinin hiçbiri tam doğru değilse görev biter (sunucu aynı kuralı yeniden denetler). Dizi gösterilirken sayfa
 * gizlenirse görev durur ve aynı dizi baştan gösterilir; cevap girerken gizli geçen süre sayılmaz.
 */
export function LetterNumber({ task, onDone }: { task: LetterNumberTask; onDone: (trials: LetterNumberTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [phase, setPhase] = useState<Phase>('wait');
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState<string | null>(null);
  const [entered, setEntered] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const [showKey, setShowKey] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [lastGood, setLastGood] = useState(false);
  const out = useRef<LetterNumberTrialInput[]>([]);
  const levelHits = useRef(0);
  const inputAt = useRef(0);
  /** Dizi şu an gösteriliyor mu ve gösterilirken sayfa gizlendiği için bu dizi kaç kez baştan gösterildi. */
  const showing = useRef(false);
  const restarts = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const flat = task.levels.flatMap((l) => l.items);
  const practice = step === 'practice';
  const seq: string | undefined = practice ? task.practice[index] : step === 'test' ? flat[index] : undefined;
  const length = seq?.length ?? 0;
  const symbols = new Set([...task.digits, ...task.letters]);

  // Bekle → öğeleri tek tek göster → cevap.
  useEffect(() => {
    if ((step !== 'practice' && step !== 'test') || paused || !seq) return;
    if (phase !== 'wait' && phase !== 'show') return;
    const ac = new AbortController();
    (async () => {
      setPhase('wait');
      setShown(null);
      await wait(WAIT_MS, ac.signal);
      setPhase('show');
      showing.current = true;
      for (const c of seq) {
        setShown(c);
        await wait(task.onMs, ac.signal);
        setShown(null);
        await wait(task.offMs, ac.signal);
      }
      showing.current = false;
      setEntered([]);
      hiddenMs.current = 0;
      hiddenSince.current = null;
      inputAt.current = performance.now();
      setPhase('input');
      const painted = await afterPaint();
      // Sayfa bu arada gizlenip açıldıysa gizli süre zaten düşülür; başlangıç yeniden kaydırılmaz.
      if (!ac.signal.aborted && document.visibilityState === 'visible' && hiddenSince.current === null && hiddenMs.current === 0) inputAt.current = painted;
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
    // showKey yeni bir sunumu tetikler; seq her sunumda o anki denemeye aittir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showKey, paused, step]);

  // Dizi gösterilirken (ya da hemen öncesinde) sayfa gizlenirse görev durur; dönülünce aynı dizi baştan gösterilir.
  usePageHidden((step === 'practice' || step === 'test') && !paused && (phase === 'wait' || phase === 'show'), () => {
    if (showing.current) restarts.current++;
    showing.current = false;
    setShown(null);
    setPaused(true);
  });

  // Cevap girerken sayfanın gizli kaldığı süre sayılmaz.
  useEffect(() => {
    if (phase !== 'input') return;
    const on = () => {
      if (document.visibilityState === 'hidden') hiddenSince.current = performance.now();
      else if (hiddenSince.current !== null) {
        hiddenMs.current += performance.now() - hiddenSince.current;
        hiddenSince.current = null;
      }
    };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [phase]);

  useEffect(() => {
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
  }, [step, index]);

  function present() {
    setEntered([]);
    setPhase('wait');
    setShowKey((k) => k + 1);
  }

  function add(c: string) {
    if (phase !== 'input') return;
    setEntered((x) => (x.length < length && !x.includes(c) ? [...x, c] : x));
  }

  function submit(now: number, skip = false) {
    if (phase !== 'input' || !seq) return;
    if (!skip && entered.length === 0) return;
    const response = skip ? [] : entered;
    const good = !skip && response.length === seq.length && response.every((c, i) => c === lnAnswer(seq)[i]);
    if (practice) {
      if (skip) setEntered([]);
      setLastGood(good);
      if (good) setPracticeScore((s) => s + 1);
      setPhase('feedback');
      return;
    }
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - inputAt.current - hidden)));
    out.current.push({ index, response: { seq: [...response], restarts: restarts.current }, rtMs });
    restarts.current = 0;
    if (good) levelHits.current++;
    if ((index + 1) % 3 === 0) {
      const failed = levelHits.current === 0;
      levelHits.current = 0;
      if (failed || index + 1 >= flat.length) {
        onDone(out.current);
        return;
      }
    }
    setIndex(index + 1);
    present();
  }

  useKeys(phase === 'input' && !paused && (step === 'practice' || step === 'test'), (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setEntered((x) => x.slice(0, -1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      // Basılı tutulan Enter bir sonraki diziyi de geçmesin.
      if (!e.repeat) submit(e.timeStamp);
      return;
    }
    const c = e.key.length === 1 ? e.key.toLocaleUpperCase('tr-TR') : '';
    if (symbols.has(c)) {
      e.preventDefault();
      // Basılı tutulan tuş art arda öğe yazmaz.
      if (!e.repeat) add(c);
    }
  });

  if (paused) {
    return (
      <PausedScreen
        note="Dizi yarıda kaldığı için aynı dizi baştan gösterilecek."
        cta="Diziyi yeniden göster"
        onResume={() => {
          setPaused(false);
          present();
        }}
      />
    );
  }

  if (step === 'ready') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Ekranda sayılar ve harfler tek tek, karışık olarak görünecek. Her biri {task.onMs / 1000} saniye görünür. Hepsini aklında tut.
        </p>
        <div className="flex flex-col items-center gap-2" role="img" aria-label="Örnek: K, 3, D, 1 gösterilirse cevap 1, 3, D, K">
          <Chips items={['K', '3', 'D', '1']} label="Gösterilen örnek dizi" />
          <span className="text-ink-2" aria-hidden="true">
            ↓
          </span>
          <Chips items={['1', '3', 'D', 'K']} label="Örneğin cevabı" />
        </div>
        <p className="measure text-lg">
          Dizi bitince <strong>önce sayıları küçükten büyüğe</strong>, <strong>sonra harfleri alfabe sırasıyla</strong> gir. Son girdiğin öğeyi “Sil” ile
          silebilirsin. Bitince “Tamam” düğmesine bas; hatırlamadığın bir dizide “Hatırlamıyorum” düğmesine basabilirsin.
        </p>
        <p className="measure text-ink-2">
          Harf tuşları klavyedeki gibi dizilidir, alfabe sırasıyla değil. Bilgisayarda cevabı klavyeyle de yazabilirsin; Enter tuşu “Tamam”, geri silme tuşu “Sil”
          demektir.
        </p>
        <p className="measure text-lg">Önce {PRACTICE_WORD[task.practice.length] ?? task.practice.length} alıştırma dizisi çözelim.</p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            setIndex(0);
            setPracticeScore(0);
            setStep('practice');
            present();
          }}
        >
          Alıştırmaya başla
        </ArmedButton>
      </div>
    );
  }

  if (step === 'practice-done') {
    const all = practiceScore === task.practice.length;
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          {all
            ? 'Alıştırma dizilerinin hepsini doğru sıraladın.'
            : practiceScore === 0
              ? 'Alıştırma dizilerini doğru sıralayamadın. Kuralı hatırla: önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla.'
              : `Alıştırmadaki ${task.practice.length} dizinin ${practiceScore === 1 ? 'birini' : `${practiceScore} tanesini`} doğru sıraladın. Kuralı hatırla: önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla.`}{' '}
          {all ? 'Şimdi asıl test başlıyor.' : 'İstersen alıştırmayı tekrarlayabilirsin.'}
        </p>
        <p className="measure text-ink-2">
          Asıl testte artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin. Diziler {task.levels[0].length} öğeden başlayıp giderek uzayacak. Bir uzunluktaki üç
          dizinin hiçbirini doğru sıralayamazsan test biter; uzun dizilerde zorlanmak olağandır.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${all ? 'btn-secondary' : 'btn-primary'}`}
            autoFocus={!all}
            onClick={() => {
              setIndex(0);
              setPracticeScore(0);
              setStep('practice');
              present();
            }}
          >
            Alıştırmayı tekrarla
          </ArmedButton>
          <ArmedButton
            className={`btn btn-lg ${all ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={all}
            onClick={() => {
              setIndex(0);
              levelHits.current = 0;
              restarts.current = 0;
              out.current = [];
              setStep('test');
              present();
            }}
          >
            Teste başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (!seq) return null;
  const status = practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Dizi ${index + 1}`;

  if (phase === 'feedback' && practice) {
    const answer = lnAnswer(seq);
    return (
      <div ref={top} className="flex scroll-mt-4 flex-col items-center gap-5 text-center">
        <StatusLine>{status}</StatusLine>
        <p className={`text-2xl font-bold ${lastGood ? 'text-ok' : 'text-ink'}`} aria-live="polite">
          {lastGood ? 'Doğru!' : 'Olmadı, sorun değil.'}
        </p>
        <dl className="grid w-full max-w-md gap-3">
          <div>
            <dt className="font-bold">Gösterilen dizi</dt>
            <dd>
              <Chips items={[...seq]} label={`Gösterilen dizi: ${[...seq].join(', ')}`} />
            </dd>
          </div>
          <div>
            <dt className="font-bold">Doğru cevap</dt>
            <dd>
              <Chips items={answer} label={`Doğru cevap: ${answer.join(', ')}`} />
            </dd>
          </div>
          {!lastGood && (
            <div>
              <dt className="font-bold">Senin cevabın</dt>
              <dd>
                <Chips items={entered} empty="Hatırlamıyorum" label={entered.length ? `Senin cevabın: ${entered.join(', ')}` : 'Cevap verilmedi'} />
              </dd>
            </div>
          )}
        </dl>
        {!lastGood && <p className="measure text-ink-2">{practiceHint(seq, entered)}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          {!lastGood && (
            <ArmedButton className="btn btn-secondary btn-lg" delayMs={600} onClick={present}>
              Bir daha dene
            </ArmedButton>
          )}
          <ArmedButton
            className="btn btn-primary btn-lg"
            autoFocus
            delayMs={600}
            onClick={() => {
              if (index + 1 < task.practice.length) {
                setIndex(index + 1);
                present();
              } else setStep('practice-done');
            }}
          >
            {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
          </ArmedButton>
        </div>
      </div>
    );
  }

  const inputting = phase === 'input';
  const full = entered.length >= length;
  const key = (c: string, style?: React.CSSProperties) => (
    <button
      key={c}
      type="button"
      onMouseDown={keepFocus}
      onClick={() => add(c)}
      disabled={!inputting || full || entered.includes(c)}
      aria-label={lnIsDigit(c) ? `Sayı ${c}` : `Harf ${c}`}
      className={KEY_CLASSES}
      style={style}
    >
      {c}
    </button>
  );
  // Harf satırları klavyedeki gibi ortalanır; bütün harf tuşları en uzun satıra (5 tuş) göre aynı genişliktedir.
  const widest = Math.max(...task.keyRows.map((r) => r.length));
  const letterWidth: React.CSSProperties = { width: `calc((100% - ${(widest - 1) * 0.5}rem) / ${widest})`, flex: 'none' };
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{status}</StatusLine>
      <div className="flex h-24 items-center justify-center rounded-2xl border border-rule bg-surface px-3 sm:h-28" aria-live="off">
        {inputting ? (
          <div aria-live="polite" className="w-full">
            <Chips items={entered} empty="Önce sayılar, sonra harfler" label="Girdiğin öğeler" />
          </div>
        ) : (
          <span className="font-display text-[4.25rem] leading-none font-bold sm:text-[5rem]" aria-label={phase === 'wait' ? 'Hazır ol' : 'Dizi gösteriliyor'}>
            {shown ?? ''}
          </span>
        )}
      </div>
      <p className="text-center text-sm text-ink-2 sm:text-base" aria-live="polite">
        {phase === 'wait' ? 'Hazır ol…' : phase === 'show' ? 'İzle ve aklında tut…' : 'Önce sayıları küçükten büyüğe, sonra harfleri alfabe sırasıyla gir'}
      </p>
      <div className="mx-auto flex w-full max-w-[24rem] flex-col gap-3 sm:max-w-[40rem] sm:flex-row sm:items-start sm:gap-5">
        <div className="grid flex-1 grid-cols-3 gap-2" role="group" aria-label="Sayılar">
          {[...task.digits].map((c) => key(c))}
        </div>
        <div className="flex flex-[1.6] flex-col gap-2" role="group" aria-label="Harfler (klavyedeki gibi dizili)">
          {task.keyRows.map((row, i) => (
            <div key={row} className="flex justify-center gap-2">
              {[...row].map((c) => key(c, letterWidth))}
              {/* Silme tuşu klavyedeki gibi son harf satırının sonunda. */}
              {i === task.keyRows.length - 1 && (
                <button
                  type="button"
                  onMouseDown={keepFocus}
                  onClick={() => setEntered((x) => x.slice(0, -1))}
                  disabled={!inputting || entered.length === 0}
                  aria-label="Son girdiğin öğeyi sil"
                  className={`${KEY_CLASSES} text-base`}
                  style={letterWidth}
                >
                  Sil
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[24rem] grid-cols-2 gap-2.5">
        <button
          type="button"
          className={`btn btn-secondary h-13 ${TOUCH_CLASSES}`}
          disabled={!inputting}
          onMouseDown={keepFocus}
          onClick={(e) => submit(e.timeStamp, true)}
        >
          Hatırlamıyorum
        </button>
        <button
          type="button"
          className={`btn btn-primary h-13 ${TOUCH_CLASSES}`}
          disabled={!inputting || entered.length === 0}
          onMouseDown={keepFocus}
          onClick={(e) => submit(e.timeStamp)}
        >
          Tamam
        </button>
      </div>
    </div>
  );
}
