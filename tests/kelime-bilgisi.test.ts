import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { VOCABULARY_SPECS, kelimeBilgisi } from '@/content/instruments/kelime-bilgisi';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { VocabularyItem, VocabularyTask } from '@/lib/instruments/types';
import { VOCABULARY_TYPE_NAMES, vocabularyQuestion, vocabularyRapidMs } from '@/lib/instruments/vocabulary';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { VOCABULARY_LURE_TEXT, VOCABULARY_TYPES } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  TaskInputError,
  VOCABULARY_CHANCE_MAX,
  scoreVocabulary,
  vocabularyLurePattern,
  vocabularyRapid,
  vocabularySamePosition,
  type VocabularyTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { vocabularyBody, vocabularyOther, vocabularyRank, type VocabularyCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'kelime-bilgisi';
const task = kelimeBilgisi.tasks[0] as VocabularyTask;
const ALL: { item: VocabularyItem; answer: number }[] = [
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
const lower = (x: string) => x.toLocaleLowerCase('tr-TR');

describe('Kelime bilgisi: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; her türden altı soru düzeylere yayılır; her türden bir alıştırma', () => {
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || task.items[i - 1].level <= it.level)).toBe(true);
    expect(new Set(ALL.map((x) => x.item.key)).size).toBe(28);
    const types = ['synonym', 'antonym', 'context', 'idiom'] as const;
    expect(types.map((t) => task.items.filter((it) => it.type === t).length)).toEqual([6, 6, 6, 6]);
    // Her tür her düzeyde en az bir kez sorulur.
    for (const l of [1, 2, 3, 4, 5]) expect(new Set(task.items.filter((it) => it.level === l).map((it) => it.type)).size, String(l)).toBe(4);
    expect(task.practice.map((p) => p.type)).toEqual([...types]);
    expect(task.practice.every((p) => p.explain.length > 80)).toBe(true);
    expect(task.instructions.join(' ')).toContain('dört alıştırma sorusu');
    expect([task.answers.length, task.lures.length, task.lureKinds.length]).toEqual([24, 24, 24]);
    expect(Object.keys(VOCABULARY_TYPE_NAMES)).toEqual([...types]);
  });

  it('seçenekler ve metinler: beş farklı seçenek; vurgulanan kısım cümlede bir kez geçer; sorulan kelime seçeneklerde yok', () => {
    for (const { item } of ALL) {
      expect(item.options, item.key).toHaveLength(5);
      expect(new Set(item.options.map(lower)).size, item.key).toBe(5);
      for (const o of item.options) expect(o.trim(), `${item.key} ${o}`).toBe(o);
      if (item.type === 'synonym' || item.type === 'antonym') {
        expect(item.mark, item.key).toBeUndefined();
        expect(item.lemma, item.key).toBe(item.stem);
        expect(item.stem, item.key).toMatch(/^[\p{Ll}]+$/u);
        expect(item.options.map(lower), item.key).not.toContain(item.stem);
        // Seçenekler tek kelime ya da kısa bir söz öbeği; küçük harfle.
        for (const o of item.options) expect(o, `${item.key} ${o}`).toMatch(/^[\p{Ll}]+( [\p{Ll}]+)?$/u);
      } else {
        expect(item.mark, item.key).toBeTruthy();
        expect(item.stem.split(item.mark!).length, item.key).toBe(2);
        expect(item.stem, item.key).toMatch(/[.!]$/);
        if (item.type === 'idiom') {
          // Deyimin seçenekleri mastar biçiminde (cümledeki deyimin yerine konabilecek anlamlar).
          for (const o of item.options) expect(o, `${item.key} ${o}`).toMatch(/m[ae]k$/);
          expect(item.lemma, item.key).toMatch(/m[ae]k$/);
        } else {
          for (const o of item.options) expect(o, `${item.key} ${o}`).toMatch(/^\p{Lu}/u);
        }
      }
      expect(vocabularyQuestion(item), item.key).toContain(`“${item.lemma}”`);
      // Doğru seçenek "x, y" biçiminde virgüllü bir tanım değildir (virgül doğru seçeneği ele vermez).
      for (const o of item.options) expect(o, `${item.key} ${o}`).not.toContain(',');
    }
  });

  it('cevap anahtarı: doğru cevaplar ve çeldiriciler beş seçeneğe dengeli; art arda aynı yerde doğru cevap yok; çeldiricinin yanılgısı türüne uygun', () => {
    const count = (xs: number[]) => [1, 2, 3, 4, 5].map((o) => xs.filter((x) => x === o).length);
    expect(count(task.answers)).toEqual([5, 5, 5, 5, 4]);
    expect(count(task.lures)).toEqual([4, 5, 5, 5, 5]);
    expect(task.answers.every((a, i) => i === 0 || a !== task.answers[i - 1])).toBe(true);
    for (const [i, s] of VOCABULARY_SPECS.entries()) {
      expect(task.lures[i], s.key).not.toBe(task.answers[i]);
      expect(task.items[i].options[task.answers[i] - 1], s.key).toBe(s.right);
      expect(task.items[i].options[task.lures[i] - 1], s.key).toBe(s.lure);
      const allowed = { synonym: ['swap', 'related', 'sound'], antonym: ['swap', 'related', 'sound'], context: ['meaning'], idiom: ['literal'] }[s.type];
      expect(allowed, s.key).toContain(task.lureKinds[i]);
    }
    expect(new Set(task.lureKinds)).toEqual(new Set(['swap', 'related', 'sound', 'meaning', 'literal']));
    expect(Object.keys(VOCABULARY_LURE_TEXT)).toEqual(['swap', 'related', 'sound', 'meaning', 'literal']);
  });

  it('doğru seçenek seçeneklerin uzunluğuna ya da yazılışına bakarak bulunamaz', () => {
    // Seçenekleri bir ölçüte göre sıralayıp hep aynı sıradakini seçen biri: 24 soruda beklenen doğru sayısı rastgele
    // seçmenin üst sınırının (8) belirgin altında kalır.
    const rank = (vals: number[], k: number) => {
      const first = [...vals].sort((a, b) => b - a).indexOf(vals[k]);
      const size = vals.filter((v) => v === vals[k]).length;
      return vals.map((_, r) => (r >= first && r < first + size ? 1 / size : 0));
    };
    const totals = new Map<string, number>();
    const add = (name: string, p: number) => totals.set(name, (totals.get(name) ?? 0) + p);
    task.items.forEach((it, i) => {
      const k = task.answers[i] - 1;
      const o = it.options;
      rank(o.map((x) => x.length), k).forEach((p, r) => add(`uzunluk ${r + 1}. sıra`, p));
      rank(o.map((x) => x.split(/\s+/).length), k).forEach((p, r) => add(`kelime sayısı ${r + 1}. sıra`, p));
      // Sorudaki kelimelerle ortak kökü (ilk dört harfi) en çok olan seçenek.
      const stemWords = new Set(lower(`${it.stem} ${it.lemma}`).split(/[^\p{L}]+/u).filter((w) => w.length > 2));
      add('soruyla ortak kök', rank(o.map((x) => lower(x).split(/[^\p{L}]+/u).filter((w) => [...stemWords].some((s) => s.slice(0, 4) === w.slice(0, 4))).length), k)[0]);
      const first = o.map((x) => lower(x.split(' ')[0]));
      add('ilk kelimesi farklı olan', rank(first.map((f) => (first.filter((g) => g === f).length === 1 ? 1 : 0)), k)[0]);
      add('aynı harfle başlayan', rank(o.map((x) => (lower(x[0]) === lower(it.lemma[0]) ? 1 : 0)), k)[0]);
    });
    expect(totals.size).toBe(13);
    for (const [name, t] of totals) expect(t, name).toBeLessThanOrEqual(6.5);
  });

  it('çok hızlı cevap sınırı soru uzunluğuna göre: tek kelimelik sorularda yaklaşık 2,5, uzun cümlelerde en çok 6 saniye', () => {
    const ms = task.items.map(vocabularyRapidMs);
    expect(Math.min(...ms)).toBeGreaterThanOrEqual(2000);
    expect(Math.max(...ms)).toBeLessThanOrEqual(6000);
    expect(vocabularyRapidMs(task.items[0])).toBeLessThan(vocabularyRapidMs(task.items[23]));
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, lures: task.lures, kinds: task.lureKinds, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: kelimeBilgisi.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
    expect(VOCABULARY_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = 'b81bfb7bd437181d';

describe('Kelime bilgisi: puanlama', () => {
  const all = (fn: (i: number) => Partial<VocabularyTrialInput> = () => ({})): VocabularyTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 8000, ...fn(index) }));
  const cell = (i: number): VocabularyCell => ({ level: task.items[i].level, type: task.items[i].type, answer: task.answers[i], lure: task.lures[i], i });

  it('hatasız: 24 doğru, bütün düzeyler ve türler tam', () => {
    const { result } = scoreVocabulary(task, all());
    expect(result.correct).toBe(24);
    expect(result.reached).toBe(5);
    expect(result.types.map((t) => `${t.type} ${t.correct}/${t.n}`)).toEqual(['synonym 6/6', 'antonym 6/6', 'context 6/6', 'idiom 6/6']);
    expect([result.wrong, result.lures, result.rapid, result.rapidOf]).toEqual([0, 0, 0, 15]);
  });

  it('çeldirici türleri, çok hızlı yanlış ve hep aynı yer ayrı ayrı sayılır', () => {
    const lure = scoreVocabulary(task, all((i) => (task.items[i].level >= 4 ? { response: task.lures[i] } : {}))).result;
    expect([lure.wrong, lure.lures]).toEqual([10, 10]);
    const kinds = task.lureKinds.filter((_, i) => task.items[i].level >= 4);
    expect(lure.luresByKind).toEqual({
      swap: kinds.filter((k) => k === 'swap').length,
      related: kinds.filter((k) => k === 'related').length,
      sound: kinds.filter((k) => k === 'sound').length,
      meaning: kinds.filter((k) => k === 'meaning').length,
      literal: kinds.filter((k) => k === 'literal').length,
    });
    expect(vocabularyLurePattern(lure)).toBe(true);
    // Soru uzunluğuna göre sınırın hemen altında yanlış: çok hızlı; hemen üstünde: değil.
    const under = scoreVocabulary(task, all((i) => ({ rtMs: vocabularyRapidMs(task.items[i]) - 1, response: vocabularyOther(cell(i)) }))).result;
    expect([under.rapid, under.rapidOf, vocabularyRapid(under)]).toEqual([15, 15, true]);
    const over = scoreVocabulary(task, all((i) => ({ rtMs: vocabularyRapidMs(task.items[i]), response: vocabularyOther(cell(i)) }))).result;
    expect(over.rapid).toBe(0);
    // Hızlı ama doğru cevaplar sayılmaz.
    expect(scoreVocabulary(task, all(() => ({ rtMs: 500 }))).result.rapid).toBe(0);
    const same = scoreVocabulary(task, all(() => ({ response: 2 }))).result;
    expect([same.samePosition, vocabularySamePosition(same)]).toEqual([24, true]);
    expect(VOCABULARY_CHANCE_MAX).toBe(8);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreVocabulary(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 6, 2.5, Number.NaN]) {
      expect(() => scoreVocabulary(task, ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreVocabulary(task, ok.map((t, i) => (i === 3 ? { ...t, rtMs: -1 } : t)))).toThrow(TaskInputError);
    expect(() => scoreVocabulary({ ...task, answers: [], lures: [], lureKinds: [] }, ok)).toThrow(TaskInputError);
    // Aynı soru iki kez gelirse ilki sayılır.
    expect(scoreVocabulary(task, [...ok, { index: 0, response: task.lures[0], rtMs: 100 }]).result.correct).toBe(24);
    const bad = vocabularyBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Kelime bilgisi: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar ve soru türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, vocabularyBody((q) => ({ response: q.answer, rtMs: 4000 + 1500 * q.level })));
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Soru türleri', '4 soru türünün hepsinde soruların çoğu doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 9 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.items[2].text).toContain('kelimelerin eş ve zıt anlamlılarını, cümlede kazandıkları anlamları ve deyimleri büyük ölçüde biliyorsun');
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.valueLabel])).toEqual([
      ['Eş anlam', '6/6'],
      ['Zıt anlam', '6/6'],
      ['Cümlede anlam', '6/6'],
      ['Deyimler', '6/6'],
    ]);
    expect(rm.barsTitle).toBe('Soru türlerine göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(r.parent.items[0].text).toContain('Çocuğunuz bütün düzeylerde');
  });

  it('durumlar: rastgele düzeyi, çeldiriciler, çok hızlı, hep aynı yer, tür farkı, kolay sorularda yanılma', () => {
    const none = evaluate(SLUG, vocabularyBody((q) => ({ response: vocabularyOther(q), rtMs: 9000 })));
    expect(none.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(none.student.roadmap!.bars).toEqual([]);
    // Çeldiriciler: 4. ve 5. düzeyin hepsinde; seçilen yanılgılar sırayla anılır.
    const lure = evaluate(SLUG, vocabularyBody((q) => ({ response: q.level >= 4 ? q.lure : q.answer, rtMs: 20_000 })));
    expect(lure.student.items[0].text).toContain(
      'Yanlış cevaplarının hepsinde ilk bakışta doğru görünen ama sorulan anlama uymayan seçeneği seçtin. Bu yanlışlar şu yanılgılardan kaynaklanmış olabilir: eş anlamlı ile zıt anlamlıyı karıştırmak; kelimeyi sesçe benzeyen başka bir kelimeyle karıştırmak; kelimenin cümledeki anlamı yerine başka bir anlamını seçmek; deyimi, içindeki kelimelerin gerçek anlamıyla düşünmek.',
    );
    expect(lure.parent.items[0].text).toContain('Çocuğunuz yanlış cevaplarının hepsinde');
    // Yalnızca deyimlerde çeldirici: yalnızca o yanılgı anılır.
    const lit = evaluate(SLUG, vocabularyBody((q) => ({ response: q.type === 'idiom' && q.level >= 2 ? q.lure : q.answer, rtMs: 20_000 })));
    expect(lit.student.items[0].text).toContain('Bu yanlışlar şu yanılgıdan kaynaklanmış olabilir: deyimi, içindeki kelimelerin gerçek anlamıyla düşünmek.');
    expect(lit.student.items[2].text).toContain('“Eş anlam”, “zıt anlam” ve “cümlede anlam” sorularının çoğunu doğru buldun; “deyim” sorularında zorlandın.');
    expect(lit.student.items[2].text).toContain('Bu tür sorularda deyimlerin, içindeki kelimelerin gerçek anlamından farklı olan anlamını bilmek gerekir.');
    // Çok hızlı: uyarı ve kart aynı şeyi söyler.
    const rapid = evaluate(SLUG, vocabularyBody((q) => ({ response: q.level >= 3 ? vocabularyOther(q) : q.answer, rtMs: q.level >= 3 ? 1000 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 15 sorunun hepsinde yanlış bir cevap, soru ve seçenekler okunamayacak kadar kısa sürede verilmiş');
    expect(rapid.student.items[3].text).toContain('yanlış bir cevabı, soruyu ve seçenekleri okumaya yetmeyecek kadar kısa sürede verdin');
    expect(rapid.student.items[0].text).toContain('Bazı soruları okumadan seçmiş olabileceğin için');
    // Hep aynı yer.
    const same = evaluate(SLUG, vocabularyBody(() => ({ response: 2, rtMs: 9000 })));
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');
    // Her düzeyde en çok bir yanlış ama hepsi deyimlerde: "hemen hepsi" kartı türler kartıyla çelişmez.
    const oneType = evaluate(SLUG, vocabularyBody((q) => ({ response: ['kb14', 'kb19', 'kb23', 'kb24'].includes(task.items[q.i].key) ? q.lure : q.answer, rtMs: 15_000 })));
    expect(oneType.student.items[0].text).not.toContain('hemen hepsini');
    expect(oneType.student.items[2].text).toContain('“deyim” sorularında zorlandın');
    // 1. düzeyde iki yanlış ama üst düzeyler başarılı.
    const easy = evaluate(SLUG, vocabularyBody((q) => ({ response: q.level === 1 && vocabularyRank(q) < 2 ? vocabularyOther(q) : q.answer, rtMs: 20_000 })));
    expect(easy.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(easy.student.items[1].text).toContain('Daha kolay olan 1. düzeyde doğru bulamadığın sorular bu sonucu değiştirmedi');
    // Varsayılan örnek: ilk üç düzey tam, sonra zorlanma.
    const ex = evaluate(SLUG, vocabularyBody());
    expect(ex.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(ex.student.items[1].text).toContain('3. düzeye kadar soruların çoğunu doğru cevapladın. 3. düzeydeki sorularda şu gerekiyordu: daha seyrek geçen kelimeleri');
    expect(ex.student.items[1].text).toContain('4. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda gazete, bilim ve iş hayatı yazılarında');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: VocabularyCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      kolaydaYanilma: (q) => !(q.level === 1 && vocabularyRank(q) < 2),
      duz: (q) => vocabularyRank(q) % 2 === 0,
      sekizDogru: (q) => q.i < VOCABULARY_CHANCE_MAX,
      dokuzDogru: (q) => q.i < VOCABULARY_CHANCE_MAX + 1,
      tureGore: (q) => q.type === 'synonym' || q.type === 'antonym',
      dusukDuzey: (q) => q.level >= 2 && vocabularyRank(q) < 3,
    };
    const wrongKinds: Record<string, (q: VocabularyCell) => number> = { baska: vocabularyOther, celdirici: (q) => q.lure };
    const times: Record<string, (q: VocabularyCell) => number | null> = {
      artan: (q) => 4000 + 2500 * q.level,
      hizli: (q) => (q.level >= 3 ? 900 : 9000),
      azalan: (q) => 30_000 - 5000 * q.level,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = vocabularyBody((q) => ({ response: samePos ? 2 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const { result } = scoreVocabulary(task, (body.data as { blocks: Record<string, VocabularyTrialInput[]> }).blocks[task.key]);
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const chance = result.correct <= VOCABULARY_CHANCE_MAX;
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
              expect(r.items.map((i) => i.title), label).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.roadmap!.bars.length, label).toBe(chance ? 0 : 4);
              expect(r.cautions.some((c) => c.includes('rastgele seçen')), label).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('okunamayacak kadar kısa'));
              expect(rapidNote, label).toBe(vocabularyRapid(result));
              expect(r.items[3].text.includes('okumaya yetmeyecek kadar kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(vocabularySamePosition(result));
              expect(r.items[3].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (rapidNote || sameNote) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/okumadan seçmiş|okunmadan seçilmiş/.test(r.items[0].text), label).toBe(rapidNote || sameNote);
              expect(r.items[0].text.includes('ilk bakışta doğru görünen'), label).toBe(!chance && vocabularyLurePattern(result));
              // Yanlışlar çeldiricilerden geliyorsa kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
              if (!chance && vocabularyLurePattern(result)) expect(r.items[0].text + r.items[1].text, label).not.toMatch(/dağılmasından/);
              // Her düzeyde en çok bir yanlışta "hemen hepsi" denir; o zaman türler kartı da bir türün hepsinde zorlanıldığını söylemez.
              if (r.items[0].text.includes('hemen hepsini')) expect(r.items[2].text, label).not.toMatch(/hiçbir soru türünde/);
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge?.startsWith('1. düzeyde zorlandı')], label).toEqual(['Belirtilmedi', true]);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|seçtin|bulamadın|cevaplamadın|biliyorsun)\b/);
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(10 * 2 * 4 * 2);
  }, 240_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, vocabularyBody(undefined, 2))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, vocabularyBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    // Yetişkinler de soruları görür: sorularda ve yönergelerde okula özgü sözcük yok.
    const shown = [
      kelimeBilgisi.intro.title,
      ...kelimeBilgisi.intro.paragraphs,
      ...task.instructions,
      ...ALL.flatMap(({ item }) => [item.stem, vocabularyQuestion(item), ...item.options]),
      ...task.practice.map((p) => p.explain),
    ].join(' ');
    expect(schoolWords(shown)).toEqual([]);
    expect(Object.keys(VOCABULARY_TYPES)).toEqual(['synonym', 'antonym', 'context', 'idiom']);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /KB_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(SLUG, vocabularyBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 6000 + 500 * q.i })));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.chart).toMatchObject({ type: 'bars' });
    expect(r.parent.roadmap!.bars).toHaveLength(4);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toContain(`grep -q '${kelimeBilgisi.intro.title}' <<<"$kb_sayfa"`);
    expect(yml).toMatch(/kb_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"lures\\":\[\][\s\S]*\\"lureKinds\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, vocabularyBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, vocabularyBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar açılabilir bağlantılı', () => {
    expect(kelimeBilgisi.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(kelimeBilgisi.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    const cites = kelimeBilgisi.science.citations;
    expect(cites.map((c) => c.text.split(/[.,]/)[0])).toEqual(['Nation', 'Wright', 'Türk Dil Kurumu']);
    expect(cites.every((c) => c.url?.startsWith('https://'))).toBe(true);
    const body = JSON.stringify({ ...kelimeBilgisi.science, citations: [] });
    expect(body).toContain('Nation’ın (2009)');
    expect(body).toContain('Wright ve Cervetti’nin (2017)');
    expect(body).toContain('Güncel Türkçe Sözlüğü');
    expect(TASK_ROADMAPS[SLUG].sources.map((s) => s.url).sort()).toEqual(cites.map((c) => c.url).sort());
  });
});
