import 'server-only';
import { getInstrumentDef, isSolvable } from '@/content/instruments';
import type { InstrumentDef } from '@/lib/instruments/types';
import { buildReport } from '@/lib/reports/build';
import { toSimpleReport, type SimpleReport } from '@/lib/reports/simple';
import { likertQuality, scoreLikert, type LikertAnswer } from '@/lib/scoring/likert';
import { formForGrade, scoreQuiz, type QuizAnswer } from '@/lib/scoring/quiz';
import { passageForGrade, scoreReading } from '@/lib/scoring/reading';
import { TaskInputError } from '@/lib/scoring/tasks';
import type { AnswersBody } from './schemas';
import { likertRows, quizRows, readingRows, taskScoreRows, toReportScore, type ScoreRow, type TaskInputs } from './score-rows';

/**
 * Testin değerlendirilmesi. Sitede veritabanı yoktur: testin bütün cevapları tek istekte gelir,
 * puanlanır ve öğrenci ile veli raporu hazırlanıp geri verilir. Cevap, puan ve rapor hiçbir yere
 * (diske, günlüğe) yazılmaz; istek bitince bellekten de silinir. Ad gibi kimlik bilgisi alınmaz.
 */

export class AssessmentError extends Error {
  constructor(
    public code: 'not_found' | 'grade' | 'invalid',
    message: string,
  ) {
    super(message);
  }
}

export interface EvaluationResult {
  student: SimpleReport;
  parent: SimpleReport;
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
function score(def: InstrumentDef, body: AnswersBody): { rows: ScoreRow[]; notes: string[] } {
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
    return { rows: likertRows(scoreLikert(def, answers, {})), notes: likertQuality(def, answers).notes };
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

/** Testin öğrenci ve veli raporları (ücretsiz, basit rapor). Hiçbir şey kaydedilmez. */
export function evaluate(slug: string, body: AnswersBody, now = new Date()): EvaluationResult {
  const def = solvableInstrument(slug);
  if (!def) throw new AssessmentError('not_found', 'Test bulunamadı.');
  if (body.grade < def.minGrade || body.grade > def.maxGrade) {
    throw new AssessmentError('grade', 'Bu test seçilen sınıf düzeyine uygun değil.');
  }
  const { rows, notes } = score(def, body);
  const scores = rows.map(toReportScore);
  const build = (audience: 'student' | 'parent') =>
    toSimpleReport(
      buildReport({
        def,
        scores,
        audience,
        studentName: '',
        grade: body.grade,
        completedAt: now,
        qualityNotes: notes,
      }),
    );
  return { student: build('student'), parent: build('parent') };
}
