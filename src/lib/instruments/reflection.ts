import type { ReflectionItem } from './types';

/** Sorunun okunması gereken sözcükleri: durumun cümleleri, soru ve dört seçenek. */
export function reflectionWords(item: ReflectionItem): number {
  return [...item.stem, item.question, ...item.options].join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Bu süreden (ms) kısa cevaplar "çok hızlı" sayılır: soru ve seçenekler okunmadan seçilmiş olabilir. Sayısal ve mantıksal
 * akıl yürütmedeki gibi 1,5 saniyeye her sözcük için 75 ms eklenir (dakikada 800 sözcük). İlk akla gelen cevap da sorunun
 * okunmasını gerektirir; bu yüzden sınır, düşünme süresini değil okuma süresini gözetir. Uyarı, hızlı cevapların çoğu
 * doğru değilse verilir (lib/scoring/tasks.ts, `reflectionRapid`).
 */
export const reflectionRapidMs = (item: ReflectionItem) => 1500 + 75 * reflectionWords(item);
