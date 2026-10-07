import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, ROADMAP_IN_REVIEW, hasPublicRoadmap } from '@/content/roadmaps';
import type { AudienceText } from '@/content/roadmaps/types';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { answersBody } from '@/lib/assessment/schemas';
import { bars3dScene, shade } from '@/lib/charts/bars3d';
import { ADULT_GRADE } from '@/lib/config';
import type { Band, LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Audience, ReportContent } from '@/lib/reports/build';
import { bandGroup, buildRoadmap, type Roadmap } from '@/lib/reports/roadmap';
import { def, likertBody } from './helpers/bodies';

const SLUG = 'bes-faktor-kisilik';
const ALL_BANDS: Band[] = ['very_low', 'low', 'average', 'high', 'very_high'];
const VALUE: Record<Band, number> = { very_low: 1.4, low: 2.2, average: 3, high: 3.8, very_high: 4.6 };
const AUDIENCES: Audience[] = ['student', 'parent', 'adult'];
/** Yetişkine yazılan metinlerde okula özgü sözcük olmaz. */
const SCHOOL = /\b(ders|öğretmen|okul|sınıf|ödev|kitap)/i;

/** Yol haritası olan bir testin boyutları (yol haritası alt özellikleri değil boyutları kullanır) ve düzeyleri. */
function setup(slug: string) {
  const t = ROADMAPS[slug];
  const tpl = REPORT_TEMPLATES[slug];
  const scales = def<LikertInstrument>(slug).scales.filter((s) => t.scales[s.key]);
  const bands = ALL_BANDS.filter((b) => tpl.bandLabels[b]);
  return { t, tpl, scales, bands };
}

/** Bir düzey birleşimi için yol haritası (rapor metinleri sitedeki şablondan). */
function roadmapFor(slug: string, bands: Band[], audience: Audience): Roadmap {
  const { t, tpl, scales } = setup(slug);
  const sections = scales.map((sc, i) => {
    const band = bands[i];
    const bt = tpl.scales[sc.key][band]!;
    const v = VALUE[band];
    return {
      scaleKey: sc.key,
      name: sc.name,
      plain: '',
      band,
      bandLabel: tpl.bandLabels[band]!,
      summary: bt.summary,
      text: '',
      tips: audience === 'parent' ? bt.tipsParent : audience === 'student' ? bt.tipsStudent : [],
      value: v,
      valueLabel: `${v.toFixed(1).replace('.', ',')} / 5`,
      min: 1,
      max: 5,
      ciLow: v - 0.4,
      ciHigh: v + 0.4,
      percentile: null,
    };
  });
  const content = { audience, sections } as unknown as ReportContent;
  return buildRoadmap(content, t, { preview: true, next: [{ name: 'Meslek İlgi Alanları', href: '/testler/meslek-ilgi-alanlari' }] });
}

function* combos(bands: Band[], n: number): Generator<Band[]> {
  for (let k = 0; k < bands.length ** n; k++) {
    yield Array.from({ length: n }, (_, i) => bands[Math.floor(k / bands.length ** i) % bands.length]);
  }
}

function texts(rm: Roadmap): string[] {
  return [
    rm.intro,
    rm.standoutNote ?? '',
    rm.study.intro,
    ...rm.study.items.map((i) => i.text),
    rm.settings.intro,
    rm.settings.note,
    ...rm.weeks.map((w) => w.text),
    ...(rm.approach?.items.map((i) => i.text) ?? []),
  ].filter(Boolean);
}

describe('gelişim yol haritası: şablonlar', () => {
  it('her testte her boyutun üç düzey grubunda bütün kişilere metni vardır; yetişkin metinleri okula özgü değildir', () => {
    const all = (t: AudienceText) => [t.student, t.parent, t.adult ?? t.student];
    for (const slug of Object.keys(ROADMAPS)) {
      const { t, scales } = setup(slug);
      // Şablondaki her boyut testte vardır; çalışma düzeni ve iyi oluş boyutları da.
      expect(scales.map((s) => s.key).sort(), slug).toEqual(Object.keys(t.scales).sort());
      expect(t.scales[t.planningScale], slug).toBeDefined();
      if (t.wellbeing) expect(t.scales[t.wellbeing.scale], slug).toBeDefined();
      for (const sc of scales) {
        const r = t.scales[sc.key];
        const label = `${slug} ${sc.key}`;
        expect(r.color).toMatch(/^#[0-9a-f]{6}$/);
        for (const g of ['low', 'average', 'high'] as const) {
          for (const x of [r.study[g], r.action[g]]) {
            for (const y of all(x)) {
              expect(y.length, `${label} ${g}`).toBeGreaterThan(30);
              expect(y.trim(), `${label} ${g}`).toMatch(/[.!?]$/);
            }
            expect(x.adult ?? x.student, `${label} ${g}`).not.toMatch(SCHOOL);
            expect(x.parent, `${label} ${g}`).toMatch(/[Çç]ocuğunuz/);
            expect(x.student, `${label} ${g}`).not.toMatch(/[Çç]ocuğunuz/);
          }
          const tip = t.approach?.[sc.key]?.[g];
          if (t.approach) expect(tip, `${label} ${g} veliye yaklaşım`).toBeTruthy();
          if (tip) expect(tip.trim(), `${label} ${g}`).toMatch(/[.!?]$/);
        }
        // Orta düzeyde belirgin bir ortam yoktur; uçlarda vardır.
        expect(r.settings.average).toBeUndefined();
        expect(r.settings.low && r.settings.high, label).toBeTruthy();
      }
    }
  });

  it('Ayrıntılı ve Altı Boyutlu, hocanın onayladığı Beş Faktör metinlerini olduğu gibi kullanır', () => {
    const bf = ROADMAPS[SLUG];
    for (const slug of ['ayrintili-kisilik-profili', 'alti-boyutlu-kisilik-profili']) {
      const t = ROADMAPS[slug];
      expect(t.scales.extraversion).toBe(bf.scales.extraversion);
      expect(t.scales.conscientiousness).toBe(bf.scales.conscientiousness);
      expect(t.scales.openness).toBe(bf.scales.intellect);
      expect(t.studyIntro).toBe(bf.studyIntro);
      expect(t.firstWeek).toBe(bf.firstWeek);
    }
    expect(ROADMAPS['ayrintili-kisilik-profili'].scales.emotional_stability).toBe(bf.scales.emotional_stability);
  });

  it('düzey grupları: çok düşük ve düşük → düşük, orta → orta, yüksek ve çok yüksek → yüksek', () => {
    expect(ALL_BANDS.map(bandGroup)).toEqual(['low', 'low', 'average', 'high', 'high']);
    expect(bandGroup(null)).toBeNull();
  });
});

describe('gelişim yol haritası: bütün düzey birleşimleri', () => {
  it('her testte, her birleşimde ve her kişi için bölümler eksiksiz ve birbiriyle tutarlıdır', () => {
    const counts: Record<string, number> = {};
    for (const slug of Object.keys(ROADMAPS)) {
      const { t, scales, bands } = setup(slug);
      const keys = scales.map((s) => s.key);
      counts[slug] = 0;
      for (const combo of combos(bands, scales.length)) {
        for (const a of AUDIENCES) {
          const rm = roadmapFor(slug, combo, a);
          const label = `${slug} ${combo.join(',')} ${a}`;
          const groups = combo.map(bandGroup);
          expect(rm.bars, label).toHaveLength(scales.length);
          expect(rm.study.items, label).toHaveLength(scales.length);
          // Öne çıkanlar yalnızca orta düzeyde olmayan boyutlardır; hiç yoksa dengeli profil cümlesi gösterilir.
          const extremes = groups.filter((g) => g !== 'average').length;
          expect(rm.standout.length, label).toBe(Math.min(2, extremes));
          expect(rm.standoutNote === null, label).toBe(extremes > 0);
          expect(rm.settings.items.length, label).toBe(extremes);
          // Dört hafta: fark et, çalışma düzeni, (iyi oluş gerekiyorsa) iyi oluş ya da en belirgin boyut, gözden geçir.
          expect(rm.weeks.map((w) => w.label), label).toEqual(['1. hafta', '2. hafta', '3. hafta', '4. hafta']);
          expect(rm.weeks[1].title, label).toBe('Çalışma düzeni');
          const wb = t.wellbeing;
          if (wb && groups[keys.indexOf(wb.scale)] === wb.group) {
            expect(rm.weeks[2].title, label).toBe(scales[keys.indexOf(wb.scale)].name);
            expect(rm.study.links.some((l) => l.href === '/rehber/sinav-kaygisi'), label).toBe(true);
          } else {
            expect(rm.weeks[2].title, label).not.toBe(scales[keys.indexOf(t.planningScale)].name);
            expect(rm.study.links.some((l) => l.href === '/rehber/sinav-kaygisi'), label).toBe(false);
          }
          expect(rm.approach !== null, label).toBe(a === 'parent');
          if (a === 'parent') expect(rm.approach!.items, label).toHaveLength(scales.length);
          for (const x of texts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (a === 'adult') expect(x, label).not.toMatch(SCHOOL);
            if (a !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
          }
          counts[slug]++;
        }
      }
    }
    expect(counts).toEqual({
      'bes-faktor-kisilik': 5 ** 5 * 3,
      'ayrintili-kisilik-profili': 3 ** 5 * 3,
      'alti-boyutlu-kisilik-profili': 3 ** 6 * 3,
    });
  });
});

describe('gelişim yol haritası: rapora eklenmesi', () => {
  const body = likertBody(SLUG, 8, (i) => (i * 7) % 5);

  it('hoca onayladı: herkese açık raporda vardır; önizleme isteği bir şey değiştirmez', () => {
    expect(ROADMAP_IN_REVIEW.has(SLUG)).toBe(false);
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    const now = new Date('2026-10-07T10:00:00Z');
    const plain = evaluate(SLUG, body, now);
    expect(plain.student.roadmap?.preview).toBe(false);
    expect(plain.parent.roadmap?.approach?.items.length).toBe(5);
    expect(evaluate(SLUG, { ...body, roadmapPreview: true }, now)).toEqual(plain);
    const other = evaluate('oz-saygi', { ...likertBody('oz-saygi', 8, (i) => i % 4), roadmapPreview: true });
    expect(other.student.roadmap).toBeUndefined();
    expect(answersBody.safeParse({ ...body, roadmapPreview: true }).success).toBe(true);
    expect(answersBody.safeParse({ ...body, roadmapPreview: false }).success).toBe(false);
  });

  it('incelemedeki bir yol haritası yalnızca önizleme isteğinde eklenir', () => {
    ROADMAP_IN_REVIEW.add(SLUG);
    try {
      expect(hasPublicRoadmap(SLUG)).toBe(false);
      expect(evaluate(SLUG, body).student.roadmap).toBeUndefined();
      expect(evaluate(SLUG, { ...body, roadmapPreview: true }).student.roadmap?.preview).toBe(true);
    } finally {
      ROADMAP_IN_REVIEW.delete(SLUG);
    }
  });

  it('Ayrıntılı ve Altı Boyutlu: uzman incelemesinde, yalnızca önizleme isteğinde; yetişkine de hazırlanır', () => {
    for (const [slug, n] of [['ayrintili-kisilik-profili', 5], ['alti-boyutlu-kisilik-profili', 6]] as const) {
      expect(ROADMAP_IN_REVIEW.has(slug)).toBe(true);
      const b = likertBody(slug, 10, (i) => (i * 7) % 5);
      expect(evaluate(slug, b).student.roadmap, slug).toBeUndefined();
      const r = evaluate(slug, { ...b, roadmapPreview: true });
      expect(r.student.roadmap?.preview, slug).toBe(true);
      expect(r.student.roadmap?.bars, slug).toHaveLength(n);
      expect(r.parent.roadmap?.approach?.items, slug).toHaveLength(n);
      const adult = evaluateAdult(slug, { ...b, grade: ADULT_GRADE, roadmapPreview: true }).adult.roadmap!;
      expect(adult.settings.title, slug).toBe('İş ve meslek planı için');
      expect(adult.approach, slug).toBeNull();
      for (const x of texts(adult)) expect(x, slug).not.toMatch(SCHOOL);
    }
  });

  it('son haftada yalnızca kişinin sınıfına uyan, yayındaki ilgi testleri önerilir', () => {
    const sixth = evaluate(SLUG, { ...likertBody(SLUG, 6, (i) => i % 5), roadmapPreview: true }).student.roadmap!;
    expect(sixth.weeks[3].text).not.toContain('testini');
    const tenth = evaluate(SLUG, { ...likertBody(SLUG, 10, (i) => i % 5), roadmapPreview: true }).student.roadmap!;
    expect(tenth.weeks[3].text).toContain('Meslek İlgi Alanları ve Mesleki İlgi Profili testlerinden birini çözebilirsin.');
  });

  it('PDF yol haritası sayfasıyla birlikte üretilir', async () => {
    const r = evaluate(SLUG, body);
    for (const audience of ['student', 'parent'] as const) {
      const { roadmap, ...withoutRoadmap } = r[audience];
      expect(roadmap).toBeDefined();
      const plain = await renderSimpleReportPdf(withoutRoadmap, 'olcekhane.com');
      const pdf = await renderSimpleReportPdf(r[audience], 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
      expect(pdf.length).toBeGreaterThan(plain.length);
    }
  }, 60_000);

  it('Beş Faktör yetişkinlere açık değildir (yetişkin metinleri ileride açılınca hazır)', () => {
    expect(() => evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE })).toThrow();
  });

  it('çözme sayfası önizleme seçimini sınıf formunda korur', () => {
    const page = readFileSync(path.join(__dirname, '..', 'src', 'app', '(test)', 'testler', '[slug]', 'coz', 'page.tsx'), 'utf8');
    expect(page).toContain('name="onizleme"');
    expect(page).toContain('ROADMAP_IN_REVIEW.has(def.slug)');
  });
});

describe('üç boyutlu sütun grafiği', () => {
  const bars = [1, 2, 3, 4, 5].map((v, i) => ({
    key: `b${i}`,
    value: v,
    min: 1,
    max: 5,
    ciLow: v - 0.3,
    ciHigh: v + 0.3,
    color: '#2f5ce0',
    valueLabel: String(v),
  }));

  it('sütun yüksekliği puanla doğru orantılıdır; grafik her açıda çerçevenin içinde kalır ve büyüyüp küçülmez', () => {
    const plain = bars.map((b) => ({ ...b, ciLow: null, ciHigh: null }));
    const heights: number[][] = [];
    for (const yaw of [-180, -120, -18, 0, 45, 90, 179]) {
      const sc = bars3dScene(plain, { yaw, width: 560, height: 420 });
      expect(sc.labels).toHaveLength(5);
      for (const p of sc.polys) {
        for (const pt of p.points.split(' ')) {
          const [x, y] = pt.split(',').map(Number);
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(560);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(420);
        }
      }
      const byKey = Object.fromEntries(sc.bars.map((m) => [m.key, m.baseY - m.topY]));
      heights.push(bars.map((b) => byKey[b.key]));
    }
    // Her açıda aynı yükseklikler (ölçek dönüşten bağımsız). En düşük puanlı sütun görünsün diye ona çok ince bir taban
    // verilir; bu yüzden orantı ikinci sütundan başlayarak denetlenir: puan 2, 3, 4, 5 → yükseklik 1, 2, 3, 4 birim.
    for (const hs of heights) hs.forEach((h, i) => expect(h).toBeCloseTo(heights[0][i], 6));
    const [, h2, h3, h4, h5] = heights[0];
    expect(h3 / h2).toBeCloseTo(2, 6);
    expect(h4 / h2).toBeCloseTo(3, 6);
    expect(h5 / h2).toBeCloseTo(4, 6);
  });

  it('ölçüm payı yarı saydam bir kılıf olarak çizilir; değeri olmayan sütun çizilmez', () => {
    const withBand = bars3dScene(bars, { yaw: -24 });
    expect(withBand.polys.filter((p) => p.opacity !== undefined).length).toBe(5 * 3);
    const empty = bars3dScene([{ ...bars[0], value: null }], { yaw: -24 });
    expect(empty.polys.every((p) => p.opacity === undefined)).toBe(true);
    expect(shade('#808080', 0.5)).toBe('#404040');
    expect(shade('#808080', 2)).toBe('#ffffff');
  });
});
