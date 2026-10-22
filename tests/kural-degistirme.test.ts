import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { kuralDegistirme } from '@/content/instruments/kural-degistirme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { ruleAnswer, ruleCongruent, ruleSwitchKinds } from '@/lib/instruments/rule-switch';
import type { RuleSwitchTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  RULE_TOO_FAST_MS,
  TaskInputError,
  ruleSwitchChance,
  ruleSwitchFast,
  ruleSwitchOneSide,
  ruleSwitchTimeouts,
  scoreRuleSwitch,
  type RuleSwitchTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { ruleSwitchBody, type RuleSwitchCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'kural-degistirme';
const task = kuralDegistirme.tasks[0] as RuleSwitchTask;
const kinds = ruleSwitchKinds(task.trials);
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const TITLES = ['Doğruluk', 'Kural değiştirme', 'İki kuralı akılda tutma', 'Çalışma biçimi'];
const blockOf = (b: number) => task.trials.map((t, i) => ({ t, i })).filter((x) => x.t.block === b);
const runs = <T,>(xs: T[]) => {
  let best = 1;
  let cur = 1;
  for (let i = 1; i < xs.length; i++) {
    cur = xs[i] === xs[i - 1] ? cur + 1 : 1;
    best = Math.max(best, cur);
  }
  return best;
};

describe('Kural değiştirme: denemeler', () => {
  it('dört bölüm: yalnızca renk (16), yalnızca şekil (16), iki karışık bölüm (33 ve 33); alıştırmalar 8, 8 ve 10', () => {
    expect([0, 1, 2, 3].map((b) => blockOf(b).length)).toEqual([16, 16, 33, 33]);
    expect(task.trials.every((t, i) => i === 0 || task.trials[i - 1].block <= t.block)).toBe(true);
    expect(blockOf(0).every((x) => x.t.rule === 'color')).toBe(true);
    expect(blockOf(1).every((x) => x.t.rule === 'shape')).toBe(true);
    expect([task.practice.color.length, task.practice.shape.length, task.practice.mixed.length]).toEqual([8, 8, 10]);
    expect(task.practice.color.every((t) => t.rule === 'color') && task.practice.shape.every((t) => t.rule === 'shape')).toBe(true);
    const pk = ruleSwitchKinds(task.practice.mixed);
    expect(pk.filter((k) => k === 'switch').length).toBeGreaterThanOrEqual(4);
    expect(pk.filter((k) => k === 'repeat').length).toBeGreaterThanOrEqual(3);
    expect([task.cueMs, task.timeoutMs]).toEqual([600, 4000]);
  });

  it('tek kurallı bölümlerde dört şekil eşit; aynı düğme en çok 3 kez art arda, aynı şekil art arda gelmez', () => {
    for (const b of [0, 1]) {
      const xs = blockOf(b).map((x) => x.t);
      for (const color of [0, 1]) for (const shape of [0, 1]) expect(xs.filter((t) => t.color === color && t.shape === shape).length, `${b}`).toBe(4);
      expect(runs(xs.map(ruleAnswer)), `${b}`).toBeLessThanOrEqual(3);
      expect(xs.every((t, i) => i === 0 || !(t.color === xs[i - 1].color && t.shape === xs[i - 1].shape)), `${b}`).toBe(true);
    }
  });

  it('karışık bölümlerde kuralın değiştiği ve sürdüğü denemeler 16 + 16; her birinde uyumlu ve uyumsuz şekiller ile iki düğme dengeli', () => {
    for (const b of [2, 3]) {
      const xs = blockOf(b);
      expect(kinds[xs[0].i]).toBe('first');
      for (const kind of ['switch', 'repeat'] as const) {
        const here = xs.filter((x) => kinds[x.i] === kind).map((x) => x.t);
        expect(here.length, `${b} ${kind}`).toBe(16);
        for (const congruent of [true, false]) {
          for (const side of [0, 1]) expect(here.filter((t) => ruleCongruent(t) === congruent && ruleAnswer(t) === side).length, `${b} ${kind}`).toBe(4);
        }
      }
      const rules = xs.map((x) => x.t.rule);
      expect(runs(rules), `${b}`).toBeLessThanOrEqual(4);
      expect(Math.abs(rules.filter((r) => r === 'color').length - rules.filter((r) => r === 'shape').length), `${b}`).toBeLessThanOrEqual(1);
      expect(runs(xs.map((x) => ruleAnswer(x.t))), `${b}`).toBeLessThanOrEqual(3);
      expect(xs.every((x, j) => j === 0 || !(x.t.color === xs[j - 1].t.color && x.t.shape === xs[j - 1].t.shape)), `${b}`).toBe(true);
    }
    // İki karışık bölüm farklı kuralla başlar.
    expect([blockOf(2)[0].t.rule, blockOf(3)[0].t.rule]).toEqual(['color', 'shape']);
  });

  it('deneme sırası sabit: üretim kuralı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256').update(JSON.stringify({ trials: task.trials, practice: task.practice })).digest('hex').slice(0, 16);
    expect({ version: kuralDegistirme.version, hash }).toEqual({ version: 1, hash: DENEME_IZI });
  });
});

/** Deneme sırasının izi (sürüm 1). */
const DENEME_IZI = 'f00b7664ad277359';

describe('Kural değiştirme: puanlama', () => {
  const body = (pick?: Parameters<typeof ruleSwitchBody>[0]) => (ruleSwitchBody(pick).data as { blocks: Record<string, RuleSwitchTrialInput[]> }).blocks[task.key];

  it('hepsi doğru: koşulların tipik süreleri ve iki bedel', () => {
    const { result } = scoreRuleSwitch(task, body());
    expect([result.correct, result.n, result.accuracy]).toEqual([98, 98, 1]);
    expect([result.pure.medianRt, result.repeat.medianRt, result.switch.medianRt]).toEqual([650, 750, 950]);
    expect([result.switchCost, result.mixingCost]).toEqual([200, 100]);
    // Tek kurallı bölümün ilk denemesi süreye katılmaz.
    expect([result.pure.n, result.pure.nRt, result.repeat.nRt, result.switch.nRt]).toEqual([32, 30, 32, 32]);
    expect([result.timeouts, result.tooFast, result.ruleErrors, result.otherErrors]).toEqual([0, 0, 0, 0]);
  });

  it('hatalar: öteki kurala göre basmak uyumsuz şekillerde sayılır; hatadan sonraki deneme süreye katılmaz', () => {
    const wrong = (q: RuleSwitchCell) => 3 - q.answer;
    const res = scoreRuleSwitch(task, body((q) => ({ response: q.kind === 'switch' && !q.congruent ? wrong(q) : q.answer, rtMs: q.kind === 'switch' ? 950 : 750 }))).result;
    expect([res.ruleErrors, res.otherErrors, res.switch.correct]).toEqual([16, 0, 16]);
    expect(res.switch.accuracy).toBe(0.5);
    // Hatadan sonraki denemeler (çoğu kuralın sürdüğü ya da değiştiği deneme) süreden çıkarılır.
    expect(res.repeat.nRt + res.switch.nRt).toBeLessThan(48);
    // Çok erken basış doğru sayılmaz.
    const fast = scoreRuleSwitch(task, body((q) => ({ response: q.answer, rtMs: q.i < 10 ? RULE_TOO_FAST_MS - 1 : 700 }))).result;
    expect([fast.tooFast, fast.correct, ruleSwitchFast(fast)]).toEqual([10, 88, true]);
    // Süre aşımı.
    const late = scoreRuleSwitch(task, body((q) => ({ response: q.i % 3 === 0 ? null : q.answer, rtMs: q.i % 3 === 0 ? null : 700 }))).result;
    expect([late.timeouts, ruleSwitchTimeouts(late)]).toEqual([33, true]);
    // Hep aynı düğme: doğruluk rastgele düzeyinde.
    const side = scoreRuleSwitch(task, body(() => ({ response: 1, rtMs: 600 }))).result;
    expect([ruleSwitchOneSide(side), ruleSwitchChance(side)]).toEqual([true, true]);
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı deneme iki kez gelirse ilki sayılır', () => {
    const ok = body();
    expect(() => scoreRuleSwitch(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 3, 1.5, Number.NaN]) {
      expect(() => scoreRuleSwitch(task, ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreRuleSwitch(task, ok.map((t, i) => (i === 3 ? { ...t, rtMs: -5 } : t)))).toThrow(TaskInputError);
    expect(scoreRuleSwitch(task, [...ok, { index: 0, response: 3 - (ok[0].response as number), rtMs: 500 }]).result.correct).toBe(98);
    const bad = ruleSwitchBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Kural değiştirme: rapor', () => {
  it('hepsi doğru: dört kart, tipik süreler grafiği ve öne çıkan sayılar', () => {
    const r = evaluate(SLUG, ruleSwitchBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğruluk', '%100 doğru'],
      ['Kural değiştirme', 'Kural değişince 0,20 sn daha yavaş'],
      ['İki kuralı akılda tutma', 'İki kural karışınca 0,10 sn daha yavaş'],
      ['Çalışma biçimi', 'Tipik cevap süresi 0,75 sn'],
    ]);
    // Karşılaştırılan süreler kartların grafiklerindedir.
    expect(((r.student.items[1]).visual?.type === 'bars' ? (r.student.items[1]).visual.rows : []).map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['Kural sürerken 0,75 sn', 'Kural değişince 0,95 sn']);
    expect(((r.student.items[2]).visual?.type === 'bars' ? (r.student.items[2]).visual.rows : []).map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['Tek kurallı bölümler 0,65 sn', 'İki kural karışınca (kural sürerken) 0,75 sn']);
    expect(r.student.cautions).toEqual([]);
    const chart = r.student.chart;
    expect(chart?.type === 'bars' ? chart.rows.map((x) => x.valueLabel) : null).toEqual(['0,65 sn', '0,75 sn', '0,95 sn']);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '%100'],
      ['Kural değiştirmenin etkisi', '0,20 sn'],
      ['Tipik cevap süresi', '0,75 sn'],
    ]);
    expect(r.parent.items[1].text).toContain('(Stoet ve Snyder, 2007)');
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(r.student.roadmap!.bars).toEqual([]);
  });

  it('durumlar: belirgin fark yok, ters fark, öteki kurala göre basma, hesaplanamadı, rastgele düzeyi', () => {
    const flat = evaluate(SLUG, ruleSwitchBody((q) => ({ response: q.answer, rtMs: 700 })));
    expect(flat.student.items.map((i) => i.badge).slice(1, 3)).toEqual(['Belirgin bir fark görülmedi', 'Belirgin bir fark görülmedi']);
    expect(flat.student.keyFigures[1].value).toBe('Belirgin fark yok');
    const rev = evaluate(SLUG, ruleSwitchBody((q) => ({ response: q.answer, rtMs: q.kind === 'switch' ? 600 : q.kind === 'repeat' ? 700 : 900 })));
    expect(rev.student.items[1].badge).toBe('Kural değişince daha hızlı');
    expect(rev.student.items[2].badge).toBe('İki kural karışınca daha hızlı');
    expect(rev.student.items[2].text).toContain('göreve alışıp ısınmaktan');
    // Uyumsuz şekillerde kural değişince yanlış: öteki kurala göre basma ve doğruluk düşüşü anlatılır.
    const rule = evaluate(SLUG, ruleSwitchBody((q) => ({ response: q.kind === 'switch' && !q.congruent ? 3 - q.answer : q.answer, rtMs: q.kind === 'switch' ? 950 : 750 })));
    expect(rule.student.items[0].text).toContain('öteki kurala göre bastın');
    expect(rule.student.items[1].text).toContain('Kural değiştiğinde hataların da arttı: doğru cevapların %100 yerine %50 oldu.');
    expect(rule.parent.items[0].text).toContain('öteki kurala göre basıldı');
    // Kural değişen denemelerin hepsi yanlış: süre karşılaştırılamaz.
    const none = evaluate(SLUG, ruleSwitchBody((q) => ({ response: q.kind === 'switch' ? 3 - q.answer : q.answer, rtMs: 800 })));
    expect(none.student.items[1].badge).toBe('Hesaplanamadı');
    expect(none.student.chart).toBeNull();
    // Hep aynı düğme: rastgele düzeyi; bedeller yorumlanmaz, uyarılar kartla aynı.
    const same = evaluate(SLUG, ruleSwitchBody(() => ({ response: 2, rtMs: 500 })));
    expect(same.student.items.map((i) => i.badge).slice(1, 3)).toEqual(['Yorumlanmadı', 'Yorumlanmadı']);
    expect(same.student.cautions.join(' ')).toContain('rastgele basan');
    expect(same.student.items[3].text).toContain('Cevaplarının çoğunda aynı düğmeye bastın');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafik birbiriyle çelişmez', () => {
    const correctness: Record<string, (q: RuleSwitchCell) => boolean> = {
      hepsi: () => true,
      degisinceYanlis: (q) => !(q.kind === 'switch' && !q.congruent),
      karisikYanlis: (q) => q.kind === 'pure',
      rastgele: (q) => q.i % 2 === 0,
      cogu: (q) => q.i % 7 !== 0,
    };
    const times: Record<string, (q: RuleSwitchCell) => number | null> = {
      bedelli: (q) => (q.kind === 'pure' ? 650 : q.kind === 'repeat' ? 760 : 980),
      duz: () => 720,
      cokErken: (q) => (q.i % 6 === 0 ? 120 : 800),
      gec: (q) => (q.i % 3 === 0 ? null : 900),
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [tName, rt] of Object.entries(times)) {
        for (const oneSide of [false, true]) {
          const label = `${cName}/${tName}/${oneSide}`;
          const body = ruleSwitchBody((q) => {
            const ms = rt(q);
            return { response: ms === null ? null : oneSide ? 1 : correct(q) ? q.answer : 3 - q.answer, rtMs: ms };
          }, 7);
          const res = evaluate(SLUG, body);
          const { result } = scoreRuleSwitch(task, (body.data as { blocks: Record<string, RuleSwitchTrialInput[]> }).blocks[task.key]);
          const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
          const chance = ruleSwitchChance(result);
          for (const r of [res.student, res.parent, adult]) {
            const t = text(r);
            expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
            expect(r.items.map((i) => i.title), label).toEqual(TITLES);
            for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
            expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
            expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance);
            expect(r.cautions.some((c) => c.includes('rastgele basan')), label).toBe(chance);
            const timeoutNote = r.cautions.some((c) => c.includes('süre içinde cevap verilmedi'));
            expect(timeoutNote, label).toBe(ruleSwitchTimeouts(result));
            expect(/süre içinde basma(dın|dı)/.test(r.items[3].text), label).toBe(timeoutNote);
            const fastNote = r.cautions.some((c) => c.includes('0,2 saniye içinde basıldı'));
            expect(fastNote, label).toBe(ruleSwitchFast(result));
            expect(r.items[3].text.includes('0,2 saniye içinde bas'), label).toBe(fastNote);
            const sideNote = r.cautions.some((c) => c.includes('aynı düğmeye basıldı'));
            expect(sideNote, label).toBe(ruleSwitchOneSide(result));
            expect(r.items[3].text.includes('aynı düğmeye bas'), label).toBe(sideNote);
            if (!chance) expect(/tam yansıtmayabilir/.test(r.items[0].text), label).toBe(timeoutNote || fastNote || sideNote);
            // Grafik ancak üç koşulun süresi de varsa ve sonuç yorumlanıyorsa çizilir; kartlardaki süreler grafikle aynıdır.
            if (r.chart?.type === 'bars') {
              expect(chance, label).toBe(false);
              const deg = r.items[1].visual?.type === 'bars' ? r.items[1].visual.rows.map((x) => x.valueLabel) : [];
              const kar = r.items[2].visual?.type === 'bars' ? r.items[2].visual.rows.map((x) => x.valueLabel) : [];
              expect(deg, label).toEqual([r.chart.rows[1].valueLabel, r.chart.rows[2].valueLabel]);
              expect(kar, label).toEqual([r.chart.rows[0].valueLabel, r.chart.rows[1].valueLabel]);
            }
            expect(r.items[0].badge, label).toBe(`%${Math.round(result.accuracy * 100)} doğru`);
          }
          expect(text(res.student), label).not.toContain('Çocuğunuz');
          expect(text(adult), label).not.toContain('Çocuğunuz');
          expect(text(res.parent), label).not.toMatch(/\b(bastın|verdin|yaptın|zorlandın|yanıldın|bulamadın)\b/);
          expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
          n++;
        }
      }
    }
    expect(n).toBe(5 * 4 * 2);
  }, 120_000);

  it('3. sınıftan itibaren; yetişkinler de yapabilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, ruleSwitchBody(undefined, 2))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, ruleSwitchBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([kuralDegistirme.intro.title, ...kuralDegistirme.intro.paragraphs, ...task.instructions].join(' '))).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar her denemenin doğru düğmesidir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /KD_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.trials.map((t) => ruleAnswer(t) + 1));
    const s = m![1].split(',').map(Number);
    const r = evaluate(SLUG, ruleSwitchBody((q) => ({ response: s[q.i], rtMs: 700 + 200 * Number(q.i >= 32 && q.i !== 32 && q.i !== 65 && q.i % 2 === 0) })));
    expect(r.student.items[0].badge).toBe('%100 doğru');
    expect(r.parent.chart?.type === 'bars' ? r.parent.chart.rows : []).toHaveLength(3);
    expect(r.parent.roadmap!.bars).toEqual([]);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, ruleSwitchBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, ruleSwitchBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı', () => {
    expect(kuralDegistirme.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(kuralDegistirme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(kuralDegistirme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...kuralDegistirme.science, citations: [] });
    const authors = ['Stoet', 'Zinke', 'Hedge'];
    expect(kuralDegistirme.science.citations.map((c) => c.text.split(',')[0])).toEqual(authors);
    for (const a of authors) expect(body, a).toMatch(new RegExp(`${a} ve`));
    expect(TASK_ROADMAPS[SLUG].sources.map((s) => s.url).sort()).toEqual(kuralDegistirme.science.citations.map((c) => c.url).sort());
  });
});
