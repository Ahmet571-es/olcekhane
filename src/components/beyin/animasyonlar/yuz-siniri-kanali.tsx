'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Yüz siniri kanalının şakak kemiği içindeki seyri, şematik: iç kulak yolunun dibinden labirent kesimi, kanalın
 * dirseği ve büyük petrozal sinir, timpanik (yatay) kesim, ikinci dirsek, mastoid (dikey) kesim, korda timpani ve
 * stilomastoid delik. Uzunluklar ve oranlar şakak kemiği bölümündeki kaynaklardandır (Gupta ve ark., 2013; Kalaiarasi
 * ve ark., 2018; Ryu ve Kim, 2016; Gray, 1918; FIPAT, 2019). Çizim ölçekli değildir.
 */

type Kesim = 'giris' | 'labirent' | 'timpanik' | 'dirsek' | 'mastoid' | 'cikis';

const BILGI: Record<Kesim, { baslik: string; metin: string }> = {
  giris: {
    baslik: 'Giriş: iç kulak yolunun dibi',
    metin:
      'Yüz siniri, işitme-denge siniriyle birlikte iç kulak yolundan girer. Yolun dibi bir enine sırtla üst ve alt bölmelere ayrılır; yüz siniri kanalı dipteki ön-üst bölmeden başlar. Sinirin şakak kemiği içindeki toplam yolu yaklaşık 30 mm’dir.',
  },
  labirent: {
    baslik: 'Labirent kesimi ve kanalın dirseği',
    metin:
      'Sinirin hem en kısa (3–5 mm; 50 kemiklik bir diseksiyonda ortalama 4,1 mm) hem en dar (0,7 mm’den ince) kesimi. Kanal sonra keskin bir dirsek yapar (TA2’de geniculum canalis facialis). Büyük petrozal sinir buradan ayrılır ve kayalık kısmın ön yüzündeki kendi adını taşıyan hiatustan çıkar.',
  },
  timpanik: {
    baslik: 'Timpanik (yatay) kesim',
    metin:
      'Yatay uzanır; diseksiyonda ortalama 9,34 mm. Kemik örtüdeki doğal açıklıklar (dehisans) en sık bu kesimdedir: insanların %41–75’inde. Oval pencereye doğru sarkan bir sinir stapes ve kulak cerrahisinde yaralanma riskini artırır.',
  },
  dirsek: {
    baslik: 'İkinci dirsek',
    metin:
      'Piramidal çıkıntı hizasında kanal 95°–125° açıyla aşağı döner. Bir diseksiyon serisinde kemik korteksten ortalama 19 mm derindeydi. Mastoid cerrahisinde istemeden oluşan yüz felcinin en sık yeri burasıdır.',
  },
  mastoid: {
    baslik: 'Mastoid (dikey) kesim',
    metin:
      'Dış kulak yolunun arka-içinde aşağı iner; erişkinde yaklaşık 13 mm (diseksiyonda 12,8 mm). Alt üçte biri digastrik sırtın 2–5 mm ön-içindedir. Korda timpani bu kesimden, stilomastoid deliğin 2–6 mm (ortalama 4,4 mm) üstünden ayrılır.',
  },
  cikis: {
    baslik: 'Çıkış: stilomastoid delik',
    metin:
      'Sinir kafatasını stiloid ile mastoid çıkıntılar arasındaki stilomastoid delikten terk eder. Bebek ile erişkin arasındaki asıl fark buradadır: mastoid ucu geliştikçe kafatası dışındaki sinir daha aşağıda ve daha içte konumlanır; mastoid ucu gelişmemiş bebekte sinir daha yüzeyeldir.',
  },
};

const RENK = { kanal: '#c9b48a', aktif: '#d1495b', sinir: '#f2c14e', yan: '#5b8fb9' };

export function YuzSiniriKanali() {
  const [k, setK] = useState<Kesim>('labirent');
  const b = BILGI[k];
  const r = (x: Kesim) => (k === x ? RENK.aktif : RENK.kanal);
  const g = (x: Kesim) => (k === x ? 9 : 7);
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Kanalın kesimi"
        deger={k}
        onDegis={setK}
        secenekler={[
          { d: 'giris', ad: 'Giriş' },
          { d: 'labirent', ad: 'Labirent' },
          { d: 'timpanik', ad: 'Timpanik' },
          { d: 'dirsek', ad: 'İkinci dirsek' },
          { d: 'mastoid', ad: 'Mastoid' },
          { d: 'cikis', ad: 'Çıkış' },
        ]}
      />
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 360 280" className="mx-auto w-full max-w-md" role="img" aria-label={`Yüz siniri kanalı: ${b.baslik}`}>
          <rect x="0" y="0" width="360" height="280" rx="16" fill="#f7f3ea" />
          {/* Kayalık kısmın silueti */}
          <path
            d="M14,128 C40,70 120,40 220,46 C292,50 334,84 340,140 C346,200 320,250 286,266 L238,268 C222,230 196,176 150,160 C100,146 50,150 14,128 Z"
            fill="#efe1c6"
            stroke="#9c8d70"
            strokeWidth="2"
          />
          {/* Yönler */}
          <g fontSize="9.5" fill="#7d6b4f">
            <text x="20" y="22">
              ← ön, iç
            </text>
            <text x="340" y="22" textAnchor="end">
              arka, dış →
            </text>
          </g>
          {/* Lateral yarım daire kanalı ve oval pencere (işaret) */}
          <path d="M176,64 C182,42 222,38 232,60" fill="none" stroke={RENK.yan} strokeWidth="3" strokeLinecap="round" />
          <text x="204" y="34" fontSize="9" textAnchor="middle" fill={RENK.yan}>
            Lateral yarım daire kanalı
          </text>
          <ellipse cx="178" cy="112" rx="10" ry="6" fill="#fff" stroke={RENK.yan} strokeWidth="2" />
          <text x="178" y="132" fontSize="9" textAnchor="middle" fill={RENK.yan}>
            Oval pencere
          </text>
          {/* İç kulak yolu */}
          <ellipse
            cx="44"
            cy="112"
            rx="13"
            ry="17"
            fill="#3d3326"
            stroke={k === 'giris' ? RENK.aktif : '#7d6b4f'}
            strokeWidth={k === 'giris' ? 4 : 2}
          />
          <text x="44" y="146" fontSize="9.5" textAnchor="middle" fill="#2b2b2b">
            İç kulak yolu
          </text>
          {/* Büyük petrozal sinir */}
          <path
            d="M104,74 C84,62 64,56 40,52"
            fill="none"
            stroke={RENK.sinir}
            strokeWidth="3"
            strokeDasharray={k === 'labirent' ? undefined : '5 4'}
          />
          <text x="22" y="44" fontSize="9" fill="#8a6d1c">
            Büyük petrozal sinir
          </text>
          {/* Kanalın kesimleri */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M56,104 C72,92 90,80 106,72" stroke={r('labirent')} strokeWidth={g('labirent')} />
            <path d="M106,72 C112,70 116,74 118,80 C150,92 214,90 262,96" stroke={r('timpanik')} strokeWidth={g('timpanik')} />
            <path d="M262,96 C274,100 280,110 280,124" stroke={r('dirsek')} strokeWidth={g('dirsek')} />
            <path d="M280,124 L284,236" stroke={r('mastoid')} strokeWidth={g('mastoid')} />
          </g>
          {/* Korda timpani */}
          <path
            d="M283,214 C262,190 236,164 214,142"
            fill="none"
            stroke={RENK.sinir}
            strokeWidth="2.6"
            strokeDasharray={k === 'mastoid' ? undefined : '5 4'}
          />
          <text x="236" y="198" fontSize="9" textAnchor="end" fill="#8a6d1c">
            Korda timpani
          </text>
          {/* Piramidal çıkıntı */}
          <path d="M252,114 L262,124 L248,128 Z" fill="#d8c99b" stroke="#9c8d70" strokeWidth="1.5" />
          <text x="244" y="146" fontSize="9" textAnchor="end" fill="#2b2b2b">
            Piramidal çıkıntı
          </text>
          {/* Stilomastoid delik */}
          <circle
            cx="284"
            cy="244"
            r="7"
            fill="#3d3326"
            stroke={k === 'cikis' ? RENK.aktif : '#7d6b4f'}
            strokeWidth={k === 'cikis' ? 4 : 2}
          />
          <text x="274" y="266" fontSize="9.5" textAnchor="end" fill="#2b2b2b">
            Stilomastoid delik
          </text>
          {/* Kesim adları */}
          <g fontSize="9.5" fontWeight="700" fill="#2b2b2b">
            <text x="70" y="78">
              1
            </text>
            <text x="190" y="80">
              2
            </text>
            <text x="292" y="104">
              3
            </text>
            <text x="296" y="180">
              4
            </text>
          </g>
        </svg>
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-bold">{b.baslik}</p>
          <p className="text-[0.98rem]">{b.metin}</p>
          <p className="t-meta">
            1 labirent kesimi, 2 timpanik kesim, 3 ikinci dirsek, 4 mastoid kesim. Çizim şematiktir; uzunluklar farklı çalışmalardan ve
            farklı ölçüm noktalarıyla alınmıştır. Kaynaklar şakak kemiği bölümündedir.
          </p>
        </div>
      </div>
    </div>
  );
}
