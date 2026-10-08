import type { MatrixCell } from '@/lib/instruments/types';

/**
 * Şekil akıl yürütme sorularının bağımsız çözücüsü (yalnızca denetim için). Sorunun nasıl üretildiğini bilmez: tablonun
 * sekiz parçasına bakar ve her özellik için bilinen kural türlerinin bütün yorumlarını dener. Bir yorum, tablodaki
 * bütün satırlara (ya da sütunlara ya da çaprazlara) uyuyorsa eksik parça için bir değer önerir. Sorunun tek doğru
 * cevabı olması için her özellikte, tabloya uyan bütün yorumların önerdiği değer aynı olmalıdır.
 *
 * Denenen yorumlar (Carpenter, Just ve Shell, 1990; Matzen ve ark., 2010):
 *  - her yönde (satır, sütun): değişmeyen değer, üçlü dağılım, ortak adımlı düzenli değişim (sayı, büyüklük, renk
 *    koyuluğu, yön), toplama ve çıkarma (sayı, büyüklük, yön), küme işlemleri (birleşim, kesişim, fark, ortak olanı
 *    silme) ve kümenin dönmesi (çizgiler 90, halka 45 derecelik adımlarla);
 *  - çaprazlarda (iki yönde, tabloyu sarmalayarak): değişmeyen değer ve üçlü dağılım.
 * Çizgi ve nokta kümelerinde ayrıca öğe sayısının değişmeyen ya da düzenli değişen olduğu yorumlar denenir: bunlar bir
 * küme değil, yalnızca öğe sayısı önerir ve doğru cevabın öğe sayısıyla aynı olmalıdır.
 */

type Attr = keyof MatrixCell;
type Scalar = string | number;
type Val = Scalar | number[];

const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star', 'cross', 'arrow'];
const FILLS = ['empty', 'gray', 'black'];
const FRAMES = ['circle', 'square', 'triangle', 'diamond'];
const FILL_RANK: Record<string, number> = { empty: 0, gray: 1, black: 2 };

const subsets = (): number[][] =>
  Array.from({ length: 256 }, (_, m) => [0, 1, 2, 3, 4, 5, 6, 7].filter((i) => m & (1 << i)));

const DOMAIN: Record<Attr, Val[]> = {
  shape: SHAPES,
  fill: FILLS,
  frame: FRAMES,
  count: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  size: [1, 2, 3],
  angle: [0, 45, 90, 135, 180, 225, 270, 315],
  lines: subsets(),
  dots: subsets(),
  grayDots: subsets(),
};

const SETS: Attr[] = ['lines', 'dots', 'grayDots'];

const eq = (a: Val, b: Val) => (Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((x, i) => x === b[i]) : a === b);
const key = (v: Val) => (Array.isArray(v) ? `[${v.join(',')}]` : String(v));
const sortSet = (xs: number[]) => [...xs].sort((a, b) => a - b);

/** Çizgilerin 90 derece saat yönünde dönmüş karşılıkları. */
const LINE_ROT: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 0, 4: 5, 5: 4, 6: 7, 7: 6 };
function rotSet(attr: Attr, s: number[], k: number): number[] {
  if (attr === 'lines') {
    let out = s;
    for (let i = 0; i < k; i++) out = out.map((x) => LINE_ROT[x]);
    return sortSet(out);
  }
  return sortSet(s.map((x) => (x + k) % 8));
}

/** Sayıya çevrilebilen özellikler: düzenli değişim ve toplama-çıkarma bunlarda denenir. */
function num(attr: Attr, v: Val): number | null {
  if (attr === 'count' || attr === 'size' || attr === 'angle') return v as number;
  if (attr === 'fill') return FILL_RANK[v as string];
  return null;
}

type Line = [Val, Val, Val];
export interface Hypothesis {
  name: string;
  test: (lines: Line[]) => boolean;
}

function hypotheses(attr: Attr, ordered: boolean): Hypothesis[] {
  const hs: Hypothesis[] = [
    { name: 'değişmeyen', test: (ls) => ls.every(([a, b, c]) => eq(a, b) && eq(b, c)) },
    {
      name: 'üçlü dağılım',
      test: (ls) => {
        const sig = (l: Line) => l.map(key).sort().join('|');
        return ls.every((l) => new Set(l.map(key)).size === 3) && ls.every((l) => sig(l) === sig(ls[0]));
      },
    },
  ];
  if (!ordered) return hs;
  const isSet = SETS.includes(attr);
  if (!isSet && num(attr, DOMAIN[attr][0]) !== null) {
    const mod = attr === 'angle' ? 360 : 0;
    const d = (x: number, y: number) => (mod ? (((y - x) % mod) + mod) % mod : y - x);
    hs.push({
      name: 'düzenli değişim',
      test: (ls) => {
        const steps = ls.flatMap((l) => {
          const [a, b, c] = l.map((v) => num(attr, v) as number);
          return [d(a, b), d(b, c)];
        });
        return steps[0] !== 0 && steps.every((s) => s === steps[0]);
      },
    });
    if (attr !== 'fill') {
      const ops: [string, (a: number, b: number) => number][] = [
        ['toplama', (a, b) => a + b],
        ['çıkarma (1 − 2)', (a, b) => a - b],
        ['çıkarma (2 − 1)', (a, b) => b - a],
      ];
      for (const [name, f] of ops) {
        hs.push({
          name,
          test: (ls) =>
            ls.every((l) => {
              const [a, b, c] = l.map((v) => num(attr, v) as number);
              const r = f(a, b);
              return mod ? ((r % mod) + mod) % mod === c : r === c;
            }),
        });
      }
    }
  }
  if (isSet) {
    const ops: [string, (a: number[], b: number[]) => number[]][] = [
      ['birleşim', (a, b) => sortSet([...new Set([...a, ...b])])],
      ['kesişim', (a, b) => a.filter((x) => b.includes(x))],
      ['ortak olanı silme', (a, b) => sortSet([...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x))])],
      ['fark (1 − 2)', (a, b) => a.filter((x) => !b.includes(x))],
      ['fark (2 − 1)', (a, b) => b.filter((x) => !a.includes(x))],
    ];
    for (const [name, f] of ops) {
      hs.push({ name, test: (ls) => ls.every(([a, b, c]) => eq(f(a as number[], b as number[]), c)) });
    }
    const steps = attr === 'lines' ? [1, 2, 3] : [1, 2, 3, 4, 5, 6, 7];
    for (const k of steps) {
      hs.push({
        name: `dönme (${k})`,
        test: (ls) => ls.every(([a, b, c]) => eq(rotSet(attr, a as number[], k), b) && eq(rotSet(attr, b as number[], k), c)),
      });
    }
  }
  return hs;
}

/** Tablonun satır, sütun ve çapraz çizgileri; her çizgide eksik parça (8. sıra) varsa en sondadır. */
const DIRECTIONS: { name: string; ordered: boolean; lines: [number, number, number][] }[] = [
  { name: 'satır', ordered: true, lines: [[0, 1, 2], [3, 4, 5], [6, 7, 8]] },
  { name: 'sütun', ordered: true, lines: [[0, 3, 6], [1, 4, 7], [2, 5, 8]] },
  { name: 'çapraz', ordered: false, lines: [[1, 5, 6], [2, 3, 7], [0, 4, 8]] },
  { name: 'ters çapraz', ordered: false, lines: [[0, 5, 7], [2, 4, 6], [1, 3, 8]] },
];

export interface AttrPrediction {
  attr: Attr;
  /** Tabloya uyan yorumların önerdiği değerler (tek doğru cevap için tek değer olmalı). */
  values: Val[];
  /** Tabloya uyan yorumlar: "satır: üçlü dağılım" gibi. */
  rules: string[];
}

export function predictAttr(cells: MatrixCell[], attr: Attr): AttrPrediction {
  const values = new Map<string, Val>();
  const rules: string[] = [];
  for (const dir of DIRECTIONS) {
    for (const h of hypotheses(attr, dir.ordered)) {
      for (const x of DOMAIN[attr]) {
        const vals = [...cells.map((c) => c[attr] as Val), x];
        const lines = dir.lines.map((l) => l.map((i) => (Array.isArray(vals[i]) ? sortSet(vals[i] as number[]) : vals[i])) as Line);
        if (h.test(lines)) {
          values.set(key(x), x);
          rules.push(`${dir.name}: ${h.name} → ${key(x)}`);
        }
      }
    }
  }
  return { attr, values: [...values.values()], rules };
}

/** Çizgi ve nokta kümelerinde öğe sayısının tabloya uyan yorumlarının önerdiği sayılar. */
export function predictSetSize(cells: MatrixCell[], attr: 'lines' | 'dots' | 'grayDots'): number[] {
  const sizes = cells.map((c) => (c[attr] ?? []).length);
  const out = new Set<number>();
  for (const dir of DIRECTIONS.filter((d) => d.ordered)) {
    for (let x = 0; x <= 8; x++) {
      const v = [...sizes, x];
      const ls = dir.lines.map((l) => l.map((i) => v[i]));
      if (ls.every(([a, b, c]) => a === b && b === c)) out.add(x);
      const steps = ls.flatMap(([a, b, c]) => [b - a, c - b]);
      if (steps[0] !== 0 && steps.every((s) => s === steps[0])) out.add(x);
    }
  }
  return [...out];
}

/** Sorudaki özellikler (bütün parçalarda tanımlı olanlar). Bir özellik bazı parçalarda var, bazılarında yoksa hata. */
export function itemAttrs(cells: MatrixCell[], options: MatrixCell[]): Attr[] {
  const attrs = new Set<Attr>();
  for (const c of [...cells, ...options]) for (const k of Object.keys(c) as Attr[]) if (c[k] !== undefined) attrs.add(k);
  for (const a of attrs) {
    for (const c of [...cells, ...options]) if (c[a] === undefined) throw new Error(`"${a}" özelliği bazı parçalarda yok`);
  }
  return [...attrs];
}
