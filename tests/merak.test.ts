import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { SECICI_GOALS } from '@/content/test-secici';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import type { SimpleReport } from '@/lib/reports/simple';
import { likertQuality, scoreLikert } from '@/lib/scoring/likert';
import { NOT_SHAREABLE, isShareable } from '@/lib/share/card';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'merak';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['knowledge', 'novelty'];
const NAMES = ['Bilgi merakı', 'Yenilik merakı'];
const PREFIX: Record<string, string> = { knowledge: 'bil', novelty: 'yen' };
const BANDS = ['low', 'average', 'high'] as const;
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in anahtar sayfaları: bilgi merakı IPIP-HEXACO "Inquisitiveness" (https://ipip.ori.org/newHEXACO_PI_key.htm),
 * yenilik merakı IPIP-NEO "Adventurousness" (O4; https://ipip.ori.org/newNEOFacetsKey.htm, arşiv kopyasından okundu); her
 * ölçekte sayfanın artı ve eksi yönlü maddeleri, sayfadaki sırayla.
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number }> = {
  knowledge: {
    plus: [
      'Am interested in science.',
      'Would love to explore strange places.',
      'Enjoy intellectual games.',
      'Love to read challenging material.',
      'Find political discussions interesting.',
      'Have a rich vocabulary.',
    ],
    minus: [
      "Don't know much about history.",
      'Avoid difficult reading material.',
      "Don't bother worrying about political and social problems.",
      'Will not probe deeply into a subject.',
    ],
    alpha: 0.78,
  },
  novelty: {
    plus: ['Prefer variety to routine.', 'Like to visit new places.', 'Am interested in many things.', 'Like to begin new things.'],
    minus: [
      'Prefer to stick with things that I know.',
      'Dislike changes.',
      "Don't like the idea of change.",
      'Am a creature of habit.',
      'Dislike new foods.',
      'Am attached to conventional ways.',
    ],
    alpha: 0.77,
  },
};

/** Kaynaktaki bütün maddeler: anahtar → [ölçek, İngilizce metin, ters puanlanır mı]. */
const PAGE = new Map(
  Object.entries(KEY).flatMap(([scale, { plus, minus }]) =>
    [...plus.map((t) => [t, false] as const), ...minus.map((t) => [t, true] as const)].map(
      ([t, rev], i) => [`${PREFIX[scale]}${String(i + 1).padStart(2, '0')}`, [scale, t, rev] as const] as const,
    ),
  ),
);

/** Bu testte ilk kez çevrilen beş madde (iki taslakla). */
const NEW_ITEMS: Record<string, string> = {
  'Like to visit new places.': 'Yeni yerler görmeyi severim.',
  'Like to begin new things.': 'Yeni şeylere başlamayı severim.',
  "Don't like the idea of change.": 'Bir şeylerin değişecek olması canımı sıkar.',
  'Am a creature of habit.': 'Çoğu şeyi alıştığım biçimde yaparım.',
  'Dislike new foods.': 'Tanımadığım yemekleri denemekten çekinirim.',
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

/** Bir düzey birleşiminde uyan birlikte yorum kuralları. */
function firedRules(g: Record<string, string>) {
  const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
  return REPORT_TEMPLATES[SLUG].insight!.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
}
const COMBOS = BANDS.flatMap((a) => BANDS.map((b) => ({ knowledge: a, novelty: b }) as Record<string, (typeof BANDS)[number]>));

const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
const OTHERS = INSTRUMENTS.filter((x) => x.slug !== SLUG && x.engine === 'likert') as LikertInstrument[];

describe('Merak tanımı', () => {
  it('20 madde, iki ayrı ölçek (10, 10); toplam puan ve bileşik ölçek yok; güvenirlik var, ölçüm payı yok', () => {
    expect(d.items).toHaveLength(20);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s).length)).toEqual([10, 10]);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(20);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(20);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
      // IPIP sayfasındaki α; standart sapma bilinmediği için ölçüm payı gösterilmez.
      expect(s.alpha, s.key).toBe(KEY[s.key].alpha);
      expect(s.sdRef, s.key).toBeUndefined();
    }
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain, d.estimatedMinutes, d.version]).toEqual([
      'active',
      'public_domain',
      9,
      13,
      true,
      'personality',
      4,
      1,
    ]);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
    // Sitede kullanılan öteki ölçek adlarıyla karışmaz.
    for (const name of ['Düşünsel merak', 'Değişime açıklık', 'Yeniliğe açıklık', 'Öğrenmeye açıklık']) expect(JSON.stringify(d.scales)).not.toContain(name);
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; iki ölçeğin bütün maddeleri sorulur', () => {
    expect(PAGE.size).toBe(20);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.scale, it.key).toBe(page![0]);
      expect(it.source, it.key).toBe(page![1]);
      expect(!!it.reverse, it.key).toBe(page![2]);
    }
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual([]);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(10);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s && i.reverse).length)).toEqual([4, 6]);
    // Bilgi merakı Altı Boyutlu'nun "Merak" alt özelliğiyle aynı sırada anahtarlanır (bil01 = inqu01).
    const alti = def<LikertInstrument>('alti-boyutlu-kisilik-profili');
    for (const it of d.items.filter((x) => x.scale === 'knowledge')) {
      const a = alti.items.find((x) => x.key === `inqu${it.key.slice(3)}`)!;
      expect(a.source, it.key).toBe(it.source);
      expect(!!a.reverse, it.key).toBe(!!it.reverse);
      expect(a.text, it.key).toBe(it.text);
    }
  });

  it('uygulama sırası: iki ölçek dönüşümlü; aynı yönde en çok üç madde; benzer ve karşıt maddeler birbirinden uzak', () => {
    const scales = d.items.map((i) => i.scale);
    for (let i = 1; i < scales.length; i++) expect(scales[i], d.items[i].key).not.toBe(scales[i - 1]);
    let run = 1;
    for (let i = 1; i < d.items.length; i++) {
      run = !!d.items[i].reverse === !!d.items[i - 1].reverse ? run + 1 : 1;
      expect(run, d.items[i].key).toBeLessThanOrEqual(3);
    }
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('bil04', 'bil08', 10); // zor metinleri okumayı severim / kaçınırım
    far('bil05', 'bil09', 10); // iki siyaset maddesi
    far('yen01', 'yen05', 10); // çeşitlilik / bildiklerine bağlı kalma
    far('yen06', 'yen07', 10); // iki değişiklik maddesi
    for (const [a, b] of [
      ['yen01', 'yen08'],
      ['yen05', 'yen08'],
      ['yen05', 'yen10'],
      ['yen08', 'yen10'],
      ['yen01', 'yen10'],
    ]) {
      far(a, b, 6); // alışkanlık ve alışılmış düzen maddeleri
    }
    far('bil02', 'yen02', 6); // iki yer maddesi
    far('bil01', 'yen03', 6); // iki "ilgi duyarım" maddesi
    far('bil08', 'bil10', 6); // iki derinlik maddesi
    far('bil04', 'bil10', 6);
    far('bil04', 'bil09', 6); // "kafa yormam" iki ayrı anlamda
    // Aynı sözle başlayan maddeler art arda gelmez.
    for (let i = 1; i < d.items.length; i++) {
      const first = (t: string) => t.split(' ').slice(0, 2).join(' ');
      expect(first(d.items[i].text), d.items[i].key).not.toBe(first(d.items[i - 1].text));
    }
    // İlk madde yumuşak bir başlangıçtır.
    expect(d.items[0].key).toBe('bil02');
    expect(d.items[0].reverse).toBeUndefined();
  });

  it('öteki testlerdeki aynı maddelerle aynı çeviri (15 madde); yeni beş çeviri; örtüşme sayıları bilim kartındakiyle aynı', () => {
    let n = 0;
    for (const it of d.items) {
      // Çocuk Kişilik Profili'nin çevirileri çocuklara göre yazılmıştır.
      const same = OTHERS.filter((o) => o.slug !== 'cocuk-kisilik-profili').flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) {
        expect(NEW_ITEMS[it.source!], it.source).toBe(it.text);
        continue;
      }
      n++;
      for (const x of same) expect(x.text, it.source).toBe(it.text);
    }
    expect(n).toBe(15);
    expect(Object.keys(NEW_ITEMS)).toHaveLength(5);
    const count = (slug: string) => {
      const o = OTHERS.find((x) => x.slug === slug)!;
      return d.items.filter((it) => o.items.some((x) => norm(x.source) === norm(it.source))).length;
    };
    const COUNTS: Record<string, number> = {
      'alti-boyutlu-kisilik-profili': 10,
      'ayrintili-kisilik-profili': 5,
      'ogrenme-ve-basari-ozellikleri': 5,
      'kisiligin-10-yonu': 2,
      'dusunmeyi-sevme-olcegi': 2,
      'dusunme-ve-calisma-tarzi': 2,
      'bes-faktor-kisilik': 1,
      '16-faktorlu-kisilik-profili': 1,
      'heyecan-arayisi': 1,
    };
    for (const [slug, c] of Object.entries(COUNTS)) expect(count(slug), slug).toBe(c);
    // Başka testte ortak madde yok.
    for (const o of OTHERS.filter((x) => !(x.slug in COUNTS) && x.slug !== 'cocuk-kisilik-profili')) expect(count(o.slug), o.slug).toBe(0);
    const lim = d.science.limitations.join(' ');
    expect(lim).toContain('20 cümlenin 15’i');
    const WORDS = ['onu', 'beşi', 'beşi', 'ikisi', 'ikisi', 'ikisi'];
    for (const [i, slug] of Object.keys(COUNTS).entries()) {
      const name = OTHERS.find((x) => x.slug === slug)!.name;
      expect(lim, slug).toContain(name);
      if (i < WORDS.length) expect(lim, slug).toContain(`${WORDS[i]} ${name}’`);
    }
    // Ayrıntılı'daki "Değişime açıklık" (4) ve Öğrenme ve Başarı'daki "Öğrenmeye açıklık" (3) cümleleri.
    const inScale = (slug: string, scale: string) => {
      const o = OTHERS.find((x) => x.slug === slug)!;
      return d.items.filter((it) => it.scale === 'novelty' && o.items.some((x) => x.scale === scale && norm(x.source) === norm(it.source))).length;
    };
    expect(inScale('ayrintili-kisilik-profili', 'adventurousness')).toBe(4);
    expect(inScale('ogrenme-ve-basari-ozellikleri', 'openness')).toBe(3);
    expect(lim).toContain('dört cümlesi Ayrıntılı Kişilik Profili’nin “Değişime açıklık”');
    expect(lim).toContain('üçü Öğrenme ve Başarı Özellikleri’nin “Öğrenmeye açıklık”');
    expect(d.science.turkishVersion).toContain('15 maddenin');
    expect(d.science.turkishVersion).toContain('Kalan 5 madde');
    // Heyecan Arayışı'nın örtüşme notu bu testi de anar.
    expect(def<LikertInstrument>('heyecan-arayisi').science.limitations.join(' ')).toContain('Merak testinin bilgi merakı yönünde');
  });

  it('birbirinin tersini söyleyen üç çift: biri düz biri ters, aynı ölçekte; ikisine aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(3);
    // Bilim kartı kuralı doğru anlatır: eşik çiftlerin yarısıdır (likert.ts: n >= ceil(çift / 2)).
    expect(d.science.limitations.join(' ')).toContain('üç cümle çiftinden (ikisi bilgi merakında, biri yenilik merakında) en az ikisinde');
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.reverse, x).toBeUndefined();
      expect(b.reverse, y).toBe(true);
      expect(a.scale, x).toBe(b.scale);
    }
    expect(d.oppositePairs!.map(([x]) => d.items.find((i) => i.key === x)!.scale)).toEqual(['knowledge', 'knowledge', 'novelty']);
    // Tek çift uyarı vermez; iki çift verir.
    const answersFor = (keys: string[]) => Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    expect(likertQuality(d, answersFor(d.oppositePairs![0])).notes.some((x) => x.includes('cümle çiftinden'))).toBe(false);
    const two = likertQuality(d, answersFor(d.oppositePairs!.slice(0, 2).flat()));
    expect(two.notes.some((x) => x.includes('Birbirinin tersini söyleyen 3 cümle çiftinden 2 tanesinde'))).toBe(true);
    // İki çiftte iki cümleye de "hayır" uyarı verir; bir çiftte "evet", birinde "hayır" vermez (yönler ayrı sayılır).
    const answersWith = (yes: string[], no: string[]) =>
      Object.fromEntries(d.items.map((it) => [it.key, { value: yes.includes(it.key) ? 5 : no.includes(it.key) ? 1 : 3, rtMs: 2600 }]));
    const twoNo = likertQuality(d, answersWith([], d.oppositePairs!.slice(0, 2).flat()));
    expect(twoNo.oppositeDisagree).toBe(2);
    expect(twoNo.notes.some((x) => x.includes('3 cümle çiftinden 2 tanesinde') && x.includes('“hayır”'))).toBe(true);
    const mixed = likertQuality(d, answersWith(d.oppositePairs![0], d.oppositePairs![2]));
    expect([mixed.oppositeAgree, mixed.oppositeDisagree]).toEqual([1, 1]);
    expect(mixed.notes.some((x) => x.includes('cümle çiftinden'))).toBe(false);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(d, keyedAnswers(() => level));
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'novelty' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('novelty')!.mean).toBe(5);
    expect(byKey.get('knowledge')!.mean).toBe(1);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde yazar ve yılıyla anılıyor; kaynak doğrulaması, öz bildirim sınırı, yaş notu', () => {
    const s = d.science;
    expect(JSON.stringify(d)).not.toMatch(/YAZILACAK|TASLAK|ÖRTÜŞME/);
    expect(s.citations.length).toBeGreaterThanOrEqual(20);
    for (const c of s.citations) expect(c.url, c.text).toMatch(/^https:\/\//);
    const card = JSON.stringify({ ...s, citations: [] });
    for (const c of s.citations.filter((x) => !/^(IPIP|Goldberg)/.test(x.text))) {
      const author = c.text.split(/[,(]/)[0].trim();
      const year = /\((\d{4})\)/.exec(c.text)![1];
      expect(card, author).toContain(author);
      expect(card, `${author} ${year}`).toMatch(new RegExp(`${author}[^()]{0,40}\\(?${year}`, 'u'));
    }
    // IPIP sayfalarındaki sayılar ve kaynak doğrulaması.
    for (const x of ['.78', '.77', '.73 (ölçüm hatası düzeltilince .94', '.71 (ölçüm hatası düzeltilince .99', '.64', 'Tablolar örneklemi belirtmez', 'arşiv kopyasından', 'yedisi']) {
      expect(s.reliability, x).toContain(x);
    }
    expect(s.citations.some((c) => c.url === 'https://ipip.ori.org/newNEOFacetsKey.htm')).toBe(true);
    expect(s.citations.some((c) => c.url?.startsWith('https://ipip-remaster.vercel.app/archive/'))).toBe(true);
    expect(s.basedOn).toContain('arşiv kopyası');
    expect(s.basedOn).toContain('20 madde');
    expect(s.whatItMeasures).toContain('toplam bir puan hesaplanmaz');
    expect(s.whatItMeasures).toContain('birebir aynı değildir');
    // Notlarla ilişki küçük ve neden-sonuç değil; tahmin etmek hatırlamayı artırmadı.
    expect(s.whatItMeasures).toContain('tek başına notları yükselttiğini göstermez');
    expect(s.whatItMeasures).toContain('hatırlanan toplam bilgiyi artırmamıştır');
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    expect(s.turkishVersion).toContain('336 yetişkin');
    const lim = s.limitations.join(' ');
    for (const x of ['zekâyı, bilgiyi ya da ne kadar başarılı olduğunu ölçmez', 'Tanı koymaz', '“doğru” deme eğilimi', 'siyasete', 'alerji', 'olduğundan biraz daha meraklı']) {
      expect(lim, x).toContain(x);
    }
  });

  it('hep aynı cevap ve çok hızlı cevap kalite notu verir', () => {
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).straightLining).toBe(true);
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
  });
});

describe('Merak raporu', () => {
  it('genel bakışta iki yön; ilk madde "Birlikte bakınca", ardından her yön; karşılaştırma bilgisi', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.items.map((x) => x.title)).toEqual(['Birlikte bakınca', ...NAMES]);
      // Gelişimini karşılaştır: iki ölçek, ölçüm payı bilinmiyor.
      expect(rep.compare!.scales.map((s) => s.key)).toEqual(SCALES);
      expect(rep.compare!.scales.every((s) => s.sem === null)).toBe(true);
      expect(rep.compare!.version).toBe(1);
    }
    expect(r.parent.items[1].text).toContain('Çocuğunuz');
    expect(r.student.items[1].text).not.toContain('Çocuğunuz');
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni yazılmış; dil kuralları; kartlar öteki yönden söz etmez', () => {
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
        expect(`${bt.student} ${bt.parent}`.toLocaleLowerCase('tr-TR'), label).not.toMatch(
          /ilgisiz|meraksız|tutucu|sıkıcı biri|kafası çalış|zayıf|başarısız|yetersiz|kusurlu|bozukluk|hastalık|(?<!\p{L})tanı(?!\p{L})/u,
        );
        // Veli metninde "sen" dili yok.
        expect(bt.parent, label).not.toMatch(/söylüyorsun|(?<!\p{L})(sana|seni|senin)(?!\p{L})/u);
        expect(!!bt.support, label).toBe(false);
        expect(bt.adult, label).toBeUndefined();
        expect(schoolWords(bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
        // Her kart yalnızca kendi yönünü anlatır.
        const text = `${bt.student} ${bt.parent}`;
        if (s === 'knowledge') expect(text, label).not.toMatch(/değiş|alışkanl|alıştı|düzen|çeşitlilik|yemek|rutin|yeni yer/i);
        if (s === 'novelty') expect(text, label).not.toMatch(/okum|metin|bilim|tarih|siyas|toplumsal|kelime|derinine|zekâ|kafa yor/i);
      }
      expect(summaries.size, s).toBe(3);
    }
    // Düşük düzeyler kişiyi yargılamaz; bilgi merakı zekâ gibi okunmaz.
    expect(t.scales.knowledge.low!.student).toContain('bir değer yargısı değildir ve zekâyı göstermez');
    expect(t.scales.novelty.low!.student).toContain('güven kaynağıdır');
    expect(t.scales.knowledge.low!.summary).toBe('Bilgi peşine pek düşmeyen');
    // Bilgi merakının kartları tarihten söz etmez (tarih cümlesi bilgiyi sorar, ilgiyi değil).
    for (const band of BANDS) expect(`${t.scales.knowledge[band]!.student} ${t.scales.knowledge[band]!.parent}`).not.toMatch(/tarih/i);
    // Genel bakış: başarı notu ya da zekâ değil.
    expect(t.overview!.student).toContain('ne kadar zeki ya da bilgili olduğunu değil');
  });

  it('her ölçeğin her düzeyi tek tek: kart, rozet ve yol haritası tutarlı; destek kutusu yok (öğrenci, veli, yetişkin)', () => {
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
          [adult, bt.adult ?? bt.student],
        ] as const) {
          const item = rep.items[1 + SCALES.indexOf(s)];
          expect(item.text, label).toBe(text);
          expect(item.badge, label).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
          expect(rep.support, label).toBeNull();
          const rm = rep.roadmap!;
          expect(rm.bars.map((x) => x.label), label).toEqual(NAMES);
          expect(rm.study.items.map((x) => x.key), label).toEqual(SCALES);
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Önce tahmin et');
          expect(rm.weeks, label).toHaveLength(4);
          expect(rm.study.links.map((l) => l.href), label).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
          expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 2 : 0);
          for (const x of roadmapTexts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
            if (rep.audience === 'adult') expect(schoolWords(x), `${label}: ${x}`).toEqual([]);
          }
          n++;
        }
      }
    }
    expect(n).toBe(2 * 3 * 3);
  }, 120_000);

  it('Birlikte bakınca: giriş her raporda; kurallar birbirini dışlar; 3² birleşimin hepsinde metin tutarlı', () => {
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
        const label = `${g.knowledge}/${g.novelty} ${who}`;
        const pick = (x: { student: string; parent: string; adult?: string }) =>
          who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student;
        const extra = rules.length ? rules.map((x) => pick(x.text)) : t.fallback ? [pick(t.fallback)] : [];
        expect(insightOf(rep)!.text, label).toBe([pick(lead), ...extra].join('\n\n'));
        if (who !== 'parent') expect(insightOf(rep)!.text, label).not.toMatch(/[Çç]ocuğunuz/);
        if (who === 'adult') {
          expect(schoolWords(insightOf(rep)!.text), label).toEqual([]);
          expect(insightOf(rep)!.text, label).not.toMatch(/gençler|okul|not ortalaması/);
        }
        n++;
      }
    }
    expect(n).toBe(9 * 3);
    // Veli metinlerinde "sen" dili, öğrenci metinlerinde "Çocuğunuz" yok.
    for (const x of [...t.rules.map((r) => r.text), t.fallback!]) {
      expect(x.parent, x.parent.slice(0, 40)).not.toMatch(/söylüyorsun|görebilirsin|(?<!\p{L})(sana|seni|senin|sen)(?!\p{L})/u);
      expect(x.student, x.student.slice(0, 40)).not.toMatch(/[Çç]ocuğunuz|belirtiyor(?!sun)/);
    }
    expect(lead.parent).not.toMatch(/(?<!\p{L})(sana|seni|senin|sen)(?!\p{L})/u);
    // Her birleşimde en çok bir kural çıkar.
    for (const g of COMBOS) expect(firedRules(g).length, JSON.stringify(g)).toBeLessThanOrEqual(1);
    // Her kural en az bir birleşimde uyar.
    for (const x of t.rules) expect(COMBOS.some((g) => firedRules(g).includes(x)), x.text.student.slice(0, 40)).toBe(true);
    // Bir yön yüksek, öteki düşükken her zaman bir kural çıkar; ikisi de yüksek ya da ikisi de düşükken de.
    for (const g of COMBOS) {
      const v = Object.values(g);
      if (!v.includes('average')) expect(firedRules(g).length, JSON.stringify(g)).toBe(1);
    }
    // Kurallar kartlarla çelişmez: bir kural bir yönü "yüksek" ya da "düşük" diye anıyorsa o yön o düzeydedir.
    const mentions: [RegExp, string, string][] = [
      [/^Yeni bilgiler öğrenmeye ilgi duyduğunu/, 'knowledge', 'high'],
      [/^Yeni deneyimlerden ve değişiklikten hoşlandığını/, 'novelty', 'high'],
      [/“Yenilik merakı” yönünde ise puanın düşük/, 'novelty', 'low'],
      [/“Bilgi merakı” yönünde ise puanın düşük/, 'knowledge', 'low'],
      [/^İki yönde de puanın yüksek/, 'knowledge', 'high'],
      [/^İki yönde de puanın yüksek/, 'novelty', 'high'],
      [/^İki yönde de puanın düşük/, 'knowledge', 'low'],
      [/^İki yönde de puanın düşük/, 'novelty', 'low'],
    ];
    for (const g of COMBOS) {
      for (const x of firedRules(g)) {
        for (const [re, scale, band] of mentions) if (re.test(x.text.student)) expect(g[scale], `${JSON.stringify(g)} ${re}`).toBe(band);
      }
    }
    // İki yön yüksekken başarı notu, ikisi düşükken eksiklik gibi anlatılmaz; bir sonuç vaat edilmez.
    for (const x of t.rules) {
      expect(`${x.text.student} ${x.text.parent}`).not.toMatch(/başarı|eksik|zayıf|yetersiz|üstün|güçlü yan|not(lar)?ın[ıa]? (yüksel|art)/i);
    }
    // Giriş: tanım, bilgideki boşluk, birden çok yüz; öğrenci ve veliye notlarla küçük ilişki ve azalma; yetişkine
    // anketlerin sınırı.
    for (const x of [lead.student, lead.parent, lead.adult!]) {
      expect(x).toContain('iki yönde ayrı ayrı');
      expect(x).toContain('bilgide bir boşluk');
      expect(x).toContain('kalıcı bir yargı değil, bugünün bir resmidir.');
      expect(x).not.toMatch(/YAZILACAK/);
    }
    for (const x of [lead.student, lead.parent]) {
      expect(x).toContain('küçük bir ilişki');
      expect(x).toContain('tek başına notları belirlediği anlamına gelmez');
    }
    expect(lead.adult).toContain('sınırlı ölçüde öngörür');
    expect(lead.student).toContain('Senin sonucun da');
    expect(lead.adult).toContain('Senin sonucun da');
    expect(lead.parent).toContain('Çocuğunuzun sonucu da');
    expect(schoolWords(lead.adult!)).toEqual([]);
    // Giriş ile kurallar aynı cümleyi tekrarlamaz.
    for (const x of t.rules) expect(shared(lead.student, x.text.student), x.text.student.slice(0, 40)).toEqual([]);
  }, 120_000);

  it('uç ve orta cevaplar: iki yön aynı düzeyde; 9.–13. sınıfların hepsinde rapor', () => {
    for (const grade of [9, 10, 11, 12, 13]) {
      for (const [level, label] of [
        ['high', 'Yüksek'],
        ['low', 'Düşük'],
        ['mid', 'Orta'],
      ] as const) {
        const r = evaluate(SLUG, body(() => level, grade));
        const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
        expect(rows.every((x) => x.band === label), `${grade} ${level}`).toBe(true);
        expect(r.parent.items.map((x) => x.title), `${grade}`).toEqual(['Birlikte bakınca', ...NAMES]);
      }
    }
  });

  it('karışık ama ortalaması orta cevaplar: iki yön orta, kalite uyarısı yok, "hiçbir yön öne çıkmıyor" notu', () => {
    // Cevaplar 3, 2, 3, 4 diye döner: art arda aynı cevap yok, karşıt çiftlerde uç cevap birikmez.
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: [3, 2, 3, 4][i % 4], rtMs: 2600 }]));
    expect(likertQuality(d, answers).notes).toEqual([]);
    const b = { grade: 10, data: { engine: 'likert' as const, answers } };
    const r = evaluate(SLUG, b);
    const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
    const t = ROADMAPS[SLUG];
    for (const [rep, note] of [
      [r.student, t.balancedNote!.student],
      [r.parent, t.balancedNote!.parent],
      [adult, t.balancedNote!.adult ?? t.balancedNote!.student],
    ] as const) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.band)).toEqual(['Orta', 'Orta']);
      expect(rep.roadmap!.standoutNote).toBe(note);
      const fallback = REPORT_TEMPLATES[SLUG].insight!.fallback!;
      expect(insightOf(rep)!.text).toContain(rep.audience === 'parent' ? fallback.parent : fallback.student);
      expect(rep.roadmap!.settings!.items).toEqual([]);
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

describe('Merak gelişim yol haritası', () => {
  it('iki sütun, iki ayrı renk; ortamlar var; kaynaklar doğrulanmış', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(2);
    expect(t.planningScale).toBe('knowledge');
    expect(t.sources.every((s) => s.url?.startsWith('https://'))).toBe(true);
    // Yol haritasının kaynakları bilim kartında da var (tahmin etmenin merakı artırması).
    for (const src of t.sources.slice(2)) expect(d.science.citations.some((c) => c.text === src.text), src.text).toBe(true);
    // 2. hafta "Önce tahmin et": her düzeyde tahmin; hatırlamayı artırdığı söylenmez.
    for (const g of BANDS) {
      const a = t.scales.knowledge.action[g];
      for (const x of [a.student, a.parent]) {
        expect(x, g).toMatch(/tahmin/);
        expect(x, g).not.toMatch(/hatırla|akılda kal|unutma/);
      }
    }
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
            if (ni.split('-')[0] === nj.split('-')[0]) continue;
            expect(shared(ti, tj), `${key}/${g} ${ni} – ${nj}`).toEqual([]);
          }
        }
      }
    }
    // Kök düzeyinde de (sözcüklerin ilk beş harfi; bağlaçlar ve yön adlarındaki sözcükler atılır) üç sözcüklük öbek ortak
    // değildir. Veli raporunda bilgi merakının 2. haftası her düzeyde yaklaşım önerileriyle birlikte görünür.
    const STOP = new Set(['bir', 've', 'ya', 'da', 'de', 'ile', 'için', 'gibi', 'bu', 'o', 'onu', 'ona', 'sonra', 'önce', 'daha', 'çok', 'her', 'ise', 'ki']);
    const NAME = new Set(['bilgi', 'yenil', 'merak']);
    const stems = (x: string, n = 3) => {
      const w = (x.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? []).filter((y) => !STOP.has(y)).map((y) => y.slice(0, 5)).filter((y) => !NAME.has(y));
      const out = new Set<string>();
      for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
      return out;
    };
    const sharedStems = (a: string, b: string) => [...stems(a)].filter((x) => stems(b).has(x));
    for (const g of BANDS) {
      for (const [key, sc] of Object.entries(t.scales)) {
        const parts = [
          ['rapor', tpl.scales[key][g]!.parent],
          ['öneri', sc.study[g].parent],
          ['dene', sc.action[g].parent],
          ['yaklaşım', t.approach![key][g]],
        ];
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) expect(sharedStems(parts[i][1], parts[j][1]), `${key}/${g} ${parts[i][0]} – ${parts[j][0]}`).toEqual([]);
        }
      }
      for (const key of Object.keys(t.scales)) {
        for (const h of BANDS) expect(sharedStems(t.scales.knowledge.action[g].parent, t.approach![key][h]), `2. hafta ${g} – yaklaşım ${key}/${h}`).toEqual([]);
      }
    }
    // Veliye yaklaşım önerileri birbirini tekrar etmez.
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect(shared(tips[i], tips[j]), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('bir sayfada aynı dört sözcüklük söz öbeği iki ayrı yerde geçmez (9 birleşim; öğrenci, veli, yetişkin)', () => {
    // "Birlikte bakınca" kuralı kartlardaki tanımı anabilir; öneri kartları (ve girişleri) etkili çalışma yöntemlerini ortak
    // anlatır. Bunların dışında giriş, genel bakış, kartlar, "Kısaca", ortamlar, haftalar ve yaklaşım önerileri ayrı fikirdir.
    // Kök düzeyindeki denetim aynı yön ve düzeyin metinleri için yukarıdadır.
    for (const g of COMBOS) {
      const b = body((x) => LEVEL[g[x]]);
      const r = evaluate(SLUG, b);
      const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
      for (const [rep, who] of [
        [r.student, 'student'],
        [r.parent, 'parent'],
        [adult, 'adult'],
      ] as const) {
        const blocks: [string, string][] = rep.items.map((it) => [
          it.title === 'Birlikte bakınca' ? 'kural' : `kart ${it.title}`,
          it.title === 'Birlikte bakınca' ? it.text.split('\n\n').slice(1).join(' ') : it.text,
        ]);
        const rm = rep.roadmap!;
        // Giriş (araştırma özeti), genel bakış notu, "Kısaca" notu, ortamlar ve öneri girişi de sayfadadır.
        blocks.push(['giriş', insightOf(rep)!.text.split('\n\n')[0]]);
        blocks.push(['genel', rep.chartNote ?? '']);
        if (rm.standoutNote) blocks.push(['kısaca', rm.standoutNote]);
        if (rm.settings) blocks.push(['ortam', [rm.settings.intro, ...rm.settings.items, rm.settings.note].join(' ')]);
        blocks.push(['öneri giriş', rm.study.intro]);
        rm.weeks.forEach((w, i) => blocks.push([`hafta ${i + 1}`, w.text]));
        rm.study.items.forEach((x, i) => blocks.push([`öneri ${i + 1}`, x.text]));
        rm.approach?.items.forEach((x, i) => blocks.push([`yaklaşım ${i + 1}`, x.text]));
        for (let i = 0; i < blocks.length; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const kinds = [blocks[i][0], blocks[j][0]].map((x) => x.split(' ')[0]).sort().join('-');
            if (kinds === 'kart-kural' || kinds === 'öneri-öneri') continue;
            const label = `${g.knowledge}/${g.novelty} ${who}: ${blocks[i][0]} – ${blocks[j][0]}`;
            expect(shared(blocks[i][1], blocks[j][1]), label).toEqual([]);
          }
        }
      }
    }
  }, 120_000);

  it('öneriler kimseyi zorlamaz ve yargılamaz; bir sonuç vaadi yok', () => {
    const t = ROADMAPS[SLUG];
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of [...all, ...Object.values(t.approach!).flatMap((y) => Object.values(y))]) {
      expect(x.toLocaleLowerCase('tr-TR'), x).not.toMatch(/meraksız|ilgisiz|zorla(yın|malı|maya)|(?<!\p{L})zorla(?!\p{L})|mecbur|ceza|garanti|daha iyi hatırla|notların(ı)? (yüksel|art)|öğrenme stili/u);
    }
    expect(t.approach!.knowledge.low).toContain('başka konulara çekmeye çalışmayın');
    expect(t.approach!.novelty.low).toContain('Alışkanlıklarına saygı gösterin.');
  });

  it('son haftada öteki testler önerilir; önerilen testler yetişkinlere de açık', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('düşünmeyi gerektiren işlerden ne kadar hoşlandığını ve heyecan arayışını da görmek');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('Düşünmeyi Sevme ve Heyecan Arayışı testlerinden');
    for (const slug of ROADMAPS[SLUG].nextTests) expect(INSTRUMENTS.find((x) => x.slug === slug)?.adults, slug).toBe(true);
  });
});

describe('Merak yayında', () => {
  it('listelerde ve site haritasında; "Hangi test bana uygun?" sayfasında kişilik alanında; paylaşım kartı yok', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    const kisilik = SECICI_GOALS.find((g) => g.key === 'kisilik')!;
    const i = kisilik.slots.findIndex((s) => s.candidates.includes(SLUG));
    expect(kisilik.slots[i].skill).toBe('Merak');
    expect(kisilik.slots[i - 1].skill).toBe('İnsan ilişkileri');
    expect(isShareable(SLUG)).toBe(false);
    expect(NOT_SHAREABLE[SLUG]).toBe('"yüksek daha iyi" diye okunabilir');
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /MRK_GOVDE=.*?k=(\[[^\]]*\])/.exec(yml);
    expect(m).not.toBeNull();
    const keys = JSON.parse(m![1].replace(/'/g, '"')) as string[];
    expect(keys).toEqual(d.items.map((i) => i.key));
    expect(yml).toContain('"Önce tahmin et"');
    expect(yml).toContain('/api/rapor/merak');
  });
});
