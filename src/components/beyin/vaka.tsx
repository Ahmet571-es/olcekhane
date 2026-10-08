'use client';

import { useId, useState } from 'react';

/**
 * Klinik vaka kartı: öykü, okuyucuya soru ve "Çözümü göster" ile açılan akıl yürütme. Önce okuyucunun kendisinin
 * düşünmesi istenir. Hiçbir şey kaydedilmez; çözümün açık olup olmadığı yalnızca sayfa açıkken bellekte durur.
 */
export function Vaka({ ust, baslik, oykuHtml, soru, cozumHtml }: { ust: string; baslik: string; oykuHtml: string; soru: string; cozumHtml: string }) {
  const [acik, setAcik] = useState(false);
  const kimlik = useId();
  return (
    <article className="beyin-vaka measure flex flex-col gap-3" aria-labelledby={`${kimlik}-baslik`}>
      <p className="kicker">{ust}</p>
      <h3 id={`${kimlik}-baslik`} className="font-display text-xl font-bold leading-tight">
        {baslik}
      </h3>
      <div className="prose-olc text-[1rem]" dangerouslySetInnerHTML={{ __html: oykuHtml }} />
      <p className="beyin-vaka-soru font-bold">{soru}</p>
      {!acik && <p className="t-small text-ink-2">Önce kendin düşün: hasar nerede olabilir, neden?</p>}
      <div>
        <button
          type="button"
          className="beyin-secenek"
          aria-expanded={acik}
          aria-controls={`${kimlik}-cozum`}
          onClick={() => setAcik((a) => !a)}
        >
          {acik ? 'Çözümü gizle' : 'Çözümü göster'}
        </button>
      </div>
      <div id={`${kimlik}-cozum`} hidden={!acik} className="beyin-vaka-cozum prose-olc text-[1rem]" dangerouslySetInnerHTML={{ __html: cozumHtml }} />
      <p className="t-meta">Vaka eğitim için kurgulanmıştır; gerçek bir hastayı anlatmaz ve tanı ya da tedavi önerisi değildir.</p>
    </article>
  );
}
