'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Eksenler ve düzlemler arasındaki açılar. Beynin orta hattan (median sagital) kesitinin sade şeması üzerinde:
 * ön beynin ekseni (Forel ekseni; AC–PC çizgisi) ile beyin sapının uzun ekseni (Meynert ekseni) ve aradaki bükülme;
 * bu eksenlere dik kesitlerin adları (koronal, transvers); beyin sapı atlasının PMJ düzlemi ile AC–PC düzlemi
 * arasındaki açı; embriyodaki üç bükülme. Yalnızca bölüm metnindeki değerler kullanılır.
 * Kaynaklar: Henley (2021a; eksen orta beyin hizasında kabaca 90° bükülür); OpenStax 13.1 (bükülme beyin sapı ile ara
 * beyin arasında); Rusche ve ark. (2021) ve Grinberg ve ark. (2011; Forel ekseni, interkomissural eksen); Shi ve ark.
 * (2024; Meynert ekseni beyin sapının uzun eksenidir); Dafny (2020; eksene dik kesitlerin adları, arka komissür ara
 * beyin ile orta beynin sınırıdır); Coulombe ve ark. (2021; PMJ düzlemi, AC–PC ile ~10°, Paxinos ve ark. 2020 atlası ile
 * ~20° fark; Ding atlasını AC–PC'ye dik sayar); Mai ve Majtanik (2019; dört talamus atlasında 22°'ye kadar eğim);
 * Gray (1918; sefalik, servikal ve pontin bükülmeler).
 * Bakış yönü: sol yarıya orta hattan bakılır; ön taraf sağda (bölümdeki sahnelerle ve yön pusulasıyla aynı).
 * Eksenler arasındaki açı için yetişkinde ölçülmüş bir değer bulunamadı; şemadaki açılar yaklaşıktır.
 */

type Gorunum = 'eksenler' | 'kesitler' | 'atlaslar' | 'embriyo';

type Nokta = [number, number];

const ON_BEYIN = '#c9d6f8';
const ON_BEYIN_CIZGI = '#8ea6ea';
const KALLOZUM = '#eef2fc';
const BEYIN_SAPI = '#ddd3f6';
const BEYIN_SAPI_CIZGI = '#a99be8';
const BEYINCIK = '#f6dfae';
const BEYINCIK_CIZGI = '#d8aa52';
const KARINCIK = '#9fb6ef';
const OMURILIK = '#dfe3ea';
const ORTA_BEYIN = '#c8b8f2';

const FOREL = '#e8892b';
const MEYNERT = '#1a9bb5';
const KESIT = '#d9453d';
const PMJ = '#cf3f8c';
const KOMISSUR = '#f2b544';
const DORSAL = '#ef5d7b';
const VENTRAL = '#25a993';
const NOTOKORD = '#8a94a8';
/** Açık dolguların üstünde de koyu zeminde de görünen orta tonlar (ince çizgiler için). */
const ORTA_TON = '#64748b';
const KOYU_TON = '#475569';

/* ---------- Ortak çizim yardımcıları ---------- */

/** Koordinatları yuvarlar: sunucuda ve tarayıcıda çizilen sayılar aynı olsun. */
const yuvarla = (n: number) => Math.round(n * 100) / 100;

/** Noktalardan geçen yumuşak eğri (Catmull–Rom). */
function egri(n: Nokta[], kapali: boolean): string {
  const k = (i: number) => n[kapali ? (i + n.length) % n.length : Math.max(0, Math.min(n.length - 1, i))];
  let d = `M${n[0][0].toFixed(1)},${n[0][1].toFixed(1)}`;
  const son = kapali ? n.length : n.length - 1;
  for (let i = 0; i < son; i++) {
    const p0 = k(i - 1);
    const p1 = k(i);
    const p2 = k(i + 1);
    const p3 = k(i + 2);
    const c1: Nokta = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Nokta = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return kapali ? d + ' Z' : d;
}

/** Yazı kutucuğu: zemin rengi temaya göre değişir, yazı her temada okunur. Birden çok satır alabilir. */
function Etiket({
  x,
  y,
  metin,
  cizgi = 'var(--rule-strong)',
  kucuk = false,
}: {
  x: number;
  y: number;
  metin: string | string[];
  cizgi?: string;
  kucuk?: boolean;
}) {
  const satirlar = Array.isArray(metin) ? metin : [metin];
  const boy = kucuk ? 10.5 : 11;
  const g = Math.max(...satirlar.map((s) => s.length)) * (kucuk ? 5.8 : 6.1) + (kucuk ? 10 : 14);
  const h = satirlar.length * 13 + (kucuk ? 2 : 4);
  return (
    <g>
      <rect
        x={x - g / 2}
        y={y - h / 2}
        width={g}
        height={h}
        rx={Math.min(8.5, h / 2)}
        fill="var(--surface)"
        stroke={cizgi}
        strokeWidth="1.5"
      />
      {satirlar.map((s, i) => (
        <text
          key={s}
          x={x}
          y={y - ((satirlar.length - 1) * 13) / 2 + i * 13 + 4}
          textAnchor="middle"
          fontSize={boy}
          fontWeight="600"
          fill="var(--ink)"
        >
          {s}
        </text>
      ))}
    </g>
  );
}

function Kilavuz({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ORTA_TON} strokeWidth="1.1" />;
}

/* ---------- Yetişkin beyni: orta hattan kesit ---------- */

/*
 * Şemanın koordinatları milimetre gibi düşünülmüştür: y öne, z yukarı doğru büyür; başlangıç ön komissürdür (AC).
 * Arka komissür (PC) 24 birim arkadadır. Şema 4° döndürülür: AC, PC'nin biraz üstünde durur.
 */
const OLCEK = 1.7;
const AX = 203;
const AY = 150;
const DON = (4 * Math.PI) / 180;

function P(y: number, z: number): Nokta {
  const u = OLCEK * y;
  const v = -OLCEK * z;
  return [yuvarla(AX + u * Math.cos(DON) + v * Math.sin(DON)), yuvarla(AY - u * Math.sin(DON) + v * Math.cos(DON))];
}

const sekil = (n: Nokta[], kapali = true) =>
  egri(
    n.map(([y, z]) => P(y, z)),
    kapali,
  );

/** Büyük beyin (uç beyin ve ara beyin) iç yüzü. Alt kenarın ortası ara beyin ile orta beynin sınırıdır. */
const ON_BEYIN_SEKLI = sekil([
  [69, 4],
  [65, 28],
  [52, 50],
  [30, 66],
  [2, 74],
  [-28, 72],
  [-56, 61],
  [-80, 42],
  [-96, 21],
  [-102, 3],
  [-98, -6],
  [-84, -9.5],
  [-66, -8],
  [-52, -4],
  [-42, -1.5],
  [-32, -1.5],
  [-25, -1.8],
  [-18, -6],
  [-12, -11],
  [-5, -13.5],
  [2, -14.5],
  [8, -12.5],
  [14, -10.5],
  [24, -12],
  [42, -13],
  [58, -10],
  [66, -3],
]);

const KALLOZUM_SEKLI = sekil([
  [15, -3],
  [23, -4.5],
  [30, 0],
  [33, 8],
  [29, 18],
  [16, 25.5],
  [-4, 28],
  [-24, 26.5],
  [-37, 21],
  [-44.5, 12],
  [-43.5, 3.5],
  [-38, 1],
  [-32, 5],
  [-27, 13.5],
  [-14, 18.5],
  [4, 19],
  [17, 15],
  [22.5, 7],
  [20.5, 1.5],
]);

/** Beyin sapı (orta beyin, pons, omurilik soğanı) ve omuriliğin başı. Üst kenarı büyük beynin altında kalır. */
const BEYIN_SAPI_SEKLI = sekil([
  [-12, -9],
  [-13.5, -15],
  [-15.5, -22],
  [-11, -25],
  [-8.5, -30.5],
  [-8.5, -37],
  [-11.5, -42.5],
  [-17, -46.5],
  [-19.5, -51],
  [-21.5, -59],
  [-24.5, -69],
  [-27, -78],
  [-27.5, -84],
  [-37, -84],
  [-36.5, -76],
  [-36, -67],
  [-38, -58],
  [-36, -48],
  [-35, -38],
  [-35.5, -28],
  [-37, -21],
  [-38.5, -18],
  [-41, -13.5],
  [-39.5, -9.5],
  [-40.5, -5.5],
  [-37, -1],
  [-26, 0],
]);

const BEYINCIK_SEKLI = sekil([
  [-41.5, -16.5],
  [-48, -12.5],
  [-61, -12],
  [-74, -14.5],
  [-85, -23],
  [-88, -36],
  [-84, -50],
  [-75, -61],
  [-62, -66.5],
  [-50, -64],
  [-43.5, -59.5],
  [-44.5, -52],
  [-50.5, -38],
  [-46, -27],
]);

/** Dördüncü karıncık: tabanı beyin sapının arka yüzü, tepesi beyinciğe doğru (fastigium). */
const DORDUNCU_KARINCIK = sekil([
  [-37.2, -20.5],
  [-35.6, -28],
  [-35.1, -38],
  [-36, -48],
  [-38.2, -57],
  [-43.5, -52],
  [-50.2, -38],
  [-45.5, -27.5],
  [-40, -19.5],
]);

const AC = P(0, 0);
const PC = P(-24, 0);

/** Beyin sapının uzun ekseni (Meynert): şemada pons ve omurilik soğanının ortasından geçen doğru. */
const meynertY = (z: number) => -23 + (z + 20) / 6;
const KOSE: Nokta = P(meynertY(0), 0); // iki eksenin kesiştiği yer
const MEYNERT_ALT = P(meynertY(-82), -82);
const FOREL_ON = P(80, 0);
const FOREL_ARKA = P(-34, 0);

function birim(a: Nokta, b: Nokta): Nokta {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const u = Math.hypot(dx, dy);
  return [dx / u, dy / u];
}

/** İki doğrunun kesişiminde küçük dik açı işareti. */
function DikAci({ k, u, n, a = 7, renk }: { k: Nokta; u: Nokta; n: Nokta; a?: number; renk: string }) {
  const p1: Nokta = [yuvarla(k[0] + u[0] * a), yuvarla(k[1] + u[1] * a)];
  const p2: Nokta = [yuvarla(p1[0] + n[0] * a), yuvarla(p1[1] + n[1] * a)];
  const p3: Nokta = [yuvarla(k[0] + n[0] * a), yuvarla(k[1] + n[1] * a)];
  return <path d={`M${p1[0]},${p1[1]} L${p2[0]},${p2[1]} L${p3[0]},${p3[1]}`} fill="none" stroke={renk} strokeWidth="1.6" />;
}

/** Açı yayı: merkez, yarıçap, başlangıç ve bitiş yönleri (ekran açısı, derece; saat yönünde). */
function Yay({ m, r, a1, a2, renk }: { m: Nokta; r: number; a1: number; a2: number; renk: string }) {
  const r1 = (a1 * Math.PI) / 180;
  const r2 = (a2 * Math.PI) / 180;
  const s: Nokta = [yuvarla(m[0] + r * Math.cos(r1)), yuvarla(m[1] + r * Math.sin(r1))];
  const e: Nokta = [yuvarla(m[0] + r * Math.cos(r2)), yuvarla(m[1] + r * Math.sin(r2))];
  const buyuk = a2 - a1 > 180 ? 1 : 0;
  return <path d={`M${s[0]},${s[1]} A${r},${r} 0 ${buyuk} 1 ${e[0]},${e[1]}`} fill="none" stroke={renk} strokeWidth="1.8" />;
}

const aciDer = (u: Nokta) => (Math.atan2(u[1], u[0]) * 180) / Math.PI;

function Beyin() {
  return (
    <g>
      <path d={BEYIN_SAPI_SEKLI} fill={BEYIN_SAPI} stroke={BEYIN_SAPI_CIZGI} strokeWidth="1.5" />
      <path d={BEYINCIK_SEKLI} fill={BEYINCIK} stroke={BEYINCIK_CIZGI} strokeWidth="1.5" />
      <path d={DORDUNCU_KARINCIK} fill={KARINCIK} stroke={ON_BEYIN_CIZGI} strokeWidth="1" />
      <path d={ON_BEYIN_SEKLI} fill={ON_BEYIN} stroke={ON_BEYIN_CIZGI} strokeWidth="1.5" />
      <path d={KALLOZUM_SEKLI} fill={KALLOZUM} stroke={ON_BEYIN_CIZGI} strokeWidth="1.3" />
    </g>
  );
}

function Komissurler() {
  return (
    <g>
      {[AC, PC].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.6" fill={KOMISSUR} stroke="#7a5310" strokeWidth="1.2" />
      ))}
    </g>
  );
}

function Eksenler({ meynertSoluk = false }: { meynertSoluk?: boolean }) {
  return (
    <g strokeLinecap="round">
      <line x1={FOREL_ARKA[0]} y1={FOREL_ARKA[1]} x2={FOREL_ON[0]} y2={FOREL_ON[1]} stroke={FOREL} strokeWidth="3" />
      <line
        x1={KOSE[0]}
        y1={KOSE[1]}
        x2={MEYNERT_ALT[0]}
        y2={MEYNERT_ALT[1]}
        stroke={MEYNERT}
        strokeWidth="3"
        opacity={meynertSoluk ? 0.35 : 1}
      />
    </g>
  );
}

function YetiskinCizim({ g }: { g: Exclude<Gorunum, 'embriyo'> }) {
  const forelYon = birim(KOSE, FOREL_ON);
  const meynertYon = birim(KOSE, MEYNERT_ALT);
  const ileri = (p: Nokta, u: Nokta, d: number): Nokta => [yuvarla(p[0] + u[0] * d), yuvarla(p[1] + u[1] * d)];

  // Koronal kesit: Forel eksenine dik; aşağıda beyin sapının ön kısmını boyuna keser.
  const KY = -16;
  const kor1 = P(KY, 76);
  const kor2 = P(KY, -80);
  const korK = P(KY, 0);
  const korKilavuz = P(KY, -44);
  // Transvers kesit: Meynert eksenine dik, pons hizasında.
  const tz = -36;
  const tMerkez = P(meynertY(tz), tz);
  const one: Nokta = [meynertYon[1], -meynertYon[0]]; // Meynert eksenine dik, ekranda öne (sağa) bakan yön
  const tOn = ileri(tMerkez, one, 36);
  const tArka = ileri(tMerkez, one, -24);

  // PMJ: arkada dört tepecik plağının alt yüzü, önde kör delik (foramen caecum).
  const pmjArka = P(-38.5, -18);
  const pmjOn = P(-15.5, -22);
  const pmjYon = birim(pmjArka, pmjOn);
  const pmjBas = ileri(pmjArka, pmjYon, -14);
  const pmjSon = ileri(pmjArka, pmjYon, 150);
  const paralelSon = ileri(pmjArka, forelYon, 150);
  const yaziX = pmjArka[0] + 116;
  const dx = yaziX + 14 - pmjArka[0];
  const yaziY = yuvarla(pmjArka[1] + (dx * (forelYon[1] / forelYon[0] + pmjYon[1] / pmjYon[0])) / 2 + 4);

  const acE = P(5, 8.5);
  const pcE = P(-31, -8.5);
  const yayOrta = ileri(KOSE, birim([0, 0], [forelYon[0] + meynertYon[0], forelYon[1] + meynertYon[1]]), 22);

  return (
    <>
      <Beyin />

      {g === 'kesitler' && (
        <g>
          <line x1={kor1[0]} y1={kor1[1]} x2={kor2[0]} y2={kor2[1]} stroke={KESIT} strokeWidth="2.4" strokeDasharray="7 4" />
          <line x1={tArka[0]} y1={tArka[1]} x2={tOn[0]} y2={tOn[1]} stroke={KESIT} strokeWidth="2.4" strokeDasharray="7 4" />
        </g>
      )}

      {g === 'atlaslar' && (
        <g strokeLinecap="round">
          <line
            x1={pmjArka[0]}
            y1={pmjArka[1]}
            x2={paralelSon[0]}
            y2={paralelSon[1]}
            stroke={FOREL}
            strokeWidth="2.2"
            strokeDasharray="6 4"
          />
          <line x1={pmjBas[0]} y1={pmjBas[1]} x2={pmjSon[0]} y2={pmjSon[1]} stroke={PMJ} strokeWidth="3" />
        </g>
      )}

      <Eksenler meynertSoluk={g === 'atlaslar'} />
      <Komissurler />

      {/* Ortak etiketler */}
      <Etiket x={acE[0]} y={acE[1]} metin="AC" cizgi={KOMISSUR} kucuk />
      <Etiket x={pcE[0]} y={pcE[1]} metin="PC" cizgi={KOMISSUR} kucuk />
      <Etiket x={372} y={FOREL_ON[1]} metin={['Forel', 'ekseni']} cizgi={FOREL} />
      {g !== 'atlaslar' && <Etiket x={94} y={286} metin="Meynert ekseni" cizgi={MEYNERT} />}

      {g === 'eksenler' && (
        <g>
          <Yay m={KOSE} r={22} a1={aciDer(forelYon)} a2={aciDer(meynertYon)} renk={KOYU_TON} />
          <Kilavuz x1={yayOrta[0]} y1={yayOrta[1]} x2={225} y2={196} />
          <Etiket x={262} y={196} metin="kabaca 90°" />
        </g>
      )}

      {g === 'kesitler' && (
        <g>
          <DikAci k={korK} u={forelYon} n={[forelYon[1], -forelYon[0]]} renk={KESIT} />
          <DikAci k={tMerkez} u={meynertYon} n={one} renk={KESIT} />
          <Kilavuz x1={tOn[0] + 2} y1={tOn[1]} x2={tOn[0] + 12} y2={tOn[1]} />
          <Etiket x={tOn[0] + 65} y={tOn[1]} metin="transvers kesit" cizgi={KESIT} />
          <Kilavuz x1={korKilavuz[0]} y1={korKilavuz[1]} x2={217} y2={250} />
          <Etiket x={264} y={250} metin="koronal kesit" cizgi={KESIT} />
        </g>
      )}

      {g === 'atlaslar' && (
        <g>
          <Yay m={pmjArka} r={112} a1={aciDer(forelYon)} a2={aciDer(pmjYon)} renk="var(--ink-2)" />
          <text x={yaziX} y={yaziY} fontSize="12" fontWeight="700" fill="var(--ink)">
            ~10°
          </text>
          {[pmjArka, pmjOn].map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill={PMJ} stroke="#ffffff" strokeWidth="1.2" />
          ))}
          <Kilavuz x1={pmjOn[0] + 2} y1={pmjOn[1] + 3} x2={204} y2={216} />
          <Etiket x={238} y={216} metin="kör delik" cizgi={PMJ} />
          <Kilavuz x1={pmjArka[0] - 2} y1={pmjArka[1] + 3} x2={86} y2={277} />
          <Etiket x={62} y={292} metin={['tepecik plağının', 'alt yüzü']} cizgi={PMJ} />
          <g fontSize="11" fill="var(--ink-2)">
            <line x1="236" y1="246" x2="258" y2="246" stroke={PMJ} strokeWidth="3" strokeLinecap="round" />
            <text x="264" y="250">
              PMJ düzlemi
            </text>
            <line x1="236" y1="264" x2="258" y2="264" stroke={FOREL} strokeWidth="2.2" strokeDasharray="6 4" />
            <text x="264" y="268">
              AC–PC’ye paralel
            </text>
          </g>
        </g>
      )}

      <text x="8" y="15" fontSize="11" fill="var(--ink-3)">
        Orta hattan bakış (sol yarı): ön taraf sağda, tepe yukarıda.
      </text>
      <text x="392" y="312" textAnchor="end" fontSize="11" fill="var(--ink-3)">
        Şema; oranlar yaklaşıktır.
      </text>
    </>
  );
}

/* ---------- Embriyo: nöral tüpün üç bükülmesi ---------- */

type Bolge = 'omurilik' | 'arka' | 'orta' | 'on';

/** Tüpün orta çizgisi; her nokta, kendisinden sonraki parçanın bölgesini taşır. */
const TUP: { p: Nokta; b: Bolge }[] = [
  { p: [112, 298], b: 'omurilik' },
  { p: [112, 262], b: 'omurilik' },
  { p: [113, 228], b: 'omurilik' },
  { p: [116, 202], b: 'omurilik' },
  { p: [124, 184], b: 'arka' },
  { p: [142, 172], b: 'arka' },
  { p: [162, 172], b: 'arka' },
  { p: [180, 179], b: 'arka' },
  { p: [196, 180], b: 'arka' },
  { p: [214, 170], b: 'arka' },
  { p: [236, 154], b: 'orta' },
  { p: [260, 134], b: 'orta' },
  { p: [286, 123], b: 'orta' },
  { p: [314, 130], b: 'on' },
  { p: [332, 152], b: 'on' },
  { p: [334, 180], b: 'on' },
  { p: [322, 206], b: 'on' },
  { p: [298, 223], b: 'on' },
  { p: [276, 231], b: 'on' },
  { p: [258, 230], b: 'on' },
];

const BOLGE_RENGI: Record<Bolge, string> = {
  omurilik: OMURILIK,
  arka: BEYIN_SAPI,
  orta: ORTA_BEYIN,
  on: ON_BEYIN,
};
const YARI = 11;

/** Orta çizgiyi örnekler; her örnek için sırt (dorsal) ve karın (ventral) kenar noktalarını verir. */
function tupOrnekle() {
  const n = TUP.map((t) => t.p);
  const k = (i: number) => n[Math.max(0, Math.min(n.length - 1, i))];
  const ornek: { c: Nokta; b: Bolge }[] = [];
  const ADIM = 10;
  for (let i = 0; i < n.length - 1; i++) {
    const p0 = k(i - 1);
    const p1 = k(i);
    const p2 = k(i + 1);
    const p3 = k(i + 2);
    for (let s = 0; s < ADIM; s++) {
      const t = s / ADIM;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      ornek.push({
        c: [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])],
        b: TUP[i].b,
      });
    }
  }
  ornek.push({ c: n[n.length - 1], b: TUP[n.length - 2].b });
  return ornek.map((o, i) => {
    const a = ornek[Math.max(0, i - 1)].c;
    const b = ornek[Math.min(ornek.length - 1, i + 1)].c;
    const [tx, ty] = birim(a, b);
    // Yukarı giden tüpte sırt solda: yön vektörü saat yönünün tersine 90° çevrilir.
    const sirt: Nokta = [yuvarla(o.c[0] + ty * YARI), yuvarla(o.c[1] - tx * YARI)];
    const karin: Nokta = [yuvarla(o.c[0] - ty * YARI), yuvarla(o.c[1] + tx * YARI)];
    return { ...o, sirt, karin };
  });
}

const ORNEK = tupOrnekle();
const cizgi = (n: Nokta[]) => n.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

function bolgeParcalari() {
  const parcalar: { b: Bolge; d: string }[] = [];
  let bas = 0;
  for (let i = 1; i <= ORNEK.length; i++) {
    if (i === ORNEK.length || ORNEK[i].b !== ORNEK[bas].b) {
      const son = Math.min(i, ORNEK.length - 1);
      const dilim = ORNEK.slice(bas, son + 1);
      const d = cizgi([...dilim.map((o) => o.sirt), ...dilim.reverse().map((o) => o.karin)]) + ' Z';
      parcalar.push({ b: ORNEK[bas].b, d });
      bas = i;
    }
  }
  return parcalar;
}

const PARCALAR = bolgeParcalari();
const SIRT_KENARI = cizgi(ORNEK.map((o) => o.sirt));
const KARIN_KENARI = cizgi(ORNEK.map((o) => o.karin));
const UC = ORNEK[ORNEK.length - 1];

const NOTOKORD_YOLU = egri(
  [
    [132, 296],
    [132, 236],
    [140, 213],
    [165, 205],
    [192, 208],
    [222, 202],
    [248, 196],
    [262, 192],
  ],
  false,
);

function EmbriyoCizim() {
  return (
    <>
      <g transform="translate(0 8)">
        <path d={NOTOKORD_YOLU} fill="none" stroke={NOTOKORD} strokeWidth="3" strokeLinecap="round" />
        {PARCALAR.map((p, i) => (
          <path key={i} d={p.d} fill={BOLGE_RENGI[p.b]} stroke={BOLGE_RENGI[p.b]} strokeWidth="0.8" />
        ))}
        {/* Ön beynin rostral ucu: tüpün kapalı ucu */}
        <path
          d={`M${UC.sirt[0]},${UC.sirt[1]} A${YARI},${YARI} 0 0 1 ${UC.karin[0]},${UC.karin[1]}`}
          fill={ON_BEYIN}
          stroke="var(--ink-3)"
          strokeWidth="1.5"
        />
        <path d={SIRT_KENARI} fill="none" stroke={DORSAL} strokeWidth="2.6" strokeLinejoin="round" />
        <path d={KARIN_KENARI} fill="none" stroke={VENTRAL} strokeWidth="2.6" strokeLinejoin="round" />

        {/* Bölge adları */}
        <text x="96" y="272" textAnchor="end" fontSize="11" fill="var(--ink-2)">
          omurilik
        </text>
        <text x="142" y="272" fontSize="11" fill="var(--ink-2)">
          notokord
        </text>
        <text x="150" y="150" fontSize="11.5" fontWeight="700" fill="var(--ink)">
          arka beyin
        </text>
        <text x="180" y="120" fontSize="11.5" fontWeight="700" fill="var(--ink)">
          orta beyin
        </text>
        <text x="262" y="262" fontSize="11.5" fontWeight="700" fill="var(--ink)">
          ön beyin
        </text>

        {/* Bükülmeler */}
        <g fontSize="11" fill="var(--ink)">
          <text x="104" y="160" textAnchor="end" fontWeight="700">
            Servikal bükülme
          </text>
          <text x="104" y="173" textAnchor="end" fill="var(--ink-2)">
            ventrale içbükey
          </text>
          <text x="392" y="86" textAnchor="end" fontWeight="700">
            Sefalik bükülme
          </text>
          <text x="392" y="99" textAnchor="end" fill="var(--ink-2)">
            ventrale içbükey
          </text>
          <text x="190" y="232" textAnchor="middle" fontWeight="700">
            Pontin bükülme
          </text>
          <text x="190" y="245" textAnchor="middle" fill="var(--ink-2)">
            dışbükeyliği öne
          </text>
        </g>
        <Kilavuz x1={189} y1={195} x2={190} y2={221} />
        <Kilavuz x1={336} y1={102} x2={308} y2={114} />

        {/* Renk anahtarı */}
        <g fontSize="11" fill="var(--ink-2)">
          <line x1="250" y1="34" x2="266" y2="34" stroke={DORSAL} strokeWidth="3" />
          <text x="272" y="38">
            sırt (dorsal) yüz
          </text>
          <line x1="250" y1="51" x2="266" y2="51" stroke={VENTRAL} strokeWidth="3" />
          <text x="272" y="55">
            karın (ventral) yüz
          </text>
        </g>
      </g>

      <text x="8" y="15" fontSize="11" fill="var(--ink-3)">
        Yandan bakış: embriyonun sırtı solda.
      </text>
      <text x="392" y="312" textAnchor="end" fontSize="11" fill="var(--ink-3)">
        Şema; oranlar yaklaşıktır.
      </text>
    </>
  );
}

/* ---------- Görünümler ---------- */

const BILGI: Record<Gorunum, { baslik: string; metin: string; etiket: string }> = {
  eksenler: {
    baslik: 'İki eksen: Forel ve Meynert',
    metin:
      'Forel ekseni ön beynin eksenidir: ön komissür (AC) ile arka komissürü (PC) birleştiren çizginin doğrultusundadır. Meynert ekseni beyin sapının uzun eksenidir. Henley’e göre sinir ekseni orta beyin hizasında kabaca 90° bükülür. OpenStax bükülmeyi beyin sapı ile ara beyin arasına koyar. Bu dersin taradığı kaynaklarda yetişkin beyninde ölçülmüş bir eksen açısı bulunamadı.',
    etiket:
      'Beynin orta hattan şeması: ön beynin ekseni (Forel ekseni, AC–PC çizgisi) ile beyin sapının uzun ekseni (Meynert ekseni) ve aradaki kabaca 90 derecelik bükülme',
  },
  kesitler: {
    baslik: 'Eksene dik kesitler',
    metin:
      'Ön beyinde Forel eksenine dik kesite koronal (frontal) kesit denir. Beyin sapında Meynert eksenine dik kesite transvers (enine) kesit denir. Bütün beyni koronal dilimleyen bir dizide koronal kesit, beyin sapını kendi eksenine dik kesmeyebilir. Bu yüzden kesitin adına değil, hangi eksene dik alındığına bak.',
    etiket: 'Forel eksenine dik koronal kesit ve Meynert eksenine dik transvers kesit',
  },
  atlaslar: {
    baslik: 'Atlasların kesit düzlemleri',
    metin:
      'Ponto-mezensefalik bileşke düzlemi (PMJ), pons ile orta beynin birleştiği yerden geçer. Coulombe ve arkadaşlarının tahminine göre bu düzlem AC–PC düzleminden yaklaşık 10° ayrılır. Paxinos ve arkadaşlarının 2020 atlasının düzleminden ise yaklaşık 20° ayrılır. Kaynak eğimin yönünü yazmaz; şemadaki yön yaklaşıktır. Mai ve Majtanik’e göre dört talamus atlasında kesitler AC–PC düzlemine 22°’ye kadar eğiktir. Coulombe ve arkadaşları ise bunlardan Ding atlasını AC–PC düzlemine dik sayar.',
    etiket: 'Beyin sapındaki PMJ düzlemi ile AC–PC çizgisi arasındaki yaklaşık 10 derecelik açı',
  },
  embriyo: {
    baslik: 'Embriyodaki üç bükülme',
    metin:
      'Gray’e göre beynin bölümleri eşit hızda büyümediği için embriyonun beyni zikzak çizerek kıvrılır. Sefalik bükülmede ön beyin notokordun ucunun çevresinde karın tarafına kıvrılır ve tabanı arka beyninkine neredeyse paralel olur. Servikal bükülme 5. haftanın sonunda neredeyse dik açı yapar, baş dikleşince azalır ve kaybolur. Haftalar Gray’in dönemindeki yaşlandırmaya dayanır.',
    etiket: 'Embriyonun nöral tüpünde sefalik, pontin ve servikal bükülmeler',
  },
};

export function EksenAcilari() {
  const [g, setG] = useState<Gorunum>('eksenler');
  const b = BILGI[g];
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={g}
        onDegis={setG}
        secenekler={[
          { d: 'eksenler', ad: 'İki eksen' },
          { d: 'kesitler', ad: 'Dik kesitler' },
          { d: 'atlaslar', ad: 'Atlas düzlemleri' },
          { d: 'embriyo', ad: 'Embriyoda bükülmeler' },
        ]}
      />
      <svg viewBox="0 0 400 320" className="mx-auto w-full max-w-2xl" role="img" aria-label={b.etiket}>
        {g === 'embriyo' ? <EmbriyoCizim /> : <YetiskinCizim g={g} />}
      </svg>
      <div className="flex flex-col gap-1.5" aria-live="polite">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
