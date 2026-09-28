'use client';

import { useId, useState } from 'react';
import { ScaleRuler } from '@/components/report/scale-ruler';

const nf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

/**
 * Güvenirlik ile ölçüm payı arasındaki ilişkiyi gösteren etkileşimli örnek.
 * Ölçmenin standart hatası = SS × √(1 − α); %90 aralık = puan ± 1,645 × SH.
 */
export function ReliabilityDemo() {
  const [alpha, setAlpha] = useState(0.8);
  const [score, setScore] = useState(3.6);
  const idA = useId();
  const idS = useId();
  const sd = 0.7;
  const sem = sd * Math.sqrt(1 - alpha);
  const half = 1.6449 * sem;
  const lo = Math.max(1, score - half);
  const hi = Math.min(5, score + half);

  return (
    <div className="panel flex flex-col gap-6 p-6 md:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={idA} className="field-label">
            Testin güvenirliği (α): <span className="tabular">{nf.format(alpha)}</span>
          </label>
          <input
            id={idA}
            type="range"
            min={0.5}
            max={0.95}
            step={0.01}
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-[var(--ink)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={idS} className="field-label">
            Öğrencinin puanı: <span className="tabular">{nf.format(score)}</span>
          </label>
          <input
            id={idS}
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-[var(--ink)]"
          />
        </div>
      </div>
      <ScaleRuler
        min={1}
        max={5}
        value={score}
        ciLow={lo}
        ciHigh={hi}
        majorStep={1}
        minorStep={0.25}
        srLabel={`Puan ${nf.format(score)}, ölçüm payı ${nf.format(lo)} ile ${nf.format(hi)} arası`}
      />
      <p className="measure" aria-live="polite">
        Bu güvenirlikte ölçüm payı yaklaşık <strong className="tabular">±{nf.format(half)}</strong> puan. Yani öğrencinin “gerçek” puanı
        büyük olasılıkla <strong className="tabular">{nf.format(lo)}</strong> ile <strong className="tabular">{nf.format(hi)}</strong> arasında.
        Güvenirlik düştükçe sarı bant genişler ve sonuçtan çıkarılabilecek yorum azalır.
      </p>
    </div>
  );
}
