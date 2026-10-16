import type { PerspectiveItem, PerspectiveObject } from './types';

/**
 * Bakış açısı alma: haritadaki nesnelerin konumundan açıların hesabı. Konumlar 0–100 arasıdır; y ekranda aşağı doğru
 * büyür. Açılar derece cinsindendir ve saat yönünde ölçülür: 0 ileri (cevap çemberinde yukarı), 90 sağ, −90 sol, 180 arka.
 * Puanlama (lib/scoring/tasks.ts), çözme ekranı (alıştırmadaki geri bildirim) ve testler aynı hesabı kullanır.
 */

/** Açıyı (−180, 180] aralığına getirir. */
export function normDeg(a: number): number {
  const x = ((((a + 180) % 360) + 360) % 360) - 180;
  return x === -180 ? 180 : x;
}

/** İki yön arasındaki en küçük açı (0–180): çemberin kısa yolundan ölçülür. */
export function angleDiff(a: number, b: number): number {
  return Math.abs(normDeg(a - b));
}

/** Haritada `from`dan `to`ya giden yön: ekranın yukarısından saat yönünde. */
export function bearing(from: Pick<PerspectiveObject, 'x' | 'y'>, to: Pick<PerspectiveObject, 'x' | 'y'>): number {
  return normDeg((Math.atan2(to.x - from.x, -(to.y - from.y)) * 180) / Math.PI);
}

/** Hayal edilen bakış yönünün ekranın yukarısıyla yaptığı açı (kişinin zihinde dönmesi gereken açı; işaretli). */
export function headingOf(objects: readonly PerspectiveObject[], item: PerspectiveItem): number {
  return bearing(objects[item.at], objects[item.facing]);
}

/** Doğru cevap: hedefin, bakılan nesneye göre yönü (0 ileri, saat yönünde). */
export function correctAngle(objects: readonly PerspectiveObject[], item: PerspectiveItem): number {
  return normDeg(bearing(objects[item.at], objects[item.target]) - headingOf(objects, item));
}

/**
 * Haritaya göre cevap: kişi kendini nesnenin yanında hayal etmeden, haritaya yukarıdan bakar gibi hedefin haritadaki
 * yönünü gösterirse oku buraya çizer (bakış yönü ekranın yukarısıyla aynıymış gibi).
 */
export function egocentricAngle(objects: readonly PerspectiveObject[], item: PerspectiveItem): number {
  return bearing(objects[item.at], objects[item.target]);
}

/** Sağ ile solun karıştırıldığı cevap: doğru cevabın ileri yöne göre ayna görüntüsü. */
export function mirrorAngle(objects: readonly PerspectiveObject[], item: PerspectiveItem): number {
  return normDeg(-correctAngle(objects, item));
}

/** Bir cevabın, bir yönün ±`PA_ZONE` derece yakınında sayıldığı genişlik. */
export const PA_ZONE = 20;
/** Bu kadar ya da daha az hatalı cevap "doğru yöne yakın" sayılır. */
export const PA_CLOSE = 20;
/** Zihinde dönülmesi gereken açı en çok bu kadarsa soru "küçük dönüşlü" sayılır. */
export const PA_SMALL_MAX = 90;
/**
 * Haritaya göre cevap yalnızca dönüş açısı en az bu kadar olan sorularda ayırt edilir: dönüş küçükse haritaya göre
 * cevap doğru cevaba çok yakındır.
 */
export const PA_EGO_MIN_SHIFT = 45;

/** Dönüş açısı grupları (grafik): 0–45, 45–90, 90–135 ve 135–180 derece. */
export const PA_SHIFT_BINS: readonly [number, number][] = [
  [0, 45],
  [45, 90],
  [90, 135],
  [135, 180],
];

/** Dönüş açısının grubu: 45 ve 90 alt gruplarda, 135 ise üçüncü grupta sayılır. */
export function shiftBin(shift: number): number {
  const a = Math.abs(shift);
  return a < 45 ? 0 : a <= 90 ? 1 : a <= 135 ? 2 : 3;
}

/** Bir yönün sözle anlatımı (kişiye göre): "sağ önünde", "tam arkanda" gibi. Sekiz dilim, her biri 45 derece. */
export function sectorWords(angle: number, person: 'you' | 'third' = 'you'): string {
  const a = normDeg(angle);
  const words =
    person === 'you'
      ? ['tam önünde', 'sağ önünde', 'sağında', 'sağ arkanda', 'tam arkanda', 'sol arkanda', 'solunda', 'sol önünde']
      : ['tam önünde', 'sağ önünde', 'sağında', 'sağ arkasında', 'tam arkasında', 'sol arkasında', 'solunda', 'sol önünde'];
  const k = Math.round((a < 0 ? a + 360 : a) / 45) % 8;
  return words[k];
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);

/** Sorunun cümlesi: "Kovanın yanında durup topa doğru baktığını hayal et. Lamba hangi yönde?" */
export function questionText(objects: readonly PerspectiveObject[], item: PerspectiveItem): string {
  const at = objects[item.at];
  const facing = objects[item.facing];
  const target = objects[item.target];
  return `${cap(at.gen)} yanında durup ${facing.dat} doğru baktığını hayal et. ${target.name} hangi yönde?`;
}

/** Alıştırmadaki açıklama: "Kovanın yanında durup topa doğru baktığında lamba sağ önünde kalır." */
export function explainText(objects: readonly PerspectiveObject[], item: PerspectiveItem): string {
  const at = objects[item.at];
  const facing = objects[item.facing];
  const target = objects[item.target];
  return `${cap(at.gen)} yanında durup ${facing.dat} doğru baktığında ${target.name.toLocaleLowerCase('tr-TR')} ${sectorWords(correctAngle(objects, item))} kalır.`;
}

/**
 * Cevap çemberinde bir noktanın yönü (çemberin ortasına göre; x sağa, y aşağı doğru, aynı birimde): tam derece, 0 yukarı,
 * saat yönünde. Ortaya `dead` birimden yakın noktanın yönü belirsiz olduğu için `null` döner.
 */
export function dialAngle(x: number, y: number, dead = 6): number | null {
  if (Math.hypot(x, y) < dead) return null;
  return normDeg(Math.round((Math.atan2(x, -y) * 180) / Math.PI));
}

/** Klavyeyle oku çevirme: henüz yön seçilmediyse tam önden (0) başlar; −180/180'i geçerken çevrilir. */
export const turnBy = (value: number | null, step: number) => normDeg((value ?? 0) + step);
