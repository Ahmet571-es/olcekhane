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

const SLUG = 'oz-yeterlik';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['tasks', 'social', 'coping'];
const NAMES = ['İşlerde kendine güven', 'İnsanlar arasında kendine güven', 'Zor anlarda kendine güven'];
const PREFIX: Record<string, string> = { tasks: 'tas', social: 'soc', coping: 'cop' };
const BANDS = ['low', 'average', 'high'] as const;
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in anahtar sayfaları: NEO "Self-Efficacy" (C1; https://ipip.ori.org/newNEOFacetsKey.htm), JPI-R "Social Confidence"
 * (https://ipip.ori.org/newJPI-RKey.htm) ve TCI "Low Self-Efficacy" (HA4; https://ipip.ori.org/newTCIKey.htm). Her
 * ölçekte sayfanın artı ve eksi yönlü maddeleri, sayfadaki sırayla. HA4'te sayfanın artı yönlü maddeleri düşük
 * öz-yeterliği söyler: bu testte ölçek ters çevrildiği için onlar ters puanlanır (`flipped`).
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number; flipped?: boolean }> = {
  tasks: {
    plus: [
      'Complete tasks successfully.',
      'Excel in what I do.',
      'Handle tasks smoothly.',
      'Am sure of my ground.',
      'Come up with good solutions.',
      'Know how to get things done.',
    ],
    minus: ['Misjudge situations.', "Don't understand things.", 'Have little to contribute.', "Don't see the consequences of things."],
    alpha: 0.78,
  },
  social: {
    plus: [
      'Feel comfortable around people.',
      "Don't mind being the center of attention.",
      'Am good at making impromptu speeches.',
      'Express myself easily.',
      'Have a natural talent for influencing people.',
    ],
    minus: [
      'Hate being the center of attention.',
      'Lack the talent for influencing people.',
      'Often feel uncomfortable around others.',
      "Don't like to draw attention to myself.",
      'Have little to say.',
    ],
    alpha: 0.87,
  },
  coping: {
    plus: ['Become overwhelmed by events.', 'Am often down in the dumps.', "Feel that I'm unable to deal with things.", 'Am afraid of many things.', 'Need reassurance.'],
    minus: ['Readily overcome setbacks.', 'Can manage many things at the same time.', 'Can tackle anything.', 'Think quickly.'],
    alpha: 0.77,
    flipped: true,
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

/** Bir düzey birleşiminde (işler, insanlar, zor anlar) uyan birlikte yorum kuralları. */
function firedRules(g: Record<string, string>) {
  const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
  return REPORT_TEMPLATES[SLUG].insight!.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
}
const COMBOS = BANDS.flatMap((a) => BANDS.flatMap((b) => BANDS.map((c) => ({ tasks: a, social: b, coping: c }) as Record<string, (typeof BANDS)[number]>)));

describe('Öz-yeterlik tanımı', () => {
  it('29 madde, üç ayrı ölçek (10, 10, 9); toplam puan ve bileşik ölçek yok', () => {
    expect(d.items).toHaveLength(29);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s).length)).toEqual([10, 10, 9]);
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

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; kaynağın bütün maddeleri sorulur', () => {
    expect(PAGE.size).toBe(29);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.scale, it.key).toBe(page![0]);
      expect(it.source, it.key).toBe(page![1]);
      expect(!!it.reverse, it.key).toBe(page![2]);
    }
    expect(d.items.filter((i) => i.reverse)).toHaveLength(14);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s && i.reverse).length)).toEqual([4, 5, 5]);
    // HA4'ün düşük öz-yeterlik maddeleri bu testte ters puanlanır.
    expect(d.items.find((i) => i.key === 'cop01')!.reverse).toBe(true);
    expect(d.items.find((i) => i.key === 'cop08')!.reverse).toBeUndefined();
  });

  it('uygulama sırası: üç ölçek sırayla döner; benzer ve karşıt maddeler birbirinden uzak', () => {
    const scales = d.items.map((i) => i.scale);
    for (let i = 1; i < scales.length; i++) expect(scales[i], d.items[i].key).not.toBe(scales[i - 1]);
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('soc02', 'soc06', 12); // ilgi odağı olmak rahatsız etmez / nefret ederim
    far('soc02', 'soc09', 9); // ilgi odağı / dikkatleri üzerime çekmek
    far('soc06', 'soc09', 12);
    far('soc05', 'soc07', 12); // insanları etkileme yeteneği var / yok
    far('soc01', 'soc08', 12); // rahat / huzursuz hissederim
    far('soc04', 'soc03', 6); // kendimi ifade ederim / hazırlıksız konuşma
    far('cop08', 'cop03', 12); // her şeyin üstesinden gelirim / baş edemeyeceğimi hissederim
    far('cop06', 'cop01', 12); // aksilikleri atlatırım / olaylar karşısında bunalırım
    far('cop07', 'cop04', 9); // iki "birçok" maddesi
    far('tas01', 'tas02', 15); // iki "başarı" maddesi
    far('tas03', 'tas06', 12); // iki "İşleri ..." maddesi
    far('tas08', 'tas10', 12); // iki "bir şey" ya da "olay" maddesi
    far('tas09', 'soc10', 12); // "pek bir şey olmaz" diye biten iki madde
    far('tas10', 'cop01', 12); // iki "olay" maddesi
    // İlk madde yumuşak bir başlangıçtır.
    expect(d.items[0].key).toBe('tas05');
    expect(d.items[0].reverse).toBeUndefined();
  });

  it('öteki testlerdeki aynı maddelerle aynı çeviri (20 madde); örtüşme sayıları bilim kartındakiyle aynı', () => {
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
    expect(n).toBe(20);
    const count = (slug: string) => {
      const o = others.find((x) => x.slug === slug)!;
      return d.items.filter((it) => o.items.some((x) => norm(x.source) === norm(it.source))).length;
    };
    expect(count('ayrintili-kisilik-profili')).toBe(9);
    expect(count('alti-boyutlu-kisilik-profili')).toBe(8);
    expect(count('16-faktorlu-kisilik-profili')).toBe(5);
    expect(count('bes-faktor-kisilik')).toBe(4);
    expect(count('kisiligin-10-yonu')).toBe(4);
    expect(count('ogrenme-ve-basari-ozellikleri')).toBe(1);
    const lim = d.science.limitations.join(' ');
    expect(lim).toContain('29 cümleden 20’si');
    for (const slug of ['ayrintili-kisilik-profili', 'alti-boyutlu-kisilik-profili', '16-faktorlu-kisilik-profili', 'bes-faktor-kisilik', 'kisiligin-10-yonu']) {
      expect(lim, slug).toContain(others.find((x) => x.slug === slug)!.name);
    }
    expect(d.science.turkishVersion).toContain('20 maddenin');
  });

  it('birbirinin tersini söyleyen beş çift: biri düz biri ters, aynı ölçekte; çoğuna aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(5);
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
    expect(q.oppositeAgree).toBe(5);
    expect(q.notes.some((x) => x.includes('Birbirinin tersini söyleyen 5 cümle çiftinden 5 tanesinde'))).toBe(true);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(d, keyedAnswers(() => level));
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'coping' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('coping')!.mean).toBe(5);
    expect(byKey.get('tasks')!.mean).toBe(1);
    expect(byKey.get('social')!.mean).toBe(1);
    expect(byKey.get('coping')!.nItems).toBe(9);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde yazar ve yılıyla anılıyor; öz bildirim sınırı, yaş notu ve sınırlılıklar', () => {
    const s = d.science;
    expect(JSON.stringify(d)).not.toMatch(/YAZILACAK/);
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
    for (const x of ['.78', '.87', '.77', '471 kişi', '501 kişi', '.66 (ölçüm hatası düzeltilince .89)', '.81 (.93)', '.53 (.66)']) expect(s.reliability, x).toContain(x);
    for (const k of Object.values(KEY)) expect(s.reliability).toContain(String(k.alpha).replace(/^0/, ''));
    expect(s.whatItMeasures).toContain('toplam bir puan hesaplanmaz');
    expect(s.whatItMeasures).toContain('yetenekli olmaya değil');
    expect(s.basedOn).toContain('29 maddesinin hepsi sorulur');
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    const lim = s.limitations.join(' ');
    expect(lim).toContain('ne kadar başarılı ya da becerikli olduğunu ölçmez');
    expect(lim).toContain('Tanı koymaz');
    expect(lim).toContain('“doğru” deme eğilimi');
    // Sitedeki Öz-saygı Ölçeği ile farkı anlatılır.
    expect(lim).toContain('Öz-saygı Ölçeği');
    expect(INSTRUMENTS.find((x) => x.slug === 'oz-saygi')?.name).toBe('Öz-saygı Ölçeği');
  });

  it('hep aynı cevap ve çok hızlı cevap kalite notu verir', () => {
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).straightLining).toBe(true);
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
  });
});

describe('Öz-yeterlik raporu', () => {
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
          /özgüvensiz|yetersiz|başarısız|utangaç|ezik|zayıf|beceriksiz|korkak|bozukluk|hastalık|depresyon|anksiyete|kusurlu/i,
        );
        expect(!!bt.support, label).toBe(s === 'coping' && band === 'low');
        expect(!!bt.adult, label).toBe(s === 'coping' && band === 'low');
        expect(schoolWords(bt.adult ?? bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
        // Her kart yalnızca kendi alanını anlatır.
        const text = `${bt.student} ${bt.parent}`;
        if (s === 'tasks') expect(text, label).not.toMatch(/insan|kalabalık|bunal|kork|moral/i);
        if (s === 'social') expect(text, label).not.toMatch(/(?<!\p{L})iş(?!\p{L})|işler|zorluk|bunal|aksilik/iu);
        if (s === 'coping') expect(text, label).not.toMatch(/insanlar(ın)? arasında|kalabalık|ilgi odağı|hazırlıksız/i);
      }
      expect(summaries.size, s).toBe(3);
    }
    // Düşük düzeyler kişiyi yargılamaz.
    expect(t.scales.tasks.low!.student).toContain('bir yetenek ölçümü değildir');
    expect(t.scales.social.low!.student).toContain('söyleyecek değerli bir şeyin olmadığı anlamına gelmez');
    expect(t.scales.coping.low!.student).toContain('zamanla ve destekle değişebilir');
    // Genel bakış: başarı notu değil, kendine ne kadar güvendiği.
    expect(t.overview!.student).toContain('ne kadar başarılı olduğunu değil');
  });

  it('her ölçeğin her düzeyi tek tek: kart, rozet, destek kutusu ve yol haritası tutarlı (öğrenci, veli, yetişkin)', () => {
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
          // Destek kutusu yalnızca zor anlardaki güven düşükken (ya da "Sık sık moralim bozuk olur" cümlesine "Oldukça doğru"
          // ya da "Tamamen doğru" denince; orta cevaplarda bu cümleye 3 verilir).
          expect(rep.support !== null, label).toBe(s === 'coping' && band === 'low');
          const rm = rep.roadmap!;
          expect(rm.bars.map((x) => x.label), label).toEqual(NAMES);
          expect(rm.study.items.map((x) => x.key), label).toEqual(SCALES);
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Küçük başarılar');
          expect(rm.weeks, label).toHaveLength(4);
          // Zor anlardaki güven düşükken 3. hafta ona ayrılır.
          if (s === 'coping' && band === 'low') expect(rm.weeks[2].title, label).toBe('Zor anlarda kendine güven');
          expect(rm.study.links.map((l) => l.href), label).toEqual(['/rehber/etkili-ders-calisma-yontemleri', '/rehber/oz-saygi-nedir']);
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

  it('"Sık sık moralim bozuk olur" cümlesine "Oldukça doğru" ya da "Tamamen doğru" destek kutusunu her düzeyde açar; yol haritası yüksek kartla çelişmez', () => {
    const rmT = ROADMAPS[SLUG];
    const coping = (who: 'student' | 'parent' | 'adult', g: (typeof BANDS)[number]) => {
      const x = rmT.scales.coping.study[g];
      return who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student;
    };
    for (const band of BANDS) {
      for (const v of [3, 4, 5]) {
        const answers = keyedAnswers((sc) => (sc === 'coping' ? LEVEL[band] : 'mid'));
        // Zor anlar yüksekken bir cümleye 4 ya da 5 vermek (ötekiler en yüksek) ölçeği yüksek bırakır.
        answers.cop02 = { value: v, rtMs: 2600 };
        const b = { grade: 10, data: { engine: 'likert' as const, answers } };
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        for (const rep of [r.student, r.parent, adult]) {
          const who = rep.audience as 'student' | 'parent' | 'adult';
          const label = `${band} cop02=${v} ${who}`;
          const shown = rep.items[3].badge!.split(' · ')[0];
          const item = v >= 4;
          expect(rep.support !== null, label).toBe(item || shown === 'Düşük');
          if (item) expect(rep.support!.lines[0], label).toContain('Sık sık moralim bozuk olur');
          // Yol haritası: kart yüksekse yüksek düzeyin önerisi; ortadaysa ve cümle kutuyu açtıysa düşük düzeyinki.
          const g = shown === 'Yüksek' ? 'high' : shown === 'Düşük' || item ? 'low' : 'average';
          expect(rep.roadmap!.study.items.find((x) => x.key === 'coping')!.text, label).toBe(coping(who, g));
          // 3. hafta: zor anlar yüksekken iyi oluş haftası değil, yüksek düzeyin denemesi (ortadan en uzak alan).
          if (shown === 'Yüksek') {
            const act = rmT.scales.coping.action.high;
            expect(rep.roadmap!.weeks[2].text, label).toBe(who === 'parent' ? act.parent : (act.adult ?? act.student));
          }
        }
      }
    }
    // Zor anlar yüksekken cümleye 5: kart yüksek kalır, kutu açılır.
    const hi = keyedAnswers((sc) => (sc === 'coping' ? 'high' : 'mid'));
    hi.cop02 = { value: 5, rtMs: 2600 };
    const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers: hi } });
    expect(r.student.items[3].badge).toMatch(/^Yüksek/);
    expect(r.student.support).not.toBeNull();
  });

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
        const label = `${g.tasks}/${g.social}/${g.coping} ${who}`;
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
      [/^İşlerde kendine güvendiğini/, 'tasks', 'high'],
      [/^İnsanların arasında rahat olduğunu/, 'social', 'high'],
      [/^Zor anlarda kendine güvendiğini/, 'coping', 'high'],
      [/^Zor anlarda kolayca bunaldığını/, 'coping', 'low'],
      [/“İnsanlar arasında kendine güven” alanında ise puanın düşük|“İnsanlar arasında” ve “Zor anlarda”/, 'social', 'low'],
      [/“İşlerde kendine güven” alanında ise puanın düşük|“İşlerde” ve “Zor anlarda”/, 'tasks', 'low'],
      [/ve “Zor anlarda” kendine güven alanlarında ise puanın düşük/, 'coping', 'low'],
    ];
    for (const g of COMBOS) {
      for (const x of firedRules(g)) {
        for (const [re, scale, band] of mentions) if (re.test(x.text.student)) expect(g[scale], `${JSON.stringify(g)} ${re}`).toBe(band);
      }
    }
    // Üç alan yüksekken başarı notu, üçü düşükken eksiklik gibi anlatılmaz; bir sonuç vaat edilmez.
    for (const x of [t.rules[0], t.rules[t.rules.length - 1]]) {
      expect(`${x.text.student} ${x.text.parent}`).not.toMatch(/başarı|eksik(?!lik gibi değil)|geliştirilebilen|zayıf|güçlü yan/i);
    }
    // Girişte öz-yeterliğin ne olduğu ve öz-saygıdan farkı her kişiye anlatılır; araştırmaların okulla ilgili olduğu ve en
    // güçlü kaynağın "çoğu zaman" başarı deneyimi olduğu söylenir; yetişkine "okul" denmez.
    for (const x of [lead.student, lead.parent, lead.adult!]) {
      expect(x).toContain('öz-saygı');
      expect(x).toContain('çoğu zaman en çok besleyen');
      expect(x).not.toMatch(/YAZILACAK|kendi çabasıyla/);
    }
    expect(lead.student).toContain('Okul başarısıyla ilgili araştırmalarda');
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

describe('Öz-yeterlik gelişim yol haritası', () => {
  it('üç sütun, üç ayrı renk; ortamlar var; kaynaklar doğrulanmış', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, rahat edilebilecek ortamlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(3);
    expect(t.planningScale).toBe('tasks');
    expect(t.sources.every((s) => s.url?.startsWith('https://'))).toBe(true);
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
    // Kök düzeyinde de (sözcüklerin ilk beş harfi; bağlaçlar ve alan adlarındaki sözcükler atılır) üç sözcüklük öbek ortak
    // değildir: "bitirebileceği küçük işler" ile "bitirebileceği küçük bir iş" aynı fikirdir. Veli raporunda işlerdeki
    // güvenin 2. haftası her düzeyde yaklaşım önerileriyle birlikte görünür.
    const STOP = new Set(['bir', 've', 'ya', 'da', 'de', 'ile', 'için', 'gibi', 'bu', 'o', 'onu', 'ona', 'sonra', 'önce', 'daha', 'çok', 'her', 'ise', 'ki']);
    const NAME = new Set(['insan', 'arası', 'kendi', 'güven', 'işler', 'zor', 'anlar']);
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
      // 2. hafta (işler) her veli raporunda bütün yaklaşım önerileriyle birlikte görünür.
      for (const key of Object.keys(t.scales)) {
        for (const h of BANDS) expect(sharedStems(t.scales.tasks.action[g].parent, t.approach![key][h]), `2. hafta ${g} – yaklaşım ${key}/${h}`).toEqual([]);
      }
    }
    // Veliye yaklaşım önerileri birbirini tekrar etmez.
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect(shared(tips[i], tips[j]), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('öneriler kimseyi zorlamaz ve yargılamaz; bir sonuç vaat edilmez', () => {
    const t = ROADMAPS[SLUG];
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of [...all, ...Object.values(t.approach!).flatMap((y) => Object.values(y))]) {
      // "Zorlamak" yasak; "seni zorlayan bir konuşma" (zorlayıcı) ve "zorlamayın" serbest.
      expect(x, x).not.toMatch(/özgüvensiz|utangaç|zorla(yın|malı|maya)|(?<!\p{L})zorla(?!\p{L})|mecbur|ceza|özgüven(in|ini)? artır|garanti/iu);
    }
    expect(t.approach!.social.low).toContain('zorlamayın');
    expect(t.scales.coping.action.low.student).toContain('duygunu bir sözcükle adlandır');
  });

  it('son haftada öteki testler önerilir; önerilen testler yetişkinlere de açık', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('öğrenmeye ve geleceğe nasıl baktığını da görmek');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('“Zihniyet: Zekâ ve Öğrenme İnançları” ve “İyimserlik” testlerinden');
    for (const slug of ROADMAPS[SLUG].nextTests) expect(INSTRUMENTS.find((x) => x.slug === slug)?.adults, slug).toBe(true);
  });
});

describe('Öz-yeterlik yayında', () => {
  it('listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /OY_GOVDE=.*?n=(\{[^}]*\})/.exec(yml);
    expect(m).not.toBeNull();
    const n = JSON.parse(m![1]) as Record<string, number>;
    const keys = Object.entries(n).flatMap(([k, c]) => Array.from({ length: c }, (_, i) => `${k}${String(i + 1).padStart(2, '0')}`));
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
    expect(yml).toContain('"Küçük başarılar"');
  });
});
