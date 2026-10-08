'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Saçtan beyne: kafa derisinin beş katmanı (SCALP), kafatası kemiğinin iki tablası ve aradaki diploe, en altta sert zar
 * ve toplardamar sinüsü. Seçeneklerle tehlikeli katman ve emisser ven, kemiğin "sandviç" yapısı ve gevşek katmandaki
 * ayrılma düzlemi gösterilir. Şematik bir kesittir; kalınlıklar ölçekli değildir.
 */

type Kip = 'katmanlar' | 'tehlikeli' | 'sandvic' | 'ayrilma';

const KATMAN = [
  { harf: 'S', ad: 'Deri', ust: 30, alt: 52, renk: '#f1c7b4' },
  { harf: 'C', ad: 'Sıkı bağ dokusu', ust: 52, alt: 76, renk: '#f6e2a6' },
  { harf: 'A', ad: 'Aponevroz (galea aponeurotica)', ust: 76, alt: 90, renk: '#e3e3e3' },
  { harf: 'L', ad: 'Gevşek bağ dokusu', ust: 90, alt: 108, renk: '#fbf7ee' },
  { harf: 'P', ad: 'Perikranyum (kemik zarı)', ust: 108, alt: 116, renk: '#d9c7a6' },
] as const;

const BILGI: Record<Kip, { baslik: string; metin: string }> = {
  katmanlar: {
    baslik: 'Beş katman: S-C-A-L-P',
    metin:
      'Kafa derisi dışarıdan içeriye deri, sıkı bağ dokusu, aponevroz, gevşek bağ dokusu ve perikranyumdan oluşur; İngilizce baş harfleri SCALP (kafa derisi) sözcüğünü verir. Altta kafatası kemiği ve onun altında sert zar (dura mater) bulunur. Ense bölgesinde oksipital atardamar, toplardamar ve sinirler sıkı bağ dokusu katmanında seyreder.',
  },
  tehlikeli: {
    baslik: 'Tehlikeli katman ve emisser venler',
    metin:
      'Dördüncü katman (gevşek bağ dokusu) kafa derisinin “tehlikeli alanı” sayılır: kafa derisinin damarlarını kemikteki diploik venlere ve kafa içindeki toplardamar sinüslerine bağlayan emisser venler buradan geçer. Bu venlerin kapakçığı yoktur; kafa derisindeki bir enfeksiyon bu yoldan kemiğe ve kafa içine ilerleyebilir (kemik iltihabı, menenjit, beyin apsesi).',
  },
  sandvic: {
    baslik: 'Kemiğin sandviç yapısı',
    metin:
      'Kafatasının yassı kemiklerinde iki sert (kompakt) tabla arasında süngerimsi bir katman, diploe, bulunur. Diploedeki zengin ven ağı doğrudan büyük toplardamar sinüslerine bağlanır. Dış tabla kırılsa bile sağlam kalan iç tabla beyni korumayı sürdürür. Kuru kafataslarında ortalama kalınlık yaklaşık 6 mm ölçülmüştür; şakak bölgesi daha incedir.',
  },
  ayrilma: {
    baslik: 'Ayrılma düzlemi',
    metin:
      'Gevşek katman, cerrahi kafa derisi fleplerinin kaldırıldığı ve kazalarda kafa derisinin koptuğu düzlemdir: saç bir makineye kapılınca aponevroz kemik zarından ayrılır, kemik zarı çoğu zaman yerinde kalır. Bu katmandaki potansiyel boşluk önde göz çukuru kenarlarına, arkada enseye kadar uzanır; yenidoğanda içinde 260 mL’ye kadar kan birikebilir (subgaleal kanama).',
  },
};

export function KafaDerisiKatmanlari() {
  const [kip, setKip] = useState<Kip>('katmanlar');
  const b = BILGI[kip];
  const soluk = (on: boolean) => ({ opacity: on ? 1 : 0.35, transition: 'opacity .4s ease' });
  const tehlike = kip === 'tehlikeli';
  const sandvic = kip === 'sandvic';
  const ayrilma = kip === 'ayrilma';
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={kip}
        onDegis={setKip}
        secenekler={[
          { d: 'katmanlar', ad: 'Katmanlar' },
          { d: 'tehlikeli', ad: 'Tehlikeli katman' },
          { d: 'sandvic', ad: 'Kemik: sandviç' },
          { d: 'ayrilma', ad: 'Ayrılma düzlemi' },
        ]}
      />
      <svg viewBox="0 0 380 250" className="mx-auto w-full max-w-2xl" role="img" aria-label={b.baslik}>
        <rect x="0" y="0" width="380" height="250" rx="14" fill="#f7f3ea" />
        {/* Saç */}
        <g stroke="#5a4632" strokeWidth="1.4" opacity={kip === 'katmanlar' ? 0.8 : 0.4}>
          {Array.from({ length: 14 }, (_, i) => 40 + i * 24).map((x) => (
            <path key={x} d={`M${x},40 C${x + 4},26 ${x - 2},16 ${x + 6},4`} fill="none" />
          ))}
        </g>
        {/* Kafa derisinin beş katmanı */}
        {KATMAN.map((k) => (
          <rect
            key={k.harf}
            x="30"
            y={k.ust}
            width="340"
            height={k.alt - k.ust}
            fill={k.renk}
            stroke="#c9bba0"
            strokeWidth="0.6"
            style={soluk(
              kip === 'katmanlar' || (tehlike && k.harf === 'L') || (ayrilma && (k.harf === 'L' || k.harf === 'A' || k.harf === 'P')),
            )}
          />
        ))}
        {/* Bağ dokusundaki damarlar */}
        <g style={soluk(kip !== 'sandvic')}>
          <circle cx="240" cy="64" r="5" fill="#d0463b" />
          <circle cx="256" cy="64" r="6" fill="#4f6fb5" />
          <circle cx="324" cy="64" r="5" fill="#d0463b" />
          <circle cx="340" cy="64" r="6" fill="#4f6fb5" />
        </g>
        {/* Gevşek katmandaki ince lifler */}
        <g stroke="#cbbf9f" strokeWidth="0.8" opacity="0.8">
          {Array.from({ length: 10 }, (_, i) => 50 + i * 32).map((x) => (
            <path key={x} d={`M${x},92 L${x + 12},106`} />
          ))}
        </g>
        {/* Kemik: dış tabla, diploe, iç tabla */}
        <g style={soluk(kip === 'katmanlar' || sandvic || tehlike)}>
          <rect x="30" y="116" width="340" height="16" fill="#efe7d5" stroke="#b9a98a" strokeWidth="0.8" />
          <rect x="30" y="132" width="340" height="34" fill="#e2d2ae" />
          {Array.from({ length: 34 }, (_, i) => i).map((i) => (
            <circle
              key={i}
              cx={44 + ((i * 47) % 318)}
              cy={138 + ((i * 13) % 24)}
              r={2.5 + (i % 3)}
              fill="#f7f0de"
              stroke="#c9b48a"
              strokeWidth="0.6"
            />
          ))}
          <rect x="30" y="166" width="340" height="14" fill="#efe7d5" stroke="#b9a98a" strokeWidth="0.8" />
          {/* Diploik ven */}
          <path
            d="M60,150 C120,144 170,156 232,150 C262,147 300,152 330,149"
            fill="none"
            stroke="#4f6fb5"
            strokeWidth="5"
            opacity={sandvic || tehlike ? 0.95 : 0.55}
          />
        </g>
        {/* Dış tablada kırık çizgisi (yalnızca sandviç görünümünde) */}
        {sandvic && <path d="M168,116 L176,124 L170,128 L178,132" fill="none" stroke="#c0392b" strokeWidth="2.4" strokeLinecap="round" />}
        {/* Sert zar ve toplardamar sinüsü */}
        <rect x="30" y="180" width="340" height="14" fill="#c9d6c2" stroke="#9fb39a" strokeWidth="0.8" />
        <path d="M206,194 L234,194 L220,212 Z" fill="#4f6fb5" opacity="0.9" />
        <rect x="30" y="194" width="340" height="40" fill="#f2d3cb" opacity="0.7" />
        {/* Emisser ven: kafa derisi damarından sinüse */}
        <path
          d="M256,70 C256,88 246,100 236,110 C226,122 222,140 220,158 C219,174 219,186 220,198"
          fill="none"
          stroke="#2f4f9a"
          strokeWidth={tehlike ? 5 : 3}
          strokeDasharray={tehlike ? undefined : '5 4'}
          style={soluk(tehlike || kip === 'katmanlar')}
        />
        {tehlike && (
          <g fill="#c0392b" fontSize="10.5" fontWeight="700">
            <path d="M231,104 L241,107 L233,115 Z" />
            <text x="236" y="214">
              Toplardamar sinüsü
            </text>
            <text x="246" y="128">
              Emisser ven
            </text>
          </g>
        )}
        {/* Ayrılma düzlemi */}
        {ayrilma && (
          <g>
            <path d="M30,99 L370,99" stroke="#c0392b" strokeWidth="2.5" strokeDasharray="8 5" />
            <text x="364" y="96" textAnchor="end" fontSize="10.5" fontWeight="700" fill="#c0392b">
              Flep ve kopma düzlemi
            </text>
          </g>
        )}
        {/* Sol kenarda harfler ve adlar */}
        <g fontSize="10" fontWeight="700" fill="#2b2b2b">
          {KATMAN.map((k) => (
            <text key={k.harf} x="14" y={(k.ust + k.alt) / 2 + 3.5} textAnchor="middle" fill="#9a6a00">
              {k.harf}
            </text>
          ))}
        </g>
        <g fontSize="9.5" fill="#2b2b2b">
          {KATMAN.map((k) => (
            <text key={k.harf} x="36" y={(k.ust + k.alt) / 2 + 3.5} opacity={k.harf === 'P' ? 0 : 1}>
              {k.ad}
            </text>
          ))}
          <text x="36" y="127">
            Dış tabla
          </text>
          <text x="36" y="146" fontWeight="700">
            Diploe
          </text>
          <text x="36" y="177">
            İç tabla
          </text>
          <text x="36" y="191">
            Sert zar
          </text>
          <text x="36" y="216">
            Beyin
          </text>
          <text x="290" y="114" fontSize="9">
            Perikranyum
          </text>
        </g>
      </svg>
      <div className="flex flex-col gap-1.5" aria-live="polite">
        <p className="font-bold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
