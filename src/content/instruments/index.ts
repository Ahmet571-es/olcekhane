import type { InstrumentDef } from '@/lib/instruments/types';
import { onAltiFaktorKisilik } from './16-faktorlu-kisilik';
import { altiBoyutluKisilik } from './alti-boyutlu-kisilik';
import { ayrintiliKisilik } from './ayrintili-kisilik';
import { besFaktor } from './bes-faktor';
import { calismaAliskanliklari } from './calisma-aliskanliklari';
import { dikkatBellek } from './dikkat-bellek';
import { durGitGorevi } from './dur-git';
import { dusunmeyiSevme } from './dusunmeyi-sevme';
import { dusunmeVeCalismaTarzi } from './dusunme-ve-calisma-tarzi';
import { duygusalZekaBilesenleri } from './duygusal-zeka-bilesenleri';
import { geriyeDonukHatirlama } from './geriye-donuk-hatirlama';
import { harfIsaretleme } from './harf-isaretleme';
import { hizliKisilikTesti } from './hizli-kisilik-testi';
import { calismaDegerleri } from './calisma-degerleri';
import { hobiIlgileri } from './hobi-ilgileri';
import { empati } from './empati';
import { ozYeterlik } from './oz-yeterlik';
import { ozDenetim } from './oz-denetim';
import { merak } from './merak';
import { heyecanArayisi } from './heyecan-arayisi';
import { iyimserlik } from './iyimserlik';
import { kisilerarasiTarz } from './kisilerarasi-tarz';
import { kisiligin10Yonu } from './kisiligin-10-yonu';
import { matematik } from './matematik';
import { meslekIlgiAlanlari } from './meslek-ilgi-alanlari';
import { meslekiIlgi } from './mesleki-ilgi';
import { ogrenmeVeBasari } from './ogrenme-ve-basari';
import { cocukKisilik } from './cocuk-kisilik';
import { dersCalismaMotivasyonu } from './ders-calisma-motivasyonu';
import { ertelemeZamanYonetimi } from './erteleme-zaman-yonetimi';
import { zihniyet } from './zihniyet';
import { okumaHizi } from './okuma-hizi';
import { ozSaygi } from './oz-saygi';
import { renkKelimeGorevi } from './renk-kelime';
import { sayiDizileri } from './sayi-dizileri';
import { sekilAkilYurutme } from './sekil-akil-yurutme';
import { sesliOkuma } from './sesli-okuma';
import { sozelAkilYurutme } from './sozel-akil-yurutme';
import { kagitKatlama } from './kagit-katlama';
import { mantiksalAkilYurutme } from './mantiksal-akil-yurutme';
import { sayisalAkilYurutme } from './sayisal-akil-yurutme';
import { zihindenHesaplama } from './zihinden-hesaplama';
import { kupAcinimi } from './kup-acinimi';
import { ucBoyutluZihindeDondurme } from './uc-boyutlu-zihinde-dondurme';
import { bakisAcisiAlma } from './bakis-acisi-alma';
import { gizliSekiller } from './gizli-sekiller';
import { sekilBenzetmeleri } from './sekil-benzetmeleri';
import { desenHatirlama } from './desen-hatirlama';
import { harfSayiSiralama } from './harf-sayi-siralama';
import { simgeBulma } from './simge-bulma';
import { harfDizileri } from './harf-dizileri';
import { dusunerekKararVerme } from './dusunerek-karar-verme';
import { planlamaKuleGorevi } from './planlama-kule-gorevi';
import { kelimeBilgisi } from './kelime-bilgisi';
import { kelimeListesi } from './kelime-listesi';
import { hesaplaVeHatirla } from './hesapla-ve-hatirla';
import { kuralDegistirme } from './kural-degistirme';
import { siraylaBirlestirme } from './sirayla-birlestirme';
import { tepkiHizi } from './tepki-hizi';
import { zihindeDondurme } from './zihinde-dondurme';

/** Platformdaki tüm test tanımları. Sıralama katalogdaki varsayılan sıradır. */
export const INSTRUMENTS: InstrumentDef[] = [
  besFaktor,
  hizliKisilikTesti,
  ayrintiliKisilik,
  kisiligin10Yonu,
  altiBoyutluKisilik,
  ozSaygi,
  meslekiIlgi,
  meslekIlgiAlanlari,
  calismaAliskanliklari,
  sesliOkuma,
  okumaHizi,
  matematik,
  dikkatBellek,
  harfIsaretleme,
  renkKelimeGorevi,
  durGitGorevi,
  siraylaBirlestirme,
  geriyeDonukHatirlama,
  zihindeDondurme,
  tepkiHizi,
  sekilAkilYurutme,
  sayiDizileri,
  sozelAkilYurutme,
  kagitKatlama,
  mantiksalAkilYurutme,
  sayisalAkilYurutme,
  zihindenHesaplama,
  kupAcinimi,
  ucBoyutluZihindeDondurme,
  bakisAcisiAlma,
  gizliSekiller,
  sekilBenzetmeleri,
  desenHatirlama,
  harfDizileri,
  dusunerekKararVerme,
  planlamaKuleGorevi,
  kelimeBilgisi,
  kuralDegistirme,
  kelimeListesi,
  hesaplaVeHatirla,
  duygusalZekaBilesenleri,
  kisilerarasiTarz,
  onAltiFaktorKisilik,
  ogrenmeVeBasari,
  dusunmeyiSevme,
  dusunmeVeCalismaTarzi,
  heyecanArayisi,
  iyimserlik,
  empati,
  ozYeterlik,
  ozDenetim,
  merak,
  harfSayiSiralama,
  simgeBulma,
  cocukKisilik,
  dersCalismaMotivasyonu,
  ertelemeZamanYonetimi,
  zihniyet,
  hobiIlgileri,
  calismaDegerleri,
].sort((a, b) => a.sortOrder - b.sortOrder);

export function getInstrumentDef(slug: string): InstrumentDef | undefined {
  return INSTRUMENTS.find((i) => i.slug === slug);
}

/** Yayındaki testler: katalogda, site haritasında ve altbilgide görünür. */
export function publicInstruments(): InstrumentDef[] {
  return INSTRUMENTS.filter((i) => i.status === 'active' || i.status === 'pilot');
}

/**
 * Çözülebilen testler: yayındakiler ve uzman incelemesindekiler. İncelemedeki bir test yalnızca doğrudan
 * bağlantıyla açılır (hocanın denemesi için); hiçbir listede yer almaz ve arama motorlarına kapalıdır.
 */
export function solvableInstruments(): InstrumentDef[] {
  return INSTRUMENTS.filter((i) => i.status === 'active' || i.status === 'pilot' || i.status === 'review');
}

export function isSolvable(def: InstrumentDef | undefined): def is InstrumentDef {
  return !!def && (def.status === 'active' || def.status === 'pilot' || def.status === 'review');
}
