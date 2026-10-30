import { SHARE_COLORS, SHARE_CTA, SHARE_FOOTER, SHARE_H, SHARE_PILOT, SHARE_W, type ShareBlock, type ShareCard } from './card';

/**
 * Paylaşım kartının çizimi (1080 × 1920; Instagram hikâyesi ve WhatsApp durumu boyutu). Yalnızca tarayıcıda, bir
 * tuval (canvas) üzerinde çalışır; görsel cihazdan çıkmaz, kişi paylaşmayı seçerse kendi uygulamasıyla paylaşır.
 * Renkler sitenin açık temasıdır (globals.css); "canlı şekil" dilindeki yumuşak renk bulutları arka plandadır.
 */

const C = {
  paper: '#f3f5f8',
  surface: '#ffffff',
  ink: '#13203b',
  ink2: '#44546f',
  ink3: '#5a6984',
  rule: '#d4dbe5',
  brass: '#b07f22',
  brassInk: '#7e5710',
  marker: '#c23a30',
};

export const SHARE_FONTS = {
  display: '"Bricolage Grotesque Variable", "Arial Narrow", ui-sans-serif, system-ui, sans-serif',
  body: '"Atkinson Hyperlegible Next", ui-sans-serif, system-ui, sans-serif',
};

/** Tuval yazı tiplerinin yüklenmesi için `document.fonts.load` çağrıları (harf kümeleri metne göre iner). */
export const SHARE_FONT_LOADS = ['700 80px "Bricolage Grotesque Variable"', '400 32px "Atkinson Hyperlegible Next"', '700 32px "Atkinson Hyperlegible Next"'];

type Ctx = CanvasRenderingContext2D;
type Family = keyof typeof SHARE_FONTS;

const M = 84;
const PANEL_BOTTOM = 1588;

const setFont = (ctx: Ctx, weight: 400 | 700, size: number, family: Family) => {
  ctx.font = `${weight} ${size}px ${SHARE_FONTS[family]}`;
};

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Sözcük sözcük satırlara böler; tek sözcük satıra sığmıyorsa olduğu gibi bırakılır. */
function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Yazıyı genişliğe sığana kadar küçültür (en çok `min` piksele). */
function fit(ctx: Ctx, text: string, maxWidth: number, weight: 400 | 700, size: number, family: Family, min: number): number {
  let s = size;
  setFont(ctx, weight, s, family);
  while (s > min && ctx.measureText(text).width > maxWidth) {
    s -= 2;
    setFont(ctx, weight, s, family);
  }
  return s;
}

/** Sığmayan yazının sonunu "…" ile kısaltır. */
function clip(ctx: Ctx, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function rounded(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Ölçekhane işareti (components/site/logo.tsx ile aynı çizim, 32 birimlik kare `size` piksele ölçeklenir). */
function drawLogo(ctx: Ctx, x: number, y: number, size: number) {
  const k = size / 32;
  const P = (px: number, py: number) => [x + px * k, y + py * k] as const;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2 * k;
  ctx.beginPath();
  ctx.moveTo(...P(3, 29));
  ctx.lineTo(...P(3, 5));
  ctx.arc(x + 3 * k, y + 29 * k, 24 * k, -Math.PI / 2, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 1.4 * k;
  ctx.beginPath();
  ctx.arc(x + 3 * k, y + 29 * k, 16 * k, -Math.PI / 2, 0);
  ctx.stroke();
  ctx.lineWidth = 1.2 * k;
  for (let i = 0; i < 9; i++) {
    const a = (Math.PI * (9 + i * 9)) / 180;
    const r1 = i % 3 === 1 ? 10.5 : 12;
    ctx.beginPath();
    ctx.moveTo(...P(3 + Math.cos(a) * r1, 29 - Math.sin(a) * r1));
    ctx.lineTo(...P(3 + Math.cos(a) * 14, 29 - Math.sin(a) * 14));
    ctx.stroke();
  }
  const p = (Math.PI * 38) / 180;
  const [ex, ey] = P(3 + Math.cos(p) * 21, 29 - Math.sin(p) * 21);
  ctx.strokeStyle = C.brass;
  ctx.lineWidth = 2.2 * k;
  ctx.beginPath();
  ctx.moveTo(...P(3, 29));
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.fillStyle = C.marker;
  ctx.beginPath();
  ctx.arc(ex, ey, 2.4 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBackground(ctx: Ctx) {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SHARE_W, SHARE_H);
  const blobs: [number, number, number, string, number][] = [
    [990, 140, 520, SHARE_COLORS[0], 0.3],
    [40, 820, 440, SHARE_COLORS[4], 0.16],
    [1040, 1460, 520, SHARE_COLORS[3], 0.2],
    [90, 1880, 420, SHARE_COLORS[1], 0.18],
  ];
  for (const [x, y, r, color, a] of blobs) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SHARE_W, SHARE_H);
  }
}

/** Satır bloğunun en rahat yüksekliği (blokların paneli paylaşması için). */
function rowsNeed(block: Extract<ShareBlock, { kind: 'rows' }>): number {
  return (block.title ? 84 : 0) + block.rows.length * (block.rows.some((r) => r.note) ? 170 : 128);
}

function drawRows(ctx: Ctx, block: Extract<ShareBlock, { kind: 'rows' }>, x: number, y: number, w: number, h: number) {
  let top = y;
  if (block.title) {
    setFont(ctx, 700, 36, 'body');
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(clip(ctx, block.title, w), x, top + 36);
    top += 84;
  }
  const n = block.rows.length;
  const per = Math.min(230, (y + h - top) / n);
  const mode = per >= 150 ? 'full' : per >= 96 ? 'medium' : 'dense';
  block.rows.forEach((r, i) => {
    const ry = top + i * per;
    const t = (r.value - r.min) / (r.max - r.min || 1);
    if (mode === 'dense') {
      const mid = ry + per / 2;
      setFont(ctx, 700, 28, 'body');
      ctx.fillStyle = C.ink;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(clip(ctx, r.label, w * 0.48), x, mid);
      const bx = x + w * 0.51;
      const bw = w * 0.28;
      ctx.fillStyle = rgba(r.color, 0.2);
      rounded(ctx, bx, mid - 6, bw, 12, 6);
      ctx.fill();
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(bx + t * bw, mid, 13, 0, Math.PI * 2);
      ctx.fill();
      setFont(ctx, 700, 26, 'body');
      ctx.fillStyle = C.ink2;
      ctx.textAlign = 'right';
      ctx.fillText(clip(ctx, r.band, w * 0.2), x + w, mid);
      return;
    }
    const full = mode === 'full';
    const labelSize = full ? 44 : 36;
    const barY = ry + (full ? 70 : 56);
    const barH = full ? 18 : 14;
    // Ad solda, düzey sağda; ad uzunsa düzeye yer bırakılır.
    setFont(ctx, 700, full ? 34 : 30, 'body');
    const bandW = ctx.measureText(r.band).width;
    ctx.fillStyle = C.ink2;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(r.band, x + w, ry + labelSize);
    setFont(ctx, 700, labelSize, 'display');
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'left';
    ctx.fillText(clip(ctx, r.label, w - bandW - 28), x, ry + labelSize);
    // Cetvel: puanın yeri bir işaretle gösterilir; dolgu yoktur (çok ya da az, iyi ya da kötü anlamı taşımaz).
    ctx.fillStyle = rgba(r.color, 0.2);
    rounded(ctx, x, barY, w, barH, barH / 2);
    ctx.fill();
    const kx = x + 18 + t * (w - 36);
    ctx.fillStyle = C.surface;
    ctx.strokeStyle = r.color;
    ctx.lineWidth = full ? 8 : 7;
    ctx.beginPath();
    ctx.arc(kx, barY + barH / 2, full ? 17 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (r.note && per >= (full ? 150 : 118)) {
      setFont(ctx, 400, full ? 32 : 28, 'body');
      ctx.fillStyle = C.ink2;
      ctx.fillText(clip(ctx, r.note, w), x, barY + barH + (full ? 50 : 42));
    }
  });
}

function drawRadar(ctx: Ctx, block: Extract<ShareBlock, { kind: 'radar' }>, x: number, y: number, w: number, h: number) {
  let top = y;
  if (block.title) {
    setFont(ctx, 700, 36, 'body');
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(clip(ctx, block.title, w), x, top + 36);
    top += 64;
  }
  let captionLines: string[] = [];
  if (block.caption) {
    setFont(ctx, 700, 34, 'body');
    captionLines = wrap(ctx, block.caption, w).slice(0, 2);
  }
  const captionH = captionLines.length > 0 ? captionLines.length * 46 + 30 : 0;
  const areaH = y + h - top - captionH;
  const R = Math.max(80, Math.min(w / 2 - 136, areaH / 2 - 56));
  const cx = x + w / 2;
  const cy = top + areaH / 2;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (deg: number, v: number) => {
    const r = (R * v) / block.max;
    return [cx + Math.cos(rad(deg)) * r, cy - Math.sin(rad(deg)) * r] as const;
  };
  ctx.lineJoin = 'round';
  // Halkalar ve eksenler.
  ctx.strokeStyle = C.rule;
  for (let v = block.min; v <= block.max; v++) {
    ctx.lineWidth = v === block.max ? 3 : 2;
    ctx.beginPath();
    block.axes.forEach((a, i) => {
      const [px, py] = pt(a.angle, v);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.lineWidth = 2;
  for (const a of block.axes) {
    const [px, py] = pt(a.angle, block.max);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
  // Puanı hesaplanamayan eksen çizilmez.
  const known = block.axes.filter((a) => a.value !== null);
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
  ctx.lineWidth = 5;
  ctx.stroke();
  for (const a of known) {
    const [px, py] = pt(a.angle, a.value!);
    ctx.fillStyle = a.highlight ? C.marker : C.ink;
    ctx.beginPath();
    ctx.arc(px, py, a.highlight ? 13 : 8, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const a of block.axes) {
    const cos = Math.cos(rad(a.angle));
    const sin = Math.sin(rad(a.angle));
    const lx = cx + cos * (R + 30);
    const ly = cy - sin * (R + 30);
    setFont(ctx, a.highlight ? 700 : 400, 32, 'body');
    ctx.fillStyle = a.highlight ? C.ink : C.ink2;
    ctx.textAlign = cos > 0.3 ? 'left' : cos < -0.3 ? 'right' : 'center';
    ctx.textBaseline = sin > 0.3 ? 'bottom' : sin < -0.3 ? 'top' : 'middle';
    ctx.fillText(a.label, lx, ly);
  }
  if (captionLines.length > 0) {
    setFont(ctx, 700, 34, 'body');
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    captionLines.forEach((l, i) => ctx.fillText(l, cx, y + h - captionH + 30 + 34 + i * 46));
  }
}

/** Kartı tuvalin tamamına çizer (tuval SHARE_W × SHARE_H olmalı). `host`: "olcekhane.com". */
export function drawShareCard(ctx: Ctx, card: ShareCard, host: string) {
  drawBackground(ctx);
  const W = SHARE_W - 2 * M;

  // Üst: işaret ve sitenin adı.
  drawLogo(ctx, M, 92, 68);
  setFont(ctx, 700, 54, 'display');
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Ölçekhane', M + 90, 92 + 54);

  // Kartın adı, (pilot testse) etiket ve testin adı.
  let y = 300;
  setFont(ctx, 700, 40, 'body');
  ctx.fillStyle = C.brassInk;
  ctx.fillText(card.kicker, M, y);
  if (card.pilot) {
    const kw = ctx.measureText(card.kicker).width;
    setFont(ctx, 700, 26, 'body');
    const pw = ctx.measureText(SHARE_PILOT).width + 36;
    ctx.fillStyle = rgba(C.brass, 0.16);
    rounded(ctx, M + kw + 22, y - 34, pw, 44, 22);
    ctx.fill();
    ctx.fillStyle = C.brassInk;
    ctx.fillText(SHARE_PILOT, M + kw + 40, y - 3);
  }
  setFont(ctx, 700, 80, 'display');
  let size = 80;
  let lines = wrap(ctx, card.title, W);
  if (lines.length > 2) {
    size = 66;
    setFont(ctx, 700, size, 'display');
    lines = wrap(ctx, card.title, W).slice(0, 3);
  }
  ctx.fillStyle = C.ink;
  y += 24;
  for (const l of lines) {
    y += size * 1.08;
    ctx.fillText(l, M, y);
  }

  if (card.headline) {
    y += 64;
    setFont(ctx, 400, 36, 'body');
    ctx.fillStyle = C.ink2;
    ctx.fillText(card.headline.label, M, y);
    y += 112;
    fit(ctx, card.headline.value, W, 700, 112, 'display', 56);
    ctx.fillStyle = C.ink;
    ctx.fillText(card.headline.value, M, y);
  }

  // Panel ve bloklar.
  const panelTop = y + 48;
  ctx.save();
  ctx.shadowColor = 'rgba(19, 32, 59, 0.12)';
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = C.surface;
  rounded(ctx, M - 24, panelTop, W + 48, PANEL_BOTTOM - panelTop, 44);
  ctx.fill();
  ctx.restore();
  const pad = 52;
  const ix = M - 24 + pad;
  const iw = W + 48 - 2 * pad;
  const gap = 56;
  const avail = PANEL_BOTTOM - panelTop - 2 * pad - gap * (card.blocks.length - 1);
  const needs = card.blocks.map((b) => (b.kind === 'rows' ? rowsNeed(b) : 560));
  const total = needs.reduce((a, b) => a + b, 0);
  let by = panelTop + pad;
  card.blocks.forEach((b, i) => {
    const bh = (avail * needs[i]) / total;
    if (b.kind === 'rows') drawRows(ctx, b, ix, by, iw, bh);
    else drawRadar(ctx, b, ix, by, iw, bh);
    by += bh + gap;
  });

  // Alt: testin adresi ve not.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, 700, 40, 'body');
  ctx.fillStyle = C.ink;
  ctx.fillText(SHARE_CTA, M, 1668);
  const url = `${host}${card.path}`;
  fit(ctx, url, W, 700, 46, 'display', 28);
  ctx.fillStyle = C.brassInk;
  ctx.fillText(url, M, 1734);
  setFont(ctx, 400, 28, 'body');
  ctx.fillStyle = C.ink3;
  wrap(ctx, SHARE_FOOTER, W)
    .slice(0, 2)
    .forEach((l, i) => ctx.fillText(l, M, 1808 + i * 38));
}
