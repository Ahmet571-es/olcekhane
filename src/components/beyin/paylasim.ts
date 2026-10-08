import type { BeyinMotoru } from './motor';

/**
 * Sayfadaki sahne kutuları tek çiziciyi paylaşır: en çok görünen kutu çiziciyi alır; bırakan kutuya son görüntüsü
 * resim olarak verilir. Çizici modülü (three.js) yalnızca bir sahne ekrana gelince indirilir.
 */

interface Sahip {
  no: number;
  birak: (resim: string | null) => void;
}

let sahip: Sahip | null = null;
let sayac = 0;
const gorunurluk = new Map<number, { oran: number; sec: () => void }>();
/** Araç paneli açık olan kutular: kullanıcı onunla uğraşırken çizici, kutu az da olsa görünüyorsa başkasına geçmez. */
const mesgul = new Set<number>();
let secimZamanlayici: number | null = null;

export function yeniNo(): number {
  return ++sayac;
}

let motorModulu: Promise<typeof import('./motor')> | null = null;

export function motorModuluAl() {
  motorModulu ??= import('./motor');
  motorModulu.catch(() => {
    motorModulu = null;
  });
  return motorModulu;
}

export async function sahiplen(no: number, kap: HTMLElement, birak: (resim: string | null) => void): Promise<BeyinMotoru> {
  const { motorAl } = await motorModuluAl();
  const motor = await motorAl();
  if (sahip && sahip.no !== no) {
    let resim: string | null = null;
    try {
      resim = motor.goruntu();
    } catch {
      resim = null;
    }
    sahip.birak(resim);
  }
  sahip = { no, birak };
  motor.baglan(kap);
  return motor;
}

export function sahipMi(no: number): boolean {
  return sahip?.no === no;
}

export function birakildi(no: number) {
  if (sahip?.no === no) sahip = null;
  gorunurluk.delete(no);
  mesgul.delete(no);
}

export function mesgulBildir(no: number, acik: boolean) {
  if (acik) mesgul.add(no);
  else mesgul.delete(no);
}

/** Görünürlük oranı değişince en çok görünen kutu çiziciyi alır (kısa bir beklemeyle, kaydırırken titremesin diye). */
export function gorunurlukBildir(no: number, oran: number, sec: () => void) {
  gorunurluk.set(no, { oran, sec });
  if (secimZamanlayici !== null) window.clearTimeout(secimZamanlayici);
  secimZamanlayici = window.setTimeout(() => {
    secimZamanlayici = null;
    let enIyi: [number, { oran: number; sec: () => void }] | null = null;
    for (const g of gorunurluk) if (!enIyi || g[1].oran > enIyi[1].oran) enIyi = g;
    if (!enIyi || enIyi[1].oran < 0.3) return;
    if (sahip?.no === enIyi[0]) return;
    // Şu anki sahip hâlâ iyi görünüyorsa değiştirme.
    const simdiki = sahip ? gorunurluk.get(sahip.no) : undefined;
    if (simdiki && simdiki.oran >= 0.6 && simdiki.oran >= enIyi[1].oran - 0.15) return;
    if (simdiki && sahip && mesgul.has(sahip.no) && simdiki.oran >= 0.15) return;
    enIyi[1].sec();
  }, 180);
}
