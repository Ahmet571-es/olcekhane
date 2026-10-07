import type { ReportTemplate } from './types';

/**
 * Meslek İlgi Alanları rapor metinleri.
 * İlkeler: ilgi, yetenek ya da başarı demek değildir; düşük ilgi bir eksiklik olarak anlatılmaz. Alan örnekleri
 * maddelerin içeriğinden çıkarılmış, yol gösterici örneklerdir; bir meslek önerisi değildir. Veliye
 * "çocuğunuz ... belirtiyor" dili kullanılır, çünkü sonuç öz bildirime dayanır.
 * Rapor alanları en yüksekten en düşüğe sıralar (profil: interests); "yüksek" metni en belirgin alanlarda gösterilir.
 * Yetişkin raporu öğrenci metinlerini kullanır; öğrenci metni okula özgü bir örnek içerdiğinde `adult` metni yazılmıştır.
 */
export const meslekIlgiAlanlariReport: ReportTemplate = {
  version: 'meslek-ilgi-alanlari-rapor-2',
  bandLabels: {
    low: 'Az ilgi',
    average: 'Orta düzeyde ilgi',
    high: 'Belirgin ilgi',
  },
  overview: {
    student:
      'Her satır bir ilgi alanı. Alanlar en yüksekten en düşüğe sıralandı; değerler 1 (hiç hoşlanmam) ile 5 (çok hoşlanırım) arasında. İlgi, yetenek demek değildir: sonuç neyi yapabileceğini değil, neyi yapmaktan hoşlanacağını gösterir.',
    parent:
      'Her satır bir ilgi alanını gösterir. Alanlar en yüksekten en düşüğe sıralanmıştır; değerler 1 (hiç hoşlanmam) ile 5 (çok hoşlanırım) arasındadır. İlgi, yetenek ya da başarı demek değildir: sonuç çocuğunuzun neyi yapabileceğini değil, neyi yapmaktan hoşlanacağını gösterir.',
  },
  scales: {
    leadership: {
      high: {
        summary: 'Yön vermekten ve ikna etmekten hoşlanıyor',
        student:
          'Bir işin başına geçmek, insanları bir hedef etrafında toplamak ve onları ikna etmek sana çekici geliyor. Bu ilgi; yönetim ve işletme, girişimcilik, satış ve pazarlama, hukuk, siyaset bilimi ve medya gibi alanlarla ilişkilidir. Kulüp başkanlığı, münazara, öğrenci meclisi ya da bir etkinliği baştan sona organize etmek bu ilgiyi denemen için iyi fırsatlar.',
        adult:
          'Bir işin başına geçmek, insanları bir hedef etrafında toplamak ve onları ikna etmek sana çekici geliyor. Bu ilgi; yönetim ve işletme, girişimcilik, satış ve pazarlama, hukuk, siyaset bilimi ve medya gibi alanlarla ilişkilidir. İş yerinde ya da bir sivil toplum kuruluşunda bir projenin sorumluluğunu almak, bir ekibi yönlendirmek ya da bir etkinliği baştan sona organize etmek bu ilgiyi denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz bir işin başına geçmekten, insanları bir hedef etrafında toplamaktan ve onları ikna etmekten hoşlanacağını belirtiyor. Bu ilgi; yönetim ve işletme, girişimcilik, satış ve pazarlama, hukuk, siyaset bilimi ve medya gibi alanlarla ilişkilidir. Kulüp başkanlığı, münazara ya da bir okul etkinliğinin sorumluluğunu almak bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Okulda bir kulüp ya da proje ekibinde sorumluluk üstlenmeyi dene.',
          'Münazara ya da sunum yaparak ikna etme becerini geliştir; iyi bir lider önce iyi dinler.',
        ],
        tipsParent: [
          'Bir aile gezisi ya da doğum günü gibi küçük bir etkinliğin planlanmasını ona bırakın.',
          'Münazara, Model BM ya da öğrenci meclisi gibi etkinliklere katılmasını destekleyin.',
        ],
      },
      average: {
        summary: 'Liderliğe orta düzeyde ilgi',
        student:
          'Liderlik ve ikna gerektiren işlere orta düzeyde ilgi duyuyorsun: yeri geldiğinde sorumluluk alabilirsin ama bu senin için tek başına çok çekici bir hedef değil. Bir ekipte hangi rolde daha rahat olduğunu gözlemlemek sana yol gösterebilir.',
        parent:
          'Çocuğunuz liderlik ve ikna gerektiren işlere orta düzeyde ilgi duyuyor. Gerektiğinde sorumluluk alabilir; ancak bu alan onun için en çekici alanlardan biri değil.',
        tipsStudent: [
          'Grup çalışmalarında farklı rolleri dene: bazen yöneten, bazen destekleyen ol.',
          'Hangi rolde daha çok keyif aldığını not et.',
        ],
        tipsParent: [
          'Farklı rolleri deneyebileceği grup etkinliklerini destekleyin.',
          'Hangi rollerde rahat ettiğini onunla konuşun.',
        ],
      },
      low: {
        summary: 'Yönetmek ve ikna etmek pek çekici gelmiyor',
        student:
          'İnsanları yönetmek ya da ikna etmek sana pek çekici gelmiyor. Bu bir eksiklik değil: pek çok insan işin kendisine odaklanmayı yönetmekten daha keyifli bulur.',
        parent:
          'Çocuğunuz insanları yönetmekten ya da ikna etmekten pek hoşlanmayacağını belirtiyor. Bu bir eksiklik değildir; birçok kişi işin kendisine odaklanmayı yönetmekten daha keyifli bulur.',
        tipsStudent: [
          'Sorumluluk alman gerektiğinde küçük ve net görevlerle başla.',
          'Enerjini en çok ilgi duyduğun alanlara ayır.',
        ],
        tipsParent: [
          'Onu liderlik rollerine zorlamayın; ilgi duyduğu alanlarda derinleşmesini destekleyin.',
          'Küçük sorumluluklar vererek kendine güvenini destekleyin.',
        ],
      },
    },
    organization: {
      high: {
        summary: 'Planlamaktan ve düzen kurmaktan hoşlanıyor',
        student:
          'Plan yapmak, bütçe hesaplamak, kayıt tutmak ve bir işi düzene sokmak sana keyif veriyor. Bu ilgi; işletme, muhasebe ve finans, bankacılık, lojistik, insan kaynakları, yönetim bilişim sistemleri ve kamu yönetimi gibi alanlarla ilişkilidir. Bir etkinliğin bütçesini tutmak ya da bir kulübün kayıtlarını düzenlemek bu ilgiyi denemen için iyi bir başlangıç.',
        adult:
          'Plan yapmak, bütçe hesaplamak, kayıt tutmak ve bir işi düzene sokmak sana keyif veriyor. Bu ilgi; işletme, muhasebe ve finans, bankacılık, lojistik, insan kaynakları, yönetim bilişim sistemleri ve kamu yönetimi gibi alanlarla ilişkilidir. Bir projenin bütçesini ya da planını üstlenmek, ev bütçeni bir hesap tablosunda tutmak ya da bu alanlarda çalışan biriyle konuşmak bu ilgiyi denemen için iyi bir başlangıç.',
        parent:
          'Çocuğunuz plan yapmaktan, bütçe hesaplamaktan, kayıt tutmaktan ve işleri düzene sokmaktan hoşlanacağını belirtiyor. Bu ilgi; işletme, muhasebe ve finans, bankacılık, lojistik, insan kaynakları, yönetim bilişim sistemleri ve kamu yönetimi gibi alanlarla ilişkilidir. Bir etkinliğin bütçesini tutmak ya da harçlığını planlamak bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Kendi harçlığın ya da bir okul etkinliği için basit bir bütçe tablosu hazırla.',
          'Hesap tablosu (Excel gibi) kullanmayı öğrenmek bu ilgiyi güçlü bir beceriye dönüştürür.',
        ],
        tipsParent: [
          'Harçlık ya da aile bütçesiyle ilgili küçük planlamalara onu da katın.',
          'Hesap tablosu kullanmayı ve temel finans okuryazarlığını öğrenmesini destekleyin.',
        ],
      },
      average: {
        summary: 'Düzen gerektiren işlere orta düzeyde ilgi',
        student:
          'Planlama ve düzen gerektiren işlere orta düzeyde ilgi duyuyorsun. Gerektiğinde düzenli çalışabilirsin; ancak yalnızca kayıt ve hesapla geçen bir iş seni tek başına pek heyecanlandırmayabilir.',
        parent:
          'Çocuğunuz planlama ve düzen gerektiren işlere orta düzeyde ilgi duyuyor. Gerektiğinde düzenli çalışabilir; ancak bu alan onun için en çekici alanlardan biri değil.',
        tipsStudent: [
          'Planlama becerisi hangi alanı seçersen seç işine yarar; haftalık plan yapmayı dene.',
          'Hangi düzen işlerinin sana daha keyifli geldiğini gözlemle.',
        ],
        tipsParent: ['Haftalık plan gibi düzen alışkanlıklarını birlikte deneyin.', 'Onu en çok hangi tür görevlerin motive ettiğini konuşun.'],
      },
      low: {
        summary: 'Kayıt ve hesap işleri pek çekici gelmiyor',
        student:
          'Bütçe, kayıt ve düzen gerektiren işler sana pek çekici gelmiyor. Bu, düzensiz olduğun anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaktan hoşlanmayacağını gösterir.',
        parent:
          'Çocuğunuz bütçe, kayıt ve düzen gerektiren işlerden pek hoşlanmayacağını belirtiyor. Bu, düzensiz olduğu anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        tipsStudent: [
          'Sevmediğin düzen işlerini kısa parçalara bölmek onları kolaylaştırır.',
          'Enerjini en çok ilgi duyduğun alanlara ayır.',
        ],
        tipsParent: [
          'Düzen gerektiren ödevlerde küçük adımlar ve basit kontrol listeleri işe yarayabilir.',
          'İlgi duyduğu alanlarda derinleşmesini destekleyin.',
        ],
      },
    },
    altruism: {
      high: {
        summary: 'İnsanlara yardım etmekten hoşlanıyor',
        student:
          'İnsanlara yardım etmek, bir şey öğretmek, bakım vermek ve destek olmak sana anlamlı geliyor. Bu ilgi; öğretmenlik, psikolojik danışmanlık, sosyal hizmet, hemşirelik, tıp, fizyoterapi, çocuk gelişimi ve sağlık yönetimi gibi alanlarla ilişkilidir. Gönüllü çalışmalar, arkadaşlarına ders anlatmak ya da bir yardım kampanyası bu ilgiyi denemen için iyi fırsatlar.',
        adult:
          'İnsanlara yardım etmek, bir şey öğretmek, bakım vermek ve destek olmak sana anlamlı geliyor. Bu ilgi; öğretmenlik, psikolojik danışmanlık, sosyal hizmet, hemşirelik, tıp, fizyoterapi, çocuk gelişimi ve sağlık yönetimi gibi alanlarla ilişkilidir. Bir sivil toplum kuruluşunda gönüllü çalışmak, birine bildiğin bir şeyi öğretmek ya da bir yardım kampanyasında görev almak bu ilgiyi denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz insanlara yardım etmekten, öğretmekten, bakım vermekten ve destek olmaktan hoşlanacağını belirtiyor. Bu ilgi; öğretmenlik, psikolojik danışmanlık, sosyal hizmet, hemşirelik, tıp, fizyoterapi, çocuk gelişimi ve sağlık yönetimi gibi alanlarla ilişkilidir. Gönüllü çalışmalar ya da arkadaşlarına ders anlatmak bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Bir gönüllülük projesinde ya da akran öğretmenliğinde görev almayı dene.',
          'İnsanlarla çalışan meslekleri yakından tanımak için bir meslek sahibiyle konuş.',
        ],
        tipsParent: [
          'Güvenli gönüllülük etkinliklerine (sivil toplum, okul projeleri) katılmasını destekleyin.',
          'Tanıdığınız bir öğretmen, hemşire ya da danışmanla meslek sohbeti ayarlayın.',
        ],
      },
      average: {
        summary: 'Yardım gerektiren işlere orta düzeyde ilgi',
        student:
          'Yardım ve destek gerektiren işlere orta düzeyde ilgi duyuyorsun. İnsanlarla ilgilenmekten hoşlanabilirsin ama bu senin için tek başına belirleyici bir ilgi değil.',
        parent:
          'Çocuğunuz yardım ve destek gerektiren işlere orta düzeyde ilgi duyuyor. İnsanlarla ilgilenmekten hoşlanabilir; ancak bu alan onun için en çekici alanlardan biri değil.',
        tipsStudent: [
          'İnsanlara yardım etmeyi başka ilgi alanlarınla birleştiren işleri düşün.',
          'Gönüllü bir etkinliği bir kez denemek ne kadar keyif aldığını gösterir.',
        ],
        tipsParent: ['Farklı gönüllülük fırsatlarını birlikte keşfedin.', 'Hangi tür yardım işlerinden keyif aldığını konuşun.'],
      },
      low: {
        summary: 'Bakım ve danışmanlık işleri pek çekici gelmiyor',
        student:
          'İnsanlara bakım vermek ya da danışmanlık yapmak gibi işler sana pek çekici gelmiyor. Bu, yardımsever olmadığın anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        parent:
          'Çocuğunuz bakım vermek ya da danışmanlık yapmak gibi işlerden pek hoşlanmayacağını belirtiyor. Bu, yardımsever olmadığı anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        tipsStudent: ['Başkalarına katkı sağlamanın pek çok yolu var; ilgi duyduğun alanlar da buna dahil.', 'Enerjini en çok ilgi duyduğun alanlara ayır.'],
        tipsParent: ['İlgi duyduğu alanlarda derinleşmesini destekleyin.', 'Yardımseverliği ilgi alanlarıyla birleştiren fırsatları konuşun.'],
      },
    },
    creativity: {
      high: {
        summary: 'Yaratıcı işlerden hoşlanıyor',
        student:
          'Resim, müzik, yazı, sahne ya da tasarım gibi yaratıcı işler seni çekiyor. Bu ilgi; görsel sanatlar, grafik ve moda tasarımı, mimarlık ve iç mimarlık, müzik, sahne sanatları, yazarlık, sinema ve dijital tasarım gibi alanlarla ilişkilidir. Bir kulübe katılmak, kısa bir film çekmek ya da yaptıklarından bir portfolyo hazırlamak bu ilgiyi denemen için iyi fırsatlar.',
        adult:
          'Resim, müzik, yazı, sahne ya da tasarım gibi yaratıcı işler seni çekiyor. Bu ilgi; görsel sanatlar, grafik ve moda tasarımı, mimarlık ve iç mimarlık, müzik, sahne sanatları, yazarlık, sinema ve dijital tasarım gibi alanlarla ilişkilidir. Bir kursa ya da atölyeye katılmak, kısa bir film çekmek ya da yaptıklarından bir portfolyo hazırlamak bu ilgiyi denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz resim, müzik, yazı, sahne ya da tasarım gibi yaratıcı işlerden hoşlanacağını belirtiyor. Bu ilgi; görsel sanatlar, grafik ve moda tasarımı, mimarlık ve iç mimarlık, müzik, sahne sanatları, yazarlık, sinema ve dijital tasarım gibi alanlarla ilişkilidir. Sanat kulüpleri, kurslar ya da yaptıklarından bir portfolyo hazırlaması bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Yaptığın çalışmaları düzenli olarak sakla; ileride bir portfolyo için temel olur.',
          'Sanatla ilgili bölümlerin çoğunda yetenek sınavı ya da portfolyo istendiğini erkenden araştır.',
        ],
        tipsParent: [
          'Sanat, müzik ya da tasarım kursları ve kulüplerini birlikte araştırın.',
          'Yaptığı çalışmaları görünür kılın ve sergilemesi için fırsat yaratın.',
        ],
      },
      average: {
        summary: 'Yaratıcı işlere orta düzeyde ilgi',
        student:
          'Yaratıcı işlere orta düzeyde ilgi duyuyorsun. Sanatla, tasarımla ya da yazıyla uğraşmak zaman zaman hoşuna gidebilir; bu ilgi başka bir alanla birleştiğinde de işine yarayabilir.',
        parent:
          'Çocuğunuz yaratıcı işlere orta düzeyde ilgi duyuyor. Sanat, tasarım ya da yazı zaman zaman hoşuna gidebilir; bu ilgi başka alanlarla birleştiğinde de değerlidir.',
        tipsStudent: ['Yaratıcılığı başka ilgilerinle birleştiren işleri düşün (ör. bilimsel çizim, tasarım odaklı mühendislik).', 'Kısa bir kursla bir sanat dalını denemek ilgini netleştirir.'],
        tipsParent: ['Kısa süreli bir kursla bir sanat dalını denemesini destekleyin.', 'Yaratıcılığı diğer ilgileriyle birleştiren fırsatları konuşun.'],
      },
      low: {
        summary: 'Sanat ve tasarım işleri pek çekici gelmiyor',
        student:
          'Sanat, müzik, yazı ya da tasarım işleri sana pek çekici gelmiyor. Bu, yaratıcı olmadığın anlamına gelmez; yaratıcılık bilimde, teknikte ve iş hayatında da vardır.',
        parent:
          'Çocuğunuz sanat, müzik, yazı ya da tasarım işlerinden pek hoşlanmayacağını belirtiyor. Bu, yaratıcı olmadığı anlamına gelmez; yaratıcılık bilimde, teknikte ve iş hayatında da vardır.',
        tipsStudent: ['Problem çözerken yeni yollar denemek de yaratıcılıktır.', 'Enerjini en çok ilgi duyduğun alanlara ayır.'],
        tipsParent: ['İlgi duyduğu alanlarda yeni fikirler üretmesini destekleyin.', 'Onu sanat etkinliklerine zorlamayın.'],
      },
    },
    analysis: {
      high: {
        summary: 'Bilimden ve problem çözmekten hoşlanıyor',
        student:
          'Bilimsel sorular sormak, deney yapmak, matematik ve karmaşık problemlerle uğraşmak sana keyif veriyor. Bu ilgi; fizik, kimya ve biyoloji gibi temel bilimler, matematik ve istatistik, mühendislik, bilgisayar bilimleri, tıp ve eczacılık gibi alanlarla ilişkilidir. Bilim olimpiyatları, TÜBİTAK proje yarışmaları, kodlama ya da kendi deneyini tasarlamak bu ilgiyi denemen için iyi fırsatlar.',
        adult:
          'Bilimsel sorular sormak, deney yapmak, matematik ve karmaşık problemlerle uğraşmak sana keyif veriyor. Bu ilgi; fizik, kimya ve biyoloji gibi temel bilimler, matematik ve istatistik, mühendislik, bilgisayar bilimleri, tıp ve eczacılık gibi alanlarla ilişkilidir. Kodlama ya da veri analizi öğrenmek, bir araştırma projesinde yer almak ya da merak ettiğin bir soruyu kendi deneyinle sınamak bu ilgiyi denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz bilimsel sorular sormaktan, deney yapmaktan, matematik ve karmaşık problemlerle uğraşmaktan hoşlanacağını belirtiyor. Bu ilgi; fizik, kimya ve biyoloji gibi temel bilimler, matematik ve istatistik, mühendislik, bilgisayar bilimleri, tıp ve eczacılık gibi alanlarla ilişkilidir. Bilim olimpiyatları, TÜBİTAK proje yarışmaları ya da kodlama çalışmaları bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Merak ettiğin bir soruyu küçük bir araştırma projesine dönüştür.',
          'Kodlama öğrenmek bilimin hemen her dalında işine yarar.',
        ],
        tipsParent: [
          'Bilim merkezleri, olimpiyat hazırlık kulüpleri ve proje yarışmalarını birlikte araştırın.',
          'Sorularına hemen cevap vermek yerine cevabı birlikte araştırmayı önerin.',
        ],
      },
      average: {
        summary: 'Bilimsel işlere orta düzeyde ilgi',
        student:
          'Bilimsel ve analitik işlere orta düzeyde ilgi duyuyorsun. Problem çözmek zaman zaman hoşuna gidebilir; bu beceri başka ilgi alanlarınla birleştiğinde de çok değerlidir.',
        parent:
          'Çocuğunuz bilimsel ve analitik işlere orta düzeyde ilgi duyuyor. Problem çözmekten zaman zaman hoşlanabilir; bu beceri başka alanlarla birleştiğinde de değerlidir.',
        tipsStudent: ['Bilimi ilgi duyduğun başka alanlarla birleştiren konuları keşfet.', 'Popüler bilim kitapları ve belgeseller merakını ölçmenin kolay bir yolu.'],
        tipsParent: ['Popüler bilim kitapları ve belgeseller önerin.', 'Bilimi günlük hayattaki sorularla ilişkilendirin.'],
      },
      low: {
        summary: 'Bilimsel araştırma işleri pek çekici gelmiyor',
        student:
          'Deney, matematik ve bilimsel araştırma gerektiren işler sana pek çekici gelmiyor. Bu, bu derslerde başarılı olamayacağın anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        adult:
          'Deney, matematik ve bilimsel araştırma gerektiren işler sana pek çekici gelmiyor. Bu sonuç, bu konularda başarılı olamayacağın anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        parent:
          'Çocuğunuz deney, matematik ve bilimsel araştırma gerektiren işlerden pek hoşlanmayacağını belirtiyor. Bu, bu derslerde başarılı olamayacağı anlamına gelmez; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        tipsStudent: ['Derslerde başarılı olmak için ilgi şart değil; düzenli çalışma yeter.', 'Enerjini en çok ilgi duyduğun alanlara ayır.'],
        tipsParent: ['Fen ve matematik derslerinde düzenli çalışmasını destekleyin; ilgi az olsa da başarı mümkündür.', 'İlgi duyduğu alanlarda derinleşmesini destekleyin.'],
      },
    },
    production: {
      high: {
        summary: 'Doğada ve elle yapılan işlerden hoşlanıyor',
        student:
          'Toprakla, bitki ve hayvanlarla, doğada ya da alet ve makinelerle elle yapılan somut işler sana keyif veriyor. Bu ilgi; ziraat, ormancılık, veteriner hekimlik, peyzaj mimarlığı, inşaat, makine ve otomotiv teknolojisi, mobilya ve el sanatları gibi alanlarla ilişkilidir. Bahçe işleri, bir şeyi tamir etmek, maket yapmak ya da bir atölyeye katılmak bu ilgiyi denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz toprakla, bitki ve hayvanlarla, doğada ya da alet ve makinelerle elle yapılan somut işlerden hoşlanacağını belirtiyor. Bu ilgi; ziraat, ormancılık, veteriner hekimlik, peyzaj mimarlığı, inşaat, makine ve otomotiv teknolojisi, mobilya ve el sanatları gibi alanlarla ilişkilidir. Bahçe işleri, tamir ya da bir atölyeye katılmak bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Evde ya da okulda bir tamir, bahçe ya da yapım projesi üstlen.',
          'Meslek liseleri ve teknik bölümler bu ilgiye uygun seçenekler sunar; tanımak için birini ziyaret et.',
        ],
        tipsParent: [
          'Güvenli koşullarda alet kullanmayı öğrenebileceği fırsatlar yaratın.',
          'Meslek liselerini ve teknik bölümleri önyargısız biçimde birlikte araştırın.',
        ],
      },
      average: {
        summary: 'Doğa ve el işlerine orta düzeyde ilgi',
        student:
          'Doğada ve elle yapılan işlere orta düzeyde ilgi duyuyorsun. Bu tür işler zaman zaman hoşuna gidebilir ama senin için tek başına belirleyici bir ilgi değil.',
        parent:
          'Çocuğunuz doğada ve elle yapılan işlere orta düzeyde ilgi duyuyor. Bu tür işler zaman zaman hoşuna gidebilir; ancak bu alan onun için en çekici alanlardan biri değil.',
        tipsStudent: ['Bir hobi olarak bahçe ya da tamir işlerini denemek ilgini netleştirir.', 'Elle yapılan işleri diğer ilgilerinle birleştiren alanları düşün.'],
        tipsParent: ['Hobi düzeyinde el işleri ya da doğa etkinlikleri önerin.', 'Hangi somut işlerden keyif aldığını konuşun.'],
      },
      low: {
        summary: 'Doğada ve elle yapılan işler pek çekici gelmiyor',
        student:
          'Doğada, toprakla ya da alet ve makinelerle yapılan işler sana pek çekici gelmiyor. Bu tür işleri meslek olarak yapmaktan hoşlanmayacağını gösteriyor; bir eksiklik değil.',
        parent:
          'Çocuğunuz doğada, toprakla ya da alet ve makinelerle yapılan işlerden pek hoşlanmayacağını belirtiyor. Bu bir eksiklik değildir; yalnızca bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir.',
        tipsStudent: ['Enerjini en çok ilgi duyduğun alanlara ayır.', 'Temel pratik beceriler (küçük tamirler gibi) yine de günlük hayatta işine yarar.'],
        tipsParent: ['İlgi duyduğu alanlarda derinleşmesini destekleyin.', 'Temel pratik becerileri günlük hayatta birlikte uygulayın.'],
      },
    },
    adventure: {
      high: {
        summary: 'Heyecan ve hareket içeren işlerden hoşlanıyor',
        student:
          'Heyecan, hareket, fiziksel mücadele ve biraz risk içeren işler seni canlandırıyor. Bu ilgi; spor bilimleri ve antrenörlük, profesyonel spor, güvenlik ve askerlik meslekleri, arama-kurtarma, pilotluk ve doğa turizmi gibi alanlarla ilişkilidir. Bir spor kulübü, izcilik ya da doğa sporları bu ilgiyi güvenli biçimde denemen için iyi fırsatlar.',
        adult:
          'Heyecan, hareket, fiziksel mücadele ve biraz risk içeren işler seni canlandırıyor. Bu ilgi; spor bilimleri ve antrenörlük, profesyonel spor, güvenlik ve askerlik meslekleri, arama-kurtarma, pilotluk ve doğa turizmi gibi alanlarla ilişkilidir. Bir spor kulübü, bir doğa yürüyüşü grubu ya da eğitmen eşliğinde doğa sporları bu ilgiyi güvenli biçimde denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz heyecan, hareket, fiziksel mücadele ve biraz risk içeren işlerden hoşlanacağını belirtiyor. Bu ilgi; spor bilimleri ve antrenörlük, profesyonel spor, güvenlik ve askerlik meslekleri, arama-kurtarma, pilotluk ve doğa turizmi gibi alanlarla ilişkilidir. Spor kulüpleri, izcilik ya da eğitmen eşliğinde doğa sporları bu ilgiyi güvenli biçimde denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Heyecan veren etkinlikleri her zaman eğitmen eşliğinde ve güvenlik kurallarına uyarak dene.',
          'Spor ya da güvenlik alanındaki mesleklerin giriş koşullarını (fiziksel yeterlik, sınavlar) erkenden araştır.',
        ],
        tipsParent: [
          'Bu enerjiyi güvenli ve düzenli bir spor ya da doğa etkinliğine yönlendirin.',
          'İlgilendiği mesleklerin giriş koşullarını birlikte araştırın.',
        ],
      },
      average: {
        summary: 'Macera ve harekete orta düzeyde ilgi',
        student:
          'Heyecan ve hareket içeren işlere orta düzeyde ilgi duyuyorsun. Spor ve hareket zaman zaman hoşuna gidebilir ama senin için tek başına belirleyici bir ilgi değil.',
        parent:
          'Çocuğunuz heyecan ve hareket içeren işlere orta düzeyde ilgi duyuyor. Spor ve hareketten zaman zaman hoşlanabilir; ancak bu alan onun için en çekici alanlardan biri değil.',
        tipsStudent: ['Düzenli hareket hangi alanı seçersen seç iyi gelir.', 'Farklı sporları denemek hangisinden keyif aldığını gösterir.'],
        tipsParent: ['Farklı spor ve hareket etkinliklerini denemesini destekleyin.', 'Hangi etkinliklerden keyif aldığını konuşun.'],
      },
      low: {
        summary: 'Risk ve fiziksel mücadele içeren işler pek çekici gelmiyor',
        student:
          'Risk, heyecan ve fiziksel mücadele içeren işler sana pek çekici gelmiyor. Bu, sakin ve güvenli ortamları tercih ettiğini gösterir; bir eksiklik değil.',
        parent:
          'Çocuğunuz risk, heyecan ve fiziksel mücadele içeren işlerden pek hoşlanmayacağını belirtiyor. Bu, sakin ve güvenli ortamları tercih ettiğini gösterir; bir eksiklik değildir.',
        tipsStudent: ['Sağlığın için sana uygun, sakin bir hareket biçimi (yürüyüş, yüzme gibi) bul.', 'Enerjini en çok ilgi duyduğun alanlara ayır.'],
        tipsParent: ['Sağlığı için keyif aldığı sakin bir hareket biçimi bulmasına yardım edin.', 'İlgi duyduğu alanlarda derinleşmesini destekleyin.'],
      },
    },
    erudition: {
      high: {
        summary: 'Okumaktan, yazmaktan ve dillerden hoşlanıyor',
        student:
          'Okumak, yazmak, diller öğrenmek ve bilgi biriktirmek sana keyif veriyor. Bu ilgi; dil ve edebiyat, çeviri ve tercümanlık, gazetecilik ve editörlük, bilgi ve belge yönetimi, tarih, felsefe, hukuk ve akademik araştırma gibi alanlarla ilişkilidir. Okul gazetesi, münazara, yabancı dil kulüpleri ya da günlük tutmak bu ilgiyi denemen için iyi fırsatlar.',
        adult:
          'Okumak, yazmak, diller öğrenmek ve bilgi biriktirmek sana keyif veriyor. Bu ilgi; dil ve edebiyat, çeviri ve tercümanlık, gazetecilik ve editörlük, bilgi ve belge yönetimi, tarih, felsefe, hukuk ve akademik araştırma gibi alanlarla ilişkilidir. Düzenli yazmak (ör. blog ya da günlük tutmak), bir kitap kulübüne katılmak ya da yeni bir dil öğrenmek bu ilgiyi denemen için iyi fırsatlar.',
        parent:
          'Çocuğunuz okumaktan, yazmaktan, dil öğrenmekten ve bilgi biriktirmekten hoşlanacağını belirtiyor. Bu ilgi; dil ve edebiyat, çeviri ve tercümanlık, gazetecilik ve editörlük, bilgi ve belge yönetimi, tarih, felsefe, hukuk ve akademik araştırma gibi alanlarla ilişkilidir. Okul gazetesi, münazara ya da yabancı dil kulüpleri bu ilgiyi denemesi için iyi fırsatlardır.',
        tipsStudent: [
          'Okuduklarını kısa yazılarla özetlemeyi ya da bir blog tutmayı dene.',
          'Bir yabancı dili düzenli çalışmak bu ilgiyi güçlü bir beceriye dönüştürür.',
        ],
        tipsParent: [
          'Kütüphane üyeliği, kitap kulüpleri ve yazı yarışmaları gibi fırsatları destekleyin.',
          'Yabancı dil öğrenmesi için düzenli bir çalışma planı yapmasına yardım edin.',
        ],
      },
      average: {
        summary: 'Dil ve edebiyata orta düzeyde ilgi',
        student:
          'Okuma, yazma ve dil gerektiren işlere orta düzeyde ilgi duyuyorsun. Bu beceriler hangi alanı seçersen seç işine yarar; ilgin başka bir alanla birleştiğinde daha da değerlidir.',
        parent:
          'Çocuğunuz okuma, yazma ve dil gerektiren işlere orta düzeyde ilgi duyuyor. Bu beceriler hangi alanı seçerse seçsin değerlidir.',
        tipsStudent: ['İlgi duyduğun konularda okumak okuma alışkanlığını güçlendirir.', 'Yazma becerin her alanda işine yarar; kısa yazılarla pratik yap.'],
        tipsParent: ['İlgi duyduğu konularda kitaplar önerin.', 'Okuma ve yazmayı günlük hayatın parçası yapın.'],
      },
      low: {
        summary: 'Dil ve edebiyat işleri pek çekici gelmiyor',
        student:
          'Okumak, yazmak ya da dillerle uğraşmak gibi işler sana pek çekici gelmiyor. Bu tür işleri meslek olarak yapmaktan hoşlanmayacağını gösteriyor; yine de temel okuma ve yazma becerileri her alanda işine yarar.',
        parent:
          'Çocuğunuz okumak, yazmak ya da dillerle uğraşmak gibi işlerden pek hoşlanmayacağını belirtiyor. Bu tür işleri meslek olarak yapmaya ilgi duymadığını gösterir; yine de temel okuma ve yazma becerileri her alanda önemlidir.',
        tipsStudent: ['İlgi duyduğun konular hakkında okumak okumayı daha keyifli hâle getirir.', 'Enerjini en çok ilgi duyduğun alanlara ayır.'],
        tipsParent: ['İlgi alanlarıyla ilgili kitap ve dergiler önerin.', 'Okumayı bir zorunluluk değil, keşif aracı olarak sunun.'],
      },
    },
  },
};
