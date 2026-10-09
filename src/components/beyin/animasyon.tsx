'use client';

import type { AnimasyonAdi } from '@/content/beyin/types';
import { Bingildaklar } from './animasyonlar/bingildaklar';
import { GriBeyazCevher } from './animasyonlar/gri-beyaz-cevher';
import { KafaDerisiKatmanlari } from './animasyonlar/kafa-derisi-katmanlari';
import { KafaIciKanamalar } from './animasyonlar/kafa-ici-kanamalar';
import { KafatasiKiriklari } from './animasyonlar/kafatasi-kiriklari';
import { KafatasiTabani } from './animasyonlar/kafatasi-tabani';
import { KamaSinusuTipleri } from './animasyonlar/kama-sinusu-tipleri';
import { KemikIsaretleri } from './animasyonlar/kemik-isaretleri';
import { Kraniosinostoz } from './animasyonlar/kraniosinostoz';
import { Kraniotomi } from './animasyonlar/kraniotomi';
import { MonroKellie } from './animasyonlar/monro-kellie';
import { MrGosterimi } from './animasyonlar/mr-gosterimi';
import { OmurilikSinirleri } from './animasyonlar/omurilik-sinirleri';
import { OtonomCikis } from './animasyonlar/otonom-cikis';
import { OtonomTerazi } from './animasyonlar/otonom-terazi';
import { SinirSistemiHaritasi } from './animasyonlar/sinir-sistemi-haritasi';
import { YonPusulasi } from './animasyonlar/yon-pusulasi';
import { YuzSiniriKanali } from './animasyonlar/yuz-siniri-kanali';

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
    case 'otonom-cikis':
      return <OtonomCikis />;
    case 'kafa-ici-kanamalar':
      return <KafaIciKanamalar />;
    case 'monro-kellie':
      return <MonroKellie />;
    case 'kafatasi-tabani':
      return <KafatasiTabani />;
    case 'bingildaklar':
      return <Bingildaklar />;
    case 'kraniosinostoz':
      return <Kraniosinostoz />;
    case 'kafa-derisi-katmanlari':
      return <KafaDerisiKatmanlari />;
    case 'kafatasi-kiriklari':
      return <KafatasiKiriklari />;
    case 'kraniotomi':
      return <Kraniotomi />;
    case 'kemik-isaretleri':
      return <KemikIsaretleri />;
    case 'yuz-siniri-kanali':
      return <YuzSiniriKanali />;
    case 'kama-sinusu-tipleri':
      return <KamaSinusuTipleri />;
  }
}
