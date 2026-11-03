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
 * Her grafiğin sözlü anlatımı (`spoken`) sesli dinlemede okunur: değerler ve düzeyler, grafiğin görünüşü değil ("Her nokta bir
 * soru", "çizgi tipik süre" gibi alttaki açıklamalar ve ölçüm sayısı okunmaz). Satırın ya da kartın metninde zaten söylenen
 * değer ve grafiğin adı yinelenmez. Bölümün grafiğinde (`basisCaption`) yalnızca dayanılan sonuçların adları okunur:
 * değerleri "Kısaca"da ve öneri kartlarında okunmuştur.
 */

export interface RoadmapGraphic {
  visual: ItemVisual;
  /**
   * Grafiğin sözle anlatımı (sesli dinleme): değerler, görünüşü değil. Kartın rozeti grafiğin değerini zaten söylüyorsa
   * (ör. "Pekiştirilmeli · 2 / 4 doğru") boştur: değer bir kez okunur.
   */
  spoken: string[];
  /**
   * Grafiğin başlığı (ör. "Bu bölümün dayandığı sonuçlar"): grafik bir kartın değil, bütün bölümün olduğunda neyi
   * gösterdiğini; ya da önerinin grafikteki düzeyden değil başka bir nedenle seçildiğini söyler. Ekranda ve PDF'te grafiğin
   * üstünde, sesli dinlemede ayrı bir cümle olarak değerlerden önce okunur.
   */
  caption?: string;
}

const sentence = (s: string) => (/[.!?…]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

const nf2 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });

/**
 * Grafiğin değerlerinin sözle anlatımı: düzey çubuğu, yan yana grafik, satır satır kareler; basamaklarda düzey sayısı (ulaşılan
 * düzey kartın metnindedir); nokta şeridinde tipik değer, çoğu ölçümün aralığı ve vurgulu bölgenin anlamı (alttaki açıklama ve
 * ölçüm sayısı değil); dizi merdiveninde uzunluk uzunluk denemeler (en uzun dizi kartın metnindedir). Ötekilerde ekran okuyucu
 * metni cümlelere bölünür.
 */
export function spokenOf(v: ItemVisual): string[] {
  switch (v.type) {
    case 'steps':
      return [sentence(`Toplam ${v.steps.length} düzey var`)];
    case 'strip': {
      const unit = v.unit === '°' ? ' derece' : ` ${v.unit}`;
      const n = (x: number) => `${nf2.format(x)}${unit}`;
      return [
        v.marker ? sentence(/\d/.test(v.marker.label) ? v.marker.label : `${v.marker.label}: ${n(v.marker.value)}`) : '',
        v.box ? sentence(`${v.box.label ? v.box.label.charAt(0).toLocaleUpperCase('tr-TR') + v.box.label.slice(1) : 'Çoğu ölçüm'} ${nf2.format(v.box.low)} ile ${n(v.box.high)} arasında`) : '',
        v.zone ? sentence(`${v.zone.label}: ${nf2.format(v.zone.from)} ile ${n(v.zone.to)} arası`) : '',
        v.reference ? sentence(v.reference.label) : '',
      ].filter(Boolean);
    }
    case 'ladder': {
      const [yes, no] = v.legend ?? ['doğru', 'yanlış'];
      return v.rows.filter((r) => r.results.length).map((r) => sentence(`${r.length} ${v.unit}: ${r.results.map((x) => (x ? yes : no)).join(', ')}`));
    }
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

/** Karşılaştırma için: küçük harf, noktalama ve fazla boşluk yok. */
const flat = (x: string) =>
  x
    .toLocaleLowerCase('tr-TR')
    .replace(/[.,;:!?()“”"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Grafik ve sözlü anlatımı; grafik yoksa undefined. `said`: grafiğin yanında zaten okunan metin (ör. "Kısaca" satırı):
 * onda geçen cümle (grafiğin adı, aynı değer) yinelenmez.
 */
export function graphic(visual: ItemVisual | undefined, spoken?: string[], said?: string): RoadmapGraphic | undefined {
  if (!visual) return undefined;
  let all = spoken ?? spokenOf(visual);
  if (!said) return { visual, spoken: all };
  const heard = flat(said);
  // Nokta şeridinin işareti (ör. "Tipik 8 sn") satırdaki değerse ("Soru başına tipik süre 8 sn") yinelenmez.
  const nums = (x: string) => x.match(/\d+(?:,\d+)?/g) ?? [];
  const has = (n: string) => new RegExp(`(?<![\\d,])${n.replace(',', '\\,')}(?![\\d,])`).test(said);
  if (!spoken && visual.type === 'strip' && visual.marker) {
    const [first, ...rest] = all;
    if (first && nums(first).length > 0 && nums(first).every(has)) all = rest;
  }
  return { visual, spoken: all.filter((x) => !heard.includes(flat(x))) };
}

/**
 * Bir ölçeğin düzey çubuğu: raporun kartındakiyle aynı. Puan hesaplanamadıysa ya da ölçeğin bölgeleri yoksa grafik yoktur.
 * Sözlü anlatım kısadır ("Puan: 3,4 / 5, Orta"): ölçeğin adı kartın ya da satırın başlığında zaten okunur. `zone: false`:
 * düzey kartın rozetinde zaten okunur ("Puan: 3,4 / 5").
 */
export function scaleGraphic(s: ReportSection | undefined, zone = true): RoadmapGraphic | undefined {
  if (!s || s.value === null) return undefined;
  const g = gaugeOf(s);
  return g && g.active !== null ? { visual: g, spoken: [sentence(`Puan: ${g.valueLabel}${zone ? `, ${g.zones[g.active].label}` : ''}`)] } : graphic(g);
}

/** Yan yana grafiğe sığan en çok satır; daha çok ölçekte (ör. 16 özellik) ölçeklerin düzeylere dağılımı gösterilir. */
export const COMPARE_MAX_ROWS = 8;

/**
 * Birkaç ölçeğin grafiği (puanı hesaplananlar): tek ölçekte düzey çubuğu, en çok sekiz ölçekte yan yana grafik (raporun
 * kartlarındakiyle aynı), daha çoğunda (ör. 16 özellik) her düzeyde kaç ölçek olduğu (düzeyler raporun kartlarındaki
 * bölgelerdir; ölçek ölçek değerler üç boyutlu profilde ve sesli anlatımda). Ölçeklerin aralığı ya da bölgeleri farklıysa
 * grafik yoktur. `byZone`: yan yana grafiğin sözlü anlatımı ölçek ölçek değerler yerine düzey düzey adlardır ("Orta: A, B
 * ve C."; bir düzeyde dörtten çok ölçek varsa sayısı: "Orta: 8 tarz."; değerler üç boyutlu profilde okunduysa).
 */
export function scalesGraphic(list: ReportSection[], unit = 'ölçek', byZone = false): RoadmapGraphic | undefined {
  const scored = list.filter((s) => s.value !== null && s.zones?.length);
  if (scored.length === 0) return undefined;
  if (scored.length === 1) return scaleGraphic(scored[0]);
  if (scored.length <= COMPARE_MAX_ROWS) {
    const v = compareOf(scored);
    if (!v || !byZone) return graphic(v);
    // Bir düzeyde dörtten çok ölçek varsa adlar yerine sayısı (cümle kısa kalsın).
    const spoken = v.zones.flatMap((z, i) => {
      const names = v.rows.filter((r) => r.active === i).map((r) => r.label);
      return names.length ? [sentence(`${z.label}: ${names.length > 4 ? `${names.length} ${unit}` : joinList(names)}`)] : [];
    });
    return { visual: v, spoken };
  }
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

/** "A, B ve C"; adlardan biri "ve" içeriyorsa ("Merak ve Hayal Gücü") noktalı virgülle: "Duygusal Denge; Merak ve Hayal Gücü". */
export function joinList(xs: string[]): string {
  if (xs.some((x) => / ve /.test(x))) return xs.join('; ');
  return xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`;
}

/**
 * Bölümün grafiğinin başlığı: bölümdeki önerilerin dayandığı sonuç ya da sonuçlar ("Bu bölümün dayandığı sonuçlar"). Sesli
 * dinlemede başlıktan sonra yalnızca o sonuçların adları okunur (`names`; değerleri daha önce okundu). Ad verilmezse
 * grafiğin kendi sözlü anlatımı okunur (ör. düzeylere göre ölçek sayısı). `note`: başlığın ardından bir açıklama (ör.
 * önerinin bir maddeye göre seçildiği).
 */
export function basisCaption(g: RoadmapGraphic | undefined, many: boolean, names?: string[], note?: string): RoadmapGraphic | undefined {
  if (!g) return undefined;
  const caption = `Bu bölümün dayandığı ${many ? 'sonuçlar' : 'sonuç'}`;
  return {
    ...g,
    caption: note ? `${caption}. ${note}` : caption,
    spoken: names?.length ? [sentence(joinList(names))] : g.spoken,
  };
}

/**
 * Dört haftalık planın zaman çizelgesi: haftaların sırası ve başlığı; içeriği kişinin sonucuna göre seçilen haftalar dolu
 * daireyle, ötekiler "Genel öneri" (her sonuçta aynı olan hafta ya da sonuç bir öneri seçtirmediğinde verilen genel hafta;
 * "herkese aynı" denmez: genel haftanın verilip verilmemesi de sonuca bağlı olabilir). Sözlü anlatım hangi haftaların
 * sonuca göre seçildiğini ve hangilerinin genel öneri olduğunu söyler (başlıklar haftalarla birlikte zaten okunur).
 * `whose`: kimin sonucu ("çocuğunuzun sonucuna", "öğrencinin sonucuna"; verilmezse veliye "çocuğunuzun", ötekilere "sonucuna").
 */
export function weeksGraphic(weeks: { label: string; title: string; fromResult: boolean }[], parent: boolean, whose?: string): RoadmapGraphic {
  const visual: TimelineVisual = {
    type: 'timeline',
    label: 'Haftaların sırası',
    steps: weeks.map((w) => ({ label: w.label, title: w.title, result: w.fromResult })),
    legend: { result: parent ? 'Sonuca göre seçildi' : 'Sonucuna göre seçildi', general: 'Genel öneri' },
  };
  const no = (w: { label: string }) => w.label.replace(/ hafta$/, '');
  const chosen = weeks.filter((w) => w.fromResult).map(no);
  const general = weeks.filter((w) => !w.fromResult).map(no);
  const by = whose ?? (parent ? 'çocuğunuzun sonucuna' : 'sonucuna');
  const spoken =
    chosen.length === 0
      ? 'Bu plandaki haftaların hepsi genel öneridir.'
      : general.length === 0
        ? `Bu plandaki haftaların hepsi ${by} göre seçildi.`
        : `Bu planda ${joinList(chosen)} ${chosen.length > 1 ? 'haftalar' : 'hafta'} ${by} göre seçildi. ${joinList(general)} ${general.length > 1 ? 'haftalar' : 'hafta'} genel öneridir.`;
  return { visual, spoken: [spoken] };
}
