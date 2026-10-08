'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Kafatası tabanının içten (yukarıdan) şematik görünüşü: tabanı yapan beş kemik, üç kafa çukuru ve delikler. Bir
 * deliğe ya da alttaki düğmelerden birine dokununca o deliğin hangi kemikte olduğu ve içinden neyin geçtiği yazar.
 * Çizim şematiktir; oranlar gerçeğe yakın ama ölçekli değildir. Bilgilerin kaynakları dersin sonundadır.
 */

type Kip = 'kemikler' | 'cukurlar' | 'delikler';
type CukurId = 'on' | 'orta' | 'arka';
type KemikId = 'alin' | 'kalbur' | 'kama' | 'sakak' | 'artkafa';
type DelikId =
  | 'kribriform'
  | 'crista'
  | 'optik'
  | 'sof'
  | 'rotundum'
  | 'ovale'
  | 'spinosum'
  | 'lacerum'
  | 'karotis'
  | 'sella'
  | 'akustik'
  | 'juguler'
  | 'hipoglossal'
  | 'magnum';

const KEMIK: Record<KemikId, { ad: string; renk: string; metin: string }> = {
  alin: {
    ad: 'Alın kemiği (frontal)',
    renk: '#f4a261',
    metin: 'İçe doğru uzanan yassı kısmı hem göz çukurunun tavanını hem ön kafa çukurunun tabanını yapar.',
  },
  kalbur: {
    ad: 'Kalbur kemiği (etmoid)',
    renk: '#f9c74f',
    metin:
      'Orta hattaki elek gibi delikli plak (kribriform plak) ve horoz ibiği (crista galli) bu kemiğindir. Koku sinirinin lifleri bu deliklerden geçer.',
  },
  kama: {
    ad: 'Kama kemiği (sfenoid)',
    renk: '#e76f51',
    metin:
      'Neredeyse bütün kafatası kemikleriyle birleştiği için “kilit taşı” kemiktir. Küçük kanatları ön ve orta çukuru ayırır; gövdesinde hipofizin oturduğu sella turcica, büyük kanadında V2, V3 ve orta meningeal arterin delikleri bulunur.',
  },
  sakak: {
    ad: 'Şakak kemiği (temporal)',
    renk: '#90be6d',
    metin:
      'Çapraz uzanan sert kayalık kısmı (pars petrosa) orta ve iç kulağı içinde taşır ve orta çukurla arka çukuru ayıran sırtı yapar. Karotis kanalı ve iç kulak yolu bu kısımdadır.',
  },
  artkafa: {
    ad: 'Art kafa kemiği (oksipital)',
    renk: '#b8a6e6',
    metin:
      'Arka kafa çukurunun tabanını ve arka duvarını yapar. Ortasındaki büyük delikten (foramen magnum) omurilik soğanı omuriliğe geçer.',
  },
};

const CUKUR: Record<CukurId, { ad: string; renk: string; kemikler: string; icinde: string; metin: string }> = {
  on: {
    ad: 'Ön kafa çukuru',
    renk: '#f7d774',
    kemikler: 'Alın kemiğinin göz çukuru tavanı, kalbur kemiği, kama kemiğinin küçük kanatları',
    icinde: 'Frontal lobların tabanı ve koku soğancıkları',
    metin: 'Üç çukurun en öndeki ve en sığıdır; göz çukurlarının hemen üstündedir. Arka sınırı kama kemiğinin küçük kanatlarıdır.',
  },
  orta: {
    ad: 'Orta kafa çukuru',
    renk: '#f4a3b5',
    kemikler: 'Kama kemiğinin gövdesi ve büyük kanatları, şakak kemiği',
    icinde: 'Temporal loblar; ortada, sella turcica’nın çukurunda hipofiz bezi',
    metin:
      'Önde küçük kanatlardan arkada kayalık sırtlara uzanır. Çapraz duran kayalık sırtlar ona kelebek biçimi verir: ortada dar, yanlarda geniş.',
  },
  arka: {
    ad: 'Arka kafa çukuru',
    renk: '#8fc1f2',
    kemikler: 'Art kafa kemiği ve şakak kemiğinin kayalık kısmının arka yüzü',
    icinde: 'Beyincik; foramen magnumda omurilik soğanı omuriliğe geçer',
    metin: 'En arkadaki ve en derin çukurdur. Ön sınırı kayalık sırtlardır; tabanını ve arka duvarını art kafa kemiği yapar.',
  },
};

const DELIK: Record<DelikId, { ad: string; latince: string; kemik: string; gecen: string[]; not: string; cukur: CukurId }> = {
  kribriform: {
    ad: 'Kribriform (elek) plak delikleri',
    latince: 'Lamina cribrosa, foramina olfactoria',
    kemik: 'Kalbur kemiği',
    gecen: ['Koku sinirinin (I) lifleri'],
    not: 'Kafa tabanının en ince yeridir. Kırığında koku kaybı olabilir; üstündeki ince sert zar da yırtılırsa beyin-omurilik sıvısı burundan akar.',
    cukur: 'on',
  },
  crista: {
    ad: 'Crista galli (horoz ibiği)',
    latince: 'Crista galli',
    kemik: 'Kalbur kemiği',
    gecen: ['Delik değil, çıkıntıdır: beyin orağının (falx cerebri) ön tutunma yeri'],
    not: 'Kribriform plağın en ön kısmından yükselen üçgen biçimli kemik çıkıntı.',
    cukur: 'on',
  },
  optik: {
    ad: 'Optik kanal',
    latince: 'Canalis opticus',
    kemik: 'Kama kemiği (küçük kanat)',
    gecen: ['Görme siniri (II)', 'Oftalmik arter', 'Sempatik lifler'],
    not: 'Görme sinirini saran örümcek zar altı (subaraknoid) aralığın en dar yeridir; kanala uzanan bir tümör görmeyi bozabilir.',
    cukur: 'orta',
  },
  sof: {
    ad: 'Üst orbital yarık',
    latince: 'Fissura orbitalis superior',
    kemik: 'Kama kemiği (büyük ve küçük kanat arası)',
    gecen: [
      'Göz hareket sinirleri: III, IV ve VI',
      'Oftalmik sinirin (V1) dalları: lakrimal, frontal ve nazosiliyer sinirler',
      'Üst oftalmik ven',
    ],
    not: 'Yarıktaki hasar göz kaslarında felç, göz kapağı düşüklüğü ve alında uyuşukluk yapar. Görme siniri buradan geçmediği için görme korunur (üst orbital yarık sendromu).',
    cukur: 'orta',
  },
  rotundum: {
    ad: 'Foramen rotundum (yuvarlak delik)',
    latince: 'Foramen rotundum',
    kemik: 'Kama kemiği (büyük kanat)',
    gecen: ['Maksiller sinir (V2): yanağın, burnun ve üst dişlerin duyusu'],
    not: 'Üst orbital yarığın hemen altındadır; sinir buradan pterigopalatin çukura geçer.',
    cukur: 'orta',
  },
  ovale: {
    ad: 'Foramen ovale (oval delik)',
    latince: 'Foramen ovale',
    kemik: 'Kama kemiği (büyük kanat)',
    gecen: ['Mandibular sinir (V3)', 'Aksesuar meningeal arter', 'Emisser venler', 'Küçük petrozal sinir (her zaman değil)'],
    not: 'Trigeminal nevraljide, cilt üzerinden iğneyle trigeminal gangliyona bu delikten ulaşılır.',
    cukur: 'orta',
  },
  spinosum: {
    ad: 'Foramen spinosum (dikensi delik)',
    latince: 'Foramen spinosum',
    kemik: 'Kama kemiği (büyük kanat)',
    gecen: ['Orta meningeal arter ve ven', 'Mandibular sinirin meningeal dalı'],
    not: 'Arterin dalları kafatasının iç yüzünde oluklar açar (çizimde kırmızı). Şakak bölgesinde yırtılması epidural kanamaya yol açar.',
    cukur: 'orta',
  },
  lacerum: {
    ad: 'Foramen lacerum (yırtık delik)',
    latince: 'Foramen lacerum',
    kemik: 'Kama, şakak (kayalık kısım) ve art kafa kemiği arası',
    gecen: [
      'Yaşayan insanda kıkırdakla doludur; büyük bir yapı içinden geçmez',
      'Derin petrozal sinir, küçük meningeal dallar, emisser venler',
    ],
    not: 'İç karotis arter bu deliğin içinden değil üstünden geçer. Kuru kafatasında açık bir delik gibi göründüğü için bazı kaynaklar aksini yazar.',
    cukur: 'orta',
  },
  karotis: {
    ad: 'Karotis kanalı (iç ağzı)',
    latince: 'Canalis caroticus',
    kemik: 'Şakak kemiği (kayalık kısım)',
    gecen: ['İç karotis arter', 'Arteri saran sempatik sinir ağı'],
    not: 'Kanal dışarıda stiloid çıkıntının ön-içinden başlar, kayalık kemiğin içinden geçer ve foramen lacerumun hemen üstünde kafa boşluğuna açılır.',
    cukur: 'orta',
  },
  sella: {
    ad: 'Sella turcica (Türk eyeri)',
    latince: 'Sella turcica, fossa hypophysialis',
    kemik: 'Kama kemiği (gövde)',
    gecen: ['Delik değil, çukurdur: içinde bezelye büyüklüğündeki hipofiz bezi oturur'],
    not: 'Adını, önü ve arkası yüksek Osmanlı at eyerine benzemesinden alır. İki yanında kavernöz sinüsler bulunur.',
    cukur: 'orta',
  },
  akustik: {
    ad: 'İç akustik delik (iç kulak yolu)',
    latince: 'Porus acusticus internus',
    kemik: 'Şakak kemiği (kayalık kısmın arka yüzü)',
    gecen: ['Yüz siniri (VII)', 'İşitme ve denge siniri (VIII)', 'Labirent arteri'],
    not: 'Sinirlerle kanal duvarı arasında çok az boş yer kalır; küçük bir lezyon bile buradaki sinirlere bası yapabilir.',
    cukur: 'arka',
  },
  juguler: {
    ad: 'Juguler delik',
    latince: 'Foramen jugulare',
    kemik: 'Şakak ve art kafa kemiği arası',
    gecen: [
      'Dil-yutak siniri (IX)',
      'Vagus siniri (X)',
      'Aksesuar sinir (XI)',
      'İç juguler ven (sigmoid sinüsün devamı)',
      'İnferior petrozal sinüs',
    ],
    not: 'Beyinden dönen kanın tamamı kafatasını buradan terk eder. IX, X ve XI’in birlikte felcine juguler delik (Vernet) sendromu denir.',
    cukur: 'arka',
  },
  hipoglossal: {
    ad: 'Hipoglossal kanal',
    latince: 'Canalis nervi hypoglossi',
    kemik: 'Art kafa kemiği (kondilin üstü)',
    gecen: ['Dil altı siniri (XII)', 'Çıkan farengeal arterin meningeal dalı', 'Emisser ven'],
    not: 'XII juguler delikten değil bu kanaldan çıkar. İkisi birden tutulursa IX–XII’nin birlikte felci görülür (Collet–Sicard sendromu).',
    cukur: 'arka',
  },
  magnum: {
    ad: 'Foramen magnum (büyük delik)',
    latince: 'Foramen magnum',
    kemik: 'Art kafa kemiği',
    gecen: [
      'Omurilik soğanı (omuriliğe geçtiği yer) ve zarları',
      'Vertebral arterler',
      'Ön ve arka spinal arterler',
      'Aksesuar sinirin (XI) spinal kökü',
    ],
    not: 'Kafatasının en büyük deliğidir. Beyincik tonsillerinin buradan en az 5 mm aşağı inmesine Chiari tip 1 malformasyonu denir.',
    cukur: 'arka',
  },
};

const SIRA: DelikId[] = [
  'kribriform',
  'crista',
  'optik',
  'sof',
  'rotundum',
  'ovale',
  'spinosum',
  'lacerum',
  'karotis',
  'sella',
  'akustik',
  'juguler',
  'hipoglossal',
  'magnum',
];

/** Kısa adlar (düğmelerde). */
const KISA: Record<DelikId, string> = {
  kribriform: 'Kribriform plak',
  crista: 'Crista galli',
  optik: 'Optik kanal',
  sof: 'Üst orbital yarık',
  rotundum: 'F. rotundum',
  ovale: 'F. ovale',
  spinosum: 'F. spinosum',
  lacerum: 'F. lacerum',
  karotis: 'Karotis kanalı',
  sella: 'Sella turcica',
  akustik: 'İç akustik delik',
  juguler: 'Juguler delik',
  hipoglossal: 'Hipoglossal kanal',
  magnum: 'F. magnum',
};

// ——— Geometri (viewBox 360 × 420; ön yukarıda, sol taraf çizimin solunda) ———
const DIS = 'M180,14 C268,14 336,92 340,196 C344,300 284,404 180,406 C76,404 16,300 20,196 C24,92 92,14 180,14 Z';
/** Ön ve orta çukurun sınırı: kama kemiğinin küçük kanatları ve ön klinoid çıkıntılar. */
const KUCUK_KANAT_SOL = 'M30,150 C70,132 118,134 152,152';
const KUCUK_KANAT_SAG = 'M330,150 C290,132 242,134 208,152';
/** Kayalık sırtlar (orta ve arka çukurun sınırı). */
const KAYALIK_SOL = 'M160,226 C128,236 84,252 44,286';
const KAYALIK_SAG = 'M200,226 C232,236 276,252 316,286';

const ON_BOLGE = `M180,14 C268,14 330,80 336,150 L330,150 C290,132 242,134 208,152 L152,152 C118,134 70,132 30,150 L24,150 C30,80 92,14 180,14 Z`;
const ORTA_BOLGE = `M24,150 L30,150 C70,132 118,134 152,152 L208,152 C242,134 290,132 330,150 L336,150 C340,196 334,244 316,286 C276,252 232,236 200,226 L160,226 C128,236 84,252 44,286 C26,244 20,196 24,150 Z`;
const ARKA_BOLGE = `M44,286 C84,252 128,236 160,226 L200,226 C232,236 276,252 316,286 C296,350 248,404 180,406 C112,404 64,350 44,286 Z`;

/** Kemik bölgeleri (şematik). */
const KEMIK_YOL: Record<KemikId, string> = {
  alin: `M180,14 C268,14 330,80 336,150 L330,150 C290,132 242,134 208,152 L198,150 L198,58 L162,58 L162,150 L152,152 C118,134 70,132 30,150 L24,150 C30,80 92,14 180,14 Z`,
  kalbur: 'M162,52 L198,52 L198,140 L162,140 Z',
  kama: `M152,152 C118,134 70,132 30,150 L26,170 C60,166 96,168 120,186 C128,208 136,220 150,226 L160,226 L172,212 L188,212 L200,226 L210,226 C224,220 232,208 240,186 C264,168 300,166 334,170 L330,150 C290,132 242,134 208,152 L198,140 L162,140 Z`,
  sakak: `M26,170 C60,166 96,168 120,186 C128,208 136,220 150,226 L160,226 C128,236 84,252 44,286 C26,244 20,206 26,170 Z M334,170 C300,166 264,168 240,186 C232,208 224,220 210,226 L200,226 C232,236 276,252 316,286 C334,244 340,206 334,170 Z M160,226 C128,236 84,252 44,286 C52,300 64,312 76,320 C100,290 132,262 162,242 Z M200,226 C232,236 276,252 316,286 C308,300 296,312 284,320 C260,290 228,262 198,242 Z`,
  artkafa: `M162,242 C132,262 100,290 76,320 C96,370 136,404 180,406 C224,404 264,370 284,320 C260,290 228,262 198,242 L188,212 L172,212 Z`,
};

/** Delik çizimleri: iki yanlılar için sol taraftaki konum verilir, sağ yan aynalanır (x → 360 − x). */
type Sekil =
  | { tur: 'daire'; x: number; y: number; r: number }
  | { tur: 'elips'; x: number; y: number; rx: number; ry: number; aci: number }
  | { tur: 'yol'; d: string };
const SEKIL: Record<DelikId, { sekil: Sekil; cift: boolean }> = {
  kribriform: { sekil: { tur: 'yol', d: 'M166,64 L176,64 L176,132 L166,132 Z' }, cift: true },
  crista: { sekil: { tur: 'yol', d: 'M180,48 L186,74 L174,74 Z' }, cift: false },
  optik: { sekil: { tur: 'daire', x: 163, y: 160, r: 4.5 }, cift: true },
  sof: { sekil: { tur: 'yol', d: 'M150,170 C140,164 122,158 108,156 C120,164 134,172 146,176 Z' }, cift: true },
  rotundum: { sekil: { tur: 'daire', x: 145, y: 186, r: 3.6 }, cift: true },
  ovale: { sekil: { tur: 'elips', x: 136, y: 206, rx: 6.5, ry: 3.6, aci: 30 }, cift: true },
  spinosum: { sekil: { tur: 'daire', x: 121, y: 216, r: 2.6 }, cift: true },
  lacerum: { sekil: { tur: 'elips', x: 158, y: 214, rx: 5.5, ry: 4.5, aci: 0 }, cift: true },
  karotis: { sekil: { tur: 'daire', x: 150, y: 222, r: 3.4 }, cift: true },
  sella: { sekil: { tur: 'elips', x: 180, y: 184, rx: 17, ry: 12, aci: 0 }, cift: false },
  akustik: { sekil: { tur: 'elips', x: 116, y: 262, rx: 4.6, ry: 3.6, aci: -30 }, cift: true },
  juguler: { sekil: { tur: 'elips', x: 128, y: 290, rx: 9, ry: 5, aci: -30 }, cift: true },
  hipoglossal: { sekil: { tur: 'daire', x: 153, y: 296, r: 3 }, cift: true },
  magnum: { sekil: { tur: 'elips', x: 180, y: 314, rx: 25, ry: 31, aci: 0 }, cift: false },
};

function SekilCiz({ s, ayna, ...p }: { s: Sekil; ayna: boolean } & React.SVGProps<SVGElement>) {
  const t = ayna ? 'translate(360,0) scale(-1,1)' : undefined;
  if (s.tur === 'daire') return <circle cx={s.x} cy={s.y} r={s.r} transform={t} {...(p as React.SVGProps<SVGCircleElement>)} />;
  if (s.tur === 'elips')
    return (
      <g transform={t}>
        <ellipse
          cx={s.x}
          cy={s.y}
          rx={s.rx}
          ry={s.ry}
          transform={`rotate(${s.aci} ${s.x} ${s.y})`}
          {...(p as React.SVGProps<SVGEllipseElement>)}
        />
      </g>
    );
  return <path d={s.d} transform={t} {...(p as React.SVGProps<SVGPathElement>)} />;
}

export function KafatasiTabani() {
  const [kip, setKip] = useState<Kip>('cukurlar');
  const [secili, setSecili] = useState<DelikId>('magnum');
  const [kemik, setKemik] = useState<KemikId>('kama');
  const [cukur, setCukur] = useState<CukurId>('orta');
  const d = DELIK[secili];

  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={kip}
        onDegis={setKip}
        secenekler={[
          { d: 'kemikler', ad: 'Kemikler' },
          { d: 'cukurlar', ad: 'Çukurlar' },
          { d: 'delikler', ad: 'Delikler' },
        ]}
      />
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 360 420" className="mx-auto w-full max-w-md" role="img" aria-label="Kafatası tabanı, içten görünüş">
          <rect x="0" y="0" width="360" height="420" fill="#f7f3ea" rx="18" />
          {/* Kafatasının kesilmiş kenarı */}
          <path d={DIS} fill="#e9dfcb" stroke="#9c8d70" strokeWidth="5" />

          {kip === 'kemikler' &&
            (Object.keys(KEMIK_YOL) as KemikId[]).map((k) => (
              <path
                key={k}
                d={KEMIK_YOL[k]}
                fill={KEMIK[k].renk}
                fillRule="evenodd"
                stroke="#fff"
                strokeWidth="1.5"
                opacity={kemik === k ? 1 : 0.55}
                style={{ cursor: 'pointer', transition: 'opacity .3s' }}
                onClick={() => setKemik(k)}
              />
            ))}
          {kip === 'cukurlar' &&
            (
              [
                ['on', ON_BOLGE],
                ['orta', ORTA_BOLGE],
                ['arka', ARKA_BOLGE],
              ] as [CukurId, string][]
            ).map(([c, yol]) => (
              <path
                key={c}
                d={yol}
                fill={CUKUR[c].renk}
                stroke="#fff"
                strokeWidth="1.5"
                opacity={cukur === c ? 0.95 : 0.5}
                style={{ cursor: 'pointer', transition: 'opacity .3s' }}
                onClick={() => setCukur(c)}
              />
            ))}
          {kip === 'delikler' && <path d={DIS} fill="#eee6d6" />}

          {/* Kemik kabartıları: kayalık sırtlar, küçük kanatlar, klivus */}
          <path d={KUCUK_KANAT_SOL} fill="none" stroke="#7d6b4f" strokeWidth="4" strokeLinecap="round" />
          <path d={KUCUK_KANAT_SAG} fill="none" stroke="#7d6b4f" strokeWidth="4" strokeLinecap="round" />
          <path d={KAYALIK_SOL} fill="none" stroke="#7d6b4f" strokeWidth="5" strokeLinecap="round" />
          <path d={KAYALIK_SAG} fill="none" stroke="#7d6b4f" strokeWidth="5" strokeLinecap="round" />
          <path d="M168,200 L192,200 L204,280 L156,280 Z" fill="#000" opacity="0.06" />
          {/* Sinüs olukları: transvers ve sigmoid */}
          <path
            d="M180,384 C140,380 92,366 68,340 C56,322 70,302 118,292"
            fill="none"
            stroke="#6f86b3"
            strokeWidth="5"
            opacity="0.45"
            strokeLinecap="round"
          />
          <path
            d="M180,384 C220,380 268,366 292,340 C304,322 290,302 242,292"
            fill="none"
            stroke="#6f86b3"
            strokeWidth="5"
            opacity="0.45"
            strokeLinecap="round"
          />
          {/* Orta meningeal arterin olukları */}
          <path
            d="M121,216 C104,206 82,196 62,170 M98,204 C78,214 58,224 40,236"
            fill="none"
            stroke="#c0392b"
            strokeWidth="1.6"
            opacity={kip === 'delikler' ? 0.85 : 0.45}
          />
          <path
            d="M239,216 C256,206 278,196 298,170 M262,204 C282,214 302,224 320,236"
            fill="none"
            stroke="#c0392b"
            strokeWidth="1.6"
            opacity={kip === 'delikler' ? 0.85 : 0.45}
          />

          {/* Delikler (her görünümde çizilir; "Delikler"de seçilebilir) */}
          {SIRA.map((id) => {
            const { sekil, cift } = SEKIL[id];
            const sec = kip === 'delikler' && secili === id;
            const delik = id !== 'crista' && id !== 'sella';
            const ortak = {
              fill: delik ? (sec ? '#c0392b' : '#3b3326') : sec ? '#c0392b' : '#b9a98a',
              stroke: sec ? '#c0392b' : delik ? '#1f1a12' : '#7d6b4f',
              strokeWidth: sec ? 2.5 : 1,
              style: { cursor: kip === 'delikler' ? 'pointer' : 'default' },
              onClick: kip === 'delikler' ? () => setSecili(id) : undefined,
            } as const;
            return (
              <g key={id}>
                <SekilCiz s={sekil} ayna={false} {...ortak} />
                {cift && <SekilCiz s={sekil} ayna {...ortak} />}
              </g>
            );
          })}

          {/* Etiketler */}
          {kip === 'cukurlar' && (
            <g fontSize="12" fontWeight="700" fill="#2b2b2b" textAnchor="middle">
              <text x="180" y="108">
                Ön çukur
              </text>
              <text x="70" y="206">
                Orta
              </text>
              <text x="290" y="206">
                Orta
              </text>
              <text x="180" y="372">
                Arka çukur
              </text>
            </g>
          )}
          {kip === 'kemikler' && (
            <g fontSize="11" fontWeight="700" fill="#2b2b2b" textAnchor="middle">
              <text x="92" y="92">
                Alın
              </text>
              <text x="180" y="44">
                Kalbur
              </text>
              <text x="88" y="160">
                Kama
              </text>
              <text x="54" y="228">
                Şakak
              </text>
              <text x="180" y="372">
                Art kafa
              </text>
            </g>
          )}
          {kip === 'delikler' && (
            <g fontSize="10" fill="#2b2b2b" textAnchor="middle">
              <text x="180" y="404" fontWeight="700">
                Arka
              </text>
              <text x="180" y="30" fontWeight="700">
                Ön
              </text>
            </g>
          )}
        </svg>

        <div className="flex min-w-0 flex-col gap-3" aria-live="polite">
          {kip === 'kemikler' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Kemik seç">
                {(Object.keys(KEMIK) as KemikId[]).map((k) => (
                  <button key={k} type="button" className="beyin-secenek" aria-pressed={kemik === k} onClick={() => setKemik(k)}>
                    <span className="inline-block size-3 rounded-full" style={{ background: KEMIK[k].renk }} aria-hidden="true" />
                    {KEMIK[k].ad.split(' (')[0]}
                  </button>
                ))}
              </div>
              <p className="font-bold">{KEMIK[kemik].ad}</p>
              <p className="text-[0.98rem]">{KEMIK[kemik].metin}</p>
              <p className="t-meta">Kafa boşluğunun tabanını beş kemik yapar: alın, kalbur, kama, şakak ve art kafa kemikleri.</p>
            </div>
          )}
          {kip === 'cukurlar' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Çukur seç">
                {(Object.keys(CUKUR) as CukurId[]).map((c) => (
                  <button key={c} type="button" className="beyin-secenek" aria-pressed={cukur === c} onClick={() => setCukur(c)}>
                    <span className="inline-block size-3 rounded-full" style={{ background: CUKUR[c].renk }} aria-hidden="true" />
                    {CUKUR[c].ad}
                  </button>
                ))}
              </div>
              <p className="font-bold">{CUKUR[cukur].ad}</p>
              <p className="text-[0.98rem]">{CUKUR[cukur].metin}</p>
              <p className="t-small">
                <b>Kemikleri:</b> {CUKUR[cukur].kemikler}.
              </p>
              <p className="t-small">
                <b>İçinde:</b> {CUKUR[cukur].icinde}.
              </p>
              <p className="t-meta">Çukurlar önden arkaya derinleşir; her biri üstünde duran beyin bölümünün biçimine uyar.</p>
            </div>
          )}
          {kip === 'delikler' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Delik seç">
                {SIRA.map((id) => (
                  <button key={id} type="button" className="beyin-secenek" aria-pressed={secili === id} onClick={() => setSecili(id)}>
                    {KISA[id]}
                  </button>
                ))}
              </div>
              <div className="beyin-kutu flex flex-col gap-2">
                <p className="font-bold leading-snug">
                  {d.ad}{' '}
                  <span className="font-normal text-ink-3">
                    · <i lang="la">{d.latince}</i>
                  </span>
                </p>
                <p className="t-small text-ink-2">
                  {d.kemik} · {CUKUR[d.cukur].ad}
                </p>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-[0.98rem]">
                  {d.gecen.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <p className="t-small">{d.not}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
