import type { Drawing, Shape } from './visual-draw';

/**
 * Gelişim yol haritasının kendi grafiği: dört haftalık planın zaman çizelgesi (`timeline`). Öteki grafikler gibi basit
 * şekillere çevrilir; ekranda (components/report/item-visual.tsx) ve PDF'te (lib/pdf/simple-report.tsx) aynen çizilir
 * (lib/reports/visual-draw.ts, drawVisual).
 *
 * Haftalar soldan sağa bir hat üzerinde; her haftanın altında sırası ("1. hafta") ve kısa başlığı (başlık sütuna sığmazsa
 * haftalar alt alta). Haftanın içeriği kişinin
 * sonucuna göre seçildiyse (ör. en belirgin boyutun haftası, en çok çalışılacak konu) daire dolu, herkese aynı öneriliyorsa
 * (ör. "Fark et", "Gözden geçir") içi boş; altta lejant. Renkler tek tonludur: dolu daire bir yargı değil, yalnızca seçimin
 * kaynağıdır. Yazılar grafiğin dışına taşmaz ve birbirinin üstüne binmez (tests/yol-haritasi-grafikleri.test.ts,
 * tests/helpers/visual-check.ts).
 *
 * Bu dosya lib/reports/visuals.ts'ten ve visual-draw.ts'ten çalışma anında bir şey almaz (döngü olmasın): yazı genişliği aynı
 * formülle hesaplanır.
 */

/** Yazı genişliği tahmini: lib/reports/visuals.ts'teki textWidth ile aynı formül. */
const tw = (text: string, size: number) => text.length * size * 0.56;
const r2 = (v: number) => Math.round(v * 100) / 100;

export interface TimelineVisual {
  type: 'timeline';
  /** Grafiğin ne gösterdiği (ekran okuyucu için): "Haftaların sırası". */
  label: string;
  /** Haftalar sırayla: "1. hafta", kısa başlık ve içeriğin kişinin sonucuna göre seçilip seçilmediği. */
  steps: { label: string; title: string; result: boolean }[];
  /** Lejant: dolu ve içi boş dairenin anlamı. */
  legend: { result: string; general: string };
}

export type RoadmapKindVisual = TimelineVisual;

/** Kelimeleri `room` genişliğindeki satırlara dizer. */
function wrap(text: string, size: number, room: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && tw(next, size) > room) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Başlığın satırları ve yazı boyu: en uzun kelime sütuna sığmıyorsa yazı küçülür (okunaklı kalsın: en az %75). */
function fitTitle(text: string, fs: number, room: number): { lines: string[]; size: number } | null {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length));
  const size = r2(Math.min(fs * 0.85, room / (Math.max(1, longest) * 0.56)));
  if (size < fs * 0.75) return null;
  const lines = wrap(text, size, room);
  return lines.length <= 3 ? { lines, size } : null;
}

/**
 * Haftalar yan yana (her hafta bir sütun); bir başlık sütununa sığmıyorsa (çok uzun bir kelime ya da üçten çok satır, ör.
 * "Dürüstlük-Alçakgönüllülük") haftalar alt alta dizilir: daire solda, sırası ve başlığı yanında.
 */
export function drawTimeline(v: TimelineVisual, W: number, fs: number): Drawing {
  const n = Math.max(1, v.steps.length);
  const colW = W / n;
  const fitted = v.steps.map((s) => fitTitle(s.title, fs, colW - fs * 0.5));
  return fitted.every((f) => f) ? drawAcross(v, W, fs, fitted as { lines: string[]; size: number }[]) : drawDown(v, W, fs);
}

function node(result: boolean, x: number, y: number, r: number, fs: number): Shape {
  return result
    ? { k: 'circle', x, y, r, fill: 'fill', stroke: 'fill', sw: 1 }
    : { k: 'circle', x, y, r, fill: 'surface', stroke: 'ink3', sw: r2(Math.max(1, fs * 0.12)) };
}

function drawAcross(v: TimelineVisual, W: number, fs: number, titles: { lines: string[]; size: number }[]): Drawing {
  const shapes: Shape[] = [];
  const n = v.steps.length;
  const colW = W / n;
  const r = r2(fs * 0.5);
  const lineY = r2(r + fs * 0.25);
  const cx = (i: number) => r2(colW * (i + 0.5));
  if (n > 1) shapes.push({ k: 'line', x1: cx(0), y1: lineY, x2: cx(n - 1), y2: lineY, stroke: 'axis', sw: r2(Math.max(1, fs * 0.12)) });
  const ls = r2(fs * 0.8);
  const labelY = r2(lineY + r + fs * 1.05);
  let bottom = labelY;
  v.steps.forEach((s, i) => {
    const x = cx(i);
    shapes.push(node(s.result, x, lineY, r, fs));
    shapes.push({ k: 'text', x, y: labelY, text: s.label, size: ls, weight: 400, fill: 'ink3', anchor: 'middle' });
    const t = titles[i];
    t.lines.forEach((line, j) => {
      const y = r2(labelY + fs * 1.05 + j * t.size * 1.18);
      shapes.push({ k: 'text', x, y, text: line, size: t.size, weight: 700, fill: 'ink', anchor: 'middle' });
      bottom = Math.max(bottom, y);
    });
  });
  return legend(v, shapes, W, fs, bottom);
}

function drawDown(v: TimelineVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const r = r2(fs * 0.5);
  const x = r2(r + 1);
  const ls = r2(fs * 0.8);
  const ts = r2(fs * 0.85);
  const textX = r2(x + r + fs * 0.6);
  let y = r + 1;
  const centers: number[] = [];
  const rows = v.steps.map((s) => {
    const labelW = tw(s.label, ls) + fs * 0.5;
    const fit = wrap(s.title, ts, W - textX - labelW);
    return { s, labelW, lines: fit };
  });
  rows.forEach((row) => {
    const cy = r2(y);
    centers.push(cy);
    const base = r2(cy + ts * 0.35);
    shapes.push({ k: 'text', x: textX, y: base, text: row.s.label, size: ls, weight: 400, fill: 'ink3', anchor: 'start' });
    row.lines.forEach((line, j) =>
      shapes.push({ k: 'text', x: r2(textX + row.labelW), y: r2(base + j * ts * 1.18), text: line, size: ts, weight: 700, fill: 'ink', anchor: 'start' }),
    );
    y += Math.max(fs * 2.1, row.lines.length * ts * 1.18 + fs * 1.1);
  });
  if (centers.length > 1) shapes.unshift({ k: 'line', x1: x, y1: centers[0], x2: x, y2: centers[centers.length - 1], stroke: 'axis', sw: r2(Math.max(1, fs * 0.12)) });
  rows.forEach((row, i) => shapes.push(node(row.s.result, x, centers[i], r, fs)));
  const last = rows[rows.length - 1];
  const bottom = r2(centers[centers.length - 1] + ts * 0.35 + (last ? (last.lines.length - 1) * ts * 1.18 : 0));
  return legend(v, shapes, W, fs, bottom);
}

/** Lejant: yalnızca grafikte olan daire türleri; tek satıra sığmıyorsa iki satır. */
function legend(v: TimelineVisual, shapes: Shape[], W: number, fs: number, bottom: number): Drawing {
  const ls = r2(fs * 0.8);
  const lr = r2(ls * 0.42);
  const items = [
    ...(v.steps.some((s) => s.result) ? [{ text: v.legend.result, result: true }] : []),
    ...(v.steps.some((s) => !s.result) ? [{ text: v.legend.general, result: false }] : []),
  ];
  const width = (t: string) => lr * 2 + ls * 0.4 + tw(t, ls);
  const one = items.reduce((sum, it) => sum + width(it.text), 0) + ls * 1.3 * (items.length - 1) <= W;
  let ly = bottom + fs * 0.6 + ls;
  let lx = 0;
  items.forEach((it, i) => {
    if (i > 0) {
      if (one) lx += ls * 1.3;
      else {
        lx = 0;
        ly += ls * 1.35;
      }
    }
    shapes.push(
      it.result
        ? { k: 'circle', x: r2(lx + lr), y: r2(ly - lr * 0.9), r: lr, fill: 'fill', stroke: 'fill', sw: 1 }
        : { k: 'circle', x: r2(lx + lr), y: r2(ly - lr * 0.9), r: lr, fill: 'surface', stroke: 'ink3', sw: 1 },
    );
    shapes.push({ k: 'text', x: r2(lx + lr * 2 + ls * 0.4), y: r2(ly), text: it.text, size: ls, weight: 400, fill: 'ink2', anchor: 'start' });
    lx += width(it.text);
  });
  return { width: W, height: r2(ly + ls * 0.4), shapes };
}

/** Ekran okuyucu için grafiğin sözel karşılığı. */
export function roadmapDescription(v: RoadmapKindVisual): string {
  const steps = v.steps.map((s) => `${s.label} ${s.title} (${(s.result ? v.legend.result : v.legend.general).toLocaleLowerCase('tr-TR')})`);
  return `${v.label}: ${steps.join('; ')}.`;
}
