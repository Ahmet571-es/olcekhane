import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
import { HEYECAN_REMOVED } from '@/content/instruments/heyecan-arayisi';
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

const SLUG = 'heyecan-arayisi';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['danger', 'impulsive', 'venture'];
const NAMES = ['Tehlikeli heyecanlara ilgi', 'Anlık heyecan arayışı', 'Göze alma ve keşif'];
const PREFIX: Record<string, string> = { danger: 'dan', impulsive: 'imp', venture: 'cal' };
const BANDS = ['low', 'average', 'high'] as const;
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in anahtar sayfası (https://ipip.ori.org/newSingleConstructsKey.htm, "Sensation-seeking facets"): her ölçekte artı
 * ve eksi yönlü maddeler, sayfadaki sırayla, ve sayfadaki iç tutarlılık.
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number }> = {
  danger: {
    plus: [
      'Love dangerous situations.',
      'Like to do frightening things.',
      'Might actually enjoy being caught in an earthquake or tornado.',
      'Would like to try bungee jumping.',
      'Might enjoy the thrill of being lost at sea.',
      'Might enjoy a free fall from an airplane.',
      'Would enjoy being out on a sailboat during a storm.',
      'Prefer fear to boredom.',
    ],
    minus: ['Would fear walking in a high-crime part of a city.', 'Would never go hang gliding or bungee jumping.'],
    alpha: 0.86,
  },
  impulsive: {
    plus: [
      'Do crazy things.',
      'Act wild and crazy.',
      'Do unexpected things.',
      'Like to act on a whim.',
      'Am easily talked into doing silly things.',
      'Am unpredictable, people never know what I am going to say.',
      'Enjoy wild flights of fantasy.',
      'Have persuaded others to do something really adventurous or crazy.',
      'Seek adventure.',
      'Take risks.',
    ],
    minus: [],
    alpha: 0.84,
  },
  venture: {
    plus: [
      'Face danger confidently.',
      'Am willing to take risks.',
      'Would be good at rescuing people from a burning building.',
      'Would love to explore strange places.',
      'Am open to new experiences.',
    ],
    minus: [
      'Am a physical coward.',
      'Would never go riding down a stretch of rapids in a canoe.',
      'Try to stay inside when the weather is bad.',
      'Am afraid of heights.',
      'Am afraid of large dogs.',
    ],
    alpha: 0.78,
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

describe('Heyecan Arayışı tanımı', () => {
  it('29 madde, üç ayrı ölçek (9, 10, 10); toplam puan ve bileşik ölçek yok', () => {
    expect(d.items).toHaveLength(29);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s).length)).toEqual([9, 10, 10]);
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
    expect(d.oppositePairs).toBeUndefined();
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; kaynaktan yalnızca deprem maddesi eksik', () => {
    expect(PAGE.size).toBe(30);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.scale, it.key).toBe(page![0]);
      expect(it.source, it.key).toBe(page![1]);
      expect(!!it.reverse, it.key).toBe(page![2]);
    }
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual(HEYECAN_REMOVED);
    expect(PAGE.get('dan03')![1]).toMatch(/earthquake/);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(7);
    expect(d.items.filter((i) => i.scale === 'impulsive' && i.reverse)).toHaveLength(0);
  });

  it('deprem, din, siyaset ya da yasa dışı davranış soran madde yok', () => {
    expect(d.items.some((i) => /earthquake|religio|vote|politic|drug|alcohol|illegal|law/i.test(i.source ?? ''))).toBe(false);
    const sensitive = /(?<!\p{L})(deprem\p{L}*|din|dinî|dini|inanç\p{L}*|oy|seçim|parti|siyas\p{L}*|yasa\p{L}*|alkol\p{L}*|uyuşturucu\p{L}*|sigara\p{L}*)(?!\p{L})/iu;
    for (const it of d.items) expect(sensitive.test(it.text), it.text).toBe(false);
  });

  it('uygulama sırası: üç ölçek sırayla döner; benzer maddeler birbirinden uzak', () => {
    const scales = d.items.map((i) => i.scale);
    for (let i = 1; i < scales.length; i++) expect(scales[i], d.items[i].key).not.toBe(scales[i - 1]);
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('imp01', 'imp02', 15); // iki "çılgınca" maddesi
    far('dan04', 'dan10', 12); // iki bungee jumping maddesi
    far('cal02', 'imp10', 12); // iki risk maddesi
    far('dan10', 'cal07', 10); // iki "asla" maddesi
    far('dan01', 'dan02', 10); // tehlike ve korku sevgisi
    far('cal09', 'cal10', 6); // yükseklik ve köpek korkusu
    // İlk madde yumuşak bir başlangıçtır.
    expect(d.items[0].key).toBe('imp03');
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri (15 madde; biri sonradan Öz-denetim testine girdi)', () => {
    const others = INSTRUMENTS.filter((x) => x.slug !== SLUG && x.engine === 'likert' && x.domain === 'personality') as LikertInstrument[];
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      expect(same.map((x) => x.text), it.source).toContain(it.text);
    }
    expect(shared).toBe(15);
    // Aynı ölçekteki iki "çılgınca" maddesi ve iki risk maddesi birbirinden farklı çevrilir.
    const text = (k: string) => d.items.find((i) => i.key === k)!.text;
    expect(text('imp02')).toBe('Çılgınca şeyler yaparım.');
    expect(text('imp01')).toBe('Çılgınlıklar yaparım.');
    expect(text('imp10')).toBe('Risk alırım.');
    expect(text('cal02')).toBe('Risk almaya istekliyim.');
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'venture' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('venture')!.mean).toBe(5);
    expect(byKey.get('danger')!.mean).toBe(1);
    expect(byKey.get('danger')!.nItems).toBe(9);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde anılıyor; yaş notu ve sınırlılıklar', () => {
    const s = d.science;
    const all = JSON.stringify(s);
    expect(all).not.toMatch(/YAZILACAK/);
    expect(s.citations).toHaveLength(14);
    // Zuckerman'ın kitabı dışında her künyenin açık bir bağlantısı vardır.
    for (const c of s.citations) {
      if (c.text.startsWith('Zuckerman')) expect(c.url).toBeUndefined();
      else expect(c.url, c.text).toMatch(/^https:\/\/(doi\.org\/|ipip\.ori\.org\/)/);
    }
    const body = JSON.stringify({ ...s, citations: [] });
    for (const a of [
      'Hoyle ve arkadaşlarının (2002)',
      'Zuckerman, 1994',
      'Steinberg ve ark., 2008',
      'Steinberg ve ark., 2018',
      'Maples-Keller ve ark., 2016',
      'Woodman ve ark., 2013',
      'Duell ve Steinberg, 2020',
      'Gardner ve Steinberg, 2005',
      'Çelik, 2015',
      'Stephenson ve ark., 2003',
      'Yıldırım ve ark., 2021',
    ]) {
      expect(body, a).toContain(a);
    }
    for (const c of s.citations.filter((c) => !c.text.startsWith('IPIP') && !c.text.startsWith('Goldberg'))) {
      const author = c.text.split(',')[0];
      expect(body, author).toContain(author);
    }
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    expect(s.whatItMeasures).toContain('toplam bir puan hesaplanmaz');
    const lim = s.limitations.join(' ');
    expect(lim).toContain('riskli bir davranışta bulunup bulunmayacağını öngörmez');
    expect(lim).toContain('Tanı koymaz');
    expect(lim).toContain('“doğru” deme eğilimi');
    // Örtüşme notundaki sayılar sitedeki testlerle aynı (14 ortak madde; dokuzu Altı Boyutlu'da).
    expect(lim).toContain('29 cümleden 15’i');
    const alti = def<LikertInstrument>('alti-boyutlu-kisilik-profili');
    const norm = (x?: string) => (x ?? '').replace(/[.]$/, '');
    expect(d.items.filter((it) => alti.items.some((a) => norm(a.source) === norm(it.source)))).toHaveLength(9);
  });

  it('hep aynı cevap ve çok hızlı cevap kalite notu verir', () => {
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).straightLining).toBe(true);
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
  });
});

describe('Heyecan Arayışı raporu', () => {
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
        expect(`${bt.student} ${bt.parent}`, label).not.toMatch(/korkak|cesaretsiz|sorunlu|tehlikeli biri|bozukluk|hastalık|dürtü kontrol|DEHB|bağımlı/i);
        expect(bt.support, label).toBeUndefined();
        expect(bt.adult, label).toBeUndefined();
        expect(schoolWords(bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
      }
      expect(summaries.size, s).toBe(3);
    }
    // "Risk" iki ölçekte sorulduğu için düşük ve orta düzey metinleri riskten söz etmez (öteki ölçeğin yüksek kartıyla çelişmesin).
    for (const s of SCALES) {
      for (const band of ['low', 'average'] as const) {
        const bt = t.scales[s][band]!;
        expect(`${bt.student} ${bt.parent}`, `${s}/${band}`).not.toMatch(/risk/i);
      }
    }
    // Tehlikeli heyecanlara ilgi yüksekken güvenlik vurgusu her kişiye vardır.
    expect(t.scales.danger.high!.student).toMatch(/gözetim/);
    expect(t.scales.danger.high!.parent).toMatch(/gözetim/);
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
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Plan ve anlık kararlar');
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
    const groupOf = { low: 'low', average: 'average', high: 'high' } as const;
    for (const a of BANDS) {
      for (const b of BANDS) {
        for (const c of BANDS) {
          const g: Record<string, (typeof BANDS)[number]> = { danger: a, impulsive: b, venture: c };
          const r = evaluate(SLUG, body((x) => LEVEL[g[x]]));
          const adult = evaluateAdult(SLUG, { ...body((x) => LEVEL[g[x]]), grade: ADULT_GRADE }).adult;
          const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(groupOf[g[k]]));
          const rules = t.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
          for (const [rep, who] of [
            [r.student, 'student'],
            [r.parent, 'parent'],
            [adult, 'adult'],
          ] as const) {
            const label = `${a}/${b}/${c} ${who}`;
            const pick = (x: { student: string; parent: string; adult?: string }) =>
              who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student;
            const extra = rules.length ? rules.map((x) => pick(x.text)) : t.fallback ? [pick(t.fallback)] : [];
            expect(insightOf(rep)!.text, label).toBe([pick(lead), ...extra].join('\n\n'));
            if (who !== 'parent') expect(insightOf(rep)!.text, label).not.toMatch(/[Çç]ocuğunuz/);
            if (who === 'adult') expect(schoolWords(insightOf(rep)!.text), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(27 * 3);
    // Aynı karşıtlığı ("ama tehlikeli heyecanlara ilgin yüksek değil") anlatan iki kural aynı raporda birlikte çıkmaz.
    for (const a of BANDS)
      for (const b of BANDS)
        for (const c of BANDS) {
          const g: Record<string, string> = { danger: a, impulsive: b, venture: c };
          const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
          const on = t.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not))).map((x) => x.text.student);
          const lowDanger = on.filter((x) => /tehlike içeren deneyimler(in)? sana pek çekici|tehlikeli heyecanlara ilgin yüksek değil/.test(x));
          expect(lowDanger.length, `${a}/${b}/${c}`).toBeLessThanOrEqual(1);
        }
    // Her kural en az bir birleşimde uyar.
    for (const x of t.rules) {
      const any = (['low', 'average', 'high'] as const).some((a) =>
        (['low', 'average', 'high'] as const).some((b) =>
          (['low', 'average', 'high'] as const).some((c) => {
            const g: Record<string, string> = { danger: a, impulsive: b, venture: c };
            const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
            return fits(x.when) && !(x.not && fits(x.not));
          }),
        ),
      );
      expect(any, x.text.student.slice(0, 40)).toBe(true);
    }
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

describe('Heyecan Arayışı gelişim yol haritası', () => {
  it('üç sütun, üç ayrı renk; ortamlar var; kaynaklar doğrulanmış', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(3);
    expect(t.planningScale).toBe('impulsive');
    expect(t.sources.every((s) => s.url?.startsWith('https://doi.org/'))).toBe(true);
    // Giriş sade: "… kullanmanın sana kolay geleceği konusunda ipucu verebilir" gibi dolambaçlı bir cümle yok.
    expect(t.studyIntro.student).toContain('Heyecan arayışın, bu yöntemlere nereden başlayacağını seçmene yardım edebilir.');
    expect(t.studyIntro.parent).toContain('Çocuğunuzun heyecan arayışı, bu yöntemlere nereden başlayacağını seçmesine yardım edebilir.');
    for (const x of Object.values(t.studyIntro)) expect(x).not.toMatch(/ipucu|kolay geleceğ/);
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
            const common = [...grams(ti)].filter((x) => grams(tj).has(x));
            expect(common, `${key}/${g} ${ni} – ${nj}`).toEqual([]);
          }
        }
      }
    }
    // Veliye yaklaşım önerileri birbirini tekrar etmez.
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect([...grams(tips[i])].filter((x) => grams(tips[j]).has(x)), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('riskli davranış özendirilmez: tehlikeli bir etkinlik "yap" diye önerilmez', () => {
    const t = ROADMAPS[SLUG];
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of all) expect(x, x).not.toMatch(/bungee|paraşüt|yelkenli|fırtına|rafting|kano/i);
  });

  it('son haftada öteki kişilik testleri önerilir; önerilen testler yetişkinlere de açık', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('Bir sonraki adım olarak kişiliğinin öteki yönlerini de görmek için');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('Ayrıntılı Kişilik Profili ve Kişiliğin 10 Yönü');
    for (const slug of ROADMAPS[SLUG].nextTests) expect(INSTRUMENTS.find((x) => x.slug === slug)?.adults, slug).toBe(true);
  });

  it('güvenlik: yüksek tehlike ilgisi yaş sınırı ve eğitmen gözetimiyle anlatılır; keşif önerileri güvenli yerlerle sınırlı', () => {
    const rep = REPORT_TEMPLATES[SLUG];
    for (const x of [rep.scales.danger.high!.student, rep.scales.danger.high!.parent]) {
      expect(x).toContain('yaş sınırı');
      expect(x).toContain('eğitmen gözetiminde');
      expect(x).not.toMatch(/fırtına/);
    }
    const t = ROADMAPS[SLUG];
    expect(t.scales.venture.action.high.student).toContain('herkese açık ve güvenli');
    expect(t.scales.venture.action.high.parent).toContain('kiminle gideceğini');
    expect(t.scales.danger.settings!.high).toContain('güvenlik kurallarının açık');
    // Arkadaş etkisi gençlerde bulunmuştur: yetişkine yazılan metinler arkadaş baskısından söz etmez.
    expect(t.scales.impulsive.action.high.adult).toBeDefined();
    expect(t.scales.impulsive.action.high.adult).not.toMatch(/arkadaş/i);
    const r1 = rep.insight!.rules[0];
    expect(r1.when).toEqual({ danger: ['high'], impulsive: ['high'] });
    expect(r1.text.adult).toBeDefined();
    expect(r1.text.adult).not.toMatch(/arkadaş/i);
    expect(r1.text.student).toMatch(/arkadaşlarınla/);
    expect(r1.text.parent).toMatch(/arkadaşlarıyla/);
  });
});

describe('Heyecan Arayışı yayında', () => {
  it('listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /HEY_GOVDE=.*?n=(\{[^}]*\})/.exec(yml);
    expect(m).not.toBeNull();
    const n = JSON.parse(m![1]) as Record<string, number>;
    const keys = Object.entries(n)
      .flatMap(([k, c]) => Array.from({ length: c }, (_, i) => `${k}${String(i + 1).padStart(2, '0')}`))
      .filter((k) => !HEYECAN_REMOVED.includes(k));
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
  });
});
