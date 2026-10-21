import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
import { EMPATI_REMOVED } from '@/content/instruments/empati';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import type { SimpleReport } from '@/lib/reports/simple';
import { likertQuality, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'empati';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['understanding', 'affective', 'warmth'];
const NAMES = ['Başkalarını düşünme', 'Duygusal duyarlılık', 'Sıcaklık ve destek'];
const PREFIX: Record<string, string> = { understanding: 'und', affective: 'aff', warmth: 'war' };
const BANDS = ['low', 'average', 'high'] as const;
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in anahtar sayfaları: AB5C "Understanding" (II+/II+) ve "Warmth" (II+/I+) (https://ipip.ori.org/newAB5CKey.htm),
 * JPI-R "Empathy" (https://ipip.ori.org/newJPI-RKey.htm). Her ölçekte artı ve eksi yönlü maddeler, sayfadaki sırayla
 * (yazım yanlışları sayfadaki gibi), ve sayfadaki iç tutarlılık.
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number }> = {
  understanding: {
    plus: [
      "Sympathize with others' feelings.",
      "Respect others' feelings.",
      "Take others' interests into account.",
      'Like to be of service to others.',
      'Appreciate the viewpoints of others.',
    ],
    minus: [
      'Feel little concern for others.',
      "Am not interested in other people's problems.",
      'Am indifferent to the feelings of others.',
      'Take no time for others.',
      "Can't be bothered with other's needs.",
    ],
    alpha: 0.81,
  },
  affective: {
    plus: [
      "Feel others' emotions.",
      "Suffer from others' sorrows.",
      "Am deeply moved by others' misfortunes.",
      'Am easily moved to tears.',
      'Cry easily.',
      'Experience my emotions intensely.',
      'Feel spiritally connected to other people.',
    ],
    minus: ["Don't understand people who get emotional.", "Am not interested in other people's problems.", 'Seldom get emotional.'],
    alpha: 0.8,
  },
  warmth: {
    plus: [
      'Am interested in people.',
      'Make people feel at ease.',
      'Know how to comfort others.',
      "Inquire about others' well-being.",
      'Take time out for others.',
      'Make people feel welcome.',
      'Show my gratitude.',
      'Make others feel good.',
      "Feel others' emotions.",
    ],
    minus: ['Am not really interested in others.', 'Rarely smile.'],
    alpha: 0.84,
  },
};

/** Kaynaktaki bütün maddeler: anahtar → [ölçek, İngilizce metin, eksi yönlü mü]. */
const PAGE = new Map(
  Object.entries(KEY).flatMap(([scale, { plus, minus }]) =>
    [...plus.map((t) => [t, false] as const), ...minus.map((t) => [t, true] as const)].map(
      ([t, rev], i) => [`${PREFIX[scale]}${String(i + 1).padStart(2, '0')}`, [scale, t, rev] as const] as const,
    ),
  ),
);

/** Her maddeye, ölçeğine göre en yüksek (5), en düşük (1) ya da orta (3) puan verecek cevap. */
function keyedAnswers(level: (scale: string) => Level) {
  return Object.fromEntries(
    d.items.map((it) => {
      const l = level(it.scale);
      const v = l === 'mid' ? 3 : (l === 'high') !== !!it.reverse ? 5 : 1;
      return [it.key, { value: v, rtMs: 2600 }];
    }),
  );
}
const body = (level: (scale: string) => Level, grade = 10) => ({ grade, data: { engine: 'likert' as const, answers: keyedAnswers(level) } });

function roadmapTexts(rm: Roadmap): string[] {
  return [
    rm.intro,
    rm.standoutNote ?? '',
    rm.study.intro,
    ...rm.study.items.map((i) => i.text),
    ...(rm.settings ? [rm.settings.title, rm.settings.intro, ...rm.settings.items, rm.settings.note] : []),
    ...rm.weeks.map((w) => `${w.title} ${w.text}`),
    ...(rm.approach?.items.map((i) => i.text) ?? []),
  ].filter(Boolean);
}

/** Raporun "Birlikte bakınca" maddesi. */
const insightOf = (rep: SimpleReport) => rep.items.find((x) => x.title === 'Birlikte bakınca');

/** Bir metindeki dört sözcüklük söz öbekleri (noktalama atılarak, küçük harfle). */
function grams(text: string, n = 4): Set<string> {
  const w = text.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
}
const shared = (a: string, b: string) => [...grams(a)].filter((x) => grams(b).has(x));

/** Bir düzey birleşiminde (anlayış, duyarlılık, sıcaklık) uyan birlikte yorum kuralları. */
function firedRules(g: Record<string, string>) {
  const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
  return REPORT_TEMPLATES[SLUG].insight!.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
}
const COMBOS = BANDS.flatMap((a) => BANDS.flatMap((b) => BANDS.map((c) => ({ understanding: a, affective: b, warmth: c }) as Record<string, (typeof BANDS)[number]>)));

describe('Empati tanımı', () => {
  it('29 madde, üç ayrı ölçek (10, 9, 10); toplam puan ve bileşik ölçek yok', () => {
    expect(d.items).toHaveLength(29);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s).length)).toEqual([10, 9, 10]);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(29);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(29);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
      // Açık veriye ulaşılamadığı için standart sapma yok: ölçüm payı gösterilmez.
      expect(s.alpha, s.key).toBeUndefined();
      expect(s.sdRef, s.key).toBeUndefined();
    }
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain]).toEqual(['active', 'public_domain', 9, 13, true, 'personality']);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; iki ölçekte birden olan iki madde yalnızca bir kez sorulur', () => {
    expect(PAGE.size).toBe(31);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.scale, it.key).toBe(page![0]);
      expect(it.source, it.key).toBe(page![1]);
      expect(!!it.reverse, it.key).toBe(page![2]);
    }
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual(EMPATI_REMOVED);
    // Çıkarılan her madde başka bir ölçekte aynı yönle sorulur.
    for (const k of EMPATI_REMOVED) {
      const [, text, rev] = PAGE.get(k)!;
      const asked = d.items.filter((i) => i.source === text);
      expect(asked, k).toHaveLength(1);
      expect(!!asked[0].reverse, k).toBe(rev);
    }
    expect(PAGE.get('aff09')![1]).toBe(PAGE.get('und07')![1]);
    expect(PAGE.get('war09')![1]).toBe(PAGE.get('aff01')![1]);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(9);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s && i.reverse).length)).toEqual([5, 2, 2]);
  });

  it('din, siyaset ya da görüş soran madde yok; "spiritually" dinî bir sözcükle çevrilmez', () => {
    expect(d.items.some((i) => /homeless|poor|unemployed|criminal|eye for an eye|religio|politic/i.test(i.source ?? ''))).toBe(false);
    const sensitive = /(?<!\p{L})(ruh\p{L}*|manevi|maneviyat\p{L}*|din|dinî|dini|inanç\p{L}*|dua\p{L}*|şükr\p{L}*|şükür|siyas\p{L}*|evsiz\p{L}*|yoksul\p{L}*|suçlu\p{L}*)(?!\p{L})/iu;
    for (const it of d.items) expect(sensitive.test(it.text), it.text).toBe(false);
    expect(d.items.find((i) => i.key === 'aff07')!.text).toBe('Diğer insanlarla aramda derin bir bağ hissederim.');
  });

  it('uygulama sırası: üç ölçek sırayla döner; benzer ve karşıt maddeler birbirinden uzak', () => {
    const scales = d.items.map((i) => i.scale);
    for (let i = 1; i < scales.length; i++) expect(scales[i], d.items[i].key).not.toBe(scales[i - 1]);
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('war05', 'und09', 20); // zaman ayırırım / ayırmam
    far('war01', 'war10', 12); // ilgi duyarım / pek ilgi duymam
    far('aff10', 'war11', 12); // iki "Nadiren" maddesi
    far('aff04', 'aff05', 15); // gözlerim dolar / kolay ağlarım
    far('aff02', 'aff03', 15); // iki "başkalarının acısı" maddesi
    far('und06', 'und07', 15); // iki "beni ilgilendirmez" maddesi
    far('war02', 'war08', 20); // iki "hissetmesini sağlarım" maddesi
    far('aff01', 'und08', 12); // iki "ne hissettiği" maddesi
    far('und01', 'und02', 12); // iki "başkalarının duyguları" maddesi
    far('und04', 'und10', 12); // yardımcı olmayı severim / ihtiyaçlarıyla uğraşmak istemem
    far('aff06', 'aff10', 10); // duygularımı yoğun yaşarım / nadiren duygulanırım
    far('und07', 'war10', 10);
    // İlk madde yumuşak bir başlangıçtır.
    expect(d.items[0].key).toBe('war01');
    expect(d.items[0].reverse).toBeUndefined();
  });

  it('öteki testlerdeki aynı maddelerle aynı çeviri (19 madde); örtüşme sayıları bilim kartındakiyle aynı', () => {
    const others = INSTRUMENTS.filter((x) => x.slug !== SLUG && x.engine === 'likert') as LikertInstrument[];
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let n = 0;
    for (const it of d.items) {
      // Çocuk Kişilik Profili'nin çevirileri çocuklara göre yazılmıştır.
      const same = others.filter((o) => o.slug !== 'cocuk-kisilik-profili').flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      n++;
      expect(same.map((x) => x.text), it.source).toContain(it.text);
    }
    expect(n).toBe(19);
    const count = (slug: string) => {
      const o = others.find((x) => x.slug === slug)!;
      return d.items.filter((it) => o.items.some((x) => norm(x.source) === norm(it.source))).length;
    };
    expect(count('bes-faktor-kisilik')).toBe(8);
    expect(count('kisiligin-10-yonu')).toBe(7);
    expect(count('ayrintili-kisilik-profili')).toBe(6);
    expect(count('duygusal-zeka-bilesenleri')).toBe(4);
    const lim = d.science.limitations.join(' ');
    expect(lim).toContain('29 cümleden 19’u');
    expect(lim).toContain('sekizi Beş Faktör Kişilik Profili’nde, yedisi Kişiliğin 10 Yönü’nde, altısı Ayrıntılı Kişilik Profili’nde, dördü Duygusal Zekâ Bileşenleri’nde');
    for (const slug of ['bes-faktor-kisilik', 'kisiligin-10-yonu', 'ayrintili-kisilik-profili', 'duygusal-zeka-bilesenleri']) {
      expect(lim, slug).toContain(others.find((x) => x.slug === slug)!.name);
    }
    expect(d.science.turkishVersion).toContain('19 maddenin');
  });

  it('birbirinin tersini söyleyen beş çift: biri düz biri ters; çoğuna aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(5);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.reverse, x).toBeUndefined();
      expect(b.reverse, y).toBe(true);
    }
    // Dördü aynı ölçekte; beşincisi ("zaman ayırırım" / "zaman ayırmam") iki ölçekte ama birbirinin tam tersi.
    const sameScale = d.oppositePairs!.filter(([x, y]) => d.items.find((i) => i.key === x)!.scale === d.items.find((i) => i.key === y)!.scale);
    expect(sameScale).toHaveLength(4);
    expect(d.oppositePairs).toContainEqual(['war05', 'und09']);
    const keys = d.oppositePairs!.flat();
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    const q = likertQuality(d, answers);
    expect(q.oppositeAgree).toBe(5);
    expect(q.notes.some((x) => x.includes('Birbirinin tersini söyleyen 5 cümle çiftinden 5 tanesinde'))).toBe(true);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(d, keyedAnswers(() => level));
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'affective' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('affective')!.mean).toBe(5);
    expect(byKey.get('understanding')!.mean).toBe(1);
    expect(byKey.get('warmth')!.mean).toBe(1);
    expect(byKey.get('affective')!.nItems).toBe(9);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde anılıyor; öz bildirim sınırı, yaş notu ve sınırlılıklar', () => {
    const s = d.science;
    expect(JSON.stringify(s)).not.toMatch(/YAZILACAK/);
    expect(s.citations.length).toBeGreaterThanOrEqual(18);
    // Kitap ve katalog dışında her künyenin açık bir bağlantısı vardır.
    for (const c of s.citations) {
      if (/^(Jackson|Davis, M\. H\. \(1980\))/.test(c.text)) expect(c.url, c.text).toBeUndefined();
      else expect(c.url, c.text).toMatch(/^https:\/\//);
    }
    const card = JSON.stringify({ ...s, citations: [] });
    for (const a of [
      'Hofstee ve ark., 1992',
      'Jackson, 1994',
      'Davis, 1983',
      'Davis (1980, 1983)',
      'Jolliffe ve Farrington, 2006',
      'Murphy ve Lilienfeld, 2019',
      'Yin ve Wang, 2023',
      'Van der Graaff ve ark., 2018',
      'Van der Graaff ve ark., 2014',
      'Teding van Berkhout ve Malouff, 2016',
      'Engeler ve Yargıç, 2007',
      'Topçu ve ark., 2010',
      'Totan ve ark., 2012',
    ]) {
      expect(card, a).toContain(a);
    }
    expect(card).toContain('yayıncının örnek raporu');
    for (const c of s.citations.filter((c) => !/^(IPIP|Goldberg|Sigma)/.test(c.text))) {
      const author = c.text.split(',')[0];
      expect(card, author).toContain(author);
    }
    expect(s.whatItMeasures).toContain('toplam bir puan hesaplanmaz');
    expect(s.whatItMeasures).toContain('doğru tahmin etme becerisini sınamaz');
    expect(s.basedOn).toContain('31 maddeden ikisi');
    expect(s.reliability).toContain('.83');
    expect(s.reliability).toContain('.79');
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    const lim = s.limitations.join(' ');
    expect(lim).toContain('ne kadar doğru anladığını ölçmez');
    expect(lim).toContain('Tanı koymaz');
    expect(lim).toContain('“doğru” deme eğilimi');
    // Sitedeki Bakış Açısı Alma testiyle karıştırılmasın.
    expect(lim).toContain('Bakış Açısı Alma');
    expect(INSTRUMENTS.find((x) => x.slug === 'bakis-acisi-alma')?.name).toBe('Bakış Açısı Alma');
  });

  it('beklenen güvenirlik hesapları kaynaktaki değerlerden doğru', () => {
    const sb = (r: number, k: number) => (k * r) / (1 + (k - 1) * r);
    expect(sb(0.33, 10)).toBeCloseTo(0.83, 2);
    // JPI-R tablosundaki ortalama madde ilişkisi .29 (α .80 ile de .286 çıkar).
    expect(KEY.affective.alpha / (10 - 9 * KEY.affective.alpha)).toBeCloseTo(0.29, 2);
    expect(sb(0.29, 9)).toBeCloseTo(0.79, 2);
  });

  it('hep aynı cevap ve çok hızlı cevap kalite notu verir', () => {
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).straightLining).toBe(true);
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
  });
});

describe('Empati raporu', () => {
  it('genel bakışta üç yön; ilk madde "Birlikte bakınca", ardından her yön', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.items.map((x) => x.title)).toEqual(['Birlikte bakınca', ...NAMES]);
      expect(rep.support).toBeNull();
    }
    expect(r.parent.items[1].text).toContain('Çocuğunuz');
    expect(r.student.items[1].text).not.toContain('Çocuğunuz');
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni yazılmış; dil kuralları', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t.evaluative).toBeUndefined();
    expect(Object.keys(t.scales).sort()).toEqual([...SCALES].sort());
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    for (const s of SCALES) {
      const summaries = new Set<string>();
      for (const band of BANDS) {
        const label = `${s}/${band}`;
        const bt = t.scales[s][band]!;
        summaries.add(bt.summary);
        expect(bt.summary, label).not.toBe(t.bandLabels[band]);
        expect(bt.student.length, label).toBeGreaterThan(80);
        expect(bt.student, label).toContain('söylüyorsun');
        expect(bt.parent, label).toMatch(/^Çocuğunuz /);
        expect(bt.parent, label).toContain('belirtiyor');
        expect(bt.student, label).not.toMatch(/[Çç]ocuğunuz/);
        expect(`${bt.student} ${bt.parent}`, label).not.toMatch(/bencil|duygusuz|soğuk|umursamaz|vurdumduymaz|psikopat|narsis|otizm|otistik|bozukluk|hastalık|empatisiz|kusurlu/i);
        expect(bt.support, label).toBeUndefined();
        expect(bt.adult, label).toBeUndefined();
        expect(schoolWords(bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
      }
      expect(summaries.size, s).toBe(3);
    }
    // Zaman ayırma ve ilgi iki ölçekte zıt yönde sorulur: düşük ve orta düzey metinleri bunlardan söz etmez (öteki ölçeğin
    // yüksek kartıyla çelişmesin). Başkalarını düşünmenin düşük ve orta metni duygulardan ve sorunlardan da söz etmez
    // (duygusal duyarlılığın yüksek kartı "derdiyle dertlenme" der).
    for (const s of ['understanding', 'warmth']) {
      for (const band of ['low', 'average'] as const) {
        const bt = t.scales[s][band]!;
        expect(`${bt.student} ${bt.parent}`, `${s}/${band}`).not.toMatch(/zaman ayır|ilgi/i);
        if (s === 'understanding') expect(`${bt.student} ${bt.parent}`, `${s}/${band}`).not.toMatch(/duygu|sorun|dert/i);
      }
    }
    // Düşük düzeyler kişiyi yargılamaz.
    expect(t.scales.understanding.low!.student).toContain('bir yargı değildir');
    expect(t.scales.affective.low!.student).toContain('önemsemediğin anlamına gelmez');
    expect(t.scales.warmth.low!.student).toContain('değer vermediğin anlamına gelmez');
    // Genel bakış: beceri notu değil, kendini nasıl gördüğü.
    expect(t.overview!.student).toContain('ne kadar doğru anladığını değil');
  });

  it('her ölçeğin her düzeyi tek tek: kart, rozet ve yol haritası tutarlı (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    let n = 0;
    for (const s of SCALES) {
      for (const band of BANDS) {
        const b = body((x) => (x === s ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        const bt = t.scales[s][band]!;
        const label = `${s}/${band}`;
        for (const [rep, text] of [
          [r.student, bt.student],
          [r.parent, bt.parent],
          [adult, bt.student],
        ] as const) {
          const item = rep.items[1 + SCALES.indexOf(s)];
          expect(item.text, label).toBe(text);
          expect(item.badge, label).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
          expect(rep.support, label).toBeNull();
          const rm = rep.roadmap!;
          expect(rm.bars.map((x) => x.label), label).toEqual(NAMES);
          expect(rm.study.items.map((x) => x.key), label).toEqual(SCALES);
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Dinle ve anla');
          expect(rm.weeks, label).toHaveLength(4);
          expect(rm.study.links.map((l) => l.href), label).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
          expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 3 : 0);
          for (const x of roadmapTexts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
            if (rep.audience === 'adult') expect(schoolWords(x), `${label}: ${x}`).toEqual([]);
          }
          n++;
        }
      }
    }
    expect(n).toBe(3 * 3 * 3);
  }, 120_000);

  it('Birlikte bakınca: giriş her raporda; her kural yalnızca kendi birleşiminde; 3³ birleşimin hepsinde metin tutarlı', () => {
    const t = REPORT_TEMPLATES[SLUG].insight!;
    const lead = t.lead[0].text;
    let n = 0;
    for (const g of COMBOS) {
      const b = body((x) => LEVEL[g[x]]);
      const r = evaluate(SLUG, b);
      const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
      const rules = firedRules(g);
      for (const [rep, who] of [
        [r.student, 'student'],
        [r.parent, 'parent'],
        [adult, 'adult'],
      ] as const) {
        const label = `${g.understanding}/${g.affective}/${g.warmth} ${who}`;
        const pick = (x: { student: string; parent: string; adult?: string }) =>
          who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student;
        const extra = rules.length ? rules.map((x) => pick(x.text)) : t.fallback ? [pick(t.fallback)] : [];
        expect(insightOf(rep)!.text, label).toBe([pick(lead), ...extra].join('\n\n'));
        if (who !== 'parent') expect(insightOf(rep)!.text, label).not.toMatch(/[Çç]ocuğunuz/);
        if (who === 'adult') expect(schoolWords(insightOf(rep)!.text), label).toEqual([]);
        n++;
      }
    }
    expect(n).toBe(27 * 3);
    // Aynı raporda çıkan kurallar aynı fikri tekrar etmez ve her birleşimde en çok iki kural çıkar.
    for (const g of COMBOS) {
      const on = firedRules(g).map((x) => x.text.student);
      expect(on.length, JSON.stringify(g)).toBeLessThanOrEqual(2);
      for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) expect(shared(on[i], on[j]), JSON.stringify(g)).toEqual([]);
    }
    // Her kural en az bir birleşimde uyar.
    for (const x of t.rules) expect(COMBOS.some((g) => firedRules(g).includes(x)), x.text.student.slice(0, 40)).toBe(true);
    // Kurallar kartlarla çelişmez: bir kural bir ölçeği "yüksek" ya da "düşük" diye anıyorsa o ölçek o düzeydedir.
    const mentions: [RegExp, string, string][] = [
      [/“Sıcaklık ve destek” yönünde ise puanın düşük|ve “Sıcaklık ve destek” yönlerinde ise puanın düşük/, 'warmth', 'low'],
      [/“Başkalarını düşünme” yönünde ise puanın düşük/, 'understanding', 'low'],
      [/“Duygusal duyarlılık”( yönünde| ve “Sıcaklık ve destek” yönlerinde) ise puanın düşük/, 'affective', 'low'],
      [/duygularından derinden etkilendiğini/, 'affective', 'high'],
      [/^Başkalarını önemsediğini|saygı gösterdiğini söylüyorsun/, 'understanding', 'high'],
      [/^İnsanlara sıcak/, 'warmth', 'high'],
    ];
    for (const g of COMBOS) {
      for (const x of firedRules(g)) {
        for (const [re, scale, band] of mentions) if (re.test(x.text.student)) expect(g[scale], `${JSON.stringify(g)} ${re}`).toBe(band);
      }
    }
    // Bir yön yüksek, öteki düşükken birlikte yorumda en az bir kural çıkar ("dikkat çeken bir birleşim yok" denmez).
    for (const g of COMBOS) {
      const v = Object.values(g);
      if (v.includes('high') && v.includes('low')) expect(firedRules(g).length, JSON.stringify(g)).toBeGreaterThan(0);
    }
    // Üç yön yüksekken başarı notu, üçü düşükken eksiklik gibi anlatılmaz; bir sonuç vaat edilmez.
    for (const x of [t.rules[0], t.rules[t.rules.length - 1]]) {
      expect(`${x.text.student} ${x.text.parent}`).not.toMatch(/güç|başarı|eksik(?!lik gibi değil)|geliştirilebilen|beceri/i);
    }
    // Girişteki öz değerlendirme uyarısı her kişiye; gençlerle yapılan çalışma yetişkine anılmaz.
    for (const x of [lead.student, lead.parent, lead.adult!]) {
      expect(x).toContain('ne kadar doğru tahmin ettiği arasındaki ilişki ise çok zayıftır');
      expect(x).toContain('Bu testin üç yönü bu ikisiyle birebir örtüşmez');
    }
    expect(lead.adult).toBeDefined();
    expect(lead.adult).not.toMatch(/13 ile 18|genç/);
  }, 120_000);

  it('uç ve orta cevaplar: bütün yönler aynı düzeyde', () => {
    for (const [level, label] of [
      ['high', 'Yüksek'],
      ['low', 'Düşük'],
      ['mid', 'Orta'],
    ] as const) {
      const r = evaluate(SLUG, body(() => level, 12));
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(rows.every((x) => x.band === label), level).toBe(true);
    }
  });

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const level of ['high', 'low', 'mid'] as const) {
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(rest)), level).toEqual([]);
      expect(roadmap?.approach, level).toBeNull();
    }
    expect(schoolWords([d.intro.title, ...d.intro.paragraphs, d.prompt ?? ''].join(' '))).toEqual([]);
    for (const it of d.items) expect(schoolWords(it.text), it.key).toEqual([]);
  });

  it('PDF öğrenci, veli ve yetişkin için üretilir', async () => {
    const b = likertBody(SLUG, 11, (i) => (i * 7) % 5);
    const r = evaluate(SLUG, b);
    const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);
});

describe('Empati gelişim yol haritası', () => {
  it('üç sütun, üç ayrı renk; ortamlar var; kaynaklar doğrulanmış', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(3);
    expect(t.planningScale).toBe('understanding');
    expect(t.sources.every((s) => s.url?.startsWith('https://doi.org/'))).toBe(true);
    // Yol haritasındaki empati eğitimi kaynağı bilim kartındakiyle aynı künyedir.
    for (const s of t.sources.filter((x) => x.text.startsWith('Teding'))) expect(d.science.citations).toContainEqual(s);
  });

  it('rapor kartı, öneri kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar etmez (dört sözcüklük söz öbekleri)', () => {
    const t = ROADMAPS[SLUG];
    const tpl = REPORT_TEMPLATES[SLUG];
    for (const [key, sc] of Object.entries(t.scales)) {
      for (const g of BANDS) {
        const parts: [string, string][] = [
          ['rapor-öğrenci', tpl.scales[key][g]!.student],
          ['rapor-veli', tpl.scales[key][g]!.parent],
          ['öneri-öğrenci', sc.study[g].student],
          ['öneri-veli', sc.study[g].parent],
          ['dene-öğrenci', sc.action[g].student],
          ['dene-veli', sc.action[g].parent],
          ['yaklaşım', t.approach![key][g]],
        ];
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            const [ni, ti] = parts[i];
            const [nj, tj] = parts[j];
            // Aynı bölümün öğrenci ve veli metni birbirinin karşılığıdır; öteki bütün çiftler ortak söz öbeği içermez.
            if (ni.split('-')[0] === nj.split('-')[0]) continue;
            expect(shared(ti, tj), `${key}/${g} ${ni} – ${nj}`).toEqual([]);
          }
        }
      }
    }
    // Veliye yaklaşım önerileri birbirini tekrar etmez.
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect(shared(tips[i], tips[j]), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('öneriler kimseyi zorlamaz ve yargılamaz; yüksek düzeyde kendini gözetmek hatırlatılır', () => {
    const t = ROADMAPS[SLUG];
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of [...all, ...Object.values(t.approach!).flatMap((y) => Object.values(y))]) {
      expect(x, x).not.toMatch(/bencil|duygusuz|soğuk|zorla(?!mayın)|mecbur|ceza/i);
    }
    expect(t.approach!.understanding.high).toContain('“evet” demek zorunda olmadığını');
    expect(t.approach!.warmth.low).toContain('zorlamayın');
    expect(t.scales.affective.action.high.student).toContain('duygunu bir sözcükle adlandır');
  });

  it('son haftada öteki testler önerilir; önerilen testler yetişkinlere de açık', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('başkalarıyla ilişkilerini ve duygularını başka yönlerden de görmek');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('Kişiliğin 10 Yönü ve Duygusal Zekâ Bileşenleri');
    for (const slug of ROADMAPS[SLUG].nextTests) expect(INSTRUMENTS.find((x) => x.slug === slug)?.adults, slug).toBe(true);
  });
});

describe('Empati yayında', () => {
  it('listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /EMP_GOVDE=.*?n=(\{[^}]*\})/.exec(yml);
    expect(m).not.toBeNull();
    const n = JSON.parse(m![1]) as Record<string, number>;
    const keys = Object.entries(n)
      .flatMap(([k, c]) => Array.from({ length: c }, (_, i) => `${k}${String(i + 1).padStart(2, '0')}`))
      .filter((k) => !EMPATI_REMOVED.includes(k));
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
    expect(yml).toContain('"Dinle ve anla"');
  });
});
