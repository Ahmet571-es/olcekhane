'use client';

import { useState } from 'react';
import type { Soru } from '@/content/beyin/types';

/**
 * Dersin sonundaki sorular. Cevaplar yalnızca bu sayfanın belleğinde durur; hiçbir yere gönderilmez ya da
 * kaydedilmez. Her sorunun açıklaması cevaplanınca açılır.
 */
export function KendiniDene({ sorular }: { sorular: Soru[] }) {
  const [cevaplar, setCevaplar] = useState<(number | null)[]>(() => sorular.map(() => null));
  const cevaplanan = cevaplar.filter((c) => c !== null).length;
  const dogru = cevaplar.filter((c, i) => c === sorular[i].dogru).length;
  const bitti = cevaplanan === sorular.length;

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex flex-col gap-5">
        {sorular.map((s, i) => {
          const c = cevaplar[i];
          return (
            <li key={s.soru} className="beyin-kutu flex flex-col gap-3">
              <p className="font-bold">
                <span className="text-ink-3">{i + 1}. </span>
                {s.soru}
              </p>
              <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={`${i + 1}. sorunun seçenekleri`}>
                {s.secenekler.map((sec, j) => {
                  const secildi = c === j;
                  const durum = c === null ? '' : j === s.dogru ? 'dogru' : secildi ? 'yanlis' : '';
                  return (
                    <button
                      key={sec}
                      type="button"
                      disabled={c !== null}
                      aria-pressed={secildi}
                      onClick={() => setCevaplar((a) => a.map((x, k) => (k === i ? j : x)))}
                      className={`min-h-11 rounded-xl border px-3.5 py-2 text-left text-[0.95rem] transition-colors ${
                        durum === 'dogru'
                          ? 'border-ok bg-ok-bg font-bold'
                          : durum === 'yanlis'
                            ? 'border-danger bg-danger-bg'
                            : 'border-rule-strong bg-paper hover:border-ink disabled:opacity-70'
                      }`}
                    >
                      {durum === 'dogru' ? '✓ ' : durum === 'yanlis' ? '✗ ' : ''}
                      {sec}
                    </button>
                  );
                })}
              </div>
              {c !== null && (
                <p className="t-small text-ink-2" role="status">
                  <b className={c === s.dogru ? 'text-ok' : 'text-danger'}>{c === s.dogru ? 'Doğru. ' : 'Tam değil. '}</b>
                  {s.aciklama}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3" aria-live="polite">
        <p className="font-bold">
          {bitti ? `Sonuç: ${sorular.length} sorudan ${dogru} doğru.` : `${cevaplanan} / ${sorular.length} soru cevaplandı.`}
        </p>
        {cevaplanan > 0 && (
          <button type="button" className="btn btn-secondary rounded-full" onClick={() => setCevaplar(sorular.map(() => null))}>
            Yeniden dene
          </button>
        )}
      </div>
      <p className="t-meta">Cevapların hiçbir yere kaydedilmez; sayfayı kapatınca silinir.</p>
    </div>
  );
}
