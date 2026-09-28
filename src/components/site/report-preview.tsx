'use client';

import { useState } from 'react';
import { besFaktorReport } from '@/content/reports/bes-faktor';
import { besFaktor } from '@/content/instruments/bes-faktor';
import { ScaleRuler } from '@/components/report/scale-ruler';
import type { Band } from '@/lib/instruments/types';

/** Ana sayfadaki örnek rapor. Veriler örnektir; gerçek bir öğrenciye ait değildir. */
const SAMPLE: Record<string, { value: number; band: Band }> = {
  extraversion: { value: 2.4, band: 'low' },
  agreeableness: { value: 3.9, band: 'high' },
  conscientiousness: { value: 3.1, band: 'average' },
  emotional_stability: { value: 2.9, band: 'average' },
  intellect: { value: 4.4, band: 'very_high' },
};

export function ReportPreview() {
  const [audience, setAudience] = useState<'parent' | 'student'>('parent');
  const [focus, setFocus] = useState('intellect');
  const scale = besFaktor.scales.find((s) => s.key === focus)!;
  const bt = besFaktorReport.scales[focus][SAMPLE[focus].band]!;
  const text = audience === 'parent' ? bt.parent.replace('Çocuğunuz', 'Deniz') : bt.student;
  const tips = audience === 'parent' ? bt.tipsParent : bt.tipsStudent;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="panel flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-4">
          <div>
            <p className="font-bold">Beş Faktör Kişilik Profili</p>
            <p className="t-meta">Örnek rapor · Deniz, 8. sınıf</p>
          </div>
          <span className="chip">Örnek veriler</span>
        </div>
        <ul className="divide-y divide-rule">
          {besFaktor.scales.map((s) => {
            const v = SAMPLE[s.key];
            const active = s.key === focus;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setFocus(s.key)}
                  aria-pressed={active}
                  className={`grid w-full gap-2 px-5 py-4 text-left transition-colors sm:grid-cols-[9.5rem_1fr] sm:items-center sm:gap-6 ${
                    active ? 'bg-brass-soft/60' : 'hover:bg-surface-2'
                  }`}
                >
                  <span>
                    <span className="block font-bold">{s.name}</span>
                    <span className="t-meta block">{besFaktorReport.bandLabels[v.band]}</span>
                  </span>
                  <ScaleRuler
                    min={1}
                    max={5}
                    value={v.value}
                    ciLow={v.value - 0.42}
                    ciHigh={Math.min(5, v.value + 0.42)}
                    majorStep={1}
                    minorStep={0.25}
                    srLabel={`${s.name}: ${besFaktorReport.bandLabels[v.band]}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <div role="tablist" aria-label="Rapor kimin için?" className="inline-flex self-start rounded-lg border border-rule-strong p-1">
          {(['parent', 'student'] as const).map((a) => (
            <button
              key={a}
              role="tab"
              type="button"
              aria-selected={audience === a}
              onClick={() => setAudience(a)}
              className={`rounded-md px-4 py-1.5 font-bold ${audience === a ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
            >
              {a === 'parent' ? 'Veliye' : 'Öğrenciye'}
            </button>
          ))}
        </div>
        <div className="panel flex flex-1 flex-col gap-4 p-6" role="tabpanel">
          <div>
            <p className="t-meta">{scale.name}</p>
            <p className="font-display text-2xl font-bold">{bt.summary}</p>
          </div>
          <p className="measure">{text}</p>
          <div>
            <p className="font-bold">{audience === 'parent' ? 'Evde neler yapılabilir?' : 'Deneyebileceklerin'}</p>
            <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="t-meta">Soldaki satırlara dokunarak diğer boyutların metinlerini görebilirsiniz.</p>
      </div>
    </div>
  );
}
