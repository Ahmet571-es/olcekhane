import { seedFrom } from './cancellation';
import type { SymbolRef, SymbolSearchTask, SymbolSearchTrial } from './types';

/**
 * Simge bulma görevinin denemeleri. Hem tarayıcıda (denemeleri göstermek için) hem sunucuda (aynı denemeleri yeniden üretip
 * puanlamak için) kullanılır; bu yüzden saf ve belirlenimcidir. Denemeler uygulama kimliğinden türetilen tohumla üretilir:
 * her uygulamanın denemeleri farklıdır (ezberlenemez), aynı uygulamanınki her zaman aynıdır.
 *
 * Denemeler sekizli bloklar hâlindedir; her blokta dört deneme türünün (aranan simge sırada var ya da yok × sırada aranan
 * simgelerden birinin benzeri var ya da yok) her birinden iki deneme vardır, sırası karıştırılır. Bir blokta:
 *  - aranan simgenin sırada olduğu dört denemenin ikisinde birinci, ikisinde ikinci aranan simge sıradadır ve bu dört denemede
 *    simge sıranın dört yerinin her birinde birer kez durur;
 *  - benzer simgenin olduğu dört denemenin ikisinde birinci, ikisinde ikinci aranan simgenin benzeri vardır; benzer, aranan
 *    simgenin yerinde durmaz.
 * Aranan simgeler havuzdan karıştırılmış tam turlar hâlinde, ikişer ikişer alınır (her simge eşit sıklıkta aranır); bir
 * denemenin aranan simgelerinden hiçbiri bir önceki denemede aranmaz. Sıranın geri kalanı, aranmayan havuz simgelerindendir;
 * bir sırada aynı simge iki kez yoktur.
 */

/** Küçük, belirlenimci rastgele sayı üreteci (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Bloktaki deneme sayısı: dört türün her birinden iki. */
export const SG_BLOCK = 8;

/** Uygulamanın denemeleri (task.trials tane). */
export function symbolSearchTrials(task: SymbolSearchTask, seed: string): SymbolSearchTrial[] {
  const rand = rng(seedFrom(`${seed}:${task.key}:${task.generator}`));
  const n = task.glyphs.length;
  const out: SymbolSearchTrial[] = [];
  let deck: number[] = [];
  let prevTargets: number[] = [];
  const nextPair = (): [number, number] => {
    const pair: number[] = [];
    while (pair.length < 2) {
      if (deck.length === 0) deck = shuffle(Array.from({ length: n }, (_, i) => i), rand);
      // Önceki denemede aranan ya da çiftte zaten olan simge desteden atlanır (destenin sonuna konur).
      const k = deck.findIndex((g) => !prevTargets.includes(g) && !pair.includes(g));
      if (k === -1) {
        deck = [...deck, ...shuffle(Array.from({ length: n }, (_, i) => i), rand)];
        continue;
      }
      pair.push(deck.splice(k, 1)[0]);
    }
    return [pair[0], pair[1]];
  };
  // Benzerlerin sırası: her simgenin benzerleri dönüşümlü kullanılır.
  const lookTurn = new Array<number>(n).fill(0);

  while (out.length < task.trials) {
    const types = shuffle(
      [
        [true, true],
        [true, true],
        [true, false],
        [true, false],
        [false, true],
        [false, true],
        [false, false],
        [false, false],
      ] as [boolean, boolean][],
      rand,
    );
    // Aranan simgenin sıradaki yeri ve hangi aranan simgenin sırada olduğu (bloktaki dört "var" denemesinde dengeli).
    const presentPos = shuffle([0, 1, 2, 3], rand);
    const presentWhich = shuffle([0, 0, 1, 1], rand);
    const lookWhich = shuffle([0, 0, 1, 1], rand);
    let pi = 0;
    let li = 0;
    for (const [present, lookalike] of types) {
      if (out.length >= task.trials) break;
      const targets = nextPair();
      prevTargets = targets;
      const group: (SymbolRef | null)[] = new Array(task.groupSize).fill(null);
      if (present) {
        group[presentPos[pi] % task.groupSize] = { g: targets[presentWhich[pi]] };
        pi++;
      }
      if (lookalike) {
        const src = targets[lookWhich[li]];
        li++;
        const free = group.map((x, i) => (x === null ? i : -1)).filter((i) => i >= 0);
        const pos = free[Math.floor(rand() * free.length)];
        const l = lookTurn[src] % task.lookalikes[src].length;
        lookTurn[src]++;
        group[pos] = { g: src, l };
      }
      const others = shuffle(
        Array.from({ length: n }, (_, i) => i).filter((g) => !targets.includes(g)),
        rand,
      );
      let oi = 0;
      for (let i = 0; i < group.length; i++) if (group[i] === null) group[i] = { g: others[oi++] };
      out.push({ targets, group: group as SymbolRef[], present, lookalike });
    }
  }
  return out;
}

/** Bir simgenin çizgileri. */
export function glyphOf(task: SymbolSearchTask, ref: SymbolRef): string[] {
  return ref.l === undefined ? task.glyphs[ref.g] : task.lookalikes[ref.g][ref.l];
}

/** Çizginin uçları: "01-12" → [[0, 1], [1, 2]] (x, y; y aşağı doğru). */
export function strokeEnds(stroke: string): [[number, number], [number, number]] {
  const [a, b] = stroke.split('-');
  return [
    [Number(a[0]), Number(a[1])],
    [Number(b[0]), Number(b[1])],
  ];
}
