import { bakisAcisiAlmaDaily } from './bakis-acisi-alma';
import { besFaktorDaily } from './bes-faktor-kisilik';
import { dusunerekKararVermeDaily } from './dusunerek-karar-verme';
import { duygusalZekaBilesenleriDaily } from './duygusal-zeka-bilesenleri';
import { empatiDaily } from './empati';
import { gizliSekillerDaily } from './gizli-sekiller';
import { harfDizileriDaily } from './harf-dizileri';
import { iyimserlikDaily } from './iyimserlik';
import { kagitKatlamaDaily } from './kagit-katlama';
import { kelimeBilgisiDaily } from './kelime-bilgisi';
import { kupAcinimiDaily } from './kup-acinimi';
import { mantiksalAkilYurutmeDaily } from './mantiksal-akil-yurutme';
import { matematikDaily } from './matematik-konu-tarama-testi';
import { merakDaily } from './merak';
import { okumaHiziDaily } from './okuma-hizi-ve-anlama';
import { ozDenetimDaily } from './oz-denetim';
import { ozSaygiDaily } from './oz-saygi';
import { ozYeterlikDaily } from './oz-yeterlik';
import { parcalardanSekilDaily } from './parcalardan-sekil';
import { sayiDizileriDaily } from './sayi-dizileri';
import { sayisalAkilYurutmeDaily } from './sayisal-akil-yurutme';
import { sekilAkilYurutmeDaily } from './sekil-akil-yurutme';
import { sekilBenzetmeleriDaily } from './sekil-benzetmeleri';
import { sesliOkumaDaily } from './sesli-okuma-degerlendirmesi';
import { simgeBulmaDaily } from './simge-bulma';
import { sozelAkilYurutmeDaily } from './sozel-akil-yurutme';
import type { DailyContent } from './types';
import { ucBoyutluZihindeDondurmeDaily } from './uc-boyutlu-zihinde-dondurme';
import { zihindenHesaplamaDaily } from './zihinden-hesaplama-hizi';

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
  'oz-denetim': ozDenetimDaily,
  'duygusal-zeka-bilesenleri': duygusalZekaBilesenleriDaily,
  'sekil-benzetmeleri': sekilBenzetmeleriDaily,
  'sayi-dizileri': sayiDizileriDaily,
  'harf-dizileri': harfDizileriDaily,
  'sozel-akil-yurutme': sozelAkilYurutmeDaily,
  'mantiksal-akil-yurutme': mantiksalAkilYurutmeDaily,
  'kagit-katlama': kagitKatlamaDaily,
  'sayisal-akil-yurutme': sayisalAkilYurutmeDaily,
  'zihinden-hesaplama-hizi': zihindenHesaplamaDaily,
  'kup-acinimi': kupAcinimiDaily,
  'parcalardan-sekil': parcalardanSekilDaily,
  'uc-boyutlu-zihinde-dondurme': ucBoyutluZihindeDondurmeDaily,
  'bakis-acisi-alma': bakisAcisiAlmaDaily,
  'gizli-sekiller': gizliSekillerDaily,
  'dusunerek-karar-verme': dusunerekKararVermeDaily,
  'kelime-bilgisi': kelimeBilgisiDaily,
};
