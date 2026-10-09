/**
 * Küp açınımı sorularının bağımsız denetleyicisi (tests/kup-acinimi.test.ts). Testin kendi hesabından
 * (lib/instruments/cube.ts: yüzlerin çerçevelerini kurallarla taşıyıp 24 dönmeyi deneyen hesap) farklı bir yolla çalışır:
 *
 *  1. Açınım kâğıt gibi katlanır. Açınım z = 0 düzleminde, basılı yüzü yukarıda durur; ilk kare yerinde kalır, öteki
 *     kareler en uçtakilerden başlayarak (üzerlerindeki kareler de birlikte) bağlı oldukları karenin kenarı çevresinde
 *     aşağı doğru 90° döndürülür. Sonunda her yüzün dışa bakan yönü, açınımdaki "sağ" ve "aşağı" yönünün küpte nereye
 *     geldiği bulunur ve yüzlerin gerçekten bir küp oluşturduğu (altı yön farklı, hepsi dışa bakıyor) denetlenir.
 *  2. Küp, üstte duracak yüz ve sol önde duracak yüz seçilerek 24 duruşa konur; her görünen yüzün şeklinin hangi yöne
 *     döndüğü, çizimdeki yüzlerin ekran eksenlerinden (CUBE_FACES matrislerinden) okunur.
 *  3. Şekillerin dönme simetrisi çizimden hesaplanır: şeklin parçaları 90° ya da 180° döndürülünce kendisiyle çakışıyor mu?
 */
import { CUBE_FACES, SYMBOL_SHAPES, type CubeFace, type CubePos, type CubeSymbol, type CubeView, type Prim } from '@/lib/instruments/cube';

type V = [number, number, number];
type M = [V, V, V];

const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const near = (a: V, b: V) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 1e-9;
const mul = (m: M, v: V): V => [dot(m[0], v), dot(m[1], v), dot(m[2], v)];
const mm = (a: M, b: M): M => {
  const col = (j: number): V => [b[0][j], b[1][j], b[2][j]];
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => dot(a[i], col(j)))) as M;
};
const I: M = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/** Birim eksen `k` çevresinde 90°·s dönme (s = ±1): R = I + s·K + K². */
function quarterTurn(k: V, s: 1 | -1): M {
  const K: M = [
    [0, -k[2], k[1]],
    [k[2], 0, -k[0]],
    [-k[1], k[0], 0],
  ];
  const K2 = mm(K, K);
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => I[i][j] + s * K[i][j] + K2[i][j])) as M;
}

export interface FoldedFace {
  /** Dışa bakan yön. */
  n: V;
  /** Açınımda sağa ve aşağı bakan yönlerin küpteki karşılığı. */
  right: V;
  down: V;
  center: V;
}

/** Açınımı katlar (açınımın kareleri [sütun, satır]; satır aşağı doğru artar). */
export function foldPaper(cells: readonly (readonly [number, number])[]): FoldedFace[] {
  const n = cells.length;
  if (n !== 6) throw new Error('Açınımda altı kare olmalı.');
  const adj = (i: number, j: number) => Math.abs(cells[i][0] - cells[j][0]) + Math.abs(cells[i][1] - cells[j][1]) === 1;
  // Kâğıt: kare (c, r) x ∈ [c, c+1], y ∈ [−r−1, −r] aralığında; açınımda "aşağı" −y yönüdür.
  const parent = Array<number>(n).fill(-1);
  const order = [0];
  const seen = new Set([0]);
  for (let q = 0; q < order.length; q++) {
    for (let j = 0; j < n; j++) {
      if (!seen.has(j) && adj(order[q], j)) {
        seen.add(j);
        parent[j] = order[q];
        order.push(j);
      }
    }
  }
  if (order.length !== n) throw new Error('Açınımın kareleri birbirine bağlı değil.');
  const kids = (i: number): number[] => order.filter((j) => parent[j] === i).flatMap((j) => [j, ...kids(j)]);
  const rot: M[] = cells.map(() => I);
  const shift: V[] = cells.map(() => [0, 0, 0]);
  const apply = (i: number, p: V): V => add(mul(rot[i], p), shift[i]);
  const flatCenter = (i: number): V => [cells[i][0] + 0.5, -cells[i][1] - 0.5, 0];
  for (const x of [...order].reverse()) {
    const p = parent[x];
    if (p < 0) continue;
    // Menteşe: X ile bağlı olduğu karenin ortak kenarı (o kare henüz yerinde).
    const [cx, rx] = cells[x];
    const [cp, rp] = cells[p];
    let a: V;
    let k: V;
    if (cx === cp + 1)
      [a, k] = [
        [cx, -rx, 0],
        [0, -1, 0],
      ];
    else if (cx === cp - 1)
      [a, k] = [
        [cp, -rx, 0],
        [0, -1, 0],
      ];
    else if (rx === rp + 1)
      [a, k] = [
        [cx, -rx, 0],
        [1, 0, 0],
      ];
    else
      [a, k] = [
        [cx, -rp, 0],
        [1, 0, 0],
      ];
    // Karenin merkezi aşağı (z < 0) insin diye yön seçilir.
    let turn = quarterTurn(k, 1);
    if (add(mul(turn, sub(flatCenter(x), a)), a)[2] > 0) turn = quarterTurn(k, -1);
    for (const j of [x, ...kids(x)]) {
      rot[j] = mm(turn, rot[j]);
      shift[j] = add(mul(turn, sub(shift[j], a)), a);
    }
  }
  const faces = cells.map((_, i) => ({
    n: mul(rot[i], [0, 0, 1]),
    right: mul(rot[i], [1, 0, 0]),
    down: mul(rot[i], [0, -1, 0]),
    center: apply(i, flatCenter(i)),
  }));
  const mid: V = faces.reduce((s, f) => add(s, [f.center[0] / 6, f.center[1] / 6, f.center[2] / 6]), [0, 0, 0] as V);
  for (const f of faces) {
    if (dot(f.n, sub(f.center, mid)) < 0.49) throw new Error('Yüz dışa bakmıyor ya da küp kapanmadı.');
  }
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) if (near(faces[i].n, faces[j].n)) throw new Error('İki yüz üst üste geldi: geçerli bir açınım değil.');
  return faces;
}

/** Küpte karşılıklı yüz çiftleri. */
export function opposites(folded: FoldedFace[]): number[] {
  return folded.map((f) => folded.findIndex((g) => near(g.n, [-f.n[0], -f.n[1], -f.n[2]])));
}

/* ---------- Çizimden okunan ekran yönleri ---------- */

/** Yerin dışa bakan yönü (resimde: üst +y, sol ön +z, sağ ön +x; sağ = üst × sol). */
const POS_N: Record<CubePos, V> = { top: [0, 1, 0], left: [0, 0, 1], right: [1, 0, 0] };
/** Eğik çizim: x sağa-aşağı, z sola-aşağı, y yukarı. */
const proj = (p: V): [number, number] => [(Math.sqrt(3) / 2) * (p[0] - p[2]), 0.5 * (p[0] + p[2]) - p[1]];
const AXES: V[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/** Çizimdeki bir yüzün yerel x ve y ekseninin (birim karenin sağı ve aşağısı) küpteki yönleri: matristen okunur. */
export function drawnAxes(pos: CubePos): { u: V; v: V } {
  const f = CUBE_FACES.find((x) => x.pos === pos)!;
  const [a, b, c, d] = f.matrix
    .replace(/^matrix\(|\)$/g, '')
    .split(' ')
    .map(Number);
  const along = (sx: number, sy: number) => {
    const hits = AXES.filter((ax) => dot(ax, POS_N[pos]) === 0).filter((ax) => {
      const [px, py] = proj(ax);
      return Math.abs(px - sx) < 1e-3 && Math.abs(py - sy) < 1e-3;
    });
    if (hits.length !== 1) throw new Error(`Çizimdeki ${pos} yüzünün ekseni bulunamadı.`);
    return hits[0];
  };
  return { u: along(a, b), v: along(c, d) };
}

/** Küpün 24 duruşunun görünüşü: üstte, solda ve sağda hangi yüz, şekli kaç çeyrek dönmüş (saat yönünde). */
export function looks(folded: FoldedFace[]): CubeView[] {
  const axes = { top: drawnAxes('top'), left: drawnAxes('left'), right: drawnAxes('right') };
  const out: CubeView[] = [];
  for (let t = 0; t < 6; t++) {
    for (let l = 0; l < 6; l++) {
      if (Math.abs(dot(folded[t].n, folded[l].n)) > 1e-9) continue;
      const rn = cross(folded[t].n, folded[l].n);
      const r = folded.findIndex((f) => near(f.n, rn));
      // Q: küpü çevirir; üst yüzün yönü +y'ye, sol yüzünkü +z'ye, sağ yüzünkü +x'e gelir.
      const Q = (w: V): V => [dot(rn, w), dot(folded[t].n, w), dot(folded[l].n, w)];
      const quarter = (pos: CubePos, i: number) => {
        const s = Q(folded[i].right);
        const { u, v } = axes[pos];
        const k = [u, v, [-u[0], -u[1], -u[2]] as V, [-v[0], -v[1], -v[2]] as V].findIndex((x) => near(x, s));
        if (k < 0) throw new Error('Şeklin yönü bulunamadı.');
        return k as 0 | 1 | 2 | 3;
      };
      out.push({ top: [t, quarter('top', t)], left: [l, quarter('left', l)], right: [r, quarter('right', r)] });
    }
  }
  return out;
}

/* ---------- Şekillerin dönme simetrisi ---------- */

/** Birim karenin merkezi çevresinde saat yönünde 90° (SVG rotate(90 .5 .5)): (x, y) → (1 − y, x). */
const turnPt = (x: number, y: number): [number, number] => [1 - y, x];
const key = (n: number) => n.toFixed(4);

function turnPrim(p: Prim): Prim {
  if (p.t === 'circle') {
    const [cx, cy] = turnPt(p.cx, p.cy);
    return { ...p, cx, cy };
  }
  if (p.t === 'rect') {
    const [x1, y1] = turnPt(p.x, p.y + p.h);
    return { ...p, x: x1, y: y1, w: p.h, h: p.w };
  }
  if (p.t === 'poly') {
    return {
      t: 'poly',
      points: p.points
        .split(' ')
        .map((q) => turnPt(...(q.split(',').map(Number) as [number, number])).join(','))
        .join(' '),
    };
  }
  throw new Error('Yol (path) döndürülemez.');
}

function primKey(p: Prim): string {
  if (p.t === 'circle') return `c${key(p.cx)},${key(p.cy)},${key(p.r)},${!!p.ring}`;
  if (p.t === 'rect') return `r${key(p.x)},${key(p.y)},${key(p.w)},${key(p.h)},${!!p.outline}`;
  if (p.t === 'poly')
    return `p${p.points
      .split(' ')
      .map((q) =>
        q
          .split(',')
          .map((n) => key(Number(n)))
          .join(','),
      )
      .sort()
      .join(' ')}`;
  return `d${p.d}`;
}

/** Şeklin dönme periyodu: 90° dönünce aynıysa 1, yalnızca 180° dönünce aynıysa 2, hiçbirinde aynı değilse 4. */
export function drawnPeriod(symbol: CubeSymbol): 1 | 2 | 4 {
  const prims = SYMBOL_SHAPES[symbol];
  if (prims.some((p) => p.t === 'path')) return 4;
  const set = (ps: Prim[]) => ps.map(primKey).sort().join('|');
  const once = prims.map(turnPrim);
  if (set(once) === set(prims)) return 1;
  if (set(once.map(turnPrim)) === set(prims)) return 2;
  return 4;
}

/** İki görünüş ekranda aynı mı (şekillerin simetrisi çizimden). */
export function sameDrawn(a: CubeView, b: CubeView, faces: readonly CubeFace[]): boolean {
  return (['top', 'left', 'right'] as CubePos[]).every((pos) => {
    if (a[pos][0] !== b[pos][0]) return false;
    const p = drawnPeriod(faces[a[pos][0]].symbol);
    return a[pos][1] % p === b[pos][1] % p;
  });
}

/** Açınımda iki kare arasındaki en kısa yol (kare sayısı). */
export function netDistances(cells: readonly (readonly [number, number])[]): number[][] {
  const n = cells.length;
  const d: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Math.abs(cells[i][0] - cells[j][0]) + Math.abs(cells[i][1] - cells[j][1]) === 1 ? 1 : 99)),
  );
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
  return d;
}

/**
 * Çizim denetimi: açınımda yan yana duran ve küpte birlikte görünen iki yüzün ortak kenarı, çizimde de iki yüzün
 * ortak kenarında olmalı. Yüzün açınımdaki kenarının orta noktası, şeklin dönüşüyle birlikte çizime taşınır ve iki
 * dörtgenin ortak kenarının orta noktasıyla karşılaştırılır. Uymayan yüz çiftleri döndürülür.
 */
export function drawnEdgeMismatches(cells: readonly (readonly [number, number])[], view: CubeView): string[] {
  const out: string[] = [];
  const poss: CubePos[] = ['top', 'left', 'right'];
  const pts = (pos: CubePos) =>
    CUBE_FACES.find((f) => f.pos === pos)!
      .points.split(' ')
      .map((q) => q.split(',').map(Number) as [number, number]);
  const mat = (pos: CubePos) =>
    CUBE_FACES.find((f) => f.pos === pos)!
      .matrix.replace(/^matrix\(|\)$/g, '')
      .split(' ')
      .map(Number);
  for (const p of poss) {
    for (const q of poss) {
      if (p === q) continue;
      const i = view[p][0];
      const j = view[q][0];
      const dc = cells[j][0] - cells[i][0];
      const dr = cells[j][1] - cells[i][1];
      if (Math.abs(dc) + Math.abs(dr) !== 1) continue;
      // i yüzünün açınımda j'ye bakan kenarının orta noktası (birim karede), şeklin dönüşüyle.
      let [x, y] = [0.5 + dc / 2, 0.5 + dr / 2];
      for (let k = 0; k < view[p][1]; k++) [x, y] = turnPt(x, y);
      const [a, b, c, d, e, f] = mat(p);
      const sx = a * x + c * y + e;
      const sy = b * x + d * y + f;
      // İki dörtgenin ortak kenarı: iki köşe ortak.
      const A = pts(p);
      const B = pts(q);
      const common = A.filter(([ax, ay]) => B.some(([bx, by]) => Math.abs(ax - bx) < 1e-3 && Math.abs(ay - by) < 1e-3));
      if (common.length !== 2) throw new Error('Çizimde iki yüzün ortak kenarı bulunamadı.');
      const mx = (common[0][0] + common[1][0]) / 2;
      const my = (common[0][1] + common[1][1]) / 2;
      if (Math.abs(mx - sx) > 1e-3 || Math.abs(my - sy) > 1e-3) out.push(`${p}-${q}`);
    }
  }
  return out;
}
