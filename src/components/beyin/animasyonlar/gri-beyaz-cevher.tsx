'use client';

import { useRef, useState } from 'react';
import { useGorunur, useHareketAzaltilmis, useKare, yolNoktasi } from './ortak';

/**
 * Gri ve beyaz cevher: kabuktaki (gri cevher) nöron gövdelerinden çıkan aksonlar, miyelinle sarılı olarak beyaz
 * cevherden geçer. Kimi komşu kıvrıma, kimi aşağıya, beyin sapı ve omuriliğe gider. Sinyaller aksonlar boyunca akar.
 */

const DIS = 'M0,84 C30,30 150,12 164,120 Q180,176 196,120 C210,12 330,30 360,84';
const IC = 'M0,114 C34,64 140,46 150,126 Q180,206 210,126 C220,46 326,64 360,114';

const NORONLAR = [
  { x: 64, y: 70 },
  { x: 108, y: 58 },
  { x: 252, y: 58 },
  { x: 296, y: 70 },
];

const AKSONLAR = [
  { d: 'M64,80 C66,150 62,210 60,262', ad: 'asagi' },
  { d: 'M108,68 C112,214 248,214 252,68', ad: 'u' },
  { d: 'M296,80 C300,150 318,214 330,262', ad: 'asagi' },
];

export function GriBeyazCevher() {
  const azalt = useHareketAzaltilmis();
  const [kapRef, gorunur] = useGorunur<HTMLDivElement>();
  const [miyelin, setMiyelin] = useState(true);
  const yollar = useRef<(SVGPathElement | null)[]>([]);
  const [noktalar, setNoktalar] = useState<{ x: number; y: number }[]>([]);
  useKare(gorunur && !azalt, (_dt, toplam) => {
    const t = toplam / 1000;
    setNoktalar(AKSONLAR.flatMap((_, i) => [0, 0.5].map((faz) => yolNoktasi(yollar.current[i] ?? null, (t * 0.32 + faz + i * 0.17) % 1))));
  });

  return (
    <div ref={kapRef} className="grid items-center gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <svg viewBox="0 0 360 262" className="w-full" role="img" aria-label="Beyin kabuğunun kesiti: dışta gri cevher, içte beyaz cevher">
        <defs>
          <clipPath id="gb-beyaz">
            <path d={`${IC} L360,262 L0,262 Z`} />
          </clipPath>
        </defs>
        <rect width="360" height="262" fill="var(--surface)" />
        <path d={`${DIS} L360,262 L0,262 Z`} fill="#c49a92" />
        <path d={`${IC} L360,262 L0,262 Z`} fill="#f4eee4" />
        <path d={DIS} fill="none" stroke="#a87b73" strokeWidth="1.5" />

        {/* Aksonlar ve miyelin */}
        {AKSONLAR.map((a, i) => (
          <g key={a.d}>
            <path ref={(el) => void (yollar.current[i] = el)} d={a.d} fill="none" stroke="#56627e" strokeWidth="2" />
            {miyelin && (
              <path d={a.d} fill="none" stroke="#ffffff" strokeWidth="7" strokeDasharray="15 4" strokeLinecap="butt" clipPath="url(#gb-beyaz)" opacity="0.95" />
            )}
            {miyelin && <path d={a.d} fill="none" stroke="#56627e" strokeWidth="1.2" clipPath="url(#gb-beyaz)" />}
          </g>
        ))}

        {/* Nöron gövdeleri ve dendritler */}
        {NORONLAR.map((n) => (
          <g key={`${n.x}`}>
            <path d={`M${n.x},${n.y - 7} L${n.x},${n.y - 26} M${n.x},${n.y - 16} l-7,-7 M${n.x},${n.y - 20} l7,-6`} stroke="#6b3f39" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d={`M${n.x},${n.y - 8} L${n.x + 7},${n.y + 6} L${n.x - 7},${n.y + 6} Z`} fill="#6b3f39" />
          </g>
        ))}

        {/* Akan sinyaller */}
        {!azalt && noktalar.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.6" fill="#ffcf4a" stroke="#fff" strokeWidth="1" />)}

        <text x="12" y="20" fontSize="12" fontWeight="700" fill="var(--ink)">
          kıvrım (girus)
        </text>
        <text x="186" y="40" fontSize="12" fontWeight="700" fill="var(--ink)" textAnchor="middle">
          oluk (sulkus)
        </text>
        <line x1="180" y1="46" x2="180" y2="118" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
        <text x="72" y="250" fontSize="11.5" fill="#3a4357">
          ↓ beyin sapına ve omuriliğe
        </text>
        <text x="182" y="230" fontSize="11.5" fill="#3a4357" textAnchor="middle">
          komşu kıvrıma (U lifi)
        </text>
      </svg>
      <div className="flex flex-col gap-3 text-[0.98rem]">
        <p className="flex items-start gap-2">
          <span className="mt-1.5 size-3 shrink-0 rounded-sm" style={{ background: '#c49a92' }} aria-hidden="true" />
          <span>
            <b>Gri cevher</b>: nöronların gövdeleri ve dendritleri. Beyinde en dışta, kabukta (korteks) bulunur.
          </span>
        </p>
        <p className="flex items-start gap-2">
          <span className="mt-1.5 size-3 shrink-0 rounded-sm border border-rule-strong" style={{ background: '#f4eee4' }} aria-hidden="true" />
          <span>
            <b>Beyaz cevher</b>: aksonlar. Onları saran yağdan zengin miyelin kılıfı bu bölgeye beyaz rengini verir.
          </span>
        </p>
        <label className="beyin-onay">
          <input type="checkbox" checked={miyelin} onChange={(e) => setMiyelin(e.target.checked)} />
          <span>Miyelin kılıfını göster</span>
        </label>
      </div>
    </div>
  );
}
