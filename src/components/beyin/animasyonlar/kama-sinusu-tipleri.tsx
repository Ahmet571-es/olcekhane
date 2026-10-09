'use client';

import { useId, useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Sfenoid sinüsün sagital havalanma tipleri (Hammer ve Rådberg'e dayanan sınıflama): konkal, preseller, seller ve
 * postseller. Sınır, Türk eyerinin ön ve arka duvarına göre çizilir (Açar ve ark., 2024; Sethi ve ark., 2023).
 * Yüzdeler Necmettin Erbakan Üniversitesi'ndeki 300 sağlıklı bireyin BT serisinden (Açar ve ark., 2024); seriler
 * arasında büyük fark vardır (kama kemiği bölümündeki tablo). Çizim şematik, sagital kesittir (yüz solda).
 */

type Tip = 'konkal' | 'preseller' | 'seller' | 'postseller';

const BILGI: Record<Tip, { baslik: string; metin: string; oran: string; sinir: number }> = {
  konkal: {
    baslik: 'Konkal tip',
    metin:
      'Eyerin ön duvarının önünde hiç ya da çok az havalanma vardır; eyerin altı dolu kemiktir. Küçük çocukta (1–3 yaş) olağandır. Burundan hipofize gidilen ameliyatlarda elverişsizdir: kalın kemiğin delinmesi gerekir ve ameliyat uzar.',
    oran: '%0,7',
    sinir: 128,
  },
  preseller: {
    baslik: 'Preseller tip',
    metin: 'Havalanmanın arka sınırı eyerin ön duvarının önünde kalır. Çocuklukta 4–9 yaşlarında baskındır.',
    oran: '%6,6',
    sinir: 168,
  },
  seller: {
    baslik: 'Seller tip',
    metin:
      'Hava boşluğu eyerin altına girer; arka sınırı eyerin arka duvarının önünde kalır. Seller tipler 10–12 yaşından sonra baskınlaşır.',
    oran: '%30',
    sinir: 222,
  },
  postseller: {
    baslik: 'Postseller tip',
    metin:
      'Havalanmanın arka sınırı eyerin arka duvarının arkasındadır. Bu Türk serisinde en sık tipti; yaş ilerledikçe daha seyrek görülüyordu.',
    oran: '%62,7',
    sinir: 262,
  },
};

/** Eyerin ön ve arka duvarlarının x konumları. */
const ON_DUVAR = 180;
const ARKA_DUVAR = 236;

export function KamaSinusuTipleri() {
  const [tip, setTip] = useState<Tip>('seller');
  const b = BILGI[tip];
  const kesit = `kama-govde-${useId().replace(/:/g, '')}`;
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Havalanma tipi"
        deger={tip}
        onDegis={setTip}
        secenekler={[
          { d: 'konkal', ad: 'Konkal' },
          { d: 'preseller', ad: 'Preseller' },
          { d: 'seller', ad: 'Seller' },
          { d: 'postseller', ad: 'Postseller' },
        ]}
      />
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 360 250" className="mx-auto w-full max-w-md" role="img" aria-label={`Sfenoid sinüs, ${b.baslik}, sagital kesit`}>
          <rect x="0" y="0" width="360" height="250" rx="16" fill="#f7f3ea" />
          <defs>
            <clipPath id={kesit}>
              <path d="M100,92 L170,92 C172,108 176,118 184,124 C200,134 222,132 232,120 L238,70 L252,66 L250,110 L320,206 L300,222 L230,150 L230,200 L100,200 Z" />
            </clipPath>
          </defs>
          {/* Kama gövdesi, eyer, eyer sırtı ve klivus */}
          <path
            d="M100,92 L170,92 C172,108 176,118 184,124 C200,134 222,132 232,120 L238,70 L252,66 L250,110 L320,206 L300,222 L230,150 L230,200 L100,200 Z"
            fill="#efe1c6"
            stroke="#9c8d70"
            strokeWidth="2"
          />
          {/* Hava boşluğu */}
          <g clipPath={`url(#${kesit})`}>
            <path
              d={`M104,${tip === 'konkal' ? 150 : 100} L${b.sinir},${tip === 'konkal' ? 150 : 140} L${b.sinir},196 L104,196 Z`}
              fill="#cfe6f3"
              stroke="#5b8fb9"
              strokeWidth="2"
              style={{ transition: 'all .5s ease' }}
            />
          </g>
          {/* Hipofiz */}
          <ellipse cx="208" cy="112" rx="18" ry="11" fill="#e9a6b4" stroke="#b5657a" strokeWidth="1.5" />
          {/* Eyer duvarı referans çizgileri */}
          <g stroke="#7d6b4f" strokeWidth="1.4" strokeDasharray="4 4">
            <line x1={ON_DUVAR} y1="58" x2={ON_DUVAR} y2="216" />
            <line x1={ARKA_DUVAR} y1="58" x2={ARKA_DUVAR} y2="216" />
          </g>
          <g fontSize="9.5" fill="#2b2b2b">
            <text x={ON_DUVAR} y="50" textAnchor="middle">
              eyerin ön duvarı
            </text>
            <text x={ARKA_DUVAR + 6} y="40" textAnchor="middle">
              arka duvarı
            </text>
            <text x="208" y="86" textAnchor="middle" fontWeight="700">
              Hipofiz
            </text>
            <text x="314" y="236" textAnchor="end">
              Klivus
            </text>
            <text x="266" y="62">
              Eyer sırtı
            </text>
            <text x="24" y="150">
              Burun
            </text>
            <text x="24" y="162">
              boşluğu ←
            </text>
          </g>
          <text x="140" y="228" fontSize="11" fontWeight="700" textAnchor="middle" fill="#2f5f8c">
            {b.baslik}: {b.oran}
          </text>
        </svg>
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-bold">
            {b.baslik} <span className="t-small font-normal">(Türk serisinde {b.oran})</span>
          </p>
          <p className="text-[0.98rem]">{b.metin}</p>
          <p className="t-meta">
            Mavi alan sinüsün hava boşluğu, kesik çizgiler eyerin ön ve arka duvarı. Oranlar Necmettin Erbakan Üniversitesi’ndeki 300
            sağlıklı bireyin BT serisinden; başka serilerde çok farklıdır. Çizim şematiktir.
          </p>
        </div>
      </div>
    </div>
  );
}
