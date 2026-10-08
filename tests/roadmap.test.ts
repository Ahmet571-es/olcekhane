import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, ROADMAP_IN_REVIEW, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import type { AudienceText } from '@/content/roadmaps/types';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { answersBody } from '@/lib/assessment/schemas';
import { LABEL_ALL_MAX, bars3dScene, defaultYaw, shade } from '@/lib/charts/bars3d';
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

/**
 * Yetişkin metinleri denetlenen şablonlar: test yetişkinlere açıksa ya da şablonda yetişkin metni yazılmışsa (Beş Faktör
 * yetişkin metinleri ileride açılınca hazır). Yalnızca öğrencilere açık testlerde öğrenci metni okula özgü olabilir.
 */
function adultReady(slug: string): boolean {
  const t = ROADMAPS[slug];
  const anyAdult = Object.values(t.scales).some((s) => [...Object.values(s.study), ...Object.values(s.action)].some((x) => x.adult));
  return !!def<LikertInstrument>(slug).adults || anyAdult;
}

/** Şablonda ortam metni var mı (kişilik testleri); yoksa ortamlar bölümü gösterilmez. */
function hasSettings(slug: string): boolean {
  return Object.values(ROADMAPS[slug].scales).some((s) => s.settings);
}

/**
 * Ortamı olan şablonda ortamı bilerek yazılmayan boyutlar. 16 Faktörlü Kişilik Profili: Düşünsel özgüven (kendine bakış;
 * ortam önerisi beceriye göre yönlendirme gibi okunur) ve Duyarlılık (maddeler sanat ve edebiyat zevkini sorar, ortam
 * tercihini değil).
 */
const NO_SETTINGS: Record<string, string[]> = { '16-faktorlu-kisilik-profili': ['intellect', 'sensitivity'] };

/** Bir düzey birleşimi için yol haritası (rapor metinleri sitedeki şablondan). */
function roadmapFor(slug: string, bands: Band[], audience: Audience, edit?: (sections: Record<string, unknown>[]) => void): Roadmap {
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
  edit?.(sections);
  const content = { audience, sections } as unknown as ReportContent;
  return buildRoadmap(content, t, { preview: true, next: [{ name: 'Meslek İlgi Alanları', href: '/testler/meslek-ilgi-alanlari' }] });
}

function* combos(bands: Band[], n: number): Generator<Band[]> {
  for (let k = 0; k < bands.length ** n; k++) {
    yield Array.from({ length: n }, (_, i) => bands[Math.floor(k / bands.length ** i) % bands.length]);
  }
}

/** Örneklemdeki rastgele birleşim sayısı (çok boyutlu testlerde). */
const SAMPLE = 3000;

/**
 * Sınanan düzey birleşimleri: sekiz boyuta kadar bütün birleşimler. Daha çok boyutlu testlerde (ör. 16 özellik: 3^16 ≈ 43
 * milyon birleşim) bütün birleşimler denenemez; bunun yerine yol haritasının seçim kurallarını zorlayan birleşimler
 * denenir: hepsi aynı düzeyde, her boyut tek başına uçta, her iki boyut birlikte uçta (dört yön) ve sabit tohumlu
 * 3000 rastgele birleşim.
 */
function* combosFor(bands: Band[], n: number): Generator<Band[]> {
  if (n <= 8) {
    yield* combos(bands, n);
    return;
  }
  const mid = bands.find((b) => b === 'average')!;
  const ends = bands.filter((b) => b !== mid);
  for (const b of bands) yield Array.from({ length: n }, () => b);
  for (let i = 0; i < n; i++) for (const e of ends) yield Array.from({ length: n }, (_, k) => (k === i ? e : mid));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (const a of ends) for (const b of ends) yield Array.from({ length: n }, (_, k) => (k === i ? a : k === j ? b : mid));
    }
  }
  let seed = 20261008;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2 ** 31;
    return seed / 2 ** 31;
  };
  for (let s = 0; s < SAMPLE; s++) yield Array.from({ length: n }, () => bands[Math.floor(rand() * bands.length)]);
}

/** combosFor'un ürettiği birleşim sayısı. */
function comboCount(bands: number, n: number): number {
  if (n <= 8) return bands ** n;
  const ends = bands - 1;
  return bands + n * ends + ((n * (n - 1)) / 2) * ends * ends + SAMPLE;
}

function texts(rm: Roadmap): string[] {
  return [
    rm.intro,
    rm.standoutNote ?? '',
    rm.study.intro,
    ...rm.study.items.map((i) => i.text),
    ...(rm.settings ? [rm.settings.intro, rm.settings.note] : []),
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
      for (const w of t.wellbeing ? [t.wellbeing].flat() : []) expect(t.scales[w.scale], slug).toBeDefined();
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
            if (adultReady(slug)) expect(x.adult ?? x.student, `${label} ${g}`).not.toMatch(SCHOOL);
            expect(x.parent, `${label} ${g}`).toMatch(/[Çç]ocuğunuz/);
            expect(x.student, `${label} ${g}`).not.toMatch(/[Çç]ocuğunuz/);
          }
          const tip = t.approach?.[sc.key]?.[g];
          if (t.approach) expect(tip, `${label} ${g} veliye yaklaşım`).toBeTruthy();
          if (tip) expect(tip.trim(), `${label} ${g}`).toMatch(/[.!?]$/);
        }
        // Orta düzeyde belirgin bir ortam yoktur; uçlarda vardır. Ortamı olan şablonda her boyutun ortamı ve notu vardır.
        if (hasSettings(slug)) {
          expect(r.settings?.average).toBeUndefined();
          expect(!!(r.settings?.low && r.settings?.high), label).toBe(!(NO_SETTINGS[slug] ?? []).includes(sc.key));
        } else {
          expect(r.settings, label).toBeUndefined();
        }
      }
      expect(!!t.settingsNote, slug).toBe(hasSettings(slug));
      // Tek boyutlu testte 3. hafta şablondaki ek denemedir.
      expect(!!t.extraWeek, slug).toBe(scales.length === 1);
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
      for (const combo of combosFor(bands, scales.length)) {
        for (const a of AUDIENCES.filter((x) => x !== 'adult' || adultReady(slug))) {
          const rm = roadmapFor(slug, combo, a);
          const label = `${slug} ${combo.join(',')} ${a}`;
          const groups = combo.map(bandGroup);
          expect(rm.bars, label).toHaveLength(scales.length);
          // Çok boyutlu testte (focus) öneri kartları yalnızca en belirgin boyutlar içindir; uçtaki boyutlar ortadakilerden
          // önce gelir, eşitlikte profildeki sıra korunur.
          const shown = t.focus && scales.length > t.focus.count ? t.focus.count : scales.length;
          expect(rm.study.items, label).toHaveLength(shown);
          // Öne çıkanlar yalnızca orta düzeyde olmayan boyutlardır; hiç yoksa dengeli profil cümlesi gösterilir. Tek
          // boyutlu testte o boyut her zaman gösterilir.
          const extremes = groups.filter((g) => g !== 'average').length;
          const dist = (i: number) => Math.abs(VALUE[combo[i]] - 3);
          const ext = (i: number) => (groups[i] === 'average' ? 0 : 1);
          const focusKeys = keys
            .map((k, i) => ({ k, i }))
            .sort((x, y) => (shown < scales.length ? ext(y.i) - ext(x.i) || dist(y.i) - dist(x.i) : 0) || x.i - y.i)
            .slice(0, shown);
          if (shown < scales.length) {
            expect(rm.study.items.map((x) => x.key), label).toEqual(focusKeys.map((x) => x.k));
            expect(rm.study.intro, label).toContain(
              a === 'parent' ? 'Aşağıda çocuğunuzun puanı ortadan en uzak altı özelliği' : 'Aşağıda puanı ortadan en uzak altı özelliğin',
            );
          }
          expect(rm.standout.length, label).toBe(scales.length === 1 ? 1 : Math.min(2, extremes));
          expect(rm.standoutNote === null, label).toBe(scales.length === 1 || extremes > 0);
          // Ortamlar: gösterilen boyutlardan uçta olanlar (ortamı yazılmamış boyutlar hariç).
          const noSettings = NO_SETTINGS[slug] ?? [];
          const settingCount = focusKeys.filter((x) => ext(x.i) && !noSettings.includes(x.k)).length;
          if (hasSettings(slug)) expect(rm.settings?.items.length, label).toBe(settingCount);
          else expect(rm.settings, label).toBeNull();
          // Rozette düzey ile kısa ad aynıysa bir kez yazılır.
          for (const it of rm.study.items) expect(it.badge, label).not.toMatch(/^(.+) · \1$/);
          // Dört hafta: fark et, çalışma düzeni, (iyi oluş gerekiyorsa) iyi oluş ya da en belirgin boyut, gözden geçir.
          expect(rm.weeks.map((w) => w.label), label).toEqual(['1. hafta', '2. hafta', '3. hafta', '4. hafta']);
          expect(rm.weeks[1].title, label).toBe(t.planningTitle ?? 'Çalışma düzeni');
          // İyi oluş: şablondaki sırayla ilk uyan boyut.
          const wb = (t.wellbeing ? [t.wellbeing].flat() : []).find((w) => groups[keys.indexOf(w.scale)] === w.group);
          if (wb) {
            expect(rm.weeks[2].title, label).toBe(scales[keys.indexOf(wb.scale)].name);
            // İyi oluş bağlantısı: verilmezse "Sınav kaygısı" yazısı, `null` ise hiç bağlantı yok.
            // Varsayılan "Sınav kaygısı" yazısı öğrencilere ve velilere yazılmıştır; yetişkine verilmez.
            const href = wb.link === undefined ? (a === 'adult' ? undefined : '/rehber/sinav-kaygisi') : wb.link?.href;
            expect(rm.study.links.map((l) => l.href), label).toEqual([
              '/rehber/etkili-ders-calisma-yontemleri',
              ...(href ? [href] : []),
              ...(t.links ?? []).map((l) => l.href),
            ]);
          } else {
            expect(rm.study.links.map((l) => l.href), label).toEqual([
              '/rehber/etkili-ders-calisma-yontemleri',
              ...(t.links ?? []).map((l) => l.href),
            ]);
            const others = keys.map((k, i) => ({ k, i })).filter((x) => x.k !== t.planningScale);
            if (others.length === 0) {
              expect(rm.weeks[2].title, label).toBe(t.extraWeek!.title);
            } else if (t.thirdWeek === 'lowest') {
              // En düşük puanlı (eşitlikte ilk) alışkanlık.
              const lowest = others.reduce((m, x) => (VALUE[combo[x.i]] < VALUE[combo[m.i]] ? x : m));
              expect(rm.weeks[2].title, label).toBe(scales[lowest.i].name);
            } else {
              expect(rm.weeks[2].title, label).not.toBe(scales[keys.indexOf(t.planningScale)].name);
            }
          }
          expect(rm.approach !== null, label).toBe(a === 'parent');
          if (a === 'parent') expect(rm.approach!.items, label).toHaveLength(shown);
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
      'duygusal-zeka-bilesenleri': 3 ** 7 * 3,
      'kisilerarasi-tarz': 3 ** 8 * 3,
      '16-faktorlu-kisilik-profili': comboCount(3, 16) * 3,
      'oz-saygi': 3 * 2,
      'calisma-aliskanliklari': 5 ** 5 * 2,
      'ogrenme-ve-basari-ozellikleri': 3 ** 6 * 3,
    });
  }, 60_000);
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

  it('Ayrıntılı ve Altı Boyutlu: hoca onayladı, herkese açık raporda; yetişkine de hazırlanır', () => {
    for (const [slug, n] of [['ayrintili-kisilik-profili', 5], ['alti-boyutlu-kisilik-profili', 6]] as const) {
      expect(ROADMAP_IN_REVIEW.has(slug)).toBe(false);
      expect(hasPublicRoadmap(slug)).toBe(true);
      const b = likertBody(slug, 10, (i) => (i * 7) % 5);
      const now = new Date('2026-10-07T10:00:00Z');
      const r = evaluate(slug, b, now);
      expect(evaluate(slug, { ...b, roadmapPreview: true }, now), slug).toEqual(r);
      expect(r.student.roadmap?.preview, slug).toBe(false);
      expect(r.student.roadmap?.bars, slug).toHaveLength(n);
      expect(r.parent.roadmap?.approach?.items, slug).toHaveLength(n);
      const adult = evaluateAdult(slug, { ...b, grade: ADULT_GRADE }).adult.roadmap!;
      expect(adult.preview, slug).toBe(false);
      expect(adult.settings?.title, slug).toBe('İş ve meslek planı için');
      expect(adult.approach, slug).toBeNull();
      for (const x of texts(adult)) expect(x, slug).not.toMatch(SCHOOL);
    }
  });

  it('Duygusal Zekâ Bileşenleri: yayında (hoca onayı beklenmeden); yetişkine de hazırlanır', () => {
    const slug = 'duygusal-zeka-bilesenleri';
    expect(ROADMAP_IN_REVIEW.has(slug)).toBe(false);
    expect(hasPublicRoadmap(slug)).toBe(true);
    const b = likertBody(slug, 10, (i) => (i * 7) % 5);
    const now = new Date('2026-10-07T10:00:00Z');
    const r = evaluate(slug, b, now);
    expect(evaluate(slug, { ...b, roadmapPreview: true }, now)).toEqual(r);
    expect(r.student.roadmap?.preview).toBe(false);
    expect(r.student.roadmap?.bars).toHaveLength(7);
    expect(r.student.roadmap?.weeks[1].title).toBe('Duygularına dikkat');
    expect(r.parent.roadmap?.approach?.items).toHaveLength(7);
    // Bu testte ölçüm payı hesaplanmaz: üç boyutlu grafikte kılıf çizilmez.
    expect(r.student.roadmap?.bars.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
    const adult = evaluateAdult(slug, { ...b, grade: ADULT_GRADE }).adult.roadmap!;
    expect(adult.settings?.title).toBe('İş ve meslek planı için');
    expect(adult.approach).toBeNull();
    for (const x of texts(adult)) expect(x).not.toMatch(SCHOOL);
    // Üzücü olaylardan etkilenme yüksekken 3. hafta iyi oluşa ayrılır; bu ölçek kaygı ölçmediği için "Sınav kaygısı"
    // yazısına bağlantı verilmez.
    const d = def<LikertInstrument>(slug);
    const answers = Object.fromEntries(
      d.items.map((it) => [it.key, { value: it.scale !== 'responsive_distress' ? 3 : it.reverse ? 1 : 5, rtMs: 2600 }]),
    );
    const high = evaluate(slug, { grade: 10, data: { engine: 'likert', answers } }).student.roadmap!;
    expect(high.weeks[2].title).toBe('Üzücü olaylardan etkilenme');
    expect(high.study.links.map((l) => l.href)).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
  });

  it('Kişilerarası Tarz: yayında (hoca onayı beklenmeden); çemberin sırasıyla, yetişkine de hazırlanır', () => {
    const slug = 'kisilerarasi-tarz';
    expect(ROADMAP_IN_REVIEW.has(slug)).toBe(false);
    expect(hasPublicRoadmap(slug)).toBe(true);
    const b = likertBody(slug, 10, (i) => (i * 7) % 5);
    const now = new Date('2026-10-07T10:00:00Z');
    const r = evaluate(slug, b, now);
    expect(evaluate(slug, { ...b, roadmapPreview: true }, now)).toEqual(r);
    const rm = r.student.roadmap!;
    expect(rm.preview).toBe(false);
    // Sütunlar çemberdeki sırayla (üstten saat yönünde) dizilir; her tarzın kendi rengi vardır.
    expect(rm.bars.map((x) => x.key)).toEqual(def<LikertInstrument>(slug).scales.map((s) => s.key));
    expect(new Set(rm.bars.map((x) => x.color)).size).toBe(8);
    expect(rm.weeks[1].title).toBe('Birlikte çalışırken');
    // Ölçeklerin hiçbiri sıkıntı ölçmez: iyi oluş haftası ve "Sınav kaygısı" bağlantısı yoktur.
    expect(rm.study.links.map((l) => l.href)).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
    expect(r.parent.roadmap?.approach?.items).toHaveLength(8);
    // Bu testte ölçüm payı hesaplanmaz: üç boyutlu grafikte kılıf çizilmez.
    expect(rm.bars.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
    const adult = evaluateAdult(slug, { ...b, grade: ADULT_GRADE }).adult.roadmap!;
    expect(adult.settings?.title).toBe('İş ve meslek planı için');
    expect(adult.approach).toBeNull();
    for (const x of texts(adult)) expect(x).not.toMatch(SCHOOL);
    // Rapordaki veli metinlerinde geçen öneriler veliye yaklaşımda tekrar edilmez.
    const tpl = REPORT_TEMPLATES[slug];
    for (const [key, byGroup] of Object.entries(ROADMAPS[slug].approach!)) {
      for (const g of ['low', 'average', 'high'] as const) {
        const parentText = tpl.scales[key][g]!.parent;
        for (const sentence of byGroup[g].split(/;\s*/)) expect(parentText, `${key} ${g}`).not.toContain(sentence.replace(/\.$/, ''));
      }
    }
  });

  it('bir şablondaki metinler birbirini tekrar etmez (aynı raporda yan yana okunurlar)', () => {
    for (const slug of Object.keys(ROADMAPS)) {
      const t = ROADMAPS[slug];
      const scales = Object.values(t.scales);
      const unique = (xs: string[], what: string) => expect(new Set(xs).size, `${slug} ${what}`).toBe(xs.length);
      for (const a of AUDIENCES) {
        for (const g of ['low', 'average', 'high'] as const) {
          const pickA = (x: AudienceText) => (a === 'parent' ? x.parent : a === 'adult' ? (x.adult ?? x.student) : x.student);
          unique(scales.map((s) => pickA(s.study[g])), `${a} ${g} nasıl çalışabilir`);
          unique(scales.map((s) => pickA(s.action[g])), `${a} ${g} bu hafta dene`);
        }
      }
      if (hasSettings(slug)) unique(scales.flatMap((s) => (s.settings ? [s.settings.low!, s.settings.high!] : [])), 'ortamlar');
      if (t.approach) unique(Object.values(t.approach).flatMap((x) => [x.low, x.average, x.high]), 'veliye yaklaşım');
    }
  });

  it('Öz-saygı: tek boyutlu; üç boyutlu profil ve ortamlar yok, 3. hafta ek deneme, "Öz-saygı nedir?" bağlantısı', async () => {
    const slug = 'oz-saygi';
    expect(ROADMAP_IN_REVIEW.has(slug)).toBe(false);
    expect(hasPublicRoadmap(slug)).toBe(true);
    const d = def<LikertInstrument>(slug);
    // Her cümleye en olumsuz (low) ya da en olumlu cevap; ters maddeler dikkate alınır.
    const body = (low: boolean) => ({
      grade: 8,
      data: {
        engine: 'likert' as const,
        answers: Object.fromEntries(d.items.map((it) => [it.key, { value: (it.reverse ? !low : low) ? 0 : 3, rtMs: 2600 }])),
      },
    });
    const low = evaluate(slug, body(true));
    const rm = low.student.roadmap!;
    expect(rm.bars).toHaveLength(1);
    expect(rm.settings).toBeNull();
    expect(rm.intro).not.toContain('ortamlarda');
    expect(rm.standout).toEqual([{ title: 'Öz-saygı', text: 'Kendine karşı eleştirel' }]);
    expect(rm.study.items[0].badge).toBe('Kendine karşı eleştirel');
    expect(rm.weeks.map((w) => w.title)).toEqual(['Fark et', 'Kendine bakış', 'Gerçek bir sorumluluk', 'Gözden geçir']);
    expect(rm.study.links.map((l) => l.href)).toEqual(['/rehber/etkili-ders-calisma-yontemleri', '/rehber/oz-saygi-nedir']);
    expect(low.parent.roadmap!.approach!.items).toHaveLength(1);
    // Düşük düzeyde raporun kendi destek kutusu durur; yol haritası onun yerine geçmez.
    expect(low.student.support).not.toBeNull();
    expect(evaluate(slug, body(false)).student.roadmap!.standout[0].text).toBe('Kendine olumlu bakıyor');
    // PDF üç boyutlu profil ve ortamlar olmadan da üretilir.
    const pdf = await renderSimpleReportPdf(low.parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('Çalışma Alışkanlıkları: ortamlar yok; 2. hafta Planlama, 3. hafta en düşük puanlı alışkanlık', async () => {
    const slug = 'calisma-aliskanliklari';
    expect(ROADMAP_IN_REVIEW.has(slug)).toBe(false);
    expect(hasPublicRoadmap(slug)).toBe(true);
    const d = def<LikertInstrument>(slug);
    // Odaklanma en düşük, Planlama orta, ötekiler yüksek (ters maddeler dikkate alınarak).
    const target = (scale: string) => (scale === 'focus' ? 1 : scale === 'planning' ? 3 : 5);
    const answers = Object.fromEntries(
      d.items.map((it) => [it.key, { value: it.reverse ? 6 - target(it.scale) : target(it.scale), rtMs: 2600 }]),
    );
    const r = evaluate(slug, { grade: 8, data: { engine: 'likert', answers } });
    const rm = r.student.roadmap!;
    expect(rm.bars).toHaveLength(5);
    expect(rm.settings).toBeNull();
    expect(rm.intro).not.toContain('ortamlarda');
    expect(rm.weeks.map((w) => w.title)).toEqual(['Fark et', 'Çalışma düzeni', 'Odaklanma', 'Gözden geçir']);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(5);
    expect(r.parent.roadmap!.intro).toContain('ona nasıl yaklaşabileceğiniz');
    const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('test sayfasındaki tanıtım yalnızca o testte olan bölümleri sayar', () => {
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    expect(roadmapSummary('calisma-aliskanliklari')).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    expect(roadmapSummary('oz-saygi')).toBe('nasıl çalışılabileceğine dair öneriler, veliye yaklaşım önerileri ve dört haftalık küçük adımlar');
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

  it('puan yazıları hiçbir açıda üst üste binmez ve çizimin içinde kalır (ekranda ve PDF boyutunda)', () => {
    const sizes = [
      { width: 560, height: 420, label: { charWidth: 11.5, height: 20 } },
      { width: 380, height: 285, label: { charWidth: 7.2, height: 13 } },
    ];
    for (const size of sizes) {
      for (let k = 0; k < 60; k++) {
        const n = 5 + (k % 4);
        const values = Array.from({ length: n }, (_, i) => 1 + Math.round(((Math.sin(k * 13.7 + i * 7.3) + 1) / 2) * 40) / 10);
        const input = values.map((v, i) => ({ ...bars[0], key: `b${i}`, value: v, ciLow: null, ciHigh: null, valueLabel: v.toFixed(1) }));
        for (let yaw = 0; yaw < 360; yaw += 15) {
          const { labels } = bars3dScene(input, { yaw, ...size });
          const { charWidth, height } = size.label;
          for (const [i, a] of labels.entries()) {
            expect(a.y, `${n} sütun, ${yaw}°`).toBeGreaterThanOrEqual(height * 0.8);
            for (const b of labels.slice(i + 1)) {
              const apart = Math.abs(a.x - b.x) >= ((a.text.length + b.text.length) * charWidth) / 2 || Math.abs(a.y - b.y) >= height;
              expect(apart, `${n} sütun, ${yaw}°: ${a.key} ve ${b.key}`).toBe(true);
            }
          }
        }
      }
    }
  });

  it('çok sütunda (16 özellik) yalnızca öndeki ve yandaki sütunların puanı yazılır; yazılar üst üste binmez', () => {
    const sizes = [
      { width: 560, height: 420, label: { charWidth: 11.5, height: 20 } },
      { width: 380, height: 285, label: { charWidth: 7.2, height: 13 } },
    ];
    expect(LABEL_ALL_MAX).toBe(10);
    for (const size of sizes) {
      for (let k = 0; k < 20; k++) {
        const values = Array.from({ length: 16 }, (_, i) => 1 + Math.round(((Math.sin(k * 13.7 + i * 7.3) + 1) / 2) * 40) / 10);
        const input = values.map((v, i) => ({ ...bars[0], key: `b${i}`, value: v, ciLow: null, ciHigh: null, valueLabel: v.toFixed(1) }));
        for (let yaw = 0; yaw < 360; yaw += 15) {
          const sc = bars3dScene(input, { yaw, ...size });
          expect(sc.bars).toHaveLength(16);
          // Arkadaki sütunların yazısı yoktur; öndekilerin ve yandakilerin vardır (yaklaşık yarısından biraz fazlası).
          expect(sc.labels.length, `${yaw}°`).toBeGreaterThanOrEqual(8);
          expect(sc.labels.length, `${yaw}°`).toBeLessThan(16);
          const { charWidth, height } = size.label;
          for (const [i, a] of sc.labels.entries()) {
            expect(a.y, `${yaw}°`).toBeGreaterThanOrEqual(height * 0.8);
            for (const b of sc.labels.slice(i + 1)) {
              const apart = Math.abs(a.x - b.x) >= ((a.text.length + b.text.length) * charWidth) / 2 || Math.abs(a.y - b.y) >= height;
              expect(apart, `${yaw}°: ${a.key} ve ${b.key}`).toBe(true);
            }
          }
        }
      }
    }
  });

  it('ilk açıda hiçbir sütun bir başkasının tam arkasına düşmez (ör. dört soru türü, altı özellik)', () => {
    for (let n = 2; n <= LABEL_ALL_MAX; n++) {
      const input = Array.from({ length: n }, (_, i) => ({ ...bars[0], key: `k${i}`, ciLow: null, ciHigh: null }));
      const { labels } = bars3dScene(input, { yaw: defaultYaw(n), width: 560, height: 420 });
      const xs = labels.map((l) => l.x).sort((a, b) => a - b);
      const gap = Math.min(...xs.slice(1).map((x, i) => x - xs[i]));
      expect(gap, `${n} sütun`).toBeGreaterThan(10);
      // Eski açıda (180/n) çift sayıda sütunda sütunlar ikişer ikişer üst üste düşüyordu.
      if (n % 2 === 0 && n >= 4) {
        const old = bars3dScene(input, { yaw: 180 / n, width: 560, height: 420 }).labels.map((l) => l.x).sort((a, b) => a - b);
        expect(Math.min(...old.slice(1).map((x, i) => x - old[i])), `${n} sütun, eski açı`).toBeLessThan(1);
      }
    }
    // Tek sayıda sütunda eski açı korunur: iki sütun önde, ötekiler simetrik (beşgende 36°).
    expect([defaultYaw(5), defaultYaw(4), defaultYaw(6)]).toEqual([36, 22.5, 15]);
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

describe('Yol haritası: hesaplanamayan boyut', () => {
  it('çalışma düzeni boyutu hesaplanamasa da (ör. o boyutta çok madde boş) plan dört haftadır; giriş aynı sayıyı söyler', () => {
    let n = 0;
    for (const slug of Object.keys(ROADMAPS)) {
      const { t, scales, bands } = setup(slug);
      if (scales.length < 3) continue;
      for (const audience of AUDIENCES) {
        const rm = roadmapFor(
          slug,
          scales.map((_, i) => bands[i % bands.length]),
          audience,
          (sections) => {
            const p = sections.find((s) => s.scaleKey === t.planningScale)!;
            Object.assign(p, { value: null, band: null, ciLow: null, ciHigh: null });
          },
        );
        n++;
        expect(rm.weeks.map((w) => w.label), slug).toEqual(['1. hafta', '2. hafta', '3. hafta', '4. hafta']);
        expect(new Set(rm.weeks.map((w) => w.title)).size, slug).toBe(4);
        expect(rm.intro, slug).toContain('dört haftalık küçük adımlar');
      }
    }
    expect(n).toBeGreaterThan(10);
  });
});
