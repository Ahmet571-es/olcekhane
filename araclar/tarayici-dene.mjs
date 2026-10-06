#!/usr/bin/env node
// Sayfaları gerçek bir tarayıcıda (Chromium) telefon ve masaüstü genişliğinde açıp denetler: HTTP durumu, konsol ve
// sayfa hataları, yatay taşma, dış kaynak isteği (site üçüncü taraf kaynak kullanmaz), çerez ve tarayıcı deposu
// (site hiçbir şey saklamaz). Her sayfanın ekran görüntüsünü iki ekran boyu parçalar hâlinde kaydeder; görüntülere
// Read aracıyla bakılır.
//
//   bash araclar/yerel-sunucu.sh                          önce yerel sunucu (127.0.0.1:3100)
//   node araclar/tarayici-dene.mjs / /testler /testler/oz-saygi
//   CIHAZ=telefon node araclar/tarayici-dene.mjs /rehber   yalnızca telefon (ya da masaustu)
//   ADRES=http://127.0.0.1:3101 CIKTI=/tmp/ekran node araclar/tarayici-dene.mjs /
//
// playwright-core ilk çalıştırmada depo dışına kurulur (${TMPDIR:-/tmp}/olcekhane-playwright); package.json
// değişmez. Tarayıcı olarak ortamdaki Chromium kullanılır (/opt/pw-browsers/chromium).
// Bir testi baştan sona çözmek gibi etkileşimli denemeler için geçici klasörde aynı kurulumla kısa bir betik yazılır:
//   import { tarayiciAc } from '<depo>/araclar/tarayici-dene.mjs';  const { chromium, secenek } = tarayiciAc();
// Çıkış kodu: 0 = sorun yok, 1 = en az bir sayfada sorun var.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLAYWRIGHT_SURUMU = '1.56.1';
const CHROMIUM = '/opt/pw-browsers/chromium';
const PARCA_SINIRI = 12;

export const CIHAZLAR = {
  telefon: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  masaustu: { viewport: { width: 1366, height: 900 } },
};

/** playwright-core'u (gerekirse kurarak) yükler; `secenek` chromium.launch() için. */
export function tarayiciAc() {
  const yer = path.join(os.tmpdir(), 'olcekhane-playwright');
  const yukle = () => createRequire(path.join(yer, 'package.json'))('playwright-core');
  let pw;
  try {
    pw = yukle();
  } catch {
    mkdirSync(yer, { recursive: true });
    if (!existsSync(path.join(yer, 'package.json'))) writeFileSync(path.join(yer, 'package.json'), '{ "private": true }\n');
    console.log(`playwright-core ${PLAYWRIGHT_SURUMU} kuruluyor (${yer})...`);
    execFileSync('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', `playwright-core@${PLAYWRIGHT_SURUMU}`], {
      cwd: yer,
      stdio: 'inherit',
    });
    pw = yukle();
  }
  return { chromium: pw.chromium, secenek: existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {} };
}

/** Kaydırınca beliren bölümler (data-reveal) görünsün diye sayfa sonuna kadar kaydırıp başa döner. */
async function kaydir(sayfa) {
  await sayfa.evaluate(async () => {
    const adim = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += adim) {
      window.scrollTo(0, y);
      await new Promise((bitti) => setTimeout(bitti, 80));
    }
    window.scrollTo(0, 0);
  });
  await sayfa.waitForTimeout(500);
}

async function dene(tarayici, adres, cikti, cihaz, yol, sira) {
  const hedef = yol.startsWith('http') ? yol : adres + yol;
  const baglam = await tarayici.newContext({ ...CIHAZLAR[cihaz], locale: 'tr-TR', timezoneId: 'Europe/Istanbul' });
  const sayfa = await baglam.newPage();
  const sorunlar = [];
  sayfa.on('console', (m) => {
    if (m.type() === 'error') sorunlar.push(`konsol hatası: ${m.text().slice(0, 300)}`);
  });
  sayfa.on('pageerror', (e) => sorunlar.push(`sayfa hatası: ${String(e.message).slice(0, 300)}`));
  sayfa.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(adres) && !/^(data|blob|about):/.test(u)) sorunlar.push(`dış kaynak isteği: ${u}`);
  });
  sayfa.on('response', (r) => {
    if (r.status() >= 400 && r.url() !== hedef) sorunlar.push(`${r.status()} yanıtı: ${r.url()}`);
  });

  let durum = 0;
  try {
    const yanit = await sayfa.goto(hedef, { waitUntil: 'networkidle', timeout: 45000 });
    durum = yanit ? yanit.status() : 0;
    if (durum !== 200) sorunlar.push(`HTTP ${durum}`);
    await kaydir(sayfa);
    const tasma = await sayfa.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (tasma > 1) sorunlar.push(`yatay taşma: ${tasma} px`);
    const depo = await sayfa.evaluate(() => {
      try {
        return localStorage.length + sessionStorage.length;
      } catch {
        return 0;
      }
    });
    if (depo > 0) sorunlar.push(`tarayıcı deposuna yazıldı (${depo} kayıt)`);
    const cerezler = await baglam.cookies();
    if (cerezler.length) sorunlar.push(`çerez: ${cerezler.map((c) => c.name).join(', ')}`);
  } catch (e) {
    sorunlar.push(`açılmadı: ${String(e.message).split('\n')[0]}`);
  }

  // Ekran görüntüsü parça parça (her biri iki ekran boyu): tek parça tam boy görüntü küçültülünce okunmaz.
  const ad = yol === '/' ? 'ana-sayfa' : yol.replace(/^https?:\/\/[^/]+/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  const on = `${String(sira).padStart(2, '0')}-${ad || 'sayfa'}`;
  const { width, height } = CIHAZLAR[cihaz].viewport;
  const dosyalar = [];
  try {
    const boy = await sayfa.evaluate(() => document.documentElement.scrollHeight);
    const parca = height * 2;
    for (let i = 0, y = 0; y < boy && i < PARCA_SINIRI; i++, y += parca) {
      const dosya = path.join(cikti, `${cihaz}_${on}_${i + 1}.png`);
      const clip = { x: 0, y, width, height: Math.min(parca, boy - y) };
      await sayfa.screenshot({ path: dosya, fullPage: true, clip, scale: 'css' });
      dosyalar.push(dosya);
    }
  } catch (e) {
    sorunlar.push(`ekran görüntüsü alınamadı: ${String(e.message).split('\n')[0]}`);
  }
  await baglam.close();
  return { cihaz, yol, durum, sorunlar: [...new Set(sorunlar)], dosyalar };
}

async function main() {
  const adres = (process.env.ADRES || 'http://127.0.0.1:3100').replace(/\/$/, '');
  const cikti = process.env.CIKTI || path.join(os.tmpdir(), 'olcekhane-ekran');
  const cihazlar = process.env.CIHAZ ? [process.env.CIHAZ] : Object.keys(CIHAZLAR);
  for (const c of cihazlar) {
    if (!CIHAZLAR[c]) throw new Error(`Bilinmeyen cihaz: ${c} (telefon ya da masaustu)`);
  }
  const yollar = process.argv.slice(2).map((y) => (y.startsWith('http') || y.startsWith('/') ? y : `/${y}`));
  if (!yollar.length) yollar.push('/', '/testler', '/rehber', '/iletisim');
  mkdirSync(cikti, { recursive: true });

  const { chromium, secenek } = tarayiciAc();
  let tarayici;
  try {
    tarayici = await chromium.launch(secenek);
  } catch (e) {
    console.error(`Tarayıcı açılamadı: ${String(e.message).split('\n')[0]}`);
    console.error(`Bu ortamda Chromium ${CHROMIUM} olarak beklenir. Yoksa bu deneme yapılamaz; raporda söyleyin.`);
    return 1;
  }
  const sonuclar = [];
  try {
    for (const [i, yol] of yollar.entries()) {
      for (const cihaz of cihazlar) sonuclar.push(await dene(tarayici, adres, cikti, cihaz, yol, i + 1));
    }
  } finally {
    await tarayici.close();
  }

  console.log(`Adres: ${adres}  (telefon 390×844, masaüstü 1366×900)`);
  for (const s of sonuclar) {
    const ilk = s.dosyalar[0] ? `  ${path.basename(s.dosyalar[0])} (${s.dosyalar.length} parça)` : '';
    console.log(`${s.sorunlar.length ? '✗' : '✓'} ${s.cihaz.padEnd(9)} ${String(s.durum).padEnd(4)} ${s.yol}${ilk}`);
    for (const m of s.sorunlar) console.log(`      - ${m}`);
  }
  const sorunlu = sonuclar.filter((s) => s.sorunlar.length).length;
  console.log(`Ekran görüntüleri (her parça iki ekran boyu; _1 ilk ekrandır): ${cikti}`);
  console.log(sorunlu ? `Sonuç: ${sorunlu} denemede sorun var.` : `Sonuç: ${sonuclar.length} denemenin hepsi sorunsuz.`);
  return sorunlu ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then(
    (kod) => process.exit(kod),
    (e) => {
      console.error(e);
      process.exit(1);
    },
  );
}
