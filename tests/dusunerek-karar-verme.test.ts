import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REFLECTION_SPECS, dusunerekKararVerme } from '@/content/instruments/dusunerek-karar-verme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { reflectionRapidMs } from '@/lib/instruments/reflection';
import type { CognitiveReflectionTask, ReflectionDomain, ReflectionRole } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { REFLECTION_GROUPS } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  REFLECTION_CONTROL_LOW,
  REFLECTION_CONTROL_NONE,
  REFLECTION_SAME_MAX_CORRECT,
  REFLECTION_TRAP_NOTE,
  TaskInputError,
  countOf,
  reflectionBelowChance,
  reflectionChance,
  reflectionControlLow,
  reflectionRapid,
  reflectionRushed,
  reflectionSuspicious,
  reflectionSamePosition,
  scoreReflection,
  type ReflectionResult,
  type ReflectionTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { reflectionBody, reflectionOther, type ReflectionCell } from './helpers/bodies';
import { REFLECTION_FORMAL, formalNumbers, leadingNumber, reflectionExpected, verbalExpected } from './helpers/reflection-check';
import { schoolWords } from './helpers/school';

const SLUG = 'dusunerek-karar-verme';
const task = dusunerekKararVerme.tasks[0] as CognitiveReflectionTask;
const TITLES = ['Doğru cevaplar', 'Yanlışların türü', 'Benzer soru çiftleri', 'Çalışma biçimi'];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof reflectionBody>) => (body.data as { blocks: Record<string, ReflectionTrialInput[]> }).blocks[task.key];
const idx = (role: ReflectionRole, domain?: ReflectionDomain) =>
  task.items.flatMap((_, i) => (task.roles[i] === role && (!domain || task.domains[i] === domain) ? [i] : []));

describe('Düşünerek karar verme: sorular', () => {
  it('24 soru: 16 tuzaklı (8 sayısal, 8 sözel) ve 8 tuzaksız eş (4 sayısal, 4 sözel); dört seçenek; 2 alıştırma', () => {
    expect(task.items.map((it) => it.key)).toEqual(Array.from({ length: 24 }, (_, i) => `dk${String(i + 1).padStart(2, '0')}`));
    expect(task.practice.map((p) => p.key)).toEqual(['dkp1', 'dkp2']);
    expect([idx('lure', 'num').length, idx('lure', 'verb').length, idx('control', 'num').length, idx('control', 'verb').length]).toEqual([8, 8, 4, 4]);
    for (const it of [...task.items, ...task.practice]) {
      expect(it.options, it.key).toHaveLength(4);
      expect(new Set(it.options).size, it.key).toBe(4);
      expect(it.question, it.key).toMatch(/\?$/);
      for (const line of it.stem) expect(line, it.key).toMatch(/\.$/);
      expect([...it.stem, it.question, ...it.options].join(' '), it.key).not.toMatch(/'|  |\s[,.;?]/);
    }
    // İlk iki soru tuzaksızdır (ısınma); art arda en çok dört tuzaklı soru.
    expect(task.roles.slice(0, 2)).toEqual(['control', 'control']);
    let run = 0;
    for (const r of task.roles) {
      run = r === 'lure' ? run + 1 : 0;
      expect(run).toBeLessThanOrEqual(4);
    }
  });

  it('eşler: her tuzaksız sorunun tuzaklı bir eşi var; aynı türden, aralarında en az altı soru; dört eşte tuzaksız, dördünde tuzaklı önce ve tuzaksızı önce gelenin öyküsü farklı', () => {
    const controls = idx('control');
    expect(controls).toHaveLength(8);
    let controlFirst = 0;
    for (const c of controls) {
      const l = task.pairs[c]!;
      expect(l, task.items[c].key).not.toBeNull();
      expect([task.roles[l], task.domains[l], task.pairs[l]], task.items[c].key).toEqual(['lure', task.domains[c], c]);
      expect(Math.abs(l - c), task.items[c].key).toBeGreaterThanOrEqual(7);
      if (c < l) {
        controlFirst++;
        // Önce gelen tuzaksız soru, eşiyle aynı soruyu sormaz ve aynı ilk cümleyle başlamaz (yüzeysel benzerlik az).
        expect(task.items[c].question, task.items[c].key).not.toBe(task.items[l].question);
        expect(task.items[c].stem[0], task.items[c].key).not.toBe(task.items[l].stem[0]);
      }
    }
    expect(controlFirst).toBe(4);
    expect(task.pairs.filter((p) => p !== null)).toHaveLength(16);
    expect(idx('control', 'num').map((c) => task.domains[task.pairs[c]!])).toEqual(['num', 'num', 'num', 'num']);
  });

  it('cevap anahtarı dengeli: her harf altı kez, art arda aynı harf yok; tuzaklı sorularda ilk akla gelen cevap her harfte dört kez', () => {
    const count = (xs: number[]) => [1, 2, 3, 4].map((o) => xs.filter((x) => x === o).length);
    expect(count(task.answers)).toEqual([6, 6, 6, 6]);
    expect(task.answers.every((a, i) => i === 0 || a !== task.answers[i - 1])).toBe(true);
    expect(count(idx('lure').map((i) => task.lures[i]))).toEqual([4, 4, 4, 4]);
    expect(count(idx('control').map((i) => task.lures[i]))).toEqual([2, 2, 2, 2]);
    expect(task.lures.every((l, i) => l !== task.answers[i])).toBe(true);
    expect(task.answers).toEqual(REFLECTION_SPECS.map((s) => s.at[0]));
  });

  it('sayısal sorular: doğru cevap ve tuzak sorunun sayılarından bağımsızca hesaplanınca aynı çıkar; sayılar metinde geçer', () => {
    expect(Object.keys(REFLECTION_FORMAL).sort()).toEqual(task.items.filter((_, i) => task.domains[i] === 'num').map((it) => it.key));
    for (const [i, it] of task.items.entries()) {
      if (task.domains[i] !== 'num') continue;
      const { answer, lure } = reflectionExpected(it.key);
      const nums = it.options.map(leadingNumber);
      expect(
        nums.every((x) => x !== null),
        it.key,
      ).toBe(true);
      expect(new Set(nums).size, it.key).toBe(4);
      expect(nums[task.answers[i] - 1], `${it.key} doğru`).toBe(answer);
      expect(nums[task.lures[i] - 1], `${it.key} tuzak`).toBe(lure);
      const words = [...it.stem, it.question].join(' ');
      for (const n of formalNumbers(it.key)) expect(words, `${it.key} ${n}`).toMatch(new RegExp(`(^|\\D)${n}(\\D|$)`));
      // Seçeneklerin birimi aynı.
      expect(new Set(it.options.map((o) => o.replace(/^\d+/, ''))).size, it.key).toBe(1);
    }
  });

  it('sözel sorular: doğru cevap ve tuzak sorunun metninden okunan bilgilerle bulunur', () => {
    for (const [i, it] of task.items.entries()) {
      if (task.domains[i] !== 'verb') continue;
      const exp = verbalExpected(it.stem, it.question);
      const right = it.options[task.answers[i] - 1];
      const lure = it.options[task.lures[i] - 1];
      if ('premise' in exp) {
        expect(task.roles[i], it.key).toBe('lure');
        expect(right, it.key).toContain(exp.premise);
        expect(
          it.options.filter((o) => o.includes(exp.premise)),
          it.key,
        ).toHaveLength(1);
      } else {
        expect([right, lure], it.key).toEqual([exp.answer, exp.lure]);
      }
    }
    // Olmayan bir şeyi soran sorularda tuzak, sorudaki ipucunun gösterdiği cevaptır.
    const lureOf = (key: string) => {
      const i = task.items.findIndex((it) => it.key === key);
      return task.items[i].options[task.lures[i] - 1];
    };
    expect(lureOf('dk03')).toContain('doğu'); // rüzgâr batıdan doğuya
    expect(lureOf('dk16')).toContain('Güney'); // rüzgâr kuzeyden güneye
    expect(lureOf('dk20')).toContain('kuş'); // tepeye uçabilen
    // Seçenekler aynı biçimde: olmayan bir şeyi soran sorularda dört seçenek de "cevap: gerekçe" biçimindedir ve doğru
    // seçenek en uzun tek seçenek değildir.
    for (const key of ['dk03', 'dk16', 'dk20']) {
      const it = task.items.find((x) => x.key === key)!;
      expect(
        it.options.every((o) => o.includes(': ')),
        key,
      ).toBe(true);
      const right = it.options[task.answers[task.items.indexOf(it)] - 1];
      expect(
        it.options.some((o) => o !== right && o.length >= right.length),
        key,
      ).toBe(true);
    }
  });

  it('metinler: okula özgü sözcük yok (yetişkinler de çözer); çok hızlı cevap sınırı soru uzunluğuna göre 2,5–6 saniye', () => {
    const all = [...task.items, ...task.practice].flatMap((it) => [...it.stem, it.question, ...it.options]).join(' ');
    expect(schoolWords(all)).toEqual([]);
    expect(
      schoolWords(
        [dusunerekKararVerme.intro.title, ...dusunerekKararVerme.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '),
      ),
    ).toEqual([]);
    const ms = task.items.map(reflectionRapidMs);
    expect(Math.min(...ms)).toBeGreaterThanOrEqual(2500);
    expect(Math.max(...ms)).toBeLessThanOrEqual(6000);
    // Çözmeye başlamadan görülen metinler tuzaktan söz etmez (Bilişsel Yansıtma Testi'ndeki gibi).
    expect(
      [dusunerekKararVerme.tagline, dusunerekKararVerme.description, task.measures, ...dusunerekKararVerme.intro.paragraphs, ...task.instructions].join(' '),
    ).not.toMatch(/tuza|hile|şaşırt|ilk akla gelen/i);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(
        JSON.stringify({
          items: task.items,
          practice: task.practice,
          answers: task.answers,
          domains: task.domains,
          roles: task.roles,
          lures: task.lures,
          pairs: task.pairs,
        }),
      )
      .digest('hex')
      .slice(0, 16);
    expect({ version: dusunerekKararVerme.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '2fde7667dcfd6587';

describe('Düşünerek karar verme: puanlama', () => {
  const score = (pick?: (q: ReflectionCell) => { response: number; rtMs: number | null }) => scoreReflection(task, trialsOf(reflectionBody(pick))).result;

  it('hatasız: 24 doğru; tuzaklı 16/16, tuzaksız 8/8, eşlerin hepsi doğru', () => {
    const r = score();
    expect([r.correct, r.lure.correct, r.numLure.correct, r.verbLure.correct, r.control.correct, r.pairs, r.pairBoth, r.pairControlOnly]).toEqual([
      24, 16, 8, 8, 8, 8, 8, 0,
    ]);
    expect([r.rapid, r.samePosition, r.medianRt, r.rtLureCorrect, r.rtLureIntuitive]).toEqual([0, 6, 12_000, 12_000, null]);
  });

  it('ilk akla gelen cevabı veren: tuzaklılarda tuzak, tuzaksızlarda doğru; eşlerin hepsinde tuzaksızı doğru, tuzaklısı ilk akla gelen', () => {
    const r = score((q) => ({ response: q.role === 'lure' ? q.lure : q.answer, rtMs: 8000 }));
    expect([r.lure.correct, r.lure.lure, r.lure.other, r.control.correct, r.pairControlOnly, reflectionChance(r)]).toEqual([0, 16, 0, 8, 8, false]);
    expect(r.rtLureIntuitive).toBe(8000);
  });

  it('her yerde tuzak arayan: tuzaklılarda doğru, tuzaksızlarda tuzak; rastgele değil', () => {
    const r = score((q) => ({ response: q.role === 'lure' ? q.answer : q.lure, rtMs: 12_000 }));
    expect([r.lure.correct, r.control.correct, r.control.lure, reflectionChance(r)]).toEqual([16, 0, 8, false]);
  });

  it('başka yanlışlar: tuzaksız soruların çoğu da yanlışsa sonuç yorumlanmaz', () => {
    const r = score((q) => ({ response: reflectionOther(q), rtMs: 12_000 }));
    expect([r.correct, r.lure.other, r.control.other, reflectionChance(r), reflectionBelowChance(r)]).toEqual([0, 16, 8, true, true]);
    expect([REFLECTION_CONTROL_NONE, REFLECTION_CONTROL_LOW, REFLECTION_TRAP_NOTE]).toEqual([3, 5, 3]);
  });

  it('rastgele seçen biri neredeyse her zaman uyarı alır; tuzak seçeneğine rastgele denk gelmek "tuzak aramak" sayılmaz', () => {
    let s = 7;
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    let warned = 0;
    let suspicious = 0;
    const N = 2000;
    for (let k = 0; k < N; k++) {
      const r = score(() => ({ response: 1 + Math.floor(rnd() * 4), rtMs: 12_000 }));
      if (reflectionChance(r) || reflectionControlLow(r)) warned++;
      if (reflectionSuspicious(r) && !reflectionControlLow(r)) suspicious++;
    }
    // Tuzaksız 8 sorunun en az 6'sını rastgele bulmanın olasılığı yaklaşık %0,4'tür.
    expect(warned / N).toBeGreaterThan(0.99);
    expect(suspicious / N).toBeLessThan(0.01);
    // Gerçekten her yerde tuzak arayan: tuzaksızların hepsinde tuzak.
    const real = score((q) => ({ response: q.role === 'lure' ? q.answer : q.lure, rtMs: 12_000 }));
    expect([reflectionChance(real), reflectionSuspicious(real), reflectionControlLow(real)]).toEqual([false, true, true]);
  });

  it('çok hızlı cevaplar, hep aynı yer ve geçersiz girdiler', () => {
    const fast = score((q) => ({ response: q.i % 4 === 0 ? q.answer : reflectionOther(q), rtMs: q.i < 8 ? 900 : 12_000 }));
    expect([fast.rapid, fast.rapidCorrect, reflectionRapid(fast)]).toEqual([8, 2, true]);
    const quickRight = score((q) => ({ response: q.answer, rtMs: 900 }));
    expect([quickRight.rapid, reflectionRapid(quickRight)]).toEqual([24, false]);
    const same = score(() => ({ response: 2, rtMs: 12_000 }));
    expect([same.samePosition, same.correct, reflectionSamePosition(same)]).toEqual([24, 6, true]);
    // Çok doğru verende aynı harfin sık seçilmesi uyarı değildir.
    const strong = score((q) => ({ response: q.i >= 18 ? 1 : q.answer, rtMs: 12_000 }));
    expect(strong.correct).toBeGreaterThan(REFLECTION_SAME_MAX_CORRECT);
    expect(reflectionSamePosition(strong)).toBe(false);

    const ok = trialsOf(reflectionBody());
    expect(() => scoreReflection(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 5, 2.5, Number.NaN]) {
      expect(
        () =>
          scoreReflection(
            task,
            ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t)),
          ),
        String(bad),
      ).toThrow(TaskInputError);
    }
    expect(() => scoreReflection(task, [...ok, { index: 24, response: 1, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreReflection(task, [...ok, { index: 0, response: 1, rtMs: 1 }]).result.correct).toBe(24);
    expect(() => scoreReflection({ ...task, answers: [], domains: [], roles: [], lures: [], pairs: [] }, ok)).toThrow(TaskInputError);
    const bad = reflectionBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Düşünerek karar verme: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar, grafik ve soru gruplarının üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, reflectionBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '16 tuzaklı soruda 16 doğru'],
      ['Yanlışların türü', 'Tuzaklı sorularda yanlış yok'],
      ['Benzer soru çiftleri', '8 tuzaksız soruda 8 doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 12 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    // İlk akla gelen yanlış cevapların sayısı ayrı bir eğilim ölçüsü olarak geçerli bulunmadığı için öne çıkan sayı değildir.
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Tuzaklı sorularda doğru', '16/16'],
      ['Tuzaksız eş sorularda doğru', '8/8'],
      ['Soru başına tipik süre', '12 saniye'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.valueLabel])).toEqual(REFLECTION_GROUPS.map((g) => [g.name, '8/8']));
    expect(rm.barsTitle).toBe('Soru gruplarına göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(r.student.items[0].text).toBe(
      'Testteki 24 sorunun 16 tanesi tuzaklıydı: bunlarda ilk akla gelen cevap yanlıştı. Tuzaklı soruların hepsinde doğru cevabı buldun; ilk akla gelen yanlış cevaba hiç kapılmadın.',
    );
    expect(r.student.items[1].text).toBe('Tuzaklı soruların hiçbirinde yanlış cevap vermedin.');
    expect(r.student.items[2].text).toContain('tuzak olan ve olmayan soruları birbirinden ayırdın');
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('durumlar: ilk akla gelen cevap, başka yanlışlar, her yerde tuzak aramak, rastgele, tuzaksızlarda da yanlış, çok hızlı, hep aynı yer, sayısal–sözel farkı', () => {
    const intuitive = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' ? q.lure : q.answer, rtMs: 8000 })),
    );
    expect(intuitive.student.items[0].badge).toBe('16 tuzaklı soruda 0 doğru');
    expect(intuitive.student.items[0].text).toContain('birçok kişi bu cevabı verir');
    expect(intuitive.student.items[1].badge).toBe('16 yanlışın hepsi ilk akla gelen cevap');
    expect(intuitive.student.items[1].text).toContain('Yanlışlarının hepsinde sorunun ilk anda akla getirdiği cevabı seçtin.');
    expect(intuitive.student.items[1].text).toContain('ikisi birlikte 120 lira eder');
    expect(intuitive.student.items[2].text).toContain(
      'Eşlerin hepsinde tuzaksız sorunun doğru cevabını buldun ama tuzaklı eşinde ilk akla gelen cevabı seçtin. Tuzaksız eşleri doğru bulman, bu sorulardaki okuma ve hesabın sana zor gelmediğini gösterir.',
    );
    expect(intuitive.student.items[2].text).not.toContain('anlamamaktan');
    expect(intuitive.parent.items[2].text).toContain('Çocuğunuz bu soruların hepsini doğru buldu.');

    const other = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.i % 2 ? reflectionOther(q) : q.answer, rtMs: 12_000 })),
    );
    expect(other.student.items[1].text).toContain(
      'Yanlışlarının hiçbiri ilk akla gelen cevap değildi; hepsi başka bir yanlıştı. Bu tür sorularda yanlışlar çoğunlukla ilk akla gelen cevap olur.',
    );
    expect(other.student.items[1].badge).toBe('7 yanlışın hiçbiri ilk akla gelen cevap değil');

    const suspicious = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' ? q.answer : q.lure, rtMs: 12_000 })),
    );
    expect(suspicious.student.items[2].text).toContain('Bu soruların hepsinde, tuzak olmadığı hâlde tuzak varmış gibi cevap verdin.');
    expect(suspicious.student.cautions.join(' ')).toContain(
      'tuzaksız eş soruların hepsinde yanlış cevap verilmiş; bunların hepsinde tuzak olmadığı hâlde tuzak varmış gibi cevap verilmiş',
    );
    // Tuzaklıların hepsi doğru ama tuzaksızlarda da tuzak arandı: kartlar övmez, tuzak aramaya dikkat çeker.
    expect(suspicious.student.items[0].text).toContain('Tuzaklı soruların hepsinde doğru cevabı seçtin.');
    expect(suspicious.student.items[0].text).toContain('tuzak olmayan sorularda da tuzak aramaktan kaynaklanmış olabilir');
    expect(suspicious.student.items[0].text).not.toContain('kapılmadın');
    expect(suspicious.student.items[1].badge).toBe('Tuzaklı sorularda yanlış yok');
    expect(suspicious.student.items[1].text).toContain('tuzak olmayan sorularda da tuzak aramaktan kaynaklanmış olabilir');
    expect(text(suspicious.student)).not.toMatch(/her soruda tuzak|denetle/);
    // Sekiz tuzaksız sorunun ikisinde tuzak cevabı, öteki tuzaksızlar doğru: rastgele seçimde de sık görülür, tuzak arama denmez.
    const lightBody = () => {
      let c = 0;
      return reflectionBody((q) => ({ response: q.role === 'control' && c++ < 2 ? q.lure : q.answer, rtMs: 12_000 }));
    };
    const light = evaluate(SLUG, lightBody());
    const lightRes = scoreReflection(task, trialsOf(lightBody())).result;
    expect([lightRes.control.lure, lightRes.control.correct]).toEqual([2, 6]);
    expect(reflectionSuspicious(lightRes)).toBe(false);
    expect(text(light.student)).not.toContain('tuzak aramak');

    const random = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: reflectionOther(q), rtMs: 12_000 })),
    );
    // Hiçbir soruda doğru cevap yok: rastgele seçimde beklenenden de az, "rastgele seçilmiş" denmez.
    expect(random.student.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', '8 tuzaksız soruda 0 doğru', 'Soru başına tipik süre 12 saniye']);
    expect(random.student.items[0].text).toMatch(/^Hiçbir soruda doğru cevabı seçmedin\. Bu, rastgele seçimde beklenenden de az\./);
    expect(random.student.items[2].text).toContain('yönergenin farklı anlaşıldığını');
    expect(random.student.cautions.join(' ')).toContain('24 sorunun hiçbiri doğru cevaplanmamış. Bu, rastgele seçimde beklenenden de azdır.');
    expect(text(random.student)).not.toContain('rastgele seçilmiş');
    expect(random.student.roadmap!.bars).toEqual([]);
    expect(random.student.chart).toBeNull();
    // Tuzaksızların çoğu yanlış ama toplam rastgele düzeyinde: sonuç yorumlanmaz.
    const chanceBody = reflectionBody((q) => ({ response: q.i % 3 === 0 ? q.answer : reflectionOther(q), rtMs: 12_000 }));
    const chanceRes = scoreReflection(task, trialsOf(chanceBody)).result;
    expect([reflectionChance(chanceRes), reflectionBelowChance(chanceRes)]).toEqual([true, false]);
    const chanceRep = evaluate(SLUG, chanceBody);
    expect(chanceRep.student.items[0].text).toMatch(/^Tuzaksız eş soruların da çoğunda doğru cevabı bulamadın\./);
    expect(chanceRep.student.items[0].text).toContain('verebilir');
    expect(chanceRep.student.cautions.join(' ')).toContain('Bu sonuç yorumlanmamalıdır.');

    const low = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'control' && q.i % 3 === 0 ? reflectionOther(q) : q.role === 'lure' ? q.lure : q.answer, rtMs: 12_000 })),
    );
    const lowRes = scoreReflection(
      task,
      trialsOf(
        reflectionBody((q) => ({ response: q.role === 'control' && q.i % 3 === 0 ? reflectionOther(q) : q.role === 'lure' ? q.lure : q.answer, rtMs: 12_000 })),
      ),
    ).result;
    expect(lowRes.control.correct).toBeLessThanOrEqual(REFLECTION_CONTROL_LOW);
    expect(lowRes.control.correct).toBeGreaterThan(REFLECTION_CONTROL_NONE);
    expect(low.student.items[0].text).toContain('benzer soru çiftleri kartına bak');
    expect(low.student.cautions.join(' ')).toContain('tuzaksız eş soruların');

    const fast = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.i % 4 === 0 ? q.answer : reflectionOther(q), rtMs: q.i < 8 ? 900 : 12_000 })),
    );
    expect(fast.student.cautions.join(' ')).toContain('okumaya yetmeyecek kadar kısa');
    expect(fast.student.items[3].text).toContain('24 sorunun 8 tanesinde cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin.');
    expect(fast.student.items[3].text).not.toContain('hız tek başına');
    // Soruların hepsi okunamayacak kadar hızlı: sonuç yorumlanmaz; tuzak arama ya da sayısal–sözel farkı anlatılmaz.
    const rushed = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.i % 2 ? q.answer : q.lure, rtMs: 900 })),
    );
    expect(rushed.student.items.slice(0, 3).map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    expect(rushed.student.items[0].text).toMatch(/^24 sorunun hepsinde cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin\./);
    expect(rushed.student.cautions.join(' ')).toContain('Bu sonuç yorumlanmamalıdır.');
    expect(text(rushed.student)).not.toMatch(/tuzak aramak|Sayısal tuzaklı sorularda|ilk akla gelen cevap(tı| değil)/);
    expect(rushed.student.keyFigures.map((f) => f.value)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', '1 saniye']);
    expect(rushed.student.chart).toBeNull();

    const same = evaluate(
      SLUG,
      reflectionBody(() => ({ response: 2, rtMs: 12_000 })),
    );
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');

    const numHard = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.domain === 'num' ? q.lure : q.answer, rtMs: 12_000 })),
    );
    expect(numHard.student.items[0].text).toContain('Sayısal tuzaklı sorularda, sözel olanlardan daha az doğru cevap buldun.');
    const verbHard = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.domain === 'verb' ? q.lure : q.answer, rtMs: 12_000 })),
    );
    expect(verbHard.student.items[0].text).toContain('Sözel tuzaklı sorularda, sayısal olanlardan daha az doğru cevap buldun.');

    // Süreler: ilk akla gelen cevaplar hızlı.
    const quickIntuitive = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.i % 2 ? q.lure : q.answer, rtMs: q.role === 'lure' && q.i % 2 ? 6000 : 15_000 })),
    );
    expect(quickIntuitive.student.items[3].text).toContain(
      'İlk akla gelen cevabı seçtiğin sorularda, doğru bulduğun sorulardan daha kısa sürede cevap verdin.',
    );
    expect(quickIntuitive.student.items[3].visual?.type === 'bars' ? quickIntuitive.student.items[3].visual.rows.map((x) => `${x.label} ${x.valueLabel}`) : []).toEqual([
      'Bütün sorular 15 sn',
      'Doğru bulunan tuzaklı sorular 15 sn',
      'İlk akla gelen cevabın seçildiği sorular 6 sn',
    ]);
  });

  it('rastgele 1500 cevap düzeninde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    let s = 20261010;
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    let n = 0;
    for (let k = 0; k < 1500; k++) {
      // Her soru grubu için doğru, tuzak ve başka yanlış olasılıkları; süre düzeni; bazen hep aynı harf.
      const groups = ['lure-num', 'lure-verb', 'control-num', 'control-verb'] as const;
      const pr = Object.fromEntries(
        groups.map((g) => [g, [rnd(), rnd() * (g.startsWith('control') && k % 5 ? 0.3 : 1), rnd() * (k % 7 === 0 ? 1 : 0.35)]]),
      ) as Record<(typeof groups)[number], number[]>;
      const timing = k % 9 === 0 ? 'hizli' : k % 9 === 1 ? 'yok' : k % 9 === 2 ? 'sezgi-hizli' : 'normal';
      const sameLetter = k % 23 === 0 ? 1 + (k % 4) : 0;
      const pick = (q: ReflectionCell) => {
        const [pc, pl, po] = pr[`${q.role}-${q.domain}`];
        const x = rnd() * (pc + pl + po);
        const response = sameLetter || (x < pc ? q.answer : x < pc + pl ? q.lure : reflectionOther(q));
        const rtMs =
          timing === 'yok' ? null : timing === 'hizli' && q.i % 3 === 0 ? 900 : timing === 'sezgi-hizli' && response === q.lure ? 5000 : 9000 + 400 * q.i;
        return { response, rtMs };
      };
      const body = reflectionBody(pick, 5 + (k % 9));
      const label = `${k}/${timing}/${sameLetter}`;
      const res = evaluate(SLUG, body);
      const result: ReflectionResult = scoreReflection(task, trialsOf(body)).result;
      const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
      const chance = reflectionChance(result);
      const rushed = reflectionRushed(result);
      const notRead = chance || rushed;
      const rapid = reflectionRapid(result);
      const samePos = reflectionSamePosition(result);
      const doubt = !notRead && (rapid || samePos);
      const L = result.lure;
      const C = result.control;
      const wrong = L.n - L.correct;
      const ctrlLowRaw = !chance && C.correct <= REFLECTION_CONTROL_LOW;
      const suspiciousRaw = !chance && C.lure > C.other && (C.lure >= REFLECTION_TRAP_NOTE || (C.lure >= 2 && ctrlLowRaw));
      expect([reflectionSuspicious(result), reflectionControlLow(result)], label).toEqual([suspiciousRaw, ctrlLowRaw]);
      // Kartlar: okumadan ya da bakmadan seçilmiş olabilirse (ya da sonuç yorumlanmıyorsa) tuzak arama anlatılmaz.
      const suspicious = !notRead && !doubt && suspiciousRaw;
      const ctrlLow = !notRead && !doubt && ctrlLowRaw;
      for (const r of [res.student, res.parent, adult]) {
        const t = text(r);
        expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
        expect(
          r.items.map((i) => i.title),
          label,
        ).toEqual(TITLES);
        for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
        // Nicelik sözleri sayılarla uyuşur ("8 sorunun 8 tanesi", "0 tanesi", "1 tanesi" denmez).
        expect(`${t} ${r.cautions.join(' ')}`, label).not.toMatch(/\b(\d+) (sorunun|yanlışın|eşin) \1 tanes|(^|\s)[01] tanes/);
        expect(r.items[0].badge, label).toBe(notRead ? 'Yorumlanmadı' : `16 tuzaklı soruda ${L.correct} doğru`);
        expect(r.items[0].visual === undefined, label).toBe(notRead);
        expect(r.items[1].badge, label).toBe(
          notRead
            ? 'Yorumlanmadı'
            : wrong === 0
              ? 'Tuzaklı sorularda yanlış yok'
              : doubt
                ? 'Yorumlanmadı'
                : wrong === 1
                  ? `Tek yanlış: ${L.lure ? 'ilk akla gelen cevap' : 'başka bir yanlış'}`
                  : `${wrong} yanlışın ${countOf(L.lure, wrong, 'i')} ilk akla gelen cevap${L.lure === 0 ? ' değil' : ''}`,
        );
        expect(r.items[2].badge, label).toBe(rushed || doubt ? 'Yorumlanmadı' : `8 tuzaksız soruda ${C.correct} doğru`);
        // Uyarılar.
        expect(r.cautions.some((c) => c.includes('yorumlanmamalıdır')), label).toBe(notRead);
        expect(
          r.cautions.some((c) => /tuzaksız eş soruların .* yanlış cevap verilmiş/.test(c)),
          label,
        ).toBe(ctrlLowRaw && !rapid && !samePos);
        expect(
          r.cautions.some((c) => c.includes('okumaya yetmeyecek kadar kısa')),
          label,
        ).toBe(reflectionRapid(result));
        expect(
          r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş')),
          label,
        ).toBe(reflectionSamePosition(result));
        // Tuzaklı sorular kartı.
        const a = r.items[0].text;
        expect(a.includes('sonuç yorumlanmadı'), label).toBe(notRead);
        expect(/benzer soru çiftleri kartına bak/.test(a), label).toBe(suspicious || ctrlLow);
        expect(a.includes('tuzak olmayan sorularda da tuzak aramaktan'), label).toBe(suspicious);
        expect(/okumadan ya da bakmadan seç/.test(a), label).toBe(doubt);
        const diff = result.numLure.correct - result.verbLure.correct;
        expect(a.includes('Sayısal tuzaklı sorularda'), label).toBe(!notRead && !doubt && diff <= -4);
        expect(a.includes('Sözel tuzaklı sorularda'), label).toBe(!notRead && !doubt && diff >= 4);
        // Yanlışların türü.
        const b = r.items[1].text;
        const intuitiveMost = !notRead && !doubt && wrong >= 2 && L.lure >= 2 && L.lure >= 2 * L.other;
        const otherMost = !notRead && !doubt && wrong >= 2 && !intuitiveMost && L.other >= 2 && L.other > L.lure;
        expect(b.includes('sorunun ilk anda akla getirdiği cevabı seçt'), label).toBe(intuitiveMost);
        expect(b.includes('Bu tür sorularda yanlışlar çoğunlukla ilk akla gelen cevap olur'), label).toBe(otherMost);
        expect(b.includes('yanlışların türü yorumlanmadı'), label).toBe(notRead || (doubt && wrong > 0));
        // Tuzaksız eş sorular.
        const c = r.items[2].text;
        expect(c.includes('tuzak varmış gibi cevap ver'), label).toBe(suspicious);
        expect(c.includes('Eşlerin '), label).toBe(!notRead && !doubt && !suspicious && !ctrlLow && result.pairControlOnly >= 2);
        if (c.includes('Eşlerin ')) expect(c, label).toContain(`Eşlerin ${countOf(result.pairControlOnly, result.pairs, 'inde')}`);
        expect(c.includes('başka bir yanlış cevap ver'), label).toBe(suspicious && C.other >= 2);
        // "Birçok kişi bu cevabı verir" yalnızca yanlışların çoğu ilk akla gelen cevapken.
        if (a.includes('birçok kişi bu cevabı verir')) expect(L.lure >= L.other, label).toBe(true);
        // Kuşkulu sonuçta dikkatsizlik ya da süre yorumu yapılmaz.
        if (doubt || notRead || rapid) expect(r.items[3].text, label).not.toMatch(/daha kısa sürede cevap verd|daha çok zaman ayırd|yakın süreler/);
        expect(r.items[3].text.includes('hız tek başına'), label).toBe(!rapid && result.medianRt !== null);
        // Grafik, sütunlar ve öne çıkan sayılar kartlarla aynı sayıları gösterir.
        if (notRead) expect(r.chart, label).toBeNull();
        else
          expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(
            REFLECTION_GROUPS.map((g) => `${result[g.key].correct}/8`),
          );
        expect(
          r.roadmap!.bars.map((x) => x.valueLabel),
          label,
        ).toEqual(notRead ? [] : REFLECTION_GROUPS.map((g) => `${result[g.key].correct}/8`));
        expect(r.keyFigures.find((f) => f.label === 'Tuzaksız eş sorularda doğru')?.value, label).toBe(rushed || doubt ? 'Yorumlanmadı' : `${C.correct}/8`);
      }
      expect(text(res.student), label).not.toContain('Çocuğunuz');
      expect(text(adult), label).not.toContain('Çocuğunuz');
      expect(text(res.parent), label).not.toMatch(
        /\b(buldun|verdin|seçtin|seçmedin|bulamadın|ulaşamadın|ettin|ayırdın|kapılmadın|aradığın|bulman|olabilirsin|olabileceğin)\b|bak\./,
      );
      expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
      n++;
    }
    expect(n).toBe(1500);
  }, 300_000);

  it('5. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, reflectionBody(undefined, 4))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, reflectionBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(rmText).not.toMatch(/kitap/i);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /DK_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 9000 + 100 * q.i })),
    );
    expect(r.student.items[0].badge).toBe('16 tuzaklı soruda 16 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(3);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/dk_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"roles\\":\[\][\s\S]*\\"lures\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.i % 2 ? q.lure : q.answer, rtMs: 12_000 })),
    );
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, reflectionBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(dusunerekKararVerme.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(dusunerekKararVerme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(dusunerekKararVerme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...dusunerekKararVerme.science, citations: [] });
    for (const a of [
      'Bialek ve Pennycook, 2018',
      'De Neys, Rossi ve Houdé, 2013',
      'Pennycook ve ark., 2016',
      'Sirota ve ark., 2021',
      'Sirota ve Juanchich, 2018',
      'Stagnaro ve ark., 2018',
      'Thomson ve Oppenheimer, 2016',
      'Young ve Shtulman, 2020a',
      '2020b',
    ])
      expect(body, a).toContain(a);
    expect(TASK_ROADMAPS[SLUG].sources.every((x) => x.url?.startsWith('https://doi.org/'))).toBe(true);
  });
});
