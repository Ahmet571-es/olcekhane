import 'server-only';
import { join } from 'node:path';
import { Circle, Document, Font, G, Line, Page, Path, Polygon, Rect, StyleSheet, Svg, Text, View, renderToBuffer } from '@react-pdf/renderer';
import { plainMath } from '@/components/quiz/math-text';
import { FRONT_LABELS_NOTE, LABEL_ALL_MAX, bars3dScene, defaultYaw } from '@/lib/charts/bars3d';
import type { QuizChart, QuizTable } from '@/lib/instruments/types';
import { AUDIENCE_LABELS } from '@/lib/config';
import type { OralReportBlock } from '@/lib/reports/oral';
import { weeksTitle, type Roadmap } from '@/lib/reports/roadmap';
import type { OralMarkedToken } from '@/lib/scoring/oral';
import { quadrantGeometry, type QuadrantChart, type RulerRow, type SimpleChart, type SimpleQuizReview, type SimpleReport } from '@/lib/reports/simple';
import { drawVisual, type DrawnVisual, type Tone } from '@/lib/reports/visual-draw';
import { packageSummary, summaryIntro, type PackageEntry } from '@/lib/reports/package';
import { PACKAGE_NAME } from '@/content/paket';
import { compareGeometry, gaugeGeometry, type CompareVisual, type GaugeVisual, type ItemVisual } from '@/lib/reports/visuals';

/**
 * Basit raporun PDF'i. Sunucuda bellekte üretilir ve doğrudan indirilir; dosya hiçbir yere kaydedilmez.
 * Yazı tipleri sitedekilerle aynıdır (src/assets/fonts); Türkçe harflerin hepsini içerir.
 */

const FONT_DIR = join(process.cwd(), 'src/assets/fonts');
const FACES = [
  { family: 'Atkinson', weight: 400, file: 'AtkinsonHyperlegibleNext-Regular.ttf' },
  { family: 'Atkinson', weight: 700, file: 'AtkinsonHyperlegibleNext-Bold.ttf' },
  { family: 'Bricolage', weight: 700, file: 'BricolageGrotesque-Bold.ttf' },
] as const;

type FontkitFont = { characterSet: number[]; glyphForCodePoint: (cp: number) => unknown };
let fontsReady: Promise<void> | null = null;

/**
 * Yazı tiplerini kaydeder ve yükler. fontkit, bileşik harfleri (ş = s + çengel, Ö = O + iki nokta)
 * çizerken bileşen harfi karakter bilgisi olmadan önbelleğe alır; o harf sonra PDF'te seçilip
 * kopyalanamaz ve aranamaz. Bu yüzden bütün harfler önceden karakter bilgileriyle yüklenir.
 */
function registerFonts(): Promise<void> {
  fontsReady ??= (async () => {
    for (const family of ['Atkinson', 'Bricolage'] as const) {
      Font.register({ family, fonts: FACES.filter((f) => f.family === family).map((f) => ({ src: join(FONT_DIR, f.file), fontWeight: f.weight })) });
    }
    // Varsayılan heceleme İngilizce kurallarla böler; Türkçe sözcükler bölünmeden alt satıra geçer.
    Font.registerHyphenationCallback((word) => [word]);
    for (const f of FACES) {
      const descriptor = { fontFamily: f.family, fontWeight: f.weight };
      await Font.load(descriptor);
      const font = (Font.getFont(descriptor) as unknown as { data?: FontkitFont } | undefined)?.data;
      if (font?.characterSet) for (const cp of font.characterSet) font.glyphForCodePoint(cp);
    }
  })().catch((err) => {
    fontsReady = null;
    throw err;
  });
  return fontsReady;
}

const C = {
  ink: '#13203b',
  ink2: '#44546f',
  ink3: '#5a6984',
  rule: '#d4dbe5',
  ruleStrong: '#a3b0c3',
  surface2: '#e8edf3',
  brass: '#b07f22',
  brassInk: '#7e5710',
  brassSoft: '#f3e7cf',
  /** Cetveldeki ölçüm payı bandı (ekrandaki raporun sarı bandı). */
  band: '#ecd49b',
  marker: '#c23a30',
  warnBg: '#fbefd9',
  warn: '#8a5300',
  danger: '#b3261e',
  ok: '#1b6e42',
  pause: '#ee6a36',
  paper: '#ffffff',
};

const s = StyleSheet.create({
  // Satır yüksekliği sayfaya ya da kapsayıcı bir View'a verilmez; paragraf metinlerine yazı boyutuyla birlikte
  // verilir. @react-pdf/renderer 4.9'da oransal satır yüksekliği, tanımlandığı öğenin kendi yazı boyutuyla
  // (yoksa varsayılan 18 pt ile) mutlak değere çevrilip miras bırakılıyor: sayfaya verilince sabit (fixed) alt
  // bilgi ve sayfa numarası çizilmiyor, yazı boyutu olmayan öğeye verilince satır arası iki katına çıkıyor.
  page: { paddingTop: 40, paddingBottom: 56, paddingHorizontal: 44, fontFamily: 'Atkinson', fontSize: 10.5, color: C.ink, backgroundColor: C.paper },
  para: { fontSize: 10.5, lineHeight: 1.45 },
  paraSmall: { fontSize: 9, lineHeight: 1.45 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1.5, borderBottomColor: C.ink, paddingBottom: 8 },
  brand: { fontFamily: 'Bricolage', fontWeight: 700, fontSize: 17, lineHeight: 1.2 },
  tag: { fontSize: 8.5, color: C.ink3, marginTop: 1 },
  topRight: { alignItems: 'flex-end' },
  audience: { fontWeight: 700, fontSize: 10 },
  title: { fontFamily: 'Bricolage', fontWeight: 700, fontSize: 22, lineHeight: 1.15, marginTop: 18 },
  meta: { color: C.ink2, marginTop: 4 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 8 },
  chip: { fontSize: 8.5, fontWeight: 700, color: C.brassInk, backgroundColor: C.brassSoft, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  privacy: { marginTop: 12, backgroundColor: C.surface2, borderRadius: 6, padding: 9, fontSize: 9, lineHeight: 1.45, color: C.ink2 },
  caution: { marginTop: 12, backgroundColor: C.warnBg, borderRadius: 6, padding: 9 },
  cautionTitle: { fontWeight: 700, marginBottom: 2 },
  bullet: { flexDirection: 'row', gap: 5 },
  figures: { flexDirection: 'row', marginTop: 16, borderWidth: 1, borderColor: C.rule, borderRadius: 6 },
  figure: { flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: C.rule },
  figureLast: { flex: 1, padding: 10 },
  figureLabel: { fontSize: 8.5, color: C.ink3 },
  figureValue: { fontFamily: 'Bricolage', fontWeight: 700, fontSize: 18, lineHeight: 1.25, marginTop: 2 },
  figureNote: { fontSize: 8.5, color: C.ink3 },
  h2: { fontFamily: 'Bricolage', fontWeight: 700, fontSize: 14, lineHeight: 1.25, marginTop: 20, marginBottom: 8 },
  note: { fontSize: 8.5, lineHeight: 1.4, color: C.ink3, marginTop: 6 },
  item: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.rule },
  itemHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: 6, marginBottom: 2 },
  itemTitle: { fontWeight: 700, fontSize: 11 },
  itemBadge: { fontWeight: 700, fontSize: 9.5, color: C.brassInk },
  support: { marginTop: 14, borderWidth: 1, borderColor: C.ruleStrong, borderRadius: 6, padding: 10 },
  disclaimer: { marginTop: 16, fontSize: 9, color: C.ink2 },
  footer: { position: 'absolute', bottom: 24, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: C.ink3, borderTopWidth: 0.75, borderTopColor: C.rule, paddingTop: 6 },
});

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
const r1 = (v: number) => Math.round(v * 10) / 10;

/* ---------- Grafikler ---------- */

function tickStep(span: number) {
  if (span <= 4) return 1;
  if (span <= 10) return 1;
  if (span <= 40) return 5;
  return 10;
}

/** Cetvel satırları; satırın yorumu varsa (ayrıntılı profilde alt özellikler) cetvelin altında yazılır. */
function Rulers({ rows }: { rows: (RulerRow & { text?: string })[] }) {
  const W = 250;
  const pad = 8;
  return (
    <View>
      {rows.map((row) => {
        const span = row.max - row.min || 1;
        const x = (v: number) => pad + ((v - row.min) / span) * (W - 2 * pad);
        const step = tickStep(span);
        const ticks: number[] = [];
        for (let v = Math.ceil(row.min / step) * step; v <= row.max + 1e-9; v += step) ticks.push(r1(v));
        return (
          <View key={row.label} wrap={false} style={{ paddingVertical: 5, borderTopWidth: 1, borderTopColor: C.rule }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ width: 128, fontWeight: 700, paddingRight: 6 }}>{row.label}</Text>
              <Svg width={W} height={30}>
                {row.value !== null && row.ciLow !== null && row.ciHigh !== null && (
                  <Rect
                    x={x(Math.max(row.min, row.ciLow))}
                    y={7}
                    width={Math.max(1.5, x(Math.min(row.max, row.ciHigh)) - x(Math.max(row.min, row.ciLow)))}
                    height={10}
                    rx={2}
                    fill={C.band}
                  />
                )}
                <Line x1={pad} y1={12} x2={W - pad} y2={12} stroke={C.ruleStrong} strokeWidth={2} />
                {ticks.map((t) => (
                  <G key={t}>
                    <Line x1={x(t)} y1={8} x2={x(t)} y2={16} stroke={C.ruleStrong} strokeWidth={1} />
                    <Text x={x(t)} y={27} style={{ fontFamily: 'Atkinson', fontSize: 7, fill: C.ink3 }} textAnchor="middle">
                      {String(t).replace('.', ',')}
                    </Text>
                  </G>
                ))}
                {row.value !== null && <Circle cx={x(Math.min(row.max, Math.max(row.min, row.value)))} cy={12} r={5.5} fill={C.marker} stroke={C.paper} strokeWidth={1.5} />}
              </Svg>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ fontWeight: 700 }}>{row.valueLabel}</Text>
                <Text style={{ fontSize: 9, color: C.ink2 }}>{row.band}</Text>
              </View>
            </View>
            {row.text && <Text style={[s.paraSmall, { color: C.ink2, marginTop: 2 }]}>{row.text}</Text>}
          </View>
        );
      })}
    </View>
  );
}

function Hexagon({ chart }: { chart: Extract<SimpleChart, { type: 'hexagon' }> }) {
  const W = 320;
  const H = 250;
  const cx = W / 2;
  const cy = H / 2 + 2;
  const rMax = 88;
  const angle = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
  const pt = (i: number, v: number) => {
    const r = (rMax * v) / 5;
    return [r1(cx + Math.cos(angle(i)) * r), r1(cy + Math.sin(angle(i)) * r)] as const;
  };
  const ring = (v: number) => chart.axes.map((_, i) => pt(i, v).join(',')).join(' ');
  // Puanı hesaplanamayan alan çizilmez; 1 gibi görünmesin.
  const poly = chart.axes.flatMap((a, i) => (a.value === null ? [] : [pt(i, a.value).join(',')])).join(' ');
  const hi = new Set(chart.highlight);
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={W} height={H}>
        {[1, 2, 3, 4, 5].map((v) => (
          <Polygon key={v} points={ring(v)} fill="none" stroke={C.rule} strokeWidth={v === 5 ? 1.2 : 0.8} />
        ))}
        {chart.axes.map((_, i) => {
          const [x, y] = pt(i, 5);
          return <Line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.rule} strokeWidth={0.8} />;
        })}
        <Polygon points={poly} fill={C.brassSoft} stroke={C.ink} strokeWidth={1.5} />
        {chart.axes.map((a, i) => {
          if (a.value === null) return null;
          const [x, y] = pt(i, a.value);
          return <Circle key={a.key} cx={x} cy={y} r={hi.has(a.key) ? 3.6 : 2.4} fill={hi.has(a.key) ? C.marker : C.ink} />;
        })}
        {chart.axes.map((a, i) => {
          const [x, y] = pt(i, 5.9);
          const anchor = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end';
          const label = `${a.label} ${a.value === null ? '—' : String(r1(a.value)).replace('.', ',')}`;
          return (
            <Text key={a.key} x={x} y={y + 3} textAnchor={anchor} style={{ fontFamily: 'Atkinson', fontSize: 9, fontWeight: hi.has(a.key) ? 700 : 400, fill: hi.has(a.key) ? C.ink : C.ink2 }}>
              {label}
            </Text>
          );
        })}
      </Svg>
    </View>
  );
}

/** Kişilerarası çember: her tarz kendi açısında; halkalar 1–5 değerlerini gösterir. */
function Circumplex({ chart }: { chart: Extract<SimpleChart, { type: 'circle' }> }) {
  const W = 340;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2 + 2;
  const rMax = 90;
  const pt = (angle: number, v: number) => {
    const r = (rMax * v) / 5;
    const t = (angle * Math.PI) / 180;
    return [r1(cx + Math.cos(t) * r), r1(cy - Math.sin(t) * r)] as const;
  };
  const ring = (v: number) => chart.axes.map((a) => pt(a.angle, v).join(',')).join(' ');
  // Puanı hesaplanamayan tarz çizilmez; 1 gibi görünmesin.
  const poly = chart.axes.flatMap((a) => (a.value === null ? [] : [pt(a.angle, a.value).join(',')])).join(' ');
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={W} height={H}>
        {[1, 2, 3, 4, 5].map((v) => (
          <Polygon key={v} points={ring(v)} fill="none" stroke={C.rule} strokeWidth={v === 5 ? 1.2 : 0.8} />
        ))}
        {chart.axes.map((a) => {
          const [x, y] = pt(a.angle, 5);
          return <Line key={a.key} x1={cx} y1={cy} x2={x} y2={y} stroke={C.rule} strokeWidth={0.8} />;
        })}
        <Polygon points={poly} fill={C.brassSoft} stroke={C.ink} strokeWidth={1.5} />
        {chart.axes.map((a) => {
          if (a.value === null) return null;
          const [x, y] = pt(a.angle, a.value);
          return <Circle key={a.key} cx={x} cy={y} r={2.6} fill={C.ink} />;
        })}
        {chart.axes.map((a) => {
          const [x, y] = pt(a.angle, 5.85);
          const anchor = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end';
          const label = `${a.label} ${a.value === null ? '—' : r1(a.value).toFixed(1).replace('.', ',')}`;
          return (
            <Text key={a.key} x={x} y={y + 3} textAnchor={anchor} style={{ fontFamily: 'Atkinson', fontSize: 9, fill: C.ink }}>
              {label}
            </Text>
          );
        })}
      </Svg>
    </View>
  );
}

function Bars({ rows }: { rows: Extract<SimpleChart, { type: 'bars' }>['rows'] }) {
  return (
    <View>
      {rows.map((row) => (
        <View key={row.label} wrap={false} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderTopWidth: 1, borderTopColor: C.rule }}>
          <Text style={{ width: 190, paddingRight: 8 }}>{row.label}</Text>
          <View style={{ flex: 1, height: 9, backgroundColor: C.surface2, borderRadius: 4.5 }}>
            <View style={{ width: `${row.max ? Math.max(0, Math.min(100, (row.value / row.max) * 100)) : 0}%`, height: 9, backgroundColor: C.ink, borderRadius: 4.5 }} />
          </View>
          <Text style={{ width: 52, textAlign: 'right', fontWeight: 700 }}>{row.valueLabel}</Text>
        </View>
      ))}
    </View>
  );
}

function Columns({ chart }: { chart: Extract<SimpleChart, { type: 'columns' }> }) {
  const W = 420;
  const H = 150;
  const top = 18;
  const base = H - 22;
  const n = chart.rows.length;
  const slot = W / n;
  const bw = Math.min(52, slot * 0.55);
  const max = Math.max(1, ...chart.rows.map((r) => r.value));
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={W} height={H}>
        <Line x1={0} y1={base} x2={W} y2={base} stroke={C.ruleStrong} strokeWidth={1} />
        {chart.rows.map((r, i) => {
          const h = (Math.max(0, r.value) / max) * (base - top);
          const x = i * slot + (slot - bw) / 2;
          return (
            <G key={r.label}>
              <Rect x={x} y={base - h} width={bw} height={h} fill={C.ink} />
              <Text x={x + bw / 2} y={base - h - 5} textAnchor="middle" style={{ fontFamily: 'Atkinson', fontSize: 9.5, fontWeight: 700, fill: C.ink }}>
                {String(r.value)}
              </Text>
              <Text x={x + bw / 2} y={base + 14} textAnchor="middle" style={{ fontFamily: 'Atkinson', fontSize: 8.5, fill: C.ink3 }}>
                {r.label}
              </Text>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

/** Motivasyon haritası (ekrandakiyle aynı hesap: lib/reports/simple.ts, quadrantGeometry). */
function Quadrant({ chart }: { chart: QuadrantChart }) {
  const box = { left: 40, top: 30, size: 220 };
  const { left: L, top: T, size: S } = box;
  const g = quadrantGeometry(chart, box);
  const W = 300;
  const H = 300;
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={W} height={H}>
        {g.cells.map((c) => (c.active ? <Rect key={c.key} x={c.x} y={c.y} width={c.w} height={c.h} fill={C.brassSoft} /> : null))}
        <Rect x={L} y={T} width={S} height={S} fill="none" stroke={C.rule} strokeWidth={0.8} />
        {g.cuts.map((c, i) => (
          <G key={i}>
            <Line x1={c.x} y1={T} x2={c.x} y2={T + S} stroke={C.ruleStrong} strokeWidth={0.8} strokeDasharray="3 3" />
            <Line x1={L} y1={c.y} x2={L + S} y2={c.y} stroke={C.ruleStrong} strokeWidth={0.8} strokeDasharray="3 3" />
          </G>
        ))}
        {g.corners.flatMap((c) =>
          c.lines.map((line, i) => (
            <Text
              key={`${c.key}-${i}`}
              x={c.anchor === 'end' ? c.x - 6 : c.x + 6}
              y={c.top ? c.y + 14 + i * 11 : c.y - 7 - (c.lines.length - 1 - i) * 11}
              textAnchor={c.anchor}
              style={{ fontFamily: 'Atkinson', fontSize: 8.5, fontWeight: c.active ? 700 : 400, fill: c.active ? C.ink : C.ink3 }}
            >
              {line}
            </Text>
          )),
        )}
        <Line x1={L} y1={T + S} x2={L + S + 9} y2={T + S} stroke={C.ink} strokeWidth={1.1} />
        <Polygon points={`${L + S + 15},${T + S} ${L + S + 8},${T + S - 3.5} ${L + S + 8},${T + S + 3.5}`} fill={C.ink} />
        <Line x1={L} y1={T + S} x2={L} y2={T - 9} stroke={C.ink} strokeWidth={1.1} />
        <Polygon points={`${L},${T - 15} ${L - 3.5},${T - 8} ${L + 3.5},${T - 8}`} fill={C.ink} />
        {g.ticks.map((t) => (
          <G key={t.v}>
            <Line x1={t.x} y1={T + S} x2={t.x} y2={T + S + 4} stroke={C.ink} strokeWidth={0.8} />
            <Text x={t.x} y={T + S + 13} textAnchor="middle" style={{ fontFamily: 'Atkinson', fontSize: 7.5, fill: C.ink3 }}>
              {String(t.v)}
            </Text>
            <Line x1={L - 4} y1={t.y} x2={L} y2={t.y} stroke={C.ink} strokeWidth={0.8} />
            <Text x={L - 7} y={t.y + 2.6} textAnchor="end" style={{ fontFamily: 'Atkinson', fontSize: 7.5, fill: C.ink3 }}>
              {String(t.v)}
            </Text>
          </G>
        ))}
        <Text x={L + S} y={T + S + 29} textAnchor="end" style={{ fontFamily: 'Atkinson', fontSize: 9.5, fontWeight: 700, fill: C.ink }}>
          {chart.x.label}
        </Text>
        <Text x={L + 9} y={T - 10} textAnchor="start" style={{ fontFamily: 'Atkinson', fontSize: 9.5, fontWeight: 700, fill: C.ink }}>
          {chart.y.label}
        </Text>
        {g.point && <Circle cx={g.point.x} cy={g.point.y} r={5.5} fill={C.marker} stroke={C.paper} strokeWidth={1.5} />}
      </Svg>
    </View>
  );
}

/* ---------- Kart grafikleri (ekrandakiyle aynı geometri: lib/reports/visuals.ts) ---------- */

const VW = 176;
const VFS = 7;
/** Bölgelerin gri tonları; kişinin bölgesi pirinç rengiyle vurgulanır. */
const ZONE_FILL = ['#dde3ec', '#cdd5e0'];

function GaugePdf({ v }: { v: GaugeVisual }) {
  const g = gaugeGeometry(v, VW, VFS);
  return (
    <Svg width={VW} height={g.height}>
      {g.zones.map((z, i) => (
        <Rect
          key={i}
          x={z.x}
          y={g.barY}
          width={Math.max(0, z.w - 0.8)}
          height={g.barH}
          rx={1.5}
          fill={z.active ? C.brassSoft : ZONE_FILL[i % 2]}
          stroke={z.active ? C.brass : undefined}
          strokeWidth={z.active ? 0.9 : 0}
        />
      ))}
      {g.ci && <Rect x={g.ci.x} y={g.barY + g.barH * 0.3} width={g.ci.w} height={g.barH * 0.4} rx={1} fill={C.band} />}
      {g.ticks.map((t, i) => (
        <Text key={i} x={t.x} y={g.tickY} textAnchor={t.anchor} style={{ fontFamily: 'Atkinson', fontSize: g.tickSize, fill: C.ink3 }}>
          {t.text}
        </Text>
      ))}
      {g.labels.map((l, i) => (
        <Text
          key={i}
          x={l.x}
          y={g.labelY(l.row)}
          textAnchor={l.anchor}
          style={{ fontFamily: 'Atkinson', fontSize: VFS, fontWeight: l.active ? 700 : 400, fill: l.active ? C.ink : C.ink2 }}
        >
          {l.text}
        </Text>
      ))}
      {g.marker && (
        <G>
          <Line x1={g.marker.x} y1={g.barY - 2} x2={g.marker.x} y2={g.barY + g.barH + 1.5} stroke={C.marker} strokeWidth={1.7} />
          <Path d={`M${g.marker.x - 3} ${g.barY - 5.5} L${g.marker.x + 3} ${g.barY - 5.5} L${g.marker.x} ${g.barY - 1.5} Z`} fill={C.marker} />
          <Text x={g.marker.x} y={g.barY - 7.5} textAnchor={g.marker.anchor} style={{ fontFamily: 'Atkinson', fontSize: VFS, fontWeight: 700, fill: C.ink }}>
            {g.marker.text}
          </Text>
        </G>
      )}
    </Svg>
  );
}

function ComparePdf({ v }: { v: CompareVisual }) {
  const g = compareGeometry(v, VW, VFS);
  return (
    <Svg width={VW} height={g.height}>
      {g.rows.map((row, i) => (
        <G key={i}>
          <Text x={0} y={row.labelY} style={{ fontFamily: 'Atkinson', fontSize: row.labelSize, fontWeight: 700, fill: C.ink }}>
            {row.label}
          </Text>
          <Text x={VW} y={row.labelY} textAnchor="end" style={{ fontFamily: 'Atkinson', fontSize: VFS, fontWeight: 700, fill: C.ink }}>
            {row.valueText}
          </Text>
          {row.zones.map((z, j) => (
            <Rect
              key={j}
              x={z.x}
              y={row.trackY}
              width={Math.max(0, z.w - 0.8)}
              height={4}
              rx={1}
              fill={z.active ? C.brassSoft : ZONE_FILL[j % 2]}
              stroke={z.active ? C.brass : undefined}
              strokeWidth={z.active ? 0.8 : 0}
            />
          ))}
          {row.dot !== null && <Circle cx={row.dot} cy={row.trackY + 2} r={3.2} fill={C.marker} stroke={C.paper} strokeWidth={1} />}
        </G>
      ))}
      {g.ticks.map((t, i) => (
        <Text key={i} x={t.x} y={g.axisY + g.fontSize} textAnchor={t.anchor} style={{ fontFamily: 'Atkinson', fontSize: g.tickSize, fill: C.ink3 }}>
          {t.text}
        </Text>
      ))}
      {g.labels.map((l, i) => (
        <Text key={i} x={l.x} y={g.labelY(l.row)} textAnchor={l.anchor} style={{ fontFamily: 'Atkinson', fontSize: VFS * 0.92, fill: C.ink2 }}>
          {l.text}
        </Text>
      ))}
    </Svg>
  );
}

/** Görev testlerinin grafiklerindeki renk adlarının PDF'teki karşılıkları (ekrandaki açık temayla aynı). */
const TONES: Record<Tone, string> = {
  fill: C.brass,
  soft: C.brassSoft,
  track: ZONE_FILL[0],
  track2: ZONE_FILL[1],
  ink: C.ink,
  ink2: C.ink2,
  ink3: C.ink3,
  axis: C.ruleStrong,
  marker: C.marker,
  surface: C.paper,
};

function DrawnPdf({ v }: { v: DrawnVisual }) {
  const d = drawVisual(v, VW, VFS);
  return (
    <Svg width={VW} height={d.height}>
      {d.shapes.map((s, i) => {
        switch (s.k) {
          case 'rect':
            return <Rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} fill={TONES[s.fill]} stroke={s.stroke ? TONES[s.stroke] : undefined} strokeWidth={s.sw ?? 0} />;
          case 'circle':
            return <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={TONES[s.fill]} stroke={s.stroke ? TONES[s.stroke] : undefined} strokeWidth={s.sw ?? 0} />;
          case 'line':
            return <Line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={TONES[s.stroke]} strokeWidth={s.sw} strokeDasharray={s.dash ? '2.2 1.8' : undefined} />;
          case 'path':
            return <Path key={i} d={s.d} fill={TONES[s.fill]} />;
          case 'text':
            return (
              <Text key={i} x={s.x} y={s.y} textAnchor={s.anchor} style={{ fontFamily: 'Atkinson', fontSize: s.size, fontWeight: s.weight === 600 ? 700 : s.weight, fill: TONES[s.fill] }}>
                {s.text}
              </Text>
            );
        }
      })}
    </Svg>
  );
}

function ItemVisualPdf({ visual }: { visual: ItemVisual }) {
  if (visual.type === 'gauge') return <GaugePdf v={visual} />;
  if (visual.type === 'compare') return <ComparePdf v={visual} />;
  return <DrawnPdf v={visual} />;
}

function Chart({ chart }: { chart: SimpleChart }) {
  if (chart.type === 'rulers') return <Rulers rows={chart.rows} />;
  if (chart.type === 'quadrant') return <Quadrant chart={chart} />;
  if (chart.type === 'hexagon') return <Hexagon chart={chart} />;
  if (chart.type === 'circle') return <Circumplex chart={chart} />;
  if (chart.type === 'bars') return <Bars rows={chart.rows} />;
  return <Columns chart={chart} />;
}

/* ---------- Sesli okuma ---------- */

const ORAL_TAGS = { sub: 'yanlış', omit: 'atladı', help: 'yardım', self: 'düzeltti', unclear: 'net değil' } as const;

/** Net anlaşılamayan kelime (otomatik analiz): gri, noktalı alt çizgi; hata sayılmaz. */
const UNCLEAR_STYLE = { color: C.ink3, textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: C.ink3 } as const;

function OralWord({ t }: { t: OralMarkedToken }) {
  const tags = [...(t.s ? [ORAL_TAGS[t.s]] : []), ...(t.hes ? ['durak'] : []), ...(t.syl ? ['hece'] : []), ...(t.rep ? ['tekrar'] : [])];
  const error = t.s === 'sub' || t.s === 'omit' || t.s === 'help';
  if (!tags.length && !t.ins) return <Text>{t.text} </Text>;
  if (t.s === 'unclear') {
    const other = tags.slice(1);
    return (
      <Text>
        <Text style={UNCLEAR_STYLE}>{t.text}</Text>
        <Text style={{ fontSize: 7, color: C.ink3 }}> (net değil</Text>
        {other.length > 0 && <Text style={{ fontSize: 7, color: C.warn }}>, {other.join(', ')}</Text>}
        <Text style={{ fontSize: 7, color: C.ink3 }}>)</Text>
        {t.ins ? <Text style={{ fontSize: 7, color: C.danger, fontWeight: 700 }}> +{t.ins} ekleme</Text> : null}
        <Text> </Text>
      </Text>
    );
  }
  const color = error ? C.danger : C.warn;
  return (
    <Text>
      <Text style={{ color, fontWeight: 700, textDecoration: t.s === 'omit' ? 'line-through' : error ? 'underline' : 'none' }}>{t.text}</Text>
      {tags.length > 0 && <Text style={{ fontSize: 7, color }}> ({tags.join(', ')})</Text>}
      {t.ins ? <Text style={{ fontSize: 7, color: C.danger, fontWeight: 700 }}> +{t.ins} ekleme</Text> : null}
      <Text> </Text>
    </Text>
  );
}

function OralTimelinePdf({ t }: { t: NonNullable<OralReportBlock['timeline']> }) {
  const W = 507;
  const H = 54;
  const bw = W / Math.max(1, t.contour.length);
  const secs = Math.round(t.totalMs / 1000);
  const step = secs > 120 ? 30 : secs > 40 ? 10 : 5;
  const ticks: number[] = [];
  for (let x = 0; x <= secs; x += step) ticks.push(x);
  return (
    <View wrap={false}>
      <Svg width={W} height={H + 14}>
        <Rect x={0} y={0} width={W} height={H} rx={5} fill={C.surface2} />
        {t.pauses.map(([a, b]) => (
          <Rect key={a} x={(a / t.totalMs) * W} y={0} width={Math.max(2, ((b - a) / t.totalMs) * W)} height={H} fill={C.pause} fillOpacity={0.35} />
        ))}
        {t.contour.map((v, i) => {
          const h = Math.max(1, (v / 100) * (H - 8));
          return <Rect key={i} x={i * bw + bw * 0.15} y={(H - h) / 2} width={bw * 0.7} height={h} fill={C.ink} />;
        })}
        {ticks.map((x) => (
          <Text key={x} x={Math.min(W - 10, (x / Math.max(1, secs)) * W)} y={H + 11} textAnchor={x === 0 ? 'start' : 'middle'} style={{ fontFamily: 'Atkinson', fontSize: 7, fill: C.ink3 }}>
            {x === 0 ? '0 sn' : String(x)}
          </Text>
        ))}
      </Svg>
      <Text style={s.note}>{t.caption}</Text>
    </View>
  );
}

function OralLevelPdf({ oral, you }: { oral: OralReportBlock; you: boolean }) {
  return (
    <View style={{ marginTop: 14, borderWidth: 1.2, borderColor: C.brass, backgroundColor: C.brassSoft, borderRadius: 8, padding: 12 }} wrap={false}>
      <Text style={{ fontSize: 8.5, color: C.ink2 }}>
        {you ? 'Okuduğun metin' : 'Okunan metin'}: “{oral.passage.title}” · {oral.passage.gradeLabel} · {oral.passage.genre} · {oral.passage.words} kelime
      </Text>
      <Text style={{ fontFamily: 'Bricolage', fontWeight: 700, fontSize: 18, lineHeight: 1.2, marginTop: 4 }}>{oral.level.label}</Text>
      <Text style={[s.para, { marginTop: 4 }]}>{oral.level.text}</Text>
      {oral.level.profile && <Text style={[s.para, { marginTop: 4, color: C.ink2 }]}>{oral.level.profile}</Text>}
    </View>
  );
}

function OralSectionsPdf({ report }: { report: SimpleReport }) {
  const oral = report.oral!;
  const you = report.audience !== 'parent';
  const cell = { paddingVertical: 4, paddingHorizontal: 6 };
  return (
    <View>
      {oral.method && (
        <View style={{ marginTop: 12, borderWidth: 1, borderColor: C.rule, backgroundColor: C.surface2, borderRadius: 6, padding: 10 }} wrap={false}>
          <Text style={{ fontWeight: 700, marginBottom: 3 }}>{oral.method.title}</Text>
          <Text style={s.para}>{oral.method.text}</Text>
        </View>
      )}

      <View wrap={false}>
        <Text style={s.h2}>Düzey nasıl belirlendi?</Text>
        {oral.criteria.map((c) => (
          <View key={c.label} style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.rule }}>
            <View style={[cell, { flex: 1 }]}>
              <Text style={{ fontWeight: 700 }}>{c.label}</Text>
              <Text style={{ fontSize: 8, color: C.ink3 }}>{c.rule}</Text>
            </View>
            <Text style={[cell, { width: 60, fontWeight: 700 }]}>{c.value}</Text>
            <Text style={[cell, { width: 70 }]}>{c.level}</Text>
          </View>
        ))}
        <Text style={s.note}>{oral.criteriaNote}</Text>
      </View>

      <Text style={s.h2} minPresenceAhead={80}>
        {you ? 'Okuman, kelime kelime' : 'Okuma, kelime kelime'}
      </Text>
      {oral.auto ? (
        <Text style={[s.paraSmall, { color: C.ink2, marginBottom: 6 }]}>
          Kırmızı kelimeler hata sayılanlar (yanlış okuma, atlama, ekleme), sarı kelimeler hata sayılmayan gözlemlerdir (kendi düzeltme, tekrar, heceleme,
          duraksama); gri, noktalı çizgili kelimeler net anlaşılamadı ve hata sayılmadı. İşaretin adı kelimenin yanında yazılıdır.
        </Text>
      ) : (
        <Text style={[s.paraSmall, { color: C.ink2, marginBottom: 6 }]}>
          Kırmızı kelimeler hata sayılanlar (yanlış okuma, atlama, yardımla okuma, ekleme), sarı kelimeler hata sayılmayan gözlemlerdir (kendi düzeltme,
          tekrar, heceleme, duraksama); işaretin adı kelimenin yanında yazılıdır.
        </Text>
      )}
      <View style={{ borderWidth: 1, borderColor: C.rule, borderRadius: 6, padding: 10 }}>
        {oral.marked.map((p, i) => (
          <Text key={i} style={{ fontSize: 11, lineHeight: 1.7, marginBottom: i < oral.marked.length - 1 ? 6 : 0 }}>
            {p.map((t, j) => (
              <OralWord key={j} t={t} />
            ))}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }} wrap={false}>
        {[
          { title: 'Hata sayılanlar', rows: oral.counted, color: C.danger },
          { title: 'Hata sayılmayanlar', rows: oral.notCounted, color: C.warn },
        ].map((g) => (
          <View key={g.title} style={{ flex: 1 }}>
            <Text style={{ fontWeight: 700, color: g.color, marginBottom: 2 }}>{g.title}</Text>
            {g.rows.map((r) => (
              <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.rule, paddingVertical: 3 }}>
                <Text>{r.label}</Text>
                <Text style={{ fontWeight: 700 }}>{String(r.value)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      {oral.unclear && (
        <Text style={[s.paraSmall, { marginTop: 6 }]}>
          <Text style={UNCLEAR_STYLE}>kelime</Text>
          <Text>
            {'  '}
            {oral.unclear.label}:{' '}
          </Text>
          <Text style={{ fontWeight: 700 }}>{String(oral.unclear.value)}</Text>
        </Text>
      )}
      {oral.substitutions.length > 0 && (
        <Text style={[s.paraSmall, { marginTop: 6 }]}>
          <Text style={{ fontWeight: 700 }}>{you ? 'Yanlış okuduğun kelimeler: ' : 'Yanlış okunan kelimeler: '}</Text>
          {oral.substitutions.map((x) => (x.said ? `${x.word} › ${x.said}` : x.word)).join(' · ')}
        </Text>
      )}

      {oral.timeline && (
        <View wrap={false}>
          <Text style={s.h2}>Okumanın ritmi</Text>
          <OralTimelinePdf t={oral.timeline} />
        </View>
      )}

      <Text style={s.h2} minPresenceAhead={60}>
        {report.itemsTitle}
      </Text>
      {report.items.map((it) => (
        // Kartın grafiği açıklamanın yanında (öteki raporlardaki gibi).
        <View key={it.title} style={s.item} wrap={false}>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ flex: 1 }}>
              <View style={s.itemHead}>
                <Text style={s.itemTitle}>{it.title}</Text>
                {it.badge && <Text style={s.itemBadge}>{it.badge}</Text>}
              </View>
              <Text style={s.para}>{it.text}</Text>
            </View>
            {it.visual && (
              <View style={{ width: VW, paddingTop: 2 }}>
                <ItemVisualPdf visual={it.visual} />
              </View>
            )}
          </View>
        </View>
      ))}

      {oral.prosodyTotal !== null && (
        <View wrap={false}>
          <Text style={s.h2}>
            Akıcılık: {oral.prosodyTotal} / 16 · {oral.prosodyLabel}
          </Text>
          {oral.prosody.map((p) => (
            <View key={p.name} style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.rule, paddingVertical: 4 }}>
              <Text style={{ width: 180, fontWeight: 700 }}>
                {p.name} · {p.value} / 4
              </Text>
              <Text style={[s.para, { flex: 1, color: C.ink2 }]}>{p.text}</Text>
            </View>
          ))}
        </View>
      )}

      <View wrap={false}>
        <Text style={s.h2}>{you ? 'Okuduğunu anlaman' : 'Okuduğunu anlama'}</Text>
        <Bars rows={oral.skills.map((x) => ({ label: x.label, value: x.correct, max: x.total, valueLabel: `${x.correct} / ${x.total}` }))} />
      </View>
      {oral.retell && (
        <View wrap={false} style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: 700, marginBottom: 3 }}>{you ? 'Metni anlatırken söylediğin fikirler' : 'Yeniden anlatmada söylenen fikirler'}</Text>
          {oral.retell.map((x) => (
            <View key={x.text} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginBottom: 2 }}>
              <View style={{ width: 8, height: 8, marginTop: 3, borderRadius: 4, borderWidth: 1.2, borderColor: x.said ? C.ok : C.ruleStrong, backgroundColor: x.said ? C.ok : C.paper }} />
              <Text style={[s.para, { flex: 1, color: x.said ? C.ink : C.ink3 }]}>
                {x.text}
                {x.core ? <Text style={{ fontSize: 8, fontWeight: 700, color: C.brassInk }}> (temel)</Text> : null}
                <Text style={{ fontSize: 8, color: C.ink3 }}>{x.said ? ' söylendi' : ' söylenmedi'}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.support} wrap={false}>
        <Text style={{ fontWeight: 700, marginBottom: 3 }}>Sonraki değerlendirme</Text>
        <Text style={s.para}>{oral.next}</Text>
        <Text style={[s.paraSmall, { marginTop: 4, color: C.ink2 }]}>
          {you ? 'Okumanı geliştirmek için öneriler gelişim yol haritasında.' : 'Okumayı geliştirmek için öneriler gelişim yol haritasındadır.'}
        </Text>
      </View>
    </View>
  );
}

/* ---------- Gelişim yol haritası ---------- */

/** Üç boyutlu profil: ekrandakiyle aynı hesap, sabit bir açıdan. */
function Profile3DPdf({ rm }: { rm: Roadmap }) {
  const W = 380;
  const H = 285;
  const scene = bars3dScene(
    rm.bars.map((b) => ({ ...b, valueLabel: b.valueLabel.split(' / ')[0] })),
    {
      yaw: defaultYaw(rm.bars.length),
      width: W,
      height: H,
      floor: { top: C.surface2, side: C.rule, stroke: C.ruleStrong },
      band: C.brass,
      label: { charWidth: 7.2, height: 13 },
    },
  );
  return (
    <View>
      <View style={{ alignItems: 'center' }}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {scene.polys.map((p, i) => (
          <Polygon
            key={i}
            points={p.points}
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth={0.6}
            fillOpacity={p.opacity ?? 1}
            strokeOpacity={p.opacity === undefined ? 0.6 : 0.8}
          />
        ))}
        {/* Değer yazısının arkasında beyaz zemin: öndeki sütunun yazısı arkadaki sütunun üstüne düşse de okunur. */}
        {scene.labels.map((l) => (
          <Rect key={`z-${l.key}`} x={l.x - l.text.length * 3.6 - 3} y={l.y - 10} width={l.text.length * 7.2 + 6} height={13} rx={3} fill={C.paper} fillOpacity={0.9} />
        ))}
        {scene.labels.map((l) => (
          <Text key={l.key} x={l.x} y={l.y} textAnchor="middle" style={{ fontFamily: 'Atkinson', fontSize: 11, fontWeight: 700, fill: C.ink }}>
            {l.text}
          </Text>
        ))}
        </Svg>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
        {rm.bars.map((b) => (
          <View key={b.key} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 2 }}>
            <View style={{ width: 8, height: 8, borderRadius: 1.5, backgroundColor: b.color }} />
            <Text style={{ fontSize: 9.5, fontWeight: 700 }}>{b.label}</Text>
            <Text style={{ fontSize: 9.5, color: C.ink2 }}>{b.valueLabel}</Text>
            <Text style={{ fontSize: 8.5, color: C.ink3 }}>{b.band}</Text>
          </View>
        ))}
      </View>
      <Text style={s.note}>
        {rm.barsNote ??
          (rm.bars.some((b) => b.ciLow !== null && b.ciHigh !== null)
            ? 'Sütunun yüksekliği puanı, sarı kılıf ölçüm payını gösterir.'
            : 'Sütunun yüksekliği puanı gösterir.')}
        {rm.bars.length > LABEL_ALL_MAX ? ` ${FRONT_LABELS_NOTE}` : ''}
      </Text>
    </View>
  );
}

function RoadmapPage({ rm, you, siteHost, kind, date }: { rm: Roadmap; you: boolean; siteHost: string; kind: string; date: string }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.top} fixed>
        <View>
          <Text style={s.brand}>Ölçekhane</Text>
          <Text style={s.tag}>Tahmin değil, ölçüm.</Text>
        </View>
        <View style={s.topRight}>
          <Text style={s.audience}>{kind}</Text>
          <Text style={{ fontSize: 8.5, color: C.ink3 }}>{date}</Text>
        </View>
      </View>

      <View style={s.chips}>
        <Text style={s.chip}>Gelişim yol haritası</Text>
        {rm.preview && <Text style={[s.chip, { color: C.ink2, backgroundColor: C.surface2 }]}>Önizleme · uzman incelemesinde</Text>}
      </View>
      <Text style={[s.title, { marginTop: 8 }]}>{you ? 'Senin yol haritan' : 'Çocuğunuz için yol haritası'}</Text>
      <Text style={[s.para, { color: C.ink2, marginTop: 6 }]}>{rm.intro}</Text>

      {rm.bars.length >= 3 && (
        <View wrap={false}>
          <Text style={s.h2}>{rm.barsTitle ?? (you ? 'Profilin üç boyutlu' : 'Profil üç boyutlu')}</Text>
          <Profile3DPdf rm={rm} />
        </View>
      )}

      <View wrap={false}>
        <Text style={s.h2}>Kısaca</Text>
        {rm.standout.length > 0 ? (
          // Üçten çok kart (ör. zihinsel görevlerde beş sonuç) iki sütunda sıralanır; tek satırda okunmaz hâle gelir.
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {rm.standout.map((x) => (
              <View
                key={x.title}
                style={[
                  { borderWidth: 1, borderColor: C.rule, borderRadius: 6, padding: 8 },
                  rm.standout.length > 3 ? { width: '48.5%' } : { flex: 1 },
                ]}
              >
                <Text style={{ fontSize: 8.5, color: C.ink3 }}>{x.title}</Text>
                <Text style={{ fontFamily: 'Bricolage', fontWeight: 700, fontSize: 12, lineHeight: 1.25 }}>{x.text}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={s.para}>{rm.standoutNote}</Text>
        )}
      </View>

      {rm.study.items.length > 0 && (
        <>
          <Text style={s.h2} minPresenceAhead={80}>
            {rm.study.title}
          </Text>
          <Text style={[s.para, { color: C.ink2, marginBottom: 4 }]}>{rm.study.intro}</Text>
          {rm.study.items.map((it) => (
            <View key={it.key} style={[s.item, { borderTopColor: it.color, borderTopWidth: 2 }]} wrap={false}>
              <View style={s.itemHead}>
                <Text style={s.itemTitle}>{it.title}</Text>
                <Text style={s.itemBadge}>{it.badge}</Text>
              </View>
              <Text style={s.para}>{it.text}</Text>
            </View>
          ))}
          {rm.study.links.length > 0 && (
            <Text style={s.note}>Ayrıntılı bilgi: {rm.study.links.map((l) => `${l.label} (${siteHost}${l.href})`).join(' · ')}</Text>
          )}
        </>
      )}

      {rm.settings && (
        <View wrap={false}>
          <Text style={s.h2}>{rm.settings.title}</Text>
          <Text style={[s.para, { marginBottom: 3 }]}>{rm.settings.intro}</Text>
          {rm.settings.items.map((x) => (
            <View key={x} style={s.bullet}>
              <Text>•</Text>
              <Text style={[s.para, { flex: 1 }]}>{x}</Text>
            </View>
          ))}
          <Text style={s.privacy}>{rm.settings.note}</Text>
        </View>
      )}

      {rm.approach && rm.approach.items.length > 0 && (
        <View>
          <Text style={s.h2} minPresenceAhead={150}>
            {rm.approach.title}
          </Text>
          {rm.approach.items.map((it) => (
            <View key={it.title} style={s.item} wrap={false}>
              <Text style={s.itemTitle}>{it.title}</Text>
              <Text style={s.para}>{it.text}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={s.h2} minPresenceAhead={80}>
        {weeksTitle(rm.weeks.length)}
      </Text>
      {rm.weeks.map((w) => (
        <View key={w.label} style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }} wrap={false}>
          <View style={{ width: 84 }}>
            <Text style={{ fontSize: 8.5, fontWeight: 700, color: C.ink3 }}>{w.label.toLocaleUpperCase('tr-TR')}</Text>
            <Text style={{ fontWeight: 700, fontSize: 10.5 }}>{w.title}</Text>
          </View>
          <Text style={[s.para, { flex: 1 }]}>{w.text}</Text>
        </View>
      ))}

      <View wrap={false}>
        <Text style={[s.h2, { fontSize: 11.5 }]}>Dayandığı araştırmalar</Text>
        {rm.sources.map((x, i) => (
          <Text key={x.text} style={[s.paraSmall, { color: C.ink2, marginBottom: 2 }]}>
            {i + 1}. {x.text} {x.url ?? ''}
          </Text>
        ))}
      </View>

      <View style={s.footer} fixed>
        <Text>{siteHost}</Text>
        <Text render={({ pageNumber, totalPages }) => `Sayfa ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

/* ---------- Konu tarama: soru soru inceleme ---------- */

/**
 * Soru metinleri PDF'te düz yazıyla: kesirler 3/4 biçiminde; yazı tipinde bulunmayan işaretler (sayılardaki dar boşluk,
 * kutu, alt simge, ok) karşılıklarıyla değiştirilir.
 */
function pdfMath(text: string): string {
  return plainMath(text)
    .replaceAll('\u202f', '\u00a0')
    .replaceAll('□', '[ ]')
    .replaceAll('₁', '1')
    .replaceAll('₂', '2')
    .replaceAll('→', '»');
}

const QUIZ_STATUS_PDF = { wrong: 'Yanlış', dontKnow: '“Bilmiyorum”', missing: 'Boş' } as const;

function PdfTable({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <View style={{ marginTop: 4, marginBottom: 2 }}>
      {caption && <Text style={[s.paraSmall, { color: C.ink3 }]}>{pdfMath(caption)}</Text>}
      <View style={{ borderWidth: 0.75, borderColor: C.rule, borderRadius: 4 }}>
        {[head, ...rows].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', borderTopWidth: i ? 0.75 : 0, borderTopColor: C.rule, backgroundColor: i ? C.paper : C.surface2 }}>
            {row.map((cell, j) => (
              <Text key={j} style={[s.paraSmall, { flex: 1, paddingHorizontal: 5, paddingVertical: 2, fontWeight: i ? 400 : 700 }]}>
                {pdfMath(cell)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Sorudaki tablo, grafik (değerleriyle) ya da şekil (sözlü anlatımıyla). */
function QuizVisualPdf({ table, chart, figure }: { table?: QuizTable; chart?: QuizChart; figure?: { alt: string } }) {
  return (
    <>
      {chart && (
        <PdfTable
          caption={`${chart.title} (grafikteki değerler)`}
          head={chart.labels}
          rows={[chart.values.map((v) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(v))]}
        />
      )}
      {table && <PdfTable caption={table.caption} head={table.head} rows={table.rows} />}
      {figure && <Text style={[s.paraSmall, { color: C.ink2, marginTop: 2 }]}>Şekil: {pdfMath(figure.alt)}</Text>}
    </>
  );
}

function QuizReviewPdf({ quiz, you }: { quiz: SimpleQuizReview; you: boolean }) {
  return (
    <View>
      <Text style={s.h2} minPresenceAhead={80}>
        {quiz.title}
      </Text>
      <Text style={[s.para, { color: C.ink2, marginBottom: 4 }]}>{quiz.intro}</Text>
      {quiz.questions.map((q) => (
        <View key={q.no} style={s.item} wrap={false}>
          <Text style={{ fontSize: 8.5, color: C.ink3 }}>
            {q.no}. soru · {q.domainName} · {QUIZ_STATUS_PDF[q.status]}
          </Text>
          <Text style={[s.para, { fontWeight: 700, marginTop: 2 }]}>{pdfMath(q.text)}</Text>
          <QuizVisualPdf table={q.table} chart={q.chart} figure={q.figure} />
          {q.chosen && (
            <Text style={[s.para, { marginTop: 3 }]}>
              <Text style={{ fontWeight: 700, color: C.danger }}>{you ? 'Senin cevabın: ' : 'Verilen cevap: '}</Text>
              {pdfMath(q.chosen)}
            </Text>
          )}
          <Text style={s.para}>
            <Text style={{ fontWeight: 700, color: C.ok }}>Doğru cevap: </Text>
            {pdfMath(q.answer)}
          </Text>
          {q.misconception && (
            <Text style={s.para}>
              <Text style={{ fontWeight: 700 }}>Hata türü: </Text>
              {q.misconception}
            </Text>
          )}
          <Text style={[s.para, { marginTop: 3, backgroundColor: C.surface2, padding: 5, borderRadius: 4 }]}>
            <Text style={{ fontWeight: 700 }}>Çözüm: </Text>
            {pdfMath(q.explain)}
          </Text>
        </View>
      ))}
      {(quiz.errors.length > 0 || quiz.questions.length > 0) && (
        <View>
          <Text style={s.h2} minPresenceAhead={80}>
            {quiz.errorsTitle}
          </Text>
          <Text style={[s.para, { color: C.ink2, marginBottom: 4 }]}>{quiz.errorsNote}</Text>
          {quiz.errors.map((e) => (
            <View key={e.name} style={s.item} wrap={false}>
              <View style={s.itemHead}>
                <Text style={s.itemTitle}>{e.name}</Text>
                <Text style={s.itemBadge}>{e.seen}</Text>
              </View>
              <Text style={s.para}>{pdfMath(e.explain)}</Text>
              <Text style={[s.para, { marginTop: 2 }]}>
                <Text style={{ fontWeight: 700 }}>Öneri: </Text>
                {pdfMath(e.tip)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/* ---------- Belge ---------- */

/** Bir raporun sayfaları (ana sayfa ve varsa yol haritası): tek raporun belgesinde ve Kendini Tanı Paketi'nin belgesinde. */
function ReportPages({ report, siteHost }: { report: SimpleReport; siteHost: string }) {
  const kind = report.audienceName ?? AUDIENCE_LABELS[report.audience].name;
  // Öğrenci ve yetişkin raporları ikinci tekil şahısla yazılır.
  const you = report.audience !== 'parent';
  const date = dateFmt.format(new Date(report.completedAt));
  const meta = [report.studentName, report.gradeLabel, date].filter(Boolean).join(' · ');
  return (
    <>
      <Page size="A4" style={s.page}>
        <View style={s.top} fixed>
          <View>
            <Text style={s.brand}>Ölçekhane</Text>
            <Text style={s.tag}>Tahmin değil, ölçüm.</Text>
          </View>
          <View style={s.topRight}>
            <Text style={s.audience}>{kind}</Text>
            <Text style={{ fontSize: 8.5, color: C.ink3 }}>{date}</Text>
          </View>
        </View>

        <Text style={s.title}>{report.instrumentName}</Text>
        <Text style={s.meta}>{meta}</Text>
        {report.isPilot && (
          <View style={s.chips}>
            <Text style={s.chip}>Pilot test</Text>
          </View>
        )}

        <Text style={s.privacy}>
          Bu rapor, {siteHost} adresinde hesap açmadan çözülen testten hazırlandı. Test cevapları ve bu rapor hiçbir yerde saklanmadı; raporun tek
          kopyası bu dosyadır.
        </Text>

        {report.cautions.length > 0 && (
          <View style={s.caution} wrap={false}>
            <Text style={s.cautionTitle}>{you ? 'Sonucunu okurken dikkat' : 'Bu sonucu dikkatle yorumlayın'}</Text>
            {report.cautions.map((c) => (
              <View key={c} style={s.bullet}>
                <Text>•</Text>
                <Text style={[s.para, { flex: 1 }]}>{c}</Text>
              </View>
            ))}
          </View>
        )}

        {report.oral && <OralLevelPdf oral={report.oral} you={you} />}

        {/* Dörtten çok sayı varsa üçerli satırlara bölünür (sayfa genişliğine sığsın). */}
        {report.keyFigures.length > 0 &&
          (report.keyFigures.length > 4 ? [report.keyFigures.slice(0, 3), report.keyFigures.slice(3)] : [report.keyFigures]).map((row, r) => (
            <View key={r} style={[s.figures, r > 0 ? { marginTop: 6 } : {}]} wrap={false}>
              {row.map((f, i) => (
                <View key={f.label} style={i === row.length - 1 ? s.figureLast : s.figure}>
                  <Text style={s.figureLabel}>{f.label}</Text>
                  {/* Dört kutulu satırda uzun bir değer ("Yorumlanmadı") kutuya sığsın diye küçük yazılır. */}
                  <Text style={row.length >= 4 && f.value.length > 9 ? [s.figureValue, { fontSize: 14 }] : s.figureValue}>{f.value}</Text>
                  {f.note && <Text style={s.figureNote}>{f.note}</Text>}
                </View>
              ))}
            </View>
          ))}

        {report.oral && <OralSectionsPdf report={report} />}

        {report.chart && (
          // Uzun cetvel listeleri (ör. 16 özellik) sayfaya sığmayınca bütün grafik bir sonraki sayfaya atlamasın, ilk
          // sayfa boş kalmasın diye bölünebilir; her cetvel satırı kendi içinde bölünmez.
          <View wrap={report.chart.type === 'rulers' && report.chart.rows.length > 10}>
            <Text style={s.h2} minPresenceAhead={120}>
              {report.chartTitle}
            </Text>
            <Chart chart={report.chart} />
            {report.chartNote && <Text style={s.note}>{report.chartNote}</Text>}
          </View>
        )}

        {!report.oral && (
          <Text style={s.h2} minPresenceAhead={60}>
            {report.itemsTitle}
          </Text>
        )}
        {report.groupsNote && <Text style={[s.note, { marginTop: 0, marginBottom: 6 }]}>{report.groupsNote}</Text>}
        {!report.oral && report.items.map((it) => (
          // Kartın grafiği açıklamanın yanında (ekrandaki geniş görünüm gibi). Uzun açıklamalı kartlar (birlikte yorum)
          // sayfaya sığmayabileceği için bölünebilir; grafik ilk parçada kalır.
          <View key={it.title} style={s.item} wrap={it.text.length > 900}>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ flex: 1 }}>
                <View style={s.itemHead}>
                  <Text style={s.itemTitle}>{it.title}</Text>
                  {it.badge && <Text style={s.itemBadge}>{it.badge}</Text>}
                </View>
                <Text style={s.para}>{it.text}</Text>
              </View>
              {it.visual && (
                <View style={{ width: VW, paddingTop: 2 }}>
                  <ItemVisualPdf visual={it.visual} />
                </View>
              )}
            </View>
          </View>
        ))}
        {report.groups?.map((g) => (
          <View key={g.title} style={{ marginTop: 12 }}>
            <View wrap={false} minPresenceAhead={70} style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ flex: 1 }}>
                <View style={s.itemHead}>
                  <Text style={[s.itemTitle, { fontFamily: 'Bricolage', fontSize: 12.5 }]}>{g.title}</Text>
                  <Text style={s.itemBadge}>{g.badge}</Text>
                </View>
                <Text style={[s.para, { marginBottom: 6 }]}>{g.text}</Text>
              </View>
              {g.visual && (
                <View style={{ width: VW, paddingTop: 2 }}>
                  <ItemVisualPdf visual={g.visual} />
                </View>
              )}
            </View>
            <Rulers rows={g.facets} />
          </View>
        ))}

        {report.quiz && <QuizReviewPdf quiz={report.quiz} you={you} />}

        {report.support && (
          <View style={s.support} wrap={false}>
            <Text style={{ fontWeight: 700, marginBottom: 3 }}>{report.support.title}</Text>
            {report.support.lines.map((l) => (
              <View key={l} style={s.bullet}>
                <Text>•</Text>
                <Text style={[s.para, { flex: 1 }]}>{l}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={s.disclaimer} wrap={false}>
          <Text style={s.paraSmall}>
            <Text style={{ fontWeight: 700 }}>{report.disclaimer.title}</Text> {report.disclaimer.text}
          </Text>
          <Text style={[s.paraSmall, { marginTop: 6 }]}>{report.normNote}</Text>
        </View>

        <View style={s.footer} fixed>
          <Text>{siteHost}</Text>
          <Text render={({ pageNumber, totalPages }) => `Sayfa ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
      {report.roadmap && <RoadmapPage rm={report.roadmap} you={you} siteHost={siteHost} kind={kind} date={date} />}
    </>
  );
}

export function SimpleReportDocument({ report, siteHost }: { report: SimpleReport; siteHost: string }) {
  const kind = report.audienceName ?? AUDIENCE_LABELS[report.audience].name;
  return (
    <Document title={`${report.instrumentName}: ${kind.toLocaleLowerCase('tr-TR')}`} author="Ölçekhane" creator="Ölçekhane" producer="Ölçekhane" language="tr-TR">
      <ReportPages report={report} siteHost={siteHost} />
    </Document>
  );
}

export async function renderSimpleReportPdf(report: SimpleReport, siteHost: string): Promise<Buffer> {
  await registerFonts();
  return renderToBuffer(<SimpleReportDocument report={report} siteHost={siteHost} />);
}

/* ---------- Kendini Tanı Paketi ---------- */

export interface PackagePdfInput {
  /** Paketteki testlerin raporları, paketteki sırayla (aynı kişiye: öğrenci, veli ya da yetişkin). */
  entries: PackageEntry[];
  /** Pakette olup çözülmeyen (atlanan) testlerin adları. */
  skipped: string[];
  gradeLabel: string;
  completedAt: Date;
}

/** Paket belgesinin ilk sayfası: başlık, gizlilik notu ve testlerin öne çıkan sonuçları (ekrandaki özetle aynı). */
function PackageSummaryPage({ input, siteHost }: { input: PackagePdfInput; siteHost: string }) {
  const first = input.entries[0].report;
  const you = first.audience !== 'parent';
  const kind = AUDIENCE_LABELS[first.audience].name;
  const date = dateFmt.format(input.completedAt);
  const summary = packageSummary(input.entries);
  return (
    <Page size="A4" style={s.page}>
      <View style={s.top} fixed>
        <View>
          <Text style={s.brand}>Ölçekhane</Text>
          <Text style={s.tag}>Tahmin değil, ölçüm.</Text>
        </View>
        <View style={s.topRight}>
          <Text style={s.audience}>{kind}</Text>
          <Text style={{ fontSize: 8.5, color: C.ink3 }}>{date}</Text>
        </View>
      </View>

      <Text style={s.title}>{PACKAGE_NAME}</Text>
      <Text style={s.meta}>{[input.gradeLabel, date].join(' · ')}</Text>

      <Text style={s.privacy}>
        Bu rapor, {siteHost} adresinde hesap açmadan art arda çözülen {input.entries.length} testten hazırlandı. Test cevapları ve bu rapor hiçbir
        yerde saklanmadı; raporun tek kopyası bu dosyadır.
      </Text>

      <Text style={s.h2}>{you ? 'Sonuçlarına kısa bir bakış' : 'Sonuçlara kısa bir bakış'}</Text>
      <Text style={[s.para, { color: C.ink2 }]}>{summaryIntro(you, input.entries.length)}</Text>

      {summary.map((t) => (
        <View key={t.slug} style={s.item} wrap={false}>
          <View style={s.itemHead}>
            <Text style={[s.itemTitle, { fontFamily: 'Bricolage', fontSize: 12 }]}>{t.name}</Text>
            <Text style={s.itemBadge}>{t.skill}</Text>
            {t.pilot && <Text style={s.chip}>Pilot test</Text>}
          </View>
          {t.lines.map((l) => (
            <View key={l.label} style={{ flexDirection: 'row', gap: 8, marginTop: 1.5 }}>
              <Text style={[s.para, { width: 190, color: C.ink2 }]}>{l.label}</Text>
              <Text style={[s.para, { flex: 1, fontWeight: 700 }]}>{l.value}</Text>
            </View>
          ))}
          {t.cautions > 0 && (
            <Text style={[s.note, { color: C.warn }]}>
              {you ? 'Bu testin raporunda okuman gereken bir uyarı var.' : 'Bu testin raporunda okumanız gereken bir uyarı var.'}
            </Text>
          )}
        </View>
      ))}

      {input.skipped.length > 0 && (
        <Text style={[s.note, { marginTop: 10 }]}>
          Pakette olup çözülmeyen {input.skipped.length === 1 ? 'test' : 'testler'}: {input.skipped.join(', ')}.
        </Text>
      )}

      <View style={s.disclaimer} wrap={false}>
        <Text style={s.paraSmall}>
          <Text style={{ fontWeight: 700 }}>Bu bir tanı değildir.</Text> Testler kişinin kendi cevaplarına ve o gün gösterdiği performansa dayanır.
          Testlerin bilimsel dayanağı, sınırları ve norm durumu her testin kendi raporunda yazar.
        </Text>
      </View>

      <View style={s.footer} fixed>
        <Text>{siteHost}</Text>
        <Text render={({ pageNumber, totalPages }) => `Sayfa ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

export function PackageReportDocument({ input, siteHost }: { input: PackagePdfInput; siteHost: string }) {
  const kind = AUDIENCE_LABELS[input.entries[0].report.audience].name;
  return (
    <Document title={`${PACKAGE_NAME}: ${kind.toLocaleLowerCase('tr-TR')}`} author="Ölçekhane" creator="Ölçekhane" producer="Ölçekhane" language="tr-TR">
      <PackageSummaryPage input={input} siteHost={siteHost} />
      {input.entries.map((e) => (
        <ReportPages key={e.slug} report={e.report} siteHost={siteHost} />
      ))}
    </Document>
  );
}

export async function renderPackageReportPdf(input: PackagePdfInput, siteHost: string): Promise<Buffer> {
  if (input.entries.length === 0) throw new Error('empty package');
  await registerFonts();
  return renderToBuffer(<PackageReportDocument input={input} siteHost={siteHost} />);
}
