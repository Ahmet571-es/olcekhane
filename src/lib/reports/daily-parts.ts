import { DAILY } from '@/content/gunluk';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { AdultLines, DailyLines, SkillDaily, SkillsDaily, SurveyDaily } from '@/content/gunluk/types';
import { ITEM_NOUN_PLURAL, likertItemNoun } from '@/lib/instruments/nouns';
import type { InstrumentDef, LikertInstrument, ScaleDef } from '@/lib/instruments/types';
import { formForGrade } from '@/lib/scoring/quiz';
import type { LevelGroup } from '@/content/reports/types';
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
 *    o düzeyin grubundaki (düşük, orta, yüksek) üç ortamın örnekleri. Örnek seçilmeyen durumlar (kart kısa nedenini söyler;
 *    rozet ve iki uç kalır): puan hesaplanamadı; cevaplar iki uca ayrıldığı için kartta düzeyin genel anlatımı yerine ayrışma
 *    anlatıldı; motivasyon profilinde bileşik ölçeğin iki parçasından biri yüksek, öteki düşük (`motivationPartsSplit`:
 *    örnekler parçaların maddelerinden yazıldığı için biri parçasının kartıyla çelişirdi; profil yorumu bu farkı anlatır);
 *    destek önerisini bu ölçekteki bir cevap açtı (`flagged`: o cevap destek kutusunda ele alınır; düzeyin örnekleri kutunun
 *    yanında yersiz kalabilirdi). Puanın ölçüm payı komşu bir düzey grubuna uzanıyorsa ("Bu da uyabilir")
 *    kart bunu bir cümleyle söyler. Alt ölçekleri kendi kartlarında örneklenen bir bileşik ölçek örnek yerine bir
 *    yönlendirme taşıyabilir (`ScaleDaily.pointer`; ör. İyimserlik'in toplamı): rozet ve iki uç kalır, satırlar yerine o
 *    metin yazar. Her ölçeğin bir tonu vardır (`scaleTone`): kişilik, merak, ilgi ve değer gibi ölçeklerde
 *    "özellik" (iki uç da eşit), değerlendirici, destek kutusu açabilen ve gelişime açık ölçeklerde "gelişim" (örnekler
 *    bugünkü durumu anlatır).
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
/** Yalnızca ilk harf küçülür (ortamın ya da ucun adı cümlenin içinde; özel adlar ve kısaltmalar korunur). */
export const lowerFirst = (s: string) => s.charAt(0).toLocaleLowerCase('tr-TR') + s.slice(1);

/**
 * Mezun (12. sınıftan sonra; `grade` 13) okulda olmayabilir: yetişkinlere açık olmayan testlerde ilk ortamın adı "Okulda ya
 * da derslerde" olur (örnekler aynıdır; sınava hazırlanan mezun için de dersler ve çalışma saatleri geçerlidir).
 */
export const GRADUATE_SCHOOL_CONTEXT = 'Okulda ya da derslerde';
const graduateContexts = <T extends readonly string[]>(contexts: T, graduate: boolean): string[] =>
  graduate ? [GRADUATE_SCHOOL_CONTEXT, ...contexts.slice(1)] : [...contexts];

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

/**
 * Ölçeğin örneklerinin tonu. "Özellik" (`trait`): kişilik, merak, ilgi, değer ve tarz gibi uçları iyi ya da kötü olmayan
 * ölçekler; iki ucun da gerçek bir kolaylığı ve gerçek ama yumuşak bir zorluğu anlatılır. "Gelişim" (`growth`): şablonu
 * değerlendirici olan testler (yüksek puan gelişmiş bir alışkanlık demektir), düzeylerinden biri destek kutusu açabilen
 * ölçekler (şablonda `support`; ayrıntılı profilde boyutun alt özellikleri de) ve aşağıdaki listede adı geçen, kişinin bugünkü
 * durumunu anlatan ölçekler. Gelişim tonunda örnekler bugünkü durumu anlatır: düşük uca uydurma bir güçlü yan, yüksek uca
 * uydurma bir zorluk yazılmaz; giriş (ya da karışık testte kart) durumun değişebileceğini söyler. tests/gunluk-hayat.test.ts
 * yayındaki her anket testinde sonucu tek tek listeler.
 */
export type DailyTone = 'trait' | 'growth';
/** Bütün ölçekleri gelişim tonunda olan testler (şablonları değerlendirici değil, ama ölçtükleri şey bugünkü durumdur). */
const GROWTH_SLUGS = new Set(['oz-saygi', 'iyimserlik', 'oz-yeterlik', 'zihniyet', 'duygusal-zeka-bilesenleri', 'empati', 'oz-denetim']);
/**
 * Tek tek gelişim tonundaki ölçekler: motivasyon profilinde isteksizlik; Öğrenme ve Başarı Özellikleri'nde zorlukla başa
 * çıkma (maddeleri öz-yeterliği sorar: "Kendimi her işi yapabilecek güçte hissederim"; öz-yeterlik de gelişim tonundadır).
 */
const GROWTH_SCALES: Record<string, string[]> = {
  'ders-calisma-motivasyonu': ['amotivation'],
  'ogrenme-ve-basari-ozellikleri': ['competence'],
};

export function scaleTone(def: LikertInstrument, key: string): DailyTone {
  const t = REPORT_TEMPLATES[def.slug];
  if (t?.evaluative || GROWTH_SLUGS.has(def.slug) || GROWTH_SCALES[def.slug]?.includes(key)) return 'growth';
  const keys = [key, ...(def.scales.find((s) => s.key === key)?.of ?? [])];
  return keys.some((k) => Object.values(t?.scales[k] ?? {}).some((b) => b?.support)) ? 'growth' : 'trait';
}

const GROWTH_SENTENCE = 'Örnekler bugünkü durumu anlatır; bu durum zamanla değişebilir.';

/** Kişinin yerinin sözle anlatımı: iki uç ve hangisine daha yakın olduğu (düzeyin grubuna göre; rozetle aynı). */
function polesSpoken(v: PolesVisual, group: LevelGroup | null, a: Audience): string[] {
  // Uçların adları tırnak içinde, ilk harfi küçük ("Bir uç: “önce dinler”."); sesli okumada tırnaklar okunmaz.
  const low = lowerFirst(v.low);
  const high = lowerFirst(v.high);
  const head = [`Bir uç: “${low}”.`, `Öbür uç: “${high}”.`];
  if (v.value === null || group === null) return [...head, 'Yer belirlenemedi.'];
  const whose = by(a, { you: 'Senin yerin', parent: 'Çocuğunuzun yeri' });
  if (group === 'average') return [...head, `${whose} iki ucun arasında.`];
  return [...head, `${whose} şu uca daha yakın: “${group === 'low' ? low : high}”.`];
}

/**
 * Puanın ölçüm payı komşu bir düzeye uzanıyor ve o düzey başka bir gruptaysa (ör. orta → yüksek) "Düzeylerin anlamı"
 * kartında "Bu da uyabilir" yazar: kart, o düzeyin örneklerinin de uyabileceğini söyler (likert-parts.ts ile aynı hesap).
 */
export function nearGroups(sec: ReportSection): LevelGroup[] {
  const gauge = gaugeOf(sec);
  if (!gauge || sec.value === null || gauge.ciLow === null || gauge.ciHigh === null || gauge.active === null) return [];
  const i = gauge.active;
  const own = bandGroup(gauge.zones[i].band);
  const near: LevelGroup[] = [];
  if (i > 0 && gauge.ciLow < gauge.zones[i].from - 1e-9) near.push(bandGroup(gauge.zones[i - 1].band)!);
  if (i < gauge.zones.length - 1 && gauge.ciHigh > gauge.zones[i].to + 1e-9) near.push(bandGroup(gauge.zones[i + 1].band)!);
  return near.filter((g) => g && g !== own);
}

/**
 * Motivasyon profilinde iki parçalı bir bileşik ölçeğin parçalarından biri yüksek, öteki düşük mü (ayrıntılı profildeki
 * `facetSplit` kuralıyla aynı: düzey grupları). Böyle bir kartta örnek gösterilmez (surveyCard).
 */
export function motivationPartsSplit(def: LikertInstrument, scale: ScaleDef, content: Pick<ReportContent, 'sections'>): boolean {
  if (def.profile !== 'motivation' || scale.of?.length !== 2) return false;
  const groups = scale.of.map((k) => bandGroup(content.sections.find((s) => s.scaleKey === k)?.band ?? null));
  return groups.includes('high') && groups.includes('low');
}

function surveyCard(input: {
  def: LikertInstrument;
  content: ReportContent;
  daily: SurveyDaily;
  scale: ScaleDef;
  sec: ReportSection;
  contexts: string[];
  /** Testte iki ton birlikte varsa gelişim tonundaki kart bunu kendisi söyler (giriş özellik tonunu anlatır). */
  mixed: boolean;
}): PartCard | null {
  const { def, content, daily, scale, sec, contexts, mixed } = input;
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
  const base = { key: scale.key, title: scale.name, badge: sec.band ? sec.bandLabel : 'Hesaplanamadı', visual, spoken: polesSpoken(visual, group, a) };
  if (sec.value === null || group === null) {
    return { ...base, text: `${cap(unit.inThis)} yeterince ${noun} cevaplanmadığı için düzey belirlenemedi; bu yüzden örnek seçilmedi.` };
  }
  if (sec.split) {
    // Kartta düzeyin genel anlatımı yerine ayrışma anlatıldı: düzeyin örnekleri de kartla çelişirdi.
    const parts = `${lowerFirst(content.facetTerms?.subject ?? 'Alt özellikler')}i`;
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
  if (motivationPartsSplit(def, scale, content)) {
    // Motivasyon profilinde bileşik ölçeğin iki parçasından biri yüksek, öteki düşük: örnekler parçaların maddelerinden
    // yazıldığı için hangi düzeyin örnekleri seçilse biri parçasının kendi kartıyla çelişirdi. Bu durumda buildMotivation
    // (build.ts) profil yorumuna her zaman baskın parçayı anlatan cümleyi ekler (bileşik yüksek değilse `hidden`; yüksekse
    // `lean`, çünkü gösterilen ortalamalar arasındaki fark en az 1,1'dir, eşik 1); profil hesaplanamadıysa (öbür bileşik
    // ölçek eksik) o cümle yoktur, kart parçaların ayrı sonuçlarına yönlendirir.
    const where = content.motivation?.pattern
      ? 'Motivasyon profilindeki açıklama bu farkı anlatıyor.'
      : 'Raporda iki parçanın sonucu ayrı ayrı gösteriliyor.';
    return { ...base, text: `Bu türün iki parçasının düzeyi birbirinden çok farklı olduğu için düzeye göre örnek seçilmedi. ${where}` };
  }
  if (sec.flagged) {
    // Destek önerisini bu ölçekteki bir cevap açtı: o cevap destek kutusunda ele alınır; düzeyin örnekleri gösterilmez.
    return {
      ...base,
      text: by(a, {
        you: `${cap(unit.inThis)} örnek gösterilmedi; cevaplarından biri yukarıdaki destek kutusunda ayrıca ele alınıyor.`,
        parent: `${cap(unit.inThis)} örnek gösterilmedi; çocuğunuzun cevaplarından biri yukarıdaki destek kutusunda ayrıca ele alınıyor.`,
      }),
    };
  }
  if (t.pointer) {
    // Bileşik ölçeğin örnekleri alt ölçeklerinin kartlarındadır (kendi örnekleri onlarla çelişebilirdi): rozet ve iki uç
    // kalır, satırların yerine yönlendirme yazar.
    return { ...base, text: by(a, { you: t.pointer.student, parent: t.pointer.parent, adult: t.pointer.adult }) };
  }
  const lines = linesOf(t.bands[group], a);
  const near = nearGroups(sec);
  const text = [
    ...(mixed && scaleTone(def, scale.key) === 'growth' ? [GROWTH_SENTENCE] : []),
    ...(near.length
      ? [
          near.length > 1
            ? by(a, {
                you: 'Puanın komşu düzeylerin sınırına yakın; o düzeylerin örnekleri de uyabilir.',
                parent: 'Çocuğunuzun puanı komşu düzeylerin sınırına yakın; o düzeylerin örnekleri de uyabilir.',
              })
            : by(a, {
                you: 'Puanın komşu düzeyin sınırına yakın; o düzeyin örnekleri de uyabilir.',
                parent: 'Çocuğunuzun puanı komşu düzeyin sınırına yakın; o düzeyin örnekleri de uyabilir.',
              }),
        ]
      : []),
  ].join(' ');
  return {
    ...base,
    ...(text ? { text } : {}),
    lines: contexts.map((label, i) => ({ label, text: lines[i] })),
  };
}

/** Ölçek profilinin türüne ve ölçeklerin tonuna göre girişteki cümle: bütün kartlar için doğru olmalıdır. */
function kindSentence(def: LikertInstrument, content: ReportContent, tones: DailyTone[]): string {
  const a = content.audience;
  if (def.profile === 'riasec' || def.profile === 'interests' || def.profile === 'activities') {
    return by(a, {
      you: 'Örnekler bir meslek ya da yetenek söylemez; ilgilerinin günlük hayatta nerede görünebileceğini anlatır.',
      parent: 'Örnekler bir meslek ya da yetenek söylemez; çocuğunuzun ilgilerinin günlük hayatta nerede görünebileceğini anlatır.',
    });
  }
  if (def.profile === 'values') return 'Değerlerin doğrusu ya da yanlışı yoktur; örnekler yalnızca neyin öne çıkabileceğini anlatır.';
  if (tones.every((t) => t === 'growth')) return GROWTH_SENTENCE;
  return 'Örnekler bir ucu iyi, ötekini kötü diye anlatmaz; günlük hayatta neyin öne çıkabileceğini gösterir.';
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
  const wanted = dailyScales(def).filter((s) => daily.scales[s.key]);
  const tones = wanted.map((s) => scaleTone(def, s.key));
  const mixed = new Set(tones).size > 1;
  const graduate = !!content.graduate && a !== 'adult';
  const contexts = a === 'adult' ? [...SURVEY_CONTEXTS.adult] : graduateContexts(SURVEY_CONTEXTS.you, graduate);
  const byKey = new Map(content.sections.map((s) => [s.scaleKey, s]));
  const card = (key: string) => {
    const scale = wanted.find((s) => s.key === key);
    const sec = byKey.get(key);
    return scale && sec ? surveyCard({ def, content, daily, scale, sec, contexts, mixed }) : null;
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
  const where = contexts.map(lowerFirst).join(', ').replace(/, ([^,]+)$/, ' ve $1');
  const quality = parts.find((p) => p.key === 'quality');
  const intro = [
    by(a, {
      you: `Bu bölümde ${one ? 'sonucunun' : lowerFirst(unit.eachOf)} günlük hayatta nasıl görünebileceğine dair örnekler var: ${where}.`,
      parent: `Bu bölümde ${one ? 'çocuğunuzun sonucunun' : lowerFirst(unit.eachOf)} günlük hayatta nasıl görünebileceğine dair örnekler var: ${where}.`,
    }),
    // Örnekler kişinin tek tek cevaplarından değil, testteki cümlelerin konusundan yazıldı (bir düzeydeki herkese aynıdır).
    by(a, {
      you: `Örnekler, testteki ${plural}in konusundan yazıldı ve senin düzeyine göre seçildi.`,
      parent: `Örnekler, testteki ${plural}in konusundan yazıldı ve çocuğunuzun düzeyine göre seçildi.`,
    }),
    by(a, { you: 'Tek tek cevaplarını yansıtmaz; hepsi sana uymayabilir.', parent: 'Onun tek tek cevaplarını yansıtmaz; hepsi çocuğunuza uymayabilir.' }),
    kindSentence(def, content, tones),
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
  // Mezun (13): ilk ortam "Okulda ya da derslerde" (yetişkin raporu kendi ortamlarını kullanır).
  const contexts = adult ? [...SKILL_CONTEXTS.adult] : graduateContexts(SKILL_CONTEXTS.you, grade === 13);
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
      // Şemanın sözle anlatımı: ortam ve dal ("Kullanıldığı yerler: okulda, şekil örüntüleri; …").
      spoken: [`Kullanıldığı yerler: ${visual.branches.map((b) => `${lowerFirst(b.context)}, ${lowerFirst(b.label)}`).join('; ')}.`],
      lines: contexts.map((label, i) => ({ label, text: lines[i] })),
    };
  });
  const what = def.engine === 'quiz' ? 'testteki konu alanlarının' : cards.length > 1 ? 'testin ölçtüğü becerilerin' : 'testin ölçtüğü becerinin';
  const intro = [
    `Bu bölüm, ${what} günlük hayatta nerede kullanıldığını anlatır.`,
    by(a, {
      you: 'Örnekler senin sonucuna göre seçilmedi; bu testi çözen herkese aynıdır.',
      parent: oral ? 'Örnekler öğrencinin sonucuna göre seçilmedi; bu testi çözen herkese aynıdır.' : 'Örnekler çocuğunuzun sonucuna göre seçilmedi; bu testi çözen herkese aynıdır.',
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
