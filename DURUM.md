# Ölçekhane: güncel durum

Her sohbet işe başlamadan bu dosyayı okur; iş bitince değişikliği aynı işlemede buraya yazar (CLAUDE.md, "Yeni bir
sohbette: istekten yayına"). Plan, Claude Docs'taki **Ölçekhane Platform Haritası** belgesidir:
https://claude.ai/artifact/PqjqGWA4vWv2HUx2sEAPQa

Son güncelleme: 2026-10-08

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
3. **Nörobilim bölümü:** iki dal: Beyin Anatomisi (~40 ders) ve Beyin Nasıl Çalışır? (~40 ders); iskelet ve 3B beyin
   2–3 oturum, sonra her mesajda bir ders. Her derste sade anlatım, hareketli çizimler, 3B modelde ilgili yerin
   parlaması, sözlük, kısa alıştırma (cevaplar saklanmaz) ve kaynaklar. 3B model adayı: Z-Anatomy modelleri
   (CC BY-SA 4.0, kaynak gösterilerek; FBX). **Engel:** bu ortamdan openstax.org, ncbi.nlm.nih.gov, ninds.nih.gov
   ve wikipedia.org açılmıyor; site sahibi ortamın ağ erişimini açmadan dersler yazılmaz (bilgi yalnızca açılıp
   okunmuş kaynaklardan alınır).
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
2. 16 Faktörlü Kişilik Profili (IPIP-16PF karşılıkları, 163 madde, 9. sınıftan yetişkine).
3. Sayı Dizileri (özgün). 4. Öğrenme ve Başarı Özellikleri (IPIP kısa ölçekleri; VIA dışı kaynaklar). 5. Sözel Akıl
   Yürütme (özgün Türkçe). 6. Kâğıt Katlama (özgün). Sonra: Kelime Bilgisi, Kural Değiştirme, Kelime Listesi
   Hatırlama, 3–5. sınıflar için çocuk diliyle kısa kişilik testi.

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

- 2026-10-08 (3): Sesli okumada otomatik analiz gürültüye dayanıklı hâle getirildi: mikrofon denemesinde asıl ölçüt
  yapay zekânın cümleyi anlaması (gürültü, kısık ses ve sessizlik ölçümü engellemiyor, ne yapılacağını söylüyor; üç
  denemede anlaşılmazsa yine de okumaya geçilebiliyor), cümle süresi 7 sn; metne dokununca doğrudan mikrofon
  denemesine geçiliyor (iki sürümde); "Başla" ve kayıt düğmeleri takılmıyor; ses 90 Hz'in altı süzülerek inceleniyor
  (iş makinesi uğultusu); gürültülü kayıtta ek ve ses farkları hata sayılmıyor, uzun kelimede birkaç ses farkı da;
  yetişkinli sürümde "Okumayı bitirdim"e çift dokunuş kaydı bitirmiyor.
- 2026-10-08 (2): Otomatik analiz uçtan uca denendi ve hatalar düzeltildi: model dosyaları 8 MiB'lık parçalar
  hâlinde (tarayıcı önbelleğinde tutulsun, her girişte 250 MB inmesin; kopan parça kaldığı yerden iner);
  transformers.js'in kısa seste kelime zamanlarını kaydıran hatası düzeltildi (doğrulama parçaları hiç sonuç
  vermiyordu); boş ya da güvenilmez doğrulama artık atlamayı "doğrulanmış" saymıyor; başka bir metin okununca ya da
  kelimelerin %30'undan çoğu net anlaşılamayınca rapor verilmiyor, yeniden okuma isteniyor ve sorular yeniden
  sorulmuyor; metin bitmeden durulursa hız okunan kısımdan hesaplanıyor ve raporda söyleniyor (iki sürümde);
  zaman çizelgesindeki duraklamalar okuma süresiyle aynı ölçekte; bellek hatasında tek iş parçacığıyla yeniden
  deneniyor; inceleme biter bitmez yapay zekâ kapatılıyor; mikrofon denemesinde yanlış "sesini duyamıyoruz" uyarısı ve
  adım göstergesi (Rapor) düzeldi.
- 2026-10-08: Sesli okumada otomatik analiz önizlemede (`?onizleme=otomatik`): öğrencinin kendi okuduğu akış, sıkı
  mikrofon denemesi, cihazda çalışan Türkçe konuşma tanıma (Whisper small, kendi sunucumuzdan), metinle karşılaştırma
  ve doğrulama ("net anlaşılamadı" hata sayılmaz), otomatik rapor ve PDF, aydınlatma metni sürüm 7. Herkese açık sürüm
  değişmedi.
- 2026-10-07 (akşam): Günün işleri baştan sona denetlendi, bulunan hatalar düzeltildi. Kod: ilgi testlerinde bütün
  alanlar düşükken alan öne çıkarılmıyor ve eğitim yolu önerilmiyor (yalnızca görece yüksek alanlarda da yol yok); bir
  boyut hesaplanamasa da plan dört hafta, başlık haftaların sayısını söylüyor; sesli okumada mikrofon koparsa yeniden
  açılıyor (mikrofon ve anlatma adımında), çift dokunuşta tek kayıt, "Ne okudu?" kutusuna boşluk yazılabiliyor,
  işaretleme seçeneklerine klavye odağı ve Escape, doğru okuma oranı aşağı yuvarlanıyor, 5. sınıf karşılaştırma değeri
  (Erden ve ark., 2002: 121) eklendi, bir üst/alt metin yalnızca seçilebiliyorsa öneriliyor; testten çıkaran bağlantılar
  (ör. "Vazgeç") iPhone'da da onay soruyor; okuma hızı yol haritasında anlama düşük ve hız yüksekse "yavaşla ve anla",
  kalite uyarısı varsa yol haritasında not; kırık rehber bağlantısı düzeldi (eski adres yönlendiriliyor). İçerik: sesli
  okuma metinlerinde birbirini ele veren sorular, ağaç halkaları, domates cümlesi ve rapor cümleleri; kişilik, duygusal
  zekâ, kişilerarası tarz, çalışma alışkanlıkları, matematik, okuma, zihinsel görev ve ilgi yol haritası metinleri (vaat
  ve kesin dil, rapor metnini tekrar, yanlış hedef kitle, sınav kaygısı önerileri). Altı Boyutlu Kişilik'te Duygusallık
  ve Uyumluluk metinleri HEXACO'ya göre yeniden yazıldı (önceden Beş Faktör'ün onaylı metinleri kullanılıyordu; hoca
  buluşmasında gösterilmeli). Sayfalar: ortaokul önerileri 5. sınıfa da uygun, İlkokul 1–2 sayfası tek değerlendirmeye
  ve yetişkine göre, grup açıklamaları gruptaki testlere göre, bölüm düğmeleri sınıf seçimine göre, "Grubuna göre".
- 2026-10-07: Okuma sekmesi (`/okuma`) ve Sesli Okuma Değerlendirmesi yayında (1–8. sınıf, 24 özgün metin; "İlkokul
  1–2" grubu açıldı). Adım adım: metin seçimi, mikrofon denemesi (dinlemeden geçilmez), sesli okuma kaydı (yalnızca
  cihazda; sunucuya gitmez), kayıt denetimi (ses yok, kısık, gürültü, kesinti), yeniden anlatma, sorular; yetişkin
  kaydı dinleyip kelime kelime işaretler (yanlış, atlama, yardım, ekleme; kendi düzeltme, tekrar, hece, duraksama),
  anlatmayı ve akıcılığı değerlendirir. Rapor (ekran ve PDF): metnin düzeyi, dakikada doğru kelime, işaretli metin,
  duraklama çizelgesi, akıcılık, anlama; gelişim yol haritası (okumanın yönlerine göre kartlar, alışkanlıklar, veliye
  öneriler, dört hafta; `ORAL_ROADMAPS`). Aydınlatma metni (sürüm 6) ses kaydını anlatıyor; mikrofon izni yalnızca
  sitenin kendisine açık.
- 2026-10-07: Zihinsel görevlerin (sekiz görev) gelişim yol haritaları yayında; artık çözülebilen her testin raporunda
  yol haritası var. SSS'deki "Ücretli mi?" cevabı buna göre güncellendi; yayın denetimi görev yol haritasını da sınıyor.
- 2026-10-07: Matematik Konu Tarama ve Okuma Hızı ve Anlama gelişim yol haritaları yayında (öğrenci ve veli raporu,
  ekranda ve PDF'te): konu alanlarına ve okuma becerilerine göre çalışma önerileri, haftalık çalışma düzeni ve okuma
  alışkanlığı, veliye destek, dört haftalık plan. Yayın denetimi iki raporun yol haritasını dışarıdan sınıyor.
- 2026-10-07: İlgi testlerinin gelişim yol haritaları yayında (Mesleki İlgi Profili, Meslek İlgi Alanları, Hobi ve
  Serbest Zaman İlgileri; öğrenci, veli ve yetişkin raporu, ekranda ve PDF'te): öne çıkan alanlar için keşif
  önerileri, Holland profilinde eğitim yolları, veliye yaklaşım, dört haftalık denemeler. Yayın denetimi iki ilgi
  raporunun yol haritasını dışarıdan sınıyor.
- 2026-10-07: Öz-saygı ve Çalışma Alışkanlıkları gelişim yol haritaları yayında (doğrudan). Yol haritasında ortamlar
  bölümü isteğe bağlı, tek boyutlu testte üç boyutlu profil gösterilmiyor; test sayfasındaki tanıtım testin kendi
  bölümlerini sayıyor.
- 2026-10-07: Site sahibinin kararıyla hoca onayı beklenmeden yayına alındı: Renk-Kelime, Dur-Git, Sırayla
  Birleştirme, Geriye Dönük Hatırlama, Zihinde Döndürme, Tepki Hızı (pilot) ile Duygusal Zekâ Bileşenleri ve
  Kişilerarası Tarz yol haritaları. Çalışma kuralları buna göre güncellendi (CLAUDE.md).
