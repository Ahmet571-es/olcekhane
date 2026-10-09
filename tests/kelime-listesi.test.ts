import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { kelimeListesi } from '@/content/instruments/kelime-listesi';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { answersBody } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import type { WordListTask } from '@/lib/instruments/types';
import { matchWord, normalizeWord, sameWord, splitWords, wordListRecalls } from '@/lib/instruments/word-list';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  TaskInputError,
  scoreWordList,
  wordListManyExtra,
  wordListRecogChance,
  wordListRecogFast,
  wordListRecogOneSided,
  wordListRecogValid,
  type WordListResult,
  type WordListTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { wordListBody, wordListWords, type WordListCell, type WordListPlan } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'kelime-listesi-hatirlama';
const task = kelimeListesi.tasks[0] as WordListTask;
const TITLES = ['Öğrenme', 'Öğrenileni koruma', 'Tanıma', 'Çalışma biçimi'];
const text = (r: SimpleReport) => JSON.stringify(r);
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const inputs = (plan?: Partial<WordListPlan>) => (wordListBody(plan).data as { blocks: Record<string, WordListTrialInput[]> }).blocks[task.key];
const score = (plan?: Partial<WordListPlan>) => scoreWordList(task, inputs(plan)).result;
const range = (a: number, b: number) => Array.from({ length: b - a }, (_, i) => a + i);
const A = (ps: number[]) => wordListWords('A', ps);
const B = (ps: number[]) => wordListWords('B', ps);

/** Tanıma bölümünün yanılgıları ve ilk listedeki kelimeler. */
const KEY = task.recognitionKey.map((k, j) => ({ ...k, j, word: task.recognition[j] }));

describe('Kelime listesi: kelimeler', () => {
  it('iki liste 15 farklı kelime; alıştırma 3 kelime; ilk liste üç kez gösterilir', () => {
    expect(task.listA).toHaveLength(15);
    expect(task.listB).toHaveLength(15);
    expect(task.practice).toHaveLength(3);
    expect(task.learningTrials).toBe(3);
    const all = [...task.listA, ...task.listB, ...task.practice];
    expect(new Set(all).size).toBe(all.length);
    for (const w of all) expect(w, w).toMatch(/^[a-zçğıöşü]{4,8}$/);
    expect([task.wordMs, task.gapMs]).toEqual([1500, 500]);
    expect(wordListRecalls(task).map((r) => `${r.list}${r.shown ? '' : '-'}`)).toEqual(['A', 'A', 'A', 'B', 'A-']);
  });

  it('listenin başı, ortası ve sonu kelime uzunluğu bakımından dengeli', () => {
    const len = (ws: string[]) => ws.reduce((s, w) => s + w.length, 0) / ws.length;
    const parts = [0, 5, 10].map((a) => len(task.listA.slice(a, a + 5)));
    expect(Math.max(...parts) - Math.min(...parts)).toBeLessThanOrEqual(1);
  });

  it('tanıma: 35 kelime; ilk listenin 15 kelimesi birer kez ve her yanılgı türünden 5 kelime', () => {
    expect(task.recognition).toHaveLength(35);
    expect(task.recognitionKey).toHaveLength(35);
    expect(new Set(task.recognition).size).toBe(35);
    const targets = KEY.filter((k) => k.kind === 'target');
    expect(targets.map((k) => k.of).sort((a, b) => a! - b!)).toEqual(range(0, 15));
    for (const k of targets) expect(k.word).toBe(task.listA[k.of!]);
    for (const kind of ['b', 'semantic', 'sound', 'new'] as const) expect(KEY.filter((k) => k.kind === kind), kind).toHaveLength(5);
    for (const k of KEY.filter((x) => x.kind === 'b')) expect(k.word).toBe(task.listB[k.of!]);
    const others = KEY.filter((k) => k.kind === 'semantic' || k.kind === 'sound' || k.kind === 'new');
    for (const k of others) expect([...task.listA, ...task.listB, ...task.practice], k.word).not.toContain(k.word);
    // Anlamca yakın ve sesi benzer yanılgılar ilk listedeki farklı kelimelere bağlıdır; ilgisiz kelimelerin bağı yoktur.
    const related = KEY.filter((k) => k.kind === 'semantic' || k.kind === 'sound').map((k) => k.of);
    expect(new Set(related).size).toBe(10);
    for (const k of KEY.filter((x) => x.kind === 'new')) expect(k.of).toBeUndefined();
    // Sesi benzer yanılgı, ilişkili kelimeyle aynı uzunlukta ve en çok iki harf farklıdır (yazım kayması sayılmaz: üstteki test).
    for (const k of KEY.filter((x) => x.kind === 'sound')) {
      const w = task.listA[k.of!];
      expect(k.word.length, k.word).toBe(w.length);
      expect([...k.word].filter((c, i) => c !== w[i]).length, k.word).toBeLessThanOrEqual(2);
    }
  });

  it('tanıma sırası: aynı cevap en çok 3 kez art arda; aynı türden iki yanılgı art arda gelmez; yanılgı ilişkili kelimeden en az 4 uzakta', () => {
    let run = 1;
    for (let j = 1; j < KEY.length; j++) {
      run = (KEY[j].kind === 'target') === (KEY[j - 1].kind === 'target') ? run + 1 : 1;
      expect(run, String(j)).toBeLessThanOrEqual(3);
      if (KEY[j].kind !== 'target') expect(KEY[j].kind, String(j)).not.toBe(KEY[j - 1].kind);
    }
    let before = 0;
    for (const k of KEY.filter((x) => x.kind === 'semantic' || x.kind === 'sound')) {
      const t = KEY.findIndex((x) => x.kind === 'target' && x.of === k.of);
      expect(Math.abs(k.j - t), k.word).toBeGreaterThanOrEqual(4);
      if (k.j < t) before++;
    }
    expect(before).toBeGreaterThanOrEqual(4);
    expect(before).toBeLessThanOrEqual(6);
    const first = KEY.slice(0, 17);
    expect(first.filter((k) => k.kind === 'target').length).toBeGreaterThanOrEqual(7);
    for (const kind of ['b', 'semantic', 'sound', 'new']) expect(first.filter((k) => k.kind === kind).length, kind).toBeGreaterThanOrEqual(2);
  });

  it('hiçbir kelime, başka bir kelimenin yazım kayması sayılmaz; her liste kelimesi yalnızca kendisine eşleşir', () => {
    const all = [...new Set([...task.listA, ...task.listB, ...task.practice, ...task.recognition])];
    for (const u of all) {
      for (const w of all) if (u !== w) expect(sameWord(normalizeWord(u), normalizeWord(w)), `${u} → ${w}`).toBe(false);
    }
    const both = [...task.listA, ...task.listB];
    both.forEach((w, i) => expect(matchWord(w, both), w).toBe(i));
    for (const k of KEY.filter((x) => x.kind === 'semantic' || x.kind === 'sound' || x.kind === 'new')) expect(matchWord(k.word, both), k.word).toBeNull();
  });

  it('kelimeler ve sıraları sabit: değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ a: task.listA, b: task.listB, p: task.practice, r: task.recognition, k: task.recognitionKey, t: [task.wordMs, task.gapMs, task.learningTrials] }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: kelimeListesi.version, hash }).toEqual({ version: 1, hash: KELIME_IZI });
  });
});

/** Kelimelerin ve sıralarının izi (sürüm 1). */
const KELIME_IZI = '9f55540464edbeac';

describe('Kelime listesi: yazılan kelimeyi tanıma', () => {
  it('büyük-küçük harf, Türkçe harflerin işaretleri ve harf dışındaki işaretler önemsiz', () => {
    expect(normalizeWord('Tavşan')).toBe('tavsan');
    expect(normalizeWord('ÇEKİÇ')).toBe('cekic');
    expect(normalizeWord('KÖPRÜ!')).toBe('kopru');
    expect(normalizeWord('IŞIK')).toBe('isik');
    expect(normalizeWord(' gömlek. ')).toBe('gomlek');
    expect(matchWord('TAVSAN', task.listA)).toBe(0);
    expect(matchWord('cekic', task.listA)).toBe(7);
  });

  it('çoğul eki ve beş ve daha uzun kelimelerde tek bir yazım kayması kabul edilir', () => {
    const ok = (typed: string, word: string) => sameWord(normalizeWord(typed), normalizeWord(word));
    expect(ok('tavşanlar', 'tavşan')).toBe(true);
    expect(ok('kulaklar', 'kulak')).toBe(true);
    expect(ok('paralar', 'para')).toBe(true);
    expect(ok('tavsn', 'tavşan')).toBe(true); // eksik harf
    expect(ok('tavşaan', 'tavşan')).toBe(true); // fazla harf
    expect(ok('tvaşan', 'tavşan')).toBe(true); // yer değiştiren iki harf
    expect(ok('tacşan', 'tavşan')).toBe(true); // klavyede yan yana (c, v)
    expect(ok('tabşan', 'tavşan')).toBe(true); // klavyede yan yana (v, b)
    // Kabul edilmeyenler: ilk harf farklı, dört harfli kelimede kayma, klavyede uzak harf, iki kayma.
    expect(ok('savşan', 'tavşan')).toBe(false);
    expect(ok('pra', 'para')).toBe(false);
    expect(ok('kucak', 'kulak')).toBe(false);
    expect(ok('salon', 'balon')).toBe(false);
    expect(ok('tvşn', 'tavşan')).toBe(false);
    expect(ok('tavşanım', 'tavşan')).toBe(false);
  });

  it('birden çok kelime yazılırsa ayrılır; boş ve işaretten ibaret yazılar alınmaz', () => {
    expect(splitWords('kedi, köpek  elma.')).toEqual(['kedi', 'köpek', 'elma']);
    expect(splitWords(' ;,. ')).toEqual([]);
    expect(splitWords('123')).toEqual([]);
  });
});

describe('Kelime listesi: puanlama', () => {
  it('örnek cevaplar: denemeler, toplam, artış, koruma, listenin kısımları ve tanıma', () => {
    const r = score();
    expect(r.trials.map((t) => t.correct)).toEqual([6, 9, 12]);
    expect([r.total, r.totalMax, r.gain, r.b.correct, r.delayed.correct, r.retention]).toEqual([27, 45, 6, 6, 11, 0.917]);
    expect(r.positions).toEqual({ begin: 12, middle: 4, end: 11, of: 15 });
    expect([r.extraLearning, r.emptyRecalls, r.restarts]).toEqual([0, 0, 0]);
    expect([r.recognition.hits, r.recognition.targets, r.recognition.yes]).toEqual([15, 15, 16]);
    expect(r.recognition.falseYes).toEqual({ b: 0, semantic: 1, sound: 0, new: 0 });
    expect(r.recognition.falseYesPairs).toEqual([{ kind: 'semantic', word: 'portakal', of: 'limon' }]);
    expect([r.recognition.hitRate, r.recognition.falseRate, r.recognition.discrimination]).toEqual([1, 0.05, 0.95]);
    expect(wordListRecogValid(r)).toBe(true);
  });

  it('öteki listeden ve listede olmayan kelimeler, tekrarlar ve yazım kaymaları ayrı sayılır', () => {
    const r = score({
      recalls: [
        ['Tavşan', 'tavşanlar', 'tavsn', 'kalem', 'kitap', 'sabun', '???'],
        A([0, 1]),
        A([0, 1, 2]),
        [...B([0, 1]), ...A([5, 6, 7])],
        [...A([0]), ...B([3, 4]), 'portakal'],
      ],
    });
    // "tavşanlar" ve "tavsn", "Tavşan"ın tekrarıdır; "???" kelime sayılmaz; "sabun" ikinci listededir.
    expect(r.trials[0]).toMatchObject({ correct: 1, entries: 6, repeats: 2, extra: 2, otherList: 1, recalled: [0] });
    expect(r.b).toMatchObject({ list: 'B', correct: 2, otherList: 3, extra: 0 });
    // Tanımadaki yanılgı ("portakal") listede olmadığı için hiçbir listeden sayılmaz.
    expect(r.delayed).toMatchObject({ list: 'A', correct: 1, otherList: 2, extra: 1 });
    expect(r.extraLearning).toBe(2);
  });

  it('hiç kelime yazılmayan denemeler, listenin baştan gösterilmesi ve tanımadaki çok hızlı cevaplar', () => {
    const r = score({ recalls: [[], A([0]), [], [], A([0])], restarts: [1, 0, 2] });
    expect([r.emptyRecalls, r.restarts, r.entries]).toEqual([3, 3, 2]);
    const fast = score({ recogRt: (q) => (q.j % 4 === 0 ? 200 : 1200) });
    expect([fast.recognition.tooFast, wordListRecogFast(fast), wordListRecogValid(fast)]).toEqual([9, true, false]);
    const all = score({ recog: () => true });
    expect([wordListRecogOneSided(all), wordListRecogValid(all)]).toEqual([true, false]);
    const none = score({ recog: () => false });
    expect([wordListRecogOneSided(none), wordListRecogValid(none)]).toEqual([true, false]);
    const guess = score({ recog: (q) => q.j % 2 === 0 });
    expect([wordListRecogOneSided(guess), wordListRecogChance(guess), wordListRecogValid(guess)]).toEqual([false, true, false]);
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı deneme iki kez gelirse ilki sayılır', () => {
    const ok = inputs();
    expect(() => scoreWordList(task, ok.slice(1))).toThrow(TaskInputError);
    expect(() => scoreWordList(task, ok.slice(0, -1))).toThrow(TaskInputError);
    const bad = (i: number, response: unknown) => ok.map((t, k) => (k === i ? { ...t, response: response as WordListTrialInput['response'] } : t));
    for (const r of [null, 1, { words: 'tavşan' }, { words: Array(41).fill('kedi') }, { words: ['x'.repeat(31)] }, { words: [], restarts: -1 }]) {
      expect(() => scoreWordList(task, bad(0, r)), JSON.stringify(r).slice(0, 40)).toThrow(TaskInputError);
    }
    for (const r of [null, 0, 3, { words: [] }]) expect(() => scoreWordList(task, bad(7, r)), String(r)).toThrow(TaskInputError);
    expect(() => scoreWordList(task, ok.map((t, k) => (k === 7 ? { ...t, rtMs: -1 } : t)))).toThrow(TaskInputError);
    expect(() => scoreWordList(task, [...ok, { index: 40, response: 1, rtMs: 100 }])).toThrow(TaskInputError);
    expect(scoreWordList(task, [...ok, { index: 0, response: { words: [] }, rtMs: 1 }]).result.trials[0].correct).toBe(6);
    // İstek gövdesinin biçimi: yazılan kelimeler en çok 40, her biri en çok 30 harf.
    expect(answersBody.safeParse(wordListBody()).success).toBe(true);
    const long = wordListBody({ recalls: [['x'.repeat(31)], [], [], [], []] });
    expect(answersBody.safeParse(long).success).toBe(false);
    const empty = wordListBody();
    (empty.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, empty)).toThrow(AssessmentError);
  });
});

/** Raporun kartlarında, uyarılarında ve grafiklerinde bütün durum birleşimleri. */
type Learn = 'artis' | 'biraz' | 'tavan' | 'azaldi' | 'az';
type Serial = 'end' | 'begin' | 'ends' | 'even' | 'middle';
type Kept = 'same' | 'more' | 'slight' | 'big';
type Recog = 'good' | 'semantic' | 'sound' | 'b' | 'new' | 'allyes' | 'fast' | 'chance';
const LEARN: Record<Learn, number[]> = { artis: [6, 9, 12], biraz: [8, 9, 9], tavan: [14, 14, 15], azaldi: [9, 7, 6], az: [2, 3, 3] };
const order = (s: Serial): number[] =>
  s === 'end'
    ? range(0, 15).reverse()
    : s === 'begin'
      ? range(0, 15)
      : s === 'ends'
        ? range(0, 8).flatMap((i) => (i === 7 ? [7] : [i, 14 - i]))
        : s === 'middle'
          ? [7, 6, 8, 5, 9, 4, 10, 3, 11, 2, 12, 1, 13, 0, 14]
          : [0, 7, 14, 3, 10, 5, 12, 1, 8, 13, 2, 9, 4, 11, 6];
const RECOG: Record<Recog, Partial<Pick<WordListPlan, 'recog' | 'recogRt'>>> = {
  good: { recog: (q) => q.kind === 'target' },
  semantic: { recog: (q) => (q.kind === 'target' && q.of! > 2) || (q.kind === 'semantic' && q.of !== 6) },
  sound: { recog: (q) => q.kind === 'target' || (q.kind === 'sound' && q.of! < 9) },
  b: { recog: (q) => q.kind === 'target' || (q.kind === 'b' && q.of! < 9) },
  new: { recog: (q) => q.kind === 'target' || (q.kind === 'new' && q.j > 20) },
  allyes: { recog: () => true },
  fast: { recog: (q) => q.kind === 'target', recogRt: (q: WordListCell) => (q.j % 3 === 0 ? 150 : 900) },
  chance: { recog: (q) => q.j % 2 === 1 },
};

describe('Kelime listesi: rapor', () => {
  it('örnek cevaplar: dört kart, hatırlanan kelimeler grafiği, öne çıkan sayılar ve listenin kısımları', () => {
    const r = evaluate(SLUG, wordListBody());
    for (const rep of [r.student, r.parent]) {
      expect(rep.items.map((i) => i.title)).toEqual(TITLES);
      expect(rep.itemsTitle).toMatch(/^Sonuçlar(ın)?$/);
      expect(rep.items.map((i) => i.badge)).toEqual(['6, 9 ve 12 kelime', 'Hatırlananların hemen hepsi korundu', '15/15 tanındı, 1 yanlış “evet”', 'Başı ve sonu, ortasından daha çok hatırlandı']);
      expect(rep.chart?.type === 'bars' ? rep.chart.rows.map((x) => x.valueLabel) : []).toEqual(['6/15', '9/15', '12/15', '6/15', '11/15']);
      expect(rep.keyFigures).toEqual([
        { label: 'Üçüncü denemede', value: '12/15' },
        { label: 'Araya giren listeden sonra', value: '11/15' },
        { label: 'Tanıma', value: '15/15', note: '1 yanlış “evet”' },
      ]);
      expect(rep.roadmap!.bars.map((b) => [b.key, b.value, b.valueLabel])).toEqual([
        ['begin', 80, '12/15'],
        ['middle', 27, '4/15'],
        ['end', 73, '11/15'],
      ]);
      expect(rep.cautions).toEqual([]);
    }
    expect(r.student.items[2].text).toContain('İlk listedeki 15 kelimenin hepsine “evet” dedin; ilk listede olmayan 20 kelimeden 1 tanesine de “evet” dedin.');
    expect(r.parent.items[2].text).toContain('Çocuğunuz ilk listedeki 15 kelimenin hepsine “evet” dedi; ilk listede olmayan 20 kelimeden 1 tanesine de “evet” dedi.');
    expect(r.student.items[2].text).toContain('Yanlışlıkla “evet” dediğin kelimeler: anlamca yakın 1 kelime.');
    expect(r.parent.items[0].text).toContain('Çocuğunuz 15 kelimeden ilk denemede 6, ikincide 9, üçüncüde 12 kelime hatırladı (toplam 27).');
  });

  it('hiç kelime yazılmadı: hatırlama kartları "Cevap verilmedi", grafik yok; tanıma ayrıca yorumlanır', () => {
    const r = evaluate(SLUG, wordListBody({ recalls: [[], [], [], [], []] }));
    expect(r.student.items.map((i) => i.badge)).toEqual(['Cevap verilmedi', 'Cevap verilmedi', '15/15 tanındı, 1 yanlış “evet”', 'Cevap verilmedi']);
    expect(r.student.chart).toBeNull();
    expect(r.student.cautions.some((c) => c.includes('hiçbir hatırlama bölümünde kelime yazılmadı'))).toBe(true);
    expect(r.student.roadmap!.bars).toEqual([]);
    // Grafik olmadığında öne çıkan sayılar da gösterilmez (basit rapor düzeni).
    expect(r.student.keyFigures).toEqual([]);
  });

  it('özel durumlar: tanımada hiç "evet" yok, atlanan yeniden yazma, küçük düşüş, tahmine dayalı tanıma, sıfır kelime', () => {
    // Hiç "evet" denmedi: cümle olumsuz fiille kurulur.
    const no = evaluate(SLUG, wordListBody({ recog: () => false }));
    expect(no.student.items[2].text).toContain('İlk listedeki 15 kelimenin de, ilk listede olmayan 20 kelimenin de hiçbirine “evet” demedin.');
    expect(no.parent.items[2].text).toContain('Çocuğunuz ilk listedeki 15 kelimenin de, ilk listede olmayan 20 kelimenin de hiçbirine “evet” demedi.');
    const onlyLures = evaluate(SLUG, wordListBody({ recog: (q) => q.kind === 'new' }));
    expect(onlyLures.student.items[2].text).toContain('İlk listedeki 15 kelimenin hiçbirine “evet” demedin; ilk listede olmayan 20 kelimeden 5 tanesine ise “evet” dedin.');
    // İlk listenin yeniden yazıldığı bölüm boş: koruma yorumlanmaz, uyarı verilir, tanıma ile karşılaştırılmaz.
    const recalls = [A(range(0, 6)), A(range(0, 9)), A(range(0, 12)), B(range(0, 6)), []];
    const skip = evaluate(SLUG, wordListBody({ recalls }));
    expect(skip.student.items[1].badge).toBe('Yorumlanmadı');
    expect(skip.student.items[1].text).toContain('hiç kelime yazmadın; bu bölüm atlanmış olabilir. Bu yüzden karşılaştırma yorumlanmadı.');
    expect(skip.student.cautions.some((c) => c.includes('Öğrenileni koruma sonucu yorumlanmadı'))).toBe(true);
    expect(skip.student.items[2].text).not.toContain('görünce ise');
    // Az kelimelik düşüş "belirgin" sayılmaz: 4 → 2.
    const small = evaluate(SLUG, wordListBody({ recalls: [A([0, 1]), A([0, 1, 2]), A([0, 1, 2, 3]), B([0]), A([0, 1])] }));
    expect(small.student.items[1].badge).toBe('Hatırlananlar biraz azaldı');
    // Tanınan kelimeler çok, ama ilk listede olmayanlara da çok "evet": hatırlama ile tanıma karşılaştırılmaz.
    const loose = score({ recog: (q) => q.kind === 'target' || q.kind === 'new' || q.kind === 'semantic' });
    expect([wordListRecogValid(loose), loose.recognition.falseRate]).toEqual([true, 0.5]);
    expect(evaluate(SLUG, wordListBody({ recog: (q) => q.kind === 'target' || q.kind === 'new' || q.kind === 'semantic' })).student.items[2].text).not.toContain('görünce ise');
    // Hiç doğru kelime yok ama yazılmış: "0 kelime" denmez.
    const zero = evaluate(SLUG, wordListBody({ recalls: [A([0, 1, 2, 3, 4]), A(range(0, 6)), A(range(0, 7)), ['kalem'], ['kalem']] }));
    expect(zero.student.items[1].text).toContain('bu listeden hiç kelime hatırlamadın');
    expect(zero.student.items[1].text).toContain('ama hiç kelime hatırlamadın');
    expect(zero.student.items[1].text).not.toMatch(/\b0 kelime/);
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    let n = 0;
    const bad: string[] = [];
    const seen = new Set<string>();
    const check = (ok: boolean, label: string, what: string) => {
      if (!ok) bad.push(`${label}: ${what}`);
    };
    for (const learn of Object.keys(LEARN) as Learn[]) {
      for (const serial of ['end', 'begin', 'ends', 'even', 'middle'] as Serial[]) {
        for (const kept of ['same', 'more', 'slight', 'big'] as Kept[]) {
          for (const recog of Object.keys(RECOG) as Recog[]) {
            const label = `${learn}/${serial}/${kept}/${recog}`;
            const ord = order(serial);
            const counts = LEARN[learn];
            const t3pos = ord.slice(0, counts[2]);
            const t3 = counts[2];
            const dCount = kept === 'same' ? t3 : kept === 'more' ? Math.min(15, t3 + 1) : kept === 'slight' ? Math.round(t3 * 0.8) : Math.round(t3 * 0.5);
            const dPos = kept === 'more' ? ord.slice(0, dCount) : t3pos.slice(0, dCount);
            const variant = n % 4;
            const restarts = n % 3 === 0 ? [1] : [];
            const extras = variant === 3 ? ['kalem', 'kitap', 'masa', 'kedi'] : [];
            const plan: Partial<WordListPlan> = {
              recalls: [
                [...A(ord.slice(0, counts[0])), ...extras],
                [...A(ord.slice(0, counts[1])), ...extras],
                [...A(t3pos), ...extras.slice(0, variant === 3 ? 3 : 0)],
                [...B(range(0, 6)), ...(variant === 2 ? A([0, 1]) : [])],
                [...A(dPos), ...(variant === 1 ? B([2, 3]) : [])],
              ],
              restarts,
              ...RECOG[recog],
            };
            const res = evaluate(SLUG, wordListBody(plan));
            const adult = evaluateAdult(SLUG, wordListBody(plan, ADULT_GRADE)).adult;
            const result = scoreWordList(task, inputs(plan)).result as WordListResult;
            for (const r of [res.student, res.parent, adult]) {
              check(r.items.map((i) => i.title).join('|') === TITLES.join('|'), label, 'başlıklar');
              const [ogr, kor, tan, cal] = r.items;
              // Öğrenme
              check(ogr.badge === `${counts[0]}, ${counts[1]} ve ${counts[2]} kelime`, label, `öğrenme ${ogr.badge}`);
              // PDF yazı tipinde olmayan işaretler (ör. ok) kullanılmaz.
              check(!/[→←]/.test(withoutRoadmap(r)), label, 'ok işareti');
              const gain = counts[2] - counts[0];
              check(ogr.text.includes('belirgin biçimde arttı') === gain >= 3, label, 'belirgin artış');
              check(ogr.text.includes('biraz arttı') === (gain > 0 && gain < 3), label, 'biraz artış');
              const ceiling = counts[0] >= 13 && counts[2] >= 13;
              check(ogr.text.includes('hepsini ya da neredeyse hepsini') === (gain <= 0 && ceiling), label, 'tavan');
              check(/sayısı (azaldı|artmadı)/.test(ogr.text) === (gain <= 0 && !ceiling), label, 'azaldı');
              const manyNote = r.cautions.some((c) => c.includes('listede olmayan') && c.includes('kelime yazıldı'));
              check(manyNote === wordListManyExtra(result), label, 'çok fazla kelime notu');
              check(ogr.text.includes('dikkatle yorumlanmalıdır') === manyNote, label, 'çok fazla kelime kartı');
              // Öğrenileni koruma
              const d = result.delayed.correct;
              const ratio = result.retention ?? 0;
              const want =
                t3 < 4
                  ? `Araya giren listeden sonra ${d} kelime`
                  : d > t3
                    ? `${t3} kelimeden ${d} kelimeye çıktı`
                    : d === t3
                      ? 'Hatırlananlar korundu'
                      : ratio >= 0.9
                        ? 'Hatırlananların hemen hepsi korundu'
                        : ratio >= 0.7
                          ? 'Hatırlananların çoğu korundu'
                          : t3 - d < 3
                            ? 'Hatırlananlar biraz azaldı'
                            : 'Hatırlananlar belirgin biçimde azaldı';
              check(kor.badge === want, label, `koruma ${kor.badge} ≠ ${want}`);
              check(kor.text.includes('yorumlanmadı') === t3 < 4, label, 'koruma yorumlanmadı');
              check(!(kor.text.includes('azaltmadı') && kor.text.includes('belirgin biçimde azaldı')), label, 'koruma çelişki');
              check(kor.text.includes('ikinci listeden 2 kelime de yazd') === (variant === 1), label, 'ikinci listeden karışma');
              check(kor.text.includes('ilk listeden 2 kelime de yazd') === (variant === 2), label, 'ilk listeden karışma');
              // Tanıma
              const valid = wordListRecogValid(result);
              check((tan.badge === 'Yorumlanmadı') === !valid, label, 'tanıma yorumlandı mı');
              check((r.keyFigures[2].value === 'Yorumlanmadı') === !valid, label, 'tanıma sayısı');
              check(r.cautions.some((c) => c.includes('tanıma sonucu yorumlanmadı') || c.includes('Tanıma sonucu yorumlanmadı')) === !valid, label, 'tanıma notu');
              if (valid) {
                const top = (['semantic', 'sound', 'b', 'new'] as const).find((k) => recog === k);
                check(tan.text.includes('anlamca yakın kelimelerdi') === (top === 'semantic'), label, 'anlamca yakın');
                check(tan.text.includes('sesi ve yazılışı ilk listedeki bir kelimeye benzeyen') === (top === 'sound'), label, 'sesi benzer');
                check(tan.text.includes('ikinci listedeki kelimelerdi') === (top === 'b'), label, 'ikinci liste');
                check(tan.text.includes('ilgisiz kelimelerdi') === (top === 'new'), label, 'ilgisiz');
                if (top === 'semantic' || top === 'sound') {
                  const m = /\(ör\. “([^”]+)”; listede “([^”]+)” vardı\)/.exec(tan.text);
                  const pair = KEY.find((k) => k.kind === top && k.word === m?.[1]);
                  check(!!pair && task.listA[pair.of!] === m![2], label, `örnek ${m?.[0]}`);
                }
                check(tan.text.includes('görünce ise') === (result.recognition.hits - d >= 4 && result.recognition.falseRate <= 0.2), label, 'tanıma ve hatırlama');
                check(!tan.text.includes('Dewhurst'), label, 'tanımada kaynak cümlesi');
              }
              // Çalışma biçimi
              const p = result.positions;
              const compared = result.total >= 9;
              const middleLow = p.middle <= Math.min(p.begin, p.end) - 4;
              const wantCal = !compared
                ? 'Kısımlar karşılaştırılmadı'
                : p.middle - Math.max(p.begin, p.end) >= 4
                  ? 'Listenin ortası daha çok hatırlandı'
                  : p.end - p.begin >= 4
                    ? 'Listenin sonu, başından daha çok hatırlandı'
                    : p.begin - p.end >= 4
                      ? 'Listenin başı, sonundan daha çok hatırlandı'
                      : middleLow
                        ? 'Başı ve sonu, ortasından daha çok hatırlandı'
                        : 'Listenin her kısmından benzer sayıda kelime';
              seen.add(wantCal);
              check(cal.badge === wantCal, label, `çalışma ${cal.badge} ≠ ${wantCal}`);
              check(cal.text.includes('Ortadaki kelimeler daha az hatırlandı') === (compared && middleLow), label, 'orta');
              check(r.roadmap!.bars.length === (compared ? 3 : 0), label, 'üç boyutlu grafik');
              if (compared) check(r.roadmap!.bars.map((b) => b.valueLabel).join('|') === [p.begin, p.middle, p.end].map((x) => `${x}/15`).join('|'), label, 'grafik değerleri');
              const restartNote = r.cautions.some((c) => c.includes('baştan gösterildi'));
              check(restartNote === restarts.length > 0, label, 'baştan gösterme notu');
              check(cal.text.includes('baştan gösterildi') === restartNote, label, 'baştan gösterme kartı');
              check(cal.text.includes('hiçbir listede olmayan bir kelime yazma') === (result.extraLearning === 0), label, 'listede olmayan');
              // Grafik
              const rows = r.chart?.type === 'bars' ? r.chart.rows.map((x) => x.value) : [];
              check(rows.join(',') === [...counts, 6, d].join(','), label, 'grafik');
            }
            check(!text(res.student).includes('Çocuğunuz') && !text(adult).includes('Çocuğunuz'), label, 'Çocuğunuz');
            check(!/\b(hatırladın|yazdın|dedin|tanıdın|ettin)\b/.test(withoutRoadmap(res.parent)), label, 'veli metni');
            check(schoolWords(withoutRoadmap(adult)).length === 0, label, `okul sözcüğü ${schoolWords(withoutRoadmap(adult))}`);
            check(!/çocukluk boyunca/.test(withoutRoadmap(adult)), label, 'yetişkine gelişim cümlesi');
            n++;
          }
        }
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
    expect(n).toBe(5 * 5 * 4 * 8);
    // Listenin kısımlarına göre bütün başlıklar denendi.
    expect(seen.size).toBe(6);
  }, 300_000);

  it('3. sınıftan itibaren; yetişkinler de yapabilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, wordListBody(undefined, 2))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, wordListBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([kelimeListesi.intro.title, ...kelimeListesi.intro.paragraphs, ...task.instructions].join(' '))).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /KL_GOVDE=\$\(python3 -c '(.*?)'\)/.exec(yml);
    expect(m).not.toBeNull();
    // Dış sınamadaki gövde: ilk listenin üç denemesinde 5, 10 ve 15 kelime; ikinci listeden 5; sonra 15 kelime; tanımada yalnızca ilk listedeki kelimelere "evet".
    expect(m![1]).toContain(`a=${JSON.stringify(task.listA)}`);
    expect(m![1]).toContain(`b=${JSON.stringify(task.listB)}`);
    expect(m![1]).toContain(`k=${JSON.stringify(task.recognitionKey.map((k) => (k.kind === 'target' ? 1 : 2)))}`);
    const body = wordListBody({
      recalls: [task.listA.slice(0, 5), task.listA.slice(0, 10), task.listA, task.listB.slice(0, 5), task.listA],
      recog: (q) => q.kind === 'target',
    });
    const r = evaluate(SLUG, body);
    expect(r.student.items[0].badge).toBe('5, 10 ve 15 kelime');
    expect(r.student.items[2].badge).toBe('15/15 tanındı, 0 yanlış “evet”');
    expect(r.parent.chart?.type === 'bars' ? r.parent.chart.rows : []).toHaveLength(5);
    expect(r.parent.roadmap!.bars).toHaveLength(3);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, wordListBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, wordListBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(kelimeListesi.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(kelimeListesi.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(kelimeListesi.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...kelimeListesi.science, citations: [] });
    const authors = ['Oliveira', 'Lehmann', 'Dewhurst', 'Hedge'];
    expect(kelimeListesi.science.citations.map((c) => c.text.split(',')[0])).toEqual(authors);
    for (const a of authors) expect(body, a).toMatch(new RegExp(`${a}(,| ve)`));
    // Yol haritasının kaynakları: bilim kartındaki iki çalışma ve sitede zaten kullanılan iki öğrenme araştırması.
    const cites = kelimeListesi.science.citations.map((c) => c.url);
    const rm = TASK_ROADMAPS[SLUG].sources.map((s) => s.url);
    expect(rm.filter((u) => cites.includes(u))).toEqual([cites[0], cites[1]]);
    expect(rm).toHaveLength(4);
  });
});
