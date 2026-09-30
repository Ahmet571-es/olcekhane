@AGENTS.md

# Ölçekhane: çalışma düzeni

Site sahibi yazılım bilmiyor ve İngilizce bilmiyor; isteklerini sade Türkçeyle yazar ("siteye şunu ekle").
Claude isteği uygular, dener ve yayına alır; sonucu sade Türkçeyle anlatır. Küçük isteklerde doğrudan yapılır.
Büyük ya da birden çok yolu olan isteklerde önce kısa bir plan ve seçenekler sunulur; seçim yapılınca iş sonuna
kadar yürütülür. Rehber yazılarında her mesajda bir yazı hazırlanır.

## Yayına alma

- `main` dalına gönderilen her işleme: **Denetim** (tür ve biçim denetimi, birim testleri, derleme, Docker
  görüntüsü) → **Yayın** (sunucuya kurulum; ardından site dışarıdan sınanır: sayfalar, test raporu, PDF,
  robots.txt ve site haritası). Sunucu ya da yayın dosyaları değişince **Kurulum provası** da çalışır.
- Göndermeden önce: `npm run typecheck`, `npm run lint`, `npm test`; arayüz değiştiyse `npm run build` ve
  gerçek bir tarayıcıda (Playwright, telefon ve masaüstü genişliği) deneme.
- Çalışmaların sonucu GitHub API'den özet uyarılarıyla (check-run annotations) okunur; çalışma kayıtları bu
  ortamdan indirilemez. `workflow_dispatch` bu ortamdan tetiklenemez: yeniden yayın için `main`'e bir işleme
  gönderilir. Site bu ortamdan açılamaz (vekil sunucu engeller); dış sınamayı Yayın iş akışı yapar.
- Sunucu: Hostinger VPS KVM 1, Almanya (Düsseldorf), `179.198.215.72`; alan adı `olcekhane.com` (Namecheap
  DNS, iki A kaydı). Ayarlar `yayin/ayarlar.env` dosyasındadır (gizli değildir). Gizli değerler yalnızca GitHub
  Secrets'ta durur (`ANA_SIFRE`, `SUNUCU_ROOT_SIFRE`); sohbette hiçbir zaman istenmez, yazılmaz, görülmez.

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
- Açık hukuki işler: Hostinger ile KVKK standart sözleşmesi ve Kurula bildirim, metinlerin avukat kontrolü,
  e-posta sağlayıcısının aydınlatma metninde anılması.

## Git

- İşlemeler ortamın varsayılan kimliğiyle (Claude, noreply@anthropic.com) ve imzalı yapılır; `-c user.*` ile
  kimlik değiştirilmez. Mesajın sonuna sistemin verdiği atıf satırları eklenir.
- `main`'e zorla gönderme (force push) yapılmaz.
