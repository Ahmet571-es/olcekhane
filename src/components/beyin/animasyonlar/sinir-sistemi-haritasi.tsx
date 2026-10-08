'use client';

import { useRef, useState } from 'react';
import { Secenekler, useHareketAzaltilmis, useKare, yolNoktasi } from './ortak';

/**
 * Sinir sisteminin haritası: merkezî (beyin ve omurilik) ve çevresel (sinirler, gangliyonlar) bölümler. "Başlat"a
 * basınca titreşen telefon örneğiyle algılama, iletim, birleştirme ve tepki adımları sırayla canlanır.
 */

const MSS = '#4f7cf0';
const CSS = '#e09a24';
const TEPKI = '#ef5d7b';

const GOVDE =
  'M159.5,104 L173,104 L173,120 C188,124 204,126 214,132 C226,138 233,146 234,158 L246,232 L260,310 C266,322 268,336 262,346 C256,352 248,346 247,334 L244,314 L229,238 L218,184 C214,215 209,250 210,272 C211,286 214,296 214,306 C213,360 206,420 203,516 C214,526 220,536 212,542 L186,542 C182,532 184,522 185,514 C182,440 176,380 166,334 L159.5,332 Z';

const SINIRLER_SAG = [
  'M161,140 C180,138 200,134 214,144 C226,152 232,170 236,190 L246,240 L256,300 L260,330',
  'M161,176 C180,176 196,181 205,192',
  'M161,201 C180,201 196,206 206,216',
  'M161,226 C179,226 195,231 206,241',
  'M161,290 C168,300 178,310 182,330 C186,380 190,440 194,520',
  'M161,86 C168,86 176,84 182,78',
  'M161,92 C170,95 178,98 186,96',
];

const DUYU_YOLU = 'M260,330 L256,300 L246,240 L236,190 C232,170 226,152 214,144 C200,134 180,138 161,140 L160,96 L160,56';
const KOMUT_YOLU = 'M160,56 L160,96 L161,140 C180,138 200,134 214,144 C226,152 232,170 236,190 L246,240 L256,300 L260,330';

const ADIMLAR = [
  'Başlat’a bas: elindeki telefon titremeye başlayacak.',
  '1. Algılama: Parmak ucundaki duyu almaçları titreşimi fark eder.',
  '2. İletim: Sinyal koldaki sinir boyunca omuriliğe, oradan beyne çıkar.',
  '3. Birleştirme: Beyin gelen bilgiyi yorumlar ve karar verir: “Telefon çalıyor, açayım.”',
  '4. Tepki: Beyinden çıkan komut omurilikten kol sinirine iner; kaslar kasılır ve el telefonu kavrar.',
];
const SURE = [0, 1300, 1700, 1300, 1700];

type Gorunum = 'hepsi' | 'mss' | 'css';

export function SinirSistemiHaritasi() {
  const azalt = useHareketAzaltilmis();
  const [gorunum, setGorunum] = useState<Gorunum>('hepsi');
  const [adim, setAdim] = useState(0);
  const [oran, setOran] = useState(0);
  const [oynuyor, setOynuyor] = useState(false);
  const duyuRef = useRef<SVGPathElement>(null);
  const komutRef = useRef<SVGPathElement>(null);
  const [sinyal, setSinyal] = useState<{ x: number; y: number; renk: string } | null>(null);
  const sinyalBul = (a: number, o: number) =>
    a === 2 ? { ...yolNoktasi(duyuRef.current, o), renk: CSS } : a === 4 ? { ...yolNoktasi(komutRef.current, o), renk: TEPKI } : null;

  const durumRef = useRef({ adim: 0, oran: 0 });
  useKare(oynuyor, (dt) => {
    const d = durumRef.current;
    d.oran += dt / SURE[d.adim];
    if (d.oran >= 1) {
      if (d.adim >= 4) {
        d.oran = 1;
        setOynuyor(false);
      } else {
        d.adim += 1;
        d.oran = 0;
      }
    }
    setAdim(d.adim);
    setOran(d.oran);
    setSinyal(sinyalBul(d.adim, d.oran));
  });

  const baslat = () => {
    if (azalt) {
      const a = adim >= 4 ? 1 : adim + 1;
      durumRef.current = { adim: a, oran: 1 };
      setAdim(a);
      setOran(1);
      setSinyal(sinyalBul(a, 1));
      return;
    }
    durumRef.current = { adim: 1, oran: 0 };
    setAdim(1);
    setOran(0);
    setOynuyor(true);
  };

  const mssSoluk = gorunum === 'css' ? 0.18 : 1;
  const cssSoluk = gorunum === 'mss' ? 0.15 : 1;
  const beyinParlak = adim === 3;
  const titresim = adim === 1;
  const kavra = adim === 4 && oran > 0.95;

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <svg viewBox="0 0 320 560" className="mx-auto w-full max-w-[19rem]" role="img" aria-label="İnsan bedeninde merkezî ve çevresel sinir sistemi">
        <defs>
          <radialGradient id="ssh-parlama">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor={CSS} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Beden */}
        <ellipse cx="160" cy="60" rx="38" ry="44" fill="var(--surface-2)" />
        <path d={GOVDE} fill="var(--surface-2)" />
        <path d={GOVDE} fill="var(--surface-2)" transform="translate(320,0) scale(-1,1)" />

        {/* Çevresel sinir sistemi */}
        <g stroke={CSS} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity={cssSoluk} style={{ transition: 'opacity .4s' }}>
          {SINIRLER_SAG.map((d) => (
            <g key={d}>
              <path d={d} />
              <path d={d} transform="translate(320,0) scale(-1,1)" />
            </g>
          ))}
          {[150, 200, 250].flatMap((y) => [
            <circle key={`a${y}`} cx="167.5" cy={y} r="3.4" fill={CSS} stroke="none" />,
            <circle key={`b${y}`} cx="152.5" cy={y} r="3.4" fill={CSS} stroke="none" />,
          ])}
        </g>

        {/* Merkezî sinir sistemi */}
        <g opacity={mssSoluk} style={{ transition: 'opacity .4s' }}>
          <path
            d="M128,62 C126,36 146,24 162,25 C182,25 196,38 194,58 C194,70 186,78 176,80 C168,84 156,84 148,82 C136,80 128,74 128,62 Z"
            fill={MSS}
            style={{ filter: beyinParlak ? 'drop-shadow(0 0 10px #8fb0ff)' : 'none', transition: 'filter .3s' }}
          />
          <path d="M140,48 C150,40 158,44 166,40 M146,62 C158,56 170,62 182,54 M136,70 C146,68 154,72 164,70" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M160,80 L160,300" stroke={MSS} strokeWidth="6.5" strokeLinecap="round" />
          <text x="160" y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill={MSS}>
            beyin
          </text>
          <text x="167" y="275" fontSize="11" fontWeight="700" fill={MSS}>
            omurilik
          </text>
        </g>

        {/* Telefon ve titreşim */}
        <g transform="translate(262 352) rotate(-14)">
          <rect x="-8" y="-4" width="16" height="26" rx="3.5" fill="var(--ink)" />
          <rect x="-5.5" y="-1" width="11" height="17" rx="1.5" fill={titresim ? '#7aa7ff' : 'var(--ink-3)'} />
          {titresim && !azalt && (
            <g stroke="var(--ink-2)" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity={1 - oran * 0.4}>
              <path d={`M-14,${2 + Math.sin(oran * 40) * 1.5} q-4,7 0,14`} />
              <path d={`M14,${2 - Math.sin(oran * 40) * 1.5} q4,7 0,14`} />
            </g>
          )}
        </g>
        {kavra && <circle cx="258" cy="342" r="10" fill="none" stroke={TEPKI} strokeWidth="2.5" />}

        {/* Sinyal yolları (görünmez) ve hareket eden sinyal */}
        <path ref={duyuRef} d={DUYU_YOLU} fill="none" stroke="none" />
        <path ref={komutRef} d={KOMUT_YOLU} fill="none" stroke="none" />
        {sinyal && (
          <g transform={`translate(${sinyal.x} ${sinyal.y})`}>
            <circle r="13" fill="url(#ssh-parlama)" />
            <circle r="5" fill={sinyal.renk} stroke="#fff" strokeWidth="1.5" />
          </g>
        )}
        {beyinParlak && (
          <circle cx="161" cy="54" r={18 + (azalt ? 6 : Math.sin(oran * Math.PI * 4) * 6)} fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2" />
        )}
      </svg>

      <div className="flex flex-col gap-4">
        <Secenekler
          etiket="Gösterilecek bölüm"
          deger={gorunum}
          onDegis={setGorunum}
          secenekler={[
            { d: 'hepsi', ad: 'Hepsi' },
            { d: 'mss', ad: 'Merkezî' },
            { d: 'css', ad: 'Çevresel' },
          ]}
        />
        <ul className="flex flex-col gap-2 text-[0.95rem]">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-3 shrink-0 rounded-full" style={{ background: MSS }} aria-hidden="true" />
            <span>
              <b>Merkezî sinir sistemi:</b> beyin ve omurilik.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-3 shrink-0 rounded-full" style={{ background: CSS }} aria-hidden="true" />
            <span>
              <b>Çevresel sinir sistemi:</b> beyinden ve omurilikten çıkan sinirler ile omuriliğin yanındaki küçük
              düğümler (gangliyonlar).
            </span>
          </li>
        </ul>
        <div className="rounded-2xl border border-rule bg-paper p-4" aria-live="polite">
          <p className="font-bold">Örnek: telefon titriyor</p>
          <ol className="mt-2 flex flex-col gap-1.5 text-[0.95rem]">
            {ADIMLAR.slice(1).map((a, i) => (
              <li key={a} className={adim === i + 1 ? 'font-bold text-ink' : adim > i + 1 ? 'text-ink-2' : 'text-ink-3'}>
                {a}
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-primary mt-3 rounded-full" onClick={baslat} disabled={oynuyor}>
            {azalt ? (adim >= 4 ? 'Baştan al' : 'Sonraki adım') : adim >= 4 && !oynuyor ? 'Yeniden oynat' : oynuyor ? 'Oynuyor…' : 'Başlat'}
          </button>
        </div>
      </div>
    </div>
  );
}
