import type { SimpleReport } from '@/lib/reports/simple';

/**
 * Paylaşım kartı: rapordan, kişinin Instagram hikâyesinde ya da WhatsApp durumunda paylaşabileceği bir görselin içeriği
 * çıkarılır (site sahibinin 2026-10-30 isteği). Görsel tarayıcıda çizilir (`draw.ts`), sunucuya ya da başka bir yere
 * gönderilmez, hiçbir yere kaydedilmez; kartta kişinin adı yazmaz.
 *
 * Kart yalnızca kişiliği betimleyen ve ilgileri ya da değerleri sıralayan testlerde vardır (site sahibinin seçimi):
 * puanı iyi ya da kötü anlamı taşımayan sonuçlar. Zihinsel görevler, okuma, matematik ve öz-saygı, iyimserlik,
 * öz-denetim gibi "yüksek daha iyi" diye okunabilen ölçekler karta girmez: çocuklar arasında kıyas ve alay konusu
 * olmasın. Heyecan Arayışı da girmez: "Tehlikeli heyecanlara ilgi: Yüksek" bir övünme rozeti gibi paylaşılmasın.
 */

export const SHARE_W = 1080;
export const SHARE_H = 1920;

/** Kartın türü: `profile` bütün boyutlar; `top` en yüksek beş alan; `radar` altıgen ya da çember grafiği. */
type ShareMode = 'profile' | 'top' | 'radar';

interface ShareSpec {
  mode: ShareMode;
  /** Kartın üstündeki kısa ad (birinci kişiyle; kartı paylaşan kişi söyler). */
  kicker: string;
  /** `top` kartında listenin başlığı. */
  topTitle?: string;
}

export const SHAREABLE: Record<string, ShareSpec> = {
  'cocuk-kisilik-profili': { mode: 'profile', kicker: 'Kişilik profilim' },
  'bes-faktor-kisilik': { mode: 'profile', kicker: 'Kişilik profilim' },
  'hizli-kisilik-testi': { mode: 'profile', kicker: 'Kişilik profilim' },
  'ayrintili-kisilik-profili': { mode: 'profile', kicker: 'Kişilik profilim' },
  'kisiligin-10-yonu': { mode: 'profile', kicker: 'Kişilik profilim' },
  'alti-boyutlu-kisilik-profili': { mode: 'profile', kicker: 'Kişilik profilim' },
  '16-faktorlu-kisilik-profili': { mode: 'profile', kicker: 'Kişilik profilim' },
  'dusunme-ve-calisma-tarzi': { mode: 'profile', kicker: 'Düşünme ve çalışma tarzım' },
  'kisilerarasi-tarz': { mode: 'radar', kicker: 'Kişilerarası tarzım' },
  'mesleki-ilgi-profili': { mode: 'radar', kicker: 'İlgi profilim' },
  'meslek-ilgi-alanlari': { mode: 'top', kicker: 'İlgi profilim', topTitle: 'En çok ilgi duyduğum alanlar' },
  'hobi-ve-serbest-zaman-ilgileri': { mode: 'top', kicker: 'Serbest zamanım', topTitle: 'En sık uğraştığım alanlar' },
  'calisma-degerleri': { mode: 'top', kicker: 'Değerlerim', topTitle: 'Bir işte en çok önem verdiklerim' },
};

export const isShareable = (slug: string) => Object.hasOwn(SHAREABLE, slug);

/**
 * Kişilik, ilgi ve beceri alanındaki anket testlerinden kartı olmayanlar ve nedeni. Yeni bir anket testi eklenince
 * ya `SHAREABLE`'a ya buraya yazılır (tests/paylasim.test.ts denetler).
 */
export const NOT_SHAREABLE: Record<string, string> = {
  'ogrenme-ve-basari-ozellikleri': 'çaba ve sebat gibi "yüksek daha iyi" diye okunabilen ölçekler',
  'dusunmeyi-sevme-olcegi': 'tek bir ölçek; "yüksek daha iyi" diye okunabilir',
  'heyecan-arayisi': 'tehlikeli heyecanlara ilgi bir övünme rozeti gibi paylaşılmasın',
  iyimserlik: 'ruh hâli ve karamsarlık; kıyas konusu olmasın',
  empati: '"yüksek daha iyi" diye okunabilir',
  'oz-yeterlik': 'kendine güven; kıyas konusu olmasın',
  'oz-denetim': '"yüksek daha iyi" diye okunabilir',
  'oz-saygi': 'öz-saygı; kıyas ve alay konusu olmasın',
  'duygusal-zeka-bilesenleri': '"zekâ" adı taşıyan, "yüksek daha iyi" diye okunabilen ölçekler',
};

/** Boyut renkleri (globals.css `--dim-*`, açık tema). Renk bir boyutu tanıtır; iyi ya da kötü anlamı taşımaz. */
export const SHARE_COLORS = ['#ee6a36', '#df4777', '#2f5ce0', '#0e9c8c', '#7a4ee6'];

export interface ShareRow {
  label: string;
  value: number;
  min: number;
  max: number;
  /** Düzey adı ("Yüksek", "Sık"). */
  band: string;
  /** Kısa betimleme ("Genelde sakin"); yoksa null. */
  note: string | null;
  color: string;
}

export interface ShareAxis {
  label: string;
  value: number | null;
  /** Derece; 0 = sağ, 90 = üst. */
  angle: number;
  highlight: boolean;
}

export type ShareBlock =
  | { kind: 'rows'; title: string | null; rows: ShareRow[] }
  | { kind: 'radar'; title: string | null; min: number; max: number; axes: ShareAxis[]; caption: string | null };

export interface ShareCard {
  kicker: string;
  title: string;
  /** Büyük yazılan tek sonuç (ilgi kodu gibi); yoksa null. */
  headline: { label: string; value: string } | null;
  blocks: ShareBlock[];
  /** Testin sitedeki adresi (görselde ve paylaşım metninde): "/testler/bes-faktor-kisilik". */
  path: string;
  pilot: boolean;
  fileName: string;
}

/** Rozetin betimleme kısmı: "Yüksek · Genelde sakin" → "Genelde sakin"; eşitlik notu atılır. */
function noteOf(badge: string | undefined): string | null {
  if (!badge) return null;
  const parts = badge.split(' · ').slice(1).filter((p) => p !== 'eşit puan');
  return parts.length > 0 ? parts.join(' · ') : null;
}

/** Ölçeğin kartlardaki betimlemesi (kart ya da ayrıntılı profilde boyut başlığı ölçeğin adıyla aynıdır). */
function notesByTitle(report: SimpleReport): Map<string, string> {
  const m = new Map<string, string>();
  for (const it of report.items) {
    const n = noteOf(it.badge);
    if (n) m.set(it.title, n);
  }
  for (const g of report.groups ?? []) {
    const n = noteOf(g.badge);
    if (n) m.set(g.title, n);
  }
  return m;
}

function profileRows(report: SimpleReport): ShareRow[] {
  if (report.chart?.type !== 'rulers') return [];
  const notes = notesByTitle(report);
  return report.chart.rows.flatMap((r, i) =>
    r.value === null
      ? []
      : [{ label: r.label, value: r.value, min: r.min, max: r.max, band: r.band, note: notes.get(r.label) ?? null, color: SHARE_COLORS[i % SHARE_COLORS.length] }],
  );
}

/** En yüksek beş alan (eşitlikte grafikteki sıra korunur). */
function topRows(report: SimpleReport): ShareRow[] {
  return profileRows(report)
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r.value - a.r.value || a.i - b.i)
    .slice(0, 5)
    .map(({ r }, i) => ({ ...r, note: null, color: SHARE_COLORS[i % SHARE_COLORS.length] }));
}

function radarBlock(report: SimpleReport): ShareBlock | null {
  const chart = report.chart;
  if (chart?.type === 'hexagon') {
    const top = new Set(chart.highlight);
    const axes = chart.axes.map((a, i) => ({ label: a.label, value: a.value, angle: 90 - i * 60, highlight: top.has(a.key) }));
    if (axes.every((a) => a.value === null)) return null;
    const names = chart.axes.filter((a) => top.has(a.key)).map((a) => a.label);
    return { kind: 'radar', title: null, min: 1, max: 5, axes, caption: names.length > 0 ? `Öne çıkan alanlarım: ${names.join(' · ')}` : null };
  }
  if (chart?.type === 'circle') {
    const values = chart.axes.flatMap((a) => (a.value === null ? [] : [a.value]));
    if (values.length === 0) return null;
    const best = Math.max(...values);
    // En yüksek tarz(lar); çok sayıda eşitlikte hiçbiri öne çıkmaz.
    const tops = chart.axes.filter((a) => a.value === best);
    const highlight = new Set(tops.length <= 2 ? tops.map((a) => a.key) : []);
    const axes = chart.axes.map((a) => ({ label: a.label, value: a.value, angle: a.angle, highlight: highlight.has(a.key) }));
    const names = chart.axes.filter((a) => highlight.has(a.key)).map((a) => a.label);
    return { kind: 'radar', title: null, min: 1, max: 5, axes, caption: names.length > 0 ? `En belirgin tarzım: ${names.join(' · ')}` : null };
  }
  return null;
}

function headlineOf(report: SimpleReport): ShareCard['headline'] {
  const code = report.keyFigures.find((k) => k.label === 'İlgi kodu');
  return code ? { label: 'İlgi kodum', value: code.value } : null;
}

/**
 * Raporun paylaşım kartı. Veli raporundan kart çıkarılmaz (kart, testi çözen kişinin kendi sonucunu paylaşmasıdır);
 * paylaşılabilir testlerden değilse ya da gösterilecek bir sonuç yoksa null.
 */
export function shareCardFor(slug: string, report: SimpleReport): ShareCard | null {
  const spec = SHAREABLE[slug];
  if (!spec || report.audience === 'parent') return null;
  let blocks: ShareBlock[] = [];
  if (spec.mode === 'profile') {
    const rows = profileRows(report);
    if (rows.length > 0) blocks = [{ kind: 'rows', title: null, rows }];
  } else if (spec.mode === 'top') {
    const rows = topRows(report);
    if (rows.length > 0) blocks = [{ kind: 'rows', title: spec.topTitle ?? null, rows }];
  } else {
    const b = radarBlock(report);
    if (b) blocks = [b];
  }
  if (blocks.length === 0) return null;
  return {
    kicker: spec.kicker,
    title: report.instrumentName,
    headline: headlineOf(report),
    blocks,
    path: `/testler/${slug}`,
    pilot: report.isPilot,
    fileName: `olcekhane-${slug}-paylasim.png`,
  };
}

/**
 * Kendini Tanı Paketi'nin kartı: paketteki kişilik testinin profili ve ilgi testinin en yüksek alanları (yalnızca
 * paylaşılabilir testler; zihinsel görevler ve çalışma alışkanlıkları karta girmez). Kartta en çok iki blok olur.
 */
export function packageShareCard(results: { slug: string; report: SimpleReport }[], path: string): ShareCard | null {
  const blocks: ShareBlock[] = [];
  let headline: ShareCard['headline'] = null;
  let pilot = false;
  for (const { slug, report } of results) {
    const card = shareCardFor(slug, report);
    if (!card) continue;
    const block = card.blocks[0];
    const spec = SHAREABLE[slug];
    if (spec.mode === 'profile' && !blocks.some((b) => b.kind === 'rows' && b.title === 'Kişiliğim')) {
      blocks.push({ ...block, title: 'Kişiliğim' } as ShareBlock);
    } else if (spec.mode !== 'profile' && !blocks.some((b) => b.title !== 'Kişiliğim')) {
      // Paket kartında ilgiler kısa tutulur: en yüksek üç alan ya da altıgenin öne çıkan alanları.
      if (block.kind === 'rows') blocks.push({ ...block, title: spec.topTitle ?? 'İlgilerim', rows: block.rows.slice(0, 3) });
      else blocks.push({ ...block, title: 'İlgilerim' });
      headline = headline ?? card.headline;
    } else continue;
    pilot = pilot || card.pilot;
  }
  if (blocks.length === 0) return null;
  return {
    kicker: 'Kendimi tanıma profilim',
    title: 'Kendini Tanı Paketi',
    headline,
    blocks,
    path,
    pilot,
    fileName: 'olcekhane-kendini-tani-paketi-paylasim.png',
  };
}

/** Görselin üstüne yazılan bütün metinler (yazı tiplerinin gereken harf kümeleri önceden yüklensin diye). */
export function shareCardText(card: ShareCard, host: string): string {
  const parts = [card.kicker, card.title, card.headline?.label ?? '', card.headline?.value ?? '', host, card.path, SHARE_FOOTER, SHARE_CTA, SHARE_PILOT];
  for (const b of card.blocks) {
    parts.push(b.title ?? '');
    if (b.kind === 'rows') for (const r of b.rows) parts.push(r.label, r.band, r.note ?? '');
    else {
      parts.push(b.caption ?? '');
      for (const a of b.axes) parts.push(a.label);
    }
  }
  return parts.join(' ');
}

export const SHARE_CTA = 'Sen de ücretsiz çöz';
export const SHARE_FOOTER = 'Bu bir tanı değildir. Cevaplarım hiçbir yerde saklanmadı.';
/** Raporlardaki etiketle aynı ("Pilot test"): güvenirlik kanıtı henüz olmayan özgün test. */
export const SHARE_PILOT = 'Pilot test';

/** Paylaşılırken görselin yanına eklenen metin (WhatsApp'ta mesaj, Instagram'da açıklama olarak kullanılabilir). */
export function shareText(card: ShareCard, siteUrl: string): string {
  return `${card.title}: ${card.kicker.toLocaleLowerCase('tr-TR')}. ${SHARE_CTA}: ${siteUrl.replace(/\/$/, '')}${card.path}`;
}
