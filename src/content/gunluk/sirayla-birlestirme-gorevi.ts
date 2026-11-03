import type { SkillsDaily } from './types';

/**
 * Sırayla Birleştirme Görevi: günlük hayatta nerede kullanılır (3. sınıftan mezuna; yetişkinlere açık değil).
 * Kaynak: testin tanıtımı (birinci bölüm "görsel taramayı ve işlem hızını", ikinci bölüm bunlara ek olarak "iki sırayı
 * (sayılar ve harfler) aynı anda akılda tutmayı ve aralarında geçiş yapabilmeyi" gerektirir) ve yol haritası
 * (src/content/roadmaps/gorevler.ts, siraylaBirlestirme: bir sayfayı gözle tarayıp sırayı takip etmek). Örnekler dağınık
 * duran şeyler arasında sıradakini gözle bulmayı (noktaları birleştirme bulmacası) ve iki sırayı birlikte izleyip aralarında
 * gidip gelmeyi (soru kitapçığı ile cevap kâğıdı; takvimde gün adları ile tarihler) anlatır. Bir işaretle bir kuraldan
 * ötekine geçmeyi Kural Değiştirme ölçer: bu dosyada "kural" örneği yoktur. Örnekler tanımlayıcıdır; sonucun bu işlerde ne
 * olacağını söylemez.
 */
export const siraylaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'sirayla-birlestirme-gorevi-gunluk-1',
  skills: [
    {
      key: 'sirayla',
      title: 'Görsel tarama ve geçiş',
      short: 'Tarama ve geçiş',
      text: 'Bu beceri, dağınık duran şeyler arasında sıradakini gözle bulmayı gerektiren işlerde kullanılır. İki sırayı birlikte izleyip aralarında gidip gelmek de bunun bir parçasıdır.',
      branches: {
        school: 'Kitapçık ile cevap kâğıdı',
        friends: 'Noktaları birleştirmek',
        home: 'Takvimde gün bulmak',
      },
      student: {
        school: 'Soru kitapçığı ile cevap kâğıdı arasında gidip gelirken sırayı kaybetmemek bu beceriyi kullanır.',
        friends: 'Noktaları sırayla birleştirip gizli resmi ortaya çıkaran bulmacalar da bu beceriyi kullanır.',
        home: 'Takvimde gün adlarını ve tarihleri birlikte izlemek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun soru kitapçığı ile cevap kâğıdı arasında gidip gelirken sırayı kaybetmemesi bu beceriyi kullanır.',
        friends: 'Noktaları sırayla birleştirip gizli resmi ortaya çıkaran bulmacalar da bu beceriyi kullanır.',
        home: 'Takvimde gün adlarını ve tarihleri birlikte izlemek bu tür bir iştir.',
      },
    },
  ],
};
