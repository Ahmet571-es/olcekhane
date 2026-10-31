import 'server-only';
import { getInstrumentDef, isSolvable, publicInstruments } from '@/content/instruments';
import { ACADEMIC_ROADMAPS, INTEREST_ROADMAPS, ORAL_ROADMAPS, READING_ROADMAPS, ROADMAPS, ROADMAP_IN_REVIEW, TASK_ROADMAPS } from '@/content/roadmaps';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { InstrumentDef } from '@/lib/instruments/types';
import { buildAcademicRoadmap } from '@/lib/reports/academic-roadmap';
import { buildReport, type Audience, type ReportContent } from '@/lib/reports/build';
import { buildInterestRoadmap } from '@/lib/reports/interest-roadmap';
import { buildOralReport } from '@/lib/reports/oral';
import { buildOralRoadmap } from '@/lib/reports/oral-roadmap';
import { buildReadingRoadmap } from '@/lib/reports/reading-roadmap';
import { buildRoadmap, type NextTest, type Roadmap } from '@/lib/reports/roadmap';
import { toSimpleReport, type SimpleReport } from '@/lib/reports/simple';
import { buildTaskRoadmap } from '@/lib/reports/task-roadmap';
import { likertItemFlags, likertQuality, scoreLikert, type LikertAnswer, type LikertItemFlags } from '@/lib/scoring/likert';
import { OralInputError, scoreOral, type OralResult } from '@/lib/scoring/oral';
import { formForGrade, scoreQuiz, type QuizAnswer } from '@/lib/scoring/quiz';
import { passageForGrade, scoreReading } from '@/lib/scoring/reading';
import { standardError } from '@/lib/scoring/stats';
import { TaskInputError } from '@/lib/scoring/tasks';
import type { CompareInfo } from '@/lib/compare/record';
import { taskCompareInfo } from '@/lib/compare/tasks';
import type { AnswersBody } from './schemas';
import { likertRows, quizRows, readingRows, taskScoreRows, toReportScore, type ScoreRow, type TaskInputs } from './score-rows';

/**
 * Testin değerlendirilmesi. Sitede veritabanı yoktur: testin bütün cevapları tek istekte gelir,
 * puanlanır ve raporlar hazırlanıp geri verilir: okul çağındaki biri için öğrenci ve veli raporu, testi
 * kendisi için çözen yetişkin için tek, kişisel rapor. Cevap, puan ve rapor hiçbir yere (diske, günlüğe)
 * yazılmaz; istek bitince bellekten de silinir. Ad gibi kimlik bilgisi alınmaz.
 */

export class AssessmentError extends Error {
  constructor(
    public code: 'not_found' | 'grade' | 'invalid',
    message: string,
  ) {
    super(message);
  }
}

/** Okul çağındaki biri için iki rapor: öğrenciye ve veliye. */
export interface EvaluationResult {
  student: SimpleReport;
  parent: SimpleReport;
}

/** Testi kendisi için çözen yetişkin için tek, kişisel rapor. */
export interface AdultEvaluationResult {
  adult: SimpleReport;
}

/** Sitede çözülebilen test (yayında, pilot ya da uzman incelemesinde). */
export function solvableInstrument(slug: string): InstrumentDef | null {
  const def = getInstrumentDef(slug);
  return isSolvable(def) ? def : null;
}

/**
 * Cevapları puanlar. Norm tablosu kullanılmaz: Likert ölçekleri puanın cevap aralığındaki konumuna
 * göre (scoring/likert, anchoredBand), diğer testler kendi ölçütlerine göre yorumlanır.
 */
function score(def: InstrumentDef, body: AnswersBody): { rows: ScoreRow[]; notes: string[]; items?: LikertItemFlags } {
  const { data, grade } = body;
  if (def.engine !== data.engine) throw new AssessmentError('invalid', 'Geçersiz istek.');

  if (def.engine === 'likert' && data.engine === 'likert') {
    const keys = new Set(def.items.map((i) => i.key));
    const values = new Set(def.options.map((o) => o.value));
    const answers: Record<string, LikertAnswer> = {};
    for (const [k, a] of Object.entries(data.answers)) {
      if (!keys.has(k) || !values.has(a.value)) throw new AssessmentError('invalid', 'Geçersiz cevap.');
      answers[k] = { value: a.value, rtMs: a.rtMs === null ? null : Math.round(a.rtMs) };
    }
    if (Object.keys(answers).length < Math.ceil(def.items.length * def.scoring.minAnsweredRatio)) {
      throw new AssessmentError('invalid', 'Testi bitirmek için maddelerin çoğunu cevaplamak gerekiyor.');
    }
    return { rows: likertRows(scoreLikert(def, answers, {})), notes: likertQuality(def, answers).notes, items: likertItemFlags(def, answers) };
  }

  if (def.engine === 'quiz' && data.engine === 'quiz') {
    const form = formForGrade(def, grade);
    const keys = new Set(form.items.map((i) => i.key));
    const answers: Record<string, QuizAnswer> = {};
    for (const [k, a] of Object.entries(data.answers)) {
      if (!keys.has(k)) throw new AssessmentError('invalid', 'Bu soru bu sınıfın formunda yok.');
      answers[k] = { choice: a.choice, rtMs: a.rtMs === null ? null : Math.round(a.rtMs) };
    }
    const unanswered = form.items.filter((i) => !answers[i.key]).length;
    if (unanswered > 0) throw new AssessmentError('invalid', `Bütün soruları cevaplaman gerekiyor (${unanswered} soru kaldı).`);
    const result = scoreQuiz(form, answers);
    return { rows: quizRows(form, result), notes: result.flags.notes };
  }

  if (def.engine === 'reading' && data.engine === 'reading') {
    const passage = passageForGrade(def, grade);
    if (data.passageKey !== passage.key) throw new AssessmentError('invalid', 'Metin bu sınıf düzeyine ait değil.');
    if (data.readingMs < 1000) throw new AssessmentError('invalid', 'Okuma süresi geçersiz.');
    const valid = new Map(passage.questions.map((q) => [q.key, new Set(q.options.map((o) => o.key))]));
    for (const [k, v] of Object.entries(data.answers)) {
      if (!valid.get(k)?.has(v)) throw new AssessmentError('invalid', 'Geçersiz cevap.');
    }
    const result = scoreReading(passage, data.readingMs, data.answers);
    return { rows: readingRows(result, Object.keys(data.answers).length), notes: result.flags.notes };
  }

  if (def.engine === 'tasks' && data.engine === 'tasks') {
    const inputs = new Map<string, TaskInputs>();
    for (const [k, trials] of Object.entries(data.blocks)) inputs.set(k, trials as TaskInputs);
    try {
      return taskScoreRows(def, inputs, data.seed);
    } catch (err) {
      if (err instanceof TaskInputError) throw new AssessmentError('invalid', err.message);
      throw err;
    }
  }
  throw new AssessmentError('invalid', 'Geçersiz istek.');
}

/**
 * Gelişim yol haritası: yalnızca şablonu olan testlerde. Uzman incelemesindeki şablon yalnızca önizleme isteğinde
 * (`roadmapPreview`) eklenir. Son haftada önerilen testler kişinin sınıfına uyan, yayındaki testlerdir.
 */
function roadmapFor(def: InstrumentDef, content: ReportContent, body: AnswersBody): Roadmap | undefined {
  const s = def.slug;
  const any = ROADMAPS[s] ?? INTEREST_ROADMAPS[s] ?? ACADEMIC_ROADMAPS[s] ?? READING_ROADMAPS[s] ?? TASK_ROADMAPS[s];
  if (!any) return undefined;
  const preview = ROADMAP_IN_REVIEW.has(s);
  if (preview && !body.roadmapPreview) return undefined;
  const opts = { preview, next: nextTestsFor(any.nextTests, s, body.grade) };
  if (ROADMAPS[s]) return buildRoadmap(content, ROADMAPS[s], opts);
  if (INTEREST_ROADMAPS[s]) return buildInterestRoadmap(content, INTEREST_ROADMAPS[s], opts);
  if (ACADEMIC_ROADMAPS[s]) return buildAcademicRoadmap(content, ACADEMIC_ROADMAPS[s], opts);
  if (READING_ROADMAPS[s]) return buildReadingRoadmap(content, READING_ROADMAPS[s], opts);
  return buildTaskRoadmap(content, TASK_ROADMAPS[s], opts);
}

/** Yol haritasının son haftasında önerilecek testler: kişinin sınıfına uyan, yayındaki en çok iki test. */
function nextTestsFor(slugs: string[], self: string, grade: number): NextTest[] {
  const live = publicInstruments();
  const fits = slugs.flatMap((slug) => live.filter((t) => t.slug === slug && t.slug !== self && gradeAllowed(t, grade))).slice(0, 2);
  // Şablonun ilk iki önerisinden biri elendiyse amaç cümlesi listeye uymaz (bkz. NextTest.partial).
  const wanted = slugs.filter((slug) => slug !== self).slice(0, 2);
  const partial = fits.length !== wanted.length || fits.some((t, i) => t.slug !== wanted[i]);
  return fits.map((t) => ({ name: t.name, href: `/testler/${t.slug}`, ...(partial ? { partial: true } : {}) }));
}

/** Cevapları doğrulayıp puanlar; aynı puanlardan istenen kişiye yazılmış raporu hazırlayan işlevi döndürür. */
function prepare(slug: string, body: AnswersBody): (audience: Audience, now: Date) => SimpleReport {
  const def = solvableInstrument(slug);
  if (!def) throw new AssessmentError('not_found', 'Test bulunamadı.');
  if (!gradeAllowed(def, body.grade)) {
    throw new AssessmentError('grade', body.grade === ADULT_GRADE ? 'Bu test yetişkinler için uygun değil.' : 'Bu test seçilen sınıf düzeyine uygun değil.');
  }
  // Sesli okuma: işaretlerden, sürelerden ve cevaplardan kendi raporu kurulur (ses kaydı sunucuya hiç gelmez).
  if (def.engine === 'oral') {
    if (body.data.engine !== 'oral') throw new AssessmentError('invalid', 'Geçersiz istek.');
    let result: OralResult;
    try {
      result = scoreOral(def, body.grade, body.data);
    } catch (err) {
      if (err instanceof OralInputError) throw new AssessmentError('invalid', err.message);
      throw err;
    }
    const passage = def.passages.find((p) => p.key === result.passageKey)!;
    const template = ORAL_ROADMAPS[def.slug];
    const preview = ROADMAP_IN_REVIEW.has(def.slug);
    const withRoadmap = !!template && (!preview || !!body.roadmapPreview);
    const next = withRoadmap ? nextTestsFor(template.nextTests, def.slug, body.grade) : [];
    return (audience, now) => {
      const report = buildOralReport({ def, passage, result, audience, grade: body.grade, completedAt: now });
      return withRoadmap ? { ...report, roadmap: buildOralRoadmap(result, audience, template, { preview, next, grade: body.grade }) } : report;
    };
  }
  const { rows, notes, items } = score(def, body);
  const scores = rows.map(toReportScore);
  return (audience, now) => {
    const content = buildReport({
      def,
      scores,
      audience,
      studentName: '',
      grade: body.grade,
      completedAt: now,
      qualityNotes: notes,
      items,
    });
    const report = toSimpleReport(content);
    const roadmap = roadmapFor(def, content, body);
    const compare = compareInfo(def, content, rows);
    return { ...report, ...(roadmap ? { roadmap } : {}), ...(compare ? { compare } : {}) };
  };
}

/**
 * Karşılaştırma bilgisi (lib/compare/record.ts). Anket testlerinde ölçek ölçek puan, aralık, düzey ve ölçüm payı; ölçüm payı
 * yalnızca güvenirliği bilinen ölçeklerde (α ve başvuru standart sapması; puanlamadaki güven aralığıyla aynı hesap). Görev
 * testlerinde raporun yorumlanan ana sonuçları (lib/compare/tasks.ts). Konu tarama ve okuma testlerinde (form ve metin sınıfa
 * göre değişir) yoktur.
 */
function compareInfo(def: InstrumentDef, content: ReportContent, rows: ScoreRow[]): CompareInfo | undefined {
  if (def.engine === 'tasks') return taskCompareInfo(def, content, rows);
  if (def.engine !== 'likert') return undefined;
  const decimals = def.scoring.method === 'mean' ? 1 : 0;
  // Ölçeklerin testteki sırasıyla (raporun bölümleri bazı testlerde puana göre sıralanır).
  const scales = def.scales.flatMap((scale) => {
    const sec = content.sections.find((x) => x.scaleKey === scale.key);
    if (!sec || sec.value === null) return [];
    const sem = scale.alpha && scale.sdRef ? standardError(scale.sdRef, scale.alpha) : null;
    return [
      {
        key: sec.scaleKey,
        label: scale.name,
        value: Math.round(sec.value * 1000) / 1000,
        min: sec.min,
        max: sec.max,
        sem: sem === null ? null : Math.round(sem * 10000) / 10000,
        decimals: decimals as 0 | 1,
        band: sec.band ? sec.bandLabel : null,
      },
    ];
  });
  return scales.length ? { slug: def.slug, version: def.version, date: content.completedAt, scales } : undefined;
}

/** Okul çağındaki biri için öğrenci ve veli raporları (ücretsiz, basit rapor). Hiçbir şey kaydedilmez. */
export function evaluate(slug: string, body: AnswersBody, now = new Date()): EvaluationResult {
  if (body.grade === ADULT_GRADE) throw new AssessmentError('grade', 'Yetişkin için tek, kişisel rapor hazırlanır.');
  const build = prepare(slug, body);
  return { student: build('student', now), parent: build('parent', now) };
}

/** Testi kendisi için çözen yetişkin için tek, kişisel rapor. Hiçbir şey kaydedilmez. */
export function evaluateAdult(slug: string, body: AnswersBody, now = new Date()): AdultEvaluationResult {
  if (body.grade !== ADULT_GRADE) throw new AssessmentError('grade', 'Kişisel rapor yalnızca yetişkinler için hazırlanır.');
  return { adult: prepare(slug, body)('adult', now) };
}

/** Seçime göre raporlar: sınıf seçildiyse öğrenci ve veli raporu, "Yetişkinim" seçildiyse kişisel rapor. */
export function evaluateReports(slug: string, body: AnswersBody, now = new Date()): EvaluationResult | AdultEvaluationResult {
  return body.grade === ADULT_GRADE ? evaluateAdult(slug, body, now) : evaluate(slug, body, now);
}
