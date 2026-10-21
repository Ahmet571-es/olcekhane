import { RIASEC_ORDER, RIASEC_TYPES, occupationsFor, type Occupation, type RiasecKey } from '@/content/careers/riasec';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { BandText, InsightTemplate, LevelGroup, MotivationTemplate, PairText, ValuesTemplate } from '@/content/reports/types';
import { GRADE_LABELS } from '@/lib/config';
import { DEFAULT_BAND_LABELS, nearestBand } from './bands';
import type {
  Band,
  CancellationTask,
  GoNoGoTask,
  InstrumentDef,
  LikertInstrument,
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
  FoldingLure,
  FoldingType,
  PaperFoldingTask,
  LogicalReasoningTask,
  LogicForm,
  NumericalReasoningTask,
  CubeNetTask,
  CubeType,
  HiddenFiguresTask,
  MentalRotation3dTask,
  VocabularyLure,
  VocabularyTask,
  VocabularyType,
} from '@/lib/instruments/types';
import type { CubeLure } from '@/lib/instruments/cube';
import type { HiddenLure } from '@/lib/instruments/hidden';
import { VERBAL_TYPE_NAMES } from '@/lib/instruments/verbal';
import { VOCABULARY_TYPE_NAMES } from '@/lib/instruments/vocabulary';
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
  FOLDING_CHANCE_MAX,
  FOLDING_LURES_ORDER,
  foldingLurePattern,
  foldingRapid,
  foldingSamePosition,
  VOCABULARY_CHANCE_MAX,
  VOCABULARY_LURES_ORDER,
  vocabularyLurePattern,
  vocabularyRapid,
  vocabularySamePosition,
  ruleSwitchChance,
  ruleSwitchFast,
  ruleSwitchOneSide,
  ruleSwitchTimeouts,
  wordListManyExtra,
  wordListNoInput,
  wordListDelayedSkipped,
  wordListRecogFast,
  wordListRecogOneSided,
  wordListRecogValid,
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
  type FoldingResult,
  type VocabularyResult,
  type RuleSwitchResult,
  type WordListResult,
  LOGIC_GOOD,
  LOGIC_WEAK,
  NUMERIC_BLANK_MANY,
  NUMERIC_GOOD,
  NUMERIC_LURE_NOTE,
  numericNumberDriven,
  numericRapid,
  type NumericGroup,
  type NumericResult,
  logicBelowChance,
  logicRapid,
  logicSameSide,
  type LogicGroup,
  type LogicResult,
  CUBE_CHANCE_MAX,
  CUBE_LURE_NOTE,
  CUBE_LURES_ORDER,
  cubeLureStandsOut,
  cubeRapid,
  reflectionChance,
  reflectionControlLow,
  reflectionSuspicious,
  reflectionRapid,
  reflectionSamePosition,
  type ReflectionResult,
  towerIdle,
  towerNone,
  towerRapid,
  TOWER_LONG,
  TOWER_RAPID_FROM,
  TOWER_RAPID_MS,
  TOWER_SHORT,
  type TowerResult,
  cubeSamePosition,
  type CubeResult,
  HIDDEN_CHANCE_MAX,
  HIDDEN_LURE_NOTE,
  HIDDEN_LURES_ORDER,
  hiddenLureStandsOut,
  hiddenRapid,
  hiddenSamePosition,
  type HiddenResult,
  patternFloor,
  patternManySkipped,
  patternRapid,
  PATTERN_RESTARTS_NOTE,
  type PatternResult,
  ROTATION3D_CHANCE_MAX,
  ROTATION3D_PART_GAP,
  rotation3dMirrorPick,
  rotation3dRapid,
  rotation3dSamePair,
  type Rotation3dPartResult,
  type Rotation3dResult,
  CS_OPS_TARGET,
  complexSpanOpsChance,
  complexSpanRapid,
  complexSpanRecallChance,
  type ComplexSpanResult,
  PA_CHANCE_MEAN,
  perspectiveChance,
  perspectiveDoubt,
  perspectiveEgo,
  perspectiveMirror,
  perspectivePatternHigh,
  perspectiveRapid,
  perspectiveSameDir,
  type PerspectiveResult,
  paOf,
} from '@/lib/scoring/tasks';
import { PA_CLOSE, PA_EGO_MIN_SHIFT, PA_SMALL_MAX } from '@/lib/instruments/perspective';
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
  /** Cevaplar iki uca ayrıştığı için düzey metni yerine ayrışma metni gösterildi (rapor şablonu: itemSplit). */
  split?: boolean;
  /** Bu ölçeğin bir maddesi destek kutusunu açtı (ölçek: supportItems). */
  flagged?: boolean;
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
  /** Destek kutusunu bir cevap açtıysa kutunun başındaki cümle (ör. "Cevaplarından en az birinde …"). */
  supportNote?: string;
  /** Test yalnızca küçük çocuklara (en çok 5. sınıf) açık: öğrenciye destek kutusu çocuk diliyle yazılır. */
  young?: boolean;
  science: { basedOn: string; reliability: string; limitations: string[]; license: string };
  interests?: InterestProfile;
  /** Sıralı ilgi profili (profil: interests). */
  ranking?: InterestRanking;
  /** Ayrıntılı profil (profil: facets): her bileşik ölçek ve alt ölçekleri, testteki sırayla. */
  /** Ayrıntılı profil: her boyutun alt özellikleri; `facetItems`, bir alt özelliğin kaç maddeyle ölçüldüğüdür. */
  facetGroups?: { domain: string; facets: string[]; facetItems: number }[];
  /** Ayrıntılı profilde alt ölçeklerin adı (testin `facetTerms` alanı; verilmezse "alt özellik"). */
  facetTerms?: { from: string; subject: string; toOne: string; ofDomain: string };
  /** Kişilerarası çember (profil: circumplex): her ölçeğin çemberdeki açısı ve grafikteki kısa adı. */
  circumplex?: { key: string; angle: number; short: string }[];
  /** Motivasyon haritası ve profili (profil: motivation). */
  motivation?: MotivationReport;
  /** Ölçeklerin birlikte yorumu (şablonda `insight` varsa): başlık ve paragraflar ("\n\n" ile ayrılmış). */
  insight?: { title: string; text: string };
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

/** Haritadaki bir bileşik ölçeğin düzeyi (düşük, orta, yüksek). */
export type MotivationLevel = 'low' | 'average' | 'high';

/**
 * Motivasyon haritası (profil: motivation): iki bileşik ölçek (yatay: kendi isteğiyle, dikey: baskıyla çalışma) bir
 * düzlemde, düzeylerinin birleşimine göre profil ve yorumu; ardından bileşik ölçekler ve haritada olmayan ölçek
 * (isteksizlik) grup grup, alt ölçekleriyle. Metinler rapor şablonundandır (`motivation`).
 */
export interface MotivationReport {
  x: { key: string; name: string; value: number | null; level: MotivationLevel | null };
  y: { key: string; name: string; value: number | null; level: MotivationLevel | null };
  /** "<yatay>-<dikey>" (ör. "high-low"); bir eksen hesaplanamadıysa null. */
  pattern: string | null;
  /** Profilin adı; hesaplanamadıysa null. */
  name: string | null;
  /** Profilin yorumu (ve varsa bileşik ölçeklerin baskın parçasını anlatan cümleler). */
  text: string;
  /** Düzey sınırları (düşük → orta, orta → yüksek); haritadaki çizgiler. */
  cuts: [number, number];
  /** Haritanın köşelerindeki dört profilin adları. */
  corners: { x: 'low' | 'high'; y: 'low' | 'high'; label: string }[];
  chartNote: string;
  /** Gruplar: bileşik ölçekler ve haritada olmayan ölçek; her birinin açıklaması ve cetvelleri gösterilecek ölçekler. */
  groups: { key: string; text: string; scales: string[] }[];
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
  kind: 'interests' | 'activities' | 'values';
  /** Puanı hesaplanan alanların anahtarları, en yüksekten en düşüğe (eşit puanlılar testteki sırayla). */
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
  /**
   * Değer sıralamasında (kind: values) daha az önem verilen değerler: en düşük iki puandaki değerler (eşitlikte en çok
   * üç), en önemli değerin puanından en az 1 puan aşağıdaysa; en önemli değerlerden biri değilse.
   */
  bottom?: string[];
  /** Değer sıralamasında ikisi de en önemli değerler arasında olan, birbirine ters yönde çekebilen çiftler. */
  tradeoffs?: { a: string; b: string; title: string; text: string }[];
  /**
   * Değer sıralamasında en önemli değerlerin sıra numaraları (eşit puanlılar aynı numarayı alır: 1, 1, 3): eşit puan
   * testteki sıraya göre bozulmaz.
   */
  ranks?: number[];
  /** Değer sıralamasında daha az önem verilen değerlerin açıklaması (değer adları yazılmış). */
  lowerText?: string;
  /** Değer sıralamasının sonundaki not: sonucun nasıl kullanılabileceği. */
  note?: { title: string; text: string };
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
  /** Likert testlerinde madde düzeyindeki işaretler (scoring/likert, likertItemFlags). */
  items?: { support: boolean; flagged: string[]; mixed: string[] };
}): ReportContent {
  const { def, audience } = input;
  const template = REPORT_TEMPLATES[def.slug];
  const byKey = new Map(input.scores.map((s) => [s.scaleKey, s]));
  let support = false;
  /** Destek kutusunu açan ölçekler (ayrışan bir boyutun düzey metni gösterilmezse o boyut kutuyu açmaz). */
  const supportFrom: string[] = [];
  /** Kutuyu bir madde açtıysa kutunun başındaki cümle (rapor şablonu: itemSupport). */
  let supportNote: string | undefined;

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
      if (bt?.support) {
        support = true;
        supportFrom.push(scale.key);
      }
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
    // Ayrıntılı profilde bir boyutun alt ölçekleri ayrışıyorsa (biri yüksek, öteki düşük) boyutun düzey metni yerine
    // şablondaki ayrışma metni (rapor şablonu: facetSplit).
    if (def.profile === 'facets' && template?.facetSplit) {
      for (const scale of def.scales) {
        const split = template.facetSplit[scale.key];
        const sec = sections.find((x) => x.scaleKey === scale.key);
        if (!split || !sec?.band || !scale.of) continue;
        const groups = scale.of.map((k) => motivationLevel(sections.find((x) => x.scaleKey === k)?.band ?? null));
        if (!groups.includes('high') || !groups.includes('low')) continue;
        sec.summary = split.summary;
        sec.text = audience === 'parent' ? split.parent : audience === 'adult' ? (split.adult ?? split.student) : split.student;
        // Destek kutusunu yalnızca bu boyutun (artık gösterilmeyen) düzey metni açtıysa kutu kalkar; yönlerden biri açtıysa kalır.
        const at = supportFrom.indexOf(scale.key);
        if (at >= 0) supportFrom.splice(at, 1);
        support = supportFrom.length > 0;
      }
    }
    // Bir konudaki cevaplar iki uca ayrışıyorsa (biri olumlu, biri olumsuz) ve ortalama düşük değilse, ortalamanın düzey
    // metni yerine şablondaki ayrışma metni (rapor şablonu: itemSplit). Düşük düzeyin metni ve destek kutusu değişmez.
    if (template?.itemSplit && input.items) {
      for (const [key, split] of Object.entries(template.itemSplit)) {
        const sec = sections.find((x) => x.scaleKey === key);
        if (!sec?.band || motivationLevel(sec.band) === 'low' || !input.items.mixed.includes(key)) continue;
        sec.summary = split.summary;
        sec.text = audience === 'parent' ? split.parent : audience === 'adult' ? (split.adult ?? split.student) : split.student;
        sec.split = true;
      }
    }
    // Destek kutusunu açan maddeler (ölçek: supportItems): ortalama tek bir cevabı gizleyebilir.
    for (const sec of sections) if (input.items?.flagged.includes(sec.scaleKey)) sec.flagged = true;
    if (input.items?.support) {
      support = true;
      supportFrom.push('items');
      if (template?.itemSupport) supportNote = audience === 'parent' ? template.itemSupport.parent : audience === 'adult' ? (template.itemSupport.adult ?? template.itemSupport.student) : template.itemSupport.student;
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
    def.engine === 'likert' && (def.profile === 'interests' || def.profile === 'activities' || def.profile === 'values')
      ? rankInterests(sections, def.profile, template?.values, audience)
      : undefined;
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
  const motivation =
    def.engine === 'likert' && def.profile === 'motivation' && template?.motivation
      ? buildMotivation(def, sections, template.motivation, audience)
      : undefined;
  const extraNotes = motivation?.caution ? [motivation.caution] : [];
  // Birlikte yorum profil verilmeyen testlerde ve ayrıntılı profilde (ör. bir boyutun iki yönünün ayrışması) kullanılır.
  const insight =
    def.engine === 'likert' && (!def.profile || def.profile === 'facets') && template?.insight
      ? buildInsight(sections, template.insight, audience)
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
  } else if (sections.length > 2 && !interests && !facetGroups && !circumplex && !motivation && !template?.evaluative) {
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
    qualityNotes: [...(input.qualityNotes ?? []), ...extraNotes],
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
    ...(support && supportNote ? { supportNote } : {}),
    ...(def.maxGrade <= 5 ? { young: true } : {}),
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
    ...(facetGroups && def.engine === 'likert' && def.facetTerms ? { facetTerms: def.facetTerms } : {}),
    circumplex,
    ...(motivation ? { motivation: motivation.report } : {}),
    ...(insight ? { insight } : {}),
    cognitive,
    academic,
  };
}

/**
 * Ölçeklerin birlikte yorumu: giriş (ilk uyan `lead` kuralı) ve uyan bütün ek kurallar, ayrı paragraflar. Bir kuralın
 * andığı ölçek hesaplanamadıysa kural uymaz; giriş uymazsa yorum gösterilmez.
 */
function buildInsight(sections: ReportSection[], t: InsightTemplate, audience: Audience): { title: string; text: string } | undefined {
  const group = new Map(sections.map((s) => [s.scaleKey, motivationLevel(s.band) as LevelGroup | null]));
  const fits = (when: Record<string, LevelGroup[]>) =>
    Object.entries(when).every(([key, groups]) => {
      const g = group.get(key);
      return g !== null && g !== undefined && groups.includes(g);
    });
  const pickText = (x: InsightTemplate['lead'][number]['text']) =>
    audience === 'parent' ? x.parent : audience === 'adult' ? (x.adult ?? x.student) : x.student;
  const lead = t.lead.find((r) => fits(r.when));
  if (!lead) return undefined;
  const more = t.rules.filter((r) => fits(r.when) && !(r.not && fits(r.not))).map((r) => pickText(r.text));
  // Hiçbir ek kural uymadıysa (ör. hiçbir boyutun iki yönü ayrışmıyorsa) şablondaki kapanış cümlesi.
  if (more.length === 0 && t.fallback) more.push(pickText(t.fallback));
  return { title: audience === 'parent' ? t.title.parent : t.title.you, text: [pickText(lead.text), ...more].join('\n\n') };
}

/** Bir ondalıklı ortalama (raporda gösterilen sayı); karşılaştırmalar gösterilen sayılarla yapılır. */
const shown1 = (v: number) => Math.round(v * 10) / 10;

function motivationLevel(band: Band | null): MotivationLevel | null {
  if (band === null) return null;
  if (band === 'very_low' || band === 'low') return 'low';
  if (band === 'high' || band === 'very_high') return 'high';
  return 'average';
}

/**
 * Motivasyon haritası. Profil, iki bileşik ölçeğin düzeylerinden ("high-low" gibi); yorumun sonuna, bir bileşik ölçeğin
 * iki parçası arasında belirgin fark varsa (gösterilen ortalamalar arasında en az 1 puan ve baskın parça düşük değilse)
 * baskın parçayı anlatan cümle eklenir. Yatay eksen yüksek ve haritada olmayan ölçek (isteksizlik) yüksekse cevaplar
 * birbirine ters düştüğü için uyarı verilir.
 */
function buildMotivation(
  def: LikertInstrument,
  sections: ReportSection[],
  t: MotivationTemplate,
  audience: Audience,
): { report: MotivationReport; caution: string | null } {
  const pick = (p: PairText) => (audience === 'parent' ? p.parent : p.student);
  const scales = def.scales;
  const byKey = new Map(sections.map((s) => [s.scaleKey, s]));
  const th = (band: Band) => def.anchoredBands.thresholds.find((x) => x.band === band)?.min ?? Number.NaN;
  const axis = (key: string) => {
    const s = byKey.get(key);
    return { key, name: s?.name ?? key, value: s?.value ?? null, level: motivationLevel(s?.band ?? null) };
  };
  const x = axis(t.x);
  const y = axis(t.y);
  const pattern = x.level && y.level ? `${x.level}-${y.level}` : null;
  const p = pattern ? t.patterns[pattern] : undefined;

  // Bileşik ölçeğin parçaları: biri tek başına yüksekken bileşik ölçek yüksek değilse bunu söyleyen cümle (profil metni
  // yalnızca bileşik ölçeği anlattığı için); değilse parçalar arasında belirgin fark varsa baskın parçayı anlatan cümle.
  const leans: string[] = [];
  for (const axisInfo of [x, y]) {
    const parts = (scales.find((s) => s.key === axisInfo.key)?.of ?? []).map((k) => byKey.get(k));
    if (parts.length !== 2 || parts.some((s) => !s || s.value === null)) continue;
    const [a, b] = parts as ReportSection[];
    const high = [a, b].find((s) => motivationLevel(s.band) === 'high');
    if (high && axisInfo.level !== null && axisInfo.level !== 'high' && t.hidden[high.scaleKey]) {
      leans.push(pick(t.hidden[high.scaleKey]).replace('{düzey}', axisInfo.level === 'low' ? 'az' : 'orta düzeyde'));
      continue;
    }
    const gap = shown1(a.value!) - shown1(b.value!);
    if (Math.abs(gap) < 1 - 1e-9) continue;
    const top = gap > 0 ? a : b;
    if (motivationLevel(top.band) === 'low' || !t.lean[top.scaleKey]) continue;
    leans.push(pick(t.lean[top.scaleKey]));
  }

  const none =
    audience === 'parent'
      ? 'Bazı cümleler cevaplanmadığı için motivasyon profili hesaplanamadı. Aşağıdaki türlerin sonuçları yine de yorumlanabilir.'
      : 'Bazı cümleleri cevaplamadığın için motivasyon profilin hesaplanamadı. Aşağıdaki türlerin sonuçlarına yine de bakabilirsin.';
  // Kendi isteğiyle çalışma (ya da parçalarından biri, ör. önemini görme) yüksekken isteksizlik de yüksekse cevaplar
  // birbirine ters düşer ("öğrendiklerim işime yarayacak" ile "işime yaramayacak").
  const alone = byKey.get(t.alone);
  const xParts = (scales.find((s) => s.key === t.x)?.of ?? []).map((k) => byKey.get(k));
  const xHigh = x.level === 'high' || xParts.some((s) => motivationLevel(s?.band ?? null) === 'high');
  const caution = xHigh && motivationLevel(alone?.band ?? null) === 'high' ? pick(t.contradiction) : null;
  const corner = (cx: 'low' | 'high', cy: 'low' | 'high') => ({ x: cx, y: cy, label: t.patterns[`${cx}-${cy}`].name });
  return {
    report: {
      x,
      y,
      pattern: p ? pattern : null,
      name: p?.name ?? null,
      // Profil yorumu ve eklenen cümleler ayrı paragraflar (ekranda ve PDF'te satır arasıyla).
      text: p ? [pick(p), ...leans].join('\n\n') : none,
      cuts: [th('average'), th('high')],
      corners: [corner('low', 'low'), corner('high', 'low'), corner('low', 'high'), corner('high', 'high')],
      chartNote: pick(t.chartNote),
      groups: [t.x, t.y, t.alone].map((key) => ({
        key,
        text: pick(t.groupText[key]),
        scales: scales.find((s) => s.key === key)?.of ?? [key],
      })),
    },
    caution,
  };
}

/**
 * Sıralı ilgi ya da etkinlik profili. Bölümler yerinde sıralanır: puanı olanlar en yüksekten en düşüğe, hesaplanamayanlar
 * sonda. Aynı puandaki alanlar testteki sıralarını korur. Düzeyler şablondaki düzeylerdir (ör. düşük, orta, yüksek).
 */
function rankInterests(
  sections: ReportSection[],
  kind: InterestRanking['kind'],
  valuesTemplate?: ValuesTemplate,
  audience: Audience = 'student',
): InterestRanking {
  sections.sort((a, b) => (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY));
  const scored = sections.filter((s) => s.value !== null);
  const high = scored.filter((s) => s.band === 'high' || s.band === 'very_high');
  const noneHigh = high.length === 0;
  const values = scored.map((s) => s.value as number);
  const spread = values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
  if (kind === 'values') return rankValues(scored, values, spread, noneHigh, valuesTemplate, audience);
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

/**
 * Değer sıralaması. En önemli değerler: puanı üçüncü en yüksek puana eşit ya da ondan yüksek olanlar; eşitlik yüzünden
 * dörtten çok olursa ikinci en yüksek puana kadar olanlar, onlar da dörtten çoksa yalnızca en yüksek puandakiler; onlar
 * da dörtten çoksa hiçbiri (sıralama yapılamaz). Düşük düzeydeki ("az önemli") değer en önemliler arasına girmez. Bütün
 * puanlar aynıysa öne çıkan değer yoktur. Eşit puanlı değerler aynı sıra numarasını alır.
 */
function rankValues(
  scored: ReportSection[],
  values: number[],
  spread: number,
  noneHigh: boolean,
  t: ValuesTemplate | undefined,
  audience: Audience,
): InterestRanking {
  const notLow = scored.filter((s) => s.band !== 'low' && s.band !== 'very_low');
  let top: ReportSection[] = [];
  if (values.length > 1 && spread > 0) {
    for (const cut of [values[Math.min(2, values.length - 1)], values[1], values[0]]) {
      top = notLow.filter((s) => (s.value as number) >= cut);
      if (top.length <= 4) break;
    }
    if (top.length > 4) top = [];
  }
  const topKeys = top.map((s) => s.scaleKey);
  const rest = scored.filter((s) => !topKeys.includes(s.scaleKey));
  let bottom: ReportSection[] = [];
  if (top.length && values.length > 1) {
    const second = values[values.length - 2];
    bottom = rest.filter((s) => (s.value as number) <= second);
    if (bottom.length > 3) bottom = rest.filter((s) => s.value === values[values.length - 1]);
    if (bottom.length > 3) bottom = [];
    bottom = bottom.filter((s) => (s.value as number) <= values[0] - 1);
  }
  const pickText = (x: PairText & { adult?: string }) => (audience === 'parent' ? x.parent : audience === 'adult' ? (x.adult ?? x.student) : x.student);
  const tradeoffs = (t?.tradeoffs ?? [])
    .filter((x) => topKeys.includes(x.a) && topKeys.includes(x.b))
    .map((x) => ({ a: x.a, b: x.b, title: x.title, text: pickText(x.text) }));
  // Sona kalan değerler düzeyleriyle anılır: "çok önemli" bir değer de sıralamanın sonunda olabilir.
  const names = bottom.map((s) => `“${s.name}” (${s.bandLabel.toLocaleLowerCase('tr-TR')})`);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} ve ${names.at(-1)}` : (names[0] ?? '');
  const ranks = top.map((s) => 1 + top.filter((x) => (x.value as number) > (s.value as number)).length);
  return {
    kind: 'values',
    order: scored.map((s) => s.scaleKey),
    top: topKeys,
    noneHigh,
    flat: values.length > 1 && spread < 0.8,
    allLow: scored.length > 0 && scored.every((s) => s.band === 'low' || s.band === 'very_low'),
    bottom: bottom.map((s) => s.scaleKey),
    tradeoffs,
    ranks,
    ...(t && bottom.length
      ? { lowerText: pickText(t.lower).replace('{değerler}', list).replace('{o}', bottom.length > 1 ? 'o değerlerin' : 'o değerin') }
      : {}),
    ...(t ? { note: { title: audience === 'parent' ? t.note.title.parent : t.note.title.you, text: pickText(t.note.text) } } : {}),
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
  // Yanlışların çoğu çeldiriciyse, kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz (yanılgı cümlesi açıklar).
  const lurePattern = verbalLurePattern(r);
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
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun.${lurePattern ? '' : ' Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu.${lurePattern ? '' : ' Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
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
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin${lurePattern ? '.' : '; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${lurePattern ? '.' : '; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        );
      } else {
        const slip = !lurePattern && easyLevels.some((l) => l.correct < l.n) ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '';
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Kolay ve zor düzeylerdeki doğru cevapların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuzun kolay ve zor düzeylerdeki doğru cevapları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği.
    if (lurePattern) {
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
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lurePattern ? ' Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.' : ' Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.'}`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lurePattern ? ' Bu; yönergenin tam anlaşılmamasından, doğru cevaplar kartında anlatılan yanılgılardan ya da soruları okumakta henüz yeterince rahat olmamaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.' : ' Bu; dikkatin dağılmasından, acele etmekten, yönergenin tam anlaşılmamasından ya da soruları okumakta henüz yeterince rahat olmamaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.'}`,
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
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi${lurePattern ? '.' : ': daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi${lurePattern ? '.' : ': daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
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

/* ---------- Kâğıt katlama ---------- */

/** Kâğıt katlamada katlama türlerinin adları (raporda ve üç boyutlu grafikte) ve kısa anlatımları. */
export const FOLDING_TYPES: Record<FoldingType, { name: string; plain: string; color: string }> = {
  half: { name: 'Ortadan katlama', plain: 'kâğıt tam ortasından katlandığında delikleri katlama çizgisinin iki yanına aynalamak', color: '#2f5ce0' },
  partial: {
    name: 'Kenardan katlama',
    plain: 'kâğıdın yalnızca bir kısmı katlandığında hangi yerlerin iki kat, hangilerinin tek kat olduğunu ayırt etmek',
    color: '#0e9c8c',
  },
  diagonal: { name: 'Çapraz katlama', plain: 'kâğıt köşeden köşeye katlandığında deliği bu çapraz çizgiye göre aynalamak', color: '#ee6a36' },
};

/** Çeldiricilerin yanılgıları (yanlışların yorumunda). */
export const FOLDING_LURE_TEXT: Record<FoldingLure, string> = {
  skip: 'kâğıdı açarken bir katlamayı atlamak',
  slide: 'deliği katlama çizgisine göre aynalamak yerine kaydırmak',
  half: 'kenardan katlamayı kâğıdın ortasından katlanmış gibi açmak',
  single: 'kenardan katlamada kâğıdın tek kat kaldığı yeri iki kat sanmak',
  axis: 'deliği yanlış çizgiye göre aynalamak',
};

/** "“Ortadan katlama” ve “çapraz katlama”" gibi: tür adları tırnak içinde, ilk harfi küçük. */
const foldingTypeList = (types: FoldingType[]) =>
  joinTr(types.map((t) => `“${FOLDING_TYPES[t].name.charAt(0).toLocaleLowerCase('tr-TR')}${FOLDING_TYPES[t].name.slice(1)}”`));

/** Kâğıt katlamanın dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve katlama türlerinin üç boyutlu grafiği. */
function foldingBlocks(r: FoldingResult, task: PaperFoldingTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = r.correct <= FOLDING_CHANCE_MAX;
  const rapid = foldingRapid(r);
  const samePos = foldingSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışların çoğu çeldiriciyse, kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz (yanılgı cümlesi açıklar).
  const lurePattern = foldingLurePattern(r);
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  if (chance) {
    accText = v(
      `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${FOLDING_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da katlamalara yeterince bakmadan seçmiş de olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir.`,
      `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${FOLDING_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da katlamalara yeterince bakılmadan seçilmiş de olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir.`,
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
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun.${lurePattern ? '' : ' Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu.${lurePattern ? '' : ' Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
      );
    } else {
      // Kolay (1–2) ve zor (4–5) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const rate = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const gap = rate(easyLevels) - rate(r.levels.filter((l) => l.level >= 4));
      if (gap >= 0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça doğru cevapların azaldı. Bu beklenen bir durumdur: üst düzeylerde katlama sayısı artar ve çapraz ya da kenardan katlamalar birbirine karışır.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı. Bu beklenen bir durumdur: üst düzeylerde katlama sayısı artar ve çapraz ya da kenardan katlamalar birbirine karışır.`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin${lurePattern ? '.' : '; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${lurePattern ? '.' : '; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        );
      } else {
        const slip = !lurePattern && easyLevels.some((l) => l.correct < l.n) ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '';
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Kolay ve zor düzeylerdeki doğru cevapların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuzun kolay ve zor düzeylerdeki doğru cevapları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği; yanılgılar olasılık olarak söylenir.
    if (lurePattern) {
      const share = r.lures === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.lures} tanesinde)`;
      const phrases = FOLDING_LURES_ORDER.filter((k) => r.luresByKind[k] > 0).map((k) => FOLDING_LURE_TEXT[k]);
      const which = phrases.length > 1 ? 'şu yanılgılardan' : 'şu yanılgıdan';
      accText += v(
        ` Yanlış cevaplarının ${share} ilk bakışta doğru görünen ama katlamalara uymayan seçeneği seçtin. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. Kâğıdı son katlamadan başlayarak adım adım açmak işine yarar.`,
        ` Çocuğunuz yanlış cevaplarının ${share} ilk bakışta doğru görünen ama katlamalara uymayan seçeneği seçti. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. Kâğıdı son katlamadan başlayarak adım adım açmak ona yardım edebilir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda katlamalara bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorularda katlamalara bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('kk_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (chance) {
    duzey = { ...card('kk_duzey'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' };
  } else if (r.reached === 0) {
    duzey = {
      ...card('kk_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lurePattern ? ' Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.' : ' Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.'}`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lurePattern ? ' Bu, yönergenin tam anlaşılmamasından ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir ve tek başına yorumlanmamalıdır.' : ' Bu; dikkatin dağılmasından, acele etmekten ya da yönergenin tam anlaşılmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'}`,
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
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi${lurePattern ? '.' : ': daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi${lurePattern ? '.' : ': daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
      );
    }
    if (!next) {
      text += v(' Bu en zor düzeydi.', ' Bu, testin en zor düzeyiydi.');
    } else {
      text += v(
        ` ${next.level}. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
        ` ${next.level}. düzeyde soruların çoğunda zorlandı; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
      );
    }
    duzey = {
      ...card('kk_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki ve o düzeye kadarki soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Katlama türleri */
  const typeLine = r.types.map((x) => `${FOLDING_TYPES[x.type].name} ${x.correct}/${x.n}`).join(' · ');
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const rough = ' Her tür sekiz soruya dayanır ve her türde kolaydan zora sorular vardır; bu karşılaştırma kaba bir göstergedir.';
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('kk_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için katlama türleri karşılaştırılmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu tür sorularda ${FOLDING_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${foldingTypeList([x])} sorularında ${FOLDING_TYPES[x].plain} gerekir.`)).join(' ');
    const head =
      good.length === r.types.length
        ? `${r.types.length} katlama türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.types.length} katlama türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.types.length} katlama türünün ${good.length} tanesinde soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.types.length} katlama türünün her birinde soruların çoğunu doğru buldun: ortadan, kenardan ve çapraz katlanmış kâğıtları zihninde açabildin.`,
        `Çocuğunuz ${r.types.length} katlama türünün her birinde soruların çoğunu doğru buldu: ortadan, kenardan ve çapraz katlanmış kâğıtları zihninde açabildi.`,
      );
    } else if (good.length === 0) {
      text = v(`Hiçbir katlama türünde soruların çoğunu doğru bulamadın. ${needs}`, `Çocuğunuz hiçbir katlama türünde soruların çoğunu doğru bulamadı. ${needs}`);
    } else {
      text = v(
        `${foldingTypeList(good)} sorularının çoğunu doğru buldun; ${foldingTypeList(hard)} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${foldingTypeList(good)} sorularının çoğunu doğru buldu; ${foldingTypeList(hard)} sorularında zorlandı. ${needs}`,
      );
    }
    tur = { ...card('kk_tur'), headline: head, detail: typeLine, text: capTr(text) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} yanlış bir cevabı 2,5 saniyeden kısa sürede verdin. Bu kadar kısa sürede katlamaları izleyip seçenekleri karşılaştırmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} yanlış bir cevabı 2,5 saniyeden kısa sürede verdi. Bu kadar kısa sürede katlamaları izleyip seçenekleri karşılaştırmak çok zordur; bu sorularda tahmin edilmiş olabilir.`,
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
    calisma = { ...card('kk_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 4–5. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 4);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Zor sorularda katlama sayısı artar; kâğıdı adım adım zihninde açmak zaman alır ve iyi bir çalışma biçimidir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Zor sorularda katlama sayısı artar; kâğıdı adım adım zihinde açmak zaman alır ve iyi bir çalışma biçimidir.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Zor sorulara daha çok zaman ayırmak ve kâğıdı son katlamadan başlayarak adım adım açmak işine yarayabilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; daha çok zaman ayırmak ve kâğıdı adım adım açmak yardımcı olabilir.',
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
    calisma = {
      ...card('kk_calisma'),
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
        title: v('Katlama türlerine göre sonucun', 'Katlama türlerine göre sonuç'),
        note: v(
          'Her sütun bir katlama türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca türleri ayırır.',
          'Her sütun bir katlama türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca türleri ayırır.',
        ),
        bars: r.types.map((x) => ({
          key: x.type,
          label: FOLDING_TYPES[x.type].name,
          value: Math.round((x.correct / x.n) * 100),
          min: 0,
          max: 100,
          color: FOLDING_TYPES[x.type].color,
          valueLabel: `${x.correct}/${x.n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, duzey, tur, calisma], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Mantıksal akıl yürütme ---------- */

/** Mantıksal akıl yürütmede soru türlerinin raporda görünen kısa adları ("Eğer A ise B" kuralında). */
export const LOGIC_FORM_NAMES: Record<LogicForm, string> = {
  mp: '“A var, öyleyse B var”',
  mt: '“B yok, öyleyse A yok”',
  ac: '“B var, öyleyse A var”',
  da: '“A yok, öyleyse B yok”',
  vb: 'kesin ve gerçekte doğru',
  vu: 'kesin ama gerçekte yanlış',
  ib: 'kesin değil ama gerçekte doğru',
  iu: 'kesin değil ve gerçekte yanlış',
};

/** Soru grupları (grafikte ve üç boyutlu grafikte): adı, rengi ve sonuçtaki yeri. */
export const LOGIC_GROUPS: {
  key: 'condValid' | 'condInvalid' | 'noConflict' | 'conflict';
  name: string;
  color: string;
}[] = [
  { key: 'condValid', name: 'Eğer–ise: kesin olanlar', color: '#2f5ce0' },
  { key: 'condInvalid', name: 'Eğer–ise: kesin olmayanlar', color: '#0e9c8c' },
  { key: 'noConflict', name: 'Gerçek hayatla çatışmayanlar', color: '#d28a14' },
  { key: 'conflict', name: 'Gerçek hayatla çatışanlar', color: '#ee6a36' },
];

/**
 * Mantıksal akıl yürütmenin dört sonuç kartı, soru gruplarına göre grafik, öne çıkan sayılar ve soru gruplarının üç
 * boyutlu grafiği. Cevapların neredeyse hepsi aynı yöndeyse (`logicSameSide`) türlere göre yorum yapılmaz. Sekiz soruluk
 * bir grupta en az 6 doğru "çoğu", en çok 4 doğru "zorlanma"dır (iki seçenekte rastgele seçimin düzeyi).
 */
function logicBlocks(r: LogicResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  // Yetişkine "yetişkinler de" ya da yaşla gelişme cümlesi yazılmaz.
  const adult = audience === 'adult';
  const side = logicSameSide(r);
  const rapid = logicRapid(r);
  const good = (g: LogicGroup) => g.correct >= LOGIC_GOOD;
  const weak = (g: LogicGroup) => g.correct <= LOGIC_WEAK;
  const f = r.forms;
  const sideCount = side === 'yes' ? r.yes : r.n - r.yes;
  const sideLabel = side === 'yes' ? 'Evet, kesin olarak doğru' : 'Hayır, kesin değil';
  const notRead = 'Cevapların neredeyse hepsi aynı olduğu için bu sorular yorumlanmadı.';

  /* Doğru cevaplar */
  const below = logicBelowChance(r);
  let accText: string;
  if (side) {
    accText = v(
      `Soruların ${sideCount} tanesinde “${sideLabel}” dedin. Oysa soruların yarısında sonuç bilgilerden kesin olarak çıkıyor, yarısında çıkmıyordu. Sorulara bakmadan hep aynı cevabı vermiş ya da yönergeyi farklı anlamış olabilirsin; bu yüzden soru türlerine göre sonuçlar yorumlanmadı. Dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz soruların ${sideCount} tanesinde “${sideLabel}” dedi. Oysa soruların yarısında sonuç bilgilerden kesin olarak çıkıyor, yarısında çıkmıyordu. Sorulara bakılmadan hep aynı cevap verilmiş ya da yönerge farklı anlaşılmış olabilir; bu yüzden soru türlerine göre sonuçlar yorumlanmadı. Dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else if (r.correct >= r.n - 3) {
    accText = v(
      'Soruların hemen hepsinde doğru karar verdin: hem “eğer–ise” kurallarında hem de “bütün, bazı, hiçbir” sorularında sonucun bilgilerden kesin olarak çıkıp çıkmadığını buldun.',
      'Çocuğunuz soruların hemen hepsinde doğru karar verdi: hem “eğer–ise” kurallarında hem de “bütün, bazı, hiçbir” sorularında sonucun bilgilerden kesin olarak çıkıp çıkmadığını buldu.',
    );
  } else {
    accText = v(
      `${r.n} sorunun ${r.correct} tanesinde doğru karar verdin. Her soruda iki seçenek olduğu için rastgele seçen biri de yaklaşık yarısını doğru bulabilir; bu yüzden toplamdan çok, aşağıdaki kartlarda hangi tür sorularda zorlandığın daha çok şey söyler.`,
      `Çocuğunuz ${r.n} sorunun ${r.correct} tanesinde doğru karar verdi. Her soruda iki seçenek olduğu için rastgele seçen biri de yaklaşık yarısını doğru bulabilir; bu yüzden toplamdan çok, aşağıdaki kartlarda hangi tür sorularda zorlandığı daha çok şey söyler.`,
    );
    if (below) {
      // Rastgele seçimin de altında: çoğu zaman yönergenin farklı anlaşılması ya da seçeneklerin ters kullanılması.
      accText += v(
        ' Bu sayı, rastgele seçimde beklenenden de az. Böyle bir sonuç, yönerge farklı anlaşıldığında ya da seçenekler ters kullanıldığında ortaya çıkabilir; yönergeyi yeniden okuyup acele etmeden yeniden denemek daha doğru bir sonuç verebilir.',
        ' Bu sayı, rastgele seçimde beklenenden de az. Böyle bir sonuç, yönerge farklı anlaşıldığında ya da seçenekler ters kullanıldığında ortaya çıkabilir; çocuğunuzun yönergeyi yeniden okuyup acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.',
      );
    } else if (Math.abs(r.correct - r.n / 2) <= 4) {
      accText +=
        ' Toplamın yarıya yakın olması tek başına rastgele seçildiği anlamına gelmez: belirli bir düşünme alışkanlığı da bazı tür sorularda hep aynı yanlışı yaptırabilir.';
    }
  }
  if (rapid && !side) {
    accText += v(
      ' Bazı sorularda bilgileri okumadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
      ' Bazı sorularda bilgiler okunmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
    );
  }
  const dogru: CognitiveBlock = {
    ...card('ma_dogru'),
    headline: `${r.n} soruda ${r.correct} doğru`,
    detail: `Eğer–ise soruları ${r.conditional.correct}/${r.conditional.n} · Bütün–bazı–hiçbir soruları ${r.categorical.correct}/${r.categorical.n}`,
    text: accText,
  };

  /* Eğer–ise çıkarımları */
  const cv = r.condValid;
  const ci = r.condInvalid;
  const formList = (forms: LogicForm[]) => forms.map((x) => `${LOGIC_FORM_NAMES[x]} ${f[x].correct}/${f[x].n}`).join('; ');
  const condLine = `Kesin olanlar: ${formList(['mp', 'mt'])} · Kesin olmayanlar: ${formList(['ac', 'da'])}`;
  const beliefLine = `Çatışmayanlar: ${formList(['vb', 'iu'])} · Çatışanlar: ${formList(['vu', 'ib'])}`;
  const rule = 'Bu kural şunu söyler: A varsa B de vardır, B yoksa A da yoktur; B olduğunda ya da A olmadığında ise kesin bir şey söylenemez.';
  let kosul: CognitiveBlock;
  if (side) {
    kosul = {
      ...card('ma_kosul'),
      headline: 'Yorumlanmadı',
      detail: condLine,
      text: notRead,
    };
  } else {
    let text: string;
    if (good(cv) && good(ci)) {
      const how = cv.correct + ci.correct === cv.n + ci.n ? 'her soruda' : 'çoğunlukla';
      text = v(
        `“Eğer A ise B” kurallarından kesin olarak neyin çıktığını, neyin çıkmadığını ${how} ayırt ettin. ${rule}`,
        `Çocuğunuz “eğer A ise B” kurallarından kesin olarak neyin çıktığını, neyin çıkmadığını ${how} ayırt etti. ${rule}`,
      );
    } else if (good(cv) && weak(ci)) {
      const yes = ci.n - ci.correct;
      text = v(
        `“Eğer A ise B” kurallarında kesin olan sonuçların çoğunu buldun ama kesin olmayan ${ci.n} sonucun ${yes} tanesine de “evet” dedin. Kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez: B başka durumlarda da olabilir. Kuralı iki yönlü düşünmek çok yaygındır; ${adult ? 'araştırmalarda bu iki çıkarım sık kabul edilir' : 'araştırmalarda yetişkinler de bu iki çıkarımı sık kabul eder'}. Böyle bir soruda “B olup da A’nın olmadığı bir durum olabilir mi?” diye bir karşı örnek aramak işine yarayabilir.`,
        `Çocuğunuz “eğer A ise B” kurallarında kesin olan sonuçların çoğunu buldu ama kesin olmayan ${ci.n} sonucun ${yes} tanesine de “evet” dedi. Kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez: B başka durumlarda da olabilir. Kuralı iki yönlü düşünmek çok yaygındır; araştırmalarda yetişkinler de bu iki çıkarımı sık kabul eder. Böyle bir soruda “B olup da A’nın olmadığı bir durum olabilir mi?” diye bir karşı örnek aramak ona yardım edebilir.`,
      );
    } else if (weak(cv) && good(ci)) {
      const no = cv.n - cv.correct;
      text = v(
        `Kesin olmayan sonuçların çoğunu fark ettin ama kesin olan ${cv.n} sonucun ${no} tanesine de “hayır” dedin. Her sonuca temkinli yaklaşmış olabilirsin; oysa “eğer A ise B” kuralı, A olduğunda B’nin de olacağını ve B olmadığında A’nın da olmadığını kesin olarak söyler.`,
        `Çocuğunuz kesin olmayan sonuçların çoğunu fark etti ama kesin olan ${cv.n} sonucun ${no} tanesine de “hayır” dedi. Her sonuca temkinli yaklaşmış olabilir; oysa “eğer A ise B” kuralı, A olduğunda B’nin de olacağını ve B olmadığında A’nın da olmadığını kesin olarak söyler.`,
      );
    } else if (weak(cv) && weak(ci)) {
      text = v(
        `Bu sorularda kesin olanla kesin olmayanı ayırt etmekte zorlandın. “Eğer A ise B” kuralı şunu söyler: A varsa B de vardır; B yoksa A da yoktur. B olduğunda ya da A olmadığında ise kesin bir şey söylenemez.`,
        `Çocuğunuz bu sorularda kesin olanla kesin olmayanı ayırt etmekte zorlandı. “Eğer A ise B” kuralı şunu söyler: A varsa B de vardır; B yoksa A da yoktur. B olduğunda ya da A olmadığında ise kesin bir şey söylenemez.`,
      );
    } else {
      text = v(
        `Kesin olan ${cv.n} sonucun ${cv.correct} tanesinde, kesin olmayan ${ci.n} sonucun ${ci.correct} tanesinde doğru karar verdin.`,
        `Çocuğunuz kesin olan ${cv.n} sonucun ${cv.correct} tanesinde, kesin olmayan ${ci.n} sonucun ${ci.correct} tanesinde doğru karar verdi.`,
      );
      if (ci.correct < cv.correct) {
        text += ' Kesin olmayan sonuçlardan bazılarına “evet” denmiş: kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez.';
      } else if (cv.correct < ci.correct) {
        text +=
          ' Kesin olan sonuçlardan bazılarına “hayır” denmiş: kural, A olduğunda B’nin de olacağını ve B olmadığında A’nın da olmadığını kesin olarak söyler.';
      }
    }
    // "B yoksa A da yoktur" (olumsuz cümlelerle kurulan kesin çıkarım) ötekinden belirgin biçimde zor geldiyse.
    if (f.mt.correct <= 2 && f.mp.correct - f.mt.correct >= 2) {
      text += v(
        ` Özellikle “B yoksa A da yoktur” çıkarımında zorlandın (${f.mt.n} sorunun ${f.mt.correct} tanesi doğru); olumsuz cümlelerle kurulan bu çıkarım kesindir ama araştırmalarda da “A varsa B de vardır”dan daha az kabul edilir.`,
        ` Özellikle “B yoksa A da yoktur” çıkarımında zorlandı (${f.mt.n} sorunun ${f.mt.correct} tanesi doğru); olumsuz cümlelerle kurulan bu çıkarım kesindir ama araştırmalarda da “A varsa B de vardır”dan daha az kabul edilir.`,
      );
    }
    kosul = {
      ...card('ma_kosul'),
      headline: `Kesin olanlar ${cv.correct}/${cv.n} · Kesin olmayanlar ${ci.correct}/${ci.n}`,
      detail: condLine,
      text: text + ' Her tür dört soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
    };
  }

  /* Bilgiler ve gerçek hayat */
  const nc = r.noConflict;
  const cf = r.conflict;
  let inanc: CognitiveBlock;
  if (side) {
    inanc = {
      ...card('ma_inanc'),
      headline: 'Yorumlanmadı',
      detail: beliefLine,
      text: notRead,
    };
  } else {
    let text: string;
    const tip = v(
      ' Böyle sorularda gerçek dünyayı bir an bir kenara bırakmak, örneğin cümledeki adların yerine uydurma sözcükler koyup yeniden düşünmek işine yarayabilir.',
      ' Böyle sorularda gerçek dünyayı bir an bir kenara bırakmak, örneğin cümledeki adların yerine uydurma sözcükler koyup yeniden düşünmek ona yardım edebilir.',
    );
    if (weak(nc)) {
      text = v(
        `Sonucun gerçek hayatla çatışmadığı ${nc.n} sorunun ${nc.correct} tanesinde doğru karar verdin; bu yüzden gerçek hayatta bildiklerinin kararını ne kadar etkilediği bu sonuçtan çıkarılamaz. Bu sorularda yalnızca bilgilere bakıp sonucun onlardan kesin olarak çıkıp çıkmadığını düşünmek gerekir.`,
        `Çocuğunuz sonucun gerçek hayatla çatışmadığı ${nc.n} sorunun ${nc.correct} tanesinde doğru karar verdi; bu yüzden gerçek hayatta bildiklerinin kararını ne kadar etkilediği bu sonuçtan çıkarılamaz. Bu sorularda yalnızca bilgilere bakıp sonucun onlardan kesin olarak çıkıp çıkmadığını düşünmek gerekir.`,
      );
    } else if (good(cf)) {
      const how = cf.correct === cf.n ? 'her soruda' : 'çoğunlukla';
      text = v(
        `Sonuç gerçek hayatla çatıştığında ${how} yalnızca verilen bilgilere göre karar verdin (bu tür ${cf.n} sorunun ${cf.correct} tanesi doğru). Bunun için gerçekte doğru ya da yanlış olanı bir kenara bırakmak gerekir${adult ? '' : '; araştırmalarda bu sorulardaki başarının 12 yaşından genç yetişkinliğe doğru arttığı görülmüştür'}.`,
        `Çocuğunuz sonuç gerçek hayatla çatıştığında ${how} yalnızca verilen bilgilere göre karar verdi (bu tür ${cf.n} sorunun ${cf.correct} tanesi doğru). Bunun için gerçekte doğru ya da yanlış olanı bir kenara bırakmak gerekir; araştırmalarda bu sorulardaki başarının 12 yaşından genç yetişkinliğe doğru arttığı görülmüştür.`,
      );
    } else {
      text = v(
        `Sonucun gerçek hayatla çatışmadığı ${nc.n} sorunun ${nc.correct} tanesinde, çatıştığı ${cf.n} sorunun ${cf.correct} tanesinde doğru karar verdin.`,
        `Çocuğunuz sonucun gerçek hayatla çatışmadığı ${nc.n} sorunun ${nc.correct} tanesinde, çatıştığı ${cf.n} sorunun ${cf.correct} tanesinde doğru karar verdi.`,
      );
      if (nc.correct - cf.correct >= 2) {
        // Çatışan sorulardaki her yanlış, gerçek hayatta bilinene uyan cevaptır: hangi yönde olduğu sayısıyla yazılır.
        const errs: string[] = [];
        const ibWrong = f.ib.n - f.ib.correct;
        const vuWrong = f.vu.n - f.vu.correct;
        if (ibWrong) errs.push(`sonuç gerçekte doğruyken, bilgilerden çıkmadığı hâlde ${ibWrong} soruda “evet”`);
        if (vuWrong) errs.push(`sonuç gerçekte yanlışken, bilgilerden çıktığı hâlde ${vuWrong} soruda “hayır”`);
        text += v(
          ` Çatışan sorularda ${errs.join('; ')} dedin: bu cevapların hepsi gerçek hayatta bildiklerine uyuyordu. Gerçek hayatta bilinenin kararı etkilemesine inandırıcılık etkisi denir ve ${adult ? 'çok yaygındır' : 'yetişkinlerde de çok yaygındır'}.`,
          ` Çatışan sorularda ${errs.join('; ')} dedi: bu cevapların hepsi gerçek hayatta bildiklerine uyuyordu. Gerçek hayatta bilinenin kararı etkilemesine inandırıcılık etkisi denir ve yetişkinlerde de çok yaygındır.`,
        );
        text += tip;
      } else if (cf.correct < nc.correct) {
        text += ' İki grup arasındaki fark küçük; gerçek hayatta bilinenin kararı belirgin biçimde etkilediği söylenemez.';
      }
    }
    inanc = {
      ...card('ma_inanc'),
      headline: `Çatışan sorular ${cf.correct}/${cf.n} · Çatışmayan sorular ${nc.correct}/${nc.n}`,
      detail: beliefLine,
      text: text + ' Her grup sekiz soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
    };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    issues.push(
      v(
        `${r.n} sorunun ${r.rapid} tanesinde cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdin ve bu cevapların ${r.rapidCorrect} tanesi doğruydu; bu sorularda okumadan seçmiş olabilirsin.`,
        `Çocuğunuz ${r.n} sorunun ${r.rapid} tanesinde cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdi ve bu cevapların ${r.rapidCorrect} tanesi doğruydu; bu sorularda okumadan seçmiş olabilir.`,
      ),
    );
  }
  if (side) {
    issues.push(
      v(
        `Soruların ${sideCount} tanesinde “${sideLabel}” dedin; soruların yarısının cevabı “evet”, yarısının “hayır”dı.`,
        `Çocuğunuz soruların ${sideCount} tanesinde “${sideLabel}” dedi; soruların yarısının cevabı “evet”, yarısının “hayır”dı.`,
      ),
    );
  }
  const noLimit = v(
    ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.',
    ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru karara ulaşabilmektir.',
  );
  const yesLine = `“Evet” cevapları ${r.yes}/${r.n} (soruların yarısının cevabı “evet”)`;
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? {
          ...card('ma_calisma'),
          headline: 'Süre hesaplanamadı',
          detail: yesLine,
          text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' '),
        }
      : {
          ...card('ma_calisma'),
          headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
          detail: yesLine,
          text:
            [
              v(
                `Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`,
                `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`,
              ),
              ...issues,
            ].join(' ') + noLimit,
        };

  /* Grafikler ve öne çıkan sayılar */
  const chart: CognitiveReport['chart'] = {
    title: 'Soru gruplarına göre doğru cevaplar',
    note: v(
      'Her grupta sekiz soru vardır. İlk iki grup “eğer–ise” kurallarıdır: sonucun kesin olarak çıktığı ve çıkmadığı sorular. Son iki grup “bütün, bazı, hiçbir” sorularıdır: sonucun gerçek hayatla çatışmadığı ve çatıştığı sorular. Çatışan sorularda sonuç, bilgilerden kesin olarak çıktığı hâlde gerçekte yanlıştır ya da bilgilerden çıkmadığı hâlde gerçekte doğrudur. Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğunu doğru cevaplamışsın demektir.',
      'Her grupta sekiz soru vardır. İlk iki grup “eğer–ise” kurallarıdır: sonucun kesin olarak çıktığı ve çıkmadığı sorular. Son iki grup “bütün, bazı, hiçbir” sorularıdır: sonucun gerçek hayatla çatışmadığı ve çatıştığı sorular. Çatışan sorularda sonuç, bilgilerden kesin olarak çıktığı hâlde gerçekte yanlıştır ya da bilgilerden çıkmadığı hâlde gerçekte doğrudur. Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğu doğru cevaplanmış demektir.',
    ),
    rows: LOGIC_GROUPS.map((g) => ({
      label: g.name,
      value: r[g.key].correct,
      max: r[g.key].n,
      valueLabel: `${r[g.key].correct}/${r[g.key].n}`,
    })),
  };
  const figures = [
    { label: 'Doğru', value: `${r.correct}/${r.n}` },
    {
      label: 'Eğer–ise soruları',
      value: `${r.conditional.correct}/${r.conditional.n}`,
    },
    side
      ? { label: 'Gerçek hayatla çatışan sorular', value: 'Yorumlanmadı' }
      : {
          label: 'Gerçek hayatla çatışan sorular',
          value: `${cf.correct}/${cf.n}`,
        },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = side
    ? undefined
    : {
        title: v('Soru gruplarına göre sonucun', 'Soru gruplarına göre sonuç'),
        note: v(
          'Her sütun sekiz soruluk bir gruptur. Sütun ne kadar yüksekse o gruptaki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca grupları ayırır.',
          'Her sütun sekiz soruluk bir gruptur. Sütun ne kadar yüksekse o gruptaki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca grupları ayırır.',
        ),
        bars: LOGIC_GROUPS.map((g) => ({
          key: g.key,
          label: g.name,
          value: Math.round((r[g.key].correct / r[g.key].n) * 100),
          min: 0,
          max: 100,
          color: g.color,
          valueLabel: `${r[g.key].correct}/${r[g.key].n}`,
          band: '',
        })),
      };
  return {
    blocks: [dogru, kosul, inanc, calisma],
    chart,
    figures,
    ...(profile ? { profile } : {}),
  };
}

/* ---------- Sayısal akıl yürütme ---------- */

/** Soru grupları (grafikte ve üç boyutlu grafikte): adı, rengi ve sonuçtaki yeri. */
export const NUMERIC_GROUPS: { key: 'prop' | 'nonProp' | 'equal'; name: string; color: string }[] = [
  { key: 'prop', name: 'Orantılı durumlar', color: '#2f5ce0' },
  { key: 'nonProp', name: 'Orantılı olmayan durumlar', color: '#0e9c8c' },
  { key: 'equal', name: 'Eşitlik ve denge', color: '#d28a14' },
];

/**
 * Sayısal akıl yürütmenin dört sonuç kartı, soru gruplarına göre grafik, öne çıkan sayılar ve soru gruplarının üç
 * boyutlu grafiği. Cevaplar yazıldığı için rastgele seçim düzeyi yoktur; yanılgılar, yanılgı cevaplarının sayısıyla
 * anlatılır: bir tür en az iki cevapta görülünce; yalnızca iki soruda olabilen ters orantı ve terazi yanılgıları tek
 * cevapta. Sekiz soruluk bir grupta en az 6 doğru "çoğu"dur.
 */
function numericBlocks(r: NumericResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  // Yetişkine öğrencilerle yapılan araştırmaların sınıflara göre bulguları yazılmaz.
  const adult = audience === 'adult';
  const rapid = numericRapid(r);
  const good = (g: NumericGroup) => g.correct >= NUMERIC_GOOD;
  const k = r.kinds;
  const manyBlank = r.blank >= NUMERIC_BLANK_MANY;

  /* Doğru cevaplar */
  let accText: string;
  if (r.correct >= r.n - 2) {
    // "Hem … hem …" yalnızca üç grubun her birinde en çok bir yanlış varken: ötekinde aşağıdaki kartlar yanılgıyı anlatır.
    const allGroups = [r.prop, r.nonProp, r.equal].every((g) => g.correct >= g.n - 1);
    accText = allGroups
      ? v(
          'Soruların hemen hepsinde doğru cevap verdin: hem günlük durumlarda hem de eşitliklerde sayılar arasındaki ilişkiyi doğru kurdun.',
          'Çocuğunuz soruların hemen hepsinde doğru cevap verdi: hem günlük durumlarda hem de eşitliklerde sayılar arasındaki ilişkiyi doğru kurdu.',
        )
      : v(
          `${r.n} sorunun ${r.correct} tanesinde doğru cevap verdin; aşağıdaki kartlar yanıldığın birkaç sorunun hangi türden olduğunu gösterir.`,
          `Çocuğunuz ${r.n} sorunun ${r.correct} tanesinde doğru cevap verdi; aşağıdaki kartlar yanıldığı birkaç sorunun hangi türden olduğunu gösterir.`,
        );
  } else {
    accText = v(
      `${r.n} sorunun ${r.correct} tanesinde doğru cevap verdin. Toplamdan çok, aşağıdaki kartlarda hangi tür sorularda hangi yanılgının görüldüğü daha çok şey söyler.`,
      `Çocuğunuz ${r.n} sorunun ${r.correct} tanesinde doğru cevap verdi. Toplamdan çok, aşağıdaki kartlarda hangi tür sorularda hangi yanılgının görüldüğü daha çok şey söyler.`,
    );
  }
  if (manyBlank) {
    accText += v(
      ` Soruların ${r.blank} tanesinde “Bilmiyorum” dediğin için türlere göre sonuçlar dikkatle okunmalı.`,
      ` Soruların ${r.blank} tanesinde “Bilmiyorum” denildiği için türlere göre sonuçlar dikkatle okunmalı.`,
    );
  }
  if (rapid) {
    accText += v(
      ' Bazı sorulara soruyu okumadan cevap vermiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
      ' Bazı sorulara soru okunmadan cevap verilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
    );
  }
  const dogru: CognitiveBlock = {
    ...card('sy_dogru'),
    headline: `${r.n} soruda ${r.correct} doğru`,
    detail: `Durum soruları ${r.prop.correct + r.nonProp.correct}/${r.prop.n + r.nonProp.n} · Eşitlik soruları ${r.equal.correct}/${r.equal.n}`,
    text: accText,
  };

  /* Orantı mı, fark mı? */
  const P = r.prop;
  const N = r.nonProp;
  const add = r.lures.additive;
  const pro = r.lures.proportional;
  const inv = r.lures.inverse;
  let oText: string;
  if (good(P) && good(N)) {
    const how = P.correct + N.correct === P.n + N.n ? 'her soruda' : 'çoğunlukla';
    oText = v(
      `İki niceliğin aynı oranda büyüdüğü durumları, aradaki farkın korunduğu, bir başlangıç miktarının olduğu ya da sonucun hiç değişmediği durumlardan ${how} ayırt ettin.`,
      `Çocuğunuz iki niceliğin aynı oranda büyüdüğü durumları, aradaki farkın korunduğu, bir başlangıç miktarının olduğu ya da sonucun hiç değişmediği durumlardan ${how} ayırt etti.`,
    );
  } else {
    oText = v(
      `Orantılı ${P.n} durumun ${P.correct} tanesinde, orantılı olmayan ${N.n} durumun ${N.correct} tanesinde doğru cevap verdin.`,
      `Çocuğunuz orantılı ${P.n} durumun ${P.correct} tanesinde, orantılı olmayan ${N.n} durumun ${N.correct} tanesinde doğru cevap verdi.`,
    );
  }
  if (add >= NUMERIC_LURE_NOTE) {
    oText += v(
      ` Orantılı durumların ${add} tanesinde iki sayı arasındaki farkı korudun. Oysa bu durumlarda fark değil oran korunur: biri iki katına çıkınca öteki de iki katına çıkar (3 bardak suya 1 limon sıkılıyorsa 6 bardak suya 2 limon sıkılır).`,
      ` Çocuğunuz orantılı durumların ${add} tanesinde iki sayı arasındaki farkı korudu. Oysa bu durumlarda fark değil oran korunur: biri iki katına çıkınca öteki de iki katına çıkar (3 bardak suya 1 limon sıkılıyorsa 6 bardak suya 2 limon sıkılır).`,
    );
    if (!adult) oText += ' Araştırmalarda bu yanılgının ilkokulda ve ortaokulun ilk yıllarında çok yaygın olduğu, lise yıllarında azaldığı görülmüştür.';
  }
  if (pro >= NUMERIC_LURE_NOTE) {
    const why = [
      ...(r.propLures.a ? ['aynı hızla ilerleyen iki şeyde aradaki fark hep aynı kalır'] : []),
      ...(r.propLures.f ? ['başlangıçta var olan miktar katlanmaz, yalnızca sonradan eklenen kısım artar'] : []),
      ...(r.propLures.c ? ['bazı durumlarda miktar artsa da sonuç hiç değişmez'] : []),
    ];
    oText += v(
      ` Orantılı olmayan durumların ${pro} tanesinde orantı kurdun. Oysa her durum orantılı değildir: ${why.join('; ')}.`,
      ` Çocuğunuz orantılı olmayan durumların ${pro} tanesinde orantı kurdu. Oysa her durum orantılı değildir: ${why.join('; ')}.`,
    );
    if (!adult) oText += ' Araştırmalarda bu yanılgının orantının öğretildiği yıllarda arttığı, lisede de sık görüldüğü bulunmuştur.';
  }
  // Bu yanılgı yalnızca bir soruda (değişmeyen durum) olabildiği için tek cevapta anlatılır.
  if (inv >= 1) {
    oText += v(
      ' Bir soruda miktar artınca süreyi kısalttın; oysa o durumda süre hiç değişmiyordu.',
      ' Çocuğunuz bir soruda miktar artınca süreyi kısalttı; oysa o durumda süre hiç değişmiyordu.',
    );
  }
  if (numericNumberDriven(r)) {
    const counts = `sayıların birbirinin katı olmadığı ${r.pFrac.n} orantılı durumun ${r.fracAdditive} tanesinde fark, sayıların birbirinin katı olduğu ve farkın korunduğu ${r.aInt.n} durumun ${r.intProportional} tanesinde orantı`;
    oText += v(
      ` Yöntemi durumdan çok sayılara bakarak seçmiş olabilirsin: ${counts} kurdun.${adult ? '' : ' Araştırmalarda da sayılar birbirinin katı olduğunda orantının, olmadığında farkın daha sık kullanıldığı görülmüştür.'}`,
      ` Çocuğunuz yöntemi durumdan çok sayılara bakarak seçmiş olabilir: ${counts} kurdu. Araştırmalarda da sayılar birbirinin katı olduğunda orantının, olmadığında farkın daha sık kullanıldığı görülmüştür.`,
    );
  }
  if (add >= NUMERIC_LURE_NOTE || pro >= NUMERIC_LURE_NOTE) {
    oText += v(
      ' Böyle sorularda önce “Biri iki katına çıkınca öteki de iki katına çıkar mı?” diye sormak işine yarayabilir.',
      ' Böyle sorularda önce “Biri iki katına çıkınca öteki de iki katına çıkar mı?” diye sormak çocuğunuza yardım edebilir.',
    );
  }
  const oranti: CognitiveBlock = {
    ...card('sy_oranti'),
    headline: `Orantılı ${P.correct}/${P.n} · Orantılı olmayan ${N.correct}/${N.n}`,
    detail: `Orantılı: sayılar birbirinin katı ${r.pInt.correct}/${r.pInt.n}; katı değil ${r.pFrac.correct}/${r.pFrac.n} · Orantılı olmayan: fark korunan ${k.a.correct}/${k.a.n}; başta bir miktar olan ${k.f.correct}/${k.f.n}; değişmeyen ${k.c.correct}/${k.c.n}`,
    text: oText + ' Her tür birkaç soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
  };

  /* Eşitlik ve denge */
  const E = r.equal;
  const op = r.lures.operational;
  const rev = r.lures.reverse;
  const part = r.lures.partial;
  let eText: string;
  // "Çoğunlukla buldun" yalnızca eşitlik yanılgılarından biri iki ya da daha çok cevapta görülmemişken.
  if (good(E) && op < NUMERIC_LURE_NOTE && rev < NUMERIC_LURE_NOTE) {
    const how = E.correct === E.n ? 'her soruda' : 'çoğunlukla';
    eText = v(
      `Eşitliğin iki yanının aynı değerde olduğunu kullanarak eksik sayıyı ${how} buldun.`,
      `Çocuğunuz eşitliğin iki yanının aynı değerde olduğunu kullanarak eksik sayıyı ${how} buldu.`,
    );
  } else {
    eText = v(
      `${E.n} eşitlik ve denge sorusunun ${E.correct} tanesinde doğru cevap verdin.`,
      `Çocuğunuz ${E.n} eşitlik ve denge sorusunun ${E.correct} tanesinde doğru cevap verdi.`,
    );
  }
  if (op >= NUMERIC_LURE_NOTE) {
    eText += v(
      ` ${op} soruda eşittir işaretinin solundaki işlemin sonucunu ya da bütün sayıların toplamını yazdın: “=” işaretini “sonuç şudur” diye okumuş olabilirsin. Oysa “=” iki yanın aynı değerde olduğunu söyler: 5 + 3 = 6 + 2 gibi.`,
      ` Çocuğunuz ${op} soruda eşittir işaretinin solundaki işlemin sonucunu ya da bütün sayıların toplamını yazdı: “=” işaretini “sonuç şudur” diye okumuş olabilir. Oysa “=” iki yanın aynı değerde olduğunu söyler: 5 + 3 = 6 + 2 gibi.`,
    );
    if (!adult) eText += ' Araştırmalarda ortaokul öğrencilerinin önemli bir kısmının eşittir işaretini “sonuç” anlamında tanımladığı görülmüştür.';
  }
  if (rev >= NUMERIC_LURE_NOTE) {
    eText += v(
      ` ${rev} soruda bir sayı değişince ötekini ters yönde değiştirdin. Eşitliğin iki yanı aynı kalsın diye toplamada ve çarpmada biri büyüyünce öteki küçülür; çıkarmada ve bölmede ikisi birlikte büyür ya da birlikte küçülür.`,
      ` Çocuğunuz ${rev} soruda bir sayı değişince ötekini ters yönde değiştirdi. Eşitliğin iki yanı aynı kalsın diye toplamada ve çarpmada biri büyüyünce öteki küçülür; çıkarmada ve bölmede ikisi birlikte büyür ya da birlikte küçülür.`,
    );
  }
  // Terazi soruları iki tane olduğu için bu yanılgı tek cevapta anlatılır.
  if (part >= 1) {
    eText += v(
      ` Terazi sorularının ${part} tanesinde terazilerin verdiği bilgilerden birini hesaba katmamış olabilirsin: iki kefenin aynı ağırlıkta olduğunu kullanarak adım adım ilerlemek işine yarayabilir.`,
      ` Çocuğunuz terazi sorularının ${part} tanesinde terazilerin verdiği bilgilerden birini hesaba katmamış olabilir: iki kefenin aynı ağırlıkta olduğunu kullanarak adım adım ilerlemek çocuğunuza yardım edebilir.`,
    );
  }
  const esitlik: CognitiveBlock = {
    ...card('sy_esitlik'),
    headline: `${E.n} soruda ${E.correct} doğru`,
    detail: `Eşittir işareti ${k.eq.correct}/${k.eq.n} · Denkleştirme ${k.comp.correct}/${k.comp.n} · Terazi ${k.bal.correct}/${k.bal.n}`,
    text: eText + ' Her tür birkaç soruya dayanır; bu kaba bir göstergedir.',
  };

  /* Çalışma biçimi */
  const issues: string[] = [];
  const fastRight = r.rapidCorrect === 0 ? 'bu cevapların hiçbiri doğru değildi' : `bu cevapların yalnızca ${r.rapidCorrect} tanesi doğruydu`;
  if (rapid) {
    issues.push(
      v(
        `${r.n} sorunun ${r.rapid} tanesinde cevabı, soruyu okumaya yetmeyecek kadar kısa sürede verdin ve ${fastRight}; bu sorularda okumadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${r.n} sorunun ${r.rapid} tanesinde cevabı, soruyu okumaya yetmeyecek kadar kısa sürede verdi ve ${fastRight}; bu sorularda okumadan cevap vermiş olabilir.`,
      ),
    );
  }
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru sonuca ulaşabilmektir.');
  const blankLine = `“Bilmiyorum” ${r.blank}/${r.n}`;
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? { ...card('sy_calisma'), headline: 'Süre hesaplanamadı', detail: blankLine, text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') }
      : {
          ...card('sy_calisma'),
          headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
          detail: blankLine,
          text:
            [v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`), ...issues].join(' ') + noLimit,
        };

  /* Grafikler ve öne çıkan sayılar */
  const groupNote =
    'Her grupta sekiz soru vardır. Orantılı durumlarda iki nicelik aynı oranda büyür; orantılı olmayan durumlarda aradaki fark korunur, bir başlangıç miktarı vardır ya da sonuç hiç değişmez; eşitlik ve denge sorularında eşitliğin ya da terazinin iki yanı aynı değerdedir.';
  const chart: CognitiveReport['chart'] = {
    title: 'Soru gruplarına göre doğru cevaplar',
    note: v(
      `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğu doğru cevaplanmış demektir.`,
    ),
    rows: NUMERIC_GROUPS.map((g) => ({ label: g.name, value: r[g.key].correct, max: r[g.key].n, valueLabel: `${r[g.key].correct}/${r[g.key].n}` })),
  };
  const figures = [
    { label: 'Doğru', value: `${r.correct}/${r.n}` },
    { label: 'Durum soruları', value: `${r.prop.correct + r.nonProp.correct}/${r.prop.n + r.nonProp.n}` },
    { label: 'Eşitlik soruları', value: `${r.equal.correct}/${r.equal.n}` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = {
    title: v('Soru gruplarına göre sonucun', 'Soru gruplarına göre sonuç'),
    note: v(
      'Her sütun sekiz soruluk bir gruptur. Sütun ne kadar yüksekse o gruptaki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca grupları ayırır.',
      'Her sütun sekiz soruluk bir gruptur. Sütun ne kadar yüksekse o gruptaki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca grupları ayırır.',
    ),
    bars: NUMERIC_GROUPS.map((g) => ({
      key: g.key,
      label: g.name,
      value: Math.round((r[g.key].correct / r[g.key].n) * 100),
      min: 0,
      max: 100,
      color: g.color,
      valueLabel: `${r[g.key].correct}/${r[g.key].n}`,
      band: '',
    })),
  };
  return { blocks: [dogru, oranti, esitlik, calisma], chart, figures, profile };
}

/* ---------- Gizli şekiller ---------- */

/** Yanlış seçeneklerin yanılgıları (yanlışların yorumunda) ve her yanılgı için kısa bir ipucu. */
export const HIDDEN_LURE_TEXT: Record<HiddenLure, string> = {
  turned: 'şeklin döndürülmüş ya da ters çevrilmiş biçimini seçmek',
  changed: 'şeklin bir köşesi farklı olan benzerini seçmek',
};
export const HIDDEN_LURE_TIP: Record<HiddenLure, { you: string; parent: string }> = {
  turned: {
    you: 'Döndürülmüş ya da ayna görüntüsü gibi ters çevrilmiş bir şekil, aranan şekille aynı sayılmaz. Bulduğun şeklin eğik kenarlarının ve köşelerinin üstteki şekildekilerle aynı yöne bakıp bakmadığını denetlemek işine yarayabilir.',
    parent: 'Döndürülmüş ya da ayna görüntüsü gibi ters çevrilmiş bir şekil, aranan şekille aynı sayılmaz. Çocuğunuzun, bulduğu şeklin eğik kenarlarının ve köşelerinin üstteki şekildekilerle aynı yöne bakıp bakmadığını denetlemesi yardımcı olabilir.',
  },
  changed: {
    you: 'Şekle benzeyen bir yer bulununca, kenarları tek tek denetlemeden karar vermek kolaydır. Bulduğun yerde şeklin her kenarını ve köşesini üstteki şekille tek tek karşılaştırmak işine yarayabilir.',
    parent: 'Şekle benzeyen bir yer bulununca, kenarları tek tek denetlemeden karar vermek kolaydır. Çocuğunuzun, bulduğu yerde şeklin her kenarını ve köşesini üstteki şekille tek tek karşılaştırması yardımcı olabilir.',
  },
};

/** Yanlışlarda seçilen şeklin adı ("… seçildi" cümlesinde). */
const HIDDEN_LURE_SEEN: Record<HiddenLure, string> = {
  turned: 'şeklin döndürülmüş ya da ters çevrilmiş biçimi',
  changed: 'şeklin bir köşesi farklı benzeri',
};

/** Gizli şekillerin dört sonuç kartı, düzeylere göre grafik ve öne çıkan sayılar. */
function hiddenBlocks(r: HiddenResult, task: HiddenFiguresTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = r.correct <= HIDDEN_CHANCE_MAX;
  const rapid = hiddenRapid(r);
  const samePos = hiddenSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışlarda beklenenden sık görülen yanılgılar anlatılır; o zaman kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
  // Sonuç kuşkuluysa (çok hızlı ya da hep aynı yer) dikkatsizlik de yanılgı da yorumlanmaz.
  const noted = chance || doubt ? [] : HIDDEN_LURES_ORDER.filter((k) => hiddenLureStandsOut(r, k));
  const lureNoted = noted.length > 0;
  const blameSlip = !lureNoted && !doubt;
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);
  const intro = `Şekiller kolaydan zora doğru ${levelWord} düzeyde giderek daha iyi saklanıyordu.`;
  // Kolay sorulardaki yanlışlar dikkat ya da aceleyle açıklanacaksa bu yalnızca bir kartta söylenir: "Ulaşılan düzey"
  // kartı kolay düzeydeki yanlışları anlatıyorsa orada, anlatmıyorsa "Doğru cevaplar" kartında.
  const slipsBelow = r.levels.filter((l) => l.level < r.reached && !passed(l));
  const levelCardBlames = blameSlip && !chance && (r.reached === 0 || slipsBelow.length > 0);
  const blameHere = blameSlip && !levelCardBlames;

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  // Dört seçenekte rastgele seçen biri 20 soruda ortalama 5 doğru bulur; 2 ya da daha azı şanstan da düşüktür.
  const belowChance = r.correct <= Math.floor(r.n / 4) - 3;
  if (chance) {
    accText = v(
      `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${HIDDEN_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da çizimlere yeterince bakmadan seçmiş de olabilirsin.${belowChance ? ' Doğru cevapların rastgele seçen birinden beklenenden de az olduğu için yönergeyi farklı anlamış olabilirsin (aranan şeklin döndürülmüş ya da ters çevrilmiş biçimi doğru cevap sayılmaz).' : ''} Bu sonuç tek başına bir şey söylemez; iyi dinlendiğin bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${HIDDEN_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da çizimlere yeterince bakılmadan seçilmiş de olabilir.${belowChance ? ' Doğru cevaplar rastgele seçen birinden beklenenden de az olduğu için yönerge farklı anlaşılmış olabilir (aranan şeklin döndürülmüş ya da ters çevrilmiş biçimi doğru cevap sayılmaz).' : ''} Bu sonuç yorumlanmamalıdır; iyi dinlendiği bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    const easyMissed = first.n - first.correct;
    const higher = r.levels.slice(1);
    const higherRate = higher.reduce((a, l) => a + l.correct, 0) / Math.max(1, higher.reduce((a, l) => a + l.n, 0));
    // Daha zor bir düzeyde hem ölçüte ulaşılmış hem 1. düzeyden çok doğru verilmiş olmalı.
    const higherPassed = r.levels.slice(1).some((l) => passed(l) && l.correct > first.correct);
    if (r.correct === r.n) {
      accText = v(
        `${intro} Bütün soruları doğru cevapladın; en zor düzeyde kenarları başka çizgilere karışmış şekilleri de çevresindeki çizgilerden ayırabildin.`,
        `${intro} Çocuğunuz bütün soruları doğru cevapladı; en zor düzeyde kenarları başka çizgilere karışmış şekilleri de çevresindeki çizgilerden ayırabildi.`,
      );
    } else if (r.levels.every((l) => l.n - l.correct <= 1)) {
      accText = v(
        `${intro} Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor düzeyde kenarları başka çizgilere karışmış şekilleri de çevresindeki çizgilerden ayırabildin.`,
        `${intro} Çocuğunuz bütün düzeylerde soruların hemen hepsini doğru cevapladı; en zor düzeyde kenarları başka çizgilere karışmış şekilleri de çevresindeki çizgilerden ayırabildi.`,
      );
    } else if (easyMissed >= 2 && higherPassed && higherRate > 0.5) {
      const which = easyMissed === first.n ? '1. düzeydeki kolay soruların hiçbirini' : `1. düzeydeki kolay sorulardan ${easyMissed} tanesini`;
      const share = higherRate === 1 ? 'hepsini' : 'çoğunu';
      accText = v(
        `${intro} ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların ${share} doğru buldun.${blameHere ? ' Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : ''}`,
        `${intro} Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların ${share} doğru buldu.${blameHere ? ' Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : ''}`,
      );
    } else {
      // Kolay (1–2) ve zor (3–4) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const rate = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const hardRate = rate(r.levels.filter((l) => l.level >= 3));
      const gap = rate(easyLevels) - hardRate;
      if (gap >= 0.15) {
        accText = v(
          `${intro} Şekiller daha iyi saklandıkça doğru cevapların azaldı.${doubt ? '' : ' Bu beklenen bir durumdur: üst düzeylerde şeklin kenarları çizimdeki başka çizgilerin parçası olur ve köşelerine başka çizgiler değer; şekli bu çizgilerden ayırmak daha çok dikkat ve zaman ister.'}`,
          `${intro} Şekiller daha iyi saklandıkça çocuğunuzun doğru cevapları azaldı.${doubt ? '' : ' Bu beklenen bir durumdur: üst düzeylerde şeklin kenarları çizimdeki başka çizgilerin parçası olur ve köşelerine başka çizgiler değer; şekli bu çizgilerden ayırmak daha çok dikkat ve zaman ister.'}`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `${intro} Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin${blameHere ? '; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
          `${intro} Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${blameHere ? '; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
        );
      } else {
        const slip =
          blameHere && hardRate >= MATRIX_LEVEL_PASS && easyLevels.some((l) => l.correct < l.n)
            ? v(' Kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.', ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.')
            : '';
        accText = v(
          `${intro} Kolay ve zor düzeylerdeki doğru cevap oranların birbirine yakındı; genellikle şekiller daha iyi saklandıkça doğru cevaplar azalır.${slip}`,
          `${intro} Çocuğunuzun kolay ve zor düzeylerdeki doğru cevap oranları birbirine yakındı; genellikle şekiller daha iyi saklandıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    if (lureNoted) {
      accText += v(' Yanlış cevaplarında öne çıkan yanılgı için “Yanlışlarda seçilen şekiller” kartına bak.', ' Yanlış cevaplarda öne çıkan yanılgı için “Yanlışlarda seçilen şekiller” kartına bakın.');
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda çizimlere bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorularda çizimlere bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('gs_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (chance) {
    duzey = { ...card('gs_duzey'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' };
  } else if (r.reached === 0) {
    const highLevels = r.levels.filter((l) => l.level > 1 && passed(l));
    const highPassed = highLevels.map((l) => `${l.level}.`);
    const highShare = highLevels.every((l) => l.correct === l.n) ? 'hepsini' : 'çoğunu';
    duzey = {
      ...card('gs_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki soruların ve o düzeye kadarki bütün soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${highPassed.length ? ` ${joinTr(highPassed)} düzeydeki soruların ${highShare} doğru bulmana rağmen, kolay düzeylerdeki yanlışlar yüzünden ölçüte ulaşılmadı.` : ''}${lureNoted ? ' Bu, yönergeyi tam anlamamaktan ya da “Yanlışlarda seçilen şekiller” kartında anlatılan yanılgıdan kaynaklanabilir.' : doubt ? ' Çalışma biçimi kartında anlatılan nedenle bu sonuç tek başına bir şey söylemez.' : levelCardBlames ? ' Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.' : ''}`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki soruların ve o düzeye kadarki bütün soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${highPassed.length ? ` Çocuğunuz ${joinTr(highPassed)} düzeydeki soruların ${highShare} doğru bulmasına rağmen, kolay düzeylerdeki yanlışlar yüzünden ölçüte ulaşılmadı.` : ''}${lureNoted ? ' Bu, yönergenin tam anlaşılmamasından ya da “Yanlışlarda seçilen şekiller” kartında anlatılan yanılgıdan kaynaklanabilir ve tek başına yorumlanmamalıdır.' : doubt ? ' Çalışma biçimi kartında anlatılan nedenle bu sonuç tek başına yorumlanmamalıdır.' : levelCardBlames ? ' Bu; dikkatin dağılmasından, acele etmekten ya da yönergenin tam anlaşılmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.' : ''}`,
      ),
    };
  } else {
    const def = task.levels.find((l) => l.level === r.reached)!;
    const next = task.levels.find((l) => l.level === r.reached + 1);
    const lower = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1).replace(/\.$/, '');
    const upLevels = r.levels.filter((l) => l.level <= r.reached);
    const share = upLevels.every((l) => l.correct === l.n) ? 'hepsini' : upLevels.every((l) => l.n - l.correct <= 1) ? 'hemen hepsini' : 'çoğunu';
    const upTo =
      r.reached === 1
        ? v(`1. düzeydeki soruların ${share} doğru cevapladın`, `Çocuğunuz 1. düzeydeki soruların ${share} doğru cevapladı`)
        : v(`1–${r.reached}. düzeylerdeki soruların ${share} doğru cevapladın`, `Çocuğunuz 1–${r.reached}. düzeylerdeki soruların ${share} doğru cevapladı`);
    let text = `${upTo}. ${r.reached}. düzeydeki sorularda şu gerekiyordu: ${lower(def.plain)}.`;
    const slips = slipsBelow.map((l) => `${l.level}.`);
    if (slips.length) {
      text += v(
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi${levelCardBlames ? ': daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi${levelCardBlames ? ': daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
      );
    }
    const nextRes = next ? r.levels.find((l) => l.level === next.level) : undefined;
    let hedged = false;
    if (!next || !nextRes) {
      text += ` ${r.reached}. düzey testin en zor düzeyiydi.`;
    } else if (rapid && next.level >= 3) {
      hedged = true;
      // Çok hızlı yanlışlar 3. düzey ve üstündedir: bu düzeylerdeki sonuç yorumlanmaz.
      const rest = next.level === r.levels[r.levels.length - 1].level ? `${next.level}. düzeydeki sonuç` : `${next.level}. düzey ve üstündeki sonuç`;
      text += v(
        ` 3. düzey ve üstündeki sorulardan bazılarında çok hızlı cevap verdiğin için ${rest} yorumlanmadı.`,
        ` 3. düzey ve üstündeki sorulardan bazılarında çok hızlı cevap verildiği için ${rest} yorumlanmadı.`,
      );
    } else {
      const hard = nextRes.correct === 0 ? v('soruların hiçbirini doğru bulamadın', 'soruların hiçbirini doğru bulamadı') : v('soruların çoğunda zorlandın', 'soruların çoğunda zorlandı');
      text += ` ${next.level}. düzeyde ${hard}; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`;
    }
    if (doubt && !hedged) {
      text += v(' Çalışma biçimi kartında anlatılan nedenle bu sonuç da dikkatle okunmalı.', ' Çalışma biçimi kartında anlatılan nedenle bu sonuç da dikkatle okunmalıdır.');
    }
    duzey = {
      ...card('gs_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki soruların ve o düzeye kadarki bütün soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Yanlışlarda seçilen şekiller */
  const lureLine =
    r.wrong > 0 ? `${r.wrong} yanlış · döndürülmüş ya da ters çevrilmiş ${r.luresByKind.turned} · köşesi farklı ${r.luresByKind.changed}` : undefined;
  let yanilgi: CognitiveBlock;
  if (chance) {
    yanilgi = { ...card('gs_yanilgi'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için yanlışlarda seçilen şekiller yorumlanmadı.' };
  } else if (r.wrong === 0) {
    yanilgi = {
      ...card('gs_yanilgi'),
      headline: 'Yanlış cevap yok',
      text: v(
        'Hiçbir soruda şeklin döndürülmüş ya da ters çevrilmiş biçimini ya da bir köşesi farklı benzerini seçmedin; şeklin hem biçimine hem yönüne dikkat ettin.',
        'Çocuğunuz hiçbir soruda şeklin döndürülmüş ya da ters çevrilmiş biçimini ya da bir köşesi farklı benzerini seçmedi; şeklin hem biçimine hem yönüne dikkat etti.',
      ),
    };
  } else {
    const how = 'Her sorudaki yanlış seçeneklerin birinde ya da ikisinde şeklin döndürülmüş ya da ters çevrilmiş biçimi, ötekilerde bir köşesi farklı benzeri saklıydı.';
    let text: string;
    let head: string;
    if (doubt) {
      head = 'Yorumlanmadı';
      text = v(
        `${how} Çalışma biçimi kartında anlatılan nedenle yanlışlarda seçilen şekiller yorumlanmadı.`,
        `${how} Çalışma biçimi kartında anlatılan nedenle yanlışlarda seçilen şekiller yorumlanmadı.`,
      );
    } else if (lureNoted) {
      head = noted.length > 1 ? 'İki yanılgı da öne çıkıyor' : noted[0] === 'turned' ? 'Döndürülmüş biçimler öne çıkıyor' : 'Köşesi farklı benzerler öne çıkıyor';
      const phrases = noted.map((x) => `${HIDDEN_LURE_TEXT[x]} (${r.luresByKind[x]} yanlışta)`);
      const which = noted.length > 1 ? 'şu yanılgılar' : 'şu yanılgı';
      text = v(
        `${how} ${r.wrong} yanlış cevabında ${which}, seçeneklerde bulunma sıklığına göre beklenenden sık görüldü: ${joinTr(phrases)}. ${noted.map((x) => HIDDEN_LURE_TIP[x].you).join(' ')}`,
        `${how} Çocuğunuzun ${r.wrong} yanlış cevabında ${which}, seçeneklerde bulunma sıklığına göre beklenenden sık görüldü: ${joinTr(phrases)}. ${noted.map((x) => HIDDEN_LURE_TIP[x].parent).join(' ')}`,
      );
    } else if (r.wrong >= HIDDEN_LURE_NOTE) {
      head = 'Belirgin bir yanılgı yok';
      const only = HIDDEN_LURES_ORDER.find((k) => r.luresByKind[k] === r.wrong);
      text = only
        ? v(
            `${how} ${r.wrong} yanlış cevabının hepsinde ${HIDDEN_LURE_SEEN[only]} seçildi; ancak yanlış cevap sayısı, bunun rastlantı olmadığını söylemeye yetmiyor.`,
            `${how} Çocuğunuzun ${r.wrong} yanlış cevabının hepsinde ${HIDDEN_LURE_SEEN[only]} seçildi; ancak yanlış cevap sayısı, bunun rastlantı olmadığını söylemeye yetmiyor.`,
          )
        : v(
            `${how} ${r.wrong} yanlış cevabın iki türe de dağılıyor; hiçbiri, seçeneklerde bulunma sıklığına göre beklenenden sık görülmedi.`,
            `${how} Çocuğunuzun ${r.wrong} yanlış cevabı iki türe de dağılıyor; hiçbiri, seçeneklerde bulunma sıklığına göre beklenenden sık görülmedi.`,
          );
    } else {
      head = r.wrong === 1 ? 'Bir yanlış' : `${r.wrong} yanlış`;
      text = v(
        `${how} Yanlış cevapların çok az olduğu için hangi yanılgının öne çıktığı söylenemez.`,
        `${how} Çocuğunuzun yanlış cevapları çok az olduğu için hangi yanılgının öne çıktığı söylenemez.`,
      );
    }
    yanilgi = { ...card('gs_yanilgi'), headline: head, detail: lureLine, text };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede şekli dört kalabalık çizimde aramak zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede şekli dört kalabalık çizimde aramak zordur; bu sorularda tahmin edilmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakılmadan aynı yere basılmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan şekli doğru bulabilmektir.');
  if (r.medianRt === null) {
    calisma = { ...card('gs_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 3–4. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && !chance && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 3);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Şekiller iyi saklandığında aramaya daha çok zaman ayırdın. Kalabalık bir çizimde şekli kenar kenar aramak zaman alır; bu iyi bir çalışma biçimidir.',
          'Çocuğunuz şekiller iyi saklandığında aramaya daha çok zaman ayırdı. Kalabalık bir çizimde şekli kenar kenar aramak zaman alır; bu iyi bir çalışma biçimidir.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc < 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Zor sorularda şeklin bir parçasını seçip çizimlerde adım adım aramak işine yarayabilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda şeklin bir parçasını seçip çizimlerde adım adım aramak yardımcı olabilir.',
        );
      } else if (r.rtHard * 1.5 <= r.rtEasy) {
        pace = v(
          'Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.',
          'Çocuğunuz zor sorularda kolay sorulardakinden daha kısa sürede cevap verdi ve bu soruların çoğunu yine doğru buldu.',
        );
      } else if (r.rtHard >= 1.2 * r.rtEasy) {
        pace = v('Zor sorulara kolay sorulardan biraz daha çok zaman ayırdın.', 'Çocuğunuz zor sorulara kolay sorulardan biraz daha çok zaman ayırdı.');
      } else if (r.rtHard * 1.2 <= r.rtEasy) {
        pace = v(
          'Zor sorularda kolay sorulardakinden biraz daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.',
          'Çocuğunuz zor sorularda kolay sorulardakinden biraz daha kısa sürede cevap verdi ve bu soruların çoğunu yine doğru buldu.',
        );
      } else {
        pace = v('Kolay ve zor sorulara birbirine yakın süreler ayırdın.', 'Çocuğunuz kolay ve zor sorulara birbirine yakın süreler ayırdı.');
      }
    }
    const found =
      r.medianRtCorrect !== null && r.correct >= 3 && !chance && !doubt
        ? v(` Doğru bulduğun sorularda şekli bulman tipik olarak ${seconds(r.medianRtCorrect)} sürdü.`, ` Doğru bulduğu sorularda şekli bulması tipik olarak ${seconds(r.medianRtCorrect)} sürdü.`)
        : '';
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.${found}`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.${found}`);
    calisma = {
      ...card('gs_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      detail: timesLine,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafik ve öne çıkan sayılar */
  const levelSizes = [...new Set(r.levels.map((l) => l.n))].sort((a, b) => a - b).join(' ya da ');
  const chart: CognitiveReport['chart'] = {
    title: 'Düzeylere göre doğru cevaplar',
    note: v(
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${levelSizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${levelSizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğu doğru cevaplanmış demektir.`,
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
  return { blocks: [dogru, duzey, yanilgi, calisma], chart, figures };
}

/* ---------- Küp açınımı ---------- */

/** Küp açınımında soru türlerinin adları ve kısa anlatımları. */
export const CUBE_TYPES: Record<CubeType, { name: string; plain: string }> = {
  place: { name: 'Yüzlerin yeri', plain: 'açınımdaki yüzlerin küpte hangi yüzlerle yan yana, hangisiyle karşı karşıya geleceğini ve bir köşede hangi sırayla buluşacaklarını bulmak' },
  turn: { name: 'Şekillerin yönü', plain: 'yüzlerin yerinin yanı sıra ok, bayrak gibi yönü olan şekillerin küp katlanınca hangi yöne bakacağını izlemek' },
};

/** Yanlış seçeneklerin yanılgıları (yanlışların yorumunda) ve her yanılgı için kısa bir ipucu. */
export const CUBE_LURE_TEXT: Record<CubeLure, string> = {
  opposite: 'küpte karşı karşıya gelen iki yüzü yan yana görmek',
  order: 'bir köşede buluşan üç yüzün sırasını ayna görüntüsündeki gibi ters görmek',
  turn: 'bir yüzdeki şeklin yönünü yanlış görmek',
};
export const CUBE_LURE_TIP: Record<CubeLure, string> = {
  opposite:
    'Açınımda düz bir sırada aralarında tek bir kare bulunan iki yüz küpte karşı karşıya gelir. Düz bir sıranın bir yanına bağlı bir yüz ile öbür yanına bağlı bir yüz de karşı karşıya gelir (Z ya da S biçiminin iki ucu gibi). Karşılıklı iki yüz bir küpte hiçbir zaman aynı anda görünmez.',
  order: 'Bir köşede buluşan üç yüzün saat yönündeki sırası, küp nasıl çevrilirse çevrilsin değişmez; açınımda bir noktanın çevresinde duran üç yüzün sırası küpte de aynı kalır.',
  turn: 'Açınımda yan yana duran iki yüz küpte de yan yana kalır; bir şekil açınımda hangi komşu yüze bakıyorsa küpte de o yüze bakar.',
};

/** "“Yüzlerin yeri”" gibi: tür adı tırnak içinde. */
const cubeTypeName = (t: CubeType) => `“${CUBE_TYPES[t].name}”`;

/** Küp açınımının dört sonuç kartı, düzeylere göre grafik ve öne çıkan sayılar. */
function cubeBlocks(r: CubeResult, task: CubeNetTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = r.correct <= CUBE_CHANCE_MAX;
  const rapid = cubeRapid(r);
  const samePos = cubeSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışlarda beklenenden sık görülen yanılgılar anlatılır; o zaman kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
  // Sonuç kuşkuluysa (çok hızlı ya da hep aynı yer) dikkatsizlik de yanılgı da yorumlanmaz.
  const noted = chance || doubt ? [] : CUBE_LURES_ORDER.filter((k) => cubeLureStandsOut(r, k));
  const lureNoted = noted.length > 0;
  const blameSlip = !lureNoted && !doubt;
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);
  const intro = `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu.`;

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  if (chance) {
    accText = v(
      `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${CUBE_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da açınıma yeterince bakmadan seçmiş de olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir.`,
      `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${CUBE_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da açınıma yeterince bakılmadan seçilmiş de olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir.`,
    );
  } else {
    const easyMissed = first.n - first.correct;
    // Daha zor bir düzeyde hem ölçüte ulaşılmış hem 1. düzeyden çok doğru verilmiş olmalı.
    const higherPassed = r.levels.slice(1).some((l) => passed(l) && l.correct > first.correct);
    if (r.levels.every((l) => l.n - l.correct <= 1)) {
      accText = v(
        `${intro} Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor düzeydeki zikzak açınımları da zihninde katlayabildin.`,
        `${intro} Çocuğunuz bütün düzeylerde soruların hemen hepsini doğru cevapladı; en zor düzeydeki zikzak açınımları da zihninde katlayabildi.`,
      );
    } else if (easyMissed >= 2 && higherPassed) {
      const which = easyMissed === first.n ? '1. düzeydeki kolay soruların hiçbirini' : `1. düzeydeki kolay sorulardan ${easyMissed} tanesini`;
      accText = v(
        `${intro} ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun.${blameSlip ? ' Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : ''}`,
        `${intro} Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu.${blameSlip ? ' Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : ''}`,
      );
    } else {
      // Kolay (1–2) ve zor (3–4) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const rate = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const hardRate = rate(r.levels.filter((l) => l.level >= 3));
      const gap = rate(easyLevels) - hardRate;
      if (gap >= 0.15) {
        accText = v(
          `${intro} Sorular zorlaştıkça doğru cevapların azaldı.${doubt ? '' : ' Bu beklenen bir durumdur: üst düzeylerde açınımlar basamaklı ya da zikzak biçimdedir ve uzaktaki yüzleri yerine getirmek için daha çok katlamayı zihinde izlemek gerekir.'}`,
          `${intro} Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı.${doubt ? '' : ' Bu beklenen bir durumdur: üst düzeylerde açınımlar basamaklı ya da zikzak biçimdedir ve uzaktaki yüzleri yerine getirmek için daha çok katlamayı zihinde izlemek gerekir.'}`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `${intro} Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin${blameSlip ? '; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
          `${intro} Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${blameSlip ? '; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
        );
      } else {
        // Zor sorular da çoğunlukla doğruysa kolay sorulardaki yanlışlar dikkatin dağılmasına bağlanabilir.
        const slip =
          blameSlip && hardRate >= MATRIX_LEVEL_PASS && easyLevels.some((l) => l.correct < l.n)
            ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'
            : '';
        accText = v(
          `${intro} Kolay ve zor düzeylerdeki doğru cevap oranların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `${intro} Çocuğunuzun kolay ve zor düzeylerdeki doğru cevap oranları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    if (lureNoted) {
      accText += v(
        ' Yanlış cevaplarında öne çıkan yanılgılar için yüzlerin yeri ve şekillerin yönü kartına bak.',
        ' Yanlış cevaplarda öne çıkan yanılgılar için yüzlerin yeri ve şekillerin yönü kartına bakın.',
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda açınıma bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorularda açınıma bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('kp_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (chance) {
    duzey = { ...card('kp_duzey'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' };
  } else if (r.reached === 0) {
    duzey = {
      ...card('kp_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki soruların ve o düzeye kadarki bütün soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lureNoted ? ' Bu, yönergeyi tam anlamamaktan ya da yüzlerin yeri ve şekillerin yönü kartında anlatılan yanılgılardan kaynaklanabilir.' : doubt ? ' Bazı sorularda açınıma bakmadan seçmiş olabileceğin için bu sonuç tek başına bir şey söylemez.' : ' Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.'}`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki soruların ve o düzeye kadarki bütün soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lureNoted ? ' Bu, yönergenin tam anlaşılmamasından ya da yüzlerin yeri ve şekillerin yönü kartında anlatılan yanılgılardan kaynaklanabilir ve tek başına yorumlanmamalıdır.' : doubt ? ' Bazı sorularda açınıma bakılmadan seçilmiş olabileceği için bu sonuç tek başına yorumlanmamalıdır.' : ' Bu; dikkatin dağılmasından, acele etmekten ya da yönergenin tam anlaşılmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'}`,
      ),
    };
  } else {
    const def = task.levels.find((l) => l.level === r.reached)!;
    const next = task.levels.find((l) => l.level === r.reached + 1);
    const lower = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1).replace(/\.$/, '');
    const upTo =
      r.reached === 1
        ? v('1. düzeydeki soruların çoğunu doğru cevapladın', 'Çocuğunuz 1. düzeydeki soruların çoğunu doğru cevapladı')
        : v(`1–${r.reached}. düzeylerdeki soruların çoğunu doğru cevapladın`, `Çocuğunuz 1–${r.reached}. düzeylerdeki soruların çoğunu doğru cevapladı`);
    let text = `${upTo}. ${r.reached}. düzeydeki sorularda şu gerekiyordu: ${lower(def.plain)}.`;
    // Alt düzeylerdeki yanlışlar düzeyi düşürmez; daha zor sorular çözüldüğü için dikkatsizlikten kaynaklanmış olabilir.
    const slips = r.levels.filter((l) => l.level < r.reached && !passed(l)).map((l) => `${l.level}.`);
    if (slips.length) {
      text += v(
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi${blameSlip ? ': daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi${blameSlip ? ': daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '.'}`,
      );
    }
    if (!next) {
      text += v(' Bu en zor düzeydi.', ' Bu, testin en zor düzeyiydi.');
    } else {
      text += v(
        ` ${next.level}. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
        ` ${next.level}. düzeyde soruların çoğunda zorlandı; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
      );
    }
    duzey = {
      ...card('kp_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki soruların ve o düzeye kadarki bütün soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Yüzlerin yeri ve şekillerin yönü */
  const typeLine = r.types.map((x) => `${CUBE_TYPES[x.type].name} ${x.correct}/${x.n}`).join(' · ');
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const sizes = [...new Set(r.types.map((x) => x.n))];
  const rough = ` Her tür ${sizes.length === 1 ? `${sizes[0]} soruya` : 'birkaç soruya'} dayanır ve her türde kolaydan zora sorular vardır; bu karşılaştırma kaba bir göstergedir.`;
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('kp_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için soru türleri karşılaştırılmadı ve yanlışlardaki yanılgılar yorumlanmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu sorularda ${CUBE_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => `${cubeTypeName(x)} sorularında ${CUBE_TYPES[x].plain} gerekir.`).join(' ');
    const head =
      good.length === r.types.length
        ? 'İki soru türünde de soruların çoğu doğru'
        : good.length === 0
          ? 'İki soru türünde de soruların çoğu doğru değil'
          : `${cubeTypeName(good[0])} sorularının çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        'Yalnızca yüzlerin yerinin önemli olduğu sorularda da şekillerin yönünün de önemli olduğu sorularda da soruların çoğunu doğru buldun.',
        'Çocuğunuz yalnızca yüzlerin yerinin önemli olduğu sorularda da şekillerin yönünün de önemli olduğu sorularda da soruların çoğunu doğru buldu.',
      );
    } else if (good.length === 0) {
      text = v(`İki soru türünde de soruların çoğunu doğru bulamadın. ${needs}`, `Çocuğunuz iki soru türünde de soruların çoğunu doğru bulamadı. ${needs}`);
    } else {
      text = v(
        `${cubeTypeName(good[0])} sorularının çoğunu doğru buldun; ${cubeTypeName(hard[0])} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${cubeTypeName(good[0])} sorularının çoğunu doğru buldu; ${cubeTypeName(hard[0])} sorularında zorlandı. ${needs}`,
      );
    }
    text += rough;
    // Yanlışlardaki yanılgılar: her yanlış seçenek küpün bir duruşundan tek bir değişiklikle üretilmiştir.
    if (doubt && r.wrong > 0) {
      text += v(
        ' Bazı sorularda açınıma bakmadan seçmiş olabileceğin için yanlışlardaki yanılgılar yorumlanmadı.',
        ' Bazı sorularda açınıma bakılmadan seçilmiş olabileceği için yanlışlardaki yanılgılar yorumlanmadı.',
      );
    } else if (lureNoted) {
      const phrases = noted.map((k) => `${CUBE_LURE_TEXT[k]} (${r.luresByKind[k]} yanlışta)`);
      const which = noted.length > 1 ? 'şu yanılgılar' : 'şu yanılgı';
      text += v(
        ` ${r.wrong} yanlış cevabında ${which}, seçeneklerde bulunma sıklığına göre beklenenden sık görüldü: ${joinTr(phrases)}. ${noted.map((k) => CUBE_LURE_TIP[k]).join(' ')}`,
        ` Çocuğunuzun ${r.wrong} yanlış cevabında ${which}, seçeneklerde bulunma sıklığına göre beklenenden sık görüldü: ${joinTr(phrases)}. ${noted.map((k) => CUBE_LURE_TIP[k]).join(' ')}`,
      );
    } else if (r.wrong >= CUBE_LURE_NOTE) {
      text += v(
        ` ${r.wrong} yanlış cevabın farklı yanılgılara dağılıyor; hiçbir yanılgı, seçeneklerde bulunma sıklığına göre beklenenden sık görülmedi.`,
        ` Çocuğunuzun ${r.wrong} yanlış cevabı farklı yanılgılara dağılıyor; hiçbir yanılgı, seçeneklerde bulunma sıklığına göre beklenenden sık görülmedi.`,
      );
    }
    tur = { ...card('kp_tur'), headline: head, detail: typeLine, text };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede açınımı zihinde katlayıp dört küpe bakmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede açınımı zihinde katlayıp dört küpe bakmak çok zordur; bu sorularda tahmin edilmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakılmadan aynı yere basılmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
  if (r.medianRt === null) {
    calisma = { ...card('kp_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 3–4. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 3);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Zor sorularda açınım basamaklı ya da zikzak biçimdedir; katlamaları adım adım zihinde izlemek zaman alır ve iyi bir çalışma biçimidir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Zor sorularda açınım basamaklı ya da zikzak biçimdedir; katlamaları adım adım zihinde izlemek zaman alır ve iyi bir çalışma biçimidir.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Zor sorulara daha çok zaman ayırmak ve açınımı bir yüzden başlayarak adım adım katlamak işine yarayabilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; daha çok zaman ayırmak ve açınımı adım adım katlamak yardımcı olabilir.',
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
    calisma = {
      ...card('kp_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      detail: timesLine,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafik ve öne çıkan sayılar */
  const levelSizes = [...new Set(r.levels.map((l) => l.n))].sort((a, b) => a - b).join(' ya da ');
  const chart: CognitiveReport['chart'] = {
    title: 'Düzeylere göre doğru cevaplar',
    note: v(
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${levelSizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `Sorular kolaydan zora doğru ${levelWord} düzeye ayrılmıştır; her düzeyde ${levelSizes} soru vardır. Çubuk ne kadar uzunsa o düzeydeki soruların o kadar çoğu doğru cevaplanmış demektir.`,
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
  // Yalnızca iki soru türü olduğu için üç boyutlu profil grafiği yoktur (yol haritası en az üç sütun ister).
  return { blocks: [dogru, duzey, tur, calisma], chart, figures };
}

/* ---------- Üç boyutlu zihinde döndürme ---------- */

/** Ayna kartının başlığı (yanlışlar yorumlandığında): bir doğru bir ayna ile iki aynadan hangisi daha sık? */
export function rotation3dMixHeadline(r: Pick<Rotation3dResult, 'half' | 'none'>): string {
  if (r.none === 0) return 'Yanlışların hepsinde bir doğru şekil';
  if (r.half === 0) return 'Yanlışların hepsinde iki ayna görüntüsü';
  if (r.half > r.none) return 'Yanlışların çoğunda bir doğru şekil';
  if (r.half < r.none) return 'Yanlışların çoğunda iki ayna görüntüsü';
  return 'Yanlışların yarısında bir doğru şekil, yarısında iki ayna';
}

/** Üç boyutlu zihinde döndürmenin dört sonuç kartı, bölümlere göre grafik ve öne çıkan sayılar. */
function rotation3dBlocks(r: Rotation3dResult, task: MentalRotation3dTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const mirrorPick = rotation3dMirrorPick(r);
  const rapid = rotation3dRapid(r);
  const samePair = rotation3dSamePair(r);
  const doubt = rapid || samePair;
  // İki ayna görüntüsünün birden çok sık seçildiği ve doğruların az olduğu sonuç: yönerge ters anlaşılmış olabilir. Bazı
  // sorularda bakmadan seçilmiş olabilirse (çok hızlı ya da hep aynı yer) bu yoruma gidilmez; sonuç rastgele düzeyinde sayılır.
  const reversed = mirrorPick && r.correct <= ROTATION3D_CHANCE_MAX && !doubt;
  const chance = r.correct <= ROTATION3D_CHANCE_MAX && !reversed;
  const noneOfAll = r.none === r.n ? 'hepsinde' : `${r.none} tanesinde`;
  const wrong = r.n - r.correct;
  const [p1, p2] = r.parts;

  /* Doğru cevaplar */
  let accText: string;
  if (reversed) {
    accText = v(
      `${r.n} sorunun ${noneOfAll} iki ayna görüntüsünü birden seçtin; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Yönergeyi ters anlamış, yani döndürülmüş şekiller yerine ayna görüntülerini aramış olabilirsin. Bu sonuç tek başına bir şey söylemez; alıştırma sorularına yeniden bakıp testi başka bir gün yeniden çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${r.n} sorunun ${noneOfAll} iki ayna görüntüsünü birden seçti; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Yönerge ters anlaşılmış, yani döndürülmüş şekiller yerine ayna görüntüleri aranmış olabilir. Bu sonuç yorumlanmamalıdır; alıştırma sorularına yeniden bakıp testi başka bir gün yeniden çözmesi daha doğru bir sonuç verebilir.`,
    );
  } else if (chance) {
    accText = v(
      `Doğru cevapların, seçenekleri rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${ROTATION3D_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da şekillere yeterince bakmadan seçmiş de olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuzun doğru cevapları, seçenekleri rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${ROTATION3D_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da şekillere yeterince bakılmadan seçilmiş de olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    if (r.correct === r.n) {
      accText = v(
        'Soruların hepsinde döndürülmüş iki şekli de buldun: küplerden yapılmış şekilleri zihninde döndürüp ayna görüntülerinden ayırabildin.',
        'Çocuğunuz soruların hepsinde döndürülmüş iki şekli de buldu: küplerden yapılmış şekilleri zihninde döndürüp ayna görüntülerinden ayırabildi.',
      );
    } else if (r.correct >= r.n - 3) {
      accText = v(
        'Soruların hemen hepsinde döndürülmüş iki şekli de buldun: küplerden yapılmış şekilleri zihninde döndürüp ayna görüntülerinden ayırabildin.',
        'Çocuğunuz soruların hemen hepsinde döndürülmüş iki şekli de buldu: küplerden yapılmış şekilleri zihninde döndürüp ayna görüntülerinden ayırabildi.',
      );
    } else if (r.correct * 3 >= r.n * 2) {
      accText = v(
        'Soruların çoğunda döndürülmüş iki şekli de buldun; bazı sorularda ayna görüntülerini döndürülmüş şekillerden ayırmakta zorlandın.',
        'Çocuğunuz soruların çoğunda döndürülmüş iki şekli de buldu; bazı sorularda ayna görüntülerini döndürülmüş şekillerden ayırmakta zorlandı.',
      );
    } else {
      accText = v(
        'Soruların bir kısmında döndürülmüş iki şekli de buldun; birçok soruda ayna görüntülerini döndürülmüş şekillerden ayırmakta zorlandın. Bu tür sorularda şekli zihinde döndürüp her kolun nereye geleceğini izlemek gerekir.',
        'Çocuğunuz soruların bir kısmında döndürülmüş iki şekli de buldu; birçok soruda ayna görüntülerini döndürülmüş şekillerden ayırmakta zorlandı. Bu tür sorularda şekli zihinde döndürüp her kolun nereye geleceğini izlemek gerekir.',
      );
    }
    if (r.correct < r.n) {
      accText += v(
        ` Seçtiğin ${2 * r.n} şeklin ${r.figures} tanesi döndürülmüş şekillerdi.`,
        ` Çocuğunuzun seçtiği ${2 * r.n} şeklin ${r.figures} tanesi döndürülmüş şekillerdi.`,
      );
    }
    // Bazı sorularda bakmadan seçilmiş olabilirse ayna kartı yanlışları yorumlamaz; o karta yönlendirilmez.
    if (mirrorPick && !doubt) {
      accText += v(
        ' Yanlış cevaplarında ayna görüntülerinin nasıl seçildiği için ayna görüntüleri kartına bak.',
        ' Yanlış cevaplarda ayna görüntülerinin nasıl seçildiği için ayna görüntüleri kartına bakın.',
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda şekillere bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorularda şekillere bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('ud_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Dik eksen ve yan yatırma */
  const partLine = `1. bölüm ${p1.correct}/${p1.n} · 2. bölüm ${p2.correct}/${p2.n}`;
  const rough = ` Her bölüm ${p1.n} soruya dayanır; bu karşılaştırma kaba bir göstergedir.`;
  let bolum: CognitiveBlock;
  if (reversed || chance) {
    bolum = { ...card('ud_bolum'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için iki bölüm karşılaştırılmadı.' };
  } else {
    const gap = p1.correct - p2.correct;
    const found = (p: Rotation3dPartResult) =>
      p.correct === 0
        ? v(`${p.n} sorunun hiçbirinde iki doğru şekli birlikte bulamadın`, `${p.n} sorunun hiçbirinde iki doğru şekli birlikte bulamadı`)
        : v(
            `${p.n} sorunun ${p.correct === p.n ? 'hepsinde' : `${p.correct} tanesinde`} iki doğru şekli de buldun`,
            `${p.n} sorunun ${p.correct === p.n ? 'hepsinde' : `${p.correct} tanesinde`} iki doğru şekli de buldu`,
          );
    const counts = v(
      `Yalnızca dik eksen çevresinde döndürülmüş şekillerin olduğu 1. bölümde ${found(p1)}; yan yatırılmış şekillerin olduğu 2. bölümde ${found(p2)}.`,
      `Yalnızca dik eksen çevresinde döndürülmüş şekillerin olduğu 1. bölümde çocuğunuz ${found(p1)}; yan yatırılmış şekillerin olduğu 2. bölümde ${found(p2)}.`,
    );
    let head: string;
    let text: string;
    if (doubt) {
      // Bazı sorularda bakmadan seçilmiş olabilir: bölümler arasındaki fark açıklanmaz, yalnızca sayılar verilir.
      head =
        gap >= ROTATION3D_PART_GAP ? '2. bölümde daha az doğru' : gap <= -ROTATION3D_PART_GAP ? '2. bölümde daha çok doğru' : 'İki bölümde yakın sayıda doğru';
      text = `${counts} ${v(
        'Bazı sorularda şekillere bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) iki bölüm arasındaki fark yorumlanmadı.',
        'Bazı sorularda şekillere bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) iki bölüm arasındaki fark yorumlanmadı.',
      )}`;
    } else if (gap >= ROTATION3D_PART_GAP) {
      head = 'Yan yatırılmış şekillerde daha çok zorlanma';
      text = `${counts} ${v(
        'Yan yatırılmış şekillerde iki dönüşü birlikte izlemek gerekir; birden çok yönde döndürülmüş şekiller genellikle daha zordur.',
        'Yan yatırılmış şekillerde iki dönüşü birlikte izlemek gerekir; birden çok yönde döndürülmüş şekiller genellikle daha zordur.',
      )}`;
    } else if (gap <= -ROTATION3D_PART_GAP) {
      head = 'Yan yatırılmış şekillerde daha çok doğru';
      text = `${counts} ${v(
        'Yan yatırılmış şekiller genellikle daha zor olsa da 2. bölümde daha çok doğru cevap verdin. Testin başında sorulara alışmak zaman alabilir; ilk bölümdeki yanlışlar bundan da kaynaklanmış olabilir.',
        'Yan yatırılmış şekiller genellikle daha zor olsa da çocuğunuz 2. bölümde daha çok doğru cevap verdi. Testin başında sorulara alışmak zaman alabilir; ilk bölümdeki yanlışlar bundan da kaynaklanmış olabilir.',
      )}`;
    } else {
      head = 'İki bölümde yakın sonuç';
      const both = p1.correct * 3 >= p1.n * 2 && p2.correct * 3 >= p2.n * 2;
      text = `${counts} ${
        both
          ? v(
              'Şekiller yan yatırıldığında da döndürülmüş şekilleri çoğunlukla bulabildin.',
              'Çocuğunuz şekiller yan yatırıldığında da döndürülmüş şekilleri çoğunlukla bulabildi.',
            )
          : v('İki bölümde birbirine yakın sayıda doğru cevap verdin.', 'Çocuğunuz iki bölümde birbirine yakın sayıda doğru cevap verdi.')
      }`;
    }
    bolum = { ...card('ud_bolum'), headline: head, detail: partLine, text: text + rough };
  }

  /* Ayna görüntüleri */
  let ayna: CognitiveBlock;
  const tip = v(
    ' Bir şekli ayna görüntüsünden ayırmak için bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirdiğini düşün, sonra kalan iki kola bak: döndürülmüş şekilde onlar da aynı yönlere uzanır, ayna görüntüsünde ise biri öbür yana uzanır.',
    ' Bir şekli ayna görüntüsünden ayırmak için bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirip kalan iki kola bakmak yardımcı olabilir: döndürülmüş şekilde onlar da aynı yönlere uzanır, ayna görüntüsünde ise biri öbür yana uzanır.',
  );
  const mixLine = `Bir doğru bir ayna: ${r.half} soru · İki ayna: ${r.none} soru`;
  const noneOfWrong = r.none === wrong ? 'hepsinde' : `${r.none} tanesinde`;
  if (reversed) {
    ayna = {
      ...card('ud_ayna'),
      headline: `İki ayna görüntüsü birden: ${r.none} soru`,
      detail: mixLine,
      text: v(
        `${wrong} yanlış cevabının ${noneOfWrong} iki ayna görüntüsünü birden seçtin. Yönergeyi ters anlamış olabileceğin için bu sonuç yorumlanmadı (doğru cevaplar kartına bak).`,
        `Çocuğunuz ${wrong} yanlış cevabının ${noneOfWrong} iki ayna görüntüsünü birden seçti. Yönerge ters anlaşılmış olabileceği için bu sonuç yorumlanmadı (doğru cevaplar kartına bakın).`,
      ),
    };
  } else if (chance) {
    ayna = { ...card('ud_ayna'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için yanlış cevaplardaki seçimler yorumlanmadı.' };
  } else if (wrong === 0) {
    ayna = {
      ...card('ud_ayna'),
      headline: 'Ayna görüntüsü seçilmedi',
      text: v('Hiçbir soruda ayna görüntüsü seçmedin.', 'Çocuğunuz hiçbir soruda ayna görüntüsü seçmedi.'),
    };
  } else if (doubt) {
    ayna = {
      ...card('ud_ayna'),
      headline: 'Yorumlanmadı',
      detail: mixLine,
      text: v(
        'Bazı sorularda şekillere bakmadan seçmiş olabileceğin için yanlış cevaplarındaki seçimler yorumlanmadı.',
        'Bazı sorularda şekillere bakılmadan seçilmiş olabileceği için yanlış cevaplardaki seçimler yorumlanmadı.',
      ),
    };
  } else if (mirrorPick) {
    ayna = {
      ...card('ud_ayna'),
      headline: `İki ayna görüntüsü birden: ${r.none} soru`,
      detail: mixLine,
      text:
        v(
          `Doğru bulamadığın ${wrong} sorunun ${noneOfWrong} iki ayna görüntüsünü birden seçtin; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Bir şeklin hangi kolunun öne, hangisinin arkaya uzandığı ters görülürse şekil ayna görüntüsüne benzer. Bu sorularda şeklin derinliğini ters görmüş olabilirsin. Işık her şekle aynı yönden, ekranın üstünden ve biraz solundan gelir: ışığa dönük yüzler açık, öbür yüzler daha koyu renktedir; bu, her yüzün hangi yöne baktığını anlamana yardım eder.`,
          `Çocuğunuz doğru bulamadığı ${wrong} sorunun ${noneOfWrong} iki ayna görüntüsünü birden seçti; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Bir şeklin hangi kolunun öne, hangisinin arkaya uzandığı ters görülürse şekil ayna görüntüsüne benzer. Bu sorularda şeklin derinliği ters görülmüş olabilir. Işık her şekle aynı yönden, ekranın üstünden ve biraz solundan gelir: ışığa dönük yüzler açık, öbür yüzler daha koyu renktedir; bu, her yüzün hangi yöne baktığını anlamaya yardım eder.`,
        ) + tip,
    };
  } else {
    const which =
      r.none === 0
        ? v(
            `Doğru bulamadığın ${wrong} sorunun hepsinde iki şekilden birini doğru seçtin: bu sorularda döndürülmüş şekillerden birini tanıdın ama ikincisini bir ayna görüntüsüyle karıştırdın.`,
            `Çocuğunuz doğru bulamadığı ${wrong} sorunun hepsinde iki şekilden birini doğru seçti: bu sorularda döndürülmüş şekillerden birini tanıdı ama ikincisini bir ayna görüntüsüyle karıştırdı.`,
          )
        : r.half === 0
          ? v(
              `Doğru bulamadığın ${wrong} sorunun hepsinde iki ayna görüntüsünü birden seçtin.`,
              `Çocuğunuz doğru bulamadığı ${wrong} sorunun hepsinde iki ayna görüntüsünü birden seçti.`,
            )
          : v(
              `Doğru bulamadığın ${wrong} sorunun ${r.half} tanesinde iki şekilden birini doğru seçtin, yani döndürülmüş şekillerden birini tanıyıp ikincisini bir ayna görüntüsüyle karıştırdın; ${r.none} soruda ise iki ayna görüntüsünü birden seçtin.`,
              `Çocuğunuz doğru bulamadığı ${wrong} sorunun ${r.half} tanesinde iki şekilden birini doğru seçti, yani döndürülmüş şekillerden birini tanıyıp ikincisini bir ayna görüntüsüyle karıştırdı; ${r.none} soruda ise iki ayna görüntüsünü birden seçti.`,
            );
    ayna = {
      ...card('ud_ayna'),
      headline: rotation3dMixHeadline(r),
      detail: mixLine,
      text: which + tip,
    };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    issues.push(
      v(
        `${r.n} sorunun ${r.rapid === r.n ? 'hepsinde' : `${r.rapid} tanesinde`} 4 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede beş şekle bakıp ikisini seçmek çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz ${r.n} sorunun ${r.rapid === r.n ? 'hepsinde' : `${r.rapid} tanesinde`} 4 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede beş şekle bakıp ikisini seçmek çok zordur; bu sorularda tahmin edilmiş olabilir.`,
      ),
    );
  }
  if (samePair) {
    issues.push(
      v(
        `${r.samePair === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePair} tanesinde`} aynı yerdeki iki seçeneği seçtin; birçok soruda bakmadan aynı yerlere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePair === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePair} tanesinde`} aynı yerdeki iki seçeneği seçti; birçok soruda bakılmadan aynı yerlere basılmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(
    ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.',
    ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.',
  );
  if (r.medianRt === null) {
    calisma = { ...card('ud_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine =
      p1.medianRt !== null && p2.medianRt !== null ? `1. bölümde tipik ${seconds(p1.medianRt)} · 2. bölümde ${seconds(p2.medianRt)}` : undefined;
    let pace = '';
    // Bölümler karşılaştırılmadıysa (doğrular çok az) ya da bakmadan seçilmiş olabilirse süreler de karşılaştırılmaz.
    if (!doubt && !chance && !reversed && p1.medianRt !== null && p2.medianRt !== null) {
      if (p2.medianRt >= 1.3 * p1.medianRt) {
        pace = v(
          'Yan yatırılmış şekillere daha çok zaman ayırdın; iki dönüşü birlikte izlemek zaman alır.',
          'Çocuğunuz yan yatırılmış şekillere daha çok zaman ayırdı; iki dönüşü birlikte izlemek zaman alır.',
        );
      } else if (p2.medianRt * 1.3 <= p1.medianRt) {
        pace = v(
          'Yan yatırılmış şekilleri ilk bölümdeki şekillerden daha kısa sürede cevapladın; sorulara alıştıkça hızlanmış olabilirsin.',
          'Çocuğunuz yan yatırılmış şekilleri ilk bölümdeki şekillerden daha kısa sürede cevapladı; sorulara alıştıkça hızlanmış olabilir.',
        );
      } else {
        pace = v('İki bölümdeki sorulara birbirine yakın süreler ayırdın.', 'Çocuğunuz iki bölümdeki sorulara birbirine yakın süreler ayırdı.');
      }
    }
    const base = v(
      `Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`,
      `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`,
    );
    calisma = {
      ...card('ud_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      detail: timesLine,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafik ve öne çıkan sayılar */
  const chart: CognitiveReport['chart'] = {
    title: 'Bölümlere göre doğru cevaplar',
    note: v(
      `1. bölümde şekiller yalnızca dik bir eksen çevresinde döndürülmüş, 2. bölümde ayrıca yan yatırılmıştır; her bölümde ${p1.n} soru vardır. Çubuk ne kadar uzunsa o bölümdeki soruların o kadar çoğunda iki doğru şekli de bulmuşsun demektir.`,
      `1. bölümde şekiller yalnızca dik bir eksen çevresinde döndürülmüş, 2. bölümde ayrıca yan yatırılmıştır; her bölümde ${p1.n} soru vardır. Çubuk ne kadar uzunsa o bölümdeki soruların o kadar çoğunda iki doğru şekil de bulunmuş demektir.`,
    ),
    rows: r.parts.map((p, i) => ({
      label: `${p.part}. bölüm: ${task.parts[i].name.toLocaleLowerCase('tr-TR')}`,
      value: p.correct,
      max: p.n,
      valueLabel: `${p.correct}/${p.n}`,
    })),
  };
  const figures = [
    { label: 'Doğru', value: `${r.correct}/${r.n}` },
    { label: 'Doğru seçilen şekiller', value: `${r.figures}/${2 * r.n}` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  // Yalnızca iki bölüm olduğu için üç boyutlu profil grafiği yoktur (yol haritası en az üç sütun ister).
  return { blocks: [dogru, bolum, ayna, calisma], chart, figures };
}

/* ---------- Hesapla ve hatırla ---------- */

/** Hesapla ve hatırlada dizi uzunluklarının renkleri (üç boyutlu grafikte; yalnızca uzunlukları ayırır). */
export const COMPLEX_SPAN_SIZE_COLORS = ['#2f5ce0', '#0e9c8c', '#d28a14', '#ee6a36', '#7a4ee6'];

/** "4,2 saniye": işlem süreleri ve süre sınırı (onda bir saniye duyarlıkla). */
/** "12 tanesini" ama "birini": tek olan için "1 tanesi" denmez. */
const csCount = (n: number, suffix: 'i' | 'ini' | 'inde' | 'inin') => (n === 1 ? `bir${suffix}` : `${n} tanes${suffix}`);

const csSeconds = (ms: number) => `${String(Math.round(ms / 100) / 10).replace('.', ',')} saniye`;

/** Hesapla ve hatırlanın dört sonuç kartı, dizi uzunluklarına göre grafik, öne çıkan sayılar ve üç boyutlu grafik. */
function complexSpanBlocks(r: ComplexSpanResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const N = r.letters;
  const X = r.correct;
  const P = r.perfectSets;
  const O = r.ops;
  const recallChance = complexSpanRecallChance(r);
  const opsChance = complexSpanOpsChance(r);
  // Kalite notlarındaki gibi: işlemler rastgele düzeydeyse hızlı cevaplar ayrıca anlatılmaz.
  const rapid = !opsChance && complexSpanRapid(r);
  const noRead = recallChance || opsChance;
  const noReadWhy = recallChance
    ? 'Doğru yerde hatırlanan harfler rastgele seçimde de görülebilecek kadar az olduğu için'
    : 'İşlemlerin doğru cevaplananları rastgele basmada da görülebilecek kadar az olduğu için';
  // "Hiçbiri" olumsuz fiille söylenir ("cevaplayamadın"); bir kısmı olumlu fiille.
  const opsClause = v(
    O.correct === 0
      ? 'işlemlerin hiçbirini süresi içinde doğru cevaplayamadın'
      : `işlemlerin yalnızca ${csCount(O.correct, 'ini')} süresi içinde doğru cevapladın`,
    O.correct === 0
      ? 'işlemlerin hiçbirini süresi içinde doğru cevaplayamadı'
      : `işlemlerin yalnızca ${csCount(O.correct, 'ini')} süresi içinde doğru cevapladı`,
  );
  const rapidPhrase = O.rapid === O.n ? 'hepsine' : `${O.rapid} tanesine`;

  /* Hatırlanan harfler */
  let harfText: string;
  if (recallChance) {
    harfText = v(
      `${N} harften ${X === 0 ? 'hiçbirini doğru yerde seçemedin' : `yalnızca ${csCount(X, 'ini')} doğru yerde seçtin`}; bu, harfleri rastgele seçen birinin de bulabileceği kadar az. Yönergeyi tam anlamamış, harfleri boş bırakmış ya da görevi yarıda bırakmış olabilirsin; bu yüzden sonuç yorumlanmadı. Dinlenmiş olduğun bir gün, yönergeyi yeniden okuyup testi baştan çözmek daha doğru bir sonuç verebilir; aynı diziler yeniden gösterileceği için ikinci denemede sonuç biraz yükselebilir.`,
      `Çocuğunuz ${N} harften ${X === 0 ? 'hiçbirini doğru yerde seçemedi' : `yalnızca ${csCount(X, 'ini')} doğru yerde seçti`}; bu, harfleri rastgele seçen birinin de bulabileceği kadar az. Yönerge tam anlaşılmamış, harfler boş bırakılmış ya da görev yarıda bırakılmış olabilir; bu yüzden sonuç yorumlanmadı. Dinlenmiş olduğu bir gün, yönergeyi yeniden okuyup testi baştan çözmesi daha doğru bir sonuç verebilir; aynı diziler yeniden gösterileceği için ikinci denemede sonuç biraz yükselebilir.`,
    );
  } else if (opsChance) {
    harfText = v(
      `${N} harften ${csCount(X, 'ini')} doğru yerde seçtin. Ancak ${opsClause}; bu, rastgele basan birinin de bulabileceği kadar az. Bu testte harfler, işlemler yapılırken akılda tutulur; işlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu yorumlanmadı. Dinlenmiş olduğun bir gün, işlemlere de özen göstererek testi baştan çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${N} harften ${csCount(X, 'ini')} doğru yerde seçti. Ancak ${opsClause}; bu, rastgele basan birinin de bulabileceği kadar az. Bu testte harfler, işlemler yapılırken akılda tutulur; işlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu yorumlanmadı. Dinlenmiş olduğu bir gün, işlemlere de özen göstererek testi baştan çözmesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    const intro = v(
      `Bu testte ${r.sets} dizide toplam ${N} harf vardı; her harften önce bir işlemin doğru olup olmadığına karar verdin.`,
      `Bu testte ${r.sets} dizide toplam ${N} harf vardı; çocuğunuz her harften önce bir işlemin doğru olup olmadığına karar verdi.`,
    );
    let level: string;
    if (X === N) {
      level = v(
        'Harflerin hepsini doğru yerde hatırladın: işlemler araya girse de bütün dizileri doğru sırayla akılda tuttun.',
        'Çocuğunuz harflerin hepsini doğru yerde hatırladı: işlemler araya girse de bütün dizileri doğru sırayla akılda tuttu.',
      );
    } else if (X >= 0.85 * N) {
      level = v(
        `Bunların ${csCount(X, 'ini')} doğru yerde hatırladın: işlemler araya girse de harflerin hemen hepsini doğru sırayla akılda tuttun.`,
        `Çocuğunuz bunların ${csCount(X, 'ini')} doğru yerde hatırladı: işlemler araya girse de harflerin hemen hepsini doğru sırayla akılda tuttu.`,
      );
    } else if (X >= 0.65 * N) {
      level = v(
        `Bunların ${csCount(X, 'ini')} doğru yerde hatırladın: işlemler araya girse de harflerin çoğunu doğru sırayla akılda tuttun.`,
        `Çocuğunuz bunların ${csCount(X, 'ini')} doğru yerde hatırladı: işlemler araya girse de harflerin çoğunu doğru sırayla akılda tuttu.`,
      );
    } else {
      const share = 2 * X > N ? 'yarısından çoğu' : 2 * X === N ? 'yarısı' : 'yarısından azı';
      level = v(
        `Bunların ${csCount(X, 'ini')} doğru yerde hatırladın: harflerin ${share} doğru yerdeydi; öteki harflerde yer karıştı ya da harf hatırlanamadı.`,
        `Çocuğunuz bunların ${csCount(X, 'ini')} doğru yerde hatırladı: harflerin ${share} doğru yerdeydi; öteki harflerde yer karıştı ya da harf hatırlanamadı.`,
      );
    }
    const parts = [intro, level];
    if (X < N) {
      parts.push(
        r.longest !== null
          ? v(
              `Bütün harflerini doğru sırayla hatırladığın en uzun dizi ${r.longest} harfliydi.`,
              `Bütün harflerini doğru sırayla hatırladığı en uzun dizi ${r.longest} harfliydi.`,
            )
          : v(
              'Hiçbir dizinin bütün harflerini doğru sırayla seçemedin; doğru yerde seçtiğin harfler yine de sonuca sayıldı.',
              'Çocuğunuz hiçbir dizinin bütün harflerini doğru sırayla seçemedi; doğru yerde seçtiği harfler yine de sonuca sayıldı.',
            ),
      );
    }
    parts.push(
      v(
        'Bu beceri; zihinden işlem yaparken ara sonuçları akılda tutmak ya da birini dinlerken söylenenleri aklında tutup bir yandan başka bir şey yapmak gibi işlerde kullanılır.',
        'Bu beceri; zihinden işlem yaparken ara sonuçları akılda tutmak, çok adımlı yönergeleri izlemek ya da okurken cümlenin başını akılda tutmak gibi işlerde kullanılır.',
      ),
    );
    if (rapid) {
      parts.push(
        v(
          `İşlemlerin ${rapidPhrase} yarım saniyeden kısa sürede cevap verdin; bu işlemlere bakılmadan basılmış olabilir. İşlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için bu sonuç dikkatle yorumlanmalıdır.`,
          `Çocuğunuz işlemlerin ${rapidPhrase} yarım saniyeden kısa sürede cevap verdi; bu işlemlere bakılmadan basılmış olabilir. İşlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için bu sonuç dikkatle yorumlanmalıdır.`,
        ),
      );
    } else if (O.accuracy < CS_OPS_TARGET) {
      parts.push(
        v(
          `İşlemlerin ${pct(O.accuracy)} kadarını süresi içinde doğru cevapladın. Bu tür görevlerde, işlemlerin gerçekten yapıldığını göstermek için geleneksel olarak en az %85’inin doğru olması istenir; bu düzeyin altında kalındığı için harf sonucu biraz daha dikkatle yorumlanmalıdır.`,
          `Çocuğunuz işlemlerin ${pct(O.accuracy)} kadarını süresi içinde doğru cevapladı. Bu tür görevlerde, işlemlerin gerçekten yapıldığını göstermek için geleneksel olarak en az %85’inin doğru olması istenir; bu düzeyin altında kalındığı için harf sonucu biraz daha dikkatle yorumlanmalıdır.`,
        ),
      );
    }
    harfText = parts.join(' ');
  }
  const harf: CognitiveBlock = {
    ...card('hb_harf'),
    headline: X === 0 ? `${N} harfin hiçbiri doğru yerde değil` : X === N ? `${N} harfin hepsi doğru yerde` : `${N} harften ${csCount(X, 'i')} doğru yerde`,
    text: harfText,
  };

  /* Dizi uzunluğu */
  const group = (sizes: number[]) => {
    const xs = r.bySize.filter((s) => sizes.includes(s.size));
    return { correct: xs.reduce((s, x) => s + x.correct, 0), letters: xs.reduce((s, x) => s + x.letters, 0) };
  };
  const share = (sizes: number[]) => {
    const g = group(sizes);
    return g.letters ? g.correct / g.letters : 0;
  };
  let uzunluk: CognitiveBlock;
  if (noRead) {
    uzunluk = { ...card('hb_uzunluk'), headline: 'Yorumlanmadı', text: `${noReadWhy} dizi uzunluklarına göre sonuç yorumlanmadı.` };
  } else {
    const pShort = share([3, 4]);
    const pLong = share([6, 7]);
    const diff = pShort - pLong;
    const S = group([3, 4]);
    const L = group([6, 7]);
    // "Hiçbirini" olumsuz fiille söylenir: bir grupta hiç doğru yoksa iki grup ayrı fiillerle anlatılır.
    const some = (g: { correct: number; letters: number }) => `${g.letters} harfin ${g.correct === g.letters ? 'hepsini' : `${csCount(g.correct, 'ini')}`}`;
    const none = (g: { letters: number }) => `${g.letters} harfin hiçbirini`;
    let text: string;
    if (S.correct > 0 && L.correct > 0) {
      text = v(
        `Kısa dizilerde (3 ve 4 harf) ${some(S)}, uzun dizilerde (6 ve 7 harf) ${some(L)} doğru yerde hatırladın.`,
        `Çocuğunuz kısa dizilerde (3 ve 4 harf) ${some(S)}, uzun dizilerde (6 ve 7 harf) ${some(L)} doğru yerde hatırladı.`,
      );
    } else {
      const part = (g: { correct: number; letters: number }, yes: string, no: string) =>
        g.correct > 0 ? `${some(g)} doğru yerde ${yes}` : `${none(g)} doğru yerde ${no}`;
      text = v(
        `Kısa dizilerde (3 ve 4 harf) ${part(S, 'hatırladın', 'hatırlayamadın')}; uzun dizilerde (6 ve 7 harf) ${part(L, 'hatırladın', 'hatırlayamadın')}.`,
        `Çocuğunuz kısa dizilerde (3 ve 4 harf) ${part(S, 'hatırladı', 'hatırlayamadı')}; uzun dizilerde (6 ve 7 harf) ${part(L, 'hatırladı', 'hatırlayamadı')}.`,
      );
    }
    if (pShort >= 0.9 && pLong >= 0.9) {
      text +=
        pLong >= pShort
          ? v(' Diziler uzadıkça sonucun düşmedi.', ' Diziler uzadıkça sonucu düşmedi.')
          : v(' Diziler uzadıkça sonucun pek değişmedi.', ' Diziler uzadıkça sonucu pek değişmedi.');
    } else if (diff >= 0.2) {
      text += v(
        ' Diziler uzadıkça doğru yerde hatırladığın harflerin oranı düştü. Uzun dizilerde hem akılda tutulacak harf hem araya giren işlem artar; bu yüzden diziler uzadıkça zorlanmak bu görevde olağandır.',
        ' Diziler uzadıkça doğru yerde hatırladığı harflerin oranı düştü. Uzun dizilerde hem akılda tutulacak harf hem araya giren işlem artar; bu yüzden diziler uzadıkça zorlanmak bu görevde olağandır.',
      );
    } else if (diff >= 0.1 && L.letters - L.correct >= 3) {
      // Birkaç harflik farklar yorumlanmaz: uzun dizilerde en az üç yer doğru değilse.
      text += v(
        ' Diziler uzadıkça doğru yerde hatırladığın harflerin oranı biraz düştü.',
        ' Diziler uzadıkça doğru yerde hatırladığı harflerin oranı biraz düştü.',
      );
    } else if (diff <= -0.1 && S.letters - S.correct >= 3) {
      text += v(
        ' Uzun dizilerde harflerin, kısa dizilerdekinden daha büyük bir kısmını doğru yerde hatırladın. Kısa dizilerde dikkatin dağılmış olabilir.',
        ' Uzun dizilerde harflerin, kısa dizilerdekinden daha büyük bir kısmını doğru yerde hatırladı. Kısa dizilerde dikkati dağılmış olabilir.',
      );
    } else {
      text += v(' Diziler uzadıkça sonucun pek değişmedi.', ' Diziler uzadıkça sonucu pek değişmedi.');
    }
    if (P > 0 && P < r.sets) {
      text += v(
        ` ${r.sets} diziden ${csCount(P, 'inin')} bütün harflerini doğru sırayla hatırladın.`,
        ` Çocuğunuz ${r.sets} diziden ${csCount(P, 'inin')} bütün harflerini doğru sırayla hatırladı.`,
      );
    }
    text +=
      ' Her uzunlukta yalnızca iki dizi olduğu için bütün harfleri doğru hatırlanan en uzun dizi yalnızca kabaca fikir verir; asıl sonuç, doğru yerde hatırlanan harflerin toplamıdır.';
    uzunluk = {
      ...card('hb_uzunluk'),
      headline: P === r.sets ? 'Bütün diziler tam' : r.longest !== null ? `En uzun tam dizi: ${r.longest} harf` : 'Tam hatırlanan dizi yok',
      detail: r.bySize.map((s) => `${s.size} harflik ${s.correct}/${s.letters}`).join(' · '),
      text,
    };
  }

  /* İşlemler */
  const opsDetail = `Doğru ${O.correct} · Yanlış ${O.wrong} · Süre doldu ${O.timeouts}`;
  const limitText =
    r.limitMs !== null && O.timeouts > 0
      ? v(
          ` Süre sınırı, alıştırmadaki hızına göre ${csSeconds(r.limitMs)} olarak belirlenmişti; süresi dolan işlemler yanlış sayıldı.`,
          ` Süre sınırı, alıştırmadaki hızına göre ${csSeconds(r.limitMs)} olarak belirlenmişti; süresi dolan işlemler yanlış sayıldı.`,
        )
      : '';
  let islemText: string;
  if (opsChance) {
    islemText = v(
      `${O.n} ${opsClause.replace(/^işlemlerin/, 'işlemin')}; bu, rastgele basan birinin de bulabileceği kadar az.`,
      `Çocuğunuz ${O.n} ${opsClause.replace(/^işlemlerin/, 'işlemin')}; bu, rastgele basan birinin de bulabileceği kadar az.`,
    );
    islemText +=
      O.timeouts > O.wrong
        ? v(
            ` İşlemlerin ${O.timeouts === O.n ? 'hepsinde' : `${O.timeouts} tanesinde`} süre doldu: işlemlerde alıştırmadakinden çok daha yavaş çalışmış, ara vermiş ya da yönergeyi tam anlamamış olabilirsin.`,
            ` İşlemlerin ${O.timeouts === O.n ? 'hepsinde' : `${O.timeouts} tanesinde`} süre doldu: işlemlerde alıştırmadakinden çok daha yavaş çalışmış, ara vermiş ya da yönergeyi tam anlamamış olabilir.`,
          )
        : v(
            ` ${O.wrong === O.n ? 'İşlemlerin hepsine' : `${O.wrong} işleme`} yanlış cevap verdin; işlemlere bakmadan basmış ya da yönergeyi tam anlamamış olabilirsin.`,
            ` ${O.wrong === O.n ? 'İşlemlerin hepsine' : `${O.wrong} işleme`} yanlış cevap verdi; işlemlere bakmadan basmış ya da yönergeyi tam anlamamış olabilir.`,
          );
    islemText += limitText;
    if (!recallChance) islemText += ' İşlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu yorumlanmadı.';
  } else {
    const parts = [
      v(
        `Harfleri akılda tutarken işlemlerin ${O.correct === O.n ? 'hepsini' : `${pct(O.accuracy)} kadarını`} süresi içinde doğru cevapladın.`,
        `Çocuğunuz harfleri akılda tutarken işlemlerin ${O.correct === O.n ? 'hepsini' : `${pct(O.accuracy)} kadarını`} süresi içinde doğru cevapladı.`,
      ),
    ];
    if (O.correct === O.n) {
      parts.push(v('Hiçbir işlemde yanılmadın ve süre hiç dolmadı.', 'Hiçbir işlemde yanılmadı ve süre hiç dolmadı.'));
    } else if (O.accuracy >= CS_OPS_TARGET) {
      parts.push(
        v(
          'Bu tür görevlerde geleneksel olarak işlemlerin en az %85’inin doğru olması istenir; bu düzeye ulaştın.',
          'Bu tür görevlerde geleneksel olarak işlemlerin en az %85’inin doğru olması istenir; çocuğunuz bu düzeye ulaştı.',
        ),
      );
    } else {
      parts.push(
        v(
          'Bu tür görevlerde geleneksel olarak işlemlerin en az %85’inin doğru olması istenir; bu düzeyin altında kaldın.',
          'Bu tür görevlerde geleneksel olarak işlemlerin en az %85’inin doğru olması istenir; çocuğunuz bu düzeyin altında kaldı.',
        ),
      );
      parts.push(
        O.timeouts > O.wrong
          ? v(
              O.wrong === 0
                ? `${O.timeouts} işlemde süre doldu; hiçbir işleme yanlış cevap vermedin. İşlemlerde alıştırmadakinden daha yavaş çalışmış olabilirsin.`
                : `${O.timeouts} işlemde süre doldu, ${O.wrong} işleme yanlış cevap verdin: süre dolması yanlış cevaptan daha sıktı. İşlemlerde alıştırmadakinden daha yavaş çalışmış olabilirsin.`,
              O.wrong === 0
                ? `${O.timeouts} işlemde süre doldu; çocuğunuz hiçbir işleme yanlış cevap vermedi. İşlemlerde alıştırmadakinden daha yavaş çalışmış olabilir.`
                : `${O.timeouts} işlemde süre doldu, çocuğunuz ${O.wrong} işleme yanlış cevap verdi: süre dolması yanlış cevaptan daha sıktı. İşlemlerde alıştırmadakinden daha yavaş çalışmış olabilir.`,
            )
          : O.wrong === O.timeouts
            ? v(
                `${O.wrong} işleme yanlış cevap verdin, ${O.timeouts} işlemde süre doldu: hem yanlış cevaplar hem de süre dolması görüldü.`,
                `Çocuğunuz ${O.wrong} işleme yanlış cevap verdi, ${O.timeouts} işlemde süre doldu: hem yanlış cevaplar hem de süre dolması görüldü.`,
              )
            : v(
                `${O.wrong} işleme yanlış cevap verdin${O.timeouts > 0 ? `, ${O.timeouts} işlemde süre doldu` : ''}. Harfleri akılda tutmaya çalışırken işlemlerde acele etmiş olabilirsin.`,
                `Çocuğunuz ${O.wrong} işleme yanlış cevap verdi${O.timeouts > 0 ? `, ${O.timeouts} işlemde süre doldu` : ''}. Harfleri akılda tutmaya çalışırken işlemlerde acele etmiş olabilir.`,
              ),
      );
    }
    let text = parts.join(' ') + limitText;
    if (rapid) {
      text += v(
        ` İşlemlerin ${rapidPhrase} yarım saniyeden kısa sürede cevap verdin; bu sürede bir işlemi okuyup hesaplamak zordur. Bu işlemlere bakılmadan basılmış olabilir.`,
        ` Çocuğunuz işlemlerin ${rapidPhrase} yarım saniyeden kısa sürede cevap verdi; bu sürede bir işlemi okuyup hesaplamak zordur. Bu işlemlere bakılmadan basılmış olabilir.`,
      );
    }
    text += ' İşlemler matematik becerisini ölçmek için değil, harfleri akılda tutmayı zorlaştırmak için vardır.';
    islemText = text;
  }
  const islem: CognitiveBlock = {
    ...card('hb_islem'),
    headline:
      O.correct === 0
        ? `${O.n} işlemin hiçbiri doğru değil`
        : O.correct === O.n
          ? `${O.n} işlemin hepsi doğru`
          : `${O.n} işlemin ${csCount(O.correct, 'i')} doğru (${pct(O.accuracy)})`,
    detail: opsDetail,
    text: islemText,
  };

  /* Hata türleri */
  const E = N - X;
  let hata: CognitiveBlock;
  const hataDetail = `Yeri karışan ${r.order} · Dizide olmayan ${r.intrusion} · Boş ${r.blank}`;
  if (noRead) {
    hata = { ...card('hb_hata'), headline: 'Yorumlanmadı', detail: hataDetail, text: `${noReadWhy} doğru yerde olmayan harflerin türü yorumlanmadı.` };
  } else if (E === 0) {
    hata = {
      ...card('hb_hata'),
      headline: 'Hata yok',
      text: v('Bütün harfleri doğru yerde seçtin; hiçbir harfin yeri karışmadı.', 'Çocuğunuz bütün harfleri doğru yerde seçti; hiçbir harfin yeri karışmadı.'),
    };
  } else {
    // "Doğru yerde olmayan 7 yerin 4 tanesinde …, 3 tanesi boş kaldı"; tek tür bütün yerleri kapsıyorsa "hepsinde".
    const many = (k: number, all: string) =>
      E === 1 ? '' : k === E ? `${all} ` : k === 1 ? (all === 'hepsi' ? 'biri ' : 'birinde ') : `${k} tanesi${all === 'hepsi' ? '' : 'nde'} `;
    const lead = E === 1 ? (r.blank === 1 ? 'Doğru yerde olmayan tek yer' : 'Doğru yerde olmayan tek yerde') : `Doğru yerde olmayan ${E} yerin`;
    const kinds = [
      r.order > 0 ? `${many(r.order, 'hepsinde')}harf o dizide vardı ama yeri karıştı` : '',
      r.intrusion > 0 ? `${many(r.intrusion, 'hepsinde')}o dizide olmayan bir harf seçildi` : '',
      r.blank > 0 ? `${many(r.blank, 'hepsi')}boş kaldı` : '',
    ].filter(Boolean);
    let text = `${lead} ${joinTr(kinds)}.`;
    if (2 * r.order > E) {
      text += v(
        ' Yeri karışan harflerde harfi hatırladın ama sırasını karıştırdın. Bu testte bir harf yalnızca gösterildiği sıradaki yerde seçilirse doğru sayılır; harflerin sırasını da akılda tutmak gerekir.',
        ' Yeri karışan harflerde çocuğunuz harfi hatırladı ama sırasını karıştırdı. Bu testte bir harf yalnızca gösterildiği sıradaki yerde seçilirse doğru sayılır; harflerin sırasını da akılda tutmak gerekir.',
      );
    } else if (2 * r.intrusion > E) {
      text += ' O dizide olmayan bir harfin seçildiği yerlerde harf başka bir harfle karışmış ya da tahmin edilmiş olabilir.';
    } else if (2 * r.blank > E) {
      text += ' Boş kalan yerler hatırlanamayan harflerdir; hatırlanamayan harfin yerine BOŞ düğmesine basmak öteki harflerin yerinde kalmasını sağlar.';
    } else {
      text += ' Bu yerlerde hata türlerinden hiçbiri ötekilerden belirgin biçimde çok değildi.';
    }
    // Sayılar başlıkta ve metinde geçtiği için ayrıntı satırı yoktur.
    hata = {
      ...card('hb_hata'),
      headline: [r.order > 0 ? `Yeri karışan ${r.order}` : '', r.intrusion > 0 ? `dizide olmayan ${r.intrusion}` : '', r.blank > 0 ? `boş ${r.blank}` : '']
        .filter(Boolean)
        .join(' · ')
        .replace(/^./, (c) => c.toLocaleUpperCase('tr-TR')),
      text,
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const chart: CognitiveReport['chart'] = {
    title: 'Dizi uzunluğuna göre doğru yerde hatırlanan harfler',
    note: v(
      'Her satırda aynı uzunluktaki iki dizinin harfleri vardır. Çubuk ne kadar uzunsa o dizilerdeki harflerin o kadar çoğunu doğru yerde hatırlamışsın demektir.',
      'Her satırda aynı uzunluktaki iki dizinin harfleri vardır. Çubuk ne kadar uzunsa o dizilerdeki harflerin o kadar çoğu doğru yerde hatırlanmış demektir.',
    ),
    rows: r.bySize.map((s) => ({ label: `${s.size} harflik diziler`, value: s.correct, max: s.letters, valueLabel: `${s.correct}/${s.letters}` })),
  };
  const figures = [
    { label: 'Doğru yerde hatırlanan harf', value: `${X}/${N}` },
    { label: 'Bütün harfleri doğru dizi', value: `${P}/${r.sets}` },
    { label: 'İşlem doğruluğu', value: pct(O.accuracy) },
    ...(r.limitMs !== null ? [{ label: 'İşlem süre sınırı', value: csSeconds(r.limitMs) }] : []),
  ];
  const profile: CognitiveReport['profile'] = noRead
    ? undefined
    : {
        title: v('Dizi uzunluğuna göre sonucun', 'Dizi uzunluğuna göre sonuç'),
        note: v(
          'Her sütun aynı uzunluktaki iki dizidir (3 harften 7 harfe). Sütun ne kadar yüksekse o dizilerdeki harflerin o kadar çoğunu doğru yerde hatırlamışsın demektir; tam boy sütun, hepsini doğru yerde hatırladığın anlamına gelir. Renkler yalnızca dizi uzunluklarını ayırır.',
          'Her sütun aynı uzunluktaki iki dizidir (3 harften 7 harfe). Sütun ne kadar yüksekse o dizilerdeki harflerin o kadar çoğu doğru yerde hatırlanmış demektir; tam boy sütun, hepsinin doğru yerde hatırlandığı anlamına gelir. Renkler yalnızca dizi uzunluklarını ayırır.',
        ),
        bars: r.bySize.map((s, i) => ({
          key: `d${s.size}`,
          label: `${s.size} harflik`,
          value: Math.round((s.correct / s.letters) * 100),
          min: 0,
          max: 100,
          color: COMPLEX_SPAN_SIZE_COLORS[i % COMPLEX_SPAN_SIZE_COLORS.length],
          valueLabel: `${s.correct}/${s.letters}`,
          band: '',
        })),
      };
  return { blocks: [harf, uzunluk, islem, hata], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Desen hatırlama ---------- */

/** "3 tanesinde" ama "birinde". */
const dhCount = (k: number, suffix: 'i' | 'inde' | 'ini') => (k === 1 ? `bir${suffix}` : `${k} tanes${suffix}`);

/**
 * Desen hatırlamanın dört sonuç kartı, desen büyüklüğüne göre grafik ve öne çıkan sayılar. Durumların sırası ve eşikleri
 * uyarılarla (lib/scoring/tasks.ts, patternQualityNotes) aynıdır: en küçük desenler de hatırlanamamışsa sonuç yorumlanmaz;
 * testin bittiği büyüklükten önceki desenlerin yarısında "Hatırlamıyorum" denmişse ya da yanlış desenlerin bir kısmı
 * bakılmadan işaretlenmiş olabilecek kadar hızlıysa sonuç dikkatle okunur. Türkiye normu olmadığı için sonuç akranlarla
 * karşılaştırılmaz; desenlerin büyüklüğüyle anlatılır.
 */
function patternBlocks(r: PatternResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const floor = patternFloor(r);
  const manySkip = !floor && patternManySkipped(r);
  const rapid = !floor && patternRapid(r);
  const doubt = manySkip || rapid;
  const hedge = v('Çalışma biçimi kartında anlatılan nedenle bu sonuç seni tam yansıtmayabilir.', 'Çalışma biçimi kartında anlatılan nedenle bu sonuç çocuğunuzu tam yansıtmayabilir.');
  const noReadWhy = `En küçük (${r.start} kareli) desenler de hatırlanamadığı için`;
  const lastLevel = r.levels[r.levels.length - 1];

  /* En büyük doğru desen (desen aralığı) */
  let aralik: CognitiveBlock;
  if (floor) {
    aralik = {
      ...card('dh_aralik'),
      headline: 'Yorumlanmadı',
      text: v(
        `En küçük (${r.start} kareli) üç desenin hiçbirini tam doğru hatırlayamadın; bu yüzden hatırlanan en büyük desen belirtilmedi. Yönergeyi tam anlamamış, desenlere yeterince bakamamış ya da testi yarıda bırakmış olabilirsin. Dinlenmiş olduğun bir gün, yönergeyi yeniden okuyup testi baştan çözmek daha doğru bir sonuç verebilir; aynı desenler yeniden gösterileceği için ikinci denemede sonuç biraz yükselebilir.`,
        `Çocuğunuz en küçük (${r.start} kareli) üç desenin hiçbirini tam doğru hatırlayamadı; bu yüzden hatırlanan en büyük desen belirtilmedi. Yönerge tam anlaşılmamış, desenlere yeterince bakılamamış ya da test yarıda bırakılmış olabilir. Dinlenmiş olduğu bir gün, yönergeyi yeniden okuyup testi baştan çözmesi daha doğru bir sonuç verebilir; aynı desenler yeniden gösterileceği için ikinci denemede sonuç biraz yükselebilir.`,
      ),
    };
  } else {
    const parts = [`Desenler ${r.start} dolu kareden ${r.max} dolu kareye kadar büyüyordu; her büyüklükte üç desen vardı ve her desen 3 saniye gösterildi.`];
    if (r.stoppedAt === null) {
      const c = lastLevel.correct;
      const which = c === lastLevel.n ? `en büyük (${r.max} kareli) desenlerin hepsini` : `en büyük (${r.max} kareli) desenlerden ${dhCount(c, 'ini')}`;
      parts.push(
        v(
          `${capTr(which)} de bütün kareleriyle doğru hatırladın. Testte daha büyük desen olmadığı için sınırının daha da yukarıda olup olmadığı bilinmiyor.`,
          `Çocuğunuz ${which} de bütün kareleriyle doğru hatırladı. Testte daha büyük desen olmadığı için sınırının daha da yukarıda olup olmadığı bilinmiyor.`,
        ),
      );
    } else {
      parts.push(
        v(
          `Bütün kareleriyle doğru hatırladığın en büyük desen ${r.span} kareliydi. ${r.stoppedAt} kareli üç desenin hiçbirini tam doğru hatırlayamadığın için test orada bitti.`,
          `Çocuğunuzun bütün kareleriyle doğru hatırladığı en büyük desen ${r.span} kareliydi. ${r.stoppedAt} kareli üç desenin hiçbirini tam doğru hatırlayamadığı için test orada bitti.`,
        ),
      );
    }
    parts.push(
      v(
        'Bu beceri; bir şeklin, bir çizimin ya da bir sayfanın düzenini kısa bir bakıştan sonra akılda tutmak gibi işlerde kullanılır: örneğin bir çizime bakıp onu kâğıda çizmek ya da bir tablonun düzenini aklında tutmak.',
        'Bu beceri; bir şeklin, bir çizimin ya da bir sayfanın düzenini kısa bir bakıştan sonra akılda tutmak gibi işlerde kullanılır: örneğin tahtadaki bir şekli deftere çizmek ya da bir tablonun düzenini akılda tutmak.',
      ),
    );
    if (r.stoppedAt !== null) {
      parts.push(
        'Her büyüklükte yalnızca üç desen olduğu ve bir büyüklükteki üç desenin hiçbiri hatırlanamayınca test bittiği için bu sayı kabaca fikir verir; o anki kısa bir dalgınlık da sonucu düşürebilir.',
      );
    }
    if (doubt) parts.push(hedge);
    aralik = { ...card('dh_aralik'), headline: r.stoppedAt === null ? `${r.span} kare (testin en büyük deseni)` : `${r.span} kare`, text: parts.join(' ') };
  }

  /* Doğru hatırlanan desenler */
  const extraAll = r.items.reduce((a, x) => a + x.extra, 0);
  const cellsLine = `Doğru işaretlenen kare ${r.cellsHit}/${r.cellsShown}${extraAll ? ` · desende olmayan ${extraAll}` : ''}`;
  let desen: CognitiveBlock;
  if (floor) {
    desen = { ...card('dh_desen'), headline: `${r.trials} desenden ${r.correct} doğru`, detail: cellsLine, text: `${noReadWhy} doğru hatırlanan desenler yorumlanmadı.` };
  } else {
    const all = r.correct === r.trials;
    const parts = [
      all
        ? v(`Gösterilen ${r.trials} desenin hepsini bütün kareleriyle doğru hatırladın.`, `Çocuğunuz gösterilen ${r.trials} desenin hepsini bütün kareleriyle doğru hatırladı.`)
        : v(
            `Gösterilen ${r.trials} desenin ${dhCount(r.correct, 'ini')} bütün kareleriyle doğru hatırladın.`,
            `Çocuğunuz gösterilen ${r.trials} desenin ${dhCount(r.correct, 'ini')} bütün kareleriyle doğru hatırladı.`,
          ),
    ];
    if (!all) {
      const firstMiss = r.levels.findIndex((l) => l.correct < l.n);
      const later = r.levels.slice(firstMiss + 1);
      // İlk yanlışın olduğu büyüklükten sonraki desenler: hepsi doğru, bir kısmı doğru ya da hiçbiri doğru değil (ya da yok).
      const laterAll = later.length > 0 && later.every((l) => l.correct === l.n);
      const laterSome = r.levels.slice(firstMiss).some((l) => l.correct > 0);
      const missLevel = r.levels[firstMiss];
      if (firstMiss > 0) {
        const fullUpTo = r.levels[firstMiss - 1].size;
        const upTo = fullUpTo === r.start ? `${r.start} kareli desenlerin` : `${fullUpTo} kareye kadarki desenlerin`;
        parts.push(
          laterSome
            ? v(`${upTo} hepsini doğru hatırladın; daha büyük desenlerde bazılarını doğru, bazılarını yanlış hatırladın.`, `${upTo} hepsini doğru hatırladı; daha büyük desenlerde bazılarını doğru, bazılarını yanlış hatırladı.`)
            : v(
                `${upTo} hepsini doğru hatırladın; ${missLevel.size} kareli desenlerin hiçbirini tam doğru hatırlayamadın.`,
                `${upTo} hepsini doğru hatırladı; ${missLevel.size} kareli desenlerin hiçbirini tam doğru hatırlayamadı.`,
              ),
          'Desenler büyüdükçe akılda tutulacak kare sayısı arttığı için büyük desenlerde yanılmak bu testte olağandır.',
        );
      } else {
        const m = missLevel.n - missLevel.correct;
        const rest = laterAll
          ? v('; daha büyük desenlerin hepsini doğru hatırladın.', '; daha büyük desenlerin hepsini doğru hatırladı.')
          : later.some((l) => l.correct > 0)
            ? v('; daha büyük desenlerde bazılarını doğru, bazılarını yanlış hatırladın.', '; daha büyük desenlerde bazılarını doğru, bazılarını yanlış hatırladı.')
            : later.length
              ? v(`; ${later[0].size} kareli desenlerin hiçbirini tam doğru hatırlayamadın.`, `; ${later[0].size} kareli desenlerin hiçbirini tam doğru hatırlayamadı.`)
              : '.';
        parts.push(
          v(
            `En küçük (${r.start} kareli) desenlerden ${m === 1 ? 'birinde' : `${m} tanesinde`} yanıldın${rest}`,
            `En küçük (${r.start} kareli) desenlerden ${m === 1 ? 'birinde' : `${m} tanesinde`} yanıldı${rest}`,
          ),
        );
      }
      // Tam doğru olmayan desenlerde karelerin çoğu yine de doğru işaretlendiyse (kısmi hatırlama; desende olmayan işaretli
      // kareler düşülür). Yanlışların yarısı ya da daha çoğu tek kare farkıysa bunu "Hata türleri" kartı söyler.
      const tried = r.items.filter((x) => !x.correct && !x.skipped);
      const triedCells = tried.reduce((a, x) => a + x.size, 0);
      const triedCredit = tried.reduce((a, x) => a + Math.max(0, x.hits - x.extra), 0);
      if (tried.length >= 2 && triedCredit >= 0.75 * triedCells && 2 * r.near < r.attemptedWrong) {
        parts.push(
          r.skipped > 0
            ? v(
                'Kareleri işaretlediğin yanlış desenlerde de karelerin çoğunu doğru yerde işaretledin: bu desenleri büyük ölçüde hatırladın, birkaç karede yanıldın.',
                'Çocuğunuz kareleri işaretlediği yanlış desenlerde de karelerin çoğunu doğru yerde işaretledi: bu desenleri büyük ölçüde hatırladı, birkaç karede yanıldı.',
              )
            : v(
                'Tam doğru hatırlayamadığın desenlerde de karelerin çoğunu doğru yerde işaretledin: bu desenleri büyük ölçüde hatırladın, birkaç karede yanıldın.',
                'Çocuğunuz tam doğru hatırlayamadığı desenlerde de karelerin çoğunu doğru yerde işaretledi: bu desenleri büyük ölçüde hatırladı, birkaç karede yanıldı.',
              ),
        );
      }
    }
    if (doubt) parts.push(hedge);
    desen = { ...card('dh_desen'), headline: all ? `${r.trials} desenin hepsi doğru` : `${r.trials} desenden ${r.correct} doğru`, detail: cellsLine, text: parts.join(' ') };
  }

  /* Hata türleri */
  let hata: CognitiveBlock;
  const W = r.attemptedWrong;
  const hataDetail = `Eksik kare ${r.missed} · fazla kare ${r.extra} · tek kare farkı ${r.near} · “Hatırlamıyorum” ${r.skipped}`;
  if (floor) {
    hata = { ...card('dh_hata'), headline: 'Yorumlanmadı', detail: hataDetail, text: `${noReadWhy} yanlış desenlerdeki hatalar yorumlanmadı.` };
  } else if (r.wrong === 0) {
    hata = {
      ...card('dh_hata'),
      headline: 'Hata yok',
      text: v('Gösterilen bütün desenleri doğru hatırladın; hiçbir karede yanılmadın.', 'Çocuğunuz gösterilen bütün desenleri doğru hatırladı; hiçbir karede yanılmadı.'),
    };
  } else if (W === 0) {
    hata = {
      ...card('dh_hata'),
      headline: '“Hatırlamıyorum” denen desenler',
      text: v(
        `Tam doğru hatırlayamadığın ${r.wrong === 1 ? 'desende' : `${r.wrong} desenin hepsinde`} “Hatırlamıyorum” düğmesine bastın; bu yüzden hangi tür hatanın öne çıktığı söylenemez.`,
        `Çocuğunuz tam doğru hatırlayamadığı ${r.wrong === 1 ? 'desende' : `${r.wrong} desenin hepsinde`} “Hatırlamıyorum” düğmesine bastı; bu yüzden hangi tür hatanın öne çıktığı söylenemez.`,
      ),
    };
  } else {
    const parts: string[] = [];
    // "Hatırlamıyorum" denen desenler de yanlış sayılır; hata türleri yalnızca kareleri işaretlenen yanlış desenlerde anlatılır.
    const subject =
      r.skipped > 0
        ? v('Kareleri işaretlediğin yanlış desenlerin', 'Çocuğunuzun kareleri işaretlediği yanlış desenlerin')
        : v('Tam doğru hatırlayamadığın desenlerin', 'Çocuğunuzun tam doğru hatırlayamadığı desenlerin');
    const doer =
      r.skipped > 0
        ? v('Kareleri işaretlediğin yanlış desenlerin', 'Çocuğunuz kareleri işaretlediği yanlış desenlerin')
        : v('Tam doğru hatırlayamadığın desenlerin', 'Çocuğunuz tam doğru hatırlayamadığı desenlerin');
    if (r.skipped > 0) {
      parts.push(
        v(
          `Tam doğru hatırlayamadığın ${r.wrong} desenin ${dhCount(r.skipped, 'inde')} “Hatırlamıyorum” düğmesine bastın; öteki ${W === 1 ? 'desende' : `${W} desende`} kareleri işaretledin.`,
          `Çocuğunuz tam doğru hatırlayamadığı ${r.wrong} desenin ${dhCount(r.skipped, 'inde')} “Hatırlamıyorum” düğmesine bastı; öteki ${W === 1 ? 'desende' : `${W} desende`} kareleri işaretledi.`,
        ),
      );
    }
    let head = W === 1 ? 'Bir yanlış desen' : `${W} yanlış desen`;
    if (W >= 2) {
      let them = doer;
      if (2 * r.near >= W) {
        const half = 2 * r.near === W;
        head = r.near === W ? 'Hepsinde tek kare farkı' : half ? 'Yarısında tek kare farkı' : 'Çoğunda tek kare farkı';
        them = v('Bunların', 'Çocuğunuz bunların');
        const q = r.near === W ? 'hepsinde' : half ? 'yarısında' : dhCount(r.near, 'inde');
        parts.push(
          v(
            `${subject} ${q} yalnızca bir kare farklıydı: ${r.near === 1 ? 'o deseni' : 'bu desenleri'} büyük ölçüde hatırladın.`,
            `${subject} ${q} yalnızca bir kare farklıydı: çocuğunuz ${r.near === 1 ? 'o deseni' : 'bu desenleri'} büyük ölçüde hatırladı.`,
          ),
        );
      }
      const how = (k: number) => (k === W ? 'hepsinde' : 'çoğunda');
      if (2 * r.fewer > W) {
        if (head.endsWith('desen')) head = 'Çoğunda kare eksik';
        parts.push(
          v(`${them} ${how(r.fewer)} desendekinden daha az kare işaretledin: bazı kareler akılda kalmamış.`, `${them} ${how(r.fewer)} desendekinden daha az kare işaretledi: bazı kareler akılda kalmamış.`),
        );
      } else if (2 * r.more > W) {
        if (head.endsWith('desen')) head = 'Çoğunda fazla kare';
        parts.push(
          v(
            `${them} ${how(r.more)} desendekinden daha çok kare işaretledin: desende olmayan kareler de işaretlendi.`,
            `${them} ${how(r.more)} desendekinden daha çok kare işaretledi: desende olmayan kareler de işaretlendi.`,
          ),
        );
      } else if (2 * r.same > W) {
        if (head.endsWith('desen')) head = 'Çoğunda yer karışıklığı';
        // Kare sayısı doğru olan yanlış desenlerde karelerin çoğu mu, birkaçı mı yanlış yerdeydi?
        const sameItems = r.items.filter((x) => !x.correct && !x.skipped && x.marked === x.size);
        const most = 2 * sameItems.reduce((a, x) => a + x.hits, 0) < sameItems.reduce((a, x) => a + x.size, 0);
        const which = most ? 'karelerin çoğunu' : 'bazı kareleri';
        parts.push(
          v(
            `${them} ${how(r.same)} kare sayısını doğru tuttun ama ${which} yanlış yere koydun.`,
            `${them} ${how(r.same)} kare sayısını doğru tuttu ama ${which} yanlış yere koydu.`,
          ),
        );
      } else {
        // Belirgin bir tür yok: sayılar olduğu gibi söylenir (sıfır olan tür anılmaz).
        const kinds = [
          r.fewer > 0 ? `${dhCount(r.fewer, 'inde')} desendekinden daha az` : '',
          r.more > 0 ? `${dhCount(r.more, 'inde')} daha çok` : '',
          r.same > 0 ? `${dhCount(r.same, 'inde')} aynı sayıda` : '',
        ].filter(Boolean);
        parts.push(v(`${them} ${joinTr(kinds)} kare işaretledin.`, `${them} ${joinTr(kinds)} kare işaretledi.`));
      }
      if (r.shifted >= 2) {
        parts.push(
          `Bunların ${r.shifted} tanesinde bir kare, doğru yerinin hemen yanına konmuştu: bu desenlerde karelerin yeri büyük ölçüde akılda kalmış, yalnızca birinin yeri bir kare kaymış.`,
        );
      }
    } else {
      const one = r.items.find((x) => !x.correct && !x.skipped)!;
      const lead = r.skipped > 0 ? v('Kareleri işaretlediğin tek yanlış desende', 'Çocuğunuzun kareleri işaretlediği tek yanlış desende') : v('Tek yanlış desende', 'Çocuğunuzun tek yanlış deseninde');
      parts.push(
        one.near
          ? v(`${lead} yalnızca bir kare farklıydı: o deseni büyük ölçüde hatırladın.`, `${lead} yalnızca bir kare farklıydı: çocuğunuz o deseni büyük ölçüde hatırladı.`)
          : `${lead} birden çok kare farklıydı.`,
        r.skipped > 0
          ? 'Kareleri işaretlenen tek bir yanlış desen olduğu için hangi tür hatanın öne çıktığı söylenemez.'
          : 'Tek bir yanlış desen olduğu için hangi tür hatanın öne çıktığı söylenemez.',
      );
    }
    if (doubt) parts.push(hedge);
    hata = { ...card('dh_hata'), headline: head, detail: hataDetail, text: parts.join(' ') };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (manySkip) {
    issues.push(
      v(
        `Testin bittiği büyüklükten önceki ${r.beforeStop} desenin ${r.skippedBeforeStop === r.beforeStop ? 'hepsinde' : `${r.skippedBeforeStop} tanesinde`} “Hatırlamıyorum” düğmesine bastın. Bu kadar çok desende bu düğmeye basıldığında testi yarıda bırakmış ya da dikkatin başka yere kaymış olabilir; sonuç dikkatle yorumlanmalıdır.`,
        `Çocuğunuz testin bittiği büyüklükten önceki ${r.beforeStop} desenin ${r.skippedBeforeStop === r.beforeStop ? 'hepsinde' : `${r.skippedBeforeStop} tanesinde`} “Hatırlamıyorum” düğmesine bastı. Bu kadar çok desende bu düğmeye basıldığında test yarıda bırakılmış ya da dikkat başka yere kaymış olabilir; sonuç dikkatle yorumlanmalıdır.`,
      ),
    );
  }
  if (rapid) {
    issues.push(
      v(
        `${r.rapid} desen çok kısa sürede işaretlendi ve karelerinin çoğu yanlıştı; bu desenlerde kareleri dikkatle işaretlememiş olabilirsin.`,
        `${r.rapid} desen çok kısa sürede işaretlendi ve karelerinin çoğu yanlıştı; bu desenlerde kareler dikkatle işaretlenmemiş olabilir.`,
      ),
    );
  }
  if (r.restarts >= PATTERN_RESTARTS_NOTE) {
    issues.push(
      v(
        `Desen gösterilirken ${r.restarts} kez başka bir uygulamaya geçtin; bu desenler bir kez daha gösterildi. Desenleri birden çok kez görmek sonucu biraz yükseltebilir.`,
        `Desen gösterilirken ${r.restarts} kez başka bir uygulamaya geçildi; bu desenler bir kez daha gösterildi. Desenleri birden çok kez görmek sonucu biraz yükseltebilir.`,
      ),
    );
  }
  const noLimit = v(
    'Bu testte işaretlemek için süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.',
    'Bu testte işaretlemek için süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan deseni doğru hatırlamaktır.',
  );
  const skipLine = floor
    ? ''
    : r.skipped === 0
      ? v('Hiçbir desende “Hatırlamıyorum” düğmesine basmadın.', 'Çocuğunuz hiçbir desende “Hatırlamıyorum” düğmesine basmadı.')
      : manySkip
        ? ''
        : v(
            `${r.skipped === 1 ? 'Bir desende' : `${r.skipped} desende`} “Hatırlamıyorum” düğmesine bastın; hatırlamadığın bir desende tahmin etmek yerine bu düğmeyi kullanmak sonucu bozmaz.`,
            `Çocuğunuz ${r.skipped === 1 ? 'bir desende' : `${r.skipped} desende`} “Hatırlamıyorum” düğmesine bastı; hatırlanmayan bir desende tahmin etmek yerine bu düğmeyi kullanmak sonucu bozmaz.`,
          );
  let calisma: CognitiveBlock;
  if (r.medianRt === null) {
    calisma = {
      ...card('dh_calisma'),
      headline: 'Süre hesaplanamadı',
      text: [skipLine, ...issues, 'İşaretleme süreleri alınamadığı için süreler yorumlanmadı.'].filter(Boolean).join(' '),
    };
  } else {
    calisma = {
      ...card('dh_calisma'),
      headline: `Desen başına tipik süre ${seconds(r.medianRt)}`,
      text: [
        v(`Bir deseni işaretlemen tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir deseni işaretlemesi tipik olarak ${seconds(r.medianRt)} sürdü.`),
        skipLine,
        ...issues,
        noLimit,
      ]
        .filter(Boolean)
        .join(' '),
    };
  }

  /* Grafik ve öne çıkan sayılar */
  const chart: CognitiveReport['chart'] = {
    title: 'Desen büyüklüğüne göre doğru hatırlanan desenler',
    note: v(
      'Her satırda aynı büyüklükteki üç desen vardır. Çubuk ne kadar uzunsa o büyüklükteki desenlerin o kadar çoğunu doğru hatırlamışsın demektir. Test, üç desenin hiçbirinin doğru hatırlanamadığı büyüklükte biter; daha büyük desenler gösterilmez.',
      'Her satırda aynı büyüklükteki üç desen vardır. Çubuk ne kadar uzunsa o büyüklükteki desenlerin o kadar çoğu doğru hatırlanmış demektir. Test, üç desenin hiçbirinin doğru hatırlanamadığı büyüklükte biter; daha büyük desenler gösterilmez.',
    ),
    rows: r.levels.map((l) => ({ label: `${l.size} kareli`, value: l.correct, max: l.n, valueLabel: `${l.correct}/${l.n}` })),
  };
  // Kısmi puan aşağı yuvarlanır: bir hata varken %100 görünmesin.
  const creditPct = r.cellsShown ? Math.floor((100 * r.cellsCredit) / r.cellsShown) : 0;
  const figures = [
    { label: 'En büyük doğru desen', value: floor ? '—' : `${r.span} kare` },
    { label: 'Doğru hatırlanan desen', value: `${r.correct}/${r.trials}` },
    { label: 'Karelerde isabet', value: `%${creditPct}`, note: 'Doğru işaretlenen kareler; desende olmayan işaretli kareler düşülür.' },
  ];
  return { blocks: [aralik, desen, hata, calisma], chart, figures };
}

/* ---------- Bakış açısı alma ---------- */

const nfDeg = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
/** "24,3 derece", "90 derece". */
const degrees = (x: number) => `${nfDeg.format(x)} derece`;

/** Bakış açısı almada büyük ve küçük dönüşlü soruların ortalama hatası en az bu kadar (derece) farklıysa fark belirgin sayılır. */
export const PA_GAP = 15;

/**
 * Bakış açısı almanın dört sonuç kartı, dönüş açısına göre grafik ve öne çıkan sayılar. Durumların sırası ve eşikleri
 * uyarılarla (lib/scoring/tasks.ts, perspectiveQualityNotes) aynıdır: rastgele düzeyi, yüksek hatayı açıklayan bir hata
 * türü, bazı sorularda düşünmeden cevap verilmiş olabilmesi. Üç boyutlu grafik yoktur: sonuç hatadır (kısa çubuk daha iyi).
 */
function perspectiveBlocks(r: PerspectiveResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = perspectiveChance(r);
  const high = perspectivePatternHigh(r);
  const doubt = perspectiveDoubt(r);
  const egoP = perspectiveEgo(r);
  const mirrorP = perspectiveMirror(r);
  const m = r.meanError;
  const unanswered = r.n - r.answered;
  const far = r.items.filter((x) => x.error > PA_CLOSE).length;
  const checkWork = v(' Çalışma biçimi kartına da bak.', ' Çalışma biçimi kartına da bakın.');

  /* Yön gösterme isabeti */
  let accText: string;
  if (chance) {
    accText =
      v(
        `Gösterdiğin yönler, rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil: rastgele gösterilen yönlerin ortalama hatası 90 derecedir ve ${r.n} soruda ortalama hata ${PA_CHANCE_MEAN} derecenin üstündeyse rastgele gösterilen yönlerden ayırt edilemez. Sorular sana çok zor gelmiş, yönergeyi tam anlamamış ya da yönleri düşünmeden göstermiş olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
        `Çocuğunuzun gösterdiği yönler, rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil: rastgele gösterilen yönlerin ortalama hatası 90 derecedir ve ${r.n} soruda ortalama hata ${PA_CHANCE_MEAN} derecenin üstündeyse rastgele gösterilen yönlerden ayırt edilemez. Sorular ona çok zor gelmiş, yönerge tam anlaşılmamış ya da yönler düşünülmeden gösterilmiş olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
      ) + (doubt ? checkWork : '');
  } else if (high) {
    const ego = `zihinde en az ${PA_EGO_MIN_SHIFT} derece dönmeyi gerektiren ${paOf(r.ego.count, r.ego.eligible)}`;
    const mir = `${paOf(r.mirror.count, r.n)}`;
    const what =
      egoP && mirrorP
        ? v(
            `${ego} yönü haritaya yukarıdan bakar gibi göstermiş, ${mir} ise sağ ile solu karıştırmış olabilirsin`,
            `${ego} yön haritaya yukarıdan bakar gibi gösterilmiş, ${mir} ise sağ ile sol karıştırılmış olabilir`,
          )
        : egoP
          ? v(
              `${ego} yönü, kendini nesnenin yanında hayal etmeden haritaya yukarıdan bakar gibi göstermiş olabilirsin`,
              `${ego} çocuğunuz kendini nesnenin yanında hayal etmeden, yönü haritaya yukarıdan bakar gibi göstermiş olabilir`,
            )
          : v(`${mir} sağ ile solu karıştırmış olabilirsin`, `${mir} sağ ile sol karıştırılmış olabilir`);
    accText = v(
      `Gösterdiğin yönlerin ortalama hatası çok yüksek, ama yanlışların rastgele dağılmıyor: ${what} (hata türleri kartına bak). Bu yüzden ortalama hata tek başına bir şey söylemez; alıştırma sorularına yeniden bakıp testi başka bir gün yeniden çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuzun gösterdiği yönlerin ortalama hatası çok yüksek, ama yanlışları rastgele dağılmıyor: ${what} (hata türleri kartına bakın). Bu yüzden ortalama hata yorumlanmamalıdır; alıştırma sorularına yeniden bakıp testi başka bir gün yeniden çözmesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    if (m <= 20) {
      accText = v(
        'Gösterdiğin oklar doğru yöne çok yakındı: kendini haritadaki nesnelerin yanında hayal edip öteki nesnelerin senin için hangi yönde kaldığını isabetle kestirebildin.',
        'Çocuğunuzun gösterdiği oklar doğru yöne çok yakındı: kendini haritadaki nesnelerin yanında hayal edip öteki nesnelerin kendisi için hangi yönde kaldığını isabetle kestirebildi.',
      );
    } else if (m <= 35) {
      accText = v(
        'Gösterdiğin oklar doğru yönden biraz saptı: kendini haritadaki nesnelerin yanında hayal edip öteki nesnelerin yönünü büyük ölçüde isabetle kestirebildin.',
        'Çocuğunuzun gösterdiği oklar doğru yönden biraz saptı: kendini haritadaki nesnelerin yanında hayal edip öteki nesnelerin yönünü büyük ölçüde isabetle kestirebildi.',
      );
    } else if (m <= 50) {
      accText = v(
        'Gösterdiğin oklar doğru yönden epeyce saptı; yine de rastgele gösterilen yönlerden çok daha isabetliydi.',
        'Çocuğunuzun gösterdiği oklar doğru yönden epeyce saptı; yine de rastgele gösterilen yönlerden çok daha isabetliydi.',
      );
    } else {
      accText = v(
        'Gösterdiğin oklar doğru yönden büyük ölçüde saptı; yine de rastgele gösterilen yönlerden daha isabetliydi. Bu tür sorularda kendini nesnenin yanına koyup yüzünü bakılan nesneye çevirmek, sonra hedefin önünde mi arkanda mı, sağında mı solunda mı kaldığını düşünmek gerekir.',
        'Çocuğunuzun gösterdiği oklar doğru yönden büyük ölçüde saptı; yine de rastgele gösterilen yönlerden daha isabetliydi. Bu tür sorularda kişinin kendini nesnenin yanına koyup yüzünü bakılan nesneye çevirmesi, sonra hedefin önünde mi arkasında mı, sağında mı solunda mı kaldığını düşünmesi gerekir.',
      );
    }
    accText += ' Ortalama hata ne kadar küçükse yönler o kadar isabetli gösterilmiş demektir; rastgele gösterilen yönlerin ortalama hatası 90 derecedir.';
    if ((egoP || mirrorP) && !doubt) {
      accText += v(
        ' Yanlışlarının bir kısmı belirli bir türde toplanıyor (hata türleri kartına bak).',
        ' Yanlışlarının bir kısmı belirli bir türde toplanıyor (hata türleri kartına bakın).',
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda düşünmeden cevap vermiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorularda düşünmeden cevap verilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  if (unanswered > 0) {
    accText += v(
      ` Cevaplamadığın ${unanswered} soru, rastgele düzeyi olan 90 derece hata sayıldı.`,
      ` Cevaplanmayan ${unanswered} soru, rastgele düzeyi olan 90 derece hata sayıldı.`,
    );
  }
  const hata: CognitiveBlock = {
    ...card('ba_hata'),
    headline: `Ortalama hata ${degrees(m)}`,
    detail: `Doğru yöne çok yakın (en çok ${PA_CLOSE} derece hata): ${r.close}/${r.n} soru`,
    text: accText,
  };

  /* Küçük ve büyük dönüşler */
  const gap = r.large.meanError - r.small.meanError;
  const counts = v(
    `Zihinde en çok ${PA_SMALL_MAX} derece dönmeyi gerektiren ${r.small.n} soruda ortalama hatan ${degrees(r.small.meanError)}, ${PA_SMALL_MAX} dereceden fazla dönmeyi gerektiren ${r.large.n} soruda ${degrees(r.large.meanError)}.`,
    `Zihinde en çok ${PA_SMALL_MAX} derece dönmeyi gerektiren ${r.small.n} soruda çocuğunuzun ortalama hatası ${degrees(r.small.meanError)}, ${PA_SMALL_MAX} dereceden fazla dönmeyi gerektiren ${r.large.n} soruda ${degrees(r.large.meanError)}.`,
  );
  const rough = ` Her grup ${r.small.n} soruya dayanır; bu karşılaştırma kaba bir göstergedir.`;
  let donus: CognitiveBlock;
  if (chance) {
    donus = {
      ...card('ba_donus'),
      headline: 'Yorumlanmadı',
      text: 'Gösterilen yönler rastgele gösterilen yönlerden belirgin biçimde daha isabetli olmadığı için iki soru grubu karşılaştırılmadı.',
    };
  } else if (high) {
    donus = {
      ...card('ba_donus'),
      headline: 'Yorumlanmadı',
      text: v(
        'Ortalama hata çok yüksek olduğu ve yanlışlar belirli bir türde toplandığı için (hata türleri kartına bak) iki soru grubu karşılaştırılmadı.',
        'Ortalama hata çok yüksek olduğu ve yanlışlar belirli bir türde toplandığı için (hata türleri kartına bakın) iki soru grubu karşılaştırılmadı.',
      ),
    };
  } else if (doubt) {
    // Sayılar verilir ama aradaki fark yorumlanmaz; başlık da bir fark söylemez (yol haritasının "Kısaca" bölümünde görünür).
    donus = {
      ...card('ba_donus'),
      headline: 'Yorumlanmadı',
      text: `${counts} ${v(
        'Bazı sorularda düşünmeden cevap vermiş olabileceğin için (çalışma biçimi kartına bak) iki grup arasındaki fark yorumlanmadı.',
        'Bazı sorularda düşünmeden cevap verilmiş olabileceği için (çalışma biçimi kartına bakın) iki grup arasındaki fark yorumlanmadı.',
      )}`,
    };
  } else {
    let head: string;
    let text: string;
    if (gap >= PA_GAP) {
      head = 'Büyük dönüşlerde daha çok hata';
      text = v(
        'Kendini zihinde çok döndürmen gereken sorularda oklar daha çok kaydı. Bu beklenen bir durumdur: hayal edilen bakış yönü haritanın yönünden ne kadar farklıysa yönü bulmak o kadar zorlaşır.',
        'Çocuğunuzun kendini zihinde çok döndürmesi gereken sorularda oklar daha çok kaydı. Bu beklenen bir durumdur: hayal edilen bakış yönü haritanın yönünden ne kadar farklıysa yönü bulmak o kadar zorlaşır.',
      );
      if (egoP) {
        text += v(
          ' Haritaya yukarıdan bakar gibi gösterilen yönler (hata türleri kartına bak) en çok büyük dönüşlerde hata yaratır; bu fark bundan da kaynaklanıyor olabilir.',
          ' Haritaya yukarıdan bakar gibi gösterilen yönler (hata türleri kartına bakın) en çok büyük dönüşlerde hata yaratır; bu fark bundan da kaynaklanıyor olabilir.',
        );
      }
    } else if (gap <= -PA_GAP) {
      head = 'Büyük dönüşlerde daha az hata';
      text = v(
        'Kendini zihinde çok döndürmen gereken sorularda oklar daha az kaydı; genellikle bunun tersi olur. Az dönmeyi gerektiren sorulardaki birkaç büyük kayma da bu sonucu doğurabilir.',
        'Çocuğunuzun kendini zihinde çok döndürmesi gereken sorularda oklar daha az kaydı; genellikle bunun tersi olur. Az dönmeyi gerektiren sorulardaki birkaç büyük kayma da bu sonucu doğurabilir.',
      );
      if (egoP || mirrorP) {
        text += v(
          ' Yanlışların belirli bir türde toplanması (hata türleri kartına bak) bu farkı etkilemiş olabilir.',
          ' Yanlışların belirli bir türde toplanması (hata türleri kartına bakın) bu farkı etkilemiş olabilir.',
        );
      }
    } else {
      head = 'İki grupta yakın hata';
      // Kart, isabet kartındaki düzeylerle aynı sözleri kullanır (en çok 20 derece "isabetli", en çok 35 "büyük ölçüde isabetli").
      const most = Math.max(r.small.meanError, r.large.meanError);
      text =
        most <= 20
          ? v(
              'Kendini zihinde çok döndürmen gerektiğinde de yönleri isabetli gösterebildin.',
              'Çocuğunuz kendini zihinde çok döndürmesi gerektiğinde de yönleri isabetli gösterebildi.',
            )
          : most <= 35
            ? v(
                'Kendini zihinde çok döndürmen gerektiğinde de yönleri büyük ölçüde isabetli gösterebildin.',
                'Çocuğunuz kendini zihinde çok döndürmesi gerektiğinde de yönleri büyük ölçüde isabetli gösterebildi.',
              )
            : v('İki gruptaki sorularda oklar birbirine yakın ölçüde kaydı.', 'İki gruptaki sorularda çocuğunuzun okları birbirine yakın ölçüde kaydı.');
    }
    donus = { ...card('ba_donus'), headline: head, text: `${counts} ${text}${rough}` };
  }

  /* Hata türleri */
  const kindLine = `Haritaya yukarıdan bakar gibi: ${r.ego.count}/${r.ego.eligible} soru · Sağ ile sol karışık: ${r.mirror.count}/${r.mirror.eligible} soru`;
  const egoText = v(
    `Zihinde en az ${PA_EGO_MIN_SHIFT} derece dönmeyi gerektiren ${paOf(r.ego.count, r.ego.eligible)} oku, hedefin haritadaki yönüne, yani haritaya yukarıdan bakar gibi gösterdin; rastgele gösterilen yönlerin bu kadar sık bu yöne düşmesi pek beklenmez. Bu sorularda kendini nesnenin yanında hayal etmek yerine haritayı olduğu gibi kullanmış olabilirsin.`,
    `Zihinde en az ${PA_EGO_MIN_SHIFT} derece dönmeyi gerektiren ${paOf(r.ego.count, r.ego.eligible)} çocuğunuz oku, hedefin haritadaki yönüne, yani haritaya yukarıdan bakar gibi gösterdi; rastgele gösterilen yönlerin bu kadar sık bu yöne düşmesi pek beklenmez. Bu sorularda kendini nesnenin yanında hayal etmek yerine haritayı olduğu gibi kullanmış olabilir.`,
  );
  const egoTip = v(
    ' Çemberin yukarısı her zaman baktığın nesnedir, haritanın yukarısı değil: önce kendini o nesneye dönmüş hayal et, sonra hedefin önünde mi arkanda mı, sağında mı solunda mı kaldığını düşün.',
    ' Çemberin yukarısı her zaman bakılan nesnedir, haritanın yukarısı değil: önce kendini o nesneye dönmüş hayal etmek, sonra hedefin önde mi arkada mı, sağda mı solda mı kaldığını düşünmek yardımcı olabilir.',
  );
  const mirrorText = v(
    `${paOf(r.mirror.count, r.mirror.eligible)} oku doğru açıyla ama ters tarafa (sağ yerine sol ya da sol yerine sağ) gösterdin; rastgele gösterilen yönlerin bu kadar sık bu yöne düşmesi pek beklenmez. Bu sorularda hedefin önünde mi arkanda mı kaldığını doğru bulup sağ ile solu karıştırmış olabilirsin.`,
    `${paOf(r.mirror.count, r.mirror.eligible)} çocuğunuz oku doğru açıyla ama ters tarafa (sağ yerine sol ya da sol yerine sağ) gösterdi; rastgele gösterilen yönlerin bu kadar sık bu yöne düşmesi pek beklenmez. Bu sorularda hedefin önde mi arkada mı kaldığını doğru bulup sağ ile solu karıştırmış olabilir.`,
  );
  const mirrorTip = v(
    ' Baktığın nesne haritada aşağıdaysa senin sağın ekranın soluna düşer; kendini o nesneye dönmüş hayal edip sağ elinin hangi yana düştüğünü düşünmek yardımcı olabilir.',
    ' Bakılan nesne haritada aşağıdaysa kişinin sağı ekranın soluna düşer; kendini o nesneye dönmüş hayal edip sağ elin hangi yana düştüğünü düşünmek yardımcı olabilir.',
  );
  let tur: CognitiveBlock;
  if (chance && !doubt) {
    tur = {
      ...card('ba_tur'),
      headline: 'Yorumlanmadı',
      text: 'Gösterilen yönler rastgele gösterilen yönlerden belirgin biçimde daha isabetli olmadığı için yanlışların türü yorumlanmadı.',
    };
  } else if (doubt) {
    tur = {
      ...card('ba_tur'),
      headline: 'Yorumlanmadı',
      detail: kindLine,
      text: v(
        'Bazı sorularda düşünmeden cevap vermiş olabileceğin için yanlışlarının türü yorumlanmadı.',
        'Bazı sorularda düşünmeden cevap verilmiş olabileceği için yanlışların türü yorumlanmadı.',
      ),
    };
  } else if (far === 0) {
    tur = {
      ...card('ba_tur'),
      headline: 'Belirgin kayma yok',
      text: v(
        `Hiçbir soruda ok doğru yönden ${PA_CLOSE} dereceden fazla kaymadı.`,
        `Hiçbir soruda çocuğunuzun gösterdiği ok doğru yönden ${PA_CLOSE} dereceden fazla kaymadı.`,
      ),
    };
  } else if (egoP && mirrorP) {
    tur = { ...card('ba_tur'), headline: 'İki hata türü birden', detail: kindLine, text: `${egoText} ${mirrorText}${egoTip}${mirrorTip}` };
  } else if (egoP) {
    tur = { ...card('ba_tur'), headline: `Haritaya yukarıdan bakar gibi: ${r.ego.count} soru`, detail: kindLine, text: egoText + egoTip };
  } else if (mirrorP) {
    tur = { ...card('ba_tur'), headline: `Sağ ile sol karışmış olabilir: ${r.mirror.count} soru`, detail: kindLine, text: mirrorText + mirrorTip };
  } else {
    tur = {
      ...card('ba_tur'),
      headline: 'Belirgin bir hata türü yok',
      detail: kindLine,
      text: v(
        'Bu kart iki tür yanlışa bakar: yönü, kendini nesnenin yanında hayal etmeden haritaya yukarıdan bakar gibi göstermek ve sağ ile solu karıştırmak. Senin cevaplarında ikisi de, rastgele gösterilen yönlerde bile görülebilecek kadar az; yanlışların belirli bir türde toplanmıyor.',
        'Bu kart iki tür yanlışa bakar: yönü, kendini nesnenin yanında hayal etmeden haritaya yukarıdan bakar gibi göstermek ve sağ ile solu karıştırmak. Çocuğunuzun cevaplarında ikisi de, rastgele gösterilen yönlerde bile görülebilecek kadar az; yanlışları belirli bir türde toplanmıyor.',
      ),
    };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (perspectiveRapid(r)) {
    issues.push(
      v(
        `${paOf(r.rapid, r.n)} çok hatalı bir yönü (45 dereceden fazla) 3 saniyeden kısa sürede gösterdin. Bu kadar kısa sürede soruyu okuyup kendini nesnenin yanında hayal etmek çok zordur; bu sorularda düşünmeden cevap vermiş olabilirsin.`,
        `Çocuğunuz ${paOf(r.rapid, r.n)} çok hatalı bir yönü (45 dereceden fazla) 3 saniyeden kısa sürede gösterdi. Bu kadar kısa sürede soruyu okuyup kendini nesnenin yanında hayal etmek çok zordur; bu sorularda düşünmeden cevap verilmiş olabilir.`,
      ),
    );
  }
  if (perspectiveSameDir(r)) {
    issues.push(
      v(
        `${paOf(r.sameDir, r.n)} hemen hemen aynı yönü gösterdin (oklar 30 derecelik dar bir dilimin içinde kaldı); doğru yönler sorudan soruya değiştiği için birçok soruda soruya bakmadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${paOf(r.sameDir, r.n)} hemen hemen aynı yönü gösterdi (oklar 30 derecelik dar bir dilimin içinde kaldı); doğru yönler sorudan soruya değiştiği için birçok soruda soruya bakmadan cevap verilmiş olabilir.`,
      ),
    );
  }
  const noLimit = v(
    ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.',
    ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan yönü doğru bulabilmektir.',
  );
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? { ...card('ba_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') }
      : {
          ...card('ba_calisma'),
          headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
          text:
            [
              v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`),
              ...issues,
            ].join(' ') + noLimit,
        };

  /* Grafik ve öne çıkan sayılar */
  const bins = r.bins.filter((b) => b.n > 0);
  const sizes = bins.map((b) => b.n);
  const per = Math.min(...sizes) === Math.max(...sizes) ? `${sizes[0]}` : `${Math.min(...sizes)}–${Math.max(...sizes)}`;
  const caution =
    chance || high
      ? ' Ortalama hata çok yüksek olduğu için gruplar arasındaki farklar yorumlanmamalıdır.'
      : doubt
        ? v(
            ' Bazı sorularda düşünmeden cevap vermiş olabileceğin için gruplar arasındaki farklar yorumlanmamalıdır.',
            ' Bazı sorularda düşünmeden cevap verilmiş olabileceği için gruplar arasındaki farklar yorumlanmamalıdır.',
          )
        : '';
  const chart: CognitiveReport['chart'] = {
    title: 'Zihinde dönme açısına göre ortalama hata',
    note:
      v(
        `Sorular, kendini zihinde ne kadar döndürmen gerektiğine göre gruplandı. Çubuklar her gruptaki ortalama hatayı gösterir; kısa çubuk daha isabetli demektir. Rastgele gösterilen yönlerin ortalama hatası 90 derecedir. Her grupta ${per} soru olduğu için bu grafik kaba bir göstergedir.`,
        `Sorular, kişinin kendini zihinde ne kadar döndürmesi gerektiğine göre gruplandı. Çubuklar her gruptaki ortalama hatayı gösterir; kısa çubuk daha isabetli demektir. Rastgele gösterilen yönlerin ortalama hatası 90 derecedir. Her grupta ${per} soru olduğu için bu grafik kaba bir göstergedir.`,
      ) + caution,
    rows: bins.map((b) => ({ label: `${b.from}–${b.to} derece dönüş (${b.n} soru)`, value: b.meanError, max: 180, valueLabel: `${nfDeg.format(b.meanError)}°` })),
  };
  const figures = [
    { label: 'Ortalama hata', value: degrees(m) },
    { label: 'Doğru yöne çok yakın cevaplar', value: `${r.close}/${r.n}`, note: `en çok ${PA_CLOSE} derece hata` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  return { blocks: [hata, donus, tur, calisma], chart, figures };
}

/* ---------- Düşünerek karar verme ---------- */

/** Soru grupları (grafikte ve üç boyutlu grafikte): adı, rengi ve sonuçtaki yeri. */
export const REFLECTION_GROUPS: { key: 'numLure' | 'verbLure' | 'control'; name: string; color: string }[] = [
  { key: 'numLure', name: 'Sayısal tuzaklı sorular', color: '#2f5ce0' },
  { key: 'verbLure', name: 'Sözel tuzaklı sorular', color: '#0e9c8c' },
  { key: 'control', name: 'Tuzaksız eş sorular', color: '#d28a14' },
];

/** Düşünerek karar vermenin dört sonuç kartı, soru gruplarına göre grafik, öne çıkan sayılar ve üç boyutlu grafik. */
function reflectionBlocks(r: ReflectionResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const L = r.lure;
  const C = r.control;
  const chance = reflectionChance(r);
  const rapid = reflectionRapid(r);
  const samePos = reflectionSamePosition(r);
  const doubt = rapid || samePos;
  const wrong = L.n - L.correct;
  const suspicious = reflectionSuspicious(r);
  const ctrlLow = reflectionControlLow(r);

  /* Tuzaklı sorular */
  let accText: string;
  if (chance) {
    accText = v(
      `Tuzaksız eş soruların da çoğunda doğru cevabı bulamadın (${C.n} sorunun ${C.correct === 0 ? 'hiçbiri doğru değil' : `yalnızca ${C.correct} tanesi doğru`}). Sorular dikkatle okunmamış, yönerge tam anlaşılmamış ya da cevaplar rastgele seçilmiş olabilir; bu yüzden tuzaklı sorulardaki sonuç yorumlanmadı. Dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir; aynı sorular yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
      `Çocuğunuz tuzaksız eş soruların da çoğunda doğru cevabı bulamadı (${C.n} sorunun ${C.correct === 0 ? 'hiçbiri doğru değil' : `yalnızca ${C.correct} tanesi doğru`}). Sorular dikkatle okunmamış, yönerge tam anlaşılmamış ya da cevaplar rastgele seçilmiş olabilir; bu yüzden tuzaklı sorulardaki sonuç yorumlanmadı. Dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir; aynı sorular yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
    );
  } else {
    const intro = `Bu testteki ${L.n} soruda ilk akla gelen cevap yanlıştı.`;
    let level: string;
    if (L.correct >= 13) {
      level = v(
        `Bunların ${L.correct} tanesinde ilk akla gelen cevabı denetleyip doğru cevabı buldun: tuzakların hemen hepsini fark ettin.`,
        `Çocuğunuz bunların ${L.correct} tanesinde ilk akla gelen cevabı denetleyip doğru cevabı buldu: tuzakların hemen hepsini fark etti.`,
      );
    } else if (L.correct >= 9) {
      level = v(`Bunların ${L.correct} tanesinde doğru cevabı buldun: tuzakların çoğunu fark ettin.`, `Çocuğunuz bunların ${L.correct} tanesinde doğru cevabı buldu: tuzakların çoğunu fark etti.`);
    } else if (L.correct >= 5) {
      level = v(
        `Bunların ${L.correct} tanesinde doğru cevabı buldun: tuzakların bir kısmını fark ettin, bir kısmında doğru cevaba ulaşamadın.`,
        `Çocuğunuz bunların ${L.correct} tanesinde doğru cevabı buldu: tuzakların bir kısmını fark etti, bir kısmında doğru cevaba ulaşamadı.`,
      );
    } else if (L.correct > 0) {
      level = v(
        `Bunların yalnızca ${L.correct} tanesinde doğru cevabı buldun: tuzakların çoğunda doğru cevaba ulaşamadın.`,
        `Çocuğunuz bunların yalnızca ${L.correct} tanesinde doğru cevabı buldu: tuzakların çoğunda doğru cevaba ulaşamadı.`,
      );
    } else {
      level = v('Bunların hiçbirinde doğru cevabı bulamadın.', 'Çocuğunuz bunların hiçbirinde doğru cevabı bulamadı.');
    }
    accText = `${intro} ${level}`;
    if (L.correct <= 12 && L.lure >= L.other) accText += ' Bu tür sorularda ilk akla gelen cevap çok güçlüdür; birçok kişi bu cevabı verir.';
    const diff = r.numLure.correct - r.verbLure.correct;
    if (diff <= -3) {
      accText += v(
        ' Sayısal sorulardaki tuzaklarda, sözel sorulardakilerden belirgin daha az doğru cevap buldun. Sayısal sorularda tuzağı fark etmenin yanında hesap da gerekir; bu fark hesaplardan da kaynaklanmış olabilir.',
        ' Çocuğunuz sayısal sorulardaki tuzaklarda, sözel sorulardakilerden belirgin daha az doğru cevap buldu. Sayısal sorularda tuzağı fark etmenin yanında hesap da gerekir; bu fark hesaplardan da kaynaklanmış olabilir.',
      );
    } else if (diff >= 3) {
      accText += v(
        ' Sözel sorulardaki tuzaklarda, sayısal sorulardakilerden belirgin daha az doğru cevap buldun. Sözel sorularda tuzak sorunun içindeki küçük bir ayrıntıdadır; soruyu sonuna kadar dikkatle okumak gerekir.',
        ' Çocuğunuz sözel sorulardaki tuzaklarda, sayısal sorulardakilerden belirgin daha az doğru cevap buldu. Sözel sorularda tuzak sorunun içindeki küçük bir ayrıntıdadır; soruyu sonuna kadar dikkatle okumak gerekir.',
      );
    }
    if (ctrlLow && suspicious) {
      accText += v(
        ` Tuzaksız eş soruların ${C.lure} tanesinde de tuzak varmış gibi cevap verdiğin için bu sonucun bir kısmı her soruda tuzak aramaktan kaynaklanmış olabilir; sonuç dikkatle yorumlanmalıdır (benzer soru çiftleri kartına bak).`,
        ` Çocuğunuz tuzaksız eş soruların ${C.lure} tanesinde de tuzak varmış gibi cevap verdiği için bu sonucun bir kısmı her soruda tuzak aramaktan kaynaklanmış olabilir; sonuç dikkatle yorumlanmalıdır (benzer soru çiftleri kartına bakın).`,
      );
    } else if (ctrlLow) {
      accText += v(
        ` Tuzaksız eş soruların ${C.n - C.correct} tanesinde yanlış cevap verdiğin için bu sonuç dikkatle yorumlanmalıdır (benzer soru çiftleri kartına bak).`,
        ` Çocuğunuz tuzaksız eş soruların ${C.n - C.correct} tanesinde yanlış cevap verdiği için bu sonuç dikkatle yorumlanmalıdır (benzer soru çiftleri kartına bakın).`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda okumadan ya da bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorularda okumadan ya da bakmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = {
    ...card('dk_dogru'),
    headline: `${L.n} tuzaklı soruda ${L.correct} doğru`,
    detail: `Sayısal ${r.numLure.correct}/${r.numLure.n} · Sözel ${r.verbLure.correct}/${r.verbLure.n}`,
    text: accText,
  };

  /* Yanlışların türü */
  let yanlis: CognitiveBlock;
  if (chance) {
    yanlis = { ...card('dk_yanlis'), headline: 'Yorumlanmadı', text: 'Tuzaksız eş soruların da çoğu yanlış olduğu için yanlışların türü yorumlanmadı.' };
  } else if (wrong === 0) {
    yanlis = {
      ...card('dk_yanlis'),
      headline: 'Yanlış yok',
      text: suspicious
        ? v(
            'Tuzaklı soruların hiçbirinde yanlış cevap vermedin; ancak tuzaksız sorularda da tuzak aradığın için bu, her soruda tuzak aramaktan da kaynaklanmış olabilir.',
            'Çocuğunuz tuzaklı soruların hiçbirinde yanlış cevap vermedi; ancak tuzaksız sorularda da tuzak aradığı için bu, her soruda tuzak aramaktan da kaynaklanmış olabilir.',
          )
        : v(
            'Tuzaklı soruların hiçbirinde yanlış cevap vermedin; ilk akla gelen cevabı her soruda denetledin.',
            'Çocuğunuz tuzaklı soruların hiçbirinde yanlış cevap vermedi; ilk akla gelen cevabı her soruda denetledi.',
          ),
    };
  } else {
    let text: string;
    if (doubt) {
      text = v(
        `Tuzaklı sorulardaki ${wrong} yanlışın ${L.lure} tanesi ilk akla gelen cevap, ${L.other} tanesi başka bir yanlıştı. Bazı sorularda okumadan ya da bakmadan seçmiş olabileceğin için yanlışların türü yorumlanmadı.`,
        `Tuzaklı sorulardaki ${wrong} yanlışın ${L.lure} tanesi ilk akla gelen cevap, ${L.other} tanesi başka bir yanlıştı. Bazı sorularda okumadan ya da bakmadan seçilmiş olabileceği için yanlışların türü yorumlanmadı.`,
      );
    } else if (wrong === 1) {
      text = v(
        `Tuzaklı sorulardan yalnızca birinde yanlış cevap verdin; bu cevap ${L.lure ? 'sorunun ilk anda akla getirdiği cevaptı' : 'ilk akla gelen cevap değil, başka bir yanlıştı'}.`,
        `Çocuğunuz tuzaklı sorulardan yalnızca birinde yanlış cevap verdi; bu cevap ${L.lure ? 'sorunun ilk anda akla getirdiği cevaptı' : 'ilk akla gelen cevap değil, başka bir yanlıştı'}.`,
      );
    } else if (L.lure >= 2 && L.lure >= 2 * L.other) {
      const share = L.other === 0 ? 'hepsinde' : `çoğunda (${wrong} yanlışın ${L.lure} tanesinde)`;
      const example =
        'Bu cevaplar ilk bakışta doğru görünür ama soruyla karşılaştırılınca uymaz. Örneğin bir sopa ile bir top birlikte 110 lira ve sopa toptan 100 lira pahalıysa, akla ilk gelen “top 10 lira” cevabı yanlıştır: o zaman sopa 110 lira olur ve ikisi birlikte 120 lira eder.';
      text = v(
        `Yanlışlarının ${share} sorunun ilk anda akla getirdiği cevabı seçtin. ${example} Bir cevap çok kolay geliyorsa onu sorudaki bilgilerle bir kez sınamak işine yarayabilir.`,
        `Çocuğunuz yanlışlarının ${share} sorunun ilk anda akla getirdiği cevabı seçti. ${example} Bir cevap çok kolay geliyorsa onu sorudaki bilgilerle bir kez sınamak ona yardım edebilir.`,
      );
    } else if (L.other >= 2 && L.other > L.lure) {
      text = v(
        `Yanlışlarının çoğu (${wrong} yanlışın ${L.other} tanesi) ilk akla gelen cevap değil, başka bir yanlıştı. Bu tür sorularda yanlışların çoğu genellikle ilk akla gelen cevaptır; senin yanlışların ise soruyu yanlış anlamaktan, hesapta yanılmaktan ya da emin olmadan seçmekten kaynaklanmış olabilir.`,
        `Çocuğunuzun yanlışlarının çoğu (${wrong} yanlışın ${L.other} tanesi) ilk akla gelen cevap değil, başka bir yanlıştı. Bu tür sorularda yanlışların çoğu genellikle ilk akla gelen cevaptır; bu yanlışlar ise soruyu yanlış anlamaktan, hesapta yanılmaktan ya da emin olmadan seçmekten kaynaklanmış olabilir.`,
      );
    } else {
      text = v(
        `Yanlışlarının ${L.lure} tanesi ilk akla gelen cevap, ${L.other} tanesi başka bir yanlıştı. İlk akla gelen cevabı sorudaki bilgilerle sınamak da, soruyu sonuna kadar dikkatle okumak da işine yarayabilir.`,
        `Çocuğunuzun yanlışlarının ${L.lure} tanesi ilk akla gelen cevap, ${L.other} tanesi başka bir yanlıştı. İlk akla gelen cevabı sorudaki bilgilerle sınamak da, soruyu sonuna kadar dikkatle okumak da ona yardım edebilir.`,
      );
    }
    yanlis = {
      ...card('dk_yanlis'),
      headline: `${wrong} yanlışın ${L.lure} tanesi ilk akla gelen cevap`,
      detail: `İlk akla gelen cevap ${L.lure} · Başka bir yanlış ${L.other}`,
      text,
    };
  }

  /* Tuzaksız eş sorular */
  let esText = `Tuzaklı soruların ${C.n} tanesinin bir de tuzaksız eşi vardı: aynı sayılar ya da benzer bir durum, ama bu kez ilk akla gelen cevap doğruydu.`;
  const how = C.correct === C.n ? 'hepsini' : `${C.correct} tanesini`;
  if (suspicious) {
    esText += v(
      ` Bu soruların ${C.lure} tanesinde, tuzak olmadığı hâlde tuzak varmış gibi cevap verdin. Her soruda tuzak aramak da yanıltabilir; cevabı sorudaki bilgilerle sınamak, tuzak olup olmadığını da gösterir.`,
      ` Çocuğunuz bu soruların ${C.lure} tanesinde, tuzak olmadığı hâlde tuzak varmış gibi cevap verdi. Her soruda tuzak aramak da yanıltabilir; cevabı sorudaki bilgilerle sınamak, tuzak olup olmadığını da gösterir.`,
    );
    if (C.other >= 2) {
      esText += v(
        ` Bu soruların ${C.other} tanesinde de başka bir yanlış cevap verdin; bu yüzden sonuç dikkatle yorumlanmalıdır.`,
        ` Çocuğunuz bu soruların ${C.other} tanesinde de başka bir yanlış cevap verdi; bu yüzden sonuç dikkatle yorumlanmalıdır.`,
      );
    }
  } else if (chance) {
    esText += v(
      ` ${C.correct === 0 ? 'Bu soruların hiçbirinde doğru cevabı bulamadın' : `Bu soruların yalnızca ${C.correct} tanesinde doğru cevabı buldun`}. Bu sorularda tuzak olmadığı için yanlışlar, soruların dikkatle okunmadığını ya da cevapların rastgele seçildiğini düşündürür.`,
      ` ${C.correct === 0 ? 'Çocuğunuz bu soruların hiçbirinde doğru cevabı bulamadı' : `Çocuğunuz bu soruların yalnızca ${C.correct} tanesinde doğru cevabı buldu`}. Bu sorularda tuzak olmadığı için yanlışlar, soruların dikkatle okunmadığını ya da cevapların rastgele seçildiğini düşündürür.`,
    );
  } else if (ctrlLow) {
    esText += v(
      ` Bu soruların ${C.n - C.correct} tanesinde de yanlış cevap verdin. Tuzaksız sorulardaki yanlışlar, tuzaklı sorulardaki yanlışların bir kısmının da dikkatin dağılmasından, soruyu yanlış okumaktan ya da hesaptan kaynaklanmış olabileceğini düşündürür.`,
      ` Çocuğunuz bu soruların ${C.n - C.correct} tanesinde de yanlış cevap verdi. Tuzaksız sorulardaki yanlışlar, tuzaklı sorulardaki yanlışların bir kısmının da dikkatin dağılmasından, soruyu yanlış okumaktan ya da hesaptan kaynaklanmış olabileceğini düşündürür.`,
    );
  } else if (r.pairControlOnly >= 2) {
    esText += v(
      ` Bu soruların ${how} doğru buldun. ${r.pairs} eşin ${r.pairControlOnly} tanesinde tuzaksız sorunun doğru cevabını buldun ama tuzaklı eşinde ilk akla gelen cevabı seçtin. Bu, o yanlışların soruyu anlamamaktan çok ilk akla gelen cevabı denetlemeden vermekten kaynaklanmış olabileceğini düşündürür.`,
      ` Çocuğunuz bu soruların ${how} doğru buldu. ${r.pairs} eşin ${r.pairControlOnly} tanesinde tuzaksız sorunun doğru cevabını buldu ama tuzaklı eşinde ilk akla gelen cevabı seçti. Bu, o yanlışların soruyu anlamamaktan çok ilk akla gelen cevabı denetlemeden vermekten kaynaklanmış olabileceğini düşündürür.`,
    );
  } else if (L.correct >= 9) {
    esText += v(` Bu soruların ${how} doğru buldun: tuzak olan ve olmayan soruları birbirinden ayırdın.`, ` Çocuğunuz bu soruların ${how} doğru buldu: tuzak olan ve olmayan soruları birbirinden ayırdı.`);
  } else {
    esText += v(
      ` Bu soruların ${how} doğru buldun: bu soruların hesapları ve cümleleri sana zor gelmedi.`,
      ` Çocuğunuz bu soruların ${how} doğru buldu: bu soruların hesapları ve cümleleri ona zor gelmedi.`,
    );
  }
  const es: CognitiveBlock = {
    ...card('dk_es'),
    headline: `${C.n} tuzaksız soruda ${C.correct} doğru`,
    detail: `Sayısal ${r.numControl.correct}/${r.numControl.n} · Sözel ${r.verbControl.correct}/${r.verbControl.n}`,
    text: esText,
  };

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    issues.push(
      v(
        `${r.n} sorunun ${r.rapid} tanesinde cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin ve ${r.rapidCorrect === 0 ? 'bu cevapların hiçbiri doğru değildi' : `bu cevapların yalnızca ${r.rapidCorrect} tanesi doğruydu`}; bu sorulara okumadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${r.n} sorunun ${r.rapid} tanesinde cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdi ve ${r.rapidCorrect === 0 ? 'bu cevapların hiçbiri doğru değildi' : `bu cevapların yalnızca ${r.rapidCorrect} tanesi doğruydu`}; bu sorulara okumadan cevap verilmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakılmadan aynı yere basılmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  const noLimit = v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
  if (r.medianRt === null) {
    calisma = { ...card('dk_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const a = r.rtLureCorrect;
    const b = r.rtLureIntuitive;
    const timesLine = a !== null && b !== null ? `Doğru bulunan tuzaklı sorularda tipik ${seconds(a)} · ilk akla gelen cevapta ${seconds(b)}` : undefined;
    let pace = '';
    if (!doubt && !chance && a !== null && b !== null) {
      if (b * 1.3 <= a) {
        pace = v(
          'İlk akla gelen cevabı seçtiğin sorularda, doğru bulduğun sorulardan daha kısa sürede cevap verdin. Doğru cevap çoğu zaman ilk cevabı bir kez daha düşünmeyi gerektirir; acele etmemek işine yarayabilir.',
          'Çocuğunuz ilk akla gelen cevabı seçtiği sorularda, doğru bulduğu sorulardan daha kısa sürede cevap verdi. Doğru cevap çoğu zaman ilk cevabı bir kez daha düşünmeyi gerektirir; acele etmemek ona yardım edebilir.',
        );
      } else if (a * 1.3 <= b) {
        pace = v(
          'İlk akla gelen cevabı seçtiğin sorulara, doğru bulduğun sorulardan daha çok zaman ayırdın; bu sorularda kararsız kalmış olabilirsin.',
          'Çocuğunuz ilk akla gelen cevabı seçtiği sorulara, doğru bulduğu sorulardan daha çok zaman ayırdı; bu sorularda kararsız kalmış olabilir.',
        );
      } else {
        pace = v(
          'Doğru bulduğun sorulara ve ilk akla gelen cevabı seçtiğin sorulara birbirine yakın süreler ayırdın.',
          'Çocuğunuz doğru bulduğu sorulara ve ilk akla gelen cevabı seçtiği sorulara birbirine yakın süreler ayırdı.',
        );
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('dk_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      detail: timesLine,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const groupNote = 'Her grupta sekiz soru vardır. Tuzaklı sorularda ilk akla gelen cevap yanlıştır; tuzaksız eş sorularda doğrudur.';
  const chart: CognitiveReport['chart'] = {
    title: 'Soru gruplarına göre doğru cevaplar',
    note: v(
      `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
      `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğu doğru cevaplanmış demektir.`,
    ),
    rows: REFLECTION_GROUPS.map((g) => ({ label: g.name, value: r[g.key].correct, max: r[g.key].n, valueLabel: `${r[g.key].correct}/${r[g.key].n}` })),
  };
  const figures = [
    { label: 'Tuzaklı sorularda doğru', value: `${L.correct}/${L.n}` },
    chance
      ? { label: 'İlk akla gelen yanlış cevap', value: 'Yorumlanmadı' }
      : wrong === 0
        ? { label: 'İlk akla gelen yanlış cevap', value: 'Yok' }
        : { label: 'İlk akla gelen yanlış cevap', value: String(L.lure), note: `${wrong} yanlıştan` },
    { label: 'Tuzaksız eş sorularda doğru', value: `${C.correct}/${C.n}` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = chance
    ? undefined
    : {
        title: v('Soru gruplarına göre sonucun', 'Soru gruplarına göre sonuç'),
        note: v(
          'Her sütun sekiz soruluk bir gruptur. Sütun ne kadar yüksekse o gruptaki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca grupları ayırır.',
          'Her sütun sekiz soruluk bir gruptur. Sütun ne kadar yüksekse o gruptaki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca grupları ayırır.',
        ),
        bars: REFLECTION_GROUPS.map((g) => ({
          key: g.key,
          label: g.name,
          value: Math.round((r[g.key].correct / r[g.key].n) * 100),
          min: 0,
          max: 100,
          color: g.color,
          valueLabel: `${r[g.key].correct}/${r[g.key].n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, yanlis, es, calisma], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Kule görevi ---------- */

/** Kule görevinde problem uzunluklarının (3–7 hamle) üç boyutlu grafikteki renkleri. */
export const TOWER_LEVEL_COLORS = ['#2f5ce0', '#0e9c8c', '#d28a14', '#ee6a36', '#7a4ee6'];

/** Cümle başındaki büyük harfi küçültür ("Uzun problemlerde" → "uzun problemlerde"). */
const lowerFirst = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1);

/** Kule görevindeki kısa süreler: 10 saniyeden kısası ondalıklı yazılır ("1,6 saniye"), yarım saniyeden kısası "bir saniyeden kısa". */
const towerSeconds = (ms: number) => (ms < 500 ? 'bir saniyeden kısa' : ms < 10_000 ? `${String(towerTenths(ms)).replace('.', ',')} saniye` : seconds(ms));
/** `towerSeconds` ile yazılan süre (saniye): karşılaştırmalar yazılan sürelerle yapılır. */
const towerTenths = (ms: number) => (ms < 500 ? 0 : ms < 10_000 ? Math.round(ms / 100) / 10 : Math.round(ms / 1000));

/** Kule görevinin dört sonuç kartı, problem uzunluğuna göre grafik, öne çıkan sayılar ve üç boyutlu grafik. */
function towerBlocks(r: TowerResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const none = towerNone(r);
  const idle = towerIdle(r);
  const rapid = towerRapid(r);
  const O = r.optimal;
  const S = r.short;
  const L = r.long;
  const mid = r.levels.filter((l) => l.moves > TOWER_SHORT && l.moves < TOWER_LONG);
  const M = { n: mid.reduce((s, l) => s + l.n, 0), optimal: mid.reduce((s, l) => s + l.optimal, 0), idle: mid.reduce((s, l) => s + l.idle, 0) };
  const midName = `${mid.map((l) => l.moves).join(' ve ')} hamlelik problemlerde`;
  const shortName = `kısa problemlerde (${TOWER_SHORT - 1} ve ${TOWER_SHORT} hamle)`;
  const longName = `uzun problemlerde (${TOWER_LONG} ve ${TOWER_LONG + 1} hamle)`;
  const noneWhy = `Problemlerin ${r.idle} tanesinde, kısa problemlerin de ${S.idle} tanesinde hiç top taşınmadığı için`;

  /* En az hamlede çözülenler */
  let accText: string;
  if (none) {
    accText = v(
      `${r.n} problemin ${r.idle} tanesinde hiç top taşımadan süre doldu; bunların ${S.idle} tanesi 3 ve 4 hamlelik kısa problemlerdi. Testte ara vermiş, görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin; bu yüzden sonuç yorumlanmadı. Dinlenmiş olduğun bir gün, yönergeyi yeniden okuyup testi baştan çözmek daha doğru bir sonuç verebilir; aynı problemler yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
      `Çocuğunuz ${r.n} problemin ${r.idle} tanesinde hiç top taşımadı ve bu problemlerde süre doldu; bunların ${S.idle} tanesi 3 ve 4 hamlelik kısa problemlerdi. Testte ara verilmiş, görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir; bu yüzden sonuç yorumlanmadı. Dinlenmiş olduğu bir gün, yönergeyi yeniden okuyup testi baştan çözmesi daha doğru bir sonuç verebilir; aynı problemler yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
    );
  } else {
    const intro = v(
      `Bu testte ${r.n} problem vardı; her problemde topları en az hamleyle hedef düzene getirmen gerekiyordu.`,
      `Bu testte ${r.n} problem vardı; her problemde çocuğunuzun topları en az hamleyle hedef düzene getirmesi gerekiyordu.`,
    );
    let level: string;
    if (O === r.n) {
      level = v('Problemlerin hepsini en az hamlede çözdün.', 'Çocuğunuz problemlerin hepsini en az hamlede çözdü.');
    } else if (O >= 16) {
      level = v(`Bunların ${O} tanesini en az hamlede çözdün: problemlerin hemen hepsinde en kısa yolu buldun.`, `Çocuğunuz bunların ${O} tanesini en az hamlede çözdü: problemlerin hemen hepsinde en kısa yolu buldu.`);
    } else if (O >= 11) {
      level = v(`Bunların ${O} tanesini en az hamlede çözdün: problemlerin çoğunda en kısa yolu buldun.`, `Çocuğunuz bunların ${O} tanesini en az hamlede çözdü: problemlerin çoğunda en kısa yolu buldu.`);
    } else if (O >= 6) {
      level = v(
        `Bunların ${O} tanesini en az hamlede çözdün: problemlerin bir kısmında en kısa yolu buldun, bir kısmında daha çok hamle gerekti ya da hedefe ulaşamadın.`,
        `Çocuğunuz bunların ${O} tanesini en az hamlede çözdü: problemlerin bir kısmında en kısa yolu buldu, bir kısmında daha çok hamle gerekti ya da hedefe ulaşamadı.`,
      );
    } else if (O > 0) {
      level = v(
        `Bunların ${O} tanesini en az hamlede çözdün; öteki problemlerde daha çok hamle gerekti ya da hedefe ulaşamadın.`,
        `Çocuğunuz bunların ${O} tanesini en az hamlede çözdü; öteki problemlerde daha çok hamle gerekti ya da hedefe ulaşamadı.`,
      );
    } else {
      level = v('Bunların hiçbirini en az hamlede çözemedin.', 'Çocuğunuz bunların hiçbirini en az hamlede çözemedi.');
    }
    accText = `${intro} ${level}`;
    if (idle) {
      // Kısa problemlerin hepsinde top taşındıysa yönerge anlaşılmıştır: hiç top taşınmayan (uzun) problemlerde süre yetmemiş olabilir.
      const why =
        S.idle === 0
          ? v('çözümü kafanda ararken süre yetmemiş ya da ara vermiş olabilirsin', 'çözüm kafada aranırken süre yetmemiş ya da ara verilmiş olabilir')
          : v('çözümü kafanda ararken süre yetmemiş, ara vermiş ya da yönergeyi tam anlamamış olabilirsin', 'çözüm kafada aranırken süre yetmemiş, ara verilmiş ya da yönerge tam anlaşılmamış olabilir');
      accText += v(
        ` ${r.idle} problemde hiç top taşımadan süre doldu; bu problemlerde ${why}. Bu yüzden bu sonuç seni tam yansıtmayabilir.`,
        ` ${r.idle} problemde hiç top taşınmadan süre doldu; bu problemlerde ${why}. Bu yüzden bu sonuç çocuğunuzu tam yansıtmayabilir.`,
      );
    }
  }
  const dogru: CognitiveBlock = {
    ...card('kg_dogru'),
    headline: `${r.n} problemin ${O} tanesi en az hamlede`,
    detail: r.levels.map((l) => `${l.moves} hamlelik ${l.optimal}/${l.n}`).join(' · '),
    text: accText,
  };

  /* Problem uzadıkça */
  let uzunluk: CognitiveBlock;
  if (none) {
    uzunluk = { ...card('kg_uzunluk'), headline: 'Yorumlanmadı', text: `${noneWhy} kısa ve uzun problemler karşılaştırılmadı.` };
  } else {
    let text = v(
      `En az hamlede çözdüğün problemler: ${shortName} ${S.optimal}/${S.n}, ${longName} ${L.optimal}/${L.n}.`,
      `Çocuğunuzun en az hamlede çözdüğü problemler: ${shortName} ${S.optimal}/${S.n}, ${longName} ${L.optimal}/${L.n}.`,
    );
    const diff = S.optimal - L.optimal;
    if (S.optimal >= S.n - 1 && L.optimal >= L.n - 1) {
      const all = L.optimal === L.n ? 'hepsinde' : 'hemen hepsinde';
      if (M.optimal < M.n - 1) {
        // Kısa ve uzun problemler iyi, aradaki problemler değil: "düşmedi" denmez, aradaki sonuç da söylenir.
        text += v(
          ` Kısa ve uzun problemlerde sonucun birbirine yakın; ${midName} ise ${M.optimal}/${M.n}.`,
          ` Kısa ve uzun problemlerde sonucu birbirine yakın; ${midName} ise ${M.optimal}/${M.n}.`,
        );
      } else if (L.optimal >= S.optimal) {
        text += v(` Problemler uzadıkça sonucun düşmedi: uzun problemlerin ${all} en kısa yolu buldun.`, ` Problemler uzadıkça sonucu düşmedi: uzun problemlerin ${all} en kısa yolu buldu.`);
      } else {
        text += v(
          ' Problemler uzadıkça sonucun pek değişmedi: uzun problemlerin de hemen hepsinde en kısa yolu buldun.',
          ' Problemler uzadıkça sonucu pek değişmedi: uzun problemlerin de hemen hepsinde en kısa yolu buldu.',
        );
      }
    } else if (diff >= 3) {
      // Uzun problemlerin yarısında ya da daha çoğunda hiç top taşınmadıysa "zorlaştı" diye kesin konuşulmaz.
      text +=
        L.idle >= L.n / 2
          ? v(
              ' Uzun problemlerin yarısında ya da daha çoğunda süre içinde en kısa yolu bulamadın. Uzun problemlerde daha çok hamleyi kafanda sıraya koyman ve bazı topları geçici olarak başka bir yere koyman gerekir; bu, aynı anda akılda tutulacak adımları da artırır.',
              ' Çocuğunuz uzun problemlerin yarısında ya da daha çoğunda süre içinde en kısa yolu bulamadı. Uzun problemlerde daha çok hamleyi kafada sıraya koymak ve bazı topları geçici olarak başka bir yere koymak gerekir; bu, aynı anda akılda tutulacak adımları da artırır.',
            )
          : v(
              ' Problemler uzadıkça en kısa yolu bulman zorlaştı. Uzun problemlerde daha çok hamleyi kafanda sıraya koyman ve bazı topları geçici olarak başka bir yere koyman gerekir; bu, aynı anda akılda tutulacak adımları da artırır. Problem uzadıkça sonucun düşmesi bu görevde olağandır.',
              ' Problemler uzadıkça en kısa yolu bulması zorlaştı. Uzun problemlerde daha çok hamleyi kafada sıraya koymak ve bazı topları geçici olarak başka bir yere koymak gerekir; bu, aynı anda akılda tutulacak adımları da artırır. Problem uzadıkça sonucun düşmesi bu görevde olağandır.',
            );
    } else if (diff <= -3) {
      text += v(' Uzun problemlerde kısa problemlerden daha çok en kısa yolu buldun.', ' Çocuğunuz uzun problemlerde kısa problemlerden daha çok en kısa yolu buldu.');
      if (S.idle === 0) {
        text += v(' Kısa problemlerde acele etmiş ya da testin başında tahtaya alışıyor olabilirsin.', ' Kısa problemlerde acele etmiş ya da testin başında tahtaya alışıyor olabilir.');
      }
    } else {
      text += v(' Problemler uzadıkça sonucun pek değişmedi.', ' Problemler uzadıkça sonucu pek değişmedi.');
    }
    const idleParts = [S.idle > 0 ? `kısa problemlerde ${S.idle}` : '', M.idle > 0 ? `${midName} ${M.idle}` : '', L.idle > 0 ? `uzun problemlerde ${L.idle}` : ''].filter(Boolean);
    if (idleParts.length) text += ` Hiç top taşınmadan süresi dolan problemler (${idleParts.join(', ')}) en az hamlede çözülmemiş sayıldı.`;
    if (S.optimal <= S.n / 2 && diff > -3) {
      const how = S.optimal === 0 ? 'hiçbirinde' : 'yarısında ya da daha çoğunda';
      text += v(
        ` Kısa problemlerin ${how} en kısa yolu bulamadın; topa dokunmadan önce hedefe dikkatle bakmak ve yönergeyi bir kez daha okumak işine yarayabilir.`,
        ` Çocuğunuz kısa problemlerin ${how} en kısa yolu bulamadı; topa dokunmadan önce hedefe dikkatle bakması ve yönergeyi bir kez daha okuması ona yardım edebilir.`,
      );
    }
    uzunluk = { ...card('kg_uzunluk'), headline: `Kısa problemlerde ${S.optimal}/${S.n}, uzun problemlerde ${L.optimal}/${L.n}`, text };
  }

  /* Çözüm biçimi */
  const E = r.extra;
  const U = r.unsolved;
  let cozumText: string;
  if (E === 0 && U === 0) {
    cozumText = v('Bütün problemlerde hedefe en az hamleyle ulaştın.', 'Çocuğunuz bütün problemlerde hedefe en az hamleyle ulaştı.');
  } else {
    const parts: string[] = [];
    if (E > 0) {
      const these = E === 1 ? 'bu problemde' : 'bu problemlerde';
      parts.push(
        v(
          `${E} problemde hedefe ulaştın ama en az hamleden fazlasını yaptın; ${these} toplam ${r.excessMoves} hamle fazla yaptın.`,
          `Çocuğunuz ${E} problemde hedefe ulaştı ama en az hamleden fazlasını yaptı; ${these} toplam ${r.excessMoves} hamle fazla yaptı.`,
        ),
      );
    }
    if (U > 0) {
      const idlePart = r.idle === 0 ? '' : r.idle === U ? (U === 1 ? '; bu problemde hiç top taşınmadı' : '; bunların hepsinde hiç top taşınmadı') : `; bunların ${r.idle} tanesinde hiç top taşınmadı`;
      parts.push(v(`${U} problemde hedefe ulaşamadın${idlePart}.`, `Çocuğunuz ${U} problemde hedefe ulaşamadı${idlePart}.`));
    }
    if (!none && E >= 3 && E >= U) {
      parts.push(
        v(
          'Fazla hamleler, bir topu hedefteki yerine erken koyup sonra yeniden kaldırmak zorunda kalmaktan ya da bir topun üstünü kapatmaktan kaynaklanabilir. Hedefte bir çubuğun en altındaki top, üstündekilerden önce yerine konmalıdır; topa dokunmadan önce hangi topun önce yerine gideceğini düşünmek işine yarayabilir.',
          'Fazla hamleler, bir topu hedefteki yerine erken koyup sonra yeniden kaldırmak zorunda kalmaktan ya da bir topun üstünü kapatmaktan kaynaklanabilir. Hedefte bir çubuğun en altındaki top, üstündekilerden önce yerine konmalıdır; topa dokunmadan önce hangi topun önce yerine gideceğini düşünmesi çocuğunuza yardım edebilir.',
        ),
      );
    } else if (!none && U >= 3 && U > E && r.idle < U) {
      parts.push(
        v(
          'Hedefe ulaşamadığın problemlerde süre yetmemiş ya da çözüm yolu bulunamamış olabilir.',
          'Çocuğunuzun hedefe ulaşamadığı problemlerde süre yetmemiş ya da çözüm yolu bulunamamış olabilir.',
        ),
      );
    }
    cozumText = parts.join(' ');
  }
  const cozum: CognitiveBlock = {
    ...card('kg_cozum'),
    headline:
      E === 0 && U === 0
        ? 'Hepsi en az hamlede'
        : [E > 0 ? `${E} problem fazla hamleyle çözüldü` : '', U > 0 ? `${U} problemde hedefe ulaşılamadı` : ''].filter(Boolean).join(' · '),
    detail: `En az hamlede ${O} · Fazla hamleyle ${E} · Hedefe ulaşılamayan ${U}`,
    text: cozumText,
  };

  /* Başlamadan önce düşünme: problem ekrana geldikten sonra taşınan ilk topun alındığı ana kadar geçen süre */
  let plan: CognitiveBlock;
  if (none) {
    plan = { ...card('kg_plan'), headline: 'Yorumlanmadı', text: `${noneWhy} ilk hamleden önceki süreler yorumlanmadı.` };
  } else if (r.medianPick === null) {
    plan = { ...card('kg_plan'), headline: 'Süre hesaplanamadı', text: 'Süreler alınamadığı için ilk hamleden önce ne kadar düşünüldüğü yorumlanmadı.' };
  } else {
    const parts: string[] = [
      v(
        `Problem ekrana geldikten sonra taşıdığın ilk topu alman tipik olarak ${towerSeconds(r.medianPick)} sürdü.`,
        `Problem ekrana geldikten sonra çocuğunuzun taşıdığı ilk topu alması tipik olarak ${towerSeconds(r.medianPick)} sürdü.`,
      ),
    ];
    // Çok çabuk başlama uyarısı varken kısa ve uzun problemler karşılaştırılmaz ("plana daha çok zaman ayırdın" ile çelişmesin).
    if (r.pickShort !== null && r.pickLong !== null && !rapid) {
      const a = towerTenths(r.pickShort);
      const b = towerTenths(r.pickLong);
      const which = `Uzun problemlerde (${TOWER_LONG} ve ${TOWER_LONG + 1} hamle) ilk hamleden önce kısa problemlerdekinden (${TOWER_SHORT - 1} ve ${TOWER_SHORT} hamle)`;
      if (b - a >= 2 && b >= 1.5 * a) {
        parts.push(v(`${which} daha uzun düşündün: problem zorlaştıkça plana daha çok zaman ayırdın.`, `Çocuğunuz ${lowerFirst(which)} daha uzun düşündü: problem zorlaştıkça plana daha çok zaman ayırdı.`));
      } else if (b > a) {
        parts.push(v(`${which} biraz daha uzun düşündün.`, `Çocuğunuz ${lowerFirst(which)} biraz daha uzun düşündü.`));
      } else {
        parts.push(v(`${which} daha uzun düşünmedin.`, `Çocuğunuz ${lowerFirst(which)} daha uzun düşünmedi.`));
        if (L.optimal >= L.n - 1) {
          const all = L.optimal === L.n ? 'hepsini' : 'hemen hepsini';
          parts.push(v(`Buna karşın uzun problemlerin de ${all} en az hamlede çözdün.`, `Buna karşın uzun problemlerin de ${all} en az hamlede çözdü.`));
        } else if (L.optimal <= L.n / 2) {
          parts.push(
            v(
              'Uzun problemlerin yarısında ya da daha çoğunda en kısa yolu bulamadın; uzun problemlerde topa dokunmadan önce ilk birkaç hamleyi kafanda denemek işine yarayabilir.',
              'Uzun problemlerin yarısında ya da daha çoğunda en kısa yolu bulamadı; uzun problemlerde topa dokunmadan önce ilk birkaç hamleyi kafada denemesi ona yardım edebilir.',
            ),
          );
        }
      }
    }
    if (rapid) {
      parts.push(
        v(
          `${TOWER_RAPID_FROM} ya da daha çok hamlelik ${r.rapidOf} problemin ${r.rapid} tanesinde taşıdığın ilk topu ${TOWER_RAPID_MS / 1000} saniyeden kısa sürede aldın ve bu problemleri en az hamlede çözemedin; bu problemlerde düşünmeden başlamış olabilirsin. Topa dokunmadan önce ilk birkaç hamleyi kafanda denemek işine yarayabilir.`,
          `Çocuğunuz ${TOWER_RAPID_FROM} ya da daha çok hamlelik ${r.rapidOf} problemin ${r.rapid} tanesinde taşıdığı ilk topu ${TOWER_RAPID_MS / 1000} saniyeden kısa sürede aldı ve bu problemleri en az hamlede çözemedi; bu problemlerde düşünmeden başlamış olabilir. Topa dokunmadan önce ilk birkaç hamleyi kafada denemesi ona yardım edebilir.`,
        ),
      );
    }
    if (r.prePlan !== null) {
      parts.push(
        v(
          `Hedefe ulaştığın problemlerde sürenin ortalama %${r.prePlan} kadarını ilk hamleden önce, gerisini topları taşırken geçirdin. 18 yaş ve üstündeki kişilerle yapılan bir araştırmada, başlamadan önce düşünmeye daha büyük pay ayıranların daha çok problemi en az hamlede çözdüğü görülmüştür; bu bir ilişkidir, kesin bir kural değildir.`,
          `Çocuğunuz hedefe ulaştığı problemlerde sürenin ortalama %${r.prePlan} kadarını ilk hamleden önce, gerisini topları taşırken geçirdi. 18 yaş ve üstündeki kişilerle yapılan bir araştırmada, başlamadan önce düşünmeye daha büyük pay ayıranların daha çok problemi en az hamlede çözdüğü görülmüştür; bu bir ilişkidir, kesin bir kural değildir.`,
        ),
      );
    }
    parts.push('Hız tek başına iyi ya da kötü değildir; önemli olan hedefe en az hamleyle ulaşabilmektir.');
    plan = {
      ...card('kg_plan'),
      headline: `İlk hamleden önce tipik ${towerSeconds(r.medianPick)}`,
      detail:
        [
          r.pickShort !== null && r.pickLong !== null ? `Kısa problemlerde tipik ${towerSeconds(r.pickShort)} · uzun problemlerde ${towerSeconds(r.pickLong)}` : null,
          r.prePlan !== null ? `başlamadan önce düşünme payı %${r.prePlan}` : null,
        ]
          .filter((x): x is string => !!x)
          .join(' · ')
          .replace(/^./, (c) => c.toLocaleUpperCase('tr-TR')) || undefined,
      text: parts.join(' '),
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const chart: CognitiveReport['chart'] = {
    title: 'Problem uzunluğuna göre en az hamlede çözülenler',
    note: v(
      'Her satırda aynı uzunlukta dört problem vardır. Çubuk ne kadar uzunsa o problemlerin o kadar çoğunu en az hamlede çözmüşsün demektir.',
      'Her satırda aynı uzunlukta dört problem vardır. Çubuk ne kadar uzunsa o problemlerin o kadar çoğu en az hamlede çözülmüş demektir.',
    ),
    rows: r.levels.map((l) => ({ label: `${l.moves} hamlelik problemler`, value: l.optimal, max: l.n, valueLabel: `${l.optimal}/${l.n}` })),
  };
  const figures = [
    { label: 'En az hamlede çözülen', value: `${O}/${r.n}` },
    { label: 'Fazla hamleyle çözülen', value: String(E) },
    { label: 'Hedefe ulaşılamayan', value: String(U) },
    ...(r.medianPick !== null && !none ? [{ label: 'İlk hamleden önce tipik süre', value: towerSeconds(r.medianPick) }] : []),
  ];
  const profile: CognitiveReport['profile'] = none
    ? undefined
    : {
        title: v('Problem uzunluğuna göre sonucun', 'Problem uzunluğuna göre sonuç'),
        note: v(
          'Her sütun aynı uzunluktaki dört problemdir (3 hamleden 7 hamleye). Sütun ne kadar yüksekse o problemlerin o kadar çoğunu en az hamlede çözmüşsün demektir; tam boy sütun, hepsini en az hamlede çözdüğün anlamına gelir. Renkler yalnızca problem uzunluklarını ayırır.',
          'Her sütun aynı uzunluktaki dört problemdir (3 hamleden 7 hamleye). Sütun ne kadar yüksekse o problemlerin o kadar çoğu en az hamlede çözülmüş demektir; tam boy sütun, hepsinin en az hamlede çözüldüğü anlamına gelir. Renkler yalnızca problem uzunluklarını ayırır.',
        ),
        bars: r.levels.map((l, i) => ({
          key: `h${l.moves}`,
          label: `${l.moves} hamlelik`,
          value: Math.round((l.optimal / l.n) * 100),
          min: 0,
          max: 100,
          color: TOWER_LEVEL_COLORS[i % TOWER_LEVEL_COLORS.length],
          valueLabel: `${l.optimal}/${l.n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, uzunluk, cozum, plan], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Kelime bilgisi ---------- */

/** Kelime bilgisinde soru türlerinin adları (raporda ve üç boyutlu grafikte), cümle içindeki kısa adları ve kısa anlatımları. */
export const VOCABULARY_TYPES: Record<VocabularyType, { name: string; short: string; plain: string; color: string }> = {
  synonym: { name: VOCABULARY_TYPE_NAMES.synonym, short: 'eş anlam', plain: 'bir kelimeye anlamca en yakın kelimeyi bilmek', color: '#2f5ce0' },
  antonym: { name: VOCABULARY_TYPE_NAMES.antonym, short: 'zıt anlam', plain: 'bir kelimenin karşıt anlamlısını bilmek', color: '#0e9c8c' },
  context: {
    name: VOCABULARY_TYPE_NAMES.context,
    short: 'cümlede anlam',
    plain: 'birden çok anlamı olan bir kelimenin cümlede hangi anlamda kullanıldığını cümlenin bütününe bakarak bulmak',
    color: '#ee6a36',
  },
  idiom: { name: VOCABULARY_TYPE_NAMES.idiom, short: 'deyim', plain: 'deyimlerin, içindeki kelimelerin gerçek anlamından farklı olan anlamını bilmek', color: '#7a4ee6' },
};

/** Çeldiricilerin yanılgıları (yanlışların yorumunda). */
export const VOCABULARY_LURE_TEXT: Record<VocabularyLure, string> = {
  swap: 'eş anlamlı ile zıt anlamlıyı karıştırmak',
  related: 'kelimeyi aynı konuyla ilgili ama anlamı farklı bir kelimeyle karıştırmak',
  sound: 'kelimeyi sesçe benzeyen başka bir kelimeyle karıştırmak',
  meaning: 'kelimenin cümledeki anlamı yerine başka bir anlamını seçmek',
  literal: 'deyimi, içindeki kelimelerin gerçek anlamıyla düşünmek',
};

/** "“eş anlam” ve “deyim”" gibi: türlerin cümle içindeki adları tırnak içinde. */
const vocabularyTypeList = (types: VocabularyType[]) => joinTr(types.map((t) => `“${VOCABULARY_TYPES[t].short}”`));

/** Kelime bilgisinin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve soru türlerinin üç boyutlu grafiği. */
function vocabularyBlocks(r: VocabularyResult, task: VocabularyTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = r.correct <= VOCABULARY_CHANCE_MAX;
  const rapid = vocabularyRapid(r);
  const samePos = vocabularySamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışların çoğu çeldiriciyse, kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz (yanılgı cümlesi açıklar).
  const lurePattern = vocabularyLurePattern(r);
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelLine = r.levels.map((l) => `${l.level}. düzey ${l.correct}/${l.n}`).join(' · ');
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  if (chance) {
    accText = v(
      `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${VOCABULARY_CHANCE_MAX} ya da daha az). Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da soruları yeterince okumadan seçmiş de olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir.`,
      `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${r.n} soruda ${VOCABULARY_CHANCE_MAX} ya da daha az). Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da sorular yeterince okunmadan seçilmiş de olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir.`,
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
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. ${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların bir kısmını doğru buldun.${lurePattern ? '' : ' Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların bir kısmını doğru buldu.${lurePattern ? '' : ' Bu, testin başında dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
      );
    } else {
      // Kolay (1–2) ve zor (4–5) düzeylerdeki doğru cevap oranları: belirgin düşüş, belirgin artış ya da yakın.
      const rate = (ls: typeof r.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
      const easyLevels = r.levels.filter((l) => l.level <= 2);
      const gap = rate(easyLevels) - rate(r.levels.filter((l) => l.level >= 4));
      if (gap >= 0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça doğru cevapların azaldı. Bu beklenen bir durumdur: üst düzeylerdeki kelimeler daha seyrek kullanılır ve anlamları daha soyuttur.`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı. Bu beklenen bir durumdur: üst düzeylerdeki kelimeler daha seyrek kullanılır ve anlamları daha soyuttur.`,
        );
      } else if (gap <= -0.15) {
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin${lurePattern ? '.' : '; kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${lurePattern ? '.' : '; kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        );
      } else {
        const slip = !lurePattern && easyLevels.some((l) => l.correct < l.n) ? ' Kolay sorulardaki yanlışlar dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : '';
        accText = v(
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Kolay ve zor düzeylerdeki doğru cevapların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
          `Sorular kolaydan zora doğru ${levelWord} düzeyde ilerliyordu. Çocuğunuzun kolay ve zor düzeylerdeki doğru cevapları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
        );
      }
    }
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği; yanılgılar olasılık olarak söylenir.
    if (lurePattern) {
      const share = r.lures === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.lures} tanesinde)`;
      const phrases = VOCABULARY_LURES_ORDER.filter((k) => r.luresByKind[k] > 0).map((k) => VOCABULARY_LURE_TEXT[k]);
      const which = phrases.length > 1 ? 'şu yanılgılardan' : 'şu yanılgıdan';
      accText += v(
        ` Yanlış cevaplarının ${share} ilk bakışta doğru görünen ama sorulan anlama uymayan seçeneği seçtin. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. Seçmeden önce seçeneklerin hepsini okumak ve cümleyi seçtiğin anlamla bir kez daha okumak işine yarar.`,
        ` Çocuğunuz yanlış cevaplarının ${share} ilk bakışta doğru görünen ama sorulan anlama uymayan seçeneği seçti. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. Seçmeden önce seçeneklerin hepsini okumak ve cümleyi seçtiği anlamla bir kez daha okumak ona yardım edebilir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı soruları okumadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı sorular okunmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('kb_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, detail: levelLine, text: accText };

  /* Ulaşılan düzey */
  let duzey: CognitiveBlock;
  if (chance) {
    duzey = { ...card('kb_duzey'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' };
  } else if (r.reached === 0) {
    duzey = {
      ...card('kb_duzey'),
      headline: v('1. düzeyde zorlandın', '1. düzeyde zorlandı'),
      detail: `1. düzey ${first.correct}/${first.n}`,
      text: v(
        `En kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadın' : `${first.correct} tanesini doğru buldun`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lurePattern ? ' Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.' : ' Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.'}`,
        `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${first.correct === 0 ? 'hiçbirini doğru bulamadı' : `${first.correct} tanesini doğru buldu`}. Bir düzeyin belirtilmesi için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ının doğru olması gerekir; bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi.${lurePattern ? ' Bu; yönergenin tam anlaşılmamasından, doğru cevaplar kartında anlatılan yanılgılardan ya da okumakta henüz yeterince rahat olmamaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.' : ' Bu; dikkatin dağılmasından, acele etmekten, yönergenin tam anlaşılmamasından ya da okumakta henüz yeterince rahat olmamaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.'}`,
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
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi${lurePattern ? '.' : ': daha zor soruları çözebildiğin için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
        ` Daha kolay olan ${joinTr(slips)} düzeyde doğru bulamadığı sorular bu sonucu değiştirmedi${lurePattern ? '.' : ': daha zor soruları çözebildiği için bu sorulardaki sonuç dikkatin dağılmasından ya da acele etmekten kaynaklanmış olabilir.'}`,
      );
    }
    if (!next) {
      text += v(' Bu en zor düzeydi.', ' Bu, testin en zor düzeyiydi.');
    } else {
      text += v(
        ` ${next.level}. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
        ` ${next.level}. düzeyde soruların çoğunda zorlandı; bu düzeydeki sorularda ${lower(next.plain)} gerekiyordu.`,
      );
    }
    duzey = {
      ...card('kb_duzey'),
      headline: `${r.reached}. düzey`,
      detail: `${r.levels.length} düzeyden · ölçüt: o düzeydeki ve o düzeye kadarki soruların en az %${pass}’ı doğru`,
      text,
    };
  }

  /* Soru türleri */
  const typeLine = r.types.map((x) => `${VOCABULARY_TYPES[x.type].name} ${x.correct}/${x.n}`).join(' · ');
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const rough = ' Her soru türü altı soruya dayanır ve her türde kolaydan zora sorular vardır; bu karşılaştırma kaba bir göstergedir.';
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('kb_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için soru türleri karşılaştırılmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu tür sorularda ${VOCABULARY_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${vocabularyTypeList([x])} sorularında ${VOCABULARY_TYPES[x].plain} gerekir.`)).join(' ');
    const head =
      good.length === r.types.length
        ? `${r.types.length} soru türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.types.length} soru türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.types.length} soru türünün ${good.length} tanesinde soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.types.length} soru türünün her birinde soruların çoğunu doğru buldun: kelimelerin eş ve zıt anlamlılarını, cümlede kazandıkları anlamları ve deyimleri büyük ölçüde biliyorsun.`,
        `Çocuğunuz ${r.types.length} soru türünün her birinde soruların çoğunu doğru buldu: kelimelerin eş ve zıt anlamlılarını, cümlede kazandıkları anlamları ve deyimleri büyük ölçüde biliyor.`,
      );
    } else if (good.length === 0) {
      text = v(`Hiçbir soru türünde soruların çoğunu doğru bulamadın. ${needs}`, `Çocuğunuz hiçbir soru türünde soruların çoğunu doğru bulamadı. ${needs}`);
    } else {
      text = v(
        `${vocabularyTypeList(good)} sorularının çoğunu doğru buldun; ${vocabularyTypeList(hard)} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${vocabularyTypeList(good)} sorularının çoğunu doğru buldu; ${vocabularyTypeList(hard)} sorularında zorlandı. ${needs}`,
      );
    }
    tur = { ...card('kb_tur'), headline: head, detail: typeLine, text: capTr(text) + rough };
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
    calisma = { ...card('kb_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    const timesLine = r.rtEasy !== null && r.rtHard !== null ? `1–2. düzeyde tipik ${seconds(r.rtEasy)} · 4–5. düzeyde ${seconds(r.rtHard)}` : undefined;
    let pace = '';
    if (!doubt && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 4);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Seyrek kullanılan bir kelimede cümleye ve seçeneklerin hepsine dikkatle bakmak zaman alır ve iyi bir çalışma biçimidir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Seyrek kullanılan bir kelimede cümleye ve seçeneklerin hepsine dikkatle bakmak zaman alır ve iyi bir çalışma biçimidir.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Bilmediğin bir kelimede cümleyi ve seçeneklerin hepsini dikkatle okumak işine yarayabilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; bilmediği bir kelimede cümleyi ve seçeneklerin hepsini dikkatle okumak yardımcı olabilir.',
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
    calisma = {
      ...card('kb_calisma'),
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
          label: VOCABULARY_TYPES[x.type].name,
          value: Math.round((x.correct / x.n) * 100),
          min: 0,
          max: 100,
          color: VOCABULARY_TYPES[x.type].color,
          valueLabel: `${x.correct}/${x.n}`,
          band: '',
        })),
      };
  return { blocks: [dogru, duzey, tur, calisma], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Kural değiştirme ---------- */

/** Kural değiştirmede iki tipik süre arasındaki farkın "belirgin" sayılması için en az bu kadar olması gerekir (ms). */
const RULE_COST_MIN_MS = 50;

/** Kural değiştirmenin dört sonuç kartı, üç koşulun tipik süreleri ve öne çıkan sayılar. */
function ruleSwitchBlocks(r: RuleSwitchResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = ruleSwitchChance(r);
  const timeouts = ruleSwitchTimeouts(r);
  const fast = ruleSwitchFast(r);
  const oneSide = ruleSwitchOneSide(r);

  /* Doğruluk */
  let accText: string;
  if (chance) {
    accText = v(
      'Doğru cevapların, iki düğmeden birine rastgele basan birinin de yapabileceği kadar az. Kuralları tam anlamamış, şekillere bakmadan basmış ya da görevi yarıda bırakmış olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verir.',
      'Çocuğunuzun doğru cevapları, iki düğmeden birine rastgele basan birinin de yapabileceği kadar az. Kurallar tam anlaşılmamış, şekillere bakılmadan basılmış ya da görev yarıda bırakılmış olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verir.',
    );
  } else {
    accText =
      r.accuracy >= 0.95
        ? v('Şekillere, işaretin söylediği kurala göre neredeyse her seferinde doğru cevap verdin.', 'Çocuğunuz şekillere, işaretin söylediği kurala göre neredeyse her seferinde doğru cevap verdi.')
        : r.accuracy >= 0.85
          ? v('Çoğu denemede kurala göre doğru düğmeye bastın; bazı denemelerde yanıldın.', 'Çocuğunuz çoğu denemede kurala göre doğru düğmeye bastı; bazı denemelerde yanıldı.')
          : v('Denemelerin bir kısmında kurala göre doğru düğmeyi bulmakta zorlandın.', 'Çocuğunuz denemelerin bir kısmında kurala göre doğru düğmeyi bulmakta zorlandı.');
    // Karışık bölümdeki hataların türü: iki kuralın farklı düğmeyi istediği şekillerde yanlış düğme, öteki kurala göre
    // basmak demektir. Rastgele hatalar iki tür şekle eşit dağılır; hataların en az üçte ikisi (en az 4) bu şekillerdeyse söylenir.
    if (r.ruleErrors >= 4 && r.ruleErrors >= 2 * r.otherErrors) {
      accText += v(
        ' İki kuralın karıştığı bölümdeki hatalarının çoğu, iki kuralın farklı düğmeyi istediği şekillerde oldu: bu hatalarda öteki kurala göre bastın. Bu, kuralı akılda tutmanın zorlaştığı anlarda olur; basmadan önce şeklin üstündeki işarete bir an bakmak işine yarar.',
        ' İki kuralın karıştığı bölümdeki hataların çoğu, iki kuralın farklı düğmeyi istediği şekillerde oldu: bu hatalarda öteki kurala göre basıldı. Bu, kuralı akılda tutmanın zorlaştığı anlarda olur; basmadan önce şeklin üstündeki işarete bir an bakmak ona yardım edebilir.',
      );
    }
    if (timeouts || fast || oneSide) {
      accText += v(
        ' Bazı denemelerde şekle bakmadan ya da süre içinde basmamış olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Bazı denemelerde şekle bakılmadan ya da süre içinde basılmamış olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.',
      );
    }
  }
  const dogruluk: CognitiveBlock = {
    ...card('kd_dogruluk'),
    headline: `${pct(r.accuracy)} doğru`,
    detail: `Tek kural ${pct(r.pure.accuracy)} · kural sürerken ${pct(r.repeat.accuracy)} · kural değişince ${pct(r.switch.accuracy)}`,
    text: accText,
  };

  /* Kural değiştirme */
  let degisim: CognitiveBlock;
  let switchFig: { value: string; note?: string } = { value: 'Yorumlanmadı' };
  if (chance) {
    degisim = { ...card('kd_degisim'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için kural değiştirmenin etkisi yorumlanmadı.' };
  } else if (r.repeat.medianRt === null || r.switch.medianRt === null) {
    degisim = {
      ...card('kd_degisim'),
      headline: 'Hesaplanamadı',
      text: 'Kuralın sürdüğü ya da değiştiği denemelerden birinde yeterince doğru cevap olmadığı için karşılaştırma yapılamadı.',
    };
    switchFig = { value: 'Hesaplanamadı' };
  } else {
    const a = to10(r.repeat.medianRt);
    const b = to10(r.switch.medianRt);
    const diff = b - a;
    switchFig =
      diff >= RULE_COST_MIN_MS
        ? { value: `${sn(diff)} sn`, note: 'kural değişince daha yavaş' }
        : diff <= -RULE_COST_MIN_MS
          ? { value: `${sn(-diff)} sn`, note: 'kural değişince daha hızlı' }
          : { value: 'Belirgin fark yok' };
    const detail = `Kural sürerken ${sn(a)} sn · kural değişince ${sn(b)} sn`;
    // Kural değişince doğruluk da en az 10 puan düşerse söylenir.
    const accDrop =
      r.repeat.accuracy - r.switch.accuracy >= 0.1
        ? v(
            ` Kural değiştiğinde hataların da arttı: doğru cevapların ${pct(r.repeat.accuracy)} yerine ${pct(r.switch.accuracy)} oldu.`,
            ` Kural değiştiğinde hatalar da arttı: doğru cevaplar ${pct(r.repeat.accuracy)} yerine ${pct(r.switch.accuracy)} oldu.`,
          )
        : '';
    if (diff >= RULE_COST_MIN_MS) {
      degisim = {
        ...card('kd_degisim'),
        headline: `Kural değişince ${sn(diff)} sn daha yavaş`,
        detail,
        text:
          v(
            'Kural değiştiğinde cevapların, aynı kural sürerkenkinden biraz daha yavaştı. Bu herkeste görülür: yeni kurala geçmek için zihnin kendini yeniden ayarlaması gerekir; çok uzun alıştırmalardan sonra bile bu fark tamamen kaybolmaz.',
            'Kural değiştiğinde çocuğunuzun cevapları, aynı kural sürerkenkinden biraz daha yavaştı. Bu, kural değiştirme çalışmalarının bilinen bir bulgusudur: kural değiştikten sonra verilen cevaplar daha yavaştır ve daha çok hata içerir; çok uzun alıştırmalar bile bu farkı ortadan kaldırmaz (Stoet ve Snyder, 2007).',
          ) +
          accDrop +
          v(' Bu fark bir seferden ötekine değişebilir; küçük farklara takılma.', ' Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.'),
      };
    } else if (diff <= -RULE_COST_MIN_MS) {
      degisim = {
        ...card('kd_degisim'),
        headline: 'Kural değişince daha hızlı',
        detail,
        text:
          v(
            'Kural değiştiğinde cevapların, aynı kural sürerkenkinden biraz daha hızlıydı. Bu sık görülmez; çoğunlukla ölçümün doğal payından kaynaklanır ve bir seferden ötekine değişebilir.',
            'Kural değiştiğinde çocuğunuzun cevapları, aynı kural sürerkenkinden biraz daha hızlıydı. Bu sık görülmez; çoğunlukla ölçümün doğal payından kaynaklanır. Tek bir uygulamada bu farkın kesinliği düşüktür.',
          ) + accDrop,
      };
    } else {
      degisim = {
        ...card('kd_degisim'),
        headline: 'Belirgin bir fark görülmedi',
        detail,
        text:
          v(
            'Kural değiştiğinde cevapların, aynı kural sürerkenkinden belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlama, bu uygulamada sende belirgin olarak ortaya çıkmadı. Bu fark bir seferden ötekine değişebilir.',
            'Kural değiştiğinde çocuğunuzun cevapları, aynı kural sürerkenkinden belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlamanın belirgin olmaması ölçümün doğal payından da kaynaklanabilir. Tek bir uygulamada bu farkın kesinliği düşüktür.',
          ) + accDrop,
      };
    }
  }

  /* İki kuralı akılda tutma */
  let karisik: CognitiveBlock;
  if (chance) {
    karisik = { ...card('kd_karisik'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için iki kuralın karıştığı bölüm yorumlanmadı.' };
  } else if (r.pure.medianRt === null || r.repeat.medianRt === null) {
    karisik = {
      ...card('kd_karisik'),
      headline: 'Hesaplanamadı',
      text: 'Tek kurallı bölümlerde ya da iki kuralın karıştığı bölümde yeterince doğru cevap olmadığı için karşılaştırma yapılamadı.',
    };
  } else {
    const a = to10(r.pure.medianRt);
    const b = to10(r.repeat.medianRt);
    const diff = b - a;
    const detail = `Tek kurallı bölümlerde ${sn(a)} sn · iki kural karışınca (kural sürerken) ${sn(b)} sn`;
    if (diff >= RULE_COST_MIN_MS) {
      karisik = {
        ...card('kd_karisik'),
        headline: `İki kural karışınca ${sn(diff)} sn daha yavaş`,
        detail,
        text: v(
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerde bile cevapların tek kurallı bölümlerdekinden daha yavaştı. Bunun nedeni, iki kuralı birden akılda tutup her denemede işarete bakmanın gerektirdiği çabadır; çoğu kişide görülür. Bu fark bir seferden ötekine değişebilir.',
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerde bile çocuğunuzun cevapları tek kurallı bölümlerdekinden daha yavaştı. Bu fark, iki kuralı birden akılda tutmanın gerektirdiği genel çabayı gösterir ve çoğu kişide görülür. Tek bir uygulamada bu farkın kesinliği düşüktür.',
        ),
      };
    } else if (diff <= -RULE_COST_MIN_MS) {
      karisik = {
        ...card('kd_karisik'),
        headline: 'İki kural karışınca daha hızlı',
        detail,
        text: v(
          'İki kuralın karıştığı bölümde cevapların, tek kurallı bölümlerdekinden daha hızlıydı. Karışık bölümler görevin sonunda geldiği için bu, göreve alışıp ısınmaktan kaynaklanmış olabilir.',
          'İki kuralın karıştığı bölümde çocuğunuzun cevapları, tek kurallı bölümlerdekinden daha hızlıydı. Karışık bölümler görevin sonunda geldiği için bu, göreve alışmaktan kaynaklanmış olabilir. Tek bir uygulamada bu farkın kesinliği düşüktür.',
        ),
      };
    } else {
      karisik = {
        ...card('kd_karisik'),
        headline: 'Belirgin bir fark görülmedi',
        detail,
        text: v(
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerdeki cevapların tek kurallı bölümlerdekinden belirgin biçimde yavaş değildi. Bu fark bir seferden ötekine değişebilir.',
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerde çocuğunuzun cevapları tek kurallı bölümlerdekinden belirgin biçimde yavaş değildi. Tek bir uygulamada bu farkın kesinliği düşüktür.',
        ),
      };
    }
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (timeouts) {
    issues.push(
      v(
        `${r.n} denemenin ${r.timeouts} tanesinde süre içinde basmadın; görevi yarıda bırakmış ya da dikkatin dağılmış olabilir.`,
        `Çocuğunuz ${r.n} denemenin ${r.timeouts} tanesinde süre içinde basmadı; görev yarıda bırakılmış ya da dikkat dağılmış olabilir.`,
      ),
    );
  }
  if (fast) {
    issues.push(
      v(
        `${r.tooFast} denemede şekil göründükten sonraki 0,2 saniye içinde bastın; bu denemelerde şekle bakmadan basmış olabilirsin.`,
        `Çocuğunuz ${r.tooFast} denemede şekil göründükten sonraki 0,2 saniye içinde bastı; bu denemelerde şekle bakılmadan basılmış olabilir.`,
      ),
    );
  }
  if (oneSide) {
    issues.push(
      v(
        'Cevaplarının çoğunda aynı düğmeye bastın; şekillere bakmadan hep aynı düğmeye basmış olabilirsin.',
        'Çocuğunuz cevaplarının çoğunda aynı düğmeye bastı; şekillere bakılmadan hep aynı düğmeye basılmış olabilir.',
      ),
    );
  }
  const noLimit = v(
    ' Hız tek başına iyi ya da kötü değildir; bu görevde önemli olan, kurala göre doğru düğmeye basabilmektir.',
    ' Hız tek başına iyi ya da kötü değildir; bu görevde önemli olan, kurala göre doğru düğmeye basabilmektir.',
  );
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? { ...card('kd_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Yeterince doğru cevap olmadığı için cevap süreleri yorumlanmadı.'].join(' ') }
      : {
          ...card('kd_calisma'),
          headline: `Tipik cevap süresi ${sn(to10(r.medianRt))} sn`,
          text:
            [
              v(
                `Doğru cevaplarında şekli görüp düğmeye basman tipik olarak ${sn(to10(r.medianRt))} saniye sürdü.`,
                `Çocuğunuzun doğru cevaplarında şekli görüp düğmeye basması tipik olarak ${sn(to10(r.medianRt))} saniye sürdü.`,
              ),
              ...issues,
            ].join(' ') + noLimit,
        };

  /* Grafik ve öne çıkan sayılar */
  let chart: CognitiveReport['chart'];
  if (!chance && r.pure.medianRt !== null && r.repeat.medianRt !== null && r.switch.medianRt !== null) {
    const rows = [
      { label: 'Tek kurallı bölümler', ms: to10(r.pure.medianRt) },
      { label: 'İki kural karışınca: kural sürerken', ms: to10(r.repeat.medianRt) },
      { label: 'İki kural karışınca: kural değişince', ms: to10(r.switch.medianRt) },
    ];
    const max = roundUp(Math.max(...rows.map((x) => x.ms)), 500);
    chart = {
      title: 'Tipik cevap süresi',
      note: v(
        'Çubuklar doğru cevaplarındaki tipik cevap süresini gösterir; kısa çubuk daha hızlı demek.',
        'Çubuklar doğru cevaplardaki tipik (ortanca) cevap süresini gösterir; kısa çubuk daha hızlı demektir.',
      ),
      rows: rows.map((x) => ({ label: x.label, value: x.ms, max, valueLabel: `${sn(x.ms)} sn` })),
    };
  }
  const figures: CognitiveReport['figures'] = [
    { label: 'Doğru', value: pct(r.accuracy) },
    { label: 'Kural değiştirmenin etkisi', ...switchFig },
    ...(r.medianRt !== null ? [{ label: 'Tipik cevap süresi', value: `${sn(to10(r.medianRt))} sn` }] : []),
  ];
  return { blocks: [dogruluk, degisim, karisik, calisma], ...(chart ? { chart } : {}), figures };
}

/* ---------- Kelime listesi hatırlama ---------- */

/** Öğrenme denemelerinde bu kadar ya da daha çok artış "belirgin" sayılır (kelime). */
const WL_GAIN_CLEAR = 3;
/** İlk denemede bu kadar ya da daha çok kelime hatırlanınca artması için yer kalmamış sayılır. */
const WL_CEILING = 13;
/** Araya giren listeden sonraki değişim, son öğrenme denemesinde en az bu kadar kelime varsa yorumlanır. */
const WL_RETENTION_MIN = 4;
/** Listenin başı, ortası ve sonu arasındaki fark (her biri 15 fırsattan) en az bu kadarsa söylenir. */
const WL_POSITION_DIFF = 4;
/** Listenin kısımları, öğrenme denemelerinde en az bu kadar kelime hatırlandıysa karşılaştırılır. */
const WL_POSITION_MIN = 9;
/** Tanınan kelimeler kendiliğinden hatırlananlardan en az bu kadar çoksa söylenir. */
const WL_RECOGNITION_GAP = 4;

/** Araya giren listeden sonraki düşüş, en az bu kadar kelimeyse "belirgin" sayılabilir. */
const WL_DROP_CLEAR = 3;
/** Tanıma ile kendiliğinden hatırlama karşılaştırılırken ilk listede olmayan kelimelere "evet" oranı en çok bu kadar olmalı. */
const WL_RECOGNITION_FALSE_MAX = 0.2;

const WL_LURE_TEXT: Record<'b' | 'semantic' | 'sound' | 'new', (n: number) => string> = {
  b: (n) => `ikinci listeden ${n} kelime`,
  semantic: (n) => `anlamca yakın ${n} kelime`,
  sound: (n) => `sesi ve yazılışı benzer ${n} kelime`,
  new: (n) => `hiçbir listede olmayan ${n} kelime`,
};

/**
 * Listenin hangi kısmı daha çok hatırlandı: ortası (öteki ikisinden belirgin biçimde çok), sonu ya da başı (öteki uçtan
 * belirgin biçimde çok), iki ucu (benzer, ortadan belirgin biçimde çok) ya da hepsi benzer.
 */
export function wordListPosition(p: { begin: number; middle: number; end: number }): 'middle' | 'end' | 'begin' | 'ends' | 'even' {
  if (p.middle - Math.max(p.begin, p.end) >= WL_POSITION_DIFF) return 'middle';
  if (p.end - p.begin >= WL_POSITION_DIFF) return 'end';
  if (p.begin - p.end >= WL_POSITION_DIFF) return 'begin';
  if (p.middle <= Math.min(p.begin, p.end) - WL_POSITION_DIFF) return 'ends';
  return 'even';
}

/** Listenin kısımları (üç boyutlu grafikte). */
export const WORD_LIST_PARTS = [
  { key: 'begin', label: 'Listenin başı', color: '#2f5ce0' },
  { key: 'middle', label: 'Listenin ortası', color: '#0e9c8c' },
  { key: 'end', label: 'Listenin sonu', color: '#ee6a36' },
] as const;

/** Kelime listesi hatırlamanın dört sonuç kartı, hatırlanan kelime sayıları grafiği ve listenin kısımlarına göre profil. */
function wordListBlocks(r: WordListResult, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const adult = audience === 'adult';
  const v = (student: string, parent: string) => (you ? student : parent);
  const L = r.listLength;
  const none = wordListNoInput(r);
  const counts = r.trials.map((t) => t.correct);
  const [t1, t2, t3] = counts;
  const d = r.delayed.correct;
  const rec = r.recognition;
  const valid = wordListRecogValid(r);
  const fa = rec.falseYes.b + rec.falseYes.semantic + rec.falseYes.sound + rec.falseYes.new;
  const nLures = rec.n - rec.targets;

  /* Öğrenme */
  let ogrenme: CognitiveBlock;
  if (none) {
    ogrenme = {
      ...card('kl_ogrenme'),
      headline: 'Cevap verilmedi',
      text: v(
        'Hatırlama bölümlerinin hiçbirinde kelime yazmadın; bu yüzden sonuç yorumlanmadı. Yönerge anlaşılmamış ya da görev yarıda kalmış olabilir.',
        'Hatırlama bölümlerinin hiçbirinde kelime yazılmadı; bu yüzden sonuç yorumlanmadı. Yönerge anlaşılmamış ya da görev yarıda kalmış olabilir.',
      ),
    };
  } else {
    const parts: string[] = [
      v(
        `Aynı liste üç kez gösterildi. ${L} kelimeden ilk denemede ${t1}, ikincide ${t2}, üçüncüde ${t3} kelime hatırladın (toplam ${r.total}).`,
        `Aynı liste üç kez gösterildi. Çocuğunuz ${L} kelimeden ilk denemede ${t1}, ikincide ${t2}, üçüncüde ${t3} kelime hatırladı (toplam ${r.total}).`,
      ),
    ];
    if (r.gain >= WL_GAIN_CLEAR) {
      parts.push(
        v(
          'Liste tekrarlandıkça hatırladığın kelime sayısı belirgin biçimde arttı: tekrarlar kelimeleri öğrenmene yardım etti.',
          'Liste tekrarlandıkça hatırladığı kelime sayısı belirgin biçimde arttı: tekrarlar kelimeleri öğrenmesine yardım etti.',
        ),
      );
    } else if (r.gain > 0) {
      parts.push(v('Liste tekrarlandıkça hatırladığın kelime sayısı biraz arttı.', 'Liste tekrarlandıkça hatırladığı kelime sayısı biraz arttı.'));
    } else if (t1 >= WL_CEILING && t3 >= WL_CEILING) {
      parts.push(
        v(
          'İlk denemeden başlayarak kelimelerin hepsini ya da neredeyse hepsini hatırladın; sayının artması için fazla yer yoktu.',
          'İlk denemeden başlayarak kelimelerin hepsini ya da neredeyse hepsini hatırladı; sayının artması için fazla yer yoktu.',
        ),
      );
    } else {
      const verb = r.gain < 0 ? 'azaldı' : 'artmadı';
      parts.push(
        v(
          `Liste tekrarlandığı hâlde hatırladığın kelime sayısı ${verb}. Bunun nedeni yorgunluk, dikkat dağınıklığı ya da her denemede bütün kelimeleri yeniden yazmanın unutulması olabilir.`,
          `Liste tekrarlandığı hâlde hatırladığı kelime sayısı ${verb}. Bunun nedeni yorgunluk, dikkat dağınıklığı ya da her denemede bütün kelimeleri yeniden yazmanın unutulması olabilir.`,
        ),
      );
    }
    parts.push(
      `Bir kerede akılda tutulabilecek kelime sayısı sınırlıdır ve ${L} kelime bu sınırın üzerindedir. Bu yüzden çoğu kişi ilk denemede kelimelerin yalnızca bir kısmını hatırlar; sonraki denemelerde hatırlananlara yenileri eklenir (Oliveira ve Charchat-Fichman, 2008).`,
      v(
        'Bu beceri; bir alışveriş listesini, yeni tanıştığın kişilerin adlarını ya da yeni öğrendiğin kelimeleri akılda tutmak gibi işlerde kullanılır.',
        'Bu beceri; bir alışveriş listesini, yeni tanıştığı kişilerin adlarını ya da yeni öğrendiği kelimeleri akılda tutmak gibi işlerde kullanılır.',
      ),
    );
    if (wordListManyExtra(r)) parts.push('Hiçbir listede olmayan çok sayıda kelime yazıldığı için bu sonuç dikkatle yorumlanmalıdır.');
    ogrenme = { ...card('kl_ogrenme'), headline: `${counts.slice(0, -1).join(', ')} ve ${counts[counts.length - 1]} kelime`, text: parts.join(' ') };
  }

  /* Öğrenileni koruma */
  let koruma: CognitiveBlock;
  const skipped = wordListDelayedSkipped(r);
  if (none) {
    koruma = { ...card('kl_koruma'), headline: 'Cevap verilmedi', text: v('Kelime yazmadığın için bu bölüm yorumlanmadı.', 'Kelime yazılmadığı için bu bölüm yorumlanmadı.') };
  } else {
    const bPart =
      r.b.correct > 0
        ? v(`bu listeden ${r.b.correct} kelime hatırladın`, `çocuğunuz bu listeden ${r.b.correct} kelime hatırladı`)
        : r.b.entries > 0
          ? v('bu listeden hiç kelime hatırlamadın', 'çocuğunuz bu listeden hiç kelime hatırlamadı')
          : v('bu listeden hiç kelime yazmadın', 'çocuğunuz bu listeden hiç kelime yazmadı');
    const dPart = skipped
      ? v(
          'Ardından ilk listeyi yeniden görmeden yazman istendiğinde hiç kelime yazmadın; bu bölüm atlanmış olabilir.',
          'Ardından ilk listeyi yeniden görmeden yazması istendiğinde hiç kelime yazmadı; bu bölüm atlanmış olabilir.',
        )
      : d > 0
        ? v(
            `Ardından ilk listeyi yeniden görmeden yazdın ve ${d} kelime hatırladın (üçüncü denemede ${t3} kelime hatırlamıştın).`,
            `Ardından ilk listeyi yeniden görmeden yazdı ve ${d} kelime hatırladı (üçüncü denemede ${t3} kelime hatırlamıştı).`,
          )
        : v(
            `Ardından ilk listeyi yeniden görmeden yazdın, ama hiç kelime hatırlamadın (üçüncü denemede ${t3} kelime hatırlamıştın).`,
            `Ardından ilk listeyi yeniden görmeden yazdı, ama hiç kelime hatırlamadı (üçüncü denemede ${t3} kelime hatırlamıştı).`,
          );
    const parts: string[] = [`Sonra yeni bir liste bir kez gösterildi; ${bPart}. ${dPart}`];
    let headline = `Araya giren listeden sonra ${d} kelime`;
    if (skipped) {
      headline = 'Yorumlanmadı';
      parts.push('Bu yüzden karşılaştırma yorumlanmadı.');
    } else if (t3 < WL_RETENTION_MIN) {
      parts.push('Üçüncü denemede çok az kelime hatırlandığı için bu karşılaştırma yorumlanmadı.');
    } else if (d >= t3) {
      headline = d > t3 ? `${t3} kelimeden ${d} kelimeye çıktı` : 'Hatırlananlar korundu';
      parts.push(
        v(
          d > t3
            ? 'Araya yeni bir liste girmesine karşın üçüncü denemedekinden de çok kelime hatırladın: öğrendiğin kelimeler aklında kalmış.'
            : 'Araya giren yeni liste, ilk listeden hatırladıklarını azaltmadı: öğrendiğin kelimeler aklında kalmış.',
          d > t3
            ? 'Araya yeni bir liste girmesine karşın üçüncü denemedekinden de çok kelime hatırladı: öğrendiği kelimeler aklında kalmış.'
            : 'Araya giren yeni liste, ilk listeden hatırladıklarını azaltmadı: öğrendiği kelimeler aklında kalmış.',
        ),
      );
    } else {
      const ratio = r.retention ?? 0;
      if (ratio >= 0.9) {
        headline = 'Hatırlananların hemen hepsi korundu';
        parts.push(
          v(
            'Araya giren yeni liste, ilk listeden hatırladıklarını neredeyse hiç azaltmadı: öğrendiğin kelimeler aklında kalmış.',
            'Araya giren yeni liste, ilk listeden hatırladıklarını neredeyse hiç azaltmadı: öğrendiği kelimeler aklında kalmış.',
          ),
        );
      } else if (ratio >= 0.7 || t3 - d < WL_DROP_CLEAR) {
        headline = ratio >= 0.7 ? 'Hatırlananların çoğu korundu' : 'Hatırlananlar biraz azaldı';
        parts.push(
          v(
            'Araya giren yeni listeden sonra ilk listeden hatırladıkların biraz azaldı. Yeni bir bilgi, daha önce öğrenilenleri hatırlamayı biraz zorlaştırabilir; bu herkeste görülür.',
            'Araya giren yeni listeden sonra ilk listeden hatırladıkları biraz azaldı. Yeni bir bilgi, daha önce öğrenilenleri hatırlamayı biraz zorlaştırabilir; bu herkeste görülür.',
          ),
        );
      } else {
        headline = 'Hatırlananlar belirgin biçimde azaldı';
        parts.push(
          v(
            'Araya giren yeni listeden sonra ilk listeden hatırladıkların belirgin biçimde azaldı: yeni liste, ilk listedeki kelimeleri hatırlamayı zorlaştırmış görünüyor.',
            'Araya giren yeni listeden sonra ilk listeden hatırladıkları belirgin biçimde azaldı: yeni liste, ilk listedeki kelimeleri hatırlamayı zorlaştırmış görünüyor.',
          ),
        );
        if (valid) parts.push('Kelimelerin akılda kalıp kalmadığını tanıma bölümünün sonucu ayrıca gösterir.');
      }
    }
    if (r.delayed.otherList > 0) {
      parts.push(
        v(
          `İlk listeyi yazarken ikinci listeden ${r.delayed.otherList} kelime de yazdın: iki listeyi biraz karıştırdın.`,
          `İlk listeyi yazarken ikinci listeden ${r.delayed.otherList} kelime de yazdı: iki listeyi biraz karıştırdı.`,
        ),
      );
    }
    if (r.b.otherList > 0) {
      parts.push(
        v(
          `İkinci listeyi yazarken ilk listeden ${r.b.otherList} kelime de yazdın: daha önce öğrendiğin liste yenisine karıştı.`,
          `İkinci listeyi yazarken ilk listeden ${r.b.otherList} kelime de yazdı: daha önce öğrendiği liste yenisine karıştı.`,
        ),
      );
    }
    parts.push('Bu bölüm, yeni bir bilginin daha önce öğrenilenleri hatırlamayı nasıl etkilediğini gösterir (Oliveira ve Charchat-Fichman, 2008).');
    koruma = { ...card('kl_koruma'), headline, text: parts.join(' ') };
  }

  /* Tanıma */
  const said = (yes: boolean) => (yes ? v('dedin', 'dedi') : v('demedin', 'demedi'));
  const T = rec.targets;
  const recSentence =
    rec.hits === 0 && fa === 0
      ? `İlk listedeki ${T} kelimenin de, ilk listede olmayan ${nLures} kelimenin de hiçbirine “evet” ${said(false)}.`
      : `İlk listedeki ${rec.hits === T ? `${T} kelimenin hepsine “evet” ${said(true)}` : rec.hits === 0 ? `${T} kelimenin hiçbirine “evet” ${said(false)}` : `${T} kelimeden ${rec.hits} tanesine “evet” ${said(true)}`}; ilk listede olmayan ${
          fa === 0 ? `${nLures} kelimenin hiçbirine “evet” ${said(false)}` : `${nLures} kelimeden ${fa} tanesine ${rec.hits === 0 ? 'ise' : 'de'} “evet” ${said(true)}`
        }.`;
  const base = `Son bölümde ${rec.n} kelime tek tek gösterildi. ${you ? recSentence : `Çocuğunuz ${recSentence.charAt(0).toLocaleLowerCase('tr-TR')}${recSentence.slice(1)}`}`;
  let tanima: CognitiveBlock;
  if (!valid) {
    const why = wordListRecogOneSided(r)
      ? v('Bu bölümde hemen her kelimeye aynı cevabı verdin; bu yüzden tanıma sonucu yorumlanmadı.', 'Bu bölümde hemen her kelimeye aynı cevap verildi; bu yüzden tanıma sonucu yorumlanmadı.')
      : wordListRecogFast(r)
        ? v(
            `${rec.tooFast} kelimede 0,3 saniyeden kısa sürede cevap verdin; kelimeye bakmadan cevap vermiş olabilirsin. Bu yüzden tanıma sonucu yorumlanmadı.`,
            `${rec.tooFast} kelimede 0,3 saniyeden kısa sürede cevap verildi; kelimeye bakılmadan cevap verilmiş olabilir. Bu yüzden tanıma sonucu yorumlanmadı.`,
          )
        : v(
            'İlk listedeki ve ilk listede olmayan kelimelere benzer oranda “evet” dedin; tahminle cevap vermiş olabilirsin. Bu yüzden tanıma sonucu yorumlanmadı.',
            'İlk listedeki ve ilk listede olmayan kelimelere benzer oranda “evet” dendi; tahminle cevap verilmiş olabilir. Bu yüzden tanıma sonucu yorumlanmadı.',
          );
    tanima = { ...card('kl_tanima'), headline: 'Yorumlanmadı', text: `${base} ${why}` };
  } else {
    const parts: string[] = [base];
    if (fa > 0) {
      const kinds = (['b', 'semantic', 'sound', 'new'] as const).filter((k) => rec.falseYes[k] > 0);
      const list = kinds.map((k) => WL_LURE_TEXT[k](rec.falseYes[k])).join(', ');
      parts.push(v(`Yanlışlıkla “evet” dediğin kelimeler: ${list}.`, `Yanlışlıkla “evet” dediği kelimeler: ${list}.`));
      const top = kinds.find((k) => rec.falseYes[k] >= 2 && rec.falseYes[k] >= 0.6 * fa);
      const example = (k: 'semantic' | 'sound') => {
        const x = rec.falseYesPairs.find((q) => q.kind === k);
        return x ? ` (ör. “${x.word}”; listede “${x.of}” vardı)` : '';
      };
      if (top === 'semantic') {
        parts.push(
          v(
            `Yanlışlıkla “evet” dediğin kelimelerin çoğu, ilk listedeki bir kelimeyle anlamca yakın kelimelerdi${example('semantic')}. Kelimenin anlamı aklında kalmış, ama kelimenin kendisi karışmış olabilir.`,
            `Yanlışlıkla “evet” dediği kelimelerin çoğu, ilk listedeki bir kelimeyle anlamca yakın kelimelerdi${example('semantic')}. Kelimenin anlamı aklında kalmış, ama kelimenin kendisi karışmış olabilir.`,
          ),
        );
      } else if (top === 'sound') {
        parts.push(
          v(
            `Yanlışlıkla “evet” dediğin kelimelerin çoğu, sesi ve yazılışı ilk listedeki bir kelimeye benzeyen kelimelerdi${example('sound')}: kelimenin yalnızca sesi ya da görünüşü aklında kalmış olabilir.`,
            `Yanlışlıkla “evet” dediği kelimelerin çoğu, sesi ve yazılışı ilk listedeki bir kelimeye benzeyen kelimelerdi${example('sound')}: kelimenin yalnızca sesi ya da görünüşü aklında kalmış olabilir.`,
          ),
        );
      } else if (top === 'b') {
        parts.push(
          v(
            'Yanlışlıkla “evet” dediğin kelimelerin çoğu ikinci listedeki kelimelerdi: kelimeyi hatırladın, ama hangi listede gördüğünü karıştırdın.',
            'Yanlışlıkla “evet” dediği kelimelerin çoğu ikinci listedeki kelimelerdi: kelimeyi hatırladı, ama hangi listede gördüğünü karıştırdı.',
          ),
        );
      } else if (top === 'new') {
        parts.push(
          v(
            'Yanlışlıkla “evet” dediğin kelimelerin çoğu hiçbir listede olmayan ilgisiz kelimelerdi; bu bölümde dikkatin dağılmış ya da tahminle cevap vermiş olabilirsin.',
            'Yanlışlıkla “evet” dediği kelimelerin çoğu hiçbir listede olmayan ilgisiz kelimelerdi; bu bölümde dikkati dağılmış ya da tahminle cevap verilmiş olabilir.',
          ),
        );
      }
    }
    if (!none && !skipped && rec.hits - d >= WL_RECOGNITION_GAP && rec.falseRate <= WL_RECOGNITION_FALSE_MAX) {
      parts.push(
        v(
          `Kendiliğinden yazarken ilk listeden ${d} kelime hatırladın, görünce ise ${rec.hits} kelimeyi tanıdın: kendiliğinden hatırlayamadığın kelimelerin bir kısmı da aklında kalmış. Görünce tanımak, kendiliğinden hatırlamaktan genellikle daha kolaydır.`,
          `Kendiliğinden yazarken ilk listeden ${d} kelime hatırladı, görünce ise ${rec.hits} kelimeyi tanıdı: kendiliğinden hatırlayamadığı kelimelerin bir kısmı da aklında kalmış. Görünce tanımak, kendiliğinden hatırlamaktan genellikle daha kolaydır.`,
        ),
      );
    } else if (rec.hits >= T - 1 && fa <= 1) {
      parts.push(v('İlk listedeki kelimeleri, ilk listede olmayanlardan çok iyi ayırt ettin.', 'İlk listedeki kelimeleri, ilk listede olmayanlardan çok iyi ayırt etti.'));
    }
    tanima = { ...card('kl_tanima'), headline: `${rec.hits}/${T} tanındı, ${fa} yanlış “evet”`, text: parts.join(' ') };
  }

  /* Çalışma biçimi */
  const p = r.positions;
  const compared = !none && r.total >= WL_POSITION_MIN;
  const issues: string[] = [];
  if (!none) {
    issues.push(
      r.extraLearning === 0
        ? v('Öğrenme denemelerinde hiçbir listede olmayan bir kelime yazmadın.', 'Öğrenme denemelerinde hiçbir listede olmayan bir kelime yazmadı.')
        : v(
            `Öğrenme denemelerinde hiçbir listede olmayan ${r.extraLearning} kelime yazdın; akla gelen başka bir kelimeyi yazmak herkeste ara sıra görülür.`,
            `Öğrenme denemelerinde hiçbir listede olmayan ${r.extraLearning} kelime yazdı; akla gelen başka bir kelimeyi yazmak herkeste ara sıra görülür.`,
          ),
    );
    if (r.emptyRecalls >= 2) issues.push(`${r.emptyRecalls} hatırlama bölümünde hiç kelime yazılmadı; o bölümler yarıda bırakılmış olabilir.`);
  }
  if (r.restarts > 0) {
    issues.push(
      `Başka bir sekmeye ya da uygulamaya geçildiği için liste ${r.restarts} kez baştan gösterildi; kelimeler bir kez daha görüldüğü için hatırlanan kelime sayısı biraz yüksek çıkmış olabilir.`,
    );
  }
  let calisma: CognitiveBlock;
  if (none) {
    calisma = { ...card('kl_calisma'), headline: 'Cevap verilmedi', text: [v('Kelime yazmadığın için bu bölüm yorumlanmadı.', 'Kelime yazılmadığı için bu bölüm yorumlanmadı.'), ...issues].join(' ') };
  } else {
    const third = p.of / r.trials.length;
    const parts: string[] = [
      v(
        `Üç denemede listenin ilk ${third} kelimesini toplam ${p.begin} kez, ortadaki ${third} kelimeyi ${p.middle} kez, son ${third} kelimeyi ${p.end} kez hatırladın (her kısımda en çok ${p.of}).`,
        `Üç denemede listenin ilk ${third} kelimesi toplam ${p.begin} kez, ortadaki ${third} kelime ${p.middle} kez, son ${third} kelime ${p.end} kez hatırlandı (her kısımda en çok ${p.of}).`,
      ),
    ];
    let headline: string;
    if (!compared) {
      headline = 'Kısımlar karşılaştırılmadı';
      parts.push('Öğrenme denemelerinde az kelime hatırlandığı için listenin kısımları karşılaştırılmadı.');
    } else {
      const grows = adult ? '' : '; bu tür tekrar çocukluk boyunca gelişir';
      const pos = wordListPosition(p);
      if (pos === 'middle') {
        headline = 'Listenin ortası daha çok hatırlandı';
        parts.push(
          v(
            'Listenin ortasındaki kelimeleri, başındakilerden ve sonundakilerden daha çok hatırladın.',
            'Listenin ortasındaki kelimeleri, başındakilerden ve sonundakilerden daha çok hatırladı.',
          ),
        );
      } else if (pos === 'end') {
        headline = 'Listenin sonu, başından daha çok hatırlandı';
        parts.push(
          v(
            `Listenin sonundaki kelimeleri, başındakilerden daha çok hatırladın. Son kelimeler, liste biter bitmez henüz akıldayken kolayca yazılır. Listenin başındaki kelimeleri hatırlamak ise kelimeler gösterilirken öncekileri de içinden tekrar etmekle ilgilidir${grows} (Lehmann, 2015).`,
            `Listenin sonundaki kelimeleri, başındakilerden daha çok hatırladı. Son kelimeler, liste biter bitmez henüz akıldayken kolayca yazılır. Listenin başındaki kelimeleri hatırlamak ise kelimeler gösterilirken öncekileri de içinden tekrar etmekle ilgilidir${grows} (Lehmann, 2015).`,
          ),
        );
      } else if (pos === 'begin') {
        headline = 'Listenin başı, sonundan daha çok hatırlandı';
        parts.push(
          v(
            'Listenin başındaki kelimeleri, sonundakilerden daha çok hatırladın; bu, kelimeler gösterilirken öncekileri de içinden tekrar etmiş olabileceğini düşündürür (Lehmann, 2015).',
            'Listenin başındaki kelimeleri, sonundakilerden daha çok hatırladı; bu, kelimeler gösterilirken öncekileri de içinden tekrar etmiş olabileceğini düşündürür (Lehmann, 2015).',
          ),
        );
      } else if (pos === 'ends') {
        headline = 'Başı ve sonu, ortasından daha çok hatırlandı';
        parts.push(v('Listenin başından ve sonundan benzer sayıda kelime hatırladın.', 'Listenin başından ve sonundan benzer sayıda kelime hatırladı.'));
      } else {
        headline = 'Listenin her kısmından benzer sayıda kelime';
        parts.push(v('Listenin başından, ortasından ve sonundan benzer sayıda kelime hatırladın.', 'Listenin başından, ortasından ve sonundan benzer sayıda kelime hatırladı.'));
      }
      if (p.middle <= Math.min(p.begin, p.end) - WL_POSITION_DIFF) {
        parts.push('Ortadaki kelimeler daha az hatırlandı; çoğu kişi için listenin ortası en zor hatırlanan kısımdır.');
      }
      parts.push(`Bu karşılaştırma her kısımda yalnızca ${third} kelimeye dayanır; kaba bir göstergedir.`);
    }
    calisma = { ...card('kl_calisma'), headline, text: [...parts, ...issues].join(' ') };
  }

  /* Grafik, öne çıkan sayılar ve profil */
  const chart: CognitiveReport['chart'] = none
    ? undefined
    : {
        title: 'Hatırlanan kelime sayısı',
        note: v(
          `İlk üç çubuk aynı listenin üç denemesidir; dördüncüsü bir kez gösterilen ikinci liste, sonuncusu ilk listenin yeniden gösterilmeden hatırlanmasıdır. Her çubuk ${L} kelime üzerindendir.`,
          `İlk üç çubuk aynı listenin üç denemesidir; dördüncüsü bir kez gösterilen ikinci liste, sonuncusu ilk listenin yeniden gösterilmeden hatırlanmasıdır. Her çubuk ${L} kelime üzerindendir.`,
        ),
        rows: [
          ...counts.map((c, i) => ({ label: `${i + 1}. deneme`, value: c })),
          { label: 'İkinci liste (bir kez)', value: r.b.correct },
          { label: 'İlk liste, araya giren listeden sonra', value: d },
        ].map((x) => ({ ...x, max: L, valueLabel: `${x.value}/${L}` })),
      };
  const figures: CognitiveReport['figures'] = [
    { label: 'Üçüncü denemede', value: none ? 'Cevap yok' : `${t3}/${L}` },
    { label: 'Araya giren listeden sonra', value: none ? 'Cevap yok' : `${d}/${L}` },
    valid ? { label: 'Tanıma', value: `${rec.hits}/${rec.targets}`, note: `${fa} yanlış “evet”` } : { label: 'Tanıma', value: 'Yorumlanmadı' },
  ];
  const profile: CognitiveReport['profile'] = compared
    ? {
        title: v('Listenin hangi kısmını daha çok hatırladın', 'Listenin hangi kısmı daha çok hatırlandı'),
        note: v(
          'Her sütun listenin bir kısmıdır: ilk beş, ortadaki beş ve son beş kelime. Sütun ne kadar yüksekse o kısımdaki kelimeleri üç denemede o kadar çok hatırlamışsın demektir; tam boy sütun, o beş kelimeyi üç denemede de hatırladığın anlamına gelir. Renkler yalnızca kısımları ayırır.',
          'Her sütun listenin bir kısmıdır: ilk beş, ortadaki beş ve son beş kelime. Sütun ne kadar yüksekse o kısımdaki kelimeler üç denemede o kadar çok hatırlanmış demektir; tam boy sütun, o beş kelimenin üç denemede de hatırlandığı anlamına gelir. Renkler yalnızca kısımları ayırır.',
        ),
        bars: WORD_LIST_PARTS.map((x) => ({
          key: x.key,
          label: x.label,
          value: Math.round((p[x.key] / p.of) * 100),
          min: 0,
          max: 100,
          color: x.color,
          valueLabel: `${p[x.key]}/${p.of}`,
          band: '',
        })),
      }
    : undefined;
  return { blocks: [ogrenme, koruma, tanima, calisma], ...(chart ? { chart } : {}), figures, ...(profile ? { profile } : {}) };
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
  const kk = byKey.get('kk_dogru')?.extra as unknown as FoldingResult | undefined;
  const kkt = def.tasks.find((t): t is PaperFoldingTask => t.kind === 'paper_folding');
  if (kk && kkt) add(foldingBlocks(kk, kkt, audience, card));
  const kb = byKey.get('kb_dogru')?.extra as unknown as VocabularyResult | undefined;
  const kbt = def.tasks.find((t): t is VocabularyTask => t.kind === 'vocabulary');
  if (kb && kbt) add(vocabularyBlocks(kb, kbt, audience, card));
  const kd = byKey.get('kd_dogruluk')?.extra as unknown as RuleSwitchResult | undefined;
  if (kd && def.tasks.some((t) => t.kind === 'rule_switch')) add(ruleSwitchBlocks(kd, audience, card));
  const kl = byKey.get('kl_ogrenme')?.extra as unknown as WordListResult | undefined;
  if (kl && def.tasks.some((t) => t.kind === 'word_list')) add(wordListBlocks(kl, audience, card));
  const ma = byKey.get('ma_dogru')?.extra as unknown as LogicResult | undefined;
  if (ma && def.tasks.some((t): t is LogicalReasoningTask => t.kind === 'logical_reasoning')) add(logicBlocks(ma, audience, card));
  const sy = byKey.get('sy_dogru')?.extra as unknown as NumericResult | undefined;
  if (sy && def.tasks.some((t): t is NumericalReasoningTask => t.kind === 'numerical_reasoning')) add(numericBlocks(sy, audience, card));
  const kp = byKey.get('kp_dogru')?.extra as unknown as CubeResult | undefined;
  const kpt = def.tasks.find((t): t is CubeNetTask => t.kind === 'cube_net');
  if (kp && kpt) add(cubeBlocks(kp, kpt, audience, card));
  const gs = byKey.get('gs_dogru')?.extra as unknown as HiddenResult | undefined;
  const gst = def.tasks.find((t): t is HiddenFiguresTask => t.kind === 'hidden_figures');
  if (gs && gst) add(hiddenBlocks(gs, gst, audience, card));
  const dk = byKey.get('dk_dogru')?.extra as unknown as ReflectionResult | undefined;
  if (dk && def.tasks.some((t) => t.kind === 'cognitive_reflection')) add(reflectionBlocks(dk, audience, card));
  const kg = byKey.get('kg_dogru')?.extra as unknown as TowerResult | undefined;
  if (kg && def.tasks.some((t) => t.kind === 'tower')) add(towerBlocks(kg, audience, card));
  const ud = byKey.get('ud_dogru')?.extra as unknown as Rotation3dResult | undefined;
  const udt = def.tasks.find((t): t is MentalRotation3dTask => t.kind === 'mental_rotation_3d');
  if (ud && udt) add(rotation3dBlocks(ud, udt, audience, card));
  const dh = byKey.get('dh_aralik')?.extra as unknown as PatternResult | undefined;
  if (dh && def.tasks.some((t) => t.kind === 'pattern_memory')) add(patternBlocks(dh, audience, card));
  const hb = byKey.get('hb_harf')?.extra as unknown as ComplexSpanResult | undefined;
  if (hb && def.tasks.some((t) => t.kind === 'complex_span')) add(complexSpanBlocks(hb, audience, card));
  const ba = byKey.get('ba_hata')?.extra as unknown as PerspectiveResult | undefined;
  if (ba && def.tasks.some((t) => t.kind === 'perspective')) add(perspectiveBlocks(ba, audience, card));

  if (def.tasks.every((t) => t.kind === 'cancellation')) return { blocks, tips: SUSTAINED_TIPS[voice(audience)] };
  // Bu görevler için öneriler (kapsamlı rapor) henüz yazılmadı; basit raporda öneri gösterilmez.
  if (def.tasks.every((t) => ['color_word', 'go_nogo', 'trail', 'n_back', 'mental_rotation', 'reaction_time', 'matrix_reasoning', 'number_series', 'verbal_reasoning', 'paper_folding', 'vocabulary', 'rule_switch', 'word_list', 'logical_reasoning', 'numerical_reasoning', 'cube_net', 'cognitive_reflection', 'tower', 'mental_rotation_3d', 'complex_span', 'perspective', 'hidden_figures', 'pattern_memory'].includes(t.kind))) {
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
