import type { Soru } from '../../../types';

/** Bölüm sırasıyla temel, lisans ve uzman sorular. Doğru şıklar her düzeyin içinde dört yere dengeli dağıtılmıştır. */
export const sorular: Soru[] = [
  {
    soru: 'Hasta MR cihazında sırtüstü yatarken alnı tavana bakar. Anatomi dilinde alın tarafına ne denir?',
    secenekler: ['Üst (superior)', 'Ön (anterior)', 'Arka (posterior)', 'Derin (profundus)'],
    dogru: 1,
    aciklama:
      'Yön terimleri, beden gerçekte nasıl durursa dursun anatomik duruşa göre söylenir. Anatomik duruşta yüz öne bakar. Bu yüzden alın tarafı, hasta yatsa da öndür (anterior).',
    seviye: 'temel',
  },
  {
    soru: 'Türkçede hem medialis hem internus “iç” diye çevrilir. Medialis ne anlatır?',
    secenekler: [
      'Bir boşluğun ya da organın duvarına göre içte olan',
      'Bedenin yüzeyinden daha uzakta olan',
      'Tam orta düzlemin üstünde duran',
      'Orta hatta daha yakın olan',
    ],
    dogru: 3,
    aciklama:
      'Medialis “iç yan”dır: orta hatta daha yakın olan demektir. Internus ise bir boşluğun ya da içi boş bir organın duvarına göre içte olandır. Tam orta hatta duran yapı için medianus kullanılır; yüzeyden uzak olan ise derindir (profundus).',
    seviye: 'temel',
  },
  {
    soru: 'Dört ayaklı bir hayvanda “dorsal” sözcüğü beyinde ve omurilikte hangi yönü gösterir?',
    secenekler: [
      'Beyinde yukarıyı, omurilikte arkayı',
      'İkisinde de aynı yönü, sırt tarafını',
      'Beyinde önü, omurilikte aşağıyı',
      'İkisinde de aynı yönü, karın tarafını',
    ],
    dogru: 1,
    aciklama:
      'Dört ayaklıda merkezî sinir sisteminin ortasından geçen hayalî çizgi düzdür. Bu yüzden dorsal ve ventral, beyinde de omurilikte de aynı yönü gösterir. İnsanda ise eksen orta beyin hizasında bükülür; dorsal beyinde yukarıyı, omurilikte arkayı gösterir.',
    seviye: 'temel',
  },
  {
    soru: 'Henley’e göre insanda sinir ekseni nerede ve yaklaşık kaç derece bükülür?',
    secenekler: [
      'Omurilik soğanında, 45 derece',
      'Beyincik hizasında, 180 derece',
      'Orta beyin hizasında, 90 derece',
      'Boyun omurlarında, 30 derece',
    ],
    dogru: 2,
    aciklama:
      'Dik duruş, sinir eksenini orta beyin hizasında kabaca 90 derece büker. Bu yüzden rostral beyinde öne, omurilikte yukarıya doğrudur. Açık kaynaklarda yetişkin için ölçülmüş bir açı bulunamadı; 90 derece kaba bir değerdir.',
    seviye: 'temel',
  },
  {
    soru: 'Beyni sağ ve sol iki parçaya ayıran düzlem hangisidir?',
    secenekler: ['Sagital düzlem', 'Koronal düzlem', 'Transvers düzlem', 'Eğik düzlem'],
    dogru: 0,
    aciklama:
      'Sagital düzlem dikeydir ve beyni sağ ve sol parçalara ayırır. Tam ortadan geçerse median (orta sagital) düzlem adını alır. Koronal düzlem ön ile arkayı, transvers düzlem üst ile altı ayırır.',
    seviye: 'temel',
  },
  {
    soru: 'Omuriliğin enine (transvers) kesiti, başa göre hangi düzleme düşer?',
    secenekler: ['Başın sagital düzlemine', 'Başın koronal düzlemine', 'Başın yatay düzlemine', 'Başın eğik bir düzlemine'],
    dogru: 2,
    aciklama:
      'Omurilik dikey durur. Onu uzun eksenine dik kesen enine kesit, başın horizontal düzleminde alınır. Beyin sapında ise enine kesit, beyin sapının uzun eksenine dik alınır.',
    seviye: 'temel',
  },
  {
    soru: 'İki beyin yarımküresini birbirine bağlayan ana lif köprüsü hangisidir?',
    secenekler: ['Ön komissür', 'Korpus kallozum', 'Arka komissür', 'Forniks'],
    dogru: 1,
    aciklama:
      'Korpus kallozum yarımküreler arasındaki ana bağlantıdır ve 200 milyondan fazla lif taşır (Arda ve Akay, 2019). Ön komissür de iki yarımküreyi bağlayan bir beyaz cevher yoludur.',
    seviye: 'temel',
  },
  {
    soru: 'Bir mikrometre (µm) milimetrenin ne kadarıdır?',
    secenekler: ['Onda biri', 'Yüzde biri', 'Bin katı', 'Binde biri'],
    dogru: 3,
    aciklama:
      'Bir mikrometre milimetrenin binde biridir; bir nanometre de mikrometrenin binde biridir. Aksonların kalınlığı mikrometreyle, sinaptik aralık nanometreyle ölçülür.',
    seviye: 'temel',
  },
  {
    soru: 'Radyolojik gösterimdeki bir aksiyel kesite nereden bakılıyormuş gibi olur?',
    secenekler: ['Hastanın ayak ucundan', 'Başın tepesinden', 'Hastanın sol yanından', 'Hastanın arkasından'],
    dogru: 0,
    aciklama:
      'Radyologlar hastanın solunu ekranın sağında görmeyi sever. Bu, kesite hastanın ayak ucundan bakmak gibidir. Nörolojik gösterimde ise kesite başın tepesinden bakılır.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin görüntüsünde sağ ile solu yalnızca bakarak ayırmak neden zordur?',
    secenekler: [
      'BT kesitinde taraf bilgisi olmaz',
      'MR yalnızca bir yarıyı gösterir',
      'Sağ yarı hep daha küçük görünür',
      'İki yarı büyük ölçüde simetriktir',
    ],
    dogru: 3,
    aciklama:
      'Beynin iki yarısı büyük ölçüde birbirinin aynadaki görüntüsüdür. Ön ile arka karışırsa hemen fark edilir, sağ ile sol karışırsa çoğu zaman fark edilmez. Bu yüzden taraf, görüntüdeki R ve L işaretlerinden okunur.',
    seviye: 'temel',
  },
  {
    soru: 'Bir beyin koordinatındaki üç sayının anlamını bilmek için hangi üç bilgi gerekir?',
    secenekler: [
      'Hastanın yaşı, boyu ve kilosu',
      'Cihazın gücü, çekim süresi ve kesit sayısı',
      'Başlangıç noktası, eksenlerin anlamı ve birim',
      'Görüntünün rengi, parlaklığı ve büyüklüğü',
    ],
    dogru: 2,
    aciklama:
      'Bir koordinatı yorumlamak için sayıların hangi noktadan ölçüldüğünü, her eksenin hangi yöne büyüdüğünü ve birimin ne olduğunu bilmek gerekir. Biri eksikse aynı sayılar farklı yerleri gösterebilir.',
    seviye: 'temel',
  },
  {
    soru: 'RAS+ kuralında hastanın solundaki bir noktanın x değeri nasıldır?',
    secenekler: ['Eksidir', 'Artıdır', 'Her zaman sıfırdır', 'Hastanın boyuna göre değişir'],
    dogru: 0,
    aciklama:
      'RAS+ kuralında x ekseni hastanın sağına doğru büyür. Yönler hastaya göre söylendiği için hastanın solundaki bir nokta eksi x değeri alır.',
    seviye: 'temel',
  },
  {
    soru: 'DSÖ’ye göre ameliyat yeri hangi işaretle gösterilmemelidir?',
    secenekler: ['Yeri gösteren bir ok', 'Çarpı (X) işareti', 'Cerrahın baş harfleri', 'Cerrahın imzası'],
    dogru: 1,
    aciklama:
      'Çarpı işareti “burası ameliyat edilmeyecek” diye yanlış anlaşılmıştır; bu yüzden kullanılmaz. İşaret ok, imza ya da baş harflerle, silinmeyen bir kalemle yapılabilir.',
    seviye: 'temel',
  },
  {
    soru: 'Karşındaki kişinin sağını solunu bulmak neden daha zordur?',
    secenekler: [
      'İnsanların çoğu solaktır',
      'Sağ-sol yalnızca aynada vardır',
      'Yüzler hep asimetrik olduğu için',
      'Onu zihninde döndürmen gerekir',
    ],
    dogru: 3,
    aciklama:
      'Karşındaki kişinin sağı, senin solunun tam karşısındadır. Bunu çözmek için zihinsel döndürme gerekir. Tıp öğrencilerini en çok zorlayan durum da budur.',
    seviye: 'temel',
  },
  {
    soru: 'Nasiondan iniona, saçlı derinin tam ortasından çizilen çizgi beynin hangi yapısının üstünden geçer?',
    secenekler: [
      'İki yarımküreyi ayıran boylamsal yarık',
      'Merkezî oluğun alt ucunun hemen üstü',
      'Lateral oluğun arka dalının başlangıcı',
      'Beyinciğin iki yarısının buluştuğu yer',
    ],
    dogru: 0,
    aciklama:
      'Gray’e göre nasion–inion orta hattı yarımkürenin üst sınırını gösterir ve boylamsal yarığa karşılık gelir (Gray, 1918). Merkezî oluk bu çizgiyi ortasının biraz arkasında keser; lateral oluk ise yandadır. Beyincik için güvenilir bir yüzey işareti yoktur.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin cerrahisinde yan karıncığa önden girmek için en çok kullanılan nokta hangisidir?',
    secenekler: ['Dandy noktası', 'Frazier noktası', 'Kocher noktası', 'Keen noktası'],
    dogru: 2,
    aciklama:
      'Kocher noktası yan karıncığa önden girişte en çok kullanılan noktadır. Ölçüsü kaynağa göre değişir; örneğin koronal dikişin 1–2 cm önü ve orta hattın 2–3 cm yanı. Tüp yan karıncığın ön boynuzuna girer (Vigo ve ark., 2020). Keen, Frazier ve Dandy noktaları arkadan giriş içindir.',
    seviye: 'temel',
  },
  {
    soru: 'Bir tıp terimini çözerken hangi parçadan başlamak önerilir?',
    secenekler: ['Sonekten', 'Önekten', 'Kökten', 'Bağlayıcı ünlüden'],
    dogru: 0,
    aciklama:
      'Terimin tanımı sonekten başlanarak kurulur. Örneğin ensefalitte sonek -itis iltihap, kök encephal/o beyin demektir. Ensefalit, beyin iltihabıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Latince “gyrus” (kıvrım) sözcüğünün çoğulu hangisidir?',
    secenekler: ['Gyrae', 'Gyrus', 'Gyri', 'Gyra'],
    dogru: 2,
    aciklama:
      '-us ile biten çoğu Latince sözcük çoğulda -i alır: gyrus → gyri, sulcus → sulci, nucleus → nuclei. TA2’nin başlıklarında da gyri cerebri (beyin kıvrımları) geçer.',
    seviye: 'temel',
  },
  {
    soru: 'TA2’nin notuna göre 1895 listesi “ara” konum için neden intermedius sözcüğünü seçti?',
    secenekler: [
      'Latince medius sözcüğünün çoğulu olduğu için',
      'Kölliker karşılaştırmalı anatomi için önerdiği için',
      'Sesleri benzeyen medius ile medialis yan yana gelmesin diye',
      'Ön ile arka arasındaki konumu göstermek için',
    ],
    dogru: 2,
    aciklama:
      'Intermedius, iç yan (medialis) ile dış yan (lateralis) arasındaki konum içindir. 1895 listesi bu sözcüğü, birbirine benzeyen medius ile medialis yan yana gelmesin diye seçti. Medius ise ön ile arka ya da iç ile dış arasındaki konumu gösterir.',
    seviye: 'lisans',
  },
  {
    soru: '1895 komisyonu kranial ve kaudal terimlerine nasıl yaklaştı?',
    secenekler: [
      'İnsan yapılarına ad vermede hantal buldu; gövdede karşılaştırmalı anatomi için onayladı',
      'Üst ve alt yerine bütün bedende zorunlu kıldı; eski çifti listeden çıkardı',
      'Yalnızca beyin ve omurilikte, eksene göre yön bildirmek için önerdi',
      'Tamamen yasakladı ve iki terimi genel terimler listesinden sildi',
    ],
    dogru: 0,
    aciklama:
      'TA2’nin notuna göre 1895 komisyonu kranial ve kaudalı insan yapılarına ad vermede hantal buldu. Yine de karşılaştırmalı anatomi gereken yerde, gövdede yön bildirmek için onayladı. Ders kitapları ise üstü kranial ile eş tutar.',
    seviye: 'lisans',
  },
  {
    soru: 'Orta beyinde tavan (tektum) ile taban, eksene göre nasıl adlandırılır?',
    secenekler: [
      'Tektum ventral, taban dorsal',
      'Tektum rostral, taban kaudal',
      'Tektum kaudal, taban rostral',
      'Tektum dorsal, taban ventral',
    ],
    dogru: 3,
    aciklama:
      'Beyin sapında dorsal arkaya, ventral öne bakar. Tektum, karıncık sisteminin dorsalindeki tavandır ve orta beyinde arkada durur. Taban ise öndedir; beyin sapının en ventralindeki büyük lif kütlesi bu taraftadır.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e göre embriyodaki hangi bükülmenin dışbükey yüzü öne bakar ve başın biçimini etkilemez?',
    secenekler: ['Pontin fleksura', 'Sefalik fleksura', 'Servikal fleksura', 'Telensefalik fleksura'],
    dogru: 0,
    aciklama:
      'Sefalik ve servikal fleksuralar karın tarafına içbükeydir ve başın bükülmeleriyle birlikte oluşur. Pontin fleksura ise gelecekteki pons bölgesindedir; dışbükeyliği öne bakar ve başı etkilemez.',
    seviye: 'lisans',
  },
  {
    soru: 'TA2’de “parasagital düzlem” için kullanılan resmî ad hangisidir?',
    secenekler: ['Planum paramedianum', 'Planum medianum', 'Plana coronalia', 'Plana transversa'],
    dogru: 0,
    aciklama:
      'TA2, median düzleme paralel düzlemlere planum paramedianum der; “parasagital” yalnızca ilişkili bir addır. Planum medianum tam ortadaki düzlemdir. Plana coronalia koronal, plana transversa transvers düzlemlerdir (FIPAT, 2019).',
    seviye: 'lisans',
  },
  {
    soru: 'Omuriliğin gri sütunları neden transvers kesitte “boynuz” adını alır?',
    secenekler: [
      'Gri cevher bu kesitte görülmediği için boynuz beyaz cevherin adıdır',
      'Sütunlar yalnızca koronal kesitte göründüğü için ad oradan gelir',
      'Boynuzlar beyin sapında, sütunlar yalnızca omurilikte bulunur',
      'Uzun eksen boyunca uzanan sütunlar, enine kesitte boynuz gibi görünür',
    ],
    dogru: 3,
    aciklama:
      'Gri sütunlar omuriliğin uzun ekseni boyunca uzanır ve ancak boylamsal kesitte bütün olarak görülür. Omurilik alışkanlıkla transvers kesitlerle incelendiği için sütunlar bu kesitte boynuz gibi görünür. TA2’ye göre iki sözcük aslında eş anlamlıdır (FIPAT, 2019).',
    seviye: 'lisans',
  },
  {
    soru: '17.141 sağlıklı kişiyle yapılan ENIGMA çalışmasında sol yarımkürenin kabuğu sağa göre nasıl bulundu?',
    secenekler: [
      'Genel olarak daha kalın, ama yüzey alanı daha küçük',
      'Genel olarak daha ince, ama yüzey alanı daha büyük',
      'Kalınlığı da yüzey alanı da iki yanda tümüyle eşit',
      'Yalnızca solaklarda daha kalın ve daha geniş',
    ],
    dogru: 0,
    aciklama:
      'Sol yarımkürede kabuk genel olarak daha kalın, yüzey alanı ise daha küçük bulundu. Asimetrilerle el tercihi arasında anlamlı bir ilişki çıkmadı (Kong ve ark., 2018).',
    seviye: 'lisans',
  },
  {
    soru: 'BT’de orta hat kayması ölçülürken çoğu yazar hangi yapının yer değiştirmesine bakar?',
    secenekler: ['Korpus kallozumun', 'Hipokampusun', 'Septum pellucidumun', 'Dördüncü karıncığın'],
    dogru: 2,
    aciklama:
      'Çoğu yazar, yan karıncıkların ön boynuzları arasındaki ince zarın, yani septum pellucidumun ideal orta hattan sapmasını ölçer. Epifiz ve üçüncü karıncık da kullanılabilen orta hat yapılarıdır (Liao ve ark., 2018).',
    seviye: 'lisans',
  },
  {
    soru: 'Radyolojik gösterimdeki bir koronal kesitte ekranın sağında hastanın hangi yanı görünür?',
    secenekler: ['Hastanın sağı', 'Hastanın ön yüzü', 'Hastanın solu', 'Hastanın tepesi'],
    dogru: 2,
    aciklama:
      'Radyolojik gösterimde koronal kesite hastanın önünden bakılır. Karşında duran birine bakar gibisin: onun solu senin sağında kalır. Nörolojik gösterimde ise koronal kesite arkadan bakılır.',
    seviye: 'lisans',
  },
  {
    soru: 'HARNESS-MRI protokolündeki iki boyutlu koronal T2 çekimi hangi yönde alınır?',
    secenekler: ['AC–PC çizgisine paralel', 'Hipokampusun uzun eksenine dik', 'Orbitomeatal çizgiye paralel', 'Mıknatısa göre tam aksiyel'],
    dogru: 1,
    aciklama:
      'HARNESS-MRI üç çekimden oluşur: üç boyutlu T1, üç boyutlu FLAIR ve hipokampusun uzun eksenine dik iki boyutlu koronal T2. Bu eğik koronal kesitler hipokampusu enine keser.',
    seviye: 'lisans',
  },
  {
    soru: 'DICOM’un LPS kuralı ile NIfTI’nin RAS+ kuralı arasındaki fark nedir?',
    secenekler: [
      'Yalnızca z ekseninin işareti terstir',
      'İlk iki eksenin (x ve y) işareti terstir',
      'Biri milimetre, öbürü santimetre kullanır',
      'İkisinin başlangıç noktası da ön komissürdür',
    ],
    dogru: 1,
    aciklama:
      'DICOM’da x sola, y arkaya, z başa doğru artar. NIfTI’de x sağa, y öne, z yukarı doğru artar. Tek fark ilk iki koordinatın işaretidir; z ekseni ikisinde de yukarı doğru büyür.',
    seviye: 'lisans',
  },
  {
    soru: 'MNI şablonu Talairach beynine göre nasıldır?',
    secenekler: [
      'Daha kısa ve alçaktır; şakak lobları küçüktür',
      'Talairach beyniyle birebir aynı boyuttadır',
      'Yalnızca sol yarımküresi daha büyüktür',
      'Daha uzun ve yüksektir; şakak lobları büyüktür',
    ],
    dogru: 3,
    aciklama:
      'MNI şablonu Talairach beyninden daha uzun ve daha yüksektir; şakak lobları da daha büyüktür. Bu yüzden aynı koordinat iki uzayda biraz farklı yerleri gösterir ve MNI ile Talairach sayıları doğrudan karşılaştırılmaz.',
    seviye: 'lisans',
  },
  {
    soru: 'Cohen ve arkadaşlarının 35 yanlış yer kraniyotomisinde bulduğu etken gruplarından hangisi değildir?',
    secenekler: ['İletişim kopukluğu', 'Teknik etkenler ve görüntüleme', 'Hastanın yaşı ve cinsiyeti', 'Yetersiz ameliyat öncesi denetim'],
    dogru: 2,
    aciklama:
      'Dört grup şunlardır: iletişim kopukluğu, yetersiz ameliyat öncesi denetim, teknik etkenler ve görüntüleme, insan hatası. Yazarlara göre olguların hemen hepsi, protokollere sıkı uyulsaydı önlenebilirdi.',
    seviye: 'lisans',
  },
  {
    soru: 'DSÖ kontrol listesindeki cerrahi duraklama (time-out) ne zaman yapılır?',
    secenekler: ['Hasta servise yatarken', 'Kesiden hemen önce', 'Anestezi bittikten sonra', 'Ameliyattan bir gün önce'],
    dogru: 1,
    aciklama:
      'Cerrahi duraklama, kesiden hemen önce yapılan kısa bir duraklamadır. Ekip hastayı, işlemi ve ameliyat yerini doğrular. Doğru hastanın temel görüntülerinin ameliyathanede gösterildiğini de denetler.',
    seviye: 'lisans',
  },
  {
    soru: 'Taylor–Haughton yönteminde merkezî oluğun üst ucu (üst Rolando noktası) nerededir?',
    secenekler: [
      'Nasion–inion yayının %25 işaretinin 2 cm önünde',
      'Nasion–inion yayının %50 işaretinin 2 cm arkasında',
      'Nasion–inion yayının %75 işaretinin 2 cm arkasında',
      'Bregmanın 2 cm önünde, orta hat üzerinde',
    ],
    dogru: 1,
    aciklama:
      'Merkezî oluk %50 işaretinin 2 cm arkasından başlar. Sylvius çizgisinin kondil çizgisiyle kesiştiği yerde (alt Rolando noktası) biter. %75 işareti Sylvius çizgisinin ucudur. Bregmadan ölçülürse üst Rolando noktası yaklaşık 5 cm arkadadır (Vigo ve ark., 2020).',
    seviye: 'lisans',
  },
  {
    soru: 'EEG’nin 10–20 sisteminde C3 ve C4 elektrotları motor kabuğu bulmak için de kullanılır. MR’la yapılan karşılaştırmalar ne gösterdi?',
    secenekler: [
      'Her kişide tam presantral girusun üstüne düştüler',
      'Çoğu kişide oksipital lobun üstüne düştüler',
      'Yalnızca bebeklerde presantral girusa düştüler',
      'Yalnızca %13’ünde presantral girusa düştüler',
    ],
    dogru: 3,
    aciklama:
      'Okamoto verisinde C3 ve C4 olguların yalnızca %13’ünde presantral girusa izdüştü. Başka bir çalışmada ortalama yerleri postsantral girusa daha yakındı (Scrivener ve Reader, 2022). Bu yüzden bu iki elektrot motor kabuğu kişiler arasında güvenilir biçimde göstermez.',
    seviye: 'lisans',
  },
  {
    soru: 'TA2’deki adlara göre Latince “plexus” (ağ) sözcüğünün çoğulu nedir?',
    secenekler: ['Plexi', 'Plexa', 'Plexae', 'Plexus'],
    dogru: 3,
    aciklama:
      'TA2’de sinir ağları plexus nervosi diye geçer; yani çoğulu da plexus’tur. Sinus da öyledir: TA2’de sinus venosi durales geçer. Bazı ders kaynakları “plexi” yazar, ama bu biçim TA2’de hiç geçmez.',
    seviye: 'lisans',
  },
  {
    soru: 'TA2 kişi adlı terimleri (eponimleri) nasıl verir?',
    secenekler: [
      'Resmî ad olarak, betimleyici adın önünde',
      'İlişkili terim olarak, resmî adın yanında',
      'Köşeli parantez içinde, resmî adın parçası olarak',
      'Hiç vermez; bütünüyle listeden çıkarmıştır',
    ],
    dogru: 1,
    aciklama:
      'TA2 kişi adlarını resmî ad yapmaz; ilişkili terim olarak verir. Örneğin merkezî oluğun resmî adı sulcus centralis’tir; “fissure of Rolando” ilişkili terimdir. Köşeli parantez ise 1895’teki BNA’nın yöntemiydi.',
    seviye: 'lisans',
  },
  {
    soru: 'TA2 neden “velum medullare anterius” yerine “velum medullare superius” adını kullanır?',
    secenekler: [
      'Örtü, alt (arka) örtünün önünde ve altında durduğu için',
      'Eski ad bir kişi adı (eponim) olduğu için',
      'Latince anterius sıfatı dil bilgisi bakımından yanlış olduğu için',
      'Örtü, alt (arka) örtünün epey üstünde, önünde ise çok az olduğu için',
    ],
    dogru: 3,
    aciklama:
      'TA2’de korunan 1955 tarihli bir nota göre “anterius” sıfatı biçime dayalı bir gerekçeyle konmuştur ve yanıltıcıdır. Bu örtü, alt medüller örtünün (eski adı arka medüller örtü) epey üstündedir; önünde ise yalnızca çok azdır. Örtü dördüncü karıncığın çatısının en üst bölümünü oluşturur.',
    seviye: 'ileri',
  },
  {
    soru: 'Gerdes ve arkadaşlarının (1975) stereotaksi röntgenlerinde bildirdiği hata kaynağı nedir?',
    secenekler: [
      'Yüzüstü yatışta yön adlarının hastaya göre tersine dönmesi',
      'Sert zardan hava girince yapıların ense tarafına birkaç milimetre kayması',
      'Röntgen filmlerinde hastanın sağı ile solunun yer değiştirmesi',
      'Beyin sapı ekseninin her hastada tam aynı konumda bulunması',
    ],
    dogru: 1,
    aciklama:
      'Yazarlar, sert zarda açılan delikten hava girerse beynin geriye çökebileceğini bildirdi. Sırtüstü yatan hastada bütün yapılar birkaç milimetre ense (oksipital) tarafına kayabilir. Yatış yön adlarını değiştirmez, ama koordinatla hedeflemede hata kaynağı olabilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Coulombe ve arkadaşlarının tahminine göre ponto-mezensefalik bileşke (PMJ) düzlemi ile AC–PC düzlemi arasındaki fark yaklaşık ne kadardır?',
    secenekler: ['5 derece', '10 derece', '20 derece', '22 derece'],
    dogru: 1,
    aciklama:
      'Yazarlar PMJ ile AC–PC düzlemi arasında yaklaşık 10 derece fark tahmin eder. PMJ ile Paxinos ve arkadaşlarının 2020 tarihli atlasının düzlemi arasındaki farkı 20 derece tahmin ederler. 22 derece ise bazı talamus atlaslarında kesitlerin interkomissural düzleme en büyük eğimidir.',
    seviye: 'ileri',
  },
  {
    soru: 'Prozomerik model beynin uzun eksenini neye dayandırır?',
    secenekler: [
      'Notokordun tetiklediği orta hat taban plağına',
      'Orta beyin su yolunun doğrultusuna',
      'Sınır oluğunun uç beyinde bittiği varsayımına',
      'Talairach’ın tanımladığı AC–PC çizgisine',
    ],
    dogru: 0,
    aciklama:
      'Prozomerik model uzun eksenini, notokordun erken dönemde oluşmasını tetiklediği orta hattaki taban plağı boyunca kurar. Eksen başvurusu olarak taban plağını ve alar–bazal sınırını kullanır. Eksenin uç beyinde bittiği varsayımı Herrick’in kolumnar modeline aittir.',
    seviye: 'ileri',
  },
  {
    soru: '1895 tarihli Basel terim listesinde transversalis ile transversus arasındaki fark neydi?',
    secenekler: [
      'İkisi de vücut eksenine enine demekti; yalnızca yazımları farklıydı',
      'Transversalis yatay, transversus dikey düzlem için kullanılırdı',
      'Transversalis vücut eksenine, transversus ilgili organın eksenine enine demekti',
      'Transversalis omurilik, transversus beyin sapı kesitleri için kullanılırdı',
    ],
    dogru: 2,
    aciklama:
      'TA2’deki nota göre Basel listesinde transversalis vücut eksenine, transversus ilgili organın eksenine enine demekti. Bu ayrım bugün gözetilmediği için transversalis genel terim olarak listeden çıkarıldı (FIPAT, 2019).',
    seviye: 'ileri',
  },
  {
    soru: 'Wagstyl ve arkadaşları BigBrain’de kabuğun altı katmanını neden tek tek koronal kesitlerde değil, üç boyutlu hacimde bölütledi?',
    secenekler: [
      'Eğik kesilen kıvrımlarda katmanlar tek bir kesitte seçilemediği için',
      'BigBrain kesitleri boyanmadığı için katmanlar hiç görünmediğinden',
      'BigBrain yalnızca sagital kesitlerden oluşan bir model olduğu için',
      'BigBrain’in koronal kesitleri 2 cm kalınlığında olduğu için',
    ],
    dogru: 0,
    aciklama:
      'BigBrain’in özgün kesit düzlemi koronaldir ve kesitler 20 µm kalınlığındadır. Kesit kabuğu eğik kestiği yerlerde kıvrımın yalnızca bir parçası görünür ve katmanların çoğu seçilemez. Bu yüzden katmanlar üç boyutlu hacimde bölütlendi. Kullanılan yoğunluk profilleri kesit düzlemine göre eğikti, ama kabuğun sütunlarına yakın bir doğrultudaydı (Wagstyl ve ark., 2020).',
    seviye: 'ileri',
  },
  {
    soru: 'Bir makale beyin torkunu “saat yönünde”, bir başkası “saat yönünün tersine” bir burulma diye anıyor. Fark en olası nereden gelir?',
    secenekler: [
      'Birinin şempanze, ötekinin insan beynini incelemesinden',
      'İki çalışmanın farklı yaş gruplarını incelemesinden',
      'Torkun solak kişilerde ters yöne dönmesinden',
      'Burulmaya alttan ya da üstten bakılmasından',
    ],
    dogru: 3,
    aciklama:
      'Kong ve arkadaşları torku alttan bakıldığında saat yönünde bir burulma diye tanımlar. Xiang ve arkadaşları aynı asimetriye saat yönünün tersine tork der. Bir dönmeye alttan bakınca saat yönünde görünen hareket, üstten bakınca saatin tersine görünür.',
    seviye: 'ileri',
  },
  {
    soru: 'Kemirgendeki “ventral hipokampus”un insanda hangi bölgeye karşılık geldiği düşünülür?',
    secenekler: ['Arka hipokampusa', 'Ön hipokampusa', 'Hipokampusun üst yüzüne', 'Parahipokampal kıvrıma'],
    dogru: 1,
    aciklama:
      'Kemirgende hipokampusun uzun eksenine ventral–dorsal eksen denir; insanda benzer değişimin ön–arka eksen boyunca olduğu düşünülür. Bu yüzden kemirgendeki ventral hipokampus insanda ön hipokampusa karşılık gelir (Vogel ve ark., 2020).',
    seviye: 'ileri',
  },
  {
    soru: 'Park ve arkadaşlarına göre kantomeatal çizgi, Reid taban çizgisine göre nasıl durur?',
    secenekler: ['Ona tam diktir', 'Ona tam paraleldir', 'Yaklaşık 30° burun aşağıdır', 'Yaklaşık 10° burun yukarıdır'],
    dogru: 3,
    aciklama:
      'Radyologların BT ile birlikte geliştirdiği kantomeatal çizgi, Reid çizgisine göre yaklaşık 10 derece burun yukarıdır. Bu yüzden iki çizgiye göre alınan aksiyel kesitlerin açısı farklı olur.',
    seviye: 'ileri',
  },
  {
    soru: 'Glen ve arkadaşlarının AFNI’deki sağ-sol çevrilme denetimi için hangisi doğrudur?',
    secenekler: [
      'Yanlış başlığı kesin olarak gösterir',
      'Makakta insandan daha başarılıdır',
      'Göreli çevrilmeyi bulur, mutlak olanı değil',
      'Yalnızca BT görüntülerinde çalışır',
    ],
    dogru: 2,
    aciklama:
      'Yöntem 178 insan katılımcının hepsinde doğru öneri verdi; daha simetrik makak beyninde başarı %89’a düştü. Ama yalnızca iki görüntü arasındaki göreli çevrilmeyi bulur. Hangisinin başlığının yanlış olduğunu söyleyemez.',
    seviye: 'ileri',
  },
  {
    soru: 'Çerçeve merkezli RAS+ koordinatı (8, −6, 15) mm olan bir noktanın Leksell koordinatı hangisidir?',
    secenekler: ['(92, 94, 85)', '(108, 94, 85)', '(92, 106, 115)', '(108, 106, 115)'],
    dogru: 0,
    aciklama:
      'Leksell çerçevesinde X sola, Y öne, Z aşağı doğru artar ve merkez (100, 100, 100) sayılır. Dönüşüm X = 100 − R, Y = 100 + A, Z = 100 − S’dir: X = 100 − 8 = 92, Y = 100 + (−6) = 94, Z = 100 − 15 = 85.',
    seviye: 'ileri',
  },
  {
    soru: 'Schaltenbrand tanımında AC–PC çizgisi nereden çizilir ve başlangıç noktası neresidir?',
    secenekler: [
      'AC’nin üst kenarından PC’nin alt kenarına; başlangıç AC',
      'AC’nin arka kenarından PC’nin ön kenarına; başlangıç PC',
      'AC’nin merkezinden PC’nin merkezine; başlangıç MCP',
      'Açık bir çizgi tanımı yoktur; başlangıç PC’nin üstü',
    ],
    dogru: 2,
    aciklama:
      'Schaltenbrand tanımında çizgi iki komissürün merkezlerini birleştirir; başlangıç, çizginin ortası olan orta komissürel noktadır (MCP). Talairach üst ve alt kenarları, klinik tanım ise AC’nin arka ve PC’nin ön kenarını kullanır.',
    seviye: 'ileri',
  },
  {
    soru: 'Rapordaki taraf hatalarında hastanın cinsiyetiyle ilgili hangisi doğrudur?',
    secenekler: [
      'Bütün çalışmalar kadınlarda daha sık bulur',
      'Bütün çalışmalar erkeklerde daha sık bulur',
      'Bu konu hiç araştırılmamıştır',
      'Bulgular tutarsızdır; genelleme yapılamaz',
    ],
    dogru: 3,
    aciklama:
      'Sangwaiya ve arkadaşları hataları kadın hastalarda daha sık buldu (58’e karşı 30). Landau ve arkadaşlarının özetine göre ise erkek hastalarda daha çok hata yakalandı. Bu yüzden bir genelleme yapılamaz.',
    seviye: 'ileri',
  },
  {
    soru: 'ABD Gaziler sağlık sistemindeki kök neden analizlerinde en sık bulunan neden hangisiydi?',
    secenekler: [
      'Cerrahi duraklamanın yanlış ya da eksik yapılması',
      'Ameliyat yerinin silinebilen kalemle işaretlenmesi',
      'Onam formunda tarafın hiç yazılmamış olması',
      'Görüntü başlığına yanlış yön bilgisi girilmesi',
    ],
    dogru: 0,
    aciklama:
      'Kök neden analizi, bir olayın altında yatan nedenleri arayan incelemedir. Neily ve arkadaşlarının verisinde 277 olayın kök neden analizi 507 neden buldu. Bunların %28,4’ü cerrahi duraklamayla ilgiliydi: duraklama yanlış ya da eksik yapılmıştı.',
    seviye: 'ileri',
  },
  {
    soru: 'Çin’de karıncıkları normal olan hastalarda yapılan bir BT benzetim çalışmasında Kocher noktasından hangi koronal yönlendirme karıncığa en az (%13,3) girdi?',
    secenekler: ['Karşı taraf iç göz köşesine', 'Kafatasına dik', 'Aynı taraf iç göz köşesine', 'İki kulak yolunun orta noktasına'],
    dogru: 2,
    aciklama:
      'Karıncıkları normal 206 hastanın BT’sinde 412 sanal ponksiyon (bilgisayarda karıncığa delerek girme denemesi) yapıldı. Aynı taraf iç göz köşesi yolu %13,3 doğruluk verdi. İki kulak yolunun ortası %74,5, dik yol %90,5, karşı taraf iç göz köşesi %100 doğruluk verdi. İki ön boynuzun genişliği 45 mm’nin altındayken aynı taraf yolu %8,2, üstündeyken %73,5 tuttu (Chen ve ark., 2024). Klasik tarif aynı taraf iç göz köşesini söylediği için bu bulgu önemlidir (Muralidharan, 2015).',
    seviye: 'ileri',
  },
  {
    soru: 'TMS’deki 5 cm kuralının ıskalama oranı için kaynaklar farklı sayılar verir: “üçte birden fazla” ve “üçte ikiden fazla”. Fark büyük ölçüde nereden gelir?',
    secenekler: [
      'Ölçümlerin farklı birimlerle yapılmasından',
      'Hedefin tanımından: bütün DLPFC ya da yalnızca 9. alan',
      'Birinin bebeklerde, ötekinin erişkinlerde yapılmasından',
      'Birinin başlıkla, ötekinin mezurayla ölçmesinden',
    ],
    dogru: 1,
    aciklama:
      'Bir çalışma kuralın DLPFC’yi olguların üçte birinden fazlasında ıskaladığını yazar (Mir-Moghtadaei ve ark., 2015). Başka bir kaynak ise kuralın erişkinlerin üçte ikisinden fazlasında 9. alanı ıskaladığını aktarır (Deng ve ark., 2023). Biri bütün bölgeyi, öteki yalnızca 9. alanı hedef alır.',
    seviye: 'ileri',
  },
  {
    soru: 'TA2’nin IFAA tarafından onaylandığı yıl için kaynaklar ne söyler?',
    secenekler: [
      'Çoğu 2020 der; bir kaynak 2021 verir',
      'Hepsi 2019 der; kaynaklar arasında fark yoktur',
      'Çoğu 1998 der; bir kaynak 2011 verir',
      'Hepsi 2016 der; taslak hemen kabul edilmiştir',
    ],
    dogru: 0,
    aciklama:
      'TA2 2019’da çevrim içi yayımlandı. Gobée ve arkadaşları, Waschke ve ten Donkelaar ve arkadaşları IFAA onayını 2020’ye koyar. Pretterklieber 2021 der. FIPAT taslağı 2016’da geçici olarak onaylamıştı.',
    seviye: 'ileri',
  },
  {
    soru: 'Neumann ve arkadaşlarına (2026) göre Latince sıfat ekinde -alis ile -aris arasındaki kural nedir?',
    secenekler: [
      'Her zaman -aris yazılır; -alis eski baskılarda kalmış bir biçimdir',
      'Kök Yunancaysa -alis, Latinceyse -aris; harflere bakılmaz',
      'Varsayılan -alis; kökte l varsa -aris, araya r girerse yine -alis',
      'Varsayılan -aris; kökte r varsa ek -alis biçimine döner',
    ],
    dogru: 2,
    aciklama:
      'Varsayılan ek -alis’tir. Kökte l harfi varsa ek -aris olur. Ama l ile ek arasına r girerse yine -alis kalır. Bu yüzden lateralis yazılır.',
    seviye: 'ileri',
  },
];
