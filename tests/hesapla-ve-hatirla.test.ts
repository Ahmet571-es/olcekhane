import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { hesaplaVeHatirla } from '@/content/instruments/hesapla-ve-hatirla';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { blankOf, opLimitMs, opText, opTrue } from '@/lib/instruments/complex-span';
import type { ComplexSpanOp, ComplexSpanTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  CS_OPS_CHANCE_MAX,
  CS_OPS_TARGET,
  CS_RAPID_MS,
  CS_RECALL_CHANCE_MAX,
  TaskInputError,
  complexSpanOpsChance,
  complexSpanRapid,
  complexSpanRecallChance,
  scoreComplexSpan,
  type ComplexSpanResult,
  type ComplexSpanTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { complexSpanBody, csRight, type ComplexSpanCell, type ComplexSpanPlay } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'hesapla-ve-hatirla';
const task = hesaplaVeHatirla.tasks[0] as ComplexSpanTask;
const TITLES = ['Hatırlanan harfler', 'Dizi uzunluğu', 'İşlemler', 'Hata türleri'];
const BLANK = blankOf(task);
const SIZES = task.sets.map((s) => s.letters.length);
/** Her dizinin ilk işleminin bütün işlemler içindeki sırası. */
const OFFSET = SIZES.map((_, i) => SIZES.slice(0, i).reduce((s, x) => s + x, 0));
const ALL_OPS = task.sets.flatMap((s) => s.ops);
const value = (op: ComplexSpanOp) => op[0] * op[1] + op[2] * op[3];

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof complexSpanBody>) => (body.data as { blocks: Record<string, ComplexSpanTrialInput[]> }).blocks[task.key];
const score = (body: ReturnType<typeof complexSpanBody>) => scoreComplexSpan(task, trialsOf(body)).result;
/** Dizide olmayan ilk harf. */
const outsider = (letters: number[]) => [...task.letters.keys()].find((x) => !letters.includes(x))!;
/** Art arda aynı değerlerin en uzun dizisi. */
const longestRun = (xs: unknown[]) =>
  xs.reduce<[number, number]>(([best, run], x, i) => [Math.max(best, i && x === xs[i - 1] ? run + 1 : 1), i && x === xs[i - 1] ? run + 1 : 1], [0, 0])[0];
const binomTail = (n: number, k: number, p: number) => {
  let s = 0;
  for (let i = k; i <= n; i++) {
    let c = 1;
    for (let j = 0; j < i; j++) c = (c * (n - j)) / (j + 1);
    s += c * p ** i * (1 - p) ** (n - i);
  }
  return s;
};

describe('Hesapla ve hatırla: diziler ve işlemler', () => {
  it('10 dizi: 3–7 harf, her uzunluktan iki; toplam 50 harf ve 50 işlem; uzunluklar karışık; alıştırmalar 2 ve 3 harflik', () => {
    expect(task.sets).toHaveLength(10);
    expect([...SIZES].sort()).toEqual([3, 3, 4, 4, 5, 5, 6, 6, 7, 7]);
    for (const s of task.sets) expect(s.ops).toHaveLength(s.letters.length);
    expect(ALL_OPS).toHaveLength(50);
    // Art arda aynı uzunlukta iki dizi yok; uzunluklar sırayla artmaz (dizinin ne zaman biteceği kestirilemez).
    for (let i = 1; i < SIZES.length; i++) expect(SIZES[i], `dizi ${i + 1}`).not.toBe(SIZES[i - 1]);
    expect(SIZES).not.toEqual([...SIZES].sort());
    expect(task.practiceLetters.map((x) => x.length)).toEqual([2, 3]);
    expect(task.practiceOps).toHaveLength(15);
    expect(task.practiceSets.map((s) => [s.letters.length, s.ops.length])).toEqual([
      [2, 2],
      [3, 3],
    ]);
    expect(task.letterMs).toBe(1000);
    expect(task.limit).toEqual({ factor: 2.5, minMs: 3000, maxMs: 15_000 });
  });

  it('harfler: 12 farklı ünsüz; bir dizide aynı harf yok, alfabede yakın harfler art arda gelmez, bilinen kısaltma yok; her harf 3–6 kez', () => {
    expect(task.letters).toHaveLength(12);
    expect(new Set(task.letters).size).toBe(12);
    for (const l of task.letters) expect(l).toMatch(/^[BCÇDFGĞHJKLMNPRSŞTVYZ]$/);
    const ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
    const BAD = ['TL', 'PK', 'MR', 'TR', 'RT', 'PTT', 'THY', 'MHP', 'SMS', 'TV', 'KM', 'YKS', 'LGS', 'TYT', 'HP', 'MS', 'SM', 'FM', 'PS', 'NY', 'JP'];
    const all = [...task.practiceLetters, ...task.practiceSets.map((s) => s.letters), ...task.sets.map((s) => s.letters)];
    for (const set of all) {
      const ls = set.map((x) => task.letters[x]);
      expect(new Set(ls).size, ls.join('')).toBe(ls.length);
      for (let k = 1; k < ls.length; k++) expect(Math.abs(ALPHABET.indexOf(ls[k]) - ALPHABET.indexOf(ls[k - 1])), ls.join('')).toBeGreaterThan(2);
      for (const b of BAD) expect(ls.join(''), b).not.toContain(b);
    }
    const uses = task.letters.map((_, x) => task.sets.filter((s) => s.letters.includes(x)).length);
    for (const u of uses) expect(u).toBeGreaterThanOrEqual(3);
    for (const u of uses) expect(u).toBeLessThanOrEqual(6);
  });

  it('işlemler: (a × b) ± c, a 2–6, b 2–5, c 1–5; yanlış sonuç 1 ya da 2 eksik/fazla ve çarpımın kendisi değil; testte tekrar yok', () => {
    const all = [...ALL_OPS, ...task.practiceOps, ...task.practiceSets.flatMap((s) => s.ops)];
    for (const op of all) {
      const [a, b, sign, c, shown] = op;
      const label = opText(op);
      expect(a, label).toBeGreaterThanOrEqual(2);
      expect(a, label).toBeLessThanOrEqual(6);
      expect(b, label).toBeGreaterThanOrEqual(2);
      expect(b, label).toBeLessThanOrEqual(5);
      expect([1, -1], label).toContain(sign);
      expect(c, label).toBeGreaterThanOrEqual(1);
      expect(c, label).toBeLessThanOrEqual(5);
      expect(value(op), label).toBeGreaterThan(0);
      expect(shown, label).toBeGreaterThan(0);
      if (!opTrue(op)) {
        expect([1, 2], label).toContain(Math.abs(shown - value(op)));
        // Eklenen ya da çıkarılan sayıyı unutan biri yanlış sonucu doğru sanmasın.
        expect(shown, label).not.toBe(a * b);
        // Yanlış sonuç işaretten anlaşılmasın: toplamada çarpımdan büyük, çıkarmada küçük.
        expect(sign > 0 ? shown > a * b : shown < a * b, label).toBe(true);
      }
    }
    expect(new Set(ALL_OPS.map((o) => o.slice(0, 4).join())).size).toBe(50);
    // Alıştırma işlemleri asıl bölümde yinelenmez.
    // Alıştırma işlemleri asıl bölümde yinelenmez (çarpanların sırası değişse de).
    const key = (o: ComplexSpanOp) => [Math.min(o[0], o[1]), Math.max(o[0], o[1]), o[2], o[3]].join();
    const testKeys = new Set(ALL_OPS.map(key));
    expect(testKeys.size).toBe(50);
    const practice = [...task.practiceOps, ...task.practiceSets.flatMap((x) => x.ops)];
    for (const o of practice) expect(testKeys.has(key(o)), opText(o)).toBe(false);
    // Birlikte alıştırmada toplama da çıkarma da var.
    expect(new Set(task.practiceSets.flatMap((x) => x.ops).map((o) => o[2])).size).toBe(2);
  });

  it('hesaplamadan doğru cevabı ele veren ipucu yok: tek-çift, 5’e bölünme, işaret ya da büyüklüğe göre basan biri rastgele düzeyini aşmaz', () => {
    const truths = ALL_OPS.map(opTrue);
    const cues: Record<string, (o: ComplexSpanOp) => boolean> = {
      cift: (o) => o[4] % 2 === 0,
      besinKati: (o) => o[4] % 5 === 0,
      toplama: (o) => o[2] > 0,
      sonBasamakKucuk: (o) => o[4] % 10 < 5,
      aCift: (o) => o[0] % 2 === 0,
      bCift: (o) => o[1] % 2 === 0,
      cCift: (o) => o[3] % 2 === 0,
      sonucVeCAyniTekCift: (o) => o[4] % 2 === o[3] % 2,
      sonucVeAAyniTekCift: (o) => o[4] % 2 === o[0] % 2,
      sonucVeBAyniTekCift: (o) => o[4] % 2 === o[1] % 2,
      ucunKati: (o) => o[4] % 3 === 0,
      yuvarlakSayiyaYakin: (o) => Math.min(o[4] % 5, 5 - (o[4] % 5)) <= 1,
      cKucuk: (o) => o[3] <= 2,
    };
    for (let t = 3; t <= 35; t++) cues[`en az ${t}`] = (o) => o[4] >= t;
    for (let t = 4; t <= 30; t++) cues[`çarpım en az ${t}`] = (o) => o[0] * o[1] >= t;
    for (const [name, cue] of Object.entries(cues)) {
      const agree = ALL_OPS.filter((o, i) => cue(o) === truths[i]).length;
      // İpucuna göre ya da tersine basan biri en çok 31 işlemi doğru bulur (rastgele basma sınırı).
      expect(Math.max(agree, 50 - agree), name).toBeLessThanOrEqual(CS_OPS_CHANCE_MAX);
    }
  });

  it('işlemlerin yarısı doğru: her dizide yarı yarıya, art arda en çok üç aynı cevap; yanlış sonuçlar eksik ve fazla yönde dengeli', () => {
    const truths = ALL_OPS.map(opTrue);
    expect(truths.filter(Boolean)).toHaveLength(25);
    for (const s of task.sets) {
      const t = s.ops.filter(opTrue).length;
      expect([Math.floor(s.ops.length / 2), Math.ceil(s.ops.length / 2)], s.letters.join()).toContain(t);
    }
    expect(longestRun(truths)).toBeLessThanOrEqual(3);
    const deltas = ALL_OPS.filter((o) => !opTrue(o)).map((o) => o[4] - value(o));
    for (const d of [-2, -1, 1, 2]) expect(deltas.filter((x) => x === d).length, String(d)).toBeGreaterThanOrEqual(5);
    const practice = task.practiceOps.map(opTrue);
    expect([7, 8]).toContain(practice.filter(Boolean).length);
    expect(longestRun(practice)).toBeLessThanOrEqual(3);
    expect(task.practiceSets.flatMap((s) => s.ops).filter(opTrue).length).toBeGreaterThanOrEqual(2);
  });

  it('işlem metni ve süre sınırı: alıştırma sürelerinin ortalaması + 2,5 standart sapma, 3 ile 15 saniye arasında', () => {
    expect(opText([3, 4, -1, 2, 10])).toBe('(3 × 4) − 2 = 10');
    expect(opText([2, 5, 1, 3, 13])).toBe('(2 × 5) + 3 = 13');
    expect(opTrue([3, 4, -1, 2, 10])).toBe(true);
    expect(opTrue([3, 4, -1, 2, 11])).toBe(false);
    expect(BLANK).toBe(12);
    expect(opLimitMs([2000, 2500, 3000], task.limit)).toBe(3750);
    expect(opLimitMs([1000, 1000, 1000, 1000], task.limit)).toBe(3000);
    expect(opLimitMs([5000, 9000, 13_000], task.limit)).toBe(15_000);
    // Üçten az süre ölçülebildiyse en geniş süre verilir.
    expect(opLimitMs([2000, 0, Number.NaN], task.limit)).toBe(15_000);
  });

  it('metinler: yetişkinlerin de gördüğü yönerge ve tanıtımda okula özgü sözcük yok; diziler sabit (değişirse sürüm artırılmalı)', () => {
    expect(schoolWords([hesaplaVeHatirla.intro.title, ...hesaplaVeHatirla.intro.paragraphs, task.measures, ...task.instructions].join(' '))).toEqual([]);
    const runner = readFileSync(new URL('../src/components/runner/tasks/complex-span.tsx', import.meta.url), 'utf8');
    expect(schoolWords(runner.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''))).toEqual([]);
    const hash = createHash('sha256')
      .update(
        JSON.stringify({
          letters: task.letters,
          sets: task.sets,
          practiceLetters: task.practiceLetters,
          practiceOps: task.practiceOps,
          practiceSets: task.practiceSets,
        }),
      )
      .digest('hex')
      .slice(0, 16);
    expect({ version: hesaplaVeHatirla.version, hash }).toEqual({ version: 1, hash: DIZI_IZI });
  });
});

/** Dizilerin izi (sürüm 1): diziler bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const DIZI_IZI = '2c0c861aed514f46';

describe('Hesapla ve hatırla: puanlama', () => {
  it('hatasız: 50 harf doğru yerde, 10 dizi tam, en uzun tam dizi 7; işlemlerin hepsi doğru', () => {
    const r = score(complexSpanBody());
    expect(r).toMatchObject({
      sets: 10,
      letters: 50,
      correct: 50,
      accuracy: 1,
      perfectSets: 10,
      absolute: 50,
      longest: 7,
      order: 0,
      intrusion: 0,
      blank: 0,
      limitMs: 6000,
    });
    expect(r.ops).toEqual({ n: 50, correct: 50, wrong: 0, timeouts: 0, rapid: 0, accuracy: 1, medianMs: 2500 });
    expect(r.medianRecallMs).toBe(5000);
    expect(r.bySize.map((s) => [s.size, s.sets, s.letters, s.correct, s.perfect])).toEqual([
      [3, 2, 6, 6, 2],
      [4, 2, 8, 8, 2],
      [5, 2, 10, 10, 2],
      [6, 2, 12, 12, 2],
      [7, 2, 14, 14, 2],
    ]);
  });

  it('kısmi puan: doğru yerdeki her harf sayılır; yeri karışan, dizide olmayan ve boş kalan harfler ayrı sayılır', () => {
    const r = score(
      complexSpanBody((q) => {
        const ops = q.ops.map((o) => csRight(o));
        // 1. dizi: ilk iki harfin yeri karışık; 2. dizi: ilk harf dizide yok; 3. dizi: bir harf ve bir boş, sonuncusu girilmemiş.
        if (q.i === 0) return { recall: [q.letters[1], q.letters[0], ...q.letters.slice(2)], ops };
        if (q.i === 1) return { recall: [outsider(q.letters), ...q.letters.slice(1)], ops };
        if (q.i === 2) return { recall: [q.letters[0], BLANK], ops };
        return { recall: q.letters, ops };
      }),
    );
    expect(r).toMatchObject({ correct: 50 - 2 - 1 - 2, order: 2, intrusion: 1, blank: 2, perfectSets: 7, absolute: 50 - 4 - 6 - 3, longest: 7 });
  });

  it('işlemler: süresi dolan (cevapsız) işlem yanlış sayılır; yarım saniyeden kısa cevaplar ayrıca sayılır', () => {
    const r = score(
      complexSpanBody((q) => ({
        recall: q.letters,
        ops: q.ops.map((o, k) => {
          const g = OFFSET[q.i] + k;
          if (g < 4) return { a: null, ms: null };
          if (g < 7) return { a: !opTrue(o), ms: 2000 };
          if (g < 12) return { a: opTrue(o), ms: CS_RAPID_MS - 1 };
          return { a: opTrue(o), ms: CS_RAPID_MS };
        }),
      })),
    );
    expect(r.ops).toMatchObject({ n: 50, correct: 43, wrong: 3, timeouts: 4, rapid: 5, accuracy: 0.86 });
  });

  it('aynı dizi iki kez gelirse ilk cevap geçerlidir; dizilerin hepsi gerekir', () => {
    const body = complexSpanBody();
    const trials = trialsOf(body);
    const twice = [...trials, { ...trials[0], response: { ...trials[0].response, recall: [BLANK] } }];
    expect(scoreComplexSpan(task, twice).result.correct).toBe(50);
    expect(() => scoreComplexSpan(task, trials.slice(1))).toThrow(TaskInputError);
  });

  it('geçersiz girdiler reddedilir', () => {
    const ok = trialsOf(complexSpanBody());
    const bad = (f: (t: ComplexSpanTrialInput) => unknown) => () =>
      scoreComplexSpan(
        task,
        ok.map((t, i) => (i === 2 ? (f(t) as ComplexSpanTrialInput) : t)),
      );
    // Dizi 3 harflidir.
    expect(bad((t) => ({ ...t, response: { ...t.response, recall: [1, 2, 3, 4] } }))).toThrow(TaskInputError);
    for (const x of [-1, BLANK + 1, 1.5, Number.NaN])
      expect(
        bad((t) => ({ ...t, response: { ...t.response, recall: [x] } })),
        String(x),
      ).toThrow(TaskInputError);
    expect(bad((t) => ({ ...t, response: { ...t.response, ops: t.response.ops.slice(1) } }))).toThrow(TaskInputError);
    expect(bad((t) => ({ ...t, response: { ...t.response, ops: [{ a: 'evet', ms: 1 }, ...t.response.ops.slice(1)] } }))).toThrow(TaskInputError);
    expect(bad((t) => ({ ...t, response: { ...t.response, ops: [{ a: true, ms: -1 }, ...t.response.ops.slice(1)] } }))).toThrow(TaskInputError);
    for (const limitMs of [task.limit.minMs - 1, task.limit.maxMs + 1, Number.NaN]) {
      expect(
        bad((t) => ({ ...t, response: { ...t.response, limitMs } })),
        String(limitMs),
      ).toThrow(TaskInputError);
    }
    expect(bad((t) => ({ ...t, rtMs: -5 }))).toThrow(TaskInputError);
    expect(bad((t) => ({ ...t, response: null }))).toThrow(TaskInputError);
    expect(bad((t) => ({ ...t, index: 10 }))).toThrow(TaskInputError);
    const empty = complexSpanBody();
    (empty.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, empty)).toThrow(AssessmentError);
  });

  it('şans sınırları: rastgele basmada 32 ya da daha çok doğru işlemin, rastgele harf seçmede 9 ya da daha çok doğru harfin olasılığı %5’ten az', () => {
    expect(binomTail(50, CS_OPS_CHANCE_MAX + 1, 0.5)).toBeLessThan(0.05);
    expect(binomTail(50, CS_OPS_CHANCE_MAX, 0.5)).toBeGreaterThan(0.05);
    expect(binomTail(50, CS_RECALL_CHANCE_MAX + 1, 1 / 12)).toBeLessThan(0.05);
    expect(binomTail(50, CS_RECALL_CHANCE_MAX, 1 / 12)).toBeGreaterThan(0.05);
    expect(CS_OPS_TARGET).toBe(0.85);
  });
});

/** Toplam `k` harf doğru yerde: dizilerin başından başlayarak; kalan yerlerde dizide olmayan harf. */
const recallK =
  (k: number) =>
  (q: ComplexSpanCell): number[] =>
    q.letters.map((l, j) => (OFFSET[q.i] + j < k ? l : outsider(q.letters)));

describe('Hesapla ve hatırla: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar, dizi uzunluklarına göre grafik ve üç boyutlu grafik', () => {
    const r = evaluate(SLUG, complexSpanBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Hatırlanan harfler', '50 harfin hepsi doğru yerde'],
      ['Dizi uzunluğu', 'Bütün diziler tam'],
      ['İşlemler', '50 işlemin hepsi doğru'],
      ['Hata türleri', 'Hata yok'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru yerde hatırlanan harf', '50/50'],
      ['Bütün harfleri doğru dizi', '10/10'],
      ['İşlem doğruluğu', '%100'],
      ['İşlem süre sınırı', '6 saniye'],
    ]);
    expect(r.student.items[0].text).toContain('Harflerin hepsini doğru yerde hatırladın');
    expect(r.student.items[1].text).toContain(
      '3 harflik 6/6 · 4 harflik 8/8 · 5 harflik 10/10 · 6 harflik 12/12 · 7 harflik 14/14. Kısa dizilerde (3 ve 4 harf) 14 harfin hepsini, uzun dizilerde (6 ve 7 harf) 26 harfin hepsini doğru yerde hatırladın. Diziler uzadıkça sonucun düşmedi.',
    );
    expect(r.student.items[2].text).toContain('Hiçbir işlemde yanılmadın');
    expect(r.student.chart?.type === 'bars' && r.student.chart.rows.map((row) => [row.label, row.valueLabel])).toEqual([
      ['3 harflik diziler', '6/6'],
      ['4 harflik diziler', '8/8'],
      ['5 harflik diziler', '10/10'],
      ['6 harflik diziler', '12/12'],
      ['7 harflik diziler', '14/14'],
    ]);
    expect(r.parent.roadmap!.bars.map((b) => [b.key, b.value])).toEqual([
      ['d3', 100],
      ['d4', 100],
      ['d5', 100],
      ['d6', 100],
      ['d7', 100],
    ]);
    expect(r.parent.roadmap!.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.parent)).toContain('Çocuğunuz harflerin hepsini doğru yerde hatırladı');
  });

  it('durumlar: uzun dizilerde düşen sonuç, yeri karışan harfler, rastgele düzeyinde harfler, rastgele basılan ve çok hızlı işlemler', () => {
    // Uzun dizilerde son iki harfin yeri karışık.
    let r = evaluate(
      SLUG,
      complexSpanBody((q) => ({
        recall: q.size >= 6 ? [...q.letters.slice(0, -2), q.letters.at(-1)!, q.letters.at(-2)!] : q.letters,
        ops: q.ops.map((o) => csRight(o)),
      })),
    );
    expect(r.student.items[0].badge).toBe('50 harften 42 tanesi doğru yerde');
    expect(r.student.items[1].badge).toBe('En uzun tam dizi: 5 harf');
    expect(r.student.items[1].text).toContain('Diziler uzadıkça doğru yerde hatırladığın harflerin oranı düştü.');
    expect(r.student.items[3].badge).toBe('Yeri karışan 8');
    expect(r.student.items[3].text).toContain(
      'Doğru yerde olmayan 8 yerin hepsinde harf o dizide vardı ama yeri karıştı. Yeri karışan harflerde harfi hatırladın ama sırasını karıştırdın.',
    );
    expect(r.student.cautions).toEqual([]);

    // Harflerin yalnızca 8'i doğru yerde: rastgele düzeyi.
    r = evaluate(
      SLUG,
      complexSpanBody((q) => ({ recall: recallK(8)(q), ops: q.ops.map((o) => csRight(o)) })),
    );
    expect(r.student.items.map((i) => i.badge)).toEqual(['50 harften 8 tanesi doğru yerde', 'Yorumlanmadı', '50 işlemin hepsi doğru', 'Yorumlanmadı']);
    expect(r.student.items[0].text).toContain('yalnızca 8 tanesini doğru yerde seçtin');
    expect(r.student.cautions.join(' ')).toContain('tek başına yorumlanmamalıdır');
    expect(r.student.roadmap!.bars).toEqual([]);

    // İşlemlerin 31'i doğru: rastgele basma düzeyi; harf sonucu yorumlanmaz.
    r = evaluate(
      SLUG,
      complexSpanBody((q) => ({ recall: q.letters, ops: q.ops.map((o, k) => (OFFSET[q.i] + k < 19 ? { a: !opTrue(o), ms: 1500 } : csRight(o))) })),
    );
    expect(r.student.items[2].badge).toBe('50 işlemin 31 tanesi doğru (%62)');
    expect(r.student.items[0].text).toContain('harf sonucu yorumlanmadı');
    expect(r.student.items[1].badge).toBe('Yorumlanmadı');
    expect(r.student.cautions).toHaveLength(1);
    expect(r.student.cautions[0]).toContain('harf sonucu yorumlanmamalıdır');

    // On işleme yarım saniyeden kısa sürede cevap: dikkatle yorumlanır.
    r = evaluate(
      SLUG,
      complexSpanBody((q) => ({ recall: q.letters, ops: q.ops.map((o, k) => csRight(o, OFFSET[q.i] + k < 10 ? 300 : 2500)) })),
    );
    expect(r.student.items[0].text).toContain('İşlemlerin 10 tanesine yarım saniyeden kısa sürede cevap verdin');
    expect(r.student.items[0].text).toContain('bu sonuç dikkatle yorumlanmalıdır');
    expect(r.student.cautions).toHaveLength(1);
    expect(r.student.cautions[0]).toContain('harf sonucu dikkatle yorumlanmalıdır');

    // İşlemlerin %84'ü doğru, yanlışların çoğu süre dolmasından.
    r = evaluate(
      SLUG,
      complexSpanBody((q) => ({ recall: q.letters, ops: q.ops.map((o, k) => (OFFSET[q.i] + k < 8 ? { a: null, ms: null } : csRight(o))) })),
    );
    expect(r.student.items[2].text).toContain('bu düzeyin altında kaldın');
    expect(r.student.items[2].text).toContain('8 işlemde süre doldu; hiçbir işleme yanlış cevap vermedin');
    expect(r.student.items[2].text).toContain('Süre sınırı, alıştırmadaki hızına göre 6 saniye olarak belirlenmişti');
    expect(r.student.items[0].text).toContain('harf sonucu biraz daha dikkatle yorumlanmalıdır');
    expect(r.student.cautions).toEqual([]);
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafik birbiriyle çelişmez', () => {
    const recalls: Record<string, (q: ComplexSpanCell) => number[]> = {
      hepsi: (q) => q.letters,
      k43: recallK(43),
      k42: recallK(42),
      k33: recallK(33),
      k25: recallK(25),
      k9: recallK(9),
      k8: recallK(8),
      k1: recallK(1),
      hicbiri: () => [BLANK],
      sira: (q) => [q.letters[1], q.letters[0], ...q.letters.slice(2)],
      yabanci: (q) => [outsider(q.letters), ...q.letters.slice(1)],
      bos: (q) => (q.size >= 5 ? [...q.letters.slice(0, 2), BLANK, ...q.letters.slice(3)] : q.letters.slice(0, -1)),
      uzunZor: (q) => (q.size >= 6 ? q.letters.slice(0, 3) : q.letters),
      kisaZor: (q) => (q.size <= 4 ? [BLANK] : q.letters),
      karisik: (q) => (q.i % 3 === 0 ? [outsider(q.letters), BLANK] : q.i % 3 === 1 ? [...q.letters].reverse() : q.letters),
    };
    type OpPlay = (o: ComplexSpanOp, g: number) => { a: boolean | null; ms: number | null };
    const ops: Record<string, OpPlay> = {
      dogru: (o) => csRight(o),
      d43: (o, g) => (g < 7 ? { a: !opTrue(o), ms: 2000 } : csRight(o)),
      d42: (o, g) => (g < 8 ? { a: !opTrue(o), ms: 2000 } : csRight(o)),
      sure42: (o, g) => (g < 8 ? { a: null, ms: null } : csRight(o)),
      d32: (o, g) => (g < 18 ? { a: !opTrue(o), ms: 2000 } : csRight(o)),
      d31: (o, g) => (g < 19 ? { a: !opTrue(o), ms: 2000 } : csRight(o)),
      sure31: (o, g) => (g < 19 ? { a: null, ms: null } : csRight(o)),
      hicbiri: (o) => ({ a: !opTrue(o), ms: 1500 }),
      birDogru: (o, g) => (g === 0 ? csRight(o) : { a: !opTrue(o), ms: 1500 }),
      hizli10: (o, g) => csRight(o, g < 10 ? 300 : 2500),
      hizli9: (o, g) => csRight(o, g < 9 ? 300 : 2500),
      hizliYanlis: (o, g) => (g < 25 ? { a: !opTrue(o), ms: 200 } : csRight(o, 200)),
      hepsiHizli: (o) => csRight(o, 100),
    };
    let n = 0;
    for (const [rName, recall] of Object.entries(recalls)) {
      for (const [oName, op] of Object.entries(ops)) {
        for (const rt of [5000, null]) {
          const label = `${rName}/${oName}/${rt}`;
          const body = complexSpanBody((q): ComplexSpanPlay => ({ recall: recall(q), ops: q.ops.map((o, k) => op(o, OFFSET[q.i] + k)), rtMs: rt }), 9);
          const res = evaluate(SLUG, body);
          const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
          const r: ComplexSpanResult = score(body);
          const recallChance = complexSpanRecallChance(r);
          const opsChance = complexSpanOpsChance(r);
          const rapid = !opsChance && complexSpanRapid(r);
          const noRead = recallChance || opsChance;
          const E = r.letters - r.correct;
          for (const rep of [res.student, res.parent, adult]) {
            const t = text(rep);
            expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \.|%-/);
            // "1 tanesi" yerine "biri" denir.
            expect(t, label).not.toMatch(/(^|\s)1 tanesi/);
            expect(
              rep.items.map((i) => i.title),
              label,
            ).toEqual(TITLES);
            for (const i of rep.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
            // "Hiçbir(i)" olumsuz bir fiille ya da "değil" ile söylenir ("hiçbirini seçtin" yanlış Türkçedir).
            for (const clause of t.split(/[.;:]/).filter((c) => /hiçbir/i.test(c))) {
              expect(clause, label).toMatch(/değil|amadı|emedi|mamış|memiş|madı|medi|mez|maz|yok/);
            }
            const [harf, uzunluk, islem, hata] = rep.items;
            expect(harf.badge, label).toBe(
              r.correct === 0
                ? '50 harfin hiçbiri doğru yerde değil'
                : r.correct === 50
                  ? '50 harfin hepsi doğru yerde'
                  : `50 harften ${r.correct === 1 ? 'biri' : `${r.correct} tanesi`} doğru yerde`,
            );
            expect(uzunluk.badge === 'Yorumlanmadı', label).toBe(noRead);
            expect(hata.badge === 'Yorumlanmadı', label).toBe(noRead);
            expect(islem.badge, label).toBe(
              r.ops.correct === 0
                ? '50 işlemin hiçbiri doğru değil'
                : r.ops.correct === 50
                  ? '50 işlemin hepsi doğru'
                  : `50 işlemin ${r.ops.correct === 1 ? 'biri' : `${r.ops.correct} tanesi`} doğru (%${Math.round(r.ops.accuracy * 100)})`,
            );
            // Uyarılar kartlarla aynı şeyi söyler.
            const cautions = rep.cautions.join(' ');
            expect(cautions.includes('harfleri rastgele seçen birinin de bulabileceği'), label).toBe(recallChance);
            expect(cautions.includes('rastgele basan birinin de bulabileceği'), label).toBe(opsChance);
            expect(cautions.includes('yarım saniyeden kısa'), label).toBe(rapid);
            expect(cautions.includes('harf sonucu yorumlanmamalıdır'), label).toBe(opsChance && !recallChance);
            expect(cautions.includes('harf sonucu dikkatle yorumlanmalıdır'), label).toBe(rapid && !recallChance);
            expect(harf.text.includes('harf sonucu yorumlanmadı'), label).toBe(opsChance && !recallChance);
            expect(harf.text.includes('bu sonuç dikkatle yorumlanmalıdır'), label).toBe(rapid && !recallChance);
            expect(islem.text.includes('yarım saniyeden kısa'), label).toBe(rapid);
            expect(harf.text.includes('sonuç yorumlanmadı'), label).toBe(recallChance);
            expect(harf.text.includes('biraz daha dikkatle'), label).toBe(!noRead && !rapid && r.ops.accuracy < CS_OPS_TARGET);
            expect(islem.text.includes('bu düzeye ulaş'), label).toBe(!opsChance && r.ops.accuracy >= CS_OPS_TARGET && r.ops.correct < r.ops.n);
            expect(islem.text.includes('bu düzeyin altında kal'), label).toBe(!opsChance && r.ops.accuracy < CS_OPS_TARGET);
            // Harf kartındaki nicelik sözleri sayılarla uyuşur.
            if (!noRead) {
              const h = harf.text;
              expect(h.includes('hemen hepsini'), label).toBe(r.correct >= 42.5 && r.correct < 50);
              expect(h.includes('harflerin çoğunu'), label).toBe(r.correct >= 32.5 && r.correct < 42.5);
              expect(h.includes('yarısından çoğu'), label).toBe(r.correct > 25 && r.correct < 32.5);
              expect(/harflerin yarısı doğru/.test(h), label).toBe(r.correct === 25);
              expect(h.includes('yarısından azı'), label).toBe(r.correct < 25);
              if (r.correct < 50) expect(h, label).toMatch(r.longest === null ? /hiçbir dizinin/i : new RegExp(`en uzun dizi ${r.longest} harfliydi`));
              expect(uzunluk.text.startsWith(r.bySize.map((s) => `${s.size} harflik ${s.correct}/${s.letters}`).join(' · ')), label).toBe(true);
              // Hata kartı: "çoğunda" yalnızca o tür yarıdan çoksa.
              expect(/sırasını karıştır/.test(hata.text), label).toBe(2 * r.order > E);
              expect(/O dizide olmayan bir harfin seçildiği yerlerde/.test(hata.text), label).toBe(2 * r.intrusion > E);
              expect(/Boş kalan yerler hatırlanamayan harflerdir/.test(hata.text), label).toBe(2 * r.blank > E);
              if (E > 1) expect(hata.text, label).toContain(`Doğru yerde olmayan ${E} yerin`);
              if (E === 1) expect(hata.text, label).toMatch(/^Doğru yerde olmayan tek yer/);
              // "Hepsinde/hepsi" yalnızca tek tür bütün yerleri kapsıyorsa.
              if (/yerin hepsi/.test(hata.text)) expect([r.order, r.intrusion, r.blank], label).toContain(E);
              if (E === 0) expect(hata.badge, label).toBe('Hata yok');
            }
            // Öne çıkan sayılar ve grafik sonuçla aynıdır.
            const fig = Object.fromEntries(rep.keyFigures.map((f) => [f.label, f.value]));
            expect(fig['Doğru yerde hatırlanan harf'], label).toBe(`${r.correct}/50`);
            expect(fig['Bütün harfleri doğru dizi'], label).toBe(`${r.perfectSets}/10`);
            expect(fig['İşlem doğruluğu'], label).toBe(`%${Math.round(r.ops.accuracy * 100)}`);
            expect(rep.chart?.type === 'bars' ? rep.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(
              r.bySize.map((s) => `${s.correct}/${s.letters}`),
            );
            expect(rep.roadmap!.bars.length, label).toBe(noRead ? 0 : 5);
            expect(islem.text.startsWith(`Doğru ${r.ops.correct} · Yanlış ${r.ops.wrong} · Süre doldu ${r.ops.timeouts}.`), label).toBe(true);
          }
          expect(text(res.student), label).not.toContain('Çocuğunuz');
          expect(text(adult), label).not.toContain('Çocuğunuz');
          expect(text(res.parent), label).not.toMatch(
            /\b(hatırladın|seçtin|seçemedin|cevapladın|verdin|bıraktın|karıştırdın|kaldın|ulaştın|yanılmadın|olabilirsin|çalışmış olabilirsin)\b/,
          );
          expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
          n++;
        }
      }
    }
    expect(n).toBe(15 * 13 * 2);
  }, 400_000);

  it('5. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, complexSpanBody(undefined, 4))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, complexSpanBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(rmText).not.toMatch(/kitap/i);
    expect(schoolWords(withoutRoadmap(adult))).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel harfleri ve işlem cevaplarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /HB_GOVDE=.*?l=(\[\[[\d,[\]]+\]\]); d=(\[\[[\d,[\]]+\]\])/.exec(yml);
    expect(JSON.parse(m![1])).toEqual(task.sets.map((s) => s.letters));
    expect(JSON.parse(m![2])).toEqual(task.sets.map((s) => s.ops.map((o) => (opTrue(o) ? 1 : 0))));
    const r = evaluate(SLUG, complexSpanBody());
    expect(r.student.items[0].badge).toBe('50 harfin hepsi doğru yerde');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(5);
    expect(r.parent.roadmap!.bars).toHaveLength(5);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/hb_sayfa[\s\S]*Hem hesapla hem hatırla!/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, complexSpanBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, complexSpanBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(hesaplaVeHatirla.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(hesaplaVeHatirla.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(hesaplaVeHatirla.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...hesaplaVeHatirla.science, citations: [] });
    const cited = [
      'Đokić ve ark., 2018',
      'Ferguson ve ark., 2021',
      'Fu ve ark., 2026',
      'Hischa ve ark., 2025',
      'Lee ve Engle, 2026',
      'Melby-Lervåg ve Hulme, 2013',
      'Monteiro ve ark., 2025',
      'Redick ve Lindsey, 2013',
      'Ruiz ve ark., 2019',
      'Schmiedek ve ark., 2014',
      'Unsworth ve ark., 2005',
    ];
    for (const a of cited) expect(body, a).toContain(a);
    expect(hesaplaVeHatirla.science.citations.map((c) => c.text.split(',')[0])).toEqual(cited.map((a) => a.split(/ ve |,/)[0]));
  });
});
