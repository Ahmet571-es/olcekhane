import 'server-only';
import { join } from 'node:path';
import { Circle, Document, Font, G, Line, Page, Polygon, Rect, StyleSheet, Svg, Text, View, renderToBuffer } from '@react-pdf/renderer';
import { bars3dScene } from '@/lib/charts/bars3d';
import { AUDIENCE_LABELS } from '@/lib/config';
import type { Roadmap } from '@/lib/reports/roadmap';
import type { RulerRow, SimpleChart, SimpleReport } from '@/lib/reports/simple';

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

function Chart({ chart }: { chart: SimpleChart }) {
  if (chart.type === 'rulers') return <Rulers rows={chart.rows} />;
  if (chart.type === 'hexagon') return <Hexagon chart={chart} />;
  if (chart.type === 'circle') return <Circumplex chart={chart} />;
  if (chart.type === 'bars') return <Bars rows={chart.rows} />;
  return <Columns chart={chart} />;
}

/* ---------- Gelişim yol haritası ---------- */

/** Üç boyutlu profil: ekrandakiyle aynı hesap, sabit bir açıdan. */
function Profile3DPdf({ rm }: { rm: Roadmap }) {
  const W = 380;
  const H = 285;
  const scene = bars3dScene(
    rm.bars.map((b) => ({ ...b, valueLabel: b.valueLabel.split(' / ')[0] })),
    {
      yaw: 180 / Math.max(1, rm.bars.length),
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
        {rm.bars.some((b) => b.ciLow !== null && b.ciHigh !== null)
          ? 'Sütunun yüksekliği puanı, sarı kılıf ölçüm payını gösterir.'
          : 'Sütunun yüksekliği puanı gösterir.'}
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

      <View wrap={false}>
        <Text style={s.h2}>{you ? 'Profilin üç boyutlu' : 'Profil üç boyutlu'}</Text>
        <Profile3DPdf rm={rm} />
      </View>

      <View wrap={false}>
        <Text style={s.h2}>Kısaca</Text>
        {rm.standout.length > 0 ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {rm.standout.map((x) => (
              <View key={x.title} style={{ flex: 1, borderWidth: 1, borderColor: C.rule, borderRadius: 6, padding: 8 }}>
                <Text style={{ fontSize: 8.5, color: C.ink3 }}>{x.title}</Text>
                <Text style={{ fontFamily: 'Bricolage', fontWeight: 700, fontSize: 12, lineHeight: 1.25 }}>{x.text}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={s.para}>{rm.standoutNote}</Text>
        )}
      </View>

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
      <Text style={s.note}>Ayrıntılı bilgi: {rm.study.links.map((l) => `${l.label} (${siteHost}${l.href})`).join(' · ')}</Text>

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
        Dört haftalık küçük adımlar
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

/* ---------- Belge ---------- */

export function SimpleReportDocument({ report, siteHost }: { report: SimpleReport; siteHost: string }) {
  const kind = AUDIENCE_LABELS[report.audience].name;
  // Öğrenci ve yetişkin raporları ikinci tekil şahısla yazılır.
  const you = report.audience !== 'parent';
  const date = dateFmt.format(new Date(report.completedAt));
  const meta = [report.studentName, report.gradeLabel, date].filter(Boolean).join(' · ');
  return (
    <Document title={`${report.instrumentName}: ${kind.toLocaleLowerCase('tr-TR')}`} author="Ölçekhane" creator="Ölçekhane" producer="Ölçekhane" language="tr-TR">
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

        {report.keyFigures.length > 0 && (
          <View style={s.figures} wrap={false}>
            {report.keyFigures.map((f, i) => (
              <View key={f.label} style={i === report.keyFigures.length - 1 ? s.figureLast : s.figure}>
                <Text style={s.figureLabel}>{f.label}</Text>
                <Text style={s.figureValue}>{f.value}</Text>
                {f.note && <Text style={s.figureNote}>{f.note}</Text>}
              </View>
            ))}
          </View>
        )}

        {report.chart && (
          <View wrap={false}>
            <Text style={s.h2}>{report.chartTitle}</Text>
            <Chart chart={report.chart} />
            {report.chartNote && <Text style={s.note}>{report.chartNote}</Text>}
          </View>
        )}

        <Text style={s.h2} minPresenceAhead={60}>
          {report.itemsTitle}
        </Text>
        {report.groupsNote && <Text style={[s.note, { marginTop: 0, marginBottom: 6 }]}>{report.groupsNote}</Text>}
        {report.items.map((it) => (
          <View key={it.title} style={s.item} wrap={false}>
            <View style={s.itemHead}>
              <Text style={s.itemTitle}>{it.title}</Text>
              {it.badge && <Text style={s.itemBadge}>{it.badge}</Text>}
            </View>
            <Text style={s.para}>{it.text}</Text>
          </View>
        ))}
        {report.groups?.map((g) => (
          <View key={g.title} style={{ marginTop: 12 }}>
            <View wrap={false} minPresenceAhead={70}>
              <View style={s.itemHead}>
                <Text style={[s.itemTitle, { fontFamily: 'Bricolage', fontSize: 12.5 }]}>{g.title}</Text>
                <Text style={s.itemBadge}>{g.badge}</Text>
              </View>
              <Text style={[s.para, { marginBottom: 6 }]}>{g.text}</Text>
            </View>
            <Rulers rows={g.facets} />
          </View>
        ))}

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
    </Document>
  );
}

export async function renderSimpleReportPdf(report: SimpleReport, siteHost: string): Promise<Buffer> {
  await registerFonts();
  return renderToBuffer(<SimpleReportDocument report={report} siteHost={siteHost} />);
}
