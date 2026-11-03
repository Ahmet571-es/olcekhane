import {
  ASSEMBLY_CHANCE_MAX,
  ASSEMBLY_RAPID_MS,
  ASSEMBLY_SAME_MAX_CORRECT,
  ANALOGY_CHANCE_MAX,
  ANALOGY_RAPID_MS,
  ANALOGY_SAME_MAX_CORRECT,
  CUBE_CHANCE_MAX,
  CUBE_RAPID_MS,
  CUBE_SAME_MAX_CORRECT,
  FOLDING_CHANCE_MAX,
  FOLDING_RAPID_MS,
  FOLDING_SAME_MAX_CORRECT,
  HIDDEN_CHANCE_MAX,
  HIDDEN_RAPID_MS,
  HIDDEN_SAME_MAX_CORRECT,
  MATRIX_CHANCE_MAX,
  MATRIX_SAME_MAX_CORRECT,
  VERBAL_CHANCE_MAX,
  VERBAL_SAME_MAX_CORRECT,
  VOCABULARY_CHANCE_MAX,
  VOCABULARY_SAME_MAX_CORRECT,
  LEVEL_ONE_CHANCE_P,
  analogyChance,
  chanceAtLeast,
  analogyRapid,
  analogySamePosition,
  assemblyChance,
  assemblyRapid,
  assemblySamePosition,
  cubeChance,
  cubeRapid,
  cubeSamePosition,
  foldingChance,
  foldingRapid,
  foldingSamePosition,
  hiddenChance,
  hiddenRapid,
  hiddenSamePosition,
  matrixChance,
  matrixRapid,
  matrixSamePosition,
  verbalChance,
  verbalRapid,
  verbalSamePosition,
  vocabularyChance,
  vocabularyRapid,
  vocabularySamePosition,
  type AnalogyResult,
  type AssemblyResult,
  type CubeResult,
  type FoldingResult,
  type HiddenResult,
  type ItemTrace,
  type MatrixResult,
  type VerbalResult,
  type VocabularyResult,
} from '@/lib/scoring/tasks';
import { SAME_ITEMS, SAME_PLURAL, sameNounOf } from '@/lib/compare/tasks';
import type {
  CognitiveTask,
  CubeNetTask,
  FiguralAnalogyTask,
  HiddenFiguresTask,
  MatrixReasoningTask,
  PaperFoldingTask,
  ShapeAssemblyTask,
  TaskInstrument,
  VerbalReasoningTask,
  VocabularyTask,
} from '@/lib/instruments/types';
import {
  ANALOGY_LURE_NAMES,
  ASSEMBLY_LURE_NAMES,
  CUBE_LURE_TEXT,
  FOLDING_LURE_TEXT,
  HIDDEN_LURE_SEEN,
  VOCABULARY_LURE_TEXT,
  secShort,
  type ReportContent,
  type ReportScore,
} from './build';
import type { PartCard, PartGroup, ReportPart } from './parts';
import type { SimpleReport } from './simple';
import {
  QUALITY_TITLE,
  blockBadge,
  cap,
  check,
  countMeter,
  itemsCard,
  levelsCard,
  lower,
  measureCard,
  medianText,
  read,
  retake,
  sayCount,
  secLimit,
  stackOf,
  stripOf,
  timingCard,
  v,
  type Ctx,
  type ItemRow,
  type KindParts,
} from './task-parts-core';
import { moreKinds } from './task-parts-kinds';

/**
 * Görev (zekâ ve dikkat) testlerinin ek rapor bölümleri (site sahibinin 2026-10-31 isteği; model lib/reports/parts.ts; aşama b):
 *  1. "Düzeylerin ve ölçülerin anlamı": düzeyli testlerde her düzeyin ne istediği (testin kendi anlatımı) ve kişinin ulaştığı
 *     düzey; raporda geçen her ölçünün (doğru sayısı, tipik süre, dizi uzunluğu, dakikada doğru…) ne anlattığı ve nasıl
 *     hesaplandığı, değeri grafikte testin kendi sınırlarıyla. Norm ve başkalarıyla karşılaştırma yoktur.
 *  2. "Soru soru cevapların" (hızlı görevlerde "Deneme deneme sonuçların"): her soru ya da deneme (ne gösterildi, verilen
 *     cevap, doğrusu, yanlışın türü, süre) ve soru şeridi; yüzlerce denemeli hızlı görevlerde bölüm bölüm özet (eksiksiz:
 *     her deneme bir parçada sayılır). Görevdeki cevaplar kişisel bir görüş değil performans olduğu için veli raporunda da
 *     vardır. PDF'te yol haritasından sonra ektir.
 *  3. "Sonuca ne kadar güvenebiliriz?": testin var olan denetimleri (şans düzeyi, çok hızlı cevaplar, hep aynı yer ya da
 *     düğme, "Bilmiyorum", çok az cevap, sayfadan ayrılma, sürelerin ölçümü) kart kart; sınırlar ve kararlar uyarılarla ve
 *     sonuç kartlarının "yorumlanmadı" kararlarıyla aynıdır (lib/scoring/tasks.ts'teki ortak işlevler ve sabitler).
 * Puanlamanın soru soru sonuçları (`ItemTrace`) lib/scoring/tasks.ts'te sonucu hesaplayan aynı kararlardan kurulur.
 */

/* ---------- Düzeyli, seçenekli testler ---------- */

interface ChoiceSpec {
  task: CognitiveTask & { key: string; name: string; items: { level: number }[]; levels: { level: number; name: string; plain: string }[] };
  r: MatrixResult | VerbalResult | FoldingResult | VocabularyResult | CubeResult | HiddenResult | AssemblyResult | AnalogyResult;
  prefix: string;
  options: number;
  chanceMax: number;
  chance: boolean;
  /** Şans kuralının anlatımı (şekil benzetmelerinde ayrıca 1. düzeyin dört sorusunun üçü). */
  chanceRule: string;
  rapid: boolean;
  /** Çok hızlı sınırı (ms) sabitse; soruya göre değişiyorsa (sözel testler) null. */
  rapidMs: number | null;
  /** "tabloya bakıp kuralı bulmak" */
  seeing: string;
  samePos: boolean;
  sameMax: number;
  shown: (i: number) => { text: string; say?: string };
  given: (resp: number, i: number) => string;
  answer: (i: number) => string;
  lure: (lure: string) => string;
}

function choiceKind(c: Ctx, s: ChoiceSpec): KindParts {
  const { r, task, prefix } = s;
  const traces = c.traces[task.key] ?? [];
  const n = r.n;
  const rapidText = s.rapidMs !== null ? `${secLimit(s.rapidMs)} saniyeden kısa sürede` : 'soru ve seçenekler okunamayacak kadar kısa sürede';
  const rows: ItemRow[] = traces.map((t) => {
    const level = task.items[t.index].level;
    const sh = s.shown(t.index);
    return {
      group: level - 1,
      shown: `${level}. düzey${sh.text ? ` · ${sh.text}` : ''}`,
      place: `${level}. düzey`,
      ...(sh.say ? { say: `${level}. düzey. ${sh.say}` } : {}),
      status: t.status,
      given: s.given(t.response as number, t.index),
      expected: t.status === 'correct' ? null : s.answer(t.index),
      tags: t.lure ? [s.lure(t.lure)] : [],
      rtMs: t.rtMs,
      rapid: !!t.rapid,
    };
  });
  const answers = itemsCard(c, {
    key: task.key,
    title: 'Sorular',
    noun: 'soru',
    groups: task.levels.map((l) => `${l.level}.`),
    groupCaption: 'Düzeyler, kolaydan zora',
    rows,
    timed: true,
    ...(s.rapidMs !== null ? { rapid: { ms: s.rapidMs, label: `çok hızlı: ${secLimit(s.rapidMs)} sn altı` } } : {}),
  });

  /* Düzeyler ve ölçüler */
  const duzey = c.block(`${prefix}_duzey`);
  const levels = levelsCard(c, {
    key: 'duzeyler',
    levels: task.levels,
    results: r.levels,
    reached: r.reached,
    read: read(c, `${prefix}_duzey`),
    headline: duzey?.headline,
  });
  const accuracy = measureCard({
    key: 'dogru',
    title: 'Doğru sayısı',
    ...blockBadge(c, `${prefix}_dogru`),
    text: [
      'Doğru sayısı, doğru cevaplanan soruların sayısıdır; her soru aynı değerdedir.',
      'Yanlış bir cevap puandan bir şey götürmez.',
      `Her soruda ${s.options} seçenek olduğu için rastgele seçen biri de ortalama her ${s.options} sorudan birini bulur.`,
      `Bu yüzden çok az doğru, şansla da açıklanabilir; bunu “${QUALITY_TITLE}” bölümü ayrıca denetler.`,
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
          // Süre sınırının olmadığı ve hızın tek başına iyi ya da kötü olmadığı raporun "Çalışma biçimi" kartında yazar.
          text: [medianText('soru', 'sorunun ekrana gelmesinden cevabın verilmesine kadar'), 'Zor bir soruda daha uzun düşünmek olağandır.'].join(' '),
          note: 'Her nokta bir sorunun süresi; kırmızı çizgi tipik süre.',
          visual: stripOf({ label: 'Sorulardaki cevap süreleri', rts: r.rts, median: r.medianRt, marker: `Tipik ${secShort(r.medianRt)}`, item: 'bir soru' }),
        });

  /* Denetimler */
  const lowCorrect = r.correct <= s.chanceMax;
  // Doğrular az ama sonuç yorumlandıysa ulaşılan düzeye kadarki doğruların rastgele seçimle çıkma olasılığı: yalnızca %5'ten
  // küçükse "şansla açıklanamayacak kadar çok" denir (lib/scoring/tasks.ts, levelOneByChance ile aynı ölçüt).
  const upTo = r.levels.filter((l) => l.level <= r.reached);
  const tail = chanceAtLeast(
    upTo.reduce((a, l) => a + l.correct, 0),
    upTo.reduce((a, l) => a + l.n, 0),
    s.options,
  );
  const chanceCard = check('sans', 'Şans düzeyi', s.chance ? 'warn' : 'ok', {
    what: `${s.options} seçenekli bu testte rastgele seçen biri de birkaç soruyu doğru bulabilir. ${s.chanceRule}`,
    result: s.chance
      ? v(
          c,
          'Senin sonucun bu sınırda kaldı; bu yüzden doğru sayısı ve düzey yorumlanmadı.',
          'Çocuğunuzun sonucu bu sınırda kaldı; bu yüzden doğru sayısı ve düzey yorumlanmadı.',
        )
      : lowCorrect && tail < LEVEL_ONE_CHANCE_P
        ? v(
            c,
            'Doğru cevapların az, ama kolay sorulardaki doğrular şansla açıklanamayacak kadar çok; sonuç yorumlandı.',
            'Çocuğunuzun doğru cevapları az, ama kolay sorulardaki doğrular şansla açıklanamayacak kadar çok; sonuç yorumlandı.',
          )
        : lowCorrect
          ? v(
              c,
              'Doğru cevapların az, ama birden çok düzeye ulaştığın için sonuç yorumlandı.',
              'Çocuğunuzun doğru cevapları az, ama birden çok düzeye ulaştığı için sonuç yorumlandı.',
            )
          : v(
              c,
              'Doğru cevapların rastgele seçimle beklenenin belirgin biçimde üstünde.',
              'Çocuğunuzun doğru cevapları rastgele seçimle beklenenin belirgin biçimde üstünde.',
            ),
    todo: retake(c, 'her soruya bakarak'),
    note: 'Kırmızı çizgi doğru sayısı; renkli bölge şansla da ulaşılabilecek doğru sayıları.',
    // Doğrular bu bölgede ama sonuç yorumlandıysa bölge bu kişi için bir uyarı değildir (renksiz çizilir).
    visual: countMeter(
      'Doğru cevaplar',
      n,
      s.chanceMax,
      [{ label: v(c, 'Doğru cevapların', 'Doğru cevaplar'), value: r.correct, valueLabel: `${r.correct} doğru` }],
      true,
      {
        warnLabel: 'Şansla da ulaşılabilir',
        calm: !s.chance,
      },
    ),
    spoken: [`Doğru cevaplar: ${sayCount(r.correct)}.`, `Şansla da ulaşılabilecek bölge: ${s.chanceMax} ya da daha az doğru.`],
  });
  const timed = traces.some((t) => t.rtMs !== null);
  const need = Math.max(2, Math.ceil(r.rapidOf / 4));
  const rapidCard = !timed
    ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
        what: `3. düzey ve üstündeki sorularda ${rapidText} verilen yanlış cevaplar sayılır.`,
        result: 'Süreler ölçülemediği için bu denetim yapılamadı.',
      })
    : r.rapidOf === 0
      ? check('hizli', 'Çok hızlı yanlış cevaplar', 'none', {
          what: `3. düzey ve üstündeki sorularda ${rapidText} verilen yanlış cevaplar sayılır.`,
          result: 'Bu sorularda sayılacak cevap olmadığı için bu denetim yapılmadı.',
        })
      : check('hizli', 'Çok hızlı yanlış cevaplar', s.rapid ? 'warn' : 'ok', {
          what: [
            `3. düzey ve üstündeki sorularda ${rapidText} verilen yanlış cevaplar sayılır.`,
            `Bu kadar kısa sürede ${s.seeing} çok zordur.`,
            'Hızlı ama doğru bir cevap tahmin sayılmaz.',
            'Bu soruların dörtte birinde böyle cevap varsa “Dikkat” yazar.',
          ].join(' '),
          result: s.rapid
            ? v(
                c,
                'Senin cevaplarında bu sınıra ulaşıldı; bu sorularda tahmin etmiş olabilirsin.',
                'Çocuğunuzun cevaplarında bu sınıra ulaşıldı; bu sorularda tahmin etmiş olabilir.',
              )
            : v(c, 'Senin cevaplarında bu tür cevaplar uyarı sınırının altında.', 'Çocuğunuzun cevaplarında bu tür cevaplar uyarı sınırının altında.'),
          todo: v(c, 'Yeniden çözersen zor sorulara acele etmeden bak.', 'Yeniden çözerse zor sorulara acele etmeden bakmasını önerebilirsiniz.'),
          note: 'Kırmızı çizgi bu tür cevapların sayısı; renkli bölge uyarı bölgesi.',
          visual: countMeter('Çok hızlı yanlış cevaplar', r.rapidOf, need, [{ label: '3. düzey ve üstünde', value: r.rapid, valueLabel: `${r.rapid} soru` }]),
          spoken: [`Çok hızlı yanlış cevaplar: ${sayCount(r.rapid)}.`, `Uyarı sınırı: ${r.rapidOf} sorudan ${need}.`],
        });
  const half = Math.ceil(n / 2);
  const sameCard = check('ayni-yer', 'Hep aynı sıradaki seçenek', s.samePos ? 'warn' : 'ok', {
    what: [
      'Doğru cevaplar seçeneklerin farklı sıralarındadır.',
      'Cevapların yarısı ya da daha çoğu aynı sıradaki seçenekse ve doğrular çok değilse, bakmadan aynı yere basılmış olabilir.',
    ].join(' '),
    result: s.samePos
      ? v(
          c,
          'Senin cevaplarında bu görüldü; birçok soruda aynı yere basmış olabilirsin.',
          'Çocuğunuzun cevaplarında bu görüldü; birçok soruda aynı yere basmış olabilir.',
        )
      : r.samePosition >= half
        ? v(
            c,
            'Aynı sıradaki seçeneği sık seçtin, ama doğru cevapların çok olduğu için bu bakmadan seçmeye bağlanmadı.',
            'Çocuğunuz aynı sıradaki seçeneği sık seçti, ama doğru cevapları çok olduğu için bu bakmadan seçmeye bağlanmadı.',
          )
        : v(c, 'Senin cevaplarında böyle bir yığılma yok.', 'Çocuğunuzun cevaplarında böyle bir yığılma yok.'),
    todo: retake(c, 'her soruya bakarak'),
    note: 'Kırmızı çizgi en sık seçilen sıranın sayısı; renkli bölge uyarı bölgesi.',
    // Doğrular çoksa aynı sıranın sık seçilmesi uyarı değildir: bölge renksiz çizilir.
    visual: countMeter(
      'Aynı sıradaki seçenek',
      n,
      half,
      [{ label: 'En sık seçilen sıra', value: r.samePosition, valueLabel: `${r.samePosition} cevap` }],
      false,
      s.samePos ? {} : { calm: true, warnLabel: 'Yarısı ya da çoğu' },
    ),
    spoken: [
      `En sık seçilen sıradaki cevaplar: ${sayCount(r.samePosition)}.`,
      `Uyarı sınırı: ${n} sorudan ${half}; doğrular ${s.sameMax} ya da daha az olmalı.`,
    ],
  });
  return {
    name: task.name,
    answers: [answers],
    levels: [levels, accuracy, ...(time ? [time] : [])],
    checks: [chanceCard, rapidCard, sameCard, timingCard(c, { noun: 'soru', measured: traces.filter((t) => t.rtMs !== null).length, total: n })],
  };
}

const levelChance =
  'Doğru cevaplar bu kadar azsa ve hiçbir düzeye ulaşılmadıysa sonuç yorumlanmaz. Yalnızca 1. düzeye ulaşıldıysa ve oradaki doğrular rastgele seçimle de çıkabiliyorsa yine yorumlanmaz.';
const seçenek = (k: number) => `${k}. seçenek`;
const quote = (s: string) => `“${s}”`;

function matrixKind(c: Ctx, task: MatrixReasoningTask, r: MatrixResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'sa',
    options: 8,
    chanceMax: MATRIX_CHANCE_MAX,
    chance: matrixChance(r),
    chanceRule: levelChance,
    rapid: matrixRapid(r),
    rapidMs: task.rapidMs,
    seeing: 'tabloyu inceleyip kuralı bulmak',
    samePos: matrixSamePosition(r),
    sameMax: MATRIX_SAME_MAX_CORRECT,
    shown: () => ({ text: '' }),
    given: (k) => seçenek(k),
    answer: (i) => seçenek(task.answers[i]),
    lure: () => 'tek özellikte ayrılan seçenek',
  });
}

function verbalKind(c: Ctx, task: VerbalReasoningTask, r: VerbalResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'sz',
    options: 5,
    chanceMax: VERBAL_CHANCE_MAX,
    chance: verbalChance(r),
    chanceRule: levelChance,
    rapid: verbalRapid(r),
    rapidMs: null,
    seeing: 'soruyu ve seçenekleri okumak',
    samePos: verbalSamePosition(r),
    sameMax: VERBAL_SAME_MAX_CORRECT,
    shown: (i) => {
      const it = task.items[i];
      if (it.type === 'analogy')
        return { text: `${it.stem[0]} → ${it.stem[1]}; ${it.stem[2]} → ?`, say: `${it.stem[0]} ile ${it.stem[1]} gibi, ${it.stem[2]} ile hangi kelime?` };
      if (it.type === 'classification') return { text: `${it.stem.join(', ')} ve ?`, say: `${it.stem.join(', ')} ve hangi kelime?` };
      return { text: [...it.stem, ...(it.question ? [it.question] : [])].join(' ') };
    },
    given: (k, i) => quote(task.items[i].options[k - 1]),
    answer: (i) => quote(task.items[i].options[task.answers[i] - 1]),
    lure: () => 'ilk bakışta doğru görünen seçenek',
  });
}

function foldingKind(c: Ctx, task: PaperFoldingTask, r: FoldingResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'kk',
    options: 5,
    chanceMax: FOLDING_CHANCE_MAX,
    chance: foldingChance(r),
    chanceRule: levelChance,
    rapid: foldingRapid(r),
    rapidMs: FOLDING_RAPID_MS,
    seeing: 'katlamaları izleyip seçeneklere bakmak',
    samePos: foldingSamePosition(r),
    sameMax: FOLDING_SAME_MAX_CORRECT,
    shown: () => ({ text: '' }),
    given: (k) => seçenek(k),
    answer: (i) => seçenek(task.answers[i]),
    lure: (k) => `yanılgı: ${FOLDING_LURE_TEXT[k as keyof typeof FOLDING_LURE_TEXT]}`,
  });
}

function vocabularyKind(c: Ctx, task: VocabularyTask, r: VocabularyResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'kb',
    options: 5,
    chanceMax: VOCABULARY_CHANCE_MAX,
    chance: vocabularyChance(r),
    chanceRule: levelChance,
    rapid: vocabularyRapid(r),
    rapidMs: null,
    seeing: 'soruyu ve seçenekleri okumak',
    samePos: vocabularySamePosition(r),
    sameMax: VOCABULARY_SAME_MAX_CORRECT,
    shown: (i) => {
      const it = task.items[i];
      if (it.type === 'synonym') return { text: `${quote(it.stem)} kelimesinin eş anlamlısı` };
      if (it.type === 'antonym') return { text: `${quote(it.stem)} kelimesinin zıt anlamlısı` };
      return { text: `${it.stem} (${quote(it.type === 'context' ? (it.mark ?? it.lemma) : it.lemma)})` };
    },
    given: (k, i) => quote(task.items[i].options[k - 1]),
    answer: (i) => quote(task.items[i].options[task.answers[i] - 1]),
    lure: (k) => `yanılgı: ${VOCABULARY_LURE_TEXT[k as keyof typeof VOCABULARY_LURE_TEXT]}`,
  });
}

function cubeKind(c: Ctx, task: CubeNetTask, r: CubeResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'kp',
    options: 4,
    chanceMax: CUBE_CHANCE_MAX,
    chance: cubeChance(r),
    chanceRule: levelChance,
    rapid: cubeRapid(r),
    rapidMs: CUBE_RAPID_MS,
    seeing: 'açınımı zihinde katlayıp küplere bakmak',
    samePos: cubeSamePosition(r),
    sameMax: CUBE_SAME_MAX_CORRECT,
    shown: () => ({ text: '' }),
    given: (k) => seçenek(k),
    answer: (i) => seçenek(task.answers[i]),
    lure: (k) => `yanılgı: ${CUBE_LURE_TEXT[k as keyof typeof CUBE_LURE_TEXT]}`,
  });
}

function hiddenKind(c: Ctx, task: HiddenFiguresTask, r: HiddenResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'gs',
    options: 4,
    chanceMax: HIDDEN_CHANCE_MAX,
    chance: hiddenChance(r),
    chanceRule: levelChance,
    rapid: hiddenRapid(r),
    rapidMs: HIDDEN_RAPID_MS,
    seeing: 'dört çizimde şekli aramak',
    samePos: hiddenSamePosition(r),
    sameMax: HIDDEN_SAME_MAX_CORRECT,
    shown: () => ({ text: '' }),
    given: (k) => seçenek(k),
    answer: (i) => seçenek(task.answers[i]),
    lure: (k) => `seçilen: ${HIDDEN_LURE_SEEN[k as keyof typeof HIDDEN_LURE_SEEN]}`,
  });
}

function assemblyKind(c: Ctx, task: ShapeAssemblyTask, r: AssemblyResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'ps',
    options: 4,
    chanceMax: ASSEMBLY_CHANCE_MAX,
    chance: assemblyChance(r),
    chanceRule: levelChance,
    rapid: assemblyRapid(r),
    rapidMs: ASSEMBLY_RAPID_MS,
    seeing: 'parçaları seçeneklerle karşılaştırmak',
    samePos: assemblySamePosition(r),
    sameMax: ASSEMBLY_SAME_MAX_CORRECT,
    shown: () => ({ text: '' }),
    given: (k) => seçenek(k),
    answer: (i) => seçenek(task.answers[i]),
    lure: (k) => `seçilen: ${lower(ASSEMBLY_LURE_NAMES[k as keyof typeof ASSEMBLY_LURE_NAMES])}`,
  });
}

function analogyKind(c: Ctx, task: FiguralAnalogyTask, r: AnalogyResult): KindParts {
  return choiceKind(c, {
    task,
    r,
    prefix: 'sb',
    options: 4,
    chanceMax: ANALOGY_CHANCE_MAX,
    chance: analogyChance(r),
    chanceRule: levelChance,
    rapid: analogyRapid(r),
    rapidMs: ANALOGY_RAPID_MS,
    seeing: 'üç şekli ve seçenekleri karşılaştırmak',
    samePos: analogySamePosition(r),
    sameMax: ANALOGY_SAME_MAX_CORRECT,
    shown: () => ({ text: '' }),
    given: (k) => seçenek(k),
    answer: (i) => seçenek(task.answers[i]),
    lure: (k) => `seçilen: ${lower(ANALOGY_LURE_NAMES[k as keyof typeof ANALOGY_LURE_NAMES])}`,
  });
}

/* ---------- Bölümlerin kurulması ---------- */

/** Görevin türüne göre katkısı; yalnızca bir kez kurulan görevler (zihinden hesaplamanın dört bölümü) birlikte. */
function kindParts(c: Ctx, task: CognitiveTask, done: Set<string>): KindParts | null {
  const res = <T>(key: string) => c.score(key)?.extra as unknown as T | undefined;
  switch (task.kind) {
    case 'matrix_reasoning': {
      const r = res<MatrixResult>('sa_dogru');
      return r ? matrixKind(c, task, r) : null;
    }
    case 'verbal_reasoning': {
      const r = res<VerbalResult>('sz_dogru');
      return r ? verbalKind(c, task, r) : null;
    }
    case 'paper_folding': {
      const r = res<FoldingResult>('kk_dogru');
      return r ? foldingKind(c, task, r) : null;
    }
    case 'vocabulary': {
      const r = res<VocabularyResult>('kb_dogru');
      return r ? vocabularyKind(c, task, r) : null;
    }
    case 'cube_net': {
      const r = res<CubeResult>('kp_dogru');
      return r ? cubeKind(c, task, r) : null;
    }
    case 'hidden_figures': {
      const r = res<HiddenResult>('gs_dogru');
      return r ? hiddenKind(c, task, r) : null;
    }
    case 'shape_assembly': {
      const r = res<AssemblyResult>('ps_dogru');
      return r ? assemblyKind(c, task, r) : null;
    }
    case 'figural_analogy': {
      const r = res<AnalogyResult>('sb_dogru');
      return r ? analogyKind(c, task, r) : null;
    }
    default:
      return moreKinds(c, task, done);
  }
}

/** Hızlı (çok denemeli) görevler: denemeler tek tek değil, bölüm bölüm özetlenir. */
const TRIAL_KINDS = new Set([
  'flanker',
  'symbol_match',
  'cancellation',
  'color_word',
  'go_nogo',
  'trail',
  'n_back',
  'mental_rotation',
  'reaction_time',
  'rule_switch',
  'symbol_search',
]);
/** Soru soran görevler ("Soru soru cevapların"); ötekiler dizi, desen, problem, işlem ya da kelimedir ("Tek tek cevapların"). */
const QUESTION_KINDS = new Set([
  'matrix_reasoning',
  'figural_analogy',
  'number_series',
  'letter_series',
  'verbal_reasoning',
  'paper_folding',
  'vocabulary',
  'cube_net',
  'hidden_figures',
  'shape_assembly',
  'logical_reasoning',
  'numerical_reasoning',
  'cognitive_reflection',
  'mental_rotation_3d',
  'perspective',
]);

export function taskParts(input: {
  def: TaskInstrument;
  content: ReportContent;
  report: SimpleReport;
  scores: ReportScore[];
  traces: Record<string, ItemTrace[]>;
}): ReportPart[] {
  const { def, content } = input;
  const byKey = new Map(input.scores.map((s) => [s.scaleKey, s]));
  const blocks = new Map((content.cognitive?.blocks ?? []).map((b) => [b.key, b]));
  const c: Ctx = {
    def,
    audience: content.audience,
    you: content.audience !== 'parent',
    adult: content.audience === 'adult',
    score: (k) => byKey.get(k),
    block: (k) => blocks.get(k),
    traces: input.traces,
    // Her görev için ayrıca: aynı içeriğin geldiği görevlerde satırlarda içerik ve cevaplar yazılmaz (aşağıda, kindParts).
    fixed: false,
  };
  const done = new Set<string>();
  // Her seferinde aynı içeriğin (soruların, dizilerin, desenlerin…) geldiği görevde satırlar cevap anahtarı olmaz
  // (lib/compare/tasks.ts, SAME_ITEMS).
  const kinds = def.tasks.flatMap((t) => kindParts({ ...c, fixed: SAME_ITEMS.has(t.kind) }, t, done) ?? []);
  const same = sameNounOf(def);
  if (!kinds.length) return [];
  const multi = kinds.length > 1;
  const group = (k: KindParts, cards: PartCard[]): PartGroup => ({ ...(multi ? { title: k.name } : {}), cards });
  const trials = def.tasks.some((t) => TRIAL_KINDS.has(t.kind));
  const questions = def.tasks.every((t) => QUESTION_KINDS.has(t.kind));

  /* 3. Denetimler (önce kurulur: "Dikkat" varsa ölçüler de bunu söyler). */
  const checks = kinds.flatMap((k) => k.checks);
  const warns = checks.filter((x) => x.status === 'warn').length;
  const skipped = checks.filter((x) => x.status === 'none').length;
  const NUMBER = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];
  const summary =
    warns === 0
      ? skipped
        ? skipped === 1
          ? 'Denetimlerden biri yapılamadı; yapılanların hepsi uygun çıktı.'
          : 'Bazı denetimler yapılamadı; yapılanların hepsi uygun çıktı.'
        : v(c, 'Senin cevaplarında denetimlerin hepsi uygun çıktı.', 'Çocuğunuzun cevaplarında denetimlerin hepsi uygun çıktı.')
      : warns === 1
        ? 'Bir denetimde “Dikkat” yazıyor; ayrıntısı aşağıda.'
        : `${cap(NUMBER[warns] ?? String(warns))} denetimde “Dikkat” yazıyor; ayrıntıları aşağıda.`;
  const quality: ReportPart = {
    key: 'quality',
    title: QUALITY_TITLE,
    intro: [
      v(
        c,
        'Bu bölüm, görevdeki cevaplarının sonucu ne kadar iyi yansıttığını denetler.',
        'Bu bölüm, çocuğunuzun görevdeki cevaplarının sonucu ne kadar iyi yansıttığını denetler.',
      ),
      'Her denetimin sınırı, raporun başındaki uyarılarla ve sonuç kartlarıyla aynıdır.',
      '“Dikkat” yazan bir denetim sonucun yanlış olduğunu göstermez; sonucun dikkatle okunması gerektiğini gösterir.',
      summary,
    ].join(' '),
    groups: kinds.filter((k) => k.checks.length).map((k) => group(k, k.checks)),
  };

  /* 1. Düzeylerin ve ölçülerin anlamı */
  const hasLevels = kinds.some((k) => k.levels.some((x) => x.levels?.length));
  const levelCards = kinds.flatMap((k) => k.levels);
  const levels: ReportPart = {
    key: 'levels',
    title: hasLevels ? 'Düzeylerin ve ölçülerin anlamı' : 'Ölçülerin anlamı',
    intro: [
      'Bu bölüm, raporda geçen ölçülerin ne anlattığını ve nasıl hesaplandığını anlatır.',
      ...(hasLevels
        ? [v(c, 'Düzeylerin ne istediği de yazıyor; ulaştığın düzey vurgulu.', 'Düzeylerin ne istediği de yazıyor; çocuğunuzun ulaştığı düzey vurgulu.')]
        : []),
      v(
        c,
        'Ölçüler başka kişilerle karşılaştırılmaz: grafikler yalnızca senin cevaplarını ve testin kendi sınırlarını gösterir.',
        'Ölçüler başka çocuklarla karşılaştırılmaz: grafikler yalnızca çocuğunuzun cevaplarını ve testin kendi sınırlarını gösterir.',
      ),
      ...(warns ? [v(c, 'Denetimlerde “Dikkat” olduğu için ölçüleri de dikkatle oku.', 'Denetimlerde “Dikkat” olduğu için ölçüleri de dikkatle okuyun.')] : []),
    ].join(' '),
    groups: kinds.filter((k) => k.levels.length).map((k) => group(k, k.levels)),
    ...(levelCards.length > 8 ? { collapsed: true } : {}),
  };

  /* 2. Soru soru cevaplar: anlatım kartların türünden kurulur (tek tek satırlar ya da bölüm bölüm özet). */
  const answerCards = kinds.flatMap((k) => k.answers);
  const itemNouns = [...new Set(answerCards.filter((x) => x.visual?.type === 'items').map((x) => x.rowsHead?.item ?? 'soru'))];
  const summed = answerCards.some((x) => x.visual?.type === 'blocks');
  const answers: ReportPart = {
    key: 'answers',
    title: trials
      ? v(c, 'Deneme deneme sonuçların', 'Deneme deneme sonuçlar')
      : questions
        ? v(c, 'Soru soru cevapların', 'Soru soru çocuğunuzun cevapları')
        : v(c, 'Tek tek cevapların', 'Çocuğunuzun cevapları tek tek'),
    intro: [
      ...(itemNouns.length
        ? [
            same
              ? `Her ${joinWords(itemNouns)} için ayrı satırda doğru ya da yanlış olduğu yazılır; varsa yanlışın türü ve süre de yazılır.`
              : `Her ${joinWords(itemNouns)} tek tek yazılır: verilen cevap, doğru ya da yanlış olduğu, yanlışsa doğrusu, yanlışın türü ve süre.`,
          ]
        : []),
      ...(summed ? ['Çok denemeli hızlı görevlerde denemeler bölüm bölüm özetlenir; her deneme bir parçada sayılır.'] : []),
      // Aynı içeriğin geldiği testlerde satırlarda ne içerik (soru, dizi, desen, işlem) ne de cevaplar yazılır (Ctx.fixed).
      ...(same && itemNouns.length
        ? [
            `Bu testte her seferinde aynı ${SAME_PLURAL[same]} gelir.`,
            `Bu yüzden burada ne ${SAME_PLURAL[same]} ne de cevaplar yazılır; böylece cevaplar raporlardan öğrenilemez ve test yeniden çözüldüğünde de işe yarar.`,
          ]
        : []),
      ...(c.adult ? [] : ['Görevdeki cevaplar bir görüş bildirmez, bir görevin nasıl yapıldığını gösterir; bu yüzden bu bölüm veli raporunda da yer alır.']),
      v(
        c,
        'Cevapların yalnızca bu sayfada ve indirdiğin PDF dosyasında görünür; hiçbir yerde saklanmaz.',
        'Cevaplar yalnızca bu sayfada ve indirdiğiniz PDF dosyasında görünür; hiçbir yerde saklanmaz.',
      ),
    ].join(' '),
    groups: kinds.filter((k) => k.answers.length).map((k) => group(k, k.answers)),
    collapsed: true,
    appendix: true,
  };
  return [levels, answers, quality].filter((p) => p.groups.some((g) => g.cards.length));
}

/** "soru", "dizi ve işlem", "dizi, desen ve kelime" */
function joinWords(xs: string[]): string {
  return xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}`;
}
