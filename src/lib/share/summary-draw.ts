import { quadrantGeometry } from '@/lib/reports/simple';
import { drawVisual, type Tone } from '@/lib/reports/visual-draw';
import { compareGeometry, gaugeGeometry, type ItemVisual } from '@/lib/reports/visuals';
import { SHARE_COLORS } from './card';
import { SHARE_C as C, clip, drawLogo, fit, rgba, rounded, setFont, wrap, type Ctx, type Family } from './draw';
import {
  SUMMARY_FOOTER,
  SUMMARY_KICKER,
  SUMMARY_META,
  SUMMARY_PILOT,
  SUMMARY_W,
  moreCardsLine,
  moreCautionsLine,
  type ReportSummary,
  type SummaryCard,
  type SummaryChart,
} from './summary';

/**
 * Özet görselin çizimi (1080 piksel genişlik; yükseklik içeriğe göre). Yalnızca tarayıcıda, bir tuval (canvas) üzerinde
 * çalışır; görsel cihazdan çıkmaz. Sırayla: başlık (testin adı, isteğe bağlı ad, pusula süslemesi ve testin çizimi), rapor
 * bilgileri, (varsa) uyarı, öne çıkan sayılar, raporun grafiği, kartlar (rapordaki grafikleriyle), "Kısaca", öneri başlıkları,
 * haftalık adımlar ve alt not. Kartların grafikleri raporla aynı geometriden çizilir (lib/reports/visuals.ts, visual-draw.ts).
 * Renkler sitenin açık temasıdır; grafikler rapordaki gibi tek tonludur (pirinç: kişinin sonucu, kırmızı işaret: puan).
 */

export interface SummaryOptions {
  /** "olcekhane.com". */
  host: string;
  /** Kişinin yazdığı ad (boşsa yazılmaz). Yalnızca cihazda görsele basılır. */
  name: string;
  /** Testin çizimi (galerideki amblem); yoksa Ölçekhane işareti çizilir. */
  emblem?: CanvasImageSource | null;
  /** Görselin yüksekliği: verilirse zemin çizilir (ilk geçişte yükseklik ölçülür, ikincisinde çizilir). */
  height?: number;
}

const M = 48;
const GAP = 26;
const PAD = 30;
const IW = SUMMARY_W - 2 * M;
const SOFT = '#f6f8fb';
const BRASS_SOFT = '#f3e7cf';
const TRACK = '#dde3eb';
const WARN = '#8a5300';
const WARN_BG = '#fbefd9';

/** Rapor grafiklerindeki renk adlarının açık temadaki karşılıkları (components/report/item-visual.tsx ile aynı). */
const TONES: Record<Tone, string> = {
  fill: C.brass,
  soft: BRASS_SOFT,
  track: TRACK,
  track2: C.rule,
  ink: C.ink,
  ink2: C.ink2,
  ink3: C.ink3,
  axis: '#a3b0c3',
  marker: C.marker,
  surface: C.surface,
  danger: '#b3261e',
  warn: WARN,
  warnBg: WARN_BG,
};
const zoneFill = (i: number) => (i % 2 ? C.rule : TRACK);

/**
 * Ölçüm geçişi: yazı tipi ve yazı genişliği gerçek tuvalden okunur, çizim yapılmaz. Bir bölümün yüksekliği böyle ölçülür,
 * sonra zemini ve kendisi çizilir.
 */
function dry(ctx: Ctx): Ctx {
  const none = () => ({ addColorStop() {} });
  return new Proxy(ctx, {
    get(target, prop) {
      if (prop === 'measureText') return (t: string) => target.measureText(t);
      const v = Reflect.get(target, prop);
      return typeof v === 'function' ? none : v;
    },
    set(target, prop, value) {
      if (prop === 'font') Reflect.set(target, prop, value);
      return true;
    },
  });
}

type Align = 'left' | 'center' | 'right';

function text(ctx: Ctx, t: string, x: number, y: number, color: string, align: Align = 'left') {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(t, x, y);
}

/** Paragraf: satırlara bölüp yazar; yüksekliğini döndürür. `x`, hizaya göre sol kenar, orta ya da sağ kenardır. */
function para(
  ctx: Ctx,
  t: string,
  x: number,
  y: number,
  w: number,
  o: { size: number; weight?: 400 | 700; family?: Family; color?: string; align?: Align; lh?: number; max?: number },
): number {
  const lh = o.lh ?? Math.round(o.size * 1.3);
  setFont(ctx, o.weight ?? 400, o.size, o.family ?? 'body');
  let lines = wrap(ctx, t, w);
  if (o.max && lines.length > o.max) {
    lines = lines.slice(0, o.max);
    lines[o.max - 1] = clip(ctx, `${lines[o.max - 1]} …`, w);
  }
  lines.forEach((l, i) => text(ctx, clip(ctx, l, w), x, y + Math.round(o.size * 0.86) + i * lh, o.color ?? C.ink, o.align ?? 'left'));
  return lines.length * lh;
}

/** Bölüm başlığı: solda pirinç çubuk, yanında başlık. */
function heading(ctx: Ctx, t: string, x: number, y: number, w: number): number {
  setFont(ctx, 700, 30, 'display');
  const lines = wrap(ctx, t, w - 24).slice(0, 3);
  const h = lines.length * 36;
  ctx.fillStyle = C.brass;
  rounded(ctx, x, y + 3, 8, h - 8, 4);
  ctx.fill();
  setFont(ctx, 700, 30, 'display');
  lines.forEach((l, i) => text(ctx, clip(ctx, l, w - 24), x + 24, y + 28 + i * 36, C.ink));
  return h + 20;
}

type Body = (ctx: Ctx, x: number, y: number, w: number) => number;

/** Beyaz, yuvarlak köşeli panel: önce içeriğin yüksekliği ölçülür, sonra zemin ve içerik çizilir. `minH`: yan yana panellerde ortak yükseklik. */
function panel(ctx: Ctx, x: number, y: number, w: number, body: Body, o: { fill?: string; stroke?: string; minH?: number } = {}): number {
  const h = Math.max(o.minH ?? 0, body(dry(ctx), x + PAD, y + PAD, w - 2 * PAD) + 2 * PAD);
  ctx.save();
  ctx.shadowColor = 'rgba(19, 32, 59, 0.10)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = o.fill ?? C.surface;
  rounded(ctx, x, y, w, h, 28);
  ctx.fill();
  ctx.restore();
  if (o.stroke) {
    ctx.strokeStyle = o.stroke;
    ctx.lineWidth = 2;
    rounded(ctx, x, y, w, h, 28);
    ctx.stroke();
  }
  body(ctx, x + PAD, y + PAD, w - 2 * PAD);
  return h;
}

const panelHeight = (ctx: Ctx, w: number, body: Body) => body(dry(ctx), 0, 0, w - 2 * PAD) + 2 * PAD;

/* ------------------------------------------------------------------ rapor grafikleri */

const VW = 240;
const VFS = 10;

/** "M1 2 L3 4 L5 6 Z" biçimindeki çokgen yolun köşeleri (rapor grafiklerindeki işaretler); başka komut varsa null. */
function polygonOf(d: string): [number, number][] | null {
  if (/[^MLZ\d\s.,-]/i.test(d) || /[a-z]/.test(d)) return null;
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (nums.length < 6 || nums.length % 2) return null;
  const pts: [number, number][] = [];
  for (let i = 0; i < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

/** Kartın rapordaki grafiği, `w` piksel genişliğinde; yüksekliğini döndürür. */
export function drawItemVisual(ctx: Ctx, v: ItemVisual, x: number, y: number, w: number): number {
  const k = w / VW;
  const X = (u: number) => x + u * k;
  const Y = (u: number) => y + u * k;
  const label = (t: string, ux: number, uy: number, size: number, bold: boolean, color: string, anchor: 'start' | 'middle' | 'end') => {
    setFont(ctx, bold ? 700 : 400, Math.round(size * k), 'body');
    text(ctx, t, X(ux), Y(uy), color, anchor === 'start' ? 'left' : anchor === 'end' ? 'right' : 'center');
  };
  const zone = (zx: number, zy: number, zw: number, zh: number, r: number, active: boolean, i: number) => {
    ctx.fillStyle = active ? BRASS_SOFT : zoneFill(i);
    rounded(ctx, X(zx), Y(zy), Math.max(0, zw - 1) * k, zh * k, r * k);
    ctx.fill();
    if (active) {
      ctx.strokeStyle = C.brass;
      ctx.lineWidth = 1.2 * k;
      ctx.stroke();
    }
  };

  if (v.type === 'gauge') {
    const g = gaugeGeometry(v, VW, VFS);
    g.zones.forEach((z, i) => zone(z.x, g.barY, z.w, g.barH, 2, z.active, i));
    if (g.ci) {
      ctx.fillStyle = rgba(C.brass, 0.45);
      rounded(ctx, X(g.ci.x), Y(g.barY + g.barH * 0.3), g.ci.w * k, g.barH * 0.4 * k, 1.5 * k);
      ctx.fill();
    }
    for (const t of g.ticks) label(t.text, t.x, g.tickY, g.tickSize, false, C.ink3, t.anchor);
    for (const l of g.labels) label(l.text, l.x, g.labelY(l.row), VFS, l.active, l.active ? C.ink : C.ink2, l.anchor);
    if (g.marker) {
      const mx = g.marker.x;
      ctx.strokeStyle = C.marker;
      ctx.lineWidth = 2.2 * k;
      ctx.beginPath();
      ctx.moveTo(X(mx), Y(g.barY - 3));
      ctx.lineTo(X(mx), Y(g.barY + g.barH + 2));
      ctx.stroke();
      ctx.fillStyle = C.marker;
      ctx.beginPath();
      ctx.moveTo(X(mx - 4), Y(g.barY - 7));
      ctx.lineTo(X(mx + 4), Y(g.barY - 7));
      ctx.lineTo(X(mx), Y(g.barY - 2));
      ctx.closePath();
      ctx.fill();
      label(g.marker.text, mx, g.barY - 9.5, VFS, true, C.ink, g.marker.anchor);
    }
    return g.height * k;
  }

  if (v.type === 'compare') {
    const g = compareGeometry(v, VW, VFS);
    for (const row of g.rows) {
      label(row.label, 0, row.labelY, row.labelSize, true, C.ink, 'start');
      label(row.valueText, VW, row.labelY, VFS, true, C.ink, 'end');
      row.zones.forEach((z, j) => zone(z.x, row.trackY, z.w, 5, 1.5, z.active, j));
      if (row.dot !== null) {
        ctx.fillStyle = C.marker;
        ctx.strokeStyle = C.surface;
        ctx.lineWidth = 1.2 * k;
        ctx.beginPath();
        ctx.arc(X(row.dot), Y(row.trackY + 2.5), 4 * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    for (const t of g.ticks) label(t.text, t.x, g.axisY + g.fontSize, g.tickSize, false, C.ink3, t.anchor);
    for (const l of g.labels) label(l.text, l.x, g.labelY(l.row), VFS * 0.92, false, C.ink2, l.anchor);
    return g.height * k;
  }

  const d = drawVisual(v, VW, VFS);
  for (const s of d.shapes) {
    switch (s.k) {
      case 'rect':
        ctx.fillStyle = TONES[s.fill];
        rounded(ctx, X(s.x), Y(s.y), s.w * k, s.h * k, s.r * k);
        ctx.fill();
        if (s.stroke) {
          ctx.strokeStyle = TONES[s.stroke];
          ctx.lineWidth = (s.sw ?? 1) * k;
          ctx.stroke();
        }
        break;
      case 'circle':
        ctx.fillStyle = TONES[s.fill];
        ctx.beginPath();
        ctx.arc(X(s.x), Y(s.y), s.r * k, 0, Math.PI * 2);
        ctx.fill();
        if (s.stroke) {
          ctx.strokeStyle = TONES[s.stroke];
          ctx.lineWidth = (s.sw ?? 1) * k;
          ctx.stroke();
        }
        break;
      case 'line':
        ctx.strokeStyle = TONES[s.stroke];
        ctx.lineWidth = s.sw * k;
        if (s.dash && ctx.setLineDash) ctx.setLineDash([3 * k, 2.5 * k]);
        ctx.beginPath();
        ctx.moveTo(X(s.x1), Y(s.y1));
        ctx.lineTo(X(s.x2), Y(s.y2));
        ctx.stroke();
        if (s.dash && ctx.setLineDash) ctx.setLineDash([]);
        break;
      case 'path': {
        const pts = polygonOf(s.d);
        if (!pts) break;
        ctx.fillStyle = TONES[s.fill];
        ctx.beginPath();
        pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(X(px), Y(py)) : ctx.lineTo(X(px), Y(py))));
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'text':
        label(s.text, s.x, s.y, s.size, s.weight >= 600, TONES[s.fill], s.anchor);
        break;
    }
  }
  return d.height * k;
}

/* ------------------------------------------------------------------ raporun grafiği */

type RowsChart = Extract<SummaryChart, { kind: 'rows' }>;
type RadarChart = Extract<SummaryChart, { kind: 'radar' }>;

function ruler(ctx: Ctx, x: number, y: number, w: number, h: number, t: number | null, color: string, knob: number) {
  ctx.fillStyle = rgba(color, 0.2);
  rounded(ctx, x, y, w, h, h / 2);
  ctx.fill();
  if (t === null) return;
  // Cetvel: puanın yeri bir işaretle gösterilir; dolgu yoktur (çok ya da az, iyi ya da kötü anlamı taşımaz).
  ctx.fillStyle = C.surface;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(4, knob * 0.45);
  ctx.beginPath();
  ctx.arc(x + knob + t * (w - 2 * knob), y + h / 2, knob, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function chartRows(ctx: Ctx, c: RowsChart, x: number, y: number, w: number): number {
  const n = c.rows.length;
  if (n > 8) {
    // Çok ölçekli profil (ör. 16 faktör): iki sütun, sıkı satırlar.
    const gap = 44;
    const cw = (w - gap) / 2;
    const half = Math.ceil(n / 2);
    const per = 84;
    c.rows.forEach((r, i) => {
      const cx = x + (i < half ? 0 : cw + gap);
      const cy = y + (i % half) * per;
      setFont(ctx, 700, 21, 'body');
      const band = clip(ctx, r.band, cw * 0.45);
      const bw = ctx.measureText(band).width;
      text(ctx, band, cx + cw, cy + 26, C.ink2, 'right');
      setFont(ctx, 700, 25, 'body');
      text(ctx, clip(ctx, r.label, cw - bw - 18), cx, cy + 26, C.ink);
      ruler(ctx, cx, cy + 44, cw, 10, r.t, r.color, 10);
    });
    return half * per - 20;
  }
  let cy = y;
  for (const r of c.rows) {
    setFont(ctx, 700, 24, 'body');
    const band = clip(ctx, r.band, w * 0.42);
    const bw = ctx.measureText(band).width;
    text(ctx, band, x + w, cy + 32, C.ink2, 'right');
    fit(ctx, r.label, w - bw - 24, 700, 32, 'display', 24);
    text(ctx, clip(ctx, r.label, w - bw - 24), x, cy + 32, C.ink);
    ruler(ctx, x, cy + 50, w, 14, r.t, r.color, 15);
    if (r.note) {
      setFont(ctx, 400, 23, 'body');
      text(ctx, clip(ctx, r.note, w), x, cy + 100, C.ink2);
    }
    cy += r.note ? 132 : 98;
  }
  return cy - y - 22;
}

function chartRadar(ctx: Ctx, c: RadarChart, x: number, y: number, w: number): number {
  const n = c.axes.length;
  const size = Math.min(430, Math.round(w * 0.47));
  const rowH = Math.max(46, Math.min(66, Math.floor(size / n)));
  const h = Math.max(size, n * rowH);
  const cx = x + size / 2;
  const cy = y + h / 2;
  const R = size / 2 - 40;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (deg: number, v: number) => [cx + Math.cos(rad(deg)) * ((R * v) / c.max), cy - Math.sin(rad(deg)) * ((R * v) / c.max)] as const;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = C.rule;
  for (let v = c.min; v <= c.max; v++) {
    ctx.lineWidth = v === c.max ? 2.5 : 1.5;
    ctx.beginPath();
    c.axes.forEach((a, i) => {
      const [px, py] = pt(a.angle, v);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.lineWidth = 1.5;
  for (const a of c.axes) {
    const [px, py] = pt(a.angle, c.max);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
  // Puanı hesaplanamayan eksen çizilmez.
  const known = c.axes.filter((a) => a.value !== null);
  if (known.length > 0) {
    ctx.beginPath();
    known.forEach((a, i) => {
      const [px, py] = pt(a.angle, a.value!);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = rgba(C.brass, 0.22);
    ctx.fill();
    ctx.strokeStyle = C.brass;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  for (const a of known) {
    const [px, py] = pt(a.angle, a.value!);
    ctx.fillStyle = a.highlight ? C.marker : C.ink;
    ctx.beginPath();
    ctx.arc(px, py, a.highlight ? 10 : 7, 0, Math.PI * 2);
    ctx.fill();
  }
  // Eksenlerin adları sağdaki listededir; grafikte yalnızca sıra numaraları durur (uzun adlar grafiğe sığmaz).
  c.axes.forEach((a, i) => {
    const lx = cx + Math.cos(rad(a.angle)) * (R + 22);
    const ly = cy - Math.sin(rad(a.angle)) * (R + 22);
    setFont(ctx, 700, 20, 'body');
    text(ctx, String(i + 1), lx, ly + 7, a.highlight ? C.ink : C.ink3, 'center');
  });
  const lx = x + size + 36;
  const lw = w - size - 36;
  const top = y + (h - n * rowH) / 2;
  c.axes.forEach((a, i) => {
    const ry = top + i * rowH;
    ctx.fillStyle = a.highlight ? BRASS_SOFT : SOFT;
    ctx.strokeStyle = a.highlight ? C.brass : C.rule;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(lx + 17, ry + rowH / 2, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    setFont(ctx, 700, 19, 'body');
    text(ctx, String(i + 1), lx + 17, ry + rowH / 2 + 7, C.ink, 'center');
    setFont(ctx, 700, 24, 'body');
    const vw = ctx.measureText(a.valueLabel).width;
    text(ctx, a.valueLabel, lx + lw, ry + rowH / 2 - 2, C.ink, 'right');
    setFont(ctx, a.highlight ? 700 : 400, 24, 'body');
    text(ctx, clip(ctx, a.label, lw - 48 - vw - 14), lx + 48, ry + rowH / 2 - 2, a.highlight ? C.ink : C.ink2);
    const bx = lx + 48;
    const bw = lw - 48;
    ctx.fillStyle = TRACK;
    rounded(ctx, bx, ry + rowH / 2 + 8, bw, 7, 3.5);
    ctx.fill();
    if (a.value !== null) {
      ctx.fillStyle = C.brass;
      rounded(ctx, bx, ry + rowH / 2 + 8, Math.max(7, (bw * (a.value - c.min)) / (c.max - c.min || 1)), 7, 3.5);
      ctx.fill();
    }
  });
  return h;
}

function chartBars(ctx: Ctx, rows: Extract<SummaryChart, { kind: 'bars' }>['rows'], x: number, y: number, w: number): number {
  setFont(ctx, 700, 24, 'body');
  const vw = Math.min(w * 0.3, Math.max(...rows.map((r) => ctx.measureText(r.valueLabel).width)));
  setFont(ctx, 400, 24, 'body');
  const lw = Math.min(w * 0.4, Math.max(...rows.map((r) => ctx.measureText(r.label).width)) + 4);
  const bx = x + lw + 20;
  const bw = Math.max(60, w - lw - vw - 40);
  let cy = y;
  for (const r of rows) {
    setFont(ctx, 400, 24, 'body');
    const lines = wrap(ctx, r.label, lw).slice(0, 2);
    const rh = Math.max(52, lines.length * 30 + 16);
    const mid = cy + rh / 2;
    lines.forEach((l, i) => text(ctx, clip(ctx, l, lw), x, mid + 8 - ((lines.length - 1) * 30) / 2 + i * 30, C.ink));
    ctx.fillStyle = TRACK;
    rounded(ctx, bx, mid - 10, bw, 20, 10);
    ctx.fill();
    const share = r.max > 0 ? Math.min(1, Math.max(0, r.value / r.max)) : 0;
    if (share > 0) {
      ctx.fillStyle = C.brass;
      rounded(ctx, bx, mid - 10, Math.max(20, bw * share), 20, 10);
      ctx.fill();
    }
    setFont(ctx, 700, 24, 'body');
    text(ctx, clip(ctx, r.valueLabel, vw), x + w, mid + 8, C.ink, 'right');
    cy += rh;
  }
  return cy - y;
}

function chartColumns(ctx: Ctx, c: Extract<SummaryChart, { kind: 'columns' }>, x: number, y: number, w: number): number {
  const n = c.rows.length;
  const areaH = 230;
  const top = y + 40;
  const base = top + areaH;
  const slot = Math.min(190, w / n);
  const cw = Math.min(110, slot - 28);
  const left = x + (w - slot * n) / 2;
  const max = Math.max(1, ...c.rows.map((r) => r.value));
  ctx.strokeStyle = '#a3b0c3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, base);
  ctx.lineTo(left + slot * n, base);
  ctx.stroke();
  c.rows.forEach((r, i) => {
    const mid = left + slot * i + slot / 2;
    const hgt = Math.max(0, (areaH * r.value) / max);
    if (hgt > 0) {
      ctx.fillStyle = C.brass;
      rounded(ctx, mid - cw / 2, base - hgt, cw, hgt, Math.min(12, hgt / 2));
      ctx.fill();
    }
    setFont(ctx, 700, 24, 'body');
    text(ctx, String(r.value), mid, base - hgt - 12, C.ink, 'center');
    setFont(ctx, 400, 22, 'body');
    text(ctx, clip(ctx, r.label, slot - 8), mid, base + 32, C.ink2, 'center');
  });
  const ch = para(ctx, c.caption, x + w / 2, base + 52, w, { size: 22, color: C.ink3, align: 'center', max: 3 });
  return base + 52 + ch - y;
}

function chartQuadrant(ctx: Ctx, c: Extract<SummaryChart, { kind: 'quadrant' }>, x: number, y: number, w: number): number {
  const S = Math.min(420, w - 220);
  const L = x + (w - S) / 2 + 12;
  const T = y + 64;
  const f = S / 316;
  const g = quadrantGeometry(c.chart, { left: L, top: T, size: S });
  for (const cell of g.cells) {
    if (!cell.active) continue;
    ctx.fillStyle = rgba(C.brass, 0.24);
    ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
  }
  ctx.strokeStyle = C.rule;
  ctx.lineWidth = 1.5;
  rounded(ctx, L, T, S, S, 0);
  ctx.stroke();
  ctx.strokeStyle = '#a3b0c3';
  if (ctx.setLineDash) ctx.setLineDash([7, 7]);
  for (const cut of g.cuts) {
    ctx.beginPath();
    ctx.moveTo(cut.x, T);
    ctx.lineTo(cut.x, T + S);
    ctx.moveTo(L, cut.y);
    ctx.lineTo(L + S, cut.y);
    ctx.stroke();
  }
  if (ctx.setLineDash) ctx.setLineDash([]);
  for (const k of g.corners) {
    setFont(ctx, k.active ? 700 : 400, 21, 'body');
    const tx = k.anchor === 'end' ? k.x - 9 * f : k.x + 9 * f;
    const ty = k.top ? k.y + 24 * f : k.y - 11 * f - (k.lines.length - 1) * 26;
    k.lines.forEach((l, i) => text(ctx, l, tx, ty + i * 26, k.active ? C.ink : C.ink3, k.anchor === 'end' ? 'right' : 'left'));
  }
  // Eksenler: sol ve alt kenar, uçlarında ok.
  ctx.strokeStyle = C.ink;
  ctx.fillStyle = C.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(L, T + S);
  ctx.lineTo(L + S + 18, T + S);
  ctx.moveTo(L, T + S);
  ctx.lineTo(L, T - 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(L + S + 28, T + S);
  ctx.lineTo(L + S + 16, T + S - 7);
  ctx.lineTo(L + S + 16, T + S + 7);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(L, T - 28);
  ctx.lineTo(L - 7, T - 16);
  ctx.lineTo(L + 7, T - 16);
  ctx.closePath();
  ctx.fill();
  for (const t of g.ticks) {
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(t.x, T + S);
    ctx.lineTo(t.x, T + S + 8);
    ctx.moveTo(L - 8, t.y);
    ctx.lineTo(L, t.y);
    ctx.stroke();
    setFont(ctx, 400, 19, 'body');
    text(ctx, String(t.v), t.x, T + S + 30, C.ink3, 'center');
    text(ctx, String(t.v), L - 14, t.y + 7, C.ink3, 'right');
  }
  setFont(ctx, 700, 23, 'body');
  text(ctx, clip(ctx, c.chart.x.label, S + 80), L + S, T + S + 66, C.ink, 'right');
  text(ctx, clip(ctx, c.chart.y.label, S + 80), L + 18, T - 24, C.ink, 'left');
  if (g.point) {
    ctx.fillStyle = C.marker;
    ctx.strokeStyle = C.paper;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(g.point.x, g.point.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  return T + S + 80 - y;
}

function chartBody(c: SummaryChart): Body {
  return (ctx, x, y, w) => {
    switch (c.kind) {
      case 'rows':
        return chartRows(ctx, c, x, y, w);
      case 'radar':
        return chartRadar(ctx, c, x, y, w);
      case 'bars':
        return chartBars(ctx, c.rows, x, y, w);
      case 'columns':
        return chartColumns(ctx, c, x, y, w);
      case 'quadrant':
        return chartQuadrant(ctx, c, x, y, w);
    }
  };
}

/* ------------------------------------------------------------------ bölümler */

function cardBody(ctx: Ctx, c: SummaryCard, x: number, y: number, w: number): number {
  let cy = y;
  cy += para(ctx, c.title, x, cy, w, { size: 26, weight: 700, lh: 32, max: 3 });
  if (c.badge) cy += 4 + para(ctx, c.badge, x, cy + 4, w, { size: 22, weight: 700, color: C.brassInk, lh: 28, max: 3 });
  if (c.visual) {
    const vw = Math.min(w, 520);
    cy += 18;
    cy += drawItemVisual(ctx, c.visual, x + (w - vw) / 2, cy, vw);
  }
  return cy - y;
}

function cardsGrid(ctx: Ctx, cards: SummaryCard[], more: number, x: number, y: number, w: number): number {
  const cols = cards.length === 1 ? 1 : 2;
  const gap = 20;
  const pad = 22;
  const cw = (w - gap * (cols - 1)) / cols;
  let cy = y;
  for (let i = 0; i < cards.length; i += cols) {
    const row = cards.slice(i, i + cols);
    const h = Math.max(...row.map((c) => cardBody(dry(ctx), c, 0, 0, cw - 2 * pad))) + 2 * pad;
    row.forEach((c, j) => {
      const cx = x + j * (cw + gap);
      ctx.fillStyle = SOFT;
      ctx.strokeStyle = C.rule;
      ctx.lineWidth = 1.5;
      rounded(ctx, cx, cy, cw, h, 20);
      ctx.fill();
      ctx.stroke();
      cardBody(ctx, c, cx + pad, cy + pad, cw - 2 * pad);
    });
    cy += h + gap;
  }
  cy -= gap;
  if (more > 0) {
    setFont(ctx, 400, 22, 'body');
    text(ctx, moreCardsLine(more), x + w / 2, cy + 40, C.ink3, 'center');
    cy += 48;
  }
  return cy - y;
}

function check(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = C.brass;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.surface;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 0.5);
  ctx.lineTo(x - 1.5, y + 5);
  ctx.lineTo(x + 6.5, y - 4.5);
  ctx.stroke();
}

function pointsBody(p: NonNullable<ReportSummary['points']>): Body {
  return (ctx, x, y, w) => {
    let cy = y + heading(ctx, p.title, x, y, w);
    if (p.note) return cy + para(ctx, p.note, x, cy, w, { size: 24, color: C.ink2, lh: 32 }) - y;
    p.items.forEach((it, i) => {
      if (i > 0) cy += 16;
      check(ctx, x + 14, cy + 15);
      const th = para(ctx, it.title, x + 42, cy, w - 42, { size: 25, weight: 700, lh: 31, max: 3 });
      cy += th;
      if (it.text && it.text !== it.title) cy += 2 + para(ctx, it.text, x + 42, cy + 2, w - 42, { size: 23, color: C.ink2, lh: 30 });
    });
    return cy - y;
  };
}

function tipsBody(t: NonNullable<ReportSummary['tips']>): Body {
  return (ctx, x, y, w) => {
    let cy = y + heading(ctx, t.title, x, y, w);
    t.items.forEach((it, i) => {
      if (i > 0) cy += 14;
      ctx.fillStyle = C.brass;
      ctx.beginPath();
      ctx.arc(x + 10, cy + 16, 6, 0, Math.PI * 2);
      ctx.fill();
      cy += para(ctx, it, x + 34, cy, w - 34, { size: 25, lh: 32, max: 3 });
    });
    return cy - y;
  };
}

function stepsBody(st: NonNullable<ReportSummary['steps']>): Body {
  return (ctx, x, y, w) => {
    let cy = y + heading(ctx, st.title, x, y, w);
    const n = st.items.length;
    const slot = w / n;
    const mid = (i: number) => x + slot * i + slot / 2;
    const ly = cy + 22;
    ctx.strokeStyle = C.rule;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mid(0), ly);
    ctx.lineTo(mid(n - 1), ly);
    ctx.stroke();
    let tall = 0;
    st.items.forEach((it, i) => {
      ctx.fillStyle = it.fromResult ? C.brass : C.surface;
      ctx.strokeStyle = C.brass;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(mid(i), ly, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      setFont(ctx, 400, 21, 'body');
      text(ctx, clip(ctx, it.label, slot - 12), mid(i), ly + 52, C.ink3, 'center');
      tall = Math.max(tall, para(ctx, it.title, mid(i), ly + 62, slot - 16, { size: 24, weight: 700, lh: 30, align: 'center', max: 3 }));
    });
    cy = ly + 62 + tall + 26;
    // Lejant: dolu daire sonuca göre seçilen, içi boş daire herkese verilen hafta (yalnızca görselde olanlar).
    const entries = [
      ...(st.items.some((it) => it.fromResult) ? [{ label: st.legend.result, full: true }] : []),
      ...(st.items.some((it) => !it.fromResult) ? [{ label: st.legend.general, full: false }] : []),
    ];
    setFont(ctx, 400, 21, 'body');
    const widths = entries.map((e) => 30 + ctx.measureText(e.label).width);
    let lx = x + (w - (widths.reduce((a, b) => a + b, 0) + 36 * (entries.length - 1))) / 2;
    entries.forEach((e, i) => {
      ctx.fillStyle = e.full ? C.brass : C.surface;
      ctx.strokeStyle = C.brass;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(lx + 9, cy + 13, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      setFont(ctx, 400, 21, 'body');
      text(ctx, e.label, lx + 30, cy + 20, C.ink3);
      lx += widths[i] + 36;
    });
    return cy + 28 - y;
  };
}

/**
 * Öne çıkan sayılar. Değer hiçbir zaman kısaltılmaz: kutular, her değerin en uzun sözcüğü kutuya sığacak ve değer en çok iki
 * satır tutacak biçimde yan yana dizilir (hepsi bir sırada; sığmazsa ikişerli; o da olmazsa alt alta).
 */
function tilesRow(ctx: Ctx, s: ReportSummary, y: number): number {
  const n = s.tiles.length;
  const gap = 20;
  const width = (cols: number) => (IW - gap * (cols - 1)) / cols;
  const fits = (cols: number) => {
    const inner = width(cols) - 2 * PAD;
    setFont(ctx, 700, 34, 'display');
    return s.tiles.every((t) => {
      const words = t.value.split(/\s+/);
      return Math.max(...words.map((w) => ctx.measureText(w).width)) <= inner && ctx.measureText(t.value).width <= inner * 2 && (cols < 3 || (t.note ?? '').length <= 60);
    });
  };
  const cols = n > 1 && fits(n) ? n : n > 2 && fits(2) ? 2 : 1;
  const centered = cols > 1;
  const tw = width(cols);
  const body =
    (i: number): Body =>
    (c, x, yy, w) => {
      const t = s.tiles[i];
      const align: Align = centered ? 'center' : 'left';
      const ax = centered ? x + w / 2 : x;
      let cy = yy;
      cy += para(c, t.label.toLocaleUpperCase('tr-TR'), ax, cy, w, { size: 20, weight: 700, color: C.ink3, align, lh: 26, max: 3 });
      cy += 10;
      // Tek satıra sığan değer büyük yazılır (gerekirse biraz küçülerek); sığmayan değer satırlara bölünür.
      setFont(c, 700, 34, 'display');
      const size = c.measureText(t.value).width <= w ? fit(c, t.value, w, 700, 54, 'display', 34) : 34;
      cy += para(c, t.value, ax, cy, w, { size, weight: 700, family: 'display', color: C.ink, align, lh: Math.round(size * 1.16) });
      if (t.note) cy += 8 + para(c, t.note, ax, cy + 8, w, { size: 22, color: C.ink2, align, lh: 28 });
      return cy - yy;
    };
  let cy = y;
  for (let i = 0; i < n; i += cols) {
    const row = s.tiles.slice(i, i + cols).map((_, j) => i + j);
    const minH = Math.max(...row.map((k) => panelHeight(ctx, tw, body(k))));
    row.forEach((k, j) => panel(ctx, M + j * (tw + gap), cy, tw, body(k), { minH }));
    cy += minH + gap;
  }
  return cy - gap - y;
}

/** Pusula süslemesi ve ortasında testin çizimi (ya da Ölçekhane işareti). */
function ornament(ctx: Ctx, cx: number, cy: number, R: number, emblem: CanvasImageSource | null | undefined) {
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.5);
  glow.addColorStop(0, rgba(C.brass, 0.2));
  glow.addColorStop(1, rgba(C.brass, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);
  ctx.lineCap = 'round';
  const ring = (r: number, lw: number, a: number) => {
    ctx.strokeStyle = rgba(C.brass, a);
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  ring(R, 3, 0.55);
  ring(R - 16, 1.5, 0.4);
  ring(R * 0.66, 1.5, 0.3);
  for (let i = 0; i < 72; i++) {
    const a = (i * Math.PI * 2) / 72;
    const inner = R - (i % 6 === 0 ? 40 : 28);
    ctx.strokeStyle = rgba(C.brass, i % 6 === 0 ? 0.6 : 0.35);
    ctx.lineWidth = i % 6 === 0 ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * (R - 18), cy + Math.sin(a) * (R - 18));
    ctx.stroke();
  }
  // Pusula gülü: dört uzun, dört kısa kol; her kol iki tonlu.
  const arm = (a: number, len: number, half: number) => {
    const tip = [cx + Math.cos(a) * len, cy + Math.sin(a) * len] as const;
    for (const side of [-1, 1]) {
      const b = a + (side * Math.PI) / 2;
      ctx.fillStyle = rgba(C.brass, side === 1 ? 0.34 : 0.16);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(b) * half, cy + Math.sin(b) * half);
      ctx.lineTo(tip[0], tip[1]);
      ctx.closePath();
      ctx.fill();
    }
  };
  for (let i = 0; i < 4; i++) arm(Math.PI / 4 + (i * Math.PI) / 2, R * 0.6, 20);
  for (let i = 0; i < 4; i++) arm((i * Math.PI) / 2, R * 0.94, 26);
  // Ortadaki daire.
  const r = R * 0.5;
  ctx.save();
  ctx.shadowColor = 'rgba(19, 32, 59, 0.18)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = C.surface;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ring(r, 4, 0.9);
  if (emblem) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.clip();
    // Çizimin oranı 16:10 (components/site/test-emblem.tsx); daireyi dolduracak kadar büyük, ortalı.
    const ew = r * 1.9;
    ctx.drawImage(emblem, cx - ew / 2, cy - (ew * 0.625) / 2, ew, ew * 0.625);
    ctx.restore();
  } else drawLogo(ctx, cx - r * 0.5, cy - r * 0.58, r * 1.05);
}

function background(ctx: Ctx, height: number) {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SUMMARY_W, height);
  // "Canlı şekil" dilindeki yumuşak renk bulutları: yaklaşık her 800 pikselde bir, sağlı sollu.
  for (let i = 0, y = 620; y < height + 200; i++, y += 800) {
    const x = i % 2 ? SUMMARY_W - 20 : 20;
    const color = SHARE_COLORS[(i + 4) % SHARE_COLORS.length];
    const g = ctx.createRadialGradient(x, y, 0, x, y, 520);
    g.addColorStop(0, rgba(color, 0.16));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 520, SUMMARY_W, 1040);
  }
}

function header(ctx: Ctx, s: ReportSummary, o: SummaryOptions): number {
  const R = 236;
  const cx = SUMMARY_W - 196;
  const cy = 232;
  ornament(ctx, cx, cy, R, o.emblem);
  const w = cx - R - M - 20;
  drawLogo(ctx, M, 40, 50);
  setFont(ctx, 700, 40, 'display');
  text(ctx, 'Ölçekhane', M + 66, 80, C.ink);
  let y = 164;
  setFont(ctx, 700, 26, 'body');
  // Rapor türü ("Öğrenci raporu") hemen alttaki bilgi şeridinde yazar.
  text(ctx, SUMMARY_KICKER.toLocaleUpperCase('tr-TR'), M, y, C.brassInk);
  y += 22;
  let size = 62;
  setFont(ctx, 700, size, 'display');
  let lines = wrap(ctx, s.title, w);
  for (const next of [52, 44]) {
    if (lines.length <= (size === 62 ? 2 : 3)) break;
    size = next;
    setFont(ctx, 700, size, 'display');
    lines = wrap(ctx, s.title, w);
  }
  lines = lines.slice(0, 4);
  lines.forEach((l, i) => text(ctx, clip(ctx, l, w), M, y + size + i * Math.round(size * 1.1), C.ink));
  y += lines.length * Math.round(size * 1.1) + 12;
  if (s.pilot) {
    setFont(ctx, 700, 22, 'body');
    const pw = ctx.measureText(SUMMARY_PILOT).width + 36;
    ctx.fillStyle = rgba(C.brass, 0.16);
    rounded(ctx, M, y + 6, pw, 40, 20);
    ctx.fill();
    text(ctx, SUMMARY_PILOT, M + 18, y + 34, C.brassInk);
    y += 58;
  }
  const name = o.name.trim();
  if (name) {
    y += 14;
    // Ad tek satıra sığana kadar küçülür; uzun ad iki satıra bölünür.
    const ns = fit(ctx, name, w, 700, 54, 'display', 40);
    y += para(ctx, name, M, y, w, { size: ns, weight: 700, family: 'display', color: C.brassInk, lh: Math.round(ns * 1.12), max: 2 }) + 16;
    ctx.fillStyle = C.brass;
    rounded(ctx, M, y, 120, 5, 2.5);
    ctx.fill();
    y += 5;
  }
  return Math.max(cy + R - 20, y + 30);
}

function metaStrip(s: ReportSummary): Body {
  return (ctx, x, y, w) => {
    const cells = [
      { label: SUMMARY_META.date, value: s.dateLabel },
      { label: /sınıf/i.test(s.gradeLabel) ? SUMMARY_META.grade : 'Grup', value: s.gradeLabel },
      { label: SUMMARY_META.kind, value: s.audienceLabel },
    ];
    const cw = w / cells.length;
    cells.forEach((c, i) => {
      const cx = x + i * cw + (i === 0 ? 0 : 24);
      const room = cw - (i === 0 ? 24 : 48);
      if (i > 0) {
        ctx.fillStyle = C.rule;
        ctx.fillRect(x + i * cw, y + 2, 2, 62);
      }
      setFont(ctx, 700, 19, 'body');
      text(ctx, c.label.toLocaleUpperCase('tr-TR'), cx, y + 20, C.ink3);
      fit(ctx, c.value, room, 700, 27, 'body', 20);
      text(ctx, clip(ctx, c.value, room), cx, y + 58, C.ink);
    });
    return 66;
  };
}

function cautionBody(c: NonNullable<ReportSummary['caution']>): Body {
  return (ctx, x, y, w) => {
    let cy = y;
    cy += para(ctx, c.title, x, cy, w, { size: 26, weight: 700, color: WARN, lh: 34 });
    cy += 4 + para(ctx, c.text, x, cy + 4, w, { size: 23, color: C.ink, lh: 31 });
    if (c.more > 0) cy += 8 + para(ctx, moreCautionsLine(c.more), x, cy + 8, w, { size: 21, color: C.ink2 });
    return cy - y;
  };
}

function footer(ctx: Ctx, s: ReportSummary, host: string, y: number): number {
  ctx.fillStyle = C.rule;
  ctx.fillRect(M, y, IW, 2);
  let cy = y + 30;
  drawLogo(ctx, M, cy, 44);
  setFont(ctx, 700, 32, 'display');
  text(ctx, 'Ölçekhane', M + 58, cy + 36, C.ink);
  const url = `${host}${s.path}`;
  fit(ctx, url, IW - 260, 700, 28, 'display', 18);
  text(ctx, url, M + IW, cy + 34, C.brassInk, 'right');
  cy += 70;
  cy += para(ctx, s.disclaimer, M, cy, IW, { size: 24, weight: 700, color: C.ink, lh: 32 });
  cy += 4 + para(ctx, SUMMARY_FOOTER, M, cy + 4, IW, { size: 22, color: C.ink3, lh: 30 });
  return cy + 44 - y;
}

/**
 * Özeti çizer ve görselin yüksekliğini döndürür. Önce `summaryHeight` ile yükseklik ölçülür, tuval o yüksekliğe getirilir,
 * sonra `height` verilerek çizilir.
 */
export function drawSummary(ctx: Ctx, s: ReportSummary, o: SummaryOptions): number {
  if (o.height) background(ctx, o.height);
  let y = header(ctx, s, o) + GAP;
  y += panel(ctx, M, y, IW, metaStrip(s)) + GAP;
  if (s.caution) y += panel(ctx, M, y, IW, cautionBody(s.caution), { fill: WARN_BG, stroke: rgba(C.brass, 0.5) }) + GAP;
  if (s.tiles.length > 0) y += tilesRow(ctx, s, y) + GAP;
  if (s.chart) {
    const { title, chart } = s.chart;
    const body = chartBody(chart);
    y += panel(ctx, M, y, IW, (c, x, yy, w) => {
      const hh = heading(c, title, x, yy, w);
      return hh + 8 + body(c, x, yy + hh + 8, w);
    });
    y += GAP;
  }
  if (s.cards) {
    const { title, items, more } = s.cards;
    y += panel(ctx, M, y, IW, (c, x, yy, w) => {
      const hh = heading(c, title, x, yy, w);
      return hh + 4 + cardsGrid(c, items, more, x, yy + hh + 4, w);
    });
    y += GAP;
  }
  if (s.points && s.tips) {
    const gap = 20;
    const hw = (IW - gap) / 2;
    const a = pointsBody(s.points);
    const b = tipsBody(s.tips);
    const minH = Math.max(panelHeight(ctx, hw, a), panelHeight(ctx, hw, b));
    panel(ctx, M, y, hw, a, { minH });
    panel(ctx, M + hw + gap, y, hw, b, { minH });
    y += minH + GAP;
  } else if (s.points) y += panel(ctx, M, y, IW, pointsBody(s.points)) + GAP;
  else if (s.tips) y += panel(ctx, M, y, IW, tipsBody(s.tips)) + GAP;
  if (s.steps) y += panel(ctx, M, y, IW, stepsBody(s.steps)) + GAP;
  y += 8;
  return Math.ceil(y + footer(ctx, s, o.host, y));
}

/** Görselin yüksekliği (çizmeden). */
export const summaryHeight = (ctx: Ctx, s: ReportSummary, o: SummaryOptions) => drawSummary(dry(ctx), s, { ...o, height: undefined });
