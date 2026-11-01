import type { SkillsDaily } from './types';

/**
 * Kâğıt Katlama: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ve `whatItMeasures` (uzamsal görselleştirme: katlanmış kâğıdı adım adım izlemek, deliğin kaç kattan
 * geçtiğini bulmak, kâğıt açılınca deliklerin katlama çizgilerine göre aynalandığı yerleri zihinde canlandırmak) ve yol
 * haritasının etkinlikleri (src/content/roadmaps/gorevler.ts, kagitKatlama: kâğıdı katlayıp delmeden önce tahmin etmek,
 * origami). Test "uzamsal becerilerin yalnızca bir yönünü (görselleştirme) ölçer; şekilleri zihinde döndürme, yön bulma …
 * hakkında bilgi vermez": döndürme ve harita ya da kroki örneği yoktur. Yol haritasındaki "bir kutunun açınımını düşünmek"
 * Küp Açınımı'nın, "bir eşyayı kurmak" Parçalardan Şekil'in ve Üç Boyutlu Zihinde Döndürme'nin örneğidir: kullanılmaz.
 * Örnekler katlamayı, katlanmış kâğıdı kesmeyi ya da delmeyi ve açılınca nasıl görüneceğini canlandırmayı ister (okulda
 * katlayarak simetri, kâğıttan süs, origami, broşür katlamak). Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağı
 * söylenmez.
 */
export const kagitKatlamaDaily: SkillsDaily = {
  kind: 'skills',
  version: 'kagit-katlama-gunluk-1',
  skills: [
    {
      key: 'kagit-katlama',
      title: 'Katlanan kâğıdı canlandırma',
      short: 'Katlanan kâğıt',
      text: 'Bu beceri, katlanan bir kâğıdı adım adım izleyip açılınca nasıl görüneceğini zihinde canlandırmayı gerektiren işlerde kullanılır. Deliğin kaç kattan geçtiğini ve kâğıt açılınca nerelerde görüneceğini bulmak da buna girer.',
      branches: {
        school: 'Katlayarak simetri',
        friends: 'Origami yapmak',
        home: 'Kâğıttan süs kesmek',
        work: 'Broşür katlamak',
      },
      student: {
        school: 'Matematikte bir şekli katlayınca iki yarısının üst üste gelip gelmeyeceğini düşünmek bu beceriyi ister.',
        friends: 'Origami yaparken bir katlamanın kâğıdı nasıl değiştireceğini önceden görmek bu beceriyi kullanır.',
        home: 'Katlanmış kâğıttan süs keserken açılınca nasıl görüneceğini düşünmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun matematikte bir şekli katlayınca iki yarısının üst üste gelip gelmeyeceğini düşünmesi bu beceriyi ister.',
        friends: 'Origami yaparken bir katlamanın kâğıdı nasıl değiştireceğini önceden görmek bu beceriyi kullanır.',
        home: 'Katlanmış kâğıttan süs keserken açılınca nasıl görüneceğini düşünmek bu tür bir iştir.',
      },
      adult: {
        work: 'Bir broşürü katlarken yazıların nereye geleceğini önceden görmek bu tür bir iştir.',
      },
    },
  ],
};
