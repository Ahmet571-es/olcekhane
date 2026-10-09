import type { WordListTask } from './types';

/**
 * Kelime listesi hatırlama görevinin yardımcıları (content/instruments/kelime-listesi.ts): yazılan kelimeyi listedeki
 * kelimeyle karşılaştırma ve denemelerin düzeni. Karşılaştırma hem tarayıcıda (alıştırmanın geri bildirimi) hem sunucuda
 * (puanlama) aynı kurallarla yapılır. Bu kurallar değişirse testin sürüm numarası artırılmalıdır.
 *
 * Kelime gördüğü gibi yazılmalıdır; yazım ayrıntıları hata sayılmaz:
 *  - büyük ve küçük harf, Türkçe harflerin işaretleri (ç/c, ğ/g, ı/i, ö/o, ş/s, ü/u) ve harf dışındaki işaretler;
 *  - çoğul eki (-lar, -ler);
 *  - beş ve daha uzun harfli kelimelerde, ilk harf doğruysa, tek bir yazım kayması: bir harfin eksik ya da fazla
 *    yazılması, yan yana iki harfin yer değiştirmesi ya da bir harfin klavyede hemen yanındaki harfle yazılması.
 * İlk harfi farklı ya da başka bir harfle yazılmış kelime (ör. "balon" yerine "salon") ayrı bir kelime sayılır. Bir
 * kelime birden çok liste kelimesine uyuyorsa hiçbirine sayılmaz (testin kelimeleri bunun olmayacağı biçimde seçilmiştir).
 */

/** Karşılaştırma için sadeleştirilmiş yazım: küçük harf, Türkçe harfler işaretsiz, yalnızca a–z. */
export function normalizeWord(s: string): string {
  return s
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z]/g, '');
}

/** Türkçe Q klavyenin üç harf sırası (sadeleştirilmiş yazımla); yan yana tuşlar yazım kayması sayılır. */
const ROWS = ['qwertyuiopgu', 'asdfghjklsi', 'zxcvbnmoc'];
const NEIGHBORS = new Set<string>();
for (const row of ROWS) {
  for (let i = 0; i + 1 < row.length; i++) {
    NEIGHBORS.add(row[i] + row[i + 1]);
    NEIGHBORS.add(row[i + 1] + row[i]);
  }
}
/** Tek bir yazım kayması sayılacak en kısa kelime (harf). */
export const WORD_FUZZY_MIN = 5;

/** `a`, `b`'den tek bir harfin silinmesiyle elde ediliyor mu? (`a.length === b.length - 1`) */
function oneDeleted(a: string, b: string): boolean {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return a.slice(i) === b.slice(i + 1);
}

/** Yazılan (sadeleştirilmiş) kelime, listedeki (sadeleştirilmiş) kelimenin kabul edilen bir yazılışı mı? */
export function sameWord(typed: string, word: string): boolean {
  if (!typed || !word) return false;
  if (typed === word || typed === `${word}lar` || typed === `${word}ler`) return true;
  if (word.length < WORD_FUZZY_MIN || typed[0] !== word[0]) return false;
  if (typed.length === word.length) {
    const diff: number[] = [];
    for (let i = 0; i < word.length; i++) if (typed[i] !== word[i]) diff.push(i);
    if (diff.length === 1) return NEIGHBORS.has(typed[diff[0]] + word[diff[0]]);
    return diff.length === 2 && diff[1] === diff[0] + 1 && typed[diff[0]] === word[diff[1]] && typed[diff[1]] === word[diff[0]];
  }
  if (typed.length === word.length - 1) return oneDeleted(typed, word);
  if (typed.length === word.length + 1) return oneDeleted(word, typed);
  return false;
}

/**
 * Yazılan kelimenin `words` içindeki yeri: önce birebir (ya da çoğul) eşleşme aranır, yoksa tek bir yazım kaymasıyla
 * uyan kelime; hiçbiri ya da birden çoğu uyuyorsa `null`.
 */
export function matchWord(typed: string, words: readonly string[]): number | null {
  const t = normalizeWord(typed);
  if (!t) return null;
  const norm = words.map(normalizeWord);
  const exact = norm.flatMap((w, i) => (t === w || t === `${w}lar` || t === `${w}ler` ? [i] : []));
  if (exact.length) return exact.length === 1 ? exact[0] : null;
  const close = norm.flatMap((w, i) => (sameWord(t, w) ? [i] : []));
  return close.length === 1 ? close[0] : null;
}

/** Bir yazma kutusuna birden çok kelime yazıldıysa (boşluk, virgül, noktalı virgül ya da nokta ile) ayrı ayrı alınır. */
export function splitWords(text: string): string[] {
  return text
    .split(/[\s,;.]+/)
    .map((w) => w.trim())
    .filter((w) => normalizeWord(w).length > 0)
    .map((w) => w.slice(0, 30));
}

/** Hatırlama denemelerinin düzeni: önce ilk listenin denemeleri, sonra ikinci liste, sonra ilk liste yeniden (gösterilmeden). */
export type WordListRecallKind = { list: 'A' | 'B'; shown: boolean; trial: number };

export function wordListRecalls(task: Pick<WordListTask, 'learningTrials'>): WordListRecallKind[] {
  return [
    ...Array.from({ length: task.learningTrials }, (_, i) => ({ list: 'A' as const, shown: true, trial: i })),
    { list: 'B', shown: true, trial: 0 },
    { list: 'A', shown: false, trial: task.learningTrials },
  ];
}

/** Tanıma bölümündeki cevaplardan bu süreden (ms) kısa olanlar kelimeye bakmadan verilmiş olabilir. */
export const WORD_RECOGNITION_FAST_MS = 300;
