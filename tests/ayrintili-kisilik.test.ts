import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { NEO_ADAPTED, NEO_REMOVED } from '@/content/instruments/ayrintili-kisilik';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { scaleItems, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'ayrintili-kisilik-profili';
const d = def<LikertInstrument>(SLUG);
const no = (key: string) => Number(key.slice(1));

/** Boyutlar ve alt özellik sayıları (Deneyime Açıklık'ta Liberalizm çıkarıldı). */
const DOMAINS: Record<string, number> = {
  extraversion: 6,
  agreeableness: 6,
  conscientiousness: 6,
  emotional_stability: 6,
  openness: 5,
};

/**
 * Ters puanlanan maddelerin özgün numaraları: Johnson (2014) Tablo 1'de eksi yönlü maddeler; Nevrotiklik maddeleri
 * Duygusal Denge olarak sunulduğu için onlarda artı yönlü olanlar ters puanlanır.
 */
const REVERSED = [
  1, 6, 9, 11, 16, 19, 21, 24, 26, 30, 31, 36, 39, 40, 41, 46, 48, 49, 53, 54, 56, 60, 61, 62, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 78, 79,
  80, 83, 84, 85, 86, 89, 90, 91, 92, 94, 97, 98, 99, 100, 102, 103, 104, 105, 107, 108, 109, 110, 113, 114, 115, 119, 120,
];

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

const domainOf = (facet: string) => d.scales.find((s) => s.of?.includes(facet))?.key;

describe('Ayrıntılı Kişilik Profili (IPIP-NEO-120) tanımı', () => {
  it('116 madde; 5 boyut, 29 alt özellik; her alt özellik 4 madde', () => {
    expect(d.items).toHaveLength(116);
    const domains = d.scales.filter((s) => s.of);
    const facets = d.scales.filter((s) => !s.of);
    expect(Object.fromEntries(domains.map((s) => [s.key, s.of!.length]))).toEqual(DOMAINS);
    expect(facets).toHaveLength(29);
    for (const f of facets) expect(d.items.filter((i) => i.scale === f.key), f.key).toHaveLength(4);
    // Her alt özellik tam olarak bir boyuta bağlı; bileşik ölçeklere doğrudan madde bağlanmaz.
    for (const f of facets) expect(domains.filter((x) => x.of!.includes(f.key)), f.key).toHaveLength(1);
    for (const s of domains) expect(d.items.some((i) => i.scale === s.key)).toBe(false);
    expect(new Set(d.items.map((i) => i.key)).size).toBe(116);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(116);
    for (const it of d.items) expect(it.source, it.key).toBeTruthy();
  });

  it('ters puanlanan maddeler kaynaktaki anahtarla aynı', () => {
    expect(d.items.filter((i) => i.reverse).map((i) => no(i.key))).toEqual(REVERSED);
  });

  it('siyasi görüş ve inanç soran Liberalizm maddeleri yok; uyarlanan maddeler yerinde', () => {
    const nums = new Set(d.items.map((i) => no(i.key)));
    for (const n of NEO_REMOVED) expect(nums.has(n)).toBe(false);
    for (const n of NEO_ADAPTED) expect(nums.has(n)).toBe(true);
    expect(d.items.some((i) => /vote|liberal|conservative|absolute right|tough on crime/i.test(i.source ?? ''))).toBe(false);
    const sensitive = /\b(oy|seçim|siyasi|siyaset|parti|aday|din|dinî|dini|inanç|ibadet)\b/i;
    for (const it of d.items) expect(sensitive.test(it.text), it.text).toBe(false);
  });

  it('boyut puanı, alt özelliklerinin bütün maddelerinden hesaplanır', () => {
    expect(scaleItems(d, d.scales.find((s) => s.key === 'openness')!)).toHaveLength(20);
    expect(scaleItems(d, d.scales.find((s) => s.key === 'emotional_stability')!)).toHaveLength(24);
    // Dışadönüklüğün yalnızca Sıcakkanlılık maddeleri 5, diğerleri 1 (anahtara göre): boyut ortalaması 4 maddenin 24'e oranı.
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'friendliness' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('friendliness')!.mean).toBe(5);
    expect(byKey.get('gregariousness')!.mean).toBe(1);
    expect(byKey.get('extraversion')!.mean).toBeCloseTo((4 * 5 + 20 * 1) / 24, 3);
    expect(byKey.get('extraversion')!.nItems).toBe(24);
  });

  it('bütün ölçekler için güvenirlik ve başvuru standart sapması var (ölçüm payı)', () => {
    for (const s of d.scales) {
      expect(s.alpha, s.key).toBeGreaterThan(0.6);
      expect(s.sdRef, s.key).toBeGreaterThan(0.4);
    }
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
      }
    }
    // Destek kutusu yalnızca duygusal dengede ve iç huzurunda, düşük düzeyde.
    const support = Object.entries(t.scales).flatMap(([k, v]) => Object.entries(v).filter(([, bt]) => bt?.support).map(([b]) => `${k}/${b}`));
    expect(support.sort()).toEqual(['contentment/low', 'emotional_stability/low']);
  });
});

describe('Ayrıntılı Kişilik Profili raporu', () => {
  it('genel bakışta beş boyut; ardından boyut boyut alt özellikler', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(['Dışadönüklük', 'Uyumluluk', 'Sorumluluk', 'Duygusal Denge', 'Deneyime Açıklık']);
      expect(rows.every((x) => x.ciLow !== null && x.ciHigh !== null)).toBe(true);
      expect(rep.groups?.map((g) => g.facets.length)).toEqual([6, 6, 6, 6, 5]);
      expect(rep.groups?.[0].facets.map((f) => f.label)).toEqual(['Sıcakkanlılık', 'Kalabalık sevgisi', 'Liderlik', 'Tempo', 'Heyecan arayışı', 'Neşe']);
      for (const g of rep.groups!) {
        expect(g.text.length).toBeGreaterThan(50);
        for (const f of g.facets) {
          expect(f.text.length, f.label).toBeGreaterThan(40);
          expect(f.ciLow !== null && f.ciHigh !== null, f.label).toBe(true);
        }
      }
      expect(rep.groupsNote).toContain('dörder cümleyle');
      expect(rep.items).toEqual([]);
    }
    expect(r.parent.groups![0].text).toContain('Çocuğunuz');
    expect(r.student.groups![0].text).not.toContain('Çocuğunuz');
  });

  it('duygusal denge düşükse destek kutusu çıkar, yüksekse çıkmaz', () => {
    const low = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers: keyedAnswers((s) => (domainOf(s) === 'emotional_stability' ? 'low' : 'high')) } });
    expect(low.student.support?.title).toBe('Konuşmak istersen');
    expect(low.parent.support?.title).toBe('Destek almak isterseniz');
    const es = low.student.groups!.find((g) => g.title === 'Duygusal Denge')!;
    expect(es.badge).toBe('Düşük · Stresten kolay etkilenen');
    expect(es.facets.every((f) => f.band === 'Düşük')).toBe(true);

    const high = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers: keyedAnswers(() => 'high') } });
    expect(high.student.support).toBeNull();
    expect(high.student.groups!.every((g) => g.badge.startsWith('Yüksek'))).toBe(true);
  });

  it('bir boyutun alt özellikleri ayrışınca boyut kartı "Alt özellikleri ayrışan" metnini, yol haritası orta düzeyin önerisini gösterir (her boyutta, iki yönde)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const rm = ROADMAPS[SLUG];
    let n = 0;
    for (const dom of d.scales.filter((s) => s.of)) {
      const sp = t.facetSplit![dom.key];
      // Ayrışma metni boyutun bütün alt özelliklerini adıyla anar.
      for (const f of dom.of!) expect(sp.student, dom.key).toContain(d.scales.find((s) => s.key === f)!.name.toLocaleLowerCase('tr-TR'));
      // Boyut yüksek ama bir alt özelliği düşük; boyut düşük ama bir alt özelliği yüksek. Öteki boyutlar orta.
      for (const [rest, band] of [
        ['high', 'Yüksek'],
        ['low', 'Düşük'],
      ] as const) {
        const one = rest === 'high' ? 'low' : 'high';
        const answers = keyedAnswers((s) => (s === dom.of![0] ? one : dom.of!.includes(s) ? rest : 'mid'));
        const r = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers } });
        const adult = evaluateAdult(SLUG, { grade: ADULT_GRADE, data: { engine: 'likert', answers } }).adult;
        for (const rep of [r.student, r.parent, adult]) {
          const label = `${dom.key} ${rest} ${rep.audience}`;
          const g = rep.groups!.find((x) => x.title === dom.name)!;
          expect(g.facets.map((f) => f.band), label).toContain('Yüksek');
          expect(g.facets.map((f) => f.band), label).toContain('Düşük');
          expect(g.badge, label).toBe(`${band} · Alt özellikleri ayrışan`);
          expect(g.text, label).toBe(rep.audience === 'parent' ? sp.parent : rep.audience === 'adult' ? (sp.adult ?? sp.student) : sp.student);
          if (rep.audience === 'adult') expect(schoolWords(g.text), label).toEqual([]);
          // Yol haritası: ayrışan boyutun kartı orta düzeyin önerisidir (yüksek ya da düşük düzeyin önerisi bir alt
          // özelliğin kartıyla çelişirdi); ortamlar arasında da bu boyutun ortamı yoktur.
          const card = rep.roadmap!.study.items.find((x) => x.key === dom.key)!;
          const avg = rm.scales[dom.key].study.average;
          expect(card.badge, label).toBe(`${band} · Alt özellikleri ayrışan`);
          expect(card.text, label).toBe(rep.audience === 'parent' ? avg.parent : rep.audience === 'adult' ? (avg.adult ?? avg.student) : avg.student);
          const settings = rm.scales[dom.key].settings!;
          expect(rep.roadmap!.settings!.items, label).not.toContain(settings.high);
          expect(rep.roadmap!.settings!.items, label).not.toContain(settings.low);
          if (rep.audience === 'parent') {
            const tip = rep.roadmap!.approach!.items.find((x) => x.title === dom.name)!;
            expect(tip.text, label).toBe(rm.approach![dom.key].average);
            expect(tip.text, label).not.toContain('bu dengeyi');
          }
          // Destek kutusu: Duygusal Denge'de İç huzuru düşükse (boyut düşük, Sakinlik yüksek).
          expect(rep.support !== null, label).toBe(dom.key === 'emotional_stability' && rest === 'low');
          n++;
        }
      }
      // Biri yüksek, ötekiler orta: ayrışma sayılmaz; boyut kartı kendi düzeyinin metnini gösterir (beş alt özellikli
      // Deneyime Açıklık'ta boyut 3,4 ile yüksek, ötekilerde orta).
      const near = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers: keyedAnswers((s) => (s === dom.of![0] ? 'high' : 'mid')) } });
      const g = near.student.groups!.find((x) => x.title === dom.name)!;
      const level = g.badge.startsWith('Yüksek') ? 'high' : 'average';
      expect(level, dom.key).toBe(dom.of!.length === 5 ? 'high' : 'average');
      expect(g.badge, dom.key).toBe(`${level === 'high' ? 'Yüksek' : 'Orta'} · ${t.scales[dom.key][level]!.summary}`);
      expect(g.text, dom.key).toBe(t.scales[dom.key][level]!.student);
    }
    expect(n).toBe(5 * 2 * 3);
  });

  it('orta cevaplarda bütün ölçekler orta düzeyde', () => {
    const r = evaluate(SLUG, { grade: 12, data: { engine: 'likert', answers: keyedAnswers(() => 'mid') } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.every((x) => x.band === 'Orta' && x.value === 3)).toBe(true);
    expect(r.student.groups!.flatMap((g) => g.facets).every((f) => f.band === 'Orta')).toBe(true);
  });

  it('hoca onayladı: yayında, listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });
});
