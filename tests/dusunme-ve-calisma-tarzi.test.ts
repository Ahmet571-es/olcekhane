import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import type { SimpleReport } from '@/lib/reports/simple';
import { likertQuality, scoreLikert } from '@/lib/scoring/likert';
import { Z90 } from '@/lib/scoring/stats';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'dusunme-ve-calisma-tarzi';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['complexity', 'ingenuity', 'conformity', 'activity', 'organization'];
const NAMES = ['Soyut ve felsefi konulara ilgi', 'Yenilikçilik', 'Başkalarının görüşüne önem verme', 'Enerji ve tempo', 'Düzen ve plan'];
const PREFIX: Record<string, string> = { complexity: 'cpx', ingenuity: 'inv', conformity: 'cpr', activity: 'enl', organization: 'org' };
const BANDS = ['low', 'average', 'high'] as const;
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in JPI-R anahtar sayfası (https://ipip.ori.org/newJPI-RKey.htm): her ölçekte artı ve eksi yönlü maddeler, sayfadaki
 * sırayla, ve sayfadaki iç tutarlılık. Açık veriden (Eugene-Springfield, on maddenin hepsini cevaplayanlar) Ölçekhane'nin
 * hesabı: α ve madde ortalamasının standart sapması (test dışında hesaplandı; tanımın başındaki açıklamada).
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number; escsAlpha: number; sd: number }> = {
  complexity: {
    plus: [
      'Believe in the importance of art.',
      'Have a rich vocabulary.',
      'Enjoy examining myself and my life.',
      'Enjoy discussing movies and books with others.',
      'Try to examine myself objectively.',
    ],
    minus: [
      'Am not interested in abstract ideas.',
      'Try to avoid complex people.',
      'Avoid philosophical discussions.',
      'Am not interested in theoretical discussions.',
      'Do not like poetry.',
    ],
    alpha: 0.82,
    escsAlpha: 0.814,
    sd: 0.6794,
  },
  ingenuity: {
    plus: [
      'Love to think up new ways of doing things.',
      'Have a vivid imagination.',
      'Am full of ideas.',
      'Carry the conversation to a higher level.',
      'Come up with bold plans.',
      'Have excellent ideas.',
    ],
    minus: ['Do not have a good imagination.', 'Have difficulty imagining things.', 'Will not probe deeply into a subject.', "Can't come up with new ideas."],
    alpha: 0.84,
    escsAlpha: 0.829,
    sd: 0.6442,
  },
  conformity: {
    plus: [
      'Worry about what people think of me.',
      "Conform to others' opinions.",
      'Need the approval of others.',
      "Want to amount to something special in others' eyes.",
      'Do what others do.',
    ],
    minus: [
      "Don't care what others think.",
      'Am not concerned with making a good impression.',
      "Feel it's OK that some people don't like me.",
      'Want to form my own opinions.',
      'Want to be different from others.',
    ],
    alpha: 0.71,
    escsAlpha: 0.699,
    sd: 0.5209,
  },
  activity: {
    plus: ['Can manage many things at the same time.', 'Am always busy.', 'Do a lot in my spare time.', 'Am always on the go.', 'Accomplish a lot of work.'],
    minus: ['Need a push to get started.', 'Am easily discouraged.', 'Do too little work.', 'Hang around doing nothing.', 'Have a slow pace to my life.'],
    alpha: 0.81,
    escsAlpha: 0.794,
    sd: 0.6549,
  },
  organization: {
    plus: ['Get chores done right away.', 'Make plans and stick to them.', 'Follow a schedule.', 'Want everything to be "just right."', 'Like order.'],
    minus: [
      'Often forget to put things back in their proper place.',
      'Waste my time.',
      'Leave my belongings around.',
      'Am not bothered by disorder.',
      'Put off unpleasant tasks.',
    ],
    alpha: 0.79,
    escsAlpha: 0.795,
    sd: 0.6393,
  },
};

/** Sitede başka bir testte çevirisi olmayan, bu test için çevrilen 16 madde. */
const NEW_ITEMS: Record<string, string> = {
  'Enjoy examining myself and my life.': 'Kendimi ve hayatımı incelemekten hoşlanırım.',
  'Try to examine myself objectively.': 'Kendimi tarafsız bir gözle incelemeye çalışırım.',
  'Come up with bold plans.': 'Cesur planlar kurarım.',
  "Can't come up with new ideas.": 'Yeni fikirler bulamam.',
  'Worry about what people think of me.': 'İnsanların hakkımda ne düşündüğünü kafama takarım.',
  "Conform to others' opinions.": 'Başkalarının görüşlerine uyarım.',
  "Want to amount to something special in others' eyes.": 'Başkalarının gözünde özel biri olmak isterim.',
  'Do what others do.': 'Başkaları ne yapıyorsa onu yaparım.',
  "Don't care what others think.": 'Başkalarının ne düşündüğünü umursamam.',
  'Am not concerned with making a good impression.': 'İyi bir izlenim bırakma derdinde değilim.',
  "Feel it's OK that some people don't like me.": 'Bazı insanların beni sevmemesini doğal karşılarım.',
  'Want to form my own opinions.': 'Kendi görüşlerimi kendim oluşturmak isterim.',
  'Want to be different from others.': 'Başkalarından farklı olmak isterim.',
  'Can manage many things at the same time.': 'Aynı anda birçok şeyi idare edebilirim.',
  'Accomplish a lot of work.': 'Çok iş çıkarırım.',
  'Have a slow pace to my life.': 'Hayatımın temposu yavaştır.',
};

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

/** Bir ölçeğin maddelerine, puanları (ters maddeler çevrilerek) `scores` olacak cevaplar; öteki maddeler 3. */
function scaleAnswers(scale: string, scores: number[]) {
  const own = d.items.filter((i) => i.scale === scale);
  return Object.fromEntries(
    d.items.flatMap((it) => {
      const k = own.indexOf(it);
      if (k < 0) return [[it.key, { value: 3, rtMs: 2600 }]];
      if (k >= scores.length) return [];
      return [[it.key, { value: it.reverse ? 6 - scores[k] : scores[k], rtMs: 2600 }]];
    }),
  );
}

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

const pos = (source: string) => d.items.findIndex((i) => i.source === source);

describe('Düşünme ve Çalışma Tarzı tanımı', () => {
  it('50 madde; beş ölçek, her biri 10 madde; anahtarlar ölçeğin kısaltması ve kaynaktaki sıra', () => {
    expect(d.items).toHaveLength(50);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const s of SCALES) {
      const own = d.items.filter((i) => i.scale === s);
      expect(own, s).toHaveLength(10);
      expect(own.map((i) => i.key).sort(), s).toEqual(Array.from({ length: 10 }, (_, i) => `${PREFIX[s]}${String(i + 1).padStart(2, '0')}`));
    }
    expect(new Set(d.items.map((i) => i.text)).size).toBe(50);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    for (const s of d.scales) {
      expect(s.plain.length, s.key).toBeGreaterThan(30);
      expect(s.poles, s.key).toBeDefined();
      expect(s.of, s.key).toBeUndefined();
    }
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain, d.profile, d.estimatedMinutes]).toEqual([
      'active',
      'public_domain',
      9,
      13,
      true,
      'personality',
      undefined,
      7,
    ]);
    expect(d.scoring).toEqual({ method: 'mean', minAnsweredRatio: 0.75 });
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
  });

  it('her madde kaynaktaki metni ve yönüyle; seçilen beş ölçeğin bütün maddeleri; anahtar kaynaktaki sırayı gösterir', () => {
    for (const it of d.items) {
      const k = KEY[it.scale];
      const order = [...k.plus, ...k.minus];
      expect(order.indexOf(it.source!), it.key).toBe(Number(it.key.slice(3)) - 1);
      expect(!!it.reverse, it.key).toBe(k.minus.includes(it.source!));
    }
    expect(d.items.map((i) => i.source).sort()).toEqual(
      Object.values(KEY)
        .flatMap((k) => [...k.plus, ...k.minus])
        .sort(),
    );
    expect(d.items.filter((i) => i.reverse)).toHaveLength(24);
    // Siyasi ya da dinî görüş soran madde yok.
    for (const it of d.items) expect(it.source, it.key).not.toMatch(/politic|religio|vote|race|tax|cheat|manipulat/i);
  });

  it('uygulama sırası: beş ölçek sırayla döner; benzer ve birbirinin tersi maddeler birbirinden uzak', () => {
    const cycle = ['ingenuity', 'organization', 'complexity', 'conformity', 'activity'];
    d.items.forEach((it, i) => expect(it.scale, it.key).toBe(cycle[i % 5]));
    // Aynı yönde art arda en çok üç madde.
    let run = 0;
    let longest = 0;
    d.items.forEach((it, i) => {
      run = i > 0 && !!it.reverse === !!d.items[i - 1].reverse ? run + 1 : 1;
      longest = Math.max(longest, run);
    });
    expect(longest).toBeLessThanOrEqual(3);
    // Aynı ölçekte birbirine benzeyen ya da birbirinin tersini söyleyen maddeler en az dört tur (20 madde) arayla.
    const groups = [
      ['Have a vivid imagination.', 'Do not have a good imagination.', 'Have difficulty imagining things.'],
      ['Am full of ideas.', 'Have excellent ideas.', "Can't come up with new ideas."],
      ['Enjoy examining myself and my life.', 'Try to examine myself objectively.'],
      ['Am not interested in abstract ideas.', 'Avoid philosophical discussions.', 'Am not interested in theoretical discussions.'],
      ['Believe in the importance of art.', 'Do not like poetry.'],
      ['Worry about what people think of me.', "Don't care what others think.", 'Am not concerned with making a good impression.'],
      ["Conform to others' opinions.", 'Want to form my own opinions.'],
      ['Do what others do.', 'Want to be different from others.'],
      ['Am always busy.', 'Hang around doing nothing.', 'Do a lot in my spare time.'],
      ['Accomplish a lot of work.', 'Do too little work.'],
      ['Am always on the go.', 'Have a slow pace to my life.'],
      ['Get chores done right away.', 'Put off unpleasant tasks.'],
      ['Like order.', 'Am not bothered by disorder.'],
      ['Often forget to put things back in their proper place.', 'Leave my belongings around.'],
      ['Make plans and stick to them.', 'Follow a schedule.'],
    ];
    const far: [string, string, number][] = groups.flatMap((g) => g.flatMap((a, i) => g.slice(i + 1).map((b) => [a, b, 20] as [string, string, number])));
    expect(far).toHaveLength(25);
    far.push(
      ['Want everything to be "just right."', 'Like order.', 10],
      // Farklı ölçeklerde birbirine benzeyen maddeler.
      ['Waste my time.', 'Hang around doing nothing.', 20],
      ['Waste my time.', 'Do too little work.', 10],
      ['Come up with bold plans.', 'Make plans and stick to them.', 9],
      ['Come up with bold plans.', 'Follow a schedule.', 9],
      ['Need a push to get started.', 'Get chores done right away.', 15],
      ['Need a push to get started.', 'Put off unpleasant tasks.', 7],
    );
    for (const [a, b, min] of far) {
      expect(pos(a), a).toBeGreaterThanOrEqual(0);
      expect(pos(b), b).toBeGreaterThanOrEqual(0);
      expect(Math.abs(pos(a) - pos(b)), `${a} / ${b}`).toBeGreaterThanOrEqual(min);
    }
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri (34 madde); 16 madde yalnızca bu testte', () => {
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    const others = INSTRUMENTS.filter((x): x is LikertInstrument => x.engine === 'likert' && x.slug !== SLUG);
    let same = 0;
    for (const it of d.items) {
      const hits = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)).map((x) => ({ o, x })));
      if (NEW_ITEMS[it.source!]) {
        expect(hits, it.source).toEqual([]);
        expect(it.text, it.source).toBe(NEW_ITEMS[it.source!]);
        continue;
      }
      // 9. sınıftan başlayan testlerde bu madde hep aynı çevrilmiştir ve buradaki çeviri odur.
      const later = hits.filter((h) => h.o.minGrade >= 9);
      expect(later.length, it.source).toBeGreaterThan(0);
      for (const h of later) expect(h.x.text, `${it.source} (${h.o.slug})`).toBe(it.text);
      same++;
    }
    expect(same).toBe(34);
    expect(Object.keys(NEW_ITEMS)).toHaveLength(16);
  });

  it('beş faktör ölçeğiyle ortak cümleler bilim kartındaki gibi: düzen beş, yenilikçilik dört, soyut iki', () => {
    const bf = def<LikertInstrument>('bes-faktor-kisilik');
    const shared = (scale: string) => d.items.filter((it) => it.scale === scale && bf.items.some((x) => x.source === it.source)).length;
    expect(SCALES.map(shared)).toEqual([2, 4, 0, 0, 5]);
    expect(d.science.whatItMeasures).toContain('düzen ve plan ölçeğinin beş, yenilikçiliğin dört, soyut ve felsefi konulara ilginin iki cümlesi');
  });

  it('güvenirlik: sayfadaki ve açık verideki değerlerden düşük olanı; standart sapmalar açık veriden; ölçüm payı bu değerlerle', () => {
    for (const s of d.scales) {
      const k = KEY[s.key];
      expect(s.alpha, s.key).toBe(Math.round(Math.min(k.alpha, k.escsAlpha) * 100) / 100);
      expect(s.sdRef, s.key).toBe(Math.round(k.sd * 100) / 100);
    }
    const scores = scoreLikert(
      d,
      keyedAnswers(() => 'mid'),
    );
    for (const sc of scores) {
      const s = d.scales.find((x) => x.key === sc.scaleKey)!;
      const half = Z90 * s.sdRef! * Math.sqrt(1 - s.alpha!);
      expect(sc.ciLow, s.key).toBeCloseTo(3 - half, 2);
      expect(sc.ciHigh, s.key).toBeCloseTo(3 + half, 2);
      // On cümlelik ölçekte ölçüm payı yaklaşık ±0,4–0,5.
      expect(half, s.key).toBeGreaterThan(0.4);
      expect(half, s.key).toBeLessThan(0.5);
    }
  });

  it('düzeyler: ortalama (bir ondalığa yuvarlanmış) 2,6’dan küçükse düşük, 3,4’ten küçükse orta; iki madde boşken de; üç boşsa hesaplanmaz', () => {
    const LABEL = { low: 'Düşük', average: 'Orta', high: 'Yüksek' } as const;
    const shown = (scale: string, scores: number[]) => {
      const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers: scaleAnswers(scale, scores) } });
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      return rows.find((x) => x.label === d.scales.find((s) => s.key === scale)!.name)!;
    };
    const expected = (sum: number, n: number) => {
      const m = Math.round((sum / n) * 10) / 10;
      return m < 2.6 ? 'low' : m < 3.4 ? 'average' : 'high';
    };
    for (const scale of SCALES) {
      for (const n of [10, 9, 8]) {
        for (let sum = n; sum <= 5 * n; sum++) {
          const scores = Array.from({ length: n }, (_, k) => Math.floor(sum / n) + (k < sum % n ? 1 : 0));
          expect(shown(scale, scores).band, `${scale} ${n} madde ${sum}`).toBe(LABEL[expected(sum, n)]);
        }
      }
      expect(shown(scale, [5, 5, 5, 5, 5, 5, 5]).band, scale).toBe('Hesaplanamadı');
    }
    // Sınırlar: on maddede toplam 25 düşük, 26 orta; 33 orta, 34 yüksek.
    expect([25, 26, 33, 34].map((s) => expected(s, 10))).toEqual(['low', 'average', 'average', 'high']);
  }, 120_000);

  it('birbirinin tersini söyleyen beş çift: aynı ölçekte, biri düz biri ters; çoğuna aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(5);
    const scales: string[] = [];
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.scale, x).toBe(b.scale);
      expect(!!a.reverse, x).toBe(false);
      expect(!!b.reverse, y).toBe(true);
      scales.push(a.scale);
    }
    // Düzende ve soyut düşünmede birbirinin tam tersi olan çift yok.
    expect(scales).toEqual(['ingenuity', 'ingenuity', 'activity', 'activity', 'conformity']);
    const keys = d.oppositePairs!.flat();
    const pairsWith = (n: number, v: number) =>
      Object.fromEntries(d.items.map((it) => [it.key, { value: keys.slice(0, 2 * n).includes(it.key) ? v : 3, rtMs: 2600 }]));
    expect(likertQuality(d, pairsWith(5, 5)).notes.some((n) => n.includes('Birbirinin tersini söyleyen 5 cümle çiftinden 5 tanesinde'))).toBe(true);
    expect(likertQuality(d, pairsWith(2, 5)).oppositeAgree).toBe(2);
    expect(likertQuality(d, pairsWith(2, 5)).notes.some((n) => n.includes('Birbirinin tersini'))).toBe(false);
    expect(likertQuality(d, pairsWith(3, 4)).notes.some((n) => n.includes('5 cümle çiftinden 3 tanesinde'))).toBe(true);
    const no = likertQuality(d, pairsWith(3, 2));
    expect(no.oppositeDisagree).toBe(3);
    expect(no.notes.some((n) => n.includes('çoğuna “hayır” deme'))).toBe(true);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(
        d,
        keyedAnswers(() => level),
      );
      expect([plain.oppositeAgree, plain.oppositeDisagree], level).toEqual([0, 0]);
    }
  });

  it('bilim kartı ve tanıtım: kaynak, seçilen ve alınmayan ölçekler, çeviri, güvenirlik, yaş ve sınırlar açıkça yazılı', () => {
    expect(d.intro.paragraphs.join(' ')).toContain('50 kısa cümle');
    expect(d.intro.paragraphs.join(' ')).toContain('Yaklaşık 7 dakika');
    expect(d.description).toContain('50 kısa cümle');
    expect(d.description).toContain('zekâ testi değildir');
    expect(d.description).toContain('tanı koymaz');
    const s = d.science;
    expect(s.basedOn).toContain('15 ön ölçeğinden beşi');
    expect(s.basedOn).toContain('bütün maddeleri (50 madde)');
    for (const w of ['gelenekçilik', 'hoşgörü', 'sorumluluk', 'Makyavelcilik', 'Düşünsel genişlik', 'r = .74', 'risk alma']) expect(s.basedOn, w).toContain(w);
    expect(s.whatItMeasures).toContain('471 yetişkin');
    expect(s.whatItMeasures).toContain('.59 (etkinlik düzeyi) ile .74 (yenilikçilik)');
    expect(s.whatItMeasures).toContain('.74 ile .95');
    for (const r of ['r = .90', 'r = .83', 'r = .42', 'r = .75', 'r = .35', 'r = .49', 'r = .32', 'r = −.32', 'r = −.30'])
      expect(s.whatItMeasures, r).toContain(r);
    expect(s.normNote).toContain('%69–75');
    expect(s.normNote).toContain('%56');
    expect(s.turkishVersion).toContain('34 madde');
    expect(s.turkishVersion).toContain('16 madde');
    expect(s.turkishVersion).toContain('Türkçe uyarlamasına ulaşılamadı');
    // Sayfadaki ve açık verideki α değerleri.
    expect(s.reliability).toContain('.82, yenilikçilik .84');
    expect(s.reliability).toContain('.71, enerji ve tempo (etkinlik düzeyi) .81, düzen ve plan .79');
    expect(s.reliability).toContain('570–623 yetişkinde');
    expect(s.reliability).toContain('.81, .83, .70, .79 ve .80');
    for (const k of SCALES) expect(Math.round(KEY[k].escsAlpha * 100) / 100, k).toBe([0.81, 0.83, 0.7, 0.79, 0.8][SCALES.indexOf(k)]);
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    expect(s.ageNote).toContain('ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı');
    expect(s.limitations.join(' ')).toContain('zekâ puanı vermez');
    expect(s.limitations.join(' ')).toContain('yaratıcılık becerisini değil');
    expect(s.limitations.join(' ')).toContain('JPI-R) kendisi değildir');
    expect(s.normStatus).toBe('none');
    const urls = s.citations.map((c) => c.url);
    for (const u of [
      'https://ipip.ori.org/newJPI-RKey.htm',
      'https://ipip.ori.org/newJPI-RTable.htm',
      'https://doi.org/10.1016/j.jrp.2005.08.007',
      'https://doi.org/10.1037/1040-3590.4.1.26',
      'https://doi.org/10.7910/DVN/UF52WY',
      'https://ipip.ori.org/ESCS_TechnicalReport_January2016.pdf',
    ]) {
      expect(urls, u).toContain(u);
    }
    // Bilim kartında anılan her çalışma kaynaklarda yer alır; kaynaklardaki her çalışma kartta anılır.
    const card = JSON.stringify({ ...s, citations: [] }) + d.description;
    for (const [a, c] of [
      ['Jackson, 1994', 'Jackson, D. N. (1994)'],
      ['Goldberg ve ark., 2006', 'Goldberg, L. R. ve ark. (2006)'],
      ['Goldberg, 1992', 'Goldberg, L. R. (1992)'],
      ['Goldberg, 2018', 'Goldberg, L. R. (2018)'],
      ['Goldberg ve Saucier, 2016', 'Goldberg, L. R. ve Saucier, G. (2016)'],
    ]) {
      expect(card, a).toContain(a);
      expect(
        s.citations.some((x) => x.text.startsWith(c)),
        c,
      ).toBe(true);
    }
    expect(s.citations).toHaveLength(7);
  });
});

describe('Düşünme ve Çalışma Tarzı raporu', () => {
  it('genel bakışta beş özellik, ölçüm payıyla; beş kart; genel açıklama 10 cümlelik ölçeği söyler', () => {
    const b = likertBody(SLUG, 10, (i) => i % 5);
    const r = evaluate(SLUG, b);
    const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
    const t = REPORT_TEMPLATES[SLUG];
    for (const rep of [r.student, r.parent, adult]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(
        rows.map((x) => x.label),
        rep.audience,
      ).toEqual(NAMES);
      expect(
        rows.every((x) => x.ciLow !== null && x.ciHigh !== null),
        rep.audience,
      ).toBe(true);
      expect(
        rep.items.map((x) => x.title),
        rep.audience,
      ).toEqual(NAMES);
      const overview = rep.audience === 'parent' ? t.overview!.parent : t.overview!.student;
      const band = rep.audience === 'parent' ? 'Sarı bant ölçümün doğal payını gösterir.' : 'Sarı bant ölçümün doğal payı.';
      expect(rep.chartNote, rep.audience).toBe(`${overview} ${band}`);
      expect(rep.chartNote, rep.audience).toContain('10 cümleyle');
      expect(rep.support, rep.audience).toBeNull();
    }
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
    expect(r.student.items[0].text).not.toContain('Çocuğunuz');
  });

  it('her özelliğin düşük, orta ve yüksek düzey metni yazılmış; dil kuralları', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t.evaluative).toBeUndefined();
    expect(t.insight).toBeUndefined();
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    for (const s of d.scales) {
      const summaries = new Set<string>();
      for (const band of BANDS) {
        const label = `${s.key}/${band}`;
        const bt = t.scales[s.key]?.[band];
        expect(bt, label).toBeDefined();
        summaries.add(bt!.summary);
        expect(bt!.summary, label).not.toBe(t.bandLabels[band]);
        expect(bt!.student.length, label).toBeGreaterThan(150);
        expect(bt!.student, label).toContain('söylüyorsun');
        expect(bt!.parent, label).toMatch(/^Çocuğunuz /);
        expect(bt!.parent, label).toContain('belirtiyor');
        expect(bt!.student, label).not.toMatch(/[Çç]ocuğunuz/);
        expect(`${bt!.student} ${bt!.parent}`, label).not.toMatch(
          /tembel|disiplinsiz|beceriksiz|yeteneksiz|bozukluk|hastalık|dikkat eksikliği|zeki|aptal|depresyon|kaygı|bağımlı|koyun|sürü/i,
        );
        expect(bt!.student, label).toMatch(/[.]$/);
        expect(bt!.parent, label).toMatch(/[.]$/);
        // Öğrenci metinleri okula ya da ergenliğe özgü değil: yetişkine de aynı metin gider.
        expect(bt!.adult, label).toBeUndefined();
        expect(schoolWords(bt!.student), label).toEqual([]);
        expect(bt!.tipsStudent, label).toEqual([]);
        expect(bt!.tipsParent, label).toEqual([]);
        expect(bt!.support, label).toBeUndefined();
      }
      expect(summaries.size, s.key).toBe(3);
    }
    for (const band of BANDS) {
      for (const x of [t.scales.complexity[band]!.student, t.scales.complexity[band]!.parent]) expect(x, band).toContain('Bu özellik zekâyı ölçmez');
      for (const x of [t.scales.ingenuity[band]!.student, t.scales.ingenuity[band]!.parent]) expect(x, band).toContain('yaratıcılığı ya da zekâyı ölçmez');
    }
  });

  it('kartlar birbiriyle çelişmesin: her metin yalnızca kendi ölçeğine özgü davranışı anlatır', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const texts = (k: string) => BANDS.flatMap((b) => [t.scales[k][b]!.student, t.scales[k][b]!.parent, t.scales[k][b]!.summary]).join(' ');
    // Enerji ve tempo, düzendeki "işleri hemen halletme" ile çelişebilecek başlama ve ertelemeyi anlatmaz.
    expect(texts('activity')).not.toMatch(/dürt|başla|ertele|sonraya|plan|düzen/);
    // Düzen ve plan, enerjideki "hep meşgul" ile çelişebilecek boşa geçen zamanı ve tempoyu anlatmaz.
    expect(texts('organization')).not.toMatch(/boşa|boş boş|vakit|meşgul|tempo|enerji/);
    // Yenilikçilik "derine inmeyi" (soyut konulara ilgiyle çelişebilirdi) ve soyut, felsefi konuları anlatmaz.
    expect(texts('ingenuity')).not.toMatch(/derin|soyut|felsef|teorik|sanat|şiir/);
    // Soyut konulara ilgi yeni fikirleri, hayal gücünü anlatmaz; maddelerin sormadığı "sanat ya da şiir üzerine konuşmayı"
    // söylemez.
    expect(texts('complexity')).not.toMatch(/yeni fikir|hayal|plan|sanat, şiir|şiir ya da sanat üzerine|sanat üzerine/);
    // Düzen ve plan esnekliği ölçmez.
    expect(texts('organization')).not.toMatch(/[Ee]snek/);
    // Orta düzey zaman içinde değişimden söz etmez.
    for (const k of SCALES) expect(t.scales[k].average!.student + t.scales[k].average!.parent, k).not.toMatch(/dönem|bazı zamanlar/);
    // Başkalarının görüşü, fikir bulmayı ve düzeni anlatmaz.
    expect(texts('conformity')).not.toMatch(/fikirler bul|hayal|düzen|tempo/);
  });

  it('bütün düzey birleşimleri (3⁵) tek tek: her kart kendi düzeyinin metni, rozet doğru, destek kutusu yok (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const combos: (typeof BANDS)[number][][] = [[]];
    for (let i = 0; i < SCALES.length; i++) combos.splice(0, combos.length, ...combos.flatMap((c) => BANDS.map((b) => [...c, b])));
    expect(combos).toHaveLength(243);
    let n = 0;
    for (const combo of combos) {
      const b = body((x) => LEVEL[combo[SCALES.indexOf(x)]]);
      const r = evaluate(SLUG, b);
      const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
      for (const rep of [r.student, r.parent, adult] as SimpleReport[]) {
        const label = `${combo.join(',')}/${rep.audience}`;
        SCALES.forEach((key, i) => {
          const bt = t.scales[key][combo[i]]!;
          const item = rep.items.find((x) => x.title === NAMES[i])!;
          expect(item.text, label).toBe(rep.audience === 'parent' ? bt.parent : bt.student);
          expect(item.badge, label).toBe(`${t.bandLabels[combo[i]]} · ${bt.summary}`);
        });
        expect(rep.support, label).toBeNull();
        // Cevaplar hızlı değil, eksik değil ve birbirinin tersi çiftlere aynı uç verilmemiş (hepsi orta olunca yalnızca
        // "hep aynı seçenek" notu çıkar).
        expect(rep.cautions.join(' '), label).not.toMatch(/Birbirinin tersini|çok hızlı|cevaplanmamış/);
        if (rep.audience !== 'parent') expect(JSON.stringify(rep.items), label).not.toMatch(/[Çç]ocuğunuz/);
        n++;
      }
    }
    expect(n).toBe(243 * 3);
  }, 180_000);

  it('uç ve orta cevaplar: bütün özellikler aynı düzeyde; hep aynı seçenek uyarı verir', () => {
    for (const [level, label] of [
      ['high', 'Yüksek'],
      ['low', 'Düşük'],
      ['mid', 'Orta'],
    ] as const) {
      const r = evaluate(
        SLUG,
        body(() => level, 12),
      );
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(
        rows.every((x) => x.band === label),
        level,
      ).toBe(true);
    }
    const same = evaluate(
      SLUG,
      likertBody(SLUG, 10, () => 3),
    );
    expect(same.student.cautions.join(' ')).toContain('hep aynı seçenek');
    const fast = evaluate(SLUG, {
      grade: 10,
      data: { engine: 'likert', answers: Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 400 }])) },
    });
    expect(fast.student.cautions.join(' ')).toContain('çok hızlı');
  });

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const level of ['high', 'low', 'mid'] as const) {
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(rest)), level).toEqual([]);
      expect(roadmap?.approach, level).toBeNull();
      for (const x of roadmapTexts(roadmap!)) expect(x, level).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|kitap)/iu);
      expect(schoolWords(roadmapTexts(roadmap!).join(' ')), level).toEqual([]);
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

describe('Düşünme ve Çalışma Tarzı gelişim yol haritası', () => {
  it('her özelliğin her düzeyi: beş sütun, beş öneri kartı, 2. hafta çalışma düzeni, ortamlar yok (öğrenci, veli, yetişkin)', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(t.planningScale).toBe('organization');
    expect(t.wellbeing).toBeUndefined();
    let n = 0;
    for (const key of SCALES) {
      for (const band of BANDS) {
        const b = body((x) => (x === key ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        for (const rep of [r.student, r.parent, adult]) {
          const label = `${key}/${band}/${rep.audience}`;
          const rm = rep.roadmap!;
          expect(
            rm.bars.map((x) => x.key),
            label,
          ).toEqual(SCALES);
          expect(
            rm.bars.every((x) => x.ciLow !== null && x.ciHigh !== null),
            label,
          ).toBe(true);
          expect(
            rm.study.items.map((x) => x.key),
            label,
          ).toEqual(SCALES);
          expect(rm.settings, label).toBeNull();
          expect(rm.weeks, label).toHaveLength(4);
          expect(rm.weeks[1].title, label).toBe('Çalışma düzeni');
          expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 5 : 0);
          for (const x of roadmapTexts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
          }
          n++;
        }
      }
    }
    expect(n).toBe(5 * 3 * 3);
  }, 60_000);

  it('yol haritası ve veliye yaklaşım raporun kendi cümlelerini tekrar etmez', () => {
    const t = ROADMAPS[SLUG];
    const tpl = REPORT_TEMPLATES[SLUG];
    const report = Object.values(tpl.scales)
      .flatMap((x) => Object.values(x).flatMap((b) => [b!.student, b!.parent]))
      .concat([tpl.overview!.student, tpl.overview!.parent])
      .join(' ');
    for (const [key, sc] of Object.entries(t.scales)) {
      for (const g of BANDS) {
        const own = [sc.study[g].student, sc.study[g].parent, sc.action[g].student, sc.action[g].parent, t.approach![key][g]];
        for (const text of own) {
          for (const sentence of text.split(/(?<=[.;:])\s+/)) {
            if (sentence.length < 25) continue;
            expect(report, `${key} ${g}: ${sentence}`).not.toContain(sentence.replace(/[.;:]$/, ''));
          }
        }
      }
    }
  });
});

/** Metindeki dört sözcüklük söz öbekleri (küçük harf, yalnızca harfler). */
function grams(text: string): Set<string> {
  const w = text.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? [];
  return new Set(w.slice(0, Math.max(0, w.length - 3)).map((_, i) => w.slice(i, i + 4).join(' ')));
}
/** Haftalık denemelerin kalıp açılışı ("Bu hafta her gün …") tekrar sayılmaz. */
const FORMULA = new Set(['bu hafta her gün']);
function shared(a: string, b: string): string[] {
  const g = grams(b);
  return [...grams(a)].filter((x) => g.has(x) && !FORMULA.has(x));
}

describe('Düşünme ve Çalışma Tarzı: metinler birbirini tekrar etmez', () => {
  const t = ROADMAPS[SLUG];
  const tpl = REPORT_TEMPLATES[SLUG];
  const pick = (x: { student: string; parent: string }, a: 'student' | 'parent') => x[a];

  it('aynı özellik ve düzeyde rapor kartı, çalışma önerisi, haftalık deneme ve veliye yaklaşım ortak söz öbeği taşımaz', () => {
    for (const key of SCALES) {
      for (const g of BANDS) {
        for (const a of ['student', 'parent'] as const) {
          const texts = [
            pick(tpl.scales[key][g]!, a),
            pick(t.scales[key].study[g], a),
            pick(t.scales[key].action[g], a),
            ...(a === 'parent' ? [t.approach![key][g]] : []),
          ];
          for (let i = 0; i < texts.length; i++)
            for (let j = i + 1; j < texts.length; j++) expect(shared(texts[i], texts[j]), `${key} ${g} ${a} ${i}-${j}`).toEqual([]);
        }
      }
    }
  });

  it('aynı düzeyde farklı özelliklerin çalışma önerileri, haftalık denemeleri ve veliye yaklaşımları ortak söz öbeği taşımaz', () => {
    for (const g of BANDS) {
      for (const a of ['student', 'parent'] as const) {
        for (const part of ['study', 'action'] as const) {
          const texts = SCALES.map((k) => pick(t.scales[k][part][g], a));
          for (let i = 0; i < texts.length; i++)
            for (let j = i + 1; j < texts.length; j++) expect(shared(texts[i], texts[j]), `${g} ${a} ${part} ${SCALES[i]}-${SCALES[j]}`).toEqual([]);
        }
      }
      // Haftalık denemeler ilk ve son haftanın metinlerini de tekrar etmez.
      for (const a of ['student', 'parent'] as const)
        for (const k of SCALES)
          for (const w of [t.firstWeek, t.lastWeek]) expect(shared(pick(t.scales[k].action[g], a), pick(w, a)), `${g} ${a} ${k} hafta`).toEqual([]);
      const tips = SCALES.map((k) => t.approach![k][g]);
      for (let i = 0; i < tips.length; i++)
        for (let j = i + 1; j < tips.length; j++) expect(shared(tips[i], tips[j]), `${g} yaklaşım ${SCALES[i]}-${SCALES[j]}`).toEqual([]);
    }
  });
});

describe('Düşünme ve Çalışma Tarzı yayında', () => {
  it('listelerde ve site haritasında; Düşünmeyi Sevme Ölçeği’nden hemen sonra', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    const order = publicInstruments().map((i) => i.slug);
    expect(order.indexOf(SLUG)).toBe(order.indexOf('dusunmeyi-sevme-olcegi') + 1);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır; yetişkin olarak da sınanır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /DCT_GOVDE=.*?enumerate\(\[([^\]]+)\]\) for i in range\((\d+), (\d+)\)/.exec(yml);
    expect(m).not.toBeNull();
    const prefixes = m![1].split(',').map((x) => x.trim().replace(/"/g, ''));
    const keys = prefixes.flatMap((p) => Array.from({ length: Number(m![3]) - Number(m![2]) }, (_, i) => `${p}${String(i + Number(m![2])).padStart(2, '0')}`));
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
    expect(yml).toContain('/api/rapor/dusunme-ve-calisma-tarzi');
    expect(yml).toContain('DCT_YETISKIN');
  });
});
