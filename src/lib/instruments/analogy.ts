import type { AnalogyChange, AnalogyElement, AnalogyFill, AnalogyItem, AnalogyLure, AnalogyPanel, AnalogyShape, AnalogySlot } from './types';

/**
 * Şekil benzetmelerinin çizimi ve dönüşümleri.
 *
 * Bir pano 100 × 100 birimlik bir karedir; içinde bir ya da iki parça (şekil) bulunur. Her parçanın biçimi, rengi, büyüklüğü,
 * duruşu (önce dikey eksene göre ayna görüntüsü, sonra saat yönünde dönüş), yeri ve sayısı vardır. Sorular
 * (content/instruments/sekil-benzetmeleri.ts) A panosu, C'deki biçimler ve A'yı B'ye götüren değişikliklerle (`AnalogyOp`)
 * yazılır: B ve doğru cevap bu değişiklikler A'ya ve C'ye uygulanarak, yanlış seçenekler de C'ye başka değişiklikler
 * uygulanarak hesaplanır.
 *
 * Her sorunun tek doğru cevabı olduğu, bu dosyayı kullanmayan bağımsız bir denetleyiciyle doğrulanır
 * (tests/helpers/analogy-check.ts): A'yı B'ye götüren bütün yorumlar (bütün panoyu döndürmek ya da aynalamak, parçaların
 * eşleşmesi, değişikliğin mutlak ya da göreli okunması) C'ye uygulandığında yalnızca doğru seçenek çıkmalıdır.
 */

/* ---------- Biçimler ---------- */

type Pt = [number, number];

/** Biçimlerin birim çizimi (yarıçap ~1, y aşağı doğru): duruşu olmayan hâlleri. Daire ayrıca çizilir. */
const OUTLINE: Record<Exclude<AnalogyShape, 'circle'>, Pt[]> = {
  square: [
    [-0.8, -0.8],
    [0.8, -0.8],
    [0.8, 0.8],
    [-0.8, 0.8],
  ],
  triangle: [
    [0, -0.86],
    [0.92, 0.72],
    [-0.92, 0.72],
  ],
  diamond: [
    [0, -1],
    [0.72, 0],
    [0, 1],
    [-0.72, 0],
  ],
  hexagon: [
    [0.92, 0],
    [0.46, 0.8],
    [-0.46, 0.8],
    [-0.92, 0],
    [-0.46, -0.8],
    [0.46, -0.8],
  ],
  star: Array.from({ length: 10 }, (_, i): Pt => {
    const a = (i * Math.PI) / 5;
    const r = i % 2 === 0 ? 1 : 0.45;
    return [r * Math.sin(a), 0.08 - r * Math.cos(a)];
  }),
  cross: [
    [-0.3, -0.9],
    [0.3, -0.9],
    [0.3, -0.3],
    [0.9, -0.3],
    [0.9, 0.3],
    [0.3, 0.3],
    [0.3, 0.9],
    [-0.3, 0.9],
    [-0.3, 0.3],
    [-0.9, 0.3],
    [-0.9, -0.3],
    [-0.3, -0.3],
  ],
  // Yukarıyı gösteren ok.
  arrow: [
    [0, -1],
    [0.66, -0.12],
    [0.22, -0.12],
    [0.22, 1],
    [-0.22, 1],
    [-0.22, -0.12],
    [-0.66, -0.12],
  ],
  // Düz kenarı altta yarım daire.
  half: [
    ...Array.from({ length: 17 }, (_, i): Pt => {
      const t = Math.PI - (i * Math.PI) / 16;
      return [Math.cos(t), 0.45 - Math.sin(t)];
    }),
  ],
  // Direği solda, flaması sağa bakan bayrak (aynada ve dönüşte biçimi değişir).
  flag: [
    [-0.55, 0.95],
    [-0.55, -0.95],
    [0.78, -0.48],
    [-0.28, -0.02],
    [-0.28, 0.95],
  ],
  // Uzun kolu solda, kısa kolu sağa bakan L biçimi (kollar eşit değildir: aynada biçimi değişir).
  ell: [
    [-0.62, -0.95],
    [-0.14, -0.95],
    [-0.14, 0.47],
    [0.62, 0.47],
    [0.62, 0.95],
    [-0.62, 0.95],
  ],
  // Dik açısı sol altta, dik kenarlarından biri ötekinin neredeyse iki katı olan dik üçgen.
  wedge: [
    [-0.5, -0.95],
    [0.56, 0.85],
    [-0.5, 0.85],
  ],
};

/** Biçimlerin adları (ekran okuyucular ve açıklamalar için). */
export const SHAPE_NAMES: Record<AnalogyShape, string> = {
  circle: 'daire',
  square: 'kare',
  triangle: 'üçgen',
  diamond: 'eşkenar dörtgen',
  hexagon: 'altıgen',
  star: 'yıldız',
  cross: 'artı',
  arrow: 'ok',
  half: 'yarım daire',
  flag: 'bayrak',
  ell: 'L biçimi',
  wedge: 'dik üçgen',
};

/* ---------- Yerleşim ---------- */

/** Büyüklüklerin yarıçapı (pano birimi). Büyük şekil çerçeve gibi panoyu doldurur. */
export const SIZE_RADIUS: Record<1 | 2 | 3, number> = { 1: 12, 2: 20, 3: 40 };

/**
 * Yerlerin merkezleri. Küçük şekiller (büyüklük 1) büyük bir çerçevenin içine sığacak biçimde ortaya yakın, orta boy
 * şekiller (büyüklük 2) panonun kenarlarına yakın durur. Büyük şekil yalnızca ortada durur.
 */
const SLOT_DIR: Record<AnalogySlot, [number, number]> = {
  c: [0, 0],
  l: [-1, 0],
  r: [1, 0],
  t: [0, -1],
  b: [0, 1],
  tl: [-1, -1],
  tr: [1, -1],
  bl: [-1, 1],
  br: [1, 1],
};
const SLOT_OFFSET: Record<1 | 2 | 3, number> = { 1: 14, 2: 24, 3: 0 };

export function slotCenter(slot: AnalogySlot, size: 1 | 2 | 3): Pt {
  const [dx, dy] = SLOT_DIR[slot];
  return [50 + dx * SLOT_OFFSET[size], 50 + dy * SLOT_OFFSET[size]];
}

/** Aynı şekilden birden çok olunca (yalnızca ortadaki küçük şekiller) yerleşim. */
const COUNT_LAYOUT: Record<number, Pt[]> = {
  1: [[50, 50]],
  2: [
    [35, 50],
    [65, 50],
  ],
  3: [
    [22, 50],
    [50, 50],
    [78, 50],
  ],
  4: [
    [35, 35],
    [65, 35],
    [35, 65],
    [65, 65],
  ],
};

/* ---------- Çizim ---------- */

/** Çizim renkleri: kâğıt gibi her temada aynı (şekil akıl yürütmedeki renkler). */
export const ANALOGY_INK = '#1b2333';
export const ANALOGY_GRAY = '#8b929e';
export const ANALOGY_PAPER = '#ffffff';
const FILL: Record<AnalogyFill, string> = { empty: ANALOGY_PAPER, gray: ANALOGY_GRAY, black: ANALOGY_INK };
const STROKE = 2.6;

export type AnalogyPrim =
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: string; stroke: string; sw: number }
  | { kind: 'poly'; points: Pt[]; fill: string; stroke: string; sw: number };

/** Birim çizime duruşu uygular: önce ayna (x → −x), sonra saat yönünde dönüş (y aşağı doğru olduğu için). */
function pose(points: Pt[], angle: number, flip: boolean): Pt[] {
  const a = (angle * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return points.map(([x0, y]) => {
    const x = flip ? -x0 : x0;
    return [x * cos - y * sin, x * sin + y * cos];
  });
}

/** Bir parçanın çizimi (birden çok kopya varsa her biri). */
export function elementPrims(e: AnalogyElement): AnalogyPrim[] {
  const r = SIZE_RADIUS[e.size];
  const centers = e.count > 1 ? COUNT_LAYOUT[e.count] : [slotCenter(e.slot, e.size)];
  const style = { fill: FILL[e.fill], stroke: ANALOGY_INK, sw: STROKE };
  return centers.map(([cx, cy]): AnalogyPrim => {
    if (e.shape === 'circle') return { kind: 'circle', cx, cy, r: r * 0.9, ...style };
    const pts = pose(OUTLINE[e.shape], e.angle, e.flip).map(([x, y]): Pt => [cx + x * r, cy + y * r]);
    return { kind: 'poly', points: pts, ...style };
  });
}

/** Bir panonun çizimi: önce büyük şekiller (çerçeveler), sonra küçükler; aynı büyüklükte olanlar sırasıyla. */
export function panelPrims(panel: AnalogyPanel): AnalogyPrim[] {
  return panel
    .map((e, i) => ({ e, i }))
    .sort((p, q) => q.e.size - p.e.size || p.i - q.i)
    .flatMap(({ e }) => elementPrims(e));
}

/* ---------- Dönüşümler ---------- */

export type AnalogyOp =
  | { k: 'fill'; el: number; to: AnalogyFill }
  | { k: 'size'; el: number; to: 1 | 2 | 3 }
  /** Saat yönünde `by` derece döndürme. */
  | { k: 'turn'; el: number; by: number }
  /** Ayna görüntüsü: `v` dikey eksene göre (sağ ile sol yer değiştirir), `h` yatay eksene göre (üst ile alt). */
  | { k: 'mirror'; el: number; axis: 'v' | 'h' }
  | { k: 'move'; el: number; to: AnalogySlot }
  | { k: 'count'; el: number; to: number }
  /** İki parçanın yerleri değişir. */
  | { k: 'swap'; a: number; b: number };

const norm = (deg: number) => ((deg % 360) + 360) % 360;

export function applyOp(panel: AnalogyPanel, op: AnalogyOp): AnalogyPanel {
  const out = panel.map((e) => ({ ...e }));
  switch (op.k) {
    case 'fill':
      out[op.el].fill = op.to;
      break;
    case 'size':
      out[op.el].size = op.to;
      break;
    case 'turn':
      out[op.el].angle = norm(out[op.el].angle + op.by);
      break;
    case 'mirror': {
      // Dikey eksene göre ayna: dönüş tersine döner ve ayna durumu değişir; yatay eksene göre ayna, bunun 180° döndürülmüşüdür.
      const e = out[op.el];
      e.angle = norm((op.axis === 'h' ? 180 : 0) - e.angle);
      e.flip = !e.flip;
      break;
    }
    case 'move':
      out[op.el].slot = op.to;
      break;
    case 'count':
      out[op.el].count = op.to;
      break;
    case 'swap': {
      const s = out[op.a].slot;
      out[op.a].slot = out[op.b].slot;
      out[op.b].slot = s;
      break;
    }
  }
  return out;
}

export const applyOps = (panel: AnalogyPanel, ops: readonly AnalogyOp[]): AnalogyPanel => ops.reduce(applyOp, panel);

/** Bir parça: verilmeyen özellikler içi boş, orta boy, döndürülmemiş, ortada ve tek. */
export const el = (shape: AnalogyShape, props: Partial<Omit<AnalogyElement, 'shape'>> = {}): AnalogyElement => ({
  shape,
  fill: 'empty',
  size: 2,
  angle: 0,
  flip: false,
  slot: 'c',
  count: 1,
  ...props,
});

/* ---------- Soru kurulumu ---------- */

export interface AnalogySpec {
  key: string;
  level: AnalogyItem['level'];
  changes: AnalogyItem['changes'];
  a: AnalogyPanel;
  /**
   * C (A'nın parçalarıyla aynı sırada). C, A'dan biçimleriyle ve değişmeyen bazı özellikleriyle ayrılabilir; değişen
   * özellikler C'de A'daki gibi başlar (böylece değişikliğin mutlak ya da göreli okunması aynı cevabı verir).
   */
  c: AnalogyPanel;
  /** A'yı B'ye götüren değişiklikler. */
  ops: AnalogyOp[];
  /** Üç yanlış seçenek: türü ve C'ye uygulanan değişiklikler. */
  lures: { kind: AnalogyLure; ops: AnalogyOp[] }[];
  /** Doğru seçeneğin sırası (1–4); yanlış seçenekler kalan yerlere verilen sırayla konur. */
  answer: number;
}

/** Bir parçanın özellikleri ve değişiklik türleri (raporun değişiklik türleri kartı). */
const ATTR_TYPE = { fill: 'look', size: 'look', pose: 'turn', slot: 'place', count: 'place' } as const satisfies Record<string, AnalogyChange>;
type AnalogyAttr = keyof typeof ATTR_TYPE;
const CHANGE_ORDER: AnalogyChange[] = ['look', 'turn', 'place'];

/** `base` parçasının bir özelliği `from`'dakiyle değiştirilmiş hâli. */
function withAttr(base: AnalogyElement, from: AnalogyElement, a: AnalogyAttr): AnalogyElement {
  return a === 'pose' ? { ...base, angle: from.angle, flip: from.flip } : { ...base, [a]: from[a] };
}

/**
 * Parçanın görünüşü: çizimin noktaları yuvarlanıp sıralanır. Böylece görünüşü aynı kalan farklar (ör. kareyi çeyrek tur
 * döndürmek, birden çok kopyası olan parçanın yeri) fark sayılmaz.
 */
function looks(e: AnalogyElement): string {
  const r = (x: number) => String(Math.round(x * 10));
  return elementPrims(e)
    .map((p) => (p.kind === 'circle' ? `o${r(p.cx)},${r(p.cy)},${r(p.r)}` : `p${p.points.map(([x, y]) => `${r(x)},${r(y)}`).sort().join(';')}`) + p.fill)
    .sort()
    .join('|');
}

/**
 * Bir seçenekte uygulanmamış ya da yanlış uygulanmış değişikliklerin türleri: değişikliğin gerektirdiği bir özellik (renk,
 * büyüklük, duruş, yer, sayı) seçenekte doğru cevaptakinden farklı görünüyorsa o özelliğin türü. Değişmemesi gereken bir
 * özellikteki fark (fazladan değişiklik) burada sayılmaz; yanlış seçeneklerin türü (`AnalogyLure`) onu ayrıca anlatır.
 */
export function missedChanges(c: AnalogyPanel, correct: AnalogyPanel, option: AnalogyPanel): AnalogyChange[] {
  const missed = new Set<AnalogyChange>();
  correct.forEach((ce, i) => {
    const target = looks(ce);
    for (const a of Object.keys(ATTR_TYPE) as AnalogyAttr[]) {
      const required = looks(withAttr(ce, c[i], a)) !== target;
      if (required && looks(withAttr(ce, option[i], a)) !== target) missed.add(ATTR_TYPE[a]);
    }
  });
  return CHANGE_ORDER.filter((t) => missed.has(t));
}

export function buildAnalogyItem(s: AnalogySpec): { item: AnalogyItem; answer: number; lures: (AnalogyLure | null)[]; misses: AnalogyChange[][] } {
  if (s.lures.length !== 3) throw new Error(`${s.key}: üç yanlış seçenek olmalı`);
  if (s.answer < 1 || s.answer > 4) throw new Error(`${s.key}: doğru seçeneğin sırası 1–4 olmalı`);
  if (s.c.length !== s.a.length) throw new Error(`${s.key}: A ve C'nin parça sayısı aynı olmalı`);
  const c = s.c;
  const correct = applyOps(c, s.ops);
  const options: AnalogyPanel[] = [];
  const lures: (AnalogyLure | null)[] = [];
  let k = 0;
  for (let pos = 1; pos <= 4; pos++) {
    if (pos === s.answer) {
      options.push(correct);
      lures.push(null);
    } else {
      options.push(applyOps(c, s.lures[k].ops));
      lures.push(s.lures[k].kind);
      k++;
    }
  }
  const misses = options.map((o) => missedChanges(c, correct, o));
  return { item: { key: s.key, level: s.level, changes: [...s.changes], a: s.a, b: applyOps(s.a, s.ops), c, options }, answer: s.answer, lures, misses };
}

/* ---------- Sözlü anlatım (ekran okuyucular için) ---------- */

const FILL_NAMES: Record<AnalogyFill, string> = { empty: 'içi boş', gray: 'gri', black: 'siyah' };
const SIZE_NAMES: Record<1 | 2 | 3, string> = { 1: 'küçük', 2: 'orta boy', 3: 'büyük' };
const SLOT_NAMES: Record<AnalogySlot, string> = {
  c: 'ortada',
  l: 'solda',
  r: 'sağda',
  t: 'üstte',
  b: 'altta',
  tl: 'sol üst köşede',
  tr: 'sağ üst köşede',
  bl: 'sol alt köşede',
  br: 'sağ alt köşede',
};
const ARROW_DIRS = ['yukarıyı', 'sağ üstü', 'sağı', 'sağ altı', 'aşağıyı', 'sol altı', 'solu', 'sol üstü'];
/** Duruşu görünen biçimler (ötekiler dönünce ya da aynada aynı görünür ya da duruşları anlatılmaz). */
const POSED: AnalogyShape[] = ['arrow', 'half', 'flag', 'ell', 'wedge', 'triangle'];

function poseWords(e: AnalogyElement): string {
  if (!POSED.includes(e.shape)) return '';
  const angle = norm(e.angle);
  if (e.shape === 'arrow') return `${ARROW_DIRS[Math.round(angle / 45) % 8]} gösteren`;
  const parts: string[] = [];
  if (e.flip) parts.push('ayna görüntüsü');
  if (angle) parts.push(angle === 180 ? 'yarım tur döndürülmüş' : angle === 90 ? 'saat yönünde çeyrek tur döndürülmüş' : angle === 270 ? 'saat yönünün tersine çeyrek tur döndürülmüş' : `saat yönünde ${angle} derece döndürülmüş`);
  return parts.join(', ');
}

/** Bir parçanın sözlü anlatımı, ör. "küçük siyah daire, sol üst köşede", "3 küçük gri üçgen". */
export function describeElement(e: AnalogyElement): string {
  const look = `${SIZE_NAMES[e.size]} ${FILL_NAMES[e.fill]} ${SHAPE_NAMES[e.shape]}`;
  const p = poseWords(e);
  const what = e.shape === 'arrow' && p ? `${SIZE_NAMES[e.size]} ${FILL_NAMES[e.fill]}, ${p} ok` : p ? `${look} (${p})` : look;
  if (e.count > 1) return `${e.count} ${what}`;
  return e.slot === 'c' ? what : `${what}, ${SLOT_NAMES[e.slot]}`;
}

/** Bir panonun sözlü anlatımı: büyük şekil (çerçeve) önce, ötekiler soldan sağa ve yukarıdan aşağıya. */
export function describePanel(panel: AnalogyPanel): string {
  const sorted = [...panel].sort((p, q) => q.size - p.size || SLOT_DIR[p.slot][0] - SLOT_DIR[q.slot][0] || SLOT_DIR[p.slot][1] - SLOT_DIR[q.slot][1]);
  const words = sorted.map(describeElement);
  if (sorted.length > 1 && sorted[0].size === 3) return `${words[0]}; içinde ${words.slice(1).join(' ve ')}`;
  return words.join('; ');
}
