/**
 * Üç boyutlu sütun grafiği: kütüphanesiz, düz SVG çokgenleriyle. Aynı hesap ekrandaki döndürülebilir grafikte ve
 * PDF'teki sabit açılı grafikte kullanılır. Sütunlar yuvarlak bir zeminin üzerinde çember biçiminde dizilir (beş
 * boyutta beşgen): grafik her yöne döndürülebilir ve dönerken büyüyüp küçülmez. Her sütunun yüksekliği puanın
 * aralıktaki yeridir (doğrusal); ölçüm payı sütunu saran yarı saydam bir kılıf olarak çizilir. Değerlerin kesin
 * okunması için yanında sayılar ve raporda düz cetveller her zaman bulunur.
 *
 * Koordinatlar: x sağa, y yukarı, z derinliğe doğru. Görünüm önce dikey eksen etrafında `yaw` kadar döndürülür, sonra
 * `pitch` açısıyla yukarıdan bakılır (dik izdüşüm). Uzaktaki yüzler önce çizilir.
 */

export interface Bar3DInput {
  key: string;
  value: number | null;
  min: number;
  max: number;
  ciLow?: number | null;
  ciHigh?: number | null;
  /** Onaltılık renk (#rrggbb). */
  color: string;
  /** Sütunun üstündeki yazı ("3,8"). */
  valueLabel: string;
}

export interface Poly3D {
  /** SVG `points` biçiminde. */
  points: string;
  fill: string;
  stroke?: string;
  opacity?: number;
}

export interface Scene3D {
  width: number;
  height: number;
  polys: Poly3D[];
  labels: { key: string; x: number; y: number; text: string }[];
  /** Her sütunun ekrandaki taban ve tepe noktası (denetim için: yükseklik puanla orantılıdır). */
  bars: { key: string; baseY: number; topY: number }[];
}

export interface SceneOptions {
  /** Dikey eksen etrafında dönüş (derece). */
  yaw: number;
  /** Yukarıdan bakış açısı (derece). */
  pitch?: number;
  width?: number;
  height?: number;
  /** Zemin yüzlerinin renkleri (ekranda tema değişkenleri, PDF'te onaltılık). */
  floor?: { top: string; side: string; stroke: string };
  /** Ölçüm payı kılıfının rengi. */
  band?: string;
  /**
   * Puan yazılarının yaklaşık boyutu (çizimin birimiyle): üst üste binen yazılar birbirinden ayrılır. Varsayılan ekrandaki
   * 20 birimlik yazıdır; PDF kendi boyutunu verir.
   */
  label?: { charWidth: number; height: number };
}

/** Bu sayıdan çok sütunda yalnızca öndeki ve yandaki sütunların puanı yazılır (ör. 16 özellik). */
export const LABEL_ALL_MAX = 10;
/** Puanı yazılmayan sütunlar olduğunda grafiğin açıklamasına eklenen cümle (ekranda ve PDF'te; liste grafiğin altındadır). */
export const FRONT_LABELS_NOTE = 'Kalabalık olmasın diye yalnızca öndeki ve yandaki sütunların puanı yazılır; bütün puanlar yukarıdaki listede.';

const BAR_W = 0.8;
const BAR_H = 3.6;
const RING = 2.3;
const PLATE = RING + 0.85;
const PLATE_T = 0.2;
const SEGMENTS = 64;

type V3 = [number, number, number];

function parseHex(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return [128, 128, 128];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

/** Rengi ışık şiddetine göre koyulaştırır (k < 1) ya da beyaza doğru açar (k > 1). */
export function shade(hex: string, k: number): string {
  const [r, g, b] = parseHex(hex);
  const f = (c: number) => {
    const v = k <= 1 ? c * k : c + (255 - c) * Math.min(1, k - 1);
    return Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(r)}${f(g)}${f(b)}`;
}

/**
 * Merkezi (cx, cz) olan, `phi` açısıyla döndürülmüş kare tabanlı bir kutunun üst ve yan yüzleri (alt yüz hiç
 * görünmez). Yüzlerin dışa bakan dikmeleri gölgelendirme ve gizleme için birlikte döner.
 */
function box(cx: number, cz: number, half: number, phi: number, y0: number, y1: number) {
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const at = (u: number, w: number, y: number): V3 => [cx + u * c - w * s, y, cz + u * s + w * c];
  const n = (u: number, w: number): V3 => [u * c - w * s, 0, u * s + w * c];
  const h = half;
  return [
    { n: [0, 1, 0] as V3, pts: [at(-h, -h, y1), at(h, -h, y1), at(h, h, y1), at(-h, h, y1)] },
    { n: n(0, -1), pts: [at(-h, -h, y0), at(h, -h, y0), at(h, -h, y1), at(-h, -h, y1)] },
    { n: n(0, 1), pts: [at(h, h, y0), at(-h, h, y0), at(-h, h, y1), at(h, h, y1)] },
    { n: n(-1, 0), pts: [at(-h, h, y0), at(-h, -h, y0), at(-h, -h, y1), at(-h, h, y1)] },
    { n: n(1, 0), pts: [at(h, -h, y0), at(h, h, y0), at(h, h, y1), at(h, -h, y1)] },
  ];
}

/** Sütunların ve zeminin izdüşümü; çokgenler çizim sırasına göre (uzaktan yakına) döner. */
export function bars3dScene(bars: Bar3DInput[], opts: SceneOptions): Scene3D {
  const width = opts.width ?? 560;
  const height = opts.height ?? 420;
  const yaw = (opts.yaw * Math.PI) / 180;
  const pitch = ((opts.pitch ?? 36) * Math.PI) / 180;
  const floor = opts.floor ?? { top: '#e7ebf2', side: '#cfd6e2', stroke: '#b9c2d1' };
  const bandColor = opts.band ?? '#c99a2e';
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  // Ölçek dönüşten bağımsızdır: zemin yuvarlak olduğu için her açıda aynı yeri kaplar.
  const labelSpace = 34;
  const bottomPad = 10;
  const extentY = BAR_H * cp + PLATE_T * cp + 2 * PLATE * sp;
  const scale = Math.min((width - 16) / (2 * PLATE), (height - labelSpace - bottomPad) / extentY);
  const originX = width / 2;
  const spare = height - labelSpace - bottomPad - extentY * scale;
  const originY = labelSpace + spare / 2 + (BAR_H * cp + PLATE * sp) * scale;

  const view = ([x, y, z]: V3) => {
    const xr = x * cy + z * sy;
    const zr = -x * sy + z * cy;
    return { sx: originX + xr * scale, sy: originY + (-y * cp - zr * sp) * scale, zr };
  };
  const facing = ([nx, , nz]: V3) => -nx * sy + nz * cy < 0;
  // Işık bakan kişiye göre sabittir: grafik döndükçe yüzlerin aydınlığı değişir.
  const light: V3 = [-0.5, 0.75, -0.45];
  const lightLen = Math.hypot(...light);
  const intensity = ([nx, ny, nz]: V3) => {
    const xr = nx * cy + nz * sy;
    const zr = -nx * sy + nz * cy;
    const d = (xr * light[0] + ny * light[1] + zr * light[2]) / lightLen;
    return 0.6 + 0.5 * Math.max(0, d);
  };
  const pts = (vs: V3[]) =>
    vs
      .map(view)
      .map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`)
      .join(' ');

  const polys: Poly3D[] = [];
  const labels: Scene3D['labels'] = [];
  const marks: Scene3D['bars'] = [];

  // Zemin: önce görünen yan duvar dilimleri, sonra üst yüz.
  const ring = Array.from({ length: SEGMENTS }, (_, k) => (k / SEGMENTS) * Math.PI * 2);
  for (let k = 0; k < SEGMENTS; k++) {
    const a0 = ring[k];
    const a1 = ring[(k + 1) % SEGMENTS];
    const m = (a0 + a1) / 2 + (k === SEGMENTS - 1 ? Math.PI : 0);
    if (!facing([Math.cos(m), 0, Math.sin(m)])) continue;
    const p0: V3 = [PLATE * Math.cos(a0), 0, PLATE * Math.sin(a0)];
    const p1: V3 = [PLATE * Math.cos(a1), 0, PLATE * Math.sin(a1)];
    polys.push({
      points: pts([[p0[0], -PLATE_T, p0[2]], [p1[0], -PLATE_T, p1[2]], p1, p0]),
      fill: floor.side,
      stroke: floor.side,
    });
  }
  polys.push({ points: pts(ring.map((a): V3 => [PLATE * Math.cos(a), 0, PLATE * Math.sin(a)])), fill: floor.top, stroke: floor.stroke });

  // İlk sütun öndedir; ötekiler saat yönünde çembere dizilir. Uzaktaki sütun önce çizilir. Sütun çoksa (ör. 16 özellik)
  // sütunlar birbirine değmesin diye incelir: genişlik, çember üzerindeki aralığın en çok %55'idir (dokuz sütuna kadar
  // genişlik değişmez).
  const n = bars.length;
  const barW = Math.min(BAR_W, (0.55 * 2 * Math.PI * RING) / Math.max(1, n));
  const items = bars.map((b, i) => {
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(1, n);
    const cx = RING * Math.cos(theta);
    const cz = RING * Math.sin(theta);
    return { b, cx, cz, theta, depth: -cx * sy + cz * cy };
  });
  items.sort((p, q) => q.depth - p.depth);

  // Çok sütunlu grafikte (ör. 16 özellik) arkadaki sütunların puan yazıları öndekilerin arasına düşüp karışıyor: yalnızca
  // öndeki ve yandaki sütunların puanı yazılır. Grafik döndükçe öne gelen sütunun puanı görünür; bütün puanlar grafiğin
  // altındaki açıklamada da yazılıdır.
  const labelled = (depth: number) => n <= LABEL_ALL_MAX || depth <= RING * 0.3;
  for (const { b, cx, cz, theta, depth } of items) {
    const span = b.max - b.min || 1;
    const t = (v: number) => Math.max(0, Math.min(1, (v - b.min) / span));
    // En düşük puanlı sütun da görünsün diye çok ince bir taban kalır.
    const h = b.value === null ? 0 : Math.max(0.04, t(b.value) * BAR_H);
    if (b.value !== null) {
      for (const f of box(cx, cz, barW / 2, theta, 0, h)) {
        if (f.n[1] === 0 && !facing(f.n)) continue;
        const k = f.n[1] === 1 ? 1.2 : intensity(f.n);
        polys.push({ points: pts(f.pts), fill: shade(b.color, k), stroke: shade(b.color, 0.68) });
      }
    }
    let top = h;
    if (b.value !== null && b.ciLow != null && b.ciHigh != null) {
      const lo = t(b.ciLow) * BAR_H;
      const hi = t(b.ciHigh) * BAR_H;
      for (const f of box(cx, cz, barW / 2 + 0.11, theta, lo, hi)) {
        if (f.n[1] === 0 && !facing(f.n)) continue;
        polys.push({ points: pts(f.pts), fill: bandColor, opacity: f.n[1] === 1 ? 0.34 : 0.24, stroke: bandColor });
      }
      top = Math.max(top, hi);
    }
    const base = view([cx, 0, cz]);
    const tip = view([cx, h, cz]);
    const lab = view([cx, top, cz]);
    marks.push({ key: b.key, baseY: base.sy, topY: tip.sy });
    if (labelled(depth)) labels.push({ key: b.key, x: lab.sx, y: lab.sy - 10, text: b.valueLabel });
  }

  // Arkadaki bir sütunun puanı öndekinin puanıyla üst üste binerse yukarı kaydırılır (önce öndekiler yerleşir). Yazı
  // yine kendi sütununun hizasında kalır; çizimin üst kenarından taşmaz.
  const { charWidth, height: labelH } = opts.label ?? { charWidth: 11.5, height: 20 };
  const placed: Scene3D['labels'] = [];
  for (const l of [...labels].reverse()) {
    const clash = () =>
      placed.find(
        (o) => Math.abs(o.x - l.x) < ((o.text.length + l.text.length) * charWidth) / 2 + 2 && Math.abs(o.y - l.y) < labelH,
      );
    for (let o = clash(); o && o.y - labelH >= labelH * 0.8; o = clash()) l.y = o.y - labelH;
    placed.push(l);
  }

  return { width, height, polys, labels, bars: marks };
}
