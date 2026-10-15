import type { DersBolumu } from '../../../types';

/**
 * 12. bölüm: Zar iltihapları (menenjit, kalın zar iltihabı, zara yayılan kanser), zar tümörleri (menenjiyom,
 * soliter fibröz tümör), kafa içi düşük basınç ve bel delme sonrası baş ağrısı, araknoid kist, sert zar
 * atardamar-toplardamar fistülü ve sert zarda kireçlenme; Türkiye’den çalışmalar.
 */

/** Sahnelerdeki renkler (yalnızca bölgeyi tanıtır; iyi ya da kötü anlamı taşımaz). */
const PARASAGITAL = '#e07a3f';
const KUBBE = '#e9c46a';
const CADIR = '#b4553c';
const SAKAK = '#e9a23b';

export const iltihapTumorVeBasinc: DersBolumu = {
  id: 'iltihap-tumor-ve-basinc',
  baslik: 'Zar iltihapları, tümörler ve basınç bozuklukları',
  bloklar: [
    // ——— Giriş: temel ———
    {
      tur: 'metin',
      md: `Zarlar beyni korur. Ama zarların kendisi de hastalanabilir. Bu bölümde zarların üç büyük sorununu tanıyacaksın:

- **İltihap:** Zarlar iltihaplanır. Bakteri ya da virüs enfeksiyonu buna yol açabilir (OpenStax 13.3). En bilinen örneği menenjittir.
- **Tümör:** Zarın hücreleri çoğalır ve bir kitle yapar. En sık örneği menenjiyomdur.
- **Basınç bozukluğu:** Sert zarda bir delik açılır ve beyin-omurilik sıvısı (BOS) sızar. Kafanın içindeki basınç düşer.

Bölümün sonunda üç konu daha var: zarın içinde sıvı dolu bir kese (araknoid kist), sert zarda damarların kısa devresi (fistül) ve sert zarda kireçlenme. Zarlar arasındaki kanamaları ise “Kanamalar ve fıtıklaşmalar” bölümünde gördük.`,
    },

    // ——— Menenjit: temel ———
    {
      tur: 'metin',
      md: `**Menenjit** (*meningitis*), beyni ve omuriliği saran ince dokunun, yani zarların iltihabıdır (MedlinePlus, t.y.). Örümcek ağı zar ile yumuşak zara birlikte **ince zarlar** (*leptomeninges*) denir. İkisinin arasındaki subaraknoid boşlukta BOS bulunur (Kohil ve ark., 2021). Bakteriler bu boşluğa ulaşınca ince zarların yüzeyi boyunca hızla çoğalır ve yayılır. BOS’un akışı da bu yayılmayı büyük olasılıkla kolaylaştırır (Joost ve ark., 2026).

Menenjitin iki büyük türü vardır:

- **Viral menenjit**, bakteriyel menenjitten çok daha sıktır. Genellikle daha hafif geçer (Tristram ve Kondamudi, 2026).
- **Bakteriyel menenjit** daha ağırdır (OpenStax 13.3). Hayatı tehdit eder ve hemen tedavi ister (Dafny, 2020). Antibiyotikler bulunmadan önce bakteriyel menenjit her zaman ölümle sonuçlanırdı (Tristram ve Kondamudi, 2026).`,
    },
    {
      tur: 'metin',
      md: `**Belirtiler.** Dünya Sağlık Örgütü’ne (DSÖ) göre menenjitin sık belirtileri şunlardır (DSÖ, 2026):

- ateş,
- ense sertliği,
- zihin karışıklığı ya da bilinç değişikliği,
- baş ağrısı,
- ışıktan rahatsız olma,
- bulantı ve kusma.

İngiltere’nin ulusal sağlık kılavuzu dört belirtinin birlikte görülmesini bir **kırmızı bayrak** sayar: ateş, baş ağrısı, ense sertliği ve bilinçte ya da düşünmede bozulma (NICE, 2024). Kırmızı bayrak, hemen harekete geçmeyi gerektiren bir uyarı işaretidir.

Bebeklerde tablo farklıdır. Ateş ve ense sertliği daha az görülür. Baş ağrısını ve ense sertliğini bebekte fark etmek de zordur. Bıngıldağın kabarması uyarıcı bir işarettir (NICE, 2024). Meningokok adlı bakteri kana karışırsa deride özel bir döküntü çıkabilir. Bu döküntü, üstüne bastırınca solmaz (DSÖ, 2026).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Menenjit sayılarla',
      ogeler: [
        { deger: '2,51', birim: 'milyon', aciklama: 'Dünyada 2019 yılında görülen yeni menenjit olgusu.' },
        { deger: '236.000', aciklama: 'Aynı yıl menenjitten ölen kişi. Bunların 112.000’i beş yaşından küçük çocuktu.' },
        { deger: '6’da 1', aciklama: 'Bakteriyel menenjite yakalananlardan ölenlerin yaklaşık payı.' },
        { deger: '5’te 1', aciklama: 'Bakteriyel menenjitten sonra ağır bir sorun (komplikasyon) yaşayanların yaklaşık payı.' },
      ],
      not: 'Kaynak: (GBD 2019 Meningitis Antimicrobial Resistance Collaborators, 2023; DSÖ, 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Menenjit acildir',
      md: 'Ateş, baş ağrısı, ense sertliği ve bilinç bozukluğu birlikteyse durum acildir (NICE, 2024). Bebekte belirtiler silik olabilir (NICE, 2024). Bakteriyel menenjit hayatı tehdit eder ve hemen tedavi ister (Dafny, 2020). Bu bilgiler tanı koymak için değil, tehlikeyi tanımak içindir.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Sözcüğün öyküsü',
      md: '“Menenjit” sözcüğü Türkçeye Fransızcadan (*méningite*) geçmiştir (TDK, 2026). Zar iltihabının belirtileri çok eski metinlerde de anlatılmıştır. Ama “menenjit” sözcüğü, cerrah John Abercrombie onu 1828’de tanımlayınca yaygın kullanıma girdi (Tristram ve Kondamudi, 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Menenjit** = beyin ve omurilik zarlarının iltihabı. Bakteriler ince zarların yüzeyinde ve BOS’ta yayılır.

**Viral menenjit** daha sık ve genellikle hafiftir. **Bakteriyel menenjit** ağırdır ve acildir.

**Kırmızı bayrak:** ateş + baş ağrısı + ense sertliği + bilinç bozukluğu. Bebekte belirtiler silik olabilir.`,
    },

    // ——— Menenjit: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bakteriyel, viral ve aseptik menenjit.** “Aseptik” mikropsuz demektir. Aseptik menenjitte BOS’taki hücre sayısı ve iltihap belirteçleri anormaldir. Ama kültürde, yani laboratuvarda mikrobu üretme denemesinde, bakteri üremez. Aseptik menenjitin en sık bulunan nedeni virüslerdir (Cantu ve ark., 2026). BOS’ta beyaz kan hücrelerinin artmasına **pleositoz** denir. Tanı ölçütü, BOS’un her milimetreküpünde 5’ten fazla beyaz kan hücresi bulunmasıdır (Rocha Cabrero ve Tristram, 2026).

Dünyada viral menenjitin en sık nedeni **enterovirüslerdir** (Kohil ve ark., 2021). Paris’te bir iç hastalıkları servisinde 180 yetişkinde aseptik menenjit incelendi. Mikrop kaynaklı ve kesin tanı konan olguların %43,4’ünde enterovirüs vardı. Uçuk virüsü tip 2 (HSV-2) %16,8’inde, suçiçeği virüsü (VZV) %14,5’inde bulundu (Jarrin ve ark., 2016).

İngiltere’de 2011–2014 arasında menenjit şüphesiyle başvuran, 16 yaş ve üstündeki 1126 kişi izlendi. Bunların 638’inde menenjit vardı. Viral menenjitin yıllık sıklığı 100.000 kişide 2,73 bulundu. Bakteriyel menenjitin sıklığı 1,24’tü. Menenjitlerin %42’sinde neden bulunamadı (McGill ve ark., 2018).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Bakteriyel menenjitin başlıca etkenleri',
      sutunlar: ['Etken', 'Kimde öne çıkar?', 'Ne kadar ölümcül?', 'Bu derste geçen aşılar'],
      satirlar: [
        [
          'Pnömokok (*Streptococcus pneumoniae*)',
          'Çocuk ve ergen; dünyada bütün yaşlarda en sık iki etkenden biri',
          'Olguların %24’ü ölür; 2019’da menenjit ölümlerinin %18,1’i',
          '7 değerlikli pnömokok aşısı (PCV-7): Türkiye’de 2009’da aşı takvimine girdi',
        ],
        [
          'Meningokok (*Neisseria meningitidis*)',
          'Çocuk ve ergen; Afrika menenjit kuşağında salgınlar',
          'Olguların %9’u ölür; 2019’da menenjit ölümlerinin %13,6’sı',
          'A serogrubuna karşı konjuge aşı: 2010’dan beri Afrika kuşağında; aşılı toplumlarda A serogrubu hastalığı %99 azaldı',
        ],
        [
          '*Haemophilus influenzae* (Hib)',
          'Çocuk ve ergen',
          'Olguların %11’i ölür; 1990–2019’da 5 yaş altı ölümlerde en büyük düşüş (%76,5) bunda',
          'Hib aşısı: Türkiye’de 2006’da aşı takvimine girdi',
        ],
        ['B grubu streptokok', 'Yenidoğan', '—', '—'],
        ['*Listeria monocytogenes*', '—', 'Olguların %27’si ölür (en yüksek oran)', '—'],
        ['*Klebsiella pneumoniae*', '—', '2019’da menenjit ölümlerinin %12,2’si', '—'],
        ['*Escherichia coli*', 'Afrika’da yenidoğan', '—', '—'],
      ],
      not: 'Olguların ölüm oranları, 108 ülkeden 371 çalışmayı birleştiren bir meta-analizdendir ve toplumda başlayan bakteriyel menenjiti kapsar (van Ettekoven ve ark., 2024). Ölümlerdeki paylar ve Hib düşüşü (GBD 2019 Meningitis Antimicrobial Resistance Collaborators, 2023). Yaş grupları ve Afrika aşısı (DSÖ, 2026). “En sık iki etken” ve Afrika’daki yenidoğanlar (Oordt-Speets ve ark., 2018). Türkiye’deki aşı tarihleri (Ceyhan ve ark., 2020). “—”: bu derste kullanılan kaynaklarda veri yok.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Belirtiler ne kadar güvenilir?** Hollanda’da bakteriyel menenjitli yetişkinlerde 696 atak incelendi. Klasik üçlü (ateş, ense sertliği, bilinç değişikliği) atakların yalnızca %44’ünde vardı. Ama atakların %95’inde dört belirtiden en az ikisi bulunuyordu: baş ağrısı, ateş, ense sertliği ve bilinç değişikliği (van de Beek ve ark., 2004). Bu çalışmada genel ölüm oranı %21’di. Ölüm, pnömokok menenjitinde %30, meningokok menenjitinde %7’ydi (van de Beek ve ark., 2004).

**Zar işaretleri.** Hekim muayenede zarların tahriş olup olmadığını sınar. İki klasik işaret vardır:

- **Kernig işareti:** Rus hekim Vladimir Kernig 19. yüzyılda tanımladı. Menenjitli hastaları otururken bacaklarını tam uzatamıyordu. Kernig, dizin 135 dereceden fazla açılamamasını olumlu bulgu saydı (Karl ve ark., 2022).
- **Brudzinski işareti:** Josef Brudzinski 1800’lerin sonunda dört manevra tanımladı. Bugün bu adla anılan, en bilineni “ense işareti”dir (Stribos ve Jones, 2023).

Bu işaretlerin gücünü bir meta-analiz ölçtü. Meta-analiz, birçok çalışmanın sonuçlarını birleştiren bir yöntemdir. Dokuz çalışma birleştirildi: BOS’ta hücre artışı olan 599 ve olmayan 1216 hasta (Akaishi ve ark., 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zar işaretleri: ne kadar güvenilir?',
      sutunlar: ['İşaret', 'Duyarlılık', 'Özgüllük', 'Ne anlama gelir?'],
      satirlar: [
        ['Kernig ve Brudzinski işaretleri', '%20–30', '%85–95', 'Çoğu hastada bulunmaz; yokluğu menenjiti dışlamaz'],
        ['Ense sertliği', '%40–60', '%65–75', 'Daha çok hastayı yakalar ama yine de yetersizdir'],
        [
          'Sarsıntıyla baş ağrısının artması (baş saniyede 2–3 kez sağa sola çevrilir)',
          '%40–60',
          '%65–75',
          'Eskiden %100’e yakın duyarlı sanılıyordu',
        ],
      ],
      not: 'Duyarlılık: hastalığı olanların kaçında işaretin bulunduğu. Özgüllük: hastalığı olmayanların kaçında işaretin bulunmadığı. Değerler meta-analizin tahmin aralıklarıdır (Akaishi ve ark., 2019).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'İşaret yoksa menenjit yok demek değildir',
      md: 'Menenjitli hastaların yaklaşık yarısında muayenede tipik zar işaretleri yoktur (Akaishi ve ark., 2019). Klasik üçlü de çoğu zaman eksiktir (van de Beek ve ark., 2004). Başvuru anındaki hiçbir bulgu viral menenjiti bakteriyel menenjitten güvenle ayıramaz. Bu yüzden değerlendirme hızlı ve eksiksiz yapılmalıdır (Cantu ve ark., 2026).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'BOS’ta ne görülür? (kısa özet)',
      sutunlar: ['Bulgu', 'Bakteriyel menenjit', 'Viral menenjit'],
      satirlar: [
        ['Beyaz kan hücresi', 'Çok yüksek: mikrolitrede 500 ya da daha çok', 'Daha ılımlı: mikrolitrede çoğunlukla 80–100'],
        ['Baskın ak kan hücresi', 'Nötrofil (%80’den çok)', 'Lenfosit (%80’den çok)'],
        ['BOS şekerinin kan şekerine oranı', 'Düşük (0,4’ün altında)', 'Çoğunlukla normal'],
        ['Protein', 'Yüksek (yaklaşık 1 g/L)', 'Çoğunlukla normal'],
      ],
      not: 'Kaynak: (Kohil ve ark., 2021). Oranın hesaplanabilmesi için kan şekeri bel delmeden (lomber ponksiyon) hemen önce ölçülür. Hücre sayısı, protein ve şeker sonuçları 4 saat içinde hazır olmalıdır. Üç aydan küçük bebeklerde normal sınırlar daha yüksek olabilir (NICE, 2024). BOS’un yapısı ve dolaşımı “Karıncıklar ve beyin-omurilik sıvısı” dersinde ayrıntısıyla anlatılacak.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dünyada menenjit.** Menenjitten ölüm oranı otuz yılda yarıdan fazla düştü. Yaşa göre düzeltilmiş ölüm hızı 1990’da 100.000 kişide 7,5’ti. 2019’da 3,3’e indi (GBD 2019 Meningitis Antimicrobial Resistance Collaborators, 2023). “Yaşa göre düzeltilmiş” demek, ülkelerin yaş yapısındaki fark hesaba katılmış demektir.

Ama yük eşit dağılmaz. Kaynağı bol ülkelerde akut bakteriyel menenjitin yıllık sıklığı 100.000’de 0,5–1,5’in altına indi. Afrika’nın Sahel bölgesindeki salgınlarda ise sıklık 100.000’de 1000’e ulaşır (Wall ve ark., 2021). En ağır yük, Senegal’den Etiyopya’ya uzanan **Afrika menenjit kuşağı**ndadır (DSÖ, 2026).

**Türkiye.** İki büyük çalışma, çocuklarda bakteriyel menenjitin etkenlerini PCR ile aradı. PCR, mikrobun genetik izini çoğaltarak bulan bir testtir. Sonuçlar aşağıdaki tablodadır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Türkiye’de çocuklarda bakteriyel menenjitin etkenleri',
      sutunlar: ['Çalışma', 'Kimler, nasıl?', 'Meningokok', 'Pnömokok', 'Hib'],
      satirlar: [
        ['Ceyhan ve ark., 2008', '1 ay–17 yaş; çok merkezli; 408 BOS örneği; etken bulunan 243 olgu', '%56,5', '%22,5', '%20,5'],
        [
          'Ceyhan ve ark., 2020',
          '2015–2018; 7 bölgede 27 hastane (nüfusun %45’i); 994 şüpheli çocuk; etken bulunan 125 örnek',
          '%71',
          '%26,4',
          '%2,4',
        ],
      ],
      not: '2008 çalışmasında meningokokların %42,7’si W-135, %31,1’i B serogrubundaydı. 2015–2018’de en sık serogrup B oldu. Hib aşısı 2006’da, PCV-7 2009’da ulusal aşı takvimine girdi (Ceyhan ve ark., 2008; Ceyhan ve ark., 2020). Serogrup, bakterinin dış kılıfına göre ayrılan alt türdür.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Menenjit görüntüde',
      md: `- FLAIR, BOS’un sinyalini bastıran bir manyetik rezonans (MR) dizisidir. Bu yüzden subaraknoid boşluktaki hastalığa çok duyarlıdır (Mahendru ve Chong, 2009).
- FLAIR’de oluklarda parlaklık sık ama özgül olmayan bir bulgudur. En bilinen nedenleri subaraknoid kanama, menenjit ve kanserin BOS’a yayılmasıdır (Yazdani ve ark., 2019).
- Tüberküloz menenjitinde ince zarlardaki boyanma çoğunlukla düzgündür. Kafa tabanındaki sisternalarda yoğunlaşır (Patel ve ark., 2024).
- Viral menenjitte boyanma hiç olmayabilir ya da oluklarda yaygın olabilir. En iyi kontrastlı FLAIR’de görülür (Patel ve ark., 2024).

Normal ve hastalıklı zar boyanmasının genel kuralları “Zarları görüntülemek ve ameliyatta zarlar” bölümünde.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Yurt odasında ateş ve döküntü',
      oyku: '19 yaşında bir üniversite öğrencisi yurt odasında bulunuyor. Dünden beri ateşi ve baş ağrısı var. Arkadaşları, bugün sorulara geç ve karışık yanıtlar verdiğini söylüyor. Muayenede ense sertliği var. Bacaklarında iğne başı büyüklüğünde, morumsu lekeler görülüyor; üstlerine bastırınca solmuyorlar. Kernig işareti olumsuz.',
      soru: 'Kernig işaretinin olumsuz olması menenjiti dışlar mı? Bu tabloda ne düşünülür ve neden acele edilir?',
      cozum: `**Kırmızı bayrak var.** Ateş, baş ağrısı, ense sertliği ve bilinç bozukluğu birlikte bakteriyel menenjit için kırmızı bayraktır (NICE, 2024).

**Döküntü önemli bir ipucudur.** Basınca solmayan döküntü özellikle meningokokun kana karıştığı tabloda görülür (DSÖ, 2026). Çocuk ve ergenler en çok meningokok, pnömokok ve Hib için risk altındadır (DSÖ, 2026).

**Kernig olumsuz olabilir.** Kernig ve Brudzinski işaretlerinin duyarlılığı yalnızca %20–30’dur. Menenjitli hastaların yaklaşık yarısında tipik zar işaretleri yoktur (Akaishi ve ark., 2019). Yani olumsuz bir Kernig menenjiti dışlamaz.

**Neden acele?** Bakteriyel menenjite yakalananların yaklaşık 6’da 1’i ölür (DSÖ, 2026). Bel delmeyle BOS alınacaksa kan şekeri hemen öncesinde ölçülür. Böylece BOS şekerinin kan şekerine oranı hesaplanabilir (NICE, 2024). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Menenjit: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Eskiyen bilgiler ve farklı sayılar',
      md: `- **Sarsıntı testi:** İlk çalışmalar testi %100’e yakın duyarlı buldu ve menenjiti dışlamada çok etkili saydı. Sonraki çalışmalar, menenjitli birçok hastada testin olumsuz çıkabildiğini gösterdi (Akaishi ve ark., 2019).
- **Kernig’in özgün tanımı:** Kernig bulgusunu ilk kez 1882’de St. Petersburg’daki bir tıp kongresinde bildirdi. Olumlu bulgu olarak ağrıyı almadı. Dizdeki büzülmeyi (kontraktür) ya da uzatıcı kasların kasılmasını (spazm) aldı (Karl ve ark., 2022).
- **Ölüm oranı neden farklı yazılır?** DSÖ, bakteriyel menenjitte yaklaşık 6’da 1 ölüm verir (DSÖ, 2026). 80 yılı kapsayan bir meta-analiz ölüm oranını %18 buldu. Bu oran 1961 öncesinde %32, 2010 sonrasında %15’ti (van Ettekoven ve ark., 2024). Hollanda’da izlenen hasta grubunda (kohortta) oran %21’di (van de Beek ve ark., 2004). Düşük gelirli ülkelerde %25’i bulabilir (Tristram ve Kondamudi, 2026). Sayılar dönem, bölge ve etkene göre değişir.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Tüberküloz menenjiti.** Akciğer dışı tüberkülozun en az görülen biçimidir: akciğer dışı olguların %5–15’i. Ama ölüm ve kalıcı hasar bakımından en ağır biçimidir (Pehlivanoglu ve ark., 2012).

İstanbul’da Haseki Eğitim ve Araştırma Hastanesi’nde, 1998–2009 arasında 160 yetişkin incelendi. Hastaların %84’ü hastaneye ileri evrede (evre II–III) geldi. Altıncı ayın sonunda hastaların %17’si öldü. %71’i tam iyileşti, %13’ü nörolojik bir kalıntıyla iyileşti (Pehlivanoglu ve ark., 2012). Görüntülemede en sık bulgular şunlardı (Pehlivanoglu ve ark., 2012):

- tüberkülom, yani beyinde tüberküloz yumrusu (%37),
- kafa tabanında menenjit (%27),
- hidrosefali, yani karıncıkların BOS birikmesiyle genişlemesi (%21),
- kan akımının kesilmesine bağlı doku hasarı, yani iskemi ya da enfarkt (%9).

Bu seride MR, BT’den üstündü (Pehlivanoglu ve ark., 2012). Diyarbakır’da Dicle Üniversitesi’nde 1998–2008 arasında tüberküloz menenjitli 185 çocuk incelendi. Kafa BT’sinde hidrosefali %90,3 oranında bulundu. Ölüm oranı %13’tü. Aynı bölümün önceki serisinde bu oran %23’tü (Güneş ve ark., 2015).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Menenjitte ilk hangi engel bozulur?',
      md: 'Ichikawa ve Itoh’un 2011 çalışmasında sıçanlarda deneysel menenjit oluşturuldu. İlk bozulan engel kan-beyin engeli değildi. Koroid pleksustaki kan-BOS engeli de değildi. İlk önce örümcek ağı zardaki kan-BOS engelinin geçirgenliği arttı (Brøchner ve ark., 2015). Bu engelin yapısı “Örümcek ağı zar” bölümünde anlatıldı.',
    },

    // ——— Kalın zar iltihabı: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kalın zar iltihabı.** Sert zara **kalın zar** (*pachymeninx*) da denir (Mahendru ve Chong, 2009). **Hipertrofik pakimenenjit**, kafatası ya da omurga sert zarının iltihapla kalınlaşmasıdır. Belirtiler üç yoldan doğar: kitlenin baskısı, sinirlerin sıkışması ya da damarların etkilenmesi (Wallace ve ark., 2013).

Fransa’da çok merkezli bir seride 60 hasta toplandı. Ortanca yaş 55,5’ti. Ortanca, sıraya dizilen değerlerin tam ortasındakidir. Hastaların %72’sinde baş ağrısı, %55’inde bir kafa sinirinin felci vardı. %17’sinde zihin karışıklığı, %12’sinde nöbet görüldü. Sekiz hastada (%13) beyin toplardamarlarında pıhtı (tromboz) vardı (Mekinian ve ark., 2018).

Hastalık nadirdir. Bildirilen yaygınlık 100.000 kişide 0,949’dur. Bu hastaların yarısında neden bulunamamıştır (Xiao ve ark., 2020). Doğru tanı için çoğu zaman sert zardan parça almak (biyopsi) gerekir (Wallace ve ark., 2013).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kalın zar iltihabının nedenleri: üç seri',
      sutunlar: ['Seri', 'Hasta', 'Bulunan nedenler'],
      satirlar: [
        [
          'Wallace ve ark., 2013 (ABD, bir hastanenin 25 yıllık patoloji arşivi)',
          '14 (mikrop dışı olgulardan dokusu yeniden incelenebilenler)',
          'Önceden “nedeni bilinmeyen” sayılanların %66,6’sı IgG4 ilişkili hastalık çıktı; bu hastalık bütün olguların %29’u',
        ],
        [
          'Mekinian ve ark., 2018 (Fransa)',
          '60',
          'Nedeni bilinmeyen (idiyopatik) 18 hasta (%30); granülomatöz polianjiit 13; Erdheim–Chester hastalığı 10; IgG4 ilişkili hastalık 3; tüberküloz 3; tek tük bel delme sonrası ve düşük BOS basıncı',
        ],
        ['Xiao ve ark., 2020 (Çin)', '48', 'İdiyopatik %67; ANCA ilişkili damar iltihabı (vaskülit) %15; tüberküloz menenjiti %8'],
      ],
      not: 'IgG4, bir antikor (bağışıklık proteini) türüdür. ANCA, kişinin kendi ak kan hücrelerine karşı yaptığı bir antikordur. Granülomatöz polianjiit ve ANCA ilişkili vaskülit, damar iltihabı türleridir. Kaynaklar: (Wallace ve ark., 2013; Mekinian ve ark., 2018; Xiao ve ark., 2020).',
    },

    // ——— Kalın zar iltihabı: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kalın zar iltihabının en sık nedeni hangisi?',
      md: `- **Biyopsi tabloyu değiştirir.** Wallace ve arkadaşları eski doku örneklerini yeniden inceledi. “Nedeni bilinmeyen” sayılan olguların üçte ikisi IgG4 ilişkili hastalık çıktı. Yazarlara göre IgG4 ilişkili hastalık, mikrop dışı kalın zar iltihabının belki de en sık nedenidir (Wallace ve ark., 2013). Fransız ve Çin serilerinde ise en büyük grup yine idiyopatik olgulardır (Mekinian ve ark., 2018; Xiao ve ark., 2020).
- **IgG4 ilişkili kalın zar iltihabı:** 42 olgu bildirimi ve 5 olgu serisi derlendi: 60 hasta, 20’si kadın, ortanca yaş 53. Yirmi dört hastada hastalık tek bir organda kalmıştı (Levraut ve ark., 2019). Önerilen tedavi; erken cerrahiye, kortizona (steroid) ve bağışıklığı erken baskılayan ilaçlara dayanır (Levraut ve ark., 2019).
- **Türkiye’den bir yazarın katıldığı bir olgu**, bu hastalığın ince zarları tutan ve damar çevresine yayılan biçimini tanımladı (Boban ve ark., 2018).
- **Boyanmanın yeri ipucu verir.** Çin serisinde boyanma idiyopatik ve tüberküloza bağlı olgularda arka kafa çukurunda yoğunlaştı. ANCA ilişkili olgularda alın, yan kafa ve art kafa loblarının üstündeydi (Xiao ve ark., 2020).
- **“Geceleyin Eyfel” işareti:** Granülomatöz polianjiitte en sık görüntü bulgusu kronik kalın zar iltihabıdır. Beyincik çadırı sık tutulur. Buna “geceleyin Eyfel” (*Eiffel by night*) işareti denir (Patel ve ark., 2024).`,
    },

    // ——— Zara yayılan kanser: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Zara yayılan kanser.** Vücudun başka bir yerindeki kanser ince zarlara da yayılabilir. Buna **leptomeningeal hastalık** (leptomeningeal metastaz) denir. Kanser hücreleri yumuşak zara, örümcek ağı zara ve subaraknoid boşluğa birçok odakta yerleşir. Bu, kanserlerin geç evrede görülen bir sorunudur (Nayar ve ark., 2017). En sık kaynaklar meme kanseri, akciğer kanseri ve bir deri kanseri olan melanomdur (Nayar ve ark., 2017).

Sıklığı kaynağa göre değişir. Bir kaynağa göre katı tümörlerin %5–8’inde, kan kanserlerinin %5–15’inde görülür (Batool ve Kasi, 2023). Bir başka derlemeye göre ise katı tümörlerin %1–5’inde, birincil beyin tümörlerinin %1–2’sinde görülür (Nayar ve ark., 2017).

Tedavi, ortanca yaşam süresini 4–6 haftadan 3–6 aya çıkardı. Tedavide ilacın doğrudan BOS’a verildiği kemoterapi ve ışın tedavisi kullanılır. Yine de hastalık ölümcül bir geç evre olarak kalır (Nayar ve ark., 2017).`,
    },

    // ——— Zara yayılan kanser: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kanser hücresi zara nasıl ulaşır, nasıl yakalanır?',
      md: `- **Giriş yolu:** Kanser hücreleri BOS’a kan yoluyla, koroid pleksustan girebilir. Toplardamarlar boyunca geriye doğru uzanarak da girebilir (Sener ve ark., 2025).
- **Damar çevresi yol:** Kafa tabanında yumuşak zar ile örümcek ağı zar arasındaki boşluk, küçük damarların çevresinde sürer. Bu uzantılara Virchow–Robin boşlukları denir. Metastaz ve kriptokok mantarı bu yolu sever (Mahendru ve Chong, 2009).
- **Tanı:** Altın standart, BOS’ta tümör hücrelerini mikroskopla görmektir (sitoloji). Ama tek örnekte verim düşüktür ve yanlış olumsuz sonuç sıktır. Örneği tekrarlamak duyarlılığı artırır (Sener ve ark., 2025). Meme kanserinde, BOS’ta dolaşan tümör hücresini sayan test sitolojiden daha duyarlı bulundu: %94’e karşı %76 (Sener ve ark., 2025).
- **MR’daki iki örüntü:** Yumuşak zar olukların dibine kadar iner. Örümcek ağı zar ise kıvrımdan kıvrıma köprü kurar. Bu anatomi, boyanmanın iki örüntüsünü açıklar: sert zar–örümcek ağı zar tipi ve yumuşak zar–subaraknoid tip (Mahendru ve Chong, 2009). Yumuşak zar tipinde BOS sitolojisi daha sık olumludur. Yalnızca sert zar tutulduğunda BOS tekrar tekrar olumsuz çıkabilir; o zaman biyopsinin yerini MR gösterir (Mahendru ve Chong, 2009).
- **Öngörü:** Sitolojisi olumsuz hastalarda MR’da düğümsü (nodüler) tutulum, çizgisel tutuluma göre kötü öngörü işaretidir (Sener ve ark., 2025).`,
    },

    // ——— Menenjiyom: temel ———
    {
      tur: 'metin',
      md: `**Menenjiyom** (*meningioma*), beyin ya da omurilik zarlarından gelişen bir tümördür. Beyin dokusunun içinden değil, onu saran zardan çıkar. Çoğu iyi huyludur (Alruwaili ve Hall, 2026).

Menenjiyom, en sık görülen birincil beyin tümörüdür. Birincil tümör, başka bir organdan yayılmamış, burada doğmuş tümör demektir. ABD’de beyin ve merkezî sinir sistemi (MSS) tümörlerinin %41,7’si menenjiyomdur (Price ve ark., 2024). Menenjiyom kadınlarda daha sıktır (Price ve ark., 2024). Kadınların ömür boyu riski erkeklerinkinin yaklaşık 2,3 katıdır. ABD nüfusunun yaklaşık %1’inde yaşamı boyunca bir menenjiyom gelişir (Walsh ve ark., 2023).

Menenjiyomların yaklaşık %20’si başka bir nedenle çekilen görüntülerde tesadüfen bulunur (Wang ve ark., 2024). Belirti vermeyen menenjiyomların yaklaşık %94’ü belirtisiz kalır, %63’ü hiç büyümez. Bu yüzden çoğunda önce izlem önerilir (Morris ve ark., 2009).`,
    },
    {
      tur: 'metin',
      md: `**Nerede çıkar?** Menenjiyom, zarın bulunduğu her yerde çıkabilir. Üç büyük bölge vardır (Ogasawara ve ark., 2021):

- **Kafa tabanı:** bütün menenjiyomların %43–51’i,
- **Beyin kubbesi** (konveksite), yani yarımkürelerin yan yüzü: %20–37,
- **Orak yanı** (parasagital), yani iki yarımkürenin arasındaki orta hattın yanı: %13–22.

Belirtiler tümörün yerine bağlıdır. En sık belirtiler baş ağrısı (%33–37), bir kafa sinirinin etkilenmesi (%29–31) ve nöbettir (%17–25) (Ogasawara ve ark., 2021).`,
    },
    {
      tur: 'sahne',
      baslik: 'Menenjiyom beynin yüzeyinde nerede çıkar?',
      aciklama:
        'Beyne yukarıdan bakıyoruz; ön taraf ekranın üstünde. Kafatası yarı saydam. Turuncu alan orak yanını (parasagital bölge), sarı alanlar beyin kubbesini kabaca gösterir. Tümör beynin kendisinden değil, bu bölgelerin üstündeki sert zardan çıkar. Beyin orağı ve sert zar modelde yoktur; etiketler yerlerini gösterir. Yüzdeler bütün menenjiyomlar içindeki paydır (Ogasawara ve ark., 2021).',
      sahne: {
        katmanlar: ['kabuk', 'kemik'],
        renk: 'dogal',
        saydam: ['katman:kemik'],
        boya: [
          { secici: ['ust-frontal-girus', 'ust-parietal-lobul'], renk: PARASAGITAL },
          { secici: ['orta-frontal-girus', 'alt-frontal-girus', 'supramarjinal-girus', 'angular-girus'], renk: KUBBE },
        ],
        bakis: 'ust',
        etiketler: [
          { yapi: 'ust-frontal-girus-sag', metin: 'Orak yanı (parasagital): %13–22' },
          { yapi: 'orta-frontal-girus-sol', metin: 'Beyin kubbesi: %20–37' },
        ],
        noktalar: [{ nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Orta hat: altında beyin orağı uzanır' }],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Menenjiyom** = zardan çıkan tümör. Beyin dokusunun dışındadır ve çoğu iyi huyludur.

**En sık birincil beyin tümörü**dür ve kadınlarda daha sıktır.

**En sık yerleri:** kafa tabanı, beyin kubbesi ve orak yanı. Belirtiler yere bağlıdır.

**Tesadüfen bulunan** menenjiyomların çoğu belirti vermez ve büyümez.`,
    },

    // ——— Menenjiyom: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Menenjiyom hangi hücreden doğar?** Kaynak hücre büyük olasılıkla örümcek ağı zarın **örtü hücresi**dir (*arachnoid cap cell*). Bu hücreler örümcek ağı zarın dış katmanını ve araknoid villusları (granülasyonları) oluşturur. Menenjiyom hücrelerine benzedikleri için kaynak hücre sayılırlar (Ogasawara ve ark., 2021). Granülasyonlar “Örümcek ağı zar” bölümünde anlatıldı.

Bu köken üç şeyi açıklar:

- Menenjiyom hemen her zaman sert zara tutunur (Simon ve Gousias, 2024).
- Kanını sert zarın damarlarından alır (Doddamani ve ark., 2018).
- Orak yanındaki menenjiyomlar, üst sagital sinüsteki granülasyonların örtü hücrelerinden doğar (Ye ve ark., 2022).

**Belirtiler yere bağlıdır.** Orak yanındaki menenjiyomlar çok büyümeden belirti vermeyebilir. Çoğu zaman bacakta başlayan sarsıntılı nöbetle (Jackson tipi nöbet) ya da baş ağrısıyla ortaya çıkar (Ogasawara ve ark., 2021). Kama kemiği kanadının dış ucundaki menenjiyomlar çoğunlukla ağrısız, tek taraflı göz öne çıkmasıyla gelir. Ardından aynı gözde görme kaybı olur (Ogasawara ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Menenjiyomun yerleri',
      sutunlar: ['Yer', 'Derlemeye göre payı', '939 hastalık bir seride payı'],
      satirlar: [
        ['Kafa tabanı', '%43–51', '%45'],
        ['Beyin kubbesi (yarımkürelerin yan yüzü)', '%20–37', '%35'],
        ['Orak yanı (parasagital; orak dahil)', '%13–22 (orağın kendisi %5)', '%13'],
        ['Beyincik çadırı', '%2–4 (başka bir kaynakta %3–6)', '—'],
        ['Arka kafa çukuru', '%6–15', '%6'],
        ['Karıncık içi', '%1–5', '%1'],
        ['Omurilik', '%7–12', '—'],
      ],
      not: 'Derleme (Ogasawara ve ark., 2021); seri: Münster’de ameliyat edilen 939 hasta (Brokinkel ve ark., 2021); çadır için ikinci değer (Cannizzaro ve ark., 2022). Grupların sınırı tanıma göre değişir: bir anatomi çalışması, orak yanı menenjiyomlarına bütün kafa içi menenjiyomların %19,5–45’ini verir (Ye ve ark., 2022).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kafa tabanında menenjiyom yerleri',
      aciklama:
        'Kafatasının tepesi kaldırıldı; kafa tabanına yukarıdan bakıyoruz, ön taraf ekranın üstünde. Kırmızımsı yapı beyincik çadırıdır. Kafa tabanı bütün menenjiyomların %43–51’ini taşır (Ogasawara ve ark., 2021). Çadırdan çıkanların payı bir kaynağa göre %2–4 (Ogasawara ve ark., 2021), bir başkasına göre %3–6’dır (Cannizzaro ve ark., 2022). Kama kemiği kanadının dış ucundaki menenjiyom gözü öne iter (Ogasawara ve ark., 2021).',
      sahne: {
        katmanlar: ['kemik', 'zar'],
        renk: 'dogal',
        vurgula: ['katman:kemik', 'beyincik-cadiri'],
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR }],
        bakis: 'ust',
        kesit: { duzlem: 'aksiyel', konum: 1 },
        etiketler: [{ yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı: %2–6 (kaynağa göre)' }],
        noktalar: [
          { nokta: 'horoz-ibigi', metin: 'Ön kafa tabanı (koku oluğu çevresi)' },
          { nokta: 'kucuk-kanat-sol', metin: 'Kama kemiği kanadı' },
          { nokta: 'klivus', metin: 'Arka kafa çukuru: %6 (bir seride)' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Menenjiyom sayılarla',
      ogeler: [
        { deger: '%41,7', aciklama: 'ABD’de bütün birincil beyin ve MSS tümörleri içindeki payı; 2017–2021 verisi.' },
        {
          deger: '9,73',
          birim: '/100.000',
          aciklama: 'ABD’de kötü huylu olmayan menenjiyomun yıllık sıklığı: MSS tümörleri içinde en yüksek.',
        },
        { deger: '%80,1', aciklama: 'DSÖ 2021’e göre derece 1 olanların payı.' },
        { deger: '%2–3', aciklama: 'Otopside tesadüfen menenjiyom bulunanların oranı.' },
      ],
      not: 'Kaynak: (Price ve ark., 2024; Wang ve ark., 2024; Ogasawara ve ark., 2021).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kimde, ne sıklıkta?** Yaşa göre düzeltilmiş yıllık sıklık kadınlarda 100.000 kişide 8,36, erkeklerde 3,61’dir. Bu yaklaşık 2’ye 1 oran, ergenlik öncesindeki nadir menenjiyomlarda tersine dönebilir (Wiemels ve ark., 2010). 20 yaşından önce iki cinsiyet arasında risk farkı yoktur (Walsh ve ark., 2023).

Menenjiyom yaşla sıklaşır. 40 yaşın üstünde bütün MSS tümörlerinin %43,6’sı menenjiyomdur. Bu pay 15–39 yaşta %15,6, 0–14 yaşta %1,7’dir (Ogasawara ve ark., 2021). Tesadüfi MR bulgularının meta-analizinde menenjiyom en sık tümör bulgusuydu: 1000 taramada 5,3. Bu oran 1 yaşında sıfırdı, 80 yaşında 1000’de 17’ye çıktı (Sunny ve ark., 2022). Norveç’te 50–66 yaşındaki 1006 kişiye araştırma için MR çekildi. On kişide (%1,0) menenjiyom bulundu; bunların dokuzu kadındı (Håberg ve ark., 2016).

**Risk etkenleri.** Değiştirilebilir risk etkenlerinden az sayıda kesin olarak gösterildi: iyonlaştırıcı ışın, yüksek beden kitle indeksi, metotreksat ilacı ve sigara. Sigaranın etkisi yalnızca erkeklerde görüldü (Wang ve ark., 2024). En iyi doğrulanmış etken kafaya verilen ışın tedavisidir. Doz arttıkça risk doğrusal olarak artar. Bu ilişki özellikle 10 yaşından önce ışın alanlarda belirgindir (Wang ve ark., 2024).

**Genler ve hormonlar.** Menenjiyomla ilişkilendirilen ilk gen *NF2*’dir. Bu gen 22. kromozomdadır (22q12.2) ve Merlin adlı proteini yapar (Wang ve ark., 2024). NF2 hastalığı olanların yarısından fazlasında yaşam boyunca en az bir kafa içi menenjiyom gelişir (Ogasawara ve ark., 2021). Menenjiyomların hemen hepsi somatostatin reseptörü 2 taşır. Yaklaşık %88’i progesteron reseptörü taşır (Ogasawara ve ark., 2021). Reseptör, hücrenin bir hormonu tanıyan algılayıcısıdır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Menenjiyomun DSÖ dereceleri',
      sutunlar: ['Derece', 'Mikroskopta ölçüt', 'Payı, DSÖ 2021', 'Not'],
      satirlar: [
        [
          '1',
          'On büyük büyütme alanında 4’ten az bölünen hücre (mitoz)',
          '%80,1',
          'Daha çok kafa tabanında görülür; %1–4’ü zamanla kötü huylu tümöre dönüşür',
        ],
        [
          '2 (atipik)',
          '4–19 mitoz; ya da beyin dokusuna yayılım; ya da beş özellikten en az üçü: düzensiz tabaka dizilimi, çekirdeği büyük küçük hücreler, belirgin çekirdekçik, hücre yoğunluğunun artması, kendiliğinden küçük doku ölümleri',
          '%18,3',
          'Beyne yayılım 2016’dan beri tek başına derece 2 ölçütüdür. Berrak hücreli alt tip de derece 2’dir',
        ],
        [
          '3 (anaplastik, kötü huylu)',
          '20 ya da daha çok mitoz; ya da açıkça kötü huylu görünüm; ya da iki gen değişikliğinden biri (tek başına yeter): TERT geninin düzenleyici bölgesinde (promotör) mutasyon; CDKN2A/B geninin iki kopyasının da kaybı',
          '%1,5',
          '10 yıllık genel sağkalım tahmini yalnızca %14–24',
        ],
      ],
      not: 'Mikroskop ölçütleri, Ogasawara ve arkadaşlarının aktardığı DSÖ 2016 tablosundandır (Ogasawara ve ark., 2021). DSÖ 2021 bu ölçütleri korur. Derece 3 için de iki gen ölçütü ekler: TERT promotör mutasyonu ve CDKN2A/B kaybı (Wang ve ark., 2024). Beyin yayılımı ölçütü (Walsh ve ark., 2023); berrak hücreli alt tip, paylar ve sağkalım (Wang ve ark., 2024); dönüşüm (Alruwaili ve Hall, 2026). DSÖ 2021 sınıflaması moleküler tanıyı öne çıkarır; doku ve moleküler bulguları “bütünleşik tanı”da birleştirir (Louis ve ark., 2021). Ogasawara, paylar için %80,5, %17,7 ve %1,7 verir. Kayıtlarda ise derece 2–3’ün payı yalnızca %5,4 civarındadır. Çünkü birçok derece 1 menenjiyom görüntüyle tanınır, izlenir ve hiç ameliyat edilmez (Walsh ve ark., 2023).',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Menenjiyom görüntüde',
      md: `- Menenjiyom tanısında altın standart MR’dır (Alruwaili ve Hall, 2026).
- **Sert zar kuyruğu** (*dural tail*): Tümörün kenarından sert zar boyunca uzanan, boyanan ince kalınlaşmadır. MR’da ilk kez 1989’da Wilms ve arkadaşları tanımladı (Cordia ve ark., 2025). Bir kaynağa göre menenjiyomların yaklaşık %60–72’sinde görülür (Doddamani ve ark., 2018). 18 çalışmayı birleştiren bir derlemede bu oran %34 ile %72 arasındaydı (Cordia ve ark., 2025).
- Kuyruk menenjiyomu güçlü biçimde düşündürür ama tanı koydurmaz. Lenfoma, metastaz, hemanjiyoperisitom, sinir kılıfı tümörü (schwannom) ve kordomada da görülebilir (Doddamani ve ark., 2018). Hemanjiyoperisitom aşağıdaki soliter fibröz tümör kutusunda anlatılıyor. Kordoma da kafa tabanında görülebilen bir tümördür (Pamir ve ark., 2026).
- Çocuk menenjiyomlarında kuyruk daha az görülür; yokluğu menenjiyomu dışlamaz (Patel ve ark., 2024).
- Görme sinirini saran sert zar kılıfında “tren rayı” biçiminde boyanma menenjiyomu düşündürür (Mahendru ve Chong, 2009).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Tesadüfen bulunan menenjiyom: izlem mi, ameliyat mı?',
      md: `Avrupa Nöro-Onkoloji Derneği’nin (EANO) kılavuzu iki şey söyler. Tutulan sert zarla birlikte tümörün tamamen çıkarılması çoğu zaman tedavi edicidir. Belirti vermeyen ya da yaşlı hastalarda “izle ve tara” yolu seçilebilir (Goldbrunner ve ark., 2021).

Tesadüfi bir menenjiyomun büyüme riskini artıran görüntü özellikleri şunlardır (Wang ve ark., 2024):

- kireçlenme olmaması,
- T2 ağırlıklı MR’da (bir MR görüntü türü) parlak görünmesi,
- tümör çevresinde ödem bulunması,
- tanıda 10 cm³’ten büyük hacim,
- kafa tabanı dışında bir yer,
- bir toplardamar sinüsüne yakınlık.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Simpson dereceleri ve nüks',
      sutunlar: ['Derece', 'Ameliyatta ne çıkarılır?', 'Simpson 1957 (Simon ve Gousias’ın aktarımı)', '939 hastalık seri, 2021'],
      satirlar: [
        ['I', 'Tümör tamamen; tutulan sert zar ve kemikle birlikte (sinüsten çıkıyorsa sinüs de)', '%8,9', '%8'],
        ['II', 'Tümör tamamen; tutulan sert zar yerinde yakılır (koterize edilir)', '%15,8', '%11'],
        ['III', 'Tümör tamamen; sert zar olduğu gibi bırakılır', '%29,2', '%18'],
        ['IV', 'Tümörün bir kısmı; sert zar içinde tümör kalır', '%46,7 (IV ve V birlikte)', '%19'],
        ['V', 'Yalnızca basıncı azaltma, gerekirse parça alma (biyopsi)', '%46,7 (IV ve V birlikte)', '%25 (4 hastanın 1’i)'],
      ],
      not: 'Tanımlar (Chotai ve Schwartz, 2022; Wang ve ark., 2024). Simpson’ın özgün nüks oranları (Simon ve Gousias, 2024). Simpson’ın özgün makalesi okunamadı. Başka kaynaklarda farklı oranlar da geçer. Örneğin Chotai ve Schwartz’ın tablosu derece II için %19 yazar. Ama aynı tablodaki sayı, 114 hastanın 18’i, %15,8 eder (Chotai ve Schwartz, 2022). 939 hastalık seride nüks ya da ilerleme oranları (Brokinkel ve ark., 2021). Bu seride çıkarımların %29’u derece I, %48’i II, %11’i III, %11’i IV idi; V %0,5’ten azdı.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Köken:** örümcek ağı zarın örtü hücresi → menenjiyom hemen her zaman sert zara tutunur.
- **Yer:** kafa tabanı %43–51 > beyin kubbesi %20–37 > orak yanı %13–22.
- **Belirti–yer eşleşmesi:** orak yanı → bacakta başlayan Jackson tipi nöbet; dış kama kemiği kanadı → ağrısız tek taraflı göz öne çıkması.
- **DSÖ:** derece 1 = 10 büyük büyütme alanında <4 mitoz. Beyne yayılım tek başına derece 2 demektir. TERT promotör mutasyonu ya da CDKN2A/B’nin iki kopyasının kaybı tek başına derece 3 demektir.
- **Simpson I–II–III:** tümör tamamen çıkar; fark sert zardadır: çıkarılır, yakılır, bırakılır.
- **Sert zar kuyruğu:** menenjiyomların %60–72’sinde (bir derlemede %34–72); düşündürür ama tanı koydurmaz.`,
    },

    // ——— Menenjiyom: uzman ———
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Simpson derecesi ve sert zar kuyruğu bugün',
      md: `- **Ölçeğin kökeni:** Simpson 1957’de beş dereceli bir ölçek yayımladı. Ölçek, ameliyatta çıplak gözle yapılan gözleme dayanıyordu (Chotai ve Schwartz, 2022). Ameliyattan sonra görüntüleme yoktu; nüks, belirtilerin geri gelmesiyle tanımlandı. Bu yüzden gerçek oran düşük tahmin edilmiş olabilir (Chotai ve Schwartz, 2022).
- **Sert zarda gizli odaklar:** Borovich ve Doron, menenjiyomların üçte birinden fazlasında sert zarda küçük tümör odakları gösterdi. Bu odaklar ana tümörün kenarından 4 cm uzağa kadar uzanıyordu. Derece I çıkarımdan sonra 10 yıl içinde nüks %10–32 bildirilmiştir (Chotai ve Schwartz, 2022).
- **“Derece 0”:** Derece I’e ek olarak çevredeki 2 cm’lik sert zarın da çıkarılmasıdır. Daha çok beyin kubbesi menenjiyomları için önerildi (Wang ve ark., 2024).
- **Kuyruğun içinde ne var?** Sistematik derleme, çalışmaları belirli kurallarla tarayıp birleştiren derlemedir. 18 çalışmalık bir sistematik derlemede radyolojik kuyrukların %70,9’unda (378 hastanın 268’inde) mikroskopla tümör sızması bulundu. Geri kalanında damar değişiklikleri, gevşek bağ dokusu ya da iltihap vardı. Radyolojik olarak normal görünen sert zarı olan 65 hastanın 26’sında (%40) da tümör sızması vardı (Cordia ve ark., 2025). Bir uzlaşı raporu ise kuyruğun tümör mü yoksa tepkisel bir kalınlaşma mı olduğunun tartışmalı olduğunu yazar (Wang ve ark., 2024). Kuyruğun çıkarılmaması bir nüks riski olabilir (Cordia ve ark., 2025).
- **Simpson bugün ne kadar geçerli?** Modern dönemde derecenin önemi tartışmalıdır. Ulaşılabilecek çıkarımı çoğu zaman tümörün yeri ve büyüme biçimi belirler (Simon ve Gousias, 2024). 939 hastalık seride nüksü en iyi ayıran eşik, derece I–III ile IV ve üstü arasındaydı. I–II ile III ve üstü ayrımı daha zayıftı (Brokinkel ve ark., 2021).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Çadır menenjiyomları ve ilaç tedavisi',
      md: `- **Çadır menenjiyomları** bir kaynağa göre bütün kafa içi menenjiyomların %3–6’sıdır (Cannizzaro ve ark., 2022). Bir derleme bu payı %2–4 verir (Ogasawara ve ark., 2021). Çentikteki menenjiyomlar ayrı bir alt gruptur. İki merkezden 26 çentik menenjiyomunda Simpson I çıkarım 12, II 10, III 3, IV 1 hastada sağlandı. Komplikasyon oranı %23’tü (Cannizzaro ve ark., 2022).
- **Türkiye’den:** İstanbul’da 63 çadır menenjiyomu Yaşargil’in sınıflamasına göre ayrıldı. En sık tipler T7 (%34,9) ve T2 (%20,6) oldu. Tam çıkarım %73, kısmi çıkarım %27 oranında yapıldı (Mammadli ve ark., 2026). Çentiğin orta bölümünden çıkan T2 menenjiyomlar derin yerleşir ve önemli yapılara bastırır; bu yüzden ameliyatları zordur (Doğruel ve ark., 2026). Doğruel ve arkadaşları 2005–2025 arasında bu yerde kitlesi olan 6 hastayı, beyincik üstünden ve çadırın içinden geçen bir yolla ameliyat etti. Hastalar mümkünse yarı oturur konuma alındı. Doku incelemesinde kitlelerin 4’ü menenjiyom çıktı: 3’ü derece 1, 1’i berrak hücreli derece 2. Kalan 2’si menenjiyomu taklit eden soliter fibröz tümördü (Doğruel ve ark., 2026).
- **Yaşlı hastalar:** Türkiye’den bir seride aynı kıdemli cerrahın ameliyat ettiği 1372 menenjiyom hastasının kaydı incelendi. Yaşlılarda komplikasyon ve ölüm gençlerden fazlaydı. Yine de yazarlar ameliyatı yaşlılarda “bekle ve gör”den çok daha yararlı buldu (Ekşi ve ark., 2019).
- **İlaç tedavisi:** EANO’ya göre henüz standart bir ilaç tedavisi yoktur. En iyi ama sınırlı sonuçlar bevacizumab ile ya da damar büyüme etkeni (VEGF) reseptörünü hedefleyen ilaçlarla alındı. Somatostatin reseptörüne bağlanan ışınlı ilaç tedavisi deneyseldir (Goldbrunner ve ark., 2021).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Genler, yer ve köken',
      md: `- **NF2 ve derece:** *NF2* mutasyonu derece yükseldikçe sıklaşır. Büyük bir çalışmada derece 1’de %37, derece 2’de %60, derece 3’te %69 bulundu (Wang ve ark., 2024).
- **Genler yerle eşleşir:** *NF2* kaybı olan menenjiyomlar beyin kubbesinde ve arka-yan kafa tabanında toplanır. *NF2* dışı mutasyonlu olanlar (*TRAF7*, *SMO*, *SUFU*, *PRKAR1A*) ön kafa tabanında görülür. *NF2* ile *SMARCB1* birlikteliği ön orak boyunca görülür (Wang ve ark., 2024). *NF2* ve *TRAF7* değişiklikleri, aynı yer eğilimiyle normal ince zarlarda da bulunmuştur (Wang ve ark., 2024).
- **Embriyonik köken:** Zar hücreleri (meningotel hücreleri) yumuşak zarda, örümcek ağı zarda ve subaraknoid boşluğun lif ağında bulunur. Kafa tabanındakiler mezodermden, beyin kubbesindekiler sinir krestinden köken alır (Ogasawara ve ark., 2021). Mezoderm ve sinir kresti, embriyonun iki ayrı hücre kaynağıdır.
- **Derece ve yer:** Derece 1 menenjiyomlar daha çok kafa tabanında bulunur. Yüksek dereceliler beyin kubbesinde, orak yanında, orakta, sinüslerin birleşim yerinde (torkula) ve karıncık içinde daha sıktır (Ogasawara ve ark., 2021). Türkiye’den 449 yetişkinlik bir seride de kubbe yerleşimi nüks, ölüm ve yüksek dereceyle ilişkili bulundu. Bu seride en sık alt tip meningotelyaldi (%51,7), ardından atipik geliyordu (%20,3) (Celtikci ve ark., 2018).
- **Derece 3’ün gerçek yüzü:** Yalnızca derece 3 olan menenjiyomlarda bir kohortta 5 yıllık genel sağkalım %66’ydı. 10 yıllık sağkalım yalnızca %14–24 olarak tahmin edilir (Wang ve ark., 2024).
- **Sıklık artıyor mu?** ABD’de menenjiyom sıklığı 2004–2009’da her yıl %4,6 arttı. 2009–2015’te ise sabit kaldı (Lin ve ark., 2019).
- **Ad değişikliği:** Eski “NF2 sendromu”nun adı 2022’den beri “NF2 ilişkili schwannomatozis”tir (Wang ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Işın ve menenjiyom',
      md: `- İsrail’de 1948–1960 arasında saçlı deri mantarı için ışın tedavisi alan çocuklar izlendi. Bu çocuklarda menenjiyom riski yaklaşık 10 kat yüksek bulundu. Atom bombasından kurtulanlarda da risk belirgin biçimde artmıştı (Wiemels ve ark., 2010).
- Diş röntgeni tartışmalıdır. 200 hastalık bir olgu-kontrol çalışması, hastaları hasta olmayanlarla karşılaştırdı. Bu çalışmada tam ağız diş röntgeni çektirenlerde risk anlamlı olarak yüksekti (olasılık oranı 2,06). Ama doz arttıkça riskin arttığı gösterilemedi (Wiemels ve ark., 2010). Işın ile tümör arasındaki gecikme 20–30 yıl, hatta daha uzundur (Wiemels ve ark., 2010).
- Liverpool’da ışın sonrası menenjiyomu olan 54 hasta ve 110 tümör incelendi. Ortalama doz 41 Gy’di; Gy (gray), ışın dozunun birimidir. Tümör, ışından ortalama 34,4 yıl sonra ortaya çıktı. Ortanca büyüme yılda 0,62 cm³’tü (Gillespie ve ark., 2021). Ameliyat edilen tümörler saldırgandı: %43,6’sı ilk ameliyatta derece 2’ydi; %41’i ameliyattan sonra ilerledi (Gillespie ve ark., 2021).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Kuyruklu kitle',
      oyku: '58 yaşında bir kadın, ara ara olan baş ağrısı için MR çektiriyor. Sağ alın-yan kafa bölgesinde, beynin yüzeyinde, sert zara oturan 3 cm’lik bir kitle var. Kitle kontrastla düzgün boyanıyor. Kenarlarından sert zar boyunca ince, boyanan bir uzantı görülüyor. Kitlede kireçlenme yok. T2 ağırlıklı görüntüde parlak; çevresinde hafif ödem var. Nörolojik muayenesi normal.',
      soru: 'Kenardaki uzantıya ne denir ve tanı koydurur mu? Bu kitlenin büyüme riski hakkında ne söylenebilir? Ameliyat edilirse sert zara ne yapılmalıdır?',
      cozum: `**Sert zar kuyruğu.** Bu uzantı bir kaynağa göre menenjiyomların yaklaşık %60–72’sinde görülür. Menenjiyomu güçlü biçimde düşündürür ama tanı koydurmaz. Metastaz, lenfoma ve hemanjiyoperisitomda da görülebilir (Doddamani ve ark., 2018). 18 çalışmalık bir derlemede kuyruk, menenjiyomların %34–72’sinde görüldü (Cordia ve ark., 2025). DSÖ derecesini görüntü değil, doku incelemesi verir. Bu inceleme mikroskop bulgularına ve bazı gen değişikliklerine bakar (Wang ve ark., 2024).

**Büyüme riski.** Kitlede büyüme riskini artıran birkaç özellik var. Kireçlenme yok, T2’de parlak, çevresinde ödem var ve kafa tabanı dışında (Wang ve ark., 2024). Türkiye’den 449 hastalık bir seride beyin kubbesi yerleşimi nüks, ölüm ve yüksek dereceyle ilişkiliydi (Celtikci ve ark., 2018).

**Sert zar.** EANO’ya göre tutulan sert zarla birlikte tam çıkarım çoğu zaman tedavi edicidir (Goldbrunner ve ark., 2021). Tümör, tutunduğu sert zar ve kemikle birlikte çıkarılırsa Simpson derece I olur. Beyin kubbesi menenjiyomlarında çevredeki 2 cm sert zarın da çıkarıldığı “derece 0” önerilmiştir (Wang ve ark., 2024). Kuyrukların %70,9’unda mikroskopla tümör bulunmuştur. Normal görünen sert zarda bile %40 oranında tümör sızması vardır (Cordia ve ark., 2025). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Soliter fibröz tümör: lisans ve uzman ———
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Başka bir zar tümörü: soliter fibröz tümör',
      md: 'Soliter fibröz tümör (SFT) ile hemanjiyoperisitom eskiden ayrı tümörler sayılırdı. Bugün ikisi tek bir yelpazenin iki görünümüdür. Onları birleştiren ortak bir gen kaynaşmasıdır: *NAB2–STAT6*. DSÖ sınıflaması da ikisini tek bir yelpazede toplar (Boualoy ve ark., 2025). “Hemanjiyoperisitom” adını 1942’de Stout ve Murray koydu (Boualoy ve ark., 2025). Kafa içi SFT, birincil beyin tümörlerinin %1’inden azdır (Liu ve ark., 2022). Nadir bir zar tümörüdür (Kinslow ve ark., 2023). Sert zar kuyruğu bu tümörde de görülebilir (Doddamani ve ark., 2018).',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'SFT neden menenjiyomdan ayrılmalı?',
      md: 'SFT’nin menenjiyomdan farkı davranışındadır: neredeyse her zaman nükseder ve kafatası dışına yayılabilir (Kinslow ve ark., 2023). 133 hastalık bir seride *NAB2–STAT6* kaynaşması, başarıyla test edilen tümörlerin %89’unda bulundu. STAT6 boyası 132 olguda hücre çekirdeğinde olumluydu (Fritchie ve ark., 2019). 38 hastalık bir Çin serisinde 10 yıllık ilerlemesiz sağkalım %21,4’tü. Genel sağkalım ise %64,2’ydi (Liu ve ark., 2022). Yani uzun izlemde nüks kuraldır.',
    },

    // ——— Düşük basınç: temel ———
    {
      tur: 'metin',
      md: `**Beyin sıvının içinde yüzer.** Beyin ve omurilik BOS’un içinde durur. Sert zarda bir delik açılırsa BOS dışarı sızar. Sıvı azalınca beyin desteğini kaybeder ve aşağı doğru yer değiştirir (Nouri ve ark., 2021). Bu duruma **kafa içi düşük basınç** (*intracranial hypotension*) denir. İki biçimi vardır:

- **Kendiliğinden olan:** Omurga bölgesinde bir BOS kaçağı vardır. Kaçağın nedeni sert zarda bir yırtık, sızdıran bir zar cebi ya da BOS ile bir toplardamar arasında anormal bir geçit olabilir (Cheema ve ark., 2023).
- **Bel delmesinden sonra olan:** Bel delme (lomber ponksiyon), belden iğneyle BOS alınmasıdır. İğnenin sert zarda açtığı delikten BOS sızabilir. Basınç düşer ve baş ağrısı başlar (Plewa ve ark., 2025).

En tipik belirti, ayağa kalkınca başlayan ya da artan, uzanınca geçen baş ağrısıdır. Buna duruşa bağlı (ortostatik) baş ağrısı denir. Kendiliğinden olan biçimde hastaların %92’sinde görülür. Bulantı (%54) ve boyun ağrısı ya da sertliği (%43) de sıktır (D’Antona ve ark., 2021).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Kendiliğinden kafa içi düşük basınç sanıldığı kadar nadir değildir. ABD’de bir ilçede yetişkinlerde yıllık sıklığı 100.000 kişide 3,8 bulundu. Bu, beyin damarındaki bir balonun (anevrizma) yırtılmasıyla olan kanamayla kabaca aynı sıklıktır (Pradeep ve ark., 2025).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Ayakta artan baş ağrısı',
      md: 'Bel delmesinden sonraki baş ağrısı genellikle işlemden sonraki 5 gün içinde başlar. Ayakta artar, uzanınca azalır. Çoğu 2 hafta içinde kendiliğinden geçer (Plewa ve ark., 2025). Ayakta artan bir baş ağrısı bel delmesi olmadan da başlayabilir. O zaman kendiliğinden bir BOS kaçağı akla gelir (Cheema ve ark., 2023).',
    },

    // ——— Düşük basınç: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kendiliğinden kafa içi düşük basınç: sayılar ve tanım.** Ağır sakatlık yaratabilen bir sendromdur. Yıllık sıklığı 100.000 kişide yaklaşık 3,7’dir (Cheema ve ark., 2023). ABD’de Beverly Hills’te 2006–2020 arasında 19 hasta bulundu. Yıllık sıklık 3,7; kadınlarda 4,3, erkeklerde 2,9’du. Ortalama yaş 54,5’ti (Schievink ve ark., 2022). Olmsted County’de (ABD) 2019–2021 arasında 14 hasta bulundu. Yetişkinlerde sıklık 3,8’di. Hastaların yarısında BOS–toplardamar fistülü vardı (Pradeep ve ark., 2025). 144 makalelik bir meta-analizde ortalama yaş 42,5, kadınların payı %63’tü (D’Antona ve ark., 2021).

İngiltere’deki uzlaşı kılavuzu, uzandıktan sonra 2 saat içinde baş ağrısının %50’den fazla azalmasını bekler (Cheema ve ark., 2023). Uluslararası baş ağrısı sınıflaması (ICHD-3), düşük basıncı bel delmesindeki açılış basıncının 60 mm BOS’un altında olması diye tanımlar (D’Antona ve ark., 2021). Ama ölçülen basınç hastaların yalnızca %67’sinde düşüktü. %32’sinde normaldi (60–200 mm su), %3’ünde yüksekti (D’Antona ve ark., 2021). Yani normal bir basınç tanıyı dışlamaz. Normal aralık başka bir kaynakta 65–195 mm su olarak verilir (Swyden ve ark., 2023).

**Neden bu bulgular?** Kafatası kapalı bir kutudur; içinde beyin, kan ve BOS vardır. Bu ilke, [ilk derste](/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis?duzey=lisans#koruyanlar-ve-besleyenler) gördüğümüz Monro–Kellie ilkesidir. Kaybedilen BOS’un yerini kafa içindeki kan hacmi alır. Kalın zar boyanması, subdural sıvı ve toplardamarların genişlemesi bu yer doldurmanın sonucudur (Callen ve ark., 2023). Sert zar boyanır, çünkü damarları kanla dolar ve damarlardan sert zara sıvı sızar (Patel ve ark., 2024). Beyin de desteğini yitirip aşağı iner. Bu, köprü toplardamarlarını ve örümcek ağı zarın küçük damarlarını gerer (Nouri ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Düşük basıncın MR bulguları ve Bern puanı',
      sutunlar: ['Bulgu', 'Ne olur?', 'Hastalardaki sıklığı', 'Bern puanı'],
      satirlar: [
        [
          'Kalın zar (pakimeningeal) boyanması',
          'Sert zar düzgün ve yaygın biçimde kalınlaşır ve boyanır',
          '%73 (meta-analiz); %70’ten çok (derleme)',
          '2',
        ],
        ['Toplardamar sinüslerinin dolgunluğu', 'Sinüsler genişler ve yuvarlaklaşır', '%57', '2'],
        ['Suprasellar sisternanın silinmesi', 'Hipofiz bezinin üstündeki sisterna 4,0 mm ya da daha aza iner', '—', '2'],
        ['Subdural sıvı toplanması', 'Sert zarın altında ince bir sıvı birikir', '%35 (meta-analiz); %35–50 (derleme)', '1'],
        ['Prepontin sisternanın daralması', 'Köprünün önündeki sisterna 5,0 mm ya da daha aza iner', 'Beyin sarkmasıyla birlikte %43', '1'],
        [
          'Mamillopontin uzaklığın kısalması',
          'Mamiller cisimler ile köprü (pons) arasındaki uzaklık 6,5 mm ya da daha aza iner',
          'Beyin sarkmasıyla birlikte %43',
          '1',
        ],
        ['Hipofiz bezinin büyümesi', 'Bez şişkin görünür', '%38', '—'],
        ['Normal MR', 'Hiçbir bulgu yok', '%19', '—'],
      ],
      not: 'Bern puanı en çok 9’dur. 2 ya da altı düşük, 3–4 orta, 5 ve üstü yüksek omurga kaçağı olasılığı demektir (Dobrocky ve ark., 2019). Sıklıklar (D’Antona ve ark., 2021; Orru ve ark., 2026). Hastaların %80’inden fazlasında en az bir tipik bulgu vardır (Orru ve ark., 2026). Kaçağı bulunan hastalarda ortalama Bern puanı 5,35, bulunmayanlarda 1,85’ti (Callen ve ark., 2023).',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Düşük basınç görüntüde',
      md: `- En duyarlı inceleme beyin MR’ıdır. Ama MR hastaların %19’unda normaldir (D’Antona ve ark., 2021).
- Bel delmeden sonra yaygın kalın zar boyanması görülürse dikkat edilir. Buna subdural sıvı ve beyincik bademciklerinin aşağı inmesi eşlik ediyorsa kafa içi düşük basınç düşünülmelidir (Mahendru ve Chong, 2009).
- FLAIR’de oluklardaki parlaklık düşük basınçta da görülebilir. Kafa içi basıncı yüksek iki hastada BOS boşaltıldıktan sonra bu parlaklık çıktı (Yazdani ve ark., 2019). Önerilen açıklama şudur: BOS azalınca oluktaki sinyale kan baskın olur. Kanın sinyali FLAIR’in baskılama adımıyla silinmez (Yazdani ve ark., 2019). Bir hastada parlaklık bir ay sonra kaybolmuştu (Yazdani ve ark., 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bel delme sonrası baş ağrısı.** İlk bel delmeyi 1891’de Heinrich Quincke yaptı. 1898’de August Bier bu baş ağrısını anlattı. Bier, sert zardaki delikten süren BOS kaçağının baş ağrısını başlattığını öne sürdü (Swyden ve ark., 2023). Ayakta kötüleşip uzanınca düzelmesi bu baş ağrısının ayırt edici özelliğidir. Tedavi edilmezse %90’dan fazlası 7–10 günde kendiliğinden geçer (Tubben ve ark., 2023).

Risk etkenleri şunlardır: iğnenin kalınlığı, 60 yaşından genç olmak ve kadın olmak (Tubben ve ark., 2023). İğnenin ucu da önemlidir. Kesici uçlu klasik iğnelerin yerine kalem uçlu, yani atravmatik iğneler kullanılabilir. 110 randomize çalışmada 31.412 kişi karşılaştırıldı; randomize çalışmada katılımcılar gruplara kurayla ayrılır. Baş ağrısı klasik iğnede %11,0, atravmatik iğnede %4,2’ydi (Nath ve ark., 2018). Spinal anestezi, belden iğneyle yapılan bölgesel uyuşturmadır. Spinal anestezi çalışmalarının bir başka meta-analizinde kesici uçlu iğne, baş ağrısı riskini kalem uçluya göre 2,5 kat artırdı (Xu ve ark., 2017).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'İğne ve bel delme sonrası baş ağrısı',
      sutunlar: ['İğne ya da işlem', 'Baş ağrısı sıklığı'],
      satirlar: [
        ['25G spinal iğneyle spinal anestezi', '%1’in altında'],
        ['20G ya da 22G iğneyle tanı amaçlı bel delme', '%36’ya yakın'],
        ['17G epidural iğneyle sert zarın yanlışlıkla delinmesi', 'Yaklaşık %75–80'],
        ['Klasik iğneler (110 randomize çalışmanın birleşimi)', '%11,0'],
        ['Atravmatik iğneler (aynı birleşim)', '%4,2'],
      ],
      not: 'G (gauge) numarası iğnenin çapını gösterir: numara büyüdükçe iğne incelir. Kaynak: (Tubben ve ark., 2023; Nath ve ark., 2018).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Epidural kan yaması',
      md: `**Epidural kan yaması**, hastanın kendi kanının sert zarın dışındaki epidural boşluğa verilmesidir. Amaç sert zardaki deliği kapatmaktır (Shin, 2022). İlk kan yamasını 1960’ta Gormley 2–3 mL kanla yaptı. Kanlı geçen bel delmelerinde baş ağrısının az olduğunu görmüştü (Shin, 2022).

- **Bel delme sonrası baş ağrısında:** Başarı yaklaşık %85’tir; yama tekrarlanınca %90’a çıkar (Tubben ve ark., 2023).
- **Kendiliğinden düşük basınçta:** İlk basamak, olabildiğince erken yapılan hedefsiz kan yamasıdır (Cheema ve ark., 2023). Hedefsiz yama, kaçağın yerini hedeflemeden yapılan yamadır. Tek bir yama hastaların %64’ünde başarılı oldu. 20 mL’den büyük yamalar daha başarılıydı: %77’ye karşı %66. Girişim yapılmayan koruyucu tedavi yalnızca hastaların %28’inde yetti (D’Antona ve ark., 2021).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Sabah kalkınca başlayan baş ağrısı',
      oyku: '42 yaşında bir kadın üç haftadır süren baş ağrısıyla geliyor. Ağrı sabah yataktan kalktıktan kısa süre sonra başlıyor. Ayakta kaldıkça artıyor. Uzanınca bir saat içinde yarıdan çok azalıyor. Bulantısı ve ense ağrısı var. Yakın zamanda bel delmesi ya da ameliyat geçirmemiş. Kontrastlı beyin MR’ında sert zar yaygın ve düzgün biçimde boyanıyor. Toplardamar sinüsleri dolgun. İnce bir subdural sıvı var. Suprasellar sisterna 3 mm’ye daralmış.',
      soru: 'Hangi tanı düşünülür? Bern puanı kaçtır ve ne anlama gelir? İlk tedavi basamağı nedir?',
      cozum: `**Tanı: kendiliğinden kafa içi düşük basınç.** Ayakta başlayan, uzanınca geçen baş ağrısı bu hastaların %92’sinde görülür. Bulantı ve boyun ağrısı da sıktır (D’Antona ve ark., 2021). İngiltere uzlaşısı, uzandıktan sonra 2 saat içinde %50’den fazla düzelme bekler; bu hastada öyledir (Cheema ve ark., 2023).

**Bern puanı: 7.** Kalın zar boyanması 2, sinüs dolgunluğu 2, suprasellar sisternanın 4 mm ya da altına inmesi 2 ve subdural sıvı 1 puandır. 5 ve üstü, omurga kaçağı olasılığının yüksek olduğunu gösterir (Dobrocky ve ark., 2019). Bu bulgular, kaybedilen BOS’un yerini kan hacminin almasıyla oluşur (Callen ve ark., 2023).

**Bel delmesi tanıyı kanıtlar mı?** Açılış basıncı hastaların %32’sinde normaldir. Normal bir basınç tanıyı dışlamaz (D’Antona ve ark., 2021).

**İlk basamak:** olabildiğince erken yapılan hedefsiz epidural kan yamasıdır (Cheema ve ark., 2023). 20 mL’den büyük yamalar daha başarılı bulunmuştur (D’Antona ve ark., 2021). Düşük basıncın sık bir sorunu da subdural kanamadır (Orru ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Düşük basınç: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Düşük basınç, subdural kanama ve kaçağı bulmak',
      md: `- **Subdural kanama:** Kendiliğinden düşük basınçta subdural kanama olguların %16–57’sinde bildirildi. Büyük olasılıkla toplardamarların dolgunluğu ve köprü toplardamarlarının gerilmesiyle olur (Orru ve ark., 2026). Bu yüzden travma, pıhtılaşma bozukluğu ya da alkol öyküsü olmayan subdural kanamada omurga kaçağı aranmalıdır. Bunun için kontrastlı beyin MR’ı ve bütün omurganın MR’ı çekilir (Cheema ve ark., 2023).
- **Gizlenen kanama:** Zonguldak ve Ankara’dan Kale ve arkadaşları iki olgu bildirdi. İki hastaya da epidural anestezi, yani sert zarın dışındaki boşluğa ilaç verilerek uyuşturma denenmişti. Yazarlara göre bu sırada sert zar yanlışlıkla delindi ve iki yanlı subdural kanama gelişti (Kale ve ark., 2015). Bel delme sonrası baş ağrısı çok sık olduğu için subdural kanamanın tanısını gizleyebilir ya da geciktirebilir (Kale ve ark., 2015).
- **Geç sonuç:** Uzun süren ön (ventral) omurga kaçakları, beyin yüzeyinde demir birikmesi (yüzeysel siderozis) gibi ciddi geç sonuçlar doğurabilir (Cheema ve ark., 2023).
- **Kaçağı göstermek:** Türkiye’den Albayram ve arkadaşları bel boşluğuna 0,5 mL gadolinyum (bir MR kontrast maddesi) verdi. Ardından BOS boşluklarını gösteren MR sisternografi yaptı. 19 hastanın 17’sinde (%89) kaçak görüldü. 14 hastada yırtığın yeri tam saptandı (Albayram ve ark., 2008).
- **Tedaviden sonra:** BOS–toplardamar fistülü kapatıldıktan 24 saat sonra kalın zar boyanması hastaların yarısından fazlasında geriledi (Orru ve ark., 2026).
- **Tarih:** George Schaltenbrand kendiliğinden düşük basınca “aliquorrhea” adını verdi. Üç neden önerdi: BOS yapımının azalması, emiliminin artması ve kaçak (Swyden ve ark., 2023).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Ne kadar BOS kaybı baş ağrısı yapar?** BOS dakikada yaklaşık 0,35 mL, günde yaklaşık 500 mL yapılır. Toplam hacim yaklaşık 150 mL’dir. Hacmin %10’undan fazlası kaybedilince duruşa bağlı baş ağrısı başladığı düşünülür (Shin, 2022). Kan yamasında hacim önemlidir. Crawford 1980’de 6–15 mL kanla %70, 20 mL kanla %96 başarı bildirdi (Shin, 2022).

**İğnenin ucu ve sert zarın lifleri.** Eski bir varsayıma göre bel bölgesindeki sert zarın lifleri boyuna dizilir. Bu yüzden iğnenin kesici yüzü liflere paralel girerse lifleri kesmeyip araladığı düşünülürdü. Paralel girişte baş ağrısının daha az görüldüğü de bildirilmişti (Bıçak ve ark., 2019). Işık ve elektron mikroskobuyla yapılan çalışmalar bu varsayımı desteklemez: dış yüzde boyuna lifler olabilir, ama bu düzen derin katmanlarda yinelenmez (Shin, 2022). Türkiye’den iki çalışmanın sonuçları da tutarsızdır:

- Diyarbakır Gazi Yaşargil Eğitim ve Araştırma Hastanesi’nde sezaryenle doğum yapan 300 kadın incelendi. 26G, kesici uçlu Quincke iğne kullanıldı. Baş ağrısı, iğne ucunun başa doğru baktığı grupta %14, yana baktığı grupta %8, ayağa doğru (kaudal) baktığı grupta %3’tü (Bıçak ve ark., 2019). Baş ağrılarının %64’ü ilk 24 saatte, %24’ü 24–48 saatte, %12’si 48–72 saatte başladı (Bıçak ve ark., 2019).
- İstanbul ve Diyarbakır’dan 100 sezaryen hastasında aynı iğne denendi. Kesici yüz enine düzlemdeyken baş ağrısı %14, sagital düzlemdeyken %8’di. Fark anlamlı değildi (Salik ve ark., 2018).

**Atravmatik iğnenin bedeli** zamandır. 10 mL BOS toplamak 22G atravmatik iğneyle 6,1 dakika, 20G klasik iğneyle 2,2 dakika sürdü (van Dongen ve ark., 2021). Bel delme sonrası baş ağrısı için uluslararası, çok dernekli bir uzlaşı yayımlandı. 21 kişilik kurul 47 öneri üretti. Uzlaşının amacı, kanıta dayalı kılavuz eksikliğini doldurmaktı (Uppal ve ark., 2023).`,
    },

    // ——— Araknoid kist: temel ———
    {
      tur: 'metin',
      md: `**Araknoid kist** (*arachnoid cyst*), beyindeki en sık kisttir. Tümör değildir; içi BOS dolu bir kesedir. Örümcek ağı zar yarılınca araya sıvı toplanır ve kist oluşur (NINDS, t.y.). Kistlerin çoğu doğuştandır. Gebeliğin ilk haftalarındaki olağan dışı bir gelişimden doğar (NINDS, t.y.). Bazıları sonradan, örneğin bir travma ya da ameliyattan sonra gelişir (Mustansir ve ark., 2018).

Kistlerin çoğu belirti vermez. Yetişkin serilerinde kistlerin %94’ten fazlası belirtisizdi (Carbone ve Sadasivan, 2021). Kistler genellikle başka bir nedenle çekilen görüntülerde tesadüfen bulunur.

En sık yeri **orta kafa çukuru**dur. Orta kafa çukuru, kafa tabanında şakak lobunun oturduğu kemik çukurdur. Klinik serilerde kistlerin yaklaşık %50–65’i buradadır (Mustansir ve ark., 2018).`,
    },
    {
      tur: 'sahne',
      baslik: 'Araknoid kistin en sık yeri: orta kafa çukuru',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf ekranın solunda. Kafatası ve şakak lobu (turuncu) yarı saydam yapıldı; böylece şakak lobunun ön kısmının oturduğu orta kafa çukuru görünür. Klinik serilerde araknoid kistlerin %50–65’i bu çukurdadır (Mustansir ve ark., 2018). Örümcek ağı zar modelde yoktur. Beyincik arkasındaki arka kafa çukuru, bazı serilerde ikinci sık yerdir (Carbone ve Sadasivan, 2021).',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'kemik'],
        renk: 'dogal',
        saydam: ['katman:kemik', 'lob:temporal'],
        boya: [{ secici: ['lob:temporal'], renk: SAKAK }],
        bakis: 'sol',
        etiketler: [
          { yapi: 'orta-temporal-girus-sol', metin: 'Şakak lobu (yarı saydam)' },
          { yapi: 'alt-frontal-girus-sol', metin: 'Alın lobu' },
          { yapi: 'beyincik', metin: 'Beyincik: arkası ikinci sık yer' },
        ],
        noktalar: [{ nokta: 'buyuk-kanat-beyin-yuzu-sol', metin: 'Orta kafa çukurunun önü' }],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Her belirti kistten değildir',
      md: 'Tesadüfen bulunan bir kiste her belirtiyi yüklemek doğru olmayabilir. İsveç’te 70 yaş ve üstü 1235 kişi incelendi. Kistler baş ağrısı, baş dönmesi, bilişsel bozulma ya da ölümle ilişkili bulunmadı (Rabiei ve ark., 2016). Öte yandan büyük bir kist komşu dokulara bastırıp belirti verebilir (Mustansir ve ark., 2018).',
    },

    // ——— Araknoid kist: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Araknoid kist ne kadar sık, nerede?',
      sutunlar: ['Çalışma', 'Kimler, hangi yöntem?', 'Yaygınlık', 'Yer ve cinsiyet'],
      satirlar: [
        ['Al-Holou ve ark., 2013', '48.417 yetişkin; bir merkezin 12 yıllık MR arşivi', '%1,4 (661 kişi)', 'Erkeklerde daha sık'],
        ['Al-Holou ve ark., 2010', '18 yaş altı 11.738 çocuk; MR', '%2,6 (309 kist)', '—'],
        ['Rabiei ve ark., 2016 (İsveç)', '70 yaş ve üstü 1235 kişi; BT', '%2,3', 'Cinsiyet farkı yok'],
        [
          'Håberg ve ark., 2016 (Norveç)',
          '50–66 yaşında 1006 kişi; araştırma MR’ı',
          '%3,6 (36 kist)',
          'Yarımkürelerin üstünde %53, arka çukurda %33, orta çukurda %14',
        ],
        ['Sunny ve ark., 2022 (meta-analiz)', '36.367 katılımcı; tesadüfi MR bulguları', '1000 taramada 8,5', '—'],
        ['Carbone ve Sadasivan, 2021 (derleme)', 'Yetişkin serileri', '—', 'Orta çukur %34, beyincik arkası %33, kubbe %14'],
        ['Mustansir ve ark., 2018 (derleme)', 'Klinik seriler', '—', 'Orta çukur %50–65'],
      ],
      not: 'Sayılar yönteme göre değişir: klinik arşiv mi, araştırma taraması mı; çocuk mu, yaşlı mı? Orta çukur payındaki fark, hastaların nasıl seçildiğinden kaynaklanıyor olabilir. Araknoid kistler kafa içinde yer kaplayan lezyonların %1’idir (Mustansir ve ark., 2018). Kaynaklar: (Al-Holou ve ark., 2013; Al-Holou ve ark., 2010; Rabiei ve ark., 2016; Håberg ve ark., 2016; Sunny ve ark., 2022; Carbone ve Sadasivan, 2021).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yapı ve belirti.** Birincil (gelişimsel) kistler, anne karnında örümcek ağı zarın ikiye ayrılmasıyla oluşur. İkincil kistler daha azdır; travma, ameliyat, enfeksiyon ya da kanamadan sonra görülür (Mustansir ve ark., 2018). Kist büyükse komşu sinir ve damarlara bastırabilir. En sık belirti baş ağrısıdır (%66) (Mustansir ve ark., 2018).

**Orta çukur kistleri: Galassi tipleri.** Orta kafa çukurundaki kistler üç tipe ayrılır (Mustansir ve ark., 2018):`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Orta kafa çukuru kistleri: Galassi tipleri',
      sutunlar: ['Tip', 'Büyüklük ve yer', 'Komşu beyne etkisi'],
      satirlar: [
        ['I', 'Orta kafa çukurunun ön kısmında', 'Genellikle belirti vermez'],
        ['II', 'Sylvius yarığı boyunca yukarı uzanır', 'Bazen şakak lobunu iter'],
        ['III', 'Çok büyük; bütün orta kafa çukurunu doldurur', 'Şakak lobunu iter; yan kafa ve alın loblarını da bozar'],
      ],
      not: 'Kaynak: (Mustansir ve ark., 2018). Galassi’nin özgün makalesi okunamadı; tipler bu derlemeden alındı.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kist, travma ve kanama',
      md: `- Küçük travmalardan sonra subdural kanama, subdural sıvı birikmesi (higroma) ve kist içine kanama gelişebilir (Bilginer ve ark., 2009).
- Van’dan bir olgu bildiriminde, 2 yaşında bir erkek çocukta orta çukur kisti kendiliğinden subdural aralığa yırtıldı (Bora ve ark., 2015).
- Diyarbakır ve Batman’dan iki yetişkinde kendiliğinden kist içi ve subdural kanama gelişti. Hastaların biri ameliyatsız izlendi ve başarıyla iyileşti. Literatürde bildirilen olguların hemen hepsi ameliyat edilmişti (Adin ve ark., 2018).

Subdural kanamanın zarlarla bağı “Kanamalar ve fıtıklaşmalar” bölümünde anlatıldı.`,
    },

    // ——— Araknoid kist: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kistin duvarı ve kökeni',
      md: `- **Duvarın yapısı:** Kistin kenarında örümcek ağı zar ikiye ayrılır. Duvarda kalın kolajen katmanları, aşırı çoğalmış örümcek ağı zar hücreleri vardır; trabeküller yoktur (Carbone ve Sadasivan, 2021).
- **Tek tip köken yok:** Göteborg’da ameliyatla alınan 24 kist duvarı elektron mikroskobuyla incelendi. 12 duvar normal örümcek ağı zara benziyordu. 4 duvarın ortasında yoğun lifli bir doku ve basit bir hücre örtüsü vardı. Kalanlarda örümcek ağı zara ait olmayan örtü hücreleri bulundu (Rabiei ve ark., 2014). Bu bulgular farklı kökenleri düşündürür. Önerilen nedenler zarın yarılması ya da ikilenmesi, travma ve az sayıda olguda genetik etkenlerdir (Rabiei ve ark., 2014).
- **Nasıl büyür?** Üç varsayım vardır: iki yan arasındaki yoğunluk farkı (ozmotik fark), tek yönlü bir kapakçık düzeneği ve kist duvarının BOS benzeri sıvı yapması (Carbone ve Sadasivan, 2021).
- **Gelişimdeki kökü:** İlkel zarın boşluklandığı evrede örümcek ağı zarın ikilenmesi ya da zarların kaynaşamaması birincil kistlere yol açabilir (Zedde ve Pascarella, 2025a). İlkel zar, “Zarların gelişimi ve keşif tarihi” bölümünde anlatıldı.
- **Suprasellar kist:** Hipofiz bezinin üstündeki araknoid kist, delinmemiş Liliequist zarının içine doğru BOS’un biriktiği bir cep olarak anlaşılabilir (Dias ve ark., 2014).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den araknoid kist çalışmaları',
      sutunlar: ['Çalışma', 'Ne incelendi?', 'Bulgu'],
      satirlar: [
        [
          'Yildiz ve ark., 2005 (Bursa, Uludağ)',
          '39 kafa içi kist; faz kontrast sine MR',
          'Kistin sisternayla bağlantısını %92,3 doğrulukla gösterdi; 24 kist bağlantısız, 15’i bağlantılıydı',
        ],
        [
          'Algin ve ark., 2009 (Bursa, Uludağ)',
          '21 karıncık içi kist',
          'Sine MR’ın kist ile BOS boşlukları arasındaki bağlantıyı göstermede duyarlılığı %100, özgüllüğü %54; sine MR’da bağlantısız görünen kistlerin hepsi MR sisternografide de bağlantısızdı; MR sisternografide kistlerin %38’i bağlantılıydı',
        ],
        [
          'Tali ve ark., 2004 (Ankara, Gazi)',
          '20 hastada 22 kist; omurilik kanalına düşük doz gadolinyumla MR sisternografi',
          '11 kist hemen, 6’sı yalnızca 24. saatte kontrast aldı; 5’i hiç almadı',
        ],
        ['Duz ve ark., 2012 (Ankara, Gülhane)', '1992–2009’da ameliyat edilen 75 hasta', '54 erkek, 21 kadın; yaş 2 ay–45 yıl'],
        [
          'Erdinçler ve ark., 1999 (İstanbul)',
          'Belirti veren 12 arka çukur kisti',
          'Ameliyatla tedavi edildi; bu kistlerin çoğunlukla doğuştan olduğu düşünülür',
        ],
      ],
      not: 'Sine MR, BOS’un akışını görüntüleyen MR tekniğidir; MR sisternografi ise sisternaların içini kontrastla gösterir. Kaynaklar: (Yildiz ve ark., 2005; Algin ve ark., 2009; Tali ve ark., 2004; Duz ve ark., 2012; Erdinçler ve ark., 1999).',
    },

    // ——— Sert zar fistülü: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sert zar atardamar-toplardamar fistülü** (*dural arteriovenous fistula*; kısaca dural AVF). Bu hastalıkta sert zarın ya da beynin bir atardamarı, bir toplardamara doğrudan bağlanır. Bağlantı, sert zarın toplardamar sinüslerine ya da beyin yüzeyinin toplardamarlarına açılır. Kan, kılcal damarlara uğramadan kısa devre yapar. Bu fistüller kafa içindeki atardamar-toplardamar kısa devrelerinin %10–15’idir (Heit ve ark., 2017).

Beyin damar yumağından (arteriyovenöz malformasyon, AVM) farkı şudur: fistülde bir damar yumağı (nidus) yoktur. Fistüller çoğunlukla sonradan edinilir. Travmadan ya da bir sinüsün pıhtıyla tıkanmasından (trombozundan) sonra gelişir (Heit ve ark., 2017). Bir varsayıma göre sinüs tıkanınca toplardamar basıncı yükselir. Bu basınç sert zarın içindeki çok küçük bağlantıları açar. Bağlantılar zamanla büyür ve doğrudan kısa devreye dönüşür (Gupta ve Periakaruppan, 2009).

**Nerede çıkar?** En sık yer, enine sinüs ile S biçimli (sigmoid) sinüsün birleştiği yerdir; solda biraz daha sıktır (Zyck ve ark., 2023). Fistüller başka yerlerde de bulunur: beyincik çadırında, kayalık kemik çevresinde ve kalbur kemiği bölgesinde. Sylvius yarığı çevresinde, kavernöz sinüste, omurga sert zarında ve üst sagital sinüste de görülür (Zyck ve ark., 2023). Sinüslerin anatomisi “Sert zarın toplardamar sinüsleri” bölümünde anlatıldı.

**Nasıl davranır?** Fistülün davranışını toplardamar akışının yönü belirler. Kan beyin yüzeyinin (kortikal) toplardamarlarına geri akıyorsa fistül saldırgan seyre yatkındır. En saldırgan yer çadırdır; ardından Sylvius yarığı ve orta çukur, sonra kalbur kemiği ve ön çukur gelir (Zyck ve ark., 2023).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sert zar fistüllerinin yerleri',
      aciklama:
        'Kafatasının tepesi kaldırıldı; kafa tabanına yukarıdan bakıyoruz, ön taraf ekranın üstünde. Beyincik çadırı soluk kırmızı ve yarı saydam. Toplardamar sinüsleri modelde yoktur; etiketler, sinüslerin kemikteki oluklarında nerede uzandığını gösterir. Fistüllerin en sık yeri, enine ve S biçimli sinüs oluklarının birleştiği yerdir (Zyck ve ark., 2023).',
      sahne: {
        katmanlar: ['kemik', 'zar'],
        renk: 'dogal',
        vurgula: ['katman:kemik'],
        saydam: ['beyincik-cadiri'],
        boya: [{ secici: ['beyincik-cadiri'], renk: CADIR }],
        bakis: 'ust',
        kesit: { duzlem: 'aksiyel', konum: 1 },
        etiketler: [{ yapi: 'beyincik-cadiri-sol', metin: 'Çadır: en saldırgan yer' }],
        noktalar: [
          { nokta: 'enine-sinus-olugu-sol', metin: 'Enine sinüs burada uzanır' },
          { nokta: 'sigmoid-olugu-sol', metin: 'S biçimli sinüs burada uzanır' },
          { nokta: 'buyuk-kanat-beyin-yuzu-sol', metin: 'Orta kafa çukuru' },
          { nokta: 'horoz-ibigi', metin: 'Ön kafa çukuru (kalbur kemiği)' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Borden ve Cognard sınıflamaları',
      sutunlar: ['Sınıflama ve tip', 'Kan nereye akar?', 'Beyin yüzeyi toplardamarına geri akım'],
      satirlar: [
        ['Borden I', 'Doğrudan toplardamar sinüsüne', 'Yok'],
        ['Borden II', 'Sinüse; ayrıca geriye doğru subaraknoid (kortikal) toplardamarlara', 'Var'],
        ['Borden III', 'Doğrudan subaraknoid (kortikal) toplardamarlara', 'Var'],
        ['Cognard I', 'Sinüse, normal yönde', 'Yok'],
        ['Cognard IIa', 'Ana sinüse; ayrıca komşu bir sinüse ters yönde', 'Yok'],
        ['Cognard IIb', 'Sinüse normal yönde; ayrıca bir kortikal toplardamara ters yönde', 'Var'],
        ['Cognard IIa+b', 'Ana sinüse; hem komşu sinüse hem kortikal toplardamara ters yönde', 'Var'],
        ['Cognard III', 'Doğrudan kortikal toplardamarlara; toplardamarda genişleme (ektazi) yok', 'Var'],
        ['Cognard IV', 'Doğrudan kortikal toplardamarlara; toplardamar genişlemesiyle', 'Var'],
        ['Cognard V', 'Omuriliğin çevresindeki (perimedüller) toplardamarlara', 'Omurilik toplardamarlarına akım'],
      ],
      not: 'Geri akımı olmayan fistüller (Borden I, Cognard I ve IIa) iyi huylu sayılır; sonradan geri akım gelişme riski yalnızca %2’dir. Kalıcı geri akımı olan fistüller (Borden II–III, Cognard IIb–V) saldırgandır (Baharvahdat ve ark., 2020). Cognard’ın serisinde tip V fistüllerin %50’si ilerleyici omurilik hastalığı (miyelopati) yaptı (Akkoc ve ark., 2006).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Dural AVF:** atardamar → sert zar sinüsü ya da kortikal toplardamar; nidus yok; çoğu sonradan edinilir (travma, sinüs trombozu).
- **En sık yer:** enine–sigmoid sinüs birleşimi. **En saldırgan yer:** beyincik çadırı.
- **Davranışı belirleyen:** kortikal toplardamara geri akım. Borden I ve Cognard I–IIa iyi huylu; Borden II–III ve Cognard IIb–V saldırgan.
- **Cognard V:** omurilik çevresi toplardamarlarına akım → miyelopati.`,
    },

    // ——— Sert zar fistülü: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Fistülün doğal seyri',
      md: `- **Geri akım sürerse:** Bir seride kortikal geri akımı süren fistüller izlendi. Yıllık ölüm oranı %10,4’tü. Başvurudaki olaylar dışarıda bırakılınca, yıllık kanama riski %8,1, kanamasız nörolojik bozukluk riski %6,9’du (van Dijk ve ark., 2002).
- **Kanama:** Fistüllerin yaklaşık %20–33’ü kafa içi kanamayla başvurur. İlk kanamadan sonraki iki haftada yeniden kanama oranı %35’e kadar çıkabilir (Baharvahdat ve ark., 2020).
- **Belirtisiz fistül:** Japonya’da beyin taraması yaptıran 11.745 kişinin MR’ı incelendi. Belirtisiz dural AVF oranı %0,05’ti (6 kişi). Bunların 4’ünde kortikal geri akım vardı (Hirata ve ark., 2021).
- **Türkiye’den bir olgu:** Kafa içindeki bir fistül, kanını omuriliğin çevresindeki toplardamarlara boşaltıyordu. Olgu, omurilik hastalığının (miyelopatinin) nadir bir nedeni olarak bildirildi (Akkoc ve ark., 2006).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Fistül tedavisinde sert zarın sinirleri ve damarları',
      md: `- **Trigeminokardiyak refleks:** Üçüz sinir (trigeminal sinir) uyarılınca kalpte ve dolaşımda beliren bir reflekstir. Sert zarla oynamak ya da damar içinden tıkayıcı bir madde (Onyx ve çözücüsü DMSO) vermek bu refleksi tetikleyebilir. Refleks; kan basıncının düşmesi, kalp atımının yavaşlaması ya da durması ve solunumun durması gibi tepkilerle ortaya çıkabilir (Rai ve ark., 2018). Açık işlemlerin %8–18’inde, Onyx/DMSO ile damar içinden tedavi edilen fistüllerin %11,1’inde bildirildi (Ishikawa ve ark., 2026).
- **Çadırın beslenmesi:** Üst beyincik atardamarının çadır boyunca giden bir dalı vardır: iç sert zar-çadır atardamarı. Bu dal, çadır fistülü serilerinde tanımlandı. Damar görüntülemesinde (anjiyografi) tanınması önemlidir (Byrne ve Garcia, 2013).

Sert zarın sinirleri ve refleksin ayrıntısı “Sert zarın atardamarları, sinirleri ve ağrı” bölümünde.`,
    },

    // ——— Sert zarda kireçlenme: temel ———
    {
      tur: 'metin',
      md: `**Sert zarda kireçlenme.** Kafa içindeki kireçlenmeler bilgisayarlı tomografide (BT) doğru biçimde görülür (Yalcin ve ark., 2016). Kafa BT’lerinde sert zarda, özellikle beyin orağında, kireç birikimi sık görülür. Bir çalışma bunları fizyolojik, yani olağan kireçlenmeler olarak inceledi. İran’da 216 BT’nin %89,8’inde en az bir yerde fizyolojik kireçlenme vardı. Beyin orağında oran %26,8’di (Ghorbanlou ve ark., 2022).

Ama kafa içi kireçlenmeler birçok hastalıkla da ilişkilendirilmiştir (Yalcin ve ark., 2016). Türkiye’den bir çalışmada, BT’de olağan dışı (patolojik) kafa içi kireçlenmesi bulunan 83 çocuk incelendi. En sık nedenler tüberoskleroz adlı hastalık ve tümörlerdi. Yalnızca 2 çocukta (%2) neden bulunamadı (Erdem ve ark., 1994).`,
    },

    // ——— Sert zarda kireçlenme: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kafa içi kireçlenmeler: iki BT çalışması',
      sutunlar: ['Yer', 'Türkiye’den 11.941 kişi', 'İran’dan 216 BT'],
      satirlar: [
        ['Sert zar (bütünü)', '%12,5', '—'],
        ['Beyin orağı', '—', '%26,8'],
        ['Petroklinoid bağ', '—', '%13,2'],
        ['Beyincik çadırı', '—', '%6,8'],
        ['Epifiz bezi', '%71,6', '%75,0'],
        ['Koroid pleksus', '%70,2', 'Sağ yan karıncıkta %67,7; solda %62,7'],
        ['Habenula', '%19,2', '%36,4'],
        ['Bazal gangliyonlar', '%1,3', '%0,9'],
        ['En az bir yerde', '—', '%89,8'],
      ],
      not: 'Bazal gangliyonlar dışında bütün kireçlenme türlerinde erkekler öndeydi (Yalcin ve ark., 2016). İran çalışmasının verileri (Ghorbanlou ve ark., 2022). İki çalışmanın yöntemi farklı olduğu için sayıları birbirine doğrudan karşılaştırılmamalıdır.',
    },

    // ——— Türkiye’den çalışmalar: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Türkiye’den çalışmalar: bu bölümün özeti',
      sutunlar: ['Konu', 'Çalışma', 'Ana bulgu'],
      satirlar: [
        ['Çocuk menenjiti', 'Ceyhan ve ark., 2008 ve 2020', 'En sık etken meningokok; Hib aşısından sonra Hib payı %2,4’e indi'],
        [
          'Tüberküloz menenjiti',
          'Pehlivanoglu ve ark., 2012 (İstanbul); Güneş ve ark., 2015 (Diyarbakır)',
          'Yetişkinlerde 6. ayda %17 ölüm; çocuklarda BT’de hidrosefali %90,3',
        ],
        [
          'Kalın zar iltihabı',
          'Boban ve ark., 2018 (Türkiye’den bir yazarın katıldığı olgu)',
          'IgG4 ilişkili hastalığın ince zarları tutan biçimi',
        ],
        [
          'Menenjiyom',
          'Celtikci ve ark., 2018; Ekşi ve ark., 2019',
          'Kubbe yerleşimi nüks ve yüksek dereceyle ilişkili; yaşlılarda da ameliyat yararlı',
        ],
        [
          'Çadır menenjiyomu',
          'Mammadli ve ark., 2026 (İstanbul); Doğruel ve ark., 2026',
          'En sık Yaşargil tipleri T7 ve T2; çentiğin ortasından çıkan T2 tipinin ameliyatı zordur',
        ],
        ['Düşük basınç', 'Albayram ve ark., 2008', 'MR sisternografi kaçağı %89 oranında gösterdi'],
        [
          'Bel delme',
          'Bıçak ve ark., 2019; Salik ve ark., 2018; Kale ve ark., 2015',
          'İğne ucunun yönünün etkisi tutarsız; baş ağrısı subdural kanamayı gizleyebilir',
        ],
        [
          'Araknoid kist',
          'Bilginer ve ark., 2009; Bora ve ark., 2015; Adin ve ark., 2018 ve görüntüleme çalışmaları',
          'Travma sonrası kanama ve yırtılma; kist-sisterna bağlantısının MR ile gösterilmesi',
        ],
        ['Sert zar fistülü', 'Akkoc ve ark., 2006', 'Omurilik çevresi toplardamarlarına akan fistül miyelopati yaptı'],
        [
          'Kireçlenme',
          'Yalcin ve ark., 2016; Erdem ve ark., 1994',
          'Sert zar kireçlenmesi %12,5; patolojik kireçlenmesi olan 83 çocuğun yalnızca 2’sinde neden bulunamadı',
        ],
      ],
      not: 'Ayrıntılar bu bölümün ilgili kısımlarında. Şehir yalnızca çalışmanın metninde yazıyorsa verildi. Kaynaklar: (Ceyhan ve ark., 2008; Ceyhan ve ark., 2020; Pehlivanoglu ve ark., 2012; Güneş ve ark., 2015; Boban ve ark., 2018; Celtikci ve ark., 2018; Ekşi ve ark., 2019; Mammadli ve ark., 2026; Doğruel ve ark., 2026; Albayram ve ark., 2008; Bıçak ve ark., 2019; Salik ve ark., 2018; Kale ve ark., 2015; Bilginer ve ark., 2009; Bora ve ark., 2015; Adin ve ark., 2018; Akkoc ve ark., 2006; Yalcin ve ark., 2016; Erdem ve ark., 1994).',
    },

    // ——— Kapanış: temel ———
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      baslik: 'Bu bölümün özeti',
      md: `- **Menenjit:** zarların iltihabı; bakteriler ince zarlarda ve BOS’ta yayılır. Bakteriyel olan acildir; işaretler yoksa bile menenjit olabilir.
- **Kalın zar iltihabı:** sert zarın iltihapla kalınlaşması; tanı çoğu zaman biyopsiyle konur.
- **Menenjiyom:** örümcek ağı zarın örtü hücrelerinden doğar, sert zara tutunur; çoğu iyi huyludur.
- **Kafa içi düşük basınç:** BOS kaçağı; ayakta artan, uzanınca geçen baş ağrısı. Kendiliğinden olan biçimde ilk basamak kan yamasıdır.
- **Araknoid kist:** BOS dolu, tümör olmayan kese; en sık orta kafa çukurunda; çoğu belirti vermez.
- **Sert zar fistülü:** atardamarla toplardamarın sert zarda kısa devresi; beyin yüzeyi toplardamarına geri akım tehlikelidir.
- **Kireçlenme:** sert zarda, özellikle beyin orağında sık görülür ve çoğu olağan (fizyolojik) sayılır. Ama birçok hastalıkla da ilişkilendirilmiştir.`,
    },
  ],
};
