/**
 * Puanı bir cetvel üzerinde gösterir: ana ve ara çizgiler, ölçüm payı bandı ve kırmızı kalem
 * işareti. Kişilik boyutlarında iyi/kötü çağrışımı olmasın diye tek renk kullanılır.
 */
const nf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });

export function ScaleRuler({
  min,
  max,
  value,
  ciLow,
  ciHigh,
  majorStep,
  minorStep,
  poles,
  srLabel,
}: {
  min: number;
  max: number;
  value: number | null;
  ciLow?: number | null;
  ciHigh?: number | null;
  majorStep: number;
  minorStep: number;
  poles?: { low: string; high: string };
  srLabel: string;
}) {
  const span = max - min;
  const pct = (v: number) => ((v - min) / span) * 100;
  const majors: number[] = [];
  for (let v = min; v <= max + 1e-9; v += majorStep) majors.push(Math.round(v * 1000) / 1000);
  const minorCount = Math.round(span / minorStep);

  return (
    <div className="w-full" role="img" aria-label={srLabel}>
      <div className="relative h-11">
        {/* ölçüm payı */}
        {value !== null && ciLow != null && ciHigh != null && (
          <div
            className="absolute top-[0.9rem] h-3 rounded-sm bg-brass-soft ring-1 ring-brass/40"
            style={{ left: `${pct(ciLow)}%`, width: `${Math.max(pct(ciHigh) - pct(ciLow), 0.5)}%` }}
          />
        )}
        {/* ara çizgiler */}
        <div
          className="absolute inset-x-0 top-[1.05rem] h-[0.45rem] opacity-70"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, var(--rule-strong) 0 1px, transparent 1px calc(100% / ${minorCount}))`,
            backgroundSize: 'calc(100% + 1px) 100%',
          }}
        />
        {/* taban çizgisi */}
        <div className="absolute inset-x-0 top-[1.5rem] h-px bg-ink" />
        {/* ana çizgiler */}
        {majors.map((m) => (
          <div key={m} className="absolute top-[0.75rem] h-[0.8rem] w-px bg-ink" style={{ left: `${pct(m)}%` }} />
        ))}
        {/* işaret */}
        {value !== null && (
          <div className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${pct(value)}%` }}>
            <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true">
              <path d="M1 0 L13 0 L7 9 Z" fill="var(--marker)" />
            </svg>
            <div className="h-[0.95rem] w-[2px] bg-marker" />
          </div>
        )}
        {/* ana çizgi etiketleri */}
        {majors.map((m, i) => (
          <span
            key={`l${m}`}
            className={`t-meta tabular absolute top-[1.7rem] text-[0.75rem] ${i === 0 ? '' : i === majors.length - 1 ? '-translate-x-full' : '-translate-x-1/2'}`}
            style={{ left: `${pct(m)}%` }}
          >
            {nf.format(m)}
          </span>
        ))}
      </div>
      {poles && (
        <div className="mt-1 flex justify-between gap-4 text-[0.8125rem] leading-snug text-ink-3">
          <span className="max-w-[45%]">{poles.low}</span>
          <span className="max-w-[45%] text-right">{poles.high}</span>
        </div>
      )}
    </div>
  );
}
