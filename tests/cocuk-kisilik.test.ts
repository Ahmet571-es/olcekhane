import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { cocukKisilik } from '@/content/instruments/cocuk-kisilik';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS, hasPublicRoadmap } from '@/content/roadmaps';
import { AGE_GROUPS } from '@/content/age-groups';
import { AssessmentError, evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { anchoredBand, likertQuality, scoreLikert, type LikertAnswer } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { likertBody } from './helpers/bodies';

const SLUG = 'cocuk-kisilik-profili';
const d = cocukKisilik;
const SCALES = ['extraversion', 'agreeableness', 'conscientiousness', 'emotional_stability', 'intellect'];
const NAMES = ['Sosyallik', 'Başkalarını önemseme', 'Düzen ve sorumluluk', 'Sakinlik', 'Merak ve hayal gücü'];

/** IPIP Beş Faktör Belirteçleri, 100 maddelik form (https://ipip.ori.org/newBigFive5broadKey.htm): ölçek → artı ve eksi yönlü maddeler. */
const IPIP: Record<string, { plus: string[]; minus: string[] }> = {
  extraversion: {
    plus: [
      'Am the life of the party.',
      'Feel comfortable around people.',
      'Start conversations.',
      'Talk to a lot of different people at parties.',
      "Don't mind being the center of attention.",
      'Make friends easily.',
      'Take charge.',
      'Know how to captivate people.',
      'Feel at ease with people.',
      'Am skilled in handling social situations.',
    ],
    minus: [
      "Don't talk a lot.",
      'Keep in the background.',
      'Have little to say.',
      "Don't like to draw attention to myself.",
      'Am quiet around strangers.',
      'Find it difficult to approach others.',
      'Often feel uncomfortable around others.',
      'Bottle up my feelings.',
      'Am a very private person.',
      'Wait for others to lead the way.',
    ],
  },
  agreeableness: {
    plus: [
      'Am interested in people.',
      "Sympathize with others' feelings.",
      'Have a soft heart.',
      'Take time out for others.',
      "Feel others' emotions.",
      'Make people feel at ease.',
      "Inquire about others' well-being.",
      'Know how to comfort others.',
      'Love children.',
      'Am on good terms with nearly everyone.',
      'Have a good word for everyone.',
      'Show my gratitude.',
      'Think of others first.',
      'Love to help others.',
    ],
    minus: [
      'Insult people.',
      "Am not interested in other people's problems.",
      'Feel little concern for others.',
      'Am not really interested in others.',
      'Am hard to get to know.',
      'Am indifferent to the feelings of others.',
    ],
  },
  conscientiousness: {
    plus: [
      'Am always prepared.',
      'Pay attention to details.',
      'Get chores done right away.',
      'Like order.',
      'Follow a schedule.',
      'Am exacting in my work.',
      'Do things according to a plan.',
      'Continue until everything is perfect.',
      'Make plans and stick to them.',
      'Love order and regularity.',
      'Like to tidy up.',
    ],
    minus: [
      'Leave my belongings around.',
      'Make a mess of things.',
      'Often forget to put things back in their proper place.',
      'Shirk my duties.',
      'Neglect my duties.',
      'Waste my time.',
      'Do things in a half-way manner.',
      'Find it difficult to get down to work.',
      'Leave a mess in my room.',
    ],
  },
  emotional_stability: {
    plus: ['Am relaxed most of the time.', 'Seldom feel blue.', 'Am not easily bothered by things.', 'Rarely get irritated.', 'Seldom get mad.'],
    minus: [
      'Get stressed out easily.',
      'Worry about things.',
      'Am easily disturbed.',
      'Get upset easily.',
      'Change my mood a lot.',
      'Have frequent mood swings.',
      'Get irritated easily.',
      'Often feel blue.',
      'Get angry easily.',
      'Panic easily.',
      'Feel threatened easily.',
      'Get overwhelmed by emotions.',
      'Take offense easily.',
      'Get caught up in my problems.',
      'Grumble about things.',
    ],
  },
  intellect: {
    plus: [
      'Have a rich vocabulary.',
      'Have a vivid imagination.',
      'Have excellent ideas.',
      'Am quick to understand things.',
      'Use difficult words.',
      'Spend time reflecting on things.',
      'Am full of ideas.',
      'Carry the conversation to a higher level.',
      'Catch on to things quickly.',
      'Can handle a lot of information.',
      'Love to think up new ways of doing things.',
      'Love to read challenging material.',
      'Am good at many things.',
    ],
    minus: [
      'Have difficulty understanding abstract ideas.',
      'Am not interested in abstract ideas.',
      'Do not have a good imagination.',
      'Try to avoid complex people.',
      'Have difficulty imagining things.',
      'Avoid difficult reading material.',
      'Will not probe deeply into a subject.',
    ],
  },
};

/** Her ölçekte cevap toplamı: k. ölçek için altı maddeye verilecek (düz yönlü) değerler. */
const BAND_SUMS = { low: [6, 7, 8, 9], average: [10, 11, 12, 13, 14], high: [15, 16, 17, 18] } as const;
type Band3 = keyof typeof BAND_SUMS;

/**
 * Ölçek başına istenen toplamı veren cevaplar (ters maddelerde değer çevrilir). Puanlar maddelere olabildiğince eşit
 * dağıtılır (aralarında en çok 1 fark): böylece birbirinin tersi olan iki cümleye aynı uç cevap verilmez.
 */
function bodyFor(sums: number[], grade = 4) {
  const values: Record<string, number> = {};
  SCALES.forEach((scale, k) => {
    const its = d.items.filter((i) => i.scale === scale);
    const base = Math.floor(sums[k] / 6);
    const rem = sums[k] - 6 * base;
    its.forEach((it, j) => {
      const v = base + ((j + k) % 6 < rem ? 1 : 0);
      values[it.key] = it.reverse ? 4 - v : v;
    });
  });
  const answers = Object.fromEntries(d.items.map((it) => [it.key, { value: values[it.key], rtMs: 2500 }]));
  return { grade, data: { engine: 'likert' as const, answers } };
}

const text = (r: SimpleReport) => JSON.stringify(r);

describe('Çocuk kişilik profili: maddeler', () => {
  it('30 madde; her boyutta altı madde, üçü ters yönlü; maddeler IPIP 100 maddelik formdan ve yönleri kaynakla aynı', () => {
    expect(d.items).toHaveLength(30);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const scale of SCALES) {
      const its = d.items.filter((i) => i.scale === scale);
      expect(its, scale).toHaveLength(6);
      expect(its.filter((i) => i.reverse), scale).toHaveLength(3);
      for (const it of its) {
        const page = IPIP[scale];
        const inPlus = page.plus.includes(it.source!);
        const inMinus = page.minus.includes(it.source!);
        expect(inPlus || inMinus, `${it.key} ${it.source}`).toBe(true);
        expect(!!it.reverse, `${it.key} yön`).toBe(inMinus);
      }
    }
    // Aynı IPIP maddesi iki kez kullanılmaz; Türkçe metinler de birbirinden farklıdır.
    expect(new Set(d.items.map((i) => i.source)).size).toBe(30);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(30);
    expect(new Set(d.items.map((i) => i.key)).size).toBe(30);
  });

  it('çocuk dili: kısa cümleler, "değil" yok; olumsuz fiil yalnızca bir maddede', () => {
    for (const it of d.items) {
      expect(it.text.length, it.key).toBeLessThanOrEqual(60);
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
      expect(it.text, it.key).not.toMatch(/\bdeğil/i);
    }
    // "-mam/-mem" ile biten (olumsuz) fiiller: yalnızca "pek aldırmam".
    const negated = d.items.filter((i) => /\p{L}+(mam|mem)\.$/u.test(i.text));
    expect(negated.map((i) => i.key)).toEqual(['A2']);
  });

  it('uygulama sırası: art arda iki madde aynı boyuttan değil; boyutlar sırayla döner; her turda yönler değişir', () => {
    d.items.forEach((it, i) => {
      expect(it.scale, String(i)).toBe(SCALES[i % 5]);
      // Turun çift sıradaki maddeleri düz, tek sıradakileri ters (bir sonraki turda tersine).
      const round = Math.floor(i / 5);
      expect(!!it.reverse, String(i)).toBe((i % 5) % 2 === (round % 2 === 0 ? 1 : 0));
    });
  });

  it('birbirinin tersi olan beş çift: aynı boyutta, biri düz biri ters; aralarında 15 madde', () => {
    expect(d.oppositePairs).toHaveLength(5);
    const pos = (k: string) => d.items.findIndex((i) => i.key === k);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items[pos(x)];
      const b = d.items[pos(y)];
      expect(a.scale).toBe(b.scale);
      expect(!!a.reverse).toBe(false);
      expect(!!b.reverse).toBe(true);
      expect(Math.abs(pos(x) - pos(y)), `${x} ${y}`).toBe(15);
    }
    expect(new Set(d.oppositePairs!.map(([x]) => d.items.find((i) => i.key === x)!.scale)).size).toBe(5);
  });
});

describe('Çocuk kişilik profili: puanlama', () => {
  it('üç seçenek; düzeyler toplamla: 6–9 düşük, 10–14 orta, 15–18 yüksek', () => {
    expect(d.options.map((o) => o.value)).toEqual([1, 2, 3]);
    for (const [band, sums] of Object.entries(BAND_SUMS) as [Band3, readonly number[]][]) {
      for (const sum of sums) {
        const scores = scoreLikert(d, bodyFor(SCALES.map(() => sum)).data.answers);
        for (const s of scores) {
          expect(s.band, `${s.scaleKey} ${sum}`).toBe(band);
          expect(s.value).toBeCloseTo(sum / 6, 2);
        }
      }
    }
    // Eşikler, gösterilen bir ondalıklı ortalamaya göre.
    expect(anchoredBand(1.6, d.anchoredBands)).toBe('low');
    expect(anchoredBand(1.7, d.anchoredBands)).toBe('average');
    expect(anchoredBand(2.3, d.anchoredBands)).toBe('average');
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('high');
  });

  it('en az beş maddesi cevaplanan boyut hesaplanır', () => {
    const answers: Record<string, LikertAnswer> = bodyFor(SCALES.map(() => 12)).data.answers;
    const drop = (keys: string[]) => Object.fromEntries(Object.entries(answers).filter(([k]) => !keys.includes(k)));
    expect(scoreLikert(d, drop(['E1'])).find((s) => s.scaleKey === 'extraversion')!.valid).toBe(true);
    expect(scoreLikert(d, drop(['E1', 'E2'])).find((s) => s.scaleKey === 'extraversion')!.valid).toBe(false);
  });

  it('katılma eğilimi: birbirinin tersi olan çiftlerin en az üçünde iki cümleye de aynı uç cevap verilirse uyarı', () => {
    const base = bodyFor(SCALES.map(() => 12)).data.answers;
    const withPairs = (n: number, v: number) => {
      const a = { ...base };
      for (const [x, y] of d.oppositePairs!.slice(0, n)) {
        a[x] = { value: v, rtMs: 2500 };
        a[y] = { value: v, rtMs: 2500 };
      }
      return a;
    };
    for (const [n, v, note] of [
      [2, 3, false],
      [3, 3, true],
      [5, 3, true],
      [2, 1, false],
      [3, 1, true],
    ] as const) {
      const q = likertQuality(d, withPairs(n, v));
      expect(v === 3 ? q.oppositeAgree : q.oppositeDisagree, `${n} ${v}`).toBe(n);
      const has = q.notes.some((x) => x.includes(`cümle çiftinden ${n} tanesinde iki cümleye de “${v === 3 ? 'Bana çok benziyor' : 'Bana hiç benzemiyor'}” denmiş`));
      expect(has, `${n} ${v}`).toBe(note);
    }
    // Her cümleye "Bana çok benziyor": hem uzun aynı cevap dizisi hem katılma eğilimi uyarısı; bütün boyutlar orta çıkar.
    const all = Object.fromEntries(d.items.map((i) => [i.key, { value: 3, rtMs: 2500 }]));
    const q = likertQuality(d, all);
    expect([q.straightLining, q.oppositeAgree]).toEqual([true, 5]);
    expect(scoreLikert(d, all).every((s) => s.band === 'average')).toBe(true);
    const r = evaluate(SLUG, { grade: 4, data: { engine: 'likert', answers: all } });
    expect(r.student.cautions.some((c) => c.includes('çoğuna “evet” deme eğiliminden'))).toBe(true);
    expect(r.parent.cautions.some((c) => c.includes('çoğuna “evet” deme eğiliminden'))).toBe(true);
  });
});

describe('Çocuk kişilik profili: rapor', () => {
  it('bütün düzey birleşimlerinde öğrenci ve veli raporu eksiksiz ve tutarlı; destek kutusu yalnızca sakinlik düşükken', () => {
    const bands: Band3[] = ['low', 'average', 'high'];
    const label = { low: 'Düşük', average: 'Orta', high: 'Yüksek' };
    let n = 0;
    for (let k = 0; k < 3 ** 5; k++) {
      const combo = SCALES.map((_, i) => bands[Math.floor(k / 3 ** i) % 3]);
      const sums = combo.map((b, i) => BAND_SUMS[b][(k + i) % BAND_SUMS[b].length]);
      const r = evaluate(SLUG, bodyFor(sums, 3 + (k % 3)));
      const tpl = REPORT_TEMPLATES[SLUG];
      for (const [aud, rep] of [
        ['student', r.student],
        ['parent', r.parent],
      ] as const) {
        const tag = `${combo.join('/')} ${aud}`;
        // Uzun bir bölümde hep aynı seçenek (ör. çok sayıda "biraz") olağan bir uyarıdır; başka uyarı olmamalı.
        expect(rep.cautions.filter((c) => !c.includes('hep aynı seçenek')), tag).toEqual([]);
        const items = rep.items;
        expect(items.map((i) => i.title), tag).toEqual(NAMES);
        combo.forEach((b, i) => {
          const bt = tpl.scales[SCALES[i]][b]!;
          expect(items[i].badge, tag).toContain(label[b]);
          expect(items[i].text, tag).toContain(aud === 'student' ? bt.student : bt.parent);
        });
        expect(!!rep.support, tag).toBe(combo[3] === 'low');
        // Çocuğa acil durum numarası verilmez; veliye verilir.
        if (rep.support) expect(rep.support.lines.join(' ').includes('112'), tag).toBe(aud === 'parent');
        if (aud === 'student') expect(text(rep), tag).not.toMatch(/[Çç]ocuğunuz/);
        else expect(text(rep), tag).not.toMatch(/\b(söylüyorsun|seviyorsun|hatırladın)\b/);
        const rm = rep.roadmap!;
        expect(rm.bars.map((b) => b.key), tag).toEqual(SCALES);
        expect(rm.settings, tag).toBeNull();
        expect(rm.weeks.map((w) => w.title)[2], tag).toBe(combo[3] === 'low' ? 'Sakinlik' : rm.weeks[2].title);
        expect(rm.study.links.map((l) => l.href), tag).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
        n++;
      }
    }
    expect(n).toBe(3 ** 5 * 2);
  }, 120_000);

  it('Merak ve hayal gücü metinleri zekâyı ölçmediğini söyler; sakinlik düşük veli metni tanı olmadığını ve desteği anlatır', () => {
    const tpl = REPORT_TEMPLATES[SLUG];
    for (const b of ['low', 'high'] as const) {
      expect(tpl.scales.intellect[b]!.student).toContain('ne kadar zeki olduğunu ölçmez');
      expect(tpl.scales.intellect[b]!.parent).toContain('zekâyı ölçmez');
    }
    expect(tpl.scales.emotional_stability.low!.parent).toContain('bir tanı değildir');
    expect(tpl.scales.emotional_stability.low!.parent).toContain('rehber öğretmeninden destek');
    expect(Object.values(tpl.scales).flatMap((s) => Object.values(s)).filter((x) => x?.support)).toHaveLength(1);
  });

  it('yalnızca 3, 4 ve 5. sınıflara açık; yetişkinlere açık değil', () => {
    for (const g of [3, 4, 5]) expect(() => evaluate(SLUG, bodyFor(SCALES.map(() => 12), g))).not.toThrow();
    for (const g of [1, 2, 6, 9, ADULT_GRADE]) expect(() => evaluateReports(SLUG, bodyFor(SCALES.map(() => 12), g)), String(g)).toThrow(AssessmentError);
    expect(d.adults).toBeUndefined();
  });

  it('PDF raporu üretilir (öğrenci ve veli)', async () => {
    const r = evaluate(SLUG, bodyFor([7, 12, 16, 8, 15]));
    for (const rep of [r.student, r.parent]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/cocuk-kisilik-profili');
    const m = /CK_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(m![1])).toEqual(d.items.map((i) => i.key));
    // Gövdedeki cevaplar: sırayla 1, 2, 3, 1, 2, 3, … (likertBody'de seçenek sırası 0, 1, 2).
    const r = evaluate(SLUG, likertBody(SLUG, 4, (i) => i % 3));
    expect(r.parent.chart?.type === 'rulers' || r.parent.chart?.type === 'bars' ? r.parent.chart.rows : []).toHaveLength(5);
    expect(r.student.items.map((i) => i.title)[0]).toBe('Sosyallik');
    const rm = r.parent.roadmap!;
    expect([rm.bars.length, rm.approach!.items.length, rm.settings, rm.weeks[1].title, rm.preview]).toEqual([5, 5, null, 'Çalışma düzeni', false]);
  });
});

/** Sayfada yan yana okunan metinler: kartlar, destek kutusu ve yol haritasının bölümleri. */
function pageTexts(rep: SimpleReport): string[] {
  const r = rep.roadmap!;
  return [
    ...rep.items.map((i) => i.text),
    ...(rep.support?.lines ?? []),
    r.standoutNote ?? '',
    r.study.intro,
    ...r.study.items.map((i) => i.text),
    ...(r.approach?.items.map((i) => i.text) ?? []),
    ...r.weeks.map((w) => w.text),
  ].filter(Boolean);
}

describe('Çocuk kişilik profili: 2026-10-22 incelemesi', () => {
  const tpl = REPORT_TEMPLATES[SLUG];
  const rm = ROADMAPS[SLUG];

  it('iki raporda da beş ölçeğe "yön" denir: kartların başlığı, genel bakış ve dengeli profil cümlesi', () => {
    expect(tpl.itemsTitle).toBe('Yönler');
    expect(rm.unit).toEqual({ one: 'yön', toPlural: 'yönlere' });
    expect(tpl.overview!.student).toContain('Beş yön');
    expect(tpl.overview!.parent).toContain('Beş yön');
    expect(JSON.stringify(tpl)).not.toMatch(/boyut/);
    // Beş yön de ortada ve uyarı yok: cevaplar 1, 2 ve 3 arasında dönerek (uzun bir aynı seçenek dizisi olmadan).
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: [1, 2, 3, 2, 3, 1][i % 6], rtMs: 2500 }]));
    const mid = evaluate(SLUG, { grade: 4, data: { engine: 'likert', answers } });
    expect(mid.student.cautions).toEqual([]);
    expect(mid.student.items.every((x) => x.badge?.startsWith('Orta'))).toBe(true);
    expect(mid.student.itemsTitle).toBe('Yönler');
    expect(mid.parent.itemsTitle).toBe('Yönler');
    expect(mid.student.roadmap!.standoutNote).toBe(rm.balancedNote!.student);
    expect(mid.parent.roadmap!.standoutNote).toBe(rm.balancedNote!.parent);
    expect(rm.balancedNote!.student).not.toMatch(/belirgin|profil/);
    // Norm notu iki raporda ortaktır: sade ve çocuğu kimseyle karşılaştırmaz.
    expect(d.science.normNote).not.toMatch(/akran|norm yok/i);
    expect(d.science.normNote).toContain('başka çocuklarla karşılaştırmaz');
  });

  it('veliye yaklaşım önerileri veli kartlarını, "Bu hafta dene" metinleri çalışma kartlarını tekrar etmez', () => {
    for (const [key, byGroup] of Object.entries(rm.approach!)) {
      for (const g of ['low', 'average', 'high'] as const) {
        const card = tpl.scales[key][g]!.parent;
        for (const part of byGroup[g].split(/;\s*/)) expect(card, `${key} ${g}`).not.toContain(part.replace(/\.$/, ''));
      }
    }
    expect(rm.approach!.emotional_stability.low).not.toContain('rehber');
    expect(tpl.scales.emotional_stability.low!.parent).toContain('okul hayatını, uykusunu ya da arkadaşlıklarını');
    expect(tpl.scales.emotional_stability.low!.student).not.toMatch(/öğretmen|ailene/);
    expect(rm.scales.emotional_stability.action.low.student).not.toContain('tek başına taşımak');
    expect(rm.scales.agreeableness.study.low.student).not.toContain('Kendi başına çalışmak');
    expect(rm.scales.conscientiousness.study.high.student).not.toContain('birkaç güne yayarak');
    expect(rm.scales.extraversion.action.high.student).not.toContain('soru-cevap');
    expect(rm.scales.intellect.action.low.student).toContain('“Bu nasıl çalışıyor?”');
  });

  it('bütün düzey birleşimlerinde aynı sayfada bir cümle iki kez geçmez; veliye yaklaşım beş yönün hepsi için', () => {
    const bands: Band3[] = ['low', 'average', 'high'];
    for (let k = 0; k < 3 ** 5; k++) {
      const combo = SCALES.map((_, i) => bands[Math.floor(k / 3 ** i) % 3]);
      const sums = combo.map((b, i) => BAND_SUMS[b][(k + i) % BAND_SUMS[b].length]);
      const r = evaluate(SLUG, bodyFor(sums, 3 + (k % 3)));
      expect(r.parent.roadmap!.approach!.items, combo.join('/')).toHaveLength(5);
      for (const [rep, who] of [
        [r.student, 'student'],
        [r.parent, 'parent'],
      ] as const) {
        const tag = `${combo.join('/')} ${who}`;
        const sentences = pageTexts(rep).flatMap((x) => x.split(/(?<=[.!?])\s+/)).map((x) => x.trim()).filter((x) => x.length > 25);
        const dup = sentences.filter((x, i) => sentences.indexOf(x) !== i);
        expect(dup, tag).toEqual([]);
        // "Rehber öğretmen" veli sayfasında en çok bir kez (sakinlik kartı); destek kutusu "rehberlik servisi" der.
        expect(pageTexts(rep).join(' ').split('rehber öğretmen').length, tag).toBeLessThanOrEqual(2);
      }
    }
  }, 120_000);
});

describe('Çocuk kişilik profili: yayın', () => {
  it('pilot olarak yayında: listelerde, site haritasında ve İlkokul 3–4 grubunda; adında "tanı" yok; yol haritası var', () => {
    expect(d.status).toBe('pilot');
    expect([d.minGrade, d.maxGrade]).toEqual([3, 5]);
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(ROADMAPS[SLUG].wellbeing).toEqual({ scale: 'emotional_stability', group: 'low', link: null });
    expect(AGE_GROUPS.find((g) => g.key === 'ilkokul')!.starters.map((s) => s.slug)).toContain(SLUG);
  });

  it('kaynaklar: künyeler DOI ya da IPIP bağlantılı ve metinde anılıyor', () => {
    const cites = d.science.citations;
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/') || c.url?.startsWith('https://ipip.ori.org/'))).toBe(true);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['Goldberg, 1992', 'Goldberg ve ark., 2006', 'Soto ve ark., 2008', 'Vicentini, Raccanello ve Burro, 2025']) expect(body, a).toContain(a);
  });
});
