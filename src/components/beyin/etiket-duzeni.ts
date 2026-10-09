/**
 * Sahnedeki etiket yazılarının yerleşimi (saf hesap; motor ve testler kullanır). Her etiketin noktası ekranda sabittir;
 * yazı kutusu noktanın çevresindeki aday yerlerden en az "maliyetli" olanına konur. Maliyet: noktaya uzaklık, sahnenin
 * ortasından dışa doğru yönden sapma, ekran kenarına sıkışma, başka bir yazı kutusuyla çakışma, bir noktanın (kendi
 * noktası dahil) yazının altında kalması ve çizgilerin birbirini ya da başka bir yazıyı kesmesi. Kalabalık noktalar
 * önce yerleştirilir.
 */

export interface EtiketGirdisi {
  /** Noktanın ekran konumu (piksel). */
  x: number;
  y: number;
  /** Yazı kutusunun boyutu (piksel). */
  gen: number;
  yuk: number;
}

export interface EtiketYeri {
  sol: number;
  ust: number;
  /** Çizginin yazı kutusuna değdiği nokta. */
  cx: number;
  cy: number;
}

interface Kutu {
  sol: number;
  ust: number;
  gen: number;
  yuk: number;
}

const ACILAR = [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180].map((a) => (a * Math.PI) / 180);
const UZAKLIKLAR = [34, 58, 88];

function kesisim(a: Kutu, b: Kutu, pay: number): number {
  const w = Math.min(a.sol + a.gen, b.sol + b.gen) - Math.max(a.sol, b.sol) + pay;
  const h = Math.min(a.ust + a.yuk, b.ust + b.yuk) - Math.max(a.ust, b.ust) + pay;
  return w > 0 && h > 0 ? w * h : 0;
}

function icinde(k: Kutu, x: number, y: number, pay: number): boolean {
  return x > k.sol - pay && x < k.sol + k.gen + pay && y > k.ust - pay && y < k.ust + k.yuk + pay;
}

function yon(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

/** İki doğru parçası kesişiyor mu (uçlarda değmeler sayılmaz)? */
function parcalarKesisir(p: number[], q: number[]): boolean {
  const d1 = yon(q[0], q[1], q[2], q[3], p[0], p[1]);
  const d2 = yon(q[0], q[1], q[2], q[3], p[2], p[3]);
  const d3 = yon(p[0], p[1], p[2], p[3], q[0], q[1]);
  const d4 = yon(p[0], p[1], p[2], p[3], q[2], q[3]);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** Doğru parçası kutunun içinden geçiyor mu (örnekleyerek)? */
function parcaKutudan(p: number[], k: Kutu): boolean {
  for (let t = 0.15; t <= 0.85; t += 0.1) {
    if (icinde(k, p[0] + (p[2] - p[0]) * t, p[1] + (p[3] - p[1]) * t, -2)) return true;
  }
  return false;
}

export function etiketDuzeni(
  girdiler: EtiketGirdisi[],
  merkez: { x: number; y: number },
  W: number,
  H: number,
  ustSinir = 58,
): EtiketYeri[] {
  const sonuc: (EtiketYeri | null)[] = girdiler.map(() => null);
  const kutular: Kutu[] = [];
  const cizgiler: number[][] = [];
  // Kalabalık noktalar (yakınında başka nokta çok olan) önce yerleşir.
  const kalabalik = girdiler.map((g) => girdiler.filter((h) => h !== g && Math.hypot(h.x - g.x, h.y - g.y) < 90).length);
  const sira = girdiler.map((_, i) => i).sort((a, b) => kalabalik[b] - kalabalik[a] || girdiler[a].y - girdiler[b].y);
  for (const i of sira) {
    const g = girdiler[i];
    let dx = g.x - merkez.x;
    let dy = g.y - merkez.y;
    const u = Math.hypot(dx, dy);
    if (u < 1) [dx, dy] = [1, 0];
    const temel = Math.atan2(dy, dx);
    let enIyi: { yer: EtiketYeri; kutu: Kutu; cizgi: number[]; maliyet: number } | null = null;
    for (const r of UZAKLIKLAR) {
      for (const sapma of ACILAR) {
        const a = temel + sapma;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const tx = g.x + c * r;
        const ty = g.y + s * r * 0.85;
        let sol: number;
        let ust: number;
        if (Math.abs(c) < 0.35) {
          // Noktanın üstüne ya da altına: kutu yatayda ortalanır, çizgi kutunun üst ya da alt kenarına değer.
          sol = tx - g.gen / 2;
          ust = s > 0 ? ty : ty - g.yuk;
        } else {
          sol = c > 0 ? tx : tx - g.gen;
          ust = ty - g.yuk / 2;
        }
        const sol0 = sol;
        const ust0 = ust;
        sol = Math.min(Math.max(sol, 6), W - g.gen - 6);
        ust = Math.min(Math.max(ust, ustSinir), H - g.yuk - 6);
        const kutu = { sol, ust, gen: g.gen, yuk: g.yuk };
        const cx = Math.abs(c) < 0.35 ? sol + g.gen / 2 : c > 0 ? sol : sol + g.gen;
        const cy = Math.abs(c) < 0.35 ? (s > 0 ? ust : ust + g.yuk) : ust + g.yuk / 2;
        const cizgi = [g.x, g.y, cx, cy];
        let maliyet = r + Math.abs(sapma) * 22 + (Math.abs(sol - sol0) + Math.abs(ust - ust0)) * 4;
        for (const k of kutular) maliyet += kesisim(kutu, k, 4) * 3;
        for (const h of girdiler) if (icinde(kutu, h.x, h.y, 7)) maliyet += 4000;
        for (const z of cizgiler) if (parcalarKesisir(cizgi, z)) maliyet += 1500;
        for (const k of kutular) if (parcaKutudan(cizgi, k)) maliyet += 1500;
        for (const z of cizgiler) if (parcaKutudan(z, kutu)) maliyet += 1000;
        if (!enIyi || maliyet < enIyi.maliyet) enIyi = { yer: { sol, ust, cx, cy }, kutu, cizgi, maliyet };
      }
    }
    if (enIyi) {
      sonuc[i] = enIyi.yer;
      kutular.push(enIyi.kutu);
      cizgiler.push(enIyi.cizgi);
    }
  }
  return sonuc as EtiketYeri[];
}
