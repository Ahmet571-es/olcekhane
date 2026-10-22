import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { MATRIX_PRACTICE_SPECS, MATRIX_SPECS, sekilAkilYurutme } from '@/content/instruments/sekil-akil-yurutme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { cellKey, cellPrims, describeCell, itemMaxCount, specCells } from '@/lib/instruments/matrix';
import type { MatrixCell, MatrixItem, MatrixReasoningTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { TaskInputError, matrixChance, scoreMatrix, type MatrixTrialInput } from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { matrixBody, matrixRank, type MatrixCellInfo } from './helpers/bodies';
import { itemAttrs, predictAttr, predictSetSize } from './helpers/matrix-solver';
import { schoolWords } from './helpers/school';

const SLUG = 'sekil-akil-yurutme';
const task = sekilAkilYurutme.tasks[0] as MatrixReasoningTask;
const ALL: { item: MatrixItem; answer: number }[] = [
  ...task.practice.map((p) => ({ item: p, answer: p.answer })),
  ...task.items.map((item, i) => ({ item, answer: task.answers[i] })),
];
const SETS = ['lines', 'dots', 'grayDots'] as const;
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])].filter(Boolean).join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
/** Sorunun doğru cevaptan `d` değişiklikle ayrılan ilk seçeneği (1–8). */
const optionAt = (i: number, d: number) => task.optionDistance[i].indexOf(d) + 1;

describe('Şekil akıl yürütme: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; iki alıştırma sorusu; anahtarlar tekil', () => {
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || task.items[i - 1].level <= it.level)).toBe(true);
    expect(new Set(ALL.map((x) => x.item.key)).size).toBe(26);
    expect(task.practice).toHaveLength(2);
    expect(task.practice.every((p) => p.explain.length > 40)).toBe(true);
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    for (const it of ALL.map((x) => x.item)) {
      expect(it.cells, it.key).toHaveLength(8);
      expect(it.options, it.key).toHaveLength(8);
    }
  });

  it('her sorunun tek doğru cevabı var: bağımsız çözücü, tablodaki bütün yorumlarla yalnızca doğru seçeneği bulur', () => {
    for (const { item, answer } of ALL) {
      const ans = item.options[answer - 1];
      const predicted: Record<string, unknown> = {};
      for (const a of itemAttrs(item.cells, item.options)) {
        const p = predictAttr(item.cells, a);
        // Tabloya uyan bütün yorumlar aynı değeri önerir; en az bir yorum satırlara dayanır (yönerge satırları söyler).
        expect(p.values, `${item.key} ${a}: ${p.rules.join('; ')}`).toEqual([ans[a]]);
        expect(p.rules.some((r) => r.startsWith('satır')), `${item.key} ${a}`).toBe(true);
        predicted[a] = p.values[0];
        if ((SETS as readonly string[]).includes(a)) {
          const sizes = predictSetSize(item.cells, a as (typeof SETS)[number]);
          expect(sizes.every((s) => s === (ans[a] as number[]).length), `${item.key} ${a} öğe sayısı`).toBe(true);
        }
      }
      // Önerilen parça seçeneklerden yalnızca birine, doğru cevaba eşittir; tablonun dokuzuncu parçası da odur.
      expect(item.options.filter((o) => cellKey(o) === cellKey(predicted as MatrixCell)).map((o) => item.options.indexOf(o) + 1), item.key).toEqual([answer]);
      const spec = [...MATRIX_SPECS, ...MATRIX_PRACTICE_SPECS].find((s) => s.key === item.key)!;
      expect(cellKey(specCells(spec)[8]), item.key).toBe(cellKey(ans));
    }
  });

  it('kural türleri soruların gerçek kurallarıyla uyumlu', () => {
    for (const { item } of ALL) {
      const rules = itemAttrs(item.cells, item.options).flatMap((a) => predictAttr(item.cells, a).rules.map((r) => `${a} ${r}`));
      const has = (re: RegExp) => rules.some((r) => re.test(r));
      if (item.rule === 'xor') expect(has(/(lines|dots) satır: ortak olanı silme/), item.key).toBe(true);
      if (item.rule === 'addition') expect(has(/satır: (birleşim|toplama|çıkarma)/), item.key).toBe(true);
      if (item.rule === 'distribution') expect(has(/satır: üçlü dağılım/), item.key).toBe(true);
      if (item.rule === 'progression') expect(has(/satır: (düzenli değişim|dönme)/), item.key).toBe(true);
      if (item.rule === 'constant') {
        // Tabloda değişen bir özellik satır boyunca aynı kalır; toplama, küme işlemi ya da dönme yoktur.
        const varying = itemAttrs(item.cells, item.options).filter((a) => new Set(item.cells.map((c) => JSON.stringify(c[a]))).size > 1);
        expect(varying.some((a) => predictAttr(item.cells, a).rules.some((r) => r.startsWith('satır: değişmeyen'))), item.key).toBe(true);
        expect(has(/satır: (toplama|çıkarma|birleşim|ortak|dönme)/), item.key).toBe(false);
      }
    }
    // Her kural türünde en az üç soru var.
    for (const rule of ['constant', 'progression', 'distribution', 'addition', 'xor']) {
      expect(task.items.filter((it) => it.rule === rule).length, rule).toBeGreaterThanOrEqual(3);
    }
  });

  it('seçenekler: sekizi de farklı; doğru cevaptan 1, 2 ve 3 değişiklikle ayrılanlar 3, 3 ve 1 tane', () => {
    for (const [i, item] of task.items.entries()) {
      expect(new Set(item.options.map(cellKey)).size, item.key).toBe(8);
      expect([...task.optionDistance[i]].sort(), item.key).toEqual([0, 1, 1, 1, 2, 2, 2, 3]);
      expect(task.optionDistance[i].indexOf(0) + 1, item.key).toBe(task.answers[i]);
    }
  });

  it('seçeneklere bakarak (tabloyu çözmeden) doğru cevap bulunamaz', () => {
    for (const { item, answer } of ALL) {
      const ans = item.options[answer - 1];
      // Her özellikte doğru cevabın değerini taşıyan seçenekler ya hepsi (değişmeyen özellik) ya da en çok yarısı.
      for (const a of itemAttrs(item.cells, item.options)) {
        const same = item.options.filter((o) => JSON.stringify(o[a]) === JSON.stringify(ans[a])).length;
        expect(same === 8 || same <= 4, `${item.key} ${a}`).toBe(true);
      }
      // Tek tek eklenip silinen çizgi ve noktalarda: her öğe seçeneklerin ya hepsinde aynı ya da tam yarısında var.
      for (const a of SETS) {
        if (!item.options.every((o) => o[a]) || !(item.key.startsWith('sa15') || item.key.startsWith('sa18') || item.key.startsWith('sa20') || item.key.startsWith('sa23'))) continue;
        for (let e = 0; e < 8; e++) {
          const k = item.options.filter((o) => (o[a] as number[]).includes(e)).length;
          expect([0, 4, 8], `${item.key} ${a} ${e}`).toContain(k);
        }
      }
      // Ötekilere en çok benzeyen seçeneği seçen bir tahmin yolu doğru cevabı ayırt edemez: benzerlik toplamları eşit.
      const diff = (x: MatrixCell, y: MatrixCell) => (Object.keys({ ...x, ...y }) as (keyof MatrixCell)[]).filter((k) => JSON.stringify(x[k]) !== JSON.stringify(y[k])).length;
      const sums = item.options.map((o) => item.options.reduce((s, p) => s + diff(o, p), 0));
      expect(Math.min(...sums), item.key).toBe(sums[answer - 1]);
      expect(sums.filter((x) => x === sums[answer - 1]).length, item.key).toBeGreaterThan(1);
    }
  });

  it('doğru cevabın yeri dengeli: her sıra üç kez, art arda aynı sıra yok', () => {
    for (let p = 1; p <= 8; p++) expect(task.answers.filter((a) => a === p).length, String(p)).toBe(3);
    expect(task.answers.every((a, i) => i === 0 || task.answers[i - 1] !== a)).toBe(true);
  });

  it('çizim: bütün şekiller parçanın içinde; şekiller birbirine değmez; her seçeneğin sözlü anlatımı ayrı', () => {
    for (const { item } of ALL) {
      const max = itemMaxCount(item);
      for (const cell of [...item.cells, ...item.options]) {
        const prims = cellPrims(cell, max);
        expect(prims.length, item.key).toBeGreaterThan(0);
        for (const p of prims) {
          const pts: [number, number][] =
            p.kind === 'circle'
              ? [[p.cx - p.r, p.cy - p.r], [p.cx + p.r, p.cy + p.r]]
              : p.kind === 'poly'
                ? p.points
                : [[p.x1, p.y1], [p.x2, p.y2]];
          for (const [x, y] of pts) {
            expect(x, item.key).toBeGreaterThanOrEqual(3);
            expect(x, item.key).toBeLessThanOrEqual(97);
            expect(y, item.key).toBeGreaterThanOrEqual(3);
            expect(y, item.key).toBeLessThanOrEqual(97);
          }
        }
        // Birden çok şeklin her birini saran çemberler (kenar kalınlığı ve 2 birim boşlukla) birbirine değmez.
        if ((cell.count ?? 1) > 1) {
          const discs = prims.map((p) => {
            if (p.kind === 'circle') return { x: p.cx, y: p.cy, r: p.r + p.sw / 2 };
            const pts = p.kind === 'poly' ? p.points : ([[p.x1, p.y1], [p.x2, p.y2]] as [number, number][]);
            const x = pts.reduce((s, q) => s + q[0], 0) / pts.length;
            const y = pts.reduce((s, q) => s + q[1], 0) / pts.length;
            return { x, y, r: Math.max(...pts.map((q) => Math.hypot(q[0] - x, q[1] - y))) + p.sw / 2 };
          });
          for (let i = 0; i < discs.length; i++)
            for (let j = i + 1; j < discs.length; j++) {
              const a = discs[i];
              const b = discs[j];
              expect(Math.hypot(a.x - b.x, a.y - b.y), item.key).toBeGreaterThan(a.r + b.r + 2);
            }
        }
      }
      expect(new Set(item.options.map(describeCell)).size, item.key).toBe(8);
      expect(item.cells.every((c) => describeCell(c).length > 2)).toBe(true);
    }
  });

  it('sorular sabit: sorular ya da üretim kuralı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, distance: task.optionDistance }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: sekilAkilYurutme.version, hash }).toEqual({ version: 2, hash: SORU_IZI });
  });
});

/** Soruların izi (sürüm 2): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = 'b5889e3e11e0f1cd';

describe('Şekil akıl yürütme: puanlama', () => {
  const all = (fn: (i: number) => Partial<MatrixTrialInput> = () => ({})): MatrixTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 10_000, ...fn(index) }));

  it('hatasız: 24 doğru, bütün düzeyler tam, 5. düzeye ulaşılır', () => {
    const { result } = scoreMatrix(task, all());
    expect(result.correct).toBe(24);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['4/4', '5/5', '5/5', '5/5', '5/5']);
    expect(result.reached).toBe(5);
    expect(result.rules.map((r) => r.rule)).toEqual(['constant', 'progression', 'distribution', 'addition', 'xor']);
    expect(result.rules.reduce((s, r) => s + r.n, 0)).toBe(24);
    expect(result.wrong).toBe(0);
    expect(result.medianRt).toBe(10_000);
  });

  it('ulaşılan düzey: en az %60 doğru olan en yüksek düzey; o düzeye kadarki sorularda da en az %60 doğru', () => {
    // Her düzeyde ilk k soru doğru, ötekiler yanlış.
    const counts = (ks: number[]) => (i: number) => {
      const lv = task.items[i].level;
      return matrixRank({ level: lv, i }) < ks[lv - 1] ? {} : { response: optionAt(i, 1) };
    };
    const reached = (ks: number[]) => scoreMatrix(task, all(counts(ks))).result.reached;
    expect(reached([4, 5, 5, 5, 5])).toBe(5);
    expect(reached([4, 5, 5, 2, 2])).toBe(3);
    expect(reached([4, 5, 3, 2, 2])).toBe(3); // 3/5 = %60 yeterli
    expect(reached([4, 5, 2, 2, 2])).toBe(2); // 2/5 = %40 yetmez
    // Alt düzeydeki birkaç yanlış, üst düzeyler çözüldüyse düzeyi düşürmez.
    expect(reached([2, 5, 5, 0, 0])).toBe(3);
    expect(reached([4, 2, 5, 5, 5])).toBe(5);
    // Üst düzeydeki şans eseri doğrular düzeyi yükseltmez: o düzeye kadarki sorularda %60'tan az doğru.
    expect(reached([4, 1, 1, 1, 3])).toBe(1);
    expect(reached([1, 2, 2, 2, 1])).toBe(0);
  });

  it('yakın hatalar, çok hızlı cevaplar ve hep aynı sıra sayılır', () => {
    const near = scoreMatrix(task, all((i) => (task.items[i].level >= 4 ? { response: optionAt(i, 1) } : {}))).result;
    expect([near.wrong, near.nearMisses]).toEqual([10, 10]);
    const far = scoreMatrix(task, all((i) => (task.items[i].level >= 4 ? { response: optionAt(i, 3) } : {}))).result;
    expect([far.wrong, far.nearMisses]).toEqual([10, 0]);
    // Çok hızlı cevap yalnızca yanlış cevaplarda sayılır: hızlı ve doğru cevap bakılmadan seçilmiş sayılmaz.
    const rapid = scoreMatrix(task, all((i) => (task.items[i].level >= 3 ? { rtMs: 1200, response: optionAt(i, 2) } : {}))).result;
    expect([rapid.rapid, rapid.rapidOf]).toEqual([15, 15]);
    const quickRight = scoreMatrix(task, all((i) => (task.items[i].level >= 3 ? { rtMs: 1200 } : {}))).result;
    expect(quickRight.rapid).toBe(0);
    const easyFast = scoreMatrix(task, all((i) => (task.items[i].level <= 2 ? { rtMs: 1200 } : {}))).result;
    expect(easyFast.rapid).toBe(0);
    expect(scoreMatrix(task, all(() => ({ response: 1 }))).result.samePosition).toBe(24);
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı soru iki kez gelirse ilki sayılır', () => {
    const ok = all();
    expect(() => scoreMatrix(task, ok.slice(1))).toThrow(TaskInputError);
    expect(() => scoreMatrix(task, ok.map((t, i) => (i === 3 ? { ...t, response: 0 } : t)))).toThrow(TaskInputError);
    expect(() => scoreMatrix(task, ok.map((t, i) => (i === 3 ? { ...t, response: 9 } : t)))).toThrow(TaskInputError);
    expect(() => scoreMatrix(task, ok.map((t, i) => (i === 3 ? { ...t, response: 2.5 } : t)))).toThrow(TaskInputError);
    expect(() => scoreMatrix(task, [...ok, { index: 24, response: 1, rtMs: 100 }])).toThrow(TaskInputError);
    expect(() => scoreMatrix(task, ok.map((t, i) => (i === 3 ? { ...t, rtMs: -1 } : t)))).toThrow(TaskInputError);
    expect(scoreMatrix(task, [...ok, { index: 0, response: (task.answers[0] % 8) + 1, rtMs: 100 }]).result.correct).toBe(24);
    // Tarayıcıya giden test bilgisinde cevap anahtarı yoktur; anahtarsız puanlama yapılamaz.
    expect(() => scoreMatrix({ ...task, answers: [], optionDistance: [] }, ok)).toThrow(TaskInputError);
    const bad = matrixBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Şekil akıl yürütme: rapor', () => {
  it('hatasız: düzeylere göre grafik, dört kart, öne çıkan sayılar ve kural türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, matrixBody((q) => ({ choice: q.answer, rtMs: 8000 + 3000 * q.level })));
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
    expect(r.student.items[0].text).toContain('Bütün soruları doğru cevapladın');
    expect(r.student.items[1].text).toContain('5. düzey testin en zor düzeyiydi.');
    expect(r.student.items[3].text).toContain('Zor sorulara kolay sorulardan daha çok zaman ayırdın');
    expect(r.student.cautions).toEqual([]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.value, b.valueLabel])).toEqual([
      ['Değişmeyen özellik', 100, '3/3'],
      ['Düzenli değişim', 100, '5/5'],
      ['Üçlü dağılım', 100, '9/9'],
      ['Ekleme ve çıkarma', 100, '4/4'],
      ['Ortak olanı silme', 100, '3/3'],
    ]);
    expect(rm.barsTitle).toBe('Kural türlerine göre sonucun');
    expect(r.parent.roadmap!.barsTitle).toBe('Kural türlerine göre sonuç');
    expect(rm.standout.map((s) => s.title)).toEqual(['Doğru cevaplar', 'Ulaşılan düzey', 'Kural türleri', 'Çalışma biçimi']);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(text(r.parent)).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın)\b/);
  });

  it('örnek: ilk üç düzey tam, sonra zorlanma; ulaşılan düzey, zorlanılan düzey ve kural türleri anlatılır', () => {
    const r = evaluate(SLUG, matrixBody());
    expect(r.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(r.student.items[0].text).toContain('Sorular zorlaştıkça doğru cevapların azaldı');
    expect(r.student.items[1].badge).toBe('3. düzey');
    expect(r.student.items[1].text).toContain('1–3. düzeylerdeki soruların hepsini doğru cevapladın');
    expect(r.student.items[1].text).toContain('4. düzeydeki 5 sorunun 3 tanesini doğru bulamadın. Bu düzeydeki sorularda şu gerekiyordu: parçaları üst üste koyma');
    expect(r.student.items[1].text).toContain('en az %60’ını doğru bulmak gerekir');
    expect(r.parent.items[1].text).toContain('Çocuğunuz 4. düzeydeki 5 sorunun 3 tanesini doğru bulamadı.');
    expect(r.parent.items[0].text).toContain('(Carpenter, Just ve Shell, 1990)');
    expect(r.student.items[2].text).toContain('“ekleme ve çıkarma” ve “ortak olanı silme” kurallarında zorlandın. “Ekleme ve çıkarma” kuralında üçüncü parçanın');
    // Kural türlerinin düzeylerle iç içe olduğu, soruların gerçek düzeylerine göre söylenir.
    expect(r.student.items[2].text).toContain('ör. “değişmeyen özellik” soruları yalnızca 1. düzeyde, “ortak olanı silme” soruları 4. ve 5. düzeylerde');
    expect(task.items.filter((it) => it.rule === 'constant').every((it) => it.level === 1)).toBe(true);
  });

  it('durumlar: rastgele düzey, kolay sorularda yanılma, düz profil; yakın hata; çok hızlı; hep aynı sıra', () => {
    // Bütün sorularda yanlış (en uzak seçenek): rastgele seçimle de ulaşılabilecek sonuç, düzey ve kurallar yorumlanmaz.
    const chance = evaluate(SLUG, matrixBody((q) => ({ choice: optionAt(q.i, 3), rtMs: 9000 })));
    expect(chance.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(chance.student.items[0].text).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(chance.parent.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(chance.student.roadmap!.bars).toEqual([]);
    // 1. düzeyde iki yanlış ama 3. düzey başarılı: kolay sorularda dikkat dağılmış olabilir.
    const easy = evaluate(SLUG, matrixBody((q) => ({ choice: q.level === 1 && matrixRank(q) < 2 ? optionAt(q.i, 1) : q.answer, rtMs: 15_000 })));
    expect(easy.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın ama daha zor düzeylerdeki soruların hepsini doğru buldun');
    expect(easy.student.items[1].badge).toBe('5. düzey');
    expect(easy.student.items[1].text).toContain('Daha kolay olan 1. düzeydeki yanlışların bu sonucu değiştirmedi');
    // Hiçbir düzeyde soruların çoğu doğru değil (ama rastgele seçimden fazla doğru): düzey belirtilmez.
    const low = evaluate(SLUG, matrixBody((q) => ({ choice: matrixRank(q) < [1, 2, 2, 2, 1][q.level - 1] ? q.answer : optionAt(q.i, 2), rtMs: 15_000 })));
    expect(low.student.items[1].badge).toBe('Düzey belirtilmedi');
    expect(low.parent.items[1].badge).toBe('Düzey belirtilmedi');
    expect(low.student.items[1].text).toContain('En kolay düzeydeki 4 sorunun 1 tanesini doğru buldun.');
    expect(low.student.keyFigures[1]).toEqual({ label: 'Ulaşılan düzey', value: 'Belirtilmedi', note: 'ölçüte ulaşılmadı' });
    // Yakın hatalar: 4. ve 5. düzeyin hepsinde doğru cevaptan tek özellikte ayrılan seçenek.
    const near = evaluate(SLUG, matrixBody((q) => ({ choice: q.level >= 4 ? optionAt(q.i, 1) : q.answer, rtMs: 15_000 })));
    expect(near.student.items[0].text).toContain('Yanlış cevaplarının hepsinde seçtiğin parça doğru cevaptan yalnızca bir özellikte ayrılıyordu');
    const far = evaluate(SLUG, matrixBody((q) => ({ choice: q.level >= 4 ? optionAt(q.i, 3) : q.answer, rtMs: 15_000 })));
    expect(far.student.items[0].text).not.toContain('bir özellikte ayrılıyordu');
    // Zor sorularda çok hızlı: uyarı ve kartlar aynı şeyi söyler; hız karşılaştırması yapılmaz.
    const rapid = evaluate(SLUG, matrixBody((q) => ({ choice: q.level >= 3 ? optionAt(q.i, 2) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('15 sorunun hepsinde yanlış bir cevap 2,5 saniyeden kısa sürede');
    expect(rapid.student.items[3].text).toContain('15 sorunun hepsine 2,5 saniyeden kısa sürede yanlış cevap verdin');
    expect(rapid.student.items[3].text).not.toMatch(/zaman ayırdın|yakın sürelerde/);
    // Bir saniyeden kısa tipik süre "0 saniye" diye yazılmaz.
    const blink = evaluate(SLUG, matrixBody((q) => ({ choice: q.answer, rtMs: 300 })));
    expect(blink.student.items[3].badge).toBe('Soru başına tipik süre bir saniyeden kısa');
    expect(blink.student.items[3].text).toContain('Bir soruyu cevaplaman tipik olarak bir saniyeden kısa sürdü.');
    expect(blink.student.keyFigures[2].value).toBe('bir saniyeden kısa');
    // Hep aynı sıra.
    const same = evaluate(SLUG, matrixBody(() => ({ choice: 1, rtMs: 4000 })));
    expect(same.parent.cautions.join(' ')).toContain('aynı sıradaki seçenek seçilmiş');
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');
    // Zor düzeylerde kolaylardan daha çok doğru: "birbirine yakın" denmez.
    const upside = evaluate(SLUG, matrixBody((q) => ({ choice: q.level === 2 && matrixRank(q) < 4 ? optionAt(q.i, 2) : q.answer, rtMs: 15_000 })));
    expect(upside.student.items[0].text).toContain('Zor düzeylerde kolay düzeylerdekinden daha çok doğru cevap verdin');
    // Kolay sorularda yanlış yokken "kolay sorulardaki yanlışlar" denmez.
    const dip = evaluate(SLUG, matrixBody((q) => ({ choice: q.level === 3 && matrixRank(q) < 4 ? optionAt(q.i, 2) : q.answer, rtMs: 15_000 })));
    expect(dip.student.items[0].text).toContain('birbirine yakındı');
    expect(dip.student.items[0].text).not.toContain('Kolay sorulardaki yanlışlar');
    // Zor sorular hızlı ve doğru: "yakın sürelerde" denmez.
    const quickHard = evaluate(SLUG, matrixBody((q) => ({ choice: q.answer, rtMs: q.level <= 2 ? 26_000 : 9000 })));
    expect(quickHard.student.items[3].text).toContain('Zor sorularda kolay sorulardakinden daha kısa sürede cevap verdin ve bu soruların çoğunu yine doğru buldun.');
    // Hiçbir düzey ölçüte uymuyorsa bunun nedeni ölçütle söylenir (bir düzeyde soruların çoğu doğru olsa bile).
    const none = evaluate(SLUG, matrixBody((q) => ({ choice: matrixRank(q) < [2, 3, 2, 1, 0][q.level - 1] ? q.answer : optionAt(q.i, 2), rtMs: 15_000 })));
    expect(none.student.items[1].badge).toBe('Düzey belirtilmedi');
    expect(none.student.items[1].text).toContain('hiçbir düzeyde buna ulaşılmadığı için düzey belirtilmedi. 2. düzeydeki soruların çoğunu doğru bulmana rağmen');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: MatrixCellInfo) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkDuzey: (q) => q.level === 1,
      kolaydaYanilma: (q) => !(q.level === 1 && matrixRank(q) < 2),
      atlama: (q) => !(q.level === 2 && matrixRank(q) < 3),
      duz: (q) => matrixRank(q) % 2 === 0,
      altiDogru: (q) => q.i < 6,
      yediDogru: (q) => q.i < 7,
      sondanBes: (q) => q.i >= 19,
    };
    const wrongKinds = [1, 2, 3];
    const times: Record<string, (q: MatrixCellInfo) => number | null> = {
      artan: (q) => 5000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 7000 * q.level,
      sabit: () => 20_000,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const wk of wrongKinds) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = matrixBody((q) => ({ choice: samePos ? 3 : correct(q) ? q.answer : optionAt(q.i, wk), rtMs: rt(q) }), 7);
            const label = `${cName}/${wk}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const { result } = scoreMatrix(task, (body.data as { blocks: Record<string, MatrixTrialInput[]> }).blocks[task.key]);
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
              expect(r.items.map((i) => i.title), label).toEqual(['Doğru cevaplar', 'Ulaşılan düzey', 'Kural türleri', 'Çalışma biçimi']);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              const chance = matrixChance(result);
              // Uyarı ile kart aynı durumu söyler.
              expect(r.cautions.some((c) => c.includes('rastgele seçen')), label).toBe(chance);
              expect(r.items[0].text.includes('rastgele seçen'), label).toBe(chance);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('2,5 saniyeden kısa'));
              expect(r.items[3].text.includes('2,5 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek'));
              expect(r.items[3].text.includes('aynı sıradaki seçeneği'), label).toBe(sameNote);
              // Bakılmadan seçilmiş olabilecek sorular varsa hız karşılaştırması yapılmaz.
              if (rapidNote || sameNote) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın sürelerde/);
              // Ulaşılan düzey kartı ile öne çıkan sayı aynı.
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge], label).toEqual(['Belirtilmedi', 'Düzey belirtilmedi']);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              // Süre yoksa çalışma biçimi hesaplanmaz.
              expect(r.items[3].badge === 'Süre hesaplanamadı', label).toBe(result.medianRt === null);
              // Üç boyutlu grafik yalnızca yorumlanan sonuçta.
              expect(r.roadmap!.bars.length, label).toBe(chance ? 0 : 5);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|seçtin|bastın)\b/);
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(11 * 3 * 5 * 2);
  }, 120_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, matrixBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, matrixBody(undefined, 3)).parent.items).toHaveLength(4);
    expect(evaluate(SLUG, matrixBody(undefined, 13)).parent.items).toHaveLength(4);
    const r = evaluateReports(SLUG, matrixBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([sekilAkilYurutme.intro.title, ...sekilAkilYurutme.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /SA_GOVDE=.*?s="(\d+)"/.exec(yml);
    expect(m?.[1]).toBe(task.answers.join(''));
    const r = evaluate(SLUG, matrixBody((q) => ({ choice: Number(m![1][q.i]), rtMs: 9000 + 1000 * q.i })));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(5);
    expect(r.student.keyFigures).toHaveLength(3);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, matrixBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, matrixBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı', () => {
    expect(sekilAkilYurutme.status).toBe('pilot');
    expect(sekilAkilYurutme.licenseStatus).toBe('original');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(sekilAkilYurutme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    // "Raven" ticari bir markadır: testin adında ve tanıtımında geçmez (yalnızca bilim kartında kaynak olarak anılır).
    expect(`${sekilAkilYurutme.name} ${sekilAkilYurutme.tagline} ${sekilAkilYurutme.description}`).not.toMatch(/raven/i);
    expect(sekilAkilYurutme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    // Bilim kartında anılan her çalışma kaynaklarda yer alır ve her kaynak bilim kartında anılır.
    const body = JSON.stringify({ ...sekilAkilYurutme.science, citations: [] });
    const authors = ['Carpenter', 'Raven', 'Matzen', 'Hu', 'Laurence', 'Ferrer', 'Brouwers'];
    expect(sekilAkilYurutme.science.citations.map((c) => c.text.split(',')[0])).toEqual(authors);
    for (const a of authors) expect(body, a).toMatch(new RegExp(`${a}(’in| ve| ve ark\\.|,)`));
  });
});
