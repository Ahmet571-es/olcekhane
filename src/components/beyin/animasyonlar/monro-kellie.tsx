'use client';

import { useState } from 'react';
import { useGorunur, useHareketAzaltilmis, useKare } from './ortak';

/**
 * Monro–Kellie ilkesi ve basınç–hacim eğrisi. Kafatası sabit hacimli bir kutudur: beyin, kan ve beyin-omurilik sıvısı
 * (BOS). Kutuya bir kitle (kanama, tümör, ödem) eklendikçe önce BOS ve toplardamar kanı dışarı itilerek denge korunur;
 * bu tampon tükenince kafa içi basıncı (KİB) hızla, üstel bir eğriyle yükselir. Eğri şematiktir: eşikler kaynaklarda
 * verilen yetişkin değerleridir (normal 7–15 mmHg; tedaviye başlama eşiği 22 mmHg; perfüzyon basıncı hedefi 60–70).
 * Kaynak: Bothwell ve ark. (2019); Canac ve ark. (2020); Schizodimos ve ark. (2020); Wilson (2016).
 */

const OAB = 90; // örnek ortalama arter basıncı (mmHg)

/** Şematik basınç–hacim eğrisi: v 0–1 arası eklenen hacim, sonuç mmHg. */
function kib(v: number): number {
  return 10 + (50 / (Math.exp(5) - 1)) * (Math.exp(5 * v) - 1);
}

function evre(v: number): { ad: string; metin: string; renk: string } {
  if (v < 0.45)
    return {
      ad: 'Dengeleme',
      metin:
        'Kitle büyürken beyin-omurilik sıvısı ve toplardamar kanı yerinden itilerek kafatasının dışına çıkar ve yer açar. Toplam hacim değişmediği için basınç pek artmaz.',
      renk: '#25a993',
    };
  if (v < 0.75)
    return {
      ad: 'Tampon tükeniyor',
      metin: 'Dışarı itilecek sıvı azaldı. Aynı miktarda ek hacim artık basıncı öncekinden çok daha fazla yükseltir: eğri dikleşir.',
      renk: '#e0a32e',
    };
  return {
    ad: 'Dekompansasyon',
    metin:
      'Basınç hızla yükselir ve beyin perfüzyon basıncı düşer. Beyin dokusu bir bölmeden ötekine itilebilir (herniasyon). Geç ve kötü bir belirti Cushing üçlüsüdür: çok yüksek kan basıncı, yavaş nabız, düzensiz solunum.',
    renk: '#d9473c',
  };
}

export function MonroKellie() {
  const azalt = useHareketAzaltilmis();
  const [kapRef, gorunur] = useGorunur<HTMLDivElement>();
  const [v, setV] = useState(0.2);
  const [oynuyor, setOynuyor] = useState(false);
  useKare(oynuyor && gorunur && !azalt, (dt) => {
    const y = v + dt / 9000;
    if (y >= 1) {
      setV(1);
      setOynuyor(false);
    } else setV(y);
  });

  const p = kib(v);
  const bpb = OAB - p;
  const e = evre(v);
  // Bölmelerin genişliği: BOS önce, sonra toplardamar kanı azalır; kitle büyür.
  const bos = Math.max(0.12, 1 - v / 0.55) * 34;
  const kan = Math.max(0.35, 1 - Math.max(0, v - 0.3) / 0.6) * 34;
  const kitle = v * 70;
  const beyin = 240 - 40 - bos - kan - kitle;
  const sikisma = Math.max(0, v - 0.78) * 60;

  // Eğri çizimi
  const X0 = 40;
  const X1 = 330;
  const Y0 = 190;
  const Y1 = 20;
  const ex = (x: number) => X0 + x * (X1 - X0);
  const ey = (mm: number) => Y0 - (Math.min(mm, 62) / 62) * (Y0 - Y1);
  let egri = '';
  for (let i = 0; i <= 60; i++) {
    const x = i / 60;
    egri += `${i === 0 ? 'M' : 'L'}${ex(x).toFixed(1)},${ey(kib(x)).toFixed(1)} `;
  }

  return (
    <div ref={kapRef} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1">
          <span className="t-small text-ink-2">Kafa içine eklenen hacim (kanama, tümör ya da ödem)</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={v}
            onChange={(ev) => {
              setOynuyor(false);
              setV(Number(ev.target.value));
            }}
            className="beyin-kaydirac"
          />
        </label>
        {!azalt && (
          <button
            type="button"
            className="beyin-secenek"
            onClick={() => {
              if (v >= 0.99) setV(0);
              setOynuyor((o) => !o);
            }}
          >
            {oynuyor ? 'Durdur' : 'Kitle büyüsün'}
          </button>
        )}
      </div>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <svg viewBox="0 0 260 200" className="w-full" role="img" aria-label={`Kafatası bölmeleri; kafa içi basıncı ${Math.round(p)} mmHg`}>
          <rect x="6" y="20" width="248" height="150" rx="40" fill="#efe7d5" stroke="#cdbf9f" strokeWidth="3" />
          <g transform="translate(16 32)">
            <rect x="0" y="0" width={beyin} height="126" rx="22" fill="#e8b7ab" style={{ transition: 'width .2s' }} />
            <text x={beyin / 2} y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7a3a33">
              beyin
            </text>
            <rect x={beyin + 2} y="0" width={kan} height="126" rx="6" fill="#5b84f2" opacity="0.85" />
            {kan >= 16 && (
              <text x={beyin + 2 + kan / 2} y="138" textAnchor="middle" fontSize="8.5" fill="var(--ink-2)">
                kan
              </text>
            )}
            <rect x={beyin + 4 + kan} y="0" width={bos} height="126" rx="6" fill="#9cc9f0" />
            {bos >= 16 && (
              <text x={beyin + 4 + kan + bos / 2} y="138" textAnchor="middle" fontSize="8.5" fill="var(--ink-2)">
                BOS
              </text>
            )}
            <rect x={beyin + 6 + kan + bos} y={12} width={Math.max(0, kitle)} height="102" rx="14" fill="#8f1d1d" />
            {kitle > 26 && (
              <text x={beyin + 6 + kan + bos + kitle / 2} y="68" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">
                kitle
              </text>
            )}
          </g>
          {/* Dışarı itilen BOS ve kan; herniasyon */}
          <path d="M130,170 L130,192" stroke="#9cc9f0" strokeWidth="5" strokeLinecap="round" opacity={v > 0.05 ? 1 : 0.2} />
          <path d="M122,186 L130,196 L138,186" fill="none" stroke="#9cc9f0" strokeWidth="3" opacity={v > 0.05 ? 1 : 0.2} />
          {sikisma > 0 && (
            <g>
              <path d={`M60,150 Q70,${166 + sikisma * 0.6} 80,150`} fill="#e8b7ab" stroke="#d9473c" strokeWidth="1.5" />
              <text x="86" y="190" fontSize="8.5" fontWeight="700" fill="#d9473c">
                herniasyon
              </text>
            </g>
          )}
          <text x="130" y="14" textAnchor="middle" fontSize="9" fill="var(--ink-3)">
            kafatası: hacmi sabit
          </text>
        </svg>
        <svg viewBox="0 0 340 215" className="w-full" role="img" aria-label="Basınç–hacim eğrisi">
          {/* Bantlar */}
          <rect x={X0} y={ey(15)} width={X1 - X0} height={ey(7) - ey(15)} fill="#25a993" opacity="0.14" />
          <text x={X1 - 2} y={ey(11) + 3} textAnchor="end" fontSize="8.5" fill="#1b7a6a">
            normal 7–15
          </text>
          <line x1={X0} x2={X1} y1={ey(22)} y2={ey(22)} stroke="#e0a32e" strokeDasharray="5 4" />
          <text x={X0 + 4} y={ey(22) - 4} fontSize="8.5" fill="#9a6a10">
            22: tedavi eşiği (kafa travması)
          </text>
          <line x1={X0} x2={X1} y1={ey(40)} y2={ey(40)} stroke="#d9473c" strokeDasharray="2 4" />
          <text x={X0 + 4} y={ey(40) - 4} fontSize="8.5" fill="#a5281d">
            40: yaşamı tehdit eder
          </text>
          {/* Eksenler */}
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="var(--ink-3)" />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="var(--ink-3)" />
          {[0, 20, 40, 60].map((m) => (
            <text key={m} x={X0 - 6} y={ey(m) + 3} textAnchor="end" fontSize="8.5" fill="var(--ink-3)">
              {m}
            </text>
          ))}
          <text x={X0 - 30} y={Y1 - 6} fontSize="8.5" fill="var(--ink-3)">
            KİB (mmHg)
          </text>
          <text x={X1} y={Y0 + 16} textAnchor="end" fontSize="8.5" fill="var(--ink-3)">
            eklenen hacim →
          </text>
          <path d={egri} fill="none" stroke="var(--ink)" strokeWidth="2.2" />
          <circle cx={ex(v)} cy={ey(p)} r="6" fill={e.renk} stroke="#fff" strokeWidth="2" />
        </svg>
      </div>
      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        <div className="beyin-kutu flex flex-col gap-1">
          <p className="t-small text-ink-2">Kafa içi basıncı (KİB)</p>
          <p className="font-display text-2xl font-bold">{Math.round(p)} mmHg</p>
        </div>
        <div className="beyin-kutu flex flex-col gap-1">
          <p className="t-small text-ink-2">Beyin perfüzyon basıncı = {OAB} − KİB</p>
          <p className="font-display text-2xl font-bold" style={{ color: bpb < 60 ? '#d9473c' : undefined }}>
            {Math.round(bpb)} mmHg
          </p>
        </div>
        <div className="beyin-kutu flex flex-col gap-1">
          <p className="t-small text-ink-2">Evre</p>
          <p className="font-display text-2xl font-bold" style={{ color: e.renk }}>
            {e.ad}
          </p>
        </div>
      </div>
      <p className="text-[0.98rem]">{e.metin}</p>
      <p className="t-meta">
        Eğri şematiktir; gerçek eğri kişiden kişiye değişir. Örnekte ortalama arter basıncı {OAB} mmHg alındı. Ağır kafa
        travması geçiren yetişkinde perfüzyon basıncı için önerilen hedef aralık 60–70 mmHg’dir.
      </p>
    </div>
  );
}
