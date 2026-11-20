/**
 * Özet görselin başlığındaki çizim: testin galerideki amblemi (components/site/test-emblem.tsx). Amblem sayfada CSS
 * değişkenleriyle renklenir; tuvale çizilebilmesi için SVG'si tek başına geçerli bir görsele çevrilir: değişkenlerin yerine
 * açık temanın renkleri yazılır (görsel hep açık temadadır), boyut ve yazı tipi eklenir. Çizimdeki harf ve sayılar süstür.
 */

/** Alanların vurgu rengi, açık tema (globals.css `--dim-*`; lib/domain-style.ts ile aynı eşleşme). */
export const DOMAIN_HEX: Record<string, string> = {
  personality: '#7a4ee6',
  career: '#ee6a36',
  academic: '#2f5ce0',
  reading: '#df4777',
  cognitive: '#0e9c8c',
  wellbeing: '#df4777',
  skills: '#df4777',
};

export const domainHex = (domain: string) => DOMAIN_HEX[domain] ?? '#13203b';

/** İki rengin karışımı: `a` renginden `t` (0–1) kadar, kalanı `b`. */
export function mixHex(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, '0')).join('')}`;
}

/** Amblemin tonları (globals.css `.galeri-kart` içindeki `--e0`–`--e4` ile aynı oranlar) ve kullandığı öteki renkler. */
export function emblemPalette(accent: string): Record<string, string> {
  return {
    '--e0': mixHex(accent, '#ffffff', 0.09),
    '--e1': accent,
    '--e2': mixHex(accent, '#ffffff', 0.56),
    '--e3': mixHex(accent, '#ffffff', 0.24),
    '--e4': mixHex(accent, '#13203b', 0.62),
    '--surface': '#ffffff',
    '--dim-ext': '#ee6a36',
    '--dim-agr': '#df4777',
    '--dim-con': '#2f5ce0',
    '--dim-emo': '#0e9c8c',
    '--dim-int': '#7a4ee6',
  };
}

export const EMBLEM_W = 552;
export const EMBLEM_H = 345;

/**
 * Sayfadaki amblemin SVG metnini tek başına çizilebilir hâle getirir. Rengi bilinmeyen bir değişken kalırsa null döner
 * (görselde amblem yerine Ölçekhane işareti çizilir).
 */
export function standaloneEmblem(svg: string, accent: string): string | null {
  const palette = emblemPalette(accent);
  let out = svg.replace(/var\((--[a-z0-9-]+)\)/g, (m, name: string) => palette[name] ?? m);
  // Kıpırdama ayarları (`--dx`, `--gecikme` …) yalnızca sayfadaki geçişler içindir; renk taşıyan bir değişken kalmamalı.
  if (/(?:fill|stroke|stop-color|color)\s*[:=]\s*"?\s*var\(/.test(out)) return null;
  if (!/^<svg[\s>]/.test(out)) return null;
  if (!/\sxmlns=/.test(out.slice(0, out.indexOf('>')))) out = out.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  out = out.replace(/^<svg/, `<svg width="${EMBLEM_W}" height="${EMBLEM_H}"`);
  const style = '<style>.amblem-yazi{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-weight:700}</style>';
  return out.replace(/^(<svg[^>]*>)/, `$1${style}`);
}

/** SVG metninin `<img>` adresi. */
export const emblemDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
