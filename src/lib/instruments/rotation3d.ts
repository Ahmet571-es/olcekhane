/**
 * Üç boyutlu zihinde döndürme (content/instruments/uc-boyutlu-zihinde-dondurme.ts): küplerden oluşan şekillerin
 * geometrisi ve çizimi.
 *
 * Şekiller Shepard ve Metzler'in (1971) şekilleri gibi yüz yüze birleşmiş küplerden oluşan bir zincirdir: dört kol, üç
 * dik kıvrım. Bir şekil, küplerinin tam sayılı ızgara konumlarıyla (`Cell3`) ve şeklin duruşunu veren bir döndürmeyle
 * (`Mat3`, satır sırasıyla 3×3, determinantı +1) tutulur. Ayna görüntüsü, küplerin konumları aynalanarak (x → −x) elde
 * edilir; döndürme her zaman gerçek bir döndürmedir.
 *
 * Çizim: dünya ekseninde y yukarıdır. Kamera şekle yukarıdan `CAMERA.elevation` derecelik bir açıyla bakar ve hafif bir
 * perspektifle çizer (uzaktaki küpler biraz küçük görünür). Her küpün kameraya bakan ve başka bir küpe yapışık olmayan
 * yüzleri çizilir; küpler kameradan uzaktan yakına sıralanır (ressam yöntemi). Yüzler ışığa göre açık ya da koyu
 * boyanır: gölgelendirme, çizgi çiziminde görülen derinlik belirsizliğini azaltır (Ganis ve Kievit, 2015). Sıralamanın ve
 * görünürlüğün doğruluğunu tests/helpers/rotation3d-check.ts bağımsız bir derinlik tamponuyla denetler.
 */

export type Cell3 = readonly [number, number, number];
/** Satır sırasıyla 3×3 matris. */
export type Mat3 = readonly [number, number, number, number, number, number, number, number, number];
export type Vec3 = readonly [number, number, number];

export type Dir = 'x+' | 'x-' | 'y+' | 'y-' | 'z+' | 'z-';
export const DIRS: Record<Dir, Vec3> = {
  'x+': [1, 0, 0],
  'x-': [-1, 0, 0],
  'y+': [0, 1, 0],
  'y-': [0, -1, 0],
  'z+': [0, 0, 1],
  'z-': [0, 0, -1],
};

/** Bir kol: yönü ve küp sayısı. İlk kol başlangıç küpünü de içerir; sonraki kollar bir önceki kolun ucundan devam eder. */
export interface Arm {
  dir: Dir;
  n: number;
}

/** Kollardan küplerin konumları (zincir sırasıyla). */
export function cellsOf(arms: readonly Arm[]): Cell3[] {
  const out: Cell3[] = [];
  let cur: Vec3 = [0, 0, 0];
  arms.forEach((a, i) => {
    const d = DIRS[a.dir];
    for (let k = 0; k < a.n; k++) {
      if (i > 0 || k > 0) cur = [cur[0] + d[0], cur[1] + d[1], cur[2] + d[2]];
      out.push(cur);
    }
  });
  return out;
}

/** Ayna görüntüsü: x → −x. */
/** Küplerin bir eksene göre ayna görüntüsü (`axis`: 0 x, 1 y, 2 z; ayna görüntüsü için hangi eksenin seçildiği önemli değildir). */
export const mirrorCells = (cells: readonly Cell3[], axis: 0 | 1 | 2 = 0): Cell3[] =>
  cells.map((c) => [axis === 0 ? -c[0] : c[0], axis === 1 ? -c[1] : c[1], axis === 2 ? -c[2] : c[2]] as const);

/**
 * Duruşu `m` olan bir şeklin ayna görüntüsü için yansıtılacak eksen: dünyada en yatay duran eksen (eşitlikte ilki). Şekil böylece dik bir
 * düzleme göre yansıtılır ve ayna görüntüsündeki küplerin yükseklikleri şekildekilerle aynı kalır; yatay bir düzleme göre
 * yansıtılsaydı ayna görüntüsü baş aşağı dururdu ve yalnızca dik eksen çevresinde döndürülen sorularda bir bakışta elenirdi.
 */
export function mirrorAxisFor(m: Mat3): 0 | 1 | 2 {
  let best: 0 | 1 | 2 = 0;
  for (const k of [1, 2] as const) if (Math.abs(m[3 + k]) < Math.abs(m[3 + best]) - 1e-9) best = k;
  return best;
}

export const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export function mul(a: Mat3, b: Mat3): Mat3 {
  const r = new Array<number>(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
  return r as unknown as Mat3;
}

export const apply = (m: Mat3, v: Vec3): Vec3 => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];

export const transpose = (m: Mat3): Mat3 => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];

export const det = (m: Mat3) => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);

const rad = (deg: number) => (deg * Math.PI) / 180;

/** x ekseni çevresinde döndürme (derece; sağ el kuralı). */
export function rotX(deg: number): Mat3 {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [1, 0, 0, 0, c, -s, 0, s, c];
}

/** y ekseni (dik eksen) çevresinde döndürme (derece; yukarıdan bakınca saat yönünün tersi). */
export function rotY(deg: number): Mat3 {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [c, 0, s, 0, 1, 0, -s, 0, c];
}

export function rotZ(deg: number): Mat3 {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [c, -s, 0, s, c, 0, 0, 0, 1];
}

/** Bir döndürmenin açısı (derece, 0–180). */
export function rotationAngle(m: Mat3): number {
  const c = Math.max(-1, Math.min(1, (m[0] + m[4] + m[8] - 1) / 2));
  return (Math.acos(c) * 180) / Math.PI;
}

/** Izgarayı kendine taşıyan 24 döndürme (eksenlerin yer değiştirmesi ve işaretleri; determinantı +1). */
export const LATTICE_ROTATIONS: readonly Mat3[] = (() => {
  const out: Mat3[] = [];
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  for (const p of perms)
    for (let s = 0; s < 8; s++) {
      const m = new Array<number>(9).fill(0);
      p.forEach((col, row) => (m[row * 3 + col] = s & (1 << row) ? -1 : 1));
      if (det(m as unknown as Mat3) > 0) out.push(m as unknown as Mat3);
    }
  return out;
})();

/** Kamera: yukarıdan bakış açısı (derece) ve uzaklık (küp kenarı biriminde). */
export const CAMERA = { elevation: 34, distance: 30 } as const;
/** Işığın geldiği yön (kamera ekseninde: sol üst önden). */
const LIGHT: Vec3 = (() => {
  const v: Vec3 = [-0.35, 0.85, 0.4];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

/** Dünyadan kameraya: kamera yukarıdan baktığı için dünya x ekseni çevresinde döndürülür. */
export const VIEW: Mat3 = rotX(CAMERA.elevation);

/** Kameranın bakış ekseni çevresinde döndürme (resim düzleminde yan yatırma; derece), dünya ekseninde. */
export const rollM = (deg: number): Mat3 => mul(transpose(VIEW), mul(rotZ(deg), VIEW));

/** Bir duruştan önce dik eksen çevresinde `yaw`, sonra resim düzleminde `roll` derece dönülünce varılan duruş. */
export const turnOf = (m: Mat3, yaw: number, roll = 0): Mat3 => mul(rollM(roll), mul(rotY(yaw), m));

export function centroid(cells: readonly Cell3[]): Vec3 {
  const n = cells.length;
  return [cells.reduce((s, c) => s + c[0], 0) / n, cells.reduce((s, c) => s + c[1], 0) / n, cells.reduce((s, c) => s + c[2], 0) / n];
}

/** Küplerin merkezleri kamera ekseninde (şeklin ağırlık merkezi başlangıç noktasındadır; kamera +z'de, −z'ye bakar). */
export function cameraCenters(cells: readonly Cell3[], m: Mat3): Vec3[] {
  const c = centroid(cells);
  const vm = mul(VIEW, m);
  return cells.map((p) => apply(vm, [p[0] - c[0], p[1] - c[1], p[2] - c[2]]));
}

/** Kamera eksenindeki bir noktanın ekrandaki yeri (y aşağı doğru, SVG gibi). */
export function project(p: Vec3): [number, number] {
  const k = CAMERA.distance / (CAMERA.distance - p[2]);
  return [p[0] * k, -p[1] * k];
}

/** Çizilecek bir yüz: köşelerin ekran koordinatları, açıklık (0 koyu – 1 açık) ve hangi küpe ait olduğu. */
export interface Face2D {
  pts: [number, number][];
  tone: number;
  cube: number;
}

const FACE_DIRS: Vec3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/**
 * Bir şeklin çizimi: görünen yüzler, çizilme sırasıyla (uzaktan yakına). Bir küpün başka bir küpe yapışık yüzü hiç
 * görünmez; kameraya arkası dönük yüzler de çizilmez.
 */
export function drawFigure(cells: readonly Cell3[], m: Mat3): Face2D[] {
  const key = (c: Vec3) => `${c[0]},${c[1]},${c[2]}`;
  const filled = new Set(cells.map((c) => key(c)));
  const centers = cameraCenters(cells, m);
  const vm = mul(VIEW, m);
  const eye: Vec3 = [0, 0, CAMERA.distance];
  const order = centers.map((p, i) => ({ i, d: Math.hypot(eye[0] - p[0], eye[1] - p[1], eye[2] - p[2]) })).sort((a, b) => b.d - a.d || a.i - b.i);
  const faces: Face2D[] = [];
  for (const { i } of order) {
    const cell = cells[i];
    const p = centers[i];
    for (const d of FACE_DIRS) {
      if (filled.has(key([cell[0] + d[0], cell[1] + d[1], cell[2] + d[2]]))) continue;
      const n = apply(vm, d);
      const fc: Vec3 = [p[0] + n[0] / 2, p[1] + n[1] / 2, p[2] + n[2] / 2];
      if (n[0] * (eye[0] - fc[0]) + n[1] * (eye[1] - fc[1]) + n[2] * (eye[2] - fc[2]) <= 1e-9) continue;
      // Yüzün öteki iki ekseni.
      const others = FACE_DIRS.filter((e) => e[0] * d[0] + e[1] * d[1] + e[2] * d[2] === 0 && e[0] + e[1] + e[2] > 0).map((e) => apply(vm, e));
      const [u, v] = others;
      const corners: Vec3[] = [
        [fc[0] + (u[0] + v[0]) / 2, fc[1] + (u[1] + v[1]) / 2, fc[2] + (u[2] + v[2]) / 2],
        [fc[0] + (u[0] - v[0]) / 2, fc[1] + (u[1] - v[1]) / 2, fc[2] + (u[2] - v[2]) / 2],
        [fc[0] + (-u[0] - v[0]) / 2, fc[1] + (-u[1] - v[1]) / 2, fc[2] + (-u[2] - v[2]) / 2],
        [fc[0] + (-u[0] + v[0]) / 2, fc[1] + (-u[1] + v[1]) / 2, fc[2] + (-u[2] + v[2]) / 2],
      ];
      const lit = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      faces.push({ pts: corners.map(project), tone: Math.round(lit * 1000) / 1000, cube: i });
    }
  }
  return faces;
}

/** Çizimin ekrandaki sınırları. */
export function bounds(faces: readonly Face2D[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const f of faces)
    for (const [x, y] of f.pts) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  return { minX, minY, maxX, maxY };
}

/** Yüzün rengi: açıklığa göre aynı mavinin tonları (açık ve koyu temada aynı; şekiller her zaman açık zeminde çizilir). */
export function faceFill(tone: number): string {
  const l = Math.round(40 + 52 * tone);
  return `hsl(214 52% ${l}%)`;
}
