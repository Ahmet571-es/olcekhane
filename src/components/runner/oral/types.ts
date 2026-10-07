import type { OralInput } from '@/lib/scoring/oral';

/** Sesli okuma için tarayıcıya gönderilen metin: soruların cevapları gönderilmez. */
export interface OralClientPassage {
  key: string;
  grade: number;
  genre: 'narrative' | 'informational';
  title: string;
  paragraphs: string[];
  words: number;
  questions: { key: string; text: string; options: { key: string; text: string }[] }[];
  ideas: { key: string; text: string; core: boolean }[];
}

export interface OralProsodyDimension {
  key: 'expression' | 'phrasing' | 'smoothness' | 'pace';
  name: string;
  question: string;
  /** Dört düzeyin yetişkine gösterilen tanımı (1'den 4'e). */
  levels: string[];
}

export type OralFinish = OralInput;
