import type { ParallelFigure, QuizChart, QuizFigure, QuizTable, TwoCirclesFigure } from '@/lib/instruments/types';
import { MathText } from './math-text';

/**
 * Akademik test sorularındaki tablo, grafik ve şekiller. Hepsi veriden çizilir: sütunlar ve noktalar
 * eksendeki ölçeğe tam oturur, renkler tema değişkenlerinden gelir. Hem soru ekranında hem raporda kullanılır.
 */

const nf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });

export function QuizTableView({ table }: { table: QuizTable }) {
  return (
    <figure className="flex max-w-full flex-col gap-2 overflow-x-auto">
      {table.caption && <figcaption className="t-meta">{table.caption}</figcaption>}
      <table className="min-w-[15rem] self-start border-collapse text-[1rem]" aria-label={table.caption}>
        <thead>
          <tr>
            {table.head.map((h) => (
              <th key={h} scope="col" className="border-b-[1.5px] border-rule-strong px-4 py-2 text-left font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="border-b border-rule px-4 py-2 text-left font-normal">
                    <MathText text={c} />
                  </th>
                ) : (
                  <td key={j} className="tabular border-b border-rule px-4 py-2">
                    <MathText text={c} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* ---------- Grafikler ---------- */

const W = 440;
const H = 270;
const M = { left: 50, right: 14, top: 34, bottom: 44 };

function axisScale(chart: QuizChart) {
  const maxVal = Math.max(...chart.values);
  const step = chart.step ?? Math.max(1, Math.ceil(maxVal / 5));
  const max = chart.max ?? Math.ceil(maxVal / step) * step;
  return { step, max };
}

function chartLabel(chart: QuizChart): string {
  const pairs = chart.labels.map((l, i) => `${l}: ${nf.format(chart.values[i])}`).join(', ');
  const kind = chart.kind === 'bar' ? 'Sütun grafiği' : chart.kind === 'line' ? 'Çizgi grafiği' : 'Daire grafiği';
  return `${kind}: ${chart.title}. ${pairs}.`;
}

function BarLineChart({ chart }: { chart: QuizChart }) {
  const { step, max } = axisScale(chart);
  const pw = W - M.left - M.right;
  const ph = H - M.top - M.bottom;
  const base = M.top + ph;
  const y = (v: number) => base - (v / max) * ph;
  const slot = pw / chart.labels.length;
  const cx = (i: number) => M.left + slot * (i + 0.5);
  const ticks: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  const barW = Math.min(56, slot * 0.56);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[30rem]" role="img" aria-label={chartLabel(chart)}>
      {chart.yLabel && (
        <text x={M.left - 8} y={16} fontSize="13" fill="var(--ink-3)">
          {chart.yLabel}
        </text>
      )}
      {ticks.map((v) => (
        <g key={v}>
          <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} stroke={v === 0 ? 'var(--ink-3)' : 'var(--rule)'} strokeWidth={v === 0 ? 1.5 : 1} />
          <text x={M.left - 8} y={y(v) + 4.5} textAnchor="end" fontSize="13" fill="var(--ink-2)" className="tabular">
            {nf.format(v)}
          </text>
        </g>
      ))}
      {chart.kind === 'bar' &&
        chart.values.map((v, i) => (
          <g key={chart.labels[i]}>
            <rect x={cx(i) - barW / 2} y={y(v)} width={barW} height={base - y(v)} fill="var(--brass)" rx={2} />
            {chart.showValues && (
              <text x={cx(i)} y={y(v) - 7} textAnchor="middle" fontSize="13" fontWeight={700} fill="var(--ink)">
                {nf.format(v)}
              </text>
            )}
          </g>
        ))}
      {chart.kind === 'line' && (
        <>
          <polyline
            points={chart.values.map((v, i) => `${cx(i)},${y(v)}`).join(' ')}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          {chart.values.map((v, i) => (
            <g key={chart.labels[i]}>
              <circle cx={cx(i)} cy={y(v)} r={4.5} fill="var(--ink)" />
              {chart.showValues && (
                <text x={cx(i)} y={y(v) - 11} textAnchor="middle" fontSize="13" fontWeight={700} fill="var(--ink)">
                  {nf.format(v)}
                </text>
              )}
            </g>
          ))}
        </>
      )}
      {chart.labels.map((l, i) => (
        <text key={l} x={cx(i)} y={base + 22} textAnchor="middle" fontSize="13" fill="var(--ink-2)">
          {l}
        </text>
      ))}
    </svg>
  );
}

const PIE_FILLS = [
  'color-mix(in oklab, var(--brass) 55%, var(--surface))',
  'var(--surface-2)',
  'color-mix(in oklab, var(--ink) 22%, var(--surface))',
  'var(--brass-soft)',
  'color-mix(in oklab, var(--ink) 8%, var(--surface))',
];

function PieChart({ chart }: { chart: QuizChart }) {
  const total = chart.values.reduce((s, v) => s + v, 0);
  const cx = 130;
  const cy = 125;
  const r = 105;
  // Ekran koordinatları: 0° saat 12 yönü, açı saat yönünde artar.
  const pt = (deg: number, rad: number) => [cx + rad * Math.sin((deg * Math.PI) / 180), cy - rad * Math.cos((deg * Math.PI) / 180)];
  // Her dilimin başladığı yer: kendisinden önceki dilimlerin toplamı.
  const before = chart.values.map((_, i) => chart.values.slice(0, i).reduce((s, x) => s + x, 0));
  const slices = chart.values.map((v, i) => {
    const a0 = (before[i] / total) * 360;
    const a1 = ((before[i] + v) / total) * 360;
    const [x0, y0] = pt(a0, r);
    const [x1, y1] = pt(a1, r);
    const large = a1 - a0 > 180 ? 1 : 0;
    const d = a1 - a0 >= 359.999 ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z` : `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
    const [lx, ly] = pt((a0 + a1) / 2, r * 0.58);
    return { d, lx, ly, label: chart.labels[i], v, fill: PIE_FILLS[i % PIE_FILLS.length] };
  });
  return (
    <svg viewBox="0 0 260 250" className="h-auto w-full max-w-[17rem]" role="img" aria-label={chartLabel(chart)}>
      {slices.map((s) => (
        <path key={s.label} d={s.d} fill={s.fill} stroke="var(--surface)" strokeWidth={2.5} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rule-strong)" strokeWidth={1} />
      {slices.map((s) => (
        <text key={s.label} x={s.lx} y={s.ly + 5} textAnchor="middle" fontSize="14" fontWeight={700} fill="var(--ink)">
          {s.label}
          {chart.showValues ? ` (${nf.format(s.v)})` : ''}
        </text>
      ))}
    </svg>
  );
}

export function QuizChartView({ chart }: { chart: QuizChart }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="t-meta">{chart.title}</figcaption>
      {chart.kind === 'pie' ? <PieChart chart={chart} /> : <BarLineChart chart={chart} />}
    </figure>
  );
}

/* ---------- Şekiller ---------- */

function ParallelFigureView({ fig }: { fig: ParallelFigure }) {
  const W2 = 340;
  const yTop = 70;
  const yBot = 150;
  const px = 190;
  const t = (fig.slope * Math.PI) / 180;
  const qx = px - (yBot - yTop) / Math.tan(t);
  const ext = 52;
  const dir = [Math.cos(t), -Math.sin(t)];
  const a = [px + dir[0] * ext, yTop + dir[1] * ext];
  const b = [qx - dir[0] * ext, yBot - dir[1] * ext];
  const regions: Record<ParallelFigure['marks'][number]['region'], [number, number]> = {
    'above-right': [0, fig.slope],
    'above-left': [fig.slope, 180],
    'below-left': [180, 180 + fig.slope],
    'below-right': [180 + fig.slope, 360],
  };
  const polar = (x: number, y: number, deg: number, rad: number) => [x + rad * Math.cos((deg * Math.PI) / 180), y - rad * Math.sin((deg * Math.PI) / 180)];
  const chevron = (y: number) => `M 66 ${y - 6} L 75 ${y} L 66 ${y + 6} M 76 ${y - 6} L 85 ${y} L 76 ${y + 6}`;
  return (
    <svg viewBox={`0 0 ${W2} 215`} className="h-auto w-full max-w-[26rem]" role="img" aria-label={fig.alt}>
      <line x1={20} x2={300} y1={yTop} y2={yTop} stroke="var(--ink)" strokeWidth={2} />
      <line x1={20} x2={300} y1={yBot} y2={yBot} stroke="var(--ink)" strokeWidth={2} />
      <path d={`${chevron(yTop)} ${chevron(yBot)}`} fill="none" stroke="var(--ink-2)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <text x={308} y={yTop + 5} fontSize="15" fontStyle="italic" fill="var(--ink)">
        d₁
      </text>
      <text x={308} y={yBot + 5} fontSize="15" fontStyle="italic" fill="var(--ink)">
        d₂
      </text>
      <line x1={b[0]} y1={b[1]} x2={a[0]} y2={a[1]} stroke="var(--ink)" strokeWidth={2} />
      {fig.marks.map((m) => {
        const [a0, a1] = regions[m.region];
        const cx = m.at === 'top' ? px : qx;
        const cy = m.at === 'top' ? yTop : yBot;
        const r = 20;
        const [x0, y0] = polar(cx, cy, a0, r);
        const [x1, y1] = polar(cx, cy, a1, r);
        const large = a1 - a0 > 180 ? 1 : 0;
        const mid = (a0 + a1) / 2;
        const [lx, ly] = polar(cx, cy, mid, r + 17);
        return (
          <g key={`${m.at}-${m.region}`}>
            <path d={`M ${x0} ${y0} A ${r} ${r} 0 ${large} 0 ${x1} ${y1}`} fill="none" stroke="var(--marker)" strokeWidth={2} />
            <text x={lx} y={ly + 5} textAnchor="middle" fontSize="15" fontWeight={700} fill="var(--marker)">
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TwoCirclesFigureView({ fig }: { fig: TwoCirclesFigure }) {
  // Merkezler arası uzaklık yarıçapa eşit: her çember diğerinin merkezinden geçer.
  const r = 78;
  const a = { x: 132, y: 128 };
  const b = { x: a.x + r, y: a.y };
  const c = { x: (a.x + b.x) / 2, y: a.y - Math.sqrt(r * r - (r / 2) * (r / 2)) };
  const dot = (p: { x: number; y: number }) => <circle cx={p.x} cy={p.y} r={4} fill="var(--ink)" />;
  return (
    <svg viewBox="0 0 342 232" className="h-auto w-full max-w-[24rem]" role="img" aria-label={fig.alt}>
      <circle cx={a.x} cy={a.y} r={r} fill="none" stroke="var(--ink-2)" strokeWidth={1.8} />
      <circle cx={b.x} cy={b.y} r={r} fill="none" stroke="var(--ink-2)" strokeWidth={1.8} />
      <polygon
        points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`}
        fill="color-mix(in oklab, var(--brass) 18%, transparent)"
        stroke="var(--marker)"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {dot(a)}
      {dot(b)}
      {dot(c)}
      <text x={a.x - 8} y={a.y + 22} textAnchor="middle" fontSize="16" fontWeight={700} fill="var(--ink)">
        A
      </text>
      <text x={b.x + 8} y={b.y + 22} textAnchor="middle" fontSize="16" fontWeight={700} fill="var(--ink)">
        B
      </text>
      <text x={c.x} y={c.y - 10} textAnchor="middle" fontSize="16" fontWeight={700} fill="var(--ink)">
        C
      </text>
    </svg>
  );
}

export function QuizFigureView({ figure }: { figure: QuizFigure }) {
  return (
    <figure className="flex flex-col gap-2">
      {figure.kind === 'parallel' ? <ParallelFigureView fig={figure} /> : <TwoCirclesFigureView fig={figure} />}
    </figure>
  );
}

/** Sorunun görseli (tablo, grafik ya da şekil). */
export function QuizVisual({ item }: { item: { table?: QuizTable; chart?: QuizChart; figure?: QuizFigure } }) {
  if (!item.table && !item.chart && !item.figure) return null;
  return (
    <div className="flex flex-col gap-4">
      {item.chart && <QuizChartView chart={item.chart} />}
      {item.table && <QuizTableView table={item.table} />}
      {item.figure && <QuizFigureView figure={item.figure} />}
    </div>
  );
}
