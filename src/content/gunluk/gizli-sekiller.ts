import type { SkillsDaily } from './types';

/**
 * Gizli Şekiller: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (karmaşık bir çizimin içine saklanmış basit bir şekli bulmak, yani parçayı onu
 * saran bütünün içinden ayırmak; şeklin kenarları başka çizgilerle birleştikçe bulmak zorlaşır) ve yol haritası
 * (src/content/roadmaps/gorevler.ts, gizliSekiller: iç içe geçmiş geometrik şekilleri birbirinden ayırmak; kalabalık bir
 * resimde bir ayrıntıyı seçmek). Test "görsel algının ve uzamsal becerilerin yalnızca bir yönünü … ölçer. Sonuç bir kişilik
 * özelliği ya da genel bir düşünme tarzı olarak yorumlanmamalıdır": örnekler bir tarzı ya da kişiliği anlatmaz. Yol
 * haritasındaki "bir haritada ya da grafikte aradığın bilgiyi bulmak" ve "kalabalık bir tabloda bir sayıyı seçmek" bir
 * listede ya da tabloda arama işidir (Simge Bulma'nın örnekleri: listede ad, tabloda kayıt bulmak): kullanılmaz; burada
 * aranan şekil, başka çizgilerin arasına karışmıştır. Parçaları birleştirmek (Parçalardan Şekil) ve şekli döndürmek (Zihinde
 * Döndürme) burada yoktur; testte şekil aynı yönde saklıdır (gizli resim bulmacalarında nesne çoğu zaman döndürülür: tür adı
 * kullanılmaz). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const gizliSekillerDaily: SkillsDaily = {
  kind: 'skills',
  version: 'gizli-sekiller-gunluk-1',
  skills: [
    {
      key: 'gizli-sekiller',
      title: 'Gizli şekli bulma',
      short: 'Gizli şekil',
      text: 'Bu beceri, karmaşık bir çizimin içine karışmış basit bir şekli bulmayı, yani parçayı onu saran bütünden ayırmayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Şekildeki üçgenleri saymak',
        friends: 'Resimde saklı şekiller',
        home: 'Desende şekil seçmek',
        work: 'Şemada parça seçmek',
      },
      student: {
        school: 'Matematikte iç içe çizilmiş şekillerde kaç üçgen olduğunu bulmak bu tür bir iştir.',
        friends: 'Bir resmin çizgileri arasına saklanmış şekilleri aramak bu beceriyi kullanır.',
        home: 'Bir halı deseninin çizgileri arasında bir yıldız şekli seçmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte iç içe çizilmiş şekillerde kaç üçgen olduğunu bulması bu tür bir iştir.',
        friends: 'Bir resmin çizgileri arasına saklanmış şekilleri aramak bu beceriyi kullanır.',
        home: 'Bir halı deseninin çizgileri arasında bir yıldız şekli seçmek bu tür bir iştir.',
      },
      adult: {
        work: 'Karmaşık bir şemada aranan parçayı öteki çizgilerden ayırmak bu tür bir iştir.',
      },
    },
  ],
};
