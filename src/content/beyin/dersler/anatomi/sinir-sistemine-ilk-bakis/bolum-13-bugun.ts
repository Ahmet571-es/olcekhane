import type { DersBolumu } from '../../../types';

/** 13. bölüm: sinir sistemi bugün nasıl inceleniyor; konnektomlar, hücre atlasları, BigBrain, Julich-Brain, İnsan Konnektom Projesi. */
export const bugunNasilInceliyoruz: DersBolumu = {
  id: 'bugun-nasil-inceliyoruz',
  baslik: 'Sinir sistemini bugün nasıl inceliyoruz?',
  bloklar: [
    {
      tur: 'metin',
      md: `Bu derste çizdiğimiz harita, yüz yılı aşkın bir anatomi birikimine dayanır. Harita bugün de çiziliyor. Ama artık çok farklı ölçeklerde çiziliyor.

- **Bütün beyin ölçeği:** İnsan Konnektom Projesi (HCP), sağlıklı yetişkinlerden oluşan büyük bir topluluğu inceler. Amacı, beynin gözle görülebilecek büyüklükteki (makroskopik) devrelerini haritalamaktır. Bu devrelerin davranışla ilişkisine de bakar (Van Essen ve ark., 2013).
- **Doku ve hücre ölçeği:** BigBrain, üç boyutlu bir insan beyni modelidir. 7404 ince doku kesitinden yeniden kurulmuştur. Çözünürlüğü yaklaşık 20 mikrometredir; bu, hücre düzeyine yakın bir ayrıntıdır (Amunts ve ark., 2013). Julich-Brain da üç boyutlu bir atlastır. Kabuk alanlarını ve kabuk altındaki çekirdekleri, hücrelerin dizilişine bakarak ayırır (Amunts ve ark., 2020). Hücre atlasları ise milyonlarca hücreyi tek tek inceler ve **hücre tiplerine** ayırır (Siletti ve ark., 2023).
- **Sinaps ölçeği:** Nöronlar arasındaki bağlantıları haritalamak için elektron mikroskobu görüntüleri toplanır ve çözümlenir. Böyle bir bağlantı haritasına **konnektom** denir (Dorkenwald ve ark., 2024).

Son ölçeğe ulaşmak uzun süre olanaksız sanıldı. Francis Crick 1979’da “olanaksız” isteklere bir örnek vermişti: bir milimetreküp beyin dokusunun tam bağlantı şeması (MICrONS Consortium, 2025). Bugün bir meyve sineğinin bütün beynindeki 139.255 nöron tek tek yeniden kurulmuştur (Dorkenwald ve ark., 2024). Yeniden kurmak, görüntülerden yapının üç boyutlu biçimini çıkarmak demektir. Milimetreküp büyüklüğünde kabuk parçaları da yeniden kuruldu. Farede bu iş elektron mikroskobuyla yapıldı (MICrONS Consortium, 2025). İnsanda ise nanometre çözünürlükte yapıldı (Shapson-Coe ve ark., 2024).`,
    },
    {
      tur: 'sahne',
      baslik: 'Haritası en ayrıntılı çıkarılan bölgelerden ikisi',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Renkler yalnızca lobları gösterir. Etiketli iki bölge, bu bölümde adı geçen iki çalışmaya işaret eder. Birincisi hücre sayımı ağının (BICCN) ilk atlasıdır: memelilerin birincil hareket kabuğunu inceler. İkincisi H01 örneğidir: bir insanın temporal lobundan alınmış, bir milimetreküplük bir kabuk parçası. Parçanın lobun hangi kıvrımından alındığı burada gösterilmez; etiket yalnızca lobu işaret eder. Julich-Brain gibi atlaslar kabuğu, bu modeldeki loblardan çok daha fazla alana böler.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        bakis: 'sol',
        etiketler: [
          { yapi: 'presantral-girus-sol', metin: 'Birincil hareket kabuğu (BICCN)' },
          { yapi: 'orta-temporal-girus-sol', metin: 'Temporal lob (H01)' },
        ],
      },
      araclar: ['bakis', 'renk', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Üç ölçek var.**\n\n- Bütün beyin ve büyük devreler: İnsan Konnektom Projesi.\n- Doku ve hücre: BigBrain, Julich-Brain ve hücre tipi atlasları.\n- Sinaps: bağlantı şemaları, yani konnektomlar.\n\n**Konnektom**, nöronlar arasındaki bağlantıların haritasıdır. Elektron mikroskobu görüntülerinden çıkarılır.\n\n**Olasılıksal atlas**, her alanın sınırını gösteren bir haritadır. Bunu yaparken sınırın beyinden beyne değişmesini de hesaba katar. Julich-Brain böyle bir atlastır.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Bir epilepsi ameliyatında nöbet odağı, yani nöbetin başladığı yer, daha derindeydi. Cerrahlar ona ulaşmak için üstteki kabuktan küçük bir parça çıkardı. Bu, bir milimetreküplük bir insan temporal kabuğuydu. Parçanın ince yapısı nanometre çözünürlükte yeniden kuruldu. İçinden yaklaşık **57.000 hücre**, **230 milimetre kan damarı** ve **150 milyon sinaps** çıktı. Bu tek parçanın verisi 1,4 petabayt tutuyordu (Shapson-Coe ve ark., 2024).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hücre tipi atlasları.** BRAIN Girişimi Hücre Sayımı Ağı’nın kısa adı BICCN’dir. Ağın ilk ürünü, memelilerin birincil hareket kabuğu için bir hücre sayımı ve atlastı. Atlas birçok yöntemi bir araya getirir. Her yöntem hücrenin başka bir yüzünü ölçer:

- tek tek hücrelerde okunan genler (tek hücre transkriptomu),
- DNA’nın hangi bölgelerinin açık olduğu (kromatin erişilebilirliği),
- DNA üzerindeki metil işaretleri (DNA metilomu),
- genlerin dokunun neresinde okunduğu (uzamsal transkriptom),
- hücrenin biçimi,
- hücrenin elektriksel özellikleri (elektrofizyoloji).

Ağ türleri de karşılaştırdı. Fareden marmosete ve insana kadar korunmuş, ortak bir hücre tipi sınıflaması buldu. Bu sınıflama genlerin okunuşuna dayanır, yani transkriptomiktir (BICCN, 2021).

Bütün fare beyni için de bir atlas var. Bu atlasta iki yöntem kullanıldı. Yaklaşık 7 milyon hücre, tek hücre RNA dizilemesiyle incelendi; bunların yaklaşık 4,0 milyonu kalite denetimini geçti. Yaklaşık 4,3 milyon hücre de uzamsal transkriptomik bir yöntemle (MERFISH) incelendi. Atlas iç içe dört düzeyde düzenlendi: 34 sınıf, 338 alt sınıf, 1201 üst tip ve 5322 küme (Yao ve ark., 2023).

İnsanda üç ölü donörün beyni incelendi. Ön, orta ve arka beyinden yaklaşık 100 doku parçası alındı. Bu parçalarda 3 milyondan fazla hücre çekirdeği dizilendi. Sonuçta 461 küme ve 3313 alt küme bulundu. Kümeler büyük ölçüde **gelişimsel kökenlerine göre** düzenleniyordu. Yani hücreler, embriyoda nereden geldiklerine göre gruplanıyordu. Orta beyin ve arka beyin nöronlarında çeşitlilik yüksekti (Siletti ve ark., 2023). Gelişim bölümünde bu kökenleri görmüştük. Bu bulgu, o kökenlerin yetişkin beynin hücre haritasında da önemli kaldığını düşündürür.

**Bağlantı şemaları.** FlyWire, bir dişi meyve sineğinin (*Drosophila melanogaster*) bütün beyninde 139.255 nöronu yeniden kurdu (Dorkenwald ve ark., 2024). MICrONS veri seti ise iki ölçümü aynı dokuda eşleştirdi. Bir yanda uyanık bir farenin görme alanlarında yaklaşık 75.000 nöronun etkinliği kaydedildi. Bu alanlar birincil ve üst görme alanlarıydı. Kayıt için kalsiyum görüntüleme kullanıldı; bu yöntemde çalışan nöron ışık saçar. Öte yanda aynı doku elektron mikroskobuyla yeniden kuruldu. Bu hacimde 200.000’den fazla hücre ve 0,5 milyar sinaps vardı (MICrONS Consortium, 2025). İnsanda H01 örneği, ameliyatla çıkarılmış bir milimetreküplük temporal kabuktur (Shapson-Coe ve ark., 2024). Julich-Brain olasılıksal bir atlastır. Bu yüzden beyinden beyne olan farkları hesaba katar (Amunts ve ark., 2020). Bu yöntemlerin nasıl çalıştığını Beyni İnceleme Yöntemleri bölümünde göreceğiz (Tomografi ve MR; Hücre düzeyinde yöntemler).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Büyük haritalama çalışmaları',
      sutunlar: ['Çalışma', 'Ne haritalandı?', 'Ölçek ve örneklem', 'Kaynak'],
      satirlar: [
        [
          'İnsan Konnektom Projesi (HCP)',
          'Beynin büyük devreleri ve davranışla ilişkisi',
          'Büyük bir sağlıklı yetişkin topluluğu',
          'Van Essen ve ark., 2013',
        ],
        ['BigBrain', 'Üç boyutlu insan beyni modeli', '7404 doku kesiti; ~20 µm çözünürlük', 'Amunts ve ark., 2013'],
        [
          'Julich-Brain',
          'Kabuk alanları ve kabuk altı çekirdekler; hücre dizilişine (sitoarkitektoni) göre',
          'Üç boyutlu olasılıksal atlas; beyinden beyne farkları hesaba katar',
          'Amunts ve ark., 2020',
        ],
        [
          'BICCN birincil hareket kabuğu atlası',
          'Hücre tipleri: okunan genler, kromatin, DNA metilasyonu, dokudaki yer, biçim, elektriksel özellikler',
          'Fare, marmoset ve insan; türlerde ortak sınıflama',
          'BICCN, 2021',
        ],
        [
          'Bütün fare beyni atlası',
          'Hücre tipleri',
          '~7 milyon hücre (RNA dizileme) + ~4,3 milyon hücre (uzamsal); 5322 küme',
          'Yao ve ark., 2023',
        ],
        [
          'İnsan beyni hücre atlası',
          'Hücre tipleri',
          '3 donör, ~100 doku parçası, 3 milyondan fazla çekirdek; 461 küme, 3313 alt küme',
          'Siletti ve ark., 2023',
        ],
        ['FlyWire', 'Bütün beynin bağlantı şeması', 'Dişi meyve sineği; 139.255 nöron', 'Dorkenwald ve ark., 2024'],
        [
          'MICrONS',
          'İşlev ve bağlantı (görme kabuğu)',
          'Fare; ~75.000 nöronda kalsiyum görüntüleme; 200.000’den fazla hücre ve 0,5 milyar sinapslık elektron mikroskobu hacmi',
          'MICrONS Consortium, 2025',
        ],
        [
          'H01',
          'Bir milimetreküp insan temporal kabuğunun ince yapısı',
          '~57.000 hücre, ~230 mm kan damarı, ~150 milyon sinaps; 1,4 petabayt',
          'Shapson-Coe ve ark., 2024',
        ],
      ],
      not: 'Tabloda yalnızca bu derste kullanılan kaynaklar var. Alandaki bütün çalışmaların listesi değildir.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Konnektomlar: Crick’ten milimetreküpe',
      md: `**Ölçek.** MICrONS, Crick’in 1979’da olanaksız saydığı hedefe yönelik bir veri setidir. Farenin görme kabuğundan bir doku hacmini ele alır. Bu hacmin canlıdaki boyutları 1,3 × 0,87 × 0,82 mm³’tür. Veri seti, bu hacimdeki nöronların hem işlevini hem bağlantılarını aynı dokuda birleştirir. Ama her nöron aynı özenle denetlenmedi. Bilgisayarın çıkardığı şekiller sonradan tek tek denetlenip düzeltilir; buna düzeltme (*proofreading*) denir. Dendrit ağaçlarını ve akson uzantılarını tam içeren ayrıntılı düzeltme, nöronların yalnızca bir bölümünde yapıldı (MICrONS Consortium, 2025). Sinekte FlyWire’dan önce en yakın kaynak bir “yarım beyin” veri setiydi. Bu sette yaklaşık 20.000 nöron vardı; bunlar, görüntülenen hacmin kenarlarınca en az kesilmiş nöronlardı. Aralarında 14 milyon sinaps vardı (Dorkenwald ve ark., 2024).

**Sayıları okumak.** FlyWire’da kimyasal sinapslar görüntülerde otomatik olarak saptandı. Bu sayıma göre sineğin bütün beyninde 0,0175 mm³ nöropil vardır. Nöropil, nöron uzantılarının ve sinapsların yoğun olduğu dokudur. Bu hacimde yaklaşık 130 milyon sinaps bulunur. Bu da mikrometreküpte 7,4 sinaps demektir. Memeli kabuğunda yoğunluk çok daha düşüktür: mikrometreküpte 1’den az (Dorkenwald ve ark., 2024). Aynı makalenin özetinde başka bir sinaps sayısı geçer. O sayı, yeniden kurulmuş nöronlar arasındaki sinapsları sayar. Bu yüzden bir sinaps sayısını aktarırken neyi ölçtüğünü de söyle.

**Tek parça, genel kural değildir.** H01 örneğinde glia hücreleri nöronlardan iki kat fazlaydı. En sık görülen hücre oligodendrositti (Shapson-Coe ve ark., 2024). Ama bu oran tek bir parçaya aittir: bir milimetreküplük temporal kabuk. Onu bütün beyin için verilen glia–nöron oranlarıyla karıştırma. Bu örnek, altındaki epilepsi odağına ulaşmak için ameliyatta çıkarılan dokudur (Shapson-Coe ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Hücre tipleri nasıl sınıflanıyor?',
      md: `Bütün fare beyni atlasında bir şey dikkat çekti. Hücre tiplerini ayırmada başlıca belirleyiciler **transkripsiyon etkenleriydi** (Yao ve ark., 2023). Transkripsiyon etkeni, başka genleri açıp kapatan bir proteindir. BICCN de türleri karşılaştırdı. Genlerin okunuşuna dayanan (transkriptomik) hücre tipleri fareden marmosete ve insana kadar korunmuştu. Bu tiplerin iç içe (hiyerarşik) düzeni de korunmuştu (BICCN, 2021). İnsan beyni atlasında ise kümeler büyük ölçüde gelişimsel kökene göre düzenleniyordu. Orta beyin ve arka beyin nöronlarında çeşitlilik yüksekti (Siletti ve ark., 2023).

Atlaslar da ölçeğe göre farklı sorulara yanıt verir. BigBrain, 7404 kesitten kurulmuş tek bir beyindir. Çözünürlüğü 20 mikrometredir; bu, hücre düzeyine yakındır (Amunts ve ark., 2013). Julich-Brain ise kabuk alanlarının ve kabuk altı çekirdeklerin haritalarını toplar. Bu haritalar, hücrelerin dizilişine dayanır (sitoarkitektonik harita). Julich-Brain bunları olasılıksal bir atlasta birleştirir. Böylece beyinden beyne olan farkları hesaba katar (Amunts ve ark., 2020).`,
    },
  ],
};
