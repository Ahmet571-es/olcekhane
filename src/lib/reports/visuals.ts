import type { ReportTemplate } from '@/content/reports/types';
import type { AnchoredBands, Band } from '@/lib/instruments/types';
import { DEFAULT_BAND_LABELS, nearestBand } from './bands';

/**
 * Rapor kartlarının grafikleri: her sonuç kartının (ölçek, alan, birlikte yorum) yanında, kartın sözel açıklamasını
 * görsel olarak da anlatan küçük bir grafik. Ekranda (components/report/item-visual.tsx) ve PDF'te (lib/pdf/simple-report.tsx)
 * aynı geometriyle çizilir; geometri buradadır.
 *
 *  - Düzey çubuğu (`gauge`): ölçeğin bütün aralığı, düzey bölgeleri (Düşük, Orta, Yüksek…; eşikler testin kendi eşikleridir),
 *    kişinin bölgesi vurgulu, puanı kırmızı işaretle; ölçüm payı varsa sarı bantla.
 *  - Yan yana (`compare`): birkaç ölçek aynı eksende; her satırda ölçeğin adı, puanı ve bölgesi. "Birlikte bakınca" gibi
 *    ölçekleri birlikte yorumlayan kartlarda.
 * Kişilik ölçeklerinde uçların iyi ya da kötü anlamı olmadığı için renkler tek tonludur: bölgeler gri tonlarında, kişinin
 * bölgesi pirinç rengiyle vurgulanır (iyi ya da kötü çağrışımı yapan yeşil ya da kırmızı bölge yoktur).
 */

/** Bir düzey bölgesi: [from, to) aralığı (son bölge `to` dahil), adı ve şablondaki düzey anahtarı. */
export interface Zone {
  from: number;
  to: number;
  label: string;
  band: Band;
}

export interface GaugeVisual {
  type: 'gauge';
  /** Ekran okuyucu ve PDF için ölçeğin adı. */
  label: string;
  value: number | null;
  min: number;
  max: number;
  ciLow: number | null;
  ciHigh: number | null;
  valueLabel: string;
  zones: Zone[];
  /** Kişinin bölgesinin sırası (`zones` içinde); puan hesaplanamadıysa null. */
  active: number | null;
  /** Değer tam sayıdır (ör. doğru sayısı): bölgeler sözel karşılıkta "0–9, 10–14, 15–20" diye yazılır. */
  discrete?: boolean;
}

export interface CompareRow {
  label: string;
  value: number | null;
  valueLabel: string;
  /** Kişinin bölgesinin sırası (grafiğin ortak bölgelerinde); puan hesaplanamadıysa null. */
  active: number | null;
}

export interface CompareVisual {
  type: 'compare';
  min: number;
  max: number;
  /** Bütün satırların ortak bölgeleri (satırların eşikleri aynıdır); bölge adları eksenin altında yazılır. */
  zones: Zone[];
  rows: CompareRow[];
}

/*
 * Görev (zekâ ve dikkat) testlerinin kart grafikleri. Çizimleri lib/reports/visual-draw.ts'tedir: her tür, ekranda ve PDF'te
 * aynı biçimde çizilen basit şekillere (dikdörtgen, daire, çizgi, yazı) çevrilir. Renkler tek tonludur: kişinin sonucu pirinç
 * rengiyle, geri kalanı gri tonlarıyla gösterilir; doğru ve yanlış için yeşil ya da kırmızı kullanılmaz.
 */

/**
 * Satır satır kareler: her satırda `total` kare, `filled` tanesi dolu (ör. bir düzeydeki 5 sorunun 4'ü doğru). Kare sayısı
 * çoksa satır alt satıra geçer. `legend`: dolu ve boş karenin anlamı.
 */
export interface DotsVisual {
  type: 'dots';
  /** Grafiğin ne gösterdiği (ekran okuyucu için): "Düzeylere göre doğru cevaplar". */
  label: string;
  rows: { label: string; filled: number; total: number; valueLabel: string }[];
  legend: [string, string];
}

/**
 * Yatay çubuklar. `share`: her çubuk kendi en çoğuna göre dolar (ör. bir türdeki 6 sorunun 4'ü doğru). `scale`: bütün
 * çubuklar ortak bir eksende (ör. saniye); eksenin en çoğu `max`, birimi `unit`. `reference`: kesikli dikey çizgi (ör.
 * rastgele gösterilen yönlerin ortalama hatası).
 */
export interface BarsVisual {
  type: 'bars';
  label: string;
  scale: 'share' | 'scale';
  rows: { label: string; value: number; valueLabel: string; max?: number }[];
  max?: number;
  unit?: string;
  reference?: { value: number; label: string };
}

/** Bir bütünün parçaları tek çubukta (ör. 20 problemin 18'i en az hamlede, 2'si fazla hamleyle); altında lejant. */
export interface StackVisual {
  type: 'stack';
  label: string;
  total: number;
  parts: { label: string; value: number }[];
}

/** Basamaklar: kolaydan zora düzeyler ve ulaşılan düzey (`reached`; 0: hiçbir düzey belirtilmedi). */
export interface StepsVisual {
  type: 'steps';
  label: string;
  steps: string[];
  reached: number;
  valueLabel: string;
  caption: string;
}

/** Dikey sütunlar: sıralı ölçümler (ör. üç denemede hatırlanan kelimeler, bölüm bölüm net doğru). */
export interface ColumnsVisual {
  type: 'columns';
  label: string;
  rows: { label: string; value: number; valueLabel: string }[];
  max: number;
  caption?: string;
}

/**
 * Nokta şeridi: bir eksen üzerinde tek tek ölçümler (ör. her sorudaki yön hatası) ya da tipik değer ve çoğu ölçümün düştüğü
 * aralık (`box`). `zone`: vurgulu aralık (ör. doğru yöne çok yakın cevaplar), `reference`: kesikli çizgi.
 */
export interface StripVisual {
  type: 'strip';
  label: string;
  min: number;
  max: number;
  unit: string;
  points: number[];
  marker?: { value: number; label: string };
  /** Ölçümlerin çoğunun (ör. tepkilerin en az yarısının) düştüğü aralık; `label` açıklamada kullanılır. */
  box?: { low: number; high: number; label?: string };
  zone?: { from: number; to: number; label: string };
  reference?: { value: number; label: string };
  /** Alttaki açıklama (ör. "Her nokta bir soru"). */
  caption?: string;
}

/**
 * Dizi merdiveni: her uzunluktaki denemeler (dolu daire doğru, boş daire yanlış) ve doğru tekrarlanan en uzun dizi. Görev daha
 * kısa bir dizide bittiyse sorulmayan uzunlukların denemeleri boştur (`results: []`; soluk çizilir).
 */
export interface LadderVisual {
  type: 'ladder';
  label: string;
  rows: { length: number; results: boolean[] }[];
  reached: number | null;
  /** Uzunluğun birimi: "rakam", "kutu". */
  unit: string;
  /** Dolu ve boş dairenin adı (varsayılan "doğru" / "yanlış"; ör. hesapla ve hatırlada "tam" / "eksik"). */
  legend?: [string, string];
  /** Alttaki açıklama (varsayılan "Dizideki <birim> sayısı") ve ulaşılan uzunluğun adı (varsayılan "En uzun"). */
  caption?: string;
  bestLabel?: string;
}

export type ItemVisual = GaugeVisual | CompareVisual | DotsVisual | BarsVisual | StackVisual | StepsVisual | ColumnsVisual | StripVisual | LadderVisual;

/**
 * Ölçeğin düzey bölgeleri: testin eşikleri (anchoredBands) ve şablonun düzey adları. Şablonda metni olmayan düzey en yakın
 * düzeye indirgenir (rapordaki gibi; ör. "çok düşük" puan "Düşük" metniyle anlatılır) ve aynı düzeye düşen komşu bölgeler
 * birleştirilir: ekrandaki bölge adları kartın rozetindeki düzey adıyla aynıdır.
 */
export function bandZones(
  bands: AnchoredBands,
  template: Pick<ReportTemplate, 'bandLabels' | 'scales'> | undefined,
  scaleKey: string,
  min: number,
  max: number,
): Zone[] {
  const th = [...bands.thresholds].sort((a, b) => a.min - b.min);
  const available = (b: Band) => !!template?.scales[scaleKey]?.[b];
  const out: Zone[] = [];
  th.forEach((t, i) => {
    const from = i === 0 ? min : Math.max(min, t.min);
    const to = i + 1 < th.length ? Math.min(max, th[i + 1].min) : max;
    if (to <= from) return;
    const band = nearestBand(t.band, available);
    const label = template?.bandLabels[band] ?? DEFAULT_BAND_LABELS[band];
    const last = out[out.length - 1];
    if (last && last.band === band) last.to = to;
    else out.push({ from, to, label, band });
  });
  return out;
}

/* ---------- Geometri (ekran ve PDF ortak) ---------- */

/** Yazı genişliği tahmini (Atkinson Hyperlegible; harf başına yazı boyunun ~0,56'sı). */
export const textWidth = (text: string, fontSize: number) => text.length * fontSize * 0.56;

const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
export const formatTick = (v: number) => nf1.format(Math.round(v * 10) / 10);
/** Açıklamalarda en çok iki ondalık: 0.42 → "0,42", 90 → "90". */
const nf2max = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
const nf2fixed = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export interface LabelSpot {
  text: string;
  x: number;
  row: number;
  anchor: 'start' | 'middle' | 'end';
  active: boolean;
}

/**
 * Bölge adlarını bölgelerin ortasına yerleştirir; kenara taşan ad kenara yaslanır. Adlar tek satıra sığmıyorsa sırayla iki
 * satıra (1., 3., 5. bölge üstte; 2., 4. altta), yine sığmıyorsa üç satıra dağıtılır: uzun adlar ("Belirgin biçimde
 * yüksek") da birbirinin üstüne binmez ve her ad kendi bölgesinin altında kalır.
 */
export function placeZoneLabels(zones: Zone[], x: (v: number) => number, width: number, fontSize: number, active: number | null): LabelSpot[] {
  const gap = fontSize * 0.7;
  const spots = zones.map((z, i) => {
    const w = textWidth(z.label, fontSize);
    const cx = (x(z.from) + x(z.to)) / 2;
    if (cx - w / 2 < 0) return { text: z.label, left: 0, w, x: 0, anchor: 'start' as const, active: i === active };
    if (cx + w / 2 > width) return { text: z.label, left: width - w, w, x: width, anchor: 'end' as const, active: i === active };
    return { text: z.label, left: cx - w / 2, w, x: cx, anchor: 'middle' as const, active: i === active };
  });
  const fits = (k: number) =>
    spots.every((sp, i) => {
      const prev = i - k >= 0 ? spots[i - k] : null;
      return !prev || sp.left >= prev.left + prev.w + gap;
    });
  const k = [1, 2, 3].find(fits) ?? 3;
  return spots.map((sp, i) => ({ text: sp.text, x: sp.x, row: i % k, anchor: sp.anchor, active: sp.active }));
}

export interface GaugeGeometry {
  width: number;
  height: number;
  /** Çubuğun üst kenarı ve yüksekliği. */
  barY: number;
  barH: number;
  zones: { x: number; w: number; active: boolean }[];
  /** Bölge sınırlarındaki sayılar (aralığın uçları dahil). */
  ticks: { x: number; text: string; anchor: 'start' | 'middle' | 'end' }[];
  tickY: number;
  labels: LabelSpot[];
  labelY: (row: number) => number;
  marker: { x: number; text: string; anchor: 'start' | 'middle' | 'end' } | null;
  ci: { x: number; w: number } | null;
  fontSize: number;
  /** Bölge sınırlarındaki sayıların yazı boyu. */
  tickSize: number;
}

export function gaugeGeometry(v: GaugeVisual, width: number, fontSize: number): GaugeGeometry {
  const pad = 2;
  const span = v.max - v.min || 1;
  const x = (val: number) => pad + ((Math.min(v.max, Math.max(v.min, val)) - v.min) / span) * (width - 2 * pad);
  const barY = fontSize * 1.9;
  const barH = fontSize * 1.25;
  const tickY = barY + barH + fontSize * 1.15;
  const bounds = [v.min, ...v.zones.slice(1).map((z) => z.from), v.max];
  const ticks = bounds.map((b, i) => ({
    x: x(b),
    text: formatTick(b),
    anchor: (i === 0 ? 'start' : i === bounds.length - 1 ? 'end' : 'middle') as 'start' | 'middle' | 'end',
  }));
  const labels = placeZoneLabels(v.zones, x, width, fontSize, v.active);
  const labelY = (row: number) => tickY + fontSize * 1.35 + row * fontSize * 1.3;
  const rows = Math.max(1, ...labels.map((l) => l.row + 1));
  let marker: GaugeGeometry['marker'] = null;
  if (v.value !== null) {
    const mx = x(v.value);
    const w = textWidth(v.valueLabel, fontSize);
    marker = { x: mx, text: v.valueLabel, anchor: mx - w / 2 < 0 ? 'start' : mx + w / 2 > width ? 'end' : 'middle' };
  }
  const ci =
    v.value !== null && v.ciLow !== null && v.ciHigh !== null ? { x: x(v.ciLow), w: Math.max(1.5, x(v.ciHigh) - x(v.ciLow)) } : null;
  return {
    width,
    height: labelY(rows - 1) + fontSize * 0.45,
    barY,
    barH,
    zones: v.zones.map((z, i) => ({ x: x(z.from), w: x(z.to) - x(z.from), active: i === v.active })),
    ticks,
    tickY,
    labels,
    labelY,
    marker,
    ci,
    fontSize,
    tickSize: fontSize * 0.85,
  };
}

export interface CompareGeometry {
  width: number;
  height: number;
  rows: {
    labelY: number;
    label: string;
    /** Adın yazı boyu: ad ile puan aynı satıra sığmazsa küçülür. */
    labelSize: number;
    valueText: string;
    trackY: number;
    zones: { x: number; w: number; active: boolean }[];
    dot: number | null;
  }[];
  axisY: number;
  ticks: { x: number; text: string; anchor: 'start' | 'middle' | 'end' }[];
  labels: LabelSpot[];
  labelY: (row: number) => number;
  fontSize: number;
  tickSize: number;
}

export function compareGeometry(v: CompareVisual, width: number, fontSize: number): CompareGeometry {
  const pad = 4;
  const span = v.max - v.min || 1;
  const x = (val: number) => pad + ((Math.min(v.max, Math.max(v.min, val)) - v.min) / span) * (width - 2 * pad);
  const rowH = fontSize * 2.75;
  const rows = v.rows.map((r, i) => {
    const top = i * rowH;
    const room = width - textWidth(r.valueLabel, fontSize) - fontSize;
    return {
      labelY: top + fontSize,
      label: r.label,
      labelSize: Math.min(fontSize, room / Math.max(1, r.label.length * 0.56)),
      valueText: r.valueLabel,
      trackY: top + fontSize * 1.75,
      zones: v.zones.map((z, j) => ({ x: x(z.from), w: x(z.to) - x(z.from), active: j === r.active })),
      dot: r.value === null ? null : x(r.value),
    };
  });
  const axisY = v.rows.length * rowH + fontSize * 0.2;
  const bounds = [v.min, ...v.zones.slice(1).map((z) => z.from), v.max];
  const ticks = bounds.map((b, i) => ({
    x: x(b),
    text: formatTick(b),
    anchor: (i === 0 ? 'start' : i === bounds.length - 1 ? 'end' : 'middle') as 'start' | 'middle' | 'end',
  }));
  const labels = placeZoneLabels(v.zones, x, width, fontSize, null);
  const labelY = (row: number) => axisY + fontSize * 2.2 + row * fontSize * 1.3;
  const nRows = Math.max(1, ...labels.map((l) => l.row + 1));
  return { width, height: labelY(nRows - 1) + fontSize * 0.45, rows, axisY, ticks, labels, labelY, fontSize, tickSize: fontSize * 0.85 };
}

/** Ekran okuyucu için grafiğin sözel karşılığı. */
export function visualDescription(v: ItemVisual): string {
  const zoneText = (zs: Zone[]) => zs.map((z) => `${z.label} ${formatTick(z.from)}–${formatTick(z.to)}`).join(', ');
  switch (v.type) {
    case 'gauge': {
      const where = v.value === null || v.active === null ? 'puan hesaplanamadı' : `${v.valueLabel}, ${v.zones[v.active].label} bölgesinde`;
      const zones = v.discrete
        ? v.zones.map((z, i) => `${z.label} ${formatTick(z.from)}–${formatTick(i === v.zones.length - 1 ? z.to : z.to - 1)}`).join(', ')
        : zoneText(v.zones);
      return `${v.label}: ${where}. Bölgeler: ${zones}.`;
    }
    case 'compare': {
      const rows = v.rows.map((r) => `${r.label} ${r.value === null ? 'hesaplanamadı' : `${r.valueLabel}${r.active !== null ? `, ${v.zones[r.active].label}` : ''}`}`);
      return `${rows.join('; ')}. Bölgeler: ${zoneText(v.zones)}.`;
    }
    case 'dots':
    case 'bars':
    case 'columns':
      return `${v.label}: ${v.rows.map((r) => `${r.label} ${r.valueLabel}`).join('; ')}.`;
    case 'stack':
      return `${v.label}: ${v.parts.map((p) => `${p.label} ${p.value}`).join('; ')} (toplam ${v.total}).`;
    case 'steps':
      return `${v.label}: ${v.valueLabel} (${v.steps.length} düzeyden).`;
    case 'strip': {
      // İşaretin adı değerini de içeriyorsa (ör. "Tipik 0,42 sn") değer yinelenmez; aralık iki ondalıkla (saniyede kartın
      // metni gibi tam iki ondalık: "0,30–0,34 sn") yazılır.
      const exact = (x: number) => (v.unit === 'sn' ? nf2fixed : nf2max).format(x);
      const parts = [
        v.marker ? (/\d/.test(v.marker.label) ? v.marker.label : `${v.marker.label} ${exact(v.marker.value)} ${v.unit}`) : '',
        v.box ? `${v.box.label ?? 'çoğu ölçüm'} ${exact(v.box.low)}–${exact(v.box.high)} ${v.unit} arasında` : '',
        v.points.length ? `${v.points.length} ölçüm` : '',
        v.zone ? `${v.zone.label}: ${formatTick(v.zone.from)}–${formatTick(v.zone.to)} ${v.unit}` : '',
        v.caption ?? '',
      ].filter(Boolean);
      return `${v.label}: ${parts.join('; ')}.`;
    }
    case 'ladder': {
      const [yes, no] = v.legend ?? ['doğru', 'yanlış'];
      const rows = v.rows.filter((r) => r.results.length).map((r) => `${r.length} ${v.unit}: ${r.results.map((x) => (x ? yes : no)).join(', ')}`);
      const none = v.legend ? `${yes.charAt(0).toLocaleUpperCase('tr-TR')}${yes.slice(1)} dizi yok` : 'Doğru tekrarlanan dizi yok';
      const best = v.bestLabel ? `${v.bestLabel}: ${v.reached} ${v.unit}` : `En uzun ${yes} dizi ${v.reached} ${v.unit}`;
      return `${v.label}: ${rows.join('; ')}. ${v.reached === null ? none : best}.`;
    }
  }
}
