/**
 * Üç boyutlu zihinde döndürme sorularının bağımsız denetleyicisi (tests/uc-boyutlu-zihinde-dondurme.test.ts). Testin
 * kendi çizim hesabından (lib/instruments/rotation3d.ts: görünen yüzleri seçip küpleri uzaktan yakına sıralayan ressam
 * yöntemi) farklı yollarla çalışır:
 *
 *  1. Aynı mı, ayna görüntüsü mü? Yalnızca tarayıcıya giden veriden (küplerin konumları ve duruş matrisi), küplerin
 *     ekrandaki şeklin arkasındaki üç boyutlu merkezleri hesaplanır. Yüz yüze komşu küplerin arasındaki birim vektörler
 *     şeklin kendi üç eksenini verir; küpler bu eksenlerde yeniden tam sayılı konumlara yerleştirilir ve iki şekil, 24
 *     döndürmenin (ya da aynalamayla birlikte 48 dönüşümün) her biriyle ötelenerek karşılaştırılır.
 *  2. Görünürlük: küplerin bütün üçgenleri bir derinlik tamponuyla (her piksel için en yakın küp) taranır. Her küpün
 *     görünen piksel sayısı, o küp tek başına çizilseydi kaplayacağı piksel sayısıyla karşılaştırılır.
 *  3. Çizim sırası: ressam yönteminin çokgenleri sırayla boyanınca her pikselde en son kalan küp, derinlik tamponundaki
 *     en yakın küple aynı olmalıdır.
 */
import { CAMERA, drawFigure, type Cell3, type Face2D, type Mat3 } from '@/lib/instruments/rotation3d';

type V = [number, number, number];

const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V) => Math.sqrt(dot(a, a));

/** Kamera ekseninde küp merkezleri: dünya → kamera dönüşümü kameranın yükseklik açısından yeniden kurulur. */
export function centersOf(cells: readonly Cell3[], m: Mat3): V[] {
  const n = cells.length;
  const c: V = [0, 1, 2].map((k) => cells.reduce((s, p) => s + p[k], 0) / n) as V;
  const e = (CAMERA.elevation * Math.PI) / 180;
  return cells.map((p) => {
    const q = sub([p[0], p[1], p[2]], c);
    const w: V = [m[0] * q[0] + m[1] * q[1] + m[2] * q[2], m[3] * q[0] + m[4] * q[1] + m[5] * q[2], m[6] * q[0] + m[7] * q[1] + m[8] * q[2]];
    // x ekseni çevresinde e kadar: yukarıdaki noktalar kameraya yaklaşır.
    return [w[0], Math.cos(e) * w[1] - Math.sin(e) * w[2], Math.sin(e) * w[1] + Math.cos(e) * w[2]];
  });
}

/**
 * Üç boyutlu merkezlerden şeklin tam sayılı konumları: komşu küpler arasındaki birim vektörlerden şeklin eksenleri
 * bulunur (sağ elli bir eksen takımı olacak biçimde), merkezler bu eksenlere izdüşürülüp yuvarlanır. Yuvarlama payı
 * küçük olmalıdır; değilse şekil ızgaraya oturmuyor demektir.
 */
export function latticeOf(centers: readonly V[]): { cells: V[]; err: number } {
  const dirs: V[] = [];
  for (let i = 0; i < centers.length; i++)
    for (let j = i + 1; j < centers.length; j++) {
      const d = sub(centers[j], centers[i]);
      if (Math.abs(len(d) - 1) < 0.01) dirs.push(d);
    }
  const axes: V[] = [];
  for (const d of dirs) if (axes.every((a) => Math.abs(dot(a, d)) < 0.5)) axes.push(d);
  if (axes.length < 2) throw new Error('Şeklin eksenleri bulunamadı.');
  // İki eksen bulunduysa üçüncüsü vektörel çarpımdır; üçü de bulunduysa takım sağ elli olacak biçimde üçüncüsü çevrilir.
  const third = cross(axes[0], axes[1]);
  const ax: V[] = [axes[0], axes[1], third];
  let err = 0;
  const o = centers[0];
  const cells = centers.map((p) => {
    const q = sub(p, o);
    const raw = ax.map((a) => dot(a, q));
    const r = raw.map((x) => Math.round(x)) as V;
    raw.forEach((x, k) => (err = Math.max(err, Math.abs(x - r[k]))));
    return r;
  });
  return { cells, err };
}

/** Izgarayı kendine taşıyan 48 dönüşüm (eksenlerin bütün yer değiştirmeleri ve işaretleri) ve determinantları. */
const SIGNED_PERMS: { p: number[]; s: number[]; det: number }[] = (() => {
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  const parity = (p: number[]) => (p[0] === 0 ? (p[1] === 1 ? 1 : -1) : p[0] === 1 ? (p[1] === 0 ? -1 : 1) : p[1] === 0 ? 1 : -1);
  const out: { p: number[]; s: number[]; det: number }[] = [];
  for (const p of perms)
    for (let k = 0; k < 8; k++) {
      const s = [k & 1 ? -1 : 1, k & 2 ? -1 : 1, k & 4 ? -1 : 1];
      out.push({ p, s, det: parity(p) * s[0] * s[1] * s[2] });
    }
  return out;
})();

/** Bir küp kümesinin ötelemeden bağımsız yazımı (sıralı konumlar). */
function norm(cells: readonly V[]): string {
  const mn = [0, 1, 2].map((k) => Math.min(...cells.map((c) => c[k])));
  return cells
    .map((c) => c.map((x, k) => x - mn[k]).join(','))
    .sort()
    .join(';');
}

/** İki küp kümesi döndürmeyle ("same"), yalnızca aynalamayla birlikte ("mirror") çakışıyor mu, hiç çakışmıyor mu ("other")? */
export function relation(a: readonly V[], b: readonly V[]): 'same' | 'mirror' | 'other' {
  if (a.length !== b.length) return 'other';
  const target = norm(a);
  let mirror = false;
  for (const t of SIGNED_PERMS) {
    const moved = b.map((c) => t.p.map((src, k) => t.s[k] * c[src]) as V);
    if (norm(moved) === target) {
      if (t.det > 0) return 'same';
      mirror = true;
    }
  }
  return mirror ? 'mirror' : 'other';
}

/** Şekil ayna simetrisiz mi: ayna görüntüsü döndürülerek şeklin kendisi yapılamaz. */
export function isChiral(cells: readonly V[]): boolean {
  return (
    relation(
      cells,
      cells.map(([x, y, z]) => [-x, y, z] as V),
    ) === 'mirror'
  );
}

/** Ekrana izdüşüm (kamera +z'de, −z'ye bakar; y aşağı). */
function proj(p: V): [number, number, number] {
  const w = 1 / (CAMERA.distance - p[2]);
  return [CAMERA.distance * p[0] * w, -CAMERA.distance * p[1] * w, w];
}

/** Küpün 12 üçgeni (köşeler kamera ekseninde). */
function cubeTriangles(center: V, ax: V[]): V[][] {
  const corner = (sx: number, sy: number, sz: number): V => [0, 1, 2].map((k) => center[k] + (sx * ax[0][k] + sy * ax[1][k] + sz * ax[2][k]) / 2) as V;
  const tris: V[][] = [];
  for (let axis = 0; axis < 3; axis++)
    for (const side of [-1, 1]) {
      const q: V[] = [];
      for (const [a, b] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ]) {
        const s = [0, 0, 0];
        s[axis] = side;
        s[(axis + 1) % 3] = a;
        s[(axis + 2) % 3] = b;
        q.push(corner(s[0], s[1], s[2]));
      }
      tris.push([q[0], q[1], q[2]], [q[0], q[2], q[3]]);
    }
  return tris;
}

export interface Raster {
  /** Piksel boyu (küp kenarı biriminde). */
  px: number;
  x0: number;
  y0: number;
  w: number;
  h: number;
  /** Her pikselde en yakın küp (−1: boş). */
  owner: Int16Array;
  /** Her küpün görünen piksel sayısı ve tek başına çizilseydi kaplayacağı piksel sayısı. */
  visible: number[];
  solo: number[];
}

/**
 * Küpleri derinlik tamponuyla tarar: her küpün altı yüzü iki üçgen olarak çizilir (görünüp görünmediğine bakılmaz);
 * her pikselde kameraya en yakın üçgenin küpü kalır. Küplerin kenar yönleri duruş matrisinin sütunlarıdır.
 */
export function zbuffer(cells: readonly Cell3[], m: Mat3, px = 0.025): Raster {
  const centers = centersOf(cells, m);
  // Şeklin eksenleri (kamera ekseninde): bir küpün kenar yönleri.
  const col = (k: number): V => {
    const e = (CAMERA.elevation * Math.PI) / 180;
    const w: V = [m[k], m[3 + k], m[6 + k]];
    return [w[0], Math.cos(e) * w[1] - Math.sin(e) * w[2], Math.sin(e) * w[1] + Math.cos(e) * w[2]];
  };
  const ax = [col(0), col(1), col(2)];
  const tris = centers.map((c) => cubeTriangles(c, ax).map((t) => t.map(proj)));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ts of tris)
    for (const t of ts)
      for (const [x, y] of t) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
  const x0 = minX - px;
  const y0 = minY - px;
  const w = Math.ceil((maxX - x0) / px) + 2;
  const h = Math.ceil((maxY - y0) / px) + 2;
  const depth = new Float64Array(w * h).fill(-Infinity);
  const owner = new Int16Array(w * h).fill(-1);
  const solo = new Array<number>(cells.length).fill(0);
  const soloMask = new Uint8Array(w * h);
  tris.forEach((ts, ci) => {
    soloMask.fill(0);
    for (const [a, b, c] of ts) {
      const area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      if (Math.abs(area) < 1e-12) continue;
      const lo = Math.max(0, Math.floor((Math.min(a[0], b[0], c[0]) - x0) / px));
      const hi = Math.min(w - 1, Math.ceil((Math.max(a[0], b[0], c[0]) - x0) / px));
      const lo2 = Math.max(0, Math.floor((Math.min(a[1], b[1], c[1]) - y0) / px));
      const hi2 = Math.min(h - 1, Math.ceil((Math.max(a[1], b[1], c[1]) - y0) / px));
      for (let j = lo2; j <= hi2; j++) {
        const y = y0 + (j + 0.5) * px;
        for (let i = lo; i <= hi; i++) {
          const x = x0 + (i + 0.5) * px;
          const l1 = ((b[0] - x) * (c[1] - y) - (b[1] - y) * (c[0] - x)) / area;
          const l2 = ((c[0] - x) * (a[1] - y) - (c[1] - y) * (a[0] - x)) / area;
          const l3 = 1 - l1 - l2;
          if (l1 < 0 || l2 < 0 || l3 < 0) continue;
          // 1/(D − z) ekranda doğrusal değişir; büyük olan yakındır.
          const wz = l1 * a[2] + l2 * b[2] + l3 * c[2];
          const k = j * w + i;
          soloMask[k] = 1;
          if (wz > depth[k]) {
            depth[k] = wz;
            owner[k] = ci;
          }
        }
      }
    }
    solo[ci] = soloMask.reduce((s, x) => s + x, 0);
  });
  const visible = new Array<number>(cells.length).fill(0);
  for (const o of owner) if (o >= 0) visible[o]++;
  return { px, x0, y0, w, h, owner, visible, solo };
}

/** Ressam yönteminin çokgenleri sırayla boyanınca her pikselde kalan küp; derinlik tamponuyla uyuşmayan piksel oranı. */
export function painterMismatch(faces: readonly Face2D[], r: Raster): number {
  const paint = new Int16Array(r.w * r.h).fill(-1);
  for (const f of faces) {
    const xs = f.pts.map((p) => p[0]);
    const ys = f.pts.map((p) => p[1]);
    const lo = Math.max(0, Math.floor((Math.min(...xs) - r.x0) / r.px));
    const hi = Math.min(r.w - 1, Math.ceil((Math.max(...xs) - r.x0) / r.px));
    const lo2 = Math.max(0, Math.floor((Math.min(...ys) - r.y0) / r.px));
    const hi2 = Math.min(r.h - 1, Math.ceil((Math.max(...ys) - r.y0) / r.px));
    const n = f.pts.length;
    for (let j = lo2; j <= hi2; j++) {
      const y = r.y0 + (j + 0.5) * r.px;
      for (let i = lo; i <= hi; i++) {
        const x = r.x0 + (i + 0.5) * r.px;
        // Dışbükey çokgen: bütün kenarlarda aynı yanda.
        let pos = 0;
        let neg = 0;
        for (let k = 0; k < n; k++) {
          const [ax, ay] = f.pts[k];
          const [bx, by] = f.pts[(k + 1) % n];
          const s = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
          if (s > 0) pos++;
          else if (s < 0) neg++;
        }
        if (pos === 0 || neg === 0) paint[j * r.w + i] = f.cube;
      }
    }
  }
  let covered = 0;
  let bad = 0;
  for (let k = 0; k < paint.length; k++) {
    if (r.owner[k] < 0 && paint[k] < 0) continue;
    covered++;
    if (r.owner[k] !== paint[k]) bad++;
  }
  return covered ? bad / covered : 0;
}

/**
 * Küplerin zincir sırası: tarayıcıya giden veride küpler karışık sırayla gider; zincir, yüz yüze komşu küplerden yeniden
 * kurulur (bir uçtan öbür uca). Kol ve uç denetimleri bu sırayla yapılır.
 */
export function chainOrder(cells: readonly Cell3[]): number[] {
  const nb = cells.map((a, i) => cells.flatMap((b, j) => (j !== i && Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) === 1 ? [j] : [])));
  const ends = nb.flatMap((x, i) => (x.length === 1 ? [i] : []));
  if (ends.length !== 2 || nb.some((x) => x.length > 2)) throw new Error('Küpler bir zincir oluşturmuyor.');
  const order = [ends[0]];
  while (order.length < cells.length) {
    const next = nb[order[order.length - 1]].find((j) => !order.includes(j));
    if (next === undefined) throw new Error('Küpler bir zincir oluşturmuyor.');
    order.push(next);
  }
  return order;
}

/**
 * Kolların ekrandaki kısalması: zincirdeki her düz parçanın (kolun) yönünün ekran düzlemindeki payı (1: kol ekrana
 * paralel, 0: kol tam kameraya ya da tam tersine bakıyor). Kameraya doğru uzanan bir kolun küpleri üst üste biner.
 */
export function armFactors(cells: readonly Cell3[], m: Mat3): number[] {
  const c = centersOf(cells, m);
  const out: number[] = [];
  let i = 0;
  while (i < c.length - 1) {
    const d = sub(c[i + 1], c[i]);
    let j = i + 1;
    while (j < c.length - 1 && len(sub(sub(c[j + 1], c[j]), d)) < 0.01) j++;
    // Kameradan parçanın ortasına bakış yönüne göre: parçanın bu yöne dik bileşeni.
    const mid: V = [0, 1, 2].map((k) => (c[i][k] + c[j][k]) / 2) as V;
    const view = sub(mid, [0, 0, CAMERA.distance]);
    const vl = len(view);
    const along = dot(d, view) / vl;
    out.push(Math.sqrt(Math.max(0, 1 - along * along)));
    i = j;
  }
  return out;
}

/**
 * İki çizimin siluetlerinin örtüşmesi (kesişim / birleşim), ağırlık merkezleri çakıştırılarak. Şekillere bakmadan
 * "hedefe en çok benzeyen iki seçenek" gibi kestirme bir yolun doğru cevabı bulup bulmadığını denetlemek için.
 */
export function silhouetteIoU(a: Raster, b: Raster): number {
  const cells = (r: Raster) => {
    const pts: [number, number][] = [];
    for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) if (r.owner[j * r.w + i] >= 0) pts.push([r.x0 + (i + 0.5) * r.px, r.y0 + (j + 0.5) * r.px]);
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    return new Set(pts.map((p) => `${Math.round((p[0] - cx) / 0.08)},${Math.round((p[1] - cy) / 0.08)}`));
  };
  const A = cells(a);
  const B = cells(b);
  let inter = 0;
  for (const k of A) if (B.has(k)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Dışbükey çokgenin alanı. */
function polyArea(p: [number, number][]): number {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

/** Noktaların dışbükey zarfı (saat yönünün tersine). */
function hull(pts: [number, number][]): [number, number][] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: [number, number], a: [number, number], b: [number, number]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const x of p) {
    while (lower.length >= 2 && cr(lower[lower.length - 2], lower[lower.length - 1], x) <= 0) lower.pop();
    lower.push(x);
  }
  const upper: [number, number][] = [];
  for (const x of [...p].reverse()) {
    while (upper.length >= 2 && cr(upper[upper.length - 2], upper[upper.length - 1], x) <= 0) upper.pop();
    upper.push(x);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** İki dışbükey çokgenin kesişimi (Sutherland–Hodgman). */
function clip(subject: [number, number][], by: [number, number][]): [number, number][] {
  let out = subject;
  for (let i = 0; i < by.length && out.length; i++) {
    const a = by[i];
    const b = by[(i + 1) % by.length];
    const inside = (p: [number, number]) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0;
    const cut = (p: [number, number], q: [number, number]): [number, number] => {
      const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      const d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
      const t = d1 / (d1 - d2);
      return [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
    };
    const input = out;
    out = [];
    for (let k = 0; k < input.length; k++) {
      const p = input[k];
      const q = input[(k + 1) % input.length];
      if (inside(q)) {
        if (!inside(p)) out.push(cut(p, q));
        out.push(q);
      } else if (inside(p)) out.push(cut(p, q));
    }
  }
  return out;
}

/**
 * Her küpün kol numarası (zincir sırasıyla) ve ekrandaki siluetinin dışbükey zarfı. Köşedeki küp iki kola birden aittir:
 * `arm` önceki, `armHi` sonraki kolun numarasıdır (öteki küplerde ikisi aynıdır). Böylece sonuç, zincirin hangi uçtan
 * okunduğuna bağlı değildir.
 */
function armSilhouettes(cells: readonly Cell3[], m: Mat3): { arm: number[]; armHi: number[]; sil: [number, number][][] } {
  const c = centersOf(cells, m);
  const arm: number[] = [0];
  let k = 0;
  for (let i = 1; i < c.length; i++) {
    if (i >= 2) {
      const d1 = sub(c[i - 1], c[i - 2]);
      const d2 = sub(c[i], c[i - 1]);
      if (len(sub(d1, d2)) > 0.01) k++;
    }
    arm.push(k);
  }
  const e = (CAMERA.elevation * Math.PI) / 180;
  const col = (j: number): V => {
    const w: V = [m[j], m[3 + j], m[6 + j]];
    return [w[0], Math.cos(e) * w[1] - Math.sin(e) * w[2], Math.sin(e) * w[1] + Math.cos(e) * w[2]];
  };
  const ax = [col(0), col(1), col(2)];
  const sil = c.map((p) => {
    const pts: [number, number][] = [];
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        for (const sz of [-1, 1]) {
          const q: V = [0, 1, 2].map((t) => p[t] + (sx * ax[0][t] + sy * ax[1][t] + sz * ax[2][t]) / 2) as V;
          const [x, y] = proj(q);
          pts.push([x, y]);
        }
    return hull(pts);
  });
  const armHi = arm.map((k, i) => (i > 0 && i < c.length - 1 && len(sub(sub(c[i], c[i - 1]), sub(c[i + 1], c[i]))) > 0.01 ? k + 1 : k));
  return { arm, armHi, sil };
}

/**
 * Birbirine bağlı olmayan kolların ekranda üst üste binmesi: kol numaraları en az iki farklı olan (ör. 1. ve 3. kol) iki
 * küpün ekrandaki siluetlerinin kesişimi, küçük siluetin alanına oranla (en büyüğü). Böyle bir binme, bir kolun öbürünü
 * kapatması ya da iki kolun çaprazlanıp şeklin okunmasını zorlaştırması demektir (Caissie ve ark., 2009).
 */
export function crossArmOverlap(cells: readonly Cell3[], m: Mat3): number {
  const { arm, armHi, sil } = armSilhouettes(cells, m);
  let worst = 0;
  for (let i = 0; i < sil.length; i++)
    for (let j = i + 1; j < sil.length; j++) {
      // Zincirde i, j'den öncedir: kollar arasındaki en küçük fark (köşe küpleri iki kola birden sayılır).
      if (arm[j] - armHi[i] < 2) continue;
      const inter = clip(sil[i], sil[j]);
      if (inter.length < 3) continue;
      worst = Math.max(worst, polyArea(inter) / Math.min(polyArea(sil[i]), polyArea(sil[j])));
    }
  return worst;
}

/**
 * Çizimin okunurluğu: görünen yüz yönlerinin (bir küpün en çok üç yüzü görünür) çizimdeki alan payları ve tonları. Işık
 * yukarıdan geldiği için en az bir yön belirgin biçimde açık olmalı (`bright`: alan payı en az %8 olan yönlerin en açık
 * tonu); üç yönün üçü de görünmeli (`minShare`: üçüncü yönün alan payı), yoksa çizim düz bir resim gibi görünür ve
 * derinlik okunmaz.
 */
export function faceShading(cells: readonly Cell3[], m: Mat3): { bright: number; minShare: number } {
  const by = new Map<number, number>();
  for (const f of drawFigure(cells, m)) by.set(f.tone, (by.get(f.tone) ?? 0) + polyArea(f.pts));
  const tot = [...by.values()].reduce((x, y) => x + y, 0);
  const parts = [...by.entries()].map(([t, x]) => ({ t, share: x / tot }));
  const shares = parts.map((p) => p.share).sort((x, y) => y - x);
  return { bright: Math.max(...parts.filter((p) => p.share >= 0.08).map((p) => p.t)), minShare: shares[2] ?? 0 };
}

/** Izgaranın 48 işaretli eksen değişimi (24 döndürme ve 24 yansıtma). */
const SIGNED_MATS: number[][] = (() => {
  const out: number[][] = [];
  for (const p of [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ])
    for (let s = 0; s < 8; s++) {
      const m = new Array<number>(9).fill(0);
      p.forEach((col, row) => (m[row * 3 + col] = s & (1 << row) ? -1 : 1));
      out.push(m);
    }
  return out;
})();

const mat = (a: number[], b: number[]) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]));
const tp = (a: number[]) => [a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]];
const det3 = (m: number[]) => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
const cellKey = (cells: readonly V[] | readonly Cell3[]) => {
  const mn = [0, 1, 2].map((k) => Math.min(...cells.map((c) => c[k])));
  return cells
    .map((c) => [0, 1, 2].map((k) => Math.round(c[k] - mn[k])).join(','))
    .sort()
    .join(';');
};

/**
 * Resim düzleminde açıklanamayan dönüş (derece): `b`'nin çizimi, `a`'nın çiziminin düzlemde döndürülmüş ya da (ayna
 * görüntüsüyse) yatayda çevrilip döndürülmüş hâline ne kadar yakın? İki çizimdeki şekiller arasındaki üç boyutlu dönüşten,
 * resim düzleminde yapılabilecek en iyi döndürme ya da çevirme çıkarıldıktan sonra kalan en küçük dönüş açısıdır. 0 ise
 * `b`'nin çizimi, `a`'nın çiziminin düz bir resim gibi döndürülmüş ya da çevrilmiş hâlidir: aynı mı ayna mı olduğu, şekil
 * zihinde üç boyutlu döndürülmeden, iki resim karşılaştırılarak anlaşılır. Bu açı yalnızca küplerin konumlarından ve duruş
 * matrislerinden hesaplanır (kamera, x ekseni çevresinde yükseklik açısı kadar döndürülmüştür).
 */
export function pictureResidual(a: { cells: readonly Cell3[]; m: Mat3 }, b: { cells: readonly Cell3[]; m: Mat3 }): number {
  const e = (CAMERA.elevation * Math.PI) / 180;
  const V = [1, 0, 0, 0, Math.cos(e), -Math.sin(e), 0, Math.sin(e), Math.cos(e)];
  const kb = cellKey(b.cells);
  let best = 180;
  for (const S of SIGNED_MATS) {
    if (
      cellKey(
        a.cells.map((c) => [S[0] * c[0] + S[1] * c[1] + S[2] * c[2], S[3] * c[0] + S[4] * c[1] + S[5] * c[2], S[6] * c[0] + S[7] * c[1] + S[8] * c[2]] as V),
      ) !== kb
    )
      continue;
    // Kamerada a'dan b'ye: X = V·mB·S·mAᵀ·Vᵀ; S bir yansıtmaysa önce a'nın çizimi yatayda çevrilir (F = x → −x).
    let X = mat(V, mat(b.m as unknown as number[], mat(S, mat(tp(a.m as unknown as number[]), tp(V)))));
    if (det3(S) < 0) X = mat(X, [-1, 0, 0, 0, 1, 0, 0, 0, 1]);
    // Kamera ekseni çevresindeki en iyi düzlem dönüşü çıkarılınca kalan açı: iz(Rz(θ)ᵀX) en çok √((X00+X11)²+(X10−X01)²)+X22.
    const t = Math.hypot(X[0] + X[4], X[3] - X[1]) + X[8];
    best = Math.min(best, (Math.acos(Math.max(-1, Math.min(1, (t - 1) / 2))) * 180) / Math.PI);
  }
  return best;
}

/** Şeklin küplerinin dünyadaki yükseklikleri, zincir sırasıyla (ağırlık merkezine göre; dik eksen çevresinde dönüş bunları değiştirmez). */
export function chainHeights(cells: readonly Cell3[], m: Mat3): number[] {
  const n = cells.length;
  const c = [0, 1, 2].map((k) => cells.reduce((s, p) => s + p[k], 0) / n);
  return chainOrder(cells).map((i) => Math.round((m[3] * (cells[i][0] - c[0]) + m[4] * (cells[i][1] - c[1]) + m[5] * (cells[i][2] - c[2])) * 1000) / 1000);
}

/** Şekli kendi üstüne getiren ızgara döndürmelerinin sayısı (yalnızca kimlik varsa 1; daha çoksa şekil döndürme simetriklidir). */
export function selfRotations(cells: readonly Cell3[]): number {
  const k = cellKey(cells);
  return SIGNED_MATS.filter(
    (S) =>
      det3(S) > 0 &&
      cellKey(
        cells.map((c) => [S[0] * c[0] + S[1] * c[1] + S[2] * c[2], S[3] * c[0] + S[4] * c[1] + S[5] * c[2], S[6] * c[0] + S[7] * c[1] + S[8] * c[2]] as V),
      ) === k,
  ).length;
}
