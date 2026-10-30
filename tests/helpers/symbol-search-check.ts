/**
 * Simge bulmanın simge kuralları için bağımsız denetleyici: kütüphanenin (lib/instruments/symbol-search.ts) kodunu kullanmaz.
 * Bir simge 3 × 3 nokta ızgarasında dört çizgidir; çizgi "x1y1-x2y2" (0–2).
 */
type Pt = [number, number];
type Seg = [Pt, Pt];

export function parseStroke(s: string): Seg {
  const m = /^([0-2])([0-2])-([0-2])([0-2])$/.exec(s);
  if (!m) throw new Error(`Geçersiz çizgi: ${s}`);
  return [
    [Number(m[1]), Number(m[2])],
    [Number(m[3]), Number(m[4])],
  ];
}

const ptKey = (p: Pt) => `${p[0]},${p[1]}`;
const segKey = ([a, b]: Seg) => [ptKey(a), ptKey(b)].sort().join('|');
const shapeKey = (segs: Seg[]) => segs.map(segKey).sort().join(' ');

/** Birim çizgi: iki komşu nokta (yatay, dikey ya da çapraz). */
export function isUnit(s: string): boolean {
  const [[x1, y1], [x2, y2]] = parseStroke(s);
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  return Math.max(dx, dy) === 1;
}

/** Çizgiler birbirine bağlı mı (ortak uçlar üzerinden). */
export function connected(strokes: string[]): boolean {
  const segs = strokes.map(parseStroke);
  const seen = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const i = stack.pop()!;
    const ends = segs[i].map(ptKey);
    segs.forEach((s, j) => {
      if (!seen.has(j) && s.some((p) => ends.includes(ptKey(p)))) {
        seen.add(j);
        stack.push(j);
      }
    });
  }
  return seen.size === segs.length;
}

/** Simge ızgaranın bütününe yayılıyor mu (en solda, en sağda, en üstte ve en altta çizgisi var). */
export function spansBox(strokes: string[]): boolean {
  const pts = strokes.flatMap(parseStroke);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return Math.min(...xs) === 0 && Math.max(...xs) === 2 && Math.min(...ys) === 0 && Math.max(...ys) === 2;
}

/** Simgenin sekiz görüntüsü (dört dönüş × ayna), biçim anahtarı olarak. */
export function orientations(strokes: string[]): string[] {
  const segs = strokes.map(parseStroke);
  const rot = (p: Pt): Pt => [2 - p[1], p[0]];
  const mir = (p: Pt): Pt => [2 - p[0], p[1]];
  const out: string[] = [];
  let f = (p: Pt) => p;
  for (let k = 0; k < 4; k++) {
    const g = f;
    out.push(shapeKey(segs.map(([a, b]) => [g(a), g(b)] as Seg)));
    out.push(shapeKey(segs.map(([a, b]) => [mir(g(a)), mir(g(b))] as Seg)));
    f = (p: Pt) => rot(g(p));
  }
  return out;
}

/** İki simge aynı biçimin (dönmüş ya da aynadaki) görüntüsü mü (birebir aynılık dahil). */
export function sameShape(a: string[], b: string[]): boolean {
  return orientations(a).includes(shapeKey(b.map(parseStroke)));
}

/** Ortak çizgi sayısı. */
export function shared(a: string[], b: string[]): number {
  const kb = new Set(b.map((s) => segKey(parseStroke(s))));
  return a.filter((s) => kb.has(segKey(parseStroke(s)))).length;
}

/** Benzer, kaynaktan tam bir çizgi farklı mı: bir çizgi çıkmış, çıkan çizgiyle bir ucu ortak tek bir çizgi gelmiş. */
export function oneJointSwap(src: string[], look: string[]): boolean {
  const ks = src.map((s) => segKey(parseStroke(s)));
  const kl = look.map((s) => segKey(parseStroke(s)));
  const gone = ks.filter((k) => !kl.includes(k));
  const added = kl.filter((k) => !ks.includes(k));
  if (gone.length !== 1 || added.length !== 1 || kl.length !== ks.length) return false;
  const a = gone[0].split('|');
  const b = added[0].split('|');
  return a.some((p) => b.includes(p));
}
