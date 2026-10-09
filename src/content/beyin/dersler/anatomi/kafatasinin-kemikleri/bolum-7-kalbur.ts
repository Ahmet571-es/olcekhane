import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/**
 * 7. bölüm: kalbur kemiği (etmoid): kribriform levha ve horoz ibiği, koku çukuru ve etmoid tavanı (Keros, Gera,
 * asimetri), dik levha, labirent ve etmoid hücreleri, lamina papyracea, kavkalar ve orta burun yolu, Onodi hücresi,
 * etmoidal delikler ve arterler, eklemler ve kemikleşme.
 */
export const kalburKemigi: DersBolumu = {
  id: 'kalbur-kemigi',
  baslik: 'Kalbur kemiği (etmoid)',
  bloklar: [
    // ——— Kalbur kemiği: temel ———
    {
      tur: 'metin',
      md: `**Kalbur kemiği** (*os ethmoidale*), son derece hafif ve süngerimsi, kabaca küp biçimli bir kemiktir. Kafa tabanının ön kısmında, iki göz çukurunun arasında ve burnun tavanında oturur (Gray, 1918; FCAT, 1998). Orta hatta tektir ve alın kemiğinin ortasındaki dörtgen boşluğa, **etmoidal çentiğe** yerleşir (Plou ve ark., 2023). Beyin kutusu kemikleri arasında sayılsa da yüzün yapımına da katılır: üst burun boşluğunun tavanını ve yan duvarlarını, burun bölmesinin üst kısmını yapar ve göz çukurunun iç duvarına katılır (OpenStax 7.2; Yu ve Wang, 2023a).

Türkçe adı kemiğin üst levhasından gelir: kalbur, elek demektir ve bu levha elek gibi deliklidir. Deliklerden burnun tavanındaki koku hücrelerinin lifleri geçer; yani koku duyusu beyne bu kemiğin içinden ulaşır (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `Gray kalbur kemiğini dört kısma ayırır (Gray, 1918):

- **Kribriform (kalbur) levha** (*lamina cribrosa*): yatay duran, kafa tabanına katılan delikli levha. Burun boşluklarının tavanıdır; üzerinde koku soğancığı durur ve deliklerinden koku sinirinin lifleri geçer. Ortasından yükselen kalın, düzgün, üçgen çıkıntı horoz ibiğine benzediği için **horoz ibiği** (*crista galli*) adını alır; uzun ince arka kenarına beynin iki yarısını ayıran zar perdesi, **falx cerebri** tutunur.
- **Dik levha** (*lamina perpendicularis*): kribriform levhanın altından inen ince, yassı, çokgen levha; burun bölmesinin üst kısmını yapar ve genellikle bir yana hafifçe eğiktir. Bölmenin alt ve arka kısmını sapan kemiği yapar (OpenStax 7.2).
- **İki labirent** (*labyrinthus ethmoidalis*): iki yandaki hafif kitleler. İçleri ince duvarlı hava boşluklarıyla, **etmoid hücreleriyle** doludur. Göz çukuruna bakan dış yüzleri çok ince bir levhadır (**lamina papyracea**) ve göz çukurunun iç duvarının en büyük kısmını yapar (Gray, 1918; Shumway ve ark., 2023).

Kavkalar ayrı bir kısım değil, labirentin parçasıdır: labirentin burna bakan iç yüzünden **üst** ve **orta burun kavkaları** sarkar. Alt kavka ise kalbur kemiğine ait değildir, ayrı bir kemiktir. Kavkalar içeri giren havayı döndürerek ısıtır ve nemlendirir; üst kavka küçüktür ve orta kavkanın üst-arkasında gizlidir (OpenStax 7.2).`,
    },
    {
      tur: 'sahne',
      baslik: 'Kalbur kemiği önden',
      aciklama:
        'Kalbur kemiği tek başına, kendi renginde. Ona önden bakıyoruz; işaretler kemiğin sol yarısında, görüntünün sağındadır. Tepede horoz ibiği yükselir; ortadan aşağı inen ince levha dik levhadır ve burun bölmesinin üst kısmını yapar. İki yanda hava hücreleriyle dolu labirentler, labirentin dış yüzünde göz çukuruna bakan ince göz çukuru levhası (lamina papyracea) görülür; orta burun kavkası bu bakışta labirentin arkasında kalır, bir sonraki sahnede soldan görünür. Model sadeleştirildiği için kribriform levhanın küçük delikleri ve hücrelerin ince bölmeleri tek tek görünmez.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['kalbur-kemigi'],
        vurgula: ['kalbur-kemigi'],
        boya: [{ secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur }],
        noktalar: [
          { nokta: 'horoz-ibigi' },
          { nokta: 'dik-levha' },
          { nokta: 'kalbur-labirenti-sol' },
          { nokta: 'goz-cukuru-levhasi-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Dört kısım:** kribriform levha (koku lifleri; ortasında horoz ibiği), dik levha (burun bölmesinin üst kısmı), iki labirent (etmoid hücreleri).\n\n**Labirentin iki yüzü:** dışta göz çukuruna bakan ince **lamina papyracea**, içte **üst ve orta burun kavkaları**.\n\n**Alt kavka** kalbur kemiğine ait değildir; ayrı bir kemiktir. **Falx cerebri** horoz ibiğine tutunur.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Kribriform levha yalnızca koku liflerinin geçtiği bir kapı olmayabilir. Birçok hayvan türünde yapılan deneyler, beyin-omurilik sıvısının (BOS) bir kısmının bu levhadan geçip burun mukozasının lenf damarlarına aktığını göstermiştir. İnsanda bu yolun BOS akışındaki payı ise henüz bilinmiyor (Mehta ve ark., 2021).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'İnce duvarlar, yakın komşular',
      md: 'Lamina papyracea çok incedir: tipik kalınlığı 0,2–0,4 mm’dir ve göz çukurunun iç duvarının en ince, en kırılgan kısmıdır (Tuysuz ve ark., 2026). Üzerinde doğal açıklıklar ve onu delip geçen damar ve sinirler vardır; bu yüzden etmoid sinüsündeki bir iltihap göz çukuruna yayılabilir (Dankbaar ve ark., 2015). Kafa tabanında da koku soğancığının oturduğu koku çukurunun yan duvarı, ön kafa tabanının en ince kemiğidir (Babu ve ark., 2018). Sinüs ameliyatlarından önce bu ince yerler BT’de tek tek gözden geçirilir (Tuysuz ve ark., 2026).',
    },

    // ——— Kribriform levha ve koku çukuru: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kribriform levha ve horoz ibiği.** Kribriform levha alın kemiğinin etmoidal çentiğine oturur ve burun boşluklarının tavanını yapar (Gray, 1918). Horoz ibiğinin kısa, kalın ön kenarı alın kemiğiyle eklem yapar; buradaki iki küçük kanatçık (*ala cristae galli*) alın kemiğindeki çukurlara sıkıca oturur ve **kör deliği** (*foramen caecum*) tamamlar (Gray, 1918; Klempka ve ark., 2024). Gray’e göre bu delik genellikle burun boşluğundan üst sagital sinüse küçük bir ven geçirir. Horoz ibiğinin yan yüzleri düzgündür; içinde küçük bir hava boşluğu varsa bazen kabarıktır (Gray, 1918).

Horoz ibiğinin iki yanında levha dar ve derin oluklu; koku soğancığını taşır. Oluğun ortasındaki küçük delikler burun tavanına giden sinirleri geçirir; oluğun iç ve dış kenarlarındaki daha büyük delikler ise sırasıyla bölmenin üst kısmına ve üst kavkaya giden sinirleri taşır (Gray, 1918). Horoz ibiğinin iki yanında sert zarın bir uzantısının girdiği küçük bir yarık, bu yarığın dışında da **nazosiliyer sinirin** geçtiği bir çentik ya da delik vardır; bu çentikten ön etmoidal deliğe doğru bir oluk uzanır (Gray, 1918). Ön etmoidal deliğin kafa içi ağzı olfaktor oluğun dış kenarının ortasına yakındır; arka etmoidal delik bu kenarın arka ucunda, kama kemiğinin öne uzanan lamelinin altında açılır (Gray, 1918). Kribriform levha hava ile kemiğin iç içe geçtiği gözenekli, düşük yoğunluklu bir yapıdır; bu yüzden görüntülemede seçilmesi zordur (Klempka ve ark., 2024).

**Koku çukuru ve etmoid tavanı.** Ön kafa boşluğunda tabanını kribriform levhanın yaptığı çukura **koku (olfaktor) çukuru** denir; içte horoz ibiği, dışta kribriform levhanın **lateral lameli** sınırlar (Babu ve ark., 2018). Etmoid hücrelerini ön kafa çukurundan ayıran tavan **fovea ethmoidalis**’tir (etmoid tavanı): en alçak noktası kribriform levhayla birleştiği iç kenarıdır ve dışa doğru giderek yükselir (Abdullah ve ark., 2020). Koku çukurunun derinliği, yani lateral lamelin dikey yüksekliği, Keros sınıflamasının ölçütüdür (Babu ve ark., 2018); sınıflama uzman düzeyinde sayılarla anlatılır.`,
    },
    // ——— Kribriform levha ve koku çukuru: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Keros sınıflaması: eşikler bile farklı.** Keros koku çukurunu derinliğine göre üç tipe ayırır; ama sınır değerler çalışmalara göre değişir: Babu ve arkadaşları 1–3,9 / 4–7,9 / ≥8 mm (Babu ve ark., 2018), Costa ve arkadaşları tip I için <3,0 mm, tip II için 4,0–7,0 mm, tip III için 8,0–16,0 mm eşiklerini kullanır (Costa ve ark., 2019). Bu boşluklar seriler arasında karşılaştırmayı zorlaştırır (tablo).

Kerala’daki 1200 kişilik BT çalışmasında koku çukuru derinliği ortalama 5,26 mm’ydi. Tip III sağda (%9) soldan (%6,8), erkeklerde (%9,5) kadınlardan (%5,9) sıktı. İki taraf arasında ≥0,1 mm’lik derinlik farkı olarak tanımlanan asimetri kişilerin %75’inde vardı; asimetrisi olanların %10,1’inde fark 2 mm’yi aşıyordu ve bütün kişilerin %21,7’sinde iki tarafın Keros tipi farklıydı (Babu ve ark., 2018). Bir derlemeye göre Keros tipi öteki kafa tabanı ölçüleriyle neredeyse ilişkisizdir (korelasyon katsayıları <0,12): her ölçü ayrı bilgi verir ve Keros tek başına bir risk göstergesi değildir (Gupta ve ark., 2026).

**Gera sınıflaması** lateral lamel ile kribriform levhadan geçen yatay düzlemin uzantısı arasındaki açıyı ölçer: sınıf I >80° (düşük risk), sınıf II 45–80° (orta risk), sınıf III <45° (yüksek risk). Malezya’da Universiti Sains Malaysia’da incelenen 150 BT’de (300 taraf) açı ortalama 70,1° (28–88°) idi; tarafların %72,3’ü sınıf II, %23,7’si sınıf I, %4,0’ü sınıf III’tü. Aynı seride kribriform derinliği (lateral lamel yüksekliği) ortalama 3,4 mm (1,0–6,9 mm) idi (Abdullah ve ark., 2020).

**Asimetri.** Kafa tabanında olguların %50’sinde bir yana yassılaşma ya da eğim biçiminde taraf farkı vardır; etmoid tavanının yüksekliğinde asimetri olduğunda olguların üçte ikisinde sağ taraf soldan alçaktır (Hosemann ve Draf, 2013). Bir İran çalışmasında asimetri kişilerin yaklaşık %18–20’sinde bulunmuştur; asimetrik tavanda alçak taraftaki diseksiyon, özellikle o tarafın yüksekliği 1–2 mm’ye yaklaştığında kafa tabanını delme açısından daha risklidir (Gupta ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Keros tipleri: seriler',
      sutunlar: ['Seri (örnek)', 'Tip I', 'Tip II', 'Tip III', 'Not'],
      satirlar: [
        [
          'Babu ve ark., 2018: Kerala, Hindistan (1200 BT, 2400 taraf)',
          '%17,5',
          '%74,6',
          '%7,9',
          'Ortalama derinlik 5,26 mm; asimetri %75',
        ],
        ['Costa ve ark., 2019: Brezilya (174 sağlıklı kişi, konik ışınlı BT)', '%13,79', '%65,52', '%20,69', 'Tip I eşiği <3,0 mm'],
        ['Abdullah ve ark., 2020: Malezya (150 BT, 300 taraf)', '%24,3', '%75,7', '%0', 'Kribriform derinliği ort. 3,4 mm'],
        ['Belada ve ark., 2025: Düzce Üniversitesi (175 BT, 350 taraf)', '%24,6', '%58,0', '%17,4', '—'],
        ['Dahal ve ark., 2025: Nepal (360 BT; sağ taraf)', '%24,4', '%66,9', '%8,6', 'Derinlik sağda 4,9, solda 5,2 mm'],
      ],
      not: 'Tip III sıklığı topluma göre %0 (Malezya; Abdullah ve ark., 2020) ile bir Umman serisinde %36 (Papadopoulou ve ark., 2021) arasında bildirilmiştir. Eşik değerler farklı olduğu için oranlar doğrudan karşılaştırılmamalıdır.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Ön kafa tabanında güvenli çalışma',
      md: `- **En ince yer:** Lateral lamel ön kafa tabanının en ince kemiğidir ve hastaların %14’üne kadarında dehisenttir (Babu ve ark., 2018); kemik burada çoğu kez yalnızca 0,05 mm’dir. Etmoid tavanında kemik yoğunluğu önden arkaya doğru artar (Hosemann ve Draf, 2013).
- **Kaçak nerede olur?** Endoskopik sinüs cerrahisinde iyatrojenik BOS kaçağı işlemlerin %0,5–3’ünde görülür. Fransa’dan 37 iyatrojenik kaçakta defekt en sık kribriform levhada (%45,9) ve etmoid tavanında (%37,8), yalnızca %8,1’inde lateral lamelde idi; kafa tabanı asimetrisi kaçak olanlarda kontrol grubuna göre belirgin biçimde sıktı (%43,3’e karşı %16,2) ve asimetri hesaba katılınca riski en iyi Gera sınıflaması öngördü (eğri altı alan 0,719) (Vinciguerra ve ark., 2024). Klasik anlatımda en sık aşınma yeri orta kavkanın kafa tabanına girdiği, ön etmoidal artere yakın noktadır (Hosemann ve Draf, 2013); iyatrojenik kafa tabanı lezyonları çoğunlukla kribriform levhanın dış kısmında olur (Costa ve ark., 2019).
- **Yön bulma:** Malezya serisinde göz çukurunun tabanı her tarafta kribriform levhanın, etmoid tavanının ve sfenoid tavanının altındaydı; ortalama uzaklıklar sırasıyla 10,7, 14,1 ve 10,5 mm idi (Abdullah ve ark., 2020).
- **Ön etmoidal arter** fovea ethmoidalis için bir yer imidir ve nazofrontal girintinin hemen arkasındadır; **arka etmoidal arter** daha incedir ve planum sphenoidale’nin hemen önünde seyreder (Plou ve ark., 2023). Ön etmoidal arter yaralanır ve güdüğü göz çukuruna çekilirse, iç duvarın huni biçimli çıkıntısı bölgesinde tehlikeli bir göz çukuru hematomu gelişebilir; bu çıkıntı koronal BT’de olguların yaklaşık %90’ında kolayca görülür (Hosemann ve Draf, 2013).`,
    },

    // ——— Dik levha, labirent ve göz çukuru: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dik levha.** Ön kenarı alın kemiğinin dikeni ve burun kemiklerinin kristasıyla, arka kenarının üst yarısı kama kristasıyla, alt yarısı sapan kemiğiyle eklem yapar; daha kalın olan alt kenarına burun bölmesinin kıkırdağı tutunur (Gray, 1918). Böylece dik levha, sapan kemiği ve dörtgen kıkırdakla birlikte burun bölmesini yapar (Plou ve ark., 2023). Yüzlerinin üst kısmındaki oluk ve kanalcıklar, kribriform levhanın iç deliklerinden gelen koku sinir liflerini taşır (Gray, 1918). Gray burun bölmesinin sıklıkla bir yana, sağdan çok sola eğildiğini yazar (Gray, 1918). Bölmenin arka kısmında sfenoid sinüsten ya da horoz ibiğinden uzanan hava hücreleri bulunabilir; bunlar genellikle önemsizdir (Papadopoulou ve ark., 2021).

**Labirent ve etmoid hücreleri.** Labirent, iki dikey kemik levha arasına yerleşmiş çok sayıda ince duvarlı hava boşluğundan oluşur: dış levha göz çukuruna, iç levha burun boşluğuna katılır (Gray, 1918). Tek başına kemikte bu hücrelerin çoğu açıktır; eklemli kafatasında ise burun boşluğuna açıldıkları yer dışında her yandan kapanır. Hücreleri alın, üst çene, gözyaşı, kama ve damak kemikleri tamamlar; hücreler üst burun boşluğu ile göz çukurları arasındadır ve bunlardan ince kemik lamellerle ayrılır (Gray, 1918). Sınırları dışta lamina papyracea, üstte fovea ethmoidalis, arkada kama gövdesi, önde gözyaşı ve alın kemikleridir (Lee ve ark., 2022). Labirentin üst yüzündeki yarım hücreleri alın kemiğindeki etmoidal çentiğin kenarları tamamlar; bu yüzü kateden iki oluk alın kemiğiyle eklem yapınca **ön ve arka etmoidal kanallara** dönüşür ve göz çukurunun iç duvarına açılır (Gray, 1918).

**Kaç grup?** Gray ve TA98 hücreleri üç gruba ayırır: ön, orta ve arka (*cellulae ethmoidales anteriores, mediae, posteriores*) (Gray, 1918; FCAT, 1998). Güncel cerrahi anatomi ise hücreleri **bazal lamel** ile ön ve arka iki gruba ayırır; bu şemada ayrı bir orta grup yoktur (Lee ve ark., 2022). Gray’e göre ön ve orta gruplar orta burun yoluna açılır: ön grup infundibulum yoluyla, orta grup etmoid kabarcığının üstüne ya da hemen üstüne. Arka hücreler üst kavkanın altında üst burun yoluna açılır; bazen biri ya da birkaçı sfenoid sinüse açılır (Gray, 1918). Arka hücreler genellikle daha büyük ve daha az sayıdadır ve üst ya da en üst (supreme) burun yoluna açılır (Lee ve ark., 2022).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kalbur kemiği soldan: göz çukuruna bakan yüz',
      aciklama:
        'Kalbur kemiğine soldan bakıyoruz; yüz tarafı görüntünün solundadır. Labirentin dış yüzünü kaplayan düz, dikdörtgen levha göz çukuru levhasıdır (lamina papyracea): canlıda göz çukurunun iç duvarının büyük kısmını yapar. Üstte horoz ibiğinin ucu, önde labirentin ön kısmı, altta labirentin iç yüzünden sarkan orta burun kavkasının alt kenarı görülür. Tek başına kemikte hücrelerin önü ve arkası açıktır; eklemli kafatasında bunları komşu kemikler kapatır.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['kalbur-kemigi'],
        vurgula: ['kalbur-kemigi'],
        boya: [{ secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur }],
        noktalar: [
          { nokta: 'horoz-ibigi' },
          { nokta: 'kalbur-labirenti-sol' },
          { nokta: 'goz-cukuru-levhasi-sol' },
          { nokta: 'orta-burun-kavkasi-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Göz çukuru levhası (lamina papyracea).** Labirentin dış yüzü ince, düz, dikdörtgen bir levhadır; Gray ona *lamina papyracea* (*os planum*) der, TA98’deki adı *lamina orbitalis*’tir (Gray, 1918; FCAT, 1998). Klinikte eski adı yaygın olarak kullanılır. Levha orta ve arka hücreleri örter; üstte alın kemiğinin göz çukuru levhasıyla, altta üst çene ve damak kemiğinin göz çukuru çıkıntısıyla, önde gözyaşı kemiğiyle, arkada kama kemiğiyle eklem yapar. Önündeki kırık hücreleri gözyaşı kemiği ve üst çenenin alın çıkıntısı tamamlar (Gray, 1918).

Göz çukurunun iç duvarı önden arkaya üst çenenin alın çıkıntısı, gözyaşı kemiği, lamina papyracea ve optik kanalın önündeki küçük bir kama gövdesi parçasıyla yapılır; duvarda üç dikey dikiş vardır: lakrimomaksiller, lakrimoetmoidal ve sfenoetmoidal (Gray, 1918). İç duvarın en büyük kısmı kalbur kemiğindendir (Shumway ve ark., 2023). Alın–kalbur dikişinde **ön ve arka etmoidal delikler** bulunur: öndeki nazosiliyer siniri ve ön etmoidal damarları, arkadaki arka etmoidal sinir ve damarları geçirir (Gray, 1918). Bu delikler kribriform deliklerin dışındadır ve kribriform levhanın ön ve arka sınırlarına karşılık gelir (Cohen ve ark., 2025).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İç yüz: kavkalar ve burun yolları.** Labirentin iç yüzü burun boşluğunun yan duvarının bir parçasıdır: kribriform levhanın altından inen ince bir lameldir ve aşağıda serbest, kıvrık bir kenarla, **orta burun kavkasıyla** (*concha nasalis media*) biter. Orta kavka labirentin iç yüzü boyunca uzanır; serbest alt kenarı kalındır ve içbükey dış yüzü **orta burun yolunu** yapmaya yardım eder. İç yüzün arka kısmındaki dar, eğik yarık **üst burun yoludur**; üstünü ince, kıvrık **üst burun kavkası** (*concha nasalis superior*) sınırlar ve arka hücreler buraya açılır (Gray, 1918). Üst burun yolu, orta kavkanın üst kenarının yaklaşık yarısı boyunca uzanan kısa, eğik bir geçittir. Üst kısımdaki oluklar üst kavkayı örten mukozaya giden koku sinir dallarını taşır; **koku bölgesi** üst kavka ile bölmenin karşısındaki kısmından oluşur (Gray, 1918).

**Orta burun yolunun yapıları.** Labirentin ön kısmından aşağı ve geriye kıvrık, ince bir lamel uzanır: **çengel çıkıntı** (*processus uncinatus*). Maksiller sinüsün iç duvarının küçük bir kısmını yapar ve alt kavkanın etmoidal çıkıntısıyla eklem yapar (Gray, 1918); uzunluğu değişken, mukozayla örtülü, yarım ay biçimli bir kemik çıkıntıdır (Güngör ve ark., 2016). Orta hücrelerin kabarıklığı **etmoid kabarcığıdır** (*bulla ethmoidalis*): boyutu içindeki hücrelerin boyutuna bağlıdır (Gray, 1918) ve ön etmoid kompleksinin en büyük, en az değişken hücresidir (Papadopoulou ve ark., 2021). İkisinin arasındaki yarım ay biçimli açıklık **yarım ay yarığıdır** (*hiatus semilunaris*): alt sınırı çengel çıkıntının keskin, içbükey kenarı, üst sınırı etmoid kabarcığıdır (Gray, 1918; Güngör ve ark., 2016). Yarık, kıvrık bir kanala, **etmoid hunisine** (*infundibulum ethmoidale*) açılır; huninin üstünde kabarcık, altında çengel çıkıntının dış yüzü vardır ve ön hücreler huninin ön kısmına açılır. Kabarcığın altında, çengel çıkıntının alt ucuyla kısmen örtülü olarak maksiller sinüsün ağzı bulunur; koronal kesitte bu ağız sinüsün tavanına yakındır (Gray, 1918).

Frontal, ön etmoid ve maksiller sinüslerin drenajının toplandığı bu bölgeye ön **ostiomeatal ünite** denir; arka etmoid ve sfenoid sinüslerin açıldığı sfenoetmoidal girintiye ise arka ostiomeatal ünite denir (Güngör ve ark., 2016).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kalbur kemiğinin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        [
          'Kribriform (kalbur) levha',
          '*Lamina cribrosa; foramina cribrosa*',
          'Ön kafa çukurunun orta hattı, burun boşluğunun tavanı',
          'Koku sinirinin lifleri; üstünde koku soğancığı',
        ],
        ['Horoz ibiği', '*Crista galli*', 'Kribriform levhanın orta hattı', 'Arka kenarına falx cerebri tutunur'],
        ['İbik kanatçığı', '*Ala cristae galli*', 'Horoz ibiğinin ön kenarı', 'Alın kemiğiyle kör deliği (*foramen caecum*) tamamlar'],
        [
          'Koku çukuru ve lateral lamel',
          'TA98’de ayrı terim yok',
          'Horoz ibiğinin iki yanı',
          'Koku soğancığı; lateral lamel çukurun dış duvarıdır',
        ],
        [
          'Dik levha',
          '*Lamina perpendicularis*',
          'Burun bölmesinin üst kısmı',
          'Altta bölme kıkırdağı; arkada kama kristası ve sapan kemiği',
        ],
        ['Labirent', '*Labyrinthus ethmoidalis*', 'Göz çukuru ile burun boşluğu arası', 'Ön, orta ve arka etmoid hücreleri'],
        [
          'Göz çukuru levhası',
          '*Lamina orbitalis* (Gray: *lamina papyracea*)',
          'Labirentin dış yüzü',
          'Göz çukurunun iç duvarı; tipik kalınlık 0,2–0,4 mm',
        ],
        [
          'Ön ve arka etmoidal kanal',
          'TA98’de kalbur kemiği altında yok',
          'Labirentin üst yüzü; alın–kalbur dikişi',
          'Ön: nazosiliyer sinir ve ön etmoidal damarlar; arka: arka etmoidal sinir ve damarlar',
        ],
        [
          'Üst burun kavkası',
          '*Concha nasalis superior*',
          'İç yüzün arka-üst kısmı',
          'Koku mukozası; altında üst burun yolu (arka hücreler)',
        ],
        ['En üst burun kavkası', '*Concha nasalis suprema*', 'Üst kavkanın üstü; her zaman yok', 'Fazladan bir kavka'],
        ['Orta burun kavkası', '*Concha nasalis media*', 'İç yüzün alt kenarı', 'Dış yüzü orta burun yolunu yapar'],
        [
          'Çengel çıkıntı',
          '*Processus uncinatus*',
          'Labirentin ön kısmı, orta burun yolu',
          'Alt kavkanın etmoidal çıkıntısıyla eklem; yarım ay yarığının alt sınırı',
        ],
        ['Etmoid kabarcığı', '*Bulla ethmoidalis*', 'Orta burun yolunun yan duvarı', 'Orta hücreler üstüne ya da hemen üstüne açılır'],
        [
          'Yarım ay yarığı ve etmoid hunisi',
          '*Hiatus semilunaris; infundibulum ethmoidale*',
          'Kabarcık ile çengel çıkıntı arası',
          'Ön hücreler; Gray’e göre olguların yarısından biraz fazlasında frontonazal kanal',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FCAT (1998); Tuysuz ve ark. (2026). Kribriform delikler, etmoidal kanallar ve hücre bölmeleri sadeleştirilmiş üç boyutlu modelde seçilmez.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Kalbur kemiği 15 kemikle eklem yapar:** 4 kafatası kemiği (alın, kama ve Gray’in ayrı kemik saydığı iki sfenoid kavka) ve 11 yüz kemiği (iki burun, iki üst çene, iki gözyaşı, iki damak, iki alt kavka ve sapan kemiği) (Gray, 1918).
- **Drenaj:** ön ve orta hücreler → orta burun yolu; arka hücreler → üst burun yolu; sfenoid sinüs → sfenoetmoidal girinti (Gray, 1918).
- **Kavkalar:** üst ve orta kavka kalbur kemiğinin parçasıdır; alt kavka ayrı bir kemiktir (OpenStax 7.2).
- **Yarım ay yarığı:** altında çengel çıkıntı, üstünde etmoid kabarcığı (Güngör ve ark., 2016).
- **Kemikleşme:** burun kapsülünün kıkırdağında üç merkez: biri dik levha, birer tane iki labirent için (Gray, 1918).
- **Göz çukurunun iç duvarı:** en büyük kısmı kalbur kemiğidir; ön ve arka etmoidal delikler alın–kalbur dikişindedir (Gray, 1918; Shumway ve ark., 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Ameliyat öncesi BT’de kalbur kemiği',
      md: `- **“CLOSE” kontrol listesi:** kribriform levha (*cribriform plate*), lamina papyracea, Onodi hücresi, sfenoid havalanması (*sphenoid*) ve ön etmoidal arter (*ethmoidal artery*) (Tuysuz ve ark., 2026).
- **Lamina papyracea dehisensleri** radyoloji raporlarında sık sık hiç anılmaz ya da yanlışlıkla iltihap diye yorumlanır (Tuysuz ve ark., 2026).
- **Ön etmoidal arterin yeri:** iç duvarın arterin geçtiği yerde göz çukuruna doğru yaptığı huni biçimli çıkıntı koronal BT’de olguların yaklaşık %90’ında kolayca görülür (Hosemann ve Draf, 2013).
- **Kribriform levha** gözenekli ve düşük yoğunluklu olduğu için görüntülenmesi zordur (Klempka ve ark., 2024).
- **Çocuklarda:** BT’de ön etmoid hücreleri genellikle iyi havalı görünürken arka hücrelerin opak kalması sıktır; bunun nedeni büyük olasılıkla hücrelerin sıvı dolu ya da henüz az gelişmiş olmasıdır (Lee ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kalbur kemiği ve klinik',
      md: `- **Göz çukuru komplikasyonları:** Etmoid sinüsündeki enfeksiyon lamina papyracea yoluyla göz çukuruna yayılabilir. Akut bakteriyel rinosinüzitin göz çukuru ve kafa içi komplikasyonları **Chandler sınıflamasında** beş basamakta toplanır: preseptal selülit, orbital selülit, subperiostal apse, orbital apse ve kavernöz sinüs trombozu (Dankbaar ve ark., 2015).
- **Konka bülloza:** orta kavkanın havalanarak balonlaşmasıdır (Papadopoulou ve ark., 2022). En sık orta kavka havalanır; üst kavka seyrek havalanır (Papadopoulou ve ark., 2021).
- **Havalı horoz ibiği** enfekte olup sinüziti taklit edebilir; ilaç tedavisine yanıt azsa endoskopik cerrahi gerekir (Socher ve ark., 2013).
- **Ameliyat komplikasyonu:** Endonazal sinüs cerrahisinin en sık küçük komplikasyonu lamina papyracea hasarıdır (Hosemann ve Draf, 2013). Kribriform levha kırıklarına bağlı koku kaybı ve BOS sızıntısı ünitenin 6. dersinde işlenir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Burun akıntısından sonra şişen göz kapağı',
      oyku: `8 yaşında bir çocuk, bir haftadır süren burun akıntısı ve ateşten sonra sol göz kapaklarında şişlik ve kızarıklıkla getiriliyor. Son gün sol gözü hafifçe öne fırlamış; gözünü hareket ettirince ağrısı var. Görmesi korunmuş. BT’de sol etmoid hücreleri opak; göz çukurunun iç duvarı boyunca kemik ile göz çukuru zarı (periorbita) arasında sınırlı bir sıvı birikimi görülüyor.`,
      soru: 'Enfeksiyon göz çukuruna hangi yoldan geçmiş olabilir ve bu bulgu Chandler sınıflamasında hangi basamaktadır?',
      cozum: `**Yol:** Etmoid hücrelerini göz çukurundan ayıran duvar, kalbur kemiğinin lamina papyracea’sıdır: tipik kalınlığı 0,2–0,4 mm’dir ve iç duvarın en ince, en kırılgan kısmıdır (Tuysuz ve ark., 2026). Lamina yalnızca ince değildir; doğal açıklıkları ve onu delip geçen damar ve sinirleri de vardır; enfeksiyon etmoid sinüsünden göz çukuruna bu levha yoluyla yayılabilir (Dankbaar ve ark., 2015).

**Basamak:** Chandler sınıflaması komplikasyonları beşe ayırır: preseptal selülit, orbital selülit, subperiostal apse, orbital apse ve kavernöz sinüs trombozu. Kemik ile periorbita arasında, genellikle iç ya da üst duvarda biriken irin **subperiostal apsedir** (Dankbaar ve ark., 2015); bu çocuğun BT bulgusu bu tanıma uyar, yani üçüncü basamaktır.

**Yorumda dikkat:** Çocuklarda BT’de arka etmoid hücrelerinin opak görünmesi sıktır ve büyük olasılıkla hücrelerin sıvı dolu ya da az gelişmiş olmasından kaynaklanır (Lee ve ark., 2022); bu yüzden opaklık tek başına değil, göz çukuru bulgularıyla birlikte değerlendirilir. Etmoid hücreleri doğumda sayıca tamdır ve 0–7 yaş arasında hızla büyür (Lee ve ark., 2022). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Labirent, orta burun yolu ve Onodi hücresi: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Lamina papyracea dehisensi.** İstanbul’daki Başakşehir Çam ve Sakura Şehir Hastanesi’nde 3052 hastanın BT’sinde dehisens %2,3 idi; erkeklerde daha sıktı, %95,7’si tek taraflı ve %75,7’si ön etmoid hücreleri hizasındaydı (Tuysuz ve ark., 2026). Yüksek çözünürlüklü BT çalışmalarında oran %1–3 aralığına daralmıştır (Tuysuz ve ark., 2026); Nepal’de 360 BT’lik bir seride dehisens ya da eski kırık %2,8 bulundu (Dahal ve ark., 2025). Dehisens göz çukuru içeriğinin etmoide sarkmasına yol açabilir (Papadopoulou ve ark., 2021). Medial rektus kasının zarar görmesi sinüs cerrahisinde yaklaşık binde bir sıklıktadır (Hosemann ve Draf, 2013). Subperiostal apse genellikle iç ya da üst duvar ile periorbita arasında oluşur (Dankbaar ve ark., 2015).

**İç duvar topluma göre de değişir.** Singapur’daki Changi General Hospital’ın yüz travması veritabanından dört etnik gruptan (Çinli, Malay, Hintli, beyaz) 20’şer kişide etmoid sinüs uzunluğu ortalama 37,4 mm (27,0–45,8), genişliği 10,9 mm (7,5–16,1), hacmi 3565 mm³ (1892–5818) idi; beyazlarda maksiller sinüsün arka duvarı arka etmoid duvarının önündeydi, öteki üç grupta tersi (Chan ve ark., 2021). Kadavra çalışmalarında bir kişideki etmoid hücre sayısı 3–20, ortalama 9’dur; etmoid alanın dışına taşan hücrelere “ekstramural hücreler” denir (Lee ve ark., 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Etmoidal delikler ve arterler: sayılar',
      sutunlar: ['Konu', 'Bulgu', 'Kaynak'],
      satirlar: [
        [
          'Delik sayısı',
          'Regoli’nin 1730 göz çukurunda %63 iki, %21,39 üç, %15 bir, %0,52 dört delik; bir göz çukurunda hiç yok',
          'Cohen ve ark., 2025',
        ],
        ['Deliğin yeri', '2925 deliğin %61,3’ü dikiş hattında, %38,15’i dikişin üstünde, %0,54’ü altında', 'Cohen ve ark., 2025'],
        [
          '“24-12-6” kuralı',
          'Ön gözyaşı kristası → ön etmoidal delik 24 mm, ön → arka etmoidal delik 12 mm, arka etmoidal delik → optik kanal 6 mm',
          'Cohen ve ark., 2025',
        ],
        [
          'Kuralın sınanması',
          '52 kadavranın 79 göz çukurunda 24,76, 13,89 ve 7,61 mm; kural bu örnekte geçerli değildi. Ön–arka delik uzaklığı arttıkça arka delik–optik kanal uzaklığı kısalıyordu',
          'Hester ve ark., 2021',
        ],
        [
          'BT ölçüleri',
          'Optik delik → ön etmoidal delik 19,7 mm, → arka 6,7 mm; nazion → ön 29,8 mm, → arka 46,3 mm',
          'Cohen ve ark., 2025',
        ],
        [
          'Kanalların seyri',
          'Ön etmoidal kanal %84 bağımsız kanal, %16 etmoid tavanında; arka etmoidal kanal %8 ayrı delik, %92 tavanda',
          'Cohen ve ark., 2025',
        ],
        ['Orta etmoidal arter', 'BT anjiyografide tarafların %26’sında', 'Cohen ve ark., 2025'],
        [
          'Ön etmoidal arter',
          'Çap ~0,8 mm; %85’inde kafa tabanında 2. ve 3. temel lamel arasında, arka-dıştan ön-içe çapraz; ~%40’ında tabanın ortalama 3,5 (1–8) mm altında ayrı kemik kanalda; kemik örtüde dehisens %16–90; %5–10’unda yok',
          'Hosemann ve Draf, 2013',
        ],
        [
          'Arka etmoidal arter',
          'Çap ~0,6 mm; %92’sinde kemik kafa tabanı hizasında; dehisens ~%60; görme sinirine ve sfenoid ön duvarına ~8–9 mm; yokluk %2–34 (başka bir derlemede ~%20)',
          'Hosemann ve Draf, 2013; Cohen ve ark., 2025',
        ],
        [
          'Arterler arası',
          'Ön ile arka etmoidal arter arası ~10–14 mm; olguların %30’una kadar üçüncü bir etmoidal arter',
          'Hosemann ve Draf, 2013',
        ],
        [
          'Supraorbital etmoid hücresi',
          'Hücre yoksa ön etmoidal arter–kafa tabanı uzaklığı ortalama 1,5 mm, varsa 4,86 mm',
          'Gupta ve ark., 2026',
        ],
        [
          'Frontal girinti',
          'Bulla lamelinin üst yapışması ön etmoidal arteri örten bir “başlık” yapar; frontal girinti artere genellikle 2–4 mm uzaklıktadır',
          'Dassi ve ark., 2020',
        ],
      ],
      not: 'Alın–kalbur dikişi zar içi (alın) ve kıkırdak içi (kalbur) kemikleşmeyi birleştiren özel bir dikiştir (Cohen ve ark., 2025). Ön etmoidal arter arka etmoidal arterden daha sabittir (Cohen ve ark., 2025).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Çengel çıkıntının üst yapışması** frontal sinüsün drenaj yolunu belirler. Stammberger üç olası yapışma yeri tanımladı: lamina papyracea, kafa tabanı ve orta kavka; Landsberg ve Friedman altı tip ayırdı (Güngör ve ark., 2016). Çok düzlemli BT, çıkıntının aynı anda birden çok yere yapışabildiğini göstermiştir (Dassi ve ark., 2020). Çengel çıkıntı lamina papyracea’ya yapışırsa etmoid hunisi üstte kör bir kese, **terminal girinti** olarak kapanır (Papadopoulou ve ark., 2021). Gray olguların yarısından biraz fazlasında huninin doğrudan frontonazal kanalla devam ettiğini, çengel çıkıntının ön ucu kabarcığın ön kısmına kaynaşırsa bu devamlılığın kesildiğini ve frontonazal kanalın doğrudan orta burun yolunun ön ucuna açıldığını yazar (Gray, 1918); güncel anlatım ise frontal drenajı çengel çıkıntının (bazen aynı anda birden çok) üst yapışmasına göre tarif eder (Dassi ve ark., 2020). Çıkıntının içe sapması orta burun yolunu, dışa sapması etmoid hunisini tıkayabilir (Papadopoulou ve ark., 2022); havalanması %2–14 sıklıktadır ve agger nasi hücrelerinin çıkıntının ön-üst kısmına büyümesiyle açıklanır (Papadopoulou ve ark., 2021).

**Hücreler.** **Agger nasi** en öndeki etmoid hücresidir, frontal girintinin ön sınırını belirler ve frontal sinüse ulaşmak için yer imi olarak kullanılır; iç duvarının çengel çıkıntıyla birleşmesi “dikey çubuk” denen işareti yapar (Dassi ve ark., 2020). Bildirilen sıklığı %10–98 gibi geniş bir aralıktadır (Papadopoulou ve ark., 2021); Nepal serisinde %82,2 idi (Dahal ve ark., 2025). Göz çukuru tabanına gelişen etmoid hücreleri **Haller (infraorbital) hücreleridir**: ilk kez 1765’te Albert von Haller tanımladı ve sıklıkları %8–57 gibi çok değişken bildirilir. **Supraorbital etmoid hücreleri** erişkinlerin %15’ine kadarında görülür ve endoskopide frontal sinüs ağzıyla kolayca karıştırılabilir (Papadopoulou ve ark., 2021). Etmoid kabarcığı olguların %92’sinde bulla lamelinin havalanmasıyla oluşur, ama her zaman havalı değildir (Güngör ve ark., 2016).

**Kavkalar.** Konka bülloza yedi yaşından sonra belirginleşir ve ergenlikten sonra da gelişmeyi sürdürür; yerine göre lameller, bülböz ve yaygın tiplere ayrılır (Papadopoulou ve ark., 2021). Sıklığı tanıma çok bağlıdır: literatürde %15–80, en yüksek kronik sinüzitlilerde (Papadopoulou ve ark., 2021); herhangi bir kavkada herhangi boyutta havalanma sayıldığında Creighton Üniversitesi’ndeki 883 konik ışınlı BT’de %67,5 (Smith ve ark., 2010); ince kesitli BT’de %22–53 ve çoğu kez karşı tarafa doğru burun bölmesi eğriliğiyle birlikte (van Lindert ve ark., 2010). Düzce’de 175 hastada %33,1, Brezilya’da 297 konik ışınlı BT’de en az bir kavkada %44,4, İtalya’da 200 BT’de %57–64 bulunmuştur (Belada ve ark., 2025; Ruiz ve ark., 2025; Gibelli ve ark., 2021). **Paradoks orta kavkada** dışbükeylik yan duvara doğru, dışa bakar (Papadopoulou ve ark., 2021). 185 endoskopik hipofiz ameliyatının %2,7’sinde konka bülloza yolu kapattı (van Lindert ve ark., 2010). **En üst (supreme) kavka** ve **Zuckerkandl kavkası** kalbur kemiğinin burun boşluğu üst kısmındaki fazladan çıkıntılarıdır: Brezilya’da Rio Grande do Norte Federal Üniversitesi’ndeki 59 kadavra yarım başında supreme kavka %37,3, Zuckerkandl kavkası %1,7 bulundu; literatürde supreme kavka sıklığı %8–77’dir ve ilk kez Santorini 1724’te bildirmiştir (Montello ve ark., 2026).

**Horoz ibiği havalanması** topluma göre %2,8–14,1 sıklıkta bildirilir; havalanmanın etmoid sinüsten mi yoksa frontal sinüsten mi kaynaklandığı konusunda iki görüş vardır (Socher ve ark., 2013). 6224 BT’lik bir seride %9,4, 99 kişilik bir seride %22,2 bulunmuştur (Papadopoulou ve ark., 2021); Nepal serisinde %16,7 idi (Dahal ve ark., 2025).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Onodi (sfenoetmoidal) hücresi.** Ónodi 1903’te, en arka ya da en yandaki etmoid hücresinin sfenoid sinüsün yanına ve/veya üstüne doğru uzandığı durumu *cellula sphenoethmoidalis* olarak tanımladı (Fadda ve ark., 2024); bazı kaynaklar yılı 1904 olarak verir (Cherla ve ark., 2013). Bugünkü tanımıyla Onodi hücresi, sfenoid sinüsün üstünde yer alan ve en az bir görme sinirine ya da iç karotis artere yakın bir arka etmoid hücresidir (Cherla ve ark., 2013); terim TA98’de yer almaz. Bir gelişim görüşüne göre arka-üst etmoid hücreleri kama gövdesinin üst kısmına büyüyerek optik kanalı sarabilir ve Türk eyerine uzanabilir; sfenoid sinüs gövdenin alt kemikleşme merkezinde gelişirken üst merkez kalbur kemiğiyle kaynaşır (Cherla ve ark., 2013).

Sıklık yönteme göre %8–65 arasında değişir ve kadavrada daha yüksektir (Fadda ve ark., 2024). San Luigi Gonzaga Üniversite Hastanesi’nde üç düzlemde incelenen 430 BT’de Onodi hücresi %21,6 bulundu; en sık tip I (sinüsün üstünde ve iç yanında) idi. Olguların %18,3’ünde optik kanal çevresinin yarısından fazlasıyla hücrenin içine kabarıyordu (tip IV); %8,6’sında iç karotis arter hücreye çıkıntı yapıyordu (Fadda ve ark., 2024). Bir sistematik derlemenin toplum tablosunda sıklık Çin serilerinde %11, beyazlarda %25, bir Türk serisinde %10,6’dır (Papadopoulou ve ark., 2021). Nijerya’da %18,4 (literatür %8–33,3) (Famurewa ve ark., 2018), Yunanistan’da 253 BT’de %15 (iki taraflı %4,7) (Papadopoulos-Manolarakis ve ark., 2026), Suudi Arabistan’da %33 bildirilmiştir (Al-Muhanna ve ark., 2026).

**Neden önemli?** Onodi hücresi ile sfenoid sinüs bir duvarı paylaşır: hücrenin arka duvarı sinüsün ön duvarıdır ve hücre sinüs sanılabilir (Famurewa ve ark., 2018). 185 endoskopik transsfenoidal ameliyatlık bir seride, girilen boşluğun sfenoid sinüs sanıldığı büyük bir Onodi hücresi yön kaybına yol açtı; iki olguda (%1) bu yön kaybı ön kafa tabanının istenmeden açılması ve BOS akışıyla sonuçlandı (van Lindert ve ark., 2010). Onodi hücresi sfenoid sinüsün doğal ağzını yukarı iter (Fadda ve ark., 2024). Hücrenin en arka noktası sinüsün ön yüzünün 1,5 cm ötesine uzanabilir; hücre saptanırsa sfenoid sinüse hücrenin alt-iç tabanından girilmesi önerilir (Cherla ve ark., 2013). Hücredeki bir mukosel ya da piyosel görme sinirini sıkıştırarak retrobulber optik nöropatiye yol açabilir. Hücrenin orta hatta, iki sinüsün üstünde ve en az bir optik kabarıklıkla yer aldığı “santral Onodi hücresi” ilk kez tek bir olguyla bildirilmiştir (Cherla ve ark., 2013).`,
    },

    // ——— Eklemler ve kemikleşme: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Eklemler.** Gray kalbur kemiğinin 15 kemikle eklem yaptığını yazar: 4 kafatası kemiği (alın, kama ve iki sfenoid kavka) ve 11 yüz kemiği (iki burun, iki üst çene, iki gözyaşı, iki damak, iki alt kavka ve sapan kemiği). Gray’in sayımında sfenoid kavkalar ayrı kafatası kemikleridir (Gray, 1918). Ön kafa çukurunu frontoetmoidal ve sfenoetmoidal dikişler kateder (Gray, 1918).

**Kemikleşme.** Kalbur kemiği burun kapsülünün kıkırdağında üç merkezden kemikleşir: biri dik levha, birer tane iki labirent için (Gray, 1918); güncel bir derleme de üç merkezi doğrular (Cohen ve ark., 2025). Önce labirentler kemikleşir: fetal 4.–5. aylar arasında lamina papyracea bölgesinde kemik tanecikleri belirir ve kavkalara yayılır. Doğumda kemik yalnızca iki küçük, az gelişmiş labirentten ibarettir. Doğumdan sonraki ilk yılda dik levha ve horoz ibiği tek bir merkezden kemikleşmeye başlar ve ikinci yılın başında labirentlere katılır; kribriform levha kısmen dik levhadan, kısmen labirentlerden kemikleşir (Gray, 1918). Sfenoid kavkalar 4. yılda labirentlere kaynaşır (Gray, 1918); kama–kalbur sinkondrozu 7–8 yaşına kadar kaynaşır (Triantafyllou ve Piagkou, 2025).

**Hücrelerin gelişimi.** Gebeliğin 12. haftasında orta burun yolunun yan duvarında kıkırdak bir kabartı olarak ilkel etmoid kabarcığı belirir; ön hücreler 22. haftadan itibaren görülür, arka hücreler fetal 16.–20. haftalarda infundibulumun arka kısmından gelişmeye başlar. Doğumda kişinin sahip olacağı bütün etmoid hücreleri küçük ve az gelişmiş olarak vardır. Etmoid hücreleri tam gelişen ilk paranazal sinüstür: çoğu çalışmaya göre yaklaşık 12 yaşında erişkin boyutuna ulaşır, bazı çalışmalar büyümenin 15 ya da 18 yaşına kadar sürdüğünü bildirir; hızlı büyüme dönemi 0–7 yaştır. Kadınlarda etmoid hücreleri %5–10 daha küçük olma eğilimindedir (Lee ve ark., 2022). Ekstramural hücreleri de sayan bir MR çalışmasında (n=1452) etmoid sinüs 0–3 aylıkken 26,2 × 6,7 × 6,1 mm (uzunluk × yükseklik × genişlik), 15–18 yaşında 55,2 × 21,9 × 16,4 mm idi (Lee ve ark., 2022).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kalbur kemiği komşularıyla: kama ve sapan kemiği',
      aciklama:
        'Yalnızca üç kemik gösteriliyor ve onlara soldan bakıyoruz; yüz tarafı görüntünün solundadır. Sarı kalbur kemiği önde, kırmızı kama kemiği arkasında, açık bej sapan kemiği (vomer) altındadır. Kama kemiğinin sol büyük kanadı en dışta durduğu için kalbur kemiğinin arka kısmını örter. Kalbur kemiğinin göz çukuru levhası göz çukurunun iç duvarını, büyük kanadın göz çukuru yüzü dış duvarının arka kısmını yapar; canlıda ikisinin arasında göz çukuru vardır. Burun bölmesinin kemik kısmını kalbur kemiğinin dik levhası, sapan kemiği ve kama kristası birlikte yapar; dik levha bu bakışta labirentin arkasında gizlidir. “Ayrıştır” ile kemikleri birbirinden uzaklaştırabilir, “Bakış” ile önden ya da alttan bakabilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['kalbur-kemigi', 'kama-kemigi', 'sapan-kemigi'],
        vurgula: ['kalbur-kemigi', 'kama-kemigi', 'sapan-kemigi'],
        boya: [
          { secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['sapan-kemigi'], renk: KEMIK_RENGI.kucukYuz },
        ],
        noktalar: [
          { nokta: 'horoz-ibigi' },
          { nokta: 'kalbur-labirenti-sol' },
          { nokta: 'goz-cukuru-levhasi-sol' },
          { nokta: 'orta-burun-kavkasi-sol' },
          { nokta: 'sapan-kemigi-bolgesi' },
          { nokta: 'buyuk-kanat-sakak-yuzu-sol', metin: 'Kama kemiği, büyük kanat' },
          { nokta: 'pterigoid-dis-levha-sol' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kribriform levha ve kafa tabanı: açık sorular',
      md: `- **Beyin–burun arayüzü:** Birçok hayvan türünde BOS’un kribriform levhadan burun mukozasının lenf dolaşımına aktığı gösterilmiştir; insanda bu yolun BOS akışındaki payı bilinmiyor (Mehta ve ark., 2021). Levhanın gözenekli, düşük yoğunluklu yapısı onu görüntülemede zor bir hedef yapar; Klempka ve arkadaşları erişkinlerde kribriform levhanın foton sayan BT ile görüntülenmesini incelemiştir (Klempka ve ark., 2024).
- **Risk tek sayıyla ölçülmüyor:** Keros, Gera ve asimetri ölçüleri birbirinden bağımsız bilgi verir (Gupta ve ark., 2026); iyatrojenik kaçakları en iyi öngören, asimetri hesaba katıldıktan sonra Gera sınıflaması olmuştur (Vinciguerra ve ark., 2024). Klasik görüş lateral lameli en riskli nokta sayarken, bir seride kaçakların yalnızca %8,1’i lateral lamelde çıkmıştır (Vinciguerra ve ark., 2024).
- **Geniş aralıklar:** Onodi hücresi (%8–65), konka bülloza (%15–80), agger nasi (%10–98) ve horoz ibiği havalanması (%2,8–14,1) için çok geniş aralıklar bildirilir (Fadda ve ark., 2024; Papadopoulou ve ark., 2021; Socher ve ark., 2013). Bunun bir kısmı tanım ve yöntem farkıdır: Onodi hücresi kadavrada BT’dekinden daha sık bulunur (Fadda ve ark., 2024); konka bülloza “herhangi bir kavkada herhangi boyutta havalanma” diye tanımlanınca %67,5’e çıkar (Smith ve ark., 2010).
- **Olgunlaşma yaşı:** Etmoid hücrelerinin erişkin boyutuna ulaştığı yaş için 12, 15 ve 18 yaş gibi farklı değerler verilir (Lee ve ark., 2022).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Sinüs ameliyatından sonra burundan gelen berrak sıvı',
      oyku: `52 yaşında bir kadına kronik rinosinüzit ve polip nedeniyle iki taraflı endoskopik sinüs ameliyatı yapılıyor. Üç gün sonra öne eğilince sağ burun deliğinden berrak, sulu bir akıntı geldiğini fark ediyor. Ameliyat öncesi koronal BT yeniden incelendiğinde sağ koku çukurunun derinliği 9 mm (solda 5 mm), sağ etmoid tavanı soldan belirgin alçak ve sağda lateral lamel ile kribriform düzlemi arasındaki açı 40° ölçülüyor.`,
      soru: 'Bu ölçümler hangi sınıflamalarda nereye düşer, kaçağın en olası yeri neresidir ve ameliyat öncesi BT’de neye bakılmalıydı?',
      cozum: `**Sınıflamalar:** Sağdaki 9 mm’lik derinlik Keros tip III aralığındadır (bir tanımda ≥8 mm, ötekinde 8–16 mm) (Babu ve ark., 2018; Costa ve ark., 2019); soldaki 5 mm tip II’dir. İki tarafın farklı Keros tipinde olması Kerala serisinde kişilerin %21,7’sinde görülmüştür (Babu ve ark., 2018). 40°’lik açı Gera sınıf III’tür (<45°, yüksek risk) (Abdullah ve ark., 2020). Etmoid tavanının sağda alçak olması da olağandışı değildir: tavan yüksekliğinde asimetri olan olguların üçte ikisinde alçak taraf sağdır (Hosemann ve Draf, 2013).

**Kaçak nerede?** Endoskopik sinüs cerrahisinde iyatrojenik BOS kaçağı işlemlerin %0,5–3’ünde görülür. 37 iyatrojenik kaçaklık bir seride defekt en sık kribriform levhada (%45,9) ve etmoid tavanında (%37,8), yalnızca %8,1’inde lateral lamelde idi; kafa tabanı asimetrisi kaçak olanlarda belirgin biçimde sıktı (%43,3’e karşı %16,2) ve asimetri hesaba katılınca riski en iyi Gera sınıflaması öngördü (Vinciguerra ve ark., 2024). Klasik anlatımda en sık aşınma yeri orta kavkanın kafa tabanına girdiği, ön etmoidal artere yakın noktadır (Hosemann ve Draf, 2013). Bu hastada derin koku çukuru, dik açılı lamel ve alçak tavan aynı tarafta birleşmiştir; asimetrik tavanda alçak taraftaki diseksiyon kafa tabanının delinmesi açısından daha risklidir (Gupta ve ark., 2026).

**Ameliyat öncesi:** “CLOSE” kontrol listesi kribriform levhanın, lamina papyracea’nın, Onodi hücresinin, sfenoid havalanmasının ve ön etmoidal arterin tek tek değerlendirilmesini hatırlatır (Tuysuz ve ark., 2026). Keros tipi öteki ölçülerle ilişkisiz olduğundan derinlik, açı ve asimetri ayrı ayrı ölçülmelidir (Gupta ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
