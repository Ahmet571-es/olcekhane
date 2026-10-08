import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from './bolum-1-genel';

/** 4. bölüm: kafatası tabanının üç çukuru, delikleri ve deliklere bağlı klinik tablolar. */
export const kafatasininTabani: DersBolumu = {
  id: 'kafatasinin-tabani',
  baslik: 'Kafatasının tabanı: üç basamak ve delikler',
  bloklar: [
    {
      tur: 'metin',
      md: `Beynin altında kalan kemik zemine **kafatası tabanı** denir. İçeriden, yani yukarıdan bakınca bu zemin düz değildir: önden arkaya doğru basamak basamak derinleşen **üç çukurdan** oluşur ve her çukurun biçimi, içinde oturan beyin bölümünün biçimine uyar. Tabanı beş kemik yapar: alın, kalbur, kama, şakak ve art kafa kemikleri (OpenStax 7.2).

- **Ön kafa çukuru** en öndeki ve en sığ çukurdur. Göz çukurlarının hemen üstündedir ve frontal lobların tabanını taşır. Ortasında elek gibi delikli **kribriform plak** vardır; koku sinirinin lifleri bu deliklerden geçerek hemen üstteki koku soğancıklarına ulaşır (Plou ve ark., 2023).
- **Orta kafa çukuru** kama kemiğinin küçük kanatlarından şakak kemiğinin kayalık sırtlarına kadar uzanır. Çapraz duran sırtlar ona kelebek biçimi verir: ortada dar, yanlarda geniştir. Yanlardaki geniş kısımlarda temporal loblar oturur; ortadaki **Türk eyerinin** (*sella turcica*) çukurunda bezelye büyüklüğündeki hipofiz bezi durur.
- **Arka kafa çukuru** en arkadaki ve en derin çukurdur; beyinciği taşır. Ortasında kafatasının en büyük deliği, **foramen magnum** vardır (OpenStax 7.2).

Tabanda çok sayıda delik bulunur. **Kafa delikleri** (*foramina*), kafa boşluğu ile vücudun geri kalanı arasında sinirlerin, damarların ve lenf yapılarının geçtiği kapılardır (Lipsett ve Alsayouri, 2023). Birkaç önemli örnek: görme siniri göz çukuruna **optik kanaldan** geçer; beyne kan taşıyan büyük atardamarlardan biri, iç karotis arter, kafatasına zikzak çizen **karotis kanalından** girer; işitme-denge siniri ile yüz siniri **iç kulak yolundan** çıkar; beyinden dönen bütün toplardamar kanı kafatasını **juguler delikten** terk eder (OpenStax 7.2).`,
    },
    {
      tur: 'animasyon',
      ad: 'kafatasi-tabani',
      baslik: 'Kafatası tabanına yukarıdan bakış',
      aciklama:
        'Tabanı yapan beş kemik, üç kafa çukuru, on iki delik ve iki işaret yapısı (crista galli ve Türk eyeri). Bir deliğe ya da düğmesine dokununca hangi kemikte olduğunu ve içinden neyin geçtiğini okursun.',
    },
    {
      tur: 'sahne',
      baslik: 'İçeriden kafatası tabanı',
      aciklama:
        'Kafatasının tepesi kaldırıldı; tabana yukarıdan bakıyoruz (görüntünün üstü yüz tarafı). Öndeki basamak ön kafa çukuru (turuncu alın ve sarı kalbur kemiği), ortadaki kelebek orta kafa çukuru (kırmızı kama ve yeşil şakak kemikleri), en derindeki arka kafa çukurudur (mor art kafa kemiği). “Kesit” sürgüsüyle düzlemi yukarı aşağı kaydırabilirsin.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ust',
        kesit: { duzlem: 'aksiyel', konum: 0 },
        boya: [
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['yan-kafa-kemigi'], renk: KEMIK_RENGI.yanKafa },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur },
        ],
        etiketler: [
          { yapi: 'kalbur-kemigi', metin: 'Kalbur kemiği (kribriform plak)' },
          { yapi: 'kama-kemigi' },
          { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
          { yapi: 'art-kafa-kemigi' },
        ],
      },
      araclar: ['bakis', 'kesit', 'liste'],
    },
    {
      tur: 'tablo',
      baslik: 'Üç kafa çukuru',
      sutunlar: ['Çukur', 'Sınırları', 'Tabanı yapan kemikler', 'İçinde ne var?'],
      satirlar: [
        [
          'Ön kafa çukuru',
          'Önde alın kemiği; arkada kama kemiğinin küçük kanatları',
          'Alın kemiğinin göz çukuru tavanı, kalbur kemiğinin kribriform plağı, küçük kanatlar',
          'Frontal lobların tabanı, koku soğancıkları',
        ],
        [
          'Orta kafa çukuru',
          'Önde küçük kanatlar; arkada şakak kemiklerinin kayalık sırtları',
          'Kama kemiğinin gövdesi ve büyük kanatları, şakak kemiği',
          'Temporal loblar; ortada hipofiz bezi',
        ],
        [
          'Arka kafa çukuru',
          'Önde kayalık sırtlar; tabanı ve arka duvarı art kafa kemiği',
          'Art kafa kemiği, şakak kemiğinin kayalık kısmının arka yüzü',
          'Beyincik; ortadaki foramen magnumdan omurilik soğanı geçer',
        ],
      ],
      not: 'Kaynak: OpenStax 7.2; Plou ve ark. (2023). Çukurlar önden arkaya derinleşir; her biri orta hatta bir kemik çıkıntı ya da delikle sağ ve sol yarıya ayrılır.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Üç basamak:** ön çukur (frontal loblar, koku), orta çukur (temporal loblar, hipofiz), arka çukur (beyincik).\n\n**Sınırlar:** ön ile orta arasında kama kemiğinin küçük kanatları, orta ile arka arasında şakak kemiğinin kayalık sırtı.\n\n**En büyük delik:** foramen magnum (art kafa kemiği).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Burnumuzdaki koku nöronları yalnızca 1–4 ay kadar yaşar ve düzenli olarak yenilenir; yeni nöronların aksonları da kribriform plağın ince deliklerinden geçerek beyne ulaşır. Koku kaybı çoğu zaman bu liflerin kopmasından kaynaklanır; bu da genellikle başa künt bir darbeyle olur (OpenStax 13.4).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Delikler ve içlerinden geçenler',
      sutunlar: ['Delik', 'Kemik ve yer', 'İçinden geçenler'],
      satirlar: [
        ['Kribriform plak delikleri', 'Kalbur kemiği; ön çukurun orta hattı', 'Koku sinirinin (I) lifleri'],
        ['Optik kanal', 'Kama kemiğinin küçük kanadı', 'Görme siniri (II), oftalmik arter, sempatik lifler'],
        [
          'Üst orbital yarık',
          'Kama kemiğinin büyük ve küçük kanatları arası',
          'Ortak tendon halkasının üstünden: lakrimal ve frontal sinirler (V1), IV, üst oftalmik ven. Halkanın içinden: III’ün üst ve alt dalları, nazosiliyer sinir (V1), VI, siliyer gangliyonun sempatik kökleri',
        ],
        ['Foramen rotundum', 'Büyük kanat; üst orbital yarığın hemen altı', 'Maksiller sinir (V2), pterigopalatin çukura gider'],
        [
          'Foramen ovale',
          'Büyük kanadın arka kısmı',
          'Mandibular sinir (V3), aksesuar meningeal arter, emisser venler; küçük petrozal sinir (bir derlemeye göre yalnızca bazen)',
        ],
        ['Foramen spinosum', 'Büyük kanat; foramen ovalenin 3 mm arka-dışı', 'Orta meningeal arter ve ven, V3’ün meningeal dalı'],
        ['Karotis kanalı', 'Şakak kemiğinin kayalık kısmı', 'İç karotis arter ve çevresindeki sempatik ağ'],
        [
          'Foramen lacerum',
          'Kama, kayalık kısım ve art kafa kemiği arası',
          'Canlıda kıkırdakla doludur. İç karotis arter içinden değil, üstünden geçer; kıkırdaktan derin petrozal sinir geçer. Büyük bir yapı geçirmez; yalnızca küçük meningeal dallar ve emisser venler geçer',
        ],
        ['İç kulak yolu', 'Kayalık kısmın arka yüzü', 'Yüz siniri (VII), işitme-denge siniri (VIII), labirent arteri'],
        [
          'Juguler delik',
          'Kayalık kısım ile art kafa kemiği arası',
          'Önden arkaya: inferior petrozal sinüs; IX, X, XI; sigmoid sinüsün devamı olan iç juguler ven',
        ],
        [
          'Hipoglossal kanal',
          'Art kafa kemiği; foramen magnumun ön-yan kenarı',
          'Dil altı siniri (XII), çıkan farengeal arterin meningeal dalı, bir emisser ven',
        ],
        [
          'Foramen magnum',
          'Art kafa kemiği',
          'Omurilik soğanı ve zarları, XI’in omurilik kökü, vertebral arterler, ön ve arka spinal arterler, tektoryal zar, alar bağlar',
        ],
        ['Stilomastoid delik (dış yüzde)', 'Stiloid ve mastoid çıkıntılar arası', 'Yüz sinirinin kafatasından çıkışı'],
      ],
      not: 'Kaynaklar: OpenStax 7.2; Shumway ve ark. (2023); Rai ve Rattan (2012); Edwards ve ark. (2018a, 2018b); Prakash ve ark. (2019); Kempa ve ark. (2025); Das ve Mesfin (2026); Das ve Dalvin (2026); Muslu ve ark. (2025); Panara ve Hoffer (2023); Triantafyllou ve ark. (2025a); Das ve Al Khalili (2026); Kalthur ve ark. (2023); Ficke ve Jozsa (2026).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **V1, V2, V3 sırayla:** üst orbital yarık, foramen **R**otundum, foramen **O**vale (önden arkaya sıra: S-R-O, ardından spinosum). V3 kavernöz sinüse girmez; orta çukurun tabanından doğrudan foramen ovaleye gider (Mosteiro ve ark., 2024).
- **Orta meningeal arter** foramen **spinosumdan** girer, ovaleden değil.
- **XII juguler delikten geçmez:** hipoglossal kanaldan çıkar (Das ve Al Khalili, 2026).
- **XI’in omurilik kökü** kafaya foramen magnumdan girer, juguler delikten çıkar (Triantafyllou ve ark., 2025a).
- **Foramen lacerum:** kuru kafatasında açık bir deliktir, canlıda kıkırdakla kapalıdır; iç karotis arter kıkırdağın üstünden geçer (OpenStax 7.2; Das ve Dalvin, 2026).
- **Kavernöz sinüs:** yan duvarında yukarıdan aşağıya III, IV, V1 ve V2; VI ise tamamen sinüsün içinde, iç karotis artere bitişik seyreder (Mosteiro ve ark., 2024).
- **Kribriform plak** kafatası tabanının en ince kısmıdır; yüz travmasında kolay kırılır (Gomez ve Pickup, 2023).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Orta hattan bakış: tabana oturanlar',
      aciklama:
        'Kafatası ve beyin sapı orta hattan ikiye ayrıldı; sol yarıya içeriden bakıyoruz, yüz sağda. Hipofiz bezi kama kemiğinin Türk eyerinde oturur; önünde görme siniri göz çukuruna uzanır. Beyin sapı klivusun arkasında yükselir; ponsun önünde baziler arter uzanır, omurilik soğanı foramen magnumdan geçer. Beyincik, art kafa kemiğinin yaptığı arka kafa çukurunu doldurur.',
      sahne: {
        katmanlar: ['kemik', 'derin', 'sap', 'damar'],
        renk: 'dogal',
        bakis: 'ic-sol',
        yarim: 'sol',
        goster: [
          'katman:kemik',
          'hipofiz',
          'optik-sinir',
          'optik-kiazma',
          'baziler-arter',
          'pons',
          'omurilik-sogani',
          'orta-beyin',
          'beyincik',
        ],
        vurgula: [
          'katman:kemik',
          'hipofiz',
          'optik-sinir',
          'optik-kiazma',
          'baziler-arter',
          'pons',
          'omurilik-sogani',
          'orta-beyin',
          'beyincik',
        ],
        boya: [
          { secici: ['yan-kafa-kemigi'], renk: KEMIK_RENGI.yanKafa },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur },
        ],
        etiketler: [{ yapi: 'hipofiz' }, { yapi: 'pons' }, { yapi: 'beyincik' }, { yapi: 'omurilik-sogani' }, { yapi: 'baziler-arter' }],
      },
      araclar: ['bakis', 'yarim', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Ön çukur: kribriform plak, koku ve tümörler',
      md: `**Kribriform plak** kafatası tabanının en ince kısmıdır ve yüz travmasında kolayca kırılır. Kırık, koku liflerini koparabilir ya da koku soğancığını ezebilir; sonuç kısmi ya da tam koku kaybıdır (anozmi). Plağın üstündeki sert zar ince ve kemiğe sıkı yapışıktır; bu yüzden kırık zarı da kolayca yırtar, burundan beyin-omurilik sıvısı (BOS) gelebilir ve kafa içine hava girmesi (pnömosefali), beyin dokusunun fıtıklaşması (ensefalosel) ve yukarı doğru ilerleyen enfeksiyonla menenjit riski doğar (Gomez ve Pickup, 2023). Plağın önündeki küçük **foramen caecum** normalde lifli dokuyla kapanır; açık kalırsa sinüzitten kafa içine bir enfeksiyon yolu olabilir (Maruyama ve ark., 2025).

**Olfaktor oluk menenjiyomu** kribriform plağın üstündeki sert zarın araknoid hücrelerinden çıkar; bütün birincil beyin tümörlerinin %2’si, ön çukur menenjiyomlarının %34’üdür. En sık başvuru yakınmaları baş ağrısı (%31–86), koku kaybı (%57–78) ve kişilik değişikliğidir (%48–72) (Ikhuoriah ve ark., 2022). Tümör yavaş büyüdüğünden koku kaybı çoğu zaman hastanın yakınması değildir, sonradan fark edilir (Edwards ve ark., 2018a). Ön çukurdaki büyük bir kitle **Foster Kennedy sendromu** yapabilir: bir gözde sinirin sıkışmasına bağlı optik atrofi, öbür gözde kafa içi basınç artışına bağlı optik disk ödemi; tabloya koku kaybı eşlik eder. Kitleler bugün görüntülemeyle erken bulunduğu için tam sendrom artık seyrektir (Musa ve Zeppieri, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Göz çukurunun tepesi ve kavernöz sinüs',
      md: `**Üst orbital yarık sendromu**, bu yarıktan göz çukuruna giren III, IV, VI ve V1 sinirlerinin işlev bozukluğudur: göz çevresinde şişlik, gözün öne fırlaması (proptozis), göz kapağı düşüklüğü (pitozis), alında uyuşukluk ve göz kaslarında felç. Üç ana nedeni travma, tümör ve iltihaptır. Görme siniri yarıktan geçmediği için görme korunur; görme de bozulduysa tablonun adı **orbita apeks sendromudur** (Rai ve Rattan, 2012). 11.284 kafa-yüz kırığı olan hastanın 33’ünde (%0,3) bu sendrom bulunmuştur; travmada en hafif etkilenen IV., en ağır etkilenen VI. sinirdir (Rai ve Rattan, 2012).

**Kavernöz sinüs**, Türk eyerinin iki yanında, üst orbital yarıktan şakak kemiğinin kayalık ucuna uzanan yaklaşık 1 cm genişliğinde, 2 cm uzunluğunda bir toplardamar boşluğudur (Ngnitewe Massa ve ark., 2023). İçinden sempatik liflerle sarılı iç karotis arter geçer (Kuybu ve Dossani, 2023). Sinüsü tutan herhangi bir hastalık **kavernöz sinüs sendromu** yapar: göz kaslarında felç, göz akının şişmesi (kemozis), proptozis, Horner sendromu ya da yüzde duyu kaybı (Kuybu ve Dossani, 2023). Yan duvarda yukarıdan aşağıya III, IV, V1 ve V2 sinirleri bulunur; VI. sinir ise yan duvarda değil, sinüsün içinde, iç karotis artere sıkıca bitişik seyreder (Mosteiro ve ark., 2024).

Büyük kanattaki küçük **Vesalius deliği** her kafatasında bulunmaz; yüzün derinindeki pterigoid toplardamar ağını kavernöz sinüse bağlayan bir emisser ven taşır ve dışarıdaki bir enfeksiyonun sinüse yayılma yolu olabilir (Chaisuksunt ve ark., 2012).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Foramen magnum ve Chiari malformasyonu',
      md: `Foramen magnumun ön kenarının orta noktasına **basion**, arka kenarınınkine **opisthion** denir; deliğin önünü klivusun alt ucu, yanlarını juguler tüberküller, arkasını art kafa kemiğinin yassı kısmı sınırlar (Ficke ve Jozsa, 2026; Edwards ve ark., 2018b). Ortalama alanı 826 mm² dolayındadır ve kadınlarda ortalama 100 mm²’den fazla küçüktür; içindeki alanın çoğunu omurilik soğanı kaplar (Edwards ve ark., 2018b; Atreya ve ark., 2023).

Deliğin anatomisi beyincik tonsillerinin fıtıklaşması, Chiari malformasyonları, travma ve vertebrobaziler dolaşım bozukluklarının seyrini etkiler (Ficke ve Jozsa, 2026). **Chiari tip 1**, beyincik tonsillerinin foramen magnumdan en az 5 mm aşağı inmesidir. Belirti vermeyebilir; çocukluktan erişkinliğe kadar öksürükle artan baş ağrısı, uykuda solunum bozukluğu, skolyoz ve odak nörolojik bulgularla ortaya çıkabilir (Kular ve Karsonovich, 2025). Beyinciğin üstündeki bir kitle de tonsilleri aşağı itip Chiari benzeri bir tablo yapabilir; akondroplazide ise delik daralabilir (Edwards ve ark., 2018b).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 1: Sesi kısılan, yutkunamayan adam',
      oyku: `62 yaşında, iki yıl önce akciğer kanseri ameliyatı geçirmiş bir adam, birkaç haftadır sesinin kısıldığını ve yutkunurken sıvıların genzine kaçtığını anlatıyor. Muayenede sesinin tonu değişmiş; sol tarafta öğürme refleksi alınamıyor ve dilinin arka kısmında solda duyu azalmış. Sol omzunu kaldırmakta ve başını sağa çevirmekte zorlanıyor. Dilini dışarı çıkarınca dil tam ortada; yüzünde güçsüzlük ve göz hareketlerinde bozukluk yok.`,
      soru: 'Hangi kafa sinirleri etkilenmiş, lezyon kafatası tabanında nerede olabilir ve dil neden etkilenmemiş?',
      cozum: `**Sinirler:** Dilin arka üçte birinde tat ve duyu kaybı, öğürme refleksinin alınamaması, ses kısıklığı, ses tonunda değişiklik ve yutma güçlüğü IX ve X. sinirleri; aynı tarafta omuz kaldırma (trapez) ve başı çevirme (sternokleidomastoid) güçsüzlüğü XI. siniri gösterir (Edwards ve ark., 2018b).

**Yer:** IX, X ve XI kafatasını birlikte **juguler delikten** terk eder; üçünün aynı tarafta felci **juguler delik (Vernet) sendromudur** (Das ve Al Khalili, 2026).

**Dil neden sağlam?** XII. sinir juguler delikten geçmez, hemen yanındaki **hipoglossal kanaldan** çıkar (Das ve Al Khalili, 2026). Lezyon hipoglossal kanalı da tutsaydı dört alt kafa sinirinin birlikte felci, yani **Collet–Sicard sendromu** görülürdü (Huang ve ark., 2024); buna boyundaki sempatik zincirin tutulmasına bağlı Horner sendromu da eklenseydi lezyonun stiloid çıkıntının arkasındaki boşlukta olduğu düşünülürdü (**Villaret sendromu**) (Choucha ve ark., 2026).

**Neden?** Bu hastanın kanser öyküsü uyarıcıdır: bir kaynağa göre Vernet sendromunun en sık nedeni kafa tabanı metastazlarıdır (Braut ve ark., 2021); juguler deliği etkileyen lezyonların %36’ya kadarı metastazdır ve çoğu meme, akciğer ya da böbrekten gelir (Edwards ve ark., 2018b). Başka bir derleme ise en sık nedeni delik içindeki menenjiyomlar olarak verir (Edwards ve ark., 2018b). Bu yüzden kafa tabanının görüntülenmesi gerekir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka 2: Kulak akıntısından sonra çift görme',
      oyku: `9 yaşında bir çocuk iki haftadır sağ kulağından irinli akıntı ve ateşle izleniyor. Son günlerde sağ gözünün çevresinde ve alnında, zaman zaman yanağında, uykudan uyandıran şiddetli bir ağrı başlamış. Bugün yan tarafa bakınca her şeyi çift gördüğünü söylüyor. Muayenede sağ göz dışa doğru bakamıyor; öteki göz hareketleri, pupiller ve yüz kasları normal.`,
      soru: 'Enfeksiyon nereye yayılmış olabilir ve ağrı ile çift görme bu yerin anatomisiyle nasıl açıklanır?',
      cozum: `Tablo **Gradenigo sendromunun** üçlüsüne uyar: irinli orta kulak iltihabı, beşinci sinirin ilk iki dalının (V1–V2) alanında tek taraflı yüz ağrısı ve aynı tarafta yatay çift görmeye yol açan **VI. sinir felci**. Sendromu 1904’te Giuseppe Gradenigo tanımladı; enfeksiyonun şakak kemiğinin kayalık ucuna (**petröz apeks**) yayılması bu sendrom için tanı koydurucudur (Schmit ve ark., 2025).

**Anatomi:** VI. sinir beyin sapından çıktıktan sonra klivus boyunca uzanır ve petröz apekste kavernöz sinüse girer (Graham ve ark., 2023); bu sırada Gruber bağının altından, **Dorello kanalı** denen dar bir geçitten geçer (Mosteiro ve ark., 2024). Kayalık uçtaki iltihap siniri tam bu geçitte etkiler. Beşinci sinirin gangliyonu da yakında, orta çukurdaki **Meckel mağarasındadır** (Huff ve ark., 2024). Yakındaki V. ve VI. sinirlerin iltihaptan etkilenmesi klasik belirtileri doğurur; iltihap iç karotis artere ve kavernöz sinüse de uzanabilir (Schmit ve ark., 2025).

**Ama dikkat:** 65 çocuğu inceleyen bir derlemede klasik üçlü olguların yalnızca %22’sinde vardı, %74’ünde tablo eksikti; görüntülemede petröz apeks iltihabı olguların %84’ünde gösterildi (Schmit ve ark., 2025). VI. sinir felci erişkinde en sık görülen tek kafa siniri felcidir, çocuklarda ikinci sıradadır (Graham ve ark., 2023); kulak enfeksiyonu öyküsü olan bir çocukta bu felç kafa tabanını düşündürmelidir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Orta çukurun cerrahi koridorları',
      md: `Orta çukur, kavernöz sinüs ve klivus çevresinde kafa sinirleri ile kemik işaretlerinin sınırladığı **on cerrahi üçgen** tanımlanır: dördü orta çukurda, dördü kavernöz sinüste, ikisi klivusun yanındadır (Chavez-Herrera ve ark., 2023). Orta çukur üçgenlerinden ikisi sık kullanılır:

- **Kawase (arka-iç) üçgeni:** dışta büyük petrozal sinir, içte kayalık sırt, önde V3, arkada arkuat eminens. İçinde kavernöz sinüsün arka kısmı vardır; buradan yapılan ön petrozektomiyle arka çukura geçilir.
- **Glasscock (arka-dış) üçgeni:** kayalık kısımdaki iç karotis arterin kıvrımlarını, büyük ve küçük petrozal sinirleri, kulak zarını geren kası, östaki borusunu ve foramen spinosumdan giren orta meningeal arteri içerir.

Önde **Mullan üçgeni** V1 ile V2 arasında, tabanı üst orbital yarık ile foramen rotundumu birleştiren çizgidir; **ön-dış üçgen** ise V2 ile V3 arasında, foramen rotundum ile ovale arasındadır (Chavez-Herrera ve ark., 2023).

**İşaretlerin güvenilirliği:** Arkuat eminens, üst yarım daire kanalının şakak kemiğinin ön yüzünde yaptığı kabartı olarak tanımlanır ve orta çukur cerrahisinde iç kulak yolunu bulmak için kullanılır. 295 şakak kemiğinde eminens %20,3 yassı, %62 belirgin, %12,6 çok belirgindi; eminens ile kanal arasındaki doğrudan ilişki yalnızca yassı tipte vardı (García-Barrios ve ark., 2021). Orta çukur yaklaşımında iç kulak yolu, büyük petrozal sinirden ve arkuat eminensten çizilen ve aralarında yaklaşık 90–120° açı yapan iki hayali çizginin açıortayında bulunur; kraniotomi dış kulak yolu merkezli, yaklaşık 4 × 4 cm’dir. Akustik nöroma bu yolla çıkarılan, ameliyattan önce iyi işiten hastaların %67’sinde işitme korunmuştur (Gidley ve ark., 2021).

**Foramen ovale yoluyla Meckel mağarası:** Trigeminal nevraljide radyofrekans rizotomi ve balon kompresyonunda iğne deriden (perkütan) foramen ovaleye ilerletilerek Meckel mağarasına ulaşılır (Edwards ve ark., 2018a). Radyofrekans termokoagülasyonun ağrıyı giderme oranı %90–100 olarak bildirilir; ama delik küçüktür ve biçimi değişkendir (Liu ve ark., 2022). Yakındaki Vesalius deliği ovaleye 2 mm kadar yaklaşabilir (Chaisuksunt ve ark., 2012) ve yanlışlıkla bu deliğe girilmesi kavernöz sinüs yaralanması ve kanamaya yol açabilir (Alshehri ve ark., 2026). Pterigospinöz bar gibi kemikleşmiş bağlar da iğnenin yolunu kapatabilir (Henry ve ark., 2020; Edwards ve ark., 2018a).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kafa tabanında sık görülen çeşitlilikler',
      sutunlar: ['Yapı', 'Çeşitlilik', 'Sıklık ya da ölçü', 'Neden önemli?'],
      satirlar: [
        [
          'Karotikoklinoid bağ',
          'Ön ve orta klinoid çıkıntılar arasındaki bağın kemikleşmesi',
          'Herhangi bir kemikleşme %17,47; tam delik %6,44 (ortalama çap 5 mm)',
          'Tam delik iç karotis arterin klinoid kesimini halka gibi sarar.',
        ],
        [
          'Sella köprüsü',
          'Klinoid çıkıntılar arasında kemik köprü',
          'Ortalama %26,54; sağlıklılarda %21,12, eşlik eden hastalığı olanlarda %33,31',
          'Bölgenin anatomisini değiştirdiği için beyin cerrahisinde önemlidir.',
        ],
        [
          'Vesalius deliği',
          'Büyük kanatta ek bir emisser ven deliği',
          'Konik ışınlı BT meta-analizinde %50,6 (çalışmalar arasında %28–73)',
          'Foramen ovale girişimlerinde yanlışlıkla girilebilir.',
        ],
        [
          'Pterigospinöz bar',
          'Lateral pterigoid lamina ile sfenoid dikeni arasında kemikleşme',
          'Tam %4,4; eksik %11,6',
          'Foramen ovaleye perkütan erişimi zorlaştırabilir.',
        ],
        [
          'Koku çukuru (Keros)',
          'Koku çukurunun derinliği: tip I 1–3 mm, tip II 4–7 mm, tip III 8–16 mm',
          'Bir Suudi örneğinde sağda tip I %35,1, tip II %59,5, tip III %5,4',
          'Tip III’te sinüs cerrahisinde kribriform plağın dış lamelinin yaralanma riski en yüksektir.',
        ],
        [
          'Optik kanal',
          'Uzunluk ve iki kanallı olma',
          '8–12 mm uzunluk; kafataslarının %2,57’sinde çift',
          'Kanal, görme sinirinin çevresindeki zarlar arası aralığın en dar noktasıdır.',
        ],
        [
          'Juguler delik',
          'Sağ-sol farkı, kemik bölmeler',
          'Nüfusun %75’inde sağ delik daha büyük; iç ağızda bölmeye uzanan kemik çıkıntı %41',
          'Sağ sigmoid sinüsün baskınlığıyla ilişkili olabilir; cerrahi planlamada önemlidir.',
        ],
        [
          'Hipoglossal kanal',
          'Kanalın kemik bir bölmeyle ikiye ayrılması',
          '%20–30, çoğu tek taraflı',
          'Kondil rezeksiyonu kanalı aşmamalıdır.',
        ],
        [
          'Foramen lacerum',
          'Biçim tipleri',
          'Bir Türk BT örneğinde olağan tip sağda %70, solda %73',
          'Özellikle endoskopik endonazal kafa tabanı cerrahisinde iç karotis arter ve vidian kanala ulaşmak için kritik bir işarettir.',
        ],
      ],
      not: 'Kaynaklar: Triantafyllou ve ark. (2025a, 2025b); Cuschieri ve ark. (2022); Alshehri ve ark. (2026); Henry ve ark. (2020); Almushayti ve ark. (2022); Edwards ve ark. (2018a, 2018b); Zhang ve ark. (2019); Thintharua ve Chentanez (2023); Muslu ve ark. (2025).',
    },
  ],
};
