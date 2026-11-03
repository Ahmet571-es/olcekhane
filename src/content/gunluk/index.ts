import { bakisAcisiAlmaDaily } from './bakis-acisi-alma';
import { besFaktorDaily } from './bes-faktor-kisilik';
import { calismaAliskanliklariDaily } from './calisma-aliskanliklari';
import { calismaDegerleriDaily } from './calisma-degerleri';
import { dersCalismaMotivasyonuDaily } from './ders-calisma-motivasyonu';
import { desenDaily } from './desen-hatirlama';
import { dikkatBellekDaily } from './dikkat-ve-bellek';
import { durGitDaily } from './dur-git-gorevi';
import { dusunerekKararVermeDaily } from './dusunerek-karar-verme';
import { dusunmeVeCalismaTarziDaily } from './dusunme-ve-calisma-tarzi';
import { dusunmeyiSevmeDaily } from './dusunmeyi-sevme-olcegi';
import { duygusalZekaBilesenleriDaily } from './duygusal-zeka-bilesenleri';
import { empatiDaily } from './empati';
import { ertelemeZamanYonetimiDaily } from './erteleme-ve-zaman-yonetimi';
import { geriyeDonukDaily } from './geriye-donuk-hatirlama';
import { gizliSekillerDaily } from './gizli-sekiller';
import { harfDizileriDaily } from './harf-dizileri';
import { harfSayiDaily } from './harf-sayi-siralama';
import { hesaplaDaily } from './hesapla-ve-hatirla';
import { hobiIlgileriDaily } from './hobi-ve-serbest-zaman-ilgileri';
import { iyimserlikDaily } from './iyimserlik';
import { kagitKatlamaDaily } from './kagit-katlama';
import { kelimeBilgisiDaily } from './kelime-bilgisi';
import { kelimeListesiDaily } from './kelime-listesi-hatirlama';
import { kupAcinimiDaily } from './kup-acinimi';
import { kuralDegistirmeDaily } from './kural-degistirme';
import { mantiksalAkilYurutmeDaily } from './mantiksal-akil-yurutme';
import { matematikDaily } from './matematik-konu-tarama-testi';
import { merakDaily } from './merak';
import { meslekIlgiAlanlariDaily } from './meslek-ilgi-alanlari';
import { meslekiIlgiDaily } from './mesleki-ilgi-profili';
import { ogrenmeVeBasariDaily } from './ogrenme-ve-basari-ozellikleri';
import { okumaHiziDaily } from './okuma-hizi-ve-anlama';
import { ozDenetimDaily } from './oz-denetim';
import { ozSaygiDaily } from './oz-saygi';
import { ozYeterlikDaily } from './oz-yeterlik';
import { parcalardanSekilDaily } from './parcalardan-sekil';
import { kuleDaily } from './planlama-kule-gorevi';
import { renkKelimeDaily } from './renk-kelime-gorevi';
import { sayiDizileriDaily } from './sayi-dizileri';
import { sayisalAkilYurutmeDaily } from './sayisal-akil-yurutme';
import { sekilAkilYurutmeDaily } from './sekil-akil-yurutme';
import { sekilBenzetmeleriDaily } from './sekil-benzetmeleri';
import { sesliOkumaDaily } from './sesli-okuma-degerlendirmesi';
import { simgeBulmaDaily } from './simge-bulma';
import { siraylaDaily } from './sirayla-birlestirme-gorevi';
import { sozelAkilYurutmeDaily } from './sozel-akil-yurutme';
import { surekliDikkatDaily } from './surekli-dikkat';
import { tepkiHiziDaily } from './tepki-hizi';
import { zihindeDondurmeDaily } from './zihinde-dondurme';
import { zihniyetDaily } from './zihniyet';
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
  'ogrenme-ve-basari-ozellikleri': ogrenmeVeBasariDaily,
  'dusunmeyi-sevme-olcegi': dusunmeyiSevmeDaily,
  'dusunme-ve-calisma-tarzi': dusunmeVeCalismaTarziDaily,
  'calisma-aliskanliklari': calismaAliskanliklariDaily,
  'ders-calisma-motivasyonu': dersCalismaMotivasyonuDaily,
  'erteleme-ve-zaman-yonetimi': ertelemeZamanYonetimiDaily,
  'zihniyet': zihniyetDaily,
  'planlama-kule-gorevi': kuleDaily,
  'dikkat-ve-bellek': dikkatBellekDaily,
  'surekli-dikkat': surekliDikkatDaily,
  'renk-kelime-gorevi': renkKelimeDaily,
  'dur-git-gorevi': durGitDaily,
  'sirayla-birlestirme-gorevi': siraylaDaily,
  'geriye-donuk-hatirlama': geriyeDonukDaily,
  'hesapla-ve-hatirla': hesaplaDaily,
  'harf-sayi-siralama': harfSayiDaily,
  'desen-hatirlama': desenDaily,
  'kelime-listesi-hatirlama': kelimeListesiDaily,
  'zihinde-dondurme': zihindeDondurmeDaily,
  'tepki-hizi': tepkiHiziDaily,
  'kural-degistirme': kuralDegistirmeDaily,
  'mesleki-ilgi-profili': meslekiIlgiDaily,
  'meslek-ilgi-alanlari': meslekIlgiAlanlariDaily,
  'calisma-degerleri': calismaDegerleriDaily,
  'hobi-ve-serbest-zaman-ilgileri': hobiIlgileriDaily,
};
