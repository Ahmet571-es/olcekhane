/**
 * Harf-sayı sıralama dizilerinin bağımsız denetleyicisi: dizilerin kurallarını (content/instruments/harf-sayi-siralama.ts)
 * lib/instruments/letter-number.ts'i kullanmadan yeniden hesaplar. Her işlev, kuralı bozan dizileri açıklamalarıyla döndürür
 * (boş liste: kural sağlanıyor).
 */

const ALFABE = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const sayi = (c: string) => /^[1-9]$/.test(c);
const sira = (c: string) => (sayi(c) ? Number(c) : 100 + ALFABE.indexOf(c));
const dizil = (xs: string[]) => [...xs].sort((a, b) => sira(a) - sira(b));

/** Doğru cevap: sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla. */
export const dogruCevap = (d: string) => dizil([...d]).join('');
/** Önce harfler (sıralı), sonra sayılar (sıralı). */
export const onceHarfler = (d: string) => [...dizil([...d].filter((c) => !sayi(c))), ...dizil([...d].filter(sayi))].join('');
/** Sayılar ve harfler ayrılmış, kendi içlerinde gösterildikleri sırada. */
export const ayrilmis = (d: string) => [...[...d].filter(sayi), ...[...d].filter((c) => !sayi(c))].join('');

/** Bilinen kısaltmalar ve adlar (harfler sıralanınca ya da gösterildiği sırada bunları oluşturmamalı). */
export const KISALTMALAR = [
  'LC', 'TL', 'TC', 'KM', 'CM', 'DK', 'DR', 'TR', 'FM', 'CD', 'HD', 'PC', 'MR',
  'CHP', 'MHP', 'HDP', 'TRT', 'THY', 'TCK', 'TMK', 'KHK', 'TDK', 'TFF', 'TYT', 'MYK', 'DHL', 'KFC', 'LCD', 'PDF', 'LTD', 'HTML',
];
/** Yan yana gelince bilinen bir ad oluşturan sayı ve harf. */
export const SAYI_HARF = ['2D', '3D', '4D', '4K', '8K', 'F1', 'D3'];
/** Bilinen yıllar. */
export const YILLAR = ['1923', '1453', '1938'];

/** Bir dizinin kurallarını denetler; bozulan kuralları döndürür. */
export function diziKurallari(d: string, harfler: string): string[] {
  const out: string[] = [];
  const n = d.length;
  const ss = [...d].filter(sayi);
  const hh = [...d].filter((c) => !sayi(c));
  if (new Set(d).size !== n) out.push('aynı öğe iki kez');
  if ([...d].some((c) => !sayi(c) && !harfler.includes(c))) out.push('görevde olmayan harf');
  if (ss.length === 0 || hh.length === 0) out.push('sayı ya da harf yok');
  if (Math.abs(ss.length - hh.length) > 1) out.push('sayı ve harf sayıları dengesiz');
  if (n === 2) {
    if (sayi(d[0])) out.push('iki öğeli dizide sayı önce');
    return out;
  }
  const tur = [...d].map((c) => (sayi(c) ? 's' : 'h'));
  for (let i = 0; i + 2 < n; i++) if (tur[i] === tur[i + 1] && tur[i] === tur[i + 2]) out.push('aynı türden üç öğe art arda');
  if (tur.indexOf('h') > tur.lastIndexOf('s')) out.push('bütün sayılar harflerden önce');
  const degisim = tur.slice(1).filter((t, i) => t !== tur[i]).length;
  if (n >= 4 && degisim < Math.floor(n / 2)) out.push('sayılar ve harfler bloklar hâlinde');
  for (const [ad, g] of [['sayılar', ss], ['harfler', hh]] as const) {
    const s = dizil(g).join('');
    if (g.length === 2 && g.join('') === s) out.push(`${ad} zaten sıralı`);
    if (g.length >= 3 && (g.join('') === s || g.join('') === [...s].reverse().join(''))) out.push(`${ad} sıralı ya da tam ters`);
    const k = dizil(g).map(sira);
    for (let i = 0; i + 2 < k.length; i++) if (k[i + 1] === k[i] + 1 && k[i + 2] === k[i] + 2) out.push(`${ad}: art arda üç değer`);
  }
  // Sıralı sayılarda ikişer ya da üçer artan üç sayı (ör. 2 4 6, 3 6 9) sayarken bilinen öbeklerdir.
  const ds = dizil(ss).map(Number);
  for (let i = 0; i + 2 < ds.length; i++) {
    const a = ds[i + 1] - ds[i];
    if ((a === 2 || a === 3) && ds[i + 2] - ds[i + 1] === a) out.push('sayılar: ikişer ya da üçer artan üç sayı');
  }
  const cevaplar = [dogruCevap(d), d, onceHarfler(d), ayrilmis(d)];
  if (new Set(cevaplar).size !== 4) out.push('cevap biçimleri ayırt edilemiyor');
  const kisaltma = (s: string) => KISALTMALAR.some((k) => s.includes(k));
  if (kisaltma(dizil(hh).join('')) || kisaltma(hh.join(''))) out.push('harfler bir kısaltma oluşturuyor');
  for (let i = 0; i + 1 < n; i++) if (SAYI_HARF.includes(d.slice(i, i + 2))) out.push(`yan yana ${d.slice(i, i + 2)}`);
  if (YILLAR.some((y) => ss.join('').includes(y) || dizil(ss).join('').includes(y))) out.push('bilinen bir yıl');
  return out;
}

/** İki dizinin ortak öğe sayısı. */
export const ortak = (a: string, b: string) => [...a].filter((c) => b.includes(c)).length;
