import type { Soru } from '../../../types';

/** 12 temel, 12 lisans, 12 uzman soru. Doğru şıklar her düzeyin içinde dört yere eşit dağıtılmıştır. */
export const sorular: Soru[] = [
  // ——— Temel ———
  {
    soru: 'Yetişkin kafatası kaç kemikten oluşur?',
    secenekler: ['8', '14', '22', '28'],
    dogru: 2,
    aciklama:
      'Kafatası 22 kemiktir: beyni saran 8 beyin kutusu kemiği ve 14 yüz kemiği. Dil kemiği ve kulak kemikçikleri kafatasına sayılmaz.',
    seviye: 'temel',
  },
  {
    soru: 'Koronal dikiş hangi kemikleri birbirine bağlar?',
    secenekler: [
      'Sağ ve sol yan kafa kemiklerini',
      'Alın kemiğini iki yan kafa kemiğine',
      'Art kafa kemiğini yan kafa kemiklerine',
      'Şakak kemiğini yan kafa kemiğine',
    ],
    dogru: 1,
    aciklama:
      'Koronal dikiş alın kemiği ile iki yan kafa kemiği arasındadır. İki yan kafa kemiğini sagittal, art kafayı lambdoid, şakağı skuamöz dikiş bağlar.',
    seviye: 'temel',
  },
  {
    soru: 'Pterion için hangisi doğrudur?',
    secenekler: [
      'Kafatasının en büyük deliğidir',
      'Art kafa kemiğinin en çıkıntılı noktasıdır',
      'Bebekte en son kapanan bıngıldaktır',
      'Dört kemiğin buluştuğu, kafatasının en zayıf yeridir',
    ],
    dogru: 3,
    aciklama:
      'Pterion şakakta alın, yan kafa, şakak ve kama kemiklerinin buluştuğu H biçimli bölgedir; kafatasının en zayıf yeridir ve iç yüzünden orta meningeal arterin dalı geçer.',
    seviye: 'temel',
  },
  {
    soru: 'Kafa derisinin “tehlikeli katmanı” hangisidir?',
    secenekler: ['Deri', 'Aponevroz', 'Gevşek bağ dokusu', 'Perikranyum'],
    dogru: 2,
    aciklama:
      'Dördüncü katman olan gevşek bağ dokusundan kapakçıksız emisser venler geçer; kafa derisindeki bir enfeksiyon bu yoldan kafa içine ilerleyebilir.',
    seviye: 'temel',
  },
  {
    soru: 'Kafatası kemiğinin iki sert tablası arasındaki süngerimsi katmanın adı nedir?',
    secenekler: ['Diploe', 'Perikranyum', 'Galea', 'Sert zar'],
    dogru: 0,
    aciklama:
      'Yassı kafatası kemikleri bir sandviç gibidir: dış tabla, süngerimsi diploe ve iç tabla. Diploede zengin bir toplardamar ağı vardır.',
    seviye: 'temel',
  },
  {
    soru: 'Beyincik kafatası tabanının hangi bölümünde oturur?',
    secenekler: ['Ön kafa çukuru', 'Orta kafa çukuru', 'Türk eyeri', 'Arka kafa çukuru'],
    dogru: 3,
    aciklama:
      'Arka kafa çukuru en arkadaki ve en derin çukurdur; beyinciği taşır. Ön çukurda frontal loblar, orta çukurda temporal loblar ve hipofiz bulunur.',
    seviye: 'temel',
  },
  {
    soru: 'Koku sinirinin lifleri kafatasına hangi yapıdan girer?',
    secenekler: ['Optik kanal', 'Kribriform plak', 'Foramen magnum', 'Juguler delik'],
    dogru: 1,
    aciklama: 'Kalbur kemiğinin elek gibi delikli kribriform plağından geçen koku lifleri, hemen üstteki koku soğancıklarına ulaşır.',
    seviye: 'temel',
  },
  {
    soru: 'Hipofiz bezi kafatasının neresinde oturur?',
    secenekler: ['Türk eyerinde (sella turcica)', 'Foramen magnumda', 'Kribriform plağın üstünde', 'Mastoid çıkıntının içinde'],
    dogru: 0,
    aciklama: 'Kama kemiğinin gövdesindeki eyer biçimli çukur, sella turcica, bezelye büyüklüğündeki hipofiz bezini taşır.',
    seviye: 'temel',
  },
  {
    soru: 'Yenidoğanda kaç bıngıldak bulunur?',
    secenekler: ['4', '5', '6', '8'],
    dogru: 2,
    aciklama:
      'Altı bıngıldak vardır: bir ön, bir arka, iki sfenoid ve iki mastoid. En büyüğü ön bıngıldaktır; çoğunlukla iki yaşına kadar hepsi kapanır.',
    seviye: 'temel',
  },
  {
    soru: 'En büyük sinüs hangisidir?',
    secenekler: ['Frontal sinüs', 'Sfenoid sinüs', 'Etmoid hava hücreleri', 'Maksiller sinüs'],
    dogru: 3,
    aciklama:
      'Üst çene kemiklerindeki maksiller sinüsler en büyük sinüslerdir; ağızları yukarıda olduğu için zor boşalır ve enfeksiyonda en sık tutulan sinüs onlardır.',
    seviye: 'temel',
  },
  {
    soru: 'Başını çarpan birinin burnundan ya da kulağından berrak sıvı gelmesi neyi düşündürür?',
    secenekler: ['Basit bir nezleyi', 'Kafa tabanı kırığını', 'Kulak kirini', 'Yüz kası felcini'],
    dogru: 1,
    aciklama: 'Burundan ya da kulaktan beyin-omurilik sıvısı gelmesi kafa tabanı kırığının işaretlerindendir; acil değerlendirme gerekir.',
    seviye: 'temel',
  },
  {
    soru: 'Kraniotomi ile kraniektomi arasındaki fark nedir?',
    secenekler: [
      'Kraniotomide kemik kapağı yerine konur, kraniektomide konmaz',
      'Kraniotomi yalnızca çocuklarda, kraniektomi yalnızca yetişkinlerde yapılır',
      'Kraniotomide kafa derisi açılmaz',
      'İkisi aynı işlemin farklı adlarıdır',
    ],
    dogru: 0,
    aciklama:
      'Kraniotomide kafatasının bir parçası geçici olarak çıkarılıp sonra yerine konur. Kraniektomide kemik kapağı aynı ameliyatta yerine konmaz; kafatası daha sonra kranioplastiyle onarılır.',
    seviye: 'temel',
  },
  // ——— Lisans ———
  {
    soru: 'Orta meningeal arter kafatasına hangi delikten girer?',
    secenekler: ['Foramen ovale', 'Foramen rotundum', 'Foramen spinosum', 'Juguler delik'],
    dogru: 2,
    aciklama:
      'Orta meningeal arter maksiller arterden çıkar ve foramen spinosumdan girer. Foramen ovaleden V3, foramen rotundumdan V2 geçer.',
    seviye: 'lisans',
  },
  {
    soru: 'Juguler delikten geçmeyen kafa siniri hangisidir?',
    secenekler: ['Glossofaringeal sinir (IX)', 'Vagus siniri (X)', 'Aksesuar sinir (XI)', 'Hipoglossal sinir (XII)'],
    dogru: 3,
    aciklama:
      'XII. sinir kafatasından hipoglossal kanaldan çıkar. Juguler delikten IX, X, XI ve iç juguler ven geçer; üçünün birlikte felcine Vernet sendromu denir.',
    seviye: 'lisans',
  },
  {
    soru: 'Üst orbital yarık sendromunda aşağıdakilerden hangisi beklenmez?',
    secenekler: ['Göz kaslarında felç', 'Alında uyuşukluk', 'Görme kaybı', 'Göz kapağı düşüklüğü'],
    dogru: 2,
    aciklama:
      'Görme siniri üst orbital yarıktan değil optik kanaldan geçer; bu yüzden görme korunur. Görme de bozulmuşsa tablonun adı orbita apeks sendromudur.',
    seviye: 'lisans',
  },
  {
    soru: 'Kavernöz sinüsün yan duvarında değil, doğrudan içinde seyreden sinir hangisidir?',
    secenekler: ['Okülomotor sinir (III)', 'Troklear sinir (IV)', 'Maksiller sinir (V2)', 'Abdusens sinir (VI)'],
    dogru: 3,
    aciklama: 'III, IV, V1 ve V2 kavernöz sinüsün yan duvarındadır; VI. sinir ise sinüsün içinde, iç karotis artere bitişik seyreder.',
    seviye: 'lisans',
  },
  {
    soru: 'Metopik dikiş tipik olarak ne zaman kaynaşır?',
    secenekler: ['Doğumdan önce', 'Bebeklikte, çoğunlukla ilk yıl içinde', 'Ergenlikte', 'Erişkinlikte, 22 yaş dolayında'],
    dogru: 1,
    aciklama:
      'BT çalışmalarında metopik kapanmanın ilk belirtisi 3. ayda görülür; 9 aydan büyük çocukların hemen hepsinde dikiş kapalıdır. Erişkinde kapanmamış metopik dikişe metopizm denir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bregma nedir?',
    secenekler: [
      'Koronal ve sagittal dikişlerin kesiştiği nokta',
      'Sagittal ve lambdoid dikişlerin birleştiği nokta',
      'Dört kemiğin buluştuğu H biçimli bölge',
      'Dış oksipital çıkıntının tepesi',
    ],
    dogru: 0,
    aciklama:
      'Bregma koronal ve sagittal dikişlerin kesişim noktasıdır ve bebekteki ön bıngıldağın yerine karşılık gelir. Öteki şıklar sırasıyla lambda, pterion ve inionu tarif eder.',
    seviye: 'lisans',
  },
  {
    soru: 'Sagittal sinostozda baş hangi biçimi alır?',
    secenekler: ['Trigonosefali', 'Skafosefali', 'Brakisefali', 'Yukarıdan yamuk (trapez) görünüm'],
    dogru: 1,
    aciklama:
      'Sagittal dikiş erken kaynaşınca baş yana büyüyemez, önden arkaya uzar: uzun, dar skafosefali. Trigonosefali metopik, brakisefali çift koronal, yamuk görünüm lambdoid sinostozda görülür.',
    seviye: 'lisans',
  },
  {
    soru: 'Tek taraflı lambdoid sinostozu pozisyonel plajiyosefaliden ayıran bulgu hangisidir?',
    secenekler: [
      'Yukarıdan bakınca paralelkenar biçimli baş',
      'Aynı yandaki kulağın ve alnın öne kayması',
      'Yukarıdan yamuk görünüm ve arka bıngıldağın karşı yana kayması',
      'Bebeğin hep aynı yana yatırılması',
    ],
    dogru: 2,
    aciklama:
      'Lambdoid sinostozda baş yukarıdan yamuk görünür, arka bıngıldak karşı yana kayar ve kafa tabanı eğiktir. Paralelkenar baş ve öne kayan kulak pozisyonel plajiyosefaliye uyar.',
    seviye: 'lisans',
  },
  {
    soru: 'Burundan gelen sıvının BOS olduğunu doğrulamada laboratuvar altın standardı hangisidir?',
    secenekler: ['Glukoz test şeridi', 'Beta-2 transferrin', 'Sıvının pH ölçümü', 'Sıvının rengi'],
    dogru: 1,
    aciklama:
      'Beta-2 transferrin yalnızca BOS, perilenf ve göz içi sıvılarında bulunur. Glukoz şeritlerinin duyarlılığı ve özgüllüğü düşüktür.',
    seviye: 'lisans',
  },
  {
    soru: 'Cochrane derlemesi kafa tabanı kırığında koruyucu antibiyotik için ne sonuca vardı?',
    secenekler: [
      'Menenjiti belirgin olarak azalttığına',
      'Ölümü azalttığına',
      'Yalnızca BOS sızıntısı olanlarda yararlı olduğuna',
      'Randomize kanıtın bu kullanımı desteklemediğine',
    ],
    dogru: 3,
    aciklama:
      'Beş randomize çalışmayı birleştiren derleme, BOS sızıntısı olsun olmasın koruyucu antibiyotiği desteklemedi; çalışmaların yanlılıkları nedeniyle büyük çalışmalara ihtiyaç olduğunu vurguladı.',
    seviye: 'lisans',
  },
  {
    soru: 'NICE 2023’e göre 16 yaş ve üstünde, saptandıktan sonra bir saat içinde kafa BT’si gerektiren ölçüt hangisidir?',
    secenekler: ['Birden fazla kusma', 'Bilinç kaybıyla birlikte 65 yaş ve üstü olmak', 'Tek bir kusma', 'Hafif baş ağrısı'],
    dogru: 0,
    aciklama:
      'Birden fazla kusma bir saatlik ölçütlerdendir. Bilinç ya da bellek kaybı olan 65 yaş ve üstü kişide BT ise 8 saat içinde çekilir.',
    seviye: 'lisans',
  },
  {
    soru: 'Göz çukurunun tavanını hangi kemik yapar?',
    secenekler: ['Alın kemiği', 'Elmacık kemiği', 'Üst çene kemiği', 'Gözyaşı kemiği'],
    dogru: 0,
    aciklama:
      'Alın kemiğinin yassı kısmı hem göz çukurunun tavanını hem ön kafa çukurunun tabanını yapar. Elmacık kemiği dış duvarı, üst çene tabanı, gözyaşı kemiği iç duvarı yapar.',
    seviye: 'lisans',
  },
  // ——— Uzman ———
  {
    soru: 'Murphy sınıflamasına göre en sık görülen pterion tipi hangisidir?',
    secenekler: ['Stellat', 'Epipterik', 'Frontotemporal', 'Sfenoparietal'],
    dogru: 3,
    aciklama:
      '79 çalışmalık meta-analizde sfenoparietal tip %78,54, epipterik %8,41, frontotemporal %5,74 ve stellat %4,26 oranında bulundu.',
    seviye: 'ileri',
  },
  {
    soru: 'Kawase (arka-iç) üçgeninin sınırlarından biri olmayan yapı hangisidir?',
    secenekler: ['Büyük petrozal sinir', 'Mandibular sinir (V3)', 'Arkuat eminens', 'Oftalmik sinir (V1)'],
    dogru: 3,
    aciklama:
      'Kawase üçgenini dışta büyük petrozal sinir, içte kayalık sırt, önde V3 ve arkada arkuat eminens sınırlar. V1, V2 ile birlikte Mullan üçgenini sınırlar.',
    seviye: 'ileri',
  },
  {
    soru: 'RESCUEicp çalışmasında 6. ay ölüm oranları (kraniektomi ve tıbbi tedavi) nasıldı?',
    secenekler: ['%19 ve %18', '%26,9 ve %48,9', '%30,2 ve %32,2', '%45,4 ve %32,4'],
    dogru: 1,
    aciklama:
      'Kraniektomi ölümü azalttı (%26,9’a karşı %48,9) ama bitkisel durumda yaşayanları artırdı. %19–%18 DECRA’nın, %30,2–%32,2 RESCUE-ASDH’nin sonuçlarıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'DECRA çalışmasında dirençli kafa içi basınç artışı nasıl tanımlandı?',
    secenekler: ['25 mmHg’nin üstü', '15 mmHg’nin üstü', '1 saatte 15 dakikadan uzun süre 20 mmHg’nin üstü', '30 mmHg’nin üstü'],
    dogru: 2,
    aciklama:
      'DECRA’nın eşiği 1 saatlik süre içinde 15 dakikadan uzun süre 20 mmHg’nin üstüydü; RESCUEicp ise 25 mmHg’nin üstünü ölçüt aldı. Eşiklerin farklılığı iki çalışmanın sonuçlarını yorumlarken önemlidir.',
    seviye: 'ileri',
  },
  {
    soru: 'Brain Trauma Foundation’a göre açık çökme kırığında ameliyat gerektiren durum hangisidir?',
    secenekler: [
      'Kırık çizgisinin bir dikişe uzanmaması',
      'Hastanın 60 yaşından büyük olması',
      'Çökmenin kemik kalınlığından derin olması',
      'Kırığın art kafa kemiğinde olması',
    ],
    dogru: 2,
    aciklama:
      'Çökmesi kemik kalınlığından derin olan açık kırıklar enfeksiyonu önlemek için ameliyat edilmelidir; erken ameliyat, kaldırma ve temizleme ile antibiyotik önerilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Farelerde kafatası iliği üzerine yapılan çalışmalar ne gösterdi?',
    secenekler: [
      'Kafatasında hiç damar kanalı bulunmadığını',
      'Beyin zarlarındaki bağışıklık hücrelerinin yalnızca kandan geldiğini',
      'Kafatası iliğinin kan hücresi yapmadığını',
      'İlikten gelen nötrofillerin iç tablayı delen kanallarla beyin yüzeyine ulaştığını',
    ],
    dogru: 3,
    aciklama:
      'Fare çalışmalarında kafatası iliğini beyin yüzeyine bağlayan mikroskobik kanallar ve zarlardaki bağışıklık hücrelerinin komşu kemik iliğinden geldiği gösterildi; insanda da benzer kanallar ölçüldü.',
    seviye: 'ileri',
  },
  {
    soru: 'Nazoseptal (Hadad-Bassagasteguy) flep hangi damarla beslenir?',
    secenekler: ['Ön etmoidal arter', 'Sfenopalatin arterin arka septal dalı', 'Orta meningeal arter', 'Yüzeyel temporal arter'],
    dogru: 1,
    aciklama:
      'Flep burun bölmesinin mukozasından hazırlanır ve sfenopalatin arterin arka septal dalıyla beslenir; yaygınlaşması endonazal cerrahide BOS sızıntısını belirgin azalttı.',
    seviye: 'ileri',
  },
  {
    soru: 'Asterion ile transvers-sigmoid sinüs bileşkesi arasındaki ilişki için hangisi doğrudur?',
    secenekler: [
      'Asterion her zaman bileşkenin tam üzerindedir',
      'Asterion olguların yalnızca %1’inde tam bileşkenin üzerindedir; yeri değişkendir',
      'Asterion sigmoid sinüsün 3 cm altındadır',
      'Asterion ile toplardamar sinüsleri arasında bir ilişki yoktur',
    ],
    dogru: 1,
    aciklama:
      'Asterion olguların %63’ünde transvers sinüsün dış yarısının üzerinde, yalnızca %1’inde tam bileşkenin üzerindedir. Bu yüzden tek başına güvenilir bir işaret sayılmaz.',
    seviye: 'ileri',
  },
  {
    soru: 'Gradenigo sendromunda VI. sinir en çok nerede etkilenir?',
    secenekler: ['Petröz apeksteki Dorello kanalında', 'Foramen ovalede', 'Üst orbital yarıkta', 'Juguler delikte'],
    dogru: 0,
    aciklama:
      'VI. sinir klivus boyunca yükselip petröz apekste, Gruber bağının altındaki Dorello kanalından geçer; kayalık uca yayılan iltihap siniri burada etkiler.',
    seviye: 'ileri',
  },
  {
    soru: 'Trefine sendromu için hangisi doğrudur?',
    secenekler: [
      'Kesin tedavisi kranioplastidir',
      'Yalnızca çocuklarda görülür',
      'Defektin altında beyin kan akımı artar',
      'Kranioplastiden sonra ortaya çıkar',
    ],
    dogru: 0,
    aciklama:
      'Kafatası defektine bağlanan ve kranioplastiyle düzelen nörolojik kötüleşmedir; perfüzyon görüntülemesi defektin altında kan akımının azaldığını gösterir.',
    seviye: 'ileri',
  },
  {
    soru: 'Keros tip III koku çukurunun cerrahi önemi nedir?',
    secenekler: [
      'Koku çukuru en sığ tiptir; kafa tabanı yaralanması olanaksızdır',
      'Optik kanalın çift olduğunu gösterir',
      'Koku çukuru 8–16 mm derindir; kribriform plağın dış lameli yaralanmaya en açıktır',
      'Sella köprüsünün eşlik ettiğini gösterir',
    ],
    dogru: 2,
    aciklama:
      'Keros sınıflamasında tip III en derin koku çukurudur; endoskopik sinüs cerrahisinde kribriform plağın dış lamelinin yaralanma riski en yüksek tiptir.',
    seviye: 'ileri',
  },
  {
    soru: 'Endoskopik şerit kraniektomi ve kask tedavisi için önerilen hedef yaş nedir?',
    secenekler: ['3 aydan küçük', '6–12 ay', '10–12 ay', '2 yaş'],
    dogru: 0,
    aciklama:
      'Endoskopik yöntem için hedef yaş 3 aydan küçüktür; 6 aydan sonra kemikler sertleştiği için açık cerrahi tercih edilir. Alın düzeltmesi gerekenlerde açık cerrahi çoğu zaman 10–12. aylara ertelenir.',
    seviye: 'ileri',
  },
];
