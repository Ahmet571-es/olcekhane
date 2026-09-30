# Ölçekhane

Öğrenciler için bilimsel test platformu: kişilik, ilgi, çalışma alışkanlıkları, okuma, matematik, dikkat ve
çalışma belleği. Testler hesap açmadan ve ücretsiz çözülür; öğrenci ve veli için iki ayrı rapor ekranda
gösterilir ve PDF olarak indirilir. Her testin bilimsel dayanağı, güvenirliği ve sınırlılıkları test
sayfasındaki bilim kartında ve raporda açıkça yazar.

**Hiçbir veri saklanmaz.** Sitede veritabanı, hesap, iletişim formu ve çerez yoktur. Cevaplar yalnızca test
sayfasında durur; test bitince tek istekte sunucuya gelir, puanlanır ve rapor geri döner. Hiçbir şey diske
ya da günlüğe yazılmaz (`src/lib/assessment`, `src/app/api/rapor`). Sunucuda uygulama kapsayıcısı salt okunur
çalışır, takas alanı ve bellek dökümleri kapalıdır, Caddy isteklerle ilgili hiçbir şey günlüğe yazmaz. `tests/site.test.ts`
bu sözü bozacak kodu (veritabanı ya da e-posta kitaplığı, dosyaya yazma, çerez, tarayıcı deposu, günlüğe
istek yazma) ve bu gerçekle çelişen site metinlerini yakalar.

Bu belge geliştiriciler içindir. Sunucuya kurulum için **[yayin/REHBER.md](yayin/REHBER.md)** (GitHub ile
otomatik) ya da **[KURULUM.md](KURULUM.md)** (elle) dosyasına bakın.

## Neler var?

- **Testler:** Beş Faktör Kişilik Profili, Öz-saygı Ölçeği (Rosenberg), Mesleki İlgi Profili (RIASEC),
  Çalışma Alışkanlıkları Envanteri, Okuma Hızı ve Anlama, Matematik Tanı Testi (5–8. sınıf, hata türü
  analiziyle), Dikkat ve Çalışma Belleği Görevleri, Sürekli Dikkat: Harf İşaretleme. Test tanımları kodda
  sürümlüdür (`src/content/instruments`); puanlama sunucuda yapılır, cevap anahtarı tarayıcıya gönderilmez.
- **Ücretsiz rapor:** öğrenci ve veli için ayrı dille yazılmış basit rapor (teste uygun tek grafik, her
  ölçek için düzey ve yorum), ekranda ve PDF olarak (`@react-pdf/renderer`, yazı tipleri `src/assets/fonts`).
- **Rehber yazıları** (`src/content/rehber`), bilimsel yaklaşım ve veliler için sayfaları.
- **Kapsamlı rapor görünümü** (`src/components/report`): ileride ücretli sunulacak kapsamlı rapor için
  hazır bileşenler; şu an hiçbir sayfada kullanılmıyor.

## Teknoloji

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, zod, three.js (tanıtım sayfalarındaki 3B
sahne), `@react-pdf/renderer`. Üretimde Docker ve Caddy (HTTPS). Veritabanı yoktur.

Sayfalar istek anında üretilir: site adresi (`APP_URL`), dizine ekleme ayarı (`ALLOW_INDEXING`) ve site
sahibinin bilgileri (`OWNER_*`, bkz. `src/lib/site.ts`) sunucu çalışırken ortam değişkenlerinden okunur. Derleme için `.env` gerekmez;
yalnızca paylaşım görselleri derlemede üretilir.

```
src/app          sayfalar: (site) tanıtım sayfaları, (test) test çözme ekranı (/testler/[slug]/coz),
                 api/rapor puanlama ve PDF, api/saglik sağlık denetimi
src/content      test tanımları, rapor metinleri, rehber yazıları, hukuki metinler
src/lib          puanlama, rapor üretimi, PDF, bellekteki hız sınırı
src/components   test ekranları (runner), rapor görünümleri, site bileşenleri
docker/          Caddy yapılandırması
sunucu/          sunucu kurulum betiği (kur.sh)
yayin/           GitHub ile otomatik yayın: ayarlar, SSH anahtarı türetme, yayın betiği
tests/           birim testleri
```

## Geliştirme ortamı

Node.js 22 gerekir.

```bash
npm ci
npm run dev               # http://localhost:3000
```

İsteğe bağlı olarak kök klasörde `.env.local` dosyası oluşturabilirsiniz (ör. `APP_URL=http://localhost:3000`
ya da İletişim sayfasında görmek için `OWNER_*` değerleri). Gizli bir değer gerekmez.

### Denetimler ve testler

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

### Test tanımları

Kodda sürümlüdür (`src/content/instruments`). Bir testin maddesi, anahtarı ya da puanlaması değişince sürüm
numarasını artırın. Yeni bir test eklerken kullanım izni netleşmiş olmalı ve bilim kartı eksiksiz
doldurulmalıdır; yapılmamış çalışmaları “sürüyor” ya da “yapılacak” diye anlatan metinler testlerde yakalanır.

## Güvenlik ve gizlilik notları

- Bağımlılık denetimi: `npm audit` temiz.
- Uygulama yalnızca Caddy arkasında çalışmalıdır: istemcinin IP adresi `X-Forwarded-For` başlığının son
  değerinden okunur ve Caddy bu başlığı gerçek adresle değiştirir. IP adresi yalnızca bellekteki hız
  sınırında kullanılır ve en geç 11 dakikada silinir (`src/lib/memory-rate-limit.ts`).
- Günlüğe yalnızca hata özeti yazılır (`src/lib/log.ts`); istek gövdesi, cevaplar ve IP adresi yazılmaz.
- İçerik güvenliği politikası (`next.config.ts`): dış kaynaktan komut dosyası, yazı tipi ya da görsel
  yüklenmez.
- Caddy'nin günlüğüne yalnızca ayar, yönetim ve sertifika iletileri yazılır (izin listesi,
  `docker/Caddyfile`). İsteği IP adresi ve başlıklarıyla birlikte yazan iletileri (istek hatası
  `http.log.error`, yarıda kalan yanıt `http.handlers.reverse_proxy` ve ileride eklenebilecek başkaları)
  bu yüzden yazılmaz.
