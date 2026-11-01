import type { ReportSection } from './build';
import { compareOf, gaugeOf } from './simple';
import type { TimelineVisual } from './visual-roadmap';
import { visualDescription, type BarsVisual, type ItemVisual } from './visuals';

/**
 * Gelişim yol haritasının grafikleri (site sahibinin 2026-10-31 isteği: raporda açıklama yapan her bölümün, yol haritası dahil,
 * kendi içeriğine uygun bir grafiği olsun; ses asistanı raporu eksiksiz okusun). Grafikler raporun kartlarındaki grafiklerle
 * aynı türler ve aynı hesaplardır (lib/reports/visuals.ts, simple.ts): bir öneri bir ölçeğin sonucundan seçildiyse o ölçeğin
 * düzey çubuğu, birkaç ölçekten seçildiyse yan yana grafik. Kişinin sonucuna dayanmayan, herkese aynı verilen öneri
 * listelerinde (ör. görevlerde günlük hayatı kolaylaştıran yollar, okuma alışkanlığı) sonuç grafiği yoktur: grafik, önerinin
 * sonuca göre seçildiğini düşündürürdü. Hesaplanamayan ya da yorumlanmayan ölçünün grafiği olmaz.
 *
 * Her grafiğin sözlü anlatımı (`spoken`) sesli dinlemede okunur: değerler ve düzeyler, grafiğin görünüşü değil.
 */

export interface RoadmapGraphic {
  visual: ItemVisual;
  /**
   * Grafiğin sözle anlatımı (sesli dinleme): değerler, görünüşü değil. Kartın rozeti grafiğin değerini zaten söylüyorsa
   * (ör. "Pekiştirilmeli · 2 / 4 doğru") boştur: değer bir kez okunur.
   */
  spoken: string[];
  /**
   * Bölümün grafiğinin başlığı (ör. "Bu bölümün dayandığı sonuçların"): grafik bir kartın değil, bütün bölümün olduğunda
   * neyi gösterdiğini söyler. Ekranda ve PDF'te grafiğin üstünde, sesli dinlemede değerlerden önce okunur.
   */
  caption?: string;
}

const sentence = (s: string) => (/[.!?…]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** Grafiğin değerlerinin sözle anlatımı (düzey çubuğu, yan yana grafik ve satır satır kareler; ötekilerde ekran okuyucu metni). */
export function spokenOf(v: ItemVisual): string[] {
  switch (v.type) {
    case 'gauge':
      return [sentence(v.value === null || v.active === null ? `${v.label}: hesaplanamadı` : `${v.label}: ${v.valueLabel}, ${v.zones[v.active].label}`)];
    case 'compare':
      return v.rows.map((r) => sentence(r.value === null ? `${r.label}: hesaplanamadı` : `${r.label}: ${r.valueLabel}${r.active !== null ? `, ${v.zones[r.active].label}` : ''}`));
    case 'dots':
      return v.rows.length === 1
        ? [sentence(`${v.label}: ${v.rows[0].valueLabel} ${v.legend[0]}`)]
        : v.rows.map((r) => sentence(`${r.label}: ${r.valueLabel} ${v.legend[0]}`));
    default: {
      // Ekran okuyucu metni ("Ad: a; b; c."): uzun bir liste kısa cümlelere bölünür ("Ad.", "a.", "b.", "c.").
      const d = visualDescription(v).trim().replace(/\.$/, '');
      const i = d.indexOf(': ');
      return i < 0 ? [sentence(d)] : [sentence(d.slice(0, i)), ...d.slice(i + 2).split(/;\s*/).map(sentence)];
    }
  }
}

/** Grafik ve sözlü anlatımı; grafik yoksa undefined. */
export function graphic(visual: ItemVisual | undefined, spoken?: string[]): RoadmapGraphic | undefined {
  return visual ? { visual, spoken: spoken ?? spokenOf(visual) } : undefined;
}

/**
 * Bir ölçeğin düzey çubuğu: raporun kartındakiyle aynı. Puan hesaplanamadıysa ya da ölçeğin bölgeleri yoksa grafik yoktur.
 * Sözlü anlatım kısadır ("Puan: 3,4 / 5, Orta"): ölçeğin adı kartın ya da satırın başlığında zaten okunur.
 */
export function scaleGraphic(s: ReportSection | undefined): RoadmapGraphic | undefined {
  if (!s || s.value === null) return undefined;
  const g = gaugeOf(s);
  return g && g.active !== null ? { visual: g, spoken: [sentence(`Puan: ${g.valueLabel}, ${g.zones[g.active].label}`)] } : graphic(g);
}

/** Yan yana grafiğe sığan en çok satır; daha çok ölçekte (ör. 16 özellik) ölçeklerin düzeylere dağılımı gösterilir. */
export const COMPARE_MAX_ROWS = 8;

/**
 * Birkaç ölçeğin grafiği (puanı hesaplananlar): tek ölçekte düzey çubuğu, en çok sekiz ölçekte yan yana grafik (raporun
 * kartlarındakiyle aynı), daha çoğunda (ör. 16 özellik) her düzeyde kaç ölçek olduğu (düzeyler raporun kartlarındaki
 * bölgelerdir; ölçek ölçek değerler üç boyutlu profilde ve sesli anlatımda). Ölçeklerin aralığı ya da bölgeleri farklıysa
 * grafik yoktur.
 */
export function scalesGraphic(list: ReportSection[], unit = 'ölçek'): RoadmapGraphic | undefined {
  const scored = list.filter((s) => s.value !== null && s.zones?.length);
  if (scored.length === 0) return undefined;
  if (scored.length === 1) return scaleGraphic(scored[0]);
  if (scored.length <= COMPARE_MAX_ROWS) return graphic(compareOf(scored));
  const zones = scored[0].zones!;
  const same = (s: ReportSection) => s.min === scored[0].min && s.max === scored[0].max && JSON.stringify(s.zones) === JSON.stringify(zones);
  if (!scored.every(same)) return undefined;
  const active = scored.map((s) => gaugeOf(s)!.active);
  const visual: BarsVisual = {
    type: 'bars',
    label: `Düzeylere göre ${unit} sayısı`,
    scale: 'share',
    rows: zones.map((z, i) => {
      const n = active.filter((a) => a === i).length;
      return { label: z.label, value: n, max: scored.length, valueLabel: `${n} / ${scored.length}` };
    }),
  };
  // Sözle: her düzeyde kaç ölçek olduğu (ölçek ölçek değerler üç boyutlu profilde okunur).
  return { visual, spoken: visual.rows.map((r) => sentence(`${r.label}: ${r.value} ${unit}`)) };
}

/** Bölümün grafiğinin başlığı: bölümdeki önerilerin dayandığı sonuç ya da sonuçlar (öğrenci ve yetişkine "sen", veliye). */
export function basisCaption(g: RoadmapGraphic | undefined, parent: boolean, many: boolean): RoadmapGraphic | undefined {
  if (!g) return undefined;
  const caption = parent ? `Bu bölümün dayandığı ${many ? 'sonuçlar' : 'sonuç'}` : `Bu bölümün dayandığı ${many ? 'sonuçların' : 'sonucun'}`;
  return { ...g, caption };
}

/** Haftaların sıra sayıları sözle: "2. ve 3." */
function joinOrdinals(xs: string[]): string {
  return xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`;
}

/**
 * Dört haftalık planın zaman çizelgesi: haftaların sırası ve başlığı; içeriği kişinin sonucuna göre seçilen haftalar dolu
 * daireyle. Sözlü anlatım, hangi haftaların sonuca göre seçildiğini söyler (başlıklar haftalarla birlikte zaten okunur).
 */
export function weeksGraphic(weeks: { label: string; title: string; fromResult: boolean }[], parent: boolean): RoadmapGraphic {
  const visual: TimelineVisual = {
    type: 'timeline',
    label: 'Haftaların sırası',
    steps: weeks.map((w) => ({ label: w.label, title: w.title, result: w.fromResult })),
    legend: { result: parent ? 'Sonuca göre seçildi' : 'Sonucuna göre seçildi', general: 'Herkese aynı önerilir' },
  };
  const chosen = weeks.filter((w) => w.fromResult).map((w) => w.label.replace(/ hafta$/, ''));
  const whose = parent ? 'çocuğunuzun sonucuna' : 'sonucuna';
  const spoken =
    chosen.length === 0
      ? 'Bu plandaki haftaların hepsi herkese aynı önerilir.'
      : chosen.length === weeks.length
        ? `Bu plandaki haftaların hepsi ${whose} göre seçildi.`
        : `Bu planda ${joinOrdinals(chosen)} ${chosen.length > 1 ? 'haftalar' : 'hafta'} ${whose} göre seçildi; öteki haftalar herkese aynı önerilir.`;
  return { visual, spoken: [spoken] };
}
