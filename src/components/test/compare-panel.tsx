'use client';

import { useId, useRef, useState } from 'react';
import { compareResults, gapText, readRecords, type CompareInfo, type CompareOutcome, type CompareRow, type CompareUnit } from '@/lib/compare/record';

/** En büyük dosya (bayt): raporlar birkaç yüz kilobayttır. */
const MAX_BYTES = 20 * 1024 * 1024;

type Digits = 0 | 1 | 2;
/** Eksi işareti her yerde aynı: "−". */
const minus = (t: string) => t.replace(/^-/, '−');
const fmt = (x: number, d: Digits) => minus(new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(x));
const fmtTrim = (x: number, d: Digits) => minus(new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: d }).format(x));
/** Tam saniye, raporun kısa yazımıyla: "18 sn", "1 dk 15 sn". */
const clockText = (s: number) => {
  if (s < 60) return `${s} sn`;
  const m = Math.floor(s / 60);
  return s % 60 ? `${m} dk ${s % 60} sn` : `${m} dk`;
};

type Shown = Pick<CompareRow, 'decimals' | 'unit' | 'format' | 'outOf' | 'max'>;

/** Birimiyle sayı: "%88", "1,5 sn", "8,2 derece", "18". */
export const withUnit = (text: string, unit: CompareUnit | undefined) =>
  unit === '%' ? `%${text}` : unit === 'sn' ? `${text} sn` : unit === 'derece' ? `${text} derece` : text;

/** Bir sonucun raporla aynı yazımı: "18/24", "%88", "1,65 sn", "1 sn’den kısa", "1 dk 15 sn", "4,2 sn", "8,2 derece". */
export function valueText(x: number, r: Shown): string {
  if (r.unit === 'sn' && x === 0 && (r.format === 'clock' || r.format === 'trim')) return '1 sn’den kısa';
  if (r.format === 'clock') return clockText(x);
  const n = r.format === 'trim' ? fmtTrim(x, r.decimals) : fmt(x, r.decimals);
  return r.outOf ? `${n}/${fmt(r.max, 0)}` : withUnit(n, r.unit);
}

/** Farkın yazımı: "+2", "−0,25 sn", "+4 puan" (yüzde farkı), "−1 dk 5 sn", "0". */
export function signed(diff: number, r: Shown): string {
  const d = r.decimals;
  const v = Math.round(diff * 10 ** d) / 10 ** d;
  const a = Math.abs(v);
  const body =
    r.unit === '%'
      ? `${fmt(a, d)} puan`
      : r.format === 'clock'
        ? clockText(a)
        : withUnit(r.format === 'trim' ? fmtTrim(a, d) : fmt(a, d), r.unit);
  return v > 0 ? `+${body}` : v < 0 ? `−${body}` : body;
}

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

/** Çizimin genişliği ve kenar boşluğu. */
const TRACK_W = 200;
const TRACK_PAD = 6;

/**
 * Çizimdeki yer: değer, ölçeğin aralığında (sınır dışı değerler kenara çekilir). Üst sınırı yalnızca bozuk değeri ayıklayan
 * sayılarda (süreler, dakikadaki harf) aralık sıfırdan iki değerin büyüğünün biraz ötesine kadardır; ikisi de sıfırsa çizgi
 * ortadadır.
 */
export function trackX(row: Pick<CompareRow, 'min' | 'max' | 'before' | 'after' | 'open'>, v: number, W = TRACK_W): number {
  const lo = row.open ? 0 : row.min;
  const top = Math.max(row.before, row.after);
  if (row.open && top <= 0) return W / 2;
  const hi = row.open ? top * 1.25 : row.max;
  const clamped = Math.min(hi, Math.max(lo, v));
  return TRACK_PAD + ((clamped - lo) / (hi - lo || 1)) * (W - 2 * TRACK_PAD);
}

/** Önceki (içi boş daire) ve şimdiki (dolu daire) sonuç. */
function Track({ row }: { row: CompareRow }) {
  const W = TRACK_W;
  const a = trackX(row, row.before);
  const b = trackX(row, row.after);
  const strong = row.verdict === 'up' || row.verdict === 'down';
  return (
    <svg viewBox={`0 0 ${W} 22`} preserveAspectRatio="xMinYMid meet" className="h-[22px] w-full max-w-[16.5rem]" aria-hidden="true">
      <rect x={TRACK_PAD} y={9.5} width={W - 2 * TRACK_PAD} height={3} rx={1.5} fill="var(--rule)" />
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
    ? 'Bu tür testleri yeniden çözünce, testi tanımaktan dolayı doğru sayısı çoğu zaman biraz artar, süreler de biraz kısalabilir (Scharfen ve ark., 2018). Bu yüzden küçük farkları gerçek bir değişim sayma.'
    : 'Bu tür testler yeniden çözülünce, testi tanımaktan dolayı doğru sayısı çoğu zaman biraz artar, süreler de biraz kısalabilir (Scharfen ve ark., 2018). Bu yüzden küçük farkları gerçek bir değişim saymayın.';
  const items = retest === 'items' ? ' Bu testte her seferinde aynı sorular gelir; önceki çözüşten akılda kalanlar da sonucu yükseltebilir.' : '';
  return `${base}${items}`;
}

/** Seçilen dosyada hiç özet yoksa. Görev testinde, hiçbir sonucu yorumlanmayan raporun PDF'inde de özet yoktur. */
export function noneText(compare: CompareInfo): string {
  const date = dateLabel(compare.since ?? '2026-10-30');
  return compare.retest
    ? `Bu dosyada karşılaştırma bilgisi bulunamadı: dosya ${date} öncesinde indirilmiş ya da o raporda karşılaştırılabilecek bir sonuç yoktu.`
    : `Bu dosyada karşılaştırma bilgisi bulunamadı. Bu testte karşılaştırma, ${date} ve sonrasında indirilen PDF raporlarıyla yapılabilir.`;
}

/** Dosyada bu testin özeti yoksa: tek testin raporu başka bir testinse ya da paket raporunda bu test yoksa. */
export function otherTestText(compare: CompareInfo, many: boolean, you: boolean): string {
  if (many) return `Bu dosyada bu testin karşılaştırma bilgisi yok (dosya başka testlerin raporu ya da ${dateLabel(compare.since ?? '2026-10-30')} öncesinde indirilmiş).`;
  return you ? 'Bu dosya başka bir testin raporu. Aynı testin önceki raporunu seç.' : 'Bu dosya başka bir testin raporu. Aynı testin önceki raporunu seçin.';
}

/** Bölümün sonundaki not: PDF'lerin özet taşıdığı. */
export function footerText(compare: CompareInfo, you: boolean): string {
  const what = compare.retest ? (you ? 'sonuçlarının' : 'sonuçların') : you ? 'puanlarının' : 'puanların';
  return you
    ? `İndirdiğin PDF raporları, karşılaştırma için ${what} sayısal bir özetini de taşır; bu özet yalnızca senin dosyandadır.`
    : `İndirdiğiniz PDF raporları, karşılaştırma için ${what} sayısal bir özetini de taşır; bu özet yalnızca sizin dosyanızdadır.`;
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
          <p className="notice notice-warn">{noneText(compare)}</p>
        )}
        {outcome?.status === 'error' && (
          <p className="notice notice-danger">{v('Dosya okunamadı. Başka bir dosya seçmeyi dene.', 'Dosya okunamadı. Başka bir dosya seçmeyi deneyin.')}</p>
        )}
        {outcome?.status === 'other-test' && (
          <p className="notice notice-warn">{otherTestText(compare, !!outcome.many, you)}</p>
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
                        {valueText(r.before, r)} → {valueText(r.after, r)} ({signed(r.after - r.before, r)})
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
      <p className="t-small text-ink-3">{footerText(compare, you)}</p>
    </section>
  );
}
