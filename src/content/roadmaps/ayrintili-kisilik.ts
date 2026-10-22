import { besFaktorReport } from '@/content/reports/bes-faktor';
import { besFaktorRoadmap as bf } from './bes-faktor';
import type { BandGroup, RoadmapTemplate } from './types';

/**
 * Ayrıntılı Kişilik Profili: gelişim yol haritası. Beş boyut Beş Faktör Kişilik Profili ile aynıdır; hocanın
 * onayladığı Beş Faktör yol haritası metinleri olduğu gibi kullanılır (Deneyime Açıklık için Merak ve Hayal Gücü
 * metinleri). Bu testin rapor şablonunda veli önerileri yazılmadığından veliye yaklaşım önerileri de Beş Faktör
 * raporundaki veli önerilerinin ilkidir. Yol haritası boyutlarla kurulur; alt özellikler kullanılmaz.
 *
 * Alt özellikleri ayrışan bir boyutta (rapor şablonu: facetSplit) öneriler orta düzeyinkilerdir. Bu yüzden Dışadönüklük
 * ve Uyumluluk'ta veliye yaklaşımın orta düzeyi Beş Faktör'deki gibi "bu dengeyi" demez: o boyutun kartı ayrışmada bir
 * dengeden söz etmez.
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
    extraversion: {
      ...parentTip('extraversion'),
      average: 'Hem grup hem de bireysel etkinliklere yer açmak, farklı ortamlarda rahat edebilmesini destekler.',
    },
    agreeableness: {
      ...parentTip('agreeableness'),
      average: 'Farklı görüşleri rahatça konuşabildiğiniz aile sohbetleri, hem kendi görüşünü söylemesini hem de başkalarını dinlemesini destekler.',
    },
    conscientiousness: parentTip('conscientiousness'),
    emotional_stability: parentTip('emotional_stability'),
    openness: parentTip('intellect'),
  },
};
