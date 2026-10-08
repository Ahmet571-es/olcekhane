import type { VerbalItem, VerbalItemType } from './types';

/**
 * Sözel akıl yürütme sorularında sorunun üstünde gösterilen yönerge (sıralama sorularında sorunun kendi sorusu
 * gösterilir). Mantıksal çıkarımda yönerge bilgilerin üstünde, soru altında durur: bilgiler gerçeğe uymasa bile doğru
 * kabul edilir ve yalnızca bu bilgiler kullanılır.
 */
export const VERBAL_PROMPTS: Record<Exclude<VerbalItemType, 'ordering'>, { lead: string; question?: string }> = {
  analogy: { lead: 'İlk iki kelime arasındaki ilişkiyi bul. Üçüncü kelimeyle aynı ilişkiyi kuran kelimeyi seç.' },
  classification: { lead: 'Bu üçünün ortak bir özelliği var. Seçeneklerden yalnızca biri de bu özelliği taşıyor; onu seç.' },
  deduction: {
    lead: 'Aşağıdaki bilgileri, gerçekte öyle olmasa bile doğru kabul et. Gerçek hayatta bildiklerini değil, yalnızca bu bilgileri kullan.',
    question: 'Bu bilgilere göre hangisi kesinlikle doğrudur?',
  },
};

/** Soru türlerinin adları (soru ekranında ve raporda). */
export const VERBAL_TYPE_NAMES: Record<VerbalItemType, string> = {
  analogy: 'Kelime ilişkileri',
  classification: 'Sınıflama',
  ordering: 'Sıralama',
  deduction: 'Mantıksal çıkarım',
};

/** Seçeneklerin harfleri. */
export const VERBAL_LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Sıralama sorularında, bilgiler cevabı bulmaya yetmediğinde seçilen seçenek. */
export const VERBAL_UNKNOWN = 'Bu bilgilerle bilinemez';

/** Sorunun ekranda okunan sözcükleri: bilgiler ya da kelimeler, soru ve seçenekler. */
export function verbalWords(item: VerbalItem): number {
  return [...item.stem, item.question ?? '', ...item.options].join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Bu süreden (ms) kısa cevaplar "çok hızlı" sayılır: soru ve seçenekler okunmadan seçilmiş olabilir. Süre sorunun
 * uzunluğuna göre artar: 1,5 saniyeye her sözcük için 75 ms eklenir (dakikada 800 sözcük; çok hızlı bir göz gezdirmenin
 * de üstünde bir hız). Kısa kelime sorularında yaklaşık 2 saniye, uzun sıralama sorularında yaklaşık 7 saniyedir.
 */
export const verbalRapidMs = (item: VerbalItem) => 1500 + 75 * verbalWords(item);
