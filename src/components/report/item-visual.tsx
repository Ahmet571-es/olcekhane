import { compareGeometry, gaugeGeometry, visualDescription, type CompareVisual, type GaugeVisual, type ItemVisual } from '@/lib/reports/visuals';

/**
 * Rapor kartının grafiği (ekran). Geometri PDF'teki çizimle ortaktır (lib/reports/visuals.ts). Bölgeler gri tonlarında,
 * kişinin bölgesi pirinç rengiyle vurgulanır; puan kırmızı işaretle gösterilir. Grafiğin sözel karşılığı ekran okuyucuya
 * verilir.
 */
const W = 240;
const FS = 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
/** Bölgelerin gri tonları (sırayla); kişinin bölgesi pirinç rengiyle vurgulanır. */
const zoneFill = (i: number) => (i % 2 ? 'var(--rule)' : 'color-mix(in oklab, var(--rule) 55%, var(--surface-2))');

function Gauge({ v }: { v: GaugeVisual }) {
  const g = gaugeGeometry(v, W, FS);
  return (
    <svg viewBox={`0 0 ${W} ${r2(g.height)}`} className="h-auto w-full" role="img" aria-label={visualDescription(v)}>
      {g.zones.map((z, i) => (
        <rect
          key={i}
          x={r2(z.x)}
          y={r2(g.barY)}
          width={r2(Math.max(0, z.w - 1))}
          height={r2(g.barH)}
          rx={2}
          fill={z.active ? 'var(--brass-soft)' : zoneFill(i)}
          stroke={z.active ? 'var(--brass)' : 'none'}
          strokeWidth={z.active ? 1.2 : 0}
        />
      ))}
      {g.ci && <rect x={r2(g.ci.x)} y={r2(g.barY + g.barH * 0.3)} width={r2(g.ci.w)} height={r2(g.barH * 0.4)} rx={1.5} fill="var(--brass)" opacity={0.45} />}
      {g.ticks.map((t, i) => (
        <text key={i} x={r2(t.x)} y={r2(g.tickY)} textAnchor={t.anchor} fontSize={g.tickSize} fill="var(--ink-3)" className="tabular">
          {t.text}
        </text>
      ))}
      {g.labels.map((l, i) => (
        <text
          key={i}
          x={r2(l.x)}
          y={r2(g.labelY(l.row))}
          textAnchor={l.anchor}
          fontSize={FS}
          fontWeight={l.active ? 700 : 500}
          fill={l.active ? 'var(--ink)' : 'var(--ink-2)'}
        >
          {l.text}
        </text>
      ))}
      {g.marker && (
        <g>
          <line x1={r2(g.marker.x)} x2={r2(g.marker.x)} y1={r2(g.barY - 3)} y2={r2(g.barY + g.barH + 2)} stroke="var(--marker)" strokeWidth={2.2} />
          <path d={`M${r2(g.marker.x - 4)} ${r2(g.barY - 7)} L${r2(g.marker.x + 4)} ${r2(g.barY - 7)} L${r2(g.marker.x)} ${r2(g.barY - 2)} Z`} fill="var(--marker)" />
          <text x={r2(g.marker.x)} y={r2(g.barY - 9.5)} textAnchor={g.marker.anchor} fontSize={FS} fontWeight={700} fill="var(--ink)" className="tabular">
            {g.marker.text}
          </text>
        </g>
      )}
    </svg>
  );
}

function Compare({ v }: { v: CompareVisual }) {
  const g = compareGeometry(v, W, FS);
  return (
    <svg viewBox={`0 0 ${W} ${r2(g.height)}`} className="h-auto w-full" role="img" aria-label={visualDescription(v)}>
      {g.rows.map((row, i) => (
        <g key={i}>
          <text x={0} y={r2(row.labelY)} fontSize={r2(row.labelSize)} fontWeight={600} fill="var(--ink)">
            {row.label}
          </text>
          <text x={W} y={r2(row.labelY)} textAnchor="end" fontSize={FS} fontWeight={700} fill="var(--ink)" className="tabular">
            {row.valueText}
          </text>
          {row.zones.map((z, j) => (
            <rect
              key={j}
              x={r2(z.x)}
              y={r2(row.trackY)}
              width={r2(Math.max(0, z.w - 1))}
              height={5}
              rx={1.5}
              fill={z.active ? 'var(--brass-soft)' : zoneFill(j)}
              stroke={z.active ? 'var(--brass)' : 'none'}
              strokeWidth={z.active ? 1 : 0}
            />
          ))}
          {row.dot !== null && <circle cx={r2(row.dot)} cy={r2(row.trackY + 2.5)} r={4} fill="var(--marker)" stroke="var(--surface)" strokeWidth={1.2} />}
        </g>
      ))}
      {g.ticks.map((t, i) => (
        <text key={i} x={r2(t.x)} y={r2(g.axisY + g.fontSize)} textAnchor={t.anchor} fontSize={g.tickSize} fill="var(--ink-3)" className="tabular">
          {t.text}
        </text>
      ))}
      {g.labels.map((l, i) => (
        <text key={i} x={r2(l.x)} y={r2(g.labelY(l.row))} textAnchor={l.anchor} fontSize={FS * 0.92} fill="var(--ink-2)">
          {l.text}
        </text>
      ))}
    </svg>
  );
}

export function ItemVisualView({ visual }: { visual: ItemVisual }) {
  return visual.type === 'gauge' ? <Gauge v={visual} /> : <Compare v={visual} />;
}
