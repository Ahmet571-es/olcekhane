import type { Misconception } from '@/lib/instruments/types';

/**
 * Ortaokul matematiğinde sık görülen hatalar ve kavram yanılgıları. Tanı testindeki yanlış
 * seçenekler bu hatalara göre yazılmıştır: öğrenci bir seçeneği seçtiğinde raporda ilgili açıklama
 * ve öneri gösterilir. Metinlerde kesirler {3/4} biçiminde yazılır.
 */
export const MISCONCEPTIONS: Record<string, Misconception> = {
  /* ---------- Sayılar ve işlemler ---------- */
  basamak_degeri: {
    name: 'Basamak değeri',
    explain:
      'Sayıyı yazarken ya da okurken rakamları yanlış basamağa yerleştirme, boş kalan basamaklara 0 yazmayı unutma ya da bir rakamın sayı değeriyle basamak değerini karıştırma.',
    tip: 'Sayıyı üçerli bölüklere (milyonlar, binler, birler) ayırıp bir basamak tablosuna yazmak bu hatayı büyük ölçüde önler.',
  },
  yuvarlama: {
    name: 'Yuvarlama',
    explain: 'Yuvarlarken yanlış basamağa bakma ya da sağdaki rakam 5 ve üzerindeyken bir üst değere yuvarlamayı unutma.',
    tip: 'Önce yuvarlanacak basamağın altını çizip hemen sağındaki rakama bakmak kuralı somutlaştırır.',
  },
  carpma_algoritma: {
    name: 'Çok basamaklı çarpma',
    explain: 'Çok basamaklı çarpmada ara çarpımları eksik alma (ör. 18 × 24’ü yalnızca 10 × 20 ve 8 × 4 olarak hesaplama).',
    tip: 'Çarpmayı parçalara ayırıp her parçayı ayrı yazmak (18 × 20 ve 18 × 4) hiçbir ara çarpımın atlanmamasını sağlar. Sonucu tahminle kontrol etmek de işe yarar: 18 × 24, 20 × 20 = 400’e yakın olmalıdır; 232 gibi bir sonuç çok küçüktür.',
  },
  cikarma_algoritma: {
    name: 'Onluk bozarak çıkarma',
    explain: 'Çıkarmada onluk bozmak yerine her basamakta büyük rakamdan küçük rakamı çıkarma (ör. 64 − 36’yı 32 bulma).',
    tip: 'Sonucu toplamayla kontrol etmek hatayı hemen gösterir: 32 + 36 = 68 eder, 64 değil. Onluk bozmayı para ya da onluk bloklarla modellemek kavramı pekiştirir.',
  },
  islem_secimi: {
    name: 'İşlem seçimi',
    explain: 'Problemin hangi işlemi gerektirdiğine karar verirken toplama, çıkarma, çarpma ve bölmeyi karıştırma.',
    tip: 'Problemi kendi cümleleriyle anlatmak ve küçük sayılarla bir örnek düşünmek doğru işlemi seçmeye yardım eder.',
  },
  kalan_yorum: {
    name: 'Kalanlı bölmeyi yorumlama',
    explain:
      'Kalanlı bölmede kalanı gözden kaçırma ya da problemin durumuna göre yorumlamama (ör. artan öğrenciler için bir minibüs daha gerektiğini düşünmeme).',
    tip: 'Bölmeden sonra “Kalan ne anlama geliyor, bu durumda ne yapmalıyım?” diye sormak alışkanlık hâline getirilebilir.',
  },
  soru_okuma: {
    name: 'Sorunun ne istediği',
    explain: 'Hesabı doğru yapıp sorunun sorduğu değeri değil, bir ara sonucu ya da başka bir değeri cevap olarak seçme.',
    tip: 'Cevabı işaretlemeden önce soru kökünü yeniden okuyup “Benden tam olarak ne isteniyor?” diye sormak bu hatayı azaltır.',
  },
  islem_onceligi: {
    name: 'İşlem önceliği',
    explain:
      'İşlemleri soldan sağa sırayla yapma; çarpma ve bölmenin toplama ve çıkarmadan önce yapıldığını ya da parantezin önceliğini gözden kaçırma.',
    tip: 'İşleme başlamadan önce çarpma ve bölmelerin altını çizmek, önce onları yapmayı hatırlatır.',
  },
  esitlik_anlami: {
    name: 'Eşittir işaretinin anlamı',
    explain: 'Eşittir işaretini “sonucu yaz” olarak görme; iki tarafın aynı değere sahip olması gerektiğini gözden kaçırma.',
    tip: 'Eşitliği iki kefesi dengede duran bir terazi gibi düşünmek ve bulunan sayıyı yerine koyup iki tarafı ayrı ayrı hesaplamak bu kavramı güçlendirir.',
  },
  dagilma: {
    name: 'Dağılma özelliği',
    explain:
      'Parantezli bir ifadeyi açarken çarpanı parantezin içindeki terimlerin yalnızca birine uygulama (ör. 3(2x − 4)’ü 6x − 4 yazma).',
    tip: 'Parantezin içindeki her terime ok çizerek çarpmak ya da işlemi bir dikdörtgenin alanı olarak modellemek her terimin çarpıldığını görünür kılar.',
  },
  bolunebilme: {
    name: 'Bölünebilme kuralları',
    explain: 'Bölünebilme kurallarını birbirine karıştırma (ör. 9 ile bölünebilme için 3’ün kuralını uygulama).',
    tip: 'Her kuralı küçük örneklerle denemek (12 sayısı 3’e bölünür ama 9’a bölünmez) kuralları ayırt etmeyi kolaylaştırır.',
  },
  asal_carpan: {
    name: 'Asal çarpanlar',
    explain:
      'Bir sayıyı çarpanlarına ayırırken asal olmayan çarpanlarla (4, 6 gibi) bırakma ya da tekrar eden asal çarpanları yazmayı unutma.',
    tip: 'Çarpan ağacı çizip her dalı ancak asal sayıya ulaşınca durdurmak ve sonunda çarpımın sayıyı verdiğini kontrol etmek doğru ayrışımı verir.',
  },
  ebob_ekok: {
    name: 'Ortak bölen ve ortak kat',
    explain:
      'Bir problemde en büyük ortak bölenin mi en küçük ortak katın mı gerektiğini karıştırma ya da ortak kat yerine sayıların toplamını veya çarpımını kullanma.',
    tip: '“Eşit parçalara bölme” problemlerinde ortak bölen, “yeniden aynı anda buluşma” problemlerinde ortak kat aranır. Katları ya da bölenleri liste hâlinde yazmak hangisinin gerektiğini gösterir.',
  },
  negatif_siralama: {
    name: 'Negatif sayıları sıralama',
    explain: 'Negatif sayılarda sıfırdan daha uzak olanı daha büyük sanma (ör. −5’i −3’ten büyük görme).',
    tip: 'Sayı doğrusu ya da termometre üzerinde düşünmek yardımcı olur: sola gittikçe sayılar küçülür.',
  },
  negatif_isaret: {
    name: 'İşaret kuralları',
    explain:
      'Tam sayılarla ya da cebirsel ifadelerle işlem yaparken işaretleri karıştırma; parantezin önündeki eksinin içerideki her terimi etkilediğini gözden kaçırma.',
    tip: 'Her adımda işaretleri ayrıca yazmak ve sonucu sayı doğrusu üzerinde kontrol etmek işaret hatalarını azaltır.',
  },

  /* ---------- Kesirler, ondalık gösterim ve yüzdeler ---------- */
  kesir_cokluk: {
    name: 'Bir çokluğun kesri',
    explain: 'Bir çokluğun kesir kadarını bulurken yalnızca paydaya ya da yalnızca paya bölme.',
    tip: 'Önce birim kesri bulmak (24’ün {1/8}’i 3’tür), sonra payla çarpmak (3 × 3 = 9) iki adımı da görünür kılar. Nesneleri eşit gruplara ayırmak da yardımcı olur.',
  },
  kesir_buyukluk_payda: {
    name: 'Kesirlerde büyüklük',
    explain: 'Paydası büyük olan kesri daha büyük sanma. Oysa pay aynıyken payda büyüdükçe parçalar küçülür.',
    tip: 'Aynı uzunluktaki kâğıt şeritleri 3, 5, 8 ve 10 eşit parçaya bölüp birer parçayı karşılaştırmak {1/10}’un {1/3}’ten küçük olduğunu gözle gösterir.',
  },
  kesir_butun: {
    name: 'Kesirde bütün',
    explain: 'Birden fazla bütün olduğunda bütünü yanlış seçme (ör. iki pizzanın toplam 8 dilimini bir bütün sanma).',
    tip: 'Önce “Bir bütün kaç parça?” sorusunu cevaplamak, sonra kaç parça olduğunu saymak doğru kesri verir.',
  },
  kesir_pay_payda: {
    name: 'Pay ve payda',
    explain: 'Kesirde payı ve paydayı ters yazma ya da payın ve paydanın neyi gösterdiğini karıştırma.',
    tip: 'Paydanın bütünün kaç eşit parçaya bölündüğünü, payın ise kaç parçanın alındığını gösterdiğini bir çizim üzerinde söylemek yardımcı olur.',
  },
  kesir_toplama_payda: {
    name: 'Kesirlerle toplama',
    explain: 'Kesirleri toplarken payları toplayıp paydaları da toplama (ör. {2/7} + {3/7} = {5/14}).',
    tip: 'Paydanın parçanın adı olduğunu vurgulamak işe yarar: 2 yedide bir + 3 yedide bir = 5 yedide bir. Tahminle kontrol de yardımcıdır: {2/7} + {3/7}, {3/7}’den büyük olmalıdır; oysa {5/14} ondan küçüktür.',
  },
  genisletme: {
    name: 'Kesirleri genişletme',
    explain: 'Paydaları eşitlerken paydayı değiştirip payı aynı sayıyla çarpmayı unutma ya da paya ve paydaya aynı sayıyı ekleme.',
    tip: 'Genişletmenin, kesri 1’e eşit bir kesirle (ör. {4/4}) çarpmak olduğunu hatırlamak payın da çarpılması gerektiğini gösterir.',
  },
  kesir_islem: {
    name: 'Kesirlerle işlem kuralları',
    explain: 'Kesirlerde toplama ile çarpma kurallarını karıştırma (ör. toplarken payları ve paydaları çarpma).',
    tip: 'Her işlemi bir modelle (şerit, sayı doğrusu) çözüp kuralın nereden geldiğini görmek kuralları ayırt etmeyi kolaylaştırır.',
  },
  kesir_bolme: {
    name: 'Kesir ve bölme ilişkisi',
    explain: 'Paylaştırma durumlarında bölmenin yönünü karıştırma (ör. 3 pizzayı 4 kişiye paylaştırırken 4 ÷ 3 yapma).',
    tip: '“Paylaştırılan miktar ÷ kişi sayısı” kalıbını küçük sayılarla denemek ve sonucun mantıklı olup olmadığını sormak yardımcı olur: 3 pizza 4 kişiye paylaştırılırsa herkese 1 pizzadan az düşmelidir.',
  },
  ondalik_uzunluk: {
    name: 'Ondalık sayıları karşılaştırma',
    explain: 'Virgülden sonra daha çok basamağı olan sayıyı daha büyük sanma (ör. 0,65’i 0,7’den büyük görme).',
    tip: 'Basamak sayılarını eşitlemek (0,7 = 0,700) ve para ya da uzunluk örnekleriyle düşünmek karşılaştırmayı kolaylaştırır.',
  },
  ondalik_kesir: {
    name: 'Ondalık gösterim ve kesir',
    explain: 'Ondalık gösterimi kesre çevirirken basamak değerini gözden kaçırma (ör. 0,6’yı {6/100} ya da {1/6} sanma).',
    tip: 'Ondalık sayıyı basamak adıyla okumak doğru kesri doğrudan verir: 0,6 “onda altı”dır, yani {6/10}.',
  },
  ondalik_virgul: {
    name: 'Ondalık sayılarla işlem',
    explain: 'Ondalık sayılarla işlem yaparken virgülün yerini yanlış belirleme.',
    tip: 'Sonucu önce tahmin etmek (2,75 × 4 yaklaşık 3 × 4 = 12) virgülün yerini kontrol etmek için güvenilir bir yoldur.',
  },
  yuzde_anlami: {
    name: 'Yüzdenin anlamı',
    explain: 'Yüzdeyi bir bütünün yüzde kaçı olarak değil, doğrudan bir sayı gibi kullanma (ör. 240 TL’nin %15’ini 15 TL sanma).',
    tip: '“%15, her 100’de 15” fikrini 100 kareli bir tabloda boyayarak göstermek kavramı somutlaştırır.',
  },
  yuzde_taban: {
    name: 'Yüzdenin neye göre hesaplandığı',
    explain:
      'Yüzdenin hangi tutara göre hesaplandığını karıştırma: art arda yapılan zam ve indirimin aynı tutar üzerinden yapıldığını sanma ya da parçayı bütün yerine kullanma.',
    tip: 'Her adımda “Bu yüzde neyin yüzdesi?” diye sorup o tutarı yazmak hatayı görünür kılar.',
  },
  yuzde_artis_azalis: {
    name: 'İndirim ve zam',
    explain: 'İndirim ile zammı karıştırma; indirimli fiyatı bulurken indirimi fiyata ekleme.',
    tip: 'Sonucu mantık kontrolünden geçirmek yardımcı olur: indirimli fiyat ilk fiyattan küçük olmalıdır.',
  },

  /* ---------- Oran ve orantı ---------- */
  oran_parca_butun: {
    name: 'Oran ve bütün',
    explain:
      'Parça-parça oranını parça-bütün oranı gibi kullanma (kızların erkeklere oranı {3/4} iken kızları sınıfın {3/4}’ü sanma).',
    tip: 'Oranı küçük bir grup olarak çizmek (3 kız ve 4 erkekten oluşan 7 kişilik grup) bütünün kaç parçadan oluştuğunu gösterir.',
  },
  oran_toplamsal: {
    name: 'Orantısal düşünme',
    explain: 'Orantılı artan durumlarda çarpma yerine toplama ile düşünme (ör. 3 kg 96 TL ise 5 kg’ı 98 TL sanma).',
    tip: 'Önce birim değeri bulmak (1 kg kaç TL?) orantılı düşünmenin en güvenilir yoludur.',
  },
  oran_ters: {
    name: 'Orantıyı kurma',
    explain: 'Orantıyı kurarken terimlerin yerlerini ters yazma.',
    tip: 'Birimleri de yazarak orantı kurmak (kg ile kg, TL ile TL karşılıklı) terimlerin yerini doğru tutmaya yardım eder.',
  },

  /* ---------- Örüntüler ve cebir ---------- */
  oruntu_terim: {
    name: 'Örüntüde terim sayma',
    explain: 'İstenen terime gelirken adımları bir eksik ya da bir fazla sayma.',
    tip: 'Terimlerin altına sıra numaralarını (1., 2., 3. …) yazmak ve bulunan kuralı ilk terimlerde denemek sayma hatalarını önler.',
  },
  oruntu_kural: {
    name: 'Örüntünün kuralı',
    explain: 'Örüntünün kuralını yalnızca artış miktarına ya da yalnızca ilk terime bakarak kurma.',
    tip: 'Bulunan kuralı ilk iki üç terimde denemek (1., 2. ve 3. terim için) kuralın doğru olup olmadığını hemen gösterir.',
  },
  cebir_yan_yana: {
    name: 'Harfli ifadeleri okuma',
    explain: '3a gibi bir ifadeyi 3 ile a’nın çarpımı değil, yan yana yazılmış rakamlar ya da toplam gibi okuma (a = 4 için 34 ya da 7).',
    tip: '3a’yı “3 tane a” ya da “3 × a” olarak okumaya alışmak bu karışıklığı giderir.',
  },
  sozel_cebir: {
    name: 'Sözel ifadeyi cebire çevirme',
    explain: 'Sözel bir durumu cebirsel ifadeye ya da denkleme çevirirken işlemlerin sırasını veya yönünü karıştırma.',
    tip: 'İfadeyi önce bir sayıyla denemek (“Sayı 10 olsaydı ne olurdu?”) doğru cebirsel yazımı bulmayı kolaylaştırır.',
  },
  denklem_ters_islem: {
    name: 'Denklem çözme',
    explain:
      'Bilinmeyeni bulurken ters işlem yerine aynı işlemi yapma ya da bir terimi eşitliğin öbür tarafına işaretini değiştirmeden geçirme.',
    tip: 'Bulunan cevabı denklemde yerine koyup iki tarafın eşit olup olmadığını kontrol etmek hatayı her zaman yakalar.',
  },

  /* ---------- Geometri ve ölçme ---------- */
  cevre_kenar: {
    name: 'Çevre',
    explain:
      'Çevreyi hesaplarken bütün kenarları hesaba katmama (ör. dikdörtgende yalnızca iki kenarı toplama) ya da çevresi verilen bir şekilde kenar bulurken çevrenin her kenarı içerdiğini unutma.',
    tip: 'Şeklin kenarlarını tek tek işaretleyerek saymak ve çevreyi “şeklin etrafında bir tur” olarak düşünmek yardımcı olur.',
  },
  alan_cevre: {
    name: 'Alan ve çevre',
    explain: 'Alan ile çevreyi (ya da dairenin alanı ile çemberin uzunluğunu) birbirine karıştırma.',
    tip: 'Çevrenin “sınır boyunca yürünen yol”, alanın ise “içini kaplayan kareler” olduğunu çizimle göstermek iki kavramı ayırır. Birimler de ipucu verir: çevre cm ile, alan cm² ile ölçülür.',
  },
  alan_formul: {
    name: 'Alan formülleri',
    explain:
      'Bir şeklin alan formülünü başka bir şeklinkiyle karıştırma (ör. paralelkenarda yan kenarı yükseklik yerine kullanma ya da sonucu ikiye bölme).',
    tip: 'Paralelkenarı kesip dikdörtgene dönüştürmek, formülün nereden geldiğini ve yüksekliğin neden önemli olduğunu gösterir.',
  },
  alan_birim: {
    name: 'Alan birimleri',
    explain:
      'Alan birimlerini dönüştürürken uzunluk birimlerindeki çarpanı kullanma (1 m = 100 cm olduğu için 1 m² = 100 cm² sanma; oysa 1 m² = 10 000 cm²).',
    tip: 'Kenarı 1 m olan bir kareyi kenarı 1 cm olan karelerle kaplamayı düşünmek: 100 sıra × 100 kare = 10 000 kare.',
  },
  birim_donusum: {
    name: 'Uzunluk birimleri',
    explain: 'Uzunluk birimleri arasında dönüşüm yaparken çarpanları (10, 100, 1000) karıştırma ya da farklı birimlerdeki sayıları doğrudan toplama.',
    tip: 'Dönüşümden sonra sonucun mantıklı olup olmadığını sormak (“3 metre 35 cm olabilir mi?”) hatayı yakalatır.',
  },
  zaman_donusum: {
    name: 'Zaman ölçme',
    explain: 'Saat ve dakikayı ondalık sayılar gibi toplama; 60 dakikanın 1 saat ettiğini gözden kaçırma.',
    tip: 'Zamanı adım adım eklemek (önce saatleri, sonra dakikaları; 60 dakikayı geçince bir saat ekleyerek) ya da bir saat kadranı üzerinde ilerlemek yardımcı olur.',
  },
  aci_turu: {
    name: 'Açı türleri',
    explain: 'Açıları büyüklüklerine göre dar, dik, geniş ve doğru açı olarak sınıflandırmayı karıştırma.',
    tip: 'Bir kâğıdın köşesini dik açı ölçüsü olarak kullanmak: köşeden küçük açılar dar, büyük açılar geniş açıdır.',
  },
  kesisen_dogrular: {
    name: 'Kesişen doğrular',
    explain:
      'Kesişen iki doğrunun oluşturduğu açılarda yan yana duran açıların toplamının 180°, karşılıklı duran açıların ise eşit olduğunu gözden kaçırma.',
    tip: 'İki kalemi çaprazlayıp açıları incelemek ve yan yana duran iki açının birlikte düz bir çizgi oluşturduğunu görmek yardımcı olur.',
  },
  tumler_butunler: {
    name: 'Tümler ve bütünler açılar',
    explain: 'Toplamı 90° olan (tümler) ve 180° olan (bütünler) açıları karıştırma.',
    tip: 'Bütünler açıların birlikte düz bir çizgi, tümler açıların ise bir dik köşe oluşturduğunu çizerek hatırlamak ayırt etmeyi kolaylaştırır.',
  },
  paralel_aci: {
    name: 'Paralel doğrularda açılar',
    explain:
      'İki paralel doğruyu kesen bir doğrunun oluşturduğu açıların hepsini eşit sanma. Oysa bu açılardan herhangi ikisi ya eşittir ya da toplamları 180°’dir.',
    tip: 'İki paralel doğru bir kesenle kesildiğinde bütün dar açılar birbirine, bütün geniş açılar da birbirine eşittir; bir dar ve bir geniş açının toplamı 180°’dir. Açıları şekil üzerinde “dar” ve “geniş” diye işaretlemek bunu görmeyi kolaylaştırır.',
  },
  aci_toplami: {
    name: 'İç açılar toplamı',
    explain: 'Üçgenin iç açıları toplamını (180°) dörtgeninkiyle (360°) karıştırma.',
    tip: 'Kâğıttan kesilmiş bir üçgenin köşelerini koparıp yan yana dizmek, 180°’lik düz bir açı oluşturduklarını gösterir.',
  },
  cap_yaricap: {
    name: 'Çap ve yarıçap',
    explain: 'Formüllerde ya da şekillerde çap yerine yarıçapı veya yarıçap yerine çapı kullanma.',
    tip: 'Formülü yazmadan önce verilen uzunluğun çap mı yarıçap mı olduğunu şekil üzerinde işaretlemek hatayı önler.',
  },
  hacim_alan: {
    name: 'Hacim ve yüzey alanı',
    explain: 'Bir cismin hacmini yüzey alanıyla karıştırma ya da ayrıt uzunluklarını toplama.',
    tip: 'Hacmin “içine sığan birim küp sayısı”, yüzey alanının “dışını kaplamak için gereken kâğıt” olduğunu somut nesnelerle göstermek işe yarar.',
  },
  hacim_formul: {
    name: 'Hacim hesaplama',
    explain: 'Hacmi hesaplarken üç boyuttan birini unutma (ör. yalnızca taban alanını bulma).',
    tip: 'Hacmi “taban alanı × yükseklik” olarak düşünmek ve birim küplerle kat kat modellemek her boyutu hesaba katmayı sağlar.',
  },

  /* ---------- Veri ve olasılık ---------- */
  grafik_okuma: {
    name: 'Grafik okuma',
    explain: 'Sütun ya da çizgi grafiğindeki değerleri, eksendeki sayılara bakmadan çizgi sayarak okuma (ölçeğin kaçar kaçar arttığını hesaba katmama).',
    tip: 'Grafiği okumadan önce eksendeki sayıların kaçar kaçar arttığına bakmak alışkanlık hâline getirilebilir.',
  },
  tablo_okuma: {
    name: 'Tablo okuma',
    explain:
      'Tablodaki değerleri ve sıklıkları karıştırma (ör. kardeş sayısı ile öğrenci sayısını), yanlış satırı okuma ya da sıklıkları hesaba katmama.',
    tip: 'Tabloyu okumadan önce her sütunun neyi gösterdiğini kendi cümleleriyle söylemek bu hatayı azaltır.',
  },
  en_az_en_cok: {
    name: '“Fazla”, “az” ve “en” ifadeleri',
    explain: '“40’tan az” ya da “olabildiğince uzun” gibi ifadeleri yanlış yorumlama; sınırdaki değerin dâhil olup olmadığını ya da istenenin en büyük mü en küçük mü olduğunu karıştırma.',
    tip: 'Bu ifadeleri sayı doğrusu üzerinde göstermek hangi değerlerin dâhil olduğunu netleştirir. Soruda “en”, “az”, “fazla” gibi kelimelerin altını çizmek de yardımcı olur.',
  },
  daire_grafik: {
    name: 'Daire grafiği',
    explain: 'Daire grafiğinde dilimleri eşit sanma ya da bir dilimin bütünün ne kadarı olduğunu yanlış yorumlama.',
    tip: 'Her dilimin dairenin ne kadarını kapladığını (yarım, çeyrek) bir kesir olarak yazıp toplam sayıyla çarpmak doğru sonucu verir.',
  },
  degisim_deger: {
    name: 'Değişim ve değer',
    explain: 'Grafikte en büyük değeri en büyük değişimle (artışla) karıştırma.',
    tip: 'Artışı bulmak için art arda gelen değerlerin farkını yazmak ve grafikte en dik yükselen parçanın en büyük artışı gösterdiğini görmek yardımcı olur.',
  },
  ortalama_toplam: {
    name: 'Aritmetik ortalama',
    explain: 'Ortalamayı hesaplarken toplamı veri sayısına bölmeyi unutma ya da yanlış sayıya bölme.',
    tip: 'Ortalamanın “eşit paylaştırma” olduğunu düşünmek, toplamın veri sayısına bölünmesi gerektiğini hatırlatır.',
  },
  ortalama_ortanca: {
    name: 'Ortalama ve ortanca',
    explain: 'Aritmetik ortalama ile ortancayı (sıralanmış verilerin ortasındaki değer) karıştırma.',
    tip: 'Aynı veri grubu için ikisini de hesaplayıp karşılaştırmak farkı somut olarak gösterir.',
  },
  ortalama_anlami: {
    name: 'Ortalamanın anlamı',
    explain:
      'Eksik bir değeri ortalamaya eşit sanma ya da ortalamaları, kaç veriden oluştuklarını hesaba katmadan birleştirme; bir değer eklendiğinde ortalamanın nasıl değiştiğini gözden kaçırma.',
    tip: 'Önce toplamı bulmak (ortalama × veri sayısı) ortalamayla ilgili problemlerin çoğunu çözmenin anahtarıdır.',
  },
  ortanca_siralama: {
    name: 'Ortancada sıralama',
    explain: 'Ortancayı bulmadan önce verileri küçükten büyüğe sıralamama.',
    tip: 'Ortanca sorularında ilk adım her zaman verileri sıralamaktır; sıralanmış listeyi yazmak hatayı önler.',
  },
  ortanca_cift: {
    name: 'Çift sayıda veride ortanca',
    explain:
      'Veri sayısı çift olduğunda ortancanın ortadaki iki değerin ortalaması olduğunu gözden kaçırma ya da yeni bir değer eklendiğinde ortancanın değişebileceğini düşünmeme.',
    tip: 'Sıralanmış verinin iki ucundan birer birer eleyerek ortaya ulaşmak, ortada bir mi iki mi değer kaldığını gösterir.',
  },
  olasilik_spektrum: {
    name: 'Olasılık değerleri',
    explain: 'Olasılığı düşük bir olayı imkânsız sanma ya da imkânsız (0) ve kesin (1) olayları karıştırma.',
    tip: 'Olayları 0 (imkânsız) ile 1 (kesin) arasındaki bir çizgiye yerleştirmek olasılık kavramını somutlaştırır.',
  },
  olasilik_esit: {
    name: 'Eş olasılık varsayımı',
    explain: 'Sayıları farklı olan sonuçları eşit olasılıklı sanma (ör. torbada 3 renk var diye her rengin çekilme olasılığını eşit görme).',
    tip: 'Olasılığı, istenen bilyelerin sayısını bütün bilyelerin sayısıyla karşılaştırarak düşünmek doğru sonuca götürür.',
  },
  olasilik_oran: {
    name: 'Olasılık ve oran',
    explain: 'Olasılığı, istenen durumların istenmeyen durumlara oranı gibi hesaplama.',
    tip: 'Olasılıkta paydaya her zaman bütün denemelerin ya da bütün olası durumların sayısı yazılır.',
  },
  deneysel_teorik: {
    name: 'Deneysel ve teorik olasılık',
    explain: 'Deneysel olasılık ile teorik olasılığı karıştırma: deneysel olasılık, deneyde gerçekten gözlenen sonuçlara dayanır.',
    tip: 'Deney sonuçlarını bir tabloya yazıp “Kaç denemede kaç kez oldu?” diye sormak deneysel olasılığı doğrudan verir.',
  },
};
