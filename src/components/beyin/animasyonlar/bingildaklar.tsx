'use client';

import { useState } from 'react';
import { Secenekler } from './ortak';

/**
 * Yenidoğan kafatası: kemikler, dikişler (sütürler) ve bıngıldaklar (fontaneller). Yukarıdan ve yandan bakılır; yaş
 * düğmeleriyle bıngıldakların küçülüp kapandığı izlenir. Erişkinde bıngıldakların yerinde kraniometrik noktalar
 * kalır: ön bıngıldak → bregma, arka → lambda, sfenoid → pterion, mastoid → asterion. Kapanma yaşları çocuktan
 * çocuğa değişir; çizimdeki yaşlar kaynaklardaki aralıklara göre seçilmiş örneklerdir.
 */

type Bakis = 'ust' | 'yan';
type Yas = 'dogum' | 'alti' | 'iki';

/** Bıngıldak ölçekleri (1 = doğumdaki boyut). */
const OLCEK: Record<Yas, { on: number; arka: number; sfenoid: number; mastoid: number; metopik: number }> = {
  dogum: { on: 1, arka: 1, sfenoid: 1, mastoid: 1, metopik: 1 },
  alti: { on: 0.75, arka: 0, sfenoid: 0, mastoid: 0.45, metopik: 0.6 },
  iki: { on: 0, arka: 0, sfenoid: 0, mastoid: 0, metopik: 0 },
};

const BILGI: Record<Yas, { baslik: string; metin: string }> = {
  dogum: {
    baslik: 'Doğumda: altı bıngıldak',
    metin:
      'Yenidoğanda bir ön, bir arka, iki sfenoid ve iki mastoid bıngıldak vardır. En büyüğü, iki alın ve iki yan kafa kemiği arasındaki baklava biçimli ön bıngıldaktır (term bebeklerde ortalama yaklaşık 2,6 cm). Bıngıldaklar ve henüz kaynaşmamış dikişler, doğum kanalından geçerken kafatasının biçim değiştirmesine izin verir.',
  },
  alti: {
    baslik: 'İlk aylar: küçük bıngıldaklar kapanır',
    metin:
      'Arka bıngıldak ilk altı ay içinde kapanır. Sfenoid bıngıldak doğumdan 3–6 ay, mastoid bıngıldak 6–8 ay sonra kaybolur. Alın kemiklerinin arasındaki metopik dikiş çoğunlukla ilk yıl içinde kaynaşır. Beyin hızla büyürken kafatası da onunla büyür: baş çevresi ilk yılda ortalama 12 cm artar.',
  },
  iki: {
    baslik: 'İki yaş ve sonrası: bıngıldaklar kapanmış, dikişler açık',
    metin:
      'Ön bıngıldak çoğunlukla 12–18. aylar arasında kapanır; iki yaşa kadar bıngıldaklar kaybolur. Yerlerinde kraniometrik noktalar kalır: ön bıngıldak → bregma, arka → lambda, sfenoid → pterion, mastoid → asterion. Öteki dikişler açık kalır ve ancak erişkinlikte kaynaşır.',
  },
};

/** Yukarıdan bakış: yenidoğan başı (ön yukarıda). */
function UstBakis({ o }: { o: (typeof OLCEK)[Yas] }) {
  const onBoy = 30 * o.on;
  const arkaBoy = 14 * o.arka;
  return (
    <svg viewBox="0 0 300 330" className="mx-auto w-full max-w-sm" role="img" aria-label="Yenidoğan kafatası, yukarıdan">
      <rect x="0" y="0" width="300" height="330" rx="16" fill="#f7f3ea" />
      {/* Kemikler */}
      <path d="M150,30 C96,30 64,70 62,120 L148,132 L148,40 Z" fill="#f2c9a0" />
      <path d="M150,30 C204,30 236,70 238,120 L152,132 L152,40 Z" fill="#f2c9a0" />
      <path d="M62,120 C58,180 70,232 98,262 L148,250 L148,132 Z" fill="#c9e4f2" />
      <path d="M238,120 C242,180 230,232 202,262 L152,250 L152,132 Z" fill="#c9e4f2" />
      <path d="M98,262 C118,290 136,300 150,300 C164,300 182,290 202,262 L152,250 L148,250 Z" fill="#ddd3f3" />
      {/* Dikişler */}
      <g stroke="#7d6b4f" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M150,34 L150,132" opacity={o.metopik > 0 ? 1 : 0.18} />
        <path d="M62,120 Q105,128 150,132 Q195,128 238,120" />
        <path d="M150,132 L150,250" />
        <path d="M98,262 L150,250 L202,262" />
      </g>
      {/* Bıngıldaklar */}
      {onBoy > 0 && (
        <path
          d={`M150,${132 - onBoy} L${150 + onBoy * 0.75},132 L150,${132 + onBoy * 1.15} L${150 - onBoy * 0.75},132 Z`}
          fill="#fff7d6"
          stroke="#c99a2e"
          strokeWidth="2"
          style={{ transition: 'all .6s ease' }}
        />
      )}
      {arkaBoy > 0 && (
        <path
          d={`M150,${250 + arkaBoy} L${150 - arkaBoy},${250 - arkaBoy * 0.3} L${150 + arkaBoy},${250 - arkaBoy * 0.3} Z`}
          fill="#fff7d6"
          stroke="#c99a2e"
          strokeWidth="2"
        />
      )}
      {/* Etiketler */}
      <g fontSize="10.5" fill="#2b2b2b" textAnchor="middle">
        <text x="104" y="82">
          Alın kemiği
        </text>
        <text x="196" y="82">
          Alın kemiği
        </text>
        <text x="100" y="196">
          Yan kafa
        </text>
        <text x="200" y="196">
          Yan kafa
        </text>
        <text x="150" y="284">
          Art kafa
        </text>
      </g>
      <g fontSize="10" fill="#6b5a3e" fontWeight="700">
        {o.metopik > 0 && (
          <text x="156" y="62" textAnchor="start">
            Metopik dikiş
          </text>
        )}
        <text x="244" y="118" textAnchor="end" transform="translate(0,-6)">
          Koronal
        </text>
        <text x="156" y="210" textAnchor="start">
          Sagittal
        </text>
        <text x="214" y="262" textAnchor="start">
          Lambdoid
        </text>
      </g>
      <g fontSize="10" fontWeight="700" fill="#9a6a00">
        {onBoy > 0 ? (
          <text x="100" y="150" textAnchor="middle">
            Ön bıngıldak
          </text>
        ) : (
          <text x="112" y="150" textAnchor="middle">
            Bregma
          </text>
        )}
        {arkaBoy > 0 ? (
          <text x="96" y="248" textAnchor="middle">
            Arka bıngıldak
          </text>
        ) : (
          <text x="112" y="248" textAnchor="middle">
            Lambda
          </text>
        )}
      </g>
      {onBoy === 0 && <circle cx="150" cy="132" r="4" fill="#c0392b" />}
      {arkaBoy === 0 && <circle cx="150" cy="250" r="4" fill="#c0392b" />}
    </svg>
  );
}

/** Yandan bakış: yenidoğan kafatası (yüz solda). */
function YanBakis({ o }: { o: (typeof OLCEK)[Yas] }) {
  const sf = 12 * o.sfenoid;
  const ms = 11 * o.mastoid;
  const on = 16 * o.on;
  return (
    <svg viewBox="0 0 320 260" className="mx-auto w-full max-w-md" role="img" aria-label="Yenidoğan kafatası, yandan">
      <rect x="0" y="0" width="320" height="260" rx="16" fill="#f7f3ea" />
      {/* Kafatası kubbesi ve küçük yüz */}
      <path
        d="M60,150 C52,80 110,30 180,32 C250,34 296,84 292,148 C290,182 274,206 252,214 L92,214 C74,200 62,178 60,150 Z"
        fill="#c9e4f2"
      />
      <path d="M60,150 C52,80 110,30 150,34 L136,120 L86,140 Z" fill="#f2c9a0" />
      <path d="M252,214 C274,206 290,182 292,148 C294,120 286,98 272,82 L226,150 L230,214 Z" fill="#ddd3f3" />
      <path d="M86,140 L136,120 L196,128 L226,150 L230,214 L120,214 C106,196 96,170 86,140 Z" fill="#d7e8d5" />
      <path d="M86,140 L120,214 L92,214 C74,200 62,178 60,150 Z" fill="#f5c2b5" />
      {/* Yüz */}
      <path d="M60,150 C40,160 30,186 38,214 C46,236 70,246 96,240 L120,214 L92,214 Z" fill="#efe6d4" stroke="#b7a684" />
      <circle cx="62" cy="176" r="13" fill="#f7f3ea" stroke="#b7a684" />
      {/* Dikişler */}
      <g stroke="#7d6b4f" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M150,34 L136,120 L86,140" />
        <path d="M136,120 L196,128 L226,150" />
        <path d="M272,82 L226,150 L230,214" />
        <path d="M86,140 L120,214" />
      </g>
      {/* Bıngıldaklar */}
      {on > 0 && (
        <path
          d={`M${150 - on * 0.4},${34 + on * 0.2} L${150 + on * 0.5},${34} L${150},${34 + on}`}
          fill="#fff7d6"
          stroke="#c99a2e"
          strokeWidth="2"
        />
      )}
      {sf > 0 && (
        <path d={`M${86 - sf},140 L86,${140 - sf} L${86 + sf},140 L86,${140 + sf} Z`} fill="#fff7d6" stroke="#c99a2e" strokeWidth="2" />
      )}
      {ms > 0 && (
        <path d={`M${226 - ms},150 L226,${150 - ms} L${226 + ms},150 L226,${150 + ms} Z`} fill="#fff7d6" stroke="#c99a2e" strokeWidth="2" />
      )}
      {sf === 0 && <circle cx="86" cy="140" r="4" fill="#c0392b" />}
      {ms === 0 && <circle cx="226" cy="150" r="4" fill="#c0392b" />}
      <g fontSize="10.5" fill="#2b2b2b" textAnchor="middle">
        <text x="104" y="96">
          Alın
        </text>
        <text x="196" y="84">
          Yan kafa
        </text>
        <text x="176" y="182">
          Şakak
        </text>
        <text x="266" y="166">
          Art kafa
        </text>
        <text x="96" y="196">
          Kama
        </text>
      </g>
      <g fontSize="10" fontWeight="700" fill="#9a6a00" textAnchor="middle">
        <text x="70" y="124">
          {sf > 0 ? 'Sfenoid bıngıldak' : 'Pterion'}
        </text>
        <text x="240" y="232">
          {ms > 0 ? 'Mastoid bıngıldak' : 'Asterion'}
        </text>
      </g>
    </svg>
  );
}

export function Bingildaklar() {
  const [bakis, setBakis] = useState<Bakis>('ust');
  const [yas, setYas] = useState<Yas>('dogum');
  const o = OLCEK[yas];
  const b = BILGI[yas];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Secenekler
          etiket="Bakış"
          deger={bakis}
          onDegis={setBakis}
          secenekler={[
            { d: 'ust', ad: 'Yukarıdan' },
            { d: 'yan', ad: 'Yandan' },
          ]}
        />
        <Secenekler
          etiket="Yaş"
          deger={yas}
          onDegis={setYas}
          secenekler={[
            { d: 'dogum', ad: 'Doğumda' },
            { d: 'alti', ad: 'İlk aylar' },
            { d: 'iki', ad: '2 yaş' },
          ]}
        />
      </div>
      {bakis === 'ust' ? <UstBakis o={o} /> : <YanBakis o={o} />}
      <div className="flex flex-col gap-1.5" aria-live="polite">
        <p className="font-bold">{b.baslik}</p>
        <p className="text-[0.98rem]">{b.metin}</p>
      </div>
    </div>
  );
}
