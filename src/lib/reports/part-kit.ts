import type { PartCard, PartStatus, ReportPart } from './parts';

/**
 * Okuma, sesli okuma ve konu tarama raporlarının ek bölümlerinde (lib/reports/reading-parts.ts, quiz-parts.ts) ortak küçük
 * yardımcılar: kartın durum rozeti, sayıların sözle yazılışı ("yok", "bir"), Türkçe sayı biçimleri.
 */

export const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
export const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });

export const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
export const lower = (s: string) => s.toLocaleLowerCase('tr-TR');

/** Denetimin rozeti: uygun, dikkat ya da denetim yapılamadı. */
export const statusBadge = (s: PartStatus) => (s === 'ok' ? 'Uygun' : s === 'warn' ? 'Dikkat' : 'Denetlenemedi');

/** Denetim kartı: rozeti durumundan. */
export function checkCard(key: string, title: string, status: PartStatus, x: Omit<PartCard, 'key' | 'title' | 'status' | 'badge'>): PartCard {
  return { key, title, status, badge: statusBadge(status), ...x };
}

/** Sayı ve adı: sıfır "hiç", bir "bir" ("bir hata", "3 hata"). */
export const countText = (n: number, noun: string) => (n === 0 ? `hiç ${noun}` : `${n === 1 ? 'bir' : n} ${noun}`);
/** Sesli okunan sayı: sıfır "yok" ("Boş: yok"). */
export const spokenCount = (n: number, noun = '') => (n === 0 ? 'yok' : `${n === 1 ? 'bir' : n}${noun ? ` ${noun}` : ''}`);

export const NUMBER_WORDS = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];

/** "a, b ve c" */
export const joinTr = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ve ${xs[xs.length - 1]}` : (xs[0] ?? ''));

/** Saniye: "38 sn", "1 dk 5 sn". */
export function secondsText(ms: number): string {
  const s = Math.max(1, Math.round(ms / 1000));
  if (s < 60) return `${s} sn`;
  const m = Math.floor(s / 60);
  return s % 60 ? `${m} dk ${s % 60} sn` : `${m} dk`;
}

/** Denetimlerin özeti (bölümün girişinin sonu). */
export function checksSummary(cards: PartCard[], allOk: string): string {
  const warns = cards.filter((c) => c.status === 'warn').length;
  const skipped = cards.filter((c) => c.status === 'none').length;
  if (warns === 0) {
    if (!skipped) return allOk;
    return skipped === 1 ? 'Denetimlerden biri yapılamadı; yapılanların hepsi uygun çıktı.' : 'Bazı denetimler yapılamadı; yapılanların hepsi uygun çıktı.';
  }
  return warns === 1 ? 'Bir denetimde “Dikkat” yazıyor; ayrıntısı aşağıda.' : `${cap(NUMBER_WORDS[warns] ?? String(warns))} denetimde “Dikkat” yazıyor; ayrıntıları aşağıda.`;
}

/** Bölümde "Dikkat" yazan bir denetim var mı? */
export const hasWarn = (p: ReportPart) => p.groups.some((g) => g.cards.some((c) => c.status === 'warn'));

/** "Dikkat" yazan denetimin genel cümlesi (bölümün girişinde). */
export const WARN_MEANING = '“Dikkat” yazan bir denetim sonucun yanlış olduğunu göstermez; dikkatle okunması gerektiğini gösterir.';
