import type { DersBolumu } from '../../../types';

/** 5. bölüm: yön terimleri, eksenler, çaprazlaşmalar, stereotaksi. */
export const yonTerimleri: DersBolumu = {
  id: 'yon-terimleri',
  baslik: 'Yön terimleri: beyinde “nerede”?',
  bloklar: [
    {
      tur: 'metin',
      md: `Anatomide yönler hep aynı başlangıç duruşuna göre söylenir: **anatomik duruş**. Kişi dik durur; ayakları omuz genişliğinde ve paralel, ayak parmakları öne dönüktür; kolları iki yanındadır ve avuç içleri öne bakar (OpenStax 1.6). Bu duruşa göre:

- **Üst (superior)** başa, **alt (inferior)** ayaklara doğrudur.
- **Ön (anterior)** yüze, **arka (posterior)** sırta doğrudur.
- **İç (medial)** orta hatta, **dış (lateral)** yana doğrudur.
- **Yüzeysel** yüzeye yakın, **derin** yüzeyden uzak demektir.

Sinirbilimde dört terim daha sık geçer: **rostral** (burna doğru), **kaudal** (kuyruğa doğru), **dorsal** (sırta doğru) ve **ventral** (karına doğru). Püf noktası şudur: Dik durduğumuz için sinir sisteminin ekseni orta beyin hizasında yaklaşık 90 derece bükülür. Bu yüzden aynı terim beyinde ve omurilikte farklı yönleri gösterir.`,
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
      md: 'Beyinde **dorsal = üst**, omurilikte **dorsal = arka**.\n\nBeyinde **rostral = ön**, omurilikte **rostral = üst**.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Her yarımküre ağırlıklı olarak vücudun **karşı** yarısını yönetir: sağ yarımküredeki hareket kabuğu sol kolu ve bacağı, soldaki sağ yanı yönetir. Aynı tarafa **ipsilateral**, karşı tarafa **kontralateral** denir. Bu çaprazlaşma kesin bir kural değildir: bazı yollar aynı tarafta kalır.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Neler çaprazlaşır, nerede?',
      md: `Çaprazlaşmanın (dekusasyon) yerini bilmek, bir hasarın belirtilerin hangi yanında görüleceğini kestirmenin anahtarıdır:

- **Hareket yolu (kortikospinal yol):** Liflerin yaklaşık %90’ı omurilik soğanının alt ucundaki **piramidal çaprazlaşmada** karşıya geçer ve yan kortikospinal yolu oluşturur; kalan %10 ön kortikospinal yolda iner (Knierim, UTHealth). Piramidal çaprazlaşma omurilik soğanı ile omuriliğin sınırını belirler (OpenStax 14.3).
- **İnce dokunma, titreşim ve konum duyusu (arka kordon – medial lemniskus yolu):** Aynı yanda yukarı çıkar; omurilik soğanında iç kavisli lifler (internal arkuat lifler) olarak karşıya geçer ve medial lemniskusu oluşturur (Neuroanatomy Online, UTHealth; OpenStax 16.4).
- **Ağrı ve ısı (spinotalamik yol):** Lifler omuriliğe girdikleri hizada, ön beyaz komissürde hemen karşıya geçer (Dafny, UTHealth; OpenStax 14.2).
- **Görme:** Her gözün retinasının burun tarafındaki yarısından gelen lifler optik kiazmada çaprazlaşır (Dragoi, UTHealth).
- **Beyincik:** Bedenin aynı yanını denetler; beyincik hasarı aynı yanda belirti verir (Knierim, UTHealth).
- **Yüz:** Yüzün alt yarısındaki kasları yöneten nöronlar ağırlıklı olarak karşı yarımküreden, üst yarısındakiler iki yarımküreden birden komut alır (Neuroanatomy Online, UTHealth). Bu yüzden kabuktan inen bu liflerin hasarında karşı yanda yüzün yalnızca alt yarısı etkilenir; yüzün tamamı etkilenmez.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 3: Sırtından bıçaklanan genç',
      oyku: `24 yaşında bir erkek, sırtının sağ yanından, göğüs ortası hizasından bıçaklanmış. Sağ bacağını kıpırdatamıyor. Gözleri kapalıyken sağ ayak başparmağının yukarı mı aşağı mı oynatıldığını söyleyemiyor; diyapazonun titreşimini sağ bacağında hissetmiyor. Sol bacağında ise iğne batmasını ve sıcak-soğuğu ayırt edemiyor, ama gücü tam.`,
      soru: 'Omurilikte hasar nerede ve neden belirtiler iki bacağa böyle bölünmüş?',
      cozum: `Omuriliğin **sağ yarısı**, göğüs bölümlerinde kesilmiştir (yarı kesi, hemiseksiyon): **Brown-Séquard sendromu**. Hasarın altında aynı yanda felç ile ince dokunma, titreşim ve konum duyusu kaybı; karşı yanda ağrı ve ısı duyusu kaybı görülür (Salazar Noguera ve ark., 2015; NINDS, 2026).

Nedeni çaprazlaşmaların yeridir:

- Hareket lifleri omurilik soğanında çaprazlaştığı için omurilikte **aynı yanda** iner: sağ yarı kesilince sağ bacak felç olur.
- İnce dokunma, titreşim ve konum duyusunu taşıyan arka kordon da omurilikte **aynı yanda** yükselir; omurilik soğanında çaprazlaşır: sağda kaybolur (OpenStax 16.4).
- Ağrı ve ısı lifleri omuriliğe girdikleri hizada hemen **karşıya** geçip öteki yarıda yükselir: sağ yarıdaki kesi, sol bacaktan gelen ağrı ve ısı liflerini keser.

Hareket hasarı bu hastada üst motor nöron türündedir: zamanla sağ bacakta refleksler artar ve Babinski belirtisi ortaya çıkar.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'İki eksen: Forel ve Meynert',
      md: `İnsanda dik duruş, sinir ekseninde orta beyin hizasında yaklaşık 90 derecelik bir bükülme yaratır. Bu yüzden "dorsal" beyinde kafatasının tepesini, omurilikte sırtı gösterir; "rostral" beyinde önü, omurilikte başı gösterir (Henley, 2021). Gelişimde bu bükülme, beyin sapı ile ön beyin arasındaki **sefalik büküm** olarak başlar (OpenStax 13.1).

Bu yüzden iki ayrı eksen kullanılır: ön beyin için **Forel ekseni**, beyin sapı için **Meynert ekseni** (Rusche ve ark., 2021; Shi ve ark., 2024). Forel ekseni iki komissürü birleştiren çizgiyle (interkomissural eksen) ilişkilendirilir (Grinberg ve ark., 2011). Stereotaksik işlemler için yapılan eski bir çalışma, ön beyin ve arka beyin için eksen sistemlerinin ayrı ayrı kullanılması gerektiğini vurgular (Gerdes ve ark., 1975).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Stereotaksi: beyne koordinatla ulaşmak',
      md: `Stereotaksik cerrahi, üç boyutlu bir koordinat sistemi kullanarak beynin derinindeki bir noktaya iğne ya da elektrot ulaştırır. Horsley–Clarke aygıtının kafatasına tutunma noktaları bu üç boyutlu Kartezyen koordinat sisteminin başlangıç çizgilerini oluşturdu; Spiegel ve Wycis aygıtı insan cerrahisine uyguladı (Conti ve ark., 2023).

- **AC–PC çizgisi:** Ön komissür (AC) ile arka komissürü (PC) birleştiren çizgi. 1962’ye gelindiğinde Jean Talairach’ın çalışmalarıyla standart stereotaksik başvuru sistemi bu çizgiye dayanıyordu. Talairach ve Tournoux’nun atlası 1988’de, tek bir beyne dayanarak yayımlandı (Conti ve ark., 2023).
- **Talairach ve MNI uzayı:** Talairach uzayında başlangıç noktası AC’dir; Y ekseni PC’den geçer. MNI uzayında başlangıç noktası, MNI şablon beyninde ön komissürün orta hattı kestiği noktadır (NiBabel). En sık kullanılan şablon ICBM152, 152 genç yetişkinin 1,5 tesla MR’larından oluşturuldu (Manera ve ark., 2020). İki uzay birebir aynı değildir: ICBM152’ye yerleştirilen beyinler daha büyük ve burun aşağı dönük çıkar, bazı ön bölgelerde fark 1 cm’yi aşar (Lancaster ve ark., 2007).
- **Derin beyin uyarımı (DBU):** Elektrot hedefleri globus pallidus internus (Parkinson hastalığı ve distoni), subtalamik çekirdek (Parkinson hastalığı ve distoni) ve talamustur (Parkinson hastalığı ve esansiyel tremor). Yöntem ABD’de ilk kez 1997’de onaylandı; son yıllarda epilepsi için de onaylandı (NINDS, 2026). Esansiyel tremorda talamusun ventral intermediyer çekirdeği (Vim) ve arka subtalamik bölge hedeflenir (Chopra ve ark., 2013).`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'AC, PC ve derin beyin uyarımının hedefleri',
      aciklama:
        'Sağ yarım kaldırıldı; derin yapılar soldan, içeriden görülüyor. Sarı: ön komissür (AC) ve arka komissür (PC); stereotaksinin başlangıç çizgisi ikisini birleştirir. Pembe: talamus (esansiyel tremorda Vim çekirdeği hedeflenir). Turuncu: globus pallidus (iç bölümü Parkinson ve distonide hedeflenir). Subtalamik çekirdek bu modelde ayrı bir parça olarak bulunmaz.',
      sahne: {
        katmanlar: ['derin', 'sap'],
        renk: 'yapi',
        goster: ['on-komissur', 'arka-komissur', 'talamus', 'globus-pallidus', 'putamen', 'kaudat-cekirdek', 'korpus-kallozum', 'bolge:beyin-sapi', 'hipotalamus', 'mamiller-cisimler'],
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
  ],
};
