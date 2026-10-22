import {
  textWidth,
  type BarsVisual,
  type ColumnsVisual,
  type DotsVisual,
  type ItemVisual,
  type LadderVisual,
  type StackVisual,
  type StepsVisual,
  type StripVisual,
} from './visuals';

/**
 * Görev testlerinin kart grafiklerinin çizimi (lib/reports/visuals.ts'teki türler). Her grafik basit şekillere çevrilir;
 * ekran (components/report/item-visual.tsx) ve PDF (lib/pdf/simple-report.tsx) bu şekilleri aynen çizer, yalnızca renk
 * adlarını kendi renklerine çevirir. Ölçüler yazı boyuna (`fs`) göredir: ekranda 240 genişlik ve 10 yazı boyu, PDF'te 176
 * ve 7. Yazılar grafiğin dışına taşmaz ve birbirinin üstüne binmez (tests/kart-grafikleri.test.ts denetler).
 */

/**
 * Renk adları. `fill`: kişinin sonucu (pirinç), `soft`: açık pirinç (vurgulu aralık), `track` ve `track2`: boş yer ve
 * bölgeler (iki gri ton), `axis`: eksen çizgisi, `marker`: tipik değer ya da puan işareti (kırmızı), `surface`: zemin.
 */
export type Tone = 'fill' | 'soft' | 'track' | 'track2' | 'ink' | 'ink2' | 'ink3' | 'axis' | 'marker' | 'surface';

export type Shape =
  | { k: 'rect'; x: number; y: number; w: number; h: number; r: number; fill: Tone; stroke?: Tone; sw?: number }
  | { k: 'circle'; x: number; y: number; r: number; fill: Tone; stroke?: Tone; sw?: number }
  | { k: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: Tone; sw: number; dash?: boolean }
  | { k: 'path'; d: string; fill: Tone }
  | { k: 'text'; x: number; y: number; text: string; size: number; weight: 400 | 600 | 700; fill: Tone; anchor: 'start' | 'middle' | 'end' };

export interface Drawing {
  width: number;
  height: number;
  shapes: Shape[];
}

export type DrawnVisual = DotsVisual | BarsVisual | StackVisual | StepsVisual | ColumnsVisual | StripVisual | LadderVisual;

export const isDrawn = (v: ItemVisual): v is DrawnVisual => v.type !== 'gauge' && v.type !== 'compare';

const r2 = (v: number) => Math.round(v * 100) / 100;
const nfAxis = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
/** Eksendeki sayı (en çok iki ondalık: 0,25 sn). */
const axisNum = (v: number) => nfAxis.format(Math.round(v * 100) / 100);

/** Yazının kapladığı kutu (taban çizgisine göre: harflerin üstü ~0,8, altı ~0,25 yazı boyu). */
export function textBox(t: Extract<Shape, { k: 'text' }>) {
  const w = textWidth(t.text, t.size);
  const left = t.anchor === 'start' ? t.x : t.anchor === 'end' ? t.x - w : t.x - w / 2;
  return { left, right: left + w, top: t.y - t.size * 0.8, bottom: t.y + t.size * 0.25 };
}

/** Yazıyı verilen noktaya ortalar; grafiğin kenarından taşacaksa kenara yaslar. */
function centered(text: string, x: number, size: number, W: number): { x: number; anchor: 'start' | 'middle' | 'end' } {
  const w = textWidth(text, size);
  if (x - w / 2 < 0) return { x: 0, anchor: 'start' };
  if (x + w / 2 > W) return { x: W, anchor: 'end' };
  return { x, anchor: 'middle' };
}

/** Uzun adı iki satıra böler (satırların uzunlukları en yakın olacak boşluktan). */
function twoLines(label: string): [string, string] | [string] {
  const words = label.split(' ');
  if (words.length < 2) return [label];
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) {
      best = i;
      bestDiff = diff;
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

/**
 * Bir satırdaki ad: `room` genişliğine tam boyda sığmıyorsa en çok %20 küçülür; yine sığmıyorsa iki satıra bölünür (iki
 * satırın her biri yine sığmazsa satırlar küçülür; okunaklı kalması için en az yazı boyunun %75'i).
 */
function fitLabel(label: string, fs: number, room: number): { lines: string[]; size: number } {
  if (textWidth(label, fs) <= room) return { lines: [label], size: fs };
  if (textWidth(label, fs * 0.8) <= room) return { lines: [label], size: r2(room / (label.length * 0.56)) };
  const lines = twoLines(label);
  const longest = Math.max(...lines.map((l) => l.length));
  return { lines, size: r2(Math.max(fs * 0.75, Math.min(fs * 0.92, room / (longest * 0.56)))) };
}

/** Eksenin en çoğu: değerin biraz üstündeki yuvarlak sayı (1, 2, 2,5, 5 ve 10'un katları). */
export function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (v <= m * p + 1e-9) return m * p;
  return 10 * p;
}

/* ---------- Satır satır kareler ---------- */

function drawDots(v: DotsVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const s = r2(fs * 0.9);
  const g = r2(Math.max(1.4, fs * 0.25));
  const step = s + g;
  const valueW = Math.max(...v.rows.map((r) => textWidth(r.valueLabel, fs)));
  const labelW = Math.max(...v.rows.map((r) => textWidth(r.label, fs)));
  // Adlar kısaysa (ör. "1. düzey") karelerin solunda, uzunsa karelerin üstünde yazılır.
  const inline = labelW <= W * 0.34;
  let y = fs * 0.15;
  for (const r of v.rows) {
    if (inline) {
      const x0 = labelW + fs * 0.6;
      const per = Math.max(1, Math.floor((W - x0 - valueW - fs * 0.6 + g) / step));
      const lines = Math.ceil(r.total / per);
      const ty = y + s / 2 + fs * 0.35;
      shapes.push({ k: 'text', x: 0, y: ty, text: r.label, size: fs, weight: 600, fill: 'ink', anchor: 'start' });
      shapes.push({ k: 'text', x: W, y: ty, text: r.valueLabel, size: fs, weight: 700, fill: 'ink', anchor: 'end' });
      for (let i = 0; i < r.total; i++) {
        shapes.push({ k: 'rect', x: r2(x0 + (i % per) * step), y: r2(y + Math.floor(i / per) * step), w: s, h: s, r: r2(s * 0.2), fill: i < r.filled ? 'fill' : 'track2' });
      }
      y += Math.max(s, lines * step - g) + fs * 0.6;
    } else {
      const label = fitLabel(r.label, fs, W - valueW - fs);
      label.lines.forEach((line, i) =>
        shapes.push({ k: 'text', x: 0, y: r2(y + fs * 0.8 + i * label.size * 1.15), text: line, size: label.size, weight: 600, fill: 'ink', anchor: 'start' }),
      );
      shapes.push({ k: 'text', x: W, y: r2(y + fs * 0.8), text: r.valueLabel, size: fs, weight: 700, fill: 'ink', anchor: 'end' });
      const top = y + fs * 0.8 + (label.lines.length - 1) * label.size * 1.15 + fs * 0.45;
      const per = Math.max(1, Math.floor((W + g) / step));
      const lines = Math.ceil(r.total / per);
      for (let i = 0; i < r.total; i++) {
        shapes.push({ k: 'rect', x: r2((i % per) * step), y: r2(top + Math.floor(i / per) * step), w: s, h: s, r: r2(s * 0.2), fill: i < r.filled ? 'fill' : 'track2' });
      }
      y = top + lines * step - g + fs * 0.7;
    }
  }
  // Lejant: dolu ve boş karenin anlamı; tek satıra sığmıyorsa iki satır.
  const ls = r2(fs * 0.85);
  const sw = r2(ls * 0.95);
  const item = (text: string) => sw + ls * 0.45 + textWidth(text, ls);
  const one = item(v.legend[0]) + ls * 1.4 + item(v.legend[1]) <= W;
  y += fs * 0.25;
  const place = (text: string, tone: Tone, x: number, base: number) => {
    shapes.push({ k: 'rect', x: r2(x), y: r2(base - sw * 0.85), w: sw, h: sw, r: r2(sw * 0.2), fill: tone });
    shapes.push({ k: 'text', x: r2(x + sw + ls * 0.45), y: r2(base), text, size: ls, weight: 400, fill: 'ink2', anchor: 'start' });
  };
  const b1 = y + ls;
  place(v.legend[0], 'fill', 0, b1);
  if (one) {
    place(v.legend[1], 'track2', item(v.legend[0]) + ls * 1.4, b1);
    return { width: W, height: r2(b1 + ls * 0.4), shapes };
  }
  const b2 = b1 + ls * 1.35;
  place(v.legend[1], 'track2', 0, b2);
  return { width: W, height: r2(b2 + ls * 0.4), shapes };
}

/* ---------- Çubuklar ---------- */

function drawBars(v: BarsVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const axisMax = v.scale === 'scale' ? (v.max ?? niceMax(Math.max(...v.rows.map((r) => r.value)))) : 1;
  const trackH = r2(fs * 0.7);
  let y = 0;
  const tracks: number[] = [];
  for (const r of v.rows) {
    const valueW = textWidth(r.valueLabel, fs);
    const label = fitLabel(r.label, fs, W - valueW - fs);
    label.lines.forEach((line, i) =>
      shapes.push({ k: 'text', x: 0, y: r2(y + fs * 0.85 + i * label.size * 1.15), text: line, size: label.size, weight: 600, fill: 'ink', anchor: 'start' }),
    );
    shapes.push({ k: 'text', x: W, y: r2(y + fs * 0.85), text: r.valueLabel, size: fs, weight: 700, fill: 'ink', anchor: 'end' });
    const ty = r2(y + fs * 0.85 + (label.lines.length - 1) * label.size * 1.15 + fs * 0.5);
    const share = v.scale === 'share' ? (r.max ? r.value / r.max : 0) : r.value / axisMax;
    shapes.push({ k: 'rect', x: 0, y: ty, w: W, h: trackH, r: r2(trackH / 2), fill: 'track' });
    const fw = r2(Math.max(0, Math.min(1, share)) * W);
    if (fw > 0) shapes.push({ k: 'rect', x: 0, y: ty, w: Math.max(fw, trackH), h: trackH, r: r2(trackH / 2), fill: 'fill' });
    tracks.push(ty);
    y = ty + trackH + fs * 0.75;
  }
  if (v.scale === 'share') return { width: W, height: r2(y - fs * 0.5), shapes };
  // Ortak eksen: 0, yarısı ve en çoğu; birim son sayının yanında.
  const ts = r2(fs * 0.85);
  const axisY = r2(y - fs * 0.3);
  shapes.push({ k: 'line', x1: 0, y1: axisY, x2: W, y2: axisY, stroke: 'axis', sw: 0.8 });
  const unit = v.unit ? (v.unit === '°' ? '°' : ` ${v.unit}`) : '';
  const ticks = [0, axisMax / 2, axisMax];
  ticks.forEach((t, i) => {
    const x = (t / axisMax) * W;
    shapes.push({ k: 'line', x1: r2(x), y1: axisY, x2: r2(x), y2: r2(axisY + fs * 0.3), stroke: 'axis', sw: 0.8 });
    shapes.push({
      k: 'text',
      x: r2(i === 0 ? 0 : i === 2 ? W : x),
      y: r2(axisY + fs * 1.2),
      text: `${axisNum(t)}${i === 2 || unit === '°' ? unit : ''}`,
      size: ts,
      weight: 400,
      fill: 'ink3',
      anchor: i === 0 ? 'start' : i === 2 ? 'end' : 'middle',
    });
  });
  let height = axisY + fs * 1.55;
  if (v.reference) {
    const rx = r2((Math.min(axisMax, v.reference.value) / axisMax) * W);
    shapes.push({ k: 'line', x1: rx, y1: r2(tracks[0] - fs * 0.25), x2: rx, y2: axisY, stroke: 'ink2', sw: 1, dash: true });
    const at = centered(v.reference.label, rx, ts, W);
    shapes.push({ k: 'text', x: r2(at.x), y: r2(axisY + fs * 2.45), text: v.reference.label, size: ts, weight: 400, fill: 'ink2', anchor: at.anchor });
    height = axisY + fs * 2.8;
  }
  return { width: W, height: r2(height), shapes };
}

/* ---------- Bir bütünün parçaları ---------- */

const STACK_TONES: Tone[] = ['fill', 'soft', 'track2', 'ink3'];

function drawStack(v: StackVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const barH = r2(fs * 1.3);
  const total = Math.max(1, v.total);
  let x = 0;
  shapes.push({ k: 'rect', x: 0, y: 0, w: W, h: barH, r: 2, fill: 'track' });
  v.parts.forEach((p, i) => {
    if (p.value <= 0) return;
    const w = (p.value / total) * W;
    const tone = STACK_TONES[i % STACK_TONES.length];
    shapes.push({ k: 'rect', x: r2(x), y: 0, w: r2(Math.max(1, w - 0.8)), h: barH, r: 1.5, fill: tone, ...(tone === 'soft' ? { stroke: 'fill' as Tone, sw: 0.9 } : {}) });
    x += w;
  });
  const ls = r2(fs * 0.9);
  const sw = r2(ls * 0.95);
  let y = barH + fs * 0.6;
  v.parts.forEach((p, i) => {
    const base = y + ls;
    const tone = STACK_TONES[i % STACK_TONES.length];
    shapes.push({ k: 'rect', x: 0, y: r2(base - sw * 0.85), w: sw, h: sw, r: r2(sw * 0.2), fill: tone, ...(tone === 'soft' ? { stroke: 'fill' as Tone, sw: 0.9 } : {}) });
    const label = fitLabel(p.label, ls, W - sw - ls * 0.5 - textWidth(String(p.value), ls) - ls);
    label.lines.forEach((line, j) =>
      shapes.push({ k: 'text', x: r2(sw + ls * 0.5), y: r2(base + j * label.size * 1.15), text: line, size: label.size, weight: 400, fill: 'ink2', anchor: 'start' }),
    );
    shapes.push({ k: 'text', x: W, y: r2(base), text: String(p.value), size: ls, weight: 700, fill: 'ink', anchor: 'end' });
    y = base + (label.lines.length - 1) * label.size * 1.15 + ls * 0.45;
  });
  return { width: W, height: r2(y + ls * 0.1), shapes };
}

/* ---------- Basamaklar ---------- */

function drawSteps(v: StepsVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const n = v.steps.length;
  const gap = r2(fs * 0.35);
  const colW = (W - gap * (n - 1)) / n;
  const top = fs * 1.9;
  const maxH = fs * 4.2;
  const base = top + maxH;
  for (let i = 0; i < n; i++) {
    const h = (maxH * (i + 1)) / n;
    const x = i * (colW + gap);
    const on = i < v.reached;
    shapes.push({ k: 'rect', x: r2(x), y: r2(base - h), w: r2(colW), h: r2(h), r: 1.5, fill: on ? 'fill' : 'track2' });
    shapes.push({ k: 'text', x: r2(x + colW / 2), y: r2(base + fs * 1.1), text: v.steps[i], size: r2(fs * 0.85), weight: i === v.reached - 1 ? 700 : 400, fill: i === v.reached - 1 ? 'ink' : 'ink3', anchor: 'middle' });
  }
  if (v.reached > 0) {
    const i = v.reached - 1;
    const h = (maxH * (i + 1)) / n;
    const cx = i * (colW + gap) + colW / 2;
    const ty = base - h - fs * 0.25;
    shapes.push({ k: 'path', d: `M${r2(cx - fs * 0.4)} ${r2(ty - fs * 0.45)} L${r2(cx + fs * 0.4)} ${r2(ty - fs * 0.45)} L${r2(cx)} ${r2(ty)} Z`, fill: 'marker' });
    const at = centered(v.valueLabel, cx, fs, W);
    shapes.push({ k: 'text', x: r2(at.x), y: r2(ty - fs * 0.7), text: v.valueLabel, size: fs, weight: 700, fill: 'ink', anchor: at.anchor });
  } else {
    shapes.push({ k: 'text', x: 0, y: r2(fs * 0.9), text: v.valueLabel, size: fs, weight: 700, fill: 'ink2', anchor: 'start' });
  }
  const cs = r2(fs * 0.85);
  shapes.push({ k: 'text', x: 0, y: r2(base + fs * 2.35), text: v.caption, size: cs, weight: 400, fill: 'ink3', anchor: 'start' });
  return { width: W, height: r2(base + fs * 2.7), shapes };
}

/* ---------- Sütunlar ---------- */

function drawColumns(v: ColumnsVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const n = v.rows.length;
  const slot = W / n;
  const bw = Math.min(slot * 0.56, fs * 3.2);
  const top = fs * 1.4;
  const chartH = fs * 4.6;
  const base = top + chartH;
  const max = Math.max(v.max, ...v.rows.map((r) => r.value), 1e-9);
  const vs = r2(fs * 0.92);
  const ls = r2(fs * 0.85);
  shapes.push({ k: 'line', x1: 0, y1: r2(base), x2: W, y2: r2(base), stroke: 'axis', sw: 0.8 });
  let lines = 1;
  v.rows.forEach((r, i) => {
    const cx = i * slot + slot / 2;
    const h = (Math.max(0, r.value) / max) * chartH;
    shapes.push({ k: 'rect', x: r2(cx - bw / 2), y: r2(base - h), w: r2(bw), h: r2(Math.max(0.6, h)), r: 1.5, fill: 'fill' });
    shapes.push({ k: 'text', x: r2(cx), y: r2(base - h - fs * 0.35), text: r.valueLabel, size: vs, weight: 700, fill: 'ink', anchor: 'middle' });
    const label = fitLabel(r.label, ls, slot - fs * 0.35);
    lines = Math.max(lines, label.lines.length);
    label.lines.forEach((line, j) =>
      shapes.push({ k: 'text', x: r2(cx), y: r2(base + fs * 1.05 + j * label.size * 1.15), text: line, size: label.size, weight: 400, fill: 'ink2', anchor: 'middle' }),
    );
  });
  let y = base + fs * 1.05 + (lines - 1) * ls * 1.15 + fs * 0.3;
  if (v.caption) {
    y += ls * 1.2;
    shapes.push({ k: 'text', x: 0, y: r2(y), text: v.caption, size: ls, weight: 400, fill: 'ink3', anchor: 'start' });
  }
  return { width: W, height: r2(y + ls * 0.35), shapes };
}

/* ---------- Nokta şeridi ---------- */

/** Eksendeki sayılar: uçlar ve aradaki yuvarlak sayılar (1, 2, 5 ve 10'un katları; açılarda 45 ve 90 derece). */
function stripTicks(min: number, max: number, unit: string): number[] {
  const span = max - min;
  const base = 10 ** Math.floor(Math.log10(span) - 1);
  const steps = unit === '°' ? [15, 30, 45, 90] : [1, 2, 5, 10, 20, 50].map((m) => m * base);
  const step = steps.find((s) => span / s <= 4) ?? span / 2;
  const out = [min];
  for (let t = Math.ceil((min + 1e-9) / step) * step; t < max - 1e-9; t += step) out.push(Math.round(t * 1000) / 1000);
  out.push(max);
  return out;
}

function drawStrip(v: StripVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const pad = fs * 0.5;
  const span = v.max - v.min || 1;
  const x = (val: number) => pad + ((Math.min(v.max, Math.max(v.min, val)) - v.min) / span) * (W - 2 * pad);
  const yTop = fs * 1.75;
  const plotH = v.points.length ? fs * 2.6 : fs * 1.6;
  const axisY = yTop + plotH;
  if (v.zone) {
    const zx = x(v.zone.from);
    shapes.push({ k: 'rect', x: r2(zx), y: r2(yTop - fs * 0.2), w: r2(Math.max(1, x(v.zone.to) - zx)), h: r2(plotH + fs * 0.2), r: 1.5, fill: 'soft' });
  }
  if (v.box) {
    const bx = x(v.box.low);
    shapes.push({ k: 'rect', x: r2(bx), y: r2(axisY - fs * 1.3), w: r2(Math.max(1.5, x(v.box.high) - bx)), h: r2(fs * 1.0), r: 1.5, fill: 'soft', stroke: 'fill', sw: 0.9 });
  }
  if (v.reference) {
    const rx = r2(x(v.reference.value));
    shapes.push({ k: 'line', x1: rx, y1: r2(yTop - fs * 0.2), x2: rx, y2: r2(axisY), stroke: 'ink2', sw: 1, dash: true });
  }
  // Noktalar: üst üste gelenler yukarı doğru dizilir.
  const pr = r2(fs * 0.33);
  const levels = Math.max(1, Math.floor((plotH - fs * 0.3) / (2 * pr + 0.8)));
  const placed: { x: number; level: number }[] = [];
  for (const p of [...v.points].sort((a, b) => a - b)) {
    const px = x(p);
    let level = 0;
    while (level < levels - 1 && placed.some((q) => q.level === level && Math.abs(q.x - px) < 2 * pr + 0.6)) level++;
    placed.push({ x: px, level });
    shapes.push({ k: 'circle', x: r2(px), y: r2(axisY - pr - 1 - level * (2 * pr + 0.8)), r: pr, fill: 'ink3', stroke: 'surface', sw: 0.6 });
  }
  shapes.push({ k: 'line', x1: 0, y1: r2(axisY), x2: W, y2: r2(axisY), stroke: 'axis', sw: 0.8 });
  if (v.marker) {
    const mx = r2(x(v.marker.value));
    shapes.push({ k: 'line', x1: mx, y1: r2(yTop - fs * 0.15), x2: mx, y2: r2(axisY + fs * 0.2), stroke: 'marker', sw: 1.8 });
    const at = centered(v.marker.label, mx, fs, W);
    shapes.push({ k: 'text', x: r2(at.x), y: r2(yTop - fs * 0.5), text: v.marker.label, size: fs, weight: 700, fill: 'ink', anchor: at.anchor });
  }
  const ts = r2(fs * 0.85);
  const unit = v.unit === '°' ? '°' : ` ${v.unit}`;
  const ticks = stripTicks(v.min, v.max, v.unit);
  ticks.forEach((t, i) => {
    const tx = x(t);
    shapes.push({ k: 'line', x1: r2(tx), y1: r2(axisY), x2: r2(tx), y2: r2(axisY + fs * 0.3), stroke: 'axis', sw: 0.8 });
    const last = i === ticks.length - 1;
    const text = `${axisNum(t)}${last || v.unit === '°' ? unit : ''}`;
    const at = i === 0 ? { x: 0, anchor: 'start' as const } : last ? { x: W, anchor: 'end' as const } : centered(text, tx, ts, W);
    shapes.push({ k: 'text', x: r2(at.x), y: r2(axisY + fs * 1.2), text, size: ts, weight: 400, fill: 'ink3', anchor: at.anchor });
  });
  // Altta: vurgulu aralığın ve kesikli çizginin adları (çakışırlarsa ayrı satırlarda).
  let y = axisY + fs * 1.2;
  const notes = [
    ...(v.zone ? [{ text: v.zone.label, at: (x(v.zone.from) + x(v.zone.to)) / 2 }] : []),
    ...(v.reference ? [{ text: v.reference.label, at: x(v.reference.value) }] : []),
  ];
  let prev: { left: number; right: number } | null = null;
  for (const n of notes) {
    const at = centered(n.text, n.at, ts, W);
    const w = textWidth(n.text, ts);
    const left = at.anchor === 'start' ? at.x : at.anchor === 'end' ? at.x - w : at.x - w / 2;
    const clash = prev && !(left >= prev.right + fs * 0.5 || left + w <= prev.left - fs * 0.5);
    if (!prev || clash) y += ts * 1.35;
    shapes.push({ k: 'text', x: r2(at.x), y: r2(y), text: n.text, size: ts, weight: 400, fill: 'ink2', anchor: at.anchor });
    prev = { left, right: left + w };
  }
  return { width: W, height: r2(y + ts * 0.4), shapes };
}

/* ---------- Dizi merdiveni ---------- */

function drawLadder(v: LadderVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const n = v.rows.length;
  const slot = W / n;
  const trials = Math.max(1, ...v.rows.map((r) => r.results.length));
  const cr = r2(Math.min(fs * 0.55, slot * 0.3));
  const vgap = fs * 0.35;
  const top = fs * 1.75;
  const colH = trials * (2 * cr + vgap) - vgap;
  const ls = r2(fs * 0.85);
  const labelY = top + colH + fs * 1.15;
  v.rows.forEach((r, i) => {
    const cx = i * slot + slot / 2;
    const on = r.length === v.reached;
    if (on) shapes.push({ k: 'rect', x: r2(i * slot + 1), y: r2(top - fs * 0.35), w: r2(slot - 2), h: r2(colH + fs * 1.8), r: 2, fill: 'soft' });
    r.results.forEach((ok, j) => {
      shapes.push({ k: 'circle', x: r2(cx), y: r2(top + cr + j * (2 * cr + vgap)), r: cr, fill: ok ? 'fill' : 'surface', stroke: ok ? 'fill' : 'ink3', sw: 1 });
    });
    // Sorulmayan uzunluk (görev daha kısa bir dizide bitti): soluk daireler.
    if (!r.results.length) {
      for (let j = 0; j < trials; j++) shapes.push({ k: 'circle', x: r2(cx), y: r2(top + cr + j * (2 * cr + vgap)), r: r2(cr * 0.7), fill: 'track' });
    }
    shapes.push({ k: 'text', x: r2(cx), y: r2(labelY), text: String(r.length), size: ls, weight: on ? 700 : 400, fill: on ? 'ink' : 'ink3', anchor: 'middle' });
  });
  if (v.reached !== null) {
    const i = v.rows.findIndex((r) => r.length === v.reached);
    const text = `En uzun: ${v.reached} ${v.unit}`;
    const at = centered(text, i * slot + slot / 2, fs, W);
    shapes.push({ k: 'text', x: r2(at.x), y: r2(top - fs * 0.75), text, size: fs, weight: 700, fill: 'ink', anchor: at.anchor });
  }
  const capY = labelY + ls * 1.5;
  shapes.push({ k: 'text', x: 0, y: r2(capY), text: `Dizideki ${v.unit} sayısı`, size: ls, weight: 400, fill: 'ink3', anchor: 'start' });
  // Lejant: dolu ve boş daire.
  const [yes, no] = v.legend ?? ['doğru', 'yanlış'];
  const legendY = capY + ls * 1.45;
  const lr = r2(ls * 0.42);
  shapes.push({ k: 'circle', x: lr, y: r2(legendY - lr * 0.9), r: lr, fill: 'fill', stroke: 'fill', sw: 1 });
  shapes.push({ k: 'text', x: r2(lr * 2 + ls * 0.4), y: r2(legendY), text: yes, size: ls, weight: 400, fill: 'ink2', anchor: 'start' });
  const x2 = lr * 2 + ls * 0.4 + textWidth(yes, ls) + ls * 1.3;
  shapes.push({ k: 'circle', x: r2(x2 + lr), y: r2(legendY - lr * 0.9), r: lr, fill: 'surface', stroke: 'ink3', sw: 1 });
  shapes.push({ k: 'text', x: r2(x2 + lr * 2 + ls * 0.4), y: r2(legendY), text: no, size: ls, weight: 400, fill: 'ink2', anchor: 'start' });
  if (v.rows.some((r) => !r.results.length)) {
    const x3 = x2 + lr * 2 + ls * 0.4 + textWidth(no, ls) + ls * 1.3;
    shapes.push({ k: 'circle', x: r2(x3 + lr), y: r2(legendY - lr * 0.9), r: r2(lr * 0.7), fill: 'track' });
    shapes.push({ k: 'text', x: r2(x3 + lr * 2 + ls * 0.4), y: r2(legendY), text: 'sorulmadı', size: ls, weight: 400, fill: 'ink2', anchor: 'start' });
  }
  return { width: W, height: r2(legendY + ls * 0.4), shapes };
}

export function drawVisual(v: DrawnVisual, width: number, fontSize: number): Drawing {
  switch (v.type) {
    case 'dots':
      return drawDots(v, width, fontSize);
    case 'bars':
      return drawBars(v, width, fontSize);
    case 'stack':
      return drawStack(v, width, fontSize);
    case 'steps':
      return drawSteps(v, width, fontSize);
    case 'columns':
      return drawColumns(v, width, fontSize);
    case 'strip':
      return drawStrip(v, width, fontSize);
    case 'ladder':
      return drawLadder(v, width, fontSize);
  }
}
