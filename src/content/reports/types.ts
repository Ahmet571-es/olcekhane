import type { Band } from '@/lib/instruments/types';

/** Bir ölçeğin bir düzeyi için rapor metinleri. */
export interface BandText {
  /** Kısa başlık: "Sosyal ve enerjik" gibi. */
  summary: string;
  /** Öğrenciye, ikinci tekil şahısla. */
  student: string;
  /** Veliye, çocuğu üçüncü şahısla anlatarak. */
  parent: string;
  tipsStudent: string[];
  tipsParent: string[];
  /** true ise raporda "destek almak için" kutusu gösterilir. */
  support?: boolean;
}

export type ScaleTexts = Partial<Record<Band, BandText>>;

export interface ReportTemplate {
  version: string;
  bandLabels: Partial<Record<Band, string>>;
  scales: Record<string, ScaleTexts>;
}
