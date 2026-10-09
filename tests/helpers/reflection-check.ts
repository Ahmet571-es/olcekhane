/**
 * Düşünerek karar verme sorularının bağımsız denetleyicisi (tests/dusunerek-karar-verme.test.ts). Sayısal sorular burada
 * sorudaki sayılarla yeniden yazılır; doğru cevap ve tuzak (tuzaklı soruda ilk akla gelen cevap, tuzaksız soruda tuzak
 * varmış gibi düşününce bulunan cevap) bu sayılardan hesaplanır ve testin cevap anahtarıyla karşılaştırılır. Sözel
 * sorularda doğru cevap ve tuzak, sorunun metninden okunan bilgilerle (sayılar, sıra sözcükleri, adlar) bulunur.
 *
 *  - Toplam ve fark (`sumDiff`): ikisi birlikte T, biri ötekinden D fazla: küçüğü (T − D) / 2. Tuzak: T − D.
 *  - Toplam ve biri (`sumKnown`): ikisi birlikte T, biri K: öteki T − K. Tuzak (fark sanmak): (T − K) / 2.
 *  - İkiye katlanma (`doubling`): her gün iki katı, tamamı F günde: yarısı F − 1. gün. Tuzak: F / 2.
 *  - Doğrusal büyüme (`linear`): her gün aynı alan, sıfırdan, tamamı F günde: yarısı F / 2. Tuzak: F − 1.
 *  - Makineler (`machines`): n makine n kutuyu t dakikada; m makine m kutuyu t dakikada. Tuzak: m.
 *  - Aynı makineler (`sameMachines`): n makine n kutuyu t dakikada; aynı n makine m kutuyu m · t / n dakikada. Tuzak: t.
 *  - Aralık (`fence`): L metrede her g metrede bir, iki uç dahil: L / g + 1. Tuzak: L / g.
 *  - Kesim (`cuts`): iki parça c dakika (bir kesim); k parça (k − 1) · c. Tuzak: k / 2 · c.
 *  - Katlar (`floors`): a. kattan b. kata t saniye; a. kattan e. kata (e − a) · t / (b − a). Tuzak: e / b · t.
 *  - Bir kat (`flights`): bir kat s saniye; k kat k · s. Tuzak (aralık sanmak): (k − 1) · s.
 *  - Sıra (`queue`): baştan da sondan da k.: 2k − 1 kişi. Tuzak: 2k.
 *  - Salyangoz (`snail`): H metre, gündüz u yukarı, gece d aşağı: ilk günü ⌈(H − u) / (u − d)⌉ + 1. Tuzak: H / (u − d).
 */
type Formal =
  | { kind: 'sumDiff'; T: number; D: number }
  | { kind: 'sumKnown'; T: number; K: number }
  | { kind: 'doubling' | 'linear'; F: number }
  | { kind: 'machines' | 'sameMachines'; n: number; t: number; m: number }
  | { kind: 'fence'; L: number; g: number }
  | { kind: 'cuts'; c: number; k: number }
  | { kind: 'floors'; a: number; b: number; t: number; e: number }
  | { kind: 'flights'; s: number; k: number }
  | { kind: 'queue'; k: number }
  | { kind: 'snail'; H: number; u: number; d: number };

export const REFLECTION_FORMAL: Record<string, Formal> = {
  // Defter ile silgi 14 lira, defter 10 lira.
  dk02: { kind: 'sumKnown', T: 14, K: 10 },
  // 50 metrelik yol, her 10 metrede bir ağaç, iki uç dahil.
  dk04: { kind: 'fence', L: 50, g: 10 },
  // Her gün aynı alan, sıfırdan; tamamı 20 günde.
  dk05: { kind: 'linear', F: 20 },
  // 5 makine 5 kutu 5 dakika; 50 makine 50 kutu?
  dk07: { kind: 'machines', n: 5, t: 5, m: 50 },
  // Bir kat 15 saniye; 4 kat?
  dk10: { kind: 'flights', s: 15, k: 4 },
  // İki parça 4 dakika; dört parça?
  dk11: { kind: 'cuts', c: 4, k: 4 },
  // Her gün iki katı; tamamı 20 günde.
  dk13: { kind: 'doubling', F: 20 },
  // Baştan da sondan da 8.
  dk15: { kind: 'queue', k: 8 },
  // 1. kattan 3. kata 30 saniye; 1. kattan 6. kata?
  dk17: { kind: 'floors', a: 1, b: 3, t: 30, e: 6 },
  // Defter ile kalem 14 lira, defter kalemden 10 lira pahalı.
  dk19: { kind: 'sumDiff', T: 14, D: 10 },
  // 10 metrelik kuyu, gündüz 3 yukarı, gece 2 aşağı.
  dk21: { kind: 'snail', H: 10, u: 3, d: 2 },
  // Aynı 5 makine 50 kutu?
  dk23: { kind: 'sameMachines', n: 5, t: 5, m: 50 },
};

/** Sorunun metninde geçmesi gereken sayılar. */
export function formalNumbers(key: string): number[] {
  const f = REFLECTION_FORMAL[key];
  switch (f.kind) {
    case 'sumDiff':
      return [f.T, f.D];
    case 'sumKnown':
      return [f.T, f.K];
    case 'doubling':
    case 'linear':
      return [f.F];
    case 'machines':
      return [f.n, f.t, f.m];
    case 'sameMachines':
      return [f.n, f.t, f.m];
    case 'fence':
      return [f.L, f.g];
    case 'cuts':
      return [f.c];
    case 'floors':
      return [f.a, f.b, f.t, f.e];
    case 'flights':
      return [f.s, f.k];
    case 'queue':
      return [f.k];
    case 'snail':
      return [f.H, f.u, f.d];
  }
}

/** Doğru cevap ve tuzak, sorunun sayılarından. */
export function reflectionExpected(key: string): { answer: number; lure: number } {
  const f = REFLECTION_FORMAL[key];
  if (!f) throw new Error(`Biçimsel yazımı olmayan soru: ${key}`);
  switch (f.kind) {
    case 'sumDiff':
      return { answer: (f.T - f.D) / 2, lure: f.T - f.D };
    case 'sumKnown':
      return { answer: f.T - f.K, lure: (f.T - f.K) / 2 };
    case 'doubling':
      return { answer: f.F - 1, lure: f.F / 2 };
    case 'linear':
      return { answer: f.F / 2, lure: f.F - 1 };
    case 'machines':
      return { answer: f.t, lure: f.m };
    case 'sameMachines':
      return { answer: (f.m * f.t) / f.n, lure: f.t };
    case 'fence':
      return { answer: f.L / f.g + 1, lure: f.L / f.g };
    case 'cuts':
      return { answer: (f.k - 1) * f.c, lure: (f.k / 2) * f.c };
    case 'floors':
      return { answer: ((f.e - f.a) * f.t) / (f.b - f.a), lure: (f.e / f.b) * f.t };
    case 'flights':
      return { answer: f.k * f.s, lure: (f.k - 1) * f.s };
    case 'queue':
      return { answer: 2 * f.k - 1, lure: 2 * f.k };
    case 'snail': {
      // Salyangozu gün gün yürütür: gündüz tırmanır, kuyunun ağzına ulaştığı gün çıkar.
      let at = 0;
      let day = 0;
      while (day < 1000) {
        day++;
        at += f.u;
        if (at >= f.H) break;
        at -= f.d;
      }
      return { answer: day, lure: f.H / (f.u - f.d) };
    }
  }
}

/** Seçeneğin başındaki sayı ("12 dakika", "8. gün"). */
export const leadingNumber = (s: string) => {
  const m = /^(\d+)/.exec(s);
  return m ? Number(m[1]) : null;
};

const ORDINALS = ['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci'];
const SEASONS = ['Bahar', 'Yaz', 'Güz', 'Kış'];

/**
 * Sözel sorularda doğru cevabın ve tuzağın metni sorudan okunur. `null`: bu soruda okunacak bir bilgi yok, cevap sözcüğe
 * göre denetlenir (`premise`).
 */
export function verbalExpected(stem: string[], question: string): { answer: string; lure: string } | { premise: string } {
  const text = [...stem, question].join(' ');
  const lower = text.toLocaleLowerCase('tr-TR');
  // "12 koyunu vardı ... 7’si dışında hepsi kaçtı" / "12 tavuğu vardı ... 7’si kümesten kaçtı".
  const flock = /(\d+) (koyunu|tavuğu) vardı.*?(\d+)’si( dışında hepsi)?( kümesten)? kaçtı/.exec(text);
  if (flock) {
    const [total, k, except] = [Number(flock[1]), Number(flock[3]), !!flock[4]];
    const unit = flock[2] === 'koyunu' ? 'koyun' : 'tavuk';
    return except ? { answer: `${k} ${unit}`, lure: `${total - k} ${unit}` } : { answer: `${total - k} ${unit}`, lure: `${k} ${unit}` };
  }
  // "Masada 5 elma vardı. Sen bunlardan 3 tanesini aldın": senin elmaların aldıkların. Tuzak: masada kalan.
  const apples = /Masada (\d+) elma vardı\..*?(\d+) tanesini aldın/.exec(text);
  if (apples) return { answer: `${apples[2]} elma`, lure: `${Number(apples[1]) - Number(apples[2])} elma` };
  // Koşu: "üçüncü sırada koşan kişiyi geçtin" (yerini alırsın) / "üçüncü sıradaydın ve hemen önündeki kişiyi geçtin".
  const passed = /(\p{L}+) sırada koşan kişiyi geçtin/u.exec(lower);
  if (passed) {
    const p = ORDINALS.indexOf(passed[1]);
    return { answer: cap(`${ORDINALS[p]} sıradayım.`), lure: cap(`${ORDINALS[p - 1]} sıradayım.`) };
  }
  const was = /(\p{L}+) sıradaydın ve hemen önündeki kişiyi geçtin/u.exec(lower);
  if (was) {
    const p = ORDINALS.indexOf(was[1]);
    return { answer: cap(`${ORDINALS[p - 1]} sıradayım.`), lure: cap(`${ORDINALS[p]} sıradayım.`) };
  }
  // Çocukların adları: sorulan kişi annenin çocuklarından biridir; tuzak, eksik kalan mevsim.
  const names = /üçünün adı (\p{L}+), (\p{L}+) ve (\p{L}+)/u.exec(text);
  if (names) {
    const missing = SEASONS.filter((s) => !names.slice(1, 4).includes(s));
    const who = /^(\p{Lu}\p{L}*)’in annesinin/u.exec(text);
    if (who) return { answer: who[1], lure: missing[0] };
    return { answer: missing[0], lure: 'Bilinemez' };
  }
  // Evin katları: tek katlı evde üst kat yoktur; iki katlı evde her şey pembe.
  if (lower.startsWith('tek katlı')) return { answer: 'Bu evde üst kat yoktur.', lure: 'Merdivenler de pembedir.' };
  if (lower.startsWith('iki katlı')) return { answer: 'Merdivenler de pembedir.', lure: 'Bu evde üst kat yoktur.' };
  if (lower.includes('horoz')) return { premise: 'horozlar yumurtlamaz' };
  if (lower.includes('elektrikli')) return { premise: 'elektrikli trenden duman çıkmaz' };
  if (lower.includes('çam ağacı')) return { premise: 'çam ağacında elma olmaz' };
  throw new Error(`Denetlenemeyen sözel soru: ${text}`);
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
