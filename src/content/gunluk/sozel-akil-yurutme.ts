import type { SkillsDaily } from './types';

/**
 * Sözel Akıl Yürütme: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (dört soru türü: kelime ilişkileri, sınıflama, sıralama ve mantıksal çıkarım;
 * "iki ya da üç kelimenin ortak yönünü bulup başka bir kelimeye uygulamak", "birkaç bilgiyi birleştirmek") ve yol haritası
 * (src/content/roadmaps/gorevler.ts, sozelAkilYurutme: kelime çiftlerinin ilişkisini cümleyle söyleyip aynı ilişkiye uyan
 * yeni bir çift kurmak; "Hangisi gruba uymuyor?"; sıralama bulmacaları). Test "akıl yürütmenin yalnızca sözcüklerle yapılan
 * yönünü ölçer … Şekillerle ve sayılarla akıl yürütme, bellek ve hız … hakkında bilgi vermez": şekil ve sayı örneği yoktur.
 * Kardeş testlerle karışmasın diye: kelimelerin anlamını bilmek (eş ve zıt anlam, deyim) Kelime Bilgisi'nin, "eğer … ise"
 * kurallarından kesin sonuç çıkarmak Mantıksal Akıl Yürütme'nin örneğidir; burada örnekler kelime ilişkisi (okul), söylenen
 * karşılaştırmalardan sıra kurmak (oyun) ve kelimeleri gruplamaktır (ev). Örnekler testteki soruların konularını
 * (makas–kesmek, meyveler, uyanma ya da koşu sırası…) kullanmaz. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const sozelAkilYurutmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sozel-akil-yurutme-gunluk-1',
  skills: [
    {
      key: 'sozel-akil-yurutme',
      title: 'Sözcüklerle akıl yürütme',
      short: 'Sözel akıl yürütme',
      text: 'Bu beceri, sözcüklerle akıl yürütmeyi gerektiren işlerde kullanılır. Kelimeler arasındaki ilişkiyi bulmak, kelimeleri gruplamak ve söylenenlerden bir sıra ya da sonuç çıkarmak buna girer.',
      branches: {
        school: 'Kelime ilişkileri',
        friends: 'Oyunda sırayı çıkarmak',
        home: 'Listeyi gruplamak',
        work: 'Kavramları gruplamak',
      },
      student: {
        school: 'Türkçe dersinde iki kelimenin ilişkisini bulup başka bir çifte uygulamak bu beceriyi ister.',
        friends: 'Bir oyunda kimin kimden önce oynayacağını söylenenlerden çıkarmak bu beceriyi ister.',
        home: 'Alışveriş listesindeki şeyleri ortak yönlerine göre gruplamak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun Türkçe dersinde iki kelimenin ilişkisini bulup başka bir çifte uygulaması bu beceriyi ister.',
        friends: 'Bir oyunda kimin kimden önce oynayacağını söylenenlerden çıkarmak bu beceriyi ister.',
        home: 'Alışveriş listesindeki şeyleri ortak yönlerine göre gruplamak bu tür bir iştir.',
      },
      adult: {
        work: 'Bir yazıdaki kavramları ortak yönlerine göre gruplamak bu tür bir iştir.',
      },
    },
  ],
};
