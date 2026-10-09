'use client';

import { useState } from 'react';
import { Secenekler, useHareketAzaltilmis } from './ortak';

/**
 * Zıt yön çiftleri beyin üzerinde (Temel düzey şema). Beş görünüm:
 * - Üst–alt, ön–arka: beynin soldan görünüşü; ön alın tarafı, arka ense tarafı.
 * - Sırtüstü yatınca: aynı beyin döner (alın tavana bakar); oklar bedene bağlı kalır, adlar değişmez.
 * - İç yan–dış yan: önden kesit; orta hat, talamus (iç yan), putamen (dış yan), üçüncü karıncık (orta hat);
 *   Türkçede "iç" sözcüğünün iki anlamı.
 * - Yüzeysel–derin: kabuk yüzeyde, kabuk altı çekirdekler derinde.
 * - Aynı taraf–karşı taraf: bir yarımküredeki noktaya göre iki yan; hareket yolu büyük ölçüde karşı tarafa geçer.
 * Önden bakışta hastanın sağı ekranın solundadır: sağ, kişinin kendi sağıdır.
 * Kaynaklar (bölüm metnindeki atıflarla): OpenStax 1.6; Henley (2021a); Ankara Üniversitesi (2017); Gray (1918);
 * FIPAT (2019); Liao ve ark. (2018); TDK (2026); Ernstmeyer ve Christman (2024); NiBabel (t.y.-a).
 */

type Gorunum = 'ust-on' | 'yatis' | 'ic-dis' | 'yuzey-derin' | 'taraf';

const BILGI: Record<Gorunum, { baslik: string; metin: string; aria: string }> = {
  'ust-on': {
    baslik: 'Üst–alt ve ön–arka',
    metin:
      'Üst daha yukarıda, başa doğru; alt daha aşağıda, ayaklara doğru demektir. Ön yüze doğrudur: beyinde alın tarafı. Arka sırta doğrudur: beyinde ense tarafı. Bu yönler, dik duran insana, yani anatomik duruşa göre söylenir.',
    aria: 'Beynin soldan görünüşü: ön alın tarafında solda, arka ense tarafında sağda, üst yukarıda, alt aşağıda',
  },
  yatis: {
    baslik: 'Sırtüstü yatınca adlar değişmez',
    metin:
      'Hasta MR cihazında sırtüstü yatıyor ve alnı tavana bakıyor. Yine de alın tarafına ön denir, tavan tarafına değil. Ense tarafı da arkadır, yatak tarafı değil. Yatışın adı değişir, yönlerin adı değişmez.',
    aria: 'Sırtüstü yatan hastanın beyni: alın tavana bakıyor, ön ok yukarıyı, arka ok yatağı gösteriyor',
  },
  'ic-dis': {
    baslik: 'İç yan ve dış yan',
    metin:
      'İç yan (medial) orta hatta doğru, dış yan (lateral) yana doğrudur. Talamus orta hatta yakındır, putamen onun dış yanında kalır. Türkçede “iç” sözcüğü iki anlama gelir. Karışmasın diye burada “iç yan” ya da “medial” de.',
    aria: 'Beynin önden kesiti: orta hat, iç yandaki talamus, dış yandaki putamen ve orta hattaki üçüncü karıncık',
  },
  'yuzey-derin': {
    baslik: 'Yüzeysel ve derin',
    metin:
      'Yüzeysel (superficialis) yüzeye yakın, derin (profundus) yüzeyden uzak demektir. Büyük beynin yüzeyini gri cevherden bir kabuk örter. Kabuğun altında, beyaz cevherin derininde gri adacıklar vardır: kabuk altı çekirdekler. Yani kabuk yüzeyseldir, bu çekirdekler derindir.',
    aria: 'Beynin önden kesiti: yüzeydeki kabuk ve derindeki çekirdekler',
  },
  taraf: {
    baslik: 'Aynı taraf ve karşı taraf',
    metin:
      'Kırmızı nokta hastanın sol yarımküresinde. Sol yan, bu noktayla aynı taraftır (ipsilateral). Sağ yan ise karşı taraftır (kontralateral). Hareket komutunu taşıyan yol büyük ölçüde karşı tarafa geçer.',
    aria: 'Beynin önden kesiti: hastanın sol yarımküresinde bir nokta; sol yan aynı taraf, sağ yan karşı taraf',
  },
};

/* ---------- Ortak çizim parçaları ---------- */

function Ok({ x1, y1, x2, y2, renk, kalin = 3 }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const u = 4 * kalin;
  const g = [x2 - u * Math.cos(a), y2 - u * Math.sin(a)];
  const u1 = [g[0] + (u / 2) * Math.sin(a), g[1] - (u / 2) * Math.cos(a)];
  const u2 = [g[0] - (u / 2) * Math.sin(a), g[1] + (u / 2) * Math.cos(a)];
  return (
    <g>
      <line x1={x1} y1={y1} x2={g[0]} y2={g[1]} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <path d={`M${x2},${y2} L${u1[0]},${u1[1]} L${u2[0]},${u2[1]} Z`} fill={renk} />
    </g>
  );
}

/** Beyin dokusunun renkleri (açık ve koyu temada aynı; üstlerindeki yazılar sabit koyu renktir). */
const GRI = '#c49a92';
const BEYAZ = '#f4eee4';
const KENAR = '#a87b73';
const YAZI_KOYU = '#2b3446';
const TALAMUS = '#4f7cf0';
const PUTAMEN = '#f28a52';
const KARINCIK = '#f2b544';
const SOLUK = '#e2d5c7';
const ON_ARKA = '#d9475f';
const UST_ALT = '#1f9e89';

/* ---------- Soldan görünüş (yerel koordinat, merkez 0,0; ön taraf eksi x) ---------- */

const BUYUK_BEYIN =
  'M-100,0 C-104,-46 -66,-82 -10,-84 C46,-86 92,-66 104,-26 C110,-4 102,14 84,20 C56,28 14,40 -24,42 C-44,42 -58,36 -58,26 C-58,18 -52,12 -44,10 C-64,14 -92,16 -100,0 Z';
const BEYIN_SAPI = 'M2,34 C-6,50 -5,64 4,74 L9,100 L27,100 L30,74 C36,62 36,46 30,32 Z';

const POZ = {
  dik: { x: 200, y: 146, a: 0 },
  yatik: { x: 205, y: 146, a: 90 },
};

const YAN_ETIKETLER: { ad: string; alt: string; hiza: 'start' | 'end'; dik: [number, number]; yatik: [number, number] }[] = [
  { ad: 'ön (anterior)', alt: 'alın tarafı', hiza: 'start', dik: [14, 118], yatik: [216, 28] },
  { ad: 'arka (posterior)', alt: 'ense tarafı', hiza: 'end', dik: [392, 108], yatik: [204, 252] },
  { ad: 'üst (superior)', alt: 'başa doğru', hiza: 'start', dik: [202, 34], yatik: [286, 112] },
  { ad: 'alt (inferior)', alt: 'ayaklara doğru', hiza: 'start', dik: [226, 246], yatik: [52, 184] },
];

/**
 * `dondu`: öbür duruştan bu duruşa geçildi; beyin dönerken yazılar gizlenir, dönüş bitince yeni yerlerinde belirir
 * (dönerken beynin üstünden geçmesinler diye).
 */
function YanGorunus({ yatik, azalt, dondu }: { yatik: boolean; azalt: boolean; dondu: boolean }) {
  const p = yatik ? POZ.yatik : POZ.dik;
  const gecis = azalt ? 'none' : 'transform 0.9s cubic-bezier(.2,.7,.2,1), opacity 0.6s ease';
  const belir = dondu && !azalt ? 'yc-belir 1.1s ease both' : 'none';
  return (
    <g>
      {/* Tavan ve yatak: yalnızca yatış görünümünde */}
      <g style={{ opacity: yatik ? 1 : 0, transition: gecis }} aria-hidden="true">
        <line x1="10" y1="6" x2="390" y2="6" stroke="var(--ink-3)" strokeWidth="1.2" strokeDasharray="5 5" />
        <text x="14" y="22" fontSize="11" fill="var(--ink-2)">
          tavan
        </text>
        <rect x="40" y="280" width="300" height="8" rx="4" fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth="1" />
        <text x="348" y="288" fontSize="11" fill="var(--ink-2)">
          yatak
        </text>
      </g>

      {/* Beyin ve oklar birlikte döner */}
      <g
        style={{
          transform: `translate(${p.x}px, ${p.y}px) rotate(${p.a}deg) scale(0.8)`,
          transition: gecis,
        }}
      >
        <path d={BEYIN_SAPI} fill="#ead6b8" stroke={KENAR} strokeWidth="1.5" />
        <ellipse cx="66" cy="42" rx="38" ry="20" fill="#dcb4aa" stroke={KENAR} strokeWidth="1.5" />
        <path
          d="M34,40 C54,30 82,30 100,38 M36,50 C56,42 82,42 100,48 M44,58 C60,52 80,52 94,56"
          fill="none"
          stroke={KENAR}
          strokeWidth="1"
          opacity="0.8"
        />
        <path d={BUYUK_BEYIN} fill="#ecc9bf" stroke={KENAR} strokeWidth="1.8" />
        {/* Yan oluk ve merkezî oluk (adsız, yalnızca beyni tanıtmak için) */}
        <path d="M-44,10 C-20,2 10,-10 36,-22" fill="none" stroke={KENAR} strokeWidth="2" strokeLinecap="round" />
        <path d="M6,-84 C0,-60 -8,-34 -16,-12" fill="none" stroke={KENAR} strokeWidth="1.6" strokeLinecap="round" />

        <Ok x1={-110} y1={0} x2={-152} y2={0} renk={ON_ARKA} kalin={4} />
        <Ok x1={112} y1={-10} x2={152} y2={-10} renk={ON_ARKA} kalin={4} />
        <Ok x1={-10} y1={-92} x2={-10} y2={-132} renk={UST_ALT} kalin={4} />
        <Ok x1={19} y1={106} x2={19} y2={140} renk={UST_ALT} kalin={4} />
      </g>

      {/* Yazılar dik kalır; her duruşta okların ucunun yanında durur */}
      <style>{'@keyframes yc-belir{0%,70%{opacity:0}100%{opacity:1}}'}</style>
      {YAN_ETIKETLER.map((e) => {
        const [x, y] = yatik ? e.yatik : e.dik;
        return (
          <g key={`${e.ad}-${yatik}`} transform={`translate(${x} ${y})`} style={{ animation: belir }}>
            <text x="0" y="0" textAnchor={e.hiza} fontSize="12.5" fontWeight="700" fill="var(--ink)">
              {e.ad}
            </text>
            <text x="0" y="14" textAnchor={e.hiza} fontSize="11" fill="var(--ink-2)">
              {e.alt}
            </text>
          </g>
        );
      })}

      <text x="200" y="304" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
        {yatik ? 'Soldan bakış: hasta sırtüstü yatıyor, başı ekranın sağında.' : 'Soldan bakış: ön taraf ekranın solunda, tepe yukarıda.'}
      </text>
    </g>
  );
}

/* ---------- Önden kesit ---------- */

type Nokta = [number, number];
type Parca = { c?: [number, number, number, number]; p: Nokta };

/** Ekranın sağındaki yarımkürenin (hastanın sol yarımküresi) dış çizgisi; öbür yarı aynadır. */
const BAS: Nokta = [200, 101];
const YARI: Parca[] = [
  { c: [201, 101, 202, 99], p: [202, 96] },
  { p: [203, 54] },
  { c: [205, 44, 220, 38], p: [240, 38] },
  { c: [282, 38, 318, 58], p: [328, 92] },
  { c: [336, 114, 334, 134], p: [328, 146] },
  { p: [304, 156] },
  { p: [326, 167] },
  { c: [338, 186, 330, 214], p: [306, 222] },
  { c: [290, 228, 270, 224], p: [262, 212] },
  { c: [256, 204, 248, 200], p: [236, 202] },
  { c: [222, 204, 210, 210], p: [200, 212] },
];

const ax = (x: number, ayna: boolean) => (ayna ? 400 - x : x);

function ileri(parcalar: Parca[], ayna: boolean): string {
  let s = `M${ax(BAS[0], ayna)},${BAS[1]}`;
  for (const g of parcalar) {
    s += g.c
      ? ` C${ax(g.c[0], ayna)},${g.c[1]} ${ax(g.c[2], ayna)},${g.c[3]} ${ax(g.p[0], ayna)},${g.p[1]}`
      : ` L${ax(g.p[0], ayna)},${g.p[1]}`;
  }
  return s;
}

function geri(parcalar: Parca[], ayna: boolean): string {
  let s = '';
  for (let i = parcalar.length - 1; i >= 0; i--) {
    const g = parcalar[i];
    const once = i === 0 ? BAS : parcalar[i - 1].p;
    s += g.c
      ? ` C${ax(g.c[2], ayna)},${g.c[3]} ${ax(g.c[0], ayna)},${g.c[1]} ${ax(once[0], ayna)},${once[1]}`
      : ` L${ax(once[0], ayna)},${once[1]}`;
  }
  return s;
}

const KESIT = `${ileri(YARI, false)}${geri(YARI, true)} Z`;
/** Kabuk şeridi: tabandaki orta parça (ara beyin) dışarıda bırakılır. */
const KABUK = [ileri(YARI.slice(0, 10), false), ileri(YARI.slice(0, 10), true)];
/** Oluklar (yüzeyden içe kısa çizgiler), ekranın sağındaki yarı için. */
const OLUKLAR: [number, number, number, number][] = [
  [252, 34, 253, 54],
  [298, 48, 289, 63],
  [336, 123, 320, 124],
  [334, 192, 318, 190],
  [200, 74, 214, 75],
];

function OndenKesit({ g }: { g: Exclude<Gorunum, 'ust-on' | 'yatis'> }) {
  const renkli = g !== 'taraf';
  const talamus = renkli ? TALAMUS : SOLUK;
  const putamen = renkli ? PUTAMEN : SOLUK;
  const karincik = g === 'ic-dis' ? KARINCIK : '#cfe0ea';
  return (
    <g>
      <defs>
        <clipPath id="yc-kesit">
          <path d={KESIT} />
        </clipPath>
      </defs>
      <path d={KESIT} fill={BEYAZ} />
      <g clipPath="url(#yc-kesit)">
        {KABUK.map((d) => (
          <path key={d} d={d} fill="none" stroke={GRI} strokeWidth="14" strokeLinejoin="round" />
        ))}
        {OLUKLAR.flatMap(([x1, y1, x2, y2]) => [
          <line key={`s${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GRI} strokeWidth="3.5" strokeLinecap="round" />,
          <line key={`l${x1}${y1}`} x1={400 - x1} y1={y1} x2={400 - x2} y2={y2} stroke={GRI} strokeWidth="3.5" strokeLinecap="round" />,
        ])}
        {g === 'taraf' && (
          <>
            <rect x="200" y="0" width="200" height="300" fill="#e0a32e" opacity="0.32" />
            <rect x="0" y="0" width="200" height="300" fill="#25a993" opacity="0.26" />
          </>
        )}
      </g>
      <path d={KESIT} fill="none" stroke={KENAR} strokeWidth="1.3" />

      {/* Derin yapılar: talamuslar, aralarında üçüncü karıncık, dış yanda putamenler */}
      <rect x="197.5" y="124" width="5" height="76" rx="2.5" fill={karincik} stroke={KENAR} strokeWidth="0.8" />
      {[false, true].map((ayna) => (
        <g key={String(ayna)}>
          <ellipse cx={ax(222, ayna)} cy="148" rx="19" ry="21" fill={talamus} stroke={KENAR} strokeWidth="0.8" />
          <ellipse cx={ax(279, ayna)} cy="150" rx="11" ry="25" fill={putamen} stroke={KENAR} strokeWidth="0.8" />
        </g>
      ))}

      {/* Taraf yazıları */}
      <text x="12" y="142" fontSize="11" fill="var(--ink-2)">
        hastanın
      </text>
      <text x="12" y="156" fontSize="11" fontWeight="700" fill="var(--ink)">
        sağı
      </text>
      <text x="388" y="142" textAnchor="end" fontSize="11" fill="var(--ink-2)">
        hastanın
      </text>
      <text x="388" y="156" textAnchor="end" fontSize="11" fontWeight="700" fill="var(--ink)">
        solu
      </text>

      {(g === 'ic-dis' || g === 'taraf') && (
        <g>
          {/* Beynin dışında temanın yazı rengi, içinde sabit koyu renk (açık zeminde görünsün diye) */}
          <line x1="200" y1="26" x2="200" y2="228" stroke="var(--ink)" strokeWidth="1.3" strokeDasharray="5 4" />
          <line x1="200" y1="26" x2="200" y2="228" stroke={YAZI_KOYU} strokeWidth="1.3" strokeDasharray="5 4" clipPath="url(#yc-kesit)" />
          <text x="200" y="18" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            orta hat
          </text>
        </g>
      )}

      {g === 'ic-dis' && (
        <g>
          {[false, true].map((ayna) => (
            <g key={String(ayna)}>
              <circle cx={ax(266, ayna)} cy="110" r="3.5" fill={YAZI_KOYU} />
              <Ok x1={ax(260, ayna)} y1={110} x2={ax(211, ayna)} y2={110} renk={TALAMUS} />
              <Ok x1={ax(272, ayna)} y1={110} x2={ax(320, ayna)} y2={110} renk={PUTAMEN} />
              <text x={ax(236, ayna)} y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill={YAZI_KOYU}>
                iç yan
              </text>
              <text x={ax(296, ayna)} y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill={YAZI_KOYU}>
                dış yan
              </text>
            </g>
          ))}
          {/* Yapı adları */}
          <path d="M199,198 L166,236" stroke="var(--ink-3)" strokeWidth="1" fill="none" />
          <path d="M226,166 L238,236" stroke="var(--ink-3)" strokeWidth="1" fill="none" />
          <path d="M282,174 L300,236" stroke="var(--ink-3)" strokeWidth="1" fill="none" />
          <text x="150" y="250" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            üçüncü karıncık
          </text>
          <text x="150" y="264" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
            tam orta hatta
          </text>
          <text x="240" y="250" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            talamus
          </text>
          <text x="240" y="264" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
            iç yanda
          </text>
          <text x="306" y="250" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            putamen
          </text>
          <text x="306" y="264" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
            dış yanda
          </text>
        </g>
      )}

      {g === 'yuzey-derin' && (
        <g>
          <Ok x1={226} y1={8} x2={226} y2={122} renk="var(--ink)" kalin={2.5} />
          <g clipPath="url(#yc-kesit)">
            <Ok x1={226} y1={8} x2={226} y2={122} renk={YAZI_KOYU} kalin={2.5} />
          </g>
          <text x="234" y="20" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            derine doğru
          </text>
          <path d="M62,46 L90,66" stroke="var(--ink-3)" strokeWidth="1" fill="none" />
          <text x="12" y="40" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            kabuk: yüzeysel
          </text>
          <path d="M226,168 L262,234 M282,175 L270,234" stroke="var(--ink-3)" strokeWidth="1" fill="none" />
          <text x="266" y="248" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            kabuk altı çekirdekler
          </text>
          <text x="266" y="262" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
            derinde
          </text>
          <rect x="24" y="238" width="14" height="10" rx="2" fill={GRI} />
          <text x="44" y="247" fontSize="11" fill="var(--ink-2)">
            gri cevher
          </text>
          <rect x="24" y="256" width="14" height="10" rx="2" fill={BEYAZ} stroke={KENAR} strokeWidth="0.8" />
          <text x="44" y="265" fontSize="11" fill="var(--ink-2)">
            beyaz cevher
          </text>
        </g>
      )}

      {g === 'taraf' && (
        <g>
          <circle cx="266" cy="92" r="7" fill="#d6334f" stroke="#fff" strokeWidth="2" />
          <text x="278" y="96" fontSize="11" fontWeight="700" fill={YAZI_KOYU}>
            nokta
          </text>
          <rect x="262" y="240" width="14" height="10" rx="2" fill="#e0a32e" />
          <text x="282" y="249" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            aynı taraf
          </text>
          <rect x="94" y="240" width="14" height="10" rx="2" fill="#25a993" />
          <text x="114" y="249" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            karşı taraf
          </text>
        </g>
      )}

      <text x="200" y="304" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
        Önden bakış: hastanın sağı ekranın solunda.
      </text>
    </g>
  );
}

export function YonCiftleri() {
  const [g, setG] = useState<Gorunum>('ust-on');
  const [onceki, setOnceki] = useState<Gorunum | null>(null);
  const degis = (yeni: Gorunum) => {
    setOnceki(g);
    setG(yeni);
  };
  const azalt = useHareketAzaltilmis();
  const b = BILGI[g];
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Yön çifti"
        deger={g}
        onDegis={degis}
        secenekler={[
          { d: 'ust-on', ad: 'Üst–alt, ön–arka' },
          { d: 'yatis', ad: 'Sırtüstü yatınca' },
          { d: 'ic-dis', ad: 'İç yan–dış yan' },
          { d: 'yuzey-derin', ad: 'Yüzeysel–derin' },
          { d: 'taraf', ad: 'Aynı taraf–karşı taraf' },
        ]}
      />
      <svg viewBox="0 0 400 312" className="mx-auto w-full max-w-2xl" role="img" aria-label={b.aria}>
        {g === 'ust-on' || g === 'yatis' ? (
          <YanGorunus
            yatik={g === 'yatis'}
            azalt={azalt}
            dondu={(g === 'yatis' && onceki === 'ust-on') || (g === 'ust-on' && onceki === 'yatis')}
          />
        ) : (
          <OndenKesit g={g} />
        )}
      </svg>
      <p className="t-small text-ink-3">Şema; oranlar yaklaşıktır.</p>
      <div aria-live="polite">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
