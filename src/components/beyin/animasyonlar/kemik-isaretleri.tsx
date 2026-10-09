'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Kemik işaretlerinin dili (OpenStax 6.3, Tablo 6.2'nin üç sınıfı): eklem yüzleri, çıkıntılar, delikler ve çukurlar.
 * Her terim küçük bir şematik çizimle gösterilir; altında kafatasındaki örneği ve bu derste nerede görüleceği yazar.
 * Çizimler şematiktir, ölçekli değildir.
 */

type Grup = 'eklem' | 'cikinti' | 'delik';

interface Isaret {
  d: string;
  grup: Grup;
  ad: string;
  latince: string;
  tanim: string;
  ornek: string;
  ikon: React.ReactNode;
}

const KEMIK = '#efe1c6';
const CIZGI = '#9c8d70';
const VURGU = '#d1495b';

/** Ortak taban: düz bir kemik parçası. */
function Taban({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <path d="M8,46 C30,40 90,40 112,46 L112,70 C90,74 30,74 8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
      {children}
    </>
  );
}

const ISARETLER: Isaret[] = [
  {
    d: 'bas',
    grup: 'eklem',
    ad: 'Baş',
    latince: 'Caput',
    tanim: 'Belirgin, yuvarlak eklem yüzü.',
    ornek: 'Alt çenenin kondil başı (caput mandibulae): şakak kemiğinin çene eklem çukuruna oturur.',
    ikon: (
      <>
        <path d="M14,58 L62,58" stroke={CIZGI} strokeWidth="16" strokeLinecap="round" />
        <path d="M14,58 L62,58" stroke={KEMIK} strokeWidth="12" strokeLinecap="round" />
        <circle cx="82" cy="50" r="22" fill={KEMIK} stroke={VURGU} strokeWidth="3" />
      </>
    ),
  },
  {
    d: 'kondil',
    grup: 'eklem',
    ad: 'Kondil',
    latince: 'Condylus',
    tanim: 'Yuvarlak, boğum gibi eklem yüzü.',
    ornek: 'Art kafa kemiğinin iki kondili: foramen magnumun iki yanında, birinci boyun omuruyla (atlas) eklem yapar.',
    ikon: (
      <>
        <path
          d="M20,20 L100,20 L100,44 C100,64 82,70 74,58 C68,50 52,50 46,58 C38,70 20,64 20,44 Z"
          fill={KEMIK}
          stroke={CIZGI}
          strokeWidth="2"
        />
        <path d="M100,44 C100,64 82,70 74,58 M46,58 C38,70 20,64 20,44" fill="none" stroke={VURGU} strokeWidth="3.5" />
      </>
    ),
  },
  {
    d: 'faset',
    grup: 'eklem',
    ad: 'Eklem yüzü (faset)',
    latince: 'Facies articularis',
    tanim: 'Düz eklem yüzü.',
    ornek: 'Kitaptaki örnek omurların eklem yüzleridir; atlas ve aksisin eklem yüzleri ünitenin 4. dersinde.',
    ikon: (
      <>
        <rect x="24" y="24" width="72" height="42" rx="8" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <path d="M34,26 C50,32 70,32 86,26" fill="none" stroke={VURGU} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  {
    d: 'cikinti',
    grup: 'cikinti',
    ad: 'Çıkıntı',
    latince: 'Processus',
    tanim: 'Kemik yüzeyinden belirgin biçimde uzanan bölüm; kirişler ve bağlar tutunur.',
    ornek: 'Şakak kemiğinin mastoid ve stiloid çıkıntıları; alt çenenin koronoid çıkıntısı.',
    ikon: (
      <Taban>
        <path d="M48,44 C52,26 60,12 66,10 C72,12 74,28 72,44 Z" fill={KEMIK} stroke={VURGU} strokeWidth="3" />
      </Taban>
    ),
  },
  {
    d: 'protuberans',
    grup: 'cikinti',
    ad: 'Protuberans',
    latince: 'Protuberantia',
    tanim: 'Yüzeyden dışarı doğru belirgin bir kabarıklık.',
    ornek:
      'Art kafa kemiğinin dış art kafa çıkıntısı (protuberantia occipitalis externa; ölçüm noktası inion) ve alt çenenin çene çıkıntısı.',
    ikon: (
      <Taban>
        <path d="M34,46 C40,24 80,24 86,46 Z" fill={KEMIK} stroke={VURGU} strokeWidth="3" />
      </Taban>
    ),
  },
  {
    d: 'diken',
    grup: 'cikinti',
    ad: 'Diken',
    latince: 'Spina',
    tanim: 'Sivri, keskin uçlu çıkıntı.',
    ornek: 'Kama kemiğinin dikeni ve üst çenelerin ön burun dikeni.',
    ikon: (
      <Taban>
        <path d="M52,44 L62,6 L70,44 Z" fill={KEMIK} stroke={VURGU} strokeWidth="3" strokeLinejoin="round" />
      </Taban>
    ),
  },
  {
    d: 'tuberkul',
    grup: 'cikinti',
    ad: 'Tüberkül',
    latince: 'Tuberculum',
    tanim: 'Küçük, yuvarlak çıkıntı.',
    ornek: 'Şakak kemiğinin eklem tümseği (tuberculum articulare); art kafa kemiğinin farengeal ve juguler tüberkülleri.',
    ikon: (
      <Taban>
        <circle cx="60" cy="40" r="9" fill={KEMIK} stroke={VURGU} strokeWidth="3" />
      </Taban>
    ),
  },
  {
    d: 'tuberozite',
    grup: 'cikinti',
    ad: 'Pürüzlü kabartı',
    latince: 'Tuberositas',
    tanim: 'Kabarık, pürüzlü yüzey.',
    ornek: 'Kitaptaki örnek kol kemiğinin deltoid kabartısıdır.',
    ikon: (
      <Taban>
        <path d="M34,46 C42,34 78,34 86,46 Z" fill={KEMIK} stroke={VURGU} strokeWidth="3" />
        <g fill={VURGU}>
          <circle cx="48" cy="42" r="1.6" />
          <circle cx="56" cy="39" r="1.6" />
          <circle cx="64" cy="39" r="1.6" />
          <circle cx="72" cy="42" r="1.6" />
          <circle cx="60" cy="43" r="1.6" />
        </g>
      </Taban>
    ),
  },
  {
    d: 'cizgi',
    grup: 'cikinti',
    ad: 'Çizgi',
    latince: 'Linea',
    tanim: 'Hafif, uzun bir sırt.',
    ornek: 'Yan kafa kemiklerinin şakak çizgileri; alt çenenin iç yüzündeki milohyoid çizgi.',
    ikon: (
      <Taban>
        <path d="M16,56 C40,50 80,50 104,56" fill="none" stroke={VURGU} strokeWidth="3" strokeLinecap="round" />
      </Taban>
    ),
  },
  {
    d: 'krista',
    grup: 'cikinti',
    ad: 'Krista (sırt)',
    latince: 'Crista',
    tanim: 'Belirgin, uzun sırt.',
    ornek: 'Kalbur kemiğinin horoz ibiği (crista galli) ve alın kemiğinin iç yüzündeki alın kristası.',
    ikon: (
      <Taban>
        <path d="M18,46 C34,30 52,24 60,24 C68,24 86,30 102,46 Z" fill={KEMIK} stroke={VURGU} strokeWidth="3" />
      </Taban>
    ),
  },
  {
    d: 'delik',
    grup: 'delik',
    ad: 'Delik',
    latince: 'Foramen',
    tanim: 'Kemiği boydan boya geçen açıklık; damarlar ve sinirler buradan geçer.',
    ornek: 'Art kafa kemiğinin büyük deliği (foramen magnum); kama kemiğinin oval ve yuvarlak delikleri.',
    ikon: (
      <>
        <path d="M14,30 L106,30 L106,64 L14,64 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <ellipse cx="60" cy="47" rx="16" ry="10" fill="#f7f3ea" stroke={VURGU} strokeWidth="3" />
      </>
    ),
  },
  {
    d: 'fossa',
    grup: 'delik',
    ad: 'Çukur',
    latince: 'Fossa',
    tanim: 'Uzunca, çanak gibi çukurluk.',
    ornek: 'Şakak kemiğinin çene eklem çukuru (fossa mandibularis); kama kemiğindeki hipofiz çukuru.',
    ikon: <path d="M8,30 L30,30 C40,58 80,58 90,30 L112,30 L112,70 L8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />,
  },
  {
    d: 'fovea',
    grup: 'delik',
    ad: 'Küçük çukur (fovea)',
    latince: 'Fovea',
    tanim: 'Küçük, yuvarlak çukurcuk.',
    ornek: 'Alın kemiğinin göz çukuru tavanındaki troklear çukur (fovea trochlearis); atlasın dens eklem yüzü (fovea dentis).',
    ikon: (
      <>
        <path d="M8,30 L50,30 C52,44 68,44 70,30 L112,30 L112,70 L8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <path d="M50,30 C52,44 68,44 70,30" fill="none" stroke={VURGU} strokeWidth="3" />
      </>
    ),
  },
  {
    d: 'oluk',
    grup: 'delik',
    ad: 'Oluk',
    latince: 'Sulcus',
    tanim: 'Yüzeyde uzanan uzun, dar oluk; sinüs oluğunda olduğu gibi içinde bir damar yatar.',
    ornek: 'Şakak kemiğinin iç yüzündeki sigmoid sinüs oluğu.',
    ikon: (
      <>
        <path d="M8,26 L112,26 L112,70 L8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <path d="M14,44 C40,36 80,54 106,44" fill="none" stroke={VURGU} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <path d="M14,44 C40,36 80,54 106,44" fill="none" stroke="#7d6b4f" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    d: 'kanal',
    grup: 'delik',
    ad: 'Kanal',
    latince: 'Canalis',
    tanim: 'Kemiğin içinden geçen tünel.',
    ornek: 'Kama kemiğinin optik kanalı; art kafa kemiğinin hipoglossal kanalı; şakak kemiğindeki yüz siniri kanalı.',
    ikon: (
      <>
        <path d="M8,26 L112,26 L112,70 L8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <ellipse cx="18" cy="48" rx="6" ry="9" fill="#f7f3ea" stroke={VURGU} strokeWidth="2.5" />
        <path d="M18,39 L102,39 M18,57 L102,57" stroke={VURGU} strokeWidth="2" strokeDasharray="5 4" />
        <ellipse cx="102" cy="48" rx="6" ry="9" fill="none" stroke={VURGU} strokeWidth="2" strokeDasharray="5 4" />
      </>
    ),
  },
  {
    d: 'yarik',
    grup: 'delik',
    ad: 'Yarık',
    latince: 'Fissura',
    tanim: 'Kemikte dar, uzun, yarık biçiminde açıklık.',
    ornek: 'Kama kemiğinin kanatları arasındaki üst göz çukuru yarığı (fissura orbitalis superior).',
    ikon: (
      <>
        <path d="M8,26 L112,26 L112,70 L8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <path d="M24,40 C48,44 72,52 98,58 L96,62 C70,58 46,50 22,46 Z" fill="#f7f3ea" stroke={VURGU} strokeWidth="2.5" />
      </>
    ),
  },
  {
    d: 'meatus',
    grup: 'delik',
    ad: 'Yol (meatus)',
    latince: 'Meatus',
    tanim: 'Bir kanala açılan ağız.',
    ornek: 'Dış kulak yolu ve iç kulak yolu (şakak kemiği).',
    ikon: (
      <>
        <path d="M8,26 L112,26 L112,70 L8,70 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <ellipse cx="34" cy="48" rx="12" ry="15" fill="#3d3326" stroke={VURGU} strokeWidth="3" />
        <path d="M44,40 L98,44 M44,56 L98,52" stroke="#7d6b4f" strokeWidth="1.6" strokeDasharray="4 4" />
      </>
    ),
  },
  {
    d: 'sinus',
    grup: 'delik',
    ad: 'Sinüs',
    latince: 'Sinus',
    tanim: 'Kemiğin içindeki, havayla dolu boşluk.',
    ornek: 'Alın kemiğinin frontal sinüsü, üst çenenin maksiller sinüsü, kama kemiğinin sfenoid sinüsü.',
    ikon: (
      <>
        <path d="M8,22 L112,22 L112,72 L8,72 Z" fill={KEMIK} stroke={CIZGI} strokeWidth="2" />
        <path
          d="M30,34 C44,28 76,28 90,36 C96,48 88,60 70,62 C52,64 30,60 26,50 C24,42 26,38 30,34 Z"
          fill="#e8f2f8"
          stroke={VURGU}
          strokeWidth="3"
        />
      </>
    ),
  },
];

const GRUPLAR: { d: Grup; ad: string; aciklama: string }[] = [
  {
    d: 'eklem',
    ad: 'Eklem yüzleri',
    aciklama: 'İki kemiğin buluştuğu yüzeyler. Birbirine uyacak biçimdedir: biri yuvarlaksa öteki çoğu zaman çukurdur.',
  },
  {
    d: 'cikinti',
    ad: 'Çıkıntılar',
    aciklama: 'Yüzeyden yükselen işaretler. Kirişler ve bağlar buralara tutunur; büyüklükleri ve biçimleri oraya binen kuvveti yansıtır.',
  },
  {
    d: 'delik',
    ad: 'Delikler ve çukurlar',
    aciklama: 'Açıklıklar, oluklar ve boşluklar. Damarlar ve sinirler buralardan geçer; büyüklükleri geçen yapının büyüklüğünü yansıtır.',
  },
];

export function KemikIsaretleri() {
  const [grup, setGrup] = useState<Grup>('cikinti');
  const [secili, setSecili] = useState('cikinti');
  const grupBilgi = GRUPLAR.find((g) => g.d === grup)!;
  const liste = ISARETLER.filter((i) => i.grup === grup);
  const i = ISARETLER.find((x) => x.d === secili && x.grup === grup) ?? liste[0];
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="İşaret sınıfı"
        deger={grup}
        onDegis={(g) => {
          setGrup(g);
          setSecili(ISARETLER.find((x) => x.grup === g)!.d);
        }}
        secenekler={GRUPLAR.map((g) => ({ d: g.d, ad: g.ad }))}
      />
      <p className="t-small text-ink-2">{grupBilgi.aciklama}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label={`${grupBilgi.ad}: terimler`}>
        {liste.map((x) => (
          <button
            key={x.d}
            type="button"
            className="beyin-secenek flex flex-col items-center gap-1 !rounded-2xl !px-2 !py-2"
            aria-pressed={x.d === i.d}
            onClick={() => setSecili(x.d)}
          >
            <svg viewBox="0 0 120 80" className="h-10 w-full" aria-hidden="true">
              {x.ikon}
            </svg>
            <span className="text-center text-[0.8rem] leading-tight">{x.ad}</span>
          </button>
        ))}
      </div>
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <svg viewBox="0 0 120 80" className="mx-auto w-full max-w-xs" role="img" aria-label={`${i.ad} (${i.latince}), şematik çizim`}>
          <rect x="0" y="0" width="120" height="80" rx="8" fill="#f7f3ea" />
          {i.ikon}
        </svg>
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-bold">
            {i.ad} <i lang="la">({i.latince})</i>
          </p>
          <p className="text-[0.98rem]">{i.tanim}</p>
          <p className="text-[0.98rem]">
            <b>Örnek:</b> {i.ornek}
          </p>
          <p className="t-meta">Çizimler şematiktir. Kaynak: OpenStax 6.3 (kemik işaretleri tablosu).</p>
        </div>
      </div>
    </div>
  );
}
