import type { DersBolumu } from '../../../types';

/** Karıncık sahnesinin renkleri (yalnızca tanıtır). */
const YAN_KARINCIK = '#4f8de0';
const MONRO = '#f2b544';
const UCUNCU = '#25b9a3';
const SU_YOLU = '#8a6fd8';
const DORDUNCU = '#ee6a92';

/** 5. bölüm: beynin büyük bölümleri — büyük beyin, ara beyin, beyin sapı, beyincik ve karıncıklar; içerik, sayılar, klinik iz. */
export const beyninBolumleri: DersBolumu = {
  id: 'beynin-bolumleri',
  baslik: 'Beynin bölümleri: büyük beyin, ara beyin, beyin sapı, beyincik ve karıncıklar',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyni bir harita gibi dört büyük bölgeye ayırarak inceleriz (OpenStax 13.2):

- **Büyük beyin** (*cerebrum*) en büyük bölümdür. İki yarımküreden oluşur. Dışta kıvrımlı **beyin kabuğu** (*cortex cerebri*), altında beyaz cevher, derinde gri cevher çekirdekleri bulunur (OpenStax 13.2; Dafny, 2020).
- **Ara beyin** (*diencephalon*) büyük beynin altında, içeride saklıdır. En önemli parçaları **talamus** ve **hipotalamustur** (OpenStax 13.2).
- **Beyin sapı** (*truncus encephali*) beyni omuriliğe bağlar. Kalbi, damarları ve solunumu düzenleyen merkezler buradadır (OpenStax 13.2).
- **Beyincik** (*cerebellum*) beyin sapının arkasında durur. Denge, eşgüdüm ve hareket becerileriyle ilgilidir (Spielman ve ark., 2020).

Beyin sapı da yukarıdan aşağıya üç kattan oluşur. En üstte **orta beyin** (*mesencephalon*) vardır. Ortada **pons** (*pons*), en altta **omurilik soğanı** (*medulla oblongata*) bulunur (OpenStax 13.1).

Beynin içinde ise sıvıyla dolu boşluklar vardır. Bu boşluklar birbirine açılır. Onlara **karıncıklar** (*ventriculi*) denir.`,
    },
    {
      tur: 'sahne',
      baslik: 'Dört bölüm bir arada',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Renkler dört bölümü gösterir: mavi büyük beyin, turkuaz ara beyin, mor beyin sapı, turuncu beyincik. Ara beyin içeride saklıdır, bu yüzden bu bakışta görünmez. “Alttan” bakışa geç: beyin sapının önünde turkuaz hipotalamusu ve ona asılı hipofiz bezini görürsün. Bir parçaya dokununca adı ve görevi açılır.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'sap'],
        renk: 'bolge',
        gizle: ['bolge:sinir'],
        bakis: 'sol',
        etiketler: [
          { yapi: 'ust-parietal-lobul-sol', metin: 'Büyük beyin' },
          { yapi: 'beyincik', metin: 'Beyincik' },
          { yapi: 'pons', metin: 'Beyin sapı (pons)' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Dört bölge:** büyük beyin, ara beyin, beyin sapı (orta beyin + pons + omurilik soğanı), beyincik.
- **Dört karıncık:** iki yan karıncık büyük beyinde, üçüncü karıncık ara beyinde, dördüncü karıncık beyinciğin önünde. Üçüncüyü dördüncüye, orta beyindeki beyin su yolu bağlar.
- **Kafa sinirlerinin çekirdekleri** çoğunlukla beyin sapındadır: III–IV orta beyinde, V–VIII ponsta, IX–XII omurilik soğanında.
- **Ters orantı:** beyincik beyin kütlesinin onda biri kadardır. Ama nöronların çoğunu taşır.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Adlar nereden geliyor?** Bölümlerin adları gelişimden gelir. Embriyoda beş ikincil kesecik oluşur. Her biri erişkinde bir bölümü yapar (Dafny, 2020; OpenStax 13.1):

- **Telensefalon** büyük beyni yapar.
- **Diensefalon** ara beyni yapar.
- **Mezensefalon** orta beyni yapar.
- **Metensefalon** ponsu ve beyinciği yapar.
- **Miyelensefalon** omurilik soğanını yapar.

Metensefalonun çatısı kalınlaşır ve beyincik olur. Tabanı ve yan duvarları kalınlaşır ve pons olur (Gray, 1918). Keseciklerin öyküsünü bu dersin Sinir borusundan beyne bölümünde bulursun. Ayrıntısı Anatomi bölümünün Beyin nasıl oluşur? dersinde.

**Serebrum ve beyin sapı: kaynaklara göre iki tanım.** Birincisi *serebrum*. OpenStax serebrumu telensefalonla bir tutar. Ara beyni ayrı bir bölge sayar (OpenStax 13.1, 13.2).

Uluslararası anatomi terimlerinin listesi Terminologia Anatomica’dır. Bugünkü 2. baskısına kısaca TA2 denir. Bu liste serebrumu ön beynin (prosensefalon) erişkindeki karşılığı olarak tanımlar. Yani serebrum, telensefalon ile diensefalonu birlikte kapsar. Liste erişkin beynini de üçe ayırır: serebrum, beyin sapı ve beyincik (FIPAT, 2019). Bu derste "büyük beyin" telensefalon anlamında kullanılıyor.

İkincisi *beyin sapı*. OpenStax ve TA2’ye göre beyin sapı orta beyin, pons ve omurilik soğanından oluşur. Beyincik metensefalondan gelir, ama beyin sapına katılmaz (OpenStax 13.1; FIPAT, 2019). UTHealth ders kitabında iki farklı anlatım var. Bir cümlesi ara beyni "beyin sapının en üst yapısı" diye anar. Aynı bölümün başka bir yeri ise beyin sapını üç kata ayırır (Dafny, 2020). Bu derste üç katlı tanım kullanılıyor.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beynin bölümleri: kökeni, parçaları, boşluğu ve işi',
      sutunlar: ['Bölge', 'Geldiği kesecik', 'Başlıca parçaları', 'Boşluğu', 'Başlıca işleri'],
      satirlar: [
        [
          '**Büyük beyin**',
          'Telensefalon (ön beyin)',
          'İki yarımküre, kabuk, beyaz cevher (korpus kallozum, iç kapsül), bazal çekirdekler',
          'Yan karıncıklar',
          'Bilinçli algı ve bilinçli yaşam, istemli hareket, dil, bellek ve öğrenme',
        ],
        [
          '**Ara beyin**',
          'Diensefalon (ön beyin)',
          'Talamus, hipotalamus, subtalamus, epitalamus',
          'Üçüncü karıncık',
          'Kokudan başka bütün duyuları kabuğa aktarıp işlemek; otonom sistemi ve ön hipofiz yoluyla hormonları yönetmek',
        ],
        [
          '**Orta beyin**',
          'Mezensefalon',
          'Tektum (üst ve alt tepecikler), tegmentum, beyin ayakları (*crura cerebri*)',
          'Beyin su yolu',
          'Görme (üst tepecik) ve işitme (alt tepecik); III., IV. kafa sinirlerinin ve V.’nin bir bölümünün çekirdekleri',
        ],
        [
          '**Pons**',
          'Metensefalon (arka beyin)',
          'Bazilar kısım (pons çekirdekleri ve enine lifler), tegmentum',
          'Dördüncü karıncık (ponsun arkasında)',
          'Karşı beyinciğe giden lifler; V–VIII. kafa sinirlerinin çekirdekleri; solunumu, kalbi ve damarları düzenleme',
        ],
        [
          '**Omurilik soğanı**',
          'Miyelensefalon (arka beyin)',
          'Piramitler; alt sınırda piramit çaprazlaşması; kapalı ve açık kısım',
          'Dördüncü karıncığın alt kısmı; merkezî kanal',
          'Solunum, yutma, terleme, mide salgısı, kalp ve damar hareketleri; IX–XII. kafa sinirlerinin çekirdekleri',
        ],
        [
          '**Beyincik**',
          'Metensefalon (arka beyin)',
          'Vermis ve iki yarımküre',
          'Önünde dördüncü karıncık',
          'Büyük beynin hareket bilgisini bedenden gelen duyu bilgisiyle karşılaştırmak; denge, eşgüdüm, hareket becerileri',
        ],
      ],
      not: 'Kaynaklar: OpenStax 13.1, 13.2, 13.3, 14.2; Dafny (2020); Gray (1918); FIPAT (2019); Spielman ve ark. (2020).',
    },
    {
      tur: 'metin',
      md: `**Büyük beyin.** İki yarımküreyi derin bir yarık birbirinden ayırır: **uzunlamasına yarık** (*fissura longitudinalis cerebri*). Derinde ise iki yarımküreyi kalın bir lif bandı bağlar: **korpus kallozum** (*corpus callosum*). Bu, iki yarımküre arasındaki ana iletişim yoludur (OpenStax 13.2). Bu kalın lif bandında yaklaşık 200 milyon akson vardır (Spielman ve ark., 2020).

Yarımkürenin dışını gri cevherden yapılmış kabuk örter. Kabuğun altında aksonlardan oluşan beyaz cevher vardır. Onun da derininde gri renkli nöron kümeleri bulunur; bunlara **çekirdek** denir (Dafny, 2020). En bilinenleri **bazal çekirdeklerdir** (*nuclei basales telencephali*). Bu çekirdekler, Parkinson hastalığında bozulan devrenin parçasıdır (OpenStax 13.2). Kabuğun yüzü, lobları ve işlev alanları bir sonraki bölümün konusu.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kabuğun altında: derin yapılar',
      aciklama:
        'Kabuk ve beyin sapı yarı saydam yapıldı. Derindeki yapılar kendi renkleriyle görünüyor. Beyne soldan, önden ve biraz yukarıdan bakıyoruz. Yeşil tonlar bazal çekirdeklerdir: kaudat çekirdek, putamen ve globus pallidus. Açık mavi talamustur; bu bakışta putamenin arkasında kalır. Turuncu hipotalamus, sarı hipokampus, kırmızı amigdaladır. Krem renkli kemer korpus kallozumdur. Parmağınla döndür ve yapıların birbirine göre yerini incele.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'sap'],
        renk: 'yapi',
        saydam: ['katman:kabuk', 'katman:sap'],
        gizle: ['bolge:sinir'],
        bakis: 'egik',
        etiketler: [
          { yapi: 'kaudat-cekirdek-sol', metin: 'Kaudat çekirdek' },
          { yapi: 'putamen-sol', metin: 'Putamen' },
          { yapi: 'hipotalamus', metin: 'Hipotalamus' },
          { yapi: 'hipokampus-sol', metin: 'Hipokampus' },
          { yapi: 'amigdala-sol', metin: 'Amigdala' },
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Korpus kallozum.** Beyni tam orta hattan kesersen korpus kallozumu kemer biçiminde görürsün. Yaklaşık 10 cm uzunluğundadır. Ön ucu, beynin ön ucundan (frontal kutup) yaklaşık 4 cm uzaktadır. Arka ucu, beynin arka ucundan (oksipital kutup) yaklaşık 6 cm uzaktadır (Gray, 1918).

Yarımkürenin beyaz cevheri üç lif sisteminden oluşur (Gray, 1918):

- **Projeksiyon lifleri** yarımküreyi beynin alt bölümlerine ve omuriliğe bağlar.
- **Komissür lifleri** iki yarımküreyi birleştirir.
- **İlişkilendirme lifleri** aynı yarımkürenin farklı yerlerini bağlar.

Ayrıntıları Beyaz cevher ve lif yolları dersinde.

**Bazal çekirdekler.** Kaudat çekirdek (*nucleus caudatus*) ile putamene birlikte **striatum** denir. Globus pallidusun iki bölümü vardır: dışta (lateral) ve içte (medial) (OpenStax 13.2). Bazal çekirdeklerin kabuktan aldığı girdi striatuma gelir (OpenStax 13.2). Striatum ayrıca dopamin alır. Dopamin, orta beyindeki substantia nigranın kompakt bölümünden gelir (OpenStax 13.2; FIPAT, 2019).

Bazal çekirdeklerin devresinde iki yol vardır. Doğrudan yol, talamus üzerindeki baskıyı kaldırır (disinhibisyon). Dolaylı yol ise talamusun olağan baskılanmasını pekiştirir. Dopamin doğrudan yolu etkinleştirir, dolaylı yolu baskılar (OpenStax 13.2).

Bazal ön beyindeki çekirdekler kabuğun başlıca asetilkolin kaynağıdır. Kabuğun genel etkinliğini etkilerler. Belki de duyusal uyaranlara verilen dikkati de etkilerler (OpenStax 13.2). Ayrıntıları Bazal çekirdekler dersinde.

**İç kapsül** (*capsula interna*) yassı bir beyaz lif bandıdır. Dışında lentiform çekirdek (*nucleus lentiformis*), içinde kaudat çekirdek ve talamus vardır. İç kapsül bir yerde bükülür. Bu büküm yerine diz (genu) denir. Dizin arkasındaki kısma bugün arka kol denir. Arka kol, lentiform çekirdeği talamustan ayırır (Gray, 1918; Dafny, 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Büyük beynin derininde hastalık izleri',
      md: `- **Parkinson hastalığı**, substantia nigranın kompakt bölümündeki nöronların ölümünden kaynaklanır. Bugün en yaygın tedavi **L-DOPA**’dır. L-DOPA dopaminin öncülüdür, yani vücutta dopamine dönüşür. Kan-beyin engelini de geçebilir (OpenStax 13.2). Ölen nöronlar dopamini sağlayan nöronlardır. Dopamin de doğrudan yolu etkinleştirir, dolaylı yolu baskılar (OpenStax 13.2). Bu yüzden bu nöronların kaybı iki yol arasındaki dengeyi bozar.
- **Alzheimer hastalığı**, bazal ön beyindeki nöronların kaybıyla ilişkilidir (OpenStax 13.2). Bu nöronlar kabuğun asetilkolin kaynağıdır.
- Bir yandaki hareket alanında hasar olursa, vücudun **karşı yanındaki** kaslarda felç olur (Gray, 1918). Hareket lifleri derinde, iç kapsülde, lentiform çekirdek ile talamusun arasından geçer (Gray, 1918). Bu yüzden derindeki küçük bir hasar da karşı yanda güçsüzlük yapabilir.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Korpus kallozumu kesmek',
      md: `Ağır epilepsinin bazı olgularında korpus kallozum kesilir. Amaç, nöbetlerin bir yarımküreden ötekine yayılmasını sınırlamaktır. Bu kişilere "bölünmüş beyin" hastaları denir (Spielman ve ark., 2020). Kesilen yol, iki yarımküre arasındaki ana iletişim yoludur (OpenStax 13.2). Yaklaşık 200 milyon akson taşır (Spielman ve ark., 2020). Beyaz cevherin üç lif sisteminden biri olan komissür liflerine örnektir (Gray, 1918).

Gray’in verdiği ortalamalar yapının orta hattaki yerini kabaca tarif eder. Korpus kallozum yaklaşık 10 cm uzunluğundadır. Ön ucu frontal kutuptan yaklaşık 4 cm, arka ucu oksipital kutuptan yaklaşık 6 cm uzaktadır (Gray, 1918).

Yol erken miyelin kazanır: dizi doğumdan sonraki 6. ayda miyelinlenmiştir. Yine de olgunlaşması uzun sürer. Bunu fraksiyonel anizotropi (FA) ölçüsü gösterir. FA dizde yaklaşık 21, arka ucunda (splenium) 25, gövdesinde 35 yaşında en yüksektir (Buyanova ve Arsalidou, 2021). Ama gelişimi, alın ve şakak loblarını bağlayan yollarınkinden çok daha erken tersine döner (Lebel ve ark., 2012).`,
    },
    {
      tur: 'metin',
      md: `**Ara beyin.** Büyük beynin derininde durur ve üçüncü karıncığın duvarlarını oluşturur (OpenStax 13.2). Büyük beyin ile sinir sisteminin geri kalanı arasındaki bağlantıdır. Tek istisna koku sistemidir: o, büyük beyne doğrudan bağlanır (OpenStax 13.2).

Ara beynin iki ana bölgesi vardır. Biri **talamustur** (*thalamus*). Kokudan başka bütün duyu bilgileri, kabukta işlenmeden önce talamustan geçer. Talamus bu bilgiyi yalnızca aktarmaz, işler de (OpenStax 13.2).

Talamusun altında **hipotalamus** (*hypothalamus*) durur. Hipotalamus, otonom sinir sisteminin yönetim merkezidir. Otonom sistem, iç organları bizim irademiz dışında yönetir. Hipotalamus ön hipofizi düzenleyerek hormon sistemini de yönetir (OpenStax 13.2).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Ara beyin gelişim sırasında dört bölgeye ayrılır: talamus, hipotalamus, subtalamus (*subthalamus*) ve epitalamus (*epithalamus*) (Dafny, 2020). Gray’e göre talamuslar, üçüncü karıncığın iki yanında duran iki büyük oval kitledir. Her biri yaklaşık 4 cm uzunluğundadır (Gray, 1918).

Çoğu beyinde iki talamus ortada birbirine değer. Bu köprüye **ara yapışıklık** (*adhaesio interthalamica*) denir. *Massa intermedia* diye de anılır. Köprüyü üçüncü karıncık çevreler (OpenStax 13.3).

Üçüncü karıncığın tabanının büyük kısmını birkaç yapı oluşturur. Bunlar mamiller cisimler, tuber cinereum, infundibulum, hipofiz ve optik kiyazmadır. Optik kiyazma, görme sinirlerinin çaprazlaştığı yerdir. Gray kendi döneminin sınıflamasıyla bunların hepsini hipotalamusa katar (Gray, 1918). TA2 ise optik kiyazmayı ve mamiller cisimleri ayrı sayar. Ona göre bunlar hipotalamusun değil, doğrudan ara beynin parçalarıdır (FIPAT, 2019). Ara beyin ile orta beyin arasındaki sınırın işareti **arka komissürdür** (*commissura posterior*) (Dafny, 2020).

Talamus bir aktarma istasyonundan fazlasıdır. Hareket kabuğu, beyincikten ve bazal çekirdeklerden gelen girdiyi her zaman talamus üzerinden alır (Knierim, 2020). Talamusta glia hücrelerinin nöronlara oranı da yüksektir. Daha önceki sayımlara göre nöron başına 17 glia hücresi düşer (Herculano-Houzel, 2009’da aktarıldığı gibi). Ayrıntıları Talamus ile Hipotalamus, hipofiz ve epifiz derslerinde.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Orta hattan bakış: bölümler art arda',
      aciklama:
        'Sağ yarımküre kaldırıldı; sol yarımküreye içeriden, orta hattan bakıyoruz. Ön taraf bu kez sağda. Renkler bölgeleri gösterir: mavi büyük beyin, turkuaz ara beyin, mor beyin sapı, turuncu beyincik. Kemer biçimli korpus kallozumun altında talamus durur. Talamusun önünde ve altında hipotalamus vardır. Aşağı doğru orta beyin, pons ve omurilik soğanı art arda dizilir. Beyincik beyin sapının arkasındadır.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'bolge',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'hipotalamus', metin: 'Hipotalamus' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Beyin sapı.** Omurilik ile beyin arasındaki büyük yollar beyin sapından geçer. Bunlar özellikle büyük beyne çıkan ve büyük beyinden inen yollardır (OpenStax 13.2). Pons ve omurilik soğanı kalbin, damarların ve solunumun işleyişini ve hızını düzenler (OpenStax 13.2).

Beyin sapı boyunca dağınık bir gri cevher ağı uzanır: **retiküler formasyon** (*formatio reticularis*). Bu ağ uyku–uyanıklık ve dikkatle ilişkilidir (OpenStax 13.2).

Kafa sinirleri, beyinden doğrudan çıkan sinirlerdir. On iki çift kafa sinirinin çoğunun çekirdekleri beyin sapındadır. III. ve IV. sinirlerinki orta beyinde, V–VIII. sinirlerinki ponsta bulunur. IX–XII. sinirlerinki ise omurilik soğanındadır (Dafny, 2020).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Beyin sapı ve beyincik',
      aciklama:
        'Büyük beyin kaldırıldı. Beyin sapına ve beyinciğe soldan bakıyoruz; ön taraf solda. Mor tonlar beyin sapının katlarıdır: yukarıda orta beyin, ortada şişkin pons, altta omurilik soğanı. Orta beynin arkasında üst ve alt tepecikler görünür. Önünde beyin ayağı (crus cerebri) vardır. Modelin listesi beyin ayağına serebral pedinkül der. Turuncu beyincik yarı saydam yapıldı. Böylece beyinciğin örttüğü pembe dördüncü karıncık ve ona açılan beyin su yolu görünür. En üstteki açık mavi yapı talamustur. “Arkadan” bakışta tepecikler daha iyi seçilir.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik'],
        renk: 'yapi',
        goster: ['bolge:beyin-sapi', 'beyincik', 'talamus', 'dorduncu-karincik', 'beyin-su-yolu'],
        saydam: ['beyincik'],
        boya: [{ secici: ['dorduncu-karincik', 'beyin-su-yolu'], renk: DORDUNCU }],
        bakis: 'sol',
        etiketler: [
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Beyin ayağı' },
          { yapi: 'ust-tepecik-sol', metin: 'Üst tepecik' },
          { yapi: 'alt-tepecik-sol', metin: 'Alt tepecik' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Orta beyin** beyin sapının en küçük parçasıdır: yaklaşık 2 cm uzunluğundadır (Dafny, 2020). OpenStax onu ikiye ayırır: çatı (**tektum**, *tectum mesencephali*) ve taban (**tegmentum**, *tegmentum mesencephali*) (OpenStax 13.2). UTHealth bunlara üçüncü bir bölüm ekler. Bu, önde duran ve kabuktan inen lifleri taşıyan kısımdır (Dafny, 2020).

TA2 bu ön bölüme **beyin ayağı** (*crus cerebri*) der. "Serebral pedinkül" (*pedunculus cerebri*) terimini ise başka bir şey için kullanır: orta beynin bir yarısı için. Bu yarı, tegmentumu ve beyin ayağını birlikte kapsar. Aynı kaynak, iki terimin eş anlamlı kullanılmasının karışıklık yarattığını da not eder (FIPAT, 2019).

Orta beynin ortasından beyin su yolu geçer (OpenStax 13.2). Çatıdaki üst tepecikler (*colliculi superiores*) görme işleviyle ilgilidir. Alt tepecikler (*colliculi inferiores*) ise işitme işleviyle ilgilidir. Tegmentumda bazı kafa sinirlerinin çekirdekleri bulunur. Bunlar III. (okülomotor) ve IV. (troklear) sinirin çekirdekleri ile V. (trigeminal) sinirin bir bölümünün çekirdeğidir (Dafny, 2020).

**Ponsun** tegmentumunda V., VI., VII. ve VIII. sinirlerin çekirdekleri yer alır. Ponsun ön kısmına bazilar kısım denir. Buradaki nöronların aksonları kalın enine demetler hâlinde ponsu geçer. Sonra orta beyincik sapı yoluyla karşı taraftaki beyinciğe ulaşır (Dafny, 2020).

Gray’e göre **omurilik soğanı** yaklaşık 3 cm uzunluğundadır. En geniş yerinde yaklaşık 2 cm eninde ve 1,25 cm kalınlığındadır. Yukarıda ponsun alt kenarından başlar. Aşağıda enine bir düzleme kadar uzanır. Bu düzlem, piramit çaprazlaşmasının (*decussatio pyramidum*) hemen altından ve birinci boyun sinirlerinin üstünden geçer. Alt bölümü merkezî kanalı içerir ve "kapalı" kısım diye anılır. Üst bölümü dördüncü karıncığın alt kısmına karşılık gelir ve "açık" kısım diye anılır (Gray, 1918).

Omurilik soğanının tegmentumunda IX., X., XI. ve XII. sinirlerin çekirdekleri bulunur. Başka çekirdekler de buradadır. Bunlar solunumu, yutmayı, terlemeyi, mide salgısını, kalp ve damar hareketlerini düzenler (Dafny, 2020). Bütün beyin sapında kaç nöron var? Eski bir tahmine göre 1 milyardan az. Bu tahmin, daha önceki kısmi sayımları bir araya getirir (Herculano-Houzel, 2009’da aktarıldığı gibi). Ayrıntılar Orta beyin, Pons ve Omurilik soğanı derslerinde.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Beyin sapının üç katı',
      sutunlar: ['Kat', 'Boyut', 'Kafa siniri çekirdekleri', 'Ayırt edici yapılar', 'Komşu boşluk'],
      satirlar: [
        [
          'Orta beyin',
          '~2 cm uzunluk',
          'III, IV ve V’in bir bölümü',
          'Tektum (üst ve alt tepecikler), tegmentum, beyin ayakları (*crura cerebri*)',
          'Beyin su yolu',
        ],
        [
          'Pons',
          '—',
          'V, VI, VII, VIII',
          'Bazilar kısım: pons çekirdekleri ve orta beyincik sapına giden enine lifler',
          'Dördüncü karıncık (arkasında)',
        ],
        [
          'Omurilik soğanı',
          '~3 × 2 × 1,25 cm',
          'IX, X, XI, XII',
          'Piramitler; alt sınırda piramit çaprazlaşması; kapalı ve açık kısım',
          'Dördüncü karıncığın alt kısmı; merkezî kanal',
        ],
      ],
      not: 'Kaynaklar: Dafny (2020); OpenStax 13.2; Gray (1918). Orta beynin uzunluğu Dafny (2020) kaynaklıdır. Omurilik soğanının boyutları Gray (1918) kaynaklıdır.',
    },
    {
      tur: 'metin',
      md: `**Beyincik.** Latince adı "küçük beyin" demektir. Beyincik kaslardan, tendonlardan, eklemlerden ve iç kulaktan bilgi alır. Bu bilgilerle dengeyi, eşgüdümü, hareketi ve hareket becerilerini denetler (Spielman ve ark., 2020).

İşi bir karşılaştırıcınınkine benzer. Büyük beyinden hareket bilgisini alır. Bunu, omurilik yoluyla bedenden gelen duyu bilgisiyle karşılaştırır (OpenStax 13.2). Beyin kütlesinin yalnızca onda biri kadardır (OpenStax 13.2). Ama beynin 86 milyar nöronunun yaklaşık 69 milyarını taşır (Herculano-Houzel, 2009).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Beyincik büyük beyne çok yakın durur. Ama erişkinde ikisi arasında **doğrudan bir bağlantı yoktur** (OpenStax 13.1). Beyincikten gelen bilgi hareket kabuğuna her zaman ara beyindeki talamus üzerinden ulaşır (Knierim, 2020).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Beyinciğin ortasında daralmış bir bölüm vardır: **vermis** (*vermis cerebelli*). Adını halkalı görünümünden alır. İki yanda ise beyincik **yarımküreleri** (*hemisphaeria cerebelli*) bulunur (Gray, 1918).

Gray’e göre beyincik erkekte ortalama yaklaşık 150 g gelir. Büyük beyne oranı erişkinde yaklaşık 1:8, bebekte 1:20’dir (Gray, 1918). İzotropik fraksiyonatör sayımında beyincik 154 g gelir ve 69 milyar nöron taşır (Herculano-Houzel, 2009). Bu yoğunluğu, granül hücreleri denen küçük nöronlar sağlar. Daha önceki sayımlara göre beyincikte nöronlar gliadan en az 25 kat fazladır (Herculano-Houzel, 2009’da aktarıldığı gibi).

Beyinciğin hacmi neokorteksin yaklaşık sekizde biridir. Ama kabuğunun yüzeyi neokorteksinkinin %78’i kadardır (Sereno ve ark., 2020). Nörolojik muayenede başlıca beyincik işlevlerine iki muayeneyle bakılır: koordinasyon ve yürüyüş (OpenStax 16.1). Ayrıntılar Beyincik dersinde.`,
    },
    {
      tur: 'metin',
      md: `**Karıncıklar.** Beynin içinde sıvıyla dolu bir boşluklar dizisi vardır. Bu boşluklar, embriyodaki sinir borusunun boşluğundan gelişir (Gray, 1918).

İki **yan karıncık** (*ventriculi laterales*) büyük beynin derinindedir. Bir zamanlar bunlara birinci ve ikinci karıncık denirdi. **Üçüncü karıncık** (*ventriculus tertius*), ara beynin sağ ve sol yarısı arasındaki aralıktır. Orta beyinden geçen **beyin su yoluna** (*aquaeductus mesencephali*) açılır. Su yolu da **dördüncü karıncığa** (*ventriculus quartus*) açılır. Dördüncü karıncık, beyincik ile pons ve omurilik soğanının üst kısmı arasındadır (OpenStax 13.3).

Beyin-omurilik sıvısı yan karıncıklarda oluşur. Karıncıklar arası delikten (Monro deliği) üçüncü karıncığa geçer. Oradan su yoluyla dördüncü karıncığa gider (Gray, 1918). Sıvının nasıl yapılıp dolaştığını bu dersin Beyni koruyanlar ve besleyenler bölümünde bulursun. Anatomi bölümünün Karıncıklar ve beyin-omurilik sıvısı dersinde de anlatılır.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Karıncıklar ve komşuları',
      aciklama:
        'Büyük beyin kaldırıldı. Karıncıklara ve çevrelerindeki bölümlere soldan bakıyoruz; ön taraf solda. Mavi yan karıncık büyük beynin derininde geniş bir yay çizer. Turkuaz üçüncü karıncık iki talamusun arasındadır; talamuslar açık mavi ve yarı saydamdır. Mor beyin su yolu orta beynin içindedir. Pembe dördüncü karıncığın önünde pons ve omurilik soğanı, arkasında turuncu beyincik (yarı saydam) durur. Sıvının bu boşluklardaki yolu Beyni koruyanlar ve besleyenler bölümünde.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik'],
        renk: 'yapi',
        goster: ['katman:karincik', 'talamus', 'bolge:beyin-sapi', 'beyincik'],
        saydam: ['talamus', 'bolge:beyin-sapi', 'beyincik'],
        vurgula: ['katman:karincik'],
        boya: [
          { secici: ['yan-karincik'], renk: YAN_KARINCIK },
          { secici: ['karinciklar-arasi-delik'], renk: MONRO },
          { secici: ['ucuncu-karincik'], renk: UCUNCU },
          { secici: ['beyin-su-yolu'], renk: SU_YOLU },
          { secici: ['dorduncu-karincik'], renk: DORDUNCU },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Gray’e göre her yan karıncık bir orta bölümden (gövde) ve ondan uzanan üç boynuzdan (*cornua*) oluşur (Gray, 1918). Üçüncü karıncık, iki talamus arasındaki ara yapışıklığı çevreler (OpenStax 13.3). Tabanının büyük kısmını hipotalamusa ait yapılar yapar (Gray, 1918).

Dördüncü karıncık arka beynin boşluğudur. Beyinciğin önünde, ponsun ve omurilik soğanının üst yarısının arkasında durur (Gray, 1918). Omurilik soğanının alt bölümü merkezî kanalı içerir. Bu yüzden ona "kapalı" kısım denir. Üst bölümü ise dördüncü karıncığın alt kısmına karşılık gelir. Bu yüzden ona "açık" kısım denir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Beyin sapı** = orta beyin + pons + omurilik soğanı. Beyincik ve ara beyin sayılmaz (OpenStax 13.1; FIPAT, 2019).
- **Kafa siniri çekirdekleri:** III, IV (ve V’in bir bölümü) orta beyinde. V, VI, VII, VIII ponsta. IX, X, XI, XII omurilik soğanında (Dafny, 2020).
- **Orta beyin:** beyin sapının en küçük katı (~2 cm). Tektum (üst tepecik görme, alt tepecik işitme), tegmentum ve önde beyin ayakları. Ortasından beyin su yolu geçer.
- **Talamus:** koku dışındaki bütün duyular.
- **Hipotalamus:** otonom sistem ve ön hipofiz.
- **Arka komissür:** ara beyin–orta beyin sınırı.
- **Striatum** = kaudat çekirdek + putamen. Globus pallidusun dış ve iç bölümü vardır.
- **İç kapsülün arka kolu** lentiform çekirdek ile talamus arasındadır.
- **Karıncıklar:** yan karıncık → karıncıklar arası delik → üçüncü karıncık → beyin su yolu → dördüncü karıncık.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Işığa değil, yakına bakınca daralan göz bebekleri',
      oyku: `48 yaşında bir adamı göz doktoru nöroloji polikliniğine gönderiyor. Muayenede iki gözüne ayrı ayrı ışık tutuluyor. İki göz bebeği de daralmıyor. Sonra hastadan yakındaki bir kalemin ucuna bakması isteniyor. Bu kez iki göz bebeği de belirgin biçimde daralıyor. Görmesi ve göz hareketleri normal. Kan testlerinde geçirilmiş bir sifiliz enfeksiyonunun izleri bulunuyor.`,
      soru: 'Işık refleksi kaybolmuş, ama yakına bakınca daralma korunmuş. Bu, beynin hangi bölümünde bir hasarı düşündürür?',
      cozum: `**Merkez nerede?** Göz bebeğinin ışık refleksinin merkezi **pretektal alandır** (*area pretectalis*). UTHealth bu alanı orta beyinde anlatır (Dragoi, 2020b). TA2 ise pretektumu ara beynin bir bölgesi olarak sınıflar (FIPAT, 2019). Bu alanın nöronları aksonlarının çoğunu **arka komissürden** iki yana gönderir. Aksonlar Edinger–Westphal çekirdeklerinde sonlanır (Dragoi, 2020b).

Edinger–Westphal çekirdeği, orta beyindeki okülomotor çekirdek kümesinin bir parçasıdır. Aksonları okülomotor sinirle siliyer gangliyona (*ganglion ciliare*) gider. Bu gangliyon göz çukurunun arkasındadır. Oradan çıkan lifler iristeki düz kası sinirlendirir ve göz bebeğinin genişliğini ayarlar (OpenStax 15.1). Bağlantı iki yanlı olduğu için, tek göze tutulan ışık normalde iki göz bebeğini de daraltır (Dragoi, 2020b).

**Bulgunun adı:** Pretektal alan nöronları iki yanda birden hasar görebilir. Örneğin sifilizin sinir sistemini tutan biçiminde (nörosifiliz) bu olur. O zaman göz bebekleri ışığa yanıt vermez, ama yakına bakarken daralır. Bunlara **Argyll Robertson göz bebekleri** denir (Dragoi, 2020b). Bu hastanın bulguları bu tabloya uyar.

**Haritadaki yeri:** Pretektal aksonlar arka komissürden geçer. Arka komissür, ara beyin ile orta beyin arasındaki sınırın işaretidir (Dafny, 2020). Yani refleksin merkezi bu sınırın hemen yakınındadır.

**Bir ders kitabına dikkat:** Bir ders kitabı göz bebeği reflekslerini hipotalamusun yönettiğini yazar (OpenStax 15.3). Bu ifadeyi kullanma. Refleksin merkezi pretektal alandır (Dragoi, 2020b). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kaynaklar neyi farklı anlatır?',
      md: `- **Serebrum:** OpenStax’e göre telensefalondur. TA2’ye göre telensefalon ile diensefalondur, yani ön beynin erişkindeki karşılığıdır (OpenStax 13.1; FIPAT, 2019). Bir makalede "serebrum hacmi" okurken hangi tanımın kullanıldığına bak.
- **Beyin sapı:** UTHealth’in bir cümlesi ara beyni beyin sapına katar. Aynı bölümün başka bir yeri katmaz (Dafny, 2020). OpenStax ve TA2 üç katlı tanımı kullanır (OpenStax 13.1; FIPAT, 2019).
- **Beyincik bağlantıları:** OpenStax beyinciğin çıkışını yalnızca orta beyne bağlar. Bu çıkış kırmızı çekirdeğe ve oradan omuriliğe inen rubrospinal yola gider. Aynı kitap, bedenden gelen duyu bilgisinin omurilik soğanındaki alt olive "kopyalandığını" yazar (OpenStax 13.2, 14.3). Bu anlatım yanlış değil, eksiktir. Beyincikten hareket kabuğuna giden bilgi her zaman talamustan geçer (Knierim, 2020). Gray’e göre de arka spinoserebellar lifler, alt beyincik sapıyla doğrudan beyinciğe girer (Gray, 1918). Aynı kitabın başka bir bölümü beyinciği hareketi "başlatan" yapı diye anar (OpenStax 14.2). Bu, karşılaştırıcı tanımıyla bağdaşmaz.
- **İç kapsül:** Kortikospinal yol, kabuktan omuriliğe inen hareket yoludur. OpenStax bu yolun kaudat çekirdek ile putamen arasından geçtiğini yazar (OpenStax 14.3). Bu, ön kolun bölgesidir. Gray ise hareket liflerini lentiform çekirdek ile talamusun arasına, yani arka kola yerleştirir. UTHealth de arka kolun talamusu globus pallidus ve putamenden ayırdığını yazar (Gray, 1918; Dafny, 2020).
- **Gray’in dönemi:** Gray hipotalamusun görmeyle ilgili bölümünü "aslında telensefalona ait" sayar (Gray, 1918). Bugünkü kitaplar ise hipotalamusu bütünüyle ara beynin bir bölgesi olarak anlatır (Dafny, 2020; OpenStax 13.2).`,
    },
  ],
};
