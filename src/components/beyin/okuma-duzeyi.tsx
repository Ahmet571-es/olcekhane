'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * Okuma düzeyi: "Tam ders" bütün katmanları gösterir; "Temel" ileri katmanı (Derinleş, Klinik bağlantı, Sınav notu
 * kutuları, ileri sahneler ve ileri sorular) gizler. Seçim yalnızca sayfa açıkken geçerlidir, hiçbir yere kaydedilmez.
 */
export type OkumaDuzeyi = 'tam' | 'temel';

const Baglam = createContext<{ duzey: OkumaDuzeyi; setDuzey: (d: OkumaDuzeyi) => void }>({ duzey: 'tam', setDuzey: () => {} });

export function useOkumaDuzeyi() {
  return useContext(Baglam);
}

export function OkumaDuzeyiSaglayici({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [duzey, setDuzey] = useState<OkumaDuzeyi>('tam');
  return (
    <Baglam.Provider value={{ duzey, setDuzey }}>
      <div data-duzey={duzey} className={className}>
        {children}
      </div>
    </Baglam.Provider>
  );
}

export function OkumaDuzeyiSecici() {
  const { duzey, setDuzey } = useOkumaDuzeyi();
  return (
    <div className="beyin-kutu flex flex-col gap-3" role="group" aria-label="Okuma düzeyi">
      <p className="font-bold">Okuma düzeyi</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="beyin-secenek" aria-pressed={duzey === 'tam'} onClick={() => setDuzey('tam')}>
          Tam ders: tıp ve nörobilim düzeyi
        </button>
        <button type="button" className="beyin-secenek" aria-pressed={duzey === 'temel'} onClick={() => setDuzey('temel')}>
          Yalnızca temel anlatım
        </button>
      </div>
      <p className="t-small text-ink-2">
        {duzey === 'tam'
          ? 'Bütün katmanlar açık: “Derinleş”, “Klinik bağlantı” ve “Sınav notu” kutuları ile ileri sorular da görünür.'
          : 'İleri katman gizlendi. Konuyu ilk kez öğreniyorsan buradan başla; sonra tam derse dön.'}
      </p>
    </div>
  );
}
