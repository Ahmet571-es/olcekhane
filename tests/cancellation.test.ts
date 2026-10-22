import { describe, expect, it } from 'vitest';
import { harfIsaretleme } from '@/content/instruments/harf-isaretleme';
import { cancellationSheet, seedFrom } from '@/lib/instruments/cancellation';
import type { CancellationTask } from '@/lib/instruments/types';
import { buildReport, type ReportScore } from '@/lib/reports/build';
import { TaskInputError, scoreCancellation, taskQualityNotes, type CancellationSectionInput } from '@/lib/scoring/tasks';

const task = harfIsaretleme.tasks[0] as CancellationTask;
const N = task.rows * task.columns;
const ids = ['0b6f1c2e-6f3e-4b8a-9a55-5d1f0c8e2a11', '7d2e9a40-1c3b-4f6d-8e2a-3b5c7d9e1f20', 'e4a1b2c3-d4e5-4f60-8a7b-9c0d1e2f3a4b'];

/**
 * Bir bölümde ilk `upTo` harfi tarar: hedeflerden her `skipEvery`'inciyi atlayıp gerisini işaretler (son
 * taranan harf her zaman işaretlenir) ve baştaki `wrong` çeldiriciyi de işaretler.
 */
function section(sheet: string[][], index: number, opts: { upTo: number; skipEvery?: number; wrong?: number; ms?: number }): CancellationSectionInput {
  const letters = sheet[index];
  const marks: number[] = [];
  let seen = 0;
  for (let i = 0; i < opts.upTo; i++) {
    if (!task.targets.includes(letters[i])) continue;
    seen++;
    if (opts.skipEvery && seen % opts.skipEvery === 0 && i !== opts.upTo - 1) continue;
    marks.push(i);
  }
  // Yanlış işaretler: taranan kısımdaki ilk çeldiriciler.
  let w = opts.wrong ?? 0;
  for (let i = 0; i < opts.upTo && w > 0; i++) {
    if (!task.targets.includes(letters[i])) {
      marks.push(i);
      w--;
    }
  }
  marks.sort((a, b) => a - b);
  // Taranan kısmın son harfi işaretli olsun: taranan harf sayısı kesin bilinsin.
  if (marks[marks.length - 1] !== opts.upTo - 1) throw new Error('Test verisi: son taranan harf bir hedef olmalı.');
  return { index, response: { marks, times: marks.map((_, k) => 500 + k * 400), unmarks: 0 }, rtMs: opts.ms ?? task.sectionMs };
}

/** Sayfada `approx` konumundan sonraki ilk hedefin konumu + 1 (taranan harf sayısı). */
function upToTarget(letters: string[], approx: number): number {
  let i = approx;
  while (!task.targets.includes(letters[i])) i++;
  return i + 1;
}

describe('Harf işaretleme sayfaları', () => {
  it('her bölümde hedef sayısı, harf dağılımı ve satır düzeni sabit', () => {
    for (const id of ids) {
      const sheet = cancellationSheet(task, id);
      expect(sheet).toHaveLength(task.sections);
      for (const sec of sheet) {
        expect(sec).toHaveLength(N);
        const counts = new Map<string, number>();
        for (const l of sec) counts.set(l, (counts.get(l) ?? 0) + 1);
        // Satırların üçte birinde 1, üçte birinde 2, üçte birinde 3 hedef: 20 + 40 + 60 = 120.
        const perTarget = task.targets.map((t) => counts.get(t) ?? 0);
        expect(perTarget.reduce((a, b) => a + b, 0)).toBe(120);
        expect(new Set(perTarget)).toEqual(new Set([30]));
        const rowCounts = Array.from({ length: task.rows }, (_, r) =>
          sec.slice(r * task.columns, (r + 1) * task.columns).filter((l) => task.targets.includes(l)).length,
        );
        for (const k of task.targetsPerRow) expect(rowCounts.filter((c) => c === k)).toHaveLength(task.rows / task.targetsPerRow.length);
        // Çeldiriciler eşit sıklıkta; ğ ve alfabe dışı harf yok.
        for (const d of task.distractors) {
          expect(counts.get(d) ?? 0).toBeGreaterThanOrEqual(19);
          expect(counts.get(d) ?? 0).toBeLessThanOrEqual(21);
        }
        expect(counts.has('ğ')).toBe(false);
        for (const l of counts.keys()) expect([...task.targets, ...task.distractors]).toContain(l);
        // Yan yana aynı çeldirici yok.
        for (let i = 1; i < sec.length; i++) {
          if (!task.targets.includes(sec[i])) expect(sec[i]).not.toBe(sec[i - 1]);
        }
      }
    }
  });

  it('aynı uygulama için hep aynı, farklı uygulamalar ve bölümler için farklı', () => {
    const a = cancellationSheet(task, ids[0]);
    expect(cancellationSheet(task, ids[0])).toEqual(a);
    const b = cancellationSheet(task, ids[1]);
    expect(b[0].join('')).not.toBe(a[0].join(''));
    expect(new Set(a.map((s) => s.join(''))).size).toBe(task.sections);
    // Üretim kuralının sürümü tohuma girer.
    expect(seedFrom(`${ids[0]}:${task.key}:1`)).not.toBe(seedFrom(`${ids[0]}:${task.key}:2`));
  });

  it('alıştırma satırları yalnızca geçerli harflerden oluşur ve hedef içerir', () => {
    const flat = task.practice.flat();
    for (const row of task.practice) expect(row).toHaveLength(task.columns);
    for (const l of flat) expect([...task.targets, ...task.distractors]).toContain(l);
    expect(flat.filter((l) => task.targets.includes(l)).length).toBeGreaterThanOrEqual(5);
  });
});

describe('Harf işaretleme puanlama', () => {
  const sheet = cancellationSheet(task, ids[0]);

  it('bulunan, atlanan ve yanlış işaretleri taranan kısma göre sayar', () => {
    const upTo = sheet.map((s) => upToTarget(s, 200));
    const input = [0, 1, 2, 3].map((i) => section(sheet, i, { upTo: upTo[i], skipEvery: 10, wrong: 2 }));
    const { result, sections } = scoreCancellation(task, sheet, input);
    for (const [i, s] of sections.entries()) {
      const targets = sheet[i].slice(0, upTo[i]).filter((l) => task.targets.includes(l)).length;
      expect(s.processed).toBe(upTo[i]);
      expect(s.targets).toBe(targets);
      expect(s.omissions).toBe(Math.floor((targets - 1) / 10));
      expect(s.hits + s.omissions).toBe(targets);
      expect(s.commissions).toBe(2);
      expect(s.net).toBe(s.hits - 2);
    }
    expect(result.processed).toBe(upTo.reduce((a, b) => a + b, 0));
    expect(result.commissions).toBe(8);
    // Dört bölüm × 90 sn = 6 dakika.
    expect(result.perMinute).toBeCloseTo(result.processed / 6, 1);
    expect(result.hitRate).toBeCloseTo(result.hits / (result.hits + result.omissions), 3);
    expect(result.falseAlarmRate).toBeCloseTo(8 / (result.processed - sections.reduce((a, s) => a + s.targets, 0)), 3);
    expect(result.ceiling).toBe(false);
  });

  it('dikkatin sürdürülmesi: son bölümlerin ilk bölümlere göre değişimi', () => {
    const at = (i: number, approx: number) => section(sheet, i, { upTo: upToTarget(sheet[i], approx) });
    const falling = scoreCancellation(task, sheet, [at(0, 300), at(1, 300), at(2, 150), at(3, 150)]).result;
    const nets = falling.sections.map((s) => s.net);
    const expected = ((nets[2] + nets[3]) / 2 - (nets[0] + nets[1]) / 2) / ((nets[0] + nets[1]) / 2) * 100;
    expect(falling.sustainChange).toBeCloseTo(expected, 0);
    expect(falling.sustainChange!).toBeLessThan(-30);

    const empty = (i: number): CancellationSectionInput => ({ index: i, response: { marks: [], times: [], unmarks: 0 }, rtMs: task.sectionMs });
    const none = scoreCancellation(task, sheet, [empty(0), empty(1), at(2, 100), at(3, 100)]).result;
    expect(none.sustainChange).toBeNull();
    expect(none.sections[0].processed).toBe(0);
  });

  it('yanlışlıkla tek dokunuş taranan kısmı uzatmaz; satır atlayıp devam etmek ise taranan kısma girer', () => {
    const upTo = sheet.map((s) => upToTarget(s, 120));
    const clean = scoreCancellation(task, sheet, [0, 1, 2, 3].map((i) => section(sheet, i, { upTo: upTo[i] }))).result;
    // Her bölümde sayfanın çok ilerisine (ör. telefonda kaydırırken) bir ya da iki yanlışlıkla dokunuş.
    const stray = (i: number, extra: number[]): CancellationSectionInput => {
      const s = section(sheet, i, { upTo: upTo[i] });
      const marks = [...s.response.marks, ...extra].sort((a, b) => a - b);
      return { ...s, response: { marks, times: marks.map((_, k) => 500 + k * 400), unmarks: 0 } };
    };
    const tapped = scoreCancellation(task, sheet, [stray(0, [550]), stray(1, [400, 401]), stray(2, [N - 1]), stray(3, [300])]).result;
    expect(tapped.processed).toBe(clean.processed);
    expect(tapped.hitRate).toBe(clean.hitRate);
    expect(tapped.perMinute).toBe(clean.perMinute);
    expect(tapped.commissions).toBe(clean.commissions);
    expect(tapped.ceiling).toBe(false);
    expect(tapped.strays).toBe(5);
    expect(tapped.sections.map((s) => s.strays)).toEqual([1, 2, 1, 1]);

    // Dört satır atlayıp hedefleri işaretlemeye devam eden: sonraki öbek gerçek çalışmadır.
    const skip = section(sheet, 0, { upTo: upToTarget(sheet[0], 200) });
    const marks = skip.response.marks.filter((m) => m < 60 || m >= 100);
    const skipped = scoreCancellation(task, sheet, [{ ...skip, response: { marks, times: marks.map((_, k) => 500 + k * 400), unmarks: 0 } }, ...[1, 2, 3].map((i) => section(sheet, i, { upTo: upTo[i] }))]).result;
    expect(skipped.sections[0].processed).toBe(upToTarget(sheet[0], 200));
    expect(skipped.sections[0].omissions).toBeGreaterThan(0);
    expect(skipped.sections[0].strays).toBe(0);
  });

  it('dikkatin sürdürülmesi: küçük farklar ölçümün oynaklığı içinde kalır', () => {
    const at = (i: number, approx: number) => section(sheet, i, { upTo: upToTarget(sheet[i], approx) });
    // Az işaret yapan küçük öğrenci: ilk yarı ~120, ikinci yarı ~100 harf (%15'ten büyük ama rastlantı sınırında).
    const small = scoreCancellation(task, sheet, [at(0, 120), at(1, 120), at(2, 100), at(3, 100)]).result;
    expect(Math.abs(small.sustainChange!)).toBeGreaterThan(15);
    expect(small.sustainClear).toBe(false);
    const big = scoreCancellation(task, sheet, [at(0, 300), at(1, 300), at(2, 150), at(3, 150)]).result;
    expect(big.sustainClear).toBe(true);
  });

  it('son satıra ulaşılırsa tavan etkisi işaretlenir', () => {
    const last = sheet[0].reduce((acc, l, i) => (task.targets.includes(l) ? i : acc), -1);
    expect(last).toBeGreaterThan(N - task.columns - 1);
    const input = [section(sheet, 0, { upTo: last + 1 }), ...[1, 2, 3].map((i) => section(sheet, i, { upTo: upToTarget(sheet[i], 100) }))];
    const { result } = scoreCancellation(task, sheet, input);
    expect(result.ceiling).toBe(true);
    expect(taskQualityNotes({ cancellation: result }).some((n) => n.includes('sayfanın sonuna'))).toBe(true);
  });

  it('bölüm süresi sınırlanır; aynı bölüm iki kez gelirse ilki kullanılır', () => {
    const s0 = section(sheet, 0, { upTo: upToTarget(sheet[0], 100), ms: 10 });
    const s0b = section(sheet, 0, { upTo: upToTarget(sheet[0], 400) });
    const rest = [1, 2, 3].map((i) => section(sheet, i, { upTo: upToTarget(sheet[i], 100) }));
    const { sections } = scoreCancellation(task, sheet, [s0, s0b, ...rest]);
    expect(sections).toHaveLength(4);
    expect(sections[0].ms).toBe(1_000);
    expect(sections[0].processed).toBe(upToTarget(sheet[0], 100));
  });

  it('geçersiz veri reddedilir', () => {
    const ok = [0, 1, 2, 3].map((i) => section(sheet, i, { upTo: upToTarget(sheet[i], 100) }));
    const bad = (patch: Partial<CancellationSectionInput['response']>, index = 0) =>
      ok.map((s) => (s.index === index ? { ...s, response: { ...s.response, ...patch } } : s));
    expect(() => scoreCancellation(task, sheet, ok.slice(0, 3))).toThrow(TaskInputError);
    expect(() => scoreCancellation(task, sheet, bad({ marks: [1, 1], times: [1, 2] }))).toThrow(TaskInputError);
    expect(() => scoreCancellation(task, sheet, bad({ marks: [N], times: [1] }))).toThrow(TaskInputError);
    expect(() => scoreCancellation(task, sheet, bad({ marks: [1, 2], times: [1] }))).toThrow(TaskInputError);
    expect(() => scoreCancellation(task, sheet, bad({ marks: [1], times: [task.sectionMs + 60_000] }))).toThrow(TaskInputError);
    expect(() => scoreCancellation(task, sheet, bad({ unmarks: -1 }))).toThrow(TaskInputError);
    expect(() => scoreCancellation(task, sheet, [...ok.slice(0, 3), { ...ok[3], index: 7 }])).toThrow(TaskInputError);
  });

  it('kalite notları: çok az işaret ya da rastgele işaretleme', () => {
    const empty = (i: number): CancellationSectionInput => ({ index: i, response: { marks: [], times: [], unmarks: 0 }, rtMs: task.sectionMs });
    const nothing = scoreCancellation(task, sheet, [0, 1, 2, 3].map(empty)).result;
    expect(taskQualityNotes({ cancellation: nothing })[0]).toContain('çok az harf');

    // Her harfe dokunmak: yanlış işaretler doğrulardan fazla.
    const all = (i: number): CancellationSectionInput => {
      const marks = Array.from({ length: 150 }, (_, k) => k);
      return { index: i, response: { marks, times: marks.map((k) => k * 100), unmarks: 0 }, rtMs: task.sectionMs };
    };
    const random = scoreCancellation(task, sheet, [0, 1, 2, 3].map(all)).result;
    expect(random.commissions).toBeGreaterThan(random.hits);
    expect(taskQualityNotes({ cancellation: random })[0]).toContain('rastgele');
  });
});

describe('Harf işaretleme raporu', () => {
  const sheet = cancellationSheet(task, ids[2]);
  const input = [0, 1, 2, 3].map((i) => section(sheet, i, { upTo: upToTarget(sheet[i], i < 2 ? 280 : 130), skipEvery: 8, wrong: 1 }));
  const { result } = scoreCancellation(task, sheet, input);
  const stored = (scaleKey: string, raw: number | null, extra: Record<string, unknown>): ReportScore => ({
    scaleKey,
    raw,
    mean: null,
    band: null,
    percentile: null,
    ciLow: null,
    ciHigh: null,
    nAnswered: 0,
    nItems: 0,
    normSetId: null,
    extra,
  });
  const scores = [
    stored('tempo', result.perMinute, result as unknown as Record<string, unknown>),
    stored('isabet', result.hitRate * 100, {}),
    stored('net', result.net, {}),
    stored('surdurme', result.sustainChange, {}),
  ];
  const report = (audience: 'student' | 'parent') =>
    buildReport({ def: harfIsaretleme, scores, audience, studentName: 'Deneme', grade: 5, completedAt: new Date() });

  it('dört kart, bölüm grafiği ve dikkate özgü öneriler', () => {
    for (const audience of ['student', 'parent'] as const) {
      const c = report(audience).cognitive!;
      expect(c.blocks.map((b) => b.key)).toEqual(['tempo', 'isabet', 'net', 'surdurme']);
      const [tempo, isabet, net, surdurme] = c.blocks;
      expect(tempo.headline).toMatch(/^Dakikada \d+ harf$/);
      expect(isabet.headline).toMatch(/^Bulma oranı %\d+$/);
      // Bulunan ve atlanan harflerin sayıları kartın grafiğindedir.
      const parts = isabet.visual?.type === 'stack' ? isabet.visual.parts : [];
      expect(parts.map((x) => [x.label, x.value])).toEqual([
        ['Bulunan harf', result.hits],
        ['Atlanan harf', result.omissions],
      ]);
      expect(net.headline).toBe(`${result.net} net doğru`);
      expect(surdurme.headline).toBe('Son bölümlerde düştü');
      expect(surdurme.sections!.map((s) => s.value)).toEqual(result.sections.map((s) => s.net));
      expect(c.tips.some((t) => t.includes('telefon'))).toBe(true);
      expect(c.tips.join(' ')).not.toContain('Zihinden işlem');
    }
    expect(report('student').cognitive!.blocks[0].text).toContain('baktın');
    expect(report('parent').cognitive!.blocks[0].text).toContain('Çocuğunuz');
  });

  it('çok yanlış işaret varken "dikkatli çalıştın" denmez; belirgin olmayan değişim yorumlanmaz', () => {
    // Bütün hedefler bulundu ama çeldiricilerin de bir kısmı işaretlendi.
    const noisy = [0, 1, 2, 3].map((i) => section(sheet, i, { upTo: upToTarget(sheet[i], 200), wrong: 12 }));
    const r = scoreCancellation(task, sheet, noisy).result;
    expect(r.hitRate).toBe(1);
    expect(r.falseAlarmRate).toBeGreaterThanOrEqual(0.02);
    const scoresOf = (x: typeof r) => [
      stored('tempo', x.perMinute, x as unknown as Record<string, unknown>),
      stored('isabet', x.hitRate * 100, {}),
      stored('net', x.net, {}),
      stored('surdurme', x.sustainChange, {}),
    ];
    for (const audience of ['student', 'parent'] as const) {
      const c = buildReport({ def: harfIsaretleme, scores: scoresOf(r), audience, studentName: 'Deneme', grade: 5, completedAt: new Date() }).cognitive!;
      expect(c.blocks[1].text).not.toMatch(/dikkatli|dikkatle/);
      expect(c.blocks[1].text).toMatch(/yanlışlıkla işaretledin \(\d+ yanlış işaret\)|harfi de işaretledi \(\d+ yanlış işaret/);
      expect(c.blocks[3].headline).toBe('Belirgin değişim yok');
    }
  });
});
