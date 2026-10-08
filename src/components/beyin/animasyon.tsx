'use client';

import type { AnimasyonAdi } from '@/content/beyin/types';
import { GriBeyazCevher } from './animasyonlar/gri-beyaz-cevher';
import { MrGosterimi } from './animasyonlar/mr-gosterimi';
import { OmurilikSinirleri } from './animasyonlar/omurilik-sinirleri';
import { OtonomTerazi } from './animasyonlar/otonom-terazi';
import { SinirSistemiHaritasi } from './animasyonlar/sinir-sistemi-haritasi';
import { YonPusulasi } from './animasyonlar/yon-pusulasi';

export function Animasyon({ ad }: { ad: AnimasyonAdi }) {
  switch (ad) {
    case 'sinir-sistemi-haritasi':
      return <SinirSistemiHaritasi />;
    case 'yon-pusulasi':
      return <YonPusulasi />;
    case 'gri-beyaz-cevher':
      return <GriBeyazCevher />;
    case 'otonom-terazi':
      return <OtonomTerazi />;
    case 'omurilik-sinirleri':
      return <OmurilikSinirleri />;
    case 'mr-gosterimi':
      return <MrGosterimi />;
  }
}
