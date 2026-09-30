import { ADULT_GRADE, gradeAllowed } from '@/lib/config';

/**
 * Test listesinin süzgeçleri: alan, kimler için (sınıf ya da yetişkin) ve süre. Süzgeç yalnızca sayfada çalışır;
 * seçimler hiçbir yere kaydedilmez ve sunucuya gönderilmez.
 */

/** Listedeki bir testin süzgeçte kullanılan bilgileri. */
export interface CatalogEntry {
  slug: string;
  domain: string;
  minutes: number;
  minGrade: number;
  maxGrade: number;
  adults: boolean;
}

export interface CatalogFilter {
  domain: string | null;
  /** Sınıf düzeyi (1–12, 13: mezun) ya da yetişkin (ADULT_GRADE). */
  grade: number | null;
  /** En çok bu kadar dakika süren testler. */
  maxMinutes: number | null;
}

export const NO_FILTER: CatalogFilter = { domain: null, grade: null, maxMinutes: null };

export function matchesFilter(e: CatalogEntry, f: CatalogFilter): boolean {
  if (f.domain !== null && e.domain !== f.domain) return false;
  if (f.grade !== null && !gradeAllowed(e, f.grade)) return false;
  if (f.maxMinutes !== null && e.minutes > f.maxMinutes) return false;
  return true;
}

export const isFiltered = (f: CatalogFilter) => f.domain !== null || f.grade !== null || f.maxMinutes !== null;

/** Seçilebilecek sınıf düzeyleri: en az bir testin uygun olduğu sınıflar, mezun ve (varsa) yetişkin. */
export function gradeOptions(entries: CatalogEntry[]): number[] {
  const grades = Array.from({ length: 13 }, (_, i) => i + 1);
  return [...grades, ADULT_GRADE].filter((g) => entries.some((e) => gradeAllowed(e, g)));
}

const MINUTE_STEPS = [5, 10, 15, 20, 30, 45, 60];

/**
 * Süre seçenekleri ("10 dakikaya kadar" gibi): yalnızca listeyi gerçekten daraltan ve bir öncekinden daha çok test
 * gösteren eşikler. Hiç test göstermeyen ya da bütün testleri gösteren seçenek sunulmaz.
 */
export function minuteOptions(entries: CatalogEntry[]): number[] {
  const out: number[] = [];
  let last = 0;
  for (const m of MINUTE_STEPS) {
    const n = entries.filter((e) => e.minutes <= m).length;
    if (n > last && n < entries.length) {
      out.push(m);
      last = n;
    }
  }
  return out;
}
