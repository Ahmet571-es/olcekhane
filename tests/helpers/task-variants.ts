import type { AnswersBody } from '@/lib/assessment/schemas';
import { cancellationSheet } from '@/lib/instruments/cancellation';
import { blankOf, opTrue } from '@/lib/instruments/complex-span';
import type {
  CancellationTask,
  ComplexSpanTask,
  DigitSpanTask,
  FlankerTask,
  SpatialSpanTask,
  SymbolMatchTask,
  TaskInstrument,
  TrailTask,
} from '@/lib/instruments/types';
import { expectedSpanResponse, spanStimulus } from '@/lib/scoring/tasks';
import {
  SEED,
  cancellationBody,
  colorWordBody,
  def,
  goNoGoBody,
  memoryTasksBody,
  reactionBody,
  trailBody,
  nBackBody,
  ruleSwitchBody,
  complexSpanBody,
  csRight,
  wordListBody,
  wordListWords,
  rotationBody,
  rotation3dBody,
  r3Half,
  perspectiveBody,
  patternBody,
  dhMissOne,
  dhExtraOne,
  towerBody,
  logicBody,
  numericBody,
  reflectionBody,
  reflectionOther,
  cubeBody,
  cubeLureOption,
  foldingBody,
  foldingOther,
  hiddenBody,
  hiddenLureOption,
  analogyBody,
  analogyLureOption,
  letterNumberBody,
  symbolSearchBody,
  sgRight,
  sgWrong,
  hsMissOne,
  hsSwapLast,
  hsGrouped,
  hsLettersFirst,
  letterFar,
  letterSeriesBody,
  matrixBody,
  numberSeriesBody,
  verbalBody,
  verbalOther,
  vocabularyBody,
  vocabularyOther,
  arithBody,
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

/**
 * Sırayla birleştirme: her dokunuş arasında `stepMs` (ikinci bölümde iki katı); `cutB` verilirse ikinci bölümde yalnızca o
 * kadar daire birleştirilir (süre biter); `wrongEvery` verilirse her o kadar dairede bir yanlış daireye dokunulur.
 */
function trailVariant(stepMs: number, cutB?: number, wrongEvery = 0): AnswersBody {
  const task = def<TaskInstrument>('sirayla-birlestirme-gorevi').tasks[0] as TrailTask;
  const parts = task.parts.map((p, index) => {
    const step = index === 0 ? stepMs : stepMs * 2;
    const reach = index === 1 && cutB !== undefined ? cutB : p.labels.length;
    const taps: number[] = [];
    for (let i = 0; i < reach; i++) {
      if (wrongEvery && i > 0 && i % wrongEvery === 0 && i + 1 < p.labels.length) taps.push(i + 1);
      taps.push(i);
    }
    const times = taps.map((_, k) => (k + 1) * step);
    return { index, response: { taps, times }, rtMs: reach < p.labels.length ? task.maxMs : times[times.length - 1] };
  });
  return { grade: 5, data: { engine: 'tasks', seed: SEED, blocks: { [task.key]: parts } } };
}

const CS_BLANK = blankOf(def<TaskInstrument>('hesapla-ve-hatirla').tasks[0] as ComplexSpanTask);

/** Sayısal akıl yürütmede bir sorunun verilen türdeki ilk yanılgı cevabı (yoksa doğru cevap). */
const numLure = (q: { answer: number; lures: Partial<Record<string, number[]>> }, kind: string) => q.lures[kind]?.[0] ?? q.answer;

export const TASK_VARIANTS: Record<string, Variants> = {
  'mantiksal-akil-yurutme': {
    varsayilan: () => logicBody((q) => ({ response: q.form === 'ib' && q.i % 2 ? 1 : q.answer, rtMs: 8000 })),
    hepsi: () => logicBody(),
    inanc: () => logicBody((q) => ({ response: q.form === 'vu' ? 2 : q.form === 'ib' ? 1 : q.answer, rtMs: 8000 })),
    ikiYon: () => logicBody((q) => ({ response: q.form === 'ac' || q.form === 'da' ? 1 : q.answer, rtMs: 8000 })),
    hepEvet: () => logicBody(() => ({ response: 1, rtMs: 9000 })),
    hizli: () => logicBody((q) => ({ response: q.i % 2 ? q.answer : q.answer === 1 ? 2 : 1, rtMs: 900 })),
    suresiz: () => logicBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'zihinden-hesaplama-hizi': {
    varsayilan: () => arithBody((q) => ({ response: q.i % 6 === 5 ? q.answer + 1 : q.answer, rtMs: 1500 + 700 * q.level })),
    hepsi: () => arithBody(),
    elde: () => arithBody((q) => ({ response: q.i % 4 === 3 && q.op === 'add' && (q.item[0] % 10) + (q.item[1] % 10) >= 10 ? q.answer - 10 : q.answer, rtMs: 1800 + 700 * q.level })),
    tablo: () => arithBody((q) => ({ response: q.i % 3 === 2 && q.op === 'mul' && q.item[1] < 10 ? q.item[0] * (q.item[1] + 1) : q.answer, rtMs: 2200 + 500 * q.level })),
    gecen: () => arithBody((q) => ({ response: q.level >= 2 && q.i % 2 ? null : q.answer, rtMs: 2600 })),
    // İlk düzey doğru, gerisi geçildi: düzeylerin yanında "0/8 · 8 geçildi".
    gecildi: () => arithBody((q) => (q.level === 1 ? { response: q.answer, rtMs: 2000 } : { response: null, rtMs: 400 })),
    // Yalnızca bir bölüm yorumlanır: grafiklerde tek satır ya da tek süre kalır.
    tekBolum: () => arithBody((q) => (q.op === 'add' ? { response: q.answer, rtMs: 2000 } : { response: null, rtMs: 3000 })),
    bolmeYok: () => arithBody((q) => (q.op === 'div' ? { response: null, rtMs: 4000 } : { response: q.answer, rtMs: 2000 })),
    rastgele: () => arithBody(() => ({ response: 7, rtMs: 300 })),
  },
  'sayisal-akil-yurutme': {
    varsayilan: () => numericBody((q) => ({ response: q.kind === 'p' && q.i % 2 ? numLure(q, 'additive') : q.answer, rtMs: 9000 })),
    hepsi: () => numericBody(),
    fark: () => numericBody((q) => ({ response: numLure(q, 'additive'), rtMs: 9000 })),
    oranti: () => numericBody((q) => ({ response: numLure(q, 'proportional'), rtMs: 9000 })),
    esittir: () => numericBody((q) => ({ response: numLure(q, 'operational'), rtMs: 9000 })),
    bilmiyorum: () => numericBody((q) => ({ response: q.i % 3 === 0 ? null : q.answer, rtMs: 9000 })),
    hizli: () => numericBody((q) => ({ response: q.i % 2 ? q.answer : q.answer + 1, rtMs: 800 })),
    suresiz: () => numericBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'dusunerek-karar-verme': {
    varsayilan: () => reflectionBody((q) => ({ response: q.role === 'lure' && q.i % 3 === 0 ? q.lure : q.answer, rtMs: 12_000 })),
    hepsi: () => reflectionBody(),
    tuzak: () => reflectionBody((q) => ({ response: q.role === 'lure' ? q.lure : q.answer, rtMs: q.role === 'lure' ? 6000 : 12_000 })),
    supheci: () => reflectionBody((q) => ({ response: q.role === 'control' && q.i % 2 ? q.lure : q.answer, rtMs: 12_000 })),
    rastgele: () => reflectionBody((q) => ({ response: reflectionOther(q), rtMs: 2000 })),
    hizli: () => reflectionBody((q) => ({ response: q.i % 2 ? q.answer : q.lure, rtMs: 900 })),
    suresiz: () => reflectionBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'zihinde-dondurme': {
    varsayilan: () => rotationBody(),
    aynaKarisik: () => rotationBody((t, i) => ({ choice: t.mirror && i % 3 === 0 ? 1 : t.mirror ? 2 : 1, rtMs: 1300 + 6 * t.disparity })),
    ters: () => rotationBody((t) => ({ choice: t.mirror ? 1 : 2, rtMs: 1500 })),
    cevapsiz: () => rotationBody(() => ({ choice: null, rtMs: null })),
    duz: () => rotationBody((t) => ({ choice: t.mirror ? 2 : 1, rtMs: 1500 })),
    // Hep şekiller görünür görünmez basılmış: sonuç yorumlanmaz.
    erken: () => rotationBody((t) => ({ choice: t.mirror ? 2 : 1, rtMs: 150 })),
  },
  'uc-boyutlu-zihinde-dondurme': {
    varsayilan: () => rotation3dBody(),
    hepsi: () => rotation3dBody((q) => ({ response: q.answer, rtMs: q.part === 1 ? 14_000 : 22_000 })),
    ayna: () => rotation3dBody((q) => ({ response: q.part === 2 ? [...q.mirrors].sort((a, b) => a - b) : q.answer, rtMs: 16_000 })),
    yarim: () => rotation3dBody((q) => ({ response: r3Half(q, q.i), rtMs: 12_000 })),
    // 6 doğru, öteki sorularda bir doğru şekil ile bir ayna: yönerge farklı anlaşılmış olabilir.
    biriAyna: () => rotation3dBody((q) => ({ response: q.i < 6 ? q.answer : r3Half(q, q.i), rtMs: 12_000 })),
    suresiz: () => rotation3dBody((q) => ({ response: q.answer, rtMs: null })),
  },
  'bakis-acisi-alma': {
    varsayilan: () => perspectiveBody(),
    harita: () => perspectiveBody((q) => ({ deg: Math.abs(q.shift) >= 45 ? Math.round(q.ego) : Math.round(q.correct), rtMs: 9000 })),
    ayna: () => perspectiveBody((q) => ({ deg: Math.round(q.mirror), rtMs: 11_000 })),
    rastgele: () => perspectiveBody((q) => ({ deg: ((q.i * 97) % 360) - 180, rtMs: 1500 })),
    cevapsiz: () => perspectiveBody(() => ({ deg: null, rtMs: null })),
    // Ok hep doğru yönün tam tersine.
    ters: () => perspectiveBody((q) => ({ deg: Math.round(q.correct > 0 ? q.correct - 180 : q.correct + 180), rtMs: 9000 })),
  },
  'desen-hatirlama': {
    varsayilan: () => patternBody(),
    eksik: () => patternBody((q) => ({ cells: q.size <= 6 ? q.cells : dhMissOne(q) })),
    fazla: () => patternBody((q) => ({ cells: q.size <= 7 ? q.cells : dhExtraOne(q) })),
    bilmiyorum: () => patternBody((q) => ({ cells: q.size <= 5 ? q.cells : [] })),
    hicbiri: () => patternBody((q) => ({ cells: dhMissOne(q) })),
  },
  'harf-sayi-siralama': {
    varsayilan: () => letterNumberBody(),
    hepsi: () => letterNumberBody((q) => ({ seq: q.answer })),
    sira: () => letterNumberBody((q) => ({ seq: q.length <= 4 || q.k === 0 ? q.answer : hsSwapLast(q) })),
    ayrilmis: () => letterNumberBody((q) => ({ seq: hsGrouped(q) })),
    onceHarf: () => letterNumberBody((q) => ({ seq: q.length === 2 ? q.answer : hsLettersFirst(q) })),
    bilmiyorum: () => letterNumberBody((q) => ({ seq: q.length <= 4 ? q.answer : [] })),
    hicbiri: () => letterNumberBody((q) => ({ seq: hsMissOne(q) })),
    suresiz: () => letterNumberBody((q) => ({ seq: q.length <= 5 ? q.answer : hsMissOne(q), rtMs: null })),
  },
  'simge-bulma': {
    varsayilan: () => symbolSearchBody(),
    hepsi: () => symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: 900 })),
    yavas: () => symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: 3500 })),
    benzer: () => symbolSearchBody((q) => ({ ans: q.trial.lookalike && !q.trial.present && q.i % 2 === 0 ? 'var' : sgRight(q), rtMs: q.trial.lookalike ? 2300 : 1500 })),
    kacirma: () => symbolSearchBody((q) => ({ ans: q.trial.present && q.i % 3 === 0 ? 'yok' : sgRight(q), rtMs: 1400 })),
    aceleci: () => symbolSearchBody((q) => ({ ans: q.i % 6 === 0 ? sgWrong(q) : sgRight(q), rtMs: q.i % 6 === 0 ? 500 : 1600 })),
    cokHizli: () => symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: q.i % 4 === 0 ? 250 : 1500 })),
    az: () => symbolSearchBody((q) => (q.i < 10 ? { ans: sgRight(q) } : null)),
    hic: () => symbolSearchBody(() => null),
    tekDugme: () => symbolSearchBody(() => ({ ans: 'var', rtMs: 800 })),
    rastgele: () => symbolSearchBody((q) => ({ ans: q.i % 2 ? 'var' : 'yok', rtMs: 900 })),
    suresiz: () => symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: null })),
  },
  'planlama-kule-gorevi': {
    varsayilan: () => towerBody(),
    fazla: () => towerBody((q) => ({ outcome: q.moves >= 5 ? 'extra' : 'optimal', excess: 2 })),
    cozulemedi: () => towerBody((q) => ({ outcome: q.moves >= 6 ? 'unsolved' : 'optimal' })),
    bosta: () => towerBody(() => ({ outcome: 'idle' })),
    acele: () => towerBody((q) => ({ outcome: q.moves >= 5 ? 'extra' : 'optimal', pickMs: 600, excess: 2 })),
  },
  'sirayla-birlestirme-gorevi': {
    varsayilan: () => trailBody(),
    hizli: () => trailVariant(700),
    hatali: () => trailVariant(1500, undefined, 4),
    yarim: () => trailVariant(2500, 9),
  },
  'geriye-donuk-hatirlama': {
    varsayilan: () => nBackBody(),
    ikiZor: () => nBackBody((role, n, i) => (role === 'target' ? (n === 2 && i % 3 ? null : 650) : n === 2 && role === 'lure' && i % 2 ? 700 : null)),
    rastgele: () => nBackBody((_, __, i) => (i % 2 ? 520 : null)),
    sessiz: () => nBackBody(() => null),
    ikiSessiz: () => nBackBody((role, n) => (n === 1 && role === 'target' ? 650 : null)),
  },
  'kural-degistirme': {
    varsayilan: () => ruleSwitchBody(),
    karisik: () => ruleSwitchBody((q) => ({ response: q.kind === 'switch' && q.i % 2 ? 3 - q.answer : q.answer, rtMs: q.kind === 'pure' ? 620 : q.kind === 'switch' ? 1050 : 820 })),
    tekDugme: () => ruleSwitchBody(() => ({ response: 1, rtMs: 600 })),
    cevapsiz: () => ruleSwitchBody(() => ({ response: null, rtMs: null })),
    hizliDegisim: () => ruleSwitchBody((q) => ({ response: q.answer, rtMs: q.kind === 'switch' ? 640 : 760 })),
  },
  'hesapla-ve-hatirla': {
    varsayilan: () => complexSpanBody(),
    uzunZor: () => complexSpanBody((q) => ({ recall: q.size >= 6 ? [...q.letters.slice(0, -2), q.letters.at(-1)!, q.letters.at(-2)!] : q.letters, ops: q.ops.map((o) => csRight(o)) })),
    bos: () => complexSpanBody((q) => ({ recall: q.size >= 5 ? [...q.letters.slice(0, 2), CS_BLANK, ...q.letters.slice(3)] : q.letters, ops: q.ops.map((o) => csRight(o)) })),
    rastgele: () => complexSpanBody((q) => ({ recall: [CS_BLANK], ops: q.ops.map((o) => ({ a: !opTrue(o), ms: 1500 })) })),
    islemYavas: () => complexSpanBody((q) => ({ recall: q.letters, ops: q.ops.map((o, k) => (k % 3 === 0 ? { a: null, ms: null } : csRight(o))) })),
  },
  'kelime-listesi-hatirlama': {
    varsayilan: () => wordListBody(),
    tavan: () =>
      wordListBody({
        recalls: [
          wordListWords('A', Array.from({ length: 14 }, (_, i) => i)),
          wordListWords('A', Array.from({ length: 15 }, (_, i) => i)),
          wordListWords('A', Array.from({ length: 15 }, (_, i) => i)),
          wordListWords('B', [0, 1, 2, 3, 4, 5, 6, 7]),
          wordListWords('A', Array.from({ length: 15 }, (_, i) => i)),
        ],
      }),
    unutma: () =>
      wordListBody({
        recalls: [wordListWords('A', [0, 1, 13, 14]), wordListWords('A', [0, 1, 2, 12, 13, 14]), wordListWords('A', [0, 1, 2, 3, 11, 12, 13, 14]), wordListWords('B', [0, 1, 14]), wordListWords('A', [0, 1])],
        recog: (q) => q.kind === 'target' || q.kind === 'b' || q.kind === 'semantic',
      }),
    cevapsiz: () => wordListBody({ recalls: [[], [], [], [], []], recog: () => false }),
    tahmin: () => wordListBody({ recog: (q) => q.j % 2 === 0, recogRt: () => 150 }),
  },
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
  'sekil-benzetmeleri': {
    varsayilan: () => analogyBody(),
    hepsi: () => analogyBody((q) => ({ response: q.answer, rtMs: rising(q.level, 5000, 3000) })),
    kolay: () => analogyBody((q) => ({ response: q.level <= 2 ? q.answer : analogyLureOption(q, 'partial'), rtMs: rising(q.level, 5000, 3000) })),
    ilkDuzey: () => analogyBody((q) => ({ response: q.level === 1 ? analogyLureOption(q, 'extra') : q.answer, rtMs: rising(q.level, 5000, 3000) })),
    kopya: () => analogyBody((q) => ({ response: q.level <= 2 ? q.answer : analogyLureOption(q, 'copy'), rtMs: rising(q.level, 5000, 3000) })),
    rastgele: () => analogyBody((q) => ({ response: analogyLureOption(q), rtMs: 1200 })),
    suresiz: () => analogyBody((q) => ({ response: q.answer, rtMs: null })),
  },
};
