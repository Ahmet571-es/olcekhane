'use client';

import { useState, type ReactNode } from 'react';
import { Secenekler, useGorunur, useHareketAzaltilmis, useKare } from './ortak';

/**
 * Sert zarın kıvrımları ve fıtıklaşmalar (önden bakış, koronal kesit şeması). Beyin orağı iki yarımküreyi, beyincik
 * çadırı büyük beyni beyincikten ayırır; çadırın iç kenarındaki açıklıktan (çadır çentiği) orta beyin geçer. Basınç artınca
 * beyin bir bölmeden ötekine kayar: orak altından (kuşak kıvrımı), çadır çentiğinden (unkus; ileri adımda Kernohan
 * çentiği), aşağı doğru (merkezî; büyük delikten beyincik bademcikleri) ve yukarı doğru (beyincik). Düğmeye basınca
 * ilgili kısım yavaşça kayar; hareketi azaltmayı seçenlerde doğrudan son durum görünür. Eğitim şemasıdır; oranlar
 * yaklaşıktır, kafatası yalnızca sert zarın tutunduğu yeri göstermek için sade bir şerittir.
 *
 * Kaynaklar: Gray (1918; kıvrımlar, orağın biçimi, çadırın ortası yüksek kemerli yaprağı ve çentiği); Ishikawa ve ark.
 * (2026; çadır kafa içini çadır üstü ve altı bölmelere ayırır, U biçimli çentikten orta beyin geçer); Munakomi ve Jozsa (2026;
 * orağın serbest alt kenarı nasırlı cismin hemen üstünde); Knight ve Rayi (2023; sağ ve sol çadır üstü bölmeler ile arka
 * çukur, çentikten geçen orta beyin ara beyinle sürer); Knight ve De Jesus (2023; iki kıvrım üç bölme yapar, bademcik
 * fıtıklaşması); Munakomi ve Das (2026; kıvrımlar ve büyük delik üzerinden fıtıklaşma, kuşak kıvrımı, merkezî ve yukarı
 * fıtıklaşma); Kostecki ve ark. (2023; en sık fıtıklaşma orak altıdır); Hall ve Munakomi (2026; çentikten geçen yapılar,
 * unkal fıtıklaşmanın belirtileri); Rai ve ark. (2018; serbest kenarın üstünde arka beyin atardamarı, 3. sinir baskısı);
 * Kim ve Gean (2011; görüntüleme tanımları, "patlamış" göz bebeği); Beucler ve ark. (2022; Kernohan–Woltman çentiği);
 * Dinallo ve Waseem (2023; Cushing refleksi); Zedde ve Pascarella (2025; dörtlü cisim sisternası çentiğin arkasında).
 */

type Gorunum = 'bolmeler' | 'orak' | 'centik' | 'asagi' | 'yukari';
type CentikAlt = 'unkal' | 'kernohan';
type AsagiAlt = 'merkezi' | 'buyuk-delik';
type Hal = 'bolmeler' | 'orak' | 'unkal' | 'kernohan' | 'merkezi' | 'buyuk-delik' | 'yukari';

type P = [number, number];
type Kubik = [P, P, P, P];

const SURE = 2600;

// Renkler (iki temada da aynı; yazılar CSS değişkenleriyle).
const BOS = '#d6ebfb';
const KEMIK = '#d9ccb0';
const SERT_ZAR = '#c0852a';
const BEYIN = '#f1c4b6';
const BEYIN_CIZGI = '#d39a8b';
const SAP = '#e2a08f';
const SAP_CIZGI = '#c4806f';
const BEYINCIK = '#ebb4a3';
const NASIRLI = '#f8e6dc';
const VURGU = '#ec7a4f';
const VURGU_CIZGI = '#b24a25';
const KITLE = '#8f1d1d';
const OK = '#c62f2f';
const ATAR = '#c0392b';
const SINIR = '#f1c40f';
const ICYAZI = '#5b2b22';

// Kafatasının iç yüzü (sert zarın dış yüzü): sol arka çukur tabanı, sol yan duvar, tepe, sağ yan, sağ arka çukur.
// Alttaki açıklık (178–222) büyük deliktir.
const KAFA: Kubik[] = [
  [
    [178, 292],
    [146, 282],
    [104, 252],
    [92, 214],
  ],
  [
    [92, 214],
    [80, 176],
    [78, 120],
    [96, 78],
  ],
  [
    [96, 78],
    [116, 36],
    [156, 18],
    [200, 18],
  ],
  [
    [200, 18],
    [244, 18],
    [284, 36],
    [304, 78],
  ],
  [
    [304, 78],
    [322, 120],
    [320, 176],
    [308, 214],
  ],
  [
    [308, 214],
    [296, 252],
    [254, 282],
    [222, 292],
  ],
];
const KAFA_YOL =
  'M178,292 C146,282 104,252 92,214 C80,176 78,120 96,78 C116,36 156,18 200,18 C244,18 284,36 304,78 C322,120 320,176 308,214 C296,252 254,282 222,292';

function bez(k: Kubik, t: number): P {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * k[0][0] + b * k[1][0] + c * k[2][0] + d * k[3][0], a * k[0][1] + b * k[1][1] + c * k[2][1] + d * k[3][1]];
}

function turev(k: Kubik, t: number): P {
  const u = 1 - t;
  const f = (i: 0 | 1) => 3 * u * u * (k[1][i] - k[0][i]) + 6 * u * t * (k[2][i] - k[1][i]) + 3 * t * t * (k[3][i] - k[2][i]);
  return [f(0), f(1)];
}

/** Kafatası eğrisini d birim içeri kaydırarak örnekler (yol saat yönünde; iç taraf sağdadır). */
function iceri(k: Kubik, t0: number, t1: number, d: number, n: number): P[] {
  const out: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    const [x, y] = bez(k, t);
    const [dx, dy] = turev(k, t);
    const L = Math.hypot(dx, dy) || 1;
    out.push([x + (-dy / L) * d, y + (dx / L) * d]);
  }
  return out;
}

const s1 = (n: number) => Math.round(n * 10) / 10;

/** Noktalardan geçen kapalı yumuşak eğri (Catmull-Rom). */
function kapali(ps: P[]): string {
  const n = ps.length;
  let d = `M${s1(ps[0][0])},${s1(ps[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = ps[(i - 1 + n) % n];
    const p1 = ps[i];
    const p2 = ps[(i + 1) % n];
    const p3 = ps[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${s1(c1x)},${s1(c1y)} ${s1(c2x)},${s1(c2y)} ${s1(p2[0])},${s1(p2[1])}`;
  }
  return d + 'Z';
}

const ayna = (ps: P[]): P[] => ps.map(([x, y]) => [400 - x, y] as P).reverse();

// Beyincik çadırı: yan duvara tutunduğu yer ve serbest kenar (çentiğin kenarı).
const CADIR_TUTUNMA = bez(KAFA[1], 0.06);
const CADIR_KENAR: P = [166, 186];
function cadirNoktasi(s: number, kayma: number): P {
  const dx = CADIR_KENAR[0] - CADIR_TUTUNMA[0];
  const dy = CADIR_KENAR[1] - CADIR_TUTUNMA[1];
  const L = Math.hypot(dx, dy);
  // Yukarı bakan dik: (dy, -dx)/L; kayma > 0 yukarı, < 0 aşağı.
  return [CADIR_TUTUNMA[0] + s * dx + (dy / L) * kayma, CADIR_TUTUNMA[1] + s * dy + (-dx / L) * kayma];
}

// Sol yarımküre (çadır üstü): dış yüzü kafatasını izler, alt yüzü çadırın üstündedir, iç ucu unkustur.
const SOL_YARIMKURE: P[] = [
  ...iceri(KAFA[2], 0.96, 0, 5, 10),
  ...iceri(KAFA[1], 1, 0.1, 5, 12).slice(1),
  cadirNoktasi(0.15, 5),
  cadirNoktasi(0.5, 5),
  cadirNoktasi(0.8, 5),
  [159, 185],
  [166, 183.5],
  [171, 178],
  [170.5, 171],
  [168, 166],
  [171, 158],
  [176, 150],
  [179, 140],
  [180, 128],
  [180, 118],
  [186, 110],
  [196.5, 104],
  [196.5, 80],
  [196.5, 50],
];
const SOL_YARIMKURE_YOL = kapali(SOL_YARIMKURE);
const SAG_YARIMKURE_YOL = kapali(ayna(SOL_YARIMKURE));

// Sol beyincik yarımküresi (çadır altı).
const SOL_BEYINCIK: P[] = [
  cadirNoktasi(0.92, -5),
  cadirNoktasi(0.6, -5),
  cadirNoktasi(0.3, -5),
  cadirNoktasi(0.05, -5),
  ...iceri(KAFA[0], 1, 0.12, 5, 10),
  [176, 278],
  [179, 264],
  [178, 246],
  [176, 228],
  [176, 210],
  [171, 199],
];
const SOL_BEYINCIK_YOL = kapali(SOL_BEYINCIK);
const SAG_BEYINCIK_YOL = kapali(ayna(SOL_BEYINCIK));

// Beyin sapı sütunu: ara beyin, orta beyin, köprü, omurilik soğanı (yarı genişlik, y).
const SUTUN: P[] = [
  [21, 114],
  [23, 124],
  [21.5, 138],
  [18, 150],
  [16.5, 158],
  [16, 166],
  [16, 176],
  [16, 186],
  [16, 196],
  [16.5, 204],
  [19, 212],
  [21, 226],
  [18, 242],
  [11, 252],
  [10, 264],
  [9.5, 278],
  [9, 290],
  [8.5, 304],
];

const egri = (a: number, b: number, y: number) => Math.max(0, Math.min(1, (y - a) / (b - a)));

type Sap = { dx: number; dy: number; sikis: number; sogan: number; centik: number };

/** Sütunun iki yanındaki noktalar (kaymalar uygulanmış); `ustSinir` verilirse yalnızca o hizaya kadar. */
function sapNoktalari(s: Sap, ustSinir = Infinity): { sag: P[]; sol: P[] } {
  const sag: P[] = [];
  const sol: P[] = [];
  for (const [hw, y0] of SUTUN) {
    if (y0 > ustSinir) break;
    // Aşağı kayma: ara beynin üstü az kayar (uzar), orta beyinden köprüye tam, soğanın ucu yerinde kalır.
    const wy = (0.25 + 0.75 * egri(114, 150, y0)) * (1 - egri(250, 304, y0));
    // Yana kayma: en çok çentik hizasında; soğanın ucu yerinde kalır.
    const wx = y0 <= 186 ? egri(120, 186, y0) : 1 - 0.7 * egri(205, 262, y0) - 0.3 * egri(262, 300, y0);
    const sik = y0 >= 164 && y0 <= 204 ? s.sikis : 1;
    const sog = y0 >= 274 && y0 <= 304 ? s.sogan : 1;
    const h = hw * sik * sog;
    const x = 200 + s.dx * wx;
    const y = y0 + s.dy * wy;
    const dent = s.centik * Math.max(0, 1 - Math.abs(y0 - 186) / 9);
    sag.push([x + h - dent, y]);
    sol.push([x - h, y]);
  }
  return { sag, sol };
}

function sapYolu(s: Sap): string {
  const { sag, sol } = sapNoktalari(s);
  return kapali([...sag, [206, 306], [194, 306], ...sol.reverse()]);
}

/** Ara beyin ve orta beyin (merkezî fıtıklaşmada kayan kısım). */
function araOrtaYolu(s: Sap): string {
  const { sag, sol } = sapNoktalari(s, 204);
  return kapali([...sag, ...sol.reverse()]);
}

/**
 * Kayan beyin parçası: dayanak noktası (m) yerinde kalır, ucu (uc) kayar. Arkası m çevresinde g yarıçaplı, önü uc
 * çevresinde r yarıçaplı yuvarlak bir kapsül.
 */
function lob(m: P, uc: P, g: number, r: number): string {
  let dx = uc[0] - m[0];
  let dy = uc[1] - m[1];
  const L = Math.hypot(dx, dy);
  if (L < 0.01) {
    dx = 1;
    dy = 0;
  } else {
    dx /= L;
    dy /= L;
  }
  const px = -dy;
  const py = dx;
  const f = (n: number) => s1(n);
  const A: P = [m[0] + px * g, m[1] + py * g];
  const B: P = [m[0] - px * g, m[1] - py * g];
  const C: P = [uc[0] - px * r, uc[1] - py * r];
  const D: P = [uc[0] + px * r, uc[1] + py * r];
  return (
    `M${f(A[0])},${f(A[1])} A${g},${g} 0 1 1 ${f(B[0])},${f(B[1])}` + ` L${f(C[0])},${f(C[1])} A${r},${r} 0 1 1 ${f(D[0])},${f(D[1])} Z`
  );
}

/** Sahnenin sayısal durumu; iki durum arasında yumuşak geçiş yapılır. */
type Sahne = {
  kitle: [number, number, number]; // x, y, yarıçap
  kusak: P;
  unSol: P;
  unSag: P;
  bSol: P;
  bSag: P;
  ySol: P;
  ySag: P;
  sap: Sap;
  pca: P;
  pcaEz: number;
  sinir: P;
  sinirEz: number;
  bebek: number;
  sisme: number;
};

// Kayan parçaların dayanak noktaları (yerinde kalır) ve yarıçapları: [dayanak, arka yarıçap, ön yarıçap].
const KUSAK_LOB: [P, number, number] = [[186, 98], 7, 6];
const UNKUS_LOB: [P, number, number] = [[158, 177], 7.5, 6];
const BADEM_LOB: [P, number, number] = [[173, 268], 7, 5.5];
const YUKARI_LOB: [P, number, number] = [[171, 214], 7, 5.5];
const aynaP = (p: P): P => [400 - p[0], p[1]];

const NORMAL: Sahne = {
  kitle: [118, 140, 0],
  kusak: [191, 98],
  unSol: [165.5, 177.5],
  unSag: [234.5, 177.5],
  bSol: [177, 275],
  bSag: [223, 275],
  ySol: [173, 205],
  ySag: [227, 205],
  sap: { dx: 0, dy: 0, sikis: 1, sogan: 1, centik: 0 },
  pca: [178, 170],
  pcaEz: 0,
  sinir: [179, 191],
  sinirEz: 0,
  bebek: 2.6,
  sisme: 0,
};

const UNKAL_SON: Sahne = {
  ...NORMAL,
  kitle: [118, 140, 20],
  unSol: [181, 198],
  sap: { ...NORMAL.sap, dx: 5 },
  pca: [170, 184],
  pcaEz: 1,
  sinir: [184, 207.5],
  sinirEz: 1,
  bebek: 5.8,
};

const SONLAR: Record<Exclude<Hal, 'bolmeler'>, { bas: Sahne; son: Sahne }> = {
  orak: { bas: { ...NORMAL, kitle: [134, 62, 0] }, son: { ...NORMAL, kitle: [134, 62, 19], kusak: [210, 101] } },
  unkal: { bas: NORMAL, son: UNKAL_SON },
  kernohan: {
    bas: UNKAL_SON,
    son: { ...UNKAL_SON, kitle: [118, 140, 26], unSol: [185, 199], sap: { ...UNKAL_SON.sap, dx: 20, centik: 5 }, sinir: [190, 208] },
  },
  merkezi: {
    bas: NORMAL,
    son: { ...NORMAL, unSol: [175, 191], unSag: [225, 191], sap: { ...NORMAL.sap, dy: 22 }, sisme: 1 },
  },
  'buyuk-delik': {
    bas: NORMAL,
    son: { ...NORMAL, bSol: [187, 299], bSag: [213, 299], sap: { ...NORMAL.sap, sogan: 0.66 } },
  },
  yukari: {
    bas: { ...NORMAL, kitle: [140, 244, 0] },
    son: { ...NORMAL, kitle: [140, 244, 15], ySol: [177, 174], ySag: [223, 174], sap: { ...NORMAL.sap, sikis: 0.8 } },
  },
};

const ara = (a: number, b: number, t: number) => a + (b - a) * t;
const araP = (a: P, b: P, t: number): P => [ara(a[0], b[0], t), ara(a[1], b[1], t)];

function karistir(a: Sahne, b: Sahne, t: number): Sahne {
  return {
    kitle: [ara(a.kitle[0], b.kitle[0], t), ara(a.kitle[1], b.kitle[1], t), ara(a.kitle[2], b.kitle[2], t)],
    kusak: araP(a.kusak, b.kusak, t),
    unSol: araP(a.unSol, b.unSol, t),
    unSag: araP(a.unSag, b.unSag, t),
    bSol: araP(a.bSol, b.bSol, t),
    bSag: araP(a.bSag, b.bSag, t),
    ySol: araP(a.ySol, b.ySol, t),
    ySag: araP(a.ySag, b.ySag, t),
    sap: {
      dx: ara(a.sap.dx, b.sap.dx, t),
      dy: ara(a.sap.dy, b.sap.dy, t),
      sikis: ara(a.sap.sikis, b.sap.sikis, t),
      sogan: ara(a.sap.sogan, b.sap.sogan, t),
      centik: ara(a.sap.centik, b.sap.centik, t),
    },
    pca: araP(a.pca, b.pca, t),
    pcaEz: ara(a.pcaEz, b.pcaEz, t),
    sinir: araP(a.sinir, b.sinir, t),
    sinirEz: ara(a.sinirEz, b.sinirEz, t),
    bebek: ara(a.bebek, b.bebek, t),
    sisme: ara(a.sisme, b.sisme, t),
  };
}

const yumusat = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const BILGI: Record<Hal, { baslik: string; metin: ReactNode }> = {
  bolmeler: {
    baslik: 'Bölmeler: orak ve çadır kafa içini ayırır',
    metin: (
      <>
        Sert zarın iki kıvrımı kafa içini üç bölmeye ayırır. Beyin orağı (<i>falx cerebri</i>) iki yarımküreyi birbirinden ayırır. Beyincik
        çadırı (<i>tentorium cerebelli</i>) büyük beyni beyincikten ayırır. Çadırın iç kenarındaki açıklığa çadır çentiği denir. Orta beyin
        buradan geçer. Basınç artınca beyin bir bölmeden ötekine kayabilir: buna fıtıklaşma (herniasyon) denir.
      </>
    ),
  },
  orak: {
    baslik: 'Orak altından fıtıklaşma (subfalksin)',
    metin: (
      <>
        Bir yarımkürede kitle büyürse iç yüzdeki kuşak kıvrımı (<i>gyrus cinguli</i>) orağa doğru itilir. Kıvrım, orağın serbest alt
        kenarının altından karşı tarafa kayar. Bu kenar nasırlı cismin hemen üstündedir. En sık görülen kafa içi fıtıklaşma budur.
      </>
    ),
  },
  unkal: {
    baslik: 'Çadır çentiğinden fıtıklaşma (unkal)',
    metin: (
      <>
        Şakak lobunun iç ucu (<i>uncus</i>) çadırın serbest kenarını aşıp çentikten aşağı kayar. Aynı taraftaki göz hareket sinirine (3.
        kafa siniri) bastırır. O yandaki göz bebeği genişler. Orta beyin ve arka beyin atardamarı da sıkışabilir. Beyin sapı ayağına baskı
        karşı tarafta kas güçsüzlüğü yapar. Klinikte en sık tanınan fıtıklaşma tablosu budur.
      </>
    ),
  },
  kernohan: {
    baslik: 'Kernohan–Woltman çentiği',
    metin: (
      <>
        Kitle çok büyükse beyin sapını yana iter. Karşı taraftaki beyin sapı ayağı (<i>crus cerebri</i>) öteki yandaki çadır kenarına
        bastırılır. Bu yüzden kas güçsüzlüğü beklenenin tersine kitleyle aynı tarafta olur. Yeri yanıltan bu duruma Kernohan–Woltman çentiği
        olayı denir.
      </>
    ),
  },
  merkezi: {
    baslik: 'Merkezî fıtıklaşma (aşağı doğru)',
    metin: (
      <>
        Ara beyin ve orta beyin çadır çentiğinden aşağı kayar. Bu çoğu kez beyin her yerde şiştiğinde ya da iki yandan baskı olduğunda
        görülür. Görüntülemede iki şakak lobu birlikte aşağı iner. Beyin tabanındaki, beyin-omurilik sıvısıyla dolu sisternalar sıkışır.
      </>
    ),
  },
  'buyuk-delik': {
    baslik: 'Büyük delikten fıtıklaşma (bademcik)',
    metin: (
      <>
        Beyincik bademcikleri (<i>tonsilla cerebelli</i>) büyük delikten aşağı iner. Omurilik soğanını önündeki kemiğe bastırır. Buna koni
        oluşumu da denir. Soğan sıkıştıkça kan basıncı belirgin yükselebilir (Cushing refleksi).
      </>
    ),
  },
  yukari: {
    baslik: 'Yukarı doğru fıtıklaşma',
    metin: (
      <>
        Arka çukurdaki bir kitle beyinciği çadır çentiğinden yukarı iter. Beyincik orta beyni bozar. Çentiğin arka kısmındaki sisternayı
        (dörtlü cisim sisternası) siler. Beyin-omurilik sıvısının yollarını ve toplardamar çıkışını tıkayabilir.
      </>
    ),
  },
};

function Ok({ a, b, op = 1 }: { a: P; b: P; op?: number }) {
  const aci = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const u1: P = [b[0] - 8 * Math.cos(aci - 0.5), b[1] - 8 * Math.sin(aci - 0.5)];
  const u2: P = [b[0] - 8 * Math.cos(aci + 0.5), b[1] - 8 * Math.sin(aci + 0.5)];
  return (
    <g opacity={op}>
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0] - 4 * Math.cos(aci)}
        y2={b[1] - 4 * Math.sin(aci)}
        stroke={OK}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d={`M${s1(b[0])},${s1(b[1])} L${s1(u1[0])},${s1(u1[1])} L${s1(u2[0])},${s1(u2[1])} Z`} fill={OK} />
    </g>
  );
}

/** Kenar yazısı ve hedefe giden ince çizgi. */
function Etiket({ satirlar, x, y, hedef, sag = false }: { satirlar: string[]; x: number; y: number; hedef: P; sag?: boolean }) {
  const ucX = sag ? x - 3 : x + Math.max(...satirlar.map((s) => s.length)) * 6.3 + 3;
  const ucY = y - 4 + ((satirlar.length - 1) * 14) / 2;
  return (
    <g>
      <line x1={ucX} y1={ucY} x2={hedef[0]} y2={hedef[1]} stroke="var(--ink-3)" strokeWidth="0.8" />
      <circle cx={hedef[0]} cy={hedef[1]} r="1.6" fill="var(--ink-3)" />
      <text x={x} y={y} fontSize="12" fill="var(--ink-2)">
        {satirlar.map((s, i) => (
          <tspan key={s} x={x} dy={i === 0 ? 0 : 14}>
            {s}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function IcYazi({ x, y, satirlar, renk = ICYAZI }: { x: number; y: number; satirlar: string[]; renk?: string }) {
  return (
    <text x={x} y={y} fontSize="11.5" fill={renk} textAnchor="middle">
      {satirlar.map((s, i) => (
        <tspan key={s} x={x} dy={i === 0 ? 0 : 13.5}>
          {s}
        </tspan>
      ))}
    </text>
  );
}

function Gozler({ bebek }: { bebek: number }) {
  return (
    <g>
      {[24, 58].map((cx, i) => (
        <g key={cx}>
          <path d={`M${cx - 14},22 Q${cx},8 ${cx + 14},22 Q${cx},36 ${cx - 14},22 Z`} fill="#fff" stroke="var(--ink-3)" strokeWidth="1.2" />
          <circle cx={cx} cy="22" r="7" fill="#7f9ccf" />
          <circle cx={cx} cy="22" r={i === 0 ? bebek : 2.6} fill="#101828" />
        </g>
      ))}
      <text x="41" y="49" fontSize="11" fill="var(--ink-2)" textAnchor="middle">
        göz bebekleri
      </text>
    </g>
  );
}

export function Fitiklasmalar() {
  const azalt = useHareketAzaltilmis();
  const [kapRef, gorunur] = useGorunur<HTMLDivElement>();
  const [gor, setGor] = useState<Gorunum>('bolmeler');
  const [centikAlt, setCentikAlt] = useState<CentikAlt>('unkal');
  const [asagiAlt, setAsagiAlt] = useState<AsagiAlt>('merkezi');
  const [t, setT] = useState(1);
  const [oynuyor, setOynuyor] = useState(false);

  useKare(oynuyor && gorunur && !azalt, (dt) => {
    const y = Math.min(1, t + dt / SURE);
    setT(y);
    if (y >= 1) setOynuyor(false);
  });

  const baslat = () => {
    setT(0);
    setOynuyor(true);
  };

  const hal: Hal = gor === 'centik' ? centikAlt : gor === 'asagi' ? asagiAlt : gor;
  const g = yumusat(azalt ? 1 : t);
  const s = hal === 'bolmeler' ? NORMAL : karistir(SONLAR[hal].bas, SONLAR[hal].son, g);
  const b = BILGI[hal];

  const unkalMi = hal === 'unkal' || hal === 'kernohan';
  const kitleVar = hal === 'orak' || unkalMi || hal === 'yukari';
  const okOp = hal === 'kernohan' ? g : Math.min(1, g * 1.6);

  return (
    <div ref={kapRef} className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={gor}
        onDegis={(d) => {
          setGor(d);
          baslat();
        }}
        secenekler={[
          { d: 'bolmeler', ad: 'Bölmeler' },
          { d: 'orak', ad: 'Orak altından' },
          { d: 'centik', ad: 'Çadır çentiğinden' },
          { d: 'asagi', ad: 'Aşağı doğru' },
          { d: 'yukari', ad: 'Yukarı doğru' },
        ]}
      />
      {gor === 'centik' && (
        <Secenekler
          etiket="Çadır çentiğinden fıtıklaşmanın adımı"
          deger={centikAlt}
          onDegis={(d) => {
            setCentikAlt(d);
            baslat();
          }}
          secenekler={[
            { d: 'unkal', ad: 'Unkus kayar' },
            { d: 'kernohan', ad: 'Kitle çok büyürse: Kernohan' },
          ]}
        />
      )}
      {gor === 'asagi' && (
        <Secenekler
          etiket="Aşağı doğru fıtıklaşmanın türü"
          deger={asagiAlt}
          onDegis={(d) => {
            setAsagiAlt(d);
            baslat();
          }}
          secenekler={[
            { d: 'merkezi', ad: 'Merkezî' },
            { d: 'buyuk-delik', ad: 'Büyük delikten' },
          ]}
        />
      )}
      <svg viewBox="0 0 400 330" className="mx-auto w-full max-w-2xl" role="img" aria-label={`Önden bakış şeması: ${b.baslik}`}>
        {/* Kafatası (sade şerit) ve kafa içi boşluğu (beyin-omurilik sıvısı) */}
        <path d={KAFA_YOL} fill="none" stroke={KEMIK} strokeWidth="13" />
        <path d={`${KAFA_YOL} Z`} fill={BOS} />

        {/* Çadır altı: beyincik ve bademcikleri */}
        <path d={SOL_BEYINCIK_YOL} fill={BEYINCIK} stroke={BEYIN_CIZGI} strokeWidth="1" />
        <path d={SAG_BEYINCIK_YOL} fill={BEYINCIK} stroke={BEYIN_CIZGI} strokeWidth="1" />
        {hal !== 'buyuk-delik' && (
          <g fill={BEYINCIK}>
            <path d={lob(BADEM_LOB[0], s.bSol, BADEM_LOB[1], BADEM_LOB[2])} />
            <path d={lob(aynaP(BADEM_LOB[0]), s.bSag, BADEM_LOB[1], BADEM_LOB[2])} />
          </g>
        )}
        {[
          [126, 218, 162, 212],
          [124, 262, 164, 258],
        ].map(([x1, y1, x2, y2]) => (
          <g key={`${x1}-${y1}`} fill="none" stroke={BEYIN_CIZGI} strokeWidth="0.9">
            <path d={`M${x1},${y1} Q${(x1 + x2) / 2},${y1 - 7} ${x2},${y2}`} />
            <path d={`M${400 - x1},${y1} Q${400 - (x1 + x2) / 2},${y1 - 7} ${400 - x2},${y2}`} />
          </g>
        ))}

        {/* Çadır üstü: iki yarımküre */}
        <path d={SOL_YARIMKURE_YOL} fill={BEYIN} stroke={BEYIN_CIZGI} strokeWidth="1" />
        <path d={SAG_YARIMKURE_YOL} fill={BEYIN} stroke={BEYIN_CIZGI} strokeWidth="1" />
        {s.sisme > 0 && (
          <g fill={VURGU} opacity={0.2 * s.sisme}>
            <path d={SOL_YARIMKURE_YOL} />
            <path d={SAG_YARIMKURE_YOL} />
          </g>
        )}
        {/* Yan oluk (şakak lobunun üst sınırı) */}
        <path d="M92,140 C112,146 128,146 146,152" fill="none" stroke={BEYIN_CIZGI} strokeWidth="1.2" />
        <path d="M308,140 C288,146 272,146 254,152" fill="none" stroke={BEYIN_CIZGI} strokeWidth="1.2" />

        {/* Beyin sapı sütunu: ara beyin, orta beyin, köprü, omurilik soğanı */}
        <path d={sapYolu(s.sap)} fill={SAP} stroke={SAP_CIZGI} strokeWidth="1" />
        {hal === 'merkezi' && <path d={araOrtaYolu(s.sap)} fill={VURGU} opacity="0.75" stroke={VURGU_CIZGI} strokeWidth="1" />}
        {/* Nasırlı cisim */}
        <g transform={hal === 'merkezi' ? `translate(0 ${s1(s.sap.dy * 0.25)})` : undefined}>
          <path d="M174,113 Q200,101 226,113 L226,119 Q200,108 174,119 Z" fill={NASIRLI} stroke={BEYIN_CIZGI} strokeWidth="0.8" />
        </g>

        {/* Kayan parçalar */}
        <g fill={VURGU} stroke={VURGU_CIZGI} strokeWidth="1">
          {hal === 'orak' && <path d={lob(KUSAK_LOB[0], s.kusak, KUSAK_LOB[1], KUSAK_LOB[2])} />}
          {(unkalMi || hal === 'merkezi') && <path d={lob(UNKUS_LOB[0], s.unSol, UNKUS_LOB[1], UNKUS_LOB[2])} />}
          {hal === 'merkezi' && <path d={lob(aynaP(UNKUS_LOB[0]), s.unSag, UNKUS_LOB[1], UNKUS_LOB[2])} />}
          {hal === 'buyuk-delik' && (
            <>
              <path d={lob(BADEM_LOB[0], s.bSol, BADEM_LOB[1], BADEM_LOB[2])} />
              <path d={lob(aynaP(BADEM_LOB[0]), s.bSag, BADEM_LOB[1], BADEM_LOB[2])} />
            </>
          )}
          {hal === 'yukari' && (
            <>
              <path d={lob(YUKARI_LOB[0], s.ySol, YUKARI_LOB[1], YUKARI_LOB[2])} />
              <path d={lob(aynaP(YUKARI_LOB[0]), s.ySag, YUKARI_LOB[1], YUKARI_LOB[2])} />
            </>
          )}
        </g>

        {/* Kitle */}
        {kitleVar && s.kitle[2] > 0.5 && (
          <g>
            <circle cx={s.kitle[0]} cy={s.kitle[1]} r={s.kitle[2]} fill={KITLE} />
            {s.kitle[2] > 13 && (
              <text x={s.kitle[0]} y={s.kitle[1] + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">
                kitle
              </text>
            )}
          </g>
        )}

        {/* Sert zar: kafatasının iç yüzü, beyin orağı ve beyincik çadırı */}
        <path d={KAFA_YOL} fill="none" stroke={SERT_ZAR} strokeWidth="2.2" />
        <path d="M200,18 L200,90" stroke={SERT_ZAR} strokeWidth="3" strokeLinecap="round" />
        <path
          d={`M${s1(CADIR_TUTUNMA[0])},${s1(CADIR_TUTUNMA[1])} L${CADIR_KENAR[0]},${CADIR_KENAR[1]}`}
          stroke={SERT_ZAR}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d={`M${s1(400 - CADIR_TUTUNMA[0])},${s1(CADIR_TUTUNMA[1])} L${400 - CADIR_KENAR[0]},${CADIR_KENAR[1]}`}
          stroke={SERT_ZAR}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={CADIR_KENAR[0]} cy={CADIR_KENAR[1]} r="2.6" fill={SERT_ZAR} />
        <circle cx={400 - CADIR_KENAR[0]} cy={CADIR_KENAR[1]} r="2.6" fill={SERT_ZAR} />

        {/* Çentikten geçen damar ve sinir (unkal görünümde) */}
        {unkalMi && (
          <g>
            <ellipse
              cx={s.pca[0]}
              cy={s.pca[1]}
              rx={4.4 + 1.6 * s.pcaEz}
              ry={4.4 - 1.9 * s.pcaEz}
              fill={ATAR}
              stroke="#7a1d14"
              strokeWidth="0.8"
            />
            <ellipse
              cx={s.sinir[0]}
              cy={s.sinir[1]}
              rx={3.8 + 1.8 * s.sinirEz}
              ry={3.8 - 1.7 * s.sinirEz}
              fill={SINIR}
              stroke="#8a6d00"
              strokeWidth="0.8"
            />
          </g>
        )}

        {/* Oklar */}
        {hal === 'orak' && <Ok a={[154, 72]} b={[178, 88]} op={okOp} />}
        {hal === 'unkal' && <Ok a={[136, 160]} b={[154, 176]} op={okOp} />}
        {hal === 'kernohan' && <Ok a={[148, 128]} b={[174, 128]} op={okOp} />}
        {hal === 'merkezi' && (
          <>
            <Ok a={[140, 32]} b={[140, 60]} op={okOp} />
            <Ok a={[260, 32]} b={[260, 60]} op={okOp} />
          </>
        )}
        {hal === 'buyuk-delik' && (
          <>
            <Ok a={[148, 240]} b={[162, 262]} op={okOp} />
            <Ok a={[252, 240]} b={[238, 262]} op={okOp} />
          </>
        )}
        {hal === 'yukari' && (
          <>
            <Ok a={[156, 246]} b={[162, 224]} op={okOp} />
            <Ok a={[244, 246]} b={[238, 224]} op={okOp} />
          </>
        )}

        {/* Etiketler */}
        {hal === 'bolmeler' && (
          <g>
            <Etiket satirlar={['kafatası']} x={6} y={70} hedef={[97, 64]} />
            <Etiket satirlar={['sert zar']} x={6} y={134} hedef={[83, 131]} />
            <Etiket satirlar={['beyin orağı']} x={326} y={50} hedef={[201, 56]} sag />
            <Etiket satirlar={['orta beyin']} x={326} y={128} hedef={[213, 168]} sag />
            <Etiket satirlar={['beyincik', 'çadırı']} x={326} y={162} hedef={[282, 199]} sag />
            <Etiket satirlar={['çadır', 'çentiği']} x={326} y={216} hedef={[225, 194]} sag />
            <Etiket satirlar={['büyük delik']} x={232} y={306} hedef={[222, 294]} sag />
            <IcYazi x={136} y={98} satirlar={['çadır üstü', 'bölme']} />
            <IcYazi x={264} y={98} satirlar={['çadır üstü', 'bölme']} />
            <IcYazi x={136} y={244} satirlar={['beyincik']} />
            <IcYazi x={266} y={236} satirlar={['çadır altı', 'bölme']} />
          </g>
        )}
        {hal === 'orak' && (
          <g>
            <Etiket satirlar={['beyin orağı']} x={326} y={50} hedef={[201, 56]} sag />
            <Etiket satirlar={['kuşak', 'kıvrımı']} x={326} y={92} hedef={[s1(s.kusak[0] + 3), s1(s.kusak[1])]} sag />
            <Etiket satirlar={['nasırlı', 'cisim']} x={326} y={130} hedef={[222, 115]} sag />
          </g>
        )}
        {unkalMi && (
          <g>
            <Etiket satirlar={['arka beyin', 'atardamarı']} x={6} y={160} hedef={[s1(s.pca[0] - 3), s1(s.pca[1])]} />
            <Etiket satirlar={['unkus']} x={6} y={204} hedef={[s1(s.unSol[0] - 3), s1(s.unSol[1] + 1)]} />
            <Etiket satirlar={['3. kafa', 'siniri']} x={6} y={236} hedef={[s1(s.sinir[0] - 3), s1(s.sinir[1] + 1)]} />
            <Etiket satirlar={['orta beyin']} x={326} y={140} hedef={[s1(212 + s.sap.dx * 0.8), 172]} sag />
            {hal === 'kernohan' && <Etiket satirlar={['Kernohan', 'çentiği']} x={326} y={196} hedef={[237, 190]} sag />}
          </g>
        )}
        {hal === 'unkal' && <Gozler bebek={s.bebek} />}
        {hal === 'merkezi' && (
          <g>
            <Etiket satirlar={['ara beyin']} x={326} y={124} hedef={[221, s1(130 + s.sap.dy * 0.6)]} sag />
            <Etiket satirlar={['orta beyin']} x={6} y={240} hedef={[186, s1(184 + s.sap.dy)]} />
            <Etiket satirlar={['unkus']} x={6} y={204} hedef={[s1(s.unSol[0] - 3), s1(s.unSol[1] + 1)]} />
            <IcYazi x={140} y={80} satirlar={['şişme']} />
            <IcYazi x={260} y={80} satirlar={['şişme']} />
          </g>
        )}
        {hal === 'buyuk-delik' && (
          <g>
            <Etiket satirlar={['beyincik', 'bademciği']} x={6} y={258} hedef={[s1(s.bSol[0] - 4), s1(s.bSol[1])]} />
            <Etiket satirlar={['omurilik', 'soğanı']} x={326} y={258} hedef={[207, 272]} sag />
            <Etiket satirlar={['büyük delik']} x={232} y={306} hedef={[222, 294]} sag />
          </g>
        )}
        {hal === 'yukari' && (
          <g>
            <Etiket satirlar={['beyincik']} x={6} y={178} hedef={[s1(s.ySol[0] - 4), s1(s.ySol[1])]} />
            <Etiket satirlar={['orta beyin']} x={326} y={140} hedef={[211, 172]} sag />
            <Etiket satirlar={['çadır', 'çentiği']} x={326} y={216} hedef={[229, 188]} sag />
          </g>
        )}

        <text x="6" y="314" fontSize="10.5" fill="var(--ink-3)">
          Eğitim şeması, önden bakış:
        </text>
        <text x="6" y="327" fontSize="10.5" fill="var(--ink-3)">
          tepe yukarıda; oranlar yaklaşık.
        </text>
      </svg>
      {!azalt && hal !== 'bolmeler' && (
        <div className="flex">
          <button type="button" className="beyin-secenek" onClick={baslat}>
            Baştan oynat
          </button>
        </div>
      )}
      <div aria-live="polite">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
