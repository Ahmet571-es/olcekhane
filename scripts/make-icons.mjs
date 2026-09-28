/**
 * Site simgelerini tek bir kaynaktan üretir: tarayıcı sekmesi (SVG ve ICO), Apple ana ekran simgesi
 * ve web uygulaması bildirimi (manifest) için PNG'ler. İşaret değişirse bu betik yeniden çalıştırılır:
 *   node scripts/make-icons.mjs
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const r2 = (v) => Math.round(v * 100) / 100;

/** Usturlap çeyreği (32×32 koordinatlarında). */
function markShapes({ stroke, brass, marker, strokeClass = '' }) {
  const cls = strokeClass ? ` class="${strokeClass}"` : '';
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const a = (Math.PI * (9 + i * 9)) / 180;
    const r1 = i % 3 === 1 ? 10.5 : 12;
    return `<line${cls} x1="${r2(3 + Math.cos(a) * r1)}" y1="${r2(29 - Math.sin(a) * r1)}" x2="${r2(3 + Math.cos(a) * 14)}" y2="${r2(29 - Math.sin(a) * 14)}" stroke="${stroke}" stroke-width="1.2" stroke-linecap="round"/>`;
  }).join('');
  const p = (Math.PI * 38) / 180;
  const ex = r2(3 + Math.cos(p) * 21);
  const ey = r2(29 - Math.sin(p) * 21);
  return [
    `<path${cls} d="M3 29 L3 5 A24 24 0 0 1 27 29 Z" fill="none" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`,
    `<path${cls} d="M3 13 A16 16 0 0 1 19 29" fill="none" stroke="${stroke}" stroke-width="1.4"/>`,
    ticks,
    `<line x1="3" y1="29" x2="${ex}" y2="${ey}" stroke="${brass}" stroke-width="2.2" stroke-linecap="round"/>`,
    `<circle cx="${ex}" cy="${ey}" r="2.4" fill="${marker}"/>`,
  ].join('');
}

const LIGHT = { stroke: '#13203b', brass: '#b07f22', marker: '#c23a30' };
const ON_INK = { stroke: '#f3f5f8', brass: '#d6aa52', marker: '#f07469' };
const INK = '#13203b';

// 1) Sekme simgesi: saydam zemin, koyu temada açık çizgiler
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>@media (prefers-color-scheme: dark){.s{stroke:#e6ebf3}}</style>${markShapes({ ...LIGHT, strokeClass: 's' })}</svg>\n`;
await writeFile('src/app/icon.svg', faviconSvg);

/** Dolu zeminli kare simge: işaret, kenarlardan `pad` oranında boşlukla ortalanır. */
function tileSvg(size, { pad = 0.2, radius = 0 } = {}) {
  // İşaretin kapladığı alan: x 3..27, y 5..29 (24×24)
  const inner = size * (1 - pad * 2);
  const s = inner / 24;
  const tx = (size - inner) / 2 - 3 * s;
  const ty = (size - inner) / 2 - 5 * s;
  const bg = radius
    ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${INK}"/>`
    : `<rect width="${size}" height="${size}" fill="${INK}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg}<g transform="translate(${r2(tx)} ${r2(ty)}) scale(${r2(s)})">${markShapes(ON_INK)}</g></svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// 2) Apple ana ekran simgesi (iOS köşeleri kendisi yuvarlar)
await writeFile('src/app/apple-icon.png', await png(tileSvg(180, { pad: 0.2 }), 180));

// 3) Web uygulaması simgeleri
await writeFile('public/icon-192.png', await png(tileSvg(192, { pad: 0.2, radius: 36 }), 192));
await writeFile('public/icon-512.png', await png(tileSvg(512, { pad: 0.2, radius: 96 }), 512));
// Maskelenebilir simge: Android şekli keser; işaret %80'lik güvenli alanın içinde kalmalı
await writeFile('public/icon-maskable-512.png', await png(tileSvg(512, { pad: 0.28 }), 512));

// 4) favicon.ico: 16, 32 ve 48 piksellik PNG'leri tek dosyada toplar (PNG gömülü ICO)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(tileSvg(s, { pad: 0.14, radius: s * 0.2 }), s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
const dir = Buffer.alloc(16 * images.length);
let offset = 6 + dir.length;
images.forEach((img, i) => {
  const s = sizes[i];
  const o = i * 16;
  dir.writeUInt8(s === 256 ? 0 : s, o);
  dir.writeUInt8(s === 256 ? 0 : s, o + 1);
  dir.writeUInt8(0, o + 2);
  dir.writeUInt8(0, o + 3);
  dir.writeUInt16LE(1, o + 4);
  dir.writeUInt16LE(32, o + 6);
  dir.writeUInt32LE(img.length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += img.length;
});
await writeFile('src/app/favicon.ico', Buffer.concat([header, dir, ...images]));

console.log('Simgeler üretildi.');
