'use client';

import { useState } from 'react';
import { Secenekler, useHareketAzaltilmis } from './ortak';

/**
 * Ölçek merdiveni: beyinden sinaptik aralığa beş basamak. Solda on kat aralıklı bir merdiven (100 mm'den 10 nm'ye)
 * basamağın yerini gösterir; sağda o basamağın şeması, kırmızı ölçü çizgisi ve (ilk iki basamakta) bir sonraki basamakta
 * büyütülen yeri gösteren kare vardır. Her basamakta büyüklük, bir önceki basamağa göre oran ve o ölçekte görme yolu yazar.
 * Kaynaklar (bölüm metnindeki atıflarla aynı): OpenStax 12.2 (1 µm = mm'nin binde biri); Dafny (2020; beyin 1200–1500 g,
 * ~1400 cm³); Park ve ark. (2010; önden arkaya 152 mm, tek bir beyin); Wagstyl ve ark. (2020; presantral kıvrım,
 * BigBrain'de büzülme düzeltilince 4,5 mm'nin üstü; MR hareket kabuğunu sık sık ince gösterir); Kong ve ark. (2018;
 * kabuk kalınlığı MR'da ölçüldü); Shapson-Coe ve ark. (2024; bir milimetreküp şakak kabuğu); Liewald ve ark. (2014;
 * kabuktan kabuğa giden aksonların kılıf içi çapı, elektron mikroskobuyla; ortalamaların çoğu 1 µm'nin altında);
 * Adrian ve ark. (2014; diken başı genellikle 1 µm'den küçük, boynu ~100 nm; iki foton mikroskobunun sınırı 400–500 nm);
 * Savtchenko ve Rusakov (2007; kuramsal en uygun aralık 12–20 nm, elektron mikroskobundaki sinaps yapısıyla uyumlu).
 * BigBrain'in ince dilimlerden kurulduğu 3. bölümde anlatılır (Paquola ve ark., 2021; Amunts ve ark., 2013).
 * Gray'in (1918) piramit hücresi boyu güncel bir ölçüyle karşılaştırılamadığı için nörona sayı ve basamak verilmez.
 * Oranlar bölümdeki tablodaki yuvarlak değerlerle hesaplanır: 152 mm, 4,5 mm, 1 µm, 100 nm, 20 nm.
 */

type Basamak = 'beyin' | 'kabuk' | 'akson' | 'diken' | 'aralik';

const KIRMIZI = '#e03131';
const KARE = '#1f2a44';
const KOYU_YAZI = '#2a2320';

interface Bilgi {
  dugme: string;
  baslik: string;
  olcu: string;
  oran: string;
  yontem: string;
  metin: string;
  bakis: string;
  kare: boolean;
  etiket: string;
}

const BILGI: Record<Basamak, Bilgi> = {
  beyin: {
    dugme: '1. Beyin',
    baslik: 'Basamak 1: bütün beyin',
    olcu: 'Önden arkaya 152 mm. Bu ölçü tek bir beyinde alındı.',
    oran: 'İlk basamak.',
    yontem: 'Doğrudan bakınca da, MR görüntüsünde de görülür.',
    metin:
      'Merdivenin en üstünde bütün beyin var. Erişkin beyni 1200 ile 1500 g arasında gelir ve yaklaşık 1400 cm³ yer kaplar. Küçük kare, kabuğun en kalın yerini gösteriyor: hareket kabuğunu taşıyan presantral kıvrım.',
    bakis: 'Soldan bakış: ön solda, tepe yukarıda',
    kare: true,
    etiket: 'Önden arkaya: 152 mm',
  },
  kabuk: {
    dugme: '2. Kabuk',
    baslik: 'Basamak 2: kabuğun kalınlığı',
    olcu: 'En kalın yerinde (presantral kıvrım) 4,5 mm’yi geçer.',
    oran: 'Beynin boyunun yaklaşık 34’te biri (152 ÷ 4,5 ≈ 33,8).',
    yontem: 'MR’da ölçülebilir. Buradaki sayı ise ince dilimlerden kurulan BigBrain modelinden gelir.',
    metin:
      'Şimdi presantral kıvrımı kesip içine bakıyoruz. BigBrain’de dokudaki büzülme düzeltilince burada kabuğun kalınlığı 4,5 mm’yi geçer. Şakak kabuğundan alınan bir milimetreküplük parçada yaklaşık 57.000 hücre ve 150 milyon sinaps vardı.',
    bakis: 'Presantral kıvrımın kesiti: yüzey yukarıda',
    kare: true,
    etiket: 'En kalın yerde 4,5 mm’yi geçer',
  },
  akson: {
    dugme: '3. Akson',
    baslik: 'Basamak 3: kabuktan kabuğa giden akson',
    olcu: 'Ortalama çap çoğunlukla 1 µm’nin altında. 1 µm, milimetrenin binde biridir.',
    oran: 'Kabuk kalınlığının kabaca 4500’de biri (4,5 mm = 4500 µm; akson 1 µm alındı).',
    yontem: 'Bu çaplar elektron mikroskobuyla ölçüldü.',
    metin:
      'Şimdi kabuğun altındaki beyaz cevhere iniyoruz. Kabuktan kabuğa giden aksonlar burada uzanır. Çizimde akson, onu saran yağlı kılıfla (miyelin) birlikte gösterildi.',
    bakis: 'Boyuna kesit: akson soldan sağa uzanır',
    kare: false,
    etiket: 'Çap: çoğunlukla 1 µm’nin altında',
  },
  diken: {
    dugme: '4. Dendritik diken',
    baslik: 'Basamak 4: dendritik diken',
    olcu: 'Boynu yaklaşık 100 nm genişliğinde. Başı genellikle 1 µm’den küçük.',
    oran: 'Akson çapının yaklaşık 10’da biri (1 µm = 1000 nm; 1000 ÷ 100 = 10).',
    yontem: 'Elektron mikroskobuyla görülür.',
    metin:
      'Şimdi aksondan ayrılıp bir dendrite bakıyoruz. Dendritlerin üstündeki küçük çıkıntılara dendritik diken denir. Dikenin başı, ince bir boyunla dendrite bağlanır. Bir nanometre (nm), mikrometrenin binde biridir.',
    bakis: 'Yandan bakış: dendrit ve dikenleri',
    kare: false,
    etiket: 'Boyun genişliği: yaklaşık 100 nm',
  },
  aralik: {
    dugme: '5. Sinaptik aralık',
    baslik: 'Basamak 5: sinaptik aralık',
    olcu: 'Kuramsal en uygun yüksekliği yaklaşık 12–20 nm.',
    oran: 'Diken boynunun yaklaşık 5’te biri (100 ÷ 20; aralık 20 nm alındı).',
    yontem: 'Bu sayı bir ölçümden değil, bir hesaptan gelir.',
    metin:
      'İki nöronun buluştuğu yerde, aralarında dar bir boşluk kalır: sinaptik aralık. 12–20 nm’lik değer bir ölçümden değil, kuramsal bir hesaptan gelir. Hesaba göre aralığın en uygun yüksekliği budur. 152 mm’lik beyinden 20 nm’lik aralığa inerken boyut yaklaşık 7,6 milyon kat küçülür.',
    bakis: 'Kesit: iki nöronun buluştuğu yer',
    kare: false,
    etiket: 'Aralık: kuramsal olarak 12–20 nm',
  },
};

const SIRA: Basamak[] = ['beyin', 'kabuk', 'akson', 'diken', 'aralik'];

/** Sayı ile birimi ve kısa hesapları aynı satırda tutar (telefonda "1" ile "µm" ayrı satıra düşmesin). */
const birlesik = (s: string) => s.replace(/(\d) (mm|µm|nm|g|cm³)/g, '$1 $2').replace(/ ([÷≈=]) /g, ' $1 ');

/* ——— Merdiven: her çizgi bir üstündekinin onda biri (100 mm → 10 nm) ——— */

const Y0 = 40;
const ARA = 33;
const yMetre = (m: number) => Y0 + (-1 - Math.log10(m)) * ARA;
const CIZGILER = ['100 mm', '10 mm', '1 mm', '100 µm', '10 µm', '1 µm', '100 nm', '10 nm'];

/** Noktalar orandaki yuvarlak değerlerdedir: 152 mm, 4,5 mm, 1 µm, 100 nm; aralık 12–20 nm bir çizgidir. */
const ISARETLER: { d: Basamak; ad: string; y: number; y2?: number }[] = [
  { d: 'beyin', ad: 'beyin', y: yMetre(0.152) },
  { d: 'kabuk', ad: 'kabuk', y: yMetre(0.0045) },
  { d: 'akson', ad: 'akson', y: yMetre(1e-6) },
  { d: 'diken', ad: 'diken', y: yMetre(1e-7) },
  { d: 'aralik', ad: 'aralık', y: yMetre(2e-8), y2: yMetre(1.2e-8) },
];

function Merdiven({ secili, azalt }: { secili: Basamak; azalt: boolean }) {
  const s = ISARETLER.find((i) => i.d === secili) ?? ISARETLER[0];
  const yS = s.y2 ? (s.y + s.y2) / 2 : s.y;
  return (
    <g>
      <text x="66" y="14" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--ink-2)">
        Ölçek merdiveni
      </text>
      <line x1="52" y1="24" x2="52" y2="282" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="74" y1="24" x2="74" y2="282" stroke="var(--ink-3)" strokeWidth="1.5" />
      {CIZGILER.map((ad, i) => {
        const y = Y0 + i * ARA;
        const kalin = ad === '1 mm' || ad === '1 µm';
        return (
          <g key={ad}>
            <line x1="52" y1={y} x2="74" y2={y} stroke="var(--ink-3)" strokeWidth={kalin ? 2.2 : 1.2} />
            <text
              x="46"
              y={y + 3.7}
              textAnchor="end"
              fontSize="10.5"
              fontWeight={kalin ? 700 : 400}
              fill={kalin ? 'var(--ink-2)' : 'var(--ink-3)'}
            >
              {ad}
            </text>
          </g>
        );
      })}
      <circle
        cx="74"
        cy="0"
        r="9"
        fill="none"
        stroke={KIRMIZI}
        strokeWidth="2"
        style={{ transform: `translateY(${yS}px)`, transition: azalt ? 'none' : 'transform .5s cubic-bezier(.2,.7,.2,1)' }}
      />
      {ISARETLER.map((i) => {
        const bu = i.d === secili;
        const renk = bu ? KIRMIZI : 'var(--ink-3)';
        const yOrta = i.y2 ? (i.y + i.y2) / 2 : i.y;
        return (
          <g key={i.d}>
            {i.y2 ? (
              <line x1="74" y1={i.y} x2="74" y2={i.y2} stroke={renk} strokeWidth={bu ? 6 : 5} strokeLinecap="round" />
            ) : (
              <circle cx="74" cy={i.y} r={bu ? 5 : 3.5} fill={renk} />
            )}
            <text x="86" y={yOrta + 3.8} fontSize="10.5" fontWeight={bu ? 700 : 400} fill={bu ? 'var(--ink)' : 'var(--ink-3)'}>
              {i.ad}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ——— Basamak çizimleri (pano içi: 258 × 290) ——— */

function OlcuUcu({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={KIRMIZI} strokeWidth="2" strokeLinecap="round" />;
}

const BEYIN =
  'M22,150 C10,118 22,70 70,50 C110,32 170,32 206,52 C232,66 246,100 240,132 C236,150 224,162 208,166 C188,170 170,166 156,170 C136,180 112,190 88,188 C68,186 56,176 58,164 C46,166 30,162 22,150 Z';

function BeyinCizim() {
  return (
    <g>
      <g transform="translate(0 16)">
        <defs>
          <clipPath id="olcek-merdiveni-beyin">
            <path d={BEYIN} />
          </clipPath>
        </defs>
        {/* Beyin sapı ve beyincik (büyük beynin altında) */}
        <path d="M146,166 C150,190 152,208 154,226 L172,226 C170,206 170,188 172,168 Z" fill="#e7cdbf" stroke="#b48a7a" strokeWidth="1.5" />
        <ellipse cx="196" cy="184" rx="36" ry="22" fill="#e7cdbf" stroke="#b48a7a" strokeWidth="1.5" />
        <path
          d="M168,188 C184,182 208,182 226,190 M174,198 C188,194 206,194 220,200"
          fill="none"
          stroke="#b48a7a"
          strokeWidth="1"
          opacity="0.7"
        />
        {/* Büyük beyin */}
        <path d={BEYIN} fill="#efd9cf" stroke="#b48a7a" strokeWidth="2" />
        {/* Presantral kıvrım: merkezî oluğun hemen önündeki şerit */}
        <path
          d="M128,20 L125,38 C119,60 109,80 107,96 C105,110 99,118 95,130"
          stroke="#f2b544"
          strokeWidth="18"
          fill="none"
          opacity="0.8"
          clipPath="url(#olcek-merdiveni-beyin)"
        />
        {/* Lateral oluk ve merkezî oluk */}
        <path d="M58,163 C88,152 122,140 152,124" fill="none" stroke="#9c6f60" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M136,38 C130,60 120,80 118,96 C116,110 110,118 106,126"
          fill="none"
          stroke="#9c6f60"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="107.5" y="62" width="14" height="14" fill="none" stroke={KARE} strokeWidth="2" />
        <text x="89" y="100" textAnchor="end" fontSize="10.5" fill={KOYU_YAZI}>
          presantral
        </text>
        <text x="89" y="113" textAnchor="end" fontSize="10.5" fill={KOYU_YAZI}>
          kıvrım
        </text>
      </g>
      {/* Önden arkaya ölçü */}
      <line x1="18" y1="148" x2="18" y2="252" stroke={KIRMIZI} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="241" y1="139" x2="241" y2="252" stroke={KIRMIZI} strokeWidth="1" strokeDasharray="3 3" />
      <OlcuUcu x1={18} y1={258} x2={241} y2={258} />
      <OlcuUcu x1={18} y1={252} x2={18} y2={264} />
      <OlcuUcu x1={241} y1={252} x2={241} y2={264} />
    </g>
  );
}

function Noron({ x, y, akson, vurgu }: { x: number; y: number; akson: number; vurgu?: boolean }) {
  const renk = vurgu ? '#5a3a2e' : '#7d5f53';
  return (
    <g stroke={renk} fill={renk} opacity={vurgu ? 1 : 0.7} strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y - 36} strokeWidth="2" />
      <line x1={x} y1={y - 26} x2={x - 8} y2={y - 34} strokeWidth="1.5" />
      <line x1={x} y1={y - 22} x2={x + 8} y2={y - 30} strokeWidth="1.5" />
      <line x1={x - 9} y1={y + 20} x2={x - 18} y2={y + 30} strokeWidth="1.5" />
      <line x1={x + 9} y1={y + 20} x2={x + 18} y2={y + 30} strokeWidth="1.5" />
      <line x1={x} y1={y + 20} x2={x} y2={akson} strokeWidth={vurgu ? 2.2 : 1.5} />
      <path d={`M${x},${y} L${x + 10},${y + 20} L${x - 10},${y + 20} Z`} stroke="none" />
    </g>
  );
}

function KabukCizim() {
  const yuzey = 'M0,64 C60,50 120,46 170,52 C210,56 236,62 258,68';
  const sinir = 'M0,156 C60,144 120,140 170,146 C210,150 236,156 258,162';
  return (
    <g>
      <path d={`${sinir} L258,258 L0,258 Z`} fill="#f4efe6" />
      <path d={`${yuzey} L258,162 C236,156 210,150 170,146 C120,140 60,144 0,156 Z`} fill="#cdbfba" />
      <path d={yuzey} fill="none" stroke="#9a8580" strokeWidth="1.5" />
      <path d={sinir} fill="none" stroke="#a8978f" strokeWidth="1" strokeDasharray="4 3" />
      <Noron x={78} y={100} akson={176} />
      <Noron x={204} y={100} akson={176} />
      <Noron x={140} y={92} akson={254} vurgu />
      {/* Kalınlık ölçüsü */}
      <OlcuUcu x1={24} y1={59} x2={24} y2={151.7} />
      <OlcuUcu x1={18} y1={59} x2={30} y2={59} />
      <OlcuUcu x1={18} y1={151.7} x2={30} y2={151.7} />
      <rect x="132" y="206" width="16" height="16" fill="none" stroke={KARE} strokeWidth="2" />
      <text x="34" y="84" fontSize="10.5" fill={KOYU_YAZI}>
        kabuk
      </text>
      <text x="34" y="242" fontSize="10.5" fill={KOYU_YAZI}>
        beyaz cevher
      </text>
      <text x="156" y="108" fontSize="10.5" fill={KOYU_YAZI}>
        nöron
      </text>
      <text x="150" y="192" fontSize="10.5" fill={KOYU_YAZI}>
        akson
      </text>
    </g>
  );
}

function AksonCizim() {
  const kiliflar: [number, number][] = [
    [8, 88],
    [102, 182],
    [196, 252],
  ];
  return (
    <g>
      {kiliflar.map(([a, b]) => (
        <rect key={a} x={a} y="112" width={b - a} height="76" rx="16" fill="#efe6d6" stroke="#bba98a" strokeWidth="1.5" />
      ))}
      <rect x="0" y="137" width="258" height="26" fill="#f5d48a" />
      <line x1="0" y1="137" x2="258" y2="137" stroke="#c99a3c" strokeWidth="1.2" />
      <line x1="0" y1="163" x2="258" y2="163" stroke="#c99a3c" strokeWidth="1.2" />
      {/* Çap: kılıfın içindeki aksonun kendisi */}
      <OlcuUcu x1={95} y1={137} x2={95} y2={163} />
      <OlcuUcu x1={90} y1={137} x2={100} y2={137} />
      <OlcuUcu x1={90} y1={163} x2={100} y2={163} />
      <line x1="95" y1="167" x2="95" y2="198" stroke={KIRMIZI} strokeWidth="1" />
      <text x="95" y="212" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ink)">
        çap
      </text>
      <text x="142" y="104" textAnchor="middle" fontSize="10.5" fill="var(--ink)">
        yağlı kılıf (miyelin)
      </text>
      <text x="22" y="154" fontSize="10.5" fill={KOYU_YAZI}>
        akson
      </text>
    </g>
  );
}

const DIKENLER = [
  { x: 129, w: 12, h: 74, r: 28 },
  { x: 40, w: 6, h: 28, r: 10 },
  { x: 78, w: 7, h: 10, r: 9 },
  { x: 218, w: 6, h: 22, r: 13 },
];

function dikenYolu({ x, w, h, r }: (typeof DIKENLER)[number], kapali: boolean): string {
  const yN = 200 - h;
  const sol = x - w / 2;
  const sag = x + w / 2;
  const alt = kapali ? 204 : 200;
  return `M${sol},${alt} L${sol},${yN} A${r},${r} 0 1 1 ${sag},${yN} L${sag},${alt}${kapali ? ' Z' : ''}`;
}

function DikenCizim() {
  const sirali = [...DIKENLER].sort((a, b) => a.x - b.x);
  let ust = 'M0,200';
  for (const d of sirali) ust += ` H${d.x - d.w / 2} M${d.x + d.w / 2},200`;
  ust += ' H258';
  return (
    <g>
      <rect x="0" y="200" width="258" height="34" fill="#bcd4ec" />
      {DIKENLER.map((d) => (
        <path key={`d${d.x}`} d={dikenYolu(d, true)} fill="#bcd4ec" />
      ))}
      {DIKENLER.map((d) => (
        <path key={`c${d.x}`} d={dikenYolu(d, false)} fill="none" stroke="#6f95bf" strokeWidth="1.5" />
      ))}
      <path d={ust} fill="none" stroke="#6f95bf" strokeWidth="1.5" />
      <line x1="0" y1="234" x2="258" y2="234" stroke="#6f95bf" strokeWidth="1.5" />
      {/* Boyun genişliği */}
      <OlcuUcu x1={123} y1={158} x2={123} y2={174} />
      <OlcuUcu x1={135} y1={158} x2={135} y2={174} />
      <line x1="100" y1="166" x2="115" y2="166" stroke={KIRMIZI} strokeWidth="1.5" />
      <path d="M122,166 L114,161.5 L114,170.5 Z" fill={KIRMIZI} />
      <line x1="144" y1="166" x2="154" y2="166" stroke={KIRMIZI} strokeWidth="1.5" />
      <path d="M136,166 L144,161.5 L144,170.5 Z" fill={KIRMIZI} />
      <text x="160" y="170" fontSize="10.5" fontWeight="700" fill="var(--ink)">
        boyun
      </text>
      <text x="164" y="102" fontSize="10.5" fill="var(--ink)">
        baş
      </text>
      <text x="12" y="222" fontSize="10.5" fill={KOYU_YAZI}>
        dendrit
      </text>
    </g>
  );
}

function AralikCizim() {
  return (
    <g>
      <path
        d="M60,42 H198 C220,42 230,66 230,92 C230,118 220,138 198,138 H60 C38,138 28,118 28,92 C28,66 38,42 60,42 Z"
        fill="#f3cdb0"
        stroke="#c08a62"
        strokeWidth="1.5"
      />
      <path
        d="M60,156 H198 C220,156 230,178 230,206 C230,234 220,256 198,256 H60 C38,256 28,234 28,206 C28,178 38,156 60,156 Z"
        fill="#cfdcea"
        stroke="#7b97b5"
        strokeWidth="1.5"
      />
      {/* Karşı karşıya duran iki zar */}
      <line x1="60" y1="138" x2="198" y2="138" stroke="#8a5a3c" strokeWidth="3" />
      <line x1="60" y1="156" x2="198" y2="156" stroke="#4f6f93" strokeWidth="3" />
      <OlcuUcu x1={129} y1={140} x2={129} y2={154} />
      <OlcuUcu x1={123} y1={140} x2={135} y2={140} />
      <OlcuUcu x1={123} y1={154} x2={135} y2={154} />
      <text x="141" y="151" fontSize="10.5" fontWeight="700" fill="var(--ink)">
        aralık
      </text>
      <text x="129" y="95" textAnchor="middle" fontSize="10.5" fill={KOYU_YAZI}>
        bir nöron
      </text>
      <text x="129" y="212" textAnchor="middle" fontSize="10.5" fill={KOYU_YAZI}>
        öteki nöron
      </text>
    </g>
  );
}

const CIZIMLER: Record<Basamak, () => React.JSX.Element> = {
  beyin: BeyinCizim,
  kabuk: KabukCizim,
  akson: AksonCizim,
  diken: DikenCizim,
  aralik: AralikCizim,
};

export function OlcekMerdiveni() {
  const [b, setB] = useState<Basamak>('beyin');
  const azalt = useHareketAzaltilmis();
  const bilgi = BILGI[b];
  const Cizim = CIZIMLER[b];
  return (
    <div className="flex flex-col gap-4">
      <Secenekler etiket="Ölçek merdiveninin basamağı" deger={b} onDegis={setB} secenekler={SIRA.map((d) => ({ d, ad: BILGI[d].dugme }))} />
      <svg
        viewBox="0 0 400 328"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label={`Ölçek merdiveni. ${bilgi.baslik}. ${bilgi.etiket}. Şema; şekiller gerçek oranlarında değildir.`}
      >
        <Merdiven secili={b} azalt={azalt} />
        <g transform="translate(138 4)">
          <defs>
            <clipPath id="olcek-merdiveni-pano">
              <rect width="258" height="290" rx="12" />
            </clipPath>
          </defs>
          <rect width="258" height="290" rx="12" fill="var(--surface-2)" />
          <g clipPath="url(#olcek-merdiveni-pano)">
            <Cizim />
          </g>
          <text x="12" y="20" fontSize="10.5" fill="var(--ink-2)">
            {bilgi.bakis}
          </text>
          {bilgi.kare && (
            <text x="12" y="34" fontSize="10.5" fill="var(--ink-3)">
              Kare: sonraki basamakta büyütülen yer
            </text>
          )}
          <text x="129" y="280" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">
            {bilgi.etiket}
          </text>
        </g>
        <text x="200" y="311" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          Şema: şekiller gerçek oranlarında değildir.
        </text>
        <text x="200" y="324" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          Merdivende her çizgi bir üstündekinin onda biridir.
        </text>
      </svg>
      <div aria-live="polite" className="flex flex-col gap-3">
        <p className="font-semibold">{bilgi.baslik}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ['Büyüklük', bilgi.olcu],
              ['Bir önceki basamağa göre', bilgi.oran],
              ['Nasıl görülür?', bilgi.yontem],
            ] as const
          ).map(([ad, deger]) => (
            <div key={ad} className="flex flex-col gap-1 rounded-2xl border border-rule bg-paper p-3">
              <p className="t-small text-ink-2">{ad}</p>
              <p className="text-[0.95rem]">{birlesik(deger)}</p>
            </div>
          ))}
        </div>
        <p className="text-[0.98rem]">{birlesik(bilgi.metin)}</p>
      </div>
    </div>
  );
}
