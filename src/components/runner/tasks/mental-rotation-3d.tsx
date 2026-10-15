'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { bounds, drawFigure, faceFill, turnOf, type Cell3, type Face2D, type Mat3 } from '@/lib/instruments/rotation3d';
import type { MentalRotation3dTask, Rotation3dFigure, Rotation3dItem, Rotation3dPracticeItem } from '@/lib/instruments/types';
import { VERBAL_LETTERS } from '@/lib/instruments/verbal';
import type { Rotation3dTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, TOUCH_CLASSES, afterPaint, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test' | 'part2';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Çizim renkleri (açık ve koyu temada aynı: şekiller her zaman açık zeminde çizilir). */
const PANEL_BG = '#e9edf3';
const INK = '#1f2937';

type Box = { minX: number; minY: number; maxX: number; maxY: number };

const facesOf = (f: Rotation3dFigure, m?: Mat3): Face2D[] => drawFigure(f.cells as unknown as Cell3[], (m ?? f.m) as unknown as Mat3);

/** Birkaç çizimi birlikte içine alan kare kutu: aynı sorudaki şekiller aynı ölçekte çizilir. */
function squareBox(all: Face2D[][], pad = 0.35): Box {
  let b: Box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const faces of all) {
    const x = bounds(faces);
    b = { minX: Math.min(b.minX, x.minX), minY: Math.min(b.minY, x.minY), maxX: Math.max(b.maxX, x.maxX), maxY: Math.max(b.maxY, x.maxY) };
  }
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  const half = Math.max(b.maxX - b.minX, b.maxY - b.minY) / 2 + pad;
  return { minX: cx - half, minY: cy - half, maxX: cx + half, maxY: cy + half };
}

/** Bir şeklin çizimi: yüzler uzaktan yakına sırayla, ışığa göre açık ya da koyu. */
function Shape({ faces, box, label }: { faces: Face2D[]; box: Box; label?: string }) {
  return (
    <svg
      viewBox={`${box.minX} ${box.minY} ${box.maxX - box.minX} ${box.maxY - box.minY}`}
      className="block h-auto w-full"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {faces.map((f, i) => (
        <polygon
          key={i}
          points={f.pts.map((p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ')}
          fill={faceFill(f.tone)}
          stroke={INK}
          strokeWidth={0.05}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** Bir sorunun şekilleri: hedef ve dört seçenek, ortak kutuda. */
function useItemFaces(item: Rotation3dItem | undefined) {
  return useMemo(() => {
    if (!item) return null;
    const target = facesOf(item.target);
    const options = item.options.map((o) => facesOf(o));
    return { target, options, box: squareBox([target, ...options]) };
  }, [item]);
}

/** Şeklin çerçevesi; `border` çerçevenin rengidir (hedef şekil koyu çerçeveyle seçeneklerden ayrılır). */
function Panel({ children, className = '', border = 'border-rule-strong' }: { children: React.ReactNode; className?: string; border?: string }) {
  return (
    <span className={`block w-full overflow-hidden rounded-xl border-2 ${border} p-1 ${className}`} style={{ background: PANEL_BG }}>
      {children}
    </span>
  );
}

/** Yönergedeki örnek: bir şekil, döndürülmüş hâli ve aynı duruşta ayna görüntüsü. */
function Example({ task }: { task: MentalRotation3dTask }) {
  const data = useMemo(() => {
    const t = facesOf(task.example.target);
    const r = facesOf(task.example.rotated);
    const m = facesOf(task.example.mirrored);
    return { t, r, m, box: squareBox([t, r, m]) };
  }, [task]);
  const items: [Face2D[], string, string][] = [
    [data.t, 'Şekil', 'Küplerden yapılmış şekil'],
    [data.r, 'Döndürülmüş hâli: aynı şekil', 'Aynı şeklin döner tablada çevrilmiş hâli'],
    [data.m, 'Ayna görüntüsü: başka bir şekil', 'Şeklin aynı duruşta ayna görüntüsü'],
  ];
  return (
    <figure className="flex w-full max-w-[36rem] flex-col items-center gap-2">
      <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
        {items.map(([faces, caption, label]) => (
          <div key={caption} className="flex flex-col items-center gap-1">
            <Panel>
              <Shape faces={faces} box={data.box} label={label} />
            </Panel>
            <span className="text-sm font-bold text-ink-2">{caption}</span>
          </div>
        ))}
      </div>
      <figcaption className="measure text-ink-2">
        Ortadaki şekil soldakinin döndürülmüş hâlidir. Sağdaki ona çok benzer ama ayna görüntüsüdür: ne kadar döndürülse de soldaki şekille çakışmaz.
      </figcaption>
    </figure>
  );
}

/** Hareketi azaltmayı seçenlerde canlandırma oynamaz. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Alıştırmadaki hedef şeklin, `k`. doğru seçeneğe doğru dönüşünün `s` (0–1) kadarındaki duruşu. */
const poseOf = (item: Rotation3dPracticeItem, k: number, s: number): Mat3 =>
  turnOf(item.target.m as unknown as Mat3, s * item.turns[k].yaw, s * item.turns[k].roll);

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x));

/** Çözüm canlandırmasının kaç tur oynayıp duracağı. */
const SPIN_ROUNDS = 2;

/**
 * Alıştırmanın çözümü: hedef şekil önce birinci doğru seçeneğin, sonra ikincisinin duruşuna döner. Her dönüş 1,8 saniye
 * sürer, sonunda 1,4 saniye durur, ardından şekil başa döner; iki turdan sonra son duruşta kalır. "Durdur" düğmesi
 * canlandırmayı durdurur, "Yeniden oynat" baştan başlatır. Hareketi azaltmayı seçenlerde her doğru seçenek için
 * başlangıç, orta ve son duruş yan yana gösterilir.
 */
function Spin({ item }: { item: Rotation3dPracticeItem }) {
  const reduced = useReducedMotion();
  const letters = item.answer.map((a) => VERBAL_LETTERS[a - 1]);
  const pose = (k: number, s: number) => poseOf(item, k, s);
  const box = useMemo(() => {
    const frames: Face2D[][] = [];
    item.turns.forEach((_, k) => {
      for (let i = 0; i <= 12; i++) frames.push(facesOf(item.target, poseOf(item, k, i / 12)));
    });
    return squareBox(frames);
  }, [item]);
  const [state, setState] = useState({ k: 0, s: 0 });
  // Canlandırma iki tur oynar ve son duruşta durur; istenirse durdurulur ya da yeniden oynatılır.
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (reduced || !running) return;
    let raf = 0;
    const start = performance.now();
    const SEG = 1800;
    const HOLD = 1400;
    const LEAD = 600;
    const cycle = LEAD + SEG + HOLD;
    const total = cycle * item.turns.length;
    const tick = (now: number) => {
      // İlk karenin zaman damgası, etkinin başladığı andan önce olabilir.
      const elapsed = Math.max(0, now - start);
      if (elapsed >= SPIN_ROUNDS * total) {
        setState({ k: item.turns.length - 1, s: 1 });
        setRunning(false);
        return;
      }
      const t = elapsed % total;
      const k = Math.floor(t / cycle);
      const u = t - k * cycle;
      const s = u < LEAD ? 0 : u < LEAD + SEG ? ease((u - LEAD) / SEG) : 1;
      setState((p) => (p.k === k && Math.abs(p.s - s) < 0.004 ? p : { k, s }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, item, running]);
  if (reduced) {
    // Her doğru seçenek için bir sıra: başlangıç, yarı yol ve seçenekteki duruş.
    return (
      <div className="mx-auto flex w-full max-w-[30rem] flex-col gap-4">
        {item.turns.map((_, k) => (
          <figure key={k} className="flex w-full flex-col items-center gap-2">
            <div className="grid w-full grid-cols-3 gap-2">
              {[0, 0.5, 1].map((s) => (
                <Panel key={s}>
                  <Shape faces={facesOf(item.target, pose(k, s))} box={box} />
                </Panel>
              ))}
            </div>
            <figcaption className="text-center text-ink-2">Soldan sağa: şeklin başlangıçtaki, yarı yoldaki ve {letters[k]} seçeneğindeki duruşu.</figcaption>
          </figure>
        ))}
      </div>
    );
  }
  return (
    <figure className="mx-auto flex w-full max-w-[12rem] flex-col items-center gap-2">
      <Panel>
        <Shape faces={facesOf(item.target, pose(state.k, state.s))} box={box} />
      </Panel>
      <figcaption className="text-center text-ink-2" aria-live="off">
        Şekil döndürülünce {letters[state.k]} seçeneğindeki gibi görünür.
      </figcaption>
      <button type="button" className="btn btn-secondary" onClick={() => setRunning((r) => !r)}>
        {running ? 'Durdur' : 'Yeniden oynat'}
      </button>
    </figure>
  );
}

/**
 * Dört seçenek: dokununca seçilir ya da seçim kalkar; en çok iki seçenek seçilebilir. Klavyede 1–4 ya da A–D tuşları
 * (ya da bir seçenekteyken Boşluk tuşu) seçimi değiştirir, Enter cevabı verir.
 */
function Options({
  faces,
  box,
  selected,
  onToggle,
  onConfirm,
  marks,
}: {
  faces: Face2D[][];
  box: Box;
  selected: number[];
  onToggle?: (i: number) => void;
  onConfirm?: (now: number) => void;
  marks?: { right: number[]; chosen: number[] };
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" role="group" aria-label="Seçenekler: dört şekil">
      {faces.map((f, i) => {
        const right = marks?.right.includes(i);
        const wrongPick = marks && marks.chosen.includes(i) && !right;
        const on = selected.includes(i);
        const border = right
          ? 'border-ok ring-2 ring-ok'
          : wrongPick
            ? 'border-danger ring-2 ring-danger'
            : on
              ? 'border-brass ring-2 ring-brass'
              : 'border-rule-strong';
        return (
          <button
            key={i}
            type="button"
            role="checkbox"
            aria-checked={marks ? !!right : on}
            aria-label={`${VERBAL_LETTERS[i]} seçeneği${right ? ' (döndürülmüş hâli, doğru)' : wrongPick ? ' (ayna görüntüsü, senin seçtiğin)' : marks ? ' (ayna görüntüsü)' : ''}`}
            disabled={!onToggle}
            onClick={() => onToggle?.(i)}
            // Enter seçimi değiştirmez, cevabı verir (Boşluk tuşu seçer ya da seçimi kaldırır).
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              if (!e.repeat) onConfirm?.(e.timeStamp);
            }}
            className={`flex flex-col items-center gap-1 rounded-xl disabled:cursor-default ${TOUCH_CLASSES}`}
          >
            <span className={`block w-full overflow-hidden rounded-xl border-2 p-1 ${border}`} style={{ background: PANEL_BG }}>
              <Shape faces={f} box={box} />
            </span>
            <span className={`text-sm font-bold ${on || right ? 'text-ink' : 'text-ink-2'}`} aria-hidden="true">
              {VERBAL_LETTERS[i]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Üç boyutlu zihinde döndürme: küplerden yapılmış bir şekil ve dört seçenek; şeklin döndürülmüş hâli olan iki seçenek
 * seçilir. Süre sınırı yoktur; cevap süresi sorunun ekrana çizildiği andan "Cevabı ver" düğmesine basılana kadar ölçülür
 * (sayfa gizliyken geçen süre sayılmaz). Asıl sorularda doğru cevaplar tarayıcıya gönderilmez: cevaplar sunucuda puanlanır.
 */
export function MentalRotation3d({ task, onDone }: { task: MentalRotation3dTask; onDone: (trials: Rotation3dTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [full, setFull] = useState(false);
  const [feedback, setFeedback] = useState<{ chosen: number[]; good: boolean } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<Rotation3dTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list: Rotation3dItem[] = step === 'practice' ? task.practice : task.items;
  const item = running ? list[index] : undefined;
  const drawn = useItemFaces(item);
  const firstOfPart2 = task.items.findIndex((it) => it.part === 2);

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
    if (refocus.current && el) {
      refocus.current = false;
      el.querySelector<HTMLButtonElement>('[role="checkbox"]')?.focus({ preventScroll: true });
    }
    return () => {
      alive = false;
    };
  }, [running, step, index]);

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

  function toggle(i: number) {
    if (feedback) return;
    if (selected.includes(i)) {
      setSelected(selected.filter((x) => x !== i));
      setFull(false);
    } else if (selected.length < 2) {
      setSelected([...selected, i]);
      setFull(false);
    } else setFull(true);
  }

  function confirm(now: number) {
    if (selected.length !== 2 || !item || feedback) return;
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - shownAt.current - hidden)));
    const response = [...selected].map((x) => x + 1).sort((a, b) => a - b);
    if (step === 'practice') {
      const answer = (item as Rotation3dPracticeItem).answer;
      const good = response[0] === answer[0] && response[1] === answer[1];
      if (good) setPracticeScore((s) => s + 1);
      setFeedback({ chosen: [...selected], good });
      return;
    }
    out.current.push({ index, response, rtMs });
    // Odak görevin içindeyse yeni sorunun seçeneklerine taşınır.
    refocus.current = !!top.current && top.current.contains(document.activeElement);
    setSelected([]);
    setFull(false);
    if (index + 1 >= task.items.length) onDone(out.current);
    else if (index + 1 === firstOfPart2) {
      setIndex(index + 1);
      setStep('part2');
    } else setIndex(index + 1);
  }

  function nextPractice() {
    refocus.current = true;
    setFeedback(null);
    setSelected([]);
    setFull(false);
    if (index + 1 < task.practice.length) setIndex(index + 1);
    else setStep('practice-done');
  }

  useKeys(running && !feedback, (e) => {
    const digit = /^[1-4]$/.test(e.key) ? Number(e.key) - 1 : -1;
    const letter = VERBAL_LETTERS.indexOf(e.key.toLocaleUpperCase('tr-TR'));
    const pick = digit >= 0 ? digit : letter;
    if (pick >= 0 && pick < (item?.options.length ?? 0)) {
      e.preventDefault();
      toggle(pick);
    } else if (e.key === 'Enter' && !e.repeat && selected.length === 2 && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      confirm(e.timeStamp);
    }
  });

  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda küplerden yapılmış bir şekil ve altında dört şekil göreceksin. Dört şekilden ikisi, üstteki şeklin döndürülmüş hâlidir: aynı şekildir,
          yalnızca başka bir yönden görünür. Öteki ikisi ayna görüntüsüdür: ne kadar döndürülse de üstteki şekille çakışmaz.
        </p>
        <Example task={task} />
        <p className="measure text-lg">
          Döndürülmüş iki şekle dokun, emin olunca “Cevabı ver” düğmesine bas. Her soruda tam iki doğru vardır; bir sorunun doğru sayılması için ikisini de
          bulmalısın. Şekiller ekranda dönmez; onları zihninde döndür. Önce {countWord(task.practice.length)} alıştırma sorusu çözelim.
        </p>
        <p className="measure text-ink-2">Bilgisayarda seçenekleri 1–4 ya da A–D tuşlarıyla seçip Enter tuşuyla cevap verebilirsin.</p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            refocus.current = true;
            setStep('practice');
          }}
        >
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
            ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun hiçbirinde iki doğru şekli birlikte bulamadın.`
            : practiceScore === task.practice.length
              ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun ${task.practice.length === 2 ? 'ikisinde de' : 'hepsinde'} iki doğru şekli buldun.`
              : `Alıştırmadaki ${countWord(task.practice.length)} sorunun ${practiceScore === 1 ? 'birinde' : `${countWord(practiceScore)} tanesinde`} iki doğru şekli buldun.`}{' '}
          {low
            ? 'Ayna görüntüsünde de kolların sayısı ve uzunluğu üstteki şekildekiyle aynıdır; ikisini ayıran, kolların hangi yöne uzandığıdır. Ayırt etmek için bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirdiğini düşün, sonra kalan iki kola bak: döndürülmüş şekilde onlar da aynı yönlere uzanır, ayna görüntüsünde ise biri öbür yana uzanır. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık cevabının doğru mu yanlış mı olduğunu görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">
          Test {task.items.length} soru ve iki bölümden oluşur. İlk bölümde şekiller, bir döner tablanın üstündeymiş gibi yalnızca dik bir eksen çevresinde
          döndürülmüştür. Süre sınırı yok; emin olamadığında sana en uygun gelen iki şekli seç.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={low}
            onClick={() => {
              refocus.current = true;
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
              refocus.current = true;
              setIndex(0);
              setSelected([]);
              setStep('test');
            }}
          >
            Teste başla
          </ArmedButton>
        </div>
      </div>
    );
  }

  if (step === 'part2') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="text-lg font-bold">Birinci bölüm bitti.</p>
        <p className="measure text-lg">{task.parts[1].intro}</p>
        <p className="measure text-ink-2">Bu bölümde {task.items.length - firstOfPart2} soru var. İstersen kısa bir mola ver; hazır olduğunda devam et.</p>
        <ArmedButton
          className="btn btn-primary btn-lg"
          autoFocus
          onClick={() => {
            refocus.current = true;
            setStep('test');
          }}
        >
          İkinci bölüme başla
        </ArmedButton>
      </div>
    );
  }

  if (!item || !drawn) return null;
  const practice = step === 'practice';
  const answerIdx = practice ? (item as Rotation3dPracticeItem).answer.map((a) => a - 1) : [];
  const fb = practice ? feedback : null;
  const status = practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `${item.part}. bölüm · Soru ${index + 1} / ${task.items.length}`;
  const hint =
    selected.length === 0
      ? 'Üstteki şeklin döndürülmüş hâli olan iki şekle dokun.'
      : selected.length === 1
        ? `${VERBAL_LETTERS[selected[0]]} seçeneğini seçtin. Bir şekil daha seç.`
        : full
          ? 'İki şekil seçtin. Değiştirmek için seçtiğin şekillerden birine yeniden dokun.'
          : `${[...selected]
              .sort((a, b) => a - b)
              .map((x) => VERBAL_LETTERS[x])
              .join(' ve ')} seçeneklerini seçtin. Emin olunca cevabı ver.`;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-4">
      <StatusLine>{status}</StatusLine>
      <div className="mx-auto flex w-full max-w-[44rem] flex-col gap-4 lg:max-w-[54rem]">
        <div className="mx-auto flex w-[calc(50%-0.25rem)] flex-col items-center gap-1 sm:w-[calc(25%-0.6rem)]">
          <Panel border="border-ink">
            <Shape faces={drawn.target} box={drawn.box} label="Üstteki şekil" />
          </Panel>
          <span className="text-sm font-bold text-ink">Şekil</span>
        </div>
        <p className="text-center font-bold">Hangi iki şekil, bu şeklin döndürülmüş hâli?</p>
        {fb ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <p className={`text-center text-2xl font-bold ${fb.good ? 'text-ok' : 'text-ink'}`}>
              {fb.good ? 'Doğru!' : `Doğru cevap ${answerIdx.map((a) => VERBAL_LETTERS[a]).join(' ve ')} seçenekleriydi`}
            </p>
            <p className="measure mx-auto text-lg">{(item as Rotation3dPracticeItem).explain}</p>
            <Options faces={drawn.options} box={drawn.box} selected={[]} marks={{ right: answerIdx, chosen: fb.chosen }} />
            <Spin item={item as Rotation3dPracticeItem} />
            <div className="flex justify-center">
              <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
                {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
              </ArmedButton>
            </div>
          </div>
        ) : (
          <>
            <Options faces={drawn.options} box={drawn.box} selected={selected} onToggle={toggle} onConfirm={confirm} />
            <p className="text-center text-ink-2" aria-live="polite">
              {hint}
            </p>
            <div className="flex justify-center">
              <button type="button" className="btn btn-primary btn-lg min-w-[12rem]" disabled={selected.length !== 2} onClick={(e) => confirm(e.timeStamp)}>
                Cevabı ver
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
