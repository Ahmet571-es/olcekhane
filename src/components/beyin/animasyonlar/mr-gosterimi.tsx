'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * MR ve tomografide sağ-sol gösterimi. Radyolojik gösterimde aksiyel kesite hastanın ayak ucundan bakılır: hastanın
 * sağı ekranın solunda görünür. Bazı araştırma programlarının kullandığı nörolojik gösterimde tersidir. Hastanın sağ
 * yarımküresindeki bir işaret iki gösterimde ekranın iki ayrı yanına düşer.
 */

type Gosterim = 'radyolojik' | 'norolojik';

export function MrGosterimi() {
  const [g, setG] = useState<Gosterim>('radyolojik');
  const ayna = g === 'radyolojik';
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Gösterim kuralı"
        deger={g}
        onDegis={setG}
        secenekler={[
          { d: 'radyolojik', ad: 'Radyolojik gösterim' },
          { d: 'norolojik', ad: 'Nörolojik gösterim' },
        ]}
      />
      <svg viewBox="0 0 392 230" className="mx-auto w-full max-w-2xl" role="img" aria-label="Sırtüstü yatan hasta ve aksiyel beyin kesitinde sağ ve sol">
        {/* Sırtüstü yatan hasta (yandan); göz kesite hangi uçtan bakıldığını gösterir */}
        <rect x="32" y="150" width="150" height="10" rx="5" fill="var(--surface-2)" />
        <circle cx="54" cy="132" r="15" fill="#e8b7ab" />
        <rect x="70" y="124" width="92" height="22" rx="10" fill="#c9d6f8" />
        <path d="M162,132 L180,128 L180,142 L162,142 Z" fill="#c9d6f8" />
        <text x="54" y="174" textAnchor="middle" fontSize="10" fill="var(--ink-3)">
          baş
        </text>
        <text x="164" y="174" textAnchor="middle" fontSize="10" fill="var(--ink-3)">
          ayaklar
        </text>
        {/* Bakan göz */}
        <g style={{ transform: `translate(${ayna ? 204 : 18}px, 134px)`, transition: 'transform .8s cubic-bezier(.2,.7,.2,1)' }}>
          <path d="M-14,0 Q0,-10 14,0 Q0,10 -14,0 Z" fill="#fff" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="var(--ink)" />
        </g>
        <text x="8" y="200" fontSize="11" fill="var(--ink-2)">
          {ayna ? 'Kesite ayak ucundan bakılır.' : 'Kesite baş tarafından bakılır.'}
        </text>

        {/* Aksiyel kesit */}
        <g transform="translate(300 115)">
          <g style={{ transform: `scaleX(${ayna ? 1 : -1})`, transition: 'transform .8s cubic-bezier(.2,.7,.2,1)' }}>
            <ellipse cx="0" cy="0" rx="66" ry="86" fill="#e9e3d8" stroke="#a89f90" strokeWidth="2" />
            <line x1="0" y1="-86" x2="0" y2="86" stroke="#a89f90" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M-8,-90 L0,-104 L8,-90 Z" fill="#a89f90" />
            {/* Hastanın sağ yarımküresindeki işaret: radyolojik gösterimde ekranın solunda */}
            <circle cx="-30" cy="-12" r="14" fill="#ef5d7b" opacity="0.85" />
          </g>
          <text x="0" y="-108" textAnchor="middle" fontSize="10" fill="var(--ink-3)">
            ön (burun)
          </text>
          <text x="-62" y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">
            {ayna ? 'Sağ (R)' : 'Sol (L)'}
          </text>
          <text x="62" y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">
            {ayna ? 'Sol (L)' : 'Sağ (R)'}
          </text>
        </g>
      </svg>
      <p className="text-[0.98rem]" aria-live="polite">
        {ayna
          ? 'Radyolojik gösterim: hastaya ayak ucundan bakılıyormuş gibi; hastanın sağı ekranın solundadır. Kırmızı işaret hastanın sağ yarımküresinde olduğu hâlde ekranın sol yanında görünür. Radyologlar görüntüye böyle bakar.'
          : 'Nörolojik gösterim: hastanın sağı ekranın sağındadır. Bazı araştırma programları bu kuralı kullanır. Bu yüzden bir görüntüye bakarken önce köşedeki R (sağ) ve L (sol) harflerine bak.'}
      </p>
    </div>
  );
}
