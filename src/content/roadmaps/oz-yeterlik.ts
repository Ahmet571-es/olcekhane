import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Öz-yeterlik: Kendine Güven: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak;
 *    Dunlosky ve ark., 2013; Roediger ve Karpicke, 2006). Kendine güvenin alanları yalnızca bu yöntemleri hangi düzende
 *    kullanmanın kolay geleceğine ipucu verir; kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
 *  - 2. hafta "Küçük başarılar" (İşlerde kendine güven): okulla ilgili araştırmalarda öz-yeterliği çoğu zaman en çok
 *    besleyen, bir işi kendisi başarma deneyimidir (bilim kartındaki kaynaklar); bu yüzden her düzeyde küçük, bitirilebilir
 *    işler ve bitirileni not etmek önerilir. Veliye yaklaşım önerileri bunu tekrarlamaz, tamamlar (yaptığını somut söylemek,
 *    önceki başarıları hatırlatmak, bitirilen işi birlikte konuşmak). 3. hafta "Zor anlarda kendine güven" düşükse ona (iyi
 *    oluş), değilse ortadan en uzak öteki alana ayrılır. "Sık sık moralim bozuk olur" cümlesi yalnızca orta düzeydeki zor
 *    anlar önerilerini düşük düzeye çevirir (`flaggedFromAverage`; yüksek düzeyde kartla çelişmesin).
 *  - Ortamlar bugünkü güvene göre bir ipucudur, sınır değildir (`settingsNote` bunu söyler; güven değişebilir).
 *  - Düşük düzeyde kişi suçlanmaz ve zorlanmaz (kalabalıkta konuşmaya zorlamak gibi); öneriler küçük ve güvenlidir. Bir sonuç
 *    ya da "özgüveni artırma" vaadi verilmez.
 *  - Aynı alan ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar
 *    etmez; veliye yaklaşım önerileri de birbirini tekrar etmez (tests/oz-yeterlik.test.ts ortak söz öbeklerini arar).
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir (Beş Faktör'deki not).
 *  - Test yetişkinlere de açıktır: öğrenci metni okula özgü olduğunda ya da kitaptan söz ettiğinde yetişkin metni yazılır.
 */
export const ozYeterlikRoadmap: RoadmapTemplate = {
  version: 'oz-yeterlik-yol-haritasi-1',
  planningScale: 'tasks',
  planningTitle: 'Küçük başarılar',
  unit: { one: 'alan', toPlural: 'alanlara' },
  wellbeing: { scale: 'coping', group: 'low', link: null },
  flaggedFromAverage: true,
  // Destek kutusunu açan alan "Kısaca"da öne çıkanların başında gösterilir.
  standoutFirst: [{ scale: 'coping', group: 'low' }],
  balancedNote: {
    student: 'Üç alanda da kendine güvenin orta düzeyde; işe ve duruma göre değişiyor olabilir.',
    parent: 'Çocuğunuzun üç alanda da kendine güveni orta düzeyde; işe ve duruma göre değişiyor olabilir.',
  },
  links: [{ label: 'Öz-saygı nedir?', href: '/rehber/oz-saygi-nedir' }],
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Kendine güvenin alanları, bu yöntemleri hangi düzende kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun kendine güveninin alanları, bu yöntemleri hangi düzende kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
  },
  settingsNote: {
    student:
      'Bu ortamlar yalnızca bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir; kendine güven zamanla artabilir. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'Bu ortamlar yalnızca çocuğunuzun bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir; kendine güven zamanla artabilir. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Raporundaki üç alana bak. Bu hafta her gün, kendinden emin olduğun ya da olmadığın bir anı bir cümleyle yaz: ne yapıyordun, kimlerleydin, nasıl hissettin?',
    parent:
      'Bu hafta raporu çocuğunuzla birlikte okuyun; hangi cümlelerin onu anlattığını sorun. Hemen bir şeyi değiştirmeye çalışmayın, yalnızca birlikte gözlem yapın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['zihniyet', 'iyimserlik'],
  nextPurpose: {
    you: 'öğrenmeye ve geleceğe nasıl baktığını da görmek',
    parent: 'çocuğunuzun öğrenmeye ve geleceğe nasıl baktığını da görmek',
  },
  approach: {
    tasks: {
      low: 'Bir işi bitirdiğinde neyi nasıl yaptığını somut olarak söyleyin (“Önce planladın, sonra tek tek bitirdin” gibi). Takıldığında işi onun yerine yapmayın; soru sorarak yol gösterin.',
      average: 'Hangi işleri yaparken rahat, hangilerinde tedirgin olduğunu birlikte konuşun; tedirgin olduğu bir işte, daha önce benzer bir şeyi nasıl başardığını ona hatırlatın.',
      high: 'Bir işi bitirdikten sonra neyin iyi gittiğini ve neyi farklı yapabileceğini birlikte konuşun.',
    },
    social: {
      low: 'Kalabalık ortamlarda konuşması için onu zorlamayın; bir topluluğa girmeden önce orada ne konuşabileceğini birlikte düşünmek ona kolaylık sağlayabilir.',
      average: 'Hangi ortamlarda rahat edip hangilerinde sessizleştiğini merak edin; nedenini yargılamadan dinleyin.',
      high: 'Bir aile buluşmasını ya da arkadaşlarıyla bir etkinliği planlaması için ona fırsat verin; insanlar arasındaki rahatlığına değer verdiğinizi gösterin.',
    },
    coping: {
      low: 'Bunaldığında hemen çözüm önermek yerine önce dinleyin; sonra birlikte, atılabilecek ilk küçük adımı bulun.',
      average: 'Bir aksilik yaşadığında önce ne hissettiğini sorun ve dinleyin; hangi durumların onu daha çok zorladığını birlikte fark etmeye çalışın.',
      high: 'Zorlukları atlatabilmesini takdir edin; bir sorunla tek başına uğraşmak zorunda olmadığını ve size gelebileceğini de bilsin.',
    },
  },
  scales: {
    tasks: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Bir konuda kendine güvendiğinde bunu sınamak için konuyu çalıştıktan sonra kitabı kapat ve kendine soru sor; cevaplayamadığın yerler, nereye daha çok zaman ayırman gerektiğini gösterir.',
          parent:
            'Bir konuda kendine güvendiğinde konuyu çalıştıktan sonra kitabı kapatıp kendine soru sorması, çocuğunuzun cevaplayamadığı yerleri ve nereye daha çok zaman ayırması gerektiğini görmesini sağlar.',
          adult:
            'Bir konuda kendine güvendiğinde bunu sınamak için konuyu öğrendikten sonra kaynağı kapat ve kendine soru sor; cevaplayamadığın yerler, nereye daha çok zaman ayırman gerektiğini gösterir.',
        },
        average: {
          student:
            'Bir konuyu çalışmadan önce onu ne kadar iyi bildiğine 1 ile 5 arasında bir puan ver; sonra kitaba bakmadan birkaç soru çöz ve tahminini sonuçla karşılaştır. Böylece hangi konularda kendine haklı olarak güvendiğini görürsün.',
          parent:
            'Çocuğunuz bir konuyu çalışmadan önce onu ne kadar iyi bildiğine 1 ile 5 arasında bir puan verebilir. Sonra kitaba bakmadan birkaç soru çözüp tahminini sonuçla karşılaştırması, hangi konularda kendine haklı olarak güvendiğini görmesini sağlar.',
          adult:
            'Bir şeyi öğrenmeye başlamadan önce onu ne kadar iyi bildiğine 1 ile 5 arasında bir puan ver; sonra kaynağa bakmadan birkaç soruyu cevapla ve tahminini sonuçla karşılaştır. Böylece hangi konularda kendine haklı olarak güvendiğini görürsün.',
        },
        low: {
          student:
            'Büyük bir konuyu küçük parçalara böl ve her gün bir parçayı çalış; her parçanın sonunda kitaba bakmadan hatırladıklarını yaz. Hatırlayabildiklerini yazılı görmek, neleri yapabildiğini fark etmeni kolaylaştırabilir.',
          parent:
            'Büyük bir konuyu küçük parçalara bölüp her gün bir parçayı çalışması ve her parçanın sonunda kitaba bakmadan hatırladıklarını yazması, çocuğunuzun neleri yapabildiğini fark etmesini kolaylaştırabilir.',
          adult:
            'Öğrenmek istediğin büyük bir konuyu küçük parçalara böl ve her gün bir parçayı çalış; her parçanın sonunda kaynağa bakmadan hatırladıklarını yaz. Hatırlayabildiklerini yazılı görmek, neleri yapabildiğini fark etmeni kolaylaştırabilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta sana biraz zor gelen bir iş seç, onu küçük adımlara böl ve ilk adımla başla; her adımı bitirdiğinde bir deftere not et.',
          parent: 'Bu hafta çocuğunuza biraz zor gelen bir iş seçmesini, onu küçük adımlara bölüp ilk adımla başlamasını ve her adımı bitirdiğinde bir deftere not etmesini önerin.',
        },
        average: {
          student: 'Bu hafta emin olmadığın bir iş seç; onu üç küçük adıma böl ve her gün bir adımı tamamla. Hafta sonunda neyi bitirdiğine bak.',
          parent: 'Bu hafta çocuğunuzla, emin olmadığı bir işi seçip üç küçük adıma bölün; her gün bir adımı tamamlasın, hafta sonunda neyi bitirdiğine birlikte bakın.',
        },
        low: {
          student:
            'Bu hafta her gün bitirebileceğin küçük bir iş seç (bir çekmeceyi düzenlemek ya da yarım kalmış bir işi tamamlamak gibi) ve bitirdiğinde bir deftere yaz. Hafta sonunda listene bak.',
          parent:
            'Bu hafta çocuğunuzla her gün bitirebileceği küçük bir iş seçin (bir çekmeceyi düzenlemek ya da yarım kalmış bir işi tamamlamak gibi); bitirdiğinde bir deftere yazsın, hafta sonunda listeye birlikte bakın.',
        },
      },
      settings: {
        high: 'Sorumluluk alınabilen, bir işin baştan sona yürütülebildiği ortamlar',
        low: 'Yeni işlere adım adım alışılabilen, geri bildirimin açık olduğu ortamlar',
      },
    },
    social: {
      color: '#d28a14',
      study: {
        high: {
          student:
            'İnsanlar arasında rahat olman birlikte çalışırken işine yarayabilir. Öğrendiğin bir konuyu bir arkadaşına kitaba bakmadan anlat; takıldığın yerleri sonra yeniden çalış.',
          parent:
            'Çocuğunuzun insanlar arasında rahat olması birlikte çalışırken işine yarayabilir. Öğrendiği bir konuyu bir arkadaşına kitaba bakmadan anlatabilir ve takıldığı yerleri sonra yeniden çalışabilir.',
          adult:
            'İnsanlar arasında rahat olman birlikte öğrenirken işine yarayabilir. Öğrendiğin bir şeyi birine kaynağa bakmadan anlat; takıldığın yerleri sonra yeniden çalış.',
        },
        average: {
          student:
            'Bir konuyu önce tek başına çalış; birkaç gün sonra güvendiğin bir arkadaşınla sırayla birbirinize kitaba bakmadan soru sorun.',
          parent:
            'Çocuğunuz bir konuyu önce tek başına çalışıp birkaç gün sonra güvendiği bir arkadaşıyla sırayla birbirlerine kitaba bakmadan soru sorabilir.',
          adult:
            'Bir konuyu önce tek başına öğren; birkaç gün sonra aynı şeyi öğrenen güvendiğin biriyle sırayla birbirinize kaynağa bakmadan soru sorun.',
        },
        low: {
          student:
            'Öğrendiğin konuyu, birine anlatıyormuş gibi kitaba bakmadan yazıyla anlat; sonra kitapla karşılaştırıp eksiklerini bul. Bu yöntem bir grup içinde konuşmayı gerektirmez.',
          parent:
            'Çocuğunuz öğrendiği konuyu birine anlatıyormuş gibi kitaba bakmadan yazıyla anlatıp sonra kitapla karşılaştırabilir; bu, eksiklerini bulmasını kolaylaştırabilir ve bir grup içinde konuşmayı gerektirmez.',
          adult:
            'Öğrendiğin şeyi, birine anlatıyormuş gibi kaynağa bakmadan yazıyla anlat; sonra kaynakla karşılaştırıp eksiklerini bul. Bu yöntem bir grup içinde konuşmayı gerektirmez.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir grupta sessiz kalan birine fikrini sor ve sözünü kesmeden onu dinle.',
          parent: 'Bu hafta çocuğunuza, bir grupta sessiz kalan birine fikrini sormasını ve sözünü kesmeden onu dinlemesini önerin.',
        },
        average: {
          student: 'Bu hafta seni biraz zorlayan küçük bir konuşma dene: bir mağazada bir şey sormak ya da bir toplulukta kısa bir fikir söylemek gibi.',
          parent: 'Bu hafta çocuğunuzu, onu biraz zorlayan küçük bir konuşmayı denemeye cesaretlendirin: bir mağazada bir şey sormak ya da bir toplulukta kısa bir fikir söylemek gibi.',
        },
        low: {
          student: 'Bu hafta her gün tanıdığın bir kişiyle ilgini çeken bir konu hakkında birkaç dakika konuş. Hafta sonunda istersen bir yabancıya kısa bir soru sormayı dene (yolu ya da saati sormak gibi).',
          parent: 'Bu hafta akşamları çocuğunuzla onun ilgisini çeken bir konu hakkında birkaç dakika konuşun; hafta sonunda isterse bir yabancıya kısa bir soru sormayı denesin (yolu ya da saati sormak gibi).',
        },
      },
      settings: {
        high: 'İnsanlarla sık sık konuşulan, sunumların ve tartışmaların olduğu ortamlar',
        low: 'Küçük gruplarla ya da bağımsız çalışılabilen ortamlar',
      },
    },
    coping: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Takıldığın bir konuyu bırakmak yerine sonraya ayırabilirsin: takıldığın soruları bir kenara yaz ve birkaç gün sonra kitaba bakmadan yeniden dene. Tekrarları günlere yaymak, öğrendiğinin akılda kalmasına yardım eder.',
          parent:
            'Çocuğunuz takıldığı bir konuyu bırakmak yerine sonraya ayırabilir: takıldığı soruları bir kenara yazıp birkaç gün sonra kitaba bakmadan yeniden deneyebilir. Tekrarları günlere yaymak, öğrendiklerinin akılda kalmasına yardım eder.',
          adult:
            'Takıldığın bir konuyu bırakmak yerine sonraya ayırabilirsin: takıldığın yerleri bir kenara yaz ve birkaç gün sonra kaynağa bakmadan yeniden dene. Tekrarları günlere yaymak, öğrendiğinin akılda kalmasına yardım eder.',
        },
        average: {
          student:
            'Çalışmayı kısa bölümlere ayır ve bölümler arasında kısa molalar ver; her bölümün sonunda kitaba bakmadan hatırladığın üç şeyi yaz.',
          parent:
            'Çalışmayı kısa bölümlere ayırıp aralarda kısa molalar vermesi ve her bölümün sonunda kitaba bakmadan hatırladığı üç şeyi yazması çocuğunuza uyabilir.',
          adult:
            'Öğrenmeyi kısa bölümlere ayır ve bölümler arasında kısa molalar ver; her bölümün sonunda kaynağa bakmadan hatırladığın üç şeyi yaz.',
        },
        low: {
          student:
            'Bunaldığın dönemlerde çok şeyi bir arada yapmak yorucu olabilir. Her gün yalnızca bir konu seç, onu kısa bir süre çalış ve kitaba bakmadan hatırladıklarını yaz; tekrarları da günlere yay.',
          parent:
            'Bunaldığı dönemlerde çok şeyi bir arada yapmak çocuğunuzu yorabilir. Her gün yalnızca bir konu seçip onu kısa bir süre çalışması, kitaba bakmadan hatırladıklarını yazması ve tekrarları günlere yayması ona uyabilir.',
          adult:
            'Bunaldığın dönemlerde çok şeyi bir arada yapmak yorucu olabilir. Her gün yalnızca bir konu seç, onu kısa bir süre çalış ve kaynağa bakmadan hatırladıklarını yaz; tekrarları da günlere yay.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta seni zorlayan bir durumu atlattığında, bunu nasıl yaptığını bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla, zorlayıcı bir durumu atlattığı bir anı konuşun ve bunu nasıl yaptığını bir cümleyle yazmasını önerin.',
        },
        average: {
          student: 'Bu hafta seni bunaltan bir durumda önce birkaç derin nefes al, sonra atabileceğin ilk küçük adımı yaz ve onu yap.',
          parent: 'Bu hafta çocuğunuz bunaldığında önce birkaç derin nefes almasını, sonra atabileceği ilk küçük adımı yazıp onu yapmasını önerin.',
        },
        low: {
          student:
            'Bu hafta bunaldığın bir an olursa duygunu bir sözcükle adlandır (“endişeliyim”, “yoruldum” gibi) ve sana iyi gelen küçük bir şey yap: kısa bir yürüyüşe çıkmak ya da sevdiğin bir müziği dinlemek gibi.',
          parent:
            'Bu hafta çocuğunuza, bunaldığı bir an olursa duygusunu bir sözcükle adlandırmasını (“endişeliyim”, “yoruldum” gibi) ve kendisine iyi gelen küçük bir şey yapmasını önerin: kısa bir yürüyüşe çıkmak ya da sevdiği bir müziği dinlemek gibi.',
        },
      },
      settings: {
        high: 'Değişikliklerin ve beklenmedik durumların olduğu ortamlar',
        low: 'Düzenin belli olduğu, yardım istemenin kolay olduğu ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.roediger],
};
