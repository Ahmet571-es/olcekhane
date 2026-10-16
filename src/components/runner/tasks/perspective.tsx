'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { angleDiff, correctAngle, dialAngle, explainText, PA_CLOSE, questionText, sectorWords, turnBy } from '@/lib/instruments/perspective';
import type { PerspectiveItem, PerspectiveObject, PerspectiveTask } from '@/lib/instruments/types';
import type { PerspectiveTrialInput } from '@/lib/scoring/tasks';
import { ArmedButton, StatusLine, afterPaint, primaryPointer, useKeys } from './common';

type Step = 'ready' | 'practice' | 'practice-done' | 'test';

const countWord = (n: number) => ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'][n] ?? String(n);

/** Tarayıcı süreyi en çok bu kadar (ms) gönderir. */
const MAX_RT_MS = 120_000;
/** Klavyeyle oku çevirme adımı (derece); Shift ile 1 derece. */
const KEY_STEP = 5;

/** Çizim renkleri (açık ve koyu temada aynı: harita ve çember her zaman açık zeminde çizilir). */
const PANEL_BG = '#eef2ea';
const INK = '#1f2937';
const HALO = '#ffffff';
const GIVEN = '#b45309';
const RIGHT = '#15803d';
const FACING = '#374151';

/** Haritanın görünen alanı (nesnelerin konumları 0–100; adlar nesnelerin altına yazılır). */
const MAP_BOX = { x: 4, y: 2, w: 102, h: 98 };
/** Cevap çemberi: yarıçap ve görünen alan (çemberin dışında adlar için yer bırakılır). */
const R = 40;
const DIAL = 64;

/** Önü arkası olmayan nesnelerin küçük çizimleri; her biri (0, 0) çevresinde, yaklaşık 12 birim. */
function Icon({ k }: { k: string }) {
  const s = { stroke: INK, strokeWidth: 0.5, strokeLinejoin: 'round' as const };
  switch (k) {
    case 'agac':
      return (
        <g>
          <rect x={-1} y={1} width={2} height={5.5} fill="#8b5a2b" {...s} />
          <circle cx={0} cy={-2} r={5} fill="#3f9d4a" {...s} />
        </g>
      );
    case 'cesme':
      return (
        <g>
          <path d="M 0 -1 Q -3 -6.5 -4.6 -2.2 M 0 -1 Q 3 -6.5 4.6 -2.2" fill="none" stroke="#2b7bbf" strokeWidth={0.8} strokeLinecap="round" />
          <rect x={-1} y={1.5} width={2} height={2.5} fill="#9aa5b1" {...s} />
          <rect x={-4.5} y={4} width={9} height={2} rx={0.5} fill="#9aa5b1" {...s} />
          <path d="M -5.5 -1 Q 0 4.5 5.5 -1 Z" fill="#7fb3d5" {...s} />
        </g>
      );
    case 'lamba':
      return (
        <g>
          <rect x={-0.6} y={-2} width={1.2} height={7.5} fill="#4b5563" {...s} />
          <rect x={-2.4} y={5.2} width={4.8} height={1.3} rx={0.4} fill="#4b5563" {...s} />
          <path d="M -2.6 -2 L 2.6 -2 L 1.9 -6.2 L -1.9 -6.2 Z" fill="#fcd34d" {...s} />
          <path d="M -3 -6.2 L 3 -6.2 L 0 -8.2 Z" fill="#4b5563" {...s} />
        </g>
      );
    case 'kova':
      return (
        <g>
          <path d="M -4 -3 Q 0 -9.5 4 -3" fill="none" stroke={INK} strokeWidth={0.7} />
          <path d="M -4.3 -3 L 4.3 -3 L 3.2 5.5 L -3.2 5.5 Z" fill="#3b82f6" {...s} />
          <path d="M -4.3 -3 L 4.3 -3" stroke={INK} strokeWidth={0.9} />
        </g>
      );
    case 'saksi':
      return (
        <g>
          <path d="M 0 0 L 0 -6.2" stroke="#2f7a3a" strokeWidth={0.8} />
          <ellipse cx={-2.3} cy={-3.6} rx={2.3} ry={1.1} transform="rotate(-30 -2.3 -3.6)" fill="#4caf50" {...s} />
          <ellipse cx={2.3} cy={-3.6} rx={2.3} ry={1.1} transform="rotate(30 2.3 -3.6)" fill="#4caf50" {...s} />
          <ellipse cx={0} cy={-6.6} rx={1.1} ry={1.8} fill="#4caf50" {...s} />
          <path d="M -4 0.6 L 4 0.6 L 3 6.2 L -3 6.2 Z" fill="#c2410c" {...s} />
          <rect x={-4.7} y={-0.6} width={9.4} height={1.6} rx={0.4} fill="#c2410c" {...s} />
        </g>
      );
    case 'top':
      return (
        <g>
          <circle cx={0} cy={0} r={4.6} fill="#f97316" {...s} />
          <path d="M -4.6 0 H 4.6 M 0 -4.6 Q -2.6 0 0 4.6 M 0 -4.6 Q 2.6 0 0 4.6" fill="none" stroke={HALO} strokeWidth={0.6} />
        </g>
      );
    default:
      return <path d="M -5.2 3.8 Q -5.8 -1 -2.2 -3.6 Q 0 -5.2 2.2 -3.6 Q 5.8 -1 5.2 3.8 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth={0.5} />;
  }
}

/** Yazı: koyu harf, beyaz kenar (çizgilerin üstünde de okunur). */
function Label({
  x,
  y,
  children,
  size = 4.6,
  fill = INK,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  children: string;
  size?: number;
  fill?: string;
  anchor?: 'middle' | 'start' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={700}
      textAnchor={anchor}
      fill={fill}
      stroke={HALO}
      strokeWidth={size * 0.28}
      strokeLinejoin="round"
      paintOrder="stroke"
      style={{ fontFamily: 'inherit' }}
    >
      {children}
    </text>
  );
}

/** İki nokta arasında, uçtan `trim` kadar kısaltılmış çizgi (ok ucu nesnenin çizimine binmesin). */
function trimmed(a: PerspectiveObject, b: PerspectiveObject, trim: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  const k = (d - trim) / d;
  return { x1: a.x, y1: a.y, x2: a.x + dx * k, y2: a.y + dy * k };
}

/**
 * Harita: yedi nesne, her birinin ortası bir noktayla. Harita hiçbir soruda dönmez. Yönergedeki örnekte ve alıştırmanın
 * geri bildiriminde (`show`) duran nesne halkayla, bakış yönü kesik çizgiyle, hedefin yönü yeşil okla gösterilir.
 */
function PerspectiveMap({ objects, show }: { objects: readonly PerspectiveObject[]; show?: PerspectiveItem }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const at = show ? objects[show.at] : null;
  const look = show ? trimmed(objects[show.at], objects[show.facing], 7.5) : null;
  const aim = show ? trimmed(objects[show.at], objects[show.target], 7.5) : null;
  return (
    <svg
      viewBox={`${MAP_BOX.x} ${MAP_BOX.y} ${MAP_BOX.w} ${MAP_BOX.h}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`Harita: ${objects.map((o) => o.name).join(', ')}`}
    >
      <defs>
        <marker id={`${id}-look`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={FACING} />
        </marker>
        <marker id={`${id}-aim`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={RIGHT} />
        </marker>
      </defs>
      <rect x={MAP_BOX.x} y={MAP_BOX.y} width={MAP_BOX.w} height={MAP_BOX.h} fill={PANEL_BG} />
      {objects.map((o) => (
        <g key={o.key} transform={`translate(${o.x} ${o.y})`}>
          <Icon k={o.key} />
        </g>
      ))}
      {at && <circle cx={at.x} cy={at.y} r={7.5} fill="none" stroke={GIVEN} strokeWidth={0.9} />}
      {look && <line {...look} stroke={FACING} strokeWidth={0.9} strokeDasharray="2 1.6" markerEnd={`url(#${id}-look)`} />}
      {aim && <line {...aim} stroke={RIGHT} strokeWidth={1.1} markerEnd={`url(#${id}-aim)`} />}
      {objects.map((o) => (
        <circle key={o.key} cx={o.x} cy={o.y} r={1.2} fill={INK} stroke={HALO} strokeWidth={0.5} />
      ))}
      {objects.map((o) => (
        <Label key={o.key} x={o.x} y={o.y + 11.6}>
          {o.name}
        </Label>
      ))}
    </svg>
  );
}

/** Çemberin üstünde `deg` yönündeki nokta (0 yukarı, saat yönünde). */
const onDial = (deg: number, r: number) => ({ x: r * Math.sin((deg * Math.PI) / 180), y: -r * Math.cos((deg * Math.PI) / 180) });

/** Bir okun açıklaması (ekran okuyucu): "sağ önünde, 40 derece sağda". */
function dialText(deg: number | null): string {
  if (deg === null) return 'Yön seçilmedi';
  const side = deg === 0 ? 'tam önde' : Math.abs(deg) === 180 ? 'tam arkada' : `${Math.abs(deg)} derece ${deg > 0 ? 'sağda' : 'solda'}`;
  return `${sectorWords(deg)}, ${side}`;
}

/**
 * Cevap çemberi: ortası durulan yer, yukarıdaki ok bakılan nesne. Çembere dokunmak ya da oku sürüklemek hedefin yönünü
 * seçer; klavyede ← ve → tuşları oku 5 derece (Shift ile 1 derece) çevirir. Geri bildirimde (`right`) doğru yön yeşil
 * okla, kişinin gösterdiği yön turuncu okla çizilir.
 */
function AnswerDial({
  at,
  facing,
  target,
  value,
  onChange,
  right,
}: {
  at: string;
  facing: string;
  target: string;
  value: number | null;
  onChange?: (deg: number) => void;
  right?: number;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<number | null>(null);
  const live = !!onChange && right === undefined;

  // Çemberdeki dokunuş yalnızca oku çevirir: tarayıcı bunu kaydırma ya da fırlatma hareketi saymasın. Saysaydı, oku hızla
  // sürükleyip bırakınca hemen ardından "Cevabı ver" düğmesine dokunmak bir süre işe yaramayabiliyordu.
  useEffect(() => {
    const el = svg.current;
    if (!el || !live) return;
    const stop = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    el.addEventListener('touchstart', stop, { passive: false });
    el.addEventListener('touchmove', stop, { passive: false });
    return () => {
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, [live]);

  /** Ekrandaki noktanın çemberin ortasına göre yeri (çizimin birimiyle). */
  function local(e: React.PointerEvent) {
    const box = svg.current!.getBoundingClientRect();
    const scale = (2 * DIAL) / box.width;
    return { x: (e.clientX - box.left) * scale - DIAL, y: (e.clientY - box.top) * scale - DIAL };
  }

  function pick(e: React.PointerEvent) {
    if (!svg.current || !onChange) return;
    const { x, y } = local(e);
    // Ortaya çok yakın dokunuşun yönü belirsizdir.
    const deg = dialAngle(x, y);
    if (deg !== null) onChange(deg);
  }

  const arrow = (deg: number, color: string, marker: string, label?: string) => {
    const tip = onDial(deg, R - 1.5);
    const text = onDial(deg, R + 11);
    return (
      <g>
        <line x1={0} y1={0} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={2.2} strokeLinecap="round" markerEnd={`url(#${id}-${marker})`} />
        {label && (
          <Label x={text.x} y={text.y + 2.5} size={7.5} fill={color}>
            {label}
          </Label>
        )}
      </g>
    );
  };

  return (
    <svg
      ref={svg}
      viewBox={`${-DIAL} ${-DIAL} ${2 * DIAL} ${2 * DIAL}`}
      // Odak halkası tuvalin kenarında değil, çemberin hemen dışında çizilir (aşağıdaki halka).
      className={`group block h-auto w-full outline-none ${live ? 'cursor-pointer touch-none select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]' : ''}`}
      role={live ? 'slider' : 'img'}
      tabIndex={live ? 0 : undefined}
      aria-label={live ? `${target}: hangi yönde? Çemberde ok` : `Cevap çemberi: ${target}`}
      aria-valuemin={live ? -180 : undefined}
      aria-valuemax={live ? 180 : undefined}
      aria-valuenow={live && value !== null ? value : undefined}
      aria-valuetext={live ? dialText(value) : undefined}
      onPointerDown={
        live
          ? (e) => {
              if (!primaryPointer(e) || !svg.current) return;
              // Çemberin dışındaki köşelere dokunmak oku değiştirmez (ör. sayfayı kaydırmak isterken); sürükleme çemberden başlar.
              const { x, y } = local(e);
              if (Math.hypot(x, y) > R + 16) return;
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = e.pointerId;
              pick(e);
            }
          : undefined
      }
      onPointerMove={live ? (e) => drag.current === e.pointerId && pick(e) : undefined}
      onPointerUp={live ? () => (drag.current = null) : undefined}
      onPointerCancel={live ? () => (drag.current = null) : undefined}
    >
      <defs>
        {(
          [
            ['facing', FACING],
            ['given', GIVEN],
            ['right', RIGHT],
          ] as const
        ).map(([k, c]) => (
          <marker key={k} id={`${id}-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
          </marker>
        ))}
      </defs>
      <circle cx={0} cy={0} r={DIAL} fill="transparent" />
      {live && <circle cx={0} cy={0} r={R + 4} fill="none" stroke="var(--focus)" strokeWidth={2} className="opacity-0 group-focus-visible:opacity-100" />}
      <circle cx={0} cy={0} r={R} fill={PANEL_BG} stroke={INK} strokeWidth={0.9} />
      {arrow(0, FACING, 'facing')}
      <Label x={0} y={-R - 6} size={7.5} fill={FACING}>
        {facing}
      </Label>
      {right !== undefined && arrow(right, RIGHT, 'right', target)}
      {value !== null && arrow(value, GIVEN, 'given', right === undefined ? target : undefined)}
      <circle cx={0} cy={0} r={2.2} fill={INK} stroke={HALO} strokeWidth={0.7} />
      <Label x={0} y={11} size={6.2}>
        {`${at} (sen)`}
      </Label>
    </svg>
  );
}

/**
 * Bakış açısı alma: haritadaki bir nesnenin yanında durup başka bir nesneye bakıldığı hayal edilir; üçüncü nesnenin yönü
 * bir çemberin üstünde okla gösterilir. Süre sınırı yoktur; cevap süresi sorunun ekrana çizildiği andan "Cevabı ver"
 * düğmesine basılana kadar ölçülür (sayfa gizliyken geçen süre sayılmaz). Puanlama sunucuda yapılır; nesnelerin konumları
 * haritayı çizmek için tarayıcıya gelir (doğru yönler bunlardan hesaplanabilir; test bir sınav değildir).
 */
export function Perspective({ task, onDone }: { task: PerspectiveTask; onDone: (trials: PerspectiveTrialInput[]) => void }) {
  const [step, setStep] = useState<Step>('ready');
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ given: number; error: number } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const out = useRef<PerspectiveTrialInput[]>([]);
  const shownAt = useRef(0);
  const hiddenMs = useRef(0);
  const hiddenSince = useRef<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  /** Son etkileşim klavyeyle miydi (dokunma ya da fare değil)? */
  const viaKeys = useRef(false);
  const running = step === 'practice' || step === 'test';
  const list = step === 'practice' ? task.practice : task.items;
  const item = running ? list[index] : undefined;
  const { objects } = task;

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
    // Küçük ekranda harita, çember ve "Cevabı ver" düğmesi birlikte görünsün: düğme ekranın altında kalıyorsa sayfa, sorunun
    // başı ekranın üstünü geçmeyecek kadar kaydırılır.
    else if (el) {
      const button = el.querySelector<HTMLElement>('[data-cevap]');
      const below = button ? button.getBoundingClientRect().bottom + 12 - window.innerHeight : 0;
      const room = el.getBoundingClientRect().top - 8;
      if (below > 0 && room > 0) window.scrollBy({ top: Math.min(below, room) });
    }
    // Klavyeyle çözen kişide odak yeni sorunun çemberine taşınır; dokunarak çözende taşınmaz (telefonda odak halkası
    // gereksiz yere görünmesin).
    if (refocus.current && el) {
      refocus.current = false;
      if (viaKeys.current) el.querySelector<SVGSVGElement>('[role="slider"]')?.focus({ preventScroll: true });
    }
    return () => {
      alive = false;
    };
  }, [running, step, index]);

  useEffect(() => {
    const keys = () => (viaKeys.current = true);
    const pointer = () => (viaKeys.current = false);
    window.addEventListener('keydown', keys, true);
    window.addEventListener('pointerdown', pointer, true);
    return () => {
      window.removeEventListener('keydown', keys, true);
      window.removeEventListener('pointerdown', pointer, true);
    };
  }, []);

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

  function confirm(now: number) {
    if (value === null || !item || feedback) return;
    const hidden = hiddenMs.current + (hiddenSince.current !== null ? now - hiddenSince.current : 0);
    const rtMs = Math.min(MAX_RT_MS, Math.max(0, Math.round(now - shownAt.current - hidden)));
    if (step === 'practice') {
      const error = angleDiff(value, correctAngle(objects, item));
      if (error <= PA_CLOSE) setPracticeScore((s) => s + 1);
      setFeedback({ given: value, error });
      return;
    }
    out.current.push({ index, response: { deg: value }, rtMs });
    refocus.current = !!top.current && top.current.contains(document.activeElement);
    setValue(null);
    if (index + 1 >= task.items.length) onDone(out.current);
    else setIndex(index + 1);
  }

  function nextPractice() {
    refocus.current = true;
    setFeedback(null);
    setValue(null);
    if (index + 1 < task.practice.length) setIndex(index + 1);
    else setStep('practice-done');
  }

  useKeys(running && !feedback, (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const d = (e.shiftKey ? 1 : KEY_STEP) * (e.key === 'ArrowRight' ? 1 : -1);
      setValue((v) => turnBy(v, d));
    } else if (e.key === 'Enter' && !e.repeat && value !== null && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      confirm(e.timeStamp);
    }
  });

  const ex = task.example;
  if (step === 'ready') {
    return (
      <div key={step} className="flex flex-col items-center gap-6 text-center">
        <p className="measure text-lg">
          Her soruda haritadaki bir nesnenin yanında durduğunu ve yüzünün başka bir nesneye dönük olduğunu hayal edeceksin. Sonra üçüncü bir nesnenin senin için
          hangi yönde kaldığını, çemberin üstünde bir okla göstereceksin.
        </p>
        <figure className="flex w-full max-w-[40rem] flex-col items-center gap-3">
          <div className="grid w-full grid-cols-1 items-center gap-3 sm:grid-cols-[3fr_2fr]">
            <div className="mx-auto w-full max-w-[22rem] overflow-hidden rounded-xl border-2 border-rule-strong">
              <PerspectiveMap objects={objects} show={ex} />
            </div>
            <div className="mx-auto w-full max-w-[13rem]">
              <AnswerDial
                at={objects[ex.at].name}
                facing={objects[ex.facing].name}
                target={objects[ex.target].name}
                value={null}
                right={correctAngle(objects, ex)}
              />
            </div>
          </div>
          <figcaption className="measure text-ink-2">
            Örnek: {questionText(objects, ex)} Kendini {objects[ex.at].gen} yanında, yüzün {objects[ex.facing].dat} dönük hayal edersen{' '}
            {objects[ex.target].name.toLocaleLowerCase('tr-TR')} {sectorWords(correctAngle(objects, ex))} kalır. Çemberin ortası durduğun yer, yukarıdaki ok
            baktığın nesnedir; yeşil ok {objects[ex.target].gen} yönünü gösterir.
          </figcaption>
        </figure>
        <p className="measure text-lg">
          Çembere dokunarak ya da oku sürükleyerek yönü göster; emin olunca “Cevabı ver” düğmesine bas. Harita hiç dönmez: ekranı, telefonu ya da başını
          çevirmeden yalnızca zihninde dön. Önce {countWord(task.practice.length)} alıştırma sorusu çözelim; alıştırmalarda doğru yönü göreceksin.
        </p>
        <p className="measure text-ink-2">Bilgisayarda oku ← ve → tuşlarıyla (Shift tuşuyla birlikte daha ince) çevirip Enter tuşuyla cevap verebilirsin.</p>
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
            ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun hiçbirinde okun doğru yöne çok yakın (en çok ${PA_CLOSE} derece uzakta) değildi.`
            : practiceScore === task.practice.length
              ? `Alıştırmadaki ${countWord(task.practice.length)} sorunun hepsinde okun doğru yöne çok yakındı.`
              : `Alıştırmadaki ${countWord(task.practice.length)} sorunun ${practiceScore === 1 ? 'birinde' : `${countWord(practiceScore)} tanesinde`} okun doğru yöne çok yakındı (en çok ${PA_CLOSE} derece uzakta).`}{' '}
          {low
            ? 'Kendini durduğun nesnenin yanına koy ve yüzünü bakılan nesneye çevir: çemberin yukarısı her zaman o nesnedir, haritanın yukarısı değil. Sonra hedefin önünde mi arkanda mı, sağında mı solunda mı kaldığını düşün. Baktığın nesne haritada aşağıdaysa senin sağın ekranın soluna düşer. İstersen alıştırmayı tekrarlayabilirsin.'
            : 'Şimdi asıl sorular başlıyor; artık doğru yönü görmeyeceksin.'}
        </p>
        <p className="measure text-ink-2">Test {task.items.length} sorudan oluşur. Süre sınırı yok; emin olamadığında sana en doğru gelen yönü göster.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ArmedButton
            className={`btn btn-lg ${low ? 'btn-primary' : 'btn-secondary'}`}
            autoFocus={low}
            onClick={() => {
              refocus.current = true;
              setIndex(0);
              setPracticeScore(0);
              setValue(null);
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
              setValue(null);
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
  const fb = practice ? feedback : null;
  const at = objects[item.at];
  const facing = objects[item.facing];
  const target = objects[item.target];
  const status = practice ? `Alıştırma ${index + 1} / ${task.practice.length}` : `Soru ${index + 1} / ${task.items.length}`;
  return (
    <div ref={top} className="flex scroll-mt-4 flex-col gap-3">
      <StatusLine>{status}</StatusLine>
      <p className="measure mx-auto text-center text-lg font-bold" aria-live="polite">
        {questionText(objects, item)}
      </p>
      <div className="mx-auto grid w-full max-w-[52rem] grid-cols-1 items-center gap-3 lg:grid-cols-[3fr_2fr] lg:gap-6">
        <div className="mx-auto w-full max-w-[min(100%,37svh)] overflow-hidden rounded-xl border-2 border-rule-strong lg:max-w-[30rem]">
          <PerspectiveMap objects={objects} show={fb ? item : undefined} />
        </div>
        <div className="mx-auto flex w-full flex-col items-center gap-3">
          <div className="w-full max-w-[min(100%,29svh)] lg:max-w-[20rem]">
            {fb ? (
              <AnswerDial at={at.name} facing={facing.name} target={target.name} value={fb.given} right={correctAngle(objects, item)} />
            ) : (
              <AnswerDial at={at.name} facing={facing.name} target={target.name} value={value} onChange={setValue} />
            )}
          </div>
          {fb ? (
            <div className="flex flex-col gap-3" aria-live="polite">
              <p className={`text-center text-2xl font-bold ${fb.error <= PA_CLOSE ? 'text-ok' : 'text-ink'}`}>
                {fb.error <= 5 ? 'Doğru!' : fb.error <= PA_CLOSE ? 'Doğru yöne çok yakın!' : 'Doğru yön yeşil okla gösterildi'}
              </p>
              <p className="measure mx-auto text-center text-lg">
                {Math.round(fb.error) === 0
                  ? 'Turuncu ok senin gösterdiğin yön: tam doğru yönde.'
                  : `Turuncu ok senin gösterdiğin yön: doğru yönden ${Math.round(fb.error)} derece uzakta.`}{' '}
                {explainText(objects, item)}
              </p>
              <div className="flex justify-center">
                <ArmedButton className="btn btn-primary btn-lg" autoFocus delayMs={600} onClick={nextPractice}>
                  {index + 1 < task.practice.length ? 'Sonraki alıştırma' : 'Devam'}
                </ArmedButton>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-ink-2" aria-live="polite">
                {value === null ? 'Çembere dokun ya da oku sürükle.' : 'Emin olunca cevabı ver.'}
              </p>
              <button type="button" data-cevap className="btn btn-primary btn-lg min-w-[12rem]" disabled={value === null} onClick={(e) => confirm(e.timeStamp)}>
                Cevabı ver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
