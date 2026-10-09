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
  reflectionChance,
  reflectionControlLow,
  reflectionRapid,
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
    expect([r.correct, r.lure.other, r.control.other, reflectionChance(r)]).toEqual([0, 16, 8, true]);
    expect([REFLECTION_CONTROL_NONE, REFLECTION_CONTROL_LOW, REFLECTION_TRAP_NOTE]).toEqual([3, 5, 2]);
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
      ['Yanlışların türü', 'Yanlış yok'],
      ['Benzer soru çiftleri', '8 tuzaksız soruda 8 doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 12 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Tuzaklı sorularda doğru', '16/16'],
      ['İlk akla gelen yanlış cevap', 'Yok'],
      ['Tuzaksız eş sorularda doğru', '8/8'],
      ['Soru başına tipik süre', '12 saniye'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.valueLabel])).toEqual(REFLECTION_GROUPS.map((g) => [g.name, '8/8']));
    expect(rm.barsTitle).toBe('Soru gruplarına göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(r.student.items[0].text).toContain('tuzakların hemen hepsini fark ettin');
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
    expect(intuitive.student.items[1].badge).toBe('16 yanlışın 16 tanesi ilk akla gelen cevap');
    expect(intuitive.student.items[1].text).toContain('Yanlışlarının hepsinde sorunun ilk anda akla getirdiği cevabı seçtin.');
    expect(intuitive.student.items[1].text).toContain('ikisi birlikte 120 lira eder');
    expect(intuitive.student.items[2].text).toContain(
      '8 eşin 8 tanesinde tuzaksız sorunun doğru cevabını buldun ama tuzaklı eşinde ilk akla gelen cevabı seçtin.',
    );
    expect(intuitive.parent.items[2].text).toContain('Çocuğunuz bu soruların hepsini doğru buldu.');

    const other = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.i % 2 ? reflectionOther(q) : q.answer, rtMs: 12_000 })),
    );
    expect(other.student.items[1].text).toContain(
      'ilk akla gelen cevap değil, başka bir yanlıştı. Bu tür sorularda yanlışların çoğu genellikle ilk akla gelen cevaptır',
    );

    const suspicious = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' ? q.answer : q.lure, rtMs: 12_000 })),
    );
    expect(suspicious.student.items[2].text).toContain('Bu soruların 8 tanesinde, tuzak olmadığı hâlde tuzak varmış gibi cevap verdin.');
    expect(suspicious.student.cautions.join(' ')).toContain('tuzak olmadığı hâlde tuzak varmış gibi cevap verilmiş');
    expect(suspicious.student.cautions.join(' ')).toContain('bunların hepsinde tuzak olmadığı hâlde');
    // Tuzaklıların hepsi doğru ama tuzaksızlarda da tuzak arandı: kartlar "denetledin" demez, tuzak aramaya dikkat çeker.
    expect(suspicious.student.items[0].text).toContain('her soruda tuzak aramaktan kaynaklanmış olabilir');
    expect(suspicious.student.items[1].text).toContain('her soruda tuzak aramaktan da kaynaklanmış olabilir');
    expect(suspicious.student.items[1].text).not.toContain('denetledin');

    const random = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: reflectionOther(q), rtMs: 12_000 })),
    );
    expect(random.student.items.map((i) => i.badge)).toEqual([
      '16 tuzaklı soruda 0 doğru',
      'Yorumlanmadı',
      '8 tuzaksız soruda 0 doğru',
      'Soru başına tipik süre 12 saniye',
    ]);
    expect(random.student.cautions.join(' ')).toContain('tuzaksız eş soruların da çoğu');
    expect(random.student.roadmap!.bars).toEqual([]);

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
    expect(fast.student.items[3].text).toContain('okumaya yetmeyecek kadar kısa sürede verdin');

    const same = evaluate(
      SLUG,
      reflectionBody(() => ({ response: 2, rtMs: 12_000 })),
    );
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');

    const numHard = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.domain === 'num' ? q.lure : q.answer, rtMs: 12_000 })),
    );
    expect(numHard.student.items[0].text).toContain('Sayısal sorulardaki tuzaklarda, sözel sorulardakilerden belirgin daha az doğru cevap buldun.');
    const verbHard = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.domain === 'verb' ? q.lure : q.answer, rtMs: 12_000 })),
    );
    expect(verbHard.student.items[0].text).toContain('Sözel sorulardaki tuzaklarda, sayısal sorulardakilerden belirgin daha az doğru cevap buldun.');

    // Süreler: ilk akla gelen cevaplar hızlı.
    const quickIntuitive = evaluate(
      SLUG,
      reflectionBody((q) => ({ response: q.role === 'lure' && q.i % 2 ? q.lure : q.answer, rtMs: q.role === 'lure' && q.i % 2 ? 6000 : 15_000 })),
    );
    expect(quickIntuitive.student.items[3].text).toContain(
      'İlk akla gelen cevabı seçtiğin sorularda, doğru bulduğun sorulardan daha kısa sürede cevap verdin.',
    );
    expect(quickIntuitive.student.items[3].text).toContain('Doğru bulunan tuzaklı sorularda tipik 15 saniye · ilk akla gelen cevapta 6 saniye.');
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
      const doubt = reflectionRapid(result) || reflectionSamePosition(result);
      const L = result.lure;
      const C = result.control;
      const wrong = L.n - L.correct;
      const suspicious = !chance && C.lure >= REFLECTION_TRAP_NOTE && C.lure > C.other;
      const ctrlLow = !chance && C.correct <= REFLECTION_CONTROL_LOW;
      expect([reflectionSuspicious(result), reflectionControlLow(result)], label).toEqual([suspicious, ctrlLow]);
      for (const r of [res.student, res.parent, adult]) {
        const t = text(r);
        expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
        expect(
          r.items.map((i) => i.title),
          label,
        ).toEqual(TITLES);
        for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
        expect(r.items[0].badge, label).toBe(`16 tuzaklı soruda ${L.correct} doğru`);
        expect(r.items[0].text, label).toContain(`Sayısal ${result.numLure.correct}/8 · Sözel ${result.verbLure.correct}/8.`);
        expect(r.items[1].badge, label).toBe(chance ? 'Yorumlanmadı' : wrong === 0 ? 'Yanlış yok' : `${wrong} yanlışın ${L.lure} tanesi ilk akla gelen cevap`);
        expect(r.items[2].badge, label).toBe(`8 tuzaksız soruda ${C.correct} doğru`);
        // Uyarılar.
        expect(
          r.cautions.some((c) => c.includes('tuzaksız eş soruların da çoğu')),
          label,
        ).toBe(chance);
        expect(
          r.cautions.some((c) => /tuzaksız eş soruların \d+ tanesi yanlış/.test(c)),
          label,
        ).toBe(ctrlLow);
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
        expect(a.includes('tuzaklı sorulardaki sonuç yorumlanmadı'), label).toBe(chance);
        expect(/benzer soru çiftleri kartına bak/.test(a), label).toBe(ctrlLow);
        expect(/okumadan ya da bakmadan seç/.test(a), label).toBe(!chance && doubt);
        const diff = result.numLure.correct - result.verbLure.correct;
        expect(a.includes('Sayısal sorulardaki tuzaklarda') || a.includes('sayısal sorulardaki tuzaklarda'), label).toBe(!chance && diff <= -3);
        expect(a.includes('Sözel sorulardaki tuzaklarda') || a.includes('sözel sorulardaki tuzaklarda'), label).toBe(!chance && diff >= 3);
        // Yanlışların türü.
        const b = r.items[1].text;
        const intuitiveMost = !chance && !doubt && wrong >= 2 && L.lure >= 2 && L.lure >= 2 * L.other;
        const otherMost = !chance && !doubt && wrong >= 2 && !intuitiveMost && L.other >= 2 && L.other > L.lure;
        expect(b.includes('sorunun ilk anda akla getirdiği cevabı seçt'), label).toBe(intuitiveMost);
        expect(b.includes('Bu tür sorularda yanlışların çoğu genellikle ilk akla gelen cevaptır'), label).toBe(otherMost);
        expect(b.includes('yanlışların türü yorumlanmadı'), label).toBe(chance || (doubt && wrong > 0));
        // Tuzaksız eş sorular.
        const c = r.items[2].text;
        expect(c.includes('tuzak varmış gibi cevap ver'), label).toBe(suspicious);
        expect(c.includes(' eşin '), label).toBe(!suspicious && !chance && !ctrlLow && result.pairControlOnly >= 2);
        if (c.includes(' eşin ')) expect(c, label).toContain(`8 eşin ${result.pairControlOnly} tanesinde`);
        expect(c.includes('başka bir yanlış cevap ver'), label).toBe(suspicious && C.other >= 2);
        // "Birçok kişi bu cevabı verir" yalnızca yanlışların çoğu ilk akla gelen cevapken.
        if (a.includes('birçok kişi bu cevabı verir')) expect(L.lure >= L.other, label).toBe(true);
        // Kuşkulu sonuçta dikkatsizlik ya da süre yorumu yapılmaz.
        if (doubt || chance) expect(r.items[3].text, label).not.toMatch(/daha kısa sürede cevap verd|daha çok zaman ayırd|yakın süreler/);
        // Grafik, sütunlar ve öne çıkan sayılar kartlarla aynı sayıları gösterir.
        expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(
          REFLECTION_GROUPS.map((g) => `${result[g.key].correct}/8`),
        );
        expect(
          r.roadmap!.bars.map((x) => x.valueLabel),
          label,
        ).toEqual(chance ? [] : REFLECTION_GROUPS.map((g) => `${result[g.key].correct}/8`));
        expect(r.keyFigures.find((f) => f.label === 'Tuzaksız eş sorularda doğru')?.value, label).toBe(`${C.correct}/8`);
      }
      expect(text(res.student), label).not.toContain('Çocuğunuz');
      expect(text(adult), label).not.toContain('Çocuğunuz');
      expect(text(res.parent), label).not.toMatch(
        /\b(buldun|verdin|seçtin|bulamadın|ulaşamadın|ettin|ayırdın|ayırdın|denetledin|olabilirsin|olabileceğin|kalmış olabilirsin)\b|bak\./,
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
