import { expect } from 'vitest';
import { drawVisual, isDrawn, textBox, type Shape } from '@/lib/reports/visual-draw';
import { visualDescription, type ItemVisual } from '@/lib/reports/visuals';

/** Ekrandaki ve PDF'teki çizim boyutları (components/report/item-visual.tsx, lib/pdf/simple-report.tsx). */
export const VISUAL_SIZES = [
  { width: 240, font: 10 },
  { width: 176, font: 7 },
];

/**
 * Görev testlerinin kart grafiği: şekiller grafiğin içinde kalır; yazılar taşmaz, birbirinin üstüne binmez ve okunaklıdır
 * (en az yazı boyunun %70'i); ekran okuyucu metninde eksik değer yoktur.
 */
export function checkDrawn(v: ItemVisual, label: string) {
  expect(visualDescription(v), label).not.toMatch(/undefined|NaN|Infinity/);
  if (!isDrawn(v)) return;
  for (const { width, font } of VISUAL_SIZES) {
    const d = drawVisual(v, width, font);
    const at = `${label} (${width})`;
    expect(Number.isFinite(d.height) && d.height > 0, at).toBe(true);
    const texts: Extract<Shape, { k: 'text' }>[] = [];
    for (const s of d.shapes) {
      if (s.k === 'text') {
        texts.push(s);
        expect(s.text, at).not.toMatch(/undefined|NaN|Infinity/);
        expect(s.size, `${at}: ${s.text}`).toBeGreaterThanOrEqual(font * 0.7);
        const b = textBox(s);
        expect(b.left, `${at}: ${s.text}`).toBeGreaterThanOrEqual(-0.5);
        expect(b.right, `${at}: ${s.text}`).toBeLessThanOrEqual(width + 0.5);
        expect(b.top, `${at}: ${s.text}`).toBeGreaterThanOrEqual(-0.5);
        expect(b.bottom, `${at}: ${s.text}`).toBeLessThanOrEqual(d.height + 0.5);
      } else if (s.k === 'rect') {
        for (const n of [s.x, s.y, s.w, s.h]) expect(Number.isFinite(n), at).toBe(true);
        expect(s.x, at).toBeGreaterThanOrEqual(-0.5);
        expect(s.x + s.w, at).toBeLessThanOrEqual(width + 0.5);
        expect(s.y, at).toBeGreaterThanOrEqual(-0.5);
        expect(s.y + s.h, at).toBeLessThanOrEqual(d.height + 0.5);
      } else if (s.k === 'circle') {
        expect(s.x - s.r, at).toBeGreaterThanOrEqual(-0.5);
        expect(s.x + s.r, at).toBeLessThanOrEqual(width + 0.5);
        expect(s.y - s.r, at).toBeGreaterThanOrEqual(-0.5);
        expect(s.y + s.r, at).toBeLessThanOrEqual(d.height + 0.5);
      } else if (s.k === 'line') {
        for (const n of [s.x1, s.x2]) expect(n >= -0.5 && n <= width + 0.5, at).toBe(true);
        for (const n of [s.y1, s.y2]) expect(n >= -0.5 && n <= d.height + 0.5, at).toBe(true);
      }
    }
    const boxes = texts.map((t) => ({ t, ...textBox(t) }));
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const apart = a.right <= b.left + 0.3 || b.right <= a.left + 0.3 || a.bottom <= b.top + 0.3 || b.bottom <= a.top + 0.3;
        expect(apart, `${at}: “${a.t.text}” / “${b.t.text}”`).toBe(true);
      }
    }
  }
}
