import type { SkillsDaily } from './types';

/**
 * Mantıksal Akıl Yürütme: günlük hayatta nerede kullanılır (5. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt
 * etmek; "eğer … ise …" kuralları; sonuç gerçek hayatta doğru ya da yanlış görünse de yalnızca verilen bilgilere göre karar
 * vermek) ve yol haritası (src/content/roadmaps/gorevler.ts, mantiksalAkilYurutme: bir kuralı ya da yönergeyi doğru
 * uygulamak, bir haberi ya da iddiayı değerlendirmek). Test "akıl yürütmenin yalnızca bir yönünü (sözel bilgilerden kesin
 * sonuç çıkarmayı) ölçer; şekillerle ya da sayılarla akıl yürütme hakkında bilgi vermez": şekil ve sayı örneği yoktur; yol
 * haritasındaki "matematikte bir sonucun kanıtlanıp kanıtlanmadığına bakmak" bu yüzden kullanılmaz. Kardeş testlerle
 * karışmasın diye: kelimeleri gruplamak ve karşılaştırmalardan sıra kurmak Sözel Akıl Yürütme'nin, ilk akla gelen cevapta
 * durup denetlemek Düşünerek Karar Verme'nin örneğidir. Örnekler testteki ve Sözel Akıl Yürütme'deki soruların konularını
 * (kartlar, kırmızı kart, kutulardaki toplar…) kullanmaz. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı söylenmez.
 */
export const mantiksalAkilYurutmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'mantiksal-akil-yurutme-gunluk-1',
  skills: [
    {
      key: 'mantiksal-akil-yurutme',
      title: 'Kesin sonucu ayırt etme',
      short: 'Kesin sonuç',
      text: 'Bu beceri, verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt etmeyi gerektiren işlerde kullanılır. Bir sonuç doğru görünse de yalnızca söylenenlere bakmak buna girer.',
      branches: {
        school: 'Yönergedeki koşullar',
        friends: 'Oyun kuralları',
        home: 'Reklamdaki iddialar',
        work: 'Sözleşmedeki koşullar',
      },
      student: {
        school: 'Bir sınav yönergesindeki “Eğer … ise …” cümlelerinden kesin olarak neyin çıktığını ayırt etmek bu beceriyi ister.',
        friends: '“O zaman sıra bende!” diyen birinin haklı olup olmadığını oyunun kurallarından çıkarmak bu beceriyi kullanır.',
        home: 'Bir reklamda doğru görünen bir iddianın söylenenlerden çıkıp çıkmadığına bakmak bu beceriyi ister.',
      },
      parent: {
        school: 'Çocuğunuzun bir sınav yönergesindeki “Eğer … ise …” cümlelerinden kesin olarak neyin çıktığını ayırt etmesi bu beceriyi ister.',
        friends: '“O zaman sıra bende!” diyen birinin haklı olup olmadığını oyunun kurallarından çıkarmak bu beceriyi kullanır.',
        home: 'Bir reklamda doğru görünen bir iddianın söylenenlerden çıkıp çıkmadığına bakmak bu beceriyi ister.',
      },
      adult: {
        work: 'Bir sözleşmedeki koşullardan kesin olarak neyin çıktığını ayırt etmek bu beceriyi ister.',
      },
    },
  ],
};
