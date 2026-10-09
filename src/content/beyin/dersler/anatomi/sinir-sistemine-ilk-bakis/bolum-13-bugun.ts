import type { DersBolumu } from '../../../types';

/** 13. bölüm: sinir sistemi bugün nasıl inceleniyor; konnektomlar, hücre atlasları, BigBrain, Julich-Brain, İnsan Konnektom Projesi. */
export const bugunNasilInceliyoruz: DersBolumu = {
  id: 'bugun-nasil-inceliyoruz',
  baslik: 'Sinir sistemini bugün nasıl inceliyoruz?',
  bloklar: [
    {
      tur: 'metin',
      md: `Bu derste çizdiğimiz harita yüz yılı aşkın bir anatomi birikimine dayanır. Harita bugün de çiziliyor, ama artık çok farklı ölçeklerde.

- **Bütün beyin ölçeği:** İnsan Konnektom Projesi (HCP), sağlıklı erişkinlerden oluşan büyük bir toplulukta beynin makroskopik devrelerini ve bunların davranışla ilişkisini haritalamayı amaçlar (Van Essen ve ark., 2013).
- **Doku ve hücre ölçeği:** BigBrain, 7404 doku kesitinden yeniden kurulmuş, hücre düzeyine yakın, yaklaşık 20 mikrometre çözünürlükte üç boyutlu bir insan beyni modelidir (Amunts ve ark., 2013). Julich-Brain, kabuk alanlarının ve kabuk altı çekirdeklerin hücre dizilimine dayanan haritalarını içeren üç boyutlu bir atlastır (Amunts ve ark., 2020). Hücre atlasları ise milyonlarca hücreyi tek tek inceleyip **hücre tiplerini** sınıflandırır (Siletti ve ark., 2023).
- **Sinaps ölçeği:** Nöronlar arasındaki bağlantılar elektron mikroskobu görüntüleri toplanıp çözümlenerek haritalanır; bu bağlantı haritalarına **konnektom** denir (Dorkenwald ve ark., 2024).

Son ölçeğe ulaşmak uzun süre olanaksız sanıldı. Francis Crick 1979’da, bir milimetreküp beyin dokusunun kesin bağlantı şemasını “olanaksız” isteklere örnek olarak vermişti (MICrONS Consortium, 2025). Bugün bir meyve sineğinin bütün beyninde 139.255 nöron tek tek yeniden kurulmuştur (Dorkenwald ve ark., 2024); milimetreküp ölçeğindeki kabuk parçaları da farede elektron mikroskobuyla (MICrONS Consortium, 2025), insanda nanometre çözünürlükte (Shapson-Coe ve ark., 2024) yeniden kurulmuştur.`,
    },
    {
      tur: 'sahne',
      baslik: 'Haritası en ayrıntılı çıkarılan bölgelerden ikisi',
      aciklama:
        'Beyin soldan görülüyor; ön taraf solda ve renkler yalnızca lobları gösterir. Etiketli iki bölge bu bölümde adı geçen iki çalışmaya işaret eder: hücre sayımı ağının (BICCN) ilk atlası memelilerin birincil hareket kabuğuna, H01 örneği ise bir insanın temporal lobundan alınmış bir milimetreküplük kabuk parçasına aittir. Örneğin lobun hangi kıvrımından alındığı burada gösterilmez; etiket yalnızca lobu işaret eder. Julich-Brain gibi atlaslar kabuğu, bu modeldeki loblardan çok daha fazla sayıda alana böler.',
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
      md: '**Üç ölçek:** bütün beyin ve büyük devreler (İnsan Konnektom Projesi); doku ve hücre düzeyinde atlaslar (BigBrain, Julich-Brain, hücre tipi atlasları); sinaps düzeyinde bağlantı şemaları (konnektomlar).\n\n**Konnektom:** nöronlar arasındaki bağlantıların haritası; elektron mikroskobu görüntülerinden çıkarılır.\n\n**Olasılıksal atlas:** her alanın sınırını, beyinden beyne değişkenliği de hesaba katarak gösteren harita (Julich-Brain).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Bir epilepsi ameliyatında, altındaki nöbet odağına ulaşmak için çıkarılan bir milimetreküplük insan temporal kabuğunun ince yapısı nanometre çözünürlükte yeniden kurulduğunda içinden yaklaşık **57.000 hücre**, **230 milimetre kan damarı** ve **150 milyon sinaps** çıktı. Bu tek parçanın verisi 1,4 petabayt tutuyordu (Shapson-Coe ve ark., 2024).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hücre tipi atlasları.** BRAIN Girişimi Hücre Sayımı Ağı (BICCN), ilk ürünü olarak memeli birincil hareket kabuğunun çok yöntemli bir hücre sayımını ve atlasını yayımladı. Atlas; tek hücre transkriptomlarını, kromatin erişilebilirliğini, DNA metilomunu, uzamsal transkriptomu, hücre biçimini ve elektrofizyolojik özellikleri bir araya getirir. Türler arası analiz, fareden marmosete ve insana kadar korunmuş ortak bir transkriptomik hücre tipi sınıflaması verdi (BICCN, 2021).

Bütün fare beyni atlasında yaklaşık 7 milyon hücre tek hücre RNA dizilemesiyle (kalite denetimini geçen yaklaşık 4,0 milyon), yaklaşık 4,3 milyon hücre de uzamsal transkriptomik bir yöntemle (MERFISH) incelendi; atlas dört iç içe düzeyde düzenlendi: 34 sınıf, 338 alt sınıf, 1201 üst tip ve 5322 küme (Yao ve ark., 2023). İnsanda üç ölü donörün ön, orta ve arka beyninden yaklaşık 100 doku parçasında 3 milyondan fazla hücre çekirdeği dizilendi; 461 küme ve 3313 alt küme bulundu. Kümeler büyük ölçüde **gelişimsel kökenlerine göre** düzenleniyordu ve orta beyin ile arka beyin nöronlarında çeşitlilik yüksekti (Siletti ve ark., 2023). Bu, gelişim bölümünde gördüğümüz kökenlerin yetişkin beynin hücre haritasında da önemini koruduğunu düşündürür.

**Bağlantı şemaları.** FlyWire, bir dişi meyve sineğinin (*Drosophila melanogaster*) bütün beyninde 139.255 nöronu yeniden kurdu (Dorkenwald ve ark., 2024). MICrONS veri seti, uyanık bir farenin birincil ve üst görme alanlarında yaklaşık 75.000 nöronun etkinliğini kalsiyum görüntülemeyle kaydetti ve bunu 200.000’den fazla hücre ile 0,5 milyar sinaps içeren bir elektron mikroskobu yeniden yapılandırmasıyla eşleştirdi (MICrONS Consortium, 2025). İnsanda H01 örneği, cerrahi olarak çıkarılmış bir milimetreküplük temporal kabuktur (Shapson-Coe ve ark., 2024). Julich-Brain olasılıksal bir atlas olduğu için bireysel beyinler arasındaki farkları hesaba katar (Amunts ve ark., 2020). Bu yöntemlerin nasıl çalıştığı Beyni İnceleme Yöntemleri bölümünde (Tomografi ve MR; Hücre düzeyinde yöntemler) işlenecek.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Büyük haritalama çalışmaları',
      sutunlar: ['Çalışma', 'Ne haritalandı?', 'Ölçek ve örneklem', 'Kaynak'],
      satirlar: [
        [
          'İnsan Konnektom Projesi (HCP)',
          'Makroskopik beyin devreleri ve davranışla ilişkisi',
          'Büyük bir sağlıklı erişkin topluluğu',
          'Van Essen ve ark., 2013',
        ],
        ['BigBrain', 'Üç boyutlu insan beyni modeli', '7404 doku kesiti; ~20 µm çözünürlük', 'Amunts ve ark., 2013'],
        [
          'Julich-Brain',
          'Kabuk alanları ve kabuk altı çekirdeklerin sitoarkitektonik haritaları',
          'Olasılıksal üç boyutlu atlas; bireyler arası değişkenliği hesaba katar',
          'Amunts ve ark., 2020',
        ],
        [
          'BICCN birincil hareket kabuğu atlası',
          'Hücre tipleri: transkriptom, kromatin, metilom, uzamsal veri, biçim, elektrofizyoloji',
          'Fare, marmoset ve insan; türler arası ortak sınıflama',
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
          'İşlev + bağlantı (görme kabuğu)',
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
      not: 'Tablo yalnızca bu derste kullanılan kaynakları içerir; alandaki bütün çalışmaların listesi değildir.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Konnektomlar: Crick’ten milimetreküpe',
      md: `**Ölçek.** MICrONS, Crick’in 1979’da olanaksız saydığı hedefi gerçekleştirmeye yönelik bir veri setidir: farenin görme kabuğunda, canlıdaki boyutları 1,3 × 0,87 × 0,82 mm³ olan bir hacimde nöronların işlevini ve bağlantılarını aynı dokuda birleştirir. Ancak tam dendrit ağaçlarını ve akson uzantılarını içeren ayrıntılı düzeltme (*proofreading*) nöronların yalnızca bir bölümünde yapılmıştır (MICrONS Consortium, 2025). Sinekte FlyWire’dan önceki en yakın kaynak bir “yarım beyin” veri setiydi: görüntülenen hacmin sınırlarınca en az kesilmiş yaklaşık 20.000 nöron ve aralarında 14 milyon sinaps (Dorkenwald ve ark., 2024).

**Sayıları okumak.** FlyWire’da görüntülerde otomatik olarak saptanan kimyasal sinapslara göre bütün beyin 0,0175 mm³ nöropil hacmi ve yaklaşık 130 milyon sinaps içerir; bu, mikrometreküpte 7,4 sinaps demektir ve memeli kabuğundaki yoğunluktan (mikrometreküpte 1’den az) çok yüksektir (Dorkenwald ve ark., 2024). Aynı makalenin özetinde, yeniden kurulmuş nöronlar arasındaki sinapslar için başka bir sayı geçer; bir sinaps sayısı, neyi ölçtüğü belirtilmeden aktarılmamalıdır.

**Tek parça, genel kural değildir.** H01 örneğinde glia hücreleri nöronlardan iki kat fazlaydı ve en sık görülen hücre oligodendrositti (Shapson-Coe ve ark., 2024). Bu oran tek bir milimetreküplük temporal kabuk parçasına aittir; bütün beyin için verilen glia–nöron oranlarıyla karıştırılmamalıdır. Örnek, altındaki epilepsi odağına ulaşmak için ameliyatta çıkarılan dokudur (Shapson-Coe ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Hücre tipleri nasıl sınıflanıyor?',
      md: `Bütün fare beyni atlasında **transkripsiyon etkenlerinin** hücre tipi sınıflamasının başlıca belirleyicileri olduğu bulundu (Yao ve ark., 2023). BICCN’in türler arası analizi, transkriptomik tiplerin ve bunların hiyerarşik düzeninin fareden marmosete ve insana kadar korunduğunu gösterdi (BICCN, 2021). İnsan beyni atlasında ise kümeler büyük ölçüde gelişimsel kökene göre düzenleniyordu ve orta beyin ile arka beyin nöronlarında çeşitlilik yüksekti (Siletti ve ark., 2023).

Atlaslar da ölçeğe göre farklı sorulara yanıt verir: BigBrain 7404 kesitten kurulmuş tek bir beyindir ve hücre düzeyine yakın 20 mikrometre çözünürlüğe ulaşır (Amunts ve ark., 2013); Julich-Brain ise kabuk alanlarının ve kabuk altı çekirdeklerin sitoarkitektonik haritalarını olasılıksal bir atlasta toplar ve böylece bireysel beyinler arasındaki farkları hesaba katar (Amunts ve ark., 2020).`,
    },
  ],
};
