import type { CSSProperties, ReactNode } from 'react';

/**
 * Ana sayfadaki test kartlarının amblemi: her test için adresinden türetilen, her açılışta aynı kalan küçük bir çizim.
 * Çizim testin ne yaptırdığını anımsatır: kişilik profillerinde ölçtüğü boyut sayısı kadar köşeli bir profil, akıl
 * yürütmede eksik parçalı bir desen, kâğıt katlamada katlanıp delinen kâğıt, kule görevinde üç çubuk… Bütün çizimler aynı
 * dili konuşur (aynı tonlar, çizgi kalınlıkları ve köşe yuvarlaklığı). Renkler yalnızca alanın rengidir (--vurgu; tek
 * istisna renk-kelime görevi, çünkü görevin kendisi renklerle ilgilidir); puanla ya da iyi/kötü anlamıyla ilgisi yoktur.
 * Çizimdeki harf, sayı ve şekiller süstür; testin sorularından alınmaz. Ekran okuyucudan gizlenir. Üzerine gelince
 * parçalar birkaç piksel kıpırdar (globals.css: .amblem-oge; hareketi azaltmayı seçenlerde kıpırdamaz).
 */

type Rng = () => number;

/** FNV-1a: adresten sabit bir tohum. */
function seedOf(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: tohumdan sabit bir sayı dizisi. */
function makeRng(s: string): Rng {
  let a = seedOf(s);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Çizim alanı: 320 × 200; üst kenarda kartın sıra numarası ve etiketi durur. İçerik (CX, CY) çevresine, ±125 × ±64 içine çizilir. */
const W = 320;
const H = 200;
const CX = 160;
const CY = 120;
/** Görünen pencere: kenar boşlukları kırpılır (oran 16:10 kalır), çizim kartta büyük görünür. */
const VIEW = `22 ${H - 172.5} ${W - 44} 172.5`;

const f = (n: number) => Math.round(n * 10) / 10;
const between = (r: Rng, a: number, b: number) => a + r() * (b - a);
const pick = <T,>(r: Rng, list: readonly T[]): T => list[Math.floor(r() * list.length)];
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const shuffle = <T,>(r: Rng, list: readonly T[]): T[] => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Tonlar: E1 alanın rengi, E2 orta, E3 açık, E4 en koyu (yazılar), BG sahnenin zemini. */
const E1 = 'var(--e1)';
const E2 = 'var(--e2)';
const E3 = 'var(--e3)';
const E4 = 'var(--e4)';
const BG = 'var(--e0)';
const SURF = 'var(--surface)';

/** Kıpırdama ayarı: üzerine gelince parçanın gideceği yer (CSS değişkenleri). */
function mv(dx = 0, dy = 0, rot = 0, scale = 1, delayMs = 0): CSSProperties {
  return {
    '--dx': `${f(dx)}px`,
    '--dy': `${f(dy)}px`,
    '--r': `${f(rot)}deg`,
    '--s': `${scale}`,
    '--gecikme': `${delayMs}ms`,
  } as CSSProperties;
}

/** Sahnenin ortası çevresinde dönen ya da büyüyen parçalar için (dilimler, ibreler). */
const AROUND = (x = 0, y = 0): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${CX + x}px ${CY + y}px` });

/** Kıpırdayan bir parça: dıştaki grup hareket eder, içerideki öğeler kendi dönüşlerini taşıyabilir. */
function M({ s, children, style }: { s: CSSProperties; children: ReactNode; style?: CSSProperties }) {
  return (
    <g className="amblem-oge" style={{ ...s, ...style }}>
      {children}
    </g>
  );
}

function T({ x, y, children, size = 16, fill = E4, weight }: { x: number; y: number; children: ReactNode; size?: number; fill?: string; weight?: number }) {
  return (
    <text x={f(x)} y={f(y)} dy="0.35em" textAnchor="middle" className="amblem-yazi" style={{ fill, fontSize: size, fontWeight: weight }}>
      {children}
    </text>
  );
}

function Tile({ x, y, s, fill = E3, rx, h }: { x: number; y: number; s: number; fill?: string; rx?: number; h?: number }) {
  const hh = h ?? s;
  return <rect x={f(x - s / 2)} y={f(y - hh / 2)} width={f(s)} height={f(hh)} rx={f(rx ?? s * 0.24)} style={{ fill }} />;
}

/** Kesik çizgili soru kutusu: eksik parça. */
function Missing({ x, y, s, delay = 120 }: { x: number; y: number; s: number; delay?: number }) {
  return (
    <M s={mv(0, -3, 0, 1.08, delay)}>
      <rect x={f(x - s / 2)} y={f(y - s / 2)} width={f(s)} height={f(s)} rx={f(s * 0.24)} style={{ fill: BG, stroke: E1, strokeWidth: 2, strokeDasharray: '4 4' }} />
      <T x={x} y={y} size={s * 0.52} fill={E1}>
        ?
      </T>
    </M>
  );
}

function Arrow({ x1, y1, x2, y2, bend = 0, color = E2, width = 2.4, dashed = false }: { x1: number; y1: number; x2: number; y2: number; bend?: number; color?: string; width?: number; dashed?: boolean }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bend;
  // Ucun yönü: eğrinin sondaki teğeti.
  const ang = Math.atan2(y2 - my, x2 - mx);
  const a1 = ang + Math.PI * 0.82;
  const a2 = ang - Math.PI * 0.82;
  const L = 7;
  return (
    <>
      <path d={`M${f(x1)} ${f(y1)}Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}`} style={{ fill: 'none', stroke: color, strokeWidth: width, strokeLinecap: 'round', strokeDasharray: dashed ? '4 5' : undefined }} />
      <path
        d={`M${f(x2 + Math.cos(a1) * L)} ${f(y2 + Math.sin(a1) * L)}L${f(x2)} ${f(y2)}L${f(x2 + Math.cos(a2) * L)} ${f(y2 + Math.sin(a2) * L)}`}
        style={{ fill: 'none', stroke: color, strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round' }}
      />
    </>
  );
}

/** Kapalı, yumuşak eğri (Catmull-Rom). */
function smoothClosed(pts: [number, number][]): string {
  const n = pts.length;
  const p = (i: number) => pts[(i + n) % n];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    d += `C${f(x1 + (x2 - x0) / 6)} ${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)} ${f(y2 - (y3 - y1) / 6)} ${f(x2)} ${f(y2)}`;
  }
  return `${d}Z`;
}

/** Açık, yumuşak eğri (Catmull-Rom). */
function smoothOpen(pts: [number, number][]): string {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(x1 + (x2 - x0) / 6)} ${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)} ${f(y2 - (y3 - y1) / 6)} ${f(x2)} ${f(y2)}`;
  }
  return d;
}

function blobPoints(r: Rng, cx: number, cy: number, rad: number, n = 7, jitter = 0.2): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + between(r, -0.18, 0.18);
    const rr = rad * between(r, 1 - jitter, 1 + jitter);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}
const blob = (r: Rng, cx: number, cy: number, rad: number, n = 7, jitter = 0.2) => smoothClosed(blobPoints(r, cx, cy, rad, n, jitter));

type Glyph = 'circle' | 'ring' | 'square' | 'diamond' | 'half' | 'plus' | 'tri' | 'tri-down';
const GLYPHS: Glyph[] = ['circle', 'ring', 'square', 'diamond', 'half', 'plus', 'tri'];

function glyph(kind: Glyph, x: number, y: number, s: number, color: string, key?: string | number): ReactNode {
  const k = s / 2;
  const fill = { fill: color };
  switch (kind) {
    case 'circle':
      return <circle key={key} cx={f(x)} cy={f(y)} r={f(k * 0.8)} style={fill} />;
    case 'ring':
      return <circle key={key} cx={f(x)} cy={f(y)} r={f(k * 0.64)} style={{ fill: 'none', stroke: color, strokeWidth: f(s * 0.17) }} />;
    case 'square':
      return <rect key={key} x={f(x - k * 0.72)} y={f(y - k * 0.72)} width={f(k * 1.44)} height={f(k * 1.44)} rx={f(s * 0.14)} style={fill} />;
    case 'diamond':
      return <path key={key} d={`M${f(x)} ${f(y - k * 0.9)}L${f(x + k * 0.9)} ${f(y)}L${f(x)} ${f(y + k * 0.9)}L${f(x - k * 0.9)} ${f(y)}Z`} style={fill} />;
    case 'half':
      return <path key={key} d={`M${f(x - k * 0.82)} ${f(y + k * 0.32)}A${f(k * 0.82)} ${f(k * 0.82)} 0 0 1 ${f(x + k * 0.82)} ${f(y + k * 0.32)}Z`} style={fill} />;
    case 'plus': {
      const t = k * 0.28;
      const L = k * 0.82;
      return (
        <path
          key={key}
          d={`M${f(x - t)} ${f(y - L)}H${f(x + t)}V${f(y - t)}H${f(x + L)}V${f(y + t)}H${f(x + t)}V${f(y + L)}H${f(x - t)}V${f(y + t)}H${f(x - L)}V${f(y - t)}H${f(x - t)}Z`}
          style={fill}
        />
      );
    }
    case 'tri':
      return <path key={key} d={`M${f(x)} ${f(y - k * 0.86)}L${f(x + k * 0.9)} ${f(y + k * 0.7)}L${f(x - k * 0.9)} ${f(y + k * 0.7)}Z`} style={fill} />;
    case 'tri-down':
      return <path key={key} d={`M${f(x)} ${f(y + k * 0.86)}L${f(x + k * 0.9)} ${f(y - k * 0.7)}L${f(x - k * 0.9)} ${f(y - k * 0.7)}Z`} style={fill} />;
  }
}

/* ------------------------------------------------------------------ Kişilik */

/** Profil: testin ölçtüğü boyut sayısı kadar köşe; yanında birkaç boyutun çubuğu. */
function radar(r: Rng, n: number, soft = false): ReactNode {
  const cx = -50;
  const R = 58;
  const ang = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / n;
  const poly = (k: number) => Array.from({ length: n }, (_, i) => `${f(cx + Math.cos(ang(i)) * R * k)},${f(Math.sin(ang(i)) * R * k)}`).join(' ');
  const vals = Array.from({ length: n }, () => between(r, 0.42, 0.97));
  const pts: [number, number][] = vals.map((v, i) => [cx + Math.cos(ang(i)) * R * v, Math.sin(ang(i)) * R * v]);
  const rows = Math.min(n, 5);
  return (
    <>
      {[1, 0.66, 0.33].map((k) => (
        <polygon key={k} points={poly(k)} style={{ fill: k === 1 ? BG : 'none', stroke: k === 1 ? E2 : E3, strokeWidth: k === 1 ? 1.6 : 1.3, strokeLinejoin: 'round' }} />
      ))}
      {n <= 16 &&
        Array.from({ length: n }, (_, i) => (
          <line key={i} x1={cx} y1={0} x2={f(cx + Math.cos(ang(i)) * R)} y2={f(Math.sin(ang(i)) * R)} style={{ stroke: E3, strokeWidth: 1 }} />
        ))}
      <M s={mv(0, 0, 0, 1.07)} style={AROUND(cx, 0)}>
        <path
          d={soft ? smoothClosed(pts) : `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`}
          style={{ fill: E2, fillOpacity: 0.55, stroke: E1, strokeWidth: 2.6, strokeLinejoin: 'round' }}
        />
        {n <= 12 && pts.map(([x, y], i) => <circle key={i} cx={f(x)} cy={f(y)} r={3.6} style={{ fill: E4 }} />)}
      </M>
      {Array.from({ length: rows }, (_, i) => {
        const y = -44 + (i * 88) / Math.max(1, rows - 1);
        const len = 96 * vals[i];
        return (
          <g key={`b${i}`}>
            <rect x={30} y={f(y - 5)} width={96} height={10} rx={5} style={{ fill: E3 }} />
            <M s={mv(0, 0, 0, 1, i * 60)}>
              <rect x={30} y={f(y - 5)} width={f(len)} height={10} rx={5} style={{ fill: i === 0 ? E1 : E2 }} />
            </M>
          </g>
        );
      })}
    </>
  );
}

/** Kişilerarası tarz: sekiz dilimli çember. */
function circumplex(r: Rng): ReactNode {
  const n = 8;
  const R = 62;
  const radii = Array.from({ length: n }, () => between(r, 26, 60));
  const top = [...radii].sort((a, b) => b - a).slice(0, 2);
  return (
    <>
      <circle cx={0} cy={0} r={R} style={{ fill: BG, stroke: E3, strokeWidth: 1.4, strokeDasharray: '3 5' }} />
      {radii.map((rad, i) => {
        const a0 = -Math.PI / 2 + (i * Math.PI * 2) / n + 0.035;
        const a1 = -Math.PI / 2 + ((i + 1) * Math.PI * 2) / n - 0.035;
        const d = `M0 0L${f(Math.cos(a0) * rad)} ${f(Math.sin(a0) * rad)}A${f(rad)} ${f(rad)} 0 0 1 ${f(Math.cos(a1) * rad)} ${f(Math.sin(a1) * rad)}Z`;
        return (
          <M key={i} s={mv(0, 0, 0, 1.07, i * 40)} style={AROUND()}>
            <path d={d} style={{ fill: top.includes(rad) ? E1 : i % 2 ? E2 : E3, stroke: BG, strokeWidth: 1 }} />
          </M>
        );
      })}
      <circle cx={0} cy={0} r={9} style={{ fill: BG }} />
      <circle cx={-96} cy={-30} r={6} style={{ fill: E2 }} />
      <circle cx={100} cy={34} r={9} style={{ fill: E3 }} />
    </>
  );
}

/** İç içe geçen "şekiller" (açılıştaki canlı şeklin akrabası). */
function blobs(r: Rng): ReactNode {
  const side = r() < 0.5 ? -1 : 1;
  const big = { x: side * between(r, 6, 26), y: between(r, -6, 6), rad: between(r, 50, 58) };
  const mid = { x: big.x - side * between(r, 70, 86), y: between(r, -26, 26), rad: between(r, 26, 34) };
  const a = between(r, 0, Math.PI * 2);
  return (
    <>
      <M s={mv(-side * 5, 3, -8)}>
        <path d={blob(r, big.x - side * 6, big.y + 4, big.rad * 1.22, 8, 0.12)} style={{ fill: 'none', stroke: E2, strokeWidth: 1.6, strokeDasharray: '3 6' }} />
      </M>
      <M s={mv(side * 4, -3, 10, 1.04)}>
        <path d={blob(r, big.x, big.y, big.rad)} style={{ fill: E2 }} />
      </M>
      <M s={mv(side * 3, -2, -6, 1.04, 30)}>
        <path d={blob(r, big.x + side * 8, big.y + 6, big.rad * 0.55, 6, 0.2)} style={{ fill: E1 }} />
      </M>
      <M s={mv(side * 10, -6, -16, 1.06, 60)}>
        <path d={blob(r, mid.x, mid.y, mid.rad, 6, 0.24)} style={{ fill: E3 }} />
      </M>
      <M s={mv(-side * 8, -8, 24, 1.12, 90)}>
        <circle cx={f(big.x + Math.cos(a) * big.rad)} cy={f(clamp(big.y + Math.sin(a) * big.rad * 0.9, -54, 54))} r={8} style={{ fill: E4 }} />
      </M>
    </>
  );
}

/** Düşünmeyi sevme: düşünce bulutu ve içinde bir sarmal. */
function thought(r: Rng): ReactNode {
  const spiral: [number, number][] = [];
  for (let i = 0; i <= 44; i++) {
    const t = i / 44;
    const a = t * Math.PI * 5.2;
    const rad = 4 + t * 28;
    spiral.push([24 + Math.cos(a) * rad, -8 + Math.sin(a) * rad * 0.8]);
  }
  return (
    <>
      <M s={mv(0, -3, 0, 1.03)}>
        <path d={blob(r, 24, -8, 54, 10, 0.12)} style={{ fill: E3 }} />
      </M>
      <M s={mv(0, 0, 40, 1.06, 60)} style={AROUND(24, -8)}>
        <path d={smoothOpen(spiral)} style={{ fill: 'none', stroke: E1, strokeWidth: 3.4, strokeLinecap: 'round' }} />
      </M>
      <M s={mv(-3, 3, 0, 1, 90)}>
        <circle cx={-52} cy={40} r={11} style={{ fill: E2 }} />
      </M>
      <M s={mv(-5, 5, 0, 1, 140)}>
        <circle cx={-78} cy={54} r={6} style={{ fill: E2 }} />
      </M>
      <circle cx={92} cy={-46} r={4} style={{ fill: E1 }} />
      <circle cx={104} cy={-30} r={2.6} style={{ fill: E2 }} />
    </>
  );
}

/** Heyecan arayışı: tepeleri olan bir ray ve üstünde bir vagon. */
function peaks(r: Rng): ReactNode {
  const pts: [number, number][] = [
    [-124, 40],
    [-88, between(r, -10, 10)],
    [-56, 44],
    [-14, between(r, -52, -40)],
    [26, 46],
    [62, between(r, -24, -6)],
    [96, 36],
    [124, 20],
  ];
  const peak = pts[3];
  return (
    <>
      {Array.from({ length: 15 }, (_, i) => {
        const x = -112 + i * 16;
        return <line key={i} x1={x} y1={60} x2={x} y2={20} style={{ stroke: E3, strokeWidth: 2 }} />;
      })}
      <line x1={-124} y1={60} x2={124} y2={60} style={{ stroke: E3, strokeWidth: 3, strokeLinecap: 'round' }} />
      <path d={smoothOpen(pts)} style={{ fill: 'none', stroke: E1, strokeWidth: 4.5, strokeLinecap: 'round' }} />
      <M s={mv(14, 10, 18, 1, 40)}>
        <rect x={f(peak[0] - 13)} y={f(peak[1] - 20)} width={26} height={15} rx={5} style={{ fill: E4 }} />
        <circle cx={f(peak[0] - 7)} cy={f(peak[1] - 4)} r={3.4} style={{ fill: E2 }} />
        <circle cx={f(peak[0] + 7)} cy={f(peak[1] - 4)} r={3.4} style={{ fill: E2 }} />
      </M>
      {[0, 1, 2].map((i) => (
        <line key={`h${i}`} x1={f(peak[0] - 40 - i * 4)} y1={f(peak[1] - 22 + i * 7)} x2={f(peak[0] - 22 - i * 4)} y2={f(peak[1] - 22 + i * 7)} style={{ stroke: E2, strokeWidth: 2.2, strokeLinecap: 'round' }} />
      ))}
    </>
  );
}

/** İyimserlik: ufuktan doğan güneş. */
function sun(r: Rng): ReactNode {
  const hy = 46;
  const x = between(r, -20, 20);
  return (
    <>
      <M s={mv(0, -8, 0, 1, 0)}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI + (i + 0.5) * (Math.PI / 9);
          return (
            <line key={i} x1={f(x + Math.cos(a) * 66)} y1={f(hy + Math.sin(a) * 66)} x2={f(x + Math.cos(a) * 82)} y2={f(hy + Math.sin(a) * 82)} style={{ stroke: E2, strokeWidth: 4.5, strokeLinecap: 'round' }} />
          );
        })}
        <path d={`M${f(x - 56)} ${hy}A56 56 0 0 1 ${f(x + 56)} ${hy}Z`} style={{ fill: E3 }} />
        <path d={`M${f(x - 40)} ${hy}A40 40 0 0 1 ${f(x + 40)} ${hy}Z`} style={{ fill: E1 }} />
      </M>
      <rect x={-130} y={hy} width={260} height={30} style={{ fill: BG }} />
      <line x1={-124} y1={hy} x2={124} y2={hy} style={{ stroke: E4, strokeWidth: 3, strokeLinecap: 'round' }} />
      <line x1={-100} y1={hy + 12} x2={-40} y2={hy + 12} style={{ stroke: E3, strokeWidth: 3, strokeLinecap: 'round' }} />
      <line x1={50} y1={hy + 12} x2={108} y2={hy + 12} style={{ stroke: E3, strokeWidth: 3, strokeLinecap: 'round' }} />
    </>
  );
}

/** Empati: iki dairenin buluştuğu yer. */
function venn2(): ReactNode {
  const d = 27;
  const R = 48;
  const h = Math.sqrt(R * R - d * d);
  return (
    <>
      <M s={mv(-6, 0)}>
        <circle cx={-d} cy={0} r={R} style={{ fill: E2 }} />
      </M>
      <M s={mv(6, 0)}>
        <circle cx={d} cy={0} r={R} style={{ fill: E3 }} />
      </M>
      <M s={mv(0, 0, 0, 1.1, 80)}>
        <path d={`M0 ${f(-h)}A${R} ${R} 0 0 1 0 ${f(h)}A${R} ${R} 0 0 1 0 ${f(-h)}Z`} style={{ fill: E1 }} />
      </M>
      <circle cx={-104} cy={-34} r={5} style={{ fill: E2 }} />
      <circle cx={106} cy={38} r={5} style={{ fill: E2 }} />
    </>
  );
}

/** Öz-yeterlik: tırmanılan bir dağ ve zirvede bayrak. */
function summit(r: Rng): ReactNode {
  const sx = between(r, 10, 34);
  const sy = -30;
  const climb: [number, number][] = [
    [-104, 58],
    [-70, 40],
    [-46, 46],
    [-22, 14],
    [-6, 18],
    [sx, sy],
  ];
  return (
    <>
      <path d={`M-128 62L-50 -16L30 62Z`} style={{ fill: E3 }} />
      <path d={`M-70 62L${f(sx)} ${sy}L126 62Z`} style={{ fill: E2 }} />
      <path d={`M${f(sx - 16)} ${f(sy + 18)}L${f(sx)} ${sy}L${f(sx + 18)} ${f(sy + 19)}L${f(sx + 6)} ${f(sy + 13)}L${f(sx - 4)} ${f(sy + 20)}Z`} style={{ fill: SURF, fillOpacity: 0.9 }} />
      <path d={smoothOpen(climb)} style={{ fill: 'none', stroke: E4, strokeWidth: 2.2, strokeDasharray: '3 5', strokeLinecap: 'round' }} />
      <line x1={f(sx)} y1={sy} x2={f(sx)} y2={-62} style={{ stroke: E4, strokeWidth: 2.6, strokeLinecap: 'round' }} />
      <M s={mv(0, 0, 0, 1.15, 60)} style={{ transformOrigin: 'left center' }}>
        <path d={`M${f(sx)} -62L${f(sx + 26)} -54L${f(sx)} -46Z`} style={{ fill: E1 }} />
      </M>
    </>
  );
}

/** Öz-denetim: dengede duran bir terazi. */
function balance(r: Rng, rightLabel?: string): ReactNode {
  const leftCount = pick(r, [2, 3]);
  return (
    <>
      <path d="M0 18L-22 60H22Z" style={{ fill: E2 }} />
      <line x1={-40} y1={60} x2={40} y2={60} style={{ stroke: E3, strokeWidth: 4, strokeLinecap: 'round' }} />
      <M s={mv(0, 0, -5, 1)} style={AROUND(0, 14)}>
        <rect x={-110} y={10} width={220} height={8} rx={4} style={{ fill: E4 }} />
        {Array.from({ length: leftCount }, (_, i) => (
          <rect key={i} x={-92} y={f(10 - (i + 1) * 22)} width={38} height={20} rx={5} style={{ fill: i % 2 ? E2 : E1 }} />
        ))}
        {rightLabel ? (
          <g>
            <rect x={52} y={f(10 - 2 * 22)} width={42} height={42} rx={9} style={{ fill: BG, stroke: E1, strokeWidth: 2, strokeDasharray: '4 4' }} />
            <T x={73} y={10 - 23} size={22} fill={E1}>
              {rightLabel}
            </T>
          </g>
        ) : (
          <circle cx={74} cy={-12} r={22} style={{ fill: E2 }} />
        )}
      </M>
      <circle cx={0} cy={14} r={5} style={{ fill: BG, stroke: E4, strokeWidth: 2 }} />
    </>
  );
}

/** Merak: büyütecin altında büyüyen noktalar. */
function magnifier(r: Rng): ReactNode {
  const dots = Array.from({ length: 16 }, () => [between(r, -120, 120), between(r, -56, 56)] as const);
  const lx = -14;
  const ly = -8;
  const LR = 42;
  return (
    <>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={f(x)} cy={f(y)} r={3} style={{ fill: E3 }} />
      ))}
      <M s={mv(10, -6, 0, 1)}>
        <circle cx={lx} cy={ly} r={LR} style={{ fill: BG }} />
        {dots
          .filter(([x, y]) => (x - lx) ** 2 + (y - ly) ** 2 < (LR - 8) ** 2)
          .map(([x, y], i) => (
            <circle key={i} cx={f(lx + (x - lx) * 1.25)} cy={f(ly + (y - ly) * 1.25)} r={6.5} style={{ fill: i % 2 ? E2 : E1 }} />
          ))}
        <circle cx={lx} cy={ly} r={LR} style={{ fill: 'none', stroke: E1, strokeWidth: 7 }} />
        <line x1={f(lx + LR * 0.72)} y1={f(ly + LR * 0.72)} x2={f(lx + LR * 1.5)} y2={f(ly + LR * 1.45)} style={{ stroke: E4, strokeWidth: 11, strokeLinecap: 'round' }} />
      </M>
      <path d="M98 -30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" style={{ fill: E1 }} />
    </>
  );
}

/** Liderlik: önde bayrağıyla biri, arkasında izleyenler. */
function lead(r: Rng): ReactNode {
  const ys = [40, 28, 16, 4, -10];
  const xs = [-104, -70, -36, -2, 44];
  return (
    <>
      <path d={smoothOpen(xs.map((x, i) => [x, ys[i] + 16] as [number, number]))} style={{ fill: 'none', stroke: E3, strokeWidth: 3, strokeDasharray: '2 7', strokeLinecap: 'round' }} />
      {xs.slice(0, 4).map((x, i) => (
        <M key={i} s={mv(6, 0, 0, 1, i * 50)}>
          <circle cx={x} cy={f(ys[i] - 8 + between(r, -2, 2))} r={8} style={{ fill: i % 2 ? E3 : E2 }} />
          <path d={`M${x - 12} ${ys[i] + 14}a12 12 0 0 1 24 0z`} style={{ fill: i % 2 ? E3 : E2 }} />
        </M>
      ))}
      <M s={mv(8, -4, 0, 1.04, 220)}>
        <circle cx={44} cy={-24} r={11} style={{ fill: E1 }} />
        <path d="M27 8a17 17 0 0 1 34 0z" style={{ fill: E1 }} />
        <line x1={70} y1={10} x2={70} y2={-52} style={{ stroke: E4, strokeWidth: 3, strokeLinecap: 'round' }} />
        <path d="M70 -52L104 -42L70 -32Z" style={{ fill: E2 }} />
      </M>
    </>
  );
}

/** Öz-saygı: bir şekil ve aynadaki yansıması. */
function mirror(r: Rng): ReactNode {
  const pts = blobPoints(r, -54, 0, 46, 7, 0.22);
  const mirrored = pts.map(([x, y]) => [-x, y] as [number, number]);
  return (
    <>
      <line x1={0} y1={-60} x2={0} y2={60} style={{ stroke: E2, strokeWidth: 2, strokeDasharray: '3 6', strokeLinecap: 'round' }} />
      <M s={mv(-6, 0, -6, 1.04)}>
        <path d={smoothClosed(pts)} style={{ fill: E1 }} />
        <circle cx={-60} cy={-10} r={9} style={{ fill: E3 }} />
      </M>
      <M s={mv(6, 0, 6, 1.04, 60)}>
        <path d={smoothClosed(mirrored)} style={{ fill: E3, stroke: E2, strokeWidth: 2, strokeDasharray: '4 4' }} />
      </M>
      <path d="M104 -28l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={{ fill: E1 }} />
    </>
  );
}

/* ------------------------------------------------------------------ Zekâ ve zihinsel beceriler */

/** Matris: satırı biçimi, sütunu tonu belirleyen bir desen; eksik parça ve yanda seçenekler. */
function matrix(r: Rng): ReactNode {
  const s = 32;
  const g = 10;
  const shapeOff = Math.floor(r() * GLYPHS.length);
  const toneOff = Math.floor(r() * 3);
  const tones = [E1, E2, E4];
  const row = (i: number) => GLYPHS[(shapeOff + i * 2) % GLYPHS.length];
  const tone = (j: number) => tones[(toneOff + j) % 3];
  const x0 = -100;
  const y0 = -(s + g) + 4;
  const out: ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = x0 + j * (s + g);
      const y = y0 + i * (s + g);
      if (i === 2 && j === 2) {
        out.push(<Missing key="m" x={x} y={y} s={s} />);
        continue;
      }
      out.push(
        <M key={`${i}${j}`} s={mv(0, -3, 0, 1, (i * 3 + j) * 30)}>
          <Tile x={x} y={y} s={s} fill={E3} />
          {glyph(row(i), x, y, s * 0.72, tone(j))}
        </M>,
      );
    }
  }
  const answer = Math.floor(r() * 3);
  const others = shuffle(r, GLYPHS.filter((k) => k !== row(2))).slice(0, 2);
  const options = [0, 1, 2].map((k) => (k === answer ? row(2) : others[k > answer ? k - 1 : k]));
  return (
    <>
      {out}
      <line x1={28} y1={-50} x2={28} y2={58} style={{ stroke: E3, strokeWidth: 1.6, strokeDasharray: '3 5' }} />
      {options.map((kind, k) => {
        const x = 54 + k * 34;
        return (
          <M key={`o${k}`} s={mv(0, k === answer ? -6 : 0, 0, k === answer ? 1.08 : 1, 200 + k * 40)}>
            <Tile x={x} y={4} s={28} fill={k === answer ? BG : E3} />
            {k === answer && <rect x={f(x - 17)} y={-13} width={34} height={34} rx={9} style={{ fill: 'none', stroke: E1, strokeWidth: 2.6 }} />}
            {glyph(kind, x, 4, 20, k === answer ? tone(2) : E2)}
          </M>
        );
      })}
    </>
  );
}

/** Şekil benzetmeleri: A, B'ye nasıl dönüşüyorsa C de öyle dönüşür. */
function analogy(r: Rng): ReactNode {
  const s = 46;
  const kind = pick(r, ['grow', 'fill', 'turn'] as const);
  const a = pick(r, ['circle', 'square', 'diamond'] as const);
  const c = pick(r, ['tri', 'half', 'plus'] as const);
  const left = (shape: Glyph, x: number) =>
    kind === 'grow' ? glyph(shape, x, 0, 18, E1) : kind === 'fill' ? glyph('ring', x, 0, 26, E1) : glyph('tri', x, 0, 26, E1);
  const right = (shape: Glyph, x: number) =>
    kind === 'grow' ? glyph(shape, x, 0, 36, E1) : kind === 'fill' ? glyph('circle', x, 0, 30, E1) : glyph('tri-down', x, 0, 26, E1);
  return (
    <>
      <M s={mv(0, -4, 0, 1, 0)}>
        <Tile x={-102} y={0} s={s} />
        {left(a, -102)}
      </M>
      <M s={mv(0, -4, 0, 1, 60)}>
        <Tile x={-46} y={0} s={s} />
        {right(a, -46)}
      </M>
      <Arrow x1={-84} y1={-34} x2={-64} y2={-34} bend={8} />
      {[-9, 9].map((y) => (
        <g key={y}>
          <circle cx={-7} cy={y} r={3.4} style={{ fill: E2 }} />
          <circle cx={7} cy={y} r={3.4} style={{ fill: E2 }} />
        </g>
      ))}
      <M s={mv(0, -4, 0, 1, 120)}>
        <Tile x={46} y={0} s={s} />
        {kind === 'grow' ? glyph(c, 46, 0, 18, E2) : kind === 'fill' ? glyph('ring', 46, 0, 26, E2) : glyph('tri', 46, 0, 26, E2)}
      </M>
      <Arrow x1={64} y1={-34} x2={84} y2={-34} bend={8} />
      <Missing x={102} y={0} s={s} delay={180} />
    </>
  );
}

const TR_ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

/** Diziler: kurala göre ilerleyen kutular; kutuların üstünde kural, sonuncusu soru. */
function sequence(items: string[], rule: string, small = false): ReactNode {
  const s = 40;
  const step = 50;
  const xs = items.map((_, i) => -100 + i * step);
  return (
    <>
      {xs.slice(0, -1).map((x, i) => (
        <g key={`a${i}`}>
          <path d={`M${f(x + 8)} -14Q${f(x + step / 2)} -34 ${f(x + step - 8)} -14`} style={{ fill: 'none', stroke: E2, strokeWidth: 1.8, strokeLinecap: 'round' }} />
          <T x={x + step / 2} y={-35} size={12} fill={E4} weight={800}>
            {rule}
          </T>
        </g>
      ))}
      {items.map((it, i) =>
        i === items.length - 1 ? (
          <Missing key={i} x={xs[i]} y={16} s={s} delay={i * 70} />
        ) : (
          <M key={i} s={mv(0, -7, 0, 1, i * 70)}>
            <Tile x={xs[i]} y={16} s={s} fill={i === 0 ? E1 : E3} />
            <T x={xs[i]} y={16} size={small ? 16 : 19} fill={i === 0 ? SURF : E4}>
              {it}
            </T>
          </M>
        ),
      )}
      <line x1={-120} y1={52} x2={120} y2={52} style={{ stroke: E3, strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '1 7' }} />
    </>
  );
}

function letterSeq(r: Rng): ReactNode {
  const stepN = pick(r, [1, 2, 3]);
  const start = Math.floor(r() * (TR_ALPHABET.length - stepN * 4));
  const items = Array.from({ length: 5 }, (_, i) => TR_ALPHABET[start + i * stepN]);
  return sequence(items, `+${stepN}`);
}

function numberSeq(r: Rng): ReactNode {
  if (r() < 0.35) {
    const a = pick(r, [1, 2, 3]);
    return sequence(Array.from({ length: 5 }, (_, i) => String(a * 2 ** i)), '×2');
  }
  const d = pick(r, [2, 3, 4, 5, 6, 7]);
  const a = 1 + Math.floor(r() * 9);
  return sequence(Array.from({ length: 5 }, (_, i) => String(a + i * d)), `+${d}`);
}

/** Zihinden hesaplama: bir işlem ve yanında hız çizgileri. */
function arithmetic(r: Rng): ReactNode {
  const op = pick(r, ['+', '−', '×'] as const);
  const a = op === '×' ? 2 + Math.floor(r() * 7) : 11 + Math.floor(r() * 38);
  const b = op === '×' ? 2 + Math.floor(r() * 7) : 2 + Math.floor(r() * 9);
  return (
    <>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={-128} y1={-14 + i * 14} x2={f(-128 + 14 - i * 4)} y2={-14 + i * 14} style={{ stroke: E2, strokeWidth: 3, strokeLinecap: 'round' }} />
      ))}
      <M s={mv(0, -6, 0, 1, 0)}>
        <Tile x={-84} y={0} s={48} fill={E1} />
        <T x={-84} y={0} size={21} fill={SURF}>
          {a}
        </T>
      </M>
      <T x={-42} y={0} size={26} fill={E2}>
        {op}
      </T>
      <M s={mv(0, -6, 0, 1, 70)}>
        <Tile x={0} y={0} s={48} />
        <T x={0} y={0} size={21}>
          {b}
        </T>
      </M>
      <T x={42} y={0} size={26} fill={E2}>
        =
      </T>
      <Missing x={88} y={0} s={48} delay={140} />
    </>
  );
}

/** Sözel beceriler: harf taşları. */
function wordTiles(r: Rng, name: string): ReactNode {
  const word = (name.split(/[\s:]+/)[0] ?? 'KELİME').toLocaleUpperCase('tr-TR').slice(0, 6);
  const letters = [...word];
  const s = 36;
  const step = 42;
  const x0 = -((letters.length - 1) * step) / 2;
  const lift = Math.floor(r() * letters.length);
  return (
    <>
      <rect x={-128} y={30} width={256} height={10} rx={5} style={{ fill: E2 }} />
      <rect x={-128} y={40} width={256} height={6} rx={3} style={{ fill: E3 }} />
      {letters.map((ch, i) => {
        const x = x0 + i * step;
        const up = i === lift;
        const rot = up ? between(r, -10, 10) : between(r, -2.5, 2.5);
        return (
          <M key={i} s={mv(0, up ? -8 : -3, up ? -rot : 0, 1, i * 45)}>
            <g transform={`rotate(${f(rot)} ${f(x)} ${up ? -16 : 6})`}>
              <Tile x={x} y={up ? -16 : 6} s={s} fill={up ? E1 : E3} rx={7} />
              <T x={x} y={up ? -17 : 5} size={19} fill={up ? SURF : E4}>
                {ch}
              </T>
              <T x={x + 11} y={up ? -5 : 17} size={8} fill={up ? SURF : E2}>
                {1 + ((i * 3 + lift) % 9)}
              </T>
            </g>
          </M>
        );
      })}
    </>
  );
}

/** Kâğıt katlama: katlanıp delinen kâğıt ve açılınca delikler. */
function fold(r: Rng): ReactNode {
  const hy = between(r, -14, 14);
  const hx = between(r, -20, -8);
  return (
    <>
      <M s={mv(-4, -4, -4)}>
        <rect x={-108} y={-34} width={34} height={68} rx={4} style={{ fill: E3 }} />
        <path d="M-74 -34H-46L-58 34H-74Z" style={{ fill: E2 }} />
        <line x1={-74} y1={-34} x2={-74} y2={34} style={{ stroke: E4, strokeWidth: 1.6, strokeDasharray: '3 3' }} />
        <circle cx={f(-74 + hx)} cy={f(hy)} r={6} style={{ fill: BG, stroke: E1, strokeWidth: 2.4 }} />
      </M>
      <Arrow x1={-30} y1={0} x2={2} y2={0} bend={10} />
      <M s={mv(4, -4, 4, 1, 80)}>
        <rect x={28} y={-40} width={92} height={80} rx={5} style={{ fill: E3 }} />
        <line x1={74} y1={-40} x2={74} y2={40} style={{ stroke: E2, strokeWidth: 1.6, strokeDasharray: '3 4' }} />
        <circle cx={f(74 + hx)} cy={f(hy)} r={6.5} style={{ fill: E1 }} />
        <circle cx={f(74 - hx)} cy={f(hy)} r={6.5} style={{ fill: E1 }} />
      </M>
    </>
  );
}

const POLYOMINOES: [number, number][][] = [
  [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]],
];

function cellsAt(cells: [number, number][], cx: number, cy: number, s: number) {
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const ox = cx - ((Math.min(...xs) + Math.max(...xs) + 1) * s) / 2;
  const oy = cy - ((Math.min(...ys) + Math.max(...ys) + 1) * s) / 2;
  return cells.map(([x, y]) => [ox + x * s, oy + y * s] as const);
}

/** Zihinde döndürme: bir şekil ve döndürülmüş hâli. */
function rotate2d(r: Rng): ReactNode {
  const shape = pick(r, POLYOMINOES);
  const s = 23;
  const rotated = shape.map(([x, y]) => [-y, x] as [number, number]);
  return (
    <>
      <M s={mv(-4, -3, -8)}>
        {cellsAt(shape, -64, 4, s).map(([x, y], i) => (
          <rect key={i} x={f(x)} y={f(y)} width={s} height={s} rx={3} style={{ fill: i === 0 ? E4 : i % 2 ? E1 : E2, stroke: BG, strokeWidth: 2 }} />
        ))}
      </M>
      <Arrow x1={-22} y1={-46} x2={22} y2={-46} bend={14} />
      <M s={mv(4, -3, 8, 1, 90)}>
        {cellsAt(rotated, 64, 4, s).map(([x, y], i) => (
          <rect key={i} x={f(x)} y={f(y)} width={s} height={s} rx={3} style={{ fill: BG, stroke: E1, strokeWidth: 1.8, strokeDasharray: '3.5 3' }} />
        ))}
      </M>
    </>
  );
}

const ISO_SHAPES = [
  [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
  [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 0, 1]],
  [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 0, 1]],
  [[0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 1, 1]],
  [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]],
] as const;

type Faces = { top: string; left: string; right: string };

function isoFaces(cells: readonly (readonly number[])[], a: number, cx: number, cy: number, mirror = false): Faces[] {
  const c = a * 0.866;
  const project = (i: number, j: number, k: number): [number, number] => [(i - j) * c, ((i + j) * a) / 2 - k * a];
  const list = cells.map(([i, j, k]) => (mirror ? [j, i, k] : [i, j, k])).sort((p, q) => p[0] + p[1] - (q[0] + q[1]) || p[2] - q[2]);
  const raw = list.map(([i, j, k]) => {
    const P = (di: number, dj: number, dk: number) => project(i + di, j + dj, k + dk);
    return {
      top: [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)],
      right: [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)],
      left: [P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)],
    };
  });
  const pts = raw.flatMap((fc) => [...fc.top, ...fc.left, ...fc.right]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const dx = cx - (Math.min(...xs) + Math.max(...xs)) / 2;
  const dy = cy - (Math.min(...ys) + Math.max(...ys)) / 2;
  const poly = (ps: [number, number][]) => ps.map(([x, y]) => `${f(x + dx)},${f(y + dy)}`).join(' ');
  return raw.map((fc) => ({ top: poly(fc.top), left: poly(fc.left), right: poly(fc.right) }));
}

function Solid({ faces }: { faces: Faces[] }) {
  return faces.map((fc, i) => (
    <g key={i} style={{ stroke: BG, strokeWidth: 1.4, strokeLinejoin: 'round' }}>
      <polygon points={fc.top} style={{ fill: E3 }} />
      <polygon points={fc.left} style={{ fill: E2 }} />
      <polygon points={fc.right} style={{ fill: E1 }} />
    </g>
  ));
}

function Ghost({ faces }: { faces: Faces[] }) {
  return faces.map((fc, i) => (
    <g key={i} style={{ fill: BG, stroke: E1, strokeWidth: 1.6, strokeDasharray: '3.5 3', strokeLinejoin: 'round' }}>
      <polygon points={fc.top} />
      <polygon points={fc.left} />
      <polygon points={fc.right} />
    </g>
  ));
}

/** Üç boyutlu döndürme: küplerden bir yapı ve döndürülmüş hâli. */
function cubes(r: Rng): ReactNode {
  const shape = pick(r, ISO_SHAPES);
  return (
    <>
      <M s={mv(-6, -4, -5)}>
        <Solid faces={isoFaces(shape, 27, -66, 8)} />
      </M>
      <Arrow x1={-22} y1={-48} x2={22} y2={-48} bend={14} />
      <M s={mv(6, -4, 5, 1, 90)}>
        <Ghost faces={isoFaces(shape, 27, 66, 8, true)} />
      </M>
    </>
  );
}

/** Küp açınımı: açılmış küp ve katlanmış hâli. */
function cubeNet(r: Rng): ReactNode {
  const nets: [number, number][][] = [
    [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]],
    [[1, 0], [1, 1], [0, 1], [2, 1], [2, 2], [3, 2]],
  ];
  const cells = pick(r, nets);
  const s = 23;
  const tones = shuffle(r, [E1, E2, E3, E4, E2, E3]);
  return (
    <>
      <M s={mv(-4, -3)}>
        {cellsAt(cells, -66, 4, s).map(([x, y], i) => (
          <g key={i}>
            <rect x={f(x)} y={f(y)} width={s} height={s} rx={2.5} style={{ fill: tones[i], stroke: BG, strokeWidth: 2 }} />
            {i === 2 && <circle cx={f(x + s / 2)} cy={f(y + s / 2)} r={3.4} style={{ fill: SURF }} />}
          </g>
        ))}
      </M>
      <Arrow x1={-10} y1={4} x2={20} y2={4} bend={12} />
      <M s={mv(4, -3, 6, 1, 90)}>
        {isoFaces([[0, 0, 0]], 46, 74, 4).map((fc, i) => (
          <g key={i} style={{ stroke: BG, strokeWidth: 2, strokeLinejoin: 'round' }}>
            <polygon points={fc.top} style={{ fill: tones[0] }} />
            <polygon points={fc.left} style={{ fill: tones[1] }} />
            <polygon points={fc.right} style={{ fill: tones[2] }} />
          </g>
        ))}
        <circle cx={f(74 + 46 * 0.866 * 0.5)} cy={f(4 + 46 * 0.25 + 4)} r={3.6} style={{ fill: SURF }} />
      </M>
    </>
  );
}

/** Bakış açısı alma: yukarıdan görülen bir yer ve bakan biri. */
function viewpoint(r: Rng): ReactNode {
  const vx = between(r, -30, 0);
  const vy = 30;
  const tx = 72;
  const ty = -26;
  const a = Math.atan2(ty - vy, tx - vx);
  const L = 78;
  const spread = 0.32;
  return (
    <>
      <rect x={-124} y={-50} width={248} height={110} rx={18} style={{ fill: 'none', stroke: E3, strokeWidth: 1.6, strokeDasharray: '3 6' }} />
      <circle cx={-76} cy={-24} r={17} style={{ fill: E2 }} />
      <circle cx={-82} cy={-30} r={6} style={{ fill: E3 }} />
      <path d={blob(r, -78, 34, 14, 6, 0.2)} style={{ fill: E3 }} />
      <rect x={58} y={-40} width={28} height={28} rx={4} style={{ fill: E2 }} />
      <path d="M54 -40L72 -56L90 -40Z" style={{ fill: E4 }} />
      <M s={mv(0, 0, 0, 1.12)} style={AROUND(vx, vy)}>
        <path
          d={`M${f(vx)} ${vy}L${f(vx + Math.cos(a - spread) * L)} ${f(vy + Math.sin(a - spread) * L)}A${L} ${L} 0 0 1 ${f(vx + Math.cos(a + spread) * L)} ${f(vy + Math.sin(a + spread) * L)}Z`}
          style={{ fill: E1, fillOpacity: 0.22 }}
        />
      </M>
      <line x1={f(vx)} y1={vy} x2={f(tx - 8)} y2={f(ty + 18)} style={{ stroke: E1, strokeWidth: 2.2, strokeDasharray: '4 4', strokeLinecap: 'round' }} />
      <circle cx={f(vx)} cy={vy} r={10} style={{ fill: E1 }} />
      <circle cx={f(vx + Math.cos(a) * 4)} cy={f(vy + Math.sin(a) * 4)} r={3.2} style={{ fill: SURF }} />
    </>
  );
}

/** Gizli şekiller: aranan şekil ve onu saklayan karmaşık çizim. */
function hidden(r: Rng): ReactNode {
  const flip = r() < 0.5;
  const tri = flip ? 'M34 -30L74 22L-6 22Z' : 'M14 -30L74 -30L44 22Z';
  return (
    <>
      <Tile x={-92} y={0} s={58} />
      <path d={flip ? 'M-92 -16L-74 12H-110Z' : 'M-108 -14H-76L-92 12Z'} style={{ fill: 'none', stroke: E4, strokeWidth: 3.2, strokeLinejoin: 'round' }} />
      <g style={{ fill: 'none', stroke: E2, strokeWidth: 2, strokeLinejoin: 'round' }}>
        <rect x={-26} y={-46} width={140} height={92} rx={4} />
        <path d="M-26 -46L114 46M-26 46L114 -46M44 -46V46M-26 0H114" />
        <path d="M-6 -30L54 -4L-6 22Z" />
        <circle cx={84} cy={10} r={22} />
      </g>
      <M s={mv(0, -4, 0, 1.06, 60)}>
        <path d={tri} style={{ fill: E1, fillOpacity: 0.18, stroke: E1, strokeWidth: 4, strokeLinejoin: 'round' }} />
      </M>
    </>
  );
}

/** Parçalardan şekil: dağınık parçalar ve birleşince oluşan bütün. */
function pieces(r: Rng): ReactNode {
  const q = (cx: number, cy: number, rad: number, rot: number, fill: string, key: number) => (
    <g key={key} transform={`rotate(${f(rot)} ${f(cx)} ${f(cy)})`}>
      <path d={`M${f(cx)} ${f(cy)}L${f(cx + rad)} ${f(cy)}A${rad} ${rad} 0 0 1 ${f(cx)} ${f(cy + rad)}Z`} style={{ fill }} />
    </g>
  );
  const rots = Array.from({ length: 3 }, () => between(r, -60, 60));
  return (
    <>
      <M s={mv(6, -4, 10)}>{q(-96, -22, 28, rots[0], E1, 0)}</M>
      <M s={mv(6, 4, -10, 1, 60)}>{q(-60, 20, 28, rots[1] + 180, E2, 1)}</M>
      <M s={mv(-4, -4, 8, 1, 120)}>{q(-104, 38, 28, rots[2] + 90, E4, 2)}</M>
      <Arrow x1={-30} y1={4} x2={4} y2={4} bend={12} />
      <circle cx={72} cy={4} r={46} style={{ fill: BG, stroke: E1, strokeWidth: 1.8, strokeDasharray: '4 4' }} />
      {q(72, 4, 44, 180, E2, 3)}
      {q(72, 4, 44, 270, E1, 4)}
      {q(72, 4, 44, 0, E4, 5)}
    </>
  );
}

/** Bellek: sırayla yanan kutular ve aralarındaki yol. */
function corsi(r: Rng, labels?: string[]): ReactNode {
  const cols = 4;
  const rows = 3;
  const s = 32;
  const g = 9;
  const x0 = -((cols * s + (cols - 1) * g) / 2) + s / 2;
  const y0 = -((rows * s + (rows - 1) * g) / 2) + s / 2;
  const count = labels?.length ?? pick(r, [3, 4, 4]);
  const order = shuffle(r, Array.from({ length: cols * rows }, (_, i) => i)).slice(0, count);
  const at = (c: number): [number, number] => [x0 + (c % cols) * (s + g), y0 + Math.floor(c / cols) * (s + g)];
  const path = order.map((c, i) => `${i === 0 ? 'M' : 'L'}${f(at(c)[0])} ${f(at(c)[1])}`).join('');
  return (
    <>
      {Array.from({ length: cols * rows }, (_, c) => (order.includes(c) ? null : <Tile key={c} x={at(c)[0]} y={at(c)[1]} s={s} rx={8} />))}
      <path d={path} style={{ fill: 'none', stroke: E2, strokeWidth: 2.6, strokeDasharray: '4 4', strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      {order.map((c, i) => {
        const [x, y] = at(c);
        return (
          <M key={c} s={mv(0, 0, 0, 1.14, i * 110)}>
            <Tile x={x} y={y} s={s} rx={8} fill={i === 0 ? E4 : E1} />
            <T x={x} y={y} size={16} fill={SURF}>
              {labels?.[i] ?? i + 1}
            </T>
          </M>
        );
      })}
    </>
  );
}

/** Desen hatırlama: gösterilen desen ve hatırlanan hâli. */
function pattern(r: Rng): ReactNode {
  const n = 4;
  const s = 21;
  const g = 5;
  const lit = shuffle(r, Array.from({ length: n * n }, (_, i) => i)).slice(0, 6);
  const recalled = lit.slice(0, 4);
  const grid = (cx: number, on: number[], ghost: boolean, delay: number) => {
    const x0 = cx - (n * s + (n - 1) * g) / 2;
    const y0 = -(n * s + (n - 1) * g) / 2 + 10;
    return Array.from({ length: n * n }, (_, c) => {
      const x = x0 + (c % n) * (s + g);
      const y = y0 + Math.floor(c / n) * (s + g);
      const isOn = on.includes(c);
      const look: CSSProperties = isOn ? { fill: ghost ? E2 : E1 } : ghost ? { fill: BG, stroke: E3, strokeWidth: 1.4, strokeDasharray: '3 3' } : { fill: E3 };
      return (
        <rect
          key={c}
          x={f(x)}
          y={f(y)}
          width={s}
          height={s}
          rx={5}
          className={isOn ? 'amblem-oge' : undefined}
          style={isOn ? { ...look, ...mv(0, 0, 0, 1.12, delay + c * 20) } : look}
        />
      );
    });
  };
  return (
    <>
      {grid(-62, lit, false, 0)}
      <Arrow x1={-6} y1={10} x2={14} y2={10} bend={10} />
      {grid(66, recalled, true, 160)}
    </>
  );
}

/** Harf-sayı sıralama: karışık kutular ve sıraya konmuş hâli. */
function sortSeq(r: Rng): ReactNode {
  const digits = shuffle(r, ['1', '2', '3', '4', '5', '6', '7', '8', '9']).slice(0, 2).sort();
  const letters = shuffle(r, [...'BDFHKLMRST']).slice(0, 2).sort((a, b) => a.localeCompare(b, 'tr'));
  const sorted = [...digits, ...letters];
  const mixed = shuffle(r, sorted);
  const xs = [-78, -26, 26, 78];
  return (
    <>
      {mixed.map((ch, i) => {
        const j = sorted.indexOf(ch);
        return <path key={`l${i}`} d={`M${xs[i]} -22C${xs[i]} 0 ${xs[j]} 0 ${xs[j]} 18`} style={{ fill: 'none', stroke: E3, strokeWidth: 2, strokeLinecap: 'round' }} />;
      })}
      {mixed.map((ch, i) => (
        <g key={`m${i}`}>
          <Tile x={xs[i]} y={-38} s={32} />
          <T x={xs[i]} y={-38} size={16}>
            {ch}
          </T>
        </g>
      ))}
      {sorted.map((ch, i) => (
        <M key={`s${i}`} s={mv(0, -4, 0, 1.06, i * 70)}>
          <Tile x={xs[i]} y={36} s={34} fill={i < 2 ? E1 : E2} />
          <T x={xs[i]} y={36} size={17} fill={i < 2 ? SURF : E4}>
            {ch}
          </T>
        </M>
      ))}
    </>
  );
}

/** Kelime listesi: tekrarlarla öğrenilen bir liste. */
function wordList(r: Rng): ReactNode {
  const rows = 5;
  const done = Math.floor(between(r, 2, 4.99));
  return (
    <>
      <rect x={-112} y={-52} width={150} height={114} rx={12} style={{ fill: BG, stroke: E3, strokeWidth: 1.6 }} />
      {Array.from({ length: rows }, (_, i) => {
        const y = -34 + i * 20;
        const ok = i < done;
        return (
          <M key={i} s={mv(4, 0, 0, 1, i * 50)}>
            <circle cx={-92} cy={y} r={7} style={ok ? { fill: E1 } : { fill: 'none', stroke: E3, strokeWidth: 2 }} />
            {ok && <path d={`M${-95.5} ${y}l2.6 2.6 4.6-5`} style={{ fill: 'none', stroke: SURF, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }} />}
            <rect x={-78} y={y - 4} width={f(between(r, 50, 100))} height={8} rx={4} style={{ fill: ok ? E2 : E3 }} />
          </M>
        );
      })}
      <M s={mv(0, 0, 60, 1)} style={AROUND(86, 0)}>
        <path d="M86 -30A30 30 0 1 1 57 -8" style={{ fill: 'none', stroke: E1, strokeWidth: 4, strokeLinecap: 'round' }} />
        <path d="M50 -18L57 -7L68 -13" style={{ fill: 'none', stroke: E1, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      </M>
      <T x={86} y={0} size={18} fill={E4}>
        ×3
      </T>
    </>
  );
}

/** Geriye dönük hatırlama: iki önceki harfle aynı olan harf. */
function nBack(r: Rng): ReactNode {
  const pool = shuffle(r, [...'BFKLMPRST']);
  const items = [pool[0], pool[1], pool[2], pool[3], pool[2]];
  const xs = [-100, -50, 0, 50, 100];
  return (
    <>
      <path d={`M${xs[4]} -22Q${f((xs[2] + xs[4]) / 2)} -60 ${xs[2]} -22`} style={{ fill: 'none', stroke: E1, strokeWidth: 2.6, strokeLinecap: 'round' }} />
      <path d={`M${xs[2] - 6} -32L${xs[2]} -22L${xs[2] + 8} -30`} style={{ fill: 'none', stroke: E1, strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      {items.map((ch, i) => (
        <M key={i} s={mv(-6, 0, 0, i === 4 ? 1.08 : 1, (4 - i) * 50)}>
          <Tile x={xs[i]} y={6} s={40} fill={i === 4 ? E1 : E3} />
          {i === 2 && <rect x={xs[i] - 24} y={-18} width={48} height={48} rx={12} style={{ fill: 'none', stroke: E1, strokeWidth: 2.2, strokeDasharray: '4 4' }} />}
          <T x={xs[i]} y={6} size={19} fill={i === 4 ? SURF : i < 2 ? E2 : E4}>
            {ch}
          </T>
        </M>
      ))}
      <line x1={-124} y1={44} x2={124} y2={44} style={{ stroke: E3, strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '1 7' }} />
    </>
  );
}

/** Hesapla ve hatırla: doğrulanan işlemler ve akılda tutulan harfler. */
function calcMemory(r: Rng): ReactNode {
  const letters = shuffle(r, [...'BFHKLMRS']).slice(0, 3);
  return (
    <>
      {[0, 1].map((i) => (
        <M key={i} s={mv(0, -3, 0, 1, i * 60)}>
          <rect x={-120} y={-44 + i * 46} width={118} height={36} rx={10} style={{ fill: E3 }} />
          <T x={-74} y={-26 + i * 46} size={15}>
            {i === 0 ? '3 + 4 = 7' : '9 − 2 = 6'}
          </T>
          <circle cx={-20} cy={-26 + i * 46} r={10} style={{ fill: i === 0 ? E1 : E2 }} />
          <path
            d={i === 0 ? `M-24.5 ${-26 + i * 46}l3 3 5.5-6` : `M-24 ${-30 + i * 46}l8 8m0 -8l-8 8`}
            style={{ fill: 'none', stroke: SURF, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
          />
        </M>
      ))}
      {letters.map((ch, i) => (
        <M key={`h${i}`} s={mv(0, -6, 0, 1.06, 160 + i * 60)}>
          <Tile x={34 + i * 40} y={-2} s={34} fill={E1} />
          <T x={34 + i * 40} y={-2} size={17} fill={SURF}>
            {ch}
          </T>
        </M>
      ))}
      <path d="M14 34H116" style={{ stroke: E3, strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '1 7' }} />
    </>
  );
}

/** Kule görevi: üç çubuk (3, 2 ve 1 top alır) ve toplar. */
function tower(r: Rng): ReactNode {
  const pegs = [-76, 0, 76];
  const cap = [3, 2, 1];
  const ball = 26;
  const base = 56;
  const balls = [E1, E2, E4];
  // Topları kapasiteye uyarak dağıt.
  const stacks: string[][] = [[], [], []];
  for (const b of shuffle(r, balls)) {
    const free = [0, 1, 2].filter((p) => stacks[p].length < cap[p]);
    stacks[pick(r, free)].push(b);
  }
  return (
    <>
      <rect x={-118} y={base} width={236} height={9} rx={4.5} style={{ fill: E2 }} />
      {pegs.map((x, p) => (
        <line key={p} x1={x} y1={base} x2={x} y2={f(base - cap[p] * ball - 10)} style={{ stroke: E3, strokeWidth: 6, strokeLinecap: 'round' }} />
      ))}
      {stacks.map((st, p) =>
        st.map((color, k) => (
          <M key={`${p}-${k}`} s={mv(0, -6, 0, 1, (p * 3 + k) * 50)}>
            <circle cx={pegs[p]} cy={f(base - ball / 2 - k * ball)} r={ball / 2 - 0.5} style={{ fill: color }} />
          </M>
        )),
      )}
      <path d="M104 -34l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={{ fill: E1 }} />
    </>
  );
}

/** Mantıksal akıl yürütme: iç içe kümeler ve çıkarım. */
function logic(): ReactNode {
  return (
    <>
      <M s={mv(0, 0, 0, 1.03)} style={AROUND(-46, 0)}>
        <circle cx={-46} cy={0} r={60} style={{ fill: E3 }} />
      </M>
      <M s={mv(0, 0, 0, 1.05, 60)} style={AROUND(-36, 10)}>
        <circle cx={-36} cy={10} r={40} style={{ fill: E2 }} />
      </M>
      <M s={mv(0, 0, 0, 1.1, 120)} style={AROUND(-26, 20)}>
        <circle cx={-26} cy={20} r={19} style={{ fill: E1 }} />
      </M>
      <T x={-26} y={20} size={15} fill={SURF}>
        A
      </T>
      <T x={-36} y={-16} size={14}>
        B
      </T>
      <T x={-46} y={-44} size={14}>
        C
      </T>
      {[
        ['A', -34, E1],
        ['C', 42, E4],
      ].map(([ch, y, c]) => (
        <g key={ch as string}>
          <circle cx={84} cy={y as number} r={15} style={{ fill: c as string }} />
          <T x={84} y={y as number} size={15} fill={SURF}>
            {ch}
          </T>
        </g>
      ))}
      <Arrow x1={84} y1={-14} x2={84} y2={22} color={E2} width={3} />
      <Arrow x1={20} y1={-24} x2={62} y2={-34} bend={6} color={E3} width={2} dashed />
    </>
  );
}

/** Düşünerek karar verme: ayrılan yollar; düşünülerek seçilen yol. */
function branch(r: Rng): ReactNode {
  const ends: [number, number][] = [
    [96, -36],
    [96, 4],
    [96, 44],
  ];
  const pickI = Math.floor(r() * 3);
  return (
    <>
      <line x1={-112} y1={0} x2={-52} y2={0} style={{ stroke: E4, strokeWidth: 4, strokeLinecap: 'round' }} />
      {ends.map(([x, y], i) => (
        <path
          key={i}
          d={`M-52 0C-10 0 20 ${y} ${x - 16} ${y}`}
          style={{ fill: 'none', stroke: i === pickI ? E1 : E3, strokeWidth: i === pickI ? 4.5 : 3, strokeLinecap: 'round', strokeDasharray: i === pickI ? undefined : '4 6' }}
        />
      ))}
      <circle cx={-112} cy={0} r={8} style={{ fill: E4 }} />
      <circle cx={-52} cy={0} r={11} style={{ fill: BG, stroke: E4, strokeWidth: 3 }} />
      <T x={-52} y={-28} size={18} fill={E2}>
        ?
      </T>
      {ends.map(([x, y], i) =>
        i === pickI ? (
          <M key={`e${i}`} s={mv(4, 0, 0, 1.15, 120)}>
            <circle cx={x} cy={y} r={15} style={{ fill: E1 }} />
            <path d={`M${x - 6} ${y}l4 4 8-9`} style={{ fill: 'none', stroke: SURF, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
          </M>
        ) : (
          <circle key={`e${i}`} cx={x} cy={y} r={11} style={{ fill: 'none', stroke: E3, strokeWidth: 3 }} />
        ),
      )}
    </>
  );
}

/** Harf işaretleme: harf tablosunda işaretlenen harfler. */
function letterGrid(r: Rng): ReactNode {
  const pool = [...'BDEKPR'];
  const target = pick(r, pool);
  const cols = 7;
  const rows = 3;
  const cells = Array.from({ length: cols * rows }, () => pick(r, pool.filter((c) => c !== target)));
  for (const i of shuffle(r, Array.from({ length: cols * rows }, (_, k) => k)).slice(0, 4)) cells[i] = target;
  return (
    <>
      {cells.map((ch, i) => {
        const x = -102 + (i % cols) * 34;
        const y = -28 + Math.floor(i / cols) * 36;
        const hit = ch === target;
        return (
          <g key={i}>
            {hit && (
              <M s={mv(0, 0, 0, 1.18, i * 15)}>
                <circle cx={x} cy={y} r={14} style={{ fill: E3, stroke: E1, strokeWidth: 2.6 }} />
              </M>
            )}
            <T x={x} y={y} size={18} fill={hit ? E4 : E2}>
              {ch}
            </T>
          </g>
        );
      })}
    </>
  );
}

/** Dur-git: harflere tepki verilir, X'te durulur. */
function stopGo(r: Rng): ReactNode {
  const stop = 1 + Math.floor(r() * 3);
  const letters = shuffle(r, [...'ABDKMPRT']).slice(0, 5);
  const xs = [-100, -50, 0, 50, 100];
  const oct = (cx: number, cy: number, R: number) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = Math.PI / 8 + (i * Math.PI) / 4;
      return `${f(cx + Math.cos(a) * R)},${f(cy + Math.sin(a) * R)}`;
    }).join(' ');
  return (
    <>
      {xs.map((x, i) =>
        i === stop ? (
          <M key={i} s={mv(0, 0, 0, 1.12, 80)}>
            <polygon points={oct(x, 0, 25)} style={{ fill: E1 }} />
            <T x={x} y={0} size={20} fill={SURF}>
              X
            </T>
          </M>
        ) : (
          <M key={i} s={mv(0, -5, 0, 1, i * 50)}>
            <Tile x={x} y={0} s={40} />
            <T x={x} y={0} size={19}>
              {letters[i]}
            </T>
          </M>
        ),
      )}
      {xs.map((x, i) =>
        i === stop ? (
          <line key={`d${i}`} x1={x - 8} y1={42} x2={x + 8} y2={42} style={{ stroke: E1, strokeWidth: 3, strokeLinecap: 'round' }} />
        ) : (
          <circle key={`d${i}`} cx={x} cy={42} r={4.5} style={{ fill: E2 }} />
        ),
      )}
    </>
  );
}

/** Renk-kelime: kelimenin anlamı ile yazıldığı renk farklı. Görev renklerle ilgili olduğu için tek istisna: tayf renkleri. */
function stroop(r: Rng): ReactNode {
  const words = [
    ['MAVİ', 'var(--dim-ext)'],
    ['MOR', 'var(--dim-emo)'],
    ['PEMBE', 'var(--dim-con)'],
    ['TURUNCU', 'var(--dim-int)'],
  ] as const;
  const chosen = shuffle(r, words).slice(0, 3);
  const answer = Math.floor(r() * 3);
  return (
    <>
      {chosen.map(([w, c], i) => (
        <M key={w} s={mv(6, 0, 0, 1, i * 70)}>
          <rect x={-118} y={-52 + i * 36} width={140} height={30} rx={15} style={{ fill: E3 }} />
          <T x={-48} y={-37 + i * 36} size={19} fill={c} weight={800}>
            {w}
          </T>
        </M>
      ))}
      {chosen.map(([w, c], i) => (
        <g key={`s${w}`}>
          <circle cx={56 + i * 30} cy={f(-37 + answer * 36)} r={11} style={{ fill: c }} />
          {i === answer && <circle cx={56 + i * 30} cy={f(-37 + answer * 36)} r={16} style={{ fill: 'none', stroke: E4, strokeWidth: 2.4 }} />}
        </g>
      ))}
    </>
  );
}

/** Kural değiştirme: iki kural arasında gidip gelme. */
function ruleSwitch(r: Rng): ReactNode {
  const shape = pick(r, ['circle', 'diamond', 'tri'] as const);
  return (
    <>
      <M s={mv(-4, 0, -6)}>
        <Tile x={-66} y={0} s={70} fill={E3} />
        {glyph(shape, -66, 0, 44, E1)}
      </M>
      <M s={mv(4, 0, 6, 1, 80)}>
        <Tile x={66} y={0} s={70} fill={E3} />
        <T x={66} y={0} size={34}>
          {String(2 + Math.floor(r() * 7))}
        </T>
      </M>
      <Arrow x1={-24} y1={-26} x2={24} y2={-26} bend={14} color={E4} width={3} />
      <Arrow x1={24} y1={26} x2={-24} y2={26} bend={-14} color={E2} width={3} />
    </>
  );
}

/** Sırayla birleştirme: numaralı daireler ve aralarındaki iz. */
function trail(r: Rng): ReactNode {
  const up = r() < 0.5 ? 1 : -1;
  const order: [number, number][] = Array.from({ length: 6 }, (_, i) => [-104 + i * 41.6 + between(r, -6, 6), (i % 2 ? 1 : -1) * up * between(r, 20, 34) + 6]);
  const done = 4;
  return (
    <>
      <path d={smoothOpen(order.slice(0, done))} style={{ fill: 'none', stroke: E1, strokeWidth: 3.2, strokeLinecap: 'round' }} />
      <path d={smoothOpen(order.slice(done - 1))} style={{ fill: 'none', stroke: E3, strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '4 6' }} />
      {order.map(([x, y], i) => (
        <M key={i} s={mv(0, 0, 0, 1.12, i * 60)}>
          <circle cx={x} cy={y} r={14} style={{ fill: i < done ? E1 : E3 }} />
          <T x={x} y={y} size={14} fill={i < done ? SURF : E4}>
            {i + 1}
          </T>
        </M>
      ))}
    </>
  );
}

/** Tepki hızı: hedef halkaları ve üzerinden geçen bir sinyal. */
function pulse(r: Rng): ReactNode {
  const cx = between(r, -40, 40);
  const spikes = [between(r, -110, -70), cx, between(r, 76, 110)];
  let d = `M-128 0`;
  for (const sx of spikes) {
    const amp = between(r, 30, 44) * (r() < 0.5 ? -1 : 1);
    d += `L${f(sx - 14)} 0L${f(sx - 6)} ${f(amp)}L${f(sx + 4)} ${f(-amp * 0.55)}L${f(sx + 12)} 0`;
  }
  d += 'L128 0';
  return (
    <>
      <M s={mv(0, 0, 0, 1.06)} style={AROUND(cx, 0)}>
        <circle cx={f(cx)} cy={0} r={56} style={{ fill: E3 }} />
      </M>
      <M s={mv(0, 0, 0, 1.1, 60)} style={AROUND(cx, 0)}>
        <circle cx={f(cx)} cy={0} r={36} style={{ fill: E2 }} />
      </M>
      <M s={mv(0, 0, 0, 1.2, 120)} style={AROUND(cx, 0)}>
        <circle cx={f(cx)} cy={0} r={16} style={{ fill: E1 }} />
      </M>
      <path d={d} style={{ fill: 'none', stroke: E4, strokeWidth: 3.2, strokeLinejoin: 'round', strokeLinecap: 'round' }} />
    </>
  );
}

/** Simge bulma: aranan simgeler ve sıradaki eşleşen simge. */
function symbols(r: Rng): ReactNode {
  const kinds = shuffle(r, GLYPHS);
  const targets = kinds.slice(0, 2);
  const row = kinds.slice(2, 6);
  const hit = Math.floor(r() * 4);
  row[hit] = targets[Math.floor(r() * 2)];
  return (
    <>
      <rect x={-124} y={-48} width={56} height={96} rx={14} style={{ fill: E3 }} />
      {glyph(targets[0], -96, -22, 26, E4)}
      {glyph(targets[1], -96, 22, 26, E4)}
      {row.map((k, i) => {
        const x = -34 + i * 44;
        return (
          <M key={i} s={mv(0, i === hit ? -6 : 0, 0, i === hit ? 1.1 : 1, i * 50)}>
            <Tile x={x} y={0} s={36} fill={i === hit ? BG : E3} />
            {i === hit && <rect x={x - 21} y={-21} width={42} height={42} rx={11} style={{ fill: 'none', stroke: E1, strokeWidth: 2.6 }} />}
            {glyph(k, x, 0, 24, i === hit ? E1 : E2)}
          </M>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ Okuma */

/** Okuma: satırlar ve okunan yeri gösteren bir vurgu. */
function lines(r: Rng): ReactNode {
  const x0 = -110;
  const ys = [-40, -18, 4, 26, 48];
  const lens = ys.map((_, i) => (i === ys.length - 1 ? between(r, 90, 140) : between(r, 190, 220)));
  const hl = 1 + Math.floor(r() * 3);
  const start = x0 + between(r, 20, 60);
  const len = between(r, 54, 80);
  return (
    <>
      {ys.map((y, i) => (
        <path key={y} d={`M${x0} ${y}H${f(x0 + lens[i])}`} style={{ fill: 'none', stroke: E3, strokeWidth: 11, strokeLinecap: 'round' }} />
      ))}
      <M s={mv(40, 0)}>
        <path d={`M${f(start)} ${ys[hl]}H${f(start + len)}`} style={{ fill: 'none', stroke: E1, strokeWidth: 11, strokeLinecap: 'round' }} />
        <path d={`M${f(start + len + 13)} ${ys[hl] - 14}V${ys[hl] + 14}`} style={{ fill: 'none', stroke: E4, strokeWidth: 3, strokeLinecap: 'round' }} />
      </M>
      <circle cx={106} cy={54} r={13} style={{ fill: BG, stroke: E2, strokeWidth: 3 }} />
      <path d="M106 47V54L111 57" style={{ fill: 'none', stroke: E4, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      <line x1={102} y1={37} x2={110} y2={37} style={{ stroke: E2, strokeWidth: 3, strokeLinecap: 'round' }} />
    </>
  );
}

/** Sesli okuma: mikrofon ve ses dalgası. */
function voice(r: Rng): ReactNode {
  const bars = 19;
  return (
    <>
      <M s={mv(0, -4, 0, 1.04)}>
        <rect x={-120} y={-46} width={30} height={56} rx={15} style={{ fill: E1 }} />
        <path d="M-128 -8a23 23 0 0 0 46 0" style={{ fill: 'none', stroke: E4, strokeWidth: 3.2, strokeLinecap: 'round' }} />
        <line x1={-105} y1={15} x2={-105} y2={36} style={{ stroke: E4, strokeWidth: 3.2, strokeLinecap: 'round' }} />
        <line x1={-118} y1={38} x2={-92} y2={38} style={{ stroke: E4, strokeWidth: 3.2, strokeLinecap: 'round' }} />
      </M>
      {Array.from({ length: bars }, (_, i) => {
        const x = -66 + i * 10.4;
        const env = Math.sin(((i + 0.5) / bars) * Math.PI);
        const h = clamp(10 + env * between(r, 50, 100), 8, 104);
        return (
          <M key={i} s={mv(0, 0, 0, 1.1, i * 20)} style={AROUND(x, 0)}>
            <rect x={f(x - 2.8)} y={f(-h / 2)} width={5.6} height={f(h)} rx={2.8} style={{ fill: Math.abs(i - bars / 2) < 4 ? E1 : E2 }} />
          </M>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ Öğrenme ve akademik beceriler */

/** Çalışma alışkanlıkları: haftalık alışkanlık takvimi. */
function habitCalendar(r: Rng): ReactNode {
  const days = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
  const s = 24;
  const g = 8;
  const x0 = -((7 * s + 6 * g) / 2) + s / 2;
  return (
    <>
      {days.map((d, i) => (
        <T key={i} x={x0 + i * (s + g)} y={-44} size={11} fill={E2}>
          {d}
        </T>
      ))}
      {Array.from({ length: 21 }, (_, c) => {
        const x = x0 + (c % 7) * (s + g);
        const y = -18 + Math.floor(c / 7) * (s + g);
        const v = r();
        const fill = v > 0.55 ? E1 : v > 0.3 ? E2 : E3;
        return (
          <M key={c} s={mv(0, 0, 0, v > 0.55 ? 1.12 : 1, c * 18)}>
            <rect x={f(x - s / 2)} y={f(y - s / 2)} width={s} height={s} rx={7} style={{ fill }} />
            {v > 0.55 && <path d={`M${f(x - 5)} ${f(y)}l3.4 3.4 6.4-7`} style={{ fill: 'none', stroke: SURF, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }} />}
          </M>
        );
      })}
    </>
  );
}

/** Ders çalışma motivasyonu: yarım daire gösterge. */
function gauge(r: Rng): ReactNode {
  const R = 72;
  const cy = 46;
  const seg = 5;
  const tones = [E3, E3, E2, E2, E1];
  const needle = Math.PI + between(r, 0.45, 0.85) * Math.PI;
  return (
    <>
      {Array.from({ length: seg }, (_, i) => {
        const a0 = Math.PI + (i * Math.PI) / seg + 0.04;
        const a1 = Math.PI + ((i + 1) * Math.PI) / seg - 0.04;
        return (
          <path
            key={i}
            d={`M${f(Math.cos(a0) * R)} ${f(cy + Math.sin(a0) * R)}A${R} ${R} 0 0 1 ${f(Math.cos(a1) * R)} ${f(cy + Math.sin(a1) * R)}`}
            style={{ fill: 'none', stroke: tones[i], strokeWidth: 18, strokeLinecap: 'butt' }}
          />
        );
      })}
      <M s={mv(0, 0, 14, 1)} style={AROUND(0, cy)}>
        <line x1={0} y1={cy} x2={f(Math.cos(needle) * (R - 16))} y2={f(cy + Math.sin(needle) * (R - 16))} style={{ stroke: E4, strokeWidth: 5, strokeLinecap: 'round' }} />
      </M>
      <circle cx={0} cy={cy} r={10} style={{ fill: E4 }} />
      <circle cx={0} cy={cy} r={4} style={{ fill: SURF }} />
      <path d="M104 -40l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={{ fill: E1 }} />
    </>
  );
}

/** Erteleme ve zaman yönetimi: saat ve sıradaki işler. */
function clockTasks(r: Rng): ReactNode {
  const R = 50;
  const cx = -62;
  const hA = between(r, 0, Math.PI * 2);
  const mA = between(r, 0, Math.PI * 2);
  return (
    <>
      <circle cx={cx} cy={0} r={R} style={{ fill: E3 }} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        const k = i % 3 === 0 ? 10 : 5;
        return <line key={i} x1={f(cx + Math.cos(a) * (R - 4))} y1={f(Math.sin(a) * (R - 4))} x2={f(cx + Math.cos(a) * (R - 4 - k))} y2={f(Math.sin(a) * (R - 4 - k))} style={{ stroke: E2, strokeWidth: 2.4, strokeLinecap: 'round' }} />;
      })}
      <M s={mv(0, 0, 90, 1)} style={AROUND(cx, 0)}>
        <line x1={cx} y1={0} x2={f(cx + Math.cos(mA) * 36)} y2={f(Math.sin(mA) * 36)} style={{ stroke: E1, strokeWidth: 3.4, strokeLinecap: 'round' }} />
      </M>
      <line x1={cx} y1={0} x2={f(cx + Math.cos(hA) * 22)} y2={f(Math.sin(hA) * 22)} style={{ stroke: E4, strokeWidth: 5, strokeLinecap: 'round' }} />
      <circle cx={cx} cy={0} r={5} style={{ fill: E4 }} />
      {[0, 1, 2].map((i) => (
        <M key={i} s={mv(i === 2 ? 8 : 0, 0, 0, 1, i * 60)}>
          <rect
            x={16}
            y={-46 + i * 33}
            width={i === 2 ? 76 : 104}
            height={26}
            rx={9}
            style={i === 2 ? { fill: BG, stroke: E2, strokeWidth: 1.8, strokeDasharray: '4 4' } : { fill: i === 0 ? E1 : E2 }}
          />
          {i === 0 && <path d={`M28 ${-33 + i * 33}l4 4 8-9`} style={{ fill: 'none', stroke: SURF, strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} />}
        </M>
      ))}
      <Arrow x1={98} y1={33} x2={122} y2={33} color={E2} width={2.4} />
    </>
  );
}

/** Sınav kaygısı ve baş etme: cevap kâğıdı ve sivri dalgalardan yumuşak dalgaya dönen nabız çizgisi. */
function examCalm(r: Rng): ReactNode {
  const rows = 4;
  const marks = Array.from({ length: rows }, () => Math.floor(r() * 3));
  // Nabız: önce sivri tepeler (kaygı), sonra yumuşayan dalga (sakinleşme).
  const x0 = -12;
  const spikes = Array.from({ length: 4 }, (_, i) => between(r, 34, 50) * (i % 2 ? -1 : 1));
  const jag = spikes.map((h, i) => `L${f(x0 + 10 + i * 14)} ${f(h)}L${f(x0 + 17 + i * 14)} 0`).join('');
  const wave: [number, number][] = Array.from({ length: 9 }, (_, i) => [x0 + 66 + i * 7.5, f(Math.sin(i * 0.9) * (16 - i * 1.4))]);
  return (
    <>
      <rect x={-118} y={-58} width={86} height={116} rx={10} style={{ fill: E3 }} />
      <rect x={-104} y={-44} width={46} height={7} rx={3.5} style={{ fill: E2 }} />
      {marks.map((m, i) => (
        <M key={i} s={mv(0, -2, 0, 1, i * 60)}>
          {[0, 1, 2].map((k) => (
            <circle
              key={k}
              cx={-100 + k * 18}
              cy={-18 + i * 20}
              r={5.5}
              style={k === m ? { fill: E1 } : { fill: SURF, stroke: E2, strokeWidth: 1.8 }}
            />
          ))}
        </M>
      ))}
      <path
        d={`M${x0 - 6} 0L${x0 + 3} 0${jag}L${x0 + 66} 0`}
        style={{ fill: 'none', stroke: E4, strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}
      />
      <M s={mv(4, 0, 0, 1, 180)}>
        <path d={smoothOpen(wave)} style={{ fill: 'none', stroke: E1, strokeWidth: 4, strokeLinecap: 'round' }} />
        <circle cx={f(wave[wave.length - 1][0] + 6)} cy={wave[wave.length - 1][1]} r={6} style={{ fill: E1 }} />
      </M>
      <path d="M100 -46l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={{ fill: E2 }} />
    </>
  );
}

/**
 * Ders Çalışırken Telefon ve Dikkat: solda bildirimleri yığılan bir telefon ve "rahatsız etme" ayı; ortada dikkatin geri
 * döndüğü kesik bir yay; sağda satırları olan bir sayfa ve üzerinde odaklanılan satır.
 */
function phoneFocus(r: Rng): ReactNode {
  const pills = 2 + Math.floor(r() * 2);
  const widths = Array.from({ length: pills }, () => between(r, 22, 34));
  const lines = Array.from({ length: 5 }, () => between(r, 46, 72));
  const focus = 1 + Math.floor(r() * 3);
  return (
    <>
      <rect x={-118} y={-60} width={56} height={120} rx={12} style={{ fill: E3 }} />
      <rect x={-111} y={-48} width={42} height={92} rx={6} style={{ fill: SURF }} />
      <circle cx={-90} cy={52} r={3.5} style={{ fill: E2 }} />
      {widths.map((w, i) => (
        <M key={i} s={mv(0, -3, 0, 1, i * 90)}>
          <rect x={-106} y={f(-40 + i * 15)} width={f(w)} height={9} rx={4.5} style={{ fill: i === 0 ? E1 : E2 }} />
        </M>
      ))}
      <M s={mv(0, 0, -12, 1, 160)} style={AROUND(-36, -38)}>
        <circle cx={-36} cy={-38} r={10} style={{ fill: E2 }} />
        <circle cx={-31} cy={-42} r={8.5} style={{ fill: BG }} />
      </M>
      <path d="M-52 22Q-22 52 6 18" style={{ fill: 'none', stroke: E4, strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '2 7' }} />
      <path d="M-1 14l8 3-3 8" style={{ fill: 'none', stroke: E4, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      <rect x={14} y={-56} width={104} height={112} rx={10} style={{ fill: E3 }} />
      {lines.map((w, i) => (
        <rect key={i} x={28} y={f(-38 + i * 18)} width={f(w)} height={7} rx={3.5} style={{ fill: i === focus ? E1 : E2 }} />
      ))}
      <M s={mv(3, 0, 0, 1.04, 220)}>
        <rect
          x={21}
          y={f(-38 + focus * 18 - 6)}
          width={90}
          height={19}
          rx={9.5}
          style={{ fill: 'none', stroke: E4, strokeWidth: 2.4 }}
        />
      </M>
    </>
  );
}

/** Zihniyet: büyüyen bir fidan. */
function growth(r: Rng): ReactNode {
  const pts: [number, number][] = Array.from({ length: 6 }, (_, i) => [-112 + i * 30, 50 - i * 14 + between(r, -4, 4)]);
  return (
    <>
      {pts.map(([x, y], i) => (
        <M key={i} s={mv(0, -4, 0, 1.15, i * 50)}>
          <circle cx={f(x)} cy={f(y)} r={3 + i * 1.6} style={{ fill: i < 2 ? E3 : i < 4 ? E2 : E1 }} />
        </M>
      ))}
      <path d={smoothOpen(pts)} style={{ fill: 'none', stroke: E3, strokeWidth: 2, strokeDasharray: '2 6', strokeLinecap: 'round' }} />
      <rect x={58} y={36} width={52} height={24} rx={6} style={{ fill: E4 }} />
      <path d="M84 36C84 10 82 -6 86 -30" style={{ fill: 'none', stroke: E2, strokeWidth: 4, strokeLinecap: 'round' }} />
      <M s={mv(-3, -3, -12, 1.08, 200)}>
        <path d="M84 0C66 -2 56 -14 54 -30C72 -28 82 -16 84 0Z" style={{ fill: E1 }} />
      </M>
      <M s={mv(3, -4, 12, 1.08, 260)}>
        <path d="M86 -14C104 -16 116 -30 116 -48C98 -46 88 -34 86 -14Z" style={{ fill: E2 }} />
      </M>
    </>
  );
}

/** Öğrenme: yükselen basamaklar ve hedef. */
function steps(r: Rng): ReactNode {
  const n = 6;
  const bw = 24;
  const g = 12;
  const x0 = -((n * bw + (n - 1) * g) / 2);
  const base = 58;
  const inc = between(r, 14, 17);
  const hs = Array.from({ length: n }, (_, k) => clamp(22 + k * inc + between(r, -7, 7), 16, 100));
  const tones = [E3, E3, E2, E2, E1, E1];
  const tops = hs.map((h, k) => [x0 + k * (bw + g) + bw / 2, base - h] as const);
  return (
    <>
      <path d={tops.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y - 10)}`).join('')} style={{ fill: 'none', stroke: E2, strokeWidth: 2, strokeDasharray: '3 5', strokeLinecap: 'round' }} />
      {hs.map((h, k) => (
        <M key={k} s={mv(0, -6, 0, 1, k * 55)}>
          <rect x={f(x0 + k * (bw + g))} y={f(base - h)} width={bw} height={f(h)} rx={6} style={{ fill: tones[k] }} />
        </M>
      ))}
      <M s={mv(0, -10, 0, 1.2, 330)}>
        <circle cx={f(tops[n - 1][0])} cy={f(tops[n - 1][1] - 20)} r={7} style={{ fill: E4 }} />
      </M>
    </>
  );
}

/* ------------------------------------------------------------------ İlgi ve meslek */

/** Holland altıgeni (RIASEC) ve ilgi profili. */
function hexagon(r: Rng): ReactNode {
  const R = 54;
  const labels = ['R', 'I', 'A', 'S', 'E', 'C'];
  const ang = (i: number) => -Math.PI / 2 + (i * Math.PI) / 3;
  const vals = labels.map(() => between(r, 0.35, 0.98));
  const ring = (k: number) => labels.map((_, i) => `${f(Math.cos(ang(i)) * R * k)},${f(Math.sin(ang(i)) * R * k)}`).join(' ');
  return (
    <>
      <polygon points={ring(1)} style={{ fill: BG, stroke: E2, strokeWidth: 1.8, strokeLinejoin: 'round' }} />
      <polygon points={ring(0.5)} style={{ fill: 'none', stroke: E3, strokeWidth: 1.3 }} />
      <M s={mv(0, 0, 0, 1.08)} style={AROUND()}>
        <polygon points={vals.map((v, i) => `${f(Math.cos(ang(i)) * R * v)},${f(Math.sin(ang(i)) * R * v)}`).join(' ')} style={{ fill: E2, fillOpacity: 0.6, stroke: E1, strokeWidth: 2.6, strokeLinejoin: 'round' }} />
      </M>
      {labels.map((l, i) => (
        <g key={l}>
          <circle cx={f(Math.cos(ang(i)) * R)} cy={f(Math.sin(ang(i)) * R)} r={4} style={{ fill: E1 }} />
          <T x={Math.cos(ang(i)) * (R + 16)} y={Math.sin(ang(i)) * (R + 11)} size={14} weight={800}>
            {l}
          </T>
        </g>
      ))}
      <circle cx={-104} cy={-34} r={7} style={{ fill: E3 }} />
      <circle cx={104} cy={36} r={9} style={{ fill: E3 }} />
    </>
  );
}

/** İlgi alanları: yörüngeler ve üzerlerinde ilgiler. */
function orbits(r: Rng): ReactNode {
  const rings = [112, 78, 46];
  const tilt = f(between(r, -14, -6));
  return (
    <M s={mv(0, 0, 14)} style={AROUND()}>
      <g transform={`rotate(${tilt})`}>
        {rings.map((rx, i) => (
          <ellipse key={rx} cx={0} cy={0} rx={rx} ry={f(rx * 0.38)} style={{ fill: 'none', stroke: E2, strokeWidth: i === 0 ? 1.8 : 2.6, strokeDasharray: i === 0 ? '4 6' : undefined }} />
        ))}
        <circle cx={0} cy={0} r={25} style={{ fill: E3 }} />
        <circle cx={0} cy={0} r={15} style={{ fill: E1 }} />
        {rings.map((rx, i) => {
          const a = between(r, 0, Math.PI * 2);
          return <circle key={`p${rx}`} cx={f(Math.cos(a) * rx)} cy={f(Math.sin(a) * rx * 0.38)} r={[9, 12, 7][i]} style={{ fill: i === 1 ? E2 : E4 }} />;
        })}
      </g>
    </M>
  );
}

/** Hobiler: farklı büyüklükte ilgi baloncukları. */
function bubbles(r: Rng): ReactNode {
  const spots: [number, number, number][] = [
    [-10, -4, 40],
    [-74, 18, 28],
    [56, 16, 30],
    [-46, -42, 18],
    [34, -42, 20],
    [-112, -22, 13],
    [104, -26, 15],
    [96, 46, 11],
    [-104, 50, 9],
  ];
  const tones = shuffle(r, [E1, E2, E2, E3, E3, E3, E1, E2, E4]);
  return spots.map(([x, y, rad], i) => (
    <M key={i} s={mv(between(r, -6, 6), between(r, -6, 6), 0, 1.06, i * 35)}>
      <circle cx={x} cy={y} r={f(rad * between(r, 0.88, 1.06))} style={{ fill: tones[i] }} />
    </M>
  ));
}

/** Çalışma değerleri: sıralanmış değerler. */
function ranking(r: Rng): ReactNode {
  const lens = Array.from({ length: 5 }, () => between(r, 60, 190)).sort((a, b) => b - a);
  return lens.map((len, i) => {
    const y = -32 + i * 22;
    return (
      <M key={i} s={mv(6, 0, 0, 1, i * 60)}>
        <circle cx={-110} cy={y} r={10} style={{ fill: i === 0 ? E1 : E3 }} />
        <T x={-110} y={y} size={11} fill={i === 0 ? SURF : E4}>
          {i + 1}
        </T>
        <rect x={-90} y={y - 7} width={f(len)} height={14} rx={7} style={{ fill: i === 0 ? E1 : i < 3 ? E2 : E3 }} />
      </M>
    );
  });
}

/* ------------------------------------------------------------------ Sosyal-duygusal */

/** Duygusal zekâ: birbirine değen üç daire ve ortada bir kalp. */
function venn3(r: Rng): ReactNode {
  const turn = between(r, -0.3, 0.3);
  const tones = [E3, E2, E1];
  return (
    <>
      {[0, 1, 2].map((i) => {
        const a = -Math.PI / 2 + turn + (i * Math.PI * 2) / 3;
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        return (
          <M key={i} s={mv(ux * 7, uy * 7, 0, 1, i * 60)}>
            <circle cx={f(ux * 28)} cy={f(uy * 28)} r={44} style={{ fill: tones[i], fillOpacity: 0.86 }} />
          </M>
        );
      })}
      <M s={mv(0, 0, 0, 1.2, 200)}>
        <path d="M0 9C-14 -1 -12 -13 -5 -13C-2 -13 0 -10 0 -8C0 -10 2 -13 5 -13C12 -13 14 -1 0 9Z" style={{ fill: SURF }} />
      </M>
    </>
  );
}

/* ------------------------------------------------------------------ Seçim */

type Draw = (r: Rng, ctx: { name: string; dims: number }) => ReactNode;

/** Teste özgü çizimler; listede olmayan test alanının çizimini alır (kişilikte boyut sayısına göre). */
const BY_SLUG: Record<string, Draw> = {
  'cocuk-kisilik-profili': (r, c) => radar(r, c.dims, true),
  'kisilerarasi-tarz': (r) => circumplex(r),
  'dusunmeyi-sevme-olcegi': (r) => thought(r),
  'heyecan-arayisi': (r) => peaks(r),
  iyimserlik: (r) => sun(r),
  empati: () => venn2(),
  'oz-yeterlik': (r) => summit(r),
  'oz-denetim': (r) => balance(r),
  merak: (r) => magnifier(r),
  'liderlik-egilimleri': (r) => lead(r),
  'oz-saygi': (r) => mirror(r),

  'sekil-akil-yurutme': (r) => matrix(r),
  'sekil-benzetmeleri': (r) => analogy(r),
  'harf-dizileri': (r) => letterSeq(r),
  'kelime-bilgisi': (r, c) => wordTiles(r, c.name),
  'sozel-akil-yurutme': (r, c) => wordTiles(r, c.name),
  'sayi-dizileri': (r) => numberSeq(r),
  'sayisal-akil-yurutme': (r) => balance(r, '?'),
  'zihinden-hesaplama-hizi': (r) => arithmetic(r),
  'kagit-katlama': (r) => fold(r),
  'zihinde-dondurme': (r) => rotate2d(r),
  'kup-acinimi': (r) => cubeNet(r),
  'uc-boyutlu-zihinde-dondurme': (r) => cubes(r),
  'bakis-acisi-alma': (r) => viewpoint(r),
  'gizli-sekiller': (r) => hidden(r),
  'parcalardan-sekil': (r) => pieces(r),
  'desen-hatirlama': (r) => pattern(r),
  'harf-sayi-siralama': (r) => sortSeq(r),
  'kelime-listesi-hatirlama': (r) => wordList(r),
  'hesapla-ve-hatirla': (r) => calcMemory(r),
  'geriye-donuk-hatirlama': (r) => nBack(r),
  'dikkat-ve-bellek': (r) => corsi(r),
  'planlama-kule-gorevi': (r) => tower(r),
  'mantiksal-akil-yurutme': () => logic(),
  'dusunerek-karar-verme': (r) => branch(r),
  'surekli-dikkat': (r) => letterGrid(r),
  'dur-git-gorevi': (r) => stopGo(r),
  'renk-kelime-gorevi': (r) => stroop(r),
  'kural-degistirme': (r) => ruleSwitch(r),
  'sirayla-birlestirme-gorevi': (r) => trail(r),
  'tepki-hizi': (r) => pulse(r),
  'simge-bulma': (r) => symbols(r),

  'sesli-okuma-degerlendirmesi': (r) => voice(r),
  'okuma-hizi-ve-anlama': (r) => lines(r),

  'calisma-aliskanliklari': (r) => habitCalendar(r),
  'ders-calisma-motivasyonu': (r) => gauge(r),
  'erteleme-ve-zaman-yonetimi': (r) => clockTasks(r),
  zihniyet: (r) => growth(r),
  'sinav-kaygisi-ve-bas-etme': (r) => examCalm(r),
  'ders-calisirken-telefon-ve-dikkat': (r) => phoneFocus(r),

  'mesleki-ilgi-profili': (r) => hexagon(r),
  'meslek-ilgi-alanlari': (r) => orbits(r),
  'hobi-ve-serbest-zaman-ilgileri': (r) => bubbles(r),
  'calisma-degerleri': (r) => ranking(r),

  'duygusal-zeka-bilesenleri': (r) => venn3(r),
};

const BY_DOMAIN: Record<string, Draw> = {
  personality: (r, c) => (c.dims >= 4 ? radar(r, c.dims) : blobs(r)),
  cognitive: (r) => matrix(r),
  reading: (r) => lines(r),
  academic: (r) => steps(r),
  career: (r) => orbits(r),
  skills: (r) => venn3(r),
  wellbeing: (r) => venn3(r),
};

/**
 * Testin kendine özgü çizimi var mı: teste özgü bir çizim ya da (kişilik profillerinde) boyut sayısı kadar köşeli profil.
 * Yoksa alanının genel çizimini alır; yeni test BY_SLUG'a yazılır (tests/galeri.test.ts).
 */
export function hasOwnEmblem(slug: string, domain: string, dims: number): boolean {
  return slug in BY_SLUG || (domain === 'personality' && dims >= 4);
}

/**
 * @param dims Testin ayrı puanlanan ölçek sayısı (bileşik ölçekler hariç): kişilik profillerinde profilin köşe sayısı.
 */
export function TestEmblem({ slug, domain, name, dims }: { slug: string; domain: string; name: string; dims: number }) {
  const draw = BY_SLUG[slug] ?? BY_DOMAIN[domain] ?? BY_DOMAIN.personality;
  return (
    <svg viewBox={VIEW} className="amblem" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${CX} ${CY})`}>{draw(makeRng(slug), { name, dims: clamp(dims, 3, 32) })}</g>
    </svg>
  );
}
