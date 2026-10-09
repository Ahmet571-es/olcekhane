'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Görüntü dosyalarında koordinatlar: RAS+ (nörogörüntüleme, NIfTI; x sağa, y öne, z yukarı artar), LPS+ (DICOM hasta
 * koordinatları; x sola, y arkaya, z başa doğru artar) ve voksel dizini (i, j, k; ilk vokselin merkezi 0, 0, 0; afin matris
 * voksel koordinatını başvuru uzayına çevirir). Aynı nokta (hastanın 30 mm solunda, 20 mm önde, 10 mm yukarıda) iki kuralda
 * farklı işaretli sayılarla yazılır. Kaynaklar: NiBabel "Coordinate systems and affines"; DICOM PS3.3 C.7.6.2; 3D Slicer
 * "Coordinate systems"; BIDS koordinat eki.
 */

type Kural = 'ras' | 'lps' | 'voksel';

const BILGI: Record<Kural, { baslik: string; metin: string; nokta: string }> = {
  ras: {
    baslik: 'RAS+: nörogörüntülemenin yaygın kuralı',
    metin:
      'x ekseni hastanın sağına, y ekseni önüne, z ekseni başına doğru büyür. Nörogörüntülemede en yaygın kural budur; MNI ve Talairach uzaylarındaki koordinatlar da bu yönle yazılır. Yönler hastaya göredir: hastanın solundaki bir nokta eksi x değeri alır.',
    nokta: '(−30, 20, 10)',
  },
  lps: {
    baslik: 'LPS+: DICOM dosyalarının kuralı',
    metin:
      'x ekseni hastanın soluna, y ekseni arkasına, z ekseni başına doğru büyür. Tarayıcıdan çıkan DICOM dosyaları ve çoğu tıbbi görüntüleme yazılımı bu kuralı kullanır. RAS+ ile tek farkı ilk iki eksenin işaretidir: aynı noktanın x ve y değerleri ters işaretlidir.',
    nokta: '(30, −20, 10)',
  },
  voksel: {
    baslik: 'Voksel dizini: dosyanın içindeki sıra',
    metin:
      'Görüntü, küçük küplerden (voksellerden) oluşan bir dizidir. Dizideki sıra numaraları (i, j, k) yalnızca kaçıncı küp olduğunu söyler; (0, 0, 0) ilk vokselin merkezidir. Bu sayılardan tek başına sağ ile sol anlaşılmaz. Dosyadaki afin matris, voksel numarasını hastanın üzerindeki gerçek konuma (ör. RAS+ milimetresine) çevirir. Şemadaki sarı nokta bu ızgarada [2, 5] karesindedir; k, baktığımız dilimin sırasıdır.',
    nokta: '[2, 5, k]',
  },
};

function Ok({
  x1,
  y1,
  x2,
  y2,
  renk,
  etiket,
  lx,
  ly,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  renk: string;
  etiket: string;
  lx: number;
  ly: number;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const u1 = [x2 - 9 * Math.cos(a - 0.45), y2 - 9 * Math.sin(a - 0.45)];
  const u2 = [x2 - 9 * Math.cos(a + 0.45), y2 - 9 * Math.sin(a + 0.45)];
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={renk} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${x2},${y2} L${u1[0]},${u1[1]} L${u2[0]},${u2[1]} Z`} fill={renk} />
      <text x={lx} y={ly} fontSize="12" fontWeight="700" fill={renk} textAnchor="middle">
        {etiket}
      </text>
    </g>
  );
}

export function KoordinatEksenleri() {
  const [k, setK] = useState<Kural>('ras');
  const b = BILGI[k];
  const X = '#ef5d7b';
  const Y = '#25a993';
  const Z = '#5b84f2';
  // Baş yukarıdan: burun yukarıda; hastanın sağı ekranın sağında.
  const cx = 138;
  const cy = 122;
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Koordinat kuralı"
        deger={k}
        onDegis={setK}
        secenekler={[
          { d: 'ras', ad: 'RAS+ (NIfTI, MNI)' },
          { d: 'lps', ad: 'LPS+ (DICOM)' },
          { d: 'voksel', ad: 'Voksel dizini' },
        ]}
      />
      <svg viewBox="0 0 400 264" className="mx-auto w-full max-w-2xl" role="img" aria-label={b.baslik}>
        {/* Baş, yukarıdan */}
        <ellipse cx={cx} cy={cy} rx="74" ry="96" fill="#e9e3d8" stroke="#a89f90" strokeWidth="2" />
        <path d={`M${cx - 10},${cy - 94} L${cx},${cy - 110} L${cx + 10},${cy - 94} Z`} fill="#a89f90" />
        <line x1={cx} y1={cy - 96} x2={cx} y2={cy + 96} stroke="#a89f90" strokeWidth="1.2" strokeDasharray="4 4" />
        <text x={cx} y={cy - 114} textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          ön (burun)
        </text>
        <text x={cx - 80} y={cy - 2} textAnchor="end" fontSize="10.5" fill="var(--ink-3)">
          <tspan x={cx - 80}>hastanın</tspan>
          <tspan x={cx - 80} dy="13">
            solu
          </tspan>
        </text>
        <text x={cx + 80} y={cy - 2} textAnchor="start" fontSize="10.5" fill="var(--ink-3)">
          <tspan x={cx + 80}>hastanın</tspan>
          <tspan x={cx + 80} dy="13">
            sağı
          </tspan>
        </text>
        {/* Örnek nokta: hastanın 30 mm solunda, 20 mm önde */}
        <circle cx={cx - 34} cy={cy - 24} r="7" fill="#e0a32e" stroke="#fff" strokeWidth="2" />

        {k === 'voksel' ? (
          <g>
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`d${i}`}
                x1={cx - 72 + i * 18}
                y1={cy - 72}
                x2={cx - 72 + i * 18}
                y2={cy + 72}
                stroke="var(--ink-3)"
                strokeWidth="0.6"
                opacity="0.5"
              />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`y${i}`}
                x1={cx - 72}
                y1={cy - 72 + i * 18}
                x2={cx + 72}
                y2={cy - 72 + i * 18}
                stroke="var(--ink-3)"
                strokeWidth="0.6"
                opacity="0.5"
              />
            ))}
            <rect x={cx - 72} y={cy + 54} width="18" height="18" fill="#5b84f2" opacity="0.5" />
            <Ok x1={cx - 63} y1={cy + 63} x2={cx + 80} y2={cy + 63} renk={X} etiket="i" lx={cx + 90} ly={cy + 67} />
            <Ok x1={cx - 63} y1={cy + 63} x2={cx - 63} y2={cy - 82} renk={Y} etiket="j" lx={cx - 63} ly={cy - 88} />
          </g>
        ) : (
          <g>
            {k === 'ras' ? (
              <>
                <Ok x1={cx} y1={cy} x2={cx + 62} y2={cy} renk={X} etiket="+x (sağ)" lx={cx + 38} ly={cy + 20} />
                <Ok x1={cx} y1={cy} x2={cx} y2={cy - 66} renk={Y} etiket="+y (ön)" lx={cx + 30} ly={cy - 58} />
              </>
            ) : (
              <>
                <Ok x1={cx} y1={cy} x2={cx - 62} y2={cy} renk={X} etiket="+x (sol)" lx={cx - 38} ly={cy + 20} />
                <Ok x1={cx} y1={cy} x2={cx} y2={cy + 66} renk={Y} etiket="+y (arka)" lx={cx + 36} ly={cy + 52} />
              </>
            )}
            <circle cx={cx} cy={cy} r="9" fill="#fff" stroke={Z} strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r="3" fill={Z} />
            <text x={cx + 14} y={cy - 8} fontSize="11" fontWeight="700" fill={Z}>
              +z (yukarı)
            </text>
          </g>
        )}

        {/* Sağdaki bilgi kartı */}
        <g transform="translate(272 40)">
          <rect x="0" y="0" width="122" height="122" rx="10" fill="var(--surface-2)" />
          <text x="10" y="20" fontSize="10.5" fill="var(--ink-3)">
            <tspan x="10">Sarı nokta:</tspan>
            <tspan x="10" dy="15">
              30 mm sol,
            </tspan>
            <tspan x="10" dy="15">
              20 mm ön,
            </tspan>
            <tspan x="10" dy="15">
              10 mm yukarı
            </tspan>
          </text>
          <text x="10" y="104" fontSize="14" fontWeight="700" fill="var(--ink)">
            {b.nokta}
          </text>
        </g>
        <text x="200" y="244" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          Yukarıdan bakış: burun yukarıda, hastanın sağı sağda.
        </text>
        <text x="200" y="259" textAnchor="middle" fontSize="10.5" fill="var(--ink-3)">
          Şema; oranlar yaklaşıktır.
        </text>
      </svg>
      <div aria-live="polite">
        <p className="font-semibold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
