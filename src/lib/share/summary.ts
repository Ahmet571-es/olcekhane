import { AUDIENCE_LABELS } from '@/lib/config';
import type { QuadrantChart, SimpleReport } from '@/lib/reports/simple';
import { weeksTitle } from '@/lib/reports/roadmap';
import type { ItemVisual } from '@/lib/reports/visuals';
import { SHARE_COLORS } from './card';

/**
 * Özet görsel (site sahibinin 2026-11-20 isteği ve seçimleri): her raporun yanında, raporu tek sayfada özetleyen ve PNG ya da
 * JPEG olarak indirilen görsel. Bütün testlerde ve bütün rapor türlerinde (öğrenci, veli, yetişkin) vardır; yalnızca
 * indirilir (Instagram ve WhatsApp'ta paylaş düğmesi eskisi gibi yalnızca paylaşım kartı olan testlerdedir, `card.ts`).
 *
 * Görsel raporu özetler, rapora yeni yorum eklemez: buradaki her yazı ve her sayı raporun kendisinden aynen alınır
 * (öne çıkan sayılar, grafik, kartların başlığı, rozeti ve grafiği, yol haritasının "Kısaca"sı, öneri başlıkları ve
 * haftaları, ilk uyarı). Destek kutusu, maddeler ve cevaplar görsele girmez. Görsel tarayıcıda çizilir (`summary-draw.ts`),
 * sunucuya gönderilmez ve saklanmaz. Kişi isterse adını yazar: ad yalnızca o cihazda görsele basılır (bu modelde ad yoktur).
 */

export const SUMMARY_W = 1080;

export interface SummaryTile {
  label: string;
  value: string;
  note: string | null;
}

/** Cetvel satırı: ölçeğin adı, düzeyi, kısa betimlemesi ve puanın yeri (0–1; hesaplanamadıysa null). */
export interface SummaryRow {
  label: string;
  band: string;
  note: string | null;
  t: number | null;
  color: string;
}

export interface SummaryAxis {
  label: string;
  value: number | null;
  /** Raporun grafiğinde yazan değer ("4,1"; hesaplanamadıysa "—"). */
  valueLabel: string;
  /** Derece; 0 = sağ, 90 = üst. */
  angle: number;
  highlight: boolean;
}

export type SummaryChart =
  | { kind: 'rows'; rows: SummaryRow[] }
  | { kind: 'radar'; min: number; max: number; axes: SummaryAxis[] }
  | { kind: 'bars'; rows: { label: string; value: number; max: number; valueLabel: string }[] }
  | { kind: 'columns'; rows: { label: string; value: number }[]; caption: string }
  | { kind: 'quadrant'; chart: QuadrantChart };

export interface SummaryCard {
  title: string;
  badge: string | null;
  /** Kartın rapordaki grafiği (yorumlanmayan kartta yok). */
  visual: ItemVisual | null;
}

export interface ReportSummary {
  slug: string;
  title: string;
  /** "Öğrenci raporu", "Veli raporu", "Kişisel rapor" ya da testin kendi rapor adı. */
  audienceLabel: string;
  gradeLabel: string;
  dateLabel: string;
  pilot: boolean;
  tiles: SummaryTile[];
  /** Raporun ilk uyarısı; `more`: raporda kalan uyarı sayısı. */
  caution: { title: string; text: string; more: number } | null;
  chart: { title: string; chart: SummaryChart } | null;
  cards: { title: string; items: SummaryCard[]; more: number } | null;
  /** Yol haritasının "Kısaca" bölümü: öne çıkan sonuçlar ya da hiçbiri öne çıkmıyorsa not. */
  points: { title: string; items: { title: string; text: string }[]; note: string | null } | null;
  /** Yol haritasının öneri başlıkları (yalnızca başlıklar ölçek adı değil, önerinin kendisiyse). */
  tips: { title: string; items: string[] } | null;
  steps: { title: string; items: { label: string; title: string; fromResult: boolean }[]; legend: { result: string; general: string } } | null;
  disclaimer: string;
  /** Testin sitedeki adresi: "/testler/bes-faktor-kisilik". */
  path: string;
  /** Dosya adının gövdesi; uzantı indirme sırasında eklenir. */
  fileBase: string;
}

export const SUMMARY_KICKER = 'Rapor özeti';
export const SUMMARY_PILOT = 'Pilot test';
/** Görselin altındaki not: özetin ne olduğu ve gizlilik. */
export const SUMMARY_FOOTER = 'Bu görsel raporun kısa özetidir; açıklamalar ve ayrıntılar raporun kendisindedir. Cevaplar hiçbir yerde saklanmaz.';
export const SUMMARY_META = { date: 'Rapor tarihi', grade: 'Sınıf', kind: 'Rapor türü' };
export const SUMMARY_MAX_CARDS = 8;
export const SUMMARY_MAX_POINTS = 6;
export const SUMMARY_MAX_TIPS = 5;

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
const nf1fixed = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** Sıralama kartlarının başındaki sıra numarası atılır: "1. Araştırmacı" → "Araştırmacı". */
const bare = (title: string) => title.replace(/^\d+\.\s*/, '');

/** Rozetin düzeyden sonraki betimlemesi: "Yüksek · Genelde sakin" → "Genelde sakin"; eşitlik notu atılır (paylaşım kartındaki gibi). */
function noteOf(badge: string | undefined): string | null {
  if (!badge) return null;
  const rest = badge.split(' · ').slice(1).filter((p) => p !== 'eşit puan');
  return rest.length > 0 ? rest.join(' · ') : null;
}

function badgeNotes(report: SimpleReport): Map<string, string> {
  const m = new Map<string, string>();
  for (const it of [...report.items, ...(report.groups ?? [])]) {
    const n = noteOf(it.badge);
    if (n) m.set(bare(it.title), n);
  }
  return m;
}

function chartOf(report: SimpleReport): SummaryChart | null {
  const c = report.chart;
  if (!c) return null;
  // Satırı ya da ekseni olmayan grafik çizilmez.
  if (c.type !== 'quadrant' && ('rows' in c ? c.rows : c.axes).length === 0) return null;
  switch (c.type) {
    case 'rulers': {
      const notes = badgeNotes(report);
      return {
        kind: 'rows',
        rows: c.rows.map((r, i) => ({
          label: r.label,
          band: r.band,
          note: notes.get(r.label) ?? null,
          t: r.value === null ? null : Math.min(1, Math.max(0, (r.value - r.min) / (r.max - r.min || 1))),
          color: SHARE_COLORS[i % SHARE_COLORS.length],
        })),
      };
    }
    case 'hexagon': {
      const top = new Set(c.highlight);
      return {
        kind: 'radar',
        min: 1,
        max: 5,
        axes: c.axes.map((a, i) => ({ label: a.label, value: a.value, valueLabel: a.value === null ? '—' : nf1.format(a.value), angle: 90 - i * 60, highlight: top.has(a.key) })),
      };
    }
    case 'circle':
      return {
        kind: 'radar',
        min: 1,
        max: 5,
        axes: c.axes.map((a) => ({ label: a.label, value: a.value, valueLabel: a.value === null ? '—' : nf1fixed.format(a.value), angle: a.angle, highlight: false })),
      };
    case 'bars':
      return { kind: 'bars', rows: c.rows.map((r) => ({ label: r.label, value: r.value, max: r.max, valueLabel: r.valueLabel })) };
    case 'columns':
      return { kind: 'columns', rows: c.rows.map((r) => ({ label: r.label, value: r.value })), caption: c.caption };
    case 'quadrant':
      return { kind: 'quadrant', chart: c };
  }
}

/** Grafikte zaten satırı ya da ekseni olan ölçeklerin adları: aynı ölçek kart olarak ikinci kez gösterilmez. */
function chartLabels(chart: SummaryChart | null): Set<string> {
  if (!chart) return new Set();
  if (chart.kind === 'rows') return new Set(chart.rows.map((r) => r.label));
  if (chart.kind === 'radar') return new Set(chart.axes.map((a) => a.label));
  return new Set();
}

/** Raporun özeti. `slug`: testin adresi (görseldeki bağlantı ve dosya adı için). */
export function reportSummary(slug: string, report: SimpleReport): ReportSummary {
  const chart = chartOf(report);
  const shown = chartLabels(chart);
  const all: SummaryCard[] = [
    ...report.items.map((it) => ({ title: it.title, badge: it.badge || null, visual: it.interpreted === false ? null : (it.visual ?? null) })),
    ...(report.groups ?? []).map((g) => ({ title: g.title, badge: g.badge || null, visual: g.visual ?? null })),
  ]
    // Ne rozeti ne grafiği olan kartın (yalnızca metin) özette gösterecek bir şeyi yoktur.
    .filter((c) => c.badge !== null || c.visual !== null);
  // Kartların hepsi grafikteki ölçeklerin kendisiyse (ör. kişilik profilinde her boyutun kartı) bölüm yinelenmez: düzey ve
  // betimleme grafiğin satırında yazar. Yoksa raporun kartları olduğu gibi gösterilir (başlıkları bölümün adıyla uyuşsun).
  const mirror = all.every((c) => shown.has(bare(c.title)));
  const cards = mirror ? [] : all.slice(0, SUMMARY_MAX_CARDS);

  const rm = report.roadmap;
  const standout = (rm?.standout ?? []).slice(0, SUMMARY_MAX_POINTS);
  // "Kısaca"nın her satırı görseldeki bir kartın başlığı ve rozetiyle (ya da rozetin düzey kısmıyla: "Yüksek ilgi · eşit puan")
  // aynıysa bölüm yinelenmez; görev testlerinde ve öne çıkan alanları kart kart gösteren ilgi testlerinde böyledir.
  const repeats =
    standout.length > 0 && standout.every((s) => cards.some((c) => bare(c.title) === s.title && (c.badge === s.text || c.badge?.split(' · ')[0] === s.text)));
  const points =
    rm && !repeats && (standout.length > 0 || rm.standoutNote)
      ? { title: 'Kısaca', items: standout.map((s) => ({ title: s.title, text: s.text })), note: standout.length > 0 ? null : rm.standoutNote }
      : null;

  // Öneri başlıkları yalnızca önerinin kendisini söylüyorsa ("Kısa bölümler") listelenir; başlık bir ölçeğin adıysa
  // ("Dışadönüklük") öneri metni olmadan bir şey anlatmaz.
  const known = new Set([...shown, ...(rm?.standout ?? []).map((s) => s.title), ...report.items.map((it) => bare(it.title)), ...(report.groups ?? []).map((g) => g.title)]);
  const tipTitles = (rm?.study.items ?? []).map((s) => s.title);
  const tips = rm && tipTitles.length > 0 && tipTitles.every((t) => !known.has(t)) ? { title: rm.study.title, items: tipTitles.slice(0, SUMMARY_MAX_TIPS) } : null;

  const timeline = rm?.weeksGraphic.visual;
  const legend = timeline && timeline.type === 'timeline' ? timeline.legend : { result: 'Sonuca göre seçildi', general: 'Genel öneri' };
  const steps = rm && rm.weeks.length > 0 ? { title: weeksTitle(rm.weeks.length), items: rm.weeks.map((w) => ({ label: w.label, title: w.title, fromResult: w.fromResult })), legend } : null;

  const you = report.audience !== 'parent';
  return {
    slug,
    title: report.instrumentName,
    audienceLabel: report.audienceName ?? AUDIENCE_LABELS[report.audience].name,
    gradeLabel: report.gradeLabel,
    dateLabel: dateFmt.format(new Date(report.completedAt)),
    pilot: report.isPilot,
    tiles: report.keyFigures.slice(0, 4).map((k) => ({ label: k.label, value: k.value, note: k.note ?? null })),
    caution:
      report.cautions.length > 0
        ? { title: you ? 'Sonucunu okurken dikkat' : 'Bu sonucu dikkatle yorumlayın', text: report.cautions[0], more: report.cautions.length - 1 }
        : null,
    chart: chart ? { title: report.chartTitle, chart } : null,
    cards: cards.length > 0 ? { title: report.itemsTitle, items: cards, more: all.length - cards.length } : null,
    points,
    tips,
    steps,
    disclaimer: report.disclaimer.title,
    path: `/testler/${slug}`,
    fileBase: `olcekhane-${slug}-${AUDIENCE_LABELS[report.audience].file}-ozet`,
  };
}

/** Raporda kalan başlık ya da uyarı sayısının cümlesi. */
export const moreCardsLine = (n: number) => `Raporda ${n} başlık daha var.`;
export const moreCautionsLine = (n: number) => `Raporda ${n} uyarı daha var.`;

/** Görselin üstüne yazılan bütün metinler (yazı tiplerinin gereken harf kümeleri önceden yüklensin diye). */
export function summaryText(s: ReportSummary, host: string, name: string): string {
  const parts = [SUMMARY_KICKER, SUMMARY_PILOT, SUMMARY_FOOTER, ...Object.values(SUMMARY_META), 'Ölçekhane', name, s.title, s.audienceLabel, s.gradeLabel, s.dateLabel, s.disclaimer, host, s.path];
  for (const t of s.tiles) parts.push(t.label, t.value, t.note ?? '');
  if (s.caution) parts.push(s.caution.title, s.caution.text, moreCautionsLine(s.caution.more));
  if (s.chart) {
    parts.push(s.chart.title);
    const c = s.chart.chart;
    if (c.kind === 'rows') for (const r of c.rows) parts.push(r.label, r.band, r.note ?? '');
    else if (c.kind === 'radar') for (const a of c.axes) parts.push(a.label, a.valueLabel);
    else if (c.kind === 'bars') for (const r of c.rows) parts.push(r.label, r.valueLabel);
    else if (c.kind === 'columns') parts.push(c.caption, ...c.rows.map((r) => r.label));
    else parts.push(c.chart.x.label, c.chart.y.label, ...c.chart.corners.map((k) => k.label));
  }
  if (s.cards) {
    parts.push(s.cards.title, moreCardsLine(s.cards.more));
    for (const c of s.cards.items) parts.push(c.title, c.badge ?? '');
  }
  if (s.points) {
    parts.push(s.points.title, s.points.note ?? '');
    for (const p of s.points.items) parts.push(p.title, p.text);
  }
  if (s.tips) parts.push(s.tips.title, ...s.tips.items);
  if (s.steps) {
    parts.push(s.steps.title, s.steps.legend.result, s.steps.legend.general);
    for (const w of s.steps.items) parts.push(w.label, w.title);
  }
  return `${parts.join(' ')} 0123456789 abcçdefgğhıijklmnoöprsştuüvyz ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ`;
}
