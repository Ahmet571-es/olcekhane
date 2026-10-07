import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { AGE_GROUPS, AREA_INTROS, fitsGroup, liveGroups, testsForGroup } from '@/content/age-groups';
import { INSTRUMENTS, getInstrumentDef, publicInstruments } from '@/content/instruments';
import { cardInfo } from '@/components/site/test-card';
import { ADULT_GRADE, DOMAIN_LABELS } from '@/lib/config';
import { DOMAIN_ORDER } from '@/lib/domain-style';

const APP = path.join(__dirname, '..', 'src', 'app');

function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return pages(full);
    return name === 'page.tsx' ? [full] : [];
  });
}

describe('yaş grupları', () => {
  it('3. sınıftan yetişkine her sınıf düzeyi tam olarak bir gruptadır', () => {
    for (const grade of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, ADULT_GRADE]) {
      const inGroups = AGE_GROUPS.filter((g) => g.grades.includes(grade)).map((g) => g.key);
      expect(inGroups, `sınıf ${grade}`).toHaveLength(1);
    }
    // 1. ve 2. sınıf bilerek yok: yönergeleri tek başına okuyamayacakları için.
    expect(AGE_GROUPS.some((g) => g.grades.includes(1) || g.grades.includes(2))).toBe(false);
    expect(new Set(AGE_GROUPS.map((g) => g.path)).size).toBe(AGE_GROUPS.length);
  });

  it('yayındaki her test en az bir grupta listelenir', () => {
    for (const t of publicInstruments()) {
      expect(AGE_GROUPS.some((g) => fitsGroup(t, g)), t.slug).toBe(true);
    }
  });

  it('grup sayfaları yalnızca o gruptaki bir sınıfa uygun testleri gösterir', () => {
    const ilkokul = AGE_GROUPS.find((g) => g.key === 'ilkokul')!;
    const slugs = testsForGroup(publicInstruments(), ilkokul).map((t) => t.slug);
    for (const s of slugs) {
      const t = getInstrumentDef(s)!;
      expect(t.minGrade, s).toBeLessThanOrEqual(4);
    }
    // Yalnızca yetişkinlere de uygun testler yetişkin grubunda görünür.
    const yetiskin = AGE_GROUPS.find((g) => g.key === 'yetiskin')!;
    expect(INSTRUMENTS.filter((t) => fitsGroup(t, yetiskin)).every((t) => t.adults)).toBe(true);
  });

  it('"Nereden başlamalı?" önerileri var olan ve gruba uyan testlerdir; yayındaki her grupta en az bir öneri görünür', () => {
    for (const g of AGE_GROUPS) {
      for (const s of g.starters) {
        const def = getInstrumentDef(s.slug);
        expect(def, `${g.key}: ${s.slug}`).toBeDefined();
        expect(fitsGroup(def!, g), `${g.key}: ${s.slug}`).toBe(true);
        expect(s.why.length).toBeGreaterThan(20);
      }
    }
    const live = publicInstruments();
    for (const { group } of liveGroups()) {
      expect(group.starters.some((s) => live.some((t) => t.slug === s.slug)), group.key).toBe(true);
    }
  });

  it('her grubun sayfası vardır; testi olmayan grup listelerde ve site haritasında yer almaz', () => {
    for (const g of AGE_GROUPS) {
      const file = path.join(APP, '(site)', g.path.slice(1), 'page.tsx');
      expect(readFileSync(file, 'utf8'), g.key).toContain(`groupKey="${g.key}"`);
    }
    const live = liveGroups().map((x) => x.group.key);
    for (const g of AGE_GROUPS) {
      expect(live.includes(g.key), g.key).toBe(testsForGroup(publicInstruments(), g).length > 0);
    }
    const sitemap = readFileSync(path.join(APP, 'sitemap.ts'), 'utf8');
    expect(sitemap).toContain('liveGroups()');
  });

  it('her alanın adı ve kısa tanıtımı vardır; zihinsel beceriler bölümü zekâ puanı vermediğini söyler', () => {
    for (const d of DOMAIN_ORDER) {
      expect(DOMAIN_LABELS[d], d).toBeTruthy();
      expect(AREA_INTROS[d], d).toBeTruthy();
    }
    expect(AREA_INTROS.cognitive).toContain('Zekâ puanı (IQ) verilmez');
  });

  it('tarayıcıya giden kart bilgisi maddeleri ya da puanlamayı taşımaz', () => {
    for (const t of INSTRUMENTS) {
      expect(Object.keys(cardInfo(t)).sort()).toEqual(
        ['adults', 'domain', 'maxGrade', 'minGrade', 'minutes', 'name', 'perGrade', 'slug', 'status', 'tagline'].sort(),
      );
    }
  });
});

describe('her sayfada yol gösterme', () => {
  it('tanıtım sayfalarının ve bulunamayan sayfanın hepsinde yol gösterici kutu vardır', () => {
    const files = [...pages(path.join(APP, '(site)')), path.join(APP, 'not-found.tsx')];
    const missing = files.filter((f) => !/PageGuide|GroupPage/.test(readFileSync(f, 'utf8'))).map((f) => path.relative(APP, f));
    expect(missing).toEqual([]);
  });

  it('test başlatma ve rapor ekranlarında da yol gösterici kutu vardır', () => {
    expect(readFileSync(path.join(APP, '(test)', 'testler', '[slug]', 'coz', 'page.tsx'), 'utf8')).toContain('<PageGuide');
    expect(readFileSync(path.join(APP, '..', 'components', 'test', 'test-session.tsx'), 'utf8')).toContain('<PageGuide');
  });
});
