'use client';

import { useId, useState } from 'react';
import { Secenekler } from './ortak';

/**
 * AC–PC çizgisi, dört tanımı ve Talairach'ın orantılı ızgarası. Orta hattan (median sagital) kesit; sol yarıma
 * içeriden bakış: ön taraf sağda, tepe yukarıda (bölümdeki üç boyutlu sahneyle aynı bakış). Şema AC–PC'ye hizalıdır.
 * - "AC–PC çizgisi": ön komissür (AC) ve arka komissür (PC) orta hattadır (Conti ve ark., 2023); Talairach uzayında
 *   başlangıç (0, 0, 0) AC'dir (BIDS, t.y.); +y ön, +z üst (Selvaraj ve ark., 2026). Uzunluk: Schaltenbrand'ın
 *   ortalaması 24 mm (Selvaraj ve ark., 2026), tek kadavrada 22 mm (Park ve ark., 2010), 101 Parkinson hastasında
 *   ortalama 24,33 mm, aralık 19,90–28,60 mm (Hasimoglu ve ark., 2025).
 * - "Dört tanım": Talairach (AC'nin üst kenarı → PC'nin alt kenarı; başlangıç, AC'nin arka kenarından inen dikeyle
 *   kesişim), Schaltenbrand (merkez → merkez; başlangıç MCP), klinik (AC'nin arka kenarı → PC'nin ön kenarı; hedefler
 *   MCP'ye göre), MNI (açık bir AC–PC tanımı gerekmez; başlangıç özgün Talairach başlangıcının 3,5 mm üstü)
 *   (Selvaraj ve ark., 2026; Conti ve ark., 2023; Hasimoglu ve ark., 2025). VCA, AC'nin arka kenarından geçer
 *   (Conti ve ark., 2023). Komissürler nokta değil, üç boyutlu lif demetleridir (Esen Aydin ve ark., 2026); ortalama
 *   çap AC 3 mm, PC 2 mm (Schaltenbrand; Selvaraj ve ark., 2026); AC sagital kesitte ovaldir, dikey uzun çapı ~5 mm
 *   (Gray, 1918). Tanım farkı kabukta 11 mm'ye varan yer kayması doğurabilir (Conti ve ark., 2023). MNI başlangıcı
 *   Selvaraj ve ark. (2026) tanımıyla çizildi; Rorden (t.y.-b) SPM'de merkezi AC'nin merkezi olarak anlatır (bölümdeki
 *   "MNI ile Talairach arasındaki fark ne kadar?" kutusu).
 * - "Orantılı ızgara": dik düzlemler orta hat, komissürler arası düzlem ve AC ile PC'den geçen iki dikey düzlem; boyca
 *   her yarımkürede 9 bölme (AC'den ön kutba uzaklığın dörtte biri, üçe bölünen AC–PC uzaklığı, PC'den arka kutba
 *   uzaklığın dörtte biri); yükseklikte 12 ve enine 4 bölme kabuğun genel boyutuna göredir ve bölümde dağılımı
 *   anlatılmadığı için çizilmedi; dönüşüm AC, PC ve altı kabuk ucuna dayanır (Conti ve ark., 2023). Harf sırası
 *   (A önde, I arkada) bölümdeki "Boy (ön–arka; A–I)" satırına ve Conti ve ark. (2023) Şekil 5 açıklamasına (ön köşe
 *   A-d-1) göredir.
 * Beyin çizgileri şemadır; oranlar yaklaşıktır. Yakın görünümde AC ile PC arası kısaltıldı (≈); pencerelerin içinde iki
 * eksen aynı ölçektedir.
 */

type Gorunum = 'cizgi' | 'tanimlar' | 'izgara';
type N = [number, number];

const BILGI: Record<Gorunum, { baslik: string; metin: string; aria: string }> = {
  cizgi: {
    baslik: 'AC–PC çizgisi',
    metin:
      'Ön komissür (AC) ile arka komissür (PC), orta hatta duran küçük lif demetleridir. İkisini birleştiren çizgiye AC–PC çizgisi denir. Talairach uzayında başlangıç noktası (0, 0, 0) AC’dir; buradan y öne, z yukarı doğru büyür. Çizginin uzunluğu kişiden kişiye değişir.',
    aria: 'Orta hattan beyin kesiti: ön ve arka komissür, aralarındaki AC–PC çizgisi, başlangıç noktası ve y ile z eksenleri',
  },
  tanimlar: {
    baslik: 'Bir çizgi, dört tanım',
    metin:
      'Komissürler nokta değil, kalınlığı olan lif demetleridir (sarı ovallerdeki noktalar iki yana giden lifleri gösterir). Bu yüzden her tanım çizgiyi başka bir kenardan geçirir ve başlangıcı başka bir yere koyar. VCA, AC’nin arka kenarından geçen dikey çizgidir. AC’nin ortalama çapı 3 mm’dir (Schaltenbrand); Gray uzun çapını yaklaşık 5 mm verir. Tanım farkı, kabukta 11 mm’ye varan yer kaymasına yol açabilir. MNI başlangıcı Selvaraj ve arkadaşlarına göre çizildi. Rorden’in SPM yazılımı için verdiği tarif (AC’nin merkezi) bununla tam örtüşmez.',
    aria: 'Ön ve arka komissür yakından: AC–PC çizgisinin dört tanımı ve başlangıç noktaları',
  },
  izgara: {
    baslik: 'Talairach’ın orantılı ızgarası',
    metin:
      'Izgara, AC–PC çizgisine ve AC ile PC’den geçen iki dikey düzleme dayanır. Kutunun kenarları kabuğun en ön, en arka, en üst ve en alt noktalarına (halkalar) dokunur. Her kutu sabit bir uzaklık değil, beynin sabit bir oranıdır: büyük beyinde gerilir, küçük beyinde büzülür. Yükseklikte 12 bölme vardır: çizginin üstünde 8, altında 4. Enine her yarımkürede 4 bölme vardır. Bunlar bu şemada çizilmedi.',
    aria: 'Talairach’ın orantılı ızgarası: AC–PC çizgisi, AC ve PC’den geçen iki dikey çizgi ve boyca dokuz bölme',
  },
};

/* ---------- Ortak çizim yardımcıları ---------- */

const f = (n: number) => Math.round(n * 10) / 10;

function bezier(p0: N, p1: N, p2: N, p3: N, t: number): N {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/** Kapalı Catmull–Rom eğrisini kübik Bézier yoluna çevirir; uç noktaları bulmak için örnekleri de verir (mm). */
function egri(noktalar: N[], ekran: (p: N) => N): { d: string; ornek: N[] } {
  const n = noktalar.length;
  const al = (i: number) => noktalar[(i + n) % n];
  const [x0, y0] = ekran(noktalar[0]);
  let d = `M${f(x0)},${f(y0)}`;
  const ornek: N[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = al(i - 1);
    const p1 = al(i);
    const p2 = al(i + 1);
    const p3 = al(i + 2);
    const c1: N = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: N = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const [a, b] = ekran(c1);
    const [c, e] = ekran(c2);
    const [g, h] = ekran(p2);
    d += ` C${f(a)},${f(b)} ${f(c)},${f(e)} ${f(g)},${f(h)}`;
    for (let k = 0; k < 16; k++) ornek.push(bezier(p1, c1, c2, p2, k / 16));
  }
  return { d: `${d} Z`, ornek };
}

function Ok({ x1, y1, x2, y2, renk }: { x1: number; y1: number; x2: number; y2: number; renk: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const u1 = [x2 - 8 * Math.cos(a - 0.45), y2 - 8 * Math.sin(a - 0.45)];
  const u2 = [x2 - 8 * Math.cos(a + 0.45), y2 - 8 * Math.sin(a + 0.45)];
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 5 * Math.cos(a)} y2={y2 - 5 * Math.sin(a)} stroke={renk} strokeWidth="2.6" strokeLinecap="round" />
      <path d={`M${f(x2)},${f(y2)} L${f(u1[0])},${f(u1[1])} L${f(u2[0])},${f(u2[1])} Z`} fill={renk} />
    </g>
  );
}

function Arti({ x, y, renk, r = 5 }: { x: number; y: number; renk: string; r?: number }) {
  return (
    <g stroke={renk} strokeWidth="2" strokeLinecap="round">
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x} y1={y - r} x2={x} y2={y + r} />
      <circle cx={x} cy={y} r={r * 0.55} fill="var(--surface)" strokeWidth="1.6" />
    </g>
  );
}

/** Alt kısımdaki üçlü bilgi kartları. */
function Kartlar({ y, kartlar }: { y: number; kartlar: { deger: string; satirlar: string[] }[] }) {
  const w = 122;
  const bosluk = 7;
  const x0 = (400 - (3 * w + 2 * bosluk)) / 2;
  return (
    <g>
      {kartlar.map((k, i) => {
        const x = x0 + i * (w + bosluk);
        return (
          <g key={k.deger + i} transform={`translate(${x} ${y})`}>
            <rect width={w} height="50" rx="9" fill="var(--surface-2)" />
            <text x={w / 2} y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ink)">
              {k.deger}
            </text>
            {k.satirlar.map((s, j) => (
              <text key={s} x={w / 2} y={30 + j * 12.5} textAnchor="middle" fontSize="10.5" fill="var(--ink-2)">
                {s}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}

/* ---------- Bütün beyin (ilk ve üçüncü görünüm) ---------- */

// Koordinatlar mm; y öne (ekranda sağa), z yukarı. AC'nin merkezi (0, 0), PC'nin merkezi (−24, 0).
const S = 1.55;
const OX = 226;
const OY = 156;
const G = (p: N): N => [OX + p[0] * S, OY - p[1] * S];

// Yarımkürenin dış çizgisi (içeriden bakışta da aynı siluet); alt kenarda şakak lobu.
const BEYIN_N: N[] = [
  [66, 4],
  [68, 19],
  [62, 39],
  [48, 57],
  [27, 70],
  [0, 76],
  [-30, 74],
  [-58, 63],
  [-80, 46],
  [-94, 28],
  [-102, 13],
  [-99, 1],
  [-92, -12],
  [-76, -18],
  [-58, -23],
  [-41, -32],
  [-24, -40],
  [-6, -41],
  [9, -37],
  [19, -30],
  [24, -23],
  [31, -18],
  [44, -15],
  [57, -9],
];
// Nasırlı cisim (korpus kallozum): dış kenar önden arkaya, iç kenar arkadan öne.
const KALLOZUM_N: N[] = [
  [9, 5],
  [19, 2],
  [29, 5],
  [34, 12],
  [30, 20],
  [14, 25],
  [-10, 26.5],
  [-29, 24],
  [-40, 18],
  [-44, 11],
  [-40, 4],
  [-32, 6],
  [-25, 15],
  [-12, 18.5],
  [6, 18.5],
  [19, 15],
  [23, 10],
  [18, 6.5],
];
const BEYIN_SAPI_N: N[] = [
  [-9, -11],
  [-10, -17],
  [-7, -23],
  [-5, -31],
  [-9, -40],
  [-16, -45],
  [-20, -53],
  [-23, -62],
  [-35, -62],
  [-36, -52],
  [-39, -42],
  [-39, -30],
  [-38, -20],
  [-37, -12],
  [-33, -5],
  [-27, -2.5],
  [-19, -6],
];
const BEYINCIK_N: N[] = [
  [-40, -17],
  [-52, -12],
  [-68, -14],
  [-82, -22],
  [-90, -34],
  [-86, -47],
  [-72, -56],
  [-55, -57],
  [-44, -51],
  [-41, -42],
  [-41, -32],
  [-39, -24],
];

const TALAMUS = { m: [-17, 7.8] as N, ry: 15, rz: 6.6 };

const BEYIN = egri(BEYIN_N, G);
const KALLOZUM = egri(KALLOZUM_N, G);
const BEYIN_SAPI = egri(BEYIN_SAPI_N, G);
const BEYINCIK = egri(BEYINCIK_N, G);

// Kabuğun uç noktaları (Talairach kutusunun kenarları bunlara dokunur).
const enBuyuk = (sec: (p: N) => number) => BEYIN.ornek.reduce((a, b) => (sec(b) > sec(a) ? b : a));
const EN_ON = enBuyuk((p) => p[0]);
const EN_ARKA = enBuyuk((p) => -p[0]);
const EN_UST = enBuyuk((p) => p[1]);
const EN_ALT = enBuyuk((p) => -p[1]);

// Genel görünümde komissürler (görünsün diye biraz büyütüldü).
const AC_G = { y: 0, z: 0, ry: 2, rz: 2.7 };
const PC_G = { y: -24, z: 0, ry: 1.6, rz: 1.5 };

// Izgara: VCA AC'nin arka kenarından, öteki dikey PC'den geçer.
const Y_VCA = AC_G.y - AC_G.ry;
const Y_VPC = PC_G.y;
const IZGARA_Y: number[] = [
  ...[0, 1, 2, 3, 4].map((i) => EN_ARKA[0] + ((Y_VPC - EN_ARKA[0]) * i) / 4),
  ...[1, 2, 3].map((i) => Y_VPC + ((Y_VCA - Y_VPC) * i) / 3),
  ...[1, 2, 3, 4].map((i) => Y_VCA + ((EN_ON[0] - Y_VCA) * i) / 4),
];
// Ana bölmelerin sınırları (arkadan öne): arka kutup, 3 ara, VPC, VCA, 3 ara, ön kutup.
const ANA_SINIR = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11].map((i) => IZGARA_Y[i]);
const HARFLER = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

function BeyinCizimi({ ic, soluk }: { ic: boolean; soluk: boolean }) {
  const cizgi = soluk ? '3 3' : undefined;
  const [tx, ty] = G(TALAMUS.m);
  return (
    <g>
      <path d={BEYIN.d} fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth="1.4" />
      {[BEYINCIK, BEYIN_SAPI].map((y) => (
        <g key={y.d}>
          {!soluk && <path d={y.d} fill="var(--surface)" />}
          <path d={y.d} fill="#9aa6bd" fillOpacity={soluk ? 0.12 : 0.4} stroke="var(--ink-3)" strokeWidth="1.1" strokeDasharray={cizgi} />
        </g>
      ))}
      {ic && (
        <g opacity={soluk ? 0.45 : 1}>
          <path d={KALLOZUM.d} fill="#9aa6bd" fillOpacity="0.55" stroke="var(--ink-3)" strokeWidth="1.1" />
          <ellipse
            cx={tx}
            cy={ty}
            rx={TALAMUS.ry * S}
            ry={TALAMUS.rz * S}
            fill="#ee6a92"
            fillOpacity="0.32"
            stroke="#d24f7a"
            strokeWidth="1.1"
          />
        </g>
      )}
    </g>
  );
}

function Komissurler() {
  const [ax, ay] = G([AC_G.y, AC_G.z]);
  const [px, py] = G([PC_G.y, PC_G.z]);
  return (
    <g fill="#f2b544" stroke="#a8750f" strokeWidth="1.2">
      <ellipse cx={ax} cy={ay} rx={AC_G.ry * S} ry={AC_G.rz * S} />
      <ellipse cx={px} cy={py} rx={PC_G.ry * S} ry={PC_G.rz * S} />
    </g>
  );
}

function CizgiGorunumu() {
  const [ax, ay] = G([0, 0]);
  const [px, py] = G([-24, 0]);
  const [tx, ty] = G(TALAMUS.m);
  const [kx, ky] = G([-48, 30]);
  const [bx, by] = G([-66, -36]);
  const [sx, sy] = G([-23, -62]);
  const Y = '#25a993';
  const Z = '#5b84f2';
  return (
    <g>
      <BeyinCizimi ic soluk={false} />
      <text x={tx} y={ty + 3.5} textAnchor="middle" fontSize="10.5" fill="var(--ink)">
        talamus
      </text>
      <text x={kx} y={ky} textAnchor="middle" fontSize="10.5" fill="var(--ink-2)">
        korpus kallozum
      </text>
      <text x={bx} y={by + 3.5} textAnchor="middle" fontSize="10.5" fill="var(--ink)">
        beyincik
      </text>
      <text x={sx + 8} y={sy + 2} fontSize="10.5" fill="var(--ink-2)">
        beyin sapı
      </text>
      {/* AC–PC çizgisi */}
      <line x1={px} y1={py} x2={ax} y2={ay} stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
      <Komissurler />
      {/* Eksenler: başlangıç AC */}
      <Ok x1={ax + AC_G.ry * S + 1} y1={ay} x2={ax + 34 * S} y2={ay} renk={Y} />
      <Ok x1={ax} y1={ay - AC_G.rz * S - 1} x2={ax} y2={ay - 44 * S} renk={Z} />
      <text x={ax + 34 * S + 4} y={ay + 4} fontSize="11" fontWeight="700" fill={Y}>
        +y ön
      </text>
      <text x={ax + 6} y={ay - 44 * S + 4} fontSize="11" fontWeight="700" fill={Z}>
        +z üst
      </text>
      <text x={ax + 8} y={ay + 17} fontSize="11" fontWeight="700" fill="var(--ink)">
        AC (0, 0, 0)
      </text>
      <text x={px - 12} y={py + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--ink)">
        PC
      </text>
      <text x="200" y="268" textAnchor="middle" fontSize="10.5" fill="var(--ink-2)">
        AC–PC uzunluğu kişiden kişiye değişir:
      </text>
      <Kartlar
        y={274}
        kartlar={[
          { deger: '24 mm', satirlar: ['Schaltenbrand’ın', 'ortalaması'] },
          { deger: '22 mm', satirlar: ['tek bir kadavra', 'başında'] },
          { deger: '24,33 mm', satirlar: ['101 Parkinson hastası;', '19,90–28,60 mm arası'] },
        ]}
      />
    </g>
  );
}

function IzgaraGorunumu() {
  const [xArka] = G([EN_ARKA[0], 0]);
  const [xOn] = G([EN_ON[0], 0]);
  const [, yUst] = G([0, EN_UST[1]]);
  const [, yAlt] = G([0, EN_ALT[1]]);
  const [, y0] = G([0, 0]);
  const xs = IZGARA_Y.map((y) => G([y, 0])[0]);
  const ana = ANA_SINIR.map((y) => G([y, 0])[0]);
  const [xVca] = G([Y_VCA, 0]);
  const [xVpc] = G([Y_VPC, 0]);
  return (
    <g>
      <BeyinCizimi ic soluk />
      {/* İnce bölmeler (AC–PC arası üçe) ve ana bölmeler */}
      {xs.map((x, i) =>
        ANA_SINIR.includes(IZGARA_Y[i]) ? null : (
          <line key={`i${i}`} x1={x} y1={yUst} x2={x} y2={yAlt} stroke="var(--ink-3)" strokeWidth="0.8" strokeDasharray="2 3" />
        ),
      )}
      {ana.map((x, i) => (
        <line key={`a${i}`} x1={x} y1={yUst} x2={x} y2={yAlt} stroke="var(--ink-3)" strokeWidth="1" />
      ))}
      <rect x={xArka} y={yUst} width={xOn - xArka} height={yAlt - yUst} fill="none" stroke="var(--ink-2)" strokeWidth="1.6" />
      {/* AC ve PC'den geçen dikeyler, komissürler arası çizgi */}
      <line x1={xVca} y1={yUst} x2={xVca} y2={yAlt} stroke="var(--ink)" strokeWidth="1.8" strokeDasharray="6 3" />
      <line x1={xVpc} y1={yUst} x2={xVpc} y2={yAlt} stroke="var(--ink)" strokeWidth="1.8" strokeDasharray="6 3" />
      <line x1={xArka} y1={y0} x2={xOn} y2={y0} stroke="var(--ink)" strokeWidth="2.2" />
      <Komissurler />
      {/* Kabuğun uç noktaları */}
      {[EN_ON, EN_ARKA, EN_UST, EN_ALT].map((p) => {
        const [x, y] = G(p);
        return <circle key={`${p[0]},${p[1]}`} cx={x} cy={y} r="3.6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.6" />;
      })}
      {HARFLER.map((h, i) => (
        <text key={h} x={(ana[i] + ana[i + 1]) / 2} y={yUst - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
          {h}
        </text>
      ))}
      <text x={xVca + 4} y={yUst + 16} fontSize="10.5" fontWeight="700" fill="var(--ink)">
        AC
      </text>
      <text x={xVpc - 4} y={yUst + 16} textAnchor="end" fontSize="10.5" fontWeight="700" fill="var(--ink)">
        PC
      </text>
      <text x={xArka - 4} y={y0 + 4} textAnchor="end" fontSize="10.5" fill="var(--ink-2)">
        AC–PC
      </text>
      <text x="200" y="268" textAnchor="middle" fontSize="10.5" fill="var(--ink-2)">
        Boyca her yarımkürede 9 bölme (A–I):
      </text>
      <Kartlar
        y={274}
        kartlar={[
          { deger: 'Arkada 4', satirlar: ['PC → arka kutup', 'her biri ¼'] },
          { deger: 'Ortada 1', satirlar: ['AC ile PC arası', 'üçe bölünür'] },
          { deger: 'Önde 4', satirlar: ['AC → ön kutup', 'her biri ¼'] },
        ]}
      />
    </g>
  );
}

/* ---------- Yakından: dört tanım ---------- */

// Koordinatlar mm; başlangıç MCP (iki merkezin ortası); merkezden merkeze çizgi yatay. Komissürler büyütülsün diye
// ön–arka eksen üç pencereye bölündü (PC, MCP, AC); aradaki uzaklık kısaltıldı (≈ işaretleri). Pencerelerin içinde
// iki eksen de aynı ölçektedir.
const ZS = 14;
const ZY = 118;
const BOSLUK = 30;
const PENCERE: [number, number][] = [
  [-14.4, -9.6],
  [-1.5, 1.5],
  [8.9, 14.2],
];
const PENCERE_X: number[] = [36];
for (let i = 1; i < PENCERE.length; i++) {
  PENCERE_X.push(PENCERE_X[i - 1] + (PENCERE[i - 1][1] - PENCERE[i - 1][0]) * ZS + BOSLUK);
}
function zx(y: number): number {
  const i = PENCERE.findIndex(([a, b]) => y >= a - 1e-9 && y <= b + 1e-9);
  if (i < 0) return NaN;
  return PENCERE_X[i] + (y - PENCERE[i][0]) * ZS;
}
const Zp = (p: N): N => [zx(p[0]), ZY - p[1] * ZS];
/** Bir doğru parçasının pencerelerin içinde kalan parçaları (ekran koordinatı). */
function parcala(p: N, q: N): [N, N][] {
  const sonuc: [N, N][] = [];
  const ara = (y: number): N => {
    const t = (y - p[0]) / (q[0] - p[0]);
    return [y, p[1] + t * (q[1] - p[1])];
  };
  for (const [a, b] of PENCERE) {
    const lo = Math.max(Math.min(p[0], q[0]), a);
    const hi = Math.min(Math.max(p[0], q[0]), b);
    if (lo < hi) sonuc.push([Zp(ara(lo)), Zp(ara(hi))]);
  }
  return sonuc;
}
const AC_Z = { y: 12, z: 0, ry: 1.4, rz: 2.1 };
const PC_Z = { y: -12, z: 0, ry: 1.1, rz: 0.95 };

const RENK = { talairach: '#e5484d', schaltenbrand: '#1c9fd0', klinik: '#f08a24', mni: '#3fa34d' };

// Talairach: AC'nin üst kenarından PC'nin alt kenarına.
const T_UST: N = [AC_Z.y, AC_Z.rz];
const T_ALT: N = [PC_Z.y, -PC_Z.rz];
const EGIM = (T_UST[1] - T_ALT[1]) / (T_UST[0] - T_ALT[0]);
const DIK: N = [-EGIM / Math.hypot(1, EGIM), 1 / Math.hypot(1, EGIM)];
const AC_ARKA: N = [AC_Z.y - AC_Z.ry, 0];
const PC_ON: N = [PC_Z.y + PC_Z.ry, 0];
// Başlangıç: Talairach çizgisi ile AC'nin arka kenarından inen dikeyin (VCA) kesişimi.
const T_BASLANGIC: N = (() => {
  // T_UST + t·(1, EGIM) = AC_ARKA + s·DIK
  const a = 1;
  const b = -DIK[0];
  const c = EGIM;
  const d = -DIK[1];
  const e = AC_ARKA[0] - T_UST[0];
  const g = AC_ARKA[1] - T_UST[1];
  const t = (e * d - b * g) / (a * d - b * c);
  return [T_UST[0] + t, T_UST[1] + t * EGIM];
})();
// MNI: özgün Talairach başlangıcının 3,5 mm üstü (Selvaraj ve ark., 2026).
const M_BASLANGIC: N = [T_BASLANGIC[0] + 3.5 * DIK[0], T_BASLANGIC[1] + 3.5 * DIK[1]];

function Lifler({ id, cx, cy, rx, ry }: { id: string; cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#f2b544" stroke="#a8750f" strokeWidth="1.6" />
      <ellipse cx={cx} cy={cy} rx={rx - 1.5} ry={ry - 1.5} fill={`url(#${id})`} />
    </g>
  );
}

function Parcali({ p, q, renk, kalinlik, saydam }: { p: N; q: N; renk: string; kalinlik: number; saydam?: number }) {
  return (
    <g>
      {parcala(p, q).map(([a, b]) => (
        <line key={a[0]} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={renk} strokeWidth={kalinlik} strokeOpacity={saydam} />
      ))}
    </g>
  );
}

function TanimGorunumu({ uid }: { uid: string }) {
  const lif = `${uid}-lif`;
  const [ax, ay] = Zp([AC_Z.y, AC_Z.z]);
  const [px, py] = Zp([PC_Z.y, PC_Z.z]);
  const [mx, my] = Zp([0, 0]);
  const tu = Zp(T_UST);
  const ta = Zp(T_ALT);
  const aa = Zp(AC_ARKA);
  const po = Zp(PC_ON);
  const tb = Zp(T_BASLANGIC);
  const mb = Zp(M_BASLANGIC);
  const vcaAlt = Zp([AC_ARKA[0] - 3 * DIK[0], AC_ARKA[1] - 3 * DIK[1]]);
  const vcaUst = Zp([M_BASLANGIC[0] + 0.7 * DIK[0], M_BASLANGIC[1] + 0.7 * DIK[1]]);
  const kirik = PENCERE.slice(1).map((_, i) => PENCERE_X[i] + (PENCERE[i][1] - PENCERE[i][0]) * ZS + BOSLUK / 2);
  const tanimlar: { renk: string; ad: string; cizgi: string; bas: string; ornek: 'cizgi' | 'serit' | 'arti' }[] = [
    {
      renk: RENK.talairach,
      ad: 'Talairach',
      cizgi: 'AC’nin üst kenarından PC’nin alt kenarına',
      bas: 'Başlangıç: bu çizgi ile VCA’nın kesiştiği nokta',
      ornek: 'cizgi',
    },
    {
      renk: RENK.schaltenbrand,
      ad: 'Schaltenbrand',
      cizgi: 'AC’nin merkezinden PC’nin merkezine',
      bas: 'Başlangıç: çizginin ortası (MCP)',
      ornek: 'cizgi',
    },
    {
      renk: RENK.klinik,
      ad: 'Klinik',
      cizgi: 'AC’nin arka kenarından PC’nin ön kenarına',
      bas: 'Hedefler MCP’ye göre (ör. subtalamik çekirdek)',
      ornek: 'serit',
    },
    {
      renk: RENK.mni,
      ad: 'MNI',
      cizgi: 'açık bir AC–PC tanımı gerekmez',
      bas: 'Başlangıç: özgün Talairach başlangıcının 3,5 mm üstü',
      ornek: 'arti',
    },
  ];
  return (
    <g>
      <defs>
        <pattern id={lif} width="5.2" height="5.2" patternUnits="userSpaceOnUse">
          <circle cx="2.6" cy="2.6" r="1.3" fill="#8a5d08" opacity="0.75" />
        </pattern>
      </defs>
      {/* Klinik: arka kenar → ön kenar (yarı saydam şerit) */}
      <Parcali p={PC_ON} q={AC_ARKA} renk={RENK.klinik} kalinlik={9} saydam={0.7} />
      <Lifler id={lif} cx={ax} cy={ay} rx={AC_Z.ry * ZS} ry={AC_Z.rz * ZS} />
      <Lifler id={lif} cx={px} cy={py} rx={PC_Z.ry * ZS} ry={PC_Z.rz * ZS} />
      {[po, aa].map(([x, y]) => (
        <line key={x} x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={RENK.klinik} strokeWidth="2.6" strokeLinecap="round" />
      ))}
      {/* Schaltenbrand: merkez → merkez */}
      <Parcali p={[PC_Z.y, 0]} q={[AC_Z.y, 0]} renk={RENK.schaltenbrand} kalinlik={2.2} />
      {[
        [px, py],
        [ax, ay],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill={RENK.schaltenbrand} stroke="var(--surface)" strokeWidth="1" />
      ))}
      {/* Talairach: teğet çizgi, VCA ve başlangıç */}
      <line x1={vcaAlt[0]} y1={vcaAlt[1]} x2={vcaUst[0]} y2={vcaUst[1]} stroke={RENK.talairach} strokeWidth="1.6" strokeDasharray="4 3" />
      <Parcali p={T_ALT} q={T_UST} renk={RENK.talairach} kalinlik={2.4} />
      {[ta, tu].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill={RENK.talairach} stroke="var(--surface)" strokeWidth="1" />
      ))}
      <circle cx={mx} cy={my} r="4.6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
      <Arti x={tb[0]} y={tb[1]} renk={RENK.talairach} r={6} />
      <Arti x={mb[0]} y={mb[1]} renk={RENK.mni} r={6} />
      {/* Kısaltılan aralıklar */}
      {kirik.map((x) => (
        <text key={x} x={x} y={ZY + 6} textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--ink-3)">
          ≈
        </text>
      ))}

      {/* Etiketler */}
      <text x="200" y="14" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
        Yakından: orta hattan kesit · ön sağda, tepe yukarıda
      </text>
      <text x={tb[0] - 12} y={tb[1] - 6} textAnchor="end" fontSize="11" fontWeight="700" fill={RENK.talairach}>
        Talairach (0, 0, 0)
      </text>
      <text x={mb[0] - 11} y={mb[1] + 4} textAnchor="end" fontSize="11" fontWeight="700" fill={RENK.mni}>
        MNI (0, 0, 0)
      </text>
      <text x={tb[0] + 9} y={(tb[1] + mb[1]) / 2 + 4} fontSize="10.5" fill="var(--ink-2)">
        3,5 mm
      </text>
      <text x={vcaAlt[0]} y={vcaAlt[1] + 13} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={RENK.talairach}>
        VCA
      </text>
      <text x={mx} y={my + 22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ink)">
        MCP
      </text>
      <text x={ax + AC_Z.ry * ZS + 8} y={ay - 4} fontSize="11" fontWeight="700" fill="var(--ink)">
        AC
      </text>
      <text x={ax + AC_Z.ry * ZS + 8} y={ay + 10} fontSize="10.5" fill="var(--ink-2)">
        ort. çap 3 mm
      </text>
      <text x={ax + AC_Z.ry * ZS + 8} y={ay + 23} fontSize="10.5" fill="var(--ink-2)">
        uzun çap ≈ 5 mm
      </text>
      <text x={px} y={py + PC_Z.rz * ZS + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
        PC
      </text>
      <text x={px} y={py + PC_Z.rz * ZS + 29} textAnchor="middle" fontSize="10.5" fill="var(--ink-2)">
        ort. çap 2 mm
      </text>
      <text x="200" y="190" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
        ≈ olan yerlerde AC ile PC arası kısaltıldı.
      </text>

      {/* Renk anahtarı */}
      {tanimlar.map((t, i) => {
        const y = 207 + i * 31;
        return (
          <g key={t.ad}>
            {t.ornek === 'cizgi' && <line x1="14" y1={y} x2="40" y2={y} stroke={t.renk} strokeWidth="2.4" strokeLinecap="round" />}
            {t.ornek === 'serit' && <line x1="14" y1={y} x2="40" y2={y} stroke={t.renk} strokeWidth="9" strokeOpacity="0.7" />}
            {t.ornek === 'arti' && <Arti x={27} y={y} renk={t.renk} />}
            <text x="50" y={y + 4} fontSize="10.5" fill="var(--ink)">
              <tspan fontWeight="700" fill={t.renk}>
                {t.ad}:
              </tspan>{' '}
              {t.cizgi}
            </text>
            <text x="50" y={y + 17} fontSize="10.5" fill="var(--ink-2)">
              {t.bas}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function AcPcIzgarasi() {
  const [g, setG] = useState<Gorunum>('cizgi');
  const uid = `acpc-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const b = BILGI[g];
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={g}
        onDegis={setG}
        secenekler={[
          { d: 'cizgi', ad: 'AC–PC çizgisi' },
          { d: 'tanimlar', ad: 'Dört tanım' },
          { d: 'izgara', ad: 'Orantılı ızgara' },
        ]}
      />
      <svg viewBox="0 0 400 330" className="mx-auto w-full max-w-2xl" role="img" aria-label={b.aria}>
        {g === 'tanimlar' ? (
          <TanimGorunumu uid={uid} />
        ) : (
          <>
            <text x="200" y="13" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
              Sol yarıma orta hattan bakış: ön sağda, tepe yukarıda
            </text>
            {g === 'cizgi' ? <CizgiGorunumu /> : <IzgaraGorunumu />}
          </>
        )}
      </svg>
      <div aria-live="polite">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
        <p className="t-small text-ink-3">Şema; oranlar yaklaşıktır.</p>
      </div>
    </div>
  );
}
