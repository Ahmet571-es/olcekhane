import 'server-only';
import { getInstrumentDef } from '@/content/instruments';
import type { InstrumentDef } from '@/lib/instruments/types';
import { buildReport, type NormInfo } from '@/lib/reports/build';
import { toSimpleReport, type SimpleReport } from '@/lib/reports/simple';
import { likertQuality, scoreLikert, type LikertAnswer, type NormStat } from '@/lib/scoring/likert';
import { formForGrade, scoreQuiz, type QuizAnswer } from '@/lib/scoring/quiz';
import { passageForGrade, scoreReading } from '@/lib/scoring/reading';
import { TaskInputError } from '@/lib/scoring/tasks';
import type { QuickBody } from './schemas';
import { likertRows, quizRows, readingRows, taskScoreRows, toStored, type ScoreRow, type TaskInputs } from './score-rows';
import { AssessmentError, activeNorms, currentVersion, normInfo } from './service';

/**
 * Hızlı test: hesap açmadan çözülen ve hiçbir şeyin saklanmadığı uygulama. Cevaplar tek istekte gelir,
 * hesaplı uygulamayla aynı fonksiyonlarla puanlanır ve rapor hazırlanır; veritabanına ve günlüklere
 * cevap, puan ya da rapor yazılmaz (yalnızca etkin norm grubu okunur). Ad gibi kimlik bilgisi alınmaz.
 */

export interface QuickResult {
  student: SimpleReport;
  parent: SimpleReport;
}

/** Hızlı testte çözülebilecek test (yayında ya da pilot). */
export function quickInstrument(slug: string): InstrumentDef | null {
  const def = getInstrumentDef(slug);
  return def && (def.status === 'active' || def.status === 'pilot') ? def : null;
}

/** Norm tablosu okunamazsa (veritabanı geçici olarak kapalı) rapor normsuz hazırlanır. */
async function normsFor(slug: string, grade: number): Promise<Record<string, NormStat>> {
  try {
    const cv = await currentVersion(slug);
    return cv ? await activeNorms(cv.versionId, grade) : {};
  } catch {
    return {};
  }
}

function scoreQuick(def: InstrumentDef, body: QuickBody, norms: Record<string, NormStat>): { rows: ScoreRow[]; notes: string[] } {
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
    return { rows: likertRows(scoreLikert(def, answers, norms)), notes: likertQuality(def, answers).notes };
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

/** Hızlı testin öğrenci ve veli raporları (basit rapor). Hiçbir şey kaydedilmez. */
export async function quickReports(slug: string, body: QuickBody, now = new Date()): Promise<QuickResult> {
  const def = quickInstrument(slug);
  if (!def) throw new AssessmentError('not_found', 'Test bulunamadı.');
  if (body.grade < def.minGrade || body.grade > def.maxGrade) {
    throw new AssessmentError('grade', 'Bu test seçilen sınıf düzeyine uygun değil.');
  }
  const norms = def.engine === 'likert' ? await normsFor(slug, body.grade) : {};
  const { rows, notes } = scoreQuick(def, body, norms);
  const scores = rows.map(toStored);
  const normSetId = scores.find((s) => s.normSetId)?.normSetId ?? null;
  let norm: NormInfo | null = null;
  try {
    norm = await normInfo(normSetId);
  } catch {
    norm = null;
  }
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
        hasNorms: !!normSetId,
        norm,
      }),
    );
  return { student: build('student'), parent: build('parent') };
}
