/**
 * Sayısal akıl yürütme sorularının bağımsız denetleyicisi (tests/sayisal-akil-yurutme.test.ts). Her soru burada
 * sorudaki sayılarla yeniden yazılır; doğru cevap ve yanılgı cevapları bu sayılardan hesaplanır ve testin cevap
 * anahtarıyla karşılaştırılır. Sayıların sorunun metninde geçtiği ayrıca denetlenir.
 *
 *  - Orantılı (`p`): a için b ise c için c·b/a. Fark korunarak: c + (b − a).
 *  - Fark korunan (`a`): a iken b ise c iken c + (b − a). Orantı kurularak: c·b/a.
 *  - Değişmeyen (`c`): a tanesi b sürede ise c tanesi de b sürede. Orantı: c·b/a; ters orantı (tam sayıysa): a·b/c.
 *  - Başlangıçlı (`f`): başta s, x1 adımda y1 ise x2 adımda s + (y1 − s)/x1 · x2. Orantı: y1·x2/x1.
 *  - Eşittir (`eq`): l1 + l2 = □ + r ya da r + □. Yanılgı: l1 + l2 ve l1 + l2 + r.
 *  - Denkleştirme (`comp`): l1 op l2 = r1 op □. Yanılgı: soldaki işlemin sonucu (toplamada bütün sayıların toplamı da)
 *    ve ters yönde denkleştirme.
 *  - Terazi: n özdeş paket = 1 paket + w (`bal1`); kavun = k elma, kavun + elma = t (`bal2`).
 */
import type { NumericLureKind } from '@/lib/instruments/types';

type Formal =
  | { kind: 'p' | 'a' | 'c'; a: number; b: number; c: number }
  | { kind: 'f'; s: number; x1: number; y1: number; x2: number }
  | { kind: 'eq'; l: [number, number]; r: number }
  | { kind: 'comp'; op: '+' | '−' | '×' | '÷'; l: [number, number]; r1: number }
  | { kind: 'bal1'; n: number; w: number }
  | { kind: 'bal2'; k: number; t: number };

export const NUMERIC_FORMAL: Record<string, Formal> = {
  // 3 simit 15 lira; 9 simit?
  sy01: { kind: 'p', a: 3, b: 15, c: 9 },
  // 7 + 8 = □ + 6
  sy02: { kind: 'eq', l: [7, 8], r: 6 },
  // Ece 3 yaşındayken abla 9; Ece 12 yaşına gelince?
  sy03: { kind: 'a', a: 3, b: 9, c: 12 },
  // 4 bardak suya 6 kaşık; 10 bardak?
  sy04: { kind: 'p', a: 4, b: 6, c: 10 },
  // 3 gömlek 5 saat; 6 gömlek?
  sy05: { kind: 'c', a: 3, b: 5, c: 6 },
  // 38 + 27 = 40 + □
  sy06: { kind: 'comp', op: '+', l: [38, 27], r1: 40 },
  // 2 yumurtaya 6 kaşık; 8 yumurta?
  sy07: { kind: 'p', a: 2, b: 6, c: 8 },
  // Taksimetre 20'den başlıyor; 2 km 40 lira; 6 km?
  sy08: { kind: 'f', s: 20, x1: 2, y1: 40, x2: 6 },
  // Birinci fidan 6 iken ikinci 8; birinci 9 iken?
  sy09: { kind: 'a', a: 6, b: 8, c: 9 },
  // 9 + 6 = 8 + □
  sy10: { kind: 'eq', l: [9, 6], r: 8 },
  // Aynı anda başladılar: Deniz 4 tur, Efe 10 tur; Deniz 14 tur?
  sy11: { kind: 'p', a: 4, b: 10, c: 14 },
  // 73 − 28 = 75 − □
  sy12: { kind: 'comp', op: '−', l: [73, 28], r1: 75 },
  // 20 kişilik koro 6 dakika; 60 kişilik?
  sy13: { kind: 'c', a: 20, b: 6, c: 60 },
  // Aynı anda başladılar: Ayşe 10 sayfa, Kerem 30; Ayşe 50 sayfa?
  sy14: { kind: 'p', a: 10, b: 30, c: 50 },
  // Aynı hız, Arda önce başladı: Zeynep 2 tur, Arda 10; Zeynep 6 tur?
  sy15: { kind: 'a', a: 2, b: 10, c: 6 },
  // 6 × 8 = 12 × □
  sy16: { kind: 'comp', op: '×', l: [6, 8], r1: 12 },
  // Kumbarada başta 15; 3 hafta sonra 30; 9 hafta sonra?
  sy17: { kind: 'f', s: 15, x1: 3, y1: 30, x2: 9 },
  // Fotoğraf eni 6 boyu 8; eni 15 olunca boyu?
  sy18: { kind: 'p', a: 6, b: 8, c: 15 },
  // Aynı hız, Selin önce başladı: Mert 40 sayfa, Selin 90; Mert 60 sayfa?
  sy19: { kind: 'a', a: 40, b: 90, c: 60 },
  // 48 ÷ 6 = 24 ÷ □
  sy20: { kind: 'comp', op: '÷', l: [48, 6], r1: 24 },
  // 6 kutu maviye 14 kutu beyaz; 9 kutu maviye?
  sy21: { kind: 'p', a: 6, b: 14, c: 9 },
  // 4 özdeş paket = 1 paket + 12 kilo
  sy22: { kind: 'bal1', n: 4, w: 12 },
  // 3 km 12 dakika; 15 km?
  sy23: { kind: 'p', a: 3, b: 12, c: 15 },
  // 2 elma = 1 kavun; 1 kavun + 1 elma = 600 gram
  sy24: { kind: 'bal2', k: 2, t: 600 },
};

/** Sorunun sayıları (metinde geçmeleri gerekir). */
export function formalNumbers(key: string): number[] {
  const f = NUMERIC_FORMAL[key];
  switch (f.kind) {
    case 'p':
    case 'a':
    case 'c':
      return [f.a, f.b, f.c];
    case 'f':
      return [f.s, f.x1, f.y1, f.x2];
    case 'eq':
      return [...f.l, f.r];
    case 'comp':
      return [...f.l, f.r1];
    case 'bal1':
      return [f.n, f.w];
    case 'bal2':
      return [f.k, f.t];
  }
}

/** Doğru cevap ve yanılgı cevapları, sorunun sayılarından. */
export function numericExpected(key: string): { answer: number; lures: Partial<Record<NumericLureKind, number[]>> } {
  const f = NUMERIC_FORMAL[key];
  if (!f) throw new Error(`Biçimsel yazımı olmayan soru: ${key}`);
  switch (f.kind) {
    case 'p':
      return { answer: (f.c * f.b) / f.a, lures: { additive: [f.c + (f.b - f.a)] } };
    case 'a':
      return { answer: f.c + (f.b - f.a), lures: { proportional: [(f.c * f.b) / f.a] } };
    case 'c':
      return { answer: f.b, lures: { proportional: [(f.c * f.b) / f.a], ...(Number.isInteger((f.a * f.b) / f.c) ? { inverse: [(f.a * f.b) / f.c] } : {}) } };
    case 'f':
      return { answer: f.s + ((f.y1 - f.s) / f.x1) * f.x2, lures: { proportional: [(f.y1 * f.x2) / f.x1] } };
    case 'eq': {
      const sum = f.l[0] + f.l[1];
      return { answer: sum - f.r, lures: { operational: [sum, sum + f.r] } };
    }
    case 'comp': {
      const [x, y] = f.l;
      const d = f.r1 - x;
      if (f.op === '+') return { answer: x + y - f.r1, lures: { operational: [x + y, x + y + f.r1], reverse: [y + d] } };
      if (f.op === '−') return { answer: f.r1 - (x - y), lures: { operational: [x - y], reverse: [y - d] } };
      if (f.op === '×') return { answer: (x * y) / f.r1, lures: { operational: [x * y], reverse: [y * (f.r1 / x)] } };
      return { answer: f.r1 / (x / y), lures: { operational: [x / y], reverse: [y * (x / f.r1)] } };
    }
    case 'bal1':
      return { answer: f.w / (f.n - 1), lures: { partial: [f.w / f.n] } };
    case 'bal2':
      return { answer: f.t / (f.k + 1), lures: { partial: [f.t / 2] } };
  }
}
