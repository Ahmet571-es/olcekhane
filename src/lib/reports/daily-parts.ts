import { DAILY } from '@/content/gunluk';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { AdultLines, DailyLines, SkillDaily, SkillsDaily, SurveyDaily } from '@/content/gunluk/types';
import { ITEM_NOUN_PLURAL, likertItemNoun } from '@/lib/instruments/nouns';
import type { InstrumentDef, LikertInstrument, ScaleDef } from '@/lib/instruments/types';
import { formForGrade } from '@/lib/scoring/quiz';
import type { Audience, ReportContent, ReportSection } from './build';
import { unitOf } from './likert-parts';
import { hasWarn } from './part-kit';
import type { PartCard, PartGroup, ReportPart } from './parts';
import { bandGroup } from './roadmap';
import { gaugeOf } from './simple';
import type { ContextsVisual, PolesVisual } from './visual-daily';

/**
 * "Günlük hayatta nasıl görünür" bölümü (site sahibinin 2026-10-31 isteği; aşama d; model lib/reports/parts.ts, metinler
 * src/content/gunluk/). Raporda ilk ek bölümün ("Düzeylerin anlamı" ya da "Düzeylerin ve ölçülerin anlamı") hemen ardından,
 * "Cevapların tek tek"ten önce; ekranda, PDF'te, sesli dinlemede ve Kendini Tanı Paketi'nde.
 *
 *  - Anket testleri: sonuç kartı olan her ölçek (`dailyScales`) için bir kart. Rozet "Düzeylerin anlamı"ndaki kartın rozetidir
 *    (aynı düzey); grafik iki uç (`poles`): ölçeğin iki ucunun günlük karşılığı, kişinin düzeyinin bölgesi ve yeri; satırlar
 *    o düzeyin grubundaki (düşük, orta, yüksek) üç ortamın örnekleri. Puan hesaplanamadıysa ya da cevaplar iki uca
 *    ayrıldığı için kartta düzeyin genel anlatımı yerine ayrışma anlatıldıysa örnek seçilmez (kısa nedeniyle); destek
 *    önerisini bir cevap açtıysa örneklerin genel düzeye göre seçildiği söylenir.
 *  - Görev, okuma, sesli okuma ve konu tarama testleri: her beceri (ya da konu alanı) için bir kart: tanım, grafik
 *    (`contexts`: ortada becerinin adı, üç dalda kullanıldığı yerler) ve üç ortamın örnekleri. Sonuca göre değişmez.
 * Bir testin metin dosyası yoksa bölüm yoktur (tests/gunluk-hayat.test.ts'teki `DAILY_PENDING` listesi küçülerek biter).
 */

/** Ortamların adları (anket testleri). */
export const SURVEY_CONTEXTS = {
  you: ['Okulda', 'Arkadaşlarla', 'Evde'],
  adult: ['İşte ya da günlük işlerde', 'Arkadaşlarla', 'Evde'],
} as const;

/** Ortamların adları (görev, okuma ve konu tarama testleri). */
export const SKILL_CONTEXTS = {
  you: ['Okulda', 'Oyunda ve arkadaşlarla', 'Evde'],
  adult: ['İşte ya da günlük işlerde', 'Boş zamanda ve arkadaşlarla', 'Evde'],
} as const;

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
const lower = (s: string) => s.toLocaleLowerCase('tr-TR');

type Voice = { you: string; parent: string; adult?: string };
const by = (a: Audience, t: Voice) => (a === 'parent' ? t.parent : a === 'adult' ? (t.adult ?? t.you) : t.you);

/** Kime yazıldığına göre üç ortamın metni (yetişkinde iş satırı; arkadaş ve ev satırları verilmezse öğrencininki). */
export function linesOf(t: { student: DailyLines; parent: DailyLines; adult?: AdultLines }, audience: Audience): [string, string, string] {
  if (audience === 'parent') return [t.parent.school, t.parent.friends, t.parent.home];
  if (audience === 'adult' && t.adult) return [t.adult.work, t.adult.friends ?? t.student.friends, t.adult.home ?? t.student.home];
  return [t.student.school, t.student.friends, t.student.home];
}

/**
 * Anket testinde örneği yazılan ölçekler: ayrıntılı profilde (boyutlar ve alt özellikler) ve motivasyon profilinde yalnızca
 * kendi sonuç kartı olanlar (bileşik ölçekler ve hiçbir bileşiğe girmeyen ölçek); ötekilerde bütün ölçekler.
 */
export function dailyScales(def: LikertInstrument): ScaleDef[] {
  if (def.profile !== 'facets' && def.profile !== 'motivation') return def.scales;
  const inComposite = new Set(def.scales.flatMap((s) => s.of ?? []));
  return def.scales.filter((s) => s.of?.length || !inComposite.has(s.key));
}

/**
 * Görev, okuma, sesli okuma ve konu tarama testlerinde kartların anlattığı sonuç parçaları: görevler; okuma ve sesli okumada
 * testin ölçüleri (okumada anlama ve hız; sesli okumada doğru okuma, hız, akıcılık, anlama ve yeniden anlatma); konu
 * taramada kişinin formunun konu alanları (`form`). Bir kart birkaç parçayı birlikte anlatabilir (`SkillDaily.covers`).
 */
export function dailySources(def: InstrumentDef, grade: number): { sources: { key: string; name: string }[]; form?: string } {
  switch (def.engine) {
    case 'tasks':
      return { sources: def.tasks.map((t) => ({ key: t.key, name: t.name })) };
    case 'reading':
    case 'oral':
      return { sources: def.scales.map((s) => ({ key: s.key, name: s.name })) };
    case 'quiz': {
      const form = formForGrade(def, grade);
      return { sources: form.domains.map((d) => ({ key: d.key, name: d.name })), form: form.key };
    }
    default:
      return { sources: [] };
  }
}

/** Kartın kullanıldığı formda geçerli olup olmadığı (konu taramada `forms`). */
export const skillInForm = (s: Pick<SkillDaily, 'forms'>, form: string | undefined) => !s.forms || (form !== undefined && s.forms.includes(form));

/* ---------- Anket testleri ---------- */

/** Kişinin yerinin sözle anlatımı: hangi uca daha yakın (düzeyin grubuna göre; rozetle aynı). */
function polesSpoken(v: PolesVisual, group: 'low' | 'average' | 'high' | null, a: Audience): string[] {
  // Uçların adları cümlenin içinde küçük harfle ("İki uç: “önce dinler” ve “sohbeti başlatır”").
  const low = lower(v.low);
  const high = lower(v.high);
  const head = `İki uç: “${low}” ve “${high}”.`;
  if (v.value === null || group === null) return [head, 'Yer belirlenemedi.'];
  const whose = by(a, { you: 'Senin yerin', parent: 'Çocuğunuzun yeri' });
  if (group === 'average') return [head, `${whose} iki ucun arasında.`];
  return [head, `${whose} “${group === 'low' ? low : high}” ucuna daha yakın.`];
}

function surveyCard(def: LikertInstrument, content: ReportContent, daily: SurveyDaily, scale: ScaleDef, sec: ReportSection): PartCard | null {
  const t = daily.scales[scale.key];
  const gauge = gaugeOf(sec);
  if (!t || !gauge) return null;
  const a = content.audience;
  const noun = likertItemNoun(def);
  const unit = unitOf(def);
  const zone = gauge.active === null ? null : gauge.zones[gauge.active];
  // İşaret düzeyin bölgesinde kalır: düzey gösterilen (yuvarlanmış) puandan belirlendiği için ham puan sınırın hemen öbür
  // yanına düşebilir (ör. 2,56 → "2,6", "Orta").
  const value = sec.value === null ? null : zone ? Math.min(zone.to, Math.max(zone.from, sec.value)) : sec.value;
  const visual: PolesVisual = {
    type: 'poles',
    label: scale.name,
    low: t.poles.low,
    high: t.poles.high,
    min: sec.min,
    max: sec.max,
    value,
    zone: value !== null && zone ? { from: zone.from, to: zone.to, label: zone.label } : null,
    marker: by(a, { you: 'Senin yerin', parent: 'Çocuğunuzun yeri' }),
  };
  const group = sec.value === null ? null : bandGroup(sec.band);
  const contexts = a === 'adult' ? SURVEY_CONTEXTS.adult : SURVEY_CONTEXTS.you;
  const base = { key: scale.key, title: scale.name, badge: sec.band ? sec.bandLabel : 'Hesaplanamadı', visual, spoken: polesSpoken(visual, group, a) };
  if (sec.value === null || group === null) {
    return { ...base, text: `${cap(unit.inThis)} yeterince ${noun} cevaplanmadığı için düzey belirlenemedi; bu yüzden örnek seçilmedi.` };
  }
  if (sec.split) {
    // Kartta düzeyin genel anlatımı yerine ayrışma anlatıldı: düzeyin örnekleri de kartla çelişirdi.
    const parts = `${lower(content.facetTerms?.subject ?? 'Alt özellikler')}i`;
    const text = scale.of
      ? by(a, {
          you: `Bu boyutun ${parts} birbirinden ayrıştığı için düzeye göre örnek seçilmedi. Kartındaki anlatım bu ayrışmayı anlatıyor.`,
          parent: `Bu boyutun ${parts} birbirinden ayrıştığı için düzeye göre örnek seçilmedi. Karttaki anlatım bu ayrışmayı anlatıyor.`,
        })
      : by(a, {
          you: `${cap(unit.inThis)} cevapların iki uca ayrıldığı için düzeye göre örnek seçilmedi. Kartındaki anlatım bu ayrışmayı anlatıyor.`,
          parent: `${cap(unit.inThis)} cevaplar iki uca ayrıldığı için düzeye göre örnek seçilmedi. Karttaki anlatım bu ayrışmayı anlatıyor.`,
        });
    return { ...base, text };
  }
  const lines = linesOf(t.bands[group], a);
  return {
    ...base,
    ...(sec.flagged
      ? {
          text: by(a, {
            you: `Cevaplarından biri raporda destek önerisinin çıkmasına yol açtı. Bu örnekler o cevaba göre değil, ${unit.of} genel düzeyine göre seçildi.`,
            parent: `Çocuğunuzun cevaplarından biri raporda destek önerisinin çıkmasına yol açtı. Bu örnekler o cevaba göre değil, ${unit.of} genel düzeyine göre seçildi.`,
          }),
        }
      : {}),
    lines: contexts.map((label, i) => ({ label, text: lines[i] })),
  };
}

/** Ölçek profilinin türüne göre girişteki cümle (düzeylerin anlamıyla aynı ilkeler). */
function kindSentence(def: LikertInstrument, content: ReportContent, evaluative: boolean): string {
  const a = content.audience;
  if (def.profile === 'riasec' || def.profile === 'interests' || def.profile === 'activities') {
    return by(a, {
      you: 'Örnekler bir meslek ya da yetenek söylemez; ilgilerinin günlük hayatta nerede görünebileceğini anlatır.',
      parent: 'Örnekler bir meslek ya da yetenek söylemez; çocuğunuzun ilgilerinin günlük hayatta nerede görünebileceğini anlatır.',
    });
  }
  if (def.profile === 'values') return 'Değerlerin doğrusu ya da yanlışı yoktur; örnekler yalnızca neyin öne çıkabileceğini anlatır.';
  if (evaluative) {
    return by(a, {
      you: 'Örnekler bugünkü alışkanlıklarını anlatır; alışkanlıklar denedikçe değişebilir.',
      parent: 'Örnekler çocuğunuzun bugünkü alışkanlıklarını anlatır; alışkanlıklar denedikçe değişebilir.',
    });
  }
  return 'İki ucun da kendine göre kolaylıkları ve zorlukları vardır.';
}

export function surveyDailyPart(input: {
  def: LikertInstrument;
  content: ReportContent;
  /** Testin öteki ek bölümleri: kartların sırası ve gruplanışı "Düzeylerin anlamı"ndaki gibidir; denetimlerde "Dikkat" varsa söylenir. */
  parts: ReportPart[];
  /** Metinler (verilmezse kayıttaki dosya; testler başka bir metinle de deneyebilir). */
  daily?: SurveyDaily;
}): ReportPart | null {
  const { def, content, parts } = input;
  const found = input.daily ?? DAILY[def.slug];
  if (!found || found.kind !== 'survey') return null;
  const daily = found;
  const a = content.audience;
  const wanted = new Set(dailyScales(def).map((s) => s.key));
  const byKey = new Map(content.sections.map((s) => [s.scaleKey, s]));
  const card = (key: string) => {
    const scale = def.scales.find((s) => s.key === key);
    const sec = byKey.get(key);
    return scale && sec && wanted.has(key) ? surveyCard(def, content, daily, scale, sec) : null;
  };
  // Sıra ve gruplar "Düzeylerin anlamı"ndaki gibi; o bölüm yoksa testteki sırayla.
  const levels = parts.find((p) => p.key === 'levels');
  const layout: { title?: string; keys: string[] }[] = levels
    ? levels.groups.map((g) => ({ ...(g.title ? { title: g.title } : {}), keys: g.cards.map((c) => c.key) }))
    : [{ keys: def.scales.map((s) => s.key) }];
  let groups: PartGroup[] = layout
    .map((g) => ({ ...(g.title ? { title: g.title } : {}), cards: g.keys.flatMap((k) => card(k) ?? []) }))
    .filter((g) => g.cards.length > 0);
  // Her grupta tek kart varsa (ör. ayrıntılı profilde yalnızca boyutlar) grup başlığı kartın başlığını yinelerdi.
  if (groups.every((g) => g.cards.length <= 1)) groups = [{ cards: groups.flatMap((g) => g.cards) }];
  const cards = groups.flatMap((g) => g.cards);
  if (!cards.length) return null;
  const unit = unitOf(def);
  const plural = ITEM_NOUN_PLURAL[likertItemNoun(def)];
  const one = cards.length === 1;
  const where = a === 'adult' ? 'işte ya da günlük işlerde, arkadaşlarla ve evde' : 'okulda, arkadaşlarla ve evde';
  const quality = parts.find((p) => p.key === 'quality');
  const evaluative = !!REPORT_TEMPLATES[def.slug]?.evaluative;
  const intro = [
    by(a, {
      you: `Bu bölümde ${one ? 'sonucunun' : lower(unit.eachOf)} günlük hayatta nasıl görünebileceğine dair örnekler var: ${where}.`,
      parent: `Bu bölümde ${one ? 'çocuğunuzun sonucunun' : lower(unit.eachOf)} günlük hayatta nasıl görünebileceğine dair örnekler var: ${where}.`,
    }),
    by(a, {
      you: `Örnekler, cevapladığın ${plural}den çıkarıldı ve senin düzeyine göre seçildi.`,
      parent: `Örnekler, çocuğunuzun cevapladığı ${plural}den çıkarıldı ve onun düzeyine göre seçildi.`,
    }),
    by(a, {
      you: 'Bu düzeydeki birçok kişide görülebilir; hepsi sende olmayabilir.',
      parent: 'Bu düzeydeki birçok çocukta görülebilir; hepsi çocuğunuzda olmayabilir.',
    }),
    kindSentence(def, content, evaluative),
    'Bunlar kesin bir yargı değil, birer örnektir.',
    ...(quality && hasWarn(quality)
      ? [by(a, { you: 'Cevap denetimlerinde “Dikkat” olduğu için örnekleri de dikkatle oku.', parent: 'Cevap denetimlerinde “Dikkat” olduğu için örnekleri de dikkatle okuyun.' })]
      : []),
  ].join(' ');
  return {
    key: 'daily',
    title: 'Günlük hayatta nasıl görünür',
    intro,
    introNote: by(a, {
      you: 'Grafikte iki ucun günlük karşılığı yazıyor; kırmızı işaret senin yerini, vurgulu bölge düzeyini gösterir.',
      parent: 'Grafikte iki ucun günlük karşılığı yazıyor; kırmızı işaret çocuğunuzun yerini, vurgulu bölge düzeyini gösterir.',
    }),
    groups,
    ...(cards.length > 8 ? { collapsed: true } : {}),
  };
}

/* ---------- Görev, okuma, sesli okuma ve konu tarama testleri ---------- */

export function skillsDailyPart(input: {
  def: InstrumentDef;
  audience: Audience;
  grade: number;
  /** Metinler (verilmezse kayıttaki dosya). */
  daily?: SkillsDaily;
}): ReportPart | null {
  const { def, audience: a, grade } = input;
  const found = input.daily ?? DAILY[def.slug];
  if (!found || found.kind !== 'skills') return null;
  const { sources, form } = dailySources(def, grade);
  const order = new Map(sources.map((s, i) => [s.key, i]));
  const covered = (s: SkillDaily) => s.covers ?? [s.key];
  const first = (s: SkillDaily) => Math.min(...covered(s).map((k) => order.get(k) ?? Number.POSITIVE_INFINITY));
  const skills = found.skills.filter((s) => skillInForm(s, form) && Number.isFinite(first(s))).sort((x, y) => first(x) - first(y));
  if (!skills.length) return null;
  const adult = a === 'adult';
  // Sesli okumanın veli ve öğretmen raporu öğrenciden üçüncü kişi olarak söz eder.
  const oral = def.engine === 'oral';
  const contexts = adult ? SKILL_CONTEXTS.adult : SKILL_CONTEXTS.you;
  const cards: PartCard[] = skills.map((s) => {
    const lines = linesOf(s, a);
    const branchTexts = [adult ? (s.branches.work ?? s.branches.school) : s.branches.school, s.branches.friends, s.branches.home];
    const visual: ContextsVisual = {
      type: 'contexts',
      label: s.title ?? sources.find((x) => covered(s).includes(x.key))!.name,
      center: s.short,
      branches: contexts.map((context, i) => ({ context, label: branchTexts[i] })),
    };
    return {
      key: s.key,
      title: visual.label,
      text: s.text,
      visual,
      spoken: [`Kısaca: ${visual.branches.map((b) => `${lower(b.context)} ${lower(b.label)}`).join('; ')}.`],
      lines: contexts.map((label, i) => ({ label, text: lines[i] })),
    };
  });
  const what = def.engine === 'quiz' ? 'testteki konu alanlarının' : cards.length > 1 ? 'testin ölçtüğü becerilerin' : 'testin ölçtüğü becerinin';
  const intro = [
    `Bu bölüm, ${what} günlük hayatta nerede kullanıldığını anlatır.`,
    by(a, {
      you: 'Örnekler senin sonucuna göre seçilmedi; bu testi çözen herkes için aynıdır.',
      parent: oral ? 'Örnekler öğrencinin sonucuna göre seçilmedi; bu testi çözen herkes için aynıdır.' : 'Örnekler çocuğunuzun sonucuna göre seçilmedi; bu testi çözen herkes için aynıdır.',
    }),
    'Bu işlerde başka beceriler, alışkanlıklar ve deneyim de rol oynar.',
    'Bu yüzden tek bir test sonucu, bu işlerin nasıl gideceğini söylemez.',
  ].join(' ');
  return {
    key: 'daily',
    title: 'Günlük hayatta nerede kullanılır',
    intro,
    introNote: def.engine === 'quiz' ? 'Şemanın ortasında konu alanının adı, dallarda kullanıldığı yerler yazıyor.' : 'Şemanın ortasında becerinin adı, dallarda kullanıldığı yerler yazıyor.',
    groups: [{ cards }],
    ...(cards.length > 8 ? { collapsed: true } : {}),
  };
}

/** Bölümü ilk ek bölümün ("Düzeylerin anlamı") hemen ardına koyar; o bölüm yoksa başa. */
export function withDaily(parts: ReportPart[], daily: ReportPart | null): ReportPart[] {
  if (!daily) return parts;
  const i = parts.findIndex((p) => p.key === 'levels');
  return [...parts.slice(0, i + 1), daily, ...parts.slice(i + 1)];
}
