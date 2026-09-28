import type { InstrumentDef } from '@/lib/instruments/types';
import { besFaktor } from './bes-faktor';
import { calismaAliskanliklari } from './calisma-aliskanliklari';
import { dikkatBellek } from './dikkat-bellek';
import { meslekiIlgi } from './mesleki-ilgi';
import { okumaHizi } from './okuma-hizi';
import { ozSaygi } from './oz-saygi';

/** Platformdaki tüm test tanımları. Sıralama katalogdaki varsayılan sıradır. */
export const INSTRUMENTS: InstrumentDef[] = [besFaktor, ozSaygi, meslekiIlgi, calismaAliskanliklari, okumaHizi, dikkatBellek].sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export function getInstrumentDef(slug: string): InstrumentDef | undefined {
  return INSTRUMENTS.find((i) => i.slug === slug);
}

export function publicInstruments(): InstrumentDef[] {
  return INSTRUMENTS.filter((i) => i.status === 'active' || i.status === 'pilot');
}
