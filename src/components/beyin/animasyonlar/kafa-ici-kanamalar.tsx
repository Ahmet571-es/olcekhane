'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Beyni saran katmanlar ve kafa içindeki üç kanama. Kafatasının yan bölümünden alınmış şematik bir kesit: deri,
 * kemik (iki sütür çizgisiyle), sert zar, örümcek ağı zar, beyin-omurilik sıvısı dolu boşluk, yumuşak zar ve kabuk.
 * Kanama seçilince kan ilgili aralıkta toplanır; biçimi BT'deki görünümünü anımsatır. Kaynaklar dersin sonunda.
 */

type Durum = 'katmanlar' | 'epidural' | 'subdural' | 'subaraknoid';

const KEMIK_UST = 34;
const KEMIK_ALT = 64;
const DURA_ALT = 72;
const ARAK = 76;
const SUTURLER = [96, 284];

/** Kabuk yüzeyi: girus ve oluklar (yumuşak zar bu çizgiyi izler). */
function kabukYolu(): string {
  let d = `M0,104`;
  for (let x = 0; x < 380; x += 40) {
    d += ` C${x + 8},88 ${x + 26},88 ${x + 32},102 L${x + 36},138 L${x + 40},104`;
  }
  return d;
}
const KABUK = kabukYolu();

const BILGI: Record<Durum, { baslik: string; metin: string }> = {
  katmanlar: {
    baslik: 'Dışarıdan içeriye katmanlar',
    metin:
      'Deri, kafatası kemiği, sert zar (dura mater; kemiğe yapışık dış ve beyne bakan iç tabaka), örümcek ağı zar (araknoid), beyin-omurilik sıvısıyla dolu örümcek ağı zar altı boşluk (subaraknoid aralık; büyük damarlar buradan geçer), kıvrımların içine kadar inen yumuşak zar (pia mater) ve kabuk. Mavi çizgi bir köprü ven: kabuktan sert zardaki toplardamar sinüsüne uzanır. Kırmızı daire orta meningeal arterdir: kafatası kemiğinin hemen altında seyreder, şakak bölgesinde ince şakak kemiği onun üstünü örter.',
  },
  epidural: {
    baslik: 'Epidural kanama (kemik ile sert zar arasında)',
    metin:
      'Çoğunlukla şakak kemiği kırığında altındaki orta meningeal arter yırtılır. Atardamar basıncıyla toplanan kan sert zarı kemikten ayırır. Sert zar sütürlerde kemiğe sıkı yapıştığı için kan genellikle sütür çizgisini aşamaz: BT’de iki yanı dışbükey, mercek biçimli bir görüntü. Kısa bir bilinç kaybından sonra bir “açık aralık” görülebilir, ardından hızla kötüleşme gelir; her hastada görülmez. Acil cerrahi bir durumdur.',
  },
  subdural: {
    baslik: 'Subdural kanama (sert zar ile örümcek ağı zar arasında)',
    metin:
      'Sert zardan beyne uzanan ince duvarlı köprü venler yırtılır. Kan sert zar ile örümcek ağı zar arasındaki düzlemde yayılır: hilal biçimli. Sütürleri aşabilir ama sert zarın kıvrımlarını (orak, çadır) aşamaz. Kanı sulandıran ilaçlar, uzun süreli alkol kullanımı, tekrarlayan düşmeler ve ileri yaş risk etkenleridir. Akut (ilk 72 saat), yarı akut (3–21 gün) ve kronik (3 haftadan sonra) diye ayrılır.',
  },
  subaraknoid: {
    baslik: 'Subaraknoid kanama (örümcek ağı zarın altında)',
    metin:
      'Kan beyin-omurilik sıvısına karışır, sıvının dolaştığı aralık boyunca oluklara yayılır. En sık nedeni kafa travmasıdır. Travma dışı subaraknoid kanamaların yaklaşık %85’i bir anevrizmanın yırtılmasından olur: ani başlayan, “hayatımın en kötü baş ağrısı” diye anlatılan bir ağrı. Önce kontrastsız BT çekilir; normalse lomber ponksiyon yapılabilir. Anevrizma ameliyatla klipslenir ya da damar içinden sarmal (koil) ile kapatılır.',
  },
};

export function KafaIciKanamalar() {
  const [durum, setDurum] = useState<Durum>('katmanlar');
  const b = BILGI[durum];
  const goster = (d: Durum) => ({ opacity: durum === d ? 1 : 0, transition: 'opacity .6s ease' });
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Katman ya da kanama"
        deger={durum}
        onDegis={setDurum}
        secenekler={[
          { d: 'katmanlar', ad: 'Katmanlar' },
          { d: 'epidural', ad: 'Epidural' },
          { d: 'subdural', ad: 'Subdural' },
          { d: 'subaraknoid', ad: 'Subaraknoid' },
        ]}
      />
      <svg viewBox="0 0 380 190" className="mx-auto w-full max-w-2xl" role="img" aria-label={b.baslik}>
        <defs>
          <clipPath id="kik-alan">
            <rect x="0" y="0" width="380" height="190" />
          </clipPath>
        </defs>
        <g clipPath="url(#kik-alan)">
          {/* Beyaz cevher, BOS aralığı ve kabuk */}
          <rect x="0" y="0" width="380" height="190" fill="#f3ede3" />
          <rect x="0" y={ARAK} width="380" height="40" fill="#cfe6fb" />
          <path d={`${KABUK} L380,104 L380,128 L0,128 Z`} fill="#e8b7ab" />
          <path d="M0,128 L380,128 L380,150 Q285,140 190,150 T0,150 Z" fill="#e8b7ab" />
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${i * 40 + 32},102 L${i * 40 + 36},138 L${i * 40 + 40},104`} fill="#cfe6fb" />
          ))}
          {/* Subaraknoid kanama: BOS aralığı ve oluklar kanla dolar */}
          <g style={goster('subaraknoid')}>
            <path d={`M40,${ARAK + 1} L340,${ARAK + 1} L340,98 L40,98 Z`} fill="#c0392b" opacity="0.7" />
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${i * 40 + 72},102 L${i * 40 + 76},138 L${i * 40 + 80},104`} fill="#c0392b" opacity="0.85" />
            ))}
            <circle cx="170" cy="90" r="7" fill="#8f1d1d" stroke="#fff" strokeWidth="1" />
            <text x="182" y="93" fontSize="8.5" fill="#fff" fontWeight="700">
              anevrizma
            </text>
          </g>
          {/* Yumuşak zar */}
          <path d={KABUK} fill="none" stroke="#b9606a" strokeWidth="1.2" />
          {/* Subaraknoid aralıktaki atardamarlar */}
          {[118, 236, 344].map((x) => (
            <circle key={x} cx={x} cy={ARAK + 14} r="4.2" fill="#d9473c" />
          ))}
          {/* Subdural kanama: sert zar ile örümcek ağı zar arasında hilal */}
          <path d={`M0,${DURA_ALT} L380,${DURA_ALT} L380,${ARAK} Q190,${ARAK + 34} 0,${ARAK} Z`} fill="#a93226" style={goster('subdural')} />
          {/* Örümcek ağı zar (subduralde hilalin altına itilir) */}
          <path
            d={durum === 'subdural' ? `M0,${ARAK} Q190,${ARAK + 34} 380,${ARAK}` : `M0,${ARAK} Q190,${ARAK} 380,${ARAK}`}
            fill="none"
            stroke="#7f8fa6"
            strokeWidth="1.6"
            style={{ transition: 'd .6s ease' }}
          />
          {/* Sert zar: dış (periost) ve iç (meningeal) tabaka */}
          <rect x="0" y={KEMIK_ALT} width="380" height={DURA_ALT - KEMIK_ALT} fill="#c9b8a6" />
          <line x1="0" y1={KEMIK_ALT + 4} x2="380" y2={KEMIK_ALT + 4} stroke="#a8927c" strokeWidth="0.8" strokeDasharray="3 3" />
          {/* Epidural kanama: sütürler arasında mercek; sert zar aşağı itilir */}
          <g style={goster('epidural')}>
            <path d={`M${SUTURLER[0] + 4},${KEMIK_ALT} Q190,${KEMIK_ALT + 46} ${SUTURLER[1] - 4},${KEMIK_ALT} Z`} fill="#c0392b" />
            <path d={`M${SUTURLER[0] + 4},${KEMIK_ALT + 4} Q190,${KEMIK_ALT + 54} ${SUTURLER[1] - 4},${KEMIK_ALT + 4}`} fill="none" stroke="#c9b8a6" strokeWidth="8" />
          </g>
          {/* Kemik */}
          <rect x="0" y={KEMIK_UST} width="380" height={KEMIK_ALT - KEMIK_UST} fill="#efe7d5" />
          {Array.from({ length: 26 }, (_, i) => (
            <circle key={i} cx={8 + i * 14.5} cy={KEMIK_UST + 15} r="2.2" fill="#ddd1b8" />
          ))}
          {SUTURLER.map((x) => (
            <path key={x} d={`M${x},${KEMIK_UST} l-4,7 l6,6 l-5,7 l5,5 l-2,5`} fill="none" stroke="#8a7a5f" strokeWidth="1.4" />
          ))}
          {/* Orta meningeal arter (kemiğin hemen altında) */}
          <circle cx="190" cy={KEMIK_ALT - 1} r="4.5" fill="#d9473c" stroke={durum === 'epidural' ? '#fff' : 'none'} strokeWidth="1.5" />
          {/* Deri */}
          <rect x="0" y="0" width="380" height={KEMIK_UST} fill="#f2cdb9" />
          {/* Köprü ven: kabuktan sert zara */}
          <path
            d={`M300,104 C298,92 304,84 302,${DURA_ALT - 2}`}
            fill="none"
            stroke="#4f7cf0"
            strokeWidth="2.6"
            strokeDasharray={durum === 'subdural' ? '5 3' : undefined}
          />
        </g>
        {/* Etiketler */}
        <g fontSize="9" fill="var(--ink-2)" style={{ opacity: durum === 'katmanlar' ? 1 : 0.85 }}>
          <text x="6" y="20">
            deri
          </text>
          <text x="6" y={KEMIK_UST + 26}>
            kemik
          </text>
          <text x={SUTURLER[0] + 6} y={KEMIK_UST + 10} fontSize="8">
            sütür
          </text>
          <text x={SUTURLER[1] + 6} y={KEMIK_UST + 10} fontSize="8">
            sütür
          </text>
          <text x="318" y={KEMIK_ALT + 6}>
            sert zar
          </text>
          <text x="6" y={ARAK + 9} fontSize="8" fill="#55657d">
            örümcek ağı zar
          </text>
          <text x="6" y={ARAK + 20} fontSize="8" fill="#2f6ea5">
            BOS
          </text>
          <text x="6" y="168">
            beyaz cevher
          </text>
          <text x="128" y="122" fill="#7a3a33">
            kabuk (gri cevher)
          </text>
          {durum === 'katmanlar' && (
            <>
              <text x="200" y={KEMIK_ALT - 4} fontSize="8" fill="#a5281d">
                orta meningeal arter
              </text>
              <text x="308" y="96" fontSize="8.5" fill="#2f55c4">
                köprü ven
              </text>
            </>
          )}
        </g>
      </svg>
      <div aria-live="polite" className="flex flex-col gap-1">
        <p className="font-bold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
