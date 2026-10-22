import { KAYNAK } from './kaynaklar';
import type { AcademicRoadmapTemplate } from './types';

/**
 * Matematik Konu Tarama Testi: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Her form, öğrencinin bir önceki sınıfının konularını yoklar; alan metinleri formun konularına göre yazılır
 *    (anahtar: formun içerik sınıfı). Öneriler konunun anlamını şekil, sayı doğrusu ve gerçek nesnelerle görmeye ve
 *    araştırmalarla desteklenen çalışma ilkelerine dayanır: hatırlamaya çalışmak (Roediger ve Karpicke, 2006),
 *    tekrarları günlere yaymak (Cepeda ve ark., 2006), konuları karıştırarak çalışmak (Rohrer ve ark., 2015).
 *  - Rapordaki hata türü açıklamaları ve ipuçları tekrar edilmez; yol haritası nasıl çalışılacağını anlatır.
 *  - Öneriler öğretmenin planının yerine geçmez; kesin hüküm verilmez. Test yetişkinlere açık değildir.
 */
export const matematikRoadmap: AcademicRoadmapTemplate = {
  version: 'matematik-yol-haritasi-1',
  colors: {
    sayilar: '#2f5ce0',
    kesirler: '#df4777',
    oran: '#ee6a36',
    cebir: '#7a4ee6',
    geometri: '#0e9c8c',
    veri: '#d28a14',
  },
  lead: {
    low: {
      student: 'Bu alan öncelikli: önce temel kavramlara dön, sonra soru çözmeye geç.',
      parent: 'Bu alan öncelikli: önce temel kavramların sağlamlaşması gerekir.',
    },
    average: {
      student: 'Bu alan pekiştirilmeli: bazı soruları doğru yaptın, bazılarında zorlandın. Aşağıdaki önerilerle eksik kalan konuları tamamlayabilirsin.',
      parent: 'Bu alan pekiştirilmeli: çocuğunuz bazı soruları doğru yaptı, bazılarında zorlandı. Aşağıdaki öneriler eksik konuları tamamlamaya yardım eder.',
    },
  },
  // Sağlam alan metinleri bütün formlarda ortaktır: belli bir sınıfın konusunu (ör. yüzde, denklem, hacim) anmaz.
  solid: {
    sayilar: {
      student: 'Bu alan sağlam görünüyor. Bir adım ileri gitmek için zihinden işlem yapmayı ve sonuçları tahmin etmeyi dene; daha zorlayıcı, çok adımlı problemler seçebilirsin.',
      parent: 'Bu alan sağlam görünüyor. Çocuğunuza zihinden işlem ve tahmin gerektiren, biraz daha zorlayıcı problemler önerebilirsiniz.',
    },
    kesirler: {
      student: 'Bu alan sağlam görünüyor. Bu konuları gündelik hesaplarda kullanmayı sürdür (ör. bir tarifte ya da bir şeyi paylaştırırken). Birkaç adımlı problemler seçip çözümünü birine anlatmak bu beceriyi ileri taşır.',
      parent: 'Bu alan sağlam görünüyor. Bir tarif ya da bir şeyi paylaştırma gibi gündelik hesaplarda bu alandaki konuları kullanmasına fırsat vererek beceriyi canlı tutabilirsiniz.',
    },
    oran: {
      student: 'Bu alan sağlam görünüyor. Harita ölçekleri ve hız problemleri gibi oran gerektiren yeni durumlarda kendini dene.',
      parent: 'Bu alan sağlam görünüyor. Harita ölçeği, hız ve fiyat karşılaştırması gibi yeni durumlarda oran kullanmasına fırsat verebilirsiniz.',
    },
    cebir: {
      student: 'Bu alan sağlam görünüyor. Bir problemi iki farklı yolla çözüp yolları karşılaştırmak düşünceni esnekleştirir; biraz daha zorlayıcı örüntü ve problemlerle de kendini deneyebilirsin.',
      parent: 'Bu alan sağlam görünüyor. Bir problemi farklı yollarla çözmesini ve bu yolları karşılaştırmasını önerebilirsiniz.',
    },
    geometri: {
      student: 'Bu alan sağlam görünüyor. Kendi şekillerini çizip onlarla ilgili problemler yazmak ve bu problemleri bir arkadaşına çözdürmek bu beceriyi daha da güçlendirir.',
      parent: 'Bu alan sağlam görünüyor. Kendi şekillerini tasarlayıp onlarla ilgili problemler yazmasını önerebilirsiniz.',
    },
    veri: {
      student: 'Bu alan sağlam görünüyor. Merak ettiğin bir konuda kendi küçük anketini yap; sonuçları grafiğe dökmek ve yorumlamak bu beceriyi ileri taşır.',
      parent: 'Bu alan sağlam görünüyor. Merak ettiği bir konuda küçük bir anket yapıp sonuçları grafiğe dökmesini destekleyebilirsiniz.',
    },
  },
  forms: {
    // 5. sınıf formu: 4. sınıf konuları.
    4: {
      sayilar: {
        need: {
          student:
            'Sayıları bir basamak tablosuna (binler, yüzler, onlar, birler) yazarak çalış: her rakamın bulunduğu basamağa göre değer aldığını gör. Büyük sayıları sesli oku, sonra rakamla yaz. Yuvarlarken sayıyı bir sayı doğrusunda iki komşu onluğun ya da yüzlüğün arasına yerleştir ve hangisine daha yakın olduğuna bak.',
          parent:
            'Çocuğunuzla sayıları bir basamak tablosuna yazarak çalışabilirsiniz: her rakamın bulunduğu basamağa göre değer aldığını görmesi önemlidir. Yuvarlamada sayıyı bir sayı doğrusunda iki komşu onluk ya da yüzlük arasına yerleştirmesi, hangisine daha yakın olduğunu görmesini sağlar.',
        },
        action: {
          student: 'Bu hafta her gün bir fiyat etiketinde ya da bir kitapta gördüğün çok basamaklı bir sayıyı basamak tablosuna yaz ve en yakın yüzlüğe yuvarla.',
          parent: 'Bu hafta alışverişte ya da bir haberde geçen büyük sayıları çocuğunuza okutun ve en yakın onluğa ya da yüzlüğe yuvarlamasını isteyin.',
        },
        approach: 'Sayıları gündelik hayatta birlikte okuyun; yanlış okuduğunda hemen düzeltmek yerine basamaklarını birlikte inceleyin.',
      },
      cebir: {
        need: {
          student:
            'Bir problemi çözmeden önce üç soru sor: Ne biliyorum? Ne isteniyor? Hangi işlem gerekiyor? Problemi kısa bir şekil ya da şemayla çizmek işlemi seçmeyi kolaylaştırır. Eşittir işaretinin "iki taraf aynı değerde" demek olduğunu hatırla; örüntülerde sayıların nasıl değiştiğini her adımın altına yazarak kuralı bul.',
          parent:
            'Çocuğunuzun bir problemi çözmeden önce "Ne biliyorum, ne isteniyor, hangi işlem gerekiyor?" diye düşünmesini ve problemi kısa bir şemayla çizmesini destekleyin. Eşittir işaretinin "iki taraf aynı değerde" anlamına geldiğini ve örüntülerde sayıların nasıl değiştiğini adım adım yazmayı birlikte konuşabilirsiniz.',
        },
        action: {
          student: 'Bu hafta her gün bir problemi çözmeden önce şemasını çiz; hafta sonunda hangi problemlerde şemanın işini kolaylaştırdığını yaz.',
          parent: 'Bu hafta çocuğunuzla gündelik bir durumdan (ör. market alışverişi) kısa bir problem yazın ve onun hangi işlemi neden seçtiğini anlatmasını isteyin.',
        },
        approach: 'Sonuçtan çok düşünme yolunu sorun: "Bu işlemi neden seçtin?" sorusu, doğru cevabı söylemekten daha çok şey öğretir.',
      },
      kesirler: {
        need: {
          student:
            'Kesirleri önce şekille çalış: bir bütünü eş parçalara böl ve kaç parçayı aldığını boya. Bir çokluğun kesrini bulurken nesneleri eş gruplara ayır. Kesirleri bir sayı doğrusuna yerleştirerek karşılaştır; paydası büyük olan kesrin her zaman büyük olmadığını göreceksin.',
          parent:
            'Kesirleri önce somut olarak çalışmak işe yarar: bir pizzayı, bir çikolatayı ya da bir kâğıdı eş parçalara bölüp kaç parça alındığını konuşabilirsiniz. Kesirleri bir sayı doğrusuna yerleştirmek, paydası büyük olanın her zaman büyük olmadığını görmesine yardım eder.',
        },
        action: {
          student: 'Bu hafta bir kâğıdı katlayarak yarım, çeyrek ve sekizde bir parçalar oluştur; hangi kesrin daha büyük olduğunu parçaları üst üste koyarak göster ve defterine çiz.',
          parent: 'Bu hafta mutfakta ya da sofrada kesirleri kullanın (ör. "Ekmeğin dörtte üçü kaldı, kaç parça yedik?") ve çocuğunuzdan cevabını şekille göstermesini isteyin.',
        },
        approach: 'Kesirleri gündelik dilde kullanın (yarım, çeyrek, üçte bir); kural ezberletmek yerine şekille anlamasına fırsat verin.',
      },
      geometri: {
        need: {
          student:
            'Ölçmeyi gerçek nesnelerle çalış: masanın, defterin ya da odanın kenarlarını ölç ve çevresini bul. Birimleri (metre ve santimetre; saat ve dakika) birbirine çevirirken küçük bir dönüşüm tablosu hazırla. Açıları bir kâğıdın köşesiyle karşılaştırarak dar, dik ve geniş açıyı ayırt et.',
          parent:
            'Ölçmeyi evdeki nesnelerle çalışmak kalıcı olur: bir masanın kenarlarını birlikte ölçüp çevresini bulabilir, yolculuk sürelerini saat ve dakikayla hesaplayabilirsiniz. Açıları bir kâğıdın köşesiyle karşılaştırmak dar, dik ve geniş açıyı ayırt etmesini kolaylaştırır.',
        },
        action: {
          student: 'Bu hafta evde üç nesnenin kenarlarını ölç, çevrelerini hesapla ve sonuçları santimetre ve metre olarak bir tabloya yaz.',
          parent: 'Bu hafta çocuğunuzla bir yolculuğun ya da bir yemeğin ne kadar süreceğini birlikte hesaplayın ve saatle kontrol edin.',
        },
        approach: 'Ölçmeyi elle tutulur kılın: cetvel, şerit metre ve saat kullanmasına fırsat verin.',
      },
      veri: {
        need: {
          student:
            'Bir grafiği okumadan önce başlığına, neyi gösterdiğine ve bir karenin ya da çizginin kaç birim olduğuna bak. Sonra en büyük ve en küçük değeri ve aralarındaki farkı bul. Kendi verini toplayıp (ör. arkadaşlarının en sevdiği meyve) sütun grafiğini çizmek grafik okumayı kolaylaştırır.',
          parent:
            'Çocuğunuza bir grafiği okumadan önce başlığına, neyi gösterdiğine ve ölçeğine bakmasını hatırlatın. Evde küçük bir veri toplayıp (ör. bir haftalık hava durumu) birlikte bir sütun grafiği çizmek grafikleri anlamasını kolaylaştırır.',
        },
        action: {
          student: 'Bu hafta bir konuda veri topla (ör. her gün kaç sayfa kitap okuduğun), sütun grafiğini çiz ve grafikten üç sonuç yaz.',
          parent: 'Bu hafta bir gazetede ya da haberde gördüğünüz bir grafiği çocuğunuzla inceleyin; ondan en büyük ve en küçük değeri bulmasını isteyin.',
        },
        approach: 'Haberlerdeki ve paketlerdeki tablo ve grafikleri birlikte okuyun; "Bu grafik bize ne söylüyor?" diye sorun.',
      },
    },
    // 6. sınıf formu: 5. sınıf konuları.
    5: {
      sayilar: {
        need: {
          student:
            'Çok adımlı problemleri parçalara ayır: önce ilk adımda hangi bilgiyi bulacağını yaz, sonra ikinci adıma geç. Her adımın sonucunu yaklaşık bir tahminle kontrol et (ör. 498 × 21 yaklaşık 500 × 20 = 10 000). Basamak değerini sağlamlaştırmak için sayıları çözümleyerek yaz (ör. 3 045 = 3 000 + 40 + 5).',
          parent:
            'Çocuğunuzun çok adımlı problemleri parçalara ayırmasını ve her adımın sonucunu yaklaşık bir tahminle kontrol etmesini destekleyin (ör. 498 × 21 yaklaşık 500 × 20). Sayıları çözümleyerek yazmak (3 045 = 3 000 + 40 + 5) basamak değerini sağlamlaştırır.',
        },
        action: {
          student: 'Bu hafta her gün iki adımlı bir problem çöz; çözmeden önce sonucu tahmin et ve tahminini gerçek sonuçla karşılaştır.',
          parent: 'Bu hafta alışverişte toplam tutarı çocuğunuza önce tahmin ettirin, sonra birlikte hesaplayın.',
        },
        approach: 'Tahmin etmeyi bir oyuna dönüştürün; tahmini ile gerçek sonuç arasındaki farkı birlikte yorumlayın.',
      },
      cebir: {
        need: {
          student:
            'İşlem önceliğini bir sıra olarak yaz ve her işlemde önce hangi adımı yaptığını altını çizerek göster: önce parantez, sonra çarpma ve bölme, en son toplama ve çıkarma. Bir eşitliğin iki tarafını bir terazi gibi düşün: bir tarafa ne yaparsan öteki tarafa da aynısını yapmalısın. Örüntülerde sayıları bir tabloya yazarak kuralı bul.',
          parent:
            'Çocuğunuzla işlem önceliğini adım adım çalışabilirsiniz: önce parantez, sonra çarpma ve bölme, en son toplama ve çıkarma. Bir eşitliği terazi gibi düşünmek (bir tarafa ne yapılırsa ötekine de aynısı yapılır) ve örüntülerde sayıları bir tabloya yazarak kuralı bulmak bu alanı sağlamlaştırır.',
        },
        action: {
          student: 'Bu hafta her gün işlem önceliği gerektiren iki işlem yaz ve çöz; her adımı ayrı satıra yazarak hangi işlemi önce yaptığını göster.',
          parent: 'Bu hafta çocuğunuzdan size bir işlemin çözümünü adım adım anlatmasını isteyin; "Neden önce bunu yaptın?" diye sorun.',
        },
        approach: 'Adım adım yazmayı teşvik edin; adımları atlanmış hızlı bir çözüm yerine yavaş ama düzenli bir çözüm daha değerlidir.',
      },
      kesirler: {
        need: {
          student:
            'Aynı sayıyı üç biçimde göstermeyi çalış: kesir, ondalık gösterim ve yüzde (ör. 1/2 = 0,5 = %50). Denk kesirleri bulurken pay ve paydayı aynı sayıyla çarptığını bir şekille kontrol et. Kesirleri ve ondalık sayıları bir sayı doğrusuna yerleştirerek karşılaştır; virgülden sonra daha çok basamağı olan sayının daha büyük olmadığını göreceksin.',
          parent:
            'Çocuğunuzla aynı sayının farklı gösterimlerini konuşabilirsiniz: 1/2, 0,5 ve %50 aynı değerdir. İndirim etiketleri ve tarifler bu gösterimleri gündelik hayatta görmesi için iyi fırsatlardır. Kesirleri ve ondalık sayıları bir sayı doğrusuna yerleştirmek karşılaştırmayı kolaylaştırır.',
        },
        action: {
          student: 'Bu hafta küçük kartlar hazırla: her kartın bir yüzüne bir kesir, öteki yüzüne ondalık ve yüzde gösterimini yaz; her gün kartlarla kendini sına.',
          parent: 'Bu hafta çocuğunuzla indirim etiketlerini inceleyin; "%25 indirim" ifadesinin kesir olarak ne demek olduğunu birlikte bulun.',
        },
        approach: 'Kesirleri, ondalık gösterimi ve yüzdeyi aynı fikrin farklı yazılışları olarak anlatın; kuraldan önce anlamı konuşun.',
      },
      geometri: {
        need: {
          student:
            'Alan ile çevreyi karıştırmamak için ikisini kareli kâğıtta çiz: çevre şeklin etrafındaki çizginin uzunluğu, alan ise içindeki kare sayısıdır. Açıları önce tahmin et (dar mı, geniş mi?), sonra iletkiyle ölç. Çemberin merkezini, yarıçapını ve çapını bir pergelle çizerek göster.',
          parent:
            'Çocuğunuzun alan ile çevreyi kareli kâğıtta çizerek ayırt etmesine yardım edebilirsiniz: çevre şeklin etrafındaki çizginin uzunluğu, alan içindeki kare sayısıdır. Bir odanın taban alanını ya da bir masanın çevresini birlikte hesaplamak bu kavramları gündelik hayata bağlar.',
        },
        action: {
          student: 'Bu hafta kareli kâğıda çevresi aynı ama alanı farklı iki dikdörtgen çiz; hangisinin alanının daha büyük olduğunu bul ve nedenini yaz.',
          parent: 'Bu hafta çocuğunuzla bir odanın ya da balkonun uzunluğunu ve genişliğini ölçün; çevresini ve alanını ona hesaplatın.',
        },
        approach: 'Cetvel, iletki ve pergel kullanmasına zaman tanıyın; düzgün bir çizim konuyu anlamayı kolaylaştırır.',
      },
      veri: {
        need: {
          student:
            'Daire grafiğinde her dilimin bütünün bir parçası olduğunu hatırla: bütün dilimler bir araya gelince bütünü oluşturur. Olasılığı bir çizgi üzerinde düşün: imkânsız olay 0, kesin olay 1, ikisinin arası ne kadar olası olduğudur. Bir zarı ya da bozuk parayı birkaç kez atıp sonuçları kaydetmek olasılığı somutlaştırır.',
          parent:
            'Çocuğunuzla daire grafiklerinde her dilimin bütünün bir parçası olduğunu konuşabilirsiniz. Olasılığı somutlaştırmak için birlikte zar ya da bozuk para atıp sonuçları kaydetmek ve "Bu olay imkânsız mı, kesin mi, olası mı?" diye sormak işe yarar.',
        },
        action: {
          student: 'Bu hafta bir bozuk parayı 20 kez at, yazı ve turaları say; sonucu bir sütun grafiğiyle göster ve beklediğinle karşılaştır.',
          parent: 'Bu hafta çocuğunuzla gündelik olaylar için "imkânsız, olası ya da kesin" tahmin oyunu oynayın (ör. "Yarın güneş doğacak.").',
        },
        approach: 'Grafikleri ve olasılığı tahmin oyunlarıyla eğlenceli hâle getirin; yanlış tahmini de öğrenmenin parçası olarak görün.',
      },
    },
    // 7. sınıf formu: 6. sınıf konuları.
    6: {
      sayilar: {
        need: {
          student:
            'Bölünebilme kurallarını ezberlemek yerine birkaç sayıda dene ve neden işe yaradığını gör (ör. 3 ile bölünebilmede rakamlar toplamı). Asal çarpanlara ayırmayı bir çarpan ağacıyla çiz. Ortak bölen ve ortak kat problemlerinde önce sorunun ne istediğini belirle. "Eşit gruplara bölmek" ortak bölen, "aynı anda buluşmak" ortak kat ister.',
          parent:
            'Çocuğunuzun bölünebilme kurallarını birkaç sayıda deneyerek neden işe yaradığını görmesi ezberden daha kalıcıdır. Ortak bölen ve ortak kat problemlerinde sorunun ne istediğini ayırt etmesi önemlidir: "eşit gruplara bölmek" mi, "aynı anda buluşmak" mı? İki otobüsün aynı anda kalkması gibi gündelik örnekler bunu kolaylaştırır.',
        },
        action: {
          student: 'Bu hafta her gün iki sayıyı çarpan ağacıyla asal çarpanlarına ayır, ortak bölenlerini ve ortak katlarını bul; birini gündelik bir probleme dönüştür.',
          parent: 'Bu hafta çocuğunuza gündelik bir ortak kat sorusu sorun ve çözümünü anlatmasını isteyin. Örnek: "İki arkadaş bugün kütüphanede karşılaştı. Biri 6 günde bir, öteki 8 günde bir gidiyor. Kaç gün sonra yine aynı gün gelirler?"',
        },
        approach: 'Kuralları ezberletmek yerine "Bu neden doğru?" diye sorun; birkaç örnekle denemesine fırsat verin.',
      },
      kesirler: {
        need: {
          student:
            'Kesirlerle işlemleri bir şekil ya da sayı doğrusuyla kontrol et: bir sayıyı 1’den küçük bir kesirle çarpınca sonucun küçüldüğünü, böyle bir kesre bölünce büyüdüğünü gör. Bir kesrin aynı zamanda bir bölme olduğunu hatırla (3/4 = 3 ÷ 4). Yüzde problemlerinde önce yüzdenin neyin yüzdesi olduğunu bul, sonra hesapla.',
          parent:
            'Çocuğunuzun kesirlerle işlemleri bir şekil ya da sayı doğrusuyla kontrol etmesini destekleyin; 1’den küçük bir kesirle çarpınca sonucun küçüldüğünü görmesi önemlidir. Bir kesrin aynı zamanda bir bölme olduğunu konuşabilirsiniz (3/4 = 3 ÷ 4). Yüzde problemlerinde yüzdenin neyin yüzdesi olduğunu konuşmak da bu alanı sağlamlaştırır.',
        },
        action: {
          student: 'Bu hafta bir tarifin ölçülerini yarıya ve bir buçuk katına göre yeniden hesapla; sonuçları kesir ve ondalık gösterimle yaz.',
          parent: 'Bu hafta çocuğunuzla bir tarifin ölçülerini yarıya indirin ya da artırın: ilk hesabı birlikte yapın, sonrakileri ona bırakın.',
        },
        approach: 'Mutfak, alışveriş ve indirimler gibi gündelik durumlarda kesir ve yüzde hesaplarını ona bırakın.',
      },
      cebir: {
        need: {
          student:
            'Bir harfin bilmediğimiz bir sayının yerini tuttuğunu düşün ve sözel ifadeleri adım adım cebire çevir (ör. "bir sayının 3 fazlası", yani x + 3). Bir ifadenin değerini bulurken harfin yerine sayıyı parantez içinde yaz. Örüntülerde adım numarasını ve terimi bir tabloya yazarak kuralı bul.',
          parent:
            'Çocuğunuzla sözel ifadeleri cebire çevirmeyi oyunlaştırabilirsiniz (ör. "yaşımın iki katı", yani 2 × y). Bir harfin bilmediğimiz bir sayının yerini tuttuğunu ve örüntülerde adım numarası ile terimi bir tabloya yazmanın kuralı bulmayı kolaylaştırdığını konuşabilirsiniz.',
        },
        action: {
          student: 'Bu hafta her gün iki sözel ifadeyi cebirsel ifadeye çevir ve harfe bir sayı vererek değerini hesapla.',
          parent: 'Bu hafta çocuğunuzla "Aklımdan bir sayı tuttum" oyunu oynayın ve tuttuğunuz sayıyı bir denklemle bulmasını isteyin.',
        },
        approach: 'Harflerle çalışmanın bir oyun gibi olabileceğini gösterin; yanlış kurduğu bir ifadeyi birlikte sözel olarak okuyun.',
      },
      geometri: {
        need: {
          student:
            'Formülleri ezberlemek yerine nereden geldiğini gör: bir paralelkenarı kesip dikdörtgene dönüştürerek alanının taban × yükseklik olduğunu göster. Üçgenin iç açılarının toplamının 180 derece olduğunu, kâğıttan bir üçgenin köşelerini yırtıp yan yana koyarak kontrol et. Alan birimlerini çevirirken bir metrekarenin içine kaç santimetrekare sığdığını çizerek düşün.',
          parent:
            'Çocuğunuzun formüllerin nereden geldiğini görmesi ezberden daha kalıcıdır. Bir paralelkenarı kesip dikdörtgene dönüştürmek alan formülünü gösterir. Kâğıttan bir üçgenin köşelerini yan yana koymak da açılar toplamını gösterir. Yuvarlak bir nesnenin çevresini iple ölçüp çapıyla karşılaştırmak çemberin uzunluğunu somutlaştırır.',
        },
        action: {
          student: 'Bu hafta yuvarlak üç nesnenin (bardak, tabak, saat) çevresini iple, çapını cetvelle ölç; her biri için çevrenin çapa oranını hesapla.',
          parent: 'Bu hafta çocuğunuzla kâğıttan bir üçgen kesin; köşelerini yırtıp yan yana koyarak açılar toplamını birlikte görün.',
        },
        approach: 'Kesme, katlama ve ölçme gibi elle yapılan etkinliklere zaman tanıyın; formülün nereden geldiğini size anlatmasını isteyin.',
      },
      veri: {
        need: {
          student:
            'Ortalamayı "herkese eşit dağıtılınca düşen pay" olarak düşün; ortancayı bulmadan önce verileri mutlaka küçükten büyüğe sırala. Veriye çok büyük ya da çok küçük bir değer eklediğinde ortalamanın ve ortancanın nasıl değiştiğini dene. Deneysel olasılıkta deneme sayısı arttıkça sonucun nasıl değiştiğini kaydet.',
          parent:
            'Çocuğunuzla ortalamayı "herkese eşit dağıtılınca düşen pay" olarak konuşabilirsiniz; ortancayı bulmadan önce verilerin sıralanması gerektiğini hatırlatın. Evdeki bir haftalık verilerden (ör. uyku saatleri) ortalama ve ortanca hesaplamak bu kavramları anlamlı kılar.',
        },
        action: {
          student: 'Bu hafta bir veriyi her gün kaydet (ör. kaç dakika yürüdüğün); hafta sonunda ortalamasını ve ortancasını hesapla ve ikisini karşılaştır.',
          parent: 'Bu hafta evdeki bir haftalık veriyi (ör. uyku saatleri) birlikte toplayın ve ortalamasını çocuğunuza hesaplatın.',
        },
        approach: 'Verileri gündelik hayattan seçin; hesaplanan ortalamanın ne anlama geldiğini birlikte yorumlayın.',
      },
    },
    // 8. sınıf formu: 7. sınıf konuları.
    7: {
      sayilar: {
        need: {
          student:
            'Tam sayıları bir sayı doğrusunda düşün: sağa gittikçe büyür, solda kalan daha küçüktür (−8, −3’ten küçüktür). Toplama ve çıkarmada sayı doğrusunda hareket ederek sonucu kontrol et. Çarpma ve bölmede işaret kuralını birkaç örnekle yazıp örüntüyü gör. Rasyonel sayılarla işlem yaparken kesir kurallarının aynen geçerli olduğunu hatırla.',
          parent:
            'Çocuğunuzla tam sayıları bir sayı doğrusu ya da termometre üzerinden konuşabilirsiniz: sıfırın altındaki sıcaklıklar negatif sayılara iyi bir örnektir (−8 derece, −3 dereceden daha soğuktur). Toplama ve çıkarmayı sayı doğrusunda hareket ederek kontrol etmesi işaret hatalarını azaltır.',
        },
        action: {
          student: 'Bu hafta birkaç şehrin hava durumundaki en düşük sıcaklıkları bul, küçükten büyüğe sırala ve aralarındaki farkları hesapla.',
          parent: 'Bu hafta hava durumu ya da asansördeki kat numaraları gibi örneklerle çocuğunuza negatif sayılarla kısa sorular sorun.',
        },
        approach: 'Negatif sayıları sıcaklık, borç ve kat numarası gibi tanıdık durumlarla anlatın.',
      },
      oran: {
        need: {
          student:
            'Oranı bir tabloyla çalış: bir miktar iki katına çıkınca öteki de iki katına çıkıyorsa doğru orantıdır. Problemleri önce birim değeri bularak çöz (ör. önce bir tanesinin fiyatını bul). Art arda yüzde değişimlerinde ikinci yüzdenin yeni değer üzerinden hesaplandığını unutma: %20 zammın ardından yapılan %20 indirim fiyatı başa döndürmez.',
          parent:
            'Çocuğunuzla oranı tarif ve fiyatlarla çalışabilirsiniz: bir miktar iki katına çıkınca ötekinin de iki katına çıkması doğru orantıdır. Önce birim değeri bulmak (bir tanesinin fiyatı) problemleri kolaylaştırır. Art arda yapılan zam ve indirimin fiyatı başa döndürmediğini bir etiket örneğiyle birlikte hesaplayabilirsiniz.',
        },
        action: {
          student: 'Bu hafta markette aynı ürünün iki farklı boyuttaki paketinin birim fiyatını hesapla ve hangisinin daha ucuz olduğunu bul.',
          parent: 'Bu hafta alışverişte aynı ürünün iki farklı paketinin birim fiyatını çocuğunuzla birlikte karşılaştırın.',
        },
        approach: 'Fiyat karşılaştırması ve indirim gibi gerçek kararlarda hesabı ona bırakın; sonucu birlikte değerlendirin.',
      },
      cebir: {
        need: {
          student:
            'Benzer terimleri renklerle işaretleyerek topla (ör. bütün x’li terimleri aynı renkle). Bir denklemi terazi gibi düşün ve her adımda iki tarafa aynı işlemi yaptığını yaz. Bulduğun değeri denklemde yerine koyarak kontrol et. Problemlerde önce bilinmeyene bir harf ver, sonra cümleyi denkleme çevir.',
          parent:
            'Çocuğunuzun bir denklemi terazi gibi düşünmesini ve her adımda iki tarafa aynı işlemi yaptığını yazmasını destekleyin. Bulduğu sonucu denklemde yerine koyarak kontrol etmesi kendi hatasını görmesini sağlar.',
        },
        action: {
          student: 'Bu hafta her gün iki denklem çöz ve bulduğun değeri denklemde yerine koyarak kontrol et; birini gündelik bir probleme dönüştür.',
          parent: 'Bu hafta çocuğunuzdan bir denklemin çözümünü size adım adım anlatmasını ve sonucunu yerine koyarak kontrol etmesini isteyin.',
        },
        approach: 'Kontrol etmeyi alışkanlık hâline getirmesini destekleyin; hatasını kendisinin bulması öğrenmeyi güçlendirir.',
      },
      geometri: {
        need: {
          student:
            'Dairenin alanı ile çemberin uzunluğunu karıştırmamak için birinin "içini kaplamak", ötekinin "etrafını dolanmak" olduğunu düşün ve birimlerine bak (cm² ve cm). Paralel doğrularda eş açıları aynı renkle işaretle. Prizmanın hacmini taban alanını kat kat üst üste koymak gibi düşün: taban alanı × yükseklik.',
          parent:
            'Çocuğunuzla dairenin alanının "içini kaplamak", çemberin uzunluğunun ise "etrafını dolanmak" olduğunu ve birimlerinin farklı olduğunu (cm² ve cm) konuşabilirsiniz. Bir kutunun ya da akvaryumun hacmini birlikte hesaplamak prizma konusunu somutlaştırır.',
        },
        action: {
          student: 'Bu hafta evde kutu biçiminde üç nesne bul; ölçülerini al, hacimlerini hesapla ve hangisinin daha çok şey alacağını önce tahmin edip sonra kontrol et.',
          parent: 'Bu hafta çocuğunuzla bir kutunun ya da bir su deposunun hacmini birlikte hesaplayın.',
        },
        approach: 'Ölçme ve hesaplamayı gerçek nesnelerle yapın; birimleri doğru yazmanın neden önemli olduğunu konuşun.',
      },
      veri: {
        need: {
          student:
            'Çizgi grafiğinde zaman içindeki değişime bak: en çok nerede arttığını ve azaldığını bul. Ortalama, ortanca ve tepe değerin ne zaman farklı sonuç verdiğini bir veri setinde dene; çok büyük bir değer eklediğinde hangisinin daha çok değiştiğini gör.',
          parent:
            'Çocuğunuzla haberlerdeki çizgi grafiklerini birlikte okuyabilirsiniz: değişimin nerede arttığını ve azaldığını sorun. Ortalama, ortanca ve tepe değerin farklı durumlarda farklı sonuç verdiğini gerçek bir veriyle (ör. bir haftalık harcamalar) göstermek işe yarar.',
        },
        action: {
          student: 'Bu hafta bir veriyi her gün kaydedip çizgi grafiğini çiz; ortalamasını, ortancasını ve tepe değerini bul ve hangisinin veriyi en iyi özetlediğini yaz.',
          parent: 'Bu hafta bir haberdeki çizgi grafiğini çocuğunuzla inceleyin ve grafikten çıkardığı sonucu size anlatmasını isteyin.',
        },
        approach: 'Grafikleri sorgulamayı öğretin: "Bu grafik neyi gösteriyor, neyi göstermiyor?"',
      },
    },
  },
  studyTitle: { you: 'Konu alanlarına göre nasıl çalışabilirsin?', parent: 'Çocuğunuz konu alanlarına göre nasıl çalışabilir?' },
  studyIntro: {
    student:
      'Alanlar düzeylerine göre sıralandı: önce öncelikli, sonra pekiştirilmeli, en son sağlam alanlar. Her alanda yalnızca soru çözmek değil, konunun anlamını şekil, sayı doğrusu ya da gerçek nesnelerle görmek de önemli.',
    parent:
      'Alanlar düzeylerine göre sıralandı: önce öncelikli, sonra pekiştirilmeli, en son sağlam alanlar. Her alanda yalnızca soru çözmek değil, konunun anlamını şekil, sayı doğrusu ya da gerçek nesnelerle görmek de önemlidir.',
  },
  routine: {
    title: 'Haftalık çalışma düzeni',
    intro: {
      student: 'Kısa ve düzenli çalışma, uzun ve seyrek çalışmadan daha etkilidir:',
      parent: 'Kısa ve düzenli çalışma, uzun ve seyrek çalışmadan daha etkilidir:',
    },
    items: {
      student: [
        'Hafta içi her gün 15–20 dakika: önce bir önceki gün çalıştığın konudan iki soruyu kitaba bakmadan çöz, sonra yeni konuya geç.',
        'Haftada bir gün: o haftanın bütün konularından karışık bir soru seti çöz.',
        'Bir soruyu çözünce "Bunu bir arkadaşıma nasıl anlatırdım?" diye kendine sor ve bir iki cümleyle açıkla.',
        'Bulduğun sonucun mantıklı olup olmadığını yaklaşık bir tahminle kontrol et.',
      ],
      parent: [
        'Hafta içi her gün 15–20 dakikalık kısa bir çalışma zamanı belirleyin; çalışmaya önceki günün konusundan iki soruyla başlamasını önerin.',
        'Haftada bir gün o haftanın bütün konularından karışık bir soru seti çözmesini destekleyin.',
        'Bir soruyu çözünce size nasıl çözdüğünü anlatmasını isteyin; anlatmak, anlamayı derinleştirir.',
        'Bulduğu sonucun mantıklı olup olmadığını yaklaşık bir tahminle kontrol etmesini hatırlatın.',
      ],
    },
    note: {
      student:
        'Bu düzen, araştırmalarla desteklenen üç ilkeye dayanır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak ve farklı konuları karıştırarak çalışmak.',
      parent:
        'Bu düzen, araştırmalarla desteklenen üç ilkeye dayanır: öğrenileni kitaba bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak ve farklı konuları karıştırarak çalışmak.',
    },
  },
  firstWeek: {
    wrong: {
      student:
        'Raporundaki yanlış yaptığın ya da “Bilmiyorum” dediğin soruları her gün en çok ikişer tane deftere yaz. Her biri için sorunun konusunu ve doğru çözümü yaz.',
      parent:
        'Raporu çocuğunuzla birlikte inceleyin. Yanlış yapılan ya da “Bilmiyorum” denen soruları her gün en çok ikişer tane deftere yazmasını isteyin: sorunun konusu ve doğru çözümü.',
    },
    // Yalnızca yanlış cevap varsa ve cevaplar tahmin değilse: hatanın nedeni.
    reason: {
      student:
        'Yanlış yaptığın sorularda nedenini de not et: işlem hatası mı, kavram mı, soruyu yanlış okuma mı? Hafta sonunda en çok hangi nedenin tekrarlandığına bak.',
      parent: 'Yanlış yapılan sorularda nedenini de birlikte konuşun: işlem hatası mı, kavram mı, soruyu yanlış okuma mı?',
    },
    none: {
      student: 'Bütün soruları doğru yaptın. Bu hafta her gün biraz daha zor bir soru seç ya da kendin bir soru yaz ve çözümünü açıkla.',
      parent: 'Çocuğunuz bütün soruları doğru yaptı. Bu hafta ondan her gün biraz daha zor bir soru seçmesini ya da kendi sorusunu yazıp çözümünü size anlatmasını isteyin.',
    },
  },
  extraWeeks: [
    {
      title: 'Zorlayıcı problemler',
      text: {
        student: 'Bu hafta her gün günlük hayattan çok adımlı bir problem çöz; çözümünü birine anlatır gibi adım adım yaz.',
        parent: 'Bu hafta çocuğunuza her gün günlük hayattan çok adımlı bir problem önerin ve çözümünü size adım adım anlatmasını isteyin.',
      },
    },
    {
      title: 'Karışık tekrar',
      text: {
        student: 'Bu hafta her gün farklı konulardan üç soru çöz; her soruda önce hangi yöntemi kullanacağını söyle, sonra çöz.',
        parent: 'Bu hafta çocuğunuzdan her gün farklı konulardan üç soru çözmesini ve her birinde hangi yöntemi neden seçtiğini anlatmasını isteyin.',
      },
    },
  ],
  lastWeek: {
    student:
      'Dört hafta boyunca çalıştığın konulardan karışık on soru çöz; soruları kitabından ya da öğretmeninden isteyebilirsin. Hangi konuların artık kolay geldiğini, hangilerinde hâlâ takıldığını yaz ve öğretmeninle paylaş.',
    parent:
      'Dört haftanın sonunda çocuğunuzla hangi konuların artık kolay geldiğini, hangilerinde hâlâ zorlandığını konuşun ve bu notları matematik öğretmeniyle paylaşın.',
  },
  approachSolid: [
    {
      title: 'Merak',
      text: 'Matematiği yalnızca derste değil, oyunlarda ve gündelik kararlarda da kullanmasına fırsat verin; bilmediği bir şeyi birlikte araştırın.',
    },
    {
      title: 'Zorluk',
      text: 'Biraz zorlayıcı problemlerle karşılaşmasını destekleyin; hemen çözemediği bir soruyla uğraşmanın da öğrenmenin parçası olduğunu konuşun.',
    },
  ],
  nextTests: ['calisma-aliskanliklari', 'okuma-hizi-ve-anlama'],
  nextPurpose: {
    you: 'çalışma alışkanlıklarını ve okuduğunu anlama becerini de görmek',
    parent: 'çocuğunuzun çalışma alışkanlıklarını ve okuduğunu anlama becerisini de görmek',
  },
  links: [{ label: 'Etkili ders çalışma yöntemleri', href: '/rehber/etkili-ders-calisma-yontemleri' }],
  sources: [KAYNAK.dunlosky, KAYNAK.roediger, KAYNAK.cepeda, KAYNAK.rohrer],
};
