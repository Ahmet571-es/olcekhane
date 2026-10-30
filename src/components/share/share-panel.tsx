'use client';

import { useEffect, useState } from 'react';
import { SHARE_H, SHARE_W, shareCardText, shareText, type ShareCard } from '@/lib/share/card';
import { SHARE_FONT_LOADS, drawShareCard } from '@/lib/share/draw';

/**
 * "Sonucunu paylaş" bölümü: raporun özeti, Instagram hikâyesine ve WhatsApp durumuna uygun bir görsel olarak bu
 * cihazda çizilir. Görsel sunucuya ya da başka bir yere gönderilmez, hiçbir yere kaydedilmez; kişi isterse telefonun
 * paylaşım ekranıyla kendi uygulamasında paylaşır ya da görseli indirir. Görselde ad yazmaz.
 */

async function renderCard(card: ShareCard, host: string): Promise<Blob> {
  const text = shareCardText(card, host);
  // Yazı tipleri yüklenmeden çizilirse tuval yedek yazı tipini kullanır; Türkçe harflerin kümeleri de metne göre iner.
  if ('fonts' in document) await Promise.all(SHARE_FONT_LOADS.map((f) => document.fonts.load(f, text).catch(() => [])));
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_W;
  canvas.height = SHARE_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  drawShareCard(ctx, card, host);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'));
}

export function SharePanel({ card, siteUrl, student }: { card: ShareCard; siteUrl: string; student: boolean }) {
  const host = new URL(siteUrl).host;
  const key = JSON.stringify(card);
  const [image, setImage] = useState<{ key: string; blob: Blob; url: string } | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let url: string | null = null;
    const c = JSON.parse(key) as ShareCard;
    renderCard(c, host)
      .then((blob) => {
        if (!alive) return;
        url = URL.createObjectURL(blob);
        setImage({ key, blob, url });
        const file = new File([blob], c.fileName, { type: 'image/png' });
        setCanShare(typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] }));
      })
      .catch(() => {
        if (alive) setError('Paylaşım görseli hazırlanamadı. Sayfayı Safari ya da Chrome gibi bir tarayıcıda açıp tekrar deneyebilirsin.');
      });
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [key, host]);

  const ready = image?.key === key ? image : null;

  async function share() {
    if (!ready) return;
    setError(null);
    const file = new File([ready.blob], card.fileName, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: card.title, text: shareText(card, siteUrl) });
    } catch (err) {
      // Kişi paylaşım ekranını kapattıysa bir şey söylenmez.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setError('Paylaşılamadı. Görseli indirip Instagram ya da WhatsApp’tan paylaşabilirsin.');
      }
    }
  }

  function download() {
    if (!ready) return;
    const a = document.createElement('a');
    a.href = ready.url;
    a.download = card.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section aria-labelledby="paylas" className="panel flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
      <div className="w-[9.5rem] shrink-0 self-center sm:self-start" style={{ aspectRatio: `${SHARE_W} / ${SHARE_H}` }}>
        {ready ? (
          // Görsel bu sayfada üretildi (blob: adresi); next/image burada kullanılamaz.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ready.url}
            width={SHARE_W}
            height={SHARE_H}
            alt={`Paylaşım görselinin önizlemesi: ${card.kicker}, ${card.title}`}
            className="h-full w-full rounded-xl border border-rule object-cover shadow-sm"
          />
        ) : (
          <div className="h-full w-full animate-pulse rounded-xl border border-rule bg-surface-2" aria-hidden="true" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <h2 id="paylas" className="t-h3">
          Sonucunu paylaş
        </h2>
        <p className="text-ink-2">
          Sonucunun özeti Instagram hikâyesine ve WhatsApp durumuna uygun bir görsel olarak hazırlandı. Görselde adın yazmaz; testin adresi yazar,
          görenler de ücretsiz çözebilir.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {canShare && (
            <button type="button" className="btn btn-primary" onClick={share} disabled={!ready}>
              Paylaş
            </button>
          )}
          <button type="button" className={canShare ? 'btn btn-secondary' : 'btn btn-primary'} onClick={download} disabled={!ready}>
            {ready ? 'Görseli indir' : 'Görsel hazırlanıyor…'}
          </button>
        </div>
        {!canShare && ready && <p className="t-small text-ink-2">İndirdikten sonra görseli Instagram ya da WhatsApp’tan paylaşabilirsin.</p>}
        {error && <p className="notice notice-danger">{error}</p>}
        <p className="t-small text-ink-3">
          Görsel bu cihazda hazırlandı; hiçbir yere gönderilmedi ve saklanmadı. Paylaşıp paylaşmamak senin kararın.
          {student ? ' Sosyal medyada paylaşmadan önce velinle konuşabilirsin.' : ''}
        </p>
      </div>
    </section>
  );
}
