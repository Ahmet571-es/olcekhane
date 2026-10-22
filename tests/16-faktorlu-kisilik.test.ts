import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import { scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = '16-faktorlu-kisilik-profili';
const d = def<LikertInstrument>(SLUG);

/** Madde anahtarının ölçek kısmı (16PF harfi) → [ölçek, madde sayısı, ad]. Kurallara bağlılık: üç madde çıkarıldı. */
const SCALES: Record<string, [string, number, string]> = {
  a: ['warmth', 10, 'Sıcaklık'],
  b: ['intellect', 13, 'Düşünsel özgüven'],
  c: ['emotional_stability', 10, 'Duygusal denge'],
  e: ['assertiveness', 10, 'Atılganlık'],
  f: ['gregariousness', 10, 'Neşe ve canlılık'],
  g: ['dutifulness', 7, 'Kurallara bağlılık'],
  h: ['friendliness', 10, 'Sosyal rahatlık'],
  i: ['sensitivity', 10, 'Duyarlılık'],
  l: ['distrust', 10, 'Temkinlilik'],
  m: ['imagination', 10, 'Hayal gücü'],
  n: ['reserve', 10, 'Kendini kolay açmama'],
  o: ['anxiety', 10, 'Endişeye yatkınlık'],
  q1_: ['complexity', 10, 'Yeniliğe açıklık'],
  q2_: ['introversion', 10, 'Kendi başına olmayı sevme'],
  q3_: ['orderliness', 10, 'Düzen ve titizlik'],
  q4_: ['emotionality', 10, 'Gerginlik'],
};
const NAMES = Object.values(SCALES).map(([, , n]) => n);
const prefix = (key: string) => key.slice(0, -2);

/**
 * Kaynak sayfadaki (ipip.ori.org/new16PFKey.htm) 163 madde, sayfadaki sırayla: her ölçekte önce artı, sonra eksi yönlü
 * maddeler. Madde anahtarı "16PF harfi + sayfadaki sıra"dır (ör. q4_07: Q4'ün yedinci maddesi).
 */
const SOURCE: Record<string, { plus: string[]; minus: string[] }> = {
  a: {
    plus: [
      'Know how to comfort others.',
      'Enjoy bringing people together.',
      "Feel others' emotions.",
      "Take an interest in other people's lives.",
      'Cheer people up.',
      'Make people feel at ease.',
      'Take time out for others.',
    ],
    minus: [
      "Don't like to get involved in other people's problems.",
      'Am not really interested in others.',
      'Try not to think about the needy.',
    ],
  },
  b: {
    plus: [
      'Make insightful remarks.',
      'Know the answers to many questions.',
      'Tend to analyze things.',
      'Use my brain.',
      'Learn quickly.',
      "Counter others' arguments.",
      'Reflect on things before acting.',
      'Weigh the pros against the cons.',
    ],
    minus: [
      'Consider myself an average person.',
      'Get confused easily.',
      'Know that I am not a special person.',
      'Have a poor vocabulary.',
      'Skip difficult words while reading.',
    ],
  },
  c: {
    plus: [
      'Seldom feel blue.',
      'Feel comfortable with myself.',
      'Readily overcome setbacks.',
      'Am relaxed most of the time.',
      'Am not easily frustrated.',
    ],
    minus: [
      'Have frequent mood swings.',
      'Often feel blue.',
      'Dislike myself.',
      'Feel desperate.',
      'Am easily discouraged.',
    ],
  },
  e: {
    plus: [
      'Take charge.',
      'Want to be in charge.',
      'Say what I think.',
      'Am not afraid of providing criticism.',
      'Take control of things.',
      'Can take strong measures.',
    ],
    minus: [
      'Wait for others to lead the way.',
      'Never challenge things.',
      'Let others make the decisions.',
      'Let myself be pushed around.',
    ],
  },
  f: {
    plus: [
      'Am the life of the party.',
      'Love large parties.',
      'Joke around a lot.',
      'Enjoy being part of a loud crowd.',
      'Amuse my friends.',
      'Act wild and crazy.',
    ],
    minus: [
      'Seldom joke around.',
      "Don't like crowded events.",
      'Am the last to laugh at a joke.',
      'Dislike loud music.',
    ],
  },
  g: {
    plus: [
      'Believe laws should be strictly enforced.',
      'Try to follow the rules.',
      'Believe in one true religion.',
      'Respect authority.',
      'Like to stand during the national anthem.',
    ],
    minus: [
      'Resist authority.',
      'Break rules.',
      'Use swear words.',
      'Oppose authority.',
      'Know how to get around the rules.',
    ],
  },
  h: {
    plus: [
      'Feel comfortable around people.',
      'Talk to a lot of different people at parties.',
      "Don't mind being the center of attention.",
      'Make friends easily.',
      'Start conversations.',
    ],
    minus: [
      'Find it difficult to approach others.',
      'Often feel uncomfortable around others.',
      'Have little to say.',
      'Am quiet around strangers.',
      'Keep in the background.',
    ],
  },
  i: {
    plus: [
      'Like to read.',
      'Enjoy discussing movies and books with others.',
      'Read a lot.',
      "Don't like action movies.",
      'Cry during movies.',
      'Love flowers.',
    ],
    minus: [
      'Do not enjoy watching dance performances.',
      'Do not like poetry.',
      'Dislike works of fiction.',
      'Rarely notice my emotional reactions.',
    ],
  },
  l: {
    plus: [
      'Find it hard to forgive others.',
      'Suspect hidden motives in others.',
      'Am wary of others.',
      'Distrust people.',
      'Believe that people seldom tell you the whole truth.',
      'Believe that people are essentially evil.',
    ],
    minus: [
      'Trust what people say.',
      'Trust others.',
      'Believe that others have good intentions.',
      'Believe that people are basically moral.',
    ],
  },
  m: {
    plus: [
      'Do things that others find strange.',
      'Like to get lost in thought.',
      'Enjoy wild flights of fantasy.',
      'Love to daydream.',
      'Swim against the current.',
      'Take deviant positions.',
      'Do unexpected things.',
    ],
    minus: [
      'Do things by the book.',
      'Seldom daydream.',
      'Seldom get lost in thought.',
    ],
  },
  n: {
    plus: [
      'Reveal little about myself.',
      'Am hard to get to know.',
      "Don't talk a lot.",
      'Bottle up my feelings.',
      'Keep my thoughts to myself.',
    ],
    minus: [
      'Am open about myself to others.',
      'Am open about my feelings.',
      'Disclose my intimate thoughts.',
      'Show my feelings.',
      'Am willing to talk about myself.',
    ],
  },
  o: {
    plus: [
      'Am afraid that I will do the wrong thing.',
      'Feel threatened easily.',
      'Am easily hurt.',
      'Worry about things.',
      'Spend time thinking about past mistakes.',
      'Feel guilty when I say "no."',
      'Feel crushed by setbacks.',
    ],
    minus: [
      "Don't worry about things that have already happened.",
      'Am not easily bothered by things.',
      "Don't let others discourage me.",
    ],
  },
  q1_: {
    plus: [
      'Believe in the importance of art.',
      'Love to think up new ways of doing things.',
      'Enjoy hearing new ideas.',
      'Carry the conversation to a higher level.',
      'Prefer variety to routine.',
    ],
    minus: [
      'Avoid philosophical discussions.',
      'Rarely look for a deeper meaning in things.',
      'Am not interested in theoretical discussions.',
      'Am not interested in abstract ideas.',
      'Try to avoid complex people.',
    ],
  },
  q2_: {
    plus: [
      'Want to be left alone.',
      'Prefer to do things by myself.',
      'Enjoy spending time by myself.',
      'Seek quiet.',
      "Don't mind eating alone.",
      'Enjoy silence.',
      'Enjoy my privacy.',
    ],
    minus: [
      'Enjoy being part of a group.',
      'Enjoy teamwork.',
      "Can't do without the company of others.",
    ],
  },
  q3_: {
    plus: [
      'Want everything to be "just right."',
      'Get chores done right away.',
      'Like order.',
      'Continue until everything is perfect.',
      'Am exacting in my work.',
    ],
    minus: [
      'Am not bothered by messy people.',
      'Am not bothered by disorder.',
      'Leave a mess in my room.',
      'Leave my belongings around.',
      'Put off unpleasant tasks.',
    ],
  },
  q4_: {
    plus: [
      'Get irritated easily.',
      'Get angry easily.',
      'Am quick to judge others.',
      "Am annoyed by others' mistakes.",
      'Am easily put out.',
      "Can't stand being contradicted.",
      'Judge people by their appearance.',
    ],
    minus: [
      'Am not easily annoyed.',
      'Try to forgive and forget.',
      'Have a good word for everyone.',
    ],
  },
};

/** Kullanılmayan üç madde (yasalar, din, millî marş): g01, g03 ve g05. */
const REMOVED = ['g01', 'g03', 'g05'];

/** Kaynak sayfadaki bütün maddeler: anahtar → [İngilizce metin, eksi yönlü mü]. */
const PAGE = new Map(
  Object.entries(SOURCE).flatMap(([p, { plus, minus }]) =>
    [...plus.map((t) => [t, false] as const), ...minus.map((t) => [t, true] as const)].map(
      ([t, rev], i) => [`${p}${String(i + 1).padStart(2, '0')}`, [t, rev] as const] as const,
    ),
  ),
);

type Level = 'high' | 'low' | 'mid';
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

/** Yol haritasında kişiye gösterilen metinler (bağlantı adları hariç: onlar rehber yazılarının adlarıdır). */
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

describe('16 Faktörlü Kişilik Profili (IPIP 16PF ölçekleri) tanımı', () => {
  it('160 madde, 16PF sırasıyla 16 ayrı ölçek; bileşik ölçek ve toplam puan yok', () => {
    expect(d.items).toHaveLength(160);
    expect(d.scales.map((s) => s.key)).toEqual(Object.values(SCALES).map(([k]) => k));
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const [key, n] of Object.values(SCALES)) expect(d.items.filter((i) => i.scale === key), key).toHaveLength(n);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(160);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(160);
    expect(new Set(d.items.map((i) => i.source)).size).toBe(160);
    for (const it of d.items) {
      expect(it.source, it.key).toBeTruthy();
      expect(it.text, it.key).toMatch(/[.]$/);
    }
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
    }
    expect(d.status).toBe('active');
    expect(d.licenseStatus).toBe('public_domain');
    expect([d.minGrade, d.maxGrade, d.adults, d.domain]).toEqual([9, 13, true, 'personality']);
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; kaynaktan yalnızca üç madde eksik', () => {
    expect(PAGE.size).toBe(163);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.source, it.key).toBe(page![0]);
      expect(!!it.reverse, it.key).toBe(page![1]);
      expect(SCALES[prefix(it.key)]?.[0], it.key).toBe(it.scale);
    }
    const missing = [...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k));
    expect(missing).toEqual(REMOVED);
    // Kaynakta 163 maddenin 97'si artı, 66'sı eksi yönlüdür; çıkarılan üç madde artı yönlü olduğu için 94 artı, 66 eksi
    // yönlü madde kalır. Kurallara bağlılık: 2 artı, 5 eksi.
    expect([...PAGE.values()].filter(([, rev]) => rev)).toHaveLength(66);
    const g = d.items.filter((i) => i.scale === 'dutifulness');
    expect(g.filter((i) => i.reverse)).toHaveLength(5);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(66);
  });

  it('yasalara, dine ve millî marşa bakışı soran üç madde kullanılmaz; siyasi görüş ya da inanç soran madde yok', () => {
    expect(REMOVED.map((k) => PAGE.get(k)![0])).toEqual([
      'Believe laws should be strictly enforced.',
      'Believe in one true religion.',
      'Like to stand during the national anthem.',
    ]);
    expect(d.items.some((i) => /religio|anthem|laws?\b|vote|liberal|conservative|god\b|politic/i.test(i.source ?? ''))).toBe(false);
    const politics = /(?<!\p{L})(din|dinî|dini|inanç\p{L}*|ibadet|oy|seçim|parti|aday|siyas\p{L}*|yasa\p{L}*|marş\p{L}*)(?!\p{L})/iu;
    for (const it of d.items) expect(politics.test(it.text), it.text).toBe(false);
  });

  it('uygulama sırası: her ölçek teste eşit aralıklarla yayılır, art arda iki madde aynı ölçekten değil', () => {
    for (let i = 1; i < d.items.length; i++) expect(d.items[i].scale, d.items[i].key).not.toBe(d.items[i - 1].scale);
    // İlk 17 maddede 16 ölçeğin hepsi bulunur (13 maddelik Düşünsel özgüven ikinci maddesini 14. sırada verir).
    expect(new Set(d.items.slice(0, 17).map((i) => i.scale)).size).toBe(16);
    expect(d.items[0].key).toBe('a01');
    // Her ölçekte maddeler kaynaktaki sırayla, bir artı bir eksi yönlü dizilir (biri bitince öteki sırayla devam eder);
    // ölçeklerden biri artı, sonraki eksi yönlü bir maddeyle başlar. Sonra her ölçeğin k. maddesi
    // (k + (j + 0,5) / 16) / n konumuna yerleşir (j: ölçeğin sırası, n: madde sayısı).
    const order = Object.keys(SCALES);
    const expected: { key: string; pos: number; j: number }[] = [];
    order.forEach((p, j) => {
      const keys = [...PAGE.keys()].filter((k) => prefix(k) === p && !REMOVED.includes(k));
      const plus = keys.filter((k) => !PAGE.get(k)![1]);
      const minus = keys.filter((k) => PAGE.get(k)![1]);
      const [first, second] = j % 2 === 0 ? [plus, minus] : [minus, plus];
      const own: string[] = [];
      for (let i = 0; i < Math.max(first.length, second.length); i++) own.push(...[first[i], second[i]].filter(Boolean));
      own.forEach((key, k) => expected.push({ key, pos: (k + (j + 0.5) / 16) / own.length, j }));
    });
    expected.sort((x, y) => x.pos - y.pos || x.j - y.j);
    expect(d.items.map((i) => i.key)).toEqual(expected.map((x) => x.key));
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri kullanılır (75 madde)', () => {
    const others = ['alti-boyutlu-kisilik-profili', 'ayrintili-kisilik-profili', 'bes-faktor-kisilik', 'kisilerarasi-tarz', 'duygusal-zeka-bilesenleri'].map((s) =>
      def<LikertInstrument>(s),
    );
    // Ayrıntılı Kişilik Profili'nde İngilizce aslı noktasız yazılmıştır.
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      for (const x of same) expect(it.text, it.source).toBe(x.text);
    }
    expect(shared).toBe(75);
  });

  it('ölçek puanları birbirinden bağımsız; güvenirlik ve standart sapma olmadığı için ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'intellect' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('intellect')!.mean).toBe(5);
    expect(byKey.get('intellect')!.nItems).toBe(13);
    expect(byKey.get('dutifulness')!.mean).toBe(1);
    expect(byKey.get('dutifulness')!.nItems).toBe(7);
    for (const s of d.scales) {
      expect(s.alpha, s.key).toBeUndefined();
      expect(s.sdRef, s.key).toBeUndefined();
    }
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni yazılmış; destek kutusu yalnızca duygusal denge düşük ve endişe yüksekken', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    const support = new Set(['emotional_stability/low', 'anxiety/high']);
    for (const s of d.scales) {
      const summaries = new Set<string>();
      for (const band of ['low', 'average', 'high'] as const) {
        const label = `${s.key}/${band}`;
        const bt = t.scales[s.key]?.[band];
        expect(bt, label).toBeDefined();
        summaries.add(bt!.summary);
        expect(bt!.summary.length, label).toBeGreaterThan(3);
        expect(bt!.summary, label).not.toBe(t.bandLabels[band]);
        expect(bt!.student.length, label).toBeGreaterThan(50);
        expect(bt!.student, label).toContain('söylüyorsun');
        expect(bt!.parent, label).toContain('Çocuğunuz');
        expect(bt!.parent, label).toContain('belirtiyor');
        expect(bt!.student, label).not.toContain('Çocuğunuz');
        // Klinik terimler ve etiketler kullanılmaz.
        expect(`${bt!.student} ${bt!.parent}`, label).not.toMatch(/depresyon|anksiyete|bozukluk|hastalık|paranoya|şüpheci biri|asosyal|tembel/i);
        expect(!!bt!.support, label).toBe(support.has(label));
        // Yetişkin metni yalnızca destek kutusu olan iki metinde: "güvendiğin bir yetişkin" yerine "biri ya da bir uzman".
        expect(!!bt!.adult, label).toBe(support.has(label));
        if (bt!.adult) {
          expect(bt!.student, label).toContain('güvendiğin bir yetişkinle');
          expect(bt!.adult, label).toContain('ruh sağlığı uzmanıyla');
        }
        expect(schoolWords(bt!.adult ?? bt!.student), label).toEqual([]);
      }
      expect(summaries.size, s.key).toBe(3);
    }
    // Düşünsel özgüven zekâyı ölçmez: üç düzeyin de öğrenci ve veli metninde yazılı.
    for (const band of ['low', 'average', 'high'] as const) {
      const bt = t.scales.intellect[band]!;
      expect(bt.student, band).toContain('zekâyı ölçmez');
      expect(bt.parent, band).toContain('zekâyı ölçmez');
    }
    expect(t.overview?.student).toContain('toplam bir puan yoktur');
    expect(t.overview?.parent).toContain('toplam bir puan yoktur');
    // "7–13 cümle" açıklaması ölçeklerin gerçek uzunluğuyla aynı kalmalı.
    const lengths = d.scales.map((s) => d.items.filter((i) => i.scale === s.key).length);
    expect([Math.min(...lengths), Math.max(...lengths)]).toEqual([7, 13]);
    expect(t.overview?.student).toContain('7–13 cümleyle');
  });

  it('bilim kartı ve tanıtım: 16PF’in yerine geçmediği, zekâ ölçmediği, çıkarılan maddeler ve güvenirlik açıkça yazılı', () => {
    expect(d.estimatedMinutes).toBe(20);
    expect(d.intro.paragraphs.join(' ')).toContain('160');
    expect(d.description).toContain('160 cümle');
    expect(d.description).toContain('zekâ ya da yetenek ölçmez');
    expect(d.science.whatItMeasures).toContain('zekâyı ya da akıl yürütme becerisini ölçmez');
    expect(d.science.whatItMeasures).toContain('toplam bir puan');
    expect(d.science.basedOn).toContain('Kaynaktaki 163 maddeden 160’ı');
    expect(d.science.turkishVersion).toContain('75 madde');
    expect(d.science.turkishVersion).toContain('85 madde');
    expect(d.science.turkishVersion).toContain('dinî görüş');
    expect(d.science.turkishVersion).toContain('yedi maddeyle');
    expect(d.science.reliability).toContain('501');
    expect(d.science.reliability).toContain('.73 ile .86');
    expect(d.science.reliability).toContain('.51 ile .77');
    expect(d.science.reliability).toContain('ölçüm payı gösterilmez');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.normStatus).toBe('none');
    expect(d.science.limitations.join(' ')).toContain('16PF’in yerine geçmez');
    const urls = d.science.citations.map((c) => c.url);
    expect(urls).toContain('https://ipip.ori.org/new16PFKey.htm');
    expect(urls).toContain('https://ipip.ori.org/new16PFTable.htm');
    expect(urls).toContain('https://doi.org/10.1016/j.jrp.2005.08.007');
    // Test adında "tanı" ve özgün anketin adı (16PF) geçmez.
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
    expect(`${d.name} ${d.shortName} ${d.tagline}`).not.toContain('16PF');
  });
});

describe('16 Faktörlü Kişilik Profili raporu', () => {
  it('genel bakışta 16 özellik; her biri için düzey ve kısa yorum', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.chartNote).not.toContain('sarı bant');
      // Genel bakışın açıklaması varsayılan grafik notunun yerine geçer: kırmızı işaretin ne olduğunu da söyler.
      expect(rep.chartNote).toContain('Kırmızı işaret');
      // Ölçekler her yerde "özellik" diye anılır: sonuç kartlarının başlığı da.
      expect(rep.itemsTitle).toBe('Özellikler');
      expect(rep.items.map((x) => x.title)).toEqual(NAMES);
      for (const it of rep.items) expect(it.text.length, it.title).toBeGreaterThan(40);
      expect(rep.groups).toBeUndefined();
    }
    expect(r.parent.chartNote).toContain('çıkarılmamalıdır');
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
    expect(r.student.items[0].text).not.toContain('Çocuğunuz');
  });

  it('her özelliğin her düzeyi tek tek: kart, rozet, destek kutusu ve yol haritası birbiriyle tutarlı (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const keys = d.scales.map((s) => s.key);
    const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;
    let n = 0;
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const b = body((x) => (x === s.key ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        const bt = t.scales[s.key][band]!;
        const label = `${s.key}/${band}`;
        const supportExpected = (s.key === 'emotional_stability' && band === 'low') || (s.key === 'anxiety' && band === 'high');
        for (const [rep, text] of [
          [r.student, bt.student],
          [r.parent, bt.parent],
          [adult, bt.adult ?? bt.student],
        ] as const) {
          const item = rep.items[keys.indexOf(s.key)];
          expect(item.text, label).toBe(text);
          expect(item.badge, label).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
          // Öteki 15 özellik orta düzeyde.
          expect(rep.items.filter((x) => x.badge?.startsWith('Orta')).length, label).toBe(band === 'average' ? 16 : 15);
          expect(!!rep.support, `${label} ${rep.audience}`).toBe(supportExpected);
          const rm = rep.roadmap!;
          expect(rm.bars, label).toHaveLength(16);
          expect(rm.study.items, label).toHaveLength(6);
          // Uçtaki özellik en belirgin olandır: öneri kartlarının ilki odur; hepsi ortadaysa profildeki ilk altı.
          if (band === 'average') expect(rm.study.items.map((x) => x.key), label).toEqual(keys.slice(0, 6));
          else expect(rm.study.items[0].key, label).toBe(s.key);
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Çalışma düzeni');
          // 3. hafta: iyi oluş gerekiyorsa o özellik; değilse uçtaki özellik (Düzen ve titizlik 2. haftada olduğu için o
          // uçtaysa ve öteki her şey ortadaysa profildeki ilk özellik).
          const third = band === 'average' || s.key === 'orderliness' ? 'Sıcaklık' : s.name;
          expect(rm.weeks[2].title, label).toBe(third);
          // "Sınav kaygısı" yazısı öğrenciye ve veliye verilir; yetişkine verilmez. Bağlantı adlarında da okula özgü sözcük yok.
          const links = rm.study.links.map((l) => l.href);
          expect(links.includes('/rehber/sinav-kaygisi'), label).toBe(supportExpected && rep.audience !== 'adult');
          if (rep.audience === 'adult') expect(schoolWords(rm.study.links.map((l) => l.label).join(' ')), label).toEqual([]);
          expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 6 : 0);
          for (const x of roadmapTexts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
            if (rep.audience === 'adult') expect(schoolWords(x), `${label}: ${x}`).toEqual([]);
          }
          n++;
        }
      }
    }
    expect(n).toBe(16 * 3 * 3);
  }, 120_000);

  it('destek kutusu: duygusal denge ile endişeye yatkınlığın bütün düzey birleşimlerinde, ötekiler ne olursa olsun', () => {
    const LEVELS: Level[] = ['low', 'mid', 'high'];
    for (const c of LEVELS) {
      for (const o of LEVELS) {
        for (const rest of LEVELS) {
          const r = evaluate(SLUG, body((x) => (x === 'emotional_stability' ? c : x === 'anxiety' ? o : rest)));
          const expected = c === 'low' || o === 'high';
          const label = `denge ${c}, endişe ${o}, öteki ${rest}`;
          expect(!!r.student.support, label).toBe(expected);
          expect(!!r.parent.support, label).toBe(expected);
          // İyi oluş haftası: önce duygusal denge düşük, sonra endişe yüksek.
          const third = r.student.roadmap!.weeks[2].title;
          if (c === 'low') expect(third, label).toBe('Duygusal denge');
          else if (o === 'high') expect(third, label).toBe('Endişeye yatkınlık');
          else expect(['Duygusal denge', 'Endişeye yatkınlık'].includes(third) && rest === 'mid' && o === 'mid' && c === 'mid', label).toBe(false);
        }
      }
    }
  });

  it('öneri kartları: eşiğe eşit uzaklıktaki orta bir puan (2,6) yüksek bir puanın (3,4) önüne geçmez', () => {
    // Sıcaklık 2,6 (orta), Kendi başına olmayı sevme 3,4 (yüksek): ikisi de ortadan 0,4 uzak. Beş özellik en uçta (5),
    // ötekiler tam ortada (3). Altıncı kart yüksek düzeydeki özelliğe verilir.
    const five = new Set(['assertiveness', 'gregariousness', 'friendliness', 'distrust', 'imagination']);
    const seen: Record<string, number> = {};
    const answers = Object.fromEntries(
      d.items.map((it) => {
        const k = (seen[it.scale] = (seen[it.scale] ?? 0) + 1) - 1;
        // Anahtara göre puan: 10 maddede altı 3 ve dört 2 → 2,6; altı 3 ve dört 4 → 3,4.
        const keyed = five.has(it.scale) ? 5 : it.scale === 'warmth' ? (k < 4 ? 2 : 3) : it.scale === 'introversion' ? (k < 4 ? 4 : 3) : 3;
        return [it.key, { value: it.reverse ? 6 - keyed : keyed, rtMs: 2600 }];
      }),
    );
    const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.find((x) => x.label === 'Sıcaklık')).toMatchObject({ value: 2.6, band: 'Orta' });
    expect(rows.find((x) => x.label === 'Kendi başına olmayı sevme')).toMatchObject({ value: 3.4, band: 'Yüksek' });
    const rm = r.parent.roadmap!;
    // Önce en uçtaki beş özellik (profildeki sırayla), sonra yüksek düzeydeki Kendi başına olmayı sevme.
    expect(rm.study.items.map((x) => x.key)).toEqual(['assertiveness', 'gregariousness', 'friendliness', 'distrust', 'imagination', 'introversion']);
    expect(rm.approach!.items.map((x) => x.title)).toContain('Kendi başına olmayı sevme');
    expect(rm.approach!.items.map((x) => x.title)).not.toContain('Sıcaklık');
  });

  it('uç ve orta cevaplar: bütün özellikler aynı düzeyde', () => {
    for (const [level, label] of [['high', 'Yüksek'], ['low', 'Düşük'], ['mid', 'Orta']] as const) {
      const r = evaluate(SLUG, body(() => level, 12));
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(rows.every((x) => x.band === label), level).toBe(true);
      if (level === 'mid') expect(rows.every((x) => x.value === 3)).toBe(true);
    }
  });

  it('yetişkine tek, kişisel rapor; okula ya da ergenliğe özgü sözcük yok', () => {
    for (const level of ['high', 'low', 'mid'] as const) {
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      expect(adult.items).toHaveLength(16);
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(rest)), level).toEqual([]);
      expect(roadmap?.approach, level).toBeNull();
      expect(roadmap?.settings?.title).toBe('İş ve meslek planı için');
    }
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

  it('gelişim yol haritası: 16 sütun, 16 ayrı renk; öneriler en belirgin altı özellik için', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, en belirgin özelliklere göre nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(16);
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => (i * 7) % 5));
    const rm = r.parent.roadmap!;
    expect(rm.preview).toBe(false);
    expect(rm.bars.map((x) => x.label)).toEqual(NAMES);
    expect(rm.bars.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
    expect(rm.study.items).toHaveLength(6);
    expect(rm.approach?.items).toHaveLength(6);
    expect(rm.study.intro).toContain('Aşağıda çocuğunuzun en belirgin altı özelliği (puanı orta noktadan en çok uzaklaşanlar) için öneriler var');
    expect(r.student.roadmap!.study.intro).toContain('Aşağıda en belirgin altı özelliğin (puanı orta noktadan en çok uzaklaşanlar) için öneriler var');
    // Dengeli profilde de ölçekler "özellik" diye anılır.
    const mid = evaluate(SLUG, body(() => 'mid'));
    expect(mid.student.roadmap!.standoutNote).toContain('hiçbir özellik belirgin biçimde öne çıkmıyor');
    expect(mid.parent.roadmap!.standoutNote).toContain('hiçbir özellik belirgin biçimde öne çıkmıyor');
    // Ortam önerisi yazılmayan iki özellik: Düşünsel özgüven (beceriye göre yönlendirme gibi okunmasın) ve Duyarlılık.
    expect(Object.entries(t.scales).filter(([, x]) => !x.settings).map(([k]) => k)).toEqual(['intellect', 'sensitivity']);
    // Rapordaki veli metinlerinde geçen öneriler veliye yaklaşımda tekrar edilmez.
    const tpl = REPORT_TEMPLATES[SLUG];
    for (const [key, byGroup] of Object.entries(t.approach!)) {
      for (const g of ['low', 'average', 'high'] as const) {
        const parentText = tpl.scales[key][g]!.parent;
        for (const sentence of byGroup[g].split(/;\s*/)) expect(parentText, `${key} ${g}`).not.toContain(sentence.replace(/\.$/, ''));
      }
    }
  });

  it('yayında: listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });
});
