import type { DersBolumu, Sahne } from '../../../types';

const KESIT_KATMANLARI: Sahne['katmanlar'] = ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'];

/** 02. bölüm: yön terimleri, bükülen eksen, kesit düzlemleri, görüntülerde sağ ve sol, stereotaksi (özet; ayrıntısı ünitenin 1. dersinde). */
export const yonBulma: DersBolumu = {
  id: 'yon-bulma',
  baslik: 'Sinir sisteminde yön bulmak',
  bloklar: [
    {
      tur: 'metin',
      md: `Bir yapının yerini söylemek için ortak bir dil gerekir. Anatomide yönler hep aynı başlangıç duruşuna göre söylenir: **anatomik duruş**. Kişi dik durur; ayakları omuz genişliğinde ve paralel, ayak parmakları öne dönüktür; kolları iki yana açıktır ve avuç içleri öne bakar (OpenStax 1.6). Hasta yatıyor ya da eli masada ters duruyor olsa da yönler bu duruşa göre söylenir (OpenStax 1.6). Bu duruşa göre:

- **Üst** (*superior*) başa, **alt** (*inferior*) ayaklara doğrudur.
- **Ön** (*anterior*) yüze, **arka** (*posterior*) sırta doğrudur.
- **İç** (*medialis*) orta hatta, **dış** (*lateralis*) kenara doğrudur (Henley, 2021).

Sinir sisteminde dört terim daha sık geçer: **rostral** (başa doğru), **kaudal** (kuyruğa doğru), **dorsal** (sırta doğru) ve **ventral** (karına doğru). Dört ayaklı bir hayvanda merkezî sinir sisteminin ekseni düz bir çizgidir; bu terimler beyinde de omurilikte de aynı yönü gösterir. İnsanda dik duruş bu ekseni orta beyin hizasında yaklaşık 90 derece büker. Bu yüzden **dorsal** beyinde kafatasının tepesini, omurilikte sırtı; **rostral** beyinde önü, omurilikte başı gösterir (Henley, 2021).`,
    },
    {
      tur: 'animasyon',
      ad: 'yon-pusulasi',
      baslik: 'Yön pusulası',
      aciklama: 'Düğmelere basınca pusula sinir ekseni boyunca beyinden omuriliğe kayar ve eksenle birlikte döner.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Karıştırmamak için',
      md: 'Beyinde **dorsal = üst**, omurilikte **dorsal = arka**.\n\nBeyinde **rostral = ön**, omurilikte **rostral = üst**.\n\n**Üst, alt, ön, arka, iç ve dış** ise bütün vücutta aynı anlamı taşır (Henley, 2021).',
    },
    {
      tur: 'metin',
      md: `Beynin içini görmenin bir yolu onu hayalî düzlemlerle dilimlemektir (Henley, 2021). MR ve BT gibi görüntüleme cihazları da canlı bedenden bu düzlemlerde “sanal kesitler” alır (OpenStax 1.6):

- **Sagital düzlem** dikeydir ve beyni **sağ ve sol** diye ayırır. Tam orta hattan geçene **orta sagital** (median) düzlem denir (OpenStax 1.6).
- **Koronal** (frontal) **düzlem** de dikeydir, iki kulağa paralel uzanır ve beyni **ön ve arka** diye ayırır.
- **Horizontal düzlem** yere paraleldir ve beyni **üst ve alt** diye ayırır. Görüntülemede bu kesitlere **aksiyel** kesit denir (Conti ve ark., 2023).

Aşağıdaki sahnede düzlemi kendin seç ve kesiti kaydır: kesilen yüzeyde dışta gri kabuğu, içte beyaz cevheri, derinde çekirdekleri ve karıncıkları görürsün.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kendi kesitini al',
      aciklama:
        'Önce bir düzlem seç, sonra kaydırıcıyla kesitin yerini değiştir. Renkler doğala yakındır: kesilen yüzeyde gri cevher koyu, beyaz cevher açık görünür; derin çekirdekler ve karıncıklar da kesitte ortaya çıkar. Başlangıçta beyne yukarıdan bakıyoruz (ön taraf ekranın üstünde). Katmanlar düğmesiyle kafatasını da ekleyebilirsin.',
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
      md: '**Anatomik duruş:** dik, ayaklar paralel, avuç içleri önde. Yönler hep bu duruşa göre söylenir.\n\n**Bükülen eksen:** insanda sinir ekseni orta beyinde ~90° bükülür; dorsal ve rostral beyinde ve omurilikte farklı yönleri gösterir.\n\n**Üç düzlem:** sagital (sağ–sol), koronal (ön–arka), horizontal ya da aksiyel (üst–alt).\n\nYönler, düzlemler ve görüntülerde yön bulmak ünitenin 1. dersinde (**Anatominin dili**) ayrıntılı işlenecek.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yön dilinin bir parçası da **taraftır**. Hasarla aynı yandaki belirtiye **ipsilateral**, karşı yandakine **kontralateral** denir. Hareket komutunu taşıyan yol büyük ölçüde çaprazlaştığı için sağ yarımkürenin hareket kabuğu vücudun sol yarısındaki kasları yönetir (OpenStax 14.3). Çaprazlaşmanın nerede olduğunu bilmek hasarın yerini bulmanın anahtarıdır; bu dersin **Belirtiden yere: hasar nerede?** bölümünde örnekleri var.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Görüntüde sağ ve sol.** Kesit görüntüsüne bakarken bir sorun daha çıkar: ekranın solu hastanın solu mudur, sağı mı? İki gösterim kuralı vardır. **Radyolojik gösterimde** hastanın solu ekranın sağındadır; aksiyel kesite hastanın ayak ucundan bakılıyormuş gibidir. **Nörolojik gösterimde** hastanın sağı ekranın sağındadır; kesite başın tepesinden bakılıyormuş gibidir. Bu yalnızca bir gösterim kuralıdır: görüntü dosyası aynıdır, yazılım hangi yanın sağ olduğunu bildiği sürece görüntüyü izleyenin alışkanlığına göre çevirebilir (NiBabel, t.y.-b).

Bu yüzden bir görüntüde taraf, ekrandaki **R** (sağ) ve **L** (sol) işaretlerine bakılmadan söylenmez.`,
    },
    {
      tur: 'animasyon',
      ad: 'mr-gosterimi',
      duzey: 'lisans',
      baslik: 'MR’da sağ ve sol',
      aciklama:
        'Radyolojik gösterimde aksiyel kesite hastanın ayak ucundan bakılır; hastanın sağı ekranın solunda görünür. Düğmeyle nörolojik gösterime geçince görüntü aynalanır.',
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
      not: 'Kaynak: Henley (2021). Fark, insanda sinir ekseninin orta beyin hizasında yaklaşık 90° bükülmesinden gelir. OpenStax bu erişkin bükülmeye beyin sapı ile ön beyin arasındaki “sefalik bükülme” der (OpenStax 13.1).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sagital:** sağ ve sol · **Koronal:** ön ve arka · **Aksiyel (horizontal):** üst ve alt (Henley, 2021).
- Beyinde dorsal = üst, rostral = ön; omurilikte dorsal = arka, rostral = üst (Henley, 2021).
- **Radyolojik gösterim:** hastanın solu ekranın sağında (ayak ucundan bakış). **Nörolojik gösterim:** hastanın sağı ekranın sağında (baş tepesinden bakış) (NiBabel, t.y.-b).
- Taraf, görüntüdeki R ve L işaretlerine bakılmadan söylenmez.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'BT ve MR’da ne ne renkte görünür?',
      md: `**Bilgisayarlı tomografide (BT)** dokuların yoğunluğu Hounsfield birimiyle (HU) ölçülür:

- **Kemik** çok parlaktır (1000 HU’nun üstü). Görüntüden kafatasını ayıklayan yazılımlar beyin dokusunu kabaca 20–80 HU aralığıyla seçer (Pham ve ark., 2026).
- **Beyin-omurilik sıvısı** beyinden koyudur: bir çalışmada BT’de BOS 0–15 HU eşiğiyle ayrıldı (Lee ve ark., 2026).
- **Taze kan** parlaktır (beyinden yoğun). Subdural kanamada kan ilk günlerde parlak, yaklaşık iki haftaya kadar beyinle aynı yoğunlukta, üç haftadan sonra koyu görünür (Nouri ve ark., 2021). Parlak bir alan kanamayı, daha seyrek olarak kireçlenmeyi gösterebilir (Bustamante ve ark., 2026).

**Manyetik rezonans (MR)** görüntülemede aynı doku farklı sekanslarda farklı parlaklıkta görünür (Simha ve ark., 2012):

- **T1 ağırlıklı:** BOS koyu; gri cevher beyaz cevherden koyu.
- **T2 ağırlıklı:** BOS parlak; beyaz cevher gri cevherden koyu.
- **FLAIR:** T2’ye benzer ama karıncıklardaki BOS’un parlak sinyali bastırılır; böylece karıncıkların yanındaki beyaz cevher lezyonları (örneğin MS plakları) daha iyi seçilir.
- **Difüzyon ağırlıklı görüntüleme (DWI):** Akut enfarkt, suyun hareketinin kısıtlandığı parlak bir alan olarak görünür; damar tıkandıktan sonraki dakikalar içinde saptanabilir (Simha ve ark., 2012; Tedyanto ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'İki eksen: Forel ve Meynert',
      md: `Sinir ekseninin bükülmesi gelişimde başlar: embriyoda ilk bükülme orta beyin bölgesinde ortaya çıkar ve **sefalik bükülme** adını alır (Gray, 1918). OpenStax aynı adı erişkinde beyin sapı ile ön beyin arasındaki eksen kırılması için kullanır (OpenStax 13.1); iki kaynakta ad aynı, bağlam farklıdır.

Bükülme yüzünden iki ayrı eksen kullanılır: ön beyin için **Forel ekseni**, beyin sapı için **Meynert ekseni** (Rusche ve ark., 2021; Shi ve ark., 2024). Forel ekseni iki komissürü birleştiren çizgiyle (interkomissural eksen) ilişkilendirilir (Grinberg ve ark., 2011).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Stereotaksi: beyne koordinatla ulaşmak',
      md: `Stereotaksik cerrahi, üç boyutlu bir koordinat sistemi kullanarak beynin derinindeki bir noktaya iğne ya da elektrot ulaştırır. Horsley–Clarke aygıtının kafatasına tutunma noktaları bu üç boyutlu Kartezyen koordinat sisteminin başlangıç çizgilerini oluşturdu; Spiegel ve Wycis aygıtı insan cerrahisine uyguladı (Conti ve ark., 2023).

- **AC–PC çizgisi:** Ön komissür (AC) ile arka komissürü (PC) birleştiren çizgi. 1962’ye gelindiğinde Jean Talairach’ın çalışmalarıyla standart stereotaksik başvuru sistemi bu çizgiye dayanıyordu. Talairach ve Tournoux’nun atlası 1988’de, tek bir beyne dayanarak yayımlandı (Conti ve ark., 2023).
- **Talairach ve MNI uzayı:** Talairach uzayında başlangıç noktası AC’dir; Y ekseni PC’den geçer. MNI uzayında başlangıç noktası, MNI şablon beyninde ön komissürün orta hattı kestiği noktadır (NiBabel, t.y.-a). Nörogörüntüleme analizinin temel araçlarından MNI-ICBM152 şablonu, 152 genç yetişkinin 1,5 tesla MR’larından oluşturuldu (Manera ve ark., 2020). İki uzay birebir aynı değildir: ICBM152’ye yerleştirilen beyinler daha büyük ve burun aşağı dönük çıkar, bazı ön bölgelerde fark 1 cm’yi aşar (Lancaster ve ark., 2007).
- **Derin beyin uyarımı (DBU):** Elektrot hedefleri globus pallidus internus (Parkinson hastalığı ve distoni), subtalamik çekirdek (Parkinson hastalığı ve distoni) ve talamustur (Parkinson hastalığı ve esansiyel tremor). Yöntem ABD’de ilk kez 1997’de onaylandı; son yıllarda epilepsi için de onaylandı (NINDS, 2026b). Esansiyel tremorda talamusun ventral intermediyer çekirdeği (Vim) ve arka subtalamik bölge hedeflenir (Chopra ve ark., 2013).`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'AC, PC ve derin beyin uyarımının hedefleri',
      aciklama:
        'Sağ yarım kaldırıldı; derin yapılar soldan, içeriden görülüyor (ön taraf sağda). Sarı: ön komissür (AC) ve arka komissür (PC); stereotaksinin başlangıç çizgisi ikisini birleştirir. Pembe: talamus (esansiyel tremorda Vim çekirdeği hedeflenir). Turuncu: globus pallidus (iç bölümü Parkinson ve distonide hedeflenir). Subtalamik çekirdek bu modelde ayrı bir parça olarak bulunmaz.',
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
      md: `Radyolojik ve nörolojik gösterim ekrana ait bir kuraldır; görüntü dosyalarının içinde ise koordinatlar bir eksen kuralıyla yazılır. Nörogörüntülemede yaygın kural **RAS+** dır: x ekseni soldan **sağa** (Right), y ekseni arkadan **öne** (Anterior), z ekseni aşağıdan **yukarı** (Superior) doğru artar. DICOM dosyaları ise vokselleri tarayıcının **LPS+** uzayına bağlar: x sola, y arkaya doğru artar (NiBabel, t.y.-a). İki kuralda x ve y eksenlerinin yönü terstir; bu yüzden bir dosyanın hangi kuralı kullandığı bilinmeden yapılan dönüşüm sağı ve solu karıştırabilir.

Karışıklığı artıran bir kullanım daha vardır: bazıları voksel eksenleri RAS’a hizalı dosyaları “nörolojik düzende” diye anar, çünkü böyle bir dosyanın en basit gösterimi nörolojik gösterimi verir (NiBabel, t.y.-b). Yani “radyolojik” ve “nörolojik” sözcükleri hem ekran kuralı hem dosya düzeni için kullanılır; hangisinin kastedildiği her seferinde sorulmalıdır.`,
    },
  ],
};
