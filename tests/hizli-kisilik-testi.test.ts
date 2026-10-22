import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { besFaktorReport } from '@/content/reports/bes-faktor';
import { ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { besFaktorRoadmap } from '@/content/roadmaps/bes-faktor';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { BandGroup } from '@/content/roadmaps/types';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { Roadmap } from '@/lib/reports/roadmap';
import { likertQuality, scoreLikert } from '@/lib/scoring/likert';
import { Z90 } from '@/lib/scoring/stats';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'hizli-kisilik-testi';
const d = def<LikertInstrument>(SLUG);
const SCALES = ['extraversion', 'agreeableness', 'conscientiousness', 'emotional_stability', 'intellect'];
const NAMES = ['Dışadönüklük', 'Uyumluluk', 'Sorumluluk', 'Duygusal Denge', 'Merak ve Hayal Gücü'];

/**
 * IPIP'in Mini-IPIP anahtar sayfası (https://ipip.ori.org/MiniIPIPKey.htm): her boyutta artı ve eksi yönlü maddeler ve
 * sayfadaki iç tutarlılık. Nevrotiklik sayfada artı yönlü "Have frequent mood swings" ve "Get upset easily" ile verilir;
 * bu testte boyut Duygusal Denge olarak ters yönde puanlanır.
 */
const KEY: Record<string, { plus: string[]; minus: string[]; alpha: number }> = {
  extraversion: {
    plus: ['Am the life of the party.', 'Talk to a lot of different people at parties.'],
    minus: ["Don't talk a lot.", 'Keep in the background.'],
    alpha: 0.77,
  },
  agreeableness: {
    plus: ["Sympathize with others' feelings.", "Feel others' emotions."],
    minus: ['Am not really interested in others.', "Am not interested in other people's problems."],
    alpha: 0.7,
  },
  conscientiousness: {
    plus: ['Get chores done right away.', 'Like order.'],
    minus: ['Often forget to put things back in their proper place.', 'Make a mess of things.'],
    alpha: 0.69,
  },
  neuroticism: {
    plus: ['Have frequent mood swings.', 'Get upset easily.'],
    minus: ['Am relaxed most of the time.', 'Seldom feel blue.'],
    alpha: 0.68,
  },
  intellect: {
    plus: ['Have a vivid imagination.'],
    minus: ['Have difficulty understanding abstract ideas.', 'Am not interested in abstract ideas.', 'Do not have a good imagination.'],
    alpha: 0.65,
  },
};

/** Kaynaktaki uygulama sırası (madde 1–20; Martínez-Molina ve Arias, 2018, Ek B). */
const ORDER = [
  'Am the life of the party.',
  "Sympathize with others' feelings.",
  'Get chores done right away.',
  'Have frequent mood swings.',
  'Have a vivid imagination.',
  "Don't talk a lot.",
  "Am not interested in other people's problems.",
  'Often forget to put things back in their proper place.',
  'Am relaxed most of the time.',
  'Am not interested in abstract ideas.',
  'Talk to a lot of different people at parties.',
  "Feel others' emotions.",
  'Like order.',
  'Get upset easily.',
  'Have difficulty understanding abstract ideas.',
  'Keep in the background.',
  'Am not really interested in others.',
  'Make a mess of things.',
  'Seldom feel blue.',
  'Do not have a good imagination.',
];

/**
 * Martínez-Molina ve Arias'ın (2018) açık verisi, ABD örneklemi (367 kişi): dört maddenin ortalamasının standart sapması.
 * Değerler veriden test dışında hesaplandı (0,9470; 0,6996; 0,7979; 0,9152; 0,7726) ve iki ondalığa yuvarlandı; buradaki
 * denetim, tanımdaki sayıların bu hesapla aynı kaldığını gösterir.
 */
const SD_US: Record<string, number> = { extraversion: 0.95, agreeableness: 0.7, conscientiousness: 0.8, emotional_stability: 0.92, intellect: 0.77 };

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

describe('Hızlı Kişilik Testi tanımı', () => {
  it('20 madde; beş boyut, her biri dört madde; anahtarlar m01–m20', () => {
    expect(d.items).toHaveLength(20);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const s of SCALES)
      expect(
        d.items.filter((i) => i.scale === s),
        s,
      ).toHaveLength(4);
    expect(d.items.map((i) => i.key)).toEqual(Array.from({ length: 20 }, (_, i) => `m${String(i + 1).padStart(2, '0')}`));
    expect(new Set(d.items.map((i) => i.text)).size).toBe(20);
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
      3,
    ]);
    expect(d.scoring).toEqual({ method: 'mean', minAnsweredRatio: 0.75 });
  });

  it('her madde kaynaktaki metni ve yönüyle; kaynaktaki 20 maddenin hepsi, kaynaktaki sırayla', () => {
    expect(d.items.map((i) => i.source)).toEqual(ORDER);
    for (const it of d.items) {
      const scale = it.scale === 'emotional_stability' ? 'neuroticism' : it.scale;
      const k = KEY[scale];
      const plus = k.plus.includes(it.source!);
      expect(plus || k.minus.includes(it.source!), it.key).toBe(true);
      // Duygusal Denge kaynaktaki Nevrotikliğin tersidir: artı yönlü maddeler ters puanlanır; öteki boyutlarda eksi yönlüler.
      expect(!!it.reverse, it.key).toBe(it.scale === 'emotional_stability' ? plus : !plus);
    }
    expect(
      Object.values(KEY)
        .flatMap((k) => [...k.plus, ...k.minus])
        .sort(),
    ).toEqual([...ORDER].sort());
    expect(d.items.filter((i) => i.reverse)).toHaveLength(11);
    // Beş boyut sırayla döner: art arda iki madde aynı boyuttan değil.
    d.items.forEach((it, i) => expect(it.scale, it.key).toBe(SCALES[i % 5]));
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri: 17 madde Beş Faktör, üçü 9. sınıftan başlayan testler', () => {
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    const bf = def<LikertInstrument>('bes-faktor-kisilik');
    const later = ['ayrintili-kisilik-profili', 'kisiligin-10-yonu', 'alti-boyutlu-kisilik-profili'].map((s) => def<LikertInstrument>(s));
    let sameAsBf = 0;
    for (const it of d.items) {
      const b = bf.items.find((x) => norm(x.source) === norm(it.source));
      expect(b, it.key).toBeDefined();
      if (b!.text === it.text) {
        sameAsBf++;
        continue;
      }
      // Beş Faktör'den ayrılan madde 9. sınıftan başlayan testlerden birinde birebir aynı çevrilmiştir.
      expect(
        later.some((o) => o.items.some((x) => norm(x.source) === norm(it.source) && x.text === it.text)),
        it.source,
      ).toBe(true);
    }
    expect(sameAsBf).toBe(17);
    expect(d.items.find((i) => i.source === 'Have a vivid imagination.')?.text).toBe('Canlı bir hayal gücüm vardır.');
    expect(d.items.find((i) => i.source === 'Get upset easily.')?.text).toBe('Küçük şeylere kolayca bozulurum.');
    expect(d.items.find((i) => i.source === 'Have difficulty understanding abstract ideas.')?.text).toBe('Soyut fikirleri anlamakta zorlanırım.');
  });

  it('güvenirlik IPIP sayfasından, standart sapmalar açık veriden; ölçüm payı bu değerlerle hesaplanır', () => {
    for (const s of d.scales) {
      const key = s.key === 'emotional_stability' ? 'neuroticism' : s.key;
      expect(s.alpha, s.key).toBe(KEY[key].alpha);
      expect(s.sdRef, s.key).toBe(SD_US[s.key]);
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
      // Dört cümlelik ölçekte ölçüm payı geniştir: ±0,6 ile ±0,9 arası.
      expect(half, s.key).toBeGreaterThan(0.6);
      expect(half, s.key).toBeLessThan(0.9);
    }
  });

  it('düzeyler: orta yalnızca toplam 11–13 (ortalama 2,75–3,25); iki yanı simetrik, bir madde boşken de', () => {
    const LABEL = { low: 'Düşük', average: 'Orta', high: 'Yüksek' } as const;
    const t = REPORT_TEMPLATES[SLUG];
    const shown = (scale: string, scores: number[]) => {
      const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers: scaleAnswers(scale, scores) } });
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      return rows.find((x) => x.label === d.scales.find((s) => s.key === scale)!.name)!;
    };
    for (const scale of SCALES) {
      // Dört madde: toplam 4–20; her toplam için puanlar olabildiğince eşit dağıtılır.
      for (let sum = 4; sum <= 20; sum++) {
        const scores = [0, 1, 2, 3].map((k) => Math.floor(sum / 4) + (k < sum % 4 ? 1 : 0));
        const row = shown(scale, scores);
        const expected = sum <= 10 ? 'low' : sum >= 14 ? 'high' : 'average';
        expect(row.band, `${scale} ${sum}`).toBe(LABEL[expected]);
        expect(row.band, `${scale} ${sum}`).toBe(t.bandLabels[expected]);
      }
      // Üç madde (biri boş): toplam 3–15; orta 8–10 (2,67–3,33).
      for (let sum = 3; sum <= 15; sum++) {
        const scores = [0, 1, 2].map((k) => Math.floor(sum / 3) + (k < sum % 3 ? 1 : 0));
        const row = shown(scale, scores);
        const expected = sum <= 7 ? 'low' : sum >= 11 ? 'high' : 'average';
        expect(row.band, `${scale} 3 madde ${sum}`).toBe(LABEL[expected]);
      }
      // İki madde boşsa boyut hesaplanmaz.
      expect(shown(scale, [5, 5]).band, scale).toBe('Hesaplanamadı');
    }
  }, 60_000);

  it('birbirinin tersini söyleyen beş çift: aynı boyutta, biri düz biri ters; çoğuna aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(5);
    const scales = new Set<string>();
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.scale, x).toBe(b.scale);
      expect(!!a.reverse, x).not.toBe(!!b.reverse);
      scales.add(a.scale);
    }
    // Sorumlulukta birbirinin tam tersi olan çift yok; dışadönüklükte iki çift.
    expect([...scales].sort()).toEqual(['agreeableness', 'emotional_stability', 'extraversion', 'intellect']);
    const keys = d.oppositePairs!.flat();
    const answers = Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 5 : (i % 5) + 1, rtMs: 2600 }]));
    const q = likertQuality(d, answers);
    expect(q.oppositeAgree).toBe(5);
    expect(q.notes.some((n) => n.includes('Birbirinin tersini söyleyen 5 cümle çiftinden 5 tanesinde'))).toBe(true);
    // Uyarı için çiftlerin en az yarısı (üç çift) gerekir: iki çiftte uyarı yok, üç çiftte var.
    const pairsWith = (n: number, v: number) =>
      Object.fromEntries(d.items.map((it) => [it.key, { value: keys.slice(0, 2 * n).includes(it.key) ? v : 3, rtMs: 2600 }]));
    expect(likertQuality(d, pairsWith(2, 5)).oppositeAgree).toBe(2);
    expect(likertQuality(d, pairsWith(2, 5)).notes.some((n) => n.includes('Birbirinin tersini'))).toBe(false);
    expect(likertQuality(d, pairsWith(3, 4)).oppositeAgree).toBe(3);
    expect(likertQuality(d, pairsWith(3, 4)).notes.some((n) => n.includes('5 cümle çiftinden 3 tanesinde'))).toBe(true);
    // Öteki yönde: iki cümleye de "Hiç doğru değil" ya da "Pek doğru değil".
    const no = likertQuality(d, pairsWith(3, 2));
    expect(no.oppositeDisagree).toBe(3);
    expect(no.notes.some((n) => n.includes('çoğuna “hayır” deme'))).toBe(true);
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(
        d,
        keyedAnswers(() => level),
      );
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
  });

  it('bilim kartı ve tanıtım: kaynak, çeviri, güvenirlik, yaş ve sınırlar açıkça yazılı', () => {
    expect(d.intro.paragraphs.join(' ')).toContain('20 kısa cümle');
    expect(d.intro.paragraphs.join(' ')).toContain('Yaklaşık 3 dakika');
    expect(d.description).toContain('20 kısa cümle');
    expect(d.description).toContain('zekâ testi değildir');
    expect(d.description).toContain('tanı koymaz');
    expect(d.science.basedOn).toContain('20 maddenin hepsi');
    expect(d.science.turkishVersion).toContain('17 madde');
    expect(d.science.turkishVersion).toContain('Türkçe uyarlamasına ulaşılamadı');
    expect(d.science.turkishVersion).toContain('Nevrotiklik');
    expect(d.science.reliability).toContain('.65');
    expect(d.science.reliability).toContain('.77');
    expect(d.science.reliability).toContain('.60 ya da üzerinde');
    expect(d.science.reliability).toContain('15.701');
    expect(d.science.reliability).toContain('367 yetişkin');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.ageNote).toContain('lise çağındaki gençlerde güvenirliğini ve geçerliğini inceleyen yayımlanmış bir çalışmaya ulaşılamadı');
    expect(d.science.limitations.join(' ')).toContain('zekâyı ölçmez');
    expect(d.science.limitations.join(' ')).toContain('dört cümleyle');
    expect(d.science.normStatus).toBe('none');
    const urls = d.science.citations.map((c) => c.url);
    for (const u of [
      'https://doi.org/10.1037/1040-3590.18.2.192',
      'https://ipip.ori.org/MiniIPIPKey.htm',
      'https://doi.org/10.1037/1040-3590.4.1.26',
      'https://doi.org/10.1080/00223891.2012.700466',
      'https://doi.org/10.7717/peerj.5542',
      'https://doi.org/10.1016/j.jrp.2005.08.007',
    ]) {
      expect(urls, u).toContain(u);
    }
    // Bilim kartında anılan her çalışma kaynaklarda yer alır; kaynaklardaki her çalışma kartta anılır.
    const card = JSON.stringify({ ...d.science, citations: [] }) + d.description;
    for (const a of [
      'Donnellan ve ark., 2006',
      'Goldberg, 1992',
      'Baldasaro ve ark., 2013',
      'Martínez-Molina ve Arias, 2018',
      'Donnellan, Oswald, Baird ve Lucas, 2006',
      'Goldberg ve ark., 2006',
    ]) {
      expect(card, a).toContain(a);
    }
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
  });
});

describe('Hızlı Kişilik Testi raporu', () => {
  it('genel bakışta beş boyut, ölçüm payıyla; beş boyut kartı; genel açıklama kısa ölçeği söyler', () => {
    const r = evaluate(
      SLUG,
      likertBody(SLUG, 10, (i) => i % 5),
    );
    const adult = evaluateAdult(SLUG, { ...likertBody(SLUG, 10, (i) => i % 5), grade: ADULT_GRADE }).adult;
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
      expect(rep.itemsTitle, rep.audience).toBe('Boyutlar');
      const overview = rep.audience === 'parent' ? t.overview!.parent : t.overview!.student;
      const band = rep.audience === 'parent' ? 'Sarı bant ölçümün doğal payını gösterir.' : 'Sarı bant ölçümün doğal payı.';
      expect(rep.chartNote, rep.audience).toBe(`${overview} ${band}`);
      expect(rep.chartNote, rep.audience).toContain('dört cümleyle');
    }
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
    expect(r.student.items[0].text).not.toContain('Çocuğunuz');
  });

  it('her boyutun düşük, orta ve yüksek düzey metni yazılmış; dil ve destek kutusu kuralları', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t.evaluative).toBeUndefined();
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    for (const s of d.scales) {
      const summaries = new Set<string>();
      for (const band of ['low', 'average', 'high'] as const) {
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
          /tembel|disiplinsiz|beceriksiz|yeteneksiz|bozukluk|hastalık|dikkat eksikliği|zeki|aptal|depresyon|kaygı bozukluğu|içe dönük/i,
        );
        expect(bt!.student, label).toMatch(/[.]$/);
        expect(bt!.parent, label).toMatch(/[.]$/);
        // Öğrenci metinleri okula ya da ergenliğe özgü değil: yetişkine de aynı metin gider.
        expect(bt!.adult, label).toBeUndefined();
        expect(schoolWords(bt!.student), label).toEqual([]);
        expect(bt!.tipsStudent, label).toEqual([]);
        expect(bt!.tipsParent, label).toEqual([]);
        // Destek kutusu yalnızca Duygusal Denge düşükken.
        expect(!!bt!.support, label).toBe(band === 'low' && s.key === 'emotional_stability');
      }
      expect(summaries.size, s.key).toBe(3);
    }
    for (const band of ['low', 'average', 'high'] as const) {
      expect(t.scales.intellect[band]!.student, band).toContain('zekâyı ölçmez');
      expect(t.scales.intellect[band]!.parent, band).toContain('zekâyı ölçmez');
    }
    expect(t.scales.emotional_stability.low!.parent).toContain('bir tanı değildir');
  });

  it('her boyutun her düzeyi tek tek: kart metni ve rozet şablondaki metin; destek kutusu doğru (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;
    let n = 0;
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const b = body((x) => (x === s.key ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        const bt = t.scales[s.key][band]!;
        for (const [rep, text] of [
          [r.student, bt.student],
          [r.parent, bt.parent],
          [adult, bt.student],
        ] as const) {
          const label = `${s.key}/${band}/${rep.audience}`;
          const item = rep.items.find((x) => x.title === s.name)!;
          expect(item.text, label).toBe(text);
          expect(item.badge, label).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
          expect(rep.support !== null, label).toBe(band === 'low' && s.key === 'emotional_stability');
          if (rep.support)
            expect(rep.support.title, label).toBe(
              rep.audience === 'parent' ? 'Destek almak isterseniz' : rep.audience === 'adult' ? 'Destek almak istersen' : 'Konuşmak istersen',
            );
          n++;
        }
      }
    }
    expect(n).toBe(5 * 3 * 3);
  }, 60_000);

  it('uç ve orta cevaplar: bütün boyutlar aynı düzeyde; hep aynı seçenek uyarı verir', () => {
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
  });

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const level of ['high', 'low', 'mid'] as const) {
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(rest)), level).toEqual([]);
      expect(roadmap?.approach, level).toBeNull();
      // Yol haritasının yetişkin metinleri Beş Faktör'ündür: "önemli bir sınav ya da sunum" yetişkin için de doğrudur
      // (tests/roadmap.test.ts ile aynı denetim).
      for (const x of roadmapTexts(roadmap!)) expect(x, level).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|kitap)/iu);
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

describe('Hızlı Kişilik Testi gelişim yol haritası', () => {
  it('Beş Faktör yol haritasının metinleri; yalnızca maddelerin sormadığını söyleyen ya da kartla çelişen metinler değişti', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    const t = ROADMAPS[SLUG];
    const bf = besFaktorRoadmap;
    expect(Object.keys(t.scales)).toEqual(SCALES);
    expect(t.scales.extraversion).toBe(bf.scales.extraversion);
    for (const k of ['studyIntro', 'settingsNote', 'firstWeek', 'lastWeek', 'nextTests', 'sources', 'wellbeing', 'planningScale'] as const) {
      expect(t[k], k).toBe(bf[k]);
    }
    // Değişen metinler (boyut, bölüm, düzey); geri kalan her şey Beş Faktör'ündür.
    const CHANGED = [
      'agreeableness study high',
      'agreeableness study low',
      'agreeableness action low',
      'agreeableness settings low',
      'emotional_stability study low',
      'emotional_stability study high',
      'emotional_stability settings high',
      'intellect study low',
    ];
    const changed: string[] = [];
    for (const k of SCALES) {
      for (const part of ['study', 'action', 'settings'] as const) {
        for (const g of ['low', 'average', 'high'] as const) {
          const mine = t.scales[k][part]?.[g];
          const theirs = bf.scales[k][part]?.[g];
          const label = `${k} ${part} ${g}`;
          if (!CHANGED.includes(label)) {
            expect(mine, label).toBe(theirs);
            continue;
          }
          expect(mine, label).not.toEqual(theirs);
          const texts = typeof mine === 'string' ? [mine] : [mine!.student, mine!.parent, mine!.adult ?? mine!.student];
          for (const x of texts) {
            expect(x, label).not.toMatch(
              /eleştirel|sorgula|[Bb]askı altında|hızlı karar|Çoğu zaman sakinsin|çoğu zaman sakin;|İş birliği|iş birliği|İlgini çeken|ilgisini çeken|Somut ve işe yarar|yoğun yaşa|[Yy]oğun ve değişken/,
            );
            changed.push(x);
          }
        }
      }
    }
    expect(changed).toHaveLength(3 * 6 + 2);
    // Yalnızca ilk sözü değişenler: metnin kalanı Beş Faktör'ündür.
    const ES = t.scales.emotional_stability.study.low;
    const bfES = bf.scales.emotional_stability.study.low;
    expect(ES.student).toBe(bfES.student.replace('Duygularını yoğun yaşaman', 'Duygularının inip çıkması'));
    expect(ES.parent).toBe(bfES.parent.replace('Çocuğunuz duyguları yoğun yaşıyor olabilir;', 'Çocuğunuz duygularının inip çıkabildiğini belirtiyor;'));
    expect(t.scales.intellect.study.low.student).toBe(
      bf.scales.intellect.study.low.student.replace('Somut ve işe yarar konular ilgini daha çok çekiyor. ', ''),
    );
    // Sorumluluk ve Duygusal Denge orta düzeyinde bu test için yazılan, maddelerin sormadığı bir şey söylemeyen metinler
    // ("Bazı işlere başlamak sana ötekilerden daha zor gelebilir") artık Beş Faktör'ün kendi metinleridir.
    expect(t.scales.conscientiousness).toBe(bf.scales.conscientiousness);
    for (const g of ['conscientiousness', 'emotional_stability'] as const) {
      const avg = t.scales[g].study.average;
      for (const x of [avg.student, avg.parent, avg.adult!]) expect(x, g).not.toMatch(/İlgini çeken|ilgisini çeken|[Çç]oğu zaman sakin/);
    }
    expect(t.scales.conscientiousness.study.average.student.startsWith('Bazı işlere başlamak sana ötekilerden daha zor gelebilir.')).toBe(true);
    // Veliye yaklaşım: Beş Faktör raporundaki veli önerilerinin ilki; maddelerle uyuşmayan ya da yol haritasında tekrar
    // eden beşi değişti (Merak ve Hayal Gücü düşükte Beş Faktör'ün ikinci önerisi).
    const own: Record<string, BandGroup[]> = { extraversion: ['average'], agreeableness: ['high', 'average'], conscientiousness: ['low'], intellect: ['low'] };
    for (const k of SCALES) {
      for (const g of ['low', 'average', 'high'] as const) {
        const tip = t.approach![k][g];
        if (own[k]?.includes(g)) expect(tip, `${k} ${g}`).not.toBe(besFaktorReport.scales[k][g]!.tipsParent[0]);
        else expect(tip, `${k} ${g}`).toBe(besFaktorReport.scales[k][g]!.tipsParent[0]);
        expect(tip, `${k} ${g}`).not.toMatch(/görüşünü savun|tartış|bu dengeyi|herkesin görebileceği/);
      }
    }
    expect(t.approach!.intellect.low).toBe(besFaktorReport.scales.intellect.low!.tipsParent[1]);
    expect(roadmapSummary(SLUG)).toBe(roadmapSummary('bes-faktor-kisilik'));
  });

  it('her boyutun her düzeyi: beş sütun, beş öneri kartı, haftalar ve iyi oluş haftası tutarlı (öğrenci, veli, yetişkin)', () => {
    const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;
    let n = 0;
    for (const key of SCALES) {
      for (const band of ['low', 'average', 'high'] as const) {
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
          // Beş boyutun hepsi için öneri kartı, profildeki sırayla (çok boyutlu testlerdeki gibi seçme yok).
          expect(
            rm.study.items.map((x) => x.key),
            label,
          ).toEqual(SCALES);
          expect(rm.weeks[1].title, label).toBe('Çalışma düzeni');
          const wellbeing = band === 'low' && key === 'emotional_stability';
          if (wellbeing) expect(rm.weeks[2].title, label).toBe('Duygusal Denge');
          const exam = rep.audience !== 'adult' && wellbeing;
          expect(
            rm.study.links.map((l) => l.href),
            label,
          ).toEqual(['/rehber/etkili-ders-calisma-yontemleri', ...(exam ? ['/rehber/sinav-kaygisi'] : [])]);
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
      for (const g of ['low', 'average', 'high'] as const) {
        const own = [
          sc.study[g].student,
          sc.study[g].parent,
          sc.study[g].adult ?? '',
          sc.action[g].student,
          sc.action[g].parent,
          sc.action[g].adult ?? '',
          t.approach![key][g],
        ];
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

describe('Hızlı Kişilik Testi yayında', () => {
  it('listelerde ve site haritasında; Beş Faktör Kişilik Profili ile Ayrıntılı Kişilik Profili arasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    const order = publicInstruments().map((i) => i.slug);
    expect(order.indexOf(SLUG)).toBe(order.indexOf('bes-faktor-kisilik') + 1);
    expect(order.indexOf('ayrintili-kisilik-profili')).toBe(order.indexOf(SLUG) + 1);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır; yetişkin olarak da sınanır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /HK_GOVDE=.*?for i in range\((\d+), (\d+)\)/.exec(yml);
    expect(m).not.toBeNull();
    const keys = Array.from({ length: Number(m![2]) - Number(m![1]) }, (_, i) => `m${String(i + Number(m![1])).padStart(2, '0')}`);
    expect(keys).toEqual(d.items.map((i) => i.key));
    expect(yml).toContain('/api/rapor/hizli-kisilik-testi');
    expect(yml).toContain('HK_YETISKIN');
  });
});
