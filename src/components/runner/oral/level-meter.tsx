'use client';

import { useEffect, useRef, useState } from 'react';
import type { MicRecorder } from './recorder';

/**
 * Mikrofonun anlık ses düzeyi. Konuşunca çubuk dolar; ses uzun süre gelmezse (mikrofon kapalı, çok uzak) uyarı verir.
 * Düzey yalnızca ekranda gösterilir, hiçbir yere gönderilmez.
 */
export function LevelMeter({ recorder, quietAfterMs = 6000, compact = false }: { recorder: MicRecorder; quietAfterMs?: number; compact?: boolean }) {
  const bar = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'ok' | 'quiet' | 'loud'>('ok');
  const lastVoice = useRef(0);

  useEffect(() => {
    let raf = 0;
    let shown = -100;
    lastVoice.current = performance.now();
    let current: 'ok' | 'quiet' | 'loud' = 'ok';
    const tick = (now: number) => {
      const { db, peak } = recorder.level;
      // Gösterge yumuşak insin: konuşmanın kısa aralarında çubuk titremesin.
      shown = db > shown ? db : shown - 1.2;
      const pct = Math.max(0, Math.min(100, ((shown + 60) / 60) * 100));
      if (bar.current) bar.current.style.width = `${pct}%`;
      if (db > -45) lastVoice.current = now;
      const next = peak >= 0.99 ? 'loud' : now - lastVoice.current > quietAfterMs ? 'quiet' : 'ok';
      if (next !== current) {
        current = next;
        setState(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [recorder, quietAfterMs]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`overflow-hidden rounded-full bg-surface-2 ${compact ? 'h-2' : 'h-3.5'}`} aria-hidden="true">
        <div ref={bar} className="h-full rounded-full bg-[var(--dim-emo)] transition-[width] duration-75" style={{ width: '0%' }} />
      </div>
      {!compact && <p className="t-small text-ink-3">Konuşunca çubuk hareket etmeli.</p>}
      {state === 'quiet' && (
        <p className="t-small font-bold text-warn" role="status">
          Ses gelmiyor gibi görünüyor: Mikrofonun kapalı olmadığından ve cihazın öğrenciye yakın durduğundan emin olun.
        </p>
      )}
      {state === 'loud' && (
        <p className="t-small font-bold text-warn" role="status">
          Ses çok yüksek geliyor: Cihazı biraz uzaklaştırın.
        </p>
      )}
    </div>
  );
}
