/**
 * Gizli şekiller için bağımsız denetleyici (lib/instruments/hidden.ts'i kullanmaz). Çizimler birim parçalara bölünmez;
 * her çizgi geometrik bir doğru parçası olarak tutulur ve bir şeklin bir çizimde bulunup bulunmadığı, şeklin her birim
 * adımının orta noktasının çizimde aynı doğrultudaki bir çizginin üzerinde olup olmadığına bakılarak bulunur.
 */

export type Seg = [number, number, number, number];

/** "0030 3032" → [[0,0,3,0], [3,0,3,2]] (testin kendi okuyucusu). */
export function readSegs(s: string): Seg[] {
  return s
    .trim()
    .split(' ')
    .map((t) => [Number(t[0]), Number(t[1]), Number(t[2]), Number(t[3])] as Seg);
}

const steps = (s: Seg) => Math.max(Math.abs(s[2] - s[0]), Math.abs(s[3] - s[1]));

/** Bir çizginin birim adımlarının orta noktaları ve doğrultusu. */
function midpoints(s: Seg): { x: number; y: number; dx: number; dy: number }[] {
  const n = steps(s);
  const dx = (s[2] - s[0]) / n;
  const dy = (s[3] - s[1]) / n;
  return Array.from({ length: n }, (_, i) => ({ x: s[0] + (i + 0.5) * dx, y: s[1] + (i + 0.5) * dy, dx, dy }));
}

/** Nokta, verilen doğrultuya paralel bir çizginin üzerinde mi? */
function covered(fig: readonly Seg[], p: { x: number; y: number; dx: number; dy: number }): boolean {
  return fig.some((s) => {
    const ux = s[2] - s[0];
    const uy = s[3] - s[1];
    if (Math.abs(ux * p.dy - uy * p.dx) > 1e-9) return false; // doğrultu farklı
    const wx = p.x - s[0];
    const wy = p.y - s[1];
    if (Math.abs(ux * wy - uy * wx) > 1e-9) return false; // aynı doğru üzerinde değil
    const t = (wx * ux + wy * uy) / (ux * ux + uy * uy);
    return t > 0 && t < 1;
  });
}

export const shift = (shape: readonly Seg[], dx: number, dy: number): Seg[] => shape.map(([a, b, c, d]) => [a + dx, b + dy, c + dx, d + dy]);

export function box(shape: readonly Seg[]) {
  const xs = shape.flatMap((s) => [s[0], s[2]]);
  const ys = shape.flatMap((s) => [s[1], s[3]]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/** Şekli sol üst köşesi (0, 0) olacak biçimde kaydırır. */
export function origin(shape: readonly Seg[]): Seg[] {
  const b = box(shape);
  return shift(shape, -b.x0, -b.y0);
}

/** Şeklin çizimde eksik kalan birim adımlarının sayısı (verilen kaydırmada). */
export function missing(fig: readonly Seg[], shape: readonly Seg[], dx: number, dy: number): number {
  return shift(shape, dx, dy)
    .flatMap(midpoints)
    .filter((p) => !covered(fig, p)).length;
}

/** Şeklin (0, 0'dan başlayan) çizimde tam bulunduğu kaydırmalar; ızgara 0..grid. */
export function found(fig: readonly Seg[], shape: readonly Seg[], grid = 6): [number, number][] {
  const s = origin(shape);
  const b = box(s);
  const out: [number, number][] = [];
  for (let dy = 0; dy + b.y1 <= grid; dy++) for (let dx = 0; dx + b.x1 <= grid; dx++) if (missing(fig, s, dx, dy) === 0) out.push([dx, dy]);
  return out;
}

/** Şeklin tek bir birim adımı eksik bulunduğu yerler (ızgaranın bir birim dışına taşanlar da sayılır). */
export function nearly(fig: readonly Seg[], shape: readonly Seg[], grid = 6): number {
  const s = origin(shape);
  const b = box(s);
  let n = 0;
  for (let dy = -1; dy + b.y1 <= grid + 1; dy++) for (let dx = -1; dx + b.x1 <= grid + 1; dx++) if (missing(fig, s, dx, dy) === 1) n++;
  return n;
}

/** En iyi örtüşmede eksik birim adım sayısı. */
export function bestMissing(fig: readonly Seg[], shape: readonly Seg[], grid = 6): number {
  const s = origin(shape);
  const b = box(s);
  let best = Infinity;
  for (let dy = 0; dy + b.y1 <= grid; dy++) for (let dx = 0; dx + b.x1 <= grid; dx++) best = Math.min(best, missing(fig, s, dx, dy));
  return best;
}

/** Bir çokgenin döndürülmüş ya da aynalanmış biçimi (matrisle; 0: kendisi). */
const MATS: [number, number, number, number][] = [
  [1, 0, 0, 1],
  [0, -1, 1, 0],
  [-1, 0, 0, -1],
  [0, 1, -1, 0],
  [-1, 0, 0, 1],
  [1, 0, 0, -1],
  [0, 1, 1, 0],
  [0, -1, -1, 0],
];
export function turn(shape: readonly Seg[], g: number): Seg[] {
  const [a, b, c, d] = MATS[g];
  return origin(shape.map(([x1, y1, x2, y2]) => [a * x1 + b * y1, c * x1 + d * y1, a * x2 + b * y2, c * x2 + d * y2] as Seg));
}

/** İki şekil aynı mı (birim adımların orta noktaları ve doğrultularıyla)? */
export function sameShape(p: readonly Seg[], q: readonly Seg[]): boolean {
  const key = (sh: readonly Seg[]) =>
    origin(sh)
      .flatMap(midpoints)
      .map((m) => `${m.x},${m.y},${Math.abs(m.dx)},${m.dx * m.dy}`)
      .sort()
      .join(' ');
  return key(p) === key(q);
}

/** Şeklin kaç farklı döndürülmüş ya da aynalanmış biçimi var (8: hiçbiri kendisiyle örtüşmez). */
export function distinctTurns(shape: readonly Seg[]): number {
  const list = MATS.map((_, g) => turn(shape, g));
  return list.filter((x, i) => list.findIndex((y) => sameShape(x, y)) === i).length;
}

/** Şekli iki kat büyütür. */
export const double = (shape: readonly Seg[]): Seg[] => shape.map(([a, b, c, d]) => [2 * a, 2 * b, 2 * c, 2 * d]);

/** Çizimin toplam uzunluğu (birim adım sayısı) ve çapraz adım sayısı. */
export function length(fig: readonly Seg[]): { all: number; diag: number } {
  // Üst üste binen çizgiler bir kez sayılsın: orta noktalar tekilleştirilir.
  const pts = new Set(fig.flatMap(midpoints).map((m) => `${m.x},${m.y},${Math.abs(m.dx)},${m.dx * m.dy}`));
  return { all: pts.size, diag: [...pts].filter((k) => k.split(',')[2] !== '0' && k.split(',')[3] !== '0').length };
}

/** Çizim tek parça mı (çizgiler uçlarından ya da kesişerek birbirine bağlı)? */
export function connected(fig: readonly Seg[]): boolean {
  const n = fig.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const touch = (s: Seg, t: Seg) => {
    // Ortak bir ızgara noktası ya da kesişme: iki çizginin noktaları yarım birim aralıkla karşılaştırılır.
    const pts = (u: Seg) => {
      const k = steps(u) * 2;
      return new Set(Array.from({ length: k + 1 }, (_, i) => `${u[0] + ((u[2] - u[0]) * i) / k},${u[1] + ((u[3] - u[1]) * i) / k}`));
    };
    const a = pts(s);
    for (const p of pts(t)) if (a.has(p)) return true;
    return false;
  };
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (touch(fig[i], fig[j])) parent[find(i)] = find(j);
  return new Set(fig.map((_, i) => find(i))).size === 1;
}

/** Şeklin bulunduğu yerde, şekle ait olmayıp şeklin köşe ya da kenar noktalarına değen çizgi adımlarının sayısı. */
export function touching(fig: readonly Seg[], shape: readonly Seg[], at: [number, number]): number {
  const s = shift(origin(shape), at[0], at[1]);
  const own = new Set(s.flatMap(midpoints).map((m) => `${m.x},${m.y}`));
  const pts = new Set(s.flatMap((u) => Array.from({ length: steps(u) + 1 }, (_, i) => `${u[0] + ((u[2] - u[0]) * i) / steps(u)},${u[1] + ((u[3] - u[1]) * i) / steps(u)}`)));
  let n = 0;
  for (const m of new Set(fig.flatMap(midpoints).map((q) => JSON.stringify(q)))) {
    const q = JSON.parse(m) as { x: number; y: number; dx: number; dy: number };
    if (own.has(`${q.x},${q.y}`) && covered(s, q)) continue;
    const a = `${q.x - q.dx / 2},${q.y - q.dy / 2}`;
    const b = `${q.x + q.dx / 2},${q.y + q.dy / 2}`;
    if (pts.has(a) || pts.has(b)) n++;
  }
  return n;
}

/** Şeklin kenarlarından kaçı çizimde aynı doğrultuda, şeklin dışına doğru devam ediyor (en az bir birim adım). */
export function continued(fig: readonly Seg[], shape: readonly Seg[], at: [number, number]): number {
  const s = shift(origin(shape), at[0], at[1]);
  let n = 0;
  for (const u of s) {
    const k = steps(u);
    const dx = (u[2] - u[0]) / k;
    const dy = (u[3] - u[1]) / k;
    const after = { x: u[2] + dx / 2, y: u[3] + dy / 2, dx, dy };
    const before = { x: u[0] - dx / 2, y: u[1] - dy / 2, dx, dy };
    if (covered(fig, after) || covered(fig, before)) n++;
  }
  return n;
}

type Pt = [number, number];
const crossOf = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

/** İki doğru parçasının ortak noktası var mı (uçlar dahil)? */
function meet(p1: Pt, p2: Pt, p3: Pt, p4: Pt): boolean {
  const d1 = crossOf(p3, p4, p1);
  const d2 = crossOf(p3, p4, p2);
  const d3 = crossOf(p1, p2, p3);
  const d4 = crossOf(p1, p2, p4);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  const on = (a: Pt, b: Pt, c: Pt) => Math.min(a[0], b[0]) <= c[0] && c[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= c[1] && c[1] <= Math.max(a[1], b[1]);
  return (d1 === 0 && on(p3, p4, p1)) || (d2 === 0 && on(p3, p4, p2)) || (d3 === 0 && on(p1, p2, p3)) || (d4 === 0 && on(p1, p2, p4));
}

/** Kapalı bir çokgenin köşeleri, çevresi boyunca sırayla (çizgiler uç uca eklenerek bulunur). */
export function corners(shape: readonly Seg[]): Pt[] {
  const used = new Set<number>([0]);
  const path: Pt[] = [[shape[0][0], shape[0][1]]];
  let cur: Pt = [shape[0][2], shape[0][3]];
  while (used.size < shape.length) {
    path.push(cur);
    const i = shape.findIndex((s, k) => !used.has(k) && ((s[0] === cur[0] && s[1] === cur[1]) || (s[2] === cur[0] && s[3] === cur[1])));
    if (i < 0) throw new Error('şekil kapalı bir çokgen değil');
    used.add(i);
    const s = shape[i];
    cur = s[0] === cur[0] && s[1] === cur[1] ? [s[2], s[3]] : [s[0], s[1]];
  }
  if (cur[0] !== path[0][0] || cur[1] !== path[0][1]) throw new Error('şekil kapalı bir çokgen değil');
  return path;
}

/** Köşelerden geçerli bir çokgen: kenarlar yatay, dikey ya da 45°; ardışık kenarlar aynı doğrultuda değil; kenarlar kesişmiyor. */
function polygon(v: Pt[]): Seg[] | null {
  const n = v.length;
  for (let i = 0; i < n; i++) {
    const a = v[i];
    const b = v[(i + 1) % n];
    const dx = Math.abs(b[0] - a[0]);
    const dy = Math.abs(b[1] - a[1]);
    if (dx + dy === 0 || !(dx === 0 || dy === 0 || dx === dy)) return null;
    if (crossOf(a, b, v[(i + 2) % n]) === 0) return null;
  }
  for (let i = 0; i < n; i++)
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (meet(v[i], v[(i + 1) % n], v[j], v[(j + 1) % n])) return null;
    }
  return v.map((a, i) => [a[0], a[1], v[(i + 1) % n][0], v[(i + 1) % n][1]] as Seg);
}

/** Şeklin bir köşesi bir birim (sekiz yönden birine) kaydırılınca elde edilen bütün geçerli çokgenler. */
export function cornerMoves(shape: readonly Seg[]): Seg[][] {
  const v = corners(shape);
  const out: Seg[][] = [];
  for (let i = 0; i < v.length; i++)
    for (const [mx, my] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const w = v.map((p, k) => (k === i ? ([p[0] + mx, p[1] + my] as Pt) : p));
      const poly = polygon(w);
      if (poly && !out.some((o) => sameShape(o, poly))) out.push(origin(poly));
    }
  return out;
}

/** İki şekilden biri ötekinin (herhangi bir yönüyle) bir köşesi farklı benzeri mi? */
export function oneCornerApart(p: readonly Seg[], q: readonly Seg[]): boolean {
  const pm = cornerMoves(p);
  const qm = cornerMoves(q);
  for (let g = 0; g < 8; g++) {
    const qt = turn(q, g);
    const pt = turn(p, g);
    if (pm.some((m) => sameShape(m, qt)) || qm.some((m) => sameShape(m, pt))) return true;
  }
  return false;
}

const GRID_SPAN = 6;

/** İki şekil arasındaki en küçük fark: biri 8 yönünden birine çevrilip kaydırılınca örtüşmeyen birim adım sayısı. */
export function shapeDistance(p: readonly Seg[], q: readonly Seg[]): number {
  const keys = (sh: readonly Seg[], dx = 0, dy = 0) =>
    new Set(
      shift(origin(sh), dx, dy)
        .flatMap(midpoints)
        .map((m) => `${m.x},${m.y},${Math.abs(m.dx)},${m.dx * m.dy}`),
    );
  const a = keys(p);
  let best = Infinity;
  for (let g = 0; g < 8; g++) {
    const qt = turn(q, g);
    for (let dx = -GRID_SPAN; dx <= GRID_SPAN; dx++)
      for (let dy = -GRID_SPAN; dy <= GRID_SPAN; dy++) {
        const b = keys(qt, dx, dy);
        let common = 0;
        for (const k of b) if (a.has(k)) common++;
        best = Math.min(best, a.size + b.size - 2 * common);
      }
  }
  return best;
}
