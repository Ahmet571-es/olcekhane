/**
 * Desen hatırlama desenlerinin bağımsız denetleyicisi: desenleri yazımlarından ("##./..#") kendi yoluyla okur ve
 * content/instruments/desen-hatirlama.ts'in başında yazan kuralları yeniden hesaplar. lib/instruments/pattern.ts'i
 * kullanmaz.
 */

export type Grid = boolean[][];

export function read(text: string): Grid {
  return text.split('/').map((row) => [...row].map((ch) => ch === '#'));
}

export const size = (g: Grid) => ({ rows: g.length, cols: g[0].length });
export const filled = (g: Grid) => g.flat().filter(Boolean).length;
export const key = (g: Grid) => g.map((r) => r.map((v) => (v ? '#' : '.')).join('')).join('/');

/** Izgaranın boyunu koruyan döndürme ve aynalar (dikdörtgende 4, karede 8 biçim; ilki desenin kendisi). */
export function variants(g: Grid): Grid[] {
  const { rows, cols } = size(g);
  const make = (h: number, w: number, f: (y: number, x: number) => boolean): Grid => Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => f(y, x)));
  const out: Grid[] = [
    g,
    make(rows, cols, (y, x) => g[y][cols - 1 - x]),
    make(rows, cols, (y, x) => g[rows - 1 - y][x]),
    make(rows, cols, (y, x) => g[rows - 1 - y][cols - 1 - x]),
  ];
  if (rows === cols) {
    out.push(
      make(rows, cols, (y, x) => g[x][y]),
      make(rows, cols, (y, x) => g[cols - 1 - x][rows - 1 - y]),
      make(rows, cols, (y, x) => g[cols - 1 - x][y]),
      make(rows, cols, (y, x) => g[x][rows - 1 - y]),
    );
  }
  return out;
}

/** İki desenin farkı: biri ötekine dönüşsün diye yeri değişmesi gereken kare sayısı (farklı karelerin yarısı). */
export function diff(a: Grid, b: Grid): number {
  let d = 0;
  a.forEach((row, y) => row.forEach((v, x) => (d += v === b[y][x] ? 0 : 1)));
  return d / 2;
}

/** Döndürülmüş ya da aynada çevrilmiş biçimleri de hesaba katarak en küçük fark. */
export const diffAny = (a: Grid, b: Grid) => Math.min(...variants(b).map((v) => diff(a, v)));

/** Simetrik mi: kendisinden başka bir biçimi kendisiyle aynı mı? */
export const symmetric = (g: Grid) => variants(g).slice(1).some((v) => key(v) === key(g));

/** En uzun dolu dizi: yatay, dikey ve iki köşegen yönünde ayrı ayrı. */
export function longestRuns(g: Grid): { h: number; v: number; d: number } {
  const { rows, cols } = size(g);
  const run = (cells: [number, number][]) => {
    let best = 0;
    let cur = 0;
    for (const [y, x] of cells) {
      cur = g[y][x] ? cur + 1 : 0;
      best = Math.max(best, cur);
    }
    return best;
  };
  let h = 0;
  let v = 0;
  let d = 0;
  for (let y = 0; y < rows; y++) h = Math.max(h, run(Array.from({ length: cols }, (_, x) => [y, x] as [number, number])));
  for (let x = 0; x < cols; x++) v = Math.max(v, run(Array.from({ length: rows }, (_, y) => [y, x] as [number, number])));
  for (let s = -(rows - 1); s < cols; s++) {
    const down: [number, number][] = [];
    const up: [number, number][] = [];
    for (let y = 0; y < rows; y++) {
      if (y + s >= 0 && y + s < cols) down.push([y, y + s]);
      if (cols - 1 - y - s >= 0 && cols - 1 - y - s < cols) up.push([y, cols - 1 - y - s]);
    }
    d = Math.max(d, run(down), run(up));
  }
  return { h, v, d };
}

/** Tamamen dolu ve tamamen boş 2 × 2'lik bölgeler. */
export function blocks(g: Grid): { full: number; empty: number } {
  const { rows, cols } = size(g);
  let full = 0;
  let empty = 0;
  for (let y = 0; y + 1 < rows; y++)
    for (let x = 0; x + 1 < cols; x++) {
      const b = [g[y][x], g[y][x + 1], g[y + 1][x], g[y + 1][x + 1]];
      if (b.every(Boolean)) full++;
      if (!b.some(Boolean)) empty++;
    }
  return { full, empty };
}

/** Kenardan birbirine değen dolu karelerden oluşan parçaların sayısı. */
export function parts(g: Grid): number {
  const { rows, cols } = size(g);
  const seen = new Set<string>();
  let n = 0;
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      if (!g[y][x] || seen.has(`${y},${x}`)) continue;
      n++;
      const stack: [number, number][] = [[y, x]];
      seen.add(`${y},${x}`);
      while (stack.length) {
        const [cy, cx] = stack.pop()!;
        for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const [ny, nx] = [cy + dy, cx + dx];
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && g[ny][nx] && !seen.has(`${ny},${nx}`)) {
            seen.add(`${ny},${nx}`);
            stack.push([ny, nx]);
          }
        }
      }
    }
  return n;
}

/** Satır ve sütunlardan tamamen dolu ya da tamamen boş olanlar (sütunlara yalnızca 3 ya da daha çok satırda bakılır). */
export function plainLines(g: Grid): string[] {
  const { rows, cols } = size(g);
  const out: string[] = [];
  g.forEach((row, y) => {
    if (row.every(Boolean)) out.push(`${y + 1}. satır dolu`);
    if (!row.some(Boolean)) out.push(`${y + 1}. satır boş`);
  });
  if (rows >= 3)
    for (let x = 0; x < cols; x++) {
      const col = g.map((r) => r[x]);
      if (col.every(Boolean)) out.push(`${x + 1}. sütun dolu`);
      if (!col.some(Boolean)) out.push(`${x + 1}. sütun boş`);
    }
  return out;
}
