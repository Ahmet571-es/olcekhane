/**
 * Parçalardan şekil geometrisi (content/instruments/parcalardan-sekil.ts). Bütün parçalar ve şekiller birim karelerden
 * oluşan bir ızgaranın üstündedir; bir kare ya tam doludur ya da köşegeniyle ikiye bölünmüş yarım karedir (dik üçgen).
 * Izgarada x sağa, y aşağı doğru artar.
 *
 * Bir şekil "simge dizisi"yle yazılır: satırlar `/` ile, karelerin simgeleri boşlukla ayrılır.
 *  - `.`: boş kare.
 *  - Bir rakam (ör. `2`): tam kare; rakam, karenin hangi parçaya ait olduğunu söyler.
 *  - Rakam ve harf (ör. `1B`): yarım kare. Harf, karenin dolu yarısının köşesini söyler: `A` sol üst, `B` sağ üst, `C` sağ
 *    alt, `D` sol alt (dik açı o köşededir).
 *  - İki rakam-harf çifti (ör. `1B2D`): köşegenle ikiye bölünmüş, iki yarısı iki ayrı parçaya ait kare.
 * Parçaların kendisi tek parçalı şekillerdir (hepsi `1`); seçeneklerde her rakam bir parçadır ve parçaların sınırları çizilir.
 *
 * İç yapı: her kare dört üçgene (çeyrek) ayrılır: 0 üst, 1 sağ, 2 alt, 3 sol. Tam kare dört, yarım kare iki komşu çeyrektir
 * (A = sol + üst, B = üst + sağ, C = sağ + alt, D = alt + sol).
 */

/** Bir çeyrek: kare (x, y), çeyrek q (0 üst, 1 sağ, 2 alt, 3 sol) ve ait olduğu parça (1'den başlar). */
export interface Quarter {
  x: number;
  y: number;
  q: 0 | 1 | 2 | 3;
  part: number;
}

export interface ParsedShape {
  w: number;
  h: number;
  quarters: Quarter[];
  /** Parça sayısı (en büyük parça numarası). */
  parts: number;
}

const HALF: Record<string, [0 | 1 | 2 | 3, 0 | 1 | 2 | 3]> = { A: [3, 0], B: [0, 1], C: [1, 2], D: [2, 3] };

/** Simge dizisini çeyreklere çevirir; geçersiz bir simgede hata verir. */
export function parseShape(s: string): ParsedShape {
  const rows = s.trim().split('/').map((r) => r.trim().split(/\s+/));
  const w = Math.max(...rows.map((r) => r.length));
  const quarters: Quarter[] = [];
  rows.forEach((row, y) =>
    row.forEach((tok, x) => {
      if (tok === '.') return;
      if (/^[1-9]$/.test(tok)) {
        for (const q of [0, 1, 2, 3] as const) quarters.push({ x, y, q, part: Number(tok) });
        return;
      }
      const m = tok.match(/^([1-9])([A-D])(?:([1-9])([A-D]))?$/);
      if (!m) throw new Error(`Geçersiz simge: ${tok}`);
      const halves: [string, string][] = [[m[1], m[2]]];
      if (m[3]) halves.push([m[3], m[4]]);
      if (halves.length === 2 && HALF[halves[0][1]].some((q) => HALF[halves[1][1]].includes(q))) throw new Error(`Üst üste binen yarımlar: ${tok}`);
      for (const [p, h] of halves) for (const q of HALF[h]) quarters.push({ x, y, q, part: Number(p) });
    }),
  );
  return { w, h: rows.length, quarters, parts: Math.max(0, ...quarters.map((q) => q.part)) };
}

/** Bir şeklin alanı (birim kare). */
export const shapeArea = (s: string) => parseShape(s).quarters.length / 4;

type Pt = [number, number];
const corners = (x: number, y: number): Pt[] => [
  [x, y],
  [x + 1, y],
  [x + 1, y + 1],
  [x, y + 1],
];

/** Çeyreğin üçgeni: karenin iki köşesi ve merkezi. */
export function quarterTriangle(t: Quarter): [Pt, Pt, Pt] {
  const c = corners(t.x, t.y);
  return [c[t.q], c[(t.q + 1) % 4], [t.x + 0.5, t.y + 0.5]];
}

export interface ShapeDrawing {
  w: number;
  h: number;
  /** Doldurulacak üçgenler (çeyrekler), parça numarasıyla. */
  fills: { part: number; points: [Pt, Pt, Pt] }[];
  /** Dış hat: şeklin boşlukla sınırı (birim parçalar halinde, düz çizgiler birleştirilmiş). */
  outline: [Pt, Pt][];
  /** İç çizgiler: iki farklı parçanın sınırı. */
  inner: [Pt, Pt][];
}

const key = (x: number, y: number, q: number) => `${x},${y},${q}`;

/** Aynı doğrultuda uç uca gelen çizgileri birleştirir (çizimde köşe birleşimleri temiz görünsün). */
function merge(segs: [Pt, Pt][]): [Pt, Pt][] {
  const out: [Pt, Pt][] = [];
  const left = segs.map(([a, b]) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? ([a, b] as [Pt, Pt]) : ([b, a] as [Pt, Pt])));
  const same = (p: Pt, q: Pt) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9;
  const dir = ([a, b]: [Pt, Pt]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const n = Math.hypot(dx, dy);
    return `${Math.round((dx / n) * 1000)},${Math.round((dy / n) * 1000)}`;
  };
  while (left.length) {
    let [a, b] = left.shift()!;
    const d = dir([a, b]);
    let grown = true;
    while (grown) {
      grown = false;
      for (let i = 0; i < left.length; i++) {
        const s = left[i];
        if (dir(s) !== d) continue;
        if (same(s[0], b)) {
          b = s[1];
        } else if (same(s[1], a)) {
          a = s[0];
        } else continue;
        left.splice(i, 1);
        grown = true;
        break;
      }
    }
    out.push([a, b]);
  }
  return out;
}

/** Şeklin çizimi: dolgu üçgenleri, dış hat ve parçalar arasındaki iç çizgiler. */
export function drawShape(s: string): ShapeDrawing {
  const { w, h, quarters } = parseShape(s);
  const owner = new Map<string, number>();
  for (const t of quarters) owner.set(key(t.x, t.y, t.q), t.part);
  const outline: [Pt, Pt][] = [];
  const inner: [Pt, Pt][] = [];
  for (const t of quarters) {
    const [a, b, c] = quarterTriangle(t);
    // Karenin kenarındaki komşu çeyrek ve aynı karedeki iki komşu çeyrek.
    const across = t.q === 0 ? key(t.x, t.y - 1, 2) : t.q === 1 ? key(t.x + 1, t.y, 3) : t.q === 2 ? key(t.x, t.y + 1, 0) : key(t.x - 1, t.y, 1);
    const edges: [Pt, Pt, string][] = [
      [a, b, across],
      [b, c, key(t.x, t.y, (t.q + 1) % 4)],
      [c, a, key(t.x, t.y, (t.q + 3) % 4)],
    ];
    for (const [p, q, nb] of edges) {
      const o = owner.get(nb);
      if (o === t.part) continue;
      if (o === undefined) outline.push([p, q]);
      // İki parça arasındaki çizgi bir kez çizilir.
      else if (o > t.part) inner.push([p, q]);
    }
  }
  return { w, h, fills: quarters.map((t) => ({ part: t.part, points: quarterTriangle(t) })), outline: merge(outline), inner: merge(inner) };
}

/** Çizginin SVG yolu. */
export const segPath = (segs: [Pt, Pt][]) => segs.map(([a, b]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`).join('');
/** Üçgenlerin SVG yolu (aynı renkte dolgu için tek yol). */
export const fillPath = (fills: ShapeDrawing['fills']) => fills.map(({ points: [a, b, c] }) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}Z`).join('');

/**
 * Parçaların ekrandaki yerleşimi: soldan sağa, aralarında `gap` birim boşlukla; her parçanın üstten kayması `dy` (birim).
 * Toplam genişlik ve yükseklikle birlikte döner.
 */
export function layoutPieces(pieces: { shape: string; dy: number }[], gap = 0.9): { x: number; y: number; w: number; h: number }[] {
  let x = 0;
  return pieces.map((p) => {
    const { w, h } = parseShape(p.shape);
    const box = { x, y: p.dy, w, h };
    x += w + gap;
    return box;
  });
}

/** Yönergedeki örnek: iki parça ve onların (döndürülmeden, yan yana kaydırılarak) oluşturduğu bütün. */
export const ASSEMBLY_EXAMPLE = {
  pieces: [
    { shape: '1 1/1 1A', dy: 0 },
    { shape: '. 1/1C 1', dy: 0.6 },
  ],
  whole: '1 1 2/1 1A2C 2',
};
