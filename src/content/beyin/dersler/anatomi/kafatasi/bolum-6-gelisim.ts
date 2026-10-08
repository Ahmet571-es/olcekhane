import type { DersBolumu } from '../../../types';

/** 6. bölüm: bıngıldaklar, kafatasının büyümesi, kraniosinostoz, pozisyonel plajiyosefali ve yaşlanma. */
export const bebeklikten: DersBolumu = {
  id: 'bebeklikten-yasliliga',
  baslik: 'Bebeklikten yaşlılığa: büyüyen kafatası',
  bloklar: [
    {
      tur: 'metin',
      md: `Yeni doğmuş bir bebeğin kafatası yetişkininkinden çok farklıdır: kemikleri henüz tam kemikleşmemiş, dikişleri kapanmamıştır (OpenStax 6.4). Kemiklerin köşelerinde zarla örtülü yumuşak aralıklar, **bıngıldaklar** (*fonticuli*) vardır. Bıngıldaklar iki işe yarar: doğumda kafatasının doğum kanalından geçerken biçim değiştirmesine, doğumdan sonra da beyin büyüdükçe kafatasının büyümesine izin verirler (OpenStax 7.5).

Yenidoğanda **altı bıngıldak** bulunur: bir ön, bir arka, iki sfenoid ve iki mastoid (Direk ve ark., 2022). En büyüğü, iki alın ve iki yan kafa kemiği arasındaki eşkenar dörtgen biçimli **ön bıngıldaktır**. Term bebeklerle yapılan bir meta-analizde ön bıngıldağın ortalama boyutu 2,58 cm bulundu; erkek bebeklerde kızlardan anlamlı olarak büyüktü (Oumer ve ark., 2021). Bıngıldaklar ilk yılda belirgin küçülür (OpenStax 9.2) ve iki yaşına kadar kaybolur (OpenStax 7.5). Ön bıngıldağın 12–18. aylar civarında kapanması beklenir (Johal ve ark., 2017), ama boyutu ve kapanma yaşı çocuktan çocuğa çok değişir (Duc ve Largo, 1986).

Doğumda beyin kutusu ve göz çukurları, çenelere ve yüzün alt kısmına göre orantısız büyüktür; kulağın arkasındaki mastoid çıkıntı henüz oluşmamıştır (OpenStax 7.5). İlk iki yılda beyin ve kafatası çok hızlı büyür (Kim ve ark., 2016): baş çevresi ilk üç ayda ayda ortalama 2 cm, 3–6. aylarda ayda 1 cm, bebekliğin son altı ayında ayda 0,5 cm artar; ilk yılın toplamı ortalama 12 cm’dir (Jones ve ark., 2026). Kafatasını büyüten, alttaki büyüyen beyindir: kubbedeki kemik büyümesinin yönünü büyük ölçüde beynin kuvvetleri belirler (Kajdic ve ark., 2018; Spazzapan ve Velnar, 2024).

Yaşlandıkça süreç tersine işler: ileri yaşta sagittal, koronal ve lambdoid dikişler kemikleşip kaynaşmaya başlar ve çizgileri giderek silinir (OpenStax 9.2).`,
    },
    {
      tur: 'animasyon',
      ad: 'bingildaklar',
      baslik: 'Bıngıldaklar nasıl kapanır?',
      aciklama:
        'Yenidoğan kafatasına yukarıdan ve yandan bak; yaşı değiştirerek bıngıldakların küçülüp kapanmasını ve yerlerinde kalan kraniometrik noktaları izle.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Bıngıldak ne zaman uyarı verir?',
      md: 'Bıngıldak bebekten bebeğe değişse de normalde düzdür ve dokununca serttir. Vücut sıvı kaybettiğinde (dehidratasyon) çöker, bazı enfeksiyonlarda kabarabilir (Lipsett ve ark., 2023). Kafasını çarpmış bir bebekte bıngıldağın gergin olması, bir saat içinde kafa BT’si çekilmesini gerektiren işaretlerdendir (NICE, 2023). Bu yüzden bıngıldağı belirgin çökük ya da gergin görünen bir bebeğin bir sağlık çalışanınca değerlendirilmesi gerekir.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Altı bıngıldağa ek olarak sagittal dikiş üzerinde küçük bir **üçüncü bıngıldak** (sagittal bıngıldak) bulunabilir: Güney Hindistan’da yapılan bir anatomi çalışmasının aktardığına göre olguların %50–80’inde görülür ve genellikle ilk iki yılda kapanır. Yan kafa kemiklerinde görülebilen küçük parietal delikler bu bıngıldaktan kaynaklanır (Murlimanju ve ark., 2015).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Altı bıngıldak:** ön (en büyük, 12–18. aylarda kapanır), arka (ilk aylarda kapanır), iki sfenoid ve iki mastoid. Çoğunlukla iki yaşına kadar hepsi kapanır.\n\n**Kafatasını büyüten beyindir.** Baş çevresi ilk yılda ortalama 12 cm artar.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kraniosinostoz**, bir ya da birden çok dikişin erken kaynaşmasıdır (OpenStax 7.5). ABD’de 2100–2500 canlı doğumda 1 görülür (Stanton ve ark., 2022); erkeklerde daha sıktır (OpenStax 7.5). Olguların %85–95’i bir sendromun parçası değildir, %5–15’i sendromiktir (Spazzapan ve Velnar, 2024). Tek dikişin erken kaynaşmasına **basit**, birden çok dikişinkine **karmaşık** kraniosinostoz denir. Raşitizm ve hipotiroidi gibi sistemik hastalıklar, beyin büyümesinin yetersiz kaldığı mikrosefali ya da hidrosefali için şant takılması da dikişlerin erken kapanmasına yol açabilir; buna **ikincil** kraniosinostoz denir (Kajdic ve ark., 2018).

Baş biçimini **Virchow yasası** açıklar: kaynaşan dikişe dik yönde büyüme durur, hızla büyüyen beyin yeri başka yerde bulur ve telafi edici büyüme dikişe paralel yönde olur. Virchow bu modern kuramı 1851’de öne sürdü (Spazzapan ve Velnar, 2024). Bu yüzden baş biçimine bakarak hangi dikişin kaynaştığı çoğu zaman tahmin edilebilir.`,
    },
    {
      tur: 'animasyon',
      duzey: 'lisans',
      ad: 'kraniosinostoz',
      baslik: 'Hangi dikiş, hangi baş biçimi?',
      aciklama:
        'Yukarıdan bakılan bebek başı. Bir dikiş seçince erken kaynaşan dikiş kırmızıya döner ve baş, Virchow yasasına göre biçim değiştirir. Son seçenek dikişlerin açık olduğu pozisyonel plajiyosefalidir.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kraniosinostoz türleri',
      sutunlar: ['Kaynaşan dikiş', 'Baş biçimi', 'Sıklık', 'Ayırt ettiren ipuçları'],
      satirlar: [
        [
          'Sagittal',
          'Skafosefali: uzun, dar baş; alın kabarık, ense çıkık, kaynaşan dikiş boyunca sırt',
          'En sık tip: kaynaklara göre %40–60',
          'Erkeklerde 3,5 kat sık. Çoğu zaman muayeneyle tanınır; kaynaşan dikişi üç boyutlu BT gösterir.',
        ],
        [
          'Metopik',
          'Trigonosefali: üçgen alın, göz çukurları birbirine yakın (hipotelorizm)',
          '%5–30',
          'Olguların üçte biri sendromiktir; beyin ve damağın orta hat anomalileri eşlik edebilir.',
        ],
        [
          'Tek koronal',
          'Ön plajiyosefali: alnın iki yanı asimetrik',
          'Koronal tutulum %15–25',
          'Etkilenen yanda göz çukuru üst kenarı yükselir (grafide Harlequin işareti); kızlarda 2 kat sık.',
        ],
        ['Çift koronal', 'Brakisefali: kısa, geniş baş; şakaklara doğru telafi büyümesi', '—', 'Çoğunda bilinen bir genetik neden vardır.'],
        [
          'Tek lambdoid',
          'Arka plajiyosefali: yukarıdan yamuk (trapez) görünüm',
          'En seyrek: %5’ten az',
          'Aynı yanda ense basık, karşı yanda alın ve ense kabarık; arka bıngıldak karşı yana kaymış.',
        ],
        [
          'Çok dikiş',
          'Oksisefali (dar, kule gibi yüksek baş) ya da yonca yaprağı kafatası',
          'Seyrek',
          'Sagittal ve iki lambdoid dikişin birlikte kaynaşmasına “Mercedes-Benz sinostozu” denir.',
        ],
      ],
      not: 'Kaynaklar: Stanton ve ark. (2022); Kajdic ve ark. (2018); Spazzapan ve Velnar (2024); Kim ve ark. (2016); OpenStax 7.5. Sıklıklar kaynaklar arasında farklıdır; aralık olarak verildi.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Yamuk baş: dikiş mi, yatış mı?',
      md: `Bebeklerin sırtüstü yatırılması ani bebek ölümünü önlemek için yaygınlaştıktan sonra başın arkasında basıklık daha sık görülmeye başladı (Ita ve ark., 2024). **Pozisyonel plajiyosefalide** dikiş kaynaşmamıştır: normal ve esnek kafatası dış basınçla şekil değiştirir (Unnithan ve Sina, 2025). Kanada’da yapılan bir kohortta 7–12 haftalık bebeklerin %46,6’sında plajiyosefali vardı; bunların %63,2’sinde sağ taraf etkilenmişti ve %78,3’ü hafifti (Mawji ve ark., 2013). Ense asimetrisinin lambdoid sinostozdan çok daha sık nedenidir (Stanton ve ark., 2022).

**İkisini ayırmak:** Pozisyonel plajiyosefalide aynı yandaki kulak ve alın öne kayar ve baş yukarıdan bakınca **paralelkenar** biçimindedir (Kajdic ve ark., 2018). Lambdoid sinostozda ise aynı yanda ense basık, karşı yanda alın ve ense kabarıktır; arka bıngıldak karşı yana kaymıştır, kafatası tabanı eğiktir ve baş yukarıdan **yamuk** görünür (Kim ve ark., 2016).

**Tedavi:** Pozisyonel plajiyosefalinin etkileri esas olarak görünümle ilgilidir ve ameliyat gerektirmez (Kajdic ve ark., 2018). Orta-ağır baş deformitesi olan bebeklerde yapılan randomize kontrollü çalışmada kask tedavisi doğal seyirden üstün bulunmadı: tam düzelme kask grubunda %26, izlenen grupta %23’tü. Yazarlar sağlıklı bebeklerde kaskın standart tedavi olarak kullanılmamasını önerdi (van Wijk ve ark., 2014).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Kafa içi basınç, görme ve gelişim',
      md: `Kraniosinostoz yalnızca bir görünüm sorunu değildir. Birden çok dikişin tutulduğu olguların yaklaşık yarısında, tek dikişlilerin %15–20’sinde kafa içi basınç artar (Choi ve ark., 2016). Basınç artışı yalnızca dar kafatasından değil, BOS birikimine yol açan toplardamar anomalilerinden de kaynaklanabilir; sendromik hastaların %12–15’inde hidrosefali görülür. Görme sorunları sendromik hastalarda (%27) sendromik olmayanlardan (%17) daha sıktır (Stanton ve ark., 2022). Basıncın değerlendirilmesinde göz muayenesi çok önemlidir: basınç artışında optik diskte ödem (papilödem) görülür (Kajdic ve ark., 2018). Ağır olgularda düz grafide iç tablada beyin kıvrımlarının izleri, yani “dövme bakır” görünümü belirir (Kim ve ark., 2016).

Sendromik olmayan kraniosinostozda zekâ uzun vadede genellikle normal sınırlarda kalır (Stanton ve ark., 2022). Yine de izole sagittal sinostozlu, hidrosefalisi ve kafa içi basınç artışı olmayan çocukların %30–50’sinde ameliyata karşın bazı nörobilişsel sorunlar görülür; bunlar en çok dil edinimi, yazma ve okumadadır (Spazzapan ve Velnar, 2024). Metopik, tek koronal ya da lambdoid sinostozlu çocuklarda öğrenme güçlüğü olasılığı sagittal sinostozdakinden yüksektir (Kajdic ve ark., 2018).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Dikişleri görmek: BT, kara kemik MR ve ultrason',
      md: `Kaynaşmış dikiş düz grafide ya da BT’de dikişin çevresinde sertleşme (skleroz), düzleşme, girinti-çıkıntıların azalması, kemik köprü ya da dikişin hiç görülmemesi biçiminde görünür (Kim ve ark., 2016). Kraniosinostoz tanısında üç boyutlu yeniden yapılandırmalı **BT** en eksiksiz ve doğru yöntem kabul edilir; radyasyon kaygısına karşın karmaşık ya da sendromik olgularda ameliyat planı için kaçınılmaz olabilir (Cacciaguerra ve ark., 2021).

Radyasyonsuz seçenekler gelişiyor: **kara kemik** (black-bone) MR, kısa TE/TR ve düşük çevirme açısıyla kemiği ve dikişleri BT’ye benzer üç boyutlu görüntüleyebilir; tekniği ilk kez 2012’de Eley ve arkadaşları bildirdi. Dikişlerin **ultrasonla** incelenmesi ise ilk kez 1997–1998’de önerildi (Cacciaguerra ve ark., 2021).

Baş biçiminin sayısal bir ölçüsü **sefalik indekstir**: başın en geniş yerinin (euryon–euryon) glabella–opistokranion uzaklığına bölünüp 100 ile çarpılmasıyla bulunur (Marupudi ve ark., 2022). Sağlıklı çocuklarda yaklaşık %76–78’dir (Spazzapan ve Velnar, 2024); BT’ye dayalı normlarda ise ortalama 0–3. aylarda 0,85’ten 19–24. aylarda 0,81’e iner (Pindrik ve ark., 2016). Yöntemler farklı olduğu için değerler doğrudan karşılaştırılmamalıdır.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 3: Başı uzun ve dar bir bebek',
      oyku: `2,5 aylık bir erkek bebeği ailesi, başının doğumdan beri uzun ve dar olduğunu, giderek belirginleştiğini söyleyerek getiriyor. Muayenede alın öne doğru kabarık, ense geriye çıkık; başın tepesinde, orta hat boyunca ele gelen sert bir kemik sırt var. Başın genişliği uzunluğuna göre belirgin dar. Ön bıngıldak açık ama küçük. Gelişim basamakları yaşına uygun, göz dibi muayenesi normal.`,
      soru: 'Hangi dikiş erken kaynaşmış olabilir, baş neden bu biçimi almıştır ve tedavide zamanlama neden önemlidir?',
      cozum: `**Dikiş:** Uzun, dar baş, kabarık alın, çıkık ense ve orta hattaki sırt **sagittal sinostozu** düşündürür (Kim ve ark., 2016). En sık kraniosinostoz tipidir ve erkeklerde yaklaşık 3,5 kat daha sıktır (Kajdic ve ark., 2018).

**Biçim:** Virchow yasasına göre kaynaşan sagittal dikişe dik yönde, yani yana doğru büyüme durur; beyin dikişe paralel, önden arkaya doğru büyümeyi sürdürür (Spazzapan ve Velnar, 2024). Pozisyonel plajiyosefaliden farklı olarak burada dikiş gerçekten kapanmıştır; tanı üç boyutlu BT ile doğrulanır (Cacciaguerra ve ark., 2021).

**Zamanlama:** Kraniosinostozun tedavisi neredeyse tamamen cerrahidir (Stanton ve ark., 2022). Jimenez ve Barone’nin geliştirdiği **endoskopik şerit kraniektomi** ve ardından kask tedavisi için önerilen hedef yaş 3 aydan küçüktür; bu yöntemde ortalama kan kaybı 27 mL, kan nakli oranı %7, ameliyat süresi 57 dakika ve hastanede kalış 1,1 gündü; baş biçimini korumak için kask 12 ay kullanıldı (Marupudi ve ark., 2022). Endoskopik yöntemin başarısını asıl belirleyen, ameliyattan sonra takılan düzeltici kasktır (Spazzapan ve Velnar, 2024). Bir derlemeye göre endoskopi 6 aya kadar uygundur; sonrasında kemikler sertleştiği için açık cerrahi tercih edilir (Kajdic ve ark., 2018). Bu bebek 2,5 aylık olduğu için endoskopik seçenek için uygun penceredir.

**İzlem:** Tek dikişli olguların %15–20’sinde kafa içi basınç artabileceği için göz dibi muayenesi izlemde tekrarlanır (Choi ve ark., 2016; Kajdic ve ark., 2018); nörobilişsel gelişim de izlenmelidir (Spazzapan ve Velnar, 2024). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Sendromik kraniosinostozlar',
      sutunlar: ['Sendrom', 'Gen', 'Başlıca bulgular', 'Sıklık'],
      satirlar: [
        [
          'Apert',
          '*FGFR2* (çoğunlukla Ser252Trp ya da Pro253Arg)',
          'Çok dikişli kraniosinostoz, orta yüz geriliği, el ve ayak parmaklarının yapışıklığı (sindaktili); yeni mutasyonlarda ileri baba yaşı önemli risk etkenidir',
          '65.000–88.000 yenidoğanda yaklaşık 1',
        ],
        [
          'Crouzon',
          '*FGFR2*',
          'Tipik olarak koronal dikişler; brakisefali, orta yüz ve üst çene azgelişmişliği, sığ göz çukurları',
          'Milyonda yaklaşık 16 yenidoğan',
        ],
        [
          'Muenke',
          '*FGFR3* (belirli bir mutasyon)',
          'Birçoğunda koronal dikiş erken kaynaşır; baş biçimi bozulur, gözler aralıklı olabilir',
          '30.000 yenidoğanda 1; bütün kraniosinostozların yaklaşık %4’ü',
        ],
        [
          'Saethre–Chotzen',
          '*TWIST1*',
          'Bazı kafatası kemiklerinin erken kaynaşması; baş ve yüz biçimi etkilenir',
          '50.000 kişide 1 (tahmini)',
        ],
        [
          'Pfeiffer',
          '*FGFR2*; tip 1’in küçük bir kısmında *FGFR1*',
          'Tip 2’yi tip 3’ten yonca yaprağı biçimli kafatası ayırır',
          '100.000 kişide yaklaşık 1',
        ],
      ],
      not: 'Kaynaklar: Karsonovich ve Patel (2025); Azoury ve ark. (2017); Zeppieri ve ark. (2025); MedlinePlus Genetics (2017, 2019a, 2019b, 2020a, 2020b). Kaynaklar sıklıklarda tam uyuşmaz: Crouzon bir kaynakta “en sık sendrom” olarak anılırken Muenke için daha yüksek bir doğum sıklığı verilir.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kraniosinostoz cerrahisi: yöntem ve zamanlama',
      md: `Tüm kafatası kubbesinin yeniden biçimlendirilmesi ilk kez 1971’de Tessier tarafından tanımlandı. Jimenez ve Barone ise endoskopik şerit kraniektomiyi ameliyat sonrası kask tedavisiyle birleştirdi ve sagittal sinostozlu ilk dört hastalarını 1998’de yayımladı (Marupudi ve ark., 2022). Sagittal sinostozda bir uygulamada iki küçük kesiden biri ön bıngıldağın 1 cm arkasına, öteki lambdanın 1 cm önüne yapılır (Marupudi ve ark., 2022).

Kafa içi basınç artışı yoksa ameliyatın en uygun zamanı tartışmalıdır; 6–12. aylar kabul görür (Kajdic ve ark., 2018). Alın ve göz çukuru üst barının düzeltilmesi gereken olgularda (tek ya da çift koronal, metopik) ameliyat genellikle 10–12. aylara ertelenir (Buchanan ve ark., 2017). Güncel serilerin hepsinde kraniosinostoz cerrahisinde ölüm oranı %1’in altındadır (Spazzapan ve Velnar, 2024).

Genetik açıdan, nedeni hastaların yalnızca yaklaşık %20–30’unda bulunabilir ve bunların %86’sı tek gen değişikliğidir; kraniosinostoz 180’den fazla sendromla ilişkilidir ve *FGFR1*, *FGFR2* ve *FGFR3*’te işlev kazandıran mutasyonlar birçok sendromdan sorumludur. Annede tiroit hastalığı riski artırır (OR 2,47); gebelikte sigara içen annelerin çocuklarında kraniosinostoz %33 daha olasıdır. Sendromik olmayan olgularda nadir *SMAD6* ve sık *BMP2* varyantlarını içeren iki lokuslu bir kalıtım öne sürülmüştür (Stanton ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Dikişin kök hücreleri ve yeni bir dikiş yapmak',
      md: `Farede sütür mezenşimindeki **Gli1+ hücrelerin** kafa-yüz kemiklerinin başlıca kök hücre topluluğu olduğu gösterildi: bu hücreler yok edilince kraniosinostoz gelişti ve kafatasının büyümesi durdu; kraniosinostozlu *Twist1+/−* farelerin dikişlerinde de Gli1+ kök hücreler azalmıştı (Zhao ve ark., 2015). Aynı ekip daha sonra farede biyolojik olarak yıkılabilen bir malzemeyi mezenkimal kök hücrelerle birleştirip işlevsel bir dikişi yeniden oluşturdu: kafatası biçimi düzeldi, kafa içi basınç normale döndü ve nörobilişsel davranış bozuklukları geriledi (Yu ve ark., 2021).

İnsanda hastalığa yol açan değişikliklerin çok azı genin işlevini tamamen ortadan kaldırır; daha çok haployetmezlik, baskın işlev kazancı ve çekinik hipomorfik mutasyonlar gibi mekanizmalar öne çıkar (Twigg ve Wilkie, 2015). Evrim ve gelişim boyunca beyin ve kafatası biçimindeki değişiklikler birbirini izler; araştırmacılar beyin ile kafatasını “el ve eldiven” gibi birlikte gelişen bir bütün olarak inceliyor (Richtsmeier ve Flaherty, 2013).`,
    },
  ],
};
