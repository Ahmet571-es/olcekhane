import { TURKISH_ALPHABET } from './types';

/**
 * Harf-sayı sıralama: dizilerin doğru cevabı ve bir cevabın incelenmesi. Puanlama (lib/scoring/tasks.ts), alıştırmadaki geri
 * bildirim (components/runner/tasks/letter-number.tsx) ve testler aynı işlevleri kullanır.
 *
 * Bir dizi, her öğesi tek bir karakter olan bir yazıdır: sayılar 1–9, harfler büyük harf ("K93C6R"). Doğru cevap önce sayılar
 * küçükten büyüğe, sonra harfler Türk alfabesindeki sırayla: "369CKR".
 */

export const lnIsDigit = (c: string) => c.length === 1 && c >= '1' && c <= '9';

/** Sıralama anahtarı: sayılar kendi değerleriyle, harfler sayılardan sonra alfabedeki yerleriyle. */
export function lnSortKey(c: string): number {
  return lnIsDigit(c) ? Number(c) : 100 + (TURKISH_ALPHABET as readonly string[]).indexOf(c);
}

const sorted = (xs: string[]) => [...xs].sort((a, b) => lnSortKey(a) - lnSortKey(b));

/** Doğru cevap: önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla. */
export function lnAnswer(seq: string): string[] {
  return sorted([...seq]);
}

/** Önce harfler (alfabe sırasıyla), sonra sayılar (küçükten büyüğe): kuralın iki bölümü yer değiştirmiş. */
export function lnLettersFirst(seq: string): string[] {
  const xs = [...seq];
  return [...sorted(xs.filter((c) => !lnIsDigit(c))), ...sorted(xs.filter(lnIsDigit))];
}

/** Sayılar ve harfler ayrılmış ama kendi içlerinde gösterildikleri sırada kalmış: önce sayılar, sonra harfler. */
export function lnGrouped(seq: string): string[] {
  const xs = [...seq];
  return [...xs.filter(lnIsDigit), ...xs.filter((c) => !lnIsDigit(c))];
}

/** İki dizinin en uzun ortak alt dizisinin uzunluğu (öğelerin birbirine göre sırası korunarak). */
export function lcsLength(a: readonly string[], b: readonly string[]): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  }
  return dp[a.length][b.length];
}

/**
 * Yanlış bir cevabın türü (bütün öğeler girildiyse sıranın nasıl karıştığı, girilmediyse öğe hatası):
 *  - `shown`: öğeler gösterildikleri sırayla girildi (sıralama yapılmadı);
 *  - `grouped`: önce sayılar, sonra harfler girildi ama ikisi de kendi içinde gösterildiği sırada kaldı;
 *  - `lettersFirst`: önce harfler, sonra sayılar; ikisi de kendi içinde doğru sırada. İki öğeli dizilerde bütün öğeleri içeren
 *    her yanlış cevap bu türdendir (harf sayıdan önce yazıldı);
 *  - `order`: öğelerin hepsi var ama sıra başka biçimde karıştı;
 *  - `items`: bir ya da birkaç öğe eksik ya da dizide olmayan bir öğe girildi.
 */
export type LnErrorKind = 'shown' | 'grouped' | 'lettersFirst' | 'order' | 'items';

export interface LnPart {
  shown: number;
  /** Gösterilenlerden cevapta yer alanlar. */
  recalled: number;
  /** Cevaptaki bu türden öğeler (yalnızca gösterilenler) doğru sırada mı; en az iki öğe yoksa `null`. */
  ordered: boolean | null;
}

export interface LnCheck {
  correct: boolean;
  skipped: boolean;
  kind: LnErrorKind | null;
  /** Gösterilen öğelerden cevapta yer alanlar (sırası ne olursa olsun). */
  recalled: number;
  /** Cevapta yer alan ve birbirine göre doğru sırada olan öğeler (doğru cevapla en uzun ortak alt dizi). */
  inOrder: number;
  /** Cevapta olmayan gösterilen öğeler ve dizide olmayan girilen öğeler. */
  missing: number;
  intrusions: number;
  digits: LnPart;
  letters: LnPart;
  /** Cevapta hem sayı hem harf varsa: bütün sayılar harflerden önce mi. */
  digitsBeforeLetters: boolean | null;
}

const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/** Bir dizinin cevabını inceler. `response`: girilen öğeler (sırasıyla; "Hatırlamıyorum" denirse boş). */
export function lnCheck(seq: string, response: readonly string[]): LnCheck {
  const items = [...seq];
  const target = lnAnswer(seq);
  const shownSet = new Set(items);
  const kept = response.filter((c) => shownSet.has(c));
  const recalled = new Set(kept).size;
  const intrusions = response.filter((c) => !shownSet.has(c)).length;
  const correct = same(response, target);
  const skipped = response.length === 0;
  const part = (isDigit: boolean): LnPart => {
    const shown = items.filter((c) => lnIsDigit(c) === isDigit);
    const got = kept.filter((c) => lnIsDigit(c) === isDigit);
    return { shown: shown.length, recalled: got.length, ordered: got.length >= 2 ? same(got, sorted(got)) : null };
  };
  const lastDigit = kept.reduce((m, c, i) => (lnIsDigit(c) ? i : m), -1);
  const firstLetter = kept.findIndex((c) => !lnIsDigit(c));
  let kind: LnErrorKind | null = null;
  if (!correct && !skipped) {
    const full = response.length === items.length && recalled === items.length;
    if (!full) kind = 'items';
    else if (items.length === 2 || same(response, lnLettersFirst(seq))) kind = 'lettersFirst';
    else if (same(response, items)) kind = 'shown';
    else if (same(response, lnGrouped(seq))) kind = 'grouped';
    else kind = 'order';
  }
  return {
    correct,
    skipped,
    kind,
    recalled,
    inOrder: lcsLength(response, target),
    missing: items.length - recalled,
    intrusions,
    digits: part(true),
    letters: part(false),
    digitsBeforeLetters: lastDigit >= 0 && firstLetter >= 0 ? lastDigit < firstLetter : null,
  };
}

/** Bir dizideki sayı ve harf sayıları. */
export function lnCounts(seq: string): { digits: number; letters: number } {
  const d = [...seq].filter(lnIsDigit).length;
  return { digits: d, letters: seq.length - d };
}
