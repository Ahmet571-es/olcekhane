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
  WordListTask,
  LogicalReasoningTask,
  LogicForm,
  NumericalReasoningTask,
  NumericKind,
  NumericLureKind,
  NumericRatio,
  CubeNetTask,
  CubeType,
  MentalRotation3dTask,
  CognitiveReflectionTask,
  ReflectionDomain,
  ReflectionRole,
  TowerTask,
} from '@/lib/instruments/types';
import type { CubeLure } from '@/lib/instruments/cube';
import { ruleAnswer, ruleCongruent, ruleSwitchKinds, type RuleSwitchKind } from '@/lib/instruments/rule-switch';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';
import { expectedSpanResponse, spanStimulus } from '@/lib/scoring/tasks';
import { keyOf, shortestPath, successors } from './tower-check';

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

/** Kelime listesi: tanıma bölümündeki bir kelimenin anahtarı ve sırası. */
export type WordListCell = { kind: 'target' | 'b' | 'semantic' | 'sound' | 'new'; of?: number; j: number };

/** Kelime listesinin hatırlama denemelerinde yazılanlar ve tanıma cevapları. */
export type WordListPlan = {
  /** Sırasıyla ilk listenin üç denemesi, ikinci liste ve ilk liste yeniden: yazılan kelimeler. */
  recalls: string[][];
  /** Tanımada "evet" denecek kelimeler. */
  recog: (q: WordListCell) => boolean;
  recogRt: (q: WordListCell) => number | null;
  restarts: number[];
};

/** Kelime listesinin kelimeleri: ilk (A) ya da ikinci (B) listedeki yerlerine göre. */
export function wordListWords(list: 'A' | 'B', positions: number[]): string[] {
  const task = def<TaskInstrument>('kelime-listesi-hatirlama').tasks[0] as WordListTask;
  return positions.map((p) => (list === 'A' ? task.listA : task.listB)[p]);
}

const range = (a: number, b: number) => Array.from({ length: b - a }, (_, i) => a + i);

/**
 * Kelime listesi: varsayılan olarak ilk denemede 6, ikincide 9, üçüncüde 12 kelime; ikinci listeden 6; araya giren
 * listeden sonra 11 kelime. Tanımada ilk listedeki kelimelerin hepsine ve yalnızca bir anlamca yakın yanılgıya "evet".
 */
export function wordListBody(plan: Partial<WordListPlan> = {}, grade = 6): AnswersBody {
  const task = def<TaskInstrument>('kelime-listesi-hatirlama').tasks[0] as WordListTask;
  const recalls = plan.recalls ?? [
    wordListWords('A', [0, 1, 2, 12, 13, 14]),
    wordListWords('A', [0, 1, 2, 3, 6, 11, 12, 13, 14]),
    wordListWords('A', [...range(0, 8), 11, 12, 13, 14]),
    wordListWords('B', [0, 1, 2, 12, 13, 14]),
    wordListWords('A', [...range(0, 7), 11, 12, 13, 14]),
  ];
  const restarts = plan.restarts ?? [];
  const recog = plan.recog ?? ((q) => q.kind === 'target' || (q.kind === 'semantic' && q.of === 2));
  const recogRt = plan.recogRt ?? (() => 1400);
  const trials = [
    ...recalls.map((words, index) => ({ index, response: { words, ...(restarts[index] ? { restarts: restarts[index] } : {}) }, rtMs: 45_000 })),
    ...task.recognitionKey.map((k, j) => {
      const q = { ...k, j };
      return { index: recalls.length + j, response: recog(q) ? 1 : 2, rtMs: recogRt(q) };
    }),
  ];
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Mantıksal akıl yürütmenin bir sorusu: türü, doğru cevabı (1 evet, 2 hayır) ve sırası. */
export type LogicCell = { form: LogicForm; answer: 1 | 2; i: number };

/** Mantıksal akıl yürütme: varsayılan olarak her soruda doğru cevap, soru başına 8 saniye. */
export function logicBody(
  pick: (q: LogicCell) => { response: number; rtMs: number | null } = (q) => ({ response: q.answer, rtMs: 8000 }),
  grade = 7,
): AnswersBody {
  const task = def<TaskInstrument>('mantiksal-akil-yurutme').tasks[0] as LogicalReasoningTask;
  const trials = task.items.map((_, index) => {
    const p = pick({ form: task.forms[index], answer: task.answers[index], i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

export type NumericCell = { kind: NumericKind; ratio: NumericRatio | null; answer: number; lures: Partial<Record<NumericLureKind, number[]>>; i: number };

/** Sayısal akıl yürütme: varsayılan olarak her soruda doğru cevap, soru başına 9 saniye. `null` "Bilmiyorum"dur. */
export function numericBody(
  pick: (q: NumericCell) => { response: number | null; rtMs: number | null } = (q) => ({ response: q.answer, rtMs: 9000 }),
  grade = 7,
): AnswersBody {
  const task = def<TaskInstrument>('sayisal-akil-yurutme').tasks[0] as NumericalReasoningTask;
  const trials = task.items.map((_, index) => {
    const p = pick({ kind: task.kinds[index], ratio: task.ratios[index], answer: task.answers[index], lures: task.lures[index], i: index });
    return { index, response: p.response === null ? null : { answer: p.response }, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

export type CubeCell = { level: number; type: CubeType; answer: number; lures: (CubeLure | null)[]; i: number };

/** Küp açınımında seçilen yanılgı türündeki ilk seçenek (yoksa doğru olmayan ilk seçenek). */
export const cubeLureOption = (q: CubeCell, kind?: CubeLure) => {
  const at = kind ? q.lures.findIndex((l) => l === kind) : -1;
  return at >= 0 ? at + 1 : q.lures.findIndex((l) => l !== null) + 1;
};

/** Küp açınımı: varsayılan olarak 1–3. düzeyde doğru, 4. düzeyde ilk iki soru doğru; zor sorulara daha çok zaman. */
export function cubeBody(
  pick: (q: CubeCell) => { response: number; rtMs: number | null } = (q) => ({
    response: q.level <= 3 || cubeRank(q) < 2 ? q.answer : cubeLureOption(q),
    rtMs: 5000 + 3000 * q.level,
  }),
  grade = 6,
): AnswersBody {
  const task = def<TaskInstrument>('kup-acinimi').tasks[0] as CubeNetTask;
  const trials = task.items.map((it, index) => {
    const p = pick({ level: it.level, type: it.type, answer: task.answers[index], lures: task.optionLures[index], i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Küp açınımında sorunun kendi düzeyindeki sırası (0'dan başlar). */
export function cubeRank(q: { level: number; i: number }): number {
  const task = def<TaskInstrument>('kup-acinimi').tasks[0] as CubeNetTask;
  return task.items.slice(0, q.i).filter((it) => it.level === q.level).length;
}

export type Rotation3dCell = { part: 1 | 2; answer: [number, number]; mirrors: [number, number]; i: number };

/** Üç boyutlu zihinde döndürmede bir doğru seçenekle bir ayna görüntüsü (`k`: hangi doğru, hangi ayna). */
export const r3Half = (q: Rotation3dCell, k = 0): number[] => [q.answer[k % 2], q.mirrors[(k >> 1) % 2]].sort((a, b) => a - b);

/**
 * Üç boyutlu zihinde döndürme: varsayılan olarak 1. bölümün hepsi ve 2. bölümün ilk altı sorusu doğru, öbür dört soruda
 * bir doğru bir ayna görüntüsü; 1. bölümde soru başına 15, 2. bölümde 20 saniye.
 */
export function rotation3dBody(
  pick: (q: Rotation3dCell) => { response: number[]; rtMs: number | null } = (q) => ({
    response: q.part === 1 || q.i < 16 ? q.answer : r3Half(q),
    rtMs: q.part === 1 ? 15_000 : 20_000,
  }),
  grade = 7,
): AnswersBody {
  const task = def<TaskInstrument>('uc-boyutlu-zihinde-dondurme').tasks[0] as MentalRotation3dTask;
  const trials = task.items.map((it, index) => {
    const answer = task.answers[index];
    const mirrors = [1, 2, 3, 4].filter((o) => !answer.includes(o)) as [number, number];
    const p = pick({ part: it.part, answer, mirrors, i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

export type ReflectionCell = { domain: ReflectionDomain; role: ReflectionRole; answer: number; lure: number; pair: number | null; i: number };

/** Düşünerek karar vermede doğru da tuzak da olmayan ilk seçenek. */
export const reflectionOther = (q: ReflectionCell) => [1, 2, 3, 4].find((o) => o !== q.answer && o !== q.lure)!;

/** Düşünerek karar verme: varsayılan olarak her soruda doğru cevap, soru başına 12 saniye. */
export function reflectionBody(
  pick: (q: ReflectionCell) => { response: number; rtMs: number | null } = (q) => ({ response: q.answer, rtMs: 12_000 }),
  grade = 7,
): AnswersBody {
  const task = def<TaskInstrument>('dusunerek-karar-verme').tasks[0] as CognitiveReflectionTask;
  const trials = task.items.map((_, index) => {
    const p = pick({ domain: task.domains[index], role: task.roles[index], answer: task.answers[index], lure: task.lures[index], pair: task.pairs[index], i: index });
    return { index, response: p.response, rtMs: p.rtMs };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}

/** Kule görevinde bir problemin nasıl çözüleceği: en az hamlede, fazla hamleyle (`excess` çift sayı), hedefe ulaşmadan ya da hiç top taşımadan. */
export type TowerPlay = { outcome: 'optimal' | 'extra' | 'unsolved' | 'idle'; pickMs?: number; excess?: number; stepMs?: number };
export type TowerCell = { moves: number; i: number };

/**
 * Kule görevinin hamleleri bağımsız denetleyicinin (tests/helpers/tower-check.ts) en kısa yolundan kurulur. Fazla hamle,
 * başta bir topu başka bir çubuğa koyup geri almakla eklenir (her gidiş-dönüş 2 hamle). Hedefe ulaşılamayan problemde
 * yalnızca bir hamle yapılır (en kısa problem 3 hamledir).
 */
export function towerMoves(start: readonly string[], goal: readonly string[], play: TowerPlay): [number, number][] {
  const s = keyOf(start);
  const g = keyOf(goal);
  if (play.outcome === 'idle') return [];
  const [from, to] = successors(s)[0];
  if (play.outcome === 'unsolved') return [[from, to]];
  const path = shortestPath(s, g);
  if (play.outcome === 'optimal') return path;
  const detour: [number, number][] = [];
  for (let k = 0; k < (play.excess ?? 2) / 2; k++) detour.push([from, to], [to, from]);
  return [...detour, ...path];
}

/** Kule görevi: varsayılan olarak her problem en az hamlede; ilk top 4 saniyede, her hamle 1,5 saniyede. */
export function towerBody(pick: (q: TowerCell) => TowerPlay = () => ({ outcome: 'optimal' }), grade = 5): AnswersBody {
  const task = def<TaskInstrument>('planlama-kule-gorevi').tasks[0] as TowerTask;
  const trials = task.items.map((item, index) => {
    const play = pick({ moves: item.minMoves, i: index });
    const mv = towerMoves(item.start, item.goal, play);
    const pickMs = play.outcome === 'idle' ? null : (play.pickMs ?? 4000);
    const step = play.stepMs ?? 1500;
    const times = mv.map((_, k) => Math.min(task.limitMs, (pickMs ?? 0) + step * (k + 1)));
    const solved = play.outcome === 'optimal' || play.outcome === 'extra';
    return {
      index,
      response: { moves: mv.map(([a, b]) => (a + 1) * 10 + (b + 1)), times, pick: pickMs },
      rtMs: solved ? times[times.length - 1] : task.limitMs,
    };
  });
  return { grade, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: trials } } };
}
