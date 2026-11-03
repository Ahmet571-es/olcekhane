import type { SkillsDaily } from './types';

/**
 * Kelime Bilgisi: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (kelimelerin eş ve zıt anlamlılarını bilmek, birden çok anlamı olan bir kelimenin
 * cümlede hangi anlamda kullanıldığını ayırt etmek, deyimlerin anlamını bilmek) ve yol haritası (src/content/roadmaps/
 * gorevler.ts, kelimeBilgisi: kelime bilgisi okuduğunu anlamakla yakından ilişkilidir; okurken bilmediği kelimenin anlamını
 * cümleden tahmin etmek). Test "kelimeleri konuşurken ve yazarken kullanabilmeyi, yazım ya da dil bilgisi bilgisini ölçmez":
 * örnekler bir kelimeyi kullanmayı ya da doğru yazmayı değil, okunan ya da duyulan bir kelimenin anlamını bilmeyi anlatır
 * (bulmacada kelimeyi bulup yazmak değil, ipucundaki kelimenin anlamını bilmek).
 * Kelimeler arasındaki ilişkiyi bulup başka bir çifte uygulamak ve kelimeleri gruplamak Sözel Akıl Yürütme'nin örneğidir.
 * Testte her seferinde aynı sorular geldiği için örnekler testteki kelime ve deyimleri kullanmaz; "dört gözle beklemek"
 * ("çok istekle beklemek", Güncel Türkçe Sözlük) testte yoktur. Kelime bilgisi bir yetenek değil, okudukça ve duydukça
 * edinilen bir bilgidir; kartın tanımı bu yüzden "Bu bilgi" der. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const kelimeBilgisiDaily: SkillsDaily = {
  kind: 'skills',
  version: 'kelime-bilgisi-gunluk-1',
  skills: [
    {
      key: 'kelime-bilgisi',
      title: 'Kelime bilgisi',
      short: 'Kelime bilgisi',
      text: 'Bu bilgi, okunan ya da duyulan kelimelerin ve deyimlerin anlamını bilmeyi gerektiren işlerde kullanılır. Bir kelimenin cümlede hangi anlamda kullanıldığını ayırt etmek de buna girer.',
      branches: {
        school: 'Kitaptaki kelimenin anlamı',
        friends: 'Deyimleri anlamak',
        home: 'Bulmaca ipuçlarını anlamak',
        work: 'Resmî yazıları anlamak',
      },
      student: {
        school: 'Ders kitabındaki bir kelimenin o cümlede hangi anlamda kullanıldığını anlamak bu bilgiyi ister.',
        friends: 'Sohbette geçen “dört gözle beklemek” gibi bir deyimi anlamak bu bilgiyi kullanır.',
        home: 'Bir bulmacanın ipucunda geçen bir kelimenin anlamını bilmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun ders kitabındaki bir kelimenin o cümlede hangi anlamda kullanıldığını anlaması bu bilgiyi ister.',
        friends: 'Sohbette geçen “dört gözle beklemek” gibi bir deyimi anlamak bu bilgiyi kullanır.',
        home: 'Bir bulmacanın ipucunda geçen bir kelimenin anlamını bilmek bu tür bir iştir.',
      },
      adult: {
        work: 'Resmî bir yazıda geçen az kullanılan kelimelerin anlamını bilmek bu tür bir iştir.',
      },
    },
  ],
};
