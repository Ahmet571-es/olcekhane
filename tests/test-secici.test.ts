import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { packageGrades } from '@/content/paket';
import { SECICI_GOALS, SECICI_MAX_TESTS, SECICI_PATH, SECICI_TIMES, type GoalKey } from '@/content/test-secici';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import { recommend, solvePath, suggestPackage, type SeciciTest } from '@/lib/test-secici';
import sitemap from '../src/app/sitemap';
import { schoolWords } from './helpers/school';

const catalog: SeciciTest[] = publicInstruments().map((d) => ({
  slug: d.slug,
  name: d.name,
  minutes: d.estimatedMinutes,
  minGrade: d.minGrade,
  maxGrade: d.maxGrade,
  adults: 'adults' in d && !!d.adults,
}));
const bySlug = new Map(catalog.map((t) => [t.slug, t]));
const GRADES = [...Array.from({ length: 13 }, (_, i) => i + 1), ADULT_GRADE];
const KEYS = SECICI_GOALS.map((g) => g.key);
const pick = (grade: number, goals: GoalKey[], budget: number) => recommend(catalog, goals, grade, budget).picks.map((p) => p.test.slug);

describe('Hangi test bana uygun?: amaçlar ve yuvalar', () => {
  it('her aday yayındaki bir testtir; yayındaki her test en az bir yuvanın adayıdır', () => {
    const all = SECICI_GOALS.flatMap((g) => g.slots.flatMap((s) => s.candidates));
    for (const slug of all) expect(bySlug.has(slug), slug).toBe(true);
    for (const t of catalog) expect(all.includes(t.slug), `${t.slug} hiçbir yuvada yok`).toBe(true);
  });

  it('metinler: cümleler noktayla biter, "tanı" yok; yetişkinlere açık testlerin yuvalarında okula özgü sözcük yok', () => {
    for (const g of SECICI_GOALS) {
      expect(g.name.length, g.key).toBeGreaterThan(2);
      expect(g.hint, g.key).toMatch(/\.$/);
      expect(schoolWords(`${g.name} ${g.hint}`), g.key).toEqual([]);
      for (const s of g.slots) {
        expect(s.why, s.skill).toMatch(/[.?]$/);
        expect(`${s.skill} ${s.why}`, s.skill).not.toMatch(/(?<!\p{L})tanı(?!\p{L})|IQ/u);
        if (s.candidates.some((c) => bySlug.get(c)?.adults)) expect(schoolWords(`${s.skill} ${s.why}`), `${g.key} ${s.skill}`).toEqual([]);
      }
    }
    expect(SECICI_TIMES.map((t) => t.minutes)).toEqual([15, 30, 60]);
  });
});

describe('Hangi test bana uygun?: öneriler', () => {
  it('örnekler', () => {
    expect(pick(6, ['kisilik'], 15)).toEqual(['bes-faktor-kisilik']);
    expect(pick(4, ['kisilik'], 30)).toEqual(['cocuk-kisilik-profili']);
    expect(pick(ADULT_GRADE, ['kisilik'], 15)).toEqual(['ayrintili-kisilik-profili']);
    expect(pick(10, ['zihinsel'], 60)).toEqual(['sekil-akil-yurutme', 'kelime-bilgisi', 'kagit-katlama', 'desen-hatirlama', 'sayi-dizileri']);
    // Birden çok amaç dönüşümlü doldurulur: önce her amacın ilk yuvası.
    expect(pick(10, ['kisilik', 'ilgi'], 30).slice(0, 2)).toEqual(['bes-faktor-kisilik', 'meslek-ilgi-alanlari']);
    // 1. sınıfta yalnızca sesli okuma var; 20 dakika 15 dakikaya sığmasa da önerilir.
    const r1 = recommend(catalog, ['okuma'], 1, 15);
    expect(r1.picks.map((p) => p.test.slug)).toEqual(['sesli-okuma-degerlendirmesi']);
    expect(r1.overBudget).toBe(true);
    expect(recommend(catalog, ['kisilik'], 1, 30)).toMatchObject({ picks: [], missing: ['kisilik'] });
    expect(solvePath('oz-saygi', 7)).toBe('/testler/oz-saygi/coz?sinif=7');
    expect(solvePath('empati', ADULT_GRADE)).toBe('/testler/empati/coz?sinif=yetiskin');
  });

  it('bütün sınıflarda, bütün amaç birleşimlerinde ve sürelerde: öneriler sınıfa uygun, tekrarsız, süreye sığar; eksik alanlar doğru', () => {
    let n = 0;
    for (const grade of GRADES) {
      for (let mask = 1; mask < 1 << KEYS.length; mask++) {
        const goals = KEYS.filter((_, i) => mask & (1 << i));
        for (const { minutes: budget } of SECICI_TIMES) {
          const label = `${grade} ${goals.join('+')} ${budget}`;
          const r = recommend(catalog, goals, grade, budget);
          const slugs = r.picks.map((p) => p.test.slug);
          expect(new Set(slugs).size, label).toBe(slugs.length);
          expect(slugs.length, label).toBeLessThanOrEqual(SECICI_MAX_TESTS);
          for (const p of r.picks) {
            expect(gradeAllowed(p.test, grade), `${label} ${p.test.slug}`).toBe(true);
            expect(goals.includes(p.goal), label).toBe(true);
            if (grade === ADULT_GRADE) expect(schoolWords(`${p.skill} ${p.why}`), `${label} ${p.test.slug}`).toEqual([]);
          }
          expect(r.minutes, label).toBe(r.picks.reduce((a, p) => a + p.test.minutes, 0));
          if (r.overBudget) {
            // Süreyi aşan tek test, yalnızca seçilen alanlarda süreye sığan hiçbir uygun test yoksa önerilir.
            expect(slugs.length, label).toBe(1);
            const fits = SECICI_GOALS.filter((g) => goals.includes(g.key)).some((g) =>
              g.slots.some((s) => s.candidates.some((c) => gradeAllowed(bySlug.get(c)!, grade) && bySlug.get(c)!.minutes <= budget)),
            );
            expect(fits, label).toBe(false);
          } else {
            expect(r.minutes, label).toBeLessThanOrEqual(budget);
          }
          // Eksik alan: o alanda bu sınıfa uygun hiçbir test yok; seçilen alanlardan birinde uygun test varsa öneri boş kalmaz.
          for (const g of SECICI_GOALS.filter((x) => goals.includes(x.key))) {
            const any = g.slots.some((s) => s.candidates.some((c) => gradeAllowed(bySlug.get(c)!, grade)));
            expect(r.missing.includes(g.key), `${label} ${g.key}`).toBe(!any);
          }
          expect(slugs.length > 0, label).toBe(r.missing.length < goals.length);
          // "Başka testler de var" yalnızca seçilen alanlarda önerilmeyen uygun bir test varsa.
          const unpicked = SECICI_GOALS.filter((g) => goals.includes(g.key)).some((g) =>
            g.slots.some((s) => s.candidates.some((c) => gradeAllowed(bySlug.get(c)!, grade) && !slugs.includes(c))),
          );
          expect(r.more, label).toBe(unpicked);
          if (r.moreWithTime) expect(r.more, label).toBe(true);
          n++;
        }
      }
    }
    expect(n).toBe(GRADES.length * ((1 << KEYS.length) - 1) * SECICI_TIMES.length);
  });

  it('paket yalnızca bir saatlik vakitte ve paketin alanları seçilince önerilir; sayfa paketi yalnızca açık olduğu sınıflarda gösterir', () => {
    expect(suggestPackage(['genel'], 60)).toBe(true);
    expect(suggestPackage(['genel'], 30)).toBe(false);
    expect(suggestPackage(['kisilik', 'zihinsel'], 60)).toBe(true);
    expect(suggestPackage(['kisilik', 'okuma'], 60)).toBe(false);
    expect(packageGrades().length).toBeGreaterThan(0);
    const page = readFileSync(new URL('../src/components/site/test-secici.tsx', import.meta.url), 'utf8');
    expect(page).toContain('pkgMinutes !== undefined && suggestPackage(goals, budget)');
  });

  it('sayfa: site haritasında, yol gösterici kutusu var; Testler sayfasından ve ana sayfadan bağlantı; seçimler saklanmaz', () => {
    expect(sitemap().some((e) => e.url.endsWith(SECICI_PATH))).toBe(true);
    const page = readFileSync(new URL('../src/app/(site)/hangi-test/page.tsx', import.meta.url), 'utf8');
    expect(page).toContain('<PageGuide');
    for (const f of ['../src/app/(site)/testler/page.tsx', '../src/app/(site)/page.tsx']) expect(readFileSync(new URL(f, import.meta.url), 'utf8')).toContain('SECICI_PATH');
    const ui = readFileSync(new URL('../src/components/site/test-secici.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|useSearchParams|router\.(push|replace)/);
    // Bileşen testlerin maddelerini tarayıcıya taşımaz: yalnızca hafif katalogla çalışır.
    expect(ui).not.toContain("from '@/content/instruments'");
  });
});
