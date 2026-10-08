import { shuffle } from './sequences';
import type { MatrixCell, MatrixFill, MatrixFrame, MatrixItem, MatrixRule, MatrixShape } from './types';

/**
 * Şekil akıl yürütme sorularının üretimi ve çizimi.
 *
 * Bir soru, özelliklerin (şekil, sayı, büyüklük, renk, yön, çerçeve, çizgiler, halkadaki noktalar) 3×3'lük tablodaki
 * değerleriyle tanımlanır; değerler satır kurallarıyla yazılır (all, byRow, byCol, latin, prog, arith, setOp, turn). Tablonun
 * dokuzuncu parçası doğru cevaptır.
 *
 * Seçenekler (Hu ve ark., 2021, "attribute bisection tree" düzeni): doğru cevabın üç özelliği için birer yanlış değer
 * seçilir ve sekiz seçenek, bu üç değişikliğin bütün birleşimleridir (2 × 2 × 2; aynı özelliğe iki değişiklik de
 * uygulanabilir, ör. `cycle`). Böylece her özellikte doğru cevabın değeri seçeneklerin en çok yarısında bulunur:
 * seçeneklere bakarak (tabloyu çözmeden) doğru cevabı bulmanın bir yolu yoktur. Yanlış değerler olabildiğince tablodaki
 * değerlerdir (ör. soldaki parçanın tekrarı, kuralın ters yönde uygulanması, birleştirmede ortak çizginin silinmemesi,
 * çıkarmada toplama): bunlar bu tür sorularda sık yapılan hatalardır. Tek özelliğin değiştiği kolay sorularda tabloda
 * başka değer olmadığı için bazı yanlış seçenekler tabloda hiç görülmeyen bir özellik taşır (ör. hepsi siyahken gri);
 * bu seçenekler kural bulunmadan da elenebilir.
 *
 * Her sorunun tek doğru cevabı olduğu, tablodan bağımsız bir çözücüyle denetlenir (tests/sekil-akil-yurutme.test.ts):
 * bilinen kural türlerinin satır, sütun ve çapraz yönlerdeki bütün yorumları aynı cevabı vermelidir.
 */

export type Row<T> = [T, T, T];
export type Grid<T> = [Row<T>, Row<T>, Row<T>];

type Values = {
  [K in keyof MatrixCell]-?: NonNullable<MatrixCell[K]>;
};

const grid = <T>(f: (r: number, c: number) => T): Grid<T> =>
  [0, 1, 2].map((r) => [0, 1, 2].map((c) => f(r, c))) as Grid<T>;

/** Bütün parçalarda aynı değer. */
export const all = <T>(v: T): Grid<T> => grid(() => v);
/** Her satır kendi değerini taşır (satır boyunca değişmez). */
export const byRow = <T>(v: Row<T>): Grid<T> => grid((r) => v[r]);
/** Her sütun kendi değerini taşır: bütün satırlar aynı sırayı izler. */
export const byCol = <T>(v: Row<T>): Grid<T> => grid((_, c) => v[c]);
/**
 * Üçlü dağılım: üç değer her satırda ve her sütunda birer kez yer alır. `shift` 1 ise her satır bir öncekinin bir sola
 * kaydırılmışıdır, 2 ise bir sağa.
 */
export const latin = <T>(v: Row<T>, shift: 1 | 2): Grid<T> => grid((r, c) => v[(c + shift * r) % 3]);
/** Düzenli değişim: her satır kendi başlangıç değerinden başlar ve her sütunda `step` kadar değişir; `mod` verilirse değer başa döner (yön, halka). */
export const prog = (starts: Row<number>, step: number, mod?: number): Grid<number> =>
  grid((r, c) => {
    const v = starts[r] + step * c;
    return mod ? ((v % mod) + mod) % mod : v;
  });
/** Toplama ya da çıkarma: her satırın ilk iki değeri verilir; üçüncüsü bunların toplamı ya da farkıdır. */
export const arith = (pairs: Row<[number, number]>, op: '+' | '-'): Grid<number> =>
  pairs.map(([a, b]) => [a, b, op === '+' ? a + b : a - b]) as Grid<number>;
/**
 * Küme işlemi (çizgiler ya da halkadaki noktalar): her satırın ilk iki kümesi verilir. "or": birleşim (üst üste koyma),
 * "xor": ortak olanlar silinir, yalnızca birinde olanlar kalır.
 */
export const setOp = (pairs: Row<[number[], number[]]>, op: 'or' | 'xor'): Grid<number[]> =>
  pairs.map(([a, b]) => {
    const both = op === 'or' ? [...new Set([...a, ...b])] : [...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x))];
    return [sorted(a), sorted(b), sorted(both)];
  }) as Grid<number[]>;
/** Halkada dönme: her satırın noktaları her sütunda `step` yuva ilerler (artı saat yönünde). */
export const turn = (starts: Row<number[]>, step: number): Grid<number[]> =>
  grid((r, c) => sorted(starts[r].map((p) => (((p + step * c) % 8) + 8) % 8)));

const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);

/** Seçenekleri üreten bir değişiklik: doğru cevabın bir özelliğini değiştirir. */
export interface Variant {
  /** Değişikliğin kısa adı (denetim ve belgeleme için). */
  name: string;
  apply: (cell: MatrixCell) => MatrixCell;
}

/** Bir özelliğin değeri başka bir değerle değiştirilir. */
export function change<K extends keyof MatrixCell>(attr: K, to: NonNullable<MatrixCell[K]>): Variant {
  return { name: `${attr}=${JSON.stringify(to)}`, apply: (c) => ({ ...c, [attr]: to }) };
}
/** Bir çizgi ya da nokta eklenir (yoksa) ya da silinir (varsa). */
export function toggle(attr: 'lines' | 'dots' | 'grayDots', element: number): Variant {
  return {
    name: `${attr}^${element}`,
    apply: (c) => {
      const cur = c[attr] ?? [];
      return { ...c, [attr]: sorted(cur.includes(element) ? cur.filter((x) => x !== element) : [...cur, element]) };
    },
  };
}
/** Halkadaki noktalar `by` yuva kaydırılır. */
export function shift(attr: 'dots' | 'grayDots', by: number): Variant {
  return { name: `${attr}+${by}`, apply: (c) => ({ ...c, [attr]: sorted((c[attr] ?? []).map((p) => (((p + by) % 8) + 8) % 8)) }) };
}
/** Okun yönü `by` derece döndürülür. */
export function rotate(by: number): Variant {
  return { name: `angle+${by}`, apply: (c) => ({ ...c, angle: ((((c.angle ?? 0) + by) % 360) + 360) % 360 }) };
}
/**
 * Bir özelliğin değeri, verilen dört değerlik listede `steps` adım ileri kaydırılır (sonda başa döner). Aynı listeyle +1
 * ve +2 adımlık iki değişiklik birlikte kullanılınca dört farklı değer çıkar: doğru cevap listenin başında olmalıdır.
 * Böylece yanlış değerlerin çoğu tablodaki değerlerden seçilebilir.
 */
export function cycle<K extends 'shape' | 'count' | 'frame'>(attr: K, values: readonly NonNullable<MatrixCell[K]>[], steps: number): Variant {
  return {
    name: `${attr}~${steps}`,
    apply: (c) => {
      const i = values.indexOf(c[attr] as NonNullable<MatrixCell[K]>);
      if (i < 0) throw new Error(`cycle: ${String(c[attr])} listede yok`);
      return { ...c, [attr]: values[(i + steps) % values.length] };
    },
  };
}

/** Siyah ve gri noktalar yer değiştirir. */
export function swapDots(): Variant {
  return { name: 'dots<->grayDots', apply: (c) => ({ ...c, dots: c.grayDots ?? [], grayDots: c.dots ?? [] }) };
}

export interface MatrixSpec {
  key: string;
  level: MatrixItem['level'];
  rule: MatrixRule;
  /** Her özelliğin tablodaki değerleri. */
  grid: { [K in keyof Values]?: Grid<Values[K]> };
  /** Seçenekleri üreten üç değişiklik. */
  variants: [Variant, Variant, Variant];
}

/** Bir parçanın karşılaştırma için tek biçimli yazımı: kümeler sıralı, yön 0–359. */
export function cellKey(cell: MatrixCell): string {
  const keys = Object.keys(cell).sort() as (keyof MatrixCell)[];
  const norm: Record<string, unknown> = {};
  for (const k of keys) {
    const v = cell[k];
    if (v === undefined) continue;
    norm[k] = Array.isArray(v) ? sorted(v) : k === 'angle' ? (((v as number) % 360) + 360) % 360 : v;
  }
  return JSON.stringify(norm);
}

/** Tablonun dokuz parçası (satır satır); dokuzuncusu doğru cevaptır. */
export function specCells(spec: MatrixSpec): MatrixCell[] {
  const cells: MatrixCell[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell: Record<string, unknown> = {};
      for (const [attr, g] of Object.entries(spec.grid) as [keyof MatrixCell, Grid<unknown>][]) {
        const v = g[r][c];
        cell[attr] = Array.isArray(v) ? sorted(v as number[]) : v;
      }
      cells.push(cell as MatrixCell);
    }
  }
  return cells;
}

/**
 * Soruyu kurar: tablonun ilk sekiz parçası ve sekiz seçenek. Doğru cevap `answerAt` (0–7) sırasına konur; öteki
 * seçeneklerin sırası `rand` ile belirlenir. `distance`: her seçeneğin doğru cevaptan kaç değişiklikle ayrıldığı (0–3).
 * Seçeneklerden ikisi aynıysa hata verir.
 */
export function buildMatrixItem(spec: MatrixSpec, answerAt: number, rand: () => number): { item: MatrixItem; answer: number; distance: number[] } {
  const nine = specCells(spec);
  const correct = nine[8];
  const cube = Array.from({ length: 8 }, (_, mask) =>
    spec.variants.reduce((cell, v, bit) => (mask & (1 << bit) ? v.apply(cell) : cell), correct),
  );
  const keys = new Set(cube.map(cellKey));
  if (keys.size !== 8) throw new Error(`${spec.key}: seçeneklerden bazıları aynı`);
  const others = shuffle([1, 2, 3, 4, 5, 6, 7], rand);
  const order: number[] = [];
  for (let pos = 0, k = 0; pos < 8; pos++) order.push(pos === answerAt ? 0 : others[k++]);
  const bits = (mask: number) => (mask & 1) + ((mask >> 1) & 1) + ((mask >> 2) & 1);
  return {
    item: { key: spec.key, level: spec.level, rule: spec.rule, cells: nine.slice(0, 8), options: order.map((m) => cube[m]) },
    answer: answerAt + 1,
    distance: order.map(bits),
  };
}

/* ---------- Çizim ---------- */

/** Çizimde kullanılan renkler: kâğıt gibi her temada aynı (siyah, gri ve beyaz). */
export const MATRIX_INK = '#1b2333';
/** Gri: beyaz zeminde 3:1'in üstünde karşıtlık (WCAG, çizimler), siyahtan da açıkça ayrılır. */
export const MATRIX_GRAY = '#8b929e';
export const MATRIX_PAPER = '#ffffff';

export type MatrixPrim =
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: string; stroke: string; sw: number }
  | { kind: 'poly'; points: [number, number][]; fill: string; stroke: string; sw: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; sw: number };

/** Aynı şekillerin yerleşimi (100 × 100 birimlik parçada): şekil sayısına göre merkezler. */
const LAYOUT: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [29, 50],
    [71, 50],
  ],
  3: [
    [50, 28],
    [28, 71],
    [72, 71],
  ],
  4: [
    [29, 29],
    [71, 29],
    [29, 71],
    [71, 71],
  ],
  5: [
    [27, 27],
    [73, 27],
    [50, 50],
    [27, 73],
    [73, 73],
  ],
};
/** Sorudaki en büyük şekil sayısına göre şekillerin yarıçapı: bir sorudaki bütün şekiller aynı büyüklükte çizilir. */
const RADIUS: Record<number, number> = { 1: 34, 2: 18, 3: 15, 4: 15, 5: 11.5 };
/** Büyüklük özelliğinin yarıçapa etkisi (yalnızca tek şekilli sorularda değişir). */
const SIZE: Record<number, number> = { 1: 0.5, 2: 0.75, 3: 1 };
const STROKE = 2.6;

/** Sorudaki en büyük şekil sayısı (tablo ve seçenekler): şekillerin büyüklüğü buna göre belirlenir. */
export function itemMaxCount(item: Pick<MatrixItem, 'cells' | 'options'>): number {
  return Math.max(1, ...[...item.cells, ...item.options].map((c) => c.count ?? 1));
}

const FILL: Record<MatrixFill, string> = { empty: MATRIX_PAPER, gray: MATRIX_GRAY, black: MATRIX_INK };

function rotatePoints(points: [number, number][], cx: number, cy: number, deg: number): [number, number][] {
  if (!deg) return points;
  const a = (deg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return points.map(([x, y]) => [cx + (x - cx) * cos - (y - cy) * sin, cy + (x - cx) * sin + (y - cy) * cos]);
}

/** Bir şeklin çizimi: merkezi (cx, cy), dış yarıçapı r. */
function shapePrim(shape: MatrixShape, cx: number, cy: number, r: number, fill: MatrixFill, angle = 0): MatrixPrim {
  const style = { fill: FILL[fill], stroke: MATRIX_INK, sw: STROKE };
  const poly = (pts: [number, number][]): MatrixPrim => ({ kind: 'poly', points: rotatePoints(pts, cx, cy, angle), ...style });
  switch (shape) {
    case 'circle':
      return { kind: 'circle', cx, cy, r: r * 0.9, ...style };
    case 'square': {
      const h = r * 0.78;
      return poly([
        [cx - h, cy - h],
        [cx + h, cy - h],
        [cx + h, cy + h],
        [cx - h, cy + h],
      ]);
    }
    case 'triangle': {
      // Eşkenar üçgen: çevresini saran kutu merkezde olsun diye ağırlık merkezi biraz aşağıdadır.
      const y = cy + r * 0.2;
      return poly([
        [cx, y - r],
        [cx + r * 0.866, y + r * 0.5],
        [cx - r * 0.866, y + r * 0.5],
      ]);
    }
    case 'diamond':
      return poly([
        [cx, cy - r],
        [cx + r * 0.72, cy],
        [cx, cy + r],
        [cx - r * 0.72, cy],
      ]);
    case 'star': {
      const pts: [number, number][] = [];
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5;
        const rr = i % 2 === 0 ? r : r * 0.45;
        pts.push([cx + rr * Math.sin(a), cy + r * 0.08 - rr * Math.cos(a)]);
      }
      return poly(pts);
    }
    case 'cross': {
      const w = r * 0.32;
      const e = r * 0.9;
      return poly([
        [cx - w, cy - e],
        [cx + w, cy - e],
        [cx + w, cy - w],
        [cx + e, cy - w],
        [cx + e, cy + w],
        [cx + w, cy + w],
        [cx + w, cy + e],
        [cx - w, cy + e],
        [cx - w, cy + w],
        [cx - e, cy + w],
        [cx - e, cy - w],
        [cx - w, cy - w],
      ]);
    }
    case 'arrow': {
      // Yukarıyı gösteren ok; `angle` kadar saat yönünde döndürülür.
      const sw = r * 0.2;
      const head = r * 0.62;
      const neck = cy - r * 0.05;
      return poly([
        [cx, cy - r],
        [cx + head, neck],
        [cx + sw, neck],
        [cx + sw, cy + r],
        [cx - sw, cy + r],
        [cx - sw, neck],
        [cx - head, neck],
      ]);
    }
  }
}

/** Çerçevenin içindeki şeklin merkezi (üçgen çerçevede biraz aşağıda). */
const FRAME_CENTER: Record<MatrixFrame, [number, number]> = { circle: [50, 50], square: [50, 50], diamond: [50, 50], triangle: [50, 59] };

function framePrim(frame: MatrixFrame): MatrixPrim {
  const style = { fill: 'none', stroke: MATRIX_INK, sw: STROKE };
  switch (frame) {
    case 'circle':
      return { kind: 'circle', cx: 50, cy: 50, r: 41, ...style };
    case 'square':
      return {
        kind: 'poly',
        points: [
          [12, 12],
          [88, 12],
          [88, 88],
          [12, 88],
        ],
        ...style,
      };
    case 'diamond':
      return {
        kind: 'poly',
        points: [
          [50, 6],
          [86, 50],
          [50, 94],
          [14, 50],
        ],
        ...style,
      };
    case 'triangle':
      return {
        kind: 'poly',
        points: [
          [50, 10],
          [92, 83],
          [8, 83],
        ],
        ...style,
      };
  }
}

/** Çizgilerin uçları (iç karede, 22–78). */
export const LINE_ENDS: Record<number, [number, number, number, number]> = {
  0: [22, 22, 78, 22],
  1: [78, 22, 78, 78],
  2: [22, 78, 78, 78],
  3: [22, 22, 22, 78],
  4: [22, 22, 78, 78],
  5: [78, 22, 22, 78],
  6: [22, 50, 78, 50],
  7: [50, 22, 50, 78],
};

/** Halkadaki yuvanın merkezi: 0 üstte, saat yönünde 45 derece arayla. */
export function ringSlot(i: number): [number, number] {
  const a = (i * Math.PI) / 4;
  return [50 + 34 * Math.sin(a), 50 - 34 * Math.cos(a)];
}

/** Bir parçanın çizimi (100 × 100 birim). `maxCount`: sorudaki en büyük şekil sayısı. */
export function cellPrims(cell: MatrixCell, maxCount: number): MatrixPrim[] {
  const out: MatrixPrim[] = [];
  const fill = cell.fill ?? 'black';
  if (cell.dots || cell.grayDots) {
    for (let i = 0; i < 8; i++) {
      const [x, y] = ringSlot(i);
      const black = cell.dots?.includes(i);
      const gray = cell.grayDots?.includes(i);
      out.push(
        black || gray
          ? { kind: 'circle', cx: x, cy: y, r: 8, fill: black ? MATRIX_INK : MATRIX_GRAY, stroke: MATRIX_INK, sw: 2 }
          : { kind: 'circle', cx: x, cy: y, r: 5, fill: MATRIX_PAPER, stroke: MATRIX_GRAY, sw: 1.6 },
      );
    }
    if (cell.shape) out.push(shapePrim(cell.shape, 50, 50, 13, fill, cell.angle));
    return out;
  }
  if (cell.frame) {
    out.push(framePrim(cell.frame));
    if (cell.shape) {
      const [x, y] = FRAME_CENTER[cell.frame];
      out.push(shapePrim(cell.shape, x, y, 14, fill, cell.angle));
    }
    return out;
  }
  if (cell.lines) {
    for (const l of cell.lines) {
      const [x1, y1, x2, y2] = LINE_ENDS[l];
      out.push({ kind: 'line', x1, y1, x2, y2, sw: 5 });
    }
    return out;
  }
  if (cell.shape) {
    const count = cell.count ?? 1;
    const r = RADIUS[Math.min(5, Math.max(1, maxCount))] * (cell.size ? SIZE[cell.size] : 1);
    for (const [x, y] of LAYOUT[count]) out.push(shapePrim(cell.shape, x, y, r, fill, cell.angle));
  }
  return out;
}

/* ---------- Sözlü anlatım (ekran okuyucular için) ---------- */

const SHAPE_NAMES: Record<MatrixShape, string> = {
  circle: 'daire',
  square: 'kare',
  triangle: 'üçgen',
  diamond: 'eşkenar dörtgen',
  star: 'yıldız',
  cross: 'artı',
  arrow: 'ok',
};
const FRAME_NAMES: Record<MatrixFrame, string> = { circle: 'daire', square: 'kare', triangle: 'üçgen', diamond: 'eşkenar dörtgen' };
const FILL_NAMES: Record<MatrixFill, string> = { empty: 'içi boş', gray: 'gri', black: 'siyah' };
const SIZE_NAMES: Record<number, string> = { 1: 'küçük', 2: 'orta boy', 3: 'büyük' };
const DIRECTIONS = ['yukarıyı', 'sağ üstü', 'sağı', 'sağ altı', 'aşağıyı', 'sol altı', 'solu', 'sol üstü'];
const SLOT_NAMES = ['üstte', 'sağ üstte', 'sağda', 'sağ altta', 'altta', 'sol altta', 'solda', 'sol üstte'];
const LINE_NAMES = ['üst kenar', 'sağ kenar', 'alt kenar', 'sol kenar', 'sol üstten sağ alta çapraz', 'sağ üstten sol alta çapraz', 'ortada yatay', 'ortada dikey'];

const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`);

function shapeWords(cell: MatrixCell): string {
  const words = [cell.size ? SIZE_NAMES[cell.size] : '', FILL_NAMES[cell.fill ?? 'black']].filter(Boolean).join(' ');
  if (cell.shape === 'arrow') return `${DIRECTIONS[Math.round((((cell.angle ?? 0) % 360) + 360) % 360 / 45) % 8]} gösteren ${words} ok`;
  return `${words} ${SHAPE_NAMES[cell.shape ?? 'circle']}`;
}

/** Bir parçanın sözlü anlatımı, ör. "3 siyah daire", "kare çerçeve içinde siyah yıldız". */
export function describeCell(cell: MatrixCell): string {
  if (cell.dots || cell.grayDots) {
    const parts: string[] = [];
    if (cell.dots?.length) parts.push(`siyah nokta ${list(cell.dots.map((i) => SLOT_NAMES[i]))}`);
    if (cell.grayDots?.length) parts.push(`gri nokta ${list(cell.grayDots.map((i) => SLOT_NAMES[i]))}`);
    const ring = `Halka: ${parts.length ? parts.join('; ') : 'nokta yok'}`;
    return cell.shape ? `${ring}; ortada ${shapeWords(cell)}` : ring;
  }
  if (cell.frame) return `${FRAME_NAMES[cell.frame]} çerçeve içinde ${shapeWords(cell)}`;
  if (cell.lines) return cell.lines.length ? `Çizgiler: ${list(cell.lines.map((l) => LINE_NAMES[l]))}` : 'Boş';
  const count = cell.count ?? 1;
  return count === 1 ? shapeWords(cell) : `${count} ${shapeWords(cell)}`;
}
