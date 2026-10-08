'use client';

import { useRef, useState } from 'react';
import { Secenekler, useGorunur, useHareketAzaltilmis, useKare, yolNoktasi } from './ortak';

/**
 * Omurilik sinirleri: solda omurga ve 31 çift sinir bölgelerine göre (8 boyun, 12 göğüs, 5 bel, 5 sağrı, 1 kuyruk);
 * omurilik bel omurlarının üst hizasında biter, altında at kuyruğu uzanır. Sağda omuriliğin enine kesiti: arka kök
 * duyu sinyalini içeri, ön kök hareket komutunu dışarı taşır; ikisi birleşip karma omurilik sinirini oluşturur.
 */

type Bolge = 'hepsi' | 'C' | 'T' | 'L' | 'S' | 'Co';

const BOLGELER: { b: Exclude<Bolge, 'hepsi'>; ad: string; omur: number; sinir: number; renk: string; aciklama: string }[] = [
  { b: 'C', ad: 'Boyun', omur: 7, sinir: 8, renk: '#4f7cf0', aciklama: '7 boyun omuru, 8 çift boyun siniri (C1–C8).' },
  { b: 'T', ad: 'Göğüs', omur: 12, sinir: 12, renk: '#25a993', aciklama: '12 göğüs omuru, 12 çift göğüs siniri (T1–T12).' },
  { b: 'L', ad: 'Bel', omur: 5, sinir: 5, renk: '#e0a32e', aciklama: '5 bel omuru, 5 çift bel siniri (L1–L5).' },
  { b: 'S', ad: 'Sağrı', omur: 1, sinir: 5, renk: '#ef5d7b', aciklama: 'Kaynaşmış sağrı kemiği (sakrum), 5 çift sağrı siniri (S1–S5).' },
  { b: 'Co', ad: 'Kuyruk', omur: 1, sinir: 1, renk: '#8a93a8', aciklama: 'Kuyruk sokumu kemiği, 1 çift kuyruk siniri.' },
];

/** Omur kutuları ve sinirlerin çıkış yüksekliği. */
function omurga() {
  const omurlar: { y: number; h: number; b: Exclude<Bolge, 'hepsi'>; ad: string }[] = [];
  const sinirler: { y: number; b: Exclude<Bolge, 'hepsi'> }[] = [];
  let y = 18;
  sinirler.push({ y: y - 4, b: 'C' });
  for (let i = 1; i <= 7; i++) {
    omurlar.push({ y, h: 12, b: 'C', ad: `C${i}` });
    y += 15;
    sinirler.push({ y: y - 2, b: 'C' });
  }
  for (let i = 1; i <= 12; i++) {
    omurlar.push({ y, h: 15, b: 'T', ad: `T${i}` });
    y += 18;
    sinirler.push({ y: y - 2, b: 'T' });
  }
  for (let i = 1; i <= 5; i++) {
    omurlar.push({ y, h: 20, b: 'L', ad: `L${i}` });
    y += 23;
    sinirler.push({ y: y - 2, b: 'L' });
  }
  omurlar.push({ y, h: 52, b: 'S', ad: 'S' });
  for (let i = 0; i < 5; i++) sinirler.push({ y: y + 6 + i * 10, b: 'S' });
  y += 55;
  omurlar.push({ y, h: 14, b: 'Co', ad: 'Co' });
  sinirler.push({ y: y + 10, b: 'Co' });
  return { omurlar, sinirler, son: y + 14 };
}

const { omurlar: OMURLAR, sinirler: SINIRLER, son: SON } = omurga();
// Omurilik birinci bel omurunun altına kadar uzanır (yetişkinde çoğunlukla L1–L2 hizası).
const L1 = OMURLAR.find((o) => o.ad === 'L1')!;
const OMURILIK_SONU = L1.y + L1.h + 2;

const DUYU = 'M252,98 L196,98 L176,78 Q160,62 150,60 Q136,58 128,62 L98,76 L90,88';
const HAREKET = 'M96,130 L140,126 L196,104 L252,104';

export function OmurilikSinirleri() {
  const azalt = useHareketAzaltilmis();
  const [kapRef, gorunur] = useGorunur<HTMLDivElement>();
  const [bolge, setBolge] = useState<Bolge>('hepsi');
  const [noktalar, setNoktalar] = useState<{ duyu: { x: number; y: number }; hareket: { x: number; y: number } } | null>(null);
  const duyuRef = useRef<SVGPathElement>(null);
  const hareketRef = useRef<SVGPathElement>(null);
  useKare(gorunur && !azalt, (_dt, toplam) => {
    const t = (toplam / 2400) % 1;
    setNoktalar({ duyu: yolNoktasi(duyuRef.current, t), hareket: yolNoktasi(hareketRef.current, t) });
  });
  const secili = BOLGELER.find((x) => x.b === bolge);
  const op = (b: Exclude<Bolge, 'hepsi'>) => (bolge === 'hepsi' || bolge === b ? 1 : 0.18);
  const renk = (b: Exclude<Bolge, 'hepsi'>) => BOLGELER.find((x) => x.b === b)!.renk;

  return (
    <div ref={kapRef} className="flex flex-col gap-4">
      <Secenekler
        etiket="Omurga bölgesi"
        deger={bolge}
        onDegis={setBolge}
        secenekler={[{ d: 'hepsi', ad: 'Hepsi: 31 çift' }, ...BOLGELER.map((x) => ({ d: x.b, ad: `${x.ad} (${x.sinir})` }))]}
      />
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <figure className="flex flex-col items-center gap-2">
          <svg viewBox={`0 0 220 ${SON + 12}`} className="h-[30rem] w-auto max-w-full" role="img" aria-label="Omurga, omurilik ve 31 çift omurilik siniri">
            {OMURLAR.map((o) => (
              <g key={o.ad} opacity={op(o.b)} style={{ transition: 'opacity .3s' }}>
                <rect x="58" y={o.y} width="44" height={o.h} rx="4" fill="var(--surface-2)" stroke={renk(o.b)} strokeWidth="1.4" />
                {(o.h >= 15 || o.ad === 'C1' || o.ad === 'C7') && (
                  <text x="52" y={o.y + o.h / 2 + 3.5} textAnchor="end" fontSize="8.5" fill="var(--ink-3)">
                    {o.ad === 'S' ? 'sakrum' : o.ad === 'Co' ? 'koksiks' : o.ad}
                  </text>
                )}
              </g>
            ))}
            {/* Omurilik ve at kuyruğu */}
            <path d={`M116,6 L116,${OMURILIK_SONU}`} stroke="#4f7cf0" strokeWidth="7" strokeLinecap="round" />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${114 + i * 1.5},${OMURILIK_SONU} L${113 + i * 2.2},${SON - 6}`} stroke="#e0a32e" strokeWidth="1" opacity={op('L')} />
            ))}
            {SINIRLER.map((s, i) => (
              <path
                key={i}
                d={`M118,${Math.min(s.y, OMURILIK_SONU)} ${s.y > OMURILIK_SONU ? `L120,${s.y}` : ''} L176,${s.y + 6}`}
                stroke={renk(s.b)}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity={op(s.b)}
                style={{ transition: 'opacity .3s' }}
              />
            ))}
            <text x="124" y={OMURILIK_SONU - 4} fontSize="9" fill="var(--ink-2)">
              omurilik biter
            </text>
            <text x="124" y={OMURILIK_SONU + 30} fontSize="9" fill="var(--ink-2)">
              at kuyruğu
            </text>
          </svg>
          <figcaption className="t-small text-center text-ink-2" aria-live="polite">
            {secili ? secili.aciklama : '31 çift omurilik siniri: 8 boyun, 12 göğüs, 5 bel, 5 sağrı ve 1 kuyruk siniri.'}
          </figcaption>
        </figure>

        <figure className="flex flex-col gap-2">
          <svg viewBox="0 0 270 200" className="w-full" role="img" aria-label="Omuriliğin enine kesiti: arka kök, gangliyon, ön kök ve omurilik siniri">
            <text x="8" y="16" fontSize="10" fill="var(--ink-3)">
              arka (dorsal)
            </text>
            <text x="8" y="194" fontSize="10" fill="var(--ink-3)">
              ön (ventral)
            </text>
            <ellipse cx="80" cy="104" rx="58" ry="48" fill="#f4eee4" stroke="#c9b9a2" strokeWidth="1.5" />
            <path
              d="M74,98 C66,90 62,78 64,66 C70,68 74,78 78,90 L82,90 C86,78 90,68 96,66 C98,78 94,90 86,98 C96,104 104,116 104,134 C96,136 90,126 84,114 L76,114 C70,126 64,136 56,134 C56,116 64,104 74,98 Z"
              fill="#c49a92"
            />
            <path d="M98,72 L128,62 Q140,56 150,60 Q164,64 176,78 L196,98 L252,98" fill="none" stroke="#e0a32e" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="150" cy="60" rx="13" ry="9" fill="#f2c45a" stroke="#c98f1b" strokeWidth="1.2" />
            <path d="M98,130 L140,126 L196,104 L252,104" fill="none" stroke="#ef5d7b" strokeWidth="4" strokeLinecap="round" />
            <path d="M196,101 L252,101" stroke="#8a6fd8" strokeWidth="9" strokeLinecap="round" opacity="0.25" />
            <path ref={duyuRef} d={DUYU} fill="none" stroke="none" />
            <path ref={hareketRef} d={HAREKET} fill="none" stroke="none" />
            {noktalar && (
              <>
                <circle cx={noktalar.duyu.x} cy={noktalar.duyu.y} r="4.5" fill="#e0a32e" stroke="#fff" strokeWidth="1.5" />
                <circle cx={noktalar.hareket.x} cy={noktalar.hareket.y} r="4.5" fill="#ef5d7b" stroke="#fff" strokeWidth="1.5" />
              </>
            )}
            <text x="112" y="44" fontSize="10.5" fontWeight="700" fill="var(--ink)">
              arka kök: duyu (içeri)
            </text>
            <text x="166" y="58" fontSize="10" fill="var(--ink-2)">
              gangliyon
            </text>
            <text x="112" y="150" fontSize="10.5" fontWeight="700" fill="var(--ink)">
              ön kök: hareket (dışarı)
            </text>
            <text x="200" y="124" fontSize="10" fill="var(--ink-2)">
              omurilik siniri
            </text>
            <text x="200" y="136" fontSize="10" fill="var(--ink-2)">
              (karma)
            </text>
            <text x="58" y="62" fontSize="9" fill="#6b3f39">
              arka boynuz
            </text>
            <text x="44" y="148" fontSize="9" fill="#6b3f39">
              ön boynuz
            </text>
          </svg>
          <figcaption className="t-small text-ink-2">
            Arka kökte yalnızca duyu nöronlarının aksonları, ön kökte yalnızca hareket nöronlarının aksonları vardır. Duyu
            nöronlarının gövdeleri arka kök gangliyonundadır. İki kök birleşince her omurilik siniri hem duyu hem hareket
            lifi taşır (karma sinir).
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
