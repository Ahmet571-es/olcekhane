import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Heyecan Arayışı: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Riskli davranış özendirilmez. Yüksek düzeylerde heyecan ihtiyacının eğitmen gözetiminde, kuralları belli ve ailenin
 *    bildiği etkinliklerde karşılanması önerilir; belirli bir tehlikeli etkinlik "yap" diye önerilmez. Düşük düzeylerde
 *    kişi zorlanmaz; yalnızca küçük ve güvenli yenilikler önerilir.
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak,
 *    karışık çalışmak; Dunlosky ve ark., 2013). Heyecan arayışı bu yöntemlere nereden başlanacağını seçmeye yardım edebilir;
 *    kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
 *  - Anlık heyecan arayışında "eğer–o zaman" planları önerilir: bir durumda ne yapılacağını önceden belirlemek (Gollwitzer ve
 *    Sheeran, 2006).
 *  - 2. hafta "Plan ve anlık kararlar" (Anlık heyecan arayışı); 3. hafta ortadan en uzak öteki yön.
 *  - Aynı yön ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar
 *    etmez; veliye yaklaşım önerileri de birbirini tekrar etmez (tests/heyecan-arayisi.test.ts ortak söz öbeklerini arar).
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir (Beş Faktör'deki not).
 *  - Test yetişkinlere de açıktır: öğrenci metni okula özgü olduğunda ya da kitaptan söz ettiğinde yetişkin metni yazılır.
 */
export const heyecanArayisiRoadmap: RoadmapTemplate = {
  version: 'heyecan-arayisi-yol-haritasi-1',
  planningScale: 'impulsive',
  planningTitle: 'Plan ve anlık kararlar',
  unit: { one: 'yön', toPlural: 'yönlere' },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Heyecan arayışın, bu yöntemlere nereden başlayacağını seçmene yardım edebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun heyecan arayışı, bu yöntemlere nereden başlayacağını seçmesine yardım edebilir.',
  },
  settingsNote: bf.settingsNote,
  firstWeek: {
    student:
      'Raporundaki üç yöne bak. Bu hafta heyecan duyduğun ya da sıkıldığın anları fark et ve her gün birini bir cümleyle yaz: o an ne yapıyordun?',
    parent:
      'Bu hafta raporu çocuğunuzla birlikte okuyun; hangi cümlelerin onu anlattığını sorun. Hemen bir şeyi değiştirmeye çalışmayın, yalnızca birlikte gözlem yapın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['ayrintili-kisilik-profili', 'kisiligin-10-yonu'],
  nextPurpose: {
    you: 'kişiliğinin öteki yönlerini de görmek',
    parent: 'çocuğunuzun kişiliğinin öteki yönlerini de görmek',
    general: true,
  },
  approach: {
    danger: {
      low: 'Tehlikeli etkinliklere ilgi duymamasını olağan karşılayın; bu tarzı bir eksiklik gibi konuşmayın.',
      average: 'Yeni bir etkinlik denemek istediğinde güvenlik koşullarını onunla birlikte araştırın.',
      high: 'Bu ilgiyi hemen geri çevirmek yerine önce anlamaya çalışın: hangi deneyimlerin ona neden çekici geldiğini sorun; güvenlik sınırlarını da açıkça konuşun.',
    },
    impulsive: {
      low: 'Ölçülü tarzını takdir edin; aileyle ilgili planları yaparken onun görüşünü de alın.',
      average: 'Hangi durumlarda plan yapmayı, hangilerinde anlık davranmayı sevdiğini onunla konuşun; ikisinin de yeri olabileceğini söyleyin.',
      high: 'Canlılığını ve anlık fikirlerini takdir edin; bir şey ters gittiğinde sizi çekinmeden arayabileceğini ona açıkça söyleyin.',
    },
    venture: {
      low: 'Korkularını küçümsemeyin; yeni bir şeyi denemeye hazır olduğunda onun hızına uyun.',
      average: 'Yeni bir şey denediğinde nasıl geçtiğini merakla sorun.',
      high: 'Keşif isteğini destekleyin; nereye gittiğini ve ne zaman döneceğini size haber vermesini bir kural olarak birlikte belirleyin.',
    },
  },
  scales: {
    danger: {
      color: '#e6194b',
      study: {
        high: {
          student:
            'Tekdüze tekrar sana sıkıcı gelebilir. Kendini sınamayı bir yarışa çevir: süre tut, kitaba bakmadan soru çöz ve sonucunu bir önceki denemeyle karşılaştır. Kendini sınamak en etkili öğrenme yöntemlerinden biridir; kendi rekorunu kırmaya çalışmak ona biraz heyecan katabilir.',
          parent:
            'Tekdüze tekrar çocuğunuza sıkıcı gelebilir. Kendini sınamayı bir yarışa çevirmesi işine yarayabilir: süre tutup kitaba bakmadan soru çözmek ve sonucunu bir önceki denemeyle karşılaştırmak.',
          adult:
            'Tekdüze tekrar sana sıkıcı gelebilir. Kendini sınamayı bir yarışa çevir: süre tut, kaynağa bakmadan hatırlamaya çalış ve sonucunu bir önceki denemeyle karşılaştır. Kendini sınamak en etkili öğrenme yöntemlerinden biridir; kendi rekorunu kırmaya çalışmak ona biraz heyecan katabilir.',
        },
        average: {
          student:
            'Bazen yenilik, bazen düzen sana iyi gelebilir. Tekrarları günlere yayarken her gün konuların sırasını değiştir; karışık çalışmak hem tekdüzeliği kırar hem de öğrendiğini daha kalıcı kılabilir.',
          parent:
            'Çocuğunuza bazen yenilik, bazen düzen iyi gelebilir. Tekrarları günlere yayarken konuların sırasını her gün değiştirmesi tekdüzeliği kırabilir ve öğrendiğini daha kalıcı kılabilir.',
        },
        low: {
          student:
            'Sakin ve öngörülebilir bir çalışma düzeni sana uyabilir. Her gün aynı saatte ve aynı yerde çalış; oturumun sonunda kitabı kapatıp öğrendiklerini kendi cümlelerinle yaz.',
          parent:
            'Sakin ve öngörülebilir bir çalışma düzeni çocuğunuza uyabilir. Her gün aynı saatte ve aynı yerde çalışması, oturumun sonunda da kitabı kapatıp öğrendiklerini kendi cümleleriyle yazması işine yarayabilir.',
          adult:
            'Sakin ve öngörülebilir bir çalışma düzeni sana uyabilir. Her gün aynı saatte ve aynı yerde çalış; sonunda kaynağı kapatıp öğrendiklerini kendi cümlelerinle yaz.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta heyecan ihtiyacını karşılayabilecek, eğitmeni olan güvenli bir etkinlik araştır (tırmanma duvarı ya da bir spor kulübü gibi) ve ailenle birlikte değerlendir.',
          parent:
            'Bu hafta çocuğunuzla birlikte, heyecan ihtiyacını karşılayabilecek, eğitmeni olan güvenli bir etkinlik araştırın (tırmanma duvarı ya da bir spor kulübü gibi).',
          adult:
            'Bu hafta heyecan ihtiyacını karşılayabilecek, eğitmeni olan güvenli bir etkinlik araştır (tırmanma duvarı ya da bir spor kulübü gibi) ve güvenlik koşullarını öğren.',
        },
        average: {
          student: 'Bu hafta daha önce yapmadığın, seni heyecanlandıran ama tehlike içermeyen bir şey dene: yeni bir spor, yeni bir oyun ya da yeni bir tarif gibi.',
          parent: 'Bu hafta çocuğunuzla daha önce yapmadığınız, heyecan veren ama tehlike içermeyen bir şey deneyin: yeni bir spor, yeni bir oyun ya da yeni bir tarif gibi.',
        },
        low: {
          student: 'Bu hafta seni heyecanlandıran ama tehlike içermeyen bir şeye bir akşam ayır: gerilimli bir film, bir maç ya da zor bir bulmaca gibi.',
          parent: 'Bu hafta çocuğunuzla, heyecan veren ama tehlike içermeyen bir şeye bir akşam ayırın: gerilimli bir film, bir maç ya da zor bir bulmaca gibi.',
        },
      },
      settings: {
        high: 'Hareketin ve heyecanın olduğu, güvenlik kurallarının açık olduğu ortamlar',
        low: 'Fiziksel tehlike içermeyen, güvenli ortamlar',
      },
    },
    impulsive: {
      color: '#f58231',
      study: {
        high: {
          student:
            'Anlık kararlarla hareket etmeyi seviyorsan, çalışmaya başlamadan önce o günkü hedefini tek cümleyle yazmak ve çalışmayı kısa bölümlere ayırmak işini kolaylaştırabilir. Her bölümün sonunda kitaba bakmadan kendine iki soru sor.',
          parent:
            'Anlık kararlarla hareket etmeyi seven çocuğunuz için çalışmaya başlamadan önce o günkü hedefi tek cümleyle yazmak ve çalışmayı kısa bölümlere ayırmak işe yarayabilir.',
          adult:
            'Anlık kararlarla hareket etmeyi seviyorsan, çalışmaya başlamadan önce o günkü hedefini tek cümleyle yazmak ve çalışmayı kısa bölümlere ayırmak sana kolaylık sağlayabilir. Her bölümün sonunda kaynağa bakmadan kendine iki soru sor.',
        },
        average: {
          student:
            'Bazen planlı, bazen anlık çalışıyor olabilirsin. Planladığın günlerde tekrarları önceden takvime yaz; plansız kaldığın günlerde de en azından on dakika kendini sınamaya ayır.',
          parent:
            'Çocuğunuz bazen planlı, bazen anlık çalışıyor olabilir. Planladığı günlerde tekrarları takvime yazması, plansız kaldığı günlerde de en azından on dakika kendini sınaması denge kurmasına yardım edebilir.',
        },
        low: {
          student:
            'Ölçülü tarzın düzenli tekrar için uygun olabilir: tekrar günlerini önceden belirle (bir gün, bir hafta ve bir ay sonra gibi) ve takvimine yaz.',
          parent:
            'Çocuğunuzun ölçülü tarzı düzenli tekrar için uygun olabilir: tekrar günlerini önceden belirlemesi (bir gün, bir hafta ve bir ay sonra gibi) ve takvimine yazması işine yarayabilir.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta bir “eğer–o zaman” planı yaz: “Eğer bir arkadaşım riskli bir şey önerirse, o zaman önce ‘Biraz düşüneyim’ diyeceğim.” Hafta boyunca bu planı ne zaman kullandığını not et.',
          parent:
            'Bu hafta çocuğunuzla bir “eğer–o zaman” planı yazın: “Eğer bir arkadaşım riskli bir şey önerirse, o zaman önce ‘Biraz düşüneyim’ diyeceğim.” Hafta sonunda planın işe yarayıp yaramadığını konuşun.',
          adult:
            'Bu hafta bir “eğer–o zaman” planı yaz: “Eğer heyecan verici ama riskli bir fırsat çıkarsa, o zaman karar vermeden önce bir gece beklerim.” Hafta boyunca bu planı ne zaman kullandığını not et.',
        },
        average: {
          student: 'Bu hafta önemli bir kararı vermeden önce iki seçeneği kâğıda yaz ve her birinin olası sonucunu bir cümleyle not et.',
          parent: 'Bu hafta çocuğunuza, önemli bir kararı vermeden önce iki seçeneği kâğıda yazmasını ve her birinin olası sonucunu bir cümleyle not etmesini önerin.',
        },
        low: {
          student: 'Bu hafta planında olmayan küçük ve güvenli bir değişikliğe “evet” de: bir arkadaşının önerdiği bir etkinlik gibi.',
          parent: 'Bu hafta çocuğunuzu planında olmayan küçük ve güvenli bir değişikliğe “evet” demeye cesaretlendirin: bir arkadaşının önerdiği bir etkinlik gibi.',
        },
      },
      settings: {
        high: 'Tekdüzeliğin az olduğu, değişikliğe ve yeni fikirlere açık ortamlar',
        low: 'Planlı ve düzenli çalışmanın değer gördüğü ortamlar',
      },
    },
    venture: {
      color: '#3cb44b',
      study: {
        high: {
          student:
            'Yeni şeyleri keşfetme isteğin öğrenmede de işine yarayabilir. Yeni bir konuya başlamadan önce o konuyla ilgili üç “neden” sorusu yaz; konuyu çalışırken bu soruların cevaplarını ara.',
          parent:
            'Çocuğunuzun keşfetme isteği öğrenmede de işine yarayabilir. Yeni bir konuya başlamadan önce o konuyla ilgili üç “neden” sorusu yazabilir; konuyu çalışırken bu soruların cevaplarını arayabilir.',
        },
        average: {
          student:
            'Yeni ve zor bir konuya başlarken önce bildiğin bir konuyla bağlantısını kur; sonra yeni kısmı küçük parçalar hâlinde çalışıp her parçadan sonra kendini sına.',
          parent:
            'Çocuğunuz yeni ve zor bir konuya başlarken önce bildiği bir konuyla bağlantısını kurabilir; sonra yeni kısmı küçük parçalar hâlinde çalışıp her parçadan sonra kendini sınayabilir.',
        },
        low: {
          student:
            'Yeni ve zor bir konu seni tedirgin ediyorsa onu küçük parçalara böl ve işe en kolay parçadan başla. Her parçadan sonra kendini sınamak, neyi bildiğini görmeni kolaylaştırır.',
          parent:
            'Yeni ve zor bir konu çocuğunuzu tedirgin ediyorsa onu küçük parçalara bölmesine ve işe en kolay parçadan başlamasına yardım edin. Her parçadan sonra kendini sınaması, neyi bildiğini görmesini kolaylaştırır.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta merak ettiğin, herkese açık ve güvenli bir yeri (bir müze, bir doğa yürüyüşü parkuru ya da bir atölye gibi) seç ve oraya gitmek için bir plan yap: ne gerekiyor, kiminle gideceksin?',
          parent: 'Bu hafta çocuğunuzun merak ettiği, herkese açık ve güvenli bir yeri (bir müze, bir doğa yürüyüşü parkuru ya da bir atölye gibi) seçmesine ve oraya kiminle gideceğini de içeren bir planı sizinle birlikte yapmasına destek olun.',
        },
        average: {
          student: 'Bu hafta bir arkadaşınla ya da ailenle daha önce gitmediğin bir yeri keşfet: bir kütüphane, bir park ya da bir sergi gibi.',
          parent: 'Bu hafta çocuğunuzla daha önce gitmediğiniz bir yeri keşfedin: bir kütüphane, bir park ya da bir sergi gibi.',
          adult: 'Bu hafta daha önce gitmediğin bir yeri keşfet: bir kütüphane, bir park ya da bir sergi gibi.',
        },
        low: {
          student: 'Bu hafta istersen, seni biraz tedirgin eden ama güvenli bir şeyi yanında güvendiğin biri varken küçük bir adımla dene: bir seyir terasından manzaraya bakmak ya da yağmurlu bir günde uygun giyinip kısa bir yürüyüş yapmak gibi.',
          parent: 'Bu hafta çocuğunuz isterse, kendisini biraz tedirgin eden ama güvenli bir şeyi küçük bir adımla denemesine eşlik edin: bir seyir terasından manzaraya bakmak ya da yağmurlu bir günde uygun giyinip kısa bir yürüyüş yapmak gibi.',
        },
      },
      settings: {
        high: 'Yeni yerlerin ve deneyimlerin keşfedildiği ortamlar',
        low: 'Destekleyici, yeni şeylere kişinin kendi hızında alışabildiği ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.gollwitzer],
};
