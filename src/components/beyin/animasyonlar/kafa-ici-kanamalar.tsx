'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Beyni saran katmanlar ve kafa içindeki üç kanama. Kafatasının yan bölümünden alınmış şematik bir kesit: deri,
 * kemik (iki dikiş çizgisiyle), sert zar, örümcek ağı zar, beyin-omurilik sıvısı dolu boşluk, yumuşak zar ve kabuk.
 * Kanama seçilince kan ilgili aralıkta toplanır; biçimi BT'deki görünümünü anımsatır. Kaynaklar: Stalons ve ark. (2022);
 * Shetty ve ark. (2016); Nouri ve ark. (2021); Griswold ve ark. (2022); NINDS (2026a, beyin anevrizmaları).
 * Subaraknoid kanamanın nedeni: en sık neden travmadır (Griswold ve ark., 2022); klinik önemi büyük kanamalar daha çok
 * damar bozukluklarındandır, travma dışı en sık neden sakküler anevrizmadır (Stalons ve ark., 2022).
 * Subdural kanın BT'de zamanla koyulaşması: akutta parlak, alt akutta "up to 2 weeks" beyinle aynı yoğunlukta, 3 haftadan
 * sonra koyu (Nouri ve ark., 2021, Tablo 2); kronik birikinti BOS gibi koyu (Shetty ve ark., 2016).
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

type Yazi = { x: number; y: number; boyut: number; metin: string; sonda?: boolean };

/**
 * BOS bandındaki iki yazının ("örümcek ağı zar", "BOS") yeri; yazılar çizgilere ve kana binmesin diye görünüme göre
 * değişir. Subduralde zar hilalin altına itilir; yazı hilal ile kabuk arasındaki dar boşluğa iner. Subaraknoidde kan
 * x = 40 ile 340 arasında BOS bandını doldurur; zar yazısı sağdaki kansız yere iki satır, BOS soldaki kansız yere konur.
 */
const BOS_YAZILARI: Record<Durum, Yazi[]> = {
  katmanlar: [
    { x: 6, y: ARAK + 9, boyut: 8, metin: 'örümcek ağı zar' },
    { x: 352, y: 90, boyut: 8, metin: 'BOS' },
  ],
  epidural: [
    { x: 6, y: ARAK + 9, boyut: 8, metin: 'örümcek ağı zar' },
    { x: 352, y: 90, boyut: 8, metin: 'BOS' },
  ],
  subdural: [
    { x: 3, y: ARAK + 14.5, boyut: 7.5, metin: 'örümcek ağı zar' },
    { x: 352, y: 90, boyut: 8, metin: 'BOS' },
  ],
  subaraknoid: [
    { x: 378, y: ARAK + 7, boyut: 7.5, metin: 'örümcek', sonda: true },
    { x: 378, y: ARAK + 14, boyut: 7.5, metin: 'ağı zar', sonda: true },
    { x: 6, y: 87, boyut: 8, metin: 'BOS' },
  ],
};

const BILGI: Record<Durum, { baslik: string; metin: string }> = {
  katmanlar: {
    baslik: 'Dışarıdan içeriye katmanlar',
    metin:
      'Dıştan içe önce deri, kafatası kemiği ve sert zar (dura mater) gelir. Klasik anlatımda sert zarın iki tabakası vardır: kemiğe yapışık dış tabaka ve beyne bakan iç tabaka. Sert zarın altında örümcek ağı zar (araknoid) uzanır. Onun altındaki boşluk beyin-omurilik sıvısıyla doludur: örümcek ağı zar altı boşluk (subaraknoid aralık). Büyük damarlar bu boşluktan geçer. En içte yumuşak zar (pia mater) vardır ve kıvrımların içine kadar iner. Onun altında kabuk başlar. Mavi çizgi bir köprü toplardamarıdır: beyin yüzeyinden sert zara uzanır. Kırmızı daire orta meningeal atardamardır. Kafatası kemiğinin hemen altında seyreder. Şakak bölgesinde şakak kemiği onun üstünü örter.',
  },
  epidural: {
    baslik: 'Epidural kanama (kemik ile sert zar arasında)',
    metin:
      'Çoğunlukla şakak kemiği kırılır ve altındaki orta meningeal atardamar yırtılır. Epidural kanamaların %85’ine kafatası kırığı eşlik eder. Atardamar basıncıyla toplanan kan sert zarı kemikten ayırır. Kafatası dikişleri kanın yayılmasını sınırlar. Bu yüzden BT’de iki yanı dışbükey, mercek biçimli bir görüntü oluşur. Kısa bir bilinç kaybından sonra yakınmalar geçebilir ya da azalabilir. Bu araya “aydınlık dönem” denir. Aydınlık dönem her hastada görülmez.',
  },
  subdural: {
    baslik: 'Subdural kanama (sert zar ile örümcek ağı zar arasında)',
    metin:
      'Beyin yüzeyinden sert zara geçen ince duvarlı köprü toplardamarları kanar. Bu toplardamarların duvarının, sert zarın en iç hücre katmanında en ince olduğu düşünülür. Kan bu katmanda açılan yarıkta yayılır ve hilal biçimini alır. Dikişleri aşabilir, ama sert zarın kıvrımlarını (orak, çadır) aşamaz. Kronik subdural kanamanın risk etkenleri şunlardır: kanı sulandıran ilaçlar, yaşla beynin küçülmesi ve uzun süreli alkol kullanımı. BT’de kanın görünümü zamanla değişir. İlk günlerde kan parlaktır. Sonra yoğunluğu azalır. Yaklaşık iki haftaya kadar beyinle aynı yoğunlukta görünebilir. Üç haftadan eski kan beyinden koyudur.',
  },
  subaraknoid: {
    baslik: 'Subaraknoid kanama (örümcek ağı zarın altında)',
    metin:
      'Kan beyin-omurilik sıvısına karışır ve sıvının dolaştığı aralık boyunca oluklara yayılır. Subaraknoid kanamanın en sık nedeni kafa travmasıdır. Klinik önemi büyük kanamalar ise daha çok damar bozukluklarından olur. Travma dışında en sık neden, kese biçimli (sakküler) bir anevrizmanın yırtılmasıdır. Bir anevrizma yırtılırsa ani ve şiddetli bir baş ağrısı olur. Bazı hastalar bunu “hayatımın en kötü baş ağrısı” diye anlatır. İlk inceleme çoğu zaman BT’dir. Kanamayı aramak için bel delmeyle (lomber ponksiyon) BOS da incelenebilir. Anevrizma ameliyatla klipslenebilir ya da damar içinden platin sarmallarla (koil) doldurulabilir.',
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
          <path
            d={`M0,${DURA_ALT} L380,${DURA_ALT} L380,${ARAK} Q190,${ARAK + 34} 0,${ARAK} Z`}
            fill="#a93226"
            style={goster('subdural')}
          />
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
          {/* Epidural kanama: dikişler arasında mercek; sert zar aşağı itilir */}
          <g style={goster('epidural')}>
            <path d={`M${SUTURLER[0] + 4},${KEMIK_ALT} Q190,${KEMIK_ALT + 46} ${SUTURLER[1] - 4},${KEMIK_ALT} Z`} fill="#c0392b" />
            <path
              d={`M${SUTURLER[0] + 4},${KEMIK_ALT + 4} Q190,${KEMIK_ALT + 54} ${SUTURLER[1] - 4},${KEMIK_ALT + 4}`}
              fill="none"
              stroke="#c9b8a6"
              strokeWidth="8"
            />
          </g>
          {/* Kemik */}
          <rect x="0" y={KEMIK_UST} width="380" height={KEMIK_ALT - KEMIK_UST} fill="#efe7d5" />
          {Array.from({ length: 26 }, (_, i) => (
            <circle key={i} cx={8 + i * 14.5} cy={KEMIK_UST + 15} r="2.2" fill="#ddd1b8" />
          ))}
          {SUTURLER.map((x) => (
            <path key={x} d={`M${x},${KEMIK_UST} l-4,7 l6,6 l-5,7 l5,5 l-2,5`} fill="none" stroke="#8a7a5f" strokeWidth="1.4" />
          ))}
          {/* Orta meningeal atardamar (kemiğin hemen altında) */}
          <circle cx="190" cy={KEMIK_ALT - 1} r="4.5" fill="#d9473c" stroke={durum === 'epidural' ? '#fff' : 'none'} strokeWidth="1.5" />
          {/* Deri */}
          <rect x="0" y="0" width="380" height={KEMIK_UST} fill="#f2cdb9" />
          {/* Köprü toplardamarı: kabuktan sert zara */}
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
            dikiş
          </text>
          <text x={SUTURLER[1] + 6} y={KEMIK_UST + 10} fontSize="8">
            dikiş
          </text>
          <text x="318" y={KEMIK_ALT + 6}>
            sert zar
          </text>
          {/* BOS bandındaki yazılar: çizgilere ve kana binmesinler diye her görünümde boş bir yere konur */}
          {BOS_YAZILARI[durum].map((s) => (
            <text
              key={s.metin}
              x={s.x}
              y={s.y}
              fontSize={s.boyut}
              textAnchor={s.sonda ? 'end' : undefined}
              fill={s.metin === 'BOS' ? '#2f6ea5' : '#55657d'}
              stroke="#cfe6fb"
              strokeWidth="1.6"
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {s.metin}
            </text>
          ))}
          <text x="6" y="168">
            beyaz cevher
          </text>
          <text x="100" y="148" fill="#7a3a33">
            kabuk (gri cevher)
          </text>
          {durum === 'katmanlar' && (
            <>
              <text x="190" y={KEMIK_ALT - 9} fontSize="8" fill="#a5281d" textAnchor="middle">
                orta meningeal atardamar
              </text>
              <text x="296" y="84" fontSize="8.5" fill="#2f55c4" textAnchor="end">
                köprü toplardamarı
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
