import type { DersBolumu } from '../../../types';

/** Sahnede beyincik çadırının boyası (yalnızca tanıtır; anlam taşımaz). */
const CADIR = '#e8a33d';

/**
 * 05. bölüm: sert zarın atardamarları, sinirleri ve ağrı. Orta meningeal atardamar ve öteki meningeal atardamarlar,
 * varyasyonlar ve tehlikeli bağlantılar, sert zarın mikro damar düzeni, çadırın atardamarları; sinir dağılımı
 * (trigeminal dallar, Arnold siniri, spinosus siniri, vagus, hipoglossal iplikler, üst boyun sinirleri, sempatik lifler);
 * ağrı duyarlılığı (klasik görüş ve Fontaine 2018), yansıyan ağrı, trigeminovasküler sistem ve CGRP, trigeminokardiyak
 * refleks. Epidural kanamanın kliniği ve orta meningeal atardamar embolizasyonu "Kanamalar ve fıtıklaşmalar"
 * bölümünde. Bilgiler kaynak notlarından (S2/A, C, D).
 */
export const sertZarinDamarlariVeSinirleri: DersBolumu = {
  id: 'sert-zarin-damarlari-ve-sinirleri',
  baslik: 'Sert zarın atardamarları, sinirleri ve ağrı',
  bloklar: [
    // ——— Temel: atardamarlar ———
    {
      tur: 'metin',
      md: `Sert zar yalnızca sağlam bir kılıf değildir. Kendi atardamarları ve sinirleri olan canlı bir dokudur. Bugün kafatasının gelişimine, damar biyolojisine ve hastalık süreçlerine katılan bir doku olarak görülür (Ishikawa ve ark., 2026). Bu bölümde sert zarı neyin beslediğini, hangi sinirlerin ona duyu verdiğini ve baş ağrısıyla bağını göreceğiz.

**Atardamarlar.** Sert zarı her yanda üç meningeal atardamar besler: ön, orta ve arka. Bu atardamarlar toplardamarlarıyla birlikte sert zarın dış yüzünde, yani kemiğe bakan tarafta uzanır (Joost ve ark., 2026). İlk dersin Lisans düzeyinde bu üç atardamarın adı kısaca geçmişti. Sert zarın kanı çoğunlukla boyundaki **dış karotis atardamarının** dallarından gelir (Chirica ve ark., 2026).

En büyüğü **orta meningeal atardamardır** (*arteria meningea media*) (Gray, 1918). Kafatasının dışında, üst çene atardamarından (maksiller atardamar) çıkar. Kafatasına, tabandaki küçük bir delikten girer: **dikensi delik** (*foramen spinosum*) (Gray, 1918). İçeride öne ve yana doğru ilerler, sonra ön ve arka dallara ayrılır. Ön dal daha büyüktür (Gray, 1918). Kafatasının iç yüzünde bu atardamarın açtığı bir oluk vardır. TA2 ona *sulcus arteriae meningeae mediae* der (FIPAT, 2019).

**Pterion: atardamarın en açık olduğu yer.** Şakakta, kafatası kemiklerinin buluştuğu küçük bir bölge vardır: **pterion**. Onu ikinci derste tanıdık. Orta meningeal atardamar en sık burada yırtılır. Yırtılınca kan kemik ile sert zar arasında toplanır. Buna **epidural kanama** denir (Natali ve ark., 2024). Ayrıntısı “Kanamalar ve fıtıklaşmalar” bölümünde.`,
    },
    {
      tur: 'sahne',
      baslik: 'Şakakta: pterion ve orta meningeal atardamarın oluğu',
      aciklama:
        'Sol yandan bakıyoruz; ön taraf solda. Kafatası yarı saydam. Beyin loblara göre boyandı: mavi alın lobu, sarı yan kafa lobu, yeşil şakak lobu, pembe art kafa lobu. Orta meningeal atardamar modelde yoktur. Yerini iki nokta gösterir: şakaktaki pterion ve yan kafa kemiğinin iç yüzündeki atardamar oluğu. Atardamar sert zarın kemiğe bakan yüzünde, bu oluğun içinde uzanır.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'sap'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        bakis: 'sol',
        etiketler: [{ yapi: 'orta-temporal-girus-sol', metin: 'Şakak lobu' }],
        noktalar: [
          { nokta: 'yan-kafa-kama-kosesi-sol', metin: 'Pterion' },
          { nokta: 'orta-meninks-oluk-sol', metin: 'Orta meningeal atardamar oluğu' },
          { nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' },
          { nokta: 'dis-kulak-yolu-sol', metin: 'Dış kulak yolu' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Temel: sinirler ve ağrı ———
    {
      tur: 'metin',
      md: `**Sinirler.** Sert zar iki tür sinir lifi alır: duyu lifleri ve sempatik lifler (Ishikawa ve ark., 2026). Sempatik lifler, istemimiz dışında çalışan otonom sinir sisteminin bir koludur. Çoğunlukla damarlara ve sinüslere eşlik eder. Damarların genişliğini ayarlıyor olabilirler (Ishikawa ve ark., 2026). Duyu lifleri ise kafa içi basınç değişikliklerini ve zarar veren uyaranları algılar. Ağrı sinyalini beyne taşır (Ishikawa ve ark., 2026).

Yüzden ve sert zardan gelen dokunma, ağrı ve sıcaklık bilgisini dört kafa siniri taşır. Bunların başında **trigeminal sinir** (üçüz sinir; *nervus trigeminus*) gelir (Byrne ve Dafny, 2026). Trigeminal sinirin üç dalı vardır: göz dalı (V1), üst çene dalı (V2) ve alt çene dalı (V3). Üçü de sert zara dal verir (Ishikawa ve ark., 2026). Kafatası tabanının arka bölmesine **arka kafa çukuru** denir. Buradaki sert zara ise başka sinirler duyu verir. **Vagus siniri** ve boynun üst üç omurilik siniri (C1–C3) bunların başındadır (Gray, 1918; Ishikawa ve ark., 2026).

**Beyin ağrı duymaz, zarı duyar.** Bazı beyin ameliyatları hasta uyanıkken yapılır. Bu hastalarda sert zarın damarları elektrikle ya da dokunarak uyarılınca baş ağrısı duyuldu. Beynin yüzeyi uyarılınca ise duyulmadı (Bernstein ve Burstein, 2012). Ağrı çoğu kez uyarılan yerde değil, başın başka bir yerinde hissedildi. Buna **yansıyan ağrı** denir. Örneğin üst sagital sinüs uyarılınca ağrı göz çevresinde duyuldu. Orta meningeal atardamar uyarılınca yan kafada ve şakakta duyuldu (Bernstein ve Burstein, 2012).

Bu yüzden uzun süre şu kabul edildi: kafa içinde ağrıya duyarlı yapılar yalnızca sert zar ve onu besleyen damarlardır (Fontaine ve ark., 2018). 2018’de 53 uyanık ameliyat hastasında yapılan bir çalışma bu görüşü genişletti. Yumuşak zara ve küçük beyin damarlarına dokunmak da ağrı oluşturdu (Fontaine ve ark., 2018).

**Baş ağrısı ve migren.** Sert zardaki duyu lifleri ve damarlar birlikte bir sistem kurar: **trigeminovasküler sistem**. Bu sistem baş ağrısının olası bir kaynağıdır (Lee ve ark., 2017a). Migren uzun süre zar damarlarının genişlemesinden doğan bir damar hastalığı sayıldı (Iyengar ve ark., 2019). Bugün bu açıklama yetersiz görülür. Migren, beynin birçok bölgesini tutan karmaşık bir sinir sistemi hastalığıdır. Beyin kabuğu, kabuğun altındaki bölgeler ve beyin sapı bu hastalığa katılır (Iyengar ve ark., 2019). Zarın damarları ve onlara giden duyu sinirleri de bu tablonun bir parçasıdır: atak ilerlerken bu sistem aşırı duyarlı hâle gelir (Iyengar ve ark., 2019). Bu süreçte **CGRP** adlı küçük bir haberci madde önemli rol oynar. CGRP’nin işini engelleyen tedaviler migrende etkilidir (Iyengar ve ark., 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Atardamar:** Sert zarı her yanda ön, orta ve arka meningeal atardamarlar besler. En büyüğü orta meningeal atardamardır. Dikensi delikten girer, kemiğin iç yüzündeki olukta dallanır. En sık pterionda yırtılır.

**Sinir:** Çadır üstündeki sert zar çoğunlukla trigeminal sinirden (V1, V2, V3), arka kafa çukurundaki sert zar vagustan ve C1–C3’ten duyu alır. Sempatik lifler damarlara eşlik eder.

**Ağrı:** Beyin dokusu ağrı duymaz. Sert zar ve damarları ağrı duyar. Ağrı çoğu kez başka bir yere yansır.

**Migren:** Beynin birçok bölgesini tutan bir hastalık. Zarın damarları ve sinirleri bu tablonun bir parçasıdır: atakta trigeminovasküler sistem aşırı duyarlı hâle gelir. CGRP önemli bir haberci madde.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Sert zarın birçok siniri garip bir yol izler. Kafatasından ya da omurga kanalından dışarı çıkar, sonra geri girer. Buna “geri dönen” düzen denir (Ishikawa ve ark., 2026). Örneğin alt çene dalının küçük bir siniri (spinosus siniri) kafatasından oval delikle çıkar. Sonra orta meningeal atardamarla birlikte dikensi delikten geri girer (Ishikawa ve ark., 2026). Bir şaşırtıcı bilgi daha: sert zardaki sinirlerin yoğunluğu doğumdan önce en yüksektir. Doğumdan sonra hızla azalır (Ishikawa ve ark., 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Ağrının yeri, nedenin yeri olmayabilir',
      md: 'Uyanık ameliyatlarda sert zarın uyarılmasıyla oluşan ağrı çoğu kez başka bir yere yansıdı. Kafa tabanının ve beyin orağının sert zarı uyarılınca ağrı çoğunlukla alında, göz çevresinde ve şakakta duyuldu. Ağrı hep uyarıyla aynı yandaydı (Fontaine ve ark., 2018). Yani baş ağrısının duyulduğu yer, ağrıyı başlatan yapının yeri olmayabilir. Baş ağrısının nedenini hekim muayene ve gerekirse tetkikle araştırır.',
    },

    // ——— Lisans: atardamarlar ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Atardamarların genel düzeni.** Gray’e göre sert zarın atardamarları çok sayıdadır. Kafatası tabanının üç çukuru ayrı kaynaklardan beslenir (Gray, 1918):

- **Ön kafa çukuru:** ön ve arka etmoidal atardamarların ve iç karotisin ön meningeal dalları; orta meningeal atardamarın bir dalı.
- **Orta kafa çukuru:** maksiller atardamarın orta ve yardımcı meningeal dalları. Çıkan faringeal atardamarın yırtık delikten giren dalı. İç karotisin dalları ve lakrimal atardamarın geri dönen dalı.
- **Arka kafa çukuru:** art kafa atardamarının meningeal dalları; vertebral atardamarın arka meningeal dalı; ara sıra çıkan faringeal atardamarın dalları.

Güncel bir derlemeye göre sert zarın kanı çoğunlukla dış karotis sisteminden, özellikle orta meningeal atardamardan gelir. Art kafa ve çıkan faringeal atardamarların dalları da katkıda bulunur (Chirica ve ark., 2026).

**Orta meningeal atardamarın yolu.** Çoğu kişide maksiller atardamarın ilk bölümünden çıkar. Maksiller atardamar, dış karotisin uç dalıdır (Ota, 2026). Yukarı çıkarken kulak-şakak sinirinin (aurikulotemporal sinir) iki kökü arasından geçer. Sonra dikensi delikten kafatasına girer (Gray, 1918). İçeride kama kemiğinin büyük kanadındaki olukta öne gider. Ön ve arka dallara ayrılır; ön dal daha büyüktür (Gray, 1918). Kafatasına girince birkaç küçük dal verir (Gray, 1918):

- Trigeminal sinirin gangliyonuna (yarımay gangliyonu) ve oradaki sert zara giden küçük dallar.
- Yüzeyel petrozal dal ve üst timpanik dal.
- Göz çukuruna ve şakak çukuruna giden dallar.

**Yardımcı meningeal dal** ise oval delikten girer. O da yarımay gangliyonunu ve sert zarı besler (Gray, 1918).

**Neyi besler?** Kaynaklar burada farklı vurgu yapar. Gray’e göre dalları kısmen sert zara, ama çoğunlukla kemiklere dağılır (Gray, 1918). Güncel bir derleme ise çadır üstündeki sert zarın çoğunu beslediğini vurgular: yan kubbeler, beyin orağı, çadırın tutunma yerleri. Kemikten geçen dallarla kafatası kemiğini de besler (Ota, 2026).

**Resmî adlar.** TA2 orta meningeal atardamarın dallarını ayrı terimlerle verir: ön (alın) dal, arka (yan kafa) dal, petrozal dal ve göz çukuru dalı (FIPAT, 2019). “Arka meningeal atardamar” adına dikkat et. TA2 bu adı çıkan faringeal atardamarın bir dalına verir (FIPAT, 2019). Gray de bu dala aynı adı verir; ona göre dal kafatasına juguler delikten girer. Ama Gray vertebral atardamarın dalını da “arka meningeal dal” diye anar (Gray, 1918). Bu yüzden bu adı kullanırken kaynağını da söyle.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın atardamarları: bölge bölge',
      sutunlar: ['Bölge', 'Atardamar', 'Nereden çıkar?', 'Kafa içine nereden girer, neyi besler?'],
      satirlar: [
        [
          'Ön kafa çukuru',
          'Ön meningeal dal (TA2’de eş anlamlısı *arteria meningea anterior*)',
          'Ön etmoidal atardamar (arka etmoidal atardamar da benzer bir dal verir)',
          'Etmoid hücreleri besledikten sonra kafa içine girer ve sert zara dal verir',
        ],
        [
          'Ön kafa çukuru',
          'İç karotisin ön meningeal dalı',
          'İç karotis atardamarı',
          'Küçük kanadın üstünden geçer; arka etmoidal atardamarın meningeal dalıyla birleşir',
        ],
        [
          'Orta kafa çukuru',
          'Orta meningeal atardamar',
          'Maksiller atardamarın 1. bölümü (dış karotis sistemi)',
          'Dikensi delik; çadır üstü sert zarın çoğu ve kafatası kemiği',
        ],
        ['Orta kafa çukuru', 'Yardımcı meningeal dal', 'Maksiller atardamar', 'Oval delik; yarımay gangliyonu ve sert zar'],
        ['Orta kafa çukuru', 'Çıkan faringeal atardamarın dalı', 'Çıkan faringeal atardamar', 'Yırtık delik'],
        [
          'Orta kafa çukuru',
          'Lakrimal atardamarın geri dönen dalı',
          'Lakrimal atardamar',
          'Üst göz yarığının dış kısmı; orta meningeal atardamarın bir dalıyla birleşir',
        ],
        [
          'Kavernöz sinüs çevresi',
          'İç karotisin kavernöz dalları',
          'İç karotis atardamarı',
          'Hipofiz, yarımay gangliyonu, kavernöz ve alt petrozal sinüslerin duvarları',
        ],
        [
          'Arka kafa çukuru',
          'Art kafa atardamarının meningeal dalları',
          'Art kafa (oksipital) atardamarı',
          'Juguler delik; ayrıca mastoid delik ya da kondiler kanal (Gray iki yerde farklı yazar)',
        ],
        [
          'Arka kafa çukuru',
          'Vertebral atardamarın meningeal dalı',
          'Vertebral atardamar',
          'Büyük delik hizasında çıkar; kemik ile sert zar arasında dağılır, beyincik orağını besler',
        ],
        [
          'Arka kafa çukuru',
          'Arka meningeal atardamar (TA2 adı)',
          'Çıkan faringeal atardamar',
          'Juguler delik. Aynı atardamarın başka bir dalı yırtık delikten, ara sıra bir üçüncüsü hipoglossal kanaldan girer',
        ],
        [
          'Beyincik çadırı',
          'Çadır atardamarı (Bernasconi–Cassinari)',
          'İç karotisin kavernöz bölümündeki meningohipofiz gövdesi',
          'Kavernöz sinüsten çıkar, çadırın katları arasında ilerler',
        ],
        [
          'Beyincik çadırı',
          'Davidoff–Schechter atardamarı',
          'Arka beyin atardamarı (klasik olarak P2 bölümü)',
          'Çadırın iç kısmını alttan besler',
        ],
        ['Beyincik çadırı', 'Medial dural-tentoryal dal', 'Üst beyincik atardamarı', 'Çadır boyunca ilerler'],
        [
          'Beyin orağı',
          'Orak atardamarları',
          'Orta meningeal atardamarın ön ve arka dalları',
          'Ön orak atardamarı, etmoidal dallar, ön beyin atardamarı ve arka meningeal atardamarla bağlantı kurar',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Ota (2026); Rai ve ark. (2018); O’Reilly ve Krings (2023); Byrne ve Garcia (2013, yalnızca özeti okundu). TA2’de çadır atardamarı için ayrı bir terim yoktur.',
    },

    // ——— Lisans: sinirler ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sinirlerin kaynakları.** Gray’e göre kafa içi sert zarın sinirleri şu kaynaklardan gelir: yarımay gangliyonu; göz, üst çene ve alt çene sinirleri; vagus ve hipoglossal sinirler; sempatik sistem (Gray, 1918). Güncel kaynaklar bu listeyi bölgelere göre ayrıntılandırır.

**Çadır üstünde: trigeminal sinir.**

- **Ön kafa çukuru** göz dalının (V1) ön ve arka etmoidal sinirlerinden sinir alır. Ön etmoidal sinir üst sagital sinüs boyunca yükselir. Beyin orağının ön kısmını ve alın kubbesinin sert zarını besler (Ishikawa ve ark., 2026).
- **Arnold’un çadır siniri** göz dalının geri dönen bir dalıdır. Kavernöz sinüsün içinde çıkar ve arkaya kıvrılır. Beyin orağının arka kısmını, çadırı, yan ve art kafa kubbelerinin sert zarını besler (Ishikawa ve ark., 2026). Enine, düz ve sagital sinüslerin duvarlarına da gider (Ishikawa ve ark., 2026). Gray de göz sinirinin çadırın katları arasından geçen geri dönen bir iplik verdiğini yazar (Gray, 1918). TA2’deki adı *ramus tentorius nervi ophthalmici*’dir (FIPAT, 2019).
- **Orta meningeal sinir** üst çene dalından (V2) çıkar. Trigeminal gangliyonun yakınında ayrılır. Ön çukurun arka kısmını, küçük kanadı ve orta çukurun ön kısmını besler (Ishikawa ve ark., 2026). Gray’e göre orta meningeal atardamara eşlik eder (Gray, 1918).
- **Spinosus siniri** alt çene dalından (V3) çıkar. Oval delikten kafatasının dışına çıkar. Sonra dikensi delikten orta meningeal atardamarla geri girer. Orta çukurun arka kısmını ve yan kubbeyi besler (Ishikawa ve ark., 2026). Gray’e göre ön ve arka dallara ayrılır ve atardamarın ana dallarına eşlik eder (Gray, 1918).
- **Trigeminal gangliyon** da çadıra ve orta çukurun sert zarına küçük dallar verir (Gray, 1918).

**Arka kafa çukurunda.**

- **Vagusun meningeal dalı** juguler gangliyondan çıkan, geri dönen bir ipliktir. Arka çukurun sert zarına dağılır (Gray, 1918).
- **Hipoglossal sinir**, Luschka’ya göre kanalından geçerken arka çukurun sert zarına iplikler verir (Gray, 1918).
- **C1–C3 dalları ve sempatik lifler** üç yoldan girer: büyük delik, hipoglossal kanal ve juguler delik (Ishikawa ve ark., 2026).

Vagusun duyu lifleri arka çukurun sert zarını ve kulak derisinin bir kısmını besler. Bu lifler beyin sapında trigeminal sinirin omuriliğe inen yoluna katılır (Byrne ve Dafny, 2026).

**Sempatik lifler.** Sert zarın otonom sinirlerinde sempatik lifler baskındır. Boyundaki üst servikal gangliyondan gelir. Atardamarların çevresindeki ağlarla, özellikle orta meningeal atardamarla ulaşırlar (Joost ve ark., 2026). Sert zara doğrudan parasempatik lif gittiğine dair kesin bir anatomik kanıt henüz yoktur (Joost ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Sert zarın sinirleri: bölge bölge',
      sutunlar: ['Bölge', 'Sinir', 'Kaynağı', 'Not'],
      satirlar: [
        [
          'Ön kafa çukuru, orağın önü, alın kubbesi',
          'Ön ve arka etmoidal sinirler',
          'Göz dalı (V1)',
          'Ön etmoidal sinir üst sagital sinüs boyunca yükselir',
        ],
        [
          'Orağın arkası, çadır, yan ve art kafa kubbesi',
          'Arnold’un çadır siniri',
          'Göz dalı (V1)',
          'Kavernöz sinüs içinde çıkar, arkaya kıvrılır; enine, düz ve sagital sinüslerin duvarlarına gider',
        ],
        [
          'Ön çukurun arkası, küçük kanat, orta çukurun önü',
          'Orta meningeal sinir',
          'Üst çene dalı (V2)',
          'Orta meningeal atardamara eşlik eder',
        ],
        ['Orta çukurun arkası, yan kubbe', 'Spinosus siniri', 'Alt çene dalı (V3)', 'Oval delikten çıkar, dikensi delikten geri girer'],
        ['Çadır ve orta çukur', 'Küçük dallar', 'Trigeminal gangliyon', '—'],
        ['Arka kafa çukuru', 'Vagusun meningeal dalı', 'Vagusun juguler gangliyonu', 'Geri dönen bir iplik'],
        ['Arka kafa çukuru', 'Hipoglossal sinirin iplikleri', 'Hipoglossal sinir', 'Sinir kanalından geçerken verir (Luschka’ya göre)'],
        ['Arka kafa çukuru', 'C1–C3 dalları', 'Üst boyun omurilik sinirleri', 'Büyük delik, hipoglossal kanal ve juguler delikten girer'],
        ['Bütün sert zar', 'Sempatik lifler', 'Üst servikal gangliyon', 'Damar çevresi ağlarla; parasempatik lif için kesin kanıt yok'],
        [
          'Omurilik sert zarı',
          'Geri dönen meningeal dallar',
          'Omurilik sinirleri ve sempatik gangliyonlar',
          'Her sert zar parçası 2–4 düzeyden üst üste binen dallar alır',
        ],
      ],
      not: 'Kaynaklar: Ishikawa ve ark. (2026); Gray (1918); Joost ve ark. (2026). Bir başka derleme dağılımı farklı vurgular: glossofaringeal ve vagus sinirleri klivus dışındaki arka çukur sert zarını, C1–C3 ise başlıca klivus bölgesini besler. Aynı derlemeye göre alt çene dalının meningeal dalı yan kafa sert zarını beyin orağına kadar besler (Joost ve ark., 2026).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Alttan: sert zarın sinir ve atardamar kapıları',
      aciklama:
        'Beyne alttan bakıyoruz: ön taraf yukarıda, hastanın sağı ekranın solunda. Kafatası yarı saydam. Turuncu-sarı yaprak beyincik çadırıdır; beyinciğin üstünde, kafatasının içinden görünür. Noktalar, kafatası tabanındaki bazı kapıları gösterir. Oval delikten yardımcı meningeal dal girer, spinosus siniri çıkar. Üst göz yarığından lakrimal atardamarın geri dönen dalı sert zara gider. Hipoglossal kanaldan C1–C3 dalları ve hipoglossal sinirin iplikleri geçer. Klivusun üstünde baziler pleksus uzanır. Dikensi delik ve juguler delik modelde görünmez.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR }],
        bakis: 'alt',
        etiketler: [{ yapi: 'beyincik' }, { yapi: 'omurilik-sogani' }],
        noktalar: [
          { nokta: 'ust-orbital-yarik-sol', metin: 'Üst göz yarığı' },
          { nokta: 'oval-delik-sol', metin: 'Oval delik' },
          { nokta: 'hipoglossal-kanal-sol', metin: 'Hipoglossal kanal' },
          { nokta: 'klivus', metin: 'Klivus' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Lisans: ağrı ve baş ağrısı ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Klasik deneyler.** Baş ağrısı kuramının kaynağı uyanık hastalardaki gözlemlerdir. Kafatası açılmış (kraniyotomi) ama uyanık olan hastalarda sert zarın damarları uyarıldı. Bu, başta yansıyan ağrı oluşturdu. Beynin yüzeyini uyarmak ise ağrı oluşturmadı (Bernstein ve Burstein, 2012). 1940’ta Ray ile Wolff’un ve Penfield ile McNaughton’un klasik deneylerinde üç bölge ayrıldı (Bernstein ve Burstein, 2012):

- Üst sagital sinüs ya da ön çukur tabanının damarları uyarılınca ağrı göz çevresinde duyuldu.
- Orta meningeal atardamar uyarılınca ağrı yan kafada ve şakakta duyuldu.
- Arka çukur tabanındaki sert zar ile sigmoid, enine ve oksipital sinüsler uyarılınca ağrı art kafada duyuldu.

Bu yapılar uyarılınca ağrıdan başka bir duyu oluşmadı. Sert zarın damarsız bölgelerini uyarmak ise çoğunlukla ağrı oluşturmadı (Bernstein ve Burstein, 2012). Bu bulgu sinirlerin dağılımına uyar. Duyu sinirleri meningeal damarları yakından izler, damarsız alanlara pek gitmez (Bernstein ve Burstein, 2012).

Sert zar sinirlerinin gerçekten ağrı lifi olduğu 1980’lerde kanıtlandı (Bernstein ve Burstein, 2012). Sert zarda iki tür ağrı lifi bol bulunur. **C lifleri** miyelinsizdir, yani yalıtım kılıfı yoktur. **Aδ lifleri** ise ince bir miyelin kılıfı taşır. Bu lifler trigeminal gangliyondan ve C1–C3 arka kök gangliyonlarından gelir (Bernstein ve Burstein, 2012). Meningeal damarlardaki duyu liflerinin çoğu göz dalından (V1) gelir. Üst ve alt çene dallarının da katkısı vardır (Iyengar ve ark., 2019).

**2018’deki uyanık ameliyat çalışması.** 53 hastada 93 ağrı olayı kaydedildi (Fontaine ve ark., 2018):

- Kafa tabanının sert zarına (23 olay) ya da beyin orağına (7 olay) dokunmak ağrı oluşturdu. Ağrı çoğunlukla V1 bölgesine ve şakağa yansıdı.
- Önceki çalışmalardan farklı olarak, yumuşak zara ve küçük beyin damarlarına dokunmak da ağrı oluşturdu (61 olay). Bu ağrı da çoğunlukla V1 bölgesine yansıdı.
- Ağrı keskin, şiddetli ve kısaydı. Uyarı bitince hemen geçti. Her zaman uyarıyla aynı yana yansıdı.

Bu çalışmanın yalnızca özeti okundu. Bir derlemeye göre beyin orağının arka kısmı, çadır ve orta çukur tabanının sert zarı yoğun sinirlidir. Bu yerlerin ameliyatta çekilmesi şiddetli ağrı yapabilir (Kemp ve ark., 2012). Bu derlemenin de yalnızca özeti okundu.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yansıyan ağrı: neresi uyarılınca nerede ağrır?',
      sutunlar: ['Uyarılan yapı', 'Ağrının duyulduğu yer', 'Kaynak'],
      satirlar: [
        ['Üst sagital sinüs; ön çukur tabanının damarları', 'Göz çevresi', 'Bernstein ve Burstein (2012)'],
        ['Orta meningeal atardamar', 'Yan kafa ve şakak', 'Bernstein ve Burstein (2012)'],
        ['Arka çukur tabanının sert zarı; sigmoid, enine ve oksipital sinüsler', 'Art kafa', 'Bernstein ve Burstein (2012)'],
        ['Kafa tabanının sert zarı ve beyin orağı', 'Çoğunlukla V1 bölgesi (alın ve göz çevresi) ve şakak', 'Fontaine ve ark. (2018)'],
        ['Yumuşak zar ve küçük beyin damarları', 'Çoğunlukla V1 bölgesi', 'Fontaine ve ark. (2018)'],
        ['Sert zarın damarsız bölgeleri', 'Çoğunlukla ağrı yok', 'Bernstein ve Burstein (2012)'],
        ['Beyin yüzeyi', 'Ağrı yok', 'Bernstein ve Burstein (2012)'],
      ],
      not: 'Fontaine ve ark. (2018) için yalnızca özet okundu. Klasik görüşe göre yumuşak zar ve küçük beyin damarları ağrıya duyarsızdır (Fontaine ve ark., 2018); bu çalışma bu görüşe itiraz eder.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Trigeminovasküler sistem.** Sert zardaki trigeminal duyu lifleri ve meningeal damarlar birlikte bu sistemi kurar. Sistem, baş ağrısının olası bir kaynağıdır (Lee ve ark., 2017a). Sert zar duyu liflerinin uyarılması, migren dahil bazı baş ağrılarında ağrının doğuşunda temel sayılır (Lee ve ark., 2017a).

Bu ağrı lifleri damar genişletici küçük proteinler (nöropeptitler) taşır. Bunların ikisi **P maddesi** ve **CGRP**’dir (kalsitonin gen ilişkili peptit) (Bernstein ve Burstein, 2012). CGRP içeren sinir lifleri meningeal atardamarlar boyunca uzanır. Dallarında sonlanır, ama damarlar arasındaki bağ dokusunda da bulunur (Messlinger, 2018). Migren ataklarında iç juguler toplardamarın kanında CGRP düzeyinin arttığı bulunmuştur (Messlinger, 2018).

Migren uzun süre zar damarlarının genişlemesinden doğan bir damar hastalığı sayıldı (Iyengar ve ark., 2019). Bugün bu açıklama eksik görülür. Migren karmaşık bir sinir sistemi hastalığıdır. Beyin kabuğu, kabuk altı bölgeler ve beyin sapı hastalığa katılır (Iyengar ve ark., 2019). Bu bölgelerin etkinliğini neyin başlattığı henüz açık değildir (Iyengar ve ark., 2019). Trigeminovasküler sistem bu tablonun bir parçasıdır. Bir görüşe göre atak ilerledikçe önce trigeminal gangliyonun duyu nöronları duyarlılaşır. Sonra beyin sapındaki ve talamustaki nöronlar da duyarlılaşır (Iyengar ve ark., 2019). CGRP bu süreçte temel bir rol oynar (Iyengar ve ark., 2019). Çevresel trigeminal sistemde CGRP’nin işine karışan tedaviler migrende etkilidir (Iyengar ve ark., 2019).

Orta meningeal atardamar da bu tabloda yer alır. Ağrıya duyarlı sert zara bağlı olduğu için migren baş ağrısında da rol oynar (Natali ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Sert zarın damar ve sinirleri klinikte',
      md: `- **Pterion ve epidural kanama.** Orta meningeal atardamar en sık pterionda yırtılır. Bu genellikle epidural kanamaya yol açar; kanama BT’de mercek biçiminde görülür (Natali ve ark., 2024). Kliniği “Kanamalar ve fıtıklaşmalar” bölümünde.
- **Kronik subdural kanama.** Bu kanamada sert zarın en iç katındaki ince kılcal ağ yoğunlaşır (Ota, 2026). Orta meningeal atardamarın tıkanması (embolizasyon) aynı bölümün Uzman düzeyinde tartışılıyor.
- **Baş ağrısı.** Sert zarın damarları ve trigeminal lifleri baş ağrısının olası bir kaynağıdır (Lee ve ark., 2017a). CGRP’yi hedefleyen tedaviler migrende etkilidir (Iyengar ve ark., 2019).
- **Ameliyatta kalp yavaşlaması.** Sert zarın çekilmesi ya da bazı damar içi tedaviler, kalbi birden yavaşlatabilen bir refleksi tetikleyebilir: **trigeminokardiyak refleks** (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Orta meningeal atardamar:** maksiller atardamarın 1. bölümü → aurikulotemporal sinirin iki kökü arası → **dikensi delik** → büyük kanattaki oluk → ön (büyük) ve arka dal. En sık **pterionda** yırtılır → epidural kanama.
- **Yardımcı meningeal dal:** oval delikten girer. **Arka meningeal atardamar:** TA2’de çıkan faringeal atardamarın dalı; Gray’e göre juguler delikten girer.
- **Çadırın atardamarları:** meningohipofiz gövdesinden çadır atardamarı (Bernasconi–Cassinari); arka beyin atardamarından Davidoff–Schechter.
- **Sinirler:** V1 → etmoidal sinirler ve Arnold’un çadır siniri. V2 → orta meningeal sinir. V3 → spinosus siniri (oval delikten çıkar, dikensi delikten girer). Arka çukur: vagus, hipoglossal iplikler, C1–C3. Sempatik: üst servikal gangliyon.
- **Ağrı:** sert zar ve damarları duyarlı, beyin dokusu duyarsız. Üst sagital sinüs → göz çevresi; orta meningeal atardamar → şakak; arka çukur → art kafa.
- **Migren:** beynin birçok bölgesini tutan karmaşık bir hastalık. Tablonun bir parçası: trigeminovasküler sistemin duyarlılaşması, CGRP ve P maddesi.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Uyanık ameliyatta göz çevresinde ağrı',
      oyku: `Bir hastaya, sol alın lobundaki bir lezyon için uyanık ameliyat yapılıyor. Kafatası açılmış, hasta konuşabiliyor. Cerrah, beyin orağının ön kısmına yakın sert zarı çekince hasta sol gözünün çevresinde keskin bir ağrı tarif ediyor. Cerrah elini çekince ağrı hemen geçiyor. Biraz sonra beyin yüzeyine dokunulduğunda hasta hiçbir şey hissetmiyor.`,
      soru: 'Ağrı neden göz çevresinde duyuldu? Neden beyin yüzeyine dokunmak ağrı yapmadı?',
      cozum: `**Hangi sinir?** Beyin orağının ön kısmını ve alın kubbesinin sert zarını göz dalının (V1) ön etmoidal siniri besler (Ishikawa ve ark., 2026). Ağrı bu yüzden aynı dalın yüzdeki alanına yansıyabilir. Uyanık ameliyat çalışmalarında kafa tabanı ve orak sert zarının uyarılması çoğunlukla V1 bölgesine yansıyan ağrı yaptı (Fontaine ve ark., 2018). Klasik deneylerde de üst sagital sinüsün uyarılması göz çevresinde ağrı yapmıştı (Bernstein ve Burstein, 2012).

**Ağrının özelliği.** Bu tür ağrı keskin, şiddetli ve kısadır. Uyarı bitince hemen geçer ve uyarıyla aynı yanda duyulur (Fontaine ve ark., 2018). Vakadaki tablo buna uyar.

**Beyin yüzeyi.** Beyin yüzeyinin uyarılması klasik deneylerde ağrı oluşturmadı (Bernstein ve Burstein, 2012). Ama bir 2018 çalışmasında yumuşak zara ve küçük beyin damarlarına dokunmak da ağrı yaptı (Fontaine ve ark., 2018). Yani “beyin hiçbir yerinde ağrı duymaz” demek tam doğru olmayabilir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Uzman: atardamarların ayrıntısı ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Orta meningeal atardamar: anjiyografideki bölümler.** Atardamar anjiyografide beş bölüme ayrılır (Ota, 2026):

1. kafa dışı bölüm: maksiller atardamardaki çıkışından dikensi deliğe,
2. yatay bölüm: orta kafa çukurunda öne ve yana gider, kavernöz ve petrozal dalları verir,
3. şakak bölümü,
4. pterion bölümü,
5. koronal bölüm.

**Önemli dallar** (Ota, 2026):

- **Petrozal dal** genellikle dikensi delikten geçtikten sonraki ilk 10 mm’lik bölümden çıkar. Deliğin içinden ya da hemen altından da çıkabilir.
- **Kavernöz dal** petrozal daldan çıkar. Kavernöz sinüsün yan duvarını besler.
- **Ön dal** alın ve ön yan kafa sert zarını besler. Meningolakrimal atardamar yoluyla göz atardamarının lakrimal dalına bağlanır. Bu bölgede geriye akış, gözün ağ tabakasında (retina) kansızlık riski taşır.
- **Orak atardamarları** ön ve arka dallardan çıkar.

**Embriyodan kalan iz.** Orta meningeal atardamar, embriyodaki stapedial atardamarın gerilemesiyle oluşur. Bu atardamarın kalıntıları maksiller sisteme katılır (Ota, 2026). Gerilemenin farklı biçimleri bazı köken varyantlarını açıklar (Ota, 2026).

**Köken ve dallanma varyantları.**

- Göz (oftalmik) atardamarından çıkan orta meningeal atardamar, anjiyografi serilerinin %0,5–2’sinde bildirilir. Bu varyantta atardamarı tıkamak (embolizasyon) görme kaybı riski taşır (Ota, 2026).
- Nadiren baziler atardamardan çıkar; çoğunlukla ön alt beyincik atardamarı ile üst beyincik atardamarı arasından. Bu, embriyodaki trigeminal–stapedial bağlantının sürmesini yansıtır (Ota, 2026).
- Bir sistematik derlemede yaklaşık 43 hastada anormal köken ya da dallanma bildirildi. Baziler köken 9 olgu sunumunda, oftalmik köken yaklaşık 12 hastada görüldü (Azab ve ark., 2026). Bu bilgi yalnızca özetten alındı.
- 140 orta meningeal atardamarın incelemesinde ön dal %41 oranında baskındı (Ota, 2026).

**Türkiye’den bir anjiyografi çalışması.** İstanbul’daki Bezmialem Vakıf Üniversitesi’nin de katıldığı bir çalışmada 87 yarımküre üç boyutlu dönen anjiyografiyle incelendi (Sari ve ark., 2026):

- En sık dallanma tipi Tip Ia idi (%49,4).
- Orta meningeal atardamar 2 yarımkürede (%2,3) göz atardamarından çıkıyordu.
- 1 yarımkürede (%1,1) ise tersine, göz atardamarı tümüyle orta meningeal atardamardan çıkıyordu.

Bu bilgiler yalnızca çalışmanın özetinden alındı.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Orta meningeal atardamar: varyasyonlar ve tehlikeli bağlantılar',
      sutunlar: ['Bulgu', 'Sıklık ya da değer', 'Neden önemli?', 'Kaynak'],
      satirlar: [
        ['Maksiller atardamarın 1. bölümünden çıkış', 'Çoğu kişide', 'Olağan düzen', 'Ota (2026)'],
        ['Göz atardamarından çıkış', 'Anjiyografi serilerinin %0,5–2’si', 'Embolizasyonda görme kaybı riski', 'Ota (2026)'],
        ['Göz atardamarından çıkış (Türkiye ortak çalışması)', '87 yarımkürenin 2’si (%2,3)', 'Aynı risk', 'Sari ve ark. (2026)'],
        [
          'Göz atardamarının tümüyle orta meningeal atardamardan çıkışı',
          '87 yarımkürenin 1’i (%1,1)',
          'Ters yönde bir köken varyantı',
          'Sari ve ark. (2026)',
        ],
        ['Baziler atardamardan çıkış', 'Nadir; 9 olgu sunumu', 'Embriyodaki bir bağlantının sürmesi', 'Ota (2026); Azab ve ark. (2026)'],
        ['Meningolakrimal bağlantı', '—', 'Geriye akışta retinada kansızlık riski', 'Ota (2026)'],
        ['Ön dal baskınlığı', '140 atardamarın %41’i', 'Dal düzeni kişiden kişiye değişir', 'Ota (2026)'],
        ['Arka kubbe dalının çıkış yeri', 'Deliğe yakın %36, ortada %44, uzakta %21', 'Dal düzeni kişiden kişiye değişir', 'Ota (2026)'],
        ['Orta hattı geçen bağlantılar', 'Sagital dikiş boyunca küçük dallar', 'Karşı taraftan yan dolaşım', 'Ota (2026)'],
      ],
      not: 'Sari ve ark. (2026) ile Azab ve ark. (2026) için yalnızca özet okundu. Embolizasyonun kendisi “Kanamalar ve fıtıklaşmalar” bölümünde.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Orta meningeal atardamar sert zarın içinde nasıl dağılır?** Sert zarın kanla ne kadar zengin beslendiği “Sert zar: yapısı” bölümünde anlatıldı.

Orta meningeal atardamarın anatomisini anlatan bir derleme, dallarının üç kata dağıldığını yazar (Ota, 2026):

- **Dış ağ:** kemiğe yapışan katmandadır. Görece kalın damarlardan (100–300 µm) oluşur. Küçük dalları sagital dikişi geçer. Böylece karşı taraftaki orta meningeal atardamar da bu ağı besleyebilir.
- **Geçiş damarları:** 30–80 µm çaplı, içe doğru giden küçük atardamarlardır. Görece damarsız meningeal katmanı geçip en içteki sınır hücre katına ulaşır.
- **İç kılcal ağ:** sınır hücre katmanındadır; kılcalların çapı yaklaşık 5–15 µm’dir. Normalde seyrektir. Kronik subdural kanamada yoğun damarlanma gösterir.

Öteki kaynakların bu katmanları nasıl anlattığı “Sert zar: yapısı” bölümündedir. Walsh ve arkadaşlarının aktardığına göre büyük meningeal atardamarlar (400–800 µm) kıvrımlı bir bağlantı damarları ağına bölünür (Walsh ve ark., 2020).

**Sert zar beyne kan verebilir.** Kansızlık ve kısa devre hastalıklarında sert zarın damar ağı yeni damar oluşumuna iskele olabilir. Moyamoya olgularının yaklaşık %52’sinde sert zardan beyne kan desteği görülür. Atardamar-toplardamar şekil bozukluklarında (AVM) bu oran %6–11’dir (Ishikawa ve ark., 2026).

**Çadırın atardamarları.**

- **Çadır atardamarı (Bernasconi–Cassinari).** İç karotisin kavernöz bölümünden meningohipofiz gövdesi çıkar. Bu gövde çadır ve dorsal meningeal atardamarlara ayrılır. Çadır atardamarı kavernöz sinüsten çıkar ve çadırın katları arasında ilerler (Rai ve ark., 2018).
- **Davidoff–Schechter atardamarı.** Arka beyin atardamarının çadır altına giden küçük dallarındandır (Rai ve ark., 2018). 1965’te Paul ve Gertraud Wollschlaeger çifti 291 kadavrayla tanımladı. Atardamara, nöroradyolojideki hocalarının adını verdiler (O’Reilly ve Krings, 2023). Klasik olarak arka beyin atardamarının P2 bölümünden çıkar; P1’den çıkan nadir olgular da bildirilmiştir (O’Reilly ve Krings, 2023). Üst beyincik atardamarından çıkan nadir türüne Wollschlaeger atardamarı denir (O’Reilly ve Krings, 2023).
- **Medial dural-tentoryal dal.** Üst beyincik atardamarının çadır boyunca giden bir dalıdır. Çadırdaki sert zar fistülü serilerinde tanımlanmıştır (Byrne ve Garcia, 2013). Bu bilgi yalnızca özetten alındı. Fistüllerin ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'Çadırı besleyen atardamarların çıktığı yerler',
      aciklama:
        'Önden, soldan ve yukarıdan eğik bakıyoruz. Atardamarlar kırmızı, beyincik çadırı sarı. Büyük beyin gösterilmedi; beyin sapı ve beyincik görünür. Çadırın kendi küçük atardamarları modelde yoktur. Etiketler, onların çıktığı büyük atardamarları gösterir. Çadır atardamarı iç karotisin kavernöz bölümünden, Davidoff–Schechter dalı arka beyin atardamarından, medial dural-tentoryal dal üst beyincik atardamarından çıkar. Vertebral atardamar büyük delik hizasında arka çukurun sert zarına dal verir.',
      sahne: {
        katmanlar: ['damar', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR }],
        bakis: 'egik',
        etiketler: [
          { yapi: 'ic-karotis-arter-sol', metin: 'İç karotis atardamarı' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin atardamarı' },
          { yapi: 'ust-beyincik-arteri-sol', metin: 'Üst beyincik atardamarı' },
          { yapi: 'vertebral-arter-sol', metin: 'Vertebral atardamar' },
          { yapi: 'baziler-arter', metin: 'Baziler atardamar' },
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },

    // ——— Uzman: sinirlerin ayrıntısı ve tartışmalar ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Çadırın siniri dört düzende dağılır.** 29 kadavradan alınan 52 çadır yarısı (taraf), sinirleri gösteren bir boyayla (Sihler boyası) incelendi. Çadır sinirinin dağılımı dört tipe ayrıldı. Tip 1 düz ve enine sinüse gidiyordu. Tiplerin sıklığı şöyleydi: Tip 1 %71,2, Tip 2 %21,2, Tip 3 %3,8, Tip 4 %3,8 (Lee ve ark., 2017b). Düz sinüsün ön yarısı ile çadır çentiğinin iç kısmı arasındaki alan sinirce fakirdi. Yazarlar burayı güvenli bir cerrahi alan sayar (Lee ve ark., 2017b). Bu bilgiler yalnızca özetten alındı.

**Spinosus siniri atardamarla mı, toplardamarla mı gider?** Gray ve Ishikawa ve arkadaşları siniri orta meningeal atardamarla birlikte anlatır (Gray, 1918; Ishikawa ve ark., 2026). 24 kadavrada 44 taraf incelendi. Spinosus siniri atardamarın değil, orta meningeal **toplardamarın** yan duvarı boyunca uzanıyordu (Lee ve ark., 2017a). Tarafların %81,8’inde ön dallar boyunca belirgin sinir demetleri vardı (Lee ve ark., 2017a). Sinir genellikle atardamarın ön dallarıyla gider ve pterionun yakınında sonlanır (Lee ve ark., 2017a).

**Kafatası dışına çıkan sert zar lifleri.** Sıçan ve insanda sert zar sinir liflerinin bir kısmı emisser kanallardan ve yarıklardan kafatasının dışına çıkar. Şakak, yan kafa ve art kafa kemiklerinin dış zarına (periost) dağılır (Schueler ve ark., 2014). Spinosus sinirinin kesitinde insanda ve sıçanda benzer sayıda miyelinli ve miyelinsiz akson görüldü (Schueler ve ark., 2014). Bu bilgiler yalnızca özetten alındı.

**Sinir yoğunluğu ve yaş.** 31. gebelik haftasından 60 yaşına kadar 27 kişinin sert zarı incelendi. Sinir yoğunluğu gebeliğin 31. ve 40. haftaları arasında arttı ve doğumda en yüksekti. Sonraki 3 ayda azaldı ve 50’li yaşlara dek düşük kaldı (Davidson ve ark., 2012). Bu bilgi yalnızca özetten alındı.

**Arka çukur ve art kafa ağrısı.** Bir derlemeye göre arka çukur sert zarının sinir kaynakları şunlardır: arka kök gangliyonu, üst servikal gangliyon, vagus, trigeminal, hipoglossal ve glossofaringeal sinirler (Hage ve ark., 2022). Sıçanda arka çukurun sert zarını C2–C3 arka kök gangliyonlarındaki nöronlar besler. Bunların yaklaşık yarısı CGRP ve TRPV1 adlı bir ağrı alıcısını (reseptör) taşır (Noseda ve ark., 2019). Bu bölgeden ağrı bilgisi alan merkezî nöronlar omuriliğin C2–C4 kesimindedir. Aynı çalışmada arka sert zara iltihap yapan maddeler verildi. Bunun ardından bu omurilik nöronlarının yanıtı arttı. Nöronlar sert zarın, art kafa derisinin ve boyun kaslarının uyarılmasına daha güçlü yanıt verdi (Noseda ve ark., 2019). Yazarlara göre art kafa migreni, başka yerdeki migrenlerden farklı olarak beyincikteki bozukluklarla daha yakından ilişkili olabilir (Noseda ve ark., 2019). Bunlar hayvan verisidir ve yalnızca özetten alındı.

**Omurilik sert zarı.** Omurilik sert zarı, omurilik sinirlerinin geri dönen meningeal dallarından ve sempatik gangliyonlardan sinir alır. Her parça tek bir düzeyden değil, 2–4 düzeye yayılan üst üste binen dallardan sinir alır (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**CGRP: kaynaklar, hedefler, ilaçlar.** Kafadaki sert zar, CGRP taşıyan sinir lifleriyle donanmıştır. Bu lifler meningeal atardamarlar boyunca uzanır ve dallarında sonlanır. Damarlar arasındaki bağ dokusunda da bulunur (Messlinger, 2018). CGRP’nin büyük kısmı trigeminal liflerden iki yerde salınır. Biri zar dokusudur. Öbürü beyin sapında, trigeminal sinirin omuriliğe inen çekirdeğindeki ilk sinapstır (Messlinger, 2018). CGRP bu yerlerde atardamarları genişletir. Ama trigeminal lifleri doğrudan uyarmaz (Messlinger, 2018).

Sert zarda CGRP’nin yanında P maddesi ve nörokinin A da bulunur. Bir derlemeye göre zar duyu liflerinin uyarılması, bu maddelerin salınmasıyla beyin damarlarını genişletebilir. Bu maddeler baş ağrısının oluşumunda rol oynar (Lv ve ark., 2014). Bu bilgi yalnızca özetten alındı. Bir hayvan modelinde sert zar kısa süre bir iltihap karışımına maruz bırakıldı. Karışımda serotonin, bradikinin, histamin ve prostaglandin vardı. Bu, trigeminovasküler sistemde uzun süren bir duyarlılaşma yaptı (Bernstein ve Burstein, 2012).

Migren biyolojisi üzerine çalışmalar yeni ilaç sınıflarının doğmasına yol açtı (Goadsby ve ark., 2017):

- CGRP’nin alıcısını (reseptörünü) engelleyen gepantlar,
- serotoninin alıcılarından biri olan 5-HT1F reseptörüne etki eden ditanlar,
- CGRP yolunu hedefleyen tek klonlu antikorlar.

Klasik trigeminal sert zar–damar yolu laboratuvarda ve klinikte incelenmiş, atağın yol haritasını sunmuştur (Goadsby ve ark., 2017). Bu bilgiler yalnızca özetten alındı.

**Migren zarlarda mı başlıyor?** Önde gelen kuramlardan birine göre migren baş ağrısı zarlarda doğar. Bu doğuşta zarın duyu sinirleri, damarları ve yakındaki bağışıklık hücreleri birlikte rol oynar (Christensen ve Levy, 2024). Mekanizma hâlâ tartışmalıdır (Christensen ve Levy, 2024). Bu bilgi yalnızca özetten alındı.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Sert zarın sinirleri ameliyatta',
      md: `- **Trigeminokardiyak refleks.** Sert zarın çekilmesi kalp ve dolaşımda ani değişikliklere yol açabilir. Açık girişimlerin %8–18’inde bildirilir. Onyx/DMSO ile damar içinden tedavi edilen sert zar fistüllerinin %11,1’inde görülür (Ishikawa ve ark., 2026).
- **Nerede?** Risk özellikle çadırın arka kısmında ve beyin orağında yapılan çekmededir. Sonuç kan basıncı düşmesi, kalp yavaşlaması ya da ritim bozukluğu olabilir. Kalp ya da solunum durabilir (Rai ve ark., 2018).
- **Nasıl başlıyor olabilir?** Sert zar atardamarlarının ve sinüslerinin çevresindeki bağ dokusunda kapsülsüz, Ruffini benzeri alıcılar vardır. Bir görüş, sert zar fistülünün Onyx ile damar içinden tedavisinde görülen refleksi açıklar. Bu görüşe göre refleks bu alıcıların uyarılmasıyla başlayabilir (Lv ve ark., 2014). Özet bu görüşü yalnızca bu damar içi tedavi için ileri sürer. Bu bilgi yalnızca özetten alındı.
- **Ağrılı ve güvenli yerler.** Beyin orağının arka kısmı, çadır ve orta çukur tabanının sert zarı yoğun sinirlidir (Kemp ve ark., 2012). Düz sinüsün ön yarısı ile çadır çentiğinin iç kısmı arası ise sinirce fakirdir (Lee ve ark., 2017b).
- **Pterion çevresi.** Spinosus siniri genellikle orta meningeal atardamarın ön dallarıyla gider ve pterionun yakınında sonlanır (Lee ve ark., 2017a).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kafa içinde neresi ağrı duyar? Açık sorular',
      md: `- **Klasik görüş:** Kafa içinde ağrıya duyarlı yapılar sert zar ve onu besleyen damarlarla sınırlıdır. Küçük beyin damarları ve yumuşak zar ağrıya duyarsızdır (Fontaine ve ark., 2018).
- **2018 bulgusu:** 53 uyanık ameliyat hastasında yumuşak zara ve küçük beyin damarlarına dokunmak 61 ağrı olayı oluşturdu (Fontaine ve ark., 2018). Bu, klasik görüşün eksik olabileceğini düşündürür.
- **Sinir dağılımının farklı anlatımları:** Bir derlemeye göre yan kafa sert zarını orağa kadar alt çene dalı (V3) besler (Joost ve ark., 2026). Bir başka derleme ise orak ve çadır için esas olarak göz dalını (V1) gösterir (Ishikawa ve ark., 2026).
- **Hayvandan insana:** Arka sert zarın C2–C3 kaynaklı sinirleri ve art kafa migreni üzerine bulgular sıçandan gelir (Noseda ve ark., 2019).
- **Zarlar ve migren:** Migren baş ağrısının zarlarda başladığı, önde gelen kuramlardan biridir. Ama nasıl olduğu hâlâ tartışmalıdır (Christensen ve Levy, 2024). Migren beynin birçok bölgesini tutan bir hastalıktır; zarlar bu tablonun bir parçasıdır (Iyengar ve ark., 2019).

Kesin yanıtlar için insanda yapılmış daha çok çalışma gerekir.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Çadırın kenarında ani kalp yavaşlaması',
      oyku: `58 yaşında bir hasta, çadırın arka kısmına yakın bir lezyon için ameliyatta. Cerrah lezyona ulaşmak için çadırı ve beyin orağının arka kısmını hafifçe çekiyor. Anestezi monitöründe kalp hızı birden düşüyor, kan basıncı da azalıyor. Cerrah çekmeyi bırakınca değerler birkaç dakikada eski hâline dönüyor.`,
      soru: 'Bu tablonun anatomik açıklaması ne olabilir? Hangi bölgeler bu açıdan daha risklidir?',
      cozum: `**Refleks.** Sert zarın çekilmesi **trigeminokardiyak refleksi** tetikleyebilir. Açık girişimlerin %8–18’inde bildirilir (Ishikawa ve ark., 2026). Çadırın arka kısmında ve beyin orağında yapılan çekme kan basıncını düşürebilir, kalbi yavaşlatabilir ya da ritmi bozabilir. Kalp ya da solunum durabilir (Rai ve ark., 2018).

**Neden bu bölge?** Orağın arka kısmı, çadır ve orta çukur tabanının sert zarı yoğun sinirlidir (Kemp ve ark., 2012). Bu bölgenin büyük kısmını göz dalının (V1) geri dönen çadır siniri (Arnold siniri) besler (Ishikawa ve ark., 2026).

**Daha az riskli yer.** Kadavra çalışmasına göre düz sinüsün ön yarısı ile çadır çentiğinin iç kısmı arası sinirce fakirdir (Lee ve ark., 2017b). Tedavinin yönetimi anestezi ve cerrahi ekibine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
