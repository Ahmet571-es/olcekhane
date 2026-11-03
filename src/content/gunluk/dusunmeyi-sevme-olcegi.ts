import type { ScaleDaily, SurveyDaily } from './types';

/**
 * Düşünmeyi Sevme Ölçeği: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: özellik (iki uç da eşit;
 * lib/reports/daily-parts.ts, `scaleTone`). Aynı on madde Öğrenme ve Başarı Özellikleri'nde "Düşünmekten hoşlanma"
 * ölçeğidir (orada ncog01–ncog10); o test bu ölçeğin örneklerini aynen kullanır (ogrenme-ve-basari-ozellikleri.ts), iki
 * testi çözen kişi aynı örnekleri görür.
 *
 * Şablondaki ilke burada da geçerlidir (src/content/reports/dusunmeyi-sevme.ts): ölçek zekâyı ölçmez. Kişinin bir şeyleri
 * ne kadar kolay kavradığını düşündüğünü soran dört madde (n02, n03, n05, n07) hiçbir örneğe kaynak olmaz: düşük düzeyde
 * gerçek beceri hakkında bir hüküm gibi, yüksek düzeyde bir yetenek iddiası gibi okunurdu. "Karmaşık insanlar" maddesi (n08)
 * de kullanılmadı (günlük hayatta insanları yargılayan bir örneğe dönüşebilirdi). İşleri yapmanın yeni yolları (n04)
 * Öğrenme ve Başarı'daki "Öğrenmeye açıklık" kartıyla yan yana çelişmesin diye örneklere taşınmadı. Örnekler yalnızca
 * hoşlanmayı ve isteği anlatır: karmaşık problemler (n01), kafa yoran metinler (n06, n09), felsefi tartışmalar (n10).
 *
 * Maddeye doğrudan dayanmayan, ucun doğal karşılığı olan uzantılar: düşük düzeyde boş zamanda "kafanı dinlendiren
 * uğraşlar" (n01'in düşük cevabının kolay yanı), yüksek düzeyde "zamanın nasıl geçtiğini fark etmeyebilirsin" (n06'nın
 * bedeli; merak.ts'teki gibi).
 */

/*
 * Maddeler: n01 "Karmaşık problemleri çözmeyi severim", n02 "Bir şeyin bana bir kez anlatılması yeter", n03 "Çok miktarda
 * bilgiyle başa çıkabilirim", n04 "İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim", n05 "Bir şeyleri çabuk
 * kavrarım", n06 "Anlamak için kafa yormam gereken metinler okumayı severim"; ters: n07 "Soyut fikirleri anlamakta
 * zorlanırım", n08 "Karmaşık insanlardan uzak durmaya çalışırım", n09 "Okuması zor metinlerden kaçınırım", n10 "Felsefi
 * tartışmalardan kaçınırım". Uçlar bütün ölçeği anlatır ("Kafa yoran işlere daha az istekli" ↔ "Kafa yoran işlerden hoşlanan").
 */
export const kafaYoranIsler: ScaleDaily = {
  poles: { low: 'Kafa yormayı pek aramaz', high: 'Kafa yormaktan hoşlanır' },
  bands: {
    low: {
      from: { school: ['n09'], friends: ['n10'], home: ['n01'], work: ['n09'] },
      student: {
        school: 'Ders kitabında okuması zor bir bölüm gelince onu okumaya pek istekli olmayabilirsin.',
        friends: 'Arkadaşların felsefi bir tartışmaya girince sohbetin başka bir konuya geçmesini isteyebilirsin.',
        home: 'Boş zamanında karmaşık bulmacalar yerine kafanı dinlendiren uğraşları seçebilirsin.',
      },
      parent: {
        school: 'Ders kitabında okuması zor bir bölüm gelince çocuğunuz onu okumaya pek istekli olmayabilir.',
        friends: 'Arkadaşları felsefi bir tartışmaya girince sohbetin başka bir konuya geçmesini isteyebilir.',
        home: 'Boş zamanında karmaşık bulmacalar yerine kafasını dinlendiren uğraşları seçebilir.',
      },
      adult: {
        work: 'Okuması zor, uzun bir metni okuman gerektiğinde buna pek istekli olmayabilirsin.',
      },
    },
    average: {
      from: { school: ['n01'], friends: ['n10'], home: ['n06', 'n09'], work: ['n01'] },
      student: {
        school: 'Bazı derslerde karmaşık bir problemle uğraşmak hoşuna gidebilir, bazılarında pek istekli olmayabilirsin.',
        friends: 'Arkadaşlarınla “Doğru olan ne?” gibi bir sohbete bazen katılabilir, bazen konuyu değiştirebilirsin.',
        home: 'Konusu ilgini çeken zor bir yazıyı okuyabilir, ötekileri okumak istemeyebilirsin.',
      },
      parent: {
        school: 'Bazı derslerde karmaşık bir problemle uğraşmak çocuğunuzun hoşuna gidebilir, bazılarında pek istekli olmayabilir.',
        friends: 'Arkadaşlarıyla “Doğru olan ne?” gibi bir sohbete bazen katılabilir, bazen konuyu değiştirebilir.',
        home: 'Konusu ilgisini çeken zor bir yazıyı okuyabilir, ötekileri okumak istemeyebilir.',
      },
      adult: {
        work: 'Bazı işlerde karmaşık bir sorunla uğraşmak hoşuna gidebilir, bazılarında hazır bir çözümü seçebilirsin.',
      },
    },
    high: {
      from: { school: ['n01'], friends: ['n10'], home: ['n06'], work: ['n01'] },
      student: {
        school: 'Derste karmaşık bir problemle uğraşmak sana keyifli gelebilir.',
        friends: 'Arkadaşlarınla “Özgürlük nedir?” gibi sorular üzerine uzun uzun konuşmak hoşuna gidebilir.',
        home: 'Kafa yoran bir kitaba ya da yazıya dalınca zamanın nasıl geçtiğini fark etmeyebilirsin.',
      },
      parent: {
        school: 'Derste karmaşık bir problemle uğraşmak çocuğunuza keyifli gelebilir.',
        friends: 'Arkadaşlarıyla “Özgürlük nedir?” gibi sorular üzerine uzun uzun konuşmak hoşuna gidebilir.',
        home: 'Kafa yoran bir kitaba ya da yazıya dalınca zamanın nasıl geçtiğini fark etmeyebilir.',
      },
      adult: {
        work: 'İşinde karmaşık bir sorunla uğraşmak sana keyifli gelebilir.',
      },
    },
  },
};

export const dusunmeyiSevmeDaily: SurveyDaily = {
  kind: 'survey',
  version: 'dusunmeyi-sevme-gunluk-1',
  scales: { need_for_cognition: kafaYoranIsler },
};
