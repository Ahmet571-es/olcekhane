import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { NUMBER_SERIES_SPECS, sayiDizileri } from '@/content/instruments/sayi-dizileri';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { NumberSeriesItem, NumberSeriesTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { NUMBER_FEW_MAX } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  NUMBER_PATTERN_MIN,
  TaskInputError,
  nearMissTolerance,
  numberSeriesMostlySkipped,
  scoreNumberSeries,
  type NumberSeriesTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { numberSeriesBody, numberSeriesRank, type NumberSeriesCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { partialRuleValues, predictSeries, predictedValues } from './helpers/series-solver';

const SLUG = 'sayi-dizileri';
const task = sayiDizileri.tasks[0] as NumberSeriesTask;
const ALL: { item: NumberSeriesItem; answer: number }[] = [
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
/** Doğru cevaptan uzak, tuzak olmayan bir yanlış cevap. */
const far = (q: NumberSeriesCell) => q.answer + 7;

describe('Sayı dizileri: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; iki alıştırma sorusu; anahtarlar tekil; her dizide tek eksik sayı', () => {
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || task.items[i - 1].level <= it.level)).toBe(true);
    expect(new Set(ALL.map((x) => x.item.key)).size).toBe(26);
    expect(task.practice).toHaveLength(2);
    expect(task.practice.every((p) => p.explain.length > 40 && p.explain.includes(String(p.answer)))).toBe(true);
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    expect(task.answers).toHaveLength(24);
    expect(task.traps).toHaveLength(24);
    for (const { item, answer } of ALL) {
      expect(item.terms.filter((t) => t === null), item.key).toHaveLength(1);
      expect(item.terms.length, item.key).toBeGreaterThanOrEqual(5);
      expect(item.terms.length, item.key).toBeLessThanOrEqual(8);
      // Ekrandaki sayılar en çok üç basamaklı (kutular telefonda buna göre boyutlanır); cevap tuş takımıyla yazılabilir.
      for (const t of item.terms) if (t !== null) expect(Number.isInteger(t) && t >= 0 && t <= 999, item.key).toBe(true);
      expect(Number.isInteger(answer) && answer >= 0 && answer < 10 ** task.maxDigits, item.key).toBe(true);
    }
    // Doğru cevaplar birbirinden farklı: "hep aynı sayıyı yazma" doğru cevaplarla karışmaz.
    expect(new Set(task.answers).size).toBe(24);
    // Eksik sayı çoğunlukla sonda; ortada eksik olan bir soru ve bir alıştırma sorusu var.
    expect(ALL.filter((x) => x.item.terms.indexOf(null) !== x.item.terms.length - 1).map((x) => x.item.key)).toEqual(['sdp2', 'sd13']);
    // 1. düzeyde yalnızca küçük, sabit artış ya da azalış.
    for (const [i, it] of task.items.entries()) {
      if (it.level !== 1) continue;
      expect(it.rule).toBe('step');
      expect(Math.abs((it.terms[1] as number) - (it.terms[0] as number)), it.key).toBeLessThanOrEqual(5);
      expect(task.answers[i], it.key).toBeLessThan(100);
    }
  });

  it('her sorunun tek doğru cevabı var: bağımsız çözücü, bilinen sayılara uyan her kuralla yalnızca doğru cevabı bulur', () => {
    for (const { item, answer } of ALL) {
      expect(predictedValues(item.terms), item.key).toEqual([answer]);
    }
    // Çözücü gerçekten ayırt eder: iki kurala birden uyan bir dizide iki cevap bulur.
    expect(predictedValues([1, 1, 1, 3, 5, 9, 17, null])).toEqual([27, 31]);
    expect(predictedValues([2, 4, null])).toEqual([]);
  });

  it('kural türleri soruların gerçek kurallarıyla uyumlu; her türde en az üç soru', () => {
    for (const { item, answer } of ALL) {
      const rules = predictSeries(item.terms)
        .filter((p) => p.value === answer)
        .map((p) => p.rule);
      const has = (re: RegExp) => rules.some((r) => re.test(r));
      const simple = has(/^sabit fark$/) || has(/^sabit oran$/) || has(/2\. derece/);
      if (item.rule === 'step') expect(has(/^sabit fark$/), item.key).toBe(true);
      if (item.rule === 'ratio') expect([has(/^sabit oran$/), has(/^sabit fark$/)], item.key).toEqual([true, false]);
      if (item.rule === 'growing') expect([has(/2\. derece/), has(/^sabit (fark|oran)$/)], item.key).toEqual([true, false]);
      if (item.rule === 'alternating') expect([has(/^iç içe|^sırayla/), simple], item.key).toEqual([true, false]);
      if (item.rule === 'combined') expect([simple, has(/^iç içe|^sırayla/)], item.key).toEqual([false, false]);
    }
    expect(['step', 'ratio', 'growing', 'alternating', 'combined'].map((r) => task.items.filter((it) => it.rule === r).length)).toEqual([7, 3, 3, 5, 6]);
  });

  it('tuzak cevaplar: doğru cevap değil, hiçbir kural önermez, dizinin bir bölümüne uyan basit bir kuralla bulunur ve yakın cevap sayılmaz', () => {
    for (const [i, it] of task.items.entries()) {
      const traps = task.traps[i];
      expect(new Set(traps).size, it.key).toBe(traps.length);
      for (const t of traps) {
        expect(t, it.key).not.toBe(task.answers[i]);
        expect(Number.isInteger(t) && t >= 0, it.key).toBe(true);
        expect(partialRuleValues(it.terms).map((x) => x.value), `${it.key} ${t}`).toContain(t);
      }
    }
    // Sonda eksik olan ve tek bir işlemden fazlasını gerektiren her soruda en az bir tuzak var.
    for (const [i, it] of task.items.entries()) if (it.rule !== 'step') expect(task.traps[i].length, it.key).toBeGreaterThan(0);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, traps: task.traps, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: sayiDizileri.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
    expect(NUMBER_SERIES_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '7b649b907ec16c1b';

describe('Sayı dizileri: puanlama', () => {
  const all = (fn: (i: number) => Partial<NumberSeriesTrialInput> = () => ({})): NumberSeriesTrialInput[] =>
    task.items.map((_, index) => ({ index, response: { answer: task.answers[index] }, rtMs: 10_000, ...fn(index) }));
  const wrongAt = (i: number) => ({ response: { answer: task.answers[i] + 7 } });

  it('hatasız: 24 doğru, bütün düzeyler tam, 5. düzeye ulaşılır', () => {
    const { result } = scoreNumberSeries(task, all());
    expect(result.correct).toBe(24);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['4/4', '5/5', '5/5', '5/5', '5/5']);
    expect(result.reached).toBe(5);
    expect(result.rules.map((r) => `${r.rule} ${r.correct}/${r.n}`)).toEqual(['step 7/7', 'ratio 3/3', 'growing 3/3', 'alternating 5/5', 'combined 6/6']);
    expect([result.wrong, result.skipped, result.traps, result.nearMisses, result.rapid]).toEqual([0, 0, 0, 0, 0]);
    expect(result.medianRt).toBe(10_000);
    expect(result.sameAnswer).toBe(1);
  });

  it('ulaşılan düzey: en az %60 doğru olan en yüksek düzey; o düzeye kadarki sorularda da en az %60 doğru', () => {
    const counts = (ks: number[]) => (i: number) => {
      const lv = task.items[i].level;
      return numberSeriesRank({ level: lv, i }) < ks[lv - 1] ? {} : wrongAt(i);
    };
    const reached = (ks: number[]) => scoreNumberSeries(task, all(counts(ks))).result.reached;
    expect(reached([4, 5, 5, 5, 5])).toBe(5);
    expect(reached([4, 5, 5, 2, 2])).toBe(3);
    expect(reached([4, 5, 3, 2, 2])).toBe(3); // 3/5 = %60 yeterli
    expect(reached([4, 5, 2, 2, 2])).toBe(2); // 2/5 = %40 yetmez
    expect(reached([2, 5, 5, 0, 0])).toBe(3);
    expect(reached([4, 2, 5, 5, 5])).toBe(5);
    expect(reached([4, 1, 1, 1, 3])).toBe(1);
    expect(reached([1, 2, 2, 2, 1])).toBe(0);
  });

  it('tuzak, yakın cevap, "Bilmiyorum", çok hızlı cevap ve hep aynı sayı ayrı ayrı sayılır', () => {
    const trap = scoreNumberSeries(task, all((i) => (task.traps[i].length ? { response: { answer: task.traps[i][0] } } : {}))).result;
    const withTraps = task.traps.filter((t) => t.length).length;
    expect([trap.wrong, trap.traps, trap.nearMisses]).toEqual([withTraps, withTraps, 0]);
    // Yakın cevap: doğru cevaptan 1 fazla. sd21'de 123 tuzaktır (tuzak önce sayılır); sd19'da 18 dizide zaten var (son sayıyı
    // tekrarlamak yakın cevap sayılmaz).
    const near = scoreNumberSeries(task, all((i) => (task.items[i].level >= 4 ? { response: { answer: task.answers[i] + 1 } } : {}))).result;
    expect([near.wrong, near.traps, near.nearMisses]).toEqual([10, 1, 8]);
    // sd01 (3, 5, 7, 9, 11 → 13): 11 yazmak, doğru cevaba 2 uzak olsa da yakın cevap değildir; 12 yakındır.
    expect(scoreNumberSeries(task, all((i) => (i === 0 ? { response: { answer: 11 } } : {}))).result.nearMisses).toBe(0);
    expect(scoreNumberSeries(task, all((i) => (i === 0 ? { response: { answer: 12 } } : {}))).result.nearMisses).toBe(1);
    // Büyük cevaplarda yakınlık payı büyür: 122'ye 6 uzaklık yakın, 7 uzaklık değil.
    expect([nearMissTolerance(4), nearMissTolerance(56), nearMissTolerance(122), nearMissTolerance(162)]).toEqual([2, 3, 6, 8]);
    const farR = scoreNumberSeries(task, all((i) => (task.items[i].level >= 4 ? wrongAt(i) : {}))).result;
    expect([farR.wrong, farR.traps, farR.nearMisses]).toEqual([10, 0, 0]);
    const skip = scoreNumberSeries(task, all((i) => (task.items[i].level >= 3 ? { response: null } : {}))).result;
    expect([skip.correct, skip.skipped, skip.wrong, skip.rapidOf]).toEqual([9, 15, 0, 0]);
    expect(numberSeriesMostlySkipped(skip)).toBe(true);
    // Hızlı ama doğru cevaplar "çok hızlı" sayılmaz (cevap yazıldığı için tahminle bulunamaz); hızlı yanlışlar sayılır.
    const fastRight = scoreNumberSeries(task, all((i) => (task.items[i].level >= 3 ? { rtMs: 1200 } : {}))).result;
    expect([fastRight.rapid, fastRight.rapidOf]).toEqual([0, 15]);
    const rapid = scoreNumberSeries(task, all((i) => (task.items[i].level >= 3 ? { rtMs: 1200, ...wrongAt(i) } : {}))).result;
    expect([rapid.rapid, rapid.rapidOf]).toEqual([15, 15]);
    expect(scoreNumberSeries(task, all((i) => (task.items[i].level <= 2 ? { rtMs: 1200 } : {}))).result.rapid).toBe(0);
    expect(scoreNumberSeries(task, all(() => ({ response: { answer: 7 } }))).result.sameAnswer).toBe(24);
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı soru iki kez gelirse ilki sayılır; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreNumberSeries(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [-1, 2.5, 10_000, Number.NaN]) {
      expect(() => scoreNumberSeries(task, ok.map((t, i) => (i === 3 ? { ...t, response: { answer: bad } } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreNumberSeries(task, [...ok, { index: 24, response: { answer: 1 }, rtMs: 100 }])).toThrow(TaskInputError);
    expect(() => scoreNumberSeries(task, ok.map((t, i) => (i === 3 ? { ...t, rtMs: -1 } : t)))).toThrow(TaskInputError);
    expect(scoreNumberSeries(task, [...ok, { index: 0, response: { answer: 1 }, rtMs: 100 }]).result.correct).toBe(24);
    // Tarayıcıya giden test bilgisinde cevap anahtarı ve tuzaklar yoktur; anahtarsız puanlama yapılamaz.
    expect(() => scoreNumberSeries({ ...task, answers: [], traps: [] }, ok)).toThrow(TaskInputError);
    const bad = numberSeriesBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
    // İstek biçimi: cevap tam sayıdır; başka bir görevin cevap biçimi (seçenek sırası) puanlamada reddedilir.
    const frac = numberSeriesBody((q) => ({ answer: q.answer + 0.5, rtMs: 9000 }));
    expect(() => evaluate(SLUG, frac)).toThrow(AssessmentError);
    const option = numberSeriesBody();
    (option.data as { blocks: Record<string, { response: unknown }[]> }).blocks[task.key][0].response = 3;
    expect(() => evaluate(SLUG, option)).toThrow(AssessmentError);
  });
});

describe('Sayı dizileri: rapor', () => {
  it('hatasız: düzeylere göre grafik, dört kart, öne çıkan sayılar ve kural türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.answer, rtMs: 8000 + 3000 * q.level })));
    expect(r.student.chartTitle).toBe('Düzeylere göre doğru cevaplar');
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['1. düzey 4/4', '2. düzey 5/5', '3. düzey 5/5', '4. düzey 5/5', '5. düzey 5/5']);
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Kural türleri', '5 kural türünün hepsinde soruların çoğu doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 17 saniye'],
    ]);
    expect(r.student.keyFigures).toEqual([
      { label: 'Doğru', value: '24/24' },
      { label: 'Ulaşılan düzey', value: '5. düzey', note: '5 düzeyden' },
      { label: 'Soru başına tipik süre', value: '17 saniye' },
    ]);
    expect(r.student.items[0].text).toContain('Bütün düzeylerde soruların hemen hepsini doğru cevapladın');
    expect(r.student.items[1].text).toContain('Bu en zor düzeydi.');
    expect(r.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha çok zaman ayırdın');
    expect(r.student.items[3].text).not.toContain('Bilmiyorum');
    expect(r.student.cautions).toEqual([]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.value, b.valueLabel])).toEqual([
      ['Sabit artış ya da azalış', 100, '7/7'],
      ['Çarpma ve bölme', 100, '3/3'],
      ['Değişen artış', 100, '3/3'],
      ['İç içe diziler', 100, '5/5'],
      ['Birleşik kurallar', 100, '6/6'],
    ]);
    expect(rm.barsTitle).toBe('Kural türlerine göre sonucun');
    expect(r.parent.roadmap!.barsTitle).toBe('Kural türlerine göre sonuç');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(text(r.parent)).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|yazdın|dedin)\b/);
  });

  it('örnek: ilk üç düzey tam, sonra zorlanma; ulaşılan düzey, zorlanılan düzey ve kural türleri anlatılır', () => {
    const r = evaluate(SLUG, numberSeriesBody());
    expect(r.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(r.student.items[0].text).toContain('Sorular zorlaştıkça doğru cevapların azaldı');
    expect(r.student.items[1].badge).toBe('3. düzey');
    expect(r.student.items[1].text).toContain('3. düzeye kadar soruların çoğunu doğru cevapladın');
    expect(r.student.items[1].text).toContain('4. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda sırayla değişen iki işlemi');
    expect(r.student.items[2].badge).toBe('5 kural türünün 4 tanesinde soruların çoğu doğru');
    expect(r.student.items[2].text).toContain('“birleşik kurallar” türündeki sorularda zorlandın. Bu türde iki adımlı bir kuralı (ör. “iki katının bir fazlası”) bulmak');
    expect(r.student.items[2].text).toContain('ör. “sabit artış ya da azalış” soruları 1., 2. ve 3. düzeylerde, “birleşik kurallar” soruları 4. ve 5. düzeylerde');
    expect(r.parent.items[2].text).toContain('Çocuğunuz “sabit artış ya da azalış”');
    // Yanlışlar doğru cevaptan uzak: tuzak ya da yakın cevap yorumu yapılmaz.
    expect(r.student.items[0].text).not.toMatch(/daha basit bir kuralla|çok yakındı/);
  });

  it('durumlar: çok az doğru, çoğunda "Bilmiyorum", tuzaklar, yakın cevaplar, çok hızlı, hep aynı sayı, kolay sorularda yanılma', () => {
    // Bütün sorularda yanlış: doğru cevap çok az; kural türleri yorumlanmaz, üç boyutlu grafik çizilmez.
    const none = evaluate(SLUG, numberSeriesBody((q) => ({ answer: far(q), rtMs: 9000 })));
    expect(none.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', '1. düzeyde zorlandın', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.items[0].text).toContain('24 sorunun hiçbirinde eksik sayıyı doğru bulamadın.');
    expect(none.parent.items[0].text).toContain('Bu sonuç tek başına yorumlanmamalıdır');
    expect(none.student.roadmap!.bars).toEqual([]);
    expect(none.student.keyFigures[1]).toEqual({ label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: '1. düzeyde zorlanıldı' });
    // Üç doğru: kural türleri yorumlanır.
    const three = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.i < 3 ? q.answer : far(q), rtMs: 9000 })));
    expect(three.student.items[2].badge).not.toBe('Yorumlanmadı');
    expect(three.student.roadmap!.bars).toHaveLength(5);
    // İlk iki düzey doğru, ötekilerde "Bilmiyorum": uyarı, doğru cevaplar kartı ve çalışma biçimi aynı şeyi söyler.
    const skip = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level <= 2 ? q.answer : null, rtMs: 9000 })));
    expect(skip.student.cautions.join(' ')).toContain('24 sorunun 15 tanesinde “Bilmiyorum” denmiş');
    expect(skip.student.items[0].text).toContain('Soruların yarısından çoğunda “Bilmiyorum” dedin');
    expect(skip.student.items[3].text).toContain('15 soruda “Bilmiyorum” dedin.');
    expect(skip.student.items[3].text).toContain('“Bilmiyorum” 15 soruda');
    expect(skip.parent.items[3].text).toContain('Çocuğunuz 15 soruda “Bilmiyorum” dedi.');
    expect(skip.student.items[1].badge).toBe('2. düzey');
    // Hepsinde "Bilmiyorum" ve süre yok.
    const allSkip = evaluate(SLUG, numberSeriesBody(() => ({ answer: null, rtMs: null })));
    expect(allSkip.student.items[3].badge).toBe('Süre hesaplanamadı');
    expect(allSkip.student.items[3].text).toContain('Bütün sorularda “Bilmiyorum” dedin.');
    expect(allSkip.student.cautions.join(' ')).toContain('24 sorunun hepsinde “Bilmiyorum” denmiş');
    expect(allSkip.student.items[0].text).toContain('Bütün sorularda “Bilmiyorum” dedin');
    expect(allSkip.student.items[1].text).toContain('Soruların çoğunda “Bilmiyorum” dediğin için bu sonuç tek başına yorumlanmamalıdır.');
    expect(allSkip.student.items[1].text).not.toMatch(/dikkat|acele/);
    // Tuzaklar: 4. ve 5. düzeyin hepsinde dizinin bir bölümüne uyan daha basit kural.
    const trap = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level >= 4 ? q.traps[0] : q.answer, rtMs: 15_000 })));
    expect(trap.student.items[0].text).toContain('Yanlış cevaplarının hepsinde daha basit bir kuralla bulunan bir sayı yazdın: dizinin yalnızca bir bölümüne uyan ya da kuralın bir adımını atlayan');
    expect(trap.parent.items[0].text).toContain('Çocuğunuz yanlış cevaplarının hepsinde');
    // Yarısı tuzak (4. düzey), yarısı uzak (5. düzey).
    const half = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level === 4 ? q.traps[0] : q.level === 5 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(half.student.items[0].text).toContain('Yanlış cevaplarının yarısında (10 yanlışın 5 tanesinde) daha basit bir kuralla');
    // Yakın cevaplar: biri tuzak (sd21'de 123), dokuzu yakın.
    const near = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level >= 4 ? q.answer + 1 : q.answer, rtMs: 15_000 })));
    expect(near.student.items[0].text).toContain('Yanlış cevaplarının çoğunda (10 yanlışın 8 tanesinde) yazdığın sayı doğru cevaba çok yakındı');
    expect(near.student.items[0].text).not.toContain('daha basit bir kuralla');
    // Zor sorularda çok hızlı: uyarı ve kart aynı şeyi söyler; hız karşılaştırması yapılmaz.
    const rapid = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level >= 3 ? far(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('cevap yazılan 15 sorunun hepsinde yanlış bir cevap 2,5 saniyeden kısa sürede yazılmış');
    expect(rapid.student.items[3].text).toContain('cevap yazdığın 15 sorunun hepsinde yanlış bir cevabı 2,5 saniyeden kısa sürede yazdın');
    // Hızlı ama doğru: uyarı yok, "bakmadan yazmış olabilirsin" denmez.
    const fastRight = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.answer, rtMs: q.level >= 3 ? 2000 : 6000 })));
    expect(fastRight.student.cautions).toEqual([]);
    expect(text(fastRight.student)).not.toMatch(/bakmadan|tahmin/);
    expect(rapid.student.items[3].text).not.toMatch(/zaman ayırdın|yakın süreler/);
    expect(rapid.student.items[0].text).toContain('Bazı sorulara bakmadan cevap yazmış olabileceğin için');
    // Hep aynı sayı.
    const same = evaluate(SLUG, numberSeriesBody(() => ({ answer: 7, rtMs: 4000 })));
    expect(same.parent.cautions.join(' ')).toContain('aynı sayı yazılmış');
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sayıyı yazdın');
    // Bir saniyeden kısa tipik süre "0 saniye" diye yazılmaz.
    const blink = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.answer, rtMs: 300 })));
    expect(blink.student.items[3].badge).toBe('Soru başına tipik süre bir saniyeden kısa');
    // 1. düzeyde iki yanlış ama üst düzeyler başarılı: kolay sorularda dikkat dağılmış olabilir.
    const easy = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level === 1 && numberSeriesRank(q) < 2 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(easy.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(easy.student.items[1].badge).toBe('5. düzey');
    expect(easy.student.items[1].text).toContain('Daha kolay olan 1. düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi');
    // 1. düzeyin hiçbiri doğru değil ama üst düzeyler başarılı: "hiçbirini".
    const easyAll = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level === 1 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(easyAll.student.items[0].text).toContain('1. düzeydeki kolay soruların hiçbirini doğru cevaplamadın');
    // Kural türlerinde ölçüt yarıdan fazlası: 7 soruluk türde 4/7 doğru, "çoğu doğru" sayılır.
    const steps = evaluate(SLUG, numberSeriesBody((q) => ({ answer: ['sd05', 'sd06', 'sd13'].includes(task.items[q.i].key) ? far(q) : q.answer, rtMs: 15_000 })));
    expect(steps.student.items[2].badge).toBe('5 kural türünün hepsinde soruların çoğu doğru');
    expect(steps.student.items[2].text).toContain('Sabit artış ya da azalış 4/7');
    expect(steps.student.items[2].text).not.toContain('zorlandın');
    // Zor düzeylerde kolaylardan daha çok doğru.
    const upside = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level === 2 && numberSeriesRank(q) < 4 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(upside.student.items[0].text).toContain('Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin');
    // Kolay sorularda yanlış yokken "kolay sorulardaki yanlışlar" denmez.
    const dip = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level === 3 && numberSeriesRank(q) < 4 ? far(q) : q.answer, rtMs: 15_000 })));
    expect(dip.student.items[0].text).toContain('birbirine yakındı');
    expect(dip.student.items[0].text).not.toContain('Kolay sorulardaki yanlışlar');
    // Zor sorular hızlı ve doğru.
    const quickHard = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.answer, rtMs: q.level <= 2 ? 26_000 : 9000 })));
    expect(quickHard.student.items[3].text).toContain('Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.');
    // Süreler yuvarlanınca aynı görünüyorsa (10,0 ve 9,9 saniye) "daha az zaman" denmez.
    const evenTime = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level >= 4 ? null : q.answer, rtMs: q.level >= 4 ? 9900 : 10_000 })));
    expect(evenTime.student.items[3].text).toContain('Kolay ve zor sorulara birbirine yakın süreler ayırdın.');
    // Zor sorulara az zaman, az doğru.
    const giveUp = evaluate(SLUG, numberSeriesBody((q) => ({ answer: q.level >= 4 ? null : q.answer, rtMs: q.level >= 4 ? 5000 : 20_000 })));
    expect(giveUp.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı.');
    // Hiçbir düzey ölçüte uymuyor.
    const low = evaluate(SLUG, numberSeriesBody((q) => ({ answer: numberSeriesRank(q) < [2, 3, 2, 1, 0][q.level - 1] ? q.answer : far(q), rtMs: 15_000 })));
    expect(low.student.items[1].badge).toBe('1. düzeyde zorlandın');
    expect(low.student.items[1].text).toContain('bu ölçüte hiçbir düzeyde ulaşılmadığı için bir düzey belirtilmedi');
    expect(low.parent.items[1].badge).toBe('1. düzeyde zorlandı');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: NumberSeriesCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkDuzey: (q) => q.level === 1,
      kolaydaYanilma: (q) => !(q.level === 1 && numberSeriesRank(q) < 2),
      atlama: (q) => !(q.level === 2 && numberSeriesRank(q) < 3),
      duz: (q) => numberSeriesRank(q) % 2 === 0,
      ikiDogru: (q) => q.i < NUMBER_FEW_MAX,
      ucDogru: (q) => q.i < NUMBER_FEW_MAX + 1,
      sondanBes: (q) => q.i >= 19,
    };
    const wrongKinds: Record<string, (q: NumberSeriesCell) => number | null> = {
      uzak: far,
      tuzak: (q) => q.traps[0] ?? far(q),
      yakin: (q) => q.answer + 1,
      bilmiyorum: () => null,
    };
    const times: Record<string, (q: NumberSeriesCell) => number | null> = {
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
          for (const sameNum of [false, true]) {
            const body = numberSeriesBody((q) => ({ answer: sameNum ? 7 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${sameNum}`;
            const res = evaluate(SLUG, body);
            const { result } = scoreNumberSeries(task, (body.data as { blocks: Record<string, NumberSeriesTrialInput[]> }).blocks[task.key]);
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const few = result.correct <= NUMBER_FEW_MAX;
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
              expect(r.items.map((i) => i.title), label).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              // Çok az doğru: kural türleri ve üç boyutlu grafik yorumlanmaz; doğru cevaplar kartı bunu söyler.
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(few);
              expect(r.roadmap!.bars.length, label).toBe(few ? 0 : 5);
              expect(/Bu sonuç tek başına (bir şey söylemez|yorumlanmamalıdır)/.test(r.items[0].text), label).toBe(few);
              // "Bilmiyorum": uyarı ile doğru cevaplar kartı aynı durumu söyler; çalışma biçimi sayısını verir.
              const skipNote = r.cautions.some((c) => c.includes('“Bilmiyorum” denmiş'));
              expect(skipNote, label).toBe(numberSeriesMostlySkipped(result));
              expect(r.items[0].text.includes('“Bilmiyorum” dedi'), label).toBe(skipNote);
              expect(r.items[3].text.includes('“Bilmiyorum” dedi'), label).toBe(result.skipped > 0);
              // Çok hızlı ve hep aynı sayı: uyarı ile çalışma biçimi kartı aynı durumu söyler; hız karşılaştırılmaz.
              const rapidNote = r.cautions.some((c) => c.includes('2,5 saniyeden kısa'));
              expect(r.items[3].text.includes('2,5 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sayı yazılmış'));
              expect(r.items[3].text.includes('aynı sayıyı yazdı'), label).toBe(sameNote);
              if (rapidNote || sameNote) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (rapidNote) expect(result.wrong, label).toBeGreaterThan(0);
              expect(r.items[0].text.includes('Bütün sorularda “Bilmiyorum”'), label).toBe(result.skipped === result.n);
              if (!few) expect(r.items[0].text.includes('bakmadan cevap yazmış') || r.items[0].text.includes('bakılmadan cevap yazılmış'), label).toBe(rapidNote || sameNote);
              // Yanlışların türü yalnızca yeterince yanlış varsa ve yanlışların en az yarısı aynı türdeyse yorumlanır.
              const many = !few && result.wrong >= NUMBER_PATTERN_MIN;
              expect(r.items[0].text.includes('daha basit bir kuralla'), label).toBe(many && result.traps * 2 >= result.wrong);
              expect(r.items[0].text.includes('doğru cevaba çok yakındı'), label).toBe(many && result.nearMisses * 2 >= result.wrong);
              // Ulaşılan düzey kartı ile öne çıkan sayı aynı.
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (result.reached === 0) expect([fig, r.items[1].badge?.startsWith('1. düzeyde zorlandı')], label).toEqual(['Belirtilmedi', true]);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
              expect(r.items[3].badge === 'Süre hesaplanamadı', label).toBe(result.medianRt === null);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|yazdın|dedin|bulamadın|cevaplamadın)\b/);
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(11 * 4 * 5 * 2);
  }, 180_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, numberSeriesBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, numberSeriesBody(undefined, 3)).parent.items).toHaveLength(4);
    expect(evaluate(SLUG, numberSeriesBody(undefined, 13)).parent.items).toHaveLength(4);
    const r = evaluateReports(SLUG, numberSeriesBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([sayiDizileri.intro.title, ...sayiDizileri.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
    // Yol haritasındaki örnek dizi testin sorularından biri değildir (cevabı ele vermez).
    const example = JSON.stringify(TASK_ROADMAPS[SLUG]);
    for (const it of task.items) expect(example, it.key).not.toContain(it.terms.filter((x) => x !== null).join(', '));
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /SD_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(SLUG, numberSeriesBody((q) => ({ answer: Number(m![1].split(',')[q.i]), rtMs: 9000 + 1000 * q.i })));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(5);
    expect(r.student.keyFigures).toHaveLength(3);
    // Çözme sayfasında cevap anahtarı ve tuzaklar boş gönderilir (dış sınama bunu da denetler).
    expect(yml).toMatch(/sd_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"traps\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, numberSeriesBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, numberSeriesBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı', () => {
    expect(sayiDizileri.status).toBe('pilot');
    expect(sayiDizileri.licenseStatus).toBe('original');
    expect(task.rapidMs).toBe(2500);
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(sayiDizileri.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(sayiDizileri.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...sayiDizileri.science, citations: [] });
    const authors = ['LeFevre', 'Schneider', 'Ferrer'];
    expect(sayiDizileri.science.citations.map((c) => c.text.split(',')[0])).toEqual(authors);
    for (const a of authors) expect(body, a).toMatch(new RegExp(`${a}(’in| ve| ve ark\\.|,)`));
    // Yol haritasının kaynakları bilim kartındaki kaynaklardır.
    expect(TASK_ROADMAPS[SLUG].sources.map((s) => s.url).sort()).toEqual(sayiDizileri.science.citations.map((c) => c.url).sort());
  });
});
