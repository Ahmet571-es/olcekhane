'use client';

import { useEffect, useRef, useState } from 'react';
import { Secenekler, useHareketAzaltilmis } from './ortak';

/**
 * Kraniosinostoz: bir dikiş erken kaynaşınca baş yukarıdan bakıldığında nasıl biçimlenir? Biçimler şematiktir; aynı
 * sayıda noktadan oluşan çizgiler arasında yumuşak geçiş yapılır (hareketi azaltmayı seçenlerde doğrudan değişir).
 * Kaynaşan dikiş kırmızı çizilir. Virchow yasası: kaynaşan dikişe dik yönde büyüme durur, beyin dikişe paralel
 * yönde yer bulur. Pozisyonel plajiyosefalide dikiş kapanmamıştır; karşılaştırma için eklendi.
 */

type Kip = 'normal' | 'sagittal' | 'metopik' | 'tekKoronal' | 'ciftKoronal' | 'lambdoid' | 'pozisyonel';
type Dikis = 'metopik' | 'koronalSol' | 'koronalSag' | 'sagittal' | 'lambdoidSol' | 'lambdoidSag';

const N = 96;
const CX = 160;
const CY = 175;

/** Kutupsal biçim: θ = 0 ön (yukarı), saat yönünde artar; sinθ < 0 çizimin sol yanıdır. */
function bicim(kip: Kip): [number, number][] {
  const n: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const s = Math.sin(t);
    const c = Math.cos(t);
    let x = 68 * s;
    let y = -86 * c;
    if (kip === 'sagittal') {
      x = 52 * s;
      y = -106 * c;
    } else if (kip === 'metopik') {
      const on = Math.max(0, c);
      x = 72 * s * (1 - 0.5 * on * on);
      y = -(c > 0 ? 96 : 84) * c;
    } else if (kip === 'tekKoronal') {
      // Sol önde alın basık, sağ önde öne çıkar.
      const solOn = Math.max(0, -s) * Math.max(0, c);
      const sagOn = Math.max(0, s) * Math.max(0, c);
      x = 68 * s;
      y = -86 * c + 26 * solOn - 8 * sagOn;
    } else if (kip === 'ciftKoronal') {
      x = 82 * s;
      y = -(c > 0 ? 66 : 74) * c;
    } else if (kip === 'lambdoid') {
      // Sol arkada basıklık, karşı yanda alın ve art-yan kafada kabarıklık.
      const solArka = Math.max(0, -s) * Math.max(0, -c);
      const sag = Math.max(0, s);
      x = 68 * s + 6 * sag * Math.max(0, -c);
      y = -86 * c - 28 * solArka - 6 * sag * Math.max(0, c);
    } else if (kip === 'pozisyonel') {
      // Paralelkenar: sol arka basık, sol yan (kulak ve alın) öne kaymış.
      const solArka = Math.max(0, -s) * Math.max(0, -c);
      const sol = Math.max(0, -s);
      x = 68 * s;
      y = -86 * c - 24 * solArka - 10 * sol * Math.max(0, c) - 6 * sol;
    }
    n.push([CX + x, CY + y]);
  }
  return n;
}

const KAYNASAN: Record<Kip, Dikis[]> = {
  normal: [],
  sagittal: ['sagittal'],
  metopik: ['metopik'],
  tekKoronal: ['koronalSol'],
  ciftKoronal: ['koronalSol', 'koronalSag'],
  lambdoid: ['lambdoidSol'],
  pozisyonel: [],
};

const BILGI: Record<Kip, { baslik: string; metin: string }> = {
  normal: {
    baslik: 'Dikişler açık',
    metin:
      'Bebeklikte dikişler açıktır; kafatası kubbesindeki kemik büyümesinin yönünü büyüyen beyin belirler. Kafatası, büyüyen beyne her yönde yer açar.',
  },
  sagittal: {
    baslik: 'Sagittal dikiş: skafosefali',
    metin:
      'İki yan kafa kemiği arasındaki dikiş erken kaynaşırsa baş yana doğru büyüyemez, önden arkaya uzar: uzun, dar, kama biçimli baş. En sık tiptir (kaynaklara göre olguların kabaca %40–60’ı); erkeklerde yaklaşık 3,5 kat daha sıktır.',
  },
  metopik: {
    baslik: 'Metopik dikiş: trigonosefali',
    metin:
      'Alın kemiklerinin arasındaki dikiş erken kaynaşırsa alın üçgen biçimini alır ve göz çukurları birbirine anormal yakın durur (hipotelorizm). Kaynaklara göre olguların %5–30’u; metopik olguların üçte biri bir sendromun parçasıdır.',
  },
  tekKoronal: {
    baslik: 'Tek koronal dikiş: ön plajiyosefali',
    metin:
      'Alnın iki yanı simetrik değildir. Etkilenen yanda göz çukurunun üst kenarı yükselir; düz grafide buna “Harlequin işareti” denir. Kızlarda erkeklerden iki kat sık görülür.',
  },
  ciftKoronal: {
    baslik: 'Çift koronal dikiş: brakisefali',
    metin:
      'İki koronal dikiş birden kaynaşırsa önden arkaya büyüme kısıtlanır, şakaklara doğru telafi büyümesi olur: kısa ve geniş baş. Çift taraflı olguların çoğunda bilinen bir genetik neden bulunur.',
  },
  lambdoid: {
    baslik: 'Lambdoid dikiş: arka plajiyosefali',
    metin:
      'En seyrek tiptir (olguların %5’inden azı). Aynı yanda art-yan kafa basıklaşır, karşı yanda alın ve art-yan kafa kabarır; yukarıdan bakınca baş yamuk (trapez) görünür.',
  },
  pozisyonel: {
    baslik: 'Karşılaştırma: pozisyonel plajiyosefali',
    metin:
      'Dikiş kapanmamıştır: normal ve esnek kafatası, bebeğin hep aynı yana yatmasıyla dış basınçtan şekil değiştirir. Aynı yandaki kulak ve alın öne kayar; baş paralelkenar biçimini alır. Ense asimetrisinin lambdoid sinostozdan çok daha sık nedenidir; etkisi çoğunlukla görünümle sınırlıdır ve ameliyat gerekmez.',
  },
};

/** Biçimin θ açısındaki sınır noktası (en yakın örnek). */
function nokta(p: [number, number][], derece: number): [number, number] {
  const i = Math.round(((((derece % 360) + 360) % 360) / 360) * N) % N;
  return p[i];
}

export function Kraniosinostoz() {
  const azalt = useHareketAzaltilmis();
  const [kip, setKip] = useState<Kip>('normal');
  const [p, setP] = useState<[number, number][]>(() => bicim('normal'));
  const pRef = useRef(p);
  useEffect(() => {
    pRef.current = p;
  }, [p]);

  useEffect(() => {
    const hedef = bicim(kip);
    if (azalt) {
      // Hareketi azaltmayı seçenlerde biçim doğrudan değişir (bir sonraki karede).
      const id = requestAnimationFrame(() => setP(hedef));
      return () => cancelAnimationFrame(id);
    }
    const bas = pRef.current;
    const t0 = performance.now();
    let id = 0;
    const kare = (t: number) => {
      const k = Math.min(1, (t - t0) / 700);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      setP(bas.map(([x, y], i) => [x + (hedef[i][0] - x) * e, y + (hedef[i][1] - y) * e]));
      if (k < 1) id = requestAnimationFrame(kare);
    };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, [kip, azalt]);

  const d = `M${p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')} Z`;
  const on = nokta(p, 0);
  const koronalSol = nokta(p, 286);
  const koronalSag = nokta(p, 74);
  const bregma: [number, number] = [CX + (koronalSol[0] + koronalSag[0] - 2 * CX) / 2, (koronalSol[1] + koronalSag[1]) / 2 - 8];
  const arka = nokta(p, 180);
  const lambda: [number, number] = [CX, CY + (arka[1] - CY) * 0.62];
  const lambdoidSol = nokta(p, 232);
  const lambdoidSag = nokta(p, 128);
  const kulakSol = nokta(p, 270);
  const kulakSag = nokta(p, 90);
  const k = KAYNASAN[kip];
  const cizgi = (dk: Dikis) => ({
    stroke: k.includes(dk) ? '#c0392b' : '#7d6b4f',
    strokeWidth: k.includes(dk) ? 5 : 2,
  });
  const b = BILGI[kip];

  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Kaynaşan dikiş"
        deger={kip}
        onDegis={setKip}
        secenekler={[
          { d: 'normal', ad: 'Normal' },
          { d: 'sagittal', ad: 'Sagittal' },
          { d: 'metopik', ad: 'Metopik' },
          { d: 'tekKoronal', ad: 'Tek koronal' },
          { d: 'ciftKoronal', ad: 'Çift koronal' },
          { d: 'lambdoid', ad: 'Lambdoid' },
          { d: 'pozisyonel', ad: 'Pozisyonel (dikiş açık)' },
        ]}
      />
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 320 350" className="mx-auto w-full max-w-sm" role="img" aria-label={`Yukarıdan baş biçimi: ${b.baslik}`}>
          <rect x="0" y="0" width="320" height="350" rx="16" fill="#f7f3ea" />
          <text x="160" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b5a3e">
            Ön (yüz)
          </text>
          <text x="160" y="340" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b5a3e">
            Arka
          </text>
          {/* Burun ve kulaklar, yön için */}
          <path d={`M${on[0] - 9},${on[1] + 2} L${on[0]},${on[1] - 12} L${on[0] + 9},${on[1] + 2} Z`} fill="#ead9bd" stroke="#b7a684" />
          <ellipse cx={kulakSol[0] - 5} cy={kulakSol[1]} rx="7" ry="13" fill="#ead9bd" stroke="#b7a684" />
          <ellipse cx={kulakSag[0] + 5} cy={kulakSag[1]} rx="7" ry="13" fill="#ead9bd" stroke="#b7a684" />
          <path d={d} fill="#efe1c6" stroke="#9c8d70" strokeWidth="3" />
          {/* Dikişler */}
          <g fill="none" strokeLinecap="round">
            <path d={`M${on[0]},${on[1] + 4} L${bregma[0]},${bregma[1]}`} {...cizgi('metopik')} />
            <path
              d={`M${koronalSol[0] + 3},${koronalSol[1]} Q${(koronalSol[0] + bregma[0]) / 2},${bregma[1] + 2} ${bregma[0]},${bregma[1]}`}
              {...cizgi('koronalSol')}
            />
            <path
              d={`M${koronalSag[0] - 3},${koronalSag[1]} Q${(koronalSag[0] + bregma[0]) / 2},${bregma[1] + 2} ${bregma[0]},${bregma[1]}`}
              {...cizgi('koronalSag')}
            />
            <path d={`M${bregma[0]},${bregma[1]} L${lambda[0]},${lambda[1]}`} {...cizgi('sagittal')} />
            <path d={`M${lambda[0]},${lambda[1]} L${lambdoidSol[0] + 3},${lambdoidSol[1] - 2}`} {...cizgi('lambdoidSol')} />
            <path d={`M${lambda[0]},${lambda[1]} L${lambdoidSag[0] - 3},${lambdoidSag[1] - 2}`} {...cizgi('lambdoidSag')} />
          </g>
          <g fontSize="10" fill="#6b5a3e">
            <text x={bregma[0] + 6} y={bregma[1] - 6}>
              bregma
            </text>
            <text x={lambda[0] + 6} y={lambda[1] - 4}>
              lambda
            </text>
          </g>
        </svg>
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-bold">{b.baslik}</p>
          <p className="text-[0.98rem]">{b.metin}</p>
          <p className="t-meta">
            Kırmızı çizgi erken kaynaşan dikiştir. Virchow yasası: kaynaşan dikişe dik yönde büyüme durur; hızla büyüyen beyin dikişe
            paralel yönde yer bulur. Biçimler şematiktir.
          </p>
        </div>
      </div>
    </div>
  );
}
