import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Düşünme ve Çalışma Tarzı: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak,
 *    karışık çalışmak, "Bu neden böyle?" diye sorup kendine açıklamak; Dunlosky ve ark., 2013; Rohrer, Dedrick ve
 *    Stershic, 2015). Her özellik için bu yöntemleri kullanmayı kolaylaştıran küçük bir sonraki adım önerilir; kişiliğe göre
 *    "öğrenme stili" eşleştirmesi vaat edilmez. Bir işe ne zaman ve nerede başlanacağını önceden belirlemek (Gollwitzer ve
 *    Sheeran, 2006) ve bir işin süresini önceden tahmin edip gerçekte ne kadar sürdüğüyle karşılaştırmak (insanlar işlerin
 *    süresini çoğu zaman olduğundan kısa tahmin eder; Buehler, Griffin ve Ross, 1994) düzen önerilerindedir.
 *  - Uçların iyi ya da kötü anlamı yoktur: yüksek düzeyin önerileri de bir sonraki adımı anlatır. Öz bildirim bir yetenek
 *    gibi anlatılmaz ("birçok işi yürütebilmen bir güç" değil, "birçok işi bir arada yürüttüğünü söylüyorsun").
 *  - Aynı özellik ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri
 *    tekrar etmez (ör. enerji yüksekken dinlenme yalnızca rapor kartında); veliye yaklaşım önerileri de birbirini tekrar
 *    etmez. tests/dusunme-ve-calisma-tarzi.test.ts dört sözcüklük ortak söz öbeklerini arar.
 *  - Enerji ve tempo önerileri "işe başlamayı" anlatmaz (düzen ve plan kartındaki "işleri hemen halletme" ile çelişmesin);
 *    karışık çalışma önerisiyle çelişmesin diye "tek konuya odaklan" denmez, yalnızca öğrenirken başka işlerle (mesaj,
 *    bildirim) uğraşmamak önerilir.
 *  - Ortamlar bölümü yoktur (özellikler meslek ortamı anlatmaz). 2. hafta "Çalışma düzeni" (Düzen ve plan); 3. hafta
 *    ortadan en uzak özellik.
 *  - Test yetişkinlere de açıktır: öğrenci metinleri okula özgü sözcük içermez ("kitap" yerine "kaynak"), yetişkine de
 *    gösterilir.
 */
export const dusunmeVeCalismaTarziRoadmap: RoadmapTemplate = {
  version: 'dusunme-ve-calisma-tarzi-yol-haritasi-1',
  planningScale: 'organization',
  unit: { one: 'özellik', toPlural: 'özelliklere' },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Düşünme ve çalışma tarzın, bu yöntemlere nereden başlayacağını seçmene yardım edebilir. Aşağıdaki önerilerin hepsini birden değil, birer birer dene.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun düşünme ve çalışma tarzı, bu yöntemlere nereden başlayacağını seçmesine yardım edebilir. Önerilerin hepsini birden değil, birer birer denemesine destek olun.',
  },
  firstWeek: {
    student:
      'Raporundaki beş özelliğe bak. Bu hafta her gün, düşünürken ya da çalışırken bunlardan hangisinin işine yaradığını ve hangisinin seni zorladığını bir cümleyle yaz.',
    parent: 'Bu hafta çocuğunuzla raporundaki beş özelliğe birlikte bakın; hangisinin ona nerede yardım ettiğini ve nerede zorladığını merakla sorun.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['calisma-degerleri', 'meslek-ilgi-alanlari', 'mesleki-ilgi-profili'],
  nextPurpose: {
    you: 'çalışırken neye önem verdiğini ve hangi alanlara ilgi duyduğunu da görmek',
    parent: 'çocuğunuzun çalışırken neye önem verdiğini ve hangi alanlara ilgi duyduğunu da görmek',
  },
  approach: {
    complexity: {
      low: 'Merak ettiği bir şeyi sorduğunda cevabı hemen vermek yerine “Sen ne düşünüyorsun?” diye sorun.',
      average: 'İlginç bulduğu bir fikri, filmi ya da kitabı size anlatmasına zaman ayırın.',
      high: 'Soyut sorular üzerine onunla konuşmaktan keyif aldığınızı gösterin; fikirlerine katılmasanız da merakla dinleyin.',
    },
    ingenuity: {
      low: 'Yeni bir şey denediğinde, sonucu ne olursa olsun denemesini takdir edin.',
      average: 'Bir işi farklı bir yoldan yaptığında bunu fark edip ona söyleyin.',
      high: 'Cesur planlarını hemen eleştirmek yerine, önce neyi amaçladığını sorun.',
    },
    conformity: {
      low: 'Kendi görüşünü oluşturmasına saygı gösterin; bu görüşü neye dayandırdığını merakla sorun.',
      average: 'Bir konuda kendi görüşünü söylediğinde onu kesmeden sonuna kadar dinleyin.',
      high: 'Fikrini sorduğunuzda verdiği cevabı, başkalarınınkinden farklı olsa da değerli bulduğunuzu gösterin.',
    },
    activity: {
      low: 'Onu başkalarının temposuyla karşılaştırmayın; kendi temposunda bitirdiği işleri fark edip ona söyleyin.',
      average: 'Hangi işlerde daha istekli ve hareketli olduğunu onunla konuşun.',
      high: 'Yoğun temposunu takdir edin; yaptığı işlerden hangilerinin ona en çok keyif verdiğini sorun.',
    },
    organization: {
      low: 'Dağınıklık için eleştirmek yerine, düzenli davrandığı küçük anları gördüğünüzü belli edin.',
      average: 'Bir işi planlı yaptığı ve plansız yaptığı günleri onunla birlikte karşılaştırın.',
      high: 'Planlar değiştiğinde yeni bir yol bulmayı onunla birlikte konuşun.',
    },
  },
  scales: {
    complexity: {
      color: '#7a4ee6',
      study: {
        low: {
          student:
            'Yeni bir konuya gündelik hayattan bir örnekle başla, sonra genel kurala geç. Öğrendiğin bir bilgiyi kendi sözlerinle ve kısa bir örnekle anlatmak, onu daha kalıcı hâle getirebilir.',
          parent:
            'Çocuğunuzun yeni bir konuya gündelik hayattan bir örnekle başlaması ve sonra genel kurala geçmesi, soyut konuları kolaylaştırabilir. Öğrendiği bir bilgiyi kendi sözleriyle ve kısa bir örnekle anlatması da onu daha kalıcı hâle getirebilir.',
        },
        average: {
          student:
            'Öğrendiğin bir konuda “Bu neden böyle?” diye sor ve cevabını kendine açıkla. İlgini çeken bir konuyu bildiğin başka bir şeyle karşılaştırmak, onu daha iyi anlamanı sağlayabilir.',
          parent:
            'Çocuğunuzun öğrendiği bir konuda “Bu neden böyle?” diye sorup cevabını kendine açıklaması ve konuyu bildiği başka bir şeyle karşılaştırması, onu daha iyi anlamasını sağlayabilir.',
        },
        high: {
          student:
            'Soyut konular üzerine düşünmekten hoşlanman, bir konuyu derinlemesine anlamanı kolaylaştırabilir. Bu isteği, öğrendiğin bir fikri farklı örnekler üzerinde deneyerek ve birkaç gün sonra kaynağa bakmadan yeniden hatırlamaya çalışarak destekle.',
          parent:
            'Çocuğunuzun soyut konular üzerine düşünmekten hoşlanması, bir konuyu derinlemesine anlamasını kolaylaştırabilir. Öğrendiği bir fikri farklı örnekler üzerinde denemesi ve birkaç gün sonra kaynağa bakmadan yeniden hatırlamaya çalışması bu isteği daha verimli kılabilir.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta ilgini çeken bir film, dizi ya da olay seç ve “Bu neden böyle oldu?” sorusuna bir iki cümleyle cevap yaz.',
          parent: 'Bu hafta çocuğunuzla birlikte izlediğiniz bir film ya da konuştuğunuz bir olay üzerine “Sence neden böyle oldu?” diye sorun.',
        },
        average: {
          student: 'Bu hafta seni düşündüren bir soruyu (örneğin “Adil olmak ne demek?”) bir yakınınla konuş ve vardığınız fikri bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla onu düşündüren bir soruyu (örneğin “Adil olmak ne demek?”) konuşun; vardığı fikri bir cümleyle söylemesini isteyin.',
        },
        high: {
          student: 'Bu hafta seni düşündüren soyut bir soru seç (örneğin “Zaman nedir?”); üzerine kısa bir yazı yaz ve iki farklı bakış açısını karşılaştır.',
          parent:
            'Bu hafta çocuğunuzdan onu düşündüren soyut bir soru seçip üzerine kısa bir yazı yazmasını ve iki farklı bakış açısını karşılaştırmasını isteyin.',
        },
      },
    },
    ingenuity: {
      color: '#d28a14',
      study: {
        low: {
          student:
            'Bir problemde takıldığında aklına gelen birkaç çözüm yolunu kâğıda yaz ve aralarından birini seç; ilk akla gelen yol tek yol değildir. Çözülmüş bir örneği inceleyip sonra ona benzeyen bir soruyu kendin kurmak da yeni yollar bulmayı kolaylaştırabilir.',
          parent:
            'Çocuğunuzun bir problemde takıldığında birkaç çözüm yolunu kâğıda yazıp aralarından birini seçmesi ve çözülmüş bir örneğe benzeyen bir soruyu kendisinin kurması, yeni yollar bulmasını kolaylaştırabilir.',
        },
        average: {
          student:
            'Çalıştığın bir konuda aynı problemi iki farklı yoldan çözmeyi dene. Farklı türden problemleri karışık sırayla çözmek de hangi durumda hangi yolu kullanacağını ayırt etmeni kolaylaştırabilir.',
          parent:
            'Çocuğunuzun aynı problemi iki farklı yoldan çözmeyi denemesi ve farklı türden problemleri karışık sırayla çözmesi, hangi durumda hangi yolu kullanacağını ayırt etmesini kolaylaştırabilir.',
        },
        high: {
          student:
            'Fikir bulmaktan hoşlanman güçlü bir başlangıç. Bir fikri geliştirirken onu birine anlatmak, eksik ya da zayıf yerlerini görmeni kolaylaştırır; fikrin dayandığı bilgileri kendine sorular sorarak sınamak da işe yarar.',
          parent:
            'Çocuğunuzun fikir bulmaktan hoşlanması güçlü bir başlangıç. Bir fikri geliştirirken onu size anlatması, eksik ya da zayıf yerlerini görmesini kolaylaştırır; fikrin dayandığı bilgileri kendine sorular sorarak sınaması da işe yarar.',
        },
      },
      action: {
        low: {
          student:
            'Bu hafta birkaç kez sıradan bir işi biraz farklı yap (örneğin bir yemeği başka bir tarifle hazırla ya da eve başka bir yoldan dön) ve nasıl gittiğini bir cümleyle yaz.',
          parent:
            'Bu hafta çocuğunuzla sıradan bir işi biraz farklı yapın (örneğin bir yemeği başka bir tarifle hazırlayın) ve nasıl gittiğini birlikte konuşun.',
        },
        average: {
          student: 'Bu hafta karşılaştığın bir sorun için en az üç farklı çözüm yaz ve birini dene.',
          parent: 'Bu hafta çocuğunuzdan karşılaştığı bir sorun için en az üç farklı çözüm yazmasını ve birini denemesini isteyin.',
        },
        high: {
          student: 'Bu hafta aklına gelen fikirlerden birini seç ve küçük bir denemeyle sına; hafta sonunda fikrin nasıl sonuçlandığını bir iki cümleyle yaz.',
          parent:
            'Bu hafta çocuğunuzun aklına gelen fikirlerden birini seçip küçük bir denemeyle sınamasını destekleyin; hafta sonunda fikrin nasıl sonuçlandığını konuşun.',
        },
      },
    },
    conformity: {
      color: '#0e9c8c',
      study: {
        low: {
          student:
            'Kendi görüşünü oluşturmak istemen, bir konuyu sorgulayarak öğrenmeni kolaylaştırabilir. Bir konuyu çalışırken farklı kaynakların ne dediğine bak ve kendi düşünceni onlarla karşılaştır. Öğrendiğini birine anlatmak ve onun sorularını dinlemek, gözden kaçırdığın yerleri görmene yardım edebilir.',
          parent:
            'Çocuğunuzun kendi görüşünü oluşturmak istemesi, bir konuyu sorgulayarak öğrenmesini kolaylaştırabilir. Farklı kaynakların ne dediğine bakıp kendi düşüncesini onlarla karşılaştırması ve öğrendiğini birine anlatıp onun sorularını dinlemesi, gözden kaçırdığı yerleri görmesine yardım edebilir.',
        },
        average: {
          student:
            'Tek başına çalışmanın da birlikte çalışmanın da yararı olabilir. Bir konuyu önce tek başına çalış ve kaynağa bakmadan hatırlamaya çalış; sonra birine anlat ve onun sorularını dinle.',
          parent:
            'Çocuğunuzun bir konuyu önce tek başına çalışıp kaynağa bakmadan hatırlamaya çalışması, sonra birine anlatıp onun sorularını dinlemesi, hem tek başına hem birlikte çalışmanın yararını görmesini sağlayabilir.',
        },
        high: {
          student:
            'Birlikte çalışırken de öğrendiğini önce kendi başına hatırlamaya çalış; böylece neyi gerçekten bildiğini görürsün. Bir konuyu çalıştıktan sonra “Ben bu konuda ne düşünüyorum?” sorusuna bir cümleyle cevap yazmak, kendi düşünceni de duymana yardım eder.',
          parent:
            'Çocuğunuzun birlikte çalışırken de öğrendiğini önce kendi başına hatırlamaya çalışması neyi gerçekten bildiğini görmesini sağlar. Bir konuyu çalıştıktan sonra “Ben bu konuda ne düşünüyorum?” sorusuna bir cümleyle cevap yazması, kendi düşüncesini de duymasına yardım eder.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta seninle aynı görüşte olmayan birinin bir konudaki görüşünü dinle ve onun haklı olabileceği bir noktayı yaz.',
          parent: 'Bu hafta çocuğunuzla farklı görüşlerin olduğu bir konuyu konuşun; karşı görüşün haklı olabileceği bir noktayı bulmasını isteyin.',
        },
        average: {
          student:
            'Bu hafta küçük bir kararda (örneğin ne izleyeceğin ya da ne yiyeceğin) önce kendi tercihini yaz, sonra başkalarına sor ve kararını nasıl verdiğini not et.',
          parent:
            'Bu hafta çocuğunuzdan küçük bir kararda önce kendi tercihini söylemesini, sonra başkalarına sormasını isteyin; kararını nasıl verdiğini konuşun.',
        },
        high: {
          student: 'Bu hafta küçük bir konuda (örneğin bir film ya da yemek seçiminde) başkalarına sormadan önce kendi görüşünü bir cümleyle yaz ve onu söyle.',
          parent:
            'Bu hafta küçük bir konuda (örneğin bir film ya da yemek seçiminde) çocuğunuzdan başkalarına sormadan önce kendi görüşünü söylemesini isteyin.',
        },
      },
    },
    activity: {
      color: '#ee6a36',
      study: {
        low: {
          student:
            'Enerjinin günün hangi saatinde en yüksek olduğunu bul ve en önemli işini o saate koy. Uzun bir çalışmayı kısa bölümlere ayırıp aralarda kısa molalar vermek, enerjini korumana yardım edebilir.',
          parent:
            'Çocuğunuzun enerjisinin günün hangi saatinde en yüksek olduğunu bulup en önemli işini o saate koyması ve uzun bir çalışmayı kısa bölümlere ayırıp aralarda kısa molalar vermesi, enerjisini korumasına yardım edebilir.',
        },
        average: {
          student:
            'Enerjinin yüksek olduğu zamanlarda yeni ve zor konulara, düşük olduğu zamanlarda kısa tekrarlara yer ver. Tekrarları günlere yaymak, yoğun ve sakin günleri dengelemene de yardım eder.',
          parent:
            'Çocuğunuzun enerjisinin yüksek olduğu zamanlarda yeni ve zor konulara, düşük olduğu zamanlarda kısa tekrarlara yer vermesi ve tekrarları günlere yayması, yoğun ve sakin günleri dengelemesine yardım edebilir.',
        },
        high: {
          student:
            'Birçok işi bir arada yürüttüğünü söylüyorsun. Öğrenirken bir yandan başka işlerle (mesaj, bildirim gibi) uğraşmamak, dikkatini öğrendiğin konuda tutmanı kolaylaştırabilir. Yoğun dönemlerde de tekrarları günlere yaymak, öğrendiklerini kalıcı kılar.',
          parent:
            'Çocuğunuz birçok işi bir arada yürüttüğünü belirtiyor. Öğrenirken bir yandan başka işlerle (mesaj, bildirim gibi) uğraşmaması dikkatini konuda tutmasını kolaylaştırabilir; yoğun dönemlerde de tekrarları günlere yayması öğrendiklerini kalıcı kılar.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her gün yapmak istediğin küçük bir işi seç ve ona 10 dakika ayır; bitirdiğinde işaretle.',
          parent: 'Bu hafta çocuğunuzla her gün yapmak istediği küçük bir işi seçin; ona 10 dakika ayırmasını ve bitirdiğinde işaretlemesini destekleyin.',
        },
        average: {
          student: 'Bu hafta her gün enerjinin en yüksek olduğu saati not et; hafta sonunda en önemli işlerini hangi saate koyabileceğine bak.',
          parent:
            'Bu hafta çocuğunuzdan her gün enerjisinin en yüksek olduğu saati not etmesini isteyin; hafta sonunda önemli işleri hangi saate koyabileceğini konuşun.',
        },
        high: {
          student:
            'Bu hafta yapılacaklar listendeki işleri önem sırasına koy ve her gün önce en önemli işi bitir; hafta sonunda bu sıranın işine yarayıp yaramadığını yaz.',
          parent: 'Bu hafta çocuğunuzla yapılacaklar listesindeki işleri önem sırasına koyun; her gün önce en önemli işi bitirmesini destekleyin.',
        },
      },
    },
    organization: {
      color: '#2f5ce0',
      study: {
        low: {
          student:
            'Her akşam beş dakika ayırıp ertesi günün en önemli üç işini yaz. Hoşa gitmeyen bir işe ne zaman ve nerede başlayacağını önceden belirlemek (“Akşam yemeğinden sonra masamda ilk sayfayı okuyacağım.” gibi) ertelemeyi azaltabilir.',
          parent:
            'Çocuğunuzun her akşam beş dakika ayırıp ertesi günün en önemli üç işini yazması işe yarayabilir. Hoşa gitmeyen bir işe ne zaman ve nerede başlayacağını önceden belirlemesi de ertelemeyi azaltabilir.',
        },
        average: {
          student:
            'Uzun ve önemli işler için haftalık bir plan yap, kısa işleri esnek bırak. Planına öğrendiğin konulara birkaç gün sonra dönen kısa tekrarlar eklemek, düzenini en etkili yöntemlerle birleştirir.',
          parent:
            'Çocuğunuzun uzun ve önemli işler için haftalık bir plan yapması, kısa işleri esnek bırakması ve planına öğrendiği konulara birkaç gün sonra dönen kısa tekrarlar eklemesi, düzenini en etkili yöntemlerle birleştirir.',
        },
        high: {
          student:
            'Düzenin, en etkili yöntemleri düzenli kullanmanı kolaylaştırabilir: planına öğrendiğin konulara birkaç gün ve bir hafta sonra dönen kısa tekrarlar ekle. Uzun bir işi parçalara ayırıp her parçaya bir gün vermek, büyük işlerde de düzenini korumanı kolaylaştırır.',
          parent:
            'Çocuğunuzun düzeni, en etkili yöntemleri düzenli kullanmasını kolaylaştırabilir: planına öğrendiği konulara birkaç gün ve bir hafta sonra dönen kısa tekrarlar ekleyebilir. Uzun bir işi parçalara ayırıp her parçaya bir gün vermesi, büyük işlerde de düzenini korumasını kolaylaştırır.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta sık kullandığın bir eşya (örneğin anahtar ya da şarj aleti) için sabit bir yer belirle ve işin bitince onu hep oraya koy.',
          parent: 'Bu hafta çocuğunuzla sık kullandığı bir eşya için sabit bir yer belirleyin; işi bitince onu hep oraya koymasını destekleyin.',
        },
        average: {
          student: 'Bu hafta ertelediğin bir iş için ne zaman ve nerede başlayacağını yaz ve o saatte başla.',
          parent: 'Bu hafta çocuğunuzla ertelediği bir iş için ne zaman ve nerede başlayacağını belirleyin; o saatte başlamasını destekleyin.',
        },
        high: {
          student: 'Bu hafta bir işin ne kadar süreceğini önceden tahmin et, sonra gerçekte ne kadar sürdüğünü yaz ve ikisini karşılaştır.',
          parent:
            'Bu hafta çocuğunuzdan bir işin ne kadar süreceğini önceden tahmin etmesini, sonra gerçekte ne kadar sürdüğünü yazmasını isteyin; ikisini birlikte karşılaştırın.',
        },
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.rohrer, KAYNAK.gollwitzer, KAYNAK.buehler],
};
