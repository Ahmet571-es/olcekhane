import { RIASEC_ORDER, RIASEC_TYPES, occupationsFor, type Occupation, type RiasecKey } from '@/content/careers/riasec';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { BandText } from '@/content/reports/types';
import { GRADE_LABELS } from '@/lib/config';
import { DEFAULT_BAND_LABELS, nearestBand } from './bands';
import type {
  Band,
  CancellationTask,
  GoNoGoTask,
  InstrumentDef,
  MatrixReasoningTask,
  MatrixRule,
  MentalRotationTask,
  NumberSeriesRule,
  NumberSeriesTask,
  QuizChart,
  QuizFigure,
  QuizInstrument,
  QuizOptionKey,
  QuizTable,
  ReadingInstrument,
  TaskInstrument,
  TrailTask,
  VerbalItemType,
  VerbalReasoningTask,
} from '@/lib/instruments/types';
import { VERBAL_TYPE_NAMES } from '@/lib/instruments/verbal';
import { scaleItems } from '@/lib/scoring/likert';
import type { QuizChoice, QuizResult } from '@/lib/scoring/quiz';
import {
  MATRIX_CHANCE_MAX,
  MATRIX_LEVEL_PASS,
  MATRIX_NEAR_MIN,
  MATRIX_NEAR_SHARE,
  NBACK_RANDOM_FA,
  NUMBER_PATTERN_MIN,
  REACTION_MIN_VALID,
  REACTION_MOUSE_SHARE,
  VERBAL_CHANCE_MAX,
  VERBAL_TYPES_ORDER,
  matrixRapid,
  matrixSamePosition,
  nBackKeptOneBack,
  nBackSilent,
  numberSeriesMostlySkipped,
  numberSeriesRapid,
  numberSeriesSameAnswer,
  verbalLurePattern,
  verbalRapid,
  verbalSamePosition,
  type CancellationResult,
  type ColorWordResult,
  type FlankerResult,
  type GoNoGoResult,
  type MatrixResult,
  type NBackLevelResult,
  type NBackResult,
  type NumberSeriesResult,
  type ReactionPartResult,
  type ReactionResult,
  type RotationResult,
  type SpanResult,
  type SymbolResult,
  type TrailResult,
  type VerbalResult,
} from '@/lib/scoring/tasks';
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
  /** Ayrıntılı profil: her boyutun alt özellikleri; `facetItems`, bir alt özelliğin kaç maddeyle ölçüldüğüdür. */
  facetGroups?: { domain: string; facets: string[]; facetItems: number }[];
  /** Kişilerarası çember (profil: circumplex): her ölçeğin çemberdeki açısı ve grafikteki kısa adı. */
  circumplex?: { key: string; angle: number; short: string }[];
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
    /** Şansla düzeltilmiş anlayarak okuma hızı; yorumlanamıyorsa (anlama 6/8'in altı, süre güvenilmez) null. */
    effectiveWpm: number | null;
    skills: { key: string; label: string; correct: number; total: number }[];
    referenceNote: string | null;
    speedNote: string;
    /** Metin çok hızlı geçildi: ölçülen hız gerçek okuma hızını yansıtmıyor olabilir. */
    tooFast: boolean;
    /** Okuma süresi çok uzun ölçüldü (ara verilmiş olabilir): hız yorumlanmaz. */
    tooSlow?: boolean;
    /** Okuma hızı metnin sınıf düzeyine göre (lib/scoring/reading.ts, READING_PACE). */
    pace?: 'fast' | 'slow' | 'ok';
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
  /**
   * Yanlış cevapların işaret ettiği hata türleri; en sık görülenden başlayarak. Cevaplar çok hızlı verildiyse ya da
   * aynı seçenekte toplandıysa boştur (tahminle seçilen seçenek bir hata türünü göstermez; `misconceptionNote` söyler).
   */
  misconceptions: { key: string; name: string; explain: string; tip: string; count: number; itemNumbers: number[] }[];
  /** Hata türleri yalnızca birer soruda görüldüyse ya da yorumlanmadıysa temkinli yorum notu gösterilir. */
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
    /** Seçilen yanlış seçeneğin işaret ettiği hata türünün adı (hata türleri yorumlanıyorsa). */
    misconception: string | null;
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
  /** Görevin sonucunu özetleyen çubuk grafik (renk-kelime, dur-git, sırayla birleştirme, geriye dönük hatırlama, zihinde döndürme). */
  chart?: { title: string; note: string; rows: { label: string; value: number; max: number; valueLabel: string }[] };
  /** Raporun başındaki öne çıkan sayılar (şekil akıl yürütme). */
  figures?: { label: string; value: string; note?: string }[];
  /**
   * Yol haritasındaki üç boyutlu grafiğin sütunları: aynı birimdeki (yüzde) sonuçlar, ör. şekil akıl yürütmede kural
   * türlerine göre doğru cevap oranı. Başlık ve açıklama grafikle birlikte verilir.
   */
  profile?: { title: string; note: string; bars: { key: string; label: string; value: number | null; min: number; max: number; color: string; valueLabel: string; band: string }[] };
}

/**
 * Sıralı ilgi profili: alanlar puana göre en yüksekten en düşüğe dizilir (bölümler de bu sıraya konur) ve en
 * belirgin alanlar ayrıca açıklanır. Türkiye normu olmadığı için sıralama kişinin kendi profili içindedir.
 */
export interface InterestRanking {
  /**
   * Neyin sıralandığı: "interests" işlerden ve etkinliklerden ne kadar hoşlanıldığı (meslek ilgileri), "activities"
   * serbest zaman etkinliklerinin son bir yılda ne sıklıkla yapıldığı. Rapordaki başlıklar ve notlar buna göre yazılır.
   */
  kind: 'interests' | 'activities';
  /** Puanı hesaplanan alanların anahtarları, en yüksekten en düşüğe. */
  order: string[];
  /**
   * Belirgin (yüksek düzeydeki) en çok üç alan; hiçbiri yoksa en yüksek iki alan (etkinliklerde yalnızca orta düzeydekiler:
   * az yapılan bir alan "en sık uğraşılan" diye gösterilmez). Bütün alanların puanı aynıysa boştur: öne çıkan alan yoktur
   * (ör. her etkinliğe aynı cevap verildiğinde).
   */
  top: string[];
  /** Hiçbir alanda belirgin ilgi yok. */
  noneHigh: boolean;
  /** En yüksek ile en düşük alan arasındaki fark küçük: ilgiler henüz ayrışmamış. */
  flat: boolean;
  /** Bütün alanlar düşük düzeyde. */
  allLow: boolean;
}

export interface InterestProfile {
  /**
   * Öne çıkan alanların harfleri, ör. "SAE" (en çok üç; orta düzeyin altındaki alan girmez). Hiçbir alan yüksek
   * değilse, bütün alanlar düşükse ya da bütün puanlar aynıysa boştur: kod ve örnek meslek verilmez.
   */
  code: string;
  types: { key: RiasecKey; name: string; mean: number | null; rank: number }[];
  /** Öne çıkan alanlar: kod varsa kodun alanları, yoksa (hiçbir alan yüksek değilken) en yüksek iki orta düzey alan. */
  top: {
    key: RiasecKey;
    name: string;
    plain: string;
    /** Yüksek düzeydeki alanda kişiye yazılmış açıklama, öteki alanlarda tek cümlelik tanım. */
    text: string;
    bandLabel: string;
    high: boolean;
    likes: string[];
    explore: string[];
    paths: { lise: string; universite: string };
  }[];
  lowest: { key: RiasecKey; name: string }[];
  /** En yüksek ile en düşük alan arasındaki fark (1–5 ölçeğinde). */
  differentiation: number;
  /** Profil henüz belirginleşmemiş (fark küçük). */
  flat: boolean;
  /** Hiçbir alan yüksek düzeyde değil. */
  noneHigh: boolean;
  /** Bütün alanlar düşük düzeyde: hiçbir alanda belirgin ilgi yok. */
  allLow: boolean;
  /** 8. ve 9. sınıflarda sonuç keşif çerçevesinde sunulur. */
  exploration: boolean;
  /** Öne çıkan alanların sırasını ya da seçimini etkileyen eşitlikler (puanları neredeyse aynı alanlar). */
  closeCalls: string[];
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
        : rr.flags?.tooSlow
          ? audience !== 'parent'
            ? 'Okuma süren çok uzun ölçüldü; okurken ara vermiş olabilirsin. Bu yüzden hızın yorumlanmadı.'
            : 'Okuma süresi çok uzun ölçüldü; okurken ara verilmiş olabilir. Bu yüzden hız yorumlanmadı.'
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
        skills: Object.entries(rr.skills).map(([k, v]) => ({ key: k, label: SKILL_LABELS[k] ?? k, correct: v.correct, total: v.total })),
        // Yayımlanmış Türkiye verisi sesli okumada dakikada doğru okunan kelimedir; bu test sessiz okumayı ölçtüğü için
        // doğrudan karşılaştırılamaz, yalnızca bağlam olarak verilir.
        referenceNote:
          ref && !rr.flags?.tooFast && !rr.flags?.tooSlow
            ? `Bağlam için: Türkiye’de yapılan bir çalışmada ${ref.grade}. sınıf öğrencilerinin sesli okumada dakikada ortalama ${ref.wpm} kelimeyi doğru okuduğu bildirilmiştir${ref.sd ? `; öğrencilerin çoğu yaklaşık ${Math.max(0, ref.wpm - ref.sd)} ile ${ref.wpm + ref.sd} arasındadır` : ''} (${ref.source}). Bu test sessiz okumayı ölçtüğü için bu değerler doğrudan karşılaştırılamaz; sessiz okuma her yaşta sesli okumadan hızlı olmayabilir.`
            : null,
        speedNote,
        tooFast: !!rr.flags?.tooFast,
        tooSlow: !!rr.flags?.tooSlow,
        pace: rr.pace,
      };
    }
  }

  const interests =
    def.engine === 'likert' && def.profile === 'riasec' ? buildInterestProfile(sections, audience, input.grade) : undefined;
  const ranking =
    def.engine === 'likert' && (def.profile === 'interests' || def.profile === 'activities') ? rankInterests(sections, def.profile) : undefined;
  const facetGroups =
    def.engine === 'likert' && def.profile === 'facets'
      ? def.scales
          .filter((s) => s.of?.length)
          .map((s) => {
            const facets = s.of ?? [];
            const first = def.scales.find((x) => x.key === facets[0]);
            return { domain: s.key, facets, facetItems: first ? scaleItems(def, first).length : 0 };
          })
      : undefined;
  const circumplex =
    def.engine === 'likert' && def.profile === 'circumplex'
      ? def.scales.flatMap((s) => (s.angle === undefined ? [] : [{ key: s.key, angle: s.angle, short: s.short ?? s.name }]))
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
  } else if (sections.length > 2 && !interests && !facetGroups && !circumplex && !template?.evaluative) {
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
    circumplex,
    cognitive,
    academic,
  };
}

/**
 * Sıralı ilgi ya da etkinlik profili. Bölümler yerinde sıralanır: puanı olanlar en yüksekten en düşüğe, hesaplanamayanlar
 * sonda. Aynı puandaki alanlar testteki sıralarını korur. Düzeyler şablondaki düzeylerdir (ör. düşük, orta, yüksek).
 */
function rankInterests(sections: ReportSection[], kind: InterestRanking['kind']): InterestRanking {
  sections.sort((a, b) => (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY));
  const scored = sections.filter((s) => s.value !== null);
  const high = scored.filter((s) => s.band === 'high' || s.band === 'very_high');
  const noneHigh = high.length === 0;
  const values = scored.map((s) => s.value as number);
  const spread = values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
  return {
    kind,
    order: scored.map((s) => s.scaleKey),
    top:
      values.length > 1 && spread === 0
        ? []
        : (noneHigh ? (kind === 'activities' ? scored.filter((s) => s.band === 'average') : scored).slice(0, 2) : high.slice(0, 3)).map(
            (s) => s.scaleKey,
          ),
    noneHigh,
    flat: values.length > 1 && spread < 0.8,
    allLow: scored.length > 0 && scored.every((s) => s.band === 'low' || s.band === 'very_low'),
  };
}

/* ---------- Akademik konu tarama testleri ---------- */

/** Genel sonuç metinleri. {g}: soruların ait olduğu sınıf, {s}: ders adı (küçük harfle). */
const ACADEMIC_TEXT: Record<'perfect' | 'high' | 'highGap' | 'average' | 'low' | 'allLow', { student: string; parent: string }> = {
  perfect: {
    student: '{g}. sınıf {s} konularındaki soruların hepsini doğru yaptın. Bu tarama, bu konularda belirgin bir eksik göstermiyor.',
    parent: 'Çocuğunuz {g}. sınıf {s} konularındaki soruların hepsini doğru yaptı. Bu tarama, bu konularda belirgin bir eksik göstermiyor.',
  },
  high: {
    student:
      '{g}. sınıf {s} konularının çoğunu sağlam biliyorsun. Aşağıda yanlış yaptığın ya da bilmediğin az sayıdaki soruya ve varsa hata türlerine göz atman yeterli.',
    parent:
      'Çocuğunuz {g}. sınıfın temel {s} konularının büyük bölümüne hâkim görünüyor. Aşağıdaki yanlış yapılan sorular ve hata türleri, pekiştirilebilecek küçük noktaları gösteriyor.',
  },
  // Genel sonuç iyi ama bir alanda soruların çoğu yanlış ya da boş: o alan öne çıkarılır ({d}: alan adları).
  highGap: {
    student:
      '{g}. sınıf {s} konularının çoğunu sağlam biliyorsun. Ancak {d} soruların çoğunda zorlandın; aşağıdaki sorularla önce bu konuya bakman iyi olur.',
    parent:
      'Çocuğunuz {g}. sınıfın temel {s} konularının büyük bölümüne hâkim görünüyor. Ancak {d} soruların çoğunda zorlandı; bu konuya öncelik verilmesi iyi olur.',
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
  // Bütün alanlar öncelikli: eksikler belirli konularda toplanmıyor.
  allLow: {
    student:
      '{g}. sınıf {s} konularının birçoğunda zorlandın. Bu, bu konuları öğrenemeyeceğin anlamına gelmez: eksikler adım adım tamamlanabilir. Aşağıdaki sorulardan ve öğretmeninin önerdiği konulardan başlayabilir, ondan destek isteyebilirsin.',
    parent:
      'Çocuğunuz {g}. sınıf {s} konularının birçoğunda zorlandı. Yeni konular öncekilerin üzerine kurulduğu için bu eksikler bu yılın konularını da zorlaştırabilir. Sonucu dersin öğretmeniyle paylaşmanızı ve öğretmenin önerdiği konulardan başlayarak planlı bir tekrar yapılmasını öneririz. Tek bir testin sonucu kesin bir yargı değildir.',
  },
};

/** "Veri alanındaki" / "Veri ve Geometri ve ölçme alanlarındaki" */
function domainPhrase(names: string[]): string {
  if (names.length === 1) return `${names[0]} alanındaki`;
  return `${names.slice(0, -1).join(', ')} ve ${names[names.length - 1]} alanlarındaki`;
}

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
  // Genel metin: bütün sorular doğruysa ayrı metin; genel sonuç iyi ama bir alan öncelikliyse o alan söylenir; bütün
  // alanlar öncelikliyse eksiklerin "belirli konularda toplandığı" söylenmez.
  const lowDomains = form.domains.filter((d) => result.domains.find((x) => x.key === d.key)?.band === 'low').map((d) => d.name);
  const textKey: keyof typeof ACADEMIC_TEXT =
    result.correct === result.n
      ? 'perfect'
      : band === 'high'
        ? lowDomains.length
          ? 'highGap'
          : 'high'
        : band === 'low' && lowDomains.length === form.domains.length
          ? 'allLow'
          : band;

  // Cevaplar çok hızlı verildiyse ya da aynı seçenekte toplandıysa seçilen seçenekler tahmin olabilir: bir hata
  // türünü göstermez, hata türleri yorumlanmaz.
  const guessed = result.flags.tooFast || result.flags.sameLetter;
  const misconceptions = guessed
    ? []
    : result.misconceptions
        .filter((m) => def.misconceptions[m.key])
        .map((m) => ({ key: m.key, ...def.misconceptions[m.key], count: m.count, itemNumbers: m.itemNumbers }));
  const repeated = misconceptions.some((m) => m.count > 1);
  const you = audience !== 'parent';
  const misconceptionNote = guessed
    ? you
      ? 'Cevaplar çok hızlı verildiği ya da çoğu aynı seçenekte toplandığı için hata türleri yorumlanmadı: seçilen seçenekler tahmin olabilir.'
      : 'Cevaplar çok hızlı verildiği ya da çoğu aynı seçenekte toplandığı için hata türleri yorumlanmadı: seçilen seçenekler tahmin olabilir.'
    : misconceptions.length === 0
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
    text: ACADEMIC_TEXT[textKey][voice(audience)]
      .replaceAll('{g}', String(form.contentGrade))
      .replaceAll('{s}', def.subject.toLocaleLowerCase('tr-TR'))
      .replaceAll('{d}', domainPhrase(lowDomains)),
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
        misconception: !guessed && r?.misconception ? (def.misconceptions[r.misconception]?.name ?? null) : null,
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

/**
 * Bölümler arasındaki değişim hem bu yüzdeyi aşınca hem de işaret sayılarına göre ölçümün oynaklığını aşınca
 * (`sustainClear`) "arttı" ya da "düştü" denir; daha küçük farklar ölçüm hatası içindedir.
 */
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

  // Çok sayıda yanlış işaret varken (harflere gelişigüzel dokunmak da bütün hedefleri bulur) "dikkatli" denmez.
  const manyFalse = r.falseAlarmRate >= 0.02;
  const found =
    r.hitRate >= 0.9
      ? you
        ? `Taradığın satırlardaki aranan harflerin ${r.omissions === 0 ? 'hepsini' : 'neredeyse hepsini'} buldun${manyFalse ? '.' : '; dikkatli çalıştığını gösteriyor.'}`
        : `Taranan satırlardaki aranan harflerin ${r.omissions === 0 ? 'hepsi' : 'neredeyse hepsi'} bulundu${manyFalse ? '.' : '; görev dikkatle yürütülmüş.'}`
      : r.hitRate >= 0.75
        ? you
          ? 'Taradığın satırlardaki aranan harflerin çoğunu buldun ama bir kısmını atladın. Hızlı giderken bazı harflerin gözden kaçması çok yaygındır; satır satır, harf harf ilerlemek atlamaları azaltır.'
          : 'Taranan satırlardaki aranan harflerin çoğu bulundu, bir kısmı atlandı. Hızlı çalışırken bazı harflerin gözden kaçması yaygındır.'
        : you
          ? 'Taradığın satırlardaki aranan harflerin önemli bir kısmını atladın. Bu; hızlı gitmekten, satır atlamaktan ya da o an dikkatinin dağılmasından kaynaklanabilir. Acele etmeden, harf harf ilerlemek işine yarar.'
          : 'Taranan satırlardaki aranan harflerin önemli bir kısmı atlandı. Bu; çok hızlı çalışmaktan, satır atlamaktan ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır.';
  const falseMarks =
    manyFalse
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
    detail: `${n(r.hits)} harf bulundu · ${n(r.omissions)} harf atlandı · ${n(r.commissions)} yanlış işaret${
      r.strays ? ` · taranan kısmın çok ilerisindeki ${n(r.strays)} dokunuş yanlışlıkla dokunma sayıldı, puana katılmadı` : ''
    }`,
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
      : change <= -SUSTAIN_THRESHOLD && r.sustainClear
        ? [
            'Son bölümlerde düştü',
            you
              ? `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} azaldı. Uzun bir işte yorulmak ya da sıkılmak herkeste olur; uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`
              : `Son bölümlerde net doğru sayısı ilk bölümlere göre yaklaşık ${x} azaldı. Bu, dikkati uzun süre aynı düzeyde tutmakta zorlanıldığını düşündürebilir; yorgunluk ya da isteksizlik de aynı etkiyi yapar. Uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`,
          ]
        : change >= SUSTAIN_THRESHOLD && r.sustainClear
          ? [
              'Görev ilerledikçe arttı',
              you
                ? `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} arttı: görevi yaptıkça ısındın.`
                : `Son bölümlerde net doğru sayısı ilk bölümlere göre yaklaşık ${x} arttı: görev ilerledikçe ısınma ve alışma görülüyor.`,
            ]
          : [
              'Belirgin değişim yok',
              you
                ? `${task.sections} bölüm boyunca belirgin bir değişim görülmedi; dikkatini görev boyunca koruyabildiğini düşündürüyor. Bölümler arasındaki küçük farklar ölçümün doğal oynaklığıdır.`
                : `${task.sections} bölüm boyunca belirgin bir değişim görülmedi; dikkat görev süresince korunabilmiş görünüyor.`,
            ];
  const surdurme: CognitiveBlock = {
    ...card('surdurme'),
    headline,
    text: you ? sustainText : `${sustainText} Bölümler arasındaki küçük farklar ölçüm hatası sınırları içindedir; yalnızca belirgin değişimler yorumlanmalıdır.`,
    sections: r.sections.map((s) => ({ label: `${s.index + 1}. bölüm`, value: s.net })),
  };

  return [tempo, isabet, net, surdurme];
}

/* ---------- Tek görevli testler: renk-kelime, dur-git, sırayla birleştirme, geriye dönük hatırlama, zihinde döndürme, tepki hızı ---------- */

const nf2 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/** Milisaniyeyi saniye olarak yazar: 820 → "0,82". */
const sn = (ms: number) => nf2.format(ms / 1000);
/** Çubuk grafiğin üst sınırı: en büyük değerden büyük ya da ona eşit ilk yuvarlak sayı. */
const roundUp = (v: number, step: number) => Math.max(step, Math.ceil(v / step) * step);

type CardOf = (k: string) => { key: string; name: string; plain: string };
type TaskReport = { blocks: CognitiveBlock[]; chart?: CognitiveReport['chart']; figures?: CognitiveReport['figures']; profile?: CognitiveReport['profile'] };

/** Renk-kelime görevinde bu kadardan (ms) küçük farklar "belirgin değil" sayılır. */
const INTERFERENCE_MIN_MS = 50;

/** Renk-kelime görevinin üç sonuç kartı: doğru cevaplar, cevap hızı ve renk-kelime etkisi. */
function colorWordBlocks(r: ColorWordResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const drop = r.accCongruent - r.accIncongruent >= 0.1;
  // Kelime ile renk farklıyken yapılan hataların türü, çoğunluğa göre belirlenir: kelimenin söylediği renge basmak
  // (okuma alışkanlığı), başka bir renge basmak (renkler karışmış ya da acele), süre içinde cevap vermemek ya da
  // kelimeye bakmadan çok erken basmak. Renk denemesinde renkler karıştırıldıysa kelime hataları da renklerin
  // karışmasından olabileceği için okuma yorumu yapılmaz.
  const incErr = r.incongruentErrors;
  const missedInc = incErr - r.wordErrors - r.otherErrors;
  const errorKind: 'reading' | 'other' | 'missed' | 'mixed' =
    incErr === 0
      ? 'mixed'
      : !r.checkFlag && r.wordErrors > incErr / 2
        ? 'reading'
        : r.otherErrors > incErr / 2
          ? 'other'
          : missedInc > incErr / 2
            ? 'missed'
            : 'mixed';
  const incongruentNote = {
    reading: you
      ? ' Hataların çoğu kelime ile renk farklıyken oldu ve bu hatalarda çoğunlukla kelimenin söylediği renge bastın: kelimeyi okuma alışkanlığı zaman zaman öne geçti.'
      : ' Hataların çoğu kelime ile renk farklıyken oldu ve bu hatalarda çoğunlukla kelimenin söylediği renge basıldı; bu, kelimeyi okuma alışkanlığının zaman zaman öne geçtiğini gösterir.',
    other: you
      ? ' Hataların çoğu kelime ile renk farklıyken oldu; bu hatalarda çoğunlukla kelimeye değil, başka bir renge bastın. Renkleri birbirine karıştırmış ya da acele etmiş olabilirsin.'
      : ' Hataların çoğu kelime ile renk farklıyken oldu; bu hatalarda çoğunlukla kelimeye değil, başka bir renge basıldı. Renkler birbirine karıştırılmış ya da acele edilmiş olabilir.',
    missed: you
      ? ' Hataların çoğu kelime ile renk farklıyken oldu; bu denemelerin çoğunda süre içinde cevap vermedin ya da kelimeye bakmadan çok erken bastın.'
      : ' Hataların çoğu kelime ile renk farklıyken oldu; bu denemelerin çoğunda süre içinde cevap verilmedi ya da kelimeye bakmadan çok erken basıldı.',
    mixed: ' Hataların çoğu kelime ile renk farklıyken oldu.',
  }[errorKind];
  // Doğruluk düşükken hataların çoğu süre aşımı ya da çok erken cevapsa bu ayrıca söylenir.
  const errors = r.n - r.correct;
  const mostlyMissed = errors > 0 && r.timeouts + r.anticipations > errors / 2;
  let accText: string;
  if (r.accuracy === 1) {
    accText = you ? 'Yazıların rengini her seferinde doğru buldun.' : 'Çocuğunuz yazıların rengini her seferinde doğru buldu.';
  } else if (r.accuracy >= 0.9) {
    accText = you ? 'Yazıların rengini neredeyse her seferinde doğru buldun.' : 'Çocuğunuz yazıların rengini neredeyse her seferinde doğru buldu.';
    if (drop) {
      accText += you
        ? ' Kelime ile renk farklıyken biraz daha çok hata yaptın; görevin zor kısmı budur ve çoğu kişide görülür.'
        : ' Kelime ile renk farklıyken biraz daha çok hata yapması beklenen bir durumdur; görevin zor kısmı budur.';
    }
  } else if (r.accuracy >= 0.75) {
    accText = you ? 'Yazıların rengini çoğu zaman doğru buldun, bazı denemelerde yanıldın.' : 'Çocuğunuz yazıların rengini çoğu zaman doğru buldu, bazı denemelerde yanıldı.';
    if (drop) accText += incongruentNote;
  } else if (mostlyMissed && !(drop && errorKind === 'reading')) {
    // Doğru olmayan cevapların çoğu süre aşımı ya da çok erken cevap: "rengi bulmakta zorlandı" denmez.
    const missed = r.timeouts + r.anticipations;
    const some = missed > r.n / 2 ? 'denemelerin çoğunda' : 'denemelerin bir kısmında';
    accText = you
      ? `Görevde ${some} süre içinde cevap vermedin ya da kelimeye bakmadan çok erken bastın. Görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin.`
      : `Çocuğunuz görevde ${some} süre içinde cevap vermedi ya da kelimeye bakmadan çok erken bastı; görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`;
  } else {
    const some = r.accuracy < 0.5 ? 'Denemelerin çoğunda' : 'Denemelerin bir kısmında';
    accText = you ? `${some} yazının rengini bulmakta zorlandın.` : `Çocuğunuz ${some.toLocaleLowerCase('tr-TR')} yazının rengini bulmakta zorlandı.`;
    if (drop && errorKind === 'reading') {
      accText += you
        ? ' Hatalarının çoğu kelime ile renk farklıyken oldu ve bu hatalarda çoğunlukla kelimenin söylediği renge bastın: kelimeyi okumak, yazının rengine bakmanın önüne geçti. Acele etmeden, önce yazının rengine bakmak işine yarar.'
        : ' Hataların çoğu kelime ile renk farklıyken oldu ve bu hatalarda çoğunlukla kelimenin söylediği renge basıldı: kelimeyi okumak yazının rengine bakmanın önüne geçmiş ya da yönerge tam anlaşılmamış olabilir. Bu sonuç tek başına yorumlanmamalıdır.';
    } else {
      accText += you
        ? ' Bu; acele etmekten, yönergeyi tam anlamamaktan ya da renkleri ayırt etmekte zorlanmaktan kaynaklanabilir.'
        : ' Bu; acele etmekten, yönergenin tam anlaşılmamasından ya da renkleri ayırt etmekte zorlanmaktan (renk körlüğü) kaynaklanabilir ve tek başına yorumlanmamalıdır.';
    }
  }
  if (r.checkFlag) {
    accText += you
      ? ' Görevin başındaki renk denemesinde bazı renkleri birbirine karıştırdın. Renkleri ayırt etmekte zorlanıyorsan bu sonuç seni doğru yansıtmayabilir.'
      : ' Görevin başındaki renk denemesinde bazı renkler birbirine karıştırıldı. Renkleri ayırt etmekte zorlanan (ör. renk körlüğü olan) biri için bu görevin sonucu geçerli değildir.';
  }
  const dogruluk: CognitiveBlock = {
    ...card('renk_dogruluk'),
    headline: `${pct(r.accuracy)} doğru`,
    detail: `Kelime ile renk aynıyken ${pct(r.accCongruent)}, farklıyken ${pct(r.accIncongruent)} doğru`,
    text: accText,
  };

  const hiz: CognitiveBlock =
    r.medianRt === null
      ? {
          ...card('renk_hiz'),
          headline: 'Hesaplanamadı',
          text: you ? 'Yeterince doğru cevap olmadığı için cevap süren hesaplanamadı.' : 'Yeterince doğru cevap olmadığı için cevap süresi hesaplanamadı.',
        }
      : {
          ...card('renk_hiz'),
          headline: `Tipik cevap süresi ${sn(r.medianRt)} saniye`,
          text: you
            ? `Doğru cevaplarında yazının rengini bulup düğmeye basman tipik olarak ${sn(r.medianRt)} saniye sürdü. Hız tek başına iyi ya da kötü değildir; önemli olan, hızlı giderken doğru cevap verebilmektir.`
            : `Çocuğunuzun doğru cevaplarında tipik cevap süresi ${sn(r.medianRt)} saniye oldu. Bu süre; yazının rengini fark etmeyi, doğru düğmeyi bulmayı ve basmayı içerir; yaşla ve kullanılan cihazla (dokunmatik ekran, fare ya da klavye) değişir. Hız, doğrulukla birlikte değerlendirilmelidir.`,
        };

  // Süreler raporda saniyenin yüzde biri (10 ms) duyarlılığıyla yazılır; fark da yuvarlanmış sürelerden hesaplanır
  // ki yazılan iki süre ile yazılan fark birbirini tutsun.
  const to10 = (ms: number | null) => (ms === null ? null : Math.round(ms / 10) * 10);
  const c = to10(r.medianRtCongruent);
  const i = to10(r.medianRtIncongruent);
  let etki: CognitiveBlock;
  let chart: CognitiveReport['chart'];
  if (c === null || i === null) {
    etki = {
      ...card('renk_etki'),
      headline: 'Hesaplanamadı',
      text: 'Kelime ile rengin aynı ya da farklı olduğu denemelerin birinde yeterince doğru cevap olmadığı için karşılaştırma yapılamadı.',
    };
  } else {
    const diff = i - c;
    const detail = `Aynıyken ${sn(c)} sn · farklıyken ${sn(i)} sn`;
    if (diff >= INTERFERENCE_MIN_MS) {
      etki = {
        ...card('renk_etki'),
        headline: `Kelime ile renk farklıyken ${sn(diff)} sn daha yavaş`,
        detail,
        text: you
          ? 'Kelime ile renk farklı olduğunda cevapların biraz yavaşladı. Bu çoğu kişide olur: okumak o kadar otomatik bir alışkanlıktır ki kelime, rengi bulmanın önüne geçer. Bu yavaşlama, alışkanlığa direnip doğru cevabı vermenin ne kadar çaba istediğini gösterir. Bu fark bir seferden ötekine değişebilir; küçük farklara takılma.'
          : 'Kelime ile renk farklı olduğunda çocuğunuzun cevapları biraz yavaşladı. Bu, çoğu kişide görülen bir etkidir (renk-kelime etkisi): okuma otomatik bir alışkanlık olduğu için kelime, rengi bulmanın önüne geçer. Yavaşlamanın büyüklüğü, alışkanlığa direnip doğru cevabı vermenin ne kadar çaba istediğini gösterir; bu etki çocuklukta büyüktür ve yaşla azalır. Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.',
      };
    } else if (diff <= -INTERFERENCE_MIN_MS) {
      etki = {
        ...card('renk_etki'),
        headline: 'Kelime ile renk farklıyken daha hızlı',
        detail,
        text: you
          ? 'Kelime ile renk farklıyken cevapların, aynıyken olduğundan biraz daha hızlıydı. Bu sık görülmez; çoğunlukla ölçümün doğal payından kaynaklanır ve bir seferden ötekine değişebilir.'
          : 'Kelime ile renk farklıyken çocuğunuzun cevapları, aynıyken olduğundan biraz daha hızlıydı. Bu sık görülmez; çoğunlukla ölçümün doğal payından kaynaklanır. Tek bir uygulamada bu farkın kesinliği düşüktür.',
      };
    } else {
      etki = {
        ...card('renk_etki'),
        headline: 'Belirgin bir fark görülmedi',
        detail,
        text: you
          ? 'Kelime ile renk farklıyken cevapların, aynıyken olduğundan belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlama, bu uygulamada sende belirgin olarak ortaya çıkmadı. Bu fark bir seferden ötekine değişebilir.'
          : 'Kelime ile renk farklıyken çocuğunuzun cevapları, aynıyken olduğundan belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlamanın belirgin olmaması; kelimelerin henüz çok otomatik okunmamasından, hızdan çok doğruluğa önem verilmesinden ya da ölçümün doğal payından kaynaklanabilir. Tek bir uygulamada bu farkın kesinliği düşüktür.',
      };
    }
    const max = roundUp(Math.max(c, i), 500);
    chart = {
      title: 'Tipik cevap süresi',
      note: you
        ? 'Çubuklar doğru cevaplarındaki tipik cevap süresini gösterir; kısa çubuk daha hızlı demek.'
        : 'Çubuklar doğru cevaplardaki tipik (ortanca) cevap süresini gösterir; kısa çubuk daha hızlı demektir.',
      rows: [
        { label: 'Kelime ile renk aynıyken', value: c, max, valueLabel: `${sn(c)} sn` },
        { label: 'Kelime ile renk farklıyken', value: i, max, valueLabel: `${sn(i)} sn` },
      ],
    };
  }
  return { blocks: [dogruluk, hiz, etki], chart };
}

/** Basma oranı bunun altındaysa durma oranı tek başına yorumlanamaz: hiç basmayan biri de X'te "durmuş" görünür. */
const GO_HIT_FOR_STOP = 0.7;

/** Dur-git görevinin üç sonuç kartı: durabilme, kaçırmadan tepki ve tepki hızı. */
function goNoGoBlocks(r: GoNoGoResult, task: GoNoGoTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const x = task.stop;
  const stopped = r.stopTrials - r.commissions;
  const early = r.anticipations > r.omissions;
  let durmaText: string;
  if (r.hitRate < GO_HIT_FOR_STOP) {
    const q = r.hitRate < 0.5 ? 'çoğunda' : 'önemli bir kısmında';
    // "0 kez durdun" ya da "30 kez durdun" yerine "hiç durmadın" ve "her seferinde durdun".
    const didStop = you
      ? stopped === 0
        ? `${x} geldiğinde hiç durmadın`
        : r.commissions === 0
          ? `${x} geldiğinde her seferinde durdun`
          : `${x} geldiğinde ${stopped} kez durdun, ${r.commissions} kez bastın`
      : stopped === 0
        ? `Çocuğunuz ${x} geldiğinde hiç durmadı`
        : r.commissions === 0
          ? `Çocuğunuz ${x} geldiğinde her seferinde durdu`
          : `Çocuğunuz ${x} geldiğinde ${stopped} kez durdu, ${r.commissions} kez bastı`;
    durmaText = early
      ? you
        ? `${didStop}. Ama basman gereken harflerin ${q} harfe bakmadan, çok erken bastığın için bu oran tek başına bir şey söylemez.`
        : `${didStop}. Ancak basması gereken harflerin ${q} harfe bakmadan, çok erken bastığı için bu oran tek başına yorumlanamaz.`
      : you
        ? `${didStop}. Ama basman gereken harflerin ${q} zamanında basmadığın için bu oran tek başına bir şey söylemez: hiç basmayan biri de ${x}’te durmuş görünür.`
        : `${didStop}. Ancak basması gereken harflerin ${q} zamanında basmadığı için bu oran tek başına yorumlanamaz: hiç basmayan biri de ${x}’te durmuş görünür.`;
  } else if (r.stopRate === 1) {
    durmaText = you
      ? `${x} geldiğinde her seferinde durabildin. Sık sık basarken birden durmak kolay değildir; bu, hızlı çalışırken bile kendini frenleyebildiğini gösterir.`
      : `Çocuğunuz ${x} geldiğinde her seferinde durabildi. Sık tekrarlanan bir tepkiyi gerektiğinde vermeden durabilmek (tepki ketlemesi), hızlı çalışırken kendini frenleyebilmeyi gösterir.`;
  } else if (r.stopRate >= 0.8) {
    durmaText = you
      ? `${x} geldiğinde çoğu zaman durabildin. Sık sık basarken birden durmak kolay değildir; bu, hızlı çalışırken bile kendini frenleyebildiğini gösterir.`
      : `Çocuğunuz ${x} geldiğinde çoğu zaman durabildi. Sık tekrarlanan bir tepkiyi gerektiğinde vermeden durabilmek (tepki ketlemesi), hızlı çalışırken kendini frenleyebilmeyi gösterir.`;
  } else if (r.stopRate >= 0.6) {
    durmaText = you
      ? `${x} geldiğinde çoğu zaman durabildin, bazen de istemeden bastın. Sık sık basarken birden durmak çoğu kişi için zordur; özellikle hızlı gittiğinde elin gözünden önce davranabilir.`
      : `Çocuğunuz ${x} geldiğinde çoğu zaman durabildi, bazen de istemeden bastı. Sık tekrarlanan bir tepkiyi gerektiğinde vermeden durabilmek çoğu kişi için zordur; hızlı çalışıldığında bu tür hatalar artar.`;
  } else {
    durmaText = you
      ? `${x} geldiğinde birçok kez istemeden bastın. Sık sık basarken birden durmak çoğu kişi için zordur; biraz daha yavaş ve dikkatli gitmek durmayı kolaylaştırır.`
      : `Çocuğunuz ${x} geldiğinde birçok kez istemeden bastı. Bu; çok hızlı çalışmaktan, yönergenin tam anlaşılmamasından ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır. Tepki ketlemesi çocukluk ve ergenlik boyunca gelişmeye devam eder.`;
  }
  const durma: CognitiveBlock = {
    ...card('dg_durma'),
    headline: `Durma oranı ${pct(r.stopRate)}`,
    detail: `${x} harfi ${r.stopTrials} kez geldi: ${stopped} kez basılmadı, ${r.commissions} kez basıldı`,
    text: durmaText,
  };

  let tepkiText: string;
  if (r.hitRate === 1) {
    tepkiText = you
      ? 'Basman gereken harflerin hepsinde zamanında bastın: dikkatini görev boyunca açık tuttun.'
      : 'Çocuğunuz basması gereken harflerin hepsinde zamanında bastı; dikkati görev boyunca açık kaldı.';
  } else if (r.hitRate >= 0.95) {
    tepkiText = you
      ? 'Basman gereken harflerin neredeyse hepsinde zamanında bastın: dikkatini görev boyunca açık tuttun.'
      : 'Çocuğunuz basması gereken harflerin neredeyse hepsinde zamanında bastı; dikkati görev boyunca açık kaldı.';
  } else if (r.hitRate >= 0.85) {
    tepkiText = early
      ? you
        ? 'Basman gereken harflerin çoğunda zamanında bastın; birkaçında harfe bakmadan, çok erken bastın.'
        : 'Çocuğunuz basması gereken harflerin çoğunda zamanında bastı; birkaçında harfe bakmadan, çok erken bastı.'
      : you
        ? 'Basman gereken harflerin çoğunda zamanında bastın, birkaçını kaçırdın.'
        : 'Çocuğunuz basması gereken harflerin çoğunda zamanında bastı, birkaçını kaçırdı.';
  } else if (early) {
    const q = r.anticipations > r.goTrials / 2 ? 'çoğunda' : 'bir kısmında';
    tepkiText = you
      ? `Basman gereken harflerin ${q} harf görünür görünmez, ona bakmadan bastın. Harfi görüp öyle basmak, hem doğru tepki vermeni hem de ${x}’te durmanı kolaylaştırır.`
      : `Çocuğunuz basması gereken harflerin ${q} harf görünür görünmez, ona bakmadan bastı; düğmeye harfi beklemeden basılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`;
  } else {
    const q = r.omissions > r.goTrials / 2 ? 'çoğunu' : 'bir kısmını';
    tepkiText = you
      ? `Basman gereken harflerin ${q} kaçırdın. Bu; dikkatin zaman zaman dağılmasından, yorgunluktan ya da ${x}’e takılmamak için çok dikkatli gitmekten kaynaklanabilir.`
      : `Çocuğunuz basması gereken harflerin ${q} kaçırdı. Bu; dikkatin zaman zaman dağılmasından, yorgunluktan, isteksizlikten ya da çok dikkatli davranmaya çalışmaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.`;
  }
  const earlyNote = r.anticipations ? `, ${r.anticipations} kez çok erken basıldı` : '';
  const tepki: CognitiveBlock = {
    ...card('dg_tepki'),
    headline: `Basma oranı ${pct(r.hitRate)}`,
    detail: `Diğer harfler ${r.goTrials} kez geldi: ${r.hits} kez zamanında basıldı, ${r.omissions} kez kaçırıldı${earlyNote}`,
    text: tepkiText,
  };

  let hiz: CognitiveBlock;
  if (r.medianRt === null) {
    hiz = { ...card('dg_hiz'), headline: 'Hesaplanamadı', text: 'Zamanında basış çok az olduğu için tepki süresi hesaplanamadı.' };
  } else {
    const speedy = r.stopRate < 0.6 && r.hitRate >= 0.95;
    const careful = r.stopRate >= 0.8 && r.hitRate >= GO_HIT_FOR_STOP && r.hitRate < 0.85 && !early;
    const pattern = speedy
      ? you
        ? ` Senin sonucunda hız öne çıkıyor: biraz yavaşlamak ${x}’te durmanı kolaylaştırabilir.`
        : ` Çocuğunuzun sonucunda hız öne çıkıyor: hızlı tepki verirken ${x}’te durmakta zorlandı.`
      : careful
        ? you
          ? ` Senin sonucunda dikkatli davranmak öne çıkıyor: ${x}’te durmayı başardın ama bazı harfleri kaçırdın.`
          : ` Çocuğunuzun sonucunda dikkatli davranmak öne çıkıyor: ${x}’te durmayı başardı ama bazı harfleri kaçırdı.`
        : '';
    hiz = {
      ...card('dg_hiz'),
      headline: `Tipik tepki süresi ${sn(r.medianRt)} saniye`,
      text:
        (you
          ? `Doğru bastığın harflerde tepki süren tipik olarak ${sn(r.medianRt)} saniyeydi. Bu görevde hız ile durabilme arasında bir denge vardır: çok hızlı gidenler ${x}’te daha sık yanılır, çok dikkatli gidenler ise bazı harfleri kaçırır.`
          : `Çocuğunuzun doğru basışlarında tipik tepki süresi ${sn(r.medianRt)} saniye oldu. Bu görevde hız ile durabilme arasında bir denge vardır: çok hızlı çalışanlar ${x}’te daha sık yanılır, çok dikkatli çalışanlar bazı harfleri kaçırır.`) + pattern,
    };
  }
  return {
    blocks: [durma, tepki, hiz],
    chart: {
      title: 'Doğru tepki oranları',
      note: you
        ? 'Çubuklar, durman ve basman gereken harflerde doğru tepki oranını gösterir.'
        : 'Çubuklar, durması ve basması gereken harflerde doğru tepki oranını gösterir.',
      rows: [
        { label: `${x} geldiğinde durma`, value: Math.round(r.stopRate * 100), max: 100, valueLabel: pct(r.stopRate) },
        { label: 'Diğer harflerde basma', value: Math.round(r.hitRate * 100), max: 100, valueLabel: pct(r.hitRate) },
      ],
    },
  };
}

/** İki bölümün oranı bu aralıktaysa "yaklaşık aynı sürdü" denir. */
const TRAIL_SAME: [number, number] = [0.9, 1.1];

/** Sırayla birleştirme görevinin üç sonuç kartı: iki bölümün süreleri ve sayılarla harfler arasında geçiş. */
function trailBlocks(r: TrailResult, task: TrailTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  /** Süreyi saniyenin onda biri duyarlılığında yazar (önce yuvarlanır ki her yerde aynı sayı çıksın). */
  const s1 = (ms: number) => nf1.format(Math.round(ms / 100) / 10);
  const maxSec = nf0.format(task.maxMs / 1000);
  const errText = (errors: number) =>
    errors === 0
      ? you
        ? ' Hiç yanlış daireye dokunmadın.'
        : ' Hiç yanlış daireye dokunulmadı.'
      : you
        ? ` ${errors} kez yanlış daireye dokundun; hızlı giderken bu sık olur.`
        : ` ${errors} kez yanlış daireye dokunuldu; hızlı çalışırken bu sık olur.`;
  const incomplete = (p: TrailResult['parts'][number]) =>
    you
      ? `Bu bölüm ${maxSec} saniyelik süre içinde tamamlanamadı (${p.n} dairenin ${p.reached} tanesini birleştirdin). Acele etmeden, sıradakini arayarak ilerlemek işine yarar.`
      : `Bu bölüm ${maxSec} saniyelik süre içinde tamamlanamadı (${p.n} dairenin ${p.reached} tanesi birleştirildi). Bu; cihazdan, yönergenin tam anlaşılmamasından ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır.`;
  const [a, b] = r.parts;

  const blockA: CognitiveBlock = a.completed
    ? {
        ...card('iz_a'),
        headline: `${s1(a.timeMs)} saniye`,
        detail: `${a.n} daire · ${a.errors} yanlış dokunuş`,
        text: you
          ? `Sayıları sırayla (${a.n} daire) ${s1(a.timeMs)} saniyede birleştirdin.${errText(a.errors)} Bu bölüm, ekranı tarayıp aradığını hızla bulabilmeyi ve el-göz uyumunu gösterir.`
          : `Çocuğunuz sayıları sırayla (${a.n} daire) ${s1(a.timeMs)} saniyede birleştirdi.${errText(a.errors)} Bu bölüm görsel taramayı, işlem hızını ve el-göz uyumunu yansıtır; süre, kullanılan cihazdan (dokunmatik ekran ya da fare) belirgin biçimde etkilenir.`,
      }
    : { ...card('iz_a'), headline: 'Süre içinde tamamlanamadı', detail: `${a.n} dairenin ${a.reached} tanesi birleştirildi`, text: incomplete(a) };

  const blockB: CognitiveBlock = b.completed
    ? {
        ...card('iz_b'),
        headline: `${s1(b.timeMs)} saniye`,
        detail: `${b.n} daire · ${b.errors} yanlış dokunuş`,
        text: you
          ? `Sayı ve harfleri sırayla (${b.n} daire) ${s1(b.timeMs)} saniyede birleştirdin.${errText(b.errors)} Bu bölümde bir sayıya bir harfe geçerek iki sırayı birlikte izlemen gerekir; bu yüzden genellikle birinci bölümden daha uzun sürer.`
          : `Çocuğunuz sayı ve harfleri sırayla (${b.n} daire) ${s1(b.timeMs)} saniyede birleştirdi.${errText(b.errors)} Bu bölümde sayılar ile harfler arasında gidip gelerek iki sırayı birlikte izlemek gerekir; bu yüzden genellikle birinci bölümden daha uzun sürer. Alfabe sırasını akıcı bilmek de bu süreyi etkiler.`,
      }
    : { ...card('iz_b'), headline: 'Süre içinde tamamlanamadı', detail: `${b.n} dairenin ${b.reached} tanesi birleştirildi`, text: incomplete(b) };

  let gecis: CognitiveBlock;
  if (r.ratio === null || r.diffMs === null) {
    gecis = {
      ...card('iz_gecis'),
      headline: 'Hesaplanamadı',
      text: 'Bölümlerden biri süre içinde tamamlanamadığı için iki bölüm karşılaştırılamadı.',
    };
  } else {
    // Oran ve fark, raporda yazılan (saniyenin onda biri duyarlılığında) sürelerden hesaplanır ki birbirini tutsun.
    const tA = Math.round(a.timeMs / 100) * 100;
    const tB = Math.round(b.timeMs / 100) * 100;
    const ratio = tB / tA;
    const diff = tB - tA;
    const x = nf1.format(ratio);
    const detail = `Birinci bölüm ${s1(tA)} sn · ikinci bölüm ${s1(tB)} sn · ${diff >= 0 ? `fark ${s1(diff)} sn` : `ikinci bölüm ${s1(-diff)} sn daha kısa`}`;
    if (ratio >= TRAIL_SAME[1]) {
      gecis = {
        ...card('iz_gecis'),
        headline: `Birinci bölümün ${x} katı`,
        detail,
        text: you
          ? `İkinci bölüm, birinci bölümün yaklaşık ${x} katı sürdü (${s1(diff)} saniye daha uzun). Sayılar ile harfler arasında gidip gelmek, iki sırayı aynı anda akılda tutmayı gerektirir ve tek bir sırayı izlemekten daha çok çaba ister; bu yüzden ikinci bölüm genellikle daha uzun sürer. Bu fark bir seferden ötekine değişebilir; küçük farklara takılma.`
          : `Çocuğunuzun ikinci bölümü, birinci bölümün yaklaşık ${x} katı sürdü (${s1(diff)} saniye daha uzun). Sayılar ile harfler arasında geçiş yapmak, iki sırayı aynı anda akılda tutmayı (çalışma belleği) ve aralarında gidip gelmeyi gerektirir; bu yüzden ikinci bölüm genellikle daha uzun sürer. Bu oran, geçiş yapmanın getirdiği ek süreyi gösterir. Tek bir uygulamada kesinliği düşüktür ve alfabe sırasını akıcı bilmekten de etkilenir; tek başına yorumlanmamalıdır.`,
      };
    } else if (ratio > TRAIL_SAME[0]) {
      gecis = {
        ...card('iz_gecis'),
        headline: 'İki bölüm yaklaşık aynı sürdü',
        detail,
        text: you
          ? 'İki bölüm yaklaşık aynı sürede bitti: sayılarla harfler arasında gidip gelmek sana belirgin bir ek süre getirmedi. Genellikle ikinci bölüm daha uzun sürer; bu sonuç bir seferden ötekine değişebilir.'
          : 'Çocuğunuzun iki bölümü yaklaşık aynı sürede bitti: sayılarla harfler arasında gidip gelmek belirgin bir ek süre getirmedi. Genellikle ikinci bölüm daha uzun sürer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
      };
    } else {
      gecis = {
        ...card('iz_gecis'),
        headline: 'İkinci bölüm daha kısa sürdü',
        detail,
        text: you
          ? 'İkinci bölüm birinci bölümden kısa sürdü. Bu sık görülmez; birinci bölümde bir aksaklık olmuş ya da ikinci bölüme gelene kadar göreve alışmış olabilirsin. Bu sonuç bir seferden ötekine değişebilir.'
          : 'Çocuğunuzun ikinci bölümü birinci bölümden kısa sürdü. Bu sık görülmez; birinci bölümde bir aksaklık olmuş ya da göreve alışma etkisi görülmüş olabilir. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
      };
    }
  }

  const secs = r.parts.map((p) => (p.completed ? p.timeMs : task.maxMs) / 1000);
  const max = roundUp(Math.max(...secs), 30);
  return {
    blocks: [blockA, blockB, gecis],
    chart: {
      title: 'Bölüm süreleri',
      note: you
        ? 'Çubuklar her bölümün kaç saniye sürdüğünü gösterir; kısa çubuk daha hızlı demek.'
        : 'Çubuklar her bölümün kaç saniye sürdüğünü gösterir; kısa çubuk daha hızlı demektir.',
      rows: r.parts.map((p, k) => ({
        label: task.parts[p.index]?.name ?? `${k + 1}. bölüm`,
        value: secs[k],
        max,
        valueLabel: p.completed ? `${s1(p.timeMs)} sn` : 'tamamlanmadı',
      })),
    },
  };
}

/** Geriye dönük hatırlamada ayırt etme (yakalama oranı eksi yanlış basma oranı) düzeylerinin alt sınırları. */
const NBACK_PR = { good: 0.8, fair: 0.55, low: 0.3 };
/**
 * Bir geriden iki geriye ayırt etme puanındaki (100 üzerinden) değişimin sınırları. Bir geride 10 aynı harf vardır:
 * tek bir kaçırma puanı 10 değiştirir. Bu yüzden 10 puandan küçük düşüşler "belirgin bir fark yok" sayılır, 20 puan ve
 * üstü "belirgin düşüş"tür; iki gerideki daha yüksek sonuç da ancak en az 15 puan farkla söylenir.
 */
const NBACK_DROP = { clear: 20, some: 10, higher: 15 };
const NBACK_ORDINALS = ['birinci', 'ikinci', 'üçüncü'];

/** Ayırt etme puanı: 100 üzerinden, 0'ın altına inmez (yanlış basmaları yakalamalarından çok olan biri de 0 alır). */
const nBackScore = (l: NBackLevelResult) => Math.max(0, Math.round(l.pr * 100));

/** Hataların türü: çoğunlukla kaçırma (yanlış basma az), karışık ya da aynı olmayan harflerin çoğunda da basma. */
function nBackPattern(l: NBackLevelResult): 'misses' | 'mixed' | 'random' {
  if (l.falseAlarmRate > NBACK_RANDOM_FA) return 'random';
  return l.falseAlarmRate <= 0.1 ? 'misses' : 'mixed';
}

/**
 * Geriye dönük hatırlamanın bir düzeyi (bir geri ya da iki geri bölümleri) için sonuç kartı. İlk cümle yakalananları ve
 * yanlış basmaları olduğu gibi anlatır; ikinci cümle ayırt etmeye göre yorumlar ve olası nedeni hataların türünden seçer.
 */
function nBackLevelBlock(l: NBackLevelResult, blocks: NBackResult['blocks'], audience: Audience, card: CardOf): CognitiveBlock {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const key = l.n === 1 ? 'gh_bir' : 'gh_iki';
  const ref = l.n === 1 ? 'bir önceki harfle aynı olan' : 'iki önceki harfle aynı olan';
  const where = l.n === 1 ? 'bu bölümde' : 'iki geri bölümlerinde';
  const headline = `Yakalama ${pct(l.hitRate)} · yanlış basma ${pct(l.falseAlarmRate)}`;
  const detail =
    (l.hits === 0 ? `Aynı olan ${l.targets} harfin hiçbiri yakalanmadı` : `Aynı olan ${l.targets} harfin ${l.hits} tanesi yakalandı`) +
    (l.falseAlarms === 0 ? ` · aynı olmayan ${l.nonTargets} harfte hiç basılmadı` : ` · aynı olmayan ${l.nonTargets} harfin ${l.falseAlarms} tanesinde basıldı`);

  if (nBackSilent(l)) {
    const W = where.charAt(0).toLocaleUpperCase('tr-TR') + where.slice(1);
    return {
      ...card(key),
      headline,
      detail,
      text: v(
        `${W} hiç basmadın; bu yüzden aynı harfleri yakalayıp yakalayamadığın anlaşılamadı. Yönergeyi tam anlamamış ya da görevi yarıda bırakmış olabilirsin.`,
        `Çocuğunuz ${where} hiç basmadı; bu yüzden aynı harfleri yakalayıp yakalayamadığı anlaşılamadı. Yönerge tam anlaşılmamış ya da görev yarıda bırakılmış olabilir; bu sonuç yorumlanmamalıdır.`,
      ),
    };
  }

  const caught =
    l.hits === l.targets
      ? v('hepsini yakaladın', 'hepsini yakaladı')
      : l.hitRate >= 0.9
        ? v('neredeyse hepsini yakaladın', 'neredeyse hepsini yakaladı')
        : l.hitRate >= 0.7
          ? v('çoğunu yakaladın', 'çoğunu yakaladı')
          : l.hitRate > 0.3
            ? v('bir kısmını yakaladın, bir kısmını kaçırdın', 'bir kısmını yakaladı, bir kısmını kaçırdı')
            : l.hits > 0
              ? v('çoğunu kaçırdın', 'çoğunu kaçırdı')
              : v('hiçbirini yakalamadın', 'hiçbirini yakalamadı');
  const pressed =
    l.falseAlarms === 0
      ? v('aynı olmayanlarda ise hiç basmadın', 'aynı olmayanlarda ise hiç basmadı')
      : l.falseAlarmRate <= 0.1
        ? v('aynı olmayanlarda ise nadiren bastın', 'aynı olmayanlarda ise nadiren bastı')
        : l.falseAlarmRate <= 0.25
          ? v('aynı olmayanlarda da ara sıra bastın', 'aynı olmayanlarda da ara sıra bastı')
          : l.falseAlarmRate <= NBACK_RANDOM_FA
            ? v('aynı olmayanlarda da sık sık bastın', 'aynı olmayanlarda da sık sık bastı')
            : v('aynı olmayanların çoğunda da bastın', 'aynı olmayanların çoğunda da bastı');
  const first = you ? `${ref.charAt(0).toLocaleUpperCase('tr-TR')}${ref.slice(1)} harflerin ${caught}; ${pressed}.` : `Çocuğunuz ${ref} harflerin ${caught}; ${pressed}.`;

  const pattern = nBackPattern(l);
  const hard = l.n === 2 ? 'İki geri görevin en zor bölümüdür. ' : '';
  const here = l.n === 1 ? 'Bu bölümde' : 'Bu bölümlerde';
  let second: string;
  if (pattern === 'random') {
    second = v(
      'Aynı olmayan harflerin çoğunda da bastığın için bu sonuç, aynı harfleri ayırt edebildiğini göstermez: düğmeye harfe bakmadan basmış ya da kuralı karıştırmış olabilirsin. Bu sonuç tek başına bir şey söylemez.',
      'Aynı olmayan harflerin çoğunda da bastığı için bu sonuç, aynı harfleri ayırt edebildiğini göstermez: düğmeye harfe bakmadan basılmış ya da kural karıştırılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  } else if (l.pr >= NBACK_PR.good) {
    second =
      l.n === 1
        ? v(
            'Az önce gördüğün harfi aklında tutup yeni gelenle karşılaştırmayı rahatça yaptın.',
            'Az önce gördüğü harfi akılda tutup yeni gelen harfle karşılaştırmayı rahatça yaptı.',
          )
        : v(
            'Son iki harfi aklında tutup her yeni harfte güncellemek zordur; bunu rahatça yaptın.',
            'Son iki harfi akılda tutup her yeni harfte güncellemek zordur; çocuğunuz bunu rahatça yaptı.',
          );
  } else if (l.pr >= NBACK_PR.fair) {
    second =
      (l.n === 1
        ? v('Bu, görevi büyük ölçüde doğru yaptığını gösterir.', 'Bu, görevin büyük ölçüde doğru yapıldığını gösterir.')
        : v(
            'İki geri çoğu kişi için zordur: son iki harfi aklında tutup her yeni harfte güncellemek gerekir. Bunu büyük ölçüde başardın.',
            'İki geri çoğu kişi için zordur: son iki harfi akılda tutup her yeni harfte güncellemek gerekir. Çocuğunuz bunu büyük ölçüde başardı.',
          )) +
      (l.falseAlarmRate > 0.25
        ? v(
            ' Aynı olmayanlarda daha az basmak için acele etmeden, harfi karşılaştırıp öyle basmak işine yarar.',
            ' Aynı olmayan harflerde basmak, acele etmekten kaynaklanabilir.',
          )
        : l.n === 1
          ? v(' Ara sıra yanılmak çok normaldir.', ' Ara sıra yanılmak olağandır.')
          : '');
  } else if (l.pr >= NBACK_PR.low) {
    second =
      hard +
      (pattern === 'misses'
        ? v(
            'Aynı harfleri yakalamakta zaman zaman zorlandın. Bu; dikkatin zaman zaman dağılmasından, yorgunluktan ya da kuralı karıştırmaktan kaynaklanabilir.',
            'Aynı harfleri yakalamakta zaman zaman zorlandı. Bu; dikkatin zaman zaman dağılmasından, yorgunluktan ya da kuralın karıştırılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.',
          )
        : v(
            'Aynı harfleri aynı olmayanlardan ayırmakta zaman zaman zorlandın. Bu; acele etmekten, dikkatin dağılmasından ya da kuralı karıştırmaktan kaynaklanabilir.',
            'Aynı harfleri aynı olmayanlardan ayırmakta zaman zaman zorlandı. Bu; acele etmekten, dikkatin dağılmasından ya da kuralın karıştırılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.',
          ));
  } else {
    second =
      hard +
      (pattern === 'misses'
        ? v(
            `${here} aynı harfleri yakalamakta zorlandın. Bu; yönergeyi tam anlamamaktan, dikkatin dağılmasından ya da yorgunluktan kaynaklanabilir; tek başına bir şey söylemez.`,
            `${here} aynı harfleri yakalamakta zorlandı. Bu; yönergenin tam anlaşılmamasından, dikkatin dağılmasından ya da yorgunluktan kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
          )
        : v(
            `${here} aynı harfleri aynı olmayanlardan ayırmakta zorlandın. Bu; yönergeyi tam anlamamaktan, acele etmekten ya da dikkatin dağılmasından kaynaklanabilir; tek başına bir şey söylemez.`,
            `${here} aynı harfleri aynı olmayanlardan ayırmakta zorlandı. Bu; yönergenin tam anlaşılmamasından, acele etmekten ya da dikkatin dağılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
          ));
  }
  if (l.n === 2 && pattern !== 'random' && l.lureFalseAlarms >= 2) {
    second += v(
      ' Bir önceki harfle aynı olan (ama iki önceki harfle aynı olmayan) harflerde de birkaç kez bastın; bu harfler tanıdık geldiği için yanıltıcıdır.',
      ' Bir önceki harfle aynı olan (ama iki önceki harfle aynı olmayan) harflerde de birkaç kez bastı; bu harfler tanıdık geldiği için yanıltıcıdır.',
    );
  }
  // Düzeyin bir bölümünde hiç basılmadıysa birleşik sonuç kişiyi tam yansıtmaz.
  for (const b of blocks.filter((x) => x.n === l.n && nBackSilent(x))) {
    const which = NBACK_ORDINALS[b.index] ?? `${b.index + 1}.`;
    second += v(
      ` ${which.charAt(0).toLocaleUpperCase('tr-TR')}${which.slice(1)} bölümde hiç basmadın; bu bölümü yarıda bırakmış olabilirsin. Bu yüzden bu sonuç seni tam yansıtmayabilir.`,
      ` Çocuğunuz ${which} bölümde hiç basmadı; bu bölüm yarıda bırakılmış olabilir. Bu yüzden bu sonuç onu tam yansıtmayabilir.`,
    );
  }
  return { ...card(key), headline, detail, text: `${first} ${second}` };
}

/** "Zorluk artınca" kartı: bir geriden iki geriye ayırt etme puanı nasıl değişti? Güvenilmeyen durumlarda karşılaştırılmaz. */
function nBackLoadBlock(r: NBackResult, audience: Audience, card: CardOf): CognitiveBlock {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const one = r.levels.find((l) => l.n === 1)!;
  const two = r.levels.find((l) => l.n === 2)!;
  const no = (text: string): CognitiveBlock => ({ ...card('gh_yuk'), headline: 'Karşılaştırılamadı', text });
  if (nBackSilent(one) && nBackSilent(two)) return no('Hiçbir bölümde basılmadığı için bir geri ile iki geri karşılaştırılamadı.');
  if (r.blocks.some(nBackSilent)) return no('Bölümlerden birinde hiç basılmadığı için bir geri ile iki geri karşılaştırılamadı.');
  if (one.falseAlarmRate > NBACK_RANDOM_FA || two.falseAlarmRate > NBACK_RANDOM_FA) {
    return no(
      v(
        'Bölümlerden birinde aynı olmayan harflerin çoğunda da bastığın için bir geri ile iki geriyi karşılaştırmak anlamlı değil.',
        'Bölümlerden birinde aynı olmayan harflerin çoğunda da basıldığı için bir geri ile iki geriyi karşılaştırmak anlamlı değildir.',
      ),
    );
  }
  if (nBackKeptOneBack(two)) {
    return no(
      v(
        'İki geri bölümlerinde bir geri kuralına göre basmaya devam etmiş olabileceğin için bir geri ile iki geriyi karşılaştırmak anlamlı değil.',
        'İki geri bölümlerinde bir geri kuralına göre basılmaya devam edilmiş olabileceği için bir geri ile iki geriyi karşılaştırmak anlamlı değildir.',
      ),
    );
  }
  if (one.pr < NBACK_PR.low) {
    return no(
      v(
        'Bir geri bölümünde zorlandığın için bir geri ile iki geriyi karşılaştırmak anlamlı değil.',
        'Bir geri bölümünde zorlandığı için bir geri ile iki geriyi karşılaştırmak anlamlı değildir.',
      ),
    );
  }
  const s1 = nBackScore(one);
  const s2 = nBackScore(two);
  const drop = s1 - s2;
  const how =
    'Ayırt etme puanı, aynı harfleri yakalama oranından aynı olmayanlarda basma oranı çıkarılarak hesaplanır: hiç yanılmayan biri 100, rastgele basan ya da hiç basmayan biri 0 civarında alır.';
  const [headline, text] =
    drop >= NBACK_DROP.clear
      ? [
          'İki geride belirgin düşüş',
          v(
            'Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun belirgin biçimde düştü. Bu çoğu kişide görülür: iki geri, çalışma belleğini çok daha fazla zorlar. Düşüşün büyüklüğü, ek yükün senin için ne kadar zorlayıcı olduğunu gösterir; bu fark bir seferden ötekine değişebilir.',
            'Akılda tutulacak harf sayısı birden ikiye çıkınca çocuğunuzun sonucu belirgin biçimde düştü. Bu çoğu kişide görülür: iki geri, çalışma belleğini çok daha fazla zorlar. Düşüşün büyüklüğü, ek yükün ne kadar zorlayıcı olduğunu gösterir; tek bir uygulamada bu farkın kesinliği düşüktür ve tek başına yorumlanmamalıdır.',
          ),
        ]
      : drop >= NBACK_DROP.some
        ? [
            'İki geride biraz düşüş',
            v(
              'Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun biraz düştü. Bu beklenen bir durumdur: iki geri, bir geriden daha zordur. Bu fark bir seferden ötekine değişebilir.',
              'Akılda tutulacak harf sayısı birden ikiye çıkınca çocuğunuzun sonucu biraz düştü. Bu beklenen bir durumdur: iki geri, bir geriden daha zordur. Tek bir uygulamada bu farkın kesinliği düşüktür.',
            ),
          ]
        : drop > -NBACK_DROP.higher
          ? [
              'Belirgin bir fark yok',
              v(
                'Bir geride ve iki geride benzer sonuç aldın: akılda tutulacak harf sayısının artması, sonucunu belirgin biçimde değiştirmedi. Genellikle iki geride sonuç biraz düşer; bu fark bir seferden ötekine değişebilir.',
                'Çocuğunuz bir geride ve iki geride benzer sonuç aldı: akılda tutulacak harf sayısının artması, sonucunu belirgin biçimde değiştirmedi. Genellikle iki geride sonuç biraz düşer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            ]
          : [
              'İki geride daha yüksek',
              v(
                'İki geride bir geriden daha yüksek sonuç aldın; genellikle bunun tersi olur. Bir geri görevin ilk bölümüydü: sonrasında göreve alışmış olabilirsin ya da bir geride dikkatin dağılmış olabilir. Bu fark bir seferden ötekine değişebilir.',
                'Çocuğunuz iki geride bir geriden daha yüksek sonuç aldı; genellikle bunun tersi olur. Göreve alışma etkisi (bir geri görevin ilk bölümüydü) ya da bir geri bölümündeki bir dikkat dağınıklığı bu sonucu açıklayabilir. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            ];
  return {
    ...card('gh_yuk'),
    headline,
    detail: `Ayırt etme puanı bir geride ${s1}, iki geride ${s2} (100 üzerinden)`,
    text: `${text} ${how}`,
  };
}

/** Geriye dönük hatırlamanın üç sonuç kartı: bir geri, iki geri ve zorluk artınca sonucun nasıl değiştiği. */
function nBackBlocks(r: NBackResult, audience: Audience, card: CardOf): TaskReport {
  const one = r.levels.find((l) => l.n === 1)!;
  const two = r.levels.find((l) => l.n === 2)!;
  const row = (l: NBackLevelResult, label: string) => [
    { label: `${label}: aynıları yakalama`, value: Math.round(l.hitRate * 100), max: 100, valueLabel: pct(l.hitRate) },
    { label: `${label}: aynı olmayanlarda basmama`, value: Math.round((1 - l.falseAlarmRate) * 100), max: 100, valueLabel: pct(1 - l.falseAlarmRate) },
  ];
  const silentNote = r.levels.some(nBackSilent)
    ? ' Hiç basılmayan bir düzeyde “aynı olmayanlarda basmama” %100 görünür; bu oran tek başına bir şey söylemez.'
    : '';
  return {
    blocks: [nBackLevelBlock(one, r.blocks, audience, card), nBackLevelBlock(two, r.blocks, audience, card), nBackLoadBlock(r, audience, card)],
    chart: {
      title: 'Bir geri ve iki geri',
      note: `Çubuklar, aynı harfleri yakalama ve aynı olmayan harflerde basmadan geçme oranlarını gösterir.${silentNote}`,
      rows: [...row(one, 'Bir geri'), ...row(two, 'İki geri')],
    },
  };
}

/** Zihinde döndürmede az ve çok döndürülmüş şekillerdeki karar süreleri bu kadardan (ms) az farklıysa "belirgin değil" sayılır. */
const ROTATION_COST_MIN_MS = 250;
/** Çok döndürülmüş (135–180°) şekillerde doğruluk bunun altındaysa oradaki karar süreleri tahmine dayanabilir: karşılaştırılmaz. */
const ROTATION_LARGE_MIN_ACC = 0.65;

/** Zihinde döndürmenin üç sonuç kartı: doğru cevaplar, karar süresi ve döndürme etkisi. */
function mentalRotationBlocks(r: RotationResult, task: MentalRotationTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const limit = nf0.format(task.timeoutMs / 1000);
  const abandoned = r.timeouts > r.n / 2;
  const low = r.accuracy < 0.6;
  const errors = r.n - r.correct;
  const wrong = r.sameSaidMirror + r.mirrorSaidSame;
  const missed = r.timeouts + r.anticipations;
  const mostlyMissed = errors > 0 && missed > errors / 2;
  // Doğru sayılmayan denemelerin çoğu süre aşımı ya da çok erken basışsa hangisi olduğu söylenir; ikisi de tek başına
  // çoğunluk değilse ("karışık") ikisi birlikte söylenir.
  const missedKind = r.timeouts > errors / 2 ? 'timeouts' : r.anticipations > errors / 2 ? 'early' : 'mixed';
  // Doğruluk düşükken yanlış cevaplar doğrulardan çoksa düğmeler karıştırılmış olabilir (rastgele basan biri yarısını bulur).
  const reversed = low && !mostlyMissed && r.accuracy < 0.4 && wrong > r.correct;

  let accText: string;
  if (abandoned) {
    accText = v(
      'Görevde denemelerin çoğunda süre içinde cevap vermedin; görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin. Bu sonuç tek başına bir şey söylemez.',
      'Çocuğunuz denemelerin çoğunda süre içinde cevap vermedi; görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir. Bu sonuç yorumlanmamalıdır.',
    );
  } else if (low && mostlyMissed) {
    accText =
      missedKind === 'timeouts'
        ? v(
            `Görevde denemelerin birçoğunda süre (${limit} saniye) dolmadan cevap vermedin; doğru cevaplar bu yüzden az. Şekilleri karşılaştırmak uzun sürmüş ya da yönergeyi tam anlamamış olabilirsin. Bu sonuç tek başına bir şey söylemez.`,
            `Çocuğunuz denemelerin birçoğunda süre (${limit} saniye) dolmadan cevap vermedi; doğru cevaplar bu yüzden az. Şekilleri karşılaştırmak uzun sürmüş ya da yönerge tam anlaşılmamış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
          )
        : missedKind === 'early'
          ? v(
              'Görevde denemelerin birçoğunda şekillere bakmadan, çok erken bastın; doğru cevaplar bu yüzden az. Acele etmeden, önce iki şekli karşılaştırıp öyle basmak işine yarar.',
              'Çocuğunuz denemelerin birçoğunda şekillere bakmadan, çok erken bastı; doğru cevaplar bu yüzden az. Bu sonuç tek başına yorumlanmamalıdır.',
            )
          : v(
              `Görevde doğru sayılmayan denemelerin çoğunda ya süre (${limit} saniye) dolmadan cevap vermedin ya da şekillere bakmadan, çok erken bastın; doğru cevaplar bu yüzden az. Bu sonuç tek başına bir şey söylemez.`,
              `Çocuğunuz doğru sayılmayan denemelerin çoğunda ya süre (${limit} saniye) dolmadan cevap vermedi ya da şekillere bakmadan, çok erken bastı; doğru cevaplar bu yüzden az. Bu sonuç tek başına yorumlanmamalıdır.`,
            );
  } else if (reversed) {
    accText = v(
      'Cevaplarının çoğu yanlıştı: “Aynı” ile “Ayna görüntüsü” düğmelerini birbirine karıştırmış olabilirsin. Bu sonuç tek başına bir şey söylemez.',
      'Çocuğunuzun cevaplarının çoğu yanlıştı: “Aynı” ile “Ayna görüntüsü” düğmeleri birbirine karıştırılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  } else if (low) {
    accText = v(
      'Şekilleri karşılaştırmakta zorlandın: bu görevde rastgele basan biri de yaklaşık yarısını doğru bulur. Bu; yönergeyi tam anlamamaktan, acele etmekten ya da dikkatin dağılmasından kaynaklanabilir; tek başına bir şey söylemez.',
      'Çocuğunuz şekilleri karşılaştırmakta zorlandı: bu görevde rastgele basan biri de yaklaşık yarısını doğru bulur. Bu; yönergenin tam anlaşılmamasından, acele etmekten ya da dikkatin dağılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.',
    );
  } else {
    accText =
      r.accuracy === 1
        ? v('Şekillerin aynı mı yoksa ayna görüntüsü mü olduğunu her seferinde doğru buldun.', 'Çocuğunuz şekillerin aynı mı yoksa ayna görüntüsü mü olduğunu her seferinde doğru buldu.')
        : r.accuracy >= 0.9
          ? v(
              'Şekillerin aynı mı yoksa ayna görüntüsü mü olduğunu neredeyse her seferinde doğru buldun.',
              'Çocuğunuz şekillerin aynı mı yoksa ayna görüntüsü mü olduğunu neredeyse her seferinde doğru buldu.',
            )
          : r.accuracy >= 0.75
            ? v(
                'Şekillerin aynı mı yoksa ayna görüntüsü mü olduğunu çoğu zaman doğru buldun.',
                'Çocuğunuz şekillerin aynı mı yoksa ayna görüntüsü mü olduğunu çoğu zaman doğru buldu.',
              )
            : v('Şekilleri karşılaştırmakta zaman zaman zorlandın.', 'Çocuğunuz şekilleri karşılaştırmakta zaman zaman zorlandı.');
    // Doğru sayılmayan denemelerin türü: süre aşımı ya da çok erken basış mı, yanlış cevap mı? Yanlış cevaplar çoğunlukla
    // bir türdeyse (ayna görüntüsüne "Aynı" ya da aynı şekle "Ayna görüntüsü") bu söylenir.
    if (errors > 0) {
      if (mostlyMissed) {
        accText +=
          missedKind === 'timeouts'
            ? v(
                ` Doğru sayılmayan denemelerin çoğunda süre (${limit} saniye) dolmadan cevap vermedin: bazı şekilleri karşılaştırmak uzun sürmüş olabilir.`,
                ` Doğru sayılmayan denemelerin çoğunda süre (${limit} saniye) dolmadan cevap vermedi: bazı şekilleri karşılaştırmak uzun sürmüş olabilir.`,
              )
            : missedKind === 'early'
              ? v(' Doğru sayılmayan denemelerin çoğunda şekillere bakmadan, çok erken bastın.', ' Doğru sayılmayan denemelerin çoğunda şekillere bakmadan, çok erken bastı.')
              : v(
                  ` Doğru sayılmayan denemelerin çoğunda ya süre (${limit} saniye) dolmadan cevap vermedin ya da şekillere bakmadan, çok erken bastın.`,
                  ` Doğru sayılmayan denemelerin çoğunda ya süre (${limit} saniye) dolmadan cevap vermedi ya da şekillere bakmadan, çok erken bastı.`,
                );
      } else if (r.mirrorSaidSame >= 3 && r.mirrorSaidSame >= 2 * r.sameSaidMirror) {
        accText += v(
          ' Yanıldığın denemelerin çoğunda ayna görüntüsüne “Aynı” dedin: ayna görüntüsünü fark etmek için şekli dikkatle döndürüp karşılaştırmak gerekir.',
          ' Yanıldığı denemelerin çoğunda ayna görüntüsüne “Aynı” dedi; ayna görüntüsünü fark etmek, şekli dikkatle döndürüp karşılaştırmayı gerektirir.',
        );
      } else if (r.sameSaidMirror >= 3 && r.sameSaidMirror >= 2 * r.mirrorSaidSame) {
        const large = r.sameSaidMirrorLarge > r.sameSaidMirror / 2;
        accText += v(
          ` Yanıldığın denemelerin çoğunda aynı şekle “Ayna görüntüsü” dedin${large ? '; bunların çoğu çok döndürülmüş şekillerdeydi. Çok döndürülmüş bir şekli tanımak daha zordur.' : '.'}`,
          ` Yanıldığı denemelerin çoğunda aynı şekle “Ayna görüntüsü” dedi${large ? '; bunların çoğu çok döndürülmüş şekillerdeydi. Çok döndürülmüş bir şekli tanımak daha zordur.' : '.'}`,
        );
      } else if (wrong > 0) {
        accText += v(' Bazı denemelerde yanıldın.', ' Bazı denemelerde yanıldı.');
      }
      if (r.accuracy < 0.75 && !mostlyMissed) {
        accText += v(
          ' Bu; acele etmekten, dikkatin dağılmasından ya da şekli zihinde döndürmenin zor gelmesinden kaynaklanabilir.',
          ' Bu; acele etmekten, dikkatin dağılmasından ya da şekli zihinde döndürmenin zor gelmesinden kaynaklanabilir ve tek başına yorumlanmamalıdır.',
        );
      }
    }
  }
  const dogruluk: CognitiveBlock = {
    ...card('zd_dogruluk'),
    headline: `${pct(r.accuracy)} doğru`,
    detail: `Aynı şekillerde ${pct(r.accSame)}, ayna görüntülerinde ${pct(r.accMirror)} doğru`,
    text: accText,
  };

  // Görev yarıda bırakıldıysa ya da doğru cevaplar azsa süreler yorumlanmaz; grafikte de gösterilmez.
  const usable = !abandoned && !low && r.medianRt !== null;
  const hiz: CognitiveBlock =
    r.medianRt === null || abandoned || low
      ? {
          ...card('zd_hiz'),
          headline: 'Hesaplanamadı',
          text: abandoned
            ? 'Denemelerin çoğunda süre içinde cevap verilmediği için karar süresi yorumlanmadı.'
            : low
              ? 'Doğru cevaplar yarıya yakın ya da daha az olduğu için karar süresi yorumlanmadı.'
              : v(
                  'Doğru bulduğun aynı şekiller yeterince çok olmadığı için karar süren hesaplanamadı.',
                  'Doğru bulunan aynı şekiller yeterince çok olmadığı için karar süresi hesaplanamadı.',
                ),
        }
      : {
          ...card('zd_hiz'),
          headline: `Tipik karar süresi ${sn(r.medianRt)} saniye`,
          text: v(
            `Doğru bulduğun aynı şekillerde karar vermen tipik olarak ${sn(r.medianRt)} saniye sürdü. Hız tek başına iyi ya da kötü değildir; önemli olan, doğru karar verebilmektir.`,
            `Çocuğunuzun doğru bulduğu aynı şekillerde tipik karar süresi ${sn(r.medianRt)} saniye oldu. Bu süre; şekilleri görmeyi, karşılaştırmayı ve düğmeye basmayı içerir; yaşla ve kullanılan cihazla (dokunmatik ekran, fare ya da klavye) değişir. Hız, doğrulukla birlikte değerlendirilmelidir.`,
          ),
        };

  // Süreler raporda saniyenin yüzde biri (10 ms) duyarlılığıyla yazılır; fark da yuvarlanmış sürelerden hesaplanır.
  const to10 = (ms: number | null) => (ms === null ? null : Math.round(ms / 10) * 10);
  const small = to10(r.rtSmall);
  const large = to10(r.rtLarge);
  const bigAngles = r.byAngle.filter((a) => a.angle >= 135);
  const accLarge = bigAngles.reduce((s, a) => s + a.correct, 0) / Math.max(1, bigAngles.reduce((s, a) => s + a.n, 0));
  const no = (text: string): CognitiveBlock => ({ ...card('zd_aci'), headline: 'Karşılaştırılamadı', text });
  let aci: CognitiveBlock;
  if (abandoned) {
    aci = no('Denemelerin çoğunda süre içinde cevap verilmediği için karar süreleri karşılaştırılmadı.');
  } else if (low) {
    aci = no('Doğru cevaplar yarıya yakın ya da daha az olduğu için karar süreleri karşılaştırılmadı.');
  } else if (accLarge < ROTATION_LARGE_MIN_ACC) {
    aci = no('Çok döndürülmüş şekillerde doğru cevaplar az olduğu için karar süreleri karşılaştırılmadı.');
  } else if (small === null || large === null) {
    aci = no('Az ya da çok döndürülmüş aynı şekillerde yeterince doğru cevap olmadığı için karşılaştırma yapılamadı.');
  } else {
    const diff = large - small;
    const detail = `Az döndürülmüş (0–45°) ${sn(small)} sn · çok döndürülmüş (135–180°) ${sn(large)} sn`;
    aci =
      diff >= ROTATION_COST_MIN_MS
        ? {
            ...card('zd_aci'),
            headline: `Çok döndürülmüş şekillerde ${sn(diff)} sn daha uzun`,
            detail,
            text: v(
              'Şekil daha çok döndürülmüşken karar vermen daha uzun sürdü. Bu çoğu kişide görülür: şekil ne kadar çok döndürülmüşse onu zihinde döndürüp karşılaştırmak o kadar uzun sürer. Bu fark bir seferden ötekine değişebilir.',
              'Şekil daha çok döndürülmüşken çocuğunuzun kararı daha uzun sürdü. Bu, zihinsel döndürmenin bilinen bir özelliğidir: karar süresi, iki şekil arasındaki açı büyüdükçe uzar (Shepard ve Metzler, 1971). Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.',
            ),
          }
        : diff > -ROTATION_COST_MIN_MS
          ? {
              ...card('zd_aci'),
              headline: 'Belirgin bir fark yok',
              detail,
              text: v(
                'Az ve çok döndürülmüş şekillerde karar süren belirgin biçimde farklı değildi. Genellikle şekil daha çok döndürüldüğünde karar daha uzun sürer; bu fark bir seferden ötekine değişebilir.',
                'Az ve çok döndürülmüş şekillerde çocuğunuzun karar süresi belirgin biçimde farklı değildi. Genellikle şekil daha çok döndürüldüğünde karar daha uzun sürer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            }
          : {
              ...card('zd_aci'),
              headline: 'Çok döndürülmüş şekillerde daha kısa',
              detail,
              text: v(
                'Çok döndürülmüş şekillerde karar vermen, az döndürülmüş şekillerdekinden daha kısa sürdü; genellikle bunun tersi olur. Bu fark bir seferden ötekine değişebilir.',
                'Çok döndürülmüş şekillerde çocuğunuzun kararı, az döndürülmüş şekillerdekinden daha kısa sürdü; genellikle bunun tersi olur. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            };
  }

  const values = r.byAngle.map((a) => (usable ? to10(a.medianRt) : null));
  const max = roundUp(Math.max(0, ...values.map((x) => x ?? 0)), 500);
  const note = abandoned
    ? 'Denemelerin çoğunda süre içinde cevap verilmediği için açılara göre süreler gösterilmedi.'
    : low
      ? 'Doğru cevaplar yarıya yakın ya da daha az olduğu için açılara göre süreler gösterilmedi.'
      : !usable
        ? 'Doğru bulunan aynı şekil sayısı az olduğu için açılara göre süreler gösterilmedi.'
        : v(
        'Çubuklar, doğru bulduğun aynı şekillerdeki tipik karar süresini gösterir; kısa çubuk daha hızlı demek.',
        'Çubuklar, doğru bulunan aynı şekillerdeki tipik (ortanca) karar süresini gösterir; kısa çubuk daha hızlı demektir.',
      ) + (values.some((x) => x === null) ? ' “Yetersiz”: o açıda doğru bulunan aynı şekil sayısı yetersiz.' : '');
  return {
    blocks: [dogruluk, hiz, aci],
    chart: {
      title: 'Döndürme açısına göre tipik karar süresi',
      note,
      rows: r.byAngle.map((a, i) => ({
        label: a.angle === 0 ? '0° (döndürülmemiş)' : `${a.angle}°`,
        value: values[i] ?? 0,
        max,
        valueLabel: values[i] === null ? 'yetersiz' : `${sn(values[i] as number)} sn`,
      })),
    },
  };
}

/** Tepki hızında seçmeli ile basit bölümün tipik süreleri bu kadardan (ms) az farklıysa "belirgin değil" sayılır. */
const REACTION_COST_MIN_MS = 50;

/**
 * Bir bölümün durumu; kartlar, grafik ve seçimin etkisi buna göre yazılır. Sıra ve eşikler, uyarılarla
 * (lib/scoring/tasks.ts, taskQualityNotes) aynıdır: önce süre aşımı ve çok erken basış (tek tek ve birlikte), sonra
 * (seçmeli bölümde) öteki taraftaki ya da hep aynı düğmeye basma, en son yeterli doğru tepki olup olmadığı.
 */
type ReactionStatus = 'ok' | 'missed' | 'early' | 'mixed' | 'reversed' | 'oneSide' | 'chance' | 'errors' | 'few';

function reactionStatus(p: ReactionPartResult): ReactionStatus {
  if (p.misses > p.n / 2) return 'missed';
  if (p.early > p.n / 2) return 'early';
  if (p.early + p.misses > p.n / 2) return 'mixed';
  if (p.key === 'choice' && p.answered >= REACTION_MIN_VALID) {
    const acc = p.correct / p.answered;
    const left = p.left / p.answered;
    if (acc < 0.4) return 'reversed';
    if (left > 0.85 || left < 0.15) return 'oneSide';
    if (acc < 0.6) return 'chance';
    if (acc < 0.8) return 'errors';
  }
  return p.medianRt === null ? 'few' : 'ok';
}

/** Seçmeli bölümün süresine imlecin düğmeler arasındaki yolu karıştı mı (cevapların en az dörtte biri fareyle)? */
const reactionByMouse = (p: ReactionPartResult) => p.key === 'choice' && p.answered > 0 && p.mouse / p.answered >= REACTION_MOUSE_SHARE;

/** Süreler raporda saniyenin yüzde biri (10 ms) duyarlılığıyla yazılır; fark da yuvarlanmış sürelerden hesaplanır. */
const to10 = (ms: number) => Math.round(ms / 10) * 10;
/** "Kaç denemede": 1 → "birinde", 5 → "5 tanesinde". */
const inHowMany = (k: number) => (k === 1 ? 'birinde' : `${k} tanesinde`);

/** Tepki hızının bir bölümünün kartı: basit ya da seçmeli tepki. */
function reactionPartBlock(p: ReactionPartResult, audience: Audience, card: CardOf): CognitiveBlock {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const choice = p.key === 'choice';
  const base = card(choice ? 'th_secmeli' : 'th_basit');
  const detail = !choice
    ? undefined
    : p.correct === 0
      ? `${p.n} denemenin hiçbirinde dairenin olduğu taraftaki düğmeye basılmadı`
      : `${p.n} denemenin ${p.correct === p.n ? 'hepsinde' : `${p.correct} tanesinde`} dairenin olduğu taraftaki düğmeye basıldı`;
  // Tepki sayılmayan denemelerin sayıları: çok erken, süre aşımı ve (seçmeli bölümde) öteki taraf.
  const counts = (withWrong = true) => {
    const parts: string[] = [];
    if (p.early) parts.push(v(`${inHowMany(p.early)} daire belirmeden ya da belirir belirmez bastın`, `${inHowMany(p.early)} daire belirmeden ya da belirir belirmez bastı`));
    if (p.misses) parts.push(v(`${inHowMany(p.misses)} süre içinde basmadın`, `${inHowMany(p.misses)} süre içinde basmadı`));
    if (withWrong && p.wrong) parts.push(v(`${inHowMany(p.wrong)} öteki taraftaki düğmeye bastın`, `${inHowMany(p.wrong)} öteki taraftaki düğmeye bastı`));
    return parts.join(', ');
  };
  // Süre hesaplandıysa ama güvenilir değilse "yorumlanmadı", hiç hesaplanamadıysa "hesaplanamadı".
  const computed = p.medianRt !== null;
  const headline = computed ? 'Yorumlanmadı' : 'Hesaplanamadı';
  const verdict = v(computed ? 'tepki süren yorumlanmadı' : 'tepki süren hesaplanamadı', computed ? 'tepki süresi yorumlanmadı' : 'tepki süresi hesaplanamadı');
  // Erken basış ve süre aşımları, öteki taraf kartlarına da sayılarla eklenir.
  const extra = p.early || p.misses ? v(` Ayrıca ${p.n} denemenin ${counts(false)}.`, ` Ayrıca ${p.n} denemenin ${counts(false)}.`) : '';
  const no = (text: string): CognitiveBlock => ({ ...base, headline, detail, text });
  switch (reactionStatus(p)) {
    case 'missed':
      return no(
        v(
          `Denemelerin yarısından çoğunda süre içinde basmadın; görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin. Bu yüzden ${verdict}.`,
          `Çocuğunuz denemelerin yarısından çoğunda süre içinde basmadı; görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir. Bu yüzden ${verdict}.`,
        ),
      );
    case 'early':
      return no(
        v(
          `Denemelerin yarısından çoğunda daire belirmeden ya da belirir belirmez bastın; bu yüzden ${verdict}. Daireyi bekleyip, görür görmez basmak gerekir.`,
          `Çocuğunuz denemelerin yarısından çoğunda daire belirmeden ya da belirir belirmez bastı; bu yüzden ${verdict}.`,
        ),
      );
    case 'mixed':
      return no(
        v(
          `Denemelerin yarısından çoğu tepki sayılmadı: ${p.n} denemenin ${counts(false)}. Bu yüzden ${verdict}.`,
          `Denemelerin yarısından çoğu tepki sayılmadı: çocuğunuz ${p.n} denemenin ${counts(false)}. Bu yüzden ${verdict}.`,
        ),
      );
    case 'reversed':
      return no(
        v(
          `Cevaplarının çoğunda dairenin olmadığı taraftaki düğmeye bastın; yönergeyi ters anlamış olabilirsin. Daire hangi taraftaysa o taraftaki düğmeye basmak gerekir. Bu yüzden ${verdict}.${extra}`,
          `Çocuğunuz cevaplarının çoğunda dairenin olmadığı taraftaki düğmeye bastı; yönerge ters anlaşılmış olabilir. Bu yüzden ${verdict}.${extra}`,
        ),
      );
    case 'oneSide':
      return no(
        v(
          `Cevaplarının çoğunda, dairenin hangi tarafta olduğuna bakmadan hep aynı düğmeye bastın. Daire hangi taraftaysa o taraftaki düğmeye basmak gerekir. Bu yüzden ${verdict}.${extra}`,
          `Çocuğunuz cevaplarının çoğunda dairenin hangi tarafta olduğuna bakmadan hep aynı düğmeye bastı; yönerge anlaşılmamış olabilir. Bu yüzden ${verdict}.${extra}`,
        ),
      );
    case 'chance':
      return no(
        v(
          `Cevaplarının ancak yarıya yakınında dairenin olduğu taraftaki düğmeye bastın; rastgele basan biri de yaklaşık yarısını doğru bulur. Bu yüzden ${verdict}. Acele etmeden, daireyi görüp o taraftaki düğmeye basmak gerekir.${extra}`,
          `Çocuğunuz cevaplarının ancak yarıya yakınında dairenin olduğu taraftaki düğmeye bastı; rastgele basan biri de yaklaşık yarısını doğru bulur. Bu yüzden ${verdict}; yönergenin tam anlaşılmaması ya da acele etmek bunun nedeni olabilir.${extra}`,
        ),
      );
    case 'errors':
      return no(
        v(
          `Cevap verdiğin ${p.answered} denemenin ${p.wrong} tanesinde öteki taraftaki düğmeye bastın. Yanlış tarafa bu kadar sık basılınca süre, ne kadar hızlı olduğunu doğru göstermez; bu yüzden ${verdict}. Acele etmiş ya da sol ile sağı karıştırmış olabilirsin.${extra}`,
          `Çocuğunuz cevap verdiği ${p.answered} denemenin ${p.wrong} tanesinde öteki taraftaki düğmeye bastı. Yanlış tarafa bu kadar sık basıldığı için ${verdict}; acele edilmiş ya da sol ile sağ karıştırılmış olabilir.${extra}`,
        ),
      );
    case 'few':
      return no(v(`Tepki süren hesaplanamadı: ${p.n} denemenin ${counts()}.`, `Tepki süresi hesaplanamadı: çocuğunuz ${p.n} denemenin ${counts()}.`));
  }
  const m = sn(to10(p.medianRt as number));
  // Aralığın uçları aşağı ve yukarı yuvarlanır: doğru tepkilerin en az yarısı gerçekten bu aralıktadır.
  const lo = Math.floor((p.midLow as number) / 10) * 10;
  const hi = Math.ceil((p.midHigh as number) / 10) * 10;
  const range = lo === hi ? `${sn(lo)} saniye sürdü` : `${sn(lo)} ile ${sn(hi)} saniye arasındaydı`;
  const excluded = p.early + p.misses + p.wrong;
  const issues = excluded
    ? v(
        ` ${p.n} denemenin ${counts()}; ${excluded === 1 ? 'bu deneme' : 'bu denemeler'} hesaba katılmadı.`,
        ` Çocuğunuz ${p.n} denemenin ${counts()}; ${excluded === 1 ? 'bu deneme' : 'bu denemeler'} hesaba katılmadı.`,
      )
    : '';
  const spread = v(' Bu aralık ne kadar darsa tepkilerin birbirine o kadar yakın demektir.', ' Bu aralığın darlığı, tepkilerin ne kadar tutarlı olduğunu gösterir.');
  const mouse = reactionByMouse(p)
    ? v(
        ' Bu bölümde fareyle bastığın için bu süreye imlecin iki düğme arasındaki yolu da eklendi; bilgisayarda ok tuşlarıyla daha doğru ölçülür.',
        ' Bu bölümde fare kullanıldığı için bu süreye imlecin iki düğme arasındaki yolu da eklendi; bilgisayarda ok tuşlarıyla daha doğru ölçülür.',
      )
    : '';
  const text = choice
    ? v(
        `Dairenin olduğu taraftaki düğmeye basman tipik olarak ${m} saniye sürdü; hesaba katılan tepkilerinin en az yarısı ${range}.${spread}${issues}${mouse} Burada hem hızlı hem doğru olmak önemlidir.`,
        `Çocuğunuzun dairenin olduğu taraftaki düğmeye basması tipik olarak ${m} saniye sürdü; hesaba katılan tepkilerinin en az yarısı ${range}.${spread}${issues}${mouse} Bu süre, basit tepkiye ek olarak hangi düğmeye basılacağını seçmeyi de içerir; hız, doğrulukla birlikte değerlendirilmelidir.`,
      )
    : v(
        `Daire belirince düğmeye basman tipik olarak ${m} saniye sürdü; hesaba katılan tepkilerinin en az yarısı ${range}.${spread}${issues} Hız tek başına iyi ya da kötü değildir; tepki süresi yaşla ve kullanılan cihazla değişir.`,
        `Çocuğunuzun daire belirince düğmeye basması tipik olarak ${m} saniye sürdü; hesaba katılan tepkilerinin en az yarısı ${range}.${spread}${issues} Bu süre, daireyi görmeyi ve düğmeye basmayı içerir; yaşla ve kullanılan cihazla (dokunmatik ekran, fare ya da klavye) değişir. Akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.`,
      );
  return { ...base, headline: `Tipik tepki süresi ${m} saniye`, detail, text };
}

/** Tepki hızının üç sonuç kartı (basit tepki, seçmeli tepki, seçimin etkisi) ve iki bölümün grafiği. */
function reactionBlocks(r: ReactionResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const ss = reactionStatus(r.simple);
  const cs = reactionStatus(r.choice);
  const no = (text: string): CognitiveBlock => ({ ...card('th_fark'), headline: 'Karşılaştırılamadı', text });
  const notOk = (p: ReactionPartResult, where: string) =>
    p.medianRt === null ? `${where} tepki süresi hesaplanamadığı için karşılaştırma yapılamadı.` : `${where} tepki süresi yorumlanmadığı için karşılaştırma yapılmadı.`;
  let fark: CognitiveBlock;
  if (ss !== 'ok') fark = no(notOk(r.simple, 'Basit bölümde'));
  else if (cs === 'reversed' || cs === 'chance' || cs === 'errors') fark = no('Seçmeli bölümde öteki taraftaki düğmeye sık basıldığı için karşılaştırma yapılmadı.');
  else if (cs === 'oneSide') fark = no('Seçmeli bölümde cevapların çoğunda aynı düğmeye basıldığı için karşılaştırma yapılmadı.');
  else if (cs !== 'ok') fark = no(notOk(r.choice, 'Seçmeli bölümde'));
  else if (reactionByMouse(r.choice)) fark = no('Seçmeli bölümde fare kullanıldığı için karşılaştırma yapılmadı: süreye imlecin iki düğme arasındaki yolu da eklendi.');
  else {
    const a = to10(r.simple.medianRt as number);
    const b = to10(r.choice.medianRt as number);
    const diff = b - a;
    const detail = `Basit ${sn(a)} sn · seçmeli ${sn(b)} sn`;
    fark =
      diff >= REACTION_COST_MIN_MS
        ? {
            ...card('th_fark'),
            headline: `Seçmeli bölümde ${sn(diff)} sn daha uzun`,
            detail,
            text: v(
              'İki kutudan hangisinde daire belirdiğine göre seçim yapmak, tepki süreni uzattı. Bu çoğu kişide görülür: seçenek arttıkça tepki vermek daha uzun sürer. Bu fark bir seferden ötekine değişebilir.',
              'Seçmeli bölümde çocuğunuzun tepkisi, basit bölümdekinden daha uzun sürdü. Bu, tepki süresi çalışmalarının bilinen bir bulgusudur: seçenek sayısı arttıkça tepki süresi uzar (Hick, 1952). Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.',
            ),
          }
        : diff > -REACTION_COST_MIN_MS
          ? {
              ...card('th_fark'),
              headline: 'Belirgin bir fark yok',
              detail,
              text: v(
                'Basit ve seçmeli bölümlerde tepki süren belirgin biçimde farklı değildi. Genellikle seçmeli bölümde tepki daha uzun sürer; bu fark bir seferden ötekine değişebilir.',
                'Basit ve seçmeli bölümlerde çocuğunuzun tepki süresi belirgin biçimde farklı değildi. Genellikle seçmeli bölümde tepki daha uzun sürer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            }
          : {
              ...card('th_fark'),
              headline: 'Seçmeli bölümde daha kısa',
              detail,
              text: v(
                'Seçmeli bölümde tepki vermen, basit bölümdekinden daha kısa sürdü; genellikle bunun tersi olur. Bu fark bir seferden ötekine değişebilir.',
                'Seçmeli bölümde çocuğunuzun tepkisi, basit bölümdekinden daha kısa sürdü; genellikle bunun tersi olur. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            };
  }

  // Grafikte yalnızca yorumlanan bölümlerin süresi gösterilir; ötekilerin nedeni kartlarında yazar.
  const parts = [
    { label: 'Basit tepki', p: r.simple, status: ss },
    { label: 'Seçmeli tepki', p: r.choice, status: cs },
  ];
  const values = parts.map(({ p, status }) => (status === 'ok' ? to10(p.medianRt as number) : null));
  const max = roundUp(Math.max(0, ...values.map((x) => x ?? 0)), 250);
  const missing = values.filter((x) => x === null).length;
  const note =
    v('Çubuklar, tipik tepki süreni gösterir; kısa çubuk daha hızlı demek.', 'Çubuklar, tipik (ortanca) tepki süresini gösterir; kısa çubuk daha hızlı demektir.') +
    (missing === 2
      ? ' İki bölümün süresi de yazmıyor; nedeni bölümlerin kartlarında açıklanır.'
      : missing === 1
        ? ' Süresi yazmayan bölümün nedeni, o bölümün kartında açıklanır.'
        : '');
  return {
    blocks: [reactionPartBlock(r.simple, audience, card), reactionPartBlock(r.choice, audience, card), fark],
    chart: {
      title: 'Bölümlere göre tipik tepki süresi',
      note,
      rows: parts.map(({ label, p }, i) => ({
        label,
        value: values[i] ?? 0,
        max,
        valueLabel: values[i] !== null ? `${sn(values[i] as number)} sn` : p.medianRt === null ? 'hesaplanamadı' : 'yorumlanmadı',
      })),
    },
  };
}

/* ---------- Şekil akıl yürütme ---------- */

/** Kural türlerinin adları (raporda ve üç boyutlu grafikte) ve kısa anlatımları. */
export const MATRIX_RULES: Record<MatrixRule, { name: string; plain: string; color: string }> = {
  constant: { name: 'Değişmeyen özellik', plain: 'satır boyunca aynı kalan özelliği fark etmek', color: '#0e9c8c' },
  progression: { name: 'Düzenli değişim', plain: 'sayının, büyüklüğün, yönün ya da yerin adım adım değiştiğini görmek', color: '#2f5ce0' },
  distribution: { name: 'Üçlü dağılım', plain: 'üç farklı şeklin ya da rengin her satırda birer kez yer aldığını görmek', color: '#7a4ee6' },
  addition: { name: 'Ekleme ve çıkarma', plain: 'üçüncü parçanın ilk iki parçanın birleşimi, toplamı ya da farkı olduğunu görmek', color: '#ee6a36' },
  xor: {
    name: 'Ortak olanı silme',
    plain: 'iki parçada da bulunan çizgilerin ya da noktaların silindiğini, yalnızca birinde olanların kaldığını görmek',
    color: '#df4777',
  },
};

/** Süreyi tam saniye (ya da dakika ve saniye) olarak yazar: 23 400 → "23 saniye", 75 000 → "1 dakika 15 saniye", 400 → "bir saniyeden kısa". */
function seconds(ms: number): string {
  if (ms < 500) return 'bir saniyeden kısa';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} saniye`;
  const m = Math.floor(s / 60);
  return s % 60 ? `${m} dakika ${s % 60} saniye` : `${m} dakika`;
}

/** "“Düzenli değişim” ve “üçlü dağılım”" gibi: kural adları tırnak içinde, ilk harfi küçük. */
const ruleList = (rules: MatrixRule[]) =>
  joinTr(rules.map((r) => `“${MATRIX_RULES[r].name.charAt(0).toLocaleLowerCase('tr-TR')}${MATRIX_RULES[r].name.slice(1)}”`));
/** Cümle başı: ilk harf (açılış tırnağından sonra gelse de) büyük. */
const capTr = (x: string) => {
  const i = x.startsWith('“') ? 1 : 0;
  return x.slice(0, i) + x.charAt(i).toLocaleUpperCase('tr-TR') + x.slice(i + 1);
};

/** Şekil akıl yürütmenin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve kural türlerinin üç boyutlu grafiği. */
function matrixBlocks(r: MatrixResult, task: MatrixReasoningTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = r.correct <= MATRIX_CHANCE_MAX;
  const rapid = matrixRapid(r);
  const samePos = matrixSamePosition(r);
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const doubt = rapid || samePos;
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  const easyMissed = first.n - first.correct;
  const higherPassed = r.levels.slice(1).some(passed);
  if (chance) {
    accText = v(
      `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${MATRIX_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da sorulara yeterince bakmadan seçmiş de olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir.`,
      `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${MATRIX_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da sorulara yeterince bakılmadan seçilmiş de olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir.`,
    );
  } else {
    const allHigh = r.levels.every((l) => l.n - l.correct <= 1);
    if (allHigh) {
      accText = v(
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor sorulardaki birden çok kuralı da birlikte izleyebildin.`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz bütün düzeylerde soruların hemen hepsini doğru cevapladı; en zor sorulardaki birden çok kuralı da birlikte izleyebildi.`,
      );
    } else if (easyMissed >= 2 && higherPassed) {
      const which = easyMissed === first.n ? '1. düzeydeki kolay soruların hepsini' : `1. düzeydeki kolay sorulardan ${easyMissed} tanesini`;
      accText = v(
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. ${capTr(which)} yanlış cevapladın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun. Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz ${which} yanlış cevapladı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu. Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
      );
    } else {
      // Kolay (1–2) ve zor (4–5) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const share = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const gap = share(easyLevels) - share(r.levels.filter((l) => l.level >= 4));
      const easySlips = easyLevels.some((l) => l.correct < l.n);
      if (gap >= 0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça doğru cevapların azaldı. Bu beklenen bir durumdur: her düzeyde aynı anda izlenmesi gereken kural sayısı artar ve kurallar zorlaşır.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı. Bu beklenen bir durumdur: her düzeyde aynı anda izlenmesi gereken kural sayısı artar ve kurallar zorlaşır (Carpenter, Just ve Shell, 1990).`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        );
      } else {
        const slip = easySlips ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '';
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Kolay ve zor düzeylerdeki doğru cevapların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuzun kolay ve zor düzeylerdeki doğru cevapları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    if (r.wrong >= MATRIX_NEAR_MIN && r.nearMisses / r.wrong >= MATRIX_NEAR_SHARE) {
      accText += v(
        ` Yanlış cevaplarının ${r.nearMisses === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.nearMisses} tanesinde)`} seçtiğin parça doğru cevaptan yalnızca bir özellikte ayrılıyordu: kuralların çoğunu bulup birini gözden kaçırmış olabilirsin. Cevabı vermeden önce şekli, sayıyı, rengi ve yönü tek tek kontrol etmek işine yarar.`,
        ` Yanlış cevaplarının ${r.nearMisses === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.nearMisses} tanesinde)`} seçtiği parça doğru cevaptan yalnızca bir özellikte ayrılıyordu: kuralların çoğunu bulup birini gözden kaçırmış olabilir. Bu tür sorularda birden çok kuralı aynı anda akılda tutmak gerekir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorulara bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorulara bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('sa_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (chance) {
    duzey = { ...card('sa_duzey'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' };
  } else if (r.reached === 0) {
    duzey = {
      ...card('sa_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi. Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi. Bu; dikkatin dağılmasından, acele etmekten ya da yönergenin tam anlaşılmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
      ),
    };
  } else {
    const def = task.levels.find((l) => l.level === r.reached)!;
    const next = task.levels.find((l) => l.level === r.reached + 1);
    const lower = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1).replace(/\.$/, '');
    const upTo =
      r.reached === 1
        ? v('1. düzeydeki soruların çoğunu doğru cevapladın', 'Çocuğunuz 1. düzeydeki soruların çoğunu doğru cevapladı')
        : v(`${r.reached}. düzeye kadar soruların çoğunu doğru cevapladın`, `Çocuğunuz ${r.reached}. düzeye kadar soruların çoğunu doğru cevapladı`);
    let text = `${upTo}. ${r.reached}. düzeydeki sorularda şu gerekiyordu: ${lower(def.plain)}.`;
    // Alt düzeylerdeki yanlışlar düzeyi düşürmez; daha zor sorular çözüldüğü için dikkatsizlikten kaynaklanmış olabilir.
    const slips = r.levels.filter((l) => l.level < r.reached && !passed(l)).map((l) => `${l.level}.`);
    if (slips.length) {
      text += v(
        ` Daha kolay olan ${joinTr(slips)} düzeyde yaptığın yanlışlar bu sonucu değiştirmedi: daha zor soruları çözebildiğin için bu yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde yaptığı yanlışlar bu sonucu değiştirmedi: daha zor soruları çözebildiği için bu yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
      );
    }
    if (!next) {
      text += v(' Bu en zor düzeydi.', ' Bu, testin en zor düzeyiydi.');
    } else {
      // Bir üst düzeyde soruların çoğu her zaman yanlıştır: o düzeyde en az %60 doğru olsaydı o düzeye ulaşılmış olurdu.
      text += v(
        ` ${next.level}. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
        ` ${next.level}. düzeyde soruların çoğunda zorlandı; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
      );
    }
    duzey = {
      ...card('sa_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki ve o düzeye kadarki soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Kural türleri */
  const ruleLine = r.rules.map((x) => `${MATRIX_RULES[x.rule].name} ${x.correct}/${x.n}`).join(' · ');
  // Kural türlerinde kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.rules.filter(most).map((x) => x.rule);
  const hard = r.rules.filter((x) => !most(x)).map((x) => x.rule);
  // Kural türleri düzeylerle iç içedir (ör. değişmeyen özellik en kolay, ortak olanı silme en zor düzeylerde); bu söylenir.
  const levelsOf = (rule: MatrixRule) => [...new Set(task.items.filter((it) => it.rule === rule).map((it) => it.level))].sort((a, b) => a - b);
  const where = (rule: MatrixRule) => {
    const ls = levelsOf(rule);
    return ls.length === 1 ? `yalnızca ${ls[0]}. düzeyde` : `${joinTr(ls.map((l) => `${l}.`))} düzeylerde`;
  };
  const example = `ör. ${ruleList(['constant'])} soruları ${where('constant')}, ${ruleList(['xor'])} soruları ${where('xor')}`;
  const rough = ` Her kural türü birkaç soruya dayanır ve türler düzeylerle iç içedir (${example}); bu yüzden bu karşılaştırma kaba bir göstergedir.`;
  let kural: CognitiveBlock;
  if (chance) {
    kural = { ...card('sa_kural'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için kural türleri karşılaştırılmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu kuralda ${MATRIX_RULES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${ruleList([x])} kuralında ${MATRIX_RULES[x].plain} gerekir.`)).join(' ');
    const head =
      good.length === r.rules.length
        ? `${r.rules.length} kural türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.rules.length} kural türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.rules.length} kural türünün ${good.length} tanesinde soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.rules.length} kural türünün her birinde soruların çoğunu doğru buldun: hem satır boyunca aynı kalan ya da düzenli değişen özellikleri hem de parçaları birleştirme ve karşılaştırma gerektiren kuralları izleyebildin.`,
        `Çocuğunuz ${r.rules.length} kural türünün her birinde soruların çoğunu doğru buldu: hem satır boyunca aynı kalan ya da düzenli değişen özellikleri hem de parçaları birleştirme ve karşılaştırma gerektiren kuralları izleyebildi.`,
      );
    } else if (good.length === 0) {
      text = v(`Hiçbir kural türünde soruların çoğunu doğru bulamadın. ${needs}`, `Çocuğunuz hiçbir kural türünde soruların çoğunu doğru bulamadı. ${needs}`);
    } else {
      text = v(
        `${ruleList(good)} ${good.length > 1 ? 'kurallarına' : 'kuralına'} dayanan soruların çoğunu doğru buldun; ${ruleList(hard)} ${hard.length > 1 ? 'kurallarında' : 'kuralında'} zorlandın. ${needs}`,
        `Çocuğunuz ${ruleList(good)} ${good.length > 1 ? 'kurallarına' : 'kuralına'} dayanan soruların çoğunu doğru buldu; ${ruleList(hard)} ${hard.length > 1 ? 'kurallarında' : 'kuralında'} zorlandı. ${needs}`,
      );
      if (hard.includes('addition') || hard.includes('xor')) {
        text +=
          audience === 'adult'
            ? ' Parçaları birleştirme ve karşılaştırma gerektiren bu tür kurallar çoğu kişiyi zorlar.'
            : v(
                ' Parçaları birleştirme ve karşılaştırma gerektiren bu tür kurallar yetişkinleri de zorlar.',
                ' Parçaları birleştirme ve karşılaştırma gerektiren bu tür kurallar yetişkinleri de zorlar (Matzen ve ark., 2010).',
              );
      }
    }
    text = capTr(text);
    kural = { ...card('sa_kural'), headline: head, detail: ruleLine, text: text + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`} 2,5 saniyeden kısa sürede cevap verdin. Bu kadar kısa sürede bir tabloyu inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`} 2,5 saniyeden kısa sürede cevap verdi. Bu kadar kısa sürede bir tabloyu inceleyip kuralı bulmak çok zordur; bu sorularda tahmin edilmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; sorulara bakmadan hep aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; sorulara bakılmadan hep aynı yere basılmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
  if (r.medianRt === null) {
    calisma = { ...card('sa_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 4–5. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && r.rtEasy !== null && r.rtHard !== null) {
      const hardAcc = r.levels.filter((l) => l.level >= 4).reduce((a, l) => a + l.correct, 0) / Math.max(1, r.levels.filter((l) => l.level >= 4).reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Zor bir soruda daha uzun düşünmek iyi bir çalışma biçimidir: kuralları tek tek bulmak zaman alır.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Zor bir soruda daha uzun düşünmek iyi bir çalışma biçimidir: kuralları tek tek bulmak zaman alır.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu sorularda doğru cevaplar azdı. Zor sorulara daha çok zaman ayırmak, kuralları tek tek bulmana yardım edebilir.',
          'Çocuğunuz zor sorularda kolay sorulardakinden daha kısa sürede cevap verdi ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; daha çok zaman ayırmak kuralları bulmasına yardım edebilir.',
        );
      } else if (r.rtHard * 1.5 <= r.rtEasy) {
        pace = v(
          'Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.',
          'Çocuğunuz zor sorularda kolay sorulardakinden daha kısa sürede cevap verdi ve bu soruların çoğunu yine doğru buldu.',
        );
      } else {
        pace = v('Kolay ve zor sorularda birbirine yakın sürelerde cevap verdin.', 'Çocuğunuz kolay ve zor sorularda birbirine yakın sürelerde cevap verdi.');
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('sa_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      detail: timesLine,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const sizes = [...new Set(r.levels.map((l) => l.n))].sort((a, b) => a - b).join(' ya da ');
  const chart: CognitiveReport['chart'] = {
    title: 'Düzeylere göre doğru cevaplar',
    note: v(
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${sizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${sizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğu doğru cevaplanmış demektir.`,
    ),
    rows: r.levels.map((l) => ({ label: `${l.level}. düzey`, value: l.correct, max: l.n, valueLabel: `${l.correct}/${l.n}` })),
  };
  const figures = [
    { label: 'Doğru', value: `${r.correct}/${r.n}` },
    chance
      ? { label: 'Ulaşılan düzey', value: 'Yorumlanmadı' }
      : r.reached === 0
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: '1. düzeyde zorlanıldı' }
        : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = chance
    ? undefined
    : {
        title: v('Kural türlerine göre sonucun', 'Kural türlerine göre sonuç'),
        note: v(
          'Her sütun bir kural türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca türleri ayırır.',
          'Her sütun bir kural türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca türleri ayırır.',
        ),
        bars: r.rules.map((x) => ({
          key: x.rule,
          label: MATRIX_RULES[x.rule].name,
          value: Math.round((x.correct / x.n) * 100),
          min: 0,
          max: 100,
          color: MATRIX_RULES[x.rule].color,
          valueLabel: `${x.correct}/${x.n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, duzey, kural, calisma], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Sayı dizileri ---------- */

/** Sayı dizilerinde kural türlerinin adları (raporda ve üç boyutlu grafikte) ve kısa anlatımları. */
export const NUMBER_RULES: Record<NumberSeriesRule, { name: string; plain: string; color: string }> = {
  step: { name: 'Sabit artış ya da azalış', plain: 'her adımda aynı sayının eklendiğini ya da çıkarıldığını görmek', color: '#0e9c8c' },
  ratio: { name: 'Çarpma ve bölme', plain: 'her adımda aynı sayıyla çarpıldığını ya da bölündüğünü görmek', color: '#2f5ce0' },
  growing: { name: 'Değişen artış', plain: 'ardışık sayılar arasındaki farkların her adımda aynı miktarda büyüdüğünü ya da küçüldüğünü görmek', color: '#7a4ee6' },
  alternating: { name: 'İç içe diziler', plain: 'sırayla değişen iki işlemi ya da iç içe geçmiş iki diziyi birbirinden ayırmak', color: '#ee6a36' },
  combined: {
    name: 'Birleşik kurallar',
    plain: 'iki adımlı bir kuralı (ör. “iki katının bir fazlası”) bulmak, her sayının önceki sayıların toplamı olduğunu ya da artışların çarpmayla ya da kare sayılarla ilerlediğini görmek',
    color: '#df4777',
  },
};

/** Doğru cevap bu kadar ya da daha azsa kural türleri karşılaştırılmaz ve üç boyutlu grafik çizilmez. */
export const NUMBER_FEW_MAX = 2;

const numberRuleList = (rules: NumberSeriesRule[]) =>
  joinTr(rules.map((r) => `“${NUMBER_RULES[r].name.charAt(0).toLocaleLowerCase('tr-TR')}${NUMBER_RULES[r].name.slice(1)}”`));

/** Sayı dizilerinin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve kural türlerinin üç boyutlu grafiği. */
function numberSeriesBlocks(r: NumberSeriesResult, task: NumberSeriesTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const few = r.correct <= NUMBER_FEW_MAX;
  const skippedMost = numberSeriesMostlySkipped(r);
  const rapid = numberSeriesRapid(r);
  const same = numberSeriesSameAnswer(r);
  const doubt = rapid || same;
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);
  /** "hepsinde", "yarısında (6 yanlışın 3 tanesinde)" ya da "çoğunda (6 yanlışın 4 tanesinde)". */
  const share = (k: number, of: number) =>
    k === of ? 'hepsinde' : `${k * 2 === of ? 'yarısında' : 'çoğunda'} (${of} yanlışın ${k} tanesinde)`;

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  if (few) {
    const how =
      r.correct === 0
        ? v(`${r.n} sorunun hiçbirinde eksik sayıyı doğru bulamadın.`, `Çocuğunuz ${r.n} sorunun hiçbirinde eksik sayıyı doğru bulamadı.`)
        : v(`${r.n} sorudan yalnızca ${r.correct} tanesinde eksik sayıyı doğru buldun.`, `Çocuğunuz ${r.n} sorudan yalnızca ${r.correct} tanesinde eksik sayıyı doğru buldu.`);
    const inMost = r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda';
    const why = skippedMost
      ? v(
          ` ${inMost} “Bilmiyorum” dedin: sorular sana çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilirsin.`,
          ` ${inMost} “Bilmiyorum” dedi: sorular ona çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilir.`,
        )
      : v(
          ' Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da sorulara yeterince bakmadan cevap yazmış da olabilirsin.',
          ' Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da sorulara yeterince bakılmadan cevap yazılmış da olabilir.',
        );
    accText =
      how +
      why +
      v(
        ' Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, yanında kâğıt ve kalemle, acele etmeden yeniden denemek daha doğru bir sonuç verir.',
        ' Bu sonuç tek başına yorumlanmamalıdır; dinlenmiş olduğu bir gün, yanında kâğıt ve kalemle, acele etmeden yeniden denemesi daha doğru bir sonuç verir.',
      );
  } else {
    const easyMissed = first.n - first.correct;
    const higherPassed = r.levels.slice(1).some(passed);
    if (r.levels.every((l) => l.n - l.correct <= 1)) {
      accText = v(
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor sorulardaki birkaç adımlı kuralları da bulabildin.`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz bütün düzeylerde soruların hemen hepsini doğru cevapladı; en zor sorulardaki birkaç adımlı kuralları da bulabildi.`,
      );
    } else if (easyMissed >= 2 && higherPassed) {
      const which = easyMissed === first.n ? '1. düzeydeki kolay soruların hiçbirini' : `1. düzeydeki kolay sorulardan ${easyMissed} tanesini`;
      accText = v(
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun. Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu. Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
      );
    } else {
      // Kolay (1–2) ve zor (4–5) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const rate = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const gap = rate(easyLevels) - rate(r.levels.filter((l) => l.level >= 4));
      if (gap >= 0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça doğru cevapların azaldı. Bu beklenen bir durumdur: üst düzeylerde kurallar zorlaşır ve izlenmesi gereken adım sayısı artar.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı. Bu beklenen bir durumdur: üst düzeylerde kurallar zorlaşır ve izlenmesi gereken adım sayısı artar.`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        );
      } else {
        const slip = easyLevels.some((l) => l.correct < l.n) ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '';
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Kolay ve zor düzeylerdeki doğru cevapların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuzun kolay ve zor düzeylerdeki doğru cevapları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    // Yanlışların türü: dizinin yalnızca bir bölümüne uyan daha basit bir kural ya da doğru cevaba çok yakın bir sayı.
    if (r.wrong >= NUMBER_PATTERN_MIN && r.traps * 2 >= r.wrong) {
      accText += v(
        ` Yanlış cevaplarının ${share(r.traps, r.wrong)} daha basit bir kuralla bulunan bir sayı yazdın: dizinin yalnızca bir bölümüne uyan ya da kuralın bir adımını atlayan bir kural (ör. artışlar büyürken son artışı aynen eklemek, “iki katının bir fazlası” yerine yalnızca iki katını almak ya da iç içe iki dizide öteki dizinin sıradaki sayısını yazmak). Cevabı vermeden önce bulduğun kuralı dizinin bütün sayılarında denemek işine yarar.`,
        ` Çocuğunuz yanlış cevaplarının ${share(r.traps, r.wrong)} daha basit bir kuralla bulunan bir sayı yazdı: dizinin yalnızca bir bölümüne uyan ya da kuralın bir adımını atlayan bir kural (ör. artışlar büyürken son artışı aynen eklemek, “iki katının bir fazlası” yerine yalnızca iki katını almak ya da iç içe iki dizide öteki dizinin sıradaki sayısını yazmak). Bulduğu kuralı dizinin bütün sayılarında denemeden cevap vermiş olabilir.`,
      );
    }
    if (r.wrong >= NUMBER_PATTERN_MIN && r.nearMisses * 2 >= r.wrong) {
      accText += v(
        ` Yanlış cevaplarının ${share(r.nearMisses, r.wrong)} yazdığın sayı doğru cevaba çok yakındı: kuralı bulup hesapta küçük bir kayma yapmış olabilirsin. Cevabı vermeden önce hesabı bir kez daha kontrol etmek işine yarar.`,
        ` Çocuğunuzun yanlış cevaplarının ${share(r.nearMisses, r.wrong)} yazdığı sayı doğru cevaba çok yakındı: kuralı bulup hesapta küçük bir kayma yapmış olabilir.`,
      );
    }
    if (skippedMost) {
      accText += v(
        ' Soruların yarısından çoğunda “Bilmiyorum” dedin: sorular sana çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilirsin.',
        ' Çocuğunuz soruların yarısından çoğunda “Bilmiyorum” dedi: sorular ona çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilir.',
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorulara bakmadan cevap yazmış olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorulara bakılmadan cevap yazılmış olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('sd_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (r.reached === 0) {
    duzey = {
      ...card('sd_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi. ${
          skippedMost
            ? 'Soruların çoğunda “Bilmiyorum” dediğin için bu sonuç tek başına yorumlanmamalıdır.'
            : 'Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.'
        }`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi. ${
          skippedMost
            ? 'Soruların çoğunda “Bilmiyorum” dediği için bu sonuç tek başına yorumlanmamalıdır.'
            : 'Bu; dikkatin dağılmasından, acele etmekten, yönergenin tam anlaşılmamasından ya da toplama ve çıkarmada henüz yeterince rahat olmamaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.'
        }`,
      ),
    };
  } else {
    const def = task.levels.find((l) => l.level === r.reached)!;
    const next = task.levels.find((l) => l.level === r.reached + 1);
    const lower = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1).replace(/\.$/, '');
    const upTo =
      r.reached === 1
        ? v('1. düzeydeki soruların çoğunu doğru cevapladın', 'Çocuğunuz 1. düzeydeki soruların çoğunu doğru cevapladı')
        : v(`${r.reached}. düzeye kadar soruların çoğunu doğru cevapladın`, `Çocuğunuz ${r.reached}. düzeye kadar soruların çoğunu doğru cevapladı`);
    let text = `${upTo}. ${r.reached}. düzeydeki sorularda şu gerekiyordu: ${lower(def.plain)}.`;
    // Alt düzeylerdeki yanlışlar düzeyi düşürmez; daha zor sorular çözüldüğü için dikkatsizlikten kaynaklanmış olabilir.
    const slips = r.levels.filter((l) => l.level < r.reached && !passed(l)).map((l) => `${l.level}.`);
    if (slips.length) {
      text += v(
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi: daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi: daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
      );
    }
    if (!next) {
      text += v(' Bu en zor düzeydi.', ' Bu, testin en zor düzeyiydi.');
    } else {
      // Bir üst düzeyde soruların çoğu her zaman doğru değildir: o düzeyde en az %60 doğru olsaydı o düzeye ulaşılmış olurdu.
      text += v(
        ` ${next.level}. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
        ` ${next.level}. düzeyde soruların çoğunda zorlandı; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
      );
    }
    duzey = {
      ...card('sd_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki ve o düzeye kadarki soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Kural türleri */
  const ruleLine = r.rules.map((x) => `${NUMBER_RULES[x.rule].name} ${x.correct}/${x.n}`).join(' · ');
  // Kural türlerinde kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.rules.filter(most).map((x) => x.rule);
  const hard = r.rules.filter((x) => !most(x)).map((x) => x.rule);
  // Kural türleri düzeylerle iç içedir (ör. sabit artış en kolay, birleşik kurallar en zor düzeylerde); bu söylenir.
  const levelsOf = (rule: NumberSeriesRule) => [...new Set(task.items.filter((it) => it.rule === rule).map((it) => it.level))].sort((a, b) => a - b);
  const where = (rule: NumberSeriesRule) => {
    const ls = levelsOf(rule);
    return ls.length === 1 ? `yalnızca ${ls[0]}. düzeyde` : `${joinTr(ls.map((l) => `${l}.`))} düzeylerde`;
  };
  const example = `ör. ${numberRuleList(['step'])} soruları ${where('step')}, ${numberRuleList(['combined'])} soruları ${where('combined')}`;
  const rough = ` Her kural türü birkaç soruya dayanır ve türler düzeylerle iç içedir (${example}); bu yüzden bu karşılaştırma kaba bir göstergedir.`;
  let kural: CognitiveBlock;
  if (few) {
    kural = { ...card('sd_kural'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için kural türleri karşılaştırılmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu türde ${NUMBER_RULES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${numberRuleList([x])} türünde ${NUMBER_RULES[x].plain} gerekir.`)).join(' ');
    const head =
      good.length === r.rules.length
        ? `${r.rules.length} kural türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.rules.length} kural türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.rules.length} kural türünün ${good.length} tanesinde soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.rules.length} kural türünün her birinde soruların çoğunu doğru buldun: hem tek bir işlemle ilerleyen dizileri hem de iç içe dizileri ve birkaç adımlı kuralları çözebildin.`,
        `Çocuğunuz ${r.rules.length} kural türünün her birinde soruların çoğunu doğru buldu: hem tek bir işlemle ilerleyen dizileri hem de iç içe dizileri ve birkaç adımlı kuralları çözebildi.`,
      );
    } else if (good.length === 0) {
      text = v(`Hiçbir kural türünde soruların çoğunu doğru bulamadın. ${needs}`, `Çocuğunuz hiçbir kural türünde soruların çoğunu doğru bulamadı. ${needs}`);
    } else {
      text = v(
        `${numberRuleList(good)} türündeki soruların çoğunu doğru buldun; ${numberRuleList(hard)} türündeki sorularda zorlandın. ${needs}`,
        `Çocuğunuz ${numberRuleList(good)} türündeki soruların çoğunu doğru buldu; ${numberRuleList(hard)} türündeki sorularda zorlandı. ${needs}`,
      );
    }
    kural = { ...card('sd_kural'), headline: head, detail: ruleLine, text: capTr(text) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  const answered = r.n - r.skipped;
  if (r.skipped > 0) {
    const inWhich = r.skipped === r.n ? 'bütün sorularda' : `${r.skipped} soruda`;
    issues.push(v(`${capTr(inWhich)} “Bilmiyorum” dedin.`, `Çocuğunuz ${inWhich} “Bilmiyorum” dedi.`));
  }
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`;
    issues.push(
      v(
        `3. düzey ve üstündeki sorulardan cevap yazdığın ${r.rapidOf} sorunun ${which} yanlış bir cevabı 2,5 saniyeden kısa sürede yazdın. Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki sorulardan cevap yazdığı ${r.rapidOf} sorunun ${which} yanlış bir cevabı 2,5 saniyeden kısa sürede yazdı. Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur; bu sorularda tahmin edilmiş olabilir.`,
      ),
    );
  }
  if (same) {
    issues.push(
      v(
        `${r.sameAnswer === answered ? 'Bütün cevaplarında' : `Cevaplarının ${r.sameAnswer} tanesinde`} aynı sayıyı yazdın; sorulara bakmadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${r.sameAnswer === answered ? 'bütün cevaplarında' : `cevaplarının ${r.sameAnswer} tanesinde`} aynı sayıyı yazdı; sorulara bakılmadan cevap verilmiş olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
  const skipLine = r.skipped > 0 ? `“Bilmiyorum” ${r.skipped} soruda` : undefined;
  if (r.medianRt === null) {
    calisma = {
      ...card('sd_calisma'),
      headline: 'Süre hesaplanamadı',
      ...(skipLine ? { detail: skipLine } : {}),
      text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' '),
    };
  } else {
    const times = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 4–5. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 4);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Zor bir soruda daha uzun düşünmek iyi bir çalışma biçimidir: kuralı bulup dizinin bütün sayılarında denemek zaman alır.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Zor bir soruda daha uzun düşünmek iyi bir çalışma biçimidir: kuralı bulup dizinin bütün sayılarında denemek zaman alır.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Zor sorulara daha çok zaman ayırmak ve sayılar arasındaki farkları kâğıda yazmak, kuralı bulmana yardım edebilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; daha çok zaman ayırmak ve sayılar arasındaki farkları kâğıda yazmak kuralı bulmasına yardım edebilir.',
        );
      } else if (r.rtHard * 1.5 <= r.rtEasy) {
        pace = v(
          'Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.',
          'Çocuğunuz zor sorularda kolay sorulardakinden daha kısa sürede cevap verdi ve bu soruların çoğunu yine doğru buldu.',
        );
      } else {
        pace = v('Kolay ve zor sorulara birbirine yakın süreler ayırdın.', 'Çocuğunuz kolay ve zor sorulara birbirine yakın süreler ayırdı.');
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    const detail = [times, skipLine].filter(Boolean).join(' · ');
    calisma = {
      ...card('sd_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      ...(detail ? { detail } : {}),
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const sizes = [...new Set(r.levels.map((l) => l.n))].sort((a, b) => a - b).join(' ya da ');
  const chart: CognitiveReport['chart'] = {
    title: 'Düzeylere göre doğru cevaplar',
    note: v(
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${sizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${sizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğu doğru cevaplanmış demektir.`,
    ),
    rows: r.levels.map((l) => ({ label: `${l.level}. düzey`, value: l.correct, max: l.n, valueLabel: `${l.correct}/${l.n}` })),
  };
  const figures = [
    { label: 'Doğru', value: `${r.correct}/${r.n}` },
    r.reached === 0
      ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: '1. düzeyde zorlanıldı' }
      : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = few
    ? undefined
    : {
        title: v('Kural türlerine göre sonucun', 'Kural türlerine göre sonuç'),
        note: v(
          'Her sütun bir kural türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca türleri ayırır.',
          'Her sütun bir kural türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca türleri ayırır.',
        ),
        bars: r.rules.map((x) => ({
          key: x.rule,
          label: NUMBER_RULES[x.rule].name,
          value: Math.round((x.correct / x.n) * 100),
          min: 0,
          max: 100,
          color: NUMBER_RULES[x.rule].color,
          valueLabel: `${x.correct}/${x.n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, duzey, kural, calisma], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Sözel akıl yürütme ---------- */

/**
 * Sözel akıl yürütmede soru türlerinin adları (raporda ve üç boyutlu grafikte), kısa anlatımları ve yanlışların
 * yorumunda "ilk bakışta doğru görünen" seçeneğin o türde nasıl seçildiği.
 */
export const VERBAL_TYPES: Record<VerbalItemType, { name: string; plain: string; color: string; lure: string }> = {
  analogy: {
    name: VERBAL_TYPE_NAMES.analogy,
    plain: 'iki kelime arasındaki ilişkiyi (ör. bir aletin işi, bir parçanın ait olduğu bütün) bulup aynı ilişkiyi başka bir kelimeye uygulamak',
    color: '#2f5ce0',
    lure: 'kelime ilişkilerinde kelimeler arasındaki ilişkiye değil konularına bakmak',
  },
  classification: {
    name: VERBAL_TYPE_NAMES.classification,
    plain: 'birkaç kelimenin ortak özelliğini bulup bu özelliği taşıyan kelimeyi seçmek',
    color: '#0e9c8c',
    lure: 'sınıflamada gruba yalnızca bir yönüyle benzeyen kelimeyi gruba katmak',
  },
  ordering: {
    name: VERBAL_TYPE_NAMES.ordering,
    plain: 'karşılaştırmaları birleştirip bir sıralama kurmak ve bilgilerin cevabı bulmaya yetmediği durumu fark etmek',
    color: '#ee6a36',
    lure: 'sıralamada bilgilerin yalnızca bir bölümüne dayanmak ya da olabilecek bir sıralamayı kesin saymak',
  },
  deduction: {
    name: VERBAL_TYPE_NAMES.deduction,
    plain: 'verilen bilgilerden kesinlikle çıkan sonucu, “olabilir” ama kesin olmayan sonuçlardan ayırmak',
    color: '#7a4ee6',
    lure: 'mantıksal çıkarımda verilen bilgilerden kesin olarak çıkmayan bir cümleyi doğru saymak',
  },
};

/** "“Kelime ilişkileri” ve “sıralama”" gibi: tür adları tırnak içinde, ilk harfi küçük. */
const verbalTypeList = (types: VerbalItemType[]) =>
  joinTr(types.map((t) => `“${VERBAL_TYPES[t].name.charAt(0).toLocaleLowerCase('tr-TR')}${VERBAL_TYPES[t].name.slice(1)}”`));

/** Sözel akıl yürütmenin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve soru türlerinin üç boyutlu grafiği. */
function verbalBlocks(r: VerbalResult, task: VerbalReasoningTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = r.correct <= VERBAL_CHANCE_MAX;
  const rapid = verbalRapid(r);
  const samePos = verbalSamePosition(r);
  const doubt = rapid || samePos;
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  if (chance) {
    accText = v(
      `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${VERBAL_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da soruları yeterince okumadan seçmiş de olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir.`,
      `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${VERBAL_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da sorular yeterince okunmadan seçilmiş de olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir.`,
    );
  } else {
    const easyMissed = first.n - first.correct;
    const higherPassed = r.levels.slice(1).some(passed);
    if (r.levels.every((l) => l.n - l.correct <= 1)) {
      accText = v(
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor düzeydeki soruların da çoğunu doğru buldun.`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz bütün düzeylerde soruların hemen hepsini doğru cevapladı; en zor düzeydeki soruların da çoğunu doğru buldu.`,
      );
    } else if (easyMissed >= 2 && higherPassed) {
      const which = easyMissed === first.n ? '1. düzeydeki kolay soruların hiçbirini' : `1. düzeydeki kolay sorulardan ${easyMissed} tanesini`;
      accText = v(
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun. Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu. Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
      );
    } else {
      // Kolay (1–2) ve zor (4–5) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const rate = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const gap = rate(easyLevels) - rate(r.levels.filter((l) => l.level >= 4));
      if (gap >= 0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça doğru cevapların azaldı. Bu beklenen bir durumdur: üst düzeylerde ilişkiler soyutlaşır ve birleştirilmesi gereken bilgi sayısı artar.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı. Bu beklenen bir durumdur: üst düzeylerde ilişkiler soyutlaşır ve birleştirilmesi gereken bilgi sayısı artar.`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        );
      } else {
        const slip = easyLevels.some((l) => l.correct < l.n) ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '';
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Kolay ve zor düzeylerdeki doğru cevapların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuzun kolay ve zor düzeylerdeki doğru cevapları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği.
    if (verbalLurePattern(r)) {
      const share = r.lures === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.lures} tanesinde)`;
      // Yanılgılar yalnızca çeldiricisi seçilen türler için anılır ve olasılık olarak söylenir.
      const phrases = VERBAL_TYPES_ORDER.filter((t) => r.luresByType[t] > 0).map((t) => VERBAL_TYPES[t].lure);
      const how = phrases.join('; ');
      const which = phrases.length > 1 ? 'şu yanılgılardan' : 'şu yanılgıdan';
      accText += v(
        ` Yanlış cevaplarının ${share} ilk bakışta doğru görünen ama sorudaki bilgilerin hepsine uymayan seçeneği seçtin. Bu yanlışlar ${which} kaynaklanmış olabilir: ${how}. Seçmeden önce her seçeneği sorudaki bütün bilgilerle karşılaştırmak işine yarar.`,
        ` Çocuğunuz yanlış cevaplarının ${share} ilk bakışta doğru görünen ama sorudaki bilgilerin hepsine uymayan seçeneği seçti. Bu yanlışlar ${which} kaynaklanmış olabilir: ${how}. Seçmeden önce her seçeneği sorudaki bütün bilgilerle karşılaştırmak ona yardım edebilir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı soruları okumadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorular okunmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('sz_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (chance) {
    duzey = { ...card('sz_duzey'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' };
  } else if (r.reached === 0) {
    duzey = {
      ...card('sz_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi. Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi. Bu; dikkatin dağılmasından, acele etmekten, yönergenin tam anlaşılmamasından ya da soruları okumakta henüz yeterince rahat olmamaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
      ),
    };
  } else {
    const def = task.levels.find((l) => l.level === r.reached)!;
    const next = task.levels.find((l) => l.level === r.reached + 1);
    const lower = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1).replace(/\.$/, '');
    const upTo =
      r.reached === 1
        ? v('1. düzeydeki soruların çoğunu doğru cevapladın', 'Çocuğunuz 1. düzeydeki soruların çoğunu doğru cevapladı')
        : v(`${r.reached}. düzeye kadar soruların çoğunu doğru cevapladın`, `Çocuğunuz ${r.reached}. düzeye kadar soruların çoğunu doğru cevapladı`);
    let text = `${upTo}. ${r.reached}. düzeydeki sorularda şunlar gerekiyordu: ${lower(def.plain)}.`;
    // Alt düzeylerdeki yanlışlar düzeyi düşürmez; daha zor sorular çözüldüğü için dikkatsizlikten kaynaklanmış olabilir.
    const slips = r.levels.filter((l) => l.level < r.reached && !passed(l)).map((l) => `${l.level}.`);
    if (slips.length) {
      text += v(
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi: daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi: daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
      );
    }
    if (!next) {
      text += v(' Bu en zor düzeydi.', ' Bu, testin en zor düzeyiydi.');
    } else {
      // Bir üst düzeyde soruların çoğu her zaman doğru değildir: o düzeyde en az %60 doğru olsaydı o düzeye ulaşılmış olurdu.
      text += v(
        ` ${next.level}. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
        ` ${next.level}. düzeyde soruların çoğunda zorlandı; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
      );
    }
    duzey = {
      ...card('sz_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki ve o düzeye kadarki soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Soru türleri */
  const typeLine = r.types.map((x) => `${VERBAL_TYPES[x.type].name} ${x.correct}/${x.n}`).join(' · ');
  // Kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const rough = ' Her soru türü altı soruya dayanır ve her türde kolaydan zora sorular vardır; bu karşılaştırma kaba bir göstergedir.';
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('sz_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için soru türleri karşılaştırılmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu tür sorularda ${VERBAL_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${verbalTypeList([x])} sorularında ${VERBAL_TYPES[x].plain} gerekir.`)).join(' ');
    const head =
      good.length === r.types.length
        ? `${r.types.length} soru türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.types.length} soru türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.types.length} soru türünün ${good.length} tanesinde soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.types.length} soru türünün her birinde soruların çoğunu doğru buldun: hem kelimeler arasındaki ilişkileri ve ortak özellikleri bulabildin hem de bilgileri birleştirip kesin sonuç çıkarabildin.`,
        `Çocuğunuz ${r.types.length} soru türünün her birinde soruların çoğunu doğru buldu: hem kelimeler arasındaki ilişkileri ve ortak özellikleri bulabildi hem de bilgileri birleştirip kesin sonuç çıkarabildi.`,
      );
    } else if (good.length === 0) {
      text = v(`Hiçbir soru türünde soruların çoğunu doğru bulamadın. ${needs}`, `Çocuğunuz hiçbir soru türünde soruların çoğunu doğru bulamadı. ${needs}`);
    } else {
      text = v(
        `${verbalTypeList(good)} sorularının çoğunu doğru buldun; ${verbalTypeList(hard)} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${verbalTypeList(good)} sorularının çoğunu doğru buldu; ${verbalTypeList(hard)} sorularında zorlandı. ${needs}`,
      );
    }
    tur = { ...card('sz_tur'), headline: head, detail: typeLine, text: capTr(text) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} yanlış bir cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin; bu sorularda okumadan seçmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} yanlış bir cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdi; bu sorularda okunmadan seçilmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; sorulara bakmadan hep aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; sorulara bakılmadan hep aynı yere basılmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
  if (r.medianRt === null) {
    calisma = { ...card('sz_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 4–5. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 4);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Zor sorular hem daha uzundur hem de daha çok düşünmeyi gerektirir; bunlarda bilgileri tek tek birleştirip seçenekleri karşılaştırmak iyi bir çalışma biçimidir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Zor sorular hem daha uzundur hem de daha çok düşünmeyi gerektirir; bunlarda bilgileri tek tek birleştirip seçenekleri karşılaştırmak iyi bir çalışma biçimidir.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Zor sorular daha uzundur; onları dikkatle okumak ve bilgileri kâğıda yazmak işine yarayabilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; zor sorular daha uzundur, onları dikkatle okumak ve bilgileri kâğıda yazmak yardımcı olabilir.',
        );
      } else if (r.rtHard * 1.5 <= r.rtEasy) {
        pace = v(
          'Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.',
          'Çocuğunuz zor sorularda kolay sorulardakinden daha kısa sürede cevap verdi ve bu soruların çoğunu yine doğru buldu.',
        );
      } else {
        // Öneri yalnızca zor sorularda doğru cevaplar azken verilir.
        pace =
          hardAcc <= 0.5
            ? v(
                'Kolay ve zor sorulara birbirine yakın süreler ayırdın; zor sorular daha uzun olduğu için onlarda biraz daha çok zaman ayırmak işine yarayabilir.',
                'Çocuğunuz kolay ve zor sorulara birbirine yakın süreler ayırdı; zor sorular daha uzun olduğu için onlarda biraz daha çok zaman ayırmak yardımcı olabilir.',
              )
            : v('Kolay ve zor sorulara birbirine yakın süreler ayırdın.', 'Çocuğunuz kolay ve zor sorulara birbirine yakın süreler ayırdı.');
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('sz_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      detail: timesLine,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const sizes = [...new Set(r.levels.map((l) => l.n))].sort((a, b) => a - b).join(' ya da ');
  const chart: CognitiveReport['chart'] = {
    title: 'Düzeylere göre doğru cevaplar',
    note: v(
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${sizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${sizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğu doğru cevaplanmış demektir.`,
    ),
    rows: r.levels.map((l) => ({ label: `${l.level}. düzey`, value: l.correct, max: l.n, valueLabel: `${l.correct}/${l.n}` })),
  };
  const figures = [
    { label: 'Doğru', value: `${r.correct}/${r.n}` },
    chance
      ? { label: 'Ulaşılan düzey', value: 'Yorumlanmadı' }
      : r.reached === 0
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: '1. düzeyde zorlanıldı' }
        : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = chance
    ? undefined
    : {
        title: v('Soru türlerine göre sonucun', 'Soru türlerine göre sonuç'),
        note: v(
          'Her sütun bir soru türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca türleri ayırır.',
          'Her sütun bir soru türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca türleri ayırır.',
        ),
        bars: r.types.map((x) => ({
          key: x.type,
          label: VERBAL_TYPES[x.type].name,
          value: Math.round((x.correct / x.n) * 100),
          min: 0,
          max: 100,
          color: VERBAL_TYPES[x.type].color,
          valueLabel: `${x.correct}/${x.n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, duzey, tur, calisma], chart, figures, ...(profile ? { profile } : {}) };
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
      headline: spd.attempted === 0 ? 'Cevap verilmedi' : `${secs} saniyede ${spd.correct} doğru eşleştirme`,
      // Süre boyunca hiç cevap verilmediyse (yönerge anlaşılmamış, görev yarıda kalmış) yalnızca bu görev yorumlanmaz.
      text: spd.attempted === 0
        ? `${secs} saniye boyunca hiçbir sembol eşleştirilmedi; bu yüzden bu görevin sonucu yorumlanmadı. Görev yarıda kalmış ya da yönerge anlaşılmamış olabilir. Öteki görevlerin sonuçları bundan etkilenmez.`
        : you
        ? `${spd.attempted} sembolden ${spd.correct} tanesini doğru eşleştirdin (${spd.errors} hata). Bu görev, basit bir işi hızlı ve doğru yapabilmeyi ölçer; örneğin tahtadan bir şeyi deftere geçirmek ya da sınavda basit işlemleri yapmak gibi.`
        : `${spd.attempted} sembolden ${spd.correct} tanesini doğru eşleştirdi (${spd.errors} hata). Bu görev işlem hızını, yani basit bir işi hem hızlı hem doğru yapabilmeyi ölçer; tahtadan yazmak ya da sınavda basit işlemleri yapmak gibi işlerde kullanılır. İşlem hızı çocukluk ve ergenlik boyunca belirgin biçimde artar.`,
      symbol: { correct: spd.correct, errors: spd.errors, perMinute: spd.perMinute },
    });
  }

  const cz = byKey.get('tempo')?.extra as unknown as CancellationResult | undefined;
  const ct = def.tasks.find((t): t is CancellationTask => t.kind === 'cancellation');
  if (cz && ct) blocks.push(...cancellationBlocks(cz, ct, audience, scale));

  // Renk-kelime, dur-git, sırayla birleştirme, geriye dönük hatırlama, zihinde döndürme ve tepki hızı: her biri tek
  // görevli bir testtir, sonucunu bir grafik özetler.
  const card: CardOf = (k) => ({ key: k, name: scale(k).name, plain: scale(k).plain });
  let chart: CognitiveReport['chart'];
  let figures: CognitiveReport['figures'];
  let profile: CognitiveReport['profile'];
  const add = (x: TaskReport) => {
    blocks.push(...x.blocks);
    chart = x.chart;
    figures = x.figures;
    profile = x.profile;
  };
  const cw = byKey.get('renk_dogruluk')?.extra as unknown as ColorWordResult | undefined;
  if (cw && def.tasks.some((t) => t.kind === 'color_word')) add(colorWordBlocks(cw, audience, card));
  const gn = byKey.get('dg_durma')?.extra as unknown as GoNoGoResult | undefined;
  const gt = def.tasks.find((t): t is GoNoGoTask => t.kind === 'go_nogo');
  if (gn && gt) add(goNoGoBlocks(gn, gt, audience, card));
  const tr = byKey.get('iz_a')?.extra as unknown as TrailResult | undefined;
  const tt = def.tasks.find((t): t is TrailTask => t.kind === 'trail');
  if (tr && tt) add(trailBlocks(tr, tt, audience, card));
  const nb = byKey.get('gh_bir')?.extra as unknown as NBackResult | undefined;
  if (nb && def.tasks.some((t) => t.kind === 'n_back')) add(nBackBlocks(nb, audience, card));
  const zd = byKey.get('zd_dogruluk')?.extra as unknown as RotationResult | undefined;
  const zt = def.tasks.find((t): t is MentalRotationTask => t.kind === 'mental_rotation');
  if (zd && zt) add(mentalRotationBlocks(zd, zt, audience, card));
  const th = byKey.get('th_basit')?.extra as unknown as ReactionResult | undefined;
  if (th && def.tasks.some((t) => t.kind === 'reaction_time')) add(reactionBlocks(th, audience, card));
  const sa = byKey.get('sa_dogru')?.extra as unknown as MatrixResult | undefined;
  const st = def.tasks.find((t): t is MatrixReasoningTask => t.kind === 'matrix_reasoning');
  if (sa && st) add(matrixBlocks(sa, st, audience, card));
  const sd = byKey.get('sd_dogru')?.extra as unknown as NumberSeriesResult | undefined;
  const sdt = def.tasks.find((t): t is NumberSeriesTask => t.kind === 'number_series');
  if (sd && sdt) add(numberSeriesBlocks(sd, sdt, audience, card));
  const sz = byKey.get('sz_dogru')?.extra as unknown as VerbalResult | undefined;
  const szt = def.tasks.find((t): t is VerbalReasoningTask => t.kind === 'verbal_reasoning');
  if (sz && szt) add(verbalBlocks(sz, szt, audience, card));

  if (def.tasks.every((t) => t.kind === 'cancellation')) return { blocks, tips: SUSTAINED_TIPS[voice(audience)] };
  // Bu görevler için öneriler (kapsamlı rapor) henüz yazılmadı; basit raporda öneri gösterilmez.
  if (def.tasks.every((t) => ['color_word', 'go_nogo', 'trail', 'n_back', 'mental_rotation', 'reaction_time', 'matrix_reasoning', 'number_series', 'verbal_reasoning'].includes(t.kind))) {
    return { blocks, tips: [], chart, ...(figures ? { figures } : {}), ...(profile ? { profile } : {}) };
  }

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
        'Çalışma belleğini geliştirmeyi amaçlayan bilgisayarlı alıştırma programlarının etkisinin okul başarısına aktarıldığına dair güçlü bir kanıt yoktur (Melby-Lervåg ve Hulme, 2013). Gündelik hayattaki destekler daha yararlıdır.',
        'Dikkat, öğrenme ya da davranışla ilgili süreğen bir endişeniz varsa bu sonuca değil, okulun rehberlik servisine ya da bir uzmana başvurun.',
      ];
  return { blocks, tips };
}

/** Puanları birbirine bu kadar yakın alanların sırası güvenilir değildir (8 maddelik alanda bir cevabın farkı 0,125). */
const INTEREST_TIE = 0.15;
const isHighBand = (b: Band | null) => b === 'high' || b === 'very_high';
const ORDINAL = ['birinci', 'ikinci', 'üçüncü'];
const joinTr = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`);

/**
 * Holland profili. Öne çıkan alanlar puanın düzeyine bakılarak seçilir: en az orta düzeyde olmayan alan hiçbir zaman öne
 * çıkarılmaz. En az bir alan yüksekse en çok üç alan öne çıkar, Holland kodu ve örnek meslekler bunlardan oluşur. Hiçbir
 * alan yüksek değilse en yüksek iki orta düzey alan gösterilir, kod ve meslek verilmez. Bütün alanlar düşükse ya da
 * bütün alanların puanı aynıysa öne çıkan alan yoktur. Puanları neredeyse aynı olan alanlar (eşitlikler) notla söylenir.
 */
function buildInterestProfile(sections: ReportSection[], audience: Audience, grade: number): InterestProfile {
  const byScale = new Map(sections.map((s) => [s.scaleKey, s]));
  const rows = RIASEC_ORDER.map((key, order) => {
    const s = byScale.get(RIASEC_TYPES[key].scaleKey);
    return { key, order, name: RIASEC_TYPES[key].name, mean: s?.value ?? null, band: s?.band ?? null, bandLabel: s?.bandLabel ?? '' };
  });
  // Eşit puanlarda altıgendeki sıra korunur; sıralama kararlıdır.
  const ranked = [...rows].filter((r) => r.mean !== null).sort((a, b) => b.mean! - a.mean! || a.order - b.order);
  const rankOf = new Map(ranked.map((r, i) => [r.key, i + 1]));
  const means = ranked.map((r) => r.mean!);
  const max = means.length ? Math.max(...means) : 0;
  const min = means.length ? Math.min(...means) : 0;
  const differentiation = Math.round((max - min) * 100) / 100;

  const tied = ranked.length > 1 && differentiation === 0;
  const noneHigh = !ranked.some((r) => isHighBand(r.band));
  const allLow = !ranked.some((r) => r.band === 'average' || isHighBand(r.band));
  // Öne çıkabilecek alanlar: en az orta düzeyde olanlar.
  const eligible = tied ? [] : ranked.filter((r) => r.band === 'average' || isHighBand(r.band));
  const topRows = eligible.slice(0, noneHigh ? 2 : 3);
  const topKeys = topRows.map((r) => r.key);
  const hasCode = !noneHigh && topKeys.length > 0;

  // Eşitlikler: puanları art arda birbirine çok yakın olan alanlar bir küme oluşturur. Küme öne çıkan alanlara
  // dokunuyorsa sıranın (ya da hangi alanın öne çıktığının) küçük bir farka dayandığı söylenir.
  const you = audience !== 'parent';
  const closeCalls: string[] = [];
  for (let i = 0; i < eligible.length && i < topRows.length; ) {
    let j = i;
    while (j + 1 < eligible.length && Math.abs(eligible[j].mean! - eligible[j + 1].mean!) < INTEREST_TIE) j++;
    if (j > i) {
      const names = joinTr(eligible.slice(i, j + 1).map((r) => r.name));
      const lead = you ? `${names} alanlarındaki puanların neredeyse aynı; ` : `${names} alanlarındaki puanlar neredeyse aynıdır; `;
      const where = hasCode ? 'ilgi kodunda ' : '';
      let tail: string;
      if (j < topRows.length) {
        tail = `${where}bu alanların sırası yer değiştirebilir.`;
      } else if (i === topRows.length - 1) {
        const nth = hasCode ? ORDINAL[i] : 'en yüksek çıkan';
        tail = you
          ? `${hasCode ? `${nth} alanını` : 'en yüksek çıkan alanlarından birini'} bu alanlardan herhangi biri olarak düşünebilirsin.`
          : `${hasCode ? `${nth} alan` : 'en yüksek çıkan alanlardan biri'} bu alanlardan herhangi biri olarak düşünülebilir.`;
      } else {
        tail = you
          ? 'bu yüzden öne çıkan alanlarının seçimi küçük bir farka dayanıyor, bu alanların hepsini birlikte düşünebilirsin.'
          : 'bu yüzden öne çıkan alanların seçimi küçük bir farka dayanır, bu alanların hepsi birlikte düşünülebilir.';
      }
      closeCalls.push(lead + tail);
    }
    i = j + 1;
  }

  return {
    code: hasCode ? topKeys.join('') : '',
    types: rows.map((r) => ({ key: r.key, name: r.name, mean: r.mean, rank: rankOf.get(r.key) ?? 0 })),
    top: topRows.map((r) => {
      const t = RIASEC_TYPES[r.key];
      const high = isHighBand(r.band);
      return {
        key: r.key,
        name: t.name,
        plain: t.plain,
        // Kişiye yazılmış metin ("…hoşlanıyorsun") yalnızca yüksek düzeydeki alanda kullanılır.
        text: high ? (audience === 'parent' ? t.parent : t.student) : t.plain,
        bandLabel: r.bandLabel,
        high,
        likes: t.likes,
        explore: t.explore,
        paths: t.paths,
      };
    }),
    lowest: ranked.slice(-2).reverse().map((r) => ({ key: r.key, name: r.name })),
    differentiation,
    flat: differentiation < 0.8,
    noneHigh,
    allLow,
    exploration: grade <= 9,
    closeCalls,
    occupations: hasCode ? occupationsFor(topKeys, 8) : [],
  };
}
