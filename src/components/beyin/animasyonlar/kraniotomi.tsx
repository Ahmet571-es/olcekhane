'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Kafatası nasıl açılır, nasıl kapatılır? Burr delikleri, kemik kapağı, kraniotomi (kapak yerine konur), dekompresif
 * kraniektomi (kapak konmaz, sert zar genişletilir), menteşeli kraniotomi ve kranioplasti. Yandan görünen şematik bir
 * kafatası üzerinde adım adım. Bilgilerin kaynakları dersin sonundadır; çizim ölçekli değildir.
 */

type Adim = 'delik' | 'kapak' | 'kraniotomi' | 'kraniektomi' | 'mentese' | 'kranioplasti';

const BILGI: Record<Adim, { baslik: string; metin: string }> = {
  delik: {
    baslik: '1. Burr delikleri',
    metin:
      'Kafatası bugün, önce açılan birkaç küçük delik (burr hole) birleştirilerek açılır. Pterional yaklaşımda çoğu olguda iki delik yeterlidir.',
  },
  kapak: {
    baslik: '2. Kemik kapağı',
    metin:
      'Delikler bir kraniyotomla birleştirilir ve kemik bir kapak (flep) olarak kaldırılır. Altta sert zar görünür; cerrah onu açarak beyne ulaşır.',
  },
  kraniotomi: {
    baslik: '3. Kraniotomi: kapak yerine konur',
    metin:
      'İşlem bitince kemik kapağı geri konur ve düşük profilli titanyum plaklar, delik kapakları ve 4–5 mm’lik vidalarla tespit edilir. Kafatasının geçici olarak açılmasına kraniotomi denir.',
  },
  kraniektomi: {
    baslik: '4. Dekompresif kraniektomi: kapak konmaz',
    metin:
      'Beyin aşırı şiştiğinde kemik kapağı geri konmaz ve sert zar açılıp genişletilir; beyne dışarı doğru yer açılır. Ağır kafa travmasında kılavuzlar en az 12 × 15 cm (ya da 15 cm çaplı) geniş bir kraniektomi önerir. Çıkarılan kemik dondurularak ya da karın derisinin altında saklanabilir.',
  },
  mentese: {
    baslik: 'Seçenek: menteşeli kraniotomi',
    metin:
      'Kemik kapağı yerine konur ama yalnızca bir kenarından titanyum plakla tutturulur. Böylece beyin şişerse kapak dışa doğru açılabilir, beyne doğru çökmez.',
  },
  kranioplasti: {
    baslik: '5. Kranioplasti: kafatası yeniden kapatılır',
    metin:
      'Haftalar ya da aylar sonra hastanın kendi kemiği ya da titanyum, PMMA, PEEK gibi yapay bir malzemeyle kafatası onarılır; günümüzde hastaya özel üretilmiş implantlar da kullanılır. Komplikasyon oranı sıradan beyin cerrahisi işlemlerinden yüksektir; en sık sorunlar enfeksiyon ve kemiğin erimesidir. En uygun zaman ve malzeme konusunda uzlaşı yoktur.',
  },
};

const KAFA = 'M60,170 C50,96 112,40 196,38 C282,38 336,98 336,168 C336,214 310,246 270,256 L120,256 C86,246 64,212 60,170 Z';
/** Kemik kapağının (flep) sınırı. */
const KAPAK = 'M118,96 C156,66 220,60 262,84 C286,110 286,170 262,198 C220,214 160,212 128,196 C104,168 102,128 118,96 Z';
/** Kraniektomide şişen beynin dışa taşan sınırı. */
const SISKIN = 'M118,96 C150,52 230,46 270,80 C300,112 300,174 268,206 C222,226 154,222 124,200 C96,170 96,124 118,96 Z';
const DELIKLER: [number, number][] = [
  [130, 104],
  [252, 96],
  [256, 188],
  [136, 186],
];

export function Kraniotomi() {
  const [adim, setAdim] = useState<Adim>('delik');
  const b = BILGI[adim];
  const kapakYok = adim === 'kapak' || adim === 'kraniektomi';
  const deliklerGorunur = adim === 'delik' || adim === 'kapak' || adim === 'kraniotomi' || adim === 'mentese';
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Adım"
        deger={adim}
        onDegis={setAdim}
        secenekler={[
          { d: 'delik', ad: 'Burr delikleri' },
          { d: 'kapak', ad: 'Kemik kapağı' },
          { d: 'kraniotomi', ad: 'Kraniotomi' },
          { d: 'kraniektomi', ad: 'Kraniektomi' },
          { d: 'mentese', ad: 'Menteşeli' },
          { d: 'kranioplasti', ad: 'Kranioplasti' },
        ]}
      />
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 380 320" className="mx-auto w-full max-w-md" role="img" aria-label={b.baslik}>
          <rect x="0" y="0" width="380" height="320" rx="16" fill="#f7f3ea" />
          {/* Kafa: kemik */}
          <path d={KAFA} fill="#efe1c6" stroke="#9c8d70" strokeWidth="3" />
          <ellipse cx="78" cy="168" rx="14" ry="12" fill="#f7f3ea" stroke="#9c8d70" strokeWidth="1.5" />
          <circle cx="250" cy="230" r="6" fill="#7d6b4f" />
          {/* Şişen beyin (kraniektomi) */}
          {adim === 'kraniektomi' && <path d={SISKIN} fill="#e8b7ab" stroke="#c98d80" strokeWidth="2" />}
          {/* Kapak alanı: kapak yokken sert zar görünür */}
          {kapakYok && adim !== 'kraniektomi' && <path d={KAPAK} fill="#c9d6c2" stroke="#7f9a79" strokeWidth="2" />}
          {adim === 'kraniektomi' && <path d={KAPAK} fill="none" stroke="#7f9a79" strokeWidth="2" strokeDasharray="6 4" />}
          {/* Kapak yerinde (kraniotomi, menteşeli, kranioplasti) ya da kesilmeye hazır (delik) */}
          {!kapakYok && (
            <path
              d={KAPAK}
              fill={adim === 'kranioplasti' ? '#c9cfd8' : '#e8d6b4'}
              stroke={adim === 'delik' ? '#9c8d70' : '#5a4a32'}
              strokeWidth={adim === 'delik' ? 1.4 : 2.4}
              strokeDasharray={adim === 'delik' ? '5 5' : undefined}
              transform={adim === 'mentese' ? 'rotate(-5 120 150)' : undefined}
            />
          )}
          {/* Kaldırılmış kapak (yanda) */}
          {adim === 'kapak' && (
            <g>
              <g transform="translate(266,264) scale(0.3)">
                <path d={KAPAK} fill="#e8d6b4" stroke="#5a4a32" strokeWidth="6" transform="translate(-102,-60)" />
              </g>
              <text x="258" y="292" textAnchor="end" fontSize="10.5" fontWeight="700" fill="#5a4a32">
                Kaldırılan kemik kapağı
              </text>
            </g>
          )}
          {/* Burr delikleri */}
          {deliklerGorunur &&
            DELIKLER.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="8"
                fill={adim === 'delik' || adim === 'kapak' ? '#3b3326' : '#9aa3ad'}
                stroke="#2b2b2b"
                strokeWidth="1.2"
              />
            ))}
          {/* Titanyum plaklar */}
          {(adim === 'kraniotomi' || adim === 'mentese') && (
            <g fill="#9aa3ad" stroke="#4a5562" strokeWidth="1.2">
              {(adim === 'mentese' ? DELIKLER.slice(0, 1) : DELIKLER).map(([x, y], i) => (
                <g key={i}>
                  <rect x={x - 14} y={y - 4} width="28" height="8" rx="3" />
                  <circle cx={x - 9} cy={y} r="2" fill="#4a5562" />
                  <circle cx={x + 9} cy={y} r="2" fill="#4a5562" />
                </g>
              ))}
            </g>
          )}
          {adim === 'mentese' && (
            <g>
              <path d="M268,104 C300,118 306,168 278,196" fill="none" stroke="#c0392b" strokeWidth="2.6" strokeLinecap="round" />
              <path
                d="M286,184 L278,196 L292,196"
                fill="none"
                stroke="#c0392b"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="190" y="290" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#5a4a32">
                Menteşe solda; serbest kenar dışa açılabilir
              </text>
            </g>
          )}
          {adim === 'kraniektomi' && (
            <g fill="none" stroke="#c0392b" strokeWidth="2.6" strokeLinecap="round">
              <path d="M196,78 L196,52 M188,60 L196,52 L204,60" />
              <path d="M288,140 L312,140 M304,132 L312,140 L304,148" />
            </g>
          )}
          {adim === 'kranioplasti' && (
            <text x="196" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2b2b2b">
              Kemik ya da implant
            </text>
          )}
        </svg>
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-bold">{b.baslik}</p>
          <p className="text-[0.98rem]">{b.metin}</p>
        </div>
      </div>
    </div>
  );
}
