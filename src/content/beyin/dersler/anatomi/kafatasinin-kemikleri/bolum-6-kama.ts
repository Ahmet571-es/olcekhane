import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/**
 * 6. bölüm: kama kemiği (sfenoid): gövde ve Türk eyeri, sfenoid sinüs ve havalanma çeşitleri, küçük ve büyük kanatlar,
 * optik kanal ve üst orbital yarık, pterigoid çıkıntılar ve vidian kanal, eklemler ve kemikleşme.
 */
export const kamaKemigi: DersBolumu = {
  id: 'kama-kemigi',
  baslik: 'Kama kemiği (sfenoid)',
  bloklar: [
    // ——— Kama kemiği: temel ———
    {
      tur: 'metin',
      md: `**Kama kemiği** (*os sphenoidale*), kafatası tabanının tam ortasında, iki şakak kemiğinin ve art kafa kemiğinin taban kısmının önünde durur (Gray, 1918; FCAT, 1998). Adı Yunanca “kama biçimli” anlamına gelen *sphenoeides* sözcüğünden gelir (Jamil ve Callahan, 2023). Orta hatta tek bir kemiktir ve beyin kutusunu yüz iskeletine bağlar (Jamil ve Callahan, 2023): ön ve orta kafa çukurlarının, göz çukurunun ve burun boşluğunun yapımına katılır; yüzün derinindeki şakak, infratemporal ve pterigopalatin çukurların da duvarlarındadır (Triantafyllou ve Piagkou, 2025).

Kemiğin büyük kısmı kafatasının içinde gizlidir. Dışarıdan yalnızca küçük bir parçası görünür: şakakta, şakak kemiğinin yassı kısmının hemen önündeki dikdörtgen alan kama kemiğinin **büyük kanadıdır** (OpenStax 7.2).`,
    },
    {
      tur: 'metin',
      md: `Gray kama kemiğini dört kısma ayırır (Gray, 1918):

- **Gövde** (*corpus*): ortadaki, kabaca küp biçimli kısım. İçi oyulmuştur: bir bölmeyle ayrılan iki hava boşluğu, **sfenoid sinüsler**, buradadır. Üst yüzündeki eyer biçimli çukurun, **Türk eyerinin** en derin yerinde hipofiz bezi oturur.
- **Küçük kanatlar** (*alae minores*): gövdenin üst-ön kısmından iki yana uzanan ince üçgen levhalar. Düz üst yüzleri frontal lobun bir kısmını taşır; alt yüzleri göz çukuru tavanının arka kısmını yapar.
- **Büyük kanatlar** (*alae majores*): gövdenin yanlarından çıkıp yukarı, yana ve geriye kıvrılan güçlü çıkıntılar. Beyne bakan yüzleri orta kafa çukurunun bir kısmıdır; derin içbükeydir ve temporal lobun kıvrımlarının izlerini taşır.
- **Pterigoid çıkıntılar** (*processus pterygoidei*): gövdenin büyük kanatlarla birleştiği yerden dik inen iki “bacak”. Her biri bir iç ve bir dış levhadan oluşur. İç levhalar burun boşluğunun arka-yan duvarlarını yapar; daha büyük olan dış levhalar, alt çeneyi hareket ettiren çiğneme kaslarına tutunma yeridir (OpenStax 7.2).

Sfenoid sinüsler doğumdan önce gelişmeye başlar ve 6 yaşında epey büyümüştür (Gray, 1918); çocukların çoğunda havalanma 3–5 yaşında görüntülemeyle saptanabilir (Lee ve ark., 2022). Sinüsün hemen üstünde hipofiz bezi bulunduğu için hipofiz tümörlerinin bir kısmı bugün burundan girilip sfenoid sinüsün içinden geçilerek ameliyat edilir; sinüsün ne kadar havalandığı bu yaklaşımın kolaylığını etkiler (Sethi ve ark., 2023).`,
    },
    {
      tur: 'sahne',
      baslik: 'Kama kemiği yukarıdan: beyne bakan yüz',
      aciklama:
        'Kama kemiği tek başına, kendi renginde. Ona yukarıdan, beynin oturduğu taraftan bakıyoruz; görüntünün üstü yüz tarafıdır ve işaretler kemiğin sol yarısında, görüntünün solundadır. Ortadaki çukur Türk eyeridir: önünde eyer tümseği, ön-yanında küçük kanadın iç ucu olan ön klinoid çıkıntı, arkasında arka klinoid çıkıntı yükselir. Küçük kanat öne ve yana, büyük kanat yana ve geriye uzanır; büyük kanadın beyin yüzünde oval delik açılır. Model sadeleştirildiği için gövdenin içindeki sinüsler ve oval deliğin arkasındaki küçük dikenli delik (foramen spinosum) yoktur.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ust',
        goster: ['kama-kemigi'],
        vurgula: ['kama-kemigi'],
        boya: [{ secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama }],
        noktalar: [
          { nokta: 'turk-eyeri' },
          { nokta: 'eyer-tumsegi' },
          { nokta: 'on-klinoid-sol' },
          { nokta: 'arka-klinoid-sol' },
          { nokta: 'kucuk-kanat-sol' },
          { nokta: 'buyuk-kanat-beyin-yuzu-sol' },
          { nokta: 'oval-delik-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sahne',
      baslik: 'Kama kemiği önden: yarıklar ve delikler',
      aciklama:
        'Kama kemiğine önden, yüzümüzün olduğu taraftan bakıyoruz; işaretler kemiğin sol yarısında, görüntünün sağındadır. Küçük kanat ile büyük kanat arasındaki geniş açıklık üst orbital yarıktır; yarığın iç-üst ucunda optik kanalın ağzı, iç ucunun altında yuvarlak delik bulunur. Ortada aşağı inen ince sırt kama kristasıdır; aşağıda pterigoid çıkıntının dış levhası ve iç levhanın ucundaki çengel görülür. Model sadeleştirildiği için optik kanalı üst orbital yarıktan ayıran ince kemik köprü (optik payanda, İngilizce optic strut; küçük kanadın arka kökü) kaybolmuştur: iki açıklık modelde birleşik görünür ve optik kanal noktası kanal ağzının yerini gösterir. Gövdenin ön yüzündeki sinüs ağızları ile pterigoid (vidian) kanal da modelde yoktur.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['kama-kemigi'],
        vurgula: ['kama-kemigi'],
        boya: [{ secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama }],
        noktalar: [
          { nokta: 'optik-kanal-sol' },
          { nokta: 'ust-orbital-yarik-sol' },
          { nokta: 'yuvarlak-delik-sol' },
          { nokta: 'kama-kristasi' },
          { nokta: 'pterigoid-dis-levha-sol' },
          { nokta: 'pterigoid-cengel-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Dört kısım:** gövde (içinde iki sfenoid sinüs, üstünde Türk eyeri), iki küçük kanat, iki büyük kanat, iki pterigoid çıkıntı.\n\n**Açıklıklar:** küçük kanadın kökleri arasında **optik kanal** (görme siniri); küçük ve büyük kanat arasında **üst orbital yarık**; büyük kanatta önden arkaya **yuvarlak, oval ve dikenli delik**.\n\n**Hipofiz bezi** Türk eyerinin en derin yerinde, **hipofiz çukurunda** oturur; hemen altında sfenoid sinüs vardır.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'İki göz çukurunun uzun eksenlerini geriye doğru uzatırsan, çizgiler kama kemiğinin gövdesinin üstünde buluşur (Gray, 1918). Görme sinirleri de bu noktaya doğru gelir: optik kanallar gövdenin üstündeki enine bir oluğun, kiazma öncesi oluğun iki ucuna açılır ve görme sinirlerinin çaprazlaştığı **optik kiazma** bu oluğun üst-arkasında durur (Gray, 1918).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Sfenoid sinüs tek değildir',
      md: 'Bazı ders kitapları sfenoid sinüsü orta hatta tek bir sinüs diye anlatır (OpenStax 7.2). Oysa kama gövdesinde iki boşluk ve aralarında ince bir bölme vardır (Triantafyllou ve Piagkou, 2025). Bölme çoğu kez bir yana eğiktir; iki sinüs biçim ve boyutça çok değişkendir ve nadiren simetriktir (Gray, 1918). Sağ ve sol sinüsün farklı büyüklükte olması sık görülen bir durumdur (Lee ve ark., 2022).',
    },

    // ——— Gövde ve Türk eyeri: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gövdenin üst yüzü.** Önden arkaya şu yapılar sıralanır (Gray, 1918; FCAT, 1998):

1. **Etmoidal diken** (*spina ethmoidalis*): kalbur kemiğinin kribriform levhasıyla eklem yapan öndeki çıkıntı; TA98’de ayrı bir adı yoktur.
2. **Kama boyunduruğu** (*jugum sphenoidale*; klinikte *planum sphenoidale*): ortası hafif kabarık düz yüzey; iki yanındaki sığ oluklarda koku yolları uzanır (Gray’in kitabında “olfactory lobes”). Doğumdan sonraki ilk yılda iki küçük kanadın gövdenin üstünde ortada buluşmasıyla oluşur.
3. **Kama limbusu** (*limbus sphenoidalis*): boyunduruğun arka sınırı olan sırt; arkasındaki dar, enine oluğun ön kenarını yapar.
4. **Kiazma öncesi oluk** (*sulcus prechiasmaticus*; Gray’de *chiasmatic* ya da *optic groove*): iki yanda optik kanallara açılır; optik kiazma oluğun üst-arkasındadır.
5. **Eyer tümseği** (*tuberculum sellae*) ve arkasında **Türk eyeri** (*sella turcica*): eyerin en derin kısmı hipofizi taşıyan **hipofiz çukurudur** (*fossa hypophysialis*; Gray: *fossa hypophyseos*). Eyerin ön sınırını iki yanda küçük **orta klinoid çıkıntılar** tamamlar.
6. **Eyer sırtı** (*dorsum sellae*): eyerin arka duvarı olan kare biçimli levha; üst köşeleri **arka klinoid çıkıntılardır** ve eyeri derinleştirir.
7. **Klivus**: eyer sırtının arkasında eğik inen sığ yokuş; art kafa kemiğinin taban kısmındaki olukla devam eder ve ponsun üst kısmını taşır.

Gray hem ön hem arka klinoidi tentorium cerebelli’nin tutunma yeri sayar ve orta klinoidi her eyerde bulunan bir kabartı gibi anlatır (Gray, 1918). Güncel bir derlemeye göre orta klinoid diaphragma sellae’ye, arka klinoid tentoryuma tutunur; orta klinoid ise her kafatasında bulunmaz (Triantafyllou ve Piagkou, 2025).

**Yan yüzler.** Gövdenin yan yüzleri büyük kanatlar ve iç pterigoid levhalarla kaynaşır. Büyük kanat kökünün üstünde, italik bir “f” harfi gibi kıvrık, geniş **karotis oluğu** (*sulcus caroticus*) uzanır: iç karotis arteri ve kavernöz sinüsü barındırır. Oluk arkada foramen lacerumda başlar ve ön klinoidin iç yanında biter; arter burada sempatik sinir ağıyla sarılı olarak kavernöz sinüsün içinden geçer. Oluğun arka-dış kenarında, gövde ile büyük kanat arasındaki açıda **kama dilciği** (*lingula sphenoidalis*) adlı kemik sırt bulunur (Gray, 1918; FCAT, 1998).`,
    },
    {
      tur: 'sayilar',
      duzey: 'ileri',
      baslik: 'Türk eyeri: 18.364 hastanın meta-analizi',
      ogeler: [
        { deger: '9,06', birim: 'mm', aciklama: 'Eyerin ortalama uzunluğu (ön–arka).' },
        { deger: '8,00', birim: 'mm', aciklama: 'Ortalama derinlik; gruplar arasında küçük farklar var.' },
        { deger: '6,59', birim: 'mm', aciklama: 'Orta noktadaki ortalama yükseklik.' },
        { deger: '845,8', birim: 'mm³', aciklama: 'Eyerin ortalama hacmi.' },
      ],
      not: 'Kaynak: Iskra ve ark. (2023). Bir derleme 6,59 mm’yi “ortalama derinlik” diye aktarır; birincil kaynakta 6,59 mm orta nokta yüksekliği, derinlik 8,00 mm’dir.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Eyer ve klinoidlerin çeşitliliği.** Aynı meta-analizde genel sınıflamayı kullanan çalışmalarda (5406 hasta) en sık tip olağan eyerdi (havuzlanmış sıklık %55,56); “olağan” burada köprü, eyer sırtında düzensizlik, eğik ön duvar, çift tabanlı görünüm ya da piramit biçimli eyer sırtı olmayan eyer demektir. Aynı çalışmalarda eyer köprüsü %11,34 oranındaydı (Iskra ve ark., 2023). Gray’e göre kama kemiğinin iç bağları bazen kemikleşir: ön klinoidi orta klinoide bağlayan **karotikoklinoid bağ**, ön klinoidi arka klinoide bağlayan lifli **interklinoid bağ** ve kama dikeni ile dış pterigoid levha arasındaki **pterigospinöz bağ**. Ön klinoid orta klinoide bir kemik dikenle bağlanınca iç karotis arter oluğunun ucu bir deliğe, **karotikoklinoid deliğe** dönüşür (Gray, 1918).

Güncel bir derlemenin aktardığı serilerde: Sharma ve arkadaşlarının 2726 kafatasında klinik önemi olan orta klinoid çıkıntı %42 oranında vardı ve bunların %27’si iç karotis arterin çevresinde tam bir kemik halka yapıyordu. Nikolova sınıflamasında tip I köprü ön ve orta klinoidi birleştirerek karotikoklinoid deliği (ön interklinoid kanal) oluşturur; 315 Bulgar bireyin BT’sinde sella köprüsü %21,7 oranında, en sık tip I olarak (%14,3) görüldü. Salma ve arkadaşlarının 100 kuru kafatasında arka klinoid %78 olağan, %16 uzamış, %6 havalıydı (Triantafyllou ve Piagkou, 2025).

Eyer sırtının iki yanında abdusens siniri için birer çentik, çentiğin altında da petröz apeksle eklem yapan ve foramen lacerumun iç sınırını oluşturan keskin **petrozal çıkıntı** bulunur (Gray, 1918). Arka klinoidin tabanında, üstten Gruber bağıyla sınırlanan osteofibröz **Dorello kanalı** yer alır (Triantafyllou ve Piagkou, 2025).

**Klivus.** 220 erişkinin BT anjiyografisinde klivusun uzunluğu ortalama 43,45 mm, eğim açısı 67,41° bulundu. Sinüsün klivusa uzandığı “klivus mağarası” Güldner tip IVa ve IVb sinüslerin hepsinde görüldü ve bu tipler incelenen 220 kişinin %70,9’unu oluşturuyordu (Cheng ve ark., 2015). Gray de sinüslerin bazen art kafa kemiğinin taban kısmına, neredeyse foramen magnuma kadar uzandığını yazar (Gray, 1918).`,
    },

    // ——— Sfenoid sinüs: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Ön ve alt yüz.** Gövdenin ön yüzünde orta hatta dikey **kama kristası** (*crista sphenoidalis*) uzanır: kalbur kemiğinin dik levhasıyla eklem yapar ve burun bölmesine katılır. Kristanın iki yanındaki düzensiz açıklıklar sfenoid sinüslere açılır. Alt yüzün ortasındaki üçgen **kama gagası** (*rostrum sphenoidale*) kristanın devamıdır ve sapan kemiğinin (vomer) iki kanadı arasındaki derin yarığa oturur. Gaganın iki yanında, iç pterigoid levhanın kökünden içe uzanan ince **kın çıkıntısı** (*processus vaginalis*) bulunur (Gray, 1918). Gövdenin alt yüzü burun boşluğu tavanının arka kısmına ve iki koananın (arka burun deliklerinin) üst sınırına katılır; burun bölmesinin arka kısmını sapan kemiği ile kama gagası yapar (Gray, 1918).

**Sfenoid sinüs** (*sinus sphenoidalis*). Gövdenin içindeki iki sinüsü bir bölme (*septum sinuum sphenoidalium*) ayırır (FCAT, 1998). Gray’in verdiği ortalama ölçüler 2,2 cm yükseklik, 2 cm genişlik ve 2,2 cm ön-arka derinliktir; sinüsler çoğu kez düzensiz kemik lamellerle kısmen bölünür (Gray, 1918). Sinüsler önden ve alttan, gövdenin ön-alt kısmındaki iki ince, kıvrık levha olan **sfenoid kavkalarla** (*concha sphenoidalis*) kısmen kapanır; eklemli kafatasında her sinüsün üst kısmında yuvarlak bir açıklık kalır (Gray, 1918). Her sinüs ön duvarının üst kısmındaki bu ağızla (*apertura sinus sphenoidalis*), üst kavkanın üstünde ve arkasında kalan **sfenoetmoidal girintiye** açılır; bazen arka etmoid hücreleriyle de bağlantılıdır (Gray, 1918). Ağız genellikle üst kavkanın iç yanında bulunur (Plou ve ark., 2023).

**Komşular.** Sinüsü önde etmoid hücreleri, arkada klivus, içte sinüsler arası bölme sınırlar (Lee ve ark., 2022). Ön-üst-yanında görme siniri, yanında kavernöz sinüs, altında burun-yutak (nazofarenks), üstünde Türk eyeri bulunur (Sethi ve ark., 2023). Havalanmanın derecesine göre sinüs duvarında görme siniri (üst-yanda), iç karotis arter (arka-yanda) ve maksiller sinir (altta) kabarıklık yapabilir (Lee ve ark., 2022). Bu yakınlık nedeniyle sinüs iltihabı menenjite, kafa içi apseye ya da kavernöz sinüs trombozuna yayılabilir (Lee ve ark., 2022).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sinüsün gelişimi.** Sfenoid sinüs gebeliğin 3. ayında, burun mukozasının kıkırdak burun kapsülünün arka kısmına doğru çökmesiyle başlar; 5. ayda ön-yan duvarlar kemikleşerek sfenoid kavkaları yapar (Lee ve ark., 2022). Doğumdaki durum kaynaklara göre farklı anlatılır: Gray sinüslerin doğumda çok küçük boşluklar hâlinde bulunduğunu ve asıl gelişmenin ergenlikten sonra olduğunu yazar (Gray, 1918); bir başka kaynağa göre sinüs doğumda havasızdır ve havalanma 2–3 yaşında başlar (Sethi ve ark., 2023). Yenidoğanda gösterilmiş olsa da çoğu çalışma bireylerin çoğunda havalanmanın 3–5 yaşında saptanabildiğini bildirir (Lee ve ark., 2022).

Sinüs aşağıda 6–7 yaşında pterigoid kanala, arkada 8 yaşında hipofiz çukuruna, yanda 8–12 yaşında ön klinoide doğru uzanır; içe doğru büyüme aradaki bölmeyi giderek inceltir. Konkal tip genellikle 1–3 yaşlarında görülür ve havalanma yalnızca kavkalar ile gövdenin kaynaşma düzlemine kadar uzanır; preseller tip 4–9 yaşlarında, seller tipler 10–12 yaşından sonra baskındır. Büyümenin çoğu 14–16 yaşına kadar tamamlanır; sağ–sol asimetri sıktır ama hangi tarafın daha büyük olduğu konusunda uzlaşı yoktur (Lee ve ark., 2022).`,
    },
    {
      tur: 'animasyon',
      duzey: 'lisans',
      ad: 'kama-sinusu-tipleri',
      baslik: 'Sfenoid sinüsün havalanma tipleri',
      aciklama:
        'Sagital kesitte kama kemiğinin gövdesi ve Türk eyeri. Bir tipe dokun: hava boşluğunun eyerin ön ve arka duvarına göre nereye kadar uzandığını ve Türk serisindeki sıklığını görürsün.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'BT’de sfenoid sinüs: havalanma tipleri',
      md: `Sinüsün arkaya ne kadar uzandığı sagital BT kesitinde Türk eyerine göre sınıflanır; sınıflama Hammer ve Rådberg’e dayanır (Sethi ve ark., 2023):

- **Konkal tip:** eyerin ön duvarının önünde hiç ya da çok az havalanma vardır (Açar ve ark., 2024); başka bir tanımda eyerin altındaki bölge hava boşluğu olmayan, tümüyle kemikleşmiş bir bloktur (Famurewa ve ark., 2018).
- **Preseller tip:** havalanmanın arka sınırı eyerin ön duvarının önündedir.
- **Seller tip:** arka sınır eyerin arka duvarının önündedir.
- **Postseller tip:** arka sınır eyerin arka duvarının arkasındadır (Açar ve ark., 2024).

Yana uzanım koronal kesitte değerlendirilir: ölçüt, pterigoid (vidian) kanal ile yuvarlak deliğin iç kenarlarını birleştiren doğrudur (Famurewa ve ark., 2018). Önden bakışta büyük kanada uzanım sinüse beşgen, pterigoid levhaya uzanım altıgen bir biçim verir (Lee ve ark., 2022). Sinüs hiç havalanmazsa kemik erişkinlikte de sarı ilik taşır; “durmuş havalanma” denen bu görünüm tümörle karışabilir (Sethi ve ark., 2023).`,
    },

    // ——— Sfenoid sinüs: uzman ———
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sagital havalanma tipleri: seriler arasında büyük fark',
      sutunlar: ['Seri (örnek)', 'Konkal', 'Preseller', 'Seller', 'Postseller'],
      satirlar: [
        ['Açar ve ark., 2024: Necmettin Erbakan Üniversitesi, sağlıklı Türk bireyler (300 BT)', '%0,7', '%6,6', '%30', '%62,7'],
        ['İlgin ve ark., 2025: Necmettin Erbakan Üniversitesi (154 BT)', '%2,6', '%7,8', '%51,3', '%38,3'],
        ['Al-Muhanna ve ark., 2026: Suudi Arabistan (2433 hasta)', '%1,6', '%9,2', '%32,1', '%57,1'],
        ['Kang ve ark., 2022: Seul, transsfenoidal ameliyat (490 hasta)', '—', '—', '%45,7', '%47,9'],
        ['Famurewa ve ark., 2018: Nijerya (320 BT)', '%1,9', '%1,2', '%56,6', '%40,2'],
        ['Fadda ve ark., 2022: San Luigi Gonzaga Üniversite Hastanesi (230 BT, Güldner şeması)', '%8,5', '%27,2', '%58,7', '%5,6'],
        ['Hiremath ve ark., 2018: Hindistan (500 BT)', '%0', '%1,2', 'Eksik seller %22,2; tam seller %76,6', 'Ayrı tip yok'],
        ['Dahal ve ark., 2025: Nepal (360 BT)', '%2,5', '%6,4', 'Eksik seller %26,7; tam seller %64,4', 'Ayrı tip yok'],
        [
          'Papadopoulos-Manolarakis ve ark., 2026: Yunanistan (253 BT)',
          'Agenezi %0,4',
          '%8,7',
          'Eksik seller %27,7; tam seller %63,2',
          'Ayrı tip yok',
        ],
        ['Dal Secchi ve ark., 2018 (90 BT)', '%0', '%2', '%98', 'Arkaya uzanım ayrı sınıflandı'],
      ],
      not: 'Literatürdeki aralıklar: konkal %2–28, preseller %17–21, seller %54–85, postseller %22–43,3 (Famurewa ve ark., 2018). Seriler aynı şemayı kullanmaz: bazıları “seller” sınırını eyer tümseğinden, bazıları eyerin ön ve arka duvarından çizer; bazı şemalar seller tipi “eksik” ve “tam” diye ikiye ayırır ve postseller tipi ayrıca saymaz. —: bildirilmedi.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Topluma mı, tanıma mı bağlı?** Bir derlemenin aktardığına göre seller tip Hindistan, Türkiye, Ürdün, Çin, Avrupa ve Amerika’da, postseller tip Pakistan, İran ve Irak’ta baskındır (Al-Muhanna ve ark., 2026); Asya toplumlarında preseller ve konkal tip Avrupa toplumlarındakinden sıktır (Bechev ve ark., 2025). Ama tablodaki iki Türk serisi, aynı kurumdan olmalarına karşın, postseller tipi %62,7 ve %38,3 olarak bulmuştur (Açar ve ark., 2024; İlgin ve ark., 2025): örneklem ve ölçüm farkı tek başına büyük değişkenlik yaratabilir.

**Yaş.** Bir Türk MR çalışmasında (n=876) sinüs 1–3 yaşta ortalama 4,6 × 4,1 × 3,9 mm (uzunluk × yükseklik × genişlik) iken 12–14,9 yaşta 29,7 × 27,6 × 23,2 mm’ye ulaşıyordu (Lee ve ark., 2022). Seul’deki 490 hastada havalanma kabaca 3 yaşından 16 yaşına kadar sürüyordu ve yaşla ters ilişkiliydi (r = –0,336): genç erişkinlerde daha genişti (Kang ve ark., 2022). Necmettin Erbakan Üniversitesi serisinde de ileri yaş, postseller tip, geniş yan uzanım (tip IV–V) ve optik kanal, vidian kanal ve karotis kanalı kabarıklığının daha az görülmesiyle ilişkiliydi (Açar ve ark., 2024). Sinüsün büyümesinin ne zaman bittiği de kaynaklara göre değişir: radyolojik erişkin boyutu için 14 yaş (Açar ve ark., 2024), 14–16 yaş (Lee ve ark., 2022) ve yaklaşık 16 yaş (Kang ve ark., 2022) verilir; bir kaynak büyümenin 20 yaşına kadar sürdüğünü yazar (Tomaszewska ve ark., 2015).

**Yana uzanım.** Koronal kesitte sinüsün yan duvarı vidian kanal ile yuvarlak deliğin iç kenarlarını birleştiren doğrunun dışına geçiyorsa yana uzanım vardır; **küçük kanat tipinde** sinüs optik payanda yoluyla ön klinoide uzanır (Famurewa ve ark., 2018). Pterigoid çıkıntı havalanması, sinüsün vidian kanaldan geçen yatay düzlemin altına inmesi; büyük kanat havalanması, yuvarlak delikten geçen dikey çizginin dışına uzanması diye tanımlanır (Hewaidi ve Omami, 2008). Açar ve arkadaşlarının koronal sınıflamasında tip 0’da ön klinoid, pterigoid çıkıntı ve büyük kanatta havalanma yoktur; tip V’te havalanma üçüne birlikte uzanır. Bu seride hastaların %71,3’ünde yana uzanım vardı; en sık tip IV (%23,6) ve tip V (%21,7) idi (Açar ve ark., 2024).

Libya’da 300 BT’de pterigoid çıkıntı %29, ön klinoid %15,3, büyük kanat %20 oranında havalıydı (Hewaidi ve Omami, 2008). Nijerya’da 320 BT’de havalanma pterigoide %45,1, büyük kanada %35, küçük kanada %11,6 uzanıyordu; tam yan tip %30,3 idi (Famurewa ve ark., 2018). Suudi serisinde büyük kanat %47,4, pterigoid çıkıntı %39 havalıydı (Al-Muhanna ve ark., 2026); Fadda serisinde pterigoid girinti havalanması %20,4 idi (Fadda ve ark., 2022). Literatürde pterigoid çıkıntı havalanması %25–57 arasında bildirilir (Papadopoulou ve ark., 2021). Pterigoid havalanması skafoid çukurun kemik tabanını 0,2 mm’ye kadar inceltir ve sinüsü östaki borusuna çok yaklaştırır (Hewaidi ve Omami, 2008).

**Lateral girinti** (*lateral recess*), sinüsün pterigoid çıkıntıya, büyük kanada ya da ikisine birden geniş yan havalanmasıdır (Bendersky ve ark., 2011). Barañano ve arkadaşları 1000 BT’de lateral girintiyi %35,3 oranında buldu; aynı seride girintideki araknoid çukurcuklar hastaların %23,4’ünde, yuvarlak deliğin dışında yer alıyordu ve büyük olasılıkla altta yatan kafa içi basınç artışından gelişen bu çukurcuklar, edinsel kendiliğinden BOS kaçaklarının ve lateral intrasfenoidal ensefalosellerin başlıca nedeniydi (Bendersky ve ark., 2011). Yana uzanımların cerrahiye yararı da vardır: kavernöz sinüsün ön-iç kısmına, orta kafa çukuruna ve Meckel mağarasına endoskopik erişimi kolaylaştırırlar (Famurewa ve ark., 2018). Öte yandan yana uzanım parasellar iç karotis kabarıklığıyla ilişkilidir (Dal Secchi ve ark., 2018).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Protrüzyon ve dehisens: tanımlar önemli.** *Protrüzyon* (kabarıklık), sinüs duvarındaki bir yapının sinüs boşluğuna doğru taşmasıdır. Bazı çalışmalar yapının çevresinin %50’sinden fazlasının sinüs havasına açık olmasını şart koşar (Fadda ve ark., 2022; Papadopoulos-Manolarakis ve ark., 2026); Sirikci ve Birsen de iç karotis arter ya da görme sinirinin çevresinin yarısından fazlasının sinüse girmesini ölçüt almıştır (Hewaidi ve Omami, 2008). *Dehisens* ise yapıyı sinüsten ayıran kemik örtünün eksik olmasıdır; bir sistematik derlemeye göre iç karotisin kemik örtüsü olguların yaklaşık %5–10’unda eksiktir (Bechev ve ark., 2025). Bildirilen oranlar arasındaki büyük farkın başlıca nedenlerinden biri bu terim farklılığıdır (Tuysuz ve ark., 2026); bazı seriler de yalnızca iki taraflı olguları ayrıca bildirir (Papadopoulos-Manolarakis ve ark., 2026). Aşağıdaki tabloda sayıları değil, her serinin tanımını karşılaştırmak gerekir.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sinüs duvarındaki yapılar: protrüzyon; dehisens',
      sutunlar: [
        'Seri (örnek)',
        'İç karotis arter',
        'Optik kanal ya da görme siniri',
        'Yuvarlak delik ya da V2',
        'Vidian kanal ya da sinir',
      ],
      satirlar: [
        ['Açar ve ark., 2024 (300 BT)', 'Karotis kanalı %50; %19,7', '%46,7; %45,6', '%44; %23', '%57,7; %46,3'],
        ['Hewaidi ve Omami, 2008: Libya (300 BT)', '%41; %30', '%35,6; %30,6', 'V2 %24,3; %13', '%27; %37'],
        ['Tuysuz ve ark., 2026: İstanbul (3052 BT)', '%7,9; %0,8', '%17,8; %3,3', '—', '—'],
        ['Fadda ve ark., 2022 (230 BT; >%50 çevre ölçütü)', '%26,3; %0,4', '%13; %1,5', '—', '—'],
        ['Dal Secchi ve ark., 2018 (90 BT; >%50 ölçütü)', 'Parasellar %26, paraklival %35; paraklival dehisens %3,6', '—', '—', '—'],
        ['Famurewa ve ark., 2018: Nijerya (320 BT)', '%34,4; —', '—', '—', '—'],
        ['Al-Muhanna ve ark., 2026: Suudi Arabistan (2433 hasta)', 'Karotis kanalı %22,2; %3,2', '%13,9; %4,1', '—', '—'],
        [
          'Papadopoulos-Manolarakis ve ark., 2026: Yunanistan (253 BT; >%50 ölçütü)',
          'İki taraflı protrüzyon %15,8; iki taraflı protrüzyon + dehisens %1,6',
          '—',
          '—',
          'İki taraflı protrüzyon %8,3; ayrıca iki taraflı protrüzyon + dehisens %8,3',
        ],
      ],
      not: 'Her hücrede önce protrüzyon, sonra dehisens oranı; —: bildirilmedi. İstanbul serisi Başakşehir Çam ve Sakura Şehir Hastanesi’ndendir. Kadavra çalışmalarında (ikincil aktarım) kabarıklık görme sinirinde %56, iç karotiste %34, V2’de %41, vidian sinirde %52 bildirilmiştir (Papadopoulos-Manolarakis ve ark., 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sinüs duvarında görme siniri ve iç karotis arter',
      md: `- **İç karotis arter** sinüsün ön-yan duvarında olguların %80’inde kabarıklık yapar; kemik kanalı ortalama 0,8 mm kalınlıktadır ve belirgin kabarıklıkların üstünde 0,5 mm’ye iner (Hosemann ve Draf, 2013). Arteri sinüsten ayıran kemik olguların %66–88’inde yaklaşık 0,5–1 mm’dir (Tuysuz ve ark., 2026).
- **Görme siniri:** optik kanalın sinüse bakan kemiği ortalama 0,3 mm’dir; dehisens %4–8, belirgin kabarıklıkta %12’dir. Kanal olguların %8’inde çapının yarısı kadar sinüse çıkıntı yapar; geniş lateral girintisi, yani iyi havalanmış bir ön klinoidi olan %1’inde sinir sfenoid sinüsün ya da arka (sfenoetmoidal) bir etmoid hücresinin içinden kısmen “serbestçe” geçer (Hosemann ve Draf, 2013). Fuji ve arkadaşlarının kadavra çalışmasında görme sinirlerinin %78’i 0,5 mm ya da daha ince kemikle örtülüydü; optik kanal sinirin en az beslendiği yer olduğundan zedelenmeye çok açıktır (Hewaidi ve Omami, 2008).
- **Optikokarotid girinti:** ön klinoid havalanınca sinüsün yan duvarında, üstte optik kanal ile altta karotis kabarıklığı arasında küçük bir çukur oluşur (Hewaidi ve Omami, 2008); iki yapı arasındaki uzaklık 2–10 mm’dir (Hosemann ve Draf, 2013). Ugradar ve arkadaşlarına göre optik kanal olguların %90’ında sinüsün yan duvarından, %10’unda tavanından geçer (Triantafyllou ve Piagkou, 2025).
- **Hangi havalanma neyi açığa çıkarır?** Ön klinoid havalanması iç karotis ve görme siniri, pterigoid havalanması vidian siniri, büyük kanat havalanması V2 kabarıklığıyla anlamlı biçimde ilişkilidir (Hewaidi ve Omami, 2008). Kabarıklık ve dehisens en çok postseller tipte ve tip IV–V yan uzanımda görülür (Açar ve ark., 2024). Yunan serisinde tam seller tip iç karotisin ve görme sinirinin açığa çıkma olasılığını 5,28 ve 4,51 kat, pterigoide uzanım vidian sinir kabarıklığı ya da dehisensi olasılığını 8,08 kat artırıyordu; küçük kanada uzanımın %96’sında görme siniri kabarıklığı vardı ve çevresinin ≥%50’si açık sinirde yaralanma riski belirgin biçimde artar (Papadopoulos-Manolarakis ve ark., 2026).
- **Bedeli:** Karotis yaralanması yaygın kronik rinosinüzit cerrahisinde %0,3, hipofiz cerrahisinde yaklaşık %1 oranında bildirilir; önemli karotis yaralanmalarında ölüm oranı yaklaşık %17’dir (Hosemann ve Draf, 2013).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Bölmeler.** Sinüsler arası bölme sık sık orta hattan sapar ve çoğu kez karotis oluğunda ya da iç karotis kanalının kemik duvarında sonlanır; olguların %60’ından fazlasında orta hattan sapar (Bechev ve ark., 2026). Bölmelerin yalnızca dörtte biri orta hattadır (Fadda ve ark., 2022). Nijerya’da 320 BT’de tek bölme %46,9, birden çok bölme %50,6, bölmesizlik %2,5 idi (Famurewa ve ark., 2018); Suudi serisinde sinüs içi bölme %97,7 oranında vardı ve en sık tek bölme (%59,6) görüldü (Al-Muhanna ve ark., 2026). Bir derlemeye göre hastaların %20–35’inde birden çok bölme bulunur (Bechev ve ark., 2025); Fadda serisinde ek (aksesuar) bölmeler %30,4 idi (Fadda ve ark., 2022).

Bölmenin iç karotis arterin kemik örtüsüne yapışması literatürde %4,9–89 gibi çok geniş bir aralıkta bildirilir; Nijerya serisinde %31,6 idi (Famurewa ve ark., 2018). Nepal’de 360 BT’de %37,8 (Dahal ve ark., 2025), Fadda serisinde %21,6 (optik kanal duvarına %8,6) bulundu (Fadda ve ark., 2022). Açar ve arkadaşlarının 250 hastalık BT çalışmasında (500 taraf) bölmenin yandan karotis kabarıklığında bitmesi %28,4, optik kanalda bitmesi %14,4 idi (Açar ve ark., 2019). Bir sistematik derleme bölmenin karotis kanalına yapışmasını %4,7 olarak aktarır (Papadopoulou ve ark., 2021); daha eski bir kaynak ise iç karotisle bağlantı kuran bölmeleri yalnızca %1 olarak verir (Hosemann ve Draf, 2013). Seul serisinde havalanma zayıfsa iç karotis belirgin değildi ve bölmeler paraklival iç karotise yapışıyor ya da ona yakın duruyordu; preseller tipte bölmenin iç karotise girmesi %36,2 idi (Kang ve ark., 2022). Dal Secchi serisinde bölmenin paraklival iç karotis yönüne sapması %14 idi (Dal Secchi ve ark., 2018).

Böyle bir bölmeyi rutin olarak kırmak yüksek riskli bir harekettir: kuvvet altta yatan iç karotise ya da görme sinirine iletilebilir (Bechev ve ark., 2026); bölmenin koparılması damarı yırtarak ameliyat sırasında acil bir duruma yol açabilir (Famurewa ve ark., 2018).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sinüse giriş: ağız, ön duvar, arka duvar',
      md: `- **Ağız:** 30 sağlıklı kişinin BT’sinde (60 taraf) sfenoid sinüs ağzının çapı ortalama 2,39 mm, iki ağız arası 5,64 mm, ağız ile ön burun dikeni arası 54,85 mm idi (Ortiz-Rafael ve ark., 2025). Onodi hücresi ağzı yukarı iter (Fadda ve ark., 2024); Onodi hücresi kalbur kemiği bölümünde ayrıntılı anlatılır.
- **Ön duvar ve taban:** Ön duvarın alt üçte birinde sfenopalatin arterin septal dalı (nazoseptal arter) bulunur. Sfenopalatin arterin farinks dalı palatovaginal kanaldan, sinüs tabanına yakın geçer (Hosemann ve Draf, 2013).
- **Eyer ve klivus:** Seller ve postseller tiplerde eyerin ön duvarı ve tabanı tipik olarak 1 mm’den incedir; postseller tipte klivus da çok incelebilir ve endoskopik yaklaşımda delinip arka kafa çukuruna istenmeden girilebilir (Famurewa ve ark., 2018). Dal Secchi serisinde sinüsün arkaya uzanımı %78 idi; sinüsün arka sınırı ile klivus arasındaki kemiğin 2 mm’den ince kaldığı “kritik” tip %42 oranındaydı (Dal Secchi ve ark., 2018).
- **Eyer sırtı:** Eyer sırtının havalanması hipofiz cerrahisinde arka duvarın delinmesine ve BOS kaçağına yol açabilir (Papadopoulou ve ark., 2021); Nijerya serisinde %1,6 idi (Famurewa ve ark., 2018). Bir hemisfenoidin hiç havalanmadığı aplazi aynı seride yalnızca 1 olguda (%0,3) görüldü (Famurewa ve ark., 2018).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Sfenoid kavkalar: küçük ama ayrı bir öykü.** Her kavkanın üst yüzü içbükeydir ve sinüs boşluğuna bakar; alt yüzü dışbükeydir ve burun boşluğu tavanının bir kısmını yapar. Kavka önde kalbur kemiğiyle, yanda damak kemiğiyle eklem yapar; sivri arka ucu sapan kemiğinin üstünde, yanda pterigoid çıkıntının kökü ile içte kama gagası arasına oturur. Kavkanın küçük bir parçası bazen göz çukurunun iç duvarına da katılır: önde lamina papyracea, altta damak kemiğinin göz çukuru plağı, üstte alın kemiği arasında (Gray, 1918). Her kavka fetal 5. ayda bir merkezden kemikleşir; doğumda küçük üçgen lamellerdir ve ancak 3. yılda oyulup koni biçimini alır (Gray, 1918). Cleland’a göre her kavka dört merkezden kemikleşir; Gray de kalbur kemiğinin eklemlerini sayarken iki sfenoid kavkayı ayrı kafatası kemikleri olarak sayar (Gray, 1918). Kavkaların kama kemiğine kaynaşma zamanı kaynaklarda farklıdır: Gray 4. yılda etmoid labirentlerine, 9–12 yaşlar arasında kama kemiğine kaynaştıklarını yazar (Gray, 1918); Van Alyea’ya dayanan güncel bir aktarım 3 yaş verir (Lee ve ark., 2022).`,
    },

    // ——— Kanatlar, optik kanal ve yarıklar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Küçük kanatlar** (Gray’de *alae parvae* ya da *orbito-sphenoids*) ince, üçgen levhalardır ve yana doğru sivri uçla biter. Gövdeye iki kökle bağlanır: üstteki ince ve yassı, alttaki kalın ve üçgendir. **Optik kanal** (*canalis opticus*) iki kökün arasındadır ve görme siniri ile oftalmik arteri göz çukuruna geçirir (Gray, 1918). Gray bu açıklığa “optic foramen” der ama aynı kitapta onu kısa, silindir biçimli bir kanal olarak tanımlar; güncel adı kanaldır (Gray, 1918; FCAT, 1998). Küçük kanadın ön kenarı alın kemiğiyle tırtıllı bir eklem yapar; düzgün, yuvarlak arka kenarı beynin lateral yarığına (Sylvius yarığı) oturur ve iç ucu **ön klinoid çıkıntıdır** (Gray, 1918). Alt yüzü göz çukuru tavanının arka kısmını ve üst orbital yarığın üst sınırını yapar.

**Üst orbital yarık** (*fissura orbitalis superior*) üçgen biçimlidir: içte gövde, üstte küçük kanat, altta büyük kanadın göz çukuru yüzünün iç kenarı sınırlar; dışta alın kemiği tamamlar (Gray, 1918). Güncel bir tarifte virgüle benzer: iç-alt kısmı yuvarlak, üst-dış kısmı dar ve uzundur (Coroleucă ve ark., 2024). İçinden geçen sinirler ve damarlar ünitenin 3. dersinde ayrıntılı işlenir.

**Büyük kanatlar** (Gray’de *alae magnae* ya da *ali-sphenoids*). Her birinin arka kısmı üçgen bir çıkıntı olarak şakak kemiğinin pul ve kayalık kısımları arasındaki açıya oturur; tepesinde aşağı yönelmiş **kama dikeni** (*spina ossis sphenoidalis*; Gray’de *spina angularis*) bulunur (Gray, 1918). TA98 büyük kanatta beş yüz (beyin, şakak, infratemporal, maksiller ve göz çukuru yüzü) ve dört kenar (elmacık, alın, yan kafa ve pul kenarı) ayırır (FCAT, 1998):

- **Beyin yüzü** (*facies cerebralis*): ön-iç kısmında **yuvarlak delik** (*foramen rotundum*; maksiller sinir), onun arka-dışında **oval delik** (*foramen ovale*; mandibular sinir, aksesuar meningeal arter ve bazen küçük petrozal sinir), arka açıda dikenin hemen önünde bazen çift olan kısa bir kanal, **dikenli delik** (*foramen spinosum*; orta meningeal damarlar ve mandibular sinirin geri dönen dalı) açılır. Oval deliğin iç yanında, pterigoid kökün karşısında bazen küçük **Vesalius deliği** görülür (TA98: *foramen venosum*); aşağıda skafoid çukura yakın açılır ve kavernöz sinüsten küçük bir ven geçirir (Gray, 1918; FCAT, 1998).
- **Dış yüz**: enine **infratemporal krista** (*crista infratemporalis*) onu ikiye ayırır. Üstteki şakak yüzü temporal çukurun bir kısmıdır ve temporal kasa tutunma yeri verir; alttaki infratemporal yüz, krista ile birlikte lateral pterigoid kasa tutunma yeri verir. Oval ve dikenli delikler infratemporal çukurun tavanına açılır (Gray, 1918).
- **Göz çukuru yüzü** (*facies orbitalis*): düzgün, dörtgen yüz; göz çukurunun dış duvarının arka kısmını yapar. Yuvarlak alt kenarı alt orbital yarığın arka-dış sınırıdır; iç kenarının ortasındaki küçük tüberküle lateral rektusun alt başı tutunur (Gray, 1918).
- **Maksiller yüz** (*facies maxillaris*): üst orbital yarığın iç ucunun altındaki oluklu yüz; pterigopalatin çukurun arka duvarıdır ve yuvarlak delik buraya açılır (Gray, 1918; FCAT, 1998).

Büyük kanadın ucundaki eğik kesilmiş üçgen kısım yan kafa kemiğinin kama köşesiyle eklem yapar; bu bölge pteriondur (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kama kemiği arkadan: klinoidler ve pterigoid çıkıntılar',
      aciklama:
        'Kama kemiğine arkadan bakıyoruz; işaretler kemiğin sol yarısında, görüntünün solundadır. Ortada eyer sırtı ve köşesindeki arka klinoid çıkıntı, onun önünde ve dışında küçük kanadın iç ucu olan ön klinoid çıkıntı görülür. Kanatlar iki yana açılır; aşağıda pterigoid çıkıntının iç levhası, ucundaki çengel ve büyük kanadın arka ucundaki kama dikeni vardır. İç ve dış levha arasında arkaya açılan V biçimli çukur pterigoid çukurdur.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'arka',
        goster: ['kama-kemigi'],
        vurgula: ['kama-kemigi'],
        boya: [{ secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama }],
        noktalar: [
          { nokta: 'eyer-sirti' },
          { nokta: 'arka-klinoid-sol' },
          { nokta: 'on-klinoid-sol' },
          { nokta: 'kucuk-kanat-sol' },
          { nokta: 'pterigoid-ic-levha-sol' },
          { nokta: 'pterigoid-cengel-sol' },
          { nokta: 'kama-dikeni-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kafatası tabanında kama kemiği: alttan bakış',
      aciklama:
        'Kafatasına alttan bakıyoruz; alt çene, dil kemiği ve boyun omurları gizlendi. Görüntünün üstü yüz tarafıdır; ekranın sağı hastanın soludur, işaretler de bu yandadır. Kırmızı kama kemiği tabanın ortasında, önde pembe üst çenenin yaptığı sert damak ile arkada mor art kafa kemiği arasında durur; iki yanda yeşil şakak kemikleri vardır. Pterigoid çıkıntılar sert damağın arka kenarının iki yanından aşağı sarkar; iki iç levha arasındaki açıklıklar koanalar, ortadaki ince bej bölme sapan kemiğidir. Gövdenin alt yüzü burun-yutağın tavanına bakar. Oval delik ve kama dikeni büyük kanadın alt yüzündedir. Dikenli delik ve pterigoid kanal modelde yoktur.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'alt',
        gizle: ['alt-cene-kemigi', 'dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
          { secici: ['sapan-kemigi'], renk: KEMIK_RENGI.kucukYuz },
        ],
        etiketler: [{ yapi: 'sapan-kemigi', metin: 'Sapan kemiği (vomer)' }],
        noktalar: [
          { nokta: 'kama-govdesi', metin: 'Kama gövdesi (alt yüz)' },
          { nokta: 'pterigoid-ic-levha-sol' },
          { nokta: 'oval-delik-sol' },
          { nokta: 'kama-dikeni-sol' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kama kemiğinin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        [
          'Türk eyeri, hipofiz çukuru',
          '*Sella turcica; fossa hypophysialis*',
          'Gövdenin üst yüzü, orta kafa çukurunun ortası',
          'Hipofiz bezi',
        ],
        ['Eyer tümseği', '*Tuberculum sellae*', 'Kiazma öncesi oluğun arkası', 'Eyerin ön kabartısı'],
        ['Eyer sırtı', '*Dorsum sellae*', 'Eyerin arka duvarı', 'Üst köşeleri arka klinoidler; yanında abdusens çentiği'],
        ['Ön klinoid çıkıntı', '*Processus clinoideus anterior*', 'Küçük kanadın arka kenarının iç ucu', 'Tentorium cerebelli (Gray)'],
        [
          'Orta klinoid çıkıntı',
          '*Processus clinoideus medius*',
          'Eyerin ön-yan köşesi; her kafatasında yok',
          'Diaphragma sellae (güncel derleme)',
        ],
        ['Arka klinoid çıkıntı', '*Processus clinoideus posterior*', 'Eyer sırtının üst köşeleri', 'Tentorium cerebelli'],
        ['Karotis oluğu', '*Sulcus caroticus*', 'Gövdenin yanı, büyük kanat kökünün üstü', 'İç karotis arter, kavernöz sinüs'],
        [
          'Kama kristası ve gagası',
          '*Crista sphenoidalis; rostrum sphenoidale*',
          'Gövdenin ön ve alt yüzünde orta hat',
          'Kalbur kemiğinin dik levhası; sapan kemiğinin kanatları',
        ],
        ['Optik kanal', '*Canalis opticus*', 'Küçük kanadın iki kökü arası', 'Görme siniri, oftalmik arter'],
        [
          'Üst orbital yarık',
          '*Fissura orbitalis superior*',
          'Küçük ve büyük kanat arası',
          'Göz kaslarının sinirleri, oftalmik sinirin dalları, oftalmik ven (3. ders)',
        ],
        ['Yuvarlak delik', '*Foramen rotundum*', 'Büyük kanadın ön-iç kısmı; pterigopalatin çukura açılır', 'Maksiller sinir (V2)'],
        [
          'Oval delik',
          '*Foramen ovale*',
          'Yuvarlak deliğin arka-dışı; infratemporal çukura açılır',
          'Mandibular sinir (V3), aksesuar meningeal arter; bazen küçük petrozal sinir',
        ],
        [
          'Dikenli delik',
          '*Foramen spinosum*',
          'Büyük kanadın arka açısı, dikenin önü; bazen çift',
          'Orta meningeal damarlar, V3’ün geri dönen dalı',
        ],
        ['Vesalius deliği', '*Foramen venosum*', 'Oval deliğin iç yanı; her kafatasında yok', 'Kavernöz sinüsten gelen küçük emisser ven'],
        [
          'Kama dikeni',
          '*Spina ossis sphenoidalis*',
          'Büyük kanadın arka ucu',
          'Sfenomandibular bağ, tensor veli palatini; iç yüzünde korda timpani oluğu',
        ],
        ['İnfratemporal krista', '*Crista infratemporalis*', 'Büyük kanadın dış yüzü', 'Lateral pterigoid kas'],
        [
          'Dış pterigoid levha',
          '*Lamina lateralis*',
          'Pterigoid çıkıntının dış kısmı',
          'Dış yüzüne lateral, iç yüzüne medial pterigoid kas',
        ],
        [
          'İç pterigoid levha ve çengel',
          '*Lamina medialis; hamulus pterygoideus*',
          'Koananın dış sınırı; alt ucu çengel',
          'Çengelin çevresinde tensor veli palatini tendonu kayar; arka kenara farinks aponörozu tutunur',
        ],
        ['Pterigoid çukur', '*Fossa pterygoidea*', 'İki levha arası, arkaya açık', 'Medial pterigoid kas, tensor veli palatini'],
        ['Skafoid çukur', '*Fossa scaphoidea*', 'Pterigoid çukurun üstü', 'Tensor veli palatini başlangıcı'],
        [
          'Pterigoid (vidian) kanal',
          '*Canalis pterygoideus*',
          'Pterigoid çıkıntının kökü; foramen lacerumdan pterigopalatin çukura',
          'Vidian siniri ve arteri',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FCAT (1998); Triantafyllou ve Piagkou (2025). Dikenli delik, Vesalius deliği ve pterigoid kanal üç boyutlu modelde yoktur; optik kanal modelde üst orbital yarıkla birleşik görünür.',
    },

    // ——— Kanatlar ve delikler: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Optik payanda ve ön klinoid.** Optik kanalın alt-dış sınırı **optik payandadır** (İngilizce cerrahi terim *optic strut*; Türkçe ad açıklayıcı bir karşılıktır): küçük kanadın arka köküdür ve kanalı üst orbital yarıktan ayırır; kanalın dışında ön klinoid bulunur (Engin ve ark., 2021). Terimin TA98’de Latince bir karşılığı yoktur. Bir kaynak payandayı kanalın alt-iç sınırı olarak anlatır (Coroleucă ve ark., 2024); Gray ise yalnızca kanalın küçük kanadın iki kökü arasında olduğunu söyler (Gray, 1918). Payandanın yapışma yeri üç tiptir: **presulkal** (limbusla hizada ya da önünde), **sulkal** (kiazma öncesi oluğun ön 2/3’üne yapışır) ve **postsulkal** (oluğun arka 2/3’üne yapışır). Necmettin Erbakan Üniversitesi’nde 154 hastanın BT’sinde presulkal %6,9, sulkal %57,5, postsulkal %35,6 bulundu; ön klinoid havalanması optik kanal kabarıklığı ve sulkal ya da postsulkal payandayla birlikteydi. Aynı çalışmada yaşla optik kanal çapları ve eyer boyutları artıyor, optik kanal ve ön klinoid uzunlukları kısalıyordu (İlgin ve ark., 2025).

Güncel bir derlemenin aktardığına göre Mikami ve arkadaşlarının BT çalışmasında ön klinoid havalanması bireylerin %9,2’sinde vardı; havalanmaların %81,8’i sfenoid sinüsten, %10,9’u etmoid sinüsten, %7,3’ü ikisinden kaynaklanıyordu; yol olarak %74,5’i optik payandadan (tip I), %14,5’i ön kökten (tip II), %10,9’u ikisinden (tip III) geçiyordu. Rennert ve arkadaşlarına göre ön klinoid bebeklikten erişkinliğe %49 uzar ve 11 yaşından önce havalanma görülmez (Triantafyllou ve Piagkou, 2025). Bir sistematik derlemede ön klinoid havalanması tek taraflı yaklaşık %10, çift taraflı %9, olağan %72 bulunmuştur (Engin ve ark., 2021); literatürdeki aralık %5–24,1 (Famurewa ve ark., 2018) ile %4–40’a yakın (Kaewborisutsakul ve ark., 2026) arasındadır. Tayland’da 400 ön klinoidin %30,8’i havalıydı; hastaların %5’inde iki taraflıydı ve en sık alt tip yalnızca optik payandanın havalanmasıydı (%16); ön klinoidin taban genişliği erkeklerde 9,09, kadınlarda 8,54 mm idi (Kaewborisutsakul ve ark., 2026). Kadınlarda havalı petröz apeks ile havalı ön klinoid birlikte görülme eğilimindedir (Gibelli ve ark., 2021). Havalanmanın derecesi ya da sinüsle bağlantısı, ön klinoidektomiden sonra burundan BOS gelmesi (rinore) ve görme siniri yaralanması riskini artırır (İlgin ve ark., 2025; Kaewborisutsakul ve ark., 2026).

**Optik kanal ve üst orbital yarık.** 60 kuru kafatasının (120 göz çukuru) lazerle taranmasında optik kanalın göz çukuruna açılan ağzının (optik delik) yüksekliği erkeklerde 8,27, kadınlarda 8,13 mm, genişliği 6,34 ve 5,83 mm; üst orbital yarığın uzunluğu erkeklerde 21,09, kadınlarda 17,58 mm idi. Optik kanalın kafa içi ağzını üstte falsiform kıvrım, dışta ön klinoid sınırlar (Coroleucă ve ark., 2024). Optik kanal göz çukurlarının %0,64–2,98’inde ikizdir; ikiz kanalda alttaki kanal oftalmik arteri, üstteki görme sinirini taşır; kanal tabanının oluklu olduğu “anahtar deliği” anomalisi %1,64–2,65 sıklıktadır (Engin ve ark., 2021). Aksesuar optik kanal tipik olarak ana kanalın alt-dışındadır ve oftalmik arteri taşır (Triantafyllou ve Piagkou, 2025). Üç boyutlu BT ile incelenen 400 üst orbital yarıkta yedi biçim tanımlandı; en sık raket biçimli, en seyrek dar tip (Triantafyllou ve Piagkou, 2025). Yarığın en alt kısmının enine bir kemik köprüyle ana yarıktan ayrıldığı **Warwick deliği** Bertelli ve Regoli’nin serisinde olguların %0,61–0,74’ünde, bütün kafataslarında tek taraflı bulundu; oftalmik arter olguların %5–6’sında göz çukuruna üst orbital yarıktan girer (Engin ve ark., 2021). Gray göz çukurunun tepesini optik kanala yerleştirmeyi yeğler, çünkü göz kasları onun çevresinden başlar; bazı anatomistler tepeyi üst orbital yarığın iç ucuna koyar (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Delik çeşitlilikleri.** Vesalius deliğinin (*foramen venosum*) sıklığı kaynağa göre değişir: Piagkou ve arkadaşlarının meta-analizi toplumun yaklaşık %33’ünde bulunduğunu tahmin eder (Triantafyllou ve Piagkou, 2025); genel bakış dersinde aktarılan konik ışınlı BT meta-analizi daha yüksek bir oran vermiştir. Çok daha seyrek olan **aksesuar sfenoid delik** orta kafa çukurunda yuvarlak deliğin arkasında, oval deliğin önünde açılır ve kafataslarının %0,6’sında bildirilmiştir. Iwanaga ve arkadaşları 80 kafatasının 160 tarafında oval delik ile dış pterigoid levhanın kökü arasında dört ilişki tipi tanımladı; trigeminal nevraljideki deri yoluyla (perkütan) girişimler için önemli bu ilişkide tip IV’te (%21) delik levhadan kopuktur ve erişim zorlaşır (Triantafyllou ve Piagkou, 2025). Açar ve arkadaşlarının serisinde iki hastada tek taraflı yuvarlak delik yoktu (Açar ve ark., 2019). Küçük petrozal sinir bazen dikenli deliğin iç yanındaki ayrı bir kanalcıktan, Arnold’un *canaliculus innominatus*’undan geçer (Gray, 1918); TA98 kama kemiği altında ayrıca *foramen petrosum* adını listeler (FCAT, 1998), ama bu adın Arnold kanalcığıyla aynı yapı olup olmadığı burada kullanılan kaynaklarla doğrulanamadı. Delikler, gelişim sırasında sinir ve damarların çevresinde kemik çıkıntıların kaynaşmasıyla oluşur (Triantafyllou ve Piagkou, 2025).

**Kemikleşen bağlar.** Pekala ve arkadaşlarının meta-analizinde pterigoalar bağın tam kemikleşmesi %4,4, eksik kemikleşmesi %8,4 bulunmuştur; Meckel kıkırdağının kalıntısı olan sfenomandibular bağ ise pterigoalar ve pterigospinöz bağlar gibi kemik bir çubuğa dönüşmez (Triantafyllou ve Piagkou, 2025).

**Pterigoid levhalar.** Gray iç levhanın dış levhadan dar ve uzun olduğunu yazar (Gray, 1918). Suudi Arabistan’ın Asir bölgesinden (Abha) 50 erişkinin konik ışınlı BT’sinde ise dış levha (sağ 14,61, sol 13,83 mm) iç levhadan (sağ 11,27, sol 11,98 mm) uzundu; levha kalınlığı yaklaşık 1,33–1,46 mm idi (Alkahtani ve ark., 2026). Ölçüm noktaları farklı olabilir; yine de bu fark ders kitabı tarifini olduğu gibi almamak için bir uyarıdır.`,
    },

    // ——— Pterigoid çıkıntılar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Pterigoid çıkıntılar.** Gövde ile büyük kanatların birleştiği yerden dik iner; her biri bir iç (medial) ve bir dış (lateral) levhadan oluşur ve levhaların üst kısımları önde kaynaşıktır. Aşağıda levhaları açılı bir yarık, **pterigoid çentik** (*incisura pterygoidea*; Gray’de *pterygoid fissure*) ayırır; çentiğin kenarlarına damak kemiğinin piramidal çıkıntısı oturur. Arkada iki levha birbirinden uzaklaşarak V biçimli **pterigoid çukuru** sarar; çukurda medial pterigoid kas ve tensor veli palatini bulunur. Çukurun üstündeki sığ, oval **skafoid çukurdan** tensor veli palatini başlar (Gray, 1918).

**Dış levha** geniş, ince ve dışa dönüktür: dış yüzü infratemporal çukurun iç duvarına katılır ve lateral pterigoid kasa, iç yüzü medial pterigoid kasa tutunma yeri verir. **İç levha** daha dar ve uzundur; iç yüzü koananın dış sınırıdır ve alt ucu çengel biçimli **pterigoid çengelde** (*hamulus pterygoideus*) biter; tensor veli palatini kasının tendonu çengelin çevresinde kayar. Farinks aponörozu iç levhanın arka kenarı boyunca tutunur ve üst farinks büzücü kası bu kenarın alt üçte birinden başlar; arka kenarın ortasındaki **tuba çıkıntısı** (*processus tubarius*) östaki borusunun farinks ucunu destekler. Kafatasının alt yüzünde büyük kanat ile şakak kemiğinin kayalık kısmı arasındaki olukta (*sulcus tubae auditivae*) östaki borusunun kıkırdak kısmı yatar (Gray, 1918; FCAT, 1998).

Çıkıntının kökünde **pterigoid (vidian) kanal** (*canalis pterygoideus*) bulunur: foramen lacerumu pterigopalatin çukura bağlar ve vidian siniri ile ona eşlik eden arteri taşır (Gray, 1918; Triantafyllou ve Piagkou, 2025). Vidian siniri derin petrozal (sempatik) ve büyük petrozal (parasempatik) sinirlerin birleşmesiyle oluşur (Açar ve ark., 2019). Pterigopalatin çukurun arka duvarında yukarıdan aşağıya ve içe doğru üç açıklık sıralanır: yuvarlak delik, pterigoid kanal ve farinks kanalı (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Optik kanal** küçük kanadın iki kökü arasındadır; **üst orbital yarık** küçük ve büyük kanat arasındadır. **Yuvarlak delik** pterigopalatin çukura, **oval** ve **dikenli delikler** infratemporal çukurun tavanına açılır (Gray, 1918).
- **Pterigopalatin çukurun arka duvarı** (yukarıdan aşağıya): yuvarlak delik → pterigoid kanal → farinks kanalı (Gray, 1918).
- **Sfenoid sinüs** sfenoetmoidal girintiye açılır; bu girinti üst kavkanın üstünde ve arkasındadır. Maksiller, frontal ve ön etmoid sinüsler ise orta burun yoluna açılır (Gray, 1918; Güngör ve ark., 2016).
- **İki pterigoid kas da dış levhaya tutunur:** lateral pterigoid dış yüzüne, medial pterigoid iç yüzüne. **Pterigoid çengel** iç levhanın ucudur; tensor veli palatini tendonu çevresinde kayar (Gray, 1918).
- **Ön klinoid** küçük kanadın iç ucu, **arka klinoid** eyer sırtının köşesidir; orta klinoid her zaman yoktur (Gray, 1918; Triantafyllou ve Piagkou, 2025).
- **Eklemler:** kama kemiği 12 kemikle eklem yapar; tek olanlar sapan, kalbur, alın, art kafa; çift olanlar yan kafa, şakak, elmacık, damak (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Vidian kanal: ölçüler ve ters numaralanan iki şema',
      md: `Açar ve arkadaşlarının 250 hastalık BT çalışmasında (500 kanal) kanal %55,6 oranında gövdenin içinde (tip 1), %34,8 oranında kısmen sinüse çıkıntılı (tip 2), %9,6 oranında bir sapla sinüsün içinde (tip 3) idi; pterigoid çıkıntı havalanması tip 2’de %72,4, tip 3’te %95,8 oranında vardı (Açar ve ark., 2019).

**Dikkat:** Yegin sınıflamasında numaralar terstir: orada tip 1 tamamen sinüs içindeki kanaldır ve en sık tiptir. Yegin kanalı ayrıca sinüs tabanına göre (tabanda, tabanın üstünde, altında ya da V biçimli bir çukurda) dört tipe ayırır; 594 hastalık çalışmasında “tip 1” yaklaşık %33–36 oranında bulunmuştur, ama aktaran metin bu oranın hangi şemaya ait olduğunu açık yazmaz. Aynı çalışmada kanalın kemik tavanı %22,2–26,6 oranında dehisentti ve solda daha sıktı (Triantafyllou ve Piagkou, 2025). Bu yüzden raporlarda tip numarası yerine kanalın yerini tarif etmek daha güvenlidir.

**Ölçüler** (Açar ve ark., 2019): kanalın orta kısmının çapı 1,0 mm, ön ağzı 1,9 mm, arka ağzı 1,6 mm; uzunluğu 12,9 mm; yuvarlak deliğe uzaklığı 8,1 mm; vomer kristasına uzaklığı 13,6 mm, vomer kristası ile palatovaginal kanal arası 5,9 mm. Kanal çoğunlukla (%82) iç pterigoid levhanın iç yanında ya da hizasındaydı; palatovaginal kanal koronal BT kesitlerinin %74,4’ünde seçilebildi.`,
    },

    // ——— Eklemler ve kemikleşme: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Eklemler.** Gray kama kemiğinin 12 kemikle eklem yaptığını yazar: tek olanlar sapan, kalbur, alın ve art kafa kemikleri; çift olanlar yan kafa, şakak, elmacık ve damak kemikleri. Bir dipnotta bazen üst çenenin tüberositasıyla da eklem yaptığını ekler (Gray, 1918). StatPearls özetinde 8 kemik adı sayılır (Jamil ve Callahan, 2023); güncel bir gelişim derlemesi ise üst çeneyi olağan eklemler arasında sayar (Triantafyllou ve Piagkou, 2025). Ön kafa çukurunu sfenoetmoidal ve sfenofrontal, orta kafa çukurunu sfenoparietal, sfenoskuamozal ve sfenopetrozal dikişler kateder; göz çukurunun dış duvarında elmacık kemiği ile büyük kanat sfenozigomatik dikişle birleşir (Gray, 1918). Gövdenin ön yüzünün tırtıllı yan kenarı kalbur kemiğinin lamina papyracea’sıyla eklem yaparak arka etmoid hücrelerini tamamlar; alt kenarı damak kemiğinin göz çukuru çıkıntısıyla, üst kenarı alın kemiğinin göz çukuru levhasıyla birleşir (Gray, 1918).

**Kemikleşme.** Kama kemiğinin büyük kısmı kıkırdak içinde kemikleşir; toplam 14 merkez vardır: 6’sı presfenoid, 8’i postsfenoid için (Gray, 1918). Fetal 7.–8. aya kadar gövde iki parçadır: eyer tümseğinin önündeki **presfenoid** küçük kanatları taşır; arkadaki **postsfenoid** eyeri, eyer sırtını, büyük kanatları ve pterigoid çıkıntıları taşır (Gray, 1918). Güncel bir derlemeye göre kemik basisfenoid, orbitosfenoid, ala temporalis ve alar çıkıntı gibi birçok kıkırdak öncülden gelişir (Triantafyllou ve Piagkou, 2025). Hangi kısımların zar içinde kemikleştiği tartışmalıdır: Gray, Fawcett’e dayanarak büyük kanadın göz çukuru plağının, temporal çukurdaki kısmının ve dış pterigoid levhanın zarda kemikleştiğini yazar (Gray, 1918); bir başka kaynağa göre yalnızca iç pterigoid levha zar içi kemikleşmeyle oluşur (Tomaszewska ve ark., 2015); güncel derleme ise zar içi kemikleşmeyi nöral krest kökenli mezenşimden gelen bölgelere, özellikle büyük kanatların yan kısımlarına ve pterigoid çıkıntılara bağlar (Triantafyllou ve Piagkou, 2025).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kama kemiğinin kemikleşme takvimi',
      sutunlar: ['Ne zaman?', 'Ne olur?'],
      satirlar: [
        ['Gebeliğin 3. ayı', 'Burun mukozası kıkırdak burun kapsülünün arkasına çöker: sfenoid sinüsün başlangıcı (Lee ve ark., 2022)'],
        ['8. hafta', 'İlk merkezler: büyük kanatlarda, yuvarlak ile oval delik arasında (Gray, 1918)'],
        ['9. hafta', 'Küçük kanat merkezleri optik kanalın hemen dışında belirir (Gray, 1918)'],
        [
          '9.–10. hafta',
          'İç pterigoid levha (çengel hariç) zarda kemikleşmeye başlar; Mall’a göre merkez 57 günlük embriyoda görülür (Gray, 1918)',
        ],
        ['3. ay', 'Pterigoid çengel kıkırdaklaşır ve hemen kemikleşmeye başlar (Fawcett; Gray, 1918)'],
        ['~4. ay', 'Dilcik (lingula) merkezleri belirir ve hızla kemiğe katılır (Gray, 1918)'],
        ['5. ay', 'Sfenoid kavka merkezleri belirir; sinüsün ön-yan duvarları kemikleşir (Gray, 1918; Lee ve ark., 2022)'],
        ['Fetal yaşamın ortası', 'Eyerin iki yanındaki postsfenoid gövde merkezleri kaynaşır (Gray, 1918)'],
        ['6. ay', 'İç pterigoid levha dış levhaya kaynaşır (Gray, 1918)'],
        ['8. ay', 'Presfenoid ile postsfenoid birleşir (Gray, 1918)'],
        ['Doğumda', 'Kemik üç parçadır: ortada gövde ve küçük kanatlar; iki yanda büyük kanat ve pterigoid çıkıntı (Gray, 1918)'],
        [
          'İlk yıl',
          'Büyük kanatlar gövdeyle birleşir; küçük kanatlar gövdenin üstünde ortada buluşarak kama boyunduruğunu yapar (Gray, 1918)',
        ],
        [
          '3. yıl; 4. yıl; 9–12 yaş',
          'Sfenoid kavkalar oyulup koni biçimini alır; önce etmoid labirentlerine, sonra kama kemiğine kaynaşır (Gray, 1918)',
        ],
        ['7–8 yaş', 'Kama–kalbur (sfenoetmoidal) sinkondrozu kaynaşır (Triantafyllou ve Piagkou, 2025)'],
        [
          'Ergenlik – 25 yaş',
          'Kama–art kafa (sfeno-oksipital) sinkondrozu önemli bir büyüme yeridir: Gray’e göre 18–25 yaşlar arasında yukarıdan aşağıya kemikleşir ve 25 yaşında kaynaşma tamamdır; güncel derlemeye göre tipik olarak ergenlikte kaynaşır (Gray, 1918; Triantafyllou ve Piagkou, 2025)',
        ],
      ],
      not: 'Gövdenin orta hattındaki intrasfenoidal sinkondroz doğumdan sonra kaynaşır (Triantafyllou ve Piagkou, 2025). Gray’in verdiği zamanlar 1918’in bilgisidir; güncel bir derlemenin tablosu iç ve dış pterigoid levhalar için 12–14. haftaları verir (Triantafyllou ve Piagkou, 2025).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kama kemiği ve klinik',
      md: `- **Sinüzitin yayılması:** Sfenoid sinüs görme sinirine, kavernöz sinüse ve hipofize komşu olduğu için sinüs iltihabı menenjite, kafa içi apseye ya da kavernöz sinüs trombozuna yayılabilir (Lee ve ark., 2022).
- **Yüzde ve burnun derininde ağrı:** Kemik örtüsü eksik (dehisent) maksiller sinirin iltihabı sfenoid sinüzitine bağlı olarak trigeminal nevralji gibi görünebilir; vidian siniri de burun boşluğunun derinlerine yansıyan ağrıyla seyreden “vidian nevraljisi” yapabilir (Hewaidi ve Omami, 2008).
- **Hipofize burundan giden yol:** Konkal ve hiç havalanmamış tipler transsfenoidal yaklaşım için elverişsizdir, çünkü kalın kemiğin delinmesi gerekir ve ameliyat uzar (Sethi ve ark., 2023).
- **Vidian nörektomi:** Dirençli kronik vazomotor rinitte vidian sinirinin kesilmesi burun mukozasının parasempatik (kolinerjik) uyarısını keser (Açar ve ark., 2019).
- **Zayıf hat:** Kama kemiğinin merkez ve yan parçaları doğumdan sonra kaynaşır; bu kaynaşma düzlemi kemik içinde direnci az bir hat oluşturur (Tomaszewska ve ark., 2015). Kırık türleri ünitenin 6. dersinde işlenir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Üçüncü kez menenjit geçiren çocuk',
      oyku: `6 yaşında bir kız çocuğu son iki yılda üçüncü kez bakteriyel menenjitle hastaneye yatırılıyor. Boyu yaşıtlarından belirgin kısa; endokrin değerlendirmede birden fazla hipofiz hormonunda eksiklik saptanmış. Kafa travması öyküsü yok, burnundan berrak akıntı da fark edilmemiş. İnce kesitli BT’de kama kemiği gövdesinin orta hattında, burun-yutak tavanından hipofiz çukuruna uzanan yaklaşık 6 mm genişliğinde düzgün kenarlı bir kemik kanal görülüyor.`,
      soru: 'Bu kanal nedir, gelişim sırasında neden oluşur ve tekrarlayan menenjit ile hormon eksikliğini nasıl açıklar?',
      cozum: `**Yapı:** Bu bir **kalıcı kraniofaringeal kanaldır** (*canalis craniopharyngeus*): burun-yutaktan hipofiz çukuruna uzanan doğumsal bir kemik kanal (Peron ve ark., 2021).

**Gelişim:** Kama gövdesi fetal 7.–8. aya kadar iki parçadır (Gray, 1918). Gray, presfenoid ile postsfenoid arasında bazen bu kanalın kalıntısının görüldüğünü ve erken fetal yaşamda ağız ektoderminden gelen hipofiz divertikülünün buradan geçtiğini yazar (Gray, 1918). Sellanın ön duvarı da Rathke cebiyle ilişkili olarak oluşur (Triantafyllou ve Piagkou, 2025). Kanal kapanmazsa bu fetal yol erişkinliğe kadar açık kalabilir.

**Menenjit:** Kanal burun-yutağı kafa içine bağladığı için mikroorganizmalar bu yoldan yükselip menenjite yol açabilir (Peron ve ark., 2021).

**Hormonlar:** Kalıcı kanal çoğul hipofiz hormon eksiklikleriyle birlikte görülebilir (Peron ve ark., 2021). Abele sınıflamasında hipofiz bozukluğu genellikle 3,5–4,4 mm (tip 2) ve 5,9–31 mm (tip 3) genişliğindeki kanallarla birliktedir; 0,7–1,1 mm’lik tip 1 kanallar rastlantısal bulunur (Lingappa ve ark., 2020). Bu çocuktaki yaklaşık 6 mm’lik kanal tip 3 aralığındadır. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kaynaşma düzlemleri, gizli kanallar ve kendiliğinden BOS kaçağı',
      md: `- **Kaynaşma düzlemleri iki yüzlüdür:** merkez ve yan parçaların kaynaşma düzlemi kemikte direnci az bir hat oluşturur (Tomaszewska ve ark., 2015); öte yandan kaynaşma düzlemleri havalanmaya direnç gösterir ve bu düzlemlerdeki kemik defektlerinin edinsel değil doğumsal olma olasılığı daha yüksektir (Bendersky ve ark., 2011).
- **Sternberg kanalı** (lateral kraniofaringeal kanal), büyük kanatların basisfenoidle eksik kaynaşmasından kalır (Bendersky ve ark., 2011). Tanıma göre kafa içinde gövde ile küçük kanadın arka kökü arasında başlar ve gövdenin yanından burun-yutağa iner. İlk kez Cruveilhier (1877), 11 yıl sonra Sternberg (1888) tanımladı; Sternberg kanalı 3–4 yaş çocuklarda hep gördü ve kemikleşmenin 10 yaşına kadar sürüp kanalı kapattığını yazdı (Tomaszewska ve ark., 2015).
- **Ne sıklıkta?** Erişkin kadavralarında açık kanal %0,42–6,1, sinüsle kafa içini birleştiremeyecek kadar küçük kalıntılar yarım sfenoidlerin %18,1–28,4’ünde bildirilmiştir; ama 1000 yüksek çözünürlüklü BT’de anatomik tanıma uyan yalnızca bir defekt bulunmuştur (Tomaszewska ve ark., 2015). Havalanma kanala ulaşınca orta kafa çukuru ile sinüs arasında bağlantı oluşur ve kanal BOS kaçağı, meningoensefalosel ya da menenjit kaynağı olabilir. Defektin V2’ye göre yeri (içinde mi dışında mı) tartışmalıdır (Tomaszewska ve ark., 2015).
- **Kendiliğinden kaçaklar:** 103 kendiliğinden BOS kaçağında defektin %19,4’ü sfenoid sinüsün yan duvarındaydı (Vinciguerra ve ark., 2024). Lateral girintideki araknoid çukurcuklar bu kaçaklar için güçlü bir adaydır (Bendersky ve ark., 2011). Sfenoid sinüsün yan girintisine uzanan temporal lob ensefaloseli bazal ensefalosellerin muhtemelen en seyrek tipidir (Bendersky ve ark., 2011).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Hipofiz ameliyatı öncesi BT',
      oyku: `48 yaşında bir kadında görme alanı daralmasına yol açan büyük bir hipofiz adenomu saptanmış; endoskopik endonazal transsfenoidal ameliyat planlanıyor. Paranazal BT’de sfenoid sinüs postseller tipte; havalanma ön klinoide, pterigoid çıkıntıya ve büyük kanada uzanıyor. Solda iç karotis arter ve görme siniri sinüs boşluğuna belirgin kabarıklık yapıyor; görme sinirinin üzerindeki kemik yer yer seçilemiyor. Sinüsü bölen ana bölme orta hatta değil; sola kayarak sol karotis kabarıklığının üzerinde sonlanıyor.`,
      soru: 'Bu BT’de hangi bulgular tehlike işaretidir ve sinüse girerken, bölmeyi alırken nelere dikkat edilmelidir?',
      cozum: `**Havalanma tipi:** Postseller tip ile ön klinoid, pterigoid çıkıntı ve büyük kanada birlikte uzanan yan havalanma (Açar sınıflamasında tip V), optik kanal, yuvarlak delik, vidian ve karotis kanalının kabarıklık ve dehisensinin en sık görüldüğü birleşimdir (Açar ve ark., 2024). Ön klinoid havalanması hem iç karotis hem görme siniri kabarıklığıyla ilişkilidir ve sinüsün yan duvarında, üstte optik kanal ile altta karotis kabarıklığı arasında optikokarotid girintiyi oluşturur (Hewaidi ve Omami, 2008). Bu tiplerde eyerin ön duvarı ve tabanı genellikle 1 mm’den incedir; klivus da incelebilir ve arka kafa çukuruna istenmeden girilebilir (Famurewa ve ark., 2018).

**Görme siniri:** Optik kanalın sinüse bakan kemiği ortalama yalnızca 0,3 mm’dir; belirgin kabarıklıkta dehisens %12’ye çıkar; olguların %1’inde, geniş bir lateral girinti yani iyi havalanmış bir ön klinoid varken, sinir sinüsün içinden kısmen “serbestçe” geçer (Hosemann ve Draf, 2013). Görme sinirinin çevresinin ≥%50’si sinüse açıksa yaralanma riski belirgin biçimde artar (Papadopoulos-Manolarakis ve ark., 2026).

**Bölme:** Karotis kabarıklığı üzerinde biten bir bölmeyi kırmak, kuvvet altta yatan artere ya da görme sinirine iletilebileceği için yüksek riskli bir harekettir (Bechev ve ark., 2026); bölmenin koparılması damarı yırtabilir (Famurewa ve ark., 2018). Arterin kemik kanalı ortalama 0,8 mm, belirgin kabarıklıkların üstünde 0,5 mm’dir (Hosemann ve Draf, 2013).

**Neden bu kadar önemli?** Hipofiz cerrahisinde karotis yaralanması yaklaşık %1 oranında bildirilir ve önemli karotis yaralanmalarında ölüm oranı yaklaşık %17’dir (Hosemann ve Draf, 2013). Ameliyat öncesi BT için önerilen “CLOSE” kontrol listesi kribriform levhayı, lamina papyracea’yı, Onodi hücresini, sfenoid havalanmasını ve ön etmoidal arteri tek tek gözden geçirmeyi hatırlatır (Tuysuz ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
