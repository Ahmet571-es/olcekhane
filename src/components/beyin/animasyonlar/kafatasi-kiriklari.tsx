'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Kafatası kırıklarının türleri, yandan görünen şematik bir kafatası üzerinde: doğrusal (orta meningeal arterle
 * ilişkisiyle), çökme, diyastatik (dikiş ayrışması), kafa tabanı kırığı belirtileri ve bebeklerdeki "ping-pong" çökmesi.
 * Bilgilerin kaynakları dersin sonundadır; çizim ölçekli değildir.
 */

type Kip = 'dogrusal' | 'cokme' | 'diyastatik' | 'taban' | 'pingpong';

const BILGI: Record<Kip, { baslik: string; metin: string }> = {
  dogrusal: {
    baslik: 'Doğrusal kırık',
    metin:
      'En sık görülen kafatası kırığıdır: kırık çizgileri darbe noktasından dışa doğru yayılır. Çocuk serilerinde de en sık görülen türdür. Tek başına, yer değiştirmemiş basit bir doğrusal kırık, kişi kan sulandırıcı ya da antiagregan kullanmıyorsa genellikle klinik açıdan önemli bir bulgu sayılmaz. Ama kırık şakak bölgesinden geçip altındaki orta meningeal arteri (kırmızı) yırtarsa epidural kanama gelişebilir.',
  },
  cokme: {
    baslik: 'Çökme (depresif) kırık',
    metin:
      'Kemik parçaları çevredeki kemiğin düzeyinin altına, beyne doğru itilir. Beyin dokusu hasarı, enfeksiyon, nöbet ve kanama riski daha yüksektir. Çökmesi kemik kalınlığından derin olan açık kırıklar enfeksiyonu önlemek için ameliyat edilir; açık kırıklarda antibiyotik verilir.',
  },
  diyastatik: {
    baslik: 'Diyastatik kırık (dikiş ayrışması)',
    metin:
      'Kırık bir dikişe ulaşıp onu açar. Bir çalışmada dikiş aralığının 2 mm ya da daha fazla açılması ölçüt alınmıştır. Üç yaşından küçüklerde dikişler zaten geniştir; değerlendirirken bu göz önünde tutulur.',
  },
  taban: {
    baslik: 'Kafa tabanı kırığının belirtileri',
    metin:
      'Kafa tabanı kırıkları en çok şakak kemiğini tutar. Göz çevresinde morluk (“rakun gözü”, çoğunlukla 1–3 gün sonra çıkar), kulak arkasında mastoid üzerinde morluk (Battle belirtisi), kulak zarının arkasında kan ve burundan ya da kulaktan beyin-omurilik sıvısı gelmesi güçlü ipuçlarıdır. Ama bu belirtilerin yokluğu kırığı dışlamaz: tanıda altın standart ince kesitli BT’dir.',
  },
  pingpong: {
    baslik: 'Bebekte “ping-pong” çökmesi',
    metin:
      'Kemiği henüz tam mineralleşmemiş bebek kafatası, kırılmadan bir pinpon topu gibi içe doğru göçer; iç ve dış tabla kopmaz. Yenidoğanda 10.000 doğumda 1–2,5 dolayında görülür; tedavi edilmeyenlerin çoğu 6 ay içinde kendiliğinden düzelir. Çökme 2 cm’den derinse ya da beyne bası varsa cerrahiyle kaldırılması düşünülür.',
  },
};

/** Erişkin kafatası, yandan (yüz solda). */
const KAFATASI =
  'M70,150 C58,92 106,44 180,40 C258,38 312,86 316,150 C318,184 304,210 284,224 L268,236 L176,240 L140,232 C126,240 110,250 96,252 C84,254 74,246 74,236 L66,214 C54,206 50,192 56,182 C60,170 66,160 70,150 Z';

export function KafatasiKiriklari() {
  const [kip, setKip] = useState<Kip>('dogrusal');
  const b = BILGI[kip];
  const bebek = kip === 'pingpong';
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Kırık türü"
        deger={kip}
        onDegis={setKip}
        secenekler={[
          { d: 'dogrusal', ad: 'Doğrusal' },
          { d: 'cokme', ad: 'Çökme' },
          { d: 'diyastatik', ad: 'Diyastatik' },
          { d: 'taban', ad: 'Kafa tabanı' },
          { d: 'pingpong', ad: 'Ping-pong (bebek)' },
        ]}
      />
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 360 290" className="mx-auto w-full max-w-md" role="img" aria-label={b.baslik}>
          <rect x="0" y="0" width="360" height="290" rx="16" fill="#f7f3ea" />
          {!bebek && (
            <g>
              <path d={KAFATASI} fill="#efe1c6" stroke="#9c8d70" strokeWidth="3" />
              {/* Göz çukuru, burun, kulak deliği, elmacık kemeri, mastoid */}
              <ellipse cx="96" cy="160" rx="20" ry="17" fill="#f7f3ea" stroke="#9c8d70" strokeWidth="2" />
              <circle cx="232" cy="186" r="7" fill="#7d6b4f" />
              <path d="M110,196 C150,190 196,190 226,194" fill="none" stroke="#9c8d70" strokeWidth="5" strokeLinecap="round" />
              <path d="M246,198 C252,214 258,226 262,234" fill="none" stroke="#9c8d70" strokeWidth="6" strokeLinecap="round" />
              {/* Dikişler */}
              <g fill="none" stroke="#7d6b4f" strokeWidth="1.6" opacity="0.8">
                <path d="M160,42 C150,90 146,120 142,150" />
                <path d="M142,150 C172,140 214,146 246,168" />
                <path d="M282,74 C262,110 252,140 246,168" />
              </g>
              {/* Orta meningeal arter (kemiğin altında) */}
              <path
                d="M200,196 C186,170 166,150 150,122 M182,166 C200,146 214,124 224,100"
                fill="none"
                stroke="#c0392b"
                strokeWidth="2.4"
                opacity={kip === 'dogrusal' ? 0.9 : 0.25}
              />
            </g>
          )}

          {kip === 'dogrusal' && (
            <path d="M232,70 L214,98 L222,112 L196,140 L190,166" fill="none" stroke="#2b2b2b" strokeWidth="2.6" strokeLinejoin="round" />
          )}
          {kip === 'cokme' && (
            <g>
              <path d="M196,52 C210,66 232,68 250,58 L246,74 C232,84 210,82 198,70 Z" fill="#d9c6a1" stroke="#2b2b2b" strokeWidth="2" />
              <path d="M196,52 L192,40 M250,58 L256,46 M222,64 L222,48" stroke="#2b2b2b" strokeWidth="1.8" />
              <path d="M223,88 L223,104 M215,96 L223,104 L231,96" fill="none" stroke="#c0392b" strokeWidth="2.4" />
            </g>
          )}
          {kip === 'diyastatik' && (
            <path d="M282,74 C262,110 252,140 246,168" fill="none" stroke="#2b2b2b" strokeWidth="6" strokeDasharray="2 3" />
          )}
          {kip === 'taban' && (
            <g>
              <ellipse cx="96" cy="162" rx="30" ry="26" fill="#6b4c8c" opacity="0.38" />
              <ellipse cx="256" cy="222" rx="16" ry="20" fill="#6b4c8c" opacity="0.45" />
              <path d="M70,214 C68,224 66,232 66,240" stroke="#7fb3e0" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="66" cy="246" r="4" fill="#7fb3e0" />
              <path d="M232,194 C232,204 232,212 232,220" stroke="#7fb3e0" strokeWidth="3" strokeLinecap="round" fill="none" />
              <g fontSize="10" fontWeight="700" fill="#4a3366">
                <text x="96" y="122" textAnchor="middle">
                  Rakun gözü
                </text>
                <text x="290" y="262" textAnchor="middle">
                  Battle belirtisi
                </text>
              </g>
              <g fontSize="10" fill="#2f5f8c">
                <text x="20" y="270">
                  Burundan BOS
                </text>
                <text x="190" y="232" textAnchor="end">
                  Kulaktan BOS
                </text>
              </g>
            </g>
          )}
          {bebek && (
            <g>
              <path
                d="M84,170 C76,96 128,52 196,52 C266,52 312,98 306,166 C302,206 282,232 252,242 L132,244 C104,232 88,206 84,170 Z"
                fill="#f2dcc0"
                stroke="#9c8d70"
                strokeWidth="3"
              />
              <path
                d="M84,170 C70,180 66,206 76,224 C84,236 100,244 118,244 L132,244 C112,228 96,206 84,170 Z"
                fill="#f6e8d4"
                stroke="#9c8d70"
                strokeWidth="2"
              />
              <path d="M190,54 C204,76 236,80 256,62" fill="#f7f3ea" stroke="#2b2b2b" strokeWidth="2.4" />
              <path d="M190,54 C204,64 236,66 256,62" fill="none" stroke="#9c8d70" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="222" y="104" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#2b2b2b">
                İçe göçme, kırık yok
              </text>
            </g>
          )}
        </svg>
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-bold">{b.baslik}</p>
          <p className="text-[0.98rem]">{b.metin}</p>
          <p className="t-meta">Çizim şematiktir. Kafa travmasında hangi hastaya BT çekileceğine klinik karar kuralları yol gösterir.</p>
        </div>
      </div>
    </div>
  );
}
