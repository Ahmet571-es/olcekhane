import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ADULT_GRADE } from '@/lib/config';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
import { scaleItems, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';

const SLUG = 'alti-boyutlu-kisilik-profili';
const d = def<LikertInstrument>(SLUG);

/** Boyutlar ve alt özellikleri (kaynaktaki sırayla). */
const DOMAINS: Record<string, string[]> = {
  honesty_humility: ['sincerity', 'fairness', 'greed_avoidance', 'modesty'],
  emotionality: ['fearfulness', 'anxiety', 'dependence', 'sentimentality'],
  extraversion: ['expressiveness', 'social_boldness', 'sociability', 'liveliness'],
  agreeableness: ['forgiveness', 'gentleness', 'flexibility', 'patience'],
  conscientiousness: ['organization', 'diligence', 'perfectionism', 'prudence'],
  openness: ['aesthetic_appreciation', 'inquisitiveness', 'creativity', 'unconventionality'],
};

/**
 * Kaynak sayfada (ipip.ori.org/newHEXACO_PI_key.htm) eksi yönlü maddelerin, ölçek içindeki sıra numaraları. Sayfa her
 * alt boyutta önce artı, sonra eksi yönlü maddeleri verir; madde anahtarı "ölçek kısaltması + sayfadaki sıra"dır.
 */
const MINUS: Record<string, number[]> = {
  sinc: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  fair: [6, 7, 8, 9, 10],
  gree: [3, 4, 5, 6, 7, 8, 9, 10],
  mode: [5, 6, 7, 8, 9, 10],
  fear: [6, 7, 8, 9, 10],
  anxi: [6, 7, 8, 9, 10],
  depe: [],
  sent: [6, 7, 8, 9, 10],
  expr: [6, 7, 8, 9, 10],
  socb: [6, 7, 8, 9, 10],
  soci: [6, 7, 8, 9, 10],
  live: [9, 10],
  forg: [5, 6, 7, 8, 9, 10],
  gent: [5, 6, 7, 8, 9, 10],
  flex: [3, 4, 5, 6, 7, 8, 9, 10],
  pati: [6, 7, 8, 9, 10],
  orga: [6, 7, 8, 9, 10],
  dili: [6, 7, 8, 9, 10],
  perf: [9, 10],
  prud: [4, 5, 6, 7, 8, 9, 10],
  aesa: [6, 7, 8, 9, 10],
  inqu: [7, 8, 9, 10],
  crea: [7, 8, 9, 10],
  unco: [6, 7, 8, 9, 10],
};

const domainOf = (facet: string) => d.scales.find((s) => s.of?.includes(facet))?.key;

/** Her maddenin anahtara göre en yüksek (5) ya da en düşük (1) puan alacağı cevaplar. */
function keyedAnswers(level: (scale: string) => 'high' | 'low' | 'mid') {
  return Object.fromEntries(
    d.items.map((it) => {
      const l = level(it.scale);
      const v = l === 'mid' ? 3 : (l === 'high') !== !!it.reverse ? 5 : 1;
      return [it.key, { value: v, rtMs: 2600 }];
    }),
  );
}

describe('Altı Boyutlu Kişilik Profili (IPIP-HEXACO) tanımı', () => {
  it('240 madde; 6 boyut, 24 alt özellik; her alt özellik 10 madde', () => {
    expect(d.items).toHaveLength(240);
    const domains = d.scales.filter((s) => s.of);
    const facets = d.scales.filter((s) => !s.of);
    expect(Object.fromEntries(domains.map((s) => [s.key, s.of]))).toEqual(DOMAINS);
    expect(facets.map((f) => f.key)).toEqual(Object.values(DOMAINS).flat());
    for (const f of facets) expect(d.items.filter((i) => i.scale === f.key), f.key).toHaveLength(10);
    for (const s of domains) expect(d.items.some((i) => i.scale === s.key)).toBe(false);
    expect(new Set(d.items.map((i) => i.key)).size).toBe(240);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(240);
    expect(new Set(d.items.map((i) => i.source)).size).toBe(240);
    for (const it of d.items) {
      expect(it.source, it.key).toBeTruthy();
      expect(it.text, it.key).toMatch(/[.]$/);
    }
  });

  it('ters puanlanan maddeler kaynaktaki anahtarla aynı; her madde kendi alt özelliğinde', () => {
    const prefixes = new Map(Object.keys(MINUS).map((p, i) => [p, Object.values(DOMAINS).flat()[i]]));
    for (const it of d.items) {
      const prefix = it.key.slice(0, 4);
      const n = Number(it.key.slice(4));
      expect(prefixes.get(prefix), it.key).toBe(it.scale);
      expect(n >= 1 && n <= 10, it.key).toBe(true);
      expect(!!it.reverse, it.key).toBe(MINUS[prefix].includes(n));
    }
    expect(d.items.filter((i) => i.reverse)).toHaveLength(122);
  });

  it('kaynaktaki madde metinlerinden örnekler', () => {
    const src = (key: string) => d.items.find((i) => i.key === key)?.source;
    expect(src('sinc01')).toBe("Don't pretend to be more than I am.");
    expect(src('sinc05')).toBe('Switch my loyalties when I feel like it.');
    expect(src('fair02')).toBe('Would never cheat on my taxes.');
    expect(src('soci06')).toBe('Seem to derive less enjoyment from interacting with people than others do.');
    expect(src('soci08')).toBe('Would not enjoy a job that involves a lot of social interaction.');
    expect(src('depe10')).toBe('Want to be liked.');
    expect(src('fear02')).toBe('Begin to panic when there is danger.');
    expect(src('fear06')).toBe('Like to do frightening things.');
    expect(src('pati10')).toBe('Get upset easily.');
    expect(src('unco10')).toBe('Try to avoid complex people.');
  });

  it('uygulama sırası: art arda iki madde aynı boyuttan değil; ilk 24 madde 24 alt özelliğin her birinden', () => {
    for (let i = 1; i < d.items.length; i++) {
      expect(domainOf(d.items[i].scale), d.items[i].key).not.toBe(domainOf(d.items[i - 1].scale));
    }
    expect(new Set(d.items.slice(0, 24).map((i) => i.scale)).size).toBe(24);
    expect(d.items[0].key).toBe('sinc01');
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri kullanılır', () => {
    const others = [def<LikertInstrument>('ayrintili-kisilik-profili'), def<LikertInstrument>('bes-faktor-kisilik')];
    // Ayrıntılı Kişilik Profili'nde İngilizce aslı noktasız yazılmıştır.
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    // Tek ayrılık: "Get upset easily" Beş Faktör'de hüzün anlamında çevrilmiştir; burada Sabırlılık alt özelliğindedir.
    const EXCEPT: Record<string, string> = { pati10: 'Küçük şeylere kolayca bozulurum.' };
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      // İki testte de varsa Ayrıntılı Kişilik Profili'ndeki çeviri esas alınır.
      expect(it.text, it.source).toBe(EXCEPT[it.key] ?? same[0].text);
    }
    expect(shared).toBe(49);
  });

  it('siyasi görüş ya da inanç soran madde yok; siyasete ilgiyi soran iki madde merak alt özelliğinde', () => {
    const religion = /(?<!\p{L})(din|dinî|dini|inanç|ibadet|oy|seçim|parti|aday)(?!\p{L})/iu;
    for (const it of d.items) expect(religion.test(it.text), it.text).toBe(false);
    expect(d.items.some((i) => /vote|liberal|conservative|religio|god\b/i.test(i.source ?? ''))).toBe(false);
    expect(d.items.filter((i) => /siyas/i.test(i.text)).map((i) => i.key).sort()).toEqual(['inqu05', 'inqu09']);
  });

  it('boyut puanı, alt özelliklerinin bütün maddelerinden (40 madde) hesaplanır', () => {
    for (const s of d.scales.filter((x) => x.of)) expect(scaleItems(d, s), s.key).toHaveLength(40);
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'sincerity' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('sincerity')!.mean).toBe(5);
    expect(byKey.get('fairness')!.mean).toBe(1);
    expect(byKey.get('honesty_humility')!.mean).toBeCloseTo((10 * 5 + 30 * 1) / 40, 3);
    expect(byKey.get('honesty_humility')!.nItems).toBe(40);
  });

  it('alt özelliklerde kaynaktaki güvenirlik değerleri var; standart sapma olmadığı için ölçüm payı yok', () => {
    for (const s of d.scales.filter((x) => !x.of)) {
      expect(s.alpha, s.key).toBeGreaterThanOrEqual(0.69);
      expect(s.alpha, s.key).toBeLessThanOrEqual(0.88);
    }
    for (const s of d.scales) expect(s.sdRef, s.key).toBeUndefined();
    const scores = scoreLikert(d, keyedAnswers(() => 'high'));
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni öğrenci ve veli için yazılmış', () => {
    const t = REPORT_TEMPLATES[SLUG];
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const bt = t.scales[s.key]?.[band];
        expect(bt, `${s.key}/${band}`).toBeDefined();
        expect(bt!.summary.length, `${s.key}/${band}`).toBeGreaterThan(3);
        expect(bt!.student.length, `${s.key}/${band}`).toBeGreaterThan(50);
        expect(bt!.parent, `${s.key}/${band}`).toContain('Çocuğunuz');
        expect(bt!.student, `${s.key}/${band}`).not.toContain('Çocuğunuz');
        // Klinik terimler kullanılmaz.
        expect(`${bt!.student} ${bt!.parent}`, `${s.key}/${band}`).not.toMatch(/depresyon|anksiyete|kaygı bozukluğu|hastalık/i);
      }
    }
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    // Destek kutusu yalnızca endişelenme yüksekse.
    const support = Object.entries(t.scales).flatMap(([k, v]) => Object.entries(v).filter(([, bt]) => bt?.support).map(([b]) => `${k}/${b}`));
    expect(support).toEqual(['anxiety/high']);
  });

  it('bilim kartı ve tanıtım: uzun test olduğu, süre ve madde sayısı açıkça yazılı', () => {
    expect(d.estimatedMinutes).toBe(30);
    expect(d.intro.paragraphs.join(' ')).toContain('240');
    expect(d.intro.paragraphs.join(' ')).toContain('30 dakika');
    expect(d.description).toContain('240 cümle');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.reliability).toContain('.69 ile .88');
    expect(d.science.reliability).toContain('ölçüm payı gösterilmez');
  });
});

describe('Altı Boyutlu Kişilik Profili raporu', () => {
  it('genel bakışta altı boyut; ardından boyut boyut dörder alt özellik', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(['Dürüstlük-Alçakgönüllülük', 'Duygusallık', 'Dışadönüklük', 'Uyumluluk', 'Sorumluluk', 'Deneyime Açıklık']);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).not.toContain('sarı bant');
      expect(rep.groups?.map((g) => g.facets.length)).toEqual([4, 4, 4, 4, 4, 4]);
      expect(rep.groups?.[0].facets.map((f) => f.label)).toEqual(['İçtenlik', 'Adil davranma', 'Sadelik', 'Alçakgönüllülük']);
      for (const g of rep.groups!) {
        expect(g.text.length).toBeGreaterThan(50);
        for (const f of g.facets) expect(f.text.length, f.label).toBeGreaterThan(40);
      }
      expect(rep.groupsNote).toContain('onar cümleyle');
      expect(rep.groupsNote).not.toContain('sarı bant');
      expect(rep.items).toEqual([]);
    }
    expect(r.parent.groups![0].text).toContain('Çocuğunuz');
    expect(r.student.groups![0].text).not.toContain('Çocuğunuz');
  });

  it('endişelenme yüksekse destek kutusu çıkar; öteki durumlarda çıkmaz', () => {
    const worried = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers: keyedAnswers((s) => (s === 'anxiety' ? 'high' : 'mid')) } });
    expect(worried.student.support?.title).toBe('Konuşmak istersen');
    expect(worried.parent.support?.title).toBe('Destek almak isterseniz');
    const e = worried.student.groups!.find((g) => g.title === 'Duygusallık')!;
    expect(e.facets.find((f) => f.label === 'Endişelenme')!.band).toBe('Yüksek');

    // Duygusallığın öteki alt özellikleri yüksek olsa da endişelenme yüksek değilse destek kutusu yok.
    const feeling = evaluate(SLUG, {
      grade: 11,
      data: { engine: 'likert', answers: keyedAnswers((s) => (domainOf(s) === 'emotionality' && s !== 'anxiety' ? 'high' : 'low')) },
    });
    expect(feeling.student.support).toBeNull();
  });

  it('orta cevaplarda bütün ölçekler orta düzeyde', () => {
    const r = evaluate(SLUG, { grade: 12, data: { engine: 'likert', answers: keyedAnswers(() => 'mid') } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.every((x) => x.band === 'Orta' && x.value === 3)).toBe(true);
    expect(r.student.groups!.flatMap((g) => g.facets).every((f) => f.band === 'Orta')).toBe(true);
  });

  it('yetişkine tek, kişisel rapor; okula özgü cümleler yetişkine göre', () => {
    const answers = keyedAnswers((s) => (s === 'anxiety' || domainOf(s) === 'conscientiousness' ? 'high' : 'mid'));
    const adult = evaluateAdult(SLUG, { grade: ADULT_GRADE, data: { engine: 'likert', answers } }).adult;
    expect(adult.audience).toBe('adult');
    expect(adult.groups?.map((g) => g.facets.length)).toEqual([4, 4, 4, 4, 4, 4]);
    expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
    expect(adult.groups!.find((g) => g.title === 'Sorumluluk')!.text).toContain('işinde, eğitiminde');
    const anxiety = adult.groups!.find((g) => g.title === 'Duygusallık')!.facets.find((f) => f.label === 'Endişelenme')!;
    expect(anxiety.text).toContain('ruh sağlığı uzmanıyla');
    expect(adult.support?.title).toBe('Destek almak istersen');
  });

  it('uzman incelemesinde: bağlantıyla çözülür, listelerde ve site haritasında yok', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(false);
    expect(sitemap().some((u) => u.url.includes(`/testler/${SLUG}`))).toBe(false);
  });
});
