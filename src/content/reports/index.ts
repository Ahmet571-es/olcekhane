import { besFaktorReport } from './bes-faktor';
import { calismaAliskanliklariReport } from './calisma-aliskanliklari';
import { meslekiIlgiReport } from './mesleki-ilgi';
import { okumaReport } from './okuma';
import { ozSaygiReport } from './oz-saygi';
import type { ReportTemplate } from './types';

export const REPORT_TEMPLATES: Record<string, ReportTemplate> = {
  'bes-faktor-kisilik': besFaktorReport,
  'oz-saygi': ozSaygiReport,
  'okuma-hizi-ve-anlama': okumaReport,
  'mesleki-ilgi-profili': meslekiIlgiReport,
  'calisma-aliskanliklari': calismaAliskanliklariReport,
  'dikkat-ve-bellek': { version: 'dikkat-bellek-rapor-1', bandLabels: {}, scales: {} },
  // Akademik tanı raporu ölçüt temellidir; düzey adları eyleme yöneliktir (neyin öncelikli olduğu).
  'matematik-tani-testi': {
    version: 'matematik-tani-rapor-1',
    bandLabels: { high: 'Sağlam', average: 'Pekiştirilmeli', low: 'Öncelikli' },
    scales: {},
  },
};
