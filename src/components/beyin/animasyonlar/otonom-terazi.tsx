'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Otonom sinir sisteminin iki kolu: sempatik ("savaş ya da kaç") ve parasempatik ("dinlen ve sindir"). Düğmeyle
 * seçilen kolun altı organa etkisi canlanır: göz bebeği, tükürük, hava yolları, kalp, sindirim ve mesane.
 * Hareketi azaltmayı seçenlerde canlandırma durur; durumlar yine görünür.
 */

type Kol = 'sempatik' | 'parasempatik';

const RENK: Record<Kol, string> = { sempatik: '#ef5d7b', parasempatik: '#25a993' };

const ETKILER: { organ: string; sempatik: string; parasempatik: string }[] = [
  { organ: 'Göz bebeği', sempatik: 'Büyür (daha çok ışık girer).', parasempatik: 'Küçülür.' },
  { organ: 'Tükürük', sempatik: 'Azalır; ağız kurur.', parasempatik: 'Akar; ağız nemli kalır.' },
  { organ: 'Hava yolları', sempatik: 'Genişler.', parasempatik: 'Daralır.' },
  { organ: 'Kalp', sempatik: 'Hızlanır (egzersizde dakikada 120–140 atıma kadar).', parasempatik: 'Yavaşlar (dinlenmede dakikada 60–80 atım).' },
  { organ: 'Sindirim', sempatik: 'Bağırsak hareketleri ve salgılar azalır.', parasempatik: 'Bağırsak hareketleri ve salgılar artar.' },
  { organ: 'Mesane', sempatik: 'Mesane duvarı gevşer; idrar biriktirilir.', parasempatik: 'Mesane kasılır, iç büzgen gevşer; mesane boşalır.' },
];

function Goz({ kol }: { kol: Kol }) {
  return (
    <svg viewBox="0 0 80 50" className="h-14 w-full" aria-hidden="true">
      <path d="M6,25 Q40,-2 74,25 Q40,52 6,25 Z" fill="#fff" stroke="var(--ink-3)" strokeWidth="1.5" />
      <circle cx="40" cy="25" r="14" fill="#5b84f2" />
      <circle cx="40" cy="25" r={kol === 'sempatik' ? 10 : 4} fill="#0d1629" style={{ transition: 'r .7s ease' }} />
      <circle cx="44" cy="20" r="2.5" fill="#fff" opacity="0.8" />
    </svg>
  );
}

function Agiz({ kol }: { kol: Kol }) {
  return (
    <svg viewBox="0 0 80 50" className="h-14 w-full" aria-hidden="true">
      <path d="M14,18 Q40,40 66,18" fill="none" stroke="var(--ink-2)" strokeWidth="3" strokeLinecap="round" />
      {kol === 'parasempatik' &&
        [26, 40, 54].map((x, i) => (
          <circle key={x} cx={x} cy="30" r="3" fill="#5aa6e6" className="otonom-damla" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      {kol === 'sempatik' && (
        <text x="40" y="46" textAnchor="middle" fontSize="9" fill="var(--ink-3)">
          kuru
        </text>
      )}
    </svg>
  );
}

function Bronslar({ kol }: { kol: Kol }) {
  const w = kol === 'sempatik' ? 6 : 2.2;
  return (
    <svg viewBox="0 0 80 50" className="h-14 w-full" aria-hidden="true">
      <g fill="none" stroke="#e98c8c" strokeLinecap="round" style={{ transition: 'stroke-width .7s ease' }} strokeWidth={w}>
        <path d="M40,4 L40,18 M40,18 L26,30 L18,44 M40,18 L54,30 L62,44 M26,30 L32,44 M54,30 L48,44" />
      </g>
    </svg>
  );
}

function Kalp({ kol }: { kol: Kol }) {
  return (
    <svg viewBox="0 0 80 50" className="h-14 w-full" aria-hidden="true">
      <g className="otonom-kalp" style={{ animationDuration: kol === 'sempatik' ? '0.46s' : '0.92s', transformOrigin: '40px 26px' }}>
        <path d="M40,44 C10,26 14,6 30,8 C36,9 40,14 40,16 C40,14 44,9 50,8 C66,6 70,26 40,44 Z" fill="#ef5d7b" />
      </g>
    </svg>
  );
}

function Bagirsak({ kol }: { kol: Kol }) {
  return (
    <svg viewBox="0 0 80 50" className="h-14 w-full" aria-hidden="true">
      <path
        d="M8,14 C22,4 30,24 44,14 C58,4 66,24 74,14 M8,34 C22,24 30,44 44,34 C58,24 66,44 74,34"
        fill="none"
        stroke="#f2b544"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 6"
        className="otonom-bagirsak"
        style={{ animationDuration: kol === 'parasempatik' ? '0.9s' : '4s' }}
      />
    </svg>
  );
}

function Mesane({ kol }: { kol: Kol }) {
  const r = kol === 'sempatik' ? 18 : 11;
  return (
    <svg viewBox="0 0 80 50" className="h-14 w-full" aria-hidden="true">
      <ellipse cx="40" cy="22" rx={r * 1.15} ry={r} fill="#f6c177" stroke="#d99a3e" strokeWidth="1.5" style={{ transition: 'rx .7s ease, ry .7s ease' }} />
      <path d="M40,40 L40,48" stroke="#d99a3e" strokeWidth="3" />
      {kol === 'parasempatik' && <path d="M34,44 L40,50 L46,44" fill="none" stroke="#d99a3e" strokeWidth="2" />}
    </svg>
  );
}

const SIMGELER = [Goz, Agiz, Bronslar, Kalp, Bagirsak, Mesane];

export function OtonomTerazi() {
  const [kol, setKol] = useState<Kol>('sempatik');
  const egim = kol === 'sempatik' ? -8 : 8;
  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Otonom sistemin kolu"
        deger={kol}
        onDegis={setKol}
        secenekler={[
          { d: 'sempatik', ad: 'Sempatik: savaş ya da kaç' },
          { d: 'parasempatik', ad: 'Parasempatik: dinlen ve sindir' },
        ]}
      />
      <div className="grid items-center gap-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <svg viewBox="0 0 160 90" className="mx-auto w-40" role="img" aria-label={kol === 'sempatik' ? 'Terazi sempatik yana eğik' : 'Terazi parasempatik yana eğik'}>
          <path d="M80,30 L80,82 M58,84 L102,84" stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />
          <g style={{ transform: `rotate(${egim}deg)`, transformOrigin: '80px 30px', transition: 'transform .8s cubic-bezier(.2,.7,.2,1)' }}>
            <path d="M20,30 L140,30" stroke="var(--ink-2)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="22" cy="40" r="13" fill={RENK.sempatik} />
            <text x="22" y="44" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              S
            </text>
            <circle cx="138" cy="40" r="13" fill={RENK.parasempatik} />
            <text x="138" y="44" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              P
            </text>
          </g>
          <circle cx="80" cy="30" r="4" fill="var(--ink)" />
        </svg>
        <p className="text-[0.98rem]" aria-live="polite">
          {kol === 'sempatik'
            ? 'Sempatik kol bedeni harekete hazırlar: tehlike, heyecan ya da egzersiz anında öne çıkar.'
            : 'Parasempatik kol dinlenme, sindirme ve onarım hâlini yönetir.'}{' '}
          İki kol çoğu organda birbirinin tersini yapar; organın o anki durumu ikisinin dengesine bağlıdır.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {ETKILER.map((e, i) => {
          const Simge = SIMGELER[i];
          return (
            <li key={e.organ} className="flex flex-col gap-1 rounded-2xl border border-rule bg-paper p-3">
              <Simge kol={kol} />
              <p className="font-bold">{e.organ}</p>
              <p className="t-small flex items-start gap-1.5 text-ink-2">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: RENK[kol] }} aria-hidden="true" />
                <span>{e[kol]}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
