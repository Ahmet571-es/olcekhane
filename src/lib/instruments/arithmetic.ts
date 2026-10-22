import type { ArithItem, ArithOp } from './types';

/**
 * Zihinden hesaplama hızının ortak hesapları (content/instruments/zihinden-hesaplama.ts, lib/scoring/tasks.ts,
 * lib/reports/build.ts): işlemin sonucu, ekrandaki işaretler ve yanlış cevapların türü.
 */

export const ARITH_OPS: ArithOp[] = ['add', 'sub', 'mul', 'div'];

/** Ekranda ve raporda işlemin işareti (eksi ve çarpı işaretleri tipografik karakterlerdir). */
export const ARITH_SIGN: Record<ArithOp, string> = { add: '+', sub: '−', mul: '×', div: '÷' };

/** İşlemin adı: "Toplama". */
export const ARITH_NAME: Record<ArithOp, string> = { add: 'Toplama', sub: 'Çıkarma', mul: 'Çarpma', div: 'Bölme' };

/** Cümle içinde işlemin adı, belirtme ve bulunma ekleriyle: "toplamada", "çarpmayı". */
export const ARITH_IN: Record<ArithOp, string> = { add: 'toplamada', sub: 'çıkarmada', mul: 'çarpmada', div: 'bölmede' };

export function arithAnswer(op: ArithOp, [a, b]: ArithItem): number {
  switch (op) {
    case 'add':
      return a + b;
    case 'sub':
      return a - b;
    case 'mul':
      return a * b;
    case 'div':
      return a / b;
  }
}

/** "47 + 8" (ekran okuyucu için ayrıca okunuşu verilir). */
export const arithText = (op: ArithOp, [a, b]: ArithItem) => `${a} ${ARITH_SIGN[op]} ${b}`;

/** Ekran okuyucu için işlemin okunuşu: "47 artı 8". */
const SPOKEN: Record<ArithOp, string> = { add: 'artı', sub: 'eksi', mul: 'çarpı', div: 'bölü' };
export const arithSpoken = (op: ArithOp, [a, b]: ArithItem) => `${a} ${SPOKEN[op]} ${b}`;

/**
 * Yanlış cevabın türü (yalnızca yanlış cevaplarda; aşağıdaki sırayla denenir, ilk uyan tür sayılır):
 *  - `regroup`: elde ya da onluk bozma atlandı. Toplamada eldenin eklenmemesi (47 + 8 için 45; 8 + 5 için 3), çıkarmada
 *    bozulan onluğun düşülmemesi (52 − 7 için 55) ya da her basamakta büyükten küçüğün çıkarılması (63 − 28 için 45),
 *    çarpmada eldenin eklenmemesi (16 × 4 için 44) ya da basamakların değeri gözetilmeden toplanması (16 × 4 için 4 + 24 = 28);
 *    çarpmada yalnızca birler basamağının çarpımı onu geçiyorsa (eldeli işlemlerde).
 *  - `operation`: başka bir işlemin sonucu yazıldı (ör. 9 + 4 için 5 ya da 36; 56 ÷ 8 için 48).
 *  - `reversal`: rakamların yeri değişti (45 yerine 54; 7 × 3 için 12). Tablo yanlışından önce denenir: 9'un katlarının
 *    rakamları yer değiştirince yine 9'un katıdır.
 *  - `table`: çarpım tablosunda çarpanlardan birinin tablosundaki başka bir sonuç (7 × 8 için 7 × 9 = 63, 6 × 8 = 48 ya da
 *    4 × 8 = 32; araştırmalarda "operand-related" yanlışlar; Soltanlou ve ark., 2015). Yalnızca tablo işlemlerinde.
 *  - `quotient`: tabloya dayanan bölmelerde bölüm bir ya da iki eksik ya da fazla (56 ÷ 8 için 6 ya da 8).
 *  - `near`: toplamada ve çıkarmada bir fazla ya da bir eksik (sayarken bir adım kaçmış ya da fazladan sayılmış olabilir).
 *  - `other`: ötekiler.
 */
export type ArithErrorKind = 'operation' | 'regroup' | 'table' | 'quotient' | 'near' | 'reversal' | 'other';
export const ARITH_ERROR_KINDS: ArithErrorKind[] = ['operation', 'regroup', 'table', 'quotient', 'near', 'reversal', 'other'];

const reverseDigits = (n: number) => Number(String(n).split('').reverse().join(''));

/** İki basamaklı (ya da tek basamaklı) iki sayıda her basamakta büyükten küçüğü çıkarmak: 63 − 28 → 45. */
function smallerFromLarger(a: number, b: number): number {
  const ta = Math.floor(a / 10);
  const tb = Math.floor(b / 10);
  return (ta - tb) * 10 + Math.abs((a % 10) - (b % 10));
}

export function arithErrorKind(op: ArithOp, item: ArithItem, value: number, fact: boolean): ArithErrorKind {
  const [a, b] = item;
  const c = arithAnswer(op, item);
  if (value === c) throw new Error('Doğru cevabın hata türü olmaz.');
  // Elde ya da onluk bozma önce denenir: 8 + 5 için 3 hem eldenin yazılmaması hem 8 − 5 olabilir; tek basamağın yazılması
  // daha olası sayılır (81 − 5 için 86 da hem bozulan onluğun düşülmemesi hem 81 + 5'tir).
  // Toplamda yalnızca birler basamağının yazılması (8 + 5 için 3); toplam tam 10 ise (5 + 5 için 0) sayılmaz. Çıkarmada
  // eksilen iki basamaklı olmalıdır (10 − 6 için 14 bir onluk bozma yanlışı değildir).
  if (op === 'add' && (a % 10) + (b % 10) >= 10 && value === c - 10 && value > 0) return 'regroup';
  if (op === 'sub' && a > 10 && a % 10 < b % 10 && (value === c + 10 || value === smallerFromLarger(a, b))) return 'regroup';
  // Çarpmada yalnızca birler basamağının çarpımı onu geçiyorsa (16 × 4; 12 × 3 için 9 bir elde yanlışı değildir).
  if (op === 'mul' && a > 10 && a % 10 !== 0 && b < 10 && (a % 10) * b >= 10) {
    const t = Math.floor(a / 10);
    const o = a % 10;
    if (value === t * b * 10 + ((o * b) % 10) || value === t * b + o * b) return 'regroup';
  }
  const others: number[] =
    op === 'add' ? [Math.abs(a - b), a * b] : op === 'sub' ? [a + b] : op === 'mul' ? [a + b, Math.abs(a - b)] : [a * b, a - b];
  if (others.includes(value)) return 'operation';
  if (c >= 10 && reverseDigits(c) === value && c % 10 !== 0) return 'reversal';
  // Çarpım tablosunda çarpanlardan birinin tablosundaki başka bir sonuç (2'den 10'a kadar katları).
  if (fact && op === 'mul') {
    for (let k = 2; k <= 10; k++) if (value === a * k || value === k * b) return 'table';
  }
  if (fact && op === 'div' && Math.abs(value - c) <= 2) return 'quotient';
  if ((op === 'add' || op === 'sub') && Math.abs(value - c) === 1) return 'near';
  return 'other';
}
