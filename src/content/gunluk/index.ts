import { besFaktorDaily } from './bes-faktor-kisilik';
import { empatiDaily } from './empati';
import { iyimserlikDaily } from './iyimserlik';
import { matematikDaily } from './matematik-konu-tarama-testi';
import { merakDaily } from './merak';
import { okumaHiziDaily } from './okuma-hizi-ve-anlama';
import { ozSaygiDaily } from './oz-saygi';
import { ozYeterlikDaily } from './oz-yeterlik';
import { sekilAkilYurutmeDaily } from './sekil-akil-yurutme';
import { sesliOkumaDaily } from './sesli-okuma-degerlendirmesi';
import { simgeBulmaDaily } from './simge-bulma';
import type { DailyContent } from './types';

/**
 * "Günlük hayatta nasıl görünür" metinlerinin kaydı: anahtar testin adresi (dosyanın adı da odur). Bir test buraya girince
 * raporunda bölüm görünür; tests/gunluk-hayat.test.ts metnin eksiksiz olduğunu ve testin `DAILY_PENDING` listesinden
 * çıktığını denetler. Ayrıntı ve yazarın denetim listesi: ./types.ts.
 */
export const DAILY: Record<string, DailyContent> = {
  merak: merakDaily,
  'bes-faktor-kisilik': besFaktorDaily,
  'simge-bulma': simgeBulmaDaily,
  'sekil-akil-yurutme': sekilAkilYurutmeDaily,
  'okuma-hizi-ve-anlama': okumaHiziDaily,
  'matematik-konu-tarama-testi': matematikDaily,
  'sesli-okuma-degerlendirmesi': sesliOkumaDaily,
  iyimserlik: iyimserlikDaily,
  'oz-saygi': ozSaygiDaily,
  empati: empatiDaily,
  'oz-yeterlik': ozYeterlikDaily,
};
