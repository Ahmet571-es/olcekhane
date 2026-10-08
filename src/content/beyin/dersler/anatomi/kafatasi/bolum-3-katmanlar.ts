import type { DersBolumu } from '../../../types';

/** 3. bölüm: kafa derisinin beş katmanı, kemiğin sandviç yapısı, kalınlık ve kafatası iliği. */
export const katmanlar: DersBolumu = {
  id: 'kafa-derisi-ve-kemik-katmanlari',
  baslik: 'Saçtan beyne: kafa derisi ve kemiğin katmanları',
  bloklar: [
    {
      tur: 'metin',
      md: `Bir darbe beyne ulaşmadan önce birçok katmandan geçer. En dışta **kafa derisi** vardır: ensedeki kas çizgilerinden alındaki supraorbital deliğe kadar uzanan beş katlı bir örtü (Tajran ve Gosman, 2023). Katmanların İngilizce adlarının baş harfleri yan yana gelince SCALP (kafa derisi) sözcüğü çıkar; bu yüzden ezberlemesi kolaydır (Petrocelli ve ark., 2023):

1. **S – Deri.**
2. **C – Sıkı bağ dokusu:** 4–7 mm kalınlığında, yağ ve lifli doku içeren katman (Kemp ve ark., 2011). Ense bölgesinde oksipital atardamar, toplardamar ve sinirler bu katmanda seyreder (Germann ve Kashyap, 2023).
3. **A – Aponevroz** (*galea aponeurotica*): alın kası ile ense kası arasında gerilmiş, sağlam ve sıkı bir lifli tabaka.
4. **L – Gevşek bağ dokusu:** ameliyatlarda kafa derisinin kaldırıldığı, kazalarda da koptuğu düzlem.
5. **P – Perikranyum:** kafatası kemiğinin kemik zarı (Kemp ve ark., 2011).

Kafa derisinin altında **kafatası kemiği** durur. Kafatasının yassı kemikleri bir sandviç gibidir: iki sert (kompakt) kemik tablası arasında süngerimsi bir katman, **diploe** bulunur. Dış tabla kırılsa bile sağlam kalan iç tabla beyni korumayı sürdürür (OpenStax 6.3). Diploenin içinde zengin bir toplardamar ağı vardır ve bu ağ doğrudan beynin büyük toplardamar sinüslerine bağlanır (Alarfaj ve ark., 2021). Kemiğin hemen altında, beyni saran üç zarın en dıştakisi, **sert zar** (*dura mater*) yer alır.`,
    },
    {
      tur: 'animasyon',
      ad: 'kafa-derisi-katmanlari',
      baslik: 'Saçtan beyne katman katman',
      aciklama:
        'Kafa derisinin beş katmanı, kemiğin iki tablası ve diploe, sert zar ve bir toplardamar sinüsü. Seçeneklerle tehlikeli katmanı, kemiğin sandviç yapısını ve kafa derisinin ayrıldığı düzlemi görebilirsin.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**SCALP:** Deri, sıkı bağ dokusu, aponevroz, gevşek bağ dokusu (tehlikeli katman), perikranyum.\n\n**Kemik bir sandviçtir:** dış tabla, diploe (süngerimsi kemik ve toplardamarlar), iç tabla. Altında sert zar vardır.',
    },
    {
      tur: 'sayilar',
      baslik: 'Katmanların ölçüleri',
      ogeler: [
        { deger: '5', birim: 'katman', aciklama: 'Kafa derisinin katmanları: S-C-A-L-P.' },
        { deger: '4–7', birim: 'mm', aciklama: 'Damarların ve sinirlerin geçtiği sıkı bağ dokusu katmanının kalınlığı.' },
        {
          deger: '≈6,3',
          birim: 'mm',
          aciklama: 'Kuru kafataslarında ortalama kemik kalınlığı; arkaya, yan kafa kemiğinin arka kısmına doğru artar.',
        },
        { deger: '260', birim: 'mL', aciklama: 'Yenidoğanda aponevrozun altındaki boşlukta birikebilecek en fazla kan miktarı.' },
      ],
      not: 'Kaynaklar: Petrocelli ve ark. (2023); Kemp ve ark. (2011); Moreira-Gonzalez ve ark. (2006); Lee ve ark. (2018).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Tehlikeli katman: emisser venler ve subgaleal kanama',
      md: `Kafa derisinin dördüncü katmanı (gevşek bağ dokusu) “tehlikeli alan” sayılır, çünkü içinden **emisser venler** geçer (Murlimanju ve ark., 2015). Emisser venlerin kapakçığı yoktur; kafa derisinin toplardamarlarını kafatası içindeki sert zar sinüslerine ve kemikteki diploik venlere bağlarlar. Bu yüzden kafa derisindeki bir enfeksiyonun kafa içine ilerlemesi için bir yol olabilirler (Klein ve Bordoni, 2023). Bu yoldan kafatası kemiğinin iltihabı (osteomiyelit), menenjit ve beyin apsesi gelişebilir (Murlimanju ve ark., 2015). Emisser venler çocuklukta daha sık ve daha geniş deliklerle bulunur; kafa içi basınç hastalık nedeniyle yükseldiğinde bir tür “emniyet supabı” işlevi görebilirler (Klein ve Bordoni, 2023). Güney Hindistan kafataslarında parietal emisser deliklerin çoğu sagittal dikişten 4–8 mm uzaktaydı (Murlimanju ve ark., 2015).

Aponevrozun altındaki boşluk önde göz çukuru kenarlarına, arkada ense sırtına, yanlarda şakak fasyasına kadar uzanır; yenidoğanda bu boşlukta 260 mL’ye kadar kan birikebilir. **Subgaleal kanama** seyrek ama öldürücü olabilen bir yenidoğan sorunudur: sıklığı vakumsuz ve forsepssiz normal doğumlarda 1000 doğumda yaklaşık 0,4, vakumla yapılan doğumlarda 1000’de 5,9 olarak tahmin edilir. Kore’den 20 yenidoğanlık bir seride bebeklerin %90’ı vakum yardımıyla doğmuştu; %60’ı kan nakli gerektirdi ve 3 bebek (%15) öldü. Kanama hipovolemik şok, ani kansızlık ve pıhtılaşma bozukluğuna yol açabildiği için erken fark edilmesi gerekir (Lee ve ark., 2018).

Saç bir makineye kapıldığında çekme kuvveti aponevrozu kemik zarından ayırır; kemik zarı çoğu zaman yerinde kalır. Kafa derisinin tamamen kopması (avülsiyon) bu düzlemde olur (Petrocelli ve ark., 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Kafatası ne kadar kalın?',
      md: `Kuru kafataslarında yapılan bir ölçümde kafatası kubbesinin ortalama kalınlığı 6,32 mm bulundu; bölgeye göre ortalamalar 5,3 ile 7,5 mm arasında değişiyordu. Kemik bütün alt gruplarda arkaya, yan kafa kemiğinin arka kısmına doğru kalınlaşıyordu ve yaş ortalama kalınlığı anlamlı olarak yordamıyordu (Moreira-Gonzalez ve ark., 2006). Kubbede en ince yerler şakaktadır: Koreli erişkinlerde pterion ortalama 3,19 mm, şakak kemiğinin yassı kısmının orta noktası 1,96 mm ölçüldü (Hwang ve ark., 1999).

Toplam kalınlık yaşla anlamlı değişmese de kemiğin yapısı değişebilir: 20–100 yaş arasındaki kişilerin BT görüntüleriyle yapılan bir çalışmada kadınlarda alın, art kafa ve yan kafa kemiklerinin sert (kortikal) tablaları %36–60 oranında inceliyordu; erkeklerde anlamlı bir değişiklik yoktu (Lillie ve ark., 2016). Çocukta ise kafatası kalınlığı ilk yılda hızla artar, ikinci yılda yavaşlar ve erişkinliğe kadar artmayı sürdürür (Delye ve ark., 2015).

Diploedeki toplardamarların yeri de yaşla değişir: MR çalışmasında çocuklarda diploik venler daha çok yan kafa kemiğinde, erişkinlerde ise art kafa ve alın kemiklerinde yoğundu (Alarfaj ve ark., 2021).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Kemiği BT, iliği MR gösterir',
      md: `Kafatası lezyonlarında uzun yıllar düz grafi kullanıldı; bugün yerini büyük ölçüde BT ve MR almıştır. **BT**, yüksek uzaysal çözünürlüğü sayesinde kemikteki bir lezyonun yerini ve sınırlarını en iyi gösteren yöntemdir. **MR** ise yüksek kontrast çözünürlüğüyle diploenin (kemik iliği aralığının) tutulup tutulmadığını ve lezyonun dokusunu değerlendirmede tercih edilir. Kemik sintigrafisi kemik lezyonlarını yakalamada çok duyarlıdır ama özgül değildir; çoğu zaman ek inceleme gerekir (Özdemir ve Das, 2023).

BT’de dokular **Hounsfield birimiyle** (HU) ölçülür: damıtılmış su 0, hava −1000 HU olarak tanımlanır; kemik yaklaşık 1000 HU’ya, iç kulaktaki koklea gibi çok yoğun kemik 2000 HU’ya, çelik ya da gümüş gibi metaller 3000 HU’nun üstüne çıkar. Birim, BT’nin icadındaki payıyla 1979 Nobel Ödülü’nü alan Godfrey Hounsfield’ın adını taşır (DenOtter ve Schubert, 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kafa derisinin sinirleri ve bloklar',
      md: `Kafa derisini kafa sinirlerinden ve omurilik sinirlerinden gelen dallar duyurur. Alnı, beşinci kafa sinirinin göz dalından (V1) gelen **supratroklear** ve **supraorbital sinirler**; şakağı, üst çene (maksiller) dalından (V2) gelen zigomatikotemporal sinir ile mandibular daldan (V3) gelen **aurikulotemporal sinir**; başın arkasını ise **büyük ve küçük oksipital sinirler** ve üçüncü oksipital sinir duyurur (Kemp ve ark., 2011).

Aynı derlemeye göre supraorbital sinir alından lambdoid dikişe kadar deriyi duyurur; supratroklear sinir orta hattın yaklaşık 16 mm dışından göz çukurundan çıkar. Büyük oksipital sinir başın arka derisinin çoğunu duyurur ve oksipital arterle birlikte seyreder; bloğu inionun 2–5 cm dışında, 2–3 cm altında ya da üstünde yapılabilir. Aurikulotemporal sinirin bloğu kulak sarmalının (heliks) üst başlangıcı düzeyinde, 10–15 mm önde yapılabilir (Kemp ve ark., 2011).

**Neden önemli?** Kraniotomide başı sabitleyen kafa tutucusunun çivileri kemik zarına kadar ilerler ve kan basıncını, kalp hızını yükseltebilir. Bupivakainle yapılan kafa derisi bloğunda bu yükselmenin görülmediği bildirilmiştir. Uyanık kraniotomide hastanın ağrısız ama beyin haritalamasında iş birliği yapabilecek kadar uyanık olması gerekir; bunun için supratroklear, supraorbital, aurikulotemporal, büyük ve küçük oksipital ve büyük aurikular sinirlere blok yapılabilir. Ameliyatta bu sinirlerin kesilmesi, gerilmesi ya da yara dokusuyla sıkışması kraniotomi sonrası inatçı baş ağrısına yol açabilir (Kemp ve ark., 2011).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kafatası iliği: beyne açılan kapılar',
      md: `Son yıllarda kafatası yalnızca bir kalkan olarak görülmüyor. Farelerde inme ve aseptik menenjit modellerinde kafatası iliğinden gelen nötrofillerin komşu beyne, kaval kemiğindekilerden daha çok göç ettiği gösterildi; göç, kafatasının iç tablasını delen mikroskobik damar kanalları üzerinden oluyordu (Herisson ve ark., 2018). Yine farede beyin zarlarındaki monosit ve nötrofillerin kandan değil komşu kafatası ve omur iliğinden geldiği (Cugurra ve ark., 2021), zar B hücrelerinin de kafatası kubbesindeki bir kan yapım nişinden kaynaklandığı bildirildi (Brioschi ve ark., 2021).

Trafik iki yönlüdür: farede beyin-omurilik sıvısına verilen izleyiciler sert zardaki damarların çevresinden ilerleyip yüzlerce milimetre altı kafatası kanalıyla kubbe iliğine ulaştı; menenjitte bakteriler bu yolu kullanarak kafatasındaki kan yapımını kaval kemiğinden önce başlattı. Erişkin bir farenin kafatası kubbesinde 1000’den fazla böyle kanal olduğu tahmin ediliyor (Pulous ve ark., 2022).

İnsanda kafatası iliği, proteinleri açısından öteki kemik iliklerinden en farklı olanıdır. Kafatası ile zarlar arasındaki 500’den fazla bağlantı kanalı ölçüldü; çoğu 40–90 µm genişliğindeydi, çoğunlukla sert zarı geçip araknoid granülasyonların altındaki boşluğa açılıyordu ve farenin tersine yağla dolu olabiliyordu. TSPO-PET ile kafatası iliğinin çeşitli nörolojik hastalıklarda beyindeki iltihabı hastalığa özgü bir dağılımla yansıttığı görüldü (Kolabas ve ark., 2023). Beyin-omurilik sıvısı bozukluğundan şüphelenilen 53 hastaya omurilik kanalından MR izleyicisi verildi; hastalık tanısı konanlarda izleyici, orta hattın iki yanındaki (parasagital) sert zarın yakınında ve ondan uzak yerlerde diploe iliğinde birikti; bu, kafatası iliğinin insanda da beynin bağışıklık gözetimine katılabileceğini düşündürüyor (Ringstad ve Eide, 2022).

Bu kanallar artık nöroimmün etkileşimin yeni bir katmanı olarak görülüyor (Mazzitelli ve ark., 2023). Diploik venöz aralık ise hidrosefalide beyin-omurilik sıvısını boşaltmak için olası bir yol olarak araştırılıyor (Alarfaj ve ark., 2021).`,
    },
  ],
};
