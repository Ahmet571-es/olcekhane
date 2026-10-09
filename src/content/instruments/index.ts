import type { InstrumentDef } from '@/lib/instruments/types';
import { onAltiFaktorKisilik } from './16-faktorlu-kisilik';
import { altiBoyutluKisilik } from './alti-boyutlu-kisilik';
import { ayrintiliKisilik } from './ayrintili-kisilik';
import { besFaktor } from './bes-faktor';
import { calismaAliskanliklari } from './calisma-aliskanliklari';
import { dikkatBellek } from './dikkat-bellek';
import { durGitGorevi } from './dur-git';
import { duygusalZekaBilesenleri } from './duygusal-zeka-bilesenleri';
import { geriyeDonukHatirlama } from './geriye-donuk-hatirlama';
import { harfIsaretleme } from './harf-isaretleme';
import { calismaDegerleri } from './calisma-degerleri';
import { hobiIlgileri } from './hobi-ilgileri';
import { kisilerarasiTarz } from './kisilerarasi-tarz';
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
import { kelimeBilgisi } from './kelime-bilgisi';
import { kelimeListesi } from './kelime-listesi';
import { kuralDegistirme } from './kural-degistirme';
import { siraylaBirlestirme } from './sirayla-birlestirme';
import { tepkiHizi } from './tepki-hizi';
import { zihindeDondurme } from './zihinde-dondurme';

/** Platformdaki tüm test tanımları. Sıralama katalogdaki varsayılan sıradır. */
export const INSTRUMENTS: InstrumentDef[] = [
  besFaktor,
  ayrintiliKisilik,
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
  kelimeBilgisi,
  kuralDegistirme,
  kelimeListesi,
  duygusalZekaBilesenleri,
  kisilerarasiTarz,
  onAltiFaktorKisilik,
  ogrenmeVeBasari,
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
