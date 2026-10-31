import type { Drawing, Shape, Tone } from './visual-draw';

/**
 * Okuma, sesli okuma ve konu tarama raporlarının ek bölümlerindeki üç grafik (lib/reports/reading-parts.ts,
 * lib/reports/quiz-parts.ts). Öteki grafikler gibi basit şekillere çevrilir; ekranda (components/report/item-visual.tsx) ve
 * PDF'te (lib/pdf/simple-report.tsx) aynen çizilir (lib/reports/visual-draw.ts, drawVisual).
 *
 *  - Soru kutuları (`grid`): her kutu bir soru (ya da bir fikir); kutuda sorunun sırası. Satırlar soru türleri ya da konu
 *    alanlarıdır. Dolu kutu doğru, çerçeveli kutu yanlış, gri kutu "Bilmiyorum" ya da boş.
 *  - Metin haritası (`wordmap`): her satır bir cümle, her kutu bir kelime (genişliği kelimenin uzunluğuna göre). Kutunun
 *    biçimi kelimenin durumudur: doğru okundu, hata sayıldı, hata sayılmayan bir gözlem, net anlaşılamadı, okunmadı.
 *  - Sayı kutuları (`cells`): bir sayımın bütün değerleri yan yana kutular (ör. 8 sorudan 0–8 doğru); düzeyler kutuların
 *    altında adlarıyla, kişinin düzeyinin kutuları vurgulu, kişinin değeri dolu kutu.
 * Soru ve sayı kutularında renkler tek tonludur (pirinç ve gri): doğru ve yanlış için yeşil ya da kırmızı kullanılmaz. Metin
 * haritası raporun işaretli metniyle aynı renkleri kullanır (hata sayılan kırmızı, gözlem sarı).
 *
 * Bu dosya lib/reports/visuals.ts'ten çalışma anında bir şey almaz (döngü olmasın): yazı genişliği aynı formülle hesaplanır.
 */

/** Yazı genişliği tahmini: lib/reports/visuals.ts'teki textWidth ile aynı formül. */
const tw = (text: string, size: number) => text.length * size * 0.56;
const r2 = (v: number) => Math.round(v * 100) / 100;

/* ---------- Türler ---------- */

/** Soru kutusunun durumu: doğru (`on`), yanlış (`off`), "Bilmiyorum" ya da boş (`skip`). */
export type GridMark = 'on' | 'off' | 'skip';

export interface GridVisual {
  type: 'grid';
  /** Grafiğin ne gösterdiği (ekran okuyucu için). */
  label: string;
  /** Satırlar; satırın adı boşsa kutular grafiğin solundan başlar. */
  rows: { label: string; cells: { text: string; mark: GridMark }[] }[];
  /** Lejant: yalnızca kullanılan durumlar, sırayla. */
  legend: { mark: GridMark; text: string }[];
}

/** Kelimenin durumu: doğru okundu, hata sayıldı, hata sayılmayan gözlem, net anlaşılamadı (hata sayılmaz), okunmadı. */
export type WordMark = 'ok' | 'error' | 'note' | 'unclear' | 'unread';

export interface WordMapVisual {
  type: 'wordmap';
  label: string;
  /** Her satır bir cümle (adı cümlenin sırası); her kelime harf sayısı ve durumuyla; `ins`: kelimeden sonra eklenen kelime. */
  rows: { label: string; words: { len: number; mark: WordMark; ins?: number }[] }[];
  legend: { mark: WordMark; text: string }[];
}

export interface CellsVisual {
  type: 'cells';
  label: string;
  /** Sayımın en küçük ve en büyük değeri (ör. 0 ve 8 doğru). */
  min: number;
  max: number;
  value: number | null;
  valueLabel: string;
  /** Düzeyler: tam sayı aralıkları (iki uç dahil), `min`'den `max`'a boşluksuz. */
  zones: { from: number; to: number; label: string }[];
  /** Kişinin düzeyinin sırası; değer yoksa null. */
  active: number | null;
}

export type CellsKindVisual = GridVisual | WordMapVisual | CellsVisual;

/* ---------- Ortak ---------- */

/** Lejant öğesi: küçük bir kutu (kendi çizimiyle) ve adı; sığmayan öğe alt satıra geçer. */
function legend(
  items: { text: string; draw: (x: number, y: number, s: number) => Shape[] }[],
  top: number,
  W: number,
  fs: number,
  /** Kutunun genişliği, yüksekliğine göre (metin haritasında kelime kutusu gibi yatay). */
  wide = 1,
): { shapes: Shape[]; bottom: number } {
  const shapes: Shape[] = [];
  const ls = r2(fs * 0.85);
  const sw = r2(ls * 0.95);
  const bw = r2(sw * wide);
  let x = 0;
  let base = top + ls;
  for (const it of items) {
    const w = bw + ls * 0.45 + tw(it.text, ls);
    if (x > 0 && x + w > W) {
      x = 0;
      base += ls * 1.35;
    }
    shapes.push(...it.draw(x, base - sw * 0.85, sw));
    shapes.push({ k: 'text', x: r2(x + bw + ls * 0.45), y: r2(base), text: it.text, size: ls, weight: 400, fill: 'ink2', anchor: 'start' });
    x += w + ls * 1.3;
  }
  return { shapes, bottom: base + ls * 0.4 };
}

/* ---------- Soru kutuları ---------- */

const GRID_STYLE: Record<GridMark, { fill: Tone; stroke?: Tone; text: Tone }> = {
  on: { fill: 'fill', text: 'surface' },
  off: { fill: 'surface', stroke: 'ink3', text: 'ink' },
  skip: { fill: 'track2', text: 'ink3' },
};

function gridCell(mark: GridMark, x: number, y: number, s: number, sw: number): Shape {
  const st = GRID_STYLE[mark];
  return { k: 'rect', x: r2(x), y: r2(y), w: r2(s), h: r2(s), r: r2(s * 0.18), fill: st.fill, ...(st.stroke ? { stroke: st.stroke, sw } : {}) };
}

export function drawGrid(v: GridVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const s = r2(fs * 1.5);
  const g = r2(fs * 0.3);
  const step = s + g;
  const cs = r2(fs * 0.8);
  const sw = r2(Math.max(0.8, fs * 0.1));
  const labelW = Math.max(0, ...v.rows.map((r) => tw(r.label, fs)));
  // Adlar kısaysa kutuların solunda, uzunsa kutuların üstünde.
  const inline = labelW <= W * 0.4;
  let y = 0;
  for (const row of v.rows) {
    let x0 = 0;
    let top = y;
    if (row.label && inline) {
      x0 = labelW + fs * 0.6;
      shapes.push({ k: 'text', x: 0, y: r2(y + s / 2 + fs * 0.35), text: row.label, size: fs, weight: 600, fill: 'ink', anchor: 'start' });
    } else if (row.label) {
      shapes.push({ k: 'text', x: 0, y: r2(y + fs * 0.85), text: row.label, size: fs, weight: 600, fill: 'ink', anchor: 'start' });
      top = y + fs * 1.3;
    } else if (inline && labelW > 0) {
      x0 = labelW + fs * 0.6;
    }
    const per = Math.max(1, Math.floor((W - x0 + g) / step));
    row.cells.forEach((c, i) => {
      const cx = x0 + (i % per) * step;
      const cy = top + Math.floor(i / per) * step;
      shapes.push(gridCell(c.mark, cx, cy, s, sw));
      // Kutudaki sıra numarası (sığmıyorsa yazılmaz).
      if (tw(c.text, cs) <= s - 1) {
        shapes.push({ k: 'text', x: r2(cx + s / 2), y: r2(cy + s / 2 + cs * 0.35), text: c.text, size: cs, weight: 700, fill: GRID_STYLE[c.mark].text, anchor: 'middle' });
      }
    });
    const lines = Math.max(1, Math.ceil(row.cells.length / per));
    y = top + lines * step - g + fs * 0.6;
  }
  const lg = legend(
    v.legend.map((l) => ({ text: l.text, draw: (x: number, yy: number, size: number) => [gridCell(l.mark, x, yy, size, sw)] })),
    y - fs * 0.2,
    W,
    fs,
  );
  shapes.push(...lg.shapes);
  return { width: W, height: r2(lg.bottom), shapes };
}

/* ---------- Metin haritası ---------- */

function wordShapes(mark: WordMark, x: number, y: number, w: number, h: number, sw: number): Shape[] {
  switch (mark) {
    case 'ok':
      return [{ k: 'rect', x: r2(x), y: r2(y), w: r2(w), h: r2(h), r: r2(h * 0.25), fill: 'track2' }];
    // İşaretli metinle aynı renkler: hata sayılan kırmızı, hata sayılmayan gözlem sarı (pirinç "senin düzeyin" anlamında
    // kullanıldığı için burada kullanılmaz).
    case 'error':
      return [{ k: 'rect', x: r2(x), y: r2(y), w: r2(w), h: r2(h), r: r2(h * 0.25), fill: 'danger' }];
    case 'note':
      return [{ k: 'rect', x: r2(x), y: r2(y), w: r2(w), h: r2(h), r: r2(h * 0.25), fill: 'warnBg', stroke: 'warn', sw }];
    case 'unclear':
      return [{ k: 'rect', x: r2(x), y: r2(y), w: r2(w), h: r2(h), r: r2(h * 0.25), fill: 'surface', stroke: 'ink3', sw }];
    case 'unread':
      return [{ k: 'line', x1: r2(x), y1: r2(y + h / 2), x2: r2(x + w), y2: r2(y + h / 2), stroke: 'ink3', sw, dash: true }];
  }
}

export function drawWordMap(v: WordMapVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const ls = r2(fs * 0.8);
  const labelW = Math.max(tw('00', ls), ...v.rows.map((r) => tw(r.label, ls)));
  const x0 = labelW + fs * 0.5;
  const avail = W - x0;
  const h = r2(fs * 0.75);
  const g = r2(fs * 0.22);
  const unit = fs * 0.3;
  const minW = fs * 0.5;
  const insW = r2(fs * 0.3);
  const sw = r2(Math.max(0.7, fs * 0.08));
  let y = fs * 0.1;
  for (const row of v.rows) {
    shapes.push({ k: 'text', x: r2(labelW), y: r2(y + h / 2 + ls * 0.35), text: row.label, size: ls, weight: 400, fill: 'ink3', anchor: 'end' });
    let x = x0;
    for (const word of row.words) {
      const w = Math.min(avail, Math.max(minW, word.len * unit));
      const extra = word.ins ? g + insW : 0;
      if (x > x0 && x + w + extra > W + 0.01) {
        x = x0;
        y += h + fs * 0.25;
      }
      shapes.push(...wordShapes(word.mark, x, y, w, h, sw));
      x += w + g;
      // Ekleme: kelimeden sonra dar, dolu bir kutu (hata sayılır).
      if (word.ins) {
        if (x + insW > W + 0.01) {
          x = x0;
          y += h + fs * 0.25;
        }
        shapes.push({ k: 'rect', x: r2(x), y: r2(y), w: insW, h, r: r2(insW * 0.3), fill: 'danger' });
        x += insW + g;
      }
    }
    y += h + fs * 0.55;
  }
  const lg = legend(
    v.legend.map((l) => ({ text: l.text, draw: (x: number, yy: number, size: number) => wordShapes(l.mark, x, yy + size * 0.15, size * 1.4, size * 0.7, sw) })),
    y - fs * 0.1,
    W,
    fs,
    1.4,
  );
  shapes.push(...lg.shapes);
  return { width: W, height: r2(lg.bottom), shapes };
}

/* ---------- Sayı kutuları ---------- */

/** Bölge adlarını bölgelerin ortasına koyar; sığmayanlar sırayla ikinci ve üçüncü satıra geçer (birbirinin üstüne binmez). */
function placeLabels(spots: { text: string; cx: number; bold: boolean }[], W: number, size: number): { text: string; x: number; anchor: 'start' | 'middle' | 'end'; row: number; bold: boolean }[] {
  const gap = size * 0.7;
  const placed = spots.map((sp) => {
    const w = tw(sp.text, size);
    if (sp.cx - w / 2 < 0) return { ...sp, left: 0, w, x: 0, anchor: 'start' as const };
    if (sp.cx + w / 2 > W) return { ...sp, left: W - w, w, x: W, anchor: 'end' as const };
    return { ...sp, left: sp.cx - w / 2, w, x: sp.cx, anchor: 'middle' as const };
  });
  const fits = (k: number) => placed.every((sp, i) => i - k < 0 || sp.left >= placed[i - k].left + placed[i - k].w + gap);
  const k = [1, 2, 3, 4].find(fits) ?? 4;
  return placed.map((sp, i) => ({ text: sp.text, x: sp.x, anchor: sp.anchor, row: i % k, bold: sp.bold }));
}

/** Tam sayı aralığı: "0–3" ya da "8". */
export const cellRange = (z: { from: number; to: number }) => (z.from === z.to ? String(z.from) : `${z.from}–${z.to}`);

export function drawCells(v: CellsVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const n = v.max - v.min + 1;
  const g = r2(Math.max(1, fs * 0.18));
  const cw = (W - g * (n - 1)) / n;
  const ch = r2(fs * 1.3);
  const top = r2(fs * 1.75);
  const cs = r2(fs * 0.75);
  const numbers = tw(String(v.max), cs) <= cw - 1.5;
  const zoneOf = (k: number) => v.zones.findIndex((z) => k >= z.from && k <= z.to);
  const xOf = (k: number) => (k - v.min) * (cw + g);
  for (let k = v.min; k <= v.max; k++) {
    const zi = zoneOf(k);
    const mine = v.value !== null && k === v.value;
    const inActive = zi === v.active;
    const fill: Tone = mine ? 'fill' : inActive ? 'soft' : zi % 2 ? 'track2' : 'track';
    shapes.push({ k: 'rect', x: r2(xOf(k)), y: top, w: r2(cw), h: ch, r: r2(Math.min(cw, ch) * 0.18), fill, ...(inActive && !mine ? { stroke: 'fill' as const, sw: 0.8 } : {}) });
    if (numbers) {
      shapes.push({ k: 'text', x: r2(xOf(k) + cw / 2), y: r2(top + ch / 2 + cs * 0.35), text: String(k), size: cs, weight: mine ? 700 : 400, fill: mine ? 'surface' : 'ink3', anchor: 'middle' });
    }
  }
  // Kişinin değeri: kutunun üstünde üçgen ve değerin yazısı.
  if (v.value !== null) {
    const mx = xOf(v.value) + cw / 2;
    shapes.push({ k: 'path', d: `M${r2(mx - fs * 0.4)} ${r2(top - fs * 0.55)} L${r2(mx + fs * 0.4)} ${r2(top - fs * 0.55)} L${r2(mx)} ${r2(top - fs * 0.1)} Z`, fill: 'marker' });
    const w = tw(v.valueLabel, fs);
    const at = mx - w / 2 < 0 ? { x: 0, anchor: 'start' as const } : mx + w / 2 > W ? { x: W, anchor: 'end' as const } : { x: mx, anchor: 'middle' as const };
    shapes.push({ k: 'text', x: r2(at.x), y: r2(top - fs * 0.75), text: v.valueLabel, size: fs, weight: 700, fill: 'ink', anchor: at.anchor });
  }
  // Bölgelerin adları (sayılar kutulara sığmıyorsa aralıklarıyla).
  const ts = r2(fs * 0.9);
  const labels = placeLabels(
    v.zones.map((z, i) => ({ text: numbers ? z.label : `${z.label} ${cellRange(z)}`, cx: (xOf(z.from) + xOf(z.to) + cw) / 2, bold: i === v.active })),
    W,
    ts,
  );
  const base = top + ch + fs * 1.15;
  for (const l of labels) {
    shapes.push({ k: 'text', x: r2(l.x), y: r2(base + l.row * ts * 1.3), text: l.text, size: ts, weight: l.bold ? 700 : 400, fill: l.bold ? 'ink' : 'ink2', anchor: l.anchor });
  }
  const rows = Math.max(1, ...labels.map((l) => l.row + 1));
  return { width: W, height: r2(base + (rows - 1) * ts * 1.3 + ts * 0.4), shapes };
}

/* ---------- Sözel karşılık (ekran okuyucu) ---------- */

export function cellsDescription(v: CellsKindVisual): string {
  switch (v.type) {
    case 'grid': {
      const name = (m: GridMark) => v.legend.find((l) => l.mark === m)?.text ?? m;
      const rows = v.rows.map((r) => `${r.label ? `${r.label}: ` : ''}${r.cells.map((c) => `${c.text} ${name(c.mark)}`).join(', ')}`);
      return `${v.label}: ${rows.join('; ')}.`;
    }
    case 'wordmap': {
      const all = v.rows.flatMap((r) => r.words);
      const counts = v.legend.map((l) => `${l.text} ${all.filter((w) => w.mark === l.mark).length}`);
      const ins = all.reduce((k, w) => k + (w.ins ?? 0), 0);
      return `${v.label}: ${v.rows.length} cümle, ${all.length} kelime; ${counts.join(', ')}${ins ? `, ekleme ${ins}` : ''}.`;
    }
    case 'cells': {
      const where = v.value === null || v.active === null ? 'değer yok' : `${v.valueLabel}, ${v.zones[v.active].label} düzeyinde`;
      return `${v.label}: ${where}. Düzeyler: ${v.zones.map((z) => `${z.label} ${cellRange(z)}`).join(', ')}.`;
    }
  }
}
