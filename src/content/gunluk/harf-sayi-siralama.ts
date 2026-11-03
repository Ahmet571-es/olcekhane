import type { SkillsDaily } from './types';

/**
 * Harf-Sayı Sıralama: günlük hayatta nerede kullanılır (3. sınıftan yetişkine).
 * Kaynak: testin tanıtımı ("bilgiyi kısa bir süre akılda tutarken onu düzenleyebilmek"; "öğelerin akılda tutulurken bir de
 * sıraya konması") ve yol haritası (src/content/roadmaps/gorevler.ts, harfSayiSiralama: birkaç sayıyı küçükten büyüğe dizmek,
 * birkaç sözcüğü ya da tarihi sıraya dizmek). Örneklerin hepsinde kısa süre görülen birkaç bilgi akılda tutulur ve sıraya
 * konur. Testte öğeler "dinletilmez, ekranda gösterilir": yol haritasındaki duyulan bilgi örnekleri ("duyduğun bir numara",
 * "söylenen birkaç sözcük") burada kullanılmaz; bilgi hep görülerek alınır. Test "uzun süreli bellek ya da günlük
 * hayattaki unutkanlık hakkında bilgi vermez": örnekler önceden bilinen bilgiyi (ör. doğum günleri) ve unutkanlığı anmaz. Bir
 * sırayı tersine çevirmek Dikkat ve Bellek'teki tersten sayı dizisinin örneğidir; burada yoktur. Her seferinde aynı diziler
 * gelir: örnekler dizilerdeki harfleri ve sayıları kullanmaz. Örnekler tanımlayıcıdır; sonucun bu işlerde ne olacağını
 * söylemez.
 */
export const harfSayiDaily: SkillsDaily = {
  kind: 'skills',
  version: 'harf-sayi-siralama-gunluk-1',
  skills: [
    {
      key: 'harf-sayi-siralama',
      title: 'Akılda tutup sıraya koyma',
      short: 'Akılda sıralama',
      text: 'Bu beceri, kısa süre görülen birkaç bilgiyi akılda tutarken onları sıraya koymayı gerektiren işlerde kullanılır.',
      branches: {
        school: 'Sayıları akılda sıralamak',
        friends: 'Kartları akılda dizmek',
        home: 'Fiyatları akılda sıralamak',
        work: 'Tarihleri akılda sıralamak',
      },
      student: {
        school: 'Derste kısa süre gösterilen sayıları aklında küçükten büyüğe dizmek bu beceriyi kullanır.',
        friends: 'Açılıp kapanan kartlardaki harfleri ya da sayıları aklında sıraya dizme oyunları bu beceriyi kullanır.',
        home: 'Alışveriş fişine kısaca bakıp fiyatları aklında sıraya dizmek bu tür bir iştir.',
      },
      parent: {
        school: 'Çocuğunuzun derste kısa süre gösterilen sayıları aklında küçükten büyüğe dizmesi bu beceriyi kullanır.',
        friends: 'Açılıp kapanan kartlardaki harfleri ya da sayıları akılda sıraya dizme oyunları bu beceriyi kullanır.',
        home: 'Alışveriş fişine kısaca bakıp fiyatları akılda sıraya dizmek bu tür bir iştir.',
      },
      adult: {
        work: 'Bir belgede gördüğün birkaç tarihi aklında eskiden yeniye dizmek bu tür bir iştir.',
      },
    },
  ],
};
