import type {
  CancellationTask,
  CognitiveTask,
  ColorWordTask,
  ComplexSpanTask,
  DigitSpanTask,
  FlankerTask,
  GoNoGoTask,
  LetterNumberTask,
  LetterSeriesTask,
  LogicalReasoningTask,
  MentalArithmeticTask,
  MentalRotation3dTask,
  MentalRotationTask,
  NBackTask,
  NumberSeriesTask,
  NumericalReasoningTask,
  CognitiveReflectionTask,
  PatternMemoryTask,
  PerspectiveTask,
  ReactionTimeTask,
  RuleSwitchTask,
  SpatialSpanTask,
  SymbolMatchTask,
  SymbolSearchTask,
  TowerTask,
  TrailTask,
  WordListTask,
} from '@/lib/instruments/types';
import { arithAnswer } from '@/lib/instruments/arithmetic';
import { lnAnswer } from '@/lib/instruments/letter-number';
import { PA_CLOSE, questionText, sectorWords } from '@/lib/instruments/perspective';
import {
  ARITH_MIN_ANSWERED,
  ARITH_RAPID_MS,
  CANCELLATION_FEW_HITS,
  CS_OPS_TARGET,
  CS_RAPID_MS,
  CS_RECALL_CHANCE_MAX,
  CS_OPS_CHANCE_MAX,
  LN_RAPID_BASE_MS,
  LN_RAPID_MS_PER_ITEM,
  LN_RESTARTS_NOTE,
  LOGIC_BELOW_CHANCE,
  LOGIC_SAME_SIDE,
  NBACK_RANDOM_FA,
  NUMERIC_BLANK_MANY,
  NUMERIC_MIN_ANSWERED,
  NUMERIC_RAPID_BLANK,
  NUMERIC_RAPID_WRONG,
  PA_CHANCE_MEAN,
  PA_PATTERN_MIN,
  PA_RAPID_MS,
  PA_SAME_DIR,
  PATTERN_RAPID_BASE_MS,
  PATTERN_RAPID_MS_PER_CELL,
  PATTERN_RESTARTS_NOTE,
  REACTION_MIN_VALID,
  REACTION_MOUSE_SHARE,
  REFLECTION_CONTROL_LOW,
  REFLECTION_CONTROL_NONE,
  REFLECTION_SAME_MAX_CORRECT,
  ROTATION3D_CHANCE_MAX,
  ROTATION3D_FIGURES_ABOVE,
  ROTATION3D_HALF_SYSTEMATIC,
  ROTATION3D_MIRROR_NOTE,
  ROTATION3D_RAPID_MS,
  ROTATION3D_SAME_MAX_CORRECT,
  ROTATION_MIN_ANSWERED,
  RULE_CHANCE_ACC,
  RULE_TOO_FAST_MS,
  SG_MIN_ACCURACY,
  SG_MIN_ANSWERED,
  SG_ONE_BUTTON,
  SG_TOO_FAST_MS,
  SG_TOO_FAST_N,
  SG_TOO_FAST_SHARE,
  TASK_QUALITY,
  TOWER_IDLE_NOTE,
  TOWER_RAPID_FROM,
  TOWER_RAPID_MS,
  arithFew,
  arithManySkips,
  arithRead,
  arithRushed,
  colorWordMostlyMissed,
  complexSpanOpsChance,
  complexSpanOpsReversed,
  complexSpanOpsSlow,
  complexSpanRapid,
  complexSpanRecallChance,
  letterSeriesMostlySkipped,
  letterSeriesRapid,
  letterSeriesSameAnswer,
  lnFloor,
  lnLettersFirstHabit,
  lnManySkipped,
  lnRapid,
  lnUnsorted,
  logicBelowChance,
  logicRapid,
  logicRushed,
  logicSameSide,
  nBackKeptOneBack,
  nBackSilent,
  numberSeriesMostlySkipped,
  numberSeriesRapid,
  numberSeriesSameAnswer,
  numericFewAnswered,
  numericRapid,
  numericRushed,
  patternFloor,
  patternManySkipped,
  patternRapid,
  perspectiveChance,
  perspectivePatternHigh,
  perspectiveRapid,
  perspectiveSameDir,
  reflectionChance,
  reflectionControlLow,
  reflectionRapid,
  reflectionRushed,
  reflectionSamePosition,
  rotation3dHalfPick,
  rotation3dMirrorPick,
  rotation3dRapid,
  rotation3dSamePair,
  rotationMissedKind,
  rotationStatus,
  ruleSwitchChance,
  ruleSwitchFast,
  ruleSwitchOneSide,
  ruleSwitchTimeouts,
  sgNotRead,
  sgTooFast,
  towerIdle,
  towerNone,
  towerRapid,
  wordListDelayedSkipped,
  wordListManyExtra,
  wordListNoInput,
  wordListRecogChance,
  wordListRecogFast,
  wordListRecogOneSided,
  type ArithSectionResult,
  type CancellationResult,
  type ColorWordResult,
  type ComplexSpanResult,
  type ComplexSpanSetTrace,
  type FlankerResult,
  type GoNoGoResult,
  type ItemTrace,
  type LetterNumberResult,
  type LetterSeriesResult,
  type LogicResult,
  type NBackResult,
  type NumberSeriesResult,
  type NumericResult,
  type PatternResult,
  type PerspectiveResult,
  type ReactionResult,
  type ReflectionResult,
  type Rotation3dResult,
  type RotationResult,
  type RuleSwitchResult,
  type SpanResult,
  type SymbolResult,
  type SymbolSearchResult,
  type TowerResult,
  type TrailResult,
  type WordListResult,
} from '@/lib/scoring/tasks';
import { ARITH_ERROR_NAME, LETTER_FEW_MAX, NUMBER_FEW_MAX, secShort } from './build';
import type { PartCard, PartLevel } from './parts';
import {
  QUALITY_TITLE,
  blockBadge,
  blocksCard,
  cap,
  check,
  countMeter,
  dec1,
  itemsCard,
  levelsCard,
  lower,
  measureCard,
  median,
  medianText,
  pctText,
  read,
  retake,
  sayCount,
  sayN,
  sec2,
  secLimit,
  secTag,
  shareMeter,
  stackOf,
  stripOf,
  timingCard,
  v,
  type BlockRow,
  type Ctx,
  type KindParts,
} from './task-parts-core';
import type { BarsVisual, ColumnsVisual, LadderVisual, MeterVisual } from './visuals';

/* ---------- Ortak küçük yardımcılar ---------- */

const quote = (s: string) => `“${s}”`;
const res = <T>(c: Ctx, key: string) => c.score(key)?.extra as unknown as T | undefined;
const pctVal = (x: number) => Math.round(x * 100);
/** Çubuktaki işaretin yeri: yuvarlanmamış yüzde (yuvarlama işareti sınırın öteki yanına geçirmesin; yazısı yuvarlanır). */
const pctExact = (x: number) => x * 100;
/** Yüzde çubukları (her biri 100 üzerinden). */
const pctBars = (label: string, rows: { label: string; rate: number }[]): BarsVisual => ({
  type: 'bars',
  label,
  scale: 'share',
  rows: rows.map((x) => ({
    label: x.label,
    value: pctVal(x.rate),
    max: 100,
    valueLabel: pctText(x.rate),
  })),
});
/** Pay çubukları (ör. 12 işlemin 9'u). */
const shareBars = (label: string, rows: { label: string; value: number; max: number; valueLabel?: string }[]): BarsVisual => ({
  type: 'bars',
  label,
  scale: 'share',
  rows: rows.map((x) => ({
    label: x.label,
    value: x.value,
    max: Math.max(1, x.max),
    valueLabel: x.valueLabel ?? `${x.value}/${x.max}`,
  })),
});
/** Saniye çubukları (ortak eksende). */
const secBars = (label: string, rows: { label: string; ms: number }[], digits: 1 | 2 = 2): BarsVisual => ({
  type: 'bars',
  label,
  scale: 'scale',
  unit: 'sn',
  rows: rows.map((x) => ({
    label: x.label,
    value: digits === 2 ? Math.round(x.ms / 10) / 100 : Math.round(x.ms / 100) / 10,
    valueLabel: digits === 2 ? sec2(x.ms) : secTag(x.ms),
  })),
});
/** Denemeleri eşit parçalara böler (ör. 48 deneme → 4 çeyrek): her parçanın ilk ve son sırası. */
function quarters(n: number, k = 4): { from: number; to: number }[] {
  if (n === 0) return [];
  const parts = Math.min(k, n);
  return Array.from({ length: parts }, (_, i) => ({
    from: Math.floor((i * n) / parts),
    to: Math.floor(((i + 1) * n) / parts) - 1,
  }));
}
/** Bir sayım satırının sözle yazımı: "11 doğru, 1 yanlış" (sıfır olan parçalar yazılmaz; hepsi sıfırsa ilk parça). */
function counts(parts: { n: number; label: string }[]): string {
  const xs = parts.filter((p) => p.n > 0);
  return (xs.length ? xs : parts.slice(0, 1)).map((p) => `${p.n} ${p.label}`).join(', ');
}
const statusCount = (ts: ItemTrace[], s: ItemTrace['status']) => ts.filter((t) => t.status === s).length;
const timedCount = (ts: ItemTrace[]) => ts.filter((t) => t.rtMs !== null).length;
/** Seçenekli bir sorunun cevabı. */
const yesNo = (r: number) => (r === 1 ? '“Evet, kesin olarak doğru”' : '“Hayır, kesin değil”');

/** Uyarının yüzde sınırı için kısa açıklama ("yüzde 10'dan çok"). */
const shareOf = (x: number, n: number) => (n ? (100 * x) / n : 0);

/* ---------- Sayı ve harf dizileri ---------- */

function seriesKind(
  c: Ctx,
  o: {
    task: NumberSeriesTask | LetterSeriesTask;
    r: NumberSeriesResult | LetterSeriesResult;
    prefix: 'sd' | 'hd';
    unit: 'sayı' | 'harf';
    fewMax: number;
    skippedMost: boolean;
    rapid: boolean;
    same: boolean;
  },
): KindParts {
  const { task, r, prefix } = o;
  const traces = c.traces[task.key] ?? [];
  const n = r.n;
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: task.levels.map((l) => `${l.level}.`),
    groupCaption: 'Düzeyler, kolaydan zora',
    rows: traces.map((t) => {
      const it = task.items[t.index];
      const terms = (it.terms as (number | string | null)[]).map((x) => (x === null ? '?' : String(x))).join(', ');
      return {
        group: it.level - 1,
        shown: `${it.level}. düzey · ${terms}`,
        say: `${it.level}. düzey. ${terms.replace('?', `eksik ${o.unit}`)}`,
        status: t.status,
        given: t.response === null ? null : String(t.response),
        expected: t.status === 'correct' ? null : String(task.answers[t.index]),
        tags: t.lure === 'trap' ? ['daha basit bir kurala uyan cevap'] : t.lure === 'near' ? ['doğruya çok yakın'] : [],
        rtMs: t.rtMs,
        rapid: !!t.rapid,
      };
    }),
    timed: true,
    rapid: {
      ms: task.rapidMs,
      label: `çok hızlı: ${secLimit(task.rapidMs)} sn altı`,
    },
    none: '“Bilmiyorum”',
  });
  const levels = levelsCard(c, {
    key: 'duzeyler',
    levels: task.levels,
    results: r.levels,
    reached: r.reached,
    read: read(c, `${prefix}_duzey`),
    headline: c.block(`${prefix}_duzey`)?.headline,
    skip: true,
  });
  const accuracy = measureCard({
    key: 'dogru',
    title: 'Doğru sayısı',
    ...blockBadge(c, `${prefix}_dogru`),
    text: [
      `Doğru sayısı, eksik ${o.unit === 'sayı' ? 'sayının' : 'harfin'} doğru bulunduğu soruların sayısıdır; her soru aynı değerdedir.`,
      'Cevap seçilmeden yazıldığı için şansla doğru bulmak çok zordur.',
      '“Bilmiyorum” demek puandan bir şey götürmez; emin olunmayan bir soruda dürüst bir cevaptır.',
    ].join(' '),
    note: 'Çubuk bütün soruları gösterir; parçalar doğru, yanlış ve “Bilmiyorum” cevaplarıdır.',
    visual: stackOf('Cevaplar', [
      { label: 'Doğru', value: r.correct },
      { label: 'Yanlış', value: r.wrong },
      { label: '“Bilmiyorum”', value: r.skipped },
    ]),
    spoken: [`Doğru: ${sayCount(r.correct)}. Yanlış: ${sayCount(r.wrong)}. Bilmiyorum: ${sayCount(r.skipped)}.`],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik süre',
          badge: `Tipik ${secShort(r.medianRt)}`,
          // Süre sınırının olmadığı raporun "Çalışma biçimi" kartında yazar; tipik süre rozette okunur.
          text: medianText('soru', 'dizinin ekrana gelmesinden cevabın verilmesine kadar'),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Sorulardaki cevap süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secShort(r.medianRt)}`,
            item: 'bir soru',
          }),
        });

  const few = r.correct <= o.fewMax;
  const fewCard = check('az-dogru', 'Çok az doğru cevap', few ? 'warn' : 'ok', {
    what: 'Cevap yazılarak verildiği için tahminle doğru bulmak çok zordur. Doğrular çok azsa sorular çok zor gelmiş ya da yönerge anlaşılmamış olabilir; sonuç yorumlanmaz.',
    result: few
      ? v(
          c,
          'Senin doğru cevapların bu sınırda kaldı; bu yüzden doğru sayısı yorumlanmadı.',
          'Çocuğunuzun doğru cevapları bu sınırda kaldı; bu yüzden doğru sayısı yorumlanmadı.',
        )
      : v(c, 'Senin doğru cevapların bu sınırın üstünde.', 'Çocuğunuzun doğru cevapları bu sınırın üstünde.'),
    todo: retake(c, 'yanında kâğıt ve kalemle'),
    note: 'Kırmızı çizgi doğru sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter(
      'Doğru cevaplar',
      n,
      o.fewMax,
      [
        {
          label: v(c, 'Doğru cevapların', 'Doğru cevaplar'),
          value: r.correct,
          valueLabel: `${r.correct} doğru`,
        },
      ],
      true,
    ),
    spoken: [`Doğru cevaplar: ${sayCount(r.correct)}.`, `Uyarı sınırı: ${o.fewMax} ya da daha az doğru.`],
  });
  const skipAt = Math.floor(n / 2) + 1;
  const skipCard = check('bilmiyorum', '“Bilmiyorum” cevapları', o.skippedMost ? 'warn' : 'ok', {
    what: 'Soruların yarısından çoğunda “Bilmiyorum” denirse sonuç az soruya dayanır ve tek başına yorumlanmaz.',
    result: o.skippedMost
      ? v(
          c,
          'Senin cevaplarında bu sınıra ulaşıldı; sorular çok zor gelmiş ya da test bir an önce bitirilmek istenmiş olabilir.',
          'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; sorular çok zor gelmiş ya da test bir an önce bitirilmek istenmiş olabilir.',
        )
      : v(c, 'Senin cevaplarında “Bilmiyorum” sınırın altında.', 'Çocuğunuzun cevaplarında “Bilmiyorum” sınırın altında.'),
    todo: retake(c, 'her soruyu denemeye çalışarak'),
    note: 'Kırmızı çizgi “Bilmiyorum” sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter('“Bilmiyorum” denen sorular', n, skipAt, [
      {
        label: '“Bilmiyorum”',
        value: r.skipped,
        valueLabel: `${r.skipped} soru`,
      },
    ]),
    spoken: [`Bilmiyorum denen sorular: ${sayCount(r.skipped)}.`, `Uyarı sınırı: ${skipAt} soru.`],
  });
  const timed = traces.some((t) => t.rtMs !== null);
  const need = Math.max(2, Math.ceil(r.rapidOf / 4));
  const rapidCard = !timed
    ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
        what: `3. düzey ve üstünde ${secLimit(task.rapidMs)} saniyeden kısa sürede yazılan yanlış cevaplar sayılır.`,
        result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
      })
    : r.rapidOf === 0
      ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
          what: `3. düzey ve üstünde ${secLimit(task.rapidMs)} saniyeden kısa sürede yazılan yanlış cevaplar sayılır.`,
          result: '3. düzey ve üstünde cevap yazılmadığı için bu denetim yapılmadı.',
        })
      : check('hizli', 'Çok hızlı yanlış cevaplar', o.rapid ? 'warn' : 'ok', {
          what: [
            `3. düzey ve üstünde cevap yazılan sorulardan ${secLimit(task.rapidMs)} saniyeden kısa sürede yazılan yanlış cevaplar sayılır.`,
            'Bu kadar kısa sürede diziyi inceleyip kuralı bulmak çok zordur.',
            'Bu soruların dörtte birinde böyle cevap varsa “Dikkat” yazar.',
          ].join(' '),
          result: o.rapid
            ? v(
                c,
                'Senin cevaplarında bu sınıra ulaşıldı; bu sorularda tahmin etmiş olabilirsin.',
                'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorularda tahmin etmiş olabilir.',
              )
            : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
          todo: v(
            c,
            'Yeniden çözersen cevabı yazmadan önce kuralı dizinin bütün sayılarında dene.',
            'Yeniden çözerse cevabı yazmadan önce kuralı dizinin bütününde denemesini önerebilirsiniz.',
          ),
          note: 'Kırmızı çizgi bu tür cevapların sayısı; renkli bölge uyarı bölgesi.',
          visual: countMeter('Çok hızlı yanlış cevaplar', r.rapidOf, need, [
            {
              label: '3. düzey ve üstünde',
              value: r.rapid,
              valueLabel: `${r.rapid} soru`,
            },
          ]),
          spoken: [`Çok hızlı yanlış cevaplar: ${sayCount(r.rapid)}.`, `Uyarı sınırı: ${r.rapidOf} sorudan ${need}.`],
        });
  const sameNeed = Math.max(6, Math.ceil(n / 2));
  const sameCard = check('ayni-cevap', `Hep aynı ${o.unit}`, o.same ? 'warn' : 'ok', {
    what: `Her sorunun cevabı farklıdır. Soruların yarısında ya da daha çoğunda aynı ${o.unit} yazılırsa sorulara bakmadan cevap verilmiş olabilir.`,
    result: o.same
      ? v(
          c,
          `Senin cevaplarında aynı ${o.unit} bu sınıra ulaşacak kadar sık yazıldı.`,
          `Çocuğunuzun cevaplarında aynı ${o.unit} bu sınıra ulaşacak kadar sık yazıldı.`,
        )
      : v(c, 'Senin cevaplarında böyle bir yığılma yok.', 'Çocuğunuzun cevaplarında böyle bir yığılma yok.'),
    todo: retake(c, 'her diziye bakarak'),
    note: `Kırmızı çizgi en sık yazılan ${o.unit === 'sayı' ? 'sayının' : 'harfin'} kaç soruda yazıldığı; renkli bölge uyarı bölgesi.`,
    visual: countMeter(`En sık yazılan ${o.unit}`, n, sameNeed, [
      {
        label: `Aynı ${o.unit}`,
        value: r.sameAnswer,
        valueLabel: `${r.sameAnswer} soru`,
      },
    ]),
    spoken: [
      r.sameAnswer === 0 ? `Yazılan ${o.unit} yok.` : `En sık yazılan ${o.unit} ${r.sameAnswer === 1 ? 'yalnızca bir' : r.sameAnswer} soruda yazıldı.`,
      `Uyarı sınırı: ${sameNeed} soru.`,
    ],
  });
  return {
    name: task.name,
    answers: [answers],
    levels: [levels, accuracy, ...(time ? [time] : [])],
    checks: [fewCard, skipCard, rapidCard, sameCard, timingCard(c, { noun: 'soru', measured: timedCount(traces), total: n })],
  };
}

/* ---------- Mantıksal akıl yürütme ---------- */

function logicKind(c: Ctx, task: LogicalReasoningTask, r: LogicResult): KindParts {
  const traces = c.traces[task.key] ?? [];
  const n = r.n;
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: [''],
    groupCaption: 'Sorular, testteki sırasıyla',
    rows: traces.map((t) => {
      const it = task.items[t.index];
      return {
        group: 0,
        shown: `${it.premises.join(' ')} Sonuç: ${it.conclusion}`,
        status: t.status,
        given: yesNo(t.response as number),
        // Sorunun türü (geçerli ya da geçersiz çıkarım) yazılmaz: aynı sorular geldiği için cevabı ele verirdi.
        rtMs: t.rtMs,
        rapid: !!t.rapid,
      };
    }),
    timed: true,
  });
  const accuracy = measureCard({
    key: 'dogru',
    title: 'Doğru sayısı',
    ...blockBadge(c, 'ma_dogru'),
    text: [
      'Doğru sayısı, sonucun kesin olup olmadığına doğru karar verilen soruların sayısıdır.',
      'Her soruda iki seçenek olduğu için rastgele seçen biri de soruların yaklaşık yarısını bulur.',
      'Bu yüzden sonuç, yarıdan ne kadar uzaklaşıldığıyla birlikte okunur.',
    ].join(' '),
    note: 'Çubuk bütün soruları gösterir; parçalar doğru ve yanlış cevaplardır.',
    visual: stackOf('Doğru ve yanlış cevaplar', [
      { label: 'Doğru', value: r.correct },
      { label: 'Yanlış', value: n - r.correct },
    ]),
    spoken: [`Doğru: ${sayCount(r.correct)}. Yanlış: ${sayCount(n - r.correct)}.`],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik süre',
          badge: `Tipik ${secShort(r.medianRt)}`,
          text: [medianText('soru', 'sorunun ekrana gelmesinden cevabın verilmesine kadar'), 'Uzun bilgileri okumak zaman alır.'].join(' '),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Sorulardaki cevap süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secShort(r.medianRt)}`,
            item: 'bir soru',
          }),
        });
  const side = logicSameSide(r);
  const lowYes = n - LOGIC_SAME_SIDE;
  const sideMeter: MeterVisual = {
    type: 'meter',
    label: '“Evet” cevapları',
    min: 0,
    max: n,
    discrete: true,
    zones: [
      { from: 0, to: lowYes + 0.5, label: 'Dikkat', warn: true },
      {
        from: lowYes + 0.5,
        to: LOGIC_SAME_SIDE - 0.5,
        label: 'Uygun',
        warn: false,
      },
      { from: LOGIC_SAME_SIDE - 0.5, to: n, label: 'Dikkat', warn: true },
    ],
    rows: [
      {
        label: '“Evet” denen sorular',
        value: r.yes,
        valueLabel: `${r.yes} soru`,
      },
    ],
  };
  const sideCard = check('ayni-cevap', 'Hep aynı cevap', side ? 'warn' : 'ok', {
    what: 'Soruların yarısının cevabı “evet”, yarısının “hayır”dır. Neredeyse hepsinde aynı cevap verilirse sorulara bakılmamış ya da yönerge farklı anlaşılmış olabilir.',
    result: side
      ? v(c, 'Senin cevaplarında bu görüldü; bu yüzden sonuç yorumlanmadı.', 'Çocuğunuzun cevaplarında bu görüldü; bu yüzden sonuç yorumlanmadı.')
      : v(c, '“Evet” ve “hayır” cevapların ikisi de yeterince var.', 'Çocuğunuzun “evet” ve “hayır” cevaplarının ikisi de yeterince var.'),
    todo: retake(c, 'her soruyu okuyarak'),
    note: 'Kırmızı çizgi “evet” cevaplarının sayısı; iki uçtaki renkli bölgeler uyarı bölgesi.',
    visual: sideMeter,
    spoken: [`Evet denen sorular: ${sayCount(r.yes)}.`, `Uyarı: ${lowYes} ya da daha az, ya da ${LOGIC_SAME_SIDE} ya da daha çok.`],
  });
  const below = logicBelowChance(r);
  const belowCard = check('sans-alti', 'Şansın altında doğru', side ? 'none' : below ? 'warn' : 'ok', {
    what: 'Rastgele seçen biri de soruların yaklaşık yarısını bulur. Doğrular bunun çok altındaysa seçenekler ters kullanılmış ya da yönerge farklı anlaşılmış olabilir.',
    result: side
      ? 'Hep aynı cevap verildiği için bu denetim ayrıca yapılmadı.'
      : below
        ? v(
            c,
            'Senin doğru cevapların bu sınırda kaldı; bu yüzden sonuç yorumlanmadı.',
            'Çocuğunuzun doğru cevapları bu sınırda kaldı; bu yüzden sonuç yorumlanmadı.',
          )
        : v(c, 'Senin doğru cevapların bu sınırın üstünde.', 'Çocuğunuzun doğru cevapları bu sınırın üstünde.'),
    todo: retake(c, 'yönergeyi yeniden okuyarak'),
    note: 'Kırmızı çizgi doğru sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter(
      'Doğru cevaplar',
      n,
      LOGIC_BELOW_CHANCE,
      [
        {
          label: 'Doğru',
          value: r.correct,
          valueLabel: `${r.correct} doğru`,
        },
      ],
      true,
    ),
    spoken: [`Doğru cevaplar: ${sayCount(r.correct)}.`, `Uyarı sınırı: ${LOGIC_BELOW_CHANCE} ya da daha az doğru.`],
  });
  const rapid = logicRapid(r);
  const rushed = logicRushed(r);
  const need = Math.ceil(n / 4);
  const rapidCard = !traces.some((t) => t.rtMs !== null)
    ? check('hizli', 'Okunamayacak kadar hızlı cevaplar', 'none', {
        what: 'Soruyu okumaya yetmeyecek kadar kısa sürede verilen cevaplar sayılır.',
        result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
      })
    : check('hizli', 'Okunamayacak kadar hızlı cevaplar', rapid ? 'warn' : 'ok', {
        what: [
          'Bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verilen cevaplar sayılır; sınır sorunun uzunluğuna göredir.',
          'Soruların dörtte birinde böyle cevap varsa ve bunların dörtte üçünden azı doğruysa “Dikkat” yazar.',
        ].join(' '),
        result: rapid
          ? v(
              c,
              `Senin cevaplarında bu sınıra ulaşıldı; bu sorularda okumadan seçmiş olabilirsin.${rushed ? ' Bu yüzden sonuç yorumlanmadı.' : ''}`,
              `Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorularda okumadan seçmiş olabilir.${rushed ? ' Bu yüzden sonuç yorumlanmadı.' : ''}`,
            )
          : r.rapid >= need
            ? v(
                c,
                'Bazı sorularda çok hızlı cevap verdin ama bu cevapların çoğu doğruydu; soruları hızlı okumuş olabilirsin.',
                'Çocuğunuz bazı sorularda çok hızlı cevap verdi ama bu cevapların çoğu doğruydu; soruları hızlı okumuş olabilir.',
              )
            : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
        todo: v(c, 'Yeniden çözersen her soruyu sonuna kadar oku.', 'Yeniden çözerse her soruyu sonuna kadar okumasını önerebilirsiniz.'),
        note: 'Kırmızı çizgi çok hızlı cevapların sayısı; renkli bölge uyarı bölgesi.',
        // Çok hızlı cevapların çoğu doğruysa sayı sınırı aşsa da uyarı yoktur: bölge renksiz çizilir.
        visual: countMeter(
          'Çok hızlı cevaplar',
          n,
          need,
          [
            {
              label: 'Çok hızlı',
              value: r.rapid,
              valueLabel: `${r.rapid} soru`,
            },
          ],
          false,
          rapid ? {} : { calm: true, warnLabel: 'Çok hızlı' },
        ),
        spoken: [
          `Çok hızlı cevaplar: ${sayCount(r.rapid)}${r.rapid ? `; bunlardan doğru olanlar: ${sayCount(r.rapidCorrect)}` : ''}.`,
          `Uyarı sınırı: ${need} soru.`,
        ],
      });
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(time ? [time] : [])],
    checks: [sideCard, belowCard, rapidCard, timingCard(c, { noun: 'soru', measured: timedCount(traces), total: n })],
  };
}

/* ---------- Sayısal akıl yürütme ---------- */

const NUMERIC_LURE: Record<string, string> = {
  additive: 'farkı koruyarak bulunan cevap',
  proportional: 'orantı kurarak bulunan cevap',
  inverse: 'ters orantıyla bulunan cevap',
  operational: 'eşittirin solundaki işlemin sonucu',
  reverse: 'ters yönde denkleştirme',
  partial: 'kefedeki ortak şey hesaba katılmadan',
};

function numericKind(c: Ctx, task: NumericalReasoningTask, r: NumericResult): KindParts {
  const traces = c.traces[task.key] ?? [];
  const n = r.n;
  const withUnit = (x: number, i: number) => `${x}${task.items[i].unit ? ` ${task.items[i].unit}` : ''}`;
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: [''],
    groupCaption: 'Sorular, testteki sırasıyla',
    rows: traces.map((t) => {
      const it = task.items[t.index];
      return {
        group: 0,
        shown: `${it.stem.join(' ')} ${it.question}`,
        status: t.status,
        given: t.response === null ? null : withUnit(t.response as number, t.index),
        expected: t.status === 'correct' ? null : withUnit(task.answers[t.index], t.index),
        tags: t.lure ? [NUMERIC_LURE[t.lure] ?? t.lure] : [],
        rtMs: t.rtMs,
        rapid: !!t.rapid && t.status === 'wrong',
      };
    }),
    timed: true,
    none: '“Bilmiyorum”',
  });
  const accuracy = measureCard({
    key: 'dogru',
    title: 'Doğru sayısı',
    ...blockBadge(c, 'sy_dogru'),
    text: [
      'Doğru sayısı, doğru sayının yazıldığı soruların sayısıdır.',
      'Cevap seçilmeden yazıldığı için şansla doğru bulmak çok zordur.',
      '“Bilmiyorum” demek puandan bir şey götürmez.',
    ].join(' '),
    note: 'Çubuk bütün soruları gösterir; parçalar doğru, yanlış ve “Bilmiyorum” cevaplarıdır.',
    visual: stackOf('Cevaplar', [
      { label: 'Doğru', value: r.correct },
      { label: 'Yanlış', value: n - r.correct - r.blank },
      { label: '“Bilmiyorum”', value: r.blank },
    ]),
    spoken: [`Doğru: ${sayCount(r.correct)}. Yanlış: ${sayCount(n - r.correct - r.blank)}. Bilmiyorum: ${sayCount(r.blank)}.`],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik süre',
          badge: `Tipik ${secShort(r.medianRt)}`,
          text: [medianText('soru', 'sorunun ekrana gelmesinden cevabın verilmesine kadar'), 'Uzun bir durumu okuyup hesaplamak zaman alır.'].join(' '),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Sorulardaki cevap süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secShort(r.medianRt)}`,
            item: 'bir soru',
          }),
        });
  const few = numericFewAnswered(r);
  const many = r.blank >= NUMERIC_BLANK_MANY;
  const fewAt = n - NUMERIC_MIN_ANSWERED + 1;
  const blankMeter: MeterVisual = {
    type: 'meter',
    label: '“Bilmiyorum” cevapları',
    min: 0,
    max: n,
    discrete: true,
    zones: [
      { from: 0, to: NUMERIC_BLANK_MANY - 0.5, label: 'Uygun', warn: false },
      { from: NUMERIC_BLANK_MANY - 0.5, to: n, label: 'Dikkat', warn: true },
    ],
    rows: [
      {
        label: '“Bilmiyorum” denen',
        value: r.blank,
        valueLabel: `${r.blank} soru`,
      },
    ],
  };
  const blankCard = check('bilmiyorum', '“Bilmiyorum” cevapları', few || many ? 'warn' : 'ok', {
    what: `Soruların yarısında ya da daha çoğunda “Bilmiyorum” denirse türlere göre sonuçlar az soruya dayanır. ${fewAt} ya da daha çok soruda denirse sonuç hiç yorumlanmaz.`,
    result: few
      ? v(c, 'Cevap yazdığın soru çok az; bu yüzden sonuç yorumlanmadı.', 'Cevap yazılan soru çok az; bu yüzden sonuç yorumlanmadı.')
      : many
        ? v(
            c,
            'Senin cevaplarında “Bilmiyorum” çok; türlere göre sonuçlar dikkatle okunmalı.',
            'Çocuğunuzun cevaplarında “Bilmiyorum” çok; türlere göre sonuçlar dikkatle okunmalı.',
          )
        : v(c, 'Senin cevaplarında “Bilmiyorum” sınırın altında.', 'Çocuğunuzun cevaplarında “Bilmiyorum” sınırın altında.'),
    todo: retake(c, 'yanında kâğıt ve kalemle'),
    note: 'Kırmızı çizgi “Bilmiyorum” sayısı; renkli bölge uyarı bölgesi.',
    visual: blankMeter,
    spoken: [`Bilmiyorum denen sorular: ${sayCount(r.blank)}.`, `Dikkat: ${NUMERIC_BLANK_MANY} ya da daha çok; yorumlanmaz: ${fewAt} ya da daha çok.`],
  });
  const rapidWrong = r.rapid - r.rapidCorrect;
  const rapidCard = few
    ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
        what: 'Soruyu okumaya yetmeyecek kadar kısa sürede yazılan yanlış cevaplar sayılır.',
        result: 'Cevap yazılan soru çok az olduğu için bu denetim yapılmadı.',
      })
    : !traces.some((t) => t.rtMs !== null)
      ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
          what: 'Soruyu okumaya yetmeyecek kadar kısa sürede yazılan yanlış cevaplar sayılır.',
          result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
        })
      : check('hizli', 'Çok hızlı yanlış cevaplar', numericRapid(r) ? 'warn' : 'ok', {
          what: [
            'Soruyu okumaya yetmeyecek kadar kısa sürede yazılan yanlış cevaplar sayılır; sınır sorunun uzunluğuna göredir.',
            'Kısa sürede yazılan doğru cevaplar sayılmaz: doğru sayı tahminle bulunamaz.',
          ].join(' '),
          result: numericRapid(r)
            ? numericRushed(r)
              ? v(
                  c,
                  'Senin cevaplarında bu sınıra ulaşıldı; birçok soruya okumadan cevap yazmış olabilirsin. Bu yüzden sonuç yorumlanmadı.',
                  'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; birçok soruya okumadan cevap yazmış olabilir. Bu yüzden sonuç yorumlanmadı.',
                )
              : v(
                  c,
                  'Senin cevaplarında bu sınıra ulaşıldı; bu sorularda acele etmiş olabilirsin.',
                  'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorularda acele etmiş olabilir.',
                )
            : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
          todo: v(c, 'Yeniden çözersen her soruyu sonuna kadar oku.', 'Yeniden çözerse her soruyu sonuna kadar okumasını önerebilirsiniz.'),
          note: 'Kırmızı çizgi bu tür cevapların sayısı; renkli bölge uyarı bölgesi.',
          visual: countMeter('Çok hızlı yanlış cevaplar', n, NUMERIC_RAPID_WRONG, [
            {
              label: 'Çok hızlı ve yanlış',
              value: rapidWrong,
              valueLabel: `${rapidWrong} soru`,
            },
          ]),
          spoken: [`Çok hızlı yazılan yanlış cevaplar: ${sayCount(rapidWrong)}.`, `Uyarı sınırı: ${NUMERIC_RAPID_WRONG} soru.`],
        });
  // Raporun "Çalışma biçimi" kartındaki gözlem (lib/reports/build.ts, numericBlocks): kısa sürede denen "Bilmiyorum".
  const quickBlank = r.rapidBlank >= NUMERIC_RAPID_BLANK;
  const quickBlankCard = few
    ? check('hizli-bilmiyorum', 'Çok hızlı “Bilmiyorum” cevapları', 'none', {
        what: 'Soruyu okumaya yetmeyecek kadar kısa sürede denen “Bilmiyorum” cevapları sayılır.',
        result: 'Cevap yazılan soru çok az olduğu için bu denetim yapılmadı.',
      })
    : !traces.some((t) => t.rtMs !== null)
      ? check('hizli-bilmiyorum', 'Çok hızlı “Bilmiyorum” cevapları', 'none', {
          what: 'Soruyu okumaya yetmeyecek kadar kısa sürede denen “Bilmiyorum” cevapları sayılır.',
          result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
        })
      : check('hizli-bilmiyorum', 'Çok hızlı “Bilmiyorum” cevapları', quickBlank ? 'warn' : 'ok', {
          what: [
            'Soruyu okumaya yetmeyecek kadar kısa sürede denen “Bilmiyorum” cevapları sayılır; sınır sorunun uzunluğuna göredir.',
            `En az ${NUMERIC_RAPID_BLANK} soruda böyleyse bu sorular atlanmış olabilir.`,
          ].join(' '),
          result: quickBlank
            ? v(
                c,
                'Senin cevaplarında bu görüldü; raporun “Çalışma biçimi” kartında da yazıyor.',
                'Çocuğunuzun cevaplarında bu görüldü; raporun “Çalışma biçimi” kartında da yazıyor.',
              )
            : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
          todo: v(c, 'Yeniden çözersen her soruyu okuyup denemeye çalış.', 'Yeniden çözerse her soruyu okuyup denemesini önerebilirsiniz.'),
          note: 'Kırmızı çizgi bu tür cevapların sayısı; renkli bölge uyarı bölgesi.',
          visual: countMeter('Çok hızlı “Bilmiyorum”', n, NUMERIC_RAPID_BLANK, [
            {
              label: 'Çok hızlı “Bilmiyorum”',
              value: r.rapidBlank,
              valueLabel: `${r.rapidBlank} soru`,
            },
          ]),
          spoken: [`Çok hızlı denen Bilmiyorum: ${sayCount(r.rapidBlank)}.`, `Uyarı sınırı: ${NUMERIC_RAPID_BLANK} soru.`],
        });
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(time ? [time] : [])],
    checks: [blankCard, rapidCard, quickBlankCard, timingCard(c, { noun: 'soru', measured: timedCount(traces), total: n })],
  };
}

/* ---------- Düşünerek karar verme ---------- */

function reflectionKind(c: Ctx, task: CognitiveReflectionTask, r: ReflectionResult): KindParts {
  const traces = c.traces[task.key] ?? [];
  const n = r.n;
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: [''],
    groupCaption: 'Sorular, testteki sırasıyla',
    rows: traces.map((t) => {
      const it = task.items[t.index];
      // Sorunun tuzaklı mı eş mi olduğu ve yanlışın türü yazılmaz: aynı sorular geldiği için cevabı ele verirdi.
      return {
        group: 0,
        shown: `${it.stem.join(' ')} ${it.question}`,
        status: t.status,
        given: quote(it.options[(t.response as number) - 1]),
        rtMs: t.rtMs,
        rapid: !!t.rapid,
      };
    }),
    timed: true,
  });
  const L = r.lure;
  const C = r.control;
  const lureCard = measureCard({
    key: 'tuzakli',
    title: 'Tuzaklı sorular',
    ...blockBadge(c, 'dk_dogru'),
    text: [
      'Tuzaklı sorularda ilk akla gelen cevap yanlıştır; doğruyu bulmak için durup ilk cevabı denetlemek gerekir.',
      'Bu ölçü, tuzaklı soruların kaçında doğru cevaba ulaşıldığıdır.',
    ].join(' '),
    note: 'Çubuk tuzaklı soruları gösterir; parçalar doğru, ilk akla gelen ve başka yanlış cevaplardır.',
    visual: stackOf('Tuzaklı sorulardaki cevaplar', [
      { label: 'Doğru', value: L.correct },
      { label: 'İlk akla gelen cevap', value: L.lure },
      { label: 'Başka yanlış', value: L.other },
    ]),
    spoken: [`Tuzaklı sorularda doğru: ${sayCount(L.correct)}. İlk akla gelen cevap: ${sayCount(L.lure)}. Başka yanlış: ${sayCount(L.other)}.`],
  });
  const controlCard = measureCard({
    key: 'es',
    title: 'Tuzaksız eş sorular',
    ...blockBadge(c, 'dk_es'),
    text: [
      'Eş sorular tuzaklı sorulara benzer ama tuzak içermez; ilk akla gelen cevap doğrudur.',
      'Bu sorular, soruların dikkatle okunup okunmadığını gösterir.',
    ].join(' '),
    note: 'Çubuk eş soruları gösterir; parçalar doğru, tuzak varmış gibi verilen ve başka yanlış cevaplardır.',
    visual: stackOf('Eş sorulardaki cevaplar', [
      { label: 'Doğru', value: C.correct },
      { label: 'Tuzak varmış gibi cevap', value: C.lure },
      { label: 'Başka yanlış', value: C.other },
    ]),
    spoken: [`Eş sorularda doğru: ${sayCount(C.correct)}. Tuzak varmış gibi cevap: ${sayCount(C.lure)}. Başka yanlış: ${sayCount(C.other)}.`],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik süre',
          badge: `Tipik ${secShort(r.medianRt)}`,
          text: [medianText('soru', 'sorunun ekrana gelmesinden cevabın verilmesine kadar'), 'Durup düşünmek zaman alır.'].join(' '),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Sorulardaki cevap süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secShort(r.medianRt)}`,
            item: 'bir soru',
          }),
        });
  const chance = reflectionChance(r);
  const doubt = reflectionRapid(r) || reflectionSamePosition(r);
  const low = reflectionControlLow(r) && !doubt;
  // Eş sorulardaki yanlışların çoğu tuzak varmış gibi cevapsa doğrular çok az olsa da sonuç yorumlanır (reflectionChance):
  // o zaman "Yorumlanmaz" bölgesi çizilmez.
  const trapSeeking = low && C.correct <= REFLECTION_CONTROL_NONE;
  const controlMeter: MeterVisual = {
    type: 'meter',
    label: 'Eş sorularda doğru',
    min: 0,
    max: C.n,
    discrete: true,
    zones: [
      ...(trapSeeking
        ? []
        : [
            {
              from: 0,
              to: REFLECTION_CONTROL_NONE + 0.5,
              label: 'Yorumlanmaz',
              warn: true,
            },
          ]),
      {
        from: trapSeeking ? 0 : REFLECTION_CONTROL_NONE + 0.5,
        to: REFLECTION_CONTROL_LOW + 0.5,
        label: 'Dikkat',
        warn: true,
      },
      {
        from: REFLECTION_CONTROL_LOW + 0.5,
        to: C.n,
        label: 'Uygun',
        warn: false,
      },
    ],
    rows: [
      {
        label: 'Eş sorularda doğru',
        value: C.correct,
        valueLabel: `${C.correct}/${C.n}`,
      },
    ],
  };
  // Eş soruların bir kısmı yanlış ama çok hızlı cevaplar ya da aynı yere basmak da açıklayabiliyorsa bu denetim ayrıca yapılmaz.
  const controlCheck = check('es', 'Eş soruların okunması', chance || low ? 'warn' : reflectionControlLow(r) ? 'none' : 'ok', {
    what: 'Tuzaksız eş soruların çoğu doğru olmalıdır. Bunların da çoğu yanlışsa sorular dikkatle okunmamış ya da yönerge farklı anlaşılmış olabilir.',
    result: chance
      ? v(
          c,
          'Senin cevaplarında eş soruların çok azı doğru; bu yüzden sonuç yorumlanmadı.',
          'Çocuğunuzun cevaplarında eş soruların çok azı doğru; bu yüzden sonuç yorumlanmadı.',
        )
      : trapSeeking
        ? v(
            c,
            'Eş sorulardaki yanlışların çoğunda tuzak varmış gibi cevap verdin. Tuzak olmayan sorularda da tuzak aramış olabilirsin; sonuç dikkatle okunmalı.',
            'Eş sorulardaki yanlışların çoğunda tuzak varmış gibi cevap verildi. Çocuğunuz tuzak olmayan sorularda da tuzak aramış olabilir; sonuç dikkatle okunmalı.',
          )
        : low
          ? v(
              c,
              'Eş soruların bir kısmında da yanlış cevap verdin; sonuç dikkatle okunmalı.',
              'Çocuğunuz eş soruların bir kısmında da yanlış cevap verdi; sonuç dikkatle okunmalı.',
            )
          : reflectionControlLow(r)
            ? 'Eş soruların bir kısmı yanlış; bunu çok hızlı cevaplar ya da aynı yere basmak da açıklayabildiği için bu denetim ayrıca yapılmadı.'
            : v(c, 'Eş soruların çoğunu doğru cevapladın.', 'Çocuğunuz eş soruların çoğunu doğru cevapladı.'),
    todo: retake(c, 'her soruyu sonuna kadar okuyarak'),
    note: 'Kırmızı çizgi eş sorulardaki doğru sayısı; renkli bölgeler uyarı bölgeleri.',
    visual: controlMeter,
    spoken: [
      `Eş sorularda doğru: ${C.correct}/${C.n}.`,
      trapSeeking
        ? `Dikkat: ${REFLECTION_CONTROL_LOW} ya da daha az.`
        : `Yorumlanmaz: ${REFLECTION_CONTROL_NONE} ya da daha az; dikkat: ${REFLECTION_CONTROL_LOW} ya da daha az.`,
    ],
  });
  const rapid = reflectionRapid(r);
  const need = Math.ceil(n / 4);
  const rapidCard = !traces.some((t) => t.rtMs !== null)
    ? check('hizli', 'Okunamayacak kadar hızlı cevaplar', 'none', {
        what: 'Soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verilen cevaplar sayılır.',
        result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
      })
    : check('hizli', 'Okunamayacak kadar hızlı cevaplar', rapid ? 'warn' : 'ok', {
        what: [
          'Soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verilen cevaplar sayılır; sınır sorunun uzunluğuna göredir.',
          'Soruların dörtte birinde böyle cevap varsa ve bunların dörtte üçünden azı doğruysa “Dikkat” yazar.',
        ].join(' '),
        result: rapid
          ? v(
              c,
              `Senin cevaplarında bu sınıra ulaşıldı; bu sorulara okumadan cevap vermiş olabilirsin.${reflectionRushed(r) ? ' Bu yüzden sonuç yorumlanmadı.' : ''}`,
              `Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorulara okumadan cevap vermiş olabilir.${reflectionRushed(r) ? ' Bu yüzden sonuç yorumlanmadı.' : ''}`,
            )
          : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
        todo: v(c, 'Yeniden çözersen her soruyu sonuna kadar oku.', 'Yeniden çözerse her soruyu sonuna kadar okumasını önerebilirsiniz.'),
        note: 'Kırmızı çizgi çok hızlı cevapların sayısı; renkli bölge uyarı bölgesi.',
        // Çok hızlı cevapların çoğu doğruysa sayı sınırı aşsa da uyarı yoktur: bölge renksiz çizilir.
        visual: countMeter(
          'Çok hızlı cevaplar',
          n,
          need,
          [
            {
              label: 'Çok hızlı',
              value: r.rapid,
              valueLabel: `${r.rapid} soru`,
            },
          ],
          false,
          rapid ? {} : { calm: true, warnLabel: 'Çok hızlı' },
        ),
        spoken: [
          `Çok hızlı cevaplar: ${sayCount(r.rapid)}${r.rapid ? `; bunlardan doğru olanlar: ${sayCount(r.rapidCorrect)}` : ''}.`,
          `Uyarı sınırı: ${need} soru.`,
        ],
      });
  const same = reflectionSamePosition(r);
  const half = Math.ceil(n / 2);
  const sameCard = check('ayni-yer', 'Hep aynı sıradaki seçenek', same ? 'warn' : 'ok', {
    what: 'Doğru cevaplar seçeneklerin farklı sıralarındadır. Cevapların yarısı ya da daha çoğu aynı sıradaysa ve doğrular çok değilse, bakmadan aynı yere basılmış olabilir.',
    result: same
      ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
      : v(c, 'Senin cevaplarında böyle bir yığılma yok.', 'Çocuğunuzun cevaplarında böyle bir yığılma yok.'),
    todo: retake(c, 'her soruya bakarak'),
    note: 'Kırmızı çizgi en sık seçilen sıranın sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter(
      'Aynı sıradaki seçenek',
      n,
      half,
      [
        {
          label: 'En sık seçilen sıra',
          value: r.samePosition,
          valueLabel: `${r.samePosition} cevap`,
        },
      ],
      false,
      same ? {} : { calm: true, warnLabel: 'Yarısı ya da çoğu' },
    ),
    spoken: [
      `En sık seçilen sıradaki cevaplar: ${sayCount(r.samePosition)}.`,
      `Uyarı sınırı: ${half}; doğrular ${REFLECTION_SAME_MAX_CORRECT} ya da daha az olmalı.`,
    ],
  });
  return {
    name: task.name,
    answers: [answers],
    levels: [lureCard, controlCard, ...(time ? [time] : [])],
    checks: [controlCheck, rapidCard, sameCard, timingCard(c, { noun: 'soru', measured: timedCount(traces), total: n })],
  };
}

/* ---------- Üç boyutlu zihinde döndürme ---------- */

function rotation3dKind(c: Ctx, task: MentalRotation3dTask, r: Rotation3dResult): KindParts {
  const traces = c.traces[task.key] ?? [];
  const n = r.n;
  const pair = (p: string) =>
    p
      .split('-')
      .map((x) => `${x}.`)
      .join(' ve ');
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: task.parts.map((p) => `${p.part}. bölüm`),
    groupCaption: 'Bölümler',
    rows: traces.map((t) => {
      const it = task.items[t.index];
      return {
        group: it.part - 1,
        shown: `${it.part}. bölüm`,
        status: t.status,
        given: `${pair(t.response as string)} şekil`,
        // "İki ayna görüntüsü" yazılmaz: seçilmeyen iki şeklin doğru olduğunu ele verirdi (aynı sorular gelir).
        tags: t.lure === 'half' ? ['bir doğru şekil, bir ayna görüntüsü'] : [],
        rtMs: t.rtMs,
        rapid: !!t.rapid,
      };
    }),
    timed: true,
    rapid: {
      ms: ROTATION3D_RAPID_MS,
      label: `çok hızlı: ${secLimit(ROTATION3D_RAPID_MS)} sn altı`,
    },
  });
  const accuracy = measureCard({
    key: 'dogru',
    title: 'Doğru sayısı',
    ...blockBadge(c, 'ud_dogru'),
    text: [
      'Her soruda iki doğru şekil seçilir; ikisi birden bulunursa soru doğru sayılır.',
      'Bir doğru şekil ile bir ayna görüntüsü seçilirse soru yanlış sayılır.',
      'Dört seçenekten iki şekil seçmenin altı yolu vardır; rastgele seçen biri ortalama her altı sorudan birini bulur.',
    ].join(' '),
    note: 'Çubuk bütün soruları gösterir; parçalar iki doğru, bir doğru bir ayna ve iki ayna seçilen sorulardır.',
    visual: stackOf('Seçilen şekiller', [
      { label: 'İki doğru şekil', value: r.correct },
      { label: 'Bir doğru, bir ayna', value: r.half },
      { label: 'İki ayna görüntüsü', value: r.none },
    ]),
    spoken: [`İki doğru şekil: ${sayCount(r.correct)}. Bir doğru, bir ayna: ${sayCount(r.half)}. İki ayna görüntüsü: ${sayCount(r.none)}.`],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik süre',
          badge: `Tipik ${secShort(r.medianRt)}`,
          text: [medianText('soru', 'sorunun ekrana gelmesinden cevabın verilmesine kadar'), 'Şekli zihinde çevirmek zaman alır.'].join(' '),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Sorulardaki cevap süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secShort(r.medianRt)}`,
            item: 'bir soru',
          }),
        });
  const low = r.correct <= ROTATION3D_CHANCE_MAX;
  const doubt = rotation3dRapid(r) || rotation3dSamePair(r);
  const chanceCard = check('sans', 'Şans düzeyi', low ? 'warn' : 'ok', {
    what: 'Rastgele seçen biri de birkaç soruyu doğru bulabilir. Doğrular bu kadar azsa sonuç tek başına yorumlanmaz.',
    result: low
      ? v(
          c,
          'Senin doğru cevapların bu sınırda kaldı; nedeni aşağıdaki denetimlerde ya da raporun başındaki uyarıda yazıyor.',
          'Çocuğunuzun doğru cevapları bu sınırda kaldı; nedeni aşağıdaki denetimlerde ya da raporun başındaki uyarıda yazıyor.',
        )
      : v(
          c,
          'Senin doğru cevapların rastgele seçimle beklenenin belirgin biçimde üstünde.',
          'Çocuğunuzun doğru cevapları rastgele seçimle beklenenin belirgin biçimde üstünde.',
        ),
    todo: retake(c, 'her şekli dikkatle çevirerek'),
    note: 'Kırmızı çizgi doğru sayısı; renkli bölge şansla da ulaşılabilecek bölge.',
    visual: countMeter('Doğru cevaplar', n, ROTATION3D_CHANCE_MAX, [{ label: 'Doğru', value: r.correct, valueLabel: `${r.correct} doğru` }], true),
    spoken: [`Doğru cevaplar: ${sayCount(r.correct)}.`, `Şansla da ulaşılabilecek bölge: ${ROTATION3D_CHANCE_MAX} ya da daha az.`],
  });
  const mirror = rotation3dMirrorPick(r) && !doubt;
  // Sık görüldü ama çok hızlı cevaplar ya da aynı yere basmak da açıklayabiliyor: bu denetim ayrıca yapılmaz.
  const mirrorCard = check('ayna', 'İki ayna görüntüsü', mirror ? 'warn' : rotation3dMirrorPick(r) ? 'none' : 'ok', {
    what: 'İki ayna görüntüsünün birden seçilmesi rastgele seçimde de arada bir olur. Çok sık olursa yönerge ters anlaşılmış ya da şeklin derinliği ters görülmüş olabilir.',
    result: mirror
      ? v(c, 'Senin cevaplarında bu sık görüldü; sonuç dikkatle okunmalı.', 'Çocuğunuzun cevaplarında bu sık görüldü; sonuç dikkatle okunmalı.')
      : rotation3dMirrorPick(r)
        ? 'Bu sık görüldü, ama çok hızlı cevaplar ya da aynı yere basmak da açıklayabildiği için bu denetim ayrıca yapılmadı.'
        : v(c, 'Senin cevaplarında bu sınırın altında kaldı.', 'Çocuğunuzun cevaplarında bu sınırın altında kaldı.'),
    todo: v(c, 'Yeniden çözersen yönergedeki örneğe bir kez daha bak.', 'Yeniden çözerse yönergedeki örneğe bir kez daha bakmasını önerebilirsiniz.'),
    note: 'Kırmızı çizgi iki ayna seçilen soru sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter('İki ayna seçilen sorular', n, ROTATION3D_MIRROR_NOTE, [{ label: 'İki ayna', value: r.none, valueLabel: `${r.none} soru` }]),
    spoken: [`İki ayna görüntüsü seçilen sorular: ${sayCount(r.none)}.`, `Uyarı sınırı: ${ROTATION3D_MIRROR_NOTE} soru.`],
  });
  const halfPick = rotation3dHalfPick(r);
  // Kuralın iki yolu var (lib/scoring/tasks.ts, rotation3dHalfPick): soruların en az 18'inde bir doğru, bir ayna seçilmesi ya da
  // seçilen 40 şeklin en az 25'inin döndürülmüş şekil olması. Grafik kararı veren yolu gösterir.
  const halfCond = low && (r.figures >= ROTATION3D_FIGURES_ABOVE || r.half >= ROTATION3D_HALF_SYSTEMATIC);
  // Doğrular çoksa döndürülmüş şekillerin çok seçilmesi olağandır: o zaman grafik bir doğru, bir ayna seçilen soruları gösterir.
  const byFigures = halfCond && r.half < ROTATION3D_HALF_SYSTEMATIC;
  const halfCard = check('yarim', 'Hep bir doğru, bir ayna', halfPick ? 'warn' : halfCond ? 'none' : 'ok', {
    what: [
      `Doğrular azken soruların en az ${ROTATION3D_HALF_SYSTEMATIC} tanesinde bir doğru şekil ile bir ayna görüntüsü seçildiyse bu rastgele değildir.`,
      `Seçilen ${2 * n} şeklin en az ${ROTATION3D_FIGURES_ABOVE} tanesi döndürülmüş şekilse de böyledir; yönerge farklı anlaşılmış olabilir.`,
    ].join(' '),
    result: halfPick
      ? v(c, 'Senin cevaplarında bu görüldü; bu yüzden sonuç yorumlanmadı.', 'Çocuğunuzun cevaplarında bu görüldü; bu yüzden sonuç yorumlanmadı.')
      : halfCond
        ? 'Bu düzen görüldü, ama başka bir denetimde anlatılan durum da açıklayabildiği için bu denetim ayrıca yapılmadı.'
        : v(c, 'Senin cevaplarında böyle bir düzen görülmedi.', 'Çocuğunuzun cevaplarında böyle bir düzen görülmedi.'),
    todo: v(
      c,
      'Her soruda iki döndürülmüş şekil seçildiğini hatırlayarak yeniden çözebilirsin.',
      'Her soruda iki döndürülmüş şekil seçildiğini hatırlatarak yeniden çözmesini önerebilirsiniz.',
    ),
    note: byFigures
      ? 'Kırmızı çizgi seçilen döndürülmüş şekillerin sayısı; renkli bölge uyarı bölgesi.'
      : 'Kırmızı çizgi bir doğru, bir ayna seçilen soru sayısı; renkli bölge uyarı bölgesi.',
    visual: byFigures
      ? countMeter('Seçilen döndürülmüş şekiller', 2 * n, ROTATION3D_FIGURES_ABOVE, [
          { label: 'Döndürülmüş şekil', value: r.figures, valueLabel: `${r.figures} şekil` },
        ])
      : countMeter('Bir doğru, bir ayna', n, ROTATION3D_HALF_SYSTEMATIC, [
          {
            label: 'Bir doğru, bir ayna',
            value: r.half,
            valueLabel: `${r.half} soru`,
          },
        ]),
    spoken: [
      `Bir doğru, bir ayna seçilen sorular: ${sayCount(r.half)}. Seçilen döndürülmüş şekiller: ${sayCount(r.figures)}.`,
      `Uyarı sınırı: ${ROTATION3D_HALF_SYSTEMATIC} soru ya da ${ROTATION3D_FIGURES_ABOVE} şekil.`,
    ],
  });
  const rapid = rotation3dRapid(r);
  const need = Math.max(3, Math.ceil(n / 4));
  const rapidCard = !traces.some((t) => t.rtMs !== null)
    ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
        what: `${secLimit(ROTATION3D_RAPID_MS)} saniyeden kısa sürede verilen yanlış cevaplar sayılır.`,
        result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
      })
    : check('hizli', 'Çok hızlı yanlış cevaplar', rapid ? 'warn' : 'ok', {
        what: `${secLimit(ROTATION3D_RAPID_MS)} saniyeden kısa sürede verilen yanlış cevaplar sayılır. Beş şekle bakıp ikisini seçmek için bu süre yetmez.`,
        result: rapid
          ? v(
              c,
              'Senin cevaplarında bu sınıra ulaşıldı; bu sorularda şekillere bakmadan seçmiş olabilirsin.',
              'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorularda şekillere bakmadan seçmiş olabilir.',
            )
          : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
        todo: retake(c, 'her şekli çevirerek'),
        note: 'Kırmızı çizgi bu tür cevapların sayısı; renkli bölge uyarı bölgesi.',
        visual: countMeter('Çok hızlı yanlış cevaplar', n, need, [
          {
            label: 'Çok hızlı ve yanlış',
            value: r.rapid,
            valueLabel: `${r.rapid} soru`,
          },
        ]),
        spoken: [`Çok hızlı yanlış cevaplar: ${sayCount(r.rapid)}.`, `Uyarı sınırı: ${need} soru.`],
      });
  const same = rotation3dSamePair(r);
  const half = Math.ceil(n / 2);
  const sameCard = check('ayni-yer', 'Hep aynı yerdeki iki seçenek', same ? 'warn' : 'ok', {
    what: 'Doğru şekiller seçeneklerin farklı yerlerindedir. Cevapların yarısı ya da daha çoğu aynı iki yerdeyse ve doğrular çok değilse, bakmadan aynı yerlere basılmış olabilir.',
    result: same
      ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
      : v(c, 'Senin cevaplarında böyle bir yığılma yok.', 'Çocuğunuzun cevaplarında böyle bir yığılma yok.'),
    todo: retake(c, 'her soruya bakarak'),
    note: 'Kırmızı çizgi en sık seçilen yer çiftinin sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter(
      'Aynı yer çifti',
      n,
      half,
      [
        {
          label: 'En sık seçilen çift',
          value: r.samePair,
          valueLabel: `${r.samePair} cevap`,
        },
      ],
      false,
      same ? {} : { calm: true, warnLabel: 'Yarısı ya da çoğu' },
    ),
    spoken: [
      `En sık seçilen yer çifti: ${sayCount(r.samePair, 'cevap')}.`,
      `Uyarı sınırı: ${half}; doğrular ${ROTATION3D_SAME_MAX_CORRECT} ya da daha az olmalı.`,
    ],
  });
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(time ? [time] : [])],
    checks: [chanceCard, mirrorCard, halfCard, rapidCard, sameCard, timingCard(c, { noun: 'soru', measured: timedCount(traces), total: n })],
  };
}

/* ---------- Bakış açısı alma ---------- */

function perspectiveKind(c: Ctx, task: PerspectiveTask, r: PerspectiveResult): KindParts {
  const n = r.n;
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: [''],
    groupCaption: 'Sorular, testteki sırasıyla',
    rows: r.items.map((x) => {
      const status: ItemTrace['status'] = x.response === null ? 'skip' : x.error <= PA_CLOSE ? 'correct' : 'wrong';
      return {
        group: 0,
        shown: questionText(task.objects, task.items[x.index]),
        status,
        given: x.response === null ? null : sectorWords(x.response),
        // Uzak cevapta açı farkı ve hata türü yazılmaz: verilen yönle birlikte doğru yönü ele verirdi (aynı sorular gelir).
        // Türlerin sayısı "Belirli bir hata türü" denetimindedir.
        tags: status === 'correct' ? [`${dec1(x.error)}° fark`] : [],
        rtMs: x.rt,
        rapid: x.response !== null && x.rt !== null && x.rt < PA_RAPID_MS && x.error > 45,
      };
    }),
    timed: true,
    okLabel: 'doğru yöne yakın',
    wrongLabel: 'uzak',
    none: 'cevapsız',
    skipLabel: 'Cevap verilmedi',
  });
  const errors = r.items.map((x) => x.error);
  // Rozet ortalama hatayı söylüyorsa sesli okumada ikinci kez okunmaz.
  const hataBadge = blockBadge(c, 'ba_hata');
  const meanCard = measureCard({
    key: 'hata',
    title: 'Ortalama yön hatası',
    ...hataBadge,
    text: [
      'Her soruda gösterilen yön ile doğru yön arasındaki açı ölçülür; açı 0 ile 180 derece arasındadır.',
      'Ortalama yön hatası bu açıların ortalamasıdır; küçük olan daha isabetlidir.',
      'Cevapsız bir soru, rastgele bir yön gibi 90 derece sayılır.',
      'Rastgele gösterilen yönlerin ortalama hatası da 90 derecedir.',
    ].join(' '),
    note: 'Her nokta bir sorunun hatası; kırmızı çizgi ortalama, renkli bölge doğru yöne çok yakın cevaplar, kesikli çizgi rastgele düzeyi.',
    visual: {
      type: 'strip',
      label: 'Sorulardaki yön hataları',
      min: 0,
      max: 180,
      unit: '°',
      points: errors,
      marker: { value: r.meanError, label: `Ortalama ${dec1(r.meanError)}°` },
      zone: { from: 0, to: PA_CLOSE, label: 'Doğru yöne çok yakın' },
      reference: { value: 90, label: 'Rastgele: 90°' },
    },
    spoken: [
      ...(hataBadge.badge ? [] : [`Ortalama yön hatası: ${dec1(r.meanError)} derece.`]),
      `Doğru yöne çok yakın cevaplar: ${sayCount(r.close)}.`,
    ],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik süre',
          badge: `Tipik ${secShort(r.medianRt)}`,
          text: [medianText('soru', 'sorunun ekrana gelmesinden okun yerleştirilmesine kadar'), 'Kendini başka bir yerde hayal etmek zaman alır.'].join(' '),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Sorulardaki cevap süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secShort(r.medianRt)}`,
            item: 'bir soru',
          }),
        });
  const chance = perspectiveChance(r);
  // Ortalama hata rastgele düzeyindeyse ama yanlışlar belirli bir türde toplandıysa da "Dikkat": sonuç yine yorumlanmaz.
  const chanceCard = check('sans', 'Rastgele yönlerden ayrılma', chance || perspectivePatternHigh(r) ? 'warn' : 'ok', {
    what: 'Rastgele gösterilen yönlerin ortalama hatası 90 derece civarındadır. Ortalama hata rastgele düzeyinden belirgin biçimde ayrılmıyorsa sonuç tek başına yorumlanmaz.',
    result: chance
      ? v(
          c,
          'Senin gösterdiğin yönler rastgele yönlerden belirgin biçimde ayrılmadı; bu yüzden sonuç yorumlanmadı.',
          'Çocuğunuzun gösterdiği yönler rastgele yönlerden belirgin biçimde ayrılmadı; bu yüzden sonuç yorumlanmadı.',
        )
      : perspectivePatternHigh(r)
        ? v(
            c,
            'Ortalama hata rastgele düzeyinden ayrılmıyor. Yanlışlar belirli bir türde toplandığı için bu, rastgele seçime bağlanmadı; bir sonraki denetime bak.',
            'Ortalama hata rastgele düzeyinden ayrılmıyor. Yanlışlar belirli bir türde toplandığı için bu, rastgele seçime bağlanmadı; bir sonraki denetime bakın.',
          )
        : v(
            c,
            'Senin gösterdiğin yönler rastgele yönlerden belirgin biçimde daha isabetli.',
            'Çocuğunuzun gösterdiği yönler rastgele yönlerden belirgin biçimde daha isabetli.',
          ),
    todo: retake(c, 'yönergedeki örneğe yeniden bakarak'),
    note: 'Kırmızı çizgi ortalama hata; renkli bölge rastgele düzeyinden ayrılmayan bölge.',
    visual: {
      type: 'meter',
      label: 'Ortalama yön hatası',
      min: 0,
      max: 180,
      // Kural "65 dereceden çok": sınırın kendisi "Uygun" bölgede kalır.
      zones: [
        { from: 0, to: PA_CHANCE_MEAN + 1e-6, label: 'Uygun', warn: false },
        { from: PA_CHANCE_MEAN + 1e-6, to: 180, label: 'Dikkat', warn: true },
      ],
      rows: [
        {
          label: 'Ortalama hata',
          value: r.meanError,
          valueLabel: `${dec1(r.meanError)}°`,
        },
      ],
    },
    spoken: [`Ortalama yön hatası: ${dec1(r.meanError)} derece.`, `Uyarı sınırı: ${PA_CHANCE_MEAN} dereceden çok.`],
  });
  const pattern = perspectivePatternHigh(r);
  const patternCard = check('tur', 'Belirli bir hata türü', pattern ? 'warn' : 'ok', {
    what: 'Bazı yanlışlar belirli bir türde toplanır: haritaya yukarıdan bakar gibi yön göstermek, sağ ile solu karıştırmak ya da tam ters yönü göstermek. Bir tür birkaç soruda görülürse rastlantı pek açıklamaz.',
    result: pattern
      ? v(
          c,
          'Senin yanlışların belirli bir türde toplandı; yönerge farklı anlaşılmış olabileceği için ortalama hata yorumlanmadı.',
          'Çocuğunuzun yanlışları belirli bir türde toplandı; yönerge farklı anlaşılmış olabileceği için ortalama hata yorumlanmadı.',
        )
      : v(c, 'Senin cevaplarında ortalamayı açıklayan bir hata türü öne çıkmadı.', 'Çocuğunuzun cevaplarında ortalamayı açıklayan bir hata türü öne çıkmadı.'),
    todo: retake(c, 'kendini haritadaki yere koyarak'),
    note: 'Kırmızı çizgiler her türün soru sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter('Hata türleri', n, PA_PATTERN_MIN, [
      {
        label: 'Haritaya göre yön',
        value: r.ego.count,
        valueLabel: `${r.ego.count} soru`,
      },
      {
        label: 'Sağ ile sol karışık',
        value: r.mirror.count,
        valueLabel: `${r.mirror.count} soru`,
      },
      {
        label: 'Tam ters yön',
        value: r.opposite.count,
        valueLabel: `${r.opposite.count} soru`,
      },
    ]),
    spoken: [
      `Haritaya göre yön: ${sayCount(r.ego.count)}. Sağ ile sol karışık: ${sayCount(r.mirror.count)}. Tam ters yön: ${sayCount(r.opposite.count)}.`,
      `Uyarı sınırı: ${PA_PATTERN_MIN} soru.`,
    ],
  });
  const timed = r.items.some((x) => x.rt !== null);
  const need = Math.max(3, Math.ceil(n / 4));
  const rapidCard = !timed
    ? check('hizli', 'Çok hızlı ve çok hatalı cevaplar', 'none', {
        what: `${secLimit(PA_RAPID_MS)} saniyeden kısa sürede gösterilen ve 45 dereceden çok hatalı yönler sayılır.`,
        result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
      })
    : check('hizli', 'Çok hızlı ve çok hatalı cevaplar', perspectiveRapid(r) ? 'warn' : 'ok', {
        what: `${secLimit(PA_RAPID_MS)} saniyeden kısa sürede gösterilen ve 45 dereceden çok hatalı yönler sayılır. Soruyu okuyup oku yerleştirmek için bu süre yetmez.`,
        result: perspectiveRapid(r)
          ? v(
              c,
              'Senin cevaplarında bu sınıra ulaşıldı; bu sorularda düşünmeden cevap vermiş olabilirsin.',
              'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorularda düşünmeden cevap vermiş olabilir.',
            )
          : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
        todo: retake(c),
        note: 'Kırmızı çizgi bu tür cevapların sayısı; renkli bölge uyarı bölgesi.',
        visual: countMeter('Çok hızlı ve çok hatalı', n, need, [
          {
            label: 'Çok hızlı ve hatalı',
            value: r.rapid,
            valueLabel: `${r.rapid} soru`,
          },
        ]),
        spoken: [`Çok hızlı ve çok hatalı cevaplar: ${sayCount(r.rapid)}.`, `Uyarı sınırı: ${need} soru.`],
      });
  const sameCard = check('ayni-yon', 'Hep aynı yön', perspectiveSameDir(r) ? 'warn' : 'ok', {
    what: 'Her soruda doğru yön farklıdır. Birçok soruda hemen hemen aynı yön gösterilirse sorulara bakılmadan cevap verilmiş olabilir.',
    result: perspectiveSameDir(r)
      ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
      : v(c, 'Senin cevaplarında böyle bir yığılma yok.', 'Çocuğunuzun cevaplarında böyle bir yığılma yok.'),
    todo: retake(c, 'her soruya bakarak'),
    note: 'Kırmızı çizgi birbirine çok yakın yönlerin en kalabalık grubu; renkli bölge uyarı bölgesi.',
    visual: countMeter('Birbirine çok yakın yönler', n, PA_SAME_DIR, [
      {
        label: 'En kalabalık grup',
        value: r.sameDir,
        valueLabel: `${r.sameDir} soru`,
      },
    ]),
    spoken: [`Birbirine çok yakın yönler: ${sayCount(r.sameDir, 'soru')}.`, `Uyarı sınırı: ${PA_SAME_DIR} soru.`],
  });
  return {
    name: task.name,
    answers: [answers],
    levels: [meanCard, ...(time ? [time] : [])],
    checks: [
      chanceCard,
      patternCard,
      rapidCard,
      sameCard,
      timingCard(c, {
        noun: 'soru',
        measured: r.items.filter((x) => x.rt !== null).length,
        total: n,
      }),
    ],
  };
}

/* ---------- Zihinden hesaplama (dört bölüm) ---------- */

const OP = {
  add: { name: 'Toplama', sym: '+' },
  sub: { name: 'Çıkarma', sym: '−' },
  mul: { name: 'Çarpma', sym: '×' },
  div: { name: 'Bölme', sym: '÷' },
} as const;

function arithmeticKind(c: Ctx, tasks: MentalArithmeticTask[]): KindParts | null {
  const secs = tasks.flatMap((t) => {
    const key = {
      add: 'zh_toplama',
      sub: 'zh_cikarma',
      mul: 'zh_carpma',
      div: 'zh_bolme',
    }[t.op];
    const r = res<ArithSectionResult>(c, key);
    return r ? [{ task: t, r, key }] : [];
  });
  if (!secs.length) return null;
  // Bölüm adları cümle içinde küçük harfle, sonuncusundan önce "ve": "toplama, çıkarma ve bölme".
  const names = (xs: { task: MentalArithmeticTask }[]) => joinAnd(xs.map(({ task }) => lower(OP[task.op].name)));
  const inSections = (xs: { task: MentalArithmeticTask }[]) => `${cap(names(xs))} ${xs.length === 1 ? 'bölümünde' : 'bölümlerinde'}`;
  const answers: PartCard[] = secs.map(({ task, r }) => {
    const traces = c.traces[task.key] ?? [];
    if (!traces.length) {
      return measureCard({
        key: task.key,
        title: OP[task.op].name,
        badge: '0 işlem',
        text: v(c, 'Bu bölümde süre dolana kadar hiç cevap vermedin.', 'Bu bölümde süre dolana kadar hiç cevap verilmedi.'),
        visual: stackOf('Bölümdeki işlemler', [
          { label: 'Cevap verilen', value: 0 },
          { label: 'Gösterilmeyen', value: r.n },
        ]),
        spoken: ['Cevap verilen işlem: yok.'],
      });
    }
    return itemsCard(c, {
      key: task.key,
      title: OP[task.op].name,
      noun: 'işlem',
      groups: task.levels.map((_, i) => `${i + 1}.`),
      groupCaption: 'Düzeyler, kolaydan zora',
      rows: traces.map((t) => {
        const [a, b] = task.items[t.index];
        const level = Math.floor(t.index / task.perLevel) + 1;
        return {
          group: level - 1,
          shown: `${level}. düzey · ${a} ${OP[task.op].sym} ${b}`,
          status: t.status,
          given: t.response === null ? null : String(t.response),
          expected: t.status === 'correct' ? null : String(arithAnswer(task.op, task.items[t.index])),
          // "Öteki yanlışlar" bir tür değildir: etiketi yazılmaz.
          tags: t.lure && t.lure !== 'other' ? [lower(ARITH_ERROR_NAME[t.lure as keyof typeof ARITH_ERROR_NAME])] : [],
          rtMs: t.rtMs,
          rapid: !!t.rapid && t.status === 'wrong',
        };
      }),
      timed: true,
      rapid: {
        ms: ARITH_RAPID_MS,
        label: `çok hızlı: ${secLimit(ARITH_RAPID_MS)} sn altı`,
      },
      none: 'geçilen',
      skipLabel: '“Geç”',
      // İşlemin sonucu gösterilen işlemden hesaplanır; yanlış cevabın doğrusu yazılır.
      showKey: true,
    });
  });

  /* Düzeyler ve ölçüler: her bölümün düzeyleri, bölüm bölüm doğrular, doğruluk ve temel işlemlerde süre. */
  // Yorumlanmayan bölümde (çok az cevap, çok hızlı ve yanlış cevaplar) düzey vurgulanmaz ve grafiği olmaz.
  const levelCards: PartCard[] = secs.map(({ task, r }) => {
    const ok = arithRead(r);
    const levels: PartLevel[] = task.levels.map((name, i) => ({ label: `${i + 1}. düzey`, text: name, active: ok && r.reached === i + 1 }));
    const text = [
      `İşlemler kolaydan zora ${task.levels.length} düzeyde sırayla gelir; her düzeyde ${task.perLevel} işlem vardır.`,
      'Vurgulu düzey, cevap yazılan en zor düzeydir; geçilen işlemler ilerleme sayılmaz.',
    ].join(' ');
    if (!ok)
      return {
        key: `${task.key}-duzey`,
        title: `${OP[task.op].name} düzeyleri`,
        badge: 'Yorumlanmadı',
        text: `${text} Bu bölüm yorumlanmadı; nedeni “${QUALITY_TITLE}” bölümünde yazıyor.`,
        levels,
      };
    return {
      key: `${task.key}-duzey`,
      title: `${OP[task.op].name} düzeyleri`,
      badge: r.reached ? `${r.reached}. düzeye kadar` : 'Cevap yazılmadı',
      text,
      // Vurgulu düzey bir başarı düzeyi değil, cevap yazılan en zor düzeydir.
      activeLabel: 'Cevap yazılan en zor düzey',
      note: 'Grafikte her satır bir düzey; dolu kare doğru, boş kare doğru olmayan işlem.',
      visual: {
        type: 'dots',
        label: `${OP[task.op].name}: düzeylere göre doğrular`,
        rows: r.levels
          .filter((l) => l.attempted > 0)
          .map((l) => ({
            label: `${l.level}. düzey`,
            filled: l.correct,
            total: l.attempted,
            valueLabel: `${l.correct}/${l.attempted}`,
          })),
        legend: ['doğru', 'yanlış ya da geçilen'],
      },
      levels,
      spoken: r.levels
        .filter((l) => l.attempted > 0)
        .map((l) => `${l.level}. düzey: ${l.attempted} işlemden ${l.correct === 0 ? 'hiçbiri' : l.correct === 1 ? 'biri' : l.correct} doğru.`),
    };
  });
  const countCard = measureCard({
    key: 'dogru-islem',
    title: 'Doğru işlem sayısı',
    ...blockBadge(c, 'zh_genel'),
    text: [
      'Her bölüm kısa bir süre sürer; süre içinde doğru cevaplanan işlemler sayılır.',
      'Dakikada doğru, bu sayının bir dakikaya düşen payıdır; bölüm süre dolmadan biterse geçen süre kullanılır.',
      'Geçilen işlemler ve yanlış cevaplar puandan bir şey götürmez.',
    ].join(' '),
    note: 'Her satır bir bölüm; parçalar doğru, yanlış ve geçilen işlemlerdir.',
    visual: {
      type: 'blocks',
      label: 'Bölüm bölüm işlemler',
      rows: secs.map(({ task, r }) => ({
        label: OP[task.op].name,
        parts: [r.correct, r.wrong, r.skipped],
        valueLabel: `${r.correct}/${r.attempted}`,
      })),
      legend: ['doğru', 'yanlış', 'geçilen'],
    },
    spoken: secs.map(({ task, r }) => `${OP[task.op].name}: ${sayN(r.correct, 'doğru')}, ${sayN(r.wrong, 'yanlış')}, ${sayN(r.skipped, 'geçilen')}.`),
  });
  const accRows = secs.filter(({ r }) => r.answered > 0);
  const accCard = !accRows.length
    ? null
    : measureCard({
        key: 'dogruluk',
        title: 'Doğruluk',
        ...blockBadge(c, 'zh_dogruluk'),
        text: 'Doğruluk, cevap yazılan işlemlerin doğru olan payıdır; geçilen işlemler katılmaz. Hız ile doğruluk birlikte okunur: hızlı ama çok yanlışlı bir sonuç, yavaş ama doğru bir sonuçla aynı şeyi anlatmaz.',
        note: 'Her çubuk bir bölümde yazılan cevaplar; dolu kısım doğru olanlar.',
        visual: shareBars(
          'Yazılan cevaplarda doğru',
          accRows.map(({ task, r }) => ({
            label: OP[task.op].name,
            value: r.correct,
            max: r.answered,
          })),
        ),
        spoken: accRows.map(
          ({ task, r }) => `${OP[task.op].name}: ${r.answered} cevaptan ${r.correct === 0 ? 'hiçbiri' : r.correct === 1 ? 'biri' : r.correct} doğru.`,
        ),
      });
  const factRows = secs.filter(({ r }) => arithRead(r) && r.factMedianRt !== null);
  const factCard = factRows.length
    ? measureCard({
        key: 'temel-sure',
        title: 'Temel işlemlerde tipik süre',
        ...blockBadge(c, 'zh_hiz'),
        text: [
          'Temel işlemler, ilk düzeylerdeki kısa işlemlerdir: tek basamaklı toplama ve çıkarma ya da çarpım tablosu.',
          'Tipik süre, bu işlemlerdeki doğru cevapların sürelerinin ortasındaki değerdir.',
          'Yazmaya yetmeyecek kadar kısa süreler katılmaz.',
        ].join(' '),
        note: 'Her çubuk bir bölümün temel işlemlerindeki tipik süre.',
        visual: secBars(
          'Temel işlemlerde tipik süre',
          factRows.map(({ task, r }) => ({
            label: OP[task.op].name,
            ms: r.factMedianRt as number,
          })),
          1,
        ),
        spoken: factRows.map(({ task, r }) => `${OP[task.op].name}: ${secTag(r.factMedianRt as number)}.`),
      })
    : null;

  /* Denetimler: bölüm bölüm, uyarılarla aynı sınırlar (arithFew, arithRushed, arithManySkips, tavan). */
  const few = secs.filter(({ r }) => arithFew(r));
  const fewMax = Math.max(10, ...secs.map(({ r }) => r.answered));
  const fewCard = check('az-cevap', 'Cevap yazılan işlemler', few.length ? 'warn' : 'ok', {
    what: 'Bir bölümde çok az işleme cevap yazılırsa o bölüm yorumlanmaz; bölüm yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.',
    result: few.length
      ? `${inSections(few)} bu sınıra ulaşıldı; ${few.length === 1 ? 'o bölüm' : 'o bölümler'} yorumlanmadı.`
      : 'Her bölümde yeterince cevap yazıldı.',
    todo: retake(c, 'her bölümde süre bitene kadar çalışarak'),
    note: 'Kırmızı çizgiler bölümlerde yazılan cevap sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter(
      'Yazılan cevaplar',
      fewMax,
      ARITH_MIN_ANSWERED - 1,
      secs.map(({ task, r }) => ({
        label: OP[task.op].name,
        value: r.answered,
        valueLabel: `${r.answered} cevap`,
      })),
      true,
    ),
    spoken: [...secs.map(({ task, r }) => `${OP[task.op].name}: ${sayCount(r.answered, 'cevap')}.`), `Uyarı: ${ARITH_MIN_ANSWERED - 1} ya da daha az cevap.`],
  });
  const rushed = secs.filter(({ r }) => arithRushed(r));
  const withAnswers = secs.filter(({ r }) => r.answered > 0);
  const rushedCard = check('hizli', 'Çok hızlı yanlış cevaplar', !withAnswers.length ? 'none' : rushed.length ? 'warn' : 'ok', {
    what: [
      `Bir işlemi okuyup sonucu yazmak için ${secLimit(ARITH_RAPID_MS)} saniyeden kısa süre yetmez.`,
      'Bir bölümde cevapların yarısı ya da daha çoğu böyle kısa sürede ve yanlış verilmişse, doğruluk da yarının altındaysa bölüm yorumlanmaz.',
    ].join(' '),
    result: !withAnswers.length
      ? 'Hiç cevap yazılmadığı için bu denetim yapılamadı.'
      : rushed.length
        ? `${inSections(rushed)} tuşlara işleme bakmadan basılmış olabilir.`
        : 'Hiçbir bölümde bu görülmedi.',
    todo: retake(c, 'her işleme bakarak'),
    note: 'Kırmızı çizgiler çok hızlı ve yanlış cevapların yüzdesi; renkli bölge uyarı bölgesi.',
    ...(withAnswers.length
      ? {
          visual: shareMeter(
            'Çok hızlı ve yanlış cevaplar',
            [['≥', 50]],
            withAnswers.map(({ task, r }) => ({
              label: OP[task.op].name,
              value: (100 * r.rapidWrong) / r.answered,
              valueLabel: `%${Math.round((100 * r.rapidWrong) / r.answered)}`,
            })),
          ),
        }
      : {}),
    spoken: withAnswers.map(({ task, r }) => `${OP[task.op].name}: yüzde ${Math.round((100 * r.rapidWrong) / r.answered)}.`),
  });
  const readSecs = secs.filter(({ r }) => arithRead(r));
  const zero = readSecs.filter(({ r }) => r.correct === 0);
  const zeroCard = check('sifir', 'Hiç doğru cevap olmayan bölüm', !readSecs.length ? 'none' : zero.length ? 'warn' : 'ok', {
    what: 'Yorumlanan bir bölümde yazılan cevapların hiçbiri doğru değilse işlemin işareti karıştırılmış ya da yönerge anlaşılmamış olabilir.',
    result: !readSecs.length
      ? 'Yorumlanan bölüm olmadığı için bu denetim yapılamadı.'
      : zero.length
        ? `${inSections(zero)} bu görüldü.`
        : 'Yorumlanan her bölümde doğru cevap var.',
    todo: v(c, 'Yeniden çözersen her işlemin işaretine bak.', 'Yeniden çözerse her işlemin işaretine bakmasını önerebilirsiniz.'),
    note: 'Her çubuk bir bölümde yazılan cevaplar; dolu kısım doğru olanlar.',
    ...(readSecs.length
      ? {
          visual: shareBars(
            'Yorumlanan bölümlerde doğru',
            readSecs.map(({ task, r }) => ({
              label: OP[task.op].name,
              value: r.correct,
              max: r.answered,
            })),
          ),
        }
      : {}),
    spoken: readSecs.map(({ task, r }) => `${OP[task.op].name}: ${sayN(r.correct, 'doğru')}.`),
  });
  // Kural (arithManySkips): yorumlanan bölümde en az 4 işlem ve yazılan cevaplar kadar ya da daha çok geçilmiş. En az 4 işlemin
  // geçildiği bölümlerde grafik geçilenlerin payını gösterir (yarısı ya da daha çoğu "Dikkat"); öyle bölüm yoksa geçilen sayısını.
  const skips = readSecs.filter(({ r }) => arithManySkips(r));
  const skipHeavy = readSecs.filter(({ r }) => r.skipped >= 4);
  const skipCard = check('gecilen', 'Geçilen işlemler', !readSecs.length ? 'none' : skips.length ? 'warn' : 'ok', {
    what: '“Geç” demek zor bir işlemde süreyi korur. Bir bölümde en az 4 işlem ve yazılan cevaplar kadar ya da daha çok geçilirse bu ayrıca söylenir.',
    result: !readSecs.length
      ? 'Yorumlanan bölüm olmadığı için bu denetim yapılamadı.'
      : skips.length
        ? `${inSections(skips)} çok sayıda işlem geçildi.`
        : 'Yorumlanan hiçbir bölümde bu görülmedi.',
    todo: v(c, 'Yeniden çözersen bildiğin işlemleri geçmeden çözmeye çalış.', 'Yeniden çözerse bildiği işlemleri geçmeden çözmesini önerebilirsiniz.'),
    note: skipHeavy.length
      ? 'Kırmızı çizgiler en az 4 işlemin geçildiği bölümlerde geçilenlerin payı; renkli bölge uyarı bölgesi.'
      : 'Kırmızı çizgiler yorumlanan bölümlerde geçilen işlem sayısı; renkli bölge uyarı bölgesi.',
    visual: skipHeavy.length
      ? shareMeter(
          'Geçilen işlemlerin payı',
          [['≥', 50]],
          skipHeavy.map(({ task, r }) => ({
            label: OP[task.op].name,
            value: shareOf(r.skipped, r.skipped + r.answered),
            valueLabel: `${r.skipped} geçilen, ${r.answered} cevap`,
          })),
        )
      : countMeter(
          'Geçilen işlemler',
          10,
          4,
          readSecs.map(({ task, r }) => ({
            label: OP[task.op].name,
            value: r.skipped,
            valueLabel: `${r.skipped} işlem`,
          })),
        ),
    spoken: [
      ...readSecs.map(({ task, r }) => `${OP[task.op].name}: ${sayN(r.skipped, 'geçilen')}, ${sayN(r.answered, 'cevap')}.`),
      'Uyarı: en az 4 ve yazılan cevaplar kadar.',
    ],
  });
  // Tavan (lib/scoring/tasks.ts): işlemler süre dolmadan bitti, en çok 2 işlem geçildi ve en çok 4 işlem doğru değil.
  const top = readSecs.filter(({ r }) => r.ceiling);
  const finishedOnly = readSecs.filter(({ r }) => r.attempted === r.n && !r.ceiling);
  const topCard = check('tavan', 'Bölümün bitmesi', !readSecs.length ? 'none' : top.length ? 'warn' : 'ok', {
    what: [
      'Bir bölümün işlemleri süre dolmadan biterse doğru sayısı bölümdeki işlem sayısıyla sınırlı kalabilir.',
      'En çok 2 işlem geçildiyse ve en çok 4 işlem doğru değilse gerçek hız bundan da yüksek olabilir.',
    ].join(' '),
    result: !readSecs.length
      ? 'Yorumlanan bölüm olmadığı için bu denetim yapılamadı.'
      : [
          ...(top.length ? [`${inSections(top)} bu oldu.`] : []),
          ...(finishedOnly.length
            ? [`${inSections(finishedOnly)} işlemler süre dolmadan bitti; ama geçilen ya da doğru olmayan işlemler bu sınırı aştı.`]
            : []),
          ...(!top.length && !finishedOnly.length ? ['Yorumlanan hiçbir bölümde işlemler süreden önce bitmedi.'] : []),
        ].join(' '),
    note: 'Her çubuk bir bölümün işlemleri; dolu kısım gösterilenler.',
    visual: shareBars(
      'Gösterilen işlemler',
      secs.map(({ task, r }) => ({
        label: OP[task.op].name,
        value: r.attempted,
        max: r.n,
      })),
    ),
    spoken: secs.map(({ task, r }) => `${OP[task.op].name}: ${r.attempted}/${r.n} işlem gösterildi.`),
  });
  const all = secs.flatMap(({ task }) => c.traces[task.key] ?? []);
  return {
    name: 'Zihinden hesaplama',
    answers,
    levels: [...levelCards, countCard, ...(accCard ? [accCard] : []), ...(factCard ? [factCard] : [])],
    checks: [
      fewCard,
      rushedCard,
      zeroCard,
      skipCard,
      topCard,
      timingCard(c, {
        noun: 'işlem',
        measured: timedCount(all),
        total: all.length || 1,
      }),
    ],
  };
}

/* ---------- Sayı ve kutu dizileri ---------- */

function spanKind(c: Ctx, task: DigitSpanTask | SpatialSpanTask, key: string): KindParts | null {
  const r = res<SpanResult>(c, key);
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const digit = task.kind === 'digit_span';
  const unit = digit ? 'rakam' : 'kutu';
  const lengths = [...new Set(traces.map((t) => Number(t.kind)))].sort((a, b) => a - b);
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Diziler',
    noun: 'dizi',
    groups: lengths.map(String),
    groupCaption: `Dizideki ${unit} sayısı`,
    rows: traces.map((t) => {
      const { shown, given } = t.response as {
        shown: number[];
        given: number[];
      };
      const expected = digit && (task as DigitSpanTask).direction === 'backward' ? [...shown].reverse() : shown;
      return {
        group: lengths.indexOf(Number(t.kind)),
        shown: digit ? `${shown.length} rakam: ${shown.join(' ')}` : `${shown.length} kutuluk dizi`,
        status: t.status,
        given: digit ? (given.length ? given.join(' ') : null) : null,
        expected: digit && t.status !== 'correct' ? expected.join(' ') : null,
        rtMs: null,
      };
    }),
    timed: false,
    noTime: true,
    none: 'boş',
    skipLabel: 'Boş',
    // Dizi görevleri "yeniden çözmede alıştırma" türündedir (lib/compare/tasks.ts): doğru dizi yazılır.
    showKey: true,
  });
  const maxLength = task.startLength + task.sequences.length - 1;
  const ladder: LadderVisual = {
    type: 'ladder',
    label: task.name,
    rows: Array.from({ length: maxLength - task.startLength + 1 }, (_, i) => {
      const length = task.startLength + i;
      return {
        length,
        results: r.ladder.find((l) => l.length === length)?.results ?? [],
      };
    }),
    reached: r.span || null,
    unit,
  };
  const span = measureCard({
    key: 'aralik',
    title: 'En uzun dizi',
    ...blockBadge(c, key),
    text: [
      `Diziler kısadan uzuna gider; her uzunlukta iki dizi gösterilir.`,
      'Aynı uzunluktaki iki dizinin ikisi de yanlış olunca görev biter.',
      'En uzun dizi, en az birinin doğru tekrarlandığı en uzun uzunluktur.',
    ].join(' '),
    note: 'Her sütun bir uzunluk; dolu daire doğru, boş daire yanlış tekrarlanan dizi.',
    visual: ladder,
    // Rozet en uzun diziyi söylüyorsa ikinci kez okunmaz.
    spoken: r.span && c.block(key)?.headline ? undefined : [r.span ? `En uzun dizi: ${r.span} ${unit}.` : 'En kısa dizi de doğru tekrarlanmadı.'],
  });
  const first = r.ladder[0]?.results ?? [];
  const firstOk = first.filter(Boolean).length;
  const floor = check('en-kisa', 'En kısa diziler', r.span === 0 ? 'warn' : 'ok', {
    what: 'En kısa dizilerin ikisi de yanlış tekrarlanırsa dizi uzunluğu ölçülemez.',
    result:
      r.span === 0
        ? v(
            c,
            'Senin sonucunda bu oldu; bu yüzden dizi uzunluğu belirtilmedi. O an dikkatin dağılmış ya da görev sana yeni gelmiş olabilir.',
            'Çocuğunuzun sonucunda bu oldu; bu yüzden dizi uzunluğu belirtilmedi. O an dikkati dağılmış ya da görev ona yeni gelmiş olabilir.',
          )
        : v(c, 'En kısa dizilerden en az birini doğru tekrar ettin.', 'Çocuğunuz en kısa dizilerden en az birini doğru tekrar etti.'),
    todo: retake(c, 'yönergeyi yeniden okuyarak'),
    note: 'Kırmızı çizgi en kısa uzunlukta doğru tekrarlanan dizi sayısı; renkli bölge uyarı bölgesi.',
    visual: countMeter(
      'En kısa diziler',
      2,
      0,
      [
        {
          label: `${task.startLength} ${unit}`,
          value: firstOk,
          valueLabel: `${firstOk}/2 doğru`,
        },
      ],
      true,
    ),
    spoken: [`En kısa uzunlukta doğru dizi: ${sayCount(firstOk)}.`],
  });
  return {
    name: task.name,
    answers: [answers],
    levels: [span],
    checks: [floor],
  };
}

/* ---------- Ok görevi ---------- */

function flankerKind(c: Ctx, task: FlankerTask): KindParts | null {
  const r = res<FlankerResult>(c, 'attention');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const rows: BlockRow[] = quarters(traces.length).map(({ from, to }) => {
    const xs = traces.slice(from, to + 1);
    const ok = statusCount(xs, 'correct');
    const okRts = xs.filter((t) => t.status === 'correct').map((t) => t.rtMs as number);
    const m = okRts.length ? okRts.reduce((a, b) => a + b, 0) / okRts.length : null;
    const cond = (k: string) => xs.filter((t) => t.kind === k);
    const cOk = (k: string) => cond(k).filter((t) => t.status === 'correct').length;
    return {
      label: `${from + 1}–${to + 1}. denemeler`,
      parts: [ok, statusCount(xs, 'wrong'), statusCount(xs, 'early'), statusCount(xs, 'miss')],
      detail: `${counts([
        { n: ok, label: 'doğru' },
        { n: statusCount(xs, 'wrong'), label: 'yanlış' },
        { n: statusCount(xs, 'early'), label: 'çok erken' },
        { n: statusCount(xs, 'miss'), label: 'süre doldu' },
      ])}${m !== null ? ` · ortalama ${sec2(m)}` : ''}`,
      tags: [`aynı yön ${cOk('congruent')}/${cond('congruent').length}`, `farklı yön ${cOk('incongruent')}/${cond('incongruent').length}`],
    };
  });
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Denemeler, çeyrek çeyrek',
    badge: `${traces.length} deneme`,
    noun: 'çeyrek',
    legend: ['doğru', 'yanlış', 'çok erken', 'süre doldu'],
    rows,
  });
  const accuracy = measureCard({
    key: 'dogruluk',
    title: 'Doğruluk',
    ...blockBadge(c, 'attention'),
    text: [
      'Doğruluk, ortadaki okun yönünün doğru bildirildiği denemelerin payıdır.',
      'Çok erken basılan ve süresi dolan denemeler doğru sayılmaz.',
      'Oklar aynı ve farklı yöne bakarken ayrı ayrı hesaplanır.',
    ].join(' '),
    note: 'Her çubuk bir deneme türü; dolu kısım doğru cevapların payı.',
    visual: pctBars('Okların yönüne göre doğru cevaplar', [
      { label: 'Oklar aynı yöne bakarken', rate: r.accCongruent },
      { label: 'Oklar farklı yöne bakarken', rate: r.accIncongruent },
    ]),
    spoken: [`Oklar aynı yöne bakarken: ${pctText(r.accCongruent)}. Farklı yöne bakarken: ${pctText(r.accIncongruent)}.`],
  });
  const okRts = traces.filter((t) => t.status === 'correct').map((t) => t.rtMs as number);
  const time =
    r.meanRt === null || !okRts.length
      ? null
      : measureCard({
          key: 'sure',
          title: 'Ortalama tepki süresi',
          text: 'Tepki süresi, okların görünmesinden düğmeye basılmasına kadar geçen süredir. Ortalama yalnızca doğru cevaplardan hesaplanır.',
          note: 'Her nokta bir doğru cevabın süresi; kırmızı çizgi ortalama.',
          visual: stripOf({
            label: 'Doğru cevaplardaki tepki süreleri',
            rts: okRts,
            median: r.meanRt,
            marker: `Ortalama ${sec2(r.meanRt)}`,
            line: 'ortalama',
            item: 'bir doğru cevap',
            digits: 2,
          }),
          spoken: [`Ortalama tepki süresi: ${sec2(r.meanRt)}.`],
        });
  const n = r.n;
  const accLow = r.accuracy < TASK_QUALITY.flankerMinAcc;
  const early = r.anticipations / n > TASK_QUALITY.earlyShare;
  const late = r.timeouts / n > TASK_QUALITY.timeoutShare;
  const minAcc = Math.round(TASK_QUALITY.flankerMinAcc * 100);
  const checks = [
    check('dogruluk', 'Doğruluk', accLow ? 'warn' : 'ok', {
      what: 'İki düğmeli bu görevde rastgele basan biri de denemelerin yarısını bulur. Doğruluk bunun az üstündeyse yönerge anlaşılmamış olabilir.',
      result: accLow
        ? v(c, 'Senin doğruluğun bu sınırın altında kaldı.', 'Çocuğunuzun doğruluğu bu sınırın altında kaldı.')
        : v(c, 'Senin doğruluğun bu sınırın üstünde.', 'Çocuğunuzun doğruluğu bu sınırın üstünde.'),
      todo: retake(c, 'yalnızca ortadaki oka bakarak'),
      note: 'Kırmızı çizgi doğruluk yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Doğruluk',
        [['<', minAcc]],
        [
          {
            label: 'Doğru cevaplar',
            value: pctExact(r.accuracy),
            valueLabel: pctText(r.accuracy),
          },
        ],
      ),
      spoken: [`Doğruluk: ${pctText(r.accuracy)}.`, `Uyarı: yüzde ${minAcc}’ın altı.`],
    }),
    check('erken', 'Çok erken cevaplar', early ? 'warn' : 'ok', {
      what: 'Okların görünmesinden hemen sonra verilen cevaplar oklara bakmadan verilmiş sayılır. Denemelerin onda birinden çoğunda böyleyse “Dikkat” yazar.',
      result: early
        ? v(c, 'Senin cevaplarında bu sınır aşıldı.', 'Çocuğunuzun cevaplarında bu sınır aşıldı.')
        : v(c, 'Senin cevaplarında bu sınırın altında kaldı.', 'Çocuğunuzun cevaplarında bu sınırın altında kaldı.'),
      todo: retake(c, 'okların görünmesini bekleyerek'),
      note: 'Kırmızı çizgi çok erken cevapların yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Çok erken cevaplar',
        [['>', TASK_QUALITY.earlyShare * 100]],
        [
          {
            label: 'Çok erken',
            value: shareOf(r.anticipations, n),
            valueLabel: `${r.anticipations} deneme`,
          },
        ],
      ),
      spoken: [`Çok erken cevaplar: ${sayCount(r.anticipations)}.`],
    }),
    check('sure-doldu', 'Süre içinde verilmeyen cevaplar', late ? 'warn' : 'ok', {
      what: 'Denemelerin beşte birinden çoğunda süre içinde cevap verilmezse “Dikkat” yazar; dikkat dağılmış ya da görev yarıda bırakılmış olabilir.',
      result: late
        ? v(c, 'Senin cevaplarında bu sınır aşıldı.', 'Çocuğunuzun cevaplarında bu sınır aşıldı.')
        : v(c, 'Senin cevaplarında bu sınırın altında kaldı.', 'Çocuğunuzun cevaplarında bu sınırın altında kaldı.'),
      todo: retake(c, 'sessiz bir yerde'),
      note: 'Kırmızı çizgi süresi dolan denemelerin yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Süresi dolan denemeler',
        [['>', TASK_QUALITY.timeoutShare * 100]],
        [
          {
            label: 'Süre doldu',
            value: shareOf(r.timeouts, n),
            valueLabel: `${r.timeouts} deneme`,
          },
        ],
      ),
      spoken: [`Süresi dolan denemeler: ${sayCount(r.timeouts)}.`],
    }),
    timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(time ? [time] : [])],
    checks,
  };
}

/* ---------- Sembol eşleştirme ---------- */

function symbolKind(c: Ctx, task: SymbolMatchTask): KindParts | null {
  const r = res<SymbolResult>(c, 'speed');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const secs = Math.round(task.durationMs / 1000);
  const rows: BlockRow[] = quarters(traces.length).map(({ from, to }) => {
    const xs = traces.slice(from, to + 1);
    const ok = statusCount(xs, 'correct');
    const m = median(xs.flatMap((t) => (t.rtMs === null ? [] : [t.rtMs])));
    return {
      label: `${from + 1}–${to + 1}. semboller`,
      parts: [ok, xs.length - ok],
      detail: `${counts([
        { n: ok, label: 'doğru' },
        { n: xs.length - ok, label: 'hatalı' },
      ])}${m !== null ? ` · tipik ${secTag(m)}` : ''}`,
    };
  });
  const answers = traces.length
    ? blocksCard(c, {
        key: task.key,
        title: 'Eşleştirmeler, çeyrek çeyrek',
        badge: `${traces.length} sembol`,
        noun: 'çeyrek',
        of: 'sembol',
        legend: ['doğru', 'hatalı'],
        rows,
      })
    : measureCard({
        key: task.key,
        title: 'Eşleştirmeler',
        badge: 'Cevap verilmedi',
        text: v(c, `${secs} saniye boyunca hiç sembol eşleştirmedin.`, `${secs} saniye boyunca hiç sembol eşleştirilmedi.`),
        visual: stackOf('Eşleştirilen semboller', [
          { label: 'Doğru', value: 0 },
          { label: 'Hatalı', value: 0 },
        ]),
        spoken: ['Eşleştirilen sembol: yok.'],
      });
  const count = measureCard({
    key: 'dogru',
    title: 'Doğru eşleştirme',
    ...blockBadge(c, 'speed'),
    text: [
      `Görev ${secs} saniye sürer; bu sürede doğru eşleştirilen semboller sayılır.`,
      'Dakikada doğru eşleştirme, bu sayının bir dakikaya düşen payıdır.',
      'Hatalı eşleştirmeler sayılmaz ama doğrulukla birlikte okunur.',
    ].join(' '),
    note: 'Çubuk eşleştirilen bütün sembolleri gösterir; parçalar doğru ve hatalı eşleştirmelerdir.',
    visual: stackOf('Eşleştirilen semboller', [
      { label: 'Doğru', value: r.correct },
      { label: 'Hatalı', value: r.errors },
    ]),
    spoken: [`Doğru: ${sayCount(r.correct)}. Hatalı: ${sayCount(r.errors)}. Dakikada ${dec1(r.perMinute)} doğru.`],
  });
  const few = r.attempted < TASK_QUALITY.symbolFew;
  const accLow = !few && r.accuracy < TASK_QUALITY.symbolMinAcc;
  const minAcc = Math.round(TASK_QUALITY.symbolMinAcc * 100);
  const checks = [
    check('az', 'Cevap sayısı', few ? 'warn' : 'ok', {
      what: 'Süre boyunca çok az sembol eşleştirilirse görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.',
      result: few
        ? r.attempted === 0
          ? v(c, 'Bu görevde hiç cevap vermedin; görevin sonucu yorumlanmadı.', 'Bu görevde hiç cevap verilmedi; görevin sonucu yorumlanmadı.')
          : v(c, 'Senin cevap sayın bu sınırın altında kaldı.', 'Çocuğunuzun cevap sayısı bu sınırın altında kaldı.')
        : v(c, 'Yeterince cevap verdin.', 'Yeterince cevap verildi.'),
      todo: retake(c, 'süre bitene kadar çalışarak'),
      note: 'Kırmızı çizgi eşleştirilen sembol sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter(
        'Eşleştirilen semboller',
        Math.max(20, r.attempted),
        TASK_QUALITY.symbolFew - 1,
        [
          {
            label: 'Eşleştirilen',
            value: r.attempted,
            valueLabel: `${r.attempted} sembol`,
          },
        ],
        true,
      ),
      spoken: [`Eşleştirilen semboller: ${sayCount(r.attempted)}.`, `Uyarı: ${TASK_QUALITY.symbolFew - 1} ya da daha az.`],
    }),
    check('dogruluk', 'Doğruluk', few ? 'none' : accLow ? 'warn' : 'ok', {
      what: 'Hatalı eşleştirmeler çoksa hızdan çok doğruluğa odaklanmak gerekebilir.',
      result: few
        ? 'Çok az cevap olduğu için bu denetim yapılmadı.'
        : accLow
          ? v(c, 'Senin doğruluğun bu sınırın altında kaldı.', 'Çocuğunuzun doğruluğu bu sınırın altında kaldı.')
          : v(c, 'Senin doğruluğun bu sınırın üstünde.', 'Çocuğunuzun doğruluğu bu sınırın üstünde.'),
      todo: v(
        c,
        'Yeniden yaparsan acele etmeden, doğru eşleştirmeye odaklan.',
        'Yeniden yaparsa acele etmeden, doğru eşleştirmeye odaklanmasını önerebilirsiniz.',
      ),
      note: 'Kırmızı çizgi doğruluk yüzdesi; renkli bölge uyarı bölgesi.',
      ...(r.attempted
        ? {
            visual: shareMeter(
              'Doğruluk',
              [['<', minAcc]],
              [
                {
                  label: 'Doğru eşleştirme',
                  value: pctExact(r.accuracy),
                  valueLabel: pctText(r.accuracy),
                },
              ],
            ),
          }
        : {}),
      spoken: r.attempted ? [`Doğruluk: ${pctText(r.accuracy)}.`, `Uyarı: yüzde ${minAcc}’in altı.`] : [],
    }),
    ...(traces.length
      ? [
          timingCard(c, {
            noun: 'sembol',
            measured: timedCount(traces),
            total: traces.length,
          }),
        ]
      : []),
  ];
  return { name: task.name, answers: [answers], levels: [count], checks };
}

/* ---------- Harf işaretleme ---------- */

function cancellationKind(c: Ctx, task: CancellationTask): KindParts | null {
  const r = res<CancellationResult>(c, 'tempo');
  if (!r) return null;
  const n = task.rows * task.columns;
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Bölüm bölüm işaretler',
    badge: `${r.sections.length} bölüm`,
    noun: 'bölüm',
    of: 'aranan harf',
    totalOf: 2,
    note: 'Her satır bir bölüm. Çubukta bulunan ve atlanan aranan harfler ile başka harflere konan yanlış işaretler var. Sağdaki sayıda önce bulunan, sonra bütün aranan harfler yazar.',
    legend: ['bulunan', 'atlanan', 'yanlış işaret'],
    rows: r.sections.map((s, i) => ({
      label: `${i + 1}. bölüm`,
      parts: [s.hits, s.omissions, s.commissions],
      detail: `${s.processed} harf tarandı; ${counts([
        { n: s.hits, label: 'bulunan' },
        { n: s.omissions, label: 'atlanan' },
        { n: s.commissions, label: 'yanlış işaret' },
      ])}`,
      tags: [...(s.strays ? [`taranan kısmın ötesinde ${s.strays} işaret`] : []), ...(s.processed > n - task.columns ? ['son satıra ulaşıldı'] : [])],
    })),
  });
  const few = r.hits < CANCELLATION_FEW_HITS;
  const tempo = measureCard({
    key: 'tempo',
    title: 'Dakikada taranan harf',
    ...blockBadge(c, 'tempo'),
    text: [
      'Taranan kısım, sayfanın başından kesintisiz çalışmanın son işaretine kadardır.',
      'Dakikada taranan harf, bu kısımdaki harflerin bölüm sürelerine bölünmesiyle bulunur.',
      'Çok ilerideki tek tük dokunuşlar taranan kısmı uzatmaz.',
    ].join(' '),
    note: 'Her sütun bir bölümde dakikada taranan harf.',
    visual: {
      type: 'columns',
      label: 'Bölüm bölüm dakikada taranan harf',
      rows: r.sections.map((s, i) => {
        const pm = Math.round(s.processed / (s.ms / 60_000));
        return { label: `${i + 1}.`, value: pm, valueLabel: String(pm) };
      }),
      max: Math.max(1, ...r.sections.map((s) => s.processed / (s.ms / 60_000))),
      caption: 'Bölümler',
    } satisfies ColumnsVisual,
    spoken: r.sections.map((s, i) => `${i + 1}. bölüm: dakikada ${Math.round(s.processed / (s.ms / 60_000))} harf.`),
  });
  const isabet = measureCard({
    key: 'isabet',
    title: 'Bulma oranı',
    ...blockBadge(c, 'isabet'),
    text: 'Bulma oranı, taranan kısımdaki aranan harflerin işaretlenen payıdır. Yanlış işaretler ayrıca sayılır; aranmayan harflere dokunmak bulma oranını yükseltmez ama net doğruyu düşürür.',
    note: 'Çubuk taranan kısımdaki aranan harfleri gösterir; parçalar bulunan ve atlanan harflerdir.',
    visual: stackOf('Aranan harfler', [
      { label: 'Bulunan', value: r.hits },
      { label: 'Atlanan', value: r.omissions },
    ]),
    spoken: [`Bulunan: ${sayCount(r.hits)}. Atlanan: ${sayCount(r.omissions)}. Yanlış işaret: ${sayCount(r.commissions)}.`],
  });
  const sustain = measureCard({
    key: 'surdurme',
    title: 'Dikkati sürdürme',
    ...blockBadge(c, 'surdurme'),
    text: [
      'Net doğru, bulunan harflerden yanlış işaretlerin çıkarılmasıyla bulunur.',
      'Sürdürme, ikinci yarıdaki bölümlerin dakikadaki net doğrusunun ilk yarıyla karşılaştırılmasıdır.',
      // lib/reports/build.ts: SUSTAIN_THRESHOLD (%15) ve sustainClear.
      'Fark %15’ten küçükse ya da ölçümün kendi oynaklığını aşmıyorsa “belirgin değişim yok” denir.',
    ].join(' '),
    note: 'Her sütun bir bölümün net doğrusu.',
    visual: {
      type: 'columns',
      label: 'Bölüm bölüm net doğru',
      rows: r.sections.map((s, i) => ({
        label: `${i + 1}.`,
        value: Math.max(0, s.net),
        valueLabel: String(s.net),
      })),
      max: Math.max(1, ...r.sections.map((s) => s.net)),
      caption: 'Bölümler',
    },
    spoken: r.sections.map((s, i) => `${i + 1}. bölüm: ${s.net} net doğru.`),
  });
  const comm = !few && r.commissions > r.hits;
  const lowHit = !few && !comm && r.hitRate < TASK_QUALITY.cancellationMinHitRate;
  const checks = [
    check('az', 'İşaretlenen harfler', few ? 'warn' : 'ok', {
      what: 'Çok az harf işaretlenirse görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir; o zaman hiçbir sonuç yorumlanmaz.',
      result: few
        ? v(c, 'Senin işaretlerin bu sınırın altında kaldı.', 'İşaretler bu sınırın altında kaldı.')
        : v(c, 'Yeterince harf işaretledin.', 'Yeterince harf işaretlendi.'),
      todo: retake(c, 'her bölümde süre bitene kadar çalışarak'),
      note: 'Kırmızı çizgi bulunan harf sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter(
        'Bulunan harfler',
        Math.max(40, r.hits),
        CANCELLATION_FEW_HITS - 1,
        [{ label: 'Bulunan', value: r.hits, valueLabel: `${r.hits} harf` }],
        true,
      ),
      spoken: [`Bulunan harfler: ${sayCount(r.hits)}.`, `Uyarı: ${CANCELLATION_FEW_HITS - 1} ya da daha az.`],
    }),
    check('yanlis', 'Yanlış işaretler', few ? 'none' : comm ? 'warn' : 'ok', {
      what: 'Yanlış işaretler doğru işaretlerden fazlaysa harflere bakmadan dokunulmuş olabilir; bulma oranı o zaman tek başına bir şey söylemez.',
      result: few
        ? 'Çok az işaret olduğu için bu denetim yapılmadı.'
        : comm
          ? v(c, 'Senin işaretlerinde bu görüldü.', 'İşaretlerde bu görüldü.')
          : v(c, 'Doğru işaretlerin yanlışlardan fazla.', 'Doğru işaretler yanlışlardan fazla.'),
      todo: retake(c, 'harf harf bakarak'),
      note: 'Çubuklar doğru ve yanlış işaretlerin sayısı.',
      visual: {
        type: 'bars',
        label: 'Doğru ve yanlış işaretler',
        scale: 'scale',
        rows: [
          { label: 'Doğru işaret', value: r.hits, valueLabel: String(r.hits) },
          {
            label: 'Yanlış işaret',
            value: r.commissions,
            valueLabel: String(r.commissions),
          },
        ],
      },
      spoken: [`Doğru işaret: ${sayCount(r.hits)}. Yanlış işaret: ${sayCount(r.commissions)}.`],
    }),
    check('bulma', 'Bulma oranı', few || comm ? 'none' : lowHit ? 'warn' : 'ok', {
      what: 'Taranan satırlardaki aranan harflerin yarısından azı bulunursa satırlar atlanmış ya da çok hızlı gidilmiş olabilir.',
      result:
        few || comm
          ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
          : lowHit
            ? v(c, 'Senin bulma oranın bu sınırın altında kaldı.', 'Bulma oranı bu sınırın altında kaldı.')
            : v(c, 'Senin bulma oranın bu sınırın üstünde.', 'Bulma oranı bu sınırın üstünde.'),
      todo: v(c, 'Yeniden yaparsan satır satır ilerle.', 'Yeniden yaparsa satır satır ilerlemesini önerebilirsiniz.'),
      note: 'Kırmızı çizgi bulma yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Bulma oranı',
        [['<', TASK_QUALITY.cancellationMinHitRate * 100]],
        [
          {
            label: 'Bulunan',
            value: pctExact(r.hitRate),
            valueLabel: pctText(r.hitRate),
          },
        ],
      ),
      spoken: [`Bulma oranı: ${pctText(r.hitRate)}.`],
    }),
    check('tavan', 'Son satır', r.ceiling ? 'warn' : 'ok', {
      what: 'Bir bölümde sayfanın son satırına ulaşılırsa sayfa kısa kalmıştır; çalışma hızı olduğundan düşük görünebilir.',
      result: r.ceiling ? v(c, 'En az bir bölümde son satıra ulaştın.', 'En az bir bölümde son satıra ulaşıldı.') : 'Hiçbir bölümde son satıra ulaşılmadı.',
      note: 'Her çubuk bir bölümün sayfası; dolu kısım taranan harfler.',
      visual: shareBars(
        'Taranan harfler',
        r.sections.map((s, i) => ({
          label: `${i + 1}. bölüm`,
          value: s.processed,
          max: n,
        })),
      ),
      spoken: r.sections.map((s, i) => `${i + 1}. bölüm: ${s.processed}/${n} harf tarandı.`),
    }),
  ];
  checks.push(timingCard(c, { noun: 'bölüm', measured: r.sections.length, total: r.sections.length }));
  return {
    name: task.name,
    answers: [answers],
    levels: [tempo, isabet, sustain],
    checks,
  };
}

/* ---------- Renk-kelime ---------- */

function colorWordKind(c: Ctx, task: ColorWordTask): KindParts | null {
  const r = res<ColorWordResult>(c, 'renk_dogruluk');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const size = Math.ceil(traces.length / task.blocks);
  const rows: BlockRow[] = Array.from({ length: task.blocks }, (_, b) => {
    const xs = traces.slice(b * size, (b + 1) * size);
    const ok = statusCount(xs, 'correct');
    const word = xs.filter((t) => t.lure === 'word').length;
    const other = xs.filter((t) => t.lure === 'other').length;
    const none = statusCount(xs, 'miss') + statusCount(xs, 'early');
    const m = median(xs.filter((t) => t.status === 'correct').map((t) => t.rtMs as number));
    return {
      label: `${b + 1}. bölüm`,
      parts: [ok, word, other, none],
      detail: `${counts([
        { n: ok, label: 'doğru' },
        { n: word, label: 'kelimeye basıldı' },
        { n: other, label: 'başka renk' },
        { n: none, label: 'cevapsız ya da erken' },
      ])}${m !== null ? ` · tipik ${sec2(m)}` : ''}`,
    };
  }).filter((x) => x.parts.some((p) => p > 0));
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Denemeler, bölüm bölüm',
    badge: `${traces.length} deneme`,
    noun: 'bölüm',
    legend: ['doğru', 'kelimeye basıldı', 'başka renk', 'cevapsız ya da erken'],
    rows,
  });
  const accuracy = measureCard({
    key: 'dogruluk',
    title: 'Doğruluk',
    ...blockBadge(c, 'renk_dogruluk'),
    text: [
      'Doğruluk, yazının renginin doğru bildirildiği denemelerin payıdır.',
      'Kelime ile rengin aynı ve farklı olduğu denemeler ayrı ayrı hesaplanır.',
      'Süresi dolan ve çok erken cevaplar doğru sayılmaz.',
    ].join(' '),
    note: 'Her çubuk bir deneme türü; dolu kısım doğru cevapların payı.',
    visual: pctBars('Deneme türüne göre doğru cevaplar', [
      { label: 'Kelime ve renk aynıyken', rate: r.accCongruent },
      { label: 'Kelime ve renk farklıyken', rate: r.accIncongruent },
    ]),
    spoken: [`Kelime ve renk aynıyken: ${pctText(r.accCongruent)}. Farklıyken: ${pctText(r.accIncongruent)}.`],
  });
  const effect =
    r.medianRtCongruent !== null && r.medianRtIncongruent !== null
      ? measureCard({
          key: 'etki',
          title: 'Tipik süre ve renk-kelime etkisi',
          ...blockBadge(c, 'renk_etki'),
          text: [
            'Tipik süre, doğru cevapların sürelerinin ortasındaki değerdir.',
            'Renk-kelime etkisi, kelime ile renk farklıyken geçen tipik süreden aynıyken geçen tipik sürenin çıkarılmasıyla bulunur.',
            'Okumak çok alışılmış bir iş olduğu için kelimeyi görmezden gelmek biraz zaman alır.',
          ].join(' '),
          note: 'Çubuklar iki deneme türündeki tipik süre.',
          visual: secBars('Deneme türüne göre tipik süre', [
            { label: 'Kelime ve renk aynıyken', ms: r.medianRtCongruent },
            { label: 'Kelime ve renk farklıyken', ms: r.medianRtIncongruent },
          ]),
          spoken: [`Aynıyken: ${sec2(r.medianRtCongruent)}. Farklıyken: ${sec2(r.medianRtIncongruent)}.`],
        })
      : null;
  const n = r.n;
  const mm = n > 0 && r.accuracy < TASK_QUALITY.colorWordMinAcc && colorWordMostlyMissed(r);
  // Görev çoğunlukla cevapsız ya da erken kaldıysa sınırı aşan denetim yine "Dikkat" der ve ilk denetime gönderir.
  const said = 'Bu, yukarıdaki “Cevapsız ve erken denemeler” denetiminde söylendi.';
  const skipped = 'Denemelerin çoğu cevapsız ya da erken kaldığı için bu denetim ayrıca yapılmadı.';
  const minAcc = Math.round(TASK_QUALITY.colorWordMinAcc * 100);
  const checks = [
    check('yarida', 'Cevapsız ve erken denemeler', mm ? 'warn' : 'ok', {
      what: 'Doğruluk düşük ve doğru olmayan cevapların çoğu süre aşımı ya da çok erken basışsa görev yarıda bırakılmış olabilir; görev yorumlanmaz.',
      result: mm
        ? v(c, 'Senin denemelerinde bu görüldü.', 'Çocuğunuzun denemelerinde bu görüldü.')
        : v(c, 'Senin denemelerinde bu görülmedi.', 'Çocuğunuzun denemelerinde bu görülmedi.'),
      todo: retake(c, 'sessiz bir yerde'),
      note: 'Çubuk bütün denemeleri gösterir; parçalar doğru, yanlış ve cevapsız ya da erken denemelerdir.',
      visual: stackOf('Denemeler', [
        { label: 'Doğru', value: r.correct },
        {
          label: 'Yanlış',
          value: n - r.correct - r.timeouts - r.anticipations,
        },
        { label: 'Cevapsız ya da erken', value: r.timeouts + r.anticipations },
      ]),
      spoken: [`Doğru: ${sayCount(r.correct)}. Cevapsız ya da erken: ${sayCount(r.timeouts + r.anticipations)}.`],
    }),
    check('renk-denemesi', 'Renk denemesi', mm ? 'none' : r.checkFlag ? 'warn' : 'ok', {
      what: 'Görevin başında renkli şeritlerle kısa bir renk denemesi yapılır. Bunda sık yanılınca renkler bu ekranda karışmış olabilir.',
      result: mm ? skipped : r.checkFlag ? v(c, 'Renk denemesinde bu sınıra ulaşıldı.', 'Renk denemesinde bu sınıra ulaşıldı.') : 'Renk denemesi uygun geçti.',
      todo: v(c, 'Ekranın parlaklığını artırıp yeniden deneyebilirsin.', 'Ekranın parlaklığını artırıp yeniden denemesini önerebilirsiniz.'),
      note: 'Kırmızı çizgi renk denemesindeki yanlışlar; renkli bölge uyarı bölgesi.',
      visual: countMeter('Renk denemesindeki yanlışlar', r.checkTrials, task.checkLimit, [
        {
          label: 'Yanlış',
          value: r.checkErrors,
          valueLabel: `${r.checkErrors}/${r.checkTrials}`,
        },
      ]),
      spoken: [`Renk denemesinde yanlış: ${sayCount(r.checkErrors)}.`, `Uyarı sınırı: ${task.checkLimit}.`],
    }),
    check('dogruluk', 'Doğruluk', r.accuracy < TASK_QUALITY.colorWordMinAcc ? 'warn' : 'ok', {
      what: 'Dört düğmeli bu görevde doğruluk çok düşükse yönerge anlaşılmamış, rastgele basılmış ya da renkler ayırt edilememiş olabilir.',
      result: mm
        ? said
        : r.accuracy < TASK_QUALITY.colorWordMinAcc
          ? v(c, 'Senin doğruluğun bu sınırın altında kaldı.', 'Çocuğunuzun doğruluğu bu sınırın altında kaldı.')
          : v(c, 'Senin doğruluğun bu sınırın üstünde.', 'Çocuğunuzun doğruluğu bu sınırın üstünde.'),
      todo: retake(c, 'yalnızca yazının rengine bakarak'),
      note: 'Kırmızı çizgi doğruluk yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Doğruluk',
        [['<', minAcc]],
        [
          {
            label: 'Doğru cevaplar',
            value: pctExact(r.accuracy),
            valueLabel: pctText(r.accuracy),
          },
        ],
      ),
      spoken: [`Doğruluk: ${pctText(r.accuracy)}.`],
    }),
    check(
      'baska-renk',
      'Başka renge basılan hatalar',
      mm || r.accuracy < TASK_QUALITY.colorWordMinAcc || r.checkFlag ? 'none' : r.otherErrors >= TASK_QUALITY.colorWordOtherErrors ? 'warn' : 'ok',
      {
        what: 'Ne yazının rengine ne de kelimeye basılan hatalar çoksa renkler karışmış ya da düğmelere yanlışlıkla basılmış olabilir.',
        result:
          mm || r.accuracy < TASK_QUALITY.colorWordMinAcc || r.checkFlag
            ? 'Yukarıdaki denetimler nedeniyle bu denetim ayrıca yapılmadı.'
            : r.otherErrors >= TASK_QUALITY.colorWordOtherErrors
              ? v(c, 'Senin hatalarında bu sınıra ulaşıldı.', 'Çocuğunuzun hatalarında bu sınıra ulaşıldı.')
              : 'Bu tür hatalar sınırın altında.',
        todo: v(c, 'Yeniden yaparsan düğmelerin yerine bir kez daha bak.', 'Yeniden yaparsa düğmelerin yerine bir kez daha bakmasını önerebilirsiniz.'),
        note: 'Kırmızı çizgi bu tür hataların sayısı; renkli bölge uyarı bölgesi.',
        visual: countMeter('Başka renge basılan', Math.max(12, r.otherErrors), TASK_QUALITY.colorWordOtherErrors, [
          {
            label: 'Başka renk',
            value: r.otherErrors,
            valueLabel: `${r.otherErrors} deneme`,
          },
        ]),
        spoken: [`Başka renge basılan hatalar: ${sayCount(r.otherErrors)}.`, `Uyarı sınırı: ${TASK_QUALITY.colorWordOtherErrors}.`],
      },
    ),
    check('erken', 'Çok erken cevaplar', r.anticipations / n > TASK_QUALITY.earlyShare ? 'warn' : 'ok', {
      what: 'Kelimenin görünmesinden hemen sonra verilen cevaplar kelimeye bakmadan verilmiş sayılır. Denemelerin onda birinden çoğunda böyleyse “Dikkat” yazar.',
      result: !(r.anticipations / n > TASK_QUALITY.earlyShare)
        ? 'Bu sınırın altında kaldı.'
        : mm
          ? said
          : r.anticipations / n > TASK_QUALITY.earlyShare
            ? v(c, 'Senin cevaplarında bu sınır aşıldı.', 'Çocuğunuzun cevaplarında bu sınır aşıldı.')
            : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'kelimenin görünmesini bekleyerek'),
      note: 'Kırmızı çizgi çok erken cevapların yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Çok erken cevaplar',
        [['>', TASK_QUALITY.earlyShare * 100]],
        [
          {
            label: 'Çok erken',
            value: shareOf(r.anticipations, n),
            valueLabel: `${r.anticipations} deneme`,
          },
        ],
      ),
      spoken: [`Çok erken cevaplar: ${sayCount(r.anticipations)}.`],
    }),
    check('sure-doldu', 'Süre içinde verilmeyen cevaplar', r.timeouts / n > TASK_QUALITY.timeoutShare ? 'warn' : 'ok', {
      what: 'Denemelerin beşte birinden çoğunda süre içinde cevap verilmezse “Dikkat” yazar.',
      result: !(r.timeouts / n > TASK_QUALITY.timeoutShare)
        ? 'Bu sınırın altında kaldı.'
        : mm
          ? said
          : r.timeouts / n > TASK_QUALITY.timeoutShare
            ? v(c, 'Senin cevaplarında bu sınır aşıldı.', 'Çocuğunuzun cevaplarında bu sınır aşıldı.')
            : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'sessiz bir yerde'),
      note: 'Kırmızı çizgi süresi dolan denemelerin yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Süresi dolan denemeler',
        [['>', TASK_QUALITY.timeoutShare * 100]],
        [
          {
            label: 'Süre doldu',
            value: shareOf(r.timeouts, n),
            valueLabel: `${r.timeouts} deneme`,
          },
        ],
      ),
      spoken: [`Süresi dolan denemeler: ${sayCount(r.timeouts)}.`],
    }),
    timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(effect ? [effect] : [])],
    checks,
  };
}

/* ---------- Dur-git ---------- */

function goNoGoKind(c: Ctx, task: GoNoGoTask): KindParts | null {
  const r = res<GoNoGoResult>(c, 'dg_durma');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const size = Math.ceil(traces.length / task.blocks);
  const rows: BlockRow[] = Array.from({ length: task.blocks }, (_, b) => {
    const xs = traces.slice(b * size, (b + 1) * size);
    const go = xs.filter((t) => t.kind === 'go');
    const stop = xs.filter((t) => t.kind === 'stop');
    const hits = go.filter((t) => t.status === 'correct').length;
    const stops = stop.filter((t) => t.status === 'correct').length;
    return {
      label: `${b + 1}. bölüm`,
      parts: [hits + stops, statusCount(go, 'miss'), statusCount(go, 'early'), stop.length - stops],
      detail: `Bas harfleri: ${hits}/${go.length} zamanında; X: ${stops}/${stop.length} durdu`,
      tags: [...(statusCount(go, 'early') ? [`${statusCount(go, 'early')} erken basış`] : [])],
    };
  }).filter((x) => x.parts.some((p) => p > 0));
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Denemeler, bölüm bölüm',
    badge: `${traces.length} deneme`,
    noun: 'bölüm',
    legend: ['doğru', 'kaçırılan basış', 'erken basış', 'X’te basış'],
    rows,
  });
  const stopCard = measureCard({
    key: 'durma',
    title: 'Durma oranı',
    ...blockBadge(c, 'dg_durma'),
    text: 'Durma oranı, X harflerinden basılmadan geçilenlerin payıdır. Basma alışkanlığı oluştuğu için durmak çaba ister.',
    note: 'Çubuk bütün X harflerini gösterir; parçalar durulan ve basılan harflerdir.',
    visual: stackOf('X harfleri', [
      { label: 'Durdu', value: r.stopTrials - r.commissions },
      { label: 'Basıldı', value: r.commissions },
    ]),
    spoken: [`X harflerinde durdu: ${sayCount(r.stopTrials - r.commissions)}. Basıldı: ${sayCount(r.commissions)}.`],
  });
  const hitCard = measureCard({
    key: 'basma',
    title: 'Zamanında basma',
    ...blockBadge(c, 'dg_tepki'),
    text: 'Zamanında basma oranı, bas harflerinden süre içinde basılanların payıdır. Harf görünür görünmez yapılan basışlar harfe bakmadan yapılmış sayılır.',
    note: 'Çubuk bütün bas harflerini gösterir; parçalar zamanında, kaçırılan ve erken basışlardır.',
    visual: stackOf('Bas harfleri', [
      { label: 'Zamanında', value: r.hits },
      { label: 'Kaçırılan', value: r.omissions },
      { label: 'Erken', value: r.anticipations },
    ]),
    spoken: [`Zamanında: ${sayCount(r.hits)}. Kaçırılan: ${sayCount(r.omissions)}. Erken: ${sayCount(r.anticipations)}.`],
  });
  const dgHiz = blockBadge(c, 'dg_hiz');
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik tepki süresi',
          ...dgHiz,
          text: medianText('basış', 'harfin görünmesinden düğmeye basılmasına kadar'),
          note: 'Her nokta bir zamanında basışın süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Zamanında basışların süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${sec2(r.medianRt)}`,
            item: 'bir basış',
            digits: 2,
          }),
          // Rozet tipik süreyi söylüyorsa ikinci kez okunmaz.
          spoken: dgHiz.badge ? undefined : [`Tipik tepki süresi: ${sec2(r.medianRt)}.`],
        });
  const none = r.hits === 0 && r.anticipations === 0;
  const lowHit = !none && r.hitRate < TASK_QUALITY.goMinHitRate;
  const goMin = TASK_QUALITY.goMinHitRate * 100;
  const checks = [
    check('basma', 'Bas harflerinde basış', none || lowHit ? 'warn' : 'ok', {
      what: 'Bas harflerinin yarısından çoğunda zamanında basılmazsa görev yarıda bırakılmış, yönerge anlaşılmamış ya da sürekli erken basılmış olabilir.',
      result:
        none || lowHit
          ? v(c, 'Senin basışlarında bu görüldü.', 'Çocuğunuzun basışlarında bu görüldü.')
          : v(c, 'Bas harflerinin çoğunda zamanında bastın.', 'Çocuğunuz bas harflerinin çoğunda zamanında bastı.'),
      todo: retake(c, 'harfi görünce basarak'),
      note: 'Kırmızı çizgi zamanında basma yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Zamanında basma',
        [['<', goMin]],
        [
          {
            label: 'Zamanında',
            value: pctExact(r.hitRate),
            valueLabel: pctText(r.hitRate),
          },
        ],
      ),
      spoken: [`Zamanında basma: ${pctText(r.hitRate)}.`],
    }),
    check('durma', 'X harflerinde durma', none || lowHit ? 'none' : r.stopRate < TASK_QUALITY.goMinStopRate ? 'warn' : 'ok', {
      what: 'X harflerinin çoğunda da basılırsa yönerge anlaşılmamış olabilir.',
      result:
        none || lowHit
          ? 'Bas harflerinde zamanında basış az olduğu için bu denetim ayrıca yapılmadı.'
          : r.stopRate < TASK_QUALITY.goMinStopRate
            ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
            : 'X harflerinde durma bu sınırın üstünde.',
      todo: retake(c, 'X harfini görünce durarak'),
      note: 'Kırmızı çizgi durma yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Durma oranı',
        [['<', TASK_QUALITY.goMinStopRate * 100]],
        [
          {
            label: 'Durulan',
            value: pctExact(r.stopRate),
            valueLabel: pctText(r.stopRate),
          },
        ],
      ),
      spoken: [`Durma oranı: ${pctText(r.stopRate)}.`],
    }),
    check(
      'erken',
      'Çok erken basışlar',
      r.hitRate < TASK_QUALITY.goMinHitRate ? 'none' : r.anticipations / r.goTrials > TASK_QUALITY.earlyShare ? 'warn' : 'ok',
      {
        what: 'Harf görünür görünmez yapılan basışlar harfe bakmadan yapılmış sayılır. Bas harflerinin onda birinden çoğunda böyleyse “Dikkat” yazar.',
        result:
          r.hitRate < TASK_QUALITY.goMinHitRate
            ? 'Bas harflerinde zamanında basış az olduğu için bu denetim ayrıca yapılmadı.'
            : r.anticipations / r.goTrials > TASK_QUALITY.earlyShare
              ? v(c, 'Senin basışlarında bu sınır aşıldı.', 'Çocuğunuzun basışlarında bu sınır aşıldı.')
              : 'Bu sınırın altında kaldı.',
        todo: retake(c, 'harfi bekleyerek'),
        note: 'Kırmızı çizgi erken basışların yüzdesi; renkli bölge uyarı bölgesi.',
        visual: shareMeter(
          'Erken basışlar',
          [['>', TASK_QUALITY.earlyShare * 100]],
          [
            {
              label: 'Erken',
              value: shareOf(r.anticipations, r.goTrials),
              valueLabel: `${r.anticipations} basış`,
            },
          ],
        ),
        spoken: [`Erken basışlar: ${sayCount(r.anticipations)}.`],
      },
    ),
    timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [stopCard, hitCard, ...(time ? [time] : [])],
    checks,
  };
}

/* ---------- Sırayla birleştirme ---------- */

function trailKind(c: Ctx, task: TrailTask): KindParts | null {
  const r = res<TrailResult>(c, 'iz_a');
  if (!r) return null;
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Bölümler',
    badge: `${r.parts.length} bölüm`,
    noun: 'bölüm',
    of: 'daire',
    legend: ['birleştirilen daire', 'kalan daire'],
    rows: r.parts.map((p) => ({
      label: task.parts[p.index].name,
      parts: [p.reached, p.n - p.reached],
      detail: p.completed ? `Tamamlama süresi ${secShort(p.timeMs)}` : `Süre doldu; ${p.reached}/${p.n} daire birleştirildi`,
      tags: [p.errors ? `${p.errors} yanlış dokunuş` : 'yanlış dokunuş yok'],
    })),
  });
  const done = r.parts.filter((p) => p.completed);
  const times = !done.length
    ? null
    : measureCard({
        key: 'sure',
        title: 'Bölüm süreleri',
        text: [
          'Bölüm süresi, ilk daireden son daireye kadar geçen süredir; yanlış dokunuşlar süreyi uzatır.',
          'İkinci bölümde sayılar ile harfler arasında geçiş gerekir.',
          'İkinci bölümün süresinin birinciye oranı, bu geçişin ne kadar zaman aldığını gösterir.',
        ].join(' '),
        note: 'Çubuklar tamamlanan bölümlerin süresi.',
        visual: secBars(
          'Bölüm süreleri',
          done.map((p) => ({ label: task.parts[p.index].name, ms: p.timeMs })),
          1,
        ),
        spoken: done.map((p) => `${task.parts[p.index].name}: ${secShort(p.timeMs)}.`),
      });
  const incomplete = r.parts.filter((p) => !p.completed);
  const manyErr = r.parts.filter((p) => p.completed && p.errors > p.n);
  const checks = [
    check('tamam', 'Bölümlerin tamamlanması', incomplete.length ? 'warn' : 'ok', {
      what: 'Bir bölüm süre dolmadan tamamlanmazsa o bölümün süresi yorumlanmaz.',
      result: incomplete.length ? `${incomplete.map((p) => task.parts[p.index].name).join(', ')} süre dolmadan tamamlanamadı.` : 'İki bölüm de tamamlandı.',
      todo: retake(c, 'dairelere sırayla dokunarak'),
      note: 'Her çubuk bir bölümün daireleri; dolu kısım birleştirilenler.',
      visual: shareBars(
        'Birleştirilen daireler',
        r.parts.map((p) => ({
          label: task.parts[p.index].name,
          value: p.reached,
          max: p.n,
        })),
      ),
      spoken: r.parts.map((p) => `${task.parts[p.index].name}: ${p.reached}/${p.n} daire birleştirildi.`),
    }),
    check('yanlis', 'Yanlış dokunuşlar', manyErr.length ? 'warn' : 'ok', {
      what: 'Tamamlanan bir bölümde daire sayısından çok yanlış dokunuş varsa dairelere sırayı izlemeden dokunulmuş olabilir.',
      result: manyErr.length ? `${manyErr.map((p) => task.parts[p.index].name).join(', ')} bölümünde bu görüldü.` : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'sıradaki daireyi bulup ona dokunarak'),
      note: 'Kırmızı çizgiler bölümlerdeki yanlış dokunuş sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter(
        'Yanlış dokunuşlar',
        Math.max(2 * r.parts[0].n, ...r.parts.map((p) => p.errors)),
        r.parts[0].n + 1,
        r.parts.map((p) => ({
          label: task.parts[p.index].name,
          value: p.errors,
          valueLabel: `${p.errors} dokunuş`,
        })),
      ),
      spoken: r.parts.map((p) => `${task.parts[p.index].name}: ${sayCount(p.errors, 'yanlış dokunuş')}.`),
    }),
  ];
  checks.push(timingCard(c, { noun: 'bölüm', measured: r.parts.length, total: r.parts.length }));
  return {
    name: task.name,
    answers: [answers],
    levels: times ? [times] : [],
    checks,
  };
}

/* ---------- Geriye dönük hatırlama ---------- */

function nBackKind(c: Ctx, task: NBackTask): KindParts | null {
  const r = res<NBackResult>(c, 'gh_bir');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  let at = 0;
  const rows: BlockRow[] = task.blocks.map((b, i) => {
    const xs = traces.slice(at, at + b.letters.length);
    at += b.letters.length;
    const targets = xs.filter((t) => t.kind === 'target');
    const hits = targets.filter((t) => t.status === 'correct').length;
    const fa = statusCount(xs, 'wrong');
    const ok = statusCount(xs, 'correct');
    return {
      label: `${i + 1}. bölüm (${b.n === 1 ? 'bir' : 'iki'} geri)`,
      parts: [ok, statusCount(xs, 'miss'), fa, statusCount(xs, 'early')],
      detail: `Aynı harfler: ${hits}/${targets.length} yakalandı; ${sayN(fa, 'yanlış basış')}`,
    };
  });
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Bölüm bölüm harfler',
    badge: `${traces.length} harf`,
    noun: 'bölüm',
    of: 'harf',
    legend: ['doğru', 'kaçırılan', 'yanlış basış', 'erken basış'],
    rows,
  });
  const score = (pr: number) => Math.max(0, Math.round(pr * 100));
  const prCard = measureCard({
    key: 'ayirt',
    title: 'Ayırt etme puanı',
    // Rozet yok: kart iki düzeyi birlikte anlatır (düzeylerin puanı grafikte). Hesabın kendisi raporun kartında da yazar.
    text: [
      'Puan, aynı harfleri yakalamanın aynı olmayan harflerde basmaktan ne kadar fazla olduğunu 100 üzerinden gösterir.',
      'Yanlış basmalar yakalamalardan çoksa puan eksiye düşmez, 0 yazılır.',
    ].join(' '),
    note: 'Her çubuk bir düzeyin ayırt etme puanı.',
    visual: {
      type: 'bars',
      label: 'Düzeylere göre ayırt etme puanı',
      scale: 'share',
      rows: r.levels.map((l) => ({
        label: `${l.n === 1 ? 'Bir' : 'İki'} geri`,
        value: score(l.pr),
        max: 100,
        valueLabel: String(score(l.pr)),
      })),
    },
    spoken: r.levels.map((l) => `${l.n === 1 ? 'Bir' : 'İki'} geri: ${score(l.pr)}.`),
  });
  const silentLevels = r.levels.filter(nBackSilent);
  const silentBlocks = r.blocks.filter((b) => nBackSilent(b) && !silentLevels.some((l) => l.n === b.n));
  const fa = r.levels.filter((l) => !nBackSilent(l) && l.falseAlarmRate > NBACK_RANDOM_FA);
  const two = r.levels.find((l) => l.n === 2);
  const kept = !!two && !nBackSilent(two) && two.falseAlarmRate <= NBACK_RANDOM_FA && nBackKeptOneBack(two);
  const checks = [
    check('sessiz', 'Hiç basılmayan bölümler', silentLevels.length || silentBlocks.length ? 'warn' : 'ok', {
      what: 'Bir bölümde hiç basılmazsa o bölüm yarıda bırakılmış ya da yönerge anlaşılmamış olabilir.',
      result:
        silentLevels.length || silentBlocks.length
          ? v(c, 'Senin bölümlerinden en az birinde hiç basılmadı.', 'Bölümlerden en az birinde hiç basılmadı.')
          : 'Her bölümde basış var.',
      todo: retake(c, 'her bölümde dikkatini harflerde tutarak'),
      note: 'Her çubuk bir bölümdeki basış sayısı.',
      visual: {
        type: 'bars',
        label: 'Bölüm bölüm basışlar',
        scale: 'scale',
        rows: r.blocks.map((b) => ({
          label: `${b.index + 1}. bölüm`,
          value: b.hits + b.falseAlarms,
          valueLabel: String(b.hits + b.falseAlarms),
        })),
      },
      spoken: r.blocks.map((b) => `${b.index + 1}. bölüm: ${sayCount(b.hits + b.falseAlarms, 'basış')}.`),
    }),
    check('yanlis', 'Aynı olmayan harflerde basış', fa.length ? 'warn' : 'ok', {
      what: 'Aynı olmayan harflerin yarısından çoğunda da basılırsa sonuç aynı harfleri ayırt edebilmeyi göstermez.',
      result: fa.length ? v(c, 'Senin basışlarında bu görüldü.', 'Çocuğunuzun basışlarında bu görüldü.') : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'yalnızca aynı harfte basarak'),
      note: 'Kırmızı çizgiler aynı olmayan harflerde basma yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Aynı olmayan harflerde basma',
        [['>', NBACK_RANDOM_FA * 100]],
        r.levels.map((l) => ({
          label: `${l.n === 1 ? 'Bir' : 'İki'} geri`,
          value: pctExact(l.falseAlarmRate),
          valueLabel: pctText(l.falseAlarmRate),
        })),
      ),
      spoken: r.levels.map((l) => `${l.n === 1 ? 'Bir' : 'İki'} geri: ${pctText(l.falseAlarmRate)}.`),
    }),
    ...(two && two.lures > 0
      ? [
          check('bir-geri', 'Bir geri kuralının sürmesi', kept ? 'warn' : 'ok', {
            what: 'İki geri bölümünde bir önceki harfle aynı harflerde sık basılıp iki önceki harfle aynı olanlar kaçırılırsa, bir geri kuralı sürdürülmüş olabilir.',
            result: kept ? v(c, 'Senin basışlarında bu görüldü.', 'Çocuğunuzun basışlarında bu görüldü.') : 'Bu düzen görülmedi.',
            todo: v(
              c,
              'Yeniden yaparsan iki geri bölümünde iki önceki harfe bak.',
              'Yeniden yaparsa iki geri bölümünde iki önceki harfe bakmasını hatırlatabilirsiniz.',
            ),
            note: 'Çubuklar iki geri bölümünde tuzak harflerde basma ve aynı harfleri yakalama yüzdesi.',
            visual: pctBars('İki geri bölümü', [
              {
                label: 'Bir önceki harfle aynı harflerde basma',
                rate: two.lureFalseAlarms / two.lures,
              },
              {
                label: 'İki önceki harfle aynı harfleri yakalama',
                rate: two.hitRate,
              },
            ]),
            spoken: [`Tuzak harflerde basma: ${pctText(two.lureFalseAlarms / two.lures)}. Aynı harfleri yakalama: ${pctText(two.hitRate)}.`],
          }),
        ]
      : []),
  ];
  checks.push(timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }));
  return { name: task.name, answers: [answers], levels: [prCard], checks };
}

/* ---------- Zihinde döndürme ---------- */

function rotationKind(c: Ctx, task: MentalRotationTask): KindParts | null {
  const r = res<RotationResult>(c, 'zd_dogruluk');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const size = Math.ceil(traces.length / task.blocks);
  const rows: BlockRow[] = Array.from({ length: task.blocks }, (_, b) => {
    const xs = traces.slice(b * size, (b + 1) * size);
    const ok = statusCount(xs, 'correct');
    return {
      label: `${b + 1}. bölüm`,
      parts: [ok, statusCount(xs, 'wrong'), statusCount(xs, 'miss'), statusCount(xs, 'early')],
      detail: counts([
        { n: ok, label: 'doğru' },
        { n: statusCount(xs, 'wrong'), label: 'yanlış' },
        { n: statusCount(xs, 'miss'), label: 'süre doldu' },
        { n: statusCount(xs, 'early'), label: 'çok erken' },
      ]),
    };
  }).filter((x) => x.parts.some((p) => p > 0));
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Denemeler, bölüm bölüm',
    badge: `${traces.length} deneme`,
    noun: 'bölüm',
    legend: ['doğru', 'yanlış', 'süre doldu', 'çok erken'],
    rows,
  });
  const accuracy = measureCard({
    key: 'dogruluk',
    title: 'Doğruluk',
    ...blockBadge(c, 'zd_dogruluk'),
    text: 'Doğruluk, “Aynı” ya da “Ayna görüntüsü” kararının doğru verildiği denemelerin payıdır. Süresi dolan ve çok erken cevaplar doğru sayılmaz.',
    note: 'Çubuk bütün denemeleri gösterir; parçalar doğru, yanlış, süresi dolan ve çok erken denemelerdir.',
    visual: stackOf('Denemeler', [
      { label: 'Doğru', value: r.correct },
      { label: 'Yanlış', value: r.sameSaidMirror + r.mirrorSaidSame },
      { label: 'Süre doldu', value: r.timeouts },
      { label: 'Çok erken', value: r.anticipations },
    ]),
    spoken: [
      `Doğru: ${sayCount(r.correct)}. Yanlış: ${sayCount(r.sameSaidMirror + r.mirrorSaidSame)}. Süre doldu: ${sayCount(r.timeouts)}. Çok erken: ${sayCount(r.anticipations)}.`,
    ],
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik karar süresi',
          ...blockBadge(c, 'zd_hiz'),
          text: [
            'Karar süresi, şekillerin görünmesinden düğmeye basılmasına kadar geçen süredir.',
            'Tipik süre, doğru bulunan “aynı” şekillerdeki sürelerin ortasındaki değerdir.',
            'Döndürme etkisi, çok döndürülmüş şekillerdeki tipik süreden az döndürülmüşlerdekinin çıkarılmasıyla bulunur.',
          ].join(' '),
          // Tipik süre yalnızca doğru bulunan "aynı" şekillerden hesaplanır (lib/scoring/tasks.ts, scoreRotation).
          note: 'Her nokta doğru bulunan bir “aynı” şeklin süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Doğru bulunan “aynı” şekillerin süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${sec2(r.medianRt)}`,
            item: 'doğru bir “aynı”',
            digits: 2,
          }),
        });
  const n = r.n;
  const status = rotationStatus(r);
  const kind = rotationMissedKind(r);
  const invalid = status === 'abandoned' || status === 'rushed' || status === 'invalid';
  const answered = r.correct + r.sameSaidMirror + r.mirrorSaidSame;
  const earlySaid = status === 'rushed' || status === 'invalid' || (status === 'missed' && kind !== 'timeouts');
  const lateSaid = invalid || (status === 'missed' && kind !== 'early');
  const skipped = 'Denemelerin çoğu cevapsız ya da çok erken kaldığı için bu denetim ayrıca yapılmadı.';
  // Sınırı aşan denetim, durumu daha önce bir denetim söylemiş olsa da "Dikkat" der ve o denetime gönderir.
  const saidIn = (card: string) => `Bu, yukarıdaki “${card}” denetiminde söylendi.`;
  const lateMany = r.timeouts / n > TASK_QUALITY.timeoutShare;
  const earlyMany = r.anticipations / n > TASK_QUALITY.earlyShare;
  const checks = [
    check('gecersiz', 'Cevapsız ve çok erken denemeler', invalid ? 'warn' : 'ok', {
      what: 'Denemelerin yarısından çoğunda süre dolar ya da şekiller görünür görünmez basılırsa görev yorumlanmaz.',
      result: invalid
        ? v(c, 'Senin denemelerinde bu görüldü; görevin sonucu yorumlanmadı.', 'Çocuğunuzun denemelerinde bu görüldü; görevin sonucu yorumlanmadı.')
        : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'şekillere bakarak'),
      note: 'Kırmızı çizgiler süresi dolan ve çok erken denemelerin yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Cevapsız ve çok erken',
        [['>', 50]],
        [
          {
            label: 'Süre doldu',
            value: shareOf(r.timeouts, n),
            valueLabel: `${r.timeouts} deneme`,
          },
          {
            label: 'Çok erken',
            value: shareOf(r.anticipations, n),
            valueLabel: `${r.anticipations} deneme`,
          },
          {
            label: 'İkisi birlikte',
            value: shareOf(r.timeouts + r.anticipations, n),
            valueLabel: `${r.timeouts + r.anticipations} deneme`,
          },
        ],
      ),
      spoken: [`Süre doldu: ${sayCount(r.timeouts)}. Çok erken: ${sayCount(r.anticipations)}.`],
    }),
    check(
      'sans',
      'Cevap verilen denemelerde doğruluk',
      invalid || answered < ROTATION_MIN_ANSWERED ? 'none' : status === 'reversed' || status === 'chance' ? 'warn' : 'ok',
      {
        what: 'İki düğmeli bu görevde rastgele basan biri de cevapların yarısını bulur. Cevap verilen denemelerin yarıya yakını ya da çoğu yanlışsa düğmeler karışmış ya da rastgele basılmış olabilir.',
        result: invalid
          ? skipped
          : answered < ROTATION_MIN_ANSWERED
            ? 'Cevap verilen deneme çok az olduğu için bu denetim yapılamadı.'
            : status === 'reversed'
              ? 'Cevap verilen denemelerin çoğu yanlış: “Aynı” ile “Ayna görüntüsü” düğmeleri karışmış olabilir.'
              : status === 'chance'
                ? 'Cevap verilen denemelerin yarıya yakını doğru: rastgele basmaktan ayırt edilemiyor.'
                : 'Cevap verilen denemelerde doğruluk bu sınırın üstünde.',
        todo: retake(c, 'yönergedeki örneğe yeniden bakarak'),
        note: 'Kırmızı çizgi cevap verilen denemelerde doğruluk; renkli bölge uyarı bölgesi.',
        ...(answered
          ? {
              visual: shareMeter(
                'Cevap verilenlerde doğruluk',
                [['<', 60]],
                [
                  {
                    label: 'Doğru',
                    value: shareOf(r.correct, answered),
                    valueLabel: `%${Math.round(shareOf(r.correct, answered))}`,
                  },
                ],
              ),
            }
          : {}),
        spoken: answered ? [`Cevap verilen denemelerde doğruluk: yüzde ${Math.round(shareOf(r.correct, answered))}.`] : [],
      },
    ),
    check('kacan', 'Doğru sayılmayan denemeler', invalid ? 'none' : status === 'missed' ? 'warn' : 'ok', {
      what: 'Cevap verilen denemelerin çoğu doğru olsa da süre aşımları ya da çok erken basışlar doğru sayısını düşürebilir.',
      result: invalid
        ? skipped
        : status === 'missed'
          ? v(c, 'Senin sonucunda doğru cevaplar bu yüzden az.', 'Çocuğunuzun sonucunda doğru cevaplar bu yüzden az.')
          : 'Bu durum görülmedi.',
      todo: retake(c, 'acele etmeden ama süreyi kaçırmadan'),
      note: 'Çubuk bütün denemeleri gösterir; parçalar doğru, yanlış, süresi dolan ve çok erken denemelerdir.',
      visual: stackOf('Denemeler', [
        { label: 'Doğru', value: r.correct },
        { label: 'Yanlış', value: answered - r.correct },
        { label: 'Süre doldu', value: r.timeouts },
        { label: 'Çok erken', value: r.anticipations },
      ]),
      spoken: [`Doğru: ${sayCount(r.correct)}. Süre doldu: ${sayCount(r.timeouts)}. Çok erken: ${sayCount(r.anticipations)}.`],
    }),
    check(
      'ayni-dugme',
      'Aynı düğme',
      invalid || r.sameShare === null ? 'none' : r.sameShare > TASK_QUALITY.oneButton || r.sameShare < TASK_QUALITY.oneButtonLow ? 'warn' : 'ok',
      {
        what: 'Denemelerin yarısında doğru cevap “Aynı”, yarısında “Ayna görüntüsü”dür. Cevapların çoğunda aynı düğmeye basılırsa yönerge anlaşılmamış olabilir.',
        result:
          invalid || r.sameShare === null
            ? skipped
            : r.sameShare > TASK_QUALITY.oneButton || r.sameShare < TASK_QUALITY.oneButtonLow
              ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
              : 'İki düğme de yeterince kullanıldı.',
        todo: retake(c, 'her şekli karşılaştırarak'),
        note: 'Kırmızı çizgi “Aynı” cevaplarının yüzdesi; iki uçtaki renkli bölgeler uyarı bölgesi.',
        ...(r.sameShare !== null
          ? {
              visual: shareMeter(
                '“Aynı” cevapları',
                [
                  ['<', TASK_QUALITY.oneButtonLow * 100],
                  ['>', TASK_QUALITY.oneButton * 100],
                ],
                [
                  {
                    label: '“Aynı”',
                    value: pctExact(r.sameShare),
                    valueLabel: pctText(r.sameShare),
                  },
                ],
              ),
            }
          : {}),
        spoken: r.sameShare !== null ? [`Aynı cevaplarının payı: ${pctText(r.sameShare)}.`] : [],
      },
    ),
    check('sure-doldu', 'Süre içinde verilmeyen cevaplar', lateMany ? 'warn' : 'ok', {
      what: 'Denemelerin beşte birinden çoğunda süre içinde cevap verilmezse “Dikkat” yazar.',
      result: !lateMany
        ? 'Bu sınırın altında kaldı.'
        : lateSaid
          ? saidIn(invalid ? 'Cevapsız ve çok erken denemeler' : 'Doğru sayılmayan denemeler')
          : v(c, 'Senin denemelerinde bu sınır aşıldı.', 'Çocuğunuzun denemelerinde bu sınır aşıldı.'),
      todo: retake(c, 'sessiz bir yerde'),
      note: 'Kırmızı çizgi süresi dolan denemelerin yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Süresi dolan denemeler',
        [['>', TASK_QUALITY.timeoutShare * 100]],
        [
          {
            label: 'Süre doldu',
            value: shareOf(r.timeouts, n),
            valueLabel: `${r.timeouts} deneme`,
          },
        ],
      ),
      spoken: [`Süresi dolan denemeler: ${sayCount(r.timeouts)}.`],
    }),
    check('erken', 'Çok erken cevaplar', earlyMany ? 'warn' : 'ok', {
      what: 'Şekiller görünür görünmez verilen cevaplar şekillere bakmadan verilmiş sayılır. Denemelerin onda birinden çoğunda böyleyse “Dikkat” yazar.',
      result: !earlyMany
        ? 'Bu sınırın altında kaldı.'
        : earlySaid
          ? saidIn(status === 'missed' ? 'Doğru sayılmayan denemeler' : 'Cevapsız ve çok erken denemeler')
          : v(c, 'Senin cevaplarında bu sınır aşıldı.', 'Çocuğunuzun cevaplarında bu sınır aşıldı.'),
      todo: retake(c, 'şekillere bakarak'),
      note: 'Kırmızı çizgi çok erken cevapların yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Çok erken cevaplar',
        [['>', TASK_QUALITY.earlyShare * 100]],
        [
          {
            label: 'Çok erken',
            value: shareOf(r.anticipations, n),
            valueLabel: `${r.anticipations} deneme`,
          },
        ],
      ),
      spoken: [`Çok erken cevaplar: ${sayCount(r.anticipations)}.`],
    }),
    timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(time ? [time] : [])],
    checks,
  };
}

/* ---------- Tepki hızı ---------- */

function reactionKind(c: Ctx, task: ReactionTimeTask): KindParts | null {
  const r = res<ReactionResult>(c, 'th_basit');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const partName = (k: string) => (k === 'simple' ? 'Basit bölüm' : 'Seçmeli bölüm');
  const rows: BlockRow[] = (['simple', 'choice'] as const).flatMap((k) => {
    const xs = traces.filter((t) => t.kind === k);
    return quarters(xs.length, 2).map(({ from, to }, h) => {
      const ys = xs.slice(from, to + 1);
      const ok = statusCount(ys, 'correct');
      const m = median(ys.filter((t) => t.status === 'correct').map((t) => t.rtMs as number));
      return {
        label: `${partName(k)}, ${h === 0 ? 'ilk' : 'ikinci'} yarı`,
        parts: [ok, statusCount(ys, 'wrong'), statusCount(ys, 'early'), statusCount(ys, 'miss')],
        detail: `${counts([
          { n: ok, label: 'doğru' },
          { n: statusCount(ys, 'wrong'), label: 'öteki taraf' },
          { n: statusCount(ys, 'early'), label: 'erken' },
          { n: statusCount(ys, 'miss'), label: 'süre doldu' },
        ])}${m !== null ? ` · tipik ${sec2(m)}` : ''}`,
      };
    });
  });
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Denemeler, yarı yarı',
    badge: `${traces.length} deneme`,
    noun: 'yarı',
    legend: ['doğru', 'öteki taraf', 'erken', 'süre doldu'],
    rows,
  });
  const partCard = (k: 'simple' | 'choice') => {
    const p = r[k];
    const rts = traces.filter((t) => t.kind === k && t.status === 'correct').map((t) => t.rtMs as number);
    if (p.medianRt === null || !rts.length) return null;
    return measureCard({
      key: `sure-${k}`,
      title: `${partName(k)}: tipik süre`,
      ...blockBadge(c, k === 'simple' ? 'th_basit' : 'th_secmeli'),
      text: ['Tepki süresi, dairenin belirmesinden düğmeye basılmasına kadar geçen süredir.', 'Tipik süre doğru tepkilerin ortasındaki değerdir.'].join(' '),
      // Kutunun anlatımı grafiğin nasıl okunacağıdır: sesli okunmaz.
      note: 'Her nokta bir doğru tepki; kırmızı çizgi tipik süre. Kutu, doğru tepkilerin ortadaki yarısı: dar kutu tepkilerin birbirine yakın olduğunu gösterir.',
      visual: {
        ...stripOf({
          label: `${partName(k)}: doğru tepkiler`,
          rts,
          median: p.medianRt,
          marker: `Tipik ${sec2(p.medianRt)}`,
          item: 'bir doğru tepki',
          digits: 2,
        }),
        ...(p.midLow !== null && p.midHigh !== null
          ? {
              box: {
                low: Math.round(p.midLow / 10) / 100,
                high: Math.round(p.midHigh / 10) / 100,
                label: 'doğru tepkilerin ortadaki yarısı',
              },
            }
          : {}),
      },
    });
  };
  const levels = [partCard('simple'), partCard('choice')].filter((x): x is PartCard => x !== null);
  const invalid = (p: ReactionResult['simple']) => p.misses > p.n / 2 || p.early > p.n / 2 || p.early + p.misses > p.n / 2;
  const parts = [r.simple, r.choice];
  const ch = r.choice;
  const chValid = !invalid(ch) && ch.answered >= REACTION_MIN_VALID;
  const acc = chValid ? ch.correct / ch.answered : null;
  const left = chValid ? ch.left / ch.answered : null;
  const choiceWarn = acc !== null && left !== null && (acc < TASK_QUALITY.reactionSlipAcc || left > TASK_QUALITY.oneButton || left < TASK_QUALITY.oneButtonLow);
  const share = (p: ReactionResult['simple'], x: number) => shareOf(x, p.n);
  const checks = [
    check('gecersiz', 'Cevapsız ve erken denemeler', parts.some(invalid) ? 'warn' : 'ok', {
      what: 'Bir bölümde denemelerin yarısından çoğunda süre içinde basılmaz ya da daire belirmeden basılırsa o bölüm yorumlanmaz.',
      result: parts.some(invalid)
        ? `${parts
            .filter(invalid)
            .map((p) => partName(p.key))
            .join(' ve ')} yorumlanmadı.`
        : 'İki bölümde de bu sınırın altında kaldı.',
      todo: retake(c, 'daireyi bekleyerek'),
      note: 'Kırmızı çizgiler cevapsız ve erken denemelerin yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Cevapsız ve erken',
        [['>', 50]],
        parts.map((p) => ({
          label: partName(p.key),
          value: share(p, p.misses + p.early),
          valueLabel: `${p.misses + p.early} deneme`,
        })),
      ),
      spoken: parts.map((p) => `${partName(p.key)}: ${sayN(p.misses + p.early, 'cevapsız ya da erken')}.`),
    }),
    check('taraf', 'Seçmeli bölümde doğru taraf', !chValid ? 'none' : choiceWarn ? 'warn' : 'ok', {
      what: 'Seçmeli bölümde daire hangi kutuda belirirse o taraftaki düğmeye basılır. Öteki tarafa sık basılırsa acele edilmiş, sol ile sağ karışmış ya da rastgele basılmış olabilir.',
      result: !chValid
        ? 'Bu bölümde yeterince geçerli tepki olmadığı için bu denetim yapılamadı.'
        : choiceWarn
          ? v(
              c,
              'Senin tepkilerinde bu görüldü; ayrıntısı raporun başındaki uyarıda.',
              'Çocuğunuzun tepkilerinde bu görüldü; ayrıntısı raporun başındaki uyarıda.',
            )
          : v(c, 'Tepkilerinin çoğunda doğru tarafa bastın.', 'Çocuğunuz tepkilerinin çoğunda doğru tarafa bastı.'),
      todo: retake(c, 'dairenin olduğu tarafa bakarak'),
      note: 'Kırmızı çizgi doğru taraftaki basışların yüzdesi; renkli bölgeler uyarı bölgeleri.',
      ...(acc !== null
        ? {
            visual: {
              type: 'meter',
              label: 'Doğru taraftaki basışlar',
              min: 0,
              max: 100,
              zones: [
                {
                  from: 0,
                  to: TASK_QUALITY.reactionReversedAcc * 100,
                  label: 'Ters',
                  warn: true,
                },
                {
                  from: TASK_QUALITY.reactionReversedAcc * 100,
                  to: TASK_QUALITY.reactionChanceAcc * 100,
                  label: 'Rastgele',
                  warn: true,
                },
                {
                  from: TASK_QUALITY.reactionChanceAcc * 100,
                  to: TASK_QUALITY.reactionSlipAcc * 100,
                  label: 'Dikkat',
                  warn: true,
                },
                {
                  from: TASK_QUALITY.reactionSlipAcc * 100,
                  to: 100,
                  label: 'Uygun',
                  warn: false,
                },
              ],
              rows: [
                {
                  label: 'Doğru taraf',
                  value: pctExact(acc),
                  valueLabel: pctText(acc),
                },
              ],
            } satisfies MeterVisual,
          }
        : {}),
      spoken: acc !== null ? [`Doğru taraftaki basışlar: ${pctText(acc)}.`] : [],
    }),
    // Yorumlanmayan bölüm (yukarıdaki denetim) bu iki denetime katılmaz: grafik yalnızca yorumlanan bölümleri gösterir.
    ...(['misses', 'early'] as const).map((f) => {
      const valid = parts.filter((p) => !invalid(p));
      const many = valid.filter((p) => p[f] / p.n > TASK_QUALITY.reactionSomeShare);
      const left = parts.filter(invalid);
      const name = f === 'misses' ? 'Süre içinde basılmayanlar' : 'Çok erken basışlar';
      const what =
        f === 'misses'
          ? 'Bir bölümde denemelerin onda birinden çoğunda süre içinde basılmazsa bu söylenir; dörtte birinden çoğundaysa sonuç dikkatle okunur.'
          : 'Daire belirmeden ya da belirir belirmez basılan denemeler tepki sayılmaz. Bir bölümde onda birinden çoğundaysa bu söylenir.';
      const leftOut = left.length ? [`${joinAnd(left.map((p) => partName(p.key)))} yukarıdaki denetimde yorumlanmadığı için bu denetime katılmadı.`] : [];
      if (!valid.length) return check(f === 'misses' ? 'kacan' : 'erken', name, 'none', { what, result: leftOut.join(' ') });
      return check(f === 'misses' ? 'kacan' : 'erken', name, many.length ? 'warn' : 'ok', {
        what,
        result: [
          many.length
            ? v(c, 'Senin denemelerinde bu görüldü.', 'Çocuğunuzun denemelerinde bu görüldü.')
            : `Yorumlanan ${valid.length === 1 ? 'bölümde' : 'bölümlerde'} bu oran onda birin altında kaldı.`,
          ...leftOut,
        ].join(' '),
        todo: f === 'misses' ? retake(c, 'sessiz bir yerde') : retake(c, 'daireyi bekleyerek'),
        note:
          f === 'misses'
            ? 'Kırmızı çizgiler süresi dolan denemelerin yüzdesi; renkli bölge uyarı bölgesi.'
            : 'Kırmızı çizgiler çok erken basışların yüzdesi; renkli bölge uyarı bölgesi.',
        visual: shareMeter(
          f === 'misses' ? 'Süresi dolan' : 'Çok erken',
          [['>', TASK_QUALITY.reactionSomeShare * 100]],
          valid.map((p) => ({
            label: partName(p.key),
            value: share(p, p[f]),
            valueLabel: `${p[f]} deneme`,
          })),
        ),
        spoken: valid.map((p) => `${partName(p.key)}: ${sayN(p[f], f === 'misses' ? 'süresi dolan' : 'çok erken')}.`),
      });
    }),
    check('fare', 'Fareyle verilen cevaplar', invalid(ch) || !ch.answered ? 'none' : ch.mouse / ch.answered >= REACTION_MOUSE_SHARE ? 'warn' : 'ok', {
      what: 'Fareyle verilen cevaplarda süreye imlecin iki düğme arasındaki yolu da eklenir. Seçmeli bölümde cevapların dörtte biri ya da daha çoğu fareyle verildiyse bu söylenir.',
      result:
        invalid(ch) || !ch.answered
          ? 'Seçmeli bölüm yorumlanmadığı için bu denetim yapılmadı.'
          : ch.mouse / ch.answered >= REACTION_MOUSE_SHARE
            ? v(
                c,
                'Senin cevaplarında bu görüldü; bilgisayarda ok tuşlarıyla daha doğru ölçülür.',
                'Çocuğunuzun cevaplarında bu görüldü; bilgisayarda ok tuşlarıyla daha doğru ölçülür.',
              )
            : 'Bu sınırın altında kaldı.',
      note: 'Kırmızı çizgi fareyle verilen cevapların yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Fareyle verilen',
        [['≥', REACTION_MOUSE_SHARE * 100]],
        [
          {
            label: 'Seçmeli bölüm',
            value: shareOf(ch.mouse, ch.answered),
            valueLabel: `${ch.mouse} cevap`,
          },
        ],
      ),
      spoken: [`Fareyle verilen cevaplar: ${sayCount(ch.mouse)}.`],
    }),
  ];
  checks.push(timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }));
  return { name: task.name, answers: [answers], levels, checks };
}

/* ---------- Kural değiştirme ---------- */

function ruleSwitchKind(c: Ctx, task: RuleSwitchTask): KindParts | null {
  const r = res<RuleSwitchResult>(c, 'kd_dogruluk');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const blockName = ['Renk kuralı', 'Şekil kuralı', 'Karışık bölüm 1', 'Karışık bölüm 2'];
  const blocksIdx = [...new Set(task.trials.map((t) => t.block))].sort((a, b) => a - b);
  const rows: BlockRow[] = blocksIdx.map((b) => {
    const xs = traces.filter((t) => task.trials[t.index].block === b);
    const ok = statusCount(xs, 'correct');
    const rule = xs.filter((t) => t.lure === 'rule').length;
    const m = median(xs.filter((t) => t.status === 'correct' && t.rtMs !== null).map((t) => t.rtMs as number));
    return {
      label: blockName[b] ?? `${b + 1}. bölüm`,
      parts: [ok, statusCount(xs, 'wrong'), statusCount(xs, 'miss'), statusCount(xs, 'early')],
      detail: `${counts([
        { n: ok, label: 'doğru' },
        { n: statusCount(xs, 'wrong'), label: 'yanlış' },
        { n: statusCount(xs, 'miss'), label: 'süre doldu' },
        { n: statusCount(xs, 'early'), label: 'çok erken' },
      ])}${m !== null ? ` · tipik ${sec2(m)}` : ''}`,
      tags: rule ? [`${rule} öteki kurala göre`] : [],
    };
  });
  const answers = blocksCard(c, {
    key: task.key,
    title: 'Denemeler, bölüm bölüm',
    badge: `${traces.length} deneme`,
    noun: 'bölüm',
    legend: ['doğru', 'yanlış', 'süre doldu', 'çok erken'],
    rows,
  });
  const accuracy = measureCard({
    key: 'dogruluk',
    title: 'Doğruluk',
    ...blockBadge(c, 'kd_dogruluk'),
    text: 'Doğruluk, işaretin söylediği kurala göre doğru düğmeye basılan denemelerin payıdır. Süresi dolan ve çok erken cevaplar doğru sayılmaz.',
    note: 'Çubuk bütün denemeleri gösterir; parçalar doğru, yanlış, süresi dolan ve çok erken denemelerdir.',
    visual: stackOf('Denemeler', [
      { label: 'Doğru', value: r.correct },
      { label: 'Yanlış', value: r.answered - r.tooFast - r.correct },
      { label: 'Süre doldu', value: r.timeouts },
      { label: 'Çok erken', value: r.tooFast },
    ]),
    spoken: [`Doğru: ${sayCount(r.correct)}. Süre doldu: ${sayCount(r.timeouts)}. Çok erken: ${sayCount(r.tooFast)}.`],
  });
  const conds = [
    { label: 'Tek kurallı bölümler', ms: r.pure.medianRt },
    { label: 'Karışıkta kural sürerken', ms: r.repeat.medianRt },
    { label: 'Karışıkta kural değişince', ms: r.switch.medianRt },
  ].filter((x): x is { label: string; ms: number } => x.ms !== null);
  const costCard = !conds.length
    ? null
    : measureCard({
        key: 'bedel',
        title: 'Kural değiştirmenin ve karışık bölümün etkisi',
        ...blockBadge(c, 'kd_degisim'),
        text: [
          'Tipik süreler doğru cevaplardan hesaplanır; her bölümün ilk denemesi ve bir hatadan hemen sonraki deneme katılmaz.',
          'Kural değiştirmenin etkisi, kural değişince geçen tipik süreden kural sürerken geçenin çıkarılmasıyla bulunur.',
          'Karışık bölümün etkisi, karışık bölümde kural sürerken geçen süreden tek kurallı bölümlerdekinin çıkarılmasıyla bulunur.',
        ].join(' '),
        note: 'Çubuklar üç deneme türündeki tipik süre.',
        visual: secBars('Deneme türüne göre tipik süre', conds),
        spoken: conds.map((x) => `${x.label}: ${sec2(x.ms)}.`),
      });
  const n = r.n;
  const chance = ruleSwitchChance(r) && r.timeouts * 2 < n;
  const timeouts = r.answered === 0 || ruleSwitchTimeouts(r);
  const fastNeed = Math.max(3, Math.ceil(0.1 * n));
  const checks = [
    // Doğruluk düşük ama nedeni süre içinde verilmeyen cevaplarsa bu denetim yapılmaz (süre denetimi aşağıda).
    check('sans', 'Şans düzeyi', chance ? 'warn' : ruleSwitchChance(r) ? 'none' : 'ok', {
      what: 'İki düğmeli bu görevde rastgele basan biri de denemelerin yaklaşık yarısını bulur. Doğruluk bunun az üstündeyse sonuç yorumlanmaz.',
      result: chance
        ? v(c, 'Senin doğruluğun bu sınırda kaldı.', 'Çocuğunuzun doğruluğu bu sınırda kaldı.')
        : ruleSwitchChance(r)
          ? 'Doğruluk düşük, ama nedeni süre içinde verilmeyen cevaplar; bu yüzden bu denetim yapılmadı, süre aşağıda denetlenir.'
          : v(c, 'Senin doğruluğun bu sınırın üstünde.', 'Çocuğunuzun doğruluğu bu sınırın üstünde.'),
      todo: retake(c, 'işarete ve şekle bakarak'),
      note: 'Kırmızı çizgi doğruluk yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Doğruluk',
        [['≤', RULE_CHANCE_ACC * 100]],
        [
          {
            label: 'Doğru',
            value: shareOf(r.correct, r.n),
            valueLabel: pctText(r.accuracy),
          },
        ],
      ),
      spoken: [`Doğruluk: ${pctText(r.accuracy)}.`, 'Uyarı: yüzde 60 ya da daha az.'],
    }),
    check('sure-doldu', 'Süre içinde verilmeyen cevaplar', timeouts ? 'warn' : 'ok', {
      what: 'Denemelerin dörtte birinde ya da daha çoğunda süre içinde cevap verilmezse görev yarıda bırakılmış ya da dikkat dağılmış olabilir.',
      result: timeouts
        ? v(c, 'Senin denemelerinde bu görüldü.', 'Çocuğunuzun denemelerinde bu görüldü.')
        : 'Süresi dolan denemeler dörtte birin altında kaldı.',
      todo: retake(c, 'sessiz bir yerde'),
      note: 'Kırmızı çizgi süresi dolan denemelerin yüzdesi; renkli bölge uyarı bölgesi.',
      visual: shareMeter(
        'Süresi dolan denemeler',
        [['≥', 25]],
        [
          {
            label: 'Süre doldu',
            value: shareOf(r.timeouts, n),
            valueLabel: `${r.timeouts} deneme`,
          },
        ],
      ),
      spoken: [`Süresi dolan denemeler: ${sayCount(r.timeouts)}.`],
    }),
    check('erken', 'Çok erken cevaplar', ruleSwitchFast(r) ? 'warn' : 'ok', {
      what: `Şekil göründükten sonraki ${secLimit(RULE_TOO_FAST_MS)} saniye içinde basılan denemeler şekle bakmadan basılmış sayılır ve doğru sayılmaz. Denemelerin onda biri ya da en az ${fastNeed} tanesi böyleyse “Dikkat” yazar.`,
      result: ruleSwitchFast(r)
        ? v(c, 'Senin denemelerinde bu sınıra ulaşıldı.', 'Çocuğunuzun denemelerinde bu sınıra ulaşıldı.')
        : `Çok erken cevaplar ${fastNeed} sınırının altında kaldı.`,
      todo: retake(c, 'şekli görünce basarak'),
      note: 'Kırmızı çizgi çok erken cevapların sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Çok erken cevaplar', Math.max(2 * fastNeed, r.tooFast), fastNeed, [
        {
          label: 'Çok erken',
          value: r.tooFast,
          valueLabel: `${r.tooFast} deneme`,
        },
      ]),
      spoken: [`Çok erken cevaplar: ${sayCount(r.tooFast)}.`, `Uyarı sınırı: ${fastNeed}.`],
    }),
    // Kural en az 20 cevapta denetlenir (lib/scoring/tasks.ts, ruleSwitchOneSide).
    check('ayni-dugme', 'Aynı düğme', r.answered < 20 ? 'none' : ruleSwitchOneSide(r) ? 'warn' : 'ok', {
      what: 'Denemelerin yaklaşık yarısında sol, yarısında sağ düğme doğrudur. Cevapların çoğunda aynı düğmeye basılırsa şekillere bakılmamış olabilir.',
      result:
        r.answered < 20
          ? 'Cevap verilen deneme az olduğu için bu denetim yapılamadı.'
          : ruleSwitchOneSide(r)
            ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
            : 'İki düğme de yeterince kullanıldı.',
      todo: retake(c, 'her şekle bakarak'),
      note: 'Kırmızı çizgi en çok basılan düğmenin yüzdesi; renkli bölge uyarı bölgesi.',
      ...(r.answered
        ? {
            visual: shareMeter(
              'En çok basılan düğme',
              [['≥', 85]],
              [
                {
                  label: 'Aynı düğme',
                  value: shareOf(r.sameSide, r.answered),
                  valueLabel: `${r.sameSide} cevap`,
                },
              ],
            ),
          }
        : {}),
      spoken: r.answered ? [`En çok basılan düğme: yüzde ${Math.round(shareOf(r.sameSide, r.answered))}.`] : [],
    }),
    timingCard(c, { noun: 'tepki', measured: timedCount(traces), total: timedCount(traces) }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [accuracy, ...(costCard ? [costCard] : [])],
    checks,
  };
}

/* ---------- Simge bulma ---------- */

function symbolSearchKind(c: Ctx, task: SymbolSearchTask): KindParts | null {
  const r = res<SymbolSearchResult>(c, 'sg_hiz');
  if (!r) return null;
  const q = (at: number) => Math.min(3, Math.floor((4 * at) / r.durationMs));
  const qSec = Math.round(r.durationMs / 4000);
  const rows: BlockRow[] = [0, 1, 2, 3].map((k) => {
    const xs = r.items.filter((x) => q(x.at) === k);
    const ok = xs.filter((x) => x.correct).length;
    return {
      label: `${k * qSec}–${(k + 1) * qSec} sn`,
      parts: [ok, xs.length - ok],
      detail: counts([
        { n: ok, label: 'doğru karar' },
        { n: xs.length - ok, label: 'yanlış karar' },
      ]),
    };
  });
  const answers = r.answered
    ? blocksCard(c, {
        key: task.key,
        title: 'Kararlar, çeyrek çeyrek',
        badge: `${r.answered} karar`,
        noun: 'çeyrek',
        of: 'karar',
        legend: ['doğru', 'yanlış'],
        rows,
      })
    : measureCard({
        key: task.key,
        title: 'Kararlar',
        badge: 'Karar verilmedi',
        text: v(c, 'Süre boyunca hiç karar vermedin.', 'Süre boyunca hiç karar verilmedi.'),
        visual: stackOf('Kararlar', [
          { label: 'Doğru', value: 0 },
          { label: 'Yanlış', value: 0 },
        ]),
        spoken: ['Karar: yok.'],
      });
  // Raporun kartının başlığı doğru karar sayısıdır; bu kartın rozeti dakikadaki değeri yazar (yorumlanmadıysa "Yorumlanmadı").
  const sgBadge = blockBadge(c, 'sg_hiz');
  const perMin = measureCard({
    key: 'hiz',
    title: 'Dakikada doğru karar',
    badge: sgBadge.unread ? sgBadge.badge : `Dakikada ${dec1(r.perMinute)} doğru karar`,
    unread: sgBadge.unread,
    text: [
      'Doğru karar sayısı, çalışılan sürenin dakikasına bölünür.',
      'Süre dolmadan bütün denemeler biterse çalışılan süre son cevabın anıdır.',
      'Yanlış kararlar sayılmaz ama doğrulukla birlikte okunur.',
    ].join(' '),
    note: 'Her sütun bir çeyrekteki doğru kararlar.',
    visual: {
      type: 'columns',
      label: 'Çeyrek çeyrek doğru kararlar',
      rows: r.quarters.map((x, i) => ({
        label: `${i + 1}.`,
        value: x,
        valueLabel: String(x),
      })),
      max: Math.max(1, ...r.quarters),
      caption: 'Çeyrekler',
    },
    spoken: r.quarters.map((x, i) => `${i + 1}. çeyrek: ${sayCount(x, 'doğru karar')}.`),
  });
  const time =
    r.medianRt === null
      ? null
      : measureCard({
          key: 'sure',
          title: 'Tipik karar süresi',
          // Tipik süre yalnızca doğru kararlardan hesaplanır (lib/scoring/tasks.ts, scoreSymbolSearch).
          text: medianText('doğru karar', 'simgelerin ekrana gelmesinden cevaba kadar'),
          note: 'Her nokta bir doğru kararın süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'Doğru kararların süreleri',
            rts: r.rts,
            median: r.medianRt,
            marker: `Tipik ${secTag(r.medianRt)}`,
            item: 'bir doğru karar',
          }),
          spoken: [`Tipik karar süresi: ${secTag(r.medianRt)}.`],
        });
  const why = sgNotRead(r);
  const few = why === 'none' || why === 'few';
  const oneBtn = why === 'oneButton';
  const chance = why === 'chance';
  const sameMax = Math.max(r.varAnswers, r.answered - r.varAnswers);
  const checks = [
    check('az', 'Karar sayısı', few ? 'warn' : 'ok', {
      what: 'Süre boyunca çok az karar verilirse görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir; sonuç yorumlanmaz.',
      result: few ? v(c, 'Senin kararların bu sınırın altında kaldı.', 'Çocuğunuzun kararları bu sınırın altında kaldı.') : 'Yeterince karar verildi.',
      todo: retake(c, 'süre bitene kadar çalışarak'),
      note: 'Kırmızı çizgi karar sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter(
        'Kararlar',
        Math.max(40, r.answered),
        SG_MIN_ANSWERED - 1,
        [
          {
            label: 'Karar',
            value: r.answered,
            valueLabel: `${r.answered} karar`,
          },
        ],
        true,
      ),
      spoken: [`Kararlar: ${sayCount(r.answered)}.`, `Uyarı: ${SG_MIN_ANSWERED - 1} ya da daha az.`],
    }),
    check('ayni-dugme', 'Aynı düğme', few ? 'none' : oneBtn ? 'warn' : 'ok', {
      what: 'Denemelerin bir kısmında aranan simge vardır, bir kısmında yoktur. Kararların neredeyse hepsinde aynı düğmeye basılırsa simgelere bakılmamış olabilir.',
      result: few
        ? 'Çok az karar olduğu için bu denetim yapılmadı.'
        : oneBtn
          ? v(c, 'Senin kararlarında bu görüldü; sonuç yorumlanmadı.', 'Çocuğunuzun kararlarında bu görüldü; sonuç yorumlanmadı.')
          : 'İki düğme de yeterince kullanıldı.',
      todo: retake(c, 'simgelere bakarak'),
      note: 'Kırmızı çizgi en çok basılan düğmenin yüzdesi; renkli bölge uyarı bölgesi.',
      ...(r.answered
        ? {
            visual: shareMeter(
              'En çok basılan düğme',
              [['≥', SG_ONE_BUTTON * 100]],
              [
                {
                  label: 'Aynı düğme',
                  value: shareOf(sameMax, r.answered),
                  valueLabel: `${sameMax} karar`,
                },
              ],
            ),
          }
        : {}),
      spoken: r.answered ? [`En çok basılan düğme: yüzde ${Math.round(shareOf(sameMax, r.answered))}.`] : [],
    }),
    check('dogruluk', 'Doğruluk', few || oneBtn ? 'none' : chance ? 'warn' : 'ok', {
      what: 'Rastgele “Var” ya da “Yok” diyen biri de kararların yaklaşık yarısını bulur. Doğruluk bunun az üstündeyse sonuç yorumlanmaz.',
      result:
        few || oneBtn
          ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
          : chance
            ? v(c, 'Senin doğruluğun bu sınırın altında kaldı.', 'Çocuğunuzun doğruluğu bu sınırın altında kaldı.')
            : v(c, 'Senin doğruluğun bu sınırın üstünde.', 'Çocuğunuzun doğruluğu bu sınırın üstünde.'),
      todo: retake(c, 'acele etmeden'),
      note: 'Kırmızı çizgi doğruluk yüzdesi; renkli bölge uyarı bölgesi.',
      ...(r.answered
        ? {
            visual: shareMeter(
              'Doğruluk',
              [['<', SG_MIN_ACCURACY * 100]],
              [
                {
                  label: 'Doğru karar',
                  value: pctExact(r.accuracy),
                  valueLabel: pctText(r.accuracy),
                },
              ],
            ),
          }
        : {}),
      spoken: r.answered ? [`Doğruluk: ${pctText(r.accuracy)}.`] : [],
    }),
    check('hizli', 'Çok hızlı kararlar', why !== null ? 'none' : sgTooFast(r) ? 'warn' : 'ok', {
      what: `${secLimit(SG_TOO_FAST_MS)} saniyeden kısa sürede iki simgeyi dört simgeyle karşılaştırmak zordur. Bu kadar hızlı kararlar en az ${SG_TOO_FAST_N} tane ve kararların beşte biri ya da daha çoğuysa “Dikkat” yazar.`,
      result:
        why !== null
          ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
          : sgTooFast(r)
            ? v(c, 'Senin kararlarında bu sınıra ulaşıldı.', 'Çocuğunuzun kararlarında bu sınıra ulaşıldı.')
            : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'simgelere tam bakarak'),
      note: 'Kırmızı çizgi çok hızlı kararların sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Çok hızlı kararlar', Math.max(10, r.answered), Math.max(SG_TOO_FAST_N, Math.ceil(SG_TOO_FAST_SHARE * r.answered)), [
        {
          label: 'Çok hızlı',
          value: r.tooFast,
          valueLabel: `${r.tooFast} karar`,
        },
      ]),
      spoken: [`Çok hızlı kararlar: ${sayCount(r.tooFast)}.`],
    }),
    ...(r.answered ? [timingCard(c, { noun: 'karar', measured: r.timed, total: r.answered })] : []),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [perMin, ...(time ? [time] : [])],
    checks,
  };
}

/* ---------- Kelime listesi ---------- */

function wordListKind(c: Ctx, task: WordListTask): KindParts | null {
  const r = res<WordListResult>(c, 'kl_ogrenme');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const recalls = [
    ...r.trials.map((t, i) => ({
      t,
      label: `${i + 1}. deneme (ilk liste)`,
      list: task.listA,
    })),
    { t: r.b, label: 'İkinci liste', list: task.listB },
    {
      t: r.delayed,
      label: 'İlk liste, yeniden gösterilmeden',
      list: task.listA,
    },
  ];
  const recallCard: PartCard = {
    key: `${task.key}-hatirlama`,
    title: 'Hatırlama denemeleri',
    badge: `${recalls.length} deneme`,
    note: 'Her sütun bir hatırlama denemesinde doğru yazılan kelimeler.',
    visual: {
      type: 'columns',
      label: 'Denemelerde hatırlanan kelimeler',
      rows: recalls.map((x, i) => ({
        label: i < r.trials.length ? `${i + 1}.` : i === r.trials.length ? 'İkinci' : 'Sonra',
        value: x.t.correct,
        valueLabel: String(x.t.correct),
      })),
      max: r.listLength,
      caption: `${r.listLength} kelimeden`,
    },
    rows: recalls.map((x, i) => ({
      no: i + 1,
      text: x.label,
      value: x.t.entries === 0 ? 'Kelime yazılmadı' : `${x.t.correct} kelime: ${x.t.recalled.map((p) => x.list[p]).join(', ') || '—'}`,
      tags: [
        ...(x.t.extra ? [`${x.t.extra} listede olmayan`] : []),
        ...(x.t.otherList ? [`${x.t.otherList} öteki listeden`] : []),
        ...(x.t.repeats ? [`${x.t.repeats} tekrar`] : []),
        ...(x.t.restarts ? [`liste ${x.t.restarts} kez baştan gösterildi`] : []),
      ],
      ...(x.t.entries === 0 ? { muted: true } : {}),
    })),
    rowsHead: { item: 'deneme', value: v(c, 'Yazdıkların', 'Yazılanlar') },
    spoken: recalls.map((x) => `${x.label}: ${sayCount(x.t.correct, 'kelime')}.`),
  };
  const recog = itemsCard(c, {
    key: `${task.key}-tanima`,
    title: 'Tanıma bölümü',
    noun: 'kelime',
    groups: [''],
    groupCaption: 'Kelimeler, gösterilme sırasıyla',
    rows: traces.map((t) => ({
      group: 0,
      shown: task.recognition[t.index],
      status: t.status,
      given: t.response === 1 ? 'Evet' : 'Hayır',
      // Kelimenin türü (ilk listeden, ikinci listeden, benzer yeni kelime) yazılmaz: liste her seferinde aynıdır.
      rtMs: t.rtMs,
      rapid: !!t.rapid,
    })),
    timed: true,
    rapid: { ms: 300, label: 'çok hızlı: 0,3 sn altı' },
  });
  const learn = measureCard({
    key: 'ogrenme',
    title: 'Öğrenme toplamı',
    ...blockBadge(c, 'kl_ogrenme'),
    text: [
      `İlk liste ${r.trials.length} kez gösterilir; her seferinde hatırlanan kelimeler sayılır.`,
      'Öğrenme toplamı bu denemelerdeki doğruların toplamıdır.',
      'Aynı kelimeyi iki kez yazmak ve listede olmayan kelimeler sayılmaz.',
    ].join(' '),
    note: 'Her sütun bir öğrenme denemesi.',
    visual: {
      type: 'columns',
      label: 'Öğrenme denemeleri',
      rows: r.trials.map((t, i) => ({
        label: `${i + 1}.`,
        value: t.correct,
        valueLabel: String(t.correct),
      })),
      max: r.listLength,
      caption: `${r.listLength} kelimeden`,
    },
    spoken: r.trials.map((t, i) => `${i + 1}. deneme: ${sayCount(t.correct, 'kelime')}.`),
  });
  const keep = measureCard({
    key: 'koruma',
    title: 'Öğrenileni koruma',
    ...blockBadge(c, 'kl_koruma'),
    text: 'Araya ikinci bir liste girdikten sonra ilk liste yeniden gösterilmeden hatırlanır. Koruma, bu denemedeki doğruların son öğrenme denemesiyle karşılaştırılmasıdır.',
    note: 'Çubuklar son öğrenme denemesinde ve araya giren listeden sonra hatırlanan kelimeler.',
    visual: shareBars('Öğrenileni koruma', [
      {
        label: 'Son öğrenme denemesi',
        value: r.trials[r.trials.length - 1].correct,
        max: r.listLength,
      },
      {
        label: 'Araya giren listeden sonra',
        value: r.delayed.correct,
        max: r.listLength,
      },
    ]),
    spoken: [
      `Son öğrenme denemesi: ${sayCount(r.trials[r.trials.length - 1].correct, 'kelime')}. Araya giren listeden sonra: ${sayCount(r.delayed.correct, 'kelime')}.`,
    ],
  });
  const R = r.recognition;
  const tanima = measureCard({
    key: 'tanima',
    title: 'Tanıma',
    ...blockBadge(c, 'kl_tanima'),
    text: 'Tanımada ilk listedeki kelimelere “evet”, ötekilere “hayır” denir. Ayırt etme, ilk listedeki kelimelerde “evet” oranından ilk listede olmayan kelimelerdeki “evet” oranının çıkarılmasıyla bulunur.',
    note: 'Çubuklar ilk listedeki ve ilk listede olmayan kelimelerde “evet” denenlerin payı.',
    visual: pctBars('“Evet” denen kelimeler', [
      { label: 'İlk listedeki kelimeler', rate: R.hitRate },
      { label: 'İlk listede olmayanlar', rate: R.falseRate },
    ]),
    spoken: [`İlk listedeki kelimelerde evet: ${pctText(R.hitRate)}. İlk listede olmayan kelimelerde evet: ${pctText(R.falseRate)}.`],
  });
  const noInput = wordListNoInput(r);
  const one = wordListRecogOneSided(r);
  const fast = !one && wordListRecogFast(r);
  const chance = !one && !fast && wordListRecogChance(r);
  const recallChecks = [
    check('bos', 'Kelime yazılmayan denemeler', noInput || r.emptyRecalls >= 2 || wordListDelayedSkipped(r) ? 'warn' : 'ok', {
      what: 'Hatırlama denemelerinde hiç kelime yazılmazsa o deneme yarıda bırakılmış olabilir; hiçbirinde yazılmazsa hatırlama sonuçları yorumlanmaz.',
      result: noInput
        ? v(c, 'Hiçbir denemede kelime yazmadın.', 'Hiçbir denemede kelime yazılmadı.')
        : r.emptyRecalls >= 2 || wordListDelayedSkipped(r)
          ? v(c, 'Bazı denemelerde kelime yazmadın.', 'Bazı denemelerde kelime yazılmadı.')
          : 'Her denemede kelime yazıldı.',
      todo: retake(c, 'hatırladığın her kelimeyi yazarak'),
      note: 'Çubuk bütün hatırlama denemelerini gösterir; parçalar kelime yazılan ve yazılmayan denemelerdir.',
      visual: stackOf('Hatırlama denemeleri', [
        { label: 'Kelime yazılan', value: recalls.length - r.emptyRecalls },
        { label: 'Kelime yazılmayan', value: r.emptyRecalls },
      ]),
      spoken: [`Kelime yazılmayan denemeler: ${sayCount(r.emptyRecalls)}.`],
    }),
    check('fazla', 'Listede olmayan kelimeler', !noInput && wordListManyExtra(r) ? 'warn' : 'ok', {
      what: 'Öğrenme denemelerinde listede olmayan çok sayıda kelime yazılırsa yönerge tam anlaşılmamış olabilir.',
      result: !noInput && wordListManyExtra(r) ? v(c, 'Senin yazdıklarında bu görüldü.', 'Yazılanlarda bu görüldü.') : 'Bu sınırın altında kaldı.',
      todo: v(c, 'Yeniden yaparsan yalnızca listedeki kelimeleri yaz.', 'Yeniden yaparsa yalnızca listedeki kelimeleri yazmasını hatırlatabilirsiniz.'),
      note: 'Çubuklar öğrenme denemelerinde doğru ve listede olmayan kelimeler.',
      visual: {
        type: 'bars',
        label: 'Öğrenme denemelerinde yazılanlar',
        scale: 'scale',
        rows: [
          { label: 'Doğru', value: r.total, valueLabel: String(r.total) },
          {
            label: 'Listede olmayan',
            value: r.extraLearning,
            valueLabel: String(r.extraLearning),
          },
        ],
      },
      spoken: [`Doğru: ${sayCount(r.total)}. Listede olmayan: ${sayCount(r.extraLearning)}.`],
    }),
    check('baslangic', 'Listenin baştan gösterilmesi', r.restarts > 0 ? 'warn' : 'ok', {
      what: 'Liste gösterilirken başka bir sekmeye geçilirse liste baştan gösterilir. Kelimeler bir kez daha görüldüğü için hatırlanan sayı biraz yüksek çıkabilir.',
      result: r.restarts > 0 ? `Liste ${r.restarts} kez baştan gösterildi.` : 'Liste hiç baştan gösterilmedi.',
      note: 'Kırmızı çizgi listenin baştan gösterilme sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Baştan gösterilme', Math.max(3, r.restarts), 1, [
        {
          label: 'Baştan gösterilme',
          value: r.restarts,
          valueLabel: `${r.restarts} kez`,
        },
      ]),
      spoken: [`Liste baştan gösterilme: ${sayCount(r.restarts)}.`],
    }),
  ];
  const recogCheck = check('tanima', 'Tanıma cevapları', one || fast || chance ? 'warn' : 'ok', {
    what: 'Tanıma sonucu üç durumda yorumlanmaz: hemen her kelimeye aynı cevap verilmesi, çok hızlı cevaplar ve ilk listedekilerin ötekilerle benzer oranda “evet” alması.',
    result: one
      ? 'Hemen her kelimeye aynı cevap verildi.'
      : fast
        ? 'Birçok kelimede çok kısa sürede cevap verildi.'
        : chance
          ? 'İlk listedeki ve öteki kelimelere benzer oranda “evet” dendi.'
          : v(c, 'Tanıma cevaplarında bu durumların hiçbiri görülmedi.', 'Tanıma cevaplarında bu durumların hiçbiri görülmedi.'),
    todo: retake(c, 'her kelimeyi okuyarak'),
    note: 'Çubuklar “evet” denen kelimelerin payı ve çok hızlı cevapların sayısı.',
    visual: shareBars('Tanıma cevapları', [
      { label: '“Evet” denen', value: R.yes, max: R.n },
      { label: 'Çok hızlı cevap', value: R.tooFast, max: R.n },
    ]),
    spoken: [`Evet denen kelimeler: ${R.n} kelimeden ${R.yes}. Çok hızlı cevaplar: ${sayCount(R.tooFast)}.`],
  });
  return {
    name: task.name,
    answers: [recallCard, recog],
    levels: [learn, keep, tanima],
    checks: [
      ...recallChecks,
      recogCheck,
      timingCard(c, {
        noun: 'kelime',
        measured: timedCount(traces),
        total: traces.length || 1,
      }),
    ],
  };
}

/* ---------- Kule görevi ---------- */

function towerKind(c: Ctx, task: TowerTask): KindParts | null {
  const r = res<TowerResult>(c, 'kg_dogru');
  if (!r) return null;
  const traces = c.traces[task.key] ?? [];
  const moves = [...new Set(task.items.map((it) => it.minMoves))].sort((a, b) => a - b);
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Problemler',
    noun: 'problem',
    groups: moves.map(String),
    groupCaption: 'En az hamle sayısı',
    rows: traces.map((t) => {
      const it = task.items[t.index];
      const resp = t.response as { moves: number; pick: number | null };
      return {
        group: moves.indexOf(it.minMoves),
        shown: `${it.minMoves} hamlelik problem`,
        status: t.status,
        given: t.status === 'skip' ? null : `${resp.moves} hamle`,
        tags: resp.pick !== null ? [`ilk top ${secTag(resp.pick)}`] : [],
        rtMs: t.rtMs,
        rapid: !!t.rapid,
      };
    }),
    timed: true,
    okLabel: 'en az hamlede',
    wrongLabel: 'fazla hamleyle',
    none: 'çözülemedi',
    missLabel: 'Süre içinde çözülemedi',
    skipLabel: 'Hiç top taşınmadı',
  });
  const optimal = measureCard({
    key: 'dogru',
    title: 'En az hamlede çözülen problemler',
    ...blockBadge(c, 'kg_dogru'),
    text: [
      'Her problemin en az hamle sayısı ekranda yazılıdır.',
      'Bu sayıda hamleyle çözülen problemler sayılır; fazla hamleyle çözülenler ayrı tutulur.',
      'Uzun problemlerde önceden plan yapmak daha çok önem kazanır.',
    ].join(' '),
    note: 'Çubuk bütün problemleri gösterir; parçalar en az hamlede, fazla hamleyle çözülen ve çözülemeyen problemlerdir.',
    visual: stackOf('Problemler', [
      { label: 'En az hamlede', value: r.optimal },
      { label: 'Fazla hamleyle', value: r.extra },
      { label: 'Çözülemedi', value: r.unsolved - r.idle },
      { label: 'Hiç top taşınmadı', value: r.idle },
    ]),
    spoken: [`En az hamlede: ${sayCount(r.optimal)}. Fazla hamleyle: ${sayCount(r.extra)}. Çözülemedi: ${sayCount(r.unsolved)}.`],
  });
  const kgPlan = blockBadge(c, 'kg_plan');
  const plan =
    r.medianPick === null
      ? null
      : measureCard({
          key: 'plan',
          title: 'İlk hamleden önceki süre',
          ...kgPlan,
          text: [
            'İlk topun alınmasına kadar geçen süre, hamle yapmadan önce düşünmeye ayrılan süreyi gösterir.',
            'Tipik süre bu sürelerin ortasındaki değerdir.',
            'Bazı kişiler hamle yaparken de plan yapar; bu süre tek başına iyi ya da kötü değildir.',
          ].join(' '),
          note: 'Her nokta bir problemde ilk hamleden önceki süre; kırmızı çizgi tipik süre.',
          visual: stripOf({
            label: 'İlk hamleden önceki süreler',
            rts: r.picks,
            median: r.medianPick,
            marker: `Tipik ${secTag(r.medianPick)}`,
            item: 'bir problem',
          }),
          spoken: kgPlan.badge ? undefined : [`İlk hamleden önceki tipik süre: ${secTag(r.medianPick)}.`],
        });
  const none = towerNone(r);
  const idle = towerIdle(r);
  const rapid = towerRapid(r);
  const need = Math.max(2, Math.ceil(r.rapidOf / 3));
  const checks = [
    check('bosta', 'Hiç top taşınmayan problemler', none || idle ? 'warn' : 'ok', {
      what: 'Bir problemde hiç top taşınmadan süre dolarsa çözüm kafada aranırken süre yetmemiş, ara verilmiş ya da yönerge anlaşılmamış olabilir. Problemlerin yarısında ve kısa problemlerin de yarısında böyleyse sonuç yorumlanmaz.',
      result: none
        ? v(c, 'Senin sonucunda bu görüldü; sonuç yorumlanmadı.', 'Çocuğunuzun sonucunda bu görüldü; sonuç yorumlanmadı.')
        : idle
          ? 'Birkaç problemde hiç top taşınmadı; sonuç dikkatle okunmalı.'
          : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'her problemde topları taşıyarak'),
      note: 'Kırmızı çizgiler hiç top taşınmayan problemlerin sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Hiç top taşınmayan', r.n, TOWER_IDLE_NOTE, [
        {
          label: 'Bütün problemler',
          value: r.idle,
          valueLabel: `${r.idle} problem`,
        },
        {
          label: 'Kısa problemler',
          value: r.short.idle,
          valueLabel: `${r.short.idle}/${r.short.n}`,
        },
      ]),
      spoken: [`Hiç top taşınmayan problemler: ${sayCount(r.idle)}; bunlardan kısa olanlar: ${sayCount(r.short.idle)}.`],
    }),
    check('hizli', 'Düşünmeden başlanan uzun problemler', r.rapidOf === 0 ? 'none' : rapid ? 'warn' : 'ok', {
      what: `${TOWER_RAPID_FROM} ve daha çok hamlelik problemlerde ilk top ${secLimit(TOWER_RAPID_MS)} saniyeden kısa sürede alınıp problem en az hamlede çözülemezse sayılır. Bu problemlerin üçte birinde böyleyse çalışma biçimi kartında söylenir.`,
      result: rapid
        ? v(
            c,
            'Senin problemlerinde bu görüldü; topa dokunmadan önce ilk hamleleri kafanda denemek işine yarayabilir.',
            'Çocuğunuzun problemlerinde bu görüldü; topa dokunmadan önce ilk hamleleri kafasında denemesi yardımcı olabilir.',
          )
        : r.rapidOf === 0
          ? 'Sayılacak uzun problem olmadığı için bu denetim yapılmadı.'
          : 'Bu sınırın altında kaldı.',
      note: 'Kırmızı çizgi bu tür problemlerin sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Hızlı başlanan uzun problemler', Math.max(1, r.rapidOf), need, [
        {
          label: `${TOWER_RAPID_FROM}+ hamlelik`,
          value: r.rapid,
          valueLabel: `${r.rapid} problem`,
        },
      ]),
      spoken: [`Hızlı başlanan uzun problemler: ${sayCount(r.rapid)}.`, `Uyarı sınırı: ${r.rapidOf} problemden ${need}.`],
    }),
    timingCard(c, {
      noun: 'problem',
      measured: traces.filter((t) => (t.response as { pick: number | null }).pick !== null).length,
      total: traces.length || 1,
    }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [optimal, ...(plan ? [plan] : [])],
    checks,
  };
}

/* ---------- Hesapla ve hatırla ---------- */

function complexSpanKind(c: Ctx, task: ComplexSpanTask): KindParts | null {
  const r = res<ComplexSpanResult>(c, 'hb_harf');
  if (!r) return null;
  const traces = [...(c.traces[task.key] ?? [])].sort((a, b) => Number(a.kind) - Number(b.kind) || a.index - b.index);
  const sizes = [...new Set(traces.map((t) => Number(t.kind)))];
  const letter = (x: number | null) => (x === null ? '–' : task.letters[x]);
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Diziler',
    noun: 'dizi',
    groups: sizes.map(String),
    groupCaption: 'Dizideki harf sayısı',
    rows: traces.map((t) => {
      const tr = t.response as ComplexSpanSetTrace;
      const set = task.sets[t.index];
      return {
        group: sizes.indexOf(Number(t.kind)),
        shown: `${set.letters.length} harf: ${set.letters.map((x) => task.letters[x]).join(' ')}`,
        status: t.status,
        given: tr.recall.every((x) => x === null) ? null : tr.recall.map(letter).join(' '),
        tags: [
          `${tr.correct}/${set.letters.length} harf doğru yerde`,
          `işlemler ${tr.opsCorrect}/${tr.ops} doğru`,
          ...(tr.opsTimeouts ? [`${tr.opsTimeouts} işlemde süre doldu`] : []),
        ],
        rtMs: null,
      };
    }),
    timed: false,
    noTime: true,
    okLabel: 'tam doğru',
    wrongLabel: 'eksik',
    none: 'boş',
    skipLabel: 'Bütün yerler boş',
  });
  const letters = measureCard({
    key: 'harf',
    title: 'Doğru yerde hatırlanan harfler',
    ...blockBadge(c, 'hb_harf'),
    text: [
      'Her harf, dizinin tamamı doğru olmasa da kendi yerinde hatırlandıysa bir puan alır.',
      'Doğru yerde olmayan harfler üç türe ayrılır: dizide olan ama yeri karışan, dizide olmayan ve boş kalan yer.',
    ].join(' '),
    note: 'Çubuk bütün harf yerlerini gösterir; parçalar doğru yerde, yeri karışan, dizide olmayan ve boş kalan yerlerdir.',
    visual: stackOf('Harf yerleri', [
      { label: 'Doğru yerde', value: r.correct },
      { label: 'Yeri karışan', value: r.order },
      { label: 'Dizide olmayan', value: r.intrusion },
      { label: 'Boş', value: r.blank },
    ]),
    spoken: [`Doğru yerde: ${sayCount(r.correct)}. Yeri karışan: ${sayCount(r.order)}. Dizide olmayan: ${sayCount(r.intrusion)}. Boş: ${sayCount(r.blank)}.`],
  });
  const O = r.ops;
  const ops = measureCard({
    key: 'islem',
    title: 'İşlemler',
    ...blockBadge(c, 'hb_islem'),
    text: [
      'Her harften önce kısa bir işlemin doğru olup olmadığına karar verilir.',
      `Bu tür testlerde işlemlerin en az %${Math.round(CS_OPS_TARGET * 100)}’inin doğru olması beklenir; işlemler yapılmadan harfleri akılda tutmak kolaylaşır.`,
      'Süresi dolan işlemler yanlış sayılır.',
    ].join(' '),
    note: 'Çubuk bütün işlemleri gösterir; parçalar doğru, yanlış ve süresi dolan işlemlerdir.',
    visual: stackOf('İşlemler', [
      { label: 'Doğru', value: O.correct },
      { label: 'Yanlış', value: O.wrong },
      { label: 'Süre doldu', value: O.timeouts },
    ]),
    spoken: [`İşlemlerde doğru: ${sayCount(O.correct)}. Yanlış: ${sayCount(O.wrong)}. Süre doldu: ${sayCount(O.timeouts)}.`],
  });
  const recallChance = complexSpanRecallChance(r);
  const slow = complexSpanOpsSlow(r);
  const rev = !slow && complexSpanOpsReversed(r);
  const ch = !slow && !rev && complexSpanOpsChance(r);
  const rapid = !slow && !rev && !ch && complexSpanRapid(r);
  const opsDone = slow || rev || ch;
  const rapidNeed = Math.ceil(O.n / 5);
  const checks = [
    check('harf-sans', 'Harflerde şans düzeyi', recallChance ? 'warn' : 'ok', {
      what: 'Harfleri rastgele seçen biri de birkaç yeri doğru bulabilir. Doğru yerde hatırlanan harfler bu kadar azsa sonuç yorumlanmaz.',
      result: recallChance ? v(c, 'Senin sonucun bu sınırda kaldı.', 'Çocuğunuzun sonucu bu sınırda kaldı.') : 'Bu sınırın üstünde.',
      todo: retake(c, 'harfleri sırayla akılda tutarak'),
      note: 'Kırmızı çizgi doğru yerde hatırlanan harfler; renkli bölge şansla da ulaşılabilecek bölge.',
      visual: countMeter(
        'Doğru yerdeki harfler',
        r.letters,
        CS_RECALL_CHANCE_MAX,
        [
          {
            label: 'Doğru yerde',
            value: r.correct,
            valueLabel: `${r.correct} harf`,
          },
        ],
        true,
      ),
      spoken: [`Doğru yerdeki harfler: ${sayCount(r.correct)}.`, `Şans bölgesi: ${CS_RECALL_CHANCE_MAX} ya da daha az.`],
    }),
    check('islem-sure', 'İşlemlerde süre', slow ? 'warn' : 'ok', {
      what: 'İşlemlerde doğrular az ve bunun nedeni süre aşımıysa harfleri tekrar etmeye zaman kalır; harf sonucu yorumlanmaz.',
      result: slow ? v(c, 'Senin işlemlerinde bu görüldü.', 'Çocuğunuzun işlemlerinde bu görüldü.') : 'Bu durum görülmedi.',
      todo: retake(c, 'işlemleri süresi içinde cevaplayarak'),
      note: 'Çubuk bütün işlemleri gösterir; parçalar doğru, yanlış ve süresi dolan işlemlerdir.',
      visual: stackOf('İşlemler', [
        { label: 'Doğru', value: O.correct },
        { label: 'Yanlış', value: O.wrong },
        { label: 'Süre doldu', value: O.timeouts },
      ]),
      spoken: [`Süresi dolan işlemler: ${sayCount(O.timeouts)}.`],
    }),
    check('islem-sans', 'İşlemlerde şans düzeyi', slow ? 'none' : rev || ch ? 'warn' : 'ok', {
      what: 'İki düğmeyle verilen işlem cevaplarında rastgele basan biri de yarısını bulur. Doğrular yarıdan belirgin biçimde fazla değilse düğmeler ters kullanılmış ya da rastgele basılmış olabilir.',
      result: slow
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : rev
          ? 'İşlemlerin çoğuna yanlış cevap verildi; DOĞRU ve YANLIŞ düğmeleri ters kullanılmış olabilir.'
          : ch
            ? v(c, 'Senin işlem cevaplarında bu görüldü.', 'Çocuğunuzun işlem cevaplarında bu görüldü.')
            : 'Bu sınırın üstünde.',
      todo: retake(c, 'her işlemi hesaplayarak'),
      note: 'Kırmızı çizgi doğru işlem sayısı; renkli bölge şansla da ulaşılabilecek bölge.',
      visual: countMeter(
        'Doğru işlemler',
        O.n,
        CS_OPS_CHANCE_MAX,
        [
          {
            label: 'Doğru işlem',
            value: O.correct,
            valueLabel: `${O.correct} işlem`,
          },
        ],
        true,
      ),
      spoken: [`Doğru işlemler: ${sayCount(O.correct)}.`, `Şans bölgesi: ${CS_OPS_CHANCE_MAX} ya da daha az.`],
    }),
    check('islem-hizli', 'Çok hızlı işlem cevapları', opsDone ? 'none' : rapid ? 'warn' : 'ok', {
      what: `Bir işlemi okuyup hesaplamak için ${secLimit(CS_RAPID_MS)} saniyeden kısa süre yetmez. İşlemlerin beşte birinde böyleyse “Dikkat” yazar.`,
      result: opsDone
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : rapid
          ? v(c, 'Senin işlem cevaplarında bu görüldü.', 'Çocuğunuzun işlem cevaplarında bu görüldü.')
          : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'işlemlere bakarak'),
      note: 'Kırmızı çizgi çok hızlı işlem cevaplarının sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Çok hızlı işlem cevapları', O.n, rapidNeed, [
        {
          label: 'Çok hızlı',
          value: O.rapid,
          valueLabel: `${O.rapid} işlem`,
        },
      ]),
      spoken: [`Çok hızlı işlem cevapları: ${sayCount(O.rapid)}.`, `Uyarı sınırı: ${rapidNeed}.`],
    }),
  ];
  return {
    name: task.name,
    answers: [answers],
    levels: [letters, ops],
    checks,
  };
}

/* ---------- Desen hatırlama ---------- */

function patternKind(c: Ctx, task: PatternMemoryTask): KindParts | null {
  const r = res<PatternResult>(c, 'dh_aralik');
  if (!r) return null;
  const sizes = r.levels.map((l) => l.size);
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Desenler',
    noun: 'desen',
    groups: sizes.map(String),
    groupCaption: 'Desendeki kare sayısı',
    rows: r.items.map((x) => ({
      group: sizes.indexOf(x.size),
      shown: `${x.size} kareli desen`,
      status: x.skipped ? 'skip' : x.correct ? 'correct' : 'wrong',
      given: x.skipped ? null : `${x.hits}/${x.size} kare doğru yerde${x.extra ? `, ${x.extra} fazla kare` : ''}`,
      tags: [
        ...(x.near ? ['yalnızca bir kare farklı'] : []),
        ...(x.shifted ? ['bir kare yanına kaymış'] : []),
        ...(x.restarts ? [`desen ${x.restarts} kez yeniden gösterildi`] : []),
      ],
      rtMs: x.skipped ? null : x.rt,
      rapid: !x.correct && !x.skipped && !x.near && 2 * x.hits < x.size && x.rt !== null && x.rt < PATTERN_RAPID_BASE_MS + PATTERN_RAPID_MS_PER_CELL * x.marked,
    })),
    timed: true,
    none: '“Hatırlamıyorum”',
    skipLabel: '“Hatırlamıyorum”',
  });
  const ladder: LadderVisual = {
    type: 'ladder',
    label: 'Desen büyüklüklerine göre sonuçlar',
    rows: task.levels.map((l, i) => ({
      length: l.cells,
      results: r.items.slice(i * 3, i * 3 + 3).map((x) => x.correct),
    })),
    reached: r.span || null,
    unit: 'kare',
    caption: 'Desendeki kare sayısı',
  };
  const span = measureCard({
    key: 'aralik',
    title: 'En büyük doğru desen',
    ...blockBadge(c, 'dh_aralik'),
    text: [
      'Desenler küçükten büyüğe gider; her büyüklükte üç desen gösterilir.',
      'Bir büyüklüğün üç deseninin hiçbiri tam doğru değilse görev biter.',
      'En büyük doğru desen, tam doğru işaretlenen en büyük desendir.',
    ].join(' '),
    note: 'Her sütun bir desen büyüklüğü; dolu daire tam doğru, boş daire yanlış desen.',
    visual: ladder,
    spoken: r.span && c.block('dh_aralik')?.headline ? undefined : [r.span ? `En büyük doğru desen: ${r.span} kare.` : 'En küçük desenlerin de hiçbiri tam doğru değil.'],
  });
  const cells = measureCard({
    key: 'kare',
    title: 'Doğru işaretlenen kareler',
    ...blockBadge(c, 'dh_desen'),
    text: 'Desenlerdeki dolu karelerden doğru yerde işaretlenenler sayılır. Kısmi puan, her desende doğru işaretlenen karelerden desende olmayan işaretlerin çıkarılmasıyla bulunur.',
    note: 'Çubuk gösterilen bütün dolu kareleri gösterir; parçalar doğru işaretlenen ve işaretlenmeyen karelerdir.',
    visual: stackOf('Gösterilen kareler', [
      { label: 'Doğru işaretlenen', value: r.cellsHit },
      { label: 'İşaretlenmeyen', value: r.cellsShown - r.cellsHit },
    ]),
    spoken: [`Doğru işaretlenen kareler: ${sayCount(r.cellsHit)}. İşaretlenmeyen: ${sayCount(r.cellsShown - r.cellsHit)}.`],
  });
  const floor = patternFloor(r);
  const skipped = !floor && patternManySkipped(r);
  const rapid = !floor && patternRapid(r);
  const checks = [
    check('en-kucuk', 'En küçük desenler', floor ? 'warn' : 'ok', {
      what: 'En küçük desenlerin hiçbiri tam doğru hatırlanmazsa bir desen büyüklüğü ölçülmüş olmaz ve sonuç yorumlanmaz.',
      result: floor ? v(c, 'Senin sonucunda bu oldu.', 'Çocuğunuzun sonucunda bu oldu.') : 'En küçük desenlerden en az biri doğru.',
      todo: retake(c, 'deseni dikkatle izleyerek'),
      note: 'Kırmızı çizgi en küçük büyüklükte tam doğru desen sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter(
        'En küçük desenler',
        3,
        0,
        [
          {
            label: `${r.start} kare`,
            value: r.levels[0]?.correct ?? 0,
            valueLabel: `${r.levels[0]?.correct ?? 0}/3 doğru`,
          },
        ],
        true,
      ),
      spoken: [`En küçük desenlerde doğru: ${sayCount(r.levels[0]?.correct ?? 0)}.`],
    }),
    check('hatirlamiyorum', '“Hatırlamıyorum” cevapları', floor ? 'none' : skipped ? 'warn' : 'ok', {
      what: 'Testin bittiği büyüklükten önceki desenlerin yarısında ya da daha çoğunda “Hatırlamıyorum” denirse dikkat dalgalanmış olabilir.',
      result: floor
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : skipped
          ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
          : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'emin olmasan da deneyerek'),
      note: 'Çubuk testin bittiği büyüklükten önceki desenler; dolu kısım “Hatırlamıyorum” denenler.',
      visual: shareBars('Bitişten önceki desenler', [
        {
          label: '“Hatırlamıyorum”',
          value: r.skippedBeforeStop,
          max: Math.max(1, r.beforeStop),
        },
      ]),
      spoken: r.beforeStop ? [`Bitişten önceki ${r.beforeStop} desenden hatırlamıyorum denen: ${sayCount(r.skippedBeforeStop)}.`] : [],
    }),
    check('hizli', 'Çok hızlı işaretlenen desenler', floor ? 'none' : rapid ? 'warn' : 'ok', {
      what: 'Çok kısa sürede işaretlenen ve karelerinin çoğu yanlış olan desenler sayılır. En az üç desen ve yanlışların üçte biriyse “Dikkat” yazar.',
      result: floor
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : rapid
          ? v(c, 'Senin desenlerinde bu görüldü.', 'Çocuğunuzun desenlerinde bu görüldü.')
          : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'kareleri dikkatle işaretleyerek'),
      note: 'Kırmızı çizgi çok hızlı işaretlenen desenlerin sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Çok hızlı desenler', Math.max(3, r.attemptedWrong), Math.max(3, Math.ceil(r.attemptedWrong / 3)), [
        {
          label: 'Çok hızlı',
          value: r.rapid,
          valueLabel: `${r.rapid} desen`,
        },
      ]),
      spoken: [`Çok hızlı işaretlenen desenler: ${sayCount(r.rapid)}.`],
    }),
    check('baslangic', 'Desenin yeniden gösterilmesi', r.restarts >= PATTERN_RESTARTS_NOTE ? 'warn' : 'ok', {
      what: 'Desen gösterilirken başka bir uygulamaya geçilirse desen yeniden gösterilir. Birkaç kez olursa sonuç biraz yükselmiş olabilir.',
      result: r.restarts >= PATTERN_RESTARTS_NOTE ? `Desenler ${r.restarts} kez yeniden gösterildi.` : 'Bu sınırın altında kaldı.',
      note: 'Kırmızı çizgi yeniden gösterilme sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Yeniden gösterilme', Math.max(4, r.restarts), PATTERN_RESTARTS_NOTE, [
        {
          label: 'Yeniden gösterilme',
          value: r.restarts,
          valueLabel: `${r.restarts} kez`,
        },
      ]),
      spoken: [`Yeniden gösterilme: ${sayCount(r.restarts)}.`],
    }),
    timingCard(c, {
      noun: 'desen',
      measured: r.items.filter((x) => x.rt !== null).length,
      total: r.items.length,
    }),
  ];
  return { name: task.name, answers: [answers], levels: [span, cells], checks };
}

/* ---------- Harf-sayı sıralama ---------- */

const LN_KIND: Record<string, string> = {
  shown: 'gösterilen sırayla, sıralanmadan',
  grouped: 'önce sayılar, sonra harfler; kendi içinde sırasız',
  lettersFirst: 'önce harfler, sonra sayılar',
  order: 'sıra karışık',
  items: 'eksik ya da fazla öğe',
};

function letterNumberKind(c: Ctx, task: LetterNumberTask): KindParts | null {
  const r = res<LetterNumberResult>(c, 'hs_aralik');
  if (!r) return null;
  const lengths = r.levels.map((l) => l.length);
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Diziler',
    noun: 'dizi',
    groups: lengths.map(String),
    groupCaption: 'Dizideki öğe sayısı',
    rows: r.items.map((x) => ({
      group: lengths.indexOf(x.length),
      shown: `${x.length} öğe: ${[...x.seq].join(' ')}`,
      status: x.skipped ? 'skip' : x.correct ? 'correct' : 'wrong',
      given: x.skipped ? null : x.response.join(' '),
      expected: x.correct ? null : lnAnswer(x.seq).join(' '),
      tags: [...(!x.correct && !x.skipped && x.kind ? [LN_KIND[x.kind]] : []), ...(x.restarts ? [`dizi ${x.restarts} kez yeniden gösterildi`] : [])],
      rtMs: x.skipped ? null : x.rt,
      rapid: !x.correct && !x.skipped && 2 * x.recalled < x.length && x.rt !== null && x.rt < LN_RAPID_BASE_MS + LN_RAPID_MS_PER_ITEM * x.response.length,
    })),
    timed: true,
    none: '“Hatırlamıyorum”',
    skipLabel: '“Hatırlamıyorum”',
    // Dizi görevleri "yeniden çözmede alıştırma" türündedir (lib/compare/tasks.ts): doğru sıra yazılır.
    showKey: true,
  });
  const ladder: LadderVisual = {
    type: 'ladder',
    label: 'Dizi uzunluklarına göre sonuçlar',
    rows: task.levels.map((l, i) => ({
      length: l.length,
      results: r.items.slice(i * 3, i * 3 + 3).map((x) => x.correct),
    })),
    reached: r.span || null,
    unit: 'öğe',
    caption: 'Dizideki öğe sayısı',
  };
  const span = measureCard({
    key: 'aralik',
    title: 'En uzun doğru dizi',
    ...blockBadge(c, 'hs_aralik'),
    text: [
      'Doğru cevapta önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla yazılır.',
      'Her uzunlukta üç dizi gösterilir; üçü de yanlışsa görev biter.',
      'En uzun doğru dizi, tam doğru sıralanan en uzun dizidir.',
    ].join(' '),
    note: 'Her sütun bir dizi uzunluğu; dolu daire doğru, boş daire yanlış dizi.',
    visual: ladder,
    spoken: r.span && c.block('hs_aralik')?.headline ? undefined : [r.span ? `En uzun doğru dizi: ${r.span} öğe.` : 'En kısa dizilerin de hiçbiri doğru sıralanmadı.'],
  });
  const items = measureCard({
    key: 'oge',
    title: 'Hatırlanan öğeler',
    ...blockBadge(c, 'hs_turler'),
    text: 'Bütün dizilerde gösterilen öğelerden cevapta yer alanlar sayılır; sıra doğru olmasa da. Bu, sıralamadan ayrı olarak akılda tutmayı gösterir.',
    note: 'Çubuk gösterilen bütün öğeleri gösterir; parçalar cevapta yer alan ve almayan öğelerdir.',
    visual: stackOf('Gösterilen öğeler', [
      { label: 'Cevapta yer alan', value: r.itemsRecalled },
      { label: 'Yer almayan', value: r.itemsShown - r.itemsRecalled },
    ]),
    spoken: [`Cevapta yer alan öğeler: ${sayCount(r.itemsRecalled)}. Yer almayan: ${sayCount(r.itemsShown - r.itemsRecalled)}.`],
  });
  const floor = lnFloor(r);
  const unsorted = !floor && lnUnsorted(r);
  const lf = !floor && !unsorted && lnLettersFirstHabit(r);
  const skipped = !floor && lnManySkipped(r);
  const rapid = !floor && lnRapid(r);
  const checks = [
    check('en-kisa', 'En kısa diziler', floor ? 'warn' : 'ok', {
      what: 'En kısa dizilerin hiçbiri doğru sıralanmazsa bir dizi uzunluğu ölçülmüş olmaz ve sonuç yorumlanmaz.',
      result: floor ? v(c, 'Senin sonucunda bu oldu.', 'Çocuğunuzun sonucunda bu oldu.') : 'En kısa dizilerden en az biri doğru.',
      todo: retake(c, 'kuralı yeniden okuyarak'),
      note: 'Kırmızı çizgi en kısa uzunlukta doğru dizi sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter(
        'En kısa diziler',
        3,
        0,
        [
          {
            label: `${r.start} öğe`,
            value: r.levels[0]?.correct ?? 0,
            valueLabel: `${r.levels[0]?.correct ?? 0}/3 doğru`,
          },
        ],
        true,
      ),
      spoken: [`En kısa dizilerde doğru: ${sayCount(r.levels[0]?.correct ?? 0)}.`],
    }),
    check('kural', 'Sıralama kuralı', floor ? 'none' : unsorted || lf ? 'warn' : 'ok', {
      what: 'Yanlışların çoğunda öğeler sıralanmadan ya da önce harfler yazılmışsa ve kural uzun dizilerde de gösterilmediyse, kural tam uygulanmamış olabilir.',
      result: floor
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : unsorted
          ? 'Yanlışların çoğunda öğeler sıralanmadan girildi.'
          : lf
            ? 'Yanlışların çoğunda önce harfler, sonra sayılar yazıldı.'
            : 'Bu durum görülmedi.',
      todo: v(c, 'Yeniden yaparsan önce sayıları küçükten büyüğe yaz.', 'Yeniden yaparsa önce sayıları küçükten büyüğe yazmasını hatırlatabilirsiniz.'),
      note: 'Çubuklar yanlış dizilerin türleri.',
      visual: shareBars('Yanlış dizilerin türleri', [
        {
          label: 'Sıralanmadan',
          value: r.kinds.shown + r.kinds.grouped,
          max: Math.max(1, r.attemptedWrong),
        },
        {
          label: 'Önce harfler',
          value: r.kinds.lettersFirst,
          max: Math.max(1, r.attemptedWrong),
        },
        {
          label: 'Başka',
          value: r.kinds.order + r.kinds.items,
          max: Math.max(1, r.attemptedWrong),
        },
      ]),
      spoken: [
        `Sıralanmadan: ${sayCount(r.kinds.shown + r.kinds.grouped)}. Önce harfler: ${sayCount(r.kinds.lettersFirst)}. Başka: ${sayCount(r.kinds.order + r.kinds.items)}.`,
      ],
    }),
    check('hatirlamiyorum', '“Hatırlamıyorum” cevapları', floor ? 'none' : skipped ? 'warn' : 'ok', {
      what: 'Testin bittiği uzunluktan önceki dizilerin yarısında ya da daha çoğunda “Hatırlamıyorum” denirse dikkat dalgalanmış olabilir.',
      result: floor
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : skipped
          ? v(c, 'Senin cevaplarında bu görüldü.', 'Çocuğunuzun cevaplarında bu görüldü.')
          : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'emin olmasan da deneyerek'),
      note: 'Çubuk testin bittiği uzunluktan önceki diziler; dolu kısım “Hatırlamıyorum” denenler.',
      visual: shareBars('Bitişten önceki diziler', [
        {
          label: '“Hatırlamıyorum”',
          value: r.skippedBeforeStop,
          max: Math.max(1, r.beforeStop),
        },
      ]),
      spoken: r.beforeStop ? [`Bitişten önceki ${r.beforeStop} diziden hatırlamıyorum denen: ${sayCount(r.skippedBeforeStop)}.`] : [],
    }),
    check('hizli', 'Çok hızlı girilen diziler', floor ? 'none' : rapid ? 'warn' : 'ok', {
      what: 'Çok kısa sürede girilen ve öğelerinin çoğu eksik ya da yanlış olan diziler sayılır. En az üç dizi ve yanlışların üçte biriyse “Dikkat” yazar.',
      result: floor
        ? 'Yukarıdaki denetim nedeniyle bu denetim ayrıca yapılmadı.'
        : rapid
          ? v(c, 'Senin dizilerinde bu görüldü.', 'Çocuğunuzun dizilerinde bu görüldü.')
          : 'Bu sınırın altında kaldı.',
      todo: retake(c, 'öğeleri dikkatle girerek'),
      note: 'Kırmızı çizgi çok hızlı girilen dizilerin sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Çok hızlı diziler', Math.max(3, r.attemptedWrong), Math.max(3, Math.ceil(r.attemptedWrong / 3)), [
        {
          label: 'Çok hızlı',
          value: r.rapid,
          valueLabel: `${r.rapid} dizi`,
        },
      ]),
      spoken: [`Çok hızlı girilen diziler: ${sayCount(r.rapid)}.`],
    }),
    check('baslangic', 'Dizinin yeniden gösterilmesi', r.restarts >= LN_RESTARTS_NOTE ? 'warn' : 'ok', {
      what: 'Dizi gösterilirken başka bir uygulamaya geçilirse dizi yeniden gösterilir. Birkaç kez olursa sonuç biraz yükselmiş olabilir.',
      result: r.restarts >= LN_RESTARTS_NOTE ? `Diziler ${r.restarts} kez yeniden gösterildi.` : 'Bu sınırın altında kaldı.',
      note: 'Kırmızı çizgi yeniden gösterilme sayısı; renkli bölge uyarı bölgesi.',
      visual: countMeter('Yeniden gösterilme', Math.max(4, r.restarts), LN_RESTARTS_NOTE, [
        {
          label: 'Yeniden gösterilme',
          value: r.restarts,
          valueLabel: `${r.restarts} kez`,
        },
      ]),
      spoken: [`Yeniden gösterilme: ${sayCount(r.restarts)}.`],
    }),
    timingCard(c, {
      noun: 'dizi',
      measured: r.items.filter((x) => x.rt !== null).length,
      total: r.items.length,
    }),
  ];
  return { name: task.name, answers: [answers], levels: [span, items], checks };
}

/* ---------- Dağıtım ---------- */

/** Düzeyli seçenekli testler dışındaki görevlerin katkısı (lib/reports/task-parts.ts). */
export function moreKinds(c: Ctx, task: CognitiveTask, done: Set<string>): KindParts | null {
  switch (task.kind) {
    case 'number_series': {
      const r = res<NumberSeriesResult>(c, 'sd_dogru');
      return r
        ? seriesKind(c, {
            task,
            r,
            prefix: 'sd',
            unit: 'sayı',
            fewMax: NUMBER_FEW_MAX,
            skippedMost: numberSeriesMostlySkipped(r),
            rapid: numberSeriesRapid(r),
            same: numberSeriesSameAnswer(r),
          })
        : null;
    }
    case 'letter_series': {
      const r = res<LetterSeriesResult>(c, 'hd_dogru');
      return r
        ? seriesKind(c, {
            task,
            r,
            prefix: 'hd',
            unit: 'harf',
            fewMax: LETTER_FEW_MAX,
            skippedMost: letterSeriesMostlySkipped(r),
            rapid: letterSeriesRapid(r),
            same: letterSeriesSameAnswer(r),
          })
        : null;
    }
    case 'logical_reasoning': {
      const r = res<LogicResult>(c, 'ma_dogru');
      return r ? logicKind(c, task, r) : null;
    }
    case 'numerical_reasoning': {
      const r = res<NumericResult>(c, 'sy_dogru');
      return r ? numericKind(c, task, r) : null;
    }
    case 'cognitive_reflection': {
      const r = res<ReflectionResult>(c, 'dk_dogru');
      return r ? reflectionKind(c, task, r) : null;
    }
    case 'mental_rotation_3d': {
      const r = res<Rotation3dResult>(c, 'ud_dogru');
      return r ? rotation3dKind(c, task, r) : null;
    }
    case 'perspective': {
      const r = res<PerspectiveResult>(c, 'ba_hata');
      return r ? perspectiveKind(c, task, r) : null;
    }
    case 'mental_arithmetic': {
      if (done.has('arith')) return null;
      done.add('arith');
      return arithmeticKind(
        c,
        c.def.tasks.filter((t): t is MentalArithmeticTask => t.kind === 'mental_arithmetic'),
      );
    }
    case 'digit_span':
      return spanKind(c, task, task.direction === 'forward' ? 'digit_forward' : 'digit_backward');
    case 'spatial_span':
      return spanKind(c, task, 'spatial');
    case 'flanker':
      return flankerKind(c, task);
    case 'symbol_match':
      return symbolKind(c, task);
    case 'cancellation':
      return cancellationKind(c, task);
    case 'color_word':
      return colorWordKind(c, task);
    case 'go_nogo':
      return goNoGoKind(c, task);
    case 'trail':
      return trailKind(c, task);
    case 'n_back':
      return nBackKind(c, task);
    case 'mental_rotation':
      return rotationKind(c, task);
    case 'reaction_time':
      return reactionKind(c, task);
    case 'rule_switch':
      return ruleSwitchKind(c, task);
    case 'symbol_search':
      return symbolSearchKind(c, task);
    case 'word_list':
      return wordListKind(c, task);
    case 'tower':
      return towerKind(c, task);
    case 'complex_span':
      return complexSpanKind(c, task);
    case 'pattern_memory':
      return patternKind(c, task);
    case 'letter_number':
      return letterNumberKind(c, task);
    default:
      return null;
  }
}

/** "toplama", "toplama ve bölme", "toplama, çıkarma ve bölme" */
function joinAnd(xs: string[]): string {
  return xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`;
}
