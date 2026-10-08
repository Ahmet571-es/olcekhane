import type { VocabularyItem, VocabularyType } from './types';

/** Kelime bilgisi soru türlerinin adları (soru ekranında ve raporda). */
export const VOCABULARY_TYPE_NAMES: Record<VocabularyType, string> = {
  synonym: 'Eş anlam',
  antonym: 'Zıt anlam',
  context: 'Cümlede anlam',
  idiom: 'Deyimler',
};

/** Sorunun sorusu: kelimenin ya da deyimin sözlükteki biçimiyle. */
export function vocabularyQuestion(item: Pick<VocabularyItem, 'type' | 'lemma'>): string {
  switch (item.type) {
    case 'synonym':
      return `“${item.lemma}” kelimesine anlamca en yakın kelime hangisidir?`;
    case 'antonym':
      return `“${item.lemma}” kelimesinin zıt anlamlısı hangisidir?`;
    case 'context':
      return `Bu cümlede “${item.lemma}” kelimesi hangi anlamda kullanılmıştır?`;
    case 'idiom':
      return `Bu cümlede “${item.lemma}” deyimi hangi anlamda kullanılmıştır?`;
  }
}

/** Sorunun ekranda okunan sözcükleri: kelime ya da cümle, soru ve seçenekler. */
export function vocabularyWords(item: VocabularyItem): number {
  return [item.type === 'synonym' || item.type === 'antonym' ? '' : item.stem, vocabularyQuestion(item), ...item.options].join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Bu süreden (ms) kısa yanlış cevaplar "çok hızlı" sayılır: soru ve seçenekler okunmadan seçilmiş olabilir. Sözel akıl
 * yürütmedeki gibi 1,5 saniyeye her sözcük için 75 ms eklenir (dakikada 800 sözcük; çok hızlı bir göz gezdirmenin de
 * üstünde bir hız). Tek kelimelik sorularda yaklaşık 2,5, uzun cümleli deyim sorularında yaklaşık 4 saniyedir.
 */
export const vocabularyRapidMs = (item: VocabularyItem) => 1500 + 75 * vocabularyWords(item);
