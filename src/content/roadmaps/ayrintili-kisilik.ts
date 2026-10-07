import { besFaktorReport } from '@/content/reports/bes-faktor';
import { besFaktorRoadmap as bf } from './bes-faktor';
import type { BandGroup, RoadmapTemplate } from './types';

/**
 * Ayrıntılı Kişilik Profili: gelişim yol haritası. Beş boyut Beş Faktör Kişilik Profili ile aynıdır; hocanın
 * onayladığı Beş Faktör yol haritası metinleri olduğu gibi kullanılır (Deneyime Açıklık için Merak ve Hayal Gücü
 * metinleri). Bu testin rapor şablonunda veli önerileri yazılmadığından veliye yaklaşım önerileri de Beş Faktör
 * raporundaki veli önerilerinin ilkidir. Yol haritası boyutlarla kurulur; alt özellikler kullanılmaz.
 */
const parentTip = (key: string): Record<BandGroup, string> => ({
  low: besFaktorReport.scales[key].low!.tipsParent[0],
  average: besFaktorReport.scales[key].average!.tipsParent[0],
  high: besFaktorReport.scales[key].high!.tipsParent[0],
});

export const ayrintiliKisilikRoadmap: RoadmapTemplate = {
  ...bf,
  version: 'ayrintili-kisilik-yol-haritasi-1',
  scales: {
    extraversion: bf.scales.extraversion,
    agreeableness: bf.scales.agreeableness,
    conscientiousness: bf.scales.conscientiousness,
    emotional_stability: bf.scales.emotional_stability,
    openness: bf.scales.intellect,
  },
  approach: {
    extraversion: parentTip('extraversion'),
    agreeableness: parentTip('agreeableness'),
    conscientiousness: parentTip('conscientiousness'),
    emotional_stability: parentTip('emotional_stability'),
    openness: parentTip('intellect'),
  },
};
