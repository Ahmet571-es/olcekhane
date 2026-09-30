import type { CognitiveBlock, ReportContent } from '@/lib/reports/build';

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

/** Dizi görevlerinde her uzunluktaki iki denemenin sonucu: dolu kare doğru, boş kare yanlış. */
function Ladder({ ladder, label }: { ladder: NonNullable<CognitiveBlock['ladder']>; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2" role="img" aria-label={label}>
        {ladder.map((l) => (
          <div key={l.length} className="flex flex-col items-center gap-1">
            <div className="flex flex-col gap-1">
              {l.results.map((ok, i) => (
                <span
                  key={i}
                  className={`block h-5 w-7 rounded-[4px] border-[1.5px] ${ok ? 'border-ink bg-ink' : 'border-rule-strong bg-surface'}`}
                />
              ))}
            </div>
            <span className="tabular text-[0.8125rem] text-ink-3">{l.length}</span>
          </div>
        ))}
      </div>
      <p className="t-meta">Her sütun bir dizi uzunluğu; dolu kare doğru, boş kare yanlış deneme.</p>
    </div>
  );
}

function FlankerBars({ f }: { f: NonNullable<CognitiveBlock['flanker']> }) {
  const rows = [
    { label: 'Oklar aynı yöne bakarken', acc: f.accCongruent, rt: f.rtCongruent },
    { label: 'Oklar farklı yöne bakarken', acc: f.accIncongruent, rt: f.rtIncongruent },
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
          <span className="text-[0.9375rem]">{r.label}</span>
          <span className="tabular text-[0.9375rem] font-bold">
            %{nf0.format(Math.round(r.acc * 100))}
            {r.rt !== null && <span className="font-normal text-ink-3"> · {nf0.format(r.rt)} ms</span>}
          </span>
          <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
            <div className="h-full rounded-full bg-ink" style={{ width: `${Math.round(r.acc * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Harf işaretleme: her bölümün net doğru sayısı, aynı ölçekte dikey çubuklar. */
function SectionBars({ sections, label }: { sections: NonNullable<CognitiveBlock['sections']>; label: string }) {
  const max = Math.max(1, ...sections.map((s) => s.value));
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-32 items-end gap-3"
        role="img"
        aria-label={`${label}: ${sections.map((s) => `${s.label} ${nf0.format(s.value)}`).join(', ')}`}
      >
        {sections.map((s) => (
          <div key={s.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="tabular text-[0.875rem] font-bold">{nf0.format(s.value)}</span>
            <div className="w-full max-w-12 rounded-t-md bg-ink" style={{ height: `${(Math.max(0, s.value) / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 border-t border-rule-strong pt-1" aria-hidden="true">
        {sections.map((s) => (
          <span key={s.label} className="tabular flex-1 text-center text-[0.8125rem] text-ink-3">
            {s.label}
          </span>
        ))}
      </div>
      <p className="t-meta">Her çubuk bir bölümdeki net doğru sayısı; bölümlerin süresi eşittir.</p>
    </div>
  );
}

export function CognitiveReportView({ report }: { report: ReportContent }) {
  const c = report.cognitive!;
  const forStudent = report.audience !== 'parent';
  return (
    <div className="flex flex-col gap-10">
      <p className="notice notice-info">
        {forStudent
          ? 'Bu görevler için henüz Türkiye’deki akranlarınla karşılaştırma yapılmıyor. Sonuçlar, her görevde ne yaptığını anlatıyor.'
          : 'Bu görevler pilot aşamadadır ve henüz Türkiye normu yoktur; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Tek bir uygulamanın sonucu yorgunluk, dikkat ve ortam koşullarından etkilenebilir.'}
      </p>

      <section aria-labelledby="gorev-sonuclari" className="flex flex-col gap-5">
        <h2 id="gorev-sonuclari" className="t-h2">
          Görev sonuçları
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {c.blocks.map((b) => (
            <article key={b.key} className="panel flex flex-col gap-4 p-6">
              <div>
                <h3 className="t-h3">{b.name}</h3>
                <p className="t-meta mt-1">{b.plain}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-2xl font-bold leading-snug">{b.headline}</p>
                {b.detail && <p className="tabular text-ink-2">{b.detail}</p>}
              </div>
              {b.ladder && b.ladder.length > 0 && <Ladder ladder={b.ladder} label={`${b.name}: ${b.headline}`} />}
              {b.sections && b.sections.length > 0 && <SectionBars sections={b.sections} label={b.name} />}
              {b.flanker && <FlankerBars f={b.flanker} />}
              {b.symbol && (
                <p className="tabular text-ink-2">
                  Dakikada {nf0.format(b.symbol.perMinute)} doğru · {b.symbol.errors} hata
                </p>
              )}
              <p className="text-ink-2">{b.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="gunluk" className="flex flex-col gap-3">
        <h2 id="gunluk" className="t-h2">
          {forStudent ? 'Günlük hayatta işine yarayacaklar' : 'Günlük hayatta neler yapılabilir?'}
        </h2>
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          {c.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
