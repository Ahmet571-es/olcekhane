# Ölçekhane: güncel durum

Her sohbet işe başlamadan bu dosyayı okur; iş bitince değişikliği aynı işlemede buraya yazar (CLAUDE.md, "Yeni bir
sohbette: istekten yayına"). Plan, Claude Docs'taki **Ölçekhane Platform Haritası** belgesidir:
https://claude.ai/artifact/PqjqGWA4vWv2HUx2sEAPQa

Son güncelleme: 2026-10-09

## Büyük plan (site sahibinin 2026-10-07 isteği)

Hedef: Türkiye'nin en büyük ücretsiz kişilik ve zekâ testleri platformu. Testler yaş ve sınıf gruplarına göre
düzenlenir, her sayfada kullanıcıyı yönlendiren açıklamalar bulunur, raporlar bol (3B görünümlü) grafikli, tanı
koymayan, öğrenciye yol haritası çizen ve PDF olarak verilen raporlardır; test sayısında sınır yoktur (telife dikkat);
ayrıca iki dallı, bol animasyonlu ve 3B görselli bir nörobilim bölümü kurulur. Site sahibi "acele etmeden, adım adım"
istedi. Kararları:

- Sıra: 1 → 2 → 3; yeni testler her basamağın yanında sürer.
- "Açık kaynak": testler ve raporlar ücretsiz, ileride ücretli rapor seçeneği açık kalır (bugünkü plan; "yalnızca
  ticari olmayan kullanım" izinli ölçekler yine kullanılmaz). Kod herkese açık değildir.
- Yaş grupları: 3. sınıftan yetişkine (İlkokul 3–4, Ortaokul, Lise ve mezun, Üniversite ve yetişkin).
- Beyin derslerini testleri onaylayan hocamız okur.
- **2026-10-07 kararı:** hoca onayı beklenmez; testler ve yol haritaları doğrudan yayına alınır (özgün testler
  `pilot`). Site sahibi hocayla 2026-10-11'de buluşacak ve platformu bitmiş hâliyle sunacak; hoca yayındaki siteyi
  inceleyip düzeltme isteyecek. Platformun o güne hazır olması gerekiyor.
- Zekâ tarafı "Zekâ ve zihinsel beceriler" adıyla kurulur: telifli zekâ testleri kullanılmaz, IQ puanı verilmez;
  akıl yürütme, sözel, sayısal, uzamsal, bellek, dikkat ve hız ayrı ayrı ölçülür, sonuç güçlü yanlar haritasıdır.

Basamaklar:

1. **Yaş ve sınıf düzeni, her sayfada yol gösterme:** bitti (2026-10-07). Hoca yetişkinlere de uygun 6 testi
   aynı gün onayladı; Üniversite ve yetişkin grubu açıldı.
2. **Rapor yenileme ("Gelişim Yol Haritası"):** bitti (2026-10-07). Çözülebilen her testin raporunda (öğrenci, veli
   ve yetişkinlere açık testlerde yetişkin) yol haritası var; Beş Faktör, Ayrıntılı ve Altı Boyutlu Kişilik hoca onaylı,
   ötekiler 2026-10-07 kararıyla onay beklenmeden yayında (hoca yayındaki siteyi inceleyecek).
3. **Nörobilim bölümü (Beyin Akademisi):** kuruldu (2026-10-08): 8 bölüm, 100 ders (2026-10-09: yalnızca beyin; kafatası dersleri yayından kalktı), üç boyutlu model (BodyParts3D),
   her işlemede bir ders; ayrıntı ve sıradaki ders aşağıdaki "Beyin Akademisi" bölümünde. Kaynak erişimi: OpenStax,
   UTHealth (Neuroscience Online), NINDS, MedlinePlus ve Europe PMC açılıyor; NCBI/PubMed ve CDC açılmıyor.
4. **Okuma bölümü (site sahibinin 2026-10-07 isteği):** kişilik ve zekâ testlerinden ayrı "Okuma" sekmesi
   (`/okuma`). Kararlar: ses yalnızca cihazda kaydedilir, hataları öğretmen ya da veli dinleyerek işaretler (yapay
   zekâyla ses tanıma ve dış hizmet yok); 1–8. sınıflar ("İlkokul 1–2" grubu açıldı). İlk değerlendirme yayında:
   Sesli Okuma Değerlendirmesi (her sınıfa 3 metin; sayı sınırı yok, metin eklenebilir).
5. **Yeni testler (sürekli):** aşağıdaki dalgalar; yanında zekâ, algı ve okuma tarafı genişler (şekil, sayı ve sözel
   akıl yürütme, görsel algı hızı, örüntü bulma, sınıfa özel okuma metinleri, kelime bilgisi). Sonunda yaş grubuna
   göre "Kendini Tanı Paketi": birkaç test art arda, tek büyük PDF rapor.

## Sıradaki işler

**Kalite incelemesi (2026-10-08): 6 acil hata, site sahibinin isteğiyle her işlemede bir hata düzeltilip yayına
alınıyor.** Rapor: Claude Docs'taki **Ölçekhane Test Kalite Raporu** (https://claude.ai/artifact/8btJRknY53xATRsLhX2HsH;
sonundaki "Teknik ek" dosya ve satırları verir; her bulgu düzeltmeden önce kodda yeniden doğrulanır). Sıra:
1. Mesleki İlgi Profili: **düzeltildi (2026-10-08).** Öne çıkan alan en az "Orta" düzeyde olmalı; kod ve örnek meslek
   yalnızca en az bir alan yüksekken; hiçbir alan yüksek değilse en yüksek iki orta alan (kod yok); hepsi düşük ya da
   hepsi eşitse öne çıkan alan yok; eğitim yolları yalnızca yüksek alanlar için; eşitlikler notla söylenir. Bütün düzey
   birleşimleri `tests/mesleki-ilgi-rapor.test.ts`'te.
2. Dikkat ve Çalışma Belleği: **düzeltildi (2026-10-08).** Boş sembol bölümü kabul edilir (o görev "Cevap verilmedi",
   yorumlanmaz; öteki görevlerde boş blok yine reddedilir); dizi girişinde süre 2 dk'da kesilir. Eski görevlere
   (sayı/kutu dizisi, ok, sembol) sekme değişince duraklatma, basılı tuş ve sağ tık koruması; görevler arası
   düğmeler gecikmeli. Tarayıcıda baştan sona denendi (duraklatma ekranları, sayaç, kalan süre, rapor).
3. Harf İşaretleme: **düzeltildi (2026-10-08).** Taranan kısım kesintisiz çalışmanın sonunda biter (`scannedEnd`:
   üç satırdan uzun boşluktan sonra 3 işareti bulmayan öbek yanlışlıkla dokunma sayılır, puana girmez, kartta
   söylenir). "Son bölümlerde düştü/arttı" yalnızca %15'i ve sayım oynaklığının iki standart hatasını aşınca
   (`sustainClear`); yoksa "Belirgin değişim yok". Çok yanlış işarette "dikkatli çalıştın" denmez. Bölüm sırasında
   sekme değişince süre durur, sayfa yerinde kalır; geri sayımda gizlenirse geri sayım yeniden başlar.
4. Matematik: **düzeltildi (2026-10-08).** Raporda ve PDF'te "Yanlış yaptığın ve bilmediğin sorular" (soru, verilen
   ve doğru cevap, hata türü, çözüm; PDF'te tablo, grafik değerleri ve şeklin sözlü anlatımı) ve "Yanlışların neyi
   gösteriyor?" (hata türü, kaç soruda görüldüğü, açıklama, öneri). Cevaplar çok hızlı ya da aynı harfte toplanınca hata
   türleri yorumlanmaz. Genel metin: hepsi doğruysa ayrı metin, iyi sonuçta öncelikli alan adıyla söylenir, bütün
   alanlar öncelikliyse "belirli konularda toplanıyor" denmez; alan grafiğinde "4 soruya dayanır, kaba gösterge" notu.
   Yanlış etiketli 7 seçenek düzeltildi (M5-10, M5-15, M6-06, M6-10 seçenekleri değişti, M7-01, M8-13, M8-14).
   `tests/matematik-rapor.test.ts`.
5. Sesli okuma: **düzeltildi (2026-10-08).** Akıcılık işaretleri (`fluency`, `flags.fluencyConcern`): kendi ya da alt
   sınıf metninde dakikada doğru kelime Erden ortalamasının bir standart sapma altı (1–5. sınıf; SD'ler kaynağın Tablo
   3'ünden, `referenceRates.sd`), tempo 1 ya da akıcılık toplamı ≤ 8. Doğru ve anlayarak okuyup işareti olana "Rahat
   okuyor" yerine "Doğru okuyor, akıcılığı gelişiyor"; yol haritasında "Tekrarlı okuma" haftası, üst düzey önerilmez.
   Erden cümlesi "doğru okuduğu" ve aralıkla (ort. ± SD). Sondaki atlanan kelimeler hızı zaten şişirmiyordu (`unread`,
   ece076a); ortadaki atlamalar hata sayılır, hız "denenen kelime" düzenindedir.
6. Okuma Hızı ve Anlama: **düzeltildi (2026-10-08).** Dört metnin soruları yeniden yazıldı: hiçbir soru başka bir
   sorunun cevabını ele vermez, çıkarım soruları gerçekten çıkarım ister; cevap anahtarları ve beceriler dengeli;
   kesin olmayan bilgiler yumuşatıldı. `tests/okuma-hizi.test.ts` sızıntıyı (eski soruları yakaladığı denendi),
   anahtar dengesini, puanlamayı ve raporu denetler. Okurken başka sekmeye geçilen süre okuma süresine katılmaz;
   sorularda geri dönüş yok (tanıtımda söylenir). Sınıfa göre hız sınırları (`READING_PACE`); dakikada 15
   kelimenin altı `tooSlow`. "Anlayarak okuma" tahmin düzeltmeli (doğru − yanlış/3) ve çok hızlı, çok yavaş ya da
   anlama %75'in altındaysa verilmez ("—" ve not). Kaynak hızlar yalnızca bağlam için anılır (doğrudan
   karşılaştırılamaz). Yol haritasında hız sınıfa göre yorumlanır; orta bant "Metni kısmen anladı".
Sonra raporun Öncelik 2 ve 3 maddeleri (site sahibi yeni görevler verecek).

**Yeni kişilik ve zekâ testleri, adım adım (site sahibinin 2026-10-08 isteği):** lisans sorunu olmayan testler
araştırılıp her adımda bir test eklenir; her test çözülüp hataları giderilir, rapor bilimsel ama sade ve 3B grafikli
olur, sonra yayına alınır. Lisans: kişilikte yalnızca IPIP (kamu malı) ölçekleri; zekâ sorularının hepsi özgün
(ICAR "yalnızca akademik kullanım", SWLS ve GSE ticari olmayan/araştırma izinli olduğu için kullanılmaz; "16PF" ve
"Raven" marka olduğu için test adlarında geçmez). Sıra (site sahibi önerilen sırayı seçti):
1. **Şekil Akıl Yürütme: yayında (2026-10-08, pilot).** 24 özgün matris sorusu, 5 düzey, 8 seçenek; 3. sınıftan
   yetişkine (görevlerden yetişkinlere açık ilk test). Sorular kural tanımlarıyla yazılır (`lib/instruments/matrix.ts`,
   `content/instruments/sekil-akil-yurutme.ts`); seçenekler I-RAVEN düzeninde (2×2×2, tabloya bakmadan bulunamaz).
   Her sorunun tek doğru cevabı bağımsız çözücüyle denetlenir (`tests/helpers/matrix-solver.ts`); soruların izi testte
   sabittir, sorular değişirse sürüm artırılır. Cevap anahtarı tarayıcıya gitmez (yayın denetimi de bakar). Rapor:
   doğru sayısı, düzeylere göre grafik, ulaşılan düzey, kural türleri (yol haritasında 3B grafik), çalışma biçimi
   (çok hızlı cevap, hep aynı sıra, yakın hatalar). Tablo ve seçenekler aynı ölçekte çizilir (büyüklük kuralı için).
   Aynı gün bağımsız bir incelemeden sonra sürüm 2: 4. ve 5. düzey düzey tanımlarına göre yeniden sıralandı, yanlış
   seçeneklerde tablodaki değerler daha çok kullanıldı (`cycle`), rapor metinlerinde bazı cevap düzenlerinde yanlış
   olan cümleler düzeltildi (her durum testte), klavyeyle ok tuşları ve Enter, gri renk karşıtlığı artırıldı.
2. **16 Faktörlü Kişilik Profili: yayında (2026-10-08, active).** IPIP'in 16PF'e benzeyen 16 ön ölçeği; 160 madde
   (Kurallara bağlılık'tan yasalar, din ve millî marşla ilgili üç madde siyasi ve dinî görüş sormama ilkesiyle
   çıkarıldı), 9. sınıftan yetişkine, ~20 dakika. Adında "16PF" geçmez. 75 madde öteki kişilik testlerindeki
   çevirilerle aynı, 85 madde iki taslakla çevrildi. B ölçeğinin adı "Düşünsel özgüven": zekâ ölçmediği her metinde
   yazılı. Rapor: 16 özellik × 3 düzey (öğrenci, veli; destek kutusu Duygusal denge düşük ve Endişeye yatkınlık
   yüksekken, bu ikisinin yetişkin metni ayrı). Yol haritası: 16 sütunlu 3B grafik (çok sütunda sütunlar inceliyor,
   16 ayrı renk), öneri kartları, ortamlar ve veliye yaklaşım yalnızca en belirgin altı özellik için (`focus`), 2. hafta
   Düzen ve titizlik, iyi oluş haftası önce Duygusal denge düşük sonra Endişe yüksek (`wellbeing` artık liste
   olabiliyor; varsayılan "Sınav kaygısı" bağlantısı artık yetişkine verilmiyor, Ayrıntılı Kişilik'te de). Düşünsel
   özgüven ve Duyarlılık için ortam önerisi yazılmadı. Öneri kartlarında önce uçtaki özellikler gelir (2,6 orta, 3,4
   yüksekten önce gelmez). 16 boyutun bütün birleşimleri denenemediği için yol haritası testi 16 boyutta seçilmiş ve
   sabit tohumlu rastgele birleşimleri dener (`tests/roadmap.test.ts`). Bağımsız incelemeden sonra beş madde, Duyarlılık
   ve Yeniliğe açıklık düşük metinleri (maddelerin söylemediği "somut ve gerçekçi" çıkarıldı), bazı çalışma kartları
   (özetleme yerine kapatıp hatırlama; birbirini tekrar eden kartlar) düzeltildi. Ortak değişiklik: 3B grafikte 10'dan
   çok sütun varsa yalnızca öndeki ve yandaki sütunların puanı yazılır, sütunlar incelir; PDF'te 10'dan uzun cetvel
   listesi sayfalara bölünür (Hobi ve Serbest Zaman İlgileri de böyle görünür).
3. **Sayı Dizileri: yayında (2026-10-08, pilot).** 24 özgün dizi, 5 düzey (4, 5, 5, 5, 5), 2 alıştırma; cevap tuş
   takımıyla yazılır, "Bilmiyorum" denebilir; 3. sınıftan yetişkine, ~12 dakika (`content/instruments/sayi-dizileri.ts`,
   `components/runner/tasks/number-series.tsx`). Beş kural türü: sabit artış ya da azalış, çarpma ve bölme, değişen
   artış, iç içe diziler, birleşik kurallar. Her sorunun tek doğru cevabı bağımsız çözücüyle denetlenir
   (`tests/helpers/series-solver.ts`: eksik yere −2000…9999 konur, sabit fark ve oran, 2. ve 3. derece, farklarda oran,
   k·a+b, iki ve üç sayının toplamı, p·a+q·b, iç içe diziler, sırayla değişen iki ve üç işlem); bir soru (sd23) bu yüzden
   değiştirildi. "Tuzak" cevaplar (daha basit bir kuralla bulunan) her soruda tanımlı ve nasıl bulunduğu testte denetlenir.
   Cevap anahtarı ve tuzaklar tarayıcıya gitmez (yayın denetimi de bakar). Rapor: doğru sayısı, düzeylere göre grafik,
   ulaşılan düzey (şekil akıl yürütmedeki ölçüt), kural türleri (3B grafik), çalışma biçimi; yanlışların çoğu tuzaksa ya
   da doğru cevaba çok yakınsa bu söylenir; çok hızlı yazılan yanlışlar, hep aynı sayı ve çoğunda "Bilmiyorum" uyarı
   olur. Bağımsız incelemeden sonra: hızlı ama doğru cevaplar artık "tahmin" sayılmıyor; fareyle tıklanan düğme odakta
   kalıp sonraki cevabı bozmuyor; çift dokunuş soru atlatmıyor; kural türlerinde ölçüt "yarıdan fazlası" (şekil akıl
   yürütmede de; 9 soruluk türde 5/9 artık "çoğu doğru"); "daha az zaman ayırdın" yalnızca belirgin farkta (iki testte de).
4. **Öğrenme ve Başarı Özellikleri: yayında (2026-10-08, active).** IPIP'in altı kamu malı ölçeği (VIA kullanılmadı):
   Çaba ve sebat (HEXACO Diligence), İşe hemen koyulma (TCI benzeri Initiative), Planlı ve dikkatli çalışma (MPQ benzeri
   Planfulness), Zorlukla başa çıkma (TCI benzeri Competence), Düşünmekten hoşlanma (Need for Cognition), Öğrenmeye
   açıklık (6FPQ benzeri Intellectual Openness); 56 madde (iki ölçekte birden olan üç madde yalnızca birinde sorulur), 9.
   sınıftan yetişkine, ~8 dakika, kişilik bölümünde (`content/instruments/ogrenme-ve-basari.ts`). 32 madde öteki testlerin
   çevirisiyle aynı, 24 madde iki taslakla çevrildi. Rapor: 6 özellik × 3 düzey (öğrenci, veli; yetişkin öğrenci metnini
   görür); metinler başka ölçekteki bir davranışı anlatmaz (aynı sayfada çelişmesin). Yol haritası: 6 sütunlu 3B grafik,
   ortamlar yok, 2. hafta Planlı çalışma, 3. hafta en düşük özellik, son hafta Çalışma Alışkanlıkları önerilir
   (`nextPurpose` yeni, isteğe bağlı alan). Bağımsız incelemeden sonra: kesinlik bildiren öneriler olasılığa çevrildi,
   tekrar eden öneriler ayrıldı, bilim kartındaki kaynak cümleleri düzeltildi. Ortak düzeltme: bütün ortalama puanlı
   testlerde düzey artık raporda gösterilen (bir ondalığa yuvarlanmış) puandan belirlenir (ör. 8–9 maddelik ölçekte
   "2,6 / 5 · Düşük" görünmesin; `lib/scoring/likert.ts`).
5. **Sözel Akıl Yürütme: yayında (2026-10-08, pilot).** 24 özgün soru, dört tür (kelime ilişkileri, sınıflama, sıralama,
   mantıksal çıkarım; her türden altı soru, türler beş düzeye yayılır), beş seçenek, her türden bir alıştırma; 3. sınıftan
   yetişkine, ~15 dakika (`content/instruments/sozel-akil-yurutme.ts`, `components/runner/tasks/verbal-reasoning.tsx`).
   Sıralama ve çıkarım sorularının tek doğru cevabı bütün olasılıkları deneyen bir denetleyiciyle doğrulanır
   (`tests/helpers/verbal-logic.ts`: sıralamalarda bütün dizilişler, çıkarımlarda bütün küme durumları); kelime ve sınıflama
   soruları üç ayrı kör çözümle denetlendi (üçü de anahtarla aynı; bulunan belirsizlikler düzeltildi: çıkarım yönergesi
   "yalnızca bu bilgileri kullan", fotoğrafta sol ve sağ, "rüzgâr", "radyo", "bariyer", çocuklar için kısa yönergeler).
   Her sorunun bir "ilk bakışta doğru görünen" çeldiricisi var; doğru cevaplar ve çeldiriciler beş seçeneğe dengeli.
   Cevap anahtarı, çeldiriciler ve düzey anlatımları tarayıcıya gitmez (yayın denetimi de bakar). Rapor: doğru sayısı,
   düzeyler, ulaşılan düzey, soru türleri (3B grafik), çalışma biçimi; rastgele seçim düzeyinde (8/24 ve altı) düzey ve
   türler yorumlanmaz; yanlışların en az %60'ı ve en az 4'ü çeldiriciyse olası yanılgılar anlatılır; okunamayacak kadar hızlı
   yanlış cevaplar (sınır soru uzunluğuna göre 2–7 sn) ve hep aynı seçenek uyarı olur. Bağımsız incelemeden sonra: hızlı
   doğru cevaplar uyarı almaz, yanılgılar olasılık olarak söylenir, Thibaut ve ark. (2010) çalışmasının şekil ve
   renklerle yapıldığı yazılır, klavyede Enter ve odak düzeltildi. Ortak: 3B grafikte çift sayıda sütunda ilk açı 90/n
   (`defaultYaw`; dört ve altı sütunda sütunlar artık üst üste görünmüyor, Öğrenme ve Başarı'da da).
6. **Kâğıt Katlama: yayında (2026-10-09, pilot).** 24 özgün soru, üç katlama türü (ortadan, kenardan, çapraz; her türden
   sekiz soru ve bir alıştırma), bir, iki ya da üç katlama, bir ya da iki delik, beş düzey; 3. sınıftan yetişkine, ~12
   dakika (`content/instruments/kagit-katlama.ts`, geometri `lib/instruments/folding.ts`, çizim `folding-draw.ts`,
   `components/runner/tasks/paper-folding.tsx`). Doğru seçenek kâğıdı adım adım açarak hesaplanır ve bağımsız bir
   benzetimle (`tests/helpers/fold-sim.ts`: kâğıdın her noktası katlanıp deliğe düşenler) doğrulanır. Yanlış seçenekler
   olası yanılgılardan (katlamayı atlamak, aynalamak yerine kaydırmak, yanlış çizgiye göre aynalamak, kenardan katlamayı
   ortadan sanmak, tek kat yeri iki kat sanmak, deliğin yerini yanlış görmek) ve ters çevirip döndürmekten üretilir; her
   soruda doğru seçenekle aynı sayıda delikli bir yanlış seçenek var ve seçenekleri delik sayısına, ortak deliklere,
   simetriye ya da kapsamaya göre seçen basit tahmin yolları 24 soruda en çok 6,5 doğru bulur (rastgele sınırı 8;
   `tests/helpers/folding-check.ts`). Delikler kat kenarlarına denk gelmez. Resimlerde katlanan parçanın kâğıdın
   üstüne geldiği yer çizilir. Rapor: doğru sayısı, düzeyler, ulaşılan düzey, katlama türleri (3B grafik), çalışma
   biçimi; yanılgı türleri olasılık olarak anlatılır. Bağımsız incelemeden sonra: "kâğıt alıp katlayabilirsin" yönergesi
   kaldırıldı (zihinde çözülür), yukarıdaki seçenek düzeni, düzey anlatımları, çapraz alıştırma. Ortak (Sözel Akıl
   Yürütme'de de): yanlışların çoğu çeldiriciyse kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
7. **Kelime Bilgisi: yayında (2026-10-09, pilot).** 24 özgün soru, dört tür (eş anlam, zıt anlam, cümlede anlam,
   deyimler; her türden altı soru, her düzeyde her tür), beş seçenek, her türden bir alıştırma; 3. sınıftan yetişkine, ~8
   dakika (`content/instruments/kelime-bilgisi.ts`, `lib/instruments/vocabulary.ts`, `components/runner/tasks/vocabulary.tsx`).
   Anlamlar TDK Güncel Türkçe Sözlük'le tek tek denetlendi (bir ajan sözlüğe bakarak: ihtiyaç–"istek" ve hızlı–"güçlü"
   sözlükte de geçtiği için değiştirildi); sorular iki kez kör çözüldü (önce iki ajan, değişikliklerden sonra bir ajan
   daha), hepsi anahtarla aynı. Her sorunun yanılgısı belli bir çeldiricisi var (eş/zıt karıştırma, ilgili kelime, ses
   benzerliği, kelimenin başka anlamı, deyimin gerçek anlamı); seçenekler doğru cevabı uzunluğundan, virgülünden ya da
   yazılışından ele vermez (uzunluğa, kelime sayısına, soruyla ortak köke göre seçen tahmin yolları 24 soruda en çok 6,5
   doğru bulur). Rapor ve yol haritası Sözel Akıl Yürütme düzeninde; kaynaklar Nation (2009), Wright ve Cervetti (2017),
   TDK. Aynı değişiklikte Kâğıt Katlama yol haritasında "delik aynalanır" yerine "deliğin bir eşi açılır".
8. **Kural Değiştirme: yayında (2026-10-09, pilot).** Görev değiştirme düzeni: mavi ya da turuncu daire ya da kare;
   üstündeki işaret (RENK ya da ŞEKİL) kuralı söyler, sol ve sağ düğme. Bölümler: yalnızca renk (16), yalnızca şekil (16),
   iki karışık bölüm (33 + 33; kuralın değiştiği ve sürdüğü denemeler 16 + 16, uyumlu ve uyumsuz şekiller ile düğmeler
   dengeli); her bölümden önce geri bildirimli alıştırma (8, 8, 10). İşaret şekilden 0,6 sn önce belirir, şekil 4 sn bekler;
   diziler sabit tohumla (`lib/instruments/rule-switch.ts`, `components/runner/tasks/rule-switch.tsx`). Puanlama: 0,2 sn'den
   kısa ve süresi geçen cevaplar doğru sayılmaz; bölümün ilk denemesi ve hatadan sonraki deneme süreye katılmaz.
   Rapor: doğruluk ve hataların türü (uyumsuz şekillerde öteki kurala göre basma), kural değiştirmenin bedeli, iki
   kuralı akılda tutmanın bedeli (0,05 sn'den küçük farklar belirgin sayılmaz), çalışma biçimi; tipik süreler grafiği.
   3. sınıftan yetişkine. Kaynaklar Stoet ve Snyder (2007), Zinke ve ark. (2012), Hedge ve ark. (2018).
9. **Kelime Listesi Hatırlama: yayında (2026-10-09, pilot).** Sözel liste öğrenme düzeni (Rey'in düzeni; kelimeler,
   tanıma kelimeleri, puanlama ve rapor özgün): 15 kelimelik ilk liste üç kez gösterilir (kelime 1,5 sn, aralık 0,5 sn) ve
   her seferinden sonra hatırlananlar yazılır; ikinci liste bir kez; ilk liste yeniden gösterilmeden; tanıma 35 kelime (15
   hedef; ikinci listeden, anlamca yakın, sesi ve yazılışı benzer, ilgisiz yeni beşer yanılgı). Yazım: büyük-küçük harf,
   Türkçe harf işaretleri, çoğul eki ve 5+ harfli kelimede ilk harf doğruysa tek kayma (eksik/fazla harf, yer değiştirme,
   klavyede yan tuş) hata sayılmaz (`lib/instruments/word-list.ts`); yazılan kelimeler kaydedilmez, raporda da gösterilmez.
   Rapor: öğrenme (üç deneme), öğrenileni koruma (araya giren listeden sonra), tanıma (yanılgı türleri, tanıma ile
   hatırlama farkı), çalışma biçimi (listenin başı, ortası, sonu; 3B grafik); sekme değişince liste baştan gösterilir ve
   uyarı verilir. 3. sınıftan yetişkine. Bağımsız bir ajan kaynakları, kelimeleri ve metinleri denetledi; bulguları
   düzeltildi. Kaynaklar Oliveira ve Charchat-Fichman (2008), Lehmann (2015), Dewhurst ve ark. (2012), Hedge ve ark. (2018);
   yol haritasında ayrıca Roediger ve Karpicke (2006), Cepeda ve ark. (2006).
10. **Çocuk Kişilik Profili: yayında (2026-10-09, pilot; 3–5. sınıf).** IPIP Beş Faktör Belirteçleri'nin 100 maddelik
   formundan her boyuta altı madde (üçü düz, üçü ters) seçildi ve çocuk diline uyarlandı (30 madde; İngilizce asılları
   `source`'ta, yönler kaynakla aynı; testte denetlenir). Üç seçenek (hiç / biraz / çok benziyor); düzey toplamla 6–9 düşük,
   10–14 orta, 15–18 yüksek. Boyut adları: Sosyallik, Başkalarını önemseme, Düzen ve sorumluluk, Sakinlik, Merak ve hayal
   gücü. Yeni ortak özellik: `oppositePairs` (birbirinin tersi beş çiftin en az üçüne aynı uç cevap → "evet deme eğilimi"
   uyarısı; Soto ve ark., 2008). Yalnızca 5. sınıfa kadar açık testlerde öğrenci destek kutusu çocuk diliyle ve 112'siz
   (veliye 112 kalır). Öğrenci ve veli raporu, ortamsız yol haritası (2. hafta çalışma düzeni, Sakinlik düşükse 3. hafta iyi
   oluş, rehber bağlantısı yok); İlkokul 3–4 sayfasında "Nereden başlamalı?" önerisi. Bağımsız ajan maddeleri IPIP
   sayfasıyla, iddiaları kaynaklarla karşılaştırdı; bulguları düzeltildi (ör. "tanımadığım biri" yerine "tanımadığım bir
   çocuk", "zor kitaplar" yerine "bilmediğim konulardaki kitaplar"). Kaynaklar Goldberg (1992, 2006), Soto ve ark. (2008),
   Vicentini ve ark. (2025).
11. **Ders Çalışma Motivasyonu: yayında (2026-10-09, pilot; 5. sınıftan mezuna, yetişkine kapalı).** Öz-belirleme
   kuramına göre sıfırdan yazılmış 25 madde ("…için çalışırım"): merak ve keyif, önemini görme, iç baskı, dış baskı ve
   ödül, isteksizlik (beşer madde, türler sırayla döner; SRQ-A ve AMS maddelerine benzememesi bağımsız ajanla denetlendi).
   İki bileşik ölçek: kendi isteğiyle çalışma (ilk ikisi) ve baskıyla çalışma (ortadaki ikisi). Yeni ortak özellikler:
   `profile: 'motivation'` ve rapor şablonunda `motivation` (dokuz profil: iki bileşik ölçeğin düşük/orta/yüksek
   birleşimi; köşelerde Vansteenkiste ve ark. 2009'un dört profili), yeni grafik "motivasyon haritası" (`quadrant`; ekranda
   ve PDF'te aynı hesap `quadrantGeometry`; nokta köşe adının üstüne düşerse ad hücrenin iç kenarına alınır), bileşik
   ölçek yüksek değilken bir parçası yüksekse "tek başına yüksek" cümlesi (`hidden`), parçalar arasında belirgin fark
   varsa eğilim cümlesi (`lean`), kendi isteğiyle çalışma ile isteksizlik birlikte yüksekse uyarı. Basit raporda maddeler
   artık gruplardan önce de gösterilebilir; madde metninde paragraf ("\n\n") olabilir. Test sayfasında bileşik ölçeğe
   girmeyen ölçek de listelenir. Yol haritası: 2. hafta "Neden önemli?", 3. hafta isteksizlik ya da iç baskı yüksekse
   onlar (iç baskıda Sınav kaygısı bağlantısı). Bağımsız ajan iddiaları kaynaklarla karşılaştırdı; bulgularının hepsi
   düzeltildi (nedensellik dili, abartılar, birbirine ters düşen metinler, iki maddenin AMS'ye benzerliği). Kaynaklar Ryan
   ve Deci (2000), Ryan ve Connell (1989), Vansteenkiste ve ark. (2009), Howard ve ark. (2021), Bureau ve ark. (2022).
12. **Erteleme ve Zaman Yönetimi: yayında (2026-10-09, pilot; 6. sınıftan yetişkine).** Sıfırdan yazılmış 25 madde
   (Lay, Tuckman, Steel ve Macan ölçeklerine benzememesi bağımsız ajanla denetlendi), beş alan, hepsinde yüksek = beceri:
   Ertelemeden başlama, Planlama ve öncelik, Süreyi tahmin etme, Odağı koruma, Zamanın kontrolü; 25 maddenin 11'i ters
   yönlü, beş karşıt çift. Yeni ortak özellikler: rapor şablonunda `insight` ("Birlikte bakınca": ertelemenin düzeyine göre
   giriş ve düzey birleşimlerine göre cümleler; `when` ve `not` koşulları; test sayfasında da bir satır), beş ve daha çok
   seçenekli ölçeklerde karşıt çift uyarısı uçtaki iki seçeneği birlikte sayar ("Sık sık" ya da "Her zaman"; evet diyen
   biri "sık erteleyen" diye yorumlanmasın). Öğrenci, veli ve yetişkin raporu; yol haritası (2. hafta planlama, 3. hafta
   zamanın kontrolü düşükse o, değilse en düşük alan). Bağımsız ajan iddiaları kaynaklarla karşılaştırdı; bulguları
   düzeltildi (Buehler'de yalnızca hatırlamanın yetmediği, Aeon'da "biraz daha güçlü", çelişen cümleler, çift olumsuzlar,
   iki maddenin benzerliği). Kaynaklar Steel (2007), Sirois ve Pychyl (2013), Macan ve ark. (1990), Buehler, Griffin ve
   Ross (1994), Gollwitzer ve Sheeran (2006), Aeon, Faber ve Panaccio (2021).
13. **Zihniyet: Zekâ ve Öğrenme İnançları: yayında (2026-10-09, pilot; 5. sınıftan yetişkine).** Sıfırdan yazılmış 24
   madde (Dweck'in örtük zekâ ölçeği, Blackwell ve ark. çaba inancı ve Haimovitz ve Dweck başarısızlık maddelerine
   benzememesi bağımsız ajanla denetlendi; benzer bulunan beş madde yeniden yazıldı), dört alan, hepsinde yüksek = gelişim
   yönü: Zekâya bakış, Çabaya bakış, Hataya bakış, Zorluğa yaklaşım; her alanda üç ters madde, beş karşıt çift (gerçekten
   birbirinin tersi olanlar: sabit zekâ görüşündeki biri "öğrenince beceriler gelişir"e de katılabilir). "Birlikte bakınca"
   zekâ inancıyla diğer üç alanın örtüşüp örtüşmediğini yorumlar (zekâ orta iken de). Zihniyet abartılmaz: başarıyla
   ilişkisi küçük (Sisk ve ark. 2018: r = .10; üniversite öğrencileri gibi erişkinlerde neredeyse yok), kısa çalışmaların
   etkisi çok küçük; "zorlanma anlarında belirginleşir" yalnızca hedefler ve yollar için söylenir (Burnette ve ark. 2013) ve
   bir raporda bir kez geçer (test denetler). Yol haritası: 2. hafta "Hatadan öğrenmek", 3. hafta en düşük alan. Kaynaklar
   Blackwell ve ark. (2007), Burnette ve ark. (2013), Haimovitz ve Dweck (2016), Sisk ve ark. (2018), Burgoyne ve ark.
   (2020), Yeager ve ark. (2019), Dunlosky ve ark. (2013).
14. **Çalışma Değerleri: yayında (2026-10-09, pilot; 7. sınıftan yetişkine).** Sıfırdan yazılmış 32 ifade (Super'in
   envanteri, O*NET ve Minnesota ifadeleri ve Monitoring the Future ifadeleriyle bağımsız ajan karşılaştırdı; yakın bulunan
   dördü yeniden yazıldı), sekiz değer: İlgi ve öğrenme, Kazanç, Başkalarına yardım, Bağımsızlık, Güvence, Birlikte
   çalışma, Saygınlık ve ilerleme, Yaşam dengesi; önem derecesi 1–5, ters ifade yok. Yeni ortak özellik: `profile: 'values'`
   (sıralı değer profili; kişinin kendi içinde sıralama: en önemliler üçüncü en yüksek puana kadar, eşitlikte en çok dört
   ve aynı sıra numarasıyla; birbirine ters yönde çekebilen üç değer çifti Schwartz 2012'ye göre "Birbiriyle yarışabilir";
   sona kalan değerler düzeyleriyle; kapanış notu), ifadelerin adı "ifade", ilgi yol haritası şablonunda `lowNote`. Yol
   haritası ilgi testlerininkiyle aynı yapıda (en önemli değerlere göre bir işi tanırken sorulacak sorular). Kaynaklar
   Busque-Carrier ve ark. (2022), Kristof-Brown ve ark. (2005), Lechner ve ark. (2017), Schwartz (2012), Twenge ve ark. (2010).
15. **Mantıksal Akıl Yürütme: yayında (2026-10-09, pilot; 5. sınıftan yetişkine).** Site sahibinin 2026-10-09 seçimiyle
   Akıl Yürütme dalgasının ilki. 32 özgün soru (iki bilgi ve bir sonuç; "Evet, kesin olarak doğru" / "Hayır, kesin değil"),
   ~12 dakika, 3 alıştırma (`content/instruments/mantiksal-akil-yurutme.ts`, `components/runner/tasks/logical-reasoning.tsx`).
   16 "eğer–ise" sorusu (dört çıkarımın her birinden dört; ikisi uydurma canlı adlarıyla, ikisi gelişigüzel kurallarla) ve
   16 "bütün, bazı, hiçbir" sorusu (geçerlik × sonucun gerçek hayatta doğru olup olmaması). Her sorunun cevabı
   `tests/helpers/logic-check.ts`'teki bağımsız denetleyiciyle (bütün olası dünyalar denenerek) doğrulanır. Rapor: doğru
   sayısı, eğer–ise (kesin olanlar ve olmayanlar; "karşı örnek" ve "temkinli" yorumları), "Bilgiler ve gerçek hayat"
   (inandırıcılık etkisi yalnızca iki puanlık farkta ve yanılgının yönü sayısıyla), çalışma biçimi; hep aynı cevap
   (28/32), rastgele seçimin altı (≤10/32) ve okumadan seçme (hızlı ve çoğu yanlış) uyarıları. Kaynaklar Datsogianni ve
   ark. (2020), De Neys ve Van Gelder (2009), Evans, Barston ve Pollard (1983), Evans, Thompson ve Over (2015), Trippas ve
   ark. (2018), Markovits (2014).
16. Sıradaki (Akıl Yürütme dalgası, site sahibinin 2026-10-09 seçimi, bu sırayla): Sayısal Akıl Yürütme (sınıfa göre
   formlar, özgün oran ve problem soruları), Küp Açınımı (SVG açınımlar, çözücüyle doğrulama), Düşünerek Karar Verme
   (özgün sezgi tuzağı soruları; rapor sezgisel yanlışı öteki yanlışlardan ayırır).

**ÖNCE BU — Sesli okumada otomatik analiz: önizlemede (2026-10-08), site sahibinin denemesi bekleniyor.**
Site sahibinin isteği: öğrenci kendisi okur, yetişkin kaydı dinlemez; okuma bitince "Okumanı analiz etmemizi ister
misin?" → "Evet" → sistem kaydı kendisi inceler ve rapor verir; hiçbir şey saklanmaz; öncelik doğruluk. Aylık ek sunucu
ücreti istemediği için (KVM 4 konuşuldu, pahalı bulundu) analiz **öğrencinin cihazında** yapılır (CLAUDE.md, "Sesli
okumada otomatik analiz").
- Önizleme: https://olcekhane.com/testler/sesli-okuma-degerlendirmesi/coz?onizleme=otomatik (herkese açık sürüm hâlâ
  yetişkinin dinlediği sürüm). Site sahibi bilgisayardan ve telefondan deneyecek; beğenirse otomatik sürüm varsayılan
  olur, Okuma sayfası ve yetişkin sürümünü anlatan metinler ("konuşmayı yapay zekâyla tanımaya çalışmaz" vb.) güncellenir.
- Akış: metin seçimi → sıkı mikrofon denemesi (izin, sessizlik ölçümü, cümle; yapay zekâ cümleyi tanımalı; model bu
  sırada iner, ~250 MB, ilk seferde) → okuma → kayıt denetimi → izin sorusu → analiz arka planda, öğrenci bu sırada
  soruları cevaplar → ses silinir → rapor ("net anlaşılamadı" kelimeler hata sayılmaz).
- Ölçümler: Whisper small q8, FLEURS Türkçe WER %15; sentetik yanlış okumalarda hata yakalama ve yanlış alarm
  tests/sesli-okuma-hizalama.test.ts'te. Bu ortamda (2 çekirdek) 72 sn'lik okuma ~1,5–2 dk'da incelendi; telefonda
  daha uzun sürebilir. **Gerçek çocuk kayıtlarıyla ölçüm yapılmadı**: site sahibinden izinli 30–50 kayıt istendi.
- 2026-10-08 uçtan uca deneme (gerçek Chromium, telefon ve masaüstü, sahte mikrofona gTTS Türkçe ses; betik
  depo dışında): doğru okuma (0 hata), planlı hatalar (3 kelimelik atlama, erik→elma, fazladan "küçük": üçü de
  bulundu, yanlış alarm yok), başka metin okuma ("anlayamadık" → yeniden okuma, cevaplar korundu), yarım bırakma,
  hızlı bitirme, sessiz kayıt, "Hayır", mikrofon hataları (gürültü, yanlış cümle, sessizlik, kısık ses), 1. sınıf
  metni; ikinci ziyarette model önbellekten geldi (sunucuya istek yok). Düzeltilenler bir önceki maddede.
- 2026-10-08 öğleden sonra: site sahibi denedi, mikrofon denemesini geçemedi ve metne ulaşamadı (büyük olasılıkla
  düzeltmeden önceki sürümle: kısa seste kelime zamanları kayıyor, cümle "anlaşılamadı" çıkıyordu). İsteği: kuş,
  iş makinesi, tadilat sesi olan ortamda da öğrencinin sesi seçilsin. Yapılan: mikrofon denemesi yapay zekâ önce
  (gürültü/kısıklık/sessizlik ölçümü engellemiyor, üç denemede anlaşılmazsa "Yine de okumaya geç"), 7 sn cümle
  süresi, metne dokununca doğrudan geçiş, "Başla" takılmasın diye zaman sınırları, 90 Hz yüksek geçiren süzgeç,
  gürültülü kayıtta ek/ses farkı hata sayılmıyor. Yapay gürültüyle denendi (iş makinesi, tadilat, kuş; konuşmayla eşit
  yükseklikte, tarayıcının gürültü bastırması olmadan): mikrofon ilk denemede geçti, planlı üç hata bulundu, doğru
  okumada hata yazılmadı. Site sahibi yeniden deneyecek; olmazsa cihazını ve ekrandaki yazıyı soracağız.
- Bekleyen: aydınlatma metni sürüm 7 avukat kontrolü; "Evet" ekranına 18 yaş altı için veli izni cümlesi; WebGPU
  (q4 dosyaları) denenmedi, şimdilik yalnızca WebAssembly.
- Sunucu: canlı sunucu KVM 1 (aylık, 30 Eylül'de alındı, 30 Ekim civarı yenilenecek). KVM 4 fiyatları site sahibine
  çıkarıldı (24 ay peşin 15.926 TL, aylık ~2.300 TL tahmini); şimdilik gerek yok.

0. **Okuma bölümü:** (a) yeni metinler (her sınıfa öykü ve bilgilendirici; `src/content/instruments/sesli-okuma/`,
   kurallar `tests/sesli-okuma.test.ts`'te); (b) aynı kayıt ve işaretleme altyapısıyla yeni değerlendirmeler: 1 dakikalık
   kelime listesi okuma, anlamsız kelime okuma (kod çözme), 1. sınıf için harf ve hece okuma; (c) düzey eşikleri
   (doğru okuma %97/%90, anlama %80/%60) Ölçekhane'nin pilot ölçütüdür: kaynak sitelerine erişim açılınca (bkz. site
   sahibinin bekleyen işleri) Türkiye'de kullanılan ölçütlerle karşılaştırılır; hocaya da sorulabilir.
1. **Büyük planın 2. basamağı: tamamlandı (2026-10-07).** Bütün testlerin gelişim yol haritaları doğrudan yayına
   alındı (2026-10-07 kararı); hocanın düzeltme istekleri 2026-10-11'deki buluşmadan sonra gelecek. Yayında: Beş Faktör, Ayrıntılı ve Altı Boyutlu Kişilik, Duygusal Zekâ
   Bileşenleri (2. hafta "Duygularına dikkat", iyi oluş haftası Üzücü olaylardan etkilenme yüksekken; şablonda
   `planningTitle` ve `wellbeing.link`), Kişilerarası Tarz (sekiz tarz çemberin sırasıyla; 2. hafta "Birlikte
   çalışırken" = Öne çıkma; iyi oluş haftası yok), Öz-saygı (tek boyut: üç boyutlu profil ve ortamlar yok, 3. hafta
   şablondaki `extraWeek`, "Öz-saygı nedir?" bağlantısı), Çalışma Alışkanlıkları (ortamlar yok; 3. hafta en düşük
   puanlı alışkanlık, `thirdWeek: 'lowest'`), üç ilgi testi (keşif yol haritası, `INTEREST_ROADMAPS`: öne çıkan
   alanlar için keşif önerileri, Holland profilinde eğitim yolları, haftalık denemeler; öne çıkan alan yoksa yalnızca
   kısa not ve genel denemeler), Matematik Konu Tarama (`ACADEMIC_ROADMAPS`: konu alanlarına göre çalışma kartları
   her formun konularına göre, haftalık çalışma düzeni, 1. hafta hata defteri) ve Okuma Hızı ve Anlama
   (`READING_ROADMAPS`: soru türlerine göre öneriler, hız ve anlama dengesi, okuma alışkanlığı). Zihinsel
   görevler (`TASK_ROADMAPS`, sekiz görev): site sahibinin seçimiyle becerinin günlük hayatta nerede kullanıldığı ve o
   işleri kolaylaştıran yollar, "Bilmekte yarar var" kutusu; "beyni çalıştırma" ya da puanı yükseltme vaadi yok. 2.
   basamak tamamlandı; hoca buluşmasında (2026-10-11) yayındaki yol haritaları incelenecek.
2. **Rehber yazıları:** aşağıdaki 35 konu, listedeki sırayla, her mesajda bir yazı.
3. **3. dalga, 7 özgün test (önce incelemede, onaydan sonra pilot):** Ders Çalışma Motivasyonu, Erteleme ve Zaman
   Yönetimi, Zihniyet, Çalışma Değerleri, Kural Değiştirme, Akıl Yürütme, Kelime Listesi Hatırlama. Maddeler
   sıfırdan yazılır.
4. **4. dalga:** Türkçe ve Fen Konu Tarama, Kelime Bilgisi, Alan ve Bölüm Seçimi Rehberi, Hızlı Kişilik Testi;
   test paketleri (birkaç testi art arda çözüp tek PDF almak; cevaplar yine saklanmaz).
5. **Etkileşimli anlatımlar (5, test değil):** unutma eğrisinde tekrar zamanlarını deneme, Stroop etkisini kendin
   görme, ölçüm payını cetvel üzerinde görme, kişiliğin 30 alt boyutlu haritası, beyinle ilgili bilinenler ve
   efsaneler.
6. **Bekleyen:** Karakter Güçlü Yanları (2. dalga) avukat görüşünü bekliyor; görüş gelmeden başlanmaz. Maneviyat
   ölçeği kullanılmaz, test 23 güçlü yanla sunulur. Görüş gelene kadar sitede bu test için "yakında" denmez.

## Beyin Akademisi (site sahibinin 2026-10-08 isteği)

İstek: kişilik ve zekâ testlerinin yanında ayrı bir bölümde çok kapsamlı bir nörobilim dalı: (1) beyin anatomisi:
beyni oluşturan bütün yapılar, sıfırdan anlaşılır sade Türkçeyle ama tıp fakültesine yeni başlayan birine çok ayrıntılı
bilgi verecek düzeyde; (2) beyin nasıl çalışır: nöronlar, öğrenme ve çalışma biçimleri. Bol görsel, üç boyutlu ve
hareketli. Site sahibi bölümü **2026-10-13 dolayında alanında uzman kişilere tanıtacak**; adım adım, acele etmeden.
Kararları: üç boyutlu model + hareketli çizimler; ad "Beyin Akademisi"; dersler hazır oldukça doğrudan yayına.

Genişletilmiş hedef (site sahibinin 2026-10-08 ikinci isteği, onaylı): kişiyi sıfırdan uzman düzeyine taşıyan en
büyük Türkçe beyin kaynağı; tıp, nörobilim ve psikoloji bir arada; lise ve sağlık lisesi öğrencileri, tıp, nörobilim
ve psikoloji öğrencileri, meraklılar için; tıp fakültelerinin de kullanabileceği ücretsiz kaynak. Dört ayak: Dersler,
Atlas, Ansiklopedi, Pratik. **Her işlemede bir ders**, acele yok, tek ölçüt kalite. Uzmanlarla site sahibi görüşür.
Yanıtlanmamış iki soru (sorulmadan değiştirilmez): uzman adları sayfalarda görünsün mü (şimdilik "Uzman incelemesi
bekliyor" yazar) ve içerik lisansı (şimdilik değişmedi).

- Adresler: `/beyin-akademisi`, `/beyin-akademisi/<bölüm>` (8 bölüm), `/beyin-akademisi/<bölüm>/<ders>`,
  `/beyin-akademisi/beyin-gezgini`. Eski `/beyin-akademisi/nasil-calisir` adresleri `hucre-ve-molekul`'e kalıcı yönlenir.
- Program: 8 bölüm, 100 ders (`src/content/beyin/index.ts`; 2026-10-09'da üniteler eklenince 110'a çıktı, sonra site sahibinin kararıyla yalnızca beyin: kafatası dersleri ve kol-bacak sinirleri çıktı): Anatomi 30, Hücreden Sinyale 16, Sistem Nörobilimi 15,
  Zihin ve Davranış 12, Yaşam Boyu Beyin 5, Klinik Nörobilim 12, İnceleme Yöntemleri 6, Tarih, Efsaneler ve Etkili
  Öğrenme 4. Her dersin seviyesi var: Temel, Lisans, İleri ve klinik.
- Ders standardı (site sahibinin 2026-10-08 üçüncü isteği: "öğrenciden profesöre, tıp ve beyin cerrahisi dahil, çok
  kapsamlı ve çok derin"; Ders 1 bu ölçüyle yeniden yazıldı, **site sahibi beğenirse bütün dersler böyle yapılacak**):
  üç katman: **Temel** (meraklı herkes, lise), **Lisans** (tıp, nörobilim, psikoloji öğrencisi), **Uzman** (asistan
  hekim, beyin cerrahı, araştırmacı). Her blok `duzey` taşır; okuyucu düzey seçer, üstündeki katmanlar ve sorular
  gizlenir (hiçbir yere kaydedilmez; temel anlatım tek başına tam). Kutular: Aklında kalsın, Biliyor muydun, Dikkat
  (temel); Derinleş, Klinik bağlantı, Sınav notu, Görüntülemede (lisans); Beyin cerrahisinde, Araştırma sınırı
  (uzman). Klinik vakalar (öykü, soru, "Çözümü göster"). Metin içinde yazar-yıl atıfları, sonda APA künyeleri. Ders
  klasörü: `bolum-*.ts`, `sozluk.ts`, `sorular.ts` (her düzeyde 12, doğru şıklar dağıtılmış), `kaynaklar.ts`. Yayından
  önce dersi yazmamış ayrı bir ajan bilgileri kaynaklarla karşılaştırır; bulduğu yanlışlar düzeltilir.
- Kolay kullanım (2026-10-08, site sahibinin isteği): ders Temel ile açılır; en başta "Sen kimsin?" kartları; Lisans
  ve Uzman bölümleri mavi ve mor kenar çizgisiyle ayrılır; her konunun sonunda "devamı var" kutusu; okurken altta
  düzey şeridi; sahnelerde ilk dokunuşa kadar "Parmağınla döndür" ipucu. Uzmanlara gösterilecek doğrudan bağlantı:
  https://olcekhane.com/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis?duzey=uzman
- Hazır: Anatomi 1 "Sinir sistemine ilk bakış" (sürüm 4, 2026-10-09: sinir sistemi ünitesinin genel bakışı, yeni ölçüyle
  baştan yazıldı; 13 bölüm: ne yapar ve nasıl bölünür, yön bulmak, sinir dokusu, sayılarla, beynin bölümleri, loblar,
  gelişim, omurilik ve omurga, çevresel sinir sistemi, otonom ve enterik sistem, koruyanlar ve besleyenler, hasar nerede,
  bugün nasıl inceliyoruz; 35 sahne, 9 hareketli çizim, 19 vaka, 44 tablo, 82 soru, 152 terim, 234 kaynak; okuma süresi
  temel ~98, lisans ~252, tamamı ~320 dk; UÇEP: 127, 138, 154, 156, 164, 166, 216, 224, 225, 227, 246, 252, 291).
  Dört araştırmayla 1472 doğrulanmış not satırı (Gray 1918, OpenStax, UTHealth, TA2, açık tam metinler); beş bağımsız
  denetçi ~100 bulgu bildirdi, hepsi kaynağa bakılarak düzeltildi. Kanama, Monro–Kellie ve otonom çizimlerinin metinleri
  kaynaklara göre düzeltildi (dayanaksız "%75 vagus", "40 mmHg", Cushing ve "normal 7–15" çıkarıldı). Modelde yeni
  "omurga" paketi: C3–L5 omurları, sağrı kemiği ve omurlar arası diskler (sürüm 75b11dae6b); modelde omurilik ve
  sinirler yoktur.
- **Yayından kaldırıldı (2026-10-09, site sahibinin kararı):** "Kafatası: beynin kemik kalesi" ve "Kafatası 1: Kemikler
  tek tek" (her biri bağımsız denetimden geçmiş, yayında kalmış derslerdi: 7 ve 10 bölüm, 7 ve 39 sahne, 167 ve 187
  kaynak, 131 kemik işaret noktası). Klasörleri, işaret noktaları ve çizimleri depoda saklı; eski adresler ilk derse
  geçici yönlenir. Site sahibi isterse geri gelir.
- **Site sahibinin 2026-10-09 kararı:** kafatası dersi istediği kapsam ve derinlikte bulunmadı. Kalıcı istekleri: derinlik
  sınırı açık erişimli tam metinler ve ders kitaplarıyla aşılacak (özetle yetinilmez); büyük konular birkaç derslik
  üniteye bölünerek büyütülecek. Program 106 derse çıktı: mevcut kafatası dersi ünitenin genel bakışı oldu, ardından
  altı ders: (1) kemikler tek tek, (2) beş yönden kafatası ve iç taban, (3) delikler, kanallar ve derin çukurlar,
  (4) kafatası–boyun bileşkesi, (5) gelişim ve hastalıklar, (6) kırıklar, görüntüleme ve cerrahi anatomi.
- **Site sahibinin 2026-10-09 ikinci kararı:** ilk ders ("Sinir sistemine ilk bakış") da istediği kapsam ve derinlikte
  bulunmadı; önce bu ders üniteye çevrilip bitirilecek, sonra kafatası ünitesine dönülecek. Program 110 derse çıktı:
  genel bakış (yeni ölçüyle baştan yazılacak) ve dört ders: (1) anatominin dili, (2) omurilik sinirleri ve
  dermatomlar, (3) boyun ve kol sinir ağları, (4) bel-sakral ağ ve bacak sinirleri. Kafatası dersleri programda 6–12.
  sıraya kaydı.
- **Site sahibinin 2026-10-09 üçüncü kararı (kalıcı):** Beyin Akademisi atlas ve ansiklopedi derinliğinde olacak,
  profesörler de yararlanabilmeli; ama dil her düzeyde (Uzman dahil) çok yalın ve sade: herkes okuyunca anlamalı. Her
  konu çok kapsamlı işlenir, zaman sınırı yok. İlk dersin dili bu ölçüyle sadeleştirildi (bilgi, sayı ve kaynaklar
  aynen kaldı; makineyle denetlendi).
- **Site sahibinin 2026-10-09 dördüncü kararı (kalıcı):** Beyin Akademisi **yalnızca beyni** anlatır: beyin ve onu
  oluşturan bütün yapılar, ne işe yaradıkları, beynin nasıl çalıştığı ve nasıl öğrendiği; nörobilim ve tıp öğrencisinden
  profesöre, öğretmenden beyin cerrahına herkesin başvuracağı, Türkiye'de eşi olmayan bir beyin atlası ve ansiklopedisi.
  Kafatası işlenmez (iki kafatası dersi yayından kalktı). Sinir sistemi ünitesinden yalnızca "Anatominin dili" kaldı
  (kol-bacak sinirleri ve dermatomlar çıktı); omurilik ve çıkan-inen yollar dersleri kalır. Derinlik ve sade dil aynen.
- **Sıradaki ders:** Anatomi 2 "Anatominin dili: beyinde yön bulmak" (yönler, eksenler, düzlemler ve kesitler, MR/BT'de
  yön ve sağ-sol, standart koordinatlar, terimlerin kökeni; kaynak araştırması bitti: dört grupta 1677 doğrulanmış not,
  çalışma klasöründe). Sonra programdaki sırayla beyin dersleri: beyin zarları, karıncıklar ve BOS, atardamarlar...
  Denetçilerin önerdiği 2B çizimler (nöron biçimleri, glia, nörülasyon ve kesecikler, lokalizasyon merdiveni, sert zar
  katmanları ve sinüsler, BOS yolu, Willis varyantları) ilgili derslerde yapılacak. Site sahibi başka bir ders isterse
  o yapılır.
- **Beyin cerrahisi bölümü fikri ertelendi** (site sahibi, 2026-10-08): ayrı bir beyin cerrahisi bölümü şimdilik
  eklenmez; site sahibi bu işler bitince en son karar verecek. Sorulmadan eklenmez. Derslerin Uzman düzeyindeki
  cerrahi kutuları sürer.
- Doğrulanamayan, derse girmeyen bilgiler: hemiparezi terimleri; kabuk kalınlığının 1–4,5 mm aralığı; lakünar
  arter çapları; nimodipinin etkisi (bağımsız denetimde çıkarıldı).
- Hiçbir şey saklanmaz: ilerleme işaretlenmez, "Kendini dene" cevapları yalnızca sayfanın belleğinde durur.

## Testler

Adresler `https://olcekhane.com/testler/<adres>` biçimindedir. **Yayında:** listelerde ve arama motorlarında.
**İncelemede:** yalnızca doğrudan bağlantıyla açılır (2026-10-07'den beri kullanılmıyor; şu an incelemede test yok).

| Test | Adres | Durum |
| --- | --- | --- |
| Öz-saygı Ölçeği | oz-saygi | Yayında (active) |
| Beş Faktör Kişilik Profili | bes-faktor-kisilik | Yayında (active) |
| Çalışma Alışkanlıkları Envanteri | calisma-aliskanliklari | Yayında (pilot) |
| Dikkat ve Çalışma Belleği Görevleri | dikkat-ve-bellek | Yayında (pilot) |
| Sürekli Dikkat: Harf İşaretleme | surekli-dikkat | Yayında (pilot) |
| Mesleki İlgi Profili | mesleki-ilgi-profili | Yayında (pilot) |
| Okuma Hızı ve Anlama | okuma-hizi-ve-anlama | Yayında (pilot) |
| Matematik Konu Tarama Testi | matematik-konu-tarama-testi | Yayında (pilot) |
| Ayrıntılı Kişilik Profili | ayrintili-kisilik-profili | Yayında (active) |
| Meslek İlgi Alanları | meslek-ilgi-alanlari | Yayında (active) |
| Renk-Kelime Görevi | renk-kelime-gorevi | Yayında (pilot; hoca onayı beklenmeden) |
| Dur-Git Görevi | dur-git-gorevi | Yayında (pilot; hoca onayı beklenmeden) |
| Sırayla Birleştirme Görevi | sirayla-birlestirme-gorevi | Yayında (pilot; hoca onayı beklenmeden) |
| Altı Boyutlu Kişilik Profili | alti-boyutlu-kisilik-profili | Yayında (active) |
| Duygusal Zekâ Bileşenleri | duygusal-zeka-bilesenleri | Yayında (active) |
| Kişilerarası Tarz | kisilerarasi-tarz | Yayında (active) |
| Hobi ve Serbest Zaman İlgileri | hobi-ve-serbest-zaman-ilgileri | Yayında (active) |
| Geriye Dönük Hatırlama | geriye-donuk-hatirlama | Yayında (pilot; hoca onayı beklenmeden) |
| Zihinde Döndürme | zihinde-dondurme | Yayında (pilot; hoca onayı beklenmeden) |
| Tepki Hızı | tepki-hizi | Yayında (pilot; hoca onayı beklenmeden) |
| Şekil Akıl Yürütme | sekil-akil-yurutme | Yayında (pilot; 3. sınıftan yetişkine) |
| 16 Faktörlü Kişilik Profili | 16-faktorlu-kisilik-profili | Yayında (active; 9. sınıftan yetişkine) |
| Sayı Dizileri | sayi-dizileri | Yayında (pilot; 3. sınıftan yetişkine) |
| Öğrenme ve Başarı Özellikleri | ogrenme-ve-basari-ozellikleri | Yayında (active; 9. sınıftan yetişkine) |
| Sözel Akıl Yürütme | sozel-akil-yurutme | Yayında (pilot; 3. sınıftan yetişkine) |
| Kâğıt Katlama | kagit-katlama | Yayında (pilot; 3. sınıftan yetişkine) |
| Kelime Bilgisi | kelime-bilgisi | Yayında (pilot; 3. sınıftan yetişkine) |
| Kural Değiştirme | kural-degistirme | Yayında (pilot; 3. sınıftan yetişkine) |
| Kelime Listesi Hatırlama | kelime-listesi-hatirlama | Yayında (pilot; 3. sınıftan yetişkine) |
| Çocuk Kişilik Profili | cocuk-kisilik-profili | Yayında (pilot; 3–5. sınıf) |
| Ders Çalışma Motivasyonu | ders-calisma-motivasyonu | Yayında (pilot; 5. sınıftan mezuna) |
| Erteleme ve Zaman Yönetimi | erteleme-ve-zaman-yonetimi | Yayında (pilot; 6. sınıftan yetişkine) |
| Zihniyet: Zekâ ve Öğrenme İnançları | zihniyet | Yayında (pilot; 5. sınıftan yetişkine) |
| Çalışma Değerleri | calisma-degerleri | Yayında (pilot; 7. sınıftan yetişkine) |
| Mantıksal Akıl Yürütme | mantiksal-akil-yurutme | Yayında (pilot; 5. sınıftan yetişkine) |
| Sesli Okuma Değerlendirmesi | sesli-okuma-degerlendirmesi | Yayında (pilot; Okuma sekmesinde) |

Hazırlanıyor listesinde (katalogda bağlantısız): Türkçe Konu Tarama Testi (`src/content/roadmap.ts`).

## Hoca incelemesi

Claude Docs'taki inceleme belgeleri (sonunda Onay tablosu). 2026-10-07 kararıyla onay beklenmeden yayına alınanlar
hocanın 2026-10-11 buluşmasında incelenebilir; belgeleri hocaya site sahibi iletir. Yeni belge yalnızca site sahibi
isterse hazırlanır (CLAUDE.md, "Yeni test"); en yenisi örnek alınır.

| Belge | Testler | Durum |
| --- | --- | --- |
| [Ayrıntılı Kişilik Profili İncelemesi](https://claude.ai/artifact/6hgnALjSe966eXfd51gJQq) | Ayrıntılı Kişilik Profili | Onaylandı (2026-10-07), yayında |
| [Meslek İlgi Alanları İncelemesi](https://claude.ai/artifact/C9wjSAB8DeA3CqP6XHSCQr) | Meslek İlgi Alanları | Onaylandı (2026-10-07), yayında |
| [Zihinsel Görevler İncelemesi](https://claude.ai/artifact/NsQwxqSdN2JMQzc4Q14L3f) | Renk-Kelime Görevi, Dur-Git Görevi, Sırayla Birleştirme Görevi | Onay beklenmeden yayında (2026-10-07); hocanın görüşü bekleniyor |
| [Altı Boyutlu Kişilik Profili İncelemesi](https://claude.ai/artifact/7CyxdkAJK6YeCGWJxyToJ1) | Altı Boyutlu Kişilik Profili | Onaylandı (2026-10-07), yayında |
| [Duygusal Zekâ Bileşenleri İncelemesi](https://claude.ai/artifact/VRC7jJQhpMUPcmw9cHnSup) | Duygusal Zekâ Bileşenleri | Onaylandı (2026-10-07), yayında |
| [Kişilerarası Tarz İncelemesi](https://claude.ai/artifact/KjJpTLotNssmP2X2vGrWM4) | Kişilerarası Tarz | Onaylandı (2026-10-07), yayında |
| [Hobi ve Serbest Zaman İlgileri İncelemesi](https://claude.ai/artifact/Q3jafRsMG6HesnzBrw93VP) | Hobi ve Serbest Zaman İlgileri | Onaylandı (2026-10-07), yayında |
| [Geriye Dönük Hatırlama İncelemesi](https://claude.ai/artifact/659BWzuYohtcK9QfCvZbEV) | Geriye Dönük Hatırlama | Onay beklenmeden yayında (2026-10-07); hocanın görüşü bekleniyor |
| [Zihinde Döndürme İncelemesi](https://claude.ai/artifact/Aftf1twHWeuaLpfQLgwZRv) | Zihinde Döndürme | Onay beklenmeden yayında (2026-10-07); hocanın görüşü bekleniyor |
| [Tepki Hızı İncelemesi](https://claude.ai/artifact/Nkt8WiGPtSfpvbppwmF1Hy) | Tepki Hızı | Onay beklenmeden yayında (2026-10-07); hocanın görüşü bekleniyor |
| [Beş Faktör Gelişim Yol Haritası İncelemesi](https://claude.ai/artifact/HaGkWkUNY9q6jJasEDk8gt) | Beş Faktör Kişilik Profili (yol haritası) | Onaylandı (2026-10-07), yayında |
| [Ayrıntılı ve Altı Boyutlu Kişilik Gelişim Yol Haritası İncelemesi](https://claude.ai/artifact/UwsHRuzXgxSWkf6qrbZUWC) | Ayrıntılı Kişilik Profili, Altı Boyutlu Kişilik Profili (yol haritası) | Onaylandı (2026-10-07), yayında |
| [Duygusal Zekâ Bileşenleri Gelişim Yol Haritası İncelemesi](https://claude.ai/artifact/QWByT2popLrQ6t1fd3C3nd) | Duygusal Zekâ Bileşenleri (yol haritası) | Onay beklenmeden yayında (2026-10-07); hocanın görüşü bekleniyor |
| [Kişilerarası Tarz Gelişim Yol Haritası İncelemesi](https://claude.ai/artifact/KbBPXJx5AB8o9cPifJXo8k) | Kişilerarası Tarz (yol haritası) | Onay beklenmeden yayında (2026-10-07); hocanın görüşü bekleniyor |

## Rehber yazıları

Yayında 8 yazı (`src/content/rehber/yazilar/`): İnternetteki kişilik testleri güvenilir mi?, Beş faktör kişilik
modeli, Öz-saygı nedir?, Sınav kaygısı, Etkili ders çalışma yöntemleri, Öğrenme stilleri efsanesi, Okuma hızı ve
okuduğunu anlama, Meslek seçiminde ilgi envanterleri.

Plandaki 35 yazı, yazılacağı sırayla (yazılınca `[x]` ve adresi eklenir):

**Kişilik bilimi**
- [ ] Karakter güçlü yanları nelerdir, nasıl gelişir? (Test avukat görüşünü beklediği için yazı teste bağlanmaz.)
- [ ] Kişilik değişir mi? Ergenlikten yetişkinliğe
- [ ] İçe dönüklük bir kusur mu?
- [ ] Altıncı boyut: dürüstlük ve alçakgönüllülük
- [ ] Duygusal zekâ: araştırmalar ne diyor, ne demiyor?
- [ ] Popüler "kişilik tipi" testleri neden bilimsel sayılmaz?

**İlgi ve meslek**
- [ ] İlgi mi, yetenek mi? Meslek seçerken neye bakmalı?
- [ ] Lisede alan seçimi: öğrenci ve veliler için rehber
- [ ] Hobi ile meslek arasındaki fark
- [ ] Çalışma değerleri: bir işte neye önem veriyoruz?
- [ ] Üniversite bölümü seçerken sık yapılan hatalar

**Öğrenme bilimi**
- [ ] Aralıklı tekrar: unutmayı yavaşlatmanın yolu
- [ ] Kendini sınama etkisi: soru çözmek neden işe yarar?
- [ ] Erteleme neden olur, nasıl azalır?
- [ ] İç motivasyon ve dış motivasyon
- [ ] Gelişim zihniyeti: araştırmalar ne gösteriyor?
- [ ] Uyku ve öğrenme: bilgi uykuda nasıl pekişir?
- [ ] Telefon ve dikkat: bildirimler ders çalışmayı nasıl etkiler?

**Beyin ve zihin**
- [ ] Çalışma belleği nedir, neden sınırlıdır?
- [ ] Dikkat nasıl çalışır?
- [ ] Yürütücü işlevler: plan yapma, kendini durdurma, esneklik
- [ ] Ergen beyni neden farklı çalışır?
- [ ] "Beynimizin yüzde 10'unu kullanırız" efsanesi
- [ ] Sağ beyin, sol beyin efsanesi
- [ ] Beyin değişebilir mi? Nöroplastisite

**Psikolojinin kuramları ve tarihi**
- [ ] Freud ve psikanaliz: ne söyledi, bugün ne biliyoruz?
- [ ] Savunma mekanizmaları: gündelik hayattan örnekler
- [ ] Bağlanma kuramı: erken ilişkiler neden önemli?
- [ ] Rorschach ve projektif testler neden internette yapılamaz?
- [ ] Psikoloji nasıl bilim oldu?

**Ölçme bilimi**
- [ ] Güvenirlik ve geçerlik nedir?
- [ ] Norm nedir, sonuçlar neden akranlarla karşılaştırılmaz?
- [ ] Barnum etkisi: "Bu tam beni anlatıyor" hissi neden yanıltır?
- [ ] Test sonucunuzu nasıl okumalısınız?
- [ ] Zekâ testleri neyi ölçer, neyi ölçmez?

Sitede beş yazı kategorisi var (`src/content/rehber/types.ts`): Kişilik, Öğrenme ve ders çalışma, İlgi ve meslek
seçimi, İyi oluş, Testler ve ölçme. "Beyin ve zihin" ile "Psikolojinin kuramları ve tarihi" kümelerinden ilk
yazının sırası gelince en uygun yol seçilir (yeni kategori ya da en yakın kategori), raporda site sahibine
söylenir ve buraya yazılır.

## Site sahibinin bekleyen işleri

Bunları yalnızca site sahibi yapar. Sohbetler bunları yalnızca o anki işle ilgiliyse ya da tarihi yaklaştıysa
hatırlatır; şifre ya da ödeme bilgisi istemez.

- **Nörobilim bölümü ve okuma ölçütleri için ağ erişimi:** sohbetin ortam menüsü → Düzenle → Ağ erişimi; erişimi
  genişletmek ya da openstax.org, ncbi.nlm.nih.gov, ninds.nih.gov, wikipedia.org, dergipark.org.tr,
  turkpsikiyatri.com, eric.ed.gov adreslerini izinli listeye eklemek
  (https://code.claude.com/docs/en/cloud-environments#network-access). 3. basamağa gelince ya da okuma
  ölçütleri kaynaklarla karşılaştırılacağı zaman hatırlatılır.
- **Site sahibi bilgileri** (ad, adres, telefon, e-posta): yasa gereği İletişim sayfasında ve aydınlatma metninde
  gösterilir; her yayında uyarı olarak çıkar. Gelince `yayin/ayarlar.env`'e yazılır (CLAUDE.md).
- **Hostinger sunucusunun yenilenmesi:** 30 Ekim 2026'dan önce.
- **Hukuki işler:** Hostinger ile KVKK standart sözleşmesi ve Kurula bildirim; metinlerin avukat kontrolü;
  e-posta sağlayıcısının aydınlatma metninde anılması; Karakter Güçlü Yanları için avukat görüşü.
- **Hoca buluşması (2026-10-11):** platform bitmiş hâliyle sunulacak; hocanın düzeltme istekleri gelince yapılır.
  İsterse hazır inceleme belgeleri (Hoca incelemesi tablosu) hocaya iletilebilir.
- **Açık soru:** Katalogda Türkçe Konu Tarama Testi "Hazırlanıyor" diye görünüyor, oysa 4. dalgada. İlgili bir iş
  gelince etiketin kalıp kalmayacağı site sahibine sorulur.

## Son yapılanlar

En yeni üstte; en çok 10 madde tutulur.

- 2026-10-09 (17): Mantıksal Akıl Yürütme yayında (5. sınıftan yetişkine): 32 özgün soru; "eğer–ise" kurallarında
  kesin olanla olmayanın ayrılıp ayrılmadığı ve sonucun gerçek hayatta doğru ya da yanlış görünmesinin kararı etkileyip
  etkilemediği ayrı ayrı yorumlanır; her sorunun cevabı bağımsız bir denetleyiciyle doğrulandı; öğrenci, veli ve yetişkin
  raporu, 3B grafikli yol haritası; telefonda dokunarak ve masaüstünde klavyeyle (yetişkin olarak) çözüldü, rapor ve PDF
  açıldı; bağımsız inceleme bulguları (iki tur) düzeltildi.
- 2026-10-09 (16): Site sahibinin kararıyla Beyin Akademisi yalnızca beyni anlatır: iki kafatası dersi yayından
  kaldırıldı (depoda saklı, eski adresler ilk derse yönlenir); kafatası ünitesinin hazırlanmamış dersleri ve kol-bacak
  sinirleri programdan çıktı; program 100 ders. Sıradaki ders "Anatominin dili".
- 2026-10-09 (15): Site sahibinin isteğiyle Beyin Akademisi'nde dil her düzeyde sade olacak (kalıcı kural). İlk ders
  "Sinir sistemine ilk bakış" bu ölçüyle sadeleştirildi: ortalama cümle ~15 sözcükten ~8–9 sözcüğe indi, terimler ilk
  geçtiği yerde Türkçe açıklandı; bilgiler, sayılar ve kaynaklar aynen kaldı.
- 2026-10-09 (14): Çalışma Değerleri yayında (7. sınıftan yetişkine): 32 özgün ifade, sekiz değer; değerler kişinin kendi
  içinde sıralanır, en önemliler anlatılır, birbiriyle yarışabilecek değerler ve sona kalanlar ayrıca belirtilir; öğrenci,
  veli ve yetişkin raporu, 3B grafikli yol haritası; telefonda dokunarak ve masaüstünde klavyeyle (yetişkin olarak)
  çözüldü, rapor ve PDF açıldı; bağımsız inceleme bulguları düzeltildi.
- 2026-10-09 (13): Beyin Akademisi Anatomi 1 "Sinir sistemine ilk bakış" yeni ölçüyle baştan yazıldı: 13 bölüm,
  35 üç boyutlu sahne (yeni: omurga, bel bölgesi, sempatik gövde, kafa sinirlerinin çıkış kapıları), 9 hareketli çizim,
  19 vaka, 82 soru, 234 kaynak (açık tam metinler, Gray 1918, OpenStax, UTHealth, TA2); beş bağımsız denetçinin
  bulguları kaynağa bakılarak düzeltildi. Modele omurga eklendi (C3–L5, sağrı kemiği, diskler).
- 2026-10-09 (12): Zihniyet: Zekâ ve Öğrenme İnançları yayında (5. sınıftan yetişkine): 24 özgün madde, dört alan
  (zekâ, çaba, hata, zorluk); "Birlikte bakınca" inançların örtüşüp örtüşmediğini yorumlar; araştırmaların ne bulduğu
  abartılmadan anlatılır; öğrenci, veli ve yetişkin raporu, 3B grafikli yol haritası; telefonda dokunarak ve masaüstünde
  klavyeyle (yetişkin olarak) çözüldü, rapor ve PDF açıldı; bağımsız inceleme bulguları düzeltildi.
- 2026-10-09 (11): Erteleme ve Zaman Yönetimi yayında (6. sınıftan yetişkine): 25 özgün madde, beş alan; alanları
  birlikte yorumlayan "Birlikte bakınca" bölümü (ertelemenin hangi alışkanlıklarla birlikte görüldüğü); öğrenci, veli ve
  yetişkin raporu, 3B grafikli yol haritası; telefonda dokunarak ve masaüstünde klavyeyle (yetişkin olarak) çözüldü,
  rapor ve PDF açıldı; bağımsız inceleme bulguları düzeltildi.
- 2026-10-09 (10): Ders Çalışma Motivasyonu yayında (5. sınıftan mezuna): 25 özgün madde, beş motivasyon türü; yeni
  "motivasyon haritası" (kendi isteğiyle ve baskıyla çalışma) ve dokuz profilli yorum; öğrenci ve veli raporu, 3B grafikli
  yol haritası; telefonda dokunarak ve masaüstünde klavyeyle çözüldü, rapor ve PDF (öğrenci ve veli) açıldı; bağımsız
  inceleme bulguları düzeltildi.
- 2026-10-09 (9): Site sahibi ilk dersi de yeterince derin bulmadı; sinir sistemi ünitesi kuruldu: "Sinir sistemine
  ilk bakış" ünitenin genel bakışı oldu, dört ders (anatominin dili, omurilik sinirleri, boyun-kol ağı, bel-sakral ağ)
  "Hazırlanıyor" olarak programa eklendi; program 110 ders.
- 2026-10-09 (8): Beyin Akademisi Anatomi 3 "Kafatası 1: Kemikler tek tek" yayında: her kemik ayrı bölümde, üç
  düzeyde; 39 üç boyutlu sahnede kemik tek başına, çıkıntıları, delikleri ve çukurları 131 işaret noktasıyla
  işaretli; 3 yeni hareketli çizim, 20 vaka, 74 soru, 187 kaynak (açık tam metinler, Gray 1918, OpenStax, TA2).
  Sahnelerde etiket yazıları artık noktaların ve birbirinin üstüne binmiyor (bütün derslerde).
