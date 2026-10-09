import type { NumericItem, NumericKind } from './types';

/**
 * Sayısal akıl yürütmenin soru grupları (content/instruments/sayisal-akil-yurutme.ts): orantılı durumlar, orantılı
 * olmayan durumlar (fark korunan, değişmeyen, başlangıç değeri olan) ve eşitlik ve denge soruları.
 */
export const NUMERIC_PROP: NumericKind[] = ['p'];
export const NUMERIC_NONPROP: NumericKind[] = ['a', 'c', 'f'];
export const NUMERIC_EQUAL: NumericKind[] = ['eq', 'comp', 'bal'];
export const NUMERIC_KINDS: NumericKind[] = [...NUMERIC_PROP, ...NUMERIC_NONPROP, ...NUMERIC_EQUAL];

/** Sorunun her seferinde okunması gereken sözcükleri: durumun cümleleri ve soru (eşitlikte sayılar ve işaretler). */
export function numericWords(item: NumericItem): number {
  return [...item.stem, item.question].join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Bu süreden (ms) kısa cevaplar "çok hızlı" sayılır: soru okunmadan yazılmış olabilir. Mantıksal akıl yürütmedeki gibi
 * 1,5 saniyeye her sözcük için 75 ms eklenir (dakikada 800 sözcük); hesap ve yazma süresi eklenmez. Hızlı ama doğru
 * cevaplar sorunun okunduğunu gösterir; uyarı, hızlı cevapların çoğu doğru değilse verilir (lib/scoring/tasks.ts,
 * `numericRapid`).
 */
export const numericRapidMs = (item: NumericItem) => 1500 + 75 * numericWords(item);
