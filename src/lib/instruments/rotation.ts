import { constrainedOrder, shuffle } from './sequences';
import type { RotationTrial } from './types';

/**
 * Zihinde döndürme görevinin şekil geometrisi ve deneme düzeni. Şekiller birim karelerden oluşur; ekranda, ağırlık
 * merkezleri etrafında döndürülerek çizilir. Bu dosyadaki üretim kuralları değişirse testin sürüm numarası artırılmalıdır.
 */

type Cell = readonly [number, number];

/** Döndürme farkları (derece): iki şekil arasındaki açı, 0 ile 180 arasında. */
export const DISPARITIES = [0, 45, 90, 135, 180] as const;

/** Açının iki şekil arasındaki döndürme farkı olarak karşılığı (0–180): ör. −45 ve 315 → 45. */
export function disparity(angle: number): number {
  const a = ((angle % 360) + 360) % 360;
  return Math.min(a, 360 - a);
}

/** Karelerin ağırlık merkezi (kare merkezlerinin ortalaması). */
export function centroid(cells: readonly Cell[]): { x: number; y: number } {
  const x = cells.reduce((s, [cx]) => s + cx + 0.5, 0) / cells.length;
  const y = cells.reduce((s, [, cy]) => s + cy + 0.5, 0) / cells.length;
  return { x, y };
}

/** Ağırlık merkezinden en uzak köşeye uzaklık: şekil hangi açıyla döndürülürse döndürülsün bu yarıçaplı dairenin içinde kalır. */
export function shapeRadius(cells: readonly Cell[]): number {
  const c = centroid(cells);
  let r = 0;
  for (const [x, y] of cells) {
    for (const [px, py] of [
      [x, y],
      [x + 1, y],
      [x, y + 1],
      [x + 1, y + 1],
    ]) {
      r = Math.max(r, Math.hypot(px - c.x, py - c.y));
    }
  }
  return r;
}

const k = (x: number, y: number) => `${x},${y}`;

/**
 * Şeklin dış çizgisi (SVG yolu), ağırlık merkezi (0, 0) olacak biçimde. Kareler tek tek çizilseydi döndürülmüş şekilde
 * kareler arasında ince çizgiler görünebilirdi; bu yüzden yalnızca dış kenar çizilir. Delikli ya da yalnızca köşeden
 * birleşen kareler desteklenmez (bu görevin şekillerinde yoktur).
 */
export function shapePath(cells: readonly Cell[]): string {
  const filled = new Set(cells.map(([x, y]) => k(x, y)));
  if (filled.size !== cells.length) throw new Error('Aynı kare iki kez verilmiş.');
  // Saat yönünde (y aşağı doğru) dış kenarlar: iki karenin ortak kenarı alınmaz.
  const next = new Map<string, [number, number]>();
  const add = (ax: number, ay: number, bx: number, by: number) => {
    if (next.has(k(ax, ay))) throw new Error('Şeklin kareleri yalnızca köşeden birleşiyor.');
    next.set(k(ax, ay), [bx, by]);
  };
  for (const [x, y] of cells) {
    if (!filled.has(k(x, y - 1))) add(x, y, x + 1, y);
    if (!filled.has(k(x + 1, y))) add(x + 1, y, x + 1, y + 1);
    if (!filled.has(k(x, y + 1))) add(x + 1, y + 1, x, y + 1);
    if (!filled.has(k(x - 1, y))) add(x, y + 1, x, y);
  }
  const start = next.keys().next().value as string;
  const pts: [number, number][] = [];
  let cur = start;
  do {
    const [x, y] = cur.split(',').map(Number);
    pts.push([x, y]);
    const [nx, ny] = next.get(cur)!;
    cur = k(nx, ny);
  } while (cur !== start && pts.length <= next.size);
  if (pts.length !== next.size) throw new Error('Şeklin dış çizgisi tek parça değil.');
  // Aynı doğru üzerindeki ara noktalar atılır.
  const corners = pts.filter((p, i) => {
    const a = pts[(i - 1 + pts.length) % pts.length];
    const b = pts[(i + 1) % pts.length];
    return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]);
  });
  const c = centroid(cells);
  const f = (v: number) => String(Math.round(v * 1000) / 1000);
  return `M${corners.map(([x, y]) => `${f(x - c.x)} ${f(y - c.y)}`).join('L')}Z`;
}

/** Karelerin yerleri, sol üst köşe (0, 0) olacak biçimde sıralanmış. */
function normalize(cells: readonly Cell[]): string {
  const mx = Math.min(...cells.map(([x]) => x));
  const my = Math.min(...cells.map(([, y]) => y));
  return cells
    .map(([x, y]) => [x - mx, y - my] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([x, y]) => k(x, y))
    .join(';');
}

const rotate90 = (cells: readonly Cell[]): Cell[] => cells.map(([x, y]) => [-y, x] as const);
const reflect = (cells: readonly Cell[]): Cell[] => cells.map(([x, y]) => [-x, y] as const);

/**
 * Şeklin hiçbir simetrisi yok mu? Dört dönüşü birbirinden farklı (döndürme simetrisi yok) ve ayna görüntüsü hiçbir
 * dönüşüne eşit değilse (ayna simetrisi yok) evet. Ancak böyle bir şekilde "aynı" ile "ayna görüntüsü" ayırt edilebilir
 * ve 180 derece döndürme, döndürülmemiş şekille karıştırılamaz.
 */
export function isAsymmetric(cells: readonly Cell[]): boolean {
  const turns: string[] = [];
  let c: Cell[] = [...cells];
  for (let i = 0; i < 4; i++) {
    turns.push(normalize(c));
    c = rotate90(c);
  }
  return new Set(turns).size === 4 && !turns.includes(normalize(reflect(cells)));
}

/**
 * Asıl denemeler, iki bölüm hâlinde. Her şekil her döndürme farkında bir kez "aynı", bir kez "ayna görüntüsü" olarak
 * gelir; ikisi ayrı bölümlerdedir. Her bölümde her farkta şekillerin yarısı "aynı", yarısı "ayna görüntüsü"dür; 45, 90
 * ve 135 derecede bunların da yarısı saat yönünde, yarısı tersine döndürülür (bir şeklin iki bölümdeki yönü terstir).
 * Sıra kuralları: bölümün ilk denemesi 90 derecedir (bölüm başındaki ısınma yavaşlığı, karşılaştırılan az ve çok
 * döndürülmüş gruplara girmesin); aynı şekil art arda gelmez; aynı cevap en çok 3 kez, aynı döndürme farkı en çok 2 kez
 * art arda gelir.
 */
export function rotationBlocks(shapeCount: number, rand: () => number): RotationTrial[][] {
  if (shapeCount % 4 !== 0) throw new Error('Şekil sayısı 4’ün katı olmalı.');
  const blocks: RotationTrial[][] = [[], []];
  const ids = [...Array(shapeCount).keys()];
  for (const d of DISPARITIES) {
    const order = shuffle(ids, rand);
    const sameFirst = order.slice(0, shapeCount / 2);
    const mirrorFirst = order.slice(shapeCount / 2);
    // Birinci bölümdeki yön: "aynı"ların yarısı ve "ayna"ların yarısı saat yönünde.
    const sign = new Map<number, 1 | -1>();
    for (const group of [sameFirst, mirrorFirst]) {
      shuffle(group, rand).forEach((s, i) => sign.set(s, i < group.length / 2 ? 1 : -1));
    }
    for (const s of ids) {
      const turns = d !== 0 && d !== 180;
      const a1 = turns ? d * sign.get(s)! : d;
      const a2 = turns ? -a1 : d;
      const mirror1 = !sameFirst.includes(s);
      blocks[0].push({ shape: s, angle: a1, mirror: mirror1 });
      blocks[1].push({ shape: s, angle: a2, mirror: !mirror1 });
    }
  }
  return blocks.map((b) =>
    constrainedOrder(b, rand, (before, next) => {
      if (before.length === 0) return disparity(next.angle) === 90;
      const last = before[before.length - 1];
      if (last && last.shape === next.shape) return false;
      let sameAnswer = 0;
      for (let i = before.length - 1; i >= 0 && before[i].mirror === next.mirror; i--) sameAnswer++;
      if (sameAnswer >= 3) return false;
      let sameDisparity = 0;
      for (let i = before.length - 1; i >= 0 && disparity(before[i].angle) === disparity(next.angle); i--) sameDisparity++;
      return sameDisparity < 2;
    }),
  );
}
