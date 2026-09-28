import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * Sosyal medya paylaşım görselleri (1200×630). Sitenin görsel dilini taşır: kâğıt zemin, ince ızgara,
 * usturlap işareti ve altta, raporlardaki gibi kırmızı işaretli bir ölçüm cetveli.
 * Görseller derleme sırasında üretilir; yazı tipleri node_modules içindeki fontsource paketlerinden okunur.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  paper: '#f3f5f8',
  ink: '#13203b',
  ink2: '#44546f',
  ink3: '#5a6984',
  rule: '#d4dbe5',
  ruleStrong: '#a3b0c3',
  brass: '#b07f22',
  brassInk: '#7e5710',
  brassSoft: '#f3e7cf',
  marker: '#c23a30',
};

type OgFont = { name: string; data: Buffer; weight: 400 | 700; style: 'normal' };

let fontsPromise: Promise<OgFont[]> | null = null;

function loadFonts(): Promise<OgFont[]> {
  const f = (pkg: string, file: string) => readFile(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));
  fontsPromise ??= Promise.all([
    f('bricolage-grotesque', 'bricolage-grotesque-latin-700-normal.woff'),
    f('bricolage-grotesque', 'bricolage-grotesque-latin-ext-700-normal.woff'),
    f('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-400-normal.woff'),
    f('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-ext-400-normal.woff'),
    f('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-700-normal.woff'),
    f('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-ext-700-normal.woff'),
  ]).then(([d1, d2, b1, b2, b3, b4]) => [
    // Satori aynı adlı yazı tiplerinden yalnızca birini seçer; Türkçe harfler (ğ, ş, ı, İ) latin-ext
    // alt kümesinde olduğundan bu dosyalar ayrı adla yüklenir ve yazı tipi listesinde yedek olarak verilir.
    { name: 'Display', data: d1, weight: 700, style: 'normal' },
    { name: 'DisplayExt', data: d2, weight: 700, style: 'normal' },
    { name: 'Body', data: b1, weight: 400, style: 'normal' },
    { name: 'Body', data: b3, weight: 700, style: 'normal' },
    { name: 'BodyExt', data: b2, weight: 400, style: 'normal' },
    { name: 'BodyExt', data: b4, weight: 700, style: 'normal' },
  ]);
  return fontsPromise;
}

const DISPLAY = 'Display, DisplayExt';
const BODY = 'Body, BodyExt';

const r2 = (v: number) => Math.round(v * 100) / 100;

function markDataUri(): string {
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const a = (Math.PI * (9 + i * 9)) / 180;
    const r1 = i % 3 === 1 ? 10.5 : 12;
    return `<line x1="${r2(3 + Math.cos(a) * r1)}" y1="${r2(29 - Math.sin(a) * r1)}" x2="${r2(3 + Math.cos(a) * 14)}" y2="${r2(29 - Math.sin(a) * 14)}" stroke="${C.ink}" stroke-width="1.2" stroke-linecap="round"/>`;
  }).join('');
  const p = (Math.PI * 38) / 180;
  const ex = r2(3 + Math.cos(p) * 21);
  const ey = r2(29 - Math.sin(p) * 21);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><path d="M3 29 L3 5 A24 24 0 0 1 27 29 Z" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M3 13 A16 16 0 0 1 19 29" fill="none" stroke="${C.ink}" stroke-width="1.4"/>${ticks}<line x1="3" y1="29" x2="${ex}" y2="${ey}" stroke="${C.brass}" stroke-width="2.2" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="2.4" fill="${C.marker}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function svgUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40"><path d="M1 1 L23 1 L12 17 Z" fill="${C.marker}"/><rect x="10.5" y="14" width="3" height="26" fill="${C.marker}"/></svg>`;

/** Sağ üst köşede, usturlap çeyreğinin büyütülmüş ve soluk hâli. */
function arcsSvg(): string {
  const cx = 560;
  const cy = 0;
  const arc = (r: number, w: number, color: string) =>
    `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx} ${cy + r}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
  const ticks = Array.from({ length: 31 }, (_, i) => {
    const a = (Math.PI * (90 + i * 3)) / 180;
    const r0 = 452;
    const r1 = i % 5 === 0 ? 420 : 436;
    return `<line x1="${r2(cx + Math.cos(a) * r1)}" y1="${r2(cy + Math.sin(a) * r1)}" x2="${r2(cx + Math.cos(a) * r0)}" y2="${r2(cy + Math.sin(a) * r0)}" stroke="${C.ruleStrong}" stroke-width="2"/>`;
  }).join('');
  const al = (Math.PI * 128) / 180;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560">${arc(452, 3, C.ruleStrong)}${arc(330, 2, C.rule)}${arc(250, 2, C.rule)}${ticks}<line x1="${cx}" y1="${cy}" x2="${r2(cx + Math.cos(al) * 520)}" y2="${r2(cy + Math.sin(al) * 520)}" stroke="${C.brass}" stroke-opacity="0.45" stroke-width="3"/></svg>`;
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '')}…`;
}

/** Alt kenardaki cetvel: 0–10 arası, ana çizgiler her birimde; işaret ve ölçüm payı bandı. */
function Ruler({ value }: { value: number }) {
  const left = 72;
  const width = 1200 - left * 2;
  const x = (v: number) => (v / 10) * width;
  const ticks: { pos: number; h: number }[] = [];
  for (let i = 0; i <= 50; i++) ticks.push({ pos: x(i / 5), h: i % 5 === 0 ? 22 : 10 });
  return (
    <div style={{ position: 'absolute', left, bottom: 44, width, height: 60, display: 'flex' }}>
      <div
        style={{
          position: 'absolute',
          left: x(value - 0.9),
          width: x(1.8),
          top: 22,
          height: 14,
          background: C.brassSoft,
          border: `1px solid ${C.brass}`,
          borderRadius: 3,
        }}
      />
      <div style={{ position: 'absolute', left: 0, width, top: 36, height: 2, background: C.ink }} />
      {ticks.map((t) => (
        <div key={t.pos} style={{ position: 'absolute', left: t.pos, top: 36 - t.h, width: 2, height: t.h, background: t.h > 10 ? C.ink : C.ruleStrong }} />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={svgUri(MARKER_SVG)} width={24} height={40} alt="" style={{ position: 'absolute', left: x(value) - 11, top: -2 }} />
    </div>
  );
}

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
  marker = 7.2,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  marker?: number;
}): Promise<ImageResponse> {
  const fonts = await loadFonts();
  const t = clamp(title, 90);
  const titleSize = t.length > 60 ? 56 : t.length > 36 ? 66 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: C.paper,
          padding: '56px 72px 0',
          fontFamily: BODY,
          color: C.ink,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px), linear-gradient(90deg, ${C.rule} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            opacity: 0.45,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={svgUri(arcsSvg())} width={560} height={560} alt="" style={{ position: 'absolute', right: 0, top: 0, opacity: 0.65 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri()} width={56} height={56} alt="" />
          <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, letterSpacing: -0.8 }}>Ölçekhane</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 54, maxWidth: 900 }}>
          {eyebrow && (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.brassInk,
                  background: C.brassSoft,
                  border: `1.5px solid ${C.brass}`,
                  borderRadius: 999,
                  padding: '4px 18px',
                }}
              >
                {eyebrow}
              </div>
            </div>
          )}
          <div style={{ fontFamily: DISPLAY, fontSize: titleSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: -1 }}>{t}</div>
          {subtitle && <div style={{ fontSize: 28, lineHeight: 1.4, color: C.ink2, maxWidth: 800 }}>{clamp(subtitle, 130)}</div>}
        </div>
        <Ruler value={marker} />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
