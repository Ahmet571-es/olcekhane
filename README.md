# Ölçekhane

Öğrenciler için bilimsel ölçme platformu: akademik tanı testleri, kişilik, ilgi ve çalışma alışkanlığı
ölçekleri ile dikkat ve çalışma belleği görevleri. Veliler çocukları için tek başına kullanabilir; okullar
rehberlik servisi aracılığıyla sınıflarına uygular. Raporlar veli, öğrenci ve rehber öğretmen için ayrı
dille yazılır; her testin bilimsel dayanağı, güvenirliği ve sınırlılıkları raporda açıkça yazar.

Bu belge geliştiriciler içindir. Sunucuya kurulum için **[KURULUM.md](KURULUM.md)** dosyasına bakın.

## Neler var?

- **Testler:** Beş Faktör Kişilik Profili, Öz-saygı Ölçeği (Rosenberg), Mesleki İlgi Profili (RIASEC),
  Çalışma Alışkanlıkları Envanteri, Okuma Hızı ve Anlama, Matematik Tanı Testi (5–8. sınıf, hata türü
  analiziyle), Dikkat ve Çalışma Belleği Görevleri. Test tanımları kodda sürümlüdür
  (`src/content/instruments`); puanlama sunucuda yapılır.
- **Veli paneli:** çocuk profili, açık rıza, test çözme, veli ve öğrenci raporları.
- **Okul paneli:** okul yöneticisi, rehber öğretmen ve öğretmen görevleri; e-Okul listesinden öğrenci
  aktarma; veli onayını e-postayla alma; öğrenci giriş kodları; test atama; en az 5 öğrencilik ve
  küçük hücreleri gizleyen grup raporları. Okulda bireysel sonuçları yalnızca rehber öğretmen görür;
  öğretmen ve okul yöneticisi grup özetlerini görür.
- **KVKK:** aydınlatma ve açık rıza ayrı; rıza geri alınınca uygulamalar geçersiz sayılır ve günlük
  temizlik göreviyle silinir; saklama süreleri görevle uygulanır; bireysel verilere erişen görevlerde
  iki aşamalı doğrulama zorunludur; önemli işlemler denetim kaydına yazılır.
- **Yönetim paneli:** yayına hazırlık listesi, okullar, kullanıcı desteği, e-posta kutusu, denetim
  kaydı, günlük temizlik ve psikometri laboratuvarı (madde analizi, güvenirlik, anonim araştırma
  verisi, ön norm).

## Teknoloji

Next.js 16 (App Router, sunucu eylemleri), React 19, TypeScript, PostgreSQL 18 ve Drizzle ORM,
Tailwind CSS 4, three.js (tanıtım sayfalarındaki 3B sahneler). Üretimde Docker, Caddy (HTTPS) ve
PostgreSQL.

Sayfalar istek anında üretilir: site adresi (`APP_URL`), dizine ekleme ayarı (`ALLOW_INDEXING`) ve şirket
bilgileri (`COMPANY_*`) sunucu çalışırken ortam değişkenlerinden okunur. Derleme için veritabanı ya da
`.env` gerekmez; veritabanı bağlantısı ilk sorguda kurulur. Yalnızca paylaşım görselleri derlemede
üretilir.

```
src/app          sayfalar ve sunucu eylemleri ((site) tanıtım, (auth) giriş ve veli onayı,
                 panel veli, okul okul paneli, ogrenci öğrenci, uygulama test ekranları,
                 hesap Hesabım, yonetim platform yönetimi, api sağlık denetimi)
src/content      test tanımları, rapor metinleri, rehber yazıları, hukuki metinler
src/lib          puanlama, rapor üretimi, kimlik doğrulama, okul kuralları, psikometri, görevler
src/db           veritabanı şeması (Drizzle); geçişler drizzle/ klasöründe
docker/          Caddy yapılandırması, kapsayıcı açılış ve yedek betikleri
sunucu/          sunucu betikleri: şifreli veri diskini açma, yedeklerin sunucu dışına şifreli kopyası
scripts/         geliştirme veritabanı, şema geçişi, tohum verisi, yönetici oluşturma
tests/           birim testleri; tests/db veritabanıyla çalışan testler
```

## Geliştirme ortamı

Node.js 22 gerekir.

```bash
npm ci
npm run db:start          # yerel PostgreSQL'i başlatır (gömülü, 54329 portu; ayrı bir terminalde açık kalır)
```

Kök klasörde `.env.local` dosyası oluşturun:

```bash
DATABASE_URL=postgres://olcekhane:olcekhane@127.0.0.1:54329/olcekhane
APP_URL=http://localhost:3000
APP_SECRET=gelistirme-icin-en-az-32-karakterlik-rastgele-bir-deger
SESSION_COOKIE_SECURE=false
# SMTP_URL tanımlı değilse e-postalar gönderilmez, yönetim panelindeki e-posta kutusuna yazılır.
```

```bash
npm run db:migrate        # şemayı kurar
ADMIN_EMAIL=siz@ornek.com ADMIN_PASSWORD='uzun-bir-sifre' npm run db:seed   # tanımlar + ilk yönetici
npm run dev               # http://localhost:3000
```

Yönetici ilk girişte iki aşamalı doğrulamayı kurar (herhangi bir kimlik doğrulama uygulamasıyla).
Geliştirmede günlük temizlik görevi kapalıdır; `SCHEDULED_JOBS=true` ile açılır ya da yönetim
panelinden elle çalıştırılır.

### Denetimler ve testler

```bash
npm run typecheck
npm run lint
npm test                  # birim testleri
npm run test:db           # veritabanı testleri (yalnızca yerel veritabanında çalışır)
npm run build
```

### Veritabanı değişiklikleri

Şemayı `src/db/schema` altında değiştirin, sonra `npm run db:generate` ile geçiş dosyası üretin.
Üretilen dosyaya anlamlı bir ad verin (`drizzle/000N_ad.sql`) ve `drizzle/meta/_journal.json`
içindeki `tag` alanını aynı adla güncelleyin; `npm run db:migrate` ile uygulayın. Üretimde geçişler
uygulama açılırken kendiliğinden uygulanır.

### Test tanımları ve hukuki metinler

Kodda tanımlıdır ve sunucu her açıldığında veritabanına eşitlenir. Bir test sürümüyle yapılmış
uygulama varsa ya da bir hukuki metin sürümüne bağlı onay kaydı varsa o sürümün üzerine yazılmaz:
değişiklik için sürüm numarasını artırın (sunucu günlüğünde uyarı görünür).

## Güvenlik notları

- Bağımlılık denetimi: `npm audit --omit=dev` temiz. Geliştirme aracı `drizzle-kit`'in içindeki eski
  esbuild sürümü için orta düzey bir uyarı vardır; yalnızca geliştirme sırasında kullanılır, üretim
  görüntüsüne girmez.
- `APP_SECRET` kurulumdan sonra değiştirilmemelidir: öğrenci giriş kodları, kurtarma kodları ve iki
  aşamalı doğrulama sırları buna bağlıdır.
- Uygulama yalnızca Caddy arkasında çalışmalıdır: istemcinin IP adresi `X-Forwarded-For` başlığının
  son değerinden okunur ve Caddy bu başlığı gerçek adresle değiştirir.
- İki aşamalı doğrulama oturum düzeyindedir: bir oturum, ikinci adımı kullanıcının doğrulamayı açtığı
  andan sonra doğrulanmışsa (`sessions.two_factor_at`) iki aşamalı sayılır. Doğrulaması açık bir
  kullanıcının kodla doğrulanmamış oturumu `getSession()` içinde `kind: 'unverified'` olarak döner ve
  oturum açılmamış gibi davranılır; yalnızca oturumu doğrulama sayfası ve çıkış kullanılabilir.
  Bekleyen kurulum sırrı da oturuma bağlıdır; şifreyi bilen başka bir oturum onu göremez.
- Veritabanı sorgu hataları (Drizzle, iletide parametreleri taşır) günlüğe parametresiz yazılır
  (`src/lib/log.ts`; `console.error` sunucu açılışında sarılır).
