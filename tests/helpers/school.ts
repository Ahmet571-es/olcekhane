/**
 * Yetişkine yazılan metinlerde yeri olmayan, okula ya da ergenliğe özgü sözcükler (sözcük başı). Meslek adı olarak
 * "öğretmenlik" (ilgi alanlarıyla ilişkili meslekler arasında) yetişkin için de doğrudur; spor ya da kitap kulübü de
 * yetişkinlere uygun olduğu için "kulüp" aranmaz. "Sınıflama" (sözel akıl yürütmede bir soru türü: kelimeleri gruplama)
 * okula özgü değildir.
 */
export const SCHOOL = [
  'okul', 'öğretmen', 'sınav', 'sınıf', 'ders', 'ödev', 'öğrenci', 'lise', 'ergen', 'veli', 'ailen', 'münazara', 'olimpiyat', 'tübitak',
  'izcilik', 'harçlık', 'yaşıt', 'yaşında', 'yetişkinle', 'yetişkine', 'yetişkinden', 'teneffüs', 'karne', 'kantin', 'dershane',
  'etüt',
];
/** İzin verilen sözcükler ekleriyle birlikte ("sınıflamada"). */
const ALLOWED = ['öğretmenlik', 'sınıflama'];

/**
 * Konusu sınavların kendisi olan testler: yetişkin metninde "sınav" sözcüğü bu testlerde okula özgü sayılmaz (üniversite,
 * ehliyet, sertifika ya da işe giriş sınavı). Öteki sözcükler ("ders", "okul", "öğretmen" …) bu testlerde de aranır.
 */
export const EXAM_TESTS = new Set(['sinav-kaygisi-ve-bas-etme']);

/**
 * Metindeki okula ya da ergenliğe özgü sözcükler. `slug` verilirse ve test `EXAM_TESTS`'teyse "sınav" sözcüğü sayılmaz;
 * birden çok test birlikte denetleniyorsa (ör. bir yuvanın adayları) hepsi sınav testi olmalıdır.
 */
export function schoolWords(text: string, slug?: string | string[]): string[] {
  const slugs = slug === undefined ? [] : [slug].flat();
  const exam = slugs.length > 0 && slugs.every((s) => EXAM_TESTS.has(s));
  const words = text.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? [];
  return words.filter(
    (w) => !ALLOWED.some((a) => w.startsWith(a)) && !(exam && w.startsWith('sınav')) && SCHOOL.some((p) => w.startsWith(p)),
  );
}
