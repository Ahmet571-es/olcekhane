/**
 * Gizli şekiller geometrisi (content/instruments/gizli-sekiller.ts). Bütün çizimler bir ızgaranın noktaları arasındaki
 * düz çizgilerden oluşur: yatay, dikey ya da iki çapraz yönde (45°). Izgarada x sağa, y aşağı doğru artar.
 *
 * Bir çizim, ızgaranın komşu iki noktasını birleştiren birim parçaların kümesiyle tutulur (yatay, dikey ya da çapraz
 * birim parça). Uzun bir çizgi ardışık birim parçalardan oluşur; bu yüzden bir şeklin kenarı çizimdeki daha uzun bir
 * çizginin parçası olabilir. Gizli şekil testlerinin özü budur: aranan şeklin kenarları çizimdeki başka çizgilerin
 * içinde kaybolur.
 *
 * Bir şekil bir çizimde "vardır", eğer şekil aynı büyüklükte ve aynı yönde (döndürülmeden, ters çevrilmeden) bir yere
 * kaydırılınca bütün birim parçaları çizimde bulunuyorsa. Şeklin döndürülmüş ya da ayna görüntüsü olan sekiz biçimi
 * (`SYMMETRIES`) yanlış seçeneklerde kullanılır.
 */

/** Çizgi: iki uç nokta [x1, y1, x2, y2]; yatay, dikey ya da 45° çapraz. */
export type HSeg = readonly [number, number, number, number];
/**
 * Yanlış seçeneğin yanılgı türü: şeklin döndürülmüş ya da ayna görüntüsü olan biçimi çizimde vardır (`turned`) ya da
 * şeklin bir köşesi farklı olan benzeri çizimde vardır (`changed`).
 */
export type HiddenLure = 'turned' | 'changed';

/** Bir birim parçanın anahtarı: "x1,y1,x2,y2" (uçlar sıralı: önce x, eşitse y küçük olan). */
export type EdgeKey = string;

const key = (x1: number, y1: number, x2: number, y2: number): EdgeKey =>
  x1 < x2 || (x1 === x2 && y1 < y2) ? `${x1},${y1},${x2},${y2}` : `${x2},${y2},${x1},${y1}`;

export const edgeOf = (k: EdgeKey): HSeg => k.split(',').map(Number) as unknown as HSeg;

/** Bir çizginin yönü ve uzunluğu (birim parça sayısı); geçerli değilse hata. */
function stepOf(s: HSeg): { dx: number; dy: number; n: number } {
  const [x1, y1, x2, y2] = s;
  const ax = x2 - x1;
  const ay = y2 - y1;
  if (ax === 0 && ay === 0) throw new Error(`Boş çizgi: ${s.join(',')}`);
  if (ax !== 0 && ay !== 0 && Math.abs(ax) !== Math.abs(ay)) throw new Error(`Çizgi 45°'nin katı değil: ${s.join(',')}`);
  const n = Math.max(Math.abs(ax), Math.abs(ay));
  return { dx: Math.sign(ax), dy: Math.sign(ay), n };
}

/** Çizgileri birim parçalara böler. */
export function unitEdges(segs: readonly HSeg[]): Set<EdgeKey> {
  const out = new Set<EdgeKey>();
  for (const s of segs) {
    const { dx, dy, n } = stepOf(s);
    for (let i = 0; i < n; i++) out.add(key(s[0] + i * dx, s[1] + i * dy, s[0] + (i + 1) * dx, s[1] + (i + 1) * dy));
  }
  return out;
}

/** Birim parçaları en uzun düz çizgilerde birleştirir (çizim için; sıra kararlıdır). */
export function mergeEdges(edges: Iterable<EdgeKey>): HSeg[] {
  const set = new Set(edges);
  const out: HSeg[] = [];
  const sorted = [...set].map(edgeOf).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3]);
  const used = new Set<EdgeKey>();
  for (const e of sorted) {
    const k = key(...e);
    if (used.has(k)) continue;
    const dx = e[2] - e[0];
    const dy = e[3] - e[1];
    // Geriye doğru başlangıcı bul.
    let sx = e[0];
    let sy = e[1];
    while (set.has(key(sx - dx, sy - dy, sx, sy))) {
      sx -= dx;
      sy -= dy;
    }
    let ex = sx;
    let ey = sy;
    while (set.has(key(ex, ey, ex + dx, ey + dy))) {
      used.add(key(ex, ey, ex + dx, ey + dy));
      ex += dx;
      ey += dy;
    }
    out.push([sx, sy, ex, ey]);
  }
  return out.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3]);
}

/** Çizgi listesi metni: her çizgi dört rakam ("0030 3032"); ızgara 0–9 arasıdır. */
export function parseSegs(s: string): HSeg[] {
  return s
    .trim()
    .split(/\s+/)
    .map((t) => {
      if (!/^\d{4}$/.test(t)) throw new Error(`Geçersiz çizgi: ${t}`);
      const seg = [...t].map(Number) as unknown as HSeg;
      stepOf(seg);
      return seg;
    });
}

export const formatSegs = (segs: readonly HSeg[]) => segs.map((s) => s.join('')).join(' ');

/** Birim parçaların kapladığı kutu. */
export function bounds(edges: Iterable<EdgeKey>): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const k of edges) {
    const [x1, y1, x2, y2] = edgeOf(k);
    minX = Math.min(minX, x1, x2);
    minY = Math.min(minY, y1, y2);
    maxX = Math.max(maxX, x1, x2);
    maxY = Math.max(maxY, y1, y2);
  }
  return { minX, minY, maxX, maxY };
}

/** Şekli sol üst köşesi (0, 0) olacak biçimde kaydırır. */
export function normalize(edges: Iterable<EdgeKey>): Set<EdgeKey> {
  const list = [...edges];
  const { minX, minY } = bounds(list);
  return new Set(
    list.map((k) => {
      const [x1, y1, x2, y2] = edgeOf(k);
      return key(x1 - minX, y1 - minY, x2 - minX, y2 - minY);
    }),
  );
}

export const shapeId = (edges: Iterable<EdgeKey>) => [...normalize(edges)].sort().join(' ');

/**
 * Karenin sekiz simetrisi: ilki şeklin kendisi; sonra saat yönünde çeyrek, yarım ve üç çeyrek tur; sonra yatay eksene
 * göre ayna ve onun döndürülmüşleri.
 */
export const SYMMETRIES: readonly ((x: number, y: number) => [number, number])[] = [
  (x, y) => [x, y],
  (x, y) => [-y, x],
  (x, y) => [-x, -y],
  (x, y) => [y, -x],
  (x, y) => [-x, y],
  (x, y) => [-y, -x],
  (x, y) => [x, -y],
  (x, y) => [y, x],
];

export const SYMMETRY_NAMES = ['kendisi', 'çeyrek tur döndürülmüş', 'yarım tur döndürülmüş', 'üç çeyrek tur döndürülmüş', 'ayna görüntüsü', 'ayna görüntüsü (döndürülmüş)', 'ayna görüntüsü (baş aşağı)', 'ayna görüntüsü (döndürülmüş)'] as const;

/** Şeklin bir simetriyle dönüştürülmüş ve (0, 0)'a kaydırılmış biçimi. */
export function transform(edges: Iterable<EdgeKey>, g: number): Set<EdgeKey> {
  const f = SYMMETRIES[g];
  const out = new Set<EdgeKey>();
  for (const k of edges) {
    const [x1, y1, x2, y2] = edgeOf(k);
    const [a, b] = f(x1, y1);
    const [c, d] = f(x2, y2);
    out.add(key(a, b, c, d));
  }
  return normalize(out);
}

/** Şekli k kat büyütür. */
export function scale(edges: Iterable<EdgeKey>, k: number): Set<EdgeKey> {
  const segs = [...edges].map(edgeOf).map(([x1, y1, x2, y2]) => [x1 * k, y1 * k, x2 * k, y2 * k] as const);
  return unitEdges(segs);
}

/** Şeklin (sol üst köşesi 0, 0) çizimde bulunduğu bütün kaydırmalar [dx, dy]. */
export function placements(figure: ReadonlySet<EdgeKey>, shape: ReadonlySet<EdgeKey>): [number, number][] {
  const s = normalize(shape);
  const list = [...s].map(edgeOf);
  if (!list.length || !figure.size) return [];
  const fb = bounds(figure);
  const sb = bounds(s);
  const out: [number, number][] = [];
  for (let dy = fb.minY; dy + sb.maxY <= fb.maxY; dy++) {
    for (let dx = fb.minX; dx + sb.maxX <= fb.maxX; dx++) {
      if (list.every(([x1, y1, x2, y2]) => figure.has(key(x1 + dx, y1 + dy, x2 + dx, y2 + dy)))) out.push([dx, dy]);
    }
  }
  return out;
}

/** Şeklin çizimdeki birim parçaları (bir kaydırmayla). */
export function placed(shape: ReadonlySet<EdgeKey>, at: readonly [number, number]): Set<EdgeKey> {
  const out = new Set<EdgeKey>();
  for (const k of normalize(shape)) {
    const [x1, y1, x2, y2] = edgeOf(k);
    out.add(key(x1 + at[0], y1 + at[1], x2 + at[0], y2 + at[1]));
  }
  return out;
}

/** Şeklin simetrilerinden kaçı birbirinden farklıdır (8: hiçbir dönüşte ya da aynada kendisiyle örtüşmez). */
export function distinctSymmetries(edges: Iterable<EdgeKey>): number {
  const list = [...edges];
  return new Set(SYMMETRIES.map((_, g) => shapeId(transform(list, g)))).size;
}

/** Yönergedeki örnek: aranan şekil (testte ve alıştırmalarda kullanılmayan bir şekil) ve onun saklandığı bir çizim. */
export const HIDDEN_EXAMPLE_TARGET: HSeg[] = [
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 1, 1, 2],
  [1, 0, 3, 2],
  [1, 2, 3, 2],
];
export const HIDDEN_EXAMPLE_FIGURE: HSeg[] = [
  [0, 4, 3, 4],
  [1, 4, 1, 6],
  [2, 1, 2, 2],
  [2, 1, 3, 1],
  [2, 2, 3, 3],
  [3, 1, 5, 3],
  [3, 3, 3, 6],
  [3, 3, 6, 3],
  [3, 6, 5, 6],
  [4, 3, 4, 6],
  [4, 5, 5, 5],
  [5, 5, 5, 6],
];
/** Örnek şeklin çizimdeki yeri. */
export const HIDDEN_EXAMPLE_AT: readonly [number, number] = [2, 1];
