import { REPORT_TEMPLATES } from '@/content/reports';
import type { BandText } from '@/content/reports/types';
import { GRADE_LABELS } from '@/lib/config';
import type { Band, InstrumentDef, ReadingInstrument } from '@/lib/instruments/types';
import type { ReadingResult } from '@/lib/scoring/reading';

export type Audience = 'student' | 'parent';

/** Veritabanından okunan ölçek puanının rapora gereken kısmı. */
export interface StoredScore {
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
  support: boolean;
  science: { basedOn: string; reliability: string; limitations: string[]; license: string };
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
  return audience === 'student'
    ? { text: bt.student, tips: bt.tipsStudent, summary: bt.summary }
    : { text: bt.parent, tips: bt.tipsParent, summary: bt.summary };
}

export function buildReport(input: {
  def: InstrumentDef;
  scores: StoredScore[];
  audience: Audience;
  studentName: string;
  grade: number;
  completedAt: Date;
  qualityNotes?: string[];
  hasNorms: boolean;
}): ReportContent {
  const { def, audience } = input;
  const template = REPORT_TEMPLATES[def.slug];
  const byKey = new Map(input.scores.map((s) => [s.scaleKey, s]));
  let support = false;

  const sections: ReportSection[] = [];
  let reading: ReportContent['reading'];

  if (def.engine === 'likert') {
    const optVals = def.options.map((o) => o.value);
    const optMin = Math.min(...optVals);
    const optMax = Math.max(...optVals);
    for (const scale of def.scales) {
      const s = byKey.get(scale.key);
      const band = (s?.band ?? null) as Band | null;
      const bt = band ? template?.scales[scale.key]?.[band] : undefined;
      if (bt?.support) support = true;
      const picked = pickText(bt, audience);
      const nItems = def.items.filter((i) => i.scale === scale.key).length;
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
        bandLabel: band ? (template?.bandLabels[band] ?? band) : 'Hesaplanamadı',
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
  } else {
    const rDef = def as ReadingInstrument;
    const comp = byKey.get('comprehension');
    const rr = comp?.extra as unknown as (ReadingResult & { passageTitle?: string }) | undefined;
    const band = (comp?.band ?? null) as Band | null;
    const bt = band ? template?.scales.comprehension?.[band] : undefined;
    const picked = pickText(bt, audience);
    if (rr) {
      sections.push({
        scaleKey: 'comprehension',
        name: 'Anlama',
        plain: def.scales[0].plain,
        band,
        bandLabel: band ? (template?.bandLabels[band] ?? band) : '—',
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
        ? audience === 'student'
          ? 'Metni çok hızlı geçmişsin; hızın gerçek okuma hızını yansıtmıyor olabilir. Bir dahaki sefere metni anlayarak okumaya odaklan.'
          : 'Metin çok hızlı geçilmiş görünüyor; bu nedenle ölçülen hız gerçek okuma hızını yansıtmıyor olabilir.'
        : audience === 'student'
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

  // Öne çıkanlar: ortadan en uzak düzeydeki ölçekler (çok ölçekli testlerde).
  const highlights: string[] = [];
  if (sections.length > 2) {
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
    normNote: input.hasNorms
      ? 'Puanlar, Türkiye’de aynı sınıf düzeyindeki öğrencilerden oluşan norm grubuyla karşılaştırılarak yorumlanmıştır.'
      : science.normNote,
    qualityNotes: input.qualityNotes ?? [],
    sections,
    highlights,
    support,
    science: {
      basedOn: science.basedOn,
      reliability: science.reliability,
      limitations: science.limitations,
      license: science.license,
    },
    reading,
  };
}
