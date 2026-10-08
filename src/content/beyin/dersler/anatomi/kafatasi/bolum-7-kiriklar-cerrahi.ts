import type { DersBolumu } from '../../../types';

/** 7. bölüm: kafatası kırıkları, görüntüleme ve karar kuralları, kafatasının açılıp kapatılması ve cerrahi yaklaşımlar. */
export const kiriklarVeCerrahi: DersBolumu = {
  id: 'kiriklar-ve-cerrahi',
  baslik: 'Kırıklar, görüntüleme ve kafatası cerrahisi',
  bloklar: [
    {
      tur: 'metin',
      md: `Kafatası güçlüdür ama kırılmaz değildir. Beyin kutusuna gelen güçlü darbeler kırıklara, kırıklar da kafatası içinde kanamaya ve beyin hasarına yol açabilir. En sık görülen **doğrusal kırıkta** kırık çizgileri darbe noktasından dışa doğru yayılır. **Parçalı kırıkta** kemik darbe noktasında birkaç parçaya ayrılır; **çökme kırığında** kırılan kemik içeri doğru itilir. **Karşı darbe** (kontrkup) kırığında ise darbenin geldiği yer kırılmaz, kafatasının karşı tarafında kırık oluşur: kafa tabanındaki art kafa kemiği bu yolla kırılabilir; böyle bir kafa tabanı kırığı karotis kanalından geçen atardamarı yaralayabilir (OpenStax 7.2).

Kırıklar açık ya da kapalı, basit ya da bileşik, doğrusal, çökme ya da **diyastatik** (dikişi ayıran) olarak da sınıflanır (Angkurawaranon ve ark., 2026). Kafatası tabanını tutan kırıklara **kafa tabanı kırığı** denir; en çok şakak kemiğini tutarlar ama art kafa, kama ve kalbur kemiklerini ve alın kemiğinin göz çukuru tavanını da tutabilirler (Simon ve Newton, 2023).

Çocuğun kafatası daha ince ve esnektir, beyni daha az korur; bebekte başın vücut yüzeyine oranı da büyüktür (yetişkinde %9’a karşı %18). Çocuk kafa travmalarının %10–30’unda kafatası kırığı olur ve kırık, beyin içi yaralanma riskini artırır (Krishnaprasadh ve Karsonovich, 2025). Yine de yalnızca kafatası kırığı olan 7228 çocuğu kapsayan bir meta-analizde acil beyin ameliyatı gereken çocuk neredeyse yoktu ve hiçbir çocuk ölmedi (Palavani ve ark., 2023).`,
    },
    {
      tur: 'animasyon',
      ad: 'kafatasi-kiriklari',
      baslik: 'Kafatası kırıklarının türleri',
      aciklama:
        'Doğrusal, çökme ve diyastatik kırıklar, kafa tabanı kırığının dışarıdan görülen işaretleri ve bebeğe özgü “ping-pong” çökmesi.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Hangi işaretlerde hemen acile?',
      md: 'Başını çarpan birinde **kulaktan ya da burundan berrak sıvı gelmesi**, gözün kendisi yaralanmadan **göz çevresinin morarması**, **kulaktan kanama** ya da **kulak arkasında morluk** kafa tabanı, açık ya da çökme kırığının işaretleri olabilir (NICE, 2023). Karmaşık bir kafatası kırığından ya da delici bir yaralanmadan şüphelenilen, bilinci tam açık olmayan, travmadan sonra nöbet geçiren ya da kolunda, bacağında, konuşmasında yeni bir sorun başlayan kişi ambulansla acil servise götürülmelidir (NICE, 2023).',
    },
    {
      tur: 'metin',
      md: `**Beyin ameliyatında kafatası nasıl açılır?** Kafatasının bir parçası beyne ulaşmak için geçici olarak çıkarılırsa işlemin adı **kraniotomidir**. Bugün kraniotomi, önce açılan birkaç küçük deliğin (burr deliği) birleştirilmesiyle yapılır; bu teknik 19. yüzyılın sonunda Wilhelm Wagner’in tanıttığı yönteme dayanır. Kemik kapağı aynı ameliyatta yerine konmazsa işlemin adı **kraniektomidir**; kemiğin ikinci bir ameliyatla yerine konmasına ya da yapay bir malzemeyle onarılmasına **kranioplasti** denir. Çıkarılan kemik dondurularak ya da karın derisinin altında saklanabilir (Munakomi ve Hall, 2026).`,
    },
    {
      tur: 'animasyon',
      ad: 'kraniotomi',
      baslik: 'Kafatası nasıl açılır, nasıl kapanır?',
      aciklama:
        'Burr deliklerinden kemik kapağına, kraniotomiden dekompresif kraniektomiye, menteşeli kraniotomiden kranioplastiye adım adım.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'İnsanlar kafatasını binlerce yıldır delmektedir: bu işleme **trepanasyon** denir. Dünyada en çok tarihöncesi trepanlı kafatası Peru’da bulunmuştur; 800’den fazla kafatasının incelenmesine göre uzun dönem sağkalım MÖ 400–200’de %40 dolayındayken MS 1000–1400’de %91’e çıkmıştır. Karşılaştırma için: Amerikan İç Savaşı’nda kafatası ameliyatlarında ortalama ölüm oranı %46–56’ydı. Başarılı eski ameliyatlar büyük olasılıkla sert zarı delmeyen yüzeysel işlemlerdi (Kushner ve ark., 2018). Orta Çağ’da cerrah Zehrâvî (Albucasis, 936–1013) ameliyat aletlerini ve tekniklerini kitabında anlatmış (Natera-Rodriguez ve ark., 2026), kemikleri yumuşak bebek başlarında görülen göçük kırıkları da tarif etmiştir (Minghinelli ve ark., 2023).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Kırık türleri:** doğrusal (en sık), parçalı, çökme, karşı darbe, diyastatik; tabanda kafa tabanı kırığı.\n\n**Kafa tabanı kırığının işaretleri:** göz çevresinde morluk, kulak arkasında morluk, kulaktan kanama, burundan ya da kulaktan berrak sıvı.\n\n**Kraniotomi:** kemik kapağı yerine konur. **Kraniektomi:** konmaz. **Kranioplasti:** kafatası sonradan onarılır.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kafa tabanı kırığının işaretleri',
      sutunlar: ['İşaret', 'Nedir?', 'Bilinmesi gerekenler'],
      satirlar: [
        [
          'Rakun (panda) gözü',
          'Göz çevresinde morluk',
          'Hemen çıkmaz, genellikle 1–3 gün gecikir. Kan, orbital septumun tarsal plağa tutunması nedeniyle göz çevresinde sınırlı kalır. Bir derlemeye göre kafa tabanı kırığı olanların %50–60’ında görülür; başka serilerde %9,5 ile %64 arasında bildirilmiştir (koyu tende morluğu görmek zorlaşabilir). İki taraflıysa ön kafa tabanı kırığını güçlü biçimde düşündürür.',
        ],
        [
          'Battle belirtisi',
          'Mastoid çıkıntı üzerinde, kulak arkasında morluk',
          'İngiliz cerrah William Henry Battle, kafa tabanının arka kısmı kırık 17 hastada tanımladı.',
        ],
        [
          'Kulak zarı arkasında kan (hemotimpanum)',
          'Otoskopla görülür',
          '141 olguluk bir seride incelenen 128 şakak kemiği kırığı hastasının %78’inde vardı; yalnızca izlemle 3–4 haftada kendiliğinden kayboldu.',
        ],
        [
          'Burundan ya da kulaktan BOS',
          'Berrak, sulu akıntı',
          'Erişkinde kafa tabanı kırıklarının %2–25’inde görülür. Kulak zarı sağlamsa kulaktan gelen sıvı östaki borusundan buruna akabilir.',
        ],
        [
          'Kafa siniri felci',
          'Koku (I), göz hareketleri (III, IV, VI), yüz (VII)',
          'Bir Hint serisinde %15,8; en sık yüz siniri tutulmuştu, oysa literatürde en sık koku sinirinin etkilendiği bildirilir. Koku kaybı plaktan geçen liflerin kopmasıyla ya da koku soğancığının ezilmesiyle olur.',
        ],
      ],
      not: 'Kaynaklar: Das ve Munakomi (2023); Becker ve ark. (2026); Ricciardiello ve ark. (2021); Alhathlol ve ark. (2026); Jain ve ark. (2024); Proskynitopoulos ve ark. (2016); Gomez ve Pickup (2023); Sivanandapanicker ve ark. (2018). Belirtiler genellikle ilk 48 saatte çıkar; varlıkları kırığı her zaman kanıtlamaz, yoklukları da dışlamaz. Altın standart yüksek çözünürlüklü BT’dir (Sivanandapanicker ve ark., 2018).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Burundan gelen su: travmatik BOS sızıntısı',
      md: `**Ne zaman?** Çocuk kafa travmalarının %2’sinde, kafa tabanı kırıklarının %12–30’unda BOS sızıntısı olur; sızıntı olguların %55’inde ilk 48 saatte, %70’inde ilk haftada başlar, ama %10–20’si yıllar sonra ortaya çıkabilir (Choi ve Kim, 2022). Suudi Arabistan’da 499 kafa tabanı kırığının %7,2’sinde sızıntı gelişti; sızıntı olanlarda menenjit (%11,1’e karşı %0,9), kafa siniri hasarı ve iç karotis arter yaralanması daha sıktı (Alhathlol ve ark., 2026). Tedavi edilmeyen burun sızıntılarının yaklaşık %24’ünde menenjit gelişir (Choi ve Kim, 2022).

**Sıvının BOS olduğu nasıl doğrulanır?** Glukoz test şeritleri yaygın ama duyarlılığı ve özgüllüğü düşüktür (Choi ve Kim, 2022). Laboratuvarda altın standart **beta-2 transferrindir**: yalnızca BOS’ta, iç kulak sıvısında (perilenf) ve göz içi sıvılarında bulunur; duyarlılığı %87–100, özgüllüğü %71–94’tür ve yaklaşık yarım mililitre sıvı ister. **Beta-iz proteini** BOS’ta plazmadakinin 34–35 katıdır ve burun salgısında yoktur (Torabi ve ark., 2024).

**Yeri nasıl bulunur?** Yüksek çözünürlüklü BT 1–2 mm’lik kesitler kullanır (Choi ve Kim, 2022). Beta-2 transferrinle doğrulanmış sızıntılarda BT sızıntı yerini %70 duyarlılıkla gösterir ama sert zardaki deliği göremez. Gerekirse BT sisternografi ya da omurilik kanalına kontrast verilerek MR sisternografi yapılır; bu yöntemler o anda aktif bir sızıntı ister (Torabi ve ark., 2024).

**Tedavi:** önce tutucudur: baş 20–30° yükseltilir, yatak istirahati ve ıkınmayı önleyen ilaçlar verilir, burun sümkürmekten kaçınılır; seçilmiş hastalarda bel bölgesinden BOS boşaltan bir dren konur. Sızıntıların çoğu bir hafta içinde kendiliğinden durur (Ricciardiello ve ark., 2021); 7–10 günden uzun sürenlerde menenjit riski yüksektir ve ameliyat gerekebilir (Sivanandapanicker ve ark., 2018). Kafa tabanı kırığından şüphelenilen hastaya burundan tüp ya da sonda geçirilmemesi vurgulanır (Jain ve ark., 2024).

**Koruyucu antibiyotik tartışması:** 208 katılımcılı beş randomize çalışmayı birleştiren Cochrane derlemesi, BOS sızıntısı olsun olmasın kafa tabanı kırığında koruyucu antibiyotiği desteklemedi; 2168 hastalık randomize olmayan çalışmalar da aynı sonucu verdi. Bir çalışmada antibiyotik, burun-yutak florasını dirençli ve daha hastalık yapıcı bakterilere kaydırdı; ama çalışmalar yanlılık içerdiği için büyük, iyi tasarlanmış çalışmalara ihtiyaç vardır (Ratilal ve ark., 2015). Uygulama merkezden merkeze değişir: bir İtalyan merkezi sızıntısı olan bütün hastalara iki hafta antibiyotik vermiştir (Ricciardiello ve ark., 2021).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kimlere kafa BT’si? NICE 2023 ölçütlerinden seçmeler',
      sutunlar: ['Kim?', 'Ne zaman?', 'Ölçütler'],
      satirlar: [
        [
          '16 yaş ve üstü',
          'Ölçüt saptandıktan sonra 1 saat içinde',
          'Acilde ilk değerlendirmede GKS ≤ 12; travmadan 2 saat sonra GKS < 15; açık ya da çökme kırık şüphesi; kafa tabanı kırığı işareti (hemotimpanum, panda gözü, kulak ya da burundan BOS, Battle belirtisi); travma sonrası nöbet; odak nörolojik bulgu; birden fazla kusma',
        ],
        [
          '16 yaş ve üstü, bilinç kaybı ya da bellek kaybı olan',
          'Travmadan sonra 8 saat içinde',
          '65 yaş ve üstü; kanama ya da pıhtılaşma bozukluğu; tehlikeli mekanizma (araç çarpan yaya ya da bisikletli, araçtan fırlama, 1 m ya da 5 basamaktan yüksekten düşme); travmadan hemen önceki olaylar için 30 dakikadan uzun bellek kaybı',
        ],
        [
          '16 yaş altı',
          'Ölçüt saptandıktan sonra 1 saat içinde',
          'Kaza dışı yaralanma şüphesi; travma sonrası nöbet; acilde GKS < 14 (1 yaş altında çocuk GKS’si < 15); 2 saatte GKS < 15; açık ya da çökme kırık şüphesi ya da gergin bıngıldak; kafa tabanı kırığı işareti; odak bulgu; 1 yaş altında başta 5 cm’den büyük morluk, şişlik ya da kesi',
        ],
        [
          '16 yaş altı',
          'Birden fazla ölçüt varsa 1 saat içinde; yalnızca biri varsa en az 4 saat gözlem',
          'Tanıklı 5 dakikadan uzun bilinç kaybı; anormal uykululuk; 3 ya da daha fazla kusma; tehlikeli mekanizma; 5 dakikadan uzun bellek kaybı; kanama ya da pıhtılaşma bozukluğu',
        ],
      ],
      not: 'Kaynak: NICE (2023), NG232 öneri 1.5.8–1.5.12. NICE, önemli beyin yaralanmasını tanımak için düz kafa grafisinin kullanılmamasını ve MR’ın ilk tetkik olmamasını önerir. Kan sulandırıcı ya da antiagregan kullananlar için ayrı bir öneri vardır.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kanada BT Kafa Kuralı ve PECARN: gereksiz BT’den kaçınmak',
      md: `**Kanada BT Kafa Kuralı** hafif kafa travmasıyla (GKS 13–15) başvuran erişkinlerde geliştirildi. Beş yüksek risk etkeni (2 saat içinde GKS 15’e ulaşamama, açık kafatası kırığı şüphesi, herhangi bir kafa tabanı kırığı işareti, tekrarlayan kusma ve ileri yaş) beyin cerrahisi gerektiren hastaları %100 duyarlılıkla yakaladı ve hastaların yalnızca %32’sine BT çekilmesini gerektirdi. Darbeden önceki olaylar için 30 dakikadan uzun bellek kaybı ve tehlikeli mekanizma iki orta risk etkenidir (Stiell ve ark., 2001).

Çocukta BT’nin radyasyonu kanser riski taşıdığı için **PECARN** çalışması, BT’den güvenle kaçınılabilecek çok düşük riskli çocukları belirlemeyi amaçladı. 42.412 çocuğun %0,9’unda klinik açıdan önemli beyin yaralanması bulundu, %0,1’i beyin ameliyatı geçirdi. İki yaşından küçükler için kural: bilinç normal, alın dışında kafa derisinde hematom yok, bilinç kaybı yok ya da 5 saniyeden kısa, mekanizma ağır değil, ele gelen kırık yok ve ailesine göre davranışı normal. İki yaş ve üstü için: bilinç normal, bilinç kaybı yok, kusma yok, mekanizma ağır değil, kafa tabanı kırığı işareti yok ve şiddetli baş ağrısı yok. Doğrulama gruplarında iki kural da ameliyat gereken hiçbir çocuğu kaçırmadı (Kuppermann ve ark., 2009).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Kırığı BT’de okumak: pencereler ve üç boyut',
      md: `Kafa travmasında başlıca tanı aracı BT’dir: sert kemiği çok iyi gösterir ve çekimi kısa sürer (Angkurawaranon ve ark., 2026). Aynı görüntü farklı “pencerelerle” okunur: sık kullanılan değerlerle **beyin penceresi** seviye 40 / genişlik 80 HU, **subdural pencere** 80 / 200 HU, **kemik penceresi** 600 / 2800 HU’dur (Wang ve ark., 2021; Hibi ve ark., 2023). Kemik penceresi ayarı cihaza ve kuruma göre değişir; 500 / 1600 ve 480 / 2500 HU gibi değerler de kullanılır (Angkurawaranon ve ark., 2026; Lu ve ark., 2025). Kemik penceresinde görülen bir kırık, beyin penceresinde aranması gereken bir kanamaya işaret edebilir (Wang ve ark., 2021).

Çocuklarda **üç boyutlu BT** kırıkları düz grafiden daha iyi gösterir; özellikle çökme ve diyastatik kırıklarda. Ama radyasyon dozu düz grafinin yüzlerce katıdır (Kim ve ark., 2012). Şakak kemiği travmasında altın standart yüksek çözünürlüklü BT’dir ve çok düzlemli, özellikle Stenvers tipi yeniden yapılandırmalar vazgeçilmezdir (Edris ve ark., 2026). İsviçre’de yapılan bir çalışmada nöbetçi asistanlar şakak kemiği kırıklarını %92,8 duyarlılıkla yakalarken kulak kemikçiklerinin çıkığını yalnızca %27,3 oranında fark etti (Kohler ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Bebek ve çocukta iki özel kırık',
      md: `**“Ping-pong” kırığı**, kafatasının iç ve dış tablası kopmadan oluşan bir çökme kırığıdır; kemiğin henüz tam mineralleşmemesinden kaynaklanır (Minghinelli ve ark., 2023). Yenidoğanda 10.000 doğumda 1–2,5 sıklıkta bildirilir; Ürdün’de bir hastanede 10.000 canlı doğumda 3,0 bulundu ve 13 olgudan yalnızca 3’ü cerrahi kaldırma gerektirdi. Çökme 2 cm’den derinse ya da beyne bası varsa kaldırma düşünülür; tedavi edilmeyenlerin çoğu 6 ay içinde kendiliğinden düzelir (Qudsieh ve ark., 2024). Bebeklik dışında görülen bir ping-pong kırığında altta yatan bir kemik hastalığı araştırılmalıdır (Minghinelli ve ark., 2023).

**Büyüyen kafatası kırığı** (leptomeningeal kist), iki tablayı da kesen diyastatik bir kırıkla altındaki sert zarın yırtılmasıdır. “Kist” adı yanıltıcıdır: lezyon gerçek bir kist değil, beyin dokusu, BOS ve zarlardan oluşan bir tür ensefaloseldir. İlk tanımı 1816’da Howship yaptı; kırık kenarlarının 4 mm’den fazla ayrışması riski artırır (Karsonovich ve ark., 2026). Sıklığı %0,05–1,6’dır ve %90’dan fazlası 3 yaşın altında görülür; en sık yan kafa kemiğindedir. Tipik bulgu, çocuk ağlayınca büyüyen, nabız atan bir kafa derisi şişliğidir. Tedavide sert zar su geçirmeyecek biçimde onarılır ve kranioplasti yapılır. Bebekte basit bir kırık bile görülse aileye bu olasılık anlatılmalı ve çocuk 3 ay muayene ve görüntülemeyle izlenmelidir (Choi ve Kim, 2022).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 4: Öne eğilince burnundan su damlayan motosikletli',
      oyku: `24 yaşında bir motosiklet sürücüsü kaskın siperliği kırılarak yüzüstü düşüyor. Acilde bilinci açık, GKS 15. Ertesi gün iki gözünün çevresinde de morluk beliriyor; göz kürelerinde yaralanma yok. Öne eğildiğinde sağ burun deliğinden berrak, sulu bir sıvının damladığını fark ediyor. Kokuları alamadığını söylüyor.`,
      soru: 'Kırık büyük olasılıkla nerededir, sıvının BOS olduğu nasıl doğrulanır ve ilk yaklaşım ne olmalıdır?',
      cozum: `**Yer:** İki taraflı göz çevresi morluğu ön kafa tabanı kırığını güçlü biçimde düşündürür (Das ve Munakomi, 2023). Burundan berrak akıntı ve koku kaybı birlikte **kribriform plağı** gösterir: plak kafatası tabanının en ince yeridir, üstündeki sert zar ince ve kemiğe sıkı yapışıktır, bu yüzden kırık zarı da yırtar (Gomez ve Pickup, 2023). Koku kaybı, plaktan geçen koku liflerinin kopmasıyla açıklanır (Proskynitopoulos ve ark., 2016). Kafa tabanı kırığı işaretleri NICE’a göre bir saat içinde BT çekilmesini gerektirir (NICE, 2023).

**Doğrulama:** Glukoz şeridine güvenilmez. Altın standart sıvıda **beta-2 transferrin** aranmasıdır; beta-iz proteini de kullanılır. Sızıntının yeri ince kesitli BT ile aranır; BT yeri gösteremezse sisternografi yöntemleri vardır (Choi ve Kim, 2022; Torabi ve ark., 2024).

**Yaklaşım:** Burundan tüp ya da sonda geçirilmez (Jain ve ark., 2024). Önce tutucu tedavi: başın 20–30° yükseltilmesi, istirahat, ıkınmama, burun sümkürmeme; sızıntıların çoğu bir haftada durur (Ricciardiello ve ark., 2021). 7–10 günü aşan sızıntıda menenjit riski yüksektir ve onarım gerekebilir (Sivanandapanicker ve ark., 2018). Koruyucu antibiyotiği randomize kanıt desteklemez, ama uygulama merkezden merkeze değişir (Ratilal ve ark., 2015). Hasta menenjit yönünden yakından izlenmelidir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka 5: Beşinci gün kayan yüz',
      oyku: `41 yaşında bir adam merdivenden düşüp başının sol yanını çarpıyor. Sol kulağından kan geliyor; otoskopide sol kulak zarının arkasında kan var ve sol kulağıyla daha az duyuyor. Başvuruda yüz kasları simetrik. Beşinci gün sol gözünü tam kapatamadığını ve gülerken ağzının sağa kaydığını fark ediyor; sol alnını da kırıştıramıyor. Yüksek çözünürlüklü BT’de sol şakak kemiğinde, kayalık kısmın uzun eksenine paralel bir kırık görülüyor; iç kulak kapsülü sağlam.`,
      soru: 'Kırık nasıl sınıflanır, yüz siniri neden etkilenmiştir ve felcin günler sonra başlaması ne anlama gelir?',
      cozum: `**Sınıflama:** Şakak kemiği, kaynağa göre kafatası kırıklarının %3–22’sinde ya da %14–22’sinde tutulur (Edris ve ark., 2026; Ricciardiello ve ark., 2021). Klasik sınıflamada kırık hattı kayalık piramidin uzun eksenine paralelse **uzunlamasına**, dikse **enine** kırık denir. Uzunlamasına kırıklar çoğunlukla yandan gelen darbeyle oluşur ve iç kulak kapsülünü korur; enine kırıklar önden-arkadan gelen yüksek enerjili kuvvetle oluşur, iç kulak yolunu ve labirenti keser. Günümüzde iç kulak kapsülünü **koruyan** ya da **kıran** kırık ayrımı işitme, yüz siniri ve BOS sızıntısı sonucunu daha iyi öngörür (Edris ve ark., 2026). Kırıkların yaklaşık %95’i kapsülü korur (Ricciardiello ve ark., 2021).

**Yüz siniri:** Sinir şakak kemiğinin içindeki yüz siniri kanalında ilerler ve stilomastoid delikten çıkar (Dulak ve Naqvi, 2023); kayalık kısım bu kanalı, iç kulak kapsülünü ve iç karotis arterin bir kesimini içinde taşır (Edris ve ark., 2026). Alnın da tutulması sorunun beyinde değil sinirin kendisinde olduğuna uyar (birinci dersteki 5. vakayla karşılaştır). Yüz felci kapsülü kıran kırıklarda %30–50, koruyanlarda %6–13 oranında görülür (Ricciardiello ve ark., 2021).

**Gecikmeli başlangıç iyi bir işarettir:** Hemen başlayan felç kendiliğinden daha az düzelir; aynı seride gecikmeli başlayan felçlerin hepsi 3–6 ayda tamamen düzeldi (Ricciardiello ve ark., 2021). Çocuk serilerinde de taburculuktan sonra başlayan felçlerin çoğu üç ayda düzelmiştir (Jung ve ark., 2024). Kulak zarı arkasındaki kan yalnızca izlemle 3–4 haftada kaybolur (Ricciardiello ve ark., 2021). BT’de kulak kemikçiklerinin yerinden çıkıp çıkmadığına da özellikle bakılmalıdır; bu bulgu kolayca gözden kaçar (Kohler ve ark., 2024). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Çökme kırığında ve epidural kanamada ne zaman ameliyat?',
      md: `**Çökme kırığı (Brain Trauma Foundation):** Çökmesi kemik kalınlığından derin olan açık (bileşik) kırıklar enfeksiyonu önlemek için ameliyat edilmelidir. Sert zarın delindiğine dair klinik ya da görüntüleme kanıtı, önemli bir kafa içi hematom, 1 cm’den derin çökme, frontal sinüs tutulumu, belirgin şekil bozukluğu, yara enfeksiyonu, kafa içinde hava ya da ağır yara kirlenmesi yoksa açık çökme kırığı ameliyatsız izlenebilir. Kapalı çökme kırıklarında ameliyatsız tedavi bir seçenektir. Enfeksiyonu azaltmak için erken ameliyat önerilir; önerilen yöntem çöken kemiğin kaldırılması ve yaranın temizlenmesidir; ameliyat sırasında yara enfeksiyonu yoksa kemik parçası yerine konabilir. Açık çökme kırıklarında her planda antibiyotik bulunmalıdır (Bullock ve ark., 2006).

**Epidural hematom:** Kılavuzlar, hacmi 30 mL’yi aşan epidural hematomlarda Glasgow Koma Skalası değerinden bağımsız olarak kraniotomiyle boşaltmayı önerir (Hutchinson ve ark., 2019). Ameliyatta foramen spinosumdan gelen kanama, deliğe kemik mumu doldurularak durdurulabilir (Bisen ve ark., 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Pterional yaklaşım ve anahtar deliği kraniotomileri',
      md: `İlk frontotemporal kraniotomiyi 1914’te Heuer geliştirdi; “pterional kraniotomi” terimini 1950’lerde Hamby kullandı (Candy ve ark., 2024). 1970’lerde Yaşargil yaklaşımı mikroskop ve mikrocerrahiyle olgunlaştırıp yaygınlaştırdı (Candy ve ark., 2024); **pterional** (frontotemporosfenoidal) yaklaşım bugün beyin cerrahisinde en çok kullanılan yaklaşımdır (Luzzi ve ark., 2022). Yaklaşımın kilit noktası, ön ve orta kafa tabanının tamamına ulaşmak için kama kemiğinin büyük kanadının en dış kısmının tıraşlanmasıdır; kanat ne kadar çok tıraşlanırsa beyni ekartörle (spatula) itmeye o kadar az gerek kalır (Luzzi ve ark., 2022).

**Adım adım (Luzzi ve ark., 2022):** Baş Mayfield-Kees ya da Sugita kafa tutucusuna sabitlenir ve toplardamar dönüşü için kalp düzeyinin üstüne kaldırılır; Yaşargil’in 1976 tarifinde baş yaklaşık 20° geriye uzatılır ve elmacık çıkıntısı başın en yüksek noktası olur. Deri kesisi tragusun 1 cm önünden başlar. Yüz sinirinin alın dalını korumak için, sinirin içinde seyrettiği şakak fasyasının yüzeyel yaprağı ve yağ yastığı derin yapraktan ayrılır (fasyalar arası teknik). **MacCarty anahtar deliği** frontozigomatik, sfenozigomatik ve frontosfenoidal dikişlerin birleşim yerinin 5 mm arkasına açılır ve ince göz çukuru tavanıyla ayrılan ön çukur sert zarını ve göz çukuru zarını birlikte gösterir. Çoğu olguda iki burr deliği yeterlidir; kemik kapağı düşük profilli titanyum plaklar, delik kapakları ve 4–5 mm’lik vidalarla tespit edilir. Dezavantajları şakak kasının erimesi, yüz asimetrisi, çene ekleminde sorun ve çiğneme ağrısıdır (Candy ve ark., 2024).

**Supraorbital mi, pterional mi?** Daha küçük “anahtar deliği” anevrizma yaklaşımları 1970’lerin sonunda ortaya çıktı; supraorbital yaklaşımı Perneczky ve arkadaşları 1998’de tanıttı. Yırtılmamış anevrizmalarda iki yaklaşımı karşılaştıran bir seride supraorbital yaklaşımdan sonra koku azalması ya da kaybı (%8,5’e karşı %1,8), pterional yaklaşımdan sonra şakak kası erimesi (%11,9’a karşı %1,8) ve çiğneme güçlüğü (%19,5’e karşı %1,8) daha sıktı; ama ağır ameliyat içi komplikasyonlar, anevrizma yırtılması dahil, supraorbital grupta daha sıktı (%26,8’e karşı %8,8) (Brunner ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Arka çukura yandan: asterion ve retrosigmoid yaklaşım',
      md: `Retrosigmoid yaklaşımın atası olan serebellopontin açı yaklaşımını 1903’te Fedor Krause tanımladı. **Asterion**, art kafa, şakak ve yan kafa kemiklerinin buluştuğu, lambdoid, oksipitomastoid ve parietomastoid dikişlerin kavşağıdır; genellikle transvers sinüsün dış kısmı hemen altındadır ve transvers-sigmoid bileşkesi yaklaşık 1 cm öndedir. Ama asterionun bileşkeye göre yeri değişkendir: olguların %63’ünde transvers sinüsün dış yarısının üzerinde (yüzeyinde), yalnızca %1’inde tam bileşkenin üzerinde, %22’sinde bileşkenin aşağısında, %14’ünde yukarısındadır. Elmacık–inion çizgisiyle mastoid ucu–asterion çizgisinin kesişimi bileşkeyi tahmin ettirir. Mastoid emisser ven, kanamayı ve hava embolisini önlemek için yakılır ya da kemik mumuyla kapatılır; 60 yaş üstünde sert zar kemiğe daha yapışık olduğundan daha fazla burr deliği ya da kraniektomi gerekir (Rodriguez Rubio ve ark., 2021).

Retrosigmoid kraniotominin ilk deliği (anahtar deliği) sigmoid sinüsün üst kıvrımının arkasına, transvers sinüsün altına açılır; üç boyutlu BT çalışmasında hedef noktaların %93,29’u 7 mm yarıçaplı bir daire içinde toplandı (Hu ve ark., 2023). Kadavra çalışmasına göre asterion gibi klasik işaretler bileşkeyi yeterli kesinlikte göstermez; mastoid çentiğinin tepesi (digastrik nokta) kraniotominin dış sınırıdır. Arka çukurda nöronavigasyon daha az güvenilir olduğundan anatomik işaretler hâlâ önemlidir; transvers sinüs yaralanması toplardamar sinüsü yaralanmalarının ikinci en sık türüdür (%18–24) (Jurgaitis ve ark., 2024). En büyük mastoid deliğin asteriona uzaklığı ortalama 18,1 mm’dir (Uğuz Gençer ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Dekompresif kraniektomi: büyük randomize çalışmalar',
      sutunlar: ['Çalışma', 'Hastalar', 'Karşılaştırma', 'Başlıca sonuçlar'],
      satirlar: [
        [
          'DECRA (2011; 12. ay sonuçları 2020)',
          '155 erişkin; yaygın ağır beyin yaralanması, birinci basamak tedaviye dirençli kafa içi basınç artışı (1 saatte 15 dakikadan uzun > 20 mmHg)',
          'Erken iki taraflı frontotemporoparietal kraniektomi ya da standart tedavi',
          '6. ayda ölüm benzer (%19 ve %18); kraniektomide kötü sonuç riski yüksek (OR 2,21), ama başlangıçtaki pupil farkı düzeltilince fark kalmadı. 12. ayda kötü sonuç %59’a karşı %48 (anlamlı değil); kraniektomi bitkisel durumda yaşayanları artırdı.',
        ],
        [
          'RESCUEicp (2016)',
          '408 hasta, 10–65 yaş; dirençli kafa içi basınç artışı (> 25 mmHg)',
          'Son basamak kraniektomi ya da tıbbi tedaviye devam',
          '6. ayda ölüm %26,9’a karşı %48,9; bitkisel durum %8,5’e karşı %2,1. 12. ayda ölüm %30,4’e karşı %52,0; önceden belirlenmiş analizde iyi sonuç (üst düzey ağır engellilik ya da daha iyisi) %45,4’e karşı %32,4. Yan etkiler cerrahi grupta daha sık (%16,3’e karşı %9,2).',
        ],
        [
          'RESCUE-ASDH (2023)',
          'Akut subdural hematomu boşaltılan travma hastaları',
          'Kraniotomi (kemik yerine konur) ya da kraniektomi; kemik kapağının ön-arka çapı ≥ 11 cm (ortanca 13 cm)',
          '12. ayda ölüm %30,2’ye karşı %32,2; engellilik ve yaşam kalitesi benzer. 2 hafta içinde ek ameliyat kraniotomide daha sık (%14,6’ya karşı %6,9); yara sorunları kraniektomide daha sık (%3,9’a karşı %12,2).',
        ],
        [
          'Jiang ve ark. (uzlaşı metninde aktarılan)',
          'Ağır kafa travması',
          '12 × 15 cm standart kraniektomi ya da 8 × 6 cm sınırlı kraniektomi',
          'Ölüm büyük kraniektomide daha düşük (%26,2’ye karşı %35,1).',
        ],
      ],
      not: 'Kaynaklar: Cooper ve ark. (2011, 2020); Hutchinson ve ark. (2016, 2019, 2023). RESCUEicp’nin 6. ay ölüm oranı uzlaşı metninde %49,9 olarak aktarılır; burada birincil yayındaki %48,9 kullanıldı.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kraniektomiden kranioplastiye',
      md: `**Dekompresif kraniektomi**, kafatasının bir bölümünün çıkarılıp altındaki sert zarın açılmasıdır; bir asırdan uzun süre önce Theodor Kocher tarafından tarif edilmiştir. Kafa içindeki bir kitle boşaltıldıktan sonra kemik kapağının yerine konmamasına **birincil**, öteki tedavilere dirençli kafa içi basınç artışında son basamak hayat kurtarıcı tedavi olarak yapılanına **ikincil** kraniektomi denir. Üç ana yöntem vardır: iki taraflı frontal, tek taraflı frontotemporoparietal (hemikraniektomi) ve iki taraflı hemikraniektomi (Hutchinson ve ark., 2019). İki taraflı frontal kraniektomide kemik kapağı önde ön çukur tabanından arkada koronal dikişe ve iki yanda orta çukur tabanına uzanır; Tek taraflı frontotemporoparietal kraniektomide 2020 Brain Trauma Foundation önerisi en az 12 × 15 cm ya da 15 cm çaplı geniş bir kemik kapağıdır (Solomou ve ark., 2024). Uluslararası uzlaşıya göre kemik kapağı büyük olmalı ve orta kafa çukuru tabanına kadar kemik alınmalı; sert zar açılmalı ve birincil olarak kapatılmamalıdır. Beyin dokusunun oksijenlenmesini düzeltmede belirleyici adımın sert zarın genişletilmesi olduğu düşünülür. Nöbet, subdural higroma, hidrosefali ve enfeksiyon önemli komplikasyonlardır. **Menteşeli kraniotomide** kemik kapağı yerine konur ama yalnızca bir kenarından titanyum plakla tutturulur; kapak dışa doğru açılabilir, beyne doğru çökmez (Hutchinson ve ark., 2019).

**Kranioplasti** beyni korur, kubbenin bütünlüğünü ve normal BOS dinamiğini geri getirebilir; genel komplikasyon oranı %10,9–40,4 olarak bildirilir. Hastanın kendi kemiği, canlı kemik kenarına değmezse eriyebilir (%0,7–17,7); ameliyat yeri enfeksiyonu %5–12,8’dir. Kranioplastinin en uygun zamanı ve en uygun malzemesi konusunda uzlaşı yoktur (Hutchinson ve ark., 2019). 65 çalışmalık bir meta-analizde ilk ay içindeki kranioplasti daha az komplikasyon eğilimi (OR 0,62), ilk üç ay içindeki kranioplasti ise daha fazla hidrosefali eğilimi (OR 1,59) gösterdi; iki fark da anlamlı değildi (Hou ve ark., 2025). Yapay malzemeler arasında polimetil metakrilat (PMMA) ve hidroksiapatit daha fazla enfeksiyon ve yeniden ameliyatla, titanyum ise implantın açığa çıkmasıyla ilişkiliydi; genel komplikasyon PMMA’da %28,2, titanyumda %16,6’ydı ama fark anlamlı değildi. Kaynağın aktardığına göre bilinen ilk kranioplasti MÖ 3000 dolayında altın plakla yapılmıştır (Samandar ve ark., 2026).

**Trefine sendromu:** Kemik kalkınca beyin atmosfer basıncına açık kalır. Kafatası defektine bağlanan ve kranioplastiyle düzelen nörolojik kötüleşmeye trefine sendromu, kraniektomi bölgesinde kafa derisinin içe çökmesine **batık deri flebi sendromu** denir. Sıklığı tanı ölçütlerine göre %1–40 arasında değişir; bilişsel bozulma, odak bulgular, psikiyatrik belirtiler, dil sorunları, baş ağrısı ve yürüme bozukluğu görülebilir. Perfüzyon görüntülemesi defektin altında beyin kan akımının azaldığını gösterir; kesin tedavi kranioplastidir (Popoola ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kafatasından koordinata: stereotaksi ve navigasyon',
      md: `Stereotaksinin temeli kafatasına dayanır. Horsley ve Clarke, maymunda beyincik işlevini incelemek için geliştirdikleri aygıtta kafatası işaretleri (dış kulak yolları, alt göz çukuru kenarları, orta hat) ile beyin yapıları arasındaki ilişkinin tekrarlanabilirliğinden yararlandı; kafatasındaki sabitleme noktaları üç boyutlu Kartezyen koordinat sisteminin temelini oluşturdu. Spiegel ve Wycis insanda kafatası işaretlerinin yetmediğini, beyin içindeki işaretlere dayalı planlama gerektiğini fark etti; kozalak bezi kireçlenmesi bu amaçla denendi ama yeri ön-arka eksende 12 mm ya da daha fazla, kulaklar arası eksende 16 mm’ye kadar değiştiği için bırakıldı (Conti ve ark., 2023).

Leksell çerçevesiyle stereotaktik biyopsi lokal anestezi altında yapılabilir; çerçeve vidaları takılırken şakak kemiğinin inceliği özen ister (Lee ve ark., 2024). Bir fantom çalışmasında hedefe ulaşma hatası çerçeveli stereotakside ortalama 0,72 mm, robotla 0,53 mm idi (Spyrantis ve ark., 2022).

**Navigasyon** kafaya sabit bir referans çerçevesinin izlenmesine dayanır. Hastanın görüntüleriyle eşleştirme (kayıt) anatomik işaretler, cilde yapıştırılan ya da kemiğe yerleştirilen işaretleyiciler veya yüz yüzeyinin taranmasıyla yapılır; sistemlerin doğruluğu 0,5–5 mm aralığında bildirilir. Bir çalışmada yüz yüzeyi eşleştirmesi ortalama 6,6 mm, ameliyat içi BT ile otomatik kayıt 1,0 mm doğruluk verdi; örtüleme ve tümör çıkarıldıktan sonra doğruluk sırasıyla 2,9 ve 4,1 mm’ye geriledi (Frisk ve ark., 2024). Bu yüzden kafatasının işaret noktalarını bilmek, en gelişmiş navigasyon çağında da cerrahın güvencesidir.`,
    },
  ],
};
