import { RIASEC_ORDER, RIASEC_TYPES, occupationsFor, type Occupation, type RiasecKey } from '@/content/careers/riasec';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { BandText } from '@/content/reports/types';
import { GRADE_LABELS } from '@/lib/config';
import { DEFAULT_BAND_LABELS, nearestBand } from './bands';
import type {
  Band,
  CancellationTask,
  InstrumentDef,
  QuizChart,
  QuizFigure,
  QuizInstrument,
  QuizOptionKey,
  QuizTable,
  ReadingInstrument,
  TaskInstrument,
} from '@/lib/instruments/types';
import { scaleItems } from '@/lib/scoring/likert';
import type { QuizChoice, QuizResult } from '@/lib/scoring/quiz';
import type { CancellationResult, FlankerResult, SpanResult, SymbolResult } from '@/lib/scoring/tasks';
import type { ReadingResult } from '@/lib/scoring/reading';

/**
 * Raporun kime yazıldığı. Okul çağındaki biri için iki rapor hazırlanır: öğrenciye (ikinci tekil şahısla) ve veliye
 * (çocuğunu anlatarak). Testi kendisi için çözen yetişkine tek, kişisel rapor hazırlanır (ikinci tekil şahısla).
 */
export type Audience = 'student' | 'parent' | 'adult';

/** Metnin dili: öğrenci ve yetişkin raporları ikinci tekil şahısla ("sen"), veli raporu üçüncü şahısla yazılır. */
type Voice = 'student' | 'parent';
const voice = (a: Audience): Voice => (a === 'parent' ? 'parent' : 'student');

/** Puanlamadan gelen ölçek puanının rapora gereken kısmı. */
export interface ReportScore {
  scaleKey: string;
  raw: number | null;
  mean: number | null;
  band: string | null;
  percentile: number | null;
  ciLow: number | null;
  ciHigh: number | null;
  nAnswered: number;
  nItems: number;
  normSetId: string | null;
  extra: Record<string, unknown> | null;
}

export interface ReportSection {
  scaleKey: string;
  name: string;
  plain: string;
  poles?: { low: string; high: string };
  band: Band | null;
  bandLabel: string;
  summary: string;
  text: string;
  tips: string[];
  value: number | null;
  valueLabel: string;
  min: number;
  max: number;
  ciLow: number | null;
  ciHigh: number | null;
  percentile: number | null;
}

export interface ReportContent {
  templateVersion: string;
  instrumentSlug: string;
  instrumentName: string;
  audience: Audience;
  studentName: string;
  gradeLabel: string;
  completedAt: string;
  isPilot: boolean;
  normNote: string;
  qualityNotes: string[];
  sections: ReportSection[];
  highlights: string[];
  /** Değerlendirici ölçeklerde güçlü yanlar ve geliştirilebilecek alanlar. */
  strengths?: string[];
  growth?: string[];
  /** "Genel bakış" açıklaması (şablonda tanımlıysa). */
  overview?: string;
  support: boolean;
  science: { basedOn: string; reliability: string; limitations: string[]; license: string };
  interests?: InterestProfile;
  /** Sıralı ilgi profili (profil: interests). */
  ranking?: InterestRanking;
  /** Ayrıntılı profil (profil: facets): her bileşik ölçek ve alt ölçekleri, testteki sırayla. */
  facetGroups?: { domain: string; facets: string[] }[];
  cognitive?: CognitiveReport;
  academic?: AcademicReport;
  reading?: {
    passageTitle: string;
    wordCount: number;
    readingSeconds: number;
    wpm: number;
    correct: number;
    total: number;
    comprehensionPct: number;
    effectiveWpm: number;
    skills: { label: string; correct: number; total: number }[];
    referenceNote: string | null;
    speedNote: string;
  };
}

export interface AcademicReport {
  subject: string;
  /** Soruların ait olduğu sınıf (öğrencinin bir önceki sınıfı). */
  contentGrade: number;
  n: number;
  correct: number;
  wrong: number;
  dontKnow: number;
  band: Band;
  bandLabel: string;
  text: string;
  domains: { key: string; name: string; plain: string; correct: number; n: number; dontKnow: number; band: Band; bandLabel: string }[];
  /** Yanlış cevapların işaret ettiği hata türleri; en sık görülenden başlayarak. */
  misconceptions: { key: string; name: string; explain: string; tip: string; count: number; itemNumbers: number[] }[];
  /** Hata türleri yalnızca birer soruda görüldüyse temkinli yorum notu gösterilir. */
  misconceptionNote: string;
  review: {
    no: number;
    key: string;
    domain: string;
    domainName: string;
    text: string;
    table?: QuizTable;
    chart?: QuizChart;
    figure?: QuizFigure;
    options: { key: QuizOptionKey; text: string }[];
    choice: QuizChoice | null;
    answer: QuizOptionKey;
    correct: boolean;
    explain: string;
  }[];
  tips: string[];
}

export interface CognitiveBlock {
  key: string;
  name: string;
  plain: string;
  /** Kısa sonuç: "6 rakamlık diziye kadar" gibi. */
  headline: string;
  /** Başlığın altındaki kısa ayrıntı satırı (sayılar). */
  detail?: string;
  text: string;
  ladder?: { length: number; results: boolean[] }[];
  flanker?: { accCongruent: number; accIncongruent: number; rtCongruent: number | null; rtIncongruent: number | null };
  symbol?: { correct: number; errors: number; perMinute: number };
  /** Harf işaretleme: bölüm bölüm net doğru sayısı. */
  sections?: { label: string; value: number }[];
}

export interface CognitiveReport {
  blocks: CognitiveBlock[];
  tips: string[];
}

/**
 * Sıralı ilgi profili: alanlar puana göre en yüksekten en düşüğe dizilir (bölümler de bu sıraya konur) ve en
 * belirgin alanlar ayrıca açıklanır. Türkiye normu olmadığı için sıralama kişinin kendi profili içindedir.
 */
export interface InterestRanking {
  /** Puanı hesaplanan alanların anahtarları, en yüksekten en düşüğe. */
  order: string[];
  /** Belirgin (yüksek düzeydeki) en çok üç alan; hiçbiri yoksa en yüksek iki alan. */
  top: string[];
  /** Hiçbir alanda belirgin ilgi yok. */
  noneHigh: boolean;
  /** En yüksek ile en düşük alan arasındaki fark küçük: ilgiler henüz ayrışmamış. */
  flat: boolean;
  /** Bütün alanlar düşük düzeyde. */
  allLow: boolean;
}

export interface InterestProfile {
  /** En belirgin üç alanın harfleri, ör. "SAE". */
  code: string;
  types: { key: RiasecKey; name: string; mean: number | null; rank: number }[];
  top: {
    key: RiasecKey;
    name: string;
    plain: string;
    text: string;
    likes: string[];
    explore: string[];
    paths: { lise: string; universite: string };
  }[];
  lowest: { key: RiasecKey; name: string }[];
  /** En yüksek ile en düşük alan arasındaki fark (1–5 ölçeğinde). */
  differentiation: number;
  /** Profil henüz belirginleşmemiş (fark küçük). */
  flat: boolean;
  /** Hiçbir alanda belirgin ilgi yok. */
  allLow: boolean;
  /** 8. ve 9. sınıflarda sonuç keşif çerçevesinde sunulur. */
  exploration: boolean;
  /** Üçüncü ve dördüncü alan birbirine çok yakınsa uyarı. */
  closeCall: string | null;
  occupations: Occupation[];
}

const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

const SKILL_LABELS: Record<string, string> = {
  literal: 'Metindeki bilgiyi bulma',
  inference: 'Çıkarım yapma',
  vocabulary: 'Kelime anlamı',
  main_idea: 'Ana fikir',
};

function pickText(bt: BandText | undefined, audience: Audience) {
  if (!bt) return { text: '', tips: [] as string[], summary: '' };
  if (audience === 'parent') return { text: bt.parent, tips: bt.tipsParent, summary: bt.summary };
  // Yetişkine, öğrenci metni okula ya da ergenliğe özgüyse yazılmış yetişkin metni. Öneriler (kapsamlı rapor)
  // öğrencilere göre yazıldığı için yetişkine gösterilmez.
  if (audience === 'adult') return { text: bt.adult ?? bt.student, tips: [] as string[], summary: bt.summary };
  return { text: bt.student, tips: bt.tipsStudent, summary: bt.summary };
}

export function buildReport(input: {
  def: InstrumentDef;
  scores: ReportScore[];
  audience: Audience;
  studentName: string;
  grade: number;
  completedAt: Date;
  qualityNotes?: string[];
}): ReportContent {
  const { def, audience } = input;
  const template = REPORT_TEMPLATES[def.slug];
  const byKey = new Map(input.scores.map((s) => [s.scaleKey, s]));
  let support = false;

  const sections: ReportSection[] = [];
  let reading: ReportContent['reading'];
  let cognitive: CognitiveReport | undefined;
  let academic: AcademicReport | undefined;

  if (def.engine === 'likert') {
    const optVals = def.options.map((o) => o.value);
    const optMin = Math.min(...optVals);
    const optMax = Math.max(...optVals);
    for (const scale of def.scales) {
      const s = byKey.get(scale.key);
      const rawBand = (s?.band ?? null) as Band | null;
      const band = rawBand ? nearestBand(rawBand, (b) => !!template?.scales[scale.key]?.[b]) : null;
      const bt = band ? template?.scales[scale.key]?.[band] : undefined;
      if (bt?.support) support = true;
      const picked = pickText(bt, audience);
      const nItems = scaleItems(def, scale).length;
      const isMean = def.scoring.method === 'mean';
      const min = isMean ? optMin : optMin * nItems;
      const max = isMean ? optMax : optMax * nItems;
      const value = s ? (isMean ? s.mean : s.raw) : null;
      sections.push({
        scaleKey: scale.key,
        name: scale.name,
        plain: scale.plain,
        poles: scale.poles,
        band,
        bandLabel: band ? (template?.bandLabels[band] ?? DEFAULT_BAND_LABELS[band]) : 'Hesaplanamadı',
        summary: picked.summary,
        text: s && band ? picked.text : 'Bu bölümdeki maddelerin yeterince cevaplanmadığı için puan hesaplanamadı.',
        tips: s && band ? picked.tips : [],
        value,
        valueLabel: value === null ? '—' : `${isMean ? nf1.format(value) : nf0.format(value)} / ${isMean ? nf0.format(max) : nf0.format(max)}`,
        min,
        max,
        ciLow: s?.ciLow ?? null,
        ciHigh: s?.ciHigh ?? null,
        percentile: s?.percentile ?? null,
      });
    }
  } else if (def.engine === 'tasks') {
    cognitive = buildCognitive(def, byKey, audience);
  } else if (def.engine === 'quiz') {
    academic = buildAcademic(def, byKey, audience, template?.bandLabels ?? {});
  } else {
    const rDef = def as ReadingInstrument;
    const comp = byKey.get('comprehension');
    const rr = comp?.extra as unknown as (ReadingResult & { passageTitle?: string }) | undefined;
    const rawBand = (comp?.band ?? null) as Band | null;
    const band = rawBand ? nearestBand(rawBand, (b) => !!template?.scales.comprehension?.[b]) : null;
    const bt = band ? template?.scales.comprehension?.[band] : undefined;
    const picked = pickText(bt, audience);
    if (rr) {
      sections.push({
        scaleKey: 'comprehension',
        name: 'Anlama',
        plain: def.scales[0].plain,
        band,
        bandLabel: band ? (template?.bandLabels[band] ?? DEFAULT_BAND_LABELS[band]) : '—',
        summary: picked.summary,
        text: picked.text,
        tips: picked.tips,
        value: rr.correct,
        valueLabel: `${rr.correct} / ${rr.total}`,
        min: 0,
        max: rr.total,
        ciLow: null,
        ciHigh: null,
        percentile: null,
      });
      const passage = rDef.passages.find((p) => p.key === rr.passageKey);
      const ref = rDef.referenceRates.find((r) => r.grade === input.grade);
      const secs = Math.round(rr.readingMs / 1000);
      const speedNote = rr.flags?.tooFast
        ? audience !== 'parent'
          ? 'Metni çok hızlı geçmişsin; hızın gerçek okuma hızını yansıtmıyor olabilir. Bir dahaki sefere metni anlayarak okumaya odaklan.'
          : 'Metin çok hızlı geçilmiş görünüyor; bu nedenle ölçülen hız gerçek okuma hızını yansıtmıyor olabilir.'
        : audience !== 'parent'
          ? `Metni ${nf0.format(secs)} saniyede okudun. Hızını, anladığın kadarıyla birlikte düşünmek önemli: anlamadan hızlı okumak işe yaramaz.`
          : `Metin ${nf0.format(secs)} saniyede okundu. Hız, anlama düzeyiyle birlikte değerlendirilmelidir; anlamadan hızlı okumak bir avantaj değildir.`;
      reading = {
        passageTitle: passage?.title ?? '',
        wordCount: rr.wordCount,
        readingSeconds: secs,
        wpm: rr.wpm,
        correct: rr.correct,
        total: rr.total,
        comprehensionPct: rr.comprehensionPct,
        effectiveWpm: rr.effectiveWpm,
        skills: Object.entries(rr.skills).map(([k, v]) => ({ label: SKILL_LABELS[k] ?? k, correct: v.correct, total: v.total })),
        referenceNote: ref
          ? `Türkiye’de ${ref.grade}. sınıf öğrencilerinin sesli okumada dakikada ortalama ${ref.wpm} kelime okuduğu bildirilmiştir (${ref.source}). Sessiz okuma genellikle sesli okumadan hızlıdır; bu değer yalnızca kaba bir fikir verir.`
          : null,
        speedNote,
      };
    }
  }

  const interests =
    def.engine === 'likert' && def.profile === 'riasec' ? buildInterestProfile(sections, audience, input.grade) : undefined;
  const ranking = def.engine === 'likert' && def.profile === 'interests' ? rankInterests(sections) : undefined;
  const facetGroups =
    def.engine === 'likert' && def.profile === 'facets'
      ? def.scales.filter((s) => s.of?.length).map((s) => ({ domain: s.key, facets: s.of ?? [] }))
      : undefined;

  // Değerlendirici ölçekler: güçlü yanlar (yüksek) ve geliştirilebilecek alanlar (düşük) ayrı listelenir.
  let strengths: string[] | undefined;
  let growth: string[] | undefined;
  if (template?.evaluative) {
    strengths = sections.filter((s) => s.band === 'high' || s.band === 'very_high').map((s) => `${s.name}: ${s.summary.toLocaleLowerCase('tr-TR')}`);
    growth = sections.filter((s) => s.band === 'low' || s.band === 'very_low').map((s) => `${s.name}: ${s.summary.toLocaleLowerCase('tr-TR')}`);
  }

  // Öne çıkanlar: ortadan en uzak düzeydeki ölçekler (çok ölçekli testlerde).
  const highlights: string[] = [];
  if (ranking) {
    for (const key of ranking.top) {
      const s = sections.find((x) => x.scaleKey === key);
      if (s) highlights.push(`${s.name}: ${s.summary.toLocaleLowerCase('tr-TR')}`);
    }
  } else if (sections.length > 2 && !interests && !facetGroups && !template?.evaluative) {
    const rank: Record<string, number> = { very_high: 2, very_low: 2, high: 1, low: 1, average: 0 };
    const notable = sections
      .filter((s) => s.band && rank[s.band] > 0)
      .sort((a, b) => rank[b.band!] - rank[a.band!])
      .slice(0, 3);
    for (const s of notable) highlights.push(`${s.name}: ${s.summary.toLocaleLowerCase('tr-TR')}`);
  }

  const science = def.science;
  return {
    templateVersion: template?.version ?? 'yok',
    instrumentSlug: def.slug,
    instrumentName: def.name,
    audience,
    studentName: input.studentName,
    gradeLabel: GRADE_LABELS[input.grade] ?? `${input.grade}. sınıf`,
    completedAt: input.completedAt.toISOString(),
    isPilot: def.status === 'pilot',
    // Sitede norm tablosu yoktur: norm durumu her zaman testin bilim kartındaki açıklamadır.
    normNote: science.normNote,
    qualityNotes: input.qualityNotes ?? [],
    sections,
    highlights,
    strengths,
    growth,
    overview: template?.overview
      ? audience === 'parent'
        ? template.overview.parent
        : ((audience === 'adult' ? template.overview.adult : undefined) ?? template.overview.student)
      : undefined,
    support,
    science: {
      basedOn: science.basedOn,
      reliability: science.reliability,
      limitations: science.limitations,
      license: science.license,
    },
    reading,
    interests,
    ranking,
    facetGroups,
    cognitive,
    academic,
  };
}

/**
 * Sıralı ilgi profili. Bölümler yerinde sıralanır: puanı olanlar en yüksekten en düşüğe, hesaplanamayanlar sonda.
 * Aynı puandaki alanlar testteki sıralarını korur. Düzeyler şablondaki düzeylerdir (düşük, orta, yüksek).
 */
function rankInterests(sections: ReportSection[]): InterestRanking {
  sections.sort((a, b) => (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY));
  const scored = sections.filter((s) => s.value !== null);
  const high = scored.filter((s) => s.band === 'high' || s.band === 'very_high');
  const noneHigh = high.length === 0;
  const values = scored.map((s) => s.value as number);
  const spread = values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
  return {
    order: scored.map((s) => s.scaleKey),
    top: (noneHigh ? scored.slice(0, 2) : high.slice(0, 3)).map((s) => s.scaleKey),
    noneHigh,
    flat: values.length > 1 && spread < 0.8,
    allLow: scored.length > 0 && scored.every((s) => s.band === 'low' || s.band === 'very_low'),
  };
}

/* ---------- Akademik konu tarama testleri ---------- */

/** Genel sonuç metinleri. {g}: soruların ait olduğu sınıf, {s}: ders adı (küçük harfle). */
const ACADEMIC_TEXT: Record<'high' | 'average' | 'low', { student: string; parent: string }> = {
  high: {
    student:
      '{g}. sınıf {s} konularının çoğunu sağlam biliyorsun. Aşağıda yanlış yaptığın ya da bilmediğin az sayıdaki soruya ve varsa hata türlerine göz atman yeterli.',
    parent:
      'Çocuğunuz {g}. sınıfın temel {s} konularının büyük bölümüne hâkim görünüyor. Aşağıdaki yanlış yapılan sorular ve hata türleri, pekiştirilebilecek küçük noktaları gösteriyor.',
  },
  average: {
    student:
      '{g}. sınıf {s} konularının önemli bir kısmını biliyorsun; bazı konuların ise pekiştirilmesi gerekiyor. Aşağıda hangi alanlarda ve ne tür hatalar yaptığını görebilirsin. Önce bunlarla başlamak sana en çok yarayacak.',
    parent:
      'Çocuğunuz {g}. sınıf {s} konularının önemli bir kısmını biliyor; bazı konuların ise pekiştirilmesi gerekiyor. Yeni konular öncekilerin üzerine kurulduğu için bu eksiklerin bu yıl içinde tamamlanması yeni konuları öğrenmesini kolaylaştırır.',
  },
  low: {
    student:
      '{g}. sınıf {s} konularının birçoğunda zorlandın. Bu, bu konuları öğrenemeyeceğin anlamına gelmez: eksikler belirli konularda toplanıyor ve adım adım tamamlanabilir. Aşağıdaki alanlardan başlayabilir, öğretmeninden de destek isteyebilirsin.',
    parent:
      'Çocuğunuz {g}. sınıf {s} konularının birçoğunda zorlandı. Yeni konular öncekilerin üzerine kurulduğu için bu eksikler bu yılın konularını da zorlaştırabilir. Sonucu dersin öğretmeniyle paylaşmanızı ve aşağıdaki alanlardan başlayarak planlı bir tekrar yapılmasını öneririz. Tek bir testin sonucu kesin bir yargı değildir.',
  },
};

/** Derse özgü çalışma önerileri (şimdilik matematik). */
const ACADEMIC_TIPS: Record<string, Record<Voice, string[]>> = {
  Matematik: {
    student: [
      'Yanlış yaptığın her soruyu açıklamasını okuduktan sonra birkaç gün içinde kâğıda bakmadan yeniden çöz.',
      'Kısa ama sık çalış: her gün 15–20 dakika, haftada bir uzun oturumdan daha etkilidir.',
      'Çalışırken farklı konulardan soruları karıştır; yalnızca aynı tür soruları art arda çözmek, sınavda hangi yöntemi kullanacağını seçmeyi öğretmez.',
      'Takıldığın yerleri not al ve öğretmenine sor. Soru sormak, öğrenmenin en hızlı yollarından biridir.',
    ],
    parent: [
      'Sonucu çocuğunuzun matematik öğretmeniyle paylaşın; öğretmen, eksik konular için sınıf içinde destek planlayabilir.',
      'Kısa ve düzenli tekrar (günde 15–20 dakika), uzun ve seyrek çalışmadan daha etkilidir. Farklı konulardan soruların karıştırıldığı tekrarlar, aynı tür soruların art arda çözüldüğü tekrarlardan daha kalıcı öğrenme sağlar (Rohrer ve ark., 2015).',
      'Yargılayıcı olmayan bir dil kullanın: “Neden yapamadın?” yerine “Bu soruyu birlikte nasıl düşünebiliriz?” diye sorun.',
      'Gündelik hayattaki matematik fırsatlarını kullanın: alışverişte indirimi hesaplamak, bir tarifin ölçülerini ikiye katlamak ya da yolculuk süresini tahmin etmek gibi.',
    ],
  },
};

const GENERIC_ACADEMIC_TIPS: Record<Voice, string[]> = {
  student: [
    'Yanlış yaptığın her soruyu açıklamasını okuduktan sonra birkaç gün içinde yeniden çöz.',
    'Kısa ama sık çalış: her gün 15–20 dakika, haftada bir uzun oturumdan daha etkilidir.',
    'Takıldığın yerleri not al ve öğretmenine sor.',
  ],
  parent: [
    'Sonucu dersin öğretmeniyle paylaşın; öğretmen, eksik konular için sınıf içinde destek planlayabilir.',
    'Kısa ve düzenli tekrar (günde 15–20 dakika), uzun ve seyrek çalışmadan daha etkilidir.',
    'Yargılayıcı olmayan bir dil kullanın: “Neden yapamadın?” yerine “Bunu birlikte nasıl düşünebiliriz?” diye sorun.',
  ],
};

function buildAcademic(
  def: QuizInstrument,
  byKey: Map<string, ReportScore>,
  audience: Audience,
  bandLabels: Partial<Record<Band, string>>,
): AcademicReport | undefined {
  const result = byKey.get('total')?.extra as unknown as QuizResult | undefined;
  if (!result) return undefined;
  const form = def.forms.find((f) => f.key === result.formKey);
  if (!form) return undefined;
  const label = (b: Band) => bandLabels[b] ?? b;
  const band = result.band === 'high' || result.band === 'average' ? result.band : 'low';
  const byItem = new Map(result.items.map((r) => [r.key, r]));

  const misconceptions = result.misconceptions
    .filter((m) => def.misconceptions[m.key])
    .map((m) => ({ key: m.key, ...def.misconceptions[m.key], count: m.count, itemNumbers: m.itemNumbers }));
  const repeated = misconceptions.some((m) => m.count > 1);
  const you = audience !== 'parent';
  const misconceptionNote =
    misconceptions.length === 0
      ? you
        ? 'Yanlış cevapların belirli bir hata türünde toplanmıyor.'
        : 'Yanlış cevaplar belirli bir hata türünde toplanmıyor.'
      : repeated
        ? you
          ? 'Birden fazla soruda görülen hata türleri, üzerinde durman gereken konuları en iyi gösteren işaretlerdir.'
          : 'Birden fazla soruda görülen hata türleri güçlü bir işarettir. Tek soruda görülenler dikkatsizlikten de kaynaklanmış olabilir.'
        : you
          ? 'Her hata türü yalnızca bir soruda görüldü; bunlar dikkatsizlikten de kaynaklanmış olabilir. Yine de açıklamalara göz atman yararlı olur.'
          : 'Her hata türü yalnızca bir soruda görüldü; bunlar dikkatsizlikten de kaynaklanmış olabilir. Kesin bir yargı için öğretmenin gözlemleriyle birlikte değerlendirilmelidir.';

  return {
    subject: def.subject,
    contentGrade: form.contentGrade,
    n: result.n,
    correct: result.correct,
    wrong: result.wrong,
    dontKnow: result.dontKnow,
    band,
    bandLabel: label(band),
    text: ACADEMIC_TEXT[band][voice(audience)]
      .replaceAll('{g}', String(form.contentGrade))
      .replaceAll('{s}', def.subject.toLocaleLowerCase('tr-TR')),
    domains: form.domains.map((d) => {
      const r = result.domains.find((x) => x.key === d.key);
      const b = r?.band ?? 'low';
      return { key: d.key, name: d.name, plain: d.plain, correct: r?.correct ?? 0, n: r?.n ?? 0, dontKnow: r?.dontKnow ?? 0, band: b, bandLabel: label(b) };
    }),
    misconceptions,
    misconceptionNote,
    review: form.items.map((it, i) => {
      const r = byItem.get(it.key);
      return {
        no: i + 1,
        key: it.key,
        domain: it.domain,
        domainName: form.domains.find((d) => d.key === it.domain)?.name ?? it.domain,
        text: it.text,
        table: it.table,
        chart: it.chart,
        figure: it.figure,
        options: it.options.map((o) => ({ key: o.key, text: o.text })),
        choice: r?.choice ?? null,
        answer: it.answer,
        correct: r?.correct ?? false,
        explain: it.explain,
      };
    }),
    tips: (ACADEMIC_TIPS[def.subject] ?? GENERIC_ACADEMIC_TIPS)[voice(audience)],
  };
}

const pct = (x: number) => `%${nf0.format(Math.round(x * 100))}`;

function spanText(r: SpanResult, audience: Audience, what: { student: string; parent: string; unit: string; everyday: string }): string {
  const you = audience !== 'parent';
  if (r.belowFloor) {
    return you
      ? `En kısa ${what.unit} dizilerinde bile zorlandın. Bu, o an dikkatinin dağılmasından ya da görevi ilk kez yapıyor olmaktan kaynaklanabilir. ${what.everyday}`
      : `En kısa ${what.unit} dizilerinde bile zorlandı. Bu sonuç o anki dikkat, yorgunluk ya da görevi ilk kez yapıyor olmaktan etkilenmiş olabilir; tek başına yorumlanmamalıdır. ${what.everyday}`;
  }
  const base = you ? what.student.replace('{n}', String(r.span)) : what.parent.replace('{n}', String(r.span));
  const ceiling = r.ceiling
    ? you
      ? ' Görevdeki en uzun diziyi de doğru yaptın; yani sınırına henüz ulaşmamış olabilirsin.'
      : ' Görevdeki en uzun diziyi de doğru yaptı; görev onun üst sınırını ölçmeye yetmemiş olabilir.'
    : '';
  return `${base}${ceiling} ${what.everyday}`;
}

/** Bölümler arasındaki değişim bu yüzdeyi aşınca "arttı" ya da "düştü" denir; daha küçük farklar ölçüm hatası içindedir. */
const SUSTAIN_THRESHOLD = 15;

const SUSTAINED_TIPS: Record<Voice, string[]> = {
  student: [
    'Uzun bir işi kısa parçalara böl (ör. 15–20 dakika); aralarda birkaç dakika kalkıp hareket et.',
    'Ders çalışırken telefonunu başka bir odaya koy; bildirimler dikkatini böler.',
    'Sınavda bir soruyu bitirince cevabını kısaca kontrol et; gözden kaçan ayrıntılar çoğu zaman acele etmekten olur.',
    'Okurken satırı kaybediyorsan parmağınla ya da bir cetvelle takip et.',
    'İyi uyumak, dikkat için en basit ve en etkili desteklerden biridir.',
  ],
  parent: [
    'Ödevleri kısa ve net parçalara bölün; parçalar arasında kısa hareket molaları verin.',
    'Çalışma ortamından dikkat dağıtıcıları, özellikle telefonu ve açık ekranları uzaklaştırın.',
    'Düzenli uyku, dikkat performansını doğrudan etkiler.',
    '“Dikkati geliştirdiğini” söyleyen bilgisayar oyunlarının okul başarısına etkisine dair kanıtlar zayıftır; gündelik düzenlemeler daha güvenilir bir destektir.',
    'Dikkatle ilgili süreğen bir endişeniz varsa bu sonuca değil, okulun rehberlik servisine ya da bir uzmana başvurun.',
  ],
};

/** Harf işaretleme görevinin dört sonuç kartı: hız, bulma, net doğru ve dikkati sürdürme. */
function cancellationBlocks(
  r: CancellationResult,
  task: CancellationTask,
  audience: Audience,
  scale: (k: string) => { name: string; plain: string },
): CognitiveBlock[] {
  const you = audience !== 'parent';
  const n = nf0.format;
  const card = (key: string) => ({ key, name: scale(key).name, plain: scale(key).plain });

  const ceiling = r.ceiling
    ? you
      ? ' En az bir bölümde sayfanın sonuna ulaştın; gerçek hızın bundan da yüksek olabilir.'
      : ' En az bir bölümde sayfanın sonuna ulaşıldı; gerçek çalışma hızı bundan yüksek olabilir.'
    : '';
  const tempo: CognitiveBlock = {
    ...card('tempo'),
    headline: `Dakikada ${n(r.perMinute)} harf`,
    detail: `${task.sections} bölümde toplam ${n(r.processed)} harf tarandı.`,
    text:
      (you
        ? `Harf sayfalarında dakikada ortalama ${n(r.perMinute)} harfe baktın. Bu, işi ne kadar hızlı yürüttüğünü gösterir. Hız tek başına iyi ya da kötü değildir; önemli olan, hızlı giderken aranan harfleri kaçırmamaktır.`
        : `Çocuğunuz harf sayfalarında dakikada ortalama ${n(r.perMinute)} harf taradı. Bu, basit ama dikkat gerektiren bir işi ne kadar hızlı yürütebildiğini gösterir. Hız, doğrulukla birlikte değerlendirilmelidir: çok harf atlayarak hızlı çalışmak da, hiç hata yapmadan ama çok yavaş çalışmak da üzerinde durulması gereken bir örüntüdür.`) +
      ceiling,
  };

  const found =
    r.hitRate >= 0.9
      ? you
        ? `Taradığın satırlardaki aranan harflerin ${r.omissions === 0 ? 'hepsini' : 'neredeyse hepsini'} buldun; dikkatli çalıştığını gösteriyor.`
        : `Taranan satırlardaki aranan harflerin ${r.omissions === 0 ? 'hepsi' : 'neredeyse hepsi'} bulundu; görev dikkatle yürütülmüş.`
      : r.hitRate >= 0.75
        ? you
          ? 'Taradığın satırlardaki aranan harflerin çoğunu buldun ama bir kısmını atladın. Hızlı giderken bazı harflerin gözden kaçması çok yaygındır; satır satır, harf harf ilerlemek atlamaları azaltır.'
          : 'Taranan satırlardaki aranan harflerin çoğu bulundu, bir kısmı atlandı. Hızlı çalışırken bazı harflerin gözden kaçması yaygındır.'
        : you
          ? 'Taradığın satırlardaki aranan harflerin önemli bir kısmını atladın. Bu; hızlı gitmekten, satır atlamaktan ya da o an dikkatinin dağılmasından kaynaklanabilir. Acele etmeden, harf harf ilerlemek işine yarar.'
          : 'Taranan satırlardaki aranan harflerin önemli bir kısmı atlandı. Bu; çok hızlı çalışmaktan, satır atlamaktan ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır.';
  const falseMarks =
    r.falseAlarmRate >= 0.02
      ? you
        ? ' Bazı harfleri de yanlışlıkla işaretledin; p ile b ya da d, o ile a gibi birbirine benzeyen harfler kolayca karışabilir.'
        : ' Aranan harflere benzeyen bazı harfler de işaretlenmiş (ör. p ile b ya da d); bu, acele etmekten ya da benzer harfleri ayırt etmekte zorlanmaktan kaynaklanabilir.'
      : r.commissions === 0
        ? you
          ? ' Hiç yanlış işaret yapmadın.'
          : ' Hiç yanlış işaret yok.'
        : '';
  const isabet: CognitiveBlock = {
    ...card('isabet'),
    headline: `Bulma oranı ${pct(r.hitRate)}`,
    detail: `${n(r.hits)} harf bulundu · ${n(r.omissions)} harf atlandı · ${n(r.commissions)} yanlış işaret`,
    text: found + falseMarks,
  };

  const net: CognitiveBlock = {
    ...card('net'),
    headline: `${n(r.net)} net doğru`,
    detail: `${n(r.hits)} doğru işaret − ${n(r.commissions)} yanlış işaret`,
    text: you
      ? 'Net doğru, doğru işaretlerinden yanlış işaretlerin çıkarılmasıyla bulunur. Hızını ve dikkatini birlikte gösterir: harfleri kaçırmadan ve yanlış işaretlemeden ne kadar iş çıkardığını anlatır.'
      : 'Net doğru (doğru işaretler eksi yanlış işaretler), hızı ve dikkati birlikte yansıtan özet puandır; rastgele işaretleme bu puanı yükseltmez. Henüz norm olmadığı için akranlarla karşılaştırılamaz. İleride aynı tür cihazla yapılacak uygulamalarda değişimi izlemek için kullanılabilir; tekrarda alıştırma etkisiyle bir miktar artış beklenir.',
  };

  const change = r.sustainChange;
  const x = change === null ? '' : `%${n(Math.abs(change))}`;
  const [headline, sustainText] =
    change === null
      ? [
          'Değişim hesaplanamadı',
          you
            ? 'İlk bölümlerde yeterli işaret olmadığı için bölümler arasındaki değişim hesaplanamadı.'
            : 'İlk bölümlerde yeterli doğru işaret olmadığı için bölümler arasındaki değişim hesaplanamadı.',
        ]
      : change <= -SUSTAIN_THRESHOLD
        ? [
            'Son bölümlerde düştü',
            you
              ? `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} azaldı. Uzun bir işte yorulmak ya da sıkılmak herkeste olur; uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`
              : `Son bölümlerde net doğru sayısı ilk bölümlere göre yaklaşık ${x} azaldı. Bu, dikkati uzun süre aynı düzeyde tutmakta zorlanıldığını düşündürebilir; yorgunluk ya da isteksizlik de aynı etkiyi yapar. Uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`,
          ]
        : change >= SUSTAIN_THRESHOLD
          ? [
              'Görev ilerledikçe arttı',
              you
                ? `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} arttı: görevi yaptıkça ısındın ve hızlandın.`
                : `Son bölümlerde net doğru sayısı ilk bölümlere göre yaklaşık ${x} arttı: görev ilerledikçe ısınma ve alışma görülüyor.`,
            ]
          : [
              'Görev boyunca korundu',
              you
                ? `${task.sections} bölüm boyunca benzer bir performans gösterdin; dikkatini görev boyunca koruyabildin.`
                : `Performans ${task.sections} bölüm boyunca benzer kaldı; dikkat görev süresince korunabildi.`,
            ];
  const surdurme: CognitiveBlock = {
    ...card('surdurme'),
    headline,
    text: you ? sustainText : `${sustainText} Bölümler arasındaki küçük farklar ölçüm hatası sınırları içindedir; yalnızca belirgin değişimler yorumlanmalıdır.`,
    sections: r.sections.map((s) => ({ label: `${s.index + 1}. bölüm`, value: s.net })),
  };

  return [tempo, isabet, net, surdurme];
}

function buildCognitive(def: TaskInstrument, byKey: Map<string, ReportScore>, audience: Audience): CognitiveReport {
  const you = audience !== 'parent';
  const blocks: CognitiveBlock[] = [];
  const scale = (k: string) => def.scales.find((s) => s.key === k)!;

  const fwd = byKey.get('digit_forward')?.extra as unknown as SpanResult | undefined;
  if (fwd) {
    blocks.push({
      key: 'digit_forward',
      name: scale('digit_forward').name,
      plain: scale('digit_forward').plain,
      headline: fwd.span ? `${fwd.span} rakamlık diziye kadar` : 'En kısa dizilerde zorlandı',
      text: spanText(fwd, audience, {
        unit: 'rakam',
        student: 'Rakam dizilerini aynı sırayla en fazla {n} rakama kadar doğru tekrar edebildin.',
        parent: 'Çocuğunuz rakam dizilerini aynı sırayla en fazla {n} rakamlık uzunluğa kadar doğru tekrar etti.',
        everyday: you
          ? 'Bu beceri, bir telefon numarasını yazana kadar ya da öğretmenin söylediği sayfa numarasını açana kadar aklında tutmak gibi işlerde kullanılır.'
          : 'Bu beceri, kısa bir bilgiyi kullanana kadar akılda tutmak için gerekir: öğretmenin söylediği sayfa numarası ya da kısa bir yönerge gibi.',
      }),
      ladder: fwd.ladder,
    });
  }
  const bwd = byKey.get('digit_backward')?.extra as unknown as SpanResult | undefined;
  if (bwd) {
    blocks.push({
      key: 'digit_backward',
      name: scale('digit_backward').name,
      plain: scale('digit_backward').plain,
      headline: bwd.span ? `${bwd.span} rakamlık diziye kadar` : 'En kısa dizilerde zorlandı',
      text: spanText(bwd, audience, {
        unit: 'rakam',
        student: 'Rakam dizilerini tersten en fazla {n} rakama kadar doğru tekrar edebildin.',
        parent: 'Çocuğunuz rakam dizilerini tersten en fazla {n} rakamlık uzunluğa kadar doğru tekrar etti.',
        everyday: you
          ? 'Bilgiyi hem akılda tutup hem de üzerinde değişiklik yapmak, zihinden işlem yaparken ve çok adımlı yönergeleri takip ederken işine yarar. Tersten tekrar, ileri tekrardan her zaman daha zordur.'
          : 'Bilgiyi akılda tutarken üzerinde işlem yapabilmek; zihinden işlem, çok adımlı yönergeleri takip etme ve okuduğunu anlama gibi işlerde kullanılır. Tersten tekrar herkes için ileri tekrardan daha zordur.',
      }),
      ladder: bwd.ladder,
    });
  }
  const sp = byKey.get('spatial')?.extra as unknown as SpanResult | undefined;
  if (sp) {
    blocks.push({
      key: 'spatial',
      name: scale('spatial').name,
      plain: scale('spatial').plain,
      headline: sp.span ? `${sp.span} kutuluk diziye kadar` : 'En kısa dizilerde zorlandı',
      text: spanText(sp, audience, {
        unit: 'kutu',
        student: 'Yanan kutuların sırasını en fazla {n} kutuya kadar doğru hatırladın.',
        parent: 'Çocuğunuz yanan kutuların sırasını en fazla {n} kutuluk uzunluğa kadar doğru hatırladı.',
        everyday: you
          ? 'Bu beceri; bir yolu, bir haritayı ya da bir geometri çizimindeki yerleri akılda tutarken kullanılır.'
          : 'Bu beceri; bir yolu hatırlamak, harita ve şekillerle çalışmak ya da tahtadaki bir çizimi deftere geçirmek gibi işlerde kullanılır.',
      }),
      ladder: sp.ladder,
    });
  }
  const at = byKey.get('attention')?.extra as unknown as FlankerResult | undefined;
  if (at) {
    const rt = at.meanRt === null ? '' : `, doğru cevaplarda ortalama ${nf0.format(at.meanRt)} milisaniye`;
    blocks.push({
      key: 'attention',
      name: scale('attention').name,
      plain: scale('attention').plain,
      headline: `${pct(at.accuracy)} doğru${rt}`,
      text: you
        ? `Yanlardaki oklar ortadakiyle aynı yöne baktığında ${pct(at.accCongruent)}, farklı yöne baktığında ${pct(at.accIncongruent)} doğru yaptın. Kenardaki oklar ters yöne baktığında herkes biraz yavaşlar ve daha çok hata yapar; önemli olan dikkatini ortadaki oka toplayabilmek. Bu beceri, gürültülü bir sınıfta öğretmeni dinlemek ya da bir soruda gereksiz bilgileri ayıklamak gibi durumlarda işe yarar.`
        : `Yanlardaki oklar ortadakiyle aynı yöne baktığında doğruluk ${pct(at.accCongruent)}, farklı yöne baktığında ${pct(at.accIncongruent)} oldu. Dikkat dağıtıcı oklar ters yöne baktığında herkes biraz yavaşlar ve daha çok hata yapar. Bu görev, dikkat dağıtan şeylere rağmen önemli olana odaklanabilmeyi ölçer; örneğin gürültülü bir ortamda öğretmeni dinlemek ya da bir sorudaki gereksiz bilgiyi ayıklamak gibi.`,
      flanker: { accCongruent: at.accCongruent, accIncongruent: at.accIncongruent, rtCongruent: at.meanRtCongruent, rtIncongruent: at.meanRtIncongruent },
    });
  }
  const spd = byKey.get('speed')?.extra as unknown as SymbolResult | undefined;
  if (spd) {
    const secs = Math.round(
      ((def.tasks.find((t) => t.kind === 'symbol_match') as { durationMs?: number } | undefined)?.durationMs ?? 90_000) / 1000,
    );
    blocks.push({
      key: 'speed',
      name: scale('speed').name,
      plain: scale('speed').plain,
      headline: `${secs} saniyede ${spd.correct} doğru eşleştirme`,
      text: you
        ? `${spd.attempted} sembolden ${spd.correct} tanesini doğru eşleştirdin (${spd.errors} hata). Bu görev, basit bir işi hızlı ve doğru yapabilmeyi ölçer; örneğin tahtadan bir şeyi deftere geçirmek ya da sınavda basit işlemleri yapmak gibi.`
        : `${spd.attempted} sembolden ${spd.correct} tanesini doğru eşleştirdi (${spd.errors} hata). Bu görev işlem hızını, yani basit bir işi hem hızlı hem doğru yapabilmeyi ölçer; tahtadan yazmak ya da sınavda basit işlemleri yapmak gibi işlerde kullanılır. İşlem hızı çocukluk ve ergenlik boyunca belirgin biçimde artar.`,
      symbol: { correct: spd.correct, errors: spd.errors, perMinute: spd.perMinute },
    });
  }

  const cz = byKey.get('tempo')?.extra as unknown as CancellationResult | undefined;
  const ct = def.tasks.find((t): t is CancellationTask => t.kind === 'cancellation');
  if (cz && ct) blocks.push(...cancellationBlocks(cz, ct, audience, scale));

  if (def.tasks.every((t) => t.kind === 'cancellation')) return { blocks, tips: SUSTAINED_TIPS[voice(audience)] };

  const tips = you
    ? [
        'Uzun ya da çok adımlı yönergeleri duyar duymaz kısaca not al.',
        'Zihinden işlem yaparken ara sonuçları kâğıda yaz; zihnini asıl işe ayır.',
        'Ders çalışırken telefonunu başka bir odaya koy; dikkat dağıtıcılar çalışma belleğini doldurur.',
        'İyi uyumak, dikkat ve bellek için en basit ve en etkili desteklerden biridir.',
      ]
    : [
        'Çok adımlı yönergeleri parçalara bölün ya da yazılı bir liste olarak verin.',
        'Ödev ve ders çalışma sırasında dikkat dağıtıcıları, özellikle telefonu, ortamdan uzaklaştırın.',
        'Düzenli uyku, dikkat ve bellek performansını doğrudan etkiler.',
        'Çalışma belleğini “geliştirdiğini” söyleyen bilgisayar oyunlarının etkisinin okul başarısına aktarıldığına dair güçlü bir kanıt yoktur (Melby-Lervåg ve Hulme, 2013). Gündelik hayattaki destekler daha yararlıdır.',
        'Dikkat, öğrenme ya da davranışla ilgili süreğen bir endişeniz varsa bu sonuca değil, okulun rehberlik servisine ya da bir uzmana başvurun.',
      ];
  return { blocks, tips };
}

function buildInterestProfile(sections: ReportSection[], audience: Audience, grade: number): InterestProfile {
  const byScale = new Map(sections.map((s) => [s.scaleKey, s.value]));
  const rows = RIASEC_ORDER.map((key, order) => ({
    key,
    order,
    name: RIASEC_TYPES[key].name,
    mean: byScale.get(RIASEC_TYPES[key].scaleKey) ?? null,
  }));
  // Eşit puanlarda altıgendeki sıra korunur; sıralama kararlıdır.
  const ranked = [...rows].filter((r) => r.mean !== null).sort((a, b) => b.mean! - a.mean! || a.order - b.order);
  const rankOf = new Map(ranked.map((r, i) => [r.key, i + 1]));
  const topKeys = ranked.slice(0, 3).map((r) => r.key);
  const means = ranked.map((r) => r.mean!);
  const max = means.length ? Math.max(...means) : 0;
  const min = means.length ? Math.min(...means) : 0;
  const differentiation = Math.round((max - min) * 100) / 100;

  let closeCall: string | null = null;
  if (ranked.length >= 4 && Math.abs(ranked[2].mean! - ranked[3].mean!) < 0.15) {
    closeCall =
      audience !== 'parent'
        ? `${ranked[2].name} ve ${ranked[3].name} alanlarındaki puanların neredeyse aynı; üçüncü alanını bu ikisinden biri olarak düşünebilirsin.`
        : `${ranked[2].name} ve ${ranked[3].name} alanlarındaki puanlar neredeyse aynıdır; üçüncü alan bu ikisinden biri olarak düşünülebilir.`;
  }

  return {
    code: topKeys.join(''),
    types: rows.map((r) => ({ key: r.key, name: r.name, mean: r.mean, rank: rankOf.get(r.key) ?? 0 })),
    top: topKeys.map((k) => {
      const t = RIASEC_TYPES[k];
      return {
        key: k,
        name: t.name,
        plain: t.plain,
        text: audience === 'parent' ? t.parent : t.student,
        likes: t.likes,
        explore: t.explore,
        paths: t.paths,
      };
    }),
    lowest: ranked.slice(-2).reverse().map((r) => ({ key: r.key, name: r.name })),
    differentiation,
    flat: differentiation < 0.8,
    allLow: max < 2.6,
    exploration: grade <= 9,
    closeCall,
    occupations: occupationsFor(topKeys, 8),
  };
}
