import type { DersBolumu } from '../../../types';

/**
 * 11. bölüm: kafa içi kanamalar ve fıtıklaşmalar. Zar anatomisiyle bağları: epidural (kemik–sert zar), akut ve kronik
 * subdural (sert zarın sınır hücre katmanı), subaraknoid (BOS dolu boşluk) kanama; biçimleri, sıklık ve ölüm, tedavi
 * ilkeleri, orta meningeal atardamar embolizasyonu ve tartışması; fıtıklaşma türleri ve sert zar kıvrımlarıyla bağları,
 * Kernohan–Woltman çentiği, Duret kanaması, paradoks fıtıklaşma. Bilgiler kaynak notlarından (S2/C, S2/D, S2/A, S2/B).
 */
export const kanamalarVeFitiklasmalar: DersBolumu = {
  id: 'kanamalar-ve-fitiklasmalar',
  baslik: 'Kanamalar ve fıtıklaşmalar',
  bloklar: [
    // ——— Giriş: kan nerede toplanır? ———
    {
      tur: 'metin',
      md: `Başa alınan bir darbe ya da yırtılan bir damar, kafatasının içinde kanamaya yol açabilir. Kanın nerede toplanacağını zarların sırası belirler. Dıştan içe sıra şöyledir: kafatası, sert zar, örümcek ağı zar, beyin-omurilik sıvısı (BOS) dolu boşluk, yumuşak zar ve beyin. Bu sırayı “Üç zar, iki gerçek boşluk” bölümünde gördük.

Kafa içinde kan üç düzlemde toplanabilir:

- **Epidural kanama:** Kan, kafatasının iç yüzü ile sert zar arasında toplanır. Burası normalde kapalı bir aralıktır. Kan onu açar (Khairat ve ark., 2025).
- **Subdural kanama:** Kan, sert zar ile örümcek ağı zar arasındaki düzlemde toplanır (Pierre ve ark., 2026).
- **Subaraknoid kanama:** Kan, örümcek ağı zar ile yumuşak zar arasındaki boşluğa, yani BOS’un içine karışır (Ziu ve ark., 2023).

Sağlıklı insanda bu üç düzlemden yalnızca sonuncusu gerçek bir boşluktur. Normalde örümcek ağı zar sert zara, sert zar da kafatasına yapışıktır. İlk iki aralık ancak bir travma ya da hastalık katmanları ayırınca oluşur (FIPAT, 2019). Gerçek bir subdural boşluk da yalnızca hastalıkta oluşur (Joost ve ark., 2026).

Bölümün ikinci yarısı **fıtıklaşmayı** anlatır. Büyüyen bir kanama beyni iter. Sonunda beynin bir bölümü, sert zarın sert kıvrımlarının yanından ya da kafatasındaki bir açıklıktan kayabilir. Buna fıtıklaşma (herniasyon) denir (Munakomi ve Das, 2026).`,
    },
    {
      tur: 'animasyon',
      ad: 'kafa-ici-kanamalar',
      baslik: 'Kan nerede toplanır? Üç kanama, üç düzlem',
      aciklama:
        'Kafatasının yanından alınmış şematik bir kesit. Bir kanama seç ve kanın hangi düzlemde toplandığını izle. Çizim subdural kanamayı sert zar ile örümcek ağı zarın arasında gösterir. Bu düzlem aslında sert zarın en iç hücre katmanında açılan bir yarıktır.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üç kanama, üç düzlem',
      sutunlar: ['Kanama', 'Kan nerede?', 'Çoğunlukla kaynağı', 'BT’de biçimi', 'Sınırları', 'Seyir (örnek veri)'],
      satirlar: [
        [
          'Epidural',
          'Kafatasının iç yüzü ile sert zarın dış yaprağı arasında',
          'Orta meningeal atardamar ya da dalları. Arka çukurda enine ya da S biçimli sinüs, orta çukurda sfenoparietal sinüs de kanayabilir',
          'İki yanı dışbükey, mercek biçimli',
          'Dikişleri geçmez. Üst sagital sinüsün üstünde orta hattı geçebilir. Çadırın hem üstüne hem altına uzanabilir',
          'Ölüm BT öncesi dönemde %20–55, bugün yaklaşık %12–20 (aktarılan yayınlar)',
        ],
        [
          'Subdural',
          'Sert zar ile örümcek ağı zar arasında. Gerçekte sert zarın en iç hücre katmanında açılan yarıkta',
          'Köprü toplardamarları. Nadiren bu düzlemi geçen küçük atardamar dalları',
          'Hilal (orak ay) biçimli. Kronik kanamada karışık yoğunluk ve zarlar',
          'Dikişleri geçebilir. İçte beyin orağı, aşağıda beyincik çadırı onu durdurur',
          'Akut kanamada ölüm bütün GKS düzeylerinde yaklaşık %30–60, GKS 8 ve altında %55–70',
        ],
        [
          'Subaraknoid',
          'Örümcek ağı zar ile yumuşak zar arasında, BOS’un içinde',
          'Travma dışı olanların yaklaşık %85’inde anevrizma yırtılması. Orta ve ağır kafa travmasında da sık',
          'Anevrizma kanaması taban sisternalarını tutar',
          'Kan BOS’a karışır. Belden alınan sıvıda izi (ksantokromi) aranabilir',
          'Hastaların yaklaşık dörtte biri hastaneye ulaşmadan ölür. Norveç’te hastaneye yatanlarda 30. gün ölümü %22',
        ],
      ],
      not: 'GKS: Glasgow Koma Skalası, bilinç düzeyini puanlayan ölçek. 9’un altı koma sayılır. Kaynaklar: Khairat ve ark. (2025); Kim ve Gean (2011); Heit ve ark. (2017); Mezue ve ark. (2012); Pierre ve ark. (2026); Ishikawa ve ark. (2026); Kim ve ark. (2024); Karibe ve ark. (2014); Bullock ve ark. (2006b); Ziu ve ark. (2023); Griswold ve ark. (2022); NICE (2022); Claassen ve Park (2022); Øie ve ark. (2020). Ölüm oranları farklı ülkelerde ve farklı hasta gruplarında ölçüldü. Doğrudan karşılaştırılamaz.',
    },

    // ——— Epidural kanama ———
    {
      tur: 'metin',
      md: `**Epidural kanama: kemik ile sert zar arasında.** Bu kanama en sık şakak ve şakak-yan kafa bölgesinde olur. Kaynağı çoğunlukla **orta meningeal atardamar** (*arteria meningea media*) ya da onun bir dalıdır (Kim ve Gean, 2011). Bu atardamar sert zarı besler. Kafatasına, tabandaki küçük bir delikten (*foramen spinosum*) girer (Natali ve ark., 2024). Yırtılması en sık **pterion** denen yerde olur (Natali ve ark., 2024). Pterion, şakakta kafatasının yüzeyindeki bir işaret noktasıdır. Yeri aşağıdaki sahnede gösterildi.

Epidural kanamaya çoğunlukla kafatasındaki bir kırık eşlik eder. Bir kaynağa göre kanama hemen her zaman kırığın altında ve darbenin vurduğu tarafta görülür (Kim ve Gean, 2011). Bir başka kaynağa göre epidural kanamaların %85’inde kırık vardır (Shetty ve ark., 2016).

**Neden mercek biçimli?** Sert zar kemiğe en sıkı, dikiş yerlerinin karşısında yapışır (Gray, 1918). Dikiş, kafatası kemiklerinin birleştiği çizgidir. Kan kemiği sert zardan ayırarak yayılır, ama dikişleri aşamaz (Kim ve Gean, 2011). Önce en yakın dikişe kadar yana yayılır. Sonra derine doğru şişer (Heit ve ark., 2017). Bu yüzden BT’de iki yüzü de dışa bombeli, mercek biçimli bir görüntü verir.

**Aydınlık dönem.** Darbeden sonra kişi bir süre iyi görünebilir. Bu süreye **aydınlık dönem** denir. Kan o sırada birikmektedir, ama henüz beyni sıkıştırmamıştır (Heit ve ark., 2017). Pıhtı büyüyünce beyni iter. Beyin dokusu bir bölmeden ötekine kayabilir. Bu da hızla bilinç kaybına ya da ölüme götürebilir (Heit ve ark., 2017). Bu yüzden başa darbeden sonra iyi hissetmek her zaman güvence değildir. Aydınlık dönem de her hastada görülmez. Özellikle küçük çocuklarda bu klasik tablo olmayabilir (Lee ve ark., 2024).`,
    },
    {
      tur: 'sahne',
      baslik: 'Şakak bölgesi: epidural kanamanın en sık yeri',
      aciklama:
        'Beyne soldan bakıyoruz; ön taraf solda. Kafatası yarı saydam bırakıldı. Turuncu boyalı kıvrımlar şakak lobudur. İşaretli nokta pteriondur. Orta meningeal atardamar modelde yoktur. Bu bölgede kemiğin iç yüzündeki bir olukta, sert zarın kemiğe bakan yüzünde uzanır. Epidural kanama en sık şakak ve şakak-yan kafa bölgesinde olur. Sert zar da modelde yoktur. Kemik ile beyin arasındaki ince aralığı gerçekte zarlar ve BOS doldurur.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'kemik'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        saydam: ['katman:kemik'],
        boya: [{ secici: ['ust-temporal-girus', 'orta-temporal-girus', 'alt-temporal-girus'], renk: '#e8913a' }],
        bakis: 'sol',
        etiketler: [{ yapi: 'orta-temporal-girus-sol', metin: 'Şakak lobu' }],
        noktalar: [{ nokta: 'yan-kafa-kama-kosesi-sol', metin: 'Pterion' }],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Epidural kanama eskiden çok ölümcüldü. Rose ve Carless 1927’de bu hastalarda %86 ölüm bildirmişti. Bugünkü cerrahi ve anestezi yöntemleriyle, komada olmayan hastalarda ölüm oranı sıfıra yakındır (Maugeri ve ark., 2015). Bir derlemeye göre bütün hastalarda ölüm, BT öncesi dönemde %20–55 iken bugün yaklaşık %12–20’dir (Mezue ve ark., 2012).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yana dikiş, derine şişme.** Epidural kanamayı yanlardan dikişler sınırlar, en çok da taç dikişi. Sert zar buralarda kemiğe tutunur (Khairat ve ark., 2025). Dikiş yerlerinde sert zarın kolajen demetleri kemik dikişine doğrudan devam eder (Ishikawa ve ark., 2026). Kan yana yayılabileceği en uç noktaya, yani dikiş kenarına ulaşınca derine doğru kalınlaşır (Heit ve ark., 2017).

**İki istisna.** Epidural kanama, subdural kanamadan farklı olarak orta hattı geçebilir. Orta hatta üst sagital sinüsün dış duvarını sert zarın kemik zarı (periost) yaprağı yapar. Bu yaprak kemikten ayrılabilir (Kim ve Gean, 2011). Epidural kanama beyincik çadırının hem üstüne hem altına da uzanabilir. Subdural kanamayı ise çadır sınırlar (Kim ve Gean, 2011).

**Atardamar mı, toplardamar mı?** Kaynak bazen bir toplardamar sinüsüdür. Arka kafa çukurunda enine ya da S biçimli sinüsün, orta kafa çukurunda sfenoparietal sinüsün yırtılmasıyla olabilir (Kim ve Gean, 2011). Atardamar kaynaklı kanamanın, toplardamar kaynaklıya göre daha büyük ve daha hızlı büyüyen bir pıhtı yaptığı düşünülür (Heit ve ark., 2017). Başka bir kaynak da en sık nedeni orta meningeal atardamarın yırtılması olarak verir. Öteki nedenleri kırık yerinden kanama ve sinüs yırtılmasıdır (Suzuki ve ark., 2025).

**Kimde, ne sıklıkta?** Sıklık, kaynağın hangi hastaları saydığına göre değişir:

- Mezue ve arkadaşlarının aktardığı yayınlara göre kafa yaralanmalarının yaklaşık %1–3’ünde, ağır kafa yaralanmalarının %5–15’inde görülür (Mezue ve ark., 2012).
- Başka bir derlemeye göre kafa yaralanmalı hastaların %1’inden azında, komadakilerin %10’undan azında görülür (Maugeri ve ark., 2015).
- Bir başka kaynak akut epidural kanamayı kafa yaralanmalarının %2,7–4’ünde verir (Suzuki ve ark., 2025).
- Ağır beyin yaralanması olan hastalarda bu oran %14–35’e çıkar (Choi ve ark., 2022).

Epidural kanama 2 yaşından önce ve 60 yaşından sonra nadirdir. Erkeklerde kadınlardan yaklaşık dört kat sık görülür (Mezue ve ark., 2012). Nijerya’nın Enugu kentinde 2003–2009 arasında 817 kafa yaralanmasının 69’unda (%8,4) epidural kanama vardı. Hastaların %83’ü erkekti, ortalama yaş 30,2 idi. Hastaneye ulaşma ortalama 94,2 saat sürdü. On hasta (%14,5) öldü (Mezue ve ark., 2012).

**Bebekte ve çocukta.** Bebeklerde akut epidural kanama seyrektir. Çünkü sert zar kafatasının iç yüzüne, özellikle dikişlerin çevresinde, çok sıkı yapışıktır (Araki ve ark., 2017). Bebekte kanama çoğunlukla toplardamar kökenlidir. Ya bir sinüsün üstündeki yaralanmadan ya da kırığın çevresindeki geçiş (*emissary*) toplardamarlarının yırtılmasından olur (Araki ve ark., 2017). Arka çukurdaki epidural kanama seyrektir. Bütün epidural kanamaların %3’üne kadarını oluşturur ve çocuklarda daha sıktır (Lee ve ark., 2024). Yaşla birlikte ise sert zarın kemiğe bakan katmanı kalınlaşır, sertleşir ve kemiğe daha sıkı tutunur (Ishikawa ve ark., 2026).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Epidural kanama sayılarla',
      ogeler: [
        {
          deger: '%1–3',
          aciklama: 'Kafa yaralanmalarında görülme sıklığı (aktarılan yayınlar). Kaynağa göre %1’in altı ile %4 arası verilir.',
        },
        { deger: '4:1', aciklama: 'Erkek/kadın oranı. 2 yaşından önce ve 60 yaşından sonra nadirdir.' },
        { deger: '%12–20', aciklama: 'Bugünkü ölüm oranı (BT öncesinde %20–55). Komada olmayan hastada sıfıra yakın.' },
        { deger: '30', birim: 'cm³', aciklama: 'Bu hacmin üstündeki pıhtı, bilinç puanı ne olursa olsun boşaltılmalıdır (kılavuz).' },
      ],
      not: 'Kaynaklar: Mezue ve ark. (2012); Maugeri ve ark. (2015); Suzuki ve ark. (2025); Bullock ve ark. (2006a).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Göz bebeği ne anlatır?',
      md: `- **Klasik tablo:** Önce kısa bir bilinç kaybı olur, sonra aydınlık dönem gelir. Ardından aynı taraftaki göz bebeği genişler ve hasta giderek kötüleşir. Bu tablo her hastada, özellikle küçük çocuklarda görülmez (Lee ve ark., 2024).
- **“Patlamış” göz bebeği:** Tek yanda genişlemiş ve ışığa yanıt vermeyen göz bebeğine böyle denir. BT çekilemiyorsa böyle her hastada fıtıklaşma var sayılır. Yerinden oynayan şakak lobunun iç kısmı, aynı taraftaki göz hareket sinirini sıkıştırır (Kim ve Gean, 2011).
- **Şakaktaki pıhtı daha tehlikeli:** Şakak çukurunda sınırlı kalan pıhtılar unkal fıtıklaşmayı daha çabuk yapar. Bunun için başka yerdekilere göre daha küçük bir hacim yeter (Maugeri ve ark., 2015). Unkal fıtıklaşma bu bölümün sonunda anlatılıyor.
- **Sonuç verisi:** Kore Ulusal Travma Veri Bankası’nda, ağır beyin yaralanması olan (GKS 3–8) ve ameliyat edilen 79 epidural kanamalı hasta incelendi. Ölüm oranı %13,9 idi. Hastaların %60,8’i altıncı ayda iyi durumdaydı (Choi ve ark., 2022).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Maçtan sonra uykuya dalan genç',
      oyku: `19 yaşında bir genç, futbol maçında başının sol yanını rakibin başına çarpıyor. Birkaç saniye bilincini yitiriyor, sonra kalkıp oyuna devam ediyor. İki saat sonra baş ağrısı ve kusma başlıyor. Ailesi onu uykuya dalmış ve zor uyanır buluyor. Acil serviste sol göz bebeği sağdakinden geniş ve ışığa yanıtsız. Vücudunun sağ yarısı güçsüz. BT’de sol şakakta çizgi biçiminde bir kırık ve altında iki yanı dışbükey, parlak bir kan birikimi var.`,
      soru: 'Kan hangi düzlemde toplanmıştır ve neden mercek biçimlidir? Aradaki iyi geçen saatler ve göz bebeği bulgusu nasıl açıklanır?',
      cozum: `**Düzlem ve kaynak:** Bu bir epidural kanamadır. Kan, kafatasının iç yüzü ile sert zarın dış yaprağı arasında toplanır (Khairat ve ark., 2025). En sık şakak ve şakak-yan kafa bölgesinde görülür. Kaynağı çoğunlukla orta meningeal atardamar ya da dalıdır. Çoğunlukla üstteki bir kırıkla birliktedir ve darbe tarafında olur (Kim ve Gean, 2011). Atardamarın yırtılması en sık pterionda olur (Natali ve ark., 2024).

**Biçim:** Sert zar dikişlere sıkıca yapışıktır. Kan dikişleri aşamaz. Önce dikişe kadar yayılır, sonra derine şişer. Bu yüzden mercek biçimlidir (Kim ve Gean, 2011; Heit ve ark., 2017).

**İyi geçen saatler:** Bu bir aydınlık dönemdir. Kan birikir ama henüz beyni sıkıştırmaz (Heit ve ark., 2017). Bu tablo her hastada görülmez (Lee ve ark., 2024).

**Göz bebeği ve güçsüzlük:** Pıhtı büyüyünce şakak lobunun iç-ön kısmı çadır çentiğinden aşağı itilir. Bu unkal fıtıklaşmadır. Aynı taraftaki göz hareket siniri sıkışır ve sol göz bebeği genişler. Karşı yandaki güçsüzlük, beyin sapı ayağının sıkışmasından olur (Hall ve Munakomi, 2026). Şakak çukurundaki pıhtılar daha küçük hacimde ve daha hızlı unkal fıtıklaşma yapar (Maugeri ve ark., 2015). Bu yüzden durum acildir. Kılavuza dayanan bir tabloya göre GKS 8 ya da altındaki ve göz bebekleri eşit olmayan hastada pıhtı boşaltılır (Kim ve Gean, 2011). Tanı ve tedavi kararı beyin cerrahisi ekibine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Epidural kanamada ölçütler ve tuzaklar',
      md: `- **Ameliyat ölçütleri:** Beyin Travması Vakfı bir cerrahi kılavuz yayımladı. Buna göre 30 cm³’ten büyük epidural kanama, GKS puanı ne olursa olsun boşaltılmalıdır (Bullock ve ark., 2006a). Kılavuza dayanan bir özet tabloya göre GKS 8 ya da altındaysa ve göz bebekleri eşit değilse de boşaltılır (Kim ve Gean, 2011).
- **Ameliyatsız izlem:** Aynı tabloya göre şu koşulların hepsi varsa hasta ameliyatsız izlenebilir: hacim 30 cm³’ten az, kalınlık 15 mm’den az, orta hat kayması 5 mm’den az, GKS 8’in üstünde ve odak bulgusu yok (Kim ve Gean, 2011).
- **İzlenen pıhtı büyüyebilir:** Aktarılan bir seride küçük akut epidural kanamaların %65’i ilk 24 saatte büyüdü (Paiva ve ark., 2014). Zwayed ve Lucke-Wold’un aktardığı yayınlara göre epidural kanamalı hastaların %23’ünde pıhtı büyür. Büyüme ortalama olarak yaralanmadan sonraki 8 saat içinde olur (Zwayed ve Lucke-Wold, 2018). Yazarların kendi serisinde seçilmiş 62 hasta ameliyatsız izlendi: GKS 13–15, pıhtı kalınlığı 40 mm’den az, orta hat kayması 6 mm’den az. Bu hastaların hiçbiri acil girişim gerektirmedi (Zwayed ve Lucke-Wold, 2018). Bir başka kaynağa göre başta ameliyatsız izlenenlerin %11,2–32’sinde pıhtı büyüdü ve kraniyotomi gerekti (Suzuki ve ark., 2025). Kraniyotomi, kafatasından bir kemik kapağın kaldırıldığı ameliyattır.
- **Sahte anevrizma:** Kırığı orta meningeal atardamarın yolunu kesen hastada sahte anevrizma (psödoanevrizma) akla gelmelidir. Bu hastalarda gecikmiş kanama ve uzamış aydınlık dönem daha olasıdır (Paiva ve ark., 2014). São Paulo’daki bu çalışmada 11 hasta BT anjiyografi ve kateter anjiyografiyle incelendi. 8’i erkek, 3’ü kadındı; ortalama yaş 25,3 idi (Paiva ve ark., 2014).
- **Tepe (verteks) kanaması:** Kaynak çoğunlukla üst sagital sinüstür. Orta hattı geçen kırık ve taç dikişinin ayrılması ipucudur. 29 olguluk bir seride hastaların %82,7’si ameliyatsız izlemle düzeldi (Ramesh ve ark., 2017).
- **Türkiye’den orta hat serisi:** İstanbul’dan Güçlü ve arkadaşlarına göre orta hattaki epidural kanama bütün kafa travmalarının yaklaşık %0,024’ü, epidural kanamaların %1–8’idir. 2013–2018’de ameliyat edilen 9 hastanın hepsinde kaynak, üst sagital sinüs duvarındaki ya da bir araknoid granülasyondaki yırtıktı. Sinüsü korumak için iki ayrı kemik kapak kaldırıldı. Sinüsün üstünde 3 cm genişliğinde bir kemik şerit bırakıldı (Güçlü ve ark., 2022).
- **Çocukta arka çukur:** Bir meta-analizde iyi işlevsel sonuç, ameliyat edilen çocuklarda %93,68, ameliyatsız izlenenlerde %99,99 idi. Ameliyat edilenlerde birleştirilmiş ölüm %0,57 idi (Lee ve ark., 2024).
- **Kötü sonucu ne belirler?** Kore Travma Veri Bankası’nın 285 epidural kanama olgusunda en güçlü belirleyici beyin yaralanmasının ağırlığıydı. Ağır yaralanmada olasılık oranı 55,56 idi (Jeong ve ark., 2016). Ameliyat edilen 79 ağır yaralı hastada iki göz bebeği de ışığa yanıtsızsa ölüm %30,8, iyi sonuç da %30,8 idi (Choi ve ark., 2022).`,
    },

    // ——— Akut subdural kanama ———
    {
      tur: 'metin',
      md: `**Subdural kanama: sert zarın hemen altında.** Beynin yüzeyindeki toplardamarlar, kanlarını sert zarın içindeki toplardamar kanallarına, yani **sinüslere** boşaltır. Bunu, sert zarı geçen **köprü toplardamarları** sağlar (Joost ve ark., 2026). Bu toplardamarlar sert zar ile örümcek ağı zar arasındaki düzlemi aşar. Duvarları incedir. Başa gelen zıt yönlü kuvvetlerle yırtılabilirler. O zaman kan bu düzleme dolar (Pierre ve ark., 2026). Köprü toplardamarlarının yapısı “Sert zarın toplardamar sinüsleri” bölümünde anlatıldı.

Bu düzlem sağlıklı insanda bir boşluk değildir. Sert zarın en iç katmanı, mekanik olarak zayıf bir tabakadır: **sınır hücre katmanı**. Köprü toplardamarından sızan kan bu tabakaya dolar ve onu açar. Böylece yapay bir subdural boşluk oluşur (Joost ve ark., 2026). Klinikte bu kanamaya yine de alışkanlıkla “subdural” denir.

**Neden hilal biçimli?** Kan sert zarın derininde olduğu için dikişler onu yana doğru durduramaz. BT’de hilal (orak ay) biçiminde görünür. Dikiş çizgilerini geçebilir, ama orta hattı geçmez (Kim ve Gean, 2011). Onu içte beyin orağı, aşağıda beyincik çadırı durdurur (Heit ve ark., 2017).

Subdural kanama çoğunlukla toplardamar kökenlidir ve yana geniş yayılabilir. Bu yüzden epidural kanamaya göre daha yavaş belirti verir (Heit ve ark., 2017).

**Neden bebekte ve yaşlıda?** Bebeklerde ve yaşlılarda sert zar ile beyin arasındaki aralık sık sık daha geniştir. Kaynak bunu beyin hacminin azalmasına bağlar. Aralık genişleyince köprü toplardamarları gerilir ve kolay yırtılır (Pierre ve ark., 2026). Yaşlılar ayrıca düşmeye daha yatkındır. Birçoğu kanı sulandıran ilaçlar da kullanır (Manivannan ve ark., 2021).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Darbe tarafı ve karşı taraf.** Subdural kanama darbenin vurduğu tarafta da olabilir, karşı tarafta (*contrecoup*) da. Karşı taraf daha sıktır. Köprü toplardamarları gerildikçe ve zedelendikçe kan, sert zarın meningeal yaprağı ile örümcek ağı zar arasında birikmeyi sürdürebilir (Kim ve Gean, 2011). Kafatası kırığı, epidural kanamadakinden daha az eşlik eder (Heit ve ark., 2017).

**Kanamanın yaşı.** Kullanılan zaman çizelgesi şöyledir (Pierre ve ark., 2026):

- **Akut:** yaralanmadan sonraki ilk 72 saatte görüntülenen kan.
- **Alt akut:** 3–21 gün.
- **Kronik:** genellikle 3 haftadan sonra. Karışık yoğunluklu ve “akut üstüne kronik” birikintiler, kanamanın tekrar tekrar olduğunu gösterir.

**Sıklık ve ölüm.** Akut subdural kanama, kafa travmasıyla yatan hastaların yaklaşık %10–20’sinde bulunur. GKS 8 ya da altındaki ağır yaralanmalarda bu oran yaklaşık %60’tır (Karibe ve ark., 2014). GKS, yani Glasgow Koma Skalası, bilinç düzeyini puanlayan bir ölçektir. Puanın 9’un altında olması koma sayılır (Bullock ve ark., 2006b). Ölüm oranı bütün GKS düzeylerinde yaklaşık %30–60, GKS 8 ve altında %55–70 olarak bildirilmiştir (Karibe ve ark., 2014).

**Yaşlılar.** On çalışmalık bir meta-analize göre ameliyat edilen yaşlılarda ölüm taburculukta %39,8’dir. Uzun izlemde %49,3’e çıkar. Taburculukta kötü işlevsel sonuç oranı yaklaşık %81’dir (Manivannan ve ark., 2021). Kan sulandırıcı kullanan yaşlılarda, hafif bir travmadan sonra gecikmiş akut subdural kanama gelişebilir. Bu yüzden gözlem için hastaneye yatış önerilir (Karibe ve ark., 2014).

**Bebekler.** Bebekte sert zar ile beyin arasındaki aralık geniş olabilir. Bu, köprü toplardamarlarını gerilmeye ve yırtılmaya yatkın kılar. Beyin küçülmesi ve sıvıyı boşaltan bir boru (şant) takılmış olması da riski artırır (Araki ve ark., 2017). Bebeklikte istismara bağlı kafa travmasında en sık görülen bulgu subdural kanamadır. Bu oran olguların %92’sine kadar çıkar (Cheshire ve ark., 2018).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'BT’de kanamayı okumak',
      md: `- **Mercek mi, hilal mi?** Epidural kanama iki yanı dışbükey, mercek biçimlidir ve dikişleri geçmez. Subdural kanama hilal biçimlidir ve orta hattı geçmez, ama dikişleri geçebilir (Kim ve Gean, 2011).
- **Akut kan parlaktır:** Akut epidural kanama BT’de kemik ile sert zar arasında yoğun (beyaz) bir birikimdir (Heit ve ark., 2017).
- **İnce kanamayı kaçırma:** Küçük subdural kanamalar kemiğe yakın oldukları için gözden kaçabilir. Bu yüzden özel bir “subdural pencere” ayarı önerilir. Heit ve arkadaşları metinde pencere genişliği 130, düzeyi 30 önerir. Aynı makalenin şekil açıklamasında genişlik 150’dir (Heit ve ark., 2017).
- **Basıncın izleri:** BT’de taban sisternalarının sıkışması ya da kaybolması, kafa içi basıncın yükselme riskini üç kat artırır. Ölümü de iki-üç kat artırır (Kim ve Gean, 2011). Marshall BT sınıflamasında orta hat kayması 5 mm’yi geçen yaygın yaralanmada (evre IV) taburculukta ölüm %56’dır (Kim ve Gean, 2011).
- **Büyük subdural kanama:** Taban sisternalarını siler. Orak altı ve unkal fıtıklaşma yapabilir (Heit ve ark., 2017).
- **Subaraknoid kanamada BT:** Bir derlemeye göre BT, belirtilerden sonraki ilk 6–24 saatte akut subaraknoid kanamayı neredeyse %100 duyarlılıkla gösterir (Heit ve ark., 2017). Kanada’daki büyük bir çalışma ise %100 duyarlılığı yalnızca ilk 6 saatte çekilen BT’de buldu. Saatler geçtikçe BT’nin duyarlılığı düşer (Perry ve ark., 2011). Bu yüzden BT 6 saatten sonra çekildiyse ve temizse bel delme (lomber ponksiyon) düşünülür (NICE, 2022).
- **MR’da travmatik subaraknoid kanama:** FLAIR, normalde BOS’u koyu gösteren bir MR çekimidir. Kan, FLAIR’de oluklarda parlak görülür. GRE (gradyan eko) ya da SWI (duyarlılık ağırlıklı görüntüleme) çekimlerinde ise koyu görülür. FLAIR ile SWI birlikte, akut subaraknoid kanamayı göstermekte BT’den üstündür (Heit ve ark., 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Akut subdural kanamada ölçütler ve özel durumlar',
      md: `- **Ameliyat ölçütleri:** Kılavuza göre bazı akut subdural kanamalar, GKS ne olursa olsun boşaltılmalıdır. Bunlar kalınlığı 10 mm’yi ya da orta hat kayması 5 mm’yi geçen kanamalardır (Bullock ve ark., 2006b; Kim ve Gean, 2011). Komadaki (GKS 9’un altı) bütün hastalarda kafa içi basıncı izlenmelidir. Komadaki hastada ameliyat gerekiyorsa kraniyotomi yapılır. Kemik kapağı çıkarıp sert zarı genişletmek de seçenekler arasındadır (Bullock ve ark., 2006b).
- **Kayma ile kalınlık farkı:** İlk BT’de orta hat kayması, pıhtı kalınlığından 3 mm ya da daha fazla olabilir. Bu fark, bütün olgularda ölümü öngördü. Bu fark beyin şişmesinin göstergesidir. Özgüllük 1,0 idi, ama duyarlılık düşüktü (Bartels ve ark., 2015).
- **Karşı tarafta yeni kanama:** Akut subdural kanama boşaltıldıktan sonra karşı tarafta akut epidural kanama gelişebilir. Nadir ama yıkıcı bu durum, ameliyat edilenlerde %6–30 oranında bildirilmiştir. Kaynak bunu karşı taraftaki baskının (tamponad etkisi) kalkmasına bağlar (Karibe ve ark., 2014).
- **Doğal seyir:** Ameliyatsız izlenen 177 akut subdural kanamanın %76,8’i kendiliğinden geriledi, çoğu 1–4 haftada. %6,8’i hızla kötüleşti ve ameliyat gerekti (Son ve ark., 2013).
- **Atardamar kaynağı:** Subdural kanama nadiren bu düzlemi geçen küçük atardamar dallarının yırtılmasıyla olur (Kim ve ark., 2024). Kayseri’den Koç ve arkadaşları, travmasız ve ani baş ağrısıyla başlayan 5 akut subdural kanama bildirdi. Hepsinde kaynak, ameliyatta Sylvius bölgesi yakınındaki bir kabuk atardamarıydı (Koç ve ark., 1997).
- **Orak yoksa:** Beyin orağı normalde subdural kanamayı tek yarımkürede tutar. Orağı olmayanlarda kanama orta hattı geçebilir (Ishikawa ve ark., 2026). İstanbul’dan bir olguda 49 yaşında bir kadında üst sagital sinüs ve beyin orağı hiç yoktu. İki taraflı, alt akut bir subdural kanama orta hattı geçmişti. Hastada kendiliğinden kafa içi düşük basınç düşünüldü (Kocak ve ark., 2013).
- **Bebek ve çocuk:** Yenidoğan ve bebeklerde köprü toplardamarlarının duvarı bazen yalnızca 5–7 µm kalınlıktadır. Bu duvar daha büyük çocuklarınkinden ve erişkinlerinkinden incedir (Cheshire ve ark., 2024). Bursa’dan bir seride 8 ay ile 15 yaş arasında 11 çocuk vardı. Bu çocuklara yaralanmadan sonraki 2 saat içinde dekompresif kraniyektomi yapıldı ve sert zar genişletildi (Taşkapılıoğlu ve ark., 2019). Dekompresif kraniyektomide kafatasının bir bölümü çıkarılır ve hemen yerine konmaz.
- **Sonucu ne öngörür?** Yozgat’tan bir kapsam derlemesine göre ölümü ve işlevsel sonucu en güçlü öngörenler şunlardır: başvurudaki GKS, göz bebeği tepkisi, yaş, orta hat kayması, taban sisternalarının basısı ve yaygın beyin şişmesi (Eryilmaz, 2026).`,
    },

    // ——— Kronik subdural kanama ———
    {
      tur: 'metin',
      md: `**Kronik subdural kanama: haftalar içinde büyüyen birikinti.** Bu kanama özellikle yaşlılarda görülür. Kan, düşük basınçlı bir toplardamardan yavaş yavaş sızar. Kapalı bir aralıkta biriktiği için pıhtı yavaş büyür. Bu yüzden hastaların çoğunda yakınmalar yaralanmadan haftalar sonra başlar (Nouri ve ark., 2021).

Kronik subdural kanama, akut kanamanın yalnızca eskimiş hâli değildir. Biyolojik olarak farklı bir hastalıktır. Kanın çevresinde yeni zarlar oluşur. Bu zarlarda yeni damarlar gelişir. İltihap, pıhtının fazla erimesi ve tekrarlayan küçük kanamalar birikintiyi besler (Pierre ve ark., 2026).

Hastalık giderek sıklaşıyor. Bugünkü gidişle 2030’a kadar en sık kafa içi beyin cerrahisi hastalığı olması bekleniyor (Pierre ve ark., 2026; Chen ve ark., 2024). Tedavi yöntemlerinden biri, kafatasında küçük bir delik açıp birikintiyi boşaltmaktır (Tugcu ve ark., 2014). Ameliyattan sonra kanama yeniden toplanabilir. Buna **nüks** denir ve bu hastalığın başlıca sorunudur (Nouri ve ark., 2021). Nüksü azaltmak için yeni bir yöntem de deneniyor: sert zarı besleyen atardamarı damarın içinden tıkamak. Bu yöntemin yeri henüz kesinleşmedi (Gillespie ve ark., 2025).

Köprü toplardamarının beyin küçülünce nasıl gerildiğini “Sert zarın toplardamar sinüsleri” bölümündeki çizimde görebilirsin. Kanamanın çevresinde oluşan zarlar da orada gösterilir (“Beyin küçülünce” ve “Kronik subdural kanama” düğmeleri).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kanama nerede başlar?** Bir derlemeye göre genel kabul şudur: İlk kanama, köprü toplardamarlarının sert zarın sınır hücre katmanını geçtiği yerde olur (Nouri ve ark., 2021). Köprü toplardamarının duvarı en ince yerine burada iner. Bazen tek sıra endotel hücresi kadar incedir (Nouri ve ark., 2021). Endotel, damarın içini döşeyen hücre tabakasıdır. Sınır hücre katmanı yassı, uzun ve birbirine gevşek bağlı hücrelerden yapılıdır. Bu yüzden doğal bir ayrılma düzlemidir (Nouri ve ark., 2021). Bu görüş tartışmalıdır. Başka bir derlemeye göre hastalığı asıl başlatan, sınır hücrelerinin hasarı ve ardından gelen iltihap olabilir (Edlmann ve ark., 2017).

**İki zar.** Sınır hücreleri ayrılınca iki zar oluşur. Aralarında sıvı ve kanla dolan yeni bir boşluk kalır (Edlmann ve ark., 2017). Dış zar sert zarın iç yüzüne sıkıca yapışır. Daha ince olan iç zar ise örümcek ağı zara gevşek tutunur (Kim ve ark., 2024). Yeni damarlar sınır katmanında ve dış zarda yoğundur. İç zarda genellikle yeni damar oluşmaz. İç zardaki damarlar, kanama olgunlaştıkça kaybolur (Kim ve ark., 2024).

**Neden büyür?** Dış zar, iltihabı ve damar oluşumunu süren maddeler salgılar. Bunlar arasında pıhtı eritmeye yardım eden tPA ve damar büyüme etkeni VEGF vardır (Edlmann ve ark., 2017). Dış zarın geçirgen, geniş kılcallarından sıvı da sızar. Türkiye’den Tokmak ve arkadaşları 24 hastada bu sızmayı işaretli albüminle ölçtü. Ortalama sızma oranı %13,24 idi (Tokmak ve ark., 2007). Oran, ağır klinik evre, BT’de karışık yoğunluk ve yeniden birikmeyle ilişkiliydi (Tokmak ve ark., 2007).

**Görüntülemede zarlar.** Kontrastlı MR ve çift enerjili BT çalışmalarında önce dış zar kalınlaşır. Geç evrede iç zarlar gelişir (Chen ve ark., 2024). Dış ve iç zar arasındaki geçiş bölgesinde üçgen biçimli, kalınlaşmış bir doku görülebilir. Buna “spandrel işareti” denir (Chen ve ark., 2024).

**Kimde?** Erkeklerde daha sıktır. Türkiye’den Kanat ve arkadaşlarının ameliyat ettiği 76 hastanın %81,6’sı erkekti (Kanat ve ark., 2010). Sıklık giderek artıyor. Sayılar aşağıdaki tablodadır.

**Nüks.** Yeniden ameliyat gerektiren nüks %9–33 arasında bildirilir. İleri yaşta ve iki taraflı kanamada daha sıktır (Nouri ve ark., 2021). Türkiye’de tek delikle boşaltılan 292 hastanın %14,7’si ikinci kez ameliyat edildi. Nüks iki taraflı kanamada %23,1, tek taraflıda %11,4 idi (Tugcu ve ark., 2014). Finlandiya’daki kohortta nükse kadar geçen ortanca süre 25 gündü. Dren konanlarda nüks daha azdı: %17’ye karşı %29 (Rauhala ve ark., 2020). Dren, birikintiyi ameliyattan sonra da boşaltan ince bir borudur.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kronik subdural kanama ne sıklıkta?',
      sutunlar: ['Nerede, kimde?', 'Neyi saydı?', 'Sıklık (100.000 kişide, yılda)', 'Kaynak'],
      satirlar: [
        [
          'Finlandiya (Pirkanmaa), yetişkinler; 1990–1995’ten 2011–2015’e',
          'Ameliyat edilen olgular',
          '7,2’den 13,4’e. 80 yaş ve üstünde 36,6’dan 91’e',
          'Rauhala ve ark. (2020)',
        ],
        ['Aynı Fin kohortu, 1990–2015', 'Bütün olgular', '8,2’den 17,6’ya; 25 yılda iki katı', 'Rauhala ve ark. (2020)'],
        [
          'İsviçre, çok merkezli, 663 hasta',
          'Toplum tabanlı',
          '8,2 (erkek 10,8, kadın 5,5). 90 yaş ve üstü erkekte 131,5',
          'El Rahal ve ark. (2023)',
        ],
        ['ABD, güncel veri', 'Derleme özeti', '17,3. 85 yaş üstü erkekte 350’nin üstü', 'Pierre ve ark. (2026)'],
        ['Yayınların özeti', 'Genel toplum', 'Yaklaşık 10. Yaşlılarda 100’e kadar', 'Chen ve ark. (2024)'],
        ['Yayınların özeti', 'Genel toplum', '1,7–20,6. Yaşlılarda 58,1', 'Seçen ve ark. (2026)'],
      ],
      not: 'Sıklık, hangi olguların sayıldığına (yalnızca ameliyat edilenler mi, bütün tanılar mı) ve yaşa göre çok değişir. Bir derlemede dört çalışma çifti, son 50 yılda %200–600 artış gösterdi (Stubbs ve ark., 2021). İsviçre çalışmasında ortanca yaş 76, kadın/erkek oranı 1:1,9 idi (El Rahal ve ark., 2023).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kimde düşünülür? Düşük basınçla bağlantı',
      md: `- **Risk grubu:** İleri yaş, beyin küçülmesi, düşme ve kan sulandırıcı kullanımı (Manivannan ve ark., 2021; Pierre ve ark., 2026).
- **Düşük kafa içi basıncı:** Basınç düşükse beyin aşağı doğru yer değiştirir. Bu da köprü toplardamarlarını ve örümcek ağı zarın küçük damarlarını gerer (Nouri ve ark., 2021). Kendiliğinden kafa içi düşük basınçlı hastalarda subdural kanama olguların %16–57’sinde bildirilmiştir (Orru ve ark., 2026). Travma, pıhtılaşma bozukluğu ya da alkol öyküsü olmayan subdural kanamalı hastada, omurgada bir BOS kaçağı aranmalıdır (Cheema ve ark., 2023). Bu hastalığın ayrıntısı “Zar iltihapları, tümörler ve basınç bozuklukları” bölümündedir.
- **Kemikleşen birikinti:** Türkiye kaynaklı bir sistematik derleme, kireçlenmiş ya da kemikleşmiş kronik subdural kanamanın 114 olgusunu topladı. Bu biçim ABD, Japonya ve Türkiye’de daha sık bildirilmişti (Turgut ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kronik subdural kanama nereden başlar?',
      md: `- **Köprü toplardamarı görüşü:** Genel kabule göre ilk kanama, köprü toplardamarlarının sınır hücre katmanını geçtiği yerde olur (Nouri ve ark., 2021).
- **İtiraz:** Edlmann ve arkadaşları bu görüşü sorgular. Kronik kanamada kan, beyin kubbesi boyunca geniş bir alana yayılır. Köprü toplardamarları ise orta hattaki sinüslerin komşusudur. Bu yayılım, kaynağın köprü toplardamarı olmasıyla bağdaşmaz (Edlmann ve ark., 2017).
- **Sınır hücre görüşü:** Aynı yazarlara göre kronik kanama, “sert zar sınır hücreleri”nde başlar. Asıl tetik kanın kendisi değil, bu hücrelerin hasarı olabilir (Edlmann ve ark., 2017). Bir görüntüleme derlemesi de hastalığın, tetik ne olursa olsun, sınır hücre katmanının zedelenmesiyle başladığını yazar (Chen ve ark., 2024).
- **Doku kanıtı:** Seul’den Kim ve arkadaşları normal sert zarı üç katmana ayırdı: periost, meningeal ve sınır hücre katmanı. Sınır hücre katmanı ile kronik kanamanın dış zarı mikroskopta ayırt edilemedi. Bu, dış zarın bu katmandan köken aldığını düşündürür (Kim ve ark., 2024).
- **BOS izi:** Kronik subdural sıvıların %93’ünde, BOS’u gösteren bir protein (beta-trace protein) bulundu. En yüksek düzeyler nükseden hastalardaydı (Edlmann ve ark., 2017).
- **Ad tartışması:** Haines 1991’de, “subdural hematom” denen kanamanın çoğu zaman sınır hücre katmanının içinde olduğunu savundu (Haines, 1991). 2026 tarihli bir derleme bu yüzden “sert zar sınır hematomu” adını önerir (De Simone ve ark., 2026).
- **Tarih:** 1856’da Rudolf Virchow, Fransız patologların subdural kan birikimi dediği tabloya *pachymeningitis interna haemorrhagica* adını verdi. Zarların iltihaplı olduğunu savundu. Bu görüş Almanca konuşulan tıp dünyasında bir sapmaya yol açtı. Hekimler yarım yüzyıl iltihabi bir neden aradı (Berthold ve ark., 2025).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Orta meningeal atardamar embolizasyonu.** Orta meningeal atardamar sert zarı besler. Yöntemin dayandığı düşünce şudur: Bu atardamar damarın içinden tıkanırsa (embolizasyon), subdural zarlar ve yeni damarlar kansız kalıp ölebilir. Böylece nüks önlenebilir (Chen ve ark., 2024). Bu bir varsayımdır. Onu sınamak için büyük randomize çalışmalar başlatıldı (Chen ve ark., 2024). Embolizasyon, damarın içinde ilerletilen ince bir boruyla (kateter) tıkayıcı bir madde verilmesidir. Yöntem 2018’de dikkat çekti. Chen ve arkadaşlarının aktardığına göre Ban ve arkadaşları embolizasyonla nüksü %1,4, geleneksel tedaviyle %27,5 buldu (Chen ve ark., 2024).

**Anatomi neden önemli?**

- Atardamar çoğu kişide maksiller atardamarın ilk bölümünden çıkar. Kafatasına *foramen spinosum*’dan girer. Orta kafa çukurunda ön ve arka dallara ayrılır (Ota, 2026).
- Bazı kişilerde orta meningeal atardamar göz atardamarından çıkar. Bu, anjiyografi serilerinin %0,5–2’sinde görülür. Bu varyantta embolizasyon görme kaybı riski taşır (Ota, 2026).
- Atardamarın küçük dalları sagital dikişi geçip karşı taraftakiyle bağlanır. Bu, tek taraflı kanamada iki taraflı embolizasyonu gerekçelendirebilir (Ota, 2026).
- Sert zarın sınır hücre katmanında 5–15 μm çaplı, narin bir kılcal ağ vardır. Bu ağ normalde seyrektir. Kronik subdural kanamada olgunlaşmamış, sızdıran damarlarla çoğalır (Ota, 2026).
- MAGIC-MT çalışmasının yöntem yazısına göre tıkamadan önce seçici anjiyografi yapılır. Göz atardamarına ve kayalık kemiğe giden dallar gibi tehlikeli bağlantılar aranır. Ardından sıvı bir tıkayıcı madde (Onyx-18) verilir (Zuo ve ark., 2023).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Orta meningeal atardamar embolizasyonu: üç randomize çalışma ve bir meta-analiz',
      sutunlar: ['Çalışma', 'Kimde?', 'Ne ölçüldü?', 'Sonuç', 'Güvenlik'],
      satirlar: [
        [
          'EMBOLISE (Davies ve ark., 2024)',
          '400 hasta; embolizasyon ameliyata eklendi',
          'Yeniden ameliyat gerektiren nüks ya da büyüme (90 gün)',
          '%4,1’e karşı %11,3; embolizasyon kolunda daha az',
          'Embolizasyona bağlı ciddi yan etki %2,0 (2 hastada sakatlatıcı inme). 90. gün ölümü %5,1’e karşı %3,0',
        ],
        [
          'MAGIC-MT (Liu ve ark., 2024)',
          'Çin; 722 hasta',
          'Belirti veren nüks ya da ilerleme (90 gün)',
          '%6,7’ye karşı %9,9; fark anlamlı değil',
          'Ciddi yan etki embolizasyon kolunda daha az: %6,7’ye karşı %11,6',
        ],
        [
          'STEM (Fiorella ve ark., 2025)',
          '310 hasta; ortalama yaş 73; %70 erkek',
          'Birincil olumsuz olay',
          '%16’ya karşı %36; olasılık oranı 0,36',
          '30 günde sakatlatıcı inme ya da ölüm %3’e karşı %3. 180 günde ölüm %8’e karşı %5 (nörolojik nedenli ölüm %1’e karşı %2)',
        ],
        [
          'Meta-analiz (Gillespie ve ark., 2025)',
          'Üç çalışmadan 1432 hasta',
          'Belirti veren ilerleme ya da nüks',
          'Genel etki anlamlılık sınırında (RR 0,50; p = 0,058). Ameliyatsız izlenenlerde ilerleme azaldı (RR 0,36). Ameliyat edilenlerde nüks anlamlı azalmadı (RR 0,60)',
          'Güvenlik ayrıca incelenmedi. İşlevsel sonuçta fark yoktu (RR 1,01)',
        ],
      ],
      not: 'EMBOLISE, MAGIC-MT ve STEM’in yalnızca özetleri okundu. Tablo özette yazanla sınırlıdır. Üç çalışmanın ölçtüğü şey de birbirinden farklıdır (“Ne ölçüldü?” sütunu). Bu yüzden sonuçlar doğrudan karşılaştırılamaz. RR: göreli risk; 1’in altındaki değer, embolizasyon kolunda daha az olay demektir.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Embolizasyon: henüz kesinleşmiş bir tedavi değil',
      md: `- **Sonuçlar çelişiyor:** EMBOLISE ve STEM özetlerinde embolizasyon kolunda olumsuz olay daha azdı. MAGIC-MT’de ise fark anlamlı değildi (Davies ve ark., 2024; Fiorella ve ark., 2025; Liu ve ark., 2024). Üçünün meta-analizi, ameliyat edilen hastalarda anlamlı yarar bulmadı. Yarar ameliyatsız izlenen hastalarda görüldü (Gillespie ve ark., 2025).
- **Derlemeler de farklı yazar:** Chen ve arkadaşlarının 2024 derlemesine göre üç çalışma da nüks için birincil hedefine ulaştı. Derleme, embolizasyonun güvenli olduğunu da yazar (Chen ve ark., 2024). MAGIC-MT’nin yayımlanmış özeti ise birincil ölçütte anlamlı fark bulmadığını bildirir (Liu ve ark., 2024). Bir bilgiyi okurken kaynağın tarihine ve türüne bak.
- **Avrupa uzlaşısı:** Çok disiplinli bir Avrupa kurulu, embolizasyonun bütün nükslerde ameliyata ek olarak düşünülmesini önerdi. Ameliyatın pıhtılaşma bozukluğu ya da kan sulandırıcı yüzünden yapılamadığı ilk ve nüks olgularda ise tek başına düşünülebilir (Bartek ve ark., 2024).
- **Türkiye’den bir seri:** Ankara’da (Bilkent Şehir Hastanesi) travmaya bağlı kronik subdural kanamalı 52 hastaya embolizasyon yapıldı. 43 hastaya (%82,7) yalnız embolizasyon, 9 hastaya (%17,3) embolizasyonla birlikte ameliyat uygulandı. Ameliyat da eklenen hastalarda işlem öncesi orta hat kayması daha büyüktü: 7,6 ± 3,9 mm’ye karşı 4,5 ± 3,8 mm (Seçen ve ark., 2026).
- **Nüksü görüntü öngörebilir mi?** Zar görüntülemesinde nüksü en çok, Nakaguchi ve Nomura sınıflamalarından gelen “derecelenme” alt tipi öngördü (Chen ve ark., 2024). Zarların, özellikle alt şakak ve alın lobları üstündeki ulaşılması zor kısımlarının eksik çıkarılması da nüksle ilişkilidir (Chen ve ark., 2024).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Beş hafta önceki düşme',
      oyku: `81 yaşında bir adam, kan sulandırıcı bir ilaç kullanıyor. Beş hafta önce banyoda kayıp başını lavaboya çarpmış. O gün yakınması olmamış. Son iki haftada baş ağrısı artmış, sağ eli beceriksizleşmiş. BT’de sol yarımkürenin yüzeyini örten, hilal biçimli ve karışık yoğunluklu bir birikinti var. İçinde ince bölmeler seçiliyor. Orta hat 8 mm sağa kaymış.`,
      soru: 'Kan hangi katmanda toplanmıştır? Neden yaşlıda sık görülür ve neden haftalar sonra belirti verir? Tedavide nelere dikkat edilir?',
      cozum: `**Katman:** Sağlıklı insanda gerçek bir subdural boşluk yoktur. Sert zarın en iç katmanı olan sınır hücre katmanı yarılır ve kan bu yarıkta toplanır (Ishikawa ve ark., 2026). Sınır hücreleri ayrılınca iki zar oluşur. Arada sıvı ve kanla dolan yeni bir boşluk kalır (Edlmann ve ark., 2017). BT’deki ince bölmeler bu zarlara uyar.

**Neden yaşlıda?** Beyin hacmi azalınca sert zar ile beyin arasındaki aralık genişler. Köprü toplardamarları gerilir ve kolay yırtılır (Pierre ve ark., 2026). Yaşlılar ayrıca düşmeye yatkındır ve birçoğu kan sulandırıcı kullanır (Manivannan ve ark., 2021).

**Neden haftalar sonra?** Kan düşük basınçlı toplardamardan sızar ve pıhtı yavaş büyür. Hastaların çoğu yaralanmadan haftalar sonra belirti verir (Nouri ve ark., 2021). Karışık yoğunluk, kanamanın tekrar tekrar olduğunu gösterir (Pierre ve ark., 2026).

**Tedavi ve nüks:** Nüks %9–33 arasında bildirilir. İleri yaşta ve iki taraflı kanamada daha sıktır (Nouri ve ark., 2021). Ameliyata eklenen orta meningeal atardamar embolizasyonu bir randomize çalışmada yeniden ameliyat gerektiren nüksü azalttı (Davies ve ark., 2024). Üç çalışmanın meta-analizi ise ameliyat edilenlerde anlamlı yarar bulmadı (Gillespie ve ark., 2025). Avrupa uzlaşısı, embolizasyonun bütün nükslerde ameliyata ek olarak düşünülmesini önerir (Bartek ve ark., 2024). Yöntem yenidir ve yeri henüz kesinleşmedi. Kan sulandırıcının nasıl yönetileceğine ve tedaviye hastayı izleyen ekip karar verir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Subaraknoid kanama ———
    {
      tur: 'metin',
      md: `**Subaraknoid kanama: kan BOS’un içinde.** Subaraknoid boşluk, örümcek ağı zar ile yumuşak zar arasındadır. İçinde BOS ve beyni besleyen damarlar bulunur. Bu boşluğa kan dolmasına subaraknoid kanama denir (Ziu ve ark., 2023).

Travma dışı subaraknoid kanamaların yaklaşık %85’inin nedeni, kafa içindeki bir **anevrizmanın** yırtılmasıdır (Ziu ve ark., 2023). Anevrizma, atardamar duvarında oluşan bir kesecik ya da şişkinliktir. Anevrizmaların çoğu beynin tabanındaki sisternalarda bulunur (Heit ve ark., 2017). Sisterna, subaraknoid boşluğun genişlediği yerdir. Bu yüzden anevrizma kanaması taban sisternalarını tutar (Heit ve ark., 2017).

En sık belirti, birden başlayan çok şiddetli bir baş ağrısıdır. Ense sertliği, kısa ya da uzun bir bilinç kaybı ve vücudun bir bölümünde güç ya da duyu kaybı eşlik edebilir (Claassen ve Park, 2022). Kafa travmasında da subaraknoid kanama sıktır: orta ve ağır kafa travmalı hastaların %33–60’ında görülür (Griswold ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Birkaç dakikada zirve yapan baş ağrısı',
      md: '“Şimşek gibi” baş ağrısı birden başlar ve genellikle 1–5 dakika içinde en şiddetli düzeyine ulaşır. Bu, subaraknoid kanamanın uyarıcı belirtisidir (NICE, 2022). Onu öteki baş ağrılarından ayıran şey şiddeti değil, zirveye ne kadar hızlı ulaştığıdır (Sekhon ve ark., 2023). Böyle baş ağrısı olanların çoğunda kanama yoktur. Migren, öksürük ya da efor da bu tür bir ağrı yapabilir. Ama bu, araştırmayı engellememelidir (NICE, 2022). Bu yüzden böyle bir baş ağrısında hemen tıbbi yardım istenir.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Epidural:** kemik ile sert zar arası. Çoğunlukla orta meningeal atardamar, şakakta. Mercek biçimli, dikişleri geçmez. Aydınlık dönem olabilir.
- **Akut subdural:** sert zarın en iç katmanında açılan yarık. Köprü toplardamarları kanar. Hilal biçimli, orta hattı geçmez.
- **Kronik subdural:** yaşlıda, küçük bir çarpmadan haftalar sonra. Zarlarla çevrilidir ve yeniden toplanabilir (nüks).
- **Subaraknoid:** örümcek ağı zar ile yumuşak zar arası, yani BOS’un içi. Travma dışında çoğunlukla anevrizma. Birkaç dakikada zirve yapan baş ağrısı.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Anevrizmanın yapısı ve yeri.** Beyin anevrizmalarının %90’ı kesecik (çilek, *berry*) biçimlidir. Yaklaşık %85’i Willis halkasının ön dolaşımında, atardamarların dallandığı noktalardadır (Faluk ve ark., 2024). Willis halkası, beynin tabanında atardamarları birbirine bağlayan halkadır. Ayrıntısı “Beynin atardamarları ve Willis halkası” dersinde anlatılacak. Kesecik anevrizmanın duvarında orta kas katmanı incelmiş ya da yoktur. İç elastik zar da parçalanmıştır (Okal ve Foster, 2026). Kanamalı inmeler bütün inmelerin yaklaşık %20’sidir. Subaraknoid kanama ve beyin içi kanama bunu yarı yarıya paylaşır, her biri yaklaşık %10 (Ziu ve ark., 2023).

**Tanı.** Acil serviste baş ağrısı, başvuruların yaklaşık %2’sidir. Bu hastaların yaklaşık %1’inde subaraknoid kanama bulunur (Perry ve ark., 2011). Kanada’da 3132 hastalık bir çalışmada, baş ağrısının ilk 6 saatinde çekilen BT radyolog yorumuyla bütün kanamaları gösterdi. 953 hastadaki 121 kanamanın hepsi bulundu: duyarlılık %100 (Perry ve ark., 2011). Bütün zaman aralıkları birlikte alınınca BT’nin duyarlılığı %92,9’a düştü (Perry ve ark., 2011).

NICE kılavuzu (2022) şunları önerir:

- Belirtiler başladıktan sonraki 6 saat içinde çekilen ve radyologca temiz bulunan BT’den sonra rutin bel delme yapılmaz.
- BT 6 saatten sonra çekildiyse bel delme düşünülür. Bel delme, belirtilerin başlamasından en az 12 saat sonra yapılır.
- Bel delmeyle alınan sıvıda spektrofotometriyle bilirubin artışı (**ksantokromi**) görülürse tanı konur. Bilirubin, kanın yıkımıyla oluşan sarı bir boyar maddedir.
- Yeniden kanama riski belirtiler başladıktan sonraki ilk 24 saatte en yüksektir (NICE, 2022).

**Sıklık.** 32 ülkeden 75 çalışma birleştirildiğinde dünyadaki sıklık 100.000 kişi-yılda 7,9 bulundu. Sıklık 1980’de 10,2’den 2010’da 6,1’e geriledi (Etminan ve ark., 2019). Düşüş, kan basıncı ve sigara içme sıklığındaki azalmaya koşut gitti. Büyük tansiyondaki her 1 mmHg’lik düşüş, sıklıkta %7,1 azalmayla ilişkiliydi. Sigara içme sıklığındaki her %1’lik düşüş de %2,4 azalmayla ilişkiliydi (Etminan ve ark., 2019). Sıklık bölgeye göre değişir: Japonya’da 22,7, Finlandiya’da 19,7, Orta ve Güney Amerika’da 4,2, öteki bölgelerde 9,1. Kadınlarda 1,24 kat daha sıktır. Bu fark 55 yaşından sonra başlar ve artar (de Rooij ve ark., 2007). Finlandiya’daki bir kohortta risk etkenlerinin birleşimine göre sıklık 8 ile 171 arasında değişti. Kadın cinsiyet, yüksek tansiyon ve sigara doğrulanmış risk etkenleriydi (Korja ve ark., 2013).

**Ölüm.** Hastaların yaklaşık dörtte biri hastaneye ulaşmadan ölür. Hastalığın ortalama başlangıç yaşı 50’lerin ortasıdır (Claassen ve Park, 2022). Toplum tabanlı çalışmalarda ölüm oranı %8,3 ile %66,7 arasında değişir. Bu oran 1973–2002 arasında yılda %0,8 azalmıştır (Nieuwkamp ve ark., 2009). Norveç’te 2008–2014 arasında hastaneye yatan anevrizmal kanamalı hastalarda sıklık 5,7/100.000 idi. Ölüm 30. günde %22, birinci yılda %37 idi. Arka dolaşımdaki anevrizmalar daha ölümcüldü (Øie ve ark., 2020).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Subaraknoid kanama sayılarla',
      ogeler: [
        { deger: '%85', aciklama: 'Travma dışı subaraknoid kanamada anevrizma yırtılmasının payı.' },
        { deger: '7,9', birim: '/100.000 kişi-yıl', aciklama: 'Dünyada sıklık (75 çalışma, 32 ülke). 1980–2010 arasında azaldı.' },
        { deger: '~1/4', aciklama: 'Hastaneye ulaşmadan ölen hastaların payı.' },
        { deger: '24', birim: 'saat', aciklama: 'Yeniden kanama riski belirtilerin başladığı ilk 24 saatte en yüksektir.' },
      ],
      not: 'Kaynaklar: Ziu ve ark. (2023); Etminan ve ark. (2019); Claassen ve Park (2022); NICE (2022).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Bir dakikada zirve yapan baş ağrısı',
      oyku: `47 yaşında, sigara içen ve yüksek tansiyonu olan bir kadın, spor salonunda ağırlık kaldırırken ensesinde ani bir ağrı duyuyor. Ağrı bir dakika içinde “hayatının en kötü” düzeyine çıkıyor. Kusuyor ve kısa bir süre bilincini yitiriyor. Acil serviste ense sertliği var. Belirtiler başladıktan 4 saat sonra çekilen BT’de beynin tabanındaki sisternalarda yoğun kan görülüyor.`,
      soru: 'Kan hangi boşluktadır ve neden en çok beynin tabanında toplanmıştır? BT temiz olsaydı ne yapılırdı?',
      cozum: `**Boşluk:** Kan, örümcek ağı zar ile yumuşak zar arasındaki subaraknoid boşluktadır, yani BOS’un içindedir (Ziu ve ark., 2023). Travma dışı bu kanamaların yaklaşık %85’inin nedeni bir anevrizmanın yırtılmasıdır (Ziu ve ark., 2023).

**Neden tabanda?** Anevrizmaların çoğu beynin tabanındaki sisternalarda bulunur. Anevrizma kanaması bu yüzden taban sisternalarını tutar (Heit ve ark., 2017). Yaşargil’e göre anevrizmalar çoğu zaman sisternaların örümcek ağı zardan duvarlarıyla sarılır (Volovici ve ark., 2020).

**Baş ağrısı:** Birkaç dakikada zirve yapan “şimşek gibi” baş ağrısı, kanamanın uyarıcı belirtisidir (NICE, 2022). Bu hastanın sigara ve tansiyon öyküsü de doğrulanmış risk etkenleridir (Korja ve ark., 2013).

**BT temiz olsaydı:** BT belirtilerden sonraki ilk 6 saatte çekildi. Kanada’daki büyük bir çalışmada bu sürede çekilen BT bütün kanamaları gösterdi (Perry ve ark., 2011). NICE kılavuzuna göre 6 saat içinde çekilen ve radyologca temiz bulunan BT’den sonra rutin bel delme önerilmez (NICE, 2022). Yeniden kanama riski ilk 24 saatte en yüksektir (NICE, 2022). Tanı ve tedavi kararını uzman ekip verir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Subaraknoid kanamada sisternaların dili',
      md: `- **Anjiyografisi temiz kanama:** Kendiliğinden subaraknoid kanamaların %15’e kadarında ilk damar görüntülemesinde bir neden bulunmaz. 58 çalışmalık bir meta-analizde bu hastaların yaklaşık yarısı (%49,9) beyin sapı çevresi (perimezensefalik) tipteydi (Mohan ve ark., 2019).
- **Tanım sisternalara dayanır:** Perimezensefalik kanamada kan orta beynin önündedir. Kan ambiens sisternasının ön kısmına ya da Sylvius yarığının tabanına uzanabilir. İki yarımküre arasındaki yarığı tam doldurmaz (Mohan ve ark., 2019).
- **Liliequist zarı:** Anevrizmasız perimezensefalik kanamada kan genellikle bu örümcek ağı zar perdesinin altında kalır. Perdenin üstüne çok kan geçmesi anevrizma kuşkusu doğurmalıdır (Dias ve ark., 2014). Zarın kendisi “Örümcek ağı zar” bölümünde anlatıldı.
- **Ameliyatta dikkat:** Yaşargil’in belirttiğine göre zarlardaki gerilim anevrizmanın tepesine iletilebilir. Bu, ameliyatta zarlar anevrizmadan uzakta ayrılırken bile kanamaya yol açabilir (Volovici ve ark., 2020).
- **Konveksite kanaması:** Travma olmadan, beyin kubbesindeki bir olukta subaraknoid kanama görülebilir. Bu, damar iltihabına ya da damar hastalığına bağlı kanamanın en sık biçimidir (Heit ve ark., 2017).
- **Travmada:** Travmatik subaraknoid kanama ölümü iki kat artırır. Taban sisternalarındaki kanın kötü sonuç için olumlu öngörü değeri %70’tir (Kim ve Gean, 2011). Avrupa Beyin Yaralanması Konsorsiyumu verisinde iyi iyileşme, kanaması olmayanlarda %41, olanlarda %15 idi (Kim ve Gean, 2011).
- **Yaşlıda:** 75 yaş üstü anevrizmal kanama derlemesinde hastaların %83,2’si kadındı. %33,8’i başvuruda kötü klinik evredeydi. %41’inde iç şah atardamarı anevrizması vardı (Ohkuma ve ark., 2017).
- **Karar kuralları:** Perry ve arkadaşları 1999 hastada (130 kanama) öykü ve muayenedeki yüksek riskli özellikleri topladı. Bunlardan kurulan karar kuralları %100 duyarlıydı. Kurallar, BT ya da bel delme yapılma oranını %82,9’dan %63,7–73,5’e indirebilirdi (Perry ve ark., 2010).
- **Türkiye’den:** Antalya’da Akdeniz Üniversitesi’nde yoğun bakıma yatan kendiliğinden subaraknoid kanamalı hastalarda yoğun bakım ölümü %41 idi. Ortalama yaş 54,9, hastaların %55,6’sı erkekti (Cetinkaya ve ark., 2025). Hastaların %48,4’ü Modifiye Fisher evre 4’teydi, yani sisternalarda ve karıncıklarda yoğun kan vardı. Bu grup ölenlerde anlamlı olarak fazlaydı (Cetinkaya ve ark., 2025). İstanbul Bakırköy’den 114 anevrizmal kanamalı hastanın %28,1’inde hidrosefali gelişti. Bağımsız belirleyiciler önceden var olan diyabet ve yüksek Fisher derecesiydi (Demirgil ve ark., 2003).
- **Dördüncü zarın izi mi?** 97 anevrizmal kanamanın %64,9’unda kan yalnızca beyin sapı boyunca yumuşak zara bitişik “derin” bölmedeydi. Yalnızca sert zara bitişik “yüzeyel” bölmede kanama hiç görülmedi (Almohaimede ve ark., 2025). Ağır kanamalarda kanın yüzeyel bölmede bulunma olasılığı yaklaşık 7,6 kat yüksekti. Yazarlar bunu tartışmalı dördüncü zarın (SLYM) olası bir görüntüleme izi sayar (Almohaimede ve ark., 2025). Tartışma “Yeni keşifler” bölümündedir.`,
    },

    // ——— Fıtıklaşmalar ———
    {
      tur: 'metin',
      md: `**Fıtıklaşma: beynin yer değiştirmesi.** Kafatası esnemeyen bir kutudur. İçinde üç şey vardır: beyin, BOS ve kan. Birinin hacmi artarsa ötekilerden biri ya da ikisi azalmak zorundadır. Buna Monro–Kellie ilkesi denir (Kostecki ve ark., 2023). Bu ilkeyi ilk derste gördük. Bu dengeleyici düzenekler tükenince beyin dokusunun kendisi itilir.

Sert zarın iki sert kıvrımı vardır: beyin orağı ve beyincik çadırı. Bu iki kıvrım kafatasının içini üç ana bölmeye ayırır (Knight ve De Jesus, 2023). Kıvrımların yapısı “Sert zarın kıvrımları ve bölmeleri” bölümünde anlatıldı. Basınç dengelenemeyince beynin bir bölümü bu kıvrımların yanından ya da kafatasındaki bir açıklıktan kayar. Böyle bir açıklık, kafatası tabanındaki büyük deliktir (*foramen magnum*) (Munakomi ve Das, 2026). Buna **fıtıklaşma** (herniasyon) denir. Başlıca türleri şunlardır:

- **Orak altı fıtıklaşma:** En sık görülen türdür. Kuşak kıvrımı (*gyrus cinguli*), beyin orağının altından karşı tarafa kayar (Kostecki ve ark., 2023).
- **Çadır çentiğinden aşağı fıtıklaşma:** Şakak lobunun iç-ön ucu (unkus) ya da beynin orta kısmı, çadırdaki açıklıktan aşağı itilir. Bu açıklığa çadır çentiği denir (Knight ve Rayi, 2023).
- **Yukarı fıtıklaşma:** Arka çukurdaki bir kitle, beyinciği çadır çentiğinden yukarı iter (Munakomi ve Das, 2026).
- **Bademcik fıtıklaşması:** Beyinciğin bademcik denen parçaları büyük delikten aşağı iner ve omurilik soğanını sıkıştırır (Knight ve De Jesus, 2023).

Fıtıklaşma hızla bilinç kaybına ya da ölüme götürebilir (Heit ve ark., 2017). Unkal fıtıklaşmada aynı taraftaki göz bebeği genişler. Karşı vücut yarısında güçsüzlük gelişir (Hall ve Munakomi, 2026). Omurilik soğanı giderek sıkışırsa bu, ölüme kadar gidebilir (Knight ve De Jesus, 2023).`,
    },
    {
      tur: 'animasyon',
      ad: 'fitiklasmalar',
      baslik: 'Bölmeler ve fıtıklaşmalar',
      aciklama:
        'Sert zarın orağı ve çadırı kafa içini bölmelere ayırır. Düğmeye bas: basınç artınca beynin hangi parçasının nereden kaydığını ve neye bastırdığını gör.',
    },
    {
      tur: 'sahne',
      baslik: 'İç yüzden: kuşak kıvrımı ve orağın yeri',
      aciklama:
        'Beynin sol yarısına içeriden bakıyoruz; ön taraf sağda. Turuncu kıvrım kuşak kıvrımıdır. Nasırlı cismin üstünde bir kemer gibi uzanır. Beyin orağı modelde yoktur. Gerçekte iki yarımküre arasındaki yarığa iner ve serbest alt kenarı nasırlı cismin hemen üstündedir. Orak altı fıtıklaşmada bu kenarın altından karşı tarafa kayan yapı kuşak kıvrımıdır. Aşağıda orta beyin ve beyincik görülür.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        boya: [{ secici: ['singulat-girus'], renk: '#e8913a' }],
        etiketler: [
          { yapi: 'singulat-girus-sol', metin: 'Kuşak kıvrımı' },
          { yapi: 'korpus-kallozum', metin: 'Nasırlı cisim' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Orta hattan: çadır, beyincik ve büyük delik',
      aciklama:
        'Beyin ve art kafa kemiği orta hattan ikiye ayrıldı; sol yarıya içeriden bakıyoruz, ön taraf sağda. Açık mavi yaprak beyincik çadırıdır. Büyük beyin ile beyincik arasına bir çatı gibi gerilir. Turuncu: beyincik. Pembe: omurilik soğanı. İşaretli nokta büyük deliktir. Arka çukurun iki açıklığı vardır: yukarıda çadır çentiği, aşağıda büyük delik. Beyincik bademcikleri modelde ayrı bir parça değildir. Bademcik fıtıklaşmasında büyük delikten aşağı inen parçalar onlardır. Yukarı fıtıklaşmada ise beyincik çadır çentiğinden yukarı itilir. Büyük beyin soluk gösterildi.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'beyaz', 'derin', 'sap', 'zar'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        goster: ['katman:kabuk', 'katman:beyaz', 'katman:derin', 'katman:sap', 'katman:zar', 'art-kafa-kemigi'],
        yarim: 'sol',
        bakis: 'ic-sol',
        vurgula: ['beyincik', 'omurilik-sogani', 'pons', 'orta-beyin', 'beyincik-cadiri', 'art-kafa-kemigi'],
        boya: [
          { secici: ['beyincik'], renk: '#e8913a' },
          { secici: ['omurilik-sogani'], renk: '#c2549e' },
          { secici: ['beyincik-cadiri'], renk: '#8fc3ea' },
        ],
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
        ],
        noktalar: [{ nokta: 'buyuk-delik', metin: 'Büyük delik' }],
      },
      araclar: ['bakis', 'yarim', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Neden olur?** Kafatası esnemez. Büyüyen bir kitle önce BOS’u ve kanı, sonra beyni iter.
- **Nereden geçer?** Beyin orağının altından, çadır çentiğinden (aşağı ya da yukarı) ve büyük delikten.
- **Unkal fıtıklaşma:** aynı tarafta genişleyen göz bebeği, karşı vücut yarısında güçsüzlük.
- **Bademcik fıtıklaşması:** omurilik soğanı sıkışır. Hayati tehlike vardır.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bölmeler ve kapılar.** Beyin orağı iki yarımküreyi birbirinden ayırır. Beyincik çadırı kafatasının içini çadır üstü ve çadır altı bölmelere ayırır. Çadır altı bölme arka çukurdur. İçinde beyincik ve beyin sapı vardır. Arka çukurun iki açıklığı vardır: büyük delik ve çadır çentiği (Knight ve De Jesus, 2023). Çadır çentiği, çadır üstü ve altı bölmeleri birleştiren tek dar geçittir. Buradan orta beyin, göz hareket siniri (III. kafa siniri), arka beyin atardamarları ve üst beyincik atardamarları geçer (Hall ve Munakomi, 2026). Çadırın serbest kenarının hemen üstünde parahipokampal kıvrım ve arka beyin atardamarı durur (Rai ve ark., 2018).

**Unkal fıtıklaşma.** Unkus, şakak lobundaki parahipokampal kıvrımın ön-iç ucudur. Unkal fıtıklaşmada şakak lobunun iç-ön kısmı çadır çentiğinden suprasellar sisternaya itilir (Hall ve Munakomi, 2026). Suprasellar sisterna, Türk eyerinin üstündeki sisternadır. Bir kaynak onu kiazma sisternasıyla aynı yer olarak anar (Dias ve ark., 2014). TA2’de kiazma sisternasının adı *cisterna chiasmatica*’dır (FIPAT, 2019). Görüntülemede unkus aynı taraftaki suprasellar sisternayı sıkıştırır (Kim ve Gean, 2011). Klinikte en sık tanınan fıtıklaşma sendromu budur. Tablonun üç parçası vardır (Hall ve Munakomi, 2026):

- Aynı tarafta göz hareket siniri felci olur. Göz bebeği genişler.
- Beyin sapı ayağının sıkışmasından karşı tarafta hareket kaybı olur.
- Beyin sapının işleyişi giderek bozulur.

“En sık fıtıklaşma hangisi?” sorusuna iki kaynak iki yanıt verir. Kostecki ve arkadaşlarına göre en sık tür orak altı fıtıklaşmadır (Kostecki ve ark., 2023). Hall ve Munakomi’ye göre ise klinikte en sık tanınan sendrom unkal fıtıklaşmadır (Hall ve Munakomi, 2026). Biri bütün fıtıklaşmaları, öteki klinikte tanınan tabloları sayar.

**Merkezî fıtıklaşma.** Ara beyin ve orta beyin çadır çentiğinden aşağı kayar. Bu genellikle yaygın beyin şişmesinde ya da iki taraflı kitle etkisinde olur (Munakomi ve Das, 2026). Görüntülemede iki şakak lobu birlikte, taban sisternalarını sıkıştırarak aşağı iner (Kim ve Gean, 2011).

**Yukarı fıtıklaşma.** Arka çukurdaki bir kitle, beyincik yapılarını çentikten yukarı iter. Orta beyni bozar. BOS yollarını ve toplardamar akışını tıkayabilir (Munakomi ve Das, 2026). Görüntülemede dörtlü cisim sisternası (kuadrigeminal sisterna) silinir (Kim ve Gean, 2011).

**Bademcik fıtıklaşması.** Beyincik bademcikleri büyük delikten aşağı iner. Omurilik soğanını klivusa ya da ikinci boyun omurunun dişsi çıkıntısına bastırır. Buna “koni oluşumu” (*coning*) da denir. Omurilik soğanının giderek artan baskısı Cushing refleksine ve sonunda ölüme yol açar (Knight ve De Jesus, 2023). Cushing refleksinde kafa içi basıncı yükselir ve beyin sapı kansız kalır. Buna yanıt olarak kan basıncı belirgin biçimde yükselir (Dinallo ve Waseem, 2023). Beyni besleyen kanın itme gücüne beyin perfüzyon basıncı denir. Bu basınç, ortalama atardamar basıncından kafa içi basıncı çıkarılarak bulunur (Dinallo ve Waseem, 2023).

**Kernohan–Woltman çentiği.** Büyük bir kitle beyin sapını yana iter. Karşı taraftaki beyin sapı ayağı (*crus cerebri*) çadırın serbest kenarına çarpar (Beucler ve ark., 2022). Sonuçta güçsüzlük, beklenenin tersine, kitleyle aynı tarafta görülür. Buna “yanıltıcı yer belirtisi” denir. Belirti, hasarın yerini yanlış gösterir (Beucler ve ark., 2022).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Alttan: çadır çentiğinin çevresi',
      aciklama:
        'Beynin tabanına alttan bakıyoruz; ön taraf yukarıda, hastanın sağı ekranın solunda. Büyük beyin, beyincik ve köprü gizlendi; çentiğin çevresindeki yapılar kaldı. Açık mavi yaprak beyincik çadırıdır. Ortadaki açıklık çadır çentiğidir ve içinden orta beyin geçer. Pembe: beyin sapı ayakları. Turuncu: parahipokampal kıvrım; ön-iç ucu unkustur. Kırmızı çizgiler atardamarlardır. Arka beyin ve üst beyincik atardamarları da çentikten geçer. Göz hareket siniri (III) modelde yoktur. O da bu çentikten geçer.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'zar', 'damar'],
        renk: 'dogal',
        goster: [
          'beyincik-cadiri',
          'orta-beyin',
          'serebral-pedinkul',
          'parahipokampal-girus',
          'arka-beyin-arteri',
          'ust-beyincik-arteri',
          'baziler-arter',
          'arka-baglanti-arteri',
          'ic-karotis-arter',
        ],
        boya: [
          { secici: ['parahipokampal-girus'], renk: '#e8913a' },
          { secici: ['serebral-pedinkul'], renk: '#c2549e' },
          { secici: ['beyincik-cadiri'], renk: '#8fc3ea' },
        ],
        bakis: 'alt',
        etiketler: [
          { yapi: 'beyincik-cadiri-sol', metin: 'Beyincik çadırı' },
          { yapi: 'parahipokampal-girus-sol', metin: 'Parahipokampal kıvrım (önde unkus)' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Beyin sapı ayağı' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin atardamarı' },
          { yapi: 'ust-beyincik-arteri-sol', metin: 'Üst beyincik atardamarı' },
          { yapi: 'baziler-arter', metin: 'Baziler atardamar' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Fıtıklaşma türleri',
      sutunlar: ['Tür', 'Hangi kıvrım ya da açıklık?', 'Ne yer değiştirir?', 'Neye baskı yapar?', 'Bulgu'],
      satirlar: [
        [
          'Orak altı',
          'Beyin orağı',
          'Kuşak kıvrımı, orağın altından karşı tarafa',
          'Kuşak kıvrımı orağa doğru itilir',
          'En sık tür (Kostecki ve ark.)',
        ],
        [
          'Unkal',
          'Çadır çentiği (aşağı)',
          'Şakak lobunun iç-ön kısmı (unkus), suprasellar sisternaya',
          'Aynı taraf göz hareket siniri; beyin sapı ayağı; arka beyin atardamarı',
          'Aynı tarafta geniş göz bebeği, karşı tarafta güçsüzlük. Arka beyin atardamarı sıkışırsa yarım görme kaybı',
        ],
        [
          'Merkezi',
          'Çadır çentiği (aşağı)',
          'Ara beyin ve orta beyin; iki şakak lobu birlikte',
          'Taban sisternaları silinir; beyin sapı aşağı kayar',
          'Yaygın şişme ya da iki taraflı kitlede. Duret kanaması görülebilir',
        ],
        [
          'Yukarı',
          'Çadır çentiği (yukarı)',
          'Beyincik yapıları',
          'Orta beyin; BOS yolları ve toplardamar akışı',
          'Dörtlü cisim sisternası silinir',
        ],
        [
          'Bademcik',
          'Büyük delik',
          'Beyincik bademcikleri, aşağı',
          'Omurilik soğanı, klivusa ya da dişsi çıkıntıya',
          'Cushing refleksi; ilerlerse ölüm',
        ],
      ],
      not: 'Kaynaklar: Kostecki ve ark. (2023); Munakomi ve Das (2026); Kim ve Gean (2011); Hall ve Munakomi (2026); Knight ve De Jesus (2023); Hall ve Bhardwaj (2025).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Epidural:** Kemik ile sert zar arası. Çoğunlukla orta meningeal atardamar (pterion). Mercek biçimli, dikişleri geçmez. Aydınlık dönem olabilir. 30 cm³’ün üstü, GKS ne olursa olsun boşaltılır.
- **Akut subdural:** Köprü toplardamarları kanar. Hilal biçimli. Dikişleri geçer, orağı ve çadırı geçmez. Karşı darbe tarafında daha sık. Kalınlık 10 mm’yi ya da kayma 5 mm’yi geçerse boşaltılır.
- **Kronik subdural:** 3 haftadan eski. İltihaplı bir yeni zar hastalığı. Dış zar sert zara sıkı, iç zar örümcek ağı zara gevşek tutunur. Nüks %9–33.
- **Subaraknoid:** Travma dışında %85’i anevrizma. Anevrizmaların %90’ı kesecik, %85’i ön dolaşımda. İlk 6 saatte çekilen BT %100 duyarlı (Perry): muayenesi normal, ani baş ağrılı yetişkinde, yeni kuşak BT ve deneyimli radyolog yorumuyla. Yeniden kanama en çok ilk 24 saatte.
- **Fıtıklaşma:** En sık tür orak altı. Klinikte en sık tanınan unkal (III. sinir + beyin sapı ayağı). Çadır çentiğinden orta beyin, III. sinir, arka beyin ve üst beyincik atardamarları geçer. Bademcik fıtıklaşması omurilik soğanını sıkıştırır; Cushing refleksi.
- **Kernohan:** Karşı beyin sapı ayağı çadır kenarına çarpar. Güçsüzlük kitleyle aynı taraftadır (yanıltıcı yer belirtisi).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kernohan–Woltman çentiği: tarih ve seyir.** Bu özel unkal fıtıklaşmayı ilk kez 1927’de Groeneveld ve Schaltenbrand, beyin tümörlü hastaların otopsi serisinde anlattı. Kernohan ve Woltman 1929’da anlattı (Beucler ve ark., 2022). 1990–2020 yayınlarından 51 hastayı toplayan sistematik derlemede ortalama yaş 40,7, erkek/kadın oranı 2/1 idi. Hastaların %63’ü kafa travması geçirmişti. Çoğunda akut subdural kanama vardı (%57). %45’inde hareket gücü iyi düzeldi (Beucler ve ark., 2022). Yazarlar, bu belirtinin kimde çıkacağını anlamak için çadır çentiği genişliğinin kişisel farkının incelenmesini önerir (Beucler ve ark., 2022).

**Çentik herkeste aynı değil.** Çadır çentiğinin yapısı kişiden kişiye değişir. Bu fark, fıtıklaşmada beyin sapının ne kadar bozulacağını etkileyebilir (Adler ve Milhorat, 2002). Uzun ve geniş bir çentik beyincik dokusunu daha çok açıkta bırakır. Bu, yukarı ya da aşağı fıtıklaşma eğilimini açıklayabilir (Rai ve ark., 2018). Göz hareket sinirinin uzunluğu ve gidişi de kişiden kişiye değişir. Fıtıklaşmada göz bebeği bulgusunun her hastada aynı çıkmaması buna bağlanmıştır (Rai ve ark., 2018). Ropper otopside bu sinirin klivus üzerinde keskin bir açıyla büküldüğünü gösterdi (Hall ve Munakomi, 2026). Çentiğin ölçüleri ve Adler ile Milhorat’ın sekiz çentik tipi “Sert zarın kıvrımları ve bölmeleri” bölümünde.

**Adlar ve tarih.** Tek taraflı göz bebeği genişlemesini ilk Jonathan Hutchinson tanımladı. Bu yüzden ona “Hutchinson göz bebeği” denir (Hall ve Munakomi, 2026). Adolf Meyer, arka beyin atardamarının sıkışmasıyla oluşan yarım görme kaybını bir yanıltıcı yer belirtisi olarak anlattı (Hall ve Munakomi, 2026). Monro–Kellie ilkesinin tarihi iki adımdır. 1783’te Edinburghlı Alexander Monro kafatasını katı bir kutu olarak tanımladı. 1824’te öğrencisi George Kellie, otopsilerde beyindeki kan hacminin ölüm nedeninden bağımsız olarak benzer olduğunu doğruladı (Wilson, 2016).

**Duret kanaması.** Beyin sapı aşağı kayınca baziler atardamarın orta hat yakınındaki delici dalları gerilir ve yırtılır. Bu kanamayı ilk kez Fransız nörolog Henri Duret tanımladı (Hall ve Bhardwaj, 2025). Kanama tipik olarak orta beyin ve köprünün ön ve orta hatta yakın kısmındadır. Hızlı bir aşağı fıtıklaşmadan sonra görülür. Mekanizmada atardamar yırtılması da, toplardamar tıkanmasıyla doku ölümü (enfarkt) de tartışılır (Kim ve Gean, 2011). Duret kanaması tarihsel olarak çok kötü sonuçla özdeşti. Ama bilinci, iletişimi ve bağımsızlığı geri gelen hastalar da bildirildi. Yazarlar, kötü sonucun kısmen tedavinin erken kesilmesinden doğan bir yanılgı olabileceğini tartışır (Edlow ve ark., 2019).

**Paradoks fıtıklaşma.** Kafatasının bir bölümü çıkarılmış (dekompresif kraniyektomi) hastalarda görülür. Beyin dokusu yerçekimiyle çadırın altına kayar ve beyin sapını büyük delikte sıkıştırır (Chen ve ark., 2016). Sıklığı bu ameliyattan sonra yaklaşık %3’tür. 429 hastalık bir seride bağımsız risk etkenleri dış karıncık drenajı, bel delme ve sürekli dış bel drenajıydı (Chen ve ark., 2016).

**Yukarı fıtıklaşmaya bir örnek.** Bir olgu sunumunda, arka çukurunda tümör (medulloblastom) olan bir çocuk anlatılır. Çocuğa karıncıktan karın boşluğuna sıvı akıtan bir şant takıldı. Bundan sonra yukarı fıtıklaşma gelişti (Yadav ve ark., 2012).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Yanlış tarafı gösteren güçsüzlük',
      oyku: `52 yaşında bir adam, motosiklet kazasından sonra komada getiriliyor. GKS puanı 6. Sol göz bebeği geniş ve ışığa yanıtsız. Vücudunun sol yarısında belirgin güçsüzlük var. BT’de sol yarımkürede kalın, hilal biçimli bir akut subdural kanama, 12 mm orta hat kayması ve silinmiş taban sisternaları görülüyor. Sağ yarımkürede kanama yok.`,
      soru: 'Güçsüzlük neden kanamayla aynı taraftadır? Bu yanıltıcı bulguyu hangi anatomik yapı açıklar?',
      cozum: `**Beklenen tablo:** Unkal fıtıklaşmada aynı taraftaki göz hareket siniri sıkışır ve göz bebeği genişler. Hareket kaybı ise beyin sapı ayağının sıkışmasından, karşı tarafta olur (Hall ve Munakomi, 2026).

**Bu hastada:** Büyük kitle beyin sapını sağa itmiştir. Karşı (sağ) beyin sapı ayağı, çadırın serbest kenarına çarpmıştır. Bu yüzden güçsüzlük kitleyle aynı taraftadır. Buna Kernohan–Woltman çentiği denir. Yanıltıcı bir yer belirtisidir (Beucler ve ark., 2022).

**Kimde olur?** 51 hastalık sistematik derlemede olguların %63’ü kafa travmasıydı. En sık neden akut subdural kanamaydı (%57) (Beucler ve ark., 2022). Çentiğin genişliği kişiden kişiye değişir. Adler ve Milhorat bu farkın, benzer hastalarda fıtıklaşma tablolarının neden farklı olduğunu açıklamaya yardım ettiğini yazar (Adler ve Milhorat, 2002).

**Ne yapılır?** Kılavuza göre akut subdural kanama, kalınlığı 10 mm’yi ya da orta hat kayması 5 mm’yi geçiyorsa boşaltılır. Bu karar GKS puanına bağlı değildir (Bullock ve ark., 2006b). Taban sisternalarının silinmesi kötü sonuçla ilişkilidir (Kim ve Gean, 2011). Derlemedeki hastaların %45’inde hareket gücü iyi düzeldi (Beucler ve ark., 2022). Tedavi kararı beyin cerrahisi ekibine aittir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Türkiye’den çalışmalar: kanamalar',
      sutunlar: ['Konu', 'Çalışma', 'Bulgu'],
      satirlar: [
        [
          'Orta hat epidural kanama',
          'Güçlü ve ark. (2022), İstanbul; 9 ameliyatlı hasta',
          'Kaynak her hastada üst sagital sinüs duvarındaki ya da araknoid granülasyondaki yırtık. Sinüsün üstünde 3 cm kemik şerit bırakıldı',
        ],
        [
          'Akut subdural: atardamar kaynağı',
          'Koç ve ark. (1997), Kayseri; 5 hasta',
          'Travmasız, ani baş ağrısıyla başlayan kanamada kaynak Sylvius bölgesi yakınındaki bir kabuk atardamarı',
        ],
        [
          'Akut subdural: çocuk',
          'Taşkapılıoğlu ve ark. (2019), Bursa; 11 çocuk (8 ay–15 yaş)',
          'Yaralanmadan sonraki 2 saat içinde sert zar genişletmeli dekompresif kraniyektomi',
        ],
        [
          'Akut subdural: karar',
          'Eryilmaz (2026), Yozgat; kapsam derlemesi',
          'Ölümü en güçlü öngörenler: GKS, göz bebeği tepkisi, yaş, orta hat kayması, taban sisternalarının basısı, yaygın beyin şişmesi',
        ],
        [
          'Orak yokluğu',
          'Kocak ve ark. (2013), İstanbul; 49 yaşında kadın',
          'Üst sagital sinüs ve beyin orağı yoktu. İki taraflı, alt akut subdural kanama orta hattı geçmişti',
        ],
        ['Kronik subdural: cinsiyet', 'Kanat ve ark. (2010); 76 ameliyatlı hasta', '%81,6 erkek'],
        [
          'Kronik subdural: nüks',
          'Tugcu ve ark. (2014); 292 hasta, tek delikle boşaltma',
          '%14,7’sine ikinci ameliyat. İki taraflıda nüks %23,1, tek taraflıda %11,4',
        ],
        [
          'Kronik subdural: iç zar',
          'Kayaci ve ark. (2014); 252 hasta, 2004–2011',
          'Kateterle boşaltıp iç zarı yırtma tekniğinde nüks %0, delik açıp dış zarı kesme tekniğinde %8,3',
        ],
        [
          'Kronik subdural: dren',
          'Oral ve ark. (2015); 70 hasta',
          'Dren kafa derisinin altına (galea altı) ya da sert zarın altına konduğunda nüks benzer: %6,25 ve %7,8',
        ],
        [
          'Kronik subdural: delik türü',
          'Gökmen ve ark. (2008), İzmir; 70 hasta, randomize',
          'Delik açma (*burr-hole*) ile ince matkapla delme (*twist drill*) arasında klinik ve radyolojik fark yok',
        ],
        [
          'Kronik subdural: hacim',
          'Sucu ve ark. (2005); 28 hasta',
          'Basit XYZ/2 formülü, bilgisayarlı hacim ölçümüyle çok iyi uyum gösterdi',
        ],
        [
          'Kronik subdural: sızma',
          'Tokmak ve ark. (2007); 24 hasta',
          'Dış zardan ortalama sızma %13,24 (%2,05–28,88). Ağır evre, karışık yoğunluk ve yeniden birikmeyle ilişkili',
        ],
        [
          'Kronik subdural: nüks nedenleri',
          'Hacıyakupoğlu ve ark. (2018), Adana ve İzmir; 13 nüks olgusu',
          'Yazarların aktardığı nüks nedenleri: geride kalan iç ve dış zar, zarın yeniden damarlanması, kalan subdural aralık. Kendi olgularında geniş kraniyotomiyle sert zarı ve kanamanın zarlarını çıkardılar. Bunu nüksü önlemede iyi bir seçenek saydılar',
        ],
        [
          'Kronik subdural: katılaşmış',
          'Balevi (2017)',
          'Organize (katılaşmış) kanamada ilk tedavi olarak geniş kraniyotomi ve zarların geniş çıkarılması',
        ],
        [
          'Kronik subdural: kemikleşme',
          'Turgut ve ark. (2020); sistematik derleme, 114 olgu',
          'Kireçlenmiş ya da kemikleşmiş biçim ABD, Japonya ve Türkiye’de daha sık bildirildi',
        ],
        [
          'Kronik subdural: embolizasyon',
          'Seçen ve ark. (2026), Ankara; 52 hasta',
          '43 hastaya (%82,7) yalnız embolizasyon. Ameliyat eklenenlerde işlem öncesi kayma daha büyüktü',
        ],
        [
          'Subaraknoid: yoğun bakım',
          'Cetinkaya ve ark. (2025), Antalya; kendiliğinden kanama',
          'Yoğun bakım ölümü %41. Modifiye Fisher evre 4 olanlar ölenlerde fazlaydı',
        ],
        [
          'Subaraknoid: hidrosefali',
          'Demirgil ve ark. (2003), İstanbul; 114 hasta',
          'Hidrosefali %28,1. Belirleyiciler diyabet ve yüksek Fisher derecesi',
        ],
      ],
      not: 'Yalnızca özeti okunan çalışmalar: Kanat ve ark. (2010), Tugcu ve ark. (2014), Gökmen ve ark. (2008), Sucu ve ark. (2005), Tokmak ve ark. (2007), Koç ve ark. (1997), Taşkapılıoğlu ve ark. (2019), Demirgil ve ark. (2003), Turgut ve ark. (2020), Kocak ve ark. (2013). Şehir ve kurum yalnızca kaynakta yazıyorsa verildi.',
    },
  ],
};
