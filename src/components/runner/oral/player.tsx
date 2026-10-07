'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * Kaydı dinleme düğmeleri ve zaman çizelgesi. Kayıt yalnızca bu sayfanın belleğindeki WAV dosyasından çalınır.
 * Çizelgede ses yüksekliği ve (verilirse) 1 saniyeden uzun duraklamalar görünür; çizelgeye dokununca o ana gidilir.
 * Dinlenen bölümler izlenir: işaretlemenin kaydın tamamı dinlenerek yapılıp yapılmadığı rapora yazılır.
 */

export interface PlayerHandle {
  pause: () => void;
  /** Birkaç saniye geri gidip çalar (işaretlerken kelimeyi yeniden dinlemek için). */
  replay: (backMs: number) => void;
}

const SPEEDS = [1, 0.75, 0.5] as const;
const BIN_MS = 250;

export function clock(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export const RecordingPlayer = forwardRef<
  PlayerHandle,
  {
    url: string;
    durationMs: number;
    contour: number[];
    /** Duraklamalar: [başlangıç, bitiş] ms, kaydın başından itibaren. */
    pauses?: [number, number][];
    /** Dinlenen bölümün kayda oranı (0–1); her değişimde çağrılır. */
    onListened?: (ratio: number) => void;
    label?: string;
    compact?: boolean;
  }
>(function RecordingPlayer({ url, durationMs, contour, pauses = [], onListened, label = 'Kayıt', compact = false }, ref) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [failed, setFailed] = useState(false);
  const bins = useRef<Uint8Array>(new Uint8Array(Math.max(1, Math.ceil(durationMs / BIN_MS))));
  const last = useRef(0);
  const reported = useRef(-1);

  useImperativeHandle(
    ref,
    () => ({
      pause: () => audio.current?.pause(),
      replay: (backMs: number) => {
        const a = audio.current;
        if (!a) return;
        const t = Math.max(0, a.currentTime * 1000 - backMs);
        a.currentTime = t / 1000;
        last.current = t;
        a.play().catch(() => setFailed(true));
      },
    }),
    [],
  );

  const markListened = useCallback(
    (fromMs: number, toMs: number) => {
      const b = bins.current;
      for (let i = Math.floor(fromMs / BIN_MS); i <= Math.floor(toMs / BIN_MS) && i < b.length; i++) if (i >= 0) b[i] = 1;
      let n = 0;
      for (let i = 0; i < b.length; i++) n += b[i];
      const ratio = Math.round((n / b.length) * 100) / 100;
      if (ratio !== reported.current) {
        reported.current = ratio;
        onListened?.(ratio);
      }
    },
    [onListened],
  );

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.playbackRate = speed;
  }, [speed]);

  // Çalarken ekran güncellemesi: timeupdate saniyede birkaç kez gelir; oynatma çizgisi kare kare ilerlesin.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const a = audio.current;
      if (a) {
        const now = a.currentTime * 1000;
        if (now >= last.current && now - last.current < 1500) markListened(last.current, now);
        last.current = now;
        setTime(now);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, markListened]);

  function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (a.ended || a.currentTime * 1000 >= durationMs - 50) a.currentTime = 0;
      last.current = a.currentTime * 1000;
      a.play().catch(() => setFailed(true));
    } else a.pause();
  }

  function seek(ms: number) {
    const a = audio.current;
    if (!a) return;
    const t = Math.max(0, Math.min(durationMs, ms));
    a.currentTime = t / 1000;
    last.current = t;
    setTime(t);
  }

  const pct = durationMs > 0 ? Math.min(100, (time / durationMs) * 100) : 0;
  const W = 600;
  const H = compact ? 40 : 56;
  const barW = contour.length ? W / contour.length : W;

  return (
    <div className="flex flex-col gap-2.5">
      <audio
        ref={audio}
        src={url}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          markListened(last.current, durationMs);
          setTime(durationMs);
        }}
        onError={() => setFailed(true)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggle} className="btn btn-primary min-w-[8.5rem]" aria-label={playing ? `${label}: duraklat` : `${label}: dinle`}>
          {playing ? '❚❚ Duraklat' : '▶ Dinle'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => seek(time - 5000)} aria-label="5 saniye geri">
          ↺ 5 sn
        </button>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
          aria-label={`Dinleme hızı: ${speed === 1 ? 'normal' : `${speed} kat`}. Değiştirmek için basın.`}
        >
          Hız: {speed === 1 ? 'normal' : `${String(speed).replace('.', ',')}×`}
        </button>
        <span className="t-small tabular ml-auto text-ink-2" aria-live="off">
          {clock(time)} / {clock(durationMs)}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-14 w-full cursor-pointer touch-none rounded-lg bg-surface-2"
        style={compact ? { height: '2.5rem' } : undefined}
        role="slider"
        tabIndex={0}
        aria-label={`${label}: zaman çizelgesi`}
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs / 1000)}
        aria-valuenow={Math.round(time / 1000)}
        aria-valuetext={`${clock(time)} / ${clock(durationMs)}`}
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          seek(((e.clientX - r.left) / r.width) * durationMs);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            seek(time - 5000);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            seek(time + 5000);
          } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {pauses.map(([a, b]) => (
          <rect key={a} x={(a / durationMs) * W} y={0} width={Math.max(2, ((b - a) / durationMs) * W)} height={H} fill="var(--dim-ext)" opacity={0.18} />
        ))}
        {contour.map((v, i) => {
          const h = Math.max(1.5, (v / 100) * (H - 8));
          return <rect key={i} x={i * barW + barW * 0.15} y={(H - h) / 2} width={barW * 0.7} height={h} rx={1} fill={(i + 0.5) * barW <= (pct / 100) * W ? 'var(--ink)' : 'var(--rule-strong)'} />;
        })}
        <line x1={(pct / 100) * W} x2={(pct / 100) * W} y1={0} y2={H} stroke="var(--marker)" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
      </svg>
      {failed && (
        <p className="notice notice-warn">
          Kayıt bu tarayıcıda çalınamadı. Sayfayı kapatmadan cihazın sesini açın ve yeniden deneyin; olmazsa Chrome ya da Safari’nin güncel bir sürümünü
          kullanın.
        </p>
      )}
    </div>
  );
});
