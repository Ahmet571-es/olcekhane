import type { SkillsDaily } from './types';

/**
 * Sayı Dizileri: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` ("sayılar arasındaki ilişkiyi bulup kuralı sürdürebilmek"; "her adımda 3
 * fazla", "bir öncekinin iki katı"; bulunan kuralı dizinin bütün sayılarında denemek) ve yol haritası
 * (src/content/roadmaps/gorevler.ts, sayiDizileri: bir sayı örüntüsünü fark etmek; velinin "2, 5, 8… Sıradaki sayı ne?" oyunu).
 * Test "akıl yürütmenin yalnızca sayılarla yapılan yönünü ölçer … Şekillerle ve sözcüklerle akıl yürütme, bilgi, bellek ve
 * hız … hakkında bilgi vermez": şekil, harf ve kelime örneği yoktur (harf dizilerini Harf Dizileri ölçer). Yol haritasındaki
 * "bir problemi adımlara ayırmak" planlamadır (Kule Görevi), "bir tablodaki ya da grafikteki değişimi yorumlamak" Matematik
 * Konu Tarama Testi'nin veri alanıdır: kullanılmaz. Sonuç hesap rahatlığıyla da ilişkili olsa da zihinden hızlı hesap
 * Zihinden Hesaplama Hızı'nın örneğidir. Sayılar elle denetlendi: 2, 5, 8 dizisinde kural "3 fazla"dır; bir ayın takviminde
 * salı günlerinin tarihleri yedişer artar (ay içinde). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const sayiDizileriDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sayi-dizileri-gunluk-1',
  skills: [
    {
      key: 'sayi-dizileri',
      title: 'Sayılarla kural bulma',
      short: 'Sayılarla kural',
      text: 'Bu beceri, sayılar arasındaki ilişkiyi bulup kuralı sürdürmeyi gerektiren işlerde kullanılır: “her adımda 3 fazla” ya da “bir öncekinin iki katı” gibi. Bulunan kuralı bütün sayılarda denemek de buna girer.',
      branches: {
        school: 'Sayı örüntüleri',
        friends: 'Sayı bulmacaları',
        home: 'Takvimdeki tarihler',
        work: 'Düzenli artışı kestirmek',
      },
      student: {
        school: 'Matematikte bir sayı örüntüsünün kuralını bulup eksik sayıyı yazmak bu tür bir iştir.',
        friends: 'Arkadaşlarınla sırayla “2, 5, 8… Sıradaki ne?” gibi sayı bulmacaları sormak bu beceriyi kullanır.',
        home: 'Bir ayın takviminde salı günlerinin tarihlerinin yedişer arttığını fark etmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte bir sayı örüntüsünün kuralını bulup eksik sayıyı yazması bu tür bir iştir.',
        friends: 'Arkadaşlarıyla sırayla “2, 5, 8… Sıradaki ne?” gibi sayı bulmacaları sormak bu beceriyi kullanır.',
        home: 'Bir ayın takviminde salı günlerinin tarihlerinin yedişer arttığını fark etmek bu tür bir iştir.',
      },
      adult: {
        work: 'Bir ödemenin aydan aya nasıl arttığını bulup gelecek ayki tutarı kestirmek bu tür bir iştir.',
      },
    },
  ],
};
