import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { LETTER_NUMBER_LEVELS, LETTER_NUMBER_PRACTICE, harfSayiSiralama } from '@/content/instruments/harf-sayi-siralama';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { taskTrial } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { lnAnswer, lnCheck, lnGrouped, lnLettersFirst } from '@/lib/instruments/letter-number';
import type { LetterNumberTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  LN_LONG,
  LN_RAPID_BASE_MS,
  LN_RAPID_MS_PER_ITEM,
  TaskInputError,
  lnFloor,
  lnGaveUpSorting,
  lnLettersFirstHabit,
  lnManySkipped,
  lnRapid,
  lnUnsorted,
  scoreLetterNumber,
  type LetterNumberResult,
  type LetterNumberTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import {
  hsGrouped,
  hsIntrude,
  hsLettersFirst,
  hsMissOne,
  hsShown,
  hsSwapLast,
  letterNumberBody,
  type LetterNumberCell,
} from './helpers/bodies';
import { ayrilmis, diziKurallari, dogruCevap, onceHarfler, ortak } from './helpers/letter-number-check';
import { schoolWords } from './helpers/school';

const SLUG = 'harf-sayi-siralama';
const task = harfSayiSiralama.tasks[0] as LetterNumberTask;
const TITLES = ['En uzun doğru dizi', 'Doğru sıralanan diziler', 'Hata türleri', 'Sayılar ve harfler', 'Çalışma biçimi'];

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof letterNumberBody>) => (body.data as unknown as { blocks: Record<string, LetterNumberTrialInput[]> }).blocks[task.key];
const flat = task.levels.flatMap((l) => l.items.map((seq) => ({ length: l.length, seq })));

describe('Harf-sayı sıralama: diziler', () => {
  it('7 uzunluk (2–8 öğe), her birinde üç dizi; 3 alıştırma; 1–9 sayıları ve 12 ünsüz; harf tuşları klavye düzeninde', () => {
    expect(LETTER_NUMBER_LEVELS.map(([n]) => n)).toEqual([2, 3, 4, 5, 6, 7, 8]);
    for (const [n, items] of LETTER_NUMBER_LEVELS) {
      expect(items, String(n)).toHaveLength(3);
      for (const d of items) expect(d.length, d).toBe(n);
    }
    expect(task.levels.map((l) => [l.length, l.items])).toEqual(LETTER_NUMBER_LEVELS);
    expect(task.practice).toEqual(LETTER_NUMBER_PRACTICE);
    expect(task.practice.map((p) => p.length)).toEqual([2, 3, 4]);
    expect(task.digits).toBe('123456789');
    expect(task.letters).toBe('CDFHKLMNPRTY');
    // Harfler alfabe sırasıyla yazılı; ünlü, sayılarla karışabilecek harf ve Türkçeye özgü harf yok.
    expect([...task.letters].sort((a, b) => 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.indexOf(a) - 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.indexOf(b)).join('')).toBe(task.letters);
    for (const c of 'AEIİOÖUÜBGSZÇĞŞVJ') expect(task.letters, c).not.toContain(c);
    // Harf tuşları: Türkçe Q klavyedeki satırları ve sıralarıyla; her harf bir kez.
    const Q = ['QWERTYUIOPĞÜ', 'ASDFGHJKLŞİ', 'ZXCVBNMÖÇ'];
    expect(task.keyRows).toEqual(Q.map((row) => [...row].filter((c) => task.letters.includes(c)).join('')));
    expect(task.keyRows.join('').length).toBe(12);
    expect(task.onMs).toBe(1000);
    expect(task.offMs).toBe(250);
  });

  it('her dizi kurallara uyar (bağımsız denetleyici); alıştırmalar da', () => {
    for (const { seq } of flat) expect(diziKurallari(seq, task.letters), seq).toEqual([]);
    for (const p of task.practice) expect(diziKurallari(p, task.letters), p).toEqual([]);
    // İki öğeli dizilerde harf önce gelir; doğru cevap sayı önce.
    for (const d of LETTER_NUMBER_LEVELS[0][1]) expect(/^[A-Z][1-9]$/.test(d), d).toBe(true);
  });

  it('doğru cevap ve cevap biçimleri: kütüphane bağımsız denetleyiciyle aynı hesaplar', () => {
    for (const { seq } of [...flat, ...task.practice.map((seq) => ({ seq }))]) {
      expect(lnAnswer(seq).join(''), seq).toBe(dogruCevap(seq));
      expect(lnLettersFirst(seq).join(''), seq).toBe(onceHarfler(seq));
      expect(lnGrouped(seq).join(''), seq).toBe(ayrilmis(seq));
    }
    expect(lnAnswer('K93C6R').join('')).toBe('369CKR');
    expect(lnAnswer('R7H1').join('')).toBe('17HR');
  });

  it('denge: uzunluklarda sayı ve harf sayıları; öğelerin testteki sıklığı; dizilerin sırası', () => {
    const digits = flat.reduce((a, x) => a + [...x.seq].filter((c) => /\d/.test(c)).length, 0);
    expect(digits).toBe(53);
    expect(flat.reduce((a, x) => a + x.seq.length, 0) - digits).toBe(52);
    const use = new Map<string, number>();
    for (const { seq } of flat) for (const c of seq) use.set(c, (use.get(c) ?? 0) + 1);
    const ds = [...task.digits].map((c) => use.get(c) ?? 0);
    const ls = [...task.letters].map((c) => use.get(c) ?? 0);
    expect(Math.max(...ds) - Math.min(...ds)).toBeLessThanOrEqual(1);
    expect(Math.max(...ls) - Math.min(...ls)).toBeLessThanOrEqual(1);
    // İki öğeliler dışında dizilerin yarısı harfle, yarısı sayıyla başlar (±1).
    const firsts = flat.filter((x) => x.length > 2).map((x) => /\d/.test(x.seq[0]));
    expect(Math.abs(firsts.filter(Boolean).length - firsts.length / 2)).toBeLessThanOrEqual(1);
    for (let i = 1; i < flat.length; i++) {
      const [a, b] = [flat[i - 1].seq, flat[i].seq];
      expect(a[0] === b[0], `${a} – ${b}`).toBe(false);
      expect(ortak(a, b), `${a} – ${b}`).toBeLessThanOrEqual(Math.floor(b.length / 2));
    }
    for (const [n, items] of LETTER_NUMBER_LEVELS) {
      for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 3; j++) {
          expect(new Set(items[i]).size === new Set(items[i] + items[j]).size, `${items[i]} – ${items[j]}`).toBe(false);
          expect(ortak(items[i], items[j]), `${items[i]} – ${items[j]}`).toBeLessThanOrEqual(Math.ceil(n / 2));
        }
      }
    }
    // Alıştırmalar asıl dizilerden farklı: kısa dizilerde en çok bir ortak öğe, ilk öğeleri farklı.
    for (const p of task.practice) {
      for (const { length, seq } of flat) {
        expect(ortak(p, seq), `${p} – ${seq}`).toBeLessThanOrEqual(length <= 4 ? 1 : Math.floor(length / 2));
        expect(p[0] === seq[0], `${p} – ${seq}`).toBe(false);
      }
    }
  });

  it('diziler sabit: diziler değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ levels: task.levels, practice: task.practice, onMs: task.onMs, offMs: task.offMs, digits: task.digits, letters: task.letters, keyRows: task.keyRows }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: harfSayiSiralama.version, hash }).toEqual({ version: 1, hash: DIZI_IZI });
  });
});

/** Dizilerin izi (sürüm 1): diziler bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const DIZI_IZI = '868c28318dda955b';

describe('Harf-sayı sıralama: cevabın incelenmesi', () => {
  it('cevap türleri: doğru, gösterildiği sırayla, ayrılmış, önce harfler, sıra karışık, öğe eksik ya da dizide yok', () => {
    const d = 'K93C6R';
    expect(lnCheck(d, [...'369CKR'])).toMatchObject({ correct: true, kind: null, recalled: 6, inOrder: 6, missing: 0, intrusions: 0, digitsBeforeLetters: true });
    expect(lnCheck(d, [...d]).kind).toBe('shown');
    expect(lnCheck(d, [...'936KCR']).kind).toBe('grouped');
    expect(lnCheck(d, [...'CKR369']).kind).toBe('lettersFirst');
    expect(lnCheck(d, [...'369CRK']).kind).toBe('order');
    expect(lnCheck(d, [...'369CK']).kind).toBe('items');
    expect(lnCheck(d, [...'369CK']).inOrder).toBe(5);
    expect(lnCheck(d, [...'369CKT'])).toMatchObject({ kind: 'items', recalled: 5, intrusions: 1, missing: 1 });
    expect(lnCheck(d, [])).toMatchObject({ skipped: true, kind: null, recalled: 0 });
    // İki öğeli dizide bütün öğeleri içeren her yanlış cevap "önce harf"tir.
    expect(lnCheck('P2', ['P', '2']).kind).toBe('lettersFirst');
    // Sayılar ve harfler ayrı ayrı: sıralı mı, kaç tanesi hatırlandı.
    const c = lnCheck(d, [...'396CRK']);
    expect(c.digits).toEqual({ shown: 3, recalled: 3, ordered: false });
    expect(c.letters).toEqual({ shown: 3, recalled: 3, ordered: false });
    expect(lnCheck(d, [...'36C']).digits).toEqual({ shown: 3, recalled: 2, ordered: true });
    expect(lnCheck(d, [...'36C']).letters).toEqual({ shown: 3, recalled: 1, ordered: null });
    expect(lnCheck(d, [...'3C69']).digitsBeforeLetters).toBe(false);
  });

  it('dizilerin hepsinde dört cevap biçimi ayrı türlere düşer (iki öğeliler hariç)', () => {
    for (const { seq } of flat.filter((x) => x.length >= 3)) {
      expect(lnCheck(seq, [...seq]).kind, seq).toBe('shown');
      expect(lnCheck(seq, lnGrouped(seq)).kind, seq).toBe('grouped');
      expect(lnCheck(seq, lnLettersFirst(seq)).kind, seq).toBe('lettersFirst');
    }
  });
});

describe('Harf-sayı sıralama: puanlama', () => {
  it('varsayılan örnek: 6 öğeye kadar; hata türleri, sayılar ve harfler', () => {
    const { result } = scoreLetterNumber(task, trialsOf(letterNumberBody()));
    expect(result).toMatchObject({ start: 2, max: 8, span: 6, stoppedAt: 7, trials: 18, correct: 13, wrong: 5, skipped: 0, attemptedWrong: 5 });
    expect(result.kinds).toEqual({ shown: 0, grouped: 0, lettersFirst: 0, order: 0, items: 5 });
    expect(result.itemsOrderKept).toBe(5);
    expect(result.levels.map((l) => l.correct)).toEqual([3, 3, 3, 3, 1, 0]);
    expect(result.itemsShown).toBe(3 * (2 + 3 + 4 + 5 + 6 + 7));
    expect(result.itemsRecalled).toBe(result.itemsShown - 5);
    expect(lnFloor(result)).toBe(false);
  });

  it('hepsi doğru, hepsi yanlış, gösterildiği sırayla, önce harfler', () => {
    const top = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: q.answer })))).result;
    expect(top).toMatchObject({ span: 8, stoppedAt: null, trials: 21, correct: 21, wrong: 0 });
    const none = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: hsMissOne(q) })))).result;
    expect(none).toMatchObject({ span: 0, stoppedAt: 2, trials: 3, correct: 0 });
    expect(lnFloor(none)).toBe(true);
    const shown = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: hsShown(q) })))).result;
    expect(shown).toMatchObject({ span: 0, trials: 3 });
    expect(shown.kinds.lettersFirst).toBe(3);
    expect(lnLettersFirstHabit(shown)).toBe(true);
    // Sayıları önce yazıp kendi içlerinde sıralamayan: 2 öğeliler doğru, 3 öğelilerin hepsi "ayrılmış".
    const grouped = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: hsGrouped(q) })))).result;
    expect(grouped).toMatchObject({ span: 2, stoppedAt: 3, trials: 6 });
    expect(grouped.kinds.grouped).toBe(3);
    expect(lnUnsorted(grouped)).toBe(true);
    const lf = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: q.length === 2 ? q.answer : hsLettersFirst(q) })))).result;
    expect(lf.kinds.lettersFirst).toBe(3);
    expect(lnLettersFirstHabit(lf)).toBe(true);
    expect(lnUnsorted(lf)).toBe(false);
  });

  it('dizide olmayan öğe girmek bir öğe hatasıdır; girilen öğeleri doğru sırada olan öğe hataları ayrıca sayılır', () => {
    const body = letterNumberBody((q) => ({ seq: q.length <= 4 ? q.answer : q.length === 5 || q.k === 0 ? hsIntrude(q, flat[q.i - 1].seq) : hsMissOne(q) }));
    const { result } = scoreLetterNumber(task, trialsOf(body));
    expect(result.kinds.items).toBe(result.attemptedWrong);
    // Dizide olmayan öğe girilen diziler "kural uygulandı, öğe unutuldu" sayılmaz.
    expect(result.itemsOrderKept).toBe(result.items.filter((x) => !x.correct && x.intrusions === 0).length);
    const r = evaluate(SLUG, body);
    expect(r.student.items[2].text).toContain('Doğru sıralayamadığın dizilerin hepsinde dizide olmayan öğe girdin.');
  });

  it('kural kısa dizilerde uygulanıp uzun dizilerde bırakıldıysa: yük olarak anlatılır, uyarı ve çekince yok', () => {
    const body = letterNumberBody((q) => ({ seq: q.length <= 4 ? q.answer : hsShown(q) }));
    const { result } = scoreLetterNumber(task, trialsOf(body));
    expect(result).toMatchObject({ span: 4, stoppedAt: 5 });
    expect(lnGaveUpSorting(result)).toBe(true);
    expect(lnUnsorted(result)).toBe(false);
    const r = evaluate(SLUG, body);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.items[2].badge).toBe('Uzun dizilerde sıraya konmadan girilmiş');
    expect(r.student.items[2].text).toContain('Daha kısa dizileri doğru sıraladığın için bu, kuralı bilmediğini göstermez');
    expect(r.parent.items[2].text).toContain('Çocuğunuz daha kısa dizileri doğru sıraladığı için');
    for (const i of r.student.items) expect(i.text, i.title).not.toContain('tam yansıtmayabilir');
    expect(r.student.items[3].badge).toBe('Karşılaştırılmadı');
    expect(r.student.items[3].text).toContain('Uzun dizilerde öğeler sıraya konmadan girildiği için sayılar ve harfler karşılaştırılmadı.');
    expect(r.student.items[3].visual?.type).toBe('bars');
    // Aynı cevaplar en kısa dizilerden başlarsa kural hiç gösterilmemiştir: uyarı verilir.
    const never = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: q.length <= 2 ? q.answer : hsShown(q) })))).result;
    expect(lnGaveUpSorting(never)).toBe(false);
  });

  it('bakmadan girme, "Hatırlamıyorum" ve yeniden gösterilen diziler', () => {
    const fast = scoreLetterNumber(
      task,
      trialsOf(letterNumberBody((q) => (q.length <= 4 ? { seq: q.answer } : { seq: q.answer.slice(0, 1), rtMs: LN_RAPID_BASE_MS + LN_RAPID_MS_PER_ITEM - 1 }))),
    ).result;
    expect(fast.rapid).toBe(3);
    expect(lnRapid(fast)).toBe(true);
    const slow = scoreLetterNumber(
      task,
      trialsOf(letterNumberBody((q) => (q.length <= 4 ? { seq: q.answer } : { seq: q.answer.slice(0, 1), rtMs: LN_RAPID_BASE_MS + LN_RAPID_MS_PER_ITEM }))),
    ).result;
    expect(slow.rapid).toBe(0);
    const skips = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: q.length <= 2 || q.k === 0 ? q.answer : [] })))).result;
    expect(lnManySkipped(skips)).toBe(true);
    const atStop = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: q.length <= 5 ? q.answer : [] })))).result;
    expect(lnManySkipped(atStop)).toBe(false);
    const restarts = scoreLetterNumber(task, trialsOf(letterNumberBody((q) => ({ seq: q.answer, restarts: q.i === 3 || q.i === 9 ? 1 : 0 })))).result;
    expect(restarts.restarts).toBe(2);
  });

  it('geçersiz cevaplar reddedilir', () => {
    const ok = trialsOf(letterNumberBody());
    const bad = (seq: string[]) => [{ ...ok[0], response: { seq } }, ...ok.slice(1)];
    expect(() => scoreLetterNumber(task, bad(['2', '2']))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, bad(['2', 'P', 'K']))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, bad(['0']))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, bad(['A']))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, bad(['p']))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, ok.slice(0, 17))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, ok.slice(1))).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, [])).toThrow(TaskInputError);
    expect(() => scoreLetterNumber(task, [{ ...ok[0], rtMs: -5 }, ...ok.slice(1)])).toThrow(TaskInputError);
    for (const restarts of [-1, 1.5, 51]) expect(() => scoreLetterNumber(task, [{ ...ok[0], response: { seq: ok[0].response.seq, restarts } }, ...ok.slice(1)])).toThrow(TaskInputError);
    // Üç dizisi de yanlış bir uzunluktan sonra dizi gelmez.
    const after = trialsOf(letterNumberBody((q) => ({ seq: q.length === 3 ? hsMissOne(q) : q.answer })));
    expect(() => scoreLetterNumber(task, [...after, { index: after.length, response: { seq: [] }, rtMs: 3000 }])).toThrow(TaskInputError);
    // Biçim denetimi: öğe bir karakter, en çok 9 öğe.
    expect(taskTrial.safeParse({ index: 0, response: { seq: ['P', '2'] }, rtMs: 1000 }).success).toBe(true);
    expect(taskTrial.safeParse({ index: 0, response: { seq: ['P2'] }, rtMs: 1000 }).success).toBe(false);
    expect(taskTrial.safeParse({ index: 0, response: { seq: [...'123456789C'] }, rtMs: 1000 }).success).toBe(false);
  });
});

describe('Harf-sayı sıralama: rapor', () => {
  it('örnek: beş kart, öne çıkan sayılar ve dizi uzunluğuna göre grafik; üç boyutlu grafik yok', () => {
    const r = evaluate(SLUG, letterNumberBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['En uzun doğru dizi', '6 öğe'],
      ['Doğru sıralanan diziler', '18 diziden 13 doğru'],
      ['Hata türleri', 'Hepsinde öğe eksik'],
      ['Sayılar ve harfler', 'Belirgin fark yok'],
      ['Çalışma biçimi', expect.stringMatching(/^Dizi başına tipik süre \d+ saniye$/)],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['En uzun doğru dizi', '6 öğe'],
      ['Doğru sıralanan dizi', '13/18'],
      ['Doğru sıradaki öğeler', '%93'],
    ]);
    expect(r.student.items[0].text).toContain('Bütün öğeleriyle doğru sıraladığın en uzun dizi 6 öğeliydi. Test, 7 öğeli üç dizinin hiçbirini doğru sıralayamadığın için orada bitti.');
    expect(r.student.items[1].text).toContain('Uzunluğu 5 öğeye kadar olan dizilerin hepsini doğru sıraladın; daha uzun dizilerin bazılarını doğru sıraladın, bazılarını sıralayamadın.');
    expect(r.student.items[1].text).toContain('uzun dizilerde yanılmak bu testte olağandır');
    expect(r.student.items[2].text).toContain('Doğru sıralayamadığın dizilerin hepsinde bir ya da birkaç öğe aklında kalmadı. Bu dizilerin hepsinde girdiğin öğeleri doğru sıraya koydun. Yani sıralama kuralını uyguladın; zorlayan, dizi uzayınca bütün öğeleri aklında tutmaktı.');
    expect(r.parent.items[2].text).toContain('Çocuğunuz bu dizilerin hepsinde girdiği öğeleri doğru sıraya koydu');
    expect(r.parent.items[0].text).toContain('Çocuğunuzun bütün öğeleriyle doğru sıraladığı en uzun dizi 6 öğeliydi.');
    const chart = r.student.chart;
    expect(chart?.type === 'bars' ? chart.rows.map((x) => [x.label, x.valueLabel]) : []).toEqual([
      ['2 öğeli', '3/3'],
      ['3 öğeli', '3/3'],
      ['4 öğeli', '3/3'],
      ['5 öğeli', '3/3'],
      ['6 öğeli', '1/3'],
      ['7 öğeli', '0/3'],
    ]);
    expect(r.student.roadmap!.bars).toEqual([]);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('uç durumlar: hepsi doğru, en kısalar da yanlış, önce harfler, sıralanmadan', () => {
    const top = evaluate(SLUG, letterNumberBody((q) => ({ seq: q.answer })));
    expect(top.student.items.map((i) => i.badge).slice(0, 3)).toEqual(['8 öğe (testin en uzun dizisi)', '21 dizinin hepsi doğru', 'Hata yok']);
    expect(top.student.items[0].text).toContain('En uzun (8 öğeli) dizilerin hepsini de doğru sıraladın. Testte daha uzun dizi olmadığı için');
    expect(top.student.items[0].text).not.toContain('kabaca fikir verir');
    const floor = evaluate(SLUG, letterNumberBody((q) => ({ seq: hsMissOne(q) })));
    expect(floor.student.items.map((i) => i.badge).slice(0, 4)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    expect(floor.student.items.slice(0, 4).map((i) => i.visual)).toEqual([undefined, undefined, undefined, undefined]);
    expect(floor.student.cautions.join(' ')).toContain('en kısa (2 öğeli) dizilerin hiçbiri doğru sıralanmadı; yönerge tam anlaşılmamış');
    const letterFirst = evaluate(SLUG, letterNumberBody((q) => ({ seq: hsShown(q) })));
    expect(letterFirst.student.items[0].text).toContain('En kısa (2 öğeli) dizilerin hepsinde harfi sayıdan önce yazdın');
    expect(letterFirst.student.cautions.join(' ')).toContain('hepsinde harf sayıdan önce yazıldı');
    const grouped = evaluate(SLUG, letterNumberBody((q) => ({ seq: hsGrouped(q) })));
    expect(grouped.student.items[2].badge).toBe('Sıraya konmadan girilmiş');
    expect(grouped.student.items[2].text).toContain('sayıları harflerden önce yazdın ama sayıları ve harfleri kendi içlerinde gösterildikleri sırada bıraktın');
    expect(grouped.student.items[0].text).toContain('Hata türleri kartında anlatılan nedenle bu sonuç seni tam yansıtmayabilir.');
    expect(grouped.student.cautions.join(' ')).toContain('sıralama kuralı tam uygulanmamış olabilir');
    const swap = evaluate(SLUG, letterNumberBody((q) => ({ seq: q.length <= 4 || q.k === 0 ? q.answer : hsSwapLast(q) })));
    expect(swap.student.items[2].badge).toBe('Hepsinde sıra karışık');
    expect(swap.student.items[2].text).toContain('bütün öğeleri hatırladın ama sıraya koyarken yanıldın');
    // En kısa dizilerden biri yanlış, sonra 3–6 öğelilerin hepsi doğru: sonraki uzunluklar ayrıca söylenir.
    const early = evaluate(SLUG, letterNumberBody((q) => ({ seq: (q.length === 2 && q.k === 1) || q.length === 7 ? hsMissOne(q) : q.answer })));
    expect(early.student.items[1].text).toContain('En kısa (2 öğeli) dizilerden birini doğru sıralayamadın. Sonra 3–6 öğeli dizilerin hepsini doğru sıraladın; 7 öğeli dizilerin hiçbirini doğru sıralayamadın.');
    const none = evaluate(SLUG, letterNumberBody(() => ({ seq: [] })));
    expect(none.student.items[4].badge).toBe('“Hatırlamıyorum” denen diziler');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    const wrongs: Record<string, (q: LetterNumberCell) => string[]> = {
      eksik: hsMissOne,
      sira: (q) => (q.length >= 3 ? hsSwapLast(q) : hsMissOne(q)),
      gosterilen: hsShown,
      ayrilmis: hsGrouped,
      onceHarf: hsLettersFirst,
      yabanci: (q) => hsIntrude(q, q.i > 0 ? flat[q.i - 1].seq : undefined),
      bos: () => [],
      karisik: (q) => [hsMissOne, hsSwapLast, hsShown, hsGrouped, hsLettersFirst, () => [] as string[], (x: LetterNumberCell) => hsIntrude(x)][q.i % 7](q),
      yarim: (q) => q.answer.slice(0, Math.max(1, Math.floor(q.length / 2))),
      sayiEksik: (q) => q.answer.slice(1),
      ilkTakas: (q) => [q.answer[1], q.answer[0], ...q.answer.slice(2)],
      yariYariya: (q) => (q.i % 2 && q.length >= 3 ? hsSwapLast(q) : hsMissOne(q)),
      cogunEksik: (q) => (q.i % 3 === 0 && q.length >= 3 ? hsSwapLast(q) : hsMissOne(q)),
    };
    const correctness: Record<string, (q: LetterNumberCell) => boolean> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUzunluk: (q) => q.length === 2 && q.k === 0,
      dort: (q) => q.length <= 4,
      altiTek: (q) => q.length <= 4 || (q.length <= 6 && q.k === 2),
      dalgali: (q) => q.length <= 3 || q.k === q.length % 3,
      uzunda: (q) => q.length <= 6 || q.k === 0,
      birYanlis: (q) => !(q.length === 5 && q.k === 1),
    };
    const times: Record<string, (q: LetterNumberCell) => number | null> = {
      normal: (q) => 1500 + 800 * q.length,
      hizli: (q) => (q.length >= 4 ? 300 : 5000),
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongs)) {
        for (const [tName, rt] of Object.entries(times)) {
          const body = letterNumberBody((q) => ({ seq: correct(q) ? q.answer : wrong(q), rtMs: correct(q) && tName === 'hizli' ? 5000 : rt(q) }), 7);
          const label = `${cName}/${wName}/${tName}`;
          const res = evaluate(SLUG, body);
          const result: LetterNumberResult = scoreLetterNumber(task, trialsOf(body)).result;
          const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
          const floor = lnFloor(result);
          const unsorted = !floor && lnUnsorted(result);
          const lettersFirst = !floor && !unsorted && lnLettersFirstHabit(result);
          const gaveUp = !floor && lnGaveUpSorting(result);
          const many = !floor && lnManySkipped(result);
          const rapid = !floor && lnRapid(result);
          for (const r of [res.student, res.parent, adult]) {
            const t = text(r);
            expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \.|\(\)/);
            expect(
              r.items.map((i) => i.title),
              label,
            ).toEqual(TITLES);
            for (const i of r.items) {
              expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              // Cümle rakamla başlamaz; "0 tanesi" gibi sayı ve "1 tanesi" yazılmaz.
              expect(i.text, `${label} ${i.title}`).not.toMatch(/(^|[.!?] )\d|(?<!\d)[01] tanes|hepsini \(%/);
            }
            expect(r.items[0].badge, label).toBe(floor ? 'Yorumlanmadı' : result.stoppedAt === null ? `${result.span} öğe (testin en uzun dizisi)` : `${result.span} öğe`);
            expect(r.items[1].badge, label).toBe(
              floor ? 'Yorumlanmadı' : result.correct === result.trials ? `${result.trials} dizinin hepsi doğru` : `${result.trials} diziden ${result.correct} doğru`,
            );
            expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(floor);
            expect(r.items[2].badge === 'Hata yok', label).toBe(!floor && result.wrong === 0);
            expect(r.items[2].badge === 'Sıraya konmadan girilmiş', label).toBe(unsorted);
            expect(r.items[2].badge === 'Önce harfler girilmiş', label).toBe(lettersFirst);
            expect(r.items[2].badge === 'Uzun dizilerde sıraya konmadan girilmiş', label).toBe(gaveUp);
            if (gaveUp) expect(unsorted || lettersFirst, label).toBe(false);
            expect(r.items[3].badge === 'Yorumlanmadı', label).toBe(floor);
            expect(r.cautions.some((c) => c.includes('en kısa')), label).toBe(floor);
            expect(r.cautions.some((c) => c.includes('sıralama kuralı tam uygulanmamış')), label).toBe(unsorted);
            expect(r.cautions.some((c) => c.includes('önce harfler, sonra sayılar yazılmış')), label).toBe(lettersFirst);
            expect(r.cautions.some((c) => c.includes('“Hatırlamıyorum” denmiş')), label).toBe(many);
            expect(r.cautions.some((c) => c.includes('çok kısa sürede girilmiş')), label).toBe(rapid);
            expect(/[Cc]evabını çok kısa sürede girdi(ğin|ği) \d+ dizide öğelerin çoğu/.test(r.items[4].text), label).toBe(rapid);
            const hedged = /tam yansıtmayabilir/.test(r.items[0].text);
            expect(hedged, label).toBe(unsorted || lettersFirst || many || rapid);
            expect(r.chart?.type === 'bars' ? r.chart.rows.map((x) => x.valueLabel) : [], label).toEqual(result.levels.map((l) => `${l.correct}/3`));
            expect(r.keyFigures.map((f) => f.value)[1], label).toBe(floor ? 'Yorumlanmadı' : `${result.correct}/${result.trials}`);
            expect(r.keyFigures[2].label, label).toBe('Doğru sıradaki öğeler');
            expect(r.keyFigures[2].value, label).toBe(floor ? 'Yorumlanmadı' : `%${Math.floor((100 * result.itemsInOrder) / result.itemsShown)}`);
            expect(r.keyFigures[2].value === '%100', label).toBe(!floor && result.itemsInOrder === result.itemsShown);
            expect(r.roadmap!.bars, label).toEqual([]);
            // Hata türü yalnızca en az iki yanlış dizide ve yarıdan çoğunda görülünce söylenir; kural sorunları önce gelir.
            const h = r.items[2].text;
            const K = result.kinds;
            const W = result.attemptedWrong;
            const O = K.shown + K.grouped + K.lettersFirst + K.order;
            if (!floor && !unsorted && !lettersFirst && !gaveUp && W >= 2) {
              expect(/(Hepsinde|Çoğunda) öğe eksik/.test(r.items[2].badge ?? ''), label).toBe(2 * K.items > W);
              expect(/(Hepsinde|Çoğunda) sıra karışık/.test(r.items[2].badge ?? ''), label).toBe(2 * K.items <= W && 2 * O > W);
              expect(r.items[2].badge === 'Eksik öğe ve sıra karışıklığı', label).toBe(2 * K.items <= W && 2 * O <= W);
            }
            if (/girdi(ğin|ği) öğeleri doğru sıraya koy/.test(h)) {
              expect(2 * result.itemsOrderKept >= K.items && K.items >= 2 && result.itemsOrderKept >= 2, label).toBe(true);
              // "dizi uzayınca" yalnızca bu dizilerin hepsi uzun dizilerse söylenir.
              if (/sıralama kuralını uyguladı/.test(h)) expect(h.includes('dizi uzayınca'), label).toBe(result.itemsOrderKeptLong === result.itemsOrderKept);
              // Sıra hataları da çoğunluktaysa kuralla ilgili sonuç çıkarılmaz.
              if (r.items[2].badge === 'Eksik öğe ve sıra karışıklığı') expect(h, label).not.toMatch(/sıralama kuralını uyguladı/);
            }
            // Hata türü grafiği kartın sayılarıyla aynı.
            const hv = r.items[2].visual;
            if (hv?.type === 'stack') {
              expect(hv.total, label).toBe(result.wrong);
              expect(hv.parts.map((p) => p.value), label).toEqual([K.items, K.order, K.shown + K.grouped, K.lettersFirst, result.skipped]);
            }
            // Sayılar ve harfler kartı: fark yalnızca eşikleri aşınca söylenir.
            const D = result.digits;
            const L = result.letters;
            if (!floor) {
              const pct = (a: number, b: number) => (b ? Math.floor((100 * a) / b) : 0);
              // Kural tam uygulanmadıysa ya da uzun dizilerde bırakıldıysa karşılaştırma yapılmaz.
              const off = unsorted || lettersFirst || gaveUp;
              const recallOk = !off && D.shown >= 20 && L.shown >= 20;
              const orderOk = !off && D.orderTrials >= 6 && L.orderTrials >= 6;
              const rGap = pct(L.recalled, L.shown) - pct(D.recalled, D.shown);
              const rItems = D.shown - D.recalled - (L.shown - L.recalled);
              const oGap = pct(L.ordered, L.orderTrials) - pct(D.ordered, D.orderTrials);
              const oTrials = D.orderTrials - D.ordered - (L.orderTrials - L.ordered);
              const lettersHarder = recallOk && rGap <= -15 && rItems <= -4;
              const digitsHarder = recallOk && rGap >= 15 && rItems >= 4;
              const recallDiff = lettersHarder || digitsHarder;
              const b = r.items[3].badge;
              expect(b === 'Harfler daha çok zorladı', label).toBe(lettersHarder);
              expect(b === 'Sayılar daha çok zorladı', label).toBe(digitsHarder);
              expect(b === 'Harfleri sıralamak daha çok zorladı', label).toBe(!recallDiff && orderOk && oGap <= -20 && oTrials <= -2);
              expect(b === 'Sayıları sıralamak daha çok zorladı', label).toBe(!recallDiff && orderOk && oGap >= 20 && oTrials >= 2);
              expect(b === 'Karşılaştırılmadı', label).toBe(off || (!recallOk && !orderOk));
              // Harflerin daha az hatırlandığı söylenince girme sırası da not edilir.
              expect(r.items[3].text.includes('girme sırasından'), label).toBe(lettersHarder);
              expect(r.items[3].text, label).toContain(D.recalled === D.shown ? `${D.shown} sayının hepsini` : `(%${pct(D.recalled, D.shown)})`);
              expect(r.items[3].text, label).toContain(L.recalled === L.shown ? `${L.shown} harfin hepsini` : `(%${pct(L.recalled, L.shown)})`);
              const bv = r.items[3].visual;
              if (bv?.type === 'bars') expect(bv.rows.slice(0, 2).map((x) => x.valueLabel), label).toEqual([`${D.recalled}/${D.shown}`, `${L.recalled}/${L.shown}`]);
            }
            if (!floor && result.skipped > 0 && !many) expect(r.items[4].text, label).toContain('“Hatırlamıyorum” düğmesine bas');
            const firstMiss = result.levels.findIndex((l) => l.correct < l.n);
            if (r.items[1].text.includes('bazılarını doğru sırala')) expect(result.levels.slice(firstMiss).some((l) => l.correct > 0), label).toBe(true);
            if (r.items[1].text.includes('yanılmak bu testte olağandır')) expect(result.levels[firstMiss].length, label).toBeGreaterThanOrEqual(LN_LONG);
            if (r.items[1].text.includes('öğelerin çoğunu hatırladı')) expect(rapid, label).toBe(false);
            if (result.skipped > 0 && W >= 2) expect(h, label).not.toMatch(/(^|\. )(Çocuğunuz )?[Yy]anlış dizilerin/);
            if (result.skipped === result.trials) expect(r.items[4].badge, label).toBe('“Hatırlamıyorum” denen diziler');
            else if (result.medianRt === null) expect(r.items[4].badge, label).toBe('Süre hesaplanamadı');
          }
          expect(text(res.student), label).not.toContain('Çocuğunuz');
          expect(text(adult), label).not.toContain('Çocuğunuz');
          expect(text(res.parent), label).not.toMatch(
            /(?<!\p{L})(sıraladın|sıralayamadın|hatırladın|girdin|bastın|yanıldın|yazdın|tutabildin|olabilirsin|basmadın|yanılmadın|koydun|koymadın|bıraktın|dizdin|dizmedin|uyguladın|girdiğin|sıraladığın|sıralayamadığın|tuttun|seni)(?!\p{L})/u,
          );
          expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
          n++;
        }
      }
    }
    expect(n).toBe(8 * 13 * 3);
  }, 300_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, letterNumberBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, letterNumberBody(undefined, 3)).student.items).toHaveLength(5);
    const r = evaluateReports(SLUG, letterNumberBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(schoolWords(withoutRoadmap(adult))).toEqual([]);
    expect(schoolWords(JSON.stringify(adult.roadmap))).toEqual([]);
    expect(schoolWords([harfSayiSiralama.intro.title, ...harfSayiSiralama.intro.paragraphs, ...task.instructions, task.measures].join(' '))).toEqual([]);
  });

  it('PDF öğrenci, veli ve yetişkin için üretilir', async () => {
    const body = letterNumberBody();
    const r = evaluate(SLUG, body);
    const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);
});

describe('Harf-sayı sıralama: bilim kartı ve yol haritası', () => {
  it('bilim kartı: yer tutucu yok; kaynaklar bağlantılı ve metinde yazar ve yılıyla anılıyor', () => {
    const s = harfSayiSiralama.science;
    const all = [s.basedOn, s.whatItMeasures, s.turkishVersion, s.reliability, s.normNote, s.ageNote, s.license, ...s.limitations].join(' ');
    expect(all).not.toMatch(/YAZILACAK|TODO/);
    expect(s.normStatus).toBe('none');
    expect(s.citations.length).toBeGreaterThanOrEqual(8);
    for (const c of s.citations) {
      expect(c.url, c.text).toMatch(/^https:\/\//);
      const author = c.text.split(/,| \(/)[0];
      const year = /\((\d{4})\)/.exec(c.text)?.[1];
      expect(year, c.text).toBeDefined();
      expect(all.includes(author) && all.includes(year!), c.text).toBe(true);
    }
    // Zekâ puanı vermez, tanı koymaz; norm yok; ticari testin maddeleri kullanılmaz.
    expect(harfSayiSiralama.description).toContain('Zekâ puanı (IQ) vermez ve tanı koymaz');
    expect(s.normNote).toContain('Türkiye normu yok');
    expect(all).not.toMatch(/tükenir|beyni(ni)? çalıştır/);
  });

  it('yol haritası: dört öneri, üç hafta, kaynaklar bilim kartında', () => {
    const t = TASK_ROADMAPS[SLUG];
    expect(t.supports).toHaveLength(4);
    expect(t.weeks).toHaveLength(3);
    for (const src of t.sources) expect(harfSayiSiralama.science.citations.some((c) => c.text === src.text), src.text).toBe(true);
    for (const slug of t.nextTests) expect(solvableInstruments().some((d) => d.slug === slug && 'adults' in d && d.adults), slug).toBe(true);
  });
});

describe('Harf-sayı sıralama yayında', () => {
  it('listelerde ve site haritasında; pilot', () => {
    expect(harfSayiSiralama.status).toBe('pilot');
    expect(publicInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin doğru cevaplarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain(`/api/rapor/${SLUG}`);
    expect(yml).toContain('harf-sayi-siralama-raporu');
    const m = /HS_CEVAP=\(([^)]*)\)/.exec(yml);
    expect(m?.[1].split(' ')).toEqual(flat.map((x) => lnAnswer(x.seq).join('')));
  });
});
