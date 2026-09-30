import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { NO_FILTER, gradeOptions, isFiltered, matchesFilter, minuteOptions, type CatalogEntry } from '@/lib/catalog';
import { ADULT_GRADE } from '@/lib/config';

const e = (slug: string, domain: string, minutes: number, minGrade: number, maxGrade: number, adults = false): CatalogEntry => ({
  slug,
  domain,
  minutes,
  minGrade,
  maxGrade,
  adults,
});

const LIST = [
  e('kisa-kisilik', 'personality', 3, 6, 13),
  e('ilgi', 'career', 10, 9, 13, true),
  e('matematik', 'academic', 30, 5, 8),
  e('okuma', 'academic', 7, 3, 13),
];

describe('test listesi süzgeçleri', () => {
  it('süzgeç yoksa her test görünür', () => {
    expect(isFiltered(NO_FILTER)).toBe(false);
    expect(LIST.every((x) => matchesFilter(x, NO_FILTER))).toBe(true);
  });

  it('alan, kimler için ve süre birlikte uygulanır', () => {
    const slugs = (f: Partial<typeof NO_FILTER>) => LIST.filter((x) => matchesFilter(x, { ...NO_FILTER, ...f })).map((x) => x.slug);
    expect(slugs({ domain: 'academic' })).toEqual(['matematik', 'okuma']);
    expect(slugs({ grade: 4 })).toEqual(['okuma']);
    expect(slugs({ grade: 7 })).toEqual(['kisa-kisilik', 'matematik', 'okuma']);
    expect(slugs({ grade: ADULT_GRADE })).toEqual(['ilgi']);
    expect(slugs({ maxMinutes: 10 })).toEqual(['kisa-kisilik', 'ilgi', 'okuma']);
    expect(slugs({ domain: 'academic', grade: 10, maxMinutes: 10 })).toEqual(['okuma']);
    expect(slugs({ domain: 'career', grade: 7 })).toEqual([]);
  });

  it('seçenekler yalnızca en az bir testin uyduğu sınıflar ve listeyi daraltan süreler', () => {
    expect(gradeOptions(LIST)).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, ADULT_GRADE]);
    expect(gradeOptions(LIST.filter((x) => !x.adults))).not.toContain(ADULT_GRADE);
    // 3, 7, 10 ve 30 dakikalık testler: 5 dk (1 test), 10 dk (3 test); 15 ve 20 dk yeni test eklemez; 30 dk hepsi.
    expect(minuteOptions(LIST)).toEqual([5, 10]);
    expect(minuteOptions([e('a', 'personality', 5, 6, 13)])).toEqual([]);
  });

  it('sitedeki testlerle: her seçenek en az bir test gösterir', () => {
    const live: CatalogEntry[] = publicInstruments().map((t) => e(t.slug, t.domain, t.estimatedMinutes, t.minGrade, t.maxGrade, !!t.adults));
    for (const g of gradeOptions(live)) expect(live.some((x) => matchesFilter(x, { ...NO_FILTER, grade: g })), String(g)).toBe(true);
    for (const m of minuteOptions(live)) {
      const n = live.filter((x) => matchesFilter(x, { ...NO_FILTER, maxMinutes: m })).length;
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(live.length);
    }
  });
});
