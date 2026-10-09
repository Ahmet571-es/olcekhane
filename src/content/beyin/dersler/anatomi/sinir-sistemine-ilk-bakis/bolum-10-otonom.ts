import type { DersBolumu } from '../../../types';

/** Otonom merkezlerin ve çıkış bölgelerinin renkleri (yalnızca tanıtır; otonom çizimlerindeki renklerle uyumlu). */
const MERKEZ_RENGI = '#a98cf6';
const PARASEMPATIK_RENGI = '#25a993';

/** 10. bölüm: otonom ve enterik sinir sistemi genel bakış düzeyinde: çıkışlar, gangliyonlar, haberciler, merkezî denetim, enterik sistem. */
export const otonomVeEnterik: DersBolumu = {
  id: 'otonom-ve-enterik',
  baslik: 'Otonom ve enterik sinir sistemi: bedenin istem dışı yönetimi',
  bloklar: [
    {
      tur: 'metin',
      md: `Kalbinin hızını, göz bebeğinin genişliğini ya da bağırsaklarının hareketini isteyerek değiştiremezsin; bunları **otonom sinir sistemi** yönetir. Otonom sistem bedenin istem dışı denetiminden, çoğunlukla da iç ortamın dengesinden (homeostaz) sorumludur; kalp kasını, düz kasları ve bezleri denetler (OpenStax 12.1; OpenStax 15.1).

İki kolu vardır: **sempatik** kol “savaş ya da kaç”, **parasempatik** kol “dinlen ve sindir” tepkisiyle anılır (OpenStax 15.1). Çoğu organ iki koldan da sinir alır ve organın o anki etkinliğini bu **çift sinirlenme** belirler: örneğin kalpte kollardan biri hızlandırır, öteki yavaşlatır (OpenStax 15.1).

Sempatik etkinlik arttığında göz bebekleri büyür, kalp hızı ve kan basıncı yükselir, mesane gevşer, karaciğer kana şeker (glukoz) verir ve kana adrenalin karışır (Spielman ve ark., 2020). Sindirim kanalında ise sempatik etkinlik salgıyı ve hareketi azaltır; parasempatik etkinlik bağırsak duvarındaki sinir ağını uyararak ikisini de artırır (OpenStax 23.1). Bağırsak duvarındaki bu ağ, **enterik sinir sistemi**, otonom sistemin üçüncü bölümü sayılır (Dafny, 2020).

Otonom işlevin merkezî denetiminin çoğu beyindeki **hipotalamustan** gelir (OpenStax 15.3). Komutlar beyin sapından ve omurilikten çıkan iki nöronlu yollarla organlara ulaşır (OpenStax 15.1; OpenStax 15.2); bu yolları lisans düzeyinde adım adım göreceğiz.`,
    },
    {
      tur: 'animasyon',
      ad: 'otonom-terazi',
      baslik: 'İki kol, altı organ',
      aciklama:
        'Düğmeyle kolu değiştir ve göz bebeğinde, tükürükte, hava yollarında, kalpte, sindirimde ve mesanede ne olduğunu izle. Çizim yalnızca genel yönü gösterir: organların çoğu iki koldan da sinir alır ve o anki durumları iki kolun dengesine bağlıdır.',
    },
    {
      tur: 'sahne',
      baslik: 'Otonom denetimin beyindeki merkezleri',
      aciklama:
        'Sağ yarımküre kaldırıldı; sol yarımküreye içeriden, orta hattan bakıyoruz. Ön taraf bu kez sağda. Mor renkli hipotalamus, otonom işlevin merkezî denetiminin çoğunu üstlenir. Yeşil renkli iki beyin sapı katı otonom denetimde öne çıkar: orta beyindeki Edinger–Westphal çekirdeğinin lifleri okülomotor sinirle göz bebeğine gider; omurilik soğanında solunumu, yutmayı, terlemeyi, mide salgısını, kalbi ve damar hareketlerini düzenleyen çekirdekler bulunur. Çekirdekler ve sinirler modelde ayrı yapı olarak yoktur; renkler yalnızca bölgeleri gösterir.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        boya: [
          { secici: ['hipotalamus'], renk: MERKEZ_RENGI },
          { secici: ['orta-beyin', 'omurilik-sogani'], renk: PARASEMPATIK_RENGI },
        ],
        etiketler: [
          { yapi: 'hipotalamus', metin: 'Hipotalamus' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'orta-beyin', metin: 'Orta beyin: Edinger–Westphal' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Otonom sistem** = istem dışı denetim: kalp kası, düz kas, bezler.\n\n**Sempatik:** “savaş ya da kaç”; göz bebeği büyür, kalp hızlanır, sindirim yavaşlar. **Parasempatik:** “dinlen ve sindir”; kalp yavaşlar, sindirim hızlanır. Çoğu organ iki koldan da sinir alır.\n\n**Enterik sistem:** bağırsak duvarının kendi sinir ağı. **Merkez:** denetimin çoğu hipotalamustan.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Kalp, otonom sistemden hiç sinyal almasaydı dakikada yaklaşık 100 kez atardı. Dinlenirken nabzın yaklaşık 70’te durmasının nedeni, parasempatik sistemin kalbi bu hızdan aşağı çekmesidir (OpenStax 15.3). Yani sakin otururken bile otonom sistem boş durmaz.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Eski kitaplarda “sempatik” başka bir anlama gelebilir',
      md: 'Gray’in 1918 baskısında bugünkü otonom sistemin tamamı “sempatik sinir sistemi” diye anılır: bütün düz kasları, bezleri ve kalp kasını sinirlendiren sistem (Gray, 1918). Aynı kitaptaki terim tablosu, Langley’nin bu sisteme “otonom”, kafa ve sağrı çıkışına “parasempatik” dediğini de gösterir (Gray, 1918). Bugün otonom sistem sempatik ve parasempatik kollardan ve enterik bölümden oluşur (Dafny, 2020). Eski bir metinde “sempatik” sözcüğünü görünce hangi anlamda kullanıldığına bak.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Çıkış düzeyleri.** Sempatik kolun preganglionik nöronları omuriliğin göğüs ve üst bel bölümlerindeki yan boynuzdadır; bu yüzden ona **torakolomber** sistem denir (OpenStax 13.4; OpenStax 15.1). Alt sınır kaynaklarda farklı verilir: Gray (1918) bir yerde T1’den L2–L3’e, başka bir yerde T1’den L1’e kadar der; TA2’nin notu bu hücre kolonunun, **intermediolateral çekirdeğin** (*nucleus intermediolateralis*), olağan uzanımını T1’den L1 ya da L2 bölümüne kadar verir (FIPAT, 2019). Pratikte “**T1–L2, kaynağa göre L1–L3**” demek doğru olur.

Parasempatik kolun preganglionik nöronları ise beyin sapı çekirdeklerinde ve sağrı omuriliğindedir; bu yüzden **kraniyosakral** sistem adını alır (OpenStax 15.1). Kafa çıkışı III, VII, IX ve X. kafa sinirleriyle, sağrı çıkışı S2, S3 ve S4 sinirleriyle olur (Dafny, 2020; Gray, 1918). TA2’deki resmî adlar *pars thoracolumbalis* ve *pars craniosacralis divisionis autonomicae*’dir (FIPAT, 2019).

**İki nöronlu zincir.** Otonom bir yanıtın çıkışı iki basamaklıdır (OpenStax 15.2). Gövdesi merkezî sistemde olan **preganglionik** nöronun lifi bir gangliyona gelir; oradaki **postganglionik** nöronun lifi organa gider. Sempatik gangliyonlar omurgaya yakın olduğundan sempatik preganglionik lifler kısa ve miyelinlidir. Parasempatik gangliyonlar ise hedef organın yanında, hatta duvarının içindedir (**intramural gangliyon**); bu yüzden parasempatik preganglionik lif uzun, postganglionik lif kısadır (OpenStax 15.1).

**Duyu tarafı.** Otonom yanıtları başlatan iç organ duyusu da çevresel sistemle gelir: bu duyu nöronlarının gövdeleri sempatik gangliyonlarda değil, duyu gangliyonlarında, yani bir kafa siniri gangliyonunda ya da arka kök gangliyonundadır (OpenStax 15.2).`,
    },
    {
      tur: 'animasyon',
      ad: 'otonom-cikis',
      duzey: 'lisans',
      baslik: 'Çıkış düzeyleri, gangliyonlar ve haberci maddeler',
      aciklama:
        'Solda preganglionik nöron gövdelerinin bulunduğu düzeyler, sağda iki nöronlu yol. Her sinapsta hangi habercinin salındığını izle; ter bezi ve böbrek üstü bezi istisnalarına da bak. Çizimdeki T1–L2 sınırı yaklaşıktır: kaynaklara göre sempatik çıkışın alt ucu L1 ile L3 arasında verilir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sempatik gangliyonlar.** Omurganın iki yanında, her birinde tipik olarak 23 gangliyon bulunan birer **sempatik gövde** (*truncus sympathicus*) uzanır: gangliyonların 3’ü boyun, 12’si göğüs, 4’ü bel, 4’ü sağrı bölgesine karşılık gelir (OpenStax 15.1). İki gövde aşağıda, kuyruk sokumunun önündeki tek bir gangliyonda, **ganglion impar**da birleşir (Gray, 1918). Omurganın önünde ise üç **prevertebral (kollateral) gangliyon** vardır: çölyak, üst mezenterik ve alt mezenterik gangliyon (OpenStax 15.1). Gray (1918) göğüste kalp ağını, karında solar (epigastrik) ağı, leğende hipogastrik ağı bu tür gangliyonlar taşıyan üç büyük ağ olarak anlatır.

**Bağlantı dalları.** Preganglionik lifler omurilik sinirinden sempatik gövdeye **beyaz bağlantı dallarıyla** girer; sempatik lifler omurilik sinirlerine **gri bağlantı dallarıyla** döner (Gray, 1918). Beyaz dallar miyelinli oldukları için beyazdır, gri dallar miyelinsiz aksonlardır (OpenStax 15.1). Her omurilik siniri bir gri dal alır, ama beyaz dalı her sinir vermez: yalnızca göğüs ve ilk bel sinirleri verir (Gray, 1918).

**Yaygın yanıt.** Tek bir sempatik preganglionik nöron 10–20 hedefe uzanabilir; sempatik yanıtın bedenin her yanına birden yayılabilmesinin bir nedeni budur (OpenStax 15.1).

**Böbrek üstü bezi.** Bazı preganglionik lifler gangliyona uğramadan doğrudan böbrek üstü bezinin iç kısmına, medullaya gider (OpenStax 15.1). Medulladaki **kromafin hücreleri**, sempatik gangliyonlarla birlikte sinir kabartısından (nöral krista) gelişen sinir-salgı hücreleridir; bu yüzden bez işlevce bir sempatik gangliyon sayılır (OpenStax 15.1). Sempatik gangliyon hücreleri de sinir kabartısından gelir (Gray, 1918).

**Parasempatik kafa çıkışı.** Orta beyindeki **Edinger–Westphal çekirdeği** okülomotor çekirdek kompleksinin parçasıdır; aksonları okülomotor sinirle ilerler ve siliyer gangliyon üzerinden iris kasına ulaşır (OpenStax 15.1). Vagusun arka çekirdeği ve nükleus ambiguustaki nöronlar vagus siniriyle göğüs ve karın boşluğundaki terminal gangliyonlara uzanır (OpenStax 15.1); vagus esas olarak göğüs ve üst karın boşluğundaki otonom gangliyonları hedefler (OpenStax 13.4).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sempatik gövde nereden geçer?',
      aciklama:
        'Omurgaya önden bakıyoruz; ekranın sağı hastanın solu. Sempatik gövde modelde yoktur: her iki yanda omurganın yanı boyunca uzanır. Etiketler, gövdenin hangi bölgede kaç gangliyon taşıdığını gösterir: boyunda 3, göğüste 12, belde 4, sağrı kemiğinin önünde 4. İki gövde aşağıda kuyruk sokumunun önündeki tek gangliyonda (ganglion impar) birleşir; kuyruk sokumu da modelde yoktur. Omurganın önündeki çölyak, üst mezenterik ve alt mezenterik gangliyonlar gösterilmedi.',
      sahne: {
        katmanlar: ['yuz', 'omurga'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['atlas', 'aksis', 'katman:omurga'],
        etiketler: [
          { yapi: 'boyun-omuru-5', metin: 'Boyun: 3 gangliyon' },
          { yapi: 'gogus-omuru-6', metin: 'Göğüs: 12 gangliyon' },
          { yapi: 'bel-omuru-3', metin: 'Bel: 4 gangliyon' },
          { yapi: 'sakrum', metin: 'Sağrı önü: 4 gangliyon' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sempatik ve parasempatik kol yan yana',
      sutunlar: ['Özellik', 'Sempatik', 'Parasempatik'],
      satirlar: [
        ['Diğer adı', 'Torakolomber sistem', 'Kraniyosakral sistem'],
        [
          'Preganglionik gövdeler',
          'Göğüs ve üst bel omuriliğinin yan boynuzu: T1–L2 (kaynağa göre L1–L3’e kadar)',
          'Beyin sapı çekirdekleri (III, VII, IX ve X ile çıkar) ve sağrı omuriliği (S2–S4)',
        ],
        [
          'Gangliyonlar',
          'Sempatik gövde (her yanda tipik olarak 23) ve prevertebral gangliyonlar (çölyak, üst ve alt mezenterik)',
          'Terminal gangliyonlar: hedefin yakınında ya da organ duvarında (intramural)',
        ],
        ['Lif uzunluğu', 'Preganglionik kısa ve miyelinli', 'Preganglionik uzun, postganglionik kısa'],
        [
          'Postganglionik haberci',
          'Çoğunlukla noradrenalin; ter bezleri ve iskelet kası damarlarına gidenler asetilkolin',
          'Asetilkolin; hedefte muskarinik almaçlar',
        ],
        [
          'Örnek etkiler',
          'Göz bebeği büyür; kalp hızı ve kan basıncı artar; mesane gevşer; karaciğer glukoz verir; sindirim salgısı ve hareketi azalır',
          'Kalbi dinlenme hızına (~70/dk) yavaşlatır; sindirim salgısını ve hareketini artırır',
        ],
      ],
      not: 'Kaynaklar: OpenStax 15.1, 15.3 ve 23.1; Gray (1918); FIPAT (2019); Dafny (2020); Spielman ve ark. (2020). Bütün preganglionik lifler, iki kolda da, asetilkolin salar (OpenStax 15.1).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Otonom sinapslarda haberci maddeler',
      sutunlar: ['Lif', 'Salınan haberci', 'Hedef ve almaç'],
      satirlar: [
        [
          'Bütün preganglionik lifler (sempatik ve parasempatik)',
          'Asetilkolin (ACh)',
          'Gangliyondaki postganglionik nöron; böbrek üstü medullası',
        ],
        ['Parasempatik postganglionik lifler', 'ACh', 'Organdaki muskarinik almaçlar'],
        ['Sempatik postganglionik liflerin çoğu', 'Noradrenalin', 'Adrenerjik almaçlar: α1, α2, β1, β2, β3'],
        ['Ter bezlerine ve iskelet kası damarlarına giden sempatik lifler', 'ACh', 'Ter bezi; iskelet kası damarları'],
        ['Böbrek üstü medullası', 'Adrenalin ve noradrenalin', 'Kana verilir; bu yüzden hormon sayılır'],
      ],
      not: 'Bir habercinin etkisi tümüyle onu karşılayan almaca bağlıdır (OpenStax 12.5). Kaynaklar: OpenStax 15.1; Spielman ve ark. (2020). Almaçların türleri ve ilaçlarla ilişkisi Hücreden Sinyale bölümünün “Alıcılar” dersinde.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'İç organ ağrısı ve yüksek omurilik yaralanması',
      md: `- **Yansıyan ağrı:** Güçlü iç organ duyuları vücut yüzeyinde başka bir yerde ağrı olarak hissedilebilir; örneğin kalpten gelen güçlü duyular sol omuzda ve sol kolda ağrı olarak duyulur (OpenStax 15.2). İç organ duyusunu taşıyan nöronların gövdeleri arka kök gangliyonlarında ya da kafa siniri gangliyonlarındadır (OpenStax 15.2).
- **Otonom disrefleksi:** Yüksek düzeyli bir omurilik yaralanmasından sonra hasarın altındaki zararlı bir uyaran (ör. dolu mesane ya da dışkı birikmesi) aşırı bir sempatik yanıt doğurur: damarlar daralır, kan basıncı yükselir ve kalp hızı düşer (Wulf ve Tom, 2023). Bu tablonun hangi düzeyin üstündeki yaralanmalarda görüldüğünü iki kaynak farklı verir. UTHealth kitabı “C6’nın üstü” der ve bu hastaların yaklaşık %85’inde otonom disrefleksi görüldüğünü yazar (Dougherty, 2020); omurilik yaralanmasının sempatik sisteme etkilerini inceleyen güncel bir derleme ise düzeyi T6 ve üstü olarak verir (Wulf ve Tom, 2023). %85 oranı UTHealth’in tanımladığı gruba aittir. C6’nın üstündeki bir yaralanmada sempatik çıkışın (T1–L2) tamamı, T6 düzeyindeki bir yaralanmada büyük kısmı hasarın altında kalır; yaralanma, buradaki sempatik preganglionik nöronlar üzerindeki üst merkezlerin düzenleyici denetimini bozar (Wulf ve Tom, 2023). Otonom ağda beyin sapı ile omurilik arasındaki döngüler hızlı ve kısa süreli düzenlemeden sorumludur (Dougherty, 2020).
- **Kalp hızı:** Otonom girdi olmasa kalp dakikada yaklaşık 100 kez atar; dinlenmedeki yaklaşık 70’lik hız parasempatik etkinin sonucudur (OpenStax 15.3).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sempatik = torakolomber:** T1–L2 (kaynağa göre L1–L3); yan boynuz, intermediolateral çekirdek. **Parasempatik = kraniyosakral:** III, VII, IX, X ve S2–S4.
- **Sempatik gövde:** her yanda ~23 gangliyon (3 C, 12 T, 4 L, 4 S); altta ganglion impar. **Prevertebral:** çölyak, üst ve alt mezenterik.
- **Beyaz dal** (miyelinli, preganglionik) göğüs ve ilk bel sinirlerinden; **gri dal** (miyelinsiz) her omurilik sinirine.
- **Haberciler:** bütün preganglionikler ACh; parasempatik postganglionik ACh → muskarinik; sempatik postganglionik noradrenalin → α1, α2, β1, β2, β3; ter bezi ve iskelet kası damarları ACh.
- **Böbrek üstü medullası:** preganglionik lif doğrudan; kromafin hücreler nöral kristadan.
- **Edinger–Westphal → III → siliyer gangliyon → iris.** Vagusun arka çekirdeği ve nükleus ambiguus → X.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Enterik sistemin yeri ve yapısı.** TA2 enterik ağı (*plexus entericus*) otonom bölümün iç organ kısmı altında sınıflar ve iki ana ağını ayrı terimlerle verir: kas katmanındaki **miyenterik ağ** (*plexus myentericus*, Auerbach ağı) ve mukoza altındaki **submukozal ağ** (*plexus submucosus*, Meissner ağı) (FIPAT, 2019; Fleming ve ark., 2020). Nöronlar binlerce küçük gangliyona dağılmıştır (Furness ve ark., 2014). Miyenterik ağ kasılmaların ritmini ve gücünü düzenler (OpenStax 23.1); yemek borusunun üst kısmından iç anal büzgene kadar kesintisiz uzanır. Submukozal ağ ise ince ve kalın bağırsakta vardır, mide ve yemek borusunda yoktur (Furness ve ark., 2014).

**Kaç nöron?** Güncel derlemeler 200–600 milyon (Furness ve ark., 2014), 400–600 milyon (Fleming ve ark., 2020) ya da 500 milyondan fazla (Schneider ve ark., 2019) nöron bildirir. Bir anatomi ders kitabındaki “yaklaşık 100 milyon” değeri (OpenStax 23.1) bu sayıların çok altında kalır ve kullanılmamalıdır. Sistemde 20’ye varan nöron türü vardır; enterik glia hücreleri nöronlardan 2–3 kat fazladır (Fleming ve ark., 2020).

**Kökeni ve bağımsızlığı.** Enterik sinir dokusu sinir kabartısından gelişir (OpenStax 13.1). Sistem otonom merkezlerden girdi alır, ama çalışmak için merkezî sinir sistemine gereksinim duymaz (OpenStax 13.4). Enterik sistemin gelişim bozukluğu aşağıdaki vakada.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Bağırsakta kaç nöron var? Kaynaklar ve karşılaştırma',
      sutunlar: ['Kaynak', 'Enterik nöron sayısı', 'Not'],
      satirlar: [
        ['OpenStax 23.1 (ders kitabı)', 'Yaklaşık 100 milyon', 'Güncel derlemelerin çok altında; eskimiş kabul edilmeli'],
        ['Furness ve ark. (2014)', '200–600 milyon', 'Binlerce küçük gangliyonda; çoğu miyenterik ve submukozal ağda'],
        ['Fleming ve ark. (2020)', '400–600 milyon', 'Bütün sempatik ve parasempatik gangliyonların toplamından fazla'],
        ['Schneider ve ark. (2019)', '500 milyondan fazla', 'Destek glia hücreleriyle birlikte'],
        [
          'Karşılaştırma: insan omuriliği (Bahney ve von Bartheld, 2018)',
          '197–222 milyon',
          'Enterik sistem omurilikteki kadar ya da daha fazla nöron içerir',
        ],
      ],
      not: 'UTHealth kitabı enterik sistemin omurilikten daha çok nöron içerdiğini yazar (Dafny, 2020); bir derleme ise “omurilikle benzer sayıda” der (Fleming ve ark., 2020). Alt sınır (200 milyon) omuriliğin sayısına yakın olduğu için güvenli ifade “omurilikteki kadar ya da daha fazla”dır.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Dışkılayamayan yenidoğan',
      oyku: 'Zamanında doğan bir erkek bebek ilk iki gün boyunca dışkılamıyor; karnı giderek şişiyor ve kusmaya başlıyor. Kalın bağırsağın son bölümünden alınan küçük bir doku örneğinde, bağırsak duvarının kas katmanında ve mukoza altında hiç sinir hücresi kümesi (gangliyon) görülmüyor.',
      soru: 'Bağırsağın bu kesimi neden içeriğini ilerletemiyor ve sorunun gelişimsel kaynağı nedir?',
      cozum: `**Eksik olan, bağırsağın kendi sinir sistemidir.** Bulgular **Hirschsprung hastalığına** uyar: bu hastalıkta miyenterik ve submukozal pleksuslar yoktur (aganglionoz); nedeni nöral krista hücrelerinin göçünün bozulmasıdır (Fleming ve ark., 2020). Enterik sinir dokusu nöral kristadan gelişir (OpenStax 13.1).

**Neden ilerlemiyor?** Kas katmanındaki miyenterik pleksus kasılmaların ritmini ve gücünü düzenler (OpenStax 23.1). İnce ve kalın bağırsakta enterik sistem duyu, ara ve motor nöronlarıyla tam refleks devreleri taşır (Furness ve ark., 2014); pleksusların bulunmadığı kesimde bu yerel devre yoktur.

**Ders:** Vagus ya da sempatik bağlantıların kesilmesi sindirim işlevini az etkiler (Furness ve ark., 2014), ama Hirschsprung gibi bazı enterik nöropatiler yaşamı tehdit edebilir (Furness, 2012). İnce ve kalın bağırsakta hareketin asıl yöneticisi duvarın içindeki enterik sistemdir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: '“İkinci beyin” mi?',
      md: `Sindirim kanalı, kendine ait bağımsız bir sinir sistemiyle evrilmiş tek iç organdır (Spencer ve Hu, 2020). Langley 20. yüzyılın başında enterik sistemi sempatik ve parasempatik bölümlerin yanında otonom sistemin üçüncü bölümü saydı (Fleming ve ark., 2020). Bayliss ve Starling 1899’da peristaltik refleksi ve sistemin MSS’den bağımsız çalışabildiğini ilk kez gösterdi (Fleming ve ark., 2020). Bir derlemeye göre enterik sistemdeki nöron ve glia çeşitliliği, nörotransmitterleri ve reseptörleri MSS’ye benzer; aynı derleme enterik sistemi başlığında “ikinci beyin” diye anar (Schneider ve ark., 2019). Benzetmenin sınırları aşağıdaki tabloda.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: '“İkinci beyin”in sınırları: sindirim kanalı boyunca denetim',
      sutunlar: ['Bölüm', 'Başlıca denetim', 'Kaynak'],
      satirlar: [
        ['Yemek borusu (çizgili kaslı kısım)', 'Hareketleri merkezî sistemdeki örüntü üreteçleri belirler', 'Furness ve ark. (2014)'],
        [
          'Mide',
          'Kasılma ve asit salgısı büyük ölçüde vagustan geçen vago-vagal reflekslerle merkezden denetlenir',
          'Furness ve ark. (2014)',
        ],
        [
          'İnce ve kalın bağırsak',
          'Enterik sistemin duyu, ara ve hareket nöronlarından oluşan tam refleks devreleri; vagusun götürücü (efferent) lif katkısı ince bağırsağın son kısmında ve kolonda görece küçük',
          'Furness ve ark. (2014); Fung ve Vanden Berghe (2020)',
        ],
        ['Dışkılama', 'Lumbosakral omurilikteki merkezler', 'Furness ve ark. (2014)'],
        [
          'Bütün kanal',
          'Vagus ya da sempatik bağlantıların kesilmesi işlevi az etkiler; bazı enterik nöropatiler (ör. Hirschsprung hastalığı) yaşamı tehdit edebilir',
          'Furness ve ark. (2014); Furness (2012)',
        ],
      ],
      not: 'Enterik sistemin ve merkezî sistemin payı kanal boyunca çok farklıdır (Furness, 2012) ve sindirim sonunda yerel enterik etkinlik ile merkezî sinir etkinliğinin birlikte işlemesine bağlıdır (Fung ve Vanden Berghe, 2020). Benzetme, bağırsakta düşünen ikinci bir beyin olduğu anlamına gelmez.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Merkezî otonom ağ ve tartışmalı sayılar',
      md: `**Hiyerarşi.** Otonom işlevin merkezî denetiminin çoğu hipotalamustan gelir (OpenStax 15.3). Merkezî otonom ağın en önemli hipotalamus çekirdeği **paraventriküler çekirdektir**; hipotalamusun bu ağdaki başlıca yolu **dorsal longitudinal fasikül**dür (Dougherty, 2020). Ağ hiyerarşiktir: beyin sapı ile omurilik arasındaki döngüler otonom sistemin hızlı ve kısa süreli düzenlemesinden sorumludur (Dougherty, 2020). **Soliter yol çekirdeği** (*nucleus tractus solitarii*) glossofaringeal ve vagus sinirlerinden kan basıncı ve kalp işlevi bilgisi alır (OpenStax 15.3). Hipotalamusun ayrıntısı Anatomi bölümünün “Hipotalamus, hipofiz ve epifiz” dersinde.

**Bağlantının biçimi.** Otonom postganglionik lifler hedeflerinde, somatik sinapslardaki gibi tek tek uç topuzları yapmaz; lif boyunca dizilmiş şişkinlikler (**varikozite**) taşır (OpenStax 15.1).

**Kullanılmayan bir sayı.** Bir kafa sinirleri derlemesinde vagusun iç organların parasempatik sinirlenmesinin yaklaşık %75’ini sağladığı yazılır (Libreros-Jiménez ve ark., 2024); bu sayının dayanağı gösterilmemiştir ve bu derste kullanılmadı. Vagus lifleri üzerine ölçülmüş sayılar bu dersin sinir dokusu bölümünde.

**Tanımı değişen bir sınır.** Prevertebral gangliyonları bir ders kitabı enterik sistemin parçası da sayar (OpenStax 15.1); TA2 ise onları otonom bölümün torakolomber (sempatik) kısmı altında listeler (FIPAT, 2019). Bir kaynak okurken hangi sınıflamanın kullanıldığına bakmak gerekir.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Otonom sistem hakkında eskimiş ve çelişen ifadeler',
      sutunlar: ['Konu', 'Kaynaktaki ifade', 'Bugünkü bilgi'],
      satirlar: [
        [
          'Sistemin adı',
          'Bütün otonom sistem “sempatik”; kafa ve sağrı çıkışı “kraniyosakral sempatikler” (Gray, 1918)',
          'Otonom sistem = sempatik + parasempatik (+ enterik) (Dafny, 2020); “otonom” ve “parasempatik” Langley’nin kullandığı terimlerdir (Gray, 1918)',
        ],
        ['S2–S4 çıkışı', 'S2–S4 sinirleri de “beyaz dal” verir (Gray, 1918)', 'Sağrı çıkışı parasempatiktir (OpenStax 15.1; FIPAT, 2019)'],
        [
          'İç organ duyu nöronları',
          'Gövdelerinin bir kısmı sempatik gangliyonlardadır (Gray, 1918)',
          'Gövdeler duyu gangliyonlarındadır: kafa siniri gangliyonu ya da arka kök gangliyonu (OpenStax 15.2)',
        ],
        [
          'Trakeaya giden sempatik lifler',
          'Gri bağlantı dallarıyla gider (OpenStax 15.1)',
          'Gri dallar sempatik lifleri omurilik sinirlerine taşır (Gray, 1918); iç organ dalları ayrıdır',
        ],
        [
          'Göz bebeği refleksleri',
          'Hipotalamus yönetir (OpenStax 15.3)',
          'Işık refleksinin merkezi orta beyindeki pretektal alandır (Dragoi, 2020b)',
        ],
        [
          'Enterik nöron sayısı',
          'Yaklaşık 100 milyon (OpenStax 23.1)',
          '200–600 milyon (Furness ve ark., 2014); 400–600 milyon (Fleming ve ark., 2020); 500 milyondan fazla (Schneider ve ark., 2019)',
        ],
        [
          'Sempatik çıkışın alt sınırı',
          'T1–L1, T1–L2 ya da T1–L3 (Gray, 1918’in farklı yerleri)',
          'Aralıkla verilmeli: T1–L2, kaynağa göre L1–L3 (FIPAT, 2019; OpenStax 15.1)',
        ],
      ],
      not: 'Bu ifadeler yanlış bilgi olarak öğretilmesin diye listelendi; derste her konuda sağ sütundaki bilgi kullanıldı. Gray (1918) kafa ve sağrı çıkışını, uyarılmalarının ilaçlarla benzer etkiler doğurması nedeniyle birlikte grupladığını da yazar: damardan çok küçük dozda verilen asetilkolin bu çıkışın uyarılmasını taklit eder.',
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Tek yanda küçük göz bebeği, düşük kapak, kuru yüz',
      oyku: `52 yaşında bir kadın, birkaç haftadır sağ göz kapağının hafifçe düştüğünü fark etmiş. Muayenede sağ göz bebeği soldakinden küçük. Sıcak bir odada yüzünün sol yarısı terlerken sağ yarısı kuru kalıyor. Görmesi ve göz hareketleri olağan.`,
      soru: 'Otonom sistemin hangi kolu bozulmuştur ve hasar, bu kolun anatomisine göre nerelerde olabilir?',
      cozum: `**Hangi kol?** Bulgular **Horner sendromunun** en sık bulgularıdır: aynı yanda göz bebeğinin küçülmesi (miyozis), göz kapağının düşmesi (pitoz) ve terlemenin azalması (anhidroz); UTHealth kitabı bunlara kızarmayı da ekler (Dougherty, 2020). Göz bebeğini büyüten sempatik etkidir (Spielman ve ark., 2020); ter bezlerine de sempatik postganglionik lifler gider ve bu lifler asetilkolin salar (OpenStax 15.1). Küçük göz bebeği ve kuru deri birlikte, sempatik etkinin eksildiğini gösterir. Karşılaştırma için: okülomotor sinirle giden parasempatik lifler (Edinger–Westphal → siliyer gangliyon → iris) bozulsaydı, eksilen göz bebeğini daraltan etki olurdu (OpenStax 15.1).

**Yol nerede?** Sempatik preganglionik nöronlar omuriliğin göğüs ve üst bel bölümlerinin yan boynuzundadır ve beyaz bağlantı dallarıyla sempatik gövdeye girer; beyaz dal yalnızca göğüs ve ilk bel sinirlerinden çıkar (OpenStax 15.1; Gray, 1918). Oysa gövdenin boyun bölümünde de üç gangliyon vardır (OpenStax 15.1). Bu, baş ve boyna giden sempatik liflerin üst göğüs omuriliğinden çıkıp gövde içinde yukarı doğru ilerlemesi gerektiği anlamına gelir. Hasar bu uzun zincirin herhangi bir halkasında olabilir: otonom çıkışı yöneten merkezî yollarda (Dougherty, 2020), üst göğüs omuriliğinde ve köklerinde, boyundaki sempatik gövdede ya da gangliyondan yüze ve göze giden postganglionik liflerde.

**Sonuç:** Bulgu tek bir noktayı değil bir zinciri düşündürür; hasarın yerini daraltmak için öteki bulgular ve görüntüleme gerekir. Göze giden sempatik yolun ayrıntısı Sistem Nörobilimi bölümünün otonom sinir sistemi dersinde. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
