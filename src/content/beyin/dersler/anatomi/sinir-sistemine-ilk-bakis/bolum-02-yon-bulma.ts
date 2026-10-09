import type { DersBolumu, Sahne } from '../../../types';

const KESIT_KATMANLARI: Sahne['katmanlar'] = ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'];

/** 02. bölüm: yön terimleri, bükülen eksen, kesit düzlemleri, görüntülerde sağ ve sol, stereotaksi (özet; ayrıntısı "Anatominin dili" dersinde). */
export const yonBulma: DersBolumu = {
  id: 'yon-bulma',
  baslik: 'Sinir sisteminde yön bulmak',
  bloklar: [
    {
      tur: 'metin',
      md: `Bir yapının yerini söylemek için ortak bir dil gerekir. Anatomide yönler hep aynı başlangıç duruşuna göre söylenir: **anatomik duruş**. Bu duruşta kişi dik durur. Ayakları omuz genişliğinde açık ve paraleldir, ayak parmakları öne dönüktür. Kolları iki yana açıktır ve avuç içleri öne bakar (OpenStax 1.6). Hasta yatıyor olabilir ya da eli masada ters duruyor olabilir. Yönler yine bu duruşa göre söylenir (OpenStax 1.6). Bu duruşa göre:

- **Üst** (*superior*) başa, **alt** (*inferior*) ayaklara doğrudur.
- **Ön** (*anterior*) yüze, **arka** (*posterior*) sırta doğrudur.
- **İç** (*medialis*) orta hatta, **dış** (*lateralis*) kenara doğrudur (Henley, 2021).

Sinir sisteminde dört terim daha sık geçer: **rostral** (başa doğru), **kaudal** (kuyruğa doğru), **dorsal** (sırta doğru) ve **ventral** (karına doğru). Dört ayaklı bir hayvanda merkezî sinir sisteminin ekseni düz bir çizgidir. Orada bu terimler beyinde de omurilikte de aynı yönü gösterir. İnsanda dik duruş bu ekseni orta beyin hizasında yaklaşık 90 derece büker. Bu yüzden terimlerin anlamı beyinde ve omurilikte farklıdır. **Dorsal** beyinde kafatasının tepesini, omurilikte sırtı gösterir. **Rostral** beyinde önü, omurilikte başı gösterir (Henley, 2021).`,
    },
    {
      tur: 'animasyon',
      ad: 'yon-pusulasi',
      baslik: 'Yön pusulası',
      aciklama: 'Düğmelere basınca pusula sinir ekseni boyunca beyinden omuriliğe kayar. Kayarken eksenle birlikte döner.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Karıştırmamak için',
      md: `Beyinde **dorsal = üst**, omurilikte **dorsal = arka**.

Beyinde **rostral = ön**, omurilikte **rostral = üst**.

**Üst, alt, ön, arka, iç ve dış** ise bütün vücutta aynı anlamı taşır (Henley, 2021).`,
    },
    {
      tur: 'metin',
      md: `Beynin içini görmenin bir yolu, onu hayalî düzlemlerle dilimlemektir (Henley, 2021). Görüntüleme cihazları da canlı bedenden bu düzlemlerde “sanal kesitler” alır. Manyetik rezonans (MR) ve bilgisayarlı tomografi (BT) cihazları böyle çalışır (OpenStax 1.6):

- **Sagital düzlem** dikeydir ve beyni **sağ ve sol** diye ayırır. Tam orta hattan geçene **orta sagital** (median) düzlem denir (OpenStax 1.6).
- **Koronal** (frontal) **düzlem** de dikeydir. İki kulağa paralel uzanır ve beyni **ön ve arka** diye ayırır.
- **Horizontal düzlem** yere paraleldir ve beyni **üst ve alt** diye ayırır. Görüntülemede bu kesitlere **aksiyel** kesit denir (Conti ve ark., 2023).

Aşağıdaki sahnede düzlemi kendin seç ve kesiti kaydır. Kesilen yüzeyde dışta gri kabuğu, içte beyaz cevheri görürsün. Derinde de çekirdekler ve karıncıklar ortaya çıkar.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kendi kesitini al',
      aciklama:
        'Önce bir düzlem seç, sonra kaydırıcıyla kesitin yerini değiştir. Renkler doğala yakındır. Kesilen yüzeyde gri cevher koyu, beyaz cevher açık görünür. Derin çekirdekler ve karıncıklar da kesitte ortaya çıkar. Başlangıçta beyne yukarıdan bakıyoruz (ön taraf ekranın üstünde). Katmanlar düğmesiyle kafatasını da ekleyebilirsin.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'aksiyel', konum: 0.3 },
        bakis: 'ust',
      },
      araclar: ['kesit', 'bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Anatomik duruş:** dik, ayaklar paralel, avuç içleri önde. Yönler hep bu duruşa göre söylenir.

**Bükülen eksen:** İnsanda sinir ekseni orta beyinde ~90° bükülür. Bu yüzden dorsal ve rostral, beyinde ve omurilikte farklı yönleri gösterir.

**Üç düzlem:** sagital (sağ–sol), koronal (ön–arka), horizontal ya da aksiyel (üst–alt).

Yönler, düzlemler ve görüntülerde yön bulmak bir sonraki derste (**Anatominin dili**) ayrıntılı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yön dilinin bir parçası da **taraftır**. Hasarla aynı yandaki belirtiye **ipsilateral**, karşı yandakine **kontralateral** denir. Hareket komutunu taşıyan yol büyük ölçüde karşı tarafa geçer (çaprazlaşır). Bu yüzden sağ yarımkürenin hareket kabuğu, vücudun sol yarısındaki kasları yönetir (OpenStax 14.3). Çaprazlaşmanın nerede olduğunu bilmek, hasarın yerini bulmanın anahtarıdır. Bu dersin **Belirtiden yere: hasar nerede?** bölümünde örnekleri var.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Görüntüde sağ ve sol.** Kesit görüntüsüne bakarken bir sorun daha çıkar: ekranın solu hastanın solu mudur, sağı mı? İki gösterim kuralı vardır. **Radyolojik gösterimde** hastanın solu ekranın sağındadır. Aksiyel kesite hastanın ayak ucundan bakıyormuşsun gibi olur. **Nörolojik gösterimde** hastanın sağı ekranın sağındadır. Kesite başın tepesinden bakıyormuşsun gibi olur. Bu yalnızca bir gösterim kuralıdır; görüntü dosyası aynıdır. Yazılım hangi yanın sağ olduğunu biliyorsa, görüntüyü izleyenin alışkanlığına göre çevirebilir (NiBabel, t.y.-b).

Bu yüzden bir görüntüde taraf, ekrandaki **R** (sağ) ve **L** (sol) işaretlerine bakılmadan söylenmez.`,
    },
    {
      tur: 'animasyon',
      ad: 'mr-gosterimi',
      duzey: 'lisans',
      baslik: 'MR’da sağ ve sol',
      aciklama:
        'Radyolojik gösterimde aksiyel kesite hastanın ayak ucundan bakılır. Hastanın sağı ekranın solunda görünür. Düğmeyle nörolojik gösterime geçince görüntü aynalanır.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Aynı terim, iki eksen',
      sutunlar: ['Terim', 'Beyinde (ön beyin ekseni)', 'Omurilikte'],
      satirlar: [
        ['Dorsal', 'Beynin tepesine doğru (üst)', 'Sırta doğru (arka)'],
        ['Ventral', 'Beynin alt yüzüne doğru (alt)', 'Karına doğru (ön)'],
        ['Rostral', 'Beynin önüne doğru', 'Yukarı, başa doğru'],
        ['Kaudal', 'Beynin arkasına doğru', 'Aşağı, omuriliğin alt ucuna doğru'],
        ['Üst, alt, ön, arka, iç, dış', 'Vücuttaki anlamıyla', 'Vücuttaki anlamıyla'],
      ],
      not: 'Kaynak: Henley (2021). Fark, insanda sinir ekseninin orta beyin hizasında yaklaşık 90° bükülmesinden gelir. OpenStax erişkindeki bu bükülmeye “sefalik bükülme” (baş bükülmesi) der. Bükülmenin yeri beyin sapı ile ön beyin arasıdır (OpenStax 13.1).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sagital:** sağ ve sol · **Koronal:** ön ve arka · **Aksiyel (horizontal):** üst ve alt (Henley, 2021).
- Beyinde dorsal = üst, rostral = ön. Omurilikte dorsal = arka, rostral = üst (Henley, 2021).
- **Radyolojik gösterim:** hastanın solu ekranın sağında (ayak ucundan bakış). **Nörolojik gösterim:** hastanın sağı ekranın sağında (baş tepesinden bakış) (NiBabel, t.y.-b).
- Taraf, görüntüdeki R ve L işaretlerine bakılmadan söylenmez.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'BT ve MR’da ne ne renkte görünür?',
      md: `**Bilgisayarlı tomografide (BT)** dokuların yoğunluğu ölçülür. Ölçünün birimi Hounsfield birimidir (HU):

- **Kemik** çok parlaktır (1000 HU’nun üstü). Bazı yazılımlar görüntüden kafatasını ayıklar. Bunlar beyin dokusunu kabaca 20–80 HU aralığıyla seçer (Pham ve ark., 2026).
- **Beyin-omurilik sıvısı** (BOS) beyinden koyudur. Bir çalışmada BT’de BOS, 0–15 HU eşiğiyle ayrıldı (Lee ve ark., 2026).
- **Taze kan** parlaktır, çünkü beyinden yoğundur. Sert zarın altındaki kanamada (subdural kanama) kanın görünümü zamanla değişir. Kan ilk günlerde parlaktır. Yaklaşık iki haftaya kadar beyinle aynı yoğunluktadır. Üç haftadan sonra koyu görünür (Nouri ve ark., 2021). Parlak bir alan kanamayı, daha seyrek olarak kireçlenmeyi gösterebilir (Bustamante ve ark., 2026).

**Manyetik rezonans (MR)** görüntülemede aynı doku, farklı çekim türlerinde (sekans) farklı parlaklıkta görünür (Simha ve ark., 2012):

- **T1 ağırlıklı:** BOS koyu. Gri cevher beyaz cevherden koyu.
- **T2 ağırlıklı:** BOS parlak. Beyaz cevher gri cevherden koyu.
- **FLAIR:** T2’ye benzer. Ama karıncıklardaki BOS’un parlak sinyali bastırılır. Böylece karıncıkların yanındaki beyaz cevher hasarları (lezyonlar) daha iyi seçilir. Örneğin multipl skleroz (MS) plakları.
- **Difüzyon ağırlıklı görüntüleme (DWI):** Suyun doku içindeki hareketine duyarlıdır. Kan akımı kesilip yeni ölen doku (akut enfarkt) parlak bir alan olarak görünür; orada suyun hareketi kısıtlanmıştır. Bu alan, damar tıkandıktan sonraki dakikalar içinde saptanabilir (Simha ve ark., 2012; Tedyanto ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'İki eksen: Forel ve Meynert',
      md: `Sinir ekseninin bükülmesi gelişimde başlar. Embriyoda ilk bükülme orta beyin bölgesinde ortaya çıkar. Adı **sefalik bükülmedir** (Gray, 1918). OpenStax aynı adı erişkin için kullanır: beyin sapı ile ön beyin arasındaki eksen kırılması (OpenStax 13.1). İki kaynakta ad aynıdır, ama anlattıkları dönem farklıdır.

Bükülme yüzünden iki ayrı eksen kullanılır. Ön beyin için **Forel ekseni**, beyin sapı için **Meynert ekseni** (Rusche ve ark., 2021; Shi ve ark., 2024). Komissür, beynin iki yanını bağlayan lif demetidir. Forel ekseni, iki komissürü birleştiren çizgiyle (interkomissural eksen) ilişkilendirilir (Grinberg ve ark., 2011).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Stereotaksi: beyne koordinatla ulaşmak',
      md: `Stereotaksik cerrahi, beynin derinindeki bir noktaya iğne ya da elektrot ulaştırır. Bunun için üç boyutlu bir koordinat sistemi kullanır. Horsley–Clarke aygıtı kafatasına belli noktalardan tutunur. Bu noktalar, x, y ve z eksenli (Kartezyen) koordinat sisteminin başlangıç çizgilerini oluşturdu. Spiegel ve Wycis bu aygıtı insan cerrahisine uyguladı (Conti ve ark., 2023).

- **AC–PC çizgisi:** Ön komissür (AC) ile arka komissürü (PC) birleştiren çizgi. 1962’ye gelindiğinde standart stereotaksik başvuru sistemi bu çizgiye dayanıyordu. Bunu Jean Talairach’ın çalışmaları sağladı. Talairach ve Tournoux’nun atlası 1988’de yayımlandı ve tek bir beyne dayanıyordu (Conti ve ark., 2023).
- **Talairach ve MNI uzayı:** Talairach uzayında başlangıç noktası AC’dir. Y ekseni PC’den geçer. MNI uzayında başlangıç noktası, MNI şablon beyninde ön komissürün orta hattı kestiği noktadır (NiBabel, t.y.-a). MNI-ICBM152 şablonu, beyin görüntülerini incelemenin temel araçlarındandır. 152 genç yetişkinin 1,5 tesla MR’larından oluşturuldu (Manera ve ark., 2020). İki uzay birebir aynı değildir. ICBM152’ye yerleştirilen beyinler daha büyük ve burnu aşağı dönük çıkar. Bazı ön bölgelerde fark 1 cm’yi aşar (Lancaster ve ark., 2007).
- **Derin beyin uyarımı (DBU):** Elektrotun hedefi hastalığa göre seçilir. Soluk kürenin iç bölümü (globus pallidus internus), Parkinson hastalığı ve distonide (istemsiz kas kasılmaları) hedeflenir. Talamusun altındaki subtalamik çekirdek de Parkinson hastalığı ve distonide hedeflenir. Talamus ise Parkinson hastalığı ve esansiyel tremorda (bilinen bir nedeni olmayan titreme) hedeflenir. Yöntem ABD’de ilk kez 1997’de onaylandı. Son yıllarda epilepsi için de onaylandı (NINDS, 2026b). Esansiyel tremorda talamusun ventral intermediyer çekirdeği (Vim) ve arka subtalamik bölge hedeflenir (Chopra ve ark., 2013).`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'AC, PC ve derin beyin uyarımının hedefleri',
      aciklama:
        'Sağ yarım kaldırıldı. Derin yapılara soldan, içeriden bakıyoruz (ön taraf sağda). Sarı: ön komissür (AC) ve arka komissür (PC). Stereotaksinin başlangıç çizgisi ikisini birleştirir. Pembe: talamus. Esansiyel tremorda onun Vim çekirdeği hedeflenir. Turuncu: globus pallidus. Onun iç bölümü Parkinson ve distonide hedeflenir. Subtalamik çekirdek bu modelde ayrı bir parça olarak yoktur.',
      sahne: {
        katmanlar: ['derin', 'sap'],
        renk: 'yapi',
        goster: [
          'on-komissur',
          'arka-komissur',
          'talamus',
          'globus-pallidus',
          'putamen',
          'kaudat-cekirdek',
          'korpus-kallozum',
          'bolge:beyin-sapi',
          'hipotalamus',
          'mamiller-cisimler',
        ],
        vurgula: ['on-komissur', 'arka-komissur', 'talamus', 'globus-pallidus'],
        boya: [
          { secici: ['on-komissur', 'arka-komissur'], renk: '#f2b544' },
          { secici: ['talamus'], renk: '#ee6a92' },
          { secici: ['globus-pallidus'], renk: '#f28a52' },
        ],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'on-komissur', metin: 'Ön komissür (AC)' },
          { yapi: 'arka-komissur', metin: 'Arka komissür (PC)' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'globus-pallidus-sol', metin: 'Globus pallidus' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Görüntü dosyalarında sağ ve sol: RAS ve LPS',
      md: `Radyolojik ve nörolojik gösterim ekrana ait bir kuraldır. Görüntü dosyalarının içinde ise koordinatlar bir eksen kuralıyla yazılır. Beyin görüntüleme dosyalarında yaygın kural **RAS+** kuralıdır. Bu kuralda x ekseni soldan **sağa** (Right), y ekseni arkadan **öne** (Anterior), z ekseni aşağıdan **yukarı** (Superior) doğru artar. DICOM, tıbbi görüntüler için kullanılan bir dosya biçimidir. DICOM dosyaları görüntünün küçük hacim birimlerini (voksel), çekimi yapan cihazın **LPS+** uzayına bağlar. Bu uzayda x sola, y arkaya doğru artar (NiBabel, t.y.-a). İki kuralda x ve y eksenlerinin yönü terstir. Bu yüzden dosyanın hangi kuralı kullandığı bilinmeden dönüşüm yapılırsa sağ ve sol karışabilir.

Karışıklığı artıran bir kullanım daha vardır. Bazıları, voksel eksenleri RAS’a hizalı dosyalara “nörolojik düzende” der. Çünkü böyle bir dosyanın en basit gösterimi nörolojik gösterimi verir (NiBabel, t.y.-b). Yani “radyolojik” ve “nörolojik” sözcükleri iki şey için kullanılır: ekran kuralı ve dosya düzeni. Hangisinin kastedildiğini her seferinde sormak gerekir.`,
    },
  ],
};
