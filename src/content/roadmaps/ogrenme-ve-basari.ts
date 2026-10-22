import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Öğrenme ve Başarı Özellikleri: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak,
 *    karışık çalışmak, "Bu neden böyle?" diye sorup kendine açıklamak; Dunlosky ve ark., 2013; Rohrer, Dedrick ve
 *    Stershic, 2015). Her özellik için bu yöntemleri kullanmayı ve çalışmayı sürdürmeyi kolaylaştıran küçük bir sonraki
 *    adım önerilir. Erteleme önerileri, ertelemenin en tutarlı ilişkili olduğu etkenlere (işin hoşa gitmemesi, kendine
 *    güven, dikkat dağıtıcılar) dayanır (Steel, 2007). Kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
 *  - Metinler raporun kendi metinlerini (aynı sayfada okunurlar) ve birbirini tekrar etmez.
 *  - Özellikler meslek ortamı anlatmadığı için ortamlar bölümü yoktur.
 *  - 2. hafta "Çalışma düzeni" (Planlı ve dikkatli çalışma); 3. hafta en düşük puanlı özellik: en çok geliştirilebilecek
 *    olan.
 *  - Test yetişkinlere de açıktır: öğrenci metinleri okula özgü sözcük içermez ("kitap" yerine "kaynak"), yetişkine de
 *    gösterilir.
 */
export const ogrenmeVeBasariRoadmap: RoadmapTemplate = {
  version: 'ogrenme-ve-basari-yol-haritasi-1',
  unit: { one: 'özellik', toPlural: 'özelliklere' },
  planningScale: 'planfulness',
  thirdWeek: 'lowest',
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Aşağıda her özelliğin için bu yöntemleri kullanmayı ve çalışmayı sürdürmeyi kolaylaştırabilecek yollar var; hepsini birden değil, birer birer dene.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Aşağıda çocuğunuzun her özelliği için bu yöntemleri kullanmayı ve çalışmayı sürdürmeyi kolaylaştırabilecek yollar var; hepsini birden değil, birer birer denemesine destek olun.',
  },
  firstWeek: {
    student: 'Raporundaki altı özelliğe bak. Bu hafta her gün, çalışırken bunlardan hangisinin işine yaradığını ve hangisinin seni zorladığını bir cümleyle yaz.',
    parent: bf.firstWeek.parent,
  },
  lastWeek: bf.lastWeek,
  nextTests: ['calisma-aliskanliklari'],
  nextPurpose: { you: 'hangi çalışma yöntemlerini kullandığını görmek', parent: 'çocuğunuzun hangi çalışma yöntemlerini kullandığını görmek' },
  approach: {
    diligence: {
      low: 'Yarım bırakmadan bitirdiği işleri, küçük de olsa, fark edip ona söyleyin.',
      average: 'Çaba gösterdiği işlerde onu neyin istekli kıldığını birlikte konuşun.',
      high: 'Çabasını takdir edin; dinlenmenin de başarının bir parçası olduğunu hatırlatın.',
    },
    initiative: {
      low: 'Ertelediği için eleştirmek yerine, başlamak için ilk küçük adımı birlikte bulun.',
      average: 'Hoşuna gitmeyen bir işe kendiliğinden başladığı anlarda bunu ona belirtin.',
      high: 'Ertelemeden başlamasının ona kazandırdığı zamanı birlikte fark edin; işi bitirince bir kez gözden geçirmesini nazikçe hatırlatın.',
    },
    planfulness: {
      low: 'Son dakikaya kalan işler için onu suçlamak yerine, bir takvimi birlikte kullanmayı önerin.',
      average: 'Plan yaptığı ve planına uyduğu günlerin nasıl geçtiğini onunla konuşun.',
      high: 'Planların bozulabileceğini, esnek olabilmenin de önemli olduğunu hatırlatın.',
    },
    competence: {
      low: 'Zorlandığında hemen çözümü vermek yerine, ilk adımı kendisinin bulmasına fırsat verin.',
      average: 'Zor bir işe giriştiğinde sonuçtan çok denemesini övün.',
      high: 'Zor işleri üstlenmesini destekleyin; zorlandığı anların da öğrenmenin bir parçası olduğunu söyleyin.',
    },
    need_for_cognition: {
      low: 'Merak ettiği soruları ciddiye alın; “Bilmiyorum, birlikte bakalım” demekten çekinmeyin.',
      average: 'İlgisini çeken konularda sorduğu soruları dinlemeye zaman ayırın.',
      high: 'Fikirlerini dinleyin; onunla zor bir konuyu konuşmaktan keyif aldığınızı gösterin.',
    },
    openness: {
      low: 'Yeni şeyleri zorlayarak değil, ilgisini çekebilecek küçük denemelerle tanıştırın.',
      average: 'Daha önce yapmadığı bir şeyi yaptığında ondan ne öğrendiğini merakla sorun.',
      high: 'İlgi alanlarını destekleyin; bir konuyu derinleştirmesi için ona zaman ve kaynak sağlayın.',
    },
  },
  scales: {
    diligence: {
      color: '#2f5ce0',
      study: {
        low: {
          student:
            'Uzun bir çalışmayı kısa ve net bölümlere ayır: örneğin 25 dakika çalışıp 5 dakika ara ver. İş zorlaştığında bırakmak yerine kendine “Şimdi atabileceğim en küçük adım ne?” diye sor ve yalnızca o adımı at.',
          parent:
            'Çocuğunuzun uzun bir çalışmayı kısa ve net bölümlere ayırması (örneğin 25 dakika çalışıp 5 dakika ara vermesi) devam etmesini kolaylaştırabilir. İş zorlaştığında bırakmak yerine atabileceği en küçük adımı birlikte bulabilirsiniz.',
        },
        average: {
          student:
            'En çok çaba gerektiren işlerini belirle ve onlara günün en dinç saatini ayır. İlgini çekmeyen bir işi sevdiğin bir işle sıraya koymak (önce zor olan, sonra sevdiğin) çabanı dengelemene yardım edebilir.',
          parent:
            'Çocuğunuzun en çok çaba gerektiren işlere günün en dinç saatini ayırması ve ilgisini çekmeyen bir işi sevdiği bir işle sıralaması (önce zor olan, sonra sevdiği), çabasını dengelemesine yardım edebilir.',
        },
        high: {
          student:
            'Çaban güçlü bir dayanak; onu en etkili yöntemlerle birleştir: çalıştığın bir konuyu kaynağa bakmadan hatırlamaya çalış ve tekrarlarını günlere yay. Çok çalıştığın dönemlerde uyku ve dinlenme zamanlarını da planına yaz.',
          parent:
            'Çocuğunuzun güçlü çabası, en etkili yöntemlerle birleştiğinde daha verimli olabilir: çalıştığı konuyu kaynağa bakmadan hatırlamaya çalışması ve tekrarları günlere yayması. Çok çalıştığı dönemlerde uyku ve dinlenme zamanlarının da plana yazılmasını destekleyin.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her akşam, o gün yarım bırakmadan bitirdiğin bir işi ve onu bitirmene neyin yardım ettiğini bir cümleyle yaz; hafta sonunda listene bak.',
          parent: 'Bu hafta çocuğunuza her akşam, o gün yarım bırakmadan bitirdiği bir işi ve ona neyin yardım ettiğini bir cümleyle yazmasını önerin; hafta sonunda listeye birlikte bakın.',
        },
        average: {
          student: 'Bu hafta her gün en çok çaba gerektiren işini günün ilk çalışma saatine koy ve bitirince nasıl hissettiğini bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzdan en çok çaba gerektiren işini günün ilk çalışma saatine koymasını isteyin; akşam nasıl geçtiğini kısaca konuşun.',
        },
        high: {
          student: 'Bu hafta çalışma planına her gün iki kısa mola ve haftada bir tam dinlenme günü ekle; hafta sonunda enerjinin nasıl olduğunu bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzun çalışma planına her gün kısa molalar ve haftada bir tam dinlenme günü eklemesini destekleyin; hafta sonunda nasıl hissettiğini konuşun.',
        },
      },
    },
    initiative: {
      color: '#0e9c8c',
      study: {
        low: {
          student:
            'Başlamayı kolaylaştır: bir işin ilk adımını çok küçük ve belirli seç (örneğin ilk paragrafı okumak ya da ilk cümleyi yazmak) ve ne zaman başlayacağını önceden bir kâğıda yaz. Belirli bir saate bağlanmış küçük bir ilk adım, “Bir ara başlarım” demekten daha kolay hayata geçebilir.',
          parent:
            'Çocuğunuzun bir işin ilk adımını çok küçük ve belirli seçmesi (örneğin ilk paragrafı okumak ya da ilk cümleyi yazmak) ve ne zaman başlayacağını önceden yazması başlamayı kolaylaştırabilir.',
        },
        average: {
          student:
            'Hangi işlerin hep sona kaldığını fark et. Hoşuna gitmeyen bir işi günün başına koymak ve bitirince kendine küçük bir ödül vermek, ertelemeyi azaltabilir.',
          parent:
            'Çocuğunuzla hangi işlerin hep sona kaldığını birlikte fark edin. Hoşuna gitmeyen bir işi günün başına koyması ve bitirince küçük bir ödülle kutlaması ertelemeyi azaltabilir.',
        },
        high: {
          student:
            'Ertelemeden başlaman büyük bir avantaj. Büyük işlerde bu hızlı başlangıcı kısa bir planla birleştir: işin her bölümüne yeterli zaman ayırmak, sonlara doğru acele etmeni önleyebilir.',
          parent:
            'Çocuğunuzun ertelemeden başlaması büyük bir avantaj. Büyük işlerde bu hızlı başlangıcı kısa bir planla birleştirmesi, işin her bölümüne yeterli zaman ayırmasını ve sonlara doğru acele etmemesini sağlayabilir.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her gün ertelediğin bir işe yalnızca beş dakika ayır; beş dakika dolunca istersen bırak, istersen devam et ve hangisini seçtiğini not et.',
          parent: 'Bu hafta çocuğunuzla ertelediği bir iş için her gün beş dakikalık bir başlama zamanı belirleyin; beş dakika dolunca devam edip etmemeyi ona bırakın.',
        },
        average: {
          student: 'Bu hafta her sabah, o gün ertelemek isteyeceğin bir işi seç ve onu günün ilk işi yap.',
          parent: 'Bu hafta çocuğunuzla her sabah ertelemek isteyeceği bir işi seçin ve onu günün ilk işi yapmasını önerin.',
        },
        high: {
          student: 'Bu hafta bitirdiğin her işten sonra iki dakika ayırıp kısa bir kontrol yap ve kaç hatayı yakaladığını say.',
          parent: 'Bu hafta çocuğunuzdan bitirdiği her işten sonra kısa bir kontrol yapmasını ve kaç hatayı yakaladığını saymasını isteyin.',
        },
      },
    },
    planfulness: {
      color: '#7a4ee6',
      study: {
        low: {
          student:
            'Planı küçük tut: her akşam beş dakika ayırıp ertesi günün en önemli üç işini yaz ve ertesi akşam hangilerini yaptığına bak. Küçük bir günlük planla başlamak, planlamayı alışkanlığa çevirmeyi kolaylaştırabilir.',
          parent:
            'Çocuğunuzun her akşam beş dakika ayırıp ertesi günün en önemli üç işini yazması ve ertesi akşam hangilerini yaptığına bakması, planlamayı alışkanlığa çevirmesini kolaylaştırabilir.',
        },
        average: {
          student:
            'Uzun ve önemli işler için haftalık bir plan yap; kısa ve kolay işleri esnek bırak. Hafta sonunda planladıklarının ne kadarını yaptığına kısaca bakmak, planını gerçekçi tutmana yardım edebilir.',
          parent:
            'Çocuğunuzun uzun ve önemli işler için haftalık bir plan yapması, kısa işleri esnek bırakması ve hafta sonunda planının ne kadarını yaptığına bakması, planını gerçekçi tutmasına yardım edebilir.',
        },
        high: {
          student:
            'Planlı çalışmanı en etkili yöntemlerle güçlendir: öğrendiğin konulara birkaç gün ve bir hafta sonra dönen kısa tekrarları planına ekle. Planına boş zaman da bırakmak, beklenmedik bir şey olduğunda planının bozulmasını önleyebilir.',
          parent:
            'Çocuğunuzun planına, öğrendiği konulara birkaç gün ve bir hafta sonra dönen kısa tekrarlar eklemesi ve boş zaman bırakması, planlı çalışmasını daha da verimli kılabilir.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta yaklaşan bir işi seç; onu üç parçaya böl, her parçaya bir gün ver ve o günün parçasını bitirdiğinde işaretle.',
          parent: 'Bu hafta çocuğunuzla yaklaşan bir işi üç parçaya bölüp her parçaya bir gün verin; planı onun yapmasına fırsat verin.',
        },
        average: {
          student: 'Bu hafta yaklaşan uzun bir işin tarihini takvimine yaz ve o güne kadar hangi gün neyi yapacağını geriye doğru planla.',
          parent: 'Bu hafta çocuğunuzla yaklaşan uzun bir işin tarihini takvime yazın ve o güne kadar hangi gün neyi yapacağını birlikte planlayın.',
        },
        high: {
          student: 'Bu hafta planına, geçen hafta öğrendiğin iki konu için 10’ar dakikalık tekrarlar ekle ve bir akşamı tamamen boş bırak.',
          parent: 'Bu hafta çocuğunuzdan planına geçen hafta öğrendiği konular için kısa tekrarlar eklemesini ve bir akşamı boş bırakmasını isteyin.',
        },
      },
    },
    competence: {
      color: '#ee6a36',
      study: {
        low: {
          student:
            'Zor bir işe, yapabileceğinden emin olduğun kolay bir adımla başla ve zorluğu adım adım artır. Takıldığında “Bunu yapamam” yerine “Bunu henüz yapamıyorum; ilk adımım ne olabilir?” diye sor.',
          parent:
            'Çocuğunuzun zor bir işe emin olduğu kolay bir adımla başlaması ve zorluğu adım adım artırması, kendine güvenini destekleyebilir. Takıldığında “İlk adımın ne olabilir?” diye sormak, pes etmek yerine devam etmesine yardım edebilir.',
        },
        average: {
          student:
            'Emin olmadığın bir işte takıldığın yerde birine sor. Zorlandığın bir işte neyin işe yaradığını not etmek, bir sonraki zorlukta sana yol gösterebilir.',
          parent:
            'Çocuğunuzun emin olmadığı bir işte takıldığında yardım istemesi ve zorlandığı bir işte neyin işe yaradığını not etmesi, bir sonraki zorlukta ona yol gösterebilir.',
        },
        high: {
          student:
            'Zorluklara duyduğun güveni kendini dürüstçe sınayarak destekle: bir konuyu bildiğini düşündüğünde onu birine anlatmayı dene; anlatamadığın yer, çalışman gereken yeri gösterebilir.',
          parent:
            'Çocuğunuzun kendine güveni, kendini dürüstçe sınamasıyla desteklenebilir: bir konuyu bildiğini düşündüğünde onu size anlatmasını isteyin; anlatamadığı yer, çalışması gereken yeri gösterebilir.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her gün seni biraz zorlayan küçük bir iş seç (örneğin zor bir soru, yeni bir tarif ya da kısa bir yazı) ve bitirdiğinde neyi nasıl başardığını bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla onu biraz zorlayan küçük bir iş seçin; bitirdiğinde neyi nasıl başardığını ona sorun.',
        },
        average: {
          student: 'Bu hafta genellikle kaçındığın türden zor bir görevi seç ve onu bitirene kadar sürdür; bitince neyin işe yaradığını yaz.',
          parent: 'Bu hafta çocuğunuzdan genellikle kaçındığı türden zor bir görevi seçmesini ve onu bitirene kadar sürdürmesini isteyin.',
        },
        high: {
          student: 'Bu hafta daha önce denemediğin ve seni biraz zorlayacak bir görevi üstlen; bitince neyi yeni öğrendiğini yaz.',
          parent: 'Bu hafta çocuğunuzu daha önce denemediği ve onu biraz zorlayacak bir görevi üstlenmeye cesaretlendirin.',
        },
      },
    },
    need_for_cognition: {
      color: '#df4777',
      study: {
        low: {
          student:
            'Zor bir metni ya da problemi bir kerede değil, bölüm bölüm ele al; her bölümden sonra kaynağı kapatıp aklında kalanları bir iki cümleyle söyle. Anlamadığın bir yeri birine sormak ya da başka bir kaynaktan bakmak da işini kolaylaştırabilir.',
          parent:
            'Çocuğunuzun zor bir metni ya da problemi bölüm bölüm ele alması ve her bölümden sonra kaynağı kapatıp aklında kalanları bir iki cümleyle söylemesi, kafa yormayı kolaylaştırabilir. Anlamadığı yeri sorması da bu sürecin doğal bir parçasıdır.',
        },
        average: {
          student:
            'Çalıştığın bir konuyu ilgini çeken bir şeyle ilişkilendir. Bir bilgiyi öğrenirken “Bu neden böyle?” diye sormak ve cevabını kendine açıklamak, öğrendiklerini daha kalıcı hâle getirebilir.',
          parent:
            'Çocuğunuzun çalıştığı bir konuyu ilgisini çeken bir şeyle ilişkilendirmesi ve öğrenirken “Bu neden böyle?” diye sorup cevabını kendine açıklaması, öğrendiklerini daha kalıcı hâle getirebilir.',
        },
        high: {
          student:
            'Düşünmekten hoşlanman, zor konuları derinlemesine öğrenmeni kolaylaştırabilir. Bu isteği, öğrendiğin bir konuyu farklı örnekler üzerinde deneyerek ve birkaç gün sonra yeniden hatırlamaya çalışarak destekle; üzerine zevkle düşündüğün bir konuyu da tekrar etmezsen unutabilirsin.',
          parent:
            'Çocuğunuzun düşünmekten hoşlanması, zor konuları derinlemesine öğrenmesini kolaylaştırabilir. Öğrendiği bir konuyu farklı örnekler üzerinde denemesi ve birkaç gün sonra yeniden hatırlamaya çalışması bu isteği daha verimli kılabilir.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her gün merak ettiğin bir “neden” sorusu yaz (örneğin “Gökyüzü neden mavi?”); cevabını bulup bir cümleyle açıkla.',
          parent: 'Bu hafta çocuğunuzla her gün merak ettiğiniz bir “neden” sorusu seçin ve cevabını birlikte bulun.',
        },
        average: {
          student: 'Bu hafta öğrendiğin iki konuda kendine “Bu neden böyle?” diye sor ve cevabını birine anlat.',
          parent: 'Bu hafta çocuğunuzdan öğrendiği bir konuyu size “neden”leriyle anlatmasını isteyin.',
        },
        high: {
          student: 'Bu hafta seni zorlayan, çözümü birkaç adım süren bir problem ya da bulmaca seç ve çözüm yolunu adım adım yaz.',
          parent: 'Bu hafta çocuğunuzla birkaç adımda çözülen bir problem ya da bulmaca seçin; çözüm yolunu size anlatmasını isteyin.',
        },
      },
    },
    openness: {
      color: '#d28a14',
      study: {
        low: {
          student:
            'Yeni bir konuya, bildiğin bir şeyle bağ kurarak başla: “Bu, bildiğim hangi şeye benziyor?” diye sor. Yeni bir şeyi küçük bir denemeyle tanımak (kısa bir video ya da bir sayfalık bir yazı) onu daha az yabancı kılabilir.',
          parent:
            'Çocuğunuzun yeni bir konuya bildiği bir şeyle bağ kurarak başlaması (“Bu neye benziyor?”) ve yeni bir şeyi küçük bir denemeyle tanıması, ona daha az yabancı gelmesini sağlayabilir.',
        },
        average: {
          student:
            'Merakını çalışmana taşı: çalıştığın konuyla ilgili sana ilginç gelen bir soruyu not et ve haftada bir cevabını araştır. Bir konudaki farklı türden problemleri karışık sırayla çözmek de hem çeşitlilik sağlar hem de onları birbirinden ayırt etmeni kolaylaştırabilir.',
          parent:
            'Çocuğunuzun çalıştığı konuyla ilgili ilginç bulduğu bir soruyu not edip haftada bir cevabını araştırması ve bir konudaki farklı türden problemleri karışık sırayla çözmesi, merakını öğrenmesine taşıyabilir.',
        },
        high: {
          student:
            'Pek çok şeye ilgi duyman güçlü bir başlangıç; öğrenmeyi derinleştirmek için ilgini çeken konulardan birini seç ve bir süre ona odaklan. Yeni öğrendiğin bilgileri daha önce bildiklerinle bağlamak, onları daha kalıcı hâle getirebilir.',
          parent:
            'Çocuğunuzun ilgi duyduğu pek çok konudan birini seçip bir süre ona odaklanması ve yeni öğrendiklerini önceki bilgileriyle bağlaması, öğrenmesini derinleştirebilir.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta daha önce hiç denemediğin küçük bir şey yap (yeni bir yemek, farklı bir yol ya da bilmediğin bir konuda kısa bir video) ve ne öğrendiğini bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla daha önce denemediğiniz küçük bir şey yapın (yeni bir yemek tarifi, bir müze gezisi ya da bilmediğiniz bir konuda kısa bir belgesel) ve ne öğrendiğini konuşun.',
        },
        average: {
          student: 'Bu hafta her gün merak ettiğin bir şeyi araştırmaya 10 dakika ayır ve bulduğun en ilginç bilgiyi birine anlat.',
          parent: 'Bu hafta çocuğunuzun her gün merak ettiği bir şeyi araştırmaya kısa bir zaman ayırmasını destekleyin; bulduğu en ilginç bilgiyi size anlatsın.',
        },
        high: {
          student: 'Bu hafta ilgini çeken konulardan birini seç ve her gün 15 dakika onu derinleştir; hafta sonunda öğrendiğin en ilginç üç şeyi yaz.',
          parent: 'Bu hafta çocuğunuzun ilgi duyduğu bir konuyu seçip her gün kısa bir süre onu derinleştirmesini destekleyin; hafta sonunda öğrendiklerini size anlatsın.',
        },
      },
    },
  },
  sources: [
    KAYNAK.dunlosky,
    KAYNAK.rohrer,
    {
      text: 'Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. Psychological Bulletin, 133(1), 65–94.',
      url: 'https://doi.org/10.1037/0033-2909.133.1.65',
    },
  ],
};
