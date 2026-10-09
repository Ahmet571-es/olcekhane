'use client';

import { useId, useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Kafanın dışından beyni bulmak: kafa yüzeyindeki çizgi ve noktalar ile altlarındaki beynin şeması (beyin dış hattı,
 * lateral oluk, merkezî oluk). Kafatasının kendisi çizilmez; yalnızca başvuru noktaları gösterilir. Beş görünüm:
 *
 * 1. Taylor–Haughton (soldan bakış): Frankfurt düzlemi (göz çukurunun alt kenarından dış kulak yolunun üst kenarına),
 *    dörde bölünen nasion–inion yayı, arka kulak çizgisi (mastoid çıkıntıdan dik) ve kondil çizgisi (alt çene ekleminin
 *    başından dik). Sylvius çizgisi göz çukurunun ortasından %75 işaretine; üst Rolando noktası %50 işaretinin 2 cm
 *    arkası; alt Rolando noktası Sylvius çizgisi ile kondil çizgisinin kesişimi (Vigo ve ark., 2020). Lateral oluğun ön
 *    kısmı pterionun altındadır (Vigo ve ark., 2020); pterion Gray'in ölçüsüyle alın–elmacık dikişinin 35 mm arkası,
 *    12 mm üstü (Gray, 1918).
 * 2. Gray 1918, tarihsel yöntem (soldan bakış): üst nokta nasion–inion ortasının 1,25 cm arkası; Sylvius noktası, ¾
 *    noktasından alın–elmacık dikişine ve ¼ noktasından kulak noktasına çekilen çizgilerin kesişimi; birinci çizginin
 *    bu noktanın arkasında kalan parçası lateral yarığın arka dalı; alt nokta, arka dal çizgisi ile kulak önü noktasından
 *    Reid taban çizgisine (göz çukurunun alt kenarından kulak noktasına) çekilen dikin kesişimi (Gray, 1918). Bölüme göre
 *    Gray'in bugünkü çalışmalarla doğrulanmamış kuralları tarihsel yöntem olarak okunur.
 * 3. Karıncığa giriş noktaları (yukarıdan; kafa yüzeyi düzleştirilmiş harita): Kocher noktası koronal dikişin 1–2 cm
 *    önü, orta hattın 2–3 cm yanı (Vigo ve ark., 2020) ya da nasionun 10 cm (Muralidharan, 2015; Pascual-Diaz ve ark.,
 *    2019) veya 11 cm arkası (Vigo ve ark., 2020; ElBadway ve ark., 2026), orta hattın 3 cm yanı; birincil hareket
 *    alanının önünde (Vigo ve ark., 2020). Keen kulak kepçesinin 2–3 cm üstü ve arkası; Frazier inionun 6 cm üstü
 *    (yana uzaklığı kaynağa göre 2,5–4 cm; Vigo ve ark., 2020; Kocaman ve ark., 2026; Safdar ve ark., 2025); Dandy inionun
 *    3 cm üstü, 2 cm yanı (Vigo ve ark., 2020); oksipital-parietal nokta Keen ile Frazier'in ortası (ElBadway ve ark.,
 *    2026); Kaufman nasionun 5 cm üstü, 3 cm yanı, seyrek kullanılır (Sulaiman, 2024). Çoğu zaman sağ taraf seçilir
 *    (Lee ve ark., 2020).
 * 4. EEG 10–20 (yukarıdan): dört başlangıç noktası, %10 ve %20'lik bölmeler, 21 nokta (Xiao ve ark., 2017; Theodoroff
 *    ve ark., 2018); Cz yaklaşık verteks (Scrivener ve Reader, 2022); F3, T3 ve P3'ün altı (Herwig ve ark., 2003); C3 ve
 *    C4 presantral girusa olguların yalnızca %13'ünde (Okamoto verisi; Scrivener ve Reader, 2022). Noktalar 10–20
 *    kuralının orantılı yerlerine çizildi.
 * 5. TMS hedefi (yukarıdan, sol ön bölüm büyütülmüş): sol DLPFC ≈ F3 (Beam ve ark., 2009); 5 cm kuralı ve motor sıcak
 *    nokta (Cardenas ve ark., 2022; Caulfield ve ark., 2022), DLPFC'yi olguların üçte birinden fazlasında ıskalar
 *    (Mir-Moghtadaei ve ark., 2015); yaklaşık 7 cm (Cardenas ve ark., 2022); Beam F3'ün iki uzaklığı: orta hattan çevre
 *    boyunca ve verteksten (Atmaram ve ark., 2025). Çevre boyunca ölçülen uzaklık nasion düzeyindeki dış çemberde, ucu
 *    verteksten F3'e giden doğrultuda gösterildi (Atmaram ve ark., 2025: baş çevresi inion düzeyinde ölçülür; Y uzaklığı
 *    verteksi X noktasına bağlayan çizgi boyuncadır).
 *
 * Şemadaki ölçek tek bir ortalama başa göredir. Koronal dikiş yaklaşık çizildi (nasion–bregma ~14 cm; Oberman ve ark.,
 * 2018 ortalaması 137,4 mm); merkezî oluk orta hatta bregmanın yaklaşık 5 cm arkasından başlar (Vigo ve ark., 2020) ve
 * orta hatla öne açık ~70° yapar (Gray, 1918). Motor sıcak noktanın yeri şematiktir (hareket kabuğunun üstünde).
 */

type Gorunum = 'taylor' | 'gray' | 'giris' | 'eeg' | 'tms';
type N = { x: number; y: number };

const nk = (x: number, y: number): N => ({ x, y });
const uzaklik = (a: N, b: N) => Math.hypot(a.x - b.x, a.y - b.y);
const DER = Math.PI / 180;

/** Merkezcil Catmull–Rom eğrisi: kontrol noktalarının hepsinden geçen yumuşak bir çizgi örnekler. */
function egri(k: N[], kapali: boolean, adim = 16): N[] {
  const n = k.length;
  const al = (i: number): N => {
    if (kapali) return k[(i + n) % n];
    if (i < 0) return nk(2 * k[0].x - k[1].x, 2 * k[0].y - k[1].y);
    if (i > n - 1) return nk(2 * k[n - 1].x - k[n - 2].x, 2 * k[n - 1].y - k[n - 2].y);
    return k[i];
  };
  const cikti: N[] = [];
  const son = kapali ? n : n - 1;
  for (let i = 0; i < son; i++) {
    const p0 = al(i - 1);
    const p1 = al(i);
    const p2 = al(i + 1);
    const p3 = al(i + 2);
    const t0 = 0;
    const t1 = t0 + Math.sqrt(uzaklik(p0, p1)) || 1e-4;
    const t2 = t1 + Math.sqrt(uzaklik(p1, p2)) || t1 + 1e-4;
    const t3 = t2 + Math.sqrt(uzaklik(p2, p3)) || t2 + 1e-4;
    const kar = (a: N, b: N, ta: number, tb: number, t: number): N => {
      const u = (t - ta) / (tb - ta);
      return nk(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
    };
    for (let j = 0; j < adim; j++) {
      const t = t1 + ((t2 - t1) * j) / adim;
      const a1 = kar(p0, p1, t0, t1, t);
      const a2 = kar(p1, p2, t1, t2, t);
      const a3 = kar(p2, p3, t2, t3, t);
      const b1 = kar(a1, a2, t0, t2, t);
      const b2 = kar(a2, a3, t1, t3, t);
      cikti.push(kar(b1, b2, t1, t2, t));
    }
  }
  if (!kapali) cikti.push(k[n - 1]);
  return cikti;
}

const yol = (n: N[], kapali = false) =>
  n.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + (kapali ? 'Z' : '');

function boyTablosu(n: N[]): number[] {
  const t = [0];
  for (let i = 1; i < n.length; i++) t.push(t[i - 1] + uzaklik(n[i - 1], n[i]));
  return t;
}

/** Çizgi boyunca baştan `d` uzaklıktaki nokta. */
function boyunca(n: N[], t: number[], d: number): N {
  let i = 1;
  while (i < t.length - 1 && t[i] < d) i++;
  const u = (d - t[i - 1]) / (t[i] - t[i - 1] || 1);
  return nk(n[i - 1].x + (n[i].x - n[i - 1].x) * u, n[i - 1].y + (n[i].y - n[i - 1].y) * u);
}

/** İki doğrunun (a1–a2 ve b1–b2) kesişimi. */
function kesisim(a1: N, a2: N, b1: N, b2: N): N {
  const d = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);
  const ka = a1.x * a2.y - a1.y * a2.x;
  const kb = b1.x * b2.y - b1.y * b2.x;
  return nk((ka * (b1.x - b2.x) - (a1.x - a2.x) * kb) / d, (ka * (b1.y - b2.y) - (a1.y - a2.y) * kb) / d);
}

// ——— Yan görünüş: santimetre; x öne (yüze), y yukarı; başlangıç dış kulak yolunun üst kenarı (Frankfurt düzlemi y = 0) ———
const OLCEK = 11.5;
const OX = 232;
const OY = 184;
const ek = (p: N): N => nk(OX - OLCEK * p.x, OY - OLCEK * p.y);

const ADIM = 16;
/** Baş dış hattı. 0: nasion, 12: inion; 16–17 boynun kesik alt kenarı. */
const SILUET_K: N[] = [
  nk(9.8, 2.9),
  nk(10.3, 4.3),
  nk(9.95, 6.9),
  nk(8.5, 9.6),
  nk(5.8, 11.65),
  nk(2.5, 12.65),
  nk(-0.6, 12.85),
  nk(-3.8, 12.35),
  nk(-6.7, 10.8),
  nk(-8.7, 8.3),
  nk(-9.35, 5.0),
  nk(-9.0, 2.5),
  nk(-8.4, 1.0),
  nk(-8.1, -0.6),
  nk(-7.3, -3.5),
  nk(-6.8, -7.0),
  nk(-6.6, -10.0),
  nk(3.4, -10.0),
  nk(3.8, -8.6),
  nk(6.5, -8.2),
  nk(8.9, -8.3),
  nk(10.0, -6.9),
  nk(9.6, -5.5),
  nk(10.35, -4.6),
  nk(10.0, -4.0),
  nk(10.5, -3.3),
  nk(10.3, -2.3),
  nk(12.0, -1.6),
  nk(10.9, 0.6),
];
const SILUET = egri(SILUET_K, true, ADIM);
const SILUET_DOLGU = yol(SILUET.map(ek), true);
const SILUET_CIZGI = yol([...SILUET.slice(17 * ADIM), ...SILUET.slice(0, 16 * ADIM + 1)].map(ek));
/** Nasion'dan inion'a, kafanın üstünden geçen yay. */
const KUBBE = SILUET.slice(0, 12 * ADIM + 1);
const KUBBE_T = boyTablosu(KUBBE);
const NI = KUBBE_T[KUBBE_T.length - 1];
const yayda = (d: number) => boyunca(KUBBE, KUBBE_T, d);
const KUBBE_YOL = yol(KUBBE.map(ek));

/** Beynin (sol yarımküre) dış hattı, beyincik, oluklar ve kulak kepçesi (cm). */
const BEYIN_K: N[] = [
  nk(9.05, 4.4),
  nk(8.75, 6.6),
  nk(7.65, 8.75),
  nk(5.4, 10.5),
  nk(2.4, 11.45),
  nk(-0.6, 11.65),
  nk(-3.6, 11.15),
  nk(-6.1, 9.75),
  nk(-7.65, 7.6),
  nk(-8.2, 5.1),
  nk(-7.95, 3.3),
  nk(-6.6, 2.1),
  nk(-4.2, 1.5),
  nk(-1.8, 0.75),
  nk(0.8, 0.3),
  nk(3.4, 0.45),
  nk(5.2, 1.3),
  nk(5.65, 2.3),
  nk(5.25, 2.95),
  nk(6.4, 3.05),
  nk(8.0, 3.45),
];
const BEYINCIK_K: N[] = [
  nk(-1.9, 0.5),
  nk(-4.3, 1.15),
  nk(-6.5, 1.65),
  nk(-7.45, 0.7),
  nk(-7.25, -1.2),
  nk(-6.0, -2.7),
  nk(-3.9, -3.3),
  nk(-2.3, -2.7),
  nk(-1.4, -1.2),
];
const LATERAL_K: N[] = [nk(5.25, 2.95), nk(4.2, 3.55), nk(2.4, 4.35), nk(0.4, 5.1), nk(-1.6, 5.85), nk(-3.1, 6.45), nk(-3.9, 7.4)];
/** Merkezî oluk: orta hattaki ucu bregmanın ~5 cm arkasının altında; alt ucu lateral oluğun biraz üstünde biter. */
const MERKEZI_K: N[] = [nk(-2.3, 11.5), nk(-1.85, 10.45), nk(-1.6, 9.45), nk(-0.75, 8.45), nk(-0.15, 7.4), nk(0.85, 6.4), nk(1.4, 5.45)];
const KULAK_DIS_K: N[] = [
  nk(0.45, 2.1),
  nk(-0.3, 3.15),
  nk(-1.5, 3.4),
  nk(-2.5, 2.6),
  nk(-2.85, 1.0),
  nk(-2.6, -1.0),
  nk(-2.0, -2.6),
  nk(-1.2, -3.5),
  nk(-0.5, -3.6),
  nk(0.0, -3.0),
  nk(0.15, -2.2),
];
const KULAK_IC_K: N[] = [nk(-0.4, 2.2), nk(-1.6, 2.3), nk(-2.0, 0.8), nk(-1.8, -0.9), nk(-1.1, -1.9)];
const TRAGUS_K: N[] = [nk(0.55, 0.1), nk(0.75, -0.55), nk(0.5, -1.1)];
const BEYIN_YOL = yol(egri(BEYIN_K, true).map(ek), true);
const BEYINCIK_YOL = yol(egri(BEYINCIK_K, true).map(ek), true);
const LATERAL_YOL = yol(egri(LATERAL_K, false).map(ek));
const MERKEZI_YOL = yol(egri(MERKEZI_K, false).map(ek));
const KULAK_YOLU = [KULAK_DIS_K, KULAK_IC_K, TRAGUS_K].map((k) => yol(egri(k, false).map(ek)));

/** Kafadaki başvuru noktaları (cm). */
const NASION = SILUET_K[0];
const INION = SILUET_K[12];
const GOZ_ORTASI = nk(8.95, 1.6);
const ORBITALE = nk(8.6, 0); // göz çukurunun alt kenarı
const KULAK_NOKTASI = nk(0, -0.6); // dış kulak yolu ağzının ortası
const KULAK_ONU = nk(0.85, -0.05); // Gray: elmacık kemerinin arka kökü üzerinde
const KONDIL = nk(1.3, -0.7); // alt çene ekleminin başı
const MASTOID = nk(-2.4, -3.1); // mastoid çıkıntı: kulak memesinin arkası
const ALIN_ELMACIK = nk(8.0, 2.6); // alın–elmacık dikişi
const PTERION = nk(ALIN_ELMACIK.x - 3.5, ALIN_ELMACIK.y + 1.2); // Gray: dikişin 35 mm arkası, 12 mm üstü

// Taylor–Haughton
const Y25 = yayda(NI * 0.25);
const Y50 = yayda(NI * 0.5);
const Y75 = yayda(NI * 0.75);
const UST_ROLANDO = yayda(NI * 0.5 + 2);
const ALT_ROLANDO = kesisim(GOZ_ORTASI, Y75, KONDIL, nk(KONDIL.x, 10));

// Gray 1918
const GRAY_UST = yayda(NI * 0.5 + 1.25);
const SYLVIUS_N = kesisim(Y75, ALIN_ELMACIK, Y25, KULAK_NOKTASI);
const REID_YON = (() => {
  const dx = KULAK_NOKTASI.x - ORBITALE.x;
  const dy = KULAK_NOKTASI.y - ORBITALE.y;
  const u = Math.hypot(dx, dy);
  return nk(dx / u, dy / u);
})();
/** Kulak önü noktasından Reid taban çizgisine dik, yukarı doğru. */
const DIK_YON = REID_YON.x < 0 ? nk(REID_YON.y, -REID_YON.x) : nk(-REID_YON.y, REID_YON.x);
const GRAY_ALT = kesisim(Y75, ALIN_ELMACIK, KULAK_ONU, nk(KULAK_ONU.x + DIK_YON.x, KULAK_ONU.y + DIK_YON.y));

// ——— Yukarıdan görünüş: kafa yüzeyi düzleştirilmiş harita. Merkez verteks; dış çember nasion, inion ve kulak önü
// noktalarının düzeyi; merkezden uzaklık kafa yüzeyi boyunca ölçülen uzaklıkla orantılı (nasion–inion yarısı = yarıçap). ———
const BREGMA_D = 14; // nasion'dan orta hat boyunca, cm (yaklaşık)
const MERKEZI_D = BREGMA_D + 5; // merkezî oluğun orta hattaki ucu: bregmanın ~5 cm arkası
const KOT70 = Math.cos(70 * DER) / Math.sin(70 * DER);

type Harita = {
  mx: number;
  my: number;
  mr: number;
  km: number;
  nasiondan: (d: number, yan?: number) => N;
  iniondan: (d: number, yan?: number) => N;
  kutup: (r: number, aci: number, taraf?: number) => N;
};

function harita(mx: number, my: number, mr: number): Harita {
  const km = mr / (NI / 2);
  return {
    mx,
    my,
    mr,
    km,
    nasiondan: (d, yan = 0) => nk(mx + km * yan, my - mr + km * d),
    iniondan: (d, yan = 0) => nk(mx + km * yan, my + mr - km * d),
    kutup: (r, aci, taraf = 1) => nk(mx + taraf * r * mr * Math.sin(aci * DER), my - r * mr * Math.cos(aci * DER)),
  };
}

const TAM = harita(196, 156, 124);
const YAKIN = harita(300, 222, 165);

/** Merkezî oluk, yukarıdan: orta hattaki ucundan yanlara doğru orta hatla ~70° yaparak öne iner. */
function merkeziUst(h: Harita, taraf: number): string {
  const n: N[] = [];
  for (let i = 0; i <= 24; i++) {
    const u = (i / 24) * 10.4;
    const dalga = 0.14 * Math.sin((i / 24) * Math.PI * 3);
    n.push(
      h.nasiondan(
        MERKEZI_D - u * Math.cos(70 * DER) - dalga * Math.cos(20 * DER),
        taraf * (u * Math.sin(70 * DER) - dalga * Math.sin(20 * DER)),
      ),
    );
  }
  return yol(n);
}
const yarimKure = (h: Harita, t: number) => {
  const { mx, my, mr } = h;
  return `M${mx + t * 3},${my - 0.83 * mr} C${mx + t * 0.6 * mr},${my - 0.88 * mr} ${mx + t * 0.95 * mr},${my - 0.5 * mr} ${mx + t * 0.94 * mr},${my + 0.04 * mr} C${mx + t * 0.92 * mr},${my + 0.54 * mr} ${mx + t * 0.6 * mr},${my + 0.89 * mr} ${mx + t * 3},${my + 0.85 * mr} Z`;
};

// Karıncığa giriş noktaları (hastanın sağında)
const koronal = (yan: number) => BREGMA_D - 0.05 * yan * yan;
const KORONAL = Array.from({ length: 23 }, (_, i) => TAM.nasiondan(koronal(-5.5 + i * 0.5), -5.5 + i * 0.5));
const KOCHER_ALAN = [
  TAM.nasiondan(koronal(2) - 2, 2),
  TAM.nasiondan(koronal(3) - 2, 3),
  TAM.nasiondan(koronal(3) - 1, 3),
  TAM.nasiondan(koronal(2) - 1, 2),
];
const KOCHER_10 = TAM.nasiondan(10, 3);
const KOCHER_11 = TAM.nasiondan(11, 3);
const KAUFMAN = TAM.nasiondan(5, 3);
const DANDY = TAM.iniondan(3, 2);
const FRAZIER_A = TAM.iniondan(6, 2.5);
const FRAZIER_B = TAM.iniondan(6, 4);
/** Keen: kulak kepçesinin 2–3 cm üstü ve arkası; kepçenin üst-arka kenarı haritada dış çemberin ~3 cm içinde. */
const KEEN = nk(TAM.mx + TAM.mr - TAM.km * (3 + 2.5), TAM.my + TAM.km * (1 + 2.5));
const OKSIPITAL_PARIETAL = nk((KEEN.x + (FRAZIER_A.x + FRAZIER_B.x) / 2) / 2, (KEEN.y + FRAZIER_A.y) / 2);

// EEG 10–20: 21 nokta (Fpz ve Oz dahil); yalnızca bölümde anılanların adı yazılır
const ELEKTROTLAR: { ad: string; r: number; aci: number; taraf: number; yazili?: boolean }[] = [
  { ad: 'Fpz', r: 0.8, aci: 0, taraf: 1 },
  { ad: 'Fp1', r: 0.8, aci: 18, taraf: -1 },
  { ad: 'Fp2', r: 0.8, aci: 18, taraf: 1 },
  { ad: 'F7', r: 0.8, aci: 54, taraf: -1 },
  { ad: 'F8', r: 0.8, aci: 54, taraf: 1 },
  { ad: 'T3', r: 0.8, aci: 90, taraf: -1, yazili: true },
  { ad: 'T4', r: 0.8, aci: 90, taraf: 1 },
  { ad: 'T5', r: 0.8, aci: 126, taraf: -1 },
  { ad: 'T6', r: 0.8, aci: 126, taraf: 1 },
  { ad: 'O1', r: 0.8, aci: 162, taraf: -1 },
  { ad: 'O2', r: 0.8, aci: 162, taraf: 1 },
  { ad: 'Oz', r: 0.8, aci: 180, taraf: 1 },
  { ad: 'Fz', r: 0.4, aci: 0, taraf: 1 },
  { ad: 'Cz', r: 0, aci: 0, taraf: 1, yazili: true },
  { ad: 'Pz', r: 0.4, aci: 180, taraf: 1 },
  { ad: 'C3', r: 0.4, aci: 90, taraf: -1, yazili: true },
  { ad: 'C4', r: 0.4, aci: 90, taraf: 1, yazili: true },
  { ad: 'F3', r: 0.55, aci: 40.5, taraf: -1, yazili: true },
  { ad: 'F4', r: 0.55, aci: 40.5, taraf: 1 },
  { ad: 'P3', r: 0.55, aci: 139.5, taraf: -1, yazili: true },
  { ad: 'P4', r: 0.55, aci: 139.5, taraf: 1 },
];

// TMS (büyütülmüş harita): motor sıcak nokta solda, hareket kabuğunun üstünde (şematik yer); 5 cm ve ~7 cm öne
const F3_Y = YAKIN.kutup(0.55, 40.5, -1);
const SICAK_YAN = 4.6;
const SICAK = YAKIN.nasiondan(MERKEZI_D - SICAK_YAN * KOT70 - 0.7, -SICAK_YAN);
const SICAK_5 = nk(SICAK.x, SICAK.y - 5 * YAKIN.km);
const SICAK_7 = nk(SICAK.x, SICAK.y - 7 * YAKIN.km);
/** Beam F3: verteksten F3'e giden doğrultunun dış çemberi kestiği yer (çevre boyunca ölçülen uzaklığın ucu). */
const BEAM_ACI = Math.atan2(YAKIN.mx - F3_Y.x, YAKIN.my - F3_Y.y);

// ——— Renkler (yalnızca tanıtır) ———
const BEYIN = '#e86f86';
const BEYIN_KENAR = '#cf6a80';
const OLUK = '#c2415f';
const YAY = '#e8891c';
const SYLVIUS = '#1b9bd8';
const ROLANDO = '#e5484d';
const GIRIS = '#e0a020';
const ARKA = '#d94f8e';

function Yazi({
  x,
  y,
  children,
  bas = 'start',
  kalin = false,
  renk = 'var(--ink)',
  boy = 10.5,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  bas?: 'start' | 'middle' | 'end';
  kalin?: boolean;
  renk?: string;
  boy?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={bas}
      fontSize={boy}
      fontWeight={kalin ? 700 : 500}
      fill={renk}
      stroke="var(--surface)"
      strokeWidth={3}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

function Cizgi({ a, b, renk = 'var(--ink-3)', kesik = true, kalin = 1.4 }: { a: N; b: N; renk?: string; kesik?: boolean; kalin?: number }) {
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={renk}
      strokeWidth={kalin}
      strokeDasharray={kesik ? '5 4' : undefined}
      strokeLinecap="round"
    />
  );
}

function Isaret({ p, renk, r = 4.2 }: { p: N; renk: string; r?: number }) {
  return <circle cx={p.x} cy={p.y} r={r} fill={renk} stroke="var(--surface)" strokeWidth={1.6} />;
}

/** Yazıdan noktaya ince gösterge çizgisi. */
function Gosterge({ a, b }: { a: N; b: N }) {
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--ink-3)" strokeWidth={0.9} />;
}

/** Yan görünüşte kesik çizgi: kafadaki çizgi; düz çizgi: beyindeki oluk. */
function Aciklama({ y }: { y: number }) {
  return (
    <g>
      <line x1={8} y1={y - 4} x2={28} y2={y - 4} stroke="var(--ink-2)" strokeWidth={1.8} strokeDasharray="5 3" />
      <Yazi x={33} y={y}>
        kafadaki çizgi
      </Yazi>
      <line x1={8} y1={y + 12} x2={28} y2={y + 12} stroke={OLUK} strokeWidth={2.4} strokeLinecap="round" />
      <Yazi x={33} y={y + 16}>
        beyindeki oluk
      </Yazi>
    </g>
  );
}

function YanTaban() {
  const g = ek(GOZ_ORTASI);
  const meatus = ek(KULAK_NOKTASI);
  return (
    <g>
      <path d={SILUET_DOLGU} fill="var(--surface-2)" />
      <path d={SILUET_CIZGI} fill="none" stroke="var(--ink-3)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d={BEYINCIK_YOL} fill={BEYIN} fillOpacity={0.14} stroke={BEYIN_KENAR} strokeWidth={1.1} />
      <path d={BEYIN_YOL} fill="var(--surface-2)" />
      <path d={BEYIN_YOL} fill={BEYIN} fillOpacity={0.22} stroke={BEYIN_KENAR} strokeWidth={1.4} />
      <path d={LATERAL_YOL} fill="none" stroke={OLUK} strokeWidth={2.4} strokeLinecap="round" />
      <path d={MERKEZI_YOL} fill="none" stroke={OLUK} strokeWidth={2.4} strokeLinecap="round" />
      {KULAK_YOLU.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--ink-3)" strokeWidth={i ? 1 : 1.3} strokeLinecap="round" opacity={0.75} />
      ))}
      <ellipse cx={meatus.x} cy={meatus.y} rx={3.2} ry={4.4} fill="var(--ink-3)" opacity={0.8} />
      <path
        d={`M${g.x - 7},${g.y} Q${g.x},${g.y - 4.5} ${g.x + 7},${g.y + 0.5} Q${g.x},${g.y + 4} ${g.x - 7},${g.y} Z`}
        fill="var(--surface)"
        stroke="var(--ink-3)"
        strokeWidth={1.1}
      />
      <circle cx={g.x - 3.5} cy={g.y + 0.2} r={1.8} fill="var(--ink-3)" />
    </g>
  );
}

/** Nasion–inion yayı ve yüzde (ya da çeyrek) işaretleri. */
function Yay({ oranlar }: { oranlar: number[] }) {
  return (
    <g>
      <path d={KUBBE_YOL} fill="none" stroke={YAY} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      {oranlar.map((o) => {
        const p = ek(yayda(NI * o));
        const a = ek(yayda(NI * o - 0.3));
        const b = ek(yayda(NI * o + 0.3));
        const u = Math.hypot(b.x - a.x, b.y - a.y);
        const nx = -(b.y - a.y) / u;
        const ny = (b.x - a.x) / u;
        return <line key={o} x1={p.x - nx * 6} y1={p.y - ny * 6} x2={p.x + nx * 6} y2={p.y + ny * 6} stroke={YAY} strokeWidth={2.6} />;
      })}
    </g>
  );
}

function Taylor() {
  const n = ek(NASION);
  const i = ek(INION);
  const y25 = ek(Y25);
  const y50 = ek(Y50);
  const y75 = ek(Y75);
  const ust = ek(UST_ROLANDO);
  const alt = ek(ALT_ROLANDO);
  const goz = ek(GOZ_ORTASI);
  const pt = ek(PTERION);
  const kon = ek(KONDIL);
  const mas = ek(MASTOID);
  return (
    <g>
      <YanTaban />
      <Yay oranlar={[0.25, 0.5, 0.75]} />
      {/* Başlangıç çizgileri: Frankfurt düzlemi, kondil çizgisi, arka kulak çizgisi */}
      <Cizgi a={ek(nk(12.2, 0))} b={ek(nk(-1.6, 0))} />
      <Cizgi a={kon} b={ek(nk(KONDIL.x, 7))} />
      <Cizgi a={mas} b={ek(nk(MASTOID.x, 7))} />
      {/* Sylvius çizgisi ve merkezî oluk çizgisi */}
      <Cizgi a={goz} b={y75} renk={SYLVIUS} kalin={2.2} />
      <Cizgi a={ust} b={alt} renk={ROLANDO} kalin={2.2} />
      <Isaret p={goz} renk={SYLVIUS} r={3} />
      <Isaret p={ust} renk={ROLANDO} />
      <Isaret p={alt} renk={ROLANDO} />
      <Isaret p={pt} renk="var(--ink-2)" r={3.4} />
      <Isaret p={kon} renk="var(--ink-2)" r={2.8} />
      <Isaret p={mas} renk="var(--ink-2)" r={2.8} />
      <Isaret p={n} renk="var(--ink)" r={3} />
      <Isaret p={i} renk="var(--ink)" r={3} />

      <Aciklama y={22} />
      <Yazi x={n.x - 9} y={n.y - 3} bas="end">
        nasion
      </Yazi>
      <Yazi x={i.x + 8} y={i.y + 4}>
        inion
      </Yazi>
      <Yazi x={y25.x - 9} y={y25.y - 9} bas="end" kalin>
        %25
      </Yazi>
      <Yazi x={y50.x - 4} y={y50.y - 11} bas="middle" kalin>
        %50
      </Yazi>
      <Yazi x={y75.x + 9} y={y75.y - 5} kalin>
        %75
      </Yazi>
      <Yazi x={ust.x + 8} y={ust.y - 17}>
        üst Rolando noktası
      </Yazi>
      <Yazi x={ust.x + 8} y={ust.y - 5} renk="var(--ink-2)">
        %50 + 2 cm
      </Yazi>
      <Gosterge a={nk(alt.x - 4, alt.y - 4)} b={nk(alt.x - 9, alt.y - 12)} />
      <Yazi x={alt.x - 10} y={alt.y - 24} bas="end">
        alt Rolando
      </Yazi>
      <Yazi x={alt.x - 10} y={alt.y - 13} bas="end">
        noktası
      </Yazi>
      <Yazi x={pt.x - 6} y={pt.y - 9} bas="end">
        pterion
      </Yazi>
      <Yazi x={alt.x + 17} y={alt.y - 48} bas="end">
        merkezî oluk
      </Yazi>
      <Yazi x={256} y={130}>
        lateral oluk
      </Yazi>
      <Gosterge a={nk(goz.x - 4, goz.y)} b={nk(86, 163)} />
      <Yazi x={83} y={166} bas="end">
        Sylvius çizgisi
      </Yazi>
      <Yazi x={8} y={182}>
        Frankfurt
      </Yazi>
      <Yazi x={8} y={194}>
        düzlemi
      </Yazi>
      <Gosterge a={nk(kon.x - 2, kon.y + 3)} b={nk(kon.x - 6, kon.y + 13)} />
      <Yazi x={kon.x - 4} y={kon.y + 24} bas="end">
        kondil çizgisi
      </Yazi>
      <Gosterge a={nk(mas.x - 2, mas.y + 3)} b={nk(mas.x - 6, mas.y + 14)} />
      <Yazi x={mas.x - 4} y={mas.y + 25} bas="end">
        arka kulak çizgisi
      </Yazi>
    </g>
  );
}

function Gray() {
  const n = ek(NASION);
  const i = ek(INION);
  const y25 = ek(Y25);
  const y50 = ek(Y50);
  const y75 = ek(Y75);
  const ust = ek(GRAY_UST);
  const alt = ek(GRAY_ALT);
  const sn = ek(SYLVIUS_N);
  const fz = ek(ALIN_ELMACIK);
  const kn = ek(KULAK_NOKTASI);
  const ko = ek(KULAK_ONU);
  const dikUc = ek(nk(GRAY_ALT.x + DIK_YON.x * 0.9, GRAY_ALT.y + DIK_YON.y * 0.9));
  const reidOn = ek(nk(ORBITALE.x - REID_YON.x * 4, ORBITALE.y - REID_YON.y * 4));
  const reidArka = ek(nk(KULAK_NOKTASI.x + REID_YON.x * 1.6, KULAK_NOKTASI.y + REID_YON.y * 1.6));
  return (
    <g>
      <YanTaban />
      <Yay oranlar={[0.25, 0.5, 0.75]} />
      <Cizgi a={reidOn} b={reidArka} />
      <Cizgi a={ko} b={dikUc} />
      <Cizgi a={y25} b={kn} renk={SYLVIUS} kalin={1.3} />
      <Cizgi a={fz} b={sn} renk={SYLVIUS} kalin={1.3} />
      <Cizgi a={sn} b={y75} renk={SYLVIUS} kalin={2.4} />
      <Cizgi a={ust} b={alt} renk={ROLANDO} kalin={2.2} />
      <Isaret p={sn} renk={SYLVIUS} />
      <Isaret p={ust} renk={ROLANDO} />
      <Isaret p={alt} renk={ROLANDO} />
      <Isaret p={fz} renk="var(--ink-2)" r={3} />
      <Isaret p={ko} renk="var(--ink-2)" r={2.8} />
      <Isaret p={n} renk="var(--ink)" r={3} />
      <Isaret p={i} renk="var(--ink)" r={3} />

      <Yazi x={8} y={16} kalin>
        Gray 1918 · tarihsel yöntem
      </Yazi>
      <Aciklama y={36} />
      <Yazi x={n.x - 9} y={n.y - 6} bas="end">
        nasion
      </Yazi>
      <Yazi x={i.x + 8} y={i.y + 4}>
        inion
      </Yazi>
      <Yazi x={y25.x - 9} y={y25.y - 8} bas="end" kalin boy={14}>
        ¼
      </Yazi>
      <Yazi x={y50.x - 4} y={y50.y - 10} bas="middle" kalin boy={14}>
        ½
      </Yazi>
      <Yazi x={y75.x + 9} y={y75.y - 4} kalin boy={14}>
        ¾
      </Yazi>
      <Gosterge a={nk(ust.x + 2, ust.y - 4)} b={nk(ust.x + 8, ust.y - 13)} />
      <Yazi x={ust.x + 9} y={ust.y - 15}>
        üst nokta: ½ + 1,25 cm
      </Yazi>
      <Gosterge a={nk(sn.x - 4, sn.y - 2)} b={nk(90, 112)} />
      <Yazi x={88} y={114} bas="end">
        Sylvius noktası
      </Yazi>
      <Gosterge a={nk(fz.x - 4, fz.y + 1)} b={nk(72, 157)} />
      <Yazi x={70} y={156} bas="end">
        alın–elmacık
      </Yazi>
      <Yazi x={70} y={168} bas="end">
        dikişi
      </Yazi>
      <Yazi x={8} y={reidOn.y + 2}>
        Reid taban
      </Yazi>
      <Yazi x={8} y={reidOn.y + 14}>
        çizgisi
      </Yazi>
      <Gosterge a={nk(alt.x + 4, alt.y + 1)} b={nk(336, 126)} />
      <Yazi x={338} y={130}>
        alt nokta
      </Yazi>
      <Gosterge a={nk(ko.x - 2, ko.y + 3)} b={nk(ko.x - 6, ko.y + 14)} />
      <Yazi x={ko.x - 4} y={ko.y + 25} bas="end">
        kulak önü noktası
      </Yazi>
      <Gosterge a={nk(kn.x, kn.y + 5)} b={nk(kn.x - 4, kn.y + 37)} />
      <Yazi x={kn.x - 2} y={kn.y + 48} bas="end">
        kulak noktası
      </Yazi>
    </g>
  );
}

function UstTaban({ h }: { h: Harita }) {
  const { mx, my, mr } = h;
  return (
    <g>
      <circle cx={mx} cy={my} r={mr} fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth={1.4} />
      <path
        d={`M${mx - 9},${my - mr + 2} L${mx},${my - mr - 14} L${mx + 9},${my - mr + 2}`}
        fill="var(--surface-2)"
        stroke="var(--ink-3)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {[-1, 1].map((t) => (
        <ellipse
          key={t}
          cx={mx + t * (mr + 3)}
          cy={my + 6}
          rx={6}
          ry={15}
          fill="var(--surface-2)"
          stroke="var(--ink-3)"
          strokeWidth={1.3}
        />
      ))}
      {[-1, 1].map((t) => (
        <path key={t} d={yarimKure(h, t)} fill={BEYIN} fillOpacity={0.2} stroke={BEYIN_KENAR} strokeWidth={1.3} />
      ))}
      <path d={merkeziUst(h, -1)} fill="none" stroke={OLUK} strokeWidth={2.2} strokeLinecap="round" />
      <path d={merkeziUst(h, 1)} fill="none" stroke={OLUK} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={mx} y1={my - mr} x2={mx} y2={my + mr} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="4 4" />
    </g>
  );
}

function Giris() {
  const h = TAM;
  const sag = 334;
  const etiket = (p: N, y: number) => <Gosterge a={nk(p.x + 5, p.y)} b={nk(sag - 4, y - 4)} />;
  const frazierOrta = nk((FRAZIER_A.x + FRAZIER_B.x) / 2, FRAZIER_A.y);
  const kocherOrta = (KOCHER_10.y - 4 + KOCHER_ALAN[2].y) / 2;
  return (
    <g>
      <UstTaban h={h} />
      <path d={yol(KORONAL)} fill="none" stroke="var(--ink-2)" strokeWidth={1.5} strokeDasharray="6 4" />
      {[5, 10, 11].map((d) => (
        <line key={d} x1={h.mx - 5} y1={h.nasiondan(d).y} x2={h.mx + 5} y2={h.nasiondan(d).y} stroke="var(--ink-2)" strokeWidth={1.4} />
      ))}
      {[3, 6].map((d) => (
        <line key={d} x1={h.mx - 5} y1={h.iniondan(d).y} x2={h.mx + 5} y2={h.iniondan(d).y} stroke="var(--ink-2)" strokeWidth={1.4} />
      ))}
      <path d={yol(KOCHER_ALAN, true)} fill={GIRIS} fillOpacity={0.6} stroke={GIRIS} strokeWidth={1.4} />
      {etiket(KAUFMAN, KAUFMAN.y + 4)}
      {etiket(KEEN, KEEN.y + 4)}
      {etiket(OKSIPITAL_PARIETAL, OKSIPITAL_PARIETAL.y + 2)}
      {etiket(frazierOrta, FRAZIER_A.y + 4)}
      {etiket(DANDY, DANDY.y + 4)}
      {/* Kocher tarifleri: nasion'dan 10 ve 11 cm (noktalar), koronal dikişin 1–2 cm önü (alan) */}
      <path
        d={`M${KOCHER_ALAN[1].x + 5},${KOCHER_10.y - 4} h4 V${KOCHER_ALAN[2].y} h-4`}
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth={1.2}
      />
      <Gosterge a={nk(KOCHER_ALAN[1].x + 9, kocherOrta)} b={nk(sag - 4, kocherOrta)} />
      <circle cx={KOCHER_10.x} cy={KOCHER_10.y} r={3} fill={GIRIS} stroke="var(--surface)" strokeWidth={1.2} />
      <circle cx={KOCHER_11.x} cy={KOCHER_11.y} r={3} fill={GIRIS} stroke="var(--surface)" strokeWidth={1.2} />
      <Isaret p={KAUFMAN} renk={GIRIS} r={3.6} />
      <Isaret p={KEEN} renk={ARKA} />
      <Isaret p={DANDY} renk={ARKA} />
      <line x1={FRAZIER_A.x} y1={FRAZIER_A.y} x2={FRAZIER_B.x} y2={FRAZIER_B.y} stroke={ARKA} strokeWidth={6} strokeLinecap="round" />
      <Isaret p={OKSIPITAL_PARIETAL} renk={ARKA} r={3.4} />

      <Yazi x={h.mx - 8} y={h.nasiondan(5).y + 4} bas="end">
        5 cm
      </Yazi>
      <Yazi x={h.mx - 8} y={h.nasiondan(10.5).y + 4} bas="end">
        10–11 cm
      </Yazi>
      <Yazi x={h.mx - 8} y={h.iniondan(6).y + 4} bas="end">
        6 cm
      </Yazi>
      <Yazi x={h.mx - 8} y={h.iniondan(3).y} bas="end">
        3 cm
      </Yazi>
      <Yazi x={150} y={138} bas="end">
        koronal dikiş
      </Yazi>
      <Yazi x={172} y={178} bas="end">
        merkezî oluk
      </Yazi>
      <Yazi x={h.mx - 12} y={h.my - h.mr - 6} bas="end">
        nasion
      </Yazi>
      <Yazi x={h.mx} y={h.my + h.mr + 14} bas="middle">
        inion
      </Yazi>
      <Yazi x={sag} y={KAUFMAN.y + 4}>
        Kaufman
      </Yazi>
      <Yazi x={sag} y={kocherOrta + 4}>
        Kocher
      </Yazi>
      <Yazi x={sag} y={KEEN.y + 4}>
        Keen
      </Yazi>
      <Yazi x={sag} y={OKSIPITAL_PARIETAL.y - 2}>
        oksipital-
      </Yazi>
      <Yazi x={sag} y={OKSIPITAL_PARIETAL.y + 10}>
        parietal
      </Yazi>
      <Yazi x={sag} y={FRAZIER_A.y + 4}>
        Frazier
      </Yazi>
      <Yazi x={sag} y={DANDY.y + 4}>
        Dandy
      </Yazi>
    </g>
  );
}

function Eeg() {
  const h = TAM;
  return (
    <g>
      <UstTaban h={h} />
      <line x1={h.mx - h.mr} y1={h.my} x2={h.mx + h.mr} y2={h.my} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="4 4" />
      {ELEKTROTLAR.map((e) => {
        const p = h.kutup(e.r, e.aci, e.taraf);
        return e.yazili ? (
          <g key={e.ad}>
            <circle
              cx={p.x}
              cy={p.y}
              r={11}
              fill="var(--surface)"
              stroke={e.ad === 'F3' ? YAY : 'var(--ink-2)'}
              strokeWidth={e.ad === 'F3' ? 2.6 : 1.4}
            />
            <text x={p.x} y={p.y + 3.8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--ink)">
              {e.ad}
            </text>
          </g>
        ) : (
          <circle key={e.ad} cx={p.x} cy={p.y} r={4} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.3} />
        );
      })}
      {(
        [
          [0, 0.1, '%10'],
          [0.1, 0.3, '%20'],
          [0.3, 0.5, '%20'],
          [0.5, 0.7, '%20'],
          [0.7, 0.9, '%20'],
          [0.9, 1, '%10'],
        ] as const
      ).map(([a, b, t]) => (
        <Yazi key={a} x={h.mx - 7} y={h.my - h.mr + (a + b) * h.mr + 4} bas="end" renk="var(--ink-2)">
          {t}
        </Yazi>
      ))}
      <Yazi x={h.mx + 9} y={h.my + 26}>
        ≈ verteks
      </Yazi>
      <Yazi x={h.mx - 12} y={h.my - h.mr - 6} bas="end">
        nasion
      </Yazi>
      <Yazi x={h.mx} y={h.my + h.mr + 14} bas="middle">
        inion
      </Yazi>
      <Yazi x={h.mx - h.mr - 8} y={h.my + 34} bas="end">
        kulak önü
      </Yazi>
      <Yazi x={h.mx - h.mr - 8} y={h.my + 46} bas="end">
        noktası
      </Yazi>
      <Yazi x={h.mx + h.mr + 8} y={h.my + 34}>
        kulak önü
      </Yazi>
      <Yazi x={h.mx + h.mr + 8} y={h.my + 46}>
        noktası
      </Yazi>
    </g>
  );
}

function Numara({ p, n }: { p: N; n: number }) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={7.5} fill="var(--surface)" stroke={YAY} strokeWidth={2.2} />
      <text x={p.x} y={p.y + 3.8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--ink)">
        {n}
      </text>
    </g>
  );
}

function Tms({ kirp }: { kirp: string }) {
  const h = YAKIN;
  const cz = nk(h.mx, h.my);
  const yay = (() => {
    const n: N[] = [];
    for (let i = 0; i <= 24; i++) {
      const a = (BEAM_ACI * i) / 24;
      n.push(nk(h.mx - (h.mr + 7) * Math.sin(a), h.my - (h.mr + 7) * Math.cos(a)));
    }
    return yol(n);
  })();
  const yayOrta = nk(h.mx - (h.mr + 19) * Math.sin(BEAM_ACI / 2), h.my - (h.mr + 19) * Math.cos(BEAM_ACI / 2));
  const xUcu = nk(h.mx - (h.mr + 7) * Math.sin(BEAM_ACI), h.my - (h.mr + 7) * Math.cos(BEAM_ACI));
  const yon = nk((F3_Y.x - cz.x) / uzaklik(F3_Y, cz), (F3_Y.y - cz.y) / uzaklik(F3_Y, cz));
  const ikiYer = nk(cz.x + yon.x * 34 + yon.y * 11, cz.y + yon.y * 34 - yon.x * 11);
  return (
    <g>
      <g clipPath={`url(#${kirp})`}>
        <UstTaban h={h} />
      </g>
      <path d={yay} fill="none" stroke={YAY} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={xUcu.x} cy={xUcu.y} r={3.2} fill={YAY} />
      <Cizgi a={cz} b={F3_Y} renk={YAY} kesik={false} kalin={2.6} />
      <line x1={SICAK.x} y1={SICAK.y} x2={SICAK_5.x} y2={SICAK_5.y} stroke={ROLANDO} strokeWidth={2.6} />
      <line x1={SICAK_5.x} y1={SICAK_5.y} x2={SICAK_7.x} y2={SICAK_7.y} stroke={ROLANDO} strokeWidth={2.2} strokeDasharray="4 3" />
      <line x1={SICAK_5.x} y1={SICAK_5.y} x2={SICAK_5.x + 5} y2={SICAK_5.y} stroke={ROLANDO} strokeWidth={2.4} />
      <line x1={SICAK_7.x} y1={SICAK_7.y} x2={SICAK_7.x + 5} y2={SICAK_7.y} stroke={ROLANDO} strokeWidth={2.4} />
      <Isaret p={SICAK} renk={ROLANDO} r={5} />
      <circle cx={F3_Y.x} cy={F3_Y.y} r={10} fill="var(--surface)" stroke={YAY} strokeWidth={2.6} />
      <text x={F3_Y.x} y={F3_Y.y + 3.8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--ink)">
        F3
      </text>
      <circle cx={h.mx} cy={h.my} r={11} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.4} />
      <text x={h.mx} y={h.my + 3.8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--ink)">
        Cz
      </text>
      <Numara p={yayOrta} n={1} />
      <Numara p={ikiYer} n={2} />

      <Yazi x={8} y={18} kalin>
        Beam F3 iki uzaklık hesaplar:
      </Yazi>
      <Numara p={nk(15, 31)} n={1} />
      <Yazi x={27} y={35}>
        orta hattan çevre boyunca
      </Yazi>
      <Numara p={nk(15, 49)} n={2} />
      <Yazi x={27} y={53}>
        verteksten
      </Yazi>
      <Yazi x={F3_Y.x - 15} y={F3_Y.y + 4} bas="end">
        ≈ sol DLPFC
      </Yazi>
      <Yazi x={SICAK_5.x + 7} y={SICAK_5.y + 4}>
        5 cm
      </Yazi>
      <Yazi x={SICAK_7.x + 7} y={SICAK_7.y + 4}>
        ≈7 cm
      </Yazi>
      <Gosterge a={nk(SICAK.x - 4, SICAK.y - 4)} b={nk(SICAK.x - 9, SICAK.y - 14)} />
      <Yazi x={SICAK.x - 8} y={SICAK.y - 18} bas="end">
        motor sıcak nokta
      </Yazi>
      <Yazi x={236} y={252} bas="end">
        merkezî oluk
      </Yazi>
      <Yazi x={h.mx + 15} y={h.my + 4}>
        ≈ verteks
      </Yazi>
      <Yazi x={h.mx + 12} y={h.my - h.mr - 4}>
        nasion
      </Yazi>
    </g>
  );
}

const BILGI: Record<Gorunum, { baslik: string; metin: string; kaynak: string; bakis: string[] }> = {
  taylor: {
    baslik: 'Taylor–Haughton çizgileri',
    metin:
      'Nasion–inion yayı kafanın üstünden ölçülür ve dörde bölünür. Sylvius çizgisi göz çukurunun ortasından %75 işaretine çekilir ve lateral oluğu gösterir. Merkezî oluk, %50 işaretinin 2 cm arkasındaki üst Rolando noktasından iner. Sylvius çizgisinin kondil çizgisini kestiği alt Rolando noktasında biter.',
    kaynak: 'Vigo ve ark. (2020)',
    bakis: ['Soldan bakış: yüz solda, tepe yukarıda. Şema; oranlar yaklaşıktır.'],
  },
  gray: {
    baslik: 'Gray 1918: tarihsel yöntem',
    metin:
      'Üst nokta, nasion–inion çizgisinin ortasının 1,25 cm arkasıdır. ¾ noktasından alın–elmacık dikişine bir çizgi çekilir. ¼ noktasından kulak noktasına ikinci bir çizgi çekilir. İki çizginin kesiştiği yer Sylvius noktasıdır. Birinci çizginin bu noktadan arkası, lateral yarığın arka dalını gösterir. Alt nokta, bu çizginin kulak önü noktasından Reid taban çizgisine çekilen dikle kesiştiği yerdir. Gray’in bugünkü çalışmalarla doğrulanmamış kuralları tarihsel yöntem olarak okunur.',
    kaynak: 'Gray (1918)',
    bakis: ['Soldan bakış: yüz solda, tepe yukarıda. Şema; oranlar yaklaşıktır.'],
  },
  giris: {
    baslik: 'Karıncığa giriş noktaları',
    metin:
      'Kocher noktası önden giriştir, hareket alanının önünde kalır ve çoğu zaman sağ tarafta kullanılır. Ölçüsü kaynağa göre değişir: kimi koronal dikişten, kimi nasiondan ölçer. Arkadaki Keen, Frazier ve Dandy noktaları yan karıncığın arka kısmına ulaşır. Kaufman noktası seyrek kullanılır.',
    kaynak:
      'Vigo ve ark. (2020); ElBadway ve ark. (2026); Muralidharan (2015); Pascual-Diaz ve ark. (2019); Kocaman ve ark. (2026); Safdar ve ark. (2025); Sulaiman (2024); Lee ve ark. (2020)',
    bakis: ['Yukarıdan bakış: burun yukarıda, hastanın sağı sağda.', 'Kafa yüzeyi düzleştirildi. Şema; oranlar yaklaşıktır.'],
  },
  eeg: {
    baslik: 'EEG 10–20 sistemi',
    metin:
      'Dört başlangıç noktası vardır: nasion, inion ve iki kulak önü noktası. Aradaki uzaklıklar %10 ve %20’lik parçalara bölünür ve 21 nokta bulunur. Bir çalışmada F3 dorsolateral prefrontal kabuğa, T3 üst temporal girusa, P3 alt parietal loba düştü. C3 ve C4 ise presantral girusa olguların yalnızca %13’ünde düştü.',
    kaynak: 'Xiao ve ark. (2017); Theodoroff ve ark. (2018); Herwig ve ark. (2003); Scrivener ve Reader (2022)',
    bakis: ['Yukarıdan bakış: burun yukarıda, hastanın solu solda.', 'Kafa yüzeyi düzleştirildi. Şema; oranlar yaklaşıktır.'],
  },
  tms: {
    baslik: 'TMS: sol DLPFC’yi bulmak',
    metin:
      'Depresyonda bobinin istenen yeri çoğu zaman sol dorsolateral prefrontal kabuktur (DLPFC) ve bu yer 10–20 sisteminde F3’e karşılık gelir. 5 cm kuralı, başparmağı kasan motor sıcak noktadan 5 cm öne gider ve DLPFC’yi olguların üçte birinden fazlasında ıskalar. MR kılavuzlu çalışmalar yaklaşık 7 cm öne gitmenin daha doğru olduğunu düşündürdü. Beam F3 yöntemi F3’ü üç baş ölçüsüyle bulur.',
    kaynak: 'Beam ve ark. (2009); Mir-Moghtadaei ve ark. (2015); Cardenas ve ark. (2022); Atmaram ve ark. (2025)',
    bakis: ['Yukarıdan bakış: burun yukarıda, hastanın solu solda.', 'Sol ön bölüm büyütüldü. Şema; oranlar yaklaşıktır.'],
  },
};

export function KafaBeyinCizgileri() {
  const [g, setG] = useState<Gorunum>('taylor');
  const kirp = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const b = BILGI[g];
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={g}
        onDegis={setG}
        secenekler={[
          { d: 'taylor', ad: 'Taylor–Haughton' },
          { d: 'gray', ad: 'Gray 1918 (tarihsel)' },
          { d: 'giris', ad: 'Karıncığa giriş' },
          { d: 'eeg', ad: 'EEG 10–20' },
          { d: 'tms', ad: 'TMS hedefi' },
        ]}
      />
      <svg viewBox="0 0 400 330" className="mx-auto w-full max-w-2xl" role="img" aria-label={`${b.baslik}. ${b.bakis.join(' ')}`}>
        <defs>
          <clipPath id={`kbc${kirp}`}>
            <rect x="0" y="0" width="400" height="294" />
          </clipPath>
        </defs>
        {g === 'taylor' && <Taylor />}
        {g === 'gray' && <Gray />}
        {g === 'giris' && <Giris />}
        {g === 'eeg' && <Eeg />}
        {g === 'tms' && <Tms kirp={`kbc${kirp}`} />}
        {b.bakis.map((s, i) => (
          <text key={s} x={200} y={330 - 7 - (b.bakis.length - 1 - i) * 14} textAnchor="middle" fontSize={10.5} fill="var(--ink-3)">
            {s}
          </text>
        ))}
      </svg>
      <div aria-live="polite">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
        <p className="t-small mt-1 text-ink-3">Kaynak: {b.kaynak}</p>
      </div>
    </div>
  );
}
