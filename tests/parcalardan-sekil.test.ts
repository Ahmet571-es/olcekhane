import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { ASSEMBLY_PRACTICE_SPECS, ASSEMBLY_SPECS, parcalardanSekil } from '@/content/instruments/parcalardan-sekil';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { payloadFor } from '@/lib/assessment/payload';
import { ADULT_GRADE } from '@/lib/config';
import { ASSEMBLY_EXAMPLE, parseShape, shapeArea } from '@/lib/instruments/assembly';
import type { AssemblyLure, ShapeAssemblyTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { ASSEMBLY_LURE_SEEN } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  ASSEMBLY_CHANCE_MAX,
  ASSEMBLY_LURE_NOTE,
  ASSEMBLY_LURE_P,
  ASSEMBLY_LURES_ORDER,
  ASSEMBLY_RAPID_MS,
  ASSEMBLY_SAME_MAX_CORRECT,
  TaskInputError,
  assemblyChance,
  assemblyLureStandsOut,
  assemblyRapid,
  assemblySamePosition,
  scoreAssembly,
  type AssemblyResult,
  type AssemblyTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import {
  areaOf,
  box,
  canonOf,
  congruent,
  connected,
  edgesOf,
  exactOf,
  fullSquares,
  halfSquares,
  longSentences,
  sentences,
  minRotated,
  orthoConvex,
  outline,
  overlap,
  parts,
  partsMatch,
  sameByTranslation,
  symmetry,
  tiles,
} from './helpers/assembly-check';
import { assemblyBody, assemblyLureOption, assemblyRank, type AssemblyCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'parcalardan-sekil';
const task = parcalardanSekil.tasks[0] as ShapeAssemblyTask;
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Soru türleri', 'Yanlışlarda seçilen şekiller', 'Çalışma biçimi'];
/** Her düzeyde parça sayısı. */
const PIECES_BY_LEVEL: Record<number, number[]> = {
  1: [2],
  2: [2, 3],
  3: [3],
  4: [4],
  5: [4, 5],
};

/** Sorular ve alıştırmalar, bağımsız denetimin okuduğu biçimiyle. */
const ALL = [...ASSEMBLY_SPECS, ...ASSEMBLY_PRACTICE_SPECS].map((s) => ({
  key: s.key,
  level: s.level,
  type: s.type,
  practice: s.key.startsWith('psp'),
  pieces: s.pieces.map(([shape]) => outline(shape)),
  options: [...s.options],
  lures: s.lures,
  answer: s.lures.indexOf(null),
}));
const ITEMS = ALL.filter((q) => !q.practice);
/** Parçaların (alan, yarım kare) imzaları, sıralı. */
const pieceSigs = (pieces: ReturnType<typeof outline>[]) => pieces.map((p) => `${areaOf(p)}|${halfSquares(p)}`).sort();
const countSigs = (o: string) => pieceSigs([...parts(o).values()]);

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])].filter(Boolean).join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof assemblyBody>) => (body.data as unknown as { blocks: Record<string, AssemblyTrialInput[]> }).blocks[task.key];

describe('Parçalardan şekil: sorular', () => {
  it('20 soru, 5 düzey (her birinde 4), kolaydan zora; 3 alıştırma; her soruda dört seçenek; parça sayısı düzeye uygun', () => {
    expect(task.items).toHaveLength(20);
    expect(task.practice).toHaveLength(3);
    expect(task.items.map((i) => i.level)).toEqual([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]);
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    expect(task.practice.map((p) => p.level)).toEqual([1, 2, 3]);
    for (const q of ALL) {
      expect(q.options, q.key).toHaveLength(4);
      expect(PIECES_BY_LEVEL[q.level], `${q.key} ${q.pieces.length}`).toContain(q.pieces.length);
    }
    // Parça sayısı düzeyle artar (ortalama).
    const mean = (l: number) => ITEMS.filter((q) => q.level === l).reduce((a, q) => a + q.pieces.length, 0) / 4;
    for (let l = 2; l <= 5; l++) expect(mean(l), String(l)).toBeGreaterThanOrEqual(mean(l - 1));
    // Kütüphanenin okuyucusu ile bağımsız okuyucu aynı şekilleri görür.
    for (const s of [...ASSEMBLY_SPECS, ...ASSEMBLY_PRACTICE_SPECS]) {
      for (const shape of [...s.pieces.map(([x]) => x), ...s.options]) {
        expect(shapeArea(shape), `${s.key} ${shape}`).toBe(areaOf(outline(shape)));
        expect(parseShape(shape).parts, `${s.key} ${shape}`).toBe(parts(shape).size);
      }
      // Parçaların kendisi tek parçalıdır; dikey kayma 0–1 birim.
      for (const [shape, dy] of s.pieces) {
        expect([...parts(shape).keys()], `${s.key} ${shape}`).toEqual([1]);
        expect([0, 0.5, 1], `${s.key} ${dy}`).toContain(dy);
      }
    }
    // İçerik dosyasındaki tanım ile testin kullandığı sorular aynı.
    expect(task.items.map((i) => i.options)).toEqual(ASSEMBLY_SPECS.map((s) => [...s.options]));
    expect(task.answers).toEqual(ASSEMBLY_SPECS.map((s) => s.lures.indexOf(null) + 1));
    expect(task.practice.map((p) => p.answer)).toEqual(ASSEMBLY_PRACTICE_SPECS.map((s) => s.lures.indexOf(null) + 1));
  });

  it('şekiller düzgün: her parça ve her bütün tek parça; her yatay ve dikey çizgi şekli tek aralıkta keser (oyuk, çentik, ok ucu yok)', () => {
    for (const s of [...ASSEMBLY_SPECS, ...ASSEMBLY_PRACTICE_SPECS]) {
      for (const shape of [...s.pieces.map(([x]) => x), ...s.options]) {
        expect(connected(outline(shape)), `${s.key} ${shape}`).toBe(true);
        expect(orthoConvex(shape), `${s.key} ${shape}`).toBe(true);
      }
      // Seçeneklerdeki her parça da tek parça.
      for (const o of s.options) for (const [p, pts] of parts(o)) expect(connected(pts), `${s.key} ${o} ${p}`).toBe(true);
    }
  });

  it('tek doğru cevap: doğru seçenekte çizilen parçalar verilen parçalarla bire bir aynı (yalnızca döndürerek); öteki seçeneklerde değil', () => {
    for (const q of ALL) {
      expect(
        q.lures.filter((l) => l === null),
        q.key,
      ).toHaveLength(1);
      const correct = q.options[q.answer];
      expect(partsMatch(correct, q.pieces, 'rotate'), q.key).toBe(true);
      expect(tiles(outline(correct), q.pieces, false), q.key).toBe(true);
      for (const [j, o] of q.options.entries()) {
        if (j === q.answer) continue;
        expect(partsMatch(o, q.pieces, 'rotate'), `${q.key} ${j + 1}`).toBe(false);
      }
    }
  });

  it('yanlış seçeneklerin türü bağımsız döşeme denetimiyle doğrulanır', () => {
    for (const q of ALL) {
      const k = q.pieces.length;
      const correct = outline(q.options[q.answer]);
      for (const [j, o] of q.options.entries()) {
        const lure = q.lures[j];
        if (lure === null) continue;
        const label = `${q.key} ${j + 1} ${lure}`;
        const ol = outline(o);
        const drawn = parts(o).size;
        switch (lure) {
          case 'piece':
            // Bir ya da iki parçası aynı büyüklükte ama başka biçimde: parçalar bu şekli ne döndürerek ne ters çevirerek oluşturur.
            expect([drawn, areaOf(ol)], label).toEqual([k, areaOf(correct)]);
            expect(tiles(ol, q.pieces, true), label).toBe(false);
            // 2. düzeyden itibaren değişen parçalar tam ve yarım kare sayılarını korur: kareleri saymak yanlışı ele vermez.
            if (q.level >= 2) expect(countSigs(o), label).toEqual(pieceSigs(q.pieces));
            break;
          case 'mirror':
            // Parçalardan biri ters çevrilmiş: çizilen parçalar ancak ters çevirmeyle eşleşir; şekil ancak ters çevirerek kurulur.
            expect([drawn, areaOf(ol)], label).toEqual([k, areaOf(correct)]);
            expect(partsMatch(o, q.pieces, 'flip'), label).toBe(true);
            expect(tiles(ol, q.pieces, false), label).toBe(false);
            expect(tiles(ol, q.pieces, true), label).toBe(true);
            break;
          case 'size':
            // Bir parçası bir kare büyük ya da küçük; yalnızca 1. ve 2. düzeyde.
            expect(q.level, label).toBeLessThanOrEqual(2);
            expect(drawn, label).toBe(k);
            expect(Math.abs(areaOf(ol) - areaOf(correct)), label).toBe(1);
            break;
          case 'odd':
            // Parçalardan biri ikiye bölünmüş: bir parça fazla; yalnızca 1. düzeyde.
            expect(q.level, label).toBe(1);
            expect([drawn, areaOf(ol)], label).toEqual([k + 1, areaOf(correct)]);
            expect(tiles(ol, q.pieces, true), label).toBe(false);
            break;
        }
        // Hiçbir yanlış seçeneğin dış hattı doğru şekle benzemez; parçalar döndürülerek hiçbirini tıpatıp dolduramaz.
        expect(congruent(ol, correct, true), label).toBe(false);
        expect(tiles(ol, q.pieces, false), label).toBe(false);
      }
      // Yanlış seçeneklerin dış hatları birbirinden farklı.
      const wrong = q.options.filter((_, j) => j !== q.answer).map(outline);
      for (let a = 0; a < wrong.length; a++) for (let b = a + 1; b < wrong.length; b++) expect(congruent(wrong[a], wrong[b], true), `${q.key} ${a} ${b}`).toBe(false);
      // 3. düzeyden itibaren dört seçeneğin alanı ve parça sayısı aynı.
      if (q.level >= 3) {
        expect(new Set(q.options.map((o) => areaOf(outline(o)))).size, q.key).toBe(1);
        expect(new Set(q.options.map((o) => parts(o).size)).size, q.key).toBe(1);
      }
    }
  });

  it('soru türleri: kaydırma sorularında parçalar doğru şekildeki yönleriyle; döndürme ve ayna sorularında en az biri döndürülmüş; 5. düzeyde hepsi', () => {
    for (const q of ALL) {
      const correct = q.options[q.answer];
      expect(partsMatch(correct, q.pieces, 'translate'), q.key).toBe(q.type === 'slide');
      expect(q.lures.includes('mirror'), q.key).toBe(q.type === 'mirror');
      if (q.level === 5) {
        // Her parça, doğru şekildeki yönünden başka bir yöne döndürülmüş gösterilir.
        const drawn = [...parts(correct).values()];
        for (const [i, p] of q.pieces.entries())
          expect(
            drawn.some((d) => sameByTranslation(d, p)),
            `${q.key} ${i}`,
          ).toBe(false);
      }
    }
    const count = (t: string) => ITEMS.filter((q) => q.type === t).length;
    expect([count('slide'), count('turn'), count('mirror')]).toEqual([6, 8, 6]);
    expect(ITEMS.filter((q) => q.level === 1).every((q) => q.type === 'slide')).toBe(true);
    expect(ITEMS.filter((q) => q.level === 2).every((q) => q.type === 'turn')).toBe(true);
    // Kolay yanılgılar yalnızca kolay düzeylerde; ayna yanılgısı 3. düzeyden itibaren.
    const offered = (l: AssemblyLure) => ITEMS.filter((q) => q.lures.includes(l)).map((q) => q.level);
    expect(Math.max(...offered('odd'))).toBe(1);
    expect(Math.max(...offered('size'))).toBeLessThanOrEqual(2);
    expect(Math.min(...offered('mirror'))).toBe(3);
    expect(new Set(ALL.flatMap((q) => q.lures))).toEqual(new Set([null, 'piece', 'mirror', 'size', 'odd']));
    // Düzey anlatımlarındaki döndürülmüş parça sayıları: 1. düzeyde yok, 2. ve 3. düzeyde bir (kaydırma sorusunda yok),
    // 4. düzeyde iki (kaydırma sorusunda yok), 5. düzeyde hepsi.
    const turned = (l: number) => ITEMS.filter((q) => q.level === l).map((q) => `${q.type}:${minRotated(q.options[q.answer], q.pieces)}/${q.pieces.length}`);
    expect(turned(1)).toEqual(['slide:0/2', 'slide:0/2', 'slide:0/2', 'slide:0/2']);
    expect(turned(2).map((x) => x.split('/')[0])).toEqual(['turn:1', 'turn:1', 'turn:1', 'turn:1']);
    expect(turned(3).map((x) => x.split('/')[0])).toEqual(['slide:0', 'turn:1', 'mirror:1', 'mirror:1']);
    expect(turned(4).map((x) => x.split('/')[0])).toEqual(['slide:0', 'turn:2', 'mirror:2', 'mirror:2']);
    for (const x of turned(5)) expect(x.split(':')[1].split('/')[0], x).toBe(x.split('/')[1]);
    expect(task.levels.map((l) => l.plain)).toEqual([
      'Döndürülmeden gösterilen iki parçanın, yalnızca yan yana kaydırılınca hangi şekli oluşturduğunu bulmak.',
      'İki ya da üç parçadan biri döndürülmüş gösterildiğinde, onu zihinde çevirip bütünü bulmak.',
      'Dağınık duran üç parçayı birleştirmek ve bazı sorularda ters çevrilmiş bir parçayla kurulan şekli doğru şekilden ayırmak.',
      'Dört parçayı (çoğu soruda ikisi döndürülmüşken) birleştirmek ve birbirine çok benzeyen seçenekleri ayırmak.',
      'Hepsi döndürülmüş dört ya da beş parçayı birleştirmek ve doğru şekle çok benzeyen seçenekleri ayırmak.',
    ]);
    // Rapordaki tür kartının cümlesi: yalnızca kaydırma sorularının çoğu 1. düzeyde, ayna tuzaklı sorular yalnızca 3–5. düzeylerde.
    const slides = ITEMS.filter((q) => q.type === 'slide');
    expect(slides.filter((q) => q.level === 1).length * 2).toBeGreaterThan(slides.length);
    expect(new Set(ITEMS.filter((q) => q.type === 'mirror').map((q) => q.level))).toEqual(new Set([3, 4, 5]));
    // Parça sayıları (2. düzey "iki ya da üç", 5. düzey "dört ya da beş").
    expect(new Set(ITEMS.filter((q) => q.level === 2).map((q) => q.pieces.length))).toEqual(new Set([2, 3]));
    expect(new Set(ITEMS.filter((q) => q.level === 5).map((q) => q.pieces.length))).toEqual(new Set([4, 5]));
  });

  it('doğru cevapların yeri dengeli: her harf beş kez, art arda aynı harf yok', () => {
    const answers = ITEMS.map((q) => q.answer + 1);
    for (const a of [1, 2, 3, 4])
      expect(
        answers.filter((x) => x === a),
        String(a),
      ).toHaveLength(5);
    expect(answers.every((a, i) => i === 0 || a !== answers[i - 1])).toBe(true);
    expect(new Set(task.practice.map((p) => p.answer)).size).toBe(3);
  });

  it('doğru seçenek kestirme yollarla bulunamaz: her yol 20 soruda en çok 7 doğru verir (rastgele seçim: 5)', () => {
    type Q = (typeof ITEMS)[number];
    const metric: Record<string, (q: Q, o: string) => number> = {
      alan: (_, o) => areaOf(outline(o)),
      tamKare: (_, o) => fullSquares(outline(o)),
      yarimKare: (_, o) => halfSquares(outline(o)),
      simetri: (_, o) => symmetry(outline(o)),
      benzerlik: (q, o) => q.options.filter((x) => x !== o).reduce((a, x) => a + overlap(outline(o), outline(x)), 0),
      parcaSayisi: (_, o) => parts(o).size,
      ikiziVar: (q, o) => (q.options.some((x) => x !== o && congruent(outline(x), outline(o), false)) ? 1 : 0),
      genislik: (_, o) => box(outline(o))[0] * 10 + box(outline(o))[1],
      enBuyukParca: (_, o) => Math.max(...[...parts(o).values()].map(areaOf)),
      enKucukParca: (_, o) => Math.min(...[...parts(o).values()].map(areaOf)),
    };
    for (const [name, f] of Object.entries(metric)) {
      for (const dir of [1, -1]) {
        // Eşitlikte puan eşit bölünür: rastgele seçen biri 20 soruda ortalama 5 doğru bulur.
        let hits = 0;
        for (const q of ITEMS) {
          const v = q.options.map((o) => dir * f(q, o));
          const best = Math.max(...v);
          const tied = v.flatMap((x, j) => (Math.abs(x - best) < 1e-9 ? [j] : []));
          if (tied.includes(q.answer)) hits += 1 / tied.length;
        }
        expect(hits, `${name} ${dir > 0 ? 'en çok' : 'en az'}`).toBeLessThanOrEqual(7);
      }
    }
    // Eleme yolları: seçeneklerden bir özelliği tutanlar bırakılır, aralarından rastgele seçilir (hiçbiri tutmuyorsa hepsi).
    const keep: Record<string, (q: Q, o: string) => boolean> = {
      // Parçaların tam ve yarım kare sayıları verilen parçalarınkiyle aynı.
      sayim: (q, o) => JSON.stringify(countSigs(o)) === JSON.stringify(pieceSigs(q.pieces)),
      parcaAlanlari: (q, o) => JSON.stringify([...parts(o).values()].map(areaOf).sort()) === JSON.stringify(q.pieces.map(areaOf).sort()),
      ucgenSayisi: (q, o) => [...parts(o).values()].reduce((a, p) => a + halfSquares(p), 0) === q.pieces.reduce((a, p) => a + halfSquares(p), 0),
    };
    for (const [name, ok] of Object.entries(keep)) {
      let hits = 0;
      for (const q of ITEMS) {
        const kept = q.options.flatMap((o, j) => (ok(q, o) ? [j] : []));
        const pool = kept.length ? kept : [0, 1, 2, 3];
        if (pool.includes(q.answer)) hits += 1 / pool.length;
      }
      expect(hits, name).toBeLessThanOrEqual(7);
    }
    // Ortak parça: ötekilerle en çok parça paylaşan seçenek (döndürerek, ters çevirerek ya da olduğu gibi aynı parçalar;
    // tam ve yarım kare sayısı ya da yalnızca alanı aynı parçalar).
    const classes: Record<string, (p: ReturnType<typeof outline>) => string> = {
      ortakParca: (p) => canonOf(p, false),
      ortakParcaAyna: (p) => canonOf(p, true),
      ortakParcaAyni: (p) => exactOf(p),
      ortakSayim: (p) => `${areaOf(p)}|${halfSquares(p)}`,
      ortakAlan: (p) => String(areaOf(p)),
    };
    const shared = (a: string[], b: string[]) => {
      const rest = [...b];
      let n = 0;
      for (const x of a) {
        const i = rest.indexOf(x);
        if (i < 0) continue;
        rest.splice(i, 1);
        n++;
      }
      return n;
    };
    for (const [name, cls] of Object.entries(classes)) {
      let hits = 0;
      for (const q of ITEMS) {
        const c = q.options.map((o) => [...parts(o).values()].map(cls));
        const v = c.map((x, i) => c.reduce((a, y, j) => (j === i ? a : a + shared(x, y)), 0));
        const best = Math.max(...v);
        const tied = v.flatMap((x, j) => (x === best ? [j] : []));
        if (tied.includes(q.answer)) hits += 1 / tied.length;
      }
      expect(hits, name).toBeLessThanOrEqual(7);
    }
    // Tek kalan ya da çoğunluktaki seçenek: kutunun yönü ve boyu, dış hattın yarım kareleri ve kenarları, simetri, parçalardaki
    // yarım kareler, alan, parça sayısı.
    const feats: Record<string, (o: string) => string> = {
      kutuYonu: (o) => String(box(outline(o))[0] > box(outline(o))[1]),
      kutu: (o) => box(outline(o)).join('x'),
      disYarim: (o) => String(halfSquares(outline(o))),
      kenarlar: (o) => edgesOf(outline(o)),
      simetri: (o) => String(symmetry(outline(o))),
      parcaYarim: (o) => String([...parts(o).values()].reduce((a, p) => a + halfSquares(p), 0)),
      alan: (o) => String(areaOf(outline(o))),
      parcaSayisi: (o) => String(parts(o).size),
    };
    for (const [name, f] of Object.entries(feats)) {
      let odd = 0;
      let major = 0;
      for (const q of ITEMS) {
        const vals = q.options.map(f);
        const n = (x: string) => vals.filter((y) => y === x).length;
        const uniq = vals.flatMap((x, j) => (n(x) === 1 ? [j] : []));
        odd += uniq.length === 1 ? (uniq[0] === q.answer ? 1 : 0) : 0.25;
        const m = Math.max(...vals.map(n));
        const kept = vals.flatMap((x, j) => (n(x) === m ? [j] : []));
        if (kept.includes(q.answer)) major += 1 / kept.length;
      }
      expect(odd, `tek kalan ${name}`).toBeLessThanOrEqual(7);
      expect(major, `çoğunlukta ${name}`).toBeLessThanOrEqual(7);
    }
  });

  it('alıştırmalar: açıklamalar seçeneklerle uyumlu; yönergedeki örnek doğru', () => {
    const [p1, p2, p3] = ALL.filter((q) => q.practice);
    expect([p1.type, p2.type, p3.type]).toEqual(['slide', 'turn', 'mirror']);
    expect([...p1.lures].sort()).toEqual([null, 'odd', 'piece', 'size'].sort());
    expect(p3.lures).toContain('mirror');
    // Açıklama doğru harfi söyler ve her yanlış harfin neden yanlış olduğunu kendi türünün sözüyle anlatır.
    const WORD: Record<string, RegExp> = {
      piece: /başka biçimde/,
      mirror: /ters çevrilmiş/,
      size: /daha büyük|daha küçük/,
      odd: /parça sayısı farklı/,
    };
    for (const [n, q] of [p1, p2, p3].entries()) {
      const ex = task.practice[n].explain;
      expect(ex.startsWith(`${'ABCD'[q.answer]} şekli doğru:`), ex).toBe(true);
      const parts = sentences(ex);
      for (const [j, l] of q.lures.entries()) {
        if (l === null) continue;
        const L = 'ABCD'[j];
        expect(
          parts.some((x) => new RegExp(`(^|\\s)${L}( |\\s|$)|(^|\\s)${L} şekl`).test(x) && WORD[l].test(x)),
          `${n} ${L} ${l}`,
        ).toBe(true);
      }
    }
    // Örnek: iki parça döndürülmeden yan yana birleşince bütün olur.
    const ex = ASSEMBLY_EXAMPLE.pieces.map((p) => outline(p.shape));
    expect(partsMatch(ASSEMBLY_EXAMPLE.whole, ex, 'translate')).toBe(true);
    expect(tiles(outline(ASSEMBLY_EXAMPLE.whole), ex, false)).toBe(true);
    // Yönergede ve alıştırmalarda okula özgü sözcük yok (yetişkinler de çözer).
    expect(schoolWords([parcalardanSekil.intro.title, ...parcalardanSekil.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
  });

  it('çözme sayfasına cevap anahtarı, yanılgı türleri ve düzey anlatımları gitmez', () => {
    const p = payloadFor(parcalardanSekil, 6);
    if (p.engine !== 'tasks') throw new Error('görev değil');
    const t = p.tasks.find((x) => x.key === task.key) as ShapeAssemblyTask;
    expect([t.answers, t.optionLures, t.levels]).toEqual([[], [], []]);
    expect(t.items).toEqual(task.items);
    expect(JSON.stringify(t.items)).not.toMatch(/lure|answer/);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(
        JSON.stringify({
          items: task.items,
          practice: task.practice,
          answers: task.answers,
          lures: task.optionLures,
          levels: task.levels,
        }),
      )
      .digest('hex')
      .slice(0, 16);
    expect({ version: parcalardanSekil.version, hash }).toEqual({
      version: 2,
      hash: SORU_IZI,
    });
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = 'cecf933fb5655d3a';

describe('Parçalardan şekil: puanlama', () => {
  const all = (fn: (i: number) => Partial<AssemblyTrialInput> = () => ({})): AssemblyTrialInput[] =>
    task.items.map((_, index) => ({
      index,
      response: task.answers[index],
      rtMs: 12_000,
      ...fn(index),
    }));
  const cell = (i: number): AssemblyCell => ({
    level: task.items[i].level,
    type: task.items[i].type,
    answer: task.answers[i],
    lures: task.optionLures[i],
    i,
  });

  it('hatasız: 20 doğru, bütün düzeyler tam, üç soru türü', () => {
    const { result } = scoreAssembly(task, all());
    expect([result.correct, result.reached, result.wrong, result.rapid, result.rapidOf, result.samePosition]).toEqual([20, 5, 0, 0, 12, 5]);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['4/4', '4/4', '4/4', '4/4', '4/4']);
    expect(result.types.map((x) => `${x.type} ${x.correct}/${x.n}`)).toEqual(['slide 6/6', 'turn 8/8', 'mirror 6/6']);
    const offered = Object.fromEntries(ASSEMBLY_LURES_ORDER.map((k) => [k, task.optionLures.flat().filter((x) => x === k).length]));
    expect(result.offeredByKind).toEqual(offered);
    expect(Object.values(result.offeredByKind).reduce((a, b) => a + b, 0)).toBe(60);
    expect(result.medianRt).toBe(12_000);
  });

  it('yanılgı türleri, çok hızlı yanlış ve hep aynı yer ayrı ayrı sayılır', () => {
    const mirror = scoreAssembly(
      task,
      all((i) => (task.items[i].type === 'mirror' ? { response: assemblyLureOption(cell(i), 'mirror') } : {})),
    ).result;
    expect([mirror.wrong, mirror.luresByKind.mirror, mirror.luresByKind.piece]).toEqual([6, 6, 0]);
    expect(mirror.types.map((x) => `${x.type} ${x.correct}/${x.n}`)).toEqual(['slide 6/6', 'turn 8/8', 'mirror 0/6']);
    const piece = scoreAssembly(
      task,
      all((i) => (i % 2 ? { response: assemblyLureOption(cell(i), 'piece') } : {})),
    ).result;
    expect([piece.wrong, piece.luresByKind.piece]).toEqual([10, 10]);
    const rapid = scoreAssembly(
      task,
      all((i) => ({
        rtMs: ASSEMBLY_RAPID_MS - 1,
        response: assemblyLureOption(cell(i)),
      })),
    ).result;
    expect([rapid.rapid, rapid.rapidOf, assemblyRapid(rapid)]).toEqual([12, 12, true]);
    expect(
      scoreAssembly(
        task,
        all(() => ({ rtMs: ASSEMBLY_RAPID_MS - 1 })),
      ).result.rapid,
    ).toBe(0);
    const same = scoreAssembly(
      task,
      all(() => ({ response: 3 })),
    ).result;
    expect([same.samePosition, assemblySamePosition(same)]).toEqual([20, true]);
    expect(ASSEMBLY_CHANCE_MAX).toBe(8);
    expect(ASSEMBLY_LURE_NOTE).toBe(3);
    // Kolay ve zor sorulardaki tipik süre ayrı hesaplanır.
    const pace = scoreAssembly(
      task,
      all((i) => ({ rtMs: 1000 * task.items[i].level })),
    ).result;
    expect([pace.rtEasy, pace.rtHard, pace.medianRt]).toEqual([1500, 4500, 3000]);
  });

  it('şans düzeyi: hiçbir düzeye ulaşılmadı ve en çok 8 doğru (rastgele seçimde 9 ya da daha çok doğrunun olasılığı %5’ten az)', () => {
    // 20 soruda, dört seçenekte rastgele seçimle en az 9 doğru bulma olasılığı.
    const binom = (n: number, k: number) => {
      let c = 1;
      for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
      return c;
    };
    const p9 = [...Array(12)].reduce((a, _, j) => a + binom(20, 9 + j) * 0.25 ** (9 + j) * 0.75 ** (11 - j), 0);
    const p8 = p9 + binom(20, 8) * 0.25 ** 8 * 0.75 ** 12;
    expect(p9).toBeLessThan(0.05);
    expect(p8).toBeGreaterThan(0.05);
    const eight = scoreAssembly(
      task,
      all((i) => (i >= 8 ? { response: assemblyLureOption(cell(i)) } : {})),
    ).result;
    expect([eight.correct, eight.reached]).toEqual([8, 2]);
    expect(assemblyChance(eight)).toBe(false);
    const scattered = scoreAssembly(
      task,
      all((i) => (i % 5 < 2 ? {} : { response: assemblyLureOption(cell(i)) })),
    ).result;
    expect([scattered.correct, scattered.reached, assemblyChance(scattered)]).toEqual([8, 0, true]);
  });

  it('yanılgının beklenenden sık olup olmadığı: olasılık, yanlışlardaki seçeneklerin bütün birleşimleri sayılarak doğrulanır', () => {
    const exact = (r: AssemblyResult, wrongIdx: number[], k: AssemblyLure) => {
      let hit = 0;
      let total = 0;
      const walk = (d: number, count: number) => {
        if (d === wrongIdx.length) {
          total++;
          if (count >= r.luresByKind[k]) hit++;
          return;
        }
        for (const l of task.optionLures[wrongIdx[d]].filter((x) => x !== null)) walk(d + 1, count + (l === k ? 1 : 0));
      };
      walk(0, 0);
      return hit / total;
    };
    const patterns: ((i: number) => Partial<AssemblyTrialInput>)[] = [
      (i) => (task.items[i].type === 'mirror' ? { response: assemblyLureOption(cell(i), 'mirror') } : {}),
      (i) => (i % 2 ? { response: assemblyLureOption(cell(i), 'piece') } : {}),
      (i) => (i >= 12 ? { response: assemblyLureOption(cell(i), 'piece') } : {}),
      (i) => (i % 3 === 0 ? { response: assemblyLureOption(cell(i)) } : {}),
    ];
    for (const [n, fn] of patterns.entries()) {
      const trials = all(fn);
      const r = scoreAssembly(task, trials).result;
      const wrongIdx = trials.filter((t) => t.response !== task.answers[t.index]).map((t) => t.index);
      expect(wrongIdx.length, String(n)).toBeLessThanOrEqual(10);
      for (const k of ASSEMBLY_LURES_ORDER) expect(r.lureP[k], `${n} ${k}`).toBeCloseTo(exact(r, wrongIdx, k), 3);
    }
    const mirror = scoreAssembly(
      task,
      all((i) => (task.items[i].type === 'mirror' ? { response: assemblyLureOption(cell(i), 'mirror') } : {})),
    ).result;
    expect(ASSEMBLY_LURES_ORDER.filter((k) => assemblyLureStandsOut(mirror, k))).toEqual(['mirror']);
    const spread = scoreAssembly(
      task,
      all((i) =>
        i % 2
          ? {
              response: assemblyLureOption(cell(i), ASSEMBLY_LURES_ORDER[i % 3]),
            }
          : {},
      ),
    ).result;
    expect(spread.wrong).toBe(10);
    expect(ASSEMBLY_LURE_P).toBe(0.05);
  });

  it('aynı sıradaki seçenek: çok doğru cevap verende bakmadan seçmeye bağlanmaz', () => {
    const strong = scoreAssembly(
      task,
      all((i) => (i >= 16 ? { response: 1 } : {})),
    ).result;
    expect(strong.correct).toBeGreaterThan(ASSEMBLY_SAME_MAX_CORRECT);
    expect(assemblySamePosition(strong)).toBe(false);
    const weak = scoreAssembly(
      task,
      all((i) => (i >= 8 ? { response: 1 } : {})),
    ).result;
    expect([weak.correct <= ASSEMBLY_SAME_MAX_CORRECT, weak.samePosition >= 10, assemblySamePosition(weak)]).toEqual([true, true, true]);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreAssembly(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 5, 2.5, Number.NaN]) {
      expect(
        () =>
          scoreAssembly(
            task,
            ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t)),
          ),
        String(bad),
      ).toThrow(TaskInputError);
    }
    expect(() =>
      scoreAssembly(
        task,
        ok.map((t, i) => (i === 3 ? { ...t, rtMs: -5 } : t)),
      ),
    ).toThrow(TaskInputError);
    expect(() => scoreAssembly(task, [...ok, { index: 20, response: 1, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreAssembly(task, [...ok, { index: 0, response: 1, rtMs: 1 }]).result.correct).toBe(20);
    expect(() => scoreAssembly({ ...task, answers: [], optionLures: [] }, ok)).toThrow(TaskInputError);
    const bad = assemblyBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Parçalardan şekil: rapor', () => {
  it('hatasız: beş kart, öne çıkan sayılar, düzeylere göre grafik ve soru türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(
      SLUG,
      assemblyBody((q) => ({
        response: q.answer,
        rtMs: 6000 + 4000 * q.level,
      })),
    );
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '20 soruda 20 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Soru türleri', '3 soru türünün hepsinde bütün sorular doğru'],
      ['Yanlışlarda seçilen şekiller', 'Yanlış cevap yok'],
      ['Çalışma biçimi', 'Soru başına tipik süre 18 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '20/20'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Soru başına tipik süre', '18 saniye'],
    ]);
    const paceRows = r.student.items[4].visual?.type === 'bars' ? r.student.items[4].visual.rows : [];
    expect(paceRows.map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['Bütün sorular 18 sn', 'Kolay sorular (1–2. düzey) 12 sn', 'Zor sorular (4–5. düzey) 24 sn']);
    expect(r.student.items[4].text).toContain('Zor sorulara kolay sorulardan daha çok zaman ayırdın.');
    expect(r.student.items[2].text).toContain('Üç soru türünün her birinde bütün soruları doğru buldun.');
    expect(r.student.items[2].text).toContain(
      'Her türde yalnızca birkaç soru vardı. Yalnızca kaydırma sorularının çoğu 1. düzeydeydi; ayna tuzaklı sorular ise yalnızca 3–5. düzeylerde soruldu.',
    );
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.key, b.valueLabel])).toEqual([
      ['slide', '6/6'],
      ['turn', '8/8'],
      ['mirror', '6/6'],
    ]);
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    for (const i of r.student.items) expect(i.visual, i.title).toBeDefined();
  });

  it('durumlar: rastgele düzeyi, ayna yanılgısı, çok hızlı, hep aynı yer, kolay sorularda yanılma, türlerde zorlanma', () => {
    const none = evaluate(
      SLUG,
      assemblyBody((q) => ({ response: assemblyLureOption(q), rtMs: 9000 })),
    );
    expect(none.student.items.map((i) => i.badge)).toEqual(['20 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(none.student.roadmap!.bars).toEqual([]);
    for (const i of none.student.items.slice(1, 4)) expect(i.visual, i.title).toBeUndefined();

    const ayna = evaluate(
      SLUG,
      assemblyBody((q) => ({
        response: q.type === 'mirror' ? assemblyLureOption(q, 'mirror') : q.answer,
        rtMs: 15_000,
      })),
    );
    expect(ayna.student.items[3].badge).toBe('“Ters çevrilmiş parça” öne çıkıyor');
    expect(ayna.student.items[3].text).toContain(`6 yanlış cevabının hepsinde ${ASSEMBLY_LURE_SEEN.mirror} seçildi. Bu, rastgele seçimle açıklanamayacak kadar sık.`);
    expect(ayna.student.items[3].text).toContain('Parçalar döndürülebilir ama ters çevrilemez.');
    expect(ayna.parent.items[3].text).toContain('Çocuğunuzun, bir parçanın eğik kenarının');
    expect(ayna.student.items[0].text).toContain('öne çıkan yanılgı için “Yanlışlarda seçilen şekiller” kartına bak.');
    expect(ayna.student.items[2].badge).toBe('3 soru türünün 2 tanesinde soruların çoğu doğru');
    expect(ayna.student.items[2].text).toContain('“Yalnızca kaydırma” ve “döndürme gereken” sorularının çoğunu doğru buldun; “ayna tuzaklı” sorularında zorlandın.');
    expect(ayna.student.items[2].text).toContain('“Ayna tuzaklı” sorularında bir parçanın ters çevrilmiş');

    const rapid = evaluate(
      SLUG,
      assemblyBody((q) => ({
        response: q.level >= 3 ? assemblyLureOption(q) : q.answer,
        rtMs: q.level >= 3 ? 1500 : 12_000,
      })),
    );
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 12 sorunun hepsinde yanlış bir cevap 3 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[4].text).toContain('3. düzey ve üstündeki 12 sorunun hepsine 3 saniyeden kısa sürede yanlış cevap verdin.');
    expect(rapid.student.items[3].badge).toBe('Yorumlanmadı');
    // Sonuç kuşkuluyken soru türleri de karşılaştırılmaz: kart, üç boyutlu grafik ve kartın grafiği yok.
    expect([rapid.student.items[2].badge, rapid.student.items[2].text]).toEqual(['Yorumlanmadı', 'Çalışma biçimi kartında anlatılan nedenle soru türleri karşılaştırılmadı.']);
    expect(rapid.student.items[2].visual).toBeUndefined();
    expect(rapid.student.roadmap!.bars).toEqual([]);
    expect(rapid.student.items[0].text).toContain('seçeneklere bakmadan seçmiş olabileceğin');

    const same = evaluate(
      SLUG,
      assemblyBody(() => ({ response: 2, rtMs: 9000 })),
    );
    expect(same.student.items[4].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');

    const slip = evaluate(
      SLUG,
      assemblyBody((q) => ({
        response: q.level === 1 && assemblyRank(q) < 2 ? assemblyLureOption(q) : q.answer,
        rtMs: 12_000,
      })),
    );
    expect(slip.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(slip.student.items[3].badge).toBe('2 yanlış');

    const drop = evaluate(SLUG, assemblyBody());
    expect(drop.student.items[0].badge).toBe('20 soruda 16 doğru');
    expect(drop.student.items[1].badge).toBe('3. düzey');
    expect(drop.student.items[1].text).toContain('4. düzeydeki 4 sorunun 2 tanesini doğru bulamadın');

    const hard0 = evaluate(
      SLUG,
      assemblyBody((q) => ({
        response: q.level <= 3 ? q.answer : assemblyLureOption(q),
        rtMs: 12_000,
      })),
    );
    expect(hard0.student.items[1].badge).toBe('3. düzey');
    expect(hard0.student.items[1].text).toContain('4. düzeydeki 4 sorunun hiçbirini doğru bulamadın');

    const all = evaluate(
      SLUG,
      assemblyBody((q) => ({ response: q.answer, rtMs: 9000 })),
    );
    expect(all.student.items[0].text).toContain('Bütün soruları doğru cevapladın');
    expect(all.student.items[1].text).toContain('5. düzey testin en zor düzeyiydi.');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: AssemblyCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkDort: (q) => q.level <= 4,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkBir: (q) => q.level <= 1,
      kolaydaYanilma: (q) => !(q.level === 1 && assemblyRank(q) < 3),
      duz: (q) => assemblyRank(q) % 2 === 0,
      sekizDogru: (q) => q.i < ASSEMBLY_CHANCE_MAX,
      dokuzDogru: (q) => q.i < ASSEMBLY_CHANCE_MAX + 1,
      zorDogru: (q) => q.level >= 3,
      aynaYanlis: (q) => q.type !== 'mirror',
      donmeYanlis: (q) => q.type === 'slide',
      kaydirmaYanlis: (q) => q.type !== 'slide',
      birYanlis: (q) => q.i !== 7,
      ikiYanlis: (q) => q.i !== 7 && q.i !== 12,
    };
    const wrongKinds: Record<string, (q: AssemblyCell) => number> = {
      parca: (q) => assemblyLureOption(q, 'piece'),
      ayna: (q) => assemblyLureOption(q, 'mirror'),
      boyut: (q) => assemblyLureOption(q, 'size'),
      karisik: (q) => assemblyLureOption(q, ASSEMBLY_LURES_ORDER[q.i % 4]),
    };
    const times: Record<string, (q: AssemblyCell) => number | null> = {
      artan: (q) => 5000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 7000 * q.level,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = assemblyBody(
              (q) => ({
                response: samePos ? 2 : correct(q) ? q.answer : wrong(q),
                rtMs: rt(q),
              }),
              7,
            );
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const result: AssemblyResult = scoreAssembly(task, trialsOf(body)).result;
            const adult = evaluateAdult(SLUG, {
              ...body,
              grade: ADULT_GRADE,
            }).adult;
            const chance = assemblyChance(result);
            const doubt = assemblyRapid(result) || assemblySamePosition(result);
            const noted = chance || doubt ? [] : ASSEMBLY_LURES_ORDER.filter((k) => result.luresByKind[k] >= ASSEMBLY_LURE_NOTE && result.lureP[k] <= ASSEMBLY_LURE_P);
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              // Cümleler kısa: en çok 22 sözcük.
              expect(
                [...r.items.map((i) => i.text), ...r.cautions].flatMap((x) => longSentences(x)),
                label,
              ).toEqual([]);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
              expect(
                r.items.map((i) => i.title),
                label,
              ).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              expect(r.items[0].badge, label).toBe(`20 soruda ${result.correct} doğru`);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance || doubt);
              expect(r.items[3].badge === 'Yorumlanmadı', label).toBe(chance || (doubt && result.wrong > 0));
              // Üç boyutlu grafik (yol haritasında) yalnızca sonuç yorumlanıyorsa; sütunlar soru türlerinin doğruları.
              expect(
                r.roadmap!.bars.map((b) => b.valueLabel),
                label,
              ).toEqual(chance || doubt ? [] : result.types.map((x) => `${x.correct}/${x.n}`));
              expect(
                r.cautions.some((c) => c.includes('rastgele seçen')),
                label,
              ).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('3 saniyeden kısa'));
              expect(rapidNote, label).toBe(assemblyRapid(result));
              expect(r.items[4].text.includes('3 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(assemblySamePosition(result));
              expect(r.items[4].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (doubt) expect(r.items[4].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/seçeneklere bakmadan seçmiş|seçeneklere bakılmadan seçilmiş/.test(r.items[0].text), label).toBe(doubt);
              const yan = r.items[3].text;
              expect(yan.includes('rastgele seçimle açıklanamayacak kadar sık'), label).toBe(noted.length > 0);
              for (const k of noted) {
                const many = result.luresByKind[k] === result.wrong ? 'hepsinde' : `${result.luresByKind[k]} tanesinde`;
                expect(yan, `${label} ${k}`).toContain(`${many} ${ASSEMBLY_LURE_SEEN[k]} seçildi`);
              }
              expect(r.items[3].badge, label).toBe(
                chance || (doubt && result.wrong > 0)
                  ? 'Yorumlanmadı'
                  : result.wrong === 0
                    ? 'Yanlış cevap yok'
                    : noted.length > 1
                      ? 'Birden çok yanılgı öne çıkıyor'
                      : noted.length === 1
                        ? `“${{ piece: 'Parçası farklı', mirror: 'Ters çevrilmiş parça', size: 'Bir parçası büyük ya da küçük', odd: 'Parça sayısı farklı' }[noted[0]]}” öne çıkıyor`
                        : result.wrong >= ASSEMBLY_LURE_NOTE
                          ? 'Belirgin bir yanılgı yok'
                          : result.wrong === 1
                            ? 'Bir yanlış'
                            : `${result.wrong} yanlış`,
              );
              // Yanlışların türlere dağılımı kartın grafiğindedir (kart yorumlanıyorsa); toplam soru sayısını aşmaz.
              if (r.items[3].badge !== 'Yorumlanmadı') {
                const stack = r.items[3].visual?.type === 'stack' ? r.items[3].visual : null;
                expect(stack?.parts[0].value, label).toBe(result.correct);
                expect(
                  stack?.parts.reduce((a, x) => a + x.value, 0),
                  label,
                ).toBe(result.n);
                for (const k of ASSEMBLY_LURES_ORDER) {
                  const at = stack?.parts.find(
                    (x) =>
                      x.label ===
                      {
                        piece: 'Parçası farklı',
                        mirror: 'Ters çevrilmiş parça',
                        size: 'Bir parçası büyük ya da küçük',
                        odd: 'Parça sayısı farklı',
                      }[k],
                  );
                  expect(at?.value ?? 0, `${label} ${k}`).toBe(result.luresByKind[k]);
                }
              } else expect(r.items[3].visual, label).toBeUndefined();
              // Soru türleri kartı: grafikteki doğrular puanlamadakilerle aynı; yorumlanmıyorsa grafik yok.
              if (chance || doubt) expect(r.items[2].visual, label).toBeUndefined();
              else {
                const rows = r.items[2].visual?.type === 'bars' ? r.items[2].visual.rows : [];
                expect(
                  rows.map((x) => x.value),
                  label,
                ).toEqual(result.types.map((x) => x.correct));
                // "Çoğu doğru" ile "zorlandı" türleri sayılarla uyumlu.
                for (const x of result.types) {
                  const name = {
                    slide: 'yalnızca kaydırma',
                    turn: 'döndürme gereken',
                    mirror: 'ayna tuzaklı',
                  }[x.type];
                  if (x.correct * 2 <= x.n && result.types.some((y) => y.correct * 2 > y.n))
                    expect(r.items[2].text, `${label} ${x.type}`).toMatch(new RegExp(`zorlan[dı].*${name}|${name}.*zorlan`, 'i'));
                }
              }
              expect(r.items[0].text.includes('Yanlışlarda seçilen şekiller” kartına'), label).toBe(noted.length > 0);
              if (noted.length || doubt) expect(r.items[0].text + r.items[1].text, label).not.toMatch(/dağılmasından/);
              if (doubt) expect(r.items[0].text, label).not.toContain('beklenen bir durumdur');
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge], label).toEqual(['Belirtilmedi', 'Düzey belirtilmedi']);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(result.levels.map((l) => `${l.correct}/4`));
              // Her kartın grafiği var; yalnızca yorumlanmayan (sonucu rastgele seçimle de çıkabilecek kart dahil) ve
              // hesaplanamayan kartların yok.
              for (const i of r.items) {
                expect(!!i.visual, `${label} ${i.title}`).toBe(!(i.badge === 'Yorumlanmadı' || i.badge === 'Süre hesaplanamadı' || i.interpreted === false));
              }
              expect([r.items[0].text, r.items[1].text].filter((x) => x.includes('dağılmasından')).length, label).toBeLessThanOrEqual(1);
              if (assemblyRapid(result)) expect(r.items[1].text, label).not.toMatch(/[345]\. düzeyde soruların (çoğunda zorlandı|hiçbirini)/);
              if (r.items[4].text.includes('yakın süreler')) {
                const ratio = result.rtHard! / result.rtEasy!;
                expect(ratio > 1 / 1.2 && ratio < 1.2, `${label} ${ratio}`).toBe(true);
              }
              if (result.correct === result.n) expect(r.items[0].text, label).toMatch(/[Bb]ütün soruları doğru cevapladı/);
              if (doubt && !chance) expect(/Çalışma biçimi kartında|çok hızlı cevap/.test(r.items[1].text), label).toBe(true);
              if (chance) expect(r.items[4].text, label).not.toMatch(/zaman ayır|yakın süreler|iyi bir çalışma biçimi/);
              expect(r.items[1].text, label).not.toMatch(/\bBu(,)? (testin )?en zor düzey/);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(
              /\b(buldun|verdin|cevapladın|zorlandın|seçtin|bulamadın|cevaplamadın|ayırdın|olabilirsin|olabileceğin|ayırabildin|birleştirebildin|seçmedin|ettin|bulduğun)\b|bak\./,
            );
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(16 * 4 * 4 * 2);
  }, 600_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, assemblyBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, assemblyBody(undefined, 3)).student.items).toHaveLength(5);
    const r = evaluateReports(SLUG, assemblyBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    // Yetişkine önerilen sonraki test yetişkinlere açık olanlardır (Zihinde Döndürme 5. sınıftan 12. sınıfa kadardır).
    const last = adult.roadmap!.weeks[3].text;
    expect(last).toContain('Kâğıt Katlama testini');
    expect(last).not.toContain('Zihinde Döndürme');
    const g3 = evaluate(SLUG, assemblyBody(undefined, 3)).student.roadmap!.weeks[3].text;
    expect(g3).not.toContain('Zihinde Döndürme');
    const g6 = evaluate(SLUG, assemblyBody(undefined, 6)).student.roadmap!.weeks[3].text;
    expect(g6).toContain('şekilleri zihinde döndürmeyi ve katlamayı da görmek için');
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /PS_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      assemblyBody(
        (q) => ({
          response: Number(m![1].split(',')[q.i]),
          rtMs: 8000 + 500 * q.i,
        }),
        4,
      ),
    );
    expect(r.student.items[0].badge).toBe('20 soruda 20 doğru');
    expect(r.student.items[3].badge).toBe('Yanlış cevap yok');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(5);
    expect(r.parent.roadmap!.bars).toHaveLength(3);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/ps_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"optionLures\\":\[\]/);
    expect(yml).toContain("grep -q 'Parçaları birleştir'");
    expect(parcalardanSekil.intro.title).toBe('Parçaları birleştir');
  });

  it('testin bütün metinlerinde cümleler en çok 22 sözcük: yönerge, alıştırmalar, düzeyler, bilim kartı, yol haritası', () => {
    const sc = parcalardanSekil.science;
    const rm = TASK_ROADMAPS[SLUG];
    const audienceTexts = (x: { student: string; parent: string; adult?: string }) => [x.student, x.parent, x.adult ?? ''];
    const texts = [
      parcalardanSekil.tagline,
      parcalardanSekil.description,
      ...parcalardanSekil.intro.paragraphs,
      ...parcalardanSekil.scales.map((x) => x.plain),
      ...task.instructions,
      ...task.practice.map((p) => p.explain),
      ...task.levels.map((l) => l.plain),
      sc.basedOn,
      sc.whatItMeasures,
      sc.reliability,
      sc.normNote,
      sc.ageNote,
      ...sc.limitations,
      ...audienceTexts(rm.what),
      ...audienceTexts(rm.studyIntro),
      ...audienceTexts(rm.lastWeek),
      ...rm.supports.flatMap((x) => audienceTexts(x.text)),
      ...rm.weeks.flatMap((x) => audienceTexts(x.text)),
      ...rm.approach.map((x) => x.text),
      ...rm.facts.items.student,
      ...rm.facts.items.parent,
      ...(rm.facts.items.adult ?? []),
    ];
    expect(texts.flatMap((x) => longSentences(x))).toEqual([]);
    const r = evaluate(SLUG, assemblyBody());
    for (const rep of [r.student, r.parent])
      expect(
        rep.roadmap!.weeks.flatMap((w) => longSentences(w.text)),
        rep.audience,
      ).toEqual([]);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, assemblyBody());
    const adult = evaluateAdult(SLUG, {
      ...assemblyBody(),
      grade: ADULT_GRADE,
    }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı ve metinde anılıyor; söylenmeyecekler söylenmiyor', () => {
    expect(parcalardanSekil.status).toBe('pilot');
    expect(parcalardanSekil.licenseStatus).toBe('original');
    expect(publicInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(parcalardanSekil.name).not.toMatch(/tanı/i);
    // Ad, WISC-R'nin Türkçe alt testinin adı değildir.
    expect(parcalardanSekil.name).not.toMatch(/Parça Birleştirme/i);
    const sc = parcalardanSekil.science;
    expect(sc.normStatus).toBe('none');
    expect(JSON.stringify(sc)).not.toMatch(/YAZILACAK/);
    expect(sc.citations.every((c) => c.url?.startsWith('https://'))).toBe(true);
    const body = JSON.stringify({ ...sc, citations: [] });
    for (const a of [
      'Embretson, 1996',
      'Ivie ve Embretson, 2010',
      'Shi, Wind ve Lakin, 2023',
      'Levine, Huttenlocher, Taylor ve Langrock, 1999',
      'Levine, Ratliff, Huttenlocher ve Cannon, 2012',
      'Soysal, Tan ve Aldemir, 2012',
      'Uttal ve ark., 2013',
      'Wai, Lubinski ve Benbow, 2009',
    ]) {
      expect(body, a).toContain(a);
    }
    for (const c of sc.citations) expect(body, c.text).toContain(c.text.split(',')[0].replace(/\.$/, ''));
    expect(sc.basedOn).toMatch(/“Parça Birleştirme” alt testi değildir/);
    expect(sc.ageNote).toContain('yetişkinler de çözebilir');
    expect(sc.limitations.join(' ')).toContain('Zekâ puanı (IQ) vermez ve tanı koymaz');
    // Söylenmeyecekler: norm, akran karşılaştırması, meslek önerisi, beyin geliştirme, cinsiyet, kesin yaş düşüşü.
    const all = JSON.stringify(parcalardanSekil) + JSON.stringify(TASK_ROADMAPS[SLUG]);
    expect(all).not.toMatch(/beyni(ni)? geliştir|zekânı (artır|geliştir)|mühendis olabilir|kızlar|erkekler|yaşla (kesin|mutlaka) düşer|akranlarına göre|yüzdelik|IQ puanı/i);
    expect(all).not.toMatch(/kısa (biçimi|formu)|eşdeğeri|Türkçe uyarlaması/);
    const rm = TASK_ROADMAPS[SLUG];
    expect(rm.sources.map((x) => x.text.split(',')[0])).toEqual(['Ivie', 'Shi', 'Levine', 'Uttal']);
    for (const x of rm.sources)
      expect(
        sc.citations.some((c) => c.text === x.text),
        x.text,
      ).toBe(true);
    expect(rm.nextTests).toEqual(['zihinde-dondurme', 'kagit-katlama']);
  });
});
