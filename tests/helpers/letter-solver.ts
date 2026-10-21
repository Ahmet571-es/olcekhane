/**
 * Harf dizileri için bağımsız çözücü (tests/harf-dizileri.test.ts). İçerik dosyasını ve üreticiyi kullanmaz: eksik yere
 * alfabenin 29 harfini tek tek koyar ve tamamlanan diziyi açıklayan bir kural var mı diye bakar. Kurallar:
 *  - periyot p (1–6): dizi p sınıfa ayrılır (1., p+1., 2p+1. harf…); her sınıfın harfleri alfabede sabit adımla ilerler
 *    (adım 0 olabilir: aynı harf);
 *  - ikinci derece (p = 1 ya da 2): her sınıfta adımların kendisi her seferinde aynı miktarda büyür ya da küçülür.
 * Bir kuralın eksik harfi belirleyebilmesi için eksik harfin sınıfında yeterince bilinen harf olmalı (sabit adımda en az iki,
 * ikinci derecede en az üç) ve kural sınanabilir olmalı: kuralın serbest sayısı (her sınıfta başlangıç ve adım, ikinci
 * derecede ayrıca adım değişimi) bilinen harf sayısından az olmalı. Alfabe Z'den A'ya dolanmaz.
 */

export const ALFABE = 'A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z'.split(' ');
const sira = (h: string) => {
  const i = ALFABE.indexOf(h);
  if (i < 0) throw new Error(`alfabede yok: ${h}`);
  return i;
};

/** Bir sınıfın (dizideki yerleri) harf sıraları. */
const sinif = (seq: number[], p: number, r: number) => seq.filter((_, i) => i % p === r);
const sabitAdimli = (xs: number[]) => xs.every((x, i) => i < 2 || x - xs[i - 1] === xs[1] - xs[0]);
const ikinciDerece = (xs: number[]) => {
  const d = xs.slice(1).map((x, i) => x - xs[i]);
  return d.every((x, i) => i < 2 || x - d[i - 1] === d[1] - d[0]);
};

export interface Aciklama {
  kural: string;
  harf: string;
}

/** Eksik yere konunca diziyi açıklayan bütün harfler ve kurallar. */
export function aciklamalar(terms: (string | null)[]): Aciklama[] {
  const eksik = terms.indexOf(null);
  if (eksik < 0 || terms.indexOf(null, eksik + 1) >= 0) throw new Error('tam bir eksik harf olmalı');
  const bilinen = terms.length - 1;
  const out: Aciklama[] = [];
  for (const harf of ALFABE) {
    const seq = terms.map((t) => sira(t ?? harf));
    for (let p = 1; p <= 6; p++) {
      const r = eksik % p;
      const bilinenSinifta = Math.ceil((terms.length - r) / p) - 1;
      if (2 * p >= bilinen || bilinenSinifta < 2) continue;
      if (Array.from({ length: p }, (_, k) => sinif(seq, p, k)).every(sabitAdimli)) out.push({ kural: `periyot ${p}`, harf });
    }
    for (const p of [1, 2]) {
      const r = eksik % p;
      const bilinenSinifta = Math.ceil((terms.length - r) / p) - 1;
      if (3 * p >= bilinen || bilinenSinifta < 3) continue;
      const siniflar = Array.from({ length: p }, (_, k) => sinif(seq, p, k));
      // Gerçekten ikinci derece: en az bir sınıfta adımlar değişir (yoksa periyot kuralıdır).
      if (siniflar.every((xs) => xs.length < 3 || ikinciDerece(xs)) && !siniflar.every(sabitAdimli)) out.push({ kural: `ikinci derece ${p}`, harf });
    }
  }
  return out;
}

/** Diziyi açıklayan harfler (tekrarsız, alfabe sırasıyla). */
export const cevaplar = (terms: (string | null)[]) => [...new Set(aciklamalar(terms).map((a) => a.harf))].sort((a, b) => sira(a) - sira(b));

/**
 * Diziyi açıklayan en kısa periyot (sabit adımlı sınıflar; sınanabilen kurallar arasından) ve sınıfların adımları; ikinci
 * derece kurallar için `null`.
 * `harf`: eksik yere konacak harf (doğru cevap).
 */
export function enKisaPeriyot(terms: (string | null)[], harf: string): { p: number; siniflar: number[][]; adimlar: number[] } | null {
  const seq = terms.map((t) => sira(t ?? harf));
  // Yalnızca sınanabilen kurallar: serbest sayı (sınıf başına başlangıç ve adım) bilinen harf sayısından az.
  for (let p = 1; 2 * p < terms.length - 1; p++) {
    const siniflar = Array.from({ length: p }, (_, k) => sinif(seq, p, k));
    if (siniflar.every((xs) => xs.length >= 2 && sabitAdimli(xs))) return { p, siniflar, adimlar: siniflar.map((xs) => xs[1] - xs[0]) };
  }
  return null;
}

/**
 * Daha basit kurallarla bulunan harfler (tuzakların bulunabileceği yollar):
 *  - "sıradaki harf": eksik yerden önceki harfin alfabedeki sıradakisi;
 *  - "son adım": eksik yerden önceki iki harfin arasındaki adımı aynen sürdürmek;
 *  - "sınıfta son adım": eksik harfin sınıfında (p = 2–4) son iki harfin adımını sürdürmek;
 *  - "öteki dizi": eksik yerden önceki harfin sınıfının (p = 2–4) adımıyla sürdürmek (iç içe dizide öteki dizinin sıradaki harfi);
 *  - "grubu tekrarlamak": p harf önceki harfi (p = 2–4) değiştirmeden yazmak.
 */
export function basitKuralHarfleri(terms: (string | null)[]): { harf: string; yol: string }[] {
  const eksik = terms.indexOf(null);
  const at = (i: number) => (i >= 0 && i < terms.length && terms[i] !== null ? sira(terms[i] as string) : null);
  const out: { harf: string; yol: string }[] = [];
  const ekle = (v: number | null, yol: string) => {
    if (v !== null && v >= 0 && v < ALFABE.length) out.push({ harf: ALFABE[v], yol });
  };
  const once = at(eksik - 1);
  if (once !== null) ekle(once + 1, 'sıradaki harf');
  const once2 = at(eksik - 2);
  if (once !== null && once2 !== null) ekle(2 * once - once2, 'son adım');
  for (let p = 2; p <= 4; p++) {
    const a = at(eksik - p);
    const b = at(eksik - 2 * p);
    if (a !== null && b !== null) ekle(2 * a - b, `sınıfta son adım (${p})`);
    const c = at(eksik - 1 - p);
    if (once !== null && c !== null) ekle(2 * once - c, `öteki dizi (${p})`);
    if (a !== null) ekle(a, `grubu tekrarlamak (${p})`);
  }
  return out;
}
