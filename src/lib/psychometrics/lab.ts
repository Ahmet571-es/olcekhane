import 'server-only';
import { and, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { taskTrials } from '@/db/schema';
import type { InstrumentDef, LikertInstrument, QuizInstrument, ReadingInstrument, TaskInstrument } from '@/lib/instruments/types';
import { mean, median } from '@/lib/scoring/stats';
import type { CancellationResult, CancellationSectionScored } from '@/lib/scoring/tasks';
import {
  analyzeDichotomous,
  analyzeLikert,
  normPreview,
  quizSpec,
  sd,
  splitHalf,
  type DichotomousStat,
  type LikertScaleStat,
  type NormPreview,
} from './analysis';
import { currentVersionDef, researchSample, responsesFor, scoresFor, versionTotals, type SampleRow } from './data';

export interface SampleSummary {
  /** Sürümdeki bütün tamamlanmış uygulamalar (rıza durumundan bağımsız). */
  totalAttempts: number;
  totalStudents: number;
  /** Araştırma rızalı öğrencilerin ilk uygulamaları. */
  consented: number;
  /** Geçerlik uyarısı nedeniyle analize alınmayanlar. */
  flagged: number;
  /** Analize giren uygulamalar. */
  used: number;
  byGrade: { grade: number; n: number }[];
  byGender: { female: number; male: number; unknown: number };
}

export interface TaskScaleStat {
  key: string;
  name: string;
  unit: string;
  byGrade: { grade: number; n: number; mean: number | null; sd: number | null; median: number | null }[];
  /** Tek-çift yarılama güvenirliği (Spearman-Brown düzeltmeli); uygun olmayan görevlerde yok. */
  splitHalf: { label: string; n: number; r: number | null }[];
  /** Güvenirliğin neden gösterilmediği (ör. süreli görev). */
  note?: string;
}

export type LabReport = {
  slug: string;
  name: string;
  version: number;
  versionId: string;
  instrumentId: string;
  def: InstrumentDef;
  sample: SampleSummary;
} & (
  | { engine: 'likert'; scales: LikertScaleStat[] }
  | { engine: 'quiz'; forms: (DichotomousStat & { key: string; grade: number; contentGrade: number })[] }
  | { engine: 'reading'; passages: (DichotomousStat & { key: string; title: string; minGrade: number; maxGrade: number })[] }
  | { engine: 'tasks'; tasks: TaskScaleStat[] }
);

function summarize(all: SampleRow[], used: SampleRow[], totals: { attempts: number; students: number }): SampleSummary {
  const grades = new Map<number, number>();
  for (const s of used) grades.set(s.grade, (grades.get(s.grade) ?? 0) + 1);
  return {
    totalAttempts: totals.attempts,
    totalStudents: totals.students,
    consented: all.length,
    flagged: all.length - used.length,
    used: used.length,
    byGrade: [...grades.entries()].sort((a, b) => a[0] - b[0]).map(([grade, n]) => ({ grade, n })),
    byGender: {
      female: used.filter((s) => s.gender === 'female').length,
      male: used.filter((s) => s.gender === 'male').length,
      unknown: used.filter((s) => s.gender !== 'female' && s.gender !== 'male').length,
    },
  };
}

export async function labReport(slug: string): Promise<LabReport | null> {
  const cv = await currentVersionDef(slug);
  if (!cv) return null;
  const [all, totals] = await Promise.all([researchSample(cv.versionId), versionTotals(cv.versionId)]);
  const used = all.filter((s) => !s.flagged);
  const ids = used.map((s) => s.attemptId);
  const base = {
    slug,
    name: cv.def.name,
    version: cv.version,
    versionId: cv.versionId,
    instrumentId: cv.instrumentId,
    def: cv.def,
    sample: summarize(all, used, totals),
  };
  const def = cv.def;

  if (def.engine === 'likert') {
    const resp = await responsesFor(ids);
    const people = ids.map((id) => {
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(resp.get(id) ?? {})) if (v.value !== null) out[k] = v.value;
      return out;
    });
    return { ...base, engine: 'likert', scales: analyzeLikert(def as LikertInstrument, people) };
  }

  if (def.engine === 'quiz') {
    const q = def as QuizInstrument;
    const resp = await responsesFor(ids);
    const names = Object.fromEntries(Object.entries(q.misconceptions).map(([k, m]) => [k, m.name]));
    const forms = q.forms.map((form) => {
      // Her öğrenci, uygulamaya başladığı sınıfın formunu çözer; formdaki maddelere verdiği cevaplar alınır.
      const keys = new Set(form.items.map((i) => i.key));
      const people = ids
        .map((id) => resp.get(id) ?? {})
        .filter((r) => Object.keys(r).some((k) => keys.has(k)))
        .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.text ?? undefined])));
      return { key: form.key, grade: form.grade, contentGrade: form.contentGrade, ...analyzeDichotomous(quizSpec(form, names), people) };
    });
    return { ...base, engine: 'quiz', forms };
  }

  if (def.engine === 'reading') {
    const r = def as ReadingInstrument;
    const resp = await responsesFor(ids);
    const passages = r.passages.map((p) => {
      const prefix = `${p.key}.`;
      const people = ids
        .map((id) => resp.get(id) ?? {})
        .filter((x) => Object.keys(x).some((k) => k.startsWith(prefix)))
        .map((x) => Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v.text ?? undefined])));
      const spec = p.questions.map((qq) => ({
        key: `${p.key}.${qq.key}`,
        text: qq.text,
        group: qq.skill,
        answer: qq.answer,
        choices: qq.options.map((o, i) => ({ key: o.key, label: String.fromCharCode(65 + i) })),
      }));
      return { key: p.key, title: p.title, minGrade: p.minGrade, maxGrade: p.maxGrade, ...analyzeDichotomous(spec, people) };
    });
    return { ...base, engine: 'reading', passages };
  }

  // Bilişsel görevler: sınıf düzeyine göre betimsel istatistikler ve tek-çift yarılama güvenirliği.
  const t = def as TaskInstrument;
  const sc = await scoresFor(ids);
  const gradeOf = new Map(used.map((s) => [s.attemptId, s.grade]));
  const trials = ids.length
    ? await db
        .select({ attemptId: taskTrials.attemptId, block: taskTrials.block, trialIndex: taskTrials.trialIndex, correct: taskTrials.correct, rtMs: taskTrials.rtMs })
        .from(taskTrials)
        .where(and(inArray(taskTrials.attemptId, ids), inArray(taskTrials.block, t.tasks.filter((x) => x.kind === 'flanker').map((x) => x.key))))
    : [];
  const UNITS: Record<string, string> = {
    digit_forward: 'dizi uzunluğu',
    digit_backward: 'dizi uzunluğu',
    spatial: 'dizi uzunluğu',
    attention: '% doğru',
    speed: 'dakikada doğru',
    tempo: 'dakikada harf',
    isabet: '% bulunan',
    net: 'net doğru',
    surdurme: '% değişim',
  };
  const NOTES: Record<string, string> = {
    attention: 'Denemeler tek ve çift sıralı olarak ikiye ayrılır; Spearman-Brown düzeltmesiyle.',
    speed: 'Süreli bir görev olduğu için yarılama güvenirliği hesaplanmaz (hıza bağlı olarak şişkin çıkar); test-tekrar test çalışması gerekir.',
    tempo: 'Bölümler ayrı süreyle uygulandığı için 1. ve 3. bölümler 2. ve 4. bölümlerle karşılaştırılır; Spearman-Brown düzeltmesiyle.',
    isabet: 'Bölümler ayrı süreyle uygulandığı için 1. ve 3. bölümler 2. ve 4. bölümlerle karşılaştırılır; Spearman-Brown düzeltmesiyle.',
    net: 'Bölümler ayrı süreyle uygulandığı için 1. ve 3. bölümler 2. ve 4. bölümlerle karşılaştırılır; Spearman-Brown düzeltmesiyle.',
    surdurme: 'İki yarının farkına dayanan bir puandır; fark puanlarının güvenirliği düşük olur. Test-tekrar test çalışması gerekir.',
  };
  // Harf işaretleme: bölüm ayrıntıları "tempo" puanının ek verisinde durur.
  const sectionsOf = (id: string) => (sc.get(id)?.tempo?.extra as unknown as CancellationResult | undefined)?.sections ?? [];
  const tasks: TaskScaleStat[] = t.scales.map((s) => {
    const byGrade = new Map<number, number[]>();
    for (const id of ids) {
      const v = sc.get(id)?.[s.key]?.raw;
      if (v === null || v === undefined) continue;
      const g = gradeOf.get(id)!;
      byGrade.set(g, [...(byGrade.get(g) ?? []), v]);
    }
    const splits: TaskScaleStat['splitHalf'] = [];
    // Yarılama yalnızca ok görevinde ve ayrı süreli bölümlerde yapılır: tek süreli görevlerde (sembol
    // eşleştirme) tek-çift yarılama hıza bağlı olarak güvenirliği olduğundan yüksek gösterir; dizi görevleri
    // uyarlamalı ilerler.
    const task = s.key === 'attention' ? t.tasks.find((x) => x.kind === 'flanker') : undefined;
    const note = NOTES[s.key] ?? 'Uyarlamalı ilerleyen dizi görevlerinde yarılama uygun değildir; test-tekrar test çalışması gerekir.';
    const halfScore: Record<string, (ss: CancellationSectionScored[]) => number | null> = {
      tempo: (ss) => ss.reduce((a, x) => a + x.processed, 0) / (ss.reduce((a, x) => a + x.ms, 0) / 60_000),
      isabet: (ss) => {
        const found = ss.reduce((a, x) => a + x.hits, 0);
        const all = found + ss.reduce((a, x) => a + x.omissions, 0);
        return all ? found / all : null;
      },
      net: (ss) => ss.reduce((a, x) => a + x.net, 0),
    };
    const half = halfScore[s.key];
    if (half) {
      const pairs = ids
        .map((id) => sectionsOf(id))
        .filter((ss) => ss.length >= 2)
        .map((ss) => [half(ss.filter((x) => x.index % 2 === 0)), half(ss.filter((x) => x.index % 2 === 1))] as const)
        .filter((p): p is readonly [number, number] => p[0] !== null && p[1] !== null && Number.isFinite(p[0]) && Number.isFinite(p[1]));
      splits.push({ label: 'Bölümler', n: pairs.length, r: splitHalf(pairs.map((p) => p[0]), pairs.map((p) => p[1])) });
    }
    if (task) {
      const per = new Map<string, { odd: { c: number; n: number; rt: number[] }; even: { c: number; n: number; rt: number[] } }>();
      for (const tr of trials) {
        if (tr.block !== task.key) continue;
        const p = per.get(tr.attemptId) ?? { odd: { c: 0, n: 0, rt: [] }, even: { c: 0, n: 0, rt: [] } };
        const half = tr.trialIndex % 2 ? p.odd : p.even;
        half.n++;
        if (tr.correct) {
          half.c++;
          if (tr.rtMs !== null) half.rt.push(tr.rtMs);
        }
        per.set(tr.attemptId, p);
      }
      const people = [...per.values()].filter((p) => p.odd.n > 0 && p.even.n > 0);
      splits.push({ label: 'Doğruluk', n: people.length, r: splitHalf(people.map((p) => p.odd.c / p.odd.n), people.map((p) => p.even.c / p.even.n)) });
      const rtPeople = people.filter((p) => p.odd.rt.length && p.even.rt.length);
      splits.push({ label: 'Tepki süresi', n: rtPeople.length, r: splitHalf(rtPeople.map((p) => mean(p.odd.rt)), rtPeople.map((p) => mean(p.even.rt))) });
    }
    return {
      key: s.key,
      name: s.name,
      unit: UNITS[s.key] ?? '',
      byGrade: [...byGrade.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([grade, xs]) => ({ grade, n: xs.length, mean: xs.length ? mean(xs) : null, sd: sd(xs), median: xs.length ? median(xs) : null })),
      splitHalf: splits,
      note,
    };
  });
  return { ...base, engine: 'tasks', tasks };
}

/**
 * Likert ölçekleri için norm önizlemesi: seçilen sınıf aralığındaki araştırma örneklemi (geçerlik
 * uyarısı olmayanlar) üzerinden her ölçeğin ortalaması, standart sapması, çarpıklığı ve alfası.
 * Puanlar raporlamadaki ölçekle aynıdır: ortalama puanlı ölçeklerde madde ortalaması, toplam
 * puanlı ölçeklerde toplam.
 */
export async function likertNormPreview(
  slug: string,
  gradeMin: number,
  gradeMax: number,
): Promise<{ versionId: string; n: number; scales: NormPreview[]; firstAt: Date | null; lastAt: Date | null } | null> {
  const cv = await currentVersionDef(slug);
  if (!cv || cv.def.engine !== 'likert') return null;
  const def = cv.def as LikertInstrument;
  const sample = (await researchSample(cv.versionId)).filter((s) => !s.flagged && s.grade >= gradeMin && s.grade <= gradeMax);
  const ids = sample.map((s) => s.attemptId);
  const [sc, resp] = await Promise.all([scoresFor(ids), responsesFor(ids)]);
  const people = ids.map((id) => {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(resp.get(id) ?? {})) if (v.value !== null) out[k] = v.value;
    return out;
  });
  const alpha = new Map(analyzeLikert(def, people).map((s) => [s.key, s.alpha]));
  const isMean = def.scoring.method === 'mean';
  const scales = def.scales.map((scale) => {
    const values = ids
      .map((id) => sc.get(id)?.[scale.key])
      .map((r) => (r ? (isMean ? r.mean : r.raw) : null))
      .filter((x): x is number => x !== null && Number.isFinite(x));
    return normPreview(scale, values, alpha.get(scale.key) ?? null);
  });
  const times = sample.map((s) => s.completedAt.getTime());
  return {
    versionId: cv.versionId,
    n: sample.length,
    scales,
    firstAt: times.length ? new Date(Math.min(...times)) : null,
    lastAt: times.length ? new Date(Math.max(...times)) : null,
  };
}
