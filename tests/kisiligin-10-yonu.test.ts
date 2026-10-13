import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import type { SimpleReport } from '@/lib/reports/simple';
import { likertQuality, scaleItems, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'kisiligin-10-yonu';
const d = def<LikertInstrument>(SLUG);
const prefix = (key: string) => key.slice(0, 3);

/** Yön kısaltması → [ölçek, ad, boyut, Nevrotiklik yönü mü (ters puanlanır)]. */
const ASPECTS: Record<string, [string, string, string, boolean]> = {
  vol: ['composure', 'Soğukkanlılık', 'emotional_stability', true],
  wit: ['security', 'İç rahatlık', 'emotional_stability', true],
  com: ['compassion', 'Şefkat', 'agreeableness', false],
  pol: ['politeness', 'Nezaket', 'agreeableness', false],
  ind: ['industriousness', 'Çalışkanlık', 'conscientiousness', false],
  ord: ['orderliness', 'Düzenlilik', 'conscientiousness', false],
  ent: ['enthusiasm', 'Coşku', 'extraversion', false],
  ass: ['assertiveness', 'Atılganlık', 'extraversion', false],
  int: ['intellect', 'Düşünsel merak', 'openness', false],
  opn: ['aesthetics', 'Sanat ve hayal gücü', 'openness', false],
};
const DOMAINS = ['extraversion', 'agreeableness', 'conscientiousness', 'emotional_stability', 'openness'];
const DOMAIN_NAMES = ['Dışadönüklük', 'Uyumluluk', 'Sorumluluk', 'Duygusal Denge', 'Deneyime Açıklık'];
/** Grafikte ve raporda boyutların altında yönlerin sırası. */
const FACET_ORDER = [
  'enthusiasm',
  'assertiveness',
  'compassion',
  'politeness',
  'industriousness',
  'orderliness',
  'composure',
  'security',
  'intellect',
  'aesthetics',
];

/**
 * IPIP'in BFAS anahtar sayfası (https://ipip.ori.org/BFASKeys.htm), sayfadaki sırayla: her yönde önce artı, sonra eksi
 * yönlü maddeler. Madde anahtarı "yön + sayfadaki sıra"dır.
 */
const SOURCE: Record<string, { plus: string[]; minus: string[] }> = {
  vol: {
    plus: [
      'Get angry easily.',
      'Get upset easily.',
      'Change my mood a lot.',
      'Am a person whose moods go up and down easily.',
      'Get easily agitated.',
      'Can be stirred up easily.',
    ],
    minus: ['Rarely get irritated.', 'Keep my emotions under control.', 'Rarely lose my composure.', 'Am not easily annoyed.'],
  },
  wit: {
    plus: [
      'Am filled with doubts about things.',
      'Feel threatened easily.',
      'Worry about things.',
      'Am easily discouraged.',
      'Become overwhelmed by events.',
      'Am afraid of many things.',
    ],
    minus: ['Seldom feel blue.', 'Feel comfortable with myself.', 'Rarely feel depressed.', 'Am not embarrassed easily.'],
  },
  com: {
    plus: [
      "Feel others' emotions.",
      "Inquire about others' well-being.",
      "Sympathize with others' feelings.",
      "Take an interest in other people's lives.",
      'Like to do things for others.',
    ],
    minus: [
      "Am not interested in other people's problems.",
      "Can't be bothered with other's needs.",
      'Am indifferent to the feelings of others.',
      'Take no time for others.',
      "Don't have a soft side.",
    ],
  },
  pol: {
    plus: ['Respect authority.', 'Hate to seem pushy.', 'Avoid imposing my will on others.', 'Rarely put people under pressure.'],
    minus: [
      'Insult people.',
      'Believe that I am better than others.',
      'Take advantage of others.',
      'Seek conflict.',
      'Love a good fight.',
      'Am out for my own personal gain.',
    ],
  },
  ind: {
    plus: ['Carry out my plans.', 'Finish what I start.', 'Get things done quickly.', 'Always know what I am doing.'],
    minus: [
      'Waste my time.',
      'Find it difficult to get down to work.',
      'Mess things up.',
      "Don't put my mind on the task at hand.",
      'Postpone decisions.',
      'Am easily distracted.',
    ],
  },
  ord: {
    plus: [
      'Like order.',
      'Keep things tidy.',
      'Follow a schedule.',
      'Want everything to be "just right."',
      'See that rules are observed.',
      'Want every detail taken care of.',
    ],
    minus: ['Leave my belongings around.', 'Am not bothered by messy people.', 'Am not bothered by disorder.', 'Dislike routine.'],
  },
  ent: {
    plus: ['Make friends easily.', 'Warm up quickly to others.', "Show my feelings when I'm happy.", 'Have a lot of fun.', 'Laugh a lot.'],
    minus: [
      'Am hard to get to know.',
      'Keep others at a distance.',
      'Reveal little about myself.',
      'Rarely get caught up in the excitement.',
      'Am not a very enthusiastic person.',
    ],
  },
  ass: {
    plus: [
      'Take charge.',
      'Have a strong personality.',
      'Know how to captivate people.',
      'See myself as a good leader.',
      'Can talk others into doing things.',
      'Am the first to act.',
    ],
    minus: [
      'Do not have an assertive personality.',
      'Lack the talent for influencing people.',
      'Wait for others to lead the way.',
      'Hold back my opinions.',
    ],
  },
  int: {
    plus: [
      'Am quick to understand things.',
      'Can handle a lot of information.',
      'Like to solve complex problems.',
      'Have a rich vocabulary.',
      'Think quickly.',
      'Formulate ideas clearly.',
    ],
    minus: [
      'Have difficulty understanding abstract ideas.',
      'Avoid philosophical discussions.',
      'Avoid difficult reading material.',
      'Learn things slowly.',
    ],
  },
  opn: {
    plus: [
      'Enjoy the beauty of nature.',
      'Believe in the importance of art.',
      'Love to reflect on things.',
      'Get deeply immersed in music.',
      'See beauty in things that others might not notice.',
      'Need a creative outlet.',
    ],
    minus: ['Do not like poetry.', 'Seldom get lost in thought.', 'Seldom daydream.', 'Seldom notice the emotional aspects of paintings and pictures.'],
  },
};

/** Kaynaktaki bütün maddeler: anahtar → [İngilizce metin, sayfada eksi yönlü mü]. */
const PAGE = new Map(
  Object.entries(SOURCE).flatMap(([p, { plus, minus }]) =>
    [...plus.map((t) => [t, false] as const), ...minus.map((t) => [t, true] as const)].map(
      ([t, minusKeyed], i) => [`${p}${String(i + 1).padStart(2, '0')}`, [t, minusKeyed] as const] as const,
    ),
  ),
);

/** DeYoung, Quilty ve Peterson (2007) Tablo 5, üniversite örneklemi: α ve standart sapma (1–5 madde ortalaması). */
const TABLE5: Record<string, [number, number]> = {
  emotional_stability: [0.89, 0.7],
  agreeableness: [0.85, 0.56],
  conscientiousness: [0.81, 0.56],
  extraversion: [0.88, 0.63],
  openness: [0.8, 0.52],
  composure: [0.87, 0.82],
  security: [0.81, 0.75],
  compassion: [0.84, 0.65],
  politeness: [0.76, 0.67],
  industriousness: [0.79, 0.7],
  orderliness: [0.72, 0.64],
  enthusiasm: [0.81, 0.73],
  assertiveness: [0.84, 0.71],
  intellect: [0.79, 0.67],
  aesthetics: [0.72, 0.64],
};

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

/** Raporun birlikte yorum maddesi (boyut gruplarından önce). */
const insightOf = (rep: SimpleReport) => rep.items.find((x) => x.title === 'Bir boyutun iki yönü');

describe('Kişiliğin 10 Yönü tanımı', () => {
  it('100 madde; 5 boyut, 10 yön; her yön 10 madde ve tek bir boyuta bağlı', () => {
    expect(d.items).toHaveLength(100);
    const domains = d.scales.filter((s) => s.of);
    const facets = d.scales.filter((s) => !s.of);
    expect(domains.map((s) => s.key)).toEqual(DOMAINS);
    expect(domains.map((s) => s.name)).toEqual(DOMAIN_NAMES);
    expect(facets.map((s) => s.key)).toEqual(FACET_ORDER);
    expect(domains.flatMap((s) => s.of!)).toEqual(FACET_ORDER);
    for (const [, [scale, name, domain]] of Object.entries(ASPECTS)) {
      expect(d.scales.find((s) => s.key === scale)?.name, scale).toBe(name);
      expect(domains.find((x) => x.of!.includes(scale))?.key, scale).toBe(domain);
      expect(d.items.filter((i) => i.scale === scale), scale).toHaveLength(10);
    }
    for (const s of domains) expect(scaleItems(d, s), s.key).toHaveLength(20);
    for (const s of domains) expect(d.items.some((i) => i.scale === s.key)).toBe(false);
    expect(new Set(d.items.map((i) => i.key)).size).toBe(100);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(100);
    expect(new Set(d.items.map((i) => i.source)).size).toBe(100);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    for (const s of d.scales) expect(s.plain.length, s.key).toBeGreaterThan(30);
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain, d.profile]).toEqual([
      'active',
      'public_domain',
      9,
      13,
      true,
      'personality',
      'facets',
    ]);
    expect(d.facetTerms).toEqual({ from: 'iki yönden', subject: 'Yönler', toOne: 'tek bir yöne', ofDomain: 'iki yönünün' });
  });

  it('her madde kaynaktaki metni, yönü ve anahtarıyla aynı; kaynaktaki 100 maddenin hepsi var', () => {
    expect(PAGE.size).toBe(100);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.source, it.key).toBe(page![0]);
      const [scale, , , neuroticism] = ASPECTS[prefix(it.key)];
      expect(it.scale, it.key).toBe(scale);
      // Duygusal Denge yönlerinde (kaynakta Nevrotiklik) artı yönlü maddeler ters puanlanır; ötekilerde eksi yönlüler.
      expect(!!it.reverse, it.key).toBe(neuroticism ? !page![1] : page![1]);
    }
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual([]);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(50);
  });

  it('uygulama sırası: on yön sırayla döner, art arda iki madde aynı boyuttan değil', () => {
    const order = ['vol', 'ent', 'int', 'com', 'ind', 'wit', 'ass', 'opn', 'pol', 'ord'];
    const expected: { key: string; pos: number; j: number }[] = [];
    order.forEach((p, j) => {
      const keys = [...PAGE.keys()].filter((k) => prefix(k) === p);
      const plus = keys.filter((k) => !PAGE.get(k)![1]);
      const minus = keys.filter((k) => PAGE.get(k)![1]);
      const [first, second] = j % 2 === 0 ? [plus, minus] : [minus, plus];
      const own: string[] = [];
      for (let i = 0; i < Math.max(first.length, second.length); i++) own.push(...[first[i], second[i]].filter(Boolean));
      own.forEach((key, k) => expected.push({ key, pos: (k + (j + 0.5) / order.length) / own.length, j }));
    });
    expected.sort((x, y) => x.pos - y.pos || x.j - y.j);
    expect(d.items.map((i) => i.key)).toEqual(expected.map((x) => x.key));
    const domainOf = (scale: string) => d.scales.find((s) => s.of?.includes(scale))!.key;
    for (let i = 1; i < d.items.length; i++) expect(domainOf(d.items[i].scale), d.items[i].key).not.toBe(domainOf(d.items[i - 1].scale));
  });

  it('siyasi görüş, inanç ya da ahlaki görüş soran madde yok', () => {
    expect(d.items.some((i) => /religio|vote|liberal|conservative|god\b|politic|tradition/i.test(i.source ?? ''))).toBe(false);
    const politics = /(?<!\p{L})(din|dinî|dini|inanç\p{L}*|ibadet|oy|seçim|parti|aday|siyas\p{L}*|yasa\p{L}*|marş\p{L}*)(?!\p{L})/iu;
    for (const it of d.items) expect(politics.test(it.text), it.text).toBe(false);
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri (64 madde)', () => {
    const others = [
      'alti-boyutlu-kisilik-profili',
      'ayrintili-kisilik-profili',
      'bes-faktor-kisilik',
      'kisilerarasi-tarz',
      'duygusal-zeka-bilesenleri',
      '16-faktorlu-kisilik-profili',
      'ogrenme-ve-basari-ozellikleri',
    ].map((s) => def<LikertInstrument>(s));
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    const different: string[] = [];
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      if (!same.some((x) => x.text === it.text)) {
        different.push(it.source!);
        continue;
      }
      shared++;
      // Öteki testler bir maddede ayrışıyorsa 9. sınıftan başlayan Ayrıntılı Kişilik Profili'nin çevirisi kullanılır.
      const ayr = def<LikertInstrument>('ayrintili-kisilik-profili').items.find((x) => norm(x.source) === norm(it.source));
      if (new Set(same.map((x) => x.text)).size > 1 && ayr) expect(it.text, it.source).toBe(ayr.text);
    }
    expect(shared).toBe(64);
    expect(different).toEqual([]);
    // Beş Faktör'de "Kolayca üzülürüm" (hüzün); bu testte madde öfke yönündedir: Altı Boyutlu'daki öfke alt özelliğinin çevirisi.
    expect(d.items.find((i) => i.source === 'Get upset easily.')?.text).toBe('Küçük şeylere kolayca bozulurum.');
  });

  it('güvenirlik ve standart sapmalar kaynaktaki tablodan; ölçüm payı hesaplanır', () => {
    for (const s of d.scales) expect([s.alpha, s.sdRef], s.key).toEqual(TABLE5[s.key]);
    const scores = scoreLikert(d, keyedAnswers(() => 'mid'));
    for (const s of scores) {
      expect(s.ciLow, s.scaleKey).toBeDefined();
      expect(s.ciHigh! - s.ciLow!, s.scaleKey).toBeGreaterThan(0);
    }
    // Yönler daha az maddeyle ölçüldüğü için ölçüm payları boyutlarınkinden geniştir (aynı boyutta).
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    const width = (k: string) => byKey.get(k)!.ciHigh! - byKey.get(k)!.ciLow!;
    for (const dom of d.scales.filter((s) => s.of)) for (const f of dom.of!) expect(width(f), f).toBeGreaterThan(width(dom.key));
  });

  it('birbirinin tersini söyleyen beş çift: aynı yönde, biri düz biri ters; çoğuna aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(5);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.scale, x).toBe(b.scale);
      expect(!!a.reverse, x).not.toBe(!!b.reverse);
    }
    const keys = d.oppositePairs!.flat();
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    const q = likertQuality(d, answers);
    expect(q.oppositeAgree).toBe(5);
    expect(q.notes.some((n) => n.includes('Birbirinin tersini söyleyen 5 cümle çiftinden 5 tanesinde'))).toBe(true);
    const plain = likertQuality(d, keyedAnswers(() => 'high'));
    expect(plain.oppositeAgree).toBe(0);
    expect(plain.oppositeDisagree).toBe(0);
  });

  it('bilim kartı ve tanıtım: kaynak, çeviri, güvenirlik, yaş ve sınırlar açıkça yazılı', () => {
    expect(d.intro.paragraphs.join(' ')).toContain('100 kısa cümle');
    expect(d.description).toContain('100 kısa cümle');
    expect(d.description).toContain('zekâ testi değildir');
    expect(d.science.basedOn).toContain('100 maddenin hepsi');
    expect(d.science.turkishVersion).toContain('64 maddenin');
    expect(d.science.turkishVersion).toContain('Türkçe uyarlamasına ulaşılamadı');
    expect(d.science.reliability).toContain('.72 ile .87');
    expect(d.science.reliability).toContain('.80 ile .89');
    expect(d.science.reliability).toContain('.73 ile .86');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.ageNote).toContain('ergenlerle yapılmış yayımlanmış bir çalışmaya ulaşılamadı');
    expect(d.science.limitations.join(' ')).toContain('zekâyı ölçmez');
    expect(d.science.normStatus).toBe('none');
    const urls = d.science.citations.map((c) => c.url);
    for (const u of [
      'https://doi.org/10.1037/0022-3514.93.5.880',
      'https://ipip.ori.org/BFASKeys.htm',
      'https://doi.org/10.1016/j.jrp.2014.07.004',
      'https://doi.org/10.1111/jopy.12020',
      'https://doi.org/10.1080/00223891.2013.806327',
    ]) {
      expect(urls, u).toContain(u);
    }
    // Bilim kartında anılan her çalışma kaynaklarda yer alır.
    const card = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['DeYoung, 2015', 'DeYoung ve ark., 2013', 'DeYoung ve ark., 2014', 'DeYoung ve ark., 2007']) expect(card, a).toContain(a);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
    const src = readFileSync(new URL('../src/content/instruments/kisiligin-10-yonu.ts', import.meta.url), 'utf8');
    expect(src).toContain('(64 madde)');
    expect(src).toContain('Kalan 36 madde');
  });
});

describe('Kişiliğin 10 Yönü raporu', () => {
  it('genel bakışta beş boyut; her boyutun altında iki yön ve kısa yorumları; not "yön" der', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(DOMAIN_NAMES);
      expect(rows.every((x) => x.ciLow !== null && x.ciHigh !== null)).toBe(true);
      expect(rep.groups?.map((g) => g.title)).toEqual(DOMAIN_NAMES);
      expect(rep.groups?.flatMap((g) => g.facets.map((f) => f.label))).toEqual(FACET_ORDER.map((k) => d.scales.find((s) => s.key === k)!.name));
      for (const g of rep.groups!) for (const f of g.facets) expect(f.text.length, f.label).toBeGreaterThan(40);
      expect(rep.groupsNote).toBe(
        'Her boyut, onar cümleyle ölçülen iki yönden oluşur. Yönler daha az cümleye dayandığı için boyutlardan daha az kesindir; sarı bantların daha geniş olması bundandır.',
      );
      expect(rep.itemsTitle).toBe('Boyut boyut ayrıntılar');
      expect(rep.items).toHaveLength(1);
      expect(insightOf(rep)).toBeDefined();
    }
    expect(r.parent.groups![0].text).toContain('Çocuğunuz');
    expect(r.student.groups![0].text).not.toContain('Çocuğunuz');
  });

  it('her boyutun ve yönün düşük, orta ve yüksek düzey metni yazılmış; dil ve destek kutusu kuralları', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t.evaluative).toBeUndefined();
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    for (const s of d.scales) {
      const summaries = new Set<string>();
      for (const band of ['low', 'average', 'high'] as const) {
        const label = `${s.key}/${band}`;
        const bt = t.scales[s.key]?.[band];
        expect(bt, label).toBeDefined();
        summaries.add(bt!.summary);
        expect(bt!.summary, label).not.toBe(t.bandLabels[band]);
        expect(bt!.student.length, label).toBeGreaterThan(80);
        // Öz bildirim dili: öğrenciye "söylüyorsun" ya da (boyutlarda) "Cevaplarına göre", veliye "belirtiyor" ya da "cevaplarına göre".
        expect(bt!.student, label).toMatch(/söylüyorsun|^Cevaplarına göre/);
        expect(bt!.parent, label).toMatch(/^Çocuğunuz(un cevaplarına göre)? /);
        expect(bt!.parent, label).toMatch(/belirtiyor|cevaplarına göre/);
        // Boyut metinleri iki yönün ortalamasını anlatır (yön kartlarıyla çelişmesin); yön metinleri bunu demez.
        if (s.of) expect(bt!.student, label).toContain('yönlerinin ortalaması');
        else expect(bt!.student, label).not.toContain('ortalaması');
        expect(bt!.student, label).not.toMatch(/[Çç]ocuğunuz/);
        expect(`${bt!.student} ${bt!.parent}`, label).not.toMatch(/tembel|disiplinsiz|beceriksiz|yeteneksiz|bozukluk|hastalık|dikkat eksikliği|zeki|aptal|depresyon|kaygı bozukluğu/i);
        expect(bt!.student, label).toMatch(/[.]$/);
        expect(bt!.parent, label).toMatch(/[.]$/);
        // Yetişkin metni yalnızca öğrenci metni okula ya da ergenliğe özgüyse yazılır; yetişkine giden metin okula özgü değildir.
        expect(schoolWords(bt!.adult ?? bt!.student), label).toEqual([]);
        if (bt!.adult) expect(schoolWords(bt!.student).length, label).toBeGreaterThan(0);
        // Destek kutusu yalnızca Duygusal Denge ve İç rahatlık düşükken.
        expect(!!bt!.support, label).toBe(band === 'low' && (s.key === 'emotional_stability' || s.key === 'security'));
      }
      expect(summaries.size, s.key).toBe(3);
    }
    for (const band of ['low', 'average', 'high'] as const) {
      expect(t.scales.intellect[band]!.student, band).toContain('zekâyı ölçmez');
      expect(t.scales.intellect[band]!.parent, band).toContain('zekâyı ölçmez');
    }
  });

  it('her yönün ve boyutun her düzeyi tek tek: grup kartı ve cetvel metni şablondaki metin; destek kutusu doğru (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    let n = 0;
    for (const s of d.scales) {
      const members = s.of ?? [s.key];
      for (const band of ['low', 'average', 'high'] as const) {
        const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;
        const b = body((x) => (members.includes(x) ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        const label = `${s.key}/${band}`;
        const bt = t.scales[s.key][band]!;
        for (const [rep, text] of [
          [r.student, bt.student],
          [r.parent, bt.parent],
          [adult, bt.adult ?? bt.student],
        ] as const) {
          const group = s.of ? rep.groups!.find((g) => g.title === s.name)! : rep.groups!.find((g) => g.facets.some((f) => f.label === s.name))!;
          if (s.of) {
            expect(group.text, label).toBe(text);
            expect(group.badge, label).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
          } else {
            const f = group.facets.find((x) => x.label === s.name)!;
            expect(f.text, label).toBe(text);
            expect(f.band, label).toBe(t.bandLabels[band]);
          }
          // Destek kutusu: Duygusal Denge ya da İç rahatlık düşükse. Yalnızca Sakinlik düşükken boyut da düşük düzeye iner
          // (iki yönün ortalaması: 1 ve 3 → 2,0), kutu boyuttan gelir.
          const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
          const esLow = rows.find((x) => x.label === 'Duygusal Denge')!.band === 'Düşük';
          const secLow = rep.groups!.flatMap((g) => g.facets).find((f) => f.label === 'İç rahatlık')!.band === 'Düşük';
          expect(rep.support !== null, label).toBe(esLow || secLow);
          expect(esLow || secLow, label).toBe(band === 'low' && ['emotional_stability', 'security', 'composure'].includes(s.key));
          n++;
        }
      }
    }
    expect(n).toBe(15 * 3 * 3);
  }, 120_000);

  it('bir boyutun iki yönü: her ayrışma kendi paragrafıyla; ayrışma yoksa kapanış cümlesi; giriş her zaman', () => {
    const t = REPORT_TEMPLATES[SLUG].insight!;
    const lead = t.lead[0].text;
    // Hiç ayrışma yok: giriş ve kapanış.
    for (const level of ['high', 'low', 'mid'] as const) {
      const r = evaluate(SLUG, body(() => level));
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(insightOf(r.student)!.text, level).toBe(`${lead.student}\n\n${t.fallback!.student}`);
      expect(insightOf(r.parent)!.text, level).toBe(`${lead.parent}\n\n${t.fallback!.parent}`);
      expect(insightOf(adult)!.text, level).toBe(`${lead.student}\n\n${t.fallback!.student}`);
    }
    // Her kural tek başına: yalnızca o boyutta bir yön yüksek, öteki düşük.
    expect(t.rules).toHaveLength(10);
    for (const rule of t.rules) {
      const [[hi], [lo]] = Object.entries(rule.when).sort(([, a], [, b]) => (a[0] === 'high' ? -1 : b[0] === 'high' ? 1 : 0));
      const r = evaluate(SLUG, body((x) => (x === hi ? 'high' : x === lo ? 'low' : 'mid')));
      expect(insightOf(r.student)!.text, `${hi}>${lo}`).toBe(`${lead.student}\n\n${rule.text.student}`);
      expect(insightOf(r.parent)!.text, `${hi}>${lo}`).toBe(`${lead.parent}\n\n${rule.text.parent}`);
      // Aynı boyutun iki yönü olmalı.
      const dom = d.scales.find((s) => s.of?.includes(hi))!;
      expect(dom.of, `${hi}>${lo}`).toContain(lo);
      expect(rule.text.student, `${hi}>${lo}`).not.toMatch(/[Çç]ocuğunuz/);
      expect(rule.text.parent, `${hi}>${lo}`).toMatch(/^Çocuğunuzun /);
      expect(schoolWords(rule.text.adult ?? rule.text.student), `${hi}>${lo}`).toEqual([]);
    }
    // Her boyut için iki yön de kuralda (iki yönde).
    for (const dom of d.scales.filter((s) => s.of)) {
      const [a, b] = dom.of!;
      expect(t.rules.some((x) => x.when[a]?.[0] === 'high' && x.when[b]?.[0] === 'low'), dom.key).toBe(true);
      expect(t.rules.some((x) => x.when[b]?.[0] === 'high' && x.when[a]?.[0] === 'low'), dom.key).toBe(true);
    }
    // İki boyutta birden ayrışma: iki paragraf, şablondaki sırayla; kapanış cümlesi yok.
    const r = evaluate(SLUG, body((x) => (x === 'industriousness' || x === 'security' ? 'high' : x === 'orderliness' || x === 'composure' ? 'low' : 'mid')));
    const paras = insightOf(r.student)!.text.split('\n\n');
    expect(paras).toHaveLength(3);
    expect(paras[1]).toMatch(/^Çalışkanlık yönün yüksek, düzenlilik yönün düşük/);
    expect(paras[2]).toMatch(/^İç rahatlık yönün yüksek, soğukkanlılık yönün düşük/);
    // Biri yüksek, öteki orta: ayrışma sayılmaz.
    const near = evaluate(SLUG, body((x) => (x === 'enthusiasm' ? 'high' : 'mid')));
    expect(insightOf(near.student)!.text).toBe(`${lead.student}\n\n${t.fallback!.student}`);
  });

  it('bir boyutun iki yönü ayrışınca boyut kartı "İki yönü ayrışan" metnini gösterir; ayrışmayınca düzey metnini (her boyutta 5 × 5 düzey)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const MEANS: Record<string, number> = { very_low: 1.4, low: 2.2, average: 3, high: 3.8, very_high: 4.6 };
    const group = (b: string) => (b === 'very_low' || b === 'low' ? 'low' : b === 'average' ? 'average' : 'high');
    /** Bir yönün 10 maddesine, yönün ortalaması `mean` olacak (ters maddeler çevrilerek) cevaplar. */
    const aspectAnswers = (scale: string, mean: number) => {
      const own = d.items.filter((i) => i.scale === scale);
      const total = Math.round(mean * own.length);
      const base = Math.floor(total / own.length);
      let extra = total - base * own.length;
      return own.map((it) => {
        const v = base + (extra-- > 0 ? 1 : 0);
        return [it.key, { value: it.reverse ? 6 - v : v, rtMs: 2600 }] as const;
      });
    };
    let n = 0;
    for (const dom of d.scales.filter((s) => s.of)) {
      const [a, b] = dom.of!;
      for (const ba of Object.keys(MEANS)) {
        for (const bb of Object.keys(MEANS)) {
          const answers = Object.fromEntries([
            ...aspectAnswers(a, MEANS[ba]),
            ...aspectAnswers(b, MEANS[bb]),
            ...d.items.filter((i) => i.scale !== a && i.scale !== b).map((i) => [i.key, { value: 3, rtMs: 2600 }] as const),
          ]);
          const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers } });
          const adult = evaluateAdult(SLUG, { grade: ADULT_GRADE, data: { engine: 'likert', answers } }).adult;
          const split = new Set([group(ba), group(bb)]).size === 2 && group(ba) !== 'average' && group(bb) !== 'average';
          for (const rep of [r.student, r.parent, adult]) {
            const label = `${dom.key} ${ba}/${bb} ${rep.audience}`;
            const g = rep.groups!.find((x) => x.title === dom.name)!;
            const sp = t.facetSplit![dom.key];
            // Destek kutusu: İç rahatlık düşükse ya da (ayrışma yokken) Duygusal Denge düşükse.
            const facetBand = (name: string) => rep.groups!.flatMap((x) => x.facets).find((f) => f.label === name)!.band;
            const esGroup = rep.groups!.find((x) => x.title === 'Duygusal Denge')!;
            const esLow = esGroup.badge.startsWith('Düşük') && !esGroup.badge.includes('İki yönü ayrışan');
            expect(rep.support !== null, label).toBe(esLow || facetBand('İç rahatlık') === 'Düşük');
            if (split) {
              expect(g.text, label).toBe(rep.audience === 'parent' ? sp.parent : (rep.audience === 'adult' ? sp.adult : undefined) ?? sp.student);
              expect(g.badge, label).toMatch(/ · İki yönü ayrışan$/);
            } else {
              expect(g.badge, label).not.toContain('İki yönü ayrışan');
              const band = g.badge.split(' · ')[0];
              const key = band === 'Düşük' ? 'low' : band === 'Orta' ? 'average' : 'high';
              const bt = t.scales[dom.key][key]!;
              expect(g.text, label).toBe(rep.audience === 'parent' ? bt.parent : rep.audience === 'adult' ? (bt.adult ?? bt.student) : bt.student);
            }
            n++;
          }
        }
      }
    }
    expect(n).toBe(5 * 25 * 3);
    // Ayrışma metni her boyutta iki yönün adını anar.
    for (const dom of d.scales.filter((s) => s.of)) {
      const names = dom.of!.map((k) => d.scales.find((s) => s.key === k)!.name.toLocaleLowerCase('tr-TR'));
      for (const name of names) expect(t.facetSplit![dom.key].student, dom.key).toContain(name.split(' ')[0]);
    }
  }, 120_000);

  it('cevaplanmayan maddeler: yönü hesaplanamazsa birlikte yorum o yön için kural uygulamaz, rapor yine üretilir', () => {
    const answers = keyedAnswers((x) => (x === 'enthusiasm' ? 'high' : 'mid'));
    for (const it of d.items.filter((i) => i.scale === 'assertiveness').slice(0, 4)) delete (answers as Record<string, unknown>)[it.key];
    const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers } });
    const lead = REPORT_TEMPLATES[SLUG].insight!.lead[0].text.student;
    expect(insightOf(r.student)!.text.startsWith(lead)).toBe(true);
    expect(r.student.groups?.[0].facets[1].band).toBe('Hesaplanamadı');
  });

  it('uç ve orta cevaplar: bütün boyutlar ve yönler aynı düzeyde', () => {
    for (const [level, label] of [['high', 'Yüksek'], ['low', 'Düşük'], ['mid', 'Orta']] as const) {
      const r = evaluate(SLUG, body(() => level, 12));
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(rows.every((x) => x.band === label), level).toBe(true);
      expect(r.student.groups!.flatMap((g) => g.facets).every((f) => f.band === label), level).toBe(true);
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
      for (const x of roadmapTexts(roadmap!)) expect(x, level).not.toMatch(/kitap|ders|sınav|öğretmen/i);
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

describe('Kişiliğin 10 Yönü gelişim yol haritası', () => {
  it('on yön, on ayrı renk; her boyutun iki yönü aynı renk ailesinde; ortamlar var', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, en belirgin yönlere göre nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(FACET_ORDER);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(10);
    expect(t.focus?.count).toBe(5);
    expect(t.planningScale).toBe('industriousness');
    expect(t.wellbeing).toEqual([
      { scale: 'security', group: 'low' },
      { scale: 'composure', group: 'low', link: null },
    ]);
    expect(t.sources.every((s) => s.url?.startsWith('https://doi.org/'))).toBe(true);
  });

  it('her yönün her düzeyi: on sütun, beş öneri kartı, haftalar ve iyi oluş haftası tutarlı (öğrenci, veli, yetişkin)', () => {
    let n = 0;
    for (const key of FACET_ORDER) {
      for (const band of ['low', 'average', 'high'] as const) {
        const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;
        const b = body((x) => (x === key ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        for (const rep of [r.student, r.parent, adult]) {
          const label = `${key}/${band}/${rep.audience}`;
          const rm = rep.roadmap!;
          expect(rm.bars.map((x) => x.key), label).toEqual(FACET_ORDER);
          expect(rm.study.items, label).toHaveLength(5);
          // Uçtaki yön ilk karttır.
          if (band !== 'average') expect(rm.study.items[0].key, label).toBe(key);
          const wellbeing = band === 'low' && (key === 'security' || key === 'composure');
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Çalışma düzeni');
          if (wellbeing) expect(rm.weeks[2].title, label).toBe(d.scales.find((s) => s.key === key)!.name);
          const exam = rep.audience !== 'adult' && band === 'low' && key === 'security';
          expect(rm.study.links.map((l) => l.href), label).toEqual(['/rehber/etkili-ders-calisma-yontemleri', ...(exam ? ['/rehber/sinav-kaygisi'] : [])]);
          expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 5 : 0);
          for (const x of roadmapTexts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
          }
          n++;
        }
      }
    }
    expect(n).toBe(10 * 3 * 3);
  }, 120_000);

  it('veliye yaklaşım önerileri aynı yönün "Bu hafta dene" metinlerini tekrar etmez', () => {
    const t = ROADMAPS[SLUG];
    for (const [key, sc] of Object.entries(t.scales)) {
      for (const g of ['low', 'average', 'high'] as const) {
        const actions = Object.values(t.scales)
          .flatMap((x) => [x.action[g].parent, x.study[g].parent])
          .join(' ');
        for (const sentence of t.approach![key][g].split(/(?<=[.;:])\s+/)) {
          if (sentence.length < 25) continue;
          expect(actions, `${key} ${g}: ${sentence}`).not.toContain(sentence.replace(/[.;:]$/, ''));
        }
      }
      void sc;
    }
  });

  it('yol haritası raporun kendi cümlelerini tekrar etmez', () => {
    const t = ROADMAPS[SLUG];
    const tpl = REPORT_TEMPLATES[SLUG];
    const report = Object.values(tpl.scales)
      .flatMap((x) => Object.values(x).flatMap((b) => [b!.student, b!.parent, b!.adult ?? '']))
      .concat(tpl.insight!.rules.flatMap((r) => [r.text.student, r.text.parent]))
      .join(' ');
    for (const [key, sc] of Object.entries(t.scales)) {
      for (const g of ['low', 'average', 'high'] as const) {
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

describe('Kişiliğin 10 Yönü yayında', () => {
  it('listelerde ve site haritasında; Ayrıntılı Kişilik Profili ile Altı Boyutlu arasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    const order = publicInstruments().map((i) => i.slug);
    expect(order.indexOf(SLUG)).toBe(order.indexOf('ayrintili-kisilik-profili') + 1);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /ONYON_GOVDE=.*?n=(\{[^}]*\})/.exec(yml);
    expect(m).not.toBeNull();
    const n = JSON.parse(m![1]) as Record<string, number>;
    const keys = Object.entries(n).flatMap(([k, c]) => Array.from({ length: c }, (_, i) => `${k}${String(i + 1).padStart(2, '0')}`));
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
    expect(yml).toContain('/api/rapor/kisiligin-10-yonu');
  });
});
