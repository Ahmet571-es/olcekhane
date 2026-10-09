'use client';

import { useEffect, useRef, useState } from 'react';
import type { WordListTask } from '@/lib/instruments/types';
import { matchWord, normalizeWord, splitWords, wordListRecalls } from '@/lib/instruments/word-list';
import type { WordListTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, PausedScreen, StatusLine, TOUCH_CLASSES, afterPaint, isAbort, primaryPointer, useKeys, usePageHidden, wait } from './common';

/** Kelimelerin her temada aynı okunması için gösterim alanı, temadan bağımsız açık bir zemindir. */
const STAGE_BG = '#eef1f6';
const INK = '#1f2937';
/** Sunucunun kabul ettiği en uzun süre (ms): daha uzun yazma ya da düşünme süreleri bu değere kısaltılır (süre puanlanmaz). */
const MAX_MS = 120_000;
/** Bir hatırlama bölümünde en çok bu kadar kelime yazılabilir (sunucuyla aynı). */
const MAX_ENTRIES = 40;

/**
 * Görevin adımları: alıştırma (liste ve yazma), ilk listenin üç denemesi, ikinci liste, ilk listenin yeniden
 * hatırlanması, tanıma. `recall` sırası wordListRecalls ile aynıdır.
 */
type Step =
  | { kind: 'practice-intro' }
  | { kind: 'practice-show' }
  | { kind: 'practice-recall' }
  | { kind: 'practice-done'; found: number }
  | { kind: 'before'; recall: number }
  | { kind: 'show'; recall: number }
  | { kind: 'recall'; recall: number }
  | { kind: 'recog-intro' }
  | { kind: 'recog'; item: number };

/** Kelimelerin tek tek gösterildiği alan. */
function WordStage({ word, status }: { word: string | null; status: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex min-h-[13rem] items-center justify-center rounded-2xl p-6 select-none"
        style={{ background: STAGE_BG }}
        aria-label="Kelimelerin gösterildiği alan"
      >
        {word && (
          <p className="font-display text-5xl font-bold tracking-wide sm:text-6xl" style={{ color: INK }} lang="tr">
            {word}
          </p>
        )}
      </div>
      <StatusLine>{status}</StatusLine>
    </div>
  );
}

/** Listeyi gösterir; sayfa gizlenirse liste durur ve dönülünce baştan gösterilir. */
function Presenter({ words, task, label, onDone }: { words: string[]; task: WordListTask; label: string; onDone: (restarts: number) => void }) {
  const [word, setWord] = useState<string | null>(null);
  const [i, setI] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const restarts = useRef(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (paused) return;
    const ac = new AbortController();
    (async () => {
      setWord(null);
      setI(-1);
      await wait(1200, ac.signal);
      for (let k = 0; k < words.length; k++) {
        setI(k);
        setWord(words[k]);
        await wait(task.wordMs, ac.signal);
        setWord(null);
        await wait(task.gapMs, ac.signal);
      }
      onDoneRef.current(restarts.current);
    })().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ac.abort();
  }, [paused, run, words, task.wordMs, task.gapMs]);

  usePageHidden(!paused, () => {
    setWord(null);
    setPaused(true);
  });

  if (paused) {
    return (
      <PausedScreen
        note="Liste yarıda kaldığı için baştan gösterilecek."
        cta="Listeyi baştan göster"
        onResume={() => {
          restarts.current++;
          setPaused(false);
          setRun((r) => r + 1);
        }}
      />
    );
  }
  return <WordStage word={word} status={i < 0 ? `${label}: hazır ol…` : `${label}: ${i + 1} / ${words.length}`} />;
}

/** Hatırlanan kelimelerin yazıldığı alan: kelime yazılıp "Ekle" ile (ya da Enter ile) eklenir, "Bitti" ile bölüm biter. */
function RecallInput({ title, hint, onDone }: { title: string; hint: React.ReactNode; onDone: (words: string[], ms: number) => void }) {
  const [entries, setEntries] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);
  const start = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    start.current = performance.now();
    input.current?.focus();
  }, []);

  /** Yazılanları ekler; eklenen kelimeleri ve son listeyi döndürür. */
  const addText = (current: string[]): string[] => {
    const words = splitWords(text);
    if (!words.length) return current;
    const next = [...current];
    let dup = false;
    let full = false;
    for (const w of words) {
      if (next.length >= MAX_ENTRIES) {
        full = true;
        break;
      }
      if (next.some((x) => normalizeWord(x) === normalizeWord(w))) dup = true;
      else next.push(w);
    }
    setEntries(next);
    setText('');
    setNote(full ? `En çok ${MAX_ENTRIES} kelime yazabilirsin.` : dup ? 'Bu kelimeyi zaten yazdın.' : '');
    return next;
  };

  const finish = (list: string[]) => onDone(list, Math.min(MAX_MS, Math.round(performance.now() - start.current)));

  if (confirm) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">Hiç kelime yazmadın. Hatırladığın bir kelime yoksa devam edebilirsin; varsa geri dönüp yaz.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            autoFocus
            onClick={() => {
              setConfirm(false);
              window.setTimeout(() => input.current?.focus(), 0);
            }}
          >
            Geri dön
          </button>
          <ArmedButton className="btn btn-secondary btn-lg" onClick={() => finish([])}>
            Devam et
          </ArmedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="t-h2">{title}</h2>
        <p className="text-ink-2">{hint}</p>
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addText(entries);
          input.current?.focus();
        }}
      >
        <label htmlFor="kelime" className="sr-only">
          Hatırladığın bir kelime
        </label>
        <input
          ref={input}
          id="kelime"
          className="input min-w-0 flex-1 text-lg"
          type="text"
          lang="tr"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="enter"
          maxLength={60}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (note) setNote('');
          }}
          placeholder="Bir kelime yaz"
        />
        <button type="submit" className="btn btn-secondary" disabled={!text.trim()}>
          Ekle
        </button>
      </form>
      <p className="t-small min-h-5 text-ink-2" aria-live="polite">
        {note}
      </p>
      {entries.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Yazdığın kelimeler">
          {entries.map((w, k) => (
            <li key={`${w}-${k}`} className="chip flex items-center gap-1.5 text-base">
              <span lang="tr">{w}</span>
              <button
                type="button"
                className="-mr-1 rounded-full px-1.5 leading-none text-ink-2 hover:text-ink"
                aria-label={`${w} kelimesini sil`}
                onClick={() => setEntries(entries.filter((_, j) => j !== k))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="t-small text-ink-2">{entries.length ? `${entries.length} kelime yazdın.` : 'Henüz kelime yazmadın.'}</p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          onClick={() => {
            const list = addText(entries);
            if (list.length === 0) setConfirm(true);
            else finish(list);
          }}
        >
          Bitti
        </ArmedButton>
      </div>
    </div>
  );
}

/** Tanıma bölümünün bir kelimesi: "Evet, vardı" ya da "Hayır, yoktu". */
function RecognitionItem({ word, index, total, onAnswer }: { word: string; index: number; total: number; onAnswer: (yes: boolean, rtMs: number) => void }) {
  const [shown, setShown] = useState(false);
  const onset = useRef<number | null>(null);
  const answered = useRef(false);
  useEffect(() => {
    let alive = true;
    const t = window.setTimeout(() => {
      if (!alive) return;
      setShown(true);
      void afterPaint().then((x) => {
        onset.current = x;
      });
    }, 300);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);
  const answer = (yes: boolean, t: number) => {
    if (!shown || answered.current) return;
    answered.current = true;
    onAnswer(yes, Math.min(MAX_MS, Math.max(0, Math.round(t - (onset.current ?? t)))));
  };
  useKeys(shown, (e) => {
    const yes = e.key === 'ArrowLeft' ? true : e.key === 'ArrowRight' ? false : null;
    if (yes !== null) {
      e.preventDefault();
      if (!e.repeat) answer(yes, e.timeStamp);
    }
  });
  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-lg">
        Bu kelime <strong>ilk listede</strong> (üç kez gördüğün listede) var mıydı?
      </p>
      <WordStage word={shown ? word : null} status={`${index + 1} / ${total}`} />
      <div className="mx-auto grid w-full max-w-[36rem] grid-cols-2 gap-3">
        {[true, false].map((yes) => (
          <button
            key={String(yes)}
            type="button"
            className={`btn btn-secondary h-20 flex-col gap-1 px-2 text-lg ${TOUCH_CLASSES}`}
            onPointerDown={(e) => {
              if (!primaryPointer(e)) return;
              e.preventDefault();
              answer(yes, e.timeStamp);
            }}
            onClick={(e) => {
              // Klavyeyle (sekme tuşuyla gelip Enter) basıldığında; fare ve dokunuş zaten pointerdown ile sayıldı.
              if (e.detail === 0) answer(yes, e.timeStamp);
            }}
          >
            <span>{yes ? 'Evet, vardı' : 'Hayır, yoktu'}</span>
            <span className="t-meta hidden sm:inline" aria-hidden="true">
              {yes ? '← sol ok' : 'sağ ok →'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Kelime listesi hatırlama: alıştırma; ilk liste üç kez gösterilir ve her seferinden sonra hatırlanan kelimeler yazılır;
 * ikinci liste bir kez gösterilip yazılır; ilk liste yeniden gösterilmeden yazılır; en sonda tanıma bölümü. Yazılan
 * kelimeler yalnızca bu sayfada tutulur ve görev bitince puanlama için gönderilir; hiçbir yere kaydedilmez.
 */
export function WordList({ task, onDone }: { task: WordListTask; onDone: (trials: WordListTrialInput[]) => void }) {
  const recalls = wordListRecalls(task);
  const [step, setStep] = useState<Step>({ kind: 'practice-intro' });
  const [paused, setPaused] = useState(false);
  const out = useRef<WordListTrialInput[]>([]);
  const restarts = useRef(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  usePageHidden(step.kind === 'recog' && !paused, () => setPaused(true));

  const L = task.listA.length;
  const nextAfterRecall = (r: number): Step => (r + 1 < recalls.length ? { kind: 'before', recall: r + 1 } : { kind: 'recog-intro' });

  if (paused && step.kind === 'recog') {
    return <PausedScreen note="Bu kelime yeniden gösterilecek; önceki cevapların kaybolmadı." onResume={() => setPaused(false)} />;
  }

  switch (step.kind) {
    case 'practice-intro':
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="measure text-lg">
            Önce kısa bir alıştırma: ekranda <strong>{task.practice.length} kelime</strong> tek tek gösterilecek. Onları aklında tut; liste bitince
            hatırladığın kelimeleri yaz.
          </p>
          <p className="measure text-ink-2">
            Kelimeler gösterilirken onları kâğıda yazma; yalnızca aklında tut. Yazarken Türkçe harfleri kullanmasan da olur; uzun kelimelerde küçük bir yazım
            hatası da sorun değil.
          </p>
          <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep({ kind: 'practice-show' })}>
            Alıştırmaya başla
          </ArmedButton>
        </div>
      );
    case 'practice-show':
      return <Presenter key="practice" words={task.practice} task={task} label="Alıştırma" onDone={() => setStep({ kind: 'practice-recall' })} />;
    case 'practice-recall':
      return (
        <RecallInput
          key="practice-recall"
          title="Alıştırma: hatırladığın kelimeleri yaz"
          hint="Bir kelime yaz ve Ekle düğmesine (ya da Enter tuşuna) bas. Sıra önemli değil. Hatırladığın kelime kalmayınca Bitti düğmesine bas."
          onDone={(words) => {
            const found = new Set(words.map((w) => matchWord(w, task.practice)).filter((m): m is number => m !== null)).size;
            setStep({ kind: 'practice-done', found });
          }}
        />
      );
    case 'practice-done': {
      const n = task.practice.length;
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="measure text-lg">
            Alıştırma listesi: <strong lang="tr">{task.practice.join(', ')}</strong>.{' '}
            {step.found === n ? `${n} kelimenin hepsini yazdın.` : step.found === 0 ? `${n} kelimenin hiçbirini yazmadın.` : `${n} kelimeden ${step.found} tanesini yazdın.`}
          </p>
          <p className="measure text-lg">
            Asıl görevdeki liste <strong>{L} kelimeden</strong> oluşuyor ve hepsini hatırlamak kolay değil; aklında kalanları yazman yeterli. Artık
            yazdıklarının doğru olup olmadığını görmeyeceksin.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ArmedButton className="btn btn-secondary btn-lg" onClick={() => setStep({ kind: 'practice-show' })}>
              Alıştırmayı tekrarla
            </ArmedButton>
            <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep({ kind: 'before', recall: 0 })}>
              Göreve başla
            </ArmedButton>
          </div>
        </div>
      );
    }
    case 'before': {
      const rc = recalls[step.recall];
      const text =
        rc.list === 'B' ? (
          <>
            Şimdi <strong>yeni bir liste</strong> göreceksin. Bu liste yalnızca bir kez gösterilecek. Liste bitince bu yeni listeden hatırladığın kelimeleri
            yaz.
          </>
        ) : !rc.shown ? (
          <>
            Şimdi <strong>ilk listeyi</strong> düşün: üç kez gördüğün listeden hatırladığın bütün kelimeleri yaz. Liste bu kez gösterilmeyecek.
          </>
        ) : rc.trial === 0 ? (
          <>
            Şimdi asıl liste başlıyor: <strong>{L} kelime</strong> tek tek gösterilecek. Liste bitince hatırladığın bütün kelimeleri yaz. Aynı liste üç kez
            gösterilecek.
          </>
        ) : (
          <>
            Aynı liste <strong>{rc.trial + 1}. kez</strong> gösterilecek. Liste bitince, daha önce yazdıkların da dâhil, hatırladığın{' '}
            <strong>bütün</strong> kelimeleri yeniden yaz.
          </>
        );
      return (
        <div key={`before-${step.recall}`} className="flex flex-col items-center gap-6 text-center">
          <p className="measure text-lg">{text}</p>
          <ArmedButton
            className="btn btn-primary btn-lg"
            autoFocus
            onClick={() => setStep(rc.shown ? { kind: 'show', recall: step.recall } : { kind: 'recall', recall: step.recall })}
          >
            {rc.shown ? 'Listeyi göster' : 'Yazmaya başla'}
          </ArmedButton>
        </div>
      );
    }
    case 'show': {
      const rc = recalls[step.recall];
      return (
        <Presenter
          key={`show-${step.recall}`}
          words={rc.list === 'A' ? task.listA : task.listB}
          task={task}
          label={rc.list === 'A' ? `İlk liste, ${rc.trial + 1}. gösterim` : 'Yeni liste'}
          onDone={(n) => {
            restarts.current = n;
            setStep({ kind: 'recall', recall: step.recall });
          }}
        />
      );
    }
    case 'recall': {
      const rc = recalls[step.recall];
      const title = rc.list === 'B' ? 'Yeni listeden hatırladığın kelimeleri yaz' : !rc.shown ? 'İlk listeden hatırladığın bütün kelimeleri yaz' : `${rc.trial + 1}. deneme: hatırladığın bütün kelimeleri yaz`;
      const hint =
        rc.list === 'B'
          ? 'Yalnızca az önce bir kez gördüğün yeni listedeki kelimeleri yaz. Sıra önemli değil. Hatırladığın kelime kalmayınca Bitti düğmesine bas.'
          : !rc.shown
            ? 'Üç kez gördüğün ilk listedeki kelimeleri yaz; yeni listedekileri yazma. Sıra önemli değil. Hatırladığın kelime kalmayınca Bitti düğmesine bas.'
            : rc.trial === 0
              ? 'Bir kelime yaz ve Ekle düğmesine (ya da Enter tuşuna) bas. Sıra önemli değil. Hatırladığın kelime kalmayınca Bitti düğmesine bas.'
              : 'Daha önce yazdıkların da dâhil, hatırladığın bütün kelimeleri yaz. Sıra önemli değil. Hatırladığın kelime kalmayınca Bitti düğmesine bas.';
      return (
        <RecallInput
          key={`recall-${step.recall}`}
          title={title}
          hint={hint}
          onDone={(words, ms) => {
            out.current.push({ index: step.recall, response: { words, restarts: rc.shown ? restarts.current : 0 }, rtMs: ms });
            restarts.current = 0;
            setStep(nextAfterRecall(step.recall));
          }}
        />
      );
    }
    case 'recog-intro':
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="measure text-lg">
            Son bölüm: kelimeler tek tek gösterilecek. Her kelime için, <strong>üç kez gördüğün ilk listede</strong> olup olmadığını söyle.
          </p>
          <p className="measure text-lg">
            İlk listedeyse <strong>Evet, vardı</strong>; ilk listede yoksa (yeni listede gördüğün kelimeler dâhil) <strong>Hayır, yoktu</strong> düğmesine
            bas. Acele etme; her kelimede düşünebilirsin.
          </p>
          <p className="measure text-ink-2">Bilgisayarda sol ok tuşu “Evet”, sağ ok tuşu “Hayır” demektir.</p>
          <ArmedButton className="btn btn-primary btn-lg" autoFocus onClick={() => setStep({ kind: 'recog', item: 0 })}>
            Başla
          </ArmedButton>
        </div>
      );
    case 'recog': {
      const j = step.item;
      return (
        <RecognitionItem
          key={`recog-${j}`}
          word={task.recognition[j]}
          index={j}
          total={task.recognition.length}
          onAnswer={(yes, rtMs) => {
            out.current.push({ index: recalls.length + j, response: yes ? 1 : 2, rtMs });
            if (j + 1 < task.recognition.length) setStep({ kind: 'recog', item: j + 1 });
            else onDoneRef.current(out.current);
          }}
        />
      );
    }
  }
}
