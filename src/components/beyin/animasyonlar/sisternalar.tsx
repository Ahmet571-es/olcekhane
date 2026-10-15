'use client';

import { useId, useState, type ReactNode } from 'react';
import { Secenekler } from './ortak';

/**
 * Subaraknoid sisternalar: örümcek ağı zar ile yumuşak zar arasındaki boşluğun genişlediği yerler. Dört görünüm:
 * (1) orta hattan kesit (ön taraf solda): kiazma, interpedinküler, köprü önü, büyük, kuadrigeminal ve perikallozal
 * sisternalar ile komşuları; (2) beyin tabanı alttan (ön taraf yukarıda): Sylvius, kiazma, interpedinküler, ambiens ve köprü
 * önü sisternaları, içlerinden geçen atardamar ve sinirler; (3) bel sisternası ve bel delme; (4) Liliequist zarının iki
 * yaprağı ve endoskopik üçüncü ventrikülostomi (ETV) yolu (büyütülmüş şema; boşluklar abartılı). Her sisterna seçilince
 * Türkçe adı, TA2 Latince adı, yeri ve içinden geçenler gösterilir. Sisternaların boyutu için sayı verilmez.
 * Kaynaklar: Gray (1918); FIPAT (2019, TA2); Villanueva ve ark. (2023); Zedde ve Pascarella (2025a); Volovici ve ark.
 * (2020); Dias ve ark. (2014); Etus ve ark. (2011); Mahendru ve Chong (2009); Heit ve ark. (2017);
 * Byrne ve Dafny (2026, Neuroanatomy Online); OpenStax 13.3 (Betts ve ark., 2022); Lutters ve Koehler (2020).
 */

type Gorunum = 'orta' | 'taban' | 'bel' | 'liliequist';
type Oge =
  'kiazma' | 'interped' | 'kopruonu' | 'magna' | 'kuadri' | 'perikallozal' | 'sylvius' | 'ambiens' | 'bel' | 'dien' | 'mezen' | 'etv';

type Kart = {
  kisa: string;
  ad: string;
  diger?: string;
  latince?: string;
  latinceNot?: ReactNode;
  yer: string;
  listeBasligi?: string;
  liste?: string[];
  not?: string;
  kaynak: string;
};

const KART: Record<Oge, Kart> = {
  kiazma: {
    kisa: 'Kiazma',
    ad: 'Kiazma sisternası',
    latince: 'cisterna chiasmatica',
    yer: 'Orta hatta, optik kiazmanın (görme sinirlerinin çaprazlaştığı yer) çevresindedir. Sisternaların kavşağı sayılır. Üstünde lamina terminalis, yanlarında iç karotis atardamarını saran karotis sisternaları vardır. Arkadaki interpedinküler sisternadan Liliequist zarının ara beyin yaprağıyla ayrılır.',
    liste: [
      'Görme sinirleri ve optik kiazma',
      'Hipofiz sapı',
      'Hipofiz ve infundibulum atardamarları',
      'Kiazma ile hipofiz sapının toplardamar ağı',
    ],
    kaynak: 'Villanueva ve ark. (2023); FIPAT (2019)',
  },
  interped: {
    kisa: 'İnterpedinküler',
    ad: 'İnterpedinküler sisterna',
    diger: 'beyin ayakları arası sisterna',
    latince: 'cisterna interpeduncularis',
    latinceNot: (
      <>
        Gray (1918) buna <i lang="la">cisterna basalis</i> da der.
      </>
    ),
    yer: 'İki şakak lobunun arasında, örümcek ağı zarın karşıdan karşıya gerildiği geniş bir boşluktur. Beyin ayaklarını (serebral pedinküller) sarar. Çadır çentiğinin ön kısmına denk gelir. Gray (1918) bu sisternayı geniş tanımlar ve Willis halkasını onun içine koyar. Bugünkü cerrahi anatomi halkanın parçalarını dağıtır: iç karotis atardamarı karotis sisternasında, ön bağlantı atardamarı lamina terminalis sisternasındadır.',
    liste: [
      'Baziler atardamarın tepesi ve çatallanması',
      'Arka bağlantı atardamarının sonu, arka beyin ve üst beyincik atardamarları',
      'III. kafa siniri (okülomotor, göz hareket siniri)',
    ],
    not: 'Anevrizmasız orta beyin çevresi (perimezensefalik) kanamada kan genellikle bu sisternada, ambiens ve köprü önü sisternalarında kalır ve kiazma sisternasına geçmez.',
    kaynak: 'Gray (1918); Villanueva ve ark. (2023); Zedde ve Pascarella (2025a)',
  },
  kopruonu: {
    kisa: 'Köprü önü',
    ad: 'Köprü önü sisternası',
    diger: 'prepontin sisterna',
    latinceNot: (
      <>
        TA2&apos;de ayrı bir adı yoktur. Gray (1918) <i lang="la">cisterna pontis</i> der.
      </>
    ),
    yer: 'Köprünün (pons) ön yüzündedir. Önünde kafa tabanının eğik kemik yüzeyi (klivus), arkasında köprü vardır. Tavanını Liliequist zarının orta beyin yaprağı yapar.',
    liste: [
      'Baziler atardamar',
      'VI. kafa siniri (abdusens), Dorello kanalına giden yolu boyunca',
      'Ön alt beyincik atardamarının başlangıcı',
    ],
    not: 'Aşağıda, omurilik soğanının önündeki soğan önü sisternasıyla sürer. İkisini, omurga atardamarlarının birleştiği yerde kalınlaşmış bir zar ayırır.',
    kaynak: 'Gray (1918); Villanueva ve ark. (2023)',
  },
  magna: {
    kisa: 'Büyük sisterna',
    ad: 'Büyük sisterna',
    diger: 'beyincik–omurilik soğanı sisternası',
    latince: 'cisterna cerebellomedullaris posterior',
    latinceNot: (
      <>
        Eş anlamlısı: <i lang="la">cisterna magna</i>.
      </>
    ),
    yer: 'Omurilik soğanı ile beyinciğin alt yüzü arasındadır. Orta hattan kesitte üçgen görünür. Büyük delikte (foramen magnum) omuriliği saran subaraknoid boşlukla birleşir. Subaraknoid sisternaların en büyüğüdür.',
    liste: ['Birkaç kafa siniri ve atardamar'],
    not: 'Bu sisternadan iğneyle sıvı alma işlemini (sisternal ponksiyon) 1920’de James Ayer hastalarda kullanmaya başladı.',
    kaynak: 'Gray (1918); FIPAT (2019); Zedde ve Pascarella (2025a); Lutters ve Koehler (2020)',
  },
  kuadri: {
    kisa: 'Kuadrigeminal',
    ad: 'Kuadrigeminal sisterna',
    diger: 'dört tepecik sisternası; büyük beyin toplardamarı sisternası',
    latince: 'cisterna quadrigeminalis',
    latinceNot: (
      <>
        Eş anlamlısı: <i lang="la">cisterna venae magnae cerebri</i>.
      </>
    ),
    yer: 'Korpus kallozumun arka ucu (splenyum) ile beyinciğin üst yüzü arasındadır. Çadır çentiğinin arka kısmındadır. Adını orta beynin çatısındaki dört tepecikten alır.',
    liste: ['Büyük beyin toplardamarı', 'Çok sayıda atardamar ve toplardamar'],
    kaynak: 'Gray (1918); FIPAT (2019); Zedde ve Pascarella (2025a); Villanueva ve ark. (2023)',
  },
  perikallozal: {
    kisa: 'Perikallozal',
    ad: 'Perikallozal sisterna',
    diger: 'korpus kallozum çevresi sisternası',
    latince: 'cisterna pericallosa',
    yer: 'Adı, korpus kallozumun (nasırlı cisim) çevresinde olduğunu anlatır. Örümcek ağı zar beynin oluklarına inmez. Tek istisna, iki yarımküreyi ayıran büyük boylamsal yarıktır. TA2 bu sisternayı kafa sisternaları arasında sayar.',
    kaynak: 'FIPAT (2019); Zedde ve Pascarella (2025a)',
  },
  sylvius: {
    kisa: 'Sylvius',
    ad: 'Sylvius sisternası',
    diger: 'lateral yarık sisternası',
    latince: 'cisterna fossae lateralis cerebri',
    latinceNot: (
      <>
        İlişkili adı: <i lang="la">cisterna Sylvii</i>.
      </>
    ),
    yer: 'Her iki yanda, şakak lobunun önündedir. Örümcek ağı zar, beynin yan yüzündeki büyük yarığın (lateral yarık, Sylvius yarığı) üstünden köprü kurar. Altında kalan boşluk bu sisternadır.',
    liste: ['Orta beyin atardamarı'],
    kaynak: 'Gray (1918); FIPAT (2019)',
  },
  ambiens: {
    kisa: 'Ambiens',
    ad: 'Ambiens sisterna',
    diger: 'saran sisterna',
    latince: 'cisterna ambiens',
    yer: 'Beyin sapını yandan sarar. Şakak lobunun iç yüzü ile orta beynin yan yüzü arasındadır. Çadır çentiğinin orta kısmına denk gelir: önünde interpedinküler, arkasında kuadrigeminal sisterna vardır.',
    not: 'Anevrizmasız orta beyin çevresi (perimezensefalik) kanamada kan bu sisternada da görülür.',
    kaynak: 'Villanueva ve ark. (2023); Zedde ve Pascarella (2025a)',
  },
  bel: {
    kisa: 'Bel sisternası',
    ad: 'Bel sisternası',
    diger: 'lomber sisterna',
    latince: 'cisterna lumbalis',
    yer: 'Omuriliğin bittiği yerin altındaki geniş subaraknoid bölgedir. Omurilik üst bel omurları hizasında biter. Sert zar ve örümcek ağı zar ise ikinci sağrı omuruna (S2) kadar iner. Böylece ikinci bel omurunun altında büyük bir sisterna oluşur.',
    liste: ['At kuyruğu (cauda equina) denen sinir kökleri', 'Filum terminale: yumuşak zarın devamı olan ince iplik'],
    not: 'Kafa ve omurilik zarları büyük delikte birbirine bağlanır. Bu yüzden beyin çevresindeki kanama ya da enfeksiyon, bel delmeyle alınan sıvıda görülebilir.',
    kaynak: 'Byrne ve Dafny (2026); Gray (1918); OpenStax 13.3; FIPAT (2019)',
  },
  dien: {
    kisa: 'Ara beyin yaprağı',
    ad: 'Ara beyin yaprağı',
    diger: 'Liliequist zarının diensefalik yaprağı',
    latinceNot: 'TA2’de ayrı bir adı yoktur.',
    yer: 'Liliequist zarının üst yaprağıdır. Mamiller cisimlere ya da hemen önlerine tutunur. Kiazma sisternasını arkadaki interpedinküler sisternadan ayırır. İncelenen 13 çalışmanın 8’i bu yaprağın mamiller cisimlerin önüne, 2’si ise tepesine ya da arkasına tutunduğunu yazar.',
    not: 'Her zaman tam bir duvar değildir. İki sisternayı olguların yaklaşık %10–30’unda tümüyle ayırır.',
    kaynak: 'Zedde ve Pascarella (2025a); Volovici ve ark. (2020); Dias ve ark. (2014)',
  },
  mezen: {
    kisa: 'Orta beyin yaprağı',
    ad: 'Orta beyin yaprağı',
    diger: 'Liliequist zarının mezensefalik yaprağı',
    latinceNot: 'TA2’de ayrı bir adı yoktur.',
    yer: 'Liliequist zarının alt yaprağıdır. İnterpedinküler sisternayı aşağıdaki köprü önü sisternasından ayırır. III. kafa sinirleri (okülomotor) onu iç ve dış parçalara böler.',
    not: 'Üst yapraktan daha ince ve daha eksiktir. Bu yüzden görüntülerde daha zor seçilir. Şemada kesik çizgiyle gösterildi.',
    kaynak: 'Zedde ve Pascarella (2025a)',
  },
  etv: {
    kisa: 'ETV yolu',
    ad: 'ETV yolu',
    diger: 'endoskopik üçüncü ventrikülostomi',
    yer: 'Bu ameliyatta üçüncü karıncıktaki sıvıya, interpedinküler ve köprü önü sisternalarına giden yeni bir yol açılır. Şemadaki kesik çizgili ok bu yolu gösterir. Liliequist zarının da açılması işlemin başarısı için çok önemlidir.',
    not: 'Ara beyin yaprağı ya da köprü önündeki ince bölmeler yolu tıkarsa işlem başarısız olabilir. Kocaeli’den 11 hastalık küçük bir çalışmada, uzun süren hidrosefalide (karıncıklarda sıvı birikmesi) zar sert ve sıkıydı. Elektron mikroskobunda içinde düzenli, sık kollajen demetleri görüldü.',
    kaynak: 'Etus ve ark. (2011); Dias ve ark. (2014); Zedde ve Pascarella (2025a)',
  },
};

const GORUNUM: Record<Gorunum, { ad: string; baslik: string; metin: string; ogeler: Oge[]; ilk: Oge; aria: string }> = {
  orta: {
    ad: 'Orta hattan',
    baslik: 'Orta hattan kesit: sisternalar nerede?',
    metin:
      'Örümcek ağı zar beynin girintilerine inmez, üstlerinden köprü kurar. Bu yüzden beyin-omurilik sıvısıyla (BOS) dolu subaraknoid boşluk beynin üst yüzünde dardır. Beynin tabanında ise genişler; bu geniş yerlere sisterna denir. Sisternalar birbirine açılır ve adlarını komşu yapılardan alır.',
    ogeler: ['kiazma', 'interped', 'kopruonu', 'magna', 'kuadri', 'perikallozal'],
    ilk: 'magna',
    aria: 'Beynin orta hattan kesiti; subaraknoid sisternalar renkli gösterilmiş',
  },
  taban: {
    ad: 'Tabandan',
    baslik: 'Tabandan bakış: damarlar ve sinirler sisternalardan geçer',
    metin:
      'Beynin tabanında örümcek ağı zar, yapıların arasındaki çukurların üstünden geçer ve geniş sisternalar bırakır. Willis halkası, baziler atardamar ve orta beyin atardamarı bu sisternaların içinden geçer. Beyin anevrizmalarının çoğu da taban sisternalarındadır. Bu yüzden anevrizma kanaması taban sisternalarını tutar.',
    ogeler: ['sylvius', 'kiazma', 'interped', 'ambiens', 'kopruonu'],
    ilk: 'interped',
    aria: 'Beynin tabanı alttan; taban sisternaları, atardamarlar ve sinirler',
  },
  bel: {
    ad: 'Bel sisternası',
    baslik: 'Bel sisternası: bel delme neden buradan yapılır?',
    metin:
      'Omurilik üst bel omurları hizasında biter; sert zar ve örümcek ağı zar ise ikinci sağrı omuruna (S2) kadar iner. Aradaki geniş, sıvı dolu bölge bel sisternasıdır. Bel delmede (lomber ponksiyon) iğne buraya girer. Omurilik bu bölgede olmadığından iğnenin ona zarar verme tehlikesi önlenir.',
    ogeler: ['bel'],
    ilk: 'bel',
    aria: 'Bel omurgası yandan; omuriliğin ucu, bel sisternası ve bel delme iğnesi',
  },
  liliequist: {
    ad: 'Liliequist zarı',
    baslik: 'Liliequist zarı: beyin tabanındaki perde',
    metin:
      'Liliequist zarı, subaraknoid boşluğu bölmelere ayıran iç zarların en iyi bilinenlerinden biridir. Eyer sırtından (dorsum sellae) başlar; genellikle önce tek yaprak olarak ilerler, sonra ikiye ayrılır. İncelenen 13 anatomi çalışmasının 7’si iki yaprak tanımlar. Yapraklar kiazma, interpedinküler ve köprü önü sisternalarını birbirinden ayırır.',
    ogeler: ['dien', 'mezen', 'kiazma', 'interped', 'kopruonu', 'etv'],
    ilk: 'dien',
    aria: 'Liliequist zarının iki yaprağı ve çevresindeki üç sisterna, büyütülmüş orta hat şeması',
  },
};

const SIRA: Gorunum[] = ['orta', 'taban', 'bel', 'liliequist'];

/* Renkler: zemin ve şekiller iki temada da aynı (açık renkli şekiller); şekil dışındaki yazılar tema renkleriyle. */
const R = {
  bos: '#d6ecfa',
  karincikCizgi: '#86aecb',
  sisterna: '#9ccbec',
  secili: '#f3a23c',
  seciliCizgi: '#b8650f',
  beyin: '#ecdcca',
  beyinCizgi: '#b39a80',
  arabeyin: '#e5cdb8',
  sap: '#dcc0a6',
  beyincik: '#e2c6ad',
  kk: '#f6efe4',
  kemik: '#c9c1b2',
  zar: '#8a7f70',
  atar: '#cf3f35',
  toplar: '#3e5fae',
  sinir: '#d9b533',
  hipofiz: '#e4a99e',
  icYazi: '#3b2f24',
  etv: '#c2408f',
};

function Etiket({
  x,
  y,
  satir,
  anchor = 'start',
  cizgi,
  durum = 'normal',
  onClick,
}: {
  x: number;
  y: number;
  satir: string[];
  anchor?: 'start' | 'middle' | 'end';
  cizgi?: [number, number, number, number];
  durum?: 'normal' | 'secili' | 'ic' | 'icSecili' | 'soluk';
  onClick?: () => void;
}) {
  // Şeklin içindeki yazılar iki temada da koyu; seçili olan kalınlaşır.
  const ic = durum === 'ic' || durum === 'icSecili';
  const kalin = durum === 'secili' || durum === 'icSecili';
  const renk = durum === 'secili' ? 'var(--brass)' : ic ? R.icYazi : durum === 'soluk' ? 'var(--ink-3)' : 'var(--ink-2)';
  const cizgiRenk = durum === 'secili' ? 'var(--brass)' : ic ? R.icYazi : 'var(--ink-3)';
  return (
    <g onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      {cizgi && (
        <>
          <line x1={cizgi[0]} y1={cizgi[1]} x2={cizgi[2]} y2={cizgi[3]} stroke={cizgiRenk} strokeWidth={kalin ? 1.4 : 0.9} />
          <circle cx={cizgi[2]} cy={cizgi[3]} r="1.9" fill={cizgiRenk} />
        </>
      )}
      <text x={x} y={y} fontSize="10.5" textAnchor={anchor} fill={renk} fontWeight={kalin ? 700 : 400}>
        {satir.map((s, i) => (
          <tspan key={s} x={x} dy={i === 0 ? 0 : 12.5}>
            {s}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function AltYazi({ y, satirlar }: { y: number; satirlar: string[] }) {
  return (
    <text x="200" y={y} textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
      {satirlar.map((s, i) => (
        <tspan key={s} x="200" dy={i === 0 ? 0 : 14}>
          {s}
        </tspan>
      ))}
    </text>
  );
}

/* ───────────── 1. Orta hattan kesit ───────────── */

const KAFA_ICI =
  'M44,170 C22,146 18,84 66,52 C112,20 214,14 266,38 C302,56 322,98 322,142 C322,178 312,206 298,226 C286,244 272,258 256,266 L256,302 L216,302 L216,266 C204,240 186,214 177,196 L176,193 L146,197 C124,194 96,188 72,183 C58,180 50,176 44,170 Z';
const ZAR_CIZGISI =
  'M216,302 L216,266 C204,240 186,214 177,196 L176,193 L146,197 C124,194 96,188 72,183 C58,180 50,176 44,170 C22,146 18,84 66,52 C112,20 214,14 266,38 C302,56 322,98 322,142 C322,178 312,206 298,226 C286,244 272,258 256,266 L256,302';
const KEMIK_KUBBE =
  'M44,170 C22,146 18,84 66,52 C112,20 214,14 266,38 C302,56 322,98 322,142 C322,178 312,206 298,226 C286,244 272,258 256,266';
const KEMIK_TABAN =
  'M216,266 C204,240 186,214 177,196 L176,193 C179,205 177,216 167,219 C155,220 147,213 146,197 C124,194 96,188 72,183 C58,180 50,176 44,170';
const BEYIN =
  'M50,170 C28,146 25,88 72,57 C116,28 212,22 262,44 C296,62 316,100 316,140 C316,158 314,168 310,174 L262,130 L238,134 L150,138 C142,146 138,160 140,174 C128,182 104,185 76,181 C62,179 54,175 50,170 Z';
const KK =
  'M142,126 C122,122 116,98 136,88 C164,74 220,74 250,88 C272,98 280,116 270,128 C262,134 248,130 242,118 C228,96 170,92 150,99 C138,104 136,114 146,122 Z';
const PERIKALLOZAL = 'M139,131 C114,124 108,96 132,83 C162,68 222,68 253,83 C278,95 287,116 277,133';
const ARA_BEYIN = 'M148,140 L238,134 C244,138 246,146 242,152 L208,166 C202,170 196,174 190,176 L166,176 L158,173 L152,166 L146,150 Z';
const UCUNCU =
  'M152,144 L232,140 C236,142 236,146 234,148 L206,162 C200,166 194,170 188,172 L168,172 L161,176 L157,170 L153,164 L150,152 Z';
const ORTA_BEYIN = 'M208,166 L242,152 C248,154 250,160 246,164 C251,168 251,176 246,180 L244,190 L210,190 C204,184 203,174 208,166 Z';
const KOPRU = 'M210,190 L244,190 L244,242 L214,244 C200,236 198,198 210,190 Z';
const SOGAN = 'M214,244 L244,242 C246,250 247,258 246,266 L246,302 L228,302 L228,266 C224,258 218,252 214,244 Z';
const DORDUNCU = 'M244,194 L266,214 L244,236 Z';
const BEYINCIK =
  'M244,190 C246,176 258,166 272,166 C288,168 302,176 309,188 C312,202 304,220 290,230 C280,236 268,240 258,238 C252,238 248,238 246,236 L266,214 L244,194 Z';

const ORTA_SIS: Partial<Record<Oge, string>> = {
  kiazma: 'M128,186 L140,176 L146,166 L156,174 L166,177 L184,178 L179,194 L146,198 L128,192 Z',
  interped: 'M178,194 L183,182 L190,177 L208,166 L212,192 L180,195 Z',
  kopruonu: 'M176,195 L211,192 L214,244 L205,246 L170,198 Z',
  magna: 'M312,214 L252,232 L242,238 L242,266 L320,266 Z',
  kuadri: 'M236,136 L262,130 L306,178 L284,170 L264,168 L250,188 L244,188 L247,150 Z',
};

const K_ORTA = 0.92;
const ortaN = (x: number, y: number): [number, number] => [x * K_ORTA - 6, y * K_ORTA + 4];

function OrtaHat({ secili, sec, kimlik }: { secili: Oge; sec: (o: Oge) => void; kimlik: string }) {
  const kirp = `${kimlik}-kafa`;
  const renk = (o: Oge) => (o === secili ? R.secili : R.sisterna);
  const dur = (o: Oge) => (o === secili ? 'secili' : 'normal');
  const ns = { vectorEffect: 'non-scaling-stroke' as const };
  // Etiket çizgileri: yazının yanından hedef noktaya (hedefler anatomi koordinatından çevrilir).
  const c = (x1: number, y1: number, hx: number, hy: number): [number, number, number, number] => {
    const [x2, y2] = ortaN(hx, hy);
    return [x1, y1, x2, y2];
  };
  return (
    <svg viewBox="0 0 400 322" className="mx-auto w-full max-w-2xl" role="img" aria-label={GORUNUM.orta.aria}>
      <defs>
        <clipPath id={kirp}>
          <path d={KAFA_ICI} />
        </clipPath>
      </defs>
      <g transform={`translate(-6 4) scale(${K_ORTA})`}>
        {/* Kemik yalnızca zarların tutunduğu sade bir şerit */}
        <path d={KEMIK_KUBBE} fill="none" stroke={R.kemik} strokeWidth="8" strokeLinejoin="round" {...ns} />
        <path d={KEMIK_TABAN} fill="none" stroke={R.kemik} strokeWidth="7" strokeLinejoin="round" {...ns} />
        <ellipse cx="161" cy="208" rx="11" ry="7" fill={R.hipofiz} stroke="#b97c72" strokeWidth="0.8" {...ns} />
        {/* Kafa içi: zarların altındaki BOS */}
        <path d={KAFA_ICI} fill={R.bos} />
        <g clipPath={`url(#${kirp})`}>
          {(Object.keys(ORTA_SIS) as Oge[]).map((o) => (
            <path key={o} d={ORTA_SIS[o]} fill={renk(o)} style={{ cursor: 'pointer', transition: 'fill .3s' }} onClick={() => sec(o)} />
          ))}
        </g>
        <path d={ZAR_CIZGISI} fill="none" stroke={R.zar} strokeWidth="1.3" {...ns} />
        {/* Beyin dokusu */}
        <path d={BEYIN} fill={R.beyin} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <path d="M258,132 L318,186" stroke="#b5ab9b" strokeWidth="3" {...ns} />
        <path
          d={PERIKALLOZAL}
          fill="none"
          stroke={renk('perikallozal')}
          strokeWidth="4.5"
          strokeLinecap="round"
          style={{ transition: 'stroke .3s' }}
        />
        <path
          d={PERIKALLOZAL}
          fill="none"
          stroke="transparent"
          strokeWidth="14"
          style={{ cursor: 'pointer' }}
          onClick={() => sec('perikallozal')}
        />
        <path d={KK} fill={R.kk} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <path d={ARA_BEYIN} fill={R.arabeyin} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <path d={UCUNCU} fill={R.bos} stroke={R.karincikCizgi} strokeWidth="1" {...ns} />
        <path d={BEYINCIK} fill={R.beyincik} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <g fill="none" stroke={R.beyinCizgi} strokeWidth="0.8" opacity="0.7" {...ns}>
          <path d="M262,182 C276,176 292,182 300,194" {...ns} />
          <path d="M260,200 C274,196 290,204 296,214" {...ns} />
          <path d="M262,222 C274,222 284,226 288,230" {...ns} />
        </g>
        <path d={ORTA_BEYIN} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <path d={KOPRU} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <path d={SOGAN} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        <path d={DORDUNCU} fill={R.bos} stroke={R.karincikCizgi} strokeWidth="1" {...ns} />
        <path d="M236,151 C238,164 240,176 241,190" fill="none" stroke={R.karincikCizgi} strokeWidth="2" />
        {/* Kiazma, hipofiz sapı, mamiller cisim */}
        <path d="M159,175 L163,175 L163.5,202 L158.5,202 Z" fill={R.hipofiz} />
        <ellipse
          cx="148"
          cy="169"
          rx="8"
          ry="4.5"
          transform="rotate(-25 148 169)"
          fill={R.sinir}
          stroke="#a8891c"
          strokeWidth="0.8"
          {...ns}
        />
        <circle cx="186" cy="176" r="4.5" fill={R.arabeyin} stroke={R.beyinCizgi} strokeWidth="1" {...ns} />
        {/* Damarlar: baziler atardamar, büyük beyin toplardamarı */}
        <path
          d="M219,262 C209,248 202,232 201,214 C200,202 202,194 204,186"
          fill="none"
          stroke={R.atar}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M232,142 C244,150 258,142 262,131" fill="none" stroke={R.toplar} strokeWidth="2.6" strokeLinecap="round" />
      </g>

      {/* Sabit etiketler: sağ sütun */}
      <Etiket x={304} y={44} satir={['subaraknoid', 'boşluk (dar)']} cizgi={c(302, 47, 283, 55)} />
      <Etiket
        x={304}
        y={122}
        satir={['kuadrigeminal', 'sisterna']}
        cizgi={c(302, 126, 262, 150)}
        durum={dur('kuadri')}
        onClick={() => sec('kuadri')}
      />
      <Etiket x={304} y={160} satir={['dört tepecik']} cizgi={c(302, 157, 249, 166)} durum="soluk" />
      <Etiket x={304} y={192} satir={['beyincik']} cizgi={c(302, 189, 290, 200)} durum="soluk" />
      <Etiket x={304} y={240} satir={['büyük sisterna']} cizgi={c(302, 237, 268, 248)} durum={dur('magna')} onClick={() => sec('magna')} />
      <Etiket x={304} y={272} satir={['omurilik soğanı']} cizgi={c(302, 269, 236, 258)} durum="soluk" />
      {/* Sol alt sütun */}
      <Etiket x={112} y={192} anchor="end" satir={['optik kiazma']} cizgi={c(114, 189, 145, 170)} durum="soluk" />
      <Etiket
        x={118}
        y={212}
        anchor="end"
        satir={['kiazma sisternası']}
        cizgi={c(120, 209, 150, 186)}
        durum={dur('kiazma')}
        onClick={() => sec('kiazma')}
      />
      <Etiket x={124} y={232} anchor="end" satir={['hipofiz']} cizgi={c(126, 229, 155, 210)} durum="soluk" />
      <Etiket
        x={150}
        y={254}
        anchor="end"
        satir={['interpedinküler sisterna']}
        cizgi={c(152, 251, 196, 186)}
        durum={dur('interped')}
        onClick={() => sec('interped')}
      />
      <Etiket
        x={166}
        y={276}
        anchor="end"
        satir={['köprü önü sisternası']}
        cizgi={c(168, 273, 200, 226)}
        durum={dur('kopruonu')}
        onClick={() => sec('kopruonu')}
      />
      {/* Beynin içindeki etiketler */}
      <Etiket
        x={178}
        y={56}
        anchor="middle"
        satir={['perikallozal sisterna']}
        cizgi={[178, 59, ...ortaN(200, 71)]}
        durum={secili === 'perikallozal' ? 'icSecili' : 'ic'}
        onClick={() => sec('perikallozal')}
      />
      <Etiket x={170} y={110.5} anchor="middle" satir={['korpus kallozum']} cizgi={[170, 102, 170, 94]} durum="ic" />
      <Etiket x={202} y={208} anchor="middle" satir={['köprü']} durum="ic" />

      <AltYazi y={300} satirlar={['Orta hattan kesit: ön taraf solda, tepe yukarıda.', 'Şema; oranlar yaklaşıktır.']} />
    </svg>
  );
}

/* ───────────── 2. Tabandan bakış ───────────── */

const T_ALIN =
  'M170,18 C122,6 64,18 48,58 C40,80 44,100 58,110 C90,108 128,110 152,116 L188,116 C212,110 250,108 282,110 C296,100 300,80 292,58 C276,18 218,6 170,18 Z';
const T_SAKAK =
  'M60,124 C46,142 46,182 62,210 C76,232 104,244 126,238 C140,234 142,218 138,200 C134,182 130,162 128,150 C124,138 116,128 104,124 C90,120 74,120 60,124 Z';
const T_PEDINKUL = 'M150,136 C146,148 146,160 152,170 L164,170 C162,158 162,146 164,138 Z';
const T_KOPRU = 'M136,172 C132,194 142,228 170,234 C198,228 208,194 204,172 C190,166 150,166 136,172 Z';
const T_SOGAN = 'M154,232 L186,232 L182,284 C176,290 164,290 158,284 Z';
const T_BEYINCIK = 'M150,236 C126,230 98,238 88,258 C82,276 106,292 136,290 C150,289 158,280 158,266 Z';

const TABAN_SIS: Partial<Record<Oge, { sol: string; sag?: boolean }>> = {
  sylvius: { sol: 'M60,110 C90,108 128,110 152,115 L154,126 C128,124 92,121 62,124 Z', sag: true },
  kiazma: { sol: 'M152,100 C158,96 182,96 188,100 L194,124 C184,132 156,132 146,124 Z' },
  interped: { sol: 'M150,130 L190,130 L188,152 L178,172 L162,172 L152,152 Z' },
  ambiens: { sol: 'M146,132 C136,144 132,158 134,176 L146,174 C144,160 144,148 150,134 Z', sag: true },
  kopruonu: { sol: 'M154,172 L186,172 C188,196 186,218 180,232 L160,232 C154,218 152,196 154,172 Z' },
};

/** Sol yarıdaki çizimi orta çizgiye (x = 170) göre aynalar. */
function Ayna({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform="translate(340 0) scale(-1 1)">{children}</g>
    </>
  );
}

function Taban({ secili, sec }: { secili: Oge; sec: (o: Oge) => void }) {
  const dur = (o: Oge) => (o === secili ? 'secili' : 'normal');
  return (
    <svg viewBox="0 0 400 326" className="mx-auto w-full max-w-2xl" role="img" aria-label={GORUNUM.taban.aria}>
      {/* Beyin dokusu */}
      <path d={T_ALIN} fill={R.beyin} stroke={R.beyinCizgi} strokeWidth="1" />
      <path d="M170,18 L170,96" stroke={R.beyinCizgi} strokeWidth="1.2" />
      <Ayna>
        <path d={T_SAKAK} fill={R.beyin} stroke={R.beyinCizgi} strokeWidth="1" />
        <path d={T_BEYINCIK} fill={R.beyincik} stroke={R.beyinCizgi} strokeWidth="1" />
        <path d={T_PEDINKUL} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" />
      </Ayna>
      <path d={T_KOPRU} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" />
      <path d={T_SOGAN} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" />
      <Ayna>
        <circle cx="165" cy="134" r="3.6" fill={R.arabeyin} stroke={R.beyinCizgi} strokeWidth="0.8" />
      </Ayna>

      {/* Sisternalar: dokunun üstünde yarı saydam */}
      {(Object.keys(TABAN_SIS) as Oge[]).map((o) => {
        const s = TABAN_SIS[o]!;
        const ortak = {
          fill: o === secili ? R.secili : R.sisterna,
          opacity: o === secili ? 0.78 : 0.55,
          style: { cursor: 'pointer', transition: 'fill .3s, opacity .3s' },
          onClick: () => sec(o),
        };
        return (
          <g key={o}>
            <path d={s.sol} {...ortak} />
            {s.sag && <path d={s.sol} transform="translate(340 0) scale(-1 1)" {...ortak} />}
          </g>
        );
      })}

      {/* Sinirler */}
      <Ayna>
        <path d="M158,64 L166,106" stroke={R.sinir} strokeWidth="5" strokeLinecap="round" />
        <path d="M158,114 C150,122 146,132 144,142" fill="none" stroke={R.sinir} strokeWidth="4" strokeLinecap="round" />
        <path d="M164,152 C158,146 150,138 144,128" fill="none" stroke={R.sinir} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M164,232 L160,190" stroke={R.sinir} strokeWidth="1.8" strokeLinecap="round" />
      </Ayna>
      <path d="M160,104 L180,104 L184,114 L156,114 Z" fill={R.sinir} stroke="#a8891c" strokeWidth="0.8" />
      <circle cx="170" cy="122" r="3.5" fill={R.hipofiz} stroke="#b97c72" strokeWidth="0.8" />
      {/* Atardamarlar: Willis halkası ve dalları */}
      <g fill="none" stroke={R.atar} strokeLinecap="round">
        <Ayna>
          <path d="M162,284 C164,262 168,246 170,236" strokeWidth="3" />
          <path d="M170,170 C160,166 148,164 140,168 C130,174 126,186 126,200" strokeWidth="2.8" />
          <path d="M170,176 C160,178 150,182 144,190" strokeWidth="2.2" />
          <path d="M150,122 C148,138 150,154 156,167" strokeWidth="2" />
          <path d="M150,116 C156,108 162,100 168,94 L168,62" strokeWidth="2.6" />
          <path d="M148,119 C126,116 96,114 62,116" strokeWidth="3" />
        </Ayna>
        <path d="M170,236 L170,170" strokeWidth="4" />
        <path d="M168,94 L172,94" strokeWidth="2" />
      </g>
      <Ayna>
        <circle cx="150" cy="119" r="4.5" fill={R.atar} />
      </Ayna>

      {/* Etiketler */}
      <Etiket
        x={306}
        y={58}
        satir={['kiazma', 'sisternası']}
        cizgi={[304, 62, 186, 110]}
        durum={dur('kiazma')}
        onClick={() => sec('kiazma')}
      />
      <Etiket
        x={306}
        y={100}
        satir={['Sylvius', 'sisternası']}
        cizgi={[304, 104, 262, 117]}
        durum={dur('sylvius')}
        onClick={() => sec('sylvius')}
      />
      <Etiket
        x={306}
        y={142}
        satir={['interpedinküler', 'sisterna']}
        cizgi={[304, 146, 180, 150]}
        durum={dur('interped')}
        onClick={() => sec('interped')}
      />
      <Etiket
        x={306}
        y={186}
        satir={['ambiens', 'sisterna']}
        cizgi={[304, 190, 200, 180]}
        durum={dur('ambiens')}
        onClick={() => sec('ambiens')}
      />
      <Etiket
        x={306}
        y={228}
        satir={['köprü önü', 'sisternası']}
        cizgi={[304, 232, 182, 210]}
        durum={dur('kopruonu')}
        onClick={() => sec('kopruonu')}
      />
      <Etiket x={92} y={62} anchor="middle" satir={['alın lobu']} durum="ic" />
      <Etiket x={94} y={214} anchor="middle" satir={['şakak lobu']} durum="ic" />
      <Etiket x={116} y={272} anchor="middle" satir={['beyincik']} durum="ic" />
      {/* Seçili sisternanın içindekiler */}
      {secili === 'sylvius' && (
        <Etiket x={90} y={146} anchor="middle" satir={['orta beyin', 'atardamarı']} cizgi={[90, 136, 92, 116]} durum="ic" />
      )}
      {secili === 'kiazma' && <Etiket x={104} y={96} anchor="middle" satir={['optik kiazma']} cizgi={[132, 98, 158, 109]} durum="ic" />}
      {secili === 'interped' && (
        <>
          <Etiket x={92} y={144} anchor="middle" satir={['arka bağlantı', 'atardamarı']} cizgi={[133, 145, 150, 140]} durum="ic" />
          <Etiket x={92} y={172} anchor="middle" satir={['III. sinir']} cizgi={[116, 169, 160, 148]} durum="ic" />
        </>
      )}
      {secili === 'ambiens' && <Etiket x={92} y={164} anchor="middle" satir={['orta beyin']} cizgi={[120, 161, 152, 156]} durum="ic" />}
      {secili === 'kopruonu' && (
        <>
          <Etiket x={92} y={160} anchor="middle" satir={['baziler', 'atardamar']} cizgi={[120, 164, 170, 200]} durum="ic" />
          <Etiket x={92} y={194} anchor="middle" satir={['VI. sinir']} cizgi={[116, 191, 161, 214]} durum="ic" />
        </>
      )}

      <AltYazi y={306} satirlar={['Alttan bakış: ön taraf yukarıda.', 'Şema; oranlar yaklaşıktır.']} />
    </svg>
  );
}

/* ───────────── 3. Bel sisternası ───────────── */

const OMURLAR = [
  { ad: 'L1', y: 14 },
  { ad: 'L2', y: 52 },
  { ad: 'L3', y: 90 },
  { ad: 'L4', y: 128 },
  { ad: 'L5', y: 166 },
];
const KESE = 'M138,0 L172,0 L172,224 C172,240 166,250 156,250 C146,248 138,232 138,212 Z';
const BEL_SIS = 'M138,84 L172,84 L172,224 C172,240 166,250 156,250 C146,248 138,232 138,212 Z';
const KOKLER = [
  'M150,40 C146,52 142,70 139,84',
  'M152,46 C148,64 144,96 140,122',
  'M153,50 C150,80 146,128 141,160',
  'M156,52 C156,90 150,150 142,198',
  'M157,54 C160,100 156,180 146,224',
  'M158,52 C164,100 164,190 156,240',
  'M154,54 C154,120 158,200 152,244',
  'M160,48 C166,90 168,150 166,210',
];

function Bel({ secili, sec }: { secili: Oge; sec: (o: Oge) => void }) {
  return (
    <svg viewBox="0 0 400 324" className="mx-auto w-full max-w-2xl" role="img" aria-label={GORUNUM.bel.aria}>
      {/* Omur gövdeleri, diskler ve dikensi çıkıntılar (sade) */}
      {OMURLAR.map((o) => (
        <g key={o.ad}>
          <rect x="60" y={o.y} width="68" height="30" rx="7" fill={R.kemik} stroke="#9d9484" strokeWidth="1" />
          <rect x="62" y={o.y + 30} width="64" height="8" rx="3" fill="#e9e3d6" stroke="#b9b09f" strokeWidth="0.8" />
          <rect x="180" y={o.y + 4} width="46" height="22" rx="6" fill={R.kemik} stroke="#9d9484" strokeWidth="1" />
          <text x="94" y={o.y + 19} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={R.icYazi}>
            {o.ad}
          </text>
        </g>
      ))}
      <path
        d="M60,204 L128,204 C134,226 140,252 140,288 L110,290 C100,262 82,232 60,204 Z"
        fill={R.kemik}
        stroke="#9d9484"
        strokeWidth="1"
      />
      <path d="M178,206 C186,234 192,262 190,290" fill="none" stroke={R.kemik} strokeWidth="8" strokeLinecap="round" />
      <text x="112" y="236" textAnchor="middle" fontSize="10.5" fill={R.icYazi}>
        sağrı
      </text>
      {/* Zar kesesi ve BOS */}
      <path d={KESE} fill={R.bos} />
      <path
        d={BEL_SIS}
        fill={secili === 'bel' ? R.secili : R.sisterna}
        opacity="0.85"
        style={{ cursor: 'pointer' }}
        onClick={() => sec('bel')}
      />
      <path d="M138,0 L138,212 C138,232 146,248 156,250 C166,250 172,240 172,224 L172,0" fill="none" stroke={R.zar} strokeWidth="2" />
      {/* Omurilik, at kuyruğu, filum terminale */}
      <path d="M147,0 L163,0 L163,30 C163,42 158,52 155,58 C152,52 147,42 147,30 Z" fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" />
      <g fill="none" stroke="#c49a1c" strokeWidth="1.2" strokeLinecap="round">
        {KOKLER.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d="M155,58 L156,248 L160,292" fill="none" stroke="#8c6b5c" strokeWidth="1.4" />
      {/* S2 hizası */}
      <path d="M86,244 L176,244" stroke="var(--ink-3)" strokeWidth="0.9" strokeDasharray="3 3" />
      <text x="82" y="248" textAnchor="end" fontSize="10.5" fill="var(--ink-2)">
        S2 hizası
      </text>
      {/* İğne */}
      <path d="M300,120 L158,126" stroke="#6f7a89" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="300" y="113" width="26" height="14" rx="3" fill="#9aa7b8" stroke="#6f7a89" strokeWidth="1" />

      <Etiket x={240} y={22} satir={['omurilik']} cizgi={[238, 19, 161, 18]} durum="soluk" />
      <Etiket x={240} y={58} satir={['omuriliğin ucu']} cizgi={[238, 55, 157, 55]} durum="soluk" />
      <Etiket
        x={240}
        y={90}
        satir={['bel sisternası']}
        cizgi={[238, 87, 166, 92]}
        durum={secili === 'bel' ? 'secili' : 'normal'}
        onClick={() => sec('bel')}
      />
      <Etiket x={240} y={108} satir={['bel delme iğnesi']} />
      <Etiket x={240} y={168} satir={['at kuyruğu', '(sinir kökleri)']} cizgi={[238, 172, 150, 172]} durum="soluk" />
      <Etiket x={240} y={208} satir={['sert zar ve', 'örümcek ağı zar']} cizgi={[238, 212, 172, 212]} durum="soluk" />
      <Etiket x={240} y={268} satir={['filum terminale']} cizgi={[238, 265, 158, 270]} durum="soluk" />

      <AltYazi y={304} satirlar={['Yandan bakış: ön taraf solda, baş yukarıda.', 'Şema; oranlar yaklaşıktır.']} />
    </svg>
  );
}

/* ───────────── 4. Liliequist zarı (büyütülmüş şema) ───────────── */

const L_BOS = 'M0,0 H400 V290 H220 C194,238 170,182 164,142 L135,149 L119,151 L78,156 L60,154 L0,152 Z';
const L_ARA = 'M44,0 H316 V36 C298,54 272,70 246,80 L190,84 L150,86 L134,90 L122,90 L108,86 L80,80 C68,78 58,74 52,68 L44,60 Z';
const L_KARINCIK = 'M56,0 H306 V34 C290,48 266,62 242,70 L190,74 L150,76 L134,80 L128,88 L122,80 L104,76 C86,72 72,66 62,58 L56,52 Z';
const L_ORTA_BEYIN = 'M246,80 C270,72 296,56 316,36 L316,0 L400,0 L400,154 L290,154 C286,132 276,106 260,90 Z';
const L_KOPRU = 'M290,154 L400,154 L400,290 L290,290 C274,262 268,214 276,184 C280,170 286,160 290,154 Z';
const L_KEMIK = 'M0,152 L60,154 C70,155 76,156 78,158 C80,198 96,206 126,206 C156,206 168,194 166,152 L164,142 C170,182 194,238 220,290';
const L_ORTAK = 'M164,142 L178,134';
const L_DIEN = 'M178,134 C183,120 189,104 196,92';
const L_MEZEN = 'M178,134 C208,148 250,154 290,154';
const L_SIS: Partial<Record<Oge, string>> = {
  kiazma: 'M0,108 L58,96 L120,92 L206,64 L196,92 C189,104 183,120 178,134 L164,142 L135,149 L119,151 L78,156 L60,154 L0,152 Z',
  interped: 'M196,92 L214,70 L300,40 L290,154 C250,154 208,148 178,134 C183,120 189,104 196,92 Z',
  kopruonu: 'M164,142 L178,134 C208,148 250,154 290,154 L292,290 L220,290 C194,238 170,182 164,142 Z',
};
const L_ETV = 'M168,26 L171,84 C172,100 173,118 172,134 C172,148 178,162 188,184';

function Liliequist({ secili, sec }: { secili: Oge; sec: (o: Oge) => void }) {
  const renk = (o: Oge) => (o === secili ? R.secili : R.sisterna);
  const dur = (o: Oge) => (o === secili ? 'icSecili' : 'ic');
  const etv = secili === 'etv';
  const yaprak = (o: Oge) => ({
    stroke: o === secili ? R.seciliCizgi : '#4f5f78',
    strokeWidth: o === secili ? 3.6 : 2.2,
    style: { cursor: 'pointer', transition: 'stroke .3s' },
    onClick: () => sec(o),
  });
  return (
    <svg viewBox="0 0 400 322" className="mx-auto w-full max-w-2xl" role="img" aria-label={GORUNUM.liliequist.aria}>
      <path d={L_BOS} fill={R.bos} />
      {(Object.keys(L_SIS) as Oge[]).map((o) => (
        <path key={o} d={L_SIS[o]} fill={renk(o)} style={{ cursor: 'pointer', transition: 'fill .3s' }} onClick={() => sec(o)} />
      ))}
      {/* Kemik şeridi (eyer sırtı ve klivus), sella diyaframı */}
      <path d={L_KEMIK} fill="none" stroke={R.kemik} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx="126" cy="176" rx="34" ry="21" fill={R.hipofiz} stroke="#b97c72" strokeWidth="1" />
      <path d="M78,156 L119,151 M135,149 L164,142" stroke={R.zar} strokeWidth="1.5" />
      {/* Ara beyin (karıncık tabanı), orta beyin, köprü */}
      <path d={L_ARA} fill={R.arabeyin} stroke={R.beyinCizgi} strokeWidth="1" />
      <path d={L_KARINCIK} fill={R.bos} stroke={R.karincikCizgi} strokeWidth="1" />
      <path d={L_ORTA_BEYIN} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" />
      <path d={L_KOPRU} fill={R.sap} stroke={R.beyinCizgi} strokeWidth="1" />
      <path d="M121,88 L135,88 L131,152 L123,152 Z" fill={R.hipofiz} stroke="#b97c72" strokeWidth="0.8" />
      <ellipse cx="84" cy="84" rx="26" ry="10" transform="rotate(-10 84 84)" fill={R.sinir} stroke="#a8891c" strokeWidth="1" />
      <circle cx="204" cy="84" r="11" fill={R.arabeyin} stroke={R.beyinCizgi} strokeWidth="1" />
      {/* Baziler atardamar ve tepesi */}
      <path
        d="M282,290 C268,262 262,224 264,196 C265,176 262,160 258,148"
        fill="none"
        stroke={R.atar}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M258,148 C262,142 268,138 278,136" fill="none" stroke={R.atar} strokeWidth="4.5" strokeLinecap="round" />
      {/* ETV: karıncık tabanında ve zarda açılan yol */}
      {etv && (
        <g>
          <rect x="166" y="72" width="10" height="16" fill={R.bos} />
          <circle cx="171.5" cy="137.5" r="4.5" fill={R.bos} />
        </g>
      )}
      {/* Liliequist zarı */}
      <g fill="none" strokeLinecap="round">
        <path d={L_ORTAK} {...yaprak(secili === 'mezen' ? 'mezen' : 'dien')} />
        <path d={L_DIEN} {...yaprak('dien')} />
        <path d={L_MEZEN} strokeDasharray="6 4" {...yaprak('mezen')} />
        <path d={L_DIEN} stroke="transparent" strokeWidth="12" style={{ cursor: 'pointer' }} onClick={() => sec('dien')} />
        <path d={L_MEZEN} stroke="transparent" strokeWidth="12" style={{ cursor: 'pointer' }} onClick={() => sec('mezen')} />
      </g>
      {etv && (
        <g>
          <path d={L_ETV} fill="none" stroke={R.etv} strokeWidth="2.6" strokeDasharray="6 4" strokeLinecap="round" />
          <path d="M188,184 L180,178 L191,174 Z" fill={R.etv} />
        </g>
      )}

      {/* Etiketler (şeklin içinde) */}
      <Etiket x={246} y={24} anchor="middle" satir={['üçüncü karıncık']} durum="ic" />
      <Etiket x={226} y={58} anchor="middle" satir={['mamiller cisim']} cizgi={[214, 61, 210, 73]} durum="ic" />
      <Etiket x={84} y={88} anchor="middle" satir={['kiazma']} durum="ic" />
      <Etiket x={126} y={180} anchor="middle" satir={['hipofiz']} durum="ic" />
      <Etiket x={116} y={112} anchor="end" satir={['hipofiz sapı']} durum="ic" />
      <Etiket x={346} y={104} anchor="middle" satir={['orta beyin']} durum="ic" />
      <Etiket x={346} y={186} anchor="middle" satir={['köprü']} durum="ic" />
      <Etiket x={340} y={240} anchor="middle" satir={['baziler', 'atardamar']} cizgi={[306, 244, 270, 240]} durum="ic" />
      <Etiket x={8} y={132} satir={['kiazma sisternası']} durum={dur('kiazma')} onClick={() => sec('kiazma')} />
      <Etiket
        x={232}
        y={130}
        anchor="middle"
        satir={['interpedinküler', 'sisterna']}
        durum={dur('interped')}
        onClick={() => sec('interped')}
      />
      <Etiket x={224} y={214} anchor="middle" satir={['köprü önü', 'sisternası']} durum={dur('kopruonu')} onClick={() => sec('kopruonu')} />
      <Etiket x={203} y={97} satir={['ara beyin', 'yaprağı']} cizgi={[201, 93, 191, 100]} durum={dur('dien')} onClick={() => sec('dien')} />
      <Etiket x={204} y={170} satir={['orta beyin', 'yaprağı']} durum={dur('mezen')} onClick={() => sec('mezen')} />
      {/* Kemiğin dışındaki boş alanda */}
      <Etiket x={150} y={240} anchor="end" satir={['eyer sırtı']} cizgi={[152, 237, 165, 150]} />
      <Etiket x={196} y={278} anchor="end" satir={['klivus']} cizgi={[198, 275, 208, 266]} />
      {etv && <Etiket x={160} y={22} anchor="end" satir={['ETV yolu']} durum="secili" />}

      <AltYazi
        y={304}
        satirlar={['Orta hattan kesit, büyütülmüş: ön taraf solda, tepe yukarıda.', 'Şema; oranlar yaklaşıktır, boşluklar abartılmıştır.']}
      />
    </svg>
  );
}

/* ───────────── Bileşen ───────────── */

export function Sisternalar() {
  const [gorunum, setGorunum] = useState<Gorunum>('orta');
  const [secili, setSecili] = useState<Oge>(GORUNUM.orta.ilk);
  const kimlik = `sis-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const g = GORUNUM[gorunum];
  const k = KART[secili];

  const gorunumDegis = (yeni: Gorunum) => {
    setGorunum(yeni);
    setSecili(GORUNUM[yeni].ilk);
  };

  return (
    <div className="flex flex-col gap-4">
      <Secenekler etiket="Görünüm" deger={gorunum} onDegis={gorunumDegis} secenekler={SIRA.map((d) => ({ d, ad: GORUNUM[d].ad }))} />
      {gorunum === 'orta' && <OrtaHat secili={secili} sec={setSecili} kimlik={kimlik} />}
      {gorunum === 'taban' && <Taban secili={secili} sec={setSecili} />}
      {gorunum === 'bel' && <Bel secili={secili} sec={setSecili} />}
      {gorunum === 'liliequist' && <Liliequist secili={secili} sec={setSecili} />}
      <div aria-live="polite" className="flex flex-col gap-1">
        <p className="font-semibold">{g.baslik}</p>
        <p className="text-[0.98rem]">{g.metin}</p>
      </div>
      {g.ogeler.length > 1 && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Sisterna ya da yapı seç">
            {g.ogeler.map((o) => (
              <button key={o} type="button" className="beyin-secenek" aria-pressed={secili === o} onClick={() => setSecili(o)}>
                {KART[o].kisa}
              </button>
            ))}
          </div>
          <p className="t-meta">Çizimde bir sisternaya ya da adına dokunarak da seçebilirsin.</p>
        </div>
      )}
      <div aria-live="polite" className="beyin-kutu flex flex-col gap-2">
        <p className="font-bold leading-snug">
          {k.ad}
          {k.diger && <span className="font-normal text-ink-3"> · {k.diger}</span>}
        </p>
        {(k.latince || k.latinceNot) && (
          <p className="t-small text-ink-2">
            {k.latince && (
              <>
                TA2: <i lang="la">{k.latince}</i>.{' '}
              </>
            )}
            {k.latinceNot}
          </p>
        )}
        <p className="text-[0.98rem]">{k.yer}</p>
        {k.liste && (
          <>
            <p className="t-small font-semibold">{k.listeBasligi ?? 'İçinden geçenler'}</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-[0.98rem]">
              {k.liste.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        )}
        {k.not && <p className="t-small">{k.not}</p>}
        <p className="t-meta">Kaynak: {k.kaynak}</p>
      </div>
    </div>
  );
}
