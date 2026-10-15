'use client';

import { useState, type ReactNode } from 'react';
import { Secenekler } from './ortak';

/**
 * Kafa kemiğinden beyin kabuğuna zarlar ve boşluklar: tepe bölgesinden alınmış koronal bir kesit parçası (önden bakış;
 * kemik yukarıda, orta hat sağda). Ekranın solunda beynin dış yüzü (kıvrımlar ve oluklar), sağda orta hatta üst sagital
 * sinüs ve beyin orağı. Önden bakıldığı için ekranın solundaki yarımküre hastanın sağ yarımküresidir. Görünümler: üç zar ve subaraknoid boşluk; sert zarın üç katı, örümcek ağı zarın engel hücre katı, sinüs ve
 * granülasyon; hangi boşluğun gerçek olduğu; kanın hangi katta biriktiği. Şemadır; katların kalınlığı ölçekli değildir.
 *
 * Kaynaklar (yazar-yıl): Gray (1918; üç zar, kıvrım tepesinde dar ve oluk ağzında üçgen subaraknoid boşluk, sinüsün iki
 * sert zar katı arasında ve endotelle döşeli oluşu, granülasyonun sinüs endotelinin altına uzanması, sert zarın dikişlerde
 * kemiğe en sıkı yapışması); FIPAT (2019, Terminologia Anatomica 2: epidural ve subdural boşluk "inconstant", not 770);
 * Ishikawa, Mizutani ve Toda (2026; üç katlı sert zar, kalınlık 0,33–0,56 mm, sınır hücre katının <10 µm, 3–8 sıra
 * hücreli ve sıkı bağlantısız oluşu, "subdural boşluk"un bu katta açılan yarık oluşu, orak ve çadırın çift kat meningeal
 * sert zar oluşu); Zwirner ve ark. (2019; şakak sert zarı ortalama 0,68 mm); Joost ve ark. (2026; trabeküller, subaraknoid
 * boşluktaki atardamar ve toplardamarlar, sınır hücre katının zayıflığı, köprü toplardamarından bu kata kanama); Derk ve ark. (2021; engel hücrelerinin sıkı
 * bağlantıları); Zedde ve Pascarella (2025a) ile Mahendru ve Chong (2009; örümcek ağı zar oluğun üstünden geçer, yumuşak zar
 * oluğa iner); Dafny (2020; yüzey damarları yumuşak zarın üstünde, subaraknoid boşlukta); Proulx (2021; granülasyonlar sert
 * zarı geçip sinüse uzanır, sinüs endotelini tümüyle delmez); Kim ve Gean (2011; sinüsün dış duvarı kemik zarı katıdır,
 * epidural kanın dikişleri aşmaması); Khairat ve ark. (2025; epidural kanın yeri); Nouri ve ark. (2021; köprü
 * toplardamarının duvarı sınır hücre katında en incedir); Edlmann ve ark. (2017; ayrılan sınır hücrelerinin iki yanda
 * birer zar bırakması); Ziu ve ark. (2023; subaraknoid kanın yeri); Byrne ve Dafny (t.y., Neuroanatomy Online; subaraknoid
 * kan bel delmeyle alınan BOS'ta görülebilir).
 */

type Gorunum = 'uc' | 'sert' | 'bosluk' | 'kan';
type Nokta = [number, number];

/* ---------- Geometri: M, L, Q, C komutlarından örneklenmiş çoklu çizgiler ---------- */

function ornekle(d: string): Nokta[] {
  const t = d.match(/[MLQC]|-?\d*\.?\d+/g) ?? [];
  const cikti: Nokta[] = [];
  let i = 0;
  let komut = 'M';
  let s: Nokta = [0, 0];
  const sayi = () => parseFloat(t[i++]);
  while (i < t.length) {
    if (/[MLQC]/.test(t[i])) komut = t[i++];
    if (komut === 'M') {
      s = [sayi(), sayi()];
      cikti.push(s);
      komut = 'L';
    } else if (komut === 'L') {
      const p: Nokta = [sayi(), sayi()];
      const n = Math.max(1, Math.ceil(Math.hypot(p[0] - s[0], p[1] - s[1]) / 3));
      for (let k = 1; k <= n; k++) cikti.push([s[0] + ((p[0] - s[0]) * k) / n, s[1] + ((p[1] - s[1]) * k) / n]);
      s = p;
    } else if (komut === 'Q') {
      const c: Nokta = [sayi(), sayi()];
      const p: Nokta = [sayi(), sayi()];
      for (let k = 1; k <= 16; k++) {
        const u = k / 16;
        const a = (1 - u) * (1 - u);
        const b = 2 * u * (1 - u);
        const e = u * u;
        cikti.push([a * s[0] + b * c[0] + e * p[0], a * s[1] + b * c[1] + e * p[1]]);
      }
      s = p;
    } else {
      const c1: Nokta = [sayi(), sayi()];
      const c2: Nokta = [sayi(), sayi()];
      const p: Nokta = [sayi(), sayi()];
      for (let k = 1; k <= 16; k++) {
        const u = k / 16;
        const a = (1 - u) ** 3;
        const b = 3 * u * (1 - u) ** 2;
        const c = 3 * u * u * (1 - u);
        const e = u ** 3;
        cikti.push([a * s[0] + b * c1[0] + c * c2[0] + e * p[0], a * s[1] + b * c1[1] + c * c2[1] + e * p[1]]);
      }
      s = p;
    }
  }
  return cikti;
}

type Kayma = (x: number) => number;
const sifir: Kayma = () => 0;
const kaydir = (nn: Nokta[], f: Kayma): Nokta[] => nn.map(([x, y]) => [x, y + f(x)]);
const yaz = (nn: Nokta[], kapali = false) =>
  'M' + nn.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join('L') + (kapali ? 'Z' : '');
const bant = (ust: Nokta[], alt: Nokta[]) => yaz([...ust, ...[...alt].reverse()], true);

/** Mercek: x = m'de en kalın (h), m ± w'de sıfır. */
const mercek =
  (m: number, w: number, h: number): Kayma =>
  (x) => {
    const u = (x - m) / w;
    return Math.abs(u) < 1 ? h * (1 - u * u) : 0;
  };

/* ---------- Yerleşim (birim: SVG; şema) ----------
   Kemik 20–42, endosteal kat 42–56, meningeal kat 56–74, sınır hücre katı 74–80, engel hücre katı 80–84,
   örümcek ağı zarın iç kısmı 84–87, altında subaraknoid boşluk. Orta hat x = 342: üst sagital sinüs (318–366, tepe 104)
   ve beyin orağı (334–350). Sol kenardaki etiket sütunu 0–126. */

/** Sert zarın iç yüzüne (meningeal katın alt sınırına) d kadar içeriden paralel çizgi; ekranın solundaki yarımküre
 *  (önden bakışta hastanın sağ yarımküresi). */
const solKontur = (d: number) => ornekle(`M128,${74 + d} L292,${74 + d} Q${330 - d},${76 + d} ${334 - d},116 L${334 - d},268`);
/** Aynısı, ekranın sağındaki (orta hattın öbür yanındaki) yarımküre; orta hatta göre ayna. */
const sagKontur = (d: number) => ornekle(`M406,${74 + d} L392,${74 + d} Q${354 + d},${76 + d} ${350 + d},116 L${350 + d},268`);

const K = { 0: solKontur(0), 3: solKontur(3), 6: solKontur(6), 10: solKontur(10), 13: solKontur(13) };
const KS = { 0: sagKontur(0), 3: sagKontur(3), 6: sagKontur(6), 10: sagKontur(10), 13: sagKontur(13) };

const ENDO_UST = ornekle('M128,42 L406,42');
const ENDO_ALT = ornekle('M128,56 L406,56');
const MEN_SOL = ornekle('M128,56 L318,56 L342,104 L342,268 L334,268 L334,116 Q330,76 292,74 L128,74');
const MEN_SAG = ornekle('M406,56 L366,56 L342,104 L342,268 L350,268 L350,116 Q354,76 392,74 L406,74');

/** Yumuşak zar = kabuğun yüzü: üç kıvrım, iki oluk, sağda orta hatta inen iç yüz. */
const PIA_SOL = ornekle(
  'M128,104 C140,96 152,90 168,90 C184,90 196,93 201,100 C204,105 205,111 205,120 L205,190 Q208,198 211,190 ' +
    'L211,120 C211,111 212,105 215,100 C222,93 232,90 244,90 C256,90 266,93 270,100 C273,105 273,111 273,120 ' +
    'L273,184 Q276,192 279,184 L279,120 C279,111 280,105 283,100 C287,94 291,91 296,91 C304,92 309,98 311,108 ' +
    'C312,114 312,122 312,130 L312,268',
);
const AK_SOL = ornekle(
  'M128,130 C140,121 154,117 168,117 C180,117 188,119 191,126 L192,198 Q208,220 224,198 L225,126 ' +
    'C228,119 236,117 244,117 C252,117 256,119 259,126 L260,194 Q276,216 292,194 L292,126 C293,119 296,117 299,121 ' +
    'L299,268 L128,268',
);
const PIA_SAG = ornekle('M406,106 C400,96 394,91 388,91 C380,92 375,98 373,108 C372,114 372,122 372,130 L372,268');
const AK_SAG = 'M406,120 C398,117 391,118 387,126 L385,268 L406,268 Z';

const KEMIK =
  'M128,21 L138,18 L150,22 L163,19 L177,23 L190,19 L204,22 L219,18 L233,22 L248,19 L262,23 L277,19 L291,22 ' +
  'L306,18 L320,22 L335,19 L349,23 L364,19 L378,22 L392,18 L406,21 L406,42 L128,42 Z';
const SINUS = 'M318,56 L366,56 L342,104 Z';
/** Granülasyonun sapı (sağ subaraknoid boşluktan sinüsün sağ duvarına) ve sinüse kabaran tepesi (üç yuvarlak). */
const GRAN_SAP = 'M370,101 C364,98 358,93 351,89';
const GRAN_TOP: [number, number, number][] = [
  [348.5, 86.5, 3.4],
  [345.5, 91, 3],
  [350.5, 91.5, 2.6],
];
/** Köprü toplardamarı: ekranın solundaki yarımkürenin üst iç köşesinden sinüsün ekrandaki sol duvarına. */
const KOPRU = 'M312,113 C318,104 324,90 331,78';
const ENDOTEL = 'M320.6,57.6 L363.4,57.6 L342,100.4 Z';

/** Subaraknoid boşluğu geçen ince iplikler (trabeküller): [x1, y1, x2, y2]. */
const TRABEKUL: [number, number, number, number][] = [
  [192, 87.5, 195, 93.4],
  [199, 87.5, 204, 93.5],
  [217, 87.5, 212, 93.5],
  [224, 87.5, 222.5, 93.6],
  [262, 87.5, 263.5, 92.6],
  [269, 87.5, 272.5, 92.8],
  [284, 87.5, 279.8, 92.8],
  [290, 87.5, 290.5, 92.6],
  [313, 150, 321, 150],
  [313, 176, 321, 172],
  [313, 204, 321, 204],
  [313, 232, 321, 228],
  [363, 160, 372, 160],
  [363, 194, 372, 198],
  [363, 230, 372, 230],
];

/** Subaraknoid boşluktaki damarlar: atardamar (kırmızı), toplardamar (mavi). */
const DAMAR: { x: number; y: number; r: number; tur: 'a' | 'v' }[] = [
  { x: 208, y: 97, r: 4.5, tur: 'a' },
  { x: 276, y: 97, r: 5, tur: 'v' },
  { x: 316.5, y: 190, r: 3.2, tur: 'a' },
];

const RENK = {
  kemik: '#ede4d0',
  kemikCizgi: '#b4a17f',
  sertZar: '#c9ab88',
  endosteal: '#dcc5a2',
  meningeal: '#bf9c76',
  sinir: '#f0e4d2',
  sinirHucre: '#d2bb9b',
  engel: '#8496b2',
  icAraknoid: '#adbcd1',
  bos: '#d3e9f9',
  bosVurgu: '#a6d3f6',
  gri: '#e7b9ad',
  ak: '#f5eee3',
  pia: '#c25b6e',
  atar: '#d9473c',
  toplar: '#4c6fbd',
  sinus: '#5677b8',
  kan: '#b3261e',
  trabekul: '#7d8fab',
  oncu: '#6b7891',
};

const BILGI: Record<Gorunum, { baslik: string; metin: ReactNode }> = {
  uc: {
    baslik: 'Üç zar ve aradaki boşluk',
    metin: (
      <>
        Kemiğin altında dıştan içe üç zar vardır: sert zar (<i>dura mater</i>), örümcek ağı zar (<i>arachnoidea mater</i>) ve beyne yapışık
        yumuşak zar (<i>pia mater</i>). Son iki zarın arası subaraknoid boşluktur ve beyin-omurilik sıvısıyla (BOS) doludur. İnce iplikler
        (trabeküller) bu boşluğu ağ gibi geçer, beynin yüzey damarları da buradadır (Joost ve ark., 2026). Boşluk kıvrım tepesinde çok
        dardır, oluk ağzında genişler: yumuşak zar oluğa iner, örümcek ağı zar oluğun üstünden geçer (Gray, 1918).
      </>
    ),
  },
  sert: {
    baslik: 'Sert zarın katları, sinüs ve granülasyon',
    metin: (
      <>
        Bugün sert zarda üç kat sayılır: kemiğe yapışan endosteal kat, meningeal kat ve en içte sınır hücre katı (Ishikawa ve ark., 2026).
        Sert zarın kalınlığı ortalama <span className="whitespace-nowrap">0,33–0,56 mm</span> (Ishikawa ve ark., 2026), şakaktan alınan
        örneklerde ortalama 0,68&nbsp;mm olarak verilir (Zwirner ve ark., 2019). Sınır hücre katı 10 mikrometreden incedir ve gevşektir
        (Ishikawa ve ark., 2026). Altındaki örümcek ağı zarın engel hücre katı ise sıkı bağlantılarla kenetlidir (Derk ve ark., 2021). Orta
        hattaki üst sagital sinüs iki sert zar katı arasındadır ve endotelle döşelidir (Gray, 1918). Örümcek ağı zarın granülasyonları sert
        zarı geçip sinüse uzanır (Gray, 1918; Proulx, 2021).
      </>
    ),
  },
  bosluk: {
    baslik: 'Hangi boşluk gerçek?',
    metin: (
      <>
        Normalde sert zar kemiğe, örümcek ağı zar da sert zara yapışıktır (FIPAT, 2019). Bu yüzden uluslararası anatomi terimleri listesi
        (TA2), kafa içindeki epidural ve subdural boşluğu “her zaman bulunmayan” (<i>inconstant</i>) diye işaretler (FIPAT, 2019). Klinikte
        “subdural boşluk” denen yer, bir darbenin ya da kanamanın sınır hücre katında açtığı yarıktır (Ishikawa ve ark., 2026). Subaraknoid
        boşluk ise gerçektir ve BOS ile doludur (Gray, 1918).
      </>
    ),
  },
  kan: {
    baslik: 'Kan hangi katta birikir?',
    metin: (
      <>
        Epidural kan, kemik ile sert zar arasında toplanır (Khairat ve ark., 2025). Sert zar dikiş yerlerinde kemiğe çok sıkı tutunduğu için
        kan dikişleri aşamaz ve mercek gibi kabarır (Kim ve Gean, 2011). “Subdural” kan, sınır hücre katını geçerken yırtılan köprü
        toplardamarından (sinüse giden mavi damar) bu katın içine dolar (Joost ve ark., 2026). Subaraknoid kan örümcek ağı zarın altında
        BOS’a karışır (Ziu ve ark., 2023). Bu yüzden bel delmeyle (lomber ponksiyon) alınan BOS’ta görülebilir (Byrne ve Dafny, 2026).
      </>
    ),
  },
};

type Etiket = { y: number; satir: string[]; hedef: Nokta };

const ETIKETLER: Record<Gorunum, Etiket[]> = {
  uc: [
    { y: 35, satir: ['kemik'], hedef: [137, 31] },
    { y: 64, satir: ['sert zar'], hedef: [137, 61] },
    { y: 88, satir: ['örümcek ağı zar'], hedef: [137, 83.5] },
    { y: 108, satir: ['subaraknoid boşluk', '(BOS dolu)'], hedef: [134, 93.5] },
    { y: 140, satir: ['yumuşak zar'], hedef: [145, 95] },
    { y: 160, satir: ['kabuk (gri cevher)'], hedef: [146, 108] },
    { y: 180, satir: ['beyaz cevher'], hedef: [142, 160] },
  ],
  sert: [
    { y: 35, satir: ['kemik'], hedef: [137, 31] },
    { y: 53, satir: ['endosteal kat'], hedef: [137, 49] },
    { y: 69, satir: ['meningeal kat'], hedef: [137, 65] },
    { y: 86, satir: ['sınır hücre katı'], hedef: [137, 77] },
    { y: 103, satir: ['engel hücre katı'], hedef: [137, 82] },
    { y: 120, satir: ['subaraknoid boşluk'], hedef: [134, 93.5] },
  ],
  bosluk: [
    { y: 28, satir: ['kemik'], hedef: [137, 28] },
    { y: 46, satir: ['epidural aralık', 'normalde yok'], hedef: [140, 42] },
    { y: 80, satir: ['subdural aralık', 'normalde yok'], hedef: [140, 77] },
    { y: 112, satir: ['subaraknoid boşluk', 'gerçek, BOS dolu'], hedef: [134, 93.5] },
    { y: 146, satir: ['yumuşak zar'], hedef: [145, 95] },
  ],
  kan: [
    { y: 35, satir: ['kemik'], hedef: [137, 31] },
    { y: 64, satir: ['sert zar'], hedef: [137, 61] },
    { y: 88, satir: ['örümcek ağı zar'], hedef: [137, 83.5] },
    { y: 108, satir: ['subaraknoid boşluk'], hedef: [134, 93.5] },
    { y: 128, satir: ['yumuşak zar'], hedef: [145, 95] },
    { y: 148, satir: ['kabuk'], hedef: [146, 108] },
  ],
};

function SolEtiket({ e }: { e: Etiket }) {
  return (
    <g>
      <text x="124" y={e.y} textAnchor="end" fontSize="10.5" fill="var(--ink)">
        {e.satir.map((s, i) => (
          <tspan key={s} x="124" dy={i ? 12 : 0} fill={i ? 'var(--ink-3)' : undefined}>
            {s}
          </tspan>
        ))}
      </text>
      <line x1="127" y1={e.y - 3.5} x2={e.hedef[0]} y2={e.hedef[1]} stroke={RENK.oncu} strokeWidth="0.8" />
      <circle cx={e.hedef[0]} cy={e.hedef[1]} r="1.5" fill="#3f4a5e" />
    </g>
  );
}

/** Üst satırdaki açıklama: yazı ve aşağıya inen çizgi. */
function UstEtiket({
  x,
  yazi,
  hedef,
  hiza = 'middle',
  cizgiX,
}: {
  x: number;
  yazi: string;
  hedef: Nokta;
  hiza?: 'middle' | 'end';
  cizgiX?: number;
}) {
  const bas = cizgiX ?? (hiza === 'end' ? x - yazi.length * 2.8 : x);
  return (
    <g>
      <text x={x} y="11" textAnchor={hiza} fontSize="10.5" fill="var(--ink)">
        {yazi}
      </text>
      <line x1={bas} y1="14" x2={hedef[0]} y2={hedef[1]} stroke={RENK.oncu} strokeWidth="0.8" />
      <circle cx={hedef[0]} cy={hedef[1]} r="1.5" fill="#3f4a5e" />
    </g>
  );
}

/** Çizimin içindeki etiket: zeminli yazı. */
function Cip({ x, y, yazi }: { x: number; y: number; yazi: string }) {
  const g = yazi.length * 5.6 + 12;
  return (
    <g>
      <rect x={x - g / 2} y={y - 10.5} width={g} height="15" rx="7.5" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="0.8" />
      <text x={x} y={y} textAnchor="middle" fontSize="10.5" fill="var(--ink)">
        {yazi}
      </text>
    </g>
  );
}

export function ZarKatmanlari() {
  const [g, setG] = useState<Gorunum>('uc');
  const b = BILGI[g];
  const kan = g === 'kan';
  const ayrintili = g !== 'uc';

  // "Kan" görünümünde epidural kan (kemik ile sert zar arası) bütün sert zarı ve altını, subdural kan (sınır hücre
  // katının içinde) katın alt yarısını ve altını aşağı iter.
  const dE: Kayma = kan ? mercek(174, 26, 12) : sifir;
  const dS: Kayma = kan ? mercek(280, 44, 9) : sifir;
  const ust = dE;
  const alt: Kayma = (x) => dE(x) + dS(x);

  const pia = kaydir(PIA_SOL, alt);
  const arakIc = kaydir(K[13], alt);
  const sasYol = bant(arakIc, pia);
  const sasSagYol = bant(KS[13], PIA_SAG);

  const endo = ayrintili ? RENK.endosteal : RENK.sertZar;
  const men = ayrintili ? RENK.meningeal : RENK.sertZar;
  const sinir = ayrintili ? RENK.sinir : RENK.sertZar;

  // Kanların biçimleri
  const edhUst: Nokta[] = [];
  for (let x = 148; x <= 200; x += 2) edhUst.push([x, 42]);
  const edh = kan ? bant(edhUst, kaydir(edhUst, dE)) : '';
  const sdhUst = K[3].filter(([x]) => x >= 236 && x <= 324);
  const sdh = kan ? bant(kaydir(sdhUst, ust), kaydir(sdhUst, alt)) : '';

  const etiketler = ETIKETLER[g];

  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={g}
        onDegis={setG}
        secenekler={[
          { d: 'uc', ad: 'Üç zar' },
          { d: 'sert', ad: 'Sert zarın katları' },
          { d: 'bosluk', ad: 'Boşluklar: gerçek mi?' },
          { d: 'kan', ad: 'Kan nereye birikir?' },
        ]}
      />
      <svg
        viewBox="0 0 400 308"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label={`Kafa kemiğinden beyin kabuğuna zarlar ve boşluklar, önden bakış kesit şeması: ${b.baslik}`}
      >
        <defs>
          <clipPath id="zk-alan">
            <rect x="130" y="0" width="270" height="266" />
          </clipPath>
          <clipPath id="zk-sak">
            <rect x="176" y="80" width="64" height="130" />
          </clipPath>
        </defs>

        <g clipPath="url(#zk-alan)">
          {/* Kemik (yalnızca iç kısmı; üst kenar kesik) */}
          <path d={KEMIK} fill={RENK.kemik} stroke={RENK.kemikCizgi} strokeWidth="0.8" />

          {/* Sert zar: endosteal kat ve meningeal kat (sinüsün çevresinde ayrılır, orta hatta orak olur) */}
          <path d={bant(kaydir(ENDO_UST, ust), kaydir(ENDO_ALT, ust))} fill={endo} stroke={endo} strokeWidth="0.6" />
          <path d={yaz(kaydir(MEN_SOL, ust), true)} fill={men} stroke={men} strokeWidth="0.6" />
          <path d={yaz(MEN_SAG, true)} fill={men} stroke={men} strokeWidth="0.6" />
          {ayrintili && (
            <path d={yaz(kaydir(ENDO_ALT, ust).filter(([x]) => x < 318 || x > 366))} fill="none" stroke="#a88a66" strokeWidth="0.6" />
          )}

          {/* Üst sagital sinüs: iki sert zar katı arasında, endotelle döşeli */}
          <path d={SINUS} fill={RENK.sinus} stroke={RENK.sinus} strokeWidth="0.6" />
          <path d={ENDOTEL} fill="none" stroke="#eef3fc" strokeWidth="1.3" strokeLinejoin="round" />

          {/* Sınır hücre katı (iki yarı), engel hücre katı ve örümcek ağı zarın iç kısmı */}
          <path d={bant(kaydir(K[0], ust), kaydir(K[3], ust))} fill={sinir} stroke={sinir} strokeWidth="0.6" />
          <path d={bant(kaydir(K[3], alt), kaydir(K[6], alt))} fill={sinir} stroke={sinir} strokeWidth="0.6" />
          <path d={bant(KS[0], KS[6])} fill={sinir} stroke={sinir} strokeWidth="0.6" />
          <path d={bant(kaydir(K[6], alt), kaydir(K[10], alt))} fill={RENK.engel} stroke={RENK.engel} strokeWidth="0.6" />
          <path d={bant(KS[6], KS[10])} fill={RENK.engel} stroke={RENK.engel} strokeWidth="0.6" />
          <path d={bant(kaydir(K[10], alt), arakIc)} fill={RENK.icAraknoid} stroke={RENK.icAraknoid} strokeWidth="0.6" />
          <path d={bant(KS[10], KS[13])} fill={RENK.icAraknoid} stroke={RENK.icAraknoid} strokeWidth="0.6" />

          {/* Subaraknoid boşluk (BOS) */}
          <path d={sasYol} fill={g === 'bosluk' ? RENK.bosVurgu : RENK.bos} />
          <path d={sasSagYol} fill={g === 'bosluk' ? RENK.bosVurgu : RENK.bos} />

          {/* Trabeküller */}
          <g stroke={RENK.trabekul} strokeWidth="0.9" strokeLinecap="round">
            {TRABEKUL.map(([x1, y1, x2, y2]) => (
              <line key={`${x1}-${y1}`} x1={x1} y1={y1 + alt(x1)} x2={x2} y2={y2 + alt(x2)} />
            ))}
          </g>

          {/* Subaraknoid kan: oluğun ağzında ve içinde BOS'a karışır */}
          {kan && (
            <g clipPath="url(#zk-sak)">
              <path d={sasYol} fill="#c0392b" opacity="0.62" />
              {[
                [200, 92],
                [215, 93],
                [208, 128],
                [208, 160],
                [207, 186],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y + alt(x)} r="1.6" fill="#8f1d1d" />
              ))}
            </g>
          )}

          {/* Beyin: kabuk (gri cevher) ve beyaz cevher */}
          <path d={yaz([...pia, [128, 268]], true)} fill={RENK.gri} />
          <path d={yaz(kaydir(AK_SOL, alt), true)} fill={RENK.ak} />
          <path d={yaz([...PIA_SAG, [406, 268]], true)} fill={RENK.gri} />
          <path d={AK_SAG} fill={RENK.ak} />

          {/* Yumuşak zar: beynin yüzünü ve oluğun içini izler */}
          <path d={yaz(pia)} fill="none" stroke={RENK.pia} strokeWidth="1.8" strokeLinejoin="round" />
          <path d={yaz(PIA_SAG)} fill="none" stroke={RENK.pia} strokeWidth="1.8" strokeLinejoin="round" />

          {/* Yüzey damarları (subaraknoid boşlukta, yumuşak zarın üstünde) */}
          {DAMAR.map((d) => (
            <circle
              key={d.x}
              cx={d.x}
              cy={d.y + alt(d.x)}
              r={d.r}
              fill={d.tur === 'a' ? RENK.atar : RENK.toplar}
              stroke="#fff"
              strokeWidth="0.8"
            />
          ))}

          {/* Sert zarın ayrıntısı: sınır hücre katında gevşek hücreler, engel katında sıkı dizili hücreler */}
          {g === 'sert' && (
            <g>
              {Array.from({ length: 24 }, (_, i) => 136 + i * 6.5).map((x, i) => (
                <ellipse key={x} cx={x} cy={i % 2 ? 78.4 : 75.6} rx="2.6" ry="0.95" fill={RENK.sinirHucre} />
              ))}
              {Array.from({ length: 45 }, (_, i) => 132 + i * 3.6).map((x) => (
                <line key={x} x1={x} y1="80.3" x2={x} y2="83.7" stroke="#5c6f8d" strokeWidth="0.6" />
              ))}
            </g>
          )}

          {/* Araknoid granülasyon: sağdaki subaraknoid boşluktan ince bir sapla sert zarı geçer, sinüse kabarır; üstü
              endotelle örtülüdür. Çekirdeği subaraknoid dokudur. */}
          <g>
            <path d={GRAN_SAP} fill="none" stroke={RENK.engel} strokeWidth="6.4" strokeLinecap="round" />
            <path d={GRAN_SAP} fill="none" stroke={RENK.bos} strokeWidth="3.6" strokeLinecap="round" />
            {GRAN_TOP.map(([x, y, r]) => (
              <circle key={`e${x}`} cx={x} cy={y} r={r + 2.2} fill="#eef3fc" />
            ))}
            {GRAN_TOP.map(([x, y, r]) => (
              <circle key={`k${x}`} cx={x} cy={y} r={r + 1.2} fill={RENK.engel} />
            ))}
            {GRAN_TOP.map(([x, y, r]) => (
              <circle key={`i${x}`} cx={x} cy={y} r={r} fill={RENK.bos} />
            ))}
            <path d="M343.5,87 l2.5,2 M347,84.5 l-1,3 M346,92 l2,-1.5" stroke={RENK.trabekul} strokeWidth="0.7" />
          </g>

          {/* Köprü toplardamarı: beyin yüzünden sinüse; "kan" görünümünde sınır hücre katında yırtılmış */}
          <path
            d={KOPRU}
            fill="none"
            stroke={RENK.toplar}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray={kan ? '19 7 60' : undefined}
          />
          {kan && (
            <g fill={RENK.kan}>
              <circle cx="322.5" cy="94.5" r="2.6" />
              <circle cx="319" cy="93" r="1.6" />
            </g>
          )}
          <text x="342" y="67" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">
            sinüs
          </text>

          {/* Boşluklar: normalde olmayan iki aralık kesik çizgiyle */}
          {g === 'bosluk' && (
            <g fill="none" stroke="#b0302a" strokeWidth="1.5" strokeDasharray="4 3">
              <path d="M130,42 L400,42" />
              <path d={yaz(K[3])} />
              <path d={yaz(KS[3])} />
            </g>
          )}

          {/* Kanlar */}
          {kan && (
            <g>
              <path d={edh} fill={RENK.kan} />
              <path d={sdh} fill={RENK.kan} />
            </g>
          )}
        </g>

        {/* Sol sütun: katların adları */}
        {etiketler.map((e) => (
          <SolEtiket key={`${g}-${e.satir[0]}`} e={e} />
        ))}

        {/* Görünüme özel açıklamalar */}
        {g === 'sert' && (
          <>
            <UstEtiket x={296} yazi="endotel" hedef={[330, 57.6]} />
            <UstEtiket x={398} yazi="granülasyon" hedef={[350.5, 84]} hiza="end" cizgiX={392} />
          </>
        )}
        {kan && (
          <>
            <UstEtiket x={174} yazi="epidural kan" hedef={[174, 47]} />
            <UstEtiket x={276} yazi="subdural kan" hedef={[276, 81]} />
            <line x1="208" y1="226" x2="208" y2={196 + alt(208)} stroke={RENK.oncu} strokeWidth="0.8" />
            <Cip x={208} y={238} yazi="subaraknoid kan" />
          </>
        )}

        {/* Lejant (sol alt) */}
        <g fontSize="10.5" fill="var(--ink-2)">
          <circle cx="12" cy="210" r="4" fill={RENK.atar} />
          <text x="22" y="213.5">
            atardamar
          </text>
          <circle cx="12" cy="226" r="4" fill={RENK.toplar} />
          <text x="22" y="229.5">
            toplardamar
          </text>
          <line x1="7" y1="245" x2="17" y2="239" stroke={RENK.trabekul} strokeWidth="1.2" />
          <text x="22" y="245.5">
            trabekül
          </text>
        </g>

        {/* Beyin orağı (orta hat) */}
        <line x1="342" y1="266" x2="342" y2="270" stroke={RENK.oncu} strokeWidth="0.8" />
        <text x="342" y="280" textAnchor="middle" fontSize="10.5" fill="var(--ink)">
          beyin orağı
        </text>

        <text x="200" y="293" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          Önden bakış (koronal kesit): kemik yukarıda, orta hat sağda.
        </text>
        <text x="200" y="306" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          Şema; oranlar yaklaşıktır, katların kalınlığı ölçekli değildir.
        </text>
      </svg>
      <div aria-live="polite" className="flex flex-col gap-1">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
