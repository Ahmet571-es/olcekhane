# Ölçekhane: güncel durum

Her sohbet işe başlamadan bu dosyayı okur; iş bitince değişikliği aynı işlemede buraya yazar (CLAUDE.md, "Yeni bir
sohbette: istekten yayına"). Plan, Claude Docs'taki **Ölçekhane Platform Haritası** belgesidir:
https://claude.ai/artifact/PqjqGWA4vWv2HUx2sEAPQa

Son güncelleme: 2026-10-30

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
  inceleyip düzeltme isteyecek. Platformun o güne hazır olması gerekiyor. **2026-10-13 güncellemesi:** buluşma 5–6 gün
  sonraya (2026-10-18 dolayı) kaldı; site sahibi hocanın bütün yeni testleri kontrol edeceğini, "sıfır hata" istediğini
  söyledi.
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
   göre "Kendini Tanı Paketi": birkaç test art arda, tek büyük PDF rapor. **Kendini Tanı Paketi hazır (2026-10-30)**; ayrıntı
   "Son yapılanlar"da ve CLAUDE.md'de.

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
16. **Sayısal Akıl Yürütme: yayında (2026-10-09, pilot; 5. sınıftan yetişkine).** 24 özgün soru, cevap yazılır (tuş
   takımı, "Bilmiyorum" da var), ~20 dakika, 2 nötr alıştırma (`content/instruments/sayisal-akil-yurutme.ts`,
   `components/runner/tasks/numerical-reasoning.tsx`). Üç grup: 8 orantılı durum (4 sayılar birbirinin katı, 4 değil), 8
   orantılı olmayan durum (4 fark korunan, 2 değişmeyen, 2 başta bir miktar olan) ve 8 eşitlik ve denge sorusu (eşittir
   işareti, denkleştirme, terazi). Her sorunun cevabı ve yanılgı cevapları `tests/helpers/numeric-check.ts`'te sorunun
   sayılarından bağımsızca hesaplanır; yanılgı cevapları sorudaki bir sayı, çarpan ya da sayıların toplamıyla karışmaz
   (test denetler). Rapor: fark yanılgısı, orantı yanılgısı (türüne göre), sayılara göre yöntem seçme, eşittir işaretini
   "sonuç" diye okuma, ters denkleştirme, terazi; "Bilmiyorum" (≥12) ve okumadan cevap (hızlı ve çoğu yanlış) uyarıları.
   Kaynaklar Fernández ve ark. (2012), Van Dooren ve ark. (2004), Knuth ve ark. (2006).
17. **Küp Açınımı: yayında (2026-10-09, pilot; 5. sınıftan yetişkine).** 20 özgün soru, 4 düzey (dört kare yan yana
   açınımlarda yakın ve uzak yüzler, basamaklı, zikzak), on bir küp açınımının hepsi; 10 soruda yalnızca yüzlerin yeri, 10
   soruda şekillerin yönü (ok, bayrak, köşe) de önemli; 2 alıştırma (üç yanılgının her biri açıklanır), ~12 dakika
   (`lib/instruments/cube.ts`, `content/instruments/kup-acinimi.ts`, `components/runner/tasks/cube-net.tsx`). Yanlış
   seçenekler küpün bir duruşundan tek değişiklikle üretilir: karşılıklı yüzler yan yana, köşedeki sıra ters, şeklin yönü
   yanlış. `tests/helpers/cube-check.ts` açınımı kâğıt gibi katlayarak her soruyu bağımsızca doğrular; çizimin ayna
   görüntüsü olmadığı, anlatılan kuralların on bir açınımda da doğru olduğu ve kestirme yolların işe yaramadığı denetlenir.
   Rapor: doğru sayısı, ulaşılan düzey, yer ve yön soruları; yanılgı yalnızca seçeneklerdeki sıklığına göre beklenenden sık
   görülünce (olasılık ≤ %5) anlatılır; çok hızlı yanlış (3. düzey ve üstü, 3 sn) ve aynı sıradaki seçenek (en çok 12
   doğruda) uyarıları. Üç boyutlu profil yok (iki tür). Kaynaklar Dahm ve Sachse (2025), Harris ve ark. (2013), Hilton ve
   ark. (2022), Hodgkiss ve ark. (2018), Pawlak-Jakubowska ve Terczyńska (2023), Shepard ve Feng (1972); yol haritasında
   Uttal ve ark. (2013), Wai ve ark. (2009).
18. **Düşünerek Karar Verme: yayında (2026-10-09, pilot; 5. sınıftan yetişkine).** Akıl Yürütme dalgasının dördüncü ve
   son testi (dalga tamamlandı). 24 özgün kısa soru, dört seçenek (Sirota ve Juanchich, 2018'deki biçim), ~15 dakika, 2
   tuzaksız alıştırma (`content/instruments/dusunerek-karar-verme.ts`, `components/runner/tasks/cognitive-reflection.tsx`).
   16 tuzaklı soru (8 sayısal, 8 sözel; ilk akla gelen cevap yanlış) ve bunların 8'inin tuzaksız eşi (De Neys ve ark., 2013;
   tuzaksız soru önce gelen eşlerde öykü farklı). Yönerge ve çözme ekranları tuzaktan söz etmez; test sayfasındaki bilim
   kartı testin mantığını açıkça anlatır (şeffaflık; site sahibi isterse kısaltılabilir). Sayısal soruların cevapları
   `tests/helpers/reflection-check.ts`'te bağımsızca hesaplanır. Rapor: doğru cevaplar (sayısal–sözel), yanlışların türü
   (ilk akla gelen cevap ya da başka yanlış), benzer soru çiftleri (tuzaksızı doğru, tuzaklısında ilk akla gelen cevap),
   çalışma biçimi; tuzaksızların çoğu yanlışsa yorumlanmaz, rastgele seçen biri neredeyse her zaman uyarı alır (test
   denetler), her yerde tuzak aramak ayrıca anlatılır. Kaynaklar Bialek ve Pennycook (2018), De Neys ve ark. (2013),
   Pennycook ve ark. (2016), Sirota ve ark. (2021), Sirota ve Juanchich (2018), Stagnaro ve ark. (2018), Thomson ve
   Oppenheimer (2016), Young ve Shtulman (2020a, 2020b).
19. Pilot veriler gelince (hiçbir şey saklanmadığı için ancak site sahibinin izinli bir denemesiyle): Düşünerek Karar
   Verme'de her tuzaklı soruda ilk akla gelen cevabın gerçekten en sık yanlış olduğu sınanmalı (Young ve Shtulman,
   2020a'daki ölçüt); şimdilik tasarım varsayımıdır ve bilim kartında böyle yazar.
20. Pilot veriler gelince: Kule Görevi'nde 1 dakikalık sürenin 3–4. sınıflar için yetip yetmediği (uzun problemlerde
   hiç top taşınmadan süresi dolanların oranı) ve 2 saniyelik "çabuk başlama" sınırı gözden geçirilmeli; bilim kartında
   küçük yaşta sürenin yetmeyebileceği yazar.

**Yeni kişilik ve zekâ testleri, 2. dalga (site sahibinin 2026-10-13 isteği):** "Türkiye'nin en büyük kişilik ve zekâ test
platformu"; lisans sorunu olmayan testler geniş bir araştırmayla seçildi, **her mesajda bir test** eklenip çözülüyor,
hataları gideriliyor ve yayına alınıyor. Raporlar çok ayrıntılı ve bilimsel ama dili çok sade; tanı, tedavi, ilaç ya da
klinik öneri ve kesin hüküm yok. Her testte iki tur bağımsız inceleme yapılır. Lisans: kişilikte yalnızca IPIP (kamu malı;
https://ipip.ori.org/newPermission.htm "for any purpose, commercial or non-commercial"), zekâda sorular özgün. Site
sahibinin seçtiği sıra (kişilik ve zekâ dönüşümlü; site sahibi "Bismillah, sıradaki test" yazınca bir sonraki):
1. **Kişiliğin 10 Yönü: yayında (2026-10-13, active; 9. sınıftan yetişkine).** BFAS (DeYoung, Quilty ve Peterson,
   2007), 100 madde, beş boyut × iki yön; Nevrotiklik "Duygusal Denge" (Soğukkanlılık ve İç rahatlık; "Sakinlik" adı
   Ayrıntılı Kişilik'te başka anlamda olduğu için kullanılmadı), Intellect "Düşünsel merak" (zekâ ölçmez), Openness "Sanat
   ve hayal gücü". 64 madde öteki testlerin çevirisiyle aynı, 36 madde iki taslakla çevrildi (bağımsız incelemeden sonra
   yedisi düzeltildi). α ve sdRef Tablo 5 üniversite örnekleminden. Rapor: genel bakışta beş boyut, altında yönler;
   "Bir boyutun iki yönü" bölümü (insight artık facets profilinde de var; `fallback` cümlesi yeni); iki yön ayrışınca
   (biri yüksek, öteki düşük) boyut kartında düzey metni yerine "İki yönü ayrışan" metni (yeni `facetSplit`; ayrışan
   boyutun düzey metni destek kutusunu açmaz). Boyut metinleri iki yönün ortalamasını anlatır, yönlerin davranışını
   tek tek saymaz (yön kartıyla çelişmesin; her boyutta 5 × 5 düzey testte). Yeni ortak alanlar: `facetTerms` (raporda ve
   test sayfasında "alt özellik" yerine "yön"), yol haritasında `unit` ("yön", "yönlere"). Yol haritası on yönle: 10
   sütunlu 3B grafik, öneriler en belirgin beş yön için, 2. hafta Çalışkanlık, 3. hafta İç rahatlık düşükse iyi oluş
   (Sınav kaygısı bağlantısı), değilse Soğukkanlılık düşükse o (bağlantısız). Bilim kartında: Türkçe uyarlama ve ergen
   çalışması bulunamadı (Ekim 2026), test-tekrar test 90 kişi, ortalama 38 gün. Telefonda dokunarak (öğrenci) ve
   masaüstünde klavyeyle (yetişkin) çözüldü, öğrenci, veli ve yetişkin PDF'leri açıldı.
2. **Planlama: Kule Görevi: yayında (2026-10-15, pilot; 3. sınıftan yetişkine).** Londra Kulesi düzeni (Shallice,
   1982): çubuklar 3-2-1 top alır, toplar kırmızı/mavi/sarı ve üstünde harfi (K, M, S). 2 alıştırma (süresiz; fazla
   hamlede en az hamleli çözüm gösterilir, yeniden denenebilir) ve 20 özgün problem: 3–7 hamle, her uzunlukta dört; her
   uzunlukta bir kule, bir düz, iki kısmi hedef; tek ve çok yollu problemler; renk değişince aynı ya da ters iki problem
   yok, art arda iki problem ortak diziliş kullanmaz (36 diziliş ve 108 hamle bağımsız aramayla taranır,
   tests/helpers/tower-check.ts). Freiburg sürümündeki gibi en az hamle ekranda, problem başına 1 dakika, asıl sonuç en az
   hamlede çözülenler; ilk hamleden önceki süre taşınan ilk topun alındığı an (alınıp bırakılan sayılmaz), sayfa gizlenince
   süre durur; sunucu hamleleri yeniden oynatarak puanlar. Rapor: en az hamlede çözülenler (uzunluğa göre), kısa (3–4) ve
   uzun (6–7) problemlerin karşılaştırması, çözüm biçimi (fazla hamle, hedefe ulaşılamayan, hiç top taşınmayan), başlamadan
   önce düşünme (tipik süre, kısa–uzun farkı, 5+ hamlede 2 sn'den çabuk başlayıp en az hamlede çözememek, başlamadan önce
   düşünme payı; Schumacher ve ark., 2026). Hiç top taşınmayan problemler: yarısında ve kısa problemlerin de yarısında
   (ya da dörtte üçünde) yorumlanmaz; yalnızca uzun problemlerdeyse "süre yetmemiş olabilir" denir. 5 sütunlu 3B yol
   haritası. İki tur bağımsız inceleme (ilkinde 5 önemli bulgu: boştaki problemlerin yorumu, ilk top süresi, yol
   haritasında iki cümle, ters problem çifti; ikincisinde 3: "yorumlanmadı" kuralı, hızlı başlama ile "plana zaman
   ayırdın" çelişkisi, bir güvenirlik cümlesi) düzeltildi. Telefonda dokunarak (3. sınıf) ve masaüstünde klavyeyle
   (yetişkin, duraklatma dahil) çözüldü, gönderilen veri denetlendi, PDF'ler açıldı.

Site sahibinin 2026-10-15 kararı: IPIP'in Kontrol Odağı maddelerinin çoğu adlarının söylediğini ölçmüyor ("kadere
inanırım" maddesi de dinî açıdan hassas); bu yüzden sıra şöyle değişti: önce Hızlı Kişilik Testi, sonra Kontrol Odağı
(yalnızca içeriği ölçeğiyle örtüşen maddelerle, kader maddeleri olmadan; güvenirliğin düşük olduğu açıkça yazılır), sonra
Düşünmeyi Sevme.
3. **Hızlı Kişilik Testi: yayında (2026-10-15, active; 9. sınıftan yetişkine).** Mini-IPIP (Donnellan ve ark., 2006):
   IPIP'in 50 maddelik Beş Faktör ölçeğinden 20 madde, beş boyut × dört madde, kaynaktaki sırayla (m01–m20); Nevrotiklik
   "Duygusal Denge" olarak ters puanlanır (IPIP'in notu). 17 madde Beş Faktör'ün çevirisiyle aynı; üçü 9. sınıftan
   başlayan testlerin çevirisi ("Küçük şeylere kolayca bozulurum", "Soyut fikirleri anlamakta zorlanırım", "Canlı bir
   hayal gücüm vardır"). α IPIP sayfasından (.65–.77); sdRef Martínez-Molina ve Arias'ın (2018, PeerJ, CC BY) açık
   verisindeki ABD örnekleminden (367 yetişkin) hesaplandı; ölçüm payı ±0,63–0,86. Üç düzey: orta yalnızca toplam 11–13
   (iki yanı simetrik, bir madde boşken de). Rapor metinleri yalnızca dört maddenin sorduğunu anlatır; Merak ve Hayal
   Gücü'nde her düzeyde "zekâyı ölçmez"; destek kutusu Duygusal Denge düşükken. Yol haritası Beş Faktör'ünkü; maddelerin
   sormadığı bir özelliği güç diye söyleyen ya da kartla çelişen 10 metin (Uyumluluk, Sorumluluk orta, Duygusal Denge,
   Merak düşük) ve 5 veli önerisi bu testte değiştirildi. Bilim kartında: ergenlerde güvenirlik ve geçerlik çalışması ve
   Türkçe uyarlama bulunamadı (Ekim 2026); model uyumu ve gruplar arası karşılaştırma sınırları. İki tur bağımsız inceleme
   (ilkinde ergen çalışması cümlesi, çeviri kuralı, yol haritasındaki çelişkiler; ikincisinde bir bilim kartı cümlesi,
   üç yol haritası metni ve bir ortam) düzeltildi. Telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin)
   çözüldü, öğrenci, veli ve yetişkin PDF'leri açıldı.
4. **Kontrol Odağı: yayımlanmayacak (site sahibinin 2026-10-16 kararı).** Güvenirliği düşük bir testin bilimsel temelden
   uzaklaştıracağı ve bir fayda getirmeyeceği için yapılmadı; "deneme" uyarısıyla yayımlama seçeneği de seçilmedi. Az maddeyle (IPIP; yalnızca içeriği örtüşen maddeler:
   başarının yetenek ve çabaya bağlı olduğu, olayları kendinin belirlediği, güçlü birkaç kişinin dünyayı yönettiği,
   şanssızlık ve şanslı doğma; "kadere inanırım" ve "kaderime razıyım" yok). IPIP'in açık verisinde (ESCS, aşağıda)
   hesaplandı: içeriği örtüşen maddelerin iç tutarlılığı α ≈ .50 (kişiye rapor verecek bir ölçek için düşük). Öneri:
   yayımlanmasın (ya da "deneme" diye uyarıyla). Site sahibi yayımlamamayı seçti.
   Maddeler: https://ipip.ori.org/newSingleConstructsKey.htm.
5. **Düşünmeyi Sevme Ölçeği: yayında (2026-10-15, active; 9. sınıftan yetişkine).** IPIP Need for Cognition, 10 madde;
   çeviriler ve uygulama sırası Öğrenme ve Başarı Özellikleri'ndeki "Düşünmekten hoşlanma" ölçeğiyle birebir aynı, düzey
   eşikleri de (aynı cevaplar iki testte aynı düzeyi verir; açıklamada ve bilim kartında yazılı; o test bir sonraki test
   olarak önerilmez). α .84 ve sdRef 0,70 açık veriden hesaplandı (ESCS, 570 yetişkin; IPIP'in .84'ünü tutturdu); ölçüm
   payıyla cetvel. Rapor: "Sonuç" altında önce düzey kartı, sonra "Bilmekte yarar var" (zekâ ile ilişki küçük–orta,
   başarıyla küçük, ergenlikte görece kararlı; Liu ve Nesbit 2024, Schweitzer ve ark. 2025, Lavrijsen ve ark. 2024).
   Düşük ve orta düzeyde kavrama hakkındaki dört cümleye değinilmez; her düzeyde "zekâyı ölçmez". Yol haritası tek
   ölçekli: "Kafa yoran küçük bir deneme" ve "Birlikte düşünmek" haftaları; sonraki test Zihniyet. Tek ölçekli testlerin
   tanıtım sayfasında "Raporda neler var" satırları tek ölçeğe göre yazılır (Öz-saygı da). Öğrenme ve Başarı
   Özellikleri'nin düşük düzey metninde "soyut konular" yerine maddenin sorduğu "felsefi tartışmalar" yazıldı. İki tur
   bağımsız inceleme düzeltildi; telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
   **IPIP testleri için açık veri:** Eugene-Springfield Topluluk Örneklemi (ESCS; Goldberg, 2018, Harvard Dataverse
   doi:10.7910/DVN/UF52WY, `.por` dosyası; teknik rapor ipip.ori.org/ESCS_TechnicalReport_January2016.pdf). IPIP
   maddelerinin çoğu bu veride var; yeni bir IPIP ölçeğinin α ve sdRef değeri buradan, maddeler metinle eşlenerek
   ve ters maddeler çevrilerek hesaplanır (sonuç IPIP sayfasındaki α ile karşılaştırılır).
6. **Üç Boyutlu Zihinde Döndürme: yayında (2026-10-15, pilot; 5. sınıftan yetişkine).** Shepard–Metzler ve Vandenberg–Kuse
   düzeni: her soruda küplerden bir şekil ve dört seçenek (iki döndürülmüş, iki ayna); iki doğru birlikte bulunursa soru doğru.
   20 soru, iki bölüm (1. bölüm yalnızca dik eksen, 2. bölüm ayrıca resim düzleminde 40–140° yan yatırma), 2 alıştırma
   (çözüm canlandırması iki tur oynar, durdurulabilir). On özgün şekil (dört kol, üç dik kıvrım, 9–10 küp; hepsi ayna
   simetrisiz ve döndürme simetrisiz, dördünün uç kolları eşit). Çizim kütüphanesiz SVG, gölgeli ve hafif perspektifli
   (`lib/instruments/rotation3d.ts`); tarayıcıya cevap anahtarı gitmez, küpler ızgara döndürmesiyle yeniden yazılır ve
   karışık sırayla gider. Ayna görüntüsü dik bir düzleme göre yansıtılır (`mirrorAxisFor`; baş aşağı ayna 1. bölümde bir
   bakışta elenirdi). Sorular bir üreticiyle seçildi (scratchpad'de, depoda değil) ve `tests/uc-boyutlu-zihinde-dondurme.test.ts`
   bağımsız denetleyiciyle (`tests/helpers/rotation3d-check.ts`) doğrular: cevaplar çizim verisinden yeniden bulunur; her
   küp en az ~1/4 görünür (en çok biri 1/3'ün altında), uç küpler yarıya yakın, kollar kameraya doğru kısalmaz, bağlı
   olmayan kollar binmez, üç yüz yönü görünür; seçenekler arası duruş farkı (aynı tür ≥40°, karşı tür ≥25°/2. bölümde ≥35°);
   hiçbir çizim hedefin ya da başka seçeneğin düz resim gibi döndürülmüş/çevrilmiş hâli değil (`pictureResidual` ≥25°);
   1. bölümde zincir boyunca yükseklikler aynı; siluet kestirmeleri ve yer dengesi şans düzeyinde. Rapor: doğru cevaplar,
   iki bölüm, ayna görüntüleri (bir doğru bir ayna / iki ayna; sık iki ayna: derinlik ters görülmüş olabilir, doğrular
   azsa yönerge ters anlaşılmış olabilir; çok hızlı ya da hep aynı çiftte yorum yapılmaz), çalışma biçimi; bütün durum
   birleşimleri testte. Kaynaklar Caissie ve ark. (2009), Frick ve Pichelmann (2023), Ganis ve Kievit (2015), Gilligan ve
   ark. (2020), Jansen ve ark. (2019), Jost ve Jansen (2024), Peters ve ark. (1995), Rajeb ve ark. (2025), Shepard ve
   Metzler (1971), Timm ve ark. (2024), Uttal ve ark. (2013), Vandenberg ve Kuse (1978). Üç tur bağımsız inceleme
   düzeltildi; telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
7. **Çalışma Belleği: Hesapla ve Hatırla: yayında (2026-10-16, pilot; 5. sınıftan yetişkine).** Karmaşık bellek aralığı,
   işlem aralığı düzeni (Unsworth ve ark., 2005; aktaran Đokić ve ark., 2018): her harften önce "(a × b) ± c = sonuç"
   doğru mu yanlış mı (DOĞRU/YANLIŞ ya da D/Y), dizinin sonunda harfler sırayla seçilir (12 ünsüz, BOŞ, SİL, TAMAM; bir
   harf ikinci kez seçilemez). 10 dizi (3–7 harf, her uzunluktan iki, karışık sırada), 50 harf, 50 işlem; üç alıştırma
   (harfler, 15 işlem, ikisi birlikte). İşlem süresi kişiye göre: işlem alıştırmasındaki sürelerin ortalaması + 2,5
   standart sapma, 3–15 sn (alıştırmada söylenmez); süre dolarsa işlem cevapsız sayılır. Sayfa gizlenince duraklar,
   duraklatmada basılan tuş sayılmaz, dizi baştan gösterilir. Puan kısmi puandır (doğru yerdeki her harf); hata türleri
   (yeri karışan, dizide olmayan, boş). İşlemler bir üreticiyle seçildi (scratchpad'de): yarısı doğru, yanlışlar ±1/±2 ve
   çarpıma göre doğru sonuçla aynı tarafta; tek-çift, 5'e bölünme, işaret, büyüklük gibi ipuçlarıyla basan biri en çok 31/50
   bulur (`tests/hesapla-ve-hatirla.test.ts`). Rapor: hatırlanan harfler, dizi uzunluğu, işlemler, hata türleri; harfler
   rastgele düzeyindeyse (≤8) ya da işlemler rastgele basma düzeyindeyse (≤31) yorum yapılmaz, işlemlerin beşte biri
   yarım saniyeden kısaysa dikkatle yorumlanır, %85 altı işlem doğruluğunda kartta not; bütün durum birleşimleri testte.
   Kaynaklar Đokić ve ark. (2018), Ferguson ve ark. (2021), Fu ve ark. (2026), Hischa ve ark. (2025), Lee ve Engle (2026),
   Melby-Lervåg ve Hulme (2013), Monteiro ve ark. (2025), Redick ve Lindsey (2013), Ruiz ve ark. (2019), Schmiedek ve ark.
   (2014), Unsworth ve ark. (2005). İki tur bağımsız inceleme (bilgi doğrulama, kod ve rapor) ve ikinci tur düzeltildi;
   telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, duraklatma denendi, PDF'ler açıldı.
8. **Düşünme ve Çalışma Tarzı: yayında (2026-10-16, active; 9. sınıftan yetişkine).** IPIP'in JPI-R'ye benzeyen 15 ön
   ölçeğinden beşi, her birinin 10 maddesinin hepsi (50 madde): Soyut ve felsefi konulara ilgi (Complexity), Yenilikçilik
   (Ingenuity), Başkalarının görüşüne önem verme (Conformity), Enerji ve tempo (Activity-Level), Düzen ve plan
   (Organization). Alınmayanlar: Gelenekçilik (din, siyaset), Hoşgörü (ırk, cezalandırma görüşü), Sorumluluk (vergi,
   hile), Makyavelcilik; Düşünsel genişlik (bir maddesi siyaset; siyasi madde çıkınca da Complexity ile r = .74);
   duygusal ve sosyal ölçekler. Ölçek adları beceri değil ilgi ya da eğilim söyler ("soyut düşünme" denmez). 34 madde
   sitedeki 9. sınıf çevirisiyle aynı, 16 madde üç bağımsız taslaktan seçildi. α ve sdRef ESCS'den (570–623 yetişkin;
   IPIP'in sayfadaki α'larını tutturdu); ölçüm payında düşük olan α. Bilim kartında JPI-R ile ilişki (.59–.74), Beş
   Faktör boyutlarıyla ilişki (düzen–sorumluluk .90; ortak maddeler yazılı) ve ABD verisinde "yüksek" düzeyin yaygınlığı
   (%69–75). Madde sırası: benzer ve ters maddeler aynı ölçekte en az 20 madde arayla; beş ters çift (açık veride yanlış
   uyarı %0,9). Rapor kartları yalnızca kendi maddelerinin sorduğunu anlatır ve yan yana çelişmez (ör. enerji kartı "işe
   başlamayı", düzen kartı "boşa geçen zamanı" anlatmaz); 3⁵ düzey birleşiminin hepsi ve rapor, öneri, deneme ve veli
   önerileri arasında ortak söz öbekleri testte denetlenir. Yol haritası: 5 sütunlu 3B profil, ortamlar yok, 2. hafta
   Çalışma düzeni. İki tur bağımsız inceleme (bilgi ve veri doğrulama; kod ve metin) ve ikinci tur denetim düzeltildi;
   telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
9. **Bakış Açısı Alma: yayında (2026-10-16, pilot; 7. sınıftan yetişkine).** Hegarty ve Waller'in (2004) kullandığı
   uzamsal yönelim testinin düzeni, Friedman ve ark.'nın (2020) bilgisayar sürümündeki değişikliklerle (önü arkası olmayan
   nesneler, orta noktalar, geri bildirimli üç alıştırma); yedi nesneli özgün harita, 12 özgün soru, süre sınırı yok. Puan
   ortalama açı hatası (cevapsız 90°). Sorular üreticiyle seçildi ve testte bağımsız hesapla (iç ve dış çarpım) denetlenir:
   dönüş grupları 2/4/3/3 (6 küçük, 6 büyük; sınırlara en az 5°), doğru yönler 3/3/3/3 dörtte birlik bölgede, |doğru yön|
   30–150°, çizgilere en az 9 birim; haritaya göre yön ve sağ-sol karışıklığı doğru yönden ve birbirinden en az 45°
   uzak. Rapor: yön gösterme isabeti, küçük ve büyük dönüşler, hata türleri (haritaya yukarıdan bakar gibi ≥4/10, sağ-sol
   karışıklığı ≥4/12), çalışma biçimi; ortalama hata 65°'nin üstündeyse (12 soruda rastgele olasılığı %4,8) yalnızca
   yüksek hatayı açıklayan bir tür varsa o anlatılır; çok hızlı yanlışlar ve hep aynı yön ayrıca. Bütün durum birleşimleri
   testte. Yol haritası (3B grafik yok): kendini oraya koy, haritayı yoluna çevir, kimin sağı, yön oyunları. Çözme
   ekranında harita ve cevap çemberi (dokunma, sürükleme, ← → tuşları). İki tur bağımsız inceleme (bilgi doğrulama; kod,
   geometri ve rapor) ve ikinci tur denetim düzeltildi; telefonda dokunarak ve sürükleyerek (öğrenci), masaüstünde
   klavyeyle (yetişkin) çözüldü, PDF'ler açıldı. Türkiye'de bu testin uyarlaması bulunamadı.
10. **Heyecan Arayışı: yayında (2026-10-21, active; 9. sınıftan yetişkine).** IPIP'in Hoyle ve ark.'na (2002) atıfla
   verdiği üç heyecan arayışı ölçeği: Tehlikeli heyecanlara ilgi (Dangerous), Anlık heyecan arayışı (Impulsive), Göze alma
   ve keşif (Calculated; maddeleri plan değil göze alma ve keşif sorduğu için bu ad). 30 maddeden 29'u: deprem/hortum
   maddesi Türkiye'deki deprem acıları düşünülerek çıkarıldı (dokuz maddeyle beklenen α ≈ .86); "hang gliding" yerine
   yamaç paraşütü. 14 madde sitedeki çevirilerle aynı (dokuzu Altı Boyutlu'da), 15'i iki taslaktan. **ESCS açık verisine
   (Harvard Dataverse) bu oturumda ağ izni olmadığı için ulaşılamadı:** sdRef yok, raporda ölçüm payı yok (veriye
   ulaşılınca eklenebilir). Toplam puan ve karşıt çift uyarısı yok (anlık ölçeğin 10 maddesi aynı yönde; bilim kartında).
   Rapor: "Birlikte bakınca" girişi araştırma özeti (tanım, yaşla değişim, dürtüsellikten farkı, olumlu riskler, arkadaş
   etkisi; yetişkine arkadaş etkisi gençlerle sınırlı anlatılır), altı birleşim kuralı; düşük ve orta metinler "risk"
   demez (iki ölçekte risk maddesi var); yüksek tehlike ilgisi yaş sınırı ve eğitmen gözetimiyle anlatılır. Yol haritası 3
   sütun, ortamlar var, 2. hafta "Plan ve anlık kararlar"; tehlikeli etkinlik adı geçmez, keşif önerileri herkese açık
   güvenli yerlerle sınırlı (test denetler). Kaynaklar: Zuckerman (1994), Steinberg ve ark. (2008, 2018), Maples-Keller ve
   ark. (2016), Woodman ve ark. (2013), Duell ve Steinberg (2020), Gardner ve Steinberg (2005); Türkçe uyarlamalar Çelik
   (2015, BSSS-4) ve Yıldırım ve ark. (2021). İki tur bağımsız inceleme (bilgi ve kaynak; metin, çelişki ve güvenlik) ve
   ikinci tur denetim düzeltildi; telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
   Not: `src/content/instruments/gorsel-algi-hizi.ts` (2026-10-13, başka bir sohbetten; yalnızca tanım dosyası) kayıtlı
   değil, sitede yok; site sahibi isterse tamamlanır.
11. **Gizli Şekiller: yayında (2026-10-21, pilot; 3. sınıftan yetişkine).** Gottschaldt'ın (1926) ve Witkin'in (1950)
   gömülü şekiller düzeni; ticari testlerin (EFT, GEFT, CEFT, ETS) hiçbir çizimi kullanılmadı, 20 soru ve 2 alıştırma
   özgün. Her soruda üstte basit bir şekil, altta dört çizim; şekil yalnızca birinde aynı büyüklük ve yönde saklı.
   Yanlış seçeneklerde döndürülmüş/ters çevrilmiş biçim (30) ya da bir köşesi farklı benzer (30); cevaplar A–D beşer,
   art arda aynı harf yok. Düzeyler (4×5) şeklin kenarlarının çizimdeki çizgilerle aynı doğrultuda devam etmesine göre
   (de-Wit ve ark., 2017'nin en önemli etkenlerden biri dediği), değen çizgilere ve çizgi yoğunluğuna göre zorlaşır.
   Çizimler üreticiyle (`/tmp`, depo dışında) seçildi; testte kütüphaneyi kullanmayan bağımsız bir geometrik
   denetleyiciyle (orta nokta ve doğrultu) her sorunun tek cevabı, tuzak türleri (köşesi farklı seçenekte aynı boyda bir
   köşesi kaydırılmış benzer var; döndürülmüş seçenekte hiçbiri yok), iki kat büyütme ve tek kenar eksik benzerlerin
   yokluğu, hiçbir hedefin başka bir hedefin (ve yönerge örneğinin) bir köşesi farklı benzeri olmaması, asıl soruların
   hedeflerinin birbirinden, alıştırmalardan ve örnekten her yönde en az 4 birim parça farklı olması, yanlış seçeneklerde
   sonraki soruların hedeflerinin bulunmaması, 1. düzeyde tek adım eksik benzer olmaması, düzeylerin giderek zorlaşması
   ve kısa yol kuralları (en çok 8 doğru) denetlenir; soru izi `SORU_IZI`. İncelemelerden sonra gs01, gs02, gs05, gs11 ve
   gs19 yeniden üretildi (gs17/gs19 ve gs02/gs13 hedefleri bir köşe farklıydı, gs01/gs05 ve gsp2/gs11 çok benzerdi; 1.
   düzeyde köşesi farklı benzerler çok yakındı); cevap harfleri ve tuzak türleri aynı kaldı. Puanlama küp açınımı gibi
   (düzey ölçütü %60, şans sınırı 8, 3. düzey ve üstünde 3 sn'den kısa yanlışlar, hep aynı harf); yanlışlarda seçilen
   tuzak türü yalnızca en az 3 yanlışta ve şanstan anlamlı biçimde fazlaysa öne çıkar. Rapor: doğru cevaplar, ulaşılan
   düzey, yanlışlarda seçilen şekiller, çalışma biçimi; düzey grafiği; bütün durum birleşimleri testte. Yol haritası (3B
   yok): parçadan başla, yönü ve köşeleri denetle, uzun çizgilerin içine bak; haftalar Gizli nesneler / Kendi gizli
   şeklini çiz / Parçalardan bütüne. Türkiye: GEFT'in Türkçe biçimiyle Çakan (2003a, 2003b); norm yok. İki tur bağımsız
   inceleme (bilgi ve kaynak; sorular, rapor ve ekran) ve ikinci tur denetim düzeltildi; telefonda dokunarak (öğrenci) ve
   masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı. Ekran: 1024 px altında seçenekler iki sütun, üstünde dört
   sütun (aranan şekil ve çizimler aynı ölçekte; 1366×768'de "Cevabı ver" ekranda); odak seçeneklere yalnızca klavyeyle
   ilerleyende taşınır.
12. **İyimserlik Ölçeği: yayında (2026-10-21, active; 9. sınıftan yetişkine).** IPIP'in LOT-R'ye (Scheier, Carver ve Bridges,
   1994) karşılık gelen 10 maddesinin hepsi (α .86; LOT-R ile .69, düzeltilmiş .82; ESCS yetişkinleri). IPIP ölçekleri
   ölçütle en çok ilişkili maddeler seçilerek kurulduğu için beş madde hayata ve geleceğe bakışı, iki madde kendine bakışı,
   üç madde ruh hâlini sorar; beşi IPIP-NEO depresyon alt ölçeğinde de var. Asıl puan on maddenin ortalaması (bileşik ölçek
   `iyimserlik`); raporda ayrıca üç konunun ortalaması ayrı satırlarda (`gelecek`, `kendine_bakis`, `ruh_hali`; ayrı ölçek
   değil, ölçüm payı yok, metinler "… cümleye verdiğin cevaplar" diye başlar; toplam kartı konular hakkında hüküm vermez).
   Ölçüm payı yok (ESCS açık verisine bu oturumdan ulaşılamadı; IPIP sürümünün ortalaması yayımlanmamış). Beş çeviri öteki
   testlerle aynı, beşi yeni. Sıra olumlu başlar ve biter (artı maddeler 1., 4., 7., 10.). Destek kutusu dört satırdan biri
   düşükken **ve** "Sık sık kendimi hüzünlü hissederim" ya da "Kendimden hoşlanmam" cümlesine 4–5 denince (yeni ortak alanlar:
   ölçekte `supportItems`, rapor şablonunda `itemSupport`: kutunun ilk satırı nedenini söyler). Kendine bakış ya da ruh hâli
   cevapları iki uca ayrışır ve ortalama düşük değilse kartta "Farklı cevaplar" (yeni ortak alan `itemSplit`;
   `likertItemFlags`); yol haritası bu konularda sırasıyla düşük ve orta düzeyin önerilerini verir (`ReportSection.flagged`,
   `split`). Bütün cümlelere aynı uç cevapta kalite notu (yeni ortak alan `sameAnswerCheck`). "Bilmekte yarar var":
   tanım, içeriğin neden ruh hâli ve kendine bakışı da sorduğu (ilişkili ama ayrı), başa çıkma (Solberg Nes ve Segerstrom,
   2006), görece kalıcı ama değişebilir (Malouff ve Schutte, 2017); altı birleşim kuralı (toplam düşük değilken ruh hâli ya
   da kendine bakış düşük; karamsarlık daha çok gelecekte; gelecek umutlu ama ruh hâli düşük; toplam yüksek ama gelecek daha
   az umutlu; toplam düşük ama gelecek o kadar karamsar değil). Yol haritası üç konuyla: 3 sütun, ortamlar yok, 1. hafta
   veliye raporu birlikte okuma, 2. hafta "En iyi olası gelecek" (BPS; söz vermez), 3. hafta ruh hâli düşükse ona (iki hafta
   ya da daha uzun süredir çoğu zaman keyifsizlikte biriyle konuşma ve doktor; MedlinePlus), değilse kendine bakış düşükse
   ona ("Öz-saygı nedir?" bağlantısı). Yeni ortak alan: yol haritasında `balancedNote` (dengeli profil cümlesi). Test
   sayfasında tek bileşik ölçekli testin "Raporda neler var" satırları. İki tur bağımsız inceleme (bilgi ve kaynak; çeviri,
   metin, mantık ve ekran) ve ikinci tur denetim düzeltildi; 400 rastgele karışık cevap örüntüsü testte denenir; telefonda
   dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
13. **Desen Hatırlama: yayında (2026-10-21, pilot; 3. sınıftan yetişkine).** Della Sala ve ark.'nın (1999) Görsel
   Desenler Testi düzeni (ticari testin desenleri, puan düzeltmeleri ve normları kullanılmadı): kareli bir tabloda dolu
   kareler 3 sn gösterilir, boş tabloda aynı kareler işaretlenir; 3'ten 15 dolu kareye 13 büyüklük, her birinde 3 özgün
   desen (39) ve 2 alıştırma (geri bildirimli). Bir büyüklükteki üç desenin hiçbiri tam doğru değilse test biter (sunucu
   da denetler); puan tam doğru hatırlanan en büyük desen ("En büyük doğru desen"). Desenler üreticiyle (depo dışında)
   kolay ad verilebilecek biçimlerden kaçınılarak seçildi (Brown ve ark., 2006): dolu ya da boş satır/sütun yok, simetri
   yok, kısa düz diziler, parça sayısı sınırlı, aynı büyüklükteki desenler döndürülse de birbirinden farklı; testte
   bağımsız denetleyici (`tests/helpers/pattern-check.ts`) bunları yeniden hesaplar; desen izi `DESEN_IZI`. Rapor: en
   büyük doğru desen (tavanda "testin en büyük deseni", sınırın bilinmediği söylenir), doğru hatırlanan desenler (ilk
   yanlışın yeri; yanlış desenlerde karelerin çoğu doğruysa kısmi hatırlama), hata türleri (tek kare farkı, eksik, fazla,
   yer karışıklığı; 7 ve daha büyük desenlerde bir karenin doğru yerinin hemen yanına kayması), çalışma biçimi (tipik
   süre, "Hatırlamıyorum", bakmadan işaretleme: yanlış, karelerin çoğu yanlış ve 0,8 sn + kare başına 0,2 sn'den kısa;
   desen gösterilirken başka uygulamaya geçilince desen yeniden gösterilir, iki ya da daha çok kez olunca not); büyüklüğe
   göre grafik; öne çıkan sayılarda karelerde isabet (desende olmayan işaretli kareler düşülür). Bütün durum
   birleşimleri testte. Yol haritası (3B yok): görüntüye ad ver, bölümlere ayırarak bak, kâğıda aktar, görsel bellek
   oyunları; haftalar Bak ve çiz / Ad ver / Eşini bul; oyunların yeniden çözümde sonucu yükseltebileceği söylenir.
   Türkiye'de yayımlanmış bir çalışma bulunamadı; norm yok. İki tur bağımsız inceleme (bilgi ve kaynak; desenler, rapor
   ve ekran) ve ikinci tur denetim düzeltildi; telefonda dokunarak (öğrenci), 320 px telefonda (15 kareli desen sığıyor)
   ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
14. **Harf Dizileri: yayında (2026-10-21, pilot; 3. sınıftan yetişkine).** Thurstone'un harf dizileri ve Simon ile
   Kotovsky'nin (1963) dizi tamamlama düzeni; 24 özgün dizi ve 2 alıştırma, Türk alfabesinin 29 harfiyle (Ç, Ğ, I, İ, Ö,
   Ş, Ü dahil); 5 düzey (4, 5, 5, 5, 5), ~10 dakika. Cevap, alfabe sırasıyla dizilmiş 29 harf tuşundan seçilir (telefonda
   6, geniş ekranda 10 sütun; klavyede "i" → İ, "ı" → I), "Bilmiyorum" denebilir. Beş kural türü: sabit adım (6),
   tekrar eden harfler (4), iç içe diziler (4), harf grupları (6), değişen adım (4). Sayı Dizileri'nin yapısı ve eşikleri
   (`letter_series`, `scoreLetterSeries`, `letterSeriesBlocks`, `components/runner/tasks/letter-series.tsx`): doğru
   cevaplar, ulaşılan düzey (%60), kural türleri (3B grafik), çalışma biçimi; yanlışların çoğu "daha basit kural"
   tuzağıysa ya da alfabede doğru cevabın hemen yanındaki harfse söylenir; çok hızlı yanlışlar, hep aynı harf ve
   çoğunda "Bilmiyorum" uyarı olur. Her sorunun tek cevabı bağımsız çözücüyle denetlenir (`tests/helpers/letter-solver.ts`:
   eksik yere 29 harf konur; 1–6 periyotlu sabit adımlı sınıflar ve ikinci derece kurallar, yalnızca sınanabilen
   kurallar); doğru cevaplar birbirinden farklı; sabit adım dışındaki sorularda "son harfin sıradakini yazmak" doğru
   cevabı vermez; tuzaklar beş basit kuraldan biriyle bulunur; soru izi `SORU_IZI`. Cevap anahtarı ve tuzaklar tarayıcıya
   gitmez (yayın denetimi de bakar). Yol haritası: adımları yaz, kuralı bütün dizide dene, gruplara ve iki diziye ayır,
   alfabede rahat ol; haftalar Adımları yaz / Kendi dizini yap / Kontrol et. Türkiye'de yayımlanmış çalışma bulunamadı;
   norm yok. İki tur bağımsız inceleme (bilgi ve kaynak; diziler, rapor ve ekran) ve ikinci tur denetim düzeltildi;
   telefonda dokunarak (öğrenci), 320 px telefonda ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
   İnceleme notu: hd12 (3. düzey) ve hd18 (4. düzey) düzeylerine göre kolay görünebilir; düzey sırası pilot verisi
   geldikçe gözden geçirilir. Klavyede noktasız I için Shift gerekir (İngilizce klavyede "i" İ olur); cevap satırı ve
   ekran okuyucu "I (noktasız)" / "İ (noktalı)" der.
   **2. dalganın sırası bu testle bitti.**

**Yeni kişilik ve zekâ testleri, 3. liste (2026-10-22):** 2. dalga bitince site sahibi "Bismillah ile devam edelim" dedi;
sıradaki iş sorulduğunda tercih belirtmedi, Claude önerdiği 12 testlik listeyle sürdürdü. İlkeler 2. dalgayla aynı:
kişilikte yalnızca IPIP (VIA ölçekleri kullanılmaz), zekâda özgün sorular, kişilik ve zekâ dönüşümlü, her mesajda bir test,
iki tur bağımsız inceleme, telefonda ve masaüstünde çözme. Site sahibi başka bir sıra isterse o uygulanır.
1. **Empati: yayında (2026-10-22, active; 9. sınıftan yetişkine).** IPIP'in üç ölçeği: AB5C Understanding →
   "Başkalarını düşünme" ("Anlayışlı olma" adı "çabuk anlayan, zeki" diye de okunabildiği için kullanılmadı), JPI-R Empathy →
   "Duygusal duyarlılık", AB5C Warmth → "Sıcaklık ve destek". Kaynaktaki 31 maddeden iki ölçekte birden olan ikisi bir kez
   sorulur (29 madde, ~5 dakika); 19 madde öteki testlerin çevirisiyle aynı, 10 madde iki taslakla (biri öbürü görülmeden)
   çevrildi ("spiritually" → "aramda derin bir bağ"). HPI ve TCI empati ölçekleri (sinirlilik; ters madde yok), Sympathy
   ölçekleri (görüş içeren maddeler) ve VIA kullanılmadı. Beş karşıt çift (biri iki ölçek arasında: zaman ayırırım /
   ayırmam) evet deme eğilimini yakalar. Rapor: "Birlikte bakınca" girişi (iki yön, testin yönlerinin bunlarla birebir
   örtüşmediği, gençlerde başkasının gözünden bakabilmenin artışı, yardım etmeyle ilişki, öz değerlendirmenin doğru anlama
   becerisiyle çok zayıf ilişkisi, eğitimle gelişme) ve dokuz birleşim kuralı (bir yön yüksek öteki düşükken her zaman bir
   kural; üçü yüksekken başarı, üçü düşükken eksiklik gibi anlatılmaz). Yol haritası: 3 sütun, ortamlar, 2. hafta "Dinle ve
   anla" (yardım etmeden önce ne gerektiğini sormak, duyduğunu kendi cümleleriyle söyleyip doğru anlayıp anlamadığını
   sormak), son hafta Kişiliğin 10 Yönü ve Duygusal Zekâ Bileşenleri. Bilim kartında: öz bildirim doğru anlamayı ölçmez
   (Murphy ve Lilienfeld, 2019), örtüşme sayıları, sitedeki Bakış Açısı Alma testinden farkı, Türkçe uyarlamalar (Engeler
   ve Yargıç, 2007; Topçu ve ark., 2010; Totan ve ark., 2012; bu testin maddeleri onların değil). Bütün 27 düzey birleşimi
   öğrenci, veli ve yetişkin için testte. İki tur bağımsız inceleme (çeviri, metin ve mantık; kaynak ve bilgi denetimi) ve
   ikinci tur denetim düzeltildi; telefonda dokunarak (öğrenci) ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı.
2. **Zihinden Hesaplama Hızı: yayında (2026-10-22, pilot; 4. sınıftan yetişkine).** Aritmetik akıcılık: toplama, çıkarma,
   çarpma ve bölme için 60'ar saniyelik dört bölüm (dört görev, `mental_arithmetic`); her bölümde altı düzey × 8 özgün işlem
   (temel işlemler: tek basamaklı toplama, 20'ye kadar çıkarma, çarpım tablosu ve ona dayanan bölmeler; sonra iki basamaklı
   eldesiz ve eldeli, bozmasız ve bozmalı işlemler; bölmeler kalansız). Yanlış türleri ayırt edilebilsin diye eldeli ve
   bozmalı işlemlerde 5 yok, bölmenin 4.–5. düzeyi çarpmaların tersi değil (test denetler). İşlemler tek tek gösterilir,
   sonuç tuş takımıyla ya da klavyeyle yazılır, "Geç" denebilir; her bölümden önce geri bildirimli iki alıştırma; sayfa
   gizlenince süre durur (işlemin duraklatmadan önceki süresi korunur); süre dolunca "Süre doldu; bu bölüm bitti". Rapor:
   dört işlemde doğru işlemler (çubuk), her işlemde düzeylere göre doğrular (kareler; geçilenler sayıyla), doğruluk ve
   yanlışların türü (elde ya da onluk bozma, başka işlemin sonucu, çarpım tablosunda başka bir sonuç, bölümün bir-iki eksik
   ya da fazlası, bir fazla ya da eksik, rakamların yeri), temel işlemlerde doğru cevap başına tipik süre (yarım saniyeden
   kısa süreler katılmaz); çok az cevaplı ya da cevapları işleme bakmadan hızla yazılmış bölüm yorumlanmaz; geçilen işlemler
   ilerleme ya da tavan sayılmaz. Türkiye normu yok. Bilim kartı: Tempo-Test-Rekenen düzeni (Lafay ve ark., 2015; Vanbinst
   ve ark., 2019), bilgisayarlı akıcılık testi (Gliksman ve ark., 2022), Türkiye'de akıcılık ile sözel problem (Sarı ve ark.,
   2014), problem büyüklüğü etkisi (Prado ve ark., 2013), çarpım tablosundaki yanlışlar (Soltanlou ve ark., 2015), süre
   baskısı ve kaygı (Caviola ve ark., 2017). Yol haritası: önce doğruluk, bildiğinden türetmek, kısa ve sık çalışma
   (Fuchs ve ark., 2021; Gersten ve ark., 2009), basamak basamak düşünmek; matematik kaygısı (Sorvo ve ark., 2017), süreli
   testlerin olası olumsuz etkisi (Kling ve Bay-Williams, 2014). İki bağımsız inceleme (kaynak; rapor, puanlama ve ekran)
   düzeltildi; telefonda dokunarak ve masaüstünde klavyeyle baştan sona çözüldü, PDF açıldı. Açık not: çarpmanın 4. düzeyi
   (eldesiz iki basamaklı × tek basamaklı) bazı çocuklar için 3. düzeyden (6–9 tabloları) kolay olabilir.
3. **Öz-yeterlik: Kendine Güven: yayında (2026-10-23, active; 9. sınıftan yetişkine).** IPIP'in üç ön ölçeği, 29 madde
   (~5 dakika): NEO "Self-Efficacy" (C1) → "İşlerde kendine güven"; JPI-R "Social Confidence" → "İnsanlar arasında kendine
   güven"; TCI "Low Self-Efficacy" (HA4, ters çevrilerek; IPIP'in dizininde "Self-efficacy: TCI: HA4-reflected") → "Zor
   anlarda kendine güven". CPI "Independence" (öteki öz-yeterlik ölçeği) maddelerinin çoğu zihinsel yetenekle ilgili
   olduğu için, Öğrenme ve Başarı'daki TCI P2 de zaten kullanıldığı için seçilmedi. 20 madde öteki testlerin çevirisiyle
   aynı; 9 madde iki taslakla (biri öbürü görülmeden) çevrildi ("Çoğu şeyi anlayamam", "Bir şeyin neye yol açacağını önceden
   kestiremem": "bir şeyleri" ve "olayların" belirsizliği giderildi). Beş karşıt çift; "Sık sık moralim bozuk olur"
   cümlesine "Oldukça doğru" ya da "Tamamen doğru" destek kutusunu açar (İyimserlik'teki gibi); zor anlar düşükse de açılır.
   Yeni şablon seçeneği `flaggedFromAverage`: bu cümle yalnızca orta düzeydeki zor anlar önerilerini düşük düzeye çevirir
   (yüksek kartla çelişmesin; öteki testlerde davranış aynı). Rapor: "Birlikte bakınca" (öz-yeterlik ve öz-saygı farkı,
   alana göre değişme, okul araştırmalarında başarıdan güvene giden yönün daha güçlü olması ve en güçlü kaynağın çoğu
   zaman başarı deneyimi olması) ve birbirini dışlayan sekiz kural (bir alan yüksek öteki düşükken her zaman tam bir
   kural). Yol haritası: 2. hafta "Küçük başarılar", zor anlar düşükken 3. hafta ona; ortamlar "sınır değil, ipucu";
   "Öz-saygı nedir?" bağlantısı; son hafta Zihniyet ve İyimserlik. Bilim kartı: Bandura (1977), Telef ve Karaca (2012;
   gençler için öz-yeterlik ölçeğinin Türkçesi), Yıldırım ve İlhan (2010), Aypay (2010), Richardson ve ark. (2012),
   Talsma ve ark. (2018, 2021), Usher ve Pajares (2008), Byars-Winston ve ark. (2017), Arens ve Preckel (2025; öz-saygı ve
   nevrotiklikle örtüşme), Caprara ve ark. (2008), Braithwaite ve Corr (2016), Cheek ve Buss'u aktaran Tang ve ark. (2014).
   İki bağımsız inceleme (metin ve mantık; kaynak ve sayı) ve ikinci tur denetim düzeltildi; telefonda dokunarak (öğrenci)
   ve masaüstünde klavyeyle (yetişkin) çözüldü, PDF'ler açıldı. Açık not: yol haritalarının ortak "herkes için en etkili
   öğrenme yöntemleri aynıdır" cümlesi kaynaktan (Dunlosky ve ark., 2013: farklı yaş ve yetenekteki öğrencilere yararlı)
   biraz güçlü; bütün sitede birlikte yumuşatılabilir.
4. **Şekil Benzetmeleri: yayında (2026-10-27, pilot; 3. sınıftan yetişkine).** Geometrik benzetme (A : B :: C : ?), yeni
   görev türü `figural_analogy`: 24 özgün soru, beş düzey (1: tek renk ya da büyüklük; 2: tek döndürme, ayna, yer ya da sayı;
   3: bir parçada iki; 4: iki parçada birer; 5: üç değişiklik), dört seçenek, geri bildirimli üç alıştırma. Çizim ve
   dönüşümler `lib/instruments/analogy.ts` (12 biçim; renk, büyüklük, duruş, yer, sayı, iki parçanın yer değiştirmesi). C,
   A'dan biçimiyle ayrılır, değişen özellikler C'de A'daki gibi başlar (mutlak ve göreli okuma aynı cevabı verir). Yanlış
   seçenek türleri: değişmemiş şekil, eksik değişiklik, yanlış değişiklik, fazladan değişiklik (değişmemesi gereken özellik
   B'deki değerini alır). Bağımsız denetleyici (`tests/helpers/analogy-check.ts`: çizim imzaları, bütün panoyu döndürme ve
   aynalama, parça eşleşmeleri, mutlak ve göreli yorumlar) her sorunun tek doğru cevabını, düzeyleri, yanlış seçenek
   türlerini, çizimlerin görünürlüğünü ve on kestirme yolu (seçeneklere bakarak çözme; I-RAVEN gibi dengeli seçenekler)
   denetler: dokuzu 24 soruda en çok 7 doğru, değişiklik sayısını saymak ~10 doğru verir. Rapor: doğrular (düzeylere göre),
   ulaşılan düzey, değişiklik türleri (her değişiklik ayrı sayılır: yanlış cevapta seçilen şeklin kaçırdığı değişiklikler,
   `optionMisses`; bir tür yalnızca onu kaçıran seçeneğin bulunduğu sorularda sayılır, sb16'daki yer değişikliği sayılmaz),
   yanlışlarda seçilen şekiller (Poisson-binom olasılıkla öne çıkan yanılgı), çalışma biçimi (3. düzey ve üstünde 3 sn'den
   kısa yanlışlar, hep aynı sıra). Yol haritası: önce ilk ikisine bakmak, farkları söylemek, cevabı kurup denetlemek,
   benzetme oyunları; son hafta Şekil Akıl Yürütme ve Sözel Akıl Yürütme. Bilim kartı: Blum ve Holling (2018), Novick ve
   Tversky (1987), Stevenson ve ark. (2013, 2014a, 2014b), Lovett ve Forbus (2012), Becker ve ark. (2016), Laurence ve ark.
   (2018), Starr ve ark. (2018), Glady ve ark. (2017), Tunteler ve ark. (2008), Thibaut ve ark. (2010), Richland ve ark.
   (2006), Doumas ve ark. (2018), Klauer ve Phye (2008), Hu ve ark. (2021), Blum ve ark. (2011), Csapó (1997), Vendetti ve
   ark. (2015), Scharfen ve ark. (2018), Sertel (2019; ASİS); açılamayan kaynaklar (Mulholland, Bethell-Fox, Sternberg, Arendasy ve Sommer,
   Hosenfeld) yalnızca "aktaran". Türkiye'de Türkçe normları yayımlanmış bir şekil benzetmesi uyarlaması bulunamadı.
   Sürüm 2 (2026-10-27): üç alıştırma (renk, ayna görüntüsü, iki değişiklik), seçenek türleri A–D arasında dengeli.
   Telefonda dokunarak ve masaüstünde klavyeyle (yetişkin) baştan sona çözüldü, PDF'ler açıldı. İki bağımsız inceleme (metin
   ve mantık; kaynak ve sayı) bulguları sürüm 2'de uygulandı (ayrıntı "Son yapılanlar"da). Açık notlar: (1) Gizli Şekiller ve
   Küp Açınımı'nda yanılgının "öne çıkması" hâlâ tür başına %5 eşiğiyle ve "rastgele seçimle açıklanamayacak kadar sık"
   cümlesiyle; benzetimde rastgele yanlışların ~%11'i bir türü öne çıkarıyordu, bu testte eşik %5/4'e indi; ötekiler de
   aynı biçimde düzeltilebilir. (2) Ulaşılan düzey (bütün düzeyli şekil testlerinde ortak kural) aradaki %60'ın altındaki bir
   düzeyin üstüne çıkabiliyor; ortak kural olduğu için değiştirilmedi.
5. **Öz-denetim: yayında (2026-10-27, active; 9. sınıftan yetişkine).** IPIP'in NEO-PI-R'ye benzeyen üç ölçeği: temkinlilik
   (C6) → "Düşünerek davranma" (10 madde, 7'si ters), öz-disiplin (C5, 10 madde), ölçüsüzlük (N5, yönü çevrilerek) →
   "Kendini tutabilme" (iki yeme maddesi sorulmaz: 8 madde). 28 madde; toplam puan yok; kaynak anahtarı
   https://ipip.ori.org/newNEOFacetsKey.htm (iyimserlik ve öz-yeterlikteki yanlış anahtar bağlantısı da düzeldi). 23 maddenin
   çevirisi sitedeki öteki testlerden; 5 yeni madde iki taslakla çevrildi. Dört karşıt çift (üçü öz-disiplinde, biri kendini
   tutabilmede; düşünerek davranmada gerçek karşıt çift yok); uyarı en az ikisinde. Rapor: araştırma özetli giriş (alışkanlık
   ve ortam; "iradenin tükenmesi" büyük tekrar çalışmalarında desteklenmedi), 27 birleşimde birbirini dışlayan 8 kural, 3×3
   kart; yol haritası: 2. hafta eğer-o zaman planı, son hafta Erteleme ve Zaman Yönetimi ile Heyecan Arayışı. Test bir
   sayfada aynı söz öbeğinin iki ayrı yerde geçmediğini de denetler. İki bağımsız inceleme (metin ve mantık; kaynak ve sayı)
   bulguları yayından önce uygulandı (ayrıntı "Son yapılanlar"da). Telefonda dokunarak (10. sınıf) ve masaüstünde klavyeyle
   (yetişkin) baştan sona çözüldü; rapor ve PDF'ler açıldı.
6. **Harf-Sayı Sıralama: yayında (2026-10-30, pilot; 3. sınıftan yetişkine).** Yeni görev türü `letter_number`: Gold ve ark.
   (1997) harf-sayı sıralama düzeni, Mobile Toolbox "Sequences" (Slotkin ve ark., 2025) gibi ekranda: karışık sayılar (1–9) ve
   12 ünsüz (C D F H K L M N P R T Y; ünlü yok, sayıya benzeyen ve Türkçeye özgü harfler yok) tek tek 1 sn gösterilir; önce
   sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla girilir. Harf tuşları Türkçe Q klavyedeki gibi (alfabe sırasıyla
   değil; silme tuşu son harf satırında), sayılar 3 × 3; bilgisayarda klavyeyle. 3 geri bildirimli alıştırma (2, 3, 4 öğe;
   yanlışta nedeni söylenir), 2–8 öğe × 3 özgün dizi (21), bir uzunluğun üçü de yanlışsa biter (sunucu da denetler). Diziler
   üreticiyle (scratchpad) seçildi; bağımsız denetleyici (`tests/helpers/letter-number-check.ts`): iki öğelide harf önce; her
   türde sıralama gerekir; dört cevap biçimi (doğru, gösterildiği sıra, önce harfler, ayrılmış ama sıralanmamış) birbirinden
   farklı; art arda üç değer, kısaltma, "3D", bilinen yıl yok; öğe sıklığı dengeli; dizi izi `DIZI_IZI`. Rapor (beş kart): en
   uzun doğru dizi (merdiven), doğru sıralanan diziler, hata türleri (öğe eksik ya da dizide yok; öğeler tam ama sıra karışık;
   sıraya konmadan; önce harfler), sayılar ve harfler (hatırlanan ve sıralı; fark hem yüzde hem öğe ya da dizi sayısıyla
   eşiği aşmalı; harfler daha az hatırlandıysa girme sırasının payı söylenir; kural sorununda karşılaştırılmaz), çalışma
   biçimi; öne çıkan sayı "doğru sıradaki öğeler". Kural hiçbir uzun dizide uygulanmadan yanlışların ≥3'ü ve ⅔'ü
   sıralanmamışsa ya da önce harfler girildiyse sonuç dikkatle okunur; kural kısa dizilerde uygulanıp uzun dizilerde
   bırakıldıysa bu yük olarak anlatılır, uyarı yok (`lnGaveUpSorting`). Yol haritası: öbeklere ayır, içinden tekrarla, önce yaz sonra düzenle, sıralama oyunları. Türkiye: WÇZÖ-IV
   "Harf-Rakam Dizisi", WMS-III Türkçe "Harf-Sayı Dizisi"; norm yok. Telefonda dokunarak (4. sınıf) ve masaüstünde klavyeyle
   (yetişkin) çözüldü, PDF'ler açıldı. Kaynak ve sayı incelemesinin bulguları uygulandı (Conrad 1965 Li ve ark.'tan
   aktarılıyor, Shelton'daki üç görev, Mobile Toolbox'taki sunum hızı, Egeland tek yazar, MEB'de "harf grupları", Çelik
   doğrulayıcı model). Kod, metin ve ekran incelemesinin bulguları da uygulandı (diziler yeniden üretildi: ikişer ya da
   üçer artan sayılar ve "LC" yok; kartlarda sayı ve dil düzeltmeleri; alıştırma ipuçları tekil-çoğul ve türe göre; yol
   haritasında haftalık denemeler iki ayrı örnekle, alfabe oyununun teste benzediği notu).
7. Merak (kişilik; IPIP, VIA dışı ölçek)
8. Simge Arama (zekâ; özgün görev)
9. Liderlik (kişilik; IPIP, VIA dışı ölçek)
10. Parça Birleştirme (zekâ; özgün sorular)
11. Yaratıcılık Eğilimi (kişilik; IPIP)
12. Kelime Bulma (zekâ; özgün sorular)

**Raporlar: her başlığa grafik ve baştan sona inceleme (site sahibinin 2026-10-22 isteği):** "Testleri ve analiz
raporlarını çok detaylı kontrol et; çok bilimsel ama çok sade, eşi benzeri olmayan Türkçe raporlar; grafiği çok kullanalım,
her başlığı sözel açıklamanın yanında grafikle de anlatalım." Site sahibi aşama aşama gitmeyi seçti:
1. **Anket testleri (24 test): yayında (2026-10-22).** Ortak kart grafiği altyapısı (`lib/reports/visuals.ts`; ekranda
   `components/report/item-visual.tsx`, PDF'te aynı geometri): ölçek kartında düzey çubuğu (testin eşikleriyle bölgeler,
   kişinin bölgesi vurgulu, puan kırmızı işaretle), birlikte yorumda ve listelerde yan yana grafik; ayrıntılı profilde
   boyut başlıklarında da. 24 testin raporu dört bağımsız incelemeden geçti (çelişen kartlar, tek cümleyi kesin bilgi gibi
   anlatan metinler, aynı sayfada tekrarlanan öneriler, zor cümleler, cevap tutarlılığı denetimleri); bulgular uygulandı
   (ayrıntı "Son yapılanlar"da). `tests/kart-grafikleri.test.ts` her anket testinin her kartını dener.
2. **Görev (zekâ ve dikkat) testleri (26 test), 4–5'lik gruplar:** her başlığa o başlığın verisine uygun grafik (düzeylere
   göre doğrular, hata türleri, hız), rapor metinlerinin bağımsız incelemesi. Çizim altyapısı `lib/reports/visual-draw.ts`
   (ekranda ve PDF'te aynı çizim; nokta, çubuk, yığın, basamak, sütun, şerit ve dizi merdiveni), denetim
   `tests/gorev-grafikleri.test.ts` (her testin her kartı birkaç sonuç örüntüsüyle).
   - 1. grup (8 düzeyli test: şekil, sayı, harf ve sözel akıl yürütme, kâğıt katlama, kelime bilgisi, küp açınımı, gizli
     şekiller) ve 2. grup (dikkat ve bellek, sürekli dikkat, renk-kelime, dur-git, tepki hızı): **yayında (2026-10-22).**
   - 3. grup (sırayla birleştirme, geriye dönük hatırlama, kural değiştirme, hesapla ve hatırla, kelime listesi):
     **yayında (2026-10-22)**, bağımsız inceleme bulguları uygulandı.
   - 4. grup (zihinde döndürme, üç boyutlu döndürme, bakış açısı, desen hatırlama, planlama kulesi): **yayında
     (2026-10-22)**, bağımsız inceleme bulguları uygulandı.
   - 5. grup (mantıksal, sayısal, düşünerek karar verme): **yayında (2026-10-22)**, bağımsız inceleme bulguları uygulandı.
   - Ortak işler (3.–5. grubun incelemesinde bulundu): **yapıldı (2026-10-22):** veli raporunda yol haritasının öneri ve
     hafta başlıkları veliye göre (`content/roadmaps/veli-basliklari.ts`, `parentTitle`; test bütün başlıkları denetler);
     sonuç yorumlanmadığında yol haritasının girişi önerilerin genel olduğunu söyler; veli girişinde özne "nasıl
     kolaylaştırabileceğiniz"; 0 ve 1 için nicelik sözleri ("birinde", "hiçbirini"; test `N tanes` kalıbını denetler).
     **Karar:** uyarı notları ("Sonucunu okurken dikkat") 26 testte kitleye ayrı yazılmadı; edilgen dil iki kitlede de
     doğru okunuyor. Karşılaştırılacak ikinci bir süre yokken süre kartının grafiği tek çubuk değil, süre şeridi: her
     soru (doğru cevap, problem) bir nokta, tipik süre çizgi (`durationStrip`, sonuçlarda `rts`/`picks`; test tek çubuklu
     süre grafiğini ve çizginin noktaların ortasında olduğunu denetler). Yol haritalarındaki uzun cümleler bölündü
     (22 sözcüğü aşan 135 cümle 27'ye indi, 30'u aşan kalmadı). 2. aşamanın ortak işleri bitti.
3. Okuma, sesli okuma, matematik konu tarama: kart grafikleri **yayında (2026-10-22)**: matematikte genel sonuç düzey
   çubuğunda (testin %50 ve %75 eşikleri), alanlar kare kare; okumada anlama soruları ve okuma hızıyla anlayarak okuma
   yan yana; sesli okumada doğru okuma oranı düzey çubuğunda (%90 ve %97), dakikada okunan ve doğru okunan kelime (kendi
   sınıfının metninde sınıf ortalaması çizgisi), akıcılığın dört yönü, anlama soruları, söylenen fikirler. Denetim
   `tests/beceri-grafikleri.test.ts`. Bağımsız inceleme: matematik, okuma ve sesli okuma bulguları **uygulandı
   (2026-10-22)**; 3. aşama bitti. **Karar:** sesli okumada yıl sonu (nisan–mayıs) verisiyle karşılaştırma ders yılının
   başında da yapılıyor; kart bunu söylüyor ("ders yılının başında daha düşük hızlar olağandır"), ama yavaş hız düzeyi
   yine "akıcılığı gelişiyor"a çevirebiliyor (puanlama tarihi bilmiyor). Sürenin düğmelere göre ölçüldüğü okumada yavaş
   hız düzeyi değiştirmiyor; kayıtta kesinti varsa hız karşılaştırılmıyor.
   Okumada bekleyen içerik işi: bazı sorular metni okumadan da cevaplanabiliyor (başlık ana fikri veriyor, bazı kelime ve
   bilgi soruları genel bilgiyle çözülüyor); pilot veriyle sorular yeniden yazılmalı.
4. 3. listenin 2., 3. ve 4. testleri (Zihinden Hesaplama Hızı, Öz-yeterlik: Kendine Güven, Şekil Benzetmeleri) bu düzenle
   hazırlandı: **yayında (2026-10-22, 2026-10-23, 2026-10-27)**; her başlıkta grafik ve iki bağımsız inceleme. 5. test
   (Öz-denetim) ve 6. test (Harf-Sayı Sıralama) de yayında (2026-10-27, 2026-10-30). Sıradaki: 3. listenin 7. testi (Merak).

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
4. **4. dalga:** Türkçe ve Fen Konu Tarama, Kelime Bilgisi, Alan ve Bölüm Seçimi Rehberi, Hızlı Kişilik Testi (yayında);
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
- Hazır: Anatomi 2 "Anatominin dili: beyinde yön bulmak" (2026-10-09; 9 bölüm: anatomik duruş ve yön terimleri, beynin
  ekseni (Forel–Meynert, bükülmeler), düzlemler ve kesitler, simetri ve ölçek merdiveni, MR ve BT'de yön (radyolojik ve
  nörolojik gösterim), koordinatlar (RAS+/LPS+, Talairach, MNI, AC–PC, Leksell, derin beyin uyarımı hedefleri), taraf
  hataları, kafanın dışından beyni bulmak (Taylor–Haughton, Kocher ve öteki giriş noktaları, EEG 10–20, TMS), terimlerin
  kökeni; 21 sahne, 8 hareketli çizim (5'i yeni: yön çiftleri, eksen açıları, ölçek merdiveni, AC–PC ızgarası, kafadan
  beyne çizgiler), 18 vaka, 41 tablo, 54 soru, 100 terim, 267 kaynak; okuma süresi temel ~77, lisans ~182, tamamı ~280
  dk). Dört araştırmayla 1677 doğrulanmış not; dört bağımsız denetçi ~100 bulgu bildirdi, hepsi kaynağa bakılarak
  düzeltildi; iki ayrı doğrulayıcı düzeltmeleri ve çizimleri yeniden denetledi. Kapsam kararına göre omurga ameliyatı,
  kafa derisi ve kafatası ayrıntıları çıkarıldı. Gray 1918'in doğrulanmamış değerleri "tarihsel" diye işaretli.
- Hazır: Anatomi 3 "Beyin zarları ve zarlar arası boşluklar" (2026-10-15; 13 bölüm: üç zar ve iki gerçek boşluk, sert
  zarın yapısı, kıvrımları ve bölmeleri (orak, çadır, çentik), toplardamar sinüsleri ve köprü toplardamarları, sert zarın
  atardamarları, sinirleri ve ağrı, örümcek ağı zar (engel hücreleri, Liliequist zarı, granülasyonlar), yumuşak zar ve
  damar çevresi boşluklar, boşluklar ve sisternalar, yeni keşifler (zar lenf damarları, SLYM ve glenfatik tartışması),
  gelişim ve keşif tarihi, kanamalar ve fıtıklaşmalar, menenjit, menenjiyom ve basınç bozuklukları, görüntüleme ve
  cerrahi; 31 sahne, 6 hareketli çizim (5'i yeni: zar katmanları, sinüs haritası, köprü toplardamarları, sisternalar,
  fıtıklaşmalar), 29 vaka, 77 tablo, 87 soru, 142 terim, 445 kaynak; okuma süresi temel ~121, lisans ~342, tamamı ~499
  dk). Dört araştırmayla ~3.900 doğrulanmış not; altı bağımsız denetçi ~175 bulgu bildirdi, hepsi kaynağa bakılarak
  düzeltildi; üç doğrulayıcı düzeltmeleri, çizimleri ve sahneleri yeniden denetledi, ikinci turda kalanlar düzeltildi.
  Modele yeni "zar" paketi: beyincik çadırı (BodyParts3D'de yalnızca sağ yarı var; sol yarı ayna kopyası, orta hatta
  sağ yarıya birleştirildi ve beyinciğin üstünde kalsın diye yer yer birkaç mm kaldırıldı) ve yan karıncığın koroid
  pleksusu (model sürümü 08fd1ff5cb).
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
- **Sıradaki ders:** Anatomi 4 "Karıncıklar ve beyin-omurilik sıvısı" (dört karıncık; sıvının yapılışı, dolaşımı ve
  emilmesi). Sonra programdaki sırayla: beynin atardamarları ve Willis halkası, atardamar alanları ve toplardamarlar...
  Beyin zarları dersinde bu derslere "… dersinde anlatılacak" diye gönderme var; dersler yayına girince göndermeler
  güncellenebilir. Denetçilerin önerdiği 2B çizimler (nöron biçimleri, glia, nörülasyon ve kesecikler, lokalizasyon
  merdiveni, BOS yolu, Willis varyantları) ilgili derslerde yapılacak. Site sahibi başka bir ders isterse o yapılır.
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
| Hızlı Kişilik Testi | hizli-kisilik-testi | Yayında (active; 9. sınıftan yetişkine) |
| Çalışma Alışkanlıkları Envanteri | calisma-aliskanliklari | Yayında (pilot) |
| Dikkat ve Çalışma Belleği Görevleri | dikkat-ve-bellek | Yayında (pilot) |
| Sürekli Dikkat: Harf İşaretleme | surekli-dikkat | Yayında (pilot) |
| Mesleki İlgi Profili | mesleki-ilgi-profili | Yayında (pilot) |
| Okuma Hızı ve Anlama | okuma-hizi-ve-anlama | Yayında (pilot) |
| Matematik Konu Tarama Testi | matematik-konu-tarama-testi | Yayında (pilot) |
| Ayrıntılı Kişilik Profili | ayrintili-kisilik-profili | Yayında (active) |
| Kişiliğin 10 Yönü | kisiligin-10-yonu | Yayında (active; 9. sınıftan yetişkine) |
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
| Düşünmeyi Sevme Ölçeği | dusunmeyi-sevme-olcegi | Yayında (active; 9. sınıftan yetişkine) |
| Düşünme ve Çalışma Tarzı | dusunme-ve-calisma-tarzi | Yayında (active; 9. sınıftan yetişkine) |
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
| Sayısal Akıl Yürütme | sayisal-akil-yurutme | Yayında (pilot; 5. sınıftan yetişkine) |
| Zihinden Hesaplama Hızı | zihinden-hesaplama-hizi | Yayında (pilot; 4. sınıftan yetişkine) |
| Küp Açınımı | kup-acinimi | Yayında (pilot; 5. sınıftan yetişkine) |
| Düşünerek Karar Verme | dusunerek-karar-verme | Yayında (pilot; 5. sınıftan yetişkine) |
| Planlama: Kule Görevi | planlama-kule-gorevi | Yayında (pilot; 3. sınıftan yetişkine) |
| Üç Boyutlu Zihinde Döndürme | uc-boyutlu-zihinde-dondurme | Yayında (pilot; 5. sınıftan yetişkine) |
| Çalışma Belleği: Hesapla ve Hatırla | hesapla-ve-hatirla | Yayında (pilot; 5. sınıftan yetişkine) |
| Bakış Açısı Alma | bakis-acisi-alma | Yayında (pilot; 7. sınıftan yetişkine) |
| Heyecan Arayışı | heyecan-arayisi | Yayında (active; 9. sınıftan yetişkine) |
| Gizli Şekiller | gizli-sekiller | Yayında (pilot; 3. sınıftan yetişkine) |
| İyimserlik Ölçeği | iyimserlik | Yayında (active; 9. sınıftan yetişkine) |
| Desen Hatırlama | desen-hatirlama | Yayında (pilot; 3. sınıftan yetişkine) |
| Harf Dizileri | harf-dizileri | Yayında (pilot; 3. sınıftan yetişkine) |
| Empati | empati | Yayında (active; 9. sınıftan yetişkine) |
| Öz-yeterlik: Kendine Güven | oz-yeterlik | Yayında (active; 9. sınıftan yetişkine) |
| Şekil Benzetmeleri | sekil-benzetmeleri | Yayında (pilot; 3. sınıftan yetişkine) |
| Öz-denetim | oz-denetim | Yayında (active; 9. sınıftan yetişkine) |
| Harf-Sayı Sıralama | harf-sayi-siralama | Yayında (pilot; 3. sınıftan yetişkine) |
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
- **GitHub ödemesi (2026-10-30):** GitHub, Actions işlerini "hesaptaki son ödemeler başarısız oldu ya da harcama sınırı
  artırılmalı" diyerek başlatmıyor; bu yüzden Denetim ve Yayın çalışmıyor, gönderilen işlemeler canlıya çıkmıyor. Site
  sahibi GitHub → Settings → Billing and plans'tan düzeltir. Düzelince `main`'e yeni bir işleme gönderilir (ya da GitHub'da
  son çalışma yeniden başlatılır) ve yayın doğrulanır. Paylaşım kartı (53) ve Kendini Tanı Paketi (54) bunu bekliyor.
- **Hukuki işler:** Hostinger ile KVKK standart sözleşmesi ve Kurula bildirim; metinlerin avukat kontrolü;
  e-posta sağlayıcısının aydınlatma metninde anılması; Karakter Güçlü Yanları için avukat görüşü.
- **Hoca buluşması (2026-10-18 dolayı; 2026-10-11'den ertelendi):** platform bitmiş hâliyle sunulacak; yeni testler de
  kontrol ettirilecek; hocanın düzeltme istekleri gelince yapılır.
  İsterse hazır inceleme belgeleri (Hoca incelemesi tablosu) hocaya iletilebilir.
- **Açık soru:** Katalogda Türkçe Konu Tarama Testi "Hazırlanıyor" diye görünüyor, oysa 4. dalgada. İlgili bir iş
  gelince etiketin kalıp kalmayacağı site sahibine sorulur.

## Son yapılanlar

En yeni üstte; en çok 10 madde tutulur.

- 2026-10-30 (55): Yeni test Harf-Sayı Sıralama yayına alındı (3. listenin 6. testi; ayrıntı yukarıda). Yeni görev türü
  (`letter_number`): diziler, çözme ekranı (klavye düzeninde harf tuşları, telefonda 320 px'e sığan tuş takımı), puanlama,
  beş kartlı rapor, yol haritası, bilim kartı (kaynak araştırmasıyla), dış sınama; bağımsız kaynak, kod ve metin
  incelemelerinin bulguları uygulandı. Kart grafiklerinde parçalı çubuğun beşinci parçası artık içi boş, çerçeveli kutu
  (önceden birinci parçanın rengini alıyordu; Şekil Benzetmeleri'nin "Yanlışlarda seçilen şekiller" grafiği de düzeldi;
  `tests/gorev-grafikleri.test.ts` denetler). Kaynak notları: WAIS-IV'te harf-sayı
  sıralama yedek alt test; Türkiye'de WÇZÖ-IV "Harf-Rakam Dizisi"; MEB 2019 programında alfabe sırasıyla ilgili bir kazanım
  doğrulanamadı (1. sınıfta harfler harf grupları hâlinde öğretilir).
- 2026-10-30 (54): Kendini Tanı Paketi (site sahibinin isteği; büyük planın 5. basamağındaki paket). Seçimleri: geniş
  paket (yaklaşık bir saat), özet yeni yorum eklemez. Sınıfa göre 6–7 test art arda: kişilik (5. sınıf Çocuk Kişilik,
  6. sınıftan mezuna Beş Faktör, yetişkin Ayrıntılı Kişilik), ilgi (7. sınıf Hobi, 8. sınıf Mesleki İlgi Profili, 9. sınıftan
  yetişkine Meslek İlgi Alanları; 5–6. sınıfta yok), çalışma (5. sınıf Ders Çalışma Motivasyonu, 6. sınıftan mezuna Çalışma
  Alışkanlıkları, yetişkin Erteleme ve Zaman Yönetimi), zihinsel beceriler (Şekil Akıl Yürütme, Kelime Bilgisi, Zihinde
  Döndürme ya da yetişkinde Kâğıt Katlama, Desen Hatırlama); 49–73 dakika. Başlamadan test çıkarılabilir; testler arasında
  mola ekranı (sıradaki testi başlat, atla ya da paketi bitir). Sonuç: kısa özet (her testin kendi raporundaki başlık ve
  düzeyler), paylaşım kartı (kişilik ve ilgi), açılır kapanır test raporları, öğrenci/veli sekmeleri, tek PDF (özet sayfası +
  bütün raporlar). Tanıtım sayfası `/kendini-tani-paketi` (site haritasında), Testler ve yaş grubu sayfalarında tanıtım kutusu.
  Ayrılma uyarıları tek soruya indi (paket ve test aynı anda uyarınca paketin metni). Tarayıcıda telefon ve masaüstünde
  denendi: üç anket testi çözüldü, ara ekran, erken bitirme, sonuç, veli PDF'i (17 sayfa), görev testinin açılışı. Denetim:
  `tests/paket.test.ts`.
- 2026-10-30 (53): Paylaşım kartı (site sahibinin isteği: sonuçlar Instagram ve WhatsApp'ta paylaşılsın, insanlar
  "Ölçekhane"yi tanısın). Kişilik ve ilgi testlerinin raporunda "Sonucunu paylaş" bölümü: rapordan 1080 × 1920'lik bir görsel
  (Instagram hikâyesi, WhatsApp durumu) yalnızca tarayıcıda çizilir; telefonda "Paylaş" düğmesi paylaşım ekranını açar,
  her yerde "Görseli indir" var. Görselde ad yazmaz; testin adı, sonuç özeti (boyutlar düzey adlarıyla ya da en yüksek
  beş alan ya da altıgen/çember grafiği), pilot etiketi, "Sen de ücretsiz çöz" ve testin adresi yazar. Site sahibinin
  seçimi: yalnızca kişilik, ilgi ve (gelecek) paket; zihinsel görev, okuma, matematik ve "yüksek daha iyi" diye okunabilen
  ölçekler (öz-saygı, iyimserlik, öz-yeterlik, öz-denetim, empati, duygusal zekâ, öğrenme ve başarı, düşünmeyi sevme) ile
  Heyecan Arayışı'nda kart yok; veli sekmesinde gösterilmez; öğrenciye "paylaşmadan önce velinle konuşabilirsin" denir.
  Kurallar `src/lib/share/card.ts` (`SHAREABLE`, `NOT_SHAREABLE`), çizim `draw.ts`, bölüm `components/share/share-panel.tsx`;
  `tests/paylasim.test.ts` her anket testinin karara bağlandığını, bütün cevap örüntülerinde kartın kurulduğunu ve yazıların
  görselden taşmadığını denetler.
- 2026-10-27 (52): Yeni test Öz-denetim yayına alındı (3. listenin 5. testi; ayrıntı yukarıda). Bağımsız incelemelerin
  bulguları yayından önce uygulandı. Metin ve mantık: zayıf karşıt çift (Kelimelerimi özenle seçerim / Düşünmeden hareket
  ederim) çıkarıldı, uyarı kuralının anlatımı düzeldi ("en az ikisinde"); kartlar kişinin vermemiş olabileceği tek cevapları
  (para, kelime seçme) söylemiyor; "ayartı", "kendiliğindenlik", "harekete geçirmek" sadeleşti; bir sayfada aynı öneri
  birden çok yerde tekrarlanmıyor (küçük başlangıç, ortamdan uzaklaştırma, günlük yazma); 1. hafta üç alanı birlikte
  gözlemliyor, 3. hafta davranış denemesi (bir gece bekletmek, isteğin anında başka bir şey yapmak, kolay olan durumun
  düzenini taşımak); veliye öneriler suçlamayan ve gözetlemeyen dilde. Kaynak ve sayı: IPIP anahtar bağlantısı
  (newNEOFacetsKey; iyimserlik ve öz-yeterlikte de), Galla ve Duckworth (ödev sonucu altı çalışmanın biri), Duckworth ve
  Seligman (zekâ karşılaştırması ikinci çalışma, 164 öğrenci), Vohs (iki ortak yöntem), Gollwitzer ve Sheeran (94 bağımsız
  sınama), Friese (küçük ile orta; düzeltilince g = 0,13–0,24), Gülüm ve Tığrak DOI'si; neden-sonuç dili yumuşatıldı.
  Heyecan Arayışı'nın örtüşme notu 15 maddeye güncellendi ("Çılgınlıklar yaparım." artık Öz-denetim'de de).
- 2026-10-27 (51): Şekil Benzetmeleri sürüm 2: bağımsız incelemelerin bulguları uygulandı. Yanlış seçenek türleri A–D
  sıraları arasında dengelendi (fazladan değişiklik 11 kez A'daydı; hep aynı sırayı seçmek bir yanılgı gibi görünüyordu;
  test denetler); ayna görüntüsü alıştırması eklendi (üç alıştırma). Yanılgının öne çıkması için olasılık eşiği %5'ten
  %1,25'e indi, cümle "rastgele seçimde beklenenden belirgin biçimde sık". Değişiklik türleri kartı: bir türde "zorlandın"
  yalnızca o tür yanlış cevaplarda rastgele seçimde beklenenden belirgin sık kaçırıldıysa (`missP`, Poisson-binom; değişmemiş
  şekil cevapları bu karşılaştırmaya girmez); yanlışların hepsi fazladan değişiklikse "Gereken değişikliklerin hepsi
  uygulandı"; benzetimde rastgele yanlışlar %5'ten az raporda bir türü ya da yanılgıyı öne çıkarıyor (test denetler). Şans
  kuralı: en çok 9 doğru ve 1. düzeye dört sorunun üçüyle ulaşmak da şans sayılır. Bilim kartı kaynaklarla yeniden
  karşılaştırıldı: tek değişikliği uygulama olasılığı (.42/.58), "ne" ve "nerede" değişiklikleri, Thibaut'taki seçeneklerin
  yalnızca bir özelliğinin ortak olduğu, Klauer ve Phye'nin sınırları, resimli ve matris çalışmaları açıkça belirtildi; ASİS'in
  görsel analojik muhakeme alt testi anıldı (Sertel, 2019); Lovett ve Forbus künyesi bildirinin yayımlandığı yerle düzeldi.
  Ortak Thibaut künyesindeki sayı numarası (106(1)) geri geldi. Yol haritası: eğitim cümleleri kazanç vaat etmiyor.
- 2026-10-27 (50): Yeni test Şekil Benzetmeleri yayına alındı (3. listenin 4. testi; ayrıntı yukarıda). Yeni görev türü
  (`figural_analogy`): çizim ve dönüşümler, bağımsız denetleyici, puanlama, beş kartlı rapor, yol haritası. Değişiklik
  türleri kartı her değişikliği ayrı sayar (yanlış cevapta seçilen şeklin kaçırdığı değişiklikler); böylece döndürmede
  zorlanan birinin aynı sorulardaki renk değişiklikleri de yanlış sayılmaz. Kaynak araştırması ayrı bir ajanla yapıldı
  (38 kaynak; açılamayanlar ayrıca listelendi).
- 2026-10-23 (49): Yeni test Öz-yeterlik: Kendine Güven yayına alındı (3. listenin 3. testi; ayrıntı yukarıda). Kaynak
  araştırması ayrı bir ajanla yapıldı; metin ve mantık incelemesi ile kaynak ve sayı incelemesinin bulguları uygulandı:
  iki çeviri netleşti, destek cümlesinin eşiği İyimserlik'le aynı (4), yüksek düzeyde yol haritası kartla çelişmiyor
  (`flaggedFromAverage`), veli raporunda 2. hafta ile yaklaşım önerileri aynı fikri tekrarlamıyor (test artık kök düzeyinde
  de bakıyor), girişteki araştırma cümleleri okul araştırmalarıyla sınırlı ve "çoğu zaman" kaydıyla, Braithwaite ve Corr
  cümlesi kaynağın tablosuna göre düzeltildi, aktarılan bilgiler "aktaran" diye anıldı, NEO tablosunun örneklemi
  belirtmediği yazıldı. Düşünme ve Çalışma Tarzı testindeki "yalnızca bu testte" denetimi, aynı çeviriyi kullanan
  sonraki testlere izin verecek biçimde güncellendi. İkinci tur denetimden sonra: veli kurallarındaki öneriler betimleyici
  oldu (yaklaşım bölümüyle yarışmasın), "başardıkça güven artar" fikri sayfada bir kez söylenir, zor anlar düşükken o alan
  "Kısaca"da öne çıkanların başında (`standoutFirst`). Test sayfasındaki "Neyi ölçer?" metni artık boş satırla (`\n\n`)
  paragraflara bölünebilir (öteki testlerde değişiklik yok); bu testin uzun metni beş paragraftır.
- 2026-10-22 (48): Yeni test Zihinden Hesaplama Hızı yayına alındı (3. listenin 2. testi; ayrıntı yukarıda). Kaynak
  incelemesinin ve rapor, puanlama ve ekran incelemesinin bulguları uygulandı: doğruluk sözcükleri rozetle aynı ("hemen
  hepsi" yalnızca %90 ve üstünde; hiç doğru yoksa "hiçbiri doğru değildi" ve uyarı); geçilen işlemler "bitirdin", tavan ve
  ulaşılan düzey sayılmaz, bütünüyle geçilen düzeyler adıyla söylenir; hız kartının rozeti grafikle aynı süreyi söyler,
  büyük sayılarla yavaşlama yalnızca gerçekten yavaşlandıysa anlatılır, eşit süreler birlikte adlandırılır; bölme
  araştırma cümlesi yalnızca bölmenin doğruluğu en düşükse; çarpma ve bölme yanlışları ayrı türler; rakamların yer
  değiştirmesi tablo yanlışından önce; uyarılar bölümler arasında birleşir; yüzdeler yuvarlanır; yetişkin norm notunda
  okul sözcüğü yok (test artık bütün yetişkin testlerinin norm notunu denetler). Ekran: duraklatmadan önceki süre korunur,
  süre dolduktan sonraki cevap sayılmaz, kalan süre ekran okuyucuya açık, süre dolunca "Süre doldu; bu bölüm bitti".
- 2026-10-22 (47): Sesli okuma raporunda bağımsız incelemenin bulguları uygulandı. Okuma metin bitmeden durduysa ve
  metnin en az yarısı okunduysa doğru okuma oranı okunan kısımdan hesaplanıyor (okunmayan kelimeler "zorlanma" sayılmıyor;
  yarısından azı okunduysa sayılıyor ama bu açıkça söyleniyor, profil verilmiyor, yeni değerlendirme isteniyor). Süre
  metne göre çok kısaysa hız hiçbir yerde gösterilmiyor; kayıtta kesinti varsa hız karşılaştırılmıyor; süre düğmelerle
  ölçüldüyse yavaş hız düzeyi değiştirmiyor. Hız karşılaştırması "Ankara, 2002, ders yılının sonu" diye ve aralıkla
  anlatılıyor; öğrenciye kısa ve kaynaksız. Akıcılık eşiği kaynağın yorumuna göre (8'in altı). Uzman kutusu yalnızca
  kelimelerde sık zorlanmada ya da hem sorularda hem anlatmada zorlanmada açılıyor; "disleksi" sözü kalktı. Anlama kartı
  soru türünü yalnızca en az iki yanlış bir türde toplanınca söylüyor; sorular ile yeniden anlatma ayrışınca veliye
  açıklanıyor. Öğrenci raporunda başlık ve rozetler "sen" diliyle; sonraki değerlendirmede sınıf adı açık; ölçüt tablosu
  ve altındaki not düzeyin nasıl belirlendiğini (akıcılık kuralı, soru sayısı) söylüyor. Yol haritasında öncelik düzeyi
  belirleyen ölçütte (önce doğru okuma, sonra anlama); metin zorsa 3. hafta kolay metinler, 4. hafta bir alt sınıfın metni.
  Rapor telefonda ve masaüstünde açıldı, PDF incelendi.
- 2026-10-22 (46): Matematik ve okuma raporlarında bağımsız incelemenin bulguları uygulandı. Matematik: cevaplar tahmin
  olabilirse (çok hızlı ya da çoğu aynı seçenek) ya da bütün sorularda "Bilmiyorum" denmişse genel sonuç, alanlar ve yol
  haritası "Yorumlanmadı"; alan kartları sonucu sözle de anlatıyor; "Pekiştirilmeli" ama bazı alanlar öncelikliyse o
  alanlar söyleniyor; hatalar bir alanda toplanınca "dikkatsizlik" denmiyor; yanlış yokken hata türü bölümü bunu söylüyor;
  norm notu, uyarılar, yol haritası (sıralama, "sağlam görünüyor", ortak kat sorusu, hata defteri) sadeleşti. Okuma: hız
  yorumlanmayınca hiçbir yerde hız sayısı yok; anlama kartı en çok zorlanılan soru türünü söylüyor, az doğruda rastgele
  işaretlemeyle ayırt edilemeyeceğini belirtiyor; "Anlayarak okuma hızı" adı ve açıklaması; sesli okuma verisi aralıksız ve
  "Ankara'da" diye; "metindeki bilgiyi hatırlama"; yol haritasında hız olağan ama anlama zayıfsa anlama önerisi, çok kısa
  sürede anlama iyiyse ön bilgi uyarısı. 3–5. sınıf öğrencisinin raporunun sonundaki not küçük çocuğa göre.
