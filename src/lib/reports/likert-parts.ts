import { REPORT_TEMPLATES } from '@/content/reports';
import {
  ITEM_NOUN_ACCUSATIVE,
  ITEM_NOUN_COPULA,
  ITEM_NOUN_DATIVE,
  ITEM_NOUN_GENITIVE,
  ITEM_NOUN_INSTRUMENTAL,
  ITEM_NOUN_PLURAL,
  ITEM_NOUN_POSS_DATIVE,
  likertItemNoun,
  type ItemNoun,
} from '@/lib/instruments/nouns';
import type { LikertInstrument, ScaleDef } from '@/lib/instruments/types';
import { extremeOptions, LIKERT_QUALITY, runIgnored, scaleItems, type LikertAnswer, type QualityReport } from '@/lib/scoring/likert';
import type { Audience, ReportContent, ReportSection } from './build';
import type { PartCard, PartGroup, PartLevel, PartRow, ReportPart } from './parts';
import { CIRCUMPLEX_PAIRS_NEEDED, circumplexOpposites, compareOf, gaugeOf, type SimpleReport } from './simple';
import { niceMax } from './visual-draw';
import type { AnswersVisual, BarsVisual, MeterVisual, StackVisual, StripVisual } from './visuals';

/**
 * Anket (Likert) testlerinin ek rapor bölümleri (site sahibinin 2026-10-31 isteği; model lib/reports/parts.ts):
 *  1. "Düzeylerin anlamı": her ölçekte düzeylerin (düşük, orta, yüksek…) ne anlattığı yan yana; kişinin düzeyi kartla ve
 *     genel bakışla aynı düzey çubuğunda vurgulu (testin kendi eşikleri), ölçümün doğal payı biliniyorsa puanın çevresinde;
 *     pay komşu düzeye uzanıyorsa o düzey "Bu da uyabilir" diye işaretlenir. Düzeylerin anlatımı rapor şablonundaki kısa
 *     başlıklardır (`summary`); kartın uzun metni yinelenmez. Şablonda metni olmayan ölçekte (Holland alanları,
 *     motivasyonun bileşik ölçekleri; ikisinde de ters madde yoktur) düzey, cevapların ortalamasının yakın olduğu
 *     seçeneklerle anlatılır (Holland testinde bir kez, girişte).
 *  2. "Cevapların tek tek": her ölçeğin maddeleri, verilen cevaplar, ters puanlanan ve boş bırakılan maddeler; grafikte her
 *     madde puana katkısıyla, ölçeğin ortalaması işaretli. Öğrenci mahremiyeti (2026-11-01 kararı, site sahibi
 *     değiştirebilir): veli raporunda maddeler ve cevaplar yoktur, yalnızca öğrencinin kendi raporunda olduğu söylenir;
 *     öğrenci ve yetişkin raporunda bölüm kapalı kutularla başlar.
 *  3. "Cevaplarına ne kadar güvenebiliriz?": uyarı kutusundaki denetimlerin (lib/scoring/likert.ts, likertQuality; çember ve
 *     motivasyon testlerinde rapordaki tutarlılık denetimleri) her biri grafikle; sınırlar ve kararlar uyarılarla aynıdır.
 * Dil: öğrenciye ve yetişkine "sen", veliye "çocuğunuz"; yetişkin metninde okula özgü sözcük yok; cümleler kısa (en çok 22
 * sözcük); tanı ya da yargı yok (tests/rapor-bolumleri.test.ts).
 */

const nf1 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Araştırma kaynağı: açılıp okunan özet (Europe PMC). */
export const CARELESS_SOURCE = {
  text: 'Meade, A. W., & Craig, S. B. (2012). Identifying careless responses in survey data. Psychological Methods, 17(3), 437–455.',
  url: 'https://doi.org/10.1037/a0028085',
};

/** "Cevapların tek tek" grafiği PDF'te bu kadar maddeden uzun testlerde çizilmez (satırlar yine yazılır). */
export const PDF_ANSWER_VISUALS_MAX_ITEMS = 60;

/** Ölçeklerin anıldığı ad ve Türkçe biçimleri ("Her boyutta", "Her boyutun", "bu boyutta", "boyutun"). */
interface Unit {
  word: string;
  each: string;
  eachOf: string;
  inThis: string;
  of: string;
}
const unit = (word: string, loc: string, gen: string): Unit => ({ word, each: `Her ${loc}`, eachOf: `Her ${gen}`, inThis: `bu ${loc}`, of: gen });
export const UNITS = {
  ölçek: unit('ölçek', 'ölçekte', 'ölçeğin'),
  boyut: unit('boyut', 'boyutta', 'boyutun'),
  yön: unit('yön', 'yönde', 'yönün'),
  tarz: unit('tarz', 'tarzda', 'tarzın'),
  özellik: unit('özellik', 'özellikte', 'özelliğin'),
  konu: unit('konu', 'konuda', 'konunun'),
  alan: unit('alan', 'alanda', 'alanın'),
  değer: unit('değer', 'değerde', 'değerin'),
  eğilim: unit('eğilim', 'eğilimde', 'eğilimin'),
  alışkanlık: unit('alışkanlık', 'alışkanlıkta', 'alışkanlığın'),
  tür: unit('tür', 'türde', 'türün'),
  bileşen: unit('bileşen', 'bileşende', 'bileşenin'),
} as const;

/**
 * Raporun kendi genel bakış metninde ölçeklere verilen ad ("Her satır bir boyut", "Tarzlar", "Bileşenler"…); verilmezse
 * profile göre (ilgi ve etkinlik: alan, değer: değer, çember: tarz, ayrıntılı profil: boyut, motivasyon: tür), yoksa
 * "ölçek". tests/rapor-bolumleri.test.ts adın raporun kendi metninde geçtiğini denetler.
 */
export const UNIT_BY_SLUG: Record<string, keyof typeof UNITS> = {
  'cocuk-kisilik-profili': 'yön',
  'bes-faktor-kisilik': 'boyut',
  'hizli-kisilik-testi': 'boyut',
  '16-faktorlu-kisilik-profili': 'özellik',
  'ogrenme-ve-basari-ozellikleri': 'özellik',
  'dusunme-ve-calisma-tarzi': 'özellik',
  'heyecan-arayisi': 'yön',
  iyimserlik: 'konu',
  empati: 'yön',
  'oz-yeterlik': 'alan',
  'oz-denetim': 'alan',
  merak: 'yön',
  'liderlik-egilimleri': 'eğilim',
  'calisma-aliskanliklari': 'alışkanlık',
  'erteleme-ve-zaman-yonetimi': 'alan',
  zihniyet: 'alan',
  'duygusal-zeka-bilesenleri': 'bileşen',
};

export function unitOf(def: LikertInstrument): Unit {
  const byProfile: Partial<Record<NonNullable<LikertInstrument['profile']>, keyof typeof UNITS>> = {
    riasec: 'alan',
    interests: 'alan',
    activities: 'alan',
    values: 'değer',
    circumplex: 'tarz',
    facets: 'boyut',
    motivation: 'tür',
  };
  return UNITS[UNIT_BY_SLUG[def.slug] ?? (def.profile ? byProfile[def.profile] : undefined) ?? 'ölçek'];
}

interface Ctx {
  def: LikertInstrument;
  content: ReportContent;
  report: SimpleReport;
  audience: Audience;
  noun: ItemNoun;
  unit: Unit;
  byKey: Map<string, ReportSection>;
}

/** Sesli okunan sayı: sıfır "yok", bir "bir" ("Boş bırakılan: yok", "bir cümle"). */
const spokenCount = (n: number, noun = '') => (n === 0 ? 'yok' : `${n === 1 ? 'bir' : n}${noun ? ` ${noun}` : ''}`);

const v3 = (c: Ctx, t: { you: string; parent: string; adult?: string }) => (c.audience === 'parent' ? t.parent : c.audience === 'adult' ? (t.adult ?? t.you) : t.you);
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
const lower = (s: string) => s.toLocaleLowerCase('tr-TR');
const unquote = (s: string) => s.trim().replace(/[.!?]$/, '');
const quoted = (labels: string[], join = ' ya da ') => labels.map((l) => `“${l}”`).join(join);
const NUMBER_WORDS = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];

/**
 * Hassas maddeler: destek kutusunu açan maddeler (`supportItems`) ve destek kutusunu açabilen ölçeklerin (ör. duygusal denge,
 * ruh hâli) maddeleri. Bunlar örnek olarak gösterilmez.
 */
function sensitive(c: Ctx, key: string): boolean {
  if (c.def.supportItems?.some((x) => x.key === key)) return true;
  const it = c.def.items.find((i) => i.key === key);
  if (!it) return false;
  const t = REPORT_TEMPLATES[c.def.slug];
  const scales = [it.scale, ...(it.alsoScales ?? []), ...c.def.scales.filter((s) => s.of?.includes(it.scale)).map((s) => s.key)];
  return scales.some((k) => Object.values(t?.scales[k] ?? {}).some((b) => b?.support));
}

/**
 * Kartların gruplanışı: bileşik ölçekler (boyutlar) kendi alt ölçekleriyle, kalan ölçekler sonda başlıksız. İlgi, etkinlik
 * ve değer profillerinde kalan ölçekler raporun genel bakışındaki sırayla (en yüksekten); çemberde saat yönünde.
 */
function scaleGroups(c: Ctx): { composite?: ScaleDef; scales: ScaleDef[] }[] {
  const { def } = c;
  const inComposite = new Set(def.scales.flatMap((s) => s.of ?? []));
  const groups: { composite?: ScaleDef; scales: ScaleDef[] }[] = def.scales
    .filter((s) => s.of?.length)
    .map((s) => ({ composite: s, scales: s.of!.flatMap((k) => def.scales.find((x) => x.key === k) ?? []) }));
  let rest = def.scales.filter((s) => !s.of && !inComposite.has(s.key));
  if (c.content.circumplex) {
    const clockwise = (angle: number) => (((90 - angle) % 360) + 360) % 360;
    const angle = new Map(c.content.circumplex.map((a) => [a.key, a.angle]));
    rest = [...rest].sort((a, b) => clockwise(angle.get(a.key) ?? 0) - clockwise(angle.get(b.key) ?? 0));
  } else if (def.profile === 'interests' || def.profile === 'activities' || def.profile === 'values') {
    const order = c.content.sections.map((s) => s.scaleKey);
    rest = [...rest].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  }
  if (rest.length) groups.push({ scales: rest });
  return groups;
}

/* ---------- 1. Düzeylerin anlamı ---------- */

/**
 * Düzeyin aralığına düşen cevap seçenekleri (ortalama puanlı ölçekte madde ortalaması; toplam puanlı ölçekte madde başına).
 * Yalnızca ters maddesi olmayan ölçekte (ortalama doğrudan cevaplardır).
 */
function anchorOptions(c: Ctx, scale: ScaleDef, from: number, to: number, last: boolean): string[] {
  const items = scaleItems(c.def, scale);
  if (!items.length || items.some((i) => i.reverse)) return [];
  const per = c.def.scoring.method === 'mean' ? 1 : items.length;
  const lo = from / per;
  const hi = to / per;
  return c.def.options.filter((o) => o.value >= lo - 1e-9 && (o.value < hi - 1e-9 || (last && o.value <= hi + 1e-9))).map((o) => o.label);
}

function anchorText(opts: string[]): string {
  if (!opts.length) return '';
  return opts.length === 1
    ? `Cevapların ortalaması “${opts[0]}” seçeneğine yakın`
    : `Cevapların ortalaması “${opts[0]}” ile “${opts[opts.length - 1]}” civarında`;
}

const sameText = (a: string, b: string) => lower(a.trim()) === lower(b.trim());

function levelCard(c: Ctx, scale: ScaleDef, anchorsInIntro: boolean): PartCard | null {
  const sec = c.byKey.get(scale.key);
  if (!sec) return null;
  const gauge = gaugeOf(sec);
  if (!gauge) return null;
  const texts = REPORT_TEMPLATES[c.def.slug]?.scales[scale.key];
  const raw = gauge.zones.map((z, i) => {
    const anchor = anchorsInIntro ? '' : anchorText(anchorOptions(c, scale, z.from, z.to, i === gauge.zones.length - 1));
    const summary = texts?.[z.band]?.summary;
    // Kısa başlık düzeyin adıyla aynıysa (ör. "Dengeli") bir şey anlatmaz: yerine seçenek anlatımı ya da hiçbir şey.
    const text = summary && !sameText(summary, z.label) ? summary : anchor;
    return { zone: i, label: z.label, text, active: i === gauge.active };
  });
  // Ölçümün doğal payı komşu düzeye uzanıyorsa o düzey "Bu da uyabilir" diye işaretlenir.
  const nearZones = new Set<number>();
  if (sec.value !== null && sec.ciLow !== null && sec.ciHigh !== null && gauge.active !== null) {
    const i = gauge.active;
    if (i > 0 && sec.ciLow < gauge.zones[i].from - 1e-9) nearZones.add(i - 1);
    if (i < gauge.zones.length - 1 && sec.ciHigh > gauge.zones[i].to + 1e-9) nearZones.add(i + 1);
  }
  // Komşu düzeylerin anlatımı aynıysa (ör. "çok az" ve "az kullanılıyor") tek satırda.
  const levels: (PartLevel & { zones: number[] })[] = [];
  for (const l of raw) {
    const prev = levels[levels.length - 1];
    if (prev && l.text && prev.text === l.text) {
      prev.label = `${prev.label} · ${l.label}`;
      prev.active ||= l.active;
      prev.zones.push(l.zone);
    } else levels.push({ label: l.label, text: l.text, active: l.active, zones: [l.zone] });
  }
  const both = nearZones.size === 2;
  for (const l of levels) {
    if (l.active || !l.zones.some((z) => nearZones.has(z))) continue;
    l.near = true;
    if (!both) {
      l.spoken = v3(c, {
        you: 'Puanın bu düzeyin sınırına yakın; bu anlatım da sana uyabilir.',
        parent: 'Çocuğunuzun puanı bu düzeyin sınırına yakın; bu anlatım da çocuğunuza uyabilir.',
      });
    }
  }
  const paras: string[] = [];
  const spoken: string[] = [];
  const whose = v3(c, { you: 'Puanın', parent: 'Çocuğunuzun puanı' });
  if (sec.value === null) {
    paras.push(`${cap(c.unit.inThis)} yeterince ${c.noun} cevaplanmadığı için düzey belirlenemedi.`);
  } else {
    spoken.push(`${whose}: ${sec.valueLabel}.`);
    if (sec.ciLow !== null && sec.ciHigh !== null) {
      const fmt = (x: number) => (c.def.scoring.method === 'mean' ? nf1.format(Math.round(x * 10) / 10) : String(Math.round(x)));
      spoken.push(`Ölçümün doğal payı hesaba katılınca ${lower(whose)} büyük olasılıkla ${fmt(sec.ciLow)} ile ${fmt(sec.ciHigh)} arasında.`);
    }
    if (both) paras.push(`${whose} iki komşu düzeyin de sınırına yakın; ${c.unit.inThis} düzey kesin değil.`);
    if (sec.split) {
      if (scale.of) {
        const parts = `${lower(c.content.facetTerms?.subject ?? 'Alt özellikler')}i`;
        paras.push(
          v3(c, {
            you: `Bu boyutun ${parts} birbirinden ayrıştığı için kartında düzeyin genel anlatımı yerine bu ayrışma anlatıldı.`,
            parent: `Bu boyutun ${parts} birbirinden ayrıştığı için kartta düzeyin genel anlatımı yerine bu ayrışma anlatıldı.`,
          }),
        );
      } else {
        paras.push(
          v3(c, {
            you: `${cap(c.unit.inThis)} cevapların iki uca ayrıldığı için kartında düzeyin genel anlatımı yerine bu ayrışma anlatıldı.`,
            parent: `${cap(c.unit.inThis)} cevaplar iki uca ayrıldığı için kartta düzeyin genel anlatımı yerine bu ayrışma anlatıldı.`,
          }),
        );
      }
    }
  }
  return {
    key: scale.key,
    title: scale.name,
    badge: sec.band ? sec.bandLabel : 'Hesaplanamadı',
    ...(paras.length ? { text: paras.join(' ') } : {}),
    visual: gauge,
    levels: levels.map((l) => ({ label: l.label, text: l.text, active: l.active, ...(l.near ? { near: true } : {}), ...(l.spoken ? { spoken: l.spoken } : {}) })),
    ...(spoken.length ? { spoken } : {}),
  };
}

/** Raporun genel bakış notu bir cümlenin anlamını zaten söylüyorsa o cümle bölümde yinelenmez. */
function repeats(c: Ctx, re: RegExp): boolean {
  return re.test(`${c.report.chartNote ?? ''} ${c.content.overview ?? ''}`);
}

function levelsPart(c: Ctx, qualityWarns: boolean): ReportPart | null {
  const anchorsInIntro = c.def.profile === 'riasec';
  const groups: PartGroup[] = scaleGroups(c)
    .map((g) => ({
      ...(g.composite ? { title: g.composite.name } : {}),
      cards: [...(g.composite ? [g.composite] : []), ...g.scales].flatMap((s) => levelCard(c, s, anchorsInIntro) ?? []),
    }))
    .filter((g) => g.cards.length > 0);
  if (!groups.length) return null;
  const cards = groups.flatMap((g) => g.cards);
  const t = REPORT_TEMPLATES[c.def.slug];
  const profile = c.def.profile;
  const one = cards.length === 1;
  const hasMargin = cards.some((k) => k.visual?.type === 'gauge' && k.visual.ciLow !== null);
  const hasNear = cards.some((k) => k.levels?.some((l) => l.near));
  // Holland profilinde düzeylerin seçeneklerle anlatımı her alanda aynıdır: girişte bir kez.
  const anchors: string[] = [];
  if (anchorsInIntro) {
    const g = cards[0].visual?.type === 'gauge' ? cards[0].visual : null;
    const scale = c.def.scales.find((s) => s.key === cards[0].key)!;
    const pairs = (g?.zones ?? []).flatMap((z, i, zs) => {
      const opts = anchorOptions(c, scale, z.from, z.to, i === zs.length - 1);
      return opts.length ? [`${quoted(opts)} ${lower(z.label)}`] : [];
    });
    for (let i = 0; i < pairs.length; i += 3) {
      const chunk = pairs.slice(i, i + 3).join(', ');
      anchors.push(i === 0 ? `Cevapların ortalamasına göre: ${chunk}.` : `${cap(chunk)}.`);
    }
  }
  const kind =
    profile === 'riasec' || profile === 'interests'
      ? repeats(c, /yetenek demek değil/)
        ? ''
        : v3(c, {
            you: 'İlgi, yetenek demek değildir: düzey neyi yapabileceğini değil, neyi yapmaktan hoşlandığını gösterir.',
            parent: 'İlgi, yetenek demek değildir: düzey çocuğunuzun neyi yapabileceğini değil, neyi yapmaktan hoşlandığını gösterir.',
          })
      : profile === 'activities'
        ? repeats(c, /imkân/)
          ? ''
          : v3(c, {
              you: 'Düzeyler etkinlikleri ne sıklıkla yaptığını anlatır; sıklık, zamana ve imkânlara da bağlıdır.',
              parent: 'Düzeyler etkinliklerin ne sıklıkla yapıldığını anlatır; sıklık, zamana ve imkânlara da bağlıdır.',
            })
        : profile === 'values'
          ? repeats(c, /doğrusu ya da yanlışı yoktur/)
            ? ''
            : v3(c, {
                you: 'Düzeyler bir işte neye ne kadar önem verdiğini anlatır; değerlerin doğrusu ya da yanlışı yoktur.',
                parent: 'Düzeyler bir işte neye ne kadar önem verildiğini anlatır; değerlerin doğrusu ya da yanlışı yoktur.',
              })
          : t?.evaluative
            ? v3(c, {
                you: 'Düzeyler bugünkü alışkanlıklarını anlatır; alışkanlıklar denedikçe değişebilir.',
                parent: 'Düzeyler çocuğunuzun bugünkü alışkanlıklarını anlatır; alışkanlıklar denedikçe değişebilir.',
              })
            : repeats(c, /iyi, öteki kötü|iyi ya da kötü|kusur|başarı notu|eksiklik/)
              ? ''
              : 'Düşük düzey bir eksiklik, yüksek düzey bir başarı notu değildir.';
  const intro = [
    v3(c, {
      you: `${one ? 'Düzeylerin' : `${c.unit.each} düzeylerin`} ne anlattığı yan yana yazıyor; senin düzeyin vurgulu.`,
      parent: `${one ? 'Düzeylerin' : `${c.unit.each} düzeylerin`} ne anlattığı yan yana yazıyor; çocuğunuzun düzeyi vurgulu.`,
    }),
    v3(c, {
      you: 'Düzeyi, cevaplarının hangi seçeneklere yakın olduğu belirler; başkalarıyla karşılaştırma yapılmaz.',
      parent: 'Düzeyi, çocuğunuzun cevaplarının hangi seçeneklere yakın olduğu belirler; başka çocuklarla karşılaştırma yapılmaz.',
    }),
    ...anchors,
    kind,
    ...(hasMargin
      ? [
          `Birkaç ${ITEM_NOUN_INSTRUMENTAL[c.noun]} yapılan her ölçümde puan biraz aşağıda ya da yukarıda da olabilirdi; buna ölçümün doğal payı denir.`,
          'Sarı bant bu payı gösterir.',
        ]
      : []),
    ...(qualityWarns
      ? [v3(c, { you: 'Cevap denetimlerinde “Dikkat” olduğu için düzeyleri de dikkatle oku.', parent: 'Cevap denetimlerinde “Dikkat” olduğu için düzeyleri de dikkatle okuyun.' })]
      : []),
  ]
    .filter(Boolean)
    .join(' ');
  const introNote = [
    v3(c, { you: 'Grafikte vurgulu bölge düzeyin, kırmızı işaret puanındır.', parent: 'Grafikte vurgulu bölge düzeyi, kırmızı işaret puanı gösterir.' }),
    ...(hasMargin
      ? ['Sarı bant, puanın yaklaşık %90 olasılıkla bulunduğu aralıktır; ölçeğin başka çalışmalardaki güvenirliğinden hesaplanır, Türkçe çeviri için yaklaşıktır.']
      : []),
    ...(hasNear ? ['“Bu da uyabilir” yazan düzey, puanın sınırına yakın olduğu komşu düzeydir.'] : []),
  ].join(' ');
  return {
    key: 'levels',
    title: 'Düzeylerin anlamı',
    intro,
    introNote,
    groups,
    ...(cards.length > 8 ? { collapsed: true } : {}),
  };
}

/* ---------- 2. Cevapların tek tek ---------- */

function answersCard(c: Ctx, scale: ScaleDef, answers: Record<string, LikertAnswer>): PartCard | null {
  const { def } = c;
  const items = scaleItems(def, scale);
  if (!items.length) return null;
  const vals = def.options.map((o) => o.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const label = (v: number) => def.options.find((o) => o.value === v)?.label ?? String(v);
  const order = new Map(def.items.map((it, i) => [it.key, i + 1]));
  const nameOf = (key: string) => def.scales.find((s) => s.key === key)?.name ?? key;
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const rows: PartRow[] = [];
  const points: AnswersVisual['rows'] = [];
  for (const it of items) {
    const a = answers[it.key];
    const no = order.get(it.key)!;
    // Madde başka ölçeklerin puanına da katılıyorsa (ör. hobi ölçeklerinde "Şiir yazmak") o ölçekler yazılır.
    const others = [it.scale, ...(it.alsoScales ?? [])].filter((k) => k !== scale.key);
    const tags = [...(it.reverse ? ['ters puanlanır'] : []), ...others.map((k) => `${nameOf(k)} puanına da katılır`)];
    if (!a || !Number.isFinite(a.value)) {
      rows.push({ no, text: it.text, value: 'Cevaplanmadı', tags, muted: true });
      points.push({ label: String(no), value: null, reverse: !!it.reverse });
    } else {
      rows.push({ no, text: it.text, value: label(a.value), tags });
      points.push({ label: String(no), value: it.reverse ? lo + hi - a.value : a.value, reverse: !!it.reverse });
    }
  }
  const sec = c.byKey.get(scale.key);
  const keyed = points.flatMap((p) => (p.value === null ? [] : [p.value]));
  const mean = sec?.value !== null && sec?.value !== undefined && keyed.length ? keyed.reduce((s, v) => s + v, 0) / keyed.length : null;
  const hasReverse = items.some((i) => i.reverse);
  const hasMissing = rows.some((r) => r.muted);
  // Toplam puanlı ölçekte (öz-saygı) işaret madde başına ortalamadır: kartın toplam puanıyla karışmasın.
  const meanName = def.scoring.method === 'sum' ? `${cap(c.noun)} başına` : 'Ortalama';
  const meanText = mean === null ? '' : nf1.format(Math.round(mean * 10) / 10);
  const visual: AnswersVisual = {
    type: 'answers',
    label: scale.name,
    min: lo,
    max: hi,
    rows: points,
    mean: mean === null ? null : { value: mean, label: `${meanName} ${meanText}` },
    axis: ['düşük', 'puana katkı', 'yüksek'],
    legend: {
      filled: hasReverse ? `öteki ${plural}` : plural,
      ...(hasReverse ? { hollow: `ters puanlanan ${plural}` } : {}),
      ...(hasMissing ? { missing: 'boş: cevaplanmadı' } : {}),
    },
  };
  return {
    key: scale.key,
    title: scale.name,
    badge: `${items.length} ${c.noun}`,
    ...(sec?.value === null ? { text: `${cap(c.unit.inThis)} yeterince ${c.noun} cevaplanmadığı için puan hesaplanamadı.` } : {}),
    visual,
    rows,
    rowsHead: { item: c.noun, value: 'Cevabın' },
    ...(mean !== null ? { spoken: [`${meanName}: ${meanText} / ${hi}.`] } : {}),
  };
}

function answersPart(c: Ctx, answers: Record<string, LikertAnswer>): ReportPart | null {
  const { def } = c;
  const title = v3(c, { you: 'Cevapların tek tek', parent: 'Çocuğunuzun cevapları tek tek' });
  // Öğrenci mahremiyeti: veli raporunda maddeler ve cevaplar yoktur.
  if (c.audience === 'parent') {
    return {
      key: 'answers',
      title,
      intro: 'Cevaplar tek tek yalnızca öğrencinin kendi raporunda yer alır. Çocuğunuz isterse birlikte bakabilirsiniz.',
      groups: [],
    };
  }
  const groups: PartGroup[] = scaleGroups(c)
    .map((g) => ({ ...(g.composite ? { title: g.composite.name } : {}), cards: g.scales.flatMap((s) => answersCard(c, s, answers) ?? []) }))
    .filter((g) => g.cards.length > 0);
  if (!groups.length) return null;
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const lowest = def.options.reduce((a, b) => (b.value < a.value ? b : a));
  const hasReverse = def.items.some((i) => i.reverse);
  // Örnek ters madde: hassas olmayan (destek kutusunu açabilen ölçeklerin maddeleri örnek gösterilmez).
  const example = def.items.find((i) => i.reverse && !sensitive(c, i.key));
  const reverse = hasReverse
    ? [
        `Bazı ${plural} ters puanlanır: bu ${plural}e katılmamak puanı yükseltir.`,
        ...(example
          ? [
              `Örneğin “${unquote(example.text)}” ${ITEM_NOUN_POSS_DATIVE[c.noun]} verilen “${lowest.label}” cevabı, ${def.scales.find((s) => s.key === example.scale)!.name} puanını yükseltir.`,
            ]
          : []),
      ]
    : [];
  const whose = groups.flatMap((g) => g.cards).length === 1 ? 'Testin' : c.unit.eachOf;
  const intro = [
    ...(c.audience === 'student' ? ['Bu bölüm cevaplarını tek tek gösterir; raporunu kiminle paylaşacağına sen karar verirsin.'] : []),
    `${whose} ${plural}i ve verdiğin cevaplar aşağıda. Numaralar, ${plural}in testteki sırasıdır.`,
    ...reverse,
    ...(def.scoring.method === 'sum' ? [`Ölçeğin puanı, ${plural}in puana katkılarının toplamıdır.`] : []),
    'Cevapların yalnızca bu sayfada ve indirdiğin PDF dosyasında görünür; hiçbir yerde saklanmaz.',
  ].join(' ');
  const introNote = [
    `Grafikte her satır bir ${c.noun}; satırın adı ${ITEM_NOUN_GENITIVE[c.noun]} numarasıdır.`,
    'Nokta, cevabın puana katkısını gösterir; sağa gittikçe katkı artar.',
    ...(hasReverse ? [`İçi boş nokta ters puanlanan ${ITEM_NOUN_COPULA[c.noun]}.`] : []),
    `Kırmızı çizgi ${c.unit.of} ortalamasıdır.`,
  ].join(' ');
  return {
    key: 'answers',
    title,
    intro,
    introNote,
    groups,
    collapsed: true,
    appendix: true,
    ...(def.items.length > PDF_ANSWER_VISUALS_MAX_ITEMS ? { pdfVisuals: false as const } : {}),
  };
}

/* ---------- 3. Cevaplarına ne kadar güvenebiliriz? ---------- */

const statusBadge = (s: 'ok' | 'warn' | 'none') => (s === 'ok' ? 'Uygun' : s === 'warn' ? 'Dikkat' : 'Denetlenemedi');

function card(key: string, title: string, status: 'ok' | 'warn' | 'none', x: Omit<PartCard, 'key' | 'title' | 'status' | 'badge'>): PartCard {
  return { key, title, status, badge: statusBadge(status), ...x };
}

/** Saniye: bir saniyenin altında iki, üstünde bir ondalıkla. */
const secText = (ms: number) => (ms < 1000 ? nf2.format(Math.round(ms / 10) / 100) : nf1.format(Math.round(ms / 100) / 10));

/**
 * Sayım denetimlerinin (çift, dizi) çubuğu: değerler tam sayıdır; sınır `need − 0,5`'te çizilir (ör. 5 çiftte "Uygun 0–2",
 * "Dikkat 3–5"), böylece kişinin işareti hiçbir zaman tam sınırın üstüne düşmez.
 */
function countMeter(label: string, max: number, need: number, rows: MeterVisual['rows']): MeterVisual {
  return {
    type: 'meter',
    label,
    min: 0,
    max,
    zones: [
      { from: 0, to: need - 0.5, label: 'Uygun', warn: false },
      { from: need - 0.5, to: max, label: 'Dikkat', warn: true },
    ],
    rows,
    discrete: true,
  };
}

/** Tipik cevap süresi bunun altındaysa (çok hızlı sayılmasa da) "yine de hızlı" denir (ms). */
const QUICK_MS = 1500;

function speedCard(c: Ctx, q: QualityReport): PartCard {
  const acc = ITEM_NOUN_ACCUSATIVE[c.noun];
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const title = 'Cevap hızı';
  if (q.medianRtMs === null || q.rtsMs.length < LIKERT_QUALITY.fastMinRts) {
    return card('speed', title, 'none', { text: 'Cevap süreleri ölçülemediği için bu denetim yapılamadı.' });
  }
  const secs = q.rtsMs.map((ms) => Math.round(ms / 10) / 100);
  const sorted = [...secs].sort((a, b) => a - b);
  const p90 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))];
  const max = Math.max(4, niceMax(p90));
  const clipped = secs.some((s) => s > max);
  const fast = LIKERT_QUALITY.fastMs / 1000;
  const visual: StripVisual = {
    type: 'strip',
    label: 'Cevap süreleri',
    min: 0,
    max,
    unit: 'sn',
    points: secs,
    marker: { value: q.medianRtMs / 1000, label: `Tipik ${secText(q.medianRtMs)} sn` },
    zone: { from: 0, to: fast, label: `Çok hızlı: ${nf1.format(fast)} sn altı` },
    caption: clipped ? `Her nokta bir cevap; ${max} sn’den uzunlar sağ uçta` : 'Her nokta bir cevap',
  };
  const what = [
    `Bir ${acc} okuyup cevaplamak genellikle birkaç saniye sürer.`,
    'Tipik süre, sürelerin ortasındaki değerdir: cevapların yarısı daha kısa, yarısı daha uzun sürede verilir.',
  ];
  const result = q.tooFast
    ? v3(c, {
        you: `Tipik cevap süren çok kısa; bu sürede bir ${acc} okumak zordur. Bazı ${plural} okunmadan işaretlenmiş olabilir. Testi başka bir gün, acele etmeden yeniden çözebilirsin.`,
        parent: `Çocuğunuzun tipik cevap süresi çok kısa; bu sürede bir ${acc} okumak zordur. Bazı ${plural} okunmadan işaretlenmiş olabilir. Testi başka bir gün, acele etmeden yeniden çözmesini önerebilirsiniz.`,
      })
    : [
        v3(c, {
          you: 'Tipik cevap süren, çok hızlı sayılan sürenin üstünde.',
          parent: 'Çocuğunuzun tipik cevap süresi, çok hızlı sayılan sürenin üstünde.',
        }),
        ...(q.medianRtMs < QUICK_MS
          ? [
              v3(c, {
                you: `Yine de hızlı; ${plural}i okuyarak cevap verdiysen sorun yok.`,
                parent: `Yine de hızlı; çocuğunuz ${plural}i okuyarak cevap verdiyse sorun yok.`,
              }),
            ]
          : []),
      ].join(' ');
  return card('speed', title, q.tooFast ? 'warn' : 'ok', {
    text: [...what, result].join(' '),
    note: 'Her nokta bir cevabın süresidir. Kırmızı çizgi tipik süreyi, renkli bölge çok hızlı cevapları gösterir.',
    visual,
    spoken: [
      `${v3(c, { you: 'Tipik cevap süren', parent: 'Çocuğunuzun tipik cevap süresi' })}: ${secText(q.medianRtMs)} sn.`,
      `Çok hızlı sayılan süre: ${nf1.format(fast)} sn altı.`,
    ],
  });
}

function runCard(c: Ctx, q: QualityReport): PartCard | null {
  const { def } = c;
  if (def.items.length < LIKERT_QUALITY.runMinItems) return null;
  const limit = LIKERT_QUALITY.runLength;
  const max = Math.min(def.items.length, Math.max(2 * limit, niceMax(q.longestRun)));
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const longest = v3(c, { you: 'Arka arkaya aynı cevabı verdiğin en uzun bölüm', parent: 'Arka arkaya aynı cevabın verildiği en uzun bölüm' });
  const visual = countMeter('Arka arkaya aynı cevap', max, limit, [{ label: longest, value: q.longestRun, valueLabel: `${q.longestRun} ${c.noun}` }]);
  const hasReverse = def.items.some((i) => i.reverse);
  const ignored = def.options.filter((o) => runIgnored(def, o.value)).map((o) => o.label);
  const why =
    def.profile === 'activities'
      ? 'az etkinlik yapan biri için bu olağandır'
      : 'ilgi duyulmayan bir alanın etkinlikleri art arda gelebilir';
  const what = [
    ...(hasReverse ? [`Bu testte bazı ${plural} ters yönde yazıldı; dikkatle cevap veren biri genellikle seçeneğini değiştirir.`] : []),
    `Arka arkaya pek çok ${ITEM_NOUN_DATIVE[c.noun]} aynı cevabı vermek, ${plural}e tek tek bakılmadığını gösterebilir.`,
    ...(ignored.length ? [`${quoted(ignored, ' ve ')} cevaplarının dizileri sayılmaz; ${why}.`] : []),
  ];
  const result = q.straightLining
    ? v3(c, {
        you: `${longest} uyarı sınırına ulaştı; bu yüzden sonuçlar dikkatle yorumlanmalı. Testi yeniden çözersen her ${ITEM_NOUN_ACCUSATIVE[c.noun]} okuyarak cevap ver.`,
        parent: `${longest} uyarı sınırına ulaştı; bu yüzden sonuçlar dikkatle yorumlanmalı.`,
      })
    : `${longest} uyarı sınırının altında.`;
  return card('run', 'Arka arkaya aynı cevap', q.straightLining ? 'warn' : 'ok', {
    text: [...what, result].join(' '),
    note: 'Kırmızı çizgi en uzun bölümü, renkli bölge uyarı bölgesini gösterir.',
    visual,
    spoken: [`${longest}: ${spokenCount(q.longestRun, c.noun)}.`, `Uyarı sınırı: ${limit} ${c.noun}.`],
  });
}

function sameAnswerCard(c: Ctx, q: QualityReport): PartCard | null {
  const { def } = c;
  if (!def.sameAnswerCheck) return null;
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const vals = def.options.map((o) => o.value);
  const middle = (Math.min(...vals) + Math.max(...vals)) / 2;
  const hasMiddle = vals.includes(middle);
  const visual: BarsVisual = {
    type: 'bars',
    label: 'Cevapların seçeneklere dağılımı',
    scale: 'share',
    rows: def.options.map((o, i) => ({ label: o.label, value: q.counts[i], max: Math.max(1, q.answered), valueLabel: `${q.counts[i]} ${c.noun}` })),
  };
  const what = [
    `Bu kısa testte ${plural}in bir kısmı olumlu, bir kısmı olumsuz bir şey söyler.`,
    `Hepsine aynı cevabı vermek, ${plural}in ne söylediğine bakılmadığını gösterebilir.`,
    ...(hasMiddle ? ['Ortadaki seçenek bu denetimde sayılmaz.'] : []),
    'Boş bırakılan maddeler bu denetimi bozmaz.',
  ];
  const result = q.sameAnswer
    ? v3(c, {
        you: `Cevapladığın bütün ${plural}e aynı cevabı vermişsin; bu yüzden sonuçlar dikkatle yorumlanmalı. Testi yeniden çözersen her ${ITEM_NOUN_GENITIVE[c.noun]} ne söylediğine dikkat et.`,
        parent: `Çocuğunuz cevapladığı bütün ${plural}e aynı cevabı vermiş; bu yüzden sonuçlar dikkatle yorumlanmalı.`,
      })
    : v3(c, { you: 'Cevaplarında bu durum görülmedi.', parent: 'Çocuğunuzun cevaplarında bu durum görülmedi.' });
  return card('same', 'Hep aynı cevap', q.sameAnswer ? 'warn' : 'ok', {
    text: [...what, result].join(' '),
    visual,
    spoken: def.options.map((o, i) => `${o.label}: ${spokenCount(q.counts[i], c.noun)}.`),
  });
}

function pairsCard(c: Ctx, q: QualityReport): PartCard | null {
  const { def } = c;
  const pairs = def.oppositePairs;
  if (!pairs?.length || q.pairsNeeded === null) return null;
  const need = q.pairsNeeded;
  const warnAgree = q.oppositeAgree >= need;
  const warnDisagree = q.oppositeDisagree >= need;
  const warn = warnAgree || warnDisagree;
  const text = (k: string) => def.items.find((i) => i.key === k)?.text ?? '';
  const ext = extremeOptions(def);
  const label = (v: number) => def.options.find((o) => o.value === v)?.label ?? '';
  const agreeLabels = [...ext.agree].sort((x, y) => x - y).map(label);
  const disagreeLabels = [...ext.disagree].sort((x, y) => y - x).map(label);
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const visual = countMeter(`Birbirinin tersi ${c.noun} çiftleri`, pairs.length, need, [
    { label: 'İkisine de katılma', value: q.oppositeAgree, valueLabel: `${q.oppositeAgree} çift` },
    { label: 'İkisine de katılmama', value: q.oppositeDisagree, valueLabel: `${q.oppositeDisagree} çift` },
  ]);
  // Örnek çift: hassas olmayan ilk çift; veli raporunda örnek madde gösterilmez (öğrenci mahremiyeti).
  const sample = c.audience === 'parent' ? undefined : pairs.find(([a, b]) => !sensitive(c, a) && !sensitive(c, b));
  const what = [
    sample
      ? `Testte birbirinin tersini söyleyen ${c.noun} çiftleri var; örneğin “${unquote(text(sample[0]))}” ile “${unquote(text(sample[1]))}”.`
      : `Testte birbirinin tersini söyleyen ${c.noun} çiftleri var.`,
    'Dikkatle cevap veren biri genellikle böyle bir çiftin ikisine birden katılmaz, ikisine birden karşı da çıkmaz.',
    `Burada katılmak ${quoted(agreeLabels)}, karşı çıkmak ${quoted(disagreeLabels)} demektir.`,
    'İkisine de katılınan çiftler ile ikisine de karşı çıkılan çiftler ayrı ayrı sayılır; biri çiftlerin yarısına ulaşırsa “Dikkat” yazar.',
  ];
  const tendency = (agree: boolean) =>
    v3(c, {
      you: `Çiftlerin yarısında ya da daha çoğunda iki ${ITEM_NOUN_DATIVE[c.noun]} de ${agree ? 'katılmışsın' : 'karşı çıkmışsın'}.`,
      parent: `Çocuğunuz çiftlerin yarısında ya da daha çoğunda iki ${ITEM_NOUN_DATIVE[c.noun]} de ${agree ? 'katılmış' : 'karşı çıkmış'}.`,
    }) + ` Bu, ${plural}in ne söylediğine bakmadan çoğuna aynı yönde cevap verme eğiliminden kaynaklanabilir.`;
  const result = warn
    ? [
        ...(warnAgree ? [tendency(true)] : []),
        ...(warnDisagree ? [tendency(false)] : []),
        v3(c, {
          you: `Bu yüzden sonuçlar dikkatle yorumlanmalı. Testi yeniden çözersen her ${ITEM_NOUN_GENITIVE[c.noun]} ne söylediğine dikkat et.`,
          parent: 'Bu yüzden sonuçlar dikkatle yorumlanmalı.',
        }),
      ].join(' ')
    : v3(c, { you: 'Bu çiftlerdeki cevapların uyarı sınırının altında kaldı.', parent: 'Bu çiftlerdeki cevaplar uyarı sınırının altında kaldı.' });
  return card('pairs', 'Birbirinin tersi cümleler', warn ? 'warn' : 'ok', {
    text: [...what, result].join(' '),
    note: 'Kırmızı çizgi çift sayısını, renkli bölge uyarı bölgesini gösterir.',
    visual,
    spoken: [`İkisine de katılma: ${spokenCount(q.oppositeAgree, 'çift')}. İkisine de katılmama: ${spokenCount(q.oppositeDisagree, 'çift')}.`, `Uyarı sınırı: ${need} çift.`],
  });
}

function circumplexCard(c: Ctx): PartCard | null {
  const axes = c.content.circumplex;
  if (!axes?.length) return null;
  const { pairs, bothHigh, bothLow } = circumplexOpposites(axes, c.byKey);
  if (!pairs) return null;
  const need = CIRCUMPLEX_PAIRS_NEEDED;
  const warn = bothHigh >= need || bothLow >= need;
  const a = [...axes].sort((x, y) => Math.abs(x.angle - 90) - Math.abs(y.angle - 90))[0];
  const b = axes.find((x) => x.angle === (a.angle + 180) % 360);
  const name = (k: string) => lower(c.byKey.get(k)?.name ?? k);
  const visual = countMeter('Karşıt tarz çiftleri', pairs, need, [
    { label: 'İkisi de yüksek çıkan', value: bothHigh, valueLabel: `${bothHigh} çift` },
    { label: 'İkisi de düşük çıkan', value: bothLow, valueLabel: `${bothLow} çift` },
  ]);
  const what = [
    `Çemberde karşı karşıya duran tarzlar birbirinin tersidir${b ? `; örneğin ${name(a.key)} ile ${name(b.key)}` : ''}.`,
    'Böyle iki tarzın birden yüksek ya da birden düşük çıkması seyrektir.',
    `İkisi de yüksek çıkan çiftler ile ikisi de düşük çıkan çiftler ayrı ayrı sayılır; biri ${NUMBER_WORDS[need]} çifte ulaşırsa “Dikkat” yazar.`,
    'Bu durum, cümlelerin çoğuna katılma ya da katılmama eğiliminden kaynaklanabilir.',
  ];
  const result = warn
    ? v3(c, {
        you: 'Senin cevaplarında bu durum görüldü; bu yüzden tarzlarını yorumlarken dikkatli ol.',
        parent: 'Çocuğunuzun cevaplarında bu durum görüldü; bu yüzden tarzlar dikkatle yorumlanmalı.',
      })
    : v3(c, { you: 'Senin cevaplarında bu durum görülmedi.', parent: 'Çocuğunuzun cevaplarında bu durum görülmedi.' });
  return card('circle', 'Karşıt tarzlar', warn ? 'warn' : 'ok', {
    text: [...what, result].join(' '),
    note: 'Kırmızı çizgi çift sayısını, renkli bölge uyarı bölgesini gösterir.',
    visual,
    spoken: [`İkisi de yüksek çıkan: ${spokenCount(bothHigh, 'çift')}. İkisi de düşük çıkan: ${spokenCount(bothLow, 'çift')}.`, `Uyarı sınırı: ${need} çift.`],
  });
}

/** "a, b ve c" */
const joinTr = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}` : (xs[0] ?? ''));

function motivationCard(c: Ctx): PartCard | null {
  const m = c.content.motivation;
  if (!m) return null;
  const secs = m.contradictionScales.flatMap((k) => c.byKey.get(k) ?? []);
  const alone = c.byKey.get(m.contradictionScales[m.contradictionScales.length - 1]);
  const visual = compareOf(secs);
  if (!alone || !visual) return null;
  const parts = secs.filter((s) => s !== alone && s.scaleKey !== m.x.key);
  const isHigh = (s: ReportSection) => s.band === 'high' || s.band === 'very_high';
  const highNames = secs.filter(isHigh).map((s) => lower(s.name));
  const what = [
    `${m.x.name}${parts.length ? ` (ya da ${joinTr(parts.map((s) => lower(s.name)))})` : ''} ile ${lower(alone.name)} birbirine terstir.`,
    'Biri yüksekken öteki de yüksek çıkarsa cevaplar birbirine ters düşüyor olabilir.',
  ];
  const result = m.contradiction
    ? v3(c, {
        you: `Senin cevaplarında ${joinTr(highNames)} yüksek çıktı; bu yüzden motivasyon profilin dikkatle yorumlanmalı.`,
        parent: `Çocuğunuzun cevaplarında ${joinTr(highNames)} yüksek çıktı; bu yüzden motivasyon profili dikkatle yorumlanmalı.`,
      })
    : v3(c, { you: 'Senin cevaplarında böyle bir çelişki görülmedi.', parent: 'Çocuğunuzun cevaplarında böyle bir çelişki görülmedi.' });
  return card('contradiction', 'Birbirine ters cevaplar', m.contradiction ? 'warn' : 'ok', {
    text: [...what, result].join(' '),
    visual,
    spoken: secs.map((s) => (s.value === null ? `${s.name}: hesaplanamadı.` : `${s.name}: ${s.valueLabel}, ${s.bandLabel}.`)),
  });
}

function missingCard(c: Ctx, q: QualityReport): PartCard {
  const plural = ITEM_NOUN_PLURAL[c.noun];
  const empty = q.total - q.answered;
  const visual: StackVisual = {
    type: 'stack',
    label: `Cevaplanan ve boş bırakılan ${plural}`,
    total: q.total,
    parts: [
      { label: v3(c, { you: 'Cevapladığın', parent: 'Cevaplanan' }), value: q.answered },
      { label: 'Boş bırakılan', value: empty },
    ],
  };
  const result = q.incomplete
    ? v3(c, {
        you: `Bazı ${plural}i boş bıraktın. Puanlar cevapladığın ${plural}den hesaplandı; daha az ${ITEM_NOUN_DATIVE[c.noun]} dayanan sonuç daha az kesindir. Boş ${plural}i “Cevapların tek tek” bölümünde görebilirsin.`,
        parent: `Bazı ${plural} boş bırakıldı. Puanlar cevaplanan ${plural}den hesaplandı; daha az ${ITEM_NOUN_DATIVE[c.noun]} dayanan sonuç daha az kesindir.`,
      })
    : v3(c, {
        you: `Bütün ${plural}i cevapladın; sonuçların hepsine dayanıyor.`,
        parent: `Bütün ${plural} cevaplandı; sonuçlar hepsine dayanıyor.`,
      });
  return card('missing', `Boş bırakılan ${plural}`, q.incomplete ? 'warn' : 'ok', {
    text: result,
    visual,
    spoken: [`${v3(c, { you: 'Cevapladığın', parent: 'Cevaplanan' })}: ${spokenCount(q.answered, c.noun)}. Boş bırakılan: ${spokenCount(empty)}.`],
  });
}

function qualityPart(c: Ctx, q: QualityReport): ReportPart {
  const cards = [speedCard(c, q), runCard(c, q), sameAnswerCard(c, q), pairsCard(c, q), circumplexCard(c), motivationCard(c), missingCard(c, q)].filter(
    (x): x is PartCard => x !== null,
  );
  const warns = cards.filter((x) => x.status === 'warn').length;
  const skipped = cards.filter((x) => x.status === 'none').length;
  const summary =
    warns === 0
      ? skipped
        ? skipped === 1
          ? 'Denetimlerden biri yapılamadı; yapılanların hepsi uygun çıktı.'
          : 'Bazı denetimler yapılamadı; yapılanların hepsi uygun çıktı.'
        : v3(c, { you: 'Senin cevaplarında denetimlerin hepsi uygun çıktı.', parent: 'Çocuğunuzun cevaplarında denetimlerin hepsi uygun çıktı.' })
      : warns === 1
        ? 'Bir denetimde “Dikkat” yazıyor; ayrıntısı aşağıda.'
        : `${cap(NUMBER_WORDS[warns] ?? String(warns))} denetimde “Dikkat” yazıyor; ayrıntıları aşağıda.`;
  // Araştırma (üniversite öğrencileriyle) küçük çocuğa anlatılmaz; velisine anlatılır.
  const young = c.content.young && c.audience === 'student';
  const intro = [
    v3(c, {
      you: 'Bu bölüm, cevaplarının sonucu ne kadar iyi yansıttığını denetler.',
      parent: 'Bu bölüm, çocuğunuzun cevaplarının sonucu ne kadar iyi yansıttığını denetler.',
    }),
    ...(young
      ? []
      : [
          v3(c, {
            you: 'Bir araştırmada, ders kredisi karşılığında uzun bir anketi dolduran üniversite öğrencilerinin yaklaşık onda birinin dikkatsiz cevap verdiği bulundu (Meade ve Craig, 2012).',
            parent:
              'Bir araştırmada, ders kredisi karşılığında uzun bir anketi dolduran üniversite öğrencilerinin yaklaşık onda birinin dikkatsiz cevap verdiği bulundu (Meade ve Craig, 2012).',
            adult: 'Bir araştırmada, üniversitede kredi karşılığında uzun bir anketi dolduran gençlerin yaklaşık onda birinin dikkatsiz cevap verdiği bulundu (Meade ve Craig, 2012).',
          }),
        ]),
    '“Dikkat” yazan bir denetim sonucun yanlış olduğunu göstermez; sonucun dikkatle okunması gerektiğini gösterir.',
    summary,
  ].join(' ');
  return {
    key: 'quality',
    title: v3(c, { you: 'Cevaplarına ne kadar güvenebiliriz?', parent: 'Cevaplara ne kadar güvenebiliriz?' }),
    intro,
    groups: [{ cards }],
    ...(young ? {} : { sources: [CARELESS_SOURCE] }),
  };
}

/**
 * Anket testinin ek bölümleri, raporda gösterilecek sırayla. Cevap kalitesi önce hesaplanır: bir denetimde "Dikkat" varsa
 * düzeylerin anlamı bunu da söyler.
 */
export function likertParts(input: {
  def: LikertInstrument;
  content: ReportContent;
  report: SimpleReport;
  answers: Record<string, LikertAnswer>;
  quality: QualityReport;
}): ReportPart[] {
  const { def, content, report } = input;
  const c: Ctx = {
    def,
    content,
    report,
    audience: content.audience,
    noun: likertItemNoun(def),
    unit: unitOf(def),
    byKey: new Map(content.sections.map((s) => [s.scaleKey, s])),
  };
  const quality = qualityPart(c, input.quality);
  const warns = quality.groups.some((g) => g.cards.some((k) => k.status === 'warn'));
  return [levelsPart(c, warns), answersPart(c, input.answers), quality].filter((p): p is ReportPart => p !== null);
}
