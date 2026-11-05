// Sesli okumanın otomatik analizini gerçek bir tarayıcıda (Chromium) baştan sona dener: sahte mikrofona yapay Türkçe ses
// verilir (önce mikrofon denemesi cümlesi, sonra metnin okunuşu), "Evet, analiz et" denir, sorular cevaplanır, rapor
// beklenir ve işaretli metin ile hata sayıları yazdırılır. Canlı siteye de yerel sunucuya da karşı çalışır.
//
// Hazırlık (bir kez; ses dosyaları depo dışında, /tmp/olcekhane-ses):
//   pip install --break-system-packages piper-tts
//   mkdir -p /tmp/olcekhane-ses/voice && cd /tmp/olcekhane-ses/voice && for f in tr_TR-dfki-medium.onnx tr_TR-dfki-medium.onnx.json; do
//     curl -sL -o "$f" "https://huggingface.co/rhasspy/piper-voices/resolve/main/tr/tr_TR/dfki/medium/$f"; done
//   python3 - <<'EOF'
//   import wave
//   from piper import PiperVoice, SynthesisConfig
//   v = PiperVoice.load('/tmp/olcekhane-ses/voice/tr_TR-dfki-medium.onnx'); cfg = SynthesisConfig(length_scale=1.15)
//   def yaz(ad, metin):
//       with wave.open(ad, 'wb') as w: v.synthesize_wav(metin, w, syn_config=cfg)
//   yaz('/tmp/olcekhane-ses/cumle.wav', 'Merhaba, ben okumaya hazırım.')
//   yaz('/tmp/olcekhane-ses/okuma.wav', '<metnin okunuşu; bilerek hata için kelime atla, değiştir ya da ekle>')
//   EOF
//
// Kullanım:
//   node araclar/sesli-okuma-dene.mjs 'https://olcekhane.com/testler/sesli-okuma-degerlendirmesi/coz?sinif=3' \
//     /tmp/olcekhane-ses/okuma.wav /tmp/olcekhane-deneme/canli
//   (üçüncü bağımsız değişken ekran görüntülerinin öneki: <önek>-mikrofon.png, <önek>-izin.png, <önek>-son.png)
//   METIN='Kerem’in Kuş Yemliği' (varsayılan) ile başka bir metin seçilir; okuma sesi o metne göre üretilmiş olmalıdır.
//
// Ölçüm (2026-11-05, canlı site, 3. sınıf "Kerem’in Kuş Yemliği", 123 kelime, bu ortamda 2 çekirdek): mikrofon denemesi
// ilk seferde geçti; 58 sn'lik okumanın incelemesi ~60 sn sürdü. Doğru okumada 0 hata (7 "net anlaşılamadı"). Bilerek
// hatalı okumada (3 kelimelik atlama, erik→elma, fazladan "küçük") üçü de bulundu; ayrıca yapay sesin doğru söylediği
// iki kelime ek farkıyla yanlış okuma sayıldı (önü→önüne, gürültülüydü→gürültülüyordu: konuşma tanımanın doğrulamada da
// yinelediği kalıp). Ek farkının eşiğini gevşetmek (2 harf) denendi ve geri alındı: fixture kayıtlarında yakalama
// 34/36'dan 26/36'ya düşüyor, yanlış alarm değişmiyor.
import { readFileSync } from 'node:fs';
import { tarayiciAc } from './tarayici-dene.mjs';

const [adres, okumaWav, cikti = '/tmp/olcekhane-deneme/deneme'] = process.argv.slice(2);
if (!adres || !okumaWav) {
  console.error('Kullanım: node araclar/sesli-okuma-dene.mjs <adres> <okuma.wav> [çıktı öneki]');
  process.exit(1);
}
const cumleWav = process.env.CUMLE_WAV ?? '/tmp/olcekhane-ses/cumle.wav';
const metinAdi = process.env.METIN ?? 'Kerem’in Kuş Yemliği';
const { chromium, secenek } = tarayiciAc();

// Canlı siteye bu ortamdan vekil sunucu üzerinden çıkılır; yerel sunucuda vekil kullanılmaz.
const proxy = process.env.HTTPS_PROXY && !/^http:\/\/(127\.|localhost)/.test(adres) ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await chromium.launch({
  ...secenek,
  args: ['--autoplay-policy=no-user-gesture-required', '--use-fake-ui-for-media-stream'],
  proxy,
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true });

// Sahte mikrofon: getUserMedia, bir AudioContext'in MediaStreamAudioDestinationNode akışını verir; __sesCal(wavBase64) o
// akışa bir ses çalar ve süresini (ms) döndürür. Ses çalınmadığında akış sessizdir (sessizlik ölçümü geçer).
await ctx.addInitScript(() => {
  let ac = null;
  let dest = null;
  const hazirla = () => {
    if (!ac) {
      ac = new AudioContext();
      dest = ac.createMediaStreamDestination();
    }
    return dest.stream;
  };
  navigator.mediaDevices.getUserMedia = async () => {
    const s = hazirla();
    await ac.resume();
    return s;
  };
  window.__sesCal = async (b64) => {
    hazirla();
    await ac.resume();
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    const audio = await ac.decodeAudioData(buf.buffer);
    const src = ac.createBufferSource();
    src.buffer = audio;
    src.connect(dest);
    src.start();
    return audio.duration * 1000;
  };
});

const page = await ctx.newPage();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
page.on('pageerror', (e) => log('SAYFA HATASI', e.message));
page.on('console', (m) => {
  if (m.type() === 'error') log('KONSOL', m.text().slice(0, 200));
});
const cal = (wav) => page.evaluate((b64) => window.__sesCal(b64), readFileSync(wav).toString('base64'));
const tikla = async (metin) => {
  const b = page.getByRole('button', { name: metin, exact: true });
  await b.waitFor({ state: 'visible', timeout: 120_000 });
  await b.click();
  log('tıklandı:', metin);
};
const bekle = (ms) => page.waitForTimeout(ms);
const bitir = async (kod, neden) => {
  log(neden);
  log('SON EKRAN:', (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600));
  await browser.close();
  process.exit(kod);
};

await page.goto(adres, { waitUntil: 'networkidle' });
log('açıldı', adres);
await tikla('Başlayalım');
await page.getByRole('button', { name: metinAdi }).click();
log('metin seçildi:', metinAdi);

// Mikrofon denemesi: aç → sessizlik → cümle (yapay zekâ bu sırada iniyor olabilir; kayıt düğmesi hazır olunca etkinleşir).
await tikla('Mikrofonu aç');
await tikla('Ölçmeyi başlat');
await page.getByText('Ortam sessiz ✓').waitFor({ timeout: 30_000 });
log('sessizlik ölçüldü');
const kayit = page.getByRole('button', { name: 'Kaydı başlat', exact: true });
await kayit.waitFor({ state: 'visible', timeout: 120_000 });
for (let i = 0; i < 900 && (await kayit.isDisabled()); i++) await bekle(1000);
await kayit.click();
await bekle(400);
log('cümle çalındı', Math.round(await cal(cumleWav)), 'ms');
const gec = page.getByRole('button', { name: 'Okumaya geç', exact: true });
for (let i = 0; i < 900 && (await gec.isDisabled()); i++) {
  if (i % 15 === 0) log('mikrofon adımı:', (await page.locator('section[aria-labelledby="mik-3"]').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160));
  await bekle(1000);
}
await page.screenshot({ path: `${cikti}-mikrofon.png`, fullPage: true });
if (await gec.isDisabled()) await bitir(2, 'MİKROFON DENEMESİ GEÇİLEMEDİ');
await gec.click();
log('okumaya geçildi');

// Okuma.
await tikla('Başla');
await bekle(500);
const okumaMs = await cal(okumaWav);
log('okuma çalınıyor', Math.round(okumaMs), 'ms');
await bekle(okumaMs + 1200);
await tikla('Bitirdim');

// Kayıt denetimi (sorun varsa "Yine de devam et") ya da doğrudan izin sorusu.
const evet = page.getByRole('button', { name: 'Evet, analiz et', exact: true });
const yineDe = page.getByRole('button', { name: 'Yine de devam et', exact: true });
await Promise.race([evet.waitFor({ timeout: 30_000 }), yineDe.waitFor({ timeout: 30_000 })]).catch(() => {});
if (await yineDe.isVisible().catch(() => false)) {
  log('KAYIT DENETİMİ UYARISI:', (await page.locator('[role=alert]').last().innerText()).slice(0, 160));
  await yineDe.click();
}
await page.screenshot({ path: `${cikti}-izin.png`, fullPage: true });
if (!(await evet.isVisible().catch(() => false))) await bitir(2, 'İZİN EKRANI GELMEDİ');
await evet.click();
log('analiz başladı');

// Sorular: her soruda ilk seçenek (anlama sonucu bu denemenin konusu değildir), son soruda "Soruları bitir".
for (let i = 0; i < 12; i++) {
  const secenek = page.locator('button[aria-pressed]').first();
  await secenek.waitFor({ timeout: 20_000 });
  await secenek.click();
  const ileri = page.getByRole('button', { name: /Sonraki soru|Soruları bitir/ });
  const son = /Soruları bitir/.test(await ileri.innerText());
  await ileri.click();
  await bekle(300);
  if (son) {
    log('sorular bitti');
    break;
  }
}

// Rapor bekleniyor (inceleme bu ortamda birkaç dakika sürebilir).
const basladi = Date.now();
let raporVar = false;
for (let i = 0; i < 1500; i++) {
  if (await page.locator('h2#isaretli').isVisible().catch(() => false)) {
    raporVar = true;
    break;
  }
  if (i % 20 === 0) {
    const h1 = await page.locator('h1').first().innerText().catch(() => '');
    log('bekleniyor:', h1.slice(0, 80));
    if (/inceleyemedik|anlayamadık|silindi|hazırlanamadı/i.test(h1)) break;
  }
  await bekle(1000);
}
log('rapor', raporVar ? 'geldi' : 'GELMEDİ', '· süre', Math.round((Date.now() - basladi) / 1000), 'sn');
await page.screenshot({ path: `${cikti}-son.png`, fullPage: true });
if (!raporVar) await bitir(3, 'RAPOR GELMEDİ');

// İşaretli metin (işaret adı kelimenin üstünde yazar), hata ve gözlem sayıları, düzey ve ölçütler.
const sonuc = await page.evaluate(() => {
  const metin = (sel) => (document.querySelector(sel)?.innerText ?? '').replace(/\s+/g, ' ');
  return {
    duzey: document.querySelector('h2#duzey')?.textContent ?? '',
    olcutler: metin('section[aria-labelledby="olcutler"]').slice(0, 600),
    isaretliMetin: metin('section[aria-labelledby="isaretli"]').slice(0, 2500),
  };
});
console.log(JSON.stringify(sonuc, null, 1));
await browser.close();
