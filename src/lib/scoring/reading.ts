import type { Band, ReadingInstrument, ReadingPassage, ReadingQuestion } from '@/lib/instruments/types';
import { round } from './stats';

export interface ReadingResult {
  passageKey: string;
  wordCount: number;
  readingMs: number;
  wpm: number;
  correct: number;
  total: number;
  comprehensionPct: number;
  /**
   * Anlayarak okuma hızı: dakikada kelime × şansla düzeltilmiş anlama oranı ((doğru − yanlış ÷ 3) ÷ soru; dört seçenekte
   * tahminle beklenen doğrular çıkarılır). Yalnızca anlama en az 6/8 ve süre güvenilirken hesaplanır; yoksa null
   * (göz gezdirip tahminle cevaplayan, dikkatle okuyandan yüksek görünmesin).
   */
  effectiveWpm: number | null;
  band: Band;
  skills: Record<ReadingQuestion['skill'], { correct: number; total: number }>;
  /** Okuma hızı metnin sınıf düzeyine göre: belirgin hızlı, belirgin yavaş ya da ikisi arası (bkz. READING_PACE). */
  pace: 'fast' | 'slow' | 'ok';
  flags: { tooFast: boolean; tooSlow: boolean; notes: string[] };
}

/**
 * Sessiz okuma hızı sınırları (dakikada kelime), metnin sınıf düzeyine göre (metnin en küçük sınıfı). Türkiye'de sessiz
 * okuma için yayımlanmış bir norm olmadığından bunlar Ölçekhane'nin pilot ölçütüdür; sesli okuma ortalamaları (Erden ve
 * ark., 2002: 3. sınıf 91, 5. sınıf 121 doğru kelime) ve yetişkinlerin sessiz okuma hızı (Brysbaert, 2019: İngilizce kurgu
 * dışı metinde ~238) göz önünde tutularak konuldu. `max`: bunun üstü göz gezdirme sayılır, hız yorumlanmaz; `fast`: anlama
 * zayıfken "yavaşla ve anla" önerilir; `slow`: anlama iyi olsa da akıcılık çalışması önerilir.
 */
export const READING_PACE: { minGrade: number; slow: number; fast: number; max: number }[] = [
  { minGrade: 3, slow: 60, fast: 150, max: 300 },
  { minGrade: 5, slow: 80, fast: 180, max: 350 },
  { minGrade: 7, slow: 100, fast: 210, max: 400 },
  { minGrade: 9, slow: 120, fast: 250, max: 450 },
];
/** Bundan yavaşı (dakikada kelime) okurken uzun bir ara verildiğini düşündürür: hız yorumlanmaz. */
export const READING_TOO_SLOW = 15;
/** "Anlayarak okuma" en az bu kadar doğruda hesaplanır (8 soruda 6). */
export const EFFECTIVE_MIN_RATIO = 0.75;

export function readingPace(passage: Pick<ReadingPassage, 'minGrade'>) {
  return [...READING_PACE].reverse().find((x) => passage.minGrade >= x.minGrade) ?? READING_PACE[0];
}

/** Türkçe metinde kelime sayımı: boşluklarla ayrılmış ve en az bir harf ya da rakam içeren parçalar. */
export function countWords(paragraphs: string[]): number {
  return paragraphs
    .join(' ')
    .split(/\s+/)
    .filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

/** Öğrencinin sınıf düzeyine uygun metni seçer. 13 = mezun, lise metnini okur. */
export function passageForGrade(def: ReadingInstrument, grade: number): ReadingPassage {
  const g = Math.min(Math.max(grade, def.minGrade), def.maxGrade);
  return def.passages.find((p) => g >= p.minGrade && g <= p.maxGrade) ?? def.passages[def.passages.length - 1];
}

/** 8 soruda doğru sayısına göre anlama düzeyi. */
export function comprehensionBand(correct: number, total: number): Band {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio >= 0.999) return 'very_high';
  if (ratio >= 0.75) return 'high';
  if (ratio >= 0.5) return 'average';
  return 'low';
}

export function scoreReading(
  passage: ReadingPassage,
  readingMs: number,
  answers: Record<string, string>,
): ReadingResult {
  const wordCount = countWords(passage.paragraphs);
  const minutes = Math.max(readingMs, 1000) / 60000;
  const wpm = wordCount / minutes;
  const skills: ReadingResult['skills'] = {
    literal: { correct: 0, total: 0 },
    inference: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    main_idea: { correct: 0, total: 0 },
  };
  let correct = 0;
  for (const q of passage.questions) {
    skills[q.skill].total += 1;
    if (answers[q.key] === q.answer) {
      correct += 1;
      skills[q.skill].correct += 1;
    }
  }
  const total = passage.questions.length;
  const comprehension = total ? correct / total : 0;
  const notes: string[] = [];
  const limits = readingPace(passage);
  // Metnin sınıf düzeyine göre çok yüksek bir hız, metnin göz gezdirilerek geçildiğini düşündürür.
  const tooFast = wpm > limits.max;
  if (tooFast) notes.push('Metin çok hızlı geçilmiş; anlamaya yetecek kadar okunmamış olabilir.');
  const tooSlow = !tooFast && wpm < READING_TOO_SLOW;
  if (tooSlow) notes.push('Okuma süresi çok uzun ölçüldü: okurken ara verilmiş olabilir ya da metni okumak uzun sürmüş olabilir. Okuma hızı yorumlanmadı.');
  // Metin çok kısa sürede geçildiği hâlde soruların çoğu doğruysa sonuç metni anlamaktan çok önceki bilgiyi gösterebilir.
  if (tooFast && comprehension >= EFFECTIVE_MIN_RATIO - 1e-9) {
    notes.push('Metin çok kısa sürede geçildiği hâlde soruların çoğu doğru cevaplandı. Konu önceden biliniyor olabilir; bu yüzden anlama sonucu, metni anlamaktan çok önceki bilgiyi gösterebilir.');
  }
  if (total > 0 && correct === 0) notes.push('Hiçbir soru doğru cevaplanmadı. Sorular dikkatle okunmadan işaretlenmiş olabilir.');
  // Şansla düzeltilmiş anlama oranı: dört seçenekte her üç yanlışa karşılık bir doğru tahminle gelmiş sayılır.
  const wrong = total - correct;
  const corrected = total ? Math.max(0, correct - wrong / 3) / total : 0;
  const effectiveWpm = !tooFast && !tooSlow && comprehension >= EFFECTIVE_MIN_RATIO - 1e-9 ? round(wpm * corrected, 0) : null;
  return {
    passageKey: passage.key,
    wordCount,
    readingMs: Math.round(readingMs),
    wpm: round(wpm, 0),
    correct,
    total,
    comprehensionPct: round(comprehension * 100, 0),
    effectiveWpm,
    band: comprehensionBand(correct, total),
    skills,
    pace: wpm >= limits.fast ? 'fast' : wpm < limits.slow ? 'slow' : 'ok',
    flags: { tooFast, tooSlow, notes },
  };
}
