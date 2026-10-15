import type { DersBolumu } from '../../../types';

/**
 * 10. bölüm: zarların gelişimi ve keşif tarihi. İlkel zar ve takvimi, sinir kresti ve mezoderm kökeni, boşlukların
 * açılması, kıvrımların ve sinüslerin gelişimi, araknoid engel ve glia limitans, doğumdan sonraki değişimler,
 * karşılaştırmalı anatomi; adların Yunanca, Arapça ve Latince öyküsü, keşif çizelgesi, kaynaklar arası çelişkiler,
 * Türkçe adlar ve Türk tıp tarihinden doğrulanmış notlar. Bilgiler S2 kaynak notlarından (A, B, C, D).
 */
export const gelisimVeTarih: DersBolumu = {
  id: 'gelisim-ve-tarih',
  baslik: 'Zarların gelişimi ve keşif tarihi',
  bloklar: [
    // ——— Gelişim: temel ———
    {
      tur: 'metin',
      md: `Beyin zarları anne karnında, beyinle birlikte gelişir. Öykü, beynin ve omuriliğin taslağı olan **sinir borusuyla** (nöral tüp) başlar. Döllenmeden sonraki 22–24. günlerde bazı hücreler bu borunun çevresine göç eder. Gevşek bir bağ dokusu örtüsü oluştururlar. Bu örtüye **ilkel zar** (*meninx primitiva*) denir (Ishikawa ve ark., 2026).

İlkel zar, 33–36. günler arasında bütün beyni sarar (Ishikawa ve ark., 2026). Yaklaşık 42. güne doğru ilkel zarın katlara ayrılması ilerler. En içte yumuşak zar belirir. Dışta ise sert zar sınırlayıcı katı ve ileride kafatasını yapacak bir kat ortaya çıkar (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'metin',
      md: `**Hücreler nereden gelir?** Zarları yapan hücrelerin hepsi aynı yerden gelmez. Ön beynin zarlarındaki bağ dokusu hücreleri **sinir krestinden** gelir (Derk ve ark., 2021). Sinir kresti, sinir borusunun kenarından ayrılıp embriyoya dağılan bir hücre topluluğudur. Orta beynin, arka beynin ve omuriliğin zarları ise **mezodermden** gelir (Derk ve ark., 2021). Mezoderm, embriyonun orta hücre tabakasıdır. Zarlardaki kan damarlarının iç yüzünü döşeyen hücreler ise her bölgede mezoderm kökenlidir (Zedde ve Pascarella, 2025a).

**Boşluklar nasıl açılır?** İlkel zar başta jöle kıvamında bir dokudur. İçinde seyrek, yıldız biçimli hücreler ve bir damar ağı bulunur (Zedde ve Pascarella, 2025a). Sonra bu jölenin içinde sıvı dolu küçük boşluklar açılır. Boşluklar büyür ve hücreleri birbirinden uzaklaştırır. Boşlukların birleştiği yerlerde hücreler sıkışır ve ince zarlar oluşturur (Zedde ve Pascarella, 2025a). Geç embriyo ve erken fetüs döneminde boşluklar birleşir. Böylece subaraknoid boşluk ve sisternalar oluşur (Brøchner ve ark., 2015). Bu boşluklanma sırasında trabeküller de biçimlenir (Zedde ve Pascarella, 2025a).

Zarların gelişimi kafa tabanından tepeye doğru ilerler (Zedde ve Pascarella, 2025a; Ishikawa ve ark., 2026). Gebeliğin ikinci üç ayında subaraknoid boşluk ve sisternalar tam gelişmiştir (Brøchner ve ark., 2015).`,
    },
    {
      tur: 'metin',
      md: `**Kıvrımlar nasıl oluşur?** Embriyoda beyin, orta beyin hizasında belirgin biçimde bükülür; buna orta beyin bükümü denir. Döllenmeden sonraki 36–40. günlerde bu bükümün ucunda ilkel zar sıkışır. Böylece ilk çadır taslağı, yani **birincil tentoryum** oluşur (Ishikawa ve ark., 2026). Beyincik çadırı ve beyin orağı, beynin bükülmesi ve yarımkürelerin büyümesiyle sıkışan ilkel zardan gelişir (Ishikawa ve ark., 2026). Gelişen ilk sert zar uzantısı beyincik çadırıdır (O’Rahilly ve Müller, 1986).

Büyük beyin ile ara beyin arasında ise sert zar kıvrımı oluşmaz. Orada yumuşak zar içeri katlanır. Bu katlantıya **koroid tela** (*tela choroidea*) denir (Ishikawa ve ark., 2026). Yumuşak zarın içeri katlanan bölümleri, karıncıkların içindeki damarlı dokuyu, yani koroid pleksusu da oluşturur (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'İki kıvrım, iki zar',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Beyin kabuğu ve yan karıncık yarı saydam. Turuncu: beyincik çadırı. Embriyoda ilkel zar, orta beyin bükümünde ve büyüyen yarımkürelerin arasında sıkışarak bu kıvrımı yapar. Pembe: yan karıncığın içindeki koroid pleksus. Büyük beyin ile ara beyin arasında sert zar kıvrımı oluşmaz; orada yumuşak zar içeri katlanır ve bu damarlı dokuyu yapar.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'karincik', 'zar'],
        renk: 'dogal',
        saydam: ['katman:kabuk', 'yan-karincik'],
        gizle: ['bolge:sinir'],
        boya: [
          { secici: ['beyincik-cadiri'], renk: '#f08c3a' },
          { secici: ['koroid-pleksus'], renk: '#e0567f' },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı: sert zar kıvrımı' },
          { yapi: 'koroid-pleksus-sol', metin: 'Koroid pleksus: yumuşak zar katlantısı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Doğumdan sonra da değişir.** Zarlar doğumla tamamlanmış olmaz. Örümcek ağı zarın sert zar sinüslerine uzanan çıkıntılarına **araknoid granülasyon** denir (OpenStax 13.3). Gray, bu çıkıntıların bebeklikte görülmediğini yazmıştı. Ona göre üç yaşından önce çok seyrektir ve genellikle yedi yaşından sonra bulunur (Gray, 1918).

Güncel bir MR çalışması bu tabloyu biraz değiştirdi. Yenidoğanların ve iki yaşındaki çocukların %85’inde sinüslerde görünür granülasyon yoktu. Ama yenidoğanların %15’inde enine sinüste granülasyon görüldü (Radoš ve ark., 2021). Embriyo ve fetüslerin doku incelemelerinde ise sinüslerde granülasyon bulunmamıştır (Radoš ve ark., 2021). Granülasyonların sonraki yaşlarda nasıl değiştiği “Örümcek ağı zar” bölümünde.

Sert zara giden sinirler de değişir. Bir çalışmada sinirlerin yoğunluğu doğumda en yüksekti ve sonraki üç ayda azaldı (Davidson ve ark., 2012). Bir derleme ise bu zirveyi doğumdan önceye koyar (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla zarların gelişimi',
      ogeler: [
        { deger: '22–24', birim: 'gün', aciklama: 'İlkel zar sinir borusunun çevresinde oluşmaya başlar (Ishikawa ve ark., 2026).' },
        { deger: '33–36', birim: 'gün', aciklama: 'İlkel zar bütün beyni sarar (Ishikawa ve ark., 2026).' },
        {
          deger: '36–40',
          birim: 'gün',
          aciklama: 'Orta beyin bükümünün ucunda ilk çadır taslağı, yani birincil tentoryum oluşur (Ishikawa ve ark., 2026).',
        },
        { deger: '~42', birim: 'gün', aciklama: 'İlkel zar katlara ayrılır; en içte yumuşak zar belirir (Ishikawa ve ark., 2026).' },
      ],
      not: 'Günler döllenmeden sonra sayılmıştır.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Her hayvanda çadır yok',
      md: 'Karşılaştırmalı bir çalışmaya göre beyincik çadırı balıklarda, amfibilerde ve sürüngenlerde yoktur. Kuşlarda ve memelilerde vardır (Rai ve ark., 2018). Yetişkin kedide çadırın tamamı kemikleşmiştir. Köpekte ve yunusta ise kemikleşme yalnızca arka-iç bölümdedir (Rai ve ark., 2018). Çenesiz bir balık olan lampreyde zarlar dört katlıdır ve subaraknoid boşluk yoktur (Nakao, 1979).',
    },

    // ——— Tarih ve adlar: temel ———
    {
      tur: 'metin',
      md: `**Adların öyküsü.** Beyin zarlarının adları, iki bin yılı aşan bir yolculuğun izlerini taşır.

- Antik Yunan hekimi **Erasistratos** (MÖ 304–250), beyni saran örtülerin hepsine *meninx* dedi. O dönemde sert zar ile öteki zarlar henüz ayrılmıyordu (Ishikawa ve ark., 2026).
- **Galenos** (MS 129–200), dıştaki kalın ve sert zara “kalın zar” anlamında *pachymeninx* dedi (Ishikawa ve ark., 2026).
- Bu bilgiler Arapçaya çevrildi. Arapçada “zar” karşılığı bir sözcük yoktu. Çevirmenler zarı “ana” anlamına gelen *om* sözcüğüyle karşıladı. Sert zar “sert ana” oldu (Ishikawa ve ark., 2026).
- Bu ad Latinceye *dura mater*, yani “sert ana” olarak geçti. Woo ve arkadaşlarına göre adları Latinceye aktaranlar Hristiyan keşişlerdi (Woo ve ark., 2022). Ishikawa ve arkadaşları ise adın Avrupa tıbbına Rönesansta yeniden girdiğini yazar (Ishikawa ve ark., 2026).
- Ortadaki zarın ayrı bir katman olarak tanınması 17. yüzyıldadır. Ad, örümcek ağına benzeyen görünüşünden gelir: *arachnoidea* (Zedde ve Pascarella, 2025a).

Keşifler bugün de sürüyor. Mascagni, 1787’de insan sert zarında lenf damarları bildirmişti (Ishikawa ve ark., 2026). Ama bilim dünyası sonra uzun süre beyinde lenf damarı olmadığını yazdı. Bu damarlar 2015’te “yeniden keşfedildi” (Derk ve ark., 2021). O yıl iki ayrı araştırma grubu onları farelerde gösterdi (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '“İlk kim buldu?” sorusunun tek yanıtı yok',
      md: 'Tarih kaynakları aynı keşfi farklı kişilere ve yıllara bağlayabilir. Örneğin bir kaynak *meninx* adını Erasistratos’a bağlar (Ishikawa ve ark., 2026). Bir başkası zarları adlandıranın Herophilos olduğunu yazar (Bay ve Bay, 2010). Bu derste böyle durumlarda iki görüşü de veriyoruz.',
    },
    {
      tur: 'metin',
      md: `**Türkçe adlar.** Türk Dil Kurumu sözlüğünde üç zarın adı sert zar, örümceksi zar ve ince zardır. Sözlük bu adlar için bir yabancı köken yazmaz (TDK, 2026). “Zar” sözcüğü anatomide ince ve yumuşak, yaprak biçimindeki organ bölümlerini anlatır (TDK, 2026). “Menenjit” ise Türkçeye Fransızca *méningite* sözcüğünden geçmiştir (TDK, 2026). Bu derste örümceksi zar yerine **örümcek ağı zar**, ince zar yerine **yumuşak zar** diyoruz.

**Kalkedon’dan bugüne.** Antik çağın ünlü anatomisti Herophilos, Kalkedon’da doğdu (Kabakcı ve ark., 2026). Kabakcı ve arkadaşlarına göre insan bedenini sistemli biçimde açıp inceleyen ilk kişi odur (Kabakcı ve ark., 2026). Yeditepe Üniversitesi’nde 30 Mayıs 2008’de bir mikronöroşirürji laboratuvarı kuruldu. Mikronöroşirürji, ameliyat mikroskobuyla yapılan beyin cerrahisidir. Laboratuvarı tanıtan yazarlar, onun Herophilos’un doğduğu Kalkedon’da kurulduğunu vurgular (Kabakcı ve ark., 2026). Laboratuvar kurulduktan sonra İstanbul Yaşargil Mikronöroşirürji Kursları fikri doğdu. Kurslar, beyin cerrahı M. Gazi Yaşargil’in adını taşır (Kabakcı ve ark., 2026). Yaşargil’in sisternalar ve zarlarla ilgili çalışmaları “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Gelişim:** ilkel zar (22–24. gün) → bütün beyni sarar (33–36. gün) → katlara ayrılır (~42. gün).

**Köken:** ön beyin zarları sinir krestinden; orta beyin, arka beyin ve omurilik zarları mezodermden gelir.

**Boşluklar:** ilkel zarın içinde açılan sıvı dolu boşluklar birleşir; subaraknoid boşluk ve sisternalar böyle oluşur.

**Kıvrımlar:** ilk gelişen sert zar uzantısı beyincik çadırıdır. Büyük beyin ile ara beyin arasında sert zar kıvrımı yerine yumuşak zar katlantısı gelişir.

**Adlar:** *meninx* Yunanca; *mater* (“ana”) Arapça çeviriden; *arachnoidea* örümcek ağından.`,
    },

    // ——— Gelişim: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'İnsanda zarların gelişim takvimi',
      sutunlar: ['Zaman', 'Ne olur?', 'Kaynak'],
      satirlar: [
        ['Döllenmeden sonra 22–24. gün', 'Ara doku hücreleri sinir borusunun çevresine göç eder: ilkel zar', 'Ishikawa ve ark. (2026)'],
        [
          'Gebeliğin 5. haftası (yaklaşık 30. gün)',
          'İlkel zar beynin çevresinde bir kapsül zar olarak dizilir; kafa kubbesinin ilk işaretidir',
          'Jin ve ark. (2016)',
        ],
        [
          'Carnegie 15. evre (yaklaşık 5. hafta)',
          'Gelişen beyni saran ara doku kılıfı: zarların, kafatasının ve kafa derisinin temeli',
          'Zedde ve Pascarella (2025a)',
        ],
        ['Döllenmeden sonra 33–36. gün', 'İlkel zar bütün beyni sarar', 'Ishikawa ve ark. (2026)'],
        ['Döllenmeden sonra 36–40. gün', 'Orta beyin bükümünün ucunda birincil tentoryum oluşur', 'Ishikawa ve ark. (2026)'],
        [
          'Döllenmeden sonra ~42. gün',
          'Katlara ayrılma: en içte yumuşak zar, dışta sert zar sınırlayıcı katı ve iskelet yapan kat',
          'Ishikawa ve ark. (2026)',
        ],
        ['Döllenmeden sonra ~6. hafta', 'İlkel zar beynin çoğunu sarar', 'Brøchner ve ark. (2015)'],
        ['Gebeliğin 6. haftası', 'Elektron mikroskobunda ayrı zar hücre katları seçilir', 'Dorrier ve ark. (2022)'],
        [
          'Döllenmeden sonra 8. hafta',
          'Claudin-11 taşıyan araknoid engel hücreleri beyincik çadırında ve beyin tabanında görülür',
          'Brøchner ve ark. (2015)',
        ],
        ['8. hafta', 'Beyincik çadırı iki narin kıvrım olarak gözle seçilir', 'Rai ve ark. (2018)'],
        ['Yaklaşık 11. hafta', 'Sırttaki sert zar sinüsleri yetişkin düzenine benzer', 'Ishikawa ve ark. (2026)'],
        [
          '12. hafta',
          'Hipofiz hâlâ gevşek ara dokudadır; yalnızca çatısı (gelecekteki hipofiz çadırı) olgun sert zarla örtülüdür',
          'Ishikawa ve ark. (2026)',
        ],
        ['Üçüncü ay (baş-popo uzunluğu 55 mm)', 'İki çadır kıvrımı arkada birleşir; düz sinüs gelişir', 'Rai ve ark. (2018)'],
        ['Gebeliğin ikinci üç ayı', 'Subaraknoid boşluk ve sisternalar tam gelişmiştir', 'Brøchner ve ark. (2015)'],
        ['Fetüste 13–36. haftalar', 'Fetüslerin %92’sinde büyük sisternada geçici bölmeler görülür', 'Ishikawa ve ark. (2026)'],
        [
          'Döllenmeden sonra 25–28. hafta',
          'Yüzeydeki radyal glia ayakları yumuşak zar altı glia limitansa dönüşmeye başlar',
          'Brøchner ve ark. (2015)',
        ],
        ['Gebeliğin 31–40. haftaları', 'Sert zardaki sinir yoğunluğu artar; doğumda en yüksektir', 'Davidson ve ark. (2012)'],
        ['Doğumdan sonraki 3 ay', 'Sert zar sinir yoğunluğu azalır; 50’li yaşlara dek düşük kalır', 'Davidson ve ark. (2012)'],
      ],
      not: 'Kaynaklar zamanı farklı birimlerle verir: döllenmeden sonraki gün ya da hafta, gebelik haftası, Carnegie evresi ya da embriyonun boyu. Bu yüzden tabloda her satır kaynağın kendi birimiyle yazıldı. Davidson ve ark. (2012) için yalnızca özet okundu. Doğumdan sonraki granülasyon bulguları aşağıdaki bebek tablosunda.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Köken: sinir kresti mi, mezoderm mi?** Farede yapılan soy izleme çalışmaları net bir ayrım çizer. Ön beyin zarlarının fibroblastları sinir krestinden gelir. Orta beyin, arka beyin ve omurilik zarlarınınkiler ise mezodermdendir (Derk ve ark., 2021). Bıldırcın ve tavuk embriyolarıyla yapılan birleşik embriyo (kimera) deneyleri de bunu destekler. Arka ön beyin ve orta beyin bölgesinden çıkan sinir kresti hücreleri ön beyin zarlarına katılır (Zedde ve Pascarella, 2025a).

Ishikawa ve arkadaşları biraz farklı bir harita verir. Onlara göre ilkel zarın hücreleri bölgeye göre farklı kökenlidir. Kafa kubbesi ve ön kafa tabanı bölgesinde büyük ölçüde sinir krestinden gelir. Arka kafa çukurunda ve omurilik sert zarında ise çoğunlukla mezodermdendir. Yazarlar sınırların henüz kesin olmadığını vurgular (Ishikawa ve ark., 2026).

Daha eski bir insan embriyosu çalışması kaynakları daha geniş sayar. O’Rahilly ve Müller, 8–23. evrelerdeki 61 embriyoyu inceledi. Altı olası kaynak sıraladılar: ön kordal plak, bölünmemiş eksen yanı mezoderm, bölünmüş eksen yanı (somit) mezoderm, sinir kresti, sinir kılıfı hücreleri ve sinir borusu (O’Rahilly ve Müller, 1986).

**İlkel zarın katları.** Jin ve arkadaşları ilkel zarı iki kata ayırır. İçteki **endomeninks** (ikincil zar), ince zarları yani örümcek ağı zarı ve yumuşak zarı yapar. Dıştaki **ektomeninks** ise iç sert zarı ve dışta kemik yapan katı oluşturur (Jin ve ark., 2016).

Brøchner ve arkadaşları daha ayrıntılı bir sıra verir. İlkel zar başta sinir kresti kökenli hücrelerden oluşur ve döllenmeden sonraki 6. hafta dolayında beynin çoğunu sarar. Sonra altı kat gelişir: deri altı doku, iskelet yapan kat, sert zar, sert zar sınırlayıcı katı, ince zarlar ve beyin duvarı (Brøchner ve ark., 2015). Sert zar sınırlayıcı katı büyük olasılıkla hem sert zara hem örümcek ağı zara katkı verir (Brøchner ve ark., 2015). O’Rahilly ve Müller’e göre embriyodaki bu kat (*Duragrenzschicht*), büyük olasılıkla yetişkindeki arayüz katmanına karşılık gelir (O’Rahilly ve Müller, 1986). İnce zar hücreleri sert zarın iç yüzünde yoğunlaşarak araknoid engel hücrelerini yapar. Beyin yüzeyinde ise yumuşak zarın yüzey katını oluştururlar (Brøchner ve ark., 2015).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Araknoid engel.** İnsan fetüsünde, sıkı bağlantı proteini Claudin-11’i taşıyan engel hücreleri döllenmeden sonraki 8. haftada görülür. İlk görüldükleri yerler beyincik çadırı ve beyin tabanıdır (Brøchner ve ark., 2015). Gebeliğin ortasında ön beyindeki engel, Claudin-11 taşıyan tek bir hücre katından oluşur (Brøchner ve ark., 2015). Bu engel damarsızdır ve yüzeyi görece küçüktür. Ama gelişen beyinde, beyin yüzeyinin çok daha büyük bir bölümünü kaplar (Brøchner ve ark., 2015).

**Glia limitans.** Beyin dokusunun yüzeyini ince bir sınır katı örter: glia limitans. Gelişimde yumuşak zarın bazal zarı, radyal glia denen uzun destek hücrelerinin uçlarının tutunduğu yerdir. Daha sonra buraya astrositlerin ayakları tutunur (Derk ve ark., 2021). İnsanda yüzeydeki radyal glia ayakları, döllenmeden sonraki 25–28. haftalarda yumuşak zar altı glia limitansa dönüşmeye başlar (Brøchner ve ark., 2015). Bu bazal zarı bozuk farelerde sinir hücreleri hem beyin kabuğunda hem beyincikte yanlış yerleşir (Zedde ve Pascarella, 2025a).

**İki ayrı sıvı sistemi.** Erken fetüste biri karıncıklarda, biri subaraknoid boşlukta olmak üzere iki ayrı BOS sistemi vardır. Dördüncü karıncığın orta ve yan açıklıkları (Magendie ve Luschka delikleri) gelişince ikisi tek sistem olur (Weller ve ark., 2018).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kıvrımlar ve sinüsler.** Rai ve arkadaşlarına göre beyincik çadırı, baş-popo uzunluğu 20 mm olan embriyoda mikroskopla görülebilir. 8. haftada iki narin kıvrım olarak gözle seçilir. Üçüncü ayda, baş-popo uzunluğu 55 mm iken iki kıvrım arkada birleşir ve düz sinüs gelişir (Rai ve ark., 2018).

Fetüs büyüdükçe çadır da döner. 10–29. gebelik haftalarındaki 46 fetüsün MR’ı incelendi. Büyük beyin beyincikten hızlı büyüdükçe çadırın orta hat kesiti arkaya ve aşağıya, büyük deliğe doğru döndü (Jeffery, 2002). Mori ve arkadaşlarına göre çadır, büyük beyin genişlerken meningeal katın içe katlanmasıyla oluşmaya başlar. Bu sırada çevredeki toplardamar ağlarını da içine alır (Mori ve ark., 2026).

Sinüsler kıvrımlarla birlikte biçimlenir. Çadır yataylaştıkça enine sinüs de yetişkindeki enine yerini alır (Ishikawa ve ark., 2026). Derin sagital toplardamar ağı alt sagital sinüse, yüzeydeki ağ üst sagital sinüse dönüşür. Düz sinüs, orak ile çadırın birleştiği açıda oluşur (Ishikawa ve ark., 2026). 10–16. haftalardaki fetüslerde düz sinüs, iki yandaki yumuşak zar toplardamarlarının birleşmesiyle başlar. Bu toplardamarlar yan karıncıkların koroid pleksusundan gelir. Aynı dönemde üst sagital sinüs az gelişmiştir; alt sagital sinüs ise henüz görülmez (Oyanagi ve ark., 2021). Jeffery (2002) ile Oyanagi ve arkadaşlarının (2021) çalışmalarının yalnızca özetleri okundu. Sinüslerin yetişkindeki düzeni “Sert zarın toplardamar sinüsleri” bölümünde.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Bebeğin zarları yetişkinden nasıl farklı?',
      sutunlar: ['Özellik', 'Bebekte', 'Kaynak'],
      satirlar: [
        [
          'Araknoid granülasyonlar',
          'Gray’e göre bebeklikte görülmez. MR’da yenidoğanların ve 2 yaşındakilerin %85’inde görünür granülasyon yoktur. Yenidoğanların %15’inde enine sinüste granülasyon vardır',
          'Gray (1918); Radoš ve ark. (2021)',
        ],
        [
          'Sert zarın kemiğe yapışması',
          'Sert zar kafatasının iç yüzüne, özellikle dikiş çizgileri çevresinde çok sıkı yapışıktır. Bu yüzden küçük bebeklerde akut epidural kanama görece seyrektir',
          'Araki ve ark. (2017)',
        ],
        ['Sert zarın iç damar ağı', 'Yetişkindekinden büyüktür; BOS emiliminde rol oynadığı öne sürülür', 'Mack ve ark. (2009)'],
        ['Sert zarın sinirleri', 'Yoğunluk doğumda en yüksektir; sonraki 3 ayda azalır', 'Davidson ve ark. (2012)'],
        [
          'Köprü toplardamarları',
          '43 bebek ve küçük çocuk otopsisinde beyin başına ortalama 54,1 (en çok 94). Yenidoğan ve bebeklerde duvarları daha incedir; bazılarında yalnızca 5–7 µm',
          'Cheshire ve ark. (2018); Cheshire ve ark. (2024)',
        ],
        [
          'Subaraknoid boşluğun genişliği',
          '0–3 aylık 125 sağlıklı bebekte ultrasonla üst sınırlar: kafatası–kabuk 3,1 mm, sinüs–kabuk 3,8 mm, yarımküreler arası 4,2 mm. Genişlik yaşla düzenli artar',
          'Çolak ve ark. (2026)',
        ],
        [
          'Zar lenf damarları',
          'Farede doğumdan sonra gelişir; önce kafa tabanındaki deliklerin çevresinde belirir. 4 ay–12 yaş arası 90 çocuğun MR’ında kalınlıkları ve sinyalleri yaşla ilişkiliydi',
          'Antila ve ark. (2017); Ying ve ark. (2026)',
        ],
      ],
      not: 'Çolak ve arkadaşlarının çalışması İzmir’den bir çalışmadır; yalnızca özeti okundu. Mack ve ark. (2009), Davidson ve ark. (2012) ve Cheshire ve ark. (2024) için de yalnızca özetler okundu. Köprü toplardamarları “Sert zarın toplardamar sinüsleri”, kanamalar “Kanamalar ve fıtıklaşmalar” bölümünde.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Gelişim aksarsa',
      md: `- **Araknoid kist.** Birincil araknoid kistler, anne karnında örümcek ağı zarın ikiye ayrılmasından doğar (Mustansir ve ark., 2018). Zedde ve Pascarella’ya göre ilkel zarın boşluklanma evresinde zarların ikilenmesi ya da kaynaşamaması bu kistlere yol açabilir (Zedde ve Pascarella, 2025a). Kistlerin kliniği “Zar iltihapları, tümörler ve basınç bozuklukları” bölümünde.
- **Beyin orağının yokluğu.** Doğuştan yokluk nadirdir ve genellikle holoprosensefalide görülür (Ishikawa ve ark., 2026).
- **Çadırın az gelişmesi.** Çadırın tam yokluğu bildirilmemiştir. Kısmi az gelişme olur ve çoğu zaman Chiari malformasyonuyla birliktedir (Ishikawa ve ark., 2026).
- **Sturge–Weber sendromu.** Bu hastalıkta ince zarlarda embriyodaki damar ağları sürer ve çoğalır; karmaşık damar yumakları oluşur (Patel ve ark., 2024).`,
    },

    // ——— Tarih: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Arapçadan Latinceye.** Woo ve arkadaşlarına göre *mater* sözcüğü Arapça *umm al-dimāgh*, yani “beynin anası” ifadesinden gelir. Bu ifadeyi Fars hekimi Haly Abbas (930–994) kullanmıştır (Woo ve ark., 2022). Arapçada zarlar başta iki katlı anlatılıyordu: “sert ana” (*umm al-galidah*) ve “ince ana” (*umm al-raqiqah*). Hristiyan keşişler bunları *dura mater* ve *pia mater* diye aktardı. *Pia* sözcüğü “dindar” ya da “sevgili” anlamı taşır (Woo ve ark., 2022).

Woo ve arkadaşlarının yorumuna göre doğru karşılık “ince” anlamındaki *tenue* olmalıydı. Haly Abbas, yumuşak zarın kabuğun kıvrımlarını sadakatle izlediğini anlatmıştı. Bu anlatım keşişleri dinsel anlamlı bir sözcüğe yöneltmiş olabilir (Woo ve ark., 2022). Bu yorum tek bir kaynağa dayanır. *Pia* için başka çeviriler de vardır: “narin ana” (OpenStax 13.3) ve “sevgi dolu ana” (Sehgal ve Das, 2023). Ishikawa ve arkadaşları ise çeviriyi bir kişiye bağlamaz. Onlara göre *dura mater*, Arapça *om al-ghalida* (“sert ana”) adının Latince karşılığıdır (Ishikawa ve ark., 2026).

**Çeviri zinciri.** Galenos’un yapıtları Süryanice ve Arapça çevirilerle yayıldı. Çevirmenlerinden biri Huneyn ibn İshak’tır (807–877) (Voogd ve De Zeeuw, 2020). Haly Abbas’ın *Kraliyet Kitabı* (*Kitab al-Maliki*), 11. yüzyılda Konstantin Afrikalı tarafından kısmen Latinceye çevrildi. Çeviride yazarın adı verilmedi (Acıduman ve ark., 2010). Bu Latince metin *Liber Pantegni* adını aldı ve ilk kapsamlı Latince tıp metni sayılır (Voogd ve De Zeeuw, 2020). Haly Abbas Avrupa’da, kitabı 1127’de Antakyalı Stephen tümüyle çevirince tanındı (Acıduman ve ark., 2010).

Orta Çağ’da Mondino’nun anatomi metni, Arapça, İbranice, Yunanca ve Latinceden gelen bozulmuş terimlerle doluydu. Aynı yapıya birkaç ad, birkaç yapıya tek ad veriliyordu (Parent, 2019). Vesalius ise *Fabrica*’da eski Yunanca ve Arapça terimlerin yerine, kullanılmakta olan Latince terimleri koydu (Pretterklieber, 2024). *Meninx* ise Latince kuralına karşın kalıcı olan Yunanca terimlerdendir (Pretterklieber, 2024).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zarların keşif çizelgesi',
      sutunlar: ['Yıl', 'Kim', 'Ne oldu?', 'Kaynak'],
      satirlar: [
        [
          'MÖ 335–280',
          'Herophilos',
          'Koroid pleksusun en eski tanımı (“koroid meninks”) büyük olasılıkla ona dayanır. Sinüslerin birleşim yerinin eski adı *torcular Herophili* onun adını taşır ve bugün de kullanılır. TA2’deki resmî ad ise *confluens sinuum*’dur',
          'Dzierżanowski ve ark. (2026); Bay ve Bay (2010); FIPAT (2019)',
        ],
        ['MÖ 304–250', 'Erasistratos', 'Beyni saran örtülerin hepsine *meninx* dedi', 'Ishikawa ve ark. (2026)'],
        [
          'MS 129–200',
          'Galenos',
          'Sert zarı ve yumuşak zarı tanımladı; dıştaki kalın zara *pachymeninx* dedi',
          'Zedde ve Pascarella (2025a); Ishikawa ve ark. (2026)',
        ],
        ['807–877', 'Huneyn ibn İshak', 'Galenos’un çevirmenlerinden biri', 'Voogd ve De Zeeuw (2020)'],
        ['930–994', 'Haly Abbas', 'Bir yoruma göre zarları “beynin anası” diye anlattı', 'Woo ve ark. (2022)'],
        [
          '11. yüzyıl',
          'Konstantin Afrikalı',
          'Haly Abbas’ın kitabını yazar adı vermeden kısmen Latinceye çevirdi',
          'Acıduman ve ark. (2010)',
        ],
        ['1127', 'Antakyalı Stephen', 'Kitabın tam Latince çevirisi', 'Acıduman ve ark. (2010)'],
        [
          '1490–1492',
          'Leonardo da Vinci',
          'Baş kesiti çizimlerinde karıncıklarla birlikte zar sistemini gösterdi',
          'Dzierżanowski ve ark. (2026)',
        ],
        [
          'Rönesans',
          'Berengario da Carpi',
          'Sert zarı “beyinden buharların çıkması için gözenekli” bir örtü diye anlattı. Yumuşak zara, beyni beslediği için eş zarı anlamında *secundina* da dendiğini yazdı',
          'Parent (2019)',
        ],
        [
          '1664',
          'Thomas Willis',
          'Sinüslerin içindeki lifli bantları tanımladı (*chordae Willisii*). Kafatası içindeki sıvının kalbur kemiğinden boşaldığını öne sürdü',
          'Zedde ve Pascarella (2025a); Proulx (2021)',
        ],
        [
          '1664 ya da 1666',
          'Gerardus Blasius',
          'Örümcek ağı zarı tanımlayıp adlandırdı',
          'Zedde ve Pascarella (2025a); Rabelo ve ark. (2021)',
        ],
        ['1690’lar', 'Humphrey Ridley', 'Subaraknoid sisterna kavramını getirdi', 'Zedde ve Pascarella (2025a)'],
        ['1705', 'Antonio Pacchioni', 'Araknoid granülasyonların ilk tanımı; onları bez sandı', 'Proulx (2021); Brunori ve ark. (1993)'],
        ['1732', 'Jacques Bénigne Winslow', 'Beyincik çadırı için ilk kez “çadır” (*La Tente*) adını kullandı', 'Ita ve Bordoni (2023)'],
        ['1764', 'Cotugno', 'Karıncıklarda sulu bir sıvı olduğunu fark etti', 'Mantovani ve ark. (2018)'],
        ['1787', 'Mascagni', 'İnsan sert zarında lenf damarlarını bildirdi', 'Ishikawa ve ark. (2026)'],
        [
          '1800',
          'Bichat',
          'Örümcek ağı zarın üçüncü karıncıkla bağlantılı kapalı bir kese olduğunu öne sürdü',
          'Zedde ve Pascarella (2025a)',
        ],
        [
          '1825, 1828, 1842',
          'François Magendie',
          'BOS’un önemini kavradı (1825). Bulgularını Paris Bilimler Akademisi’ne sundu (1828). Karıncıklardaki BOS’un subaraknoid boşlukla serbestçe iletiştiğini gösterdi (1842)',
          'Mantovani ve ark. (2018); Bych ve ark. (2026); Zedde ve Pascarella (2025a)',
        ],
        ['1828', 'John Abercrombie', '“Menenjit” sözcüğü onun tanımıyla genel kullanıma girdi', 'Tristram ve Kondamudi (2026)'],
        ['1840’lar', 'Durand-Fardel ve Pestalozzi', 'Damar çevresi boşlukları ilk kez tanımladı', 'Barisano ve ark. (2022)'],
        ['1844', 'Rokitansky', 'Örümcek ağı zarın sıvıyı içeren bir kese olduğunu söyledi', 'Zedde ve Pascarella (2025a)'],
        [
          '1851 ve 1859',
          'Rudolf Virchow; Charles Philippe Robin',
          'Damar çevresi boşlukları anlattılar; boşluklar bugün onların adıyla anılır',
          'Barisano ve ark. (2022)',
        ],
        [
          '1855',
          'von Luschka',
          'Örümcek ağı zar kesesindeki sıvının dördüncü karıncıkla bağlantısını buldu',
          'Zedde ve Pascarella (2025a)',
        ],
        [
          '1856',
          'Rudolf Virchow',
          'Sert zar altındaki kan birikimlerine *pachymeningitis interna haemorrhagica* adını verdi',
          'Berthold ve ark. (2025)',
        ],
        [
          '1869',
          'Schwalbe',
          'BOS’a verilen izleyicinin köpekte kafa dışı lenf damarlarına ulaştığını gösterdi',
          'Mezey ve ark. (2021); Proulx (2021)',
        ],
        [
          '1875',
          'Axel Key ve Magnus Retzius',
          'Boya deneyleriyle araknoid çıkıntılardan toplardamarlara giden yolları gösterdiler',
          'Proulx (2021)',
        ],
        ['1891', 'Quincke', 'İlk bel delmeyi (lomber ponksiyon) yaptığı kabul edilir', 'Swyden ve ark. (2023)'],
        [
          '1898',
          'August Bier',
          'Bel delme sonrası baş ağrısı üzerine gözlemlerini bildirdi. Ağrıyı, delikten süren BOS kaçağına bağladı',
          'Swyden ve ark. (2023)',
        ],
        ['1908', 'Harvey Cushing', 'Sert zarın iki katının özenle yaklaştırılarak kapatılmasını önerdi', 'Wang ve ark. (2023)'],
        ['1914', 'Lewis Weed', 'BOS’un araknoid villuslardan boşaldığı görüşünü kurdu', 'Proulx (2021)'],
        ['1919', 'Walter Dandy', 'Pnömoensefalografi: subaraknoid boşluğun radyolojik incelemesi başladı', 'Zedde ve Pascarella (2025a)'],
        ['1920', 'James Bourne Ayer', 'Büyük sisternaya iğneyle girmeyi (sisterna ponksiyonu) kliniğe soktu', 'Lutters ve Koehler (2020)'],
        ['1926', 'Walter Dandy', 'Sert zarı ilk kez hastanın kendi uyluk fasyasıyla onardı', 'Splavski ve Frol (2025)'],
        [
          '1956',
          'Bengt Liliequist',
          'Pnömoensefalografide havanın interpedinküler sisternada duraksadığını gördü ve zarı bu gözlemle tanımladı. Zar onun adıyla anılır. Bir kaynağa göre ilk tanım 1875’te Key ve Retzius’undur',
          'Zedde ve Pascarella (2025a); Dias ve ark. (2014)',
        ],
        ['1960', 'Gormley', 'İlk epidural kan yaması (2–3 mL kanla)', 'Shin (2022)'],
        ['1968', 'Klintworth', 'Karşılaştırmalı anatomi: çadır kuşlarda ve memelilerde var', 'Rai ve ark. (2018)'],
        [
          '1970’lerin ortası',
          'M. Gazi Yaşargil',
          'Bugünkü sisterna adlandırmasının büyük ölçüde dayandığı tam tanım',
          'Villanueva ve ark. (2023)',
        ],
        ['1975', 'Nabeshima ve arkadaşları', 'Sert zarın sınır hücre katmanının ilk tanımı', 'Ishikawa ve ark. (2026)'],
        ['1980’ler', '—', 'Sert zarın ağrı alıcı sinirlerle donandığı kanıtlandı', 'Bernstein ve Burstein (2012)'],
        ['1991', 'Haines', '“Subdural boşluk” denen bir aralığa dair kanıt olmadığını gösterdi', 'Haines (1991)'],
        ['2012', '—', '“Glenfatik” sözcüğü ortaya atıldı', 'Hladky ve Barrand (2022)'],
        [
          '2015',
          'Louveau ve ark.; Aspelund ve ark.',
          'Farede sert zar lenf damarları yeniden keşfedildi',
          'Louveau ve ark. (2015); Aspelund ve ark. (2015)',
        ],
        [
          '2017',
          'Absinta ve ark.',
          'İnsanda ve marmoset maymununda zar lenf damarları gösterildi ve klinik MR ile görüntülendi',
          'Absinta ve ark. (2017)',
        ],
        ['2019', 'FIPAT', 'TA2 subdural ve kafa içi epidural boşluğu “her zaman bulunmayan” diye işaretledi', 'FIPAT (2019)'],
        ['2023', 'Møllgård ve ark.', 'Dördüncü bir zar (SLYM) önerildi; öneri tartışmalıdır', 'Møllgård ve ark. (2023)'],
        [
          '2024',
          'Smyth ve ark.',
          'Köprü toplardamarlarının örümcek ağı zarı geçtiği yerlerde engelde açıklıklar önerildi: araknoid manşet çıkış noktaları. Bu yapılar farede gösterildi; insanda MR izleyicisinin köprü toplardamarları boyunca ilerlemesi bulguyu destekledi. Doğrulanması gerekir',
          'Smyth ve ark. (2024); Joost ve ark. (2026)',
        ],
      ],
      not: 'Bazı tarihler kaynaktan kaynağa değişir: Blasius için 1664 (Zedde ve Pascarella, 2025a) ya da 1666 (Rabelo ve ark., 2021); Key ve Retzius için 1875 (Proulx, 2021) ya da 1869 (Zedde ve Pascarella, 2025a). Acıduman ve ark. (2010), Brunori ve ark. (1993), Haines (1991), Tristram ve Kondamudi (2026), Swyden ve ark. (2023), Ita ve Bordoni (2023), Møllgård ve ark. (2023) ve Smyth ve ark. (2024) için yalnızca özetler okundu.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Türk tıp tarihinden.** Ankara Üniversitesi’nden tıp tarihçileri, Haly Abbas’ın kitabını ve onun Avrupa’ya geçişini incelemiştir (Acıduman ve ark., 2010). Türkçe yazılmış ilk resimli anatomi el yazması ise Şemseddîn-i Itâkî’nin 17. yüzyılda yazdığı *Teşrih-ül Ebdan* kabul edilir (Bahşi ve Bahşi, 2019).

Bu derste zarların Osmanlıca adlarını vermiyoruz. Çünkü bu adlar, açık ve doğrulanabilir bir kaynakta bulunamadı. Bugünkü Türkçe adlar için yalnızca Türk Dil Kurumu sözlüğüne dayanıyoruz (TDK, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- İlkel zar: 22–24. gün oluşur, 33–36. gün bütün beyni sarar, ~42. gün katlara ayrılır (Ishikawa).
- Endomeninks → ince zarlar (örümcek ağı zar + yumuşak zar). Ektomeninks → iç sert zar + kemik yapan kat (Jin).
- Ön beyin zar fibroblastları sinir krestinden; orta beyin, arka beyin, omurilik zarları mezodermden. Zar damarlarının endoteli her yerde mezodermden.
- İlk gelişen sert zar uzantısı: beyincik çadırı. Birincil tentoryum: orta beyin bükümünün ucunda, 36–40. gün.
- Büyük beyin ile ara beyin arasında sert zar kıvrımı yok; yumuşak zar katlantısı (koroid tela) var.
- Granülasyonlar: Gray’e göre bebeklikte görülmez, genellikle 7 yaştan sonra bulunur. MR’da yenidoğan ve 2 yaşta %85’inde görünmez; yenidoğanların %15’inde enine sinüste görünür (Radoš).
- Adlar: *meninx* (Erasistratos), *pachymeninx* (Galenos), *om/umm* → *mater* (Arapça çeviri).
- Keşifler: Blasius 1664 ya da 1666; Pacchioni 1705; Key ve Retzius 1875 (bir kaynağa göre 1869); Weed 1914; Nabeshima 1975. Lenf damarları: 1787 → 2015.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Granülasyonsuz bir bebek',
      oyku: 'Bir çocuk doktoru, 3 haftalık bir bebeğin beyin MR raporunu okuyor. MR başka bir nedenle çekilmiş ve normal bulunmuş. Rapora bir not eklenmiş: “Sert zar sinüslerinde araknoid granülasyon izlenmedi.” Bebeğin ailesi kaygılanıyor: “Bu yapılar eksik mi?”',
      soru: 'Bebekte granülasyon görülmemesi olağan mıdır? Granülasyonlar gelişmeden önce BOS hangi yollarla uzaklaştırılıyor olabilir?',
      cozum: `**Olağandır.** 3 tesla MR ile yapılan bir çalışmada yenidoğanların ve iki yaşındakilerin %85’inde sinüslerde görünür granülasyon yoktu. Yenidoğanların yalnızca %15’inde enine sinüste granülasyon görüldü (Radoš ve ark., 2021). Gray de granülasyonların bebeklikte görülmediğini yazmıştı (Gray, 1918). Embriyo ve fetüslerin doku incelemelerinde de sinüslerde granülasyon bulunmamıştır (Radoš ve ark., 2021).

**BOS nereye gider?** Weller ve arkadaşlarına göre fetüste granülasyon yoktur. Bu yüzden BOS büyük olasılıkla kalbur kemiğinden ve burun mukozasının altından geçen lenf yollarıyla atılır (Weller ve ark., 2018). Mack ve arkadaşları ise bebekte sert zarın iç damar ağının yetişkindekinden büyük olduğunu yazar. Bu ağın BOS emiliminde rol oynadığı öne sürülür (Mack ve ark., 2009). Granülasyonların alt omurgalılarda ve insan bebeklerinde bulunamaması, BOS emilimindeki rollerine karşı erken bir itiraz olmuştu (Proulx, 2021).

Aileye bulgunun yaşa uygun olduğu anlatılabilir. Bebeğin izlemi hekiminin kararıdır. BOS emiliminin ayrıntısı “Karıncıklar ve beyin-omurilik sıvısı” dersinde anlatılacak. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Farede takvim.** Ön beyin zar fibroblastları yaklaşık embriyonik 9. günde (E9) sinir krestinden, henüz farklılaşmamış ara doku hücreleri olarak belirir. E10’da ön beyni tümüyle örter. Katlara özgü işaretler E12’de görünmeye başlar (Dorrier ve ark., 2022). E13.5’te ventral ön beyinde yumuşak zar, örümcek ağı zar ve sert zar ayırt edilebilir (Derk ve ark., 2021). Elektron mikroskobu çalışmaları ayrı zar hücre katlarını kemirgende E13’te tanımlar (Dorrier ve ark., 2022). Yumuşak zarın damar ağı farede E8’de omurilik çevresinde oluşmaya başlar. E10’dan itibaren ön beyni sarar (Derk ve ark., 2021).

**Araknoid engel.** Farede engel hücreleri ön beyinde yaklaşık E13’te görülür. İlkel zarın ara doku hücrelerinden farklılaşırlar (Derk ve ark., 2021). Bu hücrelerin belirlenmesi için Wnt-β-katenin sinyalinin baskılanması gerekir. Sürekli etkin β-katenin engelin oluşmasını önleyebilir (Derk ve ark., 2023). Engel doğumdan önce çalışır. Engel yokken çevreden verilen küçük bir işaretleyici ve B grubu streptokok bakterisi merkezî sinir sistemine geçebilir (Derk ve ark., 2023). Sıçanda Claudin-11 boyanması E10–E14 arasında hiç yoktur ve E15’te soluk başlar. E18’de bütün engel güçlü boyanır (Brøchner ve ark., 2015).

**Zarlar beyni de biçimlendirir.** Zarlar CXCL12 adlı çekici bir sinyal salgılar; bu sinyalin öteki adı SDF-1’dir. Onu FOXC1 adlı bir gen düzenleyicisi etkinleştirir. Zarlar ayrıca retinoik asit üretir. Bu sinyaller sinir hücrelerinin göçünü, kabuğun katmanlaşmasını ve damar gelişimini etkiler (Zedde ve Pascarella, 2025a). Örümcek ağı zar fibroblastları, retinoik asit yapan RALDH2 enzimini ve onu bağlayan CRABP2 proteinini taşır (Derk ve ark., 2021). Sert zarın salgıladığı SDF1, beyincikteki dış tanecikli katman hücrelerinin ve beyin kabuğundaki Cajal–Retzius hücrelerinin göçüne yol gösterir (Ishikawa ve ark., 2026).

Tavuk embriyosunda sinir kresti yok edilince ön beyin zarları oluşmaz. Ön beynin sinir dokusunda da yaygın hücre ölümü olur (Zedde ve Pascarella, 2025a). Foxc1 ve Twist1 genlerinin eksikliğinde kafatası, sert zar, örümcek ağı zar ve subaraknoid boşluk bozuk gelişir ya da hiç gelişmez (Ishikawa ve ark., 2026). Sert zar atardamarları da gelişimde büyük değişime uğrar. Embriyodaki stapedial atardamar ve dalları gerileyerek yerini orta meningeal atardamar gibi dış karotis dallarına bırakır (Ishikawa ve ark., 2026; Ota, 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türler arasında zarlar',
      sutunlar: ['Canlı', 'Bulgu', 'Kaynak'],
      satirlar: [
        [
          'Lamprey (çenesiz balık)',
          'Zarlar dört katlıdır. En dış katın, damar ağının içinde kalan iç kısmı gerçek sert zara karşılık gelir. II. kat örümcek ağı zara, IV. kat yumuşak zara karşılık gelir. Subaraknoid boşluk yoktur; yerinde jelatinimsi bir III. kat bulunur',
          'Nakao (1979)',
        ],
        [
          'Çenesiz balıklardan insana',
          'Sıkı bağlantılı araknoid engel hücreleri birçok türde vardır; yapı evrimde korunmuştur',
          'Derk ve ark. (2021)',
        ],
        [
          'Balık, amfibi, sürüngen; kuş, memeli',
          'Beyincik çadırı ilk üç grupta yoktur; kuşlarda ve memelilerde vardır',
          'Rai ve ark. (2018)',
        ],
        [
          'Kedi; köpek, yunus',
          'Yetişkin kedide çadır tümüyle kemikleşmiştir. Köpekte ve yunusta kemikleşme arka-iç bölümle sınırlıdır',
          'Rai ve ark. (2018)',
        ],
        [
          'İnsan; sıçan, koyun',
          'İnsanda sert zarın ayrı periostal ve meningeal katları vardır. Sıçanda ya da koyunda tek bir lifli-damarlı kat olabilir',
          'Joost ve ark. (2026)',
        ],
        [
          'İnsan ve 10 hayvan türü',
          'Her türde en az bir lifli-damarlı kat ve altında bir sınır hücre katı vardı. En kalın sert zar insanınkiydi (564 µm). Onu at (313 µm), sığır (311 µm) ve domuz (304 µm) izledi',
          'Kinaci ve ark. (2020)',
        ],
        [
          'İnsan ve sıçan; fare',
          'İnsanda ve sıçanda trabeküller fibroblastlarla sarılı kolajen sütunlardır. Farede sütun görülmez; boşluğu fibroblast uzantıları geçer',
          'Derk ve ark. (2021)',
        ],
        [
          'Büyük hayvanlar; kemirgenler',
          'Granülasyonlar genellikle büyük hayvanlarda tanımlanır; kemirgenlerde tanımlanmaz',
          'Proulx (2021)',
        ],
        [
          'Memeliler (fare dahil)',
          'Kafa tepesinde sert zar genellikle ince zarlardan kalındır; ikisi de damar ve sinir bakımından zengindir',
          'Coles ve ark. (2017)',
        ],
        [
          'Balıktan insana',
          'Zar lenf damarları insanda, insan dışı primatlarda, sıçanda, farede ve balıkta tanımlanmıştır',
          'Joost ve ark. (2026)',
        ],
        [
          'İnsan omuriliği',
          'İnsan omurilik zarlarının ince yapısı, öteki memelilerde tanımlanandan belirgin biçimde farklıdır',
          'Nicholas ve Weller (1988)',
        ],
      ],
      not: 'Türler arasındaki bu farklar yüzünden hayvan bulguları insana dikkatle aktarılmalıdır (Joost ve ark., 2026). Nakao (1979), Kinaci ve ark. (2020), Coles ve ark. (2017) ve Nicholas ve Weller (1988) için yalnızca özetler okundu.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**“Subdural boşluk” fikrinin tarihi.** 1856’da Rudolf Virchow, Fransız patologların sert zar altındaki kan birikimi dediği tabloya *pachymeningitis interna haemorrhagica* adını verdi. Ona göre süreç bir zar iltihabıydı (Berthold ve ark., 2025). Bu görüş Almanca konuşulan tıp dünyasında bir sapmaya yol açtı. Klinisyenler yarım yüzyıl boyunca iltihabi bir neden aradı (Berthold ve ark., 2025). Virchow aynı yıl, örümcek ağı zar kesesinde normal bir sıvı bulunduğu fikrine de karşı çıktı (Zedde ve Pascarella, 2025a).

Gray (1918), omurilikte sert zar ile örümcek ağı zar arasında “olası bir boşluk” tanımlar ve onu seröz bir boşluğa benzetir (Gray, 1918). Weed’in 1914’teki kedi kesitlerinde de geniş bir “subdural boşluk” görülür. Proulx bunu doku hazırlığının yarattığı yapay bir görüntü sayar (Proulx, 2021).

Sert zarın en iç hücre katmanını 1975’te Nabeshima ve arkadaşları tanımladı (Ishikawa ve ark., 2026). Aynı yıl, elektron mikroskobu çalışmaları araknoid engel hücrelerinin sıkı bağlantılarla dolu olduğunu gösterdi (Derk ve ark., 2021). Sınır hücre katmanı eskiden mezotel katmanı, nörotelyum ya da subdural hücre katmanı gibi adlarla anılırdı. Bugün standart adı “sert zar sınır hücre katmanı”dır (Ishikawa ve ark., 2026). Haines 1991’de, bu katman ile araknoid engel katmanı arasında bir boşluk olduğuna dair kanıt bulunmadığını gösterdi (Haines, 1991). 1993’te arkadaşlarıyla birlikte, bir boşluk açıldığında bunun “subdural” değil, ayrı bir hücre katmanının içinde olduğunu yazdı (Haines ve ark., 1993). TA2 de subdural boşluğu “her zaman bulunmayan” diye işaretledi (FIPAT, 2019). Bugün bazı yazarlar kronik “subdural” kanama için “sert zar sınır hematomu” adını öneriyor (De Simone ve ark., 2026).

**Granülasyonlara yüklenen görev.** Pacchioni bu yapıları sert zarın bezleri sandı. Bezlerin, zarlar ile beyin arasındaki kaymayı kolaylaştırmak için lenf salgıladığını düşündü (Brunori ve ark., 1993). Görevleri, 1875’te yayımlanan Key ve Retzius deneylerine dek bilinmiyordu (Proulx, 2021). Bu deneylerde enjeksiyon basıncı 60 mmHg’nin üstündeydi ve villusları yırtmış olabilir (Mantovani ve ark., 2018). Harvey Cushing, Theodor Kocher’in yanında çalışırken subaraknoid boşluk ile sinüsler arasında tek yönlü kapakçıklar olması gerektiğini öne sürdü (Proulx, 2021). Welch ve arkadaşları, maymun ve köpekten alınmış sert zar parçalarında villusların içinde açık kanallar tanımladı (Proulx, 2021). Welch ve Friedman bu kanalların tek yönlü kapakçık gibi çalıştığını öne sürdü (Radoš ve ark., 2021). Ama elektron mikroskobu böyle kapakçıklar gösteremedi (Radoš ve ark., 2021).

1914’te Lewis Weed, BOS’un araknoid villuslardan boşaldığı görüşünü kurdu. Bu görüş ders kitaplarında büyük ölçüde bugüne dek sürdü (Proulx, 2021). Ama o dönemde tam kabul görmedi. Dandy, köpeklerde yarımküreleri sert zardan ayırdığında aylar sonra bile karıncıklarda genişleme görmedi (Proulx, 2021). Bugünkü tartışma “Örümcek ağı zar” bölümünde. Konu “Karıncıklar ve beyin-omurilik sıvısı” dersinde de anlatılacak.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Tarih neden farklı anlatılır?',
      md: `- ***Meninx* adı.** Ishikawa ve arkadaşları adı Erasistratos’a bağlar (Ishikawa ve ark., 2026). Bay ve Bay ise zarları ve karıncıkları adlandıranın Herophilos olduğunu yazar (Bay ve Bay, 2010).
- **Örümcek ağı zarın adı.** Woo ve arkadaşlarına göre Herophilos (MÖ 335–280) trabekülleri örümcek ağına benzetti ve katmana “araknoid” adını verdi (Woo ve ark., 2022). Zedde ve Pascarella’ya göre ise zar 17. yüzyıla dek tanınmadı; onu 1664’te Gerardus Blasius tanımlayıp adlandırdı (Zedde ve Pascarella, 2025a). Rabelo ve arkadaşları bu yılı 1666 verir (Rabelo ve ark., 2021). Blasius’un yaşam tarihleri de iki kaynakta farklıdır: 1626–1692 (Zedde ve Pascarella, 2025a) ve 1627–1682 (Rabelo ve ark., 2021). Sanan ve van Loveren’e göre eski anatomistler sert zarı ve yumuşak zarı biliyordu; aradaki zar 17. yüzyılda keşfedildi (Sanan ve van Loveren, 1999). Bu ders şu anlatımı kullanır: örümcek ağı benzetmesi eskidir; zarın ayrı bir katman olarak tanınması 17. yüzyıldır.
- **Pacchioni.** Proulx ve Brunori ve arkadaşları ilk tanımı 1705’e koyar (Proulx, 2021; Brunori ve ark., 1993). Shah ve arkadaşları bu yapıların 16. yüzyıl kadar erken tanımlandığını yazar (Shah ve ark., 2023). Pacchioni 1665’te doğduğu için bu erken tarih ona bağlanamaz (Brunori ve ark., 1993).
- **Key ve Retzius.** Çoğu kaynak deneyleri 1875’e koyar (Proulx, 2021; Mantovani ve ark., 2018; Gouveia-Freitas ve Bastos-Leite, 2021). Zedde ve Pascarella ise 1869 der (Zedde ve Pascarella, 2025a).
- **Magendie.** 1825 (Mantovani ve ark., 2018), 1828 (Bych ve ark., 2026) ve 1842 (Zedde ve Pascarella, 2025a) farklı olaylardır: önemi kavraması, Akademi’ye sunumu ve iletişimi göstermesi.
- **Weed 1914.** Proulx’a göre Weed boyanın çökeltisini villuslarda gördü ve villus boşalımı görüşünü kurdu (Proulx, 2021). Mantovani ve arkadaşlarına göre ise Weed, düşük basınçla (9–13 mmHg) yinelediği deneyde sinüslerde boyalı jelatin bulmadı (Mantovani ve ark., 2018). Weed’in özgün makalesi açık erişimde okunamadı.
- **Liliequist zarı.** Zedde ve Pascarella zarın 1956’da tanımlandığını yazar (Zedde ve Pascarella, 2025a). Dias ve arkadaşlarına göre zarı ilk kez 1875’te Key ve Retzius tanımlamış, Liliequist 1956’da incelemiştir (Dias ve ark., 2014). Volovici ve arkadaşlarının tablosu ise “Liliequist, 1959” künyesini verir (Volovici ve ark., 2020).
- **Sisternalar.** Villanueva ve arkadaşları “1699’dan beri” der (Villanueva ve ark., 2023). Zedde ve Pascarella kavramı 1690’larda Ridley’ye bağlar (Zedde ve Pascarella, 2025a).
- **İlkel zarın takvimi.** Ishikawa ve arkadaşları oluşumu 22–24. güne, bütün beyni sarmasını 33–36. güne koyar (Ishikawa ve ark., 2026). Jin ve arkadaşları gebeliğin 5. haftasını, yaklaşık 30. günü verir (Jin ve ark., 2016). Zedde ve Pascarella Carnegie 15. evreyi (yaklaşık 5. hafta) verir (Zedde ve Pascarella, 2025a). Brøchner ve arkadaşlarına göre ilkel zar döllenmeden sonraki 6. hafta dolayında beynin çoğunu sarar (Brøchner ve ark., 2015). Farklar kısmen hangi evrenin anlatıldığından, kısmen de zamanın nasıl sayıldığından gelir.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Zarların cerrahi tarihinden',
      md: `- Haly Abbas, sıvının kemik ile sert zar arasında toplandığı hidrosefali tipinde cerrahi önermedi (Acıduman ve ark., 2014).
- Berengario da Carpi, zarların yaralandığı ve sağlam kaldığı kafa yaralanmalarının belirtilerini ayırt etti (Parent, 2019).
- 1884’te Francesco Durante bir koku oluğu menenjiyomunu çıkardı. Bu, belgelenmiş ilk kafa tabanı tümörü çıkarımıdır (Pamir ve ark., 2026).
- 1908’de Harvey Cushing, sert zarın iki katının özenle yaklaştırılması gerektiğini yazdı (Wang ve ark., 2023).
- 1926’da Walter Dandy sert zarı ilk kez hastanın kendi uyluk fasyasıyla (*fascia lata*) onardı (Splavski ve Frol, 2025).
- Beyin cerrahisinde ameliyat mikroskobunu ilk kez 1957’de Theodore Kurze kullandı (Pamir ve ark., 2026).
- 1969’da M. Gazi Yaşargil mikroskop için dengeli, yüzen bir ayaklık geliştirdi. Böylece mikroskop bütün beyin ameliyatlarında düzenli olarak kullanılabildi (Pamir ve ark., 2026).

Ayrıntılar “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Beyincik orağı nerede?',
      oyku: 'Bir radyoloji asistanı, baş ağrısı nedeniyle MR çekilen 24 yaşında bir kadının görüntülerini inceliyor. Raporda Chiari malformasyonu ön tanısı var. Asistan arka kafa çukurunun küçük göründüğünü fark ediyor. Beyincik orağını hiçbir kesitte seçemiyor. Beyincik çadırı da yer yer ince ve kısa görünüyor.',
      soru: 'Bu sert zar bulguları gelişimle nasıl açıklanabilir? Bir sert zar kıvrımının hiç olmaması ne kadar olasıdır?',
      cozum: `**Kıvrımlar sıkışan ilkel zardan doğar.** Beyin orağı, beyincik çadırı ve beyincik orağı ilkel zardan oluşur. Bu zar, gelişen beyin bölümleri arasında sıkışır ya da katlanır (Ishikawa ve ark., 2026). Chiari malformasyonlarında beyincik orağı ve iç art kafa kristası bulunmayabilir. Yazarlara göre bunun nedeni, küçük arka çukurun araya giren ilkel zarı dışarı itmesi olabilir (Ishikawa ve ark., 2026).

**Çadır.** Çadırın tam yokluğu bildirilmemiştir. Kısmi az gelişme olur ve çoğu zaman Chiari malformasyonuyla birliktedir (Ishikawa ve ark., 2026).

**Orak.** Beyin orağının doğuştan yokluğu nadirdir ve genellikle holoprosensefalide görülür. Orak yoksa alt sagital sinüs de zorunlu olarak yoktur. Üst sagital sinüs ise bildirilen 3 olgunun 1’inde oluşmuştur (Ishikawa ve ark., 2026).

Bu bulgular gelişimsel bir öyküye uyar. Tanı ve tedavi kararı uzman ekibe aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
