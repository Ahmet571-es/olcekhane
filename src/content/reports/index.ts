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
};
