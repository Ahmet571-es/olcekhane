import { ScaleRuler } from '@/components/report/scale-ruler';
import { AUDIENCE_LABELS } from '@/lib/config';
import type { RulerRow, SimpleChart, SimpleGroup, SimpleReport } from '@/lib/reports/simple';

/**
 * Basit raporun ekrandaki hâli. PDF'teki raporla aynı içeriği gösterir: teste uygun tek
 * bir grafik, öne çıkan sayılar, her ölçek ya da alan için düzey ve kısa yorum.
 */

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
const r2 = (v: number) => Math.round(v * 100) / 100;

function rulerSteps(min: number, max: number) {
  const span = max - min;
  if (span <= 4) return { major: 1, minor: 0.25 };
  if (span <= 10) return { major: 1, minor: 0.5 };
  if (span <= 40) return { major: 5, minor: 1 };
  return { major: 10, minor: 2 };
}

/** Cetvel satırları; satırın yorumu varsa (ayrıntılı profilde alt özellikler) cetvelin altında gösterilir. */
function Rulers({ rows }: { rows: (RulerRow & { text?: string })[] }) {
  return (
    <ul className="flex flex-col divide-y divide-rule border-y border-rule">
      {rows.map((r) => {
        const st = rulerSteps(r.min, r.max);
        return (
          // Telefonda ad ve puan aynı satırda, cetvel altta; geniş ekranda üçü yan yana.
          <li
            key={r.label}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 py-4 sm:grid-cols-[11rem_1fr_7rem] sm:items-center sm:gap-x-6"
          >
            <p className="font-bold">{r.label}</p>
            <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
              <ScaleRuler
                min={r.min}
                max={r.max}
                value={r.value}
                ciLow={r.ciLow}
                ciHigh={r.ciHigh}
                majorStep={st.major}
                minorStep={st.minor}
                srLabel={`${r.label}: ${r.valueLabel}, ${r.band}`}
              />
            </div>
            <p className="flex items-baseline gap-2 text-right sm:flex-col sm:items-end sm:gap-0">
              <span className="tabular font-bold">{r.valueLabel}</span>
              <span className="t-small text-ink-2">{r.band}</span>
            </p>
            {r.text && <p className="measure col-span-2 text-[0.975rem] text-ink-2 sm:col-span-3">{r.text}</p>}
          </li>
        );
      })}
    </ul>
  );
}

function Groups({ groups }: { groups: SimpleGroup[] }) {
  return (
    <div className="flex flex-col gap-10">
      {groups.map((g) => (
        <section key={g.title} aria-label={g.title} className="flex flex-col gap-3">
          <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-xl font-bold">{g.title}</span>
            <span className="t-small font-bold text-brass-ink">{g.badge}</span>
          </h3>
          <p className="measure text-ink-2">{g.text}</p>
          <Rulers rows={g.facets} />
        </section>
      ))}
    </div>
  );
}

function Hexagon({ chart }: { chart: Extract<SimpleChart, { type: 'hexagon' }> }) {
  const cx = 230;
  const cy = 200;
  const rMax = 132;
  const angle = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
  const pt = (i: number, v: number) => {
    const r = (rMax * v) / 5;
    return [r2(cx + Math.cos(angle(i)) * r), r2(cy + Math.sin(angle(i)) * r)] as const;
  };
  const ring = (v: number) => chart.axes.map((_, i) => pt(i, v).join(',')).join(' ');
  const poly = chart.axes.map((a, i) => pt(i, a.value ?? 1).join(',')).join(' ');
  const top = new Set(chart.highlight);
  const label = chart.axes.map((a) => `${a.label} ${a.value === null ? 'hesaplanamadı' : nf1.format(a.value)}`).join(', ');
  return (
    <svg viewBox="0 0 460 400" className="mx-auto h-auto w-full max-w-[30rem]" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((v) => (
        <polygon key={v} points={ring(v)} fill="none" stroke="var(--rule)" strokeWidth={v === 5 ? 1.5 : 1} />
      ))}
      {chart.axes.map((_, i) => {
        const [x, y] = pt(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--rule)" strokeWidth={1} />;
      })}
      <polygon points={poly} fill="color-mix(in oklab, var(--brass) 22%, transparent)" stroke="var(--brass)" strokeWidth={2.5} strokeLinejoin="round" />
      {chart.axes.map((a, i) => {
        if (a.value === null) return null;
        const [x, y] = pt(i, a.value);
        return <circle key={a.key} cx={x} cy={y} r={top.has(a.key) ? 6 : 4} fill={top.has(a.key) ? 'var(--marker)' : 'var(--ink)'} />;
      })}
      {chart.axes.map((a, i) => {
        const ang = angle(i);
        const lx = r2(cx + Math.cos(ang) * (rMax + 34));
        const ly = r2(cy + Math.sin(ang) * (rMax + 30));
        const anchor = Math.abs(Math.cos(ang)) < 0.2 ? 'middle' : Math.cos(ang) > 0 ? 'start' : 'end';
        const isTop = top.has(a.key);
        return (
          <g key={a.key}>
            <text x={lx} y={ly} textAnchor={anchor} fontSize="15" fontWeight={isTop ? 700 : 500} fill={isTop ? 'var(--ink)' : 'var(--ink-2)'}>
              {a.label}
            </text>
            <text x={lx} y={ly + 17} textAnchor={anchor} fontSize="12" fill="var(--ink-3)">
              {a.key} · {a.value === null ? '—' : nf1.format(a.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Bars({ rows }: { rows: Extract<SimpleChart, { type: 'bars' }>['rows'] }) {
  return (
    <ul className="flex flex-col gap-4">
      {rows.map((r) => {
        const pct = r.max ? Math.max(0, Math.min(100, (r.value / r.max) * 100)) : 0;
        return (
          <li key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
            <span className="text-[0.975rem]">{r.label}</span>
            <span className="tabular font-bold">{r.valueLabel}</span>
            <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Columns({ chart }: { chart: Extract<SimpleChart, { type: 'columns' }> }) {
  const max = Math.max(1, ...chart.rows.map((r) => r.value));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-36 items-end gap-3" role="img" aria-label={chart.rows.map((r) => `${r.label}: ${r.value} ${chart.caption}`).join(', ')}>
        {chart.rows.map((r) => (
          <div key={r.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="tabular text-[0.875rem] font-bold">{r.value}</span>
            <div className="w-full max-w-14 rounded-t-md bg-ink" style={{ height: `${(Math.max(0, r.value) / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 border-t border-rule-strong pt-1" aria-hidden="true">
        {chart.rows.map((r) => (
          <span key={r.label} className="flex-1 text-center text-[0.8125rem] text-ink-3">
            {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Chart({ chart }: { chart: SimpleChart }) {
  if (chart.type === 'rulers') return <Rulers rows={chart.rows} />;
  if (chart.type === 'hexagon') return <Hexagon chart={chart} />;
  if (chart.type === 'bars') return <Bars rows={chart.rows} />;
  return <Columns chart={chart} />;
}

export function SimpleReportView({ report }: { report: SimpleReport }) {
  // Öğrenci ve yetişkin raporları ikinci tekil şahısla yazılır.
  const you = report.audience !== 'parent';
  return (
    <article className="flex flex-col gap-9">
      <header className="flex flex-col gap-3 border-b border-rule pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{AUDIENCE_LABELS[report.audience].name}</span>
          {report.isPilot && <span className="chip chip-brass">Pilot test</span>}
        </div>
        <h1 className="t-h1">{report.instrumentName}</h1>
        <p className="text-ink-2">
          {[report.studentName, report.gradeLabel, dateFmt.format(new Date(report.completedAt))].filter(Boolean).join(' · ')}
        </p>
      </header>

      {report.cautions.length > 0 && (
        <div className="notice notice-warn flex flex-col gap-2">
          <p className="font-bold">{you ? 'Sonucunu okurken dikkat' : 'Bu sonucu dikkatle yorumlayın'}</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {report.cautions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {report.keyFigures.length > 0 && (
        <dl
          className={`grid gap-px overflow-hidden rounded-xl border border-rule bg-rule ${
            report.keyFigures.length === 1 ? 'grid-cols-1' : report.keyFigures.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
          }`}
        >
          {report.keyFigures.map((f) => (
            <div key={f.label} className="bg-surface p-4">
              <dt className="t-meta">{f.label}</dt>
              <dd className="font-display text-2xl font-bold">{f.value}</dd>
              {f.note && <dd className="t-small text-ink-3">{f.note}</dd>}
            </div>
          ))}
        </dl>
      )}

      {report.chart && (
        <section aria-labelledby="grafik" className="flex flex-col gap-4">
          <h2 id="grafik" className="t-h2">
            {report.chartTitle}
          </h2>
          <Chart chart={report.chart} />
          {report.chartNote && <p className="t-meta">{report.chartNote}</p>}
        </section>
      )}

      <section aria-labelledby="ogeler" className="flex flex-col gap-4">
        <h2 id="ogeler" className="t-h2">
          {report.itemsTitle}
        </h2>
        {report.groupsNote && <p className="t-meta measure">{report.groupsNote}</p>}
        {report.groups ? (
          <Groups groups={report.groups} />
        ) : (
          <ul className="flex flex-col divide-y divide-rule border-y border-rule">
            {report.items.map((it) => (
              <li key={it.title} className="flex flex-col gap-1.5 py-5">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-lg font-bold">{it.title}</span>
                  {it.badge && <span className="t-small font-bold text-brass-ink">{it.badge}</span>}
                </p>
                <p className="measure text-ink-2">{it.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {report.support && (
        <section className="panel flex flex-col gap-2 p-6">
          <h2 className="t-h3">{report.support.title}</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {report.support.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-2 text-[0.95rem] text-ink-2">
        <p>
          <strong className="text-ink">{report.disclaimer.title}</strong> {report.disclaimer.text}
        </p>
        <p>{report.normNote}</p>
      </div>
    </article>
  );
}
