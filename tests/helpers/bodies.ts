import { getInstrumentDef } from '@/content/instruments';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { cancellationSheet } from '@/lib/instruments/cancellation';
import { disparity } from '@/lib/instruments/rotation';
import { nBackRoles, type NBackRole } from '@/lib/instruments/sequences';
import type {
  CancellationTask,
  ColorWordTask,
  DigitSpanTask,
  FlankerTask,
  GoNoGoTask,
  LikertInstrument,
  MatrixReasoningTask,
  MentalRotationTask,
  NBackTask,
  NumberSeriesTask,
  QuizInstrument,
  ReactionTimeTask,
  ReadingInstrument,
  SpatialSpanTask,
  SymbolMatchTask,
  TaskInstrument,
  TrailTask,
  VerbalReasoningTask,
  PaperFoldingTask,
  VocabularyTask,
  RuleSwitchTask,
} from '@/lib/instruments/types';
import { ruleAnswer, ruleCongruent, ruleSwitchKinds, type RuleSwitchKind } from '@/lib/instruments/rule-switch';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';
import { expectedSpanResponse, spanStimulus } from '@/lib/scoring/tasks';

/** Hızlı test istek gövdeleri: her motor için geçerli, örnek cevaplar (birim ve veritabanı testleri). */
export const def = <T>(slug: string) => getInstrumentDef(slug) as T;
export const SEED = '6f1c2e0b-3e4b-4a8a-9a55-5d1f0c8e2a11';

export function likertBody(slug: string, grade: number, pick: (i: number) => number): AnswersBody {
  const d = def<LikertInstrument>(slug);
  const values = d.options.map((o) => o.value);
  return {
    grade,
    data: { engine: 'likert', answers: Object.fromEntries(d.items.map((it, i) => [it.key, { value: values[pick(i) % values.length], rtMs: 2600 }])) },
  };
}

export function quizBody(grade: number, wrongEvery = 0): AnswersBody {
  const form = formForGrade(def<QuizInstrument>('matematik-konu-tarama-testi'), grade);
  return {
    grade,
    data: {
      engine: 'quiz',
      answers: Object.fromEntries(
        form.items.map((it, i) => {
          const wrong = wrongEvery > 0 && i % wrongEvery === 0;
          const choice = wrong ? (it.options.find((o) => o.key !== it.answer)!.key as 'A' | 'B' | 'C' | 'D') : it.answer;
          return [it.key, { choice, rtMs: 40_000 }];
        }),
      ),
    },
  };
}

export function readingBody(grade: number): AnswersBody {
  const p = passageForGrade(def<ReadingInstrument>('okuma-hizi-ve-anlama'), grade);
  return {
    grade,
    data: { engine: 'reading', passageKey: p.key, readingMs: 150_000, answers: Object.fromEntries(p.questions.map((q) => [q.key, q.answer])) },
  };
}

export function cancellationBody(): AnswersBody {
  const d = def<TaskInstrument>('surekli-dikkat');
  const task = d.tasks[0] as CancellationTask;
  const sheet = cancellationSheet(task, SEED);
  const sections = sheet.map((letters, index) => {
    // Son iki bölümde belirgin düşüş (ölçümün oynaklığını aşan).
    const upTo = [240, 230, 130, 120][index];
    const marks = letters.slice(0, upTo).flatMap((l, i) => (task.targets.includes(l) ? [i] : []));
    return { index, response: { marks, times: marks.map((_, k) => 300 + k * 700), unmarks: 0 }, rtMs: task.sectionMs };
  });
  return { grade: 6, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: sections } } };
}

export function memoryTasksBody(): AnswersBody {
  const d = def<TaskInstrument>('dikkat-ve-bellek');
  const blocks: Record<string, unknown[]> = {};
  for (const t of d.tasks) {
    if (t.kind === 'digit_span' || t.kind === 'spatial_span') {
      const task = t as DigitSpanTask | SpatialSpanTask;
      const trials = [];
      // İlk üç uzunlukta doğru, sonra ikisi de yanlış (görev biter).
      for (let k = 0; k < 4; k++) {
        const length = task.startLength + k;
        for (const index of [0, 1]) {
          const exp = expectedSpanResponse(task, spanStimulus(task, length, index)!);
          trials.push({ length, index, response: k < 3 ? exp : [...exp].reverse(), rtMs: 3000 });
        }
      }
      blocks[task.key] = trials;
    } else if (t.kind === 'flanker') {
      blocks[t.key] = (t as FlankerTask).trials.map((tr, index) => ({ index, response: tr.dir, rtMs: tr.congruent ? 520 : 610 }));
    } else if (t.kind === 'symbol_match') {
      blocks[t.key] = (t as SymbolMatchTask).sequence.slice(0, 50).map((s, index) => ({ index, response: s + 1, rtMs: 1500 }));
    }
  }
  return { grade: 7, data: { engine: 'tasks', seed: SEED, blocks: blocks as Extract<AnswersBody['data'], { engine: 'tasks' }>['blocks'] } };
}

/**
 * Renk-kelime: her denemede doğru renk; uyumlu denemelerde 650 ms, uyumsuzlarda 800 ms (ya da verilen seçici).
 * Renk denemesi (asıl denemelerden sonraki sıra numaralarıyla) varsayılan olarak hatasızdır; `checkPick` ile değişir.
 */
export function colorWordBody(
  pick: (t: { word: number; ink: number }, i: number) => { choice: number | null; rtMs: number | null } = (t) => ({
    choice: t.ink,
    rtMs: t.word === t.ink ? 650 : 800,
  }),
  checkPick: (ink: number, k: number) => number | null = (ink) => ink,
): AnswersBody {
  const task = def<TaskInstrument>('renk-kelime-gorevi').tasks[0] as ColorWordTask;
  const trials = task.trials.map((t, index) => {
    const p = pick(t, index);
    return { index, response: p.choice === null ? null : p.choice + 1, rtMs: p.rtMs };
  });
  const check = task.check.map((ink, k) => {
    const choice = checkPick(ink, k);
    return { index: task.trials.length + k, response: choice === null ? null : choice + 1, rtMs: choice === null ? null : 700 };
  });
  return { grade: 5, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: [...trials, ...check] } } };
}

/** Dur-git: bas harflerinde 420 ms'de basılır, X'te basılmaz (ya da verilen seçici). */
export function goNoGoBody(
  pick: (t: { letter: string; go: boolean }, i: number) => number | null = (t) => (t.go ? 420 : null),
): AnswersBody {
  const task = def<TaskInstrument>('dur-git-gorevi').tasks[0] as GoNoGoTask;
  const trials = task.trials.map((t, index) => {
    const rt = pick(t, index);
    return { index, response: rt === null ? null : 1, rtMs: rt };
  });
  return { grade: 5, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Sırayla birleştirme: her bölümde daireler sırayla, her dokunuş arasında `stepMs` (ikinci bölümde iki katı); hatasız. */
export function trailBody(stepMs = 2000): AnswersBody {
  const task = def<TaskInstrument>('sirayla-birlestirme-gorevi').tasks[0] as TrailTask;
  const parts = task.parts.map((p, index) => {
    const step = index === 0 ? stepMs : stepMs * 2;
    const taps = p.labels.map((_, i) => i);
    const times = taps.map((i) => (i + 1) * step);
    return { index, response: { taps, times }, rtMs: times[times.length - 1] };
  });
  return { grade: 5, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: parts } } };
}

/**
 * Geriye dönük hatırlama: varsayılan olarak her hedefte (n önceki harfle aynı olan harf) 650 ms'de basılır, öteki
 * harflerde basılmaz. Seçici; harfin rolünü, bölümün n'ini ve denemenin sırasını alır, basış süresini ya da null döner.
 */
export function nBackBody(
  pick: (role: NBackRole, n: 1 | 2, i: number) => number | null = (role) => (role === 'target' ? 650 : null),
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('geriye-donuk-hatirlama').tasks[0] as NBackTask;
  const cells = task.blocks.flatMap((b) => nBackRoles(b.letters, b.n).map((role) => ({ role, n: b.n })));
  const trials = cells.map((c, index) => {
    const rt = pick(c.role, c.n, index);
    return { index, response: rt === null ? null : 1, rtMs: rt };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/**
 * Zihinde döndürme: varsayılan olarak her denemede doğru cevap; karar süresi açıyla artar (1200 ms + 5 ms/derece).
 * Seçici; denemenin açısını, ayna görüntüsü olup olmadığını, döndürme farkını ve sırasını alır.
 */
export function rotationBody(
  pick: (t: { angle: number; mirror: boolean; disparity: number }, i: number) => { choice: 1 | 2 | null; rtMs: number | null } = (t) => ({
    choice: t.mirror ? 2 : 1,
    rtMs: 1200 + 5 * t.disparity,
  }),
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('zihinde-dondurme').tasks[0] as MentalRotationTask;
  const trials = task.trials.map((t, index) => {
    const p = pick({ angle: t.angle, mirror: t.mirror, disparity: disparity(t.angle) }, index);
    return { index, response: p.choice, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Şekil akıl yürütmenin bir sorusu: düzeyi, kural türü, doğru seçeneğin sırası (1–8) ve sorunun sırası. */
export type MatrixCellInfo = { level: number; rule: string; answer: number; i: number };

/**
 * Şekil akıl yürütme: varsayılan olarak ilk üç düzeyin sorularında doğru, 4. ve 5. düzeyde ilk iki soruda doğru, ötekilerde
 * doğru cevabın bir sonrasındaki seçenek; cevap süresi düzeyle artar (6 sn + 4 sn/düzey). Seçici; sorunun düzeyini,
 * kural türünü, doğru seçeneğini ve sırasını alır.
 */
export function matrixBody(
  pick: (q: MatrixCellInfo) => { choice: number; rtMs: number | null } = (q) => {
    const firstTwo = q.level <= 3 || matrixRank(q) < 2;
    return { choice: firstTwo ? q.answer : (q.answer % 8) + 1, rtMs: 6000 + 4000 * q.level };
  },
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('sekil-akil-yurutme').tasks[0] as MatrixReasoningTask;
  const trials = task.items.map((it, index) => {
    const p = pick({ level: it.level, rule: it.rule, answer: task.answers[index], i: index });
    return { index, response: p.choice, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Sorunun kendi düzeyindeki sırası (0'dan başlar). */
export function matrixRank(q: { level: number; i: number }): number {
  const task = def<TaskInstrument>('sekil-akil-yurutme').tasks[0] as MatrixReasoningTask;
  return task.items.slice(0, q.i).filter((it) => it.level === q.level).length;
}

/** Sayı dizilerinin bir sorusu: düzeyi, kural türü, doğru cevabı, tuzak cevapları ve sırası. */
export type NumberSeriesCell = { level: number; rule: string; answer: number; traps: number[]; i: number };

/**
 * Sayı dizileri: varsayılan olarak ilk üç düzeyin sorularında doğru; 4. ve 5. düzeyde ilk iki soruda doğru, ötekilerde
 * doğru cevaptan 7 fazla (ne tuzak ne yakın cevap); cevap süresi düzeyle artar (8 sn + 6 sn/düzey). Seçici `answer: null`
 * döndürürse "Bilmiyorum" denmiş olur.
 */
export function numberSeriesBody(
  pick: (q: NumberSeriesCell) => { answer: number | null; rtMs: number | null } = (q) => {
    const firstTwo = q.level <= 3 || numberSeriesRank(q) < 2;
    return { answer: firstTwo ? q.answer : q.answer + 7, rtMs: 8000 + 6000 * q.level };
  },
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('sayi-dizileri').tasks[0] as NumberSeriesTask;
  const trials = task.items.map((it, index) => {
    const p = pick({ level: it.level, rule: it.rule, answer: task.answers[index], traps: task.traps[index], i: index });
    return { index, response: p.answer === null ? null : { answer: p.answer }, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Sayı dizilerinde sorunun kendi düzeyindeki sırası (0'dan başlar). */
export function numberSeriesRank(q: { level: number; i: number }): number {
  const task = def<TaskInstrument>('sayi-dizileri').tasks[0] as NumberSeriesTask;
  return task.items.slice(0, q.i).filter((it) => it.level === q.level).length;
}

/** Sözel akıl yürütmenin bir sorusu: düzeyi, türü, doğru seçeneği, çeldiricisi (1–5) ve sırası. */
export type VerbalCell = { level: number; type: string; answer: number; lure: number; i: number };

/** Ne doğru cevap ne çeldirici olan ilk seçenek (1–5). */
export const verbalOther = (q: VerbalCell) => [1, 2, 3, 4, 5].find((o) => o !== q.answer && o !== q.lure)!;

/**
 * Sözel akıl yürütme: varsayılan olarak ilk üç düzeyin sorularında doğru; 4. ve 5. düzeyde ilk iki soruda doğru,
 * ötekilerde ne doğru cevap ne çeldirici olan bir seçenek; cevap süresi düzeyle artar (6 sn + 4 sn/düzey).
 */
export function verbalBody(
  pick: (q: VerbalCell) => { response: number; rtMs: number | null } = (q) => {
    const firstTwo = q.level <= 3 || verbalRank(q) < 2;
    return { response: firstTwo ? q.answer : verbalOther(q), rtMs: 6000 + 4000 * q.level };
  },
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('sozel-akil-yurutme').tasks[0] as VerbalReasoningTask;
  const trials = task.items.map((it, index) => {
    const p = pick({ level: it.level, type: it.type, answer: task.answers[index], lure: task.lures[index], i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Sözel akıl yürütmede sorunun kendi düzeyindeki sırası (0'dan başlar). */
export function verbalRank(q: { level: number; i: number }): number {
  const task = def<TaskInstrument>('sozel-akil-yurutme').tasks[0] as VerbalReasoningTask;
  return task.items.slice(0, q.i).filter((it) => it.level === q.level).length;
}

/** Kâğıt katlamanın bir sorusu: düzeyi, türü, doğru seçeneği, çeldiricisi (1–5) ve sırası. */
export type FoldingCell = { level: number; type: string; answer: number; lure: number; i: number };

/** Ne doğru cevap ne çeldirici olan ilk seçenek (1–5). */
export const foldingOther = (q: FoldingCell) => [1, 2, 3, 4, 5].find((o) => o !== q.answer && o !== q.lure)!;

/** Kâğıt katlama: varsayılan olarak ilk üç düzeyde doğru; 4. ve 5. düzeyde ilk iki soruda doğru, ötekilerde başka bir yanlış. */
export function foldingBody(
  pick: (q: FoldingCell) => { response: number; rtMs: number | null } = (q) => {
    const firstTwo = q.level <= 3 || foldingRank(q) < 2;
    return { response: firstTwo ? q.answer : foldingOther(q), rtMs: 6000 + 4000 * q.level };
  },
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('kagit-katlama').tasks[0] as PaperFoldingTask;
  const trials = task.items.map((it, index) => {
    const p = pick({ level: it.level, type: it.type, answer: task.answers[index], lure: task.lures[index], i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Kâğıt katlamada sorunun kendi düzeyindeki sırası (0'dan başlar). */
export function foldingRank(q: { level: number; i: number }): number {
  const task = def<TaskInstrument>('kagit-katlama').tasks[0] as PaperFoldingTask;
  return task.items.slice(0, q.i).filter((it) => it.level === q.level).length;
}

/** Tepki hızının bir denemesi: bölüm, dairenin kutusu (0 sol, 1 sağ), bekleme ve bölüm içindeki sırası. */
export type ReactionCell = { part: 'simple' | 'choice'; box: number; waitMs: number; i: number };

/**
 * Tepki hızı: varsayılan olarak her denemede doğru tepki; basit bölümde 280–356 ms, seçmeli bölümde 420–537 ms.
 * Seçici; denemenin bölümünü, kutusunu, beklemesini, bölüm içindeki sırasını ve genel sırasını alır.
 */
export function reactionBody(
  pick: (t: ReactionCell, index: number) => { choice: 1 | 2 | null; rtMs: number | null } = (t) => ({
    choice: (t.box + 1) as 1 | 2,
    rtMs: t.part === 'simple' ? 280 + 4 * t.i : 420 + 3 * t.i,
  }),
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('tepki-hizi').tasks[0] as ReactionTimeTask;
  const cells: ReactionCell[] = task.parts.flatMap((p) => p.trials.map((t, i) => ({ part: p.key, box: t.box, waitMs: t.waitMs, i })));
  const trials = cells.map((c, index) => {
    const p = pick(c, index);
    return { index, response: p.choice, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Kelime bilgisinin bir sorusu: düzeyi, türü, doğru seçeneği, çeldiricisi (1–5) ve sırası. */
export type VocabularyCell = { level: number; type: string; answer: number; lure: number; i: number };

/** Ne doğru cevap ne çeldirici olan ilk seçenek (1–5). */
export const vocabularyOther = (q: VocabularyCell) => [1, 2, 3, 4, 5].find((o) => o !== q.answer && o !== q.lure)!;

/** Kelime bilgisi: varsayılan olarak ilk üç düzeyde doğru; 4. ve 5. düzeyde ilk iki soruda doğru, ötekilerde başka bir yanlış. */
export function vocabularyBody(
  pick: (q: VocabularyCell) => { response: number; rtMs: number | null } = (q) => {
    const firstTwo = q.level <= 3 || vocabularyRank(q) < 2;
    return { response: firstTwo ? q.answer : vocabularyOther(q), rtMs: 5000 + 2000 * q.level };
  },
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('kelime-bilgisi').tasks[0] as VocabularyTask;
  const trials = task.items.map((it, index) => {
    const p = pick({ level: it.level, type: it.type, answer: task.answers[index], lure: task.lures[index], i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Kelime bilgisinde sorunun kendi düzeyindeki sırası (0'dan başlar). */
export function vocabularyRank(q: { level: number; i: number }): number {
  const task = def<TaskInstrument>('kelime-bilgisi').tasks[0] as VocabularyTask;
  return task.items.slice(0, q.i).filter((it) => it.level === q.level).length;
}

/** Kural değiştirmenin bir denemesi: sırası, kuralı, türü (tek kural, bölümün ilki, kural sürüyor, değişti), uyumlu mu, doğru düğme (1 sol, 2 sağ). */
export type RuleSwitchCell = { i: number; rule: 'color' | 'shape'; kind: RuleSwitchKind; congruent: boolean; answer: number; block: number };

/** Kural değiştirme: varsayılan olarak hepsi doğru; tek kuralda 650, kural sürerken 750, kural değişince 950 ms. */
export function ruleSwitchBody(
  pick: (q: RuleSwitchCell) => { response: number | null; rtMs: number | null } = (q) => ({
    response: q.answer,
    rtMs: q.kind === 'pure' ? 650 : q.kind === 'repeat' ? 750 : q.kind === 'switch' ? 950 : 900,
  }),
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('kural-degistirme').tasks[0] as RuleSwitchTask;
  const kinds = ruleSwitchKinds(task.trials);
  const trials = task.trials.map((t, index) => {
    const p = pick({ i: index, rule: t.rule, kind: kinds[index], congruent: ruleCongruent(t), answer: ruleAnswer(t) + 1, block: t.block });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}
