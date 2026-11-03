import type { SurveyDaily } from './types';

/**
 * Çalışma Değerleri: günlük hayatta nasıl görünür (7. sınıftan mezuna ve yetişkinlere). Ton: özellik (değer; iki uç da eşit;
 * lib/reports/daily-parts.ts). Maddeler bir işte bir şeyin ne kadar önemli olduğunu sorar (src/content/instruments/
 * calisma-degerleri.ts; ters madde yok). Örnekler bir işi seçerken ya da yaparken neyin önemli gelebileceğini anlatır;
 * öğrencide okul projesi, grup ve kulüp işleri, ödev ve meslekler konuşulurken, yetişkinde iş ya da günlük işler. Hiçbir değer
 * ötekinden üstün anlatılmaz; düşük önem bir eksiklik değildir ("Bu, öğrenmeyi sevmediğin anlamına gelmez", rapor metni).
 * Para, kurs ya da iş sahibi olmak varsayılmaz: kazanç ve güvence örnekleri meslekler konuşulurken ya da bir işi
 * değerlendirirken görünür. Yüksek ucun yumuşak zorluğu maddenin kendisinden gelir (ör. B2 "Birinin sürekli başımda
 * durmaması" → birinin başında durması canını sıkabilir); kazançta ve güvencede şablondaki karşıt değerlerden (iç değerler
 * ile kazanç, güvence ile belirsiz fırsat; src/content/reports/calisma-degerleri.ts). Yaşam dengesinde düşük ucun zorluğu
 * şablonun "dinlenmeye zaman ayırmak herkes için önemlidir" cümlesinden gelir. Her satırın dayandığı maddeler `from`'dadır.
 */
export const calismaDegerleriDaily: SurveyDaily = {
  kind: 'survey',
  version: 'calisma-degerleri-gunluk-1',
  scales: {
    /* İlgi ve öğrenme: L1 işi ilginç bulmak, L2 sürekli yeni şeyler öğrenmek, L3 tekdüze değil çeşitli işler, L4 merak edilen
       konular üzerinde çalışmak. */
    learning: {
      poles: { low: 'İlginçlik öncelik değil', high: 'İlginç, öğretici iş arar' },
      bands: {
        low: {
          from: { school: ['L1'], friends: ['L2'], home: ['L3'], work: ['L4'] },
          student: {
            school: 'Bir proje konusu seçerken konunun ilginç olmasından çok başka şeylere bakabilirsin.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin sürekli yeni şeyler öğretmesi sana öncelikli gelmeyebilir.',
            home: 'Hep aynı biçimde yapılan bir iş seni pek sıkmayabilir.',
          },
          parent: {
            school: 'Bir proje konusu seçerken çocuğunuz konunun ilginç olmasından çok başka şeylere bakabilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken bir işin sürekli yeni şeyler öğretmesi ona öncelikli gelmeyebilir.',
            home: 'Hep aynı biçimde yapılan bir iş onu pek sıkmayabilir.',
          },
          adult: {
            work: 'Bir işin merak ettiğin konularla ilgili olması senin için öncelikli olmayabilir.',
          },
        },
        average: {
          from: { school: ['L1'], friends: ['L2'], home: ['L3'], work: ['L4'] },
          student: {
            school: 'Bir proje konusunun ilginç olması bazen sana önemli gelebilir, bazen başka şeylere bakabilirsin.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin yeni şeyler öğretmesi bazen önemli gelebilir, bazen gelmeyebilir.',
            home: 'Aynı işi tekrar tekrar yapmak bazen seni sıkabilir, bazen sana rahat gelebilir.',
          },
          parent: {
            school: 'Bir proje konusunun ilginç olması bazen çocuğunuza önemli gelebilir, bazen başka şeylere bakabilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken bir işin yeni şeyler öğretmesi bazen önemli gelebilir, bazen gelmeyebilir.',
            home: 'Aynı işi tekrar tekrar yapmak bazen onu sıkabilir, bazen ona rahat gelebilir.',
          },
          adult: {
            work: 'Merak ettiğin konularda çalışmak bazen senin için önemli olabilir, bazen başka koşullar ağır basabilir.',
          },
        },
        high: {
          from: { school: ['L4', 'L2'], friends: ['L1', 'L3'], home: ['L3'], work: ['L2', 'L4'] },
          student: {
            school: 'Bir proje konusu seçerken merak ettiğin ve sana yeni şeyler öğretecek bir konuyu seçmek isteyebilirsin.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin ilginç ve çeşitli olup olmadığını merak edebilirsin.',
            home: 'Hep aynı biçimde yapılan bir iş seni çabuk sıkabilir.',
          },
          parent: {
            school: 'Bir proje konusu seçerken merak ettiği ve ona yeni şeyler öğretecek bir konuyu seçmek isteyebilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken çocuğunuz bir işin ilginç ve çeşitli olup olmadığını merak edebilir.',
            home: 'Hep aynı biçimde yapılan bir iş onu çabuk sıkabilir.',
          },
          adult: {
            work: 'Bir işte sürekli yeni şeyler öğrenmek ve merak ettiğin konularla uğraşmak senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Kazanç: K1 iyi para kazanmak, K2 emeğe değecek ücret, K3 kazançla rahat bir hayat, K4 gelirin zamanla artması. */
    income: {
      poles: { low: 'Kazanç öncelik değil', high: 'İyi kazanmayı önemser' },
      bands: {
        low: {
          from: { school: ['K1'], friends: ['K3'], home: ['K1', 'K3'], work: ['K4'] },
          student: {
            school: 'Bir meslek tanıtılırken o işin ne kadar kazandırdığı senin için ilk sırada olmayabilir.',
            friends: 'Arkadaşlarınla geleceği konuşurken rahat bir hayat yerine yapacağın işin kendisini düşünebilirsin.',
            home: 'Az kazandıran ama sana uyan bir işi seçmekte zorlanmayabilirsin.',
          },
          parent: {
            school: 'Bir meslek tanıtılırken o işin ne kadar kazandırdığı çocuğunuz için ilk sırada olmayabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken rahat bir hayat yerine yapacağı işin kendisini düşünebilir.',
            home: 'Az kazandıran ama ona uyan bir işi seçmekte zorlanmayabilir.',
          },
          adult: {
            work: 'Bir işi değerlendirirken gelirin zamanla artması senin için öncelikli olmayabilir.',
          },
        },
        average: {
          from: { school: ['K1'], friends: ['K3'], home: ['K2'], work: ['K2'] },
          student: {
            school: 'Bir meslek tanıtılırken o işin gelirini bazen merak edebilir, bazen başka yönlerine bakabilirsin.',
            friends: 'Arkadaşlarınla geleceği konuşurken rahat bir hayat bazen aklına gelebilir, bazen başka hayaller öne çıkabilir.',
            home: 'Yakınlarınla meslekleri konuşurken emeğe değecek bir ücret bazen sana önemli gelebilir, bazen gelmeyebilir.',
          },
          parent: {
            school: 'Bir meslek tanıtılırken çocuğunuz o işin gelirini bazen merak edebilir, bazen başka yönlerine bakabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken rahat bir hayat bazen aklına gelebilir, bazen başka hayaller öne çıkabilir.',
            home: 'Yakınlarıyla meslekleri konuşurken emeğe değecek bir ücret bazen ona önemli gelebilir, bazen gelmeyebilir.',
          },
          adult: {
            work: 'Bir işte ücret bazen senin için belirleyici olabilir, bazen işin başka yönleri ağır basabilir.',
          },
        },
        high: {
          from: { school: ['K1'], friends: ['K3'], home: ['K1'], work: ['K2', 'K4'] },
          student: {
            school: 'Bir meslek tanıtılırken ilk olarak o işin ne kadar kazandırdığını sorabilirsin.',
            friends: 'Arkadaşlarınla geleceği konuşurken rahat bir hayat kurabileceğin bir iş hayal edebilirsin.',
            home: 'Az kazandıran ama ilgini çeken bir işi seçmek sana zor gelebilir.',
          },
          parent: {
            school: 'Bir meslek tanıtılırken çocuğunuz ilk olarak o işin ne kadar kazandırdığını sorabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken rahat bir hayat kurabileceği bir iş hayal edebilir.',
            home: 'Az kazandıran ama ilgisini çeken bir işi seçmek ona zor gelebilir.',
          },
          adult: {
            work: 'Bir işte emeğinin karşılığını iyi bir ücretle almak ve gelirinin artması senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Başkalarına yardım: Y1 insanların hayatını kolaylaştırmak, Y2 ihtiyacı olana destek olmak, Y3 toplumun bir ihtiyacını
       karşılamak, Y4 işin başkalarına yararını görebilmek. */
    helping: {
      poles: { low: 'Yardım öncelik değil', high: 'Yararlı olmayı önemser' },
      bands: {
        low: {
          from: { school: ['Y4'], friends: ['Y2'], home: ['Y1'], work: ['Y3'] },
          student: {
            school: 'Bir proje seçerken başkalarına yararlı olması sana öncelikli gelmeyebilir.',
            friends: 'Arkadaşlarınla meslekleri konuşurken ihtiyacı olanlara destek olan işler sana öncelikli gelmeyebilir.',
            home: 'Bir işin kimseye doğrudan yardım etmemesi seni pek rahatsız etmeyebilir.',
          },
          parent: {
            school: 'Bir proje seçerken başkalarına yararlı olması çocuğunuza öncelikli gelmeyebilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken ihtiyacı olanlara destek olan işler ona öncelikli gelmeyebilir.',
            home: 'Bir işin kimseye doğrudan yardım etmemesi onu pek rahatsız etmeyebilir.',
          },
          adult: {
            work: 'Bir işi değerlendirirken toplumun bir ihtiyacını karşılaması senin için öncelikli olmayabilir.',
          },
        },
        average: {
          from: { school: ['Y4'], friends: ['Y2'], home: ['Y1'], work: ['Y4'] },
          student: {
            school: 'Bir projenin başkalarına yararlı olması bazen sana önemli gelebilir, bazen başka şeyler ağır basabilir.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin insanlara desteği bazen aklına gelebilir, bazen gelmeyebilir.',
            home: 'Yaptığın bir işin evdekilerin işini kolaylaştırması bazen sana önemli gelebilir, bazen pek aklına gelmeyebilir.',
          },
          parent: {
            school: 'Bir projenin başkalarına yararlı olması bazen çocuğunuza önemli gelebilir, bazen başka şeyler ağır basabilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken bir işin insanlara desteği bazen aklına gelebilir, bazen gelmeyebilir.',
            home: 'Yaptığı bir işin evdekilerin işini kolaylaştırması bazen ona önemli gelebilir, bazen pek aklına gelmeyebilir.',
          },
          adult: {
            work: 'Bir işte başkalarına yararını görmek bazen senin için önemli olabilir, bazen başka koşullar ağır basabilir.',
          },
        },
        high: {
          from: { school: ['Y1'], friends: ['Y3'], home: ['Y4'], work: ['Y2', 'Y4'] },
          student: {
            school: 'Bir proje konusu seçerken başkalarının hayatını kolaylaştıracak bir konu seçmek isteyebilirsin.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin topluma nasıl yararı dokunduğunu merak edebilirsin.',
            home: 'Yararı görünmeyen bir iş sana pek anlamlı gelmeyebilir.',
          },
          parent: {
            school: 'Bir proje konusu seçerken çocuğunuz başkalarının hayatını kolaylaştıracak bir konu seçmek isteyebilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken bir işin topluma nasıl yararı dokunduğunu merak edebilir.',
            home: 'Yararı görünmeyen bir iş ona pek anlamlı gelmeyebilir.',
          },
          adult: {
            work: 'Bir işte ihtiyacı olanlara destek olmak ve yaptığının yararını görmek senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Bağımsızlık: B1 işi nasıl yapacağına kendisi karar vermek, B2 birinin sürekli başında durmaması, B3 her adımda onay
       beklemeden çalışmak, B4 işlerin sırasını kendisi belirlemek. */
    independence: {
      poles: { low: 'Yönlendirmeyle rahat eder', high: 'Kendi kararını önemser' },
      bands: {
        low: {
          from: { school: ['B1'], friends: ['B4'], home: ['B1', 'B3'], work: ['B1'] },
          student: {
            school: 'Bir ödevin nasıl yapılacağı açıkça anlatılınca rahat edebilirsin.',
            friends: 'Arkadaşlarınla bir iş yaparken işin sırasını başkasının belirlemesi seni pek rahatsız etmeyebilir.',
            home: 'Her şeye kendin karar vermen gereken bir işte yönlendirme isteyebilirsin.',
          },
          parent: {
            school: 'Bir ödevin nasıl yapılacağı açıkça anlatılınca çocuğunuz rahat edebilir.',
            friends: 'Arkadaşlarıyla bir iş yaparken işin sırasını başkasının belirlemesi onu pek rahatsız etmeyebilir.',
            home: 'Her şeye kendisinin karar vermesi gereken bir işte yönlendirme isteyebilir.',
          },
          adult: {
            work: 'Bir işte açık talimatlarla ve yönlendirmeyle çalışmak sana rahat gelebilir.',
          },
        },
        average: {
          from: { school: ['B1'], friends: ['B1'], home: ['B2'], work: ['B4'] },
          student: {
            school: 'Bir ödevde bazı kararları kendin vermek isteyebilir, bazılarında yönlendirme bekleyebilirsin.',
            friends: 'Arkadaşlarınla bir iş yaparken bazen kendi bildiğin gibi yapmak isteyebilir, bazen ortak plana uyabilirsin.',
            home: 'Biri başında durunca bazen canın sıkılabilir, bazen bu sana yardımcı gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevde bazı kararları kendisi vermek isteyebilir, bazılarında yönlendirme bekleyebilir.',
            friends: 'Arkadaşlarıyla bir iş yaparken bazen kendi bildiği gibi yapmak isteyebilir, bazen ortak plana uyabilir.',
            home: 'Biri başında durunca bazen canı sıkılabilir, bazen bu ona yardımcı gelebilir.',
          },
          adult: {
            work: 'Bir işte işlerin sırasını bazen kendin belirlemek isteyebilir, bazen verilen sıraya uyabilirsin.',
          },
        },
        high: {
          from: { school: ['B1', 'B4'], friends: ['B3'], home: ['B2'], work: ['B1', 'B2'] },
          student: {
            school: 'Bir ödevi nasıl yapacağına ve işlerin sırasına kendin karar vermek senin için önemli olabilir.',
            friends: 'Arkadaşlarınla bir iş yaparken her adımda onay beklemeden ilerlemek isteyebilirsin.',
            home: 'Bir iş yaparken biri sürekli başında durunca canın sıkılabilir.',
          },
          parent: {
            school: 'Bir ödevi nasıl yapacağına ve işlerin sırasına kendisinin karar vermesi çocuğunuz için önemli olabilir.',
            friends: 'Arkadaşlarıyla bir iş yaparken her adımda onay beklemeden ilerlemek isteyebilir.',
            home: 'Bir iş yaparken biri sürekli başında durunca canı sıkılabilir.',
          },
          adult: {
            work: 'Bir işte nasıl çalışacağına kendin karar vermek ve sürekli denetlenmemek senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Güvence: G1 işini kaybetme kaygısı taşımamak, G2 gelirin düzenli gelmesi, G3 uzun yıllar aynı işte güvenle çalışmak,
       G4 geleceği güvenle planlayabileceği bir iş. */
    security: {
      poles: { low: 'Belirsizliği göze alır', high: 'Güvenceyi önemser' },
      bands: {
        low: {
          from: { school: ['G1', 'G3'], friends: ['G4'], home: ['G3'], work: ['G2'] },
          student: {
            school: 'Bir meslek tanıtılırken o işin ne kadar güvenceli olduğu senin için ilk sırada olmayabilir.',
            friends: 'Arkadaşlarınla geleceği konuşurken belirsizliği olan ama ilgini çeken bir yolu göze alabilirsin.',
            home: 'Yakınlarınla meslekleri konuşurken uzun yıllar aynı işte çalışmak sana pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Bir meslek tanıtılırken o işin ne kadar güvenceli olduğu çocuğunuz için ilk sırada olmayabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken belirsizliği olan ama ilgisini çeken bir yolu göze alabilir.',
            home: 'Yakınlarıyla meslekleri konuşurken uzun yıllar aynı işte çalışmak ona pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Bir işi değerlendirirken gelirin her ay aynı düzende gelmesi senin için öncelikli olmayabilir.',
          },
        },
        average: {
          from: { school: ['G1'], friends: ['G4'], home: ['G2'], work: ['G1'] },
          student: {
            school: 'Bir meslek tanıtılırken o işin güvencesini bazen merak edebilir, bazen başka yönlerine bakabilirsin.',
            friends: 'Arkadaşlarınla geleceği konuşurken bazen biraz belirsizliği göze alabilir, bazen güvenli bir yolu seçebilirsin.',
            home: 'Yakınlarınla meslekleri konuşurken düzenli bir gelir bazen sana önemli gelebilir, bazen başka şeyler ağır basabilir.',
          },
          parent: {
            school: 'Bir meslek tanıtılırken çocuğunuz o işin güvencesini bazen merak edebilir, bazen başka yönlerine bakabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken bazen biraz belirsizliği göze alabilir, bazen güvenli bir yolu seçebilir.',
            home: 'Yakınlarıyla meslekleri konuşurken düzenli bir gelir bazen ona önemli gelebilir, bazen başka şeyler ağır basabilir.',
          },
          adult: {
            work: 'Bir işte güvence bazen senin için belirleyici olabilir, bazen biraz belirsizliği göze alabilirsin.',
          },
        },
        high: {
          from: { school: ['G4'], friends: ['G4'], home: ['G2', 'G3'], work: ['G1', 'G2'] },
          student: {
            school: 'Bir meslek tanıtılırken o işle geleceğini güvenle planlayıp planlayamayacağını sorabilirsin.',
            friends: 'Arkadaşlarınla geleceği konuşurken belirsiz bir fırsatı göze almak sana zor gelebilir.',
            home: 'Yakınlarınla meslekleri konuşurken düzenli bir gelir ve uzun yıllar sürecek bir iş sana önemli gelebilir.',
          },
          parent: {
            school: 'Bir meslek tanıtılırken çocuğunuz o işle geleceğini güvenle planlayıp planlayamayacağını sorabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken belirsiz bir fırsatı göze almak ona zor gelebilir.',
            home: 'Yakınlarıyla meslekleri konuşurken düzenli bir gelir ve uzun yıllar sürecek bir iş ona önemli gelebilir.',
          },
          adult: {
            work: 'Bir işte işini kaybetme kaygısı taşımamak ve gelirinin düzenli gelmesi senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Birlikte çalışma: E1 çalışma arkadaşlarıyla sıcak ilişkiler, E2 tek başına değil bir ekiple çalışmak, E3 iş dışında da
       görüşecek kadar yakın olmak, E4 kendini bir topluluğun parçası gibi hissetmek. */
    team: {
      poles: { low: 'Kendi başına rahat eder', high: 'Ekiple çalışmayı önemser' },
      bands: {
        low: {
          from: { school: ['E2'], friends: ['E4'], home: ['E2'], work: ['E2'] },
          student: {
            school: 'Bir projeyi tek başına yapmak sana rahat gelebilir.',
            friends: 'Arkadaşlarınla bir takımın ya da kulübün parçası olmak senin için öncelikli olmayabilir.',
            home: 'Bir işi baştan sona başkalarıyla birlikte yapmak sana pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Bir projeyi tek başına yapmak çocuğunuza rahat gelebilir.',
            friends: 'Arkadaşlarıyla bir takımın ya da kulübün parçası olmak onun için öncelikli olmayabilir.',
            home: 'Bir işi baştan sona başkalarıyla birlikte yapmak ona pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Bir işte kendi başına yürütebileceğin görevlerde rahat edebilirsin.',
          },
        },
        average: {
          from: { school: ['E2'], friends: ['E1'], home: ['E4'], work: ['E2'] },
          student: {
            school: 'Bir projeyi bazen grupla yapmak isteyebilir, bazen tek başına çalışmayı seçebilirsin.',
            friends: 'Bir gruptakilerle sıcak ilişkiler kurmak bazen sana önemli gelebilir, bazen işin kendisi ağır basabilir.',
            home: 'Bir topluluğun parçası gibi hissetmek bazen sana önemli gelebilir, bazen kendi başına kalmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir projeyi bazen grupla yapmak isteyebilir, bazen tek başına çalışmayı seçebilir.',
            friends: 'Bir gruptakilerle sıcak ilişkiler kurmak bazen ona önemli gelebilir, bazen işin kendisi ağır basabilir.',
            home: 'Bir topluluğun parçası gibi hissetmek bazen ona önemli gelebilir, bazen kendi başına kalmak iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte bazen ekiple çalışmak isteyebilir, bazen tek başına çalışmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['E2'], friends: ['E4'], home: ['E2'], work: ['E1', 'E4'] },
          student: {
            school: 'Bir projeyi tek başına değil, bir grupla yapmak sana daha keyifli gelebilir.',
            friends: 'Arkadaşlarınla bir takımın ya da kulübün parçası olmak senin için çok önemli olabilir.',
            home: 'Uzun süre tek başına yapılan bir iş sana pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Bir projeyi tek başına değil, bir grupla yapmak çocuğunuza daha keyifli gelebilir.',
            friends: 'Arkadaşlarıyla bir takımın ya da kulübün parçası olmak onun için çok önemli olabilir.',
            home: 'Uzun süre tek başına yapılan bir iş ona pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Bir işte çalışma arkadaşlarınla sıcak ilişkiler kurmak ve bir ekibin parçası olmak senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Saygınlık ve ilerleme: S1 işin saygı görmesi, S2 başarılanların görülüp takdir edilmesi, S3 üst görevlere yükselmek,
       S4 yaptığı işle tanınmak. */
    status: {
      poles: { low: 'Tanınmak öncelik değil', high: 'Takdir ve ilerleme arar' },
      bands: {
        low: {
          from: { school: ['S2'], friends: ['S1'], home: ['S3'], work: ['S4'] },
          student: {
            school: 'Bir projede emeğinin herkesçe görülmesi senin için pek önemli olmayabilir.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin saygın sayılması sana öncelikli gelmeyebilir.',
            home: 'İleride üst görevlere yükselmek yerine yaptığın işin kendisi sana önemli gelebilir.',
          },
          parent: {
            school: 'Bir projede emeğinin herkesçe görülmesi çocuğunuz için pek önemli olmayabilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken bir işin saygın sayılması ona öncelikli gelmeyebilir.',
            home: 'İleride üst görevlere yükselmek yerine yaptığı işin kendisi ona önemli gelebilir.',
          },
          adult: {
            work: 'Bir işte yaptığın işle tanınmak senin için öncelikli olmayabilir.',
          },
        },
        average: {
          from: { school: ['S2'], friends: ['S1'], home: ['S3'], work: ['S4'] },
          student: {
            school: 'Bir projede emeğinin takdir edilmesi bazen sana önemli gelebilir, bazen işi bitirmek yeterli gelebilir.',
            friends: 'Arkadaşlarınla meslekleri konuşurken bir işin saygınlığı bazen aklına gelebilir, bazen gelmeyebilir.',
            home: 'İleride üst görevlere yükselmek bazen sana çekici gelebilir, bazen pek önemli gelmeyebilir.',
          },
          parent: {
            school: 'Bir projede emeğinin takdir edilmesi bazen çocuğunuza önemli gelebilir, bazen işi bitirmek yeterli gelebilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken bir işin saygınlığı bazen aklına gelebilir, bazen gelmeyebilir.',
            home: 'İleride üst görevlere yükselmek bazen ona çekici gelebilir, bazen pek önemli gelmeyebilir.',
          },
          adult: {
            work: 'Bir işte tanınmak bazen senin için önemli olabilir, bazen işin kendisi ağır basabilir.',
          },
        },
        high: {
          from: { school: ['S2'], friends: ['S1', 'S3'], home: ['S2'], work: ['S3', 'S4'] },
          student: {
            school: 'Bir projede emeğinin görülüp takdir edilmesi senin için çok önemli olabilir.',
            friends: 'Arkadaşlarınla meslekleri konuşurken saygı gören ve ilerleme fırsatı olan işler dikkatini çekebilir.',
            home: 'Emeğin fark edilmeyince canın sıkılabilir.',
          },
          parent: {
            school: 'Bir projede emeğinin görülüp takdir edilmesi çocuğunuz için çok önemli olabilir.',
            friends: 'Arkadaşlarıyla meslekleri konuşurken saygı gören ve ilerleme fırsatı olan işler dikkatini çekebilir.',
            home: 'Emeği fark edilmeyince canı sıkılabilir.',
          },
          adult: {
            work: 'Bir işte zamanla üst görevlere yükselmek ve yaptığın işle tanınmak senin için çok önemli olabilir.',
          },
        },
      },
    },
    /* Yaşam dengesi: D1 iş dışında sevdiklerine zaman ayırmak, D2 akşamları ve hafta sonları iş düşünmek zorunda kalmamak,
       D3 hobilere yetecek boş zaman, D4 çok uzun saatler çalışmak zorunda kalmamak. */
    balance: {
      poles: { low: 'Yoğun çalışmayı göze alır', high: 'İş dışı hayatı önemser' },
      bands: {
        low: {
          from: { school: ['D2'], friends: ['D1'], home: ['D3'], work: ['D4'] },
          student: {
            school: 'Bir proje için akşamları da çalışmak seni pek rahatsız etmeyebilir.',
            friends: 'Bir işe dalınca arkadaşlarına ve dinlenmeye zaman ayırmayı unutabilirsin.',
            home: 'Hobilerine çok zaman kalmaması seni pek rahatsız etmeyebilir.',
          },
          parent: {
            school: 'Bir proje için akşamları da çalışmak çocuğunuzu pek rahatsız etmeyebilir.',
            friends: 'Bir işe dalınca arkadaşlarına ve dinlenmeye zaman ayırmayı unutabilir.',
            home: 'Hobilerine çok zaman kalmaması onu pek rahatsız etmeyebilir.',
          },
          adult: {
            work: 'Sana uyan bir iş için uzun saatler çalışmayı göze alabilirsin.',
          },
        },
        average: {
          from: { school: ['D2'], friends: ['D1'], home: ['D3'], work: ['D1', 'D4'] },
          student: {
            school: 'Yoğun bir proje haftasında akşamları da çalışmayı bazen göze alabilir, bazen boş zamanını korumak isteyebilirsin.',
            friends: 'Arkadaşlarına zaman ayırmak bazen önce gelebilir, bazen bir işi bitirmek sana daha önemli gelebilir.',
            home: 'Hobilerine yetecek boş zaman bazen sana önemli gelebilir, bazen bir işe daha çok zaman verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yoğun bir proje haftasında akşamları da çalışmayı bazen göze alabilir, bazen boş zamanını korumak isteyebilir.',
            friends: 'Arkadaşlarına zaman ayırmak bazen önce gelebilir, bazen bir işi bitirmek ona daha önemli gelebilir.',
            home: 'Hobilerine yetecek boş zaman bazen ona önemli gelebilir, bazen bir işe daha çok zaman verebilir.',
          },
          adult: {
            work: 'Yeri geldiğinde yoğun çalışmayı göze alabilir, ama iş dışındaki hayatına da zaman kalmasını isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['D3', 'D1'], friends: ['D1'], home: ['D2'], work: ['D4'] },
          student: {
            school: 'Ders dışında hobilerine ve sevdiklerine zaman kalması senin için çok önemli olabilir.',
            friends: 'Arkadaşlarınla geçirdiğin zamanı korumak sana önemli gelebilir.',
            home: 'Akşamları ve hafta sonları da iş düşünmek zorunda kalınca canın sıkılabilir.',
          },
          parent: {
            school: 'Ders dışında hobilerine ve sevdiklerine zaman kalması çocuğunuz için çok önemli olabilir.',
            friends: 'Arkadaşlarıyla geçirdiği zamanı korumak ona önemli gelebilir.',
            home: 'Akşamları ve hafta sonları da iş düşünmek zorunda kalınca canı sıkılabilir.',
          },
          adult: {
            work: 'Bir işte çok uzun saatler çalışmak zorunda kalmamak senin için çok önemli olabilir.',
          },
        },
      },
    },
  },
};
