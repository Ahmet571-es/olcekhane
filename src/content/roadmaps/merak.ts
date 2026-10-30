import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Merak: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak;
 *    Dunlosky ve ark., 2013; Roediger ve Karpicke, 2006). Merakın iki yönü yalnızca bu yöntemleri hangi düzende kullanmanın
 *    kolay geleceğine ipucu verir; kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez. Bilgi merakının önerileri
 *    çalışmayı bir soruyla başlatır (konuyu soruya çevirmek, merak edilen soruları önceden yazmak); bu, merakın bilgideki bir
 *    boşlukla başladığı açıklamasına dayanır (Loewenstein, 1994; bilim kartında).
 *  - 2. hafta "Önce tahmin et"tir (Bilgi merakı): cevabı görmeden önce tahmin etmek o soruya duyulan merakı artırmış, ama
 *    hatırlanan bilgi miktarını değiştirmemiştir (29 üniversite öğrencisi; Brod ve Breitwieser, 2019). Bu yüzden haftada "daha iyi hatırlarsın" denmez;
 *    yalnızca merakı artırabileceği söylenir.
 *  - Merakı artırmaya ya da notları yükseltmeye dair bir sonuç vaat edilmez; ilişkiler küçüktür.
 *  - Ortamlar bugünkü duruma göre bir ipucudur, sınır değildir (`settingsNote`); bir meslek önerisi değildir.
 *  - Düşük düzeyde kişi suçlanmaz; veliye ilgisini başka konulara çekmeye ya da onu zorlamaya değil, onun ilgi duyduğu
 *    konulara merak göstermeye ve alışkanlıklarına saygı göstermeye yönelik öneriler verilir.
 *  - Aynı yön ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar
 *    etmez; veliye yaklaşım önerileri de birbirini tekrar etmez (tests/merak.test.ts ortak söz öbeklerini arar).
 *  - Test yetişkinlere de açıktır: öğrenci metni okula özgü olduğunda ya da kitaptan söz ettiğinde yetişkin metni yazılır.
 */
export const merakRoadmap: RoadmapTemplate = {
  version: 'merak-yol-haritasi-1',
  planningScale: 'knowledge',
  planningTitle: 'Önce tahmin et',
  unit: { one: 'yön', toPlural: 'yönlere' },
  balancedNote: {
    student: 'İki yönde de merakın orta düzeyde; hiçbir yön belirgin biçimde öne çıkmıyor.',
    parent: 'Çocuğunuzun merakı iki yönde de orta düzeyde; hiçbir yön belirgin biçimde öne çıkmıyor.',
  },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Merakının iki yönü, bu yöntemleri hangi düzende kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun merakının iki yönü, bu yöntemleri hangi düzende kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
  },
  settingsNote: {
    student:
      'Bu ortamlar yalnızca bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'Bu ortamlar yalnızca çocuğunuzun bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Bu hafta bir “merak listesi” tut. Her gün merak ettiğin bir şeyi (bir soru, bir yer ya da bir etkinlik) bir cümleyle yaz. Henüz cevabını araman gerekmiyor; yalnızca neleri merak ettiğini fark et.',
    parent:
      'Bu hafta raporu çocuğunuzla birlikte okuyun ve ona bir “merak listesi” tutmayı önerin: her gün merak ettiği bir şeyi bir cümleyle yazsın. Listeyi görmek isterseniz izin isteyin; hemen bir şeyi değiştirmeye çalışmayın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['dusunmeyi-sevme-olcegi', 'heyecan-arayisi'],
  nextPurpose: {
    you: 'düşünmeyi gerektiren işlerden ne kadar hoşlandığını ve heyecan arayışını da görmek',
    parent: 'çocuğunuzun düşünmeyi gerektiren işlerden ne kadar hoşlandığını ve heyecan arayışını da görmek',
  },
  approach: {
    knowledge: {
      low: 'Onun ilgi duyduğu konular hakkında (müzik, dizi, bir hobi gibi) gerçek bir ilgiyle sorular sorun ve anlatırken sözünü kesmeden dinleyin; ilgisini hemen başka konulara çekmeye çalışmayın.',
      average: 'Kendi merak ettiğiniz şeyleri onunla paylaşın (okuduğunuz bir haber ya da izlediğiniz bir belgesel gibi); merakın evde olağan bir konu olduğunu görsün.',
      high: 'Sorularına değer verdiğinizi gösterin; bilmediğiniz bir şeyi sorduğunda “Bilmiyorum, birlikte bakalım.” demekten çekinmeyin.',
    },
    novelty: {
      low: 'Okul değişikliği, taşınma ya da evdeki düzenin değişmesi gibi bir durumdan önce neyle karşılaşacağını onunla birlikte konuşun. Mümkünse yeni yeri önceden birlikte görün. Alışkanlıklarına saygı gösterin.',
      average: 'Hangi konularda yeniliği, hangilerinde alıştığı düzeni sevdiğini merakla sorun; iki tercihini de olağan karşılayın.',
      high: 'Farklı şeyleri keşfetme isteğini destekleyin; denediklerinden birini sürdürmek istediğinde bir süre devam etmesine yardım edin.',
    },
  },
  scales: {
    knowledge: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Merakını çalışmanın başına koy: bir konuya başlamadan önce o konuda merak ettiğin iki üç soruyu yaz. Çalıştıktan sonra kitaba bakmadan bu soruları cevaplamaya çalış ve bir hafta sonra aynı soruları yeniden cevapla.',
          parent:
            'Çocuğunuz merakını çalışmanın başına koyabilir: bir konuya başlamadan önce o konuda merak ettiği iki üç soruyu yazabilir. Çalıştıktan sonra kitaba bakmadan bu soruları cevaplamaya çalışması ve bir hafta sonra aynı soruları yeniden cevaplaması ona uyabilir.',
          adult:
            'Merakını öğrenmenin başına koy: bir konuya başlamadan önce o konuda merak ettiğin iki üç soruyu yaz. Okuduktan sonra kaynağa bakmadan bu soruları cevaplamaya çalış ve bir hafta sonra aynı soruları yeniden cevapla.',
        },
        average: {
          student:
            'Çalışacağın konuyu bir soruya çevir (“Depremler neden olur?” gibi) ve çalışırken bu sorunun cevabını ara. Sonunda kitabı kapatıp cevabı kendi cümlelerinle yaz; ertesi gün aynı soruyu bir kez daha cevapla.',
          parent:
            'Çocuğunuz çalışacağı konuyu bir soruya çevirip (“Depremler neden olur?” gibi) çalışırken bu sorunun cevabını arayabilir. Sonunda kitabı kapatıp cevabı kendi cümleleriyle yazması ve ertesi gün aynı soruyu bir kez daha cevaplaması ona uyabilir.',
          adult:
            'Öğrenmek istediğin konuyu bir soruya çevir (“Depremler neden olur?” gibi) ve okurken bu sorunun cevabını ara. Sonunda kaynağı kapatıp cevabı kendi cümlelerinle yaz; ertesi gün aynı soruyu bir kez daha cevapla.',
        },
        low: {
          student:
            'İlgini pek çekmeyen bir konuyu sevdiğin bir şeye bağlayan tek bir soru bul. Örneğin: “Bu konu en sevdiğim oyunda ya da sporda nerede karşıma çıkar?” Kısa oturumlar planla; her oturumun sonunda kitaba bakmadan hatırladığın üç şeyi yaz.',
          parent:
            'Çocuğunuz ilgisini pek çekmeyen bir konuyu sevdiği bir şeye bağlayan tek bir soru bulabilir. Örneğin: “Bu konu en sevdiğim oyunda ya da sporda nerede karşıma çıkar?” Kısa oturumlar planlayıp her oturumun sonunda kitaba bakmadan hatırladığı üç şeyi yazması ona uyabilir.',
          adult:
            'İlgini pek çekmeyen ama öğrenmen gereken bir konuyu sevdiğin bir şeye bağlayan tek bir soru bul. Örneğin: “Bu konu işimde ya da hobimde nerede karşıma çıkar?” Kısa oturumlar planla; her oturumun sonunda kaynağa bakmadan hatırladığın üç şeyi yaz.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta ilk haftaki merak listenden üç soru seç. Her birinin cevabına bakmadan önce tahminini bir kâğıda yaz; sonra cevabı araştır ve tahmininle karşılaştır. Tahmin etmek, cevabı daha çok merak etmeni sağlayabilir.',
          parent:
            'Bu hafta çocuğunuza ilk haftaki merak listesinden üç soru seçmesini önerin. Her birinin cevabına bakmadan önce tahminini yazsın, sonra cevabı araştırıp tahminiyle karşılaştırsın. Tahmin etmek, cevabı daha çok merak etmesini sağlayabilir.',
        },
        average: {
          student:
            'Bu hafta günde bir kez, cevabını bilmediğin bir soru seç (bir haberden, bir videodan ya da bir sohbetten). Önce kendi tahminini söyle ya da yaz. Sonra cevaba bak ve ne kadar yaklaştığını gör.',
          parent:
            'Bu hafta çocuğunuza günde bir kez, cevabını bilmediği bir soru seçmesini önerin (bir haberden, bir videodan ya da bir sohbetten). Önce kendi tahminini söylesin, sonra cevaba baksın.',
        },
        low: {
          student:
            'Bu hafta seni ilgilendiren bir konuda (bir uygulama, bir hayvan ya da bir şarkı gibi) tek bir soru seç. Cevabına bakmadan önce bir tahmin yaz, sonra cevabı bul; tahminin tutmasa da olur.',
          parent:
            'Bu hafta çocuğunuzla, onu ilgilendiren bir konuda (bir uygulama, bir hayvan ya da bir şarkı gibi) tek bir soru seçin. Cevabına bakmadan önce ikiniz de bir tahmin yazın, sonra cevabı birlikte bulun.',
        },
      },
      settings: {
        high: 'Soru sormanın, araştırmanın ve öğrenmeyi sürdürmenin değerli olduğu ortamlar',
        low: 'Öğrenilen bilginin hemen kullanıldığı, uygulamaya dönük ortamlar',
      },
    },
    novelty: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Yeniliği sevmen tekrarlarını canlı tutabilir: tekrar yöntemini değiştir; bir gün kendine soru sor, bir gün konuyu birine anlat, bir gün bir şema çiz. Hepsinde kitaba bakmadan hatırlamaya çalış ve tekrarları günlere yay.',
          parent:
            'Yeniliği sevmesi tekrarlarını canlı tutabilir: çocuğunuz tekrar yöntemini değiştirebilir; bir gün kendine soru sorabilir, bir gün konuyu birine anlatabilir, bir gün bir şema çizebilir. Hepsinde kitaba bakmadan hatırlamaya çalışması ve tekrarları günlere yayması ona uyabilir.',
          adult:
            'Yeniliği sevmen tekrarlarını canlı tutabilir: tekrar yöntemini değiştir; bir gün kendine soru sor, bir gün konuyu birine anlat, bir gün bir şema çiz. Hepsinde kaynağa bakmadan hatırlamaya çalış ve tekrarları günlere yay.',
        },
        average: {
          student:
            'Çalışma düzenini çoğunlukla aynı tut, ama haftada bir kez yerini ya da yöntemini değiştir (soruları bir arkadaşınla birlikte cevaplamak gibi). Her oturumu kitaba bakmadan hatırladıklarını yazarak bitir.',
          parent:
            'Çocuğunuz çalışma düzenini çoğunlukla aynı tutup haftada bir kez yerini ya da yöntemini değiştirebilir (soruları bir arkadaşıyla birlikte cevaplamak gibi). Her oturumu kitaba bakmadan hatırladıklarını yazarak bitirmesi ona uyabilir.',
          adult:
            'Öğrenme düzenini çoğunlukla aynı tut; haftada bir kez yerini ya da yöntemini değiştir (öğrendiğini birine anlatmak ya da biriyle birlikte çalışmak gibi). Her oturumu kaynağa bakmadan hatırladıklarını yazarak bitir.',
        },
        low: {
          student:
            'Belli bir düzen çalışmayı kolaylaştırabilir: her gün aynı saatte ve aynı yerde çalış. Hep aynı kısa sırayı izle: önce dünkü konuyu kitaba bakmadan hatırla, sonra yeni konuya geç. Tekrarları günlere yaymak bu düzene kolayca eklenir.',
          parent:
            'Belli bir düzen çocuğunuzun çalışmasını kolaylaştırabilir: her gün aynı saatte ve aynı yerde çalışabilir. Hep aynı kısa sırayı izlemesi de ona uyabilir: önce dünkü konuyu kitaba bakmadan hatırlamak, sonra yeni konuya geçmek. Tekrarları günlere yaymak bu düzene kolayca eklenir.',
          adult:
            'Belli bir düzen öğrenmeyi kolaylaştırabilir: her gün aynı saatte ve aynı yerde çalış. Hep aynı kısa sırayı izle: önce dünkü konuyu kaynağa bakmadan hatırla, sonra yeni konuya geç. Tekrarları günlere yaymak bu düzene kolayca eklenir.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta hiç yapmadığın küçük bir şey dene (yeni bir tarif, bir el işi ya da görmediğin bir müze gibi). Hafta sonunda en çok neyin hoşuna gittiğini bir cümleyle yaz.',
          parent:
            'Bu hafta çocuğunuza hiç yapmadığı küçük bir şeyi denemesini önerin (yeni bir tarif, bir el işi ya da görmediği bir müze gibi). Neyi deneyeceğini o seçsin; isterse nasıl geçtiğini anlatsın.',
        },
        average: {
          student:
            'Bu hafta alışkanlıklarından birinde küçük bir değişiklik dene (daha önce dinlemediğin bir müzik türünü dinlemek gibi). Hafta sonunda neyi fark ettiğini bir cümleyle yaz.',
          parent:
            'Bu hafta çocuğunuza alışkanlıklarından birinde küçük bir değişiklik denemesini önerin (daha önce dinlemediği bir müzik türünü dinlemek gibi). İsterse neyi fark ettiğini anlatsın.',
        },
        low: {
          student:
            'Bu hafta tanıdık bir şeyin içinde küçük bir yenilik seç. Örneğin sevdiğin bir yemeği başka bir biçimde dene ya da sevdiğin bir şarkıcının bilmediğin bir şarkısını dinle. Hoşuna giderse bir kez daha dene; gitmezse eskisi gibi sürdür.',
          parent:
            'Bu hafta çocuğunuzla tanıdık bir şeyin içinde küçük bir yenilik seçin. Örneğin sevdiği bir yemeği başka bir biçimde deneyebilir ya da sevdiği bir şarkıcının bilmediği bir şarkısını dinleyebilir. Hoşuna gitmezse eskisi gibi sürdürebilir.',
        },
      },
      settings: {
        high: 'Çeşitliliğin, değişikliğin ve yeni deneyimlerin bol olduğu ortamlar',
        low: 'Düzeni belli, öngörülebilir ve istikrarlı ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.roediger, KAYNAK.brod2019],
};
