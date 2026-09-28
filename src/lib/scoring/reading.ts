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
  /** Anlayarak okuma hızı: dakikada kelime × anlama oranı. */
  effectiveWpm: number;
  band: Band;
  skills: Record<ReadingQuestion['skill'], { correct: number; total: number }>;
  flags: { tooFast: boolean; notes: string[] };
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
  // Sessiz okumada dakikada 600 kelimenin üzeri, metnin göz gezdirilerek geçildiğini düşündürür.
  const tooFast = wpm > 600;
  if (tooFast) notes.push('Metin çok hızlı geçilmiş; anlamaya yetecek kadar okunmamış olabilir.');
  return {
    passageKey: passage.key,
    wordCount,
    readingMs: Math.round(readingMs),
    wpm: round(wpm, 0),
    correct,
    total,
    comprehensionPct: round(comprehension * 100, 0),
    effectiveWpm: round(wpm * comprehension, 0),
    band: comprehensionBand(correct, total),
    skills,
    flags: { tooFast, notes },
  };
}
