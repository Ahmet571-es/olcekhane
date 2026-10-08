'use client';

import { useState } from 'react';
import { SEVIYE_ADLARI, type Soru } from '@/content/beyin/types';
import { gorunurMu, useOkumaDuzeyi } from './okuma-duzeyi';

/**
 * Dersin sonundaki sorular, okuma düzeyine göre süzülür (Temel: temel; Lisans: temel ve lisans; Uzman: hepsi). Cevaplar yalnızca bu
 * sayfanın belleğinde durur; hiçbir yere gönderilmez ya da kaydedilmez. Her sorunun açıklaması cevaplanınca açılır.
 */
export function KendiniDene({ sorular }: { sorular: Soru[] }) {
  const { duzey } = useOkumaDuzeyi();
  const [cevaplar, setCevaplar] = useState<(number | null)[]>(() => sorular.map(() => null));
  const gorunen = sorular.map((s, i) => ({ s, i })).filter(({ s }) => gorunurMu(duzey, s.seviye));
  const cevaplanan = gorunen.filter(({ i }) => cevaplar[i] !== null).length;
  const dogru = gorunen.filter(({ s, i }) => cevaplar[i] === s.dogru).length;
  const bitti = cevaplanan === gorunen.length;

  return (
    <div className="flex flex-col gap-5">
      <p className="t-small text-ink-2">
        {gorunen.length} soru{gorunen.length < sorular.length ? ` (üst katmanlardaki ${sorular.length - gorunen.length} soru gizli; okuma düzeyini değiştirerek açabilirsin)` : ''}.
        Her sorunun yanında katmanı yazar.
      </p>
      <ol className="flex flex-col gap-5">
        {gorunen.map(({ s, i }, sira) => {
          const c = cevaplar[i];
          return (
            <li key={s.soru} className="beyin-kutu flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-bold">
                  <span className="text-ink-3">{sira + 1}. </span>
                  {s.soru}
                </p>
                <span className="beyin-seviye">{SEVIYE_ADLARI[s.seviye]}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={`${sira + 1}. sorunun seçenekleri`}>
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
          {bitti ? `Sonuç: ${gorunen.length} sorudan ${dogru} doğru.` : `${cevaplanan} / ${gorunen.length} soru cevaplandı.`}
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
