import type { ReportTemplate } from './types';

/**
 * Mesleki İlgi Profili raporu alan açıklamalarını src/content/careers/riasec.ts dosyasından alır;
 * burada yalnızca düzey etiketleri tanımlanır.
 */
export const meslekiIlgiReport: ReportTemplate = {
  version: 'mesleki-ilgi-rapor-1',
  bandLabels: {
    very_low: 'Çok düşük ilgi',
    low: 'Düşük ilgi',
    average: 'Orta düzeyde ilgi',
    high: 'Yüksek ilgi',
    very_high: 'Çok yüksek ilgi',
  },
  scales: {},
};
