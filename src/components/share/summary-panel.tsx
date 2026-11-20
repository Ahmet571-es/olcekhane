'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SimpleReport } from '@/lib/reports/simple';
import { SHARE_FONT_LOADS } from '@/lib/share/draw';
import { SUMMARY_W, reportSummary, summaryText, type ReportSummary } from '@/lib/share/summary';
import { drawSummary, summaryHeight } from '@/lib/share/summary-draw';
import { emblemDataUrl, standaloneEmblem } from '@/lib/share/summary-emblem';

/**
 * "Raporun özet görseli" (site sahibinin 2026-11-20 isteği): raporu tek sayfada özetleyen görsel bu cihazda çizilir ve PNG ya
 * da JPEG olarak indirilir. Bütün testlerde ve bütün rapor türlerinde vardır. Görsel sunucuya ya da başka bir yere
 * gönderilmez, hiçbir yere kaydedilmez. Ad isteğe bağlıdır: kişi yazarsa yalnızca bu sayfada durur ve görsele basılır;
 * sayfa kapanınca kaybolur (tarayıcı deposuna yazılmaz).
 *
 * `emblem`: testin galerideki çizimi (sunucuda hazırlanıp buraya verilir, gizli durur); tuvale çizilmek üzere SVG'si alınır.
 */

const NAME_MAX = 40;

type Rendered = { key: string; canvas: HTMLCanvasElement; url: string; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image'));
    img.src = src;
  });
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), type, quality);
    } catch (err) {
      reject(err);
    }
  });

async function render(summary: ReportSummary, host: string, name: string, emblem: HTMLImageElement | null): Promise<{ canvas: HTMLCanvasElement; blob: Blob; height: number }> {
  const all = summaryText(summary, host, name);
  // Yazı tipleri yüklenmeden çizilirse tuval yedek yazı tipini kullanır; Türkçe harflerin kümeleri de metne göre iner.
  if ('fonts' in document) await Promise.all(SHARE_FONT_LOADS.map((f) => document.fonts.load(f, all).catch(() => [])));
  const draw = async (image: HTMLImageElement | null) => {
    const canvas = document.createElement('canvas');
    canvas.width = SUMMARY_W;
    canvas.height = 10;
    const probe = canvas.getContext('2d');
    if (!probe) throw new Error('canvas');
    const height = summaryHeight(probe, summary, { host, name, emblem: image });
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    drawSummary(ctx, summary, { host, name, emblem: image, height });
    return { canvas, blob: await toBlob(canvas, 'image/png'), height };
  };
  try {
    return await draw(emblem);
  } catch (err) {
    // Bazı tarayıcılar SVG çizilen tuvali dışa vermez: çizim olmadan yeniden denenir.
    if (!emblem) throw err;
    return draw(null);
  }
}

export function SummaryPanel({
  slug,
  report,
  siteUrl,
  emblem,
  accent,
}: {
  slug: string;
  report: SimpleReport;
  siteUrl: string;
  emblem?: ReactNode;
  /** Testin alanının rengi (açık tema, onaltılık): amblemin tonları bundan türetilir. */
  accent?: string;
}) {
  const host = new URL(siteUrl).host;
  const you = report.audience !== 'parent';
  const summary = useMemo(() => reportSummary(slug, report), [slug, report]);
  const [typed, setTyped] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState<Rendered | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<'png' | 'jpg' | null>(null);
  const emblemBox = useRef<HTMLDivElement>(null);
  const emblemImage = useRef<Promise<HTMLImageElement | null> | null>(null);
  const key = `${slug}|${report.audience}|${report.completedAt}|${name}`;

  // Ad yazılırken her harfte yeniden çizilmesin.
  useEffect(() => {
    const t = window.setTimeout(() => setName(typed.trim().slice(0, NAME_MAX)), 350);
    return () => window.clearTimeout(t);
  }, [typed]);

  useEffect(() => {
    let alive = true;
    let url: string | null = null;
    emblemImage.current ??= (async () => {
      const svg = emblemBox.current?.querySelector('svg');
      const markup = svg && accent ? standaloneEmblem(new XMLSerializer().serializeToString(svg), accent) : null;
      return markup ? loadImage(emblemDataUrl(markup)).catch(() => null) : null;
    })();
    emblemImage.current
      .then((img) => render(summary, host, name, img))
      .then(({ canvas, blob, height }) => {
        if (!alive) return;
        url = URL.createObjectURL(blob);
        setImage({ key, canvas, url, height });
        setFailed(false);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [summary, host, name, key, accent]);

  const ready = image?.key === key ? image : null;

  async function download(kind: 'png' | 'jpg') {
    if (!ready) return;
    setBusy(kind);
    try {
      const blob = await toBlob(ready.canvas, kind === 'png' ? 'image/png' : 'image/jpeg', 0.92);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${summary.fileBase}.${kind}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  }

  const id = `ozet-${slug}`;
  return (
    <section aria-labelledby={id} className="panel flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
      <div ref={emblemBox} hidden aria-hidden="true">
        {emblem}
      </div>
      <div className="relative max-h-[22rem] w-[11.5rem] shrink-0 self-center overflow-hidden rounded-xl border border-rule shadow-sm sm:self-start">
        {ready ? (
          <>
            {/* Görsel bu sayfada üretildi (blob: adresi); next/image burada kullanılamaz. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ready.url} width={SUMMARY_W} height={ready.height} alt={`Özet görselin önizlemesi: ${summary.title}, ${summary.audienceLabel}`} className="block h-auto w-full" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface to-transparent" aria-hidden="true" />
          </>
        ) : (
          <div className="h-[22rem] w-full animate-pulse bg-surface-2" aria-hidden="true" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <h2 id={id} className="t-h3">
          Raporun özet görseli
        </h2>
        <p className="text-ink-2">
          {you
            ? 'Raporunun tek sayfalık özeti hazır: öne çıkan sonuçlar, grafikler ve haftalık adımlar. Görsel olarak indirip saklayabilirsin.'
            : 'Raporun tek sayfalık özeti hazır: öne çıkan sonuçlar, grafikler ve haftalık adımlar. Görsel olarak indirip saklayabilirsiniz.'}
        </p>
        <label className="flex max-w-sm flex-col gap-1.5">
          <span className="font-bold">{you ? 'Görsele adını yaz (isteğe bağlı)' : 'Görsele öğrencinin adını yazın (isteğe bağlı)'}</span>
          <input
            type="text"
            className="input"
            value={typed}
            maxLength={NAME_MAX}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setTyped(e.target.value)}
          />
          <span className="t-small text-ink-3">
            {you
              ? 'Yazdığın ad yalnızca bu cihazda görsele eklenir; siteye gönderilmez ve saklanmaz. Boş bırakırsan görselde ad olmaz.'
              : 'Yazdığınız ad yalnızca bu cihazda görsele eklenir; siteye gönderilmez ve saklanmaz. Boş bırakırsanız görselde ad olmaz.'}
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => download('png')} disabled={!ready || busy !== null}>
            {!ready && !failed ? 'Görsel hazırlanıyor…' : 'PNG olarak indir'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => download('jpg')} disabled={!ready || busy !== null}>
            JPEG olarak indir
          </button>
        </div>
        {failed && (
          <p className="notice notice-danger">
            {you
              ? 'Özet görsel hazırlanamadı. Sayfayı Safari ya da Chrome gibi bir tarayıcıda açıp tekrar deneyebilirsin; rapor PDF olarak her zaman indirilebilir.'
              : 'Özet görsel hazırlanamadı. Sayfayı Safari ya da Chrome gibi bir tarayıcıda açıp tekrar deneyebilirsiniz; rapor PDF olarak her zaman indirilebilir.'}
          </p>
        )}
        <p className="t-small text-ink-3">
          Görsel bu cihazda hazırlandı; hiçbir yere gönderilmedi ve saklanmadı. Raporun kısa özetidir; açıklamaların tamamı raporda ve PDF’tedir.
          {report.audience === 'student' ? ' Adının yazdığı bir görseli sosyal medyada paylaşmadan önce velinle konuşabilirsin.' : ''}
        </p>
      </div>
    </section>
  );
}
