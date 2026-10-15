'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Secenekler, useGorunur, useHareketAzaltilmis, useKare } from './ortak';

/**
 * Köprü toplardamarları: beyin yüzeyindeki toplardamarların subaraknoid boşluktan çıkıp örümcek ağı zarı ve sert zarın
 * iç katmanını delerek üst sagital sinüse açıldığı kısa bölüm ve klinik önemi. Beş görünüm (önden bakış, koronal kesit):
 * 1) Köprü: kemik, sert zar (dış ve iç katman), sert zarın sınır hücre katmanı, örümcek ağı zar, BOS dolu subaraknoid
 *    boşluk, yumuşak zar, kabuk; üst sagital sinüs ve beyin orağı; köprünün örümcek ağı zarı geçtiği yerdeki ACE noktası.
 * 2) Giriş tipleri: köprünün üst sagital sinüse doğrudan (A), sinüs duvarında bir süre ilerleyerek (B) ya da yandaki
 *    venöz lakünden geçerek (C) bağlanması; 86 hastada oranlar ve 10 erişkin kadavrada duvar kalınlıkları.
 * 3) Erişkin ve bebek: köprü sayıları (farklı yöntemlerle), duvar kalınlığı ve destek dokusu farkı.
 * 4) Beyin küçülünce: beyin küçülür, aralık genişler, köprü uzar ve incelir; hafif bir çarpmada yırtılır ve kan sınır
 *    hücre katmanında açılan yarığa dolar (düğmeyle yavaşça; hareketi azaltmayı seçenlerde doğrudan son durum).
 * 5) Kronik subdural kanama: sınır hücre katmanındaki yarıkta kan; damarlı dış zar, ince iç zar; orta meningeal
 *    atardamar dallarının sert zarı beslemesi ve embolizasyon (yararı tartışmalı).
 * Şemadır; zarlar kalın çizildi, oranlar yaklaşıktır.
 * Kaynaklar: Gray (1918); Ishikawa ve ark. (2026); Joost ve ark. (2026); Nouri ve ark. (2021); Smyth ve ark. (2024);
 * Ye ve ark. (2024); Juskys ve ark. (2022); Zhao ve ark. (2024); Cheshire ve ark. (2018, 2024); Pierre ve ark. (2026);
 * Araki ve ark. (2017); Manivannan ve ark. (2021); Kim ve Gean (2011; kanamanın hilal biçimi); Edlmann ve ark. (2017);
 * Kim ve ark. (2024); Ota (2026); Chen ve ark. (2024); Gillespie ve ark. (2025).
 */

type Gorunum = 'kopru' | 'tipler' | 'bebek' | 'atrofi' | 'kronik';
type Nokta = [number, number];

const RENK = {
  kemik: '#ebe0ca',
  kemikKenar: '#b09c74',
  dura: '#cdb39a',
  duraCizgi: '#957759',
  sinir: '#efd27e',
  arak: '#7f95b8',
  bos: '#d3e8fa',
  pia: '#c25b67',
  kabuk: '#e7b0a3',
  ak: '#f6e8de',
  toplar: '#5d84ea',
  toplarKenar: '#33509f',
  sinus: '#4e64b9',
  kan: '#b3372c',
  kanEski: '#8d3729',
  atar: '#dc4a3e',
  atarKenar: '#97281f',
  disZar: '#e39a80',
  icZar: '#eadcc0',
  destek: '#e3cfae',
  granul: '#cdd8ea',
};

const f = (n: number) => n.toFixed(1);
const f3 = (n: number) => n.toFixed(4);
const L = (pts: Nokta[]) => pts.map(([x, y]) => ` L${f(x)},${f(y)}`).join('');

function kubik(p: Nokta[], t: number): Nokta {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
}

/** Kübik eğrinin [t0, t1] parçası (de Casteljau). */
function kubikParca(p: Nokta[], t0: number, t1: number): Nokta[] {
  const bol = (q: Nokta[], t: number): [Nokta[], Nokta[]] => {
    const ara = (a: Nokta, b: Nokta): Nokta => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const p01 = ara(q[0], q[1]);
    const p12 = ara(q[1], q[2]);
    const p23 = ara(q[2], q[3]);
    const p012 = ara(p01, p12);
    const p123 = ara(p12, p23);
    const m = ara(p012, p123);
    return [
      [q[0], p01, p012, m],
      [m, p123, p23, q[3]],
    ];
  };
  const sag = bol(p, t0)[1];
  const t = t0 >= 1 ? 1 : (t1 - t0) / (1 - t0);
  return bol(sag, t)[0];
}

const kubikYol = (p: Nokta[]) =>
  `M${f(p[0][0])},${f(p[0][1])} C${f(p[1][0])},${f(p[1][1])} ${f(p[2][0])},${f(p[2][1])} ${f(p[3][0])},${f(p[3][1])}`;

/** Eğrinin ucundan (t = 1) yaklaşık d birim geride kalan t değeri. */
function uctanGeri(p: Nokta[], d: number): number {
  const uc = p[3];
  for (let t = 1; t > 0; t -= 0.004) {
    const q = kubik(p, t);
    if (Math.hypot(q[0] - uc[0], q[1] - uc[1]) >= d) return t;
  }
  return 0;
}

/** Ortası (mx, cy) olan yaylar için yardımcılar. */
function yayAraci(mx: number, cy: number) {
  const ay = (R: number, x: number) => cy - Math.sqrt(R * R - (x - mx) ** 2);
  const noktalar = (R: number | ((x: number) => number), x1: number, x2: number, adim = 4): Nokta[] => {
    const n = Math.max(1, Math.ceil(Math.abs(x2 - x1) / adim));
    return Array.from({ length: n + 1 }, (_, i) => {
      const x = x1 + ((x2 - x1) * i) / n;
      return [x, ay(typeof R === 'number' ? R : R(x), x)];
    });
  };
  /** (x, R) noktasından merkeze doğru (ışın boyunca) R2 yarıçapındaki nokta. */
  const isin = (x: number, R1: number, R2: number): Nokta => {
    const y = ay(R1, x);
    const a = Math.atan2(x - mx, cy - y);
    return [mx + R2 * Math.sin(a), cy - R2 * Math.cos(a)];
  };
  return { ay, noktalar, isin };
}

// ---------------------------------------------------------------------------------------------------------------
// Etiket: zemin kutulu kısa yazı; istenirse işaret çizgisiyle bir noktaya bağlanır. Kutunun genişliği yazı ölçülerek
// ayarlanır (yazı tipi değişse de kutu yazıyı sarar).

const PAD = 5;
function tahmin(m: string) {
  return m.length * 5.7 + 2 * PAD;
}
function enYakin(x0: number, w: number, y: number, h: Nokta): Nokta {
  return [Math.max(x0, Math.min(x0 + w, h[0])), Math.max(y - 8, Math.min(y + 8, h[1]))];
}

type Hiza = 'sol' | 'sag' | 'orta';
const solKenar = (x: number, w: number, hiza: Hiza) => (hiza === 'sag' ? x - w : hiza === 'orta' ? x - w / 2 : x);

/** x: hiza 'sol' ise kutunun sol kenarı, 'sag' ise sağ kenarı, 'orta' ise ortası; y: kutunun ortası. */
function Etiket({ x, y, m, hiza = 'sol', hedef }: { x: number; y: number; m: string; hiza?: Hiza; hedef?: Nokta }) {
  const tRef = useRef<SVGTextElement>(null);
  const kRef = useRef<SVGRectElement>(null);
  const cRef = useRef<SVGGElement>(null);
  const w0 = tahmin(m);
  const x0 = solKenar(x, w0, hiza);
  const bas = hedef ? enYakin(x0, w0, y, hedef) : null;
  // Kutuyu yazının gerçek genişliğine göre ayarla; yazı tipi sonradan yüklenirse yeniden ölç.
  useLayoutEffect(() => {
    const olc = () => {
      const t = tRef.current;
      const k = kRef.current;
      if (!t || !k) return;
      const w = t.getComputedTextLength() + 2 * PAD;
      const x1 = solKenar(x, w, hiza);
      k.setAttribute('x', f(x1));
      k.setAttribute('width', f(w));
      t.setAttribute('x', f(x1 + PAD));
      if (hedef && cRef.current) {
        const b = enYakin(x1, w, y, hedef);
        for (const c of cRef.current.querySelectorAll('line')) {
          c.setAttribute('x1', f(b[0]));
          c.setAttribute('y1', f(b[1]));
        }
      }
    };
    olc();
    const yazilar = document.fonts;
    yazilar?.addEventListener('loadingdone', olc);
    return () => yazilar?.removeEventListener('loadingdone', olc);
  });
  return (
    <g data-etiket="">
      {hedef && bas && (
        <>
          {/* Zemin renginde ince bir hale: çizgi açık ve koyu dolguların üstünde de seçilsin */}
          <g ref={cRef}>
            <line x1={bas[0]} y1={bas[1]} x2={hedef[0]} y2={hedef[1]} stroke="var(--surface)" strokeWidth="2.6" strokeOpacity="0.85" />
            <line x1={bas[0]} y1={bas[1]} x2={hedef[0]} y2={hedef[1]} stroke="var(--ink-2)" strokeWidth="0.9" />
          </g>
          <circle cx={hedef[0]} cy={hedef[1]} r="2.1" fill="var(--ink)" stroke="var(--surface)" strokeWidth="0.8" />
        </>
      )}
      <rect ref={kRef} x={x0} y={y - 8} width={w0} height="16" rx="8" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="0.8" />
      <text ref={tRef} x={x0 + PAD} y={y + 3.7} fontSize="10.5" fill="var(--ink)">
        {m}
      </text>
    </g>
  );
}

function Damar({ d, w, renk = RENK.toplar, kenar = RENK.toplarKenar }: { d: string; w: number; renk?: string; kenar?: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={kenar} strokeWidth={w + 1.6} />
      <path d={d} stroke={renk} strokeWidth={w} />
    </g>
  );
}
// ---------------------------------------------------------------------------------------------------------------
// 1 ve 4. görünüm: üst sagital sinüs çevresinin koronal kesiti.

const MX = 146; // orta hat
const CY = 600; // yayların ortası
const KD = 548; // kemiğin dış yüzü
const KI = 526; // kemiğin iç yüzü
const EM = 513; // sert zarın dış (endosteal) ve iç (meningeal) katmanı arasındaki sınır
const RD = 500; // sert zarın iç yüzü; sınır hücre katmanı buradan içe doğru
const SNR = 5; // sınır hücre katmanının çizimdeki kalınlığı
const ARK = 4; // örümcek ağı zarın çizimdeki kalınlığı
const RB = 466; // beyin yüzeyi (kıvrımların tepesi)
const RV = 470; // yüzey toplardamarının yarıçapı (beyin yüzeyinde, subaraknoid boşlukta)
const SAG = 282; // kesitin sağ kenarı; sağında etiketler
const ALT = 232; // kesitin alt kenarı
const FX = 5; // orağın yarı kalınlığı
const ANA = yayAraci(MX, CY);
const ay = ANA.ay;
const y38 = ay(RD, MX - 38);
const KIV_SOL: Nokta[] = [
  [MX - 38, y38],
  [MX - 22, y38 + 2],
  [MX - FX, y38 + 19],
  [MX - FX, y38 + 44],
];
const kivSag = KIV_SOL.map(([x, y]) => [2 * MX - x, y] as Nokta);
const IC_YUZ =
  `M-6,${f(ay(RD, -6))}${L(ANA.noktalar(RD, -6, MX - 38))} ${kubikYol(KIV_SOL).replace(/^M[^C]*/, '')} L${MX - FX},${ALT + 6}` +
  ` M${MX + FX},${ALT + 6} L${MX + FX},${f(y38 + 44)} C${f(kivSag[2][0])},${f(kivSag[2][1])} ${f(kivSag[1][0])},${f(kivSag[1][1])} ${f(kivSag[0][0])},${f(kivSag[0][1])}${L(ANA.noktalar(RD, MX + 38, SAG + 6))}`;
const DURA_YOL =
  `M-6,${f(ay(KI, -6))}${L(ANA.noktalar(KI, -6, SAG + 6))} L${SAG + 6},${f(ay(RD, SAG + 6))}${L(ANA.noktalar(RD, SAG + 6, MX + 38))}` +
  ` ${kubikYol(kivSag).replace(/^M[^C]*/, '')} L${MX + FX},${ALT + 6} L${MX - FX},${ALT + 6} L${MX - FX},${f(y38 + 44)}` +
  ` C${f(KIV_SOL[2][0])},${f(KIV_SOL[2][1])} ${f(KIV_SOL[1][0])},${f(KIV_SOL[1][1])} ${f(KIV_SOL[0][0])},${f(KIV_SOL[0][1])}${L(ANA.noktalar(RD, MX - 38, -6))} Z`;
const KEMIK_YOL = `M-6,${f(ay(KD, -6))}${L(ANA.noktalar(KD, -6, SAG + 6))} L${SAG + 6},${f(ay(KI, SAG + 6))}${L(ANA.noktalar(KI, SAG + 6, -6))} Z`;
const BOS_YOL = `M-6,${f(ay(KI, -6))}${L(ANA.noktalar(KI, -6, SAG + 6))} L${SAG + 6},${ALT + 6} L-6,${ALT + 6} Z`;
const SINUS_UST = ay(EM, MX - 19);
const SINUS_UC = y38 + 26;
const SINUS_YOL = `M${MX - 19},${f(SINUS_UST)} L${MX + 19},${f(SINUS_UST)} L${MX},${f(SINUS_UC)} Z`;
/** Sinüsün sol yan duvarında, verilen yükseklikteki x. */
const sinusSolX = (y: number) => MX - 19 + ((y - SINUS_UST) / (SINUS_UC - SINUS_UST)) * 19;
const EM_CIZGI = `M-6,${f(ay(EM, -6))}${L(ANA.noktalar(EM, -6, MX - 19))} M${MX + 19},${f(ay(EM, MX + 19))}${L(ANA.noktalar(EM, MX + 19, SAG + 6))}`;

/** Bir yarımkürenin dış yüzü (kıvrımlar ve oluklarla) ve alanı. yon: -1 sol, 1 sağ. */
function yarimKure(yon: -1 | 1, oluklar: number[], uc: number) {
  const ic = MX + yon * 19;
  const kx = MX + yon * 56;
  const parca: string[] = [
    `M${ic},${ALT + 6} L${ic},${f(y38 + 62)} C${ic},${f(y38 + 40)} ${MX + yon * 36},${f(ay(RB, kx) + 2)} ${kx},${f(ay(RB, kx))}`,
  ];
  const yapildi = new Set<number>();
  for (let x = kx + yon * 4; yon < 0 ? x > uc : x < uc; x += yon * 4) {
    const o = oluklar.find((s) => Math.abs(x - s) <= 6);
    if (o === undefined) {
      parca.push(` L${f(x)},${f(ay(RB, x))}`);
    } else if (!yapildi.has(o)) {
      yapildi.add(o);
      const a = o - yon * 6;
      const b = o + yon * 6;
      const yb = ay(RB, o) + 24;
      parca.push(
        ` L${f(a)},${f(ay(RB, a))} C${f(o - yon * 3)},${f(ay(RB, a) + 0.5)} ${f(o - yon * 2)},${f(yb - 9)} ${f(o - yon * 1.6)},${f(yb)}` +
          ` Q${f(o)},${f(yb + 3.2)} ${f(o + yon * 1.6)},${f(yb)} C${f(o + yon * 2)},${f(yb - 9)} ${f(o + yon * 3)},${f(ay(RB, b) + 0.5)} ${f(b)},${f(ay(RB, b))}`,
      );
    }
  }
  parca.push(` L${f(uc)},${f(ay(RB, uc))}`);
  const yuzey = parca.join('');
  return { yuzey, alan: `${yuzey} L${uc},${ALT + 6} Z` };
}
// Yarımkürelerin dış ucu kesitin dışına taşar: beyin küçülünce kenarda boşluk kalmasın.
const SOL_KURE = yarimKure(-1, [MX - 90, MX - 128, MX - 166], -30);
const SAG_KURE = yarimKure(1, [MX + 90, MX + 128, MX + 166], SAG + 30);
const L0: Nokta = [MX - 66, ay(RV, MX - 66)]; // yüzey toplardamarının beyinden ayrıldığı yer
const YUZEY_TOPLAR = `M-30,${f(ay(RV, -30))}${L(ANA.noktalar(RV, -30, L0[0]))}`;
const E_NOKTA = kubik(KIV_SOL, 0.22); // köprünün sert zara girdiği yer
const S_NOKTA: Nokta = [sinusSolX(E_NOKTA[1] - 2.5) + 1.5, E_NOKTA[1] - 2.5]; // sinüse açıldığı yer
const DURA_ICI_TOPLAR = `M${f(E_NOKTA[0])},${f(E_NOKTA[1])} L${f(S_NOKTA[0])},${f(S_NOKTA[1])}`;

/** Ölçek k ile beyin küçülünce (yay ortasına doğru) bir noktanın yeni yeri. */
const kucult = (p: Nokta, k: number): Nokta => [MX + (p[0] - MX) * k, CY - (CY - p[1]) * k];
/** Küçülmüş beynin yüzeyinde (R yarıçapında) x noktasının yüksekliği. */
const ayK = (R: number, k: number, x: number) => CY - Math.sqrt((R * k) ** 2 - (x - MX) ** 2);

/** Hilal biçimli kan: sınır hücre katmanının içinde açılan yarıkta. */
const HILAL_UC = MX - 38;
function hilal(r: number) {
  const H = 15 * r;
  const yayilma = 0.18 + 0.82 * r;
  const xa = HILAL_UC - (HILAL_UC + 8) * yayilma;
  const h = (x: number) => (x <= xa || x >= HILAL_UC ? 0 : H * Math.pow(Math.sin((Math.PI * (HILAL_UC - x)) / (HILAL_UC - xa)), 0.7));
  const ust = ANA.noktalar(RD - 2, HILAL_UC, xa, 3);
  const alt = ANA.noktalar((x) => RD - 2 - h(x), xa, HILAL_UC, 3);
  const alan = `M${f(ust[0][0])},${f(ust[0][1])}${L(ust.slice(1))}${L(alt)} Z`;
  const sinirAlt = `M${f(xa)},${f(ay(RD - 3.5, xa))}${L(ANA.noktalar((x) => RD - 3.5 - h(x), xa, HILAL_UC, 3))}`;
  const arakAlt = `M${f(xa)},${f(ay(RD - SNR - ARK / 2, xa))}${L(ANA.noktalar((x) => RD - SNR - ARK / 2 - h(x), xa, HILAL_UC, 3))}`;
  const orta = Math.max(xa + 6, 36);
  return { alan, sinirAlt, arakAlt, ortaNokta: [orta, ay(RD - 2 - h(orta) / 2, orta)] as Nokta };
}

function Kesit({ s, r, mod }: { s: number; r: number; mod: 'kopru' | 'atrofi' }) {
  const k = 1 - 0.055 * s;
  const l0 = kucult(L0, k);
  const kopru: Nokta[] = [l0, [l0[0] + 16, l0[1] - 2], [E_NOKTA[0] - 10, E_NOKTA[1] + 12], E_NOKTA];
  const w = 5.5 - 2 * s;
  const yirtik = r > 0.02;
  const kopruD = yirtik ? kubikYol(kubikParca(kopru, 0, uctanGeri(kopru, 11))) : kubikYol(kopru);
  const kutuk = yirtik ? kubikYol(kubikParca(kopru, uctanGeri(kopru, 2.5), 1)) : null;
  const manset = kubik(kopru, uctanGeri(kopru, SNR + ARK / 2));
  const yon = Math.atan2(E_NOKTA[1] - manset[1], E_NOKTA[0] - manset[0]) * (180 / Math.PI);
  const kopruOrta = kubik(kopru, 0.45);
  const hl = yirtik ? hilal(r) : null;
  const yirtikYer = kubik(kopru, uctanGeri(kopru, 6.5));
  // Aralık oku: sağ yarımkürede, örümcek ağı zarın iç kenarından beyin yüzeyine.
  const ox = MX + 46;
  const ok1 = ay(RD - SNR - ARK, ox);
  const ok2 = ayK(RB, k, ox);
  const tam = mod === 'kopru';
  const kopruAdi = !yirtik ? (s > 0.4 ? 'gerilen köprü' : 'köprü toplardamarı') : 'yırtılan köprü';
  return (
    <svg
      viewBox={`0 0 400 ${ALT}`}
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label={
        tam
          ? 'Önden kesitte üst sagital sinüs çevresi: köprü toplardamarı beyin yüzeyinden zarları geçip sinüse açılıyor'
          : yirtik
            ? 'Küçülmüş beyin, yırtılmış köprü toplardamarı ve sert zarın sınır hücre katmanında biriken hilal biçimli kan'
            : 'Beyin küçüldükçe sert zar ile beyin arasındaki aralık genişliyor, köprü toplardamarı uzayıp inceliyor'
      }
    >
      <defs>
        <clipPath id="kt-kesit">
          <rect x="0" y="0" width={SAG} height={ALT} />
        </clipPath>
      </defs>
      <g clipPath="url(#kt-kesit)">
        <path d={BOS_YOL} fill={RENK.bos} />
        {/* Beyin: küçülünce yay ortasına doğru çekilir */}
        <g transform={`translate(${MX} ${CY}) scale(${f3(k)}) translate(${-MX} ${-CY})`}>
          {[SOL_KURE, SAG_KURE].map((kure, i) => (
            <g key={i}>
              <clipPath id={`kt-kure-${i}`}>
                <path d={kure.alan} />
              </clipPath>
              <path d={kure.alan} fill={RENK.ak} />
              <path d={kure.yuzey} fill="none" stroke={RENK.kabuk} strokeWidth="22" clipPath={`url(#kt-kure-${i})`} />
              <path d={kure.yuzey} fill="none" stroke={RENK.pia} strokeWidth="1.4" />
            </g>
          ))}
          <Damar d={YUZEY_TOPLAR} w={5.5} />
        </g>
        {/* Örümcek ağı zar ve sınır hücre katmanı: sert zarın iç yüzü boyunca */}
        <path d={IC_YUZ} fill="none" stroke={RENK.arak} strokeWidth={2 * (SNR + ARK)} strokeLinejoin="round" />
        <path d={IC_YUZ} fill="none" stroke={RENK.sinir} strokeWidth={2 * SNR} strokeLinejoin="round" />
        {hl && (
          <g>
            <path d={hl.alan} fill={RENK.kan} />
            <path d={hl.sinirAlt} fill="none" stroke={RENK.sinir} strokeWidth="3" />
            <path d={hl.arakAlt} fill="none" stroke={RENK.arak} strokeWidth={ARK} />
          </g>
        )}
        <path d={DURA_YOL} fill={RENK.dura} />
        <path d={EM_CIZGI} fill="none" stroke={RENK.duraCizgi} strokeWidth="0.9" strokeDasharray="3 3" />
        <path d={SINUS_YOL} fill={RENK.sinus} />
        <path d={KEMIK_YOL} fill={RENK.kemik} stroke={RENK.kemikKenar} strokeWidth="1" />
        {/* Köprü toplardamarı */}
        <Damar d={DURA_ICI_TOPLAR} w={5.5} />
        <Damar d={kopruD} w={w} />
        {kutuk && <Damar d={kutuk} w={w} />}
        {!yirtik && (
          <rect
            x={-6}
            y={-(w + 7) / 2}
            width="12"
            height={w + 7}
            rx="3"
            fill="none"
            stroke={RENK.arak}
            strokeWidth="1.8"
            transform={`translate(${f(manset[0])} ${f(manset[1])}) rotate(${f(yon)})`}
          />
        )}
        {yirtik && (
          <g fill={RENK.kan}>
            <circle cx={yirtikYer[0]} cy={yirtikYer[1]} r={3 * Math.min(1, r * 3)} />
            <circle cx={yirtikYer[0] - 7 * r} cy={yirtikYer[1] + 2 * r} r={1.8 * Math.min(1, r * 3)} />
          </g>
        )}
        {mod === 'atrofi' && (
          <g stroke="#1d2a44" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <line x1={ox} y1={ok1 + 1.5} x2={ox} y2={ok2 - 1.5} />
            <path
              d={`M${ox - 3},${f(ok1 + 5)} L${ox},${f(ok1 + 1.5)} L${ox + 3},${f(ok1 + 5)} M${ox - 3},${f(ok2 - 5)} L${ox},${f(ok2 - 1.5)} L${ox + 3},${f(ok2 - 5)}`}
            />
          </g>
        )}
      </g>
      {/* Etiketler */}
      <Etiket x={290} y={40} m="kemik" hedef={[270, ay((KD + KI) / 2, 270)]} />
      <Etiket x={290} y={59} m="sert zar" hedef={[244, ay(EM - 5, 244)]} />
      <Etiket x={290} y={78} m="sınır hücre katmanı" hedef={[256, ay(RD - SNR / 2, 256)]} />
      <Etiket x={290} y={97} m="örümcek ağı zar" hedef={[274, ay(RD - SNR - ARK / 2, 274)]} />
      <Etiket
        x={290}
        y={116}
        m="subaraknoid boşluk"
        hedef={[258, CY - Math.sqrt(((RD - SNR - ARK + RB * k) / 2) ** 2 - (258 - MX) ** 2)]}
      />
      <Etiket x={290} y={135} m="yumuşak zar" hedef={[244, ayK(RB, k, 244)]} />
      <Etiket x={290} y={154} m="beyin kabuğu" hedef={[258, ayK(RB - 7, k, 258)]} />
      <Etiket x={MX} y={14} hiza="orta" m="üst sagital sinüs" hedef={[MX, SINUS_UST + 13]} />
      <Etiket x={MX - 20} y={174} hiza="sag" m={kopruAdi} hedef={kopruOrta} />
      {tam && (
        <>
          <Etiket x={6} y={198} m="yüzey toplardamarı" hedef={[10, ay(RV, 10)]} />
          <Etiket x={168} y={174} m="ACE noktası" hedef={manset} />
          <Etiket x={168} y={210} m="beyin orağı" hedef={[MX + FX, 210]} />
        </>
      )}
      {mod === 'atrofi' && <Etiket x={ox + 8} y={ok2 + 22} m="aralık" hedef={[ox, (ok1 + ok2) / 2]} />}
      {hl && <Etiket x={6} y={14} m="kan" hedef={hl.ortaNokta} />}
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// 2. görünüm: köprünün sinüse bağlanış tipleri (Ye ve ark., 2024). Her pano yerel koordinatlıdır.

const T_IC = 68; // sert zarın iç yüzü
const T_UST = 57; // sinüsün tavanı
const T_UC = 94; // sinüsün alt ucu
const T_BEYIN = 108; // beyin yüzeyi
const T_VEN = 104.5; // yüzey toplardamarı
const TIP_KIV: Nokta[] = [
  [58, T_IC],
  [72, T_IC + 0.5],
  [86, 82],
  [86, 104],
];
const TIP_IC = `M-4,${T_IC} L58,${T_IC} C72,${T_IC + 0.5} 86,82 86,104 L86,184 M98,184 L98,104 C98,82 112,${T_IC + 0.5} 126,${T_IC} L130,${T_IC}`;
const TIP_DURA = `M-4,47 L130,47 L130,${T_IC} L126,${T_IC} C112,${T_IC + 0.5} 98,82 98,104 L98,184 L86,184 L86,104 C86,82 72,${T_IC + 0.5} 58,${T_IC} L-4,${T_IC} Z`;
const tSolX = (y: number) => 76 + ((y - T_UST) / (T_UC - T_UST)) * 16;
const TIP_BEYIN_YUZ = `M-4,${T_BEYIN} L46,${T_BEYIN} C62,${T_BEYIN} 74,116 74,132 L74,184 M110,184 L110,132 C110,116 122,${T_BEYIN} 138,${T_BEYIN}`;
const TIP_E = kubik(TIP_KIV, 0.3);
const TIP_KOPRU: Record<'A' | 'B' | 'C', Nokta[]> = {
  A: [[24, T_VEN], [44, T_VEN], [TIP_E[0] - 12, TIP_E[1] + 16], TIP_E],
  B: [
    [8, T_VEN],
    [24, T_VEN],
    [32, 80],
    [34, T_IC],
  ],
  C: [
    [16, T_VEN],
    [32, T_VEN],
    [44, 80],
    [46, T_IC],
  ],
};

function TipPano({ ox, tip }: { ox: number; tip: 'A' | 'B' | 'C' }) {
  const kopru = TIP_KOPRU[tip];
  const dura =
    tip === 'A'
      ? `M${f(TIP_E[0])},${f(TIP_E[1])} L${f(tSolX(TIP_E[1] - 3) + 1.5)},${f(TIP_E[1] - 3)}`
      : tip === 'B'
        ? `M34,${T_IC} L36,62.5 L${f(tSolX(62.5) + 1.5)},62.5`
        : `M46,${T_IC} L46,64`;
  const ad = { A: ['A tipi', 'doğrudan açılır'], B: ['B tipi', 'duvarda ilerler'], C: ['C tipi', 'venöz lakünden geçer'] }[tip];
  const sayi = { A: ['%52,17', 'duvar: ort. 238 µm'], B: ['%29,59', 'duvar: ort. 53 µm'], C: ['%18,24', 'duvar: ort. 333 µm'] }[tip];
  return (
    <g transform={`translate(${ox} 0)`}>
      <rect x="0" y="0" width="124" height="236" rx="12" fill="var(--surface-2)" />
      <text x="10" y="17" fontSize="12" fontWeight="700" fill="var(--ink)">
        {ad[0]}
      </text>
      <text x="10" y="32" fontSize="10.5" fill="var(--ink-2)">
        {ad[1]}
      </text>
      <clipPath id={`kt-tip-${tip}`}>
        <rect x="4" y="40" width="116" height="144" rx="6" />
      </clipPath>
      <g clipPath={`url(#kt-tip-${tip})`}>
        <rect x="0" y="40" width="124" height="146" fill={RENK.bos} />
        <path d={`${TIP_BEYIN_YUZ.split(' M')[0]} L-4,184 Z`} fill={RENK.kabuk} />
        <path d={`M${TIP_BEYIN_YUZ.split(' M')[1]} L138,184 Z`} fill={RENK.kabuk} />
        <path d={TIP_BEYIN_YUZ} fill="none" stroke={RENK.pia} strokeWidth="1.3" />
        <path d={TIP_IC} fill="none" stroke={RENK.arak} strokeWidth={2 * (SNR + ARK)} strokeLinejoin="round" />
        <path d={TIP_IC} fill="none" stroke={RENK.sinir} strokeWidth={2 * SNR} strokeLinejoin="round" />
        <path d={TIP_DURA} fill={RENK.dura} />
        <path d={`M-4,${T_UST} L76,${T_UST} M108,${T_UST} L130,${T_UST}`} stroke={RENK.duraCizgi} strokeWidth="0.9" strokeDasharray="3 3" />
        <path d={`M76,${T_UST} L108,${T_UST} L92,${T_UC} Z`} fill={RENK.sinus} />
        {tip === 'C' && <path d="M80,58 C64,55 42,55.5 27,61.5 C42,67.4 64,67.6 80,66 Z" fill={RENK.sinus} />}
        <rect x="0" y="40" width="124" height="7" fill={RENK.kemik} />
        <line x1="0" y1="47" x2="124" y2="47" stroke={RENK.kemikKenar} strokeWidth="1" />
        <Damar d={`M-4,${T_VEN} L${kopru[0][0]},${T_VEN}`} w={4.6} />
        <Damar d={kubikYol(kopru)} w={4.6} />
        <Damar d={dura} w={4.6} />
        {tip === 'A' && (
          <path
            d={`M${f(tSolX(TIP_E[1] - 3) - 1)},${f(TIP_E[1] - 6.5)} q4,2 5.5,5`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        )}
        {tip === 'B' && (
          <path
            d={`M${f(tSolX(62.5) - 3)},60 l0,5 M${f(tSolX(62.5) - 6.5)},60 l0,5`}
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
          />
        )}
        {tip === 'C' && (
          <g>
            <rect x="60.5" y="62" width="3.6" height="13" fill={RENK.granul} stroke={RENK.arak} strokeWidth="0.6" />
            <circle cx="62.3" cy="61" r="3.6" fill={RENK.granul} stroke={RENK.arak} strokeWidth="0.7" />
          </g>
        )}
      </g>
      <text x="10" y="204" fontSize="15" fontWeight="700" fill="var(--ink)">
        {sayi[0]}
      </text>
      <text x="10" y="224" fontSize="10.5" fill="var(--ink-2)">
        {sayi[1]}
      </text>
    </g>
  );
}

function Tipler() {
  const ox = [4, 138, 272];
  return (
    <svg
      viewBox="0 0 400 240"
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label="Köprü toplardamarının üst sagital sinüse bağlanış tipleri: A doğrudan, B sinüs duvarında ilerleyerek, C yandaki venöz lakünden geçerek"
    >
      <TipPano ox={ox[0]} tip="A" />
      <TipPano ox={ox[1]} tip="B" />
      <TipPano ox={ox[2]} tip="C" />
      <Etiket x={ox[0] + 8} y={146} m="köprü" hedef={[ox[0] + kubik(TIP_KOPRU.A, 0.4)[0], kubik(TIP_KOPRU.A, 0.4)[1]]} />
      <Etiket x={ox[0] + 64} y={170} m="sinüs" hedef={[ox[0] + 92, 70]} />
      <Etiket x={ox[1] + 8} y={158} m="ince bantlar" hedef={[ox[1] + tSolX(62.5) - 4.7, 62.5]} />
      <Etiket x={ox[2] + 8} y={170} m="venöz lakün" hedef={[ox[2] + 38, 62]} />
      <Etiket x={ox[2] + 118} y={146} hiza="sag" m="granülasyon" hedef={[ox[2] + 62.3, 72]} />
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// 3. görünüm: erişkin ve bebek köprüsü.

const BB_KOPRU: Nokta[] = [
  [36, 96],
  [64, 96],
  [96, 66],
  [116, 46],
];
const BB_YOL = `M-4,96 L36,96 ${kubikYol(BB_KOPRU).replace(/^M[^C]*/, '')} L124,38 L200,38`;

function BebekPano({ ox, bebek }: { ox: number; bebek: boolean }) {
  const satirlar = bebek
    ? [
        ['Beyin ile sert zar arası:', 'var(--ink-2)'],
        ['beyin başına ort. 54,1', 'var(--ink)'],
        ['en çok 94 (43 otopsi)', 'var(--ink)'],
        ['Duvar: bazıları yalnızca 5–7 µm', 'var(--ink)'],
        ['Cheshire ve ark. (2018, 2024)', 'var(--ink-3)'],
      ]
    : [
        ['Üst sagital sinüse açılan:', 'var(--ink-2)'],
        ['kadavrada kişi başına ort. 19,1', 'var(--ink)'],
        ['BT’de her yanda ort. 5,6 gövde', 'var(--ink)'],
        ['Duvar: ort. 53–333 µm (tipe göre)', 'var(--ink)'],
        ['Juskys 2022 · Zhao 2024 · Ye 2024', 'var(--ink-3)'],
      ];
  const id = `kt-bebek-${bebek ? 1 : 0}`;
  return (
    <g transform={`translate(${ox} 0)`}>
      <rect x="0" y="0" width="194" height="252" rx="12" fill="var(--surface-2)" />
      <text x="10" y="18" fontSize="12" fontWeight="700" fill="var(--ink)">
        {bebek ? 'Bebek ve küçük çocuk' : 'Erişkin'}
      </text>
      <clipPath id={id}>
        <rect x="4" y="26" width="186" height="110" rx="6" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="26" width="194" height="112" fill={RENK.bos} />
        <rect x="0" y="104" width="194" height="34" fill={RENK.kabuk} />
        <line x1="0" y1="104" x2="194" y2="104" stroke={RENK.pia} strokeWidth="1.3" />
        <line x1="0" y1="46" x2="194" y2="46" stroke={RENK.arak} strokeWidth={2 * (SNR + ARK)} />
        <line x1="0" y1="46" x2="194" y2="46" stroke={RENK.sinir} strokeWidth={2 * SNR} />
        <rect x="0" y="26" width="194" height="20" fill={RENK.dura} />
        {!bebek && (
          <path d={kubikYol(kubikParca(BB_KOPRU, 0.12, 1))} fill="none" stroke={RENK.destek} strokeWidth="18" strokeLinecap="round" />
        )}
        <path
          d={BB_YOL}
          fill="none"
          stroke={RENK.toplarKenar}
          strokeWidth={bebek ? 6.2 : 10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={BB_YOL} fill="none" stroke={RENK.toplar} strokeWidth={bebek ? 5.2 : 6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {bebek ? (
        <Etiket x={186} y={124} hiza="sag" m="ince duvar, destek az ya da yok" hedef={kubik(BB_KOPRU, 0.55)} />
      ) : (
        <>
          <Etiket x={186} y={124} hiza="sag" m="destek dokusu" hedef={[kubik(BB_KOPRU, 0.5)[0] + 8, kubik(BB_KOPRU, 0.5)[1] + 5]} />
          <Etiket x={10} y={124} m="kalın duvar" hedef={[kubik(BB_KOPRU, 0.18)[0], kubik(BB_KOPRU, 0.18)[1] + 4.2]} />
        </>
      )}
      {satirlar.map(([m, renk], i) => (
        <text key={m} x="10" y={158 + i * 18 + (i === 4 ? 4 : 0)} fontSize="10.5" fill={renk} fontWeight={i === 0 ? 700 : 400}>
          {m}
        </text>
      ))}
    </g>
  );
}

function EriskinBebek() {
  return (
    <svg
      viewBox="0 0 400 256"
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label="Erişkin ve bebek köprü toplardamarı: erişkinde kalın duvar ve destek dokusu, bebekte ince duvar ve destek az ya da yok; sayılar"
    >
      <BebekPano ox={4} bebek={false} />
      <BebekPano ox={202} bebek />
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// 5. görünüm: kronik subdural kanama. Bir yarımkürenin kubbesi; orta hat sağda.

const MK = 360;
const CK = 640;
const K = yayAraci(MK, CK);
const K_KD = 560;
const K_KI = 540;
const K_EM = 533;
const K_RD = 526;
const K_MMA = 536.5;
const K_ALT = 290;
const HX_A = -12;
const HX_B = MK - 58;
const hK = (x: number) => (x <= HX_A || x >= HX_B ? 0 : 26 * Math.pow(Math.sin((Math.PI * (HX_B - x)) / (HX_B - HX_A)), 0.6));
const mK = (x: number) => Math.min(1, hK(x) / 8);
const rDis = (x: number) => K_RD - 3.5 - 2 * mK(x); // dış zarın iç kenarı
const rKanAlt = (x: number) => rDis(x) - hK(x);
const rIcAlt = (x: number) => rKanAlt(x) - 1.8 * mK(x);
const rArakAlt = (x: number) => rIcAlt(x) - 3;
const rBeyin = (x: number) => rArakAlt(x) - (9 - 4 * mK(x));
const yk34 = K.ay(K_RD, MK - 34);
const K_KIV: Nokta[] = [
  [MK - 34, yk34],
  [MK - 20, yk34 + 1.8],
  [MK - 4, yk34 + 17],
  [MK - 4, yk34 + 39],
];
const K_IC_YUZ =
  `M-6,${f(K.ay(K_RD, -6))}${L(K.noktalar(K_RD, -6, MK - 34))} C${MK - 20},${f(yk34 + 1.8)} ${MK - 4},${f(yk34 + 17)} ${MK - 4},${f(yk34 + 39)} L${MK - 4},${K_ALT + 6}` +
  ` M${MK + 4},${K_ALT + 6} L${MK + 4},${f(yk34 + 39)} C${MK + 4},${f(yk34 + 17)} ${MK + 20},${f(yk34 + 1.8)} ${MK + 34},${f(yk34)}${L(K.noktalar(K_RD, MK + 34, 406))}`;
const K_DURA =
  `M-6,${f(K.ay(K_KI, -6))}${L(K.noktalar(K_KI, -6, 406))} L406,${f(K.ay(K_RD, 406))}${L(K.noktalar(K_RD, 406, MK + 34))}` +
  ` C${MK + 20},${f(yk34 + 1.8)} ${MK + 4},${f(yk34 + 17)} ${MK + 4},${f(yk34 + 39)} L${MK + 4},${K_ALT + 6} L${MK - 4},${K_ALT + 6} L${MK - 4},${f(yk34 + 39)}` +
  ` C${MK - 4},${f(yk34 + 17)} ${MK - 20},${f(yk34 + 1.8)} ${MK - 34},${f(yk34)}${L(K.noktalar(K_RD, MK - 34, -6))} Z`;
const K_KEMIK = `M-6,${f(K.ay(K_KD, -6))}${L(K.noktalar(K_KD, -6, 406))} L406,${f(K.ay(K_KI, 406))}${L(K.noktalar(K_KI, 406, -6))} Z`;
const K_BOS = `M-6,${f(K.ay(K_KI, -6))}${L(K.noktalar(K_KI, -6, 406))} L406,${K_ALT + 6} L-6,${K_ALT + 6} Z`;
const K_SINUS_UST = K.ay(K_EM, MK - 17);
const K_SINUS_UC = yk34 + 23;
const K_SINUS = `M${MK - 17},${f(K_SINUS_UST)} L${MK + 17},${f(K_SINUS_UST)} L${MK},${f(K_SINUS_UC)} Z`;
const K_EM_CIZGI = `M-6,${f(K.ay(K_EM, -6))}${L(K.noktalar(K_EM, -6, MK - 17))} M${MK + 17},${f(K.ay(K_EM, MK + 17))}${L(K.noktalar(K_EM, MK + 17, 406))}`;

/** Kubbenin beyin yüzeyi (ezilmiş, sığ oluklu) ve alanı. */
function kronikBeyin() {
  const kx = MK - 50;
  const ic = MK - 15;
  const parca: string[] = [
    `M${ic},${K_ALT + 6} L${ic},${f(yk34 + 52)} C${ic},${f(yk34 + 32)} ${MK - 32},${f(K.ay(rBeyin(kx), kx) + 2)} ${kx},${f(K.ay(rBeyin(kx), kx))}`,
  ];
  const oluklar = [250, 182, 112, 44];
  const yapildi = new Set<number>();
  for (let x = kx - 4; x > -6; x -= 4) {
    const o = oluklar.find((s) => Math.abs(x - s) <= 5.5);
    if (o === undefined) parca.push(` L${f(x)},${f(K.ay(rBeyin(x), x))}`);
    else if (!yapildi.has(o)) {
      yapildi.add(o);
      const a = o + 5;
      const b = o - 5;
      const yb = K.ay(rBeyin(o), o) + 15;
      parca.push(
        ` L${f(a)},${f(K.ay(rBeyin(a), a))} L${o + 1.6},${f(yb)} Q${o},${f(yb + 2.6)} ${o - 1.6},${f(yb)} L${f(b)},${f(K.ay(rBeyin(b), b))}`,
      );
    }
  }
  parca.push(` L-6,${f(K.ay(rBeyin(-6), -6))}`);
  const yuzey = parca.join('');
  // Öbür yarımkürenin orta hattaki ucu
  const sagYuzey = `M${MK + 15},${K_ALT + 6} L${MK + 15},${f(yk34 + 52)} C${MK + 15},${f(yk34 + 32)} ${MK + 32},${f(K.ay(K_RD - 15.5, MK + 50) + 2)} ${MK + 50},${f(K.ay(K_RD - 15.5, MK + 50))}`;
  return { yuzey, alan: `${yuzey} L-6,${K_ALT + 6} Z`, sagYuzey, sagAlan: `${sagYuzey} L${MK + 50},${K_ALT + 6} Z` };
}
const KB = kronikBeyin();

function seritYolu(rUst: (x: number) => number, rAlt: (x: number) => number, x1: number, x2: number) {
  const ust = K.noktalar(rUst, x1, x2, 3);
  const alt = K.noktalar(rAlt, x2, x1, 3);
  return `M${f(ust[0][0])},${f(ust[0][1])}${L(ust.slice(1))}${L(alt)} Z`;
}
const K_DIS_ZAR = seritYolu(() => K_RD, rDis, -8, HX_B);
const K_KAN = seritYolu(rDis, rKanAlt, -8, HX_B);
const K_IC_ZAR = seritYolu(rKanAlt, rIcAlt, -8, HX_B);
const K_ARAK = `M-8,${f(K.ay(rIcAlt(-8) - 1.5, -8))}${L(K.noktalar((x) => rIcAlt(x) - 1.5, -8, HX_B, 3))}`;
const K_KILCAL = (() => {
  const p: Nokta[] = [];
  for (let x = -6; x <= HX_B - 6; x += 1.5) {
    const om = 3.5 + 2 * mK(x);
    p.push([x, K.ay(K_RD - om / 2 + om * 0.3 * Math.sin(x * 1.1), x)]);
  }
  return `M${f(p[0][0])},${f(p[0][1])}${L(p.slice(1))}`;
})();
const K_MMA_YOL = `M-8,${f(K.ay(K_MMA, -8))}${L(K.noktalar(K_MMA, -8, 300))}`;
const K_DALLAR = [44, 80, 116, 152, 188, 224, 260, 290].map((x) => {
  const a = K.isin(x, K_MMA, K_MMA - 1.5);
  const b = K.isin(x, K_MMA, K_RD - (3.5 + 2 * mK(x)) / 2);
  return `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])}`;
});
const K_YUZEY_TOPLAR = `M262,${f(K.ay(rArakAlt(262) - 4.5, 262))}${L(K.noktalar((x) => rArakAlt(x) - (9 - 4 * mK(x)) / 2, 262, MK - 58, 3))}`;
const K_L0: Nokta = [MK - 58, K.ay(rArakAlt(MK - 58) - 4.5, MK - 58)];
const K_E = kubik(K_KIV, 0.25);
const K_KOPRU: Nokta[] = [K_L0, [K_L0[0] + 10, K_L0[1] - 3], [K_E[0] - 7, K_E[1] + 7], K_E];
const K_S: Nokta = [MK - 17 + ((K_E[1] - 2 - K_SINUS_UST) / (K_SINUS_UC - K_SINUS_UST)) * 17 + 1.5, K_E[1] - 2];
const K_TIKAC = K.isin(22, K_MMA, K_MMA);
const K_TIKAC_ACI = (Math.atan2(K_TIKAC[0] - MK, CK - K_TIKAC[1]) * 180) / Math.PI;

function Kronik() {
  const yR = (R: number, x: number): Nokta => [x, K.ay(R, x)];
  return (
    <svg
      viewBox={`0 0 400 ${K_ALT}`}
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label="Kronik subdural kanama: sert zarın altında damarlı dış zar ile ince iç zar arasında biriken kan; orta meningeal atardamar dalları sert zarda"
    >
      <defs>
        <clipPath id="kt-kronik">
          <rect x="0" y="0" width="400" height={K_ALT} />
        </clipPath>
        <clipPath id="kt-kronik-beyin">
          <path d={KB.alan} />
        </clipPath>
        <clipPath id="kt-kronik-beyin2">
          <path d={KB.sagAlan} />
        </clipPath>
      </defs>
      <g clipPath="url(#kt-kronik)">
        <path d={K_BOS} fill={RENK.bos} />
        <path d={KB.alan} fill={RENK.ak} />
        <path d={KB.yuzey} fill="none" stroke={RENK.kabuk} strokeWidth="22" clipPath="url(#kt-kronik-beyin)" />
        <path d={KB.yuzey} fill="none" stroke={RENK.pia} strokeWidth="1.3" />
        <path d={KB.sagAlan} fill={RENK.ak} />
        <path d={KB.sagYuzey} fill="none" stroke={RENK.kabuk} strokeWidth="22" clipPath="url(#kt-kronik-beyin2)" />
        <path d={KB.sagYuzey} fill="none" stroke={RENK.pia} strokeWidth="1.3" />
        <Damar d={K_YUZEY_TOPLAR} w={4.6} />
        <path d={K_IC_YUZ} fill="none" stroke={RENK.arak} strokeWidth="13" strokeLinejoin="round" />
        <path d={K_IC_YUZ} fill="none" stroke={RENK.sinir} strokeWidth="7" strokeLinejoin="round" />
        <path d={K_DURA} fill={RENK.dura} />
        <path d={K_EM_CIZGI} fill="none" stroke={RENK.duraCizgi} strokeWidth="0.9" strokeDasharray="3 3" />
        {/* İki zar arasındaki kan */}
        <path d={K_DIS_ZAR} fill={RENK.disZar} />
        <path d={K_KILCAL} fill="none" stroke={RENK.atarKenar} strokeWidth="0.8" />
        <path d={K_KAN} fill={RENK.kanEski} />
        <path d={K_IC_ZAR} fill={RENK.icZar} />
        <path d={K_ARAK} fill="none" stroke={RENK.arak} strokeWidth="3" />
        {/* Orta meningeal atardamar dalı ve sert zarı geçen küçük dalları */}
        {K_DALLAR.map((d) => (
          <path key={d} d={d} stroke={RENK.atar} strokeWidth="1.1" />
        ))}
        <Damar d={K_MMA_YOL} w={3.4} renk={RENK.atar} kenar={RENK.atarKenar} />
        <path d={K_SINUS} fill={RENK.sinus} />
        <path d={K_KEMIK} fill={RENK.kemik} stroke={RENK.kemikKenar} strokeWidth="1" />
        <Damar d={kubikYol(K_KOPRU)} w={4.6} />
        <Damar d={`M${f(K_E[0])},${f(K_E[1])} L${f(K_S[0])},${f(K_S[1])}`} w={4.6} />
        <rect
          x="-5.5"
          y="-4.5"
          width="11"
          height="9"
          rx="2"
          fill="#2a2a2a"
          stroke="#ffffff"
          strokeWidth="1"
          transform={`translate(${f(K_TIKAC[0])} ${f(K_TIKAC[1])}) rotate(${f(K_TIKAC_ACI)})`}
        />
      </g>
      <Etiket x={6} y={18} m="orta meningeal atardamar" hedef={K.isin(176, K_MMA, K_MMA)} />
      <Etiket x={6} y={52} m="sert zar" hedef={yR(529.5, 124)} />
      <Etiket x={6} y={86} m="kemik" hedef={yR(550, 70)} />
      <Etiket x={6} y={274} m="embolizasyon" hedef={[K_TIKAC[0], K_TIKAC[1] + 4]} />
      <Etiket x={396} y={18} hiza="sag" m="üst sagital sinüs" hedef={[MK, K_SINUS_UST + 10]} />
      <Etiket x={396} y={150} hiza="sag" m="köprü toplardamarı" hedef={kubik(K_KOPRU, 0.5)} />
      <Etiket x={290} y={172} m="dış zar (damarlı)" hedef={yR(K_RD - 2.8, 266)} />
      <Etiket x={290} y={194} m="kan ve sıvı" hedef={yR((rDis(222) + rKanAlt(222)) / 2, 222)} />
      <Etiket x={290} y={216} m="iç zar" hedef={yR((rKanAlt(196) + rIcAlt(196)) / 2, 196)} />
      <Etiket x={290} y={238} m="örümcek ağı zar" hedef={yR(rIcAlt(172) - 1.5, 172)} />
      <Etiket x={290} y={268} m="beyin" hedef={[262, 262]} />
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------

const BILGI: Record<Exclude<Gorunum, 'atrofi'>, { baslik: string; metin: string; not: string }> = {
  kopru: {
    baslik: 'Köprü toplardamarı: beyin yüzeyinden sinüse',
    metin:
      'Beyin yüzeyindeki toplardamarlar, beyin-omurilik sıvısıyla (BOS) dolu subaraknoid boşlukta toplanır ve köprü toplardamarlarıyla sinüslere boşalır (Joost ve ark., 2026). Köprü, örümcek ağı zarı ve sert zarın iç katmanını delip üst sagital sinüse açılır (Gray, 1918). Duvarı, sert zarın en iç hücre katmanında (sınır hücre katmanı) tek kat hücreye kadar inceliyor olabilir (Nouri ve ark., 2021). Farede yapılan yeni bir çalışmaya göre köprünün örümcek ağı zarı geçtiği yerlerdeki açıklıklardan (ACE noktaları) sıvı ve moleküller geçebilir. Sağlıklı insanlarda da MR’da benzer bir geçiş görüldü (Smyth ve ark., 2024).',
    not: 'Önden bakış (koronal kesit): tepe yukarıda, orta hat ortada. Şema; zarlar kalın çizildi, oranlar yaklaşıktır.',
  },
  tipler: {
    baslik: 'Köprünün sinüse bağlanış tipleri',
    metin:
      'Köprü toplardamarı üst sagital sinüse üç biçimde bağlanır (Ye ve ark., 2024). A tipinde doğrudan açılır, B tipinde sinüs duvarına sıkıca yapışık bir süre ilerler, C tipinde önce yandaki toplardamar gölüne (venöz lakün) girer. Ağızda A tipinde kapakçık benzeri lifli kordonlar, B tipinde ince bantlar (trabeküller), C tipinde araknoid granülasyonlar bulunur (Ye ve ark., 2024). Yüzdeler 86 hastanın MR görüntülerinden, duvar kalınlıkları 10 kadavradan elde edildi.',
    not: 'Önden bakış; sinüsün bir yan köşesi yakından. Şema; oranlar yaklaşıktır.',
  },
  bebek: {
    baslik: 'Erişkin ve bebek köprüleri',
    metin:
      'Erişkin köprüsünü çoğu kez destekleyici zar dokusu sarar (Cheshire ve ark., 2024). Bebek ve küçük çocukta bu destek yok ya da çok azdır (Cheshire ve ark., 2024). Bebek köprülerinin duvarı daha incedir: bazılarında yalnızca 5–7 mikrometredir (Cheshire ve ark., 2024). Sayımlar farklı yöntemlerle yapıldı: erişkinde üst sagital sinüse açılanlar, bebekte beyin ile sert zar arasındaki köprüler sayıldı (Juskys ve ark., 2022; Cheshire ve ark., 2018).',
    not: 'Bir köprünün sert zar ile beyin arasındaki bölümü. Şema; ölçeksiz.',
  },
  kronik: {
    baslik: 'Kronik subdural kanama: iki zar arasındaki kan',
    metin:
      'Kan, sert zarın sınır hücre katmanında açılan yarıkta birikir ve iki zarla çevrilir (Edlmann ve ark., 2017). Kanın nereden başladığı tartışmalıdır. Bir derlemeye göre ilk kanama köprü toplardamarından gelir (Nouri ve ark., 2021). Bir başka derlemeye göre süreci kanamadan çok sınır hücrelerinin hasarı başlatabilir (Edlmann ve ark., 2017). Damarlı dış zar sert zara sıkı yapışır, ince iç zar ise örümcek ağı zara gevşek tutunur (Kim ve ark., 2024). Sert zarı besleyen orta meningeal atardamarı tıkamak (embolizasyon), zarlardaki yeni damarları kurutmayı amaçlar (Chen ve ark., 2024). Büyük çalışmaların sonuçları farklı olduğu için yararı henüz kesinleşmemiştir (Gillespie ve ark., 2025).',
    not: 'Önden bakış (koronal kesit): bir yarımkürenin kubbesi, orta hat sağda. Şema; oranlar yaklaşıktır.',
  },
};

const ATROFI = {
  gerilme: {
    baslik: 'Beyin küçülünce köprü gerilir',
    metin:
      'Yaşlanan beyinde hacim azalır (atrofi) ve sert zar ile beyin arasındaki aralık genişler (Pierre ve ark., 2026). Köprü toplardamarları gerilir ve yırtılmaya daha yatkın hâle gelir (Pierre ve ark., 2026). Bebekte de geniş aralık köprüyü gerilmeye ve yırtılmaya yatkın kılar (Araki ve ark., 2017).',
  },
  yirtilma: {
    baslik: 'Köprü yırtılınca: subdural kanama',
    metin:
      'Küçük bir travmanın kayma kuvveti bile sert zarın sınır hücre katmanını yarabilir (Ishikawa ve ark., 2026). Yırtılan köprüden çıkan kan bu zayıf katmana dolar ve normalde olmayan bir aralık açar (Joost ve ark., 2026). Kanın sert zar ile örümcek ağı zar arasında birikmesine subdural kanama denir (Pierre ve ark., 2026). Yaşlılarda düşmeler, beyin küçülmesi ve kan sulandırıcı ilaçlar riski artırır (Manivannan ve ark., 2021).',
  },
  not: 'Önden bakış (koronal kesit): tepe yukarıda, orta hat ortada. Şema; oranlar yaklaşıktır.',
};

const HIZ = 1 / 3800; // birim / ms: her aşama yaklaşık 4 saniye

export function KopruToplardamarlari() {
  const azalt = useHareketAzaltilmis();
  const [kapRef, gorunur] = useGorunur<HTMLDivElement>();
  const [g, setG] = useState<Gorunum>('kopru');
  const [hedef, setHedef] = useState(0);
  const [p, setP] = useState(0);
  useKare(g === 'atrofi' && p !== hedef && gorunur && !azalt, (dt) => {
    setP((o) => (o < hedef ? Math.min(hedef, o + dt * HIZ) : Math.max(hedef, o - dt * HIZ)));
  });
  const pg = azalt ? hedef : p;
  const s = Math.min(1, pg);
  const r = Math.max(0, pg - 1);
  const asama2 = r > 0.02;

  const degis = (y: Gorunum) => {
    setG(y);
    setHedef(0);
    setP(0);
  };
  const git = (h: number) => {
    setHedef(h);
    if (azalt) setP(h);
  };

  const b = g === 'atrofi' ? { ...(asama2 ? ATROFI.yirtilma : ATROFI.gerilme), not: ATROFI.not } : BILGI[g];

  return (
    <div ref={kapRef} className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={g}
        onDegis={degis}
        secenekler={[
          { d: 'kopru', ad: 'Köprü' },
          { d: 'tipler', ad: 'Giriş tipleri' },
          { d: 'bebek', ad: 'Erişkin ve bebek' },
          { d: 'atrofi', ad: 'Beyin küçülünce' },
          { d: 'kronik', ad: 'Kronik subdural kanama' },
        ]}
      />
      {g === 'atrofi' && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Canlandırma">
          <button type="button" className="beyin-secenek" aria-pressed={hedef === 1} onClick={() => git(1)}>
            1. Beyin küçülsün
          </button>
          <button type="button" className="beyin-secenek" aria-pressed={hedef === 2} onClick={() => git(2)}>
            2. Hafif çarpma
          </button>
          <button
            type="button"
            className="beyin-secenek"
            onClick={() => {
              setHedef(0);
              setP(0);
            }}
          >
            Başa al
          </button>
        </div>
      )}
      {(g === 'kopru' || g === 'atrofi') && <Kesit s={g === 'kopru' ? 0 : s} r={g === 'kopru' ? 0 : r} mod={g} />}
      {g === 'tipler' && <Tipler />}
      {g === 'bebek' && <EriskinBebek />}
      {g === 'kronik' && <Kronik />}
      <div aria-live="polite" className="flex flex-col gap-1">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
      <p className="t-meta text-ink-3">{b.not}</p>
    </div>
  );
}
