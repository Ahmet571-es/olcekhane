'use client';

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { FRONT_LABELS_NOTE, LABEL_ALL_MAX, bars3dScene } from '@/lib/charts/bars3d';
import type { RoadmapBar } from '@/lib/reports/roadmap';

/** Başlangıç açısı: iki sütun önde, ötekiler arkada simetrik dizilir (beşgende 36°, altıgende 30°). */
const startYaw = (n: number) => 180 / Math.max(1, n);
/** Açıyı -180…180 aralığında tutar (grafik her yöne serbestçe döner). */
const wrap = (v: number) => ((((v + 180) % 360) + 360) % 360) - 180;

/**
 * Profilin üç boyutlu sütun grafiği. Yalnızca kişi sürükleyince ya da düğmelere basınca döner; kendiliğinden hareket
 * etmez (test ve rapor ekranları sade kalır). Değerlerin kesin okunması için altında sayılarla bir açıklama, raporda
 * da düz cetveller bulunur.
 */
export function Profile3D({ bars, you, note }: { bars: RoadmapBar[]; you: boolean; note?: string }) {
  const [yaw, setYaw] = useState(() => startYaw(bars.length));
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const scene = useMemo(
    () =>
      bars3dScene(
        bars.map((b) => ({ ...b, valueLabel: b.valueLabel.split(' / ')[0] })),
        { yaw, width: 560, height: 420, floor: { top: 'var(--surface-2)', side: 'var(--rule)', stroke: 'var(--rule-strong)' }, band: 'var(--brass)' },
      ),
    [bars, yaw],
  );

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    drag.current = { x: e.clientX, yaw };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    setYaw(wrap(drag.current.yaw + (e.clientX - drag.current.x) * 0.6));
  };
  const onUp = () => {
    drag.current = null;
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowLeft') setYaw((y) => wrap(y - 15));
    else if (e.key === 'ArrowRight') setYaw((y) => wrap(y + 15));
    else return;
    e.preventDefault();
  };
  const summary = bars.map((b) => `${b.label}: ${b.valueLabel}${b.band ? `, ${b.band}` : ''}`).join('; ');

  return (
    <figure className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-rule bg-surface">
        <svg
          viewBox={`0 0 ${scene.width} ${scene.height}`}
          className="block h-auto w-full cursor-grab touch-pan-y select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus active:cursor-grabbing"
          role="img"
          aria-label={`Üç boyutlu profil grafiği. ${summary}`}
          tabIndex={0}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          {scene.polys.map((p, i) => (
            <polygon
              key={i}
              points={p.points}
              style={{ fill: p.fill, stroke: p.stroke, fillOpacity: p.opacity, strokeOpacity: p.opacity === undefined ? 0.6 : 0.8 }}
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          ))}
          {scene.labels.map((l) => (
            <text
              key={l.key}
              x={l.x}
              y={l.y}
              textAnchor="middle"
              className="fill-ink font-bold tabular"
              fontSize={20}
              style={{ paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: 4, strokeLinejoin: 'round' }}
            >
              {l.text}
            </text>
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-secondary min-h-10 px-4" onClick={() => setYaw((y) => wrap(y - 36))} aria-label="Grafiği sola döndür">
          ← Döndür
        </button>
        <button type="button" className="btn btn-secondary min-h-10 px-4" onClick={() => setYaw((y) => wrap(y + 36))} aria-label="Grafiği sağa döndür">
          Döndür →
        </button>
        <button type="button" className="btn btn-quiet min-h-10" onClick={() => setYaw(startYaw(bars.length))}>
          Başa dön
        </button>
      </div>
      <figcaption className="flex flex-col gap-3">
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {bars.map((b) => (
            <li key={b.key} className="flex items-baseline gap-2.5">
              <span className="size-3 shrink-0 translate-y-0.5 rounded-sm" style={{ background: b.color }} aria-hidden="true" />
              {/* Ad, puan ve düzey yazı gibi akar: uzun bir ad iki satıra bölünse de puan adın hemen ardından gelir. */}
              <span className="min-w-0">
                <span className="font-bold">{b.label}</span>{' '}
                <span className="tabular whitespace-nowrap text-ink-2">{b.valueLabel}</span>{' '}
                <span className="t-small whitespace-nowrap text-ink-3">{b.band}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="t-meta">
          {note ??
            (bars.some((b) => b.ciLow !== null && b.ciHigh !== null)
              ? 'Sütunun yüksekliği puanı, sarı kılıf ölçüm payını gösterir.'
              : 'Sütunun yüksekliği puanı gösterir.')}{' '}
          {bars.length > LABEL_ALL_MAX && `${FRONT_LABELS_NOTE} `}
          Grafiği {you ? 'parmağınla ya da fareyle' : 'parmağınızla ya da fareyle'}{' '}
          sürükleyerek döndürebilir{you ? 'sin' : 'siniz'}.
        </p>
      </figcaption>
    </figure>
  );
}
