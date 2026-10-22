import { RIASEC_ORDER, RIASEC_TYPES, occupationsFor, type Occupation, type RiasecKey } from '@/content/careers/riasec';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { BandText, InsightTemplate, LevelGroup, MotivationTemplate, PairText, ValuesTemplate } from '@/content/reports/types';
import { GRADE_LABELS } from '@/lib/config';
import { DEFAULT_BAND_LABELS, nearestBand } from './bands';
import { niceMax } from './visual-draw';
import { bandZones, type BarsVisual, type ColumnsVisual, type DotsVisual, type ItemVisual, type LadderVisual, type StackVisual, type StepsVisual, type StripVisual, type Zone } from './visuals';
import type {
  Band,
  CancellationTask,
  DigitSpanTask,
  SpatialSpanTask,
  GoNoGoTask,
  InstrumentDef,
  LikertInstrument,
  MatrixReasoningTask,
  MatrixRule,
  MentalRotationTask,
  NumberSeriesRule,
  NumberSeriesTask,
  LetterSeriesRule,
  LetterSeriesTask,
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
  CANCELLATION_FEW_HITS,
  colorWordMostlyMissed,
  MATRIX_CHANCE_MAX,
  matrixChance,
  MATRIX_LEVEL_PASS,
  MATRIX_NEAR_MIN,
  MATRIX_NEAR_SHARE,
  NBACK_RANDOM_FA,
  NUMBER_PATTERN_MIN,
  REACTION_MIN_VALID,
  REACTION_MOUSE_SHARE,
  VERBAL_CHANCE_MAX,
  verbalChance,
  VERBAL_TYPES_ORDER,
  FOLDING_CHANCE_MAX,
  foldingChance,
  FOLDING_LURES_ORDER,
  foldingLurePattern,
  foldingRapid,
  foldingSamePosition,
  VOCABULARY_CHANCE_MAX,
  vocabularyChance,
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
  letterSeriesMostlySkipped,
  letterSeriesRapid,
  letterSeriesSameAnswer,
  LETTER_PATTERN_MIN,
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
  type LetterSeriesResult,
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
  numericFewAnswered,
  numericRapid,
  numericRushed,
  NUMERIC_RAPID_BLANK,
  type NumericGroup,
  type NumericResult,
  LOGIC_ABOVE_CHANCE,
  countOf,
  logicBelowChance,
  logicRapid,
  logicRushed,
  logicSameSide,
  type LogicGroup,
  type LogicResult,
  CUBE_CHANCE_MAX,
  cubeChance,
  CUBE_LURE_NOTE,
  CUBE_LURES_ORDER,
  cubeLureStandsOut,
  cubeRapid,
  reflectionChance,
  reflectionControlLow,
  reflectionSuspicious,
  reflectionBelowChance,
  reflectionRushed,
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
  rotationStatus,
  rotationMissedKind,
  cubeSamePosition,
  type CubeResult,
  HIDDEN_CHANCE_MAX,
  hiddenChance,
  HIDDEN_LURE_NOTE,
  HIDDEN_LURES_ORDER,
  hiddenLureStandsOut,
  hiddenRapid,
  hiddenSamePosition,
  type HiddenResult,
  patternFloor,
  patternManySkipped,
  patternRapid,
  PATTERN_LARGE,
  PATTERN_RESTARTS_NOTE,
  type PatternResult,
  ROTATION3D_CHANCE_MAX,
  ROTATION3D_PART_GAP,
  rotation3dMirrorPick,
  rotation3dHalfPick,
  rotation3dRapid,
  rotation3dSamePair,
  type Rotation3dPartResult,
  type Rotation3dResult,
  CS_OPS_TARGET,
  complexSpanOpsChance,
  complexSpanOpsReversed,
  complexSpanOpsSlow,
  complexSpanRapid,
  complexSpanRecallChance,
  complexSpanWrongShare,
  type ComplexSpanResult,
  PA_CHANCE_MEAN,
  perspectiveChance,
  perspectiveDoubt,
  perspectiveEgo,
  perspectiveMirror,
  perspectiveOpposite,
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
  /** Düzey bölgeleri (anket testlerinde): kartın düzey çubuğu bunlarla çizilir (lib/reports/visuals.ts). */
  zones?: Zone[];
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
  /** Testi mezun (üniversiteye hazırlanan) biri çözdü: destek kutusu okuldan söz etmez. */
  graduate?: boolean;
  /** Sonuç kartlarının başlığı (rapor şablonu: itemsTitle). */
  itemsTitle?: string;
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
  /** Kartın grafiği: kartın sözel açıklamasını görsel olarak da anlatır (lib/reports/visuals.ts). */
  visual?: ItemVisual;
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
   * Belirgin (yüksek düzeydeki) en çok üç alan; hiçbiri yoksa orta düzeydeki en yüksek iki alan (düşük düzeydeki bir alan
   * "en yüksek çıkan" ya da "en sık uğraşılan" diye gösterilmez). Gösterilen puanı birebir aynı alanlar kesimle bölünmez:
   * son gösterilen alanla eşit puandaki alanlar bir alan fazlasına kadar birlikte gösterilir (ör. üçüncü ve dördüncü alan
   * eşitse dört alan); daha büyük eşitlik notla söylenir (`closeCalls`). Bütün alanların puanı aynıysa boştur: öne çıkan
   * alan yoktur (ör. her etkinliğe aynı cevap verildiğinde).
   */
  top: string[];
  /**
   * İlgi ve etkinlik sıralamasında öne çıkabilecek alanların sayısı: yüksek düzeydeki alanlar, hiçbiri yoksa orta
   * düzeydekiler (öne çıkan alanlar bunların en yüksekleridir).
   */
  candidates?: number;
  /**
   * İlgi ve etkinlik sıralamasında eşitlik notları: öne çıkan alanların sırası ya da seçimi aynı ya da neredeyse aynı
   * puanlara dayanıyorsa (kişiye göre yazılmış).
   */
  closeCalls?: string[];
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
  /**
   * Değer sıralamasında ikisi de en önemli değerler arasında ve ikisi de "çok önemli" düzeyinde olan, birbirine ters
   * yönde çekebilen çiftler.
   */
  tradeoffs?: { a: string; b: string; title: string; text: string }[];
  /**
   * Öne çıkan alanların ya da değerlerin sıra numaraları (eşit puanlılar aynı numarayı alır: 1, 1, 3): eşit puan testteki
   * sıraya göre bozulmaz. İlgi ve etkinlik sıralamasında eşitlik gösterilen puana (bir ondalık) göredir.
   */
  ranks?: number[];
  /** Değer sıralamasında daha az önem verilen değerlerin açıklaması (değer adları yazılmış). */
  lowerText?: string;
  /** Değer sıralamasının sonundaki not: sonucun nasıl kullanılabileceği. */
  note?: { title: string; text: string };
}

export interface InterestProfile {
  /**
   * Öne çıkan alanların harfleri, ör. "SAE" (en çok üç; orta düzeyin altındaki alan girmez). Birebir eşit puan bir harfin
   * hangi alana ait olacağını belirliyorsa (ör. üçüncü ve dördüncü alan eşit) kod eşitlikten önce kesilir (ör. "SA");
   * eşitlik ilk harften başlıyorsa kod verilmez. Hiçbir alan yüksek değilse, bütün alanlar düşükse ya da bütün puanlar
   * aynıysa boştur: kod ve örnek meslek verilmez.
   */
  code: string;
  types: { key: RiasecKey; name: string; mean: number | null; rank: number }[];
  /**
   * Öne çıkan alanlar: en az bir alan yüksekse en çok üç alan, yoksa en yüksek iki orta düzey alan. Gösterilen puanı
   * birebir aynı alanlar kesimle bölünmez (bir alan fazlasına kadar birlikte gösterilir).
   */
  top: {
    key: RiasecKey;
    name: string;
    plain: string;
    /** Yüksek düzeydeki alanda kişiye yazılmış açıklama, orta düzeydeki alanda orta düzeyde ilgiyi söyleyen cümle. */
    text: string;
    bandLabel: string;
    high: boolean;
    /** Sıra numarası: gösterilen puanı aynı alanlar aynı numarayı alır (1, 1, 3). */
    rank: number;
    likes: string[];
    explore: string[];
    paths: { lise: string; universite: string };
  }[];
  lowest: { key: RiasecKey; name: string }[];
  /** En yüksek ile en düşük alan arasındaki fark (1–5 ölçeğinde). */
  differentiation: number;
  /** Profil henüz belirginleşmemiş (fark küçük): kod gösterilir ama örnek meslek listesi verilmez. */
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
        zones: bandZones(def.anchoredBands, template, scale.key, min, max),
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
        // Yol haritası ayrışan boyut için orta düzeyin önerilerini verir (yüksek ya da düşük kart yönlerinden biriyle çelişirdi).
        sec.split = true;
        // Destek kutusu kalır: boyutun ortalaması düşükse (ör. Duygusal Denge) alt özelliklerinden biri yüksek olsa da
        // kişi genel olarak sık sıkıntı yaşadığını söylüyordur (2026-10-22 incelemesi; önceden kutu kalkıyordu).
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
    ...(input.grade === 13 ? { graduate: true } : {}),
    ...(template?.itemsTitle ? { itemsTitle: template.itemsTitle } : {}),
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
  // Öne çıkabilecek alanlar: yüksek düzeydekiler (en çok üç), hiçbiri yoksa orta düzeydekiler (en çok iki). Düşük düzeydeki
  // bir alan hiçbir zaman "en yüksek çıkan" ya da "en sık uğraşılan" diye gösterilmez.
  const pool = noneHigh ? scored.filter((s) => s.band === 'average') : high;
  const poolValues = pool.map((s) => s.value as number);
  const count = values.length > 1 && spread === 0 ? 0 : tiedCut(poolValues, noneHigh ? 2 : 3);
  const top = pool.slice(0, count);
  return {
    kind,
    order: scored.map((s) => s.scaleKey),
    top: top.map((s) => s.scaleKey),
    candidates: pool.length,
    ranks: tieRanks(poolValues.slice(0, count)),
    closeCalls: count ? rankingCloseCalls(pool.map((s) => ({ name: s.name, value: s.value as number })), count, audience) : [],
    noneHigh,
    flat: values.length > 1 && spread < 0.8,
    allLow: scored.length > 0 && scored.every((s) => s.band === 'low' || s.band === 'very_low'),
  };
}

/**
 * Sıralı ilgi ve etkinlik profilinde eşitlik notları. Puanları art arda en çok INTEREST_TIE farklı alanlar (öne
 * çıkabilecek alanların içinde) bir küme oluşturur; küme öne çıkan alanlara dokunuyorsa sıranın ya da seçimin küçük bir
 * farka dayandığı söylenir. Gösterilen puanları birebir aynı olan ve hepsi öne çıkan alanlar arasında gösterilen kümeye not
 * yazılmaz: kartlardaki aynı sıra numarası ve "eşit puan" rozeti bunu zaten söyler.
 */
function rankingCloseCalls(pool: { name: string; value: number }[], shown: number, audience: Audience): string[] {
  const you = audience !== 'parent';
  const notes: string[] = [];
  for (const [i, j] of tieClusters(pool.map((x) => x.value), shown)) {
    const group = pool.slice(i, j + 1);
    const exact = group.every((x) => exactTie(x.value, group[0].value));
    if (j < shown && exact) continue;
    const names = joinAreas(group.map((x) => x.name));
    const lead = you ? `${names} alanlarındaki puanların aynı ya da neredeyse aynı; ` : `${names} alanlarındaki puanlar aynı ya da neredeyse aynıdır; `;
    let tail: string;
    if (j < shown) tail = 'bu alanların sırası yer değiştirebilir.';
    else if (i === shown - 1)
      tail = you
        ? 'öne çıkan alanlarından birini bu alanlardan herhangi biri olarak düşünebilirsin.'
        : 'öne çıkan alanlardan biri bu alanlardan herhangi biri olarak düşünülebilir.';
    else
      tail = you
        ? 'bu yüzden öne çıkan alanlarının seçimi kesin değil, bu alanların hepsini birlikte düşünebilirsin.'
        : 'bu yüzden öne çıkan alanların seçimi kesin değildir, bu alanların hepsi birlikte düşünülebilir.';
    notes.push(lead + tail);
  }
  return notes;
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
  // Yarışan değerler yalnızca ikisi de "çok önemli" düzeyindeyken anılır: orta derecede önemli iki değer "en önemli
  // değerler arasında" diye birbirine karşı konmaz.
  const veryImportant = (k: string) => top.some((s) => s.scaleKey === k && isHighBand(s.band));
  const tradeoffs = (t?.tradeoffs ?? [])
    .filter((x) => veryImportant(x.a) && veryImportant(x.b))
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

/** Dizi görevinin merdiveni: görevdeki bütün uzunluklar, her uzunluktaki denemeler ve doğru tekrarlanan en uzun dizi. */
function spanLadder(label: string, r: SpanResult, unit: string, task: { startLength: number; sequences: unknown[] } | undefined): LadderVisual {
  const first = task?.startLength ?? r.ladder[0]?.length ?? 1;
  const last = task ? task.startLength + task.sequences.length - 1 : (r.ladder.at(-1)?.length ?? first);
  const rows = Array.from({ length: last - first + 1 }, (_, i) => first + i).map((length) => ({ length, results: r.ladder.find((x) => x.length === length)?.results ?? [] }));
  return { type: 'ladder', label, rows, reached: r.span > 0 ? r.span : null, unit };
}

function spanText(
  r: SpanResult,
  audience: Audience,
  what: { student: string; parent: string; unit: string; everyday: string; floor: { student: string; parent: string } },
): string {
  const you = audience !== 'parent';
  if (r.belowFloor) {
    return you
      ? `${what.floor.student} O an dikkatin dağılmış ya da görev sana yeni gelmiş olabilir. ${what.everyday}`
      : `${what.floor.parent} O anki dikkat, yorgunluk ya da görevin yeni olması bu sonucu etkilemiş olabilir; tek başına yorumlanmamalıdır. ${what.everyday}`;
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
  const v = (student: string, parent: string) => (you ? student : parent);
  const n = nf0.format;
  const card = (key: string) => ({ key, name: scale(key).name, plain: scale(key).plain });

  // Çok az harf işaretlendiyse (görev yarıda kalmış ya da yönerge anlaşılmamış) hiçbir kart yorumlanmaz; grafik çizilmez.
  if (r.hits < CANCELLATION_FEW_HITS) {
    const short = v('Çok az harf işaretlediğin için yorumlanmadı.', 'Çok az harf işaretlendiği için yorumlanmadı.');
    return [
      {
        ...card('tempo'),
        headline: 'Yorumlanmadı',
        text: v(
          'Çok az harf işaretlediğin için bu sonuç yorumlanmadı. Görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin.',
          'Çocuğunuz çok az harf işaretlediği için bu sonuç yorumlanmadı. Görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir.',
        ),
      },
      { ...card('isabet'), headline: 'Yorumlanmadı', text: short },
      { ...card('net'), headline: 'Yorumlanmadı', text: short },
      { ...card('surdurme'), headline: 'Yorumlanmadı', text: short },
    ];
  }

  const ceiling = r.ceiling
    ? v(
        ' En az bir bölümde sayfanın sonuna ulaştın; gerçek hızın bundan da yüksek olabilir.',
        ' En az bir bölümde sayfanın sonuna ulaşıldı; gerçek çalışma hızı bundan yüksek olabilir.',
      )
    : '';
  const tempo: CognitiveBlock = {
    ...card('tempo'),
    headline: `Dakikada ${n(r.perMinute)} harf`,
    text:
      v(
        `Harf sayfalarında dakikada ortalama ${n(r.perMinute)} harfe baktın. Bu, işi ne kadar hızlı yürüttüğünü gösterir. Hız tek başına iyi ya da kötü değildir; önemli olan, hızlı giderken aranan harfleri kaçırmamaktır.`,
        `Çocuğunuz harf sayfalarında dakikada ortalama ${n(r.perMinute)} harf taradı. Bu sayı, basit ama dikkat isteyen bir işi ne kadar hızlı yaptığını gösterir. Hız tek başına iyi ya da kötü değildir; doğrulukla birlikte okunmalıdır.`,
      ) + ceiling,
  };

  // Çok sayıda yanlış işaret varken (harflere gelişigüzel dokunmak da bütün hedefleri bulur) "dikkatli" denmez.
  const manyFalse = r.falseAlarmRate >= 0.02;
  const random = r.commissions > r.hits;
  const found =
    r.hitRate >= 0.9
      ? v(
          `Taradığın satırlardaki aranan harflerin ${r.omissions === 0 ? 'hepsini' : 'neredeyse hepsini'} buldun${manyFalse ? '.' : '; dikkatli çalıştığını gösteriyor.'}`,
          `Çocuğunuz taradığı satırlardaki aranan harflerin ${r.omissions === 0 ? 'hepsini' : 'neredeyse hepsini'} buldu${manyFalse ? '.' : '; görevi dikkatle yürüttü.'}`,
        )
      : r.hitRate >= 0.75
        ? v(
            'Taradığın satırlardaki aranan harflerin çoğunu buldun ama bir kısmını atladın. Hızlı giderken bazı harflerin gözden kaçması çok yaygındır; satır satır, harf harf ilerlemek atlamaları azaltır.',
            'Çocuğunuz taradığı satırlardaki aranan harflerin çoğunu buldu, bir kısmını atladı. Hızlı çalışırken bazı harflerin gözden kaçması yaygındır.',
          )
        : v(
            'Taradığın satırlardaki aranan harflerin önemli bir kısmını atladın. Bu; hızlı gitmekten, satır atlamaktan ya da o an dikkatinin dağılmasından kaynaklanabilir. Acele etmeden, harf harf ilerlemek işine yarar.',
            'Çocuğunuz taradığı satırlardaki aranan harflerin önemli bir kısmını atladı. Bu; çok hızlı çalışmaktan, satır atlamaktan ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır.',
          );
  const falseMarks = random
    ? v(
        ' Yanlış işaretlerin doğru işaretlerinden fazla: harflere bakmadan dokunmuş olabilirsin. Bu yüzden bulduğun harflerin oranı tek başına bir şey söylemez.',
        ' Yanlış işaretler doğru işaretlerden fazla: çocuğunuz harflere bakmadan dokunmuş olabilir. Bu yüzden bulma oranı tek başına yorumlanmamalıdır.',
      )
    : manyFalse
      ? v(
          ` Birçok harfi de yanlışlıkla işaretledin (${n(r.commissions)} yanlış işaret); p ile b ya da d, o ile a gibi birbirine benzeyen harfler kolayca karışabilir.`,
          ` Çocuğunuz aranan harflere benzeyen birçok harfi de işaretledi (${n(r.commissions)} yanlış işaret; ör. p ile b ya da d). Bu, acele etmekten ya da benzer harfleri ayırt etmekte zorlanmaktan kaynaklanabilir.`,
        )
      : r.commissions === 0
        ? v(' Hiç yanlış işaret yapmadın.', ' Hiç yanlış işaret yok.')
        : '';
  const isabet: CognitiveBlock = {
    ...card('isabet'),
    headline: `Bulma oranı ${pct(r.hitRate)}`,
    ...(r.strays ? { detail: `Taranan kısmın çok ilerisindeki ${n(r.strays)} dokunuş yanlışlıkla dokunma sayıldı, puana katılmadı.` } : {}),
    text: found + falseMarks,
  };

  const net: CognitiveBlock = {
    ...card('net'),
    headline: `${n(r.net)} net doğru`,
    text: v(
      'Net doğru, doğru işaretlerinden yanlış işaretlerin çıkarılmasıyla bulunur. Hızını ve dikkatini birlikte gösterir: harfleri kaçırmadan ve yanlış işaretlemeden ne kadar iş çıkardığını anlatır.',
      'Net doğru, doğru işaretlerden yanlış işaretlerin çıkarılmasıyla bulunur. Hızı ve dikkati birlikte gösterir; rastgele işaretlemek bu sayıyı artırmaz. Görev aynı tür cihazla yeniden yapılırsa değişimi izlemek için kullanılabilir; ikinci seferde alışkanlıkla biraz artması beklenir.',
    ),
  };

  // İlk ve son bölümler (kartın grafiğiyle aynı bölme): bölüm başına taranan harf ve bulma oranı.
  const half = Math.floor(r.sections.length / 2);
  const early = r.sections.slice(0, half);
  const late = r.sections.slice(half);
  const sum = (xs: typeof r.sections, k: 'processed' | 'hits' | 'targets') => xs.reduce((a, x) => a + x[k], 0);
  const per = (xs: typeof r.sections, k: 'processed' | 'hits' | 'targets') => (xs.length ? sum(xs, k) / xs.length : 0);
  const rate = (xs: typeof r.sections) => sum(xs, 'hits') / Math.max(1, sum(xs, 'targets'));
  // Net doğrudaki düşüş, son bölümlerde daha az harf taramaktan geliyor: taranan satırlardaki harfler yine bulunmuş.
  const scannedLess = per(late, 'processed') < per(early, 'processed') && rate(late) >= 0.9 && rate(late) >= rate(early) - 0.05;

  const change = r.sustainChange;
  const x = change === null ? '' : `%${n(Math.abs(change))}`;
  const unclear = change !== null && Math.abs(change) >= SUSTAIN_THRESHOLD && !r.sustainClear;
  const [headline, sustainText] =
    change === null
      ? [
          'Değişim hesaplanamadı',
          v(
            'İlk bölümlerde yeterli işaret olmadığı için bölümler arasındaki değişim hesaplanamadı.',
            'İlk bölümlerde yeterli doğru işaret olmadığı için bölümler arasındaki değişim hesaplanamadı.',
          ),
        ]
      : unclear
        ? [
            'Fark belirsiz',
            v(
              'Grafikte son bölümler ilk bölümlerden farklı görünüyor. Ama işaretlediğin harf az olduğu için bu fark şans eseri de olabilir; bu yüzden yorumlanmadı.',
              'Grafikte son bölümler ilk bölümlerden farklı görünüyor. Ancak çocuğunuzun işaretlediği harf sayısı az olduğu için bu fark şans eseri de olabilir; bu yüzden yorumlanmadı.',
            ),
          ]
        : change <= -SUSTAIN_THRESHOLD
          ? [
              'Son bölümlerde düştü',
              scannedLess
                ? v(
                    `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} azaldı. Bunun nedeni, son bölümlerde daha az harf taraman: yavaşladın, ama taradığın satırlardaki harfleri yine kaçırmadın. Uzun bir işte yorulmak ya da sıkılmak çoğu kişide olur; uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`,
                    `Çocuğunuzun son bölümlerdeki net doğru sayısı ilk bölümlere göre yaklaşık ${x} azaldı. Azalma, son bölümlerde daha az harf taramasından geliyor; taradığı satırlardaki harfleri yine kaçırmadı. Bu, uzun bir işte yorulma ya da sıkılmayla olabilir. Uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`,
                  )
                : v(
                    `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} azaldı. Uzun bir işte yorulmak ya da sıkılmak çoğu kişide olur; uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`,
                    `Çocuğunuzun son bölümlerdeki net doğru sayısı ilk bölümlere göre yaklaşık ${x} azaldı. Bu, çocuğunuzun dikkatini uzun süre aynı düzeyde tutmakta zorlandığını düşündürebilir; yorgunluk ya da isteksizlik de aynı etkiyi yapabilir. Uzun işleri parçalara bölmek ve kısa molalar vermek yardımcı olur.`,
                  ),
            ]
          : change >= SUSTAIN_THRESHOLD
            ? [
                'Görev ilerledikçe arttı',
                v(
                  `Son bölümlerde net doğru sayın ilk bölümlere göre yaklaşık ${x} arttı: görevi yaptıkça ısındın.`,
                  `Çocuğunuzun son bölümlerdeki net doğru sayısı ilk bölümlere göre yaklaşık ${x} arttı: görev ilerledikçe ısınmış ve göreve alışmış görünüyor.`,
                ),
              ]
            : [
                'Belirgin değişim yok',
                v(
                  `${task.sections} bölüm boyunca belirgin bir değişim görülmedi: görevin başında nasıl çalıştıysan sonunda da öyle çalıştın.`,
                  `${task.sections} bölüm boyunca belirgin bir değişim görülmedi; çocuğunuz görevin başında ve sonunda benzer biçimde çalıştı.`,
                ) +
                  (r.hitRate >= 0.9 && !manyFalse ? v(' Dikkatini görev boyunca korudun.', ' Dikkatini görev boyunca korumuş görünüyor.') : '') +
                  v(' Bölümler arasındaki küçük farklar şans eseri olabilir.', ''),
              ];
  const surdurme: CognitiveBlock = {
    ...card('surdurme'),
    headline,
    text: you || change === null || unclear ? sustainText : `${sustainText} Bölümler arasındaki küçük farklar şans eseri olabilir; yalnızca büyük farklar yorumlanır.`,
    sections: r.sections.map((s) => ({ label: `${s.index + 1}. bölüm`, value: s.net })),
  };

  /* Kart grafikleri */
  tempo.visual = {
    type: 'columns',
    label: 'Bölüm bölüm taranan harf',
    rows: r.sections.map((x) => ({ label: `${x.index + 1}. bölüm`, value: x.processed, valueLabel: n(x.processed) })),
    max: Math.max(1, ...r.sections.map((x) => x.processed)),
    caption: 'Taranan harf; bölümlerin süresi eşit',
  } satisfies ColumnsVisual;
  isabet.visual = {
    type: 'stack',
    label: 'Taranan satırlardaki aranan harfler',
    total: r.hits + r.omissions,
    parts: [
      { label: 'Bulunan harf', value: r.hits },
      { label: 'Atlanan harf', value: r.omissions },
    ],
  } satisfies StackVisual;
  net.visual = {
    type: 'bars',
    label: 'Net doğru',
    scale: 'scale',
    rows: [
      { label: 'Doğru işaret', value: r.hits, valueLabel: n(r.hits) },
      { label: 'Yanlış işaret', value: r.commissions, valueLabel: n(r.commissions) },
      { label: 'Net doğru (doğru − yanlış)', value: Math.max(0, r.net), valueLabel: n(r.net) },
    ],
  } satisfies BarsVisual;
  {
    // Kartın karşılaştırdığı iki yarı: ilk bölümler ve son bölümler (bölümlerin süresi eşit; bölüm başına ortalama net doğru).
    const avg = (xs: typeof r.sections) => (xs.length ? xs.reduce((a, x) => a + x.net, 0) / xs.length : 0);
    const a = avg(early);
    const b = avg(late);
    const one = (k: number) => (k === 1 ? 'bölüm' : `${k} bölüm`);
    surdurme.visual = {
      type: 'bars',
      label: 'Bölüm başına ortalama net doğru',
      scale: 'scale',
      rows: [
        { label: `İlk ${one(early.length)}`, value: Math.max(0, a), valueLabel: nf1.format(a) },
        { label: `Son ${one(late.length)}`, value: Math.max(0, b), valueLabel: nf1.format(b) },
      ],
    } satisfies BarsVisual;
  }

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
  const errors = r.n - r.correct;
  // Hataların ne kadarı kelime ile renk farklıyken oldu ve bu hataların ne kadarı aynı türdeydi: sayıya uyan sözcük.
  const where = incErr === errors ? 'Hataların hepsi' : incErr * 2 > errors ? 'Hataların çoğu' : 'Hataların bir kısmı';
  const most = (k: number) => (k === incErr ? 'bu hataların hepsinde' : 'bu hatalarda çoğunlukla');
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
      ? ` ${where} kelime ile renk farklıyken oldu ve ${most(r.wordErrors)} kelimenin söylediği renge bastın: kelimeyi okuma alışkanlığı zaman zaman öne geçti.`
      : ` ${where} kelime ile renk farklıyken oldu ve ${most(r.wordErrors)} kelimenin söylediği renge basıldı; bu, kelimeyi okuma alışkanlığının zaman zaman öne geçtiğini gösterir.`,
    other: you
      ? ` ${where} kelime ile renk farklıyken oldu; ${most(r.otherErrors)} kelimeye değil, başka bir renge bastın. Renkleri birbirine karıştırmış ya da acele etmiş olabilirsin.`
      : ` ${where} kelime ile renk farklıyken oldu; ${most(r.otherErrors)} kelimeye değil, başka bir renge basıldı. Renkler birbirine karıştırılmış ya da acele edilmiş olabilir.`,
    missed: you
      ? ` ${where} kelime ile renk farklıyken oldu; ${missedInc === incErr ? 'bu denemelerin hepsinde' : 'bu denemelerin çoğunda'} süre içinde cevap vermedin ya da kelimeye bakmadan çok erken bastın.`
      : ` ${where} kelime ile renk farklıyken oldu; ${missedInc === incErr ? 'bu denemelerin hepsinde' : 'bu denemelerin çoğunda'} süre içinde cevap verilmedi ya da kelimeye bakmadan çok erken basıldı.`,
    mixed: ` ${where} kelime ile renk farklıyken oldu.`,
  }[errorKind];
  // Doğruluk düşükken hataların çoğu süre aşımı ya da çok erken cevapsa bu ayrıca söylenir.
  const mostlyMissed = colorWordMostlyMissed(r);
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
        ? ` ${where} kelime ile renk farklıyken oldu ve ${most(r.wordErrors)} kelimenin söylediği renge bastın: kelimeyi okumak, yazının rengine bakmanın önüne geçti. Acele etmeden, önce yazının rengine bakmak işine yarar.`
        : ` ${where} kelime ile renk farklıyken oldu ve ${most(r.wordErrors)} kelimenin söylediği renge basıldı: kelimeyi okumak yazının rengine bakmanın önüne geçmiş ya da yönerge tam anlaşılmamış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`;
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
      text: 'Yeterince doğru cevap olmadığı için kelime ile rengin aynı olduğu ve farklı olduğu denemeler karşılaştırılamadı.',
    };
  } else {
    const diff = i - c;
    if (diff >= INTERFERENCE_MIN_MS) {
      etki = {
        ...card('renk_etki'),
        headline: `Kelime ile renk farklıyken ${sn(diff)} sn daha yavaş`,
        text: you
          ? 'Kelime ile renk farklı olduğunda cevapların biraz yavaşladı. Bu çoğu kişide olur: okumak o kadar otomatik bir alışkanlıktır ki kelime, rengi bulmanın önüne geçer. Bu yavaşlama, alışkanlığa direnip doğru cevabı vermenin ne kadar çaba istediğini gösterir. Bu fark bir seferden ötekine değişebilir; küçük farklara takılma.'
          : 'Kelime ile renk farklı olduğunda çocuğunuzun cevapları biraz yavaşladı. Bu, çoğu kişide görülen bir etkidir (renk-kelime etkisi): okuma otomatik bir alışkanlık olduğu için kelime, rengi bulmanın önüne geçer. Yavaşlamanın büyüklüğü, alışkanlığa direnip doğru cevabı vermenin ne kadar çaba istediğini gösterir; bu etki çocuklukta büyüktür ve yaşla azalır. Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.',
      };
    } else if (diff <= -INTERFERENCE_MIN_MS) {
      etki = {
        ...card('renk_etki'),
        headline: 'Kelime ile renk farklıyken daha hızlı',
        text: you
          ? 'Kelime ile renk farklıyken cevapların, aynıyken olduğundan biraz daha hızlıydı. Bu sık görülmez; çoğunlukla ölçümün doğal payından kaynaklanır ve bir seferden ötekine değişebilir.'
          : 'Kelime ile renk farklıyken çocuğunuzun cevapları, aynıyken olduğundan biraz daha hızlıydı. Bu sık görülmez; çoğunlukla ölçümün doğal payından kaynaklanır. Tek bir uygulamada bu farkın kesinliği düşüktür.',
      };
    } else {
      etki = {
        ...card('renk_etki'),
        headline: 'Belirgin bir fark görülmedi',
        text: you
          ? 'Kelime ile renk farklıyken cevapların, aynıyken olduğundan belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlama, bu uygulamada sende belirgin olarak ortaya çıkmadı. Bu fark bir seferden ötekine değişebilir.'
          : 'Kelime ile renk farklıyken çocuğunuzun cevapları, aynıyken olduğundan belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlamanın belirgin olmaması; kelimelerin henüz çok otomatik okunmamasından, hızdan çok doğruluğa önem verilmesinden ya da ölçümün doğal payından kaynaklanabilir. Tek bir uygulamada bu farkın kesinliği düşüktür.',
      };
    }
    // Kelime ile renk farklıyken hız korunup daha sık yanılındıysa kelimenin etkisi hatalarda görülmüştür.
    if (drop && errorKind === 'reading' && diff < INTERFERENCE_MIN_MS) {
      etki.text += you
        ? ' Bu görevde kelimenin etkisi daha çok hatalarda görüldü: farklıyken hızını korudun ama daha sık yanıldın. Bu yüzden bu küçük süre farkı tek başına bir şey söylemez.'
        : ' Bu görevde kelimenin etkisi daha çok hatalarda görüldü: çocuğunuz kelime ile renk farklıyken hızını korudu ama daha sık yanıldı. Bu yüzden süre farkı tek başına yorumlanmamalıdır.';
    }
    if (r.checkFlag) {
      etki.text += you
        ? ' Renk denemesindeki karışıklık yüzünden bu fark dikkatle yorumlanmalı.'
        : ' Renk denemesindeki karışıklık yüzünden bu fark dikkatle yorumlanmalıdır.';
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
  /* Kart grafikleri */
  dogruluk.visual = pctBarsVisual('Doğru cevap oranı', [
    { label: 'Kelime ile renk aynıyken', rate: r.accCongruent },
    { label: 'Kelime ile renk farklıyken', rate: r.accIncongruent },
  ]);
  if (r.medianRt !== null)
    hiz.visual = durationStrip({ label: 'Doğru cevaplarda cevap süreleri', rts: r.rts, median: r.medianRt, marker: `Tipik ${sn(r.medianRt)} sn`, item: 'bir doğru cevap', digits: 2 });
  if (c !== null && i !== null)
    etki.visual = msBarsVisual('Tipik cevap süresi', [
      { label: 'Kelime ile renk aynıyken', ms: c },
      { label: 'Kelime ile renk farklıyken', ms: i },
    ]);
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
  // Hiç basılmadı (çok erken basış da yok): görev yarıda kalmış ya da yönerge anlaşılmamış.
  const none = r.hits === 0 && r.anticipations === 0;
  // Basma oranı düşükse durma oranı yorumlanmaz: hiç basmayan biri de X'te durmuş görünür.
  const stopUnread = r.hitRate < GO_HIT_FOR_STOP;
  const speedy = r.stopRate < 0.6 && r.hitRate >= 0.95;
  const careful = r.stopRate >= 0.8 && r.hitRate >= GO_HIT_FOR_STOP && r.hitRate < 0.85 && !early;
  /** "Basman gereken 90 harfin 31 tanesinde": çok erken basışların sayısı. */
  const earlyCount = `${r.goTrials} harfin ${r.anticipations === r.goTrials ? 'hepsinde' : `${r.anticipations} tanesinde`}`;
  let durmaText: string;
  if (stopUnread) {
    const q = none ? 'hiçbirinde' : r.hitRate < 0.5 ? 'çoğunda' : 'önemli bir kısmında';
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
        ? `${didStop}. Ama basman gereken ${earlyCount} harfe bakmadan, çok erken bastığın için bu oran tek başına bir şey söylemez.`
        : `${didStop}. Ancak basması gereken ${earlyCount} harfe bakmadan, çok erken bastığı için bu oran tek başına yorumlanamaz.`
      : none
        ? you
          ? `${didStop}. Ama basman gereken harflerin hiçbirinde basmadığın için bu oran bir şey söylemez: hiç basmayan biri de ${x}’te durmuş görünür.`
          : `${didStop}. Ancak basması gereken harflerin hiçbirinde basmadığı için bu oran yorumlanamaz: hiç basmayan biri de ${x}’te durmuş görünür.`
        : you
          ? `${didStop}. Ama basman gereken harflerin ${q} zamanında basmadığın için bu oran tek başına bir şey söylemez: hiç basmayan biri de ${x}’te durmuş görünür.`
          : `${didStop}. Ancak basması gereken harflerin ${q} zamanında basmadığı için bu oran tek başına yorumlanamaz: hiç basmayan biri de ${x}’te durmuş görünür.`;
  } else if (careful) {
    // Dikkatli gidip durabildi ama basması gereken bazı harfleri kaçırdı: durma oranı bu dengeyle birlikte okunur.
    durmaText = you
      ? `${x} geldiğinde ${r.stopRate === 1 ? 'her seferinde' : 'çoğu zaman'} durabildin. Ama bunu yaparken basman gereken bazı harfleri kaçırdın: yavaş ve dikkatli gitmek durmayı kolaylaştırmış olabilir.`
      : `Çocuğunuz ${x} geldiğinde ${r.stopRate === 1 ? 'her seferinde' : 'çoğu zaman'} durabildi; ancak basması gereken harflerin bir kısmını kaçırdı. Yavaş ve dikkatli çalışmak durmayı kolaylaştırmış olabilir.`;
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
    // Hızlı çalışırken durmakta zorlandıysa öneri tepki hızı kartındadır (aynı öneri iki kez yazılmaz).
    durmaText = you
      ? `${x} geldiğinde birçok kez istemeden bastın. Sık sık basarken birden durmak çoğu kişi için zordur${speedy ? '.' : '; biraz daha yavaş ve dikkatli gitmek durmayı kolaylaştırır.'}`
      : `Çocuğunuz ${x} geldiğinde birçok kez istemeden bastı. Bu; çok hızlı çalışmaktan, yönergenin tam anlaşılmamasından ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır.`;
  }
  const durma: CognitiveBlock = {
    ...card('dg_durma'),
    headline: stopUnread ? 'Yorumlanmadı' : `Durma oranı ${pct(r.stopRate)}`,
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
    tepkiText = you
      ? `Basman gereken ${earlyCount} harf görünür görünmez, ona bakmadan bastın. Harfi görüp öyle basmak, hem doğru tepki vermeni hem de ${x}’te durmanı kolaylaştırır.`
      : `Çocuğunuz basması gereken ${earlyCount} harf görünür görünmez, ona bakmadan bastı; düğmeye harfi beklemeden basılmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.`;
  } else if (none) {
    tepkiText = you
      ? 'Basman gereken harflerin hiçbirinde basmadın. Görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin; bu yüzden bu sonuç yorumlanmadı.'
      : 'Çocuğunuz basması gereken harflerin hiçbirinde basmadı. Görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir; bu yüzden bu sonuç yorumlanmadı.';
  } else {
    const q = r.omissions > r.goTrials / 2 ? 'çoğunu' : 'bir kısmını';
    tepkiText = you
      ? `Basman gereken harflerin ${q} kaçırdın. Bu; dikkatin zaman zaman dağılmasından, yorgunluktan ya da ${x}’e takılmamak için çok dikkatli gitmekten kaynaklanabilir.`
      : `Çocuğunuz basması gereken harflerin ${q} kaçırdı. Bu; dikkatin zaman zaman dağılmasından, yorgunluktan, isteksizlikten ya da çok dikkatli davranmaya çalışmaktan kaynaklanabilir ve tek başına yorumlanmamalıdır.`;
  }
  const tepki: CognitiveBlock = {
    ...card('dg_tepki'),
    headline: `Basma oranı ${pct(r.hitRate)}`,
    text: tepkiText,
  };

  let hiz: CognitiveBlock;
  if (r.medianRt === null) {
    hiz = { ...card('dg_hiz'), headline: 'Hesaplanamadı', text: 'Zamanında basış çok az olduğu için tepki süresi hesaplanamadı.' };
  } else {
    // Dikkatli gidip harf kaçırmak durabilme kartında anlatılır; burada yinelenmez.
    const pattern = speedy
      ? you
        ? ` Senin sonucunda hız öne çıkıyor: biraz yavaşlamak ${x}’te durmanı kolaylaştırabilir.`
        : ` Çocuğunuzun sonucunda hız öne çıkıyor: hızlı tepki verirken ${x}’te durmakta zorlandı.`
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
  /* Kart grafikleri */
  // Yorumlanmayan durma oranının grafiği yoktur.
  if (!stopUnread) {
    durma.visual = {
      type: 'dots',
      label: `${x} harfinin geldiği denemeler`,
      rows: [{ label: `${x} geldiğinde`, filled: stopped, total: r.stopTrials, valueLabel: `${stopped}/${r.stopTrials}` }],
      legend: ['basmadan durdu', 'bastı'],
    } satisfies DotsVisual;
  }
  tepki.visual = {
    type: 'stack',
    label: 'Diğer harflerin geldiği denemeler',
    total: r.goTrials,
    parts: [
      { label: 'Zamanında basıldı', value: r.hits },
      { label: 'Kaçırıldı', value: r.omissions },
      ...(r.anticipations ? [{ label: 'Çok erken basıldı', value: r.anticipations }] : []),
    ],
  } satisfies StackVisual;
  if (r.medianRt !== null)
    hiz.visual = durationStrip({ label: 'Doğru basışlarda tepki süreleri', rts: r.rts, median: r.medianRt, marker: `Tipik ${sn(r.medianRt)} sn`, item: 'bir doğru basış', digits: 2 });
  return {
    blocks: [durma, tepki, hiz],
    chart: {
      title: 'Doğru tepki oranları',
      note:
        (you
          ? 'Çubuklar, durman ve basman gereken harflerde doğru tepki oranını gösterir.'
          : 'Çubuklar, durması ve basması gereken harflerde doğru tepki oranını gösterir.') +
        (stopUnread ? ' Basma oranı düşük olduğu için durma oranı yorumlanmadı.' : ''),
      rows: [
        stopUnread
          ? { label: `${x} geldiğinde durma`, value: 0, max: 100, valueLabel: 'yorumlanmadı' }
          : { label: `${x} geldiğinde durma`, value: Math.round(r.stopRate * 100), max: 100, valueLabel: pct(r.stopRate) },
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
  /** Yanlış dokunuşlar: hiç yoksa, ara sıraysa (bölüme göre olağan nedeniyle) ve daire sayısını aşacak kadar sıksa. */
  const errText = (p: TrailResult['parts'][number], second: boolean) => {
    const e = p.errors;
    const k = e === 1 ? 'Bir' : `${e}`;
    if (e === 0) return you ? ' Hiç yanlış daireye dokunmadın.' : ' Hiç yanlış daireye dokunmadı.';
    if (e > p.n)
      return you
        ? ` Yanlış dairelere çok sık dokundun (${e} kez); sırayı izlemeden dokunmuş olabilirsin. Bu yüzden bu bölümün süresi seni tam yansıtmayabilir.`
        : ` Yanlış dairelere çok sık dokundu (${e} kez); sırayı izlemeden dokunmuş olabilir. Bu yüzden bu bölümün süresi tek başına yorumlanmamalıdır.`;
    const why = second
      ? 'bu bölümde sayıdan harfe geçerken sırayı bir an karıştırmak sık olur.'
      : 'bu görevde ara sıra yanlış daireye dokunmak olağandır.';
    return you ? ` ${k} kez yanlış daireye dokundun; ${why}` : ` ${k} kez yanlış daireye dokundu; ${why}`;
  };
  const incomplete = (p: TrailResult['parts'][number]) =>
    you
      ? `Bu bölüm ${maxSec} saniyelik süre içinde tamamlanamadı (${p.reached === 0 ? 'hiçbir daireyi birleştiremedin' : `${p.n} dairenin ${countOf(p.reached, p.n, 'ini')} sırayla birleştirdin`}). Bu; kullandığın cihazdan, yönergeyi tam anlamamaktan ya da o an dikkatinin dağılmasından olabilir. Bu sonuç tek başına bir şey söylemez.`
      : `Bu bölüm ${maxSec} saniyelik süre içinde tamamlanamadı (${p.reached === 0 ? 'hiçbir daire birleştirilmedi' : `${p.n} dairenin ${countOf(p.reached, p.n, 'i')} birleştirildi`}). Bu; cihazdan, yönergenin tam anlaşılmamasından ya da o anki dikkat dağınıklığından kaynaklanabilir ve tek başına yorumlanmamalıdır.`;
  const [a, b] = r.parts;

  const blockA: CognitiveBlock = a.completed
    ? {
        ...card('iz_a'),
        headline: `${s1(a.timeMs)} saniye`,
        text: you
          ? `Sayıları sırayla (${a.n} daire) ${s1(a.timeMs)} saniyede birleştirdin.${errText(a, false)} Bu bölüm, ekranı tarayıp aradığını hızla bulabilmeyi ve el-göz uyumunu gösterir; süre, kullandığın cihazdan da etkilenir.`
          : `Çocuğunuz sayıları sırayla (${a.n} daire) ${s1(a.timeMs)} saniyede birleştirdi.${errText(a, false)} Bu bölüm, ekranı tarayıp aranan daireyi bulma hızını ve el-göz uyumunu yansıtır; süre, kullanılan cihazdan (dokunmatik ekran ya da fare) belirgin biçimde etkilenir.`,
      }
    : { ...card('iz_a'), headline: 'Süre içinde tamamlanamadı', text: incomplete(a) };

  const blockB: CognitiveBlock = b.completed
    ? {
        ...card('iz_b'),
        headline: `${s1(b.timeMs)} saniye`,
        text: you
          ? `Sayı ve harfleri sırayla (${b.n} daire) ${s1(b.timeMs)} saniyede birleştirdin.${errText(b, true)} Bu bölümde bir sayıya bir harfe geçerek ilerlemen gerekir.`
          : `Çocuğunuz sayı ve harfleri sırayla (${b.n} daire) ${s1(b.timeMs)} saniyede birleştirdi.${errText(b, true)} Bu bölümde sayılar ile harfler arasında gidip gelmek gerekir; alfabe sırasını akıcı bilmek de süreyi etkiler.`,
      }
    : { ...card('iz_b'), headline: 'Süre içinde tamamlanamadı', text: incomplete(b) };

  let gecis: CognitiveBlock;
  if (r.ratio === null || r.diffMs === null) {
    gecis = {
      ...card('iz_gecis'),
      headline: 'Hesaplanamadı',
      text:
        !a.completed && !b.completed
          ? 'İki bölüm de süre içinde tamamlanamadığı için iki bölüm karşılaştırılamadı.'
          : 'Bölümlerden biri süre içinde tamamlanamadığı için iki bölüm karşılaştırılamadı.',
    };
  } else {
    // Oran ve fark, raporda yazılan (saniyenin onda biri duyarlılığında) sürelerden hesaplanır ki birbirini tutsun.
    const tA = Math.round(a.timeMs / 100) * 100;
    const tB = Math.round(b.timeMs / 100) * 100;
    const ratio = tB / tA;
    const diff = tB - tA;
    const x = nf1.format(ratio);
    if (ratio >= TRAIL_SAME[1]) {
      gecis = {
        ...card('iz_gecis'),
        headline: `Birinci bölümün ${x} katı`,
        text: you
          ? `İkinci bölüm, birinci bölümün yaklaşık ${x} katı sürdü (${s1(diff)} saniye daha uzun). Sayılar ile harfler arasında gidip gelmek, iki sırayı aynı anda akılda tutmayı gerektirir. Bu yüzden ikinci bölüm genellikle daha uzun sürer. Bu oran bir seferden ötekine değişebilir.`
          : `Çocuğunuzun ikinci bölümü, birinci bölümün yaklaşık ${x} katı sürdü (${s1(diff)} saniye daha uzun). Sayılar ile harfler arasında gidip gelmek, iki sırayı aynı anda akılda tutmayı (çalışma belleği) gerektirir. Bu yüzden ikinci bölüm genellikle daha uzun sürer. Bu oran, geçiş yapmanın ne kadar ek süre getirdiğine dair kaba bir fikir verir; tek bir uygulamada kesinliği düşüktür ve tek başına yorumlanmamalıdır.`,
      };
    } else if (ratio > TRAIL_SAME[0]) {
      gecis = {
        ...card('iz_gecis'),
        headline: 'İki bölüm yaklaşık aynı sürdü',
        text: you
          ? 'İki bölüm yaklaşık aynı sürede bitti: sayılarla harfler arasında gidip gelmek sana belirgin bir ek süre getirmedi. Genellikle ikinci bölüm daha uzun sürer; bu sonuç bir seferden ötekine değişebilir.'
          : 'Çocuğunuzun iki bölümü yaklaşık aynı sürede bitti: sayılarla harfler arasında gidip gelmek belirgin bir ek süre getirmedi. Genellikle ikinci bölüm daha uzun sürer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
      };
    } else {
      gecis = {
        ...card('iz_gecis'),
        headline: 'İkinci bölüm daha kısa sürdü',
        text: you
          ? 'İkinci bölüm birinci bölümden kısa sürdü. Bu sık görülmez; birinci bölümde bir aksaklık olmuş ya da ikinci bölüme gelene kadar göreve alışmış olabilirsin. Bu sonuç bir seferden ötekine değişebilir.'
          : 'Çocuğunuzun ikinci bölümü birinci bölümden kısa sürdü. Bu sık görülmez; birinci bölümde bir aksaklık olmuş ya da göreve alışma etkisi görülmüş olabilir. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
      };
    }
  }

  /* Kart grafikleri: tamamlanan bölümde sürenin süre sınırına göre yeri, tamamlanmayanda birleştirilen daireler; iki bölümün süreleri. */
  const partName = (p: TrailResult['parts'][number], k: number) => task.parts[p.index]?.name ?? `${k + 1}. bölüm`;
  [blockA, blockB].forEach((blk, k) => {
    const p = r.parts[k];
    blk.visual = p.completed
      ? ({
          type: 'strip',
          label: `Bölümün süresi (süre sınırı ${maxSec} sn)`,
          min: 0,
          max: task.maxMs / 1000,
          unit: 'sn',
          points: [],
          marker: { value: Math.round(p.timeMs / 100) / 10, label: `${s1(p.timeMs)} sn` },
        } satisfies StripVisual)
      : ({
          type: 'stack',
          label: 'Daireler',
          total: p.n,
          parts: [
            { label: 'Sırayla birleştirildi', value: p.reached },
            { label: 'Süre bitince kalan', value: p.n - p.reached },
          ],
        } satisfies StackVisual);
  });
  if (r.ratio !== null && r.diffMs !== null) {
    gecis.visual = {
      type: 'bars',
      label: 'Bölüm süreleri',
      scale: 'scale',
      unit: 'sn',
      rows: r.parts.map((p, k) => ({ label: partName(p, k), value: Math.round(p.timeMs / 100) / 10, valueLabel: `${s1(p.timeMs)} sn` })),
    } satisfies BarsVisual;
  }
  const secs = r.parts.map((p) => (p.completed ? p.timeMs : task.maxMs) / 1000);
  const max = roundUp(Math.max(...secs), 30);
  return {
    blocks: [blockA, blockB, gecis],
    chart: {
      title: 'Bölüm süreleri',
      note:
        (you
          ? 'Çubuklar her bölümün kaç saniye sürdüğünü gösterir; kısa çubuk daha hızlı demek.'
          : 'Çubuklar her bölümün kaç saniye sürdüğünü gösterir; kısa çubuk daha hızlı demektir.') +
        (r.parts.some((p) => !p.completed)
          ? ` Tamamlanmayan bölümün çubuğu süre sınırına (${maxSec} sn) kadar çizildi; o bölümün gerçek süresi bilinmiyor.`
          : ''),
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
  // Kartın grafiği: aynı harflerden yakalananlar ve aynı olmayan harflerden basılmadan geçilenler.
  const visual: DotsVisual = {
    type: 'dots',
    label: l.n === 1 ? 'Bir geri bölümündeki harfler' : 'İki geri bölümlerindeki harfler',
    rows: [
      { label: 'Aynı harfler: yakalandı', filled: l.hits, total: l.targets, valueLabel: `${l.hits}/${l.targets}` },
      { label: 'Aynı olmayanlar: basılmadı', filled: l.nonTargets - l.falseAlarms, total: l.nonTargets, valueLabel: `${l.nonTargets - l.falseAlarms}/${l.nonTargets}` },
    ],
    legend: ['doğru tepki', 'kaçırma ya da yanlış basma'],
  };

  if (nBackSilent(l)) {
    const W = where.charAt(0).toLocaleUpperCase('tr-TR') + where.slice(1);
    // Hiç basılmayan düzey yorumlanmaz; grafiği de olmaz.
    return {
      ...card(key),
      headline: 'Hiç basılmadı',
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
            ? l.hits * 2 > l.targets
              ? v('yarısından çoğunu yakaladın', 'yarısından çoğunu yakaladı')
              : l.hits * 2 === l.targets
                ? v('yarısını yakaladın', 'yarısını yakaladı')
                : v('yarısından azını yakaladın', 'yarısından azını yakaladı')
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
  // Tuzaklarda (bir önceki harfle aynı olan harfler) basılanların niceliği.
  const lureQ =
    l.lureFalseAlarms === l.lures ? 'hepsinde' : l.lureFalseAlarms * 2 > l.lures ? 'çoğunda' : l.lureFalseAlarms * 2 === l.lures ? 'yarısında' : `${l.lureFalseAlarms} tanesinde`;
  const keptOneBack = pattern !== 'random' && nBackKeptOneBack(l);
  let second: string;
  if (pattern === 'random') {
    second = v(
      'Bu yüzden bu sonuç, aynı harfleri ayırt edebildiğini göstermez: düğmeye harfe bakmadan basmış ya da kuralı karıştırmış olabilirsin. Bu sonuç tek başına bir şey söylemez.',
      'Bu yüzden bu sonuç, aynı harfleri ayırt edebildiğini göstermez: düğmeye harfe bakmadan basmış ya da kuralı karıştırmış olabilir. Bu sonuç tek başına yorumlanmamalıdır.',
    );
  } else if (keptOneBack) {
    second =
      hard +
      v(
        `Bir önceki harfle aynı olan harflerin ${lureQ} bastın: iki geri bölümlerinde bir geri kuralıyla devam etmiş olabilirsin. Bu sonuç tek başına bir şey söylemez.`,
        `Bir önceki harfle aynı olan harflerin ${lureQ} bastı: iki geri bölümlerinde bir geri kuralıyla devam etmiş olabilir. Bu sonuç tek başına yorumlanmamalıdır.`,
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
            `Aynı harfleri yakalamakta zaman zaman zorlandın. Bu; ${l.n === 2 ? 'son iki harfi akılda tutmanın zor gelmesinden, ' : ''}dikkatin zaman zaman dağılmasından, yorgunluktan ya da kuralı karıştırmaktan kaynaklanabilir.`,
            `Aynı harfleri yakalamakta zaman zaman zorlandı. Bu; ${l.n === 2 ? 'son iki harfi akılda tutmanın zor gelmesinden, ' : ''}dikkatin zaman zaman dağılmasından, yorgunluktan ya da kuralın karıştırılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
          )
        : v(
            `Aynı harfleri aynı olmayanlardan ayırmakta zaman zaman zorlandın. Bu; ${l.n === 2 ? 'son iki harfi akılda tutmanın zor gelmesinden, ' : ''}acele etmekten, dikkatin dağılmasından ya da kuralı karıştırmaktan kaynaklanabilir.`,
            `Aynı harfleri aynı olmayanlardan ayırmakta zaman zaman zorlandı. Bu; ${l.n === 2 ? 'son iki harfi akılda tutmanın zor gelmesinden, ' : ''}acele etmekten, dikkatin dağılmasından ya da kuralın karıştırılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
          ));
  } else {
    second =
      hard +
      (pattern === 'misses'
        ? l.n === 2
          ? v(
              `${here} aynı harfleri yakalamakta zorlandın. Bu; son iki harfi akılda tutmanın zor gelmesinden, yorgunluktan, dikkatin dağılmasından ya da kuralı tam oturtamamaktan kaynaklanabilir; tek başına bir şey söylemez.`,
              `${here} aynı harfleri yakalamakta zorlandı. Bu; son iki harfi akılda tutmanın zor gelmesinden, yorgunluktan, dikkatin dağılmasından ya da kuralın tam oturmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
            )
          : v(
              `${here} aynı harfleri yakalamakta zorlandın. Bu; yönergeyi tam anlamamaktan, dikkatin dağılmasından ya da yorgunluktan kaynaklanabilir; tek başına bir şey söylemez.`,
              `${here} aynı harfleri yakalamakta zorlandı. Bu; yönergenin tam anlaşılmamasından, dikkatin dağılmasından ya da yorgunluktan kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
            )
        : v(
            `${here} aynı harfleri aynı olmayanlardan ayırmakta zorlandın. Bu; ${l.n === 2 ? 'son iki harfi akılda tutmanın zor gelmesinden, ' : ''}yönergeyi tam anlamamaktan, acele etmekten ya da dikkatin dağılmasından kaynaklanabilir; tek başına bir şey söylemez.`,
            `${here} aynı harfleri aynı olmayanlardan ayırmakta zorlandı. Bu; ${l.n === 2 ? 'son iki harfi akılda tutmanın zor gelmesinden, ' : ''}yönergenin tam anlaşılmamasından, acele etmekten ya da dikkatin dağılmasından kaynaklanabilir ve tek başına yorumlanmamalıdır.`,
          ));
  }
  if (l.n === 2 && pattern !== 'random' && !keptOneBack && l.lureFalseAlarms >= 2) {
    const q = l.lureFalseAlarms === l.lures ? 'hepsinde' : `${l.lureFalseAlarms} tanesinde`;
    second += v(
      ` Bir önceki harfle aynı olan (ama iki önceki harfle aynı olmayan) ${l.lures} harfin ${q} de bastın; bu harfler tanıdık geldiği için yanıltıcıdır.`,
      ` Bir önceki harfle aynı olan (ama iki önceki harfle aynı olmayan) ${l.lures} harfin ${q} de bastı; bu harfler tanıdık geldiği için yanıltıcıdır.`,
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
  return { ...card(key), headline, text: `${first} ${second}`, visual };
}

/** "Zorluk artınca" kartı: bir geriden iki geriye ayırt etme puanı nasıl değişti? Güvenilmeyen durumlarda karşılaştırılmaz. */
function nBackLoadBlock(r: NBackResult, audience: Audience, card: CardOf): CognitiveBlock {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const one = r.levels.find((l) => l.n === 1)!;
  const two = r.levels.find((l) => l.n === 2)!;
  const no = (text: string): CognitiveBlock => ({ ...card('gh_yuk'), headline: 'Karşılaştırılamadı', text });
  const silentWhere = (w: string) =>
    no(v(`${w} hiç basmadığın için bir geri ile iki geri karşılaştırılamadı.`, `${w} hiç basmadığı için bir geri ile iki geri karşılaştırılamadı.`));
  if (nBackSilent(one) && nBackSilent(two)) return silentWhere('Hiçbir bölümde');
  if (nBackSilent(two)) return silentWhere('İki geri bölümlerinde');
  if (nBackSilent(one)) return silentWhere('Bir geri bölümünde');
  const silentBlock = r.blocks.find(nBackSilent);
  if (silentBlock) {
    const which = NBACK_ORDINALS[silentBlock.index] ?? `${silentBlock.index + 1}.`;
    return silentWhere(`${which.charAt(0).toLocaleUpperCase('tr-TR')}${which.slice(1)} bölümde`);
  }
  const rand1 = one.falseAlarmRate > NBACK_RANDOM_FA;
  const rand2 = two.falseAlarmRate > NBACK_RANDOM_FA;
  if (rand1 || rand2) {
    const w = rand1 && rand2 ? 'Hem bir geride hem iki geride' : rand1 ? 'Bir geride' : 'İki geride';
    return no(
      v(
        `${w} aynı olmayan harflerin çoğunda da bastığın için bir geri ile iki geriyi karşılaştırmak anlamlı değil.`,
        `${w} aynı olmayan harflerin çoğunda da bastığı için bir geri ile iki geriyi karşılaştırmak anlamlı değildir.`,
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
    'Grafikteki ayırt etme puanı şöyle bulunur: aynı harfleri yakalama oranından, aynı olmayanlarda basma oranı çıkarılır. Hiç yanılmayan biri 100 alır; rastgele basan biri 0’a yakın, hiç basmayan biri 0 alır.';
  const ceiling = s1 >= 95 && s2 >= 95;
  const [headline, text] = ceiling
    ? [
        s1 === 100 && s2 === 100 ? 'İki düzeyde de hatasız' : 'İki düzeyde de neredeyse hatasız',
        v(
          'Bir geride de iki geride de hemen hiç yanılmadın. Görev sana zor gelmediği için, zorluk artınca sonucun nasıl değiştiği bu görevde görülemedi.',
          'Çocuğunuz bir geride de iki geride de hemen hiç yanılmadı. Görev ona zor gelmediği için, zorluk artınca sonucun nasıl değiştiği bu görevde görülemedi.',
        ),
      ]
    : drop >= NBACK_DROP.clear
      ? [
          'İki geride belirgin düşüş',
          v(
            'Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun belirgin biçimde düştü. İki geride sonucun düşmesi sık görülür: iki geri, çalışma belleğini çok daha fazla zorlar. Düşüşün büyüklüğü, ek yükün o gün sana ne kadar zor geldiğine dair kaba bir fikir verir; bu fark bir seferden ötekine değişebilir.',
            'Akılda tutulacak harf sayısı birden ikiye çıkınca çocuğunuzun sonucu belirgin biçimde düştü. İki geride sonucun düşmesi sık görülür: iki geri, çalışma belleğini çok daha fazla zorlar. Düşüşün büyüklüğü yalnızca kaba bir fikir verir; tek bir uygulamada bu farkın kesinliği düşüktür ve tek başına yorumlanmamalıdır.',
          ),
        ]
      : drop >= NBACK_DROP.some
        ? [
            'İki geride biraz düşüş',
            v(
              'Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun biraz düştü. Bu beklenen bir durumdur. Bu fark bir seferden ötekine değişebilir.',
              'Akılda tutulacak harf sayısı birden ikiye çıkınca çocuğunuzun sonucu biraz düştü. Bu beklenen bir durumdur. Tek bir uygulamada bu farkın kesinliği düşüktür.',
            ),
          ]
        : drop > -NBACK_DROP.higher
          ? [
              'Belirgin bir fark yok',
              v(
                'Bir geride ve iki geride benzer sonuç aldın: akılda tutulacak harf sayısının artması, sonucunu belirgin biçimde değiştirmedi. Genellikle iki geride sonuç biraz düşer; bu sonuç bir seferden ötekine değişebilir.',
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
    text: `${text} ${how}`,
    visual: {
      type: 'bars',
      label: 'Ayırt etme puanı (100 üzerinden)',
      scale: 'share',
      rows: [
        { label: 'Bir geri', value: s1, max: 100, valueLabel: `${s1}/100` },
        { label: 'İki geri', value: s2, max: 100, valueLabel: `${s2}/100` },
      ],
    } satisfies BarsVisual,
  };
}

/** Geriye dönük hatırlamanın üç sonuç kartı: bir geri, iki geri ve zorluk artınca sonucun nasıl değiştiği. */
function nBackBlocks(r: NBackResult, audience: Audience, card: CardOf): TaskReport {
  const one = r.levels.find((l) => l.n === 1)!;
  const two = r.levels.find((l) => l.n === 2)!;
  // Hiç basılmayan düzey yorumlanmaz: çubukları boş çizilir ve "hiç basılmadı" yazılır (basmama %100 başarı gibi görünmesin).
  const row = (l: NBackLevelResult, label: string) =>
    nBackSilent(l)
      ? [
          { label: `${label}: aynıları yakalama`, value: 0, max: 100, valueLabel: 'hiç basılmadı' },
          { label: `${label}: aynı olmayanlarda basmama`, value: 0, max: 100, valueLabel: 'hiç basılmadı' },
        ]
      : [
          { label: `${label}: aynıları yakalama`, value: Math.round(l.hitRate * 100), max: 100, valueLabel: pct(l.hitRate) },
          { label: `${label}: aynı olmayanlarda basmama`, value: Math.round((1 - l.falseAlarmRate) * 100), max: 100, valueLabel: pct(1 - l.falseAlarmRate) },
        ];
  return {
    blocks: [nBackLevelBlock(one, r.blocks, audience, card), nBackLevelBlock(two, r.blocks, audience, card), nBackLoadBlock(r, audience, card)],
    chart: {
      title: 'Bir geri ve iki geri',
      note: 'Çubuklar, aynı harfleri yakalama ve aynı olmayan harflerde basmadan geçme oranlarını gösterir.',
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
  // Uyarılarla aynı ayrım (rotationStatus): şans ve ters kararı yalnızca cevap verilen denemelerden verilir.
  const status = rotationStatus(r);
  const kind = rotationMissedKind(r);
  const notRead = status === 'abandoned' || status === 'rushed' || status === 'invalid' || status === 'chance' || status === 'reversed';
  const answered = r.correct + r.sameSaidMirror + r.mirrorSaidSame;
  const wrong = answered - r.correct;
  const errors = r.n - r.correct;
  const missed = r.timeouts + r.anticipations;
  // Yanlış cevapların türü (ok durumunda): hepsi tek türdeyse ve süre aşımı ya da erken basış yoksa "hepsinde".
  const share = (k: number) => (k === errors ? 'hepsinde' : 'çoğunda');

  let accText: string;
  if (status === 'abandoned') {
    const first =
      r.timeouts === r.n
        ? v(`Hiçbir denemede süre (${limit} saniye) dolmadan cevap vermedin.`, `Çocuğunuz hiçbir denemede süre (${limit} saniye) dolmadan cevap vermedi.`)
        : v(
            `${r.n} denemenin ${r.timeouts} tanesinde süre (${limit} saniye) dolmadan cevap vermedin.`,
            `Çocuğunuz ${r.n} denemenin ${r.timeouts} tanesinde süre (${limit} saniye) dolmadan cevap vermedi.`,
          );
    accText =
      first +
      v(
        ' Görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin. Bu yüzden sonuç yorumlanmadı.',
        ' Görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir. Bu yüzden sonuç yorumlanmadı.',
      );
  } else if (status === 'rushed') {
    const first =
      r.anticipations === r.n
        ? v('Bütün denemelerde 0,3 saniyeden kısa sürede bastın.', 'Çocuğunuz bütün denemelerde 0,3 saniyeden kısa sürede bastı.')
        : v(
            `${r.n} denemenin ${r.anticipations} tanesinde 0,3 saniyeden kısa sürede bastın.`,
            `Çocuğunuz ${r.n} denemenin ${r.anticipations} tanesinde 0,3 saniyeden kısa sürede bastı.`,
          );
    accText =
      first +
      v(
        ' Bu kadar kısa sürede iki şekli karşılaştırmak çok zordur; şekillere bakmadan basmış olabilirsin. Bu yüzden sonuç yorumlanmadı.',
        ' Bu kadar kısa sürede iki şekli karşılaştırmak çok zordur; şekillere bakmadan basmış olabilir. Bu yüzden sonuç yorumlanmadı.',
      );
  } else if (status === 'invalid') {
    accText = v(
      `${r.timeouts} denemede süre (${limit} saniye) dolmadan cevap vermedin; ${r.anticipations} denemede de 0,3 saniyeden kısa sürede, şekillere bakmadan basmış olabilirsin. Denemelerin yarısından çoğu böyle geçtiği için sonuç yorumlanmadı.`,
      `Çocuğunuz ${r.timeouts} denemede süre (${limit} saniye) dolmadan cevap vermedi; ${r.anticipations} denemede de 0,3 saniyeden kısa sürede, şekillere bakmadan basmış olabilir. Denemelerin yarısından çoğu böyle geçtiği için sonuç yorumlanmadı.`,
    );
  } else if (status === 'reversed') {
    const q = wrong === answered ? 'hepsi' : 'çoğu';
    accText = v(
      `Cevap verdiğin denemelerin ${q} yanlıştı: “Aynı” ile “Ayna görüntüsü” düğmelerini birbirine karıştırmış olabilirsin. Bu yüzden sonuç yorumlanmadı.`,
      `Çocuğunuzun cevap verdiği denemelerin ${q} yanlıştı: “Aynı” ile “Ayna görüntüsü” düğmeleri birbirine karıştırılmış olabilir. Bu yüzden sonuç yorumlanmadı.`,
    );
  } else if (status === 'chance') {
    accText = v(
      'Cevap verdiğin denemelerin yarıya yakınını doğru buldun. Rastgele basan biri de yaklaşık yarısını bulur. Yönergeyi tam anlamamış ya da acele etmiş olabilirsin; dikkatin de dağılmış olabilir. Bu yüzden sonuç yorumlanmadı.',
      'Çocuğunuz cevap verdiği denemelerin yarıya yakınını doğru buldu. Rastgele basan biri de yaklaşık yarısını bulur. Yönerge tam anlaşılmamış ya da acele edilmiş olabilir; dikkati de dağılmış olabilir. Bu yüzden sonuç yorumlanmadı.',
    );
  } else if (status === 'missed') {
    // Cevap verilen denemelerin çoğu doğru; doğru cevap oranını süre aşımları ve çok erken basışlar düşürdü.
    const first =
      kind === 'timeouts'
        ? v(
            `${r.n} denemenin ${r.timeouts} tanesinde süre (${limit} saniye) dolmadan cevap vermedin; bunlar doğru sayılmadı.`,
            `Çocuğunuz ${r.n} denemenin ${r.timeouts} tanesinde süre (${limit} saniye) dolmadan cevap vermedi; bunlar doğru sayılmadı.`,
          )
        : kind === 'early'
          ? v(
              `${r.n} denemenin ${r.anticipations} tanesinde 0,3 saniyeden kısa sürede bastın. Bu kadar kısa sürede iki şekli karşılaştırmak çok zordur; bu denemelerde şekillere bakmadan basmış olabilirsin. Bunlar doğru sayılmadı.`,
              `Çocuğunuz ${r.n} denemenin ${r.anticipations} tanesinde 0,3 saniyeden kısa sürede bastı. Bu kadar kısa sürede iki şekli karşılaştırmak çok zordur; bu denemelerde şekillere bakmadan basmış olabilir. Bunlar doğru sayılmadı.`,
            )
          : v(
              `${r.timeouts} denemede süre (${limit} saniye) dolmadan cevap vermedin; ${r.anticipations} denemede de 0,3 saniyeden kısa sürede, şekillere bakmadan basmış olabilirsin. Bunlar doğru sayılmadı.`,
              `Çocuğunuz ${r.timeouts} denemede süre (${limit} saniye) dolmadan cevap vermedi; ${r.anticipations} denemede de 0,3 saniyeden kısa sürede, şekillere bakmadan basmış olabilir. Bunlar doğru sayılmadı.`,
            );
    const most = r.correct >= 0.9 * answered ? 'neredeyse hepsini' : 'çoğunu';
    accText =
      first +
      v(
        ` Cevap verdiğin denemelerin ise ${most} doğru buldun. Bu yüzden doğru cevap oranı seni tam yansıtmayabilir.`,
        ` Cevap verdiği denemelerin ise ${most} doğru buldu. Bu yüzden doğru cevap oranı onu tam yansıtmayabilir.`,
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
      if (missed > errors / 2) {
        accText +=
          kind === 'timeouts'
            ? v(
                ` Doğru sayılmayan denemelerin çoğunda süre (${limit} saniye) dolmadan cevap vermedin: bazı şekilleri karşılaştırmak uzun sürmüş olabilir.`,
                ` Doğru sayılmayan denemelerin çoğunda süre (${limit} saniye) dolmadan cevap vermedi: bazı şekilleri karşılaştırmak uzun sürmüş olabilir.`,
              )
            : kind === 'early'
              ? v(
                  ' Doğru sayılmayan denemelerin çoğunda 0,3 saniyeden kısa sürede, şekillere bakmadan basmış olabilirsin.',
                  ' Doğru sayılmayan denemelerin çoğunda 0,3 saniyeden kısa sürede, şekillere bakmadan basmış olabilir.',
                )
              : v(
                  ` Doğru sayılmayan denemelerin çoğunda ya süre (${limit} saniye) dolmadan cevap vermedin ya da 0,3 saniyeden kısa sürede bastın.`,
                  ` Doğru sayılmayan denemelerin çoğunda ya süre (${limit} saniye) dolmadan cevap vermedi ya da 0,3 saniyeden kısa sürede bastı.`,
                );
      } else if (r.mirrorSaidSame >= 3 && r.mirrorSaidSame >= 2 * r.sameSaidMirror) {
        accText += v(
          ` Yanıldığın denemelerin ${share(r.mirrorSaidSame)} ayna görüntüsüne “Aynı” dedin. Ayna görüntüsü aynı şekle çok benzer; farkı görmek için şekli zihninde sonuna kadar döndürmek gerekir.`,
          ` Yanıldığı denemelerin ${share(r.mirrorSaidSame)} ayna görüntüsüne “Aynı” dedi. Ayna görüntüsü aynı şekle çok benzer; farkı görmek için şekli zihinde sonuna kadar döndürmek gerekir.`,
        );
      } else if (r.sameSaidMirror >= 3 && r.sameSaidMirror >= 2 * r.mirrorSaidSame) {
        const large = r.sameSaidMirrorLarge > r.sameSaidMirror / 2;
        accText += v(
          ` Yanıldığın denemelerin ${share(r.sameSaidMirror)} aynı şekle “Ayna görüntüsü” dedin${large ? '; bunların çoğu çok döndürülmüş şekillerdeydi. Çok döndürülmüş bir şekli tanımak daha zordur.' : '.'}`,
          ` Yanıldığı denemelerin ${share(r.sameSaidMirror)} aynı şekle “Ayna görüntüsü” dedi${large ? '; bunların çoğu çok döndürülmüş şekillerdeydi. Çok döndürülmüş bir şekli tanımak daha zordur.' : '.'}`,
        );
      } else if (wrong > 0) {
        accText += v(' Bazı denemelerde yanıldın.', ' Bazı denemelerde yanıldı.');
      }
      if (r.accuracy < 0.75 && missed <= errors / 2) {
        accText += v(
          ' Bunun nedeni acele etmek, dikkatin dağılması ya da şekli zihinde döndürmenin zor gelmesi olabilir.',
          ' Bunun nedeni acele etmek, dikkatin dağılması ya da şekli zihinde döndürmenin zor gelmesi olabilir; tek başına yorumlanmamalıdır.',
        );
      }
    }
  }
  // Yorumlanmayan sonucun rozeti ve grafiği de yorumlanmış gibi görünmez.
  const dogruluk: CognitiveBlock = notRead
    ? { ...card('zd_dogruluk'), headline: 'Yorumlanmadı', text: accText }
    : {
        ...card('zd_dogruluk'),
        headline: `${pct(r.accuracy)} doğru`,
        text: accText,
        visual: pctBarsVisual('Doğru cevap oranı', [
          { label: 'Aynı şekiller', rate: r.accSame },
          { label: 'Ayna görüntüleri', rate: r.accMirror },
        ]),
      };

  // Sonuç yorumlanmıyorsa süreler de yorumlanmaz; hesaplanamayan süre ayrıca söylenir.
  const why =
    status === 'abandoned'
      ? 'Denemelerin çoğunda süre içinde cevap verilmediği için'
      : status === 'rushed'
        ? 'Denemelerin çoğunda şekillere bakmadan, çok erken basıldığı için'
        : status === 'invalid'
          ? 'Denemelerin çoğunda ya süre içinde cevap verilmediği ya da çok erken basıldığı için'
          : status === 'reversed'
            ? 'Düğmeler birbirine karıştırılmış olabileceği için'
            : 'Doğru cevaplar rastgele basmayla da bulunabilecek kadar az olduğu için';
  const usable = !notRead && r.medianRt !== null;
  const hiz: CognitiveBlock = notRead
    ? { ...card('zd_hiz'), headline: 'Yorumlanmadı', text: `${why} karar süresi yorumlanmadı.` }
    : r.medianRt === null
      ? {
          ...card('zd_hiz'),
          headline: 'Hesaplanamadı',
          text: v(
            'Doğru bulduğun aynı şekiller yeterince çok olmadığı için karar süren hesaplanamadı.',
            'Doğru bulunan aynı şekiller yeterince çok olmadığı için karar süresi hesaplanamadı.',
          ),
        }
      : {
          ...card('zd_hiz'),
          headline: `Tipik karar süresi ${sn(r.medianRt)} saniye`,
          visual: durationStrip({
            label: 'Doğru bulunan aynı şekillerde karar süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${sn(r.medianRt)} sn`,
            item: 'bir aynı şekil',
            digits: 2,
          }),
          text: v(
            `Doğru bulduğun aynı şekillerde karar vermen tipik olarak ${sn(r.medianRt)} saniye sürdü. Hız tek başına iyi ya da kötü değildir; önemli olan, doğru karar verebilmektir.`,
            `Çocuğunuzun doğru bulduğu aynı şekillerde tipik karar süresi ${sn(r.medianRt)} saniye oldu. Bu süre şekilleri görmeyi, karşılaştırmayı ve düğmeye basmayı içerir. Yaşla ve kullanılan cihazla (dokunmatik ekran, fare ya da klavye) değişir. Hız, doğrulukla birlikte değerlendirilmelidir.`,
          ),
        };

  // Süreler raporda saniyenin yüzde biri (10 ms) duyarlılığıyla yazılır; fark da yuvarlanmış sürelerden hesaplanır.
  const to10 = (ms: number | null) => (ms === null ? null : Math.round(ms / 10) * 10);
  const small = to10(r.rtSmall);
  const large = to10(r.rtLarge);
  const bigAngles = r.byAngle.filter((a) => a.angle >= 135);
  const accLarge = bigAngles.reduce((s, a) => s + a.correct, 0) / Math.max(1, bigAngles.reduce((s, a) => s + a.n, 0));
  const largeWeak = accLarge < ROTATION_LARGE_MIN_ACC;
  const no = (headline: string, text: string): CognitiveBlock => ({ ...card('zd_aci'), headline, text });
  let aci: CognitiveBlock;
  if (notRead) {
    aci = no('Karşılaştırılmadı', `${why} karar süreleri karşılaştırılmadı.`);
  } else if (largeWeak) {
    aci = no('Karşılaştırılmadı', 'Çok döndürülmüş şekillerde doğru cevaplar az olduğu için karar süreleri karşılaştırılmadı.');
  } else if (small === null || large === null) {
    aci = no('Karşılaştırılamadı', 'Az ya da çok döndürülmüş aynı şekillerde yeterince doğru cevap olmadığı için karşılaştırma yapılamadı.');
  } else {
    const diff = large - small;
    const visual = msBarsVisual('Tipik karar süresi', [
      { label: 'Az döndürülmüş (0–45°)', ms: small },
      { label: 'Çok döndürülmüş (135–180°)', ms: large },
    ]);
    aci =
      diff >= ROTATION_COST_MIN_MS
        ? {
            ...card('zd_aci'),
            headline: `Çok döndürülmüş şekillerde ${sn(diff)} sn daha uzun`,
            visual,
            text: v(
              'Şekil daha çok döndürülmüşken karar vermen daha uzun sürdü. Bu çoğu kişide görülür: şekil ne kadar çok döndürülmüşse onu zihinde döndürüp karşılaştırmak o kadar uzun sürer. Bu fark bir seferden ötekine değişebilir.',
              'Şekil daha çok döndürülmüşken çocuğunuzun kararı daha uzun sürdü. Bu, zihinsel döndürmenin bilinen bir özelliğidir: karar süresi, iki şekil arasındaki açı büyüdükçe uzar (Shepard ve Metzler, 1971). Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.',
            ),
          }
        : diff > -ROTATION_COST_MIN_MS
          ? {
              ...card('zd_aci'),
              headline: 'Belirgin bir fark yok',
              visual,
              text: v(
                'Az ve çok döndürülmüş şekillerde karar süren belirgin biçimde farklı değildi. Genellikle şekil daha çok döndürüldüğünde karar daha uzun sürer. Bu sonuç bir seferden ötekine değişebilir.',
                'Az ve çok döndürülmüş şekillerde çocuğunuzun karar süresi belirgin biçimde farklı değildi. Genellikle şekil daha çok döndürüldüğünde karar daha uzun sürer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            }
          : {
              ...card('zd_aci'),
              headline: 'Çok döndürülmüş şekillerde daha kısa',
              visual,
              text: v(
                'Çok döndürülmüş şekillerde karar vermen, az döndürülmüş şekillerdekinden daha kısa sürdü; genellikle bunun tersi olur. Bu fark bir seferden ötekine değişebilir.',
                'Çok döndürülmüş şekillerde çocuğunuzun kararı, az döndürülmüş şekillerdekinden daha kısa sürdü; genellikle bunun tersi olur. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            };
  }

  // Yorumlanmayan sonuçta açılara göre süre grafiği de çizilmez. Çok döndürülmüş şekillerde doğru cevaplar azsa o açıların
  // süreleri "yetersiz" yazılır (kart bu karşılaştırmayı yapmıyor).
  if (notRead) return { blocks: [dogruluk, hiz, aci] };
  const values = r.byAngle.map((a) => (usable && !(largeWeak && a.angle >= 135) ? to10(a.medianRt) : null));
  const max = roundUp(Math.max(0, ...values.map((x) => x ?? 0)), 500);
  const note = !usable
    ? 'Doğru bulunan aynı şekil sayısı az olduğu için açılara göre süreler gösterilmedi.'
    : v(
        'Çubuklar, doğru bulduğun aynı şekillerdeki tipik karar süresini gösterir; kısa çubuk daha hızlı demek.',
        'Çubuklar, doğru bulunan aynı şekillerdeki tipik (ortanca) karar süresini gösterir; kısa çubuk daha hızlı demektir.',
      ) +
      (largeWeak
        ? ' Çok döndürülmüş şekillerde (135° ve 180°) doğru cevaplar az olduğu için bu açıların süreleri gösterilmedi.'
        : values.some((x) => x === null)
          ? ' “Yetersiz”: o açıda doğru bulunan aynı şekil sayısı yetersiz.'
          : '');
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
    : p.misses === p.n
      ? `${p.n} denemenin hiçbirinde süre içinde basılmadı`
      : p.correct === 0
        ? `${p.n} denemenin hiçbirinde dairenin olduğu taraftaki düğmeye basılmadı`
        : `${p.n} denemenin ${p.correct === p.n ? 'hepsinde' : `${p.correct} tanesinde`} dairenin olduğu taraftaki düğmeye basıldı`;
  // Hep aynı düğme: hangi düğmeye kaç cevapta basıldığı.
  const sameSide = Math.max(p.left, p.answered - p.left);
  const sideName = p.left * 2 > p.answered ? 'sol' : 'sağ';
  const sideCount = `${p.answered} cevabın ${sameSide === p.answered ? 'hepsinde' : `${sameSide} tanesinde`} ${sideName} düğmeye`;
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
          `${p.misses === p.n ? 'Hiçbir denemede' : 'Denemelerin yarısından çoğunda'} süre içinde basmadın; görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin. Bu yüzden ${verdict}.`,
          `Çocuğunuz ${p.misses === p.n ? 'hiçbir denemede' : 'denemelerin yarısından çoğunda'} süre içinde basmadı; görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir. Bu yüzden ${verdict}.`,
        ),
      );
    case 'early':
      return no(
        v(
          `Denemelerin ${p.early === p.n ? 'hepsinde' : 'yarısından çoğunda'} daire belirmeden ya da belirir belirmez bastın; bu yüzden ${verdict}. Daireyi bekleyip, görür görmez basmak gerekir.`,
          `Çocuğunuz denemelerin ${p.early === p.n ? 'hepsinde' : 'yarısından çoğunda'} daire belirmeden ya da belirir belirmez bastı; bu yüzden ${verdict}.`,
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
          `Cevaplarının ${p.wrong === p.answered ? 'hepsinde' : 'çoğunda'} dairenin olmadığı taraftaki düğmeye bastın; yönergeyi ters anlamış olabilirsin. Daire hangi taraftaysa o taraftaki düğmeye basmak gerekir. Bu yüzden ${verdict}.${extra}`,
          `Çocuğunuz cevaplarının ${p.wrong === p.answered ? 'hepsinde' : 'çoğunda'} dairenin olmadığı taraftaki düğmeye bastı; yönerge ters anlaşılmış olabilir. Bu yüzden ${verdict}.${extra}`,
        ),
      );
    case 'oneSide':
      return no(
        v(
          `Cevaplarının ${sameSide === p.answered ? 'hepsinde' : 'çoğunda'}, dairenin hangi tarafta olduğuna bakmadan aynı düğmeye bastın (${sideCount}). Daire hangi taraftaysa o taraftaki düğmeye basmak gerekir. Bu yüzden ${verdict}.${extra}`,
          `Çocuğunuz cevaplarının ${sameSide === p.answered ? 'hepsinde' : 'çoğunda'} dairenin hangi tarafta olduğuna bakmadan aynı düğmeye bastı (${sideCount}); yönerge anlaşılmamış olabilir. Bu yüzden ${verdict}.${extra}`,
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
  // Aralık tek bir süreye inmişse "aralık ne kadar darsa" denmez.
  const spread =
    lo === hi
      ? v(' Tepkilerin birbirine çok yakındı.', ' Çocuğunuzun tepkileri birbirine çok yakındı; bu, tepkilerinin tutarlı olduğunu gösterir.')
      : v(' Bu aralık ne kadar darsa tepkilerin birbirine o kadar yakın demektir.', ' Bu aralığın darlığı, tepkilerin ne kadar tutarlı olduğunu gösterir.');
  const excluded = p.early + p.misses + p.wrong;
  const issues = excluded
    ? v(
        ` ${p.n} denemenin ${counts()}; ${excluded === 1 ? 'bu deneme' : 'bu denemeler'} hesaba katılmadı.`,
        ` Çocuğunuz ${p.n} denemenin ${counts()}; ${excluded === 1 ? 'bu deneme' : 'bu denemeler'} hesaba katılmadı.`,
      )
    : '';
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
        `Çocuğunuzun daire belirince düğmeye basması tipik olarak ${m} saniye sürdü; hesaba katılan tepkilerinin en az yarısı ${range}.${spread}${issues} Bu süre, daireyi görmeyi ve düğmeye basmayı içerir; yaşla ve kullanılan cihazla (dokunmatik ekran, fare ya da klavye) değişir.`,
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
  // İki bölümün tipik süreleri karşılaştırıldı (sayılar kartın grafiğindedir).
  let compared = false;
  if (ss !== 'ok') fark = no(notOk(r.simple, 'Basit bölümde'));
  else if (cs === 'reversed' || cs === 'chance' || cs === 'errors') fark = no('Seçmeli bölümde öteki taraftaki düğmeye sık basıldığı için karşılaştırma yapılmadı.');
  else if (cs === 'oneSide') fark = no('Seçmeli bölümde cevapların çoğunda aynı düğmeye basıldığı için karşılaştırma yapılmadı.');
  else if (cs !== 'ok') fark = no(notOk(r.choice, 'Seçmeli bölümde'));
  else if (reactionByMouse(r.choice)) fark = no('Seçmeli bölümde fare kullanıldığı için karşılaştırma yapılmadı: süreye imlecin iki düğme arasındaki yolu da eklendi.');
  else {
    const a = to10(r.simple.medianRt as number);
    const b = to10(r.choice.medianRt as number);
    const diff = b - a;
    compared = true;
    fark =
      diff >= REACTION_COST_MIN_MS
        ? {
            ...card('th_fark'),
            headline: `Seçmeli bölümde ${sn(diff)} sn daha uzun`,
            text: v(
              'İki kutudan hangisinde daire belirdiğine göre seçim yapmak, tepki süreni uzattı. Bu çoğu kişide görülür: seçenek arttıkça tepki vermek daha uzun sürer. Bu fark bir seferden ötekine değişebilir.',
              'Seçmeli bölümde çocuğunuzun tepkisi, basit bölümdekinden daha uzun sürdü. Bu, tepki süresi çalışmalarının bilinen bir bulgusudur: seçenek sayısı arttıkça tepki süresi uzar (Hick, 1952). Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.',
            ),
          }
        : diff > -REACTION_COST_MIN_MS
          ? {
              ...card('th_fark'),
              headline: 'Belirgin bir fark yok',
                text: v(
                'Basit ve seçmeli bölümlerde tepki süren belirgin biçimde farklı değildi. Genellikle seçmeli bölümde tepki daha uzun sürer; bu fark bir seferden ötekine değişebilir.',
                'Basit ve seçmeli bölümlerde çocuğunuzun tepki süresi belirgin biçimde farklı değildi. Genellikle seçmeli bölümde tepki daha uzun sürer; tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            }
          : {
              ...card('th_fark'),
              headline: 'Seçmeli bölümde daha kısa',
                text: v(
                'Seçmeli bölümde tepki vermen, basit bölümdekinden daha kısa sürdü; genellikle bunun tersi olur. Bu fark bir seferden ötekine değişebilir.',
                'Seçmeli bölümde çocuğunuzun tepkisi, basit bölümdekinden daha kısa sürdü; genellikle bunun tersi olur. Tek bir uygulamada bu karşılaştırmanın kesinliği düşüktür.',
              ),
            };
  }

  // Bölümlerden birinde denemelerin dörtte birinden çoğu süre aşımı ya da çok erken basışsa karşılaştırma dikkatle okunur.
  if (compared && [r.simple, r.choice].some((p) => p.misses / p.n > 0.25 || p.early / p.n > 0.25)) {
    fark.text += v(
      ' Bölümlerden birinde birçok denemede süre içinde basılmadığı ya da çok erken basıldığı için bu karşılaştırma dikkatle yorumlanmalı.',
      ' Bölümlerden birinde birçok denemede süre içinde basılmadığı ya da çok erken basıldığı için bu karşılaştırma dikkatle yorumlanmalıdır.',
    );
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
  /* Kart grafikleri: yorumlanan bölümde tipik süre ve tepkilerin en az yarısının düştüğü aralık (iki bölüm aynı eksende); yorumlanmayan bölümde denemelerin dağılımı. */
  const partBlocks = [reactionPartBlock(r.simple, audience, card), reactionPartBlock(r.choice, audience, card)];
  const timed = [r.simple, r.choice].filter((p, k) => p.medianRt !== null && p.midHigh !== null && partBlocks[k].headline.startsWith('Tipik'));
  const axis = niceMax(Math.max(0.5, ...timed.map((p) => (Math.ceil((p.midHigh as number) / 10) * 10) / 1000)) * 1.1);
  partBlocks.forEach((b, k) => {
    const p = k ? r.choice : r.simple;
    if (timed.includes(p)) {
      const lo = Math.floor((p.midLow as number) / 10) * 10;
      const hi = Math.ceil((p.midHigh as number) / 10) * 10;
      const m = to10(p.medianRt as number);
      b.visual = {
        type: 'strip',
        label: 'Tepki süresi',
        min: 0,
        max: axis,
        unit: 'sn',
        points: [],
        marker: { value: m / 1000, label: `Tipik ${sn(m)} sn` },
        box: { low: lo / 1000, high: hi / 1000, label: 'tepkilerin en az yarısı' },
      } satisfies StripVisual;
    } else if (k && reactionStatus(p) === 'oneSide') {
      // Hep aynı düğme: hangi düğmeye kaç kez basıldığı.
      b.visual = {
        type: 'stack',
        label: 'Denemeler',
        total: p.n,
        parts: [
          { label: 'Sol düğmeye basıldı', value: p.left },
          { label: 'Sağ düğmeye basıldı', value: p.answered - p.left },
          { label: 'Daire belirmeden ya da belirir belirmez basıldı', value: p.early },
          { label: 'Süre içinde basılmadı', value: p.misses },
        ],
      } satisfies StackVisual;
    } else {
      b.visual = {
        type: 'stack',
        label: 'Denemeler',
        total: p.n,
        parts: [
          { label: k ? 'Doğru taraftaki düğmeye basıldı' : 'Zamanında basıldı', value: p.correct },
          ...(k ? [{ label: 'Öteki düğmeye basıldı', value: p.wrong }] : []),
          { label: 'Daire belirmeden ya da belirir belirmez basıldı', value: p.early },
          { label: 'Süre içinde basılmadı', value: p.misses },
        ],
      } satisfies StackVisual;
    }
  });
  if (compared) {
    fark.visual = msBarsVisual('Tipik tepki süresi', [
      { label: 'Basit tepki', ms: to10(r.simple.medianRt as number) },
      { label: 'Seçmeli tepki', ms: to10(r.choice.medianRt as number) },
    ]);
  }
  return {
    blocks: [...partBlocks, fark],
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

/* ---------- Kart grafikleri (görev testleri) ---------- */

/**
 * Grafiklerde kısa süre yazımı: seconds() ile aynı yuvarlama (kartın metniyle aynı sayı). 23 400 → "23 sn",
 * 75 000 → "1 dk 15 sn", 400 → "1 sn'den kısa".
 */
function secShort(ms: number): string {
  if (ms < 500) return '1 sn’den kısa';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} sn`;
  const m = Math.floor(s / 60);
  return s % 60 ? `${m} dk ${s % 60} sn` : `${m} dk`;
}
/** Grafikteki çubuğun uzunluğu için süre (saniye; seconds() ile aynı yuvarlama). */
const secValue = (ms: number) => (ms < 500 ? 0.5 : Math.round(ms / 1000));

/**
 * Kolay ve zor sorulardaki tipik süreler arasında belirgin bir fark yokken (bir yönde 1,5 katından az) "Çalışma biçimi"
 * kartının süre cümlesi. Kartın grafiği iki süreyi yan yana gösterdiği için %20 ve üstü fark "biraz" diye söylenir;
 * grafikteki yuvarlanmış süreler aynıysa süreler "birbirine yakın" sayılır.
 */
function paceClose(v: (student: string, parent: string) => string, easy: number, hard: number): string {
  const same = secShort(easy) === secShort(hard);
  if (!same && hard >= 1.2 * easy) return v('Zor sorulara kolay sorulardan biraz daha çok zaman ayırdın.', 'Çocuğunuz zor sorulara kolay sorulardan biraz daha çok zaman ayırdı.');
  if (!same && hard * 1.2 <= easy) {
    return v('Zor sorularda kolay sorulardakinden biraz daha kısa sürede cevap verdin.', 'Çocuğunuz zor sorularda kolay sorulardakinden biraz daha kısa sürede cevap verdi.');
  }
  return v('Kolay ve zor sorulara birbirine yakın süreler ayırdın.', 'Çocuğunuz kolay ve zor sorulara birbirine yakın süreler ayırdı.');
}

/** Saniyenin yüzde biri duyarlılığında süre çubukları (ortak eksende): tepki ve cevap süreleri. */
function msBarsVisual(label: string, rows: { label: string; ms: number }[]): BarsVisual {
  return { type: 'bars', label, scale: 'scale', unit: 'sn', rows: rows.map((x) => ({ label: x.label, value: Math.round(x.ms / 10) / 100, valueLabel: `${sn(x.ms)} sn` })) };
}

/** Yüzde çubukları (her biri 100 üzerinden): ör. iki durumdaki doğru cevap oranı. */
function pctBarsVisual(label: string, rows: { label: string; rate: number }[]): BarsVisual {
  return { type: 'bars', label, scale: 'share', rows: rows.map((x) => ({ label: x.label, value: Math.round(x.rate * 100), max: 100, valueLabel: pct(x.rate) })) };
}

/**
 * Düzeyli testlerde "Ulaşılan düzey" kartı (şekil, sayı, harf ve sözel akıl yürütme, kâğıt katlama, kelime bilgisi, küp
 * açınımı, gizli şekiller). Ulaşılan düzey: o düzeydeki ve daha kolay düzeylerdeki soruların en az %60'ı doğru olan en
 * yüksek düzey. Kart; ulaşılan düzeye kadarki soruların ne kadarının doğru olduğunu (hepsi, hemen hepsi, çoğu), o düzeyde
 * neyin gerektiğini, bir üst düzeyde kaç sorunun doğru bulunamadığını ve ölçütü anlatır. Daha kolay düzeylerdeki
 * yanlışların olası nedeni burada değil, "Doğru cevaplar" kartında söylenir (iki kartta yinelenmez).
 */
function reachedLevelBlock(o: {
  base: { key: string; name: string; plain: string };
  v: (student: string, parent: string) => string;
  levels: { level: number; n: number; correct: number }[];
  reached: number;
  plans: { level: number; plain: string }[];
  /** Sonuç yorumlanmıyorsa kartın metni (ör. doğru cevaplar rastgele seçim düzeyinde). */
  noInterpret?: string | null;
  /** Hiçbir düzeye ulaşılamadığında olası nedenler (öğrenci, veli); boşlukla başlar. */
  zeroCause: [string, string];
  /** 3. düzey ve üstünde çok hızlı yanlış cevaplar: bir üst düzeyin sonucu yorumlanmaz. */
  rapid: boolean;
  /** Çalışma biçimi kartında anlatılan bir kuşku (çok hızlı cevaplar, hep aynı yer ya da aynı cevap). */
  doubt: boolean;
  /** Düzeylerin anlatımında birden çok iş sayılıyorsa "şunlar gerekiyordu". */
  plural?: boolean;
}): CognitiveBlock {
  const { v } = o;
  const pass = Math.round(MATRIX_LEVEL_PASS * 100);
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const lower = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1).replace(/\.$/, '');
  const need = o.plural ? 'şunlar' : 'şu';
  const rule = `Bir düzeye ulaşmak için o düzeydeki ve daha kolay düzeylerdeki soruların en az %${pass}’ını doğru bulmak gerekir`;
  if (o.noInterpret) return { ...o.base, headline: 'Yorumlanmadı', text: o.noInterpret };
  const first = o.levels[0];
  if (o.reached === 0) {
    const high = o.levels.filter((l) => l.level > 1 && passed(l));
    const highShare = high.every((l) => l.correct === l.n) ? 'hepsini' : 'çoğunu';
    const highNames = joinTr(high.map((l) => `${l.level}.`));
    const found = first.correct === 0 ? 'hiçbirini doğru bulama' : `${first.correct === 1 ? 'birini' : `${first.correct} tanesini`} doğru bul`;
    return {
      ...o.base,
      headline: 'Düzey belirtilmedi',
      text:
        v(`En kolay düzeydeki ${first.n} sorunun ${found}${first.correct === 0 ? 'dın' : 'dun'}.`, `Çocuğunuz en kolay düzeydeki ${first.n} sorunun ${found}${first.correct === 0 ? 'dı' : 'du'}.`) +
        ` ${rule}; hiçbir düzeyde buna ulaşılmadığı için düzey belirtilmedi.` +
        (high.length
          ? v(
              ` ${highNames} düzeydeki soruların ${highShare} doğru bulmana rağmen, kolay düzeylerdeki yanlışlar yüzünden bu ölçüte ulaşılmadı.`,
              ` Çocuğunuz ${highNames} düzeydeki soruların ${highShare} doğru bulmasına rağmen, kolay düzeylerdeki yanlışlar yüzünden bu ölçüte ulaşılmadı.`,
            )
          : '') +
        v(o.zeroCause[0], o.zeroCause[1]),
    };
  }
  const def = o.plans.find((l) => l.level === o.reached)!;
  const next = o.plans.find((l) => l.level === o.reached + 1);
  const upLevels = o.levels.filter((l) => l.level <= o.reached);
  const share = upLevels.every((l) => l.correct === l.n) ? 'hepsini' : upLevels.every((l) => l.n - l.correct <= 1) ? 'hemen hepsini' : 'çoğunu';
  const range = o.reached === 1 ? '1. düzeydeki' : `1–${o.reached}. düzeylerdeki`;
  let text =
    v(`${range} soruların ${share} doğru cevapladın.`, `Çocuğunuz ${range} soruların ${share} doğru cevapladı.`) +
    ` ${o.reached}. düzeydeki sorularda ${need} gerekiyordu: ${lower(def.plain)}.`;
  const slips = o.levels.filter((l) => l.level < o.reached && !passed(l)).map((l) => `${l.level}.`);
  if (slips.length) {
    text += v(
      ` Daha kolay olan ${joinTr(slips)} düzeydeki yanlışların bu sonucu değiştirmedi.`,
      ` Çocuğunuzun daha kolay olan ${joinTr(slips)} düzeydeki yanlışları bu sonucu değiştirmedi.`,
    );
  }
  const nextRes = next ? o.levels.find((l) => l.level === next.level) : undefined;
  let hedged = false;
  if (!next || !nextRes) {
    text += ` ${o.reached}. düzey testin en zor düzeyiydi.`;
  } else if (o.rapid && next.level >= 3) {
    hedged = true;
    const rest = next.level === o.levels[o.levels.length - 1].level ? `${next.level}. düzeydeki sonuç` : `${next.level}. düzey ve üstündeki sonuç`;
    text += v(
      ` 3. düzey ve üstündeki sorulardan bazılarında çok hızlı cevap verdiğin için ${rest} yorumlanmadı.`,
      ` Çocuğunuz 3. düzey ve üstündeki sorulardan bazılarında çok hızlı cevap verdiği için ${rest} yorumlanmadı.`,
    );
  } else {
    // Bir üst düzeyde soruların en az %40'ı her zaman yanlıştır: o düzeyde en az %60 doğru olsaydı o düzeye de ulaşılırdı.
    const wrong = nextRes.n - nextRes.correct;
    const miss = wrong === nextRes.n ? 'hiçbirini' : wrong === 1 ? 'birini' : `${wrong} tanesini`;
    text +=
      v(` ${next.level}. düzeydeki ${nextRes.n} sorunun ${miss} doğru bulamadın.`, ` Çocuğunuz ${next.level}. düzeydeki ${nextRes.n} sorunun ${miss} doğru bulamadı.`) +
      ` Bu düzeydeki sorularda ${need} gerekiyordu: ${lower(next.plain)}.`;
  }
  if (o.doubt && !hedged) {
    text += v(' Çalışma biçimi kartında anlatılan nedenle bu sonuç da dikkatle okunmalı.', ' Çalışma biçimi kartında anlatılan nedenle bu sonuç da dikkatle okunmalıdır.');
  }
  return { ...o.base, headline: `${o.reached}. düzey`, text: `${text} ${rule}.` };
}

/**
 * Düzeyli testlerde "Doğru cevaplar" kartının ana cümlesi (sonuç rastgele seçim düzeyinde değilken): hepsi doğru, hemen
 * hepsi doğru, en kolay düzeyde yanlış ama üst düzeylerde doğru, sorular zorlaştıkça azalma, zor düzeylerde daha çok doğru,
 * kolay ve zor düzeyler yakın. Kolay sorulardaki yanlışlar yalnızca bir kartta dikkate ya da aceleye bağlanır: hiçbir düzeye
 * ulaşılmadıysa "Ulaşılan düzey" kartında (`blameInLevel`), yoksa burada.
 */
function levelAccText(o: {
  v: (student: string, parent: string) => string;
  levels: { level: number; n: number; correct: number }[];
  n: number;
  correct: number;
  /** "Bütün soruları doğru cevapladın; …" cümlesinin devamı (öğrenci, veli). */
  allTail: [string, string];
  /** "Sorular zorlaştıkça doğru cevapların azaldı." cümlesinden sonra gelen açıklama (öğrenci, veli). */
  dropWhy: [string, string];
  /** Zor düzeylerin başladığı düzey (beş düzeyli testte 4, dört düzeyli testte 3). */
  hardFrom: number;
  /** Kolay sorulardaki yanlışlar dikkate ya da aceleye bağlanabilir (yanılgı ya da çalışma biçiminde kuşku yok). */
  blame: boolean;
  /** Bu açıklamayı "Ulaşılan düzey" kartı yapıyor. */
  blameInLevel: boolean;
  doubt: boolean;
}): string {
  const { v } = o;
  const rate = (ls: typeof o.levels) => ls.reduce((a, l) => a + l.correct, 0) / Math.max(1, ls.reduce((a, l) => a + l.n, 0));
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const blameEasy = v(
    ' kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.',
    ' kolay sorulardaki yanlışlar çocuğunuzun dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.',
  );
  const first = o.levels[0];
  if (o.correct === o.n) return v(`Bütün soruları doğru cevapladın; ${o.allTail[0]}.`, `Çocuğunuz bütün soruları doğru cevapladı; ${o.allTail[1]}.`);
  if (o.levels.every((l) => l.n - l.correct <= 1)) {
    // allTail kullanılmaz: tek bir türdeki yanlışlar (ör. yalnızca çıkarım soruları) "en zor soruları da çözebildin" cümlesiyle çelişir.
    return v(
      'Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor düzeydeki soruların da çoğunu doğru buldun.',
      'Çocuğunuz bütün düzeylerde soruların hemen hepsini doğru cevapladı; en zor düzeydeki soruların da çoğunu doğru buldu.',
    );
  }
  const easyMissed = first.n - first.correct;
  const higher = o.levels.slice(1);
  const higherRate = rate(higher);
  if (easyMissed >= 2 && higher.some((l) => passed(l) && l.correct > first.correct)) {
    const which = easyMissed === first.n ? '1. düzeydeki kolay soruların hiçbirini' : `1. düzeydeki kolay sorulardan ${easyMissed} tanesini`;
    const share = higherRate === 1 ? 'hepsini' : higherRate > 0.5 ? 'çoğunu' : 'bir kısmını';
    const why = o.blame && !o.blameInLevel;
    return v(
      `${capTr(which)} doğru cevaplamadın ama daha zor düzeylerdeki soruların ${share} doğru buldun.${why ? ' Bu, testin başında dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.' : ''}`,
      `Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların ${share} doğru buldu.${why ? ' Bu, testin başında çocuğunuzun dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.' : ''}`,
    );
  }
  const easyLevels = o.levels.filter((l) => l.level <= 2);
  const hardRate = rate(o.levels.filter((l) => l.level >= o.hardFrom));
  const gap = rate(easyLevels) - hardRate;
  if (gap >= 0.15) {
    return v(
      `Sorular zorlaştıkça doğru cevapların azaldı.${o.doubt ? '' : ` ${o.dropWhy[0]}`}`,
      `Sorular zorlaştıkça çocuğunuzun doğru cevapları azaldı.${o.doubt ? '' : ` ${o.dropWhy[1]}`}`,
    );
  }
  if (gap <= -0.15) {
    return v(
      `Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin${o.blame && !o.blameInLevel ? `;${blameEasy}` : '.'}`,
      `Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${o.blame && !o.blameInLevel ? `;${blameEasy}` : '.'}`,
    );
  }
  const slip = o.blame && !o.blameInLevel && hardRate >= MATRIX_LEVEL_PASS && easyLevels.some((l) => l.correct < l.n) ? ` ${capTr(blameEasy.trim())}` : '';
  return v(
    `Kolay ve zor düzeylerdeki doğru cevap oranların birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
    `Çocuğunuzun kolay ve zor düzeylerdeki doğru cevap oranları birbirine yakındı; genellikle sorular zorlaştıkça doğru cevaplar azalır.${slip}`,
  );
}

/**
 * Düzeyli testlerde doğru cevaplar rastgele seçim düzeyindeyken "Doğru cevaplar" kartı. Olası nedenler raporun başındaki
 * dikkat notunda yazdığı için burada yinelenmez.
 */
function levelChanceText(v: (student: string, parent: string) => string, n: number, max: number): string {
  return v(
    `Doğru cevapların, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${n} soruda ${max} ya da daha az); bu yüzden sonuç yorumlanmadı. Sorular sana çok zor gelmiş olabilir. İyi dinlendiğin bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
    `Çocuğunuzun doğru cevapları, seçeneklerden rastgele seçen birinin de bulabileceği kadar az (${n} soruda ${max} ya da daha az); bu yüzden sonuç yorumlanmadı. Sorular ona çok zor gelmiş olabilir. İyi dinlendiği bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
  );
}

/** Çok hızlı yanlış cevap uyarısı varsa "Çalışma biçimi" kartının son cümlesi; yoksa süre sınırı olmadığını söyleyen cümle. */
function noLimitText(v: (student: string, parent: string) => string, rapid: boolean): string {
  return rapid
    ? v(' Bu testte süre sınırı yoktu; her soruya acele etmeden bakmak daha doğru bir sonuç verebilir.', ' Bu testte süre sınırı yoktu; çocuğunuzun her soruya acele etmeden bakması daha doğru bir sonuç verebilir.')
    : v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
}

/** Sonuç yorumlanmadığında (rastgele seçim düzeyi, çoğunlukla "Bilmiyorum") kolay ve zor sorulardaki süreler karşılaştırılmaz. */
const PACE_SKIPPED: [string, string] = [
  'Sonuç yorumlanmadığı için kolay ve zor sorulara ayırdığın süreler karşılaştırılmadı.',
  'Sonuç yorumlanmadığı için çocuğunuzun kolay ve zor sorulara ayırdığı süreler karşılaştırılmadı.',
];

/** Hiçbir düzeye ulaşılamadığında genel olası nedenler (öğrenci, veli). */
const ZERO_CAUSE: [string, string] = [
  ' Bu; dikkatinin dağılmasından, acele etmekten ya da yönergeyi tam anlamamaktan kaynaklanabilir.',
  ' Bu; çocuğunuzun dikkatinin dağılmasından, acele etmesinden ya da yönergeyi tam anlamamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.',
];
/** Hiçbir düzeye ulaşılamadığında: çalışma biçimi kartındaki kuşku (çok hızlı cevaplar, hep aynı yer ya da aynı cevap). */
const ZERO_DOUBT: [string, string] = [
  ' Çalışma biçimi kartında anlatılan nedenle bu sonuç tek başına bir şey söylemez.',
  ' Çalışma biçimi kartında anlatılan nedenle bu sonuç tek başına yorumlanmamalıdır.',
];

/** Düzeylere göre doğru cevaplar: her düzey bir satır kare (dolu kare: doğru cevap). */
function levelDotsVisual(levels: { level: number; correct: number; n: number }[], skip = false): DotsVisual {
  return {
    type: 'dots',
    label: 'Düzeylere göre doğru cevaplar',
    rows: levels.map((l) => ({ label: `${l.level}. düzey`, filled: l.correct, total: l.n, valueLabel: `${l.correct}/${l.n}` })),
    legend: ['doğru', skip ? 'yanlış ya da “Bilmiyorum”' : 'yanlış'],
  };
}

/** Ulaşılan düzey: kolaydan zora basamaklar; ulaşılan basamağa kadar dolu. `reached` null: düzey yorumlanmadı. */
function levelStepsVisual(nLevels: number, reached: number | null): StepsVisual {
  return {
    type: 'steps',
    label: 'Ulaşılan düzey',
    steps: Array.from({ length: nLevels }, (_, i) => `${i + 1}.`),
    reached: reached ?? 0,
    valueLabel: reached === null ? 'Yorumlanmadı' : reached === 0 ? 'Düzey belirtilmedi' : `${reached}. düzey`,
    caption: 'Düzeyler, kolaydan zora',
  };
}

/** Türlere göre doğru cevaplar: her çubuk kendi türündeki soru sayısına göre dolar. */
function typeBarsVisual(label: string, rows: { name: string; correct: number; n: number }[]): BarsVisual {
  return { type: 'bars', label, scale: 'share', rows: rows.map((x) => ({ label: x.name, value: x.correct, max: x.n, valueLabel: `${x.correct}/${x.n}` })) };
}

/**
 * Karşılaştırılacak ikinci bir süre yokken "Çalışma biçimi" kartının grafiği: her sorunun cevap süresi bir nokta, tipik süre
 * (ortanca) dikey çizgi. Tek bir çubuk bilgi taşımaz; şerit, sürelerin sorudan soruya ne kadar değiştiğini de gösterir.
 */
function timeStrip(rts: number[], median: number, item: 'soru' | 'desen' = 'soru'): StripVisual {
  return durationStrip({
    label: item === 'soru' ? 'Sorulardaki cevap süreleri' : 'Desenlerdeki işaretleme süreleri',
    rts,
    median,
    marker: `Tipik ${secShort(median)}`,
    item: `bir ${item}`,
  });
}

/**
 * Süre şeridi: her ölçüm (soru, doğru cevap, problem) bir nokta, tipik süre (ortanca) dikey çizgi. `digits`: noktaların
 * saniyedeki ondalık basamağı (tepki sürelerinde 2). Kartın başlığındaki süre işaretin adında yazar.
 */
function durationStrip(o: { label: string; rts: number[]; median: number; marker: string; item: string; digits?: 1 | 2 }): StripVisual {
  const f = o.digits === 2 ? 100 : 10;
  const points = o.rts.map((ms) => Math.round((ms / 1000) * f) / f);
  return {
    type: 'strip',
    label: o.label,
    min: 0,
    // Eksen en uzun sürenin biraz üstünde biter: en uzun sürenin noktası eksenin ucuna yapışmaz.
    max: niceMax(Math.max(o.digits === 2 ? 0.5 : 1, ...points) * 1.1),
    unit: 'sn',
    points,
    marker: { value: Math.round((o.median / 1000) * f) / f, label: o.marker },
    caption: `Her nokta ${o.item}; çizgi tipik süre`,
  };
}

/**
 * Çalışma biçimi: kolay ve zor sorulardaki süreler karşılaştırılabiliyorsa bütün sorulardaki, kolay ve zor sorulardaki tipik
 * cevap süresi (ortak eksende, saniye); karşılaştırılamıyorsa her sorunun süresi (timeStrip).
 */
function paceVisual(
  median: number,
  rts: number[],
  easy: { label: string; ms: number | null },
  hard: { label: string; ms: number | null },
): BarsVisual | StripVisual {
  if (easy.ms === null || hard.ms === null) return timeStrip(rts, median);
  const rows = [
    { label: 'Bütün sorular', value: secValue(median), valueLabel: secShort(median) },
    { label: `Kolay sorular (${easy.label})`, value: secValue(easy.ms), valueLabel: secShort(easy.ms) },
    { label: `Zor sorular (${hard.label})`, value: secValue(hard.ms), valueLabel: secShort(hard.ms) },
  ];
  return { type: 'bars', label: 'Soru başına tipik süre', scale: 'scale', unit: 'sn', rows };
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
  const chance = matrixChance(r);
  const rapid = matrixRapid(r);
  const samePos = matrixSamePosition(r);
  const doubt = rapid || samePos;
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);

  /* Doğru cevaplar */
  let accText: string;
  if (chance) {
    accText = levelChanceText(v, r.n, MATRIX_CHANCE_MAX);
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['en zor sorulardaki birden çok kuralı da birlikte izleyebildin', 'en zor sorulardaki birden çok kuralı da birlikte izleyebildi'],
      dropWhy: [
        'Bu beklenen bir durumdur: her düzeyde aynı anda izlenmesi gereken kural sayısı artar ve kurallar zorlaşır.',
        'Bu beklenen bir durumdur: her düzeyde aynı anda izlenmesi gereken kural sayısı artar ve kurallar zorlaşır (Carpenter, Just ve Shell, 1990).',
      ],
      hardFrom: 4,
      blame: !doubt,
      blameInLevel: r.reached === 0,
      doubt,
    });
    if (r.wrong >= MATRIX_NEAR_MIN && r.nearMisses / r.wrong >= MATRIX_NEAR_SHARE) {
      accText += v(
        ` Yanlış cevaplarının ${r.nearMisses === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.nearMisses} tanesinde)`} seçtiğin parça doğru cevaptan yalnızca bir özellikte ayrılıyordu: kuralların çoğunu bulup birini gözden kaçırmış olabilirsin. Cevabı vermeden önce şekli, sayıyı, rengi ve yönü tek tek kontrol etmek işine yarar.`,
        ` Çocuğunuzun yanlış cevaplarının ${r.nearMisses === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.nearMisses} tanesinde)`} seçtiği parça doğru cevaptan yalnızca bir özellikte ayrılıyordu: kuralların çoğunu bulup birini gözden kaçırmış olabilir. Bu tür sorularda birden çok kuralı aynı anda akılda tutmak gerekir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorulara bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı sorulara bakmadan seçmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('sa_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const duzey = reachedLevelBlock({
    base: card('sa_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: chance ? 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' : null,
    zeroCause: doubt ? ZERO_DOUBT : ZERO_CAUSE,
    rapid: rapid,
    doubt,
  });

  /* Kural türleri */
  // Kural türlerinde kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  // Kural türleri düzeylerle iç içedir (ör. değişmeyen özellik en kolay, ortak olanı silme en zor düzeylerde); bu söylenir.
  const levelsOf = (rule: MatrixRule) => [...new Set(task.items.filter((it) => it.rule === rule).map((it) => it.level))].sort((a, b) => a - b);
  // Bütün soruları ulaşılan düzeyin altında kalan türdeki yanlışlar o kolay düzeylerdeki yanlışlardır: "zorlandın" denmez.
  const slipOnly = (rule: MatrixRule) => r.reached > 0 && levelsOf(rule).every((l) => l < r.reached);
  const good = r.rules.filter(most).map((x) => x.rule);
  const hard = r.rules.filter((x) => !most(x) && !slipOnly(x.rule)).map((x) => x.rule);
  const slipRules = r.rules.filter((x) => !most(x) && slipOnly(x.rule)).map((x) => x.rule);
  const where = (rule: MatrixRule) => {
    const ls = levelsOf(rule);
    return ls.length === 1 ? `yalnızca ${ls[0]}. düzeyde` : `${joinTr(ls.map((l) => `${l}.`))} düzeylerde`;
  };
  const rough = ` Her türde yalnızca birkaç soru vardı ve bazı türler yalnızca kolay, bazıları yalnızca zor düzeylerde soruldu (ör. ${ruleList(['constant'])} soruları ${where('constant')}, ${ruleList(['xor'])} soruları ${where('xor')}). Bu yüzden türler arasındaki fark yalnızca yaklaşık bir fikir verir.`;
  let kural: CognitiveBlock;
  if (chance) {
    kural = { ...card('sa_kural'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için kural türleri karşılaştırılmadı.' };
  } else {
    const all = r.rules.every((x) => x.correct === x.n);
    const head = all
      ? `${r.rules.length} kural türünün hepsinde bütün sorular doğru`
      : good.length === r.rules.length
        ? `${r.rules.length} kural türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.rules.length} kural türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.rules.length} kural türünün ${good.length === 1 ? 'birinde' : `${good.length} tanesinde`} soruların çoğu doğru`;
    // Zorlanılan türlerde ne gerektiği en çok iki tür için yazılır (uzun bir liste okunmaz).
    const needs = hard.length > 2 ? '' : hard.map((x) => capTr(`${ruleList([x])} kuralında ${MATRIX_RULES[x].plain} gerekir.`)).join(' ');
    let text: string;
    if (all) {
      text = v(
        `${r.rules.length} kural türünün her birinde bütün soruları doğru buldun: hem satır boyunca aynı kalan ya da düzenli değişen özellikleri hem de parçaları birleştirme ve karşılaştırma gerektiren kuralları izleyebildin.`,
        `Çocuğunuz ${r.rules.length} kural türünün her birinde bütün soruları doğru buldu: hem satır boyunca aynı kalan ya da düzenli değişen özellikleri hem de parçaları birleştirme ve karşılaştırma gerektiren kuralları izleyebildi.`,
      );
    } else if (good.length === r.rules.length) {
      text = v(
        `${r.rules.length} kural türünün her birinde soruların çoğunu doğru buldun: hem satır boyunca aynı kalan ya da düzenli değişen özellikleri hem de parçaları birleştirme ve karşılaştırma gerektiren kuralları izleyebildin.`,
        `Çocuğunuz ${r.rules.length} kural türünün her birinde soruların çoğunu doğru buldu: hem satır boyunca aynı kalan ya da düzenli değişen özellikleri hem de parçaları birleştirme ve karşılaştırma gerektiren kuralları izleyebildi.`,
      );
    } else if (good.length === 0) {
      const best = [...r.rules].sort((a, b) => b.correct / b.n - a.correct / a.n)[0];
      text = v(
        `Hiçbir kural türünde soruların çoğunu doğru bulamadın; en çok doğru cevabı ${ruleList([best.rule])} kuralında verdin.`,
        `Çocuğunuz hiçbir kural türünde soruların çoğunu doğru bulamadı; en çok doğru cevabı ${ruleList([best.rule])} kuralında verdi.`,
      );
    } else {
      text = v(
        `${ruleList(good)} ${good.length > 1 ? 'kurallarına' : 'kuralına'} dayanan soruların çoğunu doğru buldun${hard.length ? `; ${ruleList(hard)} ${hard.length > 1 ? 'kurallarında' : 'kuralında'} zorlandın` : ''}. ${needs}`,
        `Çocuğunuz ${ruleList(good)} ${good.length > 1 ? 'kurallarına' : 'kuralına'} dayanan soruların çoğunu doğru buldu${hard.length ? `; ${ruleList(hard)} ${hard.length > 1 ? 'kurallarında' : 'kuralında'} zorlandı` : ''}. ${needs}`,
      );
      if (hard.includes('addition') || hard.includes('xor')) {
        text += v(' Parçaları birleştirme ve karşılaştırma gerektiren kurallar, bu testteki en zor kurallar arasındadır.', ' Parçaları birleştirme ve karşılaştırma gerektiren kurallar, bu testteki en zor kurallar arasındadır (Matzen ve ark., 2010).');
      }
    }
    if (slipRules.length) {
      text += v(
        ` ${capTr(ruleList(slipRules))} ${slipRules.length > 1 ? 'kurallarındaki' : 'kuralındaki'} yanlışlarının hepsi daha kolay düzeylerdeydi; daha zor kuralları bulabildiğin için bu yanlışlar kuralı bilmemekten çok dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        ` Çocuğunuzun ${ruleList(slipRules)} ${slipRules.length > 1 ? 'kurallarındaki' : 'kuralındaki'} yanlışlarının hepsi daha kolay düzeylerdeydi; daha zor kuralları bulabildiği için bu yanlışlar kuralı bilmemekten çok dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.`,
      );
    }
    kural = { ...card('sa_kural'), headline: head, text: capTr(text.replace(/\s+$/, '').replace(/ {2,}/g, ' ')) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`} 2,5 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede bir tabloyu inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`} 2,5 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede bir tabloyu inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !chance && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('sa_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = chance ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('sa_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
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
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels);
  if (!chance) duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!chance) kural.visual = typeBarsVisual('Kural türlerine göre doğru cevaplar', r.rules.map((x) => ({ name: MATRIX_RULES[x.rule].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '4–5. düzey', ms: comparePace ? r.rtHard : null });
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
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  /** "hepsinde", "yarısında (6 yanlışın 3 tanesinde)" ya da "çoğunda (6 yanlışın 4 tanesinde)". */
  const share = (k: number, of: number) =>
    k === of ? 'hepsinde' : `${k * 2 === of ? 'yarısında' : 'çoğunda'} (${of} yanlışın ${k} tanesinde)`;

  /* Doğru cevaplar */
  let accText: string;
  const answeredN = r.n - r.skipped;
  if (few) {
    const how =
      r.correct === 0
        ? v(`${r.n} sorunun hiçbirinde eksik sayıyı doğru bulamadın.`, `Çocuğunuz ${r.n} sorunun hiçbirinde eksik sayıyı doğru bulamadı.`)
        : v(`${r.n} sorudan yalnızca ${r.correct === 1 ? 'birinde' : `${r.correct} tanesinde`} eksik sayıyı doğru buldun.`, `Çocuğunuz ${r.n} sorudan yalnızca ${r.correct === 1 ? 'birinde' : `${r.correct} tanesinde`} eksik sayıyı doğru buldu.`);
    const why = skippedMost
      ? v(
          ` ${r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda'} “Bilmiyorum” dedin: sorular sana çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilirsin.`,
          ` ${r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda'} “Bilmiyorum” dedi: sorular ona çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilir.`,
        )
      : v(' Sorular sana çok zor gelmiş olabilir.', ' Sorular ona çok zor gelmiş olabilir.');
    accText =
      how +
      why +
      v(
        ' Bu sonuç tek başına bir şey söylemez; iyi dinlendiğin bir gün, yanında kâğıt ve kalemle, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.',
        ' Bu sonuç tek başına yorumlanmamalıdır; iyi dinlendiği bir gün, yanında kâğıt ve kalemle, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.',
      );
  } else if (skippedMost) {
    // Soruların çoğunda "Bilmiyorum" denmişse sonuç yorumlanmaz: düzeylere göre değişim anlatılmaz.
    accText = v(
      `${r.n} sorunun ${r.skipped} tanesinde “Bilmiyorum” dedin. Cevap verdiğin ${answeredN} sorunun ${r.correct === answeredN ? 'hepsi' : `${r.correct} tanesi`} doğruydu. Sorular sana çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilirsin; bu yüzden sonuç tek başına yorumlanmamalıdır.`,
      `Çocuğunuz ${r.n} sorunun ${r.skipped} tanesinde “Bilmiyorum” dedi. Cevap verdiği ${answeredN} sorunun ${r.correct === answeredN ? 'hepsi' : `${r.correct} tanesi`} doğruydu. Sorular ona çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilir; bu yüzden sonuç tek başına yorumlanmamalıdır.`,
    );
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['en zor sorulardaki birkaç adımlı kuralları da bulabildin', 'en zor sorulardaki birkaç adımlı kuralları da bulabildi'],
      dropWhy: ['Bu beklenen bir durumdur: üst düzeylerde kurallar zorlaşır ve izlenmesi gereken adım sayısı artar.', 'Bu beklenen bir durumdur: üst düzeylerde kurallar zorlaşır ve izlenmesi gereken adım sayısı artar.'],
      hardFrom: 4,
      blame: !doubt,
      blameInLevel: r.reached === 0,
      doubt,
    });
    // Yanlışların türü: dizinin yalnızca bir bölümüne uyan daha basit bir kural ya da doğru cevaba çok yakın bir cevap.
    if (r.wrong >= NUMBER_PATTERN_MIN && r.traps * 2 >= r.wrong) {
      accText += v(
        ` Yanlış cevaplarının ${share(r.traps, r.wrong)} daha basit bir kurala göre bir sayı yazdın. Bu kural dizinin yalnızca bir bölümüne uyuyordu: örneğin artışlar büyürken son artışı aynen eklemek ya da “iki katının bir fazlası” yerine yalnızca iki katını almak. Cevabı yazmadan önce bulduğun kuralı dizinin bütün sayılarında dene.`,
        ` Çocuğunuz yanlış cevaplarının ${share(r.traps, r.wrong)} daha basit bir kurala göre bir sayı yazdı. Bu kural dizinin yalnızca bir bölümüne uyuyordu: örneğin artışlar büyürken son artışı aynen eklemek ya da “iki katının bir fazlası” yerine yalnızca iki katını almak. Bulduğu kuralı dizinin bütün sayılarında denemeden cevap vermiş olabilir.`,
      );
    }
    if (r.wrong >= NUMBER_PATTERN_MIN && r.nearMisses * 2 >= r.wrong) {
      accText += v(
        ` Yanlış cevaplarının ${share(r.nearMisses, r.wrong)} yazdığın sayı doğru cevaba çok yakındı: kuralı bulup hesapta küçük bir kayma yapmış olabilirsin. Cevabı vermeden önce hesabı bir kez daha kontrol etmek işine yarar.`,
        ` Çocuğunuzun yanlış cevaplarının ${share(r.nearMisses, r.wrong)} yazdığı sayı doğru cevaba çok yakındı: kuralı bulup hesapta küçük bir kayma yapmış olabilir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorulara bakmadan cevap yazmış olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı sorulara bakmadan cevap yazmış olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('sd_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const skipCause: [string, string] = [
    ` ${r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda'} “Bilmiyorum” dediğin için bu sonuç tek başına yorumlanmamalıdır.`,
    ` Çocuğunuz ${r.skipped === r.n ? 'bütün sorularda' : 'soruların çoğunda'} “Bilmiyorum” dediği için bu sonuç tek başına yorumlanmamalıdır.`,
  ];
  const duzey = reachedLevelBlock({
    base: card('sd_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: null,
    zeroCause: skippedMost ? skipCause : doubt ? ZERO_DOUBT : [ZERO_CAUSE[0], ' Bu; çocuğunuzun dikkatinin dağılmasından, acele etmesinden, yönergeyi tam anlamamasından ya da toplama ve çıkarmada henüz yeterince rahat olmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'],
    rapid: rapid,
    doubt,
  });

  /* Kural türleri */
  // Kural türlerinde kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  // Kural türleri düzeylerle iç içedir; bu söylenir.
  const levelsOf = (rule: NumberSeriesRule) => [...new Set(task.items.filter((it) => it.rule === rule).map((it) => it.level))].sort((a, b) => a - b);
  // Bütün soruları ulaşılan düzeyin altında kalan türdeki yanlışlar o kolay düzeylerdeki yanlışlardır: "zorlandın" denmez.
  const slipOnly = (rule: NumberSeriesRule) => r.reached > 0 && levelsOf(rule).every((l) => l < r.reached);
  const good = r.rules.filter(most).map((x) => x.rule);
  const hard = r.rules.filter((x) => !most(x) && !slipOnly(x.rule)).map((x) => x.rule);
  const slipRules = r.rules.filter((x) => !most(x) && slipOnly(x.rule)).map((x) => x.rule);
  const where = (rule: NumberSeriesRule) => {
    const ls = levelsOf(rule);
    return ls.length === 1 ? `yalnızca ${ls[0]}. düzeyde` : `${joinTr(ls.map((l) => `${l}.`))} düzeylerde`;
  };
  const rough = ` Her türde yalnızca birkaç soru vardı ve bazı türler yalnızca kolay, bazıları yalnızca zor düzeylerde soruldu (ör. ${numberRuleList(['step'])} soruları ${where('step')}, ${numberRuleList(['combined'])} soruları ${where('combined')}). Bu yüzden türler arasındaki fark yalnızca yaklaşık bir fikir verir.`;
  let kural: CognitiveBlock;
  if (few || skippedMost) {
    kural = {
      ...card('sd_kural'),
      headline: 'Yorumlanmadı',
      text: few
        ? 'Doğru cevaplar çok az olduğu için kural türleri karşılaştırılmadı.'
        : v('Soruların çoğunda “Bilmiyorum” dediğin için kural türleri karşılaştırılmadı.', 'Çocuğunuz soruların çoğunda “Bilmiyorum” dediği için kural türleri karşılaştırılmadı.'),
    };
  } else {
    const all = r.rules.every((x) => x.correct === x.n);
    const head = all
      ? `${r.rules.length} kural türünün hepsinde bütün sorular doğru`
      : good.length === r.rules.length
        ? `${r.rules.length} kural türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.rules.length} kural türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.rules.length} kural türünün ${good.length === 1 ? 'birinde' : `${good.length} tanesinde`} soruların çoğu doğru`;
    // Zorlanılan türlerde ne gerektiği en çok iki tür için yazılır (uzun bir liste okunmaz).
    const needs = hard.length > 2 ? '' : hard.map((x) => capTr(`${numberRuleList([x])} türünde ${NUMBER_RULES[x].plain} gerekir.`)).join(' ');
    let text: string;
    if (all || good.length === r.rules.length) {
      const q = all ? 'bütün soruları' : 'soruların çoğunu';
      text = v(
        `${r.rules.length} kural türünün her birinde ${q} doğru buldun: hem tek bir işlemle ilerleyen dizileri hem de iç içe dizileri ve birkaç adımlı kuralları çözebildin.`,
        `Çocuğunuz ${r.rules.length} kural türünün her birinde ${q} doğru buldu: hem tek bir işlemle ilerleyen dizileri hem de iç içe dizileri ve birkaç adımlı kuralları çözebildi.`,
      );
    } else if (good.length === 0) {
      const best = [...r.rules].sort((a, b) => b.correct / b.n - a.correct / a.n)[0];
      text = v(
        `Hiçbir kural türünde soruların çoğunu doğru bulamadın; en çok doğru cevabı ${numberRuleList([best.rule])} türünde verdin.`,
        `Çocuğunuz hiçbir kural türünde soruların çoğunu doğru bulamadı; en çok doğru cevabı ${numberRuleList([best.rule])} türünde verdi.`,
      );
    } else {
      text = v(
        `${numberRuleList(good)} türündeki soruların çoğunu doğru buldun${hard.length ? `; ${numberRuleList(hard)} türündeki sorularda zorlandın` : ''}. ${needs}`,
        `Çocuğunuz ${numberRuleList(good)} türündeki soruların çoğunu doğru buldu${hard.length ? `; ${numberRuleList(hard)} türündeki sorularda zorlandı` : ''}. ${needs}`,
      );
    }
    if (slipRules.length) {
      text += v(
        ` ${capTr(numberRuleList(slipRules))} türündeki yanlışlarının hepsi daha kolay düzeylerdeydi; daha zor kuralları bulabildiğin için bu yanlışlar kuralı bilmemekten çok dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        ` Çocuğunuzun ${numberRuleList(slipRules)} türündeki yanlışlarının hepsi daha kolay düzeylerdeydi; daha zor kuralları bulabildiği için bu yanlışlar kuralı bilmemekten çok dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.`,
      );
    }
    kural = { ...card('sd_kural'), headline: head, text: capTr(text.replace(/\s+$/, '').replace(/ {2,}/g, ' ')) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  const answered = r.n - r.skipped;
  if (r.skipped > 0) {
    const inWhich = r.skipped === r.n ? 'bütün sorularda' : `${r.skipped} soruda`;
    issues.push(v(`${capTr(inWhich)} “Bilmiyorum” dedin.`, `Çocuğunuz ${inWhich} “Bilmiyorum” dedi.`));
  }
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki sorulardan cevap yazdığın ${r.rapidOf} sorunun ${which} 2,5 saniyeden kısa sürede yanlış cevap yazdın. Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki sorulardan cevap yazdığı ${r.rapidOf} sorunun ${which} 2,5 saniyeden kısa sürede yanlış cevap yazdı. Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilir.`,
      ),
    );
  }
  if (same) {
    issues.push(
      v(
        `${r.sameAnswer === answered ? 'Bütün cevaplarında' : `Cevaplarının ${r.sameAnswer} tanesinde`} aynı sayıyı yazdın; sorulara bakmadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${r.sameAnswer === answered ? 'bütün cevaplarında' : `cevaplarının ${r.sameAnswer} tanesinde`} aynı sayıyı yazdı; sorulara bakmadan cevap vermiş olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !few && !skippedMost && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('sd_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = few || skippedMost ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    // "Bilmiyorum" denen sorular da süreye girer; çoğunlukla "Bilmiyorum" denmişse bu söylenir.
    const base = skippedMost
      ? v(`Bir soruda tipik olarak ${seconds(r.medianRt)} kaldın; bu süreye “Bilmiyorum” dediğin sorular da girer.`, `Çocuğunuz bir soruda tipik olarak ${seconds(r.medianRt)} kaldı; bu süreye “Bilmiyorum” dediği sorular da girer.`)
      : v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('sd_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
      ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
      : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  // Kural türleri kartı yorumlanmıyorsa (çok az doğru ya da çoğunda "Bilmiyorum") türlerin üç boyutlu grafiği de çizilmez.
  const profile: CognitiveReport['profile'] = few || skippedMost
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
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels, true);
  duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!few && !skippedMost) kural.visual = typeBarsVisual('Kural türlerine göre doğru cevaplar', r.rules.map((x) => ({ name: NUMBER_RULES[x.rule].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '4–5. düzey', ms: comparePace ? r.rtHard : null });
  return { blocks: [dogru, duzey, kural, calisma], chart, figures, ...(profile ? { profile } : {}) };
}

/* ---------- Harf dizileri ---------- */

/** Harf dizilerinde kural türlerinin adları (raporda ve üç boyutlu grafikte) ve kısa anlatımları. */
export const LETTER_RULES: Record<LetterSeriesRule, { name: string; plain: string; color: string }> = {
  next: { name: 'Sabit adım', plain: 'her adımda alfabede aynı sayıda harf ileri ya da geri gidildiğini görmek', color: '#0e9c8c' },
  repeat: { name: 'Tekrar eden harfler', plain: 'bir harfin dizide düzenli aralıklarla yinelendiğini ya da harflerin ikişer kez yazıldığını görmek', color: '#2f5ce0' },
  interleaved: { name: 'İç içe diziler', plain: 'sırayla gelen iki ayrı diziyi birbirinden ayırıp her birinin kuralını bulmak', color: '#ee6a36' },
  group: { name: 'Harf grupları', plain: 'dizinin iki, üç ya da dört harflik gruplardan oluştuğunu ve grupların birbirine göre nasıl değiştiğini görmek', color: '#7a4ee6' },
  growing: { name: 'Değişen adım', plain: 'atlanan harf sayısının her adımda düzenli olarak büyüdüğünü görmek', color: '#df4777' },
};

/** Doğru cevap bu kadar ya da daha azsa kural türleri karşılaştırılmaz ve üç boyutlu grafik çizilmez. */
export const LETTER_FEW_MAX = 2;

const letterRuleList = (rules: LetterSeriesRule[]) =>
  joinTr(rules.map((r) => `“${LETTER_RULES[r].name.charAt(0).toLocaleLowerCase('tr-TR')}${LETTER_RULES[r].name.slice(1)}”`));

/**
 * Harf dizilerinin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve kural türlerinin üç boyutlu grafiği. Yapı
 * ve eşikler sayı dizileriyle aynıdır (numberSeriesBlocks); metinler harflere göre yazılmıştır.
 */
function letterSeriesBlocks(r: LetterSeriesResult, task: LetterSeriesTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const few = r.correct <= LETTER_FEW_MAX;
  const skippedMost = letterSeriesMostlySkipped(r);
  const rapid = letterSeriesRapid(r);
  const same = letterSeriesSameAnswer(r);
  const doubt = rapid || same;
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  /** "hepsinde", "yarısında (6 yanlışın 3 tanesinde)" ya da "çoğunda (6 yanlışın 4 tanesinde)". */
  const share = (k: number, of: number) =>
    k === of ? 'hepsinde' : `${k * 2 === of ? 'yarısında' : 'çoğunda'} (${of} yanlışın ${k} tanesinde)`;

  /* Doğru cevaplar */
  let accText: string;
  const answeredN = r.n - r.skipped;
  if (few) {
    const how =
      r.correct === 0
        ? v(`${r.n} sorunun hiçbirinde eksik harfi doğru bulamadın.`, `Çocuğunuz ${r.n} sorunun hiçbirinde eksik harfi doğru bulamadı.`)
        : v(`${r.n} sorudan yalnızca ${r.correct === 1 ? 'birinde' : `${r.correct} tanesinde`} eksik harfi doğru buldun.`, `Çocuğunuz ${r.n} sorudan yalnızca ${r.correct === 1 ? 'birinde' : `${r.correct} tanesinde`} eksik harfi doğru buldu.`);
    const why = skippedMost
      ? v(
          ` ${r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda'} “Bilmiyorum” dedin: sorular sana çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilirsin.`,
          ` ${r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda'} “Bilmiyorum” dedi: sorular ona çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilir.`,
        )
      : v(' Sorular sana çok zor gelmiş olabilir.', ' Sorular ona çok zor gelmiş olabilir.');
    accText =
      how +
      why +
      v(
        ' Bu sonuç tek başına bir şey söylemez; iyi dinlendiğin bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.',
        ' Bu sonuç tek başına yorumlanmamalıdır; iyi dinlendiği bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.',
      );
  } else if (skippedMost) {
    // Soruların çoğunda "Bilmiyorum" denmişse sonuç yorumlanmaz: düzeylere göre değişim anlatılmaz.
    accText = v(
      `${r.n} sorunun ${r.skipped} tanesinde “Bilmiyorum” dedin. Cevap verdiğin ${answeredN} sorunun ${r.correct === answeredN ? 'hepsi' : `${r.correct} tanesi`} doğruydu. Sorular sana çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilirsin; bu yüzden sonuç tek başına yorumlanmamalıdır.`,
      `Çocuğunuz ${r.n} sorunun ${r.skipped} tanesinde “Bilmiyorum” dedi. Cevap verdiği ${answeredN} sorunun ${r.correct === answeredN ? 'hepsi' : `${r.correct} tanesi`} doğruydu. Sorular ona çok zor gelmiş ya da testi bir an önce bitirmek istemiş olabilir; bu yüzden sonuç tek başına yorumlanmamalıdır.`,
    );
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['en zor sorulardaki iç içe dizileri, grupları ve büyüyen adımları da bulabildin', 'en zor sorulardaki iç içe dizileri, grupları ve büyüyen adımları da bulabildi'],
      dropWhy: ['Bu beklenen bir durumdur: üst düzeylerde gruplar uzar, iç içe diziler karmaşıklaşır ve büyüyen adımlar gelir; aynı anda akılda tutulması gereken harf ve adım sayısı artar.', 'Bu beklenen bir durumdur: üst düzeylerde gruplar uzar, iç içe diziler karmaşıklaşır ve büyüyen adımlar gelir; aynı anda akılda tutulması gereken harf ve adım sayısı artar.'],
      hardFrom: 4,
      blame: !doubt,
      blameInLevel: r.reached === 0,
      doubt,
    });
    // Yanlışların türü: dizinin yalnızca bir bölümüne uyan daha basit bir kural ya da doğru cevaba çok yakın bir cevap.
    if (r.wrong >= LETTER_PATTERN_MIN && r.traps * 2 >= r.wrong) {
      accText += v(
        ` Yanlış cevaplarının ${share(r.traps, r.wrong)} daha basit bir kurala göre bir harf seçtin. Bu kural dizinin yalnızca bir bölümüne uyuyordu: örneğin adımlar büyürken son adımı aynen sürdürmek ya da bir grubu değiştirmeden tekrarlamak. Cevabı vermeden önce bulduğun kuralı dizinin bütün harflerinde dene.`,
        ` Çocuğunuz yanlış cevaplarının ${share(r.traps, r.wrong)} daha basit bir kurala göre bir harf seçti. Bu kural dizinin yalnızca bir bölümüne uyuyordu: örneğin adımlar büyürken son adımı aynen sürdürmek ya da bir grubu değiştirmeden tekrarlamak. Bulduğu kuralı dizinin bütün harflerinde denemeden cevap vermiş olabilir.`,
      );
    }
    if (r.wrong >= LETTER_PATTERN_MIN && r.nearMisses * 2 >= r.wrong) {
      accText += v(
        ` Yanlış cevaplarının ${share(r.nearMisses, r.wrong)} seçtiğin harf, alfabede doğru cevabın hemen önündeki ya da arkasındaki harfti: kuralı bulup harfleri sayarken bir kayma yapmış olabilirsin. Harfleri sayarken tuşlardaki alfabeyi parmağınla izlemek işine yarar.`,
        ` Çocuğunuzun yanlış cevaplarının ${share(r.nearMisses, r.wrong)} seçtiği harf, alfabede doğru cevabın hemen önündeki ya da arkasındaki harfti: kuralı bulup harfleri sayarken bir kayma yapmış olabilir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorulara bakmadan cevap vermiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı sorulara bakmadan cevap vermiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('hd_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const skipCause: [string, string] = [
    ` ${r.skipped === r.n ? 'Bütün sorularda' : 'Soruların çoğunda'} “Bilmiyorum” dediğin için bu sonuç tek başına yorumlanmamalıdır.`,
    ` Çocuğunuz ${r.skipped === r.n ? 'bütün sorularda' : 'soruların çoğunda'} “Bilmiyorum” dediği için bu sonuç tek başına yorumlanmamalıdır.`,
  ];
  const duzey = reachedLevelBlock({
    base: card('hd_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: null,
    zeroCause: skippedMost ? skipCause : doubt ? ZERO_DOUBT : [ZERO_CAUSE[0], ' Bu; çocuğunuzun dikkatinin dağılmasından, acele etmesinden, yönergeyi tam anlamamasından ya da alfabenin sırasını henüz yeterince rahat bilmemesinden kaynaklanabilir ve tek başına yorumlanmamalıdır.'],
    rapid: rapid,
    doubt,
  });

  /* Kural türleri */
  // Kural türlerinde kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  // Kural türleri düzeylerle iç içedir; bu söylenir.
  const levelsOf = (rule: LetterSeriesRule) => [...new Set(task.items.filter((it) => it.rule === rule).map((it) => it.level))].sort((a, b) => a - b);
  // Bütün soruları ulaşılan düzeyin altında kalan türdeki yanlışlar o kolay düzeylerdeki yanlışlardır: "zorlandın" denmez.
  const slipOnly = (rule: LetterSeriesRule) => r.reached > 0 && levelsOf(rule).every((l) => l < r.reached);
  const good = r.rules.filter(most).map((x) => x.rule);
  const hard = r.rules.filter((x) => !most(x) && !slipOnly(x.rule)).map((x) => x.rule);
  const slipRules = r.rules.filter((x) => !most(x) && slipOnly(x.rule)).map((x) => x.rule);
  const where = (rule: LetterSeriesRule) => {
    const ls = levelsOf(rule);
    return ls.length === 1 ? `yalnızca ${ls[0]}. düzeyde` : `${joinTr(ls.map((l) => `${l}.`))} düzeylerde`;
  };
  const rough = ` Her türde yalnızca birkaç soru vardı ve bazı türler yalnızca kolay, bazıları yalnızca zor düzeylerde soruldu (ör. ${letterRuleList(['next'])} soruları ${where('next')}, ${letterRuleList(['growing'])} soruları ${where('growing')}). Bu yüzden türler arasındaki fark yalnızca yaklaşık bir fikir verir.`;
  let kural: CognitiveBlock;
  if (few || skippedMost) {
    kural = {
      ...card('hd_kural'),
      headline: 'Yorumlanmadı',
      text: few
        ? 'Doğru cevaplar çok az olduğu için kural türleri karşılaştırılmadı.'
        : v('Soruların çoğunda “Bilmiyorum” dediğin için kural türleri karşılaştırılmadı.', 'Çocuğunuz soruların çoğunda “Bilmiyorum” dediği için kural türleri karşılaştırılmadı.'),
    };
  } else {
    const all = r.rules.every((x) => x.correct === x.n);
    const head = all
      ? `${r.rules.length} kural türünün hepsinde bütün sorular doğru`
      : good.length === r.rules.length
        ? `${r.rules.length} kural türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.rules.length} kural türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.rules.length} kural türünün ${good.length === 1 ? 'birinde' : `${good.length} tanesinde`} soruların çoğu doğru`;
    // Zorlanılan türlerde ne gerektiği en çok iki tür için yazılır (uzun bir liste okunmaz).
    const needs = hard.length > 2 ? '' : hard.map((x) => capTr(`${letterRuleList([x])} türünde ${LETTER_RULES[x].plain} gerekir.`)).join(' ');
    let text: string;
    if (all || good.length === r.rules.length) {
      const q = all ? 'bütün soruları' : 'soruların çoğunu';
      text = v(
        `${r.rules.length} kural türünün her birinde ${q} doğru buldun: hem sabit adımla ilerleyen dizileri hem de iç içe dizileri, grupları ve büyüyen adımları çözebildin.`,
        `Çocuğunuz ${r.rules.length} kural türünün her birinde ${q} doğru buldu: hem sabit adımla ilerleyen dizileri hem de iç içe dizileri, grupları ve büyüyen adımları çözebildi.`,
      );
    } else if (good.length === 0) {
      const best = [...r.rules].sort((a, b) => b.correct / b.n - a.correct / a.n)[0];
      text = v(
        `Hiçbir kural türünde soruların çoğunu doğru bulamadın; en çok doğru cevabı ${letterRuleList([best.rule])} türünde verdin.`,
        `Çocuğunuz hiçbir kural türünde soruların çoğunu doğru bulamadı; en çok doğru cevabı ${letterRuleList([best.rule])} türünde verdi.`,
      );
    } else {
      text = v(
        `${letterRuleList(good)} türündeki soruların çoğunu doğru buldun${hard.length ? `; ${letterRuleList(hard)} türündeki sorularda zorlandın` : ''}. ${needs}`,
        `Çocuğunuz ${letterRuleList(good)} türündeki soruların çoğunu doğru buldu${hard.length ? `; ${letterRuleList(hard)} türündeki sorularda zorlandı` : ''}. ${needs}`,
      );
    }
    if (slipRules.length) {
      text += v(
        ` ${capTr(letterRuleList(slipRules))} türündeki yanlışlarının hepsi daha kolay düzeylerdeydi; daha zor kuralları bulabildiğin için bu yanlışlar kuralı bilmemekten çok dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.`,
        ` Çocuğunuzun ${letterRuleList(slipRules)} türündeki yanlışlarının hepsi daha kolay düzeylerdeydi; daha zor kuralları bulabildiği için bu yanlışlar kuralı bilmemekten çok dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.`,
      );
    }
    kural = { ...card('hd_kural'), headline: head, text: capTr(text.replace(/\s+$/, '').replace(/ {2,}/g, ' ')) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  const answered = r.n - r.skipped;
  if (r.skipped > 0) {
    const inWhich = r.skipped === r.n ? 'bütün sorularda' : `${r.skipped} soruda`;
    issues.push(v(`${capTr(inWhich)} “Bilmiyorum” dedin.`, `Çocuğunuz ${inWhich} “Bilmiyorum” dedi.`));
  }
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki sorulardan cevap verdiğin ${r.rapidOf} sorunun ${which} 2,5 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki sorulardan cevap verdiği ${r.rapidOf} sorunun ${which} 2,5 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur; bu sorularda tahmin etmiş olabilir.`,
      ),
    );
  }
  if (same) {
    issues.push(
      v(
        `${r.sameAnswer === answered ? 'Bütün cevaplarında' : `Cevaplarının ${r.sameAnswer} tanesinde`} aynı harfi seçtin; sorulara bakmadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${r.sameAnswer === answered ? 'bütün cevaplarında' : `cevaplarının ${r.sameAnswer} tanesinde`} aynı harfi seçti; sorulara bakmadan cevap vermiş olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !few && !skippedMost && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('hd_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = few || skippedMost ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
      const hardLevels = r.levels.filter((l) => l.level >= 4);
      const hardAcc = hardLevels.reduce((a, l) => a + l.correct, 0) / Math.max(1, hardLevels.reduce((a, l) => a + l.n, 0));
      if (r.rtHard >= 1.5 * r.rtEasy) {
        pace = v(
          'Zor sorulara kolay sorulardan daha çok zaman ayırdın. Zor bir soruda daha uzun düşünmek iyi bir çalışma biçimidir: kuralı bulup dizinin bütün harflerinde denemek zaman alır.',
          'Çocuğunuz zor sorulara kolay sorulardan daha çok zaman ayırdı. Zor bir soruda daha uzun düşünmek iyi bir çalışma biçimidir: kuralı bulup dizinin bütün harflerinde denemek zaman alır.',
        );
      } else if (r.rtHard * 1.2 <= r.rtEasy && hardAcc <= 0.5) {
        pace = v(
          'Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı. Zor sorulara daha çok zaman ayırmak ve harflerin arasına kaç harf atlandığını kâğıda yazmak, kuralı bulmana yardım edebilir.',
          'Çocuğunuz zor sorulara kolay sorulardan daha az zaman ayırdı ve bu sorularda doğru cevaplar azdı. Zor sorularda vazgeçmiş ya da acele etmiş olabilir; daha çok zaman ayırmak ve harflerin arasına kaç harf atlandığını kâğıda yazmak kuralı bulmasına yardım edebilir.',
        );
      } else if (r.rtHard * 1.5 <= r.rtEasy) {
        pace = v(
          'Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.',
          'Çocuğunuz zor sorularda kolay sorulardakinden daha kısa sürede cevap verdi ve bu soruların çoğunu yine doğru buldu.',
        );
      } else {
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    // "Bilmiyorum" denen sorular da süreye girer; çoğunlukla "Bilmiyorum" denmişse bu söylenir.
    const base = skippedMost
      ? v(`Bir soruda tipik olarak ${seconds(r.medianRt)} kaldın; bu süreye “Bilmiyorum” dediğin sorular da girer.`, `Çocuğunuz bir soruda tipik olarak ${seconds(r.medianRt)} kaldı; bu süreye “Bilmiyorum” dediği sorular da girer.`)
      : v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('hd_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
      ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
      : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  // Kural türleri kartı yorumlanmıyorsa (çok az doğru ya da çoğunda "Bilmiyorum") türlerin üç boyutlu grafiği de çizilmez.
  const profile: CognitiveReport['profile'] = few || skippedMost
    ? undefined
    : {
        title: v('Kural türlerine göre sonucun', 'Kural türlerine göre sonuç'),
        note: v(
          'Her sütun bir kural türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğunu doğru bulmuşsun demektir; tam boy sütun, hepsini doğru bulduğun anlamına gelir. Renkler yalnızca türleri ayırır.',
          'Her sütun bir kural türüdür. Sütun ne kadar yüksekse o türdeki soruların o kadar çoğu doğru bulunmuş demektir; tam boy sütun, hepsinin doğru bulunduğu anlamına gelir. Renkler yalnızca türleri ayırır.',
        ),
        bars: r.rules.map((x) => ({
          key: x.rule,
          label: LETTER_RULES[x.rule].name,
          value: Math.round((x.correct / x.n) * 100),
          min: 0,
          max: 100,
          color: LETTER_RULES[x.rule].color,
          valueLabel: `${x.correct}/${x.n}`,
          band: '',
        })),
      };
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels, true);
  duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!few && !skippedMost) kural.visual = typeBarsVisual('Kural türlerine göre doğru cevaplar', r.rules.map((x) => ({ name: LETTER_RULES[x.rule].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '4–5. düzey', ms: comparePace ? r.rtHard : null });
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

/** Sözel akıl yürütmede çeldiricisi seçilen türe göre olası yanılgı (her biri ayrı, kısa bir cümle). */
const VERBAL_LURE_SENTENCE: Record<VerbalItemType, { you: string; parent: string }> = {
  analogy: { you: 'Kelime ilişkilerinde kelimelerin arasındaki ilişkiye değil, konusuna bakmış olabilirsin.', parent: 'Kelime ilişkilerinde kelimelerin arasındaki ilişkiye değil, konusuna bakmış olabilir.' },
  classification: { you: 'Sınıflamada gruba yalnızca bir yönüyle benzeyen kelimeyi seçmiş olabilirsin.', parent: 'Sınıflamada gruba yalnızca bir yönüyle benzeyen kelimeyi seçmiş olabilir.' },
  ordering: { you: 'Sıralamada bilgilerin yalnızca bir kısmına bakmış ya da olabilecek bir sıralamayı kesin saymış olabilirsin.', parent: 'Sıralamada bilgilerin yalnızca bir kısmına bakmış ya da olabilecek bir sıralamayı kesin saymış olabilir.' },
  deduction: { you: 'Mantıksal çıkarımda bilgilerden kesin olarak çıkmayan bir cümleyi doğru saymış olabilirsin.', parent: 'Mantıksal çıkarımda bilgilerden kesin olarak çıkmayan bir cümleyi doğru saymış olabilir.' },
};

/** "“Kelime ilişkileri” ve “sıralama”" gibi: tür adları tırnak içinde, ilk harfi küçük. */
const verbalTypeList = (types: VerbalItemType[]) =>
  joinTr(types.map((t) => `“${VERBAL_TYPES[t].name.charAt(0).toLocaleLowerCase('tr-TR')}${VERBAL_TYPES[t].name.slice(1)}”`));

/** Sözel akıl yürütmenin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve soru türlerinin üç boyutlu grafiği. */
function verbalBlocks(r: VerbalResult, task: VerbalReasoningTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = verbalChance(r);
  const rapid = verbalRapid(r);
  const samePos = verbalSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışların çoğu çeldiriciyse, kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz (yanılgı cümlesi açıklar).
  const lurePattern = verbalLurePattern(r);
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);

  /* Doğru cevaplar */
  let accText: string;
  if (chance) {
    accText = levelChanceText(v, r.n, VERBAL_CHANCE_MAX);
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['kelimeler arasındaki soyut ilişkileri ve birden çok bilgiyi birleştirmeyi gerektiren en zor soruları da çözebildin', 'kelimeler arasındaki soyut ilişkileri ve birden çok bilgiyi birleştirmeyi gerektiren en zor soruları da çözebildi'],
      dropWhy: ['Bu beklenen bir durumdur: üst düzeylerde ilişkiler soyutlaşır ve birleştirilmesi gereken bilgi sayısı artar.', 'Bu beklenen bir durumdur: üst düzeylerde ilişkiler soyutlaşır ve birleştirilmesi gereken bilgi sayısı artar.'],
      hardFrom: 4,
      blame: !doubt && !lurePattern,
      blameInLevel: r.reached === 0,
      doubt,
    });
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği.
    if (lurePattern) {
      const share = r.lures === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.lures} tanesinde)`;
      // Yanılgılar yalnızca çeldiricisi seçilen türler için, her biri kısa bir cümleyle ve olasılık olarak söylenir.
      const kinds = VERBAL_TYPES_ORDER.filter((t) => r.luresByType[t] > 0);
      accText +=
        v(
          ` Yanlış cevaplarının ${share} ilk bakışta doğru görünen seçeneği seçtin. Bu seçenek sorudaki bilgilerin hepsine uymuyordu.`,
          ` Çocuğunuz yanlış cevaplarının ${share} ilk bakışta doğru görünen seçeneği seçti. Bu seçenek sorudaki bilgilerin hepsine uymuyordu.`,
        ) +
        kinds.map((t) => ` ${v(VERBAL_LURE_SENTENCE[t].you, VERBAL_LURE_SENTENCE[t].parent)}`).join('') +
        v(' Seçmeden önce her seçeneği sorudaki bütün bilgilerle karşılaştırmak işine yarar.', ' Seçmeden önce her seçeneği sorudaki bütün bilgilerle karşılaştırmak ona yardım edebilir.');
    }
    if (doubt) {
      accText += v(
        ' Bazı soruları okumadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı soruları okumadan seçmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('sz_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const duzey = reachedLevelBlock({
    base: card('sz_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: chance ? 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' : null,
    zeroCause: doubt ? ZERO_DOUBT : lurePattern ? [' Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.', ' Bu; yönergeyi tam anlamamasından, doğru cevaplar kartında anlatılan yanılgılardan ya da soruları okumakta henüz yeterince rahat olmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'] : [ZERO_CAUSE[0], ' Bu; çocuğunuzun dikkatinin dağılmasından, acele etmesinden, yönergeyi tam anlamamasından ya da soruları okumakta henüz yeterince rahat olmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'],
    rapid: rapid,
    doubt,
    plural: true,
  });

  /* Soru türleri */
  // Kartlar "soruların çoğu" der: ölçüt, soruların yarısından fazlasının doğru olmasıdır.
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const rough = ' Her türde yalnızca altı soru vardı ve her türde kolaydan zora sorular bulunuyordu; bu yüzden türler arasındaki fark yalnızca yaklaşık bir fikir verir.';
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('sz_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için soru türleri karşılaştırılmadı.' };
  } else {
    // Zorlanılan türlerde ne gerektiği en çok iki tür için yazılır (uzun bir liste okunmaz).
    const needs =
      hard.length > 2
        ? ''
        : hard.length === 1
        ? `Bu tür sorularda ${VERBAL_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${verbalTypeList([x])} sorularında ${VERBAL_TYPES[x].plain} gerekir.`)).join(' ');
    const allRight = r.types.every((x) => x.correct === x.n);
    const head = allRight
      ? `${r.types.length} soru türünün hepsinde bütün sorular doğru`
      : good.length === r.types.length
        ? `${r.types.length} soru türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.types.length} soru türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.types.length} soru türünün ${good.length === 1 ? 'birinde' : `${good.length} tanesinde`} soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.types.length} soru türünün her birinde ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldun: hem kelimeler arasındaki ilişkileri ve ortak özellikleri bulabildin hem de bilgileri birleştirip kesin sonuç çıkarabildin.`,
        `Çocuğunuz ${r.types.length} soru türünün her birinde ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldu: hem kelimeler arasındaki ilişkileri ve ortak özellikleri bulabildi hem de bilgileri birleştirip kesin sonuç çıkarabildi.`,
      );
    } else if (good.length === 0) {
      const best = [...r.types].sort((a, b) => b.correct / b.n - a.correct / a.n)[0];
      text = v(
        `Hiçbir soru türünde soruların çoğunu doğru bulamadın; en çok doğru cevabı ${verbalTypeList([best.type])} sorularında verdin.`,
        `Çocuğunuz hiçbir soru türünde soruların çoğunu doğru bulamadı; en çok doğru cevabı ${verbalTypeList([best.type])} sorularında verdi.`,
      );
    } else {
      text = v(
        `${verbalTypeList(good)} sorularının çoğunu doğru buldun; ${verbalTypeList(hard)} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${verbalTypeList(good)} sorularının çoğunu doğru buldu; ${verbalTypeList(hard)} sorularında zorlandı. ${needs}`,
      );
    }
    tur = { ...card('sz_tur'), headline: head, text: capTr(text.trim()) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which}, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede yanlış cevap verdin; bu sorularda okumadan seçmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which}, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede yanlış cevap verdi; bu sorularda okumadan seçmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !chance && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('sz_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = chance ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
          paceClose(v, r.rtEasy, r.rtHard) +
          (hardAcc <= 0.5
            ? v(
                ' Zor sorular daha uzun olduğu için onlara daha çok zaman ayırmak işine yarayabilir.',
                ' Zor sorular daha uzun olduğu için onlara daha çok zaman ayırmak yardımcı olabilir.',
              )
            : '');
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('sz_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
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
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels);
  if (!chance) duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!chance) tur.visual = typeBarsVisual('Soru türlerine göre doğru cevaplar', r.types.map((x) => ({ name: VERBAL_TYPES[x.type].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '4–5. düzey', ms: comparePace ? r.rtHard : null });
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
  const chance = foldingChance(r);
  const rapid = foldingRapid(r);
  const samePos = foldingSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışların çoğu çeldiriciyse, kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz (yanılgı cümlesi açıklar).
  const lurePattern = foldingLurePattern(r);
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);

  /* Doğru cevaplar */
  let accText: string;
  if (chance) {
    accText = levelChanceText(v, r.n, FOLDING_CHANCE_MAX);
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['çok kez katlanan kâğıtları da zihninde adım adım açabildin', 'çok kez katlanan kâğıtları da zihninde adım adım açabildi'],
      dropWhy: ['Bu beklenen bir durumdur: üst düzeylerde katlama sayısı artar ve çapraz ya da kenardan katlamalar birbirine karışır.', 'Bu beklenen bir durumdur: üst düzeylerde katlama sayısı artar ve çapraz ya da kenardan katlamalar birbirine karışır.'],
      hardFrom: 4,
      blame: !doubt && !lurePattern,
      blameInLevel: r.reached === 0,
      doubt,
    });
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği; yanılgılar olasılık olarak söylenir.
    if (lurePattern) {
      const share = r.lures === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.lures} tanesinde)`;
      const phrases = FOLDING_LURES_ORDER.filter((k) => r.luresByKind[k] > 0).map((k) => FOLDING_LURE_TEXT[k]);
      const which = phrases.length > 1 ? 'şu yanılgılardan' : 'şu yanılgıdan';
      accText += v(
        ` Yanlış cevaplarının ${share} ilk bakışta doğru görünen ama katlamalara uymayan seçeneği seçtin. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. Kâğıdı son katlamadan başlayarak adım adım açmak işine yarayabilir.`,
        ` Çocuğunuz yanlış cevaplarının ${share} ilk bakışta doğru görünen ama katlamalara uymayan seçeneği seçti. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. Kâğıdı son katlamadan başlayarak adım adım açmak ona yardım edebilir.`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda katlamalara bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı sorularda katlamalara bakmadan seçmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('kk_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const duzey = reachedLevelBlock({
    base: card('kk_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: chance ? 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' : null,
    zeroCause: doubt ? ZERO_DOUBT : lurePattern ? [' Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.', ' Bu, çocuğunuzun yönergeyi tam anlamamasından ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir ve tek başına yorumlanmamalıdır.'] : ZERO_CAUSE,
    rapid: rapid,
    doubt,
  });

  /* Katlama türleri */
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const rough = ' Her türde yalnızca sekiz soru vardı ve her türde kolaydan zora sorular bulunuyordu; bu yüzden türler arasındaki fark yalnızca yaklaşık bir fikir verir.';
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('kk_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için katlama türleri karşılaştırılmadı.' };
  } else {
    // Zorlanılan türlerde ne gerektiği en çok iki tür için yazılır (uzun bir liste okunmaz).
    const needs =
      hard.length > 2
        ? ''
        : hard.length === 1
        ? `Bu tür sorularda ${FOLDING_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${foldingTypeList([x])} sorularında ${FOLDING_TYPES[x].plain} gerekir.`)).join(' ');
    const allRight = r.types.every((x) => x.correct === x.n);
    const head = allRight
      ? `${r.types.length} katlama türünün hepsinde bütün sorular doğru`
      : good.length === r.types.length
        ? `${r.types.length} katlama türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.types.length} katlama türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.types.length} katlama türünün ${good.length === 1 ? 'birinde' : `${good.length} tanesinde`} soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.types.length} katlama türünün her birinde ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldun: ortadan, kenardan ve çapraz katlanmış kâğıtları zihninde açabildin.`,
        `Çocuğunuz ${r.types.length} katlama türünün her birinde ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldu: ortadan, kenardan ve çapraz katlanmış kâğıtları zihninde açabildi.`,
      );
    } else if (good.length === 0) {
      const best = [...r.types].sort((a, b) => b.correct / b.n - a.correct / a.n)[0];
      text = v(
        `Hiçbir katlama türünde soruların çoğunu doğru bulamadın; en çok doğru cevabı ${foldingTypeList([best.type])} sorularında verdin.`,
        `Çocuğunuz hiçbir katlama türünde soruların çoğunu doğru bulamadı; en çok doğru cevabı ${foldingTypeList([best.type])} sorularında verdi.`,
      );
    } else {
      text = v(
        `${foldingTypeList(good)} sorularının çoğunu doğru buldun; ${foldingTypeList(hard)} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${foldingTypeList(good)} sorularının çoğunu doğru buldu; ${foldingTypeList(hard)} sorularında zorlandı. ${needs}`,
      );
    }
    tur = { ...card('kk_tur'), headline: head, text: capTr(text.trim()) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 2,5 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede katlamaları izleyip seçenekleri karşılaştırmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 2,5 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede katlamaları izleyip seçenekleri karşılaştırmak çok zordur; bu sorularda tahmin etmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !chance && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('kk_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = chance ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('kk_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
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
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels);
  if (!chance) duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!chance) tur.visual = typeBarsVisual('Katlama türlerine göre doğru cevaplar', r.types.map((x) => ({ name: FOLDING_TYPES[x.type].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '4–5. düzey', ms: comparePace ? r.rtHard : null });
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
  const below = logicBelowChance(r);
  const rushed = logicRushed(r);
  const rapid = logicRapid(r);
  // Sonuç yorumlanmaz: hep aynı cevap, rastgele seçimin de altında doğru ya da soruların çoğu okunmadan cevaplanmış olabilir.
  const notRead = !!side || below || rushed;
  const good = (g: LogicGroup) => g.correct >= LOGIC_GOOD;
  const weak = (g: LogicGroup) => g.correct <= LOGIC_WEAK;
  const f = r.forms;
  const sideCount = side === 'yes' ? r.yes : r.n - r.yes;
  const sideLabel = side === 'yes' ? 'Evet, kesin olarak doğru' : 'Hayır, kesin değil';
  const notReadWhy = side
    ? sideCount === r.n
      ? 'Cevapların hepsi aynı olduğu için'
      : 'Cevapların neredeyse hepsi aynı olduğu için'
    : below
      ? 'Doğru cevaplar rastgele seçimde beklenenden de az olduğu için'
      : 'Soruların çoğu okumaya yetmeyecek kadar kısa sürede cevaplandığı için';
  const rapidOf = `${r.n} sorunun ${countOf(r.rapid, r.n, 'inde')}`;
  const rule = 'Bu kurala göre A varsa B de vardır, B yoksa A da yoktur. B olduğunda ya da A olmadığında ise kesin bir şey söylenemez.';

  /* Doğru cevaplar */
  let accText: string;
  if (side) {
    accText = v(
      `Soruların ${countOf(sideCount, r.n, 'inde')} “${sideLabel}” dedin. Oysa soruların yarısında sonuç bilgilerden kesin olarak çıkıyor, yarısında çıkmıyordu. Sorulara bakmadan hep aynı cevabı vermiş ya da yönergeyi farklı anlamış olabilirsin. Bu yüzden sonuç yorumlanmadı. Yönergeyi yeniden okuyup başka bir gün yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz soruların ${countOf(sideCount, r.n, 'inde')} “${sideLabel}” dedi. Oysa soruların yarısında sonuç bilgilerden kesin olarak çıkıyor, yarısında çıkmıyordu. Sorulara bakılmadan hep aynı cevap verilmiş ya da yönerge farklı anlaşılmış olabilir. Bu yüzden sonuç yorumlanmadı. Yönergeyi yeniden okuyup başka bir gün yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else if (below) {
    const few = r.correct === 0 ? v('Hiçbir soruda doğru karar vermedin.', 'Çocuğunuz hiçbir soruda doğru karar vermedi.') : v(`Soruların yalnızca ${countOf(r.correct, r.n, 'inde')} doğru karar verdin.`, `Çocuğunuz soruların yalnızca ${countOf(r.correct, r.n, 'inde')} doğru karar verdi.`);
    accText =
      few +
      v(
        ' Bu, iki seçenek arasından rastgele seçimde beklenenden de az. Yönergeyi farklı anlamış ya da seçenekleri ters kullanmış olabilirsin. Bu yüzden sonuç yorumlanmadı. Yönergeyi yeniden okuyup başka bir gün yeniden denemek daha doğru bir sonuç verebilir.',
        ' Bu, iki seçenek arasından rastgele seçimde beklenenden de az. Yönerge farklı anlaşılmış ya da seçenekler ters kullanılmış olabilir. Bu yüzden sonuç yorumlanmadı. Yönergeyi yeniden okuyup başka bir gün yeniden denemesi daha doğru bir sonuç verebilir.',
      );
  } else if (rushed) {
    accText = v(
      `${capTr(rapidOf)} cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdin. Bu sorularda okumadan seçmiş olabilirsin. Bu yüzden sonuç yorumlanmadı. Acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${rapidOf} cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdi. Bu sorularda okumadan seçmiş olabilir. Bu yüzden sonuç yorumlanmadı. Acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    const both = 'hem “eğer–ise” kurallarında hem de “bütün, bazı, hiçbir” sorularında sonucun bilgilerden kesin olarak çıkıp çıkmadığını buldun';
    const bothP = 'hem “eğer–ise” kurallarında hem de “bütün, bazı, hiçbir” sorularında sonucun bilgilerden kesin olarak çıkıp çıkmadığını buldu';
    // "Hem … hem de …" yalnızca dört grubun her birinde en çok bir yanlış varken: ötekinde kartlar yanlışların türünü anlatır.
    const allGroups = LOGIC_GROUPS.every((g) => r[g.key].correct >= r[g.key].n - 1);
    if (r.correct === r.n) {
      accText = v(`Bütün sorularda doğru karar verdin: ${both}.`, `Çocuğunuz bütün sorularda doğru karar verdi: ${bothP}.`);
    } else if (r.correct >= r.n - 3 && allGroups) {
      accText = v(`Soruların hemen hepsinde doğru karar verdin: ${both}.`, `Çocuğunuz soruların hemen hepsinde doğru karar verdi: ${bothP}.`);
    } else if (r.correct >= r.n - 3) {
      accText = v(
        'Soruların hemen hepsinde doğru karar verdin. Birkaç yanlışının hangi türden olduğunu aşağıdaki kartlar gösterir.',
        'Çocuğunuz soruların hemen hepsinde doğru karar verdi. Birkaç yanlışının hangi türden olduğunu aşağıdaki kartlar gösterir.',
      );
    } else if (r.correct >= LOGIC_ABOVE_CHANCE) {
      accText = v(
        'Soruların çoğunda doğru karar verdin. Hangi tür sorularda zorlandığını aşağıdaki kartlar gösterir.',
        'Çocuğunuz soruların çoğunda doğru karar verdi. Hangi tür sorularda zorlandığını aşağıdaki kartlar gösterir.',
      );
    } else {
      const part = 2 * r.correct > r.n ? 'yarısından çoğunda' : 2 * r.correct === r.n ? 'yarısında' : 'yarısından azında';
      accText = v(
        `Soruların ${part} doğru karar verdin. Her soruda iki seçenek var; rastgele seçen biri de yaklaşık yarısını doğru bulur. Bu yüzden toplamdan çok, hangi tür sorularda zorlandığın daha çok şey söyler (aşağıdaki kartlar).`,
        `Çocuğunuz soruların ${part} doğru karar verdi. Her soruda iki seçenek var; rastgele seçen biri de yaklaşık yarısını doğru bulur. Bu yüzden toplamdan çok, hangi tür sorularda zorlandığı daha çok şey söyler (aşağıdaki kartlar).`,
      );
      if (!rapid && Math.abs(r.correct - r.n / 2) <= 4) {
        accText +=
          ' Toplamın yarıya yakın olması, rastgele seçildiği anlamına gelmez. Belirli bir düşünme alışkanlığı da bazı tür sorularda hep aynı yanlışı yaptırabilir.';
      }
    }
    if (rapid) {
      accText += v(
        ` ${capTr(rapidOf)} bilgileri okumadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.`,
        ` ${capTr(rapidOf)} bilgiler okunmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.`,
      );
    }
  }
  // Yorumlanmayan sonucun rozeti ve grafiği de yorumlanmış gibi görünmez.
  const dogru: CognitiveBlock = notRead
    ? { ...card('ma_dogru'), headline: 'Yorumlanmadı', text: accText }
    : {
        ...card('ma_dogru'),
        headline: `${r.n} soruda ${r.correct} doğru`,
        text: accText,
        visual: {
          type: 'bars',
          label: 'Doğru karar verilen sorular',
          scale: 'share',
          rows: [
            { label: 'Eğer–ise soruları', value: r.conditional.correct, max: r.conditional.n, valueLabel: `${r.conditional.correct}/${r.conditional.n}` },
            { label: 'Bütün–bazı–hiçbir soruları', value: r.categorical.correct, max: r.categorical.n, valueLabel: `${r.categorical.correct}/${r.categorical.n}` },
          ],
        } satisfies BarsVisual,
      };

  /* Eğer–ise çıkarımları */
  const cv = r.condValid;
  const ci = r.condInvalid;
  // Soru türlerine göre doğru kararlar (kartların grafiği): her satır bir tür, başında grubu.
  const formBars = (label: string, forms: [string, LogicForm][]): BarsVisual => ({
    type: 'bars',
    label,
    scale: 'share',
    rows: forms.map(([group, x]) => ({ label: `${group}: ${LOGIC_FORM_NAMES[x]}`, value: f[x].correct, max: f[x].n, valueLabel: `${f[x].correct}/${f[x].n}` })),
  });
  // "B yoksa A da yoktur" (olumsuz cümlelerle kurulan kesin çıkarım) ötekinden belirgin biçimde zor geldi.
  const mtWeak = f.mt.correct <= 2 && f.mp.correct - f.mt.correct >= 2;
  const mtText = v(
    ' Özellikle “B yoksa A da yoktur” çıkarımında zorlandın. Olumsuz cümlelerle kurulan bu çıkarım kesindir. Araştırmalarda da “A varsa B de vardır”dan daha az kabul edilir.',
    ' Özellikle “B yoksa A da yoktur” çıkarımında zorlandı. Olumsuz cümlelerle kurulan bu çıkarım kesindir. Araştırmalarda da “A varsa B de vardır”dan daha az kabul edilir.',
  );
  let kosul: CognitiveBlock;
  if (notRead) {
    kosul = { ...card('ma_kosul'), headline: 'Yorumlanmadı', text: `${notReadWhy} bu sorulardaki sonuç yorumlanmadı.` };
  } else {
    let text: string;
    let mtSaid = false;
    if (good(cv) && good(ci)) {
      const how = cv.correct + ci.correct === cv.n + ci.n ? 'her soruda' : 'çoğunlukla';
      text = v(
        `“Eğer A ise B” kurallarından kesin olarak neyin çıktığını, neyin çıkmadığını ${how} ayırt ettin. ${rule}`,
        `Çocuğunuz “eğer A ise B” kurallarından kesin olarak neyin çıktığını, neyin çıkmadığını ${how} ayırt etti. ${rule}`,
      );
    } else if (good(cv) && weak(ci)) {
      const found = cv.correct === cv.n ? 'hepsini' : 'çoğunu';
      const yes = ci.n - ci.correct;
      const yesQ = yes === ci.n ? 'hepsine' : 2 * yes === ci.n ? 'yarısına' : 'çoğuna';
      text = v(
        `“Eğer A ise B” kurallarında kesin olan sonuçların ${found} buldun. Ama kesin olmayan sonuçların ${yesQ} de “evet” dedin. Kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez. B başka durumlarda da olabilir. Kuralı iki yönlü düşünmek çok yaygındır. ${adult ? 'Araştırmalarda bu iki çıkarım sık kabul edilir.' : 'Araştırmalarda yetişkinler de bu iki çıkarımı sık kabul eder.'} Böyle bir soruda “B olup da A’nın olmadığı bir durum olabilir mi?” diye bir karşı örnek aramak işine yarayabilir.`,
        `Çocuğunuz “eğer A ise B” kurallarında kesin olan sonuçların ${found} buldu. Ama kesin olmayan sonuçların ${yesQ} de “evet” dedi. Kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez. B başka durumlarda da olabilir. Kuralı iki yönlü düşünmek çok yaygındır. Araştırmalarda yetişkinler de bu iki çıkarımı sık kabul eder. Böyle bir soruda “B olup da A’nın olmadığı bir durum olabilir mi?” diye bir karşı örnek aramak ona yardım edebilir.`,
      );
    } else if (weak(cv) && good(ci)) {
      const noticed = ci.correct === ci.n ? 'her soruda' : 'çoğunlukla';
      if (mtWeak && f.mp.correct >= 3) {
        // Yanlışlar "B yoksa A da yoktur" sorularında toplanıyor: genel bir temkin açıklaması verilmez.
        text = v(
          `Kesin olmayan sonuçları ${noticed} fark ettin.${mtText}`,
          `Çocuğunuz kesin olmayan sonuçları ${noticed} fark etti.${mtText}`,
        );
        mtSaid = true;
      } else {
        const no = cv.n - cv.correct;
        const noQ = no === cv.n ? 'hepsine' : 2 * no === cv.n ? 'yarısına' : 'çoğuna';
        text = v(
          `Kesin olmayan sonuçları ${noticed} fark ettin. Ama kesin olan sonuçların ${noQ} de “hayır” dedin. Her sonuca temkinli yaklaşmış olabilirsin. Oysa “eğer A ise B” kuralına göre A varsa B de kesin olarak vardır, B yoksa A da yoktur.`,
          `Çocuğunuz kesin olmayan sonuçları ${noticed} fark etti. Ama kesin olan sonuçların ${noQ} de “hayır” dedi. Her sonuca temkinli yaklaşmış olabilir. Oysa “eğer A ise B” kuralına göre A varsa B de kesin olarak vardır, B yoksa A da yoktur.`,
        );
      }
    } else if (weak(cv) && weak(ci)) {
      text = v(
        `Bu sorularda kesin olanla kesin olmayanı ayırt etmekte zorlandın. ${rule}`,
        `Çocuğunuz bu sorularda kesin olanla kesin olmayanı ayırt etmekte zorlandı. ${rule}`,
      );
    } else if (ci.correct < cv.correct) {
      text = v(
        'Kesin olmayan sonuçlardan bazılarına “evet” dedin. Kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez.',
        'Çocuğunuz kesin olmayan sonuçlardan bazılarına “evet” dedi. Kural, B olduğunda A’nın da olduğunu ya da A olmadığında B’nin de olmadığını söylemez.',
      );
    } else if (cv.correct < ci.correct) {
      text = v(
        'Kesin olan sonuçlardan bazılarına “hayır” dedin. Kurala göre A varsa B de kesin olarak vardır, B yoksa A da yoktur.',
        'Çocuğunuz kesin olan sonuçlardan bazılarına “hayır” dedi. Kurala göre A varsa B de kesin olarak vardır, B yoksa A da yoktur.',
      );
    } else {
      text = v(`Kesin olan ve kesin olmayan sonuçların ikisinde de yanıldığın sorular oldu. ${rule}`, `Çocuğunuz kesin olan ve kesin olmayan sonuçların ikisinde de yanıldı. ${rule}`);
    }
    if (mtWeak && !mtSaid) text += mtText;
    kosul = {
      ...card('ma_kosul'),
      headline: `Kesin olanlar ${cv.correct}/${cv.n} · Kesin olmayanlar ${ci.correct}/${ci.n}`,
      text: text + ' Her tür dört soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
      visual: formBars('Doğru karar verilen sorular (her türde dört soru)', [
        ['Kesin', 'mp'],
        ['Kesin', 'mt'],
        ['Kesin değil', 'ac'],
        ['Kesin değil', 'da'],
      ]),
    };
  }

  /* Bilgiler ve gerçek hayat */
  const nc = r.noConflict;
  const cf = r.conflict;
  // Çatışmayan soruların da çoğu yanlışsa iki grup karşılaştırılamaz.
  const noCompare = !notRead && weak(nc);
  let inanc: CognitiveBlock;
  if (notRead) {
    inanc = { ...card('ma_inanc'), headline: 'Yorumlanmadı', text: `${notReadWhy} bu sorulardaki sonuç yorumlanmadı.` };
  } else if (noCompare) {
    const missQ = nc.correct === 0 ? 'hiçbirinde' : 'yarısında ya da daha çoğunda';
    inanc = {
      ...card('ma_inanc'),
      headline: 'Karşılaştırılamadı',
      text: v(
        `Sonucun gerçek hayatla çatışmadığı soruların ${missQ} doğru karar veremedin. Bu yüzden gerçek hayatta bildiklerinin kararını ne kadar etkilediği söylenemez. Bu sorularda yalnızca bilgilere bakıp sonucun onlardan kesin olarak çıkıp çıkmadığını düşünmek gerekir.`,
        `Çocuğunuz sonucun gerçek hayatla çatışmadığı soruların ${missQ} doğru karar veremedi. Bu yüzden gerçek hayatta bildiklerinin kararını ne kadar etkilediği söylenemez. Bu sorularda yalnızca bilgilere bakıp sonucun onlardan kesin olarak çıkıp çıkmadığını düşünmek gerekir.`,
      ),
    };
  } else {
    let text: string;
    const tip = v(
      ' Böyle sorularda gerçek dünyayı bir an bir kenara bırakmak işine yarayabilir. Örneğin cümledeki adların yerine uydurma sözcükler koyup yeniden düşünebilirsin.',
      ' Böyle sorularda gerçek dünyayı bir an bir kenara bırakmak ona yardım edebilir. Örneğin cümledeki adların yerine uydurma sözcükler koyup yeniden düşünebilir.',
    );
    if (good(cf)) {
      const how = cf.correct === cf.n ? 'her soruda' : 'çoğunlukla';
      text = v(
        `Sonuç gerçek hayatla çatıştığında ${how} yalnızca verilen bilgilere göre karar verdin. Bunun için gerçekte doğru ya da yanlış olanı bir kenara bırakmak gerekir.${adult ? '' : ' Bir araştırmada çocukların bu sorulardaki başarısı genç yetişkinlerden düşük bulunmuştur.'}`,
        `Çocuğunuz sonuç gerçek hayatla çatıştığında ${how} yalnızca verilen bilgilere göre karar verdi. Bunun için gerçekte doğru ya da yanlış olanı bir kenara bırakmak gerekir. Bir araştırmada çocukların bu sorulardaki başarısı genç yetişkinlerden düşük bulunmuştur.`,
      );
    } else if (nc.correct > cf.correct) {
      text = v(
        'Sonucun gerçek hayatla çatışmadığı sorularda, çatıştığı sorulardan daha çok doğru karar verdin.',
        'Çocuğunuz sonucun gerçek hayatla çatışmadığı sorularda, çatıştığı sorulardan daha çok doğru karar verdi.',
      );
      if (good(nc) && nc.correct - cf.correct >= 3) {
        // Fark rastlantının zor açıklayacağı kadar büyük: inandırıcılık etkisi anlatılır.
        text += v(
          ` Çatışan sorularda yanıldığında, sonucu gerçek hayatta bildiklerine göre değerlendirmiş olabilirsin. Gerçek hayatta bilinenin kararı etkilemesine inandırıcılık etkisi denir. ${adult ? 'Bu etki çok yaygındır.' : 'Bu etki yetişkinlerde de çok yaygındır.'}`,
          ' Çatışan sorularda yanıldığında, sonucu gerçek hayatta bildiklerine göre değerlendirmiş olabilir. Gerçek hayatta bilinenin kararı etkilemesine inandırıcılık etkisi denir. Bu etki yetişkinlerde de çok yaygındır.',
        );
        text += tip;
      } else {
        text += ' Ama iki grup arasındaki fark, gerçek hayat bilgisinin kararı etkilediğini söylemeye yetmez.';
      }
    } else {
      text = v(
        'Sonucun gerçek hayatla çatıştığı ve çatışmadığı sorularda birbirine yakın sayıda doğru karar verdin.',
        'Çocuğunuz sonucun gerçek hayatla çatıştığı ve çatışmadığı sorularda birbirine yakın sayıda doğru karar verdi.',
      );
    }
    inanc = {
      ...card('ma_inanc'),
      headline: `Çatışan sorular ${cf.correct}/${cf.n} · Çatışmayan sorular ${nc.correct}/${nc.n}`,
      text: text + ' Her grup sekiz soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
      visual: formBars('Doğru karar verilen sorular (her türde dört soru)', [
        ['Çatışmayan', 'vb'],
        ['Çatışmayan', 'iu'],
        ['Çatışan', 'vu'],
        ['Çatışan', 'ib'],
      ]),
    };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const right = r.rapidCorrect === 0 ? 'Bu cevapların hiçbiri doğru değildi.' : `Bu cevapların yalnızca ${countOf(r.rapidCorrect, r.rapid, 'i')} doğruydu.`;
    issues.push(
      v(
        `${capTr(rapidOf)} cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdin. ${right} Bu sorularda okumadan seçmiş olabilirsin.`,
        `Çocuğunuz ${rapidOf} cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdi. ${right} Bu sorularda okumadan seçmiş olabilir.`,
      ),
    );
  }
  // Çok hızlı cevap uyarısı varken "hız tek başına iyi ya da kötü değildir" denmez.
  const noLimit = rapid
    ? ''
    : v(
        ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.',
        ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru karara ulaşabilmektir.',
      );
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? {
          ...card('ma_calisma'),
          headline: 'Süre hesaplanamadı',
          text: [...issues, 'Cevap süreleri alınamadığı için süreler hesaplanamadı.'].join(' '),
        }
      : {
          ...card('ma_calisma'),
          headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
          visual: timeStrip(r.rts, r.medianRt),
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
  // Sonuç yorumlanmıyorsa soru gruplarına göre grafik ve üç boyutlu grafik çizilmez.
  const chart: CognitiveReport['chart'] = notRead
    ? undefined
    : {
        title: 'Soru gruplarına göre doğru cevaplar',
        note: v(
          'Her grupta sekiz soru vardır. İlk iki grup “eğer–ise” kurallarıdır: sonucun kesin olarak çıktığı ve çıkmadığı sorular. Son iki grup “bütün, bazı, hiçbir” sorularıdır: sonucun gerçek hayatla çatışmadığı ve çatıştığı sorular. Çatışan sorularda sonuç bilgilerden kesin olarak çıkar ama gerçekte yanlıştır, ya da bilgilerden çıkmaz ama gerçekte doğrudur. Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğunu doğru cevaplamışsın demektir.',
          'Her grupta sekiz soru vardır. İlk iki grup “eğer–ise” kurallarıdır: sonucun kesin olarak çıktığı ve çıkmadığı sorular. Son iki grup “bütün, bazı, hiçbir” sorularıdır: sonucun gerçek hayatla çatışmadığı ve çatıştığı sorular. Çatışan sorularda sonuç bilgilerden kesin olarak çıkar ama gerçekte yanlıştır, ya da bilgilerden çıkmaz ama gerçekte doğrudur. Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğu doğru cevaplanmış demektir.',
        ),
        rows: LOGIC_GROUPS.map((g) => ({
          label: g.name,
          value: r[g.key].correct,
          max: r[g.key].n,
          valueLabel: `${r[g.key].correct}/${r[g.key].n}`,
        })),
      };
  const figures = [
    { label: 'Doğru', value: notRead ? 'Yorumlanmadı' : `${r.correct}/${r.n}` },
    { label: 'Eğer–ise soruları', value: notRead ? 'Yorumlanmadı' : `${r.conditional.correct}/${r.conditional.n}` },
    { label: 'Gerçek hayatla çatışan sorular', value: notRead ? 'Yorumlanmadı' : noCompare ? 'Karşılaştırılamadı' : `${cf.correct}/${cf.n}` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = notRead
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
    ...(chart ? { chart } : {}),
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
  const few = numericFewAnswered(r);
  const rapid = numericRapid(r);
  const rushed = numericRushed(r);
  // Sonuç yorumlanmaz: cevap yazılan soru çok az ya da soruların çoğunda cevap okunmadan yazılmış olabilir.
  const notRead = few || rushed;
  const good = (g: NumericGroup) => g.correct >= NUMERIC_GOOD;
  const k = r.kinds;
  const manyBlank = !few && r.blank >= NUMERIC_BLANK_MANY;
  const rapidWrong = r.rapid - r.rapidCorrect;
  const notReadWhy = few ? 'Cevap yazılan soru çok az olduğu için' : 'Soruların çoğunda cevap okunmadan yazılmış olabileceği için';

  /* Doğru cevaplar */
  let accText: string;
  if (few) {
    accText = v(
      `Soruların ${countOf(r.blank, r.n, 'inde')} “Bilmiyorum” dedin. Cevap yazdığın soru çok az olduğu için sonuç yorumlanmadı. Dinlendiğin bir gün yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz soruların ${countOf(r.blank, r.n, 'inde')} “Bilmiyorum” dedi. Cevap yazdığı soru çok az olduğu için sonuç yorumlanmadı. Dinlendiği bir gün yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else if (rushed) {
    accText = v(
      `${capTr(`${r.n} sorunun ${countOf(rapidWrong, r.n, 'inde')}`)} cevabı, soruyu okumaya yetmeyecek kadar kısa sürede yazdın ve bu cevaplar yanlıştı. Bu sorulara okumadan cevap vermiş olabilirsin. Bu yüzden sonuç yorumlanmadı. Acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${r.n} sorunun ${countOf(rapidWrong, r.n, 'inde')} cevabı, soruyu okumaya yetmeyecek kadar kısa sürede yazdı ve bu cevaplar yanlıştı. Bu sorulara okumadan cevap vermiş olabilir. Bu yüzden sonuç yorumlanmadı. Acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    // "Hem … hem …" yalnızca üç grubun her birinde en çok bir yanlış varken: ötekinde aşağıdaki kartlar yanılgıyı anlatır.
    const allGroups = [r.prop, r.nonProp, r.equal].every((g) => g.correct >= g.n - 1);
    if (r.correct === r.n) {
      accText = v(
        'Bütün sorularda doğru cevap verdin: hem günlük durumlarda hem de eşitliklerde sayılar arasındaki ilişkiyi doğru kurdun.',
        'Çocuğunuz bütün sorularda doğru cevap verdi: hem günlük durumlarda hem de eşitliklerde sayılar arasındaki ilişkiyi doğru kurdu.',
      );
    } else if (r.correct >= r.n - 2 && allGroups) {
      accText = v(
        'Soruların hemen hepsinde doğru cevap verdin: hem günlük durumlarda hem de eşitliklerde sayılar arasındaki ilişkiyi doğru kurdun.',
        'Çocuğunuz soruların hemen hepsinde doğru cevap verdi: hem günlük durumlarda hem de eşitliklerde sayılar arasındaki ilişkiyi doğru kurdu.',
      );
    } else if (r.correct >= r.n - 2) {
      accText = v(
        'Soruların hemen hepsinde doğru cevap verdin. Doğru bulamadığın birkaç sorunun hangi türden olduğunu aşağıdaki kartlar gösterir.',
        'Çocuğunuz soruların hemen hepsinde doğru cevap verdi. Doğru bulamadığı birkaç sorunun hangi türden olduğunu aşağıdaki kartlar gösterir.',
      );
    } else {
      const first =
        r.correct === 0
          ? v('Hiçbir soruda doğru cevap vermedin.', 'Çocuğunuz hiçbir soruda doğru cevap vermedi.')
          : v(
              `Soruların ${2 * r.correct > r.n ? 'yarısından çoğunda' : 2 * r.correct === r.n ? 'yarısında' : 'yarısından azında'} doğru cevap verdin.`,
              `Çocuğunuz soruların ${2 * r.correct > r.n ? 'yarısından çoğunda' : 2 * r.correct === r.n ? 'yarısında' : 'yarısından azında'} doğru cevap verdi.`,
            );
      accText = `${first} Toplamdan çok, hangi tür sorularda hangi yanılgının görüldüğü daha çok şey söyler (aşağıdaki kartlar).`;
    }
    if (manyBlank) {
      accText += v(
        ` Soruların ${countOf(r.blank, r.n, 'inde')} “Bilmiyorum” dediğin için türlere göre sonuçlar dikkatle okunmalı.`,
        ` Soruların ${countOf(r.blank, r.n, 'inde')} “Bilmiyorum” dendiği için türlere göre sonuçlar dikkatle okunmalı.`,
      );
    }
    if (rapid) {
      accText += v(
        ` ${rapidWrong} soruda acele etmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.`,
        ` ${rapidWrong} soruda acele edilmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.`,
      );
    }
  }
  // Yorumlanmayan sonucun rozeti ve grafiği de yorumlanmış gibi görünmez.
  const dogru: CognitiveBlock = notRead
    ? { ...card('sy_dogru'), headline: 'Yorumlanmadı', text: accText }
    : {
        ...card('sy_dogru'),
        headline: `${r.n} soruda ${r.correct} doğru`,
        text: accText,
        visual: {
          type: 'bars',
          label: 'Doğru cevaplanan sorular',
          scale: 'share',
          rows: [
            { label: 'Durum soruları', value: r.prop.correct + r.nonProp.correct, max: r.prop.n + r.nonProp.n, valueLabel: `${r.prop.correct + r.nonProp.correct}/${r.prop.n + r.nonProp.n}` },
            { label: 'Eşitlik ve denge soruları', value: r.equal.correct, max: r.equal.n, valueLabel: `${r.equal.correct}/${r.equal.n}` },
          ],
        } satisfies BarsVisual,
      };
  // Bir kartın sorularında "Bilmiyorum" denmişse söylenir: bunlar yanlış cevap değildir ama doğru sayılmadı.
  const blankNote = (b: number) =>
    b === 0
      ? ''
      : v(
          ` Bu sorulardan ${b === 1 ? 'birinde' : `${b} tanesinde`} “Bilmiyorum” dedin; ${b === 1 ? 'bu soru' : 'bunlar'} doğru sayılmadı.`,
          ` Bu sorulardan ${b === 1 ? 'birinde' : `${b} tanesinde`} “Bilmiyorum” dedi; ${b === 1 ? 'bu soru' : 'bunlar'} doğru sayılmadı.`,
        );

  /* Orantı mı, fark mı? */
  const P = r.prop;
  const N = r.nonProp;
  const add = r.lures.additive;
  const pro = r.lures.proportional;
  const inv = r.lures.inverse;
  const driven = numericNumberDriven(r);
  let oranti: CognitiveBlock;
  if (notRead) {
    oranti = { ...card('sy_oranti'), headline: 'Yorumlanmadı', text: `${notReadWhy} bu sorulardaki sonuç yorumlanmadı.` };
  } else {
    let oText: string;
    if (good(P) && good(N)) {
      const how = P.correct + N.correct === P.n + N.n ? 'her soruda' : 'çoğunlukla';
      oText = v(
        `Orantılı durumları, orantılı olmayanlardan ${how} ayırt ettin. Orantılı durumlarda iki nicelik aynı oranda büyür; ötekilerde fark korunur, bir başlangıç miktarı vardır ya da sonuç hiç değişmez.`,
        `Çocuğunuz orantılı durumları, orantılı olmayanlardan ${how} ayırt etti. Orantılı durumlarda iki nicelik aynı oranda büyür; ötekilerde fark korunur, bir başlangıç miktarı vardır ya da sonuç hiç değişmez.`,
      );
    } else if (P.correct < N.correct) {
      oText = v('Orantılı durumlarda, orantılı olmayanlardan daha az doğru cevap verdin.', 'Çocuğunuz orantılı durumlarda, orantılı olmayanlardan daha az doğru cevap verdi.');
    } else if (N.correct < P.correct) {
      oText = v('Orantılı olmayan durumlarda, orantılı olanlardan daha az doğru cevap verdin.', 'Çocuğunuz orantılı olmayan durumlarda, orantılı olanlardan daha az doğru cevap verdi.');
    } else {
      oText = v('Orantılı ve orantılı olmayan durumlarda aynı sayıda doğru cevap verdin.', 'Çocuğunuz orantılı ve orantılı olmayan durumlarda aynı sayıda doğru cevap verdi.');
    }
    if (driven) {
      // Yanlışlar sayıların yapısına göre ayrılıyor: aynı yanlışlar ikinci bir nedenle (yaşa bağlı yanılgı) anlatılmaz.
      oText += v(
        ' Sayılar birbirinin katı olmadığında farkı korudun, katı olduğunda ise orantı kurdun. Yöntemi durumdan çok sayılara bakarak seçmiş olabilirsin.',
        ' Sayılar birbirinin katı olmadığında farkı korudu, katı olduğunda ise orantı kurdu. Yöntemi durumdan çok sayılara bakarak seçmiş olabilir.',
      );
      if (!adult) oText += ' Bir araştırmada da sayılar birbirinin katı olduğunda orantının, olmadığında farkın daha sık kullanıldığı görülmüştür.';
    } else if (add >= NUMERIC_LURE_NOTE) {
      oText += v(
        ` Orantılı durumların ${countOf(add, P.n, 'inde')} iki sayı arasındaki farkı korudun.`,
        ` Orantılı durumların ${countOf(add, P.n, 'inde')} iki sayı arasındaki farkı korudu.`,
      );
      oText +=
        ' Oysa bu durumlarda fark değil oran korunur. Biri iki katına çıkınca öteki de iki katına çıkar. Örneğin 3 bardak suya 1 limon sıkılıyorsa 6 bardak suya 2 limon sıkılır.';
      if (!adult) oText += ' Bir araştırmada bu yanılgı 4. sınıftan 6. sınıfa doğru arttı, sonraki sınıflarda azaldı.';
    }
    // Sayılara göre yöntem seçmede sayılan orantı cevapları dışında da orantı kurulmuşsa.
    const proOther = driven ? pro - r.intProportional : pro;
    if (proOther >= NUMERIC_LURE_NOTE) {
      const why = [
        ...(r.propLures.a ? ['Aynı hızla ilerleyen iki şeyde aradaki fark hep aynı kalır.'] : []),
        ...(r.propLures.f ? ['Başlangıçta var olan miktar katlanmaz; yalnızca sonradan eklenen kısım artar.'] : []),
        ...(r.propLures.c ? ['Bazı durumlarda miktar artsa da sonuç hiç değişmez.'] : []),
      ];
      oText += v(
        ` Orantılı olmayan durumların ${countOf(pro, N.n, 'inde')} orantı kurdun. Oysa her durum orantılı değildir. ${why.join(' ')}`,
        ` Orantılı olmayan durumların ${countOf(pro, N.n, 'inde')} orantı kurdu. Oysa her durum orantılı değildir. ${why.join(' ')}`,
      );
      if (!adult) oText += ' Bir araştırmada 2–6. sınıf öğrencilerinin orantılı olmayan problemlere verdiği cevapların üçte birinden fazlası orantı kuruyordu.';
    }
    // Bu yanılgı yalnızca bir soruda (değişmeyen durum) olabildiği için tek cevapta anlatılır.
    if (inv >= 1) {
      oText += v(' Bir soruda miktar artınca süreyi kısalttın; oysa o durumda süre hiç değişmiyordu.', ' Bir soruda miktar artınca süreyi kısalttı; oysa o durumda süre hiç değişmiyordu.');
    }
    if (driven || add >= NUMERIC_LURE_NOTE || proOther >= NUMERIC_LURE_NOTE) {
      oText += v(
        ' Böyle sorularda önce “Biri iki katına çıkınca öteki de iki katına çıkar mı?” diye sormak işine yarayabilir.',
        ' Böyle sorularda önce “Biri iki katına çıkınca öteki de iki katına çıkar mı?” diye sormak çocuğunuza yardım edebilir.',
      );
    }
    oranti = {
      ...card('sy_oranti'),
      headline: `Orantılı ${P.correct}/${P.n} · Orantılı olmayan ${N.correct}/${N.n}`,
      text: oText + blankNote(P.blank + N.blank) + ' Her tür birkaç soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
      visual: {
        type: 'bars',
        label: 'Durum türlerine göre doğru cevaplar',
        scale: 'share',
        rows: [
          { label: 'Orantılı: sayılar birbirinin katı', g: r.pInt },
          { label: 'Orantılı: sayılar birbirinin katı değil', g: r.pFrac },
          { label: 'Orantılı değil: fark korunuyor', g: k.a },
          { label: 'Orantılı değil: başta bir miktar var', g: k.f },
          { label: 'Orantılı değil: sonuç değişmiyor', g: k.c },
        ].map((x) => ({ label: x.label, value: x.g.correct, max: x.g.n, valueLabel: `${x.g.correct}/${x.g.n}` })),
      } satisfies BarsVisual,
    };
  }

  /* Eşitlik ve denge */
  const E = r.equal;
  const op = r.lures.operational;
  const rev = r.lures.reverse;
  const part = r.lures.partial;
  let esitlik: CognitiveBlock;
  if (notRead) {
    esitlik = { ...card('sy_esitlik'), headline: 'Yorumlanmadı', text: `${notReadWhy} bu sorulardaki sonuç yorumlanmadı.` };
  } else {
    let eText: string;
    // "Çoğunlukla buldun" yalnızca eşitlik yanılgılarından biri iki ya da daha çok cevapta görülmemişken.
    if (good(E) && op < NUMERIC_LURE_NOTE && rev < NUMERIC_LURE_NOTE) {
      const how = E.correct === E.n ? 'her soruda' : 'çoğunlukla';
      eText = v(
        `Eşitliğin iki yanının aynı değerde olduğunu kullanarak eksik sayıyı ${how} buldun.`,
        `Çocuğunuz eşitliğin iki yanının aynı değerde olduğunu kullanarak eksik sayıyı ${how} buldu.`,
      );
    } else if (E.correct === 0) {
      eText = v('Eşitlik ve denge sorularının hiçbirinde doğru cevap vermedin.', 'Çocuğunuz eşitlik ve denge sorularının hiçbirinde doğru cevap vermedi.');
    } else if (2 * E.correct < E.n) {
      eText = v('Eşitlik ve denge sorularının çoğunda doğru cevabı bulamadın.', 'Çocuğunuz eşitlik ve denge sorularının çoğunda doğru cevabı bulamadı.');
    } else {
      eText = v('Eşitlik ve denge sorularının bazılarında doğru cevabı bulamadın.', 'Çocuğunuz eşitlik ve denge sorularının bazılarında doğru cevabı bulamadı.');
    }
    if (op >= NUMERIC_LURE_NOTE) {
      eText += v(
        ` ${op} soruda eşittir işaretinin solundaki işlemin sonucunu ya da bütün sayıların toplamını yazdın. “=” işaretini “sonuç şudur” diye okumuş olabilirsin.`,
        ` ${op} soruda eşittir işaretinin solundaki işlemin sonucunu ya da bütün sayıların toplamını yazdı. “=” işaretini “sonuç şudur” diye okumuş olabilir.`,
      );
      eText += ' Oysa “=” iki yanın aynı değerde olduğunu söyler; örneğin 5 + 3 = 6 + 2.';
      if (!adult) eText += ' Bir araştırmada ortaokul öğrencilerinin yaklaşık yarısı eşittir işaretini “sonuç” diye tanımladı.';
    }
    if (rev >= NUMERIC_LURE_NOTE) {
      eText += v(
        ` ${rev} soruda bir sayı değişince ötekini ters yönde değiştirdin.`,
        ` ${rev} soruda bir sayı değişince ötekini ters yönde değiştirdi.`,
      );
      eText +=
        ' Eşitliğin iki yanı aynı kalsın diye toplamada ve çarpmada biri büyüyünce öteki küçülür. Çıkarmada ve bölmede ise ikisi birlikte büyür ya da birlikte küçülür.';
    }
    // Terazi soruları iki tane olduğu için bu yanılgı tek cevapta anlatılır.
    if (part >= 1) {
      const where = part === k.bal.n ? (k.bal.n === 2 ? 'ikisinde de' : 'hepsinde') : part === 1 ? 'birinde' : `${part} tanesinde`;
      eText += v(
        ` Terazi sorularının ${where} terazilerin verdiği bilgilerden birini hesaba katmamış olabilirsin. İki kefenin aynı ağırlıkta olduğunu kullanarak adım adım ilerlemek işine yarayabilir.`,
        ` Terazi sorularının ${where} terazilerin verdiği bilgilerden birini hesaba katmamış olabilir. İki kefenin aynı ağırlıkta olduğunu kullanarak adım adım ilerlemek ona yardım edebilir.`,
      );
    }
    esitlik = {
      ...card('sy_esitlik'),
      headline: `${E.n} soruda ${E.correct} doğru`,
      text: eText + blankNote(E.blank) + ' Her tür birkaç soruya dayanır; bu kaba bir göstergedir.',
      visual: {
        type: 'bars',
        label: 'Soru türlerine göre doğru cevaplar',
        scale: 'share',
        rows: [
          { label: 'Eşittir işareti', g: k.eq },
          { label: 'Denkleştirme', g: k.comp },
          { label: 'Terazi', g: k.bal },
        ].map((x) => ({ label: x.label, value: x.g.correct, max: x.g.n, valueLabel: `${x.g.correct}/${x.g.n}` })),
      } satisfies BarsVisual,
    };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (r.blank > 0 && !few) {
    issues.push(
      v(
        `Soruların ${countOf(r.blank, r.n, 'inde')} “Bilmiyorum” dedin. Bu düğme, emin olunmayan soruda tahmin etmek yerine kullanılır; bu sorular doğru sayılmadı.`,
        `Çocuğunuz soruların ${countOf(r.blank, r.n, 'inde')} “Bilmiyorum” dedi. Bu düğme, emin olunmayan soruda tahmin etmek yerine kullanılır; bu sorular doğru sayılmadı.`,
      ),
    );
  }
  if (r.rapidBlank >= NUMERIC_RAPID_BLANK && !few) {
    issues.push(
      v(
        `${r.rapidBlank} soruda, soruyu okumaya yetmeyecek kadar kısa sürede “Bilmiyorum” dedin. Bu soruları atlamış olabilirsin.`,
        `Çocuğunuz ${r.rapidBlank} soruda, soruyu okumaya yetmeyecek kadar kısa sürede “Bilmiyorum” dedi. Bu soruları atlamış olabilir.`,
      ),
    );
  }
  if (rapid) {
    issues.push(
      rushed
        ? v(
            `${capTr(`${r.n} sorunun ${countOf(rapidWrong, r.n, 'inde')}`)} cevabı, soruyu okumaya yetmeyecek kadar kısa sürede yazdın ve bu cevaplar yanlıştı. Bu sorulara okumadan cevap vermiş olabilirsin.`,
            `Çocuğunuz ${r.n} sorunun ${countOf(rapidWrong, r.n, 'inde')} cevabı, soruyu okumaya yetmeyecek kadar kısa sürede yazdı ve bu cevaplar yanlıştı. Bu sorulara okumadan cevap vermiş olabilir.`,
          )
        : v(
            `${rapidWrong} soruda cevabı çok kısa sürede yazdın ve bu cevaplar yanlıştı. Bu sorularda acele etmiş olabilirsin.`,
            `Çocuğunuz ${rapidWrong} soruda cevabı çok kısa sürede yazdı ve bu cevaplar yanlıştı. Bu sorularda acele etmiş olabilir.`,
          ),
    );
  }
  // Acele edilmiş olabileceği söylenirken "hız tek başına iyi ya da kötü değildir" denmez.
  const noLimit = rapid
    ? ''
    : v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru sonuca ulaşabilmektir.');
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? { ...card('sy_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler hesaplanamadı.'].join(' ') }
      : {
          ...card('sy_calisma'),
          headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
          visual: timeStrip(r.rts, r.medianRt),
          text:
            [v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`), ...issues].join(' ') + noLimit,
        };

  /* Grafikler ve öne çıkan sayılar */
  const groupNote =
    'Her grupta sekiz soru vardır. Orantılı durumlarda iki nicelik aynı oranda büyür. Orantılı olmayan durumlarda aradaki fark korunur, bir başlangıç miktarı vardır ya da sonuç hiç değişmez. Eşitlik ve denge sorularında eşitliğin ya da terazinin iki yanı aynı değerdedir.';
  // Sonuç yorumlanmıyorsa soru gruplarına göre grafik ve üç boyutlu grafik çizilmez.
  const chart: CognitiveReport['chart'] = notRead
    ? undefined
    : {
        title: 'Soru gruplarına göre doğru cevaplar',
        note: v(
          `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
          `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğu doğru cevaplanmış demektir.`,
        ),
        rows: NUMERIC_GROUPS.map((g) => ({ label: g.name, value: r[g.key].correct, max: r[g.key].n, valueLabel: `${r[g.key].correct}/${r[g.key].n}` })),
      };
  const figures = [
    { label: 'Doğru', value: notRead ? 'Yorumlanmadı' : `${r.correct}/${r.n}` },
    { label: 'Durum soruları', value: notRead ? 'Yorumlanmadı' : `${r.prop.correct + r.nonProp.correct}/${r.prop.n + r.nonProp.n}` },
    { label: 'Eşitlik soruları', value: notRead ? 'Yorumlanmadı' : `${r.equal.correct}/${r.equal.n}` },
    ...(r.blank > 0 ? [{ label: '“Bilmiyorum” denen sorular', value: String(r.blank) }] : []),
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = notRead
    ? undefined
    : {
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
  return { blocks: [dogru, oranti, esitlik, calisma], ...(chart ? { chart } : {}), figures, ...(profile ? { profile } : {}) };
}

/* ---------- Gizli şekiller ---------- */

/** Yanlış seçeneklerin yanılgıları için kısa bir ipucu (yanlışların yorumunda). */
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
export const HIDDEN_LURE_SEEN: Record<HiddenLure, string> = {
  turned: 'şeklin döndürülmüş ya da ters çevrilmiş biçimi',
  changed: 'şeklin bir köşesi farklı benzeri',
};

/** Gizli şekillerin dört sonuç kartı, düzeylere göre grafik ve öne çıkan sayılar. */
function hiddenBlocks(r: HiddenResult, task: HiddenFiguresTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = hiddenChance(r);
  const rapid = hiddenRapid(r);
  const samePos = hiddenSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışlarda beklenenden sık görülen yanılgılar anlatılır; o zaman kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
  // Sonuç kuşkuluysa (çok hızlı ya da hep aynı yer) dikkatsizlik de yanılgı da yorumlanmaz.
  const noted = chance || doubt ? [] : HIDDEN_LURES_ORDER.filter((k) => hiddenLureStandsOut(r, k));
  const lureNoted = noted.length > 0;
  const blameSlip = !lureNoted && !doubt;
  const passed = (l: { correct: number; n: number }) => l.correct / l.n >= MATRIX_LEVEL_PASS;
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);
  const intro = `Şekiller kolaydan zora doğru ${levelWord} düzeyde giderek daha iyi saklanıyordu.`;
  // Kolay sorulardaki yanlışlar dikkat ya da aceleyle açıklanacaksa bu yalnızca bir kartta söylenir: hiçbir düzeye
  // ulaşılmadıysa "Ulaşılan düzey" kartında, yoksa "Doğru cevaplar" kartında.
  const levelCardBlames = blameSlip && !chance && r.reached === 0;
  const blameHere = blameSlip && !levelCardBlames;

  /* Doğru cevaplar */
  let accText: string;
  const first = r.levels[0];
  // Rastgele seçim düzeyinde yanlışların çoğu döndürülmüş biçimse yönerge farklı anlaşılmış olabilir (döndürülmüş ya da
  // ters çevrilmiş şekil doğru sayılmaz); çalışma biçiminde kuşku varsa bu söylenmez.
  const turnedMost = chance && !doubt && r.luresByKind.turned >= Math.max(6, 0.6 * r.wrong);
  if (chance) {
    accText =
      levelChanceText(v, r.n, HIDDEN_CHANCE_MAX) +
      (turnedMost
        ? v(
            ' Yanlış cevaplarının çoğunda aranan şeklin döndürülmüş ya da ters çevrilmiş biçimini seçtin. Yönergeyi farklı anlamış olabilirsin: döndürülmüş ya da ters çevrilmiş şekil doğru cevap sayılmaz.',
            ' Çocuğunuz yanlış cevaplarının çoğunda aranan şeklin döndürülmüş ya da ters çevrilmiş biçimini seçti. Yönergeyi farklı anlamış olabilir: döndürülmüş ya da ters çevrilmiş şekil doğru cevap sayılmaz.',
          )
        : '');
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
        `${intro} Çocuğunuz ${which} doğru cevaplamadı ama daha zor düzeylerdeki soruların ${share} doğru buldu.${blameHere ? ' Bu, testin başında çocuğunuzun dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.' : ''}`,
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
          `${intro} Çocuğunuz zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdi${blameHere ? '; kolay sorulardaki yanlışlar çocuğunuzun dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.' : '.'}`,
        );
      } else {
        const slip =
          blameHere && hardRate >= MATRIX_LEVEL_PASS && easyLevels.some((l) => l.correct < l.n)
            ? v(' Kolay sorulardaki yanlışlar dikkatinin dağılmasından ya da acele etmekten kaynaklanmış olabilir.', ' Kolay sorulardaki yanlışlar çocuğunuzun dikkatinin dağılmasından ya da acele etmesinden kaynaklanmış olabilir.')
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
        ' Çocuğunuz bazı sorularda çizimlere bakmadan seçmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('gs_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const duzey = reachedLevelBlock({
    base: card('gs_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: chance ? 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' : null,
    zeroCause: lureNoted ? [' Bu, yönergeyi tam anlamamaktan ya da “Yanlışlarda seçilen şekiller” kartında anlatılan yanılgıdan kaynaklanabilir.', ' Bu, çocuğunuzun yönergeyi tam anlamamasından ya da “Yanlışlarda seçilen şekiller” kartında anlatılan yanılgıdan kaynaklanabilir ve tek başına yorumlanmamalıdır.'] : doubt ? ZERO_DOUBT : levelCardBlames ? ZERO_CAUSE : ['', ''],
    rapid: rapid,
    doubt,
  });

  /* Yanlışlarda seçilen şekiller */
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
    const how = 'Yanlış seçeneklerde iki tür tuzak vardı: aranan şeklin döndürülmüş ya da ters çevrilmiş biçimi ve bir köşesi farklı bir benzeri.';
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
      // Her öne çıkan yanılgı: kaç yanlışta görüldüğü ve rastgele seçimle açıklanamayacak kadar sık olduğu.
      const seen = noted.map((x) => `${r.luresByKind[x] === r.wrong ? 'hepsinde' : `${r.luresByKind[x]} tanesinde`} ${HIDDEN_LURE_SEEN[x]} seçildi`);
      const these = noted.length > 1 ? 'Bunlar' : 'Bu';
      text = v(
        `${how} ${r.wrong} yanlış cevabının ${joinTr(seen)}. ${these}, rastgele seçimle açıklanamayacak kadar sık. ${noted.map((x) => HIDDEN_LURE_TIP[x].you).join(' ')}`,
        `${how} Çocuğunuzun ${r.wrong} yanlış cevabının ${joinTr(seen)}. ${these}, rastgele seçimle açıklanamayacak kadar sık. ${noted.map((x) => HIDDEN_LURE_TIP[x].parent).join(' ')}`,
      );
    } else if (r.wrong >= HIDDEN_LURE_NOTE) {
      head = 'Belirgin bir yanılgı yok';
      const only = HIDDEN_LURES_ORDER.find((k) => r.luresByKind[k] === r.wrong);
      text = only
        ? v(
            `${how} ${r.wrong} yanlış cevabının hepsinde ${HIDDEN_LURE_SEEN[only]} seçildi. Yanlış sayısı az olduğu için bunun rastlantı olup olmadığı söylenemez.`,
            `${how} Çocuğunuzun ${r.wrong} yanlış cevabının hepsinde ${HIDDEN_LURE_SEEN[only]} seçildi. Yanlış sayısı az olduğu için bunun rastlantı olup olmadığı söylenemez.`,
          )
        : v(
            `${how} ${r.wrong} yanlış cevabın bu iki türe dağılıyor; öne çıkan bir yanılgı görülmedi.`,
            `${how} Çocuğunuzun ${r.wrong} yanlış cevabı bu iki türe dağılıyor; öne çıkan bir yanılgı görülmedi.`,
          );
    } else {
      head = r.wrong === 1 ? 'Bir yanlış' : `${r.wrong} yanlış`;
      text = v(
        `${how} Yanlış cevapların çok az olduğu için hangi yanılgının öne çıktığı söylenemez.`,
        `${how} Çocuğunuzun yanlış cevapları çok az olduğu için hangi yanılgının öne çıktığı söylenemez.`,
      );
    }
    yanilgi = { ...card('gs_yanilgi'), headline: head, text };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede şekli dört kalabalık çizimde aramak zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede şekli dört kalabalık çizimde aramak zordur; bu sorularda tahmin etmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !chance && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('gs_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = chance ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    const found =
      r.medianRtCorrect !== null && r.correct >= 3 && r.correct < r.n && !chance && !doubt
        ? v(` Doğru bulduğun sorularda şekli bulman tipik olarak ${seconds(r.medianRtCorrect)} sürdü.`, ` Doğru bulduğu sorularda şekli bulması tipik olarak ${seconds(r.medianRtCorrect)} sürdü.`)
        : '';
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.${found}`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.${found}`);
    calisma = {
      ...card('gs_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
        : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels);
  if (!chance) duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (yanilgi.headline !== 'Yorumlanmadı') {
    const other = r.wrong - r.luresByKind.turned - r.luresByKind.changed;
    yanilgi.visual = {
      type: 'stack',
      label: 'Soruların dağılımı',
      total: r.n,
      parts: [
        { label: 'Doğru şekil', value: r.correct },
        { label: 'Döndürülmüş ya da ters çevrilmiş şekil', value: r.luresByKind.turned },
        { label: 'Bir köşesi farklı benzer', value: r.luresByKind.changed },
        ...(other > 0 ? [{ label: 'Başka bir yanlış seçenek', value: other }] : []),
      ],
    };
  }
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '3–4. düzey', ms: comparePace ? r.rtHard : null });
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
  opposite: 'küpte karşı karşıya gelen iki yüzü yan yana sanmak',
  order: 'bir köşede buluşan üç yüzün sırasını ayna görüntüsündeki gibi ters görmek',
  turn: 'bir yüzdeki şeklin yönünü yanlış görmek',
};
export const CUBE_LURE_TIP: Record<CubeLure, string> = {
  opposite:
    'Açınımda düz bir sırada aralarında tek bir kare bulunan iki yüz küpte karşı karşıya gelir. Düz bir sıranın bir yanına bağlı bir yüz ile öbür yanına bağlı bir yüz de karşı karşıya gelir (Z ya da S biçiminin iki ucu gibi). Karşılıklı iki yüz küpte hiçbir zaman yan yana gelmez; bu yüzden bir küp resminde ikisi birden görünmez.',
  order: 'Bir köşede buluşan üç yüzün saat yönündeki sırası, küp nasıl çevrilirse çevrilsin değişmez; açınımda bir noktanın çevresinde duran üç yüzün sırası küpte de aynı kalır.',
  turn: 'Açınımda yan yana duran iki yüz küpte de yan yana kalır; bir şekil açınımda hangi komşu yüze bakıyorsa küpte de o yüze bakar.',
};

/** "“Yüzlerin yeri”" gibi: tür adı tırnak içinde. */
const cubeTypeName = (t: CubeType) => `“${CUBE_TYPES[t].name}”`;

/** Küp açınımının dört sonuç kartı, düzeylere göre grafik ve öne çıkan sayılar. */
function cubeBlocks(r: CubeResult, task: CubeNetTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = cubeChance(r);
  const rapid = cubeRapid(r);
  const samePos = cubeSamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışlarda beklenenden sık görülen yanılgılar anlatılır; o zaman kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
  // Sonuç kuşkuluysa (çok hızlı ya da hep aynı yer) dikkatsizlik de yanılgı da yorumlanmaz.
  const noted = chance || doubt ? [] : CUBE_LURES_ORDER.filter((k) => cubeLureStandsOut(r, k));
  const lureNoted = noted.length > 0;
  const blameSlip = !lureNoted && !doubt;
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);

  /* Doğru cevaplar */
  let accText: string;
  if (chance) {
    accText = levelChanceText(v, r.n, CUBE_CHANCE_MAX);
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['en zor düzeydeki zikzak açınımları da zihninde katlayabildin', 'en zor düzeydeki zikzak açınımları da zihninde katlayabildi'],
      dropWhy: [
        'Bu beklenen bir durumdur: üst düzeylerde açınımlar basamaklı ya da zikzak biçimdedir ve uzaktaki yüzleri yerine getirmek için daha çok katlamayı zihinde izlemek gerekir.',
        'Bu beklenen bir durumdur: üst düzeylerde açınımlar basamaklı ya da zikzak biçimdedir ve uzaktaki yüzleri yerine getirmek için daha çok katlamayı zihinde izlemek gerekir.',
      ],
      hardFrom: 3,
      blame: blameSlip,
      blameInLevel: r.reached === 0,
      doubt,
    });
    if (lureNoted) {
      accText += v(
        ' Yanlış cevaplarında öne çıkan yanılgılar için yüzlerin yeri ve şekillerin yönü kartına bak.',
        ' Yanlış cevaplarda öne çıkan yanılgılar için yüzlerin yeri ve şekillerin yönü kartına bakın.',
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı sorularda açınıma bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı sorularda açınıma bakmadan seçmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('kp_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const duzey = reachedLevelBlock({
    base: card('kp_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: chance ? 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' : null,
    zeroCause: doubt ? ZERO_DOUBT : lureNoted ? [' Bu, yönergeyi tam anlamamaktan ya da yüzlerin yeri ve şekillerin yönü kartında anlatılan yanılgılardan kaynaklanabilir.', ' Bu, çocuğunuzun yönergeyi tam anlamamasından ya da yüzlerin yeri ve şekillerin yönü kartında anlatılan yanılgılardan kaynaklanabilir ve tek başına yorumlanmamalıdır.'] : ZERO_CAUSE,
    rapid: rapid,
    doubt,
  });

  /* Yüzlerin yeri ve şekillerin yönü */
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const sizes = [...new Set(r.types.map((x) => x.n))];
  const rough = ` Her türde ${sizes.length === 1 ? `yalnızca ${sizes[0]} soru` : 'yalnızca birkaç soru'} vardı ve her türde kolaydan zora sorular bulunuyordu; bu yüzden iki tür arasındaki fark yalnızca yaklaşık bir fikir verir.`;
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('kp_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için soru türleri karşılaştırılmadı ve yanlışlardaki yanılgılar yorumlanmadı.' };
  } else {
    const needs =
      hard.length === 1
        ? `Bu sorularda ${CUBE_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => `${cubeTypeName(x)} sorularında ${CUBE_TYPES[x].plain} gerekir.`).join(' ');
    const allRight = r.types.every((x) => x.correct === x.n);
    const head = allRight
      ? 'İki soru türünde de bütün sorular doğru'
      : good.length === r.types.length
        ? 'İki soru türünde de soruların çoğu doğru'
        : good.length === 0
          ? 'İki soru türünde de soruların çoğu doğru değil'
          : `${cubeTypeName(good[0])} sorularının çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `İki soru türünde de ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldun: hem yüzlerin yerini hem de yüzlerdeki şekillerin yönünü ${allRight ? 'her soruda' : 'çoğu soruda'} doğru izledin.`,
        `Çocuğunuz iki soru türünde de ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldu: hem yüzlerin yerini hem de yüzlerdeki şekillerin yönünü ${allRight ? 'her soruda' : 'çoğu soruda'} doğru izledi.`,
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
        ' Çocuğunuz bazı sorularda açınıma bakmadan seçmiş olabileceği için yanlışlardaki yanılgılar yorumlanmadı.',
      );
    } else if (lureNoted) {
      // Her öne çıkan yanılgı ayrı bir cümleyle: kaç yanlışta görüldüğü ve rastgele seçimle açıklanamayacak kadar sık olduğu.
      const seen = noted.map((k) => `${r.luresByKind[k] === r.wrong ? 'hepsinde' : `${r.luresByKind[k]} tanesinde`} şu yanılgı vardı: ${CUBE_LURE_TEXT[k]}`);
      text += v(
        ` ${r.wrong} yanlış cevabının ${seen.join('; ')}. ${noted.length > 1 ? 'Bunlar' : 'Bu'}, rastgele seçimle açıklanamayacak kadar sık. ${noted.map((k) => CUBE_LURE_TIP[k]).join(' ')}`,
        ` Çocuğunuzun ${r.wrong} yanlış cevabının ${seen.join('; ')}. ${noted.length > 1 ? 'Bunlar' : 'Bu'}, rastgele seçimle açıklanamayacak kadar sık. ${noted.map((k) => CUBE_LURE_TIP[k]).join(' ')}`,
      );
    } else if (r.wrong >= CUBE_LURE_NOTE) {
      text += v(
        ' Yanlış cevaplarında öne çıkan bir yanılgı görülmedi.',
        ' Çocuğunuzun yanlış cevaplarında öne çıkan bir yanılgı görülmedi.',
      );
    }
    tur = { ...card('kp_tur'), headline: head, text: text.replace(/ {2,}/g, ' ') };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdin. Bu kadar kısa sürede açınımı zihinde katlayıp dört küpe bakmak çok zordur; bu sorularda tahmin etmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which} 3 saniyeden kısa sürede yanlış cevap verdi. Bu kadar kısa sürede açınımı zihinde katlayıp dört küpe bakmak çok zordur; bu sorularda tahmin etmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !chance && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('kp_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = chance ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('kp_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
        : { label: 'Ulaşılan düzey', value: `${r.reached}. düzey`, note: `${r.levels.length} düzeyden` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  // Yalnızca iki soru türü olduğu için üç boyutlu profil grafiği yoktur (yol haritası en az üç sütun ister).
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels);
  if (!chance) duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!chance) tur.visual = typeBarsVisual('Soru türlerine göre doğru cevaplar', r.types.map((x) => ({ name: CUBE_TYPES[x.type].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '3–4. düzey', ms: comparePace ? r.rtHard : null });
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
  // Tam doğrular az ama seçilen şekillerin çoğu döndürülmüş: çoğu soruda bir doğru, bir ayna (uyarılarla aynı ölçüt).
  const halfPick = !reversed && rotation3dHalfPick(r);
  const chance = r.correct <= ROTATION3D_CHANCE_MAX && !reversed && !halfPick;
  const notRead = reversed || halfPick || chance;
  const noneOfAll = r.none === r.n ? 'hepsinde' : `${r.none} tanesinde`;
  const wrong = r.n - r.correct;
  const [p1, p2] = r.parts;

  /* Doğru cevaplar */
  let accText: string;
  if (reversed) {
    accText = v(
      `${r.n} sorunun ${noneOfAll} iki ayna görüntüsünü birden seçtin; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Yönergeyi ters anlamış, yani döndürülmüş şekiller yerine ayna görüntülerini aramış olabilirsin. Bu yüzden sonuç yorumlanmadı. Alıştırma sorularına yeniden bakıp testi başka bir gün çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${r.n} sorunun ${noneOfAll} iki ayna görüntüsünü birden seçti; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Yönerge ters anlaşılmış, yani döndürülmüş şekiller yerine ayna görüntüleri aranmış olabilir. Bu yüzden sonuç yorumlanmadı. Alıştırma sorularına yeniden bakıp testi başka bir gün çözmesi daha doğru bir sonuç verebilir.`,
    );
  } else if (halfPick) {
    const where = r.half === r.n ? 'Soruların hepsinde' : `${r.n} sorunun ${r.half} tanesinde`;
    accText = v(
      `${where} iki şekilden birini doğru seçtin, öbürü ise bir ayna görüntüsüydü. Rastgele seçen biri bunu bu kadar sık yapmaz. Yönergeyi “biri döndürülmüş, biri ayna görüntüsü” diye anlamış ya da ikinci şekli hep ayna görüntüsüyle karıştırmış olabilirsin; oysa dört şekilden ikisi döndürülmüş hâldir. Bu yüzden sonuç yorumlanmadı. Alıştırma sorularına yeniden bakıp testi başka bir gün çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${lowerFirst(where)} iki şekilden birini doğru seçti, öbürü ise bir ayna görüntüsüydü. Rastgele seçen biri bunu bu kadar sık yapmaz. Yönerge “biri döndürülmüş, biri ayna görüntüsü” diye anlaşılmış ya da ikinci şekil hep ayna görüntüsüyle karıştırılmış olabilir; oysa dört şekilden ikisi döndürülmüş hâldir. Bu yüzden sonuç yorumlanmadı. Alıştırma sorularına yeniden bakıp testi başka bir gün çözmesi daha doğru bir sonuç verebilir.`,
    );
  } else if (chance) {
    accText = v(
      `${r.n} sorunun ${r.correct === 0 ? 'hiçbirinde iki doğru şekli birlikte bulamadın' : `${r.correct === 1 ? 'birinde' : `${r.correct} tanesinde`} iki doğru şekli de buldun`}; bu, seçenekleri rastgele seçen birinin de bulabileceği kadar az. Sorular sana çok zor gelmiş olabilir; yönergeyi tam anlamamış ya da şekillere yeterince bakmadan seçmiş de olabilirsin. Bu yüzden sonuç yorumlanmadı. Dinlendiğin bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${r.n} sorunun ${r.correct === 0 ? 'hiçbirinde iki doğru şekli birlikte bulamadı' : `${r.correct === 1 ? 'birinde' : `${r.correct} tanesinde`} iki doğru şekli de buldu`}; bu, seçenekleri rastgele seçen birinin de bulabileceği kadar az. Sorular ona çok zor gelmiş olabilir; yönerge tam anlaşılmamış ya da şekillere yeterince bakılmadan seçilmiş de olabilir. Bu yüzden sonuç yorumlanmadı. Dinlendiği bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
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
      // Nicelik sayıyla uyuşur: yarısından çoğu, yarısı ya da bir kısmı.
      const [some, rest] =
        2 * r.correct > r.n ? ['yarısından çoğunda', 'öteki sorularda'] : 2 * r.correct === r.n ? ['yarısında', 'öteki yarısında'] : ['bir kısmında', 'çoğunda'];
      accText = v(
        `Soruların ${some} döndürülmüş iki şekli de buldun; ${rest === 'çoğunda' ? 'soruların çoğunda' : rest} ayna görüntülerini döndürülmüş şekillerden ayırmakta zorlandın.`,
        `Çocuğunuz soruların ${some} döndürülmüş iki şekli de buldu; ${rest === 'çoğunda' ? 'soruların çoğunda' : rest} ayna görüntülerini döndürülmüş şekillerden ayırmakta zorlandı.`,
      );
      // Ayna görüntülerinin nasıl seçildiğini ayna kartı anlatıyorsa genel ipucu yinelenmez.
      if (!(mirrorPick && !doubt)) {
        accText += ' Bu tür sorularda şekli zihinde döndürüp her kolun nereye geleceğini izlemek gerekir.';
      }
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
  // Yorumlanmayan sonucun rozeti ve grafiği de yorumlanmış gibi görünmez.
  const dogru: CognitiveBlock = notRead
    ? { ...card('ud_dogru'), headline: 'Yorumlanmadı', text: accText }
    : {
    ...card('ud_dogru'),
    headline: `${r.n} soruda ${r.correct} doğru`,
    text: accText,
    visual: {
      type: 'stack',
      label: 'Sorular',
      total: r.n,
      // Doğru bulunamayan soruların türü Ayna görüntüleri kartının grafiğindedir.
      parts: [
        { label: 'İki doğru şekil de seçildi', value: r.correct },
        { label: 'En az bir ayna görüntüsü seçildi', value: r.n - r.correct },
      ],
    } satisfies StackVisual,
  };

  /* Dik eksen ve yan yatırma */
  const rough = ` Her bölüm ${p1.n} soruya dayanır; bu karşılaştırma kaba bir göstergedir.`;
  let bolum: CognitiveBlock;
  if (notRead) {
    // Neden doğru cevaplar kartıyla aynı söylenir: yönerge ters ya da farklı anlaşılmış olabilir ya da doğrular çok az.
    const why = reversed
      ? 'Yönerge ters anlaşılmış olabileceği için'
      : halfPick
        ? 'Yönerge farklı anlaşılmış olabileceği için'
        : 'Doğru cevaplar çok az olduğu için';
    bolum = { ...card('ud_bolum'), headline: 'Yorumlanmadı', text: `${why} iki bölüm karşılaştırılmadı.` };
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
    // Ayna görüntüleri sık seçildiyse bölümler arasındaki farkın nedeni ayna kartında anlatılır.
    const toMirror = mirrorPick
      ? v(' Yanlış cevaplarındaki seçimler için ayna görüntüleri kartına bak.', ' Yanlış cevaplardaki seçimler için ayna görüntüleri kartına bakın.')
      : '';
    if (doubt) {
      // Bazı sorularda bakmadan seçilmiş olabilir: bölümler arasındaki fark yorumlanmaz; sayılar metinde kalır, grafik çizilmez.
      bolum = {
        ...card('ud_bolum'),
        headline: 'Yorumlanmadı',
        text: `${counts} ${v(
          'Bazı sorularda şekillere bakmadan seçmiş olabileceğin için (çalışma biçimi kartına bak) iki bölüm arasındaki fark yorumlanmadı.',
          'Bazı sorularda şekillere bakılmadan seçilmiş olabileceği için (çalışma biçimi kartına bakın) iki bölüm arasındaki fark yorumlanmadı.',
        )}`,
      };
    } else {
    if (gap >= ROTATION3D_PART_GAP) {
      head = '2. bölümde daha az doğru';
      text =
        v(
          'Yalnızca dik eksen çevresinde döndürülmüş şekillerde (1. bölüm), yan yatırılmış şekillerdekinden (2. bölüm) daha çok soruyu doğru buldun.',
          'Çocuğunuz yalnızca dik eksen çevresinde döndürülmüş şekillerde (1. bölüm), yan yatırılmış şekillerdekinden (2. bölüm) daha çok soruyu doğru buldu.',
        ) +
        (mirrorPick
          ? toMirror
          : ' Yan yatırılmış şekillerde iki dönüşü birlikte izlemek gerekir. Bazı çalışmalarda birden çok yönde döndürülmüş şekiller daha zor bulunmuştur.');
    } else if (gap <= -ROTATION3D_PART_GAP) {
      head = '2. bölümde daha çok doğru';
      text =
        v(
          'Yan yatırılmış şekillerde (2. bölüm), yalnızca dik eksen çevresinde döndürülmüş şekillerdekinden (1. bölüm) daha çok soruyu doğru buldun. Testin başında sorulara alışmak zaman alabilir; ilk bölümdeki yanlışlar bundan da kaynaklanmış olabilir.',
          'Çocuğunuz yan yatırılmış şekillerde (2. bölüm), yalnızca dik eksen çevresinde döndürülmüş şekillerdekinden (1. bölüm) daha çok soruyu doğru buldu. Testin başında sorulara alışmak zaman alabilir; ilk bölümdeki yanlışlar bundan da kaynaklanmış olabilir.',
        ) + toMirror;
    } else if (p1.correct === p1.n && p2.correct === p2.n) {
      head = 'İki bölümde de hepsi doğru';
      text = v(
        'Şekiller yan yatırıldığında da döndürülmüş şekillerin hepsini buldun.',
        'Çocuğunuz şekiller yan yatırıldığında da döndürülmüş şekillerin hepsini buldu.',
      );
    } else {
      head = 'İki bölümde yakın sonuç';
      const both = p1.correct * 3 >= p1.n * 2 && p2.correct * 3 >= p2.n * 2;
      text =
        (both
          ? v(
              'Şekiller yan yatırıldığında da döndürülmüş şekilleri çoğunlukla bulabildin.',
              'Çocuğunuz şekiller yan yatırıldığında da döndürülmüş şekilleri çoğunlukla bulabildi.',
            )
          : v('İki bölümde birbirine yakın sayıda soruyu doğru buldun.', 'Çocuğunuz iki bölümde birbirine yakın sayıda soruyu doğru buldu.')) + toMirror;
    }
    bolum = {
      ...card('ud_bolum'),
      headline: head,
      text: text + rough,
      visual: {
        type: 'bars',
        label: 'İki doğru şeklin de bulunduğu sorular',
        scale: 'share',
        rows: [
          { label: '1. bölüm: dik eksen çevresinde', value: p1.correct, max: p1.n, valueLabel: `${p1.correct}/${p1.n}` },
          { label: '2. bölüm: yan yatırılmış', value: p2.correct, max: p2.n, valueLabel: `${p2.correct}/${p2.n}` },
        ],
      } satisfies BarsVisual,
    };
    }
  }

  /* Ayna görüntüleri */
  let ayna: CognitiveBlock;
  const tip = v(
    ' İpucu: bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirdiğini düşün. Sonra kalan kollara bak. Döndürülmüş şekilde onlar da aynı yöne uzanır; ayna görüntüsünde biri öbür yana uzanır.',
    ' İpucu: bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirip kalan kollara bakmak yardımcı olabilir. Döndürülmüş şekilde onlar da aynı yöne uzanır; ayna görüntüsünde biri öbür yana uzanır.',
  );
  // Doğru bulunamayan sorulardaki seçimler (kartın grafiği).
  const mixVisual: StackVisual = {
    type: 'stack',
    label: 'Doğru bulunamayan sorular',
    total: wrong,
    parts: [
      { label: 'Bir doğru şekil, bir ayna görüntüsü', value: r.half },
      { label: 'İki ayna görüntüsü', value: r.none },
    ],
  };
  const noneOfWrong = r.none === wrong ? 'hepsinde' : `${r.none} tanesinde`;
  if (reversed) {
    ayna = {
      ...card('ud_ayna'),
      headline: 'Yorumlanmadı',
      text: v(
        `${wrong} yanlış cevabının ${noneOfWrong} iki ayna görüntüsünü birden seçtin. Yönergeyi ters anlamış olabileceğin için bu sonuç yorumlanmadı (doğru cevaplar kartına bak).`,
        `Çocuğunuz ${wrong} yanlış cevabının ${noneOfWrong} iki ayna görüntüsünü birden seçti. Yönerge ters anlaşılmış olabileceği için bu sonuç yorumlanmadı (doğru cevaplar kartına bakın).`,
      ),
    };
  } else if (halfPick) {
    ayna = {
      ...card('ud_ayna'),
      headline: 'Yorumlanmadı',
      text: v(
        `Yanlış cevaplarının ${r.half === wrong ? 'hepsinde' : 'çoğunda'} bir doğru şekil ile bir ayna görüntüsü seçtin; yönergeyi farklı anlamış olabileceğin için bu seçimler yorumlanmadı (doğru cevaplar kartına bak).`,
        `Çocuğunuz yanlış cevaplarının ${r.half === wrong ? 'hepsinde' : 'çoğunda'} bir doğru şekil ile bir ayna görüntüsü seçti; yönerge farklı anlaşılmış olabileceği için bu seçimler yorumlanmadı (doğru cevaplar kartına bakın).`,
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
      text: v(
        'Bazı sorularda şekillere bakmadan seçmiş olabileceğin için yanlış cevaplarındaki seçimler yorumlanmadı.',
        'Bazı sorularda şekillere bakılmadan seçilmiş olabileceği için yanlış cevaplardaki seçimler yorumlanmadı.',
      ),
    };
  } else if (mirrorPick) {
    ayna = {
      ...card('ud_ayna'),
      headline: `İki ayna görüntüsü birden: ${r.none} soru`,
      visual: mixVisual,
      text:
        v(
          `Doğru bulamadığın ${wrong} sorunun ${noneOfWrong} iki ayna görüntüsünü birden seçtin; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Bir şeklin hangi kolunun öne, hangisinin arkaya uzandığı ters görülürse şekil ayna görüntüsüne benzer. Bu sorularda şeklin derinliğini ters görmüş olabilirsin. Işık her şekle aynı yönden gelir: ekranın üstünden ve biraz solundan. Işığa dönük yüzler açık, öbürleri koyu renktedir. Bu, her yüzün hangi yöne baktığını anlamana yardım eder.`,
          `Çocuğunuz doğru bulamadığı ${wrong} sorunun ${noneOfWrong} iki ayna görüntüsünü birden seçti; seçenekleri rastgele seçen birinin bunu bu kadar sık yapması pek beklenmez. Bir şeklin hangi kolunun öne, hangisinin arkaya uzandığı ters görülürse şekil ayna görüntüsüne benzer. Bu sorularda şeklin derinliği ters görülmüş olabilir. Işık her şekle aynı yönden gelir: ekranın üstünden ve biraz solundan. Işığa dönük yüzler açık, öbürleri koyu renktedir. Bu, her yüzün hangi yöne baktığını anlamaya yardım eder.`,
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
              `Doğru bulamadığın ${wrong} sorunun ${r.half === 1 ? 'birinde' : `${r.half} tanesinde`} iki şekilden birini doğru seçtin, yani döndürülmüş şekillerden birini tanıyıp ikincisini bir ayna görüntüsüyle karıştırdın; ${r.none} soruda ise iki ayna görüntüsünü birden seçtin.`,
              `Çocuğunuz doğru bulamadığı ${wrong} sorunun ${r.half === 1 ? 'birinde' : `${r.half} tanesinde`} iki şekilden birini doğru seçti, yani döndürülmüş şekillerden birini tanıyıp ikincisini bir ayna görüntüsüyle karıştırdı; ${r.none} soruda ise iki ayna görüntüsünü birden seçti.`,
            );
    ayna = {
      ...card('ud_ayna'),
      headline: rotation3dMixHeadline(r),
      visual: mixVisual,
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
    calisma = { ...card('ud_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler hesaplanamadı.'].join(' ') };
  } else {
    let pace = '';
    // Bölümler karşılaştırılmadıysa (doğrular çok az) ya da bakmadan seçilmiş olabilirse süreler de karşılaştırılmaz.
    const comparePace = !doubt && !notRead && p1.medianRt !== null && p2.medianRt !== null;
    if (comparePace && p1.medianRt !== null && p2.medianRt !== null) {
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
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
      visual:
        comparePace && p1.medianRt !== null && p2.medianRt !== null
          ? ({
              type: 'bars',
              label: 'Soru başına tipik süre',
              scale: 'scale',
              unit: 'sn',
              rows: [
                { label: 'Bütün sorular', value: secValue(r.medianRt), valueLabel: secShort(r.medianRt) },
                { label: '1. bölüm', value: secValue(p1.medianRt), valueLabel: secShort(p1.medianRt) },
                { label: '2. bölüm', value: secValue(p2.medianRt), valueLabel: secShort(p2.medianRt) },
              ],
            } satisfies BarsVisual)
          : timeStrip(r.rts, r.medianRt),
    };
  }

  /* Grafik ve öne çıkan sayılar */
  // Yorumlanmayan sonuçta bölümlere göre grafik de çizilmez.
  const chart: CognitiveReport['chart'] = notRead ? undefined : {
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
    { label: 'Doğru', value: notRead ? 'Yorumlanmadı' : `${r.correct}/${r.n}` },
    { label: 'Doğru seçilen şekiller', value: notRead ? 'Yorumlanmadı' : `${r.figures}/${2 * r.n}` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  // Yalnızca iki bölüm olduğu için üç boyutlu profil grafiği yoktur (yol haritası en az üç sütun ister).
  return { blocks: [dogru, bolum, ayna, calisma], ...(chart ? { chart } : {}), figures };
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
  // İşlemlerde doğru cevap az olmasının iki özel nedeni: süre dolması (yavaş çalışmak) ya da düğmeleri ters kullanmak.
  const opsSlow = complexSpanOpsSlow(r);
  const opsReversed = complexSpanOpsReversed(r);
  const wrongShare = complexSpanWrongShare(r);
  const noRead = recallChance || opsChance;
  const noReadWhy = recallChance
    ? 'Doğru yerde hatırlanan harfler çok az olduğu için'
    : opsSlow
      ? 'İşlemlerin birçoğunda süre dolduğu için'
      : opsReversed
        ? v('İşlemlere çoğunlukla yanlış cevap verdiğin için', 'İşlemlere çoğunlukla yanlış cevap verildiği için')
        : 'Doğru cevaplanan işlemler çok az olduğu için';
  const timeoutCount = O.timeouts === O.n ? 'hepsinde' : `${O.timeouts} tanesinde`;
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
    // Doğru yerde olmayan yerlerin çoğu boşsa harfler boş bırakılmıştır; değilse rastgele seçilmiş olabilir.
    const blankMost = 2 * r.blank > N - X;
    harfText = v(
      `${N} harften ${X === 0 ? 'hiçbirini doğru yerde seçemedin' : `yalnızca ${csCount(X, 'ini')} doğru yerde seçtin`}; bu, harfleri rastgele seçen birinin de bulabileceği kadar az. Yönergeyi tam anlamamış, ${blankMost ? 'harfleri boş bırakmış' : 'harfleri rastgele seçmiş'} ya da görevi yarıda bırakmış olabilirsin; bu yüzden sonuç yorumlanmadı. Dinlenmiş olduğun bir gün, yönergeyi yeniden okuyup testi baştan çözebilirsin. Aynı diziler yeniden gösterileceği için ikinci denemede sonuç biraz yüksek çıkabilir.`,
      `Çocuğunuz ${N} harften ${X === 0 ? 'hiçbirini doğru yerde seçemedi' : `yalnızca ${csCount(X, 'ini')} doğru yerde seçti`}; bu, harfleri rastgele seçen birinin de bulabileceği kadar az. Yönergeyi tam anlamamış, ${blankMost ? 'harfleri boş bırakmış' : 'harfleri rastgele seçmiş'} ya da görevi yarıda bırakmış olabilir; bu yüzden sonuç yorumlanmadı. Dinlenmiş olduğu bir gün, yönergeyi yeniden okuyup testi baştan çözebilir. Aynı diziler yeniden gösterileceği için ikinci denemede sonuç biraz yüksek çıkabilir.`,
    );
  } else if (opsSlow) {
    harfText = v(
      `Harf sonucu yorumlanmadı: işlemlerin ${timeoutCount} süre doldu (İşlemler kartına bak). İşlemler süresinde yapılmayınca harfleri içinden tekrar etmeye zaman kalır ve harfleri akılda tutmak kolaylaşır. Dinlenmiş olduğun bir gün, işlemlere de özen göstererek testi baştan çözmek daha doğru bir sonuç verebilir.`,
      `Harf sonucu yorumlanmadı: işlemlerin ${timeoutCount} süre doldu (İşlemler kartına bakın). İşlemler süresinde yapılmayınca harfleri içinden tekrar etmeye zaman kalır ve harfleri akılda tutmak kolaylaşır. Dinlenmiş olduğu bir gün, işlemlere de özen göstererek testi baştan çözmesi daha doğru bir sonuç verebilir.`,
    );
  } else if (opsReversed) {
    harfText = v(
      `Harf sonucu yorumlanmadı: işlemlerin ${wrongShare} yanlış cevap verdiğin için işlemleri nasıl yaptığın anlaşılamadı (İşlemler kartına bak). Bu testte harfler, işlemler yapılırken akılda tutulur. Dinlenmiş olduğun bir gün, yönergeyi yeniden okuyup testi baştan çözebilirsin.`,
      `Harf sonucu yorumlanmadı: çocuğunuz işlemlerin ${wrongShare} yanlış cevap verdiği için işlemleri nasıl yaptığı anlaşılamadı (İşlemler kartına bakın). Bu testte harfler, işlemler yapılırken akılda tutulur. Dinlenmiş olduğu bir gün, yönergeyi yeniden okuyup testi baştan çözebilir.`,
    );
  } else if (opsChance) {
    const picked = X === N ? 'harflerin hepsini' : `${N} harften ${csCount(X, 'ini')}`;
    harfText = v(
      `${capTr(picked)} doğru yerde seçtin. Ancak ${opsClause}; bu, rastgele basan birinin de bulabileceği kadar az. Bu testte harfler, işlemler yapılırken akılda tutulur; işlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu yorumlanmadı. Dinlenmiş olduğun bir gün, işlemlere de özen göstererek testi baştan çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${picked} doğru yerde seçti. Ancak ${opsClause}; bu, rastgele basan birinin de bulabileceği kadar az. Bu testte harfler, işlemler yapılırken akılda tutulur; işlemler yapılmadan harfleri akılda tutmak kolaylaşacağı için harf sonucu yorumlanmadı. Dinlenmiş olduğu bir gün, işlemlere de özen göstererek testi baştan çözmesi daha doğru bir sonuç verebilir.`,
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
      const q = X >= 0.95 * N ? 'hemen hepsini' : 'büyük çoğunluğunu';
      level = v(
        `Bu ${N} harfin ${csCount(X, 'ini')} doğru yerde hatırladın: işlemler araya girse de harflerin ${q} doğru sırayla akılda tuttun.`,
        `Çocuğunuz bu ${N} harfin ${csCount(X, 'ini')} doğru yerde hatırladı: işlemler araya girse de harflerin ${q} doğru sırayla akılda tuttu.`,
      );
    } else if (X >= 0.65 * N) {
      level = v(
        `Bu ${N} harfin ${csCount(X, 'ini')} doğru yerde hatırladın: işlemler araya girse de harflerin çoğunu doğru sırayla akılda tuttun.`,
        `Çocuğunuz bu ${N} harfin ${csCount(X, 'ini')} doğru yerde hatırladı: işlemler araya girse de harflerin çoğunu doğru sırayla akılda tuttu.`,
      );
    } else {
      const share = 2 * X > N ? 'yarısından çoğu' : 2 * X === N ? 'yarısı' : 'yarısından azı';
      level = v(
        `Bu ${N} harfin ${csCount(X, 'ini')} doğru yerde hatırladın: harflerin ${share} doğru yerdeydi; öteki harflerde yer karıştı ya da harf hatırlanamadı.`,
        `Çocuğunuz bu ${N} harfin ${csCount(X, 'ini')} doğru yerde hatırladı: harflerin ${share} doğru yerdeydi; öteki harflerde yer karıştı ya da harf hatırlanamadı.`,
      );
    }
    const parts = [intro, level];
    // Dizilerin uzunluğuna göre sonuç (en uzun tam dizi dahil) Dizi uzunluğu kartındadır.
    if (X < N && r.longest === null) {
      parts.push(
        v(
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
          'İşlemlerin bir kısmına bakmadan basmış olabileceğin için (İşlemler kartına bak) harf sonucu dikkatle yorumlanmalıdır: işlemler yapılmadan harfleri akılda tutmak kolaylaşır.',
          'İşlemlerin bir kısmına bakmadan basmış olabileceği için (İşlemler kartına bakın) harf sonucu dikkatle yorumlanmalıdır: işlemler yapılmadan harfleri akılda tutmak kolaylaşır.',
        ),
      );
    } else if (O.accuracy < CS_OPS_TARGET) {
      parts.push(
        v(
          'İşlemlerin %85’inden azını doğru cevapladığın için (İşlemler kartına bak) harf sonucu biraz daha dikkatle yorumlanmalıdır.',
          'İşlemlerin %85’inden azı doğru cevaplandığı için (İşlemler kartına bakın) harf sonucu biraz daha dikkatle yorumlanmalıdır.',
        ),
      );
    }
    harfText = parts.join(' ');
  }
  // Yorumlanmayan harf sonucu rozetiyle ve grafiğiyle yorumlanmış gibi görünmez.
  const harf: CognitiveBlock = noRead
    ? { ...card('hb_harf'), headline: 'Yorumlanmadı', text: harfText }
    : {
        ...card('hb_harf'),
        headline: X === 0 ? `${N} harfin hiçbiri doğru yerde değil` : X === N ? `${N} harfin hepsi doğru yerde` : `${N} harften ${csCount(X, 'i')} doğru yerde`,
        text: harfText,
        visual: {
          type: 'stack',
          label: 'Dizilerdeki harfler',
          total: N,
          parts: [
            { label: 'Doğru yerde hatırlandı', value: X },
            { label: 'Doğru yerde değil', value: N - X },
          ],
        } satisfies StackVisual,
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
    // Rozet, kartın asıl karşılaştırmasıdır (kısa ve uzun diziler); en uzun tam dizi grafikte görünür.
    let badge = 'Uzunlukla pek değişmedi';
    if (pShort >= 0.9 && pLong >= 0.9) {
      text +=
        pLong >= pShort
          ? v(' Diziler uzadıkça sonucun düşmedi.', ' Diziler uzadıkça sonucu düşmedi.')
          : v(' Diziler uzadıkça sonucun pek değişmedi.', ' Diziler uzadıkça sonucu pek değişmedi.');
    } else if (diff >= 0.2) {
      badge = 'Uzun dizilerde belirgin düşüş';
      text += v(
        ' Diziler uzadıkça doğru yerde hatırladığın harflerin oranı düştü. Uzun dizilerde hem akılda tutulacak harf hem araya giren işlem artar; bu yüzden diziler uzadıkça zorlanmak bu görevde olağandır.',
        ' Diziler uzadıkça doğru yerde hatırladığı harflerin oranı düştü. Uzun dizilerde hem akılda tutulacak harf hem araya giren işlem artar; bu yüzden diziler uzadıkça zorlanmak bu görevde olağandır.',
      );
    } else if (diff >= 0.1 && L.letters - L.correct >= 3) {
      // Birkaç harflik farklar yorumlanmaz: uzun dizilerde en az üç yer doğru değilse.
      badge = 'Uzun dizilerde biraz düşüş';
      text += v(
        ' Diziler uzadıkça doğru yerde hatırladığın harflerin oranı biraz düştü.',
        ' Diziler uzadıkça doğru yerde hatırladığı harflerin oranı biraz düştü.',
      );
    } else if (diff <= -0.1 && S.letters - S.correct >= 3) {
      badge = 'Uzun dizilerde daha iyi';
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
    const maxSize = Math.max(...r.bySize.map((x) => x.size));
    text +=
      P === r.sets
        ? v(
            ` Görevdeki en uzun diziler ${maxSize} harfti ve bütün dizileri tam hatırladın; daha uzun dizilerde ne olacağı bu görevden anlaşılamaz.`,
            ` Görevdeki en uzun diziler ${maxSize} harfti ve çocuğunuz bütün dizileri tam hatırladı; daha uzun dizilerde ne olacağı bu görevden anlaşılamaz.`,
          )
        : ' Her uzunlukta yalnızca iki dizi olduğu için bütün harfleri doğru hatırlanan en uzun dizi yalnızca kabaca fikir verir; asıl sonuç, doğru yerde hatırlanan harflerin toplamıdır.';
    uzunluk = {
      ...card('hb_uzunluk'),
      headline: P === r.sets ? 'Bütün diziler tam' : badge,
      text,
      // Her uzunluktaki dizilerden kaçının bütün harfleri doğru sırayla hatırlandı (dolu daire: tam dizi).
      visual: {
        type: 'ladder',
        label: 'Bütün harfleri doğru sırayla hatırlanan diziler',
        rows: r.bySize.map((x) => ({ length: x.size, results: Array.from({ length: x.sets }, (_, i) => i < x.perfect) })),
        reached: r.longest,
        unit: 'harf',
        legend: ['tam', 'eksik'],
      } satisfies LadderVisual,
    };
  }

  /* İşlemler */
  const limitText =
    r.limitMs !== null && O.timeouts > 0
      ? v(
          ` Süre sınırı, alıştırmadaki hızına göre ${csSeconds(r.limitMs)} olarak belirlenmişti; süresi dolan işlemler yanlış sayıldı.`,
          ` Süre sınırı, alıştırmadaki hızına göre ${csSeconds(r.limitMs)} olarak belirlenmişti; süresi dolan işlemler yanlış sayıldı.`,
        )
      : '';
  let islemText: string;
  if (opsSlow) {
    // Süresi içinde cevap verilen işlemler: hepsi, bir kısmı ya da hiçbiri doğru.
    const A = O.correct + O.wrong;
    const answered =
      A === 0
        ? ''
        : O.correct === A
          ? v(`; süresi içinde cevap verdiğin ${A} işlemin hepsi doğruydu`, `; süresi içinde cevap verdiği ${A} işlemin hepsi doğruydu`)
          : O.correct === 0
            ? v(`; süresi içinde cevap verdiğin ${A} işlemin hiçbiri doğru değildi`, `; süresi içinde cevap verdiği ${A} işlemin hiçbiri doğru değildi`)
            : v(`; süresi içinde cevap verdiğin ${A} işlemin ${csCount(O.correct, 'i')} doğruydu`, `; süresi içinde cevap verdiği ${A} işlemin ${csCount(O.correct, 'i')} doğruydu`);
    islemText =
      v(
        `İşlemlerin ${timeoutCount} süre doldu${answered}. İşlemlerde alıştırmadakinden çok daha yavaş çalışmış, ara vermiş ya da yönergeyi tam anlamamış olabilirsin.`,
        `Çocuğunuzun işlemlerinin ${timeoutCount} süre doldu${answered}. İşlemlerde alıştırmadakinden çok daha yavaş çalışmış, ara vermiş ya da yönergeyi tam anlamamış olabilir.`,
      ) + limitText;
  } else if (opsReversed) {
    islemText =
      v(
        `İşlemlerin ${wrongShare} yanlış cevap verdin. Rastgele basan biri bile yaklaşık yarısını doğru bulurdu; bu yüzden DOĞRU ve YANLIŞ düğmelerini ters kullanmış olabilirsin.`,
        `Çocuğunuz işlemlerin ${wrongShare} yanlış cevap verdi. Rastgele basan biri bile yaklaşık yarısını doğru bulurdu; bu yüzden DOĞRU ve YANLIŞ düğmeleri ters kullanılmış olabilir.`,
      ) + limitText;
  } else if (opsChance) {
    islemText = v(
      `${O.n} ${opsClause.replace(/^işlemlerin/, 'işlemin')}; bu, rastgele basan birinin de bulabileceği kadar az.`,
      `Çocuğunuz ${O.n} ${opsClause.replace(/^işlemlerin/, 'işlemin')}; bu, rastgele basan birinin de bulabileceği kadar az.`,
    );
    islemText += v(
      ` ${O.wrong === O.n ? 'İşlemlerin hepsine' : `${O.wrong} işleme`} yanlış cevap verdin; işlemlere bakmadan basmış ya da yönergeyi tam anlamamış olabilirsin.`,
      ` ${O.wrong === O.n ? 'İşlemlerin hepsine' : `${O.wrong} işleme`} yanlış cevap verdi; işlemlere bakmadan basmış ya da yönergeyi tam anlamamış olabilir.`,
    );
    islemText += limitText;
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
          'Bu tür görevlerde, işlemlerin gerçekten yapıldığını görmek için işlemlerin en az %85’inin doğru olması beklenir; bu düzeye ulaştın.',
          'Bu tür görevlerde, işlemlerin gerçekten yapıldığını görmek için işlemlerin en az %85’inin doğru olması beklenir; çocuğunuz bu düzeye ulaştı.',
        ),
      );
    } else {
      parts.push(
        v(
          'Bu tür görevlerde, işlemlerin gerçekten yapıldığını görmek için işlemlerin en az %85’inin doğru olması beklenir; bu düzeyin altında kaldın.',
          'Bu tür görevlerde, işlemlerin gerçekten yapıldığını görmek için işlemlerin en az %85’inin doğru olması beklenir; çocuğunuz bu düzeyin altında kaldı.',
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
        ` İşlemlerin ${rapidPhrase} yarım saniyeden kısa sürede cevap verdin; bu sürede bir işlemi okuyup hesaplamak zordur. Bu işlemlere bakmadan basmış olabilirsin.`,
        ` Çocuğunuz işlemlerin ${rapidPhrase} yarım saniyeden kısa sürede cevap verdi; bu sürede bir işlemi okuyup hesaplamak zordur. Bu işlemlere bakmadan basmış olabilir.`,
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
    text: islemText,
    visual: {
      type: 'stack',
      label: 'İşlemler',
      total: O.n,
      parts: [
        { label: 'Doğru cevaplandı', value: O.correct },
        { label: 'Yanlış cevaplandı', value: O.wrong },
        { label: 'Süre doldu', value: O.timeouts },
      ],
    } satisfies StackVisual,
  };

  /* Hata türleri */
  const E = N - X;
  let hata: CognitiveBlock;
  if (noRead) {
    hata = { ...card('hb_hata'), headline: 'Yorumlanmadı', text: `${noReadWhy} doğru yerde olmayan harflerin türü yorumlanmadı.` };
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
    const rule = ' Bu testte bir harf yalnızca gösterildiği sıradaki yere konursa doğru sayılır.';
    if (r.order === E) {
      // Bütün yanlış yerlerde harf dizide vardı: iki cümlede aynı şeyi söylememek için tek cümle.
      const where = E === 1 ? 'Yanlış olan tek yerde' : `Yanlış olan ${E} yerin hepsinde`;
      text =
        v(
          `${where} seçtiğin harf o dizide vardı, ama yanlış sıraya koydun: harfi hatırladın, sırasını karıştırdın.`,
          `${where} çocuğunuzun seçtiği harf o dizide vardı, ama yanlış sıraya kondu: harf hatırlandı, sırası karıştı.`,
        ) + rule;
    } else if (2 * r.order > E) {
      text += v(' Yeri karışan harflerde harfi hatırladın, sırasını karıştırdın.', ' Yeri karışan harflerde çocuğunuz harfi hatırladı, sırasını karıştırdı.') + rule;
    } else if (2 * r.intrusion > E) {
      text += ' O dizide olmayan bir harfin seçildiği yerlerde harf başka bir harfle karışmış ya da tahmin edilmiş olabilir.';
    } else if (2 * r.blank > E) {
      text += v(
        ' Bu yerlerde harf seçmedin; yani o harfleri hatırlayamadın. Hatırlamadığın yeri boş bırakmak iyi bir yoldur: öteki harfler kendi yerinde kalır ve doğru sayılır.',
        ' Bu yerlerde harf seçilmedi; yani o harfler hatırlanamadı. Hatırlanmayan yeri boş bırakmak iyi bir yoldur: öteki harfler kendi yerinde kalır ve doğru sayılır.',
      );
    } else {
      text += ' Bu yerlerde hata türlerinden hiçbiri ötekilerden belirgin biçimde çok değildi.';
    }
    // Sayılar başlıkta ve metinde geçtiği için ayrıntı satırı yoktur.
    hata = {
      ...card('hb_hata'),
      headline: [r.order > 0 ? `Yeri karışan ${r.order}` : '', r.intrusion > 0 ? `dizide olmayan ${r.intrusion}` : '', r.blank > 0 ? `boş kalan ${r.blank}` : '']
        .filter(Boolean)
        .join(' · ')
        .replace(/^./, (c) => c.toLocaleUpperCase('tr-TR')),
      text,
      visual: {
        type: 'stack',
        label: 'Doğru yerde olmayan harf yerleri',
        total: E,
        parts: [
          { label: 'Harf o dizide vardı, yeri karıştı', value: r.order },
          { label: 'O dizide olmayan harf', value: r.intrusion },
          { label: 'Boş kaldı', value: r.blank },
        ],
      } satisfies StackVisual,
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  // Yorumlanmayan harf sonucunun grafiği de çizilmez.
  const chart: CognitiveReport['chart'] = noRead ? undefined : {
    title: 'Dizi uzunluğuna göre doğru yerde hatırlanan harfler',
    note: v(
      'Her satırda aynı uzunluktaki iki dizinin harfleri vardır. Çubuk ne kadar uzunsa o dizilerdeki harflerin o kadar çoğunu doğru yerde hatırlamışsın demektir.',
      'Her satırda aynı uzunluktaki iki dizinin harfleri vardır. Çubuk ne kadar uzunsa o dizilerdeki harflerin o kadar çoğu doğru yerde hatırlanmış demektir.',
    ),
    rows: r.bySize.map((s) => ({ label: `${s.size} harflik diziler`, value: s.correct, max: s.letters, valueLabel: `${s.correct}/${s.letters}` })),
  };
  const figures = [
    { label: 'Doğru yerde hatırlanan harf', value: noRead ? 'Yorumlanmadı' : `${X}/${N}` },
    { label: 'Bütün harfleri doğru dizi', value: noRead ? 'Yorumlanmadı' : `${P}/${r.sets}` },
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
  return { blocks: [harf, uzunluk, islem, hata], ...(chart ? { chart } : {}), figures, ...(profile ? { profile } : {}) };
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
  const lastLevel = r.levels[r.levels.length - 1];

  /* En büyük doğru desen (desen aralığı) */
  let aralik: CognitiveBlock;
  // En küçük desenlerde kareler çoğunlukla doğru işaretlendiyse (her yanlış desende karelerin en az yarısı): yarıda
  // bırakmak ya da bakmamak değil, desenleri tam doğru işaretleyememek söz konusudur.
  const floorTried = r.items.filter((x) => !x.correct && !x.skipped);
  const floorClose = floor && floorTried.length === r.items.length && floorTried.every((x) => 2 * Math.max(0, x.hits - x.extra) >= x.size);
  const noReadWhy = `En küçük (${r.start} kareli) desenler de ${floorClose ? 'tam doğru işaretlenemediği' : 'hatırlanamadığı'} için`;
  if (floor && floorClose) {
    aralik = {
      ...card('dh_aralik'),
      headline: 'Yorumlanmadı',
      text: v(
        `En küçük (${r.start} kareli) üç desenin hiçbirini tam doğru işaretleyemedin. Yine de karelerin çoğunu doğru yere koydun; her desende birkaç kare eksik, fazla ya da yanlış yerdeydi. Test bu yüzden ilk büyüklükte bitti ve sonuç yorumlanmadı. Yönergeyi yeniden okuyup testi başka bir gün çözmek daha doğru bir sonuç verebilir.`,
        `Çocuğunuz en küçük (${r.start} kareli) üç desenin hiçbirini tam doğru işaretleyemedi. Yine de karelerin çoğunu doğru yere koydu; her desende birkaç kare eksik, fazla ya da yanlış yerdeydi. Test bu yüzden ilk büyüklükte bitti ve sonuç yorumlanmadı. Yönergeyi yeniden okuyup testi başka bir gün çözmesi daha doğru bir sonuç verebilir.`,
      ),
    };
  } else if (floor) {
    aralik = {
      ...card('dh_aralik'),
      headline: 'Yorumlanmadı',
      text: v(
        `En küçük (${r.start} kareli) üç desenin hiçbirini tam doğru hatırlayamadın; bu yüzden hatırlanan en büyük desen belirtilmedi. Yönergeyi tam anlamamış, desenlere yeterince bakamamış ya da testi yarıda bırakmış olabilirsin. Dinlenmiş olduğun bir gün, yönergeyi yeniden okuyup testi baştan çözmek daha doğru bir sonuç verebilir; aynı desenler yeniden gösterileceği için ikinci denemede sonuç biraz yükselebilir.`,
        `Çocuğunuz en küçük (${r.start} kareli) üç desenin hiçbirini tam doğru hatırlayamadı; bu yüzden hatırlanan en büyük desen belirtilmedi. Yönerge tam anlaşılmamış, desenlere yeterince bakılamamış ya da test yarıda bırakılmış olabilir. Dinlenmiş olduğu bir gün, yönergeyi yeniden okuyup testi baştan çözmesi daha doğru bir sonuç verebilir; aynı desenler yeniden gösterileceği için ikinci denemede sonuç biraz yükselebilir.`,
      ),
    };
  } else {
    const parts = [`Desenler ${r.start} dolu kareden ${r.max} dolu kareye kadar büyüyordu. Her büyüklükte üç desen vardı; her biri 3 saniye gösterildi.`];
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
    // Becerinin ne işe yaradığı yol haritasının girişinde anlatılır; burada yinelenmez.
    if (r.stoppedAt !== null) {
      parts.push(
        'Her büyüklükte yalnızca üç desen olduğu ve üçü de yanlış olunca test bittiği için bu sayı kabaca fikir verir. O anki kısa bir dalgınlık da sonucu düşürebilir.',
      );
    }
    if (doubt) parts.push(hedge);
    aralik = {
      ...card('dh_aralik'),
      headline: r.stoppedAt === null ? `${r.span} kare (testin en büyük deseni)` : `${r.span} kare`,
      text: parts.join(' '),
      // Her büyüklükteki desenler (dolu daire: bütün kareleriyle doğru); test bittiği için gösterilmeyen büyüklükler soluk.
      visual: {
        type: 'ladder',
        label: 'Desen büyüklüğüne göre doğru hatırlanan desenler',
        rows: Array.from({ length: r.max - r.start + 1 }, (_, k) => r.start + k).map((size) => ({
          length: size,
          results: r.items.filter((x) => x.size === size).map((x) => x.correct),
        })),
        reached: r.span > 0 ? r.span : null,
        unit: 'kare',
        caption: 'Desendeki kare sayısı',
        bestLabel: 'En büyük',
      } satisfies LadderVisual,
    };
  }

  /* Doğru hatırlanan desenler */
  let desen: CognitiveBlock;
  if (floor) {
    desen = { ...card('dh_desen'), headline: 'Yorumlanmadı', text: `${noReadWhy} doğru hatırlanan desenler yorumlanmadı.` };
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
        );
        // Yanlışlar büyük desenlerde başladıysa: akılda tutulacak kare çoğaldıkça yanılmak olağandır.
        if (missLevel.size >= PATTERN_LARGE) {
          parts.push('Desenler büyüdükçe akılda tutulacak kare sayısı arttığı için büyük desenlerde yanılmak bu testte olağandır.');
        }
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
      // Her yanlış desende karelerin en az yarısı, hepsinde birlikte en az dörtte üçü doğru olmalı; bakmadan işaretleme
      // kuşkusu varsa söylenmez.
      const tried = r.items.filter((x) => !x.correct && !x.skipped);
      const triedCells = tried.reduce((a, x) => a + x.size, 0);
      const credit = (x: (typeof tried)[number]) => Math.max(0, x.hits - x.extra);
      const triedCredit = tried.reduce((a, x) => a + credit(x), 0);
      const eachHalf = tried.every((x) => 2 * credit(x) >= x.size);
      if (!rapid && tried.length >= 2 && eachHalf && triedCredit >= 0.75 * triedCells && 2 * r.near < r.attemptedWrong) {
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
    desen = {
      ...card('dh_desen'),
      headline: all ? `${r.trials} desenin hepsi doğru` : `${r.trials} desenden ${r.correct} doğru`,
      text: parts.join(' '),
      visual: {
        type: 'stack',
        label: 'Gösterilen desenler',
        total: r.trials,
        parts: [
          { label: 'Bütün kareleriyle doğru', value: r.correct },
          { label: 'Kareleri işaretlendi, tam doğru değil', value: r.attemptedWrong },
          { label: '“Hatırlamıyorum” dendi', value: r.skipped },
        ],
      } satisfies StackVisual,
    };
  }

  /* Hata türleri */
  let hata: CognitiveBlock;
  const W = r.attemptedWrong;
  if (floor) {
    hata = { ...card('dh_hata'), headline: 'Yorumlanmadı', text: `${noReadWhy} yanlış desenlerdeki hatalar yorumlanmadı.` };
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
    // "Hatırlamıyorum" denen desenler de varsa başlık, yalnızca kareleri işaretlenen yanlış desenleri anlattığını söyler.
    const scope = (q: string) => (r.skipped > 0 ? `İşaretlenenlerin ${q}` : capTr(q));
    let head = r.skipped > 0 ? `İşaretlenen ${W === 1 ? 'bir' : W} yanlış desen` : W === 1 ? 'Bir yanlış desen' : `${W} yanlış desen`;
    if (W >= 2) {
      let them = doer;
      const how = (k: number) => (k === W ? 'hepsinde' : 'çoğunda');
      if (2 * r.near >= W) {
        const half = 2 * r.near === W;
        head = `${scope(r.near === W ? 'hepsinde' : half ? 'yarısında' : 'çoğunda')} tek kare farkı`;
        // "Bunların" yalnızca bütün yanlış desenleri gösterdiğinde kullanılır (aşağıdaki nicelikler W'ye göredir).
        if (r.near === W) them = v('Bunların', 'Çocuğunuz bunların');
        const q = r.near === W ? 'hepsinde' : half ? 'yarısında' : dhCount(r.near, 'inde');
        parts.push(
          v(
            `${subject} ${q} yalnızca bir kare farklıydı: ${r.near === 1 ? 'o deseni' : 'bu desenleri'} büyük ölçüde hatırladın.`,
            `${subject} ${q} yalnızca bir kare farklıydı: çocuğunuz ${r.near === 1 ? 'o deseni' : 'bu desenleri'} büyük ölçüde hatırladı.`,
          ),
        );
      }
      if (2 * r.fewer > W) {
        if (head.endsWith('desen')) head = `${scope(how(r.fewer))} kare eksik`;
        parts.push(
          v(`${them} ${how(r.fewer)} desendekinden daha az kare işaretledin: bazı kareler aklında kalmamış.`, `${them} ${how(r.fewer)} desendekinden daha az kare işaretledi: bazı kareler aklında kalmamış.`),
        );
      } else if (2 * r.more > W) {
        if (head.endsWith('desen')) head = `${scope(how(r.more))} fazla kare`;
        parts.push(
          v(
            `${them} ${how(r.more)} desendekinden daha çok kare işaretledin: desende olmayan kareleri de işaretledin.`,
            `${them} ${how(r.more)} desendekinden daha çok kare işaretledi: desende olmayan kareleri de işaretledi.`,
          ),
        );
      } else if (2 * r.same > W) {
        if (head.endsWith('desen')) head = `${scope(how(r.same))} yer karışıklığı`;
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
          r.more > 0 ? `${dhCount(r.more, 'inde')} ${r.fewer > 0 ? '' : 'desendekinden '}daha çok` : '',
          r.same > 0 ? `${dhCount(r.same, 'inde')} desendeki kadar` : '',
        ].filter(Boolean);
        parts.push(v(`${them} ${joinTr(kinds)} kare işaretledin.`, `${them} ${joinTr(kinds)} kare işaretledi.`));
      }
      if (r.shifted >= 2) {
        // "Hatırlamıyorum" denen desenler de varsa yalnızca kareleri işaretlenen yanlış desenler anılır.
        const q = r.shifted === W ? 'hepsinde' : `${r.shifted} tanesinde`;
        parts.push(
          r.skipped > 0
            ? v(
                `Kareleri işaretlediğin yanlış desenlerin ${q} bir kareyi doğru yerinin hemen yanına koydun: bu desenlerin yeri büyük ölçüde aklında kalmış.`,
                `Çocuğunuz kareleri işaretlediği yanlış desenlerin ${q} bir kareyi doğru yerinin hemen yanına koydu: bu desenlerin yeri büyük ölçüde aklında kalmış.`,
              )
            : v(
                `Yanlış desenlerin ${q} bir kareyi doğru yerinin hemen yanına koydun: bu desenlerin yeri büyük ölçüde aklında kalmış.`,
                `Çocuğunuz yanlış desenlerin ${q} bir kareyi doğru yerinin hemen yanına koydu: bu desenlerin yeri büyük ölçüde aklında kalmış.`,
              ),
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
    hata = {
      ...card('dh_hata'),
      headline: head,
      text: parts.join(' '),
      visual: {
        type: 'stack',
        label: 'Tam doğru hatırlanamayan desenler',
        total: r.wrong,
        parts: [
          { label: 'Desendekinden az kare', value: r.fewer },
          { label: 'Desendekinden çok kare', value: r.more },
          { label: 'Kare sayısı doğru, yeri karışık', value: r.same },
          { label: '“Hatırlamıyorum” dendi', value: r.skipped },
        ],
      } satisfies StackVisual,
    };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (manySkip) {
    issues.push(
      v(
        `Testin bittiği büyüklükten önceki ${r.beforeStop} desenin ${r.skippedBeforeStop === r.beforeStop ? 'hepsinde' : `${r.skippedBeforeStop} tanesinde`} “Hatırlamıyorum” düğmesine bastın. Bu düğme, hatırlamadığın desende tahmin etmek yerine kullanılır. Ama bu kadar sık kullanıldığında dikkatin dalgalanmış ya da emin olmadığın desenleri hiç denememiş olabilirsin. Bu yüzden sonuç dikkatle okunmalı.`,
        `Çocuğunuz testin bittiği büyüklükten önceki ${r.beforeStop} desenin ${r.skippedBeforeStop === r.beforeStop ? 'hepsinde' : `${r.skippedBeforeStop} tanesinde`} “Hatırlamıyorum” düğmesine bastı. Bu düğme, hatırlanmayan desende tahmin etmek yerine kullanılır. Ama bu kadar sık kullanıldığında dikkati dalgalanmış ya da emin olmadığı desenleri hiç denememiş olabilir. Bu yüzden sonuç dikkatle okunmalı.`,
      ),
    );
  }
  if (rapid) {
    issues.push(
      v(
        `${r.rapid} deseni çok kısa sürede işaretledin ve bu desenlerde karelerin çoğu yanlıştı. Bu desenlerde kareleri dikkatle işaretlememiş olabilirsin.`,
        `Çocuğunuz ${r.rapid} deseni çok kısa sürede işaretledi ve bu desenlerde karelerin çoğu yanlıştı. Bu desenlerde kareleri dikkatle işaretlememiş olabilir.`,
      ),
    );
  }
  if (r.restarts >= PATTERN_RESTARTS_NOTE) {
    issues.push(
      v(
        `Desen gösterilirken ${r.restarts} kez başka bir uygulamaya geçtin; bu desenler yeniden gösterildi. Desenleri birden çok kez görmek sonucu biraz yükseltebilir.`,
        `Desen gösterilirken ${r.restarts} kez başka bir uygulamaya geçildi; bu desenler yeniden gösterildi. Desenleri birden çok kez görmek sonucu biraz yükseltebilir.`,
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
  if (r.skipped === r.trials) {
    // Hiç kare işaretlenmedi: süre yoktur (ölçülemediği için değil).
    calisma = {
      ...card('dh_calisma'),
      headline: '“Hatırlamıyorum” denen desenler',
      text: [
        v(
          `Gösterilen ${r.trials} desenin hepsinde “Hatırlamıyorum” düğmesine bastın; hiç kare işaretlenmediği için işaretleme süresi yok.`,
          `Çocuğunuz gösterilen ${r.trials} desenin hepsinde “Hatırlamıyorum” düğmesine bastı; hiç kare işaretlenmediği için işaretleme süresi yok.`,
        ),
        ...issues,
      ].join(' '),
    };
  } else if (r.medianRt === null) {
    calisma = {
      ...card('dh_calisma'),
      headline: 'Süre hesaplanamadı',
      text: [skipLine, ...issues, 'İşaretleme süreleri alınamadığı için süreler hesaplanamadı.'].filter(Boolean).join(' '),
    };
  } else {
    calisma = {
      ...card('dh_calisma'),
      headline: `Desen başına tipik süre ${seconds(r.medianRt)}`,
      visual: timeStrip(r.rts, r.medianRt, 'desen'),
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
    { label: 'En büyük doğru desen', value: floor ? 'Yorumlanmadı' : `${r.span} kare` },
    { label: 'Doğru hatırlanan desen', value: floor ? 'Yorumlanmadı' : `${r.correct}/${r.trials}` },
    floor
      ? { label: 'Karelerde isabet', value: 'Yorumlanmadı' }
      : {
          label: 'Karelerde isabet',
          value: `%${creditPct}`,
          note: 'Bütün desenlerdeki karelerden doğru işaretlenenler. Desende olmayan işaretli kareler düşülür; “Hatırlamıyorum” denen desenlerin kareleri de doğru sayılmaz.',
        },
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
  const oppP = perspectiveOpposite(r);
  const none = r.answered === 0;
  // Sonuç yorumlanmıyorsa ortalama hata rozette, grafikte ve öne çıkan sayılarda da sonuç gibi gösterilmez.
  const notRead = chance || high;
  const m = r.meanError;
  const unanswered = r.n - r.answered;
  const far = r.items.filter((x) => x.error > PA_CLOSE).length;
  const checkWork = v(' Çalışma biçimi kartına da bak.', ' Çalışma biçimi kartına da bakın.');

  /* Yön gösterme isabeti */
  let accText: string;
  if (none) {
    accText = v(
      'Hiçbir soruda yön göstermedin. Bu yüzden sonuç yorumlanmadı. Dinlendiğin bir gün testi yeniden çözmek daha doğru bir sonuç verebilir.',
      'Çocuğunuz hiçbir soruda yön göstermedi. Bu yüzden sonuç yorumlanmadı. Dinlendiği bir gün testi yeniden çözmesi daha doğru bir sonuç verebilir.',
    );
  } else if (chance) {
    accText =
      v(
        `Gösterdiğin yönler, rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil. Rastgele yönlerin ortalama hatası 90 derecedir; ${r.n} soruda ortalama hata ${PA_CHANCE_MEAN} derecenin üstündeyse rastgele yönlerden ayırt edilemez. Sorular sana çok zor gelmiş, yönergeyi tam anlamamış ya da yönleri düşünmeden göstermiş olabilirsin. Bu yüzden sonuç yorumlanmadı. Dinlendiğin bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
        `Çocuğunuzun gösterdiği yönler, rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil. Rastgele yönlerin ortalama hatası 90 derecedir; ${r.n} soruda ortalama hata ${PA_CHANCE_MEAN} derecenin üstündeyse rastgele yönlerden ayırt edilemez. Sorular ona çok zor gelmiş, yönerge tam anlaşılmamış ya da yönler düşünülmeden gösterilmiş olabilir. Bu yüzden sonuç yorumlanmadı. Dinlendiği bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
      ) + (doubt ? checkWork : '');
  } else if (high) {
    accText = v(
      `Gösterdiğin yönlerin ortalama hatası çok yüksek (${degrees(m)}), ama yanlışların rastgele dağılmıyor: belirli bir türde toplanıyor (hata türleri kartına bak). Bu yüzden ortalama hata yorumlanmadı. Alıştırma sorularına yeniden bakıp testi başka bir gün çözmek daha doğru bir sonuç verebilir.`,
      `Çocuğunuzun gösterdiği yönlerin ortalama hatası çok yüksek (${degrees(m)}), ama yanlışları rastgele dağılmıyor: belirli bir türde toplanıyor (hata türleri kartına bakın). Bu yüzden ortalama hata yorumlanmadı. Alıştırma sorularına yeniden bakıp testi başka bir gün çözmesi daha doğru bir sonuç verebilir.`,
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
    if ((egoP || mirrorP || oppP) && !doubt) {
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
  if (unanswered > 0 && !none) {
    accText += v(
      ` Cevaplamadığın ${unanswered} soru, rastgele düzeyi olan 90 derece hata sayıldı.`,
      ` Cevaplanmayan ${unanswered} soru, rastgele düzeyi olan 90 derece hata sayıldı.`,
    );
  }
  const hata: CognitiveBlock = notRead
    ? { ...card('ba_hata'), headline: 'Yorumlanmadı', text: accText }
    : {
    ...card('ba_hata'),
    headline: `Ortalama hata ${degrees(m)}`,
    text: accText,
    // Her sorunun hatası bir nokta; ortalama, doğru yöne çok yakın bölge ve rastgele yönlerin ortalaması.
    visual: {
      type: 'strip',
      label: `Soruların açı hatası (${r.n} soru; ${r.close === 0 ? 'hiçbiri doğru yöne çok yakın değil' : `${r.close === r.n ? 'hepsi' : r.close === 1 ? 'biri' : `${r.close} tanesi`} doğru yöne çok yakın`})`,
      min: 0,
      max: 180,
      unit: '°',
      points: r.items.map((x) => x.error),
      marker: { value: m, label: `Ortalama ${degrees(m)}` },
      zone: { from: 0, to: PA_CLOSE, label: 'Doğru yöne çok yakın' },
      reference: { value: 90, label: 'Rastgele: 90°' },
    } satisfies StripVisual,
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
    donus = {
      ...card('ba_donus'),
      headline: head,
      // Grupların ortalama hataları kartın grafiğindedir; metin farkın anlamını söyler.
      text: `${text}${rough}`,
      visual: {
        type: 'bars',
        label: 'Ortalama açı hatası',
        scale: 'scale',
        unit: '°',
        max: 180,
        reference: { value: 90, label: 'Rastgele: 90°' },
        rows: [
          { label: `En çok ${PA_SMALL_MAX}° dönüş (${r.small.n} soru)`, value: r.small.meanError, valueLabel: `${nfDeg.format(r.small.meanError)}°` },
          { label: `${PA_SMALL_MAX}°’den fazla dönüş (${r.large.n} soru)`, value: r.large.meanError, valueLabel: `${nfDeg.format(r.large.meanError)}°` },
        ],
      } satisfies BarsVisual,
    };
  }

  /* Hata türleri */
  // Hata türlerinin sayıları (kartın grafiği).
  const kindVisual: BarsVisual = {
    type: 'bars',
    label: 'Hata türlerine uyan sorular',
    scale: 'share',
    rows: [
      { label: 'Haritaya yukarıdan bakar gibi', value: r.ego.count, max: Math.max(1, r.ego.eligible), valueLabel: `${r.ego.count}/${r.ego.eligible}` },
      { label: 'Sağ ile sol karışık', value: r.mirror.count, max: Math.max(1, r.mirror.eligible), valueLabel: `${r.mirror.count}/${r.mirror.eligible}` },
      { label: 'Doğru yönün tam tersi', value: r.opposite.count, max: Math.max(1, r.opposite.eligible), valueLabel: `${r.opposite.count}/${r.opposite.eligible}` },
    ],
  };
  const oppText = v(
    `${paOf(r.opposite.count, r.n)} oku doğru yönün tam tersine gösterdin; rastgele gösterilen yönlerin bu kadar sık bu yöne düşmesi pek beklenmez. Oku hedeften sana doğru çizmiş ya da önünle arkanı karıştırmış olabilirsin.`,
    `${paOf(r.opposite.count, r.n)} çocuğunuz oku doğru yönün tam tersine gösterdi; rastgele gösterilen yönlerin bu kadar sık bu yöne düşmesi pek beklenmez. Oku hedeften kendisine doğru çizmiş ya da önü ile arkayı karıştırmış olabilir.`,
  );
  const oppTip = v(
    ' Ok her zaman senin durduğun yerden hedefe doğru gösterilir.',
    ' Okun her zaman kişinin durduğu yerden hedefe doğru gösterildiğini hatırlatmak yardımcı olabilir.',
  );
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
  } else if ([egoP, mirrorP, oppP].filter(Boolean).length >= 2) {
    const k = [egoP, mirrorP, oppP].filter(Boolean).length;
    tur = {
      ...card('ba_tur'),
      headline: k === 3 ? 'Üç hata türü birden' : 'İki hata türü birden',
      visual: kindVisual,
      text: [egoP ? egoText : '', mirrorP ? mirrorText : '', oppP ? oppText : ''].filter(Boolean).join(' ') + (egoP ? egoTip : '') + (mirrorP ? mirrorTip : '') + (oppP ? oppTip : ''),
    };
  } else if (egoP) {
    tur = { ...card('ba_tur'), headline: `Haritaya yukarıdan bakar gibi: ${r.ego.count} soru`, visual: kindVisual, text: egoText + egoTip };
  } else if (mirrorP) {
    tur = { ...card('ba_tur'), headline: `Sağ ile sol karışmış olabilir: ${r.mirror.count} soru`, visual: kindVisual, text: mirrorText + mirrorTip };
  } else if (oppP) {
    tur = { ...card('ba_tur'), headline: `Ters yön: ${r.opposite.count} soru`, visual: kindVisual, text: oppText + oppTip };
  } else {
    tur = {
      ...card('ba_tur'),
      headline: 'Belirgin bir hata türü yok',
      visual: kindVisual,
      text: v(
        'Bu kart üç tür yanlışa bakar: yönü haritaya yukarıdan bakar gibi göstermek, sağ ile solu karıştırmak ve oku tam ters yöne göstermek. Senin cevaplarında üçü de, rastgele gösterilen yönlerde bile görülebilecek kadar az; yanlışların belirli bir türde toplanmıyor.',
        'Bu kart üç tür yanlışa bakar: yönü haritaya yukarıdan bakar gibi göstermek, sağ ile solu karıştırmak ve oku tam ters yöne göstermek. Çocuğunuzun cevaplarında üçü de, rastgele gösterilen yönlerde bile görülebilecek kadar az; yanlışları belirli bir türde toplanmıyor.',
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
      ? { ...card('ba_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler hesaplanamadı.'].join(' ') }
      : {
          ...card('ba_calisma'),
          headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
          visual: timeStrip(r.rts, r.medianRt),
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
  // Grafik yalnızca yorumlanan sonuçta çizilir; bazı sorularda düşünmeden cevap verilmiş olabilirse farklar yorumlanmaz.
  const caution = doubt
    ? v(
        ' Bazı sorularda düşünmeden cevap vermiş olabileceğin için gruplar arasındaki farklar yorumlanmamalıdır.',
        ' Bazı sorularda düşünmeden cevap verilmiş olabileceği için gruplar arasındaki farklar yorumlanmamalıdır.',
      )
    : '';
  // Sonuç yorumlanmıyorsa dönme açısına göre ortalama hata grafiği de çizilmez.
  const chart: CognitiveReport['chart'] = notRead ? undefined : {
    title: 'Zihinde dönme açısına göre ortalama hata',
    note:
      v(
        `Sorular, kendini zihinde ne kadar döndürmen gerektiğine göre gruplandı. Çubuklar her gruptaki ortalama hatayı gösterir; kısa çubuk daha isabetli demektir. Rastgele gösterilen yönlerin ortalama hatası 90 derecedir. Her grupta ${per} soru olduğu için bu grafik kaba bir göstergedir.`,
        `Sorular, kişinin kendini zihinde ne kadar döndürmesi gerektiğine göre gruplandı. Çubuklar her gruptaki ortalama hatayı gösterir; kısa çubuk daha isabetli demektir. Rastgele gösterilen yönlerin ortalama hatası 90 derecedir. Her grupta ${per} soru olduğu için bu grafik kaba bir göstergedir.`,
      ) + caution,
    rows: bins.map((b) => ({ label: `${b.from}–${b.to} derece dönüş (${b.n} soru)`, value: b.meanError, max: 180, valueLabel: `${nfDeg.format(b.meanError)}°` })),
  };
  const figures = [
    { label: 'Ortalama hata', value: notRead ? 'Yorumlanmadı' : degrees(m) },
    notRead
      ? { label: 'Doğru yöne çok yakın cevaplar', value: 'Yorumlanmadı' }
      : { label: 'Doğru yöne çok yakın cevaplar', value: `${r.close}/${r.n}`, note: `en çok ${PA_CLOSE} derece hata` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  return { blocks: [hata, donus, tur, calisma], ...(chart ? { chart } : {}), figures };
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
  const below = reflectionBelowChance(r);
  const rushed = reflectionRushed(r);
  // Sonuç yorumlanmaz: tuzaksız eş sorular da çoğunlukla yanlış ya da soruların çoğu okunmadan cevaplanmış olabilir.
  const notRead = chance || rushed;
  const rapid = reflectionRapid(r);
  const samePos = reflectionSamePosition(r);
  const doubt = !notRead && (rapid || samePos);
  const wrong = L.n - L.correct;
  const wrongC = C.n - C.correct;
  // Bazı sorularda okumadan ya da bakmadan seçilmiş olabilirse tuzak arama ve tuzaksız sorulardaki yanlışlar yorumlanmaz.
  const suspicious = !doubt && reflectionSuspicious(r);
  const ctrlLow = !doubt && reflectionControlLow(r);
  const rapidOf = `${r.n} sorunun ${countOf(r.rapid, r.n, 'inde')}`;
  const doubtWhy = v('Bazı sorularda okumadan ya da bakmadan seçmiş olabileceğin için', 'Bazı sorularda okumadan ya da bakmadan seçilmiş olabileceği için');

  /* Tuzaklı sorular */
  let accText: string;
  if (below) {
    accText = v(
      `${r.correct === 0 ? 'Hiçbir soruda doğru cevabı seçmedin.' : `Soruların yalnızca ${countOf(r.correct, r.n, 'inde')} doğru cevabı seçtin.`} Bu, rastgele seçimde beklenenden de az. Seçenekleri belli bir düzenle seçmiş ya da yönergeyi farklı anlamış olabilirsin. Bu yüzden sonuç yorumlanmadı. Yönergeyi yeniden okuyup başka bir gün yeniden denemek daha doğru bir sonuç verebilir.`,
      `${r.correct === 0 ? 'Çocuğunuz hiçbir soruda doğru cevabı seçmedi.' : `Çocuğunuz soruların yalnızca ${countOf(r.correct, r.n, 'inde')} doğru cevabı seçti.`} Bu, rastgele seçimde beklenenden de az. Seçenekler belli bir düzenle seçilmiş ya da yönerge farklı anlaşılmış olabilir. Bu yüzden sonuç yorumlanmadı. Yönergeyi yeniden okuyup başka bir gün yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else if (chance) {
    const missed = C.correct === 0 ? 'hiçbirinde' : 'çoğunda';
    accText = v(
      `Tuzaksız eş soruların da ${missed} doğru cevabı bulamadın. Soruları dikkatle okumamış, yönergeyi tam anlamamış ya da cevapları rastgele seçmiş olabilirsin. Bu yüzden tuzaklı sorulardaki sonuç yorumlanmadı. Dinlendiğin bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir. Aynı sorular yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
      `Çocuğunuz tuzaksız eş soruların da ${missed} doğru cevabı bulamadı. Sorular dikkatle okunmamış, yönerge tam anlaşılmamış ya da cevaplar rastgele seçilmiş olabilir. Bu yüzden tuzaklı sorulardaki sonuç yorumlanmadı. Dinlendiği bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir. Aynı sorular yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
    );
  } else if (rushed) {
    accText = v(
      `${capTr(rapidOf)} cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin. Bu sorulara okumadan cevap vermiş olabilirsin. Bu yüzden sonuç yorumlanmadı. Acele etmeden yeniden denemek daha doğru bir sonuç verebilir.`,
      `Çocuğunuz ${rapidOf} cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdi. Bu sorulara okumadan cevap vermiş olabilir. Bu yüzden sonuç yorumlanmadı. Acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.`,
    );
  } else {
    const intro = `Testteki ${r.n} sorunun ${L.n} tanesi tuzaklıydı: bunlarda ilk akla gelen cevap yanlıştı.`;
    let level: string;
    if (L.correct === L.n) {
      level = suspicious
        ? v('Tuzaklı soruların hepsinde doğru cevabı seçtin.', 'Çocuğunuz tuzaklı soruların hepsinde doğru cevabı seçti.')
        : v(
            'Tuzaklı soruların hepsinde doğru cevabı buldun; ilk akla gelen yanlış cevaba hiç kapılmadın.',
            'Çocuğunuz tuzaklı soruların hepsinde doğru cevabı buldu; ilk akla gelen yanlış cevaba hiç kapılmadı.',
          );
    } else if (L.correct >= 13) {
      level = v('Tuzaklı soruların hemen hepsinde doğru cevabı buldun.', 'Çocuğunuz tuzaklı soruların hemen hepsinde doğru cevabı buldu.');
    } else if (L.correct >= 9) {
      level = v('Tuzaklı soruların çoğunda doğru cevabı buldun: tuzakların çoğunu fark ettin.', 'Çocuğunuz tuzaklı soruların çoğunda doğru cevabı buldu: tuzakların çoğunu fark etti.');
    } else if (2 * L.correct === L.n) {
      level = v('Tuzaklı soruların yarısında doğru cevabı buldun.', 'Çocuğunuz tuzaklı soruların yarısında doğru cevabı buldu.');
    } else if (L.correct >= 5) {
      level = v(
        'Tuzaklı soruların bir kısmında doğru cevabı buldun; çoğunda ise doğru cevaba ulaşamadın.',
        'Çocuğunuz tuzaklı soruların bir kısmında doğru cevabı buldu; çoğunda ise doğru cevaba ulaşamadı.',
      );
    } else if (L.correct > 0) {
      level = v(
        `Tuzaklı soruların yalnızca ${countOf(L.correct, L.n, 'inde')} doğru cevabı buldun.`,
        `Çocuğunuz tuzaklı soruların yalnızca ${countOf(L.correct, L.n, 'inde')} doğru cevabı buldu.`,
      );
    } else {
      level = v('Tuzaklı soruların hiçbirinde doğru cevabı bulamadın.', 'Çocuğunuz tuzaklı soruların hiçbirinde doğru cevabı bulamadı.');
    }
    accText = `${intro} ${level}`;
    if (!doubt && L.correct <= 12 && L.lure >= L.other) accText += ' Bu tür sorularda ilk akla gelen cevap çok güçlüdür; birçok kişi bu cevabı verir.';
    // Sayısal ve sözel tuzaklar arasında en az dört soruluk fark (her grup sekiz soru).
    const diff = r.numLure.correct - r.verbLure.correct;
    if (!doubt && diff <= -4) {
      accText += v(
        ' Sayısal tuzaklı sorularda, sözel olanlardan daha az doğru cevap buldun. Sayısal sorularda tuzağı fark etmenin yanında hesap da gerekir. Bu fark birkaç soruya dayanır; kaba bir göstergedir.',
        ' Sayısal tuzaklı sorularda, sözel olanlardan daha az doğru cevap buldu. Sayısal sorularda tuzağı fark etmenin yanında hesap da gerekir. Bu fark birkaç soruya dayanır; kaba bir göstergedir.',
      );
    } else if (!doubt && diff >= 4) {
      accText += v(
        ' Sözel tuzaklı sorularda, sayısal olanlardan daha az doğru cevap buldun. Sözel sorularda tuzak sorunun içindeki küçük bir ayrıntıdadır. Bu fark birkaç soruya dayanır; kaba bir göstergedir.',
        ' Sözel tuzaklı sorularda, sayısal olanlardan daha az doğru cevap buldu. Sözel sorularda tuzak sorunun içindeki küçük bir ayrıntıdadır. Bu fark birkaç soruya dayanır; kaba bir göstergedir.',
      );
    }
    if (suspicious) {
      accText += v(
        ` Tuzaksız eş soruların ${countOf(C.lure, C.n, 'inde')} de tuzak varmış gibi cevap verdin. Bu sonucun bir kısmı, tuzak olmayan sorularda da tuzak aramaktan kaynaklanmış olabilir. Bu yüzden sonuç dikkatle okunmalı (benzer soru çiftleri kartına bak).`,
        ` Tuzaksız eş soruların ${countOf(C.lure, C.n, 'inde')} de tuzak varmış gibi cevap verdi. Bu sonucun bir kısmı, tuzak olmayan sorularda da tuzak aramaktan kaynaklanmış olabilir. Bu yüzden sonuç dikkatle okunmalı (benzer soru çiftleri kartına bakın).`,
      );
    } else if (ctrlLow) {
      accText += v(
        ` Tuzaksız eş soruların ${countOf(wrongC, C.n, 'inde')} de yanlış cevap verdin. Bu yüzden sonuç dikkatle okunmalı (benzer soru çiftleri kartına bak).`,
        ` Tuzaksız eş soruların ${countOf(wrongC, C.n, 'inde')} de yanlış cevap verdi. Bu yüzden sonuç dikkatle okunmalı (benzer soru çiftleri kartına bakın).`,
      );
    }
    if (doubt) {
      accText += v(
        ` ${doubtWhy} (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.`,
        ` ${doubtWhy} (çalışma biçimi kartına bakın) bu sonuç çocuğunuzu tam yansıtmayabilir.`,
      );
    }
  }
  const dogru: CognitiveBlock = notRead
    ? { ...card('dk_dogru'), headline: 'Yorumlanmadı', text: accText }
    : {
        ...card('dk_dogru'),
        headline: `${L.n} tuzaklı soruda ${L.correct} doğru`,
        text: accText,
        visual: {
          type: 'bars',
          label: 'Tuzaklı sorularda doğru cevaplar',
          scale: 'share',
          rows: [
            { label: 'Sayısal tuzaklı sorular', value: r.numLure.correct, max: r.numLure.n, valueLabel: `${r.numLure.correct}/${r.numLure.n}` },
            { label: 'Sözel tuzaklı sorular', value: r.verbLure.correct, max: r.verbLure.n, valueLabel: `${r.verbLure.correct}/${r.verbLure.n}` },
          ],
        } satisfies BarsVisual,
      };

  /* Yanlışların türü */
  let yanlis: CognitiveBlock;
  if (notRead) {
    yanlis = {
      ...card('dk_yanlis'),
      headline: 'Yorumlanmadı',
      text: below
        ? 'Doğru cevaplar rastgele seçimde beklenenden de az olduğu için yanlışların türü yorumlanmadı.'
        : chance
          ? 'Tuzaksız eş soruların da çoğu yanlış olduğu için yanlışların türü yorumlanmadı.'
          : 'Soruların çoğu okumaya yetmeyecek kadar kısa sürede cevaplandığı için yanlışların türü yorumlanmadı.',
    };
  } else if (wrong === 0) {
    yanlis = {
      ...card('dk_yanlis'),
      headline: 'Tuzaklı sorularda yanlış yok',
      text: suspicious
        ? v(
            'Tuzaklı soruların hiçbirinde yanlış cevap vermedin. Ama tuzaksız sorularda da tuzak aradığın için bu sonuç, tuzak olmayan sorularda da tuzak aramaktan kaynaklanmış olabilir.',
            'Çocuğunuz tuzaklı soruların hiçbirinde yanlış cevap vermedi. Ama tuzaksız sorularda da tuzak aradığı için bu sonuç, tuzak olmayan sorularda da tuzak aramaktan kaynaklanmış olabilir.',
          )
        : v('Tuzaklı soruların hiçbirinde yanlış cevap vermedin.', 'Çocuğunuz tuzaklı soruların hiçbirinde yanlış cevap vermedi.'),
    };
  } else if (doubt) {
    // Okumadan seçilmiş olabilirse yanlışların türü yorumlanmaz: rozet, grafik ve sayılar da yorumlanmış gibi görünmez.
    yanlis = { ...card('dk_yanlis'), headline: 'Yorumlanmadı', text: `${doubtWhy} yanlışların türü yorumlanmadı.` };
  } else {
    let text: string;
    if (wrong === 1) {
      text = v(
        `Tuzaklı sorulardan yalnızca birinde yanlış cevap verdin; bu cevap ${L.lure ? 'sorunun ilk anda akla getirdiği cevaptı' : 'ilk akla gelen cevap değil, başka bir yanlıştı'}.`,
        `Çocuğunuz tuzaklı sorulardan yalnızca birinde yanlış cevap verdi; bu cevap ${L.lure ? 'sorunun ilk anda akla getirdiği cevaptı' : 'ilk akla gelen cevap değil, başka bir yanlıştı'}.`,
      );
    } else if (L.lure >= 2 && L.lure >= 2 * L.other) {
      const share = L.other === 0 ? 'hepsinde' : 'çoğunda';
      const example =
        'Bu cevaplar ilk bakışta doğru görünür ama soruyla karşılaştırılınca uymaz. Örneğin bir sopa ile bir top birlikte 110 lira olsun. Sopa toptan 100 lira daha pahalı olsun. Akla ilk gelen “top 10 lira” cevabı yanlıştır: o zaman sopa 110 lira olur ve ikisi birlikte 120 lira eder.';
      text = v(
        `Yanlışlarının ${share} sorunun ilk anda akla getirdiği cevabı seçtin. ${example} Bir cevap çok kolay geliyorsa onu sorudaki bilgilerle bir kez sınamak işine yarayabilir.`,
        `Çocuğunuz yanlışlarının ${share} sorunun ilk anda akla getirdiği cevabı seçti. ${example} Bir cevap çok kolay geliyorsa onu sorudaki bilgilerle bir kez sınamak ona yardım edebilir.`,
      );
    } else if (L.other >= 2 && L.other > L.lure) {
      const share = L.lure === 0 ? 'hiçbiri ilk akla gelen cevap değildi; hepsi başka bir yanlıştı' : 'çoğu ilk akla gelen cevap değil, başka bir yanlıştı';
      text = v(
        `Yanlışlarının ${share}. Bu tür sorularda yanlışlar çoğunlukla ilk akla gelen cevap olur. Senin yanlışların ise soruyu yanlış anlamaktan, hesapta yanılmaktan ya da emin olmadan seçmekten kaynaklanmış olabilir.`,
        `Çocuğunuzun yanlışlarının ${share}. Bu tür sorularda yanlışlar çoğunlukla ilk akla gelen cevap olur. Bu yanlışlar ise soruyu yanlış anlamaktan, hesapta yanılmaktan ya da emin olmadan seçmekten kaynaklanmış olabilir.`,
      );
    } else {
      text = v(
        'Yanlışlarının bir kısmı ilk akla gelen cevap, bir kısmı başka bir yanlıştı. İlk akla gelen cevabı sorudaki bilgilerle sınamak da, soruyu sonuna kadar dikkatle okumak da işine yarayabilir.',
        'Çocuğunuzun yanlışlarının bir kısmı ilk akla gelen cevap, bir kısmı başka bir yanlıştı. İlk akla gelen cevabı sorudaki bilgilerle sınamak da, soruyu sonuna kadar dikkatle okumak da ona yardım edebilir.',
      );
    }
    yanlis = {
      ...card('dk_yanlis'),
      headline:
        wrong === 1
          ? `Tek yanlış: ${L.lure ? 'ilk akla gelen cevap' : 'başka bir yanlış'}`
          : `${wrong} yanlışın ${countOf(L.lure, wrong, 'i')} ilk akla gelen cevap${L.lure === 0 ? ' değil' : ''}`,
      text,
      visual: {
        type: 'stack',
        label: 'Tuzaklı sorulardaki yanlışlar',
        total: wrong,
        parts: [
          { label: 'İlk akla gelen cevap', value: L.lure },
          { label: 'Başka bir yanlış', value: L.other },
        ],
      } satisfies StackVisual,
    };
  }

  /* Tuzaksız eş sorular */
  const esIntro = `Tuzaklı sorulardan ${C.n} tanesinin bir de tuzaksız eşi vardı. Bu eşlerde sayılar ya da durum benzerdi, ama ilk akla gelen cevap doğruydu.`;
  const how = countOf(C.correct, C.n, 'ini');
  let esText = esIntro;
  if (rushed) {
    esText += ' Soruların çoğu okumaya yetmeyecek kadar kısa sürede cevaplandığı için bu sorulardaki sonuç yorumlanmadı.';
  } else if (doubt) {
    esText += ` ${doubtWhy} bu sorulardaki sonuç yorumlanmadı.`;
  } else if (chance) {
    esText += v(
      ` ${C.correct === 0 ? 'Bu soruların hiçbirinde doğru cevabı bulamadın' : `Bu soruların yalnızca ${countOf(C.correct, C.n, 'inde')} doğru cevabı buldun`}. Bu sorularda tuzak olmadığı için yanlışlar, soruların dikkatle okunmadığını ya da ${below ? 'yönergenin farklı anlaşıldığını' : 'cevapların rastgele seçildiğini'} düşündürür.`,
      ` ${C.correct === 0 ? 'Çocuğunuz bu soruların hiçbirinde doğru cevabı bulamadı' : `Çocuğunuz bu soruların yalnızca ${countOf(C.correct, C.n, 'inde')} doğru cevabı buldu`}. Bu sorularda tuzak olmadığı için yanlışlar, soruların dikkatle okunmadığını ya da ${below ? 'yönergenin farklı anlaşıldığını' : 'cevapların rastgele seçildiğini'} düşündürür.`,
    );
  } else if (suspicious) {
    esText += v(
      ` Bu soruların ${countOf(C.lure, C.n, 'inde')}, tuzak olmadığı hâlde tuzak varmış gibi cevap verdin. Tuzak olmayan sorularda da tuzak aramak yanıltabilir. Cevabı sorudaki bilgilerle sınamak, tuzak olup olmadığını da gösterir.`,
      ` Çocuğunuz bu soruların ${countOf(C.lure, C.n, 'inde')}, tuzak olmadığı hâlde tuzak varmış gibi cevap verdi. Tuzak olmayan sorularda da tuzak aramak yanıltabilir. Cevabı sorudaki bilgilerle sınamak, tuzak olup olmadığını da gösterir.`,
    );
    if (C.other >= 2) {
      esText += v(
        ` Bu soruların ${countOf(C.other, C.n, 'inde')} de başka bir yanlış cevap verdin. Bu yüzden sonuç dikkatle okunmalı.`,
        ` Bu soruların ${countOf(C.other, C.n, 'inde')} de başka bir yanlış cevap verdi. Bu yüzden sonuç dikkatle okunmalı.`,
      );
    }
  } else if (ctrlLow) {
    esText += v(
      ` Bu soruların ${countOf(wrongC, C.n, 'inde')} de yanlış cevap verdin. Tuzaklı sorulardaki yanlışların bir kısmı da dikkatin dağılmasından, soruyu yanlış okumaktan ya da hesaptan kaynaklanmış olabilir.`,
      ` Çocuğunuz bu soruların ${countOf(wrongC, C.n, 'inde')} de yanlış cevap verdi. Tuzaklı sorulardaki yanlışların bir kısmı da dikkatin dağılmasından, soruyu yanlış okumaktan ya da hesaptan kaynaklanmış olabilir.`,
    );
  } else if (r.pairControlOnly >= 2) {
    esText += v(
      ` Bu soruların ${how} doğru buldun. Eşlerin ${countOf(r.pairControlOnly, r.pairs, 'inde')} tuzaksız sorunun doğru cevabını buldun ama tuzaklı eşinde ilk akla gelen cevabı seçtin. Tuzaksız eşleri doğru bulman, bu sorulardaki okuma ve hesabın sana zor gelmediğini gösterir. Tuzaklı eşlerinde ilk akla gelen cevabı bir kez daha sınamak işine yarayabilir.`,
      ` Çocuğunuz bu soruların ${how} doğru buldu. Eşlerin ${countOf(r.pairControlOnly, r.pairs, 'inde')} tuzaksız sorunun doğru cevabını buldu ama tuzaklı eşinde ilk akla gelen cevabı seçti. Tuzaksız eşleri doğru bulması, bu sorulardaki okuma ve hesabın ona zor gelmediğini gösterir. Tuzaklı eşlerinde ilk akla gelen cevabı bir kez daha sınamak ona yardım edebilir.`,
    );
  } else if (L.correct >= 9) {
    esText += v(` Bu soruların ${how} doğru buldun: tuzak olan ve olmayan soruları birbirinden ayırdın.`, ` Çocuğunuz bu soruların ${how} doğru buldu: tuzak olan ve olmayan soruları birbirinden ayırdı.`);
  } else {
    esText += v(
      ` Bu soruların ${how} doğru buldun: bu soruların hesapları ve cümleleri sana zor gelmedi.`,
      ` Çocuğunuz bu soruların ${how} doğru buldu: bu soruların hesapları ve cümleleri ona zor gelmedi.`,
    );
  }
  // Bakmadan seçilmiş olabilirse (ya da soruların çoğu okunmadan cevaplandıysa) bu kart da yorumlanmaz; tuzaksız soruların
  // çoğu yanlışsa kart, sonucun neden yorumlanmadığını sayılarla gösterir.
  const es: CognitiveBlock =
    rushed || doubt
      ? { ...card('dk_es'), headline: 'Yorumlanmadı', text: esText }
      : {
          ...card('dk_es'),
          headline: `${C.n} tuzaksız soruda ${C.correct} doğru`,
          text: esText,
          visual: {
            type: 'stack',
            label: 'Tuzaksız eş sorulardaki cevaplar',
            total: C.n,
            parts: [
              { label: 'Doğru', value: C.correct },
              { label: 'Tuzak varmış gibi cevap', value: C.lure },
              { label: 'Başka bir yanlış', value: C.other },
            ],
          } satisfies StackVisual,
        };

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const right = r.rapidCorrect === 0 ? 'Bu cevapların hiçbiri doğru değildi.' : `Bu cevapların yalnızca ${countOf(r.rapidCorrect, r.rapid, 'i')} doğruydu.`;
    issues.push(
      v(
        `${capTr(rapidOf)} cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin. ${right} Bu sorulara okumadan cevap vermiş olabilirsin.`,
        `Çocuğunuz ${rapidOf} cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdi. ${right} Bu sorulara okumadan cevap vermiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Okumadan cevap verilmiş olabileceği söylenirken "hız tek başına iyi ya da kötü değildir" denmez.
  const noLimit = rapid
    ? ''
    : v(' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir.', ' Bu testte süre sınırı yoktu; hız tek başına iyi ya da kötü değildir, önemli olan doğru cevaba ulaşabilmektir.');
  if (r.medianRt === null) {
    calisma = { ...card('dk_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler hesaplanamadı.'].join(' ') };
  } else {
    const a = r.rtLureCorrect;
    const b = r.rtLureIntuitive;
    let pace = '';
    const comparePace = !doubt && !notRead && !rapid && a !== null && b !== null;
    if (comparePace) {
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
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimit,
      visual:
        comparePace && a !== null && b !== null
          ? ({
              type: 'bars',
              label: 'Soru başına tipik süre',
              scale: 'scale',
              unit: 'sn',
              rows: [
                { label: 'Bütün sorular', value: secValue(r.medianRt), valueLabel: secShort(r.medianRt) },
                { label: 'Doğru bulunan tuzaklı sorular', value: secValue(a), valueLabel: secShort(a) },
                { label: 'İlk akla gelen cevabın seçildiği sorular', value: secValue(b), valueLabel: secShort(b) },
              ],
            } satisfies BarsVisual)
          : timeStrip(r.rts, r.medianRt),
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  const groupNote = 'Her grupta sekiz soru vardır. Tuzaklı sorularda ilk akla gelen cevap yanlıştır; tuzaksız eş sorularda doğrudur.';
  // Tuzaklı sorulardaki sonuç yorumlanmıyorsa gruplara göre grafik de çizilmez (nedenini kartlar söyler).
  const chart: CognitiveReport['chart'] = notRead
    ? undefined
    : {
        title: 'Soru gruplarına göre doğru cevaplar',
        note: v(
          `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğunu doğru cevaplamışsın demektir.`,
          `${groupNote} Çubuk ne kadar uzunsa o gruptaki soruların o kadar çoğu doğru cevaplanmış demektir.`,
        ),
        rows: REFLECTION_GROUPS.map((g) => ({ label: g.name, value: r[g.key].correct, max: r[g.key].n, valueLabel: `${r[g.key].correct}/${r[g.key].n}` })),
      };
  // İlk akla gelen yanlış cevapların sayısı ayrı bir eğilim ölçüsü olarak geçerli bulunmadığı için öne çıkan sayılarda yoktur.
  const figures = [
    { label: 'Tuzaklı sorularda doğru', value: notRead ? 'Yorumlanmadı' : `${L.correct}/${L.n}` },
    { label: 'Tuzaksız eş sorularda doğru', value: rushed || doubt ? 'Yorumlanmadı' : `${C.correct}/${C.n}` },
    ...(r.medianRt !== null ? [{ label: 'Soru başına tipik süre', value: seconds(r.medianRt) }] : []),
  ];
  const profile: CognitiveReport['profile'] = notRead
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
  return { blocks: [dogru, yanlis, es, calisma], ...(chart ? { chart } : {}), figures, ...(profile ? { profile } : {}) };
}

/* ---------- Kule görevi ---------- */

/** Kule görevinde problem uzunluklarının (3–7 hamle) üç boyutlu grafikteki renkleri. */
export const TOWER_LEVEL_COLORS = ['#2f5ce0', '#0e9c8c', '#d28a14', '#ee6a36', '#7a4ee6'];

/** Cümle başındaki büyük harfi küçültür ("Uzun problemlerde" → "uzun problemlerde"). */
const lowerFirst = (x: string) => x.charAt(0).toLocaleLowerCase('tr-TR') + x.slice(1);

/** Kule görevindeki kısa süreler: 10 saniyeden kısası ondalıklı yazılır ("1,6 saniye"), yarım saniyeden kısası "bir saniyeden kısa". */
const towerSeconds = (ms: number) => (ms < 500 ? 'bir saniyeden kısa' : ms < 10_000 ? `${String(towerTenths(ms)).replace('.', ',')} saniye` : seconds(ms));
/** Grafikte `towerSeconds` ile aynı süre, kısa yazımla: "4,2 sn", "1 sn’den kısa". */
const towerSecShort = (ms: number) => (ms < 500 ? '1 sn’den kısa' : ms < 10_000 ? `${String(towerTenths(ms)).replace('.', ',')} sn` : secShort(ms));
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
  const noneWhy =
    r.idle === r.n
      ? 'Problemlerin hepsinde hiç top taşınmadığı için'
      : `Problemlerin ${r.idle} tanesinde, kısa problemlerin de ${S.idle === S.n ? 'hepsinde' : `${S.idle} tanesinde`} hiç top taşınmadığı için`;
  const idleOf = r.idle === r.n ? `${r.n} problemin hepsinde` : `${r.n} problemin ${r.idle} tanesinde`;
  const shortIdle = S.idle === r.idle ? 'bunların hepsi' : `bunların ${S.idle} tanesi`;

  /* En az hamlede çözülenler */
  let accText: string;
  if (none) {
    accText = v(
      `${idleOf} hiç top taşımadan süre doldu; ${shortIdle} 3 ve 4 hamlelik kısa problemlerdi. Testte ara vermiş, görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin. Bu yüzden sonuç yorumlanmadı. Dinlendiğin bir gün, yönergeyi yeniden okuyup testi baştan çözmek daha doğru bir sonuç verebilir. Aynı problemler yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
      `Çocuğunuz ${idleOf} hiç top taşımadı ve bu problemlerde süre doldu; ${shortIdle} 3 ve 4 hamlelik kısa problemlerdi. Testte ara vermiş, görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilir. Bu yüzden sonuç yorumlanmadı. Dinlendiği bir gün, yönergeyi yeniden okuyup testi baştan çözmesi daha doğru bir sonuç verebilir. Aynı problemler yeniden çözüleceği için ikinci denemede sonuç biraz yükselebilir.`,
    );
  } else {
    const intro = v(
      `Bu testte ${r.n} problem vardı; her problemde topları en az hamleyle hedef düzene getirmen gerekiyordu.`,
      `Bu testte ${r.n} problem vardı; her problemde çocuğunuzun topları en az hamleyle hedef düzene getirmesi gerekiyordu.`,
    );
    let level: string;
    if (O === r.n) {
      level = v('Problemlerin hepsini en az hamlede çözdün.', 'Çocuğunuz problemlerin hepsini en az hamlede çözdü.');
    } else if (O >= r.n - 2) {
      level = v(`Bunların ${O} tanesini en az hamlede çözdün: problemlerin hemen hepsinde en kısa yolu buldun.`, `Çocuğunuz bunların ${O} tanesini en az hamlede çözdü: problemlerin hemen hepsinde en kısa yolu buldu.`);
    } else if (O >= 11) {
      level = v(`Bunların ${O} tanesini en az hamlede çözdün: problemlerin çoğunda en kısa yolu buldun.`, `Çocuğunuz bunların ${O} tanesini en az hamlede çözdü: problemlerin çoğunda en kısa yolu buldu.`);
    } else if (O > 0) {
      // Öteki problemlerde ne olduğu sayılarla seçilir: daha çok hamle mi, hedefe ulaşamamak mı, ikisi birden mi.
      const k = O === 1 ? 'birini' : `${O} tanesini`;
      const restE = r.extra;
      const restU = r.unsolved;
      const rest =
        restU === 0
          ? v(`Öteki ${restE} problemde hedefe ulaştın ama daha çok hamle yaptın.`, `Öteki ${restE} problemde hedefe ulaştı ama daha çok hamle yaptı.`)
          : restE === 0
            ? v(`Öteki ${restU} problemde hedefe ulaşamadın.`, `Öteki ${restU} problemde hedefe ulaşamadı.`)
            : v(
                `Öteki problemlerin ${restE} tanesinde daha çok hamle yaptın, ${restU} tanesinde hedefe ulaşamadın.`,
                `Öteki problemlerin ${restE} tanesinde daha çok hamle yaptı, ${restU} tanesinde hedefe ulaşamadı.`,
              );
      level = v(`Bunların ${k} en az hamlede çözdün. ${rest}`, `Çocuğunuz bunların ${k} en az hamlede çözdü. ${rest}`);
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
        ` ${r.idle} problemde hiç top taşımadan süre doldu; bu problemlerde ${why}. Bu yüzden sonuç dikkatle okunmalı.`,
        ` ${r.idle} problemde hiç top taşınmadan süre doldu; bu problemlerde ${why}. Bu yüzden sonuç dikkatle okunmalı.`,
      );
    }
  }
  // Yorumlanmayan sonucun rozeti ve grafiği de yorumlanmış gibi görünmez.
  const dogru: CognitiveBlock = none
    ? { ...card('kg_dogru'), headline: 'Yorumlanmadı', text: accText }
    : {
    ...card('kg_dogru'),
    headline: O === 0 ? `${r.n} problemin hiçbiri en az hamlede değil` : O === r.n ? `${r.n} problemin hepsi en az hamlede` : `${r.n} problemin ${O === 1 ? 'biri' : `${O} tanesi`} en az hamlede`,
    text: accText,
    visual: {
      type: 'dots',
      label: 'Problem uzunluğuna göre en az hamlede çözülenler',
      rows: r.levels.map((l) => ({ label: `${l.moves} hamlelik`, filled: l.optimal, total: l.n, valueLabel: `${l.optimal}/${l.n}` })),
      legend: ['en az hamlede çözüldü', 'fazla hamle ya da çözülmedi'],
    } satisfies DotsVisual,
  };

  /* Problem uzadıkça */
  let uzunluk: CognitiveBlock;
  if (none) {
    uzunluk = { ...card('kg_uzunluk'), headline: 'Yorumlanmadı', text: `${noneWhy} kısa ve uzun problemler karşılaştırılmadı.` };
  } else {
    // Kısa, orta ve uzun problemlerin sayıları rozette ve grafiktedir; metin değişimin anlamını söyler.
    let text = '';
    const diff = S.optimal - L.optimal;
    if (S.optimal >= S.n - 1 && L.optimal >= L.n - 1) {
      const all = L.optimal === L.n ? 'hepsinde' : 'hemen hepsinde';
      if (M.optimal < M.n - 1) {
        // Kısa ve uzun problemler iyi, aradaki problemler değil: "düşmedi" denmez, aradaki sonuç da söylenir.
        text += v(
          ` Kısa ve uzun problemlerde sonucun birbirine yakın; ${midName} ise daha az problemi en az hamlede çözdün.`,
          ` Kısa ve uzun problemlerde sonucu birbirine yakın; ${midName} ise daha az problemi en az hamlede çözdü.`,
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
          : rapid
            ? v(
                ' Problemler uzadıkça en kısa yolu bulman zorlaştı. Uzun problemlerin çoğunda ilk topu çok çabuk aldın; bu düşüş bundan da kaynaklanmış olabilir (başlamadan önce düşünme kartına bak).',
                ' Problemler uzadıkça en kısa yolu bulması zorlaştı. Uzun problemlerin çoğunda ilk topu çok çabuk aldı; bu düşüş bundan da kaynaklanmış olabilir (başlamadan önce düşünme kartına bakın).',
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
    uzunluk = {
      ...card('kg_uzunluk'),
      headline: `Kısa problemlerde ${S.optimal}/${S.n}, uzun problemlerde ${L.optimal}/${L.n}`,
      text: text.trim(),
      visual: {
        type: 'bars',
        label: 'En az hamlede çözülen problemler',
        scale: 'share',
        rows: [
          { label: `Kısa (${TOWER_SHORT - 1} ve ${TOWER_SHORT} hamle)`, value: S.optimal, max: S.n, valueLabel: `${S.optimal}/${S.n}` },
          { label: `Orta (${mid.map((l) => l.moves).join(' ve ')} hamle)`, value: M.optimal, max: M.n, valueLabel: `${M.optimal}/${M.n}` },
          { label: `Uzun (${TOWER_LONG} ve ${TOWER_LONG + 1} hamle)`, value: L.optimal, max: L.n, valueLabel: `${L.optimal}/${L.n}` },
        ],
      } satisfies BarsVisual,
    };
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
      const where = r.idle === U ? (U === 1 ? 'bu problemde' : 'bunların hepsinde') : `bunların ${r.idle} tanesinde`;
      const idlePart = r.idle === 0 ? '' : v(`; ${where} hiç top taşımadın`, `; ${where} hiç top taşımadı`);
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
          'Hedefe ulaşamadığın problemlerde süre yetmemiş ya da çözüm yolunu bulamamış olabilirsin.',
          'Çocuğunuzun hedefe ulaşamadığı problemlerde süre yetmemiş ya da çözüm yolunu bulamamış olabilir.',
        ),
      );
    }
    cozumText = parts.join(' ');
  }
  // Hiç top taşınmayan problemler "hedefe ulaşılamadı" sayılmaz: grafikte ayrı gösterilir. Sonuç yorumlanmıyorsa kart da yorumlanmaz.
  const cozum: CognitiveBlock = none
    ? {
        ...card('kg_cozum'),
        headline: 'Yorumlanmadı',
        text: v(`${idleOf} hiç top taşımadın; bu yüzden çözüm biçimi yorumlanmadı.`, `Çocuğunuz ${idleOf} hiç top taşımadı; bu yüzden çözüm biçimi yorumlanmadı.`),
      }
    : {
    ...card('kg_cozum'),
    headline:
      E === 0 && U === 0
        ? 'Hepsi en az hamlede'
        : [E > 0 ? `${E} problem fazla hamleyle çözüldü` : '', U > 0 ? `${U} problemde hedefe ulaşılamadı` : ''].filter(Boolean).join(' · '),
    text: cozumText,
    visual: {
      type: 'stack',
      label: 'Problemler',
      total: r.n,
      parts: [
        { label: 'En az hamlede çözüldü', value: O },
        { label: 'Fazla hamleyle çözüldü', value: E },
        { label: 'Hedefe ulaşılamadı', value: U - r.idle },
        { label: 'Hiç top taşınmadı', value: r.idle },
      ],
    } satisfies StackVisual,
  };

  /* Başlamadan önce düşünme: problem ekrana geldikten sonra taşınan ilk topun alındığı ana kadar geçen süre */
  let plan: CognitiveBlock;
  if (none) {
    plan = { ...card('kg_plan'), headline: 'Yorumlanmadı', text: `${noneWhy} ilk hamleden önceki süreler yorumlanmadı.` };
  } else if (r.medianPick === null) {
    plan = { ...card('kg_plan'), headline: 'Süre hesaplanamadı', text: 'Süreler alınamadığı için ilk hamleden önceki süre hesaplanamadı.' };
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
      // İlk topa kadar geçen süre planın kendisi değildir (hamle yaparken de plan yapılabilir); küçük farklar "yakın" sayılır.
      if (b - a >= 2 && b >= 1.5 * a) {
        parts.push(
          v(
            'Uzun problemlerde ilk topu almadan önce kısa problemlerdekinden daha uzun bekledin. Problem zorlaştıkça başlamadan önce düşünmeye daha çok zaman ayırmış olabilirsin.',
            'Çocuğunuz uzun problemlerde ilk topu almadan önce kısa problemlerdekinden daha uzun bekledi. Problem zorlaştıkça başlamadan önce düşünmeye daha çok zaman ayırmış olabilir.',
          ),
        );
      } else if (b - a >= 1 && b >= 1.2 * a) {
        parts.push(
          v(
            'Uzun problemlerde ilk topu almadan önce kısa problemlerdekinden biraz daha uzun bekledin.',
            'Çocuğunuz uzun problemlerde ilk topu almadan önce kısa problemlerdekinden biraz daha uzun bekledi.',
          ),
        );
      } else {
        parts.push(
          a - b >= 1 && a >= 1.2 * b
            ? v('Uzun problemlerde ilk topu, kısa problemlerdekinden daha çabuk aldın.', 'Çocuğunuz uzun problemlerde ilk topu, kısa problemlerdekinden daha çabuk aldı.')
            : v(
                'Kısa ve uzun problemlerde ilk topu almadan önce birbirine yakın süre bekledin.',
                'Çocuğunuz kısa ve uzun problemlerde ilk topu almadan önce birbirine yakın süre bekledi.',
              ),
        );
        if (L.optimal >= L.n - 1) {
          const all = L.optimal === L.n ? 'hepsini' : 'hemen hepsini';
          parts.push(v(`Buna karşın uzun problemlerin de ${all} en az hamlede çözdün.`, `Buna karşın uzun problemlerin de ${all} en az hamlede çözdü.`));
        } else if (L.optimal <= L.n / 2) {
          const miss = L.optimal === 0 ? v('Uzun problemlerin hiçbirini en az hamlede çözemedin', 'Uzun problemlerin hiçbirini en az hamlede çözemedi') : v('Uzun problemlerin yarısında ya da daha çoğunda en kısa yolu bulamadın', 'Uzun problemlerin yarısında ya da daha çoğunda en kısa yolu bulamadı');
          parts.push(
            v(
              `${miss}; uzun problemlerde topa dokunmadan önce ilk birkaç hamleyi kafanda denemek işine yarayabilir.`,
              `${miss}; uzun problemlerde topa dokunmadan önce ilk birkaç hamleyi kafasında denemesi ona yardım edebilir.`,
            ),
          );
        }
      }
    }
    if (rapid) {
      parts.push(
        v(
          `${TOWER_RAPID_FROM} ya da daha çok hamlelik ${r.rapidOf} problemin ${r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`} ilk topu ${TOWER_RAPID_MS / 1000} saniyeden kısa sürede aldın ve bu problemleri en az hamlede çözemedin. Bazı kişiler hamle yaparken de plan yapar. Yine de topa dokunmadan önce ilk birkaç hamleyi kafanda denemek işine yarayabilir.`,
          `Çocuğunuz ${TOWER_RAPID_FROM} ya da daha çok hamlelik ${r.rapidOf} problemin ${r.rapid === r.rapidOf ? 'hepsinde' : `${r.rapid} tanesinde`} ilk topu ${TOWER_RAPID_MS / 1000} saniyeden kısa sürede aldı ve bu problemleri en az hamlede çözemedi. Bazı kişiler hamle yaparken de plan yapar. Yine de topa dokunmadan önce ilk birkaç hamleyi kafasında denemesi ona yardım edebilir.`,
        ),
      );
    }
    if (r.prePlan !== null) {
      // Yetişkine yazılan raporda araştırmanın yetişkinlerle yapıldığı ayrıca söylenmez.
      const study = audience === 'adult' ? 'Bir araştırmada' : 'Yetişkinlerle yapılan bir araştırmada';
      parts.push(
        v(
          `Hedefe ulaştığın problemlerde sürenin ortalama %${r.prePlan} kadarını ilk hamleden önce geçirdin. ${study}, başlamadan önce düşünmeye daha çok pay ayıranlar daha çok problemi en az hamlede çözmüştür. Bu bir ilişkidir, kesin bir kural değildir.`,
          `Çocuğunuz hedefe ulaştığı problemlerde sürenin ortalama %${r.prePlan} kadarını ilk hamleden önce geçirdi. Yetişkinlerle yapılan bir araştırmada, başlamadan önce düşünmeye daha çok pay ayıranlar daha çok problemi en az hamlede çözmüştür. Bu bir ilişkidir, kesin bir kural değildir.`,
        ),
      );
    }
    parts.push('Hız tek başına iyi ya da kötü değildir; önemli olan hedefe en az hamleyle ulaşabilmektir.');
    plan = {
      ...card('kg_plan'),
      headline: `İlk hamleden önce tipik ${towerSeconds(r.medianPick)}`,
      text: parts.join(' '),
      visual:
        r.pickShort !== null && r.pickLong !== null && !rapid
          ? ({
              type: 'bars',
              label: 'İlk hamleden önce tipik süre',
              scale: 'scale',
              unit: 'sn',
              rows: [
                { label: 'Bütün problemler', value: towerTenths(r.medianPick), valueLabel: towerSecShort(r.medianPick) },
                { label: `Kısa (${TOWER_SHORT - 1} ve ${TOWER_SHORT} hamle)`, value: towerTenths(r.pickShort), valueLabel: towerSecShort(r.pickShort) },
                { label: `Uzun (${TOWER_LONG} ve ${TOWER_LONG + 1} hamle)`, value: towerTenths(r.pickLong), valueLabel: towerSecShort(r.pickLong) },
              ],
            } satisfies BarsVisual)
          : durationStrip({
              label: 'Problemlerde ilk hamleden önceki süreler',
              rts: r.picks,
              median: r.medianPick,
              marker: `Tipik ${towerSecShort(r.medianPick)}`,
              item: 'bir problem',
            }),
    };
  }

  /* Grafikler ve öne çıkan sayılar */
  // Sonuç yorumlanmıyorsa problem uzunluğuna göre grafik de çizilmez.
  const chart: CognitiveReport['chart'] = none ? undefined : {
    title: 'Problem uzunluğuna göre en az hamlede çözülenler',
    note: v(
      'Her satırda aynı uzunlukta dört problem vardır. Çubuk ne kadar uzunsa o problemlerin o kadar çoğunu en az hamlede çözmüşsün demektir.',
      'Her satırda aynı uzunlukta dört problem vardır. Çubuk ne kadar uzunsa o problemlerin o kadar çoğu en az hamlede çözülmüş demektir.',
    ),
    rows: r.levels.map((l) => ({ label: `${l.moves} hamlelik problemler`, value: l.optimal, max: l.n, valueLabel: `${l.optimal}/${l.n}` })),
  };
  const figures = [
    { label: 'En az hamlede çözülen', value: none ? 'Yorumlanmadı' : `${O}/${r.n}` },
    { label: 'Fazla hamleyle çözülen', value: none ? 'Yorumlanmadı' : String(E) },
    { label: 'Hedefe ulaşılamayan', value: none ? 'Yorumlanmadı' : String(U) },
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
  return { blocks: [dogru, uzunluk, cozum, plan], ...(chart ? { chart } : {}), figures, ...(profile ? { profile } : {}) };
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

/** Kelime bilgisinde yanılgıya göre öneri: anlamları karıştırmakta seçenekleri yeniden okumak, cümledeki anlamda cümleyi yeniden okumak. */
const VOCABULARY_LURE_TIP: Record<VocabularyLure, { you: string; parent: string }> = {
  swap: { you: 'Seçmeden önce seçeneklerin hepsini okumak ve sorunun eş anlamlıyı mı, zıt anlamlıyı mı istediğine bir kez daha bakmak işine yarayabilir.', parent: 'Seçmeden önce seçeneklerin hepsini okuması ve sorunun eş anlamlıyı mı, zıt anlamlıyı mı istediğine bir kez daha bakması ona yardım edebilir.' },
  related: { you: 'Seçmeden önce seçeneklerin hepsini okumak ve sorunun eş anlamlıyı mı, zıt anlamlıyı mı istediğine bir kez daha bakmak işine yarayabilir.', parent: 'Seçmeden önce seçeneklerin hepsini okuması ve sorunun eş anlamlıyı mı, zıt anlamlıyı mı istediğine bir kez daha bakması ona yardım edebilir.' },
  sound: { you: 'Seçmeden önce seçeneklerin hepsini okumak ve sorunun eş anlamlıyı mı, zıt anlamlıyı mı istediğine bir kez daha bakmak işine yarayabilir.', parent: 'Seçmeden önce seçeneklerin hepsini okuması ve sorunun eş anlamlıyı mı, zıt anlamlıyı mı istediğine bir kez daha bakması ona yardım edebilir.' },
  meaning: { you: 'Seçtiğin anlamı cümlenin içine koyup cümleyi bir kez daha okumak işine yarayabilir.', parent: 'Seçtiği anlamı cümlenin içine koyup cümleyi bir kez daha okuması ona yardım edebilir.' },
  literal: { you: 'Seçtiğin anlamı cümlenin içine koyup cümleyi bir kez daha okumak işine yarayabilir.', parent: 'Seçtiği anlamı cümlenin içine koyup cümleyi bir kez daha okuması ona yardım edebilir.' },
};

/** "“eş anlam” ve “deyim”" gibi: türlerin cümle içindeki adları tırnak içinde. */
const vocabularyTypeList = (types: VocabularyType[]) => joinTr(types.map((t) => `“${VOCABULARY_TYPES[t].short}”`));

/** Kelime bilgisinin dört sonuç kartı, düzeylere göre grafik, öne çıkan sayılar ve soru türlerinin üç boyutlu grafiği. */
function vocabularyBlocks(r: VocabularyResult, task: VocabularyTask, audience: Audience, card: CardOf): TaskReport {
  const you = audience !== 'parent';
  const v = (student: string, parent: string) => (you ? student : parent);
  const chance = vocabularyChance(r);
  const rapid = vocabularyRapid(r);
  const samePos = vocabularySamePosition(r);
  const doubt = rapid || samePos;
  // Yanlışların çoğu çeldiriciyse, kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz (yanılgı cümlesi açıklar).
  const lurePattern = vocabularyLurePattern(r);
  const levelWord = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'][r.levels.length] ?? String(r.levels.length);

  /* Doğru cevaplar */
  let accText: string;
  if (chance) {
    accText = levelChanceText(v, r.n, VOCABULARY_CHANCE_MAX);
  } else {
    accText = levelAccText({
      v,
      levels: r.levels,
      n: r.n,
      correct: r.correct,
      allTail: ['en zor düzeydeki seyrek kelimeleri ve deyimleri de bildin', 'en zor düzeydeki seyrek kelimeleri ve deyimleri de bildi'],
      dropWhy: ['Bu beklenen bir durumdur: üst düzeylerdeki kelimeler daha seyrek kullanılır ve anlamları daha soyuttur.', 'Bu beklenen bir durumdur: üst düzeylerdeki kelimeler daha seyrek kullanılır ve anlamları daha soyuttur.'],
      hardFrom: 4,
      blame: !doubt && !lurePattern,
      blameInLevel: r.reached === 0,
      doubt,
    });
    // Yanlışların türü: sorunun "ilk bakışta doğru görünen" seçeneği; yanılgılar olasılık olarak söylenir.
    if (lurePattern) {
      const share = r.lures === r.wrong ? 'hepsinde' : `çoğunda (${r.wrong} yanlışın ${r.lures} tanesinde)`;
      const kinds = VOCABULARY_LURES_ORDER.filter((k) => r.luresByKind[k] > 0);
      const phrases = kinds.map((k) => VOCABULARY_LURE_TEXT[k]);
      const which = phrases.length > 1 ? 'şu yanılgılardan' : 'şu yanılgıdan';
      // Öneri yanılgıya göre seçilir (eş ve zıt anlam sorularında cümle yoktur); aynı öneri bir kez yazılır.
      const tips = [...new Set(kinds.map((k) => v(VOCABULARY_LURE_TIP[k].you, VOCABULARY_LURE_TIP[k].parent)))];
      accText += v(
        ` Yanlış cevaplarının ${share} ilk bakışta doğru görünen ama sorulan anlama uymayan seçeneği seçtin. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. ${tips.join(' ')}`,
        ` Çocuğunuz yanlış cevaplarının ${share} ilk bakışta doğru görünen ama sorulan anlama uymayan seçeneği seçti. Bu yanlışlar ${which} kaynaklanmış olabilir: ${phrases.join('; ')}. ${tips.join(' ')}`,
      );
    }
    if (doubt) {
      accText += v(
        ' Bazı soruları okumadan seçmiş olabileceğin için (çalışma biçimi kartına bak) bu sonuç seni tam yansıtmayabilir.',
        ' Çocuğunuz bazı soruları okumadan seçmiş olabileceği için (çalışma biçimi kartına bakın) bu sonuç onu tam yansıtmayabilir.',
      );
    }
  }
  const dogru: CognitiveBlock = { ...card('kb_dogru'), headline: `${r.n} soruda ${r.correct} doğru`, text: accText };

  /* Ulaşılan düzey */
  const duzey = reachedLevelBlock({
    base: card('kb_duzey'),
    v,
    levels: r.levels,
    reached: r.reached,
    plans: task.levels,
    noInterpret: chance ? 'Doğru cevaplar çok az olduğu için ulaşılan düzey yorumlanmadı.' : null,
    zeroCause: doubt ? ZERO_DOUBT : lurePattern ? [' Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.', ' Bu; çocuğunuzun yönergeyi tam anlamamasından, doğru cevaplar kartında anlatılan yanılgılardan ya da okumakta henüz yeterince rahat olmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'] : [ZERO_CAUSE[0], ' Bu; çocuğunuzun dikkatinin dağılmasından, acele etmesinden, yönergeyi tam anlamamasından ya da okumakta henüz yeterince rahat olmamasından kaynaklanabilir ve tek başına yorumlanmamalıdır.'],
    rapid: rapid,
    doubt,
  });

  /* Soru türleri */
  const most = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
  const good = r.types.filter(most).map((x) => x.type);
  const hard = r.types.filter((x) => !most(x)).map((x) => x.type);
  const rough = ' Her türde yalnızca altı soru vardı ve her türde kolaydan zora sorular bulunuyordu; bu yüzden türler arasındaki fark yalnızca yaklaşık bir fikir verir.';
  let tur: CognitiveBlock;
  if (chance) {
    tur = { ...card('kb_tur'), headline: 'Yorumlanmadı', text: 'Doğru cevaplar çok az olduğu için soru türleri karşılaştırılmadı.' };
  } else {
    // Zorlanılan türlerde ne gerektiği en çok iki tür için yazılır (uzun bir liste okunmaz).
    const needs =
      hard.length > 2
        ? ''
        : hard.length === 1
        ? `Bu tür sorularda ${VOCABULARY_TYPES[hard[0]].plain} gerekir.`
        : hard.map((x) => capTr(`${vocabularyTypeList([x])} sorularında ${VOCABULARY_TYPES[x].plain} gerekir.`)).join(' ');
    const allRight = r.types.every((x) => x.correct === x.n);
    const head = allRight
      ? `${r.types.length} soru türünün hepsinde bütün sorular doğru`
      : good.length === r.types.length
        ? `${r.types.length} soru türünün hepsinde soruların çoğu doğru`
        : good.length === 0
          ? `${r.types.length} soru türünün hiçbirinde soruların çoğu doğru değil`
          : `${r.types.length} soru türünün ${good.length === 1 ? 'birinde' : `${good.length} tanesinde`} soruların çoğu doğru`;
    let text: string;
    if (hard.length === 0) {
      text = v(
        `${r.types.length} soru türünün her birinde ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldun: eş anlam, zıt anlam, cümlede anlam ve deyim sorularının ${allRight ? 'hepsinde' : 'çoğunda'} doğru seçeneği seçtin.`,
        `Çocuğunuz ${r.types.length} soru türünün her birinde ${allRight ? 'bütün soruları' : 'soruların çoğunu'} doğru buldu: eş anlam, zıt anlam, cümlede anlam ve deyim sorularının ${allRight ? 'hepsinde' : 'çoğunda'} doğru seçeneği seçti.`,
      );
    } else if (good.length === 0) {
      const best = [...r.types].sort((a, b) => b.correct / b.n - a.correct / a.n)[0];
      text = v(
        `Hiçbir soru türünde soruların çoğunu doğru bulamadın; en çok doğru cevabı ${vocabularyTypeList([best.type])} sorularında verdin.`,
        `Çocuğunuz hiçbir soru türünde soruların çoğunu doğru bulamadı; en çok doğru cevabı ${vocabularyTypeList([best.type])} sorularında verdi.`,
      );
    } else {
      text = v(
        `${vocabularyTypeList(good)} sorularının çoğunu doğru buldun; ${vocabularyTypeList(hard)} sorularında zorlandın. ${needs}`,
        `Çocuğunuz ${vocabularyTypeList(good)} sorularının çoğunu doğru buldu; ${vocabularyTypeList(hard)} sorularında zorlandı. ${needs}`,
      );
    }
    tur = { ...card('kb_tur'), headline: head, text: capTr(text.trim()) + rough };
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (rapid) {
    const which = r.rapid === r.rapidOf ? 'hepsine' : `${r.rapid} tanesine`;
    issues.push(
      v(
        `3. düzey ve üstündeki ${r.rapidOf} sorunun ${which}, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede yanlış cevap verdin; bu sorularda okumadan seçmiş olabilirsin.`,
        `Çocuğunuz 3. düzey ve üstündeki ${r.rapidOf} sorunun ${which}, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede yanlış cevap verdi; bu sorularda okumadan seçmiş olabilir.`,
      ),
    );
  }
  if (samePos) {
    issues.push(
      v(
        `${r.samePosition === r.n ? 'Bütün cevaplarında' : `Cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçtin; birçok soruda bakmadan aynı yere basmış olabilirsin.`,
        `Çocuğunuz ${r.samePosition === r.n ? 'bütün cevaplarında' : `cevaplarının ${r.samePosition} tanesinde`} aynı sıradaki seçeneği seçti; birçok soruda bakmadan aynı yere basmış olabilir.`,
      ),
    );
  }
  let calisma: CognitiveBlock;
  // Kolay ve zor sorulardaki süreler yalnızca sonuç yorumlanıyorsa karşılaştırılır.
  const comparePace = !doubt && !chance && r.rtEasy !== null && r.rtHard !== null;
  if (r.medianRt === null) {
    calisma = { ...card('kb_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Cevap süreleri alınamadığı için süreler yorumlanmadı.'].join(' ') };
  } else {
    let pace = chance ? v(...PACE_SKIPPED) : '';
    if (comparePace && r.rtEasy !== null && r.rtHard !== null) {
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
        pace = paceClose(v, r.rtEasy, r.rtHard);
      }
    }
    const base = v(`Bir soruyu cevaplaman tipik olarak ${seconds(r.medianRt)} sürdü.`, `Çocuğunuzun bir soruyu cevaplaması tipik olarak ${seconds(r.medianRt)} sürdü.`);
    calisma = {
      ...card('kb_calisma'),
      headline: `Soru başına tipik süre ${seconds(r.medianRt)}`,
      text: [base, ...issues, pace].filter(Boolean).join(' ') + noLimitText(v, rapid),
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
        ? { label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' }
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
  /* Kart grafikleri */
  // Yorumlanmayan kartın grafiği olmaz: grafik, kartın yapmadığı bir karşılaştırmayı yapmış olurdu.
  dogru.visual = levelDotsVisual(r.levels);
  if (!chance) duzey.visual = levelStepsVisual(r.levels.length, r.reached);
  if (!chance) tur.visual = typeBarsVisual('Soru türlerine göre doğru cevaplar', r.types.map((x) => ({ name: VOCABULARY_TYPES[x.type].name, correct: x.correct, n: x.n })));
  if (r.medianRt !== null) calisma.visual = paceVisual(r.medianRt, r.rts, { label: '1–2. düzey', ms: comparePace ? r.rtEasy : null }, { label: '4–5. düzey', ms: comparePace ? r.rtHard : null });
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
  // Hiç cevap yoksa ya da denemelerin yarısında süre dolduysa az doğru cevabın nedeni rastgele basmak değil, basmamaktır.
  const none = r.answered === 0;
  const mostlyTimeouts = !none && r.timeouts * 2 >= r.n;
  const chanceWhy = none ? 'Hiç cevap verilmediği için' : mostlyTimeouts ? 'Denemelerin çoğunda süre dolduğu için' : 'Doğru cevaplar çok az olduğu için';

  /* Doğruluk */
  let accText: string;
  if (none) {
    accText = v(
      'Hiçbir denemede süre içinde düğmeye basmadın; bu yüzden sonuç yorumlanmadı. Görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin.',
      'Çocuğunuz hiçbir denemede süre içinde düğmeye basmadı; bu yüzden sonuç yorumlanmadı. Görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir.',
    );
  } else if (chance && mostlyTimeouts) {
    accText = v(
      'Denemelerin çoğunda süre içinde basmadın; doğru cevaplar bu yüzden az. Görevi yarıda bırakmış ya da dikkatin dağılmış olabilir; bu yüzden sonuç yorumlanmadı.',
      'Çocuğunuz denemelerin çoğunda süre içinde basmadı; doğru cevaplar bu yüzden az. Görevi yarıda bırakmış ya da dikkati dağılmış olabilir; bu yüzden sonuç yorumlanmadı.',
    );
  } else if (chance) {
    accText = v(
      'Doğru cevapların, iki düğmeden birine rastgele basan birinin de yapabileceği kadar az. Kuralları tam anlamamış, şekillere bakmadan basmış ya da görevi yarıda bırakmış olabilirsin. Bu sonuç tek başına bir şey söylemez; dinlenmiş olduğun bir gün, acele etmeden yeniden denemek daha doğru bir sonuç verebilir.',
      'Çocuğunuzun doğru cevapları, iki düğmeden birine rastgele basan birinin de yapabileceği kadar az. Kurallar tam anlaşılmamış, şekillere bakılmadan basılmış ya da görev yarıda bırakılmış olabilir. Bu sonuç yorumlanmamalıdır; dinlenmiş olduğu bir gün, acele etmeden yeniden denemesi daha doğru bir sonuç verebilir.',
    );
  } else {
    // Eşikler, rozette yazan (yuvarlanmış) yüzdeyle karşılaştırılır ki rozet ile metin birbirini tutsun.
    const p = Math.round(r.accuracy * 100);
    accText =
      r.correct === r.n
        ? v('Şekillere, işaretin söylediği kurala göre her seferinde doğru cevap verdin.', 'Çocuğunuz şekillere, işaretin söylediği kurala göre her seferinde doğru cevap verdi.')
        : p >= 95
        ? v('Şekillere, işaretin söylediği kurala göre neredeyse her seferinde doğru cevap verdin.', 'Çocuğunuz şekillere, işaretin söylediği kurala göre neredeyse her seferinde doğru cevap verdi.')
        : p >= 85
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
  const dogruluk: CognitiveBlock = none
    ? { ...card('kd_dogruluk'), headline: 'Cevap verilmedi', text: accText }
    : {
        ...card('kd_dogruluk'),
        headline: `${pct(r.accuracy)} doğru`,
        text: accText,
        visual: pctBarsVisual('Doğru cevap oranı', [
          { label: 'Tek kurallı bölümler', rate: r.pure.accuracy },
          { label: 'İki kural karışınca: kural sürerken', rate: r.repeat.accuracy },
          { label: 'İki kural karışınca: kural değişince', rate: r.switch.accuracy },
        ]),
      };

  /* Kural değiştirme */
  let degisim: CognitiveBlock;
  let switchFig: { value: string; note?: string } = { value: 'Yorumlanmadı' };
  if (chance) {
    degisim = { ...card('kd_degisim'), headline: 'Yorumlanmadı', text: `${chanceWhy} kural değiştirmenin etkisi yorumlanmadı.` };
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
    const visual = msBarsVisual('Tipik cevap süresi', [
      { label: 'Kural sürerken', ms: a },
      { label: 'Kural değişince', ms: b },
    ]);
    // Kural değişince doğruluk da en az 10 puan düşerse söylenir. Kural sürerken doğruluk yüksekken kural değişince
    // rastgele basmaya yakın bir düzeye inerse, çoğu zaman bir önceki kurala göre basılmaya devam edilmiş olabilir.
    const accDrop =
      r.switch.accuracy <= 0.6 && r.repeat.accuracy >= 0.8
        ? v(
            ` Kural değiştiğinde hataların da belirgin biçimde arttı: doğru cevapların ${pct(r.repeat.accuracy)} yerine ${pct(r.switch.accuracy)} oldu. Bu oran, iki düğmeden birine rastgele basan birinin bulacağına yakın. Kural değişince çoğu zaman bir önceki kurala göre basmaya devam etmiş olabilirsin; basmadan önce şeklin üstündeki işarete bir an bakmak işine yarar.`,
            ` Kural değiştiğinde hatalar da belirgin biçimde arttı: doğru cevaplar ${pct(r.repeat.accuracy)} yerine ${pct(r.switch.accuracy)} oldu. Bu oran, iki düğmeden birine rastgele basan birinin bulacağına yakın. Kural değişince çocuğunuz çoğu zaman bir önceki kurala göre basmaya devam etmiş olabilir.`,
          )
        : r.repeat.accuracy - r.switch.accuracy >= 0.1
        ? v(
            ` Kural değiştiğinde hataların da arttı: doğru cevapların ${pct(r.repeat.accuracy)} yerine ${pct(r.switch.accuracy)} oldu.`,
            ` Kural değiştiğinde hatalar da arttı: doğru cevaplar ${pct(r.repeat.accuracy)} yerine ${pct(r.switch.accuracy)} oldu.`,
          )
        : '';
    if (diff >= RULE_COST_MIN_MS) {
      degisim = {
        ...card('kd_degisim'),
        headline: `Kural değişince ${sn(diff)} sn daha yavaş`,
        visual,
        text:
          v(
            'Kural değiştiğinde cevapların, aynı kural sürerken verdiğin cevaplardan daha yavaştı. Bu çoğu kişide görülür: yeni kurala geçmek için zihnin kendini yeniden ayarlaması gerekir. Çok uzun alıştırmalardan sonra bile bu fark tamamen kaybolmaz.',
            'Kural değiştiğinde çocuğunuzun cevapları, aynı kural sürerken verdiği cevaplardan daha yavaştı. Bu, kural değiştirme çalışmalarının bilinen bir bulgusudur: kural değişince cevaplar yavaşlar ve hatalar artar. Çok uzun alıştırmalar bile bu farkı ortadan kaldırmaz (Stoet ve Snyder, 2007).',
          ) +
          accDrop +
          v(' Bu fark bir seferden ötekine değişebilir.', ' Tek bir uygulamada bu farkın kesinliği düşüktür; tek başına yorumlanmamalıdır.'),
      };
    } else if (diff <= -RULE_COST_MIN_MS) {
      degisim = {
        ...card('kd_degisim'),
        headline: 'Kural değişince daha hızlı',
        visual,
        text:
          v(
            'Kural değiştiğinde cevapların, aynı kural sürerken verdiğin cevaplardan biraz daha hızlıydı. Bu sık görülmez; çoğu zaman rastlantıdır, çünkü cevap süreleri denemeden denemeye biraz değişir. Bu sonuç bir seferden ötekine değişebilir.',
            'Kural değiştiğinde çocuğunuzun cevapları, aynı kural sürerken verdiği cevaplardan biraz daha hızlıydı. Bu sık görülmez; çoğu zaman rastlantıdır, çünkü cevap süreleri denemeden denemeye biraz değişir. Tek bir uygulamada bu farkın kesinliği düşüktür.',
          ) + accDrop,
      };
    } else {
      degisim = {
        ...card('kd_degisim'),
        headline: 'Belirgin bir fark görülmedi',
        visual,
        text:
          v(
            'Kural değiştiğinde cevapların, aynı kural sürerken verdiğin cevaplardan belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlama, bu uygulamada sende belirgin olarak ortaya çıkmadı. Bu sonuç bir seferden ötekine değişebilir.',
            'Kural değiştiğinde çocuğunuzun cevapları, aynı kural sürerken verdiği cevaplardan belirgin biçimde yavaş değildi. Çoğu kişide görülen bu yavaşlamanın belirgin olmaması rastlantıdan da kaynaklanabilir. Tek bir uygulamada bu sonucun kesinliği düşüktür.',
          ) + accDrop,
      };
    }
  }

  /* İki kuralı akılda tutma */
  let karisik: CognitiveBlock;
  if (chance) {
    karisik = { ...card('kd_karisik'), headline: 'Yorumlanmadı', text: `${chanceWhy} iki kuralın karıştığı bölüm yorumlanmadı.` };
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
    const visual = msBarsVisual('Tipik cevap süresi', [
      { label: 'Tek kurallı bölümler', ms: a },
      { label: 'İki kural karışınca (kural sürerken)', ms: b },
    ]);
    if (diff >= RULE_COST_MIN_MS) {
      karisik = {
        ...card('kd_karisik'),
        headline: `İki kural karışınca ${sn(diff)} sn daha yavaş`,
        visual,
        text: v(
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerde bile cevapların tek kurallı bölümlerdeki cevaplarından daha yavaştı. Bu çoğu kişide görülür ve genellikle iki kuralı birden akılda tutup her denemede işarete bakmanın gerektirdiği çabadan kaynaklanır. Bu tür farklar bir seferden ötekine değişebilir.',
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerde bile çocuğunuzun cevapları tek kurallı bölümlerdeki cevaplarından daha yavaştı. Bu fark, iki kuralı birden akılda tutmanın gerektirdiği genel çabayı gösterir ve çoğu kişide görülür. Tek bir uygulamada bu tür farkların kesinliği düşüktür.',
        ),
      };
    } else if (diff <= -RULE_COST_MIN_MS) {
      karisik = {
        ...card('kd_karisik'),
        headline: 'İki kural karışınca daha hızlı',
        visual,
        text: v(
          'İki kuralın karıştığı bölümde cevapların, tek kurallı bölümlerdeki cevaplarından daha hızlıydı. Karışık bölümler görevin sonunda geldiği için bu, göreve alışıp ısınmaktan kaynaklanmış olabilir.',
          'İki kuralın karıştığı bölümde çocuğunuzun cevapları, tek kurallı bölümlerdeki cevaplarından daha hızlıydı. Karışık bölümler görevin sonunda geldiği için bu, göreve alışmaktan kaynaklanmış olabilir. Tek bir uygulamada bu tür farkların kesinliği düşüktür.',
        ),
      };
    } else {
      karisik = {
        ...card('kd_karisik'),
        headline: 'Belirgin bir fark görülmedi',
        visual,
        text: v(
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerdeki cevapların tek kurallı bölümlerdeki cevaplarından belirgin biçimde yavaş değildi. Bu sonuç bir seferden ötekine değişebilir.',
          'İki kuralın karıştığı bölümde, kural değişmediği denemelerde çocuğunuzun cevapları tek kurallı bölümlerdeki cevaplarından belirgin biçimde yavaş değildi. Tek bir uygulamada bu sonucun kesinliği düşüktür.',
        ),
      };
    }
  }

  /* Çalışma biçimi */
  const issues: string[] = [];
  if (none) {
    issues.push(
      v(
        'Hiçbir denemede süre içinde basmadın; görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin.',
        'Çocuğunuz hiçbir denemede süre içinde basmadı; görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir.',
      ),
    );
  } else if (timeouts) {
    issues.push(
      v(
        `${r.n} denemenin ${r.timeouts} tanesinde süre içinde basmadın; görevi yarıda bırakmış ya da dikkatin dağılmış olabilir.`,
        `Çocuğunuz ${r.n} denemenin ${r.timeouts} tanesinde süre içinde basmadı; görevi yarıda bırakmış ya da dikkati dağılmış olabilir.`,
      ),
    );
  }
  if (fast) {
    issues.push(
      v(
        `${r.tooFast} denemede şekil göründükten sonraki 0,2 saniye içinde bastın; bu denemelerde şekle bakmadan basmış olabilirsin.`,
        `Çocuğunuz ${r.tooFast} denemede şekil göründükten sonraki 0,2 saniye içinde bastı; bu denemelerde şekle bakmadan basmış olabilir.`,
      ),
    );
  }
  if (oneSide) {
    issues.push(
      v(
        'Cevaplarının çoğunda aynı düğmeye bastın; şekillere bakmadan hep aynı düğmeye basmış olabilirsin.',
        'Çocuğunuz cevaplarının çoğunda aynı düğmeye bastı; şekillere bakmadan hep aynı düğmeye basmış olabilir.',
      ),
    );
  }
  const noLimit = v(
    ' Hız tek başına iyi ya da kötü değildir; bu görevde önemli olan, kurala göre doğru düğmeye basabilmektir.',
    ' Hız tek başına iyi ya da kötü değildir; bu görevde önemli olan, kurala göre doğru düğmeye basabilmektir.',
  );
  // Doğru cevaplar şans düzeyindeyse onların süresi de bir şey söylemez: kart yorumlanmaz, grafiği olmaz.
  const calisma: CognitiveBlock =
    r.medianRt === null
      ? { ...card('kd_calisma'), headline: 'Süre hesaplanamadı', text: [...issues, 'Yeterince doğru cevap olmadığı için cevap süreleri yorumlanmadı.'].join(' ') }
      : chance
        ? {
            ...card('kd_calisma'),
            headline: 'Yorumlanmadı',
            text: [
              ...issues,
              mostlyTimeouts
                ? 'Bu yüzden cevap süresi yorumlanmadı.'
                : 'Doğru cevaplar rastgele basmayla da görülebilecek kadar az olduğu için cevap süresi yorumlanmadı.',
            ].join(' '),
          }
      : {
          ...card('kd_calisma'),
          headline: `Tipik cevap süresi ${sn(to10(r.medianRt))} sn`,
          visual: durationStrip({
            label: 'Doğru cevaplarda cevap süreleri',
            rts: r.rts,
            median: to10(r.medianRt),
            marker: `Tipik ${sn(to10(r.medianRt))} sn`,
            item: 'bir doğru cevap',
            digits: 2,
          }),
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
    { label: 'Doğru', value: none ? 'Cevap verilmedi' : pct(r.accuracy) },
    { label: 'Kural değiştirmenin etkisi', ...switchFig },
    ...(r.medianRt !== null && !chance ? [{ label: 'Tipik cevap süresi', value: `${sn(to10(r.medianRt))} sn` }] : []),
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
  semantic: (n) => `ilk listedeki bir kelimeye anlamca yakın ${n} kelime`,
  sound: (n) => `ilk listedeki bir kelimeye sesi ve yazılışı benzeyen ${n} kelime`,
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
        'Hatırlama bölümlerinin hiçbirinde kelime yazmadın; bu yüzden sonuç yorumlanmadı. Yönergeyi tam anlamamış ya da görevi yarıda bırakmış olabilirsin.',
        'Çocuğunuz hatırlama bölümlerinin hiçbirinde kelime yazmadı; bu yüzden sonuç yorumlanmadı. Yönerge anlaşılmamış ya da görev yarıda kalmış olabilir.',
      ),
    };
  } else {
    const parts: string[] = [
      v(
        `Aynı liste üç kez gösterildi. ${L} kelimeden ilk denemede ${t1}, ikincide ${t2}, üçüncüde ${t3} kelime hatırladın (toplam ${r.total}).`,
        `Aynı liste üç kez gösterildi. Çocuğunuz ${L} kelimeden ilk denemede ${t1}, ikincide ${t2}, üçüncüde ${t3} kelime hatırladı (toplam ${r.total}).`,
      ),
    ];
    // İlk denemede kelimelerin hemen hepsi hatırlandıysa artış için yer yoktur: önce bu söylenir.
    const ceiling = t1 >= WL_CEILING && t3 >= WL_CEILING;
    if (ceiling) {
      parts.push(
        v(
          'İlk denemeden başlayarak kelimelerin hemen hepsini hatırladın; sayının artması için fazla yer yoktu.',
          'İlk denemeden başlayarak kelimelerin hemen hepsini hatırladı; sayının artması için fazla yer yoktu.',
        ),
      );
    } else if (r.gain >= WL_GAIN_CLEAR) {
      parts.push(
        v(
          'Liste tekrarlandıkça hatırladığın kelime sayısı belirgin biçimde arttı: tekrarlar kelimeleri öğrenmene yardım etti.',
          'Liste tekrarlandıkça hatırladığı kelime sayısı belirgin biçimde arttı: tekrarlar kelimeleri öğrenmesine yardım etti.',
        ),
      );
    } else if (r.gain > 0) {
      parts.push(v('Liste tekrarlandıkça hatırladığın kelime sayısı biraz arttı.', 'Liste tekrarlandıkça hatırladığı kelime sayısı biraz arttı.'));
    } else {
      const verb = r.gain < 0 ? 'azaldı' : 'artmadı';
      parts.push(
        v(
          `Liste tekrarlandığı hâlde hatırladığın kelime sayısı ${verb}. Bunun nedeni yorgunluk, dikkat dağınıklığı ya da her denemede bütün kelimeleri yeniden yazmanın unutulması olabilir.`,
          `Liste tekrarlandığı hâlde hatırladığı kelime sayısı ${verb}. Bunun nedeni yorgunluk, dikkat dağınıklığı ya da her denemede bütün kelimeleri yeniden yazmanın unutulması olabilir.`,
        ),
      );
    }
    if (!ceiling) {
      parts.push(
        `${L} kelime, bir kerede akılda tutulabilecek sayıdan fazladır; bu yüzden çoğu kişi ilk denemede kelimelerin bir kısmını hatırlar, sonraki denemelerde yenilerini ekler (Oliveira ve Charchat-Fichman, 2008).`,
      );
    }
    parts.push(
      v(
        'Bu beceri; bir alışveriş listesini, yeni tanıştığın kişilerin adlarını ya da yeni öğrendiğin kelimeleri akılda tutmak gibi işlerde kullanılır.',
        'Bu beceri; bir alışveriş listesini, yeni tanıştığı kişilerin adlarını ya da yeni öğrendiği kelimeleri akılda tutmak gibi işlerde kullanılır.',
      ),
    );
    if (wordListManyExtra(r)) parts.push('Hiçbir listede olmayan çok sayıda kelime yazıldığı için bu sonuç dikkatle yorumlanmalıdır.');
    ogrenme = {
      ...card('kl_ogrenme'),
      headline: `${counts.slice(0, -1).join(', ')} ve ${counts[counts.length - 1]} kelime`,
      text: parts.join(' '),
      visual: {
        type: 'columns',
        label: 'Öğrenme denemelerinde hatırlanan kelimeler',
        rows: counts.map((c, i) => ({ label: `${i + 1}. deneme`, value: c, valueLabel: String(c) })),
        max: L,
        caption: `${L} kelimeden`,
      } satisfies ColumnsVisual,
    };
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
      headline = 'Karşılaştırılmadı';
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
            'Araya giren yeni listeden sonra ilk listeden hatırladıkların biraz azaldı. Yeni bir bilgi, daha önce öğrenilenleri hatırlamayı biraz zorlaştırabilir; bu çoğu kişide görülür.',
            'Araya giren yeni listeden sonra ilk listeden hatırladıkları biraz azaldı. Yeni bir bilgi, daha önce öğrenilenleri hatırlamayı biraz zorlaştırabilir; bu çoğu kişide görülür.',
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
        // Tanıma kartı bu karşılaştırmayı gerçekten yapıyorsa okur oraya yönlendirilir.
        if (valid && rec.hits - d >= WL_RECOGNITION_GAP && rec.falseRate <= WL_RECOGNITION_FALSE_MAX) {
          parts.push('Kelimelerin akılda kalıp kalmadığını tanıma bölümünün sonucu ayrıca gösterir.');
        }
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
    // Kartın karşılaştırdığı sayılar: üçüncü deneme, ikinci liste ve araya giren listeden sonra ilk liste. Karşılaştırma
    // yorumlanmadıysa grafiği de çizilmez.
    if (!skipped && t3 >= WL_RETENTION_MIN) {
      koruma.visual = {
        type: 'bars',
        label: `Hatırlanan kelimeler (${L} kelimeden)`,
        scale: 'share',
        rows: [
          { label: 'İlk liste, 3. deneme', value: t3, max: L, valueLabel: `${t3}/${L}` },
          { label: 'İkinci liste (bir kez)', value: r.b.correct, max: L, valueLabel: `${r.b.correct}/${L}` },
          { label: 'İlk liste, araya giren listeden sonra', value: d, max: L, valueLabel: `${d}/${L}` },
        ],
      } satisfies BarsVisual;
    }
  }

  /* Tanıma */
  const said = (yes: boolean) => (yes ? v('dedin', 'dedi') : v('demedin', 'demedi'));
  const T = rec.targets;
  // "1 tanesine" denmez: "birine".
  const some = (k: number) => (k === 1 ? 'birine' : `${k} tanesine`);
  const recSentence =
    rec.hits === 0 && fa === 0
      ? `İlk listedeki ${T} kelimenin de, ilk listede olmayan ${nLures} kelimenin de hiçbirine “evet” ${said(false)}.`
      : `İlk listedeki ${rec.hits === T ? `${T} kelimenin hepsine “evet” ${said(true)}` : rec.hits === 0 ? `${T} kelimenin hiçbirine “evet” ${said(false)}` : `${T} kelimeden ${some(rec.hits)} “evet” ${said(true)}`}; ilk listede olmayan ${
          fa === 0 ? `${nLures} kelimenin hiçbirine “evet” ${said(false)}` : `${nLures} kelimeden ${some(fa)} ${rec.hits === 0 ? 'ise' : 'de'} “evet” ${said(true)}`
        }.`;
  const base = `Son bölümde ${rec.n} kelime tek tek gösterildi. ${you ? recSentence : `Çocuğunuz ${recSentence.charAt(0).toLocaleLowerCase('tr-TR')}${recSentence.slice(1)}`}`;
  let tanima: CognitiveBlock;
  if (!valid) {
    const every = rec.yes === 0 || rec.yes === rec.n ? 'her' : 'hemen her';
    const fastWhich = rec.tooFast === rec.n ? 'Kelimelerin hepsinde' : `${rec.tooFast} kelimede`;
    const why = wordListRecogOneSided(r)
      ? v(`Bu bölümde ${every} kelimeye aynı cevabı verdin; bu yüzden tanıma sonucu yorumlanmadı.`, `Bu bölümde ${every} kelimeye aynı cevabı verdi; bu yüzden tanıma sonucu yorumlanmadı.`)
      : wordListRecogFast(r)
        ? v(
            `${fastWhich} 0,3 saniyeden kısa sürede cevap verdin; kelimeye bakmadan cevap vermiş olabilirsin. Bu yüzden tanıma sonucu yorumlanmadı.`,
            `${fastWhich} 0,3 saniyeden kısa sürede cevap verdi; kelimeye bakmadan cevap vermiş olabilir. Bu yüzden tanıma sonucu yorumlanmadı.`,
          )
        : v(
            'İlk listedeki ve ilk listede olmayan kelimelere benzer oranda “evet” dedin; tahminle cevap vermiş olabilirsin. Bu yüzden tanıma sonucu yorumlanmadı.',
            'İlk listedeki ve ilk listede olmayan kelimelere benzer oranda “evet” dedi; tahminle cevap vermiş olabilir. Bu yüzden tanıma sonucu yorumlanmadı.',
          );
    tanima = { ...card('kl_tanima'), headline: 'Yorumlanmadı', text: `${base} ${why}` };
  } else {
    const parts: string[] = [base];
    if (fa === 1) {
      // Tek yanılgı: liste yerine kelimenin türü bir cümleyle söylenir.
      const k = (['b', 'semantic', 'sound', 'new'] as const).find((x) => rec.falseYes[x] > 0)!;
      const what = {
        b: 'ikinci listedeki bir kelimeydi',
        semantic: 'ilk listedeki bir kelimeye anlamca yakın bir kelimeydi',
        sound: 'ilk listedeki bir kelimeye sesi ve yazılışı benzeyen bir kelimeydi',
        new: 'hiçbir listede olmayan bir kelimeydi',
      }[k];
      parts.push(v(`Yanlışlıkla “evet” dediğin kelime, ${what}.`, `Yanlışlıkla “evet” dediği kelime, ${what}.`));
    } else if (fa > 0) {
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
            'Yanlışlıkla “evet” dediği kelimelerin çoğu hiçbir listede olmayan ilgisiz kelimelerdi; bu bölümde dikkati dağılmış ya da tahminle cevap vermiş olabilir.',
          ),
        );
      }
    }
    // Yeni kelimelerin de birçoğuna "evet" denmişse ilk listedeki kelimelere "evet" demek onları tanımayı tam göstermez.
    const looseYes = rec.falseRate >= 0.3;
    if (looseYes) {
      parts.push(
        v(
          'İlk listede olmayan kelimelerin de birçoğuna “evet” dediğin için, ilk listedeki kelimelere “evet” demen onları tanıdığını tam göstermez: kelimeleri birbirinden ayırmakta zorlanmış ya da kararsız kaldığında “evet” demiş olabilirsin.',
          'İlk listede olmayan kelimelerin de birçoğuna “evet” dediği için, ilk listedeki kelimelere “evet” demesi onları tanıdığını tam göstermez: kelimeleri birbirinden ayırmakta zorlanmış ya da kararsız kaldığında “evet” demiş olabilir.',
        ),
      );
    } else if (!none && !skipped && rec.hits - d >= WL_RECOGNITION_GAP && rec.falseRate <= WL_RECOGNITION_FALSE_MAX) {
      const kept = rec.hits === T ? v('kendiliğinden hatırlayamadığın kelimeler de', 'kendiliğinden hatırlayamadığı kelimeler de') : v('kendiliğinden hatırlayamadığın kelimelerin bir kısmı da', 'kendiliğinden hatırlayamadığı kelimelerin bir kısmı da');
      parts.push(
        v(
          `Kendiliğinden yazarken ilk listeden ${d} kelime hatırladın, görünce ise ${rec.hits} kelimeyi tanıdın: ${kept} aklında kalmış. Görünce tanımak, kendiliğinden hatırlamaktan genellikle daha kolaydır.`,
          `Kendiliğinden yazarken ilk listeden ${d} kelime hatırladı, görünce ise ${rec.hits} kelimeyi tanıdı: ${kept} aklında kalmış. Görünce tanımak, kendiliğinden hatırlamaktan genellikle daha kolaydır.`,
        ),
      );
    } else if (rec.hits >= T - 1 && fa <= 1) {
      parts.push(v('İlk listedeki kelimeleri, ilk listede olmayanlardan çok iyi ayırt ettin.', 'İlk listedeki kelimeleri, ilk listede olmayanlardan çok iyi ayırt etti.'));
    }
    tanima = {
      ...card('kl_tanima'),
      headline: looseYes ? `${rec.hits}/${T} “evet”, ${fa} yanlış “evet”` : `${rec.hits}/${T} tanındı, ${fa} yanlış “evet”`,
      text: parts.join(' '),
      visual: {
        type: 'dots',
        label: 'Tanıma bölümündeki kelimeler',
        rows: [
          { label: 'İlk listedekiler: “evet”', filled: rec.hits, total: T, valueLabel: `${rec.hits}/${T}` },
          { label: 'İlk listede olmayanlar: “hayır”', filled: nLures - fa, total: nLures, valueLabel: `${nLures - fa}/${nLures}` },
        ],
        legend: ['doğru cevap', 'yanlış cevap'],
      } satisfies DotsVisual,
    };
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
            `Öğrenme denemelerinde hiçbir listede olmayan ${r.extraLearning} kelime yazdın; akla gelen başka bir kelimeyi yazmak çoğu kişide ara sıra görülür.`,
            `Öğrenme denemelerinde hiçbir listede olmayan ${r.extraLearning} kelime yazdı; akla gelen başka bir kelimeyi yazmak çoğu kişide ara sıra görülür.`,
          ),
    );
    if (r.emptyRecalls >= 2) {
      issues.push(
        v(
          `${r.emptyRecalls} hatırlama bölümünde hiç kelime yazmadın; o bölümleri yarıda bırakmış olabilirsin.`,
          `Çocuğunuz ${r.emptyRecalls} hatırlama bölümünde hiç kelime yazmadı; o bölümler yarıda bırakılmış olabilir.`,
        ),
      );
    }
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
    // "0 kez" denmez: ortadaki kelimelerin hiçbiri hatırlanmadıysa bu ayrıca söylenir.
    const parts: string[] = [
      p.middle === 0
        ? v(
            `Üç denemede listenin ilk ${third} kelimesini toplam ${p.begin} kez, son ${third} kelimesini ${p.end} kez hatırladın; ortadaki ${third} kelimenin hiçbirini hatırlamadın (her kısımda en çok ${p.of}).`,
            `Üç denemede listenin ilk ${third} kelimesi toplam ${p.begin} kez, son ${third} kelimesi ${p.end} kez hatırlandı; ortadaki ${third} kelimenin hiçbiri hatırlanmadı (her kısımda en çok ${p.of}).`,
          )
        : v(
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
        parts.push(
          p.middle === 0
            ? 'Çoğu kişi için listenin ortası en zor hatırlanan kısımdır.'
            : 'Ortadaki kelimeler daha az hatırlandı; çoğu kişi için listenin ortası en zor hatırlanan kısımdır.',
        );
      }
      // Her kısım tavana yakınsa (13/15 ve üstü) kısımlar arasında fark çıkması beklenmez.
      const nearCeiling = Math.min(p.begin, p.middle, p.end) >= p.of - 2;
      parts.push(
        nearCeiling
          ? v(
              'Neredeyse bütün kelimeleri hatırladığın için kısımlar arasında fark çıkması beklenmez.',
              'Neredeyse bütün kelimeleri hatırladığı için kısımlar arasında fark çıkması beklenmez.',
            )
          : `Bu karşılaştırma her kısımda yalnızca ${third} kelimeye dayanır; kaba bir göstergedir.`,
      );
    }
    calisma = { ...card('kl_calisma'), headline, text: [...parts, ...issues].join(' ') };
    // Kısımlar karşılaştırıldıysa: üç denemede listenin başı, ortası ve sonu kaç kez hatırlandı.
    if (compared) {
      calisma.visual = {
        type: 'bars',
        label: `Listenin kısımları (üç denemede, her kısımda en çok ${p.of})`,
        scale: 'share',
        rows: WORD_LIST_PARTS.map((x) => ({ label: x.label, value: p[x.key], max: p.of, valueLabel: `${p[x.key]}/${p.of}` })),
      } satisfies BarsVisual;
    }
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
    { label: 'Üçüncü denemede', value: none ? 'Cevap verilmedi' : `${t3}/${L}` },
    { label: 'Araya giren listeden sonra', value: none ? 'Cevap verilmedi' : `${d}/${L}` },
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

  const spanTask = (kind: 'digit_span' | 'spatial_span', direction?: 'forward' | 'backward') =>
    def.tasks.find((t): t is DigitSpanTask | SpatialSpanTask => t.kind === kind && (!direction || (t as DigitSpanTask).direction === direction));
  const fwd = byKey.get('digit_forward')?.extra as unknown as SpanResult | undefined;
  if (fwd) {
    blocks.push({
      key: 'digit_forward',
      name: scale('digit_forward').name,
      plain: scale('digit_forward').plain,
      headline: fwd.span ? `${fwd.span} rakamlık diziye kadar` : 'En kısa dizi doğru tekrarlanmadı',
      text: spanText(fwd, audience, {
        unit: 'rakam',
        floor: {
          student: 'Bu görevde en kısa rakam dizilerini de doğru tekrar edemedin.',
          parent: 'Çocuğunuz bu görevde en kısa rakam dizilerini de doğru tekrar edemedi.',
        },
        student: 'Rakam dizilerini aynı sırayla en fazla {n} rakama kadar doğru tekrar edebildin.',
        parent: 'Çocuğunuz rakam dizilerini aynı sırayla en fazla {n} rakamlık uzunluğa kadar doğru tekrar etti.',
        everyday: you
          ? 'Bu beceri, bir telefon numarasını yazana kadar ya da öğretmenin söylediği sayfa numarasını açana kadar aklında tutmak gibi işlerde kullanılır.'
          : 'Bu beceri, kısa bir bilgiyi kullanana kadar akılda tutmak için gerekir: öğretmenin söylediği sayfa numarası ya da kısa bir yönerge gibi.',
      }),
      ladder: fwd.ladder,
      visual: spanLadder('İleri sayı dizileri', fwd, 'rakam', spanTask('digit_span', 'forward')),
    });
  }
  const bwd = byKey.get('digit_backward')?.extra as unknown as SpanResult | undefined;
  if (bwd) {
    blocks.push({
      key: 'digit_backward',
      name: scale('digit_backward').name,
      plain: scale('digit_backward').plain,
      headline: bwd.span ? `${bwd.span} rakamlık diziye kadar` : 'En kısa dizi doğru tekrarlanmadı',
      text: spanText(bwd, audience, {
        unit: 'rakam',
        floor: {
          student: 'Bu görevde en kısa rakam dizilerini de tersten doğru tekrar edemedin.',
          parent: 'Çocuğunuz bu görevde en kısa rakam dizilerini de tersten doğru tekrar edemedi.',
        },
        student: 'Rakam dizilerini tersten en fazla {n} rakama kadar doğru tekrar edebildin.',
        parent: 'Çocuğunuz rakam dizilerini tersten en fazla {n} rakamlık uzunluğa kadar doğru tekrar etti.',
        everyday: you
          ? 'Bilgiyi hem akılda tutup hem de üzerinde değişiklik yapmak, zihinden işlem yaparken ve çok adımlı yönergeleri takip ederken işine yarar. Tersten tekrar, çoğu kişi için ileri tekrardan daha zordur.'
          : 'Bilgiyi akılda tutarken üzerinde işlem yapabilmek; zihinden işlem, çok adımlı yönergeleri takip etme ve okuduğunu anlama gibi işlerde kullanılır. Tersten tekrar, çoğu kişi için ileri tekrardan daha zordur.',
      }),
      ladder: bwd.ladder,
      visual: spanLadder('Geri sayı dizileri', bwd, 'rakam', spanTask('digit_span', 'backward')),
    });
  }
  const sp = byKey.get('spatial')?.extra as unknown as SpanResult | undefined;
  if (sp) {
    blocks.push({
      key: 'spatial',
      name: scale('spatial').name,
      plain: scale('spatial').plain,
      headline: sp.span ? `${sp.span} kutuluk diziye kadar` : 'En kısa dizi doğru tekrarlanmadı',
      text: spanText(sp, audience, {
        unit: 'kutu',
        floor: {
          student: 'Bu görevde en kısa kutu dizilerinin sırasını da doğru hatırlayamadın.',
          parent: 'Çocuğunuz bu görevde en kısa kutu dizilerinin sırasını da doğru hatırlayamadı.',
        },
        student: 'Yanan kutuların sırasını en fazla {n} kutuya kadar doğru hatırladın.',
        parent: 'Çocuğunuz yanan kutuların sırasını en fazla {n} kutuluk uzunluğa kadar doğru hatırladı.',
        everyday: you
          ? 'Bu beceri; bir yolu, bir haritayı ya da bir geometri çizimindeki yerleri akılda tutarken kullanılır.'
          : 'Bu beceri; bir yolu hatırlamak, harita ve şekillerle çalışmak ya da tahtadaki bir çizimi deftere geçirmek gibi işlerde kullanılır.',
      }),
      ladder: sp.ladder,
      visual: spanLadder('Kutu dizileri', sp, 'kutu', spanTask('spatial_span')),
    });
  }
  const at = byKey.get('attention')?.extra as unknown as FlankerResult | undefined;
  if (at) {
    const rt = at.meanRt === null ? '' : ` · doğru cevaplarda ortalama ${sn(at.meanRt)} saniye`;
    // Kenardaki oklar ters yöne bakarken doğruluk en az 20 puan düşükse bu ayrıca söylenir.
    const pulled = at.accCongruent - at.accIncongruent >= 0.2;
    blocks.push({
      key: 'attention',
      name: scale('attention').name,
      plain: scale('attention').plain,
      headline: `${pct(at.accuracy)} doğru${rt}`,
      text: you
        ? `Yanlardaki oklar ortadakiyle aynı yöne baktığında ${pct(at.accCongruent)}, farklı yöne baktığında ${pct(at.accIncongruent)} doğru cevap verdin. Kenardaki oklar ters yöne baktığında çoğu kişi biraz yavaşlar ve daha sık yanılır; önemli olan dikkatini ortadaki oka toplayabilmek.${pulled ? ' Kenardaki oklar ters yöne baktığında çok daha sık yanıldın. Kenardaki oklar, ortadaki oka bakmanın önüne geçmiş olabilir. Acele etmeden yalnızca ortadaki oka bakmak işine yarar.' : ''} Bu beceri, gürültülü bir sınıfta öğretmeni dinlemek ya da bir soruda gereksiz bilgileri ayıklamak gibi durumlarda işe yarar.`
        : `Çocuğunuz yanlardaki oklar ortadakiyle aynı yöne baktığında ${pct(at.accCongruent)}, farklı yöne baktığında ${pct(at.accIncongruent)} doğru cevap verdi. Kenardaki oklar ters yöne baktığında çoğu kişi biraz yavaşlar ve daha sık yanılır.${pulled ? ' Çocuğunuz kenardaki oklar ters yöne baktığında çok daha sık yanıldı. Kenardaki oklar, ortadaki oka odaklanmasının önüne geçmiş olabilir; acele etmek ya da yönergenin tam anlaşılmaması da bu sonucu verebilir. Bu sonuç tek başına yorumlanmamalıdır.' : ''} Bu görev, dikkat dağıtan şeylere rağmen önemli olana odaklanabilmeyi ölçer; örneğin gürültülü bir ortamda öğretmeni dinlemek ya da bir sorudaki gereksiz bilgiyi ayıklamak gibi.`,
      flanker: { accCongruent: at.accCongruent, accIncongruent: at.accIncongruent, rtCongruent: at.meanRtCongruent, rtIncongruent: at.meanRtIncongruent },
      visual: pctBarsVisual('Okların yönüne göre doğru cevaplar', [
        { label: 'Oklar aynı yöne bakarken', rate: at.accCongruent },
        { label: 'Oklar farklı yöne bakarken', rate: at.accIncongruent },
      ]),
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
      text:
        spd.attempted === 0
          ? you
            ? `${secs} saniye boyunca hiç sembol eşleştirmedin; bu yüzden bu görevin sonucu yorumlanmadı. Görevi yarıda bırakmış ya da yönergeyi tam anlamamış olabilirsin. Öteki görevlerin sonuçları bundan etkilenmez.`
            : `Çocuğunuz ${secs} saniye boyunca hiç sembol eşleştirmedi; bu yüzden bu görevin sonucu yorumlanmadı. Görev yarıda bırakılmış ya da yönerge tam anlaşılmamış olabilir. Öteki görevlerin sonuçları bundan etkilenmez.`
          : you
            ? `${spd.correct === spd.attempted ? `Eşleştirdiğin ${spd.attempted} sembolün hepsi doğruydu` : spd.correct === 0 ? `Eşleştirdiğin ${spd.attempted} sembolün hiçbiri doğru değildi` : `${spd.attempted} sembolden ${spd.correct === 1 ? 'birini' : `${spd.correct} tanesini`} doğru eşleştirdin (${spd.errors} hata)`}. Bu görev, basit bir işi hızlı ve doğru yapabilmeyi ölçer; örneğin tahtadan bir şeyi deftere geçirmek ya da sınavda basit işlemleri yapmak gibi.`
            : `${spd.correct === spd.attempted ? `Çocuğunuzun eşleştirdiği ${spd.attempted} sembolün hepsi doğruydu` : spd.correct === 0 ? `Çocuğunuzun eşleştirdiği ${spd.attempted} sembolün hiçbiri doğru değildi` : `Çocuğunuz ${spd.attempted} sembolden ${spd.correct === 1 ? 'birini' : `${spd.correct} tanesini`} doğru eşleştirdi (${spd.errors} hata)`}. Bu görev işlem hızını, yani basit bir işi hem hızlı hem doğru yapabilmeyi ölçer; tahtadan yazmak ya da sınavda basit işlemleri yapmak gibi işlerde kullanılır. İşlem hızı çocukluk ve ergenlik boyunca belirgin biçimde artar.`,
      symbol: { correct: spd.correct, errors: spd.errors, perMinute: spd.perMinute },
      // Hiç cevap yoksa çizilecek bir şey yoktur.
      ...(spd.attempted > 0
        ? {
            visual: {
              type: 'stack',
              label: 'Eşleştirilen semboller',
              total: spd.attempted,
              parts: [
                { label: 'Doğru eşleştirme', value: spd.correct },
                { label: 'Hatalı eşleştirme', value: spd.errors },
              ],
            } satisfies StackVisual,
          }
        : {}),
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
  const hd = byKey.get('hd_dogru')?.extra as unknown as LetterSeriesResult | undefined;
  const hdt = def.tasks.find((t): t is LetterSeriesTask => t.kind === 'letter_series');
  if (hd && hdt) add(letterSeriesBlocks(hd, hdt, audience, card));
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
  if (def.tasks.every((t) => ['color_word', 'go_nogo', 'trail', 'n_back', 'mental_rotation', 'reaction_time', 'matrix_reasoning', 'number_series', 'verbal_reasoning', 'paper_folding', 'vocabulary', 'rule_switch', 'word_list', 'logical_reasoning', 'numerical_reasoning', 'cube_net', 'cognitive_reflection', 'tower', 'mental_rotation_3d', 'complex_span', 'perspective', 'hidden_figures', 'pattern_memory', 'letter_series'].includes(t.kind))) {
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

/**
 * Puanları birbirine bu kadar yakın (ya da daha yakın) alanların sırası güvenilir değildir: 8 maddelik alanda bir cevabın
 * farkı 0,125, 10–14 maddelik alanda 0,07–0,1. İlgi profillerinin hepsinde (Holland, sıralı ilgi ve etkinlik) aynı sınır.
 */
const INTEREST_TIE = 0.15;
const nearTie = (a: number, b: number) => Math.abs(a - b) <= INTEREST_TIE + 1e-9;
/** Birebir eşit: raporda gösterilen puan (bir ondalık) aynı. */
const exactTie = (a: number, b: number) => shown1(a) === shown1(b);
const isHighBand = (b: Band | null) => b === 'high' || b === 'very_high';
const ORDINAL = ['birinci', 'ikinci', 'üçüncü', 'dördüncü'];
const COUNT_WORDS = ['', 'bir', 'iki', 'üç', 'dört'];
const joinTr = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`);
/** Alan adları: adlardan biri "ve" içeriyorsa ("Liderlik ve İkna") adlar tırnak içinde yazılır; yoksa cümle karışır. */
const joinAreas = (names: string[]) => joinTr(names.length > 1 && names.some((n) => / ve /.test(n)) ? names.map((n) => `“${n}”`) : names);

/**
 * Öne çıkan alan sayısı: puana göre sıralı alanlardan en çok `cap` alan. Gösterilen puanı birebir aynı alanlar kesimle
 * bölünmez: kesim eşit puanlı bir grubun içine düşüyorsa grup, öne çıkan alanlar en çok bir alan artacaksa bütünüyle alınır
 * (ör. üçüncü ve dördüncü alan eşitse dört alan); grup daha büyükse kesim yerinde kalır ve eşitlik notla söylenir.
 */
function tiedCut(values: number[], cap: number): number {
  const n = Math.min(cap, values.length);
  if (n === 0 || n === values.length || !exactTie(values[n - 1], values[n])) return n;
  let end = n;
  while (end < values.length && exactTie(values[n - 1], values[end])) end++;
  return end <= cap + 1 ? end : n;
}

/** Sıra numaraları: gösterilen puanı aynı olan alanlar aynı numarayı alır (1, 1, 3). */
const tieRanks = (values: number[]) => values.map((v) => 1 + values.filter((x) => shown1(x) > shown1(v)).length);

/**
 * Eşitlik kümeleri: puanları art arda en çok INTEREST_TIE farklı alanlar ([ilk, son] sırası; tek alanlı küme yazılmaz).
 * Yalnızca ilk `upto` alandan birinde başlayan kümeler (öne çıkan alanlara dokunanlar).
 */
function tieClusters(values: number[], upto: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < values.length && i < upto; ) {
    let j = i;
    while (j + 1 < values.length && nearTie(values[j], values[j + 1])) j++;
    if (j > i) out.push([i, j]);
    i = j + 1;
  }
  return out;
}

/**
 * Holland profili. Öne çıkan alanlar puanın düzeyine bakılarak seçilir: en az orta düzeyde olmayan alan hiçbir zaman öne
 * çıkarılmaz. En az bir alan yüksekse en çok üç alan öne çıkar, Holland kodu ve örnek meslekler bunlardan oluşur. Hiçbir
 * alan yüksek değilse en yüksek iki orta düzey alan gösterilir, kod ve meslek verilmez. Bütün alanlar düşükse ya da
 * bütün alanların puanı aynıysa öne çıkan alan yoktur. Gösterilen puanı birebir aynı alanlar kesimle bölünmez (tiedCut);
 * birebir eşitlik bir harfin hangi alana ait olacağını belirliyorsa kod eşitlikten önce kesilir. Profil belirginleşmemişse
 * (fark küçük) kod gösterilir ama örnek meslek listesi verilmez. Puanları aynı ya da neredeyse aynı olan alanlar
 * (eşitlikler) notla söylenir.
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
  const flat = differentiation < 0.8;

  const tied = ranked.length > 1 && differentiation === 0;
  const noneHigh = !ranked.some((r) => isHighBand(r.band));
  const allLow = !ranked.some((r) => r.band === 'average' || isHighBand(r.band));
  // Öne çıkabilecek alanlar: en az orta düzeyde olanlar.
  const eligible = tied ? [] : ranked.filter((r) => r.band === 'average' || isHighBand(r.band));
  const values = eligible.map((r) => r.mean!);
  const cap = noneHigh ? 2 : 3;
  const topRows = eligible.slice(0, tiedCut(values, cap));
  const topKeys = topRows.map((r) => r.key);
  const ranks = tieRanks(values.slice(0, topRows.length));
  // Kodun harfleri: üçüncü harfin (ya da daha öncekinin) hangi alana ait olacağını birebir eşit bir puan belirliyorsa
  // (eşit puanlı grup kesimi aşıyorsa) kod bu gruptan önce kesilir; grup en üstteyse kod verilmez.
  let codeLen = noneHigh ? 0 : Math.min(cap, topRows.length);
  if (codeLen > 0 && eligible.length > codeLen && exactTie(values[codeLen - 1], values[codeLen])) {
    let start = codeLen - 1;
    while (start > 0 && exactTie(values[start - 1], values[codeLen])) start--;
    codeLen = start;
  }
  const codeCut = !noneHigh && codeLen < Math.min(cap, eligible.length);
  const hasCode = codeLen > 0;
  const codeKeys = topKeys.slice(0, codeLen);

  // Eşitlikler: puanları art arda birbirine çok yakın olan alanlar bir küme oluşturur. Küme öne çıkan alanlara
  // dokunuyorsa sıranın (ya da hangi alanın öne çıktığının) küçük bir farka dayandığı söylenir. Kodun harflerini
  // etkilemeyen ve bütünüyle gösterilen birebir eşitlik kartlardaki aynı sıra numarasıyla ve "eşit puan" rozetiyle zaten
  // görünür; ayrıca not yazılmaz.
  const you = audience !== 'parent';
  const closeCalls: string[] = [];
  for (const [i, j] of tieClusters(values, topRows.length)) {
    const group = eligible.slice(i, j + 1);
    const exact = group.every((r) => exactTie(r.mean!, group[0].mean!));
    const names = joinTr(group.map((r) => r.name));
    const lead = you ? `${names} alanlarındaki puanların aynı ya da neredeyse aynı; ` : `${names} alanlarındaki puanlar aynı ya da neredeyse aynıdır; `;
    const all = you ? 'bu alanların hepsini birlikte düşünebilirsin.' : 'bu alanların hepsi birlikte düşünülebilir.';
    let tail: string;
    if (codeCut && i <= codeLen && codeLen <= j) {
      // Eşitlik bir harfi belirlediği için kod kesildi.
      tail =
        codeLen === 0
          ? `bu yüzden ilgi kodu ve örnek meslekler verilmedi; ${all}`
          : `bu yüzden ilgi kodunda yalnızca ${codeLen === 1 ? 'ilk harf' : `ilk ${COUNT_WORDS[codeLen]} harf`} verildi; ${all}`;
    } else if (j < topRows.length) {
      const inCode = hasCode && j < codeLen;
      if (exact && !inCode) continue;
      tail = `${inCode ? 'ilgi kodunda ' : ''}bu alanların sırası yer değiştirebilir.`;
    } else if (i === topRows.length - 1) {
      const nth = ORDINAL[i];
      tail = you
        ? `${hasCode ? `${nth} alanını` : 'en yüksek çıkan alanlarından birini'} bu alanlardan herhangi biri olarak düşünebilirsin.`
        : `${hasCode ? `${nth} alan` : 'en yüksek çıkan alanlardan biri'} bu alanlardan herhangi biri olarak düşünülebilir.`;
    } else {
      tail = you
        ? `bu yüzden öne çıkan alanlarının seçimi kesin değil, ${all}`
        : `bu yüzden öne çıkan alanların seçimi kesin değildir, ${all}`;
    }
    closeCalls.push(lead + tail);
  }

  // Orta düzeydeki öne çıkan alan: sözlük tanımı yerine orta düzeyde ilgiyi söyleyen cümle (tanım parantez içinde).
  const middle = (plain: string) => {
    const what = plain.replace(/\.$/, '');
    const def = what.charAt(0).toLocaleLowerCase('tr-TR') + what.slice(1);
    return audience === 'parent'
      ? `Çocuğunuz bu alandaki işlere orta düzeyde ilgi duyduğunu belirtiyor (${def}).`
      : `Bu alandaki işlere orta düzeyde ilgi duyuyorsun (${def}).`;
  };

  return {
    code: codeKeys.join(''),
    types: rows.map((r) => ({ key: r.key, name: r.name, mean: r.mean, rank: rankOf.get(r.key) ?? 0 })),
    top: topRows.map((r, i) => {
      const t = RIASEC_TYPES[r.key];
      const high = isHighBand(r.band);
      return {
        key: r.key,
        name: t.name,
        plain: t.plain,
        // Kişiye yazılmış metin ("…hoşlanıyorsun") yalnızca yüksek düzeydeki alanda kullanılır.
        text: high ? (audience === 'parent' ? t.parent : t.student) : middle(t.plain),
        bandLabel: r.bandLabel,
        high,
        rank: ranks[i],
        likes: t.likes,
        explore: t.explore,
        paths: t.paths,
      };
    }),
    lowest: ranked.slice(-2).reverse().map((r) => ({ key: r.key, name: r.name })),
    differentiation,
    flat,
    noneHigh,
    allLow,
    exploration: grade <= 9,
    closeCalls,
    // Profil belirginleşmemişse (fark küçük) örnek meslek listesi verilmez: kod en üstteki alanları gösterir ama meslek
    // önerisi kadar güçlü bir çerçeve kurmaz.
    occupations: hasCode && !flat ? occupationsFor(codeKeys, 8) : [],
  };
}
