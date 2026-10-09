import { onAltiFaktorKisilikReport } from './16-faktorlu-kisilik';
import { altiBoyutluKisilikReport } from './alti-boyutlu-kisilik';
import { ayrintiliKisilikReport } from './ayrintili-kisilik';
import { besFaktorReport } from './bes-faktor';
import { calismaAliskanliklariReport } from './calisma-aliskanliklari';
import { duygusalZekaBilesenleriReport } from './duygusal-zeka-bilesenleri';
import { calismaDegerleriReport } from './calisma-degerleri';
import { hobiIlgileriReport } from './hobi-ilgileri';
import { kisilerarasiTarzReport } from './kisilerarasi-tarz';
import { meslekIlgiAlanlariReport } from './meslek-ilgi-alanlari';
import { meslekiIlgiReport } from './mesleki-ilgi';
import { ogrenmeVeBasariReport } from './ogrenme-ve-basari';
import { cocukKisilikReport } from './cocuk-kisilik';
import { dersCalismaMotivasyonuReport } from './ders-calisma-motivasyonu';
import { ertelemeZamanYonetimiReport } from './erteleme-zaman-yonetimi';
import { zihniyetReport } from './zihniyet';
import { okumaReport } from './okuma';
import { ozSaygiReport } from './oz-saygi';
import type { ReportTemplate } from './types';

export const REPORT_TEMPLATES: Record<string, ReportTemplate> = {
  'bes-faktor-kisilik': besFaktorReport,
  'ayrintili-kisilik-profili': ayrintiliKisilikReport,
  'alti-boyutlu-kisilik-profili': altiBoyutluKisilikReport,
  'oz-saygi': ozSaygiReport,
  'okuma-hizi-ve-anlama': okumaReport,
  'mesleki-ilgi-profili': meslekiIlgiReport,
  'meslek-ilgi-alanlari': meslekIlgiAlanlariReport,
  'calisma-aliskanliklari': calismaAliskanliklariReport,
  'duygusal-zeka-bilesenleri': duygusalZekaBilesenleriReport,
  'kisilerarasi-tarz': kisilerarasiTarzReport,
  '16-faktorlu-kisilik-profili': onAltiFaktorKisilikReport,
  'ogrenme-ve-basari-ozellikleri': ogrenmeVeBasariReport,
  'cocuk-kisilik-profili': cocukKisilikReport,
  'ders-calisma-motivasyonu': dersCalismaMotivasyonuReport,
  'erteleme-ve-zaman-yonetimi': ertelemeZamanYonetimiReport,
  zihniyet: zihniyetReport,
  'hobi-ve-serbest-zaman-ilgileri': hobiIlgileriReport,
  'calisma-degerleri': calismaDegerleriReport,
  'dikkat-ve-bellek': { version: 'dikkat-bellek-rapor-1', bandLabels: {}, scales: {} },
  'surekli-dikkat': { version: 'surekli-dikkat-rapor-1', bandLabels: {}, scales: {} },
  // Görev raporlarının metinleri kod içindedir (lib/reports/build.ts); burada yalnızca sürümleri tutulur.
  'renk-kelime-gorevi': { version: 'renk-kelime-rapor-1', bandLabels: {}, scales: {} },
  'dur-git-gorevi': { version: 'dur-git-rapor-1', bandLabels: {}, scales: {} },
  'sirayla-birlestirme-gorevi': { version: 'sirayla-birlestirme-rapor-1', bandLabels: {}, scales: {} },
  'geriye-donuk-hatirlama': { version: 'geriye-donuk-hatirlama-rapor-1', bandLabels: {}, scales: {} },
  'zihinde-dondurme': { version: 'zihinde-dondurme-rapor-1', bandLabels: {}, scales: {} },
  'tepki-hizi': { version: 'tepki-hizi-rapor-1', bandLabels: {}, scales: {} },
  'sekil-akil-yurutme': { version: 'sekil-akil-yurutme-rapor-1', bandLabels: {}, scales: {} },
  'sayi-dizileri': { version: 'sayi-dizileri-rapor-1', bandLabels: {}, scales: {} },
  'sozel-akil-yurutme': { version: 'sozel-akil-yurutme-rapor-1', bandLabels: {}, scales: {} },
  'kagit-katlama': { version: 'kagit-katlama-rapor-1', bandLabels: {}, scales: {} },
  'mantiksal-akil-yurutme': { version: 'mantiksal-akil-yurutme-rapor-1', bandLabels: {}, scales: {} },
  'sayisal-akil-yurutme': { version: 'sayisal-akil-yurutme-rapor-1', bandLabels: {}, scales: {} },
  'kup-acinimi': { version: 'kup-acinimi-rapor-1', bandLabels: {}, scales: {} },
  'kelime-bilgisi': { version: 'kelime-bilgisi-rapor-1', bandLabels: {}, scales: {} },
  'kural-degistirme': { version: 'kural-degistirme-rapor-1', bandLabels: {}, scales: {} },
  'kelime-listesi-hatirlama': { version: 'kelime-listesi-rapor-1', bandLabels: {}, scales: {} },
  // Akademik konu tarama raporu ölçüt temellidir; düzey adları eyleme yöneliktir (neyin öncelikli olduğu).
  'matematik-konu-tarama-testi': {
    version: 'matematik-konu-tarama-rapor-1',
    bandLabels: { high: 'Sağlam', average: 'Pekiştirilmeli', low: 'Öncelikli' },
    scales: {},
  },
};
