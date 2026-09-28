import { RIASEC_ORDER, RIASEC_TYPES, occupationsFor, type Occupation, type RiasecKey } from '@/content/careers/riasec';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { BandText } from '@/content/reports/types';
import { GRADE_LABELS } from '@/lib/config';
import type { Band, InstrumentDef, ReadingInstrument, TaskInstrument } from '@/lib/instruments/types';
import type { FlankerResult, SpanResult, SymbolResult } from '@/lib/scoring/tasks';
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
  /** Değerlendirici ölçeklerde güçlü yanlar ve geliştirilebilecek alanlar. */
  strengths?: string[];
  growth?: string[];
  /** "Genel bakış" açıklaması (şablonda tanımlıysa). */
  overview?: string;
  support: boolean;
  science: { basedOn: string; reliability: string; limitations: string[]; license: string };
  interests?: InterestProfile;
  cognitive?: CognitiveReport;
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

export interface CognitiveBlock {
  key: string;
  name: string;
  plain: string;
  /** Kısa sonuç: "6 rakamlık diziye kadar" gibi. */
  headline: string;
  text: string;
  ladder?: { length: number; results: boolean[] }[];
  flanker?: { accCongruent: number; accIncongruent: number; rtCongruent: number | null; rtIncongruent: number | null };
  symbol?: { correct: number; errors: number; perMinute: number };
}

export interface CognitiveReport {
  blocks: CognitiveBlock[];
  tips: string[];
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
  let cognitive: CognitiveReport | undefined;

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
  } else if (def.engine === 'tasks') {
    cognitive = buildCognitive(def, byKey, audience);
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

  const interests =
    def.engine === 'likert' && def.profile === 'riasec' ? buildInterestProfile(sections, audience, input.grade) : undefined;

  // Değerlendirici ölçekler: güçlü yanlar (yüksek) ve geliştirilebilecek alanlar (düşük) ayrı listelenir.
  let strengths: string[] | undefined;
  let growth: string[] | undefined;
  if (template?.evaluative) {
    strengths = sections.filter((s) => s.band === 'high' || s.band === 'very_high').map((s) => `${s.name}: ${s.summary.toLocaleLowerCase('tr-TR')}`);
    growth = sections.filter((s) => s.band === 'low' || s.band === 'very_low').map((s) => `${s.name}: ${s.summary.toLocaleLowerCase('tr-TR')}`);
  }

  // Öne çıkanlar: ortadan en uzak düzeydeki ölçekler (çok ölçekli testlerde).
  const highlights: string[] = [];
  if (sections.length > 2 && !interests && !template?.evaluative) {
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
    strengths,
    growth,
    overview: template?.overview ? (audience === 'student' ? template.overview.student : template.overview.parent) : undefined,
    support,
    science: {
      basedOn: science.basedOn,
      reliability: science.reliability,
      limitations: science.limitations,
      license: science.license,
    },
    reading,
    interests,
    cognitive,
  };
}

const pct = (x: number) => `%${nf0.format(Math.round(x * 100))}`;

function spanText(r: SpanResult, audience: Audience, what: { student: string; parent: string; unit: string; everyday: string }): string {
  const you = audience === 'student';
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

function buildCognitive(def: TaskInstrument, byKey: Map<string, StoredScore>, audience: Audience): CognitiveReport {
  const you = audience === 'student';
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
      audience === 'student'
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
        text: audience === 'student' ? t.student : t.parent,
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
