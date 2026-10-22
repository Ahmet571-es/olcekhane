import { describe, expect, it } from 'vitest';
import { REPORT_TEMPLATES } from '@/content/reports';
import { INTEREST_ROADMAPS, ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import type { AudienceText } from '@/content/roadmaps/types';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { INSTRUMENTS } from '@/content/instruments';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { pick } from '@/lib/reports/roadmap';
import { def } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUGS = Object.keys(INTEREST_ROADMAPS);
const HOBI = 'hobi-ve-serbest-zaman-ilgileri';
const HOLLAND = 'mesleki-ilgi-profili';
const DEGER = 'calisma-degerleri';

/** Her maddeye, maddenin alanına göre en yüksek, orta ya da en düşük cevap. */
function bodyFor(slug: string, grade: number, level: (scale: string) => 'hi' | 'mid' | 'lo'): AnswersBody {
  const d = def<LikertInstrument>(slug);
  const vals = d.options.map((o) => o.value);
  const v = { hi: Math.max(...vals), mid: vals[Math.floor(vals.length / 2)], lo: Math.min(...vals) };
  return {
    grade,
    data: {
      engine: 'likert',
      answers: Object.fromEntries(
        d.items.map((it) => {
          const x = v[level(it.scale)];
          return [it.key, { value: it.reverse ? v.hi + v.lo - x : x, rtMs: 2600 }];
        }),
      ),
    },
  };
}

const scaleKeys = (slug: string) => def<LikertInstrument>(slug).scales.map((s) => s.key);
const gradeFor = (slug: string) => Math.max(def<LikertInstrument>(slug).minGrade, 9);

describe('ilgi testlerinin yol haritası: şablonlar', () => {
  it('üç ilgi testinin ve değer testinin yol haritası var ve yayında', () => {
    expect(SLUGS.sort()).toEqual([HOBI, 'meslek-ilgi-alanlari', HOLLAND, DEGER].sort());
    for (const slug of SLUGS) expect(hasPublicRoadmap(slug), slug).toBe(true);
  });

  it('her alanın keşif, deneme ve yaklaşım metni var; veliye ayrı metin, haftalık denemede çocuğunuz anılır', () => {
    for (const slug of SLUGS) {
      const t = INTEREST_ROADMAPS[slug];
      expect(Object.keys(t.areas).sort(), slug).toEqual(scaleKeys(slug).sort());
      const colors = Object.values(t.areas).map((a) => a.color);
      for (const c of colors) expect(c, slug).toMatch(/^#[0-9a-f]{6}$/);
      expect(new Set(colors).size, `${slug} renkler`).toBe(colors.length);
      for (const [key, a] of Object.entries(t.areas)) {
        for (const x of [a.explore, a.action]) {
          expect(x.student.length, `${slug} ${key}`).toBeGreaterThan(40);
          expect(x.parent, `${slug} ${key}`).not.toBe(x.student);
          expect(x.student, `${slug} ${key}`).not.toMatch(/çocuğunuz/i);
        }
        // Haftalık deneme kendi başına okunur; keşif kartı "Çocuğunuz nasıl keşfedebilir?" başlığının altındadır.
        expect(a.action.parent, `${slug} ${key}`).toMatch(/çocuğunuz/i);
        expect(a.approach.length, `${slug} ${key}`).toBeGreaterThan(20);
      }
      // Eğitim yolları ya bütün alanlarda ya hiçbirinde vardır ve uyarısıyla birlikte gösterilir.
      const withPaths = Object.values(t.areas).filter((a) => a.paths).length;
      expect([0, Object.keys(t.areas).length], slug).toContain(withPaths);
      expect(!!t.pathsNote, slug).toBe(withPaths > 0);
      for (const n of t.nextTests) expect(INSTRUMENTS.some((d) => d.slug === n), `${slug} → ${n}`).toBe(true);
      expect(t.sources.length, slug).toBeGreaterThan(0);
    }
  });

  it('yetişkinlere açık testte yetişkine giden metinlerde okula özgü sözcük yok', () => {
    for (const slug of SLUGS.filter((s) => def<LikertInstrument>(s).adults)) {
      const t = INTEREST_ROADMAPS[slug];
      const all: AudienceText[] = [
        t.studyIntro,
        t.openNote,
        t.firstWeek,
        t.lastWeek,
        ...t.openWeeks.map((w) => w.text),
        ...Object.values(t.areas).flatMap((a) => [a.explore, a.action]),
      ];
      for (const x of all) {
        const text = pick(x, 'adult');
        expect(schoolWords(text), `${slug}: ${text.slice(0, 60)}`).toEqual([]);
        expect(text, slug).not.toMatch(/çocuğunuz/i);
      }
    }
  });

  it('bir şablondaki metinler birbirini tekrar etmez', () => {
    for (const slug of SLUGS) {
      const areas = Object.values(INTEREST_ROADMAPS[slug].areas);
      const unique = (xs: string[], what: string) => expect(new Set(xs).size, `${slug} ${what}`).toBe(xs.length);
      for (const a of ['student', 'parent', 'adult'] as const) {
        unique(areas.map((x) => pick(x.explore, a)), `${a} keşif`);
        unique(areas.map((x) => pick(x.action, a)), `${a} deneme`);
      }
      unique(areas.map((x) => x.approach), 'yaklaşım');
    }
  });
});

describe('ilgi testlerinin yol haritası: rapora eklenmesi', () => {
  it('belirgin üç alan: keşif kartları, haftalar, yaklaşım ve (Holland profilinde) eğitim yolları bu alanlardan', async () => {
    for (const slug of SLUGS) {
      const t = INTEREST_ROADMAPS[slug];
      const high = scaleKeys(slug).slice(0, 3);
      const r = evaluate(slug, bodyFor(slug, gradeFor(slug), (s) => (high.includes(s) ? 'hi' : 'lo')));
      for (const audience of ['student', 'parent'] as const) {
        const rm = r[audience].roadmap!;
        expect(rm.preview, slug).toBe(false);
        expect(rm.bars, slug).toHaveLength(scaleKeys(slug).length);
        expect(rm.study.items.map((i) => i.key).sort(), slug).toEqual([...high].sort());
        expect(rm.standout.map((s) => s.title), slug).toEqual(rm.study.items.map((i) => i.title));
        for (const it of rm.study.items) expect(it.text, slug).toBe(pick(t.areas[it.key].explore, audience));
        expect(rm.weeks.map((w) => w.title), slug).toEqual(['Fark et', rm.study.items[0].title, rm.study.items[1].title, 'Gözden geçir']);
        expect(rm.weeks[1].text, slug).toBe(pick(t.areas[rm.study.items[0].key].action, audience));
        // Rapor şablonunda kısa ad yoksa düzey adı gösterilir; boş ya da yinelenen rozet olmaz.
        for (const it of rm.study.items) expect(it.badge, slug).not.toMatch(/(^|· )$|^(.+) · \2$/);
        expect(rm.settings === null, slug).toBe(!t.pathsNote);
        if (rm.settings) expect(rm.settings.items, slug).toHaveLength(3);
        expect(rm.intro.includes('meslek seçimi'), slug).toBe(!t.leisure);
      }
      const parent = r.parent.roadmap!;
      expect(parent.approach!.items.map((i) => i.text), slug).toEqual(parent.study.items.map((i) => t.areas[i.key].approach));
      expect(parent.intro, slug).toContain('ona nasıl yaklaşabileceğiniz ve dört haftalık küçük adımlar');
      expect(r.student.roadmap!.approach, slug).toBeNull();
      const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 120_000);

  it('tek belirgin alan: 3. hafta genel deneme (sıralı profillerde)', () => {
    for (const slug of SLUGS.filter((s) => s !== HOLLAND)) {
      const t = INTEREST_ROADMAPS[slug];
      const first = scaleKeys(slug)[0];
      const rm = evaluate(slug, bodyFor(slug, gradeFor(slug), (s) => (s === first ? 'hi' : 'lo'))).student.roadmap!;
      expect(rm.study.items.map((i) => i.key), slug).toEqual([first]);
      expect(rm.weeks[2].title, slug).toBe(t.openWeeks[1].title);
      expect(rm.weeks[2].text, slug).toBe(t.openWeeks[1].text.student);
    }
  });

  it('öne çıkan alan yoksa (her maddeye aynı cevap): yalnızca kısa not ve genel denemeler', async () => {
    for (const slug of SLUGS) {
      const t = INTEREST_ROADMAPS[slug];
      const r = evaluate(slug, bodyFor(slug, gradeFor(slug), () => 'mid'));
      for (const audience of ['student', 'parent'] as const) {
        const rm = r[audience].roadmap!;
        expect(rm.standout, slug).toEqual([]);
        expect(rm.standoutNote, slug).toBe(pick(t.openNote, audience));
        expect(rm.study.items, slug).toEqual([]);
        expect(rm.settings, slug).toBeNull();
        expect(rm.approach, slug).toBeNull();
        expect(rm.weeks.map((w) => w.title), slug).toEqual(['Fark et', t.openWeeks[0].title, t.openWeeks[1].title, 'Gözden geçir']);
        expect(rm.intro, slug).toContain('öneriler içerir: dört haftalık küçük adımlar.');
      }
      const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 120_000);

  it('bütün alanlar düşükken hiçbir alan "belirgin ilgi" diye öne çıkmaz; eğitim yolu ve yaklaşım önerilmez', () => {
    for (const slug of SLUGS) {
      const d = def<LikertInstrument>(slug);
      const vals = d.options.map((o) => o.value);
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      const next = vals.filter((v) => v > lo).sort((a, b) => a - b)[0];
      const first = d.scales[0].key;
      let k = 0;
      // İlk alanda cevapların yarısı bir basamak yukarıda: alanlar eşit değil ama hepsi düşük düzeyde.
      const answers = Object.fromEntries(
        d.items.map((it) => {
          const x = it.scale === first && k++ % 2 === 0 ? next : lo;
          return [it.key, { value: it.reverse ? hi + lo - x : x, rtMs: 2600 }];
        }),
      );
      const r = evaluate(slug, { grade: gradeFor(slug), data: { engine: 'likert', answers } } as AnswersBody);
      for (const audience of ['student', 'parent'] as const) {
        const rm = r[audience].roadmap!;
        expect(rm.standout, slug).toEqual([]);
        expect(rm.study.items, slug).toEqual([]);
        expect(rm.settings, slug).toBeNull();
        expect(rm.approach, slug).toBeNull();
        expect(rm.standoutNote, slug).toMatch(/hiçbir (alan|değer) öne çıkarılmadı/);
        // Not kendi başına okunur: veliye özneyle ("Çocuğunuz …") yazılır, ardına ilgilerin ayrışmadığını söyleyen genel not
        // eklenmez.
        if (audience === 'parent') expect(rm.standoutNote, slug).toMatch(/^Çocuğunuz /);
        expect(rm.standoutNote, slug).not.toContain(pick(INTEREST_ROADMAPS[slug].openNote, audience));
      }
    }
  });

  it('veliye ilk hafta testin kendi konusunu gözlemlemeyi önerir (kişilik testinden kopyalanmış metin yok)', () => {
    const personality = ROADMAPS['bes-faktor-kisilik'].firstWeek.parent;
    for (const t of [...Object.values(INTEREST_ROADMAPS), ROADMAPS['calisma-aliskanliklari']]) {
      expect(t.firstWeek.parent).not.toBe(personality);
      expect(t.firstWeek.parent).not.toContain('hemen bir şeyi değiştirmeye');
      expect(t.firstWeek.parent).toMatch(/^Raporu çocuğunuzla birlikte okuyun/);
    }
    expect(INTEREST_ROADMAPS[HOBI].firstWeek.parent).toContain('boş zamanında hangi etkinliklerin ona iyi geldiğini');
    expect(INTEREST_ROADMAPS[HOLLAND].openWeeks[0].text.parent).toContain('ve sonra bunun ona nasıl hissettirdiğini konuşun.');
  });

  it('hobi: sık yapılan alan yoksa ara sıra yapılanlar öne çıkar; az yapılanlar öne çıkmaz', () => {
    const [a, b] = scaleKeys(HOBI);
    const rm = evaluate(HOBI, bodyFor(HOBI, 9, (s) => (s === a || s === b ? 'mid' : 'lo'))).student.roadmap!;
    expect(rm.study.items.map((i) => i.key)).toEqual([a, b]);
    expect(rm.study.items[0].badge).toBe('Ara sıra · Küçük çocuklarla ara sıra vakit geçiren');
    const none = evaluate(HOBI, bodyFor(HOBI, 9, () => 'lo')).student.roadmap!;
    expect(none.study.items).toEqual([]);
  });

  it('yetişkine kişisel yol haritası: okula özgü sözcük ve "çocuğunuz" yok; önerilen test yetişkinlere açık', () => {
    for (const slug of SLUGS.filter((s) => def<LikertInstrument>(s).adults)) {
      const high = scaleKeys(slug).slice(0, 3);
      for (const level of [(s: string) => (high.includes(s) ? 'hi' : 'lo'), () => 'mid'] as const) {
        const adult = evaluateAdult(slug, bodyFor(slug, ADULT_GRADE, level as (s: string) => 'hi' | 'mid' | 'lo')).adult;
        const rm = adult.roadmap!;
        expect(rm, slug).toBeDefined();
        expect(schoolWords(JSON.stringify(rm)), slug).toEqual([]);
        expect(JSON.stringify(rm), slug).not.toMatch(/çocuğunuz/i);
        expect(rm.approach, slug).toBeNull();
      }
    }
    const hobby = evaluateAdult(HOBI, bodyFor(HOBI, ADULT_GRADE, () => 'mid')).adult.roadmap!;
    expect(hobby.weeks[3].text).toContain('Meslek İlgi Alanları testini çözebilirsin.');
    expect(hobby.weeks[3].text).not.toContain('Mesleki İlgi Profili');
  });

  it('hobi: son haftada kişinin sınıfına uyan meslek ilgi testleri önerilir', () => {
    expect(evaluate(HOBI, bodyFor(HOBI, 7, () => 'mid')).student.roadmap!.weeks[3].text).not.toContain('çözebilirsin');
    expect(evaluate(HOBI, bodyFor(HOBI, 10, () => 'mid')).student.roadmap!.weeks[3].text).toContain(
      'meslek ilgilerini de görmek için Mesleki İlgi Profili ve Meslek İlgi Alanları testlerinden birini çözebilirsin.',
    );
  });

  it('sıralı ilgi profilleri (rastgele profiller): düşük düzeydeki alan öne çıkmaz, eşit puanlı alanlar sessizce düşürülmez', () => {
    let seed = 20261022;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2 ** 31;
      return seed / 2 ** 31;
    };
    const shown1 = (v: number) => Math.round(v * 10) / 10;
    let ties = 0;
    let dropped = 0;
    for (const slug of ['meslek-ilgi-alanlari', HOBI]) {
      const d = def<LikertInstrument>(slug);
      const labels = REPORT_TEMPLATES[slug].bandLabels;
      for (let n = 0; n < 400; n++) {
        // Her alana bir taban cevap; profillerin yarısında her madde aynı (çok sayıda birebir eşitlik), yarısında sapmalı.
        const base = Object.fromEntries(d.scales.map((s) => [s.key, 1 + Math.floor(rand() * 5)]));
        const noise = n % 2 === 0 ? 0 : 0.35;
        const answers = Object.fromEntries(
          d.items.map((it) => {
            const step = rand() < noise ? (rand() < 0.5 ? -1 : 1) : 0;
            return [it.key, { value: Math.min(5, Math.max(1, base[it.scale] + step)), rtMs: 2600 }];
          }),
        );
        const r = evaluate(slug, { grade: gradeFor(slug), data: { engine: 'likert', answers } } as AnswersBody);
        for (const rep of [r.student, r.parent]) {
          const tag = `${slug} ${n} ${rep.audience}`;
          const rows = rep.chart?.type === 'rulers' ? rep.chart.rows.filter((x) => x.value !== null) : [];
          const value = (name: string) => shown1(rows.find((x) => x.label === name)!.value!);
          const tops = rep.items.filter((i) => /^\d\. /.test(i.title));
          const anyHigh = rows.some((x) => x.band === labels.high);
          const level = anyHigh ? labels.high! : labels.average!;
          const pool = rows.filter((x) => x.band === level);
          expect(tops.length, tag).toBeLessThanOrEqual(anyHigh ? 4 : 3);
          for (const t of tops) {
            const name = t.title.slice(3);
            const [band, tie] = t.badge!.split(' · ');
            // Düşük düzeydeki alan hiçbir zaman öne çıkmaz; belirgin alan varsa yalnızca belirgin alanlar.
            expect(band, tag).toBe(level);
            const same = tops.filter((x) => value(x.title.slice(3)) === value(name)).length > 1;
            expect(tie, `${tag}: ${t.title}`).toBe(same ? 'eşit puan' : undefined);
            expect(Number(t.title[0]), `${tag}: ${t.title}`).toBe(1 + tops.filter((x) => value(x.title.slice(3)) > value(name)).length);
            if (same) ties++;
          }
          if (tops.length > (anyHigh ? 3 : 2)) {
            // Kesimin ötesine geçen alan, son gösterilenle birebir eşit puandadır.
            expect(value(tops.at(-1)!.title.slice(3)), tag).toBe(value(tops.at(-2)!.title.slice(3)));
          }
          // Gösterilen alanla birebir eşit puandaki, gösterilmeyen alan bir notta anılır.
          if (tops.length) {
            const last = value(tops.at(-1)!.title.slice(3));
            for (const x of pool.filter((p) => !tops.some((t) => t.title.endsWith(p.label)) && shown1(p.value!) === last)) {
              expect(rep.cautions.join(' '), `${tag}: ${x.label}`).toContain(x.label);
              dropped++;
            }
          }
          // Yol haritası raporla aynı alanları öne çıkarır.
          expect(rep.roadmap!.standout.map((x) => x.title), tag).toEqual(tops.map((t) => t.title.slice(3)));
          expect(JSON.stringify(rep), tag).not.toMatch(/undefined|NaN/);
        }
      }
    }
    // Eşitlik yolları yeterince denendi.
    expect(ties).toBeGreaterThan(100);
    expect(dropped).toBeGreaterThan(20);
  }, 120_000);

  it('test sayfasındaki tanıtım ilgi testinin bölümlerini sayar', () => {
    expect(roadmapSummary(HOLLAND)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, en belirgin ilgileri keşfetmek için öneriler, ilişkili eğitim yolları, veliye yaklaşım önerileri ve dört haftalık keşif adımları',
    );
    expect(roadmapSummary(HOBI)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, en sık zaman ayrılan alanları ileri taşımak için öneriler, veliye yaklaşım önerileri ve dört haftalık keşif adımları',
    );
  });
});
