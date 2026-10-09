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
      md: `Beyni bir harita gibi dört büyük bölgeye ayırarak inceleriz: **büyük beyin** (*cerebrum*), **ara beyin** (*diencephalon*), **beyin sapı** (*truncus encephali*) ve **beyincik** (*cerebellum*) (OpenStax 13.2). Beyin sapı da üç kattan oluşur: yukarıdan aşağıya **orta beyin** (*mesencephalon*), **pons** (*pons*) ve **omurilik soğanı** (*medulla oblongata*) (OpenStax 13.1). Beynin içinde ise sıvıyla dolu, birbirine açılan boşluklar vardır: **karıncıklar** (*ventriculi*).

- **Büyük beyin** en büyük bölümdür: iki yarımküre, dıştaki kıvrımlı **beyin kabuğu** (*cortex cerebri*), altındaki beyaz cevher ve derindeki gri cevher çekirdekleri (OpenStax 13.2; Dafny, 2020).
- **Ara beyin** büyük beynin altında, içeride saklıdır; en önemli parçaları **talamus** ve **hipotalamus**tur (OpenStax 13.2).
- **Beyin sapı** beyni omuriliğe bağlar; kalp-damar sistemini ve solunumu düzenleyen merkezler buradadır (OpenStax 13.2).
- **Beyincik** beyin sapının arkasında durur; denge, eşgüdüm ve hareket becerileriyle ilgilidir (Spielman ve ark., 2020).`,
    },
    {
      tur: 'sahne',
      baslik: 'Dört bölüm bir arada',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Renkler dört bölümü gösterir: mavi büyük beyin, turkuaz ara beyin, mor beyin sapı, turuncu beyincik. Ara beyin içeride saklı olduğundan bu bakışta görünmez; “Alttan” bakışta beyin sapının önünde turkuaz renkli hipotalamus ve ona asılı hipofiz bezi seçilir. Bir parçaya dokununca adı ve görevi açılır.',
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
- **Dört karıncık:** iki yan karıncık büyük beyinde, üçüncü karıncık ara beyinde, dördüncü karıncık beyinciğin önünde; üçüncüyü dördüncüye orta beyindeki beyin su yolu bağlar.
- **Kafa sinirlerinin çekirdekleri** çoğunlukla beyin sapındadır: III–IV orta beyinde, V–VIII ponsta, IX–XII omurilik soğanında.
- **Ters orantı:** beyincik beyin kütlesinin onda biri kadardır ama nöronların çoğunu taşır.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Adlar nereden geliyor?** Bölümlerin adları gelişimden gelir: beş ikincil kesecikten telensefalon büyük beyni, diensefalon ara beyni, mezensefalon orta beyni, metensefalon ponsu ve beyinciği, miyelensefalon omurilik soğanını yapar (Dafny, 2020; OpenStax 13.1). Beyincik metensefalonun çatısının, pons ise tabanının ve yan duvarlarının kalınlaşmasıyla gelişir (Gray, 1918). Keseciklerin öyküsü bu dersin Sinir borusundan beyne bölümünde, ayrıntısı Anatomi bölümünün Beyin nasıl oluşur? dersinde.

**İki tanım farkı.** Birincisi *serebrum*: OpenStax telensefalonu serebrumla eş tutar ve ara beyni ayrı bir bölge sayar (OpenStax 13.1, 13.2). Terminologia Anatomica 2 (TA2) ise serebrumu ön beynin (prosensefalon), yani telensefalon ile diensefalonun erişkindeki karşılığı olarak tanımlar ve erişkin beynini serebrum, beyin sapı ve beyincik diye üçe ayırır (FIPAT, 2019). Bu derste "büyük beyin" telensefalon anlamında kullanılıyor. İkincisi *beyin sapı*: OpenStax ve TA2’ye göre beyin sapı orta beyin, pons ve omurilik soğanından oluşur; beyincik metensefalondan gelse de beyin sapına katılmaz (OpenStax 13.1; FIPAT, 2019). UTHealth ders kitabının bir cümlesi ara beyni "beyin sapının en üst yapısı" diye anar, aynı bölümün başka bir yeri ise beyin sapını üç kata ayırır (Dafny, 2020); bu derste üç katlı tanım kullanılıyor.`,
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
          'Kokudan başka bütün duyuları kabuğa aktarıp işlemek; otonom sistemi ve ön hipofiz aracılığıyla hormonları yönetmek',
        ],
        [
          '**Orta beyin**',
          'Mezensefalon',
          'Tektum (üst ve alt tepecikler), tegmentum, beyin ayakları (*crura cerebri*)',
          'Beyin su yolu',
          'Görme (üst tepecik) ve işitme (alt tepecik) işlevleri; III., IV. ve V.’nin bir bölümünün çekirdekleri',
        ],
        [
          '**Pons**',
          'Metensefalon (arka beyin)',
          'Bazilar kısım (pons çekirdekleri ve enine lifler), tegmentum',
          'Dördüncü karıncık (ponsun arkasında)',
          'Karşı beyinciğe giden lifler; V–VIII. kafa sinirlerinin çekirdekleri; solunum ve kalp-damar düzenlemesi',
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
      md: `**Büyük beyin.** İki yarımküreyi derin bir yarık, **uzunlamasına yarık** (*fissura longitudinalis cerebri*), birbirinden ayırır; derinde iki yarımküre arasındaki ana iletişim yolu **korpus kallozumdur** (*corpus callosum*) (OpenStax 13.2). Bu kalın lif bandında yaklaşık 200 milyon akson vardır (Spielman ve ark., 2020). Yarımkürenin dışını gri cevherden yapılmış kabuk örter; altında aksonlardan oluşan beyaz cevher, onun da derininde gri renkli nöron kümeleri, yani **çekirdekler** bulunur (Dafny, 2020). Bunların en bilinenleri **bazal çekirdeklerdir** (*nuclei basales telencephali*): Parkinson hastalığında bozulan devrenin parçasıdırlar (OpenStax 13.2). Kabuğun yüzü, lobları ve işlev alanları bir sonraki bölümün konusu.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kabuğun altında: derin yapılar',
      aciklama:
        'Kabuk ve beyin sapı yarı saydam yapıldı; derindeki yapılar kendi renkleriyle görünüyor. Beyne soldan, önden ve biraz yukarıdan bakıyoruz. Yeşil tonlar bazal çekirdeklerdir (kaudat çekirdek, putamen, globus pallidus); açık mavi talamus (bu bakışta putamenin arkasında kalır), turuncu hipotalamus, sarı hipokampus, kırmızı amigdala, krem renkli kemer korpus kallozumdur. Parmağınla döndürüp yapıların birbirine göre yerini incele.',
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
      md: `**Korpus kallozum** orta hattan kesilmiş bir beyinde yaklaşık 10 cm uzunluğunda kemer biçiminde bir yapıdır; ön ucu frontal kutuptan yaklaşık 4 cm, arka ucu oksipital kutuptan yaklaşık 6 cm uzaktadır (Gray, 1918). Yarımkürenin beyaz cevheri üç lif sisteminden oluşur: yarımküreyi beynin alt bölümlerine ve omuriliğe bağlayan **projeksiyon lifleri**, iki yarımküreyi birleştiren **komissür lifleri** ve aynı yarımkürenin farklı yerlerini bağlayan **ilişkilendirme lifleri** (Gray, 1918). Ayrıntıları Beyaz cevher ve lif yolları dersinde.

**Bazal çekirdekler.** Kaudat çekirdek (*nucleus caudatus*) ile putamen birlikte **striatum** adını alır; globus pallidusun dışta (lateral) ve içte (medial) iki bölümü vardır (OpenStax 13.2). Bazal çekirdeklerin kabuktan aldığı girdi striatuma gelir (OpenStax 13.2); striatum ayrıca orta beyindeki substantia nigranın kompakt bölümünden dopamin alır (OpenStax 13.2; FIPAT, 2019). Doğrudan yol talamus üzerindeki baskıyı kaldırır (disinhibisyon), dolaylı yol ise talamusun olağan baskılanmasını pekiştirir; dopamin doğrudan yolu etkinleştirir, dolaylı yolu baskılar (OpenStax 13.2). Bazal ön beyindeki çekirdekler kabuğun başlıca asetilkolin kaynağıdır; kabuğun genel etkinliğini, belki de duyusal uyaranlara verilen dikkati etkiler (OpenStax 13.2). Ayrıntıları Bazal çekirdekler dersinde.

**İç kapsül** (*capsula interna*), dışta lentiform çekirdek (*nucleus lentiformis*) ile içte kaudat çekirdek ve talamus arasında uzanan yassı bir beyaz lif bandıdır; dizinin (genu) arkasındaki kısmı, bugün arka kol denen bölüm, lentiform çekirdeği talamustan ayırır (Gray, 1918; Dafny, 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Büyük beynin derininde hastalık izleri',
      md: `- **Parkinson hastalığı**, substantia nigranın kompakt bölümündeki nöronların ölümünden kaynaklanır. Bugün en yaygın tedavi, kan-beyin engelini geçebilen dopamin öncülü **L-DOPA**’dır (OpenStax 13.2). Bu nöronlar doğrudan yolu etkinleştiren, dolaylı yolu baskılayan dopamini sağladığından (OpenStax 13.2), kayıpları iki yol arasındaki dengeyi bozar.
- **Alzheimer hastalığı**, bazal ön beyindeki nöronların kaybıyla ilişkilidir (OpenStax 13.2); bu nöronlar kabuğun asetilkolin kaynağıdır.
- Bir yandaki hareket alanını tutan hasar, vücudun **karşı yanındaki** kaslarda felce yol açar (Gray, 1918). Hareket lifleri derinde, iç kapsülde lentiform çekirdek ile talamusun arasından geçtiği için (Gray, 1918), derindeki küçük bir hasar da karşı yanda güçsüzlüğe neden olabilir.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Korpus kallozumu kesmek',
      md: `Ağır epilepsinin bazı olgularında nöbetlerin bir yarımküreden ötekine yayılmasını sınırlamak için korpus kallozum kesilir; bu kişilere "bölünmüş beyin" hastaları denir (Spielman ve ark., 2020). Kesilen yol, iki yarımküre arasındaki ana iletişim yoludur (OpenStax 13.2); yaklaşık 200 milyon akson taşır (Spielman ve ark., 2020) ve beyaz cevherin üç lif sisteminden komissür liflerine örnektir (Gray, 1918).

Gray’in verdiği ortalamalar yapının orta hattaki yerini kabaca tarif eder: korpus kallozum yaklaşık 10 cm uzunluğundadır; ön ucu frontal kutuptan yaklaşık 4 cm, arka ucu oksipital kutuptan yaklaşık 6 cm uzaktadır (Gray, 1918). Yol erken miyelin kazanır: dizi doğumdan sonraki 6. ayda miyelinlenmiştir. Yine de olgunlaşması uzun sürer: korpus kallozumun fraksiyonel anizotropi (FA) değeri dizde yaklaşık 21, arka ucunda (splenium) 25, gövdesinde 35 yaşında zirve yapar (Buyanova ve Arsalidou, 2021). Gelişim eğilimi ise alın ve şakak loblarını bağlayan yollarınkinden çok daha erken tersine döner (Lebel ve ark., 2012).`,
    },
    {
      tur: 'metin',
      md: `**Ara beyin.** Büyük beynin derininde durur ve üçüncü karıncığın duvarlarını oluşturur (OpenStax 13.2). Büyük beyin ile sinir sisteminin geri kalanı arasındaki bağlantıdır; büyük beyne doğrudan bağlanan tek istisna koku sistemidir (OpenStax 13.2). İki ana bölgesinden biri **talamustur** (*thalamus*): koku dışındaki bütün duyusal bilgiler kabukta işlenmeden önce talamustan geçer ve talamus bu bilgiyi yalnızca aktarmakla kalmaz, işler de (OpenStax 13.2). Altındaki **hipotalamus** (*hypothalamus*), otonom sinir sisteminin ve ön hipofizi düzenleyerek hormon sisteminin yönetim merkezidir (OpenStax 13.2).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Ara beyin gelişim sırasında dört bölgeye ayrılır: talamus, hipotalamus, subtalamus (*subthalamus*) ve epitalamus (*epithalamus*) (Dafny, 2020). Gray’e göre talamuslar üçüncü karıncığın iki yanında duran iki büyük oval kitledir ve her biri yaklaşık 4 cm uzunluğundadır (Gray, 1918). Çoğu beyinde iki talamus ortada **ara yapışıklık** (*adhaesio interthalamica*, *massa intermedia*) ile birbirine değer ve bu köprüyü üçüncü karıncık çevreler (OpenStax 13.3). Gray kendi döneminin sınıflamasıyla üçüncü karıncığın tabanının büyük kısmını yapan mamiller cisimleri, tuber cinereumu, infundibulumu, hipofizi ve optik kiyazmayı hipotalamusa katar (Gray, 1918); TA2 ise optik kiyazmayı ve mamiller cisimleri hipotalamusun değil doğrudan ara beynin parçaları olarak ayrı sayar (FIPAT, 2019). Ara beyin ile orta beyin arasındaki sınırın işareti **arka komissürdür** (*commissura posterior*) (Dafny, 2020).

Talamus bir aktarma istasyonundan fazlasıdır: hareket kabuğu beyincikten ve bazal çekirdeklerden gelen girdiyi her zaman talamus üzerinden alır (Knierim, 2020). Talamusta glia–nöron oranı da yüksektir: daha önceki sayımlara göre nöron başına 17 glia hücresi düşer (Herculano-Houzel, 2009’da aktarıldığı gibi). Ayrıntıları Talamus ile Hipotalamus, hipofiz ve epifiz derslerinde.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Orta hattan bakış: bölümler art arda',
      aciklama:
        'Sağ yarımküre kaldırıldı; sol yarımküreye içeriden, orta hattan bakıyoruz. Ön taraf bu kez sağda. Renkler bölgeleri gösterir: mavi büyük beyin, turkuaz ara beyin, mor beyin sapı, turuncu beyincik. Kemer biçimli korpus kallozumun altında talamus, onun önünde ve altında hipotalamus durur; aşağı doğru orta beyin, pons ve omurilik soğanı art arda dizilir, beyincik beyin sapının arkasındadır.',
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
      md: `**Beyin sapı.** Omurilik ile beyin, özellikle büyük beyin arasındaki büyük çıkan ve inen yollar beyin sapından geçer (OpenStax 13.2). Pons ve omurilik soğanı kalp-damar ve solunum sistemlerinin işleyişini ve hızını düzenler (OpenStax 13.2). Beyin sapı boyunca yayılan dağınık bir gri cevher ağı, **retiküler formasyon** (*formatio reticularis*), uyku–uyanıklık ve dikkatle ilişkilidir (OpenStax 13.2). On iki çift kafa sinirinin çoğunun çekirdekleri de buradadır: III. ve IV. sinirlerinki orta beyinde, V–VIII. sinirlerinki ponsta, IX–XII. sinirlerinki omurilik soğanındadır (Dafny, 2020).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Beyin sapı ve beyincik',
      aciklama:
        'Büyük beyin kaldırıldı; beyin sapına ve beyinciğe soldan bakıyoruz, ön taraf solda. Mor tonlar beyin sapının katlarıdır: yukarıda orta beyin, ortada şişkin pons, altta omurilik soğanı. Orta beynin arkasında üst ve alt tepecikler, önünde beyin ayağı (crus cerebri) görünür; modelin listesi beyin ayağını serebral pedinkül adıyla verir. Turuncu beyincik yarı saydam yapıldı; beyinciğin örttüğü pembe dördüncü karıncık ve ona açılan beyin su yolu görünür. En üstteki açık mavi yapı talamustur. “Arkadan” bakışta tepecikler daha iyi seçilir.',
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
      md: `**Orta beyin** beyin sapının en küçük parçasıdır, yaklaşık 2 cm uzunluğundadır (Dafny, 2020). OpenStax onu çatı (**tektum**, *tectum mesencephali*) ve taban (**tegmentum**, *tegmentum mesencephali*) diye ikiye ayırır (OpenStax 13.2); UTHealth bunlara üçüncü bir bölüm ekler: önde, kabuktan inen lifleri taşıyan ön kısım (Dafny, 2020). TA2 bu ön bölüme **beyin ayağı** (*crus cerebri*) der; "serebral pedinkül" (*pedunculus cerebri*) terimini ise tegmentumu ve beyin ayağını birlikte kapsayan orta beyin yarısı için kullanır ve terimin beyin ayağıyla eş anlamlı kullanılmasının karışıklık yarattığını not eder (FIPAT, 2019). Orta beynin ortasından beyin su yolu geçer (OpenStax 13.2). Çatıdaki üst tepecikler (*colliculi superiores*) görme, alt tepecikler (*colliculi inferiores*) işitme işlevleriyle ilgilidir; tegmentumda III. (okülomotor), IV. (troklear) sinirlerin ve V. (trigeminal) sinirin bir bölümünün çekirdekleri bulunur (Dafny, 2020).

**Pons**un tegmentumunda V., VI., VII. ve VIII. sinirlerin çekirdekleri yer alır. Bazilar kısmındaki nöronların aksonları kalın enine demetler hâlinde ponsu geçer ve orta beyincik sapıyla karşı taraftaki beyinciğe ulaşır (Dafny, 2020).

**Omurilik soğanı** Gray’e göre yaklaşık 3 cm uzunluğunda, en geniş yerinde yaklaşık 2 cm eninde ve 1,25 cm kalınlığındadır. Ponsun alt kenarından, piramit çaprazlaşmasının (*decussatio pyramidum*) hemen altından ve birinci boyun sinirlerinin üstünden geçen enine düzleme kadar uzanır. Merkezî kanalı içeren alt bölümüne "kapalı", dördüncü karıncığın alt kısmına karşılık gelen üst bölümüne "açık" kısım denir (Gray, 1918). Tegmentumunda IX., X., XI. ve XII. sinirlerin çekirdekleri ve solunumu, yutmayı, terlemeyi, mide salgısını, kalp ve damar hareketlerini düzenleyen çekirdekler bulunur (Dafny, 2020). Literatürdeki kısmi sayımları derleyen eski bir tahmine göre bütün beyin sapında 1 milyardan az nöron vardır (Herculano-Houzel, 2009’da aktarıldığı gibi). Ayrıntılar Orta beyin, Pons ve Omurilik soğanı derslerinde.`,
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
      not: 'Kaynaklar: Dafny (2020); OpenStax 13.2; Gray (1918). Orta beynin uzunluğu Dafny (2020), omurilik soğanının boyutları Gray (1918) kaynaklıdır.',
    },
    {
      tur: 'metin',
      md: `**Beyincik.** Latince adı "küçük beyin" demektir. Kaslardan, tendonlardan, eklemlerden ve iç kulaktan gelen bilgileri alarak dengeyi, eşgüdümü, hareketi ve hareket becerilerini denetler (Spielman ve ark., 2020). İşi bir karşılaştırıcınınkine benzer: büyük beyinden gelen hareket bilgisini, omurilik yoluyla bedenden gelen duyusal geri bildirimle karşılaştırır (OpenStax 13.2). Beyin kütlesinin yalnızca onda biri kadardır (OpenStax 13.2) ama 86 milyar nöronun yaklaşık 69 milyarını taşır (Herculano-Houzel, 2009).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Beyincik büyük beyne çok yakın durur ama erişkinde ikisi arasında **doğrudan bir bağlantı yoktur** (OpenStax 13.1). Beyincikten gelen bilgi hareket kabuğuna her zaman ara beyindeki talamus üzerinden ulaşır (Knierim, 2020).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Beyincik, ortada halkalı görünümünden adını alan daralmış **vermis** (*vermis cerebelli*) ile iki yandaki **yarımkürelerden** (*hemisphaeria cerebelli*) oluşur (Gray, 1918). Gray erkekte ortalama ağırlığını yaklaşık 150 g, beyincik–büyük beyin oranını erişkinde yaklaşık 1:8, bebekte 1:20 verir (Gray, 1918); izotropik fraksiyonatör sayımında beyincik 154 g gelir ve 69 milyar nöron taşır (Herculano-Houzel, 2009). Bu yoğunluğu granül hücreleri sağlar: daha önceki sayımlara göre beyincikte nöronlar gliadan en az 25 kat fazladır (Herculano-Houzel, 2009’da aktarıldığı gibi). Hacmi neokorteksin yaklaşık sekizde biri olduğu hâlde kabuğunun yüzeyi neokorteksinkinin %78’i kadardır (Sereno ve ark., 2020). Nörolojik muayenede koordinasyon ve yürüyüş muayenesi başlıca beyincik işlevlerini değerlendirir (OpenStax 16.1). Ayrıntılar Beyincik dersinde.`,
    },
    {
      tur: 'metin',
      md: `**Karıncıklar.** Beynin içinde, embriyodaki sinir borusunun boşluğundan gelişen, sıvıyla dolu bir boşluklar dizisi vardır (Gray, 1918). İki **yan karıncık** (*ventriculi laterales*) büyük beynin derinindedir; bir zamanlar bunlara birinci ve ikinci karıncık denirdi. **Üçüncü karıncık** (*ventriculus tertius*) ara beynin sağ ve sol yarısı arasındaki aralıktır ve orta beyinden geçen **beyin su yoluna** (*aquaeductus mesencephali*) açılır. Su yolu da beyincik ile pons ve omurilik soğanının üst kısmı arasındaki **dördüncü karıncığa** (*ventriculus quartus*) açılır (OpenStax 13.3). Yan karıncıklarda oluşan beyin-omurilik sıvısı karıncıklar arası delikten (Monro deliği) üçüncü karıncığa, oradan su yoluyla dördüncü karıncığa geçer (Gray, 1918). Sıvının nasıl yapılıp dolaştığı bu dersin Beyni koruyanlar ve besleyenler bölümünde ve Anatomi bölümünün Karıncıklar ve beyin-omurilik sıvısı dersinde.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Karıncıklar ve komşuları',
      aciklama:
        'Büyük beyin kaldırıldı; karıncıklara ve çevrelerindeki bölümlere soldan bakıyoruz, ön taraf solda. Mavi yan karıncık büyük beynin derininde geniş bir yay çizer. Turkuaz üçüncü karıncık iki talamusun (açık mavi, yarı saydam) arasında, mor beyin su yolu orta beynin içindedir. Pembe dördüncü karıncık, önündeki pons ve omurilik soğanı ile arkasındaki turuncu beyinciğin (yarı saydam) arasında durur. Sıvının bu boşluklardaki yolu Beyni koruyanlar ve besleyenler bölümünde.',
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
      md: `Gray’e göre her yan karıncık bir orta bölüm (gövde) ve ondan uzanan üç boynuzdan (*cornua*) oluşur (Gray, 1918). Üçüncü karıncık, iki talamus arasındaki ara yapışıklığı çevreler (OpenStax 13.3); tabanının büyük kısmını hipotalamusa ait yapılar yapar (Gray, 1918). Dördüncü karıncık arka beynin boşluğudur: beyinciğin önünde, ponsun ve omurilik soğanının üst yarısının arkasında durur (Gray, 1918). Omurilik soğanının alt bölümü merkezî kanalı içerdiği için "kapalı", üst bölümü dördüncü karıncığın alt kısmına karşılık geldiği için "açık" kısım diye anılır (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Beyin sapı** = orta beyin + pons + omurilik soğanı; beyincik ve ara beyin sayılmaz (OpenStax 13.1; FIPAT, 2019).
- **Kafa siniri çekirdekleri:** III, IV (ve V’in bir bölümü) orta beyinde; V, VI, VII, VIII ponsta; IX, X, XI, XII omurilik soğanında (Dafny, 2020).
- **Orta beyin:** beyin sapının en küçük katı (~2 cm); tektum (üst tepecik görme, alt tepecik işitme), tegmentum ve önde beyin ayakları; ortasından beyin su yolu geçer.
- **Talamus:** koku dışındaki bütün duyular; **hipotalamus:** otonom sistem ve ön hipofiz; **arka komissür:** ara beyin–orta beyin sınırı.
- **Striatum** = kaudat çekirdek + putamen; globus pallidusun dış ve iç bölümü vardır.
- **İç kapsülün arka kolu** lentiform çekirdek ile talamus arasındadır.
- **Karıncıklar:** yan karıncık → karıncıklar arası delik → üçüncü karıncık → beyin su yolu → dördüncü karıncık.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Işığa değil, yakına bakınca daralan göz bebekleri',
      oyku: `48 yaşında bir adam, göz doktorunun yönlendirmesiyle nöroloji polikliniğine geliyor. Muayenede iki gözüne de ayrı ayrı ışık tutulduğunda iki göz bebeği de daralmıyor. Hastadan yakındaki bir kalemin ucuna bakması istenince ise iki göz bebeği de belirgin biçimde daralıyor. Görmesi ve göz hareketleri normal. Kan testlerinde geçirilmiş bir sifiliz enfeksiyonunun izleri bulunuyor.`,
      soru: 'Işık refleksinin kaybolup yakına bakınca daralmanın korunması, beynin hangi bölümünde bir hasarı düşündürür?',
      cozum: `**Merkez nerede?** Göz bebeğinin ışık refleksinin merkezi **pretektal alandır** (*area pretectalis*). UTHealth onu orta beyinde anlatır (Dragoi, 2020b); TA2 ise pretektumu ara beynin bir bölgesi olarak sınıflar (FIPAT, 2019). Bu alanın nöronları aksonlarının çoğunu **arka komissürden** iki yana gönderir ve Edinger–Westphal çekirdeklerinde sonlanır (Dragoi, 2020b). Edinger–Westphal çekirdeği orta beyindeki okülomotor çekirdek kompleksinin parçasıdır; aksonları okülomotor sinirle göz çukurunun arkasındaki siliyer gangliyona (*ganglion ciliare*) gider, oradan çıkan lifler iristeki düz kası sinirlendirerek göz bebeğinin genişliğini ayarlar (OpenStax 15.1). Bu iki yanlı bağlantı yüzünden tek göze tutulan ışık normalde iki göz bebeğini de daraltır (Dragoi, 2020b).

**Bulgunun adı:** Pretektal alan nöronlarının iki taraflı hasarı, örneğin nörosifilizde, ışığa yanıt vermeyen ama yakına uyum sırasında daralan göz bebeklerine, yani **Argyll Robertson göz bebeklerine** yol açar (Dragoi, 2020b). Bu hastanın bulguları bu tabloya uyar.

**Haritadaki yeri:** Pretektal aksonların geçtiği arka komissür, ara beyin ile orta beyin arasındaki sınırın işaretidir (Dafny, 2020); yani refleksin merkezi bu sınırın hemen yakınındadır.

**Kaynak uyarısı:** Bir ders kitabı göz bebeği reflekslerini hipotalamusun yönettiğini yazar (OpenStax 15.3); bu ifade kullanılmamalı, refleksin merkezi pretektal alandır (Dragoi, 2020b). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Tanım farkları ve kaynak hataları',
      md: `- **Serebrum:** OpenStax’e göre telensefalon; TA2’ye göre telensefalon ve diensefalon, yani ön beynin erişkin karşılığı (OpenStax 13.1; FIPAT, 2019). Bir makalede "serebrum hacmi" okurken hangi tanımın kullanıldığına bak.
- **Beyin sapı:** UTHealth’in bir cümlesi ara beyni beyin sapına katar, aynı bölümün başka bir yeri katmaz (Dafny, 2020); OpenStax ve TA2 üç katlı tanımı kullanır (OpenStax 13.1; FIPAT, 2019).
- **Beyincik bağlantıları:** OpenStax beyinciğin çıkışını yalnızca orta beyne, yani kırmızı çekirdeğe ve oradan omuriliğe inen rubrospinal yola bağlar ve bedenden gelen duyu bilgisinin omurilik soğanındaki alt olive "kopyalandığını" yazar (OpenStax 13.2, 14.3). Bu anlatım yanlış değil, eksiktir: beyincikten hareket kabuğuna giden bilgi her zaman talamustan geçer (Knierim, 2020) ve Gray’e göre arka spinoserebellar lifler alt beyincik sapıyla doğrudan beyinciğe girer (Gray, 1918). Aynı kitabın başka bir bölümü beyinciği hareketi "başlatan" yapı diye anar (OpenStax 14.2); bu, karşılaştırıcı tanımıyla bağdaşmaz.
- **İç kapsül:** OpenStax kortikospinal yolun kaudat çekirdek ile putamen arasından geçtiğini yazar (OpenStax 14.3); bu, ön kolun bölgesidir. Gray hareket liflerini lentiform çekirdek ile talamusun arasına, yani arka kola yerleştirir; UTHealth de arka kolun talamusu globus pallidus ve putamenden ayırdığını yazar (Gray, 1918; Dafny, 2020).
- **Gray’in dönemi:** Gray hipotalamusun görme ile ilgili bölümünü "aslında telensefalona ait" sayar (Gray, 1918); bugünkü kitaplar hipotalamusu bütünüyle ara beynin bir bölgesi olarak anlatır (Dafny, 2020; OpenStax 13.2).`,
    },
  ],
};
