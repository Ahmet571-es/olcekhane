import type { SimpleReport } from './simple';

/**
 * Kendini Tanı Paketi'nin özeti: her testin öne çıkan sonuçları, testin kendi raporundaki başlıklar ve düzeylerle
 * (ekranda ve PDF'te aynı). Site sahibinin seçimi: özet testleri birbirine bağlayan yeni bir yorum eklemez; buradaki her
 * satır testin kendi raporunda aynen yazar.
 */

export interface PackageEntry {
  slug: string;
  /** Yuvanın kısa adı ("Akıl yürütme"). */
  skill: string;
  /** Alanın adı ("Zekâ ve zihinsel beceriler"). */
  areaName: string;
  report: SimpleReport;
}

export interface PackageSummaryTest {
  slug: string;
  skill: string;
  areaName: string;
  name: string;
  pilot: boolean;
  /** Öne çıkan sayılar ve başlıkların düzeyleri: "Dışadönüklük" — "Orta · Dengeli". */
  lines: { label: string; value: string }[];
  /** Raporda okunması gereken uyarı sayısı. */
  cautions: number;
}

/** Özette bir testten en çok bu kadar satır (kalanı testin kendi raporunda). */
export const SUMMARY_MAX_LINES = 8;

function linesOf(report: SimpleReport): { label: string; value: string }[] {
  // Ayrıntılı profillerde boyutlar `groups`'tadır; ötekilerde düzeyi (rozeti) olan kartlar. Rozeti olmayan kartlar
  // (birlikte yorum, öneri) özete girmez.
  const fromCards = report.groups?.length
    ? report.groups.map((g) => ({ label: g.title, value: g.badge }))
    : report.items.flatMap((it) => (it.badge ? [{ label: it.title, value: it.badge }] : []));
  if (fromCards.length > 0) return fromCards.slice(0, SUMMARY_MAX_LINES);
  return report.keyFigures.slice(0, SUMMARY_MAX_LINES).map((k) => ({ label: k.label, value: k.value }));
}

export function packageSummary(entries: PackageEntry[]): PackageSummaryTest[] {
  return entries.map((e) => ({
    slug: e.slug,
    skill: e.skill,
    areaName: e.areaName,
    name: e.report.instrumentName,
    pilot: e.report.isPilot,
    lines: linesOf(e.report),
    cautions: e.report.cautions.length,
  }));
}

/** Özetin başındaki açıklama (ekranda ve PDF'te). `you`: öğrenciye ve yetişkine "sen", veliye "siz". */
export function summaryIntro(you: boolean, count: number): string {
  return you
    ? `Bu sayfada çözdüğün ${count} testin öne çıkan sonuçları yan yana duruyor. Her satır, o testin kendi raporunda da yazar; özet testleri birbirine bağlayan yeni bir yorum eklemez. Ayrıntılar ve öneriler her testin kendi raporunda.`
    : `Bu sayfada çocuğunuzun çözdüğü ${count} testin öne çıkan sonuçları yan yana duruyor. Her satır, o testin kendi raporunda da yazar; özet testleri birbirine bağlayan yeni bir yorum eklemez. Ayrıntılar ve öneriler her testin kendi raporunda.`;
}
