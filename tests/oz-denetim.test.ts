import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
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

const SLUG = 'oz-denetim';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['deliberation', 'discipline', 'restraint'];
const NAMES = ['Düşünerek davranma', 'Öz-disiplin', 'Kendini tutabilme'];
const PREFIX: Record<string, string> = { deliberation: 'dus', discipline: 'dis', restraint: 'tut' };
const BANDS = ['low', 'average', 'high'] as const;
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in NEO-PI-R'ye benzeyen ölçeklerinin anahtar sayfası (https://ipip.ori.org/newNEOFacetsKey.htm): C6 "Cautiousness", C5
 * "Self-Discipline" ve N5 "Immoderation"; her ölçekte sayfanın artı ve eksi yönlü maddeleri, sayfadaki sırayla. N5'te
 * sayfanın artı yönlü maddeleri ölçüsüzlüğü söyler: bu testte ölçek ters çevrildiği için onlar ters puanlanır (`flipped`).
 * N5'in iki yeme maddesi sorulmaz (`omitted`).
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number; flipped?: boolean; omitted?: string[] }> = {
  deliberation: {
    plus: ['Avoid mistakes.', 'Choose my words with care.', 'Stick to my chosen path.'],
    minus: [
      'Jump into things without thinking.',
      'Make rash decisions.',
      'Like to act on a whim.',
      'Rush into things.',
      'Do crazy things.',
      'Act without thinking.',
      'Often make last-minute plans.',
    ],
    alpha: 0.76,
  },
  discipline: {
    plus: ['Get chores done right away.', 'Am always prepared.', 'Start tasks right away.', 'Get to work at once.', 'Carry out my plans.'],
    minus: ['Find it difficult to get down to work.', 'Waste my time.', 'Need a push to get started.', 'Have difficulty starting tasks.', 'Postpone decisions.'],
    alpha: 0.85,
  },
  restraint: {
    plus: ['Often eat too much.', "Don't know why I do some of the things I do.", 'Do things I later regret.', 'Go on binges.', 'Love to eat.'],
    minus: ['Rarely overindulge.', 'Easily resist temptations.', 'Am able to control my cravings.', 'Never spend more than I can afford.', 'Never splurge.'],
    alpha: 0.77,
    flipped: true,
    omitted: ['Often eat too much.', 'Love to eat.'],
  },
};

/** Kaynaktaki bütün maddeler: anahtar → [ölçek, İngilizce metin, bu testte ters puanlanır mı]. */
const PAGE = new Map(
  Object.entries(KEY).flatMap(([scale, { plus, minus, flipped }]) =>
    [...plus.map((t) => [t, !!flipped] as const), ...minus.map((t) => [t, !flipped] as const)].map(
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

/** Bir düzey birleşiminde uyan birlikte yorum kuralları. */
function firedRules(g: Record<string, string>) {
  const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
  return REPORT_TEMPLATES[SLUG].insight!.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
}
const COMBOS = BANDS.flatMap((a) =>
  BANDS.flatMap((b) => BANDS.map((c) => ({ deliberation: a, discipline: b, restraint: c }) as Record<string, (typeof BANDS)[number]>)),
);

describe('Öz-denetim tanımı', () => {
  it('28 madde, üç ayrı ölçek (10, 10, 8); toplam puan ve bileşik ölçek yok', () => {
    expect(d.items).toHaveLength(28);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s).length)).toEqual([10, 10, 8]);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(28);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(28);
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
    // "Temkinlilik" adı sitede başka ölçeklerde kullanılıyor; bu testte kullanılmaz.
    expect(JSON.stringify(d.scales)).not.toContain('Temkinlilik');
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; yalnızca iki yeme maddesi sorulmaz', () => {
    expect(PAGE.size).toBe(30);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.scale, it.key).toBe(page![0]);
      expect(it.source, it.key).toBe(page![1]);
      expect(!!it.reverse, it.key).toBe(page![2]);
    }
    const asked = new Set(d.items.map((i) => i.source));
    const missing = [...PAGE.values()].filter(([, t]) => !asked.has(t)).map(([, t]) => t);
    expect(missing).toEqual(KEY.restraint.omitted);
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual(['tut01', 'tut05']);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(15);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s && i.reverse).length)).toEqual([7, 5, 3]);
    // N5'in ölçüsüzlük maddeleri bu testte ters puanlanır.
    expect(d.items.find((i) => i.key === 'tut04')!.reverse).toBe(true);
    expect(d.items.find((i) => i.key === 'tut07')!.reverse).toBeUndefined();
    // Yeme ve beden maddesi yok.
    for (const it of d.items) expect(`${it.text} ${it.source}`, it.key).not.toMatch(/yemek|yerim|eat|kilo/i);
  });

  it('uygulama sırası: üç ölçek sırayla döner; benzer ve karşıt maddeler birbirinden uzak', () => {
    const scales = d.items.map((i) => i.scale);
    for (let i = 1; i < scales.length; i++) expect(scales[i], d.items[i].key).not.toBe(scales[i - 1]);
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('dis03', 'dis09', 12); // vakit kaybetmeden başlarım / başlamakta zorlanırım
    far('dis04', 'dis06', 12); // hemen işe koyulurum / oturup çalışmaya başlamak zor gelir
    far('dis06', 'dis09', 12); // iki "başlamak zor" maddesi
    far('dis03', 'dis04', 9); // iki "hemen başlarım" maddesi
    far('dis01', 'dis04', 12); // iki "hemen" maddesi
    far('dis08', 'dis09', 9); // iki "başlamak" maddesi
    far('tut06', 'tut04', 9); // nadiren aşırıya kaçarım / kendimi kaptırıp aşırıya kaçarım
    far('tut07', 'tut08', 12); // direnebilirim / kendimi tutabilirim
    far('tut09', 'tut10', 12); // iki para maddesi
    far('dus02', 'dus09', 12); // kelimelerimi özenle seçerim / düşünmeden hareket ederim
    far('dus04', 'dus09', 12); // iki "Düşünmeden" maddesi
    far('dus04', 'dus07', 6); // düşünmeden atılırım / acele edip dalarım
    far('dus05', 'dus07', 6); // aceleci kararlar / acele edip dalarım
    far('dus06', 'dus08', 6); // aklıma estiği gibi / çılgınlıklar
    // Aynı sözle başlayan maddeler art arda gelmez.
    for (let i = 1; i < d.items.length; i++) {
      const first = (t: string) => t.split(' ').slice(0, 2).join(' ');
      expect(first(d.items[i].text), d.items[i].key).not.toBe(first(d.items[i - 1].text));
    }
    // İlk madde yumuşak bir başlangıçtır.
    expect(d.items[0].key).toBe('dus03');
    expect(d.items[0].reverse).toBeUndefined();
  });

  it('öteki testlerdeki aynı maddelerle aynı çeviri (23 madde); örtüşme sayıları bilim kartındakiyle aynı', () => {
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
    expect(n).toBe(23);
    const count = (slug: string) => {
      const o = others.find((x) => x.slug === slug)!;
      return d.items.filter((it) => o.items.some((x) => norm(x.source) === norm(it.source))).length;
    };
    const COUNTS: Record<string, number> = {
      'ayrintili-kisilik-profili': 12,
      'ogrenme-ve-basari-ozellikleri': 10,
      'alti-boyutlu-kisilik-profili': 5,
      'kisiligin-10-yonu': 4,
      'dusunme-ve-calisma-tarzi': 3,
      'liderlik-egilimleri': 3,
      'bes-faktor-kisilik': 2,
      'heyecan-arayisi': 2,
      'hizli-kisilik-testi': 1,
      '16-faktorlu-kisilik-profili': 1,
    };
    for (const [slug, c] of Object.entries(COUNTS)) expect(count(slug), slug).toBe(c);
    // Başka testte ortak madde yok.
    for (const o of others.filter((x) => !(x.slug in COUNTS) && x.slug !== 'cocuk-kisilik-profili')) expect(count(o.slug), o.slug).toBe(0);
    const lim = d.science.limitations.join(' ');
    expect(lim).toContain('28 cümlenin 23’ü');
    const WORDS = ['on ikisi', 'onu', 'beşi', 'dördü', 'üçü', 'üçü', 'ikisi', 'ikisi', 'birer', 'birer'];
    for (const [i, slug] of Object.keys(COUNTS).entries()) {
      const name = others.find((x) => x.slug === slug)!.name;
      expect(lim, slug).toContain(name);
      if (i < 8) expect(lim, slug).toContain(`${WORDS[i]} ${name}’`);
    }
    expect(d.science.turkishVersion).toContain('23 maddenin');
    // Heyecan Arayışı'ndaki iki cümle orada düz, burada ters yönde: bilim kartı bunu söyler.
    const hey = others.find((x) => x.slug === 'heyecan-arayisi')!;
    for (const it of d.items.filter((x) => hey.items.some((y) => norm(y.source) === norm(x.source)))) {
      expect(it.reverse, it.key).toBe(true);
      expect(lim).toContain(`“${it.text}”`);
    }
  });

  it('birbirinin tersini söyleyen dört çift: biri düz biri ters, aynı ölçekte; ikisine aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(4);
    // Bilim kartı kuralı doğru anlatır: eşik çiftlerin yarısıdır (likert.ts: n >= ceil(çift / 2)).
    expect(d.science.limitations.join(' ')).toContain('dört cümle çiftinden (üçü öz-disiplinde, biri kendini tutabilmede) en az ikisinde');
    const two = d.oppositePairs!.slice(0, 2).flat();
    const answers2 = Object.fromEntries(d.items.map((it, i) => [it.key, { value: two.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    expect(likertQuality(d, answers2).notes.some((x) => x.includes('4 cümle çiftinden 2 tanesinde'))).toBe(true);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.reverse, x).toBeUndefined();
      expect(b.reverse, y).toBe(true);
      expect(a.scale, x).toBe(b.scale);
    }
    const keys = d.oppositePairs!.flat();
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    const q = likertQuality(d, answers);
    expect(q.oppositeAgree).toBe(4);
    expect(q.notes.some((x) => x.includes('Birbirinin tersini söyleyen 4 cümle çiftinden 4 tanesinde'))).toBe(true);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(d, keyedAnswers(() => level));
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'restraint' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('restraint')!.mean).toBe(5);
    expect(byKey.get('deliberation')!.mean).toBe(1);
    expect(byKey.get('discipline')!.mean).toBe(1);
    expect(byKey.get('restraint')!.nItems).toBe(8);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde yazar ve yılıyla anılıyor; öz bildirim sınırı, yaş notu ve sınırlılıklar', () => {
    const s = d.science;
    expect(JSON.stringify(d)).not.toMatch(/YAZILACAK|TASLAK/);
    expect(s.citations.length).toBeGreaterThanOrEqual(20);
    for (const c of s.citations) expect(c.url, c.text).toMatch(/^https:\/\//);
    const card = JSON.stringify({ ...s, citations: [] });
    for (const c of s.citations.filter((x) => !/^(IPIP|Goldberg)/.test(x.text))) {
      const author = c.text.split(',')[0];
      const year = /\((\d{4})\)/.exec(c.text)![1];
      expect(card, author).toContain(author);
      expect(card, `${author} ${year}`).toMatch(new RegExp(`${author}[^()]{0,40}\\(?${year}|${author}’\\p{L}* \\(${year}\\)`, 'u'));
    }
    // IPIP sayfalarındaki sayılar.
    for (const x of ['.76', '.85', '.77', '.69 (ölçüm hatası düzeltilince .95)', '.76 (.92)', '.73 (.98)', 'yaklaşık .73', 'Tablo örneklemi belirtmez']) {
      expect(s.reliability, x).toContain(x);
    }
    for (const k of Object.values(KEY)) expect(s.reliability).toContain(String(k.alpha).replace(/^0/, ''));
    expect(s.whatItMeasures).toContain('toplam bir puan hesaplanmaz');
    // İradenin tükendiği düşüncesi desteklenmedi: site bunu iddia etmez.
    expect(s.whatItMeasures).toContain('desteklenmemiştir');
    expect(s.basedOn).toContain('28 madde');
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    const lim = s.limitations.join(' ');
    expect(lim).toContain('ne kadar başarılı ya da çalışkan olduğunu ölçmez');
    expect(lim).toContain('Tanı koymaz');
    expect(lim).toContain('dikkat eksikliği');
    expect(lim).toContain('“doğru” deme eğilimi');
    expect(lim).toContain('“asla”');
    // Sitedeki Erteleme ve Zaman Yönetimi testiyle ilişkisi anlatılır.
    expect(lim).toContain(INSTRUMENTS.find((x) => x.slug === 'erteleme-ve-zaman-yonetimi')!.name);
  });

  it('hep aynı cevap ve çok hızlı cevap kalite notu verir', () => {
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).straightLining).toBe(true);
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
  });
});

describe('Öz-denetim raporu', () => {
  it('genel bakışta üç alan; ilk madde "Birlikte bakınca", ardından her alan', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.items.map((x) => x.title)).toEqual(['Birlikte bakınca', ...NAMES]);
    }
    expect(r.parent.items[1].text).toContain('Çocuğunuz');
    expect(r.student.items[1].text).not.toContain('Çocuğunuz');
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni yazılmış; dil kuralları; kartlar öteki alanlardan söz etmez', () => {
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
        expect(`${bt.student} ${bt.parent} ${bt.adult ?? ''}`, label).not.toMatch(
          /tembel|iradesiz|sorumsuz|dürtüsel|disiplinsiz|savurgan biri|zayıf|başarısız|bozukluk|hastalık|bağımlı|kusurlu|yetersiz/i,
        );
        expect(!!bt.support, label).toBe(false);
        expect(!!bt.adult, label).toBe(s === 'restraint' && band === 'low');
        expect(schoolWords(bt.adult ?? bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
        // Her kart yalnızca kendi alanını anlatır.
        const text = `${bt.student} ${bt.parent}`;
        if (s === 'deliberation') expect(text, label).not.toMatch(/başla|koyul|istek|cazip|kendini tut|aşırıya|para/i);
        if (s === 'discipline') expect(text, label).not.toMatch(/acele|düşünmeden|karar|istek|cazip|aşırıya|para/i);
        if (s === 'restraint') expect(text, label).not.toMatch(/başla|koyul|karar|acele|düşünmeden/i);
      }
      expect(summaries.size, s).toBe(3);
    }
    // Düşük düzeyler kişiyi yargılamaz.
    expect(t.scales.discipline.low!.student).toContain('bir değer yargısı değildir');
    expect(t.scales.deliberation.low!.student).toContain('canlılık katabilir');
    expect(t.scales.restraint.low!.student).toContain('güvendiğin bir yetişkinle');
    expect(t.scales.restraint.low!.adult).toContain('bir uzmanla');
    // Genel bakış: başarı notu değil.
    expect(t.overview!.student).toContain('ne kadar başarılı olduğunu değil');
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
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Eğer-o zaman planı');
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

  it('Birlikte bakınca: giriş her raporda; kurallar birbirini dışlar; 3³ birleşimin hepsinde metin tutarlı', () => {
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
        const label = `${g.deliberation}/${g.discipline}/${g.restraint} ${who}`;
        const pick = (x: { student: string; parent: string; adult?: string }) =>
          who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student;
        const extra = rules.length ? rules.map((x) => pick(x.text)) : t.fallback ? [pick(t.fallback)] : [];
        expect(insightOf(rep)!.text, label).toBe([pick(lead), ...extra].join('\n\n'));
        if (who !== 'parent') expect(insightOf(rep)!.text, label).not.toMatch(/[Çç]ocuğunuz/);
        if (who === 'adult') {
          expect(schoolWords(insightOf(rep)!.text), label).toEqual([]);
          expect(insightOf(rep)!.text, label).not.toMatch(/gençlik|yirmili yaş/);
        }
        n++;
      }
    }
    expect(n).toBe(27 * 3);
    // Her birleşimde en çok bir kural çıkar.
    for (const g of COMBOS) expect(firedRules(g).length, JSON.stringify(g)).toBeLessThanOrEqual(1);
    // Her kural en az bir birleşimde uyar.
    for (const x of t.rules) expect(COMBOS.some((g) => firedRules(g).includes(x)), x.text.student.slice(0, 40)).toBe(true);
    // Bir alan yüksek, öteki düşükken her zaman bir kural çıkar ("dikkat çeken bir birleşim yok" denmez).
    for (const g of COMBOS) {
      const v = Object.values(g);
      if (v.includes('high') && v.includes('low')) expect(firedRules(g).length, JSON.stringify(g)).toBe(1);
    }
    // Kurallar kartlarla çelişmez: bir kural bir alanı "yüksek" ya da "düşük" diye anıyorsa o alan o düzeydedir.
    const mentions: [RegExp, string, string][] = [
      [/^İşlere vakit kaybetmeden koyulduğunu/, 'discipline', 'high'],
      [/^Bir şeyi yapmadan önce düşündüğünü/, 'deliberation', 'high'],
      [/^Cazip gelen şeylere karşı kendini tutabildiğini/, 'restraint', 'high'],
      [/^Cazip gelen şeylere karşı kendini tutmakta zorlandığını/, 'restraint', 'low'],
      [/“Düşünerek davranma” alanında ise puanın düşük|“Düşünerek davranma” ve “Kendini tutabilme”/, 'deliberation', 'low'],
      [/“Öz-disiplin” alanında ise puanın düşük|“Öz-disiplin” ve “Kendini tutabilme”/, 'discipline', 'low'],
      [/ve “Kendini tutabilme” alanlarında ise puanın düşük/, 'restraint', 'low'],
    ];
    for (const g of COMBOS) {
      for (const x of firedRules(g)) {
        for (const [re, scale, band] of mentions) if (re.test(x.text.student)) expect(g[scale], `${JSON.stringify(g)} ${re}`).toBe(band);
      }
    }
    // Üç alan yüksekken başarı notu, üçü düşükken eksiklik gibi anlatılmaz; bir sonuç vaat edilmez.
    for (const x of [t.rules[0], t.rules[t.rules.length - 1]]) {
      expect(`${x.text.student} ${x.text.parent} ${x.text.adult ?? ''}`).not.toMatch(/başarı|eksik(?!lik gibi değil)|geliştirilebilen|zayıf|güçlü yan/i);
    }
    // Giriş: tanım, alışkanlık ve ortam, "iradenin tükenmesi" düşüncesinin desteklenmediği; gençlerde gelişim sürer.
    for (const x of [lead.student, lead.parent, lead.adult!]) {
      expect(x).toContain('üç alanda ayrı ayrı');
      expect(x).toContain('her zaman dişini sıkmak demek değildir');
      expect(x).toContain('desteklenmemiştir');
      expect(x).not.toMatch(/YAZILACAK|tükenir(?! bir)/);
    }
    expect(lead.student).toContain('yirmili yaşların ortasına');
    expect(lead.adult).not.toContain('yirmili yaşların');
    expect(schoolWords(lead.adult!)).toEqual([]);
    // Giriş ile kurallar aynı cümleyi tekrarlamaz.
    for (const x of t.rules) expect(shared(lead.student, x.text.student), x.text.student.slice(0, 40)).toEqual([]);
  }, 120_000);

  it('uç ve orta cevaplar: bütün alanlar aynı düzeyde', () => {
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

describe('Öz-denetim gelişim yol haritası', () => {
  it('üç sütun, üç ayrı renk; ortamlar var; kaynaklar doğrulanmış', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(3);
    expect(t.planningScale).toBe('discipline');
    expect(t.sources.every((s) => s.url?.startsWith('https://'))).toBe(true);
    // Yol haritasının kaynakları bilim kartında da var (eğer-o zaman planı ve ortam stratejileri).
    for (const src of t.sources.slice(2)) expect(d.science.citations.some((c) => c.text === src.text), src.text).toBe(true);
    // 2. hafta eğer-o zaman planıdır: her düzeyde.
    for (const g of BANDS) expect(t.scales.discipline.action[g].student, g).toContain('eğer-o zaman planı');
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
    // Kök düzeyinde de (sözcüklerin ilk beş harfi; bağlaçlar ve alan adlarındaki sözcükler atılır) üç sözcüklük öbek ortak
    // değildir. Veli raporunda öz-disiplinin 2. haftası her düzeyde yaklaşım önerileriyle birlikte görünür.
    const STOP = new Set(['bir', 've', 'ya', 'da', 'de', 'ile', 'için', 'gibi', 'bu', 'o', 'onu', 'ona', 'sonra', 'önce', 'daha', 'çok', 'her', 'ise', 'ki']);
    const NAME = new Set(['düşün', 'davra', 'disip', 'kendi', 'tutab']);
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
        for (const h of BANDS) expect(sharedStems(t.scales.discipline.action[g].parent, t.approach![key][h]), `2. hafta ${g} – yaklaşım ${key}/${h}`).toEqual([]);
      }
    }
    // Veliye yaklaşım önerileri birbirini tekrar etmez.
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect(shared(tips[i], tips[j]), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('bir sayfada aynı söz öbeği iki ayrı yerde geçmez (27 birleşim; öğrenci, veli, yetişkin)', () => {
    // "Birlikte bakınca" kuralı kartlardaki tanımı anabilir ("Bir şeyi yapmadan önce düşündüğünü söylüyorsun"); öneri
    // kartları etkili çalışma yöntemlerini ortak anlatır. Bunların dışında kartlar, haftalar ve yaklaşım önerileri ayrı fikirdir.
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
        rm.weeks.forEach((w, i) => blocks.push([`hafta ${i + 1}`, w.text]));
        rm.study.items.forEach((x, i) => blocks.push([`öneri ${i + 1}`, x.text]));
        rm.approach?.items.forEach((x, i) => blocks.push([`yaklaşım ${i + 1}`, x.text]));
        for (let i = 0; i < blocks.length; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const kinds = [blocks[i][0], blocks[j][0]].map((x) => x.split(' ')[0]).sort().join('-');
            if (kinds === 'kart-kural' || kinds === 'öneri-öneri') continue;
            const label = `${g.deliberation}/${g.discipline}/${g.restraint} ${who}: ${blocks[i][0]} – ${blocks[j][0]}`;
            expect(shared(blocks[i][1], blocks[j][1]), label).toEqual([]);
          }
        }
      }
    }
  }, 120_000);

  it('öneriler kimseyi zorlamaz ve yargılamaz; bir sonuç ya da "irade" vaadi yok', () => {
    const t = ROADMAPS[SLUG];
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of [...all, ...Object.values(t.approach!).flatMap((y) => Object.values(y))]) {
      expect(x, x).not.toMatch(/tembel|iradesiz|zorla(yın|malı|maya)|(?<!\p{L})zorla(?!\p{L})|mecbur|ceza|garanti|irade(ni|nizi)? (güçlen|artır)|tüken/iu);
    }
    expect(t.approach!.restraint.low).toContain('suçlamak yerine');
    expect(t.approach!.discipline.low).toContain('sürekli hatırlatmak yerine');
  });

  it('son haftada öteki testler önerilir; önerilen testler yetişkinlere de açık', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('işleri ne kadar ertelediğini ve heyecan arayışını da görmek');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('“Erteleme ve Zaman Yönetimi” ve “Heyecan Arayışı” testlerinden');
    for (const slug of ROADMAPS[SLUG].nextTests) expect(INSTRUMENTS.find((x) => x.slug === slug)?.adults, slug).toBe(true);
  });
});

describe('Öz-denetim yayında', () => {
  it('listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /OD_GOVDE=.*?k=(\[[^\]]*\])/.exec(yml);
    expect(m).not.toBeNull();
    const keys = JSON.parse(m![1].replace(/'/g, '"')) as string[];
    expect([...keys].sort()).toEqual(d.items.map((i) => i.key).sort());
    expect(yml).toContain('"Eğer-o zaman planı"');
  });
});
