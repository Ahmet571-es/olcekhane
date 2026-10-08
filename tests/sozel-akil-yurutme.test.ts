import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { VERBAL_SPECS, sozelAkilYurutme } from '@/content/instruments/sozel-akil-yurutme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { VerbalItem, VerbalReasoningTask } from '@/lib/instruments/types';
import { VERBAL_PROMPTS, VERBAL_TYPE_NAMES, VERBAL_UNKNOWN, verbalRapidMs } from '@/lib/instruments/verbal';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { VERBAL_TYPES } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  TaskInputError,
  VERBAL_CHANCE_MAX,
  VERBAL_LURE_MIN,
  VERBAL_LURE_SHARE,
  scoreVerbal,
  verbalLurePattern,
  verbalRapid,
  verbalSamePosition,
  type VerbalTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { verbalBody, verbalOther, verbalRank, type VerbalCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { DEDUCTION, ORDERING, deductionVerdicts, judge, orderingVerdicts, partialWho } from './helpers/verbal-logic';

const SLUG = 'sozel-akil-yurutme';
const task = sozelAkilYurutme.tasks[0] as VerbalReasoningTask;
const ALL: { item: VerbalItem; answer: number }[] = [
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
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Soru türleri', 'Çalışma biçimi'];
const TYPES = ['analogy', 'classification', 'ordering', 'deduction'] as const;
const LOGIC = new Set([...Object.keys(ORDERING), ...Object.keys(DEDUCTION)]);

describe('Sözel akıl yürütme: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; her türden altı soru düzeylere yayılır; her türden bir alıştırma', () => {
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || task.items[i - 1].level <= it.level)).toBe(true);
    expect(new Set(ALL.map((x) => x.item.key)).size).toBe(28);
    const levelsOf = (type: string) => task.items.filter((it) => it.type === type).map((it) => it.level);
    expect(levelsOf('analogy')).toEqual([1, 2, 2, 3, 4, 5]);
    expect(levelsOf('classification')).toEqual([1, 2, 3, 3, 4, 5]);
    expect(levelsOf('ordering')).toEqual([1, 2, 3, 4, 4, 5]);
    expect(levelsOf('deduction')).toEqual([1, 2, 3, 4, 5, 5]);
    // Her düzeyde dört türün her biri var.
    for (const l of [1, 2, 3, 4, 5]) expect(new Set(task.items.filter((it) => it.level === l).map((it) => it.type)).size, String(l)).toBe(4);
    expect(task.practice.map((p) => p.type)).toEqual([...TYPES]);
    // Açıklama doğru cevabı anar.
    for (const p of task.practice) {
      const first = p.options[p.answer - 1].split(' ')[0].toLocaleLowerCase('tr-TR');
      expect(p.explain.length, p.key).toBeGreaterThan(60);
      expect(p.explain.toLocaleLowerCase('tr-TR'), p.key).toContain(first);
    }
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    expect([task.answers.length, task.lures.length]).toEqual([24, 24]);
  });

  it('seçenekler ve metinler: beş farklı seçenek, türüne uygun biçim, Türkçe kesme işareti, "bilinemez" yalnızca sıralamada ve sonda', () => {
    for (const { item } of ALL) {
      expect(item.options, item.key).toHaveLength(5);
      expect(new Set(item.options.map((o) => o.toLocaleLowerCase('tr-TR'))).size, item.key).toBe(5);
      const all = [...item.stem, item.question ?? '', ...item.options].filter(Boolean).join(' ');
      expect(all, item.key).not.toMatch(/'|  |\s[,.;:]|\.\.|^\s|\s$/);
      if (item.type === 'analogy' || item.type === 'classification') {
        expect(item.stem, item.key).toHaveLength(3);
        expect(item.question, item.key).toBeUndefined();
        // Kelimeler küçük harfle; seçenekler gruptaki kelimeleri tekrarlamaz (kelime ilişkilerinde ilk çiftin kelimesi
        // ters ilişkinin çeldiricisi olabilir).
        for (const w of [...item.stem, ...item.options]) expect(w, item.key).toBe(w.toLocaleLowerCase('tr-TR'));
        expect(item.options.filter((o) => item.stem.slice(item.type === 'analogy' ? 2 : 0).includes(o)), item.key).toEqual([]);
      } else {
        expect(item.stem.length, item.key).toBeGreaterThanOrEqual(2);
        for (const line of item.stem) expect(line, item.key).toMatch(/[.:]$/);
      }
      if (item.type === 'ordering') expect(item.question, item.key).toMatch(/\?$/);
      if (item.type === 'deduction') {
        expect(item.question, item.key).toBeUndefined();
        for (const o of item.options) expect(o, item.key).toMatch(/\.$/);
      }
      const unknown = item.options.indexOf(VERBAL_UNKNOWN);
      if (unknown >= 0) expect([item.type, unknown], item.key).toEqual(['ordering', 4]);
    }
    // Yönergeler ve sorular sabit metinlerdir.
    expect(VERBAL_PROMPTS.deduction.lead).toContain('yalnızca bu bilgileri kullan');
    expect(Object.values(VERBAL_TYPE_NAMES)).toEqual(TYPES.map((t) => VERBAL_TYPES[t].name));
  });

  it('cevap anahtarı: doğru cevaplar ve çeldiriciler beş seçeneğe dengeli dağılır, art arda aynı yerde doğru cevap yok', () => {
    for (const [i, it] of task.items.entries()) {
      expect([1, 2, 3, 4, 5], it.key).toContain(task.answers[i]);
      expect([1, 2, 3, 4, 5], it.key).toContain(task.lures[i]);
      expect(task.lures[i], it.key).not.toBe(task.answers[i]);
    }
    const count = (xs: number[]) => [1, 2, 3, 4, 5].map((o) => xs.filter((x) => x === o).length);
    expect(count(task.answers)).toEqual([5, 5, 5, 5, 4]);
    expect(count(task.lures)).toEqual([4, 5, 5, 5, 5]);
    expect(task.answers.every((a, i) => i === 0 || a !== task.answers[i - 1])).toBe(true);
    // Doğru cevap "bilinemez" olan tek soru var; öteki sıralama sorularında o seçenek yanlıştır.
    expect(task.items.filter((it, i) => it.options[task.answers[i] - 1] === VERBAL_UNKNOWN).map((it) => it.key)).toEqual(['sz19']);
  });

  it('sıralama ve mantıksal çıkarım: bilgilere uyan bütün olasılıklarda yalnızca doğru seçenek kesinlikle doğrudur', () => {
    const logical = ALL.filter((x) => x.item.type === 'ordering' || x.item.type === 'deduction');
    expect(logical.map((x) => x.item.key).sort()).toEqual([...LOGIC].sort());
    for (const { item, answer } of logical) {
      const { verdicts, models } = item.type === 'ordering' ? orderingVerdicts(item.key) : deductionVerdicts(item.key);
      expect(models, item.key).toBeGreaterThan(0);
      expect(verdicts.map((v, i) => (v === 'kesin' ? i + 1 : null)).filter(Boolean), item.key).toEqual([answer]);
    }
    // Biçimsel yazımdaki seçenek sayısı sorudakiyle aynı.
    for (const k of Object.keys(DEDUCTION)) expect(DEDUCTION[k].options, k).toHaveLength(5);
  }, 60_000);

  it('denetleyici gerçekten ayırt eder: geçerli ve geçersiz çıkarımlar', () => {
    const base = { sets: ['a', 'b', 'c'], individuals: ['x'], free: 0 };
    expect(judge({ ...base, facts: [(q) => q.all('a', 'b'), (q) => q.all('b', 'c')] }, (q) => q.all('a', 'c'))).toBe('kesin');
    expect(judge({ ...base, facts: [(q) => q.all('a', 'b'), (q) => q.some('b', 'c')] }, (q) => q.some('a', 'c'))).toBe('olabilir');
    expect(judge({ ...base, facts: [(q) => q.no('a', 'b'), (q) => q.all('c', 'b')] }, (q) => q.no('c', 'a'))).toBe('kesin');
    expect(judge({ ...base, facts: [(q) => q.all('a', 'b')] }, (q) => q.all('b', 'a'))).toBe('olabilir');
    expect(judge({ ...base, facts: [(q) => q.all('a', 'b'), (q) => q.is('x', 'b')] }, (q) => q.is('x', 'a'))).toBe('olabilir');
    expect(judge({ ...base, facts: [(q) => q.all('a', 'b'), (q) => !q.is('x', 'b')] }, (q) => !q.is('x', 'a'))).toBe('kesin');
    expect(judge({ ...base, facts: [(q) => q.all('a', 'b')] }, (q) => q.someNot('a', 'b'))).toBe('yanlış');
    // Sıralamada: iki kişi karşılaştırılmamışsa "kim" sorusunun cevabı "bilinemez" olur (sz19).
    expect(orderingVerdicts('sz19').verdicts).toEqual(['yanlış', 'olabilir', 'yanlış', 'olabilir', 'kesin']);
  });

  it('çeldiriciler: sıralama ve çıkarımda ya olabilir (kesin değil) ya da bilgilerin yalnızca ilk bölümüne bakınca bulunan cevap', () => {
    // Kim sorularında çeldirici, ilk k bilgiye ve yalnızca onlarda adı geçenlere bakınca bulunan cevaptır.
    const PARTIAL: Record<string, [number, string[]]> = {
      sz02: [2, ['Kerem', 'Defne', 'Umut']],
      sz08: [1, ['Kırmızı', 'Mavi']],
      sz16: [2, ['Tolga', 'Ceren']],
    };
    const partial: string[] = [];
    for (const [i, it] of task.items.entries()) {
      if (!LOGIC.has(it.key)) continue;
      const lure = task.lures[i];
      const { verdicts } = it.type === 'ordering' ? orderingVerdicts(it.key) : deductionVerdicts(it.key);
      if (verdicts[lure - 1] === 'olabilir') continue;
      partial.push(it.key);
      const [k, mentioned] = PARTIAL[it.key] ?? [0, []];
      expect(k, it.key).toBeLessThan(ORDERING[it.key].facts.length);
      expect(partialWho(it.key, k, mentioned), it.key).toBe(it.options[lure - 1].replace(' kalem', ''));
    }
    expect(partial).toEqual(Object.keys(PARTIAL));
  }, 60_000);

  it('çok hızlı cevap sınırı soru uzunluğuna göre: kısa kelime sorularında yaklaşık 2, uzun sorularda en çok 8 saniye', () => {
    const ms = task.items.map(verbalRapidMs);
    expect(Math.min(...ms)).toBeGreaterThanOrEqual(2000);
    expect(Math.max(...ms)).toBeLessThanOrEqual(8000);
    const short = task.items.filter((it) => it.type === 'analogy').map(verbalRapidMs);
    expect(Math.max(...short)).toBeLessThan(2600);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, lures: task.lures, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: sozelAkilYurutme.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
    expect(VERBAL_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
    expect(VERBAL_SPECS.every((s) => s.why.length > 20)).toBe(true);
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = 'e4bce778c6be405d';

describe('Sözel akıl yürütme: puanlama', () => {
  const all = (fn: (i: number) => Partial<VerbalTrialInput> = () => ({})): VerbalTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 15_000, ...fn(index) }));
  const cell = (i: number): VerbalCell => ({ level: task.items[i].level, type: task.items[i].type, answer: task.answers[i], lure: task.lures[i], i });
  const otherAt = (i: number) => ({ response: verbalOther(cell(i)) });

  it('hatasız: 24 doğru, bütün düzeyler ve türler tam, 5. düzeye ulaşılır', () => {
    const { result } = scoreVerbal(task, all());
    expect(result.correct).toBe(24);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['4/4', '5/5', '5/5', '5/5', '5/5']);
    expect(result.reached).toBe(5);
    expect(result.types.map((t) => `${t.type} ${t.correct}/${t.n}`)).toEqual(['analogy 6/6', 'classification 6/6', 'ordering 6/6', 'deduction 6/6']);
    expect([result.wrong, result.lures, result.rapid, result.rapidOf]).toEqual([0, 0, 0, 15]);
    expect(result.medianRt).toBe(15_000);
    expect(result.samePosition).toBe(5);
  });

  it('ulaşılan düzey: en az %60 doğru olan en yüksek düzey; o düzeye kadarki sorularda da en az %60 doğru', () => {
    const counts = (ks: number[]) => (i: number) => {
      const lv = task.items[i].level;
      return verbalRank({ level: lv, i }) < ks[lv - 1] ? {} : otherAt(i);
    };
    const reached = (ks: number[]) => scoreVerbal(task, all(counts(ks))).result.reached;
    expect(reached([4, 5, 5, 5, 5])).toBe(5);
    expect(reached([4, 5, 5, 2, 2])).toBe(3);
    expect(reached([4, 5, 3, 2, 2])).toBe(3);
    expect(reached([4, 5, 2, 2, 2])).toBe(2);
    expect(reached([2, 5, 5, 0, 0])).toBe(3);
    expect(reached([1, 2, 2, 2, 1])).toBe(0);
  });

  it('çeldirici, çok hızlı cevap ve hep aynı yer ayrı ayrı sayılır; türlere göre çeldiriciler', () => {
    const lure = scoreVerbal(task, all((i) => (task.items[i].level >= 4 ? { response: task.lures[i] } : {}))).result;
    expect([lure.wrong, lure.lures]).toEqual([10, 10]);
    expect(lure.luresByType).toEqual({ analogy: 2, classification: 2, ordering: 3, deduction: 3 });
    expect(verbalLurePattern(lure)).toBe(true);
    const other = scoreVerbal(task, all((i) => (task.items[i].level >= 4 ? otherAt(i) : {}))).result;
    expect([other.wrong, other.lures, verbalLurePattern(other)]).toEqual([10, 0, false]);
    // Çok hızlı: sınır soruya göre değişir; sınırın hemen altı hızlı, hemen üstü değil. Kolay düzeyler ve doğru cevaplar
    // sayılmaz (kısa kelime sorularını hızla doğru cevaplayan uyarı almaz).
    const below = scoreVerbal(task, all((i) => ({ rtMs: verbalRapidMs(task.items[i]) - 1, ...otherAt(i) }))).result;
    expect([below.rapid, below.rapidOf]).toEqual([15, 15]);
    expect(scoreVerbal(task, all((i) => ({ rtMs: verbalRapidMs(task.items[i]), ...otherAt(i) }))).result.rapid).toBe(0);
    expect(scoreVerbal(task, all((i) => ({ rtMs: verbalRapidMs(task.items[i]) - 1 }))).result.rapid).toBe(0);
    expect(verbalRapid(below)).toBe(true);
    const same = scoreVerbal(task, all(() => ({ response: 3 }))).result;
    expect([same.samePosition, verbalSamePosition(same)]).toEqual([24, true]);
    // Eşikler: rastgele seçimde 9 ya da daha çok doğru olasılığı %5'in altında; çeldirici payı rastgele seçimdekinin (1/4) üstünde.
    let p = 0;
    for (let k = 9; k <= 24; k++) p += comb(24, k) * 0.2 ** k * 0.8 ** (24 - k);
    expect(p).toBeLessThan(0.05);
    let p8 = 0;
    for (let k = 8; k <= 24; k++) p8 += comb(24, k) * 0.2 ** k * 0.8 ** (24 - k);
    expect(p8).toBeGreaterThan(0.05);
    expect(VERBAL_CHANCE_MAX).toBe(8);
    expect([VERBAL_LURE_MIN, VERBAL_LURE_SHARE]).toEqual([4, 0.6]);
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı soru iki kez gelirse ilki sayılır; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreVerbal(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 6, 2.5, Number.NaN]) {
      expect(() => scoreVerbal(task, ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreVerbal(task, [...ok, { index: 24, response: 1, rtMs: 100 }])).toThrow(TaskInputError);
    expect(() => scoreVerbal(task, ok.map((t, i) => (i === 3 ? { ...t, rtMs: -1 } : t)))).toThrow(TaskInputError);
    expect(scoreVerbal(task, [...ok, { index: 0, response: verbalOther(cell(0)), rtMs: 100 }]).result.correct).toBe(24);
    expect(() => scoreVerbal({ ...task, answers: [], lures: [] }, ok)).toThrow(TaskInputError);
    const bad = verbalBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
    // Başka bir görevin cevap biçimi (yazılan sayı) reddedilir.
    const typed = verbalBody();
    (typed.data as { blocks: Record<string, { response: unknown }[]> }).blocks[task.key][0].response = { answer: 3 };
    expect(() => evaluate(SLUG, typed)).toThrow(AssessmentError);
  });
});

function comb(n: number, k: number): number {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
}

describe('Sözel akıl yürütme: rapor', () => {
  it('hatasız: düzeylere göre grafik, dört kart, öne çıkan sayılar ve soru türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, verbalBody((q) => ({ response: q.answer, rtMs: 8000 + 4000 * q.level })));
    expect(r.student.chartTitle).toBe('Düzeylere göre doğru cevaplar');
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['1. düzey 4/4', '2. düzey 5/5', '3. düzey 5/5', '4. düzey 5/5', '5. düzey 5/5']);
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Soru türleri', '4 soru türünün hepsinde soruların çoğu doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 20 saniye'],
    ]);
    expect(r.student.keyFigures).toEqual([
      { label: 'Doğru', value: '24/24' },
      { label: 'Ulaşılan düzey', value: '5. düzey', note: '5 düzeyden' },
      { label: 'Soru başına tipik süre', value: '20 saniye' },
    ]);
    expect(r.student.items[0].text).toContain('Bütün düzeylerde soruların hemen hepsini doğru cevapladın');
    expect(r.student.items[1].text).toContain('Bu en zor düzeydi.');
    expect(r.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha çok zaman ayırdın');
    expect(r.student.cautions).toEqual([]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.value, b.valueLabel])).toEqual([
      ['Kelime ilişkileri', 100, '6/6'],
      ['Sınıflama', 100, '6/6'],
      ['Sıralama', 100, '6/6'],
      ['Mantıksal çıkarım', 100, '6/6'],
    ]);
    expect(rm.barsTitle).toBe('Soru türlerine göre sonucun');
    expect(r.parent.roadmap!.barsTitle).toBe('Soru türlerine göre sonuç');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(text(r.parent)).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|seçtin)\b/);
  });

  it('örnek: ilk üç düzey tam, sonra zorlanma; ulaşılan düzey, zorlanılan düzey ve soru türleri anlatılır', () => {
    const r = evaluate(SLUG, verbalBody());
    expect(r.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(r.student.items[0].text).toContain('Sorular zorlaştıkça doğru cevapların azaldı');
    expect(r.student.items[1].badge).toBe('3. düzey');
    expect(r.student.items[1].text).toContain('3. düzeye kadar soruların çoğunu doğru cevapladın. 3. düzeydeki sorularda şunlar gerekiyordu: bir parçanın');
    expect(r.student.items[1].text).toContain('4. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda bir şeyin en hafif');
    expect(r.student.items[2].text).toContain('Kelime ilişkileri 6/6 · Sınıflama 4/6 · Sıralama 4/6 · Mantıksal çıkarım 4/6');
    expect(r.student.items[2].badge).toBe('4 soru türünün hepsinde soruların çoğu doğru');
    expect(r.student.items[0].text).not.toContain('ilk bakışta doğru görünen');
  });

  it('durumlar: rastgele düzeyinde doğru, çeldiriciler, çok hızlı, hep aynı yer, kolay sorularda yanılma, tür farkları', () => {
    // Bütün sorularda yanlış: doğru cevap rastgele düzeyinde; düzey ve türler yorumlanmaz, üç boyutlu grafik çizilmez.
    const none = evaluate(SLUG, verbalBody((q) => ({ response: verbalOther(q), rtMs: 9000 })));
    expect(none.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.items[0].text).toContain('rastgele seçen birinin de bulabileceği kadar az (24 soruda 8 ya da daha az)');
    expect(none.parent.items[0].text).toContain('Bu sonuç yorumlanmamalıdır');
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(none.student.roadmap!.bars).toEqual([]);
    expect(none.student.keyFigures[1]).toEqual({ label: 'Ulaşılan düzey', value: 'Yorumlanmadı' });
    // Dokuz doğru: yorumlanır.
    const nine = evaluate(SLUG, verbalBody((q) => ({ response: q.i < 9 ? q.answer : verbalOther(q), rtMs: 9000 })));
    expect(nine.student.items[2].badge).not.toBe('Yorumlanmadı');
    expect(nine.student.roadmap!.bars).toHaveLength(4);
    // Çeldiriciler: 4. ve 5. düzeyin hepsinde; bütün türler anılır.
    const lure = evaluate(SLUG, verbalBody((q) => ({ response: q.level >= 4 ? q.lure : q.answer, rtMs: 20_000 })));
    expect(lure.student.items[0].text).toContain(
      'Yanlış cevaplarının hepsinde ilk bakışta doğru görünen ama sorudaki bilgilerin hepsine uymayan seçeneği seçtin. Bu yanlışlar şu yanılgılardan kaynaklanmış olabilir: kelime ilişkilerinde kelimeler arasındaki ilişkiye değil konularına bakmak; sınıflamada gruba yalnızca bir yönüyle benzeyen kelimeyi gruba katmak; sıralamada bilgilerin yalnızca bir bölümüne dayanmak ya da olabilecek bir sıralamayı kesin saymak; mantıksal çıkarımda verilen bilgilerden kesin olarak çıkmayan bir cümleyi doğru saymak.',
    );
    expect(lure.parent.items[0].text).toContain('Çocuğunuz yanlış cevaplarının hepsinde');
    // Yalnızca çıkarım sorularında çeldirici: yalnızca o tür anılır.
    const ded = evaluate(SLUG, verbalBody((q) => ({ response: q.type === 'deduction' && q.level >= 3 ? q.lure : q.answer, rtMs: 20_000 })));
    expect(ded.student.items[0].text).toContain('seçeneği seçtin. Bu yanlışlar şu yanılgıdan kaynaklanmış olabilir: mantıksal çıkarımda verilen');
    expect(ded.student.items[2].text).toContain('“mantıksal çıkarım” sorularında zorlandın. Bu tür sorularda verilen bilgilerden kesinlikle çıkan sonucu');
    // Yanlışların yarısı çeldirici: %60'a ulaşmadığı için yorumlanmaz.
    const half = evaluate(SLUG, verbalBody((q) => ({ response: q.level === 4 ? q.lure : q.level === 5 ? verbalOther(q) : q.answer, rtMs: 20_000 })));
    expect(half.student.items[0].text).not.toContain('ilk bakışta doğru görünen');
    // Çok hızlı: uyarı ve kart aynı şeyi söyler; hız karşılaştırması yapılmaz.
    const rapid = evaluate(SLUG, verbalBody((q) => ({ response: q.level >= 3 ? verbalOther(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 15 sorunun hepsinde yanlış bir cevap, soru ve seçenekler okunamayacak kadar kısa sürede verilmiş; bu sorularda okunmadan seçilmiş olabilir.');
    expect(rapid.student.items[3].text).toContain('3. düzey ve üstündeki 15 sorunun hepsinde yanlış bir cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin');
    expect(rapid.parent.items[3].text).toContain('bu sorularda okunmadan seçilmiş olabilir.');
    // Kısa sorularda hızlı ama doğru: uyarı yok.
    const quickRight = evaluate(SLUG, verbalBody((q) => ({ response: q.answer, rtMs: q.type === 'analogy' ? 2000 : 15_000 })));
    expect(quickRight.student.cautions).toEqual([]);
    expect(quickRight.student.items[0].text).not.toContain('okumadan');
    // Hepsi doğru, süreler yakın: öneri verilmez.
    const evenRight = evaluate(SLUG, verbalBody((q) => ({ response: q.answer, rtMs: 15_000 })));
    expect(evenRight.student.items[3].text).toContain('Kolay ve zor sorulara birbirine yakın süreler ayırdın. Bu testte');
    // Her düzeyde en çok bir yanlış ama hepsi aynı türde: "hemen hepsi" kartı türler kartıyla çelişmez.
    const oneType = evaluate(SLUG, verbalBody((q) => ({ response: ['sz13', 'sz17', 'sz24'].includes(task.items[q.i].key) ? q.lure : q.answer, rtMs: 15_000 })));
    expect(oneType.student.items[0].text).toContain('Bütün düzeylerde soruların hemen hepsini doğru cevapladın; en zor düzeydeki soruların da çoğunu doğru buldun.');
    expect(oneType.student.items[2].text).toContain('“mantıksal çıkarım” sorularında zorlandın');
    expect(rapid.student.items[3].text).not.toMatch(/zaman ayırdın|yakın süreler/);
    expect(rapid.student.items[0].text).toContain('Bazı soruları okumadan seçmiş olabileceğin için');
    // Hep aynı yer.
    const same = evaluate(SLUG, verbalBody(() => ({ response: 2, rtMs: 9000 })));
    expect(same.parent.cautions.join(' ')).toContain('aynı sıradaki seçenek seçilmiş');
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');
    // 1. düzeyde iki yanlış ama üst düzeyler başarılı.
    const easy = evaluate(SLUG, verbalBody((q) => ({ response: q.level === 1 && verbalRank(q) < 2 ? verbalOther(q) : q.answer, rtMs: 20_000 })));
    expect(easy.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(easy.student.items[1].badge).toBe('5. düzey');
    expect(easy.student.items[1].text).toContain('Daha kolay olan 1. düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi');
    // Bir tür zor: sıralama sorularının hepsi yanlış.
    const ord = evaluate(SLUG, verbalBody((q) => ({ response: q.type === 'ordering' ? verbalOther(q) : q.answer, rtMs: 20_000 })));
    expect(ord.student.items[2].badge).toBe('4 soru türünün 3 tanesinde soruların çoğu doğru');
    expect(ord.student.items[2].text).toContain('“Kelime ilişkileri”, “sınıflama” ve “mantıksal çıkarım” sorularının çoğunu doğru buldun; “sıralama” sorularında zorlandın.');
    expect(ord.parent.items[2].text).toContain('Çocuğunuz “kelime ilişkileri”, “sınıflama” ve “mantıksal çıkarım” sorularının çoğunu');
    // Türde yarısı doğru "çoğu" sayılmaz (3/6).
    const halfType = evaluate(SLUG, verbalBody((q) => ({ response: q.type === 'analogy' && q.level >= 3 ? verbalOther(q) : q.answer, rtMs: 20_000 })));
    expect(halfType.student.items[2].text).toContain('Kelime ilişkileri 3/6');
    expect(halfType.student.items[2].badge).toBe('4 soru türünün 3 tanesinde soruların çoğu doğru');
    // Zor sorulara az zaman, az doğru.
    const giveUp = evaluate(SLUG, verbalBody((q) => ({ response: q.level >= 4 ? verbalOther(q) : q.answer, rtMs: q.level >= 4 ? 9000 : 20_000 })));
    expect(giveUp.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha az zaman ayırdın ve bu sorularda doğru cevaplar azdı.');
    // Hiçbir düzey ölçüte uymuyor (ama rastgele düzeyinin üstünde).
    const low = evaluate(SLUG, verbalBody((q) => ({ response: [1, 3, 4, 2, 0][q.level - 1] > verbalRank(q) ? q.answer : verbalOther(q), rtMs: 20_000 })));
    expect(low.student.items[0].badge).toBe('24 soruda 10 doğru');
    expect(low.student.items[1].badge).toBe('1. düzeyde zorlandın');
    expect(low.parent.items[1].badge).toBe('1. düzeyde zorlandı');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: VerbalCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      kolaydaYanilma: (q) => !(q.level === 1 && verbalRank(q) < 2),
      duz: (q) => verbalRank(q) % 2 === 0,
      sekizDogru: (q) => q.i < VERBAL_CHANCE_MAX,
      dokuzDogru: (q) => q.i < VERBAL_CHANCE_MAX + 1,
      tureGore: (q) => q.type !== 'deduction' && q.type !== 'ordering',
      birTurdeYanilma: (q) => !(q.type === 'deduction' && q.level >= 3 && q.level !== 5) && !(q.i === 23),
    };
    const wrongKinds: Record<string, (q: VerbalCell) => number> = { baska: verbalOther, celdirici: (q) => q.lure };
    const times: Record<string, (q: VerbalCell) => number | null> = {
      artan: (q) => 6000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 7000 * q.level,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = verbalBody((q) => ({ response: samePos ? 2 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const { result } = scoreVerbal(task, (body.data as { blocks: Record<string, VerbalTrialInput[]> }).blocks[task.key]);
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const chance = result.correct <= VERBAL_CHANCE_MAX;
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
              expect(r.items.map((i) => i.title), label).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              // Rastgele düzeyinde doğru: düzey, türler ve üç boyutlu grafik yorumlanmaz; uyarı ve kart aynı şeyi söyler.
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.roadmap!.bars.length, label).toBe(chance ? 0 : 4);
              expect(r.cautions.some((c) => c.includes('rastgele seçen')), label).toBe(chance);
              expect(r.items[0].text.includes('rastgele seçen'), label).toBe(chance);
              // Çok hızlı ve hep aynı yer: uyarı ile çalışma biçimi kartı aynı durumu söyler; hız karşılaştırılmaz.
              const rapidNote = r.cautions.some((c) => c.includes('okunamayacak kadar kısa'));
              expect(rapidNote, label).toBe(verbalRapid(result));
              expect(r.items[3].text.includes('okumaya yetmeyecek kadar kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(verbalSamePosition(result));
              expect(r.items[3].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (rapidNote || sameNote) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/okumadan seçmiş|okunmadan seçilmiş/.test(r.items[0].text), label).toBe(rapidNote || sameNote);
              // Çeldirici yorumu yalnızca yeterince yanlış varsa ve yanlışların en az %60'ı çeldiriciyse.
              expect(r.items[0].text.includes('ilk bakışta doğru görünen'), label).toBe(!chance && verbalLurePattern(result));
              // Ulaşılan düzey kartı ile öne çıkan sayı aynı.
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge?.startsWith('1. düzeyde zorlandı')], label).toEqual(['Belirtilmedi', true]);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
              expect(r.items[3].badge === 'Süre hesaplanamadı', label).toBe(result.medianRt === null);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|seçtin|bulamadın|cevaplamadın)\b/);
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(10 * 2 * 4 * 2);
  }, 180_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, verbalBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, verbalBody(undefined, 3)).parent.items).toHaveLength(4);
    expect(evaluate(SLUG, verbalBody(undefined, 13)).parent.items).toHaveLength(4);
    const r = evaluateReports(SLUG, verbalBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([sozelAkilYurutme.intro.title, ...sozelAkilYurutme.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
    // Yol haritasındaki örnekler testin sorularını ele vermez: hiçbir sorunun doğru cevabı ya da kelime çifti geçmez.
    const example = JSON.stringify(TASK_ROADMAPS[SLUG]);
    for (const [i, it] of task.items.entries()) {
      if (it.type === 'analogy') expect(example, it.key).not.toContain(`${it.stem[0]} — ${it.stem[1]}`);
      if (it.type === 'analogy' || it.type === 'classification') expect(example, it.key).not.toMatch(new RegExp(`[“ ]${it.options[task.answers[i] - 1]}[” ,.]`));
    }
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /SZ_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(SLUG, verbalBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 9000 + 1000 * q.i })));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(4);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(r.student.keyFigures).toHaveLength(3);
    expect(yml).toMatch(/sz_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"lures\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, verbalBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, verbalBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı', () => {
    expect(sozelAkilYurutme.status).toBe('pilot');
    expect(sozelAkilYurutme.licenseStatus).toBe('original');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(sozelAkilYurutme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(sozelAkilYurutme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...sozelAkilYurutme.science, citations: [] });
    const authors = ['Thibaut', 'Evans', 'Ferrer'];
    expect(sozelAkilYurutme.science.citations.map((c) => c.text.split(',')[0])).toEqual(authors);
    for (const a of authors) expect(body, a).toMatch(new RegExp(`${a}(’in| ve| ve ark\\.|,)`));
    expect(TASK_ROADMAPS[SLUG].sources.map((s) => s.url).sort()).toEqual(sozelAkilYurutme.science.citations.map((c) => c.url).sort());
  });
});
