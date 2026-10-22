import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * İyimserlik Ölçeği: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Yol haritası üç konuyla kurulur (hayata ve geleceğe bakış, kendine bakış, ruh hâli): üç sütunlu grafik, her biri için
 *    "Nasıl çalışabilirsin?" kartı ve veliye yaklaşım. Toplam puan (iyimserlik) raporda gösterilir; yol haritasında
 *    tekrarlanmaz. Ortamlar bölümü yoktur (iyimserlik bir ortam tercihi söylemez).
 *  - 2. hafta "En iyi olası gelecek": kişinin her şey yolunda giderse geleceğinin nasıl olabileceğini hayal edip yazması.
 *    29 çalışmayı birleştiren bir meta analizde bu çalışma iyimserliği öteki yöntemlerden daha çok artırmıştır (g = 0,64;
 *    bütün yöntemler g = 0,41, küçük; Malouff ve Schutte, 2017); bir başka meta analizde iyimserlik üzerindeki etkisi
 *    d = 0,33 bulunmuştur (Carrillo ve ark., 2019). Etkinin ne kadar sürdüğü belli değildir; gençlerle yapılmış çalışma
 *    azdır. Metinler bu yüzden bir sonuç vaat etmez, bir deneme önerir.
 *  - Ruh hâli düşükse 3. hafta ona ayrılır (iyi oluş haftası); değilse kendine bakış düşükse ona ("Öz-saygı nedir?"
 *    bağlantısıyla). "Sık sık kendimi hüzünlü hissederim" ya da "Kendimden hoşlanmam" cümlesine 4–5 denmişse o konu için
 *    düşük düzeyin önerileri kullanılır (lib/reports/roadmap.ts); cevapları iki uca ayrışan konuda orta düzeyinkiler. Ruh hâli düşükken öneriler, iki hafta ya da daha uzun süredir çoğu zaman keyifsizlik ve üzüntü
 *    varsa güvendiği biriyle konuşmayı ve doktora başvurmayı söyler (MedlinePlus: belirtiler çoğu zaman ve iki hafta ya da
 *    daha uzun süredir varsa doktorla konuşulmalı). Raporun kendi destek kutusu da gösterilir; bu yönlendirme bir sayfada
 *    üç kez okunmasın diye veliye yaklaşım ve rapor kartı onu tekrarlamaz (veliye yaklaşım dinlemeyi anlatır).
 *  - Rapor metinleri tekrar edilmez; tanı koyan ya da korkutan dil kullanılmaz; iyimserlik bir başarı ölçütü gibi anlatılmaz.
 *  - Yetişkin metni yalnızca öğrenci metni okula özgü olduğunda ya da güvenilecek kişi olarak yetişkinden söz ettiğinde
 *    yazılır.
 */
const dunlosky = bf.sources.find((s) => s.text.startsWith('Dunlosky'))!;

export const iyimserlikRoadmap: RoadmapTemplate = {
  version: 'iyimserlik-yol-haritasi-1',
  planningScale: 'gelecek',
  balancedNote: {
    student: 'Üç konuda da cevapların orta düzeyde; hiçbiri belirgin biçimde öne çıkmıyor.',
    parent: 'Çocuğunuzun üç konudaki cevapları da orta düzeyde; hiçbiri belirgin biçimde öne çıkmıyor.',
  },
  planningTitle: 'En iyi olası gelecek',
  wellbeing: [
    { scale: 'ruh_hali', group: 'low', link: null },
    { scale: 'kendine_bakis', group: 'low', link: { label: 'Öz-saygı nedir?', href: '/rehber/oz-saygi-nedir' } },
  ],
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Hayata, geleceğe ve kendine nasıl baktığın ve ruh hâlin, bu yöntemlere ne kadar kolay başlayıp ne kadar sürdürebileceğini etkileyebilir. Aşağıdaki öneriler buna göre yazıldı.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun hayata, geleceğe ve kendine nasıl baktığı ve ruh hâli, bu yöntemlere ne kadar kolay başlayıp ne kadar sürdürebileceğini etkileyebilir. Aşağıdaki öneriler buna göre yazıldı.',
  },
  firstWeek: {
    student:
      'Raporundaki sonucu düşün. Bu hafta geleceğe, hayata ya da kendine karamsar baktığın bir anı fark et; o an ne düşündüğünü ve sonra ne olduğunu iki üç cümleyle bir deftere yaz. Sonra o ana başka bir açıdan bak: olanları açıklayan başka bir yol var mı?',
    parent:
      'Raporu çocuğunuz isterse onunla birlikte okuyun ve ona hangi cümlelerin kendisini anlattığını sorun. Bu hafta onu yargılamadan dinlemeye odaklanın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['oz-saygi', 'duygusal-zeka-bilesenleri', 'kisiligin-10-yonu'],
  nextPurpose: {
    you: 'kendini farklı yönlerden daha ayrıntılı tanımak',
    parent: 'çocuğunuzun kendini farklı yönlerden daha ayrıntılı tanıması',
  },
  approach: {
    gelecek: {
      low: 'Geleceğiyle ilgili kaygılarını küçümsemeden dinleyin; birlikte küçük ve ulaşılabilir bir hedef seçip ilk adımı planlayın.',
      average: 'Başardığı bir işten sonra bunu nasıl başardığını konuşun; emeğiyle sonuç arasındaki bağı görmesine yardım edin.',
      high: 'Hedeflerini ilgiyle dinleyin ve onlara giden somut adımları kendisinin planlamasına alan tanıyın.',
    },
    kendine_bakis: {
      low: 'Sevginizin notlara ya da başarıya bağlı olmadığını hissettirin; onu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın.',
      average: 'Abartılı övgü yerine çabasını ve izlediği yolu somut sözlerle takdir edin.',
      high: 'Hata yaptığında sakin kalın; yanlışlarını rahatça konuşabileceği bir ortam sunun.',
    },
    ruh_hali: {
      low: 'Duygularını ciddiye alın; “Neşelen” yerine “Seni dinliyorum” demek konuşmasını kolaylaştırabilir.',
      average: 'Keyifsiz olduğu günlerde ona alan tanıyın ve isterse sizinle konuşabileceğini bilmesini sağlayın.',
      high: 'Onu neyin keyiflendirdiğini sorun ve bunlara zaman ayırmasını destekleyin.',
    },
  },
  scales: {
    gelecek: {
      color: '#d28a14',
      study: {
        low: {
          student:
            'Geleceğe karamsar baktığında, emek vermenin bir işe yaramayacağını düşünmek ve zor bir konuyu yarıda bırakmak kolaylaşabilir. Büyük hedefler yerine bir hafta içinde bitirebileceğin küçük bir hedef seç; tamamladığın her adımı işaretle. Küçük ilerlemeleri görmek, emeğinin bir karşılığı olduğunu fark etmeni kolaylaştırır.',
          parent:
            'Çocuğunuz geleceğe karamsar baktığında, emek vermenin işe yaramayacağını düşünebilir ve zor bir konuyu yarıda bırakmak ona kolay gelebilir. Büyük hedefler yerine bir hafta içinde bitirebileceği küçük bir hedef seçmesine ve tamamladığı adımları işaretlemesine yardım edin.',
        },
        average: {
          student:
            'Zorlandığın bir konuda, daha önce zorlanıp sonra başardığın bir işi hatırla ve bu konudaki bir sonraki küçük adımını yaz.',
          parent:
            'Çocuğunuz zorlandığı bir konuda, daha önce zorlanıp sonra başardığı bir işi hatırlarsa ve bir sonraki küçük adımını yazarsa işi kolaylaşabilir.',
        },
        high: {
          student:
            'Geleceğe umutla bakman, zor bir konuyla uğraşmayı sürdürmeni kolaylaştırabilir. Bu umudu somut bir planla birleştir: hedefini, ona giden adımları ve hangi gün ne yapacağını yaz. Bir şey planladığın gibi gitmezse planını güncelle; hedefinden vazgeçmen gerekmez.',
          parent:
            'Çocuğunuzun geleceğe umutla bakması, zor bir konuyla uğraşmayı sürdürmesini kolaylaştırabilir. Bu umudu somut bir planla birleştirmesini destekleyin: hedefi, ona giden adımlar ve hangi gün ne yapacağı.',
        },
      },
      action: {
        low: {
          student:
            'Bu hafta iki gün 15 dakika ayır: her şey yolunda giderse bir yıl sonra hayatının nasıl olabileceğini hayal et ve yaz. Sonra bu geleceğe götürecek ilk küçük adımı seç ve bu hafta at.',
          parent:
            'Bu hafta çocuğunuza her şey yolunda giderse bir yıl sonra hayatının nasıl olabileceğini hayal edip yazmasını önerin; ardından birlikte bu hafta atabileceği ilk küçük adımı seçin.',
        },
        average: {
          student:
            'Bu hafta bir gün 15 dakika ayır: her şey yolunda giderse beş yıl sonra nasıl bir hayatın olabileceğini yaz. Ardından bu hafta atabileceğin bir adımı seç.',
          parent:
            'Bu hafta çocuğunuza her şey yolunda giderse beş yıl sonra nasıl bir hayatı olabileceğini yazmasını önerin; isterse yazdıklarını sizinle paylaşsın.',
        },
        high: {
          student:
            'Bu hafta bir hedefin için en iyi olası sonucu yaz; sonra yolda karşına çıkabilecek bir engeli ve onu nasıl aşacağını da ekle.',
          parent:
            'Bu hafta çocuğunuza bir hedefi için en iyi olası sonucu yazmasını önerin; ardından “Yolda ne engel çıkabilir, o zaman ne yaparsın?” sorusunu birlikte konuşun.',
        },
      },
    },
    kendine_bakis: {
      color: '#df4777',
      study: {
        low: {
          student:
            'Kendinden hoşlanmadığında, yaptığın bir yanlışı kendine karşı bir kanıt gibi görmek kolaylaşabilir. Çalışırken yanlış yaptığında, aynı durumdaki bir arkadaşına ne söyleyeceğini düşün ve kendine de öyle seslen. İlerlemeni başkalarıyla değil, kendi geçen haftanla karşılaştır.',
          parent:
            'Çocuğunuz kendinden hoşlanmadığı zamanlarda, yaptığı bir yanlışı kendine karşı bir kanıt gibi görebilir. Yanlışlarını öğrenmenin bir parçası olarak görmesine yardım edin; ilerlemesini başkalarıyla değil, kendi geçen haftasıyla karşılaştırın.',
        },
        average: {
          student:
            'Kendine bakışın duruma göre değişebilir. Zorlandığın günlerde, iyi yaptığın bir işi ve onu nasıl yaptığını hatırlamak çalışmaya devam etmeni kolaylaştırabilir.',
          parent:
            'Çocuğunuzun kendine bakışı duruma göre değişebilir. Zorlandığı günlerde iyi yaptığı bir işi ve onu nasıl yaptığını hatırlatmak çalışmayı sürdürmesini kolaylaştırabilir.',
        },
        high: {
          student:
            'Kendine olumlu bakman, yanlışlarını öğrenmenin bir parçası olarak görmeni kolaylaştırabilir. Biraz zorlayan sorular seç; yanlış yaptığında neyin eksik olduğunu not et ve o konuya geri dön.',
          parent:
            'Çocuğunuzun kendine olumlu bakması, yanlışlarını öğrenmenin bir parçası olarak görmesini kolaylaştırabilir. Biraz zorlayan işler seçmesini destekleyin.',
        },
      },
      action: {
        low: {
          student:
            'Bu hafta her akşam o gün iyi yaptığın ya da emek verdiğin küçük bir şeyi yaz; hafta sonunda listenin tamamına bir kez daha bak.',
          parent:
            'Bu hafta çocuğunuz kendisi hakkında olumsuz konuştuğunda hemen itiraz etmeden önce dinleyin ve “Bugün kendini böyle hissetmene ne sebep oldu?” diye sorun.',
        },
        average: {
          student: 'Bu hafta her gün kendinde sevdiğin bir özelliği ve onu gösterdiğin bir anı yaz.',
          parent: 'Bu hafta çocuğunuzun gösterdiği bir iyi özelliği, gördüğünüz anı anlatarak ona söyleyin.',
        },
        high: {
          student: 'Bu hafta biraz zorlayacağını bildiğin yeni bir şey dene; sonunda neyi iyi yaptığını ve neyi farklı yapacağını yaz.',
          parent: 'Bu hafta çocuğunuzun zor bir işe girişmesine fırsat verin; sonunda neyi farklı yapacağını birlikte konuşun.',
        },
      },
    },
    ruh_hali: {
      color: '#0e9c8c',
      study: {
        low: {
          student:
            'Keyifsiz ve hüzünlü günlerde çalışmaya başlamak ve odaklanmak zor gelebilir. Çalışmayı kısa bölümlere ayır (ör. 20 dakika çalışıp kısa bir ara ver) ve küçük bir bölümü bitirmeyi bile bir adım say.',
          parent:
            'Keyifsiz ve hüzünlü günlerde çocuğunuza çalışmaya başlamak ve odaklanmak zor gelebilir. Çalışmayı kısa bölümlere ayırmasına izin verin; küçük bir bölümü bitirmesini de takdir edin.',
        },
        average: {
          student:
            'Keyifsiz olduğun günlerde zor bir konu yerine kısa bir tekrarla başlamak, çalışmaya geçmeni kolaylaştırabilir; zor konuyu kendini daha iyi hissettiğin bir saate bırak.',
          parent:
            'Keyifsiz olduğu günlerde çocuğunuzun zor bir konu yerine kısa bir tekrarla başlaması, çalışmaya geçmesini kolaylaştırabilir.',
        },
        high: {
          student:
            'Çoğunlukla keyifli olman çalışmaya başlamayı kolaylaştırabilir. Kendini en iyi hissettiğin saatleri en çok zorlandığın konuya ayır.',
          parent:
            'Çocuğunuzun çoğunlukla keyifli olması çalışmaya başlamasını kolaylaştırabilir. Kendini en iyi hissettiği saatleri en çok zorlandığı konuya ayırmasını önerebilirsiniz.',
        },
      },
      action: {
        low: {
          student:
            'Bu hafta her gün seni biraz iyi hissettiren küçük bir şey planla (kısa bir yürüyüş, sevdiğin biriyle konuşmak, müzik dinlemek) ve yaptıktan sonra nasıl hissettiğini 1’den 10’a kadar not et. İki hafta ya da daha uzun süredir çoğu zaman hüzünlü ya da keyifsizsen bunu ailene ya da güvendiğin bir yetişkine anlat; birlikte bir doktora başvurmak iyi olur.',
          parent:
            'Bu hafta çocuğunuzla birlikte yapabileceğiniz, onu biraz iyi hissettiren küçük bir şey planlayın (ör. kısa bir yürüyüş). İki hafta ya da daha uzun süredir çoğu zaman keyifsiz ya da hüzünlüyse aile hekiminizle ya da bir uzmanla görüşün.',
          adult:
            'Bu hafta her gün seni biraz iyi hissettiren küçük bir şey planla (kısa bir yürüyüş, sevdiğin biriyle konuşmak, müzik dinlemek) ve yaptıktan sonra nasıl hissettiğini 1’den 10’a kadar not et. İki hafta ya da daha uzun süredir çoğu zaman hüzünlü ya da keyifsizsen bunu güvendiğin biriyle paylaş ve aile hekimine başvur.',
        },
        average: {
          student: 'Bu hafta keyifsiz olduğun bir anda ne olduğunu ve sana neyin iyi geldiğini kısaca yaz; hafta sonunda sana iyi gelenleri gözden geçir.',
          parent: 'Bu hafta çocuğunuz keyifsiz olduğunda ona neyin iyi geldiğini fark etmeye çalışın; hafta sonunda bunu onunla konuşun.',
        },
        high: {
          student: 'Bu hafta seni keyiflendiren şeylerden birini, buna ihtiyacı olabilecek biriyle paylaş (ör. birlikte yürüyüşe çıkmak).',
          parent: 'Bu hafta çocuğunuzun keyif aldığı bir şeye siz de katılın.',
        },
      },
    },
  },
  sources: [
    dunlosky,
    {
      text: 'Malouff, J. M. ve Schutte, N. S. (2017). Can psychological interventions increase optimism? A meta-analysis. The Journal of Positive Psychology, 12(6), 594–604.',
      url: 'https://doi.org/10.1080/17439760.2016.1221122',
    },
    {
      text: 'Carrillo, A., Rubio-Aparicio, M., Molinari, G., Enrique, Á., Sánchez-Meca, J. ve Baños, R. M. (2019). Effects of the Best Possible Self intervention: A systematic review and meta-analysis. PLoS ONE, 14(9), e0222386.',
      url: 'https://doi.org/10.1371/journal.pone.0222386',
    },
    {
      text: 'MedlinePlus. (2024). Recognizing teen depression. U.S. National Library of Medicine.',
      url: 'https://medlineplus.gov/ency/patientinstructions/000648.htm',
    },
  ],
};
