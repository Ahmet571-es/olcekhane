import { constrainedOrder } from './sequences';
import type { RuleSwitchRule, RuleSwitchTrial } from './types';

/**
 * Kural değiştirme görevinin uyaranları ve deneme düzeni (content/instruments/kural-degistirme.ts). Bu dosyadaki
 * üretim kuralları değişirse testin sürüm numarası artırılmalıdır.
 *
 * Her denemede tek bir şekil görünür: mavi ya da turuncu, daire ya da kare. Şeklin üstündeki işaret kuralı söyler:
 * RENK kuralında mavi şekle sol, turuncu şekle sağ düğme; ŞEKİL kuralında daireye sol, kareye sağ düğme. Mavi daire ve
 * turuncu kare iki kuralda da aynı düğmeyi ister (uyumlu); mavi kare ve turuncu daire iki kuralda farklı düğmeyi ister
 * (uyumsuz). Uyumsuz şekilde yanlış düğmeye basmak, öteki kurala göre cevap vermek demektir.
 */

export const RULE_SWITCH_COLORS = [
  { name: 'Mavi', fill: '#2563eb' },
  { name: 'Turuncu', fill: '#f08a24' },
] as const;
export const RULE_SWITCH_SHAPES = [{ name: 'Daire' }, { name: 'Kare' }] as const;
export const RULE_NAMES: Record<RuleSwitchRule, string> = { color: 'RENK', shape: 'ŞEKİL' };

/** Doğru düğme: 0 sol, 1 sağ. */
export const ruleAnswer = (t: Pick<RuleSwitchTrial, 'rule' | 'color' | 'shape'>) => (t.rule === 'color' ? t.color : t.shape);
/** İki kural aynı düğmeyi istiyor mu? */
export const ruleCongruent = (t: Pick<RuleSwitchTrial, 'color' | 'shape'>) => t.color === t.shape;

/** Bir denemenin karışık bölümdeki yeri: bölümün ilk denemesi, kuralın sürdüğü ya da değiştiği deneme; tek kurallı bölümde `pure`. */
export type RuleSwitchKind = 'pure' | 'first' | 'repeat' | 'switch';

export function ruleSwitchKinds(trials: readonly RuleSwitchTrial[]): RuleSwitchKind[] {
  return trials.map((t, i) => {
    if (t.block < 2) return 'pure';
    const prev = trials[i - 1];
    if (!prev || prev.block !== t.block) return 'first';
    return prev.rule === t.rule ? 'repeat' : 'switch';
  });
}

const run = <T>(before: T[], next: T, key: (x: T) => unknown) => {
  let n = 0;
  for (let i = before.length - 1; i >= 0 && key(before[i]) === key(next); i--) n++;
  return n;
};

/**
 * Tek kurallı bölüm: dört şeklin her biri `each` kez. Sıra kuralları: aynı düğme en çok 3 kez art arda, aynı şekil art
 * arda gelmez.
 */
export function pureTrials(rule: RuleSwitchRule, block: number, each: number, rand: () => number): RuleSwitchTrial[] {
  const cells: RuleSwitchTrial[] = [];
  for (const color of [0, 1] as const) for (const shape of [0, 1] as const) for (let k = 0; k < each; k++) cells.push({ rule, color, shape, block });
  return constrainedOrder(cells, rand, (before, next) => {
    const last = before[before.length - 1];
    if (last && last.color === next.color && last.shape === next.shape) return false;
    return run(before, next, ruleAnswer) < 3;
  });
}

/**
 * Karışık bölüm: ilk denemeden sonra 32 deneme; kuralın değiştiği (16) ve sürdüğü (16) denemelerin her birinde uyumlu
 * ve uyumsuz şekiller ile sol ve sağ düğme dengelidir. Sıra kuralları: aynı kural en çok 4 kez art arda, aynı düğme en
 * çok 3 kez art arda, aynı şekil art arda gelmez; iki kural bölümde eşit sayıya yakın (en çok 1 fark) kullanılır.
 */
export function mixedTrials(block: number, firstRule: RuleSwitchRule, rand: () => number): RuleSwitchTrial[] {
  type Cell = { kind: 'switch' | 'repeat'; congruent: boolean; side: 0 | 1 };
  const cells: Cell[] = [];
  for (const kind of ['switch', 'repeat'] as const)
    for (const congruent of [true, false]) for (const side of [0, 1] as const) for (let k = 0; k < 4; k++) cells.push({ kind, congruent, side });
  const toTrial = (rule: RuleSwitchRule, c: Pick<Cell, 'congruent' | 'side'>): RuleSwitchTrial => {
    const other: 0 | 1 = c.congruent ? c.side : c.side === 0 ? 1 : 0;
    return rule === 'color' ? { rule, color: c.side, shape: other, block } : { rule, color: other, shape: c.side, block };
  };
  for (let attempt = 0; attempt < 200; attempt++) {
    const first = toTrial(firstRule, { congruent: rand() < 0.5, side: rand() < 0.5 ? 0 : 1 });
    const rules = (cs: Cell[]) => {
      const out: RuleSwitchRule[] = [firstRule];
      for (const c of cs) out.push(c.kind === 'repeat' ? out[out.length - 1] : out[out.length - 1] === 'color' ? 'shape' : 'color');
      return out;
    };
    let ordered: Cell[];
    try {
      ordered = constrainedOrder(cells, rand, (before, next) => {
        const rs = rules([...before, next]);
        const trials = rs.map((r, i) => (i === 0 ? first : toTrial(r, (i === rs.length - 1 ? next : before[i - 1]) as Cell)));
        const t = trials[trials.length - 1];
        const prev = trials[trials.length - 2];
        if (prev.color === t.color && prev.shape === t.shape) return false;
        if (run(rs.slice(0, -1), rs[rs.length - 1], (x) => x) >= 4) return false;
        return run(trials.slice(0, -1), t, ruleAnswer) < 3;
      });
    } catch {
      continue;
    }
    const rs = rules(ordered);
    const nColor = rs.filter((r) => r === 'color').length;
    if (Math.abs(nColor - (rs.length - nColor)) > 1) continue;
    return [first, ...ordered.map((c, i) => toTrial(rs[i + 1], c))];
  }
  throw new Error('Kurallara uyan bir karışık bölüm üretilemedi.');
}
