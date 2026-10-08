/**
 * Kâğıt katlama sorularının geometrisi (content/instruments/kagit-katlama.ts, ekran ve puanlama). Kâğıt 12 × 12 birimlik
 * bir karedir; y aşağı doğru artar (SVG ile aynı). Her katlama düz bir çizgi boyuncadır: çizginin bir yanındaki parça
 * (kanat) öbür yanın üstüne katlanır. Kanat, katlandığında kalan parçanın dışına taşmaz; bu yüzden katlamadan sonra kâğıdın
 * görünen biçimi, kalan parçadır (dışbükey bir çokgen).
 *
 * Delikler katlanmış kâğıdın bütün katlarından geçer. Kâğıt açılırken her katlamada, deliğin bulunduğu yerin karşısında
 * (çizgiye göre aynasında) kanattan bir kat varsa orada da delik açılır (`unfold`). Yanlış seçenekler sık yapılan
 * yanılgılarla üretilir (`variant`): hiç açmamak, bir katlamayı unutmak, aynalamak yerine kaydırmak, yanlış çizgiye göre
 * aynalamak.
 */

export type Pt = readonly [number, number];

export const PAPER = 12;
/** Deliklerin yarıçapı (birim). */
export const HOLE_R = 0.6;
const EPS = 1e-6;

/** Katlama: `a`–`b` doğrusu boyunca; `moving` kanadın içindeki bir noktadır (kanat o yandaki parçadır). */
export interface Fold {
  a: Pt;
  b: Pt;
  moving: Pt;
}

export const SQUARE: Pt[] = [
  [0, 0],
  [PAPER, 0],
  [PAPER, PAPER],
  [0, PAPER],
];

/** Dikey çizgi x = c boyunca; kanat solda ya da sağda. */
export const vFold = (c: number, moving: 'left' | 'right'): Fold => ({ a: [c, 0], b: [c, PAPER], moving: [moving === 'left' ? c - 1 : c + 1, PAPER / 2] });
/** Yatay çizgi y = c boyunca; kanat üstte ya da altta. */
export const hFold = (c: number, moving: 'top' | 'bottom'): Fold => ({ a: [0, c], b: [PAPER, c], moving: [PAPER / 2, moving === 'top' ? c - 1 : c + 1] });
/** İki noktadan geçen (çapraz) çizgi boyunca; kanat `moving` noktasının bulunduğu yanda. */
export const lineFold = (a: Pt, b: Pt, moving: Pt): Fold => ({ a, b, moving });

/** Noktanın doğruya göre hangi yanda olduğu (işaretli uzaklık; birim normal ile). */
function side(f: Fold, p: Pt): number {
  const [ax, ay] = f.a;
  const dx = f.b[0] - ax;
  const dy = f.b[1] - ay;
  const len = Math.hypot(dx, dy);
  return ((p[0] - ax) * dy - (p[1] - ay) * dx) / len;
}

/** Kanat yanında pozitif olan işaretli uzaklık. */
const movingSide = (f: Fold, p: Pt) => side(f, p) * Math.sign(side(f, f.moving));

/** Noktanın katlama çizgisine göre aynası. */
export function reflect(f: Fold, p: Pt): Pt {
  const [ax, ay] = f.a;
  const dx = f.b[0] - ax;
  const dy = f.b[1] - ay;
  const t = ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy);
  const fx = ax + t * dx;
  const fy = ay + t * dy;
  return [2 * fx - p[0], 2 * fy - p[1]];
}

/** Dışbükey çokgeni, `keep` yanında kalan yarı düzleme göre kırpar (`keep(p) >= 0` tutulur). */
function clip(poly: Pt[], keep: (p: Pt) => number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const sp = keep(p);
    const sq = keep(q);
    if (sp >= -EPS) out.push(p);
    if ((sp > EPS && sq < -EPS) || (sp < -EPS && sq > EPS)) {
      const t = sp / (sp - sq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  // Çok yakın ardışık köşeleri birleştir.
  return out.filter((p, i) => {
    const q = out[(i + 1) % out.length];
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > EPS;
  });
}

/** Kâğıdın her katlamadan sonraki biçimi: shapes[0] kare, shapes[k] k. katlamadan sonra. */
export function shapes(folds: Fold[]): Pt[][] {
  const out: Pt[][] = [SQUARE];
  for (const f of folds) out.push(clip(out[out.length - 1], (p) => -movingSide(f, p)));
  return out;
}

/** Katlamanın kanadı (katlanan parça, katlamadan önceki yerinde). */
export function flap(folds: Fold[], k: number): Pt[] {
  const before = shapes(folds)[k];
  return clip(before, (p) => movingSide(folds[k], p));
}

/** Nokta dışbükey çokgenin içinde mi (sınırdan en az `margin` uzakta)? */
export function inside(poly: Pt[], p: Pt, margin = 0): boolean {
  // Saat yönü ya da tersi fark etmez: bütün kenarlara göre aynı işaret.
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    const d = ((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / len;
    if (Math.abs(d) < margin) return false;
    const s = Math.sign(d);
    if (s === 0) return false;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

/**
 * Kâğıt açılınca deliklerin yerleri. Sondan başa her katlamada: delik kalan parçadadır; çizgiye göre aynası kanadın
 * içindeyse (o yerde kanattan bir kat varsa) orada da delik olur.
 */
export function unfold(folds: Fold[], punches: Pt[], skip: number[] = []): Pt[] {
  const sh = shapes(folds);
  let pts = [...punches];
  for (let k = folds.length - 1; k >= 0; k--) {
    if (skip.includes(k)) continue;
    const fl = flap(folds, k);
    const next: Pt[] = [];
    for (const q of pts) {
      next.push(q);
      const r = reflect(folds[k], q);
      if (inside(fl, r) && inside(sh[k], r)) next.push(r);
    }
    pts = next;
  }
  return pts;
}

/**
 * Katlanan kanatların, katlanmış kâğıdın üstünde görünen yerleri: k. katlamada kanadın düştüğü yer, sonraki katlamalarda
 * da katlanarak taşınır. `upTo` katlamadan sonraki durum için kanat parçalarının listesi (çizimde kanat kenarları).
 */
export function layerPieces(folds: Fold[], upTo: number): Pt[][] {
  const out: Pt[][] = [];
  for (let k = 0; k < upTo; k++) {
    let pieces: Pt[][] = [flap(folds, k).map((p) => reflect(folds[k], p))];
    for (let j = k + 1; j < upTo; j++) {
      const f = folds[j];
      const next: Pt[][] = [];
      for (const P of pieces) {
        const stay = clip(P, (p) => -movingSide(f, p));
        const move = clip(P, (p) => movingSide(f, p));
        if (stay.length >= 3) next.push(stay);
        if (move.length >= 3) next.push(move.map((p) => reflect(f, p)));
      }
      pieces = next;
    }
    out.push(...pieces);
  }
  return out;
}

/** Kanadın genişliği: çizgiden kanadın en uzak noktasına uzaklık. */
function flapWidth(folds: Fold[], k: number): number {
  return Math.max(...flap(folds, k).map((p) => movingSide(folds[k], p)));
}

/** Kanat yanına doğru birim normal. */
function normalToMoving(f: Fold): Pt {
  const dx = f.b[0] - f.a[0];
  const dy = f.b[1] - f.a[1];
  const len = Math.hypot(dx, dy);
  const n: Pt = [dy / len, -dx / len];
  return side(f, f.moving) > 0 ? n : [-n[0], -n[1]];
}

/**
 * Yanlış seçeneklerin üretildiği yanılgılar:
 *  - `none`: kâğıt hiç açılmamış gibi yalnızca delinen yerler;
 *  - `skip:k`: k. katlama (0'dan) unutulmuş, o katlamanın deliği yok;
 *  - `slide:k`: k. katlamada delik aynalanmak yerine kanadın genişliği kadar kaydırılmış;
 *  - `cross:k`: k. katlamada delik, katlama çizgisine dik olan çizgiye göre aynalanmış;
 *  - `all`: her katlamada delik, kanadın oraya ulaşıp ulaşmadığına bakılmadan aynalanmış (kenardan katlamada tek kat
 *    olan yerde de delik var sanılmış);
 *  - `mid:k`: k. katlama kâğıdın ortasından yapılmış sanılmış (kenardan katlamada delik, kâğıdın orta çizgisine göre
 *    aynalanmış);
 *  - `flipV` / `flipH`: doğru delikler kâğıdın dikey ya da yatay orta çizgisine göre ters yanda;
 *  - `turn` / `turn2` / `turn3`: doğru delikler kâğıdın ortası çevresinde çeyrek, yarım ya da üç çeyrek tur döndürülmüş;
 *  - `diag` / `anti`: doğru delikler kâğıdın köşegenine göre aynalanmış (yatay ve dikeyi karıştırmak);
 *  - `drop:i`: doğru deliklerden i. sıradaki eksik;
 *  - `add:x,y`: doğru deliklere ek olarak (x, y)'de bir delik;
 *  - `move:dx,dy`: doğru deliklerin hepsi biraz kaymış;
 *  - `at:x,y`: (ilk) delik (x, y)'den açılmış gibi: kâğıt doğru açılmış ama deliğin yeri yanlış görülmüş;
 *  - `<yanılgı>+<dönüşüm>`: bir yanılgının delikleri, kâğıt ters çevrilmiş ya da döndürülmüş gibi (iki yanılgı bir arada;
 *    dönüşümler `flipV`, `flipH`, `turn`, `turn2`, `turn3`, `diag`, `anti`).
 */
type Base = 'none' | 'all' | `skip:${number}` | `slide:${number}` | `cross:${number}` | `mid:${number}` | `at:${number},${number}`;
type Sym = 'flipV' | 'flipH' | 'turn' | 'turn2' | 'turn3' | 'diag' | 'anti';
export type Variant = Base | Sym | `${Base}+${Sym}` | `drop:${number}` | `add:${number},${number}` | `move:${number},${number}`;

/** Kâğıdın ortasına göre aynalama ve döndürmeler. */
const SYMS: Record<Sym, (p: Pt) => Pt> = {
  flipV: (p) => [PAPER - p[0], p[1]],
  flipH: (p) => [p[0], PAPER - p[1]],
  turn: (p) => [PAPER - p[1], p[0]],
  turn2: (p) => [PAPER - p[0], PAPER - p[1]],
  turn3: (p) => [p[1], PAPER - p[0]],
  diag: (p) => [p[1], p[0]],
  anti: (p) => [PAPER - p[1], PAPER - p[0]],
};

export function variant(folds: Fold[], punches: Pt[], v: Variant): Pt[] {
  if (v.includes('+')) {
    const [base, sym] = v.split('+') as [Base, Sym];
    return variant(folds, punches, base).map(SYMS[sym]);
  }
  if (v in SYMS) return unfold(folds, punches).map(SYMS[v as Sym]);
  if (v === 'none') return [...punches];
  if (v === 'all') {
    let pts = [...punches];
    for (let k = folds.length - 1; k >= 0; k--) {
      const next: Pt[] = [];
      for (const q of pts) {
        next.push(q);
        const r = reflect(folds[k], q);
        if (inside(SQUARE, r)) next.push(r);
      }
      pts = next;
    }
    return pts;
  }
  const [kind, arg] = v.split(':');
  if (kind === 'skip') return unfold(folds, punches, [Number(arg)]);
  if (kind === 'at') {
    const [x, y] = arg.split(',').map(Number);
    return unfold(folds, [[x, y], ...punches.slice(1)]);
  }
  const right = () => unfold(folds, punches);
  if (kind === 'move') {
    const [dx, dy] = arg.split(',').map(Number);
    return right().map((p): Pt => [p[0] + dx, p[1] + dy]);
  }
  if (kind === 'drop') return right().filter((_, i) => i !== Number(arg));
  if (kind === 'add') {
    const [x, y] = arg.split(',').map(Number);
    return [...right(), [x, y]];
  }
  const k = Number(arg);
  const sh = shapes(folds);
  if (kind === 'mid') {
    // Sondan başa açılır; k. katlamada delik, katlama çizgisine paralel ve kâğıdın (o andaki) ortasından geçen çizgiye
    // göre, kanat oraya ulaşsın ya da ulaşmasın, aynalanır.
    let mids = [...punches];
    for (let j = folds.length - 1; j >= 0; j--) {
      const f = folds[j];
      const next: Pt[] = [];
      for (const q of mids) {
        next.push(q);
        if (j === k) {
          const c = centroid(sh[j]);
          const r = reflect({ a: c, b: [c[0] + f.b[0] - f.a[0], c[1] + f.b[1] - f.a[1]], moving: c }, q);
          if (inside(sh[j], r)) next.push(r);
        } else {
          const r = reflect(f, q);
          if (inside(flap(folds, j), r)) next.push(r);
        }
      }
      mids = next;
    }
    return mids;
  }
  let pts = [...punches];
  for (let j = folds.length - 1; j >= 0; j--) {
    const fl = flap(folds, j);
    const next: Pt[] = [];
    for (const q of pts) {
      next.push(q);
      const r = reflect(folds[j], q);
      if (!(inside(fl, r) && inside(sh[j], r))) continue;
      if (j !== k) next.push(r);
      else if (kind === 'slide') {
        const n = normalToMoving(folds[j]);
        const w = flapWidth(folds, j);
        next.push([q[0] + n[0] * w, q[1] + n[1] * w]);
      } else {
        // Katlama çizgisine dik, kâğıdın (katlamadan önceki) ortasından geçen çizgiye göre ayna.
        const c = centroid(sh[j]);
        const f = folds[j];
        const dx = f.b[0] - f.a[0];
        const dy = f.b[1] - f.a[1];
        next.push(reflect({ a: c, b: [c[0] - dy, c[1] + dx], moving: c }, q));
      }
    }
    pts = next;
  }
  return pts;
}

/** Çokgenin ortası: köşelerin ortalaması (dikdörtgende ve üçgende ağırlık merkezi). */
export function centroid(poly: Pt[]): Pt {
  const n = poly.length;
  return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n];
}

/** İki delik kümesi aynı mı (sıra önemsiz, `tol` birimden yakın yerler aynı sayılır)? */
export function sameHoles(a: readonly Pt[], b: readonly Pt[], tol = 0.5): boolean {
  if (a.length !== b.length) return false;
  const used = new Set<number>();
  return a.every((p) => {
    const i = b.findIndex((q, j) => !used.has(j) && Math.hypot(p[0] - q[0], p[1] - q[1]) < tol);
    if (i < 0) return false;
    used.add(i);
    return true;
  });
}

/**
 * Ekrana çizilecek deliklerin yuvarlanmış yerleri (iki ondalık), yukarıdan aşağıya ve soldan sağa sıralı: seçeneklerdeki
 * deliklerin sırası, nasıl üretildiklerini ele vermesin.
 */
export const roundHoles = (pts: readonly Pt[]): Pt[] =>
  pts.map((p): Pt => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
