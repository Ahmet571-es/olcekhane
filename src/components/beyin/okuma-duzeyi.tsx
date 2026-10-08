'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { SEVIYE_KITLESI, type Seviye } from '@/content/beyin/types';

/**
 * Okuma düzeyi üç katmanlıdır: "Temel" yalnızca temel anlatımı, "Lisans" temel ve lisans katmanını (tıp, nörobilim ve
 * psikoloji öğrencisi), "Uzman" bütün katmanları gösterir (asistan hekim, cerrah, araştırmacı). Sorular da aynı
 * düzeye göre süzülür. Seçim yalnızca sayfa açıkken geçerlidir, hiçbir yere kaydedilmez.
 */
export type OkumaDuzeyi = Seviye;

const SIRA: Record<Seviye, number> = { temel: 0, lisans: 1, ileri: 2 };

/** Bu okuma düzeyinde bu katman görünür mü? */
export function gorunurMu(okuma: OkumaDuzeyi, katman: Seviye): boolean {
  return SIRA[katman] <= SIRA[okuma];
}

const Baglam = createContext<{ duzey: OkumaDuzeyi; setDuzey: (d: OkumaDuzeyi) => void }>({ duzey: 'ileri', setDuzey: () => {} });

export function useOkumaDuzeyi() {
  return useContext(Baglam);
}

export function OkumaDuzeyiSaglayici({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [duzey, setDuzey] = useState<OkumaDuzeyi>('ileri');
  return (
    <Baglam.Provider value={{ duzey, setDuzey }}>
      <div data-duzey={duzey} className={className}>
        {children}
      </div>
    </Baglam.Provider>
  );
}

const SECENEKLER: { d: OkumaDuzeyi; ad: string }[] = [
  { d: 'temel', ad: 'Temel' },
  { d: 'lisans', ad: 'Lisans' },
  { d: 'ileri', ad: 'Uzman: tamamı' },
];

export function OkumaDuzeyiSecici({ sureler }: { sureler?: Record<Seviye, number> }) {
  const { duzey, setDuzey } = useOkumaDuzeyi();
  return (
    <div className="beyin-kutu flex flex-col gap-3" role="group" aria-label="Okuma düzeyi">
      <p className="font-bold">Okuma düzeyi: bu ders üç katmanlıdır</p>
      <div className="flex flex-wrap gap-2">
        {SECENEKLER.map(({ d, ad }) => (
          <button key={d} type="button" className="beyin-secenek" aria-pressed={duzey === d} onClick={() => setDuzey(d)}>
            {ad}
            {sureler && <span className="text-ink-3"> · {sureler[d]} dk</span>}
          </button>
        ))}
      </div>
      <ul className="t-small flex flex-col gap-1 text-ink-2">
        <li>
          <b>Temel:</b> {SEVIYE_KITLESI.temel}.
        </li>
        <li>
          <b>Lisans:</b> {SEVIYE_KITLESI.lisans}; temel anlatıma ek olarak “Derinleş”, “Klinik bağlantı”, “Görüntülemede” ve
          “Sınav notu” kutuları, klinik vakalar.
        </li>
        <li>
          <b>Uzman:</b> {SEVIYE_KITLESI.ileri}; ayrıca “Beyin cerrahisinde” ve “Araştırma sınırı” kutuları.
        </li>
      </ul>
      <p className="t-meta">Seçimin hiçbir yere kaydedilmez. İstediğin an katman değiştirebilirsin.</p>
    </div>
  );
}
