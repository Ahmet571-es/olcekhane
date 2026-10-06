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
     gizli değer eksik, site dışarıdan açılmıyor) kodu değiştirme, site sahibine sade dille anlat. İki düzeltme
     denemesinden sonra hâlâ başarısızsa değişikliği `git revert` ile geri al, gönder, doğrula ve durumu anlat.
   - 2 ya da Bash zaman aşımı: henüz bitmedi; aynı komutu yeniden çalıştır (en çok 3 kez, sonra durumu anlat).
   - 3: bu işleme için sonuç alınamadı (GitHub'a ulaşılamadı, işleme `main`'de değil ya da çalışması daha yeni bir
     gönderim yüzünden durduruldu); SONUÇ satırındaki komutu çalıştır.

   Denetim yaklaşık 3, Yayın 2, Kurulum provası 4 dakika sürer. Denetim'den geçmeyen işleme yayına alınmaz; canlı
   site bir önceki sürümde kalır.
6. **Raporla:** Sade Türkçe ve kısa yaz: ne değişti, canlıda nereden görülür (tam adres; incelemedeki testte
   doğrudan bağlantı), site sahibinin yapması gereken bir şey varsa o. Kod, dosya adı ve İngilizce terim kullanma;
   yapılmayan işi yapılmış, doğrulanamayanı doğrulanmış gibi anlatma. `DURUM.md`'deki bekleyen işleri yalnızca o
   anki işle ilgiliyse ya da tarihi yaklaştıysa hatırlat.

## Yayına alma

- `main` dalına gönderilen her işleme: **Denetim** (tür ve biçim denetimi, birim testleri, derleme, Docker
  görüntüsü) → **Yayın** (sunucuya kurulum; ardından site dışarıdan sınanır: sayfalar, site haritasındaki bütün
  sayfalar, test raporları, PDF ve robots.txt). Sunucu ya da yayın dosyaları değişince **Kurulum provası** da
  çalışır.
- Yeni bir test önce `status: 'review'` (uzman incelemesinde) olarak yayına alınır: yalnızca doğrudan
  bağlantıyla açılır, listelerde ve site haritasında yoktur, arama motorlarına kapalıdır. Hoca onaylayınca
  `active` (kaynağı doğrulanmış ölçek) ya da `pilot` (özgün test) yapılır. Test adlarında "tanı" sözcüğü kullanılmaz;
  bir testin adresi değişirse eski adres `next.config.ts` içinde kalıcı olarak yönlendirilir.
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
- Her testte: `src/content/instruments/<ad>.ts` (`status: 'review'`) ve `src/content/instruments/index.ts` kaydı,
  `src/content/reports/index.ts`, test sayfasının tanıtımı (`src/app/(site)/testler/[slug]/page.tsx`),
  `tests/<ad>.test.ts`.
- Görev testinde ayrıca: `src/lib/instruments/types.ts` ve `src/lib/instruments/<görev>.ts`,
  `src/lib/scoring/tasks.ts`, `src/lib/reports/build.ts`, `src/lib/reports/simple.ts` (ölçek öneklerinin düzenli
  ifadesi "Sonuçların" ile "Görevler" başlığını belirler), `src/lib/assessment/score-rows.ts`,
  `src/lib/assessment/schemas.ts`, `src/components/runner/tasks/<görev>.tsx` ve
  `src/components/runner/tasks/task-runner.tsx`, `tests/helpers/bodies.ts`.
- Madde testinde ayrıca: `src/content/reports/<ad>.ts`; yeni bir grafik türü gerekiyorsa
  `src/components/test/simple-report-view.tsx` ve `src/lib/pdf/simple-report.tsx`; `tests/evaluate.test.ts`;
  yetişkinlere de açıksa (`adults: true`) `tests/yetiskin.test.ts`.
- Rapordaki kartlar, uyarılar ve kalite notları birbiriyle çelişmez: bütün durum birleşimleri `tests/<ad>.test.ts`
  içinde bir döngüyle tek tek denenir. Test telefon ve masaüstünde baştan sona çözülür; rapor ve PDF açılır.
- `.github/workflows/yayin.yml`: yeni adres `ONIZLEME`'ye, örnek cevaplarla bir rapor denetimi dış sınamaya
  eklenir (`tests/yayin.test.ts` ONIZLEME'yi denetler). O adıma yeni `::notice` satırı eklenmez: GitHub adım başına
  10 not gösterir ve sondaki "Site dışarıdan sınandı" notu kaybolur. yayin.yml değişince Kurulum provası da çalışır.
- Hoca için Claude Docs'ta "<Test adı> İncelemesi" belgesi hazırlanır (bağlantılar DURUM.md'de; en yenisi örnek):
  inceleme adımları ve testin bağlantısı, görevin ya da maddelerin düzeni, yönergeler, puanlama, öğrenci ve veli
  rapor metinleri (bütün durumlar), bilim kartı, hocaya sorular, en sonda Onay tablosu (Kısım | Karar | Not; Karar
  sütunu açılır listedir: Onaylıyorum / Düzeltmeyle onaylıyorum / Onaylamıyorum). Belgedeki metinler sitedekilerle
  karşılaştırılarak birebir aynı olduğu doğrulanır. Claude Docs araçları yoksa site sahibine söylenir. Belgeyi
  hocaya site sahibi iletir; Claude paylaşmaz.
- Hocanın kararı gelince: "Onaylıyorum" → `status` `active` ya da `pilot` olur, adres `ONIZLEME`'den çıkar.
  "Düzeltmeyle onaylıyorum" → düzeltmeler yapılır, belge güncellenir, sonra aynı şekilde yayına alınır.
  "Onaylamıyorum" → test incelemede kalır; ne yapılacağı site sahibine sorulur. Her durumda `DURUM.md` güncellenir.

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

## Değişmez ilkeler

- Hiçbir veri saklanmaz: veritabanı, hesap, çerez, tarayıcı deposu ve analiz aracı yoktur; test cevapları
  kaydedilmez ve günlüğe yazılmaz (`tests/site.test.ts` bunu denetler). Bu ilkeyi bozacak bir istek gelirse
  önce site sahibine ne değişeceği anlatılır; kabul ederse hukuki metinler de aynı değişiklikte güncellenir.
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

## Görsel dil

- Tanıtım sayfaları (`src/app/(site)`) "canlı şekil" dilini kullanır: beş kişilik boyutunun renkleri
  (`--dim-*`, `src/app/globals.css`), yuvarlak düğmeler, cam paneller, kaydırınca belirme (`data-reveal`),
  eğilen kartlar (`data-tilt`) ve mıknatıs düğmeler (`data-magnet`). Efektler tek yerdedir
  (`components/site/site-effects.tsx`) ve hareketi azaltmayı seçenlerde kapanır.
- Açılıştaki üç boyutlu şekil kütüphanesiz, doğrudan WebGL ile çizilir (`components/persona`); WebGL yoksa
  CSS ile çizilmiş yedek şekil görünür. Kaydırıcılar "oyun, ölçüm değil" diye anlatılır ve hiçbir yere
  kaydedilmez.
- Test çözme ve rapor ekranları (`src/app/(test)`) sade kalır; hareketli efektler oraya taşınmaz. Tayf
  renkleri bir boyutu ya da alanı tanıtır; puan, iyi ya da kötü anlamı taşımaz.

## Git

- İşlemeler ortamın varsayılan kimliğiyle (Claude, noreply@anthropic.com) ve imzalı yapılır; `-c user.*` ile
  kimlik değiştirilmez. Mesajın sonuna sistemin verdiği atıf satırları eklenir.
- `main`'e zorla gönderim (force push) yapılmaz.
- Site sahibi aynı anda birden çok sohbetle çalışabilir. Göndermeden hemen önce `git pull --rebase` yapılır;
  çakışmada iki değişiklik de korunur. Hangisinin geçerli olacağı belli değilse gönderilmez: iki sohbetin aynı
  yeri değiştirdiği sade Türkçeyle anlatılır ve hangisinin kalacağı site sahibine sorulur.
