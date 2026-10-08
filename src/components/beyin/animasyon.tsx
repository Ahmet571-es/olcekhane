'use client';

import type { AnimasyonAdi } from '@/content/beyin/types';
import { GriBeyazCevher } from './animasyonlar/gri-beyaz-cevher';
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
  }
}
