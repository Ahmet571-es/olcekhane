import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
import { OPT, OPT_GROUPS } from '@/content/instruments/iyimserlik';
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

const SLUG = 'iyimserlik';
const d = def<LikertInstrument>(SLUG);
const SCALES = [OPT, ...OPT_GROUPS];
const NAMES = ['İyimserlik', 'Hayata ve geleceğe bakış', 'Kendine bakış', 'Ruh hâli'];
const GROUP_NAMES = NAMES.slice(1);
const BANDS = ['low', 'average', 'high'] as const;
type Level = (typeof BANDS)[number];
/** Bir konudaki her cümleye, düzeyine göre verilecek (ters maddeler çevrilmeden önceki) puan. */
const KEYED: Record<Level, number> = { low: 1, average: 3, high: 5 };

/** IPIP'in anahtar sayfası (https://ipip.ori.org/newSingleConstructsKey.htm, "Optimism"): sayfadaki sırayla. */
const PAGE = {
  plus: ['Just know that I will be a success.', 'Feel comfortable with myself.', 'Seldom feel blue.', 'Look at the bright side of life.'],
  minus: [
    'Have a dark outlook on the future.',
    'Feel that my life lacks direction.',
    'Dislike myself.',
    'Often feel blue.',
    'See difficulties everywhere.',
    'Am often in a bad mood.',
  ],
};
const KEY = new Map(
  [...PAGE.plus.map((t) => [t, false] as const), ...PAGE.minus.map((t) => [t, true] as const)].map(([t, rev], i) => [`o${String(i + 1).padStart(2, '0')}`, { t, rev }]),
);
/** Ölçekhane'nin içeriğe göre ayrımı: hayata ve geleceğe bakış, kendine bakış, ruh hâli. */
const GROUP_OF: Record<string, string> = {
  o01: 'gelecek',
  o04: 'gelecek',
  o05: 'gelecek',
  o06: 'gelecek',
  o09: 'gelecek',
  o02: 'kendine_bakis',
  o07: 'kendine_bakis',
  o03: 'ruh_hali',
  o08: 'ruh_hali',
  o10: 'ruh_hali',
};

function keyedAnswers(level: (group: string) => Level) {
  return Object.fromEntries(
    d.items.map((it) => {
      const v = KEYED[level(it.scale)];
      return [it.key, { value: it.reverse ? 6 - v : v, rtMs: 2600 }];
    }),
  );
}
const body = (level: (group: string) => Level, grade = 10) => ({ grade, data: { engine: 'likert' as const, answers: keyedAnswers(level) } });

/** Toplam puanın düzeyi: on cümlenin ortalaması (bir ondalıkla), eşikler 2,6 ve 3,4. */
function totalLevel(g: Record<string, Level>): Level {
  const sum = d.items.reduce((s, it) => s + KEYED[g[it.scale]], 0);
  const mean = Math.round((sum / d.items.length) * 10) / 10;
  return mean < 2.6 ? 'low' : mean < 3.4 ? 'average' : 'high';
}

function roadmapTexts(rm: Roadmap): string[] {
  return [
    rm.intro,
    rm.standoutNote ?? '',
    rm.study.intro,
    ...rm.study.items.map((i) => i.text),
    ...rm.weeks.map((w) => `${w.title} ${w.text}`),
    ...(rm.approach?.items.map((i) => i.text) ?? []),
  ].filter(Boolean);
}

const insightOf = (rep: SimpleReport) => rep.items.find((x) => x.title === 'Bilmekte yarar var');
/** Rapor metinlerinde geçmeyecek sözcükler (tanı koyan ya da tıbbi dil). */
const FORBIDDEN = /depresyon|bozukluk|hastalık|intihar|ilaç|tedavi|teşhis/i;

/** Bir metindeki dört sözcüklük söz öbekleri (noktalama atılarak, küçük harfle). */
function grams(text: string, n = 4): Set<string> {
  const w = text.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
}

/** Tohumlu sözde rastgele sayı üreteci (mulberry32): her çalıştırmada aynı örüntüler. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Üç konunun bütün düzey birleşimleri (27). */
function* combos(): Generator<Record<string, Level>> {
  for (const a of BANDS) for (const b of BANDS) for (const c of BANDS) yield { gelecek: a, kendine_bakis: b, ruh_hali: c };
}

describe('İyimserlik Ölçeği tanımı', () => {
  it('10 madde; toplam puan on cümlenin ortalaması (bileşik ölçek); üç konu (5, 2, 3); ölçüm payı yok', () => {
    expect(d.items).toHaveLength(10);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    expect(d.scales[0].of).toEqual([...OPT_GROUPS]);
    expect(OPT_GROUPS.map((g) => d.items.filter((i) => i.scale === g).length)).toEqual([5, 2, 3]);
    expect(d.profile).toBeUndefined();
    expect(d.totalScale).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(10);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(10);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    // α yalnızca toplam puan için (IPIP sayfası); standart sapma bilinmediği için hiçbir satırda ölçüm payı yok.
    expect(d.scales[0].alpha).toBe(0.86);
    for (const s of d.scales) {
      expect(s.sdRef, s.key).toBeUndefined();
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
    }
    for (const s of d.scales.slice(1)) expect(s.alpha, s.key).toBeUndefined();
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain, d.engine]).toEqual(['active', 'public_domain', 9, 13, true, 'personality', 'likert']);
    expect(d.oppositePairs).toBeUndefined();
    expect(d.options.map((o) => o.value)).toEqual([1, 2, 3, 4, 5]);
    // Madde düzeyinde destek: "Sık sık kendimi hüzünlü hissederim" ve "Kendimden hoşlanmam" (ikisi de ters yönlü).
    expect(d.supportItems).toEqual([
      { key: 'o08', min: 4 },
      { key: 'o07', min: 4 },
    ]);
    for (const { key } of d.supportItems!) expect(d.items.find((i) => i.key === key)?.reverse, key).toBe(true);
    expect(d.sameAnswerCheck).toBe(true);
  });

  it('her madde kaynaktaki metni ve yönüyle aynı; kaynaktaki 10 maddenin hepsi var; konular içeriğe göre', () => {
    expect(KEY.size).toBe(10);
    for (const it of d.items) {
      const k = KEY.get(it.key);
      expect(k, it.key).toBeDefined();
      expect(it.source, it.key).toBe(k!.t);
      expect(!!it.reverse, it.key).toBe(k!.rev);
      expect(it.scale, it.key).toBe(GROUP_OF[it.key]);
    }
    expect(d.items.filter((i) => i.reverse)).toHaveLength(6);
  });

  it('uygulama sırası: artı yönlü maddeler 1., 4., 7. ve 10. sırada (olumlu başlangıç ve bitiş); birbirinin tersi ya da yakını olan maddeler uzak', () => {
    expect(d.items.flatMap((i, n) => (i.reverse ? [] : [n]))).toEqual([0, 3, 6, 9]);
    const pos = (key: string) => d.items.findIndex((i) => i.key === key);
    const far = (a: string, b: string, min: number) => expect(Math.abs(pos(a) - pos(b)), `${a}–${b}`).toBeGreaterThanOrEqual(min);
    far('o03', 'o08', 4); // iki hüzün maddesi
    far('o02', 'o07', 5); // kendimle barışığım – kendimden hoşlanmam
    far('o04', 'o09', 5); // iyi taraf – her şeyde zorluk
    far('o08', 'o10', 3); // sık sık hüzün – sık sık keyifsizlik
    expect(d.items[0].key).toBe('o04');
    expect(d.items[9].key).toBe('o01');
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri (5 madde)', () => {
    const others = INSTRUMENTS.filter((x) => x.slug !== SLUG && x.engine === 'likert' && x.domain === 'personality') as LikertInstrument[];
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      expect(same.map((x) => x.text), it.source).toContain(it.text);
    }
    expect(shared).toBe(5);
  });

  it('puanlar: toplam on cümlenin ortalaması, konular kendi cümlelerinin; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((g) => (g === 'ruh_hali' ? 'low' : 'high')));
    const by = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(by.get('ruh_hali')!.mean).toBe(1);
    expect(by.get('gelecek')!.mean).toBe(5);
    expect(by.get('kendine_bakis')!.nItems).toBe(2);
    expect(by.get(OPT)!.nItems).toBe(10);
    expect(by.get(OPT)!.mean).toBe((5 * 5 + 2 * 5 + 3 * 1) / 10);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('bilim kartı: kaynaklar bağlantılı ve metinde anılıyor; içerik notu, yaş notu ve sınırlılıklar', () => {
    const s = d.science;
    expect(JSON.stringify(s)).not.toMatch(/YAZILACAK/);
    expect(s.citations.length).toBeGreaterThanOrEqual(15);
    for (const c of s.citations) expect(c.url, c.text).toMatch(/^https:\/\/(doi\.org\/|ipip\.ori\.org\/)/);
    const text = JSON.stringify({ ...s, citations: [] });
    for (const a of [
      'Scheier ve ark., 1994',
      'Carver ve ark., 2010',
      'Goldberg ve ark., 2006',
      'Goldberg ve Saucier, 2016',
      'Solberg Nes ve Segerstrom, 2006',
      'Rasmussen ve ark., 2009',
      'Scheier ve ark., 2021',
      'Rincón Uribe ve ark., 2021',
      'Erdoğdu, 2021',
      'Malouff ve Schutte, 2017',
      'Hinz ve ark., 2024',
      'Hinz ve ark., 2017',
      'Kennes ve ark., 2021',
      'Chen ve ark., 2025',
    ]) {
      expect(text, a).toContain(a);
    }
    for (const c of s.citations.filter((c) => !c.text.startsWith('IPIP'))) expect(text, c.text).toContain(c.text.split(',')[0]);
    // Cümlelerin içeriği açıkça yazılır: beşi depresyon alt ölçeğinde de var; üç konu ayrı ölçek değildir.
    expect(s.whatItMeasures).toContain('beşi hayata ve geleceğe bakışı sorar');
    expect(s.whatItMeasures).toContain('depresyon alt ölçeğinde');
    expect(s.reliability).toContain('.69');
    expect(s.reliability).toContain('ölçüm payı gösterilmez');
    expect(s.ageNote).toContain('yetişkinler de çözebilir');
    const lim = s.limitations.join(' ');
    expect(lim).toContain('ayrı ölçekler olarak geliştirilmemiş');
    expect(lim).toContain('tanı aracı değildir');
    expect(lim).toContain('Tanı koymaz');
    expect(s.normNote).toContain('klinik bir eşik değildir');
  });

  it('çok hızlı cevap ve bütün cümlelere aynı uç cevap kalite notu verir; ortadaki seçenek ya da karışık cevaplar vermez', () => {
    const fast = Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(d, fast).tooFast).toBe(true);
    const same = (v: number) => Object.fromEntries(d.items.map((it) => [it.key, { value: v, rtMs: 2600 }]));
    for (const v of [1, 2, 4, 5]) {
      const q = likertQuality(d, same(v));
      expect(q.straightLining, String(v)).toBe(false);
      expect(q.sameAnswer, String(v)).toBe(true);
      const label = d.options.find((o) => o.value === v)!.label;
      expect(q.notes, String(v)).toEqual([
        `Bütün cümlelere aynı cevap (“${label}”) verilmiş. Cümlelerin bir kısmı olumlu, bir kısmı olumsuz bir şey söylediği için bu, ne söylediklerine bakmadan cevap verme eğiliminden kaynaklanabilir; bu yüzden sonuçlar dikkatle yorumlanmalıdır.`,
      ]);
    }
    expect(likertQuality(d, same(3)).sameAnswer).toBe(false);
    expect(likertQuality(d, keyedAnswers(() => 'high')).notes).toEqual([]);
    // Eksik cevapta (dokuz madde) "aynı cevap" notu yok; yalnızca eksik madde notu.
    const nine = same(5);
    delete nine.o01;
    expect(likertQuality(d, nine).sameAnswer).toBe(false);
    // Rapor: not uyarılarda görünür.
    const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers: same(5) } });
    expect(r.student.cautions.join(' ')).toContain('Bütün cümlelere aynı cevap (“Tamamen doğru”)');
  });

  it('yayında: listelerde ve site haritasında; adında "tanı" yok', () => {
    expect(publicInstruments().some((x) => x.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((x) => x.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(d.name).not.toMatch(/tanı/i);
  });
});

describe('İyimserlik raporu', () => {
  it('genel bakışta dört satır (toplam ve üç konu); ilk madde "Bilmekte yarar var", ardından her satırın kartı', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('ayrı birer ölçek değildir');
      expect(rep.items.map((x) => x.title)).toEqual(['Bilmekte yarar var', ...NAMES]);
    }
    expect(r.parent.items[1].text).toMatch(/^Çocuğunuzun /);
    expect(r.student.items[1].text).not.toContain('Çocuğunuz');
  });

  it('her satırın düşük, orta ve yüksek düzey metni yazılmış; dil kuralları; destek kutusu yalnızca düşük düzeylerde', () => {
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
        expect(bt.parent, label).toMatch(/^Çocuğunuzun /);
        expect(bt.student, label).not.toMatch(/[Çç]ocuğunuz/);
        expect(`${bt.student} ${bt.parent}`, label).not.toMatch(FORBIDDEN);
        expect(!!bt.support, label).toBe(band === 'low');
        expect(bt.adult, label).toBeUndefined();
        expect(schoolWords(bt.student), label).toEqual([]);
        expect(bt.student, label).toMatch(/[.]$/);
        expect(bt.parent, label).toMatch(/[.]$/);
        // Konu satırları kaç cümlenin ortalaması olduklarını söyler.
        if (s !== OPT) expect(bt.student, label).toMatch(/(beş|iki|üç) cümleye verdiğin cevaplar/);
      }
      expect(summaries.size, s).toBe(3);
    }
    // "Tanı değildir" bir raporda en çok bir kartta geçer (raporun sonunda zaten yazar).
    const parents = SCALES.map((s) => t.scales[s].low!.parent).filter((x) => /tanı değildir/.test(x));
    expect(parents).toHaveLength(1);
    // Toplam kartı konular hakkında hüküm vermez (konu satırları başka yönde olabilir).
    for (const band of BANDS) {
      const bt = t.scales[OPT][band]!;
      expect(`${bt.student} ${bt.parent}`, band).not.toMatch(/kendin|kendisi|ruh hâl|geleceğe|hayata|bekle|iyi gidece/);
      expect(bt.student, band).toMatch(/^On cümleye verdiğin cevaplar /);
      expect(bt.parent, band).toMatch(/^Çocuğunuzun on cümleye verdiği cevaplar /);
    }
    // "Bilmekte yarar var", ayrışma metinleri ve destek cümlesi de aynı dil kurallarına uyar.
    const ins = t.insight!;
    const extra = [
      ...ins.lead.map((x) => x.text),
      ...ins.rules.map((x) => x.text),
      ...Object.values(t.itemSplit!),
      t.itemSupport!,
    ];
    for (const x of extra) {
      const label = x.student.slice(0, 50);
      expect(`${x.student} ${x.parent} ${x.adult ?? ''}`, label).not.toMatch(FORBIDDEN);
      if (!ins.lead.some((l) => l.text === x)) expect(x.parent, label).toMatch(/[Çç]ocuğunuz/);
      expect(`${x.student} ${x.adult ?? ''}`, label).not.toMatch(/[Çç]ocuğunuz/);
      expect(schoolWords(x.adult ?? x.student), label).toEqual([]);
      for (const y of [x.student, x.parent, x.adult ?? '.']) expect(y, label).toMatch(/[.]$/);
    }
    // Ayrışma metinleri yalnızca az cümleli iki konuda; kendi kısa adıyla.
    expect(Object.keys(t.itemSplit!).sort()).toEqual(['kendine_bakis', 'ruh_hali']);
    for (const [k, x] of Object.entries(t.itemSplit!)) {
      expect(x.summary, k).toBe('Farklı cevaplar');
      expect(x.student, k).toMatch(/(iki|üç) cümleye verdiğin cevaplar birbirinden farklı/);
      expect(Object.values(t.scales[k]).map((b) => b!.summary), k).not.toContain(x.summary);
    }
  });

  it('27 birleşimin hepsinde: kartlar, rozetler, destek kutusu, "Bilmekte yarar var" ve yol haritası tutarlı (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const ins = t.insight!;
    let n = 0;
    for (const g of combos()) {
      const total = totalLevel(g);
      const levels: Record<string, Level> = { [OPT]: total, ...g };
      const b = body((x) => g[x]);
      const r = evaluate(SLUG, b);
      const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
      const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(levels[k]));
      const rules = ins.rules.filter((x) => fits(x.when) && !(x.not && fits(x.not)));
      for (const [rep, who] of [
        [r.student, 'student'],
        [r.parent, 'parent'],
        [adult, 'adult'],
      ] as const) {
        const label = `${g.gelecek}/${g.kendine_bakis}/${g.ruh_hali} ${who}`;
        const pick = (x: { student: string; parent: string; adult?: string }) => (who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student);
        // Kartlar ve rozetler.
        for (const [i, s] of SCALES.entries()) {
          const bt = t.scales[s][levels[s]]!;
          expect(rep.items[1 + i].text, `${label} ${s}`).toBe(who === 'parent' ? bt.parent : bt.student);
          expect(rep.items[1 + i].badge, `${label} ${s}`).toBe(`${t.bandLabels[levels[s]]} · ${bt.summary}`);
        }
        // Destek kutusu: dört satırdan biri düşükse. Ruh hâli ya da kendine bakış düşükken "Sık sık kendimi hüzünlü
        // hissederim" ya da "Kendimden hoşlanmam" cümlesine "Tamamen doğru" denmiştir: kutunun ilk satırı bunu söyler.
        expect(rep.support !== null, label).toBe(Object.values(levels).includes('low'));
        const itemNote = pick(t.itemSupport!);
        expect(rep.support?.lines[0] === itemNote, label).toBe(g.ruh_hali === 'low' || g.kendine_bakis === 'low');
        // Bilmekte yarar var: giriş ve uyan kurallar.
        expect(insightOf(rep)!.text, label).toBe([pick(ins.lead[0].text), ...rules.map((x) => pick(x.text))].join('\n\n'));
        const all = [insightOf(rep)!.text, ...rep.items.map((x) => x.text), rep.chartNote ?? ''].join(' ');
        if (who !== 'parent') expect(all, label).not.toMatch(/[Çç]ocuğunuz/);
        if (who === 'adult') {
          expect(schoolWords(all), label).toEqual([]);
          expect(all, label).not.toContain('Öz-saygı Ölçeği');
        }
        // Yol haritası: üç konu, dört hafta; 2. hafta "En iyi olası gelecek"; 3. hafta ruh hâli düşükse ona, değilse
        // kendine bakış düşükse ona ("Öz-saygı nedir?" bağlantısıyla).
        const rm = rep.roadmap!;
        expect(rm.bars.map((x) => x.label), label).toEqual(GROUP_NAMES);
        expect(rm.study.items.map((x) => x.key), label).toEqual([...OPT_GROUPS]);
        expect(rm.settings, label).toBeNull();
        expect(rm.weeks.map((w) => w.title)[1], label).toBe('En iyi olası gelecek');
        expect(rm.weeks, label).toHaveLength(4);
        if (g.ruh_hali === 'low') expect(rm.weeks[2].title, label).toBe('Ruh hâli');
        else if (g.kendine_bakis === 'low') expect(rm.weeks[2].title, label).toBe('Kendine bakış');
        const links = rm.study.links.map((l) => l.href);
        expect(links.includes('/rehber/oz-saygi-nedir'), label).toBe(g.ruh_hali !== 'low' && g.kendine_bakis === 'low');
        expect(rm.approach?.items.length ?? 0, label).toBe(who === 'parent' ? 3 : 0);
        if (Object.values(g).every((x) => x === 'average')) expect(rm.standoutNote, label).toContain('orta düzeyde');
        for (const x of roadmapTexts(rm)) {
          expect(x, label).not.toMatch(/undefined|null|\s{2}/);
          if (who !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
          if (who === 'adult') expect(schoolWords(x), `${label}: ${x}`).toEqual([]);
        }
        n++;
      }
    }
    expect(n).toBe(27 * 3);
    // Her kural en az bir birleşimde uyar.
    for (const x of ins.rules) {
      const any = [...combos()].some((g) => {
        const levels: Record<string, Level> = { [OPT]: totalLevel(g), ...g };
        const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(levels[k]));
        return fits(x.when) && !(x.not && fits(x.not));
      });
      expect(any, x.text.student.slice(0, 40)).toBe(true);
    }
  }, 120_000);

  it('karışık cevaplarda (400 rastgele ve elle seçilmiş örüntü): kartlar, "Farklı cevaplar", destek kutusu ve kurallar puanlarla tutarlı', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const ins = t.insight!;
    const rand = mulberry32(20261021);
    const patterns: Record<string, number>[] = [];
    for (let n = 0; n < 400; n++) patterns.push(Object.fromEntries(d.items.map((it) => [it.key, 1 + Math.floor(rand() * 5)])));
    // Ortalamanın gizleyebildiği tek cevaplar: öteki cümlelere olumlu ("Oldukça") cevap.
    const base = (v: Record<string, number>) => ({ ...Object.fromEntries(d.items.map((it) => [it.key, it.reverse ? 2 : 4])), ...v });
    patterns.push(base({ o08: 4 }), base({ o07: 4 }), base({ o08: 5, o03: 5, o10: 1 }), base({ o02: 5, o07: 5 }), base({ o02: 1, o07: 1 }), base({ o08: 4, o03: 3, o10: 3 }));
    const seen = { split: 0, itemOnly: 0, rules: new Set<number>() };
    for (const raw of patterns) {
      const keyed = (key: string) => (d.items.find((i) => i.key === key)!.reverse ? 6 - raw[key] : raw[key]);
      const keysOf = (s: string) => d.items.filter((i) => s === OPT || i.scale === s).map((i) => i.key);
      const levelOf = (s: string): Level => {
        const ks = keysOf(s);
        const mean = Math.round((ks.reduce((a, k) => a + keyed(k), 0) / ks.length) * 10) / 10;
        return mean < 2.6 ? 'low' : mean < 3.4 ? 'average' : 'high';
      };
      const levels = Object.fromEntries(SCALES.map((s) => [s, levelOf(s)])) as Record<string, Level>;
      const mixed = (s: string) => keysOf(s).some((k) => keyed(k) >= 4) && keysOf(s).some((k) => keyed(k) <= 2);
      const itemSupport = raw.o08 >= 4 || raw.o07 >= 4;
      const fits = (when: Record<string, string[]>) => Object.entries(when).every(([k, v]) => v.includes(levels[k]));
      const rules = ins.rules.filter((x, i) => fits(x.when) && !(x.not && fits(x.not)) && seen.rules.add(i));
      const b = { grade: 11, data: { engine: 'likert' as const, answers: Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, { value: v, rtMs: 2600 }])) } };
      const r = evaluate(SLUG, b);
      const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
      const label0 = d.items.map((i) => raw[i.key]).join('');
      for (const [rep, who] of [
        [r.student, 'student'],
        [r.parent, 'parent'],
        [adult, 'adult'],
      ] as const) {
        const label = `${label0} ${who}`;
        const pick = (x: { student: string; parent: string; adult?: string }) => (who === 'parent' ? x.parent : who === 'adult' ? (x.adult ?? x.student) : x.student);
        for (const [i, s] of SCALES.entries()) {
          const split = t.itemSplit![s];
          const shown = split && mixed(s) && levels[s] !== 'low' ? split : t.scales[s][levels[s]]!;
          expect(rep.items[1 + i].text, `${label} ${s}`).toBe(pick(shown));
          expect(rep.items[1 + i].badge, `${label} ${s}`).toBe(`${t.bandLabels[levels[s]]} · ${shown.summary}`);
          if (shown === split && who === 'student') seen.split++;
        }
        // Tek bir cevap da destek kutusunu açar; kutunun ilk satırı nedenini söyler.
        expect(rep.support !== null, label).toBe(Object.values(levels).includes('low') || itemSupport);
        expect(rep.support?.lines[0] === pick(t.itemSupport!), label).toBe(itemSupport);
        if (itemSupport && !Object.values(levels).includes('low') && who === 'student') seen.itemOnly++;
        // "Sık sık kendimi hüzünlü hissederim" ya da "Kendimden hoşlanmam" dendiyse ilgili kart olumlu bir hüküm vermez.
        const summary = (s: string) => rep.items[1 + SCALES.indexOf(s)].badge;
        if (raw.o08 >= 4) expect(summary('ruh_hali'), label).not.toContain('Çoğunlukla keyifli');
        if (raw.o07 >= 4) expect(summary('kendine_bakis'), label).not.toContain('Olumlu cevaplar');
        expect(insightOf(rep)!.text, label).toBe([pick(ins.lead[0].text), ...rules.map((x) => pick(x.text))].join('\n\n'));
        // Yol haritası rapordaki kartlarla aynı şeyi söyler: destek kutusunu açan cümlenin konusunda düşük düzeyin,
        // "Farklı cevaplar" konusunda orta düzeyin önerileri; 3. hafta ruh hâli (ya da kendine bakış) için.
        const flagged = (s: string) => (s === 'ruh_hali' ? raw.o08 >= 4 : s === 'kendine_bakis' ? raw.o07 >= 4 : false);
        const rmGroup = (s: string): Level => (flagged(s) ? 'low' : t.itemSplit![s] && mixed(s) && levels[s] !== 'low' ? 'average' : levels[s]);
        const rmT = ROADMAPS[SLUG];
        const rm = rep.roadmap!;
        for (const s of OPT_GROUPS) {
          expect(rm.study.items.find((x) => x.key === s)!.text, `${label} ${s}`).toBe(pick(rmT.scales[s].study[rmGroup(s)]));
          if (who === 'parent') expect(rm.approach!.items.find((x) => x.title === d.scales.find((y) => y.key === s)!.name)!.text, `${label} ${s}`).toBe(rmT.approach![s][rmGroup(s)]);
        }
        expect(rm.weeks[1].text, label).toBe(pick(rmT.scales.gelecek.action[rmGroup('gelecek')]));
        if (rmGroup('ruh_hali') === 'low') expect(rm.weeks[2].title, label).toBe('Ruh hâli');
        else if (rmGroup('kendine_bakis') === 'low') expect(rm.weeks[2].title, label).toBe('Kendine bakış');
        if (rm.weeks[2].title !== 'Ruh hâli' || rmGroup('ruh_hali') !== 'low') expect(rm.weeks[2].text, label).not.toContain('İki hafta ya da daha uzun');
        for (const x of [...rep.items.flatMap((i) => i.text.split('\n\n')), ...(rep.support?.lines ?? []), ...roadmapTexts(rep.roadmap!)]) {
          expect(x, label).not.toMatch(/undefined|null|\s{2}/);
          if (who !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
        }
      }
    }
    // Örüntüler bütün durumları dener: ayrışma metni, yalnızca bir cevabın açtığı destek kutusu ve her kural.
    expect(seen.split).toBeGreaterThan(20);
    expect(seen.itemOnly).toBeGreaterThan(5);
    expect(seen.rules.size).toBe(ins.rules.length);
  }, 180_000);

  it('toplam puan konuları gizleyebilir: ruh hâli düşükken toplam düşük değilse bu ayrıca söylenir ve destek kutusu açılır', () => {
    const r = evaluate(SLUG, body((g) => (g === 'ruh_hali' ? 'low' : g === 'gelecek' ? 'average' : 'high')));
    expect(r.student.items[1].badge).toMatch(/^Orta/);
    expect(insightOf(r.student)!.text).toContain('Toplam puan, üç cümlelik bu konudaki cevapları gizleyebilir');
    expect(r.student.support).not.toBeNull();
    expect(r.parent.support!.lines.join(' ')).toContain('112');
    // Geleceğe umutla bakarken ruh hâli düşükse bu ikisinin bir arada olabileceği söylenir.
    const h = evaluate(SLUG, body((g) => (g === 'ruh_hali' ? 'low' : 'high')));
    expect(h.student.items[1].badge).toMatch(/^Yüksek/);
    expect(insightOf(h.student)!.text).toContain('Bu ikisi bir arada olabilir');
    expect(insightOf(h.student)!.text).not.toContain('Toplam puan, üç cümlelik');
    // Toplam puan yüksekken hayata ve geleceğe bakış daha az umutluysa bu da söylenir.
    const g = evaluate(SLUG, body((x) => (x === 'gelecek' ? 'average' : 'high')));
    expect(g.student.items[1].badge).toMatch(/^Yüksek/);
    expect(insightOf(g.student)!.text).toContain('yüksek toplam puan daha çok öteki cümlelerden geliyor');
  });

  it('uç ve orta cevaplar: bütün satırlar aynı düzeyde', () => {
    for (const [level, label] of [
      ['high', 'Yüksek'],
      ['low', 'Düşük'],
      ['average', 'Orta'],
    ] as const) {
      const r = evaluate(SLUG, body(() => level, 12));
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(rows.every((x) => x.band === label), level).toBe(true);
    }
  });

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const level of BANDS) {
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify({ ...rest, normNote: '' })), level).toEqual([]);
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

describe('İyimserlik gelişim yol haritası', () => {
  it('üç sütun (konular), üç ayrı renk; ortamlar yok; kaynaklar bağlantılı', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toContain('dört haftalık küçük adımlar');
    const t = ROADMAPS[SLUG];
    expect(Object.keys(t.scales)).toEqual([...OPT_GROUPS]);
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(3);
    expect(t.planningScale).toBe('gelecek');
    expect(t.settingsNote).toBeUndefined();
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
          ['toplam-öğrenci', tpl.scales[OPT][g]!.student],
          ['toplam-veli', tpl.scales[OPT][g]!.parent],
          ['öneri-öğrenci', sc.study[g].student],
          ['öneri-veli', sc.study[g].parent],
          ['dene-öğrenci', sc.action[g].student],
          ['dene-veli', sc.action[g].parent],
          ['yaklaşım', t.approach![key][g]],
          ...(tpl.itemSplit?.[key]
            ? ([
                ['ayrışma-öğrenci', tpl.itemSplit[key].student],
                ['ayrışma-veli', tpl.itemSplit[key].parent],
              ] as [string, string][])
            : []),
        ];
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            const [ni, ti] = parts[i];
            const [nj, tj] = parts[j];
            // Aynı bölümün öğrenci ve veli metni birbirinin karşılığıdır; rapor kartı ile toplam kartı da aynı kalıptadır.
            if (ni.split('-')[0] === nj.split('-')[0]) continue;
            const report = ['rapor', 'toplam', 'ayrışma'];
            if (report.includes(ni.split('-')[0]) && report.includes(nj.split('-')[0])) continue;
            const common = [...grams(ti)].filter((x) => grams(tj).has(x));
            expect(common, `${key}/${g} ${ni} – ${nj}`).toEqual([]);
          }
        }
      }
    }
    const tips = Object.values(t.approach!).flatMap((x) => Object.values(x));
    for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) expect([...grams(tips[i])].filter((x) => grams(tips[j]).has(x)), `${tips[i]} – ${tips[j]}`).toEqual([]);
  });

  it('ruh hâli düşükken öneriler iki hafta ya da daha uzun süren keyifsizlikte biriyle konuşmayı ve doktoru söyler (MedlinePlus); yetişkine okul yok', () => {
    const t = ROADMAPS[SLUG];
    const a = t.scales.ruh_hali.action.low;
    for (const x of [a.student, a.parent, a.adult!]) {
      expect(x).toContain('İki hafta ya da daha uzun süredir çoğu zaman');
      expect(x).toMatch(/doktor|aile hekimi/);
    }
    expect(a.adult).toContain('aile hekimine');
    expect(schoolWords(a.adult!)).toEqual([]);
    expect(t.approach!.ruh_hali.low).toContain('en az iki haftadır çoğu gün');
    // Çalışma önerisi kartı bunu tekrarlamaz.
    expect(`${t.scales.ruh_hali.study.low.student} ${t.scales.ruh_hali.study.low.parent}`).not.toMatch(/uzun (zaman|süre)/);
  });

  it('ilk hafta: öğrenciye yeniden bakmayı, veliye raporu birlikte okuyup yargılamadan dinlemeyi önerir; 2. hafta "En iyi olası gelecek"', () => {
    const t = ROADMAPS[SLUG];
    expect(t.firstWeek.student).toContain('başka bir açıdan');
    expect(t.firstWeek.parent).toContain('yargılamadan dinlemeye');
    for (const g of BANDS) {
      const a = t.scales.gelecek.action[g];
      expect(`${a.student} ${a.parent}`, g).toMatch(/(bir yıl|beş yıl) sonra|en iyi olası sonucu/);
      expect(a.parent, g).toMatch(/yazmasını önerin/);
    }
  });

  it('son haftada önerilen testler yayında; yetişkine yetişkinlere açık olanlar önerilir', () => {
    const r = evaluate(SLUG, body(() => 'average', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('Öz-saygı ve Duygusal Zekâ Bileşenleri');
    const adult = evaluateAdult(SLUG, { ...body(() => 'average'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).toContain('Duygusal Zekâ Bileşenleri ve Kişiliğin 10 Yönü');
  });
});

describe('yayın denetimi', () => {
  it('yayındaki sitenin dış sınamasında İyimserlik raporu denetlenir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/iyimserlik');
    expect(yml).toContain('iyimserlik-raporu');
    expect(yml).toContain('iyimserlik-destek');
    // Yayındaki denetimin gövdesi (o08 = 4, öteki cümleler 3) burada da aynı sonucu verir.
    const answers = Object.fromEntries(d.items.map((it) => [it.key, { value: it.key === 'o08' ? 4 : 3, rtMs: 2500 }]));
    const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.every((x) => x.band !== 'Düşük')).toBe(true);
    expect(r.student.support!.lines[0]).toMatch(/^Cevaplarından en az birinde/);
    expect(r.parent.support!.lines[0]).toMatch(/^Çocuğunuz cevaplarından/);
  });
});
