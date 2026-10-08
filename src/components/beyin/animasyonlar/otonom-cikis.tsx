'use client';

import { useRef, useState } from 'react';
import { Secenekler, useGorunur, useHareketAzaltilmis, useKare, yolNoktasi } from './ortak';

/**
 * Otonom sistemin çıkış yolları: solda nöronların gövdelerinin bulunduğu düzeyler (sempatik T1–L2; parasempatik
 * III, VII, IX, X. kafa sinirleri ve S2–S4), sağda iki nöronlu zincir ve her sinapsta salınan haberci ile almaç.
 * Dört durum: sempatik, ter bezi istisnası, böbrek üstü bezi ve parasempatik. Kaynak: OpenStax A&P 2e 15.1–15.2;
 * Wulf ve Tom (2023); Dafny (UTHealth); Pop-Busui (2010).
 */

type Durum = 'sempatik' | 'ter' | 'bobrek' | 'parasempatik';

const SEMPATIK = '#ef5d7b';
const PARASEMPATIK = '#25a993';

interface Zincir {
  /** Preganglionik ve postganglionik yolların SVG çizgileri. */
  pre: string;
  post: string;
  gangliyonX: number;
  gangliyonAdi: string;
  sinaps1: string;
  sinaps2: string;
  hedef: string;
  renk: string;
  bilgi: string;
}

const ZINCIRLER: Record<Durum, Zincir> = {
  sempatik: {
    pre: 'M58,92 L118,92',
    post: 'M130,92 L330,92',
    gangliyonX: 124,
    gangliyonAdi: 'zincir ya da kolateral gangliyon',
    sinaps1: 'ACh → nikotinik',
    sinaps2: 'noradrenalin → α / β adrenerjik',
    hedef: 'organ (ör. kalp)',
    renk: SEMPATIK,
    bilgi:
      'Gövde omuriliğin T1–L2 bölümlerinin yan boynuzunda. Kısa ve miyelinli preganglionik lif zincir (paravertebral) ya da kolateral (prevertebral) gangliyona gider, asetilkolin (ACh) salar; gangliyon nöronundaki almaç nikotiniktir. Uzun ve miyelinsiz postganglionik lif organda noradrenalin salar; almaç α ya da β adrenerjiktir. Tek bir preganglionik nöron 10–20 hedefe uzanabildiği için sempatik yanıt yaygındır.',
  },
  ter: {
    pre: 'M58,92 L118,92',
    post: 'M130,92 L330,92',
    gangliyonX: 124,
    gangliyonAdi: 'zincir gangliyonu',
    sinaps1: 'ACh → nikotinik',
    sinaps2: 'ACh → muskarinik',
    hedef: 'ter bezi',
    renk: SEMPATIK,
    bilgi:
      'İstisna: Ter bezlerine (ve iskelet kasındaki bazı damarlara) giden sempatik postganglionik lifler noradrenalin değil asetilkolin salar; ter bezlerindeki almaç muskariniktir. Ter bezlerine parasempatik lif gelmez: terlemeyi yalnızca sempatik kol yönetir.',
  },
  bobrek: {
    pre: 'M58,92 L300,92',
    post: 'M318,108 L318,170',
    gangliyonX: 310,
    gangliyonAdi: 'böbrek üstü bezinin medullası',
    sinaps1: 'ACh → nikotinik',
    sinaps2: 'adrenalin + noradrenalin → kana',
    hedef: 'kan dolaşımı',
    renk: SEMPATIK,
    bilgi:
      'Böbrek üstü bezinin iç kısmı (medulla) işlevce bir sempatik gangliyondur: preganglionik lif doğrudan kromafin hücrelerine ulaşır (ACh → nikotinik). Kromafin hücreler sinir ucu gibi değil, bez gibi davranır: adrenalini ve noradrenalini kana verir. Bu yüzden etkileri hormon etkisidir ve bütün bedene yayılır. Kromafin hücreler, gangliyon nöronları gibi, sinir kabartısından (nöral krest) gelişir.',
  },
  parasempatik: {
    pre: 'M58,92 L290,92',
    post: 'M302,92 L330,92',
    gangliyonX: 296,
    gangliyonAdi: 'terminal ya da intramural gangliyon',
    sinaps1: 'ACh → nikotinik',
    sinaps2: 'ACh → muskarinik',
    hedef: 'organ (ör. kalp)',
    renk: PARASEMPATIK,
    bilgi:
      'Gövdeler beyin sapında (III, VII, IX ve X. kafa sinirleriyle çıkar) ve omuriliğin S2–S4 bölümlerinde. Uzun preganglionik lif organın yanındaki ya da duvarının içindeki (terminal, intramural) gangliyona gider; ACh → nikotinik. Kısa postganglionik lif de ACh salar; organdaki almaç muskariniktir. Vagus siniri (X) parasempatik etkinliğin yaklaşık %75’ini taşır.',
  },
};

/** Sol şema: beyin sapı ve omurilik bölümleri; seçili kolun çıkış düzeyleri boyanır. */
function Duzeyler({ durum }: { durum: Durum }) {
  const segmentler: { ad: string; bolge: 'C' | 'T' | 'L' | 'S' }[] = [
    ...Array.from({ length: 8 }, (_, i) => ({ ad: `C${i + 1}`, bolge: 'C' as const })),
    ...Array.from({ length: 12 }, (_, i) => ({ ad: `T${i + 1}`, bolge: 'T' as const })),
    ...Array.from({ length: 5 }, (_, i) => ({ ad: `L${i + 1}`, bolge: 'L' as const })),
    ...Array.from({ length: 5 }, (_, i) => ({ ad: `S${i + 1}`, bolge: 'S' as const })),
  ];
  const sempatikMi = durum !== 'parasempatik';
  const boyali = (ad: string) => {
    if (sempatikMi) {
      const T = /^T\d+$/.test(ad);
      return T || ad === 'L1' || ad === 'L2';
    }
    return ad === 'S2' || ad === 'S3' || ad === 'S4';
  };
  const renk = sempatikMi ? SEMPATIK : PARASEMPATIK;
  const y0 = 92;
  const h = 10.4;
  return (
    <svg viewBox="0 0 150 420" className="mx-auto h-[26rem] w-auto max-w-full" role="img" aria-label={sempatikMi ? 'Sempatik çıkış: T1–L2' : 'Parasempatik çıkış: beyin sapı ve S2–S4'}>
      {/* Beyin sapı */}
      <path d="M52,14 Q75,4 98,14 L94,78 Q75,86 56,78 Z" fill="var(--surface-2)" stroke="var(--rule-strong)" strokeWidth="1.4" />
      <text x="75" y="44" textAnchor="middle" fontSize="9" fill="var(--ink-3)">
        beyin
      </text>
      <text x="75" y="55" textAnchor="middle" fontSize="9" fill="var(--ink-3)">
        sapı
      </text>
      {['III', 'VII', 'IX', 'X'].map((k, i) => (
        <g key={k} opacity={sempatikMi ? 0.25 : 1} style={{ transition: 'opacity .4s' }}>
          <circle cx={98} cy={22 + i * 15} r="4" fill={PARASEMPATIK} />
          <text x={106} y={25.5 + i * 15} fontSize="9.5" fontWeight="700" fill="var(--ink)">
            {k}
          </text>
        </g>
      ))}
      {/* Omurilik bölümleri */}
      {segmentler.map((s, i) => {
        const y = y0 + i * h;
        const b = boyali(s.ad);
        return (
          <g key={s.ad}>
            <rect x="62" y={y} width="26" height={h - 1.6} rx="2.5" fill={b ? renk : 'var(--surface-2)'} opacity={b ? 0.9 : 1} stroke="var(--rule-strong)" strokeWidth="0.6" style={{ transition: 'fill .4s' }} />
            {['C1', 'C8', 'T1', 'T6', 'T12', 'L1', 'L2', 'L5', 'S2', 'S4'].includes(s.ad) && (
              <text x="56" y={y + 7.4} textAnchor="end" fontSize="8" fill={b ? 'var(--ink)' : 'var(--ink-3)'} fontWeight={b ? 700 : 400}>
                {s.ad}
              </text>
            )}
          </g>
        );
      })}
      <text x="96" y={sempatikMi ? y0 + 8 * h + 6 * h : y0 + 26 * h} fontSize="9" fontWeight="700" fill={renk}>
        {sempatikMi ? 'T1–L2' : 'S2–S4'}
      </text>
      <text x="96" y={sempatikMi ? y0 + 8 * h + 6 * h + 11 : y0 + 26 * h + 11} fontSize="8.5" fill="var(--ink-2)">
        yan boynuz
      </text>
    </svg>
  );
}

function Hedef({ durum }: { durum: Durum }) {
  if (durum === 'bobrek')
    return (
      <g>
        <rect x="292" y="172" width="70" height="20" rx="10" fill="#f4c2c2" stroke="#d9473c" strokeWidth="1.2" />
        <text x="327" y="186" textAnchor="middle" fontSize="9.5" fill="#8f1d1d">
          kan
        </text>
      </g>
    );
  if (durum === 'ter')
    return <path d="M344,74 Q356,92 344,106 Q332,92 344,74 Z" fill="#5aa6e6" stroke="#2f7cc4" strokeWidth="1.2" />;
  return <path d="M344,108 C318,94 322,74 336,76 C341,77 344,81 344,83 C344,81 347,77 352,76 C366,74 370,94 344,108 Z" fill="#ef5d7b" />;
}

export function OtonomCikis() {
  const azalt = useHareketAzaltilmis();
  const [kapRef, gorunur] = useGorunur<HTMLDivElement>();
  const [durum, setDurum] = useState<Durum>('sempatik');
  const [nokta, setNokta] = useState<{ x: number; y: number; evre: 0 | 1 } | null>(null);
  const preRef = useRef<SVGPathElement>(null);
  const postRef = useRef<SVGPathElement>(null);
  const z = ZINCIRLER[durum];
  useKare(gorunur && !azalt, (_dt, toplam) => {
    const t = (toplam / 3200) % 1;
    if (t < 0.55) setNokta({ ...yolNoktasi(preRef.current, t / 0.55), evre: 0 });
    else setNokta({ ...yolNoktasi(postRef.current, (t - 0.55) / 0.45), evre: 1 });
  });

  return (
    <div ref={kapRef} className="flex flex-col gap-4">
      <Secenekler
        etiket="Otonom yol"
        deger={durum}
        onDegis={setDurum}
        secenekler={[
          { d: 'sempatik', ad: 'Sempatik' },
          { d: 'ter', ad: 'Ter bezi: istisna' },
          { d: 'bobrek', ad: 'Böbrek üstü bezi' },
          { d: 'parasempatik', ad: 'Parasempatik' },
        ]}
      />
      <div className="grid items-start gap-5 md:grid-cols-[10rem_minmax(0,1fr)]">
        <Duzeyler durum={durum} />
        <div className="flex flex-col gap-3">
          <svg viewBox="0 0 380 205" className="w-full" role="img" aria-label={`${z.sinaps1}; ${z.sinaps2}`}>
            {/* Merkezî sinir sistemi */}
            <rect x="6" y="66" width="52" height="52" rx="10" fill="var(--surface-2)" stroke="var(--rule-strong)" strokeWidth="1.2" />
            <text x="32" y="86" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
              MSS
            </text>
            <circle cx="40" cy="102" r="7" fill={z.renk} />
            <text x="32" y="134" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
              gövde
            </text>
            {/* Lifler */}
            <path d={z.pre} stroke={z.renk} strokeWidth="5" strokeLinecap="round" fill="none" style={{ transition: 'all .5s' }} />
            <path d={z.post} stroke={z.renk} strokeWidth="2.4" strokeLinecap="round" fill="none" strokeDasharray={durum === 'bobrek' ? '4 4' : undefined} style={{ transition: 'all .5s' }} />
            <path ref={preRef} d={z.pre} fill="none" stroke="none" />
            <path ref={postRef} d={z.post} fill="none" stroke="none" />
            {/* Gangliyon */}
            {durum === 'bobrek' ? (
              <ellipse cx={z.gangliyonX + 8} cy="92" rx="26" ry="16" fill="#f6d58a" stroke="#c98f1b" strokeWidth="1.2" />
            ) : (
              <circle cx={z.gangliyonX} cy="92" r="11" fill={`color-mix(in srgb, ${z.renk} 35%, white)`} stroke={z.renk} strokeWidth="1.4" />
            )}
            <Hedef durum={durum} />
            {/* Etiketler */}
            <text x={durum === 'sempatik' || durum === 'ter' ? 70 : 110} y="80" fontSize="10.5" fill="var(--ink-3)">
              preganglionik
            </text>
            {durum !== 'bobrek' && (
              <text x={durum === 'parasempatik' ? 302 : 196} y={durum === 'parasempatik' ? 122 : 80} fontSize="10.5" fill="var(--ink-3)" textAnchor={durum === 'parasempatik' ? 'middle' : 'start'}>
                postganglionik
              </text>
            )}
            <text x={durum === 'parasempatik' ? 250 : Math.min(z.gangliyonX + 6, 300)} y={durum === 'parasempatik' ? 138 : durum === 'bobrek' ? 124 : 122} textAnchor="middle" fontSize="10.5" fill="var(--ink-2)">
              {z.gangliyonAdi}
            </text>
            <g opacity={nokta?.evre === 0 ? 0.6 : 1}>
              <rect x={Math.min(z.gangliyonX - 64, 230)} y="36" width="128" height="24" rx="12" fill="var(--surface)" stroke={z.renk} strokeWidth="1.2" />
              <text x={Math.min(z.gangliyonX, 294)} y="52" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
                {z.sinaps1}
              </text>
            </g>
            <g opacity={nokta?.evre === 1 ? 1 : 0.6}>
              <rect x={durum === 'bobrek' ? 70 : 128} y={durum === 'bobrek' ? 166 : 152} width={durum === 'bobrek' ? 214 : 244} height="26" rx="13" fill="var(--surface)" stroke={z.renk} strokeWidth="1.2" />
              <text x={durum === 'bobrek' ? 177 : 250} y={durum === 'bobrek' ? 183 : 169} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
                {z.sinaps2}
              </text>
            </g>
            <text x="372" y={durum === 'bobrek' ? 160 : 66} textAnchor="end" fontSize="10.5" fill="var(--ink-2)">
              {z.hedef}
            </text>
            {nokta && <circle cx={nokta.x} cy={nokta.y} r="4.5" fill="#fff" stroke={z.renk} strokeWidth="2.4" />}
          </svg>
          <p className="text-[0.98rem]" aria-live="polite">
            {z.bilgi}
          </p>
        </div>
      </div>
    </div>
  );
}
