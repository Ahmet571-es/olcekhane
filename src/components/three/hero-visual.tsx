'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArmillaryFallback } from './armillary-fallback';
import { HERO_RINGS } from './rings';

const Armillary = dynamic(() => import('./armillary'), { ssr: false });

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Önce statik SVG çizim gösterilir (sayfanın ilk görünümü ve arama motorları için).
 * Tarayıcı boşa çıkınca ve WebGL varsa üç boyutlu küre yüklenir.
 */
export function HeroVisual() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    if (!webglAvailable()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setEnable3d(true), { timeout: 1500 });
    else window.setTimeout(() => setEnable3d(true), 600);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
        <div className={`absolute inset-0 transition-opacity duration-700 ${enable3d ? 'opacity-0' : 'opacity-100'}`}>
          <ArmillaryFallback />
        </div>
        {enable3d && <Armillary hovered={hovered} setHovered={setHovered} />}
      </div>
      <ul className="mx-auto grid w-full max-w-[34rem] grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3" aria-label="Ölçtüğümüz alanlar">
        {HERO_RINGS.map((r) => (
          <li key={r.key}>
            <Link
              href={r.href}
              onMouseEnter={() => setHovered(r.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(r.key)}
              onBlur={() => setHovered(null)}
              className={`group flex flex-col rounded-md px-2 py-1.5 no-underline transition-colors ${
                hovered === r.key ? 'bg-brass-soft' : 'hover:bg-surface-2'
              }`}
            >
              <span className="text-[0.95rem] font-bold leading-tight">{r.label}</span>
              <span className="t-meta leading-tight">{r.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
