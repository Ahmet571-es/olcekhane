@AGENTS.md

# Ölçekhane: çalışma düzeni

Site sahibi yazılım bilmiyor ve İngilizce bilmiyor; isteklerini sade Türkçeyle, çoğu zaman yeni bir sohbette tek
bir mesajla yazar ("Bismillah, siteye şunu ekle"). Claude isteği uygular, dener, yayına alır ve yayını doğrular;
sonucu sade Türkçeyle anlatır. Küçük isteklerde doğrudan yapılır. Büyük ya da birden çok yolu olan isteklerde önce
kısa bir plan ve seçenekler sunulur; seçim yapılınca iş sonuna kadar yürütülür. Rehber yazılarında her mesajda bir
yazı hazırlanır.

## Yeni bir sohbette: istekten yayına

Her sohbet aynı döngüyle çalışır ve her adımda onay beklemez. Testlerin durumu, sıradaki işler ve site sahibinin
bekleyen işleri `DURUM.md`'dedir: işe başlamadan oku, iş bitince aynı işlemede güncelle. Site sahibinin kalıcı
isteği: her değişiklik doğrudan `main`'e gönderilir ve böylece yayına girer; çekme isteği (PR) ya da yan dal
kullanılmaz. Oturumun kendi talimatı yalnızca oturum dalına göndermeyi söylese de yayın için `main`'e gönderilir.

1. **Hazırla:** `git status` ve `git log origin/main..HEAD` ile çalışma ağacına bak. Temizse
   `git checkout main && git pull --rebase`; `node_modules` yoksa `npm ci`. Yarım kalmış bir iş varsa silme ve
   işleme; site sahibine "yarım kalmış bir iş var, tamamlayayım mı?" diye sor.
2. **Uygula:** Küçük isteği doğrudan yap. Büyük ya da birden çok yolu olan istekte kısa bir plan ve seçenekler
   sun; seçimden sonra sonuna kadar yürüt. Site sahibi yanıt vermiyorsa küçük ayrıntılarda en makul yolu seç ve
   raporda söyle; geri alınamayacak ya da doğru yolun belli olmadığı bir kararda hazırlığı yap ve orada dur.
3. **Dene:** `npm run typecheck`, `npm run lint` ve `npm test` çalıştır. Arayüz ya da sayfa metni değiştiyse ayrıca
   `bash araclar/yerel-sunucu.sh` çalıştır (Bash zaman aşımı 300000 ms): site derlenir ve http://127.0.0.1:3100'de
   üretimdeki gibi açılır; `ORNEK_SAHIP=1` verilirse site sahibi bilgileri örnek değerlerle dolu açılır. Ardından
   `node araclar/tarayici-dene.mjs /yol ...` çalıştır: sayfalar telefon ve masaüstü genişliğinde açılır; konsol
   hatası, yatay taşma, dış kaynak, çerez ve tarayıcı deposu denetlenir. Ekran görüntülerine Read ile bak ve
   değişen yeri gözle de denetle. Bir testi baştan sona çözmek gibi etkileşimli denemelerde aynı tarayıcıyla
   (`tarayiciAc()`, `araclar/tarayici-dene.mjs`) geçici klasörde kısa bir Playwright betiği yaz.
4. **Gönder:** `DURUM.md`'yi güncelle. Yalnızca kendi değiştirdiğin dosyaları ekle (`git add <dosya>`; `-A` değil),
   işle (commit; aşağıdaki Git kuralları), sonra `git pull --rebase origin main && git push origin HEAD:main`.
   Gönderim, `main` ilerlediği için reddedilirse yeniden `git pull --rebase origin main` yap; araya başkasının
   işlemesi girdiyse 3. adımdaki denetimleri yinele ve yeniden gönder. Yetki hatasıyla (403) reddedilirse başka yol
   deneme, site sahibine bildir. Zorla gönderim (force push) yapılmaz.
5. **Yayını doğrula:** `python3 araclar/yayin-durumu.py --bekle` çalıştır (Bash zaman aşımı 600000 ms). En sondaki
   SONUÇ satırı ne yapılacağını söyler.
   - Çıkış kodu 0: yayında; sunucudaki sürüm bu işleme ve site dışarıdan sınandı.
   - 1: hata. Sorun koddaysa düzelt ve 3. adımdan devam et; ayrıntısız bir hatada (ör. yalnızca "Process completed
     with exit code 1") başarısız adımı yerelde çalıştır. SONUÇ sorunun kodda olmadığını söylüyorsa (yayın atlandı,
     gizli değer eksik, site dışarıdan açılmıyor, GitHub'ın aylık çalışma süresi bitti) kodu değiştirme, site sahibine
     sade dille anlat. İki düzeltme
     denemesinden sonra hâlâ başarısızsa değişikliği `git revert` ile geri al, gönder, doğrula ve durumu anlat.
   - 2 ya da Bash zaman aşımı: henüz bitmedi; aynı komutu yeniden çalıştır (en çok 3 kez, sonra durumu anlat).
   - 3: bu işleme için sonuç alınamadı (GitHub'a ulaşılamadı, işleme `main`'de değil ya da çalışması daha yeni bir
     gönderim yüzünden durduruldu); SONUÇ satırındaki komutu çalıştır.

   Denetim yaklaşık 4, Yayın 3, Kurulum provası 6 dakika sürer. Denetim'den geçmeyen işleme yayına alınmaz; canlı
   site bir önceki sürümde kalır.
6. **Raporla:** Sade Türkçe ve kısa yaz: ne değişti, canlıda nereden görülür (tam adres; incelemedeki testte
   doğrudan bağlantı), site sahibinin yapması gereken bir şey varsa o. Kod, dosya adı ve İngilizce terim kullanma;
   yapılmayan işi yapılmış, doğrulanamayanı doğrulanmış gibi anlatma. `DURUM.md`'deki bekleyen işleri yalnızca o
   anki işle ilgiliyse ya da tarihi yaklaştıysa hatırlat.

## Yayına alma

- `main` dalına gönderilen her işleme: **Denetim** (tür ve biçim denetimi, birim testleri, Docker görüntüsünün
  içinde derleme) → **Yayın** (sunucuya kurulum; ardından site dışarıdan sınanır: sayfalar, site haritasındaki bütün
  sayfalar, test raporları, PDF ve robots.txt). Sunucu ya da yayın betikleri (`sunucu/`, `yayin/`, Docker dosyaları,
  `prova.yml`) değişince **Kurulum provası** da çalışır; `yayin.yml` değişince çalışmaz.
- GitHub'ın ücretsiz aylık çalışma süresi (yaklaşık 2.000 dakika; site sahibinin bütün gizli depoları birlikte)
  her ayın 1'inde (00:00 UTC) yenilenir. Ekim 2026'da yalnızca bu depo ~1.770 dakika kullandı ve süre 30 Ekim'de
  bitti (iş akışları "recent account payments have failed or your spending limit needs to be increased" diyerek
  başlamadı; ödeme sorunu yoktu). Site sahibi ödeme yapamıyor: iş akışlarına süre artıran adım ya da gereksiz
  tetikleyici eklenmez; bu hata görülürse kod değiştirilmez, ayın 1'inden sonra `main`'e bir işleme gönderilir.
- Site sahibinin 2026-10-07 kararı: yeni testler ve yol haritaları hoca onayı beklenmeden doğrudan yayına alınır:
  `pilot` (özgün test; sitede güvenirlik kanıtının henüz olmadığı yazar) ya da `active` (kaynağı doğrulanmış ölçek).
  Hoca yayındaki siteyi inceler; istediği düzeltmeler yapılıp yayına alınır. `status: 'review'` (yalnızca doğrudan
  bağlantıyla açılır, listelerde ve site haritasında yoktur, arama motorlarına kapalıdır) yalnızca site sahibi
  isterse kullanılır. Test adlarında "tanı" sözcüğü kullanılmaz; bir testin adresi değişirse eski adres
  `next.config.ts` içinde kalıcı olarak yönlendirilir.
- Çalışmaların sonucu GitHub API'den özet uyarılarıyla (check-run annotations) okunur
  (`araclar/yayin-durumu.py`); çalışma kayıtları bu ortamdan indirilemez. `workflow_dispatch` bu ortamdan
  tetiklenemez: yeniden yayın için `main`'e bir işleme gönderilir. Site bu ortamdan açılamaz (vekil sunucu
  engeller); dış sınamayı Yayın iş akışı yapar.
- Sunucu: Hostinger VPS KVM 1, Almanya (Düsseldorf), `179.198.215.72`; alan adı `olcekhane.com` (Namecheap
  DNS, iki A kaydı). Ayarlar `yayin/ayarlar.env` dosyasındadır (gizli değildir). Gizli değerler yalnızca GitHub
  Secrets'ta durur (`ANA_SIFRE`, `SUNUCU_ROOT_SIFRE`); sohbette hiçbir zaman istenmez, yazılmaz, görülmez.

## Yeni test

- Örnek işlemeler: görev testi için `git show --stat 4610314` (Tepki Hızı), madde (anket) testi için
  `git show --stat 398d368 0711cf0` (Kişilerarası Tarz).
- Her testte: `src/content/instruments/<ad>.ts` (`status: 'pilot'` ya da `'active'`) ve `src/content/instruments/index.ts` kaydı,
  `src/content/reports/index.ts`, test sayfasının tanıtımı (`src/app/(site)/testler/[slug]/page.tsx`),
  `tests/<ad>.test.ts`.
- Görev testinde ayrıca: `src/lib/instruments/types.ts` ve `src/lib/instruments/<görev>.ts`,
  `src/lib/scoring/tasks.ts`, `src/lib/reports/build.ts`, `src/lib/reports/simple.ts` (ölçek öneklerinin düzenli
  ifadesi "Sonuçların" ile "Görevler" başlığını belirler), `src/lib/assessment/score-rows.ts`,
  `src/lib/assessment/schemas.ts`, `src/components/runner/tasks/<görev>.tsx` ve
  `src/components/runner/tasks/task-runner.tsx`, `tests/helpers/bodies.ts`, `src/lib/compare/tasks.ts` (önceki sonuçla
  karşılaştırılan sayılar).
- Madde testinde ayrıca: `src/content/reports/<ad>.ts`; yeni bir grafik türü gerekiyorsa
  `src/components/test/simple-report-view.tsx` ve `src/lib/pdf/simple-report.tsx`; `tests/evaluate.test.ts`;
  yetişkinlere de açıksa (`adults: true`) `tests/yetiskin.test.ts`.
- Sesli okuma (Okuma sekmesi, `engine: 'oral'`): yeni metin `src/content/instruments/sesli-okuma/sinif-*.ts`'e eklenir;
  kurallar (kelime sayısı, soru ve fikir düzeni, yazım) `tests/sesli-okuma.test.ts`'tedir. Metin özgündür, sınıfına
  göre yazılır ve eklenmeden önce bilgi doğruluğu ile soruların birbirini ele vermemesi denetlenir.
- Yeni test "Hangi test bana uygun?" sayfasında (`/hangi-test`) uygun yuvanın adaylarına yazılır
  (`src/content/test-secici.ts`; `tests/test-secici.test.ts` yayındaki her testin bir yuvada olduğunu denetler).
- Rapordaki kartlar, uyarılar ve kalite notları birbiriyle çelişmez: bütün durum birleşimleri `tests/<ad>.test.ts`
  içinde bir döngüyle tek tek denenir. Test telefon ve masaüstünde baştan sona çözülür; rapor ve PDF açılır.
- `.github/workflows/yayin.yml`: örnek cevaplarla bir rapor denetimi dış sınamaya eklenir; incelemede tutulan
  (`review`) testlerin adresleri `ONIZLEME`'dedir (`tests/yayin.test.ts` denetler). O adıma yeni `::notice` satırı eklenmez: GitHub adım başına
  10 not gösterir ve sondaki "Site dışarıdan sınandı" notu kaybolur.
- Hoca için ayrı bir inceleme belgesi yalnızca site sahibi isterse hazırlanır (2026-10-07 kararı; hoca yayındaki
  siteyi inceler). İstenirse Claude Docs'ta "<Test adı> İncelemesi" (bağlantılar DURUM.md'de; en yenisi örnek):
  inceleme adımları ve testin bağlantısı, görevin ya da maddelerin düzeni, yönergeler, puanlama, öğrenci ve veli
  rapor metinleri (bütün durumlar), bilim kartı, hocaya sorular, en sonda Onay tablosu (Kısım | Karar | Not; Karar
  sütunu açılır listedir: Onaylıyorum / Düzeltmeyle onaylıyorum / Onaylamıyorum). Belgedeki metinler sitedekilerle
  karşılaştırılarak birebir aynı olduğu doğrulanır. Claude Docs araçları yoksa site sahibine söylenir. Belgeyi
  hocaya site sahibi iletir; Claude paylaşmaz.
- Hocanın düzeltme istekleri gelince düzeltmeler yapılır ve yayına alınır; bir testin ya da metnin yayından
  kaldırılması istenirse ne yapılacağı site sahibine sorulur. Her durumda `DURUM.md` güncellenir.

## Rehber yazısı

- Her mesajda bir yazı; sıra `DURUM.md`'deki listededir (site sahibi başka bir konu isterse o yazılır).
- Dosya `src/content/rehber/yazilar/<adres>.ts` (dosya adı yazının adresidir), kayıt `src/content/rehber/index.ts`.
  Alanlar `src/content/rehber/types.ts`'te, örnekler önceki yazılardır; `tests/rehber.test.ts` alanları denetler.
- Bilgi yalnızca açılıp okunmuş kaynaklardan alınır; kaynaklar APA künyesi ve bağlantısıyla yazının sonundadır.
  Açılamayan bir sayfa zorlanmaz, başka kaynak kullanılır. Öğrenci ve veliye sade Türkçe: 3–4 ana fikir, `##`
  başlıklı gövde, ~155 karakterlik açıklama. Sağlıkla ilgili konuda `healthNotice: true`. Tanı koyan, korkutan ya
  da kesin hüküm veren dil kullanılmaz.
- Konu yayındaki bir yazıyla örtüşüyorsa o yazı tekrarlanmaz: konu derinleştirilir ve o yazıya bağlantı verilir.
- İlgili testler `relatedTests` ile verilir: yalnızca yayındakiler görünür, incelemedekiler onaydan sonra
  kendiliğinden görünür. Yazı yayına girince adresi: `https://olcekhane.com/rehber/<adres>`.

## Beyin Akademisi

- Nörobilim bölümü (site sahibinin 2026-10-08 istekleri; durum ve sıradaki ders `DURUM.md`'de): sıfırdan uzman
  düzeyine en büyük Türkçe beyin kaynağı; 8 bölüm, 100 ders, **her işlemede bir ders**, tek ölçüt kalite. Program ve
  hazır derslerin kaydı `src/content/beyin/index.ts`; her ders bir klasördür: `src/content/beyin/dersler/<bölüm>/<ders>/`
  (`index.ts`, `bolum-*.ts`, `sozluk.ts`, `sorular.ts`, `kaynaklar.ts`; türler `types.ts`; örnek ilk ders). Hazır olmayan ders programda "Hazırlanıyor" görünür, sayfası ve site haritası
  kaydı olmaz. Bölüm adresi değişirse eski adres `next.config.ts`'te kalıcı yönlendirilir.
- Ders standardı (site sahibinin isteği: öğrenciden profesöre, tıp ve beyin cerrahisi dahil, çok kapsamlı ve derin;
  örnek ilk ders): üç okuma katmanı **Temel** (meraklı herkes, lise), **Lisans** (tıp, nörobilim, psikoloji
  öğrencisi), **Uzman** (asistan hekim, beyin cerrahı, araştırmacı). Her blok `duzey` taşır (kutularda varsayılan
  `KUTU_DUZEYI`); okuyucu düzey seçer, üstündeki katmanlar, hedefler ve sorular gizlenir (hiçbir yere kaydedilmez).
  Kolay kullanım (site sahibinin 2026-10-08 isteği: ilk kez gelen neyin ne olduğunu hemen anlasın): ders Temel ile
  açılır; en başta "Sen kimsin?" kartları (`components/beyin/duzey.tsx`, `okuma-duzeyi.tsx`); ardışık Lisans/Uzman
  blokları bir grupta, kenarında düzeyin çizgisi (mavi Lisans, mor Uzman) ve başında adı; kutuların türü yalnızca üst
  kenar rengiyle gösterilir ve düzey renklerini kullanmaz (test denetler); her konunun sonunda gizli kalan kısım haber
  verilir; okurken ekranın altında düzey şeridi kalır; düzey değişince okunan yer kaymaz; düzey adreste durur
  (`?duzey=lisans|uzman`, paylaşılabilir; depo ya da çerez yok). Arayüzde "katman" değil "düzey" denir ("katman"
  anatomide ve modelde başka anlamda kullanılır).
  Temel anlatım tek başına tam olmalı ve en az bir sahne ile çizim içermeli. Kutular: Aklında kalsın, Biliyor muydun,
  Dikkat (temel); Derinleş, Klinik bağlantı, Sınav notu, Görüntülemede (lisans); Beyin cerrahisinde, Araştırma sınırı
  (uzman). Klinik vakalar (`vaka`: öykü, soru, çözüm; eğitim için kurgulanmıştır). Tablolar, birkaç üç boyutlu sahne ve
  hareketli çizim, sözlük, her düzeyde ~12 soru (doğru şıklar her düzeyde dağıtılır), metin içinde yazar-yıl atıfları
  ve sonda APA künyeleri (bağlantılı), ilgiliyse UÇEP 2020 Sinir–Davranış maddeleri ve öğrenme düzeyi (`ucep`). Bilgi
  açılıp okunmuş kaynaklardan alınır (rehber yazılarındaki kural); sade Türkçe, tıp terimi ilk geçtiği yerde Latince
  adıyla; doğrulanamayan bilgi derse girmez. Yayından önce dersi yazmamış ayrı bir ajan her sayıyı ve iddiayı
  kaynaklarla karşılaştırır; bulduğu yanlışlar düzeltilir. Kaynak erişimi: OpenStax, UTHealth, NINDS, MedlinePlus
  tarayıcı kimliğiyle; makaleler Europe PMC REST'ten (StatPearls özetleri dahil); NCBI ve CDC açılmaz.
  Sayfada "Uzman incelemesi bekliyor" yazar; uzman adları ve içerik lisansı site sahibine sorulmadan değiştirilmez.
  `tests/beyin.test.ts` program, katalog, model, sahneler, katmanlar, vakalar, tablolar ve soruları denetler.
- **Dil** (site sahibinin 2026-10-09 kalıcı isteği): Beyin Akademisi atlas ve ansiklopedi derinliğinde olur; nörobilim ve
  tıp profesörleri de yararlanabilmeli. Ama dil **her düzeyde, Uzman dahil, çok yalın ve sade**: herkes okuyunca anlayabilmeli.
  Derinlik bilgiden gelir, zor dilden değil. Kısa, tek fikirli cümleler (ortalama ~10–13 sözcük, 22'yi geçmez); her terim ilk
  geçtiği yerde sade Türkçeyle açıklanır, Latincesi parantezde; Latince eş anlamlı yığınları ve kısaltmalar açılır; Türkçesi
  olan yabancı sözcük kullanılmaz; sayılar anlamıyla birlikte verilir. Her ünite ve konu çok kapsamlı işlenir; zaman sınırı
  yoktur, kalite tek ölçüttür.
- **Derinlik** (site sahibinin 2026-10-09 kalıcı isteği): derinlik sınırı açık erişimli tam metinler ve ders kitaplarıyla
  aşılır; makale özetiyle yetinilmez. Kaynak yolları: Gray's Anatomy 1918 (kamu malı; tam metin archive.org
  `anatomyofhumanbo1918gray`, ayrıca Wikisource), OpenStax, LibreTexts'teki açık anatomi kitapları, Europe PMC'deki açık
  erişimli makalelerin tam metni (`fullTextXML`; 500 verirse dergi sayfası ya da başka kaynak), açık kılavuzlar (NICE vb.).
  Özet yalnızca tam metni bulunmayan kaynakta ve özette yazanla sınırlı kullanılır. Eski kitaptaki (Gray 1918) terim ve
  bilgiler güncel kaynakla (Terminologia Anatomica, güncel kitap ya da makale) karşılaştırılır; eskimiş bilgi derse girmez.
- **Kapsam** (site sahibinin 2026-10-09 kararı): bölüm **yalnızca beyni** anlatır: beyin ve onu oluşturan bütün yapılar,
  ne işe yaradıkları, beynin nasıl çalıştığı ve nasıl öğrendiği; nörobilim ve tıp öğrencisinden profesöre, öğretmenden
  beyin cerrahına herkesin başvuracağı, Türkiye'de eşi olmayan bir beyin atlası ve ansiklopedisi. **Kafatası işlenmez:**
  iki kafatası dersi yayından kaldırıldı (klasörleri `dersler/anatomi/kafatasi*`, `noktalar.ts` ve kafatası çizimleri
  depoda saklı; eski adresler ilk derse geçici yönlenir; site sahibi isterse geri gelir). Kol ve bacak sinirleri,
  dermatomlar programdan çıktı; omurilik ve çıkan-inen yollar beyni anlamak için kalır. Büyük konular gerekirse birkaç
  derse bölünür. Ayrı bir beyin cerrahisi bölümü eklenmez; site sahibi en son karar verecek.
- Üç boyutlu model: BodyParts3D 4.0 (CC BY 4.0, atıf `components/beyin/model-notu.tsx`'te). Yapı kataloğu
  `src/content/beyin/yapilar.ts` (Türkçe ad, Latince ad, bölge, lob, paket, parça dosyaları, görev). Yeni yapı
  eklenince `node araclar/beyin-modeli.mjs` çalıştırılır: arşivi indirip SHA-256 ile doğrular, yalnızca katalogdaki
  parçaları sıkıştırıp `public/beyin/model/<sürüm>/`'e yazar (git'e girer, ~2,5 MB) ve `model-surum.ts`'i günceller.
  Paketler: kabuk, beyaz, derin, sap, karincik (koroid pleksus dahil), zar (beyincik çadırı), damar, kemik (beyin kutusunun
  8 kemiği), yuz (yüz kemikleri, dil kemiği, atlas, aksis) ve omurga (C3–L5 omurları, sağrı kemiği, omurlar arası diskler).
  Yalnızca bir yarısı modellenmiş yapı katalogda `<parça>~ayna` ile aynalanır (beyincik çadırı); araç aynalanan yarıyı
  orta hatta asıl yarıya birleştirir ve `AYNA_ENGEL`'deki yapının (sol beyincik) üstüne kaldırır; model notu bunu söyler. Modelde omurilik, omurilik
  sinirleri ve kafatası dışındaki sinirler yoktur; bunlar çizim ve tabloyla anlatılır. Kemik paketleri kamera çerçevesine ve kesit sınırına girmez; yalnızca kemik yüklü sahnede
  kesit kemiklerin kutusuna göre konur. Bütün sahneyi (kemikler dahil) çerçevelemek için görünenler `vurgula`ya da yazılır.
- Çizici `components/beyin/motor.ts` (three.js; sayfada tek WebGL bağlamı, tuval en çok görünen sahneye taşınır,
  kare yalnızca bir şey değişince çizilir), sahne kutusu `beyin-sahnesi.tsx`, iki boyutlu hareketli çizimler
  `components/beyin/animasyonlar/` (hareketi azaltmayı seçenlerde adım adım). Sahne ayarı (`Sahne`): paketler,
  göster/gizle/vurgula/saydam seçicileri, renk, sahneye özel boya (`boya`), etiketler, bakış, yarım küre, kesit,
  ayrıştırma (her şeyi dağıtır; yalnızca kemikleri ayırmaz). Etiketli sahne dönmez. Etiket noktası yapının görünen
  yüzündeki bir köşedir; kesitle kaldırılan ya da önü kapalı noktanın etiketi gizlenir.
- Kemik işaret noktaları (çıkıntı ucu, delik ağzı, çukur, köşe): `src/content/beyin/noktalar.ts` (model koordinatı, mm),
  sahnede `noktalar`. Yeni nokta modelin kemik ağı üzerinde ölçülür ve iki bakıştan çizilip denetlenir; ağda görünmeyen
  yapı işaretlenmez, metinde anlatılır (site sahibine söz: yeri tam doğru konamayan nokta açıkça söylenir). Test her
  noktanın kendi kemiğinin yüzeyinde olduğunu denetler. Sahnenin bakışından görünmeyen nokta kullanılmaz. Etiket
  yazılarının yeri `components/beyin/etiket-duzeni.ts`: yazılar noktaların ve birbirinin üstüne binmez.
- Etkileşimli deneme: `tarayiciAc()` ile açılan Chromium'a WebGL için `--use-gl=angle --use-angle=swiftshader
  --enable-unsafe-swiftshader` verilir; her sahne kutusunun ekran görüntüsü alınıp gözle denetlenir.

## Değişmez ilkeler

- Hiçbir veri saklanmaz: veritabanı, hesap, çerez, tarayıcı deposu ve analiz aracı yoktur; test cevapları
  kaydedilmez ve günlüğe yazılmaz (`tests/site.test.ts` bunu denetler). Bu ilkeyi bozacak bir istek gelirse
  önce site sahibine ne değişeceği anlatılır; kabul ederse hukuki metinler de aynı değişiklikte güncellenir.
- Sesli okumada ses kaydı yalnızca kullanıcının cihazında kalır: sunucuya ya da dış bir hizmete gönderilmez.
  Otomatik analizde (site sahibinin 2026-10-07 isteği) kayıt, öğrenci "Evet, analiz et" dedikten sonra yalnızca
  cihazda, tarayıcıda çalışan konuşma tanıma modeliyle yazıya dökülür ve analiz bitince bellekten silinir; model
  dosyaları kendi sunucumuzdan iner, tarayıcı deposuna hiçbir şey yazılmaz. Mikrofon izni yalnızca sitenin kendisine
  açıktır (`next.config.ts`).
- Sitedeki metinler gerçeği söyler: sunucu Almanya'dadır; Türkiye normu olmayan testte norm varmış gibi
  anlatılmaz; yapılmamış çalışmalar yapılıyormuş gibi yazılmaz.
- Hukuki metinler `src/content/legal`, site sahibinin bilgileri `OWNER_*` (`src/lib/site.ts`). Bilgiler henüz
  girilmedi; site, sahibinin kararıyla `SAHIP_BILGILERI_SONRA=true` ile arama motorlarına açık. Bilgiler
  gelince `yayin/ayarlar.env`'e yazılır ve bu satır silinir.
- Ödeme, şifre ve hesap işlemlerini (Hostinger, Namecheap, GitHub Secrets, Google) yalnızca site sahibi yapar.
  Bilgisayar kullanan başka bir Claude sohbetine ("Computer 100") verilecek promptlarda şifreler o sohbete de
  gösterilmez: sayfayı o hazırlar, değeri site sahibi yazar.
- Sohbete yanlışlıkla bir şifre, anahtar ya da erişim belirteci yazılırsa hiçbir dosyaya, işlemeye, git ayarına
  ya da belleğe yazılmaz ve tekrarlanmaz; site sahibine onu değiştirmesi söylenir. Şifre içeren notlar ve
  belgeler açılmaz.
- Bu depo ve buradaki işler yalnızca olcekhane.com içindir; site sahibinin başka sitelerine ve hesaplarına
  dokunulmaz.
- Açık hukuki işler: Hostinger ile KVKK standart sözleşmesi ve Kurula bildirim, metinlerin avukat kontrolü,
  e-posta sağlayıcısının aydınlatma metninde anılması.

## Sesli okumada otomatik analiz

- Site sahibinin isteği (2026-10-07): öğrenci kendisi okur, **yetişkin kaydı dinlemez** (öğrenci mahremiyeti); okuma
  bitince "Okumanı analiz etmemizi ister misin?" sorulur, "Evet" denince sistem kaydı kendisi inceler ve rapor verir;
  hiçbir şey saklanmaz; öncelik doğruluktur. Aylık ek sunucu ücreti istemediği için analiz öğrencinin cihazında yapılır.
- Şimdilik yalnızca önizleme bağlantısıyla açılır: `/testler/sesli-okuma-degerlendirmesi/coz?onizleme=otomatik`
  (yetişkinin dinleyip işaretlediği sürüm herkese açık kalır; site sahibi onaylayınca otomatik sürüm varsayılan olur).
- Parçalar: ortak türler ve sabitler `src/lib/oral/auto.ts`; model Whisper small (`onnx-community/whisper-small_timestamped`,
  q8, ~250 MB, sabit sürüm ve SHA-256: `araclar/model-hazirla.mjs`, Docker'da ayrı katman; `public/model|ort|vendor`
  git'e girmez; büyük dosyalar HTTP önbelleğine sığsın diye 8 MiB'lık parçalar hâlinde sunulur, liste `parcalar.json`);
  Worker `public/okuma/analiz-isci.js` (yalnızca WebAssembly, ipucu/prompt yok, 28 sn'lik pencereler, uydurma ve döngü
  önlemleri, parçaları birleştiren `env.fetch`, transformers.js 4.3.0'ın kısa seste kelime zamanlarını kaydıran hatasının
  düzeltmesi `fixWordTimes`) ve istemcisi `src/components/runner/oral/asr-client.ts`; metinle karşılaştırma
  `src/lib/oral/align.ts` (`tests/sesli-okuma-hizalama.test.ts`); öğrenci akışı `oral-auto-runner.tsx`, `mic-check.tsx`,
  `auto-analysis.ts`; puanlama ve rapor `auto: true` ile (`tests/sesli-okuma.test.ts`).
- Doğruluk ilkesi: konuşma tanıma hatası çocuğun hatası sayılmaz. Şüpheli yerler kısa parçalar hâlinde yeniden
  yazıya dökülüp doğrulanır; doğrulanmayan ya da tek harf farkı olan kelime "net anlaşılamadı" (`unclear`) olur, hata
  sayılmaz. Okuma metinle eşleşmezse (tanınan kelimelerin %30'undan azı metinde) ya da kelimelerin %30'undan çoğu net
  anlaşılamazsa rapor verilmez, yeniden okuma istenir (cevaplar korunur, sorular yeniden sorulmaz). Gürültülü kayıtta
  ek farkı ve benzer kelime hata sayılmaz. Mikrofon denemesinde asıl ölçüt yapay zekânın cümleyi tanımasıdır (site
  sahibinin 2026-10-08 isteği: kuş, iş makinesi, tadilat sesi olan ortamda da çalışmalı): gürültü, kısıklık ve
  sessizlik ölçümü engellemez, yalnızca anlaşılmazsa ne yapılacağını söyler; ses 90 Hz'in altı süzülerek incelenir.
- Test sayfası çok iş parçacığı için COEP ile açılır (`next.config.ts`); model ve çalışma dosyaları sürümlü adreslerle
  süresiz HTTP önbelleğinde tutulur. Denetim ve Yayın, dosyaların sunulduğunu ve COEP başlığını dışarıdan sınar.
- Gerçek çocuk kayıtlarıyla doğruluk ölçümü henüz yapılmadı (ölçümler sentetik ses ve yetişkin FLEURS kayıtlarıyla);
  site sahibi izinli kayıt sağlayınca ölçülür. Aydınlatma metni (sürüm 7) avukat kontrolü bekliyor.

## Görsel dil

- Tanıtım sayfaları (`src/app/(site)`) "canlı şekil" dilini kullanır: beş kişilik boyutunun renkleri
  (`--dim-*`, `src/app/globals.css`), yuvarlak düğmeler, cam paneller, kaydırınca belirme (`data-reveal`),
  eğilen kartlar (`data-tilt`) ve mıknatıs düğmeler (`data-magnet`). Efektler tek yerdedir
  (`components/site/site-effects.tsx`) ve hareketi azaltmayı seçenlerde kapanır.
- Açılıştaki üç boyutlu şekil kütüphanesiz, doğrudan WebGL ile çizilir (`components/persona`); WebGL yoksa
  CSS ile çizilmiş yedek şekil görünür. Kaydırıcılar "oyun, ölçüm değil" diye anlatılır ve hiçbir yere
  kaydedilmez.
- Test çözme ve rapor ekranları (`src/app/(test)`) sade kalır; hareketli efektler oraya taşınmaz. Rapordaki üç
  boyutlu profil grafiği (`lib/charts/bars3d.ts`; ekranda ve PDF'te aynı hesap) yalnızca kişi sürükleyince ya da
  düğmeye basınca döner. Tayf renkleri bir boyutu ya da alanı tanıtır; puan, iyi ya da kötü anlamı taşımaz.
- Kart grafikleri (site sahibinin 2026-10-22 kalıcı isteği): raporda her başlık sözel açıklamanın yanında grafikle de
  anlatılır. Kartın grafiği (`SimpleItem.visual`) ortak geometriyle ekranda (`components/report/item-visual.tsx`; telefonda
  başlığın altında, geniş ekranda açıklamanın yanında) ve PDF'te aynı çizilir (`lib/reports/visuals.ts`): ölçek kartında
  düzey çubuğu (testin kendi eşikleriyle Düşük–Orta–Yüksek bölgeleri, kişinin bölgesi vurgulu), ölçekleri birlikte anlatan
  kartta yan yana grafik. Bölgeler tek tonludur (iyi ya da kötü çağrışımı yoktur). Yeni testte her kartın grafiği olur;
  anket testlerinde `tests/kart-grafikleri.test.ts` denetler (grafik rozetteki düzeyle ve genel bakıştaki puanla aynıdır,
  yazılar taşmaz). Görev testlerinde grafik verinin türüne göre seçilir (düzeylere göre doğrular, ulaşılan düzey, türler,
  yanılgılar, süreler, dizi merdiveni; geometri `lib/reports/visual-draw.ts`); yeni görev testi `tests/helpers/task-variants.ts`'e
  birkaç sonuç örüntüsüyle eklenir ve `tests/gorev-grafikleri.test.ts` her kartı dener. "Yorumlanmadı" ya da hesaplanamayan
  kartın grafiği olmaz; kartın metnindeki sayılar grafikte olduğu için metinde yinelenmez. Görev testlerinin kalan grupları
  `DURUM.md`'de.

## Paylaşım kartı

- Site sahibinin 2026-10-30 isteği: sonuçlar Instagram hikâyesinde ve WhatsApp durumunda paylaşılabilsin. Raporda
  "Sonucunu paylaş" bölümü: 1080 × 1920'lik görsel yalnızca tarayıcıda çizilir (`lib/share/draw.ts`), sunucuya gitmez,
  saklanmaz; telefonda paylaşım ekranı, her yerde indirme. Görselde ad yazmaz; testin adresi yazar.
- Kart yalnızca kişiliği betimleyen ve ilgileri ya da değerleri sıralayan testlerde ve Kendini Tanı
  Paketi'nde olur (site sahibinin seçimi; pakette yalnızca kişilik ve ilgi bloğu). Zihinsel görev, okuma, matematik ve "yüksek daha iyi" diye okunabilen ölçeklerde kart yoktur
  (çocuklar arasında kıyas ve alay olmasın). Yeni anket testi `lib/share/card.ts`'te ya `SHAREABLE`'a ya nedeniyle
  `NOT_SHAREABLE`'a yazılır (`tests/paylasim.test.ts` denetler). Veli sekmesinde kart gösterilmez.

## Gelişimini karşılaştır

- Site sahibinin 2026-10-30 isteği: kişi aynı testi daha sonra yeniden çözünce önceki sonucuyla karşılaştırabilsin.
  Anket testlerinin raporu ölçek ölçek puan, aralık, düzey ve (yalnızca α ile başvuru standart sapması bilinen ölçeklerde)
  ölçüm payı taşır (`SimpleReport.compare`, `lib/assessment/evaluate.ts`). İndirilen PDF'in belge bilgilerine (anahtar
  sözcükler) bunun küçük özeti yazılır (`lib/compare/record.ts`; paket PDF'inde paketteki anket ve görev testlerinin hepsi).
  Raporda "Önceki sonucunla karşılaştır" (`components/test/compare-panel.tsx`; tek testte ve pakette): eski PDF seçilir, dosya
  yalnızca tarayıcıda okunur, hiçbir şey gönderilmez ve saklanmaz. Değişim, güvenilir değişim ölçütüyle (|fark| / (√2·SEM)
  ≥ 1,96; Jacobson ve Truax, 1991) "belirgin" ya da "ölçüm payı içinde" diye söylenir; ölçüm payı bilinmeyen ölçekte
  yalnızca yön. Başka test ya da başka sürüm karşılaştırılmaz (test sürümü artınca eski PDF'ler karşılaştırılamaz).
  Görev (zekâ ve dikkat) testlerinde (2026-10-31'den) raporda yazan ana sonuçlar karşılaştırılır: doğru sayısı ya da
  oranı, ulaşılan düzey, en uzun dizi, tipik süre (`lib/compare/tasks.ts`, `TASK_COMPARE`). Sayılar raporun kendi
  yardımcılarıyla (`pctValue`, `snValue`, `secondsValue`, `sgPct`, `arithPct`, `towerTenths` …, `lib/reports/build.ts`)
  hesaplanır ve raporla aynı yazılır ("18/24", "%88", "0,73 sn", "1 dk 15 sn", "8,2 derece"; sürelerde "uzadı/kısaldı").
  Kart yorumlanmadıysa sayısı özete yazılmaz: kartı kuran işlev "Yorumlanmadı", hesaplanamadı ya da sonucun rastgele
  cevaplarla da çıkabileceğini yazdığı yerde `interpreted: false` verir (yeni kartta da). Dökümler ve fark puanları
  (renk-kelime etkisi, kural değiştirme gibi) karşılaştırılmaz; zihinden hesaplamada toplamlar yalnızca dört bölüm de
  yorumlandıysa. Ölçüm payı bilinmediği için yalnızca yön; testi yeniden çözmenin sonucu yükseltebileceği (Scharfen ve
  ark., 2018) ve aynı soruların geldiği testlerde hatırlananların da etkileyebileceği söylenir. Anahtarlar ve anlamları
  kalıcıdır (eski PDF'lerle eşleşir): bir sayının anlamı, birimi ya da yuvarlaması değişirse testin sürümü artırılır; test
  tablonun kopyasını tutar. Yeni görev testi `TASK_COMPARE`'e yazılır. Okuma, sesli okuma ve konu tarama testlerinde yok
  (form ve metin sınıfa göre değişir). `tests/karsilastirma.test.ts` denetler (her sayı kendi kartında aynı biçimde yazar).

## Kendini Tanı Paketi

- Site sahibinin 2026-10-30 isteği ve seçimleri: kişilik, ilgi, çalışma alışkanlıkları ve dört zihinsel beceri (akıl yürütme,
  sözel, uzamsal, bellek) testi art arda, tek oturumda (geniş paket, yaklaşık bir saat); sonunda başta kısa bir özet, ardından
  her testin kendi raporu ve yol haritası, tek PDF (`/api/paket/pdf`). Özet testleri birbirine bağlayan yeni bir yorum
  eklemez: her satırı testin kendi raporunda aynen yazar (`lib/reports/package.ts`; `tests/paket.test.ts` denetler).
- Testler sınıfa göre `content/paket.ts`'teki yuvaların adaylarından seçilir (sınıfa uygun ilk yayındaki test); paket 5.
  sınıftan yetişkine açıktır. Yalnızca anket ve görev testleri pakete girer. Bir yuvaya test eklenecekse ya da paket
  değişecekse site sahibine sorulur; süre 45–75 dakika arasında kalır (test denetler).
- Hiçbir şey saklanmaz: cevaplar ve raporlar yalnızca açık sayfada durur; ayrılmadan önce paketin kendi uyarısı çıkar
  (`useLeaveWarning`'in önceliği; birden çok uyarı etkinse tek soru sorulur). Sayfalar: tanıtım `/kendini-tani-paketi`
  (site haritasında), çözme `/kendini-tani-paketi/coz` (arama motorlarına kapalı). Tanıtım kutusu Testler sayfasında ve
  paketin açık olduğu yaş grubu sayfalarındadır (`components/site/package-promo.tsx`).

## Gelişim yol haritası

- Raporun sonundaki öneri bölümleri: üç boyutlu profil, kısaca, nasıl çalışabilir, rahat edilebilecek ortamlar,
  (veliye) yaklaşım önerileri, dört haftalık küçük adımlar, kaynaklar. Metinler `src/content/roadmaps/<ad>.ts`
  (kayıt `index.ts`), kurulum `src/lib/reports/roadmap.ts`, ekran `components/test/roadmap-view.tsx`, PDF
  `lib/pdf/simple-report.tsx`; `tests/roadmap.test.ts` bütün düzey birleşimlerini dener.
- İlgi testlerinde (`INTEREST_ROADMAPS`) yol haritası ilgilerin keşfidir: raporun öne çıkardığı alanlar için keşif
  önerileri, (Holland profilinde) eğitim yolları, veliye yaklaşım ve haftalık denemeler. Kurulum
  `src/lib/reports/interest-roadmap.ts`, denetim `tests/ilgi-yol-haritasi.test.ts`. Öneriler meslek seçmez.
- Konu tarama (`ACADEMIC_ROADMAPS`), okuma (`READING_ROADMAPS`) ve zihinsel görev (`TASK_ROADMAPS`) yol haritaları
  kendi kurulumlarındadır (`lib/reports/academic-roadmap.ts`, `reading-roadmap.ts`, `task-roadmap.ts`); denetim
  `tests/beceri-yol-haritasi.test.ts`. Kaynaklar `src/content/roadmaps/kaynaklar.ts`'teki, sitede zaten kullanılan
  kaynaklardır. Zihinsel görevlerde puanı yükseltme ya da "beyni çalıştırma" vaadi verilmez.
- Yeni yol haritası doğrudan yayına alınır (2026-10-07 kararı). Site sahibi isterse önce `ROADMAP_IN_REVIEW`'a
  konur: yalnızca `/testler/<adres>/coz?onizleme=yol-haritasi` bağlantısıyla görünür. Hoca belgesi istenirse
  "<Test adı> Gelişim Yol Haritası İncelemesi" hazırlanır (metinler içerik dosyasından üretilip belgeyle
  karşılaştırılır).
- Etkili çalışma yöntemleri herkes için aynı anlatılır; kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
  Ortamlar meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir.

## Yaş grupları ve yol gösterme

- Siteye giren kişi önce grubunu seçer: İlkokul 1–2 (1–2. sınıf; değerlendirmeyi öğretmen ya da veli yapar, sayfa
  yetişkine "siz" diye seslenir: `adultLed`), İlkokul 3–4 (3–4. sınıf), Ortaokul (5–8), Lise ve mezun (9–12 ve
  mezun), Üniversite ve yetişkin (18+). Gruplar `src/content/age-groups.ts`'te, sayfaları `src/app/(site)/<grup>`'tadır.
  Yeni test sınıf aralığına göre gruplarda kendiliğinden görünür; "Nereden başlamalı?" önerisi gerekiyorsa grubun
  `starters` listesine eklenir; öneriler grubun bütün sınıflarına açık olmalıdır (`tests/age-groups.test.ts` denetler).
  Yayında testi olmayan grup açılmaz, listelenmez.
- Her sayfanın başında yol gösterici kutu (`PageGuide`, `components/site/page-guide.tsx`) bulunur: sayfada ne
  yapılacağı ve sıradaki adım. Yeni sayfa eklenirken kutusu da eklenir; `tests/age-groups.test.ts` denetler.
- Zihinsel beceri alanının adı "Zekâ ve zihinsel beceriler"dir; zekâ puanı (IQ) verilmez, her beceri ayrı anlatılır.
- "Hangi test bana uygun?" (`/hangi-test`, site sahibinin 2026-10-30 isteği): kim çözecek, ne öğrenilmek isteniyor
  (birden çok alan) ve vakit seçilir; her alanın yuvalarından sınıfa uygun ve süreye sığan testler dönüşümlü önerilir
  (`lib/test-secici.ts`), uygunsa Kendini Tanı Paketi de. Hesap tarayıcıda, yalnızca testlerin adı, süresi ve sınıf
  aralığıyla yapılır; seçimler kaydedilmez. Bağlantıları Testler sayfasında ve ana sayfada.

## Git

- İşlemeler ortamın varsayılan kimliğiyle (Claude, noreply@anthropic.com) ve imzalı yapılır; `-c user.*` ile
  kimlik değiştirilmez. Mesajın sonuna sistemin verdiği atıf satırları eklenir.
- `main`'e zorla gönderim (force push) yapılmaz.
- Site sahibi aynı anda birden çok sohbetle çalışabilir. Göndermeden hemen önce `git pull --rebase` yapılır;
  çakışmada iki değişiklik de korunur. Hangisinin geçerli olacağı belli değilse gönderilmez: iki sohbetin aynı
  yeri değiştirdiği sade Türkçeyle anlatılır ve hangisinin kalacağı site sahibine sorulur.
