import type { Audience, CognitiveBlock, ReportScore } from './build';
import { secShort } from './build';
import type { PartCard, PartLevel, PartRow, PartStatus } from './parts';
import { ITEMS_WRAP_AT, niceMax } from './visual-draw';
import type { BlocksVisual, DotsVisual, ItemVisual, ItemsVisual, MeterVisual, StackVisual, StripVisual } from './visuals';
import type { ItemTrace } from '@/lib/scoring/tasks';
import type { TaskInstrument } from '@/lib/instruments/types';

/**
 * Görev (zekâ ve dikkat) testlerinin ek rapor bölümlerinin ortak yapı taşları (lib/reports/task-parts.ts kullanır): bağlam,
 * sayı ve süre yazımı, soru şeridi kartı, bölüm özeti kartı, düzeyler kartı, ölçü kartları ve denetim kartları. Her kartın
 * grafiği kartın anlattığını gösterir; grafikteki sayılar metinde yinelenmez, sesli okumada `spoken` ile okunur.
 */

export interface Ctx {
  def: TaskInstrument;
  audience: Audience;
  /** Öğrenciye ve yetişkine "sen", veliye "çocuğunuz". */
  you: boolean;
  adult: boolean;
  /** Ölçek puanı (sonucun ayrıntısı `extra`'da). */
  score: (key: string) => ReportScore | undefined;
  /** Raporun sonuç kartı (yorumlanıp yorumlanmadığı, başlığı). */
  block: (key: string) => CognitiveBlock | undefined;
  traces: Record<string, ItemTrace[]>;
  /**
   * Bu görevde her seferinde aynı içerik (sorular, kelimeler, problemler, diziler, desenler, işlemler) gelir (lib/compare/tasks.ts,
   * `SAME_ITEMS`; görev görev verilir): satırlarda içerik, verilen ve doğru cevap yazılmaz; yalnızca yeri (düzey, bölüm, dizinin
   * uzunluğu), doğru mu yanlış mı, içerik anmayan yanlış türü ve sayılar, "çok hızlı" ve süre. Raporlar paylaşılıp birleştirilse
   * de cevap anahtarı çıkmaz ve test yeniden çözülünce de işe yarar.
   */
  fixed: boolean;
}

/** Bir görevin üç bölüme katkısı: soru soru cevaplar, düzeyler ve ölçüler, denetimler. */
export interface KindParts {
  name: string;
  answers: PartCard[];
  levels: PartCard[];
  checks: PartCard[];
}

export const v = (c: Ctx, you: string, parent: string) => (c.you ? you : parent);

/** Denetimler bölümünün adı (metinlerde bu adla anılır). */
export const QUALITY_TITLE = 'Sonuca ne kadar güvenebiliriz?';
/** Yorumlanmayan sonucun kartına eklenen cümle. */
export const UNREAD_WHY = `Bu sonuç yorumlanmadı; nedeni “${QUALITY_TITLE}” bölümünde yazıyor.`;
export const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
export const lower = (s: string) => s.charAt(0).toLocaleLowerCase('tr-TR') + s.slice(1);

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const nf2 = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const num = (x: number) => nf0.format(x);
export const dec1 = (x: number) => nf1.format(Math.round(x * 10) / 10);

/** Bir sorunun süresi: 10 saniyeden kısa bir ondalıkla ("2,4 sn"), uzunlar raporun yazımıyla ("14 sn", "1 dk 5 sn"). */
export function secTag(ms: number): string {
  if (ms < 10_000) return `${nf1.format(Math.round(ms / 100) / 10)} sn`;
  return secShort(ms);
}
/** Tepki süresi: iki ondalık ("0,42 sn"); raporun tepki sürelerindeki yazımla aynı yuvarlama. */
export const sec2 = (ms: number) => `${nf2.format(Math.round(ms / 10) / 100)} sn`;
/** Saniye, bir ondalık ("2,5"): sınırların yazımı. */
export const secLimit = (ms: number) => nf1.format(ms / 1000).replace(/,0$/, '');
/** Yüzde, tam sayı ("%85"). */
export const pctText = (x: number) => `%${nf0.format(Math.round(x * 100))}`;

/** Sesli okunan sayı: sıfır "yok", bir "bir". */
export const sayCount = (n: number, noun = '') => (n === 0 ? 'yok' : `${n === 1 ? 'bir' : n}${noun ? ` ${noun}` : ''}`);
/** Sözle sayım, sayıdan sonra gelen sözcükle: "3 geçilen", "bir geçilen", "geçilen yok". */
export const sayN = (n: number, label: string) => (n === 0 ? `${label} yok` : `${n === 1 ? 'bir' : n} ${label}`);
/** "hiçbiri", "biri", "5 tanesi" (nicelik sözcükleri 0 ve 1 için sözle). */
export const tanesi = (k: number, ek: 'i' | 'inde' | 'ine' | 'ini' = 'i') => (k === 0 ? `hiçbir${ek}` : k === 1 ? `bir${ek}` : `${k} tanes${ek}`);
/** Bir ölçüm listesinin ortancası. */
export const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/* ---------- Türkçe ekler (bölümlerde geçen adlar için: soru, deneme, dizi, problem, çeyrek…) ---------- */

const lastVowel = (w: string) => [...w.toLocaleLowerCase('tr-TR')].reverse().find((ch) => 'aıoueiöü'.includes(ch)) ?? 'e';
/** Son ünlüsü kalın olduğu hâlde ince ek alan sözcükler ("semboller", "harfler", "saatte"). */
const FRONT_EXCEPTIONS = /(sembol|harf|saat|kontrol|alkol|hal)$/;
const back = (w: string) => !FRONT_EXCEPTIONS.test(w.toLocaleLowerCase('tr-TR')) && 'aıou'.includes(lastVowel(w));
const hard = (w: string) => 'çfhkpsşt'.includes(w.charAt(w.length - 1));
/** Çoğul: "sorular", "problemler". */
export const pl = (w: string) => `${w}${back(w) ? 'lar' : 'ler'}`;
/** Çoğulun ilgi hâli: "soruların", "problemlerin". */
export const plGen = (w: string) => `${pl(w)}${back(w) ? 'ın' : 'in'}`;
/** Ayrılma hâli: "sorudan", "problemden", "çeyrekten". */
export const abl = (w: string) => `${w}${hard(w) ? 't' : 'd'}${back(w) ? 'an' : 'en'}`;
/** Çoğulun belirtme hâli: "soruları", "denemeleri". */
export const plAcc = (w: string) => `${pl(w)}${back(w) ? 'ı' : 'i'}`;
/** Bulunma hâli: "soruda", "problemde", "çeyrekte". */
export const loc = (w: string) => `${w}${hard(w) ? 't' : 'd'}${back(w) ? 'a' : 'e'}`;

/* ---------- Soru soru cevaplar ---------- */

export type Status = ItemTrace['status'];

export interface ItemRow {
  /** Grubun sırası (düzey, uzunluk, bölüm); şeritte grup adının altında. */
  group: number;
  /** Ekranda gösterilen (ör. "2. düzey · 3, 6, 12, ?"). */
  shown: string;
  /** Sorunun yalnızca yeri (ör. "2. düzey", "3. bölüm"): aynı soruların geldiği testlerde satırda yalnızca bu yazılır. */
  place?: string;
  /** Sesli okunuşu, ekrandakinden farklıysa. */
  say?: string;
  status: Status;
  /** Verilen cevap (sözle); doğru ya da yanlış sözünden önce yazılır. */
  given?: string | null;
  /**
   * Doğru cevap (yanlış ya da boş cevapta). Yalnızca `ItemsSpec.showKey` ile ve içeriği her seferinde aynı gelmeyen görevde
   * yazılır: aynı içeriğin geldiği testlerde rapor cevap anahtarı olmasın (`Ctx.fixed`; lib/compare/tasks.ts, `SAME_ITEMS`).
   */
  expected?: string | null;
  /** Yanlışın türü gibi kısa etiketler. */
  tags?: string[];
  rtMs: number | null;
  /** Denetimdeki "çok hızlı" sayımına girdi. */
  rapid?: boolean;
}

export interface ItemsSpec {
  key: string;
  title: string;
  /** Satırların adı ("soru", "dizi", "desen", "problem", "işlem", "kelime", "deneme"). */
  noun: string;
  groups: string[];
  groupCaption: string;
  rows: ItemRow[];
  /** Şeritte süre de çizilsin (süre sınırı olmayan ya da süresi anlamlı görevlerde). */
  timed: boolean;
  /** Testin "çok hızlı" saydığı süre: şeritte alttaki bant. */
  rapid?: { ms: number; label: string };
  /** Cevapsız işaretlerin adı ("Bilmiyorum", "cevapsız"…) ve satırdaki yazımları. */
  none?: string;
  skipLabel?: string;
  missLabel?: string;
  earlyLabel?: string;
  /** Doğru ve yanlışın adları (ör. "tam", "eksik"). */
  okLabel?: string;
  wrongLabel?: string;
  /** Satırda süre yazılmasın (ör. dizi görevlerinde cevabı yazma süresi bir şey anlatmaz). */
  noTime?: boolean;
  /**
   * Doğru cevap yazılsın: soruları her uygulamada yeniden üretilen görevler için. Aynı içeriğin geldiği görevde (`Ctx.fixed`)
   * yok sayılır; bugün bütün soru soru kartları böyledir.
   */
  showKey?: boolean;
  text?: string;
}

/** Bundan uzun listelerde doğru satırlar sesli okunmaz; öteki satırlar da bundan çoksa hiçbiri tek tek okunmaz. */
export const SPEECH_ROWS_MAX = 40;
export const SPEECH_NOTABLE_MAX = 20;

const pick = <T>(xs: T[], q: number) => xs[Math.min(xs.length - 1, Math.max(0, Math.floor(xs.length * q)))];

/** Satırın değeri: "32, yanlış; doğrusu 30" ya da "Doğru". */
function rowValue(s: ItemsSpec, r: ItemRow): string {
  // Cümle olan seçeneklerin sonundaki nokta düşer ("… kırmızıdır, doğru").
  const given = r.given?.replace(/\.+$/, '');
  const expected = s.showKey && r.expected ? `; doğrusu ${r.expected.replace(/\.+$/, '')}` : '';
  switch (r.status) {
    case 'correct':
      return given ? `${given}, ${s.okLabel ?? 'doğru'}` : cap(s.okLabel ?? 'doğru');
    case 'wrong':
      return `${given ? `${given}, ${s.wrongLabel ?? 'yanlış'}` : cap(s.wrongLabel ?? 'yanlış')}${expected}`;
    case 'skip':
      return `${s.skipLabel ?? '“Bilmiyorum”'}${expected}`;
    case 'miss':
      return `${s.missLabel ?? 'Süre içinde cevap yok'}${expected}`;
    case 'early':
      return s.earlyLabel ?? 'Çok erken basıldı; doğru sayılmadı';
  }
}

/** Soru şeridinin süre ekseni: sürelerin büyük çoğunluğu sığar, uzunlar üst kenarda. */
function timeAxis(rows: ItemRow[], rapidMs?: number): number | null {
  const secs = rows.flatMap((r) => (r.rtMs === null ? [] : [r.rtMs / 1000])).sort((a, b) => a - b);
  if (!secs.length) return null;
  return niceMax(Math.max(pick(secs, 0.9) * 1.15, rapidMs ? (rapidMs / 1000) * 1.8 : 0, 1));
}

/**
 * Soru soru cevaplar kartı: soru şeridi ve satırlar (soru, cevap, doğrusu, yanlışın türü, süre). Aynı soruların geldiği
 * testlerde (`Ctx.fixed`) satırda soru, verilen ve doğru cevap yazılmaz: yalnızca yeri, doğru mu yanlış mı, etiketler, süre.
 */
export function itemsCard(c: Ctx, s: ItemsSpec): PartCard {
  const hide = c.fixed;
  // Uzun listede şerit satır satır çizilir ve süre çizilmez (lib/reports/visual-draw.ts, ITEMS_WRAP_AT).
  const wrapped = s.rows.length > ITEMS_WRAP_AT;
  const max = s.timed && !wrapped ? timeAxis(s.rows, s.rapid?.ms) : null;
  const timed = max !== null;
  const ok = s.rows.filter((r) => r.status === 'correct').length;
  const wrong = s.rows.filter((r) => r.status === 'wrong').length;
  const none = s.rows.length - ok - wrong;
  const okName = s.okLabel ?? 'doğru';
  const wrongName = s.wrongLabel ?? 'yanlış';
  const noneName = s.none ?? 'cevapsız';
  const visual: ItemsVisual = {
    type: 'items',
    label: s.title,
    items: s.rows.map((r) => ({
      mark: r.status === 'correct' ? 'ok' : r.status === 'wrong' ? 'wrong' : 'none',
      sec: timed && r.rtMs !== null ? Math.round(r.rtMs / 100) / 10 : null,
      group: r.group,
    })),
    groups: s.groups,
    groupCaption: s.groupCaption,
    max,
    ...(timed && s.rapid ? { rapid: { to: s.rapid.ms / 1000, label: s.rapid.label } } : {}),
    legend: {
      ok: okName,
      wrong: wrongName,
      ...(none ? { none: noneName } : {}),
    },
  };
  // Sesli okumada çok uzun liste kısaltılır: doğru satırlar okunmaz; geri kalan da çoksa hiçbiri tek tek okunmaz.
  const long = s.rows.length > SPEECH_ROWS_MAX;
  const quietAll = long && s.rows.length - ok > SPEECH_NOTABLE_MAX;
  const rows: PartRow[] = s.rows.map((r, i) => ({
    no: i + 1,
    text: hide ? (r.place ?? '') : r.shown,
    ...(r.say && !hide ? { say: r.say } : {}),
    value: rowValue(s, hide ? { ...r, given: null, expected: null } : r),
    tags: [...(r.tags ?? []), ...(r.rapid ? ['çok hızlı'] : []), ...(r.rtMs !== null && !s.noTime ? [secTag(r.rtMs)] : [])],
    ...(r.status === 'correct' || r.status === 'wrong' ? {} : { muted: true }),
    ...(quietAll || (long && r.status === 'correct') ? { silent: true } : {}),
  }));
  const note = wrapped
    ? [
        `Her işaret bir ${s.noun}; her satır bir grup, işaretler testteki sırayla.`,
        `Dolu daire ${okName}, içi boş daire ${wrongName}${none ? `, kısa çizgi ${noneName}` : ''}.`,
        'Liste uzun olduğu için süreler çizilmedi; satırlarda yazıyor.',
      ].join(' ')
    : [
        `Her işaret bir ${s.noun}; soldan sağa testteki sırayla, gruplar altta yazılı.`,
        `Dolu daire ${okName}, içi boş daire ${wrongName}${none ? `, kısa çizgi ${noneName}` : ''}.`,
        ...(timed ? [`İşaret ne kadar yüksekse ${s.noun} o kadar uzun sürdü; çok uzun süreler üst kenarda.`] : []),
        ...(timed && s.rapid ? ['Alttaki açık bant, testin çok hızlı saydığı süredir.'] : []),
      ].join(' ');
  const quietNote = quietAll
    ? `${cap(pl(s.noun))} tek tek okunmaz; ekranda ve PDF dosyasında listelenir.`
    : long && ok
      ? `${cap(okName)} ${pl(s.noun)} tek tek okunmaz; ekranda ve PDF dosyasında listelenir.`
      : null;
  return {
    key: s.key,
    title: s.title,
    badge: `${s.rows.length} ${s.noun}`,
    ...(s.text ? { text: s.text } : {}),
    note,
    visual,
    rows,
    rowsHead: { item: s.noun, value: hide ? 'Sonuç' : v(c, 'Cevabın', 'Cevabı') },
    spoken: [
      `${cap(okName)}: ${sayCount(ok)}. ${cap(wrongName)}: ${sayCount(wrong)}.${none ? ` ${cap(noneName.replace(/[“”]/g, ''))}: ${sayCount(none)}.` : ''}`,
      ...(quietNote ? [quietNote] : []),
    ],
  };
}

/* ---------- Bölüm özeti (hızlı görevler) ---------- */

export interface BlockRow {
  label: string;
  /** Parçalar: `legend` sırasıyla (ilk parça her zaman "doğru" ya da onun karşılığıdır). */
  parts: number[];
  /** Satırın sözle özeti ("11 doğru, 1 yanlış · tipik 0,52 sn"). */
  detail: string;
  tags?: string[];
}

export function blocksCard(
  c: Ctx,
  o: {
    key: string;
    title: string;
    badge?: string;
    text?: string;
    noun: string;
    legend: string[];
    rows: BlockRow[];
    valueHead?: string;
    of?: string;
    /** Sağdaki sayının paydası baştaki bu kadar parçanın toplamıdır (ör. bulunan + atlanan harf; yanlış işaretler katılmaz). */
    totalOf?: number;
    /** Grafiğin nasıl okunacağı (varsayılan anlatım uymuyorsa). */
    note?: string;
  },
): PartCard {
  const of = o.of ?? 'deneme';
  const visual: BlocksVisual = {
    type: 'blocks',
    label: o.title,
    rows: o.rows.map((r) => ({
      label: r.label,
      parts: r.parts,
      valueLabel: `${r.parts[0]}/${r.parts.slice(0, o.totalOf ?? r.parts.length).reduce((a, b) => a + b, 0)}`,
    })),
    legend: o.legend,
  };
  return {
    key: o.key,
    title: o.title,
    ...(o.badge ? { badge: o.badge } : {}),
    ...(o.text ? { text: o.text } : {}),
    note:
      o.note ??
      `Her satır bir ${o.noun}. Çubuk o ${loc(o.noun)}ki ${plAcc(of)} türlerine göre ayırır. Sağdaki sayıda önce ${lower(o.legend[0])} olanlar, sonra bütün ${pl(of)} yazar.`,
    visual,
    rows: o.rows.map((r, i) => ({
      no: i + 1,
      text: r.label,
      value: r.detail,
      tags: r.tags ?? [],
    })),
    // Satırın adı kendini anlatır ("Basit bölüm, ilk yarı"): sesli okumada numara ve ad okunmaz.
    rowsHead: { item: o.noun, value: o.valueHead ?? 'Sonuç', numbered: false },
  };
}

/* ---------- Düzeyler ve ölçüler ---------- */

/**
 * Düzeyli testlerde "Düzeyler" kartı: her düzeyin adı ve testin kendi anlatımı yan yana, kişinin ulaştığı düzey vurgulu;
 * grafikte düzeylere göre doğru cevaplar. `read`: ulaşılan düzey yorumlandı (raporun "Ulaşılan düzey" kartıyla aynı).
 */
export function levelsCard(
  c: Ctx,
  o: {
    key: string;
    levels: { level: number; name: string; plain: string }[];
    results: { level: number; n: number; correct: number }[];
    reached: number;
    read: boolean;
    /** Raporun "Ulaşılan düzey" kartının başlığı (rozet onunla aynı yazılır). */
    headline?: string;
    skip?: boolean;
    noun?: string;
  },
): PartCard {
  const noun = o.noun ?? 'soru';
  const active = o.read && o.reached > 0;
  const levels: PartLevel[] = o.levels.map((l) => ({
    label: l.name,
    text: l.plain,
    active: active && l.level === o.reached,
  }));
  const dots: DotsVisual = {
    type: 'dots',
    label: 'Düzeylere göre doğru cevaplar',
    rows: o.results.map((l) => ({
      label: `${l.level}. düzey`,
      filled: l.correct,
      total: l.n,
      valueLabel: `${l.correct}/${l.n}`,
    })),
    legend: ['doğru', o.skip ? 'yanlış ya da “Bilmiyorum”' : 'yanlış'],
  };
  const text = [
    `${cap(pl(noun))} kolaydan zora ${o.levels.length} düzeye ayrılır; her düzeyin ne istediği aşağıda yazıyor.`,
    `Bir düzeye ulaşmak için o düzeydeki ${plGen(noun)} en az %60’ını doğru bulmak gerekir.`,
    `O düzeye kadarki bütün ${plGen(noun)} da en az %60’ı doğru olmalıdır.`,
    `Düzey, testteki ${plGen(noun)} zorluğunu anlatır; başka kişilerle karşılaştırma değildir.`,
    ...(o.reached === 0 && o.headline !== 'Yorumlanmadı' ? ['Hiçbir düzeyde bu ölçüte ulaşılmadığı için düzey belirtilmedi.'] : []),
    ...(!o.read
      ? [
          o.reached === 0 && o.headline !== 'Yorumlanmadı'
            ? `Bu sonuç tek başına bir şey söylemez; nedeni “${QUALITY_TITLE}” bölümünde yazıyor.`
            : `Bu testte ulaşılan düzey yorumlanmadı; nedeni “${QUALITY_TITLE}” bölümünde yazıyor.`,
        ]
      : []),
  ].join(' ');
  return {
    key: o.key,
    title: 'Düzeyler',
    badge: o.headline ?? (!o.read ? 'Yorumlanmadı' : o.reached === 0 ? 'Düzey belirtilmedi' : `${o.reached}. düzey`),
    text,
    // Yorumlanmayan sonucun grafiği olmaz (raporun kartlarındaki kural).
    ...(o.read
      ? {
          note: `Grafikte her satır bir düzey; dolu kare doğru cevaplanan bir ${noun}.`,
          visual: dots,
          spoken: o.results.map((l) => `${l.level}. düzey: ${l.n} ${abl(noun)} ${l.correct === 0 ? 'hiçbiri' : l.correct === 1 ? 'biri' : l.correct} doğru.`),
        }
      : {}),
    levels,
  };
}

/**
 * Bir ölçünün kartı: ne anlattığı ve nasıl hesaplandığı; değeri grafikte. Sonuç yorumlanmadıysa (`unread` ya da rozet
 * "Yorumlanmadı") grafik ve değerin sözle okunuşu olmaz; metin nedenin nerede yazdığını söyler.
 */
export function measureCard(o: {
  key: string;
  title: string;
  badge?: string;
  unread?: boolean;
  text: string;
  note?: string;
  visual?: ItemVisual;
  spoken?: string[];
}): PartCard {
  const unread = o.unread || o.badge === 'Yorumlanmadı';
  return {
    key: o.key,
    title: o.title,
    ...(o.badge ? { badge: o.badge } : {}),
    text: unread ? `${o.text} ${UNREAD_WHY}` : o.text,
    ...(!unread && o.note ? { note: o.note } : {}),
    ...(!unread && o.visual ? { visual: o.visual } : {}),
    ...(!unread && o.spoken?.length ? { spoken: o.spoken } : {}),
  };
}

/** Ölçü kartının rozeti raporun sonuç kartından: başlığı ve yorumlanıp yorumlanmadığı. */
export function blockBadge(c: Ctx, key: string): { badge?: string; unread: boolean } {
  const b = c.block(key);
  return { ...(b?.headline ? { badge: b.headline } : {}), unread: b?.interpreted === false };
}

/** Parçalara ayrılmış toplam (ör. doğru, yanlış, "Bilmiyorum"). */
export function stackOf(label: string, parts: { label: string; value: number }[]): StackVisual {
  return {
    type: 'stack',
    label,
    total: parts.reduce((a, p) => a + p.value, 0),
    parts,
  };
}

/** Süre şeridi: her ölçüm bir nokta, tipik süre (ortanca) çizgi. `digits`: noktaların saniyedeki ondalığı. */
export function stripOf(o: {
  label: string;
  rts: number[];
  median: number;
  marker: string;
  item: string;
  digits?: 1 | 2;
  zone?: StripVisual['zone'];
  /** Çizginin anlamı: tipik süre (ortanca) ya da ortalama. */
  line?: 'tipik süre' | 'ortalama';
}): StripVisual {
  const f = o.digits === 2 ? 100 : 10;
  const points = o.rts.map((ms) => Math.round((ms / 1000) * f) / f);
  return {
    type: 'strip',
    label: o.label,
    min: 0,
    max: niceMax(Math.max(o.digits === 2 ? 0.5 : 1, ...points) * 1.1),
    unit: 'sn',
    points,
    marker: { value: Math.round((o.median / 1000) * f) / f, label: o.marker },
    ...(o.zone ? { zone: o.zone } : {}),
    caption: `Her nokta ${o.item}; çizgi ${o.line ?? 'tipik süre'}`,
  };
}

/** Tipik süre kartının ortak anlatımı. */
export function medianText(noun: string, from: string): string {
  return `Tipik süre, ${noun} sürelerinin ortasındaki değerdir: ${plGen(noun)} yarısı daha kısa, yarısı daha uzun sürer. Ortadaki değer, birkaç çok uzun ya da çok kısa sürenin etkisini azaltır. Süre, ${from} ölçülür.`;
}

/* ---------- Denetimler ---------- */

export const statusBadge = (s: PartStatus) => (s === 'ok' ? 'Uygun' : s === 'warn' ? 'Dikkat' : 'Denetlenemedi');

/** Denetim kartı: ne denetlendiği, sonucu ve (Dikkat varsa) ne yapılabileceği; grafiği sınırlarıyla. */
export function check(
  key: string,
  title: string,
  status: PartStatus,
  o: {
    what: string;
    result: string;
    todo?: string;
    visual?: ItemVisual;
    note?: string;
    spoken?: string[];
  },
): PartCard {
  // Yapılamayan denetimin grafiği ve sözle okunan değeri olmaz (değer bir şey söylemez).
  const shown = status !== 'none';
  return {
    key,
    title,
    status,
    badge: statusBadge(status),
    text: [o.what, o.result, ...(status === 'warn' && o.todo ? [o.todo] : [])].join(' '),
    ...(shown && o.visual && o.note ? { note: o.note } : {}),
    ...(shown && o.visual ? { visual: o.visual } : {}),
    ...(shown && o.spoken?.length ? { spoken: o.spoken } : {}),
  };
}

/**
 * Sayım denetiminin çubuğu (tam sayılar): `warnAt` ve üstü "Dikkat" (`low`: `warnAt` ve altı "Dikkat"). Sınır iki tam sayının
 * arasındadır; boş kalan bölge çizilmez.
 */
export function countMeter(
  label: string,
  max: number,
  warnAt: number,
  rows: MeterVisual['rows'],
  low = false,
  /**
   * `warnLabel`: uyarı bölgesinin adı (ör. "Şansla da ulaşılabilir"). `calm`: bölge bu kişide uyarı değildir (ör. doğrular az
   * ama 1. düzeydeki doğrular şansla açıklanamıyor): bölge adıyla çizilir, "Dikkat" rengi taşımaz.
   */
  opts: { warnLabel?: string; calm?: boolean } = {},
): MeterVisual {
  const cut = low ? warnAt + 0.5 : warnAt - 0.5;
  const warnLabel = opts.warnLabel ?? 'Dikkat';
  const warn = !opts.calm;
  const zones = low
    ? [
        { from: 0, to: Math.min(max, cut), label: warnLabel, warn },
        { from: Math.min(max, cut), to: max, label: 'Uygun', warn: false },
      ]
    : [
        {
          from: 0,
          to: Math.min(max, Math.max(0, cut)),
          label: 'Uygun',
          warn: false,
        },
        {
          from: Math.min(max, Math.max(0, cut)),
          to: max,
          label: warnLabel,
          warn,
        },
      ];
  return {
    type: 'meter',
    label,
    min: 0,
    max,
    zones: zones.filter((z) => z.to > z.from),
    rows,
    discrete: true,
  };
}

/**
 * Oran denetiminin kuralı (yüzde): `['>', 10]` yüzde 10'dan çok, `['≥', 25]` yüzde 25 ya da daha çok, `['<', 50]` yüzde 50'den
 * az, `['≤', 60]` yüzde 60 ya da daha az "Dikkat". Sınırın kendisi kuralın dediği tarafta kalır.
 */
export type ShareRule = ['>' | '≥' | '<' | '≤', number];
/** Kesin eşitsizlikte sınır değerin hangi bölgeye düştüğünü ayıran küçük pay (çizimde görünmez). */
const EDGE = 1e-6;

/** Oran denetiminin çubuğu (yüzde, 0–100): kuralların dediği aralıklar "Dikkat". */
export function shareMeter(label: string, rules: ShareRule[], rows: MeterVisual['rows']): MeterVisual {
  const warn: [number, number][] = rules.map(([op, b]) =>
    op === '>' ? [b + EDGE, 100] : op === '≥' ? [b, 100] : op === '<' ? [0, b] : [0, Math.min(100, b + EDGE)],
  );
  const cuts = [...new Set([0, 100, ...warn.flat()])].sort((a, b) => a - b);
  const zones = cuts.slice(0, -1).map((from, i) => {
    const to = cuts[i + 1];
    const isWarn = warn.some(([a, b]) => from >= a && to <= b);
    return { from, to, label: isWarn ? 'Dikkat' : 'Uygun', warn: isWarn };
  });
  // Komşu aynı bölgeler birleştirilir.
  const merged: MeterVisual['zones'] = [];
  for (const z of zones) {
    const last = merged[merged.length - 1];
    if (last && last.warn === z.warn) last.to = z.to;
    else merged.push({ ...z });
  }
  return { type: 'meter', label, min: 0, max: 100, zones: merged, rows };
}

/** Sürelerin ölçümü kartı: süreler ölçüldü mü; ölçülemediyse süreye dayanan denetimler yapılamadı. */
export function timingCard(
  c: Ctx,
  o: {
    key?: string;
    noun: string;
    measured: number;
    total: number;
    extra?: string;
  },
): PartCard {
  const visual = stackOf(`Süresi ölçülen ${pl(o.noun)}`, [
    { label: 'Süresi ölçülen', value: o.measured },
    { label: 'Süresi ölçülemeyen', value: o.total - o.measured },
  ]);
  const what =
    'Süreler bu cihazda, tarayıcının içinde ölçülür. Ölçülen süre cihaza göre biraz farklı çıkabilir; bu yüzden süreler yalnızca kendi içinde okunur.';
  if (o.total === 0) {
    return check(o.key ?? 'sure', 'Sürelerin ölçümü', 'none', { what, result: `Süresi ölçülecek bir ${o.noun} olmadı.` });
  }
  if (o.measured === 0) {
    return check(o.key ?? 'sure', 'Sürelerin ölçümü', 'none', {
      what,
      result: 'Bu testte süreler ölçülemedi; süreye dayanan denetimler yapılamadı.',
      spoken: [`Süresi ölçülen: yok. Süresi ölçülemeyen: ${sayCount(o.total, o.noun)}.`],
    });
  }
  return check(o.key ?? 'sure', 'Sürelerin ölçümü', 'ok', {
    what,
    result: [
      o.measured === o.total
        ? `Bütün ${plGen(o.noun)} süresi ölçüldü.`
        : `Bazı ${plGen(o.noun)} süresi ölçülemedi; süreye dayanan denetimler ölçülenlerle yapıldı.`,
      ...(o.extra ? [o.extra] : []),
    ].join(' '),
    visual,
    spoken: [`Süresi ölçülen: ${sayCount(o.measured, o.noun)}. Süresi ölçülemeyen: ${sayCount(o.total - o.measured)}.`],
  });
}

/** Denetimlerin hepsinde bir şey yoksa (ör. görev çok kısa) yine de bir kart gösterilsin diye. */
export const hasWarn = (cards: PartCard[]) => cards.some((x) => x.status === 'warn');

/** "Yeniden çözmek" önerisi (yalnızca "Dikkat" yazan kartlarda). */
export function retake(c: Ctx, how = 'acele etmeden'): string {
  return v(
    c,
    `Testi başka bir gün, dinlenmiş olarak ve ${how} yeniden çözebilirsin.`,
    `Testi başka bir gün, dinlenmiş olarak ve ${how} yeniden çözmesini önerebilirsiniz.`,
  );
}

/** Bir sonuç kartı yorumlandı mı (kart yoksa yorumlanmış sayılır). */
export const read = (c: Ctx, key: string) => c.block(key)?.interpreted !== false;
