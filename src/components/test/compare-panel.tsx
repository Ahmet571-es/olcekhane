'use client';

import { useId, useRef, useState } from 'react';
import { compareResults, gapText, readRecords, type CompareInfo, type CompareOutcome, type CompareRow, type CompareUnit } from '@/lib/compare/record';

/** En büyük dosya (bayt): raporlar birkaç yüz kilobayttır. */
const MAX_BYTES = 20 * 1024 * 1024;

type Digits = 0 | 1 | 2;
const fmt = (x: number, d: Digits) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(x);
/** Birimiyle sayı: "%88", "1,5 sn", "8,2°", "18". */
export const withUnit = (text: string, unit: CompareUnit | undefined) =>
  unit === '%' ? `%${text}` : unit === 'sn' ? `${text} sn` : unit === '°' ? `${text}°` : text;
const signed = (x: number, d: Digits, unit?: CompareUnit) => {
  const r = Math.round(x * 10 ** d) / 10 ** d;
  const v = withUnit(fmt(Math.abs(r), d), unit === '%' ? undefined : unit);
  // Yüzdelerin farkı yüzde puanıdır: "+4 puan".
  const body = unit === '%' ? `${fmt(Math.abs(r), d)} puan` : v;
  return r > 0 ? `+${body}` : r < 0 ? `−${body}` : unit === '%' ? `${fmt(0, d)} puan` : withUnit(fmt(0, d), unit);
};

/** Ay adlarıyla tarih: "31 Ekim 2026". */
const dateLabel = (iso: string) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }).format(new Date(`${iso}T12:00:00Z`));

/** Satırın sözlü açıklaması: yön, ölçüm payı ve (değiştiyse) düzey. Sürelerde "uzadı/kısaldı" denir; yargı bildirmez. */
export function rowText(row: CompareRow): string {
  const band =
    row.bandBefore && row.bandAfter && row.bandBefore !== row.bandAfter
      ? row.verdict === 'stable'
        ? ` Düzey “${row.bandBefore}” iken “${row.bandAfter}” oldu; ama fark ölçüm payı içinde, puan iki düzeyin sınırına yakın.`
        : ` Düzey: “${row.bandBefore}” → “${row.bandAfter}”.`
      : '';
  const t = !!row.time;
  switch (row.verdict) {
    case 'up':
      return `${t ? 'Belirgin uzama' : 'Belirgin artış'}: fark ölçüm payını aşıyor.${band}`;
    case 'down':
      return `${t ? 'Belirgin kısalma' : 'Belirgin azalış'}: fark ölçüm payını aşıyor.${band}`;
    case 'stable':
      return `Belirgin bir değişim yok: fark ölçüm payı içinde.${band}`;
    case 'up-unknown':
      return `${t ? 'Süre uzadı' : 'Arttı'}; ölçüm payı bilinmediği için farkın belirgin olup olmadığı söylenemez.${band}`;
    case 'down-unknown':
      return `${t ? 'Süre kısaldı' : 'Azaldı'}; ölçüm payı bilinmediği için farkın belirgin olup olmadığı söylenemez.${band}`;
    case 'same':
      return `${t ? 'Süre aynı' : 'Aynı'}.${band}`;
  }
}

/**
 * Önceki (içi boş daire) ve şimdiki (dolu daire) puan, ölçeğin aralığında. Sürelerin üst sınırı yoktur: çizgi sıfırdan iki
 * sürenin büyüğünün biraz ötesine kadardır.
 */
function Track({ row }: { row: CompareRow }) {
  const W = 200;
  const lo = row.time ? 0 : row.min;
  const hi = row.time ? Math.max(row.before, row.after) * 1.25 || 1 : row.max;
  const clamp = (v: number) => Math.min(hi, Math.max(lo, v));
  const x = (v: number) => 6 + ((clamp(v) - lo) / (hi - lo || 1)) * (W - 12);
  const a = x(row.before);
  const b = x(row.after);
  const strong = row.verdict === 'up' || row.verdict === 'down';
  return (
    <svg viewBox={`0 0 ${W} 22`} preserveAspectRatio="xMinYMid meet" className="h-[22px] w-full max-w-[16.5rem]" aria-hidden="true">
      <rect x={6} y={9.5} width={W - 12} height={3} rx={1.5} fill="var(--rule)" />
      {Math.abs(b - a) > 1 && <line x1={a} y1={11} x2={b} y2={11} stroke="var(--brass)" strokeWidth={strong ? 3 : 2} strokeDasharray={strong ? undefined : '3 2.5'} />}
      <circle cx={a} cy={11} r={5} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.6} />
      <circle cx={b} cy={11} r={5} fill="var(--ink)" />
    </svg>
  );
}

/**
 * Görev testlerinde alıştırma etkisi: testi yeniden çözmek sonucu biraz yükseltir (Scharfen ve ark., 2018); her seferinde
 * aynı sorular gelen testlerde hatırlananlar da etkiler.
 */
export function retestNote(retest: 'items' | 'practice', you: boolean): string {
  const base = you
    ? 'Bu tür testleri yeniden çözünce, testi tanımaktan dolayı sonuç çoğu zaman biraz yükselir (Scharfen ve ark., 2018). Bu yüzden küçük farkları gerçek bir değişim sayma.'
    : 'Bu tür testler yeniden çözülünce, testi tanımaktan dolayı sonuç çoğu zaman biraz yükselir (Scharfen ve ark., 2018). Bu yüzden küçük farkları gerçek bir değişim saymayın.';
  const items = retest === 'items' ? ' Bu testte her seferinde aynı sorular gelir; önceki çözüşten akılda kalanlar da sonucu yükseltebilir.' : '';
  return `${base}${items}`;
}

/**
 * Gelişimini karşılaştır: kişi aynı testin önceki raporunun PDF'ini seçer; dosya yalnızca tarayıcıda okunur, PDF'in belge
 * bilgilerindeki sayısal özet şimdiki sonuçla ölçek ölçek karşılaştırılır. Hiçbir şey sunucuya gönderilmez, saklanmaz.
 */
export function ComparePanel({ compare, you }: { compare: CompareInfo; you: boolean }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [outcome, setOutcome] = useState<CompareOutcome | { status: 'none' | 'error' } | null>(null);
  const [busy, setBusy] = useState(false);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > MAX_BYTES) {
        setOutcome({ status: 'none' });
        return;
      }
      const records = readRecords(new Uint8Array(await file.arrayBuffer()));
      setOutcome(records ? compareResults(compare, records) : { status: 'none' });
    } catch {
      setOutcome({ status: 'error' });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  const v = (student: string, parent: string) => (you ? student : parent);
  const ok = outcome?.status === 'ok' ? outcome : null;
  const strong = ok ? ok.rows.filter((r) => r.verdict === 'up' || r.verdict === 'down') : [];
  // Ölçüm payı yalnızca bazı ölçeklerde biliniyorsa özet bunu da söyler.
  const partly = compare.scales.some((s) => s.sem) && compare.scales.some((s) => !s.sem);

  return (
    <section aria-labelledby={`${id}-baslik`} className="panel flex flex-col gap-4 p-6">
      <h2 id={`${id}-baslik`} className="t-h3">
        {v('Önceki sonucunla karşılaştır', 'Önceki sonuçla karşılaştırın')}
      </h2>
      <p className="text-ink-2">
        {v(
          `Bu testi daha önce çözüp raporunun PDF’ini indirdiysen o dosyayı seç: ${compare.retest ? 'iki sonucun ana sayıları' : 'iki sonucun ölçek ölçek'} karşılaştırılsın. Dosya bu cihazdan çıkmaz, hiçbir yere gönderilmez.`,
          `Çocuğunuz bu testi daha önce çözdüyse ve raporun PDF’ini indirdiyseniz o dosyayı seçin: ${compare.retest ? 'iki sonucun ana sayıları' : 'iki sonuç ölçek ölçek'} karşılaştırılsın. Dosya bu cihazdan çıkmaz, hiçbir yere gönderilmez.`,
        )}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className={`btn btn-secondary ${busy ? 'pointer-events-none opacity-60' : ''}`}>
          {busy ? 'Okunuyor…' : 'Önceki raporu (PDF) seç'}
          <input
            ref={input}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => void pick(e.target.files?.[0])}
            disabled={busy}
          />
        </label>
      </div>

      <div aria-live="polite" className="flex flex-col gap-4">
        {outcome?.status === 'none' && (
          <p className="notice notice-warn">
            Bu dosyada karşılaştırma bilgisi bulunamadı. Bu testte karşılaştırma, {dateLabel(compare.since ?? '2026-10-30')} ve sonrasında
            indirilen PDF raporlarıyla yapılabilir.
          </p>
        )}
        {outcome?.status === 'error' && (
          <p className="notice notice-danger">{v('Dosya okunamadı. Başka bir dosya seçmeyi dene.', 'Dosya okunamadı. Başka bir dosya seçmeyi deneyin.')}</p>
        )}
        {outcome?.status === 'other-test' && (
          <p className="notice notice-warn">
            {v('Bu dosya başka bir testin raporu. Aynı testin önceki raporunu seç.', 'Bu dosya başka bir testin raporu. Aynı testin önceki raporunu seçin.')}
          </p>
        )}
        {outcome?.status === 'version' && (
          <p className="notice notice-warn">Testin soruları o tarihten bu yana değiştiği için iki sonuç karşılaştırılamaz.</p>
        )}
        {ok && (
          <>
            <p className="font-bold">
              {Math.abs(ok.days) < 1 ? 'İki sonuç aynı güne ait.' : `İki sonuç arasında ${gapText(ok.days)} var.`}{' '}
              {!ok.known
                ? compare.retest
                  ? 'Bu testin sonuçlarında ölçüm payı bilinmediği için yalnızca farkların yönü gösterilir.'
                  : 'Bu testte ölçeklerin ölçüm payı bilinmediği için yalnızca farkların yönü gösterilir; küçük farklar yorumlanmamalı.'
                : strong.length === 0
                  ? 'Hiçbir ölçekte ölçüm payını aşan bir değişim yok.'
                  : `Ölçüm payını aşan değişim: ${strong.map((r) => r.label).join(', ')}.`}
              {ok.known && partly ? ' Ölçüm payı bilinmeyen ölçeklerde yalnızca farkın yönü gösterilir.' : ''}
            </p>
            {compare.retest && <p className="text-ink-2">{retestNote(compare.retest, you)}</p>}
            {ok.rows.length === 0 && (
              <p className="text-ink-2">{compare.retest ? 'Karşılaştırılacak sonuç bulunamadı.' : 'Karşılaştırılacak ölçek bulunamadı.'}</p>
            )}
            {Math.abs(ok.days) < 14 && (
              <p className="t-small text-ink-2">
                İki sonuç arasındaki süre kısa. Kısa sürede görülen farklar çoğunlukla cevapların günden güne biraz değişmesinden
                kaynaklanır.
              </p>
            )}
            <ul className="flex flex-col divide-y divide-rule border-y border-rule">
              {ok.rows.map((r) => (
                <li key={r.key} className="grid gap-x-6 gap-y-1.5 py-3 md:grid-cols-[minmax(0,1fr)_16.5rem] md:items-center">
                  <div className="flex flex-col gap-0.5">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-bold">{r.label}</span>
                      <span className="t-small tabular text-ink-2">
                        {withUnit(fmt(r.before, r.decimals), r.unit)} → {withUnit(fmt(r.after, r.decimals), r.unit)} (
                        {signed(r.after - r.before, r.decimals, r.unit)})
                      </span>
                    </p>
                    <p className="t-small text-ink-2">{rowText(r)}</p>
                  </div>
                  <Track row={r} />
                </li>
              ))}
            </ul>
            <p className="t-small text-ink-3">
              İçi boş daire önceki, dolu daire şimdiki {compare.retest ? 'sonuç' : 'puan'}.{' '}
              {ok.known &&
                '“Belirgin” değişim: fark, ölçeğin bilinen güvenirliğine göre hesaplanan ölçüm payını aşıyor (güvenilir değişim ölçütü, %95; Jacobson ve Truax, 1991). '}
              Tek bir karşılaştırmadan kesin sonuç çıkarılmamalı; insanlar zamanla değişir ve gelişir.
            </p>
          </>
        )}
      </div>
      <p className="t-small text-ink-3">
        {v(
          'İndirdiğin PDF raporları, karşılaştırma için puanlarının sayısal bir özetini de taşır; bu özet yalnızca senin dosyandadır.',
          'İndirdiğiniz PDF raporları, karşılaştırma için puanların sayısal bir özetini de taşır; bu özet yalnızca sizin dosyanızdadır.',
        )}
      </p>
    </section>
  );
}
