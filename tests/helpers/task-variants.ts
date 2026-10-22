import type { AnswersBody } from '@/lib/assessment/schemas';
import { cancellationSheet } from '@/lib/instruments/cancellation';
import type { CancellationTask, DigitSpanTask, FlankerTask, SpatialSpanTask, SymbolMatchTask, TaskInstrument } from '@/lib/instruments/types';
import { expectedSpanResponse, spanStimulus } from '@/lib/scoring/tasks';
import {
  SEED,
  cancellationBody,
  colorWordBody,
  def,
  goNoGoBody,
  memoryTasksBody,
  reactionBody,
  cubeBody,
  cubeLureOption,
  foldingBody,
  foldingOther,
  hiddenBody,
  hiddenLureOption,
  letterFar,
  letterSeriesBody,
  matrixBody,
  numberSeriesBody,
  verbalBody,
  verbalOther,
  vocabularyBody,
  vocabularyOther,
} from './bodies';

/**
 * Görev testlerinin farklı sonuç örüntüleri (kart grafiklerinin denemesi için): çok iyi, varsayılan (kolay düzeyler doğru,
 * zor düzeylerde zorlanma), yalnızca kolay sorular, en kolay düzeyde zorlanıp üst düzeylerde doğru, rastgele (hep yanlış),
 * çok hızlı ve süresiz cevaplar.
 */
type Variants = Record<string, () => AnswersBody>;

const rising = (level: number, base = 5000, per = 3000) => base + per * level;

/**
 * Dikkat ve bellek: dizilerde `spanOk` uzunluk doğru (sonra ikisi de yanlış; 0: en kısa dizide bile yanlış), ok görevinde
 * `flankerWrong` oranında yanlış (farklı yöndekilerde), sembol eşleştirmede `symbols` deneme ve `symbolErr` hata.
 */
function memoryVariant(spanOk: number, flankerWrong: number, symbols: number, symbolErr: number): AnswersBody {
  const d = def<TaskInstrument>('dikkat-ve-bellek');
  const blocks: Record<string, unknown[]> = {};
  for (const t of d.tasks) {
    if (t.kind === 'digit_span' || t.kind === 'spatial_span') {
      const task = t as DigitSpanTask | SpatialSpanTask;
      const trials = [];
      for (let k = 0; k <= spanOk; k++) {
        const length = task.startLength + k;
        for (const index of [0, 1]) {
          const exp = expectedSpanResponse(task, spanStimulus(task, length, index)!);
          trials.push({ length, index, response: k < spanOk && !(k === spanOk - 1 && index === 1) ? exp : [...exp].reverse(), rtMs: 3000 });
        }
      }
      blocks[task.key] = trials;
    } else if (t.kind === 'flanker') {
      blocks[t.key] = (t as FlankerTask).trials.map((tr, index) => ({
        index,
        response: !tr.congruent && (index * 7) % 10 < flankerWrong * 10 ? (tr.dir === 'L' ? 'R' : 'L') : tr.dir,
        rtMs: tr.congruent ? 520 : 640,
      }));
    } else if (t.kind === 'symbol_match') {
      blocks[t.key] = (t as SymbolMatchTask).sequence.slice(0, symbols).map((sym, index) => ({ index, response: index < symbolErr ? ((sym + 1) % 9) + 1 : sym + 1, rtMs: 1500 }));
    }
  }
  return { grade: 7, data: { engine: 'tasks', seed: SEED, blocks: blocks as Extract<AnswersBody['data'], { engine: 'tasks' }>['blocks'] } };
}

/** Sürekli dikkat: her bölümde taranan harf (`upTo`) ve her bölümde işaretlenen çeldirici sayısı (`wrong`). */
function cancellationVariant(upTo: number[], wrong = 0, skipEvery = 0): AnswersBody {
  const task = def<TaskInstrument>('surekli-dikkat').tasks[0] as CancellationTask;
  const sheet = cancellationSheet(task, SEED);
  const sections = sheet.map((letters, index) => {
    const targets = letters.slice(0, upTo[index]).flatMap((l, i) => (task.targets.includes(l) ? [i] : []));
    const kept = skipEvery ? targets.filter((_, k) => k % skipEvery !== 0) : targets;
    const others = letters.slice(0, upTo[index]).flatMap((l, i) => (task.targets.includes(l) ? [] : [i])).slice(0, wrong);
    const marks = [...kept, ...others].sort((a, b) => a - b);
    return { index, response: { marks, times: marks.map((_, k) => 300 + k * 700), unmarks: 0 }, rtMs: task.sectionMs };
  });
  return { grade: 6, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: sections } } };
}

export const TASK_VARIANTS: Record<string, Variants> = {
  'dikkat-ve-bellek': {
    varsayilan: () => memoryTasksBody(),
    iyi: () => memoryVariant(6, 0, 60, 0),
    zorlanan: () => memoryVariant(0, 0.6, 20, 6),
    sembolYok: () => memoryVariant(1, 0.2, 0, 0),
  },
  'surekli-dikkat': {
    varsayilan: () => cancellationBody(),
    duzenli: () => cancellationVariant([200, 205, 198, 202]),
    artan: () => cancellationVariant([120, 150, 200, 240]),
    yanlisIsaret: () => cancellationVariant([220, 220, 220, 220], 12, 3),
    cokAz: () => cancellationVariant([5, 4, 3, 2]),
  },
  'renk-kelime-gorevi': {
    varsayilan: () => colorWordBody(),
    okuma: () => colorWordBody((t, i) => ({ choice: t.word !== t.ink && i % 3 === 0 ? t.word : t.ink, rtMs: t.word === t.ink ? 700 : 760 })),
    hizliFarkli: () => colorWordBody((t) => ({ choice: t.ink, rtMs: t.word === t.ink ? 800 : 640 })),
    cevapsiz: () => colorWordBody(() => ({ choice: null, rtMs: null })),
    renkKarisik: () => colorWordBody(undefined, (ink, k) => (k % 2 ? (ink + 1) % 4 : ink)),
  },
  'dur-git-gorevi': {
    varsayilan: () => goNoGoBody(),
    hizli: () => goNoGoBody((t, i) => (t.go ? 300 : i % 2 ? 320 : null)),
    dikkatli: () => goNoGoBody((t, i) => (t.go ? (i % 5 === 0 ? null : 600) : null)),
    erken: () => goNoGoBody((t, i) => (t.go ? (i % 3 === 0 ? 60 : 420) : null)),
    hicBasmadi: () => goNoGoBody(() => null),
  },
  'tepki-hizi': {
    varsayilan: () => reactionBody(),
    ters: () => reactionBody((t) => ({ choice: t.part === 'choice' ? ((2 - t.box) as 1 | 2) : 1, rtMs: t.part === 'simple' ? 300 : 450 })),
    erken: () => reactionBody((t, i) => ({ choice: (t.box + 1) as 1 | 2, rtMs: i % 2 ? 40 : 330 })),
    kacirdi: () => reactionBody((t) => ({ choice: t.part === 'choice' ? null : 1, rtMs: t.part === 'choice' ? null : 310 })),
    tekTaraf: () => reactionBody((t) => ({ choice: t.part === 'choice' ? 1 : 1, rtMs: t.part === 'simple' ? 290 : 470 })),
  },
  'sekil-akil-yurutme': {
    varsayilan: () => matrixBody(),
    hepsi: () => matrixBody((q) => ({ choice: q.answer, rtMs: rising(q.level) })),
    kolay: () => matrixBody((q) => ({ choice: q.level === 1 ? q.answer : (q.answer % 8) + 1, rtMs: rising(q.level) })),
    ilkDuzey: () => matrixBody((q) => ({ choice: q.level === 1 ? (q.answer % 8) + 1 : q.answer, rtMs: rising(q.level) })),
    rastgele: () => matrixBody((q) => ({ choice: (q.answer % 8) + 1, rtMs: 1200 })),
    suresiz: () => matrixBody((q) => ({ choice: q.answer, rtMs: null })),
  },
  'sayi-dizileri': {
    varsayilan: () => numberSeriesBody(),
    hepsi: () => numberSeriesBody((q) => ({ answer: q.answer, rtMs: rising(q.level, 8000, 4000) })),
    kolay: () => numberSeriesBody((q) => ({ answer: q.level === 1 ? q.answer : null, rtMs: rising(q.level, 8000, 4000) })),
    ilkDuzey: () => numberSeriesBody((q) => ({ answer: q.level === 1 ? q.answer + 7 : q.answer, rtMs: rising(q.level, 8000, 4000) })),
    bilmiyorum: () => numberSeriesBody(() => ({ answer: null, rtMs: 3000 })),
    rastgele: () => numberSeriesBody((q) => ({ answer: q.answer + 7, rtMs: 1500 })),
    suresiz: () => numberSeriesBody((q) => ({ answer: q.answer, rtMs: null })),
  },
  'harf-dizileri': {
    varsayilan: () => letterSeriesBody(),
    hepsi: () => letterSeriesBody((q) => ({ answer: q.answer, rtMs: rising(q.level, 8000, 4000) })),
    kolay: () => letterSeriesBody((q) => ({ answer: q.level === 1 ? q.answer : null, rtMs: rising(q.level, 8000, 4000) })),
    ilkDuzey: () => letterSeriesBody((q) => ({ answer: q.level === 1 ? letterFar(q) : q.answer, rtMs: rising(q.level, 8000, 4000) })),
    bilmiyorum: () => letterSeriesBody(() => ({ answer: null, rtMs: 3000 })),
    rastgele: () => letterSeriesBody((q) => ({ answer: letterFar(q), rtMs: 1500 })),
    suresiz: () => letterSeriesBody((q) => ({ answer: q.answer, rtMs: null })),
  },
  'sozel-akil-yurutme': {
    varsayilan: () => verbalBody(),
    hepsi: () => verbalBody((q) => ({ response: q.answer, rtMs: rising(q.level) })),
    kolay: () => verbalBody((q) => ({ response: q.level === 1 ? q.answer : q.lure, rtMs: rising(q.level) })),
    ilkDuzey: () => verbalBody((q) => ({ response: q.level === 1 ? verbalOther(q) : q.answer, rtMs: rising(q.level) })),
    rastgele: () => verbalBody((q) => ({ response: verbalOther(q), rtMs: 1200 })),
    suresiz: () => verbalBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'kagit-katlama': {
    varsayilan: () => foldingBody(),
    hepsi: () => foldingBody((q) => ({ response: q.answer, rtMs: rising(q.level) })),
    kolay: () => foldingBody((q) => ({ response: q.level === 1 ? q.answer : q.lure, rtMs: rising(q.level) })),
    ilkDuzey: () => foldingBody((q) => ({ response: q.level === 1 ? foldingOther(q) : q.answer, rtMs: rising(q.level) })),
    rastgele: () => foldingBody((q) => ({ response: foldingOther(q), rtMs: 1200 })),
    suresiz: () => foldingBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'kelime-bilgisi': {
    varsayilan: () => vocabularyBody(),
    hepsi: () => vocabularyBody((q) => ({ response: q.answer, rtMs: rising(q.level, 4000, 1500) })),
    kolay: () => vocabularyBody((q) => ({ response: q.level === 1 ? q.answer : q.lure, rtMs: rising(q.level, 4000, 1500) })),
    ilkDuzey: () => vocabularyBody((q) => ({ response: q.level === 1 ? vocabularyOther(q) : q.answer, rtMs: rising(q.level, 4000, 1500) })),
    rastgele: () => vocabularyBody((q) => ({ response: vocabularyOther(q), rtMs: 900 })),
    suresiz: () => vocabularyBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'kup-acinimi': {
    varsayilan: () => cubeBody(),
    hepsi: () => cubeBody((q) => ({ response: q.answer, rtMs: rising(q.level) })),
    kolay: () => cubeBody((q) => ({ response: q.level === 1 ? q.answer : cubeLureOption(q, 'turn'), rtMs: rising(q.level) })),
    ilkDuzey: () => cubeBody((q) => ({ response: q.level === 1 ? cubeLureOption(q, 'opposite') : q.answer, rtMs: rising(q.level) })),
    rastgele: () => cubeBody((q) => ({ response: cubeLureOption(q), rtMs: 1200 })),
    suresiz: () => cubeBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'gizli-sekiller': {
    varsayilan: () => hiddenBody(),
    hepsi: () => hiddenBody((q) => ({ response: q.answer, rtMs: rising(q.level, 6000, 4000) })),
    kolay: () => hiddenBody((q) => ({ response: q.level === 1 ? q.answer : hiddenLureOption(q, 'turned'), rtMs: rising(q.level, 6000, 4000) })),
    ilkDuzey: () => hiddenBody((q) => ({ response: q.level === 1 ? hiddenLureOption(q, 'changed') : q.answer, rtMs: rising(q.level, 6000, 4000) })),
    rastgele: () => hiddenBody((q) => ({ response: hiddenLureOption(q), rtMs: 1200 })),
    suresiz: () => hiddenBody((q) => ({ response: q.answer, rtMs: null })),
  },
};
