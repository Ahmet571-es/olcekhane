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

const SLUG = 'liderlik-egilimleri';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['lead', 'bold', 'purpose'];
const NAMES = ['Öne çıkıp yön verme', 'Sosyal cesaret', 'Kararlılık ve sorumluluk'];
const PREFIX: Record<string, string> = { lead: 'yon', bold: 'ces', purpose: 'kar' };
const BANDS = ['low', 'average', 'high'] as const;
type Band = (typeof BANDS)[number];
type Level = 'high' | 'low' | 'mid';
const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;

/**
 * IPIP'in anahtar sayfaları (sayfadaki sırayla, önce artı sonra eksi yönlü maddeler): öne çıkıp yön verme HPI "Leadership"
 * alt bileşeni (https://ipip.ori.org/newHPIKeys.htm; arşiv kopyasından okundu), sosyal cesaret IPIP-HEXACO "Social Boldness"
 * (https://ipip.ori.org/newHEXACO_PI_key.htm), kararlılık ve sorumluluk AB5C "Purposefulness" (III+/IV+;
 * https://ipip.ori.org/newAB5CKey.htm; arşiv kopyasından okundu).
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number }> = {
  lead: {
    plus: ['Take charge.', 'Want to be in charge.', 'Try to lead others.', 'Can talk others into doing things.'],
    minus: ['Wait for others to lead the way.', 'Let others make the decisions.'],
    alpha: 0.81,
  },
  bold: {
    plus: [
      'Am good at making impromptu speeches.',
      "Don't mind being the center of attention.",
      'Feel comfortable around people.',
      'Have leadership abilities.',
      'Have a strong personality.',
    ],
    minus: [
      'Would be afraid to give a speech in public.',
      'Keep in the background.',
      'Find it difficult to approach others.',
      'Hate being the center of attention.',
      'Have little to say.',
    ],
    alpha: 0.86,
  },
  purpose: {
    plus: ['Am always prepared.', 'Carry out my plans.', 'Get to work at once.', 'Am not easily distracted.', 'Handle tasks smoothly.'],
    minus: [
      'Make a mess of things.',
      'Am easily distracted.',
      'Mess things up.',
      'Shirk my duties.',
      "Don't see things through.",
      'Do things at the last minute.',
      "Can't make up my mind.",
    ],
    alpha: 0.81,
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

/** Bu testte ilk kez çevrilen üç madde (iki taslakla). */
const NEW_ITEMS: Record<string, string> = {
  'Am not easily distracted.': 'Dikkatim kolay kolay dağılmaz.',
  'Do things at the last minute.': 'Yapmam gerekenleri son ana bırakırım.',
  "Can't make up my mind.": 'Karar vermekte zorlanırım.',
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

/**
 * Bir metindeki dört sözcüklük söz öbekleri (noktalama atılarak, küçük harfle). Eğilimlerin adları ("Öne çıkıp yön verme"
 * dört sözcüktür) bir fikir değil, ad olduğu için öbeklerin dışında tutulur: metin adların yerinden bölünür.
 */
const NAME_RE = new RegExp(NAMES.map((x) => x.toLocaleLowerCase('tr-TR')).join('|'), 'gu');
function grams(text: string, n = 4): Set<string> {
  const out = new Set<string>();
  for (const part of text.toLocaleLowerCase('tr-TR').split(NAME_RE)) {
    const w = part.match(/\p{L}+/gu) ?? [];
    for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  }
  return out;
}
const shared = (a: string, b: string) => [...grams(a)].filter((x) => grams(b).has(x));

/** Bir düzey birleşiminde uyan birlikte yorum kuralları. */
function firedRules(g: Record<string, string>) {
  const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(g[k]));
  return REPORT_TEMPLATES[SLUG].insight!.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
}
const COMBOS = BANDS.flatMap((a) => BANDS.flatMap((b) => BANDS.map((c) => ({ lead: a, bold: b, purpose: c }) as Record<string, Band>)));
const label3 = (g: Record<string, string>) => `${g.lead}/${g.bold}/${g.purpose}`;

/** Cümlelerin sözcük sayısı (sitenin sade dil ölçüsü: 22 sözcüğü geçmez). */
const longest = (text: string) =>
  Math.max(
    ...text
      .split(/(?<=[.?!])\s+|;\s+/u)
      .map((s) => (s.match(/[\p{L}\d]+/gu) ?? []).length),
  );

/** Bir sayfada en çok kaç kez geçebileceği sınırlanan içerik sözcükleri (metin incelemesinin bulgusu). */
const PAGE_STEMS: [string, RegExp, number][] = [
  ['kolaylaştır', /kolaylaştır/gu, 2],
  ['güven/emanet', /güven|emanet/gu, 1],
  ['destek', /destek/gu, 2],
  ['geri durma', /başkalarının da yön vermesine|geri dur|her grupta öne çık/gu, 2],
];

const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
const OTHERS = INSTRUMENTS.filter((x) => x.slug !== SLUG && x.engine === 'likert') as LikertInstrument[];

describe('Liderlik Eğilimleri tanımı', () => {
  it('28 madde, üç ayrı ölçek (6, 10, 12); toplam puan ve bileşik ölçek yok; güvenirlik var, ölçüm payı yok', () => {
    expect(d.items).toHaveLength(28);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s).length)).toEqual([6, 10, 12]);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(28);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(28);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
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
      5,
      1,
    ]);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
    // Tek bir ölçeğe "Liderlik" ya da yalnızca "Sorumluluk" adı verilmez (öteki testlerdeki adlarla karışmasın).
    for (const s of d.scales) expect(['Liderlik', 'Sorumluluk', 'Atılganlık']).not.toContain(s.name);
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; üç ölçeğin bütün maddeleri sorulur', () => {
    expect(PAGE.size).toBe(28);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.scale, it.key).toBe(page![0]);
      expect(it.source, it.key).toBe(page![1]);
      expect(!!it.reverse, it.key).toBe(page![2]);
    }
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual([]);
    expect(SCALES.map((s) => d.items.filter((i) => i.scale === s && i.reverse).length)).toEqual([2, 5, 7]);
    // Sosyal cesaret, Altı Boyutlu'nun "Sosyal cesaret" alt özelliğiyle aynı sırada anahtarlanır (ces01 = socb01); düzey
    // eşikleri de aynıdır.
    const alti = def<LikertInstrument>('alti-boyutlu-kisilik-profili');
    for (const it of d.items.filter((x) => x.scale === 'bold')) {
      const a = alti.items.find((x) => x.key === `socb${it.key.slice(3)}`)!;
      expect(norm(a.source), it.key).toBe(norm(it.source));
      expect(!!a.reverse, it.key).toBe(!!it.reverse);
      expect(a.text, it.key).toBe(it.text);
    }
    expect(d.anchoredBands).toEqual(alti.anchoredBands);
    expect(alti.scales.find((s) => s.name === 'Sosyal cesaret')!.alpha).toBe(d.scales[1].alpha);
  });

  it('uygulama sırası: art arda aynı ölçek yok; aynı yönde en çok üç madde; benzer ve karşıt maddeler birbirinden uzak', () => {
    const scales = d.items.map((i) => i.scale);
    for (let i = 1; i < scales.length; i++) expect(scales[i], d.items[i].key).not.toBe(scales[i - 1]);
    let run = 1;
    for (let i = 1; i < d.items.length; i++) {
      run = !!d.items[i].reverse === !!d.items[i - 1].reverse ? run + 1 : 1;
      expect(run, d.items[i].key).toBeLessThanOrEqual(3);
    }
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('yon01', 'yon05', 10); // idareyi ele alma / yolu başkalarının göstermesini bekleme
    far('ces02', 'ces09', 10); // ilgi odağı olmak
    far('ces01', 'ces06', 10); // konuşma yapmak
    far('kar04', 'kar07', 10); // dikkatin dağılması
    far('kar06', 'kar08', 10); // işleri birbirine karıştırmak / yüzüne gözüne bulaştırmak
    for (const [a, b] of [
      ['yon02', 'yon06'], // işlerin başında olmak / kararları başkalarına bırakmak
      ['yon01', 'yon02'],
      ['yon01', 'yon03'],
      ['yon02', 'yon03'],
      ['yon03', 'ces04'], // iki "liderlik" maddesi
      ['kar12', 'yon06'], // iki "karar" maddesi
      ['ces07', 'yon05'], // geri planda kalmak / yolu başkalarının göstermesini beklemek
      ['ces08', 'ces03'],
      ['ces08', 'ces06'],
      ['ces05', 'ces04'],
      ['ces01', 'ces10'],
      ['kar02', 'kar10'], // planları uygulamak / işleri sonuna götürmemek
      ['kar03', 'kar11'], // hemen işe koyulmak / son ana bırakmak
      ['kar05', 'kar06'],
      ['kar05', 'kar08'],
      ['kar05', 'kar10'],
      ['kar06', 'kar10'],
      ['kar08', 'kar10'],
      ['kar01', 'ces01'], // hazırlıklı olmak / hazırlıksız konuşma
    ]) {
      far(a, b, 6);
    }
    // Aynı sözle başlayan ya da aynı sözle biten maddeler art arda gelmez ("… konuşmakta zorlanırım." / "Karar vermekte
    // zorlanırım." gibi).
    const words = (t: string) => t.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu)!;
    for (let i = 1; i < d.items.length; i++) {
      expect(words(d.items[i].text)[0], d.items[i].key).not.toBe(words(d.items[i - 1].text)[0]);
      expect(words(d.items[i].text).at(-1), d.items[i].key).not.toBe(words(d.items[i - 1].text).at(-1));
    }
    // İlk madde yumuşak bir başlangıçtır.
    expect(d.items[0].key).toBe('ces03');
    expect(d.items[0].reverse).toBeUndefined();
  });

  it('öteki testlerdeki aynı maddelerle aynı çeviri (25 madde); yeni üç çeviri; örtüşme sayıları bilim kartındakiyle aynı', () => {
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
    expect(n).toBe(25);
    expect(Object.keys(NEW_ITEMS)).toHaveLength(3);
    // Yeni çeviriler sitedeki benzer cümlelerle aynı değildir.
    const allTexts = OTHERS.flatMap((o) => o.items.map((x) => x.text));
    for (const t of Object.values(NEW_ITEMS)) expect(allTexts, t).not.toContain(t);
    expect(Object.values(NEW_ITEMS).join(' ')).not.toMatch(/son dakika/);
    const count = (slug: string) => {
      const o = OTHERS.find((x) => x.slug === slug)!;
      return d.items.filter((it) => o.items.some((x) => norm(x.source) === norm(it.source))).length;
    };
    const COUNTS: Record<string, number> = {
      'alti-boyutlu-kisilik-profili': 10,
      '16-faktorlu-kisilik-profili': 9,
      'ayrintili-kisilik-profili': 8,
      'bes-faktor-kisilik': 7,
      'kisiligin-10-yonu': 7,
      'oz-yeterlik': 6,
      'ogrenme-ve-basari-ozellikleri': 3,
      'oz-denetim': 3,
      'hizli-kisilik-testi': 2,
      'kisilerarasi-tarz': 2,
    };
    for (const [slug, c] of Object.entries(COUNTS)) expect(count(slug), slug).toBe(c);
    // Başka testte ortak madde yok.
    for (const o of OTHERS.filter((x) => !(x.slug in COUNTS) && x.slug !== 'cocuk-kisilik-profili')) expect(count(o.slug), o.slug).toBe(0);
    const lim = d.science.limitations.join(' ');
    expect(lim).toContain('28 cümlenin 25’i');
    const WORDS = ['onu', 'dokuzu', 'sekizi', 'yedisi', 'yedisi', 'altısı', 'üçü', 'üçü'];
    for (const [i, slug] of Object.keys(COUNTS).entries()) {
      const name = OTHERS.find((x) => x.slug === slug)!.name;
      expect(lim, slug).toContain(name);
      if (i < WORDS.length) expect(lim, slug).toContain(`${WORDS[i]} ${name}’`);
    }
    // 16 Faktörlü'deki "Atılganlık" (4) ve Ayrıntılı'daki "Liderlik" (3) cümleleri.
    const inScale = (slug: string, scaleName: string) => {
      const o = OTHERS.find((x) => x.slug === slug)!;
      const key = o.scales.find((s) => s.name === scaleName)!.key;
      return d.items.filter((it) => it.scale === 'lead' && o.items.some((x) => x.scale === key && norm(x.source) === norm(it.source))).length;
    };
    expect(inScale('16-faktorlu-kisilik-profili', 'Atılganlık')).toBe(4);
    expect(inScale('ayrintili-kisilik-profili', 'Liderlik')).toBe(3);
    expect(lim).toContain('dört cümlesi 16 Faktörlü Kişilik Profili’nin “Atılganlık”');
    expect(lim).toContain('üçü Ayrıntılı Kişilik Profili’nin “Liderlik”');
    expect(d.science.turkishVersion).toContain('25 maddenin');
    expect(d.science.turkishVersion).toContain('Kalan 3 madde');
    // Öz-yeterlik ve Öz-denetim'in örtüşme notları bu testi de anar.
    expect(def<LikertInstrument>('oz-yeterlik').science.limitations.join(' ')).toContain('altısı Liderlik Eğilimleri’nde');
    expect(def<LikertInstrument>('oz-denetim').science.limitations.join(' ')).toContain('üçü Liderlik Eğilimleri’nde');
  });

  it('birbirinin tersini söyleyen dört çift: biri düz biri ters, aynı ölçekte; ikisine aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(4);
    expect(d.science.limitations.join(' ')).toContain(
      'dört cümle çifti vardır: biri öne çıkıp yön vermede, ikisi sosyal cesarette, biri kararlılık ve sorumluluktadır. En az iki çiftte',
    );
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.reverse, x).toBeUndefined();
      expect(b.reverse, y).toBe(true);
      expect(a.scale, x).toBe(b.scale);
    }
    expect(d.oppositePairs!.map(([x]) => d.items.find((i) => i.key === x)!.scale)).toEqual(['lead', 'bold', 'bold', 'purpose']);
    // Tek çift uyarı vermez; iki çift verir.
    const answersFor = (keys: string[]) => Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    const answersWith = (yes: string[], no: string[]) =>
      Object.fromEntries(d.items.map((it) => [it.key, { value: yes.includes(it.key) ? 5 : no.includes(it.key) ? 1 : 3, rtMs: 2600 }]));
    expect(likertQuality(d, answersWith(d.oppositePairs![0], [])).notes.some((x) => x.includes('cümle çiftinden'))).toBe(false);
    const two = likertQuality(d, answersFor(d.oppositePairs!.slice(0, 2).flat()));
    expect(two.notes.some((x) => x.includes('Birbirinin tersini söyleyen 4 cümle çiftinden 2 tanesinde'))).toBe(true);
    // İki çiftte iki cümleye de "hayır" uyarı verir; bir çiftte "evet", birinde "hayır" vermez (yönler ayrı sayılır).
    const twoNo = likertQuality(d, answersWith([], d.oppositePairs!.slice(1, 3).flat()));
    expect(twoNo.oppositeDisagree).toBe(2);
    expect(twoNo.notes.some((x) => x.includes('4 cümle çiftinden 2 tanesinde') && x.includes('“hayır”'))).toBe(true);
    const mixed = likertQuality(d, answersWith(d.oppositePairs![0], d.oppositePairs![3]));
    expect([mixed.oppositeAgree, mixed.oppositeDisagree]).toEqual([1, 1]);
    expect(mixed.notes.some((x) => x.includes('cümle çiftinden'))).toBe(false);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(d, keyedAnswers(() => level));
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'bold' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('bold')!.mean).toBe(5);
    expect(byKey.get('lead')!.mean).toBe(1);
    expect(byKey.get('purpose')!.mean).toBe(1);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde yazar ve yılıyla anılıyor; kaynak doğrulaması; beceri ölçmez; öz bildirim sınırı', () => {
    const s = d.science;
    expect(JSON.stringify(d)).not.toMatch(/YAZILACAK|TASLAK|PLACEHOLDER/);
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
    for (const x of ['.81', '.86', '.66 (ölçüm hatası düzeltilince .79', '.83 (düzeltilince .97', '501 yetişkin', '411 yetişkin', 'arşiv kopyasından', 'beş maddesi']) {
      expect(s.reliability, x).toContain(x);
    }
    expect(s.citations.some((c) => c.url === 'https://ipip.ori.org/newHPIKeys.htm')).toBe(true);
    expect(s.citations.some((c) => c.url === 'https://ipip.ori.org/newAB5CKey.htm')).toBe(true);
    expect(s.citations.some((c) => c.url?.startsWith('https://ipip-remaster.vercel.app/archive/'))).toBe(true);
    expect(s.basedOn).toContain('arşiv kopyası');
    expect(s.basedOn).toContain('28 madde');
    // Kartta araç dili yok (yalnızca dosya başında).
    expect(card).not.toMatch(/otomatik okuma|robots|açılabilen/);
    expect(s.whatItMeasures).toContain('liderlik becerisini, liderlik potansiyelini ya da iyi bir lider olup olmadığını ölçmez');
    expect(s.whatItMeasures).toContain('toplam bir puan hesaplanmaz');
    expect(s.whatItMeasures).toContain('tek başına belirlemez');
    expect(s.whatItMeasures).toContain('kanıtı ise henüz sınırlıdır');
    // Kalıtım payı "eğitim/çevre" diye anlatılmaz; cinsiyete göre yorum yok.
    expect(card).not.toMatch(/%70|eğitimden gelir|çevreden gelir|doğuştan lider|kız|erkek|cinsiyet/u);
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    expect(s.turkishVersion).toContain('1.123 öğrenci');
    const lim = s.limitations.join(' ');
    for (const x of ['Öz bildirime dayanır', 'liderlik becerisini ölçmez', 'Tanı koymaz', '“doğru” deme eğilimi', 'meslek önerisi değildir', 'İkna etme']) {
      expect(lim, x).toContain(x);
    }
    // "Liderlik yeteneğim var." cümlesi de yeteneği ölçmez.
    expect(lim).toContain('Sosyal cesaretin bir cümlesi (“Liderlik yeteneğim var.”)');
    // Kaynakların söylediği gibi: iki çalışma (Ames ve Flynn); sakin liderlerin üstünlüğü yalnızca girişken ekiplerde (Grant).
    expect(s.whatItMeasures).toContain('İş arkadaşlarının ve çalışanların değerlendirmelerine dayanan iki çalışmada');
    expect(s.whatItMeasures).toContain('Ekip üyeleri edilgen olduğunda ise sonuç tersine dönmüştür');
    expect(s.whatItMeasures).toContain('%24 ile %30’u');
    expect(s.whatItMeasures).toContain('incelenen dört liderlik rolünün hiçbirinde');
    expect(s.whatItMeasures).not.toMatch(/içedönük kişiler de iyi liderlik/);
    // Bilim kartında ve tanıtımda cümleler kısa (22 sözcüğü geçmez); liste cümleleri de bölünür.
    const prose = [
      d.description,
      ...d.intro.paragraphs,
      s.basedOn,
      ...s.whatItMeasures.split('\n\n'),
      s.turkishVersion,
      s.reliability,
      s.normNote,
      s.ageNote,
      ...s.limitations,
    ];
    for (const x of prose) expect(longest(x), x.slice(0, 60)).toBeLessThanOrEqual(22);
  });

  it('hep aynı cevap ve çok hızlı cevap kalite notu verir', () => {
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).straightLining).toBe(true);
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
  });
});

describe('Liderlik Eğilimleri raporu', () => {
  it('genel bakışta üç eğilim; ilk madde "Birlikte bakınca", ardından her eğilim; karşılaştırma bilgisi', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.items.map((x) => x.title)).toEqual(['Birlikte bakınca', ...NAMES]);
      expect(rep.compare!.scales.map((s) => s.key)).toEqual(SCALES);
      expect(rep.compare!.scales.every((s) => s.sem === null)).toBe(true);
      expect(rep.compare!.version).toBe(1);
    }
    expect(r.parent.items[1].text).toContain('Çocuğunuz');
    expect(r.student.items[1].text).not.toContain('Çocuğunuz');
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni yazılmış; dil kuralları; kartlar öteki eğilimlerden söz etmez', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t.evaluative).toBeUndefined();
    expect(Object.keys(t.scales).sort()).toEqual([...SCALES].sort());
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    const JUDGE =
      /lider ruhlu|doğuştan lider|liderlik potansiyel|pasif|çekingen biri|utangaç|sorumsuz|tembel|dağınık biri|zayıf|başarısız|yetersiz|kusurlu|bozukluk|hastalık|(?<!\p{L})tanı(?!\p{L})|daha az/u;
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
        expect(`${bt.student} ${bt.parent} ${bt.summary}`.toLocaleLowerCase('tr-TR'), label).not.toMatch(JUDGE);
        // Veli metninde "sen" dili yok.
        expect(bt.parent, label).not.toMatch(/söylüyorsun|düşünüyorsun|(?<!\p{L})(sana|seni|senin)(?!\p{L})/u);
        expect(!!bt.support, label).toBe(false);
        expect(bt.adult, label).toBeUndefined();
        expect(schoolWords(bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
        expect(longest(bt.student), label).toBeLessThanOrEqual(22);
        expect(longest(bt.parent), label).toBeLessThanOrEqual(22);
        // Her kart yalnızca kendi eğiliminin maddelerinin sorduğunu anlatır.
        const text = `${bt.student} ${bt.parent}`.toLocaleLowerCase('tr-TR');
        if (s === 'lead') expect(text, label).not.toMatch(/konuş|topluluk|ilgi odağı|kalabalık|planlar|hazırlıklı|dikkat|son an|sorumluluk/u);
        if (s === 'bold') expect(text, label).not.toMatch(/yön|karar|ikna|idare|planlar|hazırlıklı|dikkat|son an|sorumluluk/u);
        if (s === 'purpose') expect(text, label).not.toMatch(/konuş|topluluk|ilgi odağı|kalabalık|yön|ikna|idare|lider|karar/u);
      }
      expect(summaries.size, s).toBe(3);
    }
    // Düşük düzeyler kişiyi yargılamaz.
    expect(t.scales.purpose.low!.student).toContain('bir değer yargısı değildir');
    expect(t.scales.bold.low!.student).toContain('söyleyecek değerli bir şeyi olup olmadığını göstermez');
    expect(t.scales.lead.low!.student).toContain('herkesin yön vermesi gerekmez');
    // Yüksek sosyal cesaret iyi liderlik diye okunmaz.
    expect(t.scales.bold.high!.student).toContain('çok konuşmak, iyi liderlik demek değildir');
    // Genel bakış: başarı notu ya da liderlik becerisi değil.
    expect(t.overview!.student).toContain('liderlik becerini ya da iyi bir lider olup olmadığını değil');
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
          expect(rm.weeks.map((w) => w.title)[1], label).toBe('Dene ve geri bildirim al');
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
        const label = `${label3(g)} ${who}`;
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
    // Veli metinlerinde "sen" dili, öğrenci metinlerinde "Çocuğunuz" yok.
    for (const x of [...t.rules.map((r) => r.text), t.fallback!]) {
      expect(x.parent, x.parent.slice(0, 40)).not.toMatch(/söylüyorsun|görebilirsin|(?<!\p{L})(sana|seni|senin|sen)(?!\p{L})/u);
      expect(x.student, x.student.slice(0, 40)).not.toMatch(/[Çç]ocuğunuz|belirtiyor(?!sun)/);
      expect(longest(x.student), x.student.slice(0, 40)).toBeLessThanOrEqual(22);
      expect(longest(x.parent), x.parent.slice(0, 40)).toBeLessThanOrEqual(22);
    }
    expect(lead.parent).not.toMatch(/(?<!\p{L})(sana|seni|senin|sen)(?!\p{L})/u);
    for (const x of [lead.student, lead.parent, lead.adult!]) expect(longest(x)).toBeLessThanOrEqual(22);
    // Her birleşimde en çok bir kural çıkar; her kural en az bir birleşimde uyar.
    for (const g of COMBOS) expect(firedRules(g).length, label3(g)).toBeLessThanOrEqual(1);
    for (const x of t.rules) expect(COMBOS.some((g) => firedRules(g).includes(x)), x.text.student.slice(0, 40)).toBe(true);
    // Bir eğilim yüksek, öteki düşükken her zaman bir kural çıkar; üçü yüksek ya da üçü düşükken de.
    for (const g of COMBOS) {
      const v = Object.values(g);
      if ((v.includes('high') && v.includes('low')) || v.every((x) => x === 'high') || v.every((x) => x === 'low')) {
        expect(firedRules(g).length, label3(g)).toBe(1);
      }
    }
    // Kurallar kartlarla çelişmez: bir kural bir eğilimi "yüksek" ya da "düşük" diye anıyorsa o eğilim o düzeydedir.
    const mentions: [RegExp, string, string][] = [
      [/^Bir grupta idareyi ele almaktan hoşlandığını/, 'lead', 'high'],
      [/^Bir grupta yön vermek istediğini/, 'lead', 'high'],
      [/^(İnsanlar arasında|Topluluk içinde) rahat olduğunu/, 'bold', 'high'],
      [/^Üstlendiğin işleri sonuna götürdüğünü/, 'purpose', 'high'],
      [/“Kararlılık ve sorumluluk” eğiliminde ise puanın düşük/, 'purpose', 'low'],
      [/“Öne çıkıp yön verme”( ve “Sosyal cesaret”)? eğilim(i|leri)nde ise puanın düşük/, 'lead', 'low'],
      [/“Sosyal cesaret” eğiliminde ise puanın düşük/, 'bold', 'low'],
      [/ve “Sosyal cesaret” eğilimlerinde ise puanın düşük/, 'bold', 'low'],
      [/^Üç eğilimde de puanın yüksek/, 'lead', 'high'],
      [/^Üç eğilimde de puanın yüksek/, 'bold', 'high'],
      [/^Üç eğilimde de puanın yüksek/, 'purpose', 'high'],
      [/^Üç eğilimde de puanın düşük/, 'lead', 'low'],
      [/^Üç eğilimde de puanın düşük/, 'bold', 'low'],
      [/^Üç eğilimde de puanın düşük/, 'purpose', 'low'],
    ];
    for (const g of COMBOS) {
      for (const x of firedRules(g)) {
        for (const [re, scale, band] of mentions) if (re.test(x.text.student)) expect(g[scale], `${label3(g)} ${re}`).toBe(band);
      }
    }
    // Üçü yüksekken başarı notu, üçü düşükken eksiklik gibi anlatılmaz; bir sonuç vaat edilmez.
    for (const x of t.rules) {
      expect(`${x.text.student} ${x.text.parent}`.toLocaleLowerCase('tr-TR')).not.toMatch(
        /başarı|eksik|zayıf|yetersiz|üstün|güçlü yan|doğuştan|lider olursun|lider olacak|potansiyel|kusur/u,
      );
    }
    // Giriş: dışadönüklük (kısaca açıklanır) ve sorumluluk (testteki eğilimden daha geniş), çok güçlü olmayan ilişkiler;
    // liderlik yalnızca başkanlık değildir. Genel bakışta anlatılan üç eğilim girişte yinelenmez.
    for (const x of [lead.student, lead.parent, lead.adult!]) {
      expect(x).not.toContain('“Öne çıkıp yön verme”, “Sosyal cesaret” ve “Kararlılık ve sorumluluk”');
      expect(x).not.toMatch(/ayrı ayrı|orta büyüklükte/);
      expect(x).toContain('dışadönüklüktür: insanlarla birlikte olmaktan hoşlanma');
      expect(x).toContain('buna yakın ama daha dar bir eğilimdir');
      expect(x).toContain('çok güçlü değildir');
      expect((x.match(/liderlikle/g) ?? []).length).toBe(1);
      expect(x).toContain('tek başına belirlemez');
      expect(x).toContain('kalıcı bir yargı değil, bugünün bir resmidir.');
      expect(x).toContain('farklı roller de liderliğin parçasıdır');
    }
    expect(lead.student).toContain('takım kaptanı');
    expect(lead.adult).toContain('yönetici olmak değildir');
    expect(lead.parent).toContain('çocuğunuz hakkında');
    expect(schoolWords(lead.adult!)).toEqual([]);
    // Giriş ile kurallar aynı söz öbeğini tekrarlamaz.
    for (const x of t.rules) expect(shared(lead.student, x.text.student), x.text.student.slice(0, 40)).toEqual([]);
  }, 120_000);

  it('metin kuralları: kart ve kurallarda "beceri" yok; düşük eğilimi anan kuralda "güven" yok; "Bu sonuç / Bu bir" ile cümle başlamaz; kartta "lider" yalnızca araştırma bulgusu; velinin cümlelerinde özne belli', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const ins = t.insight!;
    const rm = ROADMAPS[SLUG];
    const cards = SCALES.flatMap((s) => BANDS.map((b) => t.scales[s][b]!));
    const insightTexts = [...ins.rules.map((r) => r.text), ins.fallback!, ins.lead[0].text];
    // "beceri" yalnızca genel bakışta, testin beceri ölçmediğini söylerken geçer.
    for (const x of [...cards.flatMap((c) => [c.summary, c.student, c.parent]), ...insightTexts.flatMap((r) => [r.student, r.parent, r.adult ?? ''])]) {
      expect(x, x.slice(0, 50)).not.toMatch(/beceri/iu);
    }
    expect(t.overview!.student).toMatch(/liderlik becerini ya da iyi bir lider olup olmadığını değil/);
    // Bir eğilimin düşük olduğu birleşimde "güven" sözü geçmez (düşük puan güvenilmezlik gibi okunmasın).
    for (const r of ins.rules) {
      if (Object.values(r.when).some((v) => v.includes('low'))) expect(`${r.text.student} ${r.text.parent}`, r.text.student.slice(0, 40)).not.toMatch(/güven/u);
    }
    // Rapor ve yol haritası metinleri
    const studentish = [
      t.overview!.student,
      ...cards.map((c) => c.student),
      ...insightTexts.flatMap((r) => [r.student, r.adult ?? '']),
      ...Object.values(rm.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.adult ?? ''])),
      rm.firstWeek.student,
      rm.balancedNote!.student,
      rm.studyIntro.student,
      rm.settingsNote!.student,
    ].filter(Boolean);
    const parentish = [
      t.overview!.parent,
      ...cards.map((c) => c.parent),
      ...insightTexts.map((r) => r.parent),
      ...Object.values(rm.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].map((y) => y.parent)),
      ...Object.values(rm.approach!).flatMap((y) => Object.values(y)),
      rm.firstWeek.parent,
      rm.balancedNote!.parent,
      rm.studyIntro.parent,
      rm.settingsNote!.parent,
    ];
    for (const x of [...studentish, ...parentish]) expect(x, x.slice(0, 50)).not.toMatch(/(^|[.!?]\s)Bu (sonuç|bir)(?!\p{L})/u);
    // Kartlarda "lider" geçen cümle bir araştırmanın bulgusudur.
    for (const c of cards) {
      for (const x of [c.student, c.parent]) {
        for (const sent of x.split(/(?<=[.?!])\s+/u)) if (/lider/iu.test(sent)) expect(sent).toMatch(/araştırma|çalışma/u);
      }
    }
    // Velinin metninde "istediğinde" ya da "…mak/…mek … kolaylaştırabilir" geçen cümlede kimden söz edildiği bellidir.
    for (const x of parentish) {
      for (const sent of x.split(/(?<=[.?!])\s+/u)) {
        if (/istediğinde|m[ae]k(?!\p{L}).*kolaylaştırabilir/u.test(sent)) {
          expect(sent).toMatch(/[Çç]ocuğunuz|(?<!\p{L})(onun|ona)(?!\p{L})/u);
        }
      }
    }
    // Öne çıkıp yön vermede 2. haftanın düşük düzeyi bir seçim bırakır.
    expect(rm.scales.lead.action.low.student).toMatch(/^İstersen /);
    expect(rm.scales.lead.action.low.parent).toMatch(/seçsin/);
  });

  it('uç ve orta cevaplar: üç eğilim aynı düzeyde; 9.–13. sınıfların hepsinde rapor', () => {
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
        // Son haftada önerilen testler 9. sınıftan başlar: her sınıfta iki test önerilir.
        expect(r.student.roadmap!.weeks[3].text, `${grade}`).toContain('Kişilerarası Tarz ve Empati testlerinden');
      }
    }
  });

  it('karışık ama ortalaması orta cevaplar: üç eğilim orta, kalite uyarısı yok, "hiçbir eğilim öne çıkmıyor" notu', () => {
    // Cevaplar 3, 2, 4 diye döner: art arda aynı cevap yok, karşıt çiftlerde uç cevap birikmez; ters maddelerle birlikte
    // üç eğilimin ortalaması 2,8–3,1 arasında kalır.
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: [3, 2, 4][i % 3], rtMs: 2600 }]));
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
      expect(rows.map((x) => x.band)).toEqual(['Orta', 'Orta', 'Orta']);
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

describe('Liderlik Eğilimleri gelişim yol haritası', () => {
  it('üç sütun, üç ayrı renk; ortamlar var; kaynaklar doğrulanmış', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toContain('dört haftalık küçük adımlar');
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(3);
    expect(t.planningScale).toBe('lead');
    expect(t.sources.every((s) => s.url?.startsWith('https://'))).toBe(true);
    // Yol haritasının kendi kaynakları bilim kartında da var (liderlik eğitiminde uygulama ve geri bildirim).
    for (const src of t.sources.slice(2)) expect(d.science.citations.some((c) => c.text === src.text), src.text).toBe(true);
    // 2. hafta "Dene ve geri bildirim al": her düzeyde bir deneme ve ardından birine sormak; sonuç vaadi yok.
    for (const g of BANDS) {
      const a = t.scales.lead.action[g];
      for (const x of [a.student, a.parent]) {
        expect(x, g).toMatch(/sor|geri bildirim/);
        expect(x.toLocaleLowerCase('tr-TR'), g).not.toMatch(/lider olursun|liderliğin artar|beceri(n|si) artar|garanti/u);
      }
    }
    // Bütün öneri metinlerinde cümleler kısa.
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of [...all, ...Object.values(t.approach!).flatMap((y) => Object.values(y)), t.firstWeek.student, t.firstWeek.parent]) {
      if (x) expect(longest(x), x.slice(0, 50)).toBeLessThanOrEqual(22);
    }
  });

  it('rapor kartı, öneri kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar etmez (dört sözcüklük söz öbekleri ve kökler)', () => {
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
    // Kök düzeyinde de (sözcüklerin ilk beş harfi; bağlaçlar ve eğilim adlarındaki sözcükler atılır) üç sözcüklük öbek
    // ortak değildir. Veli raporunda öne çıkıp yön vermenin 2. haftası her düzeyde yaklaşım önerileriyle birlikte görünür.
    const STOP = new Set(['bir', 've', 'ya', 'da', 'de', 'ile', 'için', 'gibi', 'bu', 'o', 'onu', 'ona', 'sonra', 'önce', 'daha', 'çok', 'her', 'ise', 'ki', 'ne']);
    const NAME = new Set(['sosya', 'cesar', 'karar', 'sorum', 'çıkıp', 'verme']);
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
        for (const h of BANDS) expect(sharedStems(t.scales.lead.action[g].parent, t.approach![key][h]), `2. hafta ${g} – yaklaşım ${key}/${h}`).toEqual([]);
      }
    }
    // Veliye yaklaşım önerileri birbirini tekrar etmez.
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect(shared(tips[i], tips[j]), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('bir sayfada aynı dört sözcüklük söz öbeği iki ayrı yerde geçmez (27 birleşim; öğrenci, veli, yetişkin)', () => {
    // "Birlikte bakınca" kuralı kartlardaki tanımı anabilir; öneri kartları (ve girişleri) etkili çalışma yöntemlerini ortak
    // anlatır. Bunların dışında giriş, genel bakış, kartlar, "Kısaca", ortamlar, haftalar ve yaklaşım önerileri ayrı fikirdir.
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
            const label = `${label3(g)} ${who}: ${blocks[i][0]} – ${blocks[j][0]}`;
            expect(shared(blocks[i][1], blocks[j][1]), label).toEqual([]);
          }
        }
        // Aynı içerik sözcüğü bir sayfada birikmez; "geri durma" fikri en çok iki yerde geçer.
        const page = blocks.map((x) => x[1]).join(' ').toLocaleLowerCase('tr-TR');
        for (const [name, re, max] of PAGE_STEMS) {
          expect((page.match(re) ?? []).length, `${label3(g)} ${who}: ${name}`).toBeLessThanOrEqual(max);
        }
        // Veliye yaklaşım ile haftalık adımlar aynı etkinliği (sunum, konuşma hazırlama) önermez.
        const approach = (rm.approach?.items ?? []).map((x) => x.text).join(' ');
        const weeks = rm.weeks.map((w) => w.text).join(' ');
        const ACT = /sunum|tanıtım|konuşma hazırla/u;
        expect(ACT.test(approach) && ACT.test(weeks), `${label3(g)} ${who}: yaklaşım – hafta`).toBe(false);
      }
    }
  }, 120_000);

  it('öneriler kimseyi zorlamaz ve yargılamaz; bir sonuç vaadi yok; güvenli etkinlikler', () => {
    const t = ROADMAPS[SLUG];
    const all = Object.values(t.scales).flatMap((x) => [...Object.values(x.study), ...Object.values(x.action)].flatMap((y) => [y.student, y.parent, y.adult ?? '']));
    for (const x of [...all, ...Object.values(t.approach!).flatMap((y) => Object.values(y)), t.firstWeek.student, t.firstWeek.parent]) {
      expect(x.toLocaleLowerCase('tr-TR'), x).not.toMatch(
        /zorla(yın|malı|maya)|(?<!\p{L})zorla(?!\p{L})|mecbur|ceza|garanti|lider olursun|liderlik becerin artar|öğrenme stili|seçim(e|de) aday|yarışma|gece|tek başına (git|gez)/u,
      );
    }
    expect(t.approach!.bold.low).toContain('ısrar etmeyin');
    expect(t.approach!.lead.low).toContain('eleştirmeyin');
  });

  it('son haftada öteki testler önerilir; önerilen testler yetişkinlere de açık', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('insanlarla ilişkilerdeki tarzını ve başkalarını anlama eğilimini de görmek');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('Kişilerarası Tarz ve Empati testlerinden');
    for (const slug of ROADMAPS[SLUG].nextTests) {
      const x = INSTRUMENTS.find((y) => y.slug === slug)!;
      expect(x.adults, slug).toBe(true);
      expect(x.minGrade, slug).toBeLessThanOrEqual(d.minGrade);
    }
  });
});

describe('Liderlik Eğilimleri yayında', () => {
  it('listelerde ve site haritasında; "Hangi test bana uygun?" sayfasında kişilik alanında; paylaşım kartı yok', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    const kisilik = SECICI_GOALS.find((g) => g.key === 'kisilik')!;
    const i = kisilik.slots.findIndex((s) => s.candidates.includes(SLUG));
    expect(kisilik.slots[i].skill).toBe('Liderlik eğilimleri');
    expect(kisilik.slots[i - 1].skill).toBe('Merak');
    expect(isShareable(SLUG)).toBe(false);
    expect(NOT_SHAREABLE[SLUG]).toBe('"yüksek daha iyi" diye okunabilir');
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /LDR_GOVDE=.*?k=(\[[^\]]*\])/.exec(yml);
    expect(m).not.toBeNull();
    const keys = JSON.parse(m![1].replace(/'/g, '"')) as string[];
    expect(keys).toEqual(d.items.map((i) => i.key));
    expect(yml).toContain('"Dene ve geri bildirim al"');
    expect(yml).toContain('/api/rapor/liderlik-egilimleri');
  });
});
