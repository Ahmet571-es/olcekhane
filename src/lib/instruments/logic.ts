import type { LogicForm, LogicItem } from './types';

/**
 * Mantıksal akıl yürütmenin ekrandaki sabit metinleri ve soru türleri (content/instruments/mantiksal-akil-yurutme.ts).
 * Her soruda iki seçenek vardır: sonuç bilgilerden kesin olarak çıkar ya da çıkmaz.
 */

/** Bilgilerin üstündeki yönerge: bilgiler gerçeğe uymasa bile doğru kabul edilir ve yalnızca bu bilgiler kullanılır. */
export const LOGIC_LEAD = 'Bilgileri, gerçekte öyle olmasa bile doğru kabul et. Gerçek hayatta bildiklerini değil, yalnızca bu bilgileri kullan.';

/** Sonucun altındaki soru. */
export const LOGIC_QUESTION = 'Bu bilgiler doğruysa, sonuç da kesin olarak doğru mudur?';

/** İki seçenek (1: evet, 2: hayır). */
export const LOGIC_OPTIONS = ['Evet, kesin olarak doğru', 'Hayır, kesin değil'] as const;

/** Seçeneklerin harfleri (klavyede A ve B; 1 ve 2 de seçer). */
export const LOGIC_LETTERS = ['A', 'B'] as const;

/** Soru türlerinin gruplanması: koşullu ve kategorik; kesin olan (geçerli) ve olmayan; bilgilerle gerçek hayatın çatıştığı. */
export const LOGIC_CONDITIONAL: LogicForm[] = ['mp', 'mt', 'ac', 'da'];
export const LOGIC_CATEGORICAL: LogicForm[] = ['vb', 'vu', 'ib', 'iu'];
export const LOGIC_VALID: LogicForm[] = ['mp', 'mt', 'vb', 'vu'];
/** Bilgilerle gerçek hayatın çatıştığı sorular: geçerli ama sonucu gerçek hayatta yanlış, geçersiz ama sonucu gerçek hayatta doğru. */
export const LOGIC_CONFLICT: LogicForm[] = ['vu', 'ib'];

/**
 * Sorunun her seferinde okunması gereken sözcükleri: bilgiler ve sonuç. Altındaki soru her soruda aynı olduğu için
 * birkaç sorudan sonra yeniden okunmaz; sayılmaz.
 */
export function logicWords(item: LogicItem): number {
  return [...item.premises, item.conclusion].join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Bu süreden (ms) kısa cevaplar "çok hızlı" sayılır: bilgiler ve sonuç okunmadan seçilmiş olabilir. Sözel akıl
 * yürütmedeki gibi 1,5 saniyeye her sözcük için 75 ms eklenir (dakikada 800 sözcük; çok hızlı bir göz gezdirmenin de
 * üstünde bir hız). Bu testin sorularında yaklaşık 2,1–2,9 saniyedir. Hızlı ama doğru cevaplar okunmuş demektir; bu
 * yüzden uyarı, hızlı cevapların çoğu doğru değilse verilir (lib/scoring/tasks.ts, `logicRapid`).
 */
export const logicRapidMs = (item: LogicItem) => 1500 + 75 * logicWords(item);
