import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { planlamaKuleGorevi } from '@/content/instruments/planlama-kule-gorevi';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { TOWER_CAPACITY, towerCode, towerDecode, towerMove, towerSpeech, towerValid } from '@/lib/instruments/tower';
import type { TowerState, TowerTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { TOWER_LEVEL_COLORS } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  TOWER_IDLE_NOTE,
  TOWER_PREPLAN_MIN,
  TOWER_RAPID_MS,
  TaskInputError,
  scoreTower,
  towerIdle,
  towerNone,
  towerRapid,
  type TowerResult,
  type TowerTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { towerBody, type TowerCell, type TowerPlay } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { allStates, countsOf, distancesFrom, keyOf, minIntermediate, shapeOf, shortestPath, structureOf, successors } from './helpers/tower-check';

const SLUG = 'planlama-kule-gorevi';
const task = planlamaKuleGorevi.tasks[0] as TowerTask;
const TITLES = ['En az hamlede çözülenler', 'Problem uzadıkça', 'Çözüm biçimi', 'Başlamadan önce düşünme'];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof towerBody>) => (body.data as { blocks: Record<string, TowerTrialInput[]> }).blocks[task.key];
const score = (pick?: (q: TowerCell) => TowerPlay) => scoreTower(task, trialsOf(towerBody(pick))).result;
const levelsOf = (r: TowerResult) => r.levels.map((l) => `${l.moves} hamlelik ${l.optimal}/${l.n}`).join(' · ');

describe('Kule görevi: problemler', () => {
  it('bu düzende 36 diziliş ve 108 hamle var; testin hamle kuralı bağımsız denetleyicinin hamleleriyle aynı', () => {
    const states = allStates();
    expect(states).toHaveLength(36);
    expect(states.reduce((n, s) => n + successors(s).length, 0)).toBe(108);
    const asState = (k: string) => k.split('|') as unknown as TowerState;
    for (const s of states) {
      expect(towerValid(asState(s)), s).toBe(true);
      const mine: string[] = [];
      for (let a = 0; a < 3; a++)
        for (let b = 0; b < 3; b++) {
          const n = towerMove(asState(s), a, b);
          if (n) mine.push(`${a}${b}:${n.join('|')}`);
        }
      expect(mine.sort(), s).toEqual(
        successors(s)
          .map(([a, b, y]) => `${a}${b}:${y}`)
          .sort(),
      );
    }
    expect(TOWER_CAPACITY).toEqual([3, 2, 1]);
    for (const bad of [
      ['KMS', 'K', ''],
      ['KMSK', '', ''],
      ['', 'KMS', ''],
      ['K', 'M', 'SK'],
      ['K', 'M', 'X'],
      ['K', 'M', ''],
    ]) {
      expect(towerValid(bad as unknown as TowerState), bad.join('|')).toBe(false);
    }
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if (a !== b) expect(towerDecode(towerCode(a, b))).toEqual([a, b]);
    for (const bad of [0, 11, 14, 22, 40, 12.5, 33, 41, -12]) expect(towerDecode(bad), String(bad)).toBeNull();
    expect(towerSpeech(['KM', 'S', ''])).toBe('soldaki çubukta alttan üste kırmızı, mavi; ortadaki çubukta sarı; sağdaki çubuk boş');
  });

  it('20 problem: 3–7 hamle, her uzunlukta dört; en az hamle sayıları bütün dizilişler taranarak bağımsızca doğrulanır', () => {
    expect(task.items.map((it) => it.key)).toEqual(Array.from({ length: 20 }, (_, i) => `kg${String(i + 1).padStart(2, '0')}`));
    expect(task.items.map((it) => it.minMoves)).toEqual([3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7]);
    for (const it of [...task.items, ...task.practice]) {
      expect(towerValid(it.start) && towerValid(it.goal), it.key).toBe(true);
      expect(distancesFrom(keyOf(it.start)).dist.get(keyOf(it.goal)), it.key).toBe(it.minMoves);
    }
    expect(task.limitMs).toBe(60_000);
  });

  it('her uzunlukta hedeflerin biçimi dengeli: bir kule, bir düz, iki kısmi; başlangıç ve hedef biçimleri değişir; tek yollu ve çok yollu problemler birlikte', () => {
    for (const m of [3, 4, 5, 6, 7]) {
      const here = task.items.filter((it) => it.minMoves === m);
      const goals = here.map((it) => shapeOf(keyOf(it.goal)));
      expect([goals.filter((g) => g === 'kule').length, goals.filter((g) => g === 'duz').length, goals.filter((g) => g === 'kismi').length], `${m}`).toEqual([
        1, 1, 2,
      ]);
      expect(new Set(here.map((it) => shapeOf(keyOf(it.start)))).size, `${m}`).toBeGreaterThanOrEqual(2);
      expect(new Set(here.map((it) => countsOf(keyOf(it.start)))).size, `${m}`).toBeGreaterThanOrEqual(3);
      expect(new Set(here.map((it) => countsOf(keyOf(it.goal)))).size, `${m}`).toBeGreaterThanOrEqual(3);
      const paths = here.map((it) => distancesFrom(keyOf(it.start)).paths.get(keyOf(it.goal))!);
      expect(paths.some((p) => p === 1) && paths.some((p) => p > 1), `${m}: ${paths}`).toBe(true);
    }
    // 3 hamlelik problemlerin birinde her top doğrudan yerine gider; ötekilerde bir top geçici olarak başka yere konur.
    expect(task.items.filter((it) => it.minMoves === 3).map((it) => minIntermediate(keyOf(it.start), keyOf(it.goal)))).toEqual([0, 1, 1, 1]);
    // Daha uzun problemlerde ara hamle sayısı uzunlukla artar (üç top en çok üç kez doğrudan yerine gider).
    for (const it of task.items.filter((x) => x.minMoves >= 4)) expect(minIntermediate(keyOf(it.start), keyOf(it.goal)), it.key).toBe(it.minMoves - 3);
  });

  it('tekrar yok: renkleri değiştirince aynı ya da ters iki problem yok, başlangıçlar ve hedefler birer kez; art arda iki problem ortak diziliş kullanmaz', () => {
    const all = [...task.practice, ...task.items];
    const forward = all.map((it) => structureOf(keyOf(it.start), keyOf(it.goal)));
    expect(new Set(forward).size).toBe(all.length);
    // Ters problem: başlangıcı ötekinin hedefi, hedefi ötekinin başlangıcı (renkler değiştirilse de).
    all.forEach((it, i) => {
      const back = structureOf(keyOf(it.goal), keyOf(it.start));
      forward.forEach((f, j) => {
        if (i !== j) expect(back, `${it.key} ↔ ${all[j].key}`).not.toBe(f);
      });
    });
    expect(new Set(task.items.map((it) => keyOf(it.start))).size).toBe(20);
    expect(new Set(task.items.map((it) => keyOf(it.goal))).size).toBe(20);
    task.items.forEach((it, i) => {
      expect(keyOf(it.start), it.key).not.toBe(keyOf(it.goal));
      if (i === 0) return;
      const prev = task.items[i - 1];
      const shared = [keyOf(it.start), keyOf(it.goal)].filter((k) => k === keyOf(prev.start) || k === keyOf(prev.goal));
      expect(shared, `${prev.key} → ${it.key}`).toEqual([]);
    });
  });

  it('alıştırma: 2 ve 3 hamlelik iki problem; gösterilen çözüm kurallara uyar, en az hamlelidir ve hedefe ulaştırır', () => {
    expect(task.practice.map((p) => [p.key, p.minMoves])).toEqual([
      ['kgp1', 2],
      ['kgp2', 3],
    ]);
    expect(task.practice.map((p) => minIntermediate(keyOf(p.start), keyOf(p.goal)))).toEqual([0, 1]);
    for (const p of task.practice) {
      expect(p.solution, p.key).toHaveLength(p.minMoves);
      let s = keyOf(p.start);
      for (const [from, to] of p.solution) {
        const next = successors(s).find(([a, b]) => a === from - 1 && b === to - 1);
        expect(next, `${p.key} ${from}→${to}`).toBeDefined();
        s = next![2];
      }
      expect(s, p.key).toBe(keyOf(p.goal));
    }
  });

  it('metinler: okula özgü sözcük yok (yetişkinler de çözer); problemler sabit (değişirse sürüm artırılmalı)', () => {
    const all = [
      task.name,
      task.measures,
      ...task.instructions,
      planlamaKuleGorevi.tagline,
      planlamaKuleGorevi.description,
      planlamaKuleGorevi.intro!.title,
      ...planlamaKuleGorevi.intro!.paragraphs,
    ].join(' ');
    expect(schoolWords(all)).toEqual([]);
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, limitMs: task.limitMs }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: planlamaKuleGorevi.version, hash }).toEqual({ version: 1, hash: PROBLEM_IZI });
  });
});

/** Problemlerin izi: problemler, alıştırmalar ya da süre değişirse değişir (o zaman testin sürüm numarası artırılır). */
const PROBLEM_IZI = '2caf97635905177f';

describe('Kule görevi: puanlama', () => {
  it('hatasız: 20 problemin hepsi en az hamlede; süreler ve ön planlama payı', () => {
    const r = score();
    expect([r.n, r.optimal, r.extra, r.unsolved, r.idle, r.excessMoves]).toEqual([20, 20, 0, 0, 0, 0]);
    expect(r.levels.map((l) => [l.moves, l.n, l.optimal])).toEqual([3, 4, 5, 6, 7].map((m) => [m, 4, 4]));
    expect([r.short, r.long]).toEqual([
      { n: 8, optimal: 8, idle: 0 },
      { n: 8, optimal: 8, idle: 0 },
    ]);
    expect([r.medianPick, r.pickShort, r.pickLong, r.rapidOf, r.rapid]).toEqual([4000, 4000, 4000, 12, 0]);
    // Her problemde ilk top 4 sn'de, her hamle 1,5 sn'de: pay 4000 / (4000 + 1500 · hamle).
    const shares = task.items.map((it) => 4000 / (4000 + 1500 * it.minMoves));
    expect(r.prePlan).toBe(Math.round((100 * shares.reduce((a, b) => a + b, 0)) / shares.length));
    expect(towerNone(r) || towerIdle(r) || towerRapid(r)).toBe(false);
  });

  it('fazla hamle, hedefe ulaşamamak ve hiç top taşımamak ayrı sayılır', () => {
    const extra = score(() => ({ outcome: 'extra', excess: 4 }));
    expect([extra.optimal, extra.extra, extra.excessMoves]).toEqual([0, 20, 80]);
    const unsolved = score(() => ({ outcome: 'unsolved' }));
    expect([unsolved.unsolved, unsolved.idle, unsolved.prePlan]).toEqual([20, 0, null]);
    const idle = score(() => ({ outcome: 'idle' }));
    expect([idle.unsolved, idle.idle, idle.medianPick, towerNone(idle)]).toEqual([20, 20, null, true]);
    const few = score((q) => (q.i < TOWER_IDLE_NOTE ? { outcome: 'idle' } : { outcome: 'optimal' }));
    expect([few.idle, towerIdle(few), towerNone(few)]).toEqual([3, true, false]);
    // Kısa problemlerin yarısında hiç top taşınmadı: sonuç yorumlanmaz.
    const half = score((q) => (q.i % 2 ? { outcome: 'idle' } : { outcome: 'optimal' }));
    expect([half.idle, half.short.idle, towerNone(half), towerIdle(half)]).toEqual([10, 4, true, false]);
    // Yalnızca uzun problemlerde (5–7 hamle) hiç top taşınmadı: çözüm kafada aranırken süre yetmemiş olabilir; sonuç dikkatle yorumlanır.
    const longIdle = score((q) => (q.moves >= 5 ? { outcome: 'idle' } : { outcome: 'optimal' }));
    expect([longIdle.idle, longIdle.short.idle, longIdle.long.idle, towerNone(longIdle), towerIdle(longIdle)]).toEqual([12, 0, 8, false, true]);
    expect(longIdle.levels.map((l) => l.idle)).toEqual([0, 0, 4, 4, 4]);
    // Kısa problemlerin üçü ve bütün problemlerin dörtte üçünde hiç top taşınmadı: sonuç yorumlanmaz.
    const most = score((q) => (q.i >= 5 ? { outcome: 'idle' } : { outcome: 'optimal' }));
    expect([most.idle, most.short.idle, towerNone(most)]).toEqual([15, 3, true]);
    // Testin başındaki dört kısa problemde hiç top taşınmadı, ötekiler çözüldü: görev anlaşılmış, sonuç dikkatle yorumlanır.
    const firstFour = score((q) => (q.i < 4 ? { outcome: 'idle' } : { outcome: 'optimal' }));
    expect([firstFour.idle, firstFour.short.idle, towerNone(firstFour), towerIdle(firstFour)]).toEqual([4, 4, false, true]);
    const fewer = score((q) => (q.i >= 6 ? { outcome: 'idle' } : { outcome: 'optimal' }));
    expect([fewer.idle, fewer.short.idle, towerNone(fewer), towerIdle(fewer)]).toEqual([14, 2, false, true]);
    // Ön planlama payı en az beş çözülmüş problem ister.
    const four = score((q) => (q.i < TOWER_PREPLAN_MIN - 1 ? { outcome: 'optimal' } : { outcome: 'unsolved' }));
    expect(four.prePlan).toBeNull();
  });

  it('uzun problemlerde çok çabuk başlayıp en az hamlede çözememek ayrıca sayılır; çabuk başlayıp en az hamlede çözmek sayılmaz', () => {
    const rapid = score((q) => (q.moves >= 5 ? { outcome: 'extra', pickMs: 800 } : { outcome: 'optimal' }));
    expect([rapid.rapidOf, rapid.rapid, towerRapid(rapid)]).toEqual([12, 12, true]);
    const quickRight = score(() => ({ outcome: 'optimal', pickMs: 800 }));
    expect([quickRight.rapid, towerRapid(quickRight)]).toEqual([0, false]);
    const border = score((q) => (q.moves >= 5 ? { outcome: 'extra', pickMs: TOWER_RAPID_MS } : { outcome: 'optimal' }));
    expect(border.rapid).toBe(0);
    const third = score((q) => (q.moves >= 5 && q.i % 3 === 0 ? { outcome: 'unsolved', pickMs: 500 } : { outcome: 'optimal' }));
    expect([third.rapid, towerRapid(third)]).toEqual([4, true]);
    const less = score((q) => (q.moves >= 5 && q.i % 4 === 0 ? { outcome: 'unsolved', pickMs: 500 } : { outcome: 'optimal' }));
    expect([less.rapid, towerRapid(less)]).toEqual([3, false]);
  });

  it('geçersiz girdiler reddedilir: kurala aykırı hamle, hedeften sonra hamle, eksik problem, tutarsız süreler', () => {
    const ok = trialsOf(towerBody());
    const withTrial = (i: number, response: TowerTrialInput['response']) => ok.map((t) => (t.index === i ? { ...t, response } : t));
    const first = ok[0].response;
    expect(scoreTower(task, ok).result.optimal).toBe(20);
    expect(() => scoreTower(task, ok.slice(1))).toThrow(TaskInputError);
    expect(() => scoreTower(task, [...ok, { ...ok[0], index: 20 }])).toThrow(TaskInputError);
    expect(scoreTower(task, [...ok, { ...ok[0], response: { moves: [], times: [], pick: null } }]).result.optimal).toBe(20);
    // kg01 başlangıcı: ['', 'SM', 'K']. Boş çubuktan (soldaki) top alınamaz; dolu çubuğa (sağdaki) top konamaz.
    expect(() => scoreTower(task, withTrial(0, { moves: [12], times: [5000], pick: 4000 }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { moves: [23], times: [5000], pick: 4000 }))).toThrow(TaskInputError);
    for (const code of [11, 14, 40, 0])
      expect(() => scoreTower(task, withTrial(0, { moves: [code], times: [5000], pick: 4000 })), String(code)).toThrow(TaskInputError);
    // Hedefe ulaşınca problem biter.
    expect(() => scoreTower(task, withTrial(0, { moves: [...first.moves, 31], times: [...first.times, 59_000], pick: first.pick }))).toThrow(TaskInputError);
    // Süreler: hamle ve süre sayısı aynı, süreler azalmaz, ilk top alınmadan hamle olmaz, süre sınırı aşılmaz.
    expect(() => scoreTower(task, withTrial(0, { ...first, times: first.times.slice(1) }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { ...first, times: [...first.times].reverse() }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { ...first, pick: null }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { moves: [], times: [], pick: 3000 }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { ...first, pick: first.times[0] + 1 }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { ...first, times: first.times.map((x) => x + 60_000) }))).toThrow(TaskInputError);
    expect(() => scoreTower(task, withTrial(0, { moves: Array(61).fill(32), times: Array(61).fill(5000), pick: 4000 }))).toThrow(TaskInputError);
    // Hamle sınırına (60) hedefe ulaşmadan varılırsa problem çözülmemiş sayılır: kg01'de ortadaki üst top sola gidip gelir.
    const cap = Array.from({ length: 60 }, (_, k) => (k % 2 ? 12 : 21));
    const capped = scoreTower(task, withTrial(0, { moves: cap, times: cap.map((_, k) => 5000 + 500 * k), pick: 4000 })).result;
    expect([capped.outcomes[0], capped.unsolved, capped.idle]).toEqual(['unsolved', 1, 0]);
    // En az hamleden kısa bir çözüm problemin yanlış tanımlandığını gösterir.
    expect(() => scoreTower({ ...task, items: task.items.map((it, i) => (i === 0 ? { ...it, minMoves: 4 } : it)) }, ok)).toThrow(TaskInputError);
    // İstek biçimi de denetlenir.
    const bad = towerBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key][0] = { index: 0, response: { moves: [12], times: [1], pick: 'x' }, rtMs: 1 };
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Kule görevi: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar, grafik ve problem uzunluklarının üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, towerBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['En az hamlede çözülenler', '20 problemin 20 tanesi en az hamlede'],
      ['Problem uzadıkça', 'Kısa problemlerde 8/8, uzun problemlerde 8/8'],
      ['Çözüm biçimi', 'Hepsi en az hamlede'],
      ['Başlamadan önce düşünme', 'İlk hamleden önce tipik 4 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['En az hamlede çözülen', '20/20'],
      ['Fazla hamleyle çözülen', '0'],
      ['Hedefe ulaşılamayan', '0'],
      ['İlk hamleden önce tipik süre', '4 saniye'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.key, b.label, b.valueLabel, b.color])).toEqual(
      [3, 4, 5, 6, 7].map((m, i) => [`h${m}`, `${m} hamlelik`, '4/4', TOWER_LEVEL_COLORS[i]]),
    );
    expect(rm.barsTitle).toBe('Problem uzunluğuna göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(r.student.items[0].text).toContain('Problemlerin hepsini en az hamlede çözdün.');
    expect(r.student.items[0].text).not.toContain('genellikle zorlaşır');
    expect(r.student.items[1].text).toContain('Problemler uzadıkça sonucun düşmedi: uzun problemlerin hepsinde en kısa yolu buldun.');
    expect(r.student.items[2].text).toBe('En az hamlede 20 · Fazla hamleyle 0 · Hedefe ulaşılamayan 0. Bütün problemlerde hedefe en az hamleyle ulaştın.');
    expect(r.student.items[3].text).toContain(
      'Uzun problemlerde (6 ve 7 hamle) ilk hamleden önce kısa problemlerdekinden (3 ve 4 hamle) daha uzun düşünmedin. Buna karşın uzun problemlerin de hepsini en az hamlede çözdün.',
    );
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(text(r.parent)).toContain('Çocuğunuz problemlerin hepsini en az hamlede çözdü.');
  });

  it('durumlar: problem uzadıkça düşen sonuç, uzun problemlerde daha uzun düşünmek, çabuk başlamak, hiç top taşımamak', () => {
    // Tipik: kısa problemler en az hamlede, uzun problemlerin çoğu fazla hamleyle; uzun problemlerde daha uzun düşünülür.
    const typical = evaluate(
      SLUG,
      towerBody((q) => ({ outcome: q.moves <= 5 || q.i % 4 === 0 ? 'optimal' : 'extra', pickMs: 1500 * q.moves })),
    );
    expect(typical.student.items[0].badge).toBe('20 problemin 14 tanesi en az hamlede');
    expect(typical.student.items[0].text).toContain('Bunların 14 tanesini en az hamlede çözdün: problemlerin çoğunda en kısa yolu buldun.');
    expect(typical.student.items[0].text).not.toContain('olağandır');
    expect(typical.student.items[1].text).toContain('Problem uzadıkça sonucun düşmesi bu görevde olağandır.');
    expect(typical.student.items[1].badge).toBe('Kısa problemlerde 8/8, uzun problemlerde 2/8');
    expect(typical.student.items[1].text).toContain('Problemler uzadıkça en kısa yolu bulman zorlaştı.');
    expect(typical.student.items[2].badge).toBe('6 problem fazla hamleyle çözüldü');
    expect(typical.student.items[2].text).toContain(
      '6 problemde hedefe ulaştın ama en az hamleden fazlasını yaptın; bu problemlerde toplam 12 hamle fazla yaptın.',
    );
    expect(typical.student.items[2].text).toContain('Hedefte bir çubuğun en altındaki top');
    expect(typical.student.items[3].text).toContain('Kısa problemlerde tipik 5,3 saniye · uzun problemlerde 9,8 saniye · başlamadan önce düşünme payı %');
    expect(typical.student.items[3].badge).toBe('İlk hamleden önce tipik 7,5 saniye');
    expect(typical.student.items[3].text).toContain(
      'Uzun problemlerde (6 ve 7 hamle) ilk hamleden önce kısa problemlerdekinden (3 ve 4 hamle) daha uzun düşündün: problem zorlaştıkça plana daha çok zaman ayırdın.',
    );
    expect(typical.parent.items[3].text).toContain(
      'Çocuğunuz uzun problemlerde (6 ve 7 hamle) ilk hamleden önce kısa problemlerdekinden (3 ve 4 hamle) daha uzun düşündü',
    );
    expect(typical.student.items[3].text).toMatch(/sürenin ortalama %\d+ kadarını ilk hamleden önce/);
    expect(typical.parent.items[1].text).toContain('Problemler uzadıkça en kısa yolu bulması zorlaştı.');

    // Uzun problemlerde çok çabuk başlayıp en az hamlede çözememek.
    const rapid = evaluate(
      SLUG,
      towerBody((q) => (q.moves >= 5 ? { outcome: q.i % 2 ? 'extra' : 'unsolved', pickMs: 400 } : { outcome: 'optimal', pickMs: 400 })),
    );
    expect(rapid.student.items[3].text).toContain(
      '5 ya da daha çok hamlelik 12 problemin 12 tanesinde taşıdığın ilk topu 2 saniyeden kısa sürede aldın ve bu problemleri en az hamlede çözemedin',
    );
    expect(rapid.student.items[3].badge).toBe('İlk hamleden önce tipik bir saniyeden kısa');
    expect(rapid.student.items[3].text).toContain('taşıdığın ilk topu alman tipik olarak bir saniyeden kısa sürdü');
    // 1,5–2 saniyede başlayan aceleci biri: süre ondalıklı yazılır; çabuk başlama uyarısı varken "plana daha çok zaman ayırdın" denmez.
    const edge = evaluate(
      SLUG,
      towerBody((q) => (q.moves >= 5 ? { outcome: 'extra', pickMs: 1600 } : { outcome: 'optimal', pickMs: 300 })),
    );
    expect(edge.student.items[3].badge).toBe('İlk hamleden önce tipik 1,6 saniye');
    expect(edge.student.items[3].text).toContain('12 problemin 12 tanesinde taşıdığın ilk topu 2 saniyeden kısa sürede aldın');
    expect(edge.student.items[3].text).not.toMatch(/plana daha çok zaman|daha uzun düşün/);
    expect(rapid.student.cautions).toEqual([]);

    // Birkaç problemde hiç top taşımamak: uyarı ve kartta not.
    const idle = evaluate(
      SLUG,
      towerBody((q) => (q.i >= 17 ? { outcome: 'idle' } : { outcome: 'optimal' })),
    );
    expect(idle.student.cautions).toEqual([
      'Kule görevinde 3 problemde hiç top taşınmadan süre dolmuş; bu problemlerde çözüm kafada aranırken süre yetmemiş ya da ara verilmiş olabilir.',
    ]);
    expect(idle.student.items[0].text).toContain(
      '3 problemde hiç top taşımadan süre doldu; bu problemlerde çözümü kafanda ararken süre yetmemiş ya da ara vermiş olabilirsin. Bu yüzden bu sonuç seni tam yansıtmayabilir.',
    );
    expect(idle.student.items[1].text).toContain('Hiç top taşınmadan süresi dolan problemler (uzun problemlerde 3) en az hamlede çözülmemiş sayıldı.');
    expect(idle.student.items[2].text).toContain('3 problemde hedefe ulaşamadın; bunların hepsinde hiç top taşınmadı.');
    expect(idle.student.items[2].badge).toBe('3 problemde hedefe ulaşılamadı');

    // Yarısında ya da daha çoğunda hiç top taşınmadı: sonuç yorumlanmaz.
    const none = evaluate(
      SLUG,
      towerBody((q) => (q.i % 2 ? { outcome: 'idle' } : { outcome: 'optimal' })),
    );
    expect(none.student.items.map((i) => i.badge)).toEqual([
      '20 problemin 10 tanesi en az hamlede',
      'Yorumlanmadı',
      '10 problemde hedefe ulaşılamadı',
      'Yorumlanmadı',
    ]);
    expect(none.student.items[0].text).toContain(
      '20 problemin 10 tanesinde hiç top taşımadan süre doldu; bunların 4 tanesi 3 ve 4 hamlelik kısa problemlerdi.',
    );
    expect(none.student.items[0].text).toContain('sonuç yorumlanmadı');
    expect(none.parent.items[0].text).toContain('Çocuğunuz 20 problemin 10 tanesinde hiç top taşımadı ve bu problemlerde süre doldu');
    expect(none.student.items[1].text).toBe(
      'Problemlerin 10 tanesinde, kısa problemlerin de 4 tanesinde hiç top taşınmadığı için kısa ve uzun problemler karşılaştırılmadı.',
    );

    // Testin başındaki dört kısa problemde hiç top taşınmadı, ötekilerin hepsi en az hamlede: görev anlaşılmış, sonuç dikkatle yorumlanır.
    const lateStart = evaluate(
      SLUG,
      towerBody((q) => (q.i < 4 ? { outcome: 'idle' } : { outcome: 'optimal' })),
    );
    expect(lateStart.student.items.map((i) => i.badge)).toEqual([
      '20 problemin 16 tanesi en az hamlede',
      'Kısa problemlerde 4/8, uzun problemlerde 8/8',
      '4 problemde hedefe ulaşılamadı',
      'İlk hamleden önce tipik 4 saniye',
    ]);
    expect(lateStart.student.cautions.join(' ')).toContain('Kule görevinde 4 problemde hiç top taşınmadan süre dolmuş');
    expect(lateStart.student.items[1].text).toContain('Uzun problemlerde kısa problemlerden daha çok en kısa yolu buldun.');
    expect(lateStart.student.items[1].text).not.toContain('acele');
    expect(lateStart.student.items[1].text).toContain('(kısa problemlerde 4)');

    // Kısa problemlerin hepsi en az hamlede, uzun problemlerde hiç top taşınmadı (önce düşünüp süreyi dolduran biri): sonuç
    // yorumlanır, uyarı yönergeyi anlamamayı değil süreyi anar.
    const thinker = evaluate(
      SLUG,
      towerBody((q) => (q.moves >= 5 ? { outcome: 'idle' } : { outcome: 'optimal', pickMs: 9000 })),
    );
    expect(thinker.student.items.map((i) => i.badge)).toEqual([
      '20 problemin 8 tanesi en az hamlede',
      'Kısa problemlerde 8/8, uzun problemlerde 0/8',
      '12 problemde hedefe ulaşılamadı',
      'İlk hamleden önce tipik 9 saniye',
    ]);
    expect(thinker.student.cautions.join(' ')).toContain('çözüm kafada aranırken süre yetmemiş ya da ara verilmiş olabilir');
    expect(thinker.student.cautions.join(' ')).not.toContain('yönerge');
    expect(thinker.student.items[1].text).toContain(
      'Hiç top taşınmadan süresi dolan problemler (5 hamlelik problemlerde 4, uzun problemlerde 8) en az hamlede çözülmemiş sayıldı.',
    );
    expect(thinker.student.items[1].text).toContain('Uzun problemlerin yarısında ya da daha çoğunda süre içinde en kısa yolu bulamadın.');
    expect(thinker.student.items[1].text).not.toContain('zorlaştı');
    expect(thinker.student.roadmap!.bars).toHaveLength(5);
    expect(none.student.cautions.join(' ')).toContain('Bu sonuç tek başına yorumlanmamalıdır');
    expect(none.student.roadmap!.bars).toEqual([]);

    // Uzun problemlerde kısa problemlerden daha başarılı.
    const reversed = evaluate(
      SLUG,
      towerBody((q) => ({ outcome: q.moves <= 4 && q.i % 2 ? 'extra' : 'optimal' })),
    );
    expect(reversed.student.items[1].text).toContain('Uzun problemlerde kısa problemlerden daha çok en kısa yolu buldun.');
    expect(reversed.student.items[1].text).not.toContain('Kısa problemlerin yarısında');
    expect(reversed.student.items[1].text).toContain('Kısa problemlerde acele etmiş');
    // Kısa problemlerde hiç top taşınmadıysa "acele" denmez.
    const shortIdle = evaluate(
      SLUG,
      towerBody((q) => ({ outcome: q.moves <= 4 && q.i % 3 === 0 ? 'idle' : 'optimal' })),
    );
    expect(shortIdle.student.items[1].text).toContain('Uzun problemlerde kısa problemlerden daha çok en kısa yolu buldun.');
    expect(shortIdle.student.items[1].text).not.toContain('acele');
    // 8/8 ve 7/8: sonuç "düşmedi" değil, "pek değişmedi".
    const almost = evaluate(
      SLUG,
      towerBody((q) => ({ outcome: q.i === 19 ? 'extra' : 'optimal' })),
    );
    expect(almost.student.items[1].text).toContain('Problemler uzadıkça sonucun pek değişmedi: uzun problemlerin de hemen hepsinde en kısa yolu buldu');
    expect(almost.student.items[2].text).toContain('1 problemde hedefe ulaştın ama en az hamleden fazlasını yaptın; bu problemde toplam 2 hamle fazla yaptın.');
    // Kısa ve uzun problemler iyi, 5 hamlelikler değil: "düşmedi" denmez, 5 hamlelik sonuç da söylenir.
    const midDip = evaluate(
      SLUG,
      towerBody((q) => ({ outcome: q.moves === 5 ? 'idle' : 'optimal' })),
    );
    expect(midDip.student.items[1].text).toContain('Kısa ve uzun problemlerde sonucun birbirine yakın; 5 hamlelik problemlerde ise 0/4.');
    expect(midDip.student.items[1].text).toContain('(5 hamlelik problemlerde 4)');
    expect(midDip.student.items[1].text).not.toContain('düşmedi');
    // Kısa problemlerin hiçbiri en az hamlede değil.
    const zero = evaluate(
      SLUG,
      towerBody(() => ({ outcome: 'extra' })),
    );
    expect(zero.student.items[1].text).toContain('Kısa problemlerin hiçbirinde en kısa yolu bulamadın');
  });

  it('rastgele 1500 çözüm düzeninde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    let s = 20261015;
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    let n = 0;
    for (let k = 0; k < 1500; k++) {
      // Her uzunlukta en az hamlede çözme olasılığı; yanlışların türü; süre düzeni.
      const pOpt = [3, 4, 5, 6, 7].map(() => rnd());
      const idleRate = k % 11 === 0 ? 0.6 : k % 5 === 0 ? 0.15 : 0;
      // Bazı düzenlerde hiç top taşınmayan problemler yalnızca uzun problemlerdedir (önce düşünüp süreyi dolduran biri).
      const idleLongOnly = k % 7 === 0;
      const unsolvedShare = rnd();
      const timing = (['normal', 'flat', 'rapid', 'shortSlow', 'mixed', 'edge'] as const)[k % 6];
      const pick = (q: TowerCell): TowerPlay => {
        if (idleLongOnly ? q.moves >= 5 && rnd() < 0.7 : rnd() < idleRate) return { outcome: 'idle' };
        const pickMs =
          timing === 'normal'
            ? 2000 + 1400 * q.moves
            : timing === 'flat'
              ? 3500
              : timing === 'rapid'
                ? q.moves >= 5
                  ? 600
                  : 2500
                : timing === 'shortSlow'
                  ? 14_000 - 1500 * q.moves
                  : timing === 'edge'
                    ? q.moves >= 5
                      ? 1500 + Math.floor(rnd() * 600)
                      : 300
                    : 300 + Math.floor(rnd() * 15_000);
        if (rnd() < pOpt[q.moves - 3]) return { outcome: 'optimal', pickMs, stepMs: 1200 };
        return rnd() < unsolvedShare ? { outcome: 'unsolved', pickMs } : { outcome: 'extra', pickMs, excess: rnd() < 0.5 ? 2 : 4, stepMs: 1000 };
      };
      const body = towerBody(pick, 3 + (k % 11));
      const label = `${k}/${timing}`;
      const res = evaluate(SLUG, body);
      const r = scoreTower(task, trialsOf(body)).result;
      const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
      const none = towerNone(r);
      const idle = towerIdle(r);
      const rapid = towerRapid(r);
      const S = r.short;
      const L = r.long;
      const midL = r.levels.filter((l) => l.moves === 5);
      const M = { n: 4, optimal: midL[0].optimal, idle: midL[0].idle };
      const diff = S.optimal - L.optimal;
      for (const rep of [res.student, res.parent, adult]) {
        const parent = rep === res.parent;
        const t = text(rep);
        expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \.|; \./);
        expect(
          rep.items.map((i) => i.title),
          label,
        ).toEqual(TITLES);
        for (const i of rep.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
        // Kartların başlıkları sayılarla aynı.
        expect(rep.items[0].badge, label).toBe(`20 problemin ${r.optimal} tanesi en az hamlede`);
        expect(rep.items[0].text, label).toContain(`${levelsOf(r)}.`);
        expect(rep.items[1].badge, label).toBe(none ? 'Yorumlanmadı' : `Kısa problemlerde ${S.optimal}/8, uzun problemlerde ${L.optimal}/8`);
        expect(rep.items[2].text, label).toContain(`En az hamlede ${r.optimal} · Fazla hamleyle ${r.extra} · Hedefe ulaşılamayan ${r.unsolved}.`);
        expect(rep.items[3].badge, label).toEqual(
          none ? 'Yorumlanmadı' : r.medianPick === null ? 'Süre hesaplanamadı' : expect.stringMatching(/^İlk hamleden önce tipik /),
        );
        // Uyarılar.
        expect(
          rep.cautions.some((c) => c.includes('Bu sonuç tek başına yorumlanmamalıdır')),
          label,
        ).toBe(none);
        expect(
          rep.cautions.some((c) => /Kule görevinde \d+ problemde hiç top taşınmadan süre dolmuş/.test(c)),
          label,
        ).toBe(idle);
        // En az hamlede çözülenler kartı.
        const a = rep.items[0].text;
        expect(a.includes('sonuç yorumlanmadı'), label).toBe(none);
        expect(/tam yansıtmayabilir/.test(a), label).toBe(idle);
        expect(a.includes('olağandır'), label).toBe(false);
        expect(a.includes('yönergeyi tam anlamamış') || a.includes('yönerge tam anlaşılmamış'), label).toBe(none || (idle && S.idle > 0));
        expect(a.includes('hepsini en az hamlede'), label).toBe(!none && r.optimal === 20);
        expect(a.includes('hemen hepsinde'), label).toBe(!none && r.optimal >= 16 && r.optimal < 20);
        // Problem uzadıkça kartı.
        const b = rep.items[1].text;
        const flat = S.optimal >= 7 && L.optimal >= 7;
        expect(/sonucu?n? düşmedi/.test(b), label).toBe(!none && flat && M.optimal >= 3 && L.optimal >= S.optimal);
        expect(/sonucu?n? pek değişmedi: uzun/.test(b), label).toBe(!none && flat && M.optimal >= 3 && L.optimal < S.optimal);
        expect(/sonucu?n? birbirine yakın; 5 hamlelik problemlerde ise/.test(b), label).toBe(!none && flat && M.optimal < 3);
        if (b.includes('uzun problemlerin hepsinde')) expect(L.optimal, label).toBe(8);
        if (b.includes('uzun problemlerin hemen hepsinde') || b.includes('uzun problemlerin de hemen hepsinde')) expect(L.optimal, label).toBe(7);
        expect(b.includes('acele etmiş'), label).toBe(!none && !flat && diff <= -3 && S.idle === 0);
        expect(b.includes('Hiç top taşınmadan süresi dolan problemler'), label).toBe(!none && S.idle + M.idle + L.idle > 0);
        if (!none && S.idle + M.idle + L.idle > 0) {
          const parts = [
            S.idle > 0 ? `kısa problemlerde ${S.idle}` : '',
            M.idle > 0 ? `5 hamlelik problemlerde ${M.idle}` : '',
            L.idle > 0 ? `uzun problemlerde ${L.idle}` : '',
          ]
            .filter(Boolean)
            .join(', ');
          expect(b, label).toContain(`(${parts})`);
        }
        expect(/en kısa yolu bulma(n|sı) zorlaştı/.test(b), label).toBe(!none && !flat && diff >= 3 && L.idle < 4);
        expect(
          b.includes('uzun problemlerin yarısında ya da daha çoğunda süre içinde en kısa yolu bulama') ||
            b.includes('Uzun problemlerin yarısında ya da daha çoğunda süre içinde'),
          label,
        ).toBe(!none && !flat && diff >= 3 && L.idle >= 4);
        expect(b.includes('Uzun problemlerde kısa problemlerden daha çok') || b.includes('uzun problemlerde kısa problemlerden daha çok'), label).toBe(
          !none && !flat && diff <= -3,
        );
        expect(/[Kk]ısa problemlerin (yarısında ya da daha çoğunda|hiçbirinde) en kısa yolu/.test(b), label).toBe(!none && S.optimal <= 4 && diff > -3);
        if (/[Kk]ısa problemlerin hiçbirinde/.test(b)) expect(S.optimal, label).toBe(0);
        // Çözüm biçimi kartı.
        const c = rep.items[2].text;
        expect(c.includes(`toplam ${r.excessMoves} hamle fazla`), label).toBe(r.extra > 0);
        expect(c.includes(`${r.unsolved} problemde hedefe ulaşama`), label).toBe(r.unsolved > 0);
        if (r.extra > 0) expect(c, label).toContain(r.extra === 1 ? 'bu problemde toplam' : 'bu problemlerde toplam');
        expect(c.includes('hiç top taşınmadı'), label).toBe(r.idle > 0);
        expect(c.includes('Hedefte bir çubuğun en altındaki top'), label).toBe(!none && r.extra >= 3 && r.extra >= r.unsolved);
        // Başlamadan önce düşünme kartı.
        const d = rep.items[3].text;
        expect(d.includes('düşünmeden başlamış olabilir'), label).toBe(!none && r.medianPick !== null && rapid);
        if (rapid && !none) {
          expect(d, label).toContain(`12 problemin ${r.rapid} tanesinde`);
          expect(d, label).not.toMatch(/plana daha çok zaman|daha uzun düşün/);
        }
        expect(d.includes('kafanda denemek') || d.includes('kafada denemesi'), label).toBe(
          !none && r.medianPick !== null && (rapid || (L.optimal <= 4 && /daha uzun düşünme(din|di)\./.test(d))),
        );
        // Aynı öneri iki kartta birden verilmez.
        expect(c.includes('kafanda denemek') || c.includes('kafada denemesi'), label).toBe(false);
        expect(d.includes('Buna karşın uzun problemlerin de hepsini'), label).toBe(!none && L.optimal === 8 && /daha uzun düşünme(din|di)\./.test(d));
        expect(d.includes('Buna karşın uzun problemlerin de hemen hepsini'), label).toBe(!none && L.optimal === 7 && /daha uzun düşünme(din|di)\./.test(d));
        expect(d.includes('sürenin ortalama %'), label).toBe(!none && r.medianPick !== null && r.prePlan !== null);
        if (d.includes('sürenin ortalama %')) expect(d, label).toContain(`%${r.prePlan} kadarını`);
        // Grafik, sütunlar ve öne çıkan sayılar kartlarla aynı.
        expect(rep.chart?.type === 'bars' ? rep.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(r.levels.map((l) => `${l.optimal}/4`));
        expect(
          rep.roadmap!.bars.map((x) => x.valueLabel),
          label,
        ).toEqual(none ? [] : r.levels.map((l) => `${l.optimal}/4`));
        expect(rep.keyFigures.find((f) => f.label === 'En az hamlede çözülen')?.value, label).toBe(`${r.optimal}/20`);
        expect(rep.keyFigures.find((f) => f.label === 'Hedefe ulaşılamayan')?.value, label).toBe(String(r.unsolved));
        if (!parent) expect(t, label).not.toContain('Çocuğunuz');
      }
      expect(text(res.parent), label).not.toMatch(
        /\b(çözdün|buldun|yaptın|ulaştın|ulaşamadın|dokundun|düşündün|düşünmedin|ayırdın|geçirdin|çözemedin|bulamadın|taşımadın|olabilirsin|olabileceğin)\b|bak\./,
      );
      expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
      n++;
    }
    expect(n).toBe(1500);
  }, 300_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, towerBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, towerBody(undefined, 3)).student.items).toHaveLength(4);
    const r = evaluateReports(SLUG, towerBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(rmText).not.toMatch(/kitap/i);
  });

  it('yayındaki sitenin dış sınamasındaki örnek hamleler her problemi en az hamlede çözer', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /KG_GOVDE=.*?h=(\[\[.*?\]\]);/.exec(yml);
    expect(m).not.toBeNull();
    const seqs = JSON.parse(m![1]) as number[][];
    expect(seqs).toHaveLength(20);
    seqs.forEach((codes, i) => {
      const it = task.items[i];
      expect(codes, it.key).toHaveLength(it.minMoves);
      let st = keyOf(it.start);
      for (const code of codes) {
        const next = successors(st).find(([a, b]) => (a + 1) * 10 + (b + 1) === code);
        expect(next, `${it.key} ${code}`).toBeDefined();
        st = next![2];
      }
      expect(st, it.key).toBe(keyOf(it.goal));
      // Bağımsız denetleyicinin bulduğu yol da aynı uzunlukta.
      expect(shortestPath(keyOf(it.start), keyOf(it.goal)), it.key).toHaveLength(codes.length);
    });
    const trials = seqs.map((codes, index) => ({
      index,
      response: { moves: codes, times: codes.map((_, k) => 5000 + 1000 * k), pick: 4000 },
      rtMs: 4000 + 1000 * codes.length,
    }));
    const r = evaluate(SLUG, { grade: 7, data: { engine: 'tasks', seed: '6f1c2e0b-3e4b-4a8a-9a55-5d1f0c8e2a11', blocks: { [task.key]: trials } } });
    expect(r.student.items[0].badge).toBe('20 problemin 20 tanesi en az hamlede');
    expect(r.parent.roadmap!.bars).toHaveLength(5);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toContain('kg_sayfa');
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(
      SLUG,
      towerBody((q) => ({ outcome: q.moves <= 4 ? 'optimal' : q.i % 3 ? 'extra' : 'unsolved', pickMs: 1000 * q.moves })),
    );
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, towerBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(planlamaKuleGorevi.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(planlamaKuleGorevi.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(planlamaKuleGorevi.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...planlamaKuleGorevi.science, citations: [] });
    for (const a of [
      'Albert ve Steinberg, 2011',
      'Berg ve ark., 2010',
      'Fimbel ve ark., 2009',
      'Kaller ve ark., 2011',
      'Kaller ve ark., 2008',
      'Kaller ve ark., 2012',
      'Luciana ve ark., 2009',
      'Malloy-Diniz ve ark., 2008',
      'Phillips ve ark., 2021',
      'Phillips ve ark., 2001',
      'Schumacher ve ark., 2026',
      'Shallice, 1982',
      'Unterrainer ve ark., 2019',
      'Unterrainer ve ark., 2003',
      'Waid-Ebbs ve ark., 2026',
    ])
      expect(body, a).toContain(a);
    expect(planlamaKuleGorevi.science.citations).toHaveLength(15);
    expect(TASK_ROADMAPS[SLUG].sources.every((x) => x.url?.startsWith('https://doi.org/'))).toBe(true);
  });
});
