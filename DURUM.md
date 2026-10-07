# Ölçekhane: güncel durum

Her sohbet işe başlamadan bu dosyayı okur; iş bitince değişikliği aynı işlemede buraya yazar (CLAUDE.md, "Yeni bir
sohbette: istekten yayına"). Plan, Claude Docs'taki **Ölçekhane Platform Haritası** belgesidir:
https://claude.ai/artifact/PqjqGWA4vWv2HUx2sEAPQa

Son güncelleme: 2026-10-07

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
- Zekâ tarafı "Zekâ ve zihinsel beceriler" adıyla kurulur: telifli zekâ testleri kullanılmaz, IQ puanı verilmez;
  akıl yürütme, sözel, sayısal, uzamsal, bellek, dikkat ve hız ayrı ayrı ölçülür, sonuç güçlü yanlar haritasıdır.

Basamaklar:

1. **Yaş ve sınıf düzeni, her sayfada yol gösterme:** bitti (2026-10-07). Hoca yetişkinlere de uygun 6 testi
   aynı gün onayladı; Üniversite ve yetişkin grubu açıldı.
2. **Rapor yenileme ("Gelişim Yol Haritası"):** Beş Faktör, Ayrıntılı Kişilik ve Altı Boyutlu Kişilik'te yayında
   (hoca onayı 2026-10-07; site sahibi beğendi). Sırada öteki testlerin yol haritaları: her biri önce önizlemede,
   hoca onayıyla herkese açılır. İlk tasarım: önce Beş Faktör Kişilik'te örnek rapor, site sahibi beğenince öteki
   testler. Bölümler: güçlü yanlar, nasıl çalışmalı, okul ve meslek planı için öneriler, veli ve öğretmen için
   yaklaşım, dört haftalık küçük adımlar, ne zaman uzmana başvurmalı (hepsi tavsiye dili). Grafikler ekranda ışıklı,
   derinlikli ve döndürülebilir; değerler her zaman düz yazıyla da okunur; PDF'te derinlikli resim. Öğrenci ve veli
   önerilerinin metinleri (`tipsStudent`, `tipsParent`) birçok testte yazılı ama bugünkü raporda görünmüyor. Bu
   basamakta CLAUDE.md'deki "rapor ekranları sade kalır" kuralı site sahibinin isteğine göre güncellenir.
3. **Nörobilim bölümü:** iki dal: Beyin Anatomisi (~40 ders) ve Beyin Nasıl Çalışır? (~40 ders); iskelet ve 3B beyin
   2–3 oturum, sonra her mesajda bir ders. Her derste sade anlatım, hareketli çizimler, 3B modelde ilgili yerin
   parlaması, sözlük, kısa alıştırma (cevaplar saklanmaz) ve kaynaklar. 3B model adayı: Z-Anatomy modelleri
   (CC BY-SA 4.0, kaynak gösterilerek; FBX). **Engel:** bu ortamdan openstax.org, ncbi.nlm.nih.gov, ninds.nih.gov
   ve wikipedia.org açılmıyor; site sahibi ortamın ağ erişimini açmadan dersler yazılmaz (bilgi yalnızca açılıp
   okunmuş kaynaklardan alınır).
4. **Yeni testler (sürekli):** aşağıdaki dalgalar; yanında zekâ, algı ve okuma tarafı genişler (şekil, sayı ve sözel
   akıl yürütme, görsel algı hızı, örüntü bulma, sınıfa özel okuma metinleri, kelime bilgisi). Sonunda yaş grubuna
   göre "Kendini Tanı Paketi": birkaç test art arda, tek büyük PDF rapor.

## Sıradaki işler

1. **Büyük planın 2. basamağı:** öteki testlerin gelişim yol haritaları. Beş Faktör, Ayrıntılı ve Altı Boyutlu
   Kişilik yayında. Yeni yol haritası önizlemede (`?onizleme=yol-haritasi`) başlar, hoca onaylayınca
   `ROADMAP_IN_REVIEW`'dan çıkarılır. Sırada: Duygusal Zekâ Bileşenleri, Kişilerarası Tarz, Öz-saygı, Çalışma Alışkanlıkları; sonra ilgi testleri ve
   zihinsel görevler (bunların bölümleri kişilik testlerinden farklı tasarlanır).
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
**İncelemede:** yalnızca doğrudan bağlantıyla açılır, hocanın onayını bekler.

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
| Renk-Kelime Görevi | renk-kelime-gorevi | İncelemede (1. dalga) |
| Dur-Git Görevi | dur-git-gorevi | İncelemede (1. dalga) |
| Sırayla Birleştirme Görevi | sirayla-birlestirme-gorevi | İncelemede (1. dalga) |
| Altı Boyutlu Kişilik Profili | alti-boyutlu-kisilik-profili | Yayında (active) |
| Duygusal Zekâ Bileşenleri | duygusal-zeka-bilesenleri | Yayında (active) |
| Kişilerarası Tarz | kisilerarasi-tarz | Yayında (active) |
| Hobi ve Serbest Zaman İlgileri | hobi-ve-serbest-zaman-ilgileri | Yayında (active) |
| Geriye Dönük Hatırlama | geriye-donuk-hatirlama | İncelemede (2. dalga) |
| Zihinde Döndürme | zihinde-dondurme | İncelemede (2. dalga) |
| Tepki Hızı | tepki-hizi | İncelemede (2. dalga) |

Hazırlanıyor listesinde (katalogda bağlantısız): Türkçe Konu Tarama Testi (`src/content/roadmap.ts`).

## Hoca incelemesi

Her incelemedeki test için Claude Docs'ta bir belge vardır; sonunda Onay tablosu bulunur. Hoca onaylayınca test
`active` ya da `pilot` yapılır (CLAUDE.md, "Yeni test"). Yeni belgelerde en yenisi örnek alınır.

| Belge | Testler | Durum |
| --- | --- | --- |
| [Ayrıntılı Kişilik Profili İncelemesi](https://claude.ai/artifact/6hgnALjSe966eXfd51gJQq) | Ayrıntılı Kişilik Profili | Onaylandı (2026-10-07), yayında |
| [Meslek İlgi Alanları İncelemesi](https://claude.ai/artifact/C9wjSAB8DeA3CqP6XHSCQr) | Meslek İlgi Alanları | Onaylandı (2026-10-07), yayında |
| [Zihinsel Görevler İncelemesi](https://claude.ai/artifact/NsQwxqSdN2JMQzc4Q14L3f) | Renk-Kelime Görevi, Dur-Git Görevi, Sırayla Birleştirme Görevi | Hocanın kararı bekleniyor |
| [Altı Boyutlu Kişilik Profili İncelemesi](https://claude.ai/artifact/7CyxdkAJK6YeCGWJxyToJ1) | Altı Boyutlu Kişilik Profili | Onaylandı (2026-10-07), yayında |
| [Duygusal Zekâ Bileşenleri İncelemesi](https://claude.ai/artifact/VRC7jJQhpMUPcmw9cHnSup) | Duygusal Zekâ Bileşenleri | Onaylandı (2026-10-07), yayında |
| [Kişilerarası Tarz İncelemesi](https://claude.ai/artifact/KjJpTLotNssmP2X2vGrWM4) | Kişilerarası Tarz | Onaylandı (2026-10-07), yayında |
| [Hobi ve Serbest Zaman İlgileri İncelemesi](https://claude.ai/artifact/Q3jafRsMG6HesnzBrw93VP) | Hobi ve Serbest Zaman İlgileri | Onaylandı (2026-10-07), yayında |
| [Geriye Dönük Hatırlama İncelemesi](https://claude.ai/artifact/659BWzuYohtcK9QfCvZbEV) | Geriye Dönük Hatırlama | Site sahibinin hocayla paylaşması bekleniyor |
| [Zihinde Döndürme İncelemesi](https://claude.ai/artifact/Aftf1twHWeuaLpfQLgwZRv) | Zihinde Döndürme | Site sahibinin hocayla paylaşması bekleniyor |
| [Tepki Hızı İncelemesi](https://claude.ai/artifact/Nkt8WiGPtSfpvbppwmF1Hy) | Tepki Hızı | Site sahibinin hocayla paylaşması bekleniyor |
| [Beş Faktör Gelişim Yol Haritası İncelemesi](https://claude.ai/artifact/HaGkWkUNY9q6jJasEDk8gt) | Beş Faktör Kişilik Profili (yol haritası) | Onaylandı (2026-10-07), yayında |
| [Ayrıntılı ve Altı Boyutlu Kişilik Gelişim Yol Haritası İncelemesi](https://claude.ai/artifact/UwsHRuzXgxSWkf6qrbZUWC) | Ayrıntılı Kişilik Profili, Altı Boyutlu Kişilik Profili (yol haritası) | Onaylandı (2026-10-07), yayında |

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

- **Nörobilim bölümü için ağ erişimi:** sohbetin ortam menüsü → Düzenle → Ağ erişimi; erişimi genişletmek ya da
  openstax.org, ncbi.nlm.nih.gov, ninds.nih.gov, wikipedia.org adreslerini izinli listeye eklemek
  (https://code.claude.com/docs/en/cloud-environments#network-access). 3. basamağa gelince hatırlatılır.
- **Site sahibi bilgileri** (ad, adres, telefon, e-posta): yasa gereği İletişim sayfasında ve aydınlatma metninde
  gösterilir; her yayında uyarı olarak çıkar. Gelince `yayin/ayarlar.env`'e yazılır (CLAUDE.md).
- **Hostinger sunucusunun yenilenmesi:** 30 Ekim 2026'dan önce.
- **Hukuki işler:** Hostinger ile KVKK standart sözleşmesi ve Kurula bildirim; metinlerin avukat kontrolü;
  e-posta sağlayıcısının aydınlatma metninde anılması; Karakter Güçlü Yanları için avukat görüşü.
- **Hoca belgeleri:** Geriye Dönük Hatırlama, Zihinde Döndürme ve Tepki Hızı incelemelerinin hocaya iletilmesi;
  hocanın kararları (Renk-Kelime, Dur-Git, Sırayla Birleştirme dahil zihinsel görevlerin hepsi kararı bekliyor).
- **Açık soru:** Katalogda Türkçe Konu Tarama Testi "Hazırlanıyor" diye görünüyor, oysa 4. dalgada. İlgili bir iş
  gelince etiketin kalıp kalmayacağı site sahibine sorulur.

## Son yapılanlar

En yeni üstte; en çok 10 madde tutulur.

- 2026-10-07: Ayrıntılı Kişilik ve Altı Boyutlu Kişilik gelişim yol haritaları hoca onayıyla herkese açık raporda
  (öğrenci, veli ve yetişkin); yayın denetimi üç raporu dışarıdan sınıyor.
- 2026-10-07: Ayrıntılı Kişilik ve Altı Boyutlu Kişilik gelişim yol haritaları önizlemede (öğrenci, veli ve
  yetişkin raporu; Altı Boyutlu'da Dürüstlük-Alçakgönüllülük ve Duygusallık için yeni metinler, altıgen üç
  boyutlu profil); hoca belgesi hazır. Üç boyutlu grafiğin açıklaması ölçüm payı olmayan testlerde kısalıyor.
- 2026-10-07: Beş Faktör gelişim yol haritası hoca onayıyla herkese açık raporda; SSS'deki "Ücretli mi?" cevabı,
  test sayfasının rapor listesi ve ana sayfadaki örnek rapor buna göre güncellendi; yayın denetimi yol haritasını
  dışarıdan sınıyor.
- 2026-10-07: Gelişim yol haritası (Beş Faktör, önizlemede): döndürülebilir üç boyutlu profil, nasıl çalışabilir,
  rahat edilebilecek ortamlar, veliye yaklaşım, dört haftalık adımlar; ekranda ve PDF'te. Hoca belgesi hazır.
- 2026-10-07: Hoca onayıyla Ayrıntılı Kişilik Profili, Meslek İlgi Alanları, Altı Boyutlu Kişilik Profili, Duygusal
  Zekâ Bileşenleri, Kişilerarası Tarz, Hobi ve Serbest Zaman İlgileri yayında (active); Üniversite ve yetişkin
  grubu (`/yetiskin`) açıldı.
- 2026-10-07: Yaş ve sınıf düzeni: İlkokul, Ortaokul, Lise ve mezun sayfaları (`/ilkokul`, `/ortaokul`, `/lise`;
  Üniversite ve yetişkin sayfası `/yetiskin` yetişkin testleri onaylanınca kendiliğinden açılır); grup sayfasında
  sınıf seçimi ve "Nereden başlamalı?" önerileri; ana sayfada, Testler'de, menüde ve altbilgide grup seçimi; her
  sayfanın başında yol gösterici kutu (test başlatma ve rapor ekranı dahil), bulunamayan sayfa için yönlendirme;
  "Bilişsel beceriler" alanı "Zekâ ve zihinsel beceriler" oldu ve sırada ikinciye alındı.
- 2026-10-06: Yeni sohbetlerin aynı düzende çalışması için çalışma döngüsü (CLAUDE.md), bu dosya, yardımcı araçlar
  (`araclar/`), rehber yazıları ve yayın denetimi testleri; yayın denetimi artık site haritasındaki bütün sayfaları
  internetten açıyor.
- 2026-10-01: Tepki Hızı uzman incelemesinde; hoca belgesi hazır.
- 2026-10-01: Zihinde Döndürme uzman incelemesinde; hoca belgesi hazır.
- 2026-10-01: Geriye Dönük Hatırlama uzman incelemesinde; hoca belgesi hazır.
