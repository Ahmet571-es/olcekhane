/**
 * Küp açınımı geometrisi (content/instruments/kup-acinimi.ts): açınım katlanınca her karenin küpün hangi yüzü olduğu,
 * küpün 24 duruşunda üstte, solda ve sağda hangi yüzlerin hangi yönde göründüğü ve çizim için ekran koordinatları.
 *
 * Açınım ızgaradaki altı karedir; karelerin üzerindeki şekiller açınımda döndürülmeden çizilir. Her karenin küpteki
 * yeri bir çerçeveyle tutulur: dışa bakan yön (`n`), karenin açınımdaki sağı (`r`) ve aşağısı (`d`). İlk kare izleyiciye
 * bakar; küp açınımın arkasında kalır. Sağdaki komşu arkaya katlanınca onun dışa bakan yönü ilk karenin sağı olur; öteki
 * yönler de böyle bulunur. Bütün çerçevelerde r × d = −n'dir: katlama bir yüzü aynalamaz.
 *
 * Küp üç yüzü görünecek biçimde çizilir: üst yüz, sol önde ön yüz, sağ önde sağ yüz. Bir yüzün şekli ekranda o yerin
 * kendi "düz" duruşuna göre 0, 1, 2 ya da 3 çeyrek tur (saat yönünde) dönmüş görünür.
 */

export type V3 = readonly [number, number, number];
/** Açınımda bir kare: [sütun, satır]. */
export type Cell = readonly [number, number];

/**
 * Yüzlerdeki şekiller. Dönünce hiç değişmeyenler (daire, halka, artı, kare, çerçeve, dört nokta), yarım turda aynı
 * kalanlar (çubuk, iki nokta) ve her dönüşte değişenler (ok, köşe, yarım dolu kare, üçgen, bayrak). Eğik çizimde birbirine
 * benzeyen şekiller (artı ile çarpı, kare ile baklava) kullanılmaz.
 */
export type CubeSymbol = 'circle' | 'ring' | 'plus' | 'square' | 'frame' | 'four' | 'bar' | 'dots' | 'arrow' | 'corner' | 'half' | 'triangle' | 'flag';
export type CubeColor = 'blue' | 'teal' | 'orange' | 'amber' | 'purple' | 'rose';

export interface CubeFace {
  symbol: CubeSymbol;
  color: CubeColor;
}

/** Bir şeklin dönünce kaç farklı görünüşü vardır (1: hiç değişmez, 2: yarım turda aynı, 4: her çeyrek turda farklı). */
export const SYMBOL_PERIOD: Record<CubeSymbol, 1 | 2 | 4> = {
  circle: 1,
  ring: 1,
  plus: 1,
  square: 1,
  frame: 1,
  four: 1,
  bar: 2,
  dots: 2,
  arrow: 4,
  corner: 4,
  half: 4,
  triangle: 4,
  flag: 4,
};

/** Şekillerin ve renklerin Türkçe adları (ekran okuyucu ve açıklamalar için). */
export const SYMBOL_NAMES: Record<CubeSymbol, string> = {
  circle: 'daire',
  ring: 'halka',
  plus: 'artı',
  square: 'kare',
  frame: 'çerçeve',
  four: 'dört nokta',
  bar: 'çubuk',
  dots: 'iki nokta',
  arrow: 'ok',
  corner: 'köşe',
  half: 'yarım dolu kare',
  triangle: 'üçgen',
  flag: 'bayrak',
};
export const COLOR_NAMES: Record<CubeColor, string> = {
  blue: 'mavi',
  teal: 'yeşil',
  orange: 'turuncu',
  amber: 'sarı',
  purple: 'mor',
  rose: 'pembe',
};
/** Çizim renkleri (açık ve koyu temada aynı; küp her zaman açık zeminde çizilir). */
export const COLOR_HEX: Record<CubeColor, string> = {
  blue: '#2f5ce0',
  teal: '#0e8a7c',
  orange: '#e0602a',
  amber: '#c98a0b',
  purple: '#7a4ee6',
  rose: '#d23f7a',
};

export type Quarter = 0 | 1 | 2 | 3;
/** Küpün görünen üç yeri: üst, sol ön, sağ ön. */
export type CubePos = 'top' | 'left' | 'right';
export const CUBE_POSITIONS: CubePos[] = ['top', 'left', 'right'];
/** Bir görünüş: her yerde hangi yüz (açınımdaki sırası) ve kaç çeyrek tur dönmüş. */
export type CubeView = Record<CubePos, readonly [number, Quarter]>;

export interface Frame {
  n: V3;
  r: V3;
  d: V3;
}

const neg = (a: V3): V3 => [-a[0], -a[1], -a[2]];
const same = (a: V3, b: V3) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/** Açınımı katlar: her karenin küpteki çerçevesi. Geçerli bir küp açınımı değilse hata verir. */
export function foldNet(cells: readonly Cell[]): Frame[] {
  if (cells.length !== 6) throw new Error('Açınımda altı kare olmalı.');
  const frames: (Frame | undefined)[] = cells.map(() => undefined);
  frames[0] = { n: [0, 0, 1], r: [1, 0, 0], d: [0, -1, 0] };
  const queue = [0];
  while (queue.length) {
    const i = queue.shift()!;
    const f = frames[i]!;
    const [c, r] = cells[i];
    cells.forEach(([c2, r2], j) => {
      if (frames[j] || Math.abs(c2 - c) + Math.abs(r2 - r) !== 1) return;
      if (c2 === c + 1) frames[j] = { n: f.r, r: neg(f.n), d: f.d };
      else if (c2 === c - 1) frames[j] = { n: neg(f.r), r: f.n, d: f.d };
      else if (r2 === r + 1) frames[j] = { n: f.d, r: f.r, d: neg(f.n) };
      else frames[j] = { n: neg(f.d), r: f.r, d: f.n };
      queue.push(j);
    });
  }
  if (frames.some((f) => !f)) throw new Error('Açınımın kareleri birbirine bağlı değil.');
  const out = frames as Frame[];
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) if (same(out[i].n, out[j].n)) throw new Error('Bu açınım bir küp oluşturmaz.');
  return out;
}

/** Ekrandaki üç yerin dışa bakan yönü ve şeklin "düz" duruşundaki sağı (U) ve aşağısı (V). */
export const SCREEN: Record<CubePos, { n: V3; u: V3; v: V3 }> = {
  top: { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  left: { n: [0, 0, 1], u: [1, 0, 0], v: [0, -1, 0] },
  right: { n: [1, 0, 0], u: [0, 0, -1], v: [0, -1, 0] },
};

/** Küpün 24 duruşu: determinantı 1 olan işaretli permütasyon matrisleri. */
export const ROTATIONS: number[][][] = (() => {
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  const out: number[][][] = [];
  for (const p of perms) {
    for (let s = 0; s < 8; s++) {
      const m = [0, 1, 2].map((row) => [0, 1, 2].map((col) => (col === p[row] ? ((s >> row) & 1 ? -1 : 1) : 0)));
      const det =
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      if (det === 1) out.push(m);
    }
  }
  return out;
})();

const apply = (m: number[][], v: V3): V3 => [
  m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
  m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
  m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
];

/** Bir yüzün sağı ekranda U'ya mı, V'ye mi, −U'ya mı, −V'ye mi bakıyor: 0–3 çeyrek tur. */
function quarterOf(r: V3, pos: CubePos): Quarter {
  const { u, v } = SCREEN[pos];
  if (same(r, u)) return 0;
  if (same(r, v)) return 1;
  if (same(r, neg(u))) return 2;
  if (same(r, neg(v))) return 3;
  throw new Error('Yüzün yönü bulunamadı.');
}

/** Katlanmış küpün 24 duruşundaki görünüşleri. */
export function cubeViews(cells: readonly Cell[]): CubeView[] {
  const frames = foldNet(cells);
  return ROTATIONS.map((m) => {
    const view = {} as Record<CubePos, readonly [number, Quarter]>;
    for (const pos of CUBE_POSITIONS) {
      const i = frames.findIndex((f) => same(apply(m, f.n), SCREEN[pos].n));
      view[pos] = [i, quarterOf(apply(m, frames[i].r), pos)];
    }
    return view;
  });
}

/** Küpte karşılıklı yüzler: her yüzün karşısındaki yüzün sırası. */
export function oppositeFaces(cells: readonly Cell[]): number[] {
  const frames = foldNet(cells);
  return frames.map((f) => frames.findIndex((g) => same(g.n, neg(f.n))));
}

/** İki görünüş ekranda aynı mı görünür (şekillerin dönme simetrisi hesaba katılarak). */
export function sameLook(a: CubeView, b: CubeView, faces: readonly CubeFace[]): boolean {
  return CUBE_POSITIONS.every((pos) => {
    const [fa, ka] = a[pos];
    const [fb, kb] = b[pos];
    if (fa !== fb) return false;
    const p = SYMBOL_PERIOD[faces[fa].symbol];
    return ka % p === kb % p;
  });
}

/** Görünüş bu açınımla katlanan küpün bir duruşu olabilir mi. */
export function viewPossible(view: CubeView, cells: readonly Cell[], faces: readonly CubeFace[]): boolean {
  return cubeViews(cells).some((v) => sameLook(v, view, faces));
}

/**
 * Seçenek tarifi: küpün bir duruşu (üstteki ve sol öndeki yüzün sırası) ve isteğe bağlı bir değişiklik:
 *  - `turn:<yer>:<çeyrek>`: o yerdeki yüzün şeklini döndürmek (yön yanılgısı),
 *  - `swap:<yer>-<yer>`: iki yerdeki yüzlerin yerini değiştirmek (köşedeki sıra ters: ayna yanılgısı),
 *  - `opp:<yer>:<yer>`: ilk yere ikinci yerdeki yüzün karşısındaki yüzü koymak (karşılıklı yüzler yan yana).
 */
export interface OptionSpec {
  top: number;
  left: number;
  change?: string;
}

/** Değişikliğin yanılgı türü. */
export type CubeLure = 'opposite' | 'order' | 'turn';

export function lureOf(change: string | undefined): CubeLure | null {
  if (!change) return null;
  if (change.startsWith('turn:')) return 'turn';
  if (change.startsWith('swap:')) return 'order';
  if (change.startsWith('opp:')) return 'opposite';
  throw new Error(`Bilinmeyen değişiklik: ${change}`);
}

/** Bir seçenek tarifinin görünüşü. */
export function optionView(cells: readonly Cell[], spec: OptionSpec): CubeView {
  const base = cubeViews(cells).find((v) => v.top[0] === spec.top && v.left[0] === spec.left);
  if (!base) throw new Error(`Bu duruş yok: üstte ${spec.top}, solda ${spec.left}.`);
  if (!spec.change) return base;
  const view: Record<CubePos, readonly [number, Quarter]> = { ...base };
  const [kind, a, b] = spec.change.split(':');
  if (kind === 'turn') {
    const pos = a as CubePos;
    view[pos] = [base[pos][0], ((base[pos][1] + Number(b)) % 4) as Quarter];
  } else if (kind === 'swap') {
    const [p, q] = a.split('-') as [CubePos, CubePos];
    view[p] = base[q];
    view[q] = base[p];
  } else if (kind === 'opp') {
    const pos = a as CubePos;
    const of = b as CubePos;
    view[pos] = [oppositeFaces(cells)[base[of][0]], base[pos][1]];
  } else throw new Error(`Bilinmeyen değişiklik: ${spec.change}`);
  return view;
}

/* ---------- Çizim ---------- */

/** Eğik çizimde 3B noktanın ekrandaki yeri (x sağa ve aşağı, z sola ve aşağı, y yukarı). */
const COS30 = Math.sqrt(3) / 2;
const project = (p: V3): [number, number] => [COS30 * (p[0] - p[2]), 0.5 * (p[0] + p[2]) - p[1]];

/** Görünen bir yüzün ekrandaki dörtgeni ve yüzün birim karesini (0–1) bu dörtgene taşıyan SVG matrisi. */
export interface FaceDraw {
  pos: CubePos;
  points: string;
  matrix: string;
}

const ORIGIN: Record<CubePos, V3> = { top: [0, 1, 0], left: [0, 1, 1], right: [1, 1, 1] };

/** Birim küpün görünen üç yüzü (görünüm kutusu `CUBE_VIEWBOX`). */
export const CUBE_FACES: FaceDraw[] = CUBE_POSITIONS.map((pos) => {
  const o = ORIGIN[pos];
  const { u, v } = SCREEN[pos];
  const at = (s: number, t: number): [number, number] => project([o[0] + s * u[0] + t * v[0], o[1] + s * u[1] + t * v[1], o[2] + s * u[2] + t * v[2]]);
  const [e, f] = at(0, 0);
  const [ua, ub] = at(1, 0).map((x, i) => x - [e, f][i]);
  const [vc, vd] = at(0, 1).map((x, i) => x - [e, f][i]);
  const corners = [at(0, 0), at(1, 0), at(1, 1), at(0, 1)];
  const r = (x: number) => Math.round(x * 1e4) / 1e4;
  return {
    pos,
    points: corners.map(([x, y]) => `${r(x)},${r(y)}`).join(' '),
    matrix: `matrix(${[ua, ub, vc, vd, e, f].map(r).join(' ')})`,
  };
});

/** Çizimin sınırları: x −cos30 ile cos30 arası, y −1 ile 1 arası; kenar payıyla. */
export const CUBE_VIEWBOX = `${-(COS30 + 0.08).toFixed(3)} -1.08 ${(2 * COS30 + 0.16).toFixed(3)} 2.16`;

/**
 * Şekillerin çizimi: birim karede (0–1, merkez 0,5) basit parçalar. Hem açınımda hem küpün yüzlerinde aynı çizim
 * kullanılır; küpte birim kare yüzün dörtgenine taşınır.
 */
export type Prim =
  | { t: 'circle'; cx: number; cy: number; r: number; ring?: boolean }
  | { t: 'rect'; x: number; y: number; w: number; h: number; outline?: boolean }
  | { t: 'poly'; points: string }
  | { t: 'path'; d: string };

export const SYMBOL_SHAPES: Record<CubeSymbol, Prim[]> = {
  circle: [{ t: 'circle', cx: 0.5, cy: 0.5, r: 0.25 }],
  ring: [{ t: 'circle', cx: 0.5, cy: 0.5, r: 0.23, ring: true }],
  plus: [
    { t: 'rect', x: 0.42, y: 0.18, w: 0.16, h: 0.64 },
    { t: 'rect', x: 0.18, y: 0.42, w: 0.64, h: 0.16 },
  ],
  square: [{ t: 'rect', x: 0.27, y: 0.27, w: 0.46, h: 0.46 }],
  frame: [{ t: 'rect', x: 0.22, y: 0.22, w: 0.56, h: 0.56, outline: true }],
  four: [
    { t: 'circle', cx: 0.32, cy: 0.32, r: 0.1 },
    { t: 'circle', cx: 0.68, cy: 0.32, r: 0.1 },
    { t: 'circle', cx: 0.32, cy: 0.68, r: 0.1 },
    { t: 'circle', cx: 0.68, cy: 0.68, r: 0.1 },
  ],
  bar: [{ t: 'rect', x: 0.16, y: 0.41, w: 0.68, h: 0.18 }],
  dots: [
    { t: 'circle', cx: 0.3, cy: 0.5, r: 0.13 },
    { t: 'circle', cx: 0.7, cy: 0.5, r: 0.13 },
  ],
  arrow: [{ t: 'poly', points: '0.16,0.42 0.52,0.42 0.52,0.24 0.84,0.5 0.52,0.76 0.52,0.58 0.16,0.58' }],
  corner: [{ t: 'path', d: 'M0.12 0.12 H0.6 A0.48 0.48 0 0 1 0.12 0.6 Z' }],
  half: [
    { t: 'rect', x: 0.2, y: 0.2, w: 0.6, h: 0.6, outline: true },
    { t: 'rect', x: 0.2, y: 0.2, w: 0.3, h: 0.6 },
  ],
  triangle: [{ t: 'poly', points: '0.5,0.16 0.84,0.8 0.16,0.8' }],
  flag: [
    { t: 'rect', x: 0.22, y: 0.14, w: 0.08, h: 0.72 },
    { t: 'poly', points: '0.3,0.14 0.8,0.3 0.3,0.46' },
  ],
};
