/**
 * Yetişkine yazılan metinlerde yeri olmayan, okula ya da ergenliğe özgü sözcükler (sözcük başı). Meslek adı olarak
 * "öğretmenlik" (ilgi alanlarıyla ilişkili meslekler arasında) yetişkin için de doğrudur; spor ya da kitap kulübü de
 * yetişkinlere uygun olduğu için "kulüp" aranmaz. "Sınıflama" (sözel akıl yürütmede bir soru türü: kelimeleri gruplama)
 * okula özgü değildir.
 */
export const SCHOOL = [
  'okul', 'öğretmen', 'sınav', 'sınıf', 'ders', 'ödev', 'öğrenci', 'lise', 'ergen', 'veli', 'ailen', 'münazara', 'olimpiyat', 'tübitak',
  'izcilik', 'harçlık', 'yaşıt', 'yaşında', 'yetişkinle', 'yetişkine', 'yetişkinden',
];
/** İzin verilen sözcükler ekleriyle birlikte ("sınıflamada"). */
const ALLOWED = ['öğretmenlik', 'sınıflama'];

/** Metindeki okula ya da ergenliğe özgü sözcükler. */
export function schoolWords(text: string): string[] {
  const words = text.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? [];
  return words.filter((w) => !ALLOWED.some((a) => w.startsWith(a)) && SCHOOL.some((p) => w.startsWith(p)));
}
