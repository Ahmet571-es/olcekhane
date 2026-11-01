import type { Drawing, Shape } from './visual-draw';

/**
 * "Günlük hayatta nasıl görünür" bölümünün iki grafiği (lib/reports/daily-parts.ts). Öteki grafikler gibi basit şekillere
 * çevrilir; ekranda (components/report/item-visual.tsx) ve PDF'te (lib/pdf/simple-report.tsx) aynen çizilir
 * (lib/reports/visual-draw.ts, drawVisual).
 *
 *  - İki uç (`poles`): anket testlerinde bir ölçeğin iki ucunun günlük hayattaki karşılığı (ör. "Temel bilgiyle yetinir" ↔
 *    "Konunun derinine iner") yatay bir hattın iki başında; kişinin düzeyinin bölgesi açık pirinçle, yeri kırmızı işaretle.
 *    Hat ölçeğin kendi aralığıdır (ör. 1–5); bölge kartın düzey çubuğundaki bölgenin aynısıdır. Renkler tek tonludur: iki
 *    uç da aynı gri, hiçbir uç iyi ya da kötü diye boyanmaz.
 *  - Kullanıldığı yerler (`contexts`): görev, okuma ve konu tarama testlerinde becerinin adı solda bir kutuda, üç dal sağda:
 *    ortamın adı (Okulda, Oyunda ve arkadaşlarla, Evde; yetişkinde İşte ya da günlük işlerde…) ve 2–4 sözcüklük örnek. Veri
 *    ve işaret yoktur: grafik kartın açıklamasını anlatır, sonuca göre değişmez.
 * Yazılar grafiğin dışına taşmaz ve birbirinin üstüne binmez (tests/gunluk-hayat.test.ts, tests/helpers/visual-check.ts).
 *
 * Bu dosya lib/reports/visuals.ts'ten çalışma anında bir şey almaz (döngü olmasın): yazı genişliği aynı formülle hesaplanır.
 */

/** Yazı genişliği tahmini: lib/reports/visuals.ts'teki textWidth ile aynı formül. */
const tw = (text: string, size: number) => text.length * size * 0.56;
const r2 = (v: number) => Math.round(v * 100) / 100;

/* ---------- Türler ---------- */

export interface PolesVisual {
  type: 'poles';
  /** Ölçeğin adı (ekran okuyucu için). */
  label: string;
  /** İki ucun günlük hayattaki karşılığı (2–4 sözcük). */
  low: string;
  high: string;
  /** Ölçeğin aralığı (kartın düzey çubuğuyla aynı). */
  min: number;
  max: number;
  /** Kişinin yeri (puan; düzeyin bölgesinin içinde kalır). Puan hesaplanamadıysa null: işaret ve bölge çizilmez. */
  value: number | null;
  /** Kişinin düzeyinin bölgesi ve adı (kartın rozetiyle aynı düzey). */
  zone: { from: number; to: number; label: string } | null;
  /** İşaretin altındaki ad: "Senin yerin", "Çocuğunuzun yeri". */
  marker: string;
}

export interface ContextsVisual {
  type: 'contexts';
  /** Becerinin tam adı (ekran okuyucu için). */
  label: string;
  /** Ortadaki kutuda becerinin kısa adı. */
  center: string;
  /** Üç dal: ortamın adı ve kısa örnek. */
  branches: { context: string; label: string }[];
}

export type DailyKindVisual = PolesVisual | ContextsVisual;

/** İki ucun adının ve dal örneğinin en çok uzunluğu (karakter): iki satıra sığar (tests/gunluk-hayat.test.ts). */
export const POLE_MAX_CHARS = 26;
export const CENTER_MAX_CHARS = 18;
export const BRANCH_MAX_CHARS = 28;

/* ---------- Ortak ---------- */

/** Uzun adı iki satıra böler (satırların uzunlukları en yakın olacak boşluktan). */
function twoLines(label: string): string[] {
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
 * Bir adı `room` genişliğine sığdırır: tam boyda tek satır; olmazsa en çok %15 küçülterek tek satır; olmazsa iki satır (iki
 * satırın en uzunu sığmazsa yazı küçülür, en az yazı boyunun %75'i).
 */
function fit(text: string, size: number, room: number): { lines: string[]; size: number } {
  if (tw(text, size) <= room) return { lines: [text], size };
  if (tw(text, size * 0.85) <= room) return { lines: [text], size: r2(room / (text.length * 0.56)) };
  const lines = twoLines(text);
  const longest = Math.max(...lines.map((l) => l.length));
  return { lines, size: r2(Math.max(size * 0.75, Math.min(size, room / (longest * 0.56)))) };
}

/** Yazıyı verilen noktaya ortalar; grafiğin kenarından taşacaksa kenara yaslar. */
function centered(text: string, x: number, size: number, W: number): { x: number; anchor: 'start' | 'middle' | 'end' } {
  const w = tw(text, size);
  if (x - w / 2 < 0) return { x: 0, anchor: 'start' };
  if (x + w / 2 > W) return { x: W, anchor: 'end' };
  return { x, anchor: 'middle' };
}

/* ---------- İki uç ---------- */

/**
 * Üstte iki ucun adı (solda düşük uç, sağda yüksek uç; gerekirse iki satır), altında hat: iki ucunda birer daire, kişinin
 * düzeyinin bölgesi açık pirinç, yeri kırmızı üçgen ve çizgiyle; işaretin altında adı ("Senin yerin").
 */
export function drawPoles(v: PolesVisual, W: number, fs: number): Drawing {
  const shapes: Shape[] = [];
  const half = W * 0.47;
  const low = fit(v.low, fs, half);
  const high = fit(v.high, fs, half);
  const lh = (f: { size: number }) => f.size * 1.18;
  let y = fs * 0.85;
  const rows = Math.max(low.lines.length, high.lines.length);
  low.lines.forEach((line, i) => shapes.push({ k: 'text', x: 0, y: r2(y + i * lh(low)), text: line, size: low.size, weight: 600, fill: 'ink', anchor: 'start' }));
  high.lines.forEach((line, i) => shapes.push({ k: 'text', x: W, y: r2(y + i * lh(high)), text: line, size: high.size, weight: 600, fill: 'ink', anchor: 'end' }));
  y += (rows - 1) * lh({ size: fs }) + fs * 1.15;
  // Hat: kişinin işareti hattın üstünde (üçgen), adı altında.
  const pad = r2(fs * 0.45);
  const span = v.max - v.min || 1;
  const x = (val: number) => pad + ((Math.min(v.max, Math.max(v.min, val)) - v.min) / span) * (W - 2 * pad);
  const markerTop = y;
  const trackY = r2(markerTop + fs * 0.85);
  const trackH = r2(fs * 0.55);
  shapes.push({ k: 'rect', x: pad, y: trackY, w: r2(W - 2 * pad), h: trackH, r: r2(trackH / 2), fill: 'track' });
  if (v.value !== null && v.zone) {
    const zx = x(v.zone.from);
    shapes.push({ k: 'rect', x: r2(zx), y: r2(trackY - fs * 0.12), w: r2(Math.max(1.5, x(v.zone.to) - zx)), h: r2(trackH + fs * 0.24), r: r2(trackH / 2), fill: 'soft', stroke: 'fill', sw: 0.8 });
  }
  const cy = r2(trackY + trackH / 2);
  const dr = r2(fs * 0.36);
  shapes.push({ k: 'circle', x: r2(pad), y: cy, r: dr, fill: 'ink3' });
  shapes.push({ k: 'circle', x: r2(W - pad), y: cy, r: dr, fill: 'ink3' });
  let bottom = trackY + trackH + fs * 0.3;
  const ts = r2(fs * 0.85);
  if (v.value !== null) {
    const mx = r2(x(v.value));
    shapes.push({ k: 'line', x1: mx, y1: r2(trackY - fs * 0.25), x2: mx, y2: r2(trackY + trackH + fs * 0.25), stroke: 'marker', sw: r2(Math.max(1.4, fs * 0.2)) });
    shapes.push({ k: 'path', d: `M${r2(mx - fs * 0.42)} ${r2(markerTop)} L${r2(mx + fs * 0.42)} ${r2(markerTop)} L${mx} ${r2(trackY - fs * 0.2)} Z`, fill: 'marker' });
    const at = centered(v.marker, mx, ts, W);
    bottom = trackY + trackH + fs * 0.3 + ts * 1.05;
    shapes.push({ k: 'text', x: r2(at.x), y: r2(bottom), text: v.marker, size: ts, weight: 700, fill: 'ink', anchor: at.anchor });
  } else {
    bottom = trackY + trackH + fs * 0.3 + ts * 1.05;
    shapes.push({ k: 'text', x: r2(W / 2), y: r2(bottom), text: 'Yer belirlenemedi', size: ts, weight: 400, fill: 'ink3', anchor: 'middle' });
  }
  return { width: W, height: r2(bottom + ts * 0.35), shapes };
}

/* ---------- Kullanıldığı yerler ---------- */

/**
 * Solda becerinin kısa adı (açık pirinç kutu), sağda üç dal: her dalda ortamın adı (küçük, gri) ve örnek (koyu; gerekirse
 * iki satır). Kutudan çıkan çizgi bir gövdeye, gövdeden her dala gider; dalın başında küçük bir daire.
 */
export function drawContexts(v: ContextsVisual, W: number, base: number): Drawing {
  const shapes: Shape[] = [];
  // Şemada öteki grafiklerden çok yazı var: yazılar biraz büyük (ortam adları en az yazı boyunun %90'ı).
  const fs = base * 1.1;
  const padX = fs * 0.55;
  // Ortadaki kutu: en çok genişliğin %36'sı; ad sığmazsa iki satır.
  const maxBox = W * 0.36;
  const center = fit(v.center, fs, maxBox - 2 * padX);
  const boxW = r2(Math.min(maxBox, Math.max(...center.lines.map((l) => tw(l, center.size))) + 2 * padX));
  const gap = fs * 2.1;
  const x0 = boxW + gap;
  const room = W - x0;
  const hs = r2(base * 0.9);
  // Dallar: ortamın adı ve örnek.
  const blocks = v.branches.map((b) => {
    const head = fit(b.context, hs, room);
    const label = fit(b.label, fs, room);
    const h = head.lines.length * head.size * 1.15 + label.lines.length * label.size * 1.18;
    return { head, label, h };
  });
  const vgap = fs * 0.75;
  const total = blocks.reduce((n, b) => n + b.h, 0) + vgap * (blocks.length - 1);
  const boxH = r2(center.lines.length * center.size * 1.2 + fs * 0.9);
  const height = Math.max(total, boxH) + fs * 0.4;
  const top = (height - total) / 2;
  // Kutu, dikeyde dalların ortasında.
  const boxY = r2((height - boxH) / 2);
  shapes.push({ k: 'rect', x: 0, y: boxY, w: boxW, h: boxH, r: r2(fs * 0.55), fill: 'soft', stroke: 'fill', sw: 1 });
  const textTop = boxY + (boxH - center.lines.length * center.size * 1.2) / 2 + center.size * 0.92;
  center.lines.forEach((line, i) =>
    shapes.push({ k: 'text', x: r2(boxW / 2), y: r2(textTop + i * center.size * 1.2), text: line, size: center.size, weight: 700, fill: 'ink', anchor: 'middle' }),
  );
  // Dallar ve bağlantılar.
  const trunk = r2(boxW + gap * 0.45);
  const midY = r2(boxY + boxH / 2);
  shapes.push({ k: 'line', x1: boxW, y1: midY, x2: trunk, y2: midY, stroke: 'axis', sw: 1.2 });
  let y = top;
  const anchors: number[] = [];
  for (const b of blocks) {
    let ty = y + b.head.size * 0.92;
    b.head.lines.forEach((line) => {
      shapes.push({ k: 'text', x: r2(x0), y: r2(ty), text: line, size: b.head.size, weight: 400, fill: 'ink3', anchor: 'start' });
      ty += b.head.size * 1.15;
    });
    const labelTop = ty - b.head.size * 0.92 + b.label.size * 0.95;
    b.label.lines.forEach((line, i) =>
      shapes.push({ k: 'text', x: r2(x0), y: r2(labelTop + i * b.label.size * 1.18), text: line, size: b.label.size, weight: 600, fill: 'ink', anchor: 'start' }),
    );
    // Dal, örneğin ilk satırının ortasına bağlanır.
    const ay = r2(labelTop - b.label.size * 0.32);
    anchors.push(ay);
    y += b.h + vgap;
  }
  const lo = Math.min(midY, ...anchors);
  const hi = Math.max(midY, ...anchors);
  shapes.push({ k: 'line', x1: trunk, y1: r2(lo), x2: trunk, y2: r2(hi), stroke: 'axis', sw: 1.2 });
  const dr = r2(fs * 0.24);
  for (const ay of anchors) {
    shapes.push({ k: 'line', x1: trunk, y1: ay, x2: r2(x0 - fs * 0.45 - dr), y2: ay, stroke: 'axis', sw: 1.2 });
    shapes.push({ k: 'circle', x: r2(x0 - fs * 0.45), y: ay, r: dr, fill: 'fill' });
  }
  return { width: W, height: r2(height), shapes };
}

/* ---------- Ekran okuyucu ---------- */

export function dailyDescription(v: DailyKindVisual): string {
  if (v.type === 'poles') {
    const where = v.value === null || !v.zone ? 'yer belirlenemedi' : `${v.marker}: ${v.zone.label} düzeyinin bölgesinde`;
    return `${v.label}: bir uçta “${v.low}”, öbür uçta “${v.high}”; ${where}.`;
  }
  return `${v.label}: ${v.branches.map((b) => `${b.context}: ${b.label}`).join('; ')}.`;
}
