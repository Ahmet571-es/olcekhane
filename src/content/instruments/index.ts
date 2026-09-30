import type { InstrumentDef } from '@/lib/instruments/types';
import { altiBoyutluKisilik } from './alti-boyutlu-kisilik';
import { ayrintiliKisilik } from './ayrintili-kisilik';
import { besFaktor } from './bes-faktor';
import { calismaAliskanliklari } from './calisma-aliskanliklari';
import { dikkatBellek } from './dikkat-bellek';
import { durGitGorevi } from './dur-git';
import { harfIsaretleme } from './harf-isaretleme';
import { matematik } from './matematik';
import { meslekIlgiAlanlari } from './meslek-ilgi-alanlari';
import { meslekiIlgi } from './mesleki-ilgi';
import { okumaHizi } from './okuma-hizi';
import { ozSaygi } from './oz-saygi';
import { renkKelimeGorevi } from './renk-kelime';
import { siraylaBirlestirme } from './sirayla-birlestirme';

/** Platformdaki tüm test tanımları. Sıralama katalogdaki varsayılan sıradır. */
export const INSTRUMENTS: InstrumentDef[] = [
  besFaktor,
  ayrintiliKisilik,
  altiBoyutluKisilik,
  ozSaygi,
  meslekiIlgi,
  meslekIlgiAlanlari,
  calismaAliskanliklari,
  okumaHizi,
  matematik,
  dikkatBellek,
  harfIsaretleme,
  renkKelimeGorevi,
  durGitGorevi,
  siraylaBirlestirme,
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
