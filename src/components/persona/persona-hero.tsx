'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { DEFAULT_TRAITS, TRAITS, randomTraits, traitValueText, type Traits } from '@/lib/persona-shape';
import type { PointerState } from './persona-blob';

const PersonaBlob = dynamic(() => import('./persona-blob'), { ssr: false });

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Üç boyutlu şekil yüklenene kadar (ya da WebGL yoksa) gösterilen yumuşak renkli form. Beş rengin her
 * biri bir köşeden yayılır; kaydırıcılar renklerin payını ve formun boyunu değiştirir.
 */
function FallbackShape({ traits }: { traits: Traits }) {
  const [ext, agr, con, emo, int] = traits;
  const spread = (v: number) => `${Math.round(34 + v * 26)}%`;
  const style = {
    '--olcek': (0.84 + ext * 0.14).toFixed(3),
    background: [
      'radial-gradient(circle at 34% 24%, rgb(255 255 255 / 0.75), transparent 30%)',
      `radial-gradient(circle at 26% 30%, var(--dim-ext), transparent ${spread(ext)})`,
      `radial-gradient(circle at 80% 32%, var(--dim-agr), transparent ${spread(agr)})`,
      `radial-gradient(circle at 72% 82%, var(--dim-con), transparent ${spread(con)})`,
      `radial-gradient(circle at 22% 78%, var(--dim-emo), transparent ${spread(emo)})`,
      `radial-gradient(circle at 50% 50%, var(--dim-int), color-mix(in oklab, var(--dim-int) ${Math.round(40 + int * 50)}%, var(--dim-con)))`,
    ].join(', '),
    boxShadow: 'inset -22px -30px 70px rgb(19 32 59 / 0.22), inset 16px 20px 44px rgb(255 255 255 / 0.3)',
  } as CSSProperties;
  return (
    <div className="absolute inset-[15%] transition-transform duration-700" style={{ transform: 'scale(var(--olcek))' }}>
      <div className="yedek-sekil size-full" style={style} />
    </div>
  );
}

/**
 * Ana sayfanın açılışı: solda sunucuda üretilen giriş metni (intro), sağda canlı şekil, altta beş
 * kaydırıcı. Değerler yalnızca bu sayfada durur; hiçbir yere gönderilmez ya da kaydedilmez.
 */
export function PersonaHero({ intro }: { intro: React.ReactNode }) {
  const [traits, setTraits] = useState<Traits>(DEFAULT_TRAITS);
  const [enable3d, setEnable3d] = useState(false);
  const [ready, setReady] = useState(false);
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!webglAvailable()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setEnable3d(true), { timeout: 1200 });
    else window.setTimeout(() => setEnable3d(true), 500);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.active = true;
    };
    const leave = () => {
      pointer.current.active = false;
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  const markReady = useCallback(() => setReady(true), []);
  const markLost = useCallback(() => setReady(false), []);
  const shuffle = useCallback(() => setTraits(randomTraits()), []);
  const reset = useCallback(() => setTraits(DEFAULT_TRAITS), []);
  const setOne = useCallback(
    (i: number, v: number) =>
      setTraits((prev) => {
        const next = [...prev] as [number, number, number, number, number];
        next[i] = v;
        return next;
      }),
    [],
  );

  return (
    <div className="flex flex-col gap-8 lg:gap-4">
      <div className="grid items-center gap-4 sm:gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-6">
        <div className="relative z-10">{intro}</div>
        <div
          ref={stage}
          className="relative order-first mx-auto aspect-square w-full max-w-[15rem] cursor-pointer select-none sm:max-w-[26rem] lg:order-none lg:max-w-[36rem]"
          onClick={shuffle}
          aria-hidden="true"
          title="Dokun: yeni bir şekil"
        >
          {/* Yere düşen yumuşak gölge */}
          <div className="absolute inset-x-[24%] bottom-[8%] h-[8%] rounded-[50%] bg-ink/20 blur-2xl" />
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>
            <FallbackShape traits={traits} />
          </div>
          {enable3d && <PersonaBlob traits={traits} pointer={pointer} onReady={markReady} onLost={markLost} />}
        </div>
      </div>
      <PersonaConsole traits={traits} setOne={setOne} shuffle={shuffle} reset={reset} />
    </div>
  );
}

/** Beş kaydırıcı: açılışın altında, masaüstünde yan yana, telefonda iki sütun. */
function PersonaConsole({ traits, setOne, shuffle, reset }: { traits: Traits; setOne: (i: number, v: number) => void; shuffle: () => void; reset: () => void }) {
  return (
    <div className="glass rounded-[2rem] p-5 shadow-[var(--shadow)] md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold">Kendini dene</p>
          <p className="t-meta">Kaydırıcıları oynat, şekil seninle birlikte değişsin.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary min-h-10 px-4" onClick={shuffle}>
            Rastgele
          </button>
          <button type="button" className="btn btn-quiet min-h-10 px-4" onClick={reset}>
            Sıfırla
          </button>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 lg:grid-cols-5 lg:gap-x-6">
        {TRAITS.map((t, i) => {
          const v = Math.round(traits[i] * 100);
          return (
            <li key={t.key} className={`flex flex-col ${i === TRAITS.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
              <label htmlFor={`kaydirici-${t.key}`} className="flex items-center gap-2 text-[0.95rem] font-bold leading-tight">
                <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: `var(${t.cssVar})` }} aria-hidden="true" />
                {t.name}
              </label>
              <input
                id={`kaydirici-${t.key}`}
                type="range"
                min={0}
                max={100}
                step={1}
                value={v}
                onChange={(e) => setOne(i, Number(e.target.value) / 100)}
                aria-valuetext={traitValueText(t, traits[i])}
                className="trait-range"
                style={{ '--renk': `var(${t.cssVar})`, '--dolu': `${v}%` } as CSSProperties}
              />
              <span className="t-meta -mt-1 flex justify-between gap-2 text-[0.8rem]" aria-hidden="true">
                <span>{t.low}</span>
                <span className="text-right">{t.high}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="t-meta mt-4 measure">
        Bu küçük bir oyun, ölçüm değil: şekil yalnızca kaydırıcılardaki tahminini gösterir ve hiçbir yere kaydedilmez. Gerçek profilini
        görmek için{' '}
        <Link href="/testler/bes-faktor-kisilik" className="font-bold text-ink">
          Beş Faktör Kişilik Profili
        </Link>
        ’ni ücretsiz çöz.
      </p>
    </div>
  );
}
