import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { LETTER_SERIES_SPECS, harfDizileri } from '@/content/instruments/harf-dizileri';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { taskTrial } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { TURKISH_ALPHABET, type LetterSeriesItem, type LetterSeriesTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { LETTER_FEW_MAX } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import { LETTER_PATTERN_MIN, TaskInputError, letterSeriesMostlySkipped, scoreLetterSeries, type LetterSeriesTrialInput } from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { letterFar, letterNext, letterSeriesBody, letterSeriesRank, type LetterSeriesCell } from './helpers/bodies';
import { ALFABE, basitKuralHarfleri, cevaplar, enKisaPeriyot } from './helpers/letter-solver';
import { schoolWords } from './helpers/school';

const SLUG = 'harf-dizileri';
const task = harfDizileri.tasks[0] as LetterSeriesTask;
const ALL: { item: LetterSeriesItem; answer: string }[] = [
  ...task.practice.map((p) => ({ item: p, answer: p.answer })),
  ...task.items.map((item, i) => ({ item, answer: task.answers[i] })),
];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])].filter(Boolean).join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Kural türleri', 'Çalışma biçimi'];
const far = letterFar;
/** Veli metninde öğrenciye seslenen fiiller (Türkçe harflerle de çalışan sözcük sınırıyla). */
const YOU_VERBS = /(?<!\p{L})(buldun|verdin|cevapladın|ayırdın|zorlandın|seçtin|dedin|bulamadın|cevaplamadın)(?!\p{L})/u;

describe('Harf dizileri: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; iki alıştırma; anahtarlar tekil; her dizide tek eksik harf; Türk alfabesi', () => {
    expect(TURKISH_ALPHABET).toEqual(ALFABE);
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || task.items[i - 1].level <= it.level)).toBe(true);
    expect(new Set(ALL.map((x) => x.item.key)).size).toBe(26);
    expect(task.practice).toHaveLength(2);
    expect(task.practice.every((p) => p.explain.length > 40 && p.explain.includes(`eksik harf ${p.answer}`))).toBe(true);
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    expect(task.answers).toHaveLength(24);
    expect(task.traps).toHaveLength(24);
    for (const { item, answer } of ALL) {
      expect(item.terms.filter((t) => t === null), item.key).toHaveLength(1);
      // Telefonda kutular sığsın: en çok 11 harf; en az 6.
      expect(item.terms.length, item.key).toBeGreaterThanOrEqual(6);
      expect(item.terms.length, item.key).toBeLessThanOrEqual(11);
      for (const t of item.terms) if (t !== null) expect(ALFABE, item.key).toContain(t);
      expect(ALFABE, item.key).toContain(answer);
    }
    // Doğru cevaplar birbirinden farklı: "hep aynı harfi seçme" doğru cevaplarla karışmaz.
    expect(new Set(task.answers).size).toBe(24);
    // Eksik harf çoğunlukla sonda; ortada eksik olan bir soru ve bir alıştırma sorusu var.
    expect(ALL.filter((x) => x.item.terms.indexOf(null) !== x.item.terms.length - 1).map((x) => x.item.key)).toEqual(['hdp2', 'hd12']);
    // Diziler Türkçeye özgü harflerin hepsini kullanır (alfabe bilgisi tek bir harfe dayanmasın).
    const used = new Set(ALL.flatMap((x) => [...x.item.terms, x.answer]));
    for (const h of ['Ç', 'Ğ', 'I', 'İ', 'Ö', 'Ş', 'Ü']) expect(used.has(h), h).toBe(true);
  });

  it('her sorunun tek doğru cevabı var: bağımsız çözücü, diziyi açıklayan her kuralla yalnızca doğru cevabı bulur', () => {
    for (const { item, answer } of ALL) expect(cevaplar(item.terms), item.key).toEqual([answer]);
    // Çözücü gerçekten ayırt eder: iki kurala birden uyan bir dizide iki cevap bulur, kısa dizide hiçbir kural seçmez.
    expect(cevaplar(['A', 'B', 'A', 'B', 'C', 'D', null])).toEqual([]);
    expect(cevaplar(['A', 'B', 'C', null])).toEqual(['Ç']);
    expect(cevaplar(['A', 'C', 'A', 'C', 'A', null])).toEqual(['C']);
    expect(cevaplar(['A', 'C', 'A', 'C', null])).toEqual([]);
    expect(cevaplar(['A', 'B', null])).toEqual([]);
  });

  it('kural türleri dizilerin gerçek yapısıyla uyumlu; her türde en az dört soru', () => {
    for (const { item, answer } of ALL) {
      const m = enKisaPeriyot(item.terms, answer);
      const constant = m?.adimlar.some((d) => d === 0) ?? false;
      const doubled = m !== null && m.p === 2 && m.siniflar[0].every((x, k) => m.siniflar[1][k] === undefined || m.siniflar[1][k] === x);
      const overlap = m !== null && m.p === 2 && m.siniflar[1].every((x, k) => m.siniflar[0][k + 1] === undefined || m.siniflar[0][k + 1] === x);
      // İkişer harflik gruplar: iki sınıf aynı adımla ilerler ve her grubun ikinci harfi birincinin alfabedeki sıradakidir.
      const pairs = m !== null && m.p === 2 && m.adimlar[0] === m.adimlar[1] && m.siniflar[1].every((x, k) => x - m.siniflar[0][k] === 1);
      if (item.rule === 'next') expect([m?.p, m?.adimlar[0] !== 0], item.key).toEqual([1, true]);
      if (item.rule === 'repeat') expect([m?.p, constant || doubled], item.key).toEqual([2, true]);
      if (item.rule === 'interleaved') expect([m?.p, constant, doubled, overlap, pairs], item.key).toEqual([2, false, false, false, false]);
      if (item.rule === 'group') expect((m?.p ?? 0) >= 3 || overlap || pairs, item.key).toBe(true);
      // Değişen adım: hiçbir sabit adımlı kural (periyot 1–4) diziyi açıklamaz.
      if (item.rule === 'growing') expect(m === null || m.p > 4, item.key).toBe(true);
    }
    expect(['next', 'repeat', 'interleaved', 'group', 'growing'].map((r) => task.items.filter((it) => it.rule === r).length)).toEqual([6, 4, 4, 6, 4]);
  });

  it('tuzaklar: doğru cevap değil, daha basit bir kuralla bulunur; sabit adım dışında "sıradaki harf" doğru cevabı vermez', () => {
    for (const [i, it] of task.items.entries()) {
      const traps = task.traps[i];
      expect(new Set(traps).size, it.key).toBe(traps.length);
      const ways = basitKuralHarfleri(it.terms);
      for (const t of traps) {
        expect(t, it.key).not.toBe(task.answers[i]);
        expect(ALFABE, it.key).toContain(t);
        expect(ways.map((w) => w.harf), `${it.key} ${t}`).toContain(t);
      }
      // Son harfin alfabedeki sıradakini yazmak yalnızca birer harf ilerleyen dizilerde doğru cevabı verir.
      const succ = ways.find((w) => w.yol === 'sıradaki harf')?.harf;
      if (!(it.rule === 'next' && it.level === 1)) expect(succ, it.key).not.toBe(task.answers[i]);
    }
    // 1. düzey dışındaki, sabit adımlı olmayan her soruda en az bir tuzak var.
    for (const [i, it] of task.items.entries()) if (it.level > 1 && it.rule !== 'next') expect(task.traps[i].length, it.key).toBeGreaterThan(0);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, traps: task.traps, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: harfDizileri.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
    expect(LETTER_SERIES_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '73a607459762c680';

describe('Harf dizileri: puanlama', () => {
  const all = (fn: (i: number) => Partial<LetterSeriesTrialInput> = () => ({})): LetterSeriesTrialInput[] =>
    task.items.map((_, index) => ({ index, response: { answer: task.answers[index] }, rtMs: 10_000, ...fn(index) }));
  const cell = (i: number): LetterSeriesCell => ({ level: task.items[i].level, rule: task.items[i].rule, terms: task.items[i].terms, answer: task.answers[i], traps: task.traps[i], i });
  const wrongAt = (i: number) => ({ response: { answer: far(cell(i)) } });

  it('hatasız: 24 doğru, bütün düzeyler tam, 5. düzeye ulaşılır', () => {
    const { result } = scoreLetterSeries(task, all());
    expect(result.correct).toBe(24);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['4/4', '5/5', '5/5', '5/5', '5/5']);
    expect(result.reached).toBe(5);
    expect(result.rules.map((r) => `${r.rule} ${r.correct}/${r.n}`)).toEqual(['next 6/6', 'repeat 4/4', 'interleaved 4/4', 'group 6/6', 'growing 4/4']);
    expect([result.wrong, result.skipped, result.traps, result.nearMisses, result.rapid]).toEqual([0, 0, 0, 0, 0]);
    expect(result.medianRt).toBe(10_000);
    expect(result.sameAnswer).toBe(1);
  });

  it('ulaşılan düzey: en az %60 doğru olan en yüksek düzey; o düzeye kadarki sorularda da en az %60 doğru', () => {
    const counts = (ks: number[]) => (i: number) => {
      const lv = task.items[i].level;
      return letterSeriesRank({ level: lv, i }) < ks[lv - 1] ? {} : wrongAt(i);
    };
    const reached = (ks: number[]) => scoreLetterSeries(task, all(counts(ks))).result.reached;
    expect(reached([4, 5, 5, 5, 5])).toBe(5);
    expect(reached([4, 5, 5, 2, 2])).toBe(3);
    expect(reached([4, 5, 3, 2, 2])).toBe(3); // 3/5 = %60 yeterli
    expect(reached([4, 5, 2, 2, 2])).toBe(2); // 2/5 = %40 yetmez
    expect(reached([2, 5, 5, 0, 0])).toBe(3);
    expect(reached([1, 2, 2, 2, 1])).toBe(0);
  });

  it('tuzak, yakın cevap, "Bilmiyorum", çok hızlı cevap ve hep aynı harf ayrı ayrı sayılır', () => {
    const trap = scoreLetterSeries(task, all((i) => (task.traps[i].length ? { response: { answer: task.traps[i][0] } } : {}))).result;
    const withTraps = task.traps.filter((t) => t.length).length;
    expect([trap.wrong, trap.traps, trap.nearMisses]).toEqual([withTraps, withTraps, 0]);
    // Yakın cevap: alfabede doğru cevabın hemen arkasındaki harf; tuzaksa tuzak, dizide varsa yakın sayılmaz.
    const near = scoreLetterSeries(task, all((i) => (task.items[i].level >= 4 ? { response: { answer: letterNext(cell(i)) } } : {}))).result;
    const hard = task.items.flatMap((it, i) => (it.level >= 4 ? [i] : []));
    const nextIsTrap = hard.filter((i) => task.traps[i].includes(letterNext(cell(i)))).length;
    const nextInTerms = hard.filter((i) => !task.traps[i].includes(letterNext(cell(i))) && task.items[i].terms.includes(letterNext(cell(i)))).length;
    expect([near.wrong, near.traps, near.nearMisses]).toEqual([10, nextIsTrap, 10 - nextIsTrap - nextInTerms]);
    expect(near.nearMisses).toBeGreaterThanOrEqual(5);
    // hd01 (A B C Ç D → E): D seçmek (son harfi tekrarlamak) yakın cevap değildir; F yakındır.
    expect(scoreLetterSeries(task, all((i) => (i === 0 ? { response: { answer: 'D' } } : {}))).result.nearMisses).toBe(0);
    expect(scoreLetterSeries(task, all((i) => (i === 0 ? { response: { answer: 'F' } } : {}))).result.nearMisses).toBe(1);
    const farR = scoreLetterSeries(task, all((i) => (task.items[i].level >= 4 ? wrongAt(i) : {}))).result;
    expect([farR.wrong, farR.traps, farR.nearMisses]).toEqual([10, 0, 0]);
    const skip = scoreLetterSeries(task, all((i) => (task.items[i].level >= 3 ? { response: null } : {}))).result;
    expect([skip.correct, skip.skipped, skip.wrong, skip.rapidOf]).toEqual([9, 15, 0, 0]);
    expect(letterSeriesMostlySkipped(skip)).toBe(true);
    // Hızlı ama doğru cevaplar "çok hızlı" sayılmaz; hızlı yanlışlar sayılır.
    const fastRight = scoreLetterSeries(task, all((i) => (task.items[i].level >= 3 ? { rtMs: 1200 } : {}))).result;
    expect([fastRight.rapid, fastRight.rapidOf]).toEqual([0, 15]);
    const rapid = scoreLetterSeries(task, all((i) => (task.items[i].level >= 3 ? { rtMs: 1200, ...wrongAt(i) } : {}))).result;
    expect([rapid.rapid, rapid.rapidOf]).toEqual([15, 15]);
    expect(scoreLetterSeries(task, all((i) => (task.items[i].level <= 2 ? { rtMs: 1200 } : {}))).result.rapid).toBe(0);
    expect(scoreLetterSeries(task, all(() => ({ response: { answer: 'A' } }))).result.sameAnswer).toBe(24);
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı soru iki kez gelirse ilki sayılır; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreLetterSeries(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of ['a', 'Q', 'W', 'X', '', 'AB', 'i', ' ']) {
      expect(() => scoreLetterSeries(task, ok.map((t, i) => (i === 3 ? { ...t, response: { answer: bad } } : t))), bad).toThrow(TaskInputError);
    }
    expect(() => scoreLetterSeries(task, ok.map((t, i) => (i === 3 ? { ...t, response: { answer: 5 as unknown as string } } : t)))).toThrow(TaskInputError);
    expect(() => scoreLetterSeries(task, [...ok, { index: 24, response: { answer: 'A' }, rtMs: 100 }])).toThrow(TaskInputError);
    expect(() => scoreLetterSeries(task, ok.map((t, i) => (i === 3 ? { ...t, rtMs: -1 } : t)))).toThrow(TaskInputError);
    expect(scoreLetterSeries(task, [...ok, { index: 0, response: { answer: 'Z' }, rtMs: 100 }]).result.correct).toBe(24);
    // Tarayıcıya giden test bilgisinde cevap anahtarı ve tuzaklar yoktur; anahtarsız puanlama yapılamaz.
    expect(() => scoreLetterSeries({ ...task, answers: [], traps: [] }, ok)).toThrow(TaskInputError);
    const bad = letterSeriesBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
    // İstek biçimi: cevap bir harftir; sayı ya da başka bir görevin cevap biçimi puanlamada reddedilir.
    const num = letterSeriesBody();
    (num.data as { blocks: Record<string, { response: unknown }[]> }).blocks[task.key][0].response = { answer: 5 };
    expect(() => evaluate(SLUG, num)).toThrow(AssessmentError);
    // Sunucuya gelen istekte harf cevabının biçimi: tek bir dize, başka alan yok.
    expect(taskTrial.safeParse({ index: 0, response: { answer: 'E' }, rtMs: 5000 }).success).toBe(true);
    expect(taskTrial.safeParse({ index: 0, response: { answer: 'E', x: 1 }, rtMs: 5000 }).success).toBe(false);
    expect(taskTrial.safeParse({ index: 0, response: { answer: 'ABC' }, rtMs: 5000 }).success).toBe(false);
    const option = letterSeriesBody();
    (option.data as { blocks: Record<string, { response: unknown }[]> }).blocks[task.key][0].response = 3;
    expect(() => evaluate(SLUG, option)).toThrow(AssessmentError);
  });
});

describe('Harf dizileri: rapor', () => {
  it('hatasız: düzeylere göre grafik, dört kart, öne çıkan sayılar ve kural türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.answer, rtMs: 8000 + 3000 * q.level })));
    expect(r.student.chartTitle).toBe('Düzeylere göre doğru cevaplar');
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['1. düzey 4/4', '2. düzey 5/5', '3. düzey 5/5', '4. düzey 5/5', '5. düzey 5/5']);
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Kural türleri', '5 kural türünün hepsinde bütün sorular doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 17 saniye'],
    ]);
    expect(r.student.keyFigures).toEqual([
      { label: 'Doğru', value: '24/24' },
      { label: 'Ulaşılan düzey', value: '5. düzey', note: '5 düzeyden' },
      { label: 'Soru başına tipik süre', value: '17 saniye' },
    ]);
    expect(r.student.items[0].text).toContain('Bütün soruları doğru cevapladın; en zor sorulardaki iç içe dizileri, grupları ve büyüyen adımları da bulabildin.');
    expect(r.student.items[1].text).toContain('5. düzey testin en zor düzeyiydi.');
    expect(r.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha çok zaman ayırdın');
    expect(r.student.items[3].text).not.toContain('Bilmiyorum');
    expect(r.student.cautions).toEqual([]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.value, b.valueLabel])).toEqual([
      ['Sabit adım', 100, '6/6'],
      ['Tekrar eden harfler', 100, '4/4'],
      ['İç içe diziler', 100, '4/4'],
      ['Harf grupları', 100, '6/6'],
      ['Değişen adım', 100, '4/4'],
    ]);
    expect(rm.barsTitle).toBe('Kural türlerine göre sonucun');
    expect(r.parent.roadmap!.barsTitle).toBe('Kural türlerine göre sonuç');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(text(r.parent)).not.toMatch(YOU_VERBS);
  });

  it('örnek: ilk üç düzey tam, sonra zorlanma; ulaşılan düzey, zorlanılan düzey ve kural türleri anlatılır', () => {
    const r = evaluate(SLUG, letterSeriesBody());
    expect(r.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(r.student.items[0].text).toContain('Sorular zorlaştıkça doğru cevapların azaldı');
    expect(r.student.items[1].badge).toBe('3. düzey');
    expect(r.student.items[1].text).toContain('1–3. düzeylerdeki soruların hepsini doğru cevapladın');
    expect(r.student.items[1].text).toContain('4. düzeydeki 5 sorunun 3 tanesini doğru bulamadın. Bu düzeydeki sorularda şu gerekiyordu: geriye doğru birkaç harf atlayan');
    expect(r.student.items[2].text).toContain('ör. “sabit adım” soruları 1., 2., 3. ve 4. düzeylerde, “değişen adım” soruları 3., 4. ve 5. düzeylerde');
    expect(r.parent.items[2].text).toMatch(/^Çocuğunuz “sabit adım”/);
    // Yanlışlar doğru cevaptan uzak: tuzak ya da yakın cevap yorumu yapılmaz.
    expect(r.student.items[0].text).not.toMatch(/daha basit bir kurala göre|hemen önündeki ya da arkasındaki/);
  });

  it('durumlar: çok az doğru, çoğunda "Bilmiyorum", tuzaklar, yakın cevaplar, çok hızlı, hep aynı harf, kolay sorularda yanılma', () => {
    const none = evaluate(SLUG, letterSeriesBody((q) => ({ answer: far(q), rtMs: 9000 })));
    expect(none.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', 'Düzey belirtilmedi', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.items[0].text).toContain('24 sorunun hiçbirinde eksik harfi doğru bulamadın.');
    expect(none.parent.items[0].text).toContain('Bu sonuç tek başına yorumlanmamalıdır');
    expect(none.parent.items[1].text).toContain('alfabenin sırasını henüz yeterince rahat bilmemesinden');
    expect(none.student.roadmap!.bars).toEqual([]);
    expect(none.student.keyFigures[1]).toEqual({ label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' });
    const three = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.i < 3 ? q.answer : far(q), rtMs: 9000 })));
    expect(three.student.items[2].badge).not.toBe('Yorumlanmadı');
    expect(three.student.roadmap!.bars).toHaveLength(5);
    const skip = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.level <= 2 ? q.answer : null, rtMs: 9000 })));
    expect(skip.student.cautions.join(' ')).toContain('24 sorunun 15 tanesinde “Bilmiyorum” denmiş');
    expect(skip.student.items[0].text).toContain('24 sorunun 15 tanesinde “Bilmiyorum” dedin. Cevap verdiğin 9 sorunun hepsi doğruydu.');
    expect(skip.student.items[2].badge).toBe('Yorumlanmadı');
    expect(skip.student.roadmap!.bars).toEqual([]);
    expect(skip.student.items[3].text).toContain('15 soruda “Bilmiyorum” dedin.');
    expect(skip.parent.items[3].text).toContain('Çocuğunuz 15 soruda “Bilmiyorum” dedi.');
    expect(skip.student.items[1].badge).toBe('2. düzey');
    const allSkip = evaluate(SLUG, letterSeriesBody(() => ({ answer: null, rtMs: null })));
    expect(allSkip.student.items[3].badge).toBe('Süre hesaplanamadı');
    expect(allSkip.student.items[3].text).toContain('Bütün sorularda “Bilmiyorum” dedin.');
    expect(allSkip.student.cautions.join(' ')).toContain('24 sorunun hepsinde “Bilmiyorum” denmiş');
    expect(allSkip.student.items[1].text).toContain('Bütün sorularda “Bilmiyorum” dediğin için bu sonuç tek başına yorumlanmamalıdır.');
    // Tuzaklar: 4. ve 5. düzeyde tuzağı olan sorularda tuzak, olmayanda uzak harf.
    const trap = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.level >= 4 ? (q.traps[0] ?? far(q)) : q.answer, rtMs: 15_000 })));
    expect(trap.student.items[0].text).toContain('Yanlış cevaplarının hepsinde daha basit bir kurala göre bir harf seçtin. Bu kural dizinin yalnızca bir bölümüne uyuyordu');
    expect(trap.parent.items[0].text).toContain('Çocuğunuz yanlış cevaplarının hepsinde');
    // Yakın cevaplar.
    const near = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.level >= 4 && !q.traps.includes(letterNext(q)) && !q.terms.includes(letterNext(q)) ? letterNext(q) : q.level >= 4 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(near.student.items[0].text).toMatch(/Yanlış cevaplarının (hepsinde|çoğunda \(10 yanlışın \d+ tanesinde\)) seçtiğin harf, alfabede doğru cevabın hemen önündeki ya da arkasındaki harfti/);
    expect(near.student.items[0].text).not.toContain('daha basit bir kurala göre');
    // Zor sorularda çok hızlı.
    const rapid = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.level >= 3 ? far(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('cevap verilen 15 sorunun hepsinde yanlış cevap 2,5 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[3].text).toContain('cevap verdiğin 15 sorunun hepsine 2,5 saniyeden kısa sürede yanlış cevap verdin');
    expect(rapid.student.items[0].text).toContain('Bazı sorulara bakmadan cevap vermiş olabileceğin için');
    const fastRight = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.answer, rtMs: q.level >= 3 ? 2000 : 6000 })));
    expect(fastRight.student.cautions).toEqual([]);
    expect(text(fastRight.student)).not.toMatch(/bakmadan|tahmin/);
    // Hep aynı harf.
    const same = evaluate(SLUG, letterSeriesBody(() => ({ answer: 'A', rtMs: 4000 })));
    expect(same.parent.cautions.join(' ')).toContain('aynı harf seçilmiş');
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı harfi seçtin');
    const blink = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.answer, rtMs: 300 })));
    expect(blink.student.items[3].badge).toBe('Soru başına tipik süre bir saniyeden kısa');
    const easy = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.level === 1 && letterSeriesRank(q) < 2 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(easy.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(easy.student.items[1].badge).toBe('5. düzey');
    expect(easy.student.items[1].text).toContain('Daha kolay olan 1. düzeydeki yanlışların bu sonucu değiştirmedi');
    const giveUp = evaluate(SLUG, letterSeriesBody((q) => ({ answer: q.level >= 4 ? null : q.answer, rtMs: q.level >= 4 ? 5000 : 20_000 })));
    expect(giveUp.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı.');
    expect(giveUp.student.items[3].text).toContain('harflerin arasına kaç harf atlandığını kâğıda yazmak');
    const low = evaluate(SLUG, letterSeriesBody((q) => ({ answer: letterSeriesRank(q) < [2, 3, 2, 1, 0][q.level - 1] ? q.answer : far(q), rtMs: 15_000 })));
    expect(low.student.items[1].badge).toBe('Düzey belirtilmedi');
    expect(low.parent.items[1].badge).toBe('Düzey belirtilmedi');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: LetterSeriesCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkDuzey: (q) => q.level === 1,
      kolaydaYanilma: (q) => !(q.level === 1 && letterSeriesRank(q) < 2),
      atlama: (q) => !(q.level === 2 && letterSeriesRank(q) < 3),
      duz: (q) => letterSeriesRank(q) % 2 === 0,
      ikiDogru: (q) => q.i < LETTER_FEW_MAX,
      ucDogru: (q) => q.i < LETTER_FEW_MAX + 1,
      sondanBes: (q) => q.i >= 19,
    };
    const wrongKinds: Record<string, (q: LetterSeriesCell) => string | null> = {
      uzak: far,
      tuzak: (q) => q.traps[0] ?? far(q),
      yakin: letterNext,
      bilmiyorum: () => null,
    };
    const times: Record<string, (q: LetterSeriesCell) => number | null> = {
      artan: (q) => 5000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 7000 * q.level,
      sabit: () => 20_000,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const sameLetter of [false, true]) {
            const body = letterSeriesBody((q) => ({ answer: sameLetter ? 'A' : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${sameLetter}`;
            const res = evaluate(SLUG, body);
            const { result } = scoreLetterSeries(task, (body.data as { blocks: Record<string, LetterSeriesTrialInput[]> }).blocks[task.key]);
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const few = result.correct <= LETTER_FEW_MAX;
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
              expect(r.items.map((i) => i.title), label).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              // Çoğunda "Bilmiyorum" denmişse de kural türleri yorumlanmaz.
              const noRules = few || letterSeriesMostlySkipped(result);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(noRules);
              expect(r.roadmap!.bars.length, label).toBe(noRules ? 0 : 5);
              expect(/Bu sonuç tek başına (bir şey söylemez|yorumlanmamalıdır)/.test(r.items[0].text), label).toBe(few);
              const skipNote = r.cautions.some((c) => c.includes('“Bilmiyorum” denmiş'));
              expect(skipNote, label).toBe(letterSeriesMostlySkipped(result));
              expect(r.items[0].text.includes('“Bilmiyorum” dedi'), label).toBe(skipNote);
              expect(r.items[3].text.includes('“Bilmiyorum” dedi'), label).toBe(result.skipped > 0);
              const rapidNote = r.cautions.some((c) => c.includes('2,5 saniyeden kısa'));
              expect(r.items[3].text.includes('2,5 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı harf seçilmiş'));
              expect(r.items[3].text.includes('aynı harfi seçti'), label).toBe(sameNote);
              if (rapidNote || sameNote) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (rapidNote) expect(result.wrong, label).toBeGreaterThan(0);
              expect(r.items[0].text.includes('Bütün sorularda “Bilmiyorum”'), label).toBe(result.skipped === result.n);
              if (!few) expect(r.items[0].text.includes('bakmadan cevap vermiş') || r.items[0].text.includes('bakılmadan cevap verilmiş'), label).toBe(rapidNote || sameNote);
              const many = !few && result.wrong >= LETTER_PATTERN_MIN;
              expect(r.items[0].text.includes('daha basit bir kurala göre'), label).toBe(many && result.traps * 2 >= result.wrong);
              expect(r.items[0].text.includes('hemen önündeki ya da arkasındaki harfti'), label).toBe(many && result.nearMisses * 2 >= result.wrong);
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (result.reached === 0) expect([fig, r.items[1].badge], label).toEqual(['Belirtilmedi', 'Düzey belirtilmedi']);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
              expect(r.items[3].badge === 'Süre hesaplanamadı', label).toBe(result.medianRt === null);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(YOU_VERBS);
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(11 * 4 * 5 * 2);
  }, 180_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, letterSeriesBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, letterSeriesBody(undefined, 3)).parent.items).toHaveLength(4);
    expect(evaluate(SLUG, letterSeriesBody(undefined, 13)).parent.items).toHaveLength(4);
    const r = evaluateReports(SLUG, letterSeriesBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([harfDizileri.intro.title, ...harfDizileri.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
    // Yol haritasındaki örnek diziler testin sorularından biri değildir (cevabı ele vermez).
    const example = JSON.stringify(TASK_ROADMAPS[SLUG]);
    for (const it of task.items) {
      const known = it.terms.filter((x) => x !== null);
      expect(example, it.key).not.toContain(known.join(', '));
      expect(example, it.key).not.toContain(known.join(' '));
    }
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /HD_GOVDE=.*?s="([^"]+)"/.exec(yml);
    expect(m?.[1].split(' ')).toEqual(task.answers);
    const r = evaluate(SLUG, letterSeriesBody((q) => ({ answer: m![1].split(' ')[q.i], rtMs: 9000 + 1000 * q.i })));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(5);
    expect(r.student.keyFigures).toHaveLength(3);
    // Çözme sayfasında cevap anahtarı ve tuzaklar boş gönderilir (dış sınama bunu da denetler).
    expect(yml).toMatch(/hd_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"traps\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, letterSeriesBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, letterSeriesBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı', () => {
    expect(harfDizileri.status).toBe('pilot');
    expect(harfDizileri.licenseStatus).toBe('original');
    expect(task.rapidMs).toBe(2500);
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(harfDizileri.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(harfDizileri.science.citations.length).toBeGreaterThanOrEqual(3);
    expect(harfDizileri.science.citations.every((c) => c.url?.startsWith('https://'))).toBe(true);
    const body = JSON.stringify({ ...harfDizileri.science, citations: [] });
    for (const c of harfDizileri.science.citations) expect(body, c.text).toContain(c.text.split(',')[0].replace(/\.$/, ''));
    for (const x of TASK_ROADMAPS[SLUG].sources) expect(harfDizileri.science.citations.some((c) => c.text === x.text), x.text).toBe(true);
  });
});
