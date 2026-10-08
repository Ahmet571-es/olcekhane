'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Yön pusulası: sinir sisteminin ekseni orta beyin hizasında yaklaşık 90° bükülür. Bu yüzden "dorsal" beyinde
 * yukarıyı, omurilikte sırtı gösterir. Düğmeyle pusula eksen boyunca kayar ve döner.
 */

type Mod = 'beyin' | 'omurilik' | 'ic-dis';

const RENK = { rostral: '#4f7cf0', kaudal: '#7a8aa8', dorsal: '#ef5d7b', ventral: '#25a993' };

const MODLAR: Record<Exclude<Mod, 'ic-dis'>, { cx: number; cy: number; aci: number; metin: string }> = {
  beyin: {
    cx: 214,
    cy: 90,
    aci: 0,
    metin:
      'Beyinde (ön beyinde) rostral öne, burna doğru; kaudal arkaya; dorsal yukarıya, tepeye doğru; ventral aşağıya doğrudur.',
  },
  omurilik: {
    cx: 196,
    cy: 258,
    aci: -90,
    metin:
      'Eksen orta beyin hizasında aşağı döner. Beyin sapında ve omurilikte rostral yukarı, kaudal aşağı; dorsal arkaya (sırta), ventral öne (karına) doğrudur.',
  },
};

const OKLAR = [
  { ad: 'rostral', dx: 1, dy: 0 },
  { ad: 'kaudal', dx: -1, dy: 0 },
  { ad: 'dorsal', dx: 0, dy: -1 },
  { ad: 'ventral', dx: 0, dy: 1 },
] as const;

export function YonPusulasi() {
  const [mod, setMod] = useState<Mod>('beyin');
  const yer = MODLAR[mod === 'ic-dis' ? 'beyin' : mod];
  const r = (yer.aci * Math.PI) / 180;
  const cevir = (dx: number, dy: number) => ({ x: dx * Math.cos(r) - dy * Math.sin(r), y: dx * Math.sin(r) + dy * Math.cos(r) });

  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Pusulanın yeri"
        deger={mod}
        onDegis={setMod}
        secenekler={[
          { d: 'beyin', ad: 'Beyinde' },
          { d: 'omurilik', ad: 'Omurilikte' },
          { d: 'ic-dis', ad: 'Önden: iç ve dış' },
        ]}
      />
      <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {mod !== 'ic-dis' ? (
          <svg viewBox="0 0 360 320" className="w-full" role="img" aria-label="Yandan bakılan bir başta beyin, omurilik ve yön okları">
            <path
              d="M120,40 C170,10 250,14 282,60 C298,84 300,110 296,128 L312,160 C314,166 310,170 304,170 L298,172 L300,186 C300,196 294,202 284,202 L286,214 C286,226 276,232 262,230 L236,228 L232,262 L236,320 L150,320 L156,262 C126,250 102,220 96,180 C88,130 90,64 120,40 Z"
              fill="var(--surface-2)"
            />
            <path
              d="M118,70 C150,36 238,34 266,74 C282,98 276,130 252,142 C228,152 206,146 190,150 C166,156 140,156 124,140 C106,124 104,92 118,70 Z"
              fill="#c9d6f8"
              stroke="#8ea6ea"
              strokeWidth="1.5"
            />
            <path d="M128,150 C140,146 160,150 172,158 C170,172 150,178 136,170 C126,164 124,156 128,150 Z" fill="#f6c3ad" stroke="#e59a7c" strokeWidth="1.2" />
            <path d="M186,144 C192,170 196,186 196,206 L195,320" stroke="#a99be8" strokeWidth="11" strokeLinecap="round" fill="none" />
            {/* Sinir ekseni */}
            <path d="M268,100 L204,100 C188,100 190,136 192,160 L195,318" stroke="var(--ink-3)" strokeWidth="1.6" strokeDasharray="5 5" fill="none" />
            <text x="204" y="304" fontSize="11" fill="var(--ink-3)">
              sinir ekseni
            </text>
            <text x="300" y="150" fontSize="11" fill="var(--ink-3)">
              burun
            </text>
            <text x="100" y="250" fontSize="11" fill="var(--ink-3)">
              sırt
            </text>

            <g style={{ transform: `translate(${yer.cx}px, ${yer.cy}px) rotate(${yer.aci}deg)`, transition: 'transform 0.9s cubic-bezier(.2,.7,.2,1)' }}>
              <circle r="5" fill="var(--ink)" />
              {OKLAR.map((o) => (
                <g key={o.ad} stroke={RENK[o.ad]} fill={RENK[o.ad]}>
                  <line x1={o.dx * 8} y1={o.dy * 8} x2={o.dx * 38} y2={o.dy * 38} strokeWidth="4" strokeLinecap="round" />
                  <path
                    d={`M${o.dx * 48},${o.dy * 48} L${o.dx * 36 - o.dy * 8},${o.dy * 36 + o.dx * 8} L${o.dx * 36 + o.dy * 8},${o.dy * 36 - o.dx * 8} Z`}
                    stroke="none"
                  />
                </g>
              ))}
            </g>
            {OKLAR.map((o) => {
              const p = cevir(o.dx, o.dy);
              const x = yer.cx + p.x * 66;
              const y = yer.cy + p.y * 62;
              return (
                <g key={o.ad} style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform 0.9s cubic-bezier(.2,.7,.2,1)' }}>
                  <rect x="-31" y="-11" width="62" height="21" rx="10.5" fill="var(--surface)" stroke={RENK[o.ad]} strokeWidth="1.5" />
                  <text x="0" y="4" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
                    {o.ad}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg viewBox="0 0 360 320" className="w-full" role="img" aria-label="Önden bakılan beyinde iç (medial) ve dış (lateral) yönler">
            <path d="M180,24 C250,24 292,80 292,150 C292,230 246,300 180,300 C114,300 68,230 68,150 C68,80 110,24 180,24 Z" fill="var(--surface-2)" />
            <path d="M176,58 C138,54 102,84 102,130 C102,170 130,198 176,192 Z" fill="#c9d6f8" stroke="#8ea6ea" strokeWidth="1.5" />
            <path d="M184,58 C222,54 258,84 258,130 C258,170 230,198 184,192 Z" fill="#c9d6f8" stroke="#8ea6ea" strokeWidth="1.5" />
            <line x1="180" y1="36" x2="180" y2="292" stroke="var(--ink-3)" strokeWidth="1.6" strokeDasharray="5 5" />
            <text x="186" y="290" fontSize="11" fill="var(--ink-3)">
              orta hat
            </text>
            <g fill="#4f7cf0" stroke="#4f7cf0">
              <line x1="118" y1="112" x2="160" y2="112" strokeWidth="4" strokeLinecap="round" />
              <path d="M172,112 L158,104 L158,120 Z" stroke="none" />
            </g>
            <text x="114" y="100" fontSize="12" fontWeight="700" fill="var(--ink)">
              medial (içe)
            </text>
            <g fill="#ef5d7b" stroke="#ef5d7b">
              <line x1="150" y1="150" x2="94" y2="150" strokeWidth="4" strokeLinecap="round" />
              <path d="M80,150 L94,142 L94,158 Z" stroke="none" />
            </g>
            <text x="80" y="176" fontSize="12" fontWeight="700" fill="var(--ink)">
              lateral (dışa)
            </text>
            <text x="200" y="130" fontSize="12" fill="var(--ink-2)">
              sol yarımküre
            </text>
            <text x="104" y="226" fontSize="12" fill="var(--ink-2)">
              sağ yarımküre
            </text>
          </svg>
        )}
        <div className="flex flex-col gap-3 text-[0.98rem]" aria-live="polite">
          <p>
            {mod === 'ic-dis'
              ? 'Medial, orta hatta doğru; lateral, yana doğru demektir. Aynı taraftaki yapılara ipsilateral, karşı taraftakilere kontralateral denir. Önden bakarken kişinin sol yarımküresi senin sağında kalır.'
              : yer.metin}
          </p>
          <p className="t-small text-ink-2">
            Bedene göre yönler değişmez: üst (superior) başa, alt (inferior) ayaklara, ön (anterior) yüze, arka (posterior) sırta doğrudur.
          </p>
        </div>
      </div>
    </div>
  );
}
