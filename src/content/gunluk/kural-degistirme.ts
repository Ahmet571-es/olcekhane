import type { SkillsDaily } from './types';

/**
 * Kural Değiştirme: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("bir kuraldan ötekine geçebilmeyi"; "iki görevin kurallarını birlikte akılda tutabilmeyi") ve
 * görevin kendisi (şekle, üstündeki işarete göre bazen rengine, bazen biçimine bakarak cevap vermek). Örneklerin hepsinde
 * aynı şeye iki ayrı kuralla bakılır ve bir işaret ya da sıra kuralın değiştiğini söyler (işlem işareti, kartın rengi ya da
 * sayısı, eşyanın rengi ya da türü). Test "günlük hayatta plan değiştirebilmek ya da yeni durumlara uyum sağlamak hakkında"
 * bilgi vermez: plan değiştirme, uyum sağlama ve bir problemin çözüm yolunu değiştirme örneği yoktur (yol haritasındaki bu
 * örnekler kullanılmaz). "Simon der" oyunu bir hareketi yapmadan durmayı ister (Dur-Git Görevi); dağınık sayı ve harfleri
 * sırayla izlemek Sırayla Birleştirme'nin örneğidir: ikisi de burada yoktur. Örnekler tanımlayıcıdır; sonucun bu işlerde ne
 * olacağını söylemez.
 */
export const kuralDegistirmeDaily: SkillsDaily = {
  kind: 'skills',
  version: 'kural-degistirme-gunluk-1',
  skills: [
    {
      key: 'kural-degistirme',
      title: 'Kurallar arasında geçiş',
      short: 'Kural değiştirme',
      text: 'Bu beceri, bir işaret gelince bir kuraldan ötekine geçmeyi ve iki kuralı birlikte akılda tutmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Karışık işlemlerde geçiş',
        friends: 'Kart eşleştirme oyunları',
        home: 'Eşyaları yeniden ayırmak',
        work: 'Belgeleri iki türlü ayırmak',
      },
      student: {
        school: 'Karışık işlemlerde her sorunun işaretine bakıp toplamadan çıkarmaya geçmek bu beceriyi kullanır.',
        friends: 'Kartları bazen rengine, bazen sayısına göre eşleştirdiğin oyunlar bu beceriyi kullanır.',
        home: 'Eşyaları önce rengine, sonra türüne göre yeniden ayırmak bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun karışık işlemlerde işarete bakıp toplamadan çıkarmaya geçmesi bu beceriyi kullanır.',
        friends: 'Kartların bazen rengine, bazen sayısına göre eşleştirildiği oyunlar bu beceriyi kullanır.',
        home: 'Eşyaları önce rengine, sonra türüne göre yeniden ayırmak bu tür bir iştir.',
      },
      adult: {
        work: 'Gelen belgeleri bazen tarihine, bazen konusuna göre ayırmak bu tür bir iştir.',
      },
    },
  ],
};
