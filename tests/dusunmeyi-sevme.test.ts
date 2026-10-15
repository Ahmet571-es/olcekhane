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
import { likertQuality, scoreLikert } from '@/lib/scoring/likert';
import { Z90 } from '@/lib/scoring/stats';
import sitemap from '../src/app/sitemap';
import { def } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'dusunmeyi-sevme-olcegi';
const OB = 'ogrenme-ve-basari-ozellikleri';
const d = def<LikertInstrument>(SLUG);
const ob = def<LikertInstrument>(OB);

/** IPIP'in tek yapılı ölçekler sayfası (https://ipip.ori.org/newSingleConstructsKey.htm), Need for Cognition, sayfadaki sırayla. */
const PLUS = [
  'Like to solve complex problems.',
  'Need things explained only once.',
  'Can handle a lot of information.',
  'Love to think up new ways of doing things.',
  'Am quick to understand things.',
  'Love to read challenging material.',
];
const MINUS = [
  'Have difficulty understanding abstract ideas.',
  'Try to avoid complex people.',
  'Avoid difficult reading material.',
  'Avoid philosophical discussions.',
];

/** Her maddeye, puanı (ters maddeler çevrilerek) `score(i)` olacak cevap. */
function answersFor(score: (i: number) => number, omit: string[] = []) {
  return Object.fromEntries(
    d.items.filter((it) => !omit.includes(it.key)).map((it, i) => [it.key, { value: it.reverse ? 6 - score(i) : score(i), rtMs: 2600 }]),
  );
}
const body = (score: (i: number) => number, grade = 10) => ({ grade, data: { engine: 'likert' as const, answers: answersFor(score) } });
const LEVEL = { low: 1, average: 3, high: 5 } as const;

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

describe('Düşünmeyi Sevme Ölçeği tanımı', () => {
  it('10 madde, tek ölçek; kaynaktaki metin ve yönle; anahtar sayfadaki sıra', () => {
    expect(d.items).toHaveLength(10);
    expect(d.scales.map((s) => s.key)).toEqual(['need_for_cognition']);
    expect(d.scales[0].name).toBe('Düşünmeyi sevme');
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain, d.profile, d.estimatedMinutes]).toEqual([
      'active',
      'public_domain',
      9,
      13,
      true,
      'personality',
      undefined,
      2,
    ]);
    const page = [...PLUS, ...MINUS];
    for (const it of d.items) {
      const k = Number(it.key.slice(1));
      expect(it.source, it.key).toBe(page[k - 1]);
      expect(!!it.reverse, it.key).toBe(k > PLUS.length);
      expect(it.text, it.key).toMatch(/^[^a-zçğıöşü].*[.]$/);
    }
    expect(d.items.map((i) => i.source).sort()).toEqual([...page].sort());
    expect(d.oppositePairs).toBeUndefined();
    expect(d.scoring).toEqual({ method: 'mean', minAnsweredRatio: 0.75 });
  });

  it('çeviriler ve uygulama sırası Öğrenme ve Başarı Özellikleri’ndeki “Düşünmekten hoşlanma” ile aynı; düzey eşikleri de', () => {
    const own = ob.items.filter((i) => i.scale === 'need_for_cognition');
    expect(own.map((i) => i.key.replace('ncog', 'n'))).toEqual(d.items.map((i) => i.key));
    expect(own.map((i) => [i.text, i.source, !!i.reverse])).toEqual(d.items.map((i) => [i.text, i.source, !!i.reverse]));
    expect(d.anchoredBands).toEqual(ob.anchoredBands);
    // Aynı on cevap iki testte aynı düzeyi verir (toplam 10–50, her toplam).
    for (let sum = 10; sum <= 50; sum++) {
      const score = (i: number) => Math.floor(sum / 10) + (i < sum % 10 ? 1 : 0);
      const mine = scoreLikert(d, answersFor(score))[0];
      const theirs = scoreLikert(ob, Object.fromEntries(own.map((it, i) => [it.key, { value: it.reverse ? 6 - score(i) : score(i), rtMs: 2600 }]))).find(
        (s) => s.scaleKey === 'need_for_cognition',
      )!;
      expect(mine.band, String(sum)).toBe(theirs.band);
      expect(mine.mean, String(sum)).toBeCloseTo(sum / 10, 6);
    }
  });

  it('güvenirlik .84 ve standart sapma 0,70 (açık veriden); ölçüm payı bunlarla hesaplanır', () => {
    expect([d.scales[0].alpha, d.scales[0].sdRef]).toEqual([0.84, 0.7]);
    const s = scoreLikert(
      d,
      answersFor(() => 3),
    )[0];
    const half = Z90 * 0.7 * Math.sqrt(1 - 0.84);
    expect(s.ciLow).toBeCloseTo(3 - half, 2);
    expect(s.ciHigh).toBeCloseTo(3 + half, 2);
    expect(half).toBeGreaterThan(0.45);
    expect(half).toBeLessThan(0.47);
  });

  it('düzeyler: ortalama 2,5 ve altı düşük, 2,6–3,3 orta, 3,4 ve üstü yüksek; iki madde boşken de hesaplanır, üçü boşken hesaplanmaz', () => {
    const band = (answers: ReturnType<typeof answersFor>) => {
      const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers } });
      return (r.student.chart?.type === 'rulers' ? r.student.chart.rows : [])[0].band;
    };
    for (let sum = 10; sum <= 50; sum++) {
      const m = sum / 10;
      const expected = m <= 2.5 ? 'Düşük' : m >= 3.4 ? 'Yüksek' : 'Orta';
      expect(band(answersFor((i) => Math.floor(sum / 10) + (i < sum % 10 ? 1 : 0))), String(sum)).toBe(expected);
    }
    expect(band(answersFor(() => 5, ['n01', 'n02']))).toBe('Yüksek');
    expect(() => evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers: answersFor(() => 5, ['n01', 'n02', 'n03']) } })).toThrow(/çoğunu cevaplamak/);
  });

  it('cevap kalitesi: çok hızlı cevap ve eksik madde denetlenir; 10 maddede "hep aynı seçenek" ve karşılıklı çift denetimi yok', () => {
    const fast = Object.fromEntries(d.items.map((it) => [it.key, { value: 3, rtMs: 300 }]));
    expect(likertQuality(d, fast).notes.join(' ')).toContain('çok hızlı');
    const same = Object.fromEntries(d.items.map((it) => [it.key, { value: 4, rtMs: 2600 }]));
    expect(likertQuality(d, same).notes).toEqual([]);
    expect(
      likertQuality(
        d,
        answersFor(() => 4, ['n10']),
      ).notes.join(' '),
    ).toContain('cevaplanmamış');
  });

  it('bilim kartı ve tanıtım: kaynak, çeviri, güvenirlik, yaş, sınırlar ve aynı maddelerin öteki testte olduğu açıkça yazılı', () => {
    expect(d.intro.paragraphs.join(' ')).toContain('10 kısa cümle');
    expect(d.intro.paragraphs.join(' ')).toContain('Yaklaşık 2 dakika');
    expect(d.description).toContain('Öğrenme ve Başarı Özellikleri');
    expect(d.description).toContain('zekâ testi değildir');
    expect(d.description).toContain('tanı koymaz');
    expect(d.science.basedOn).toContain('10 maddenin hepsi');
    expect(d.science.whatItMeasures).toContain('r = .20');
    expect(d.science.whatItMeasures).toContain('r = .19');
    expect(d.science.whatItMeasures).toContain('r = .24');
    expect(d.description).toContain('aynı cevaplar iki testte aynı düzeyi verir');
    expect(d.science.reliability).toContain('.84');
    expect(d.science.reliability).toContain('570 yetişkin');
    expect(d.science.reliability).toContain('0,70');
    expect(d.science.turkishVersion).toContain('Türkçe uyarlamasına ulaşılamadı');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.limitations.join(' ')).toContain('zekâyı ölçmez');
    expect(d.science.limitations.join(' ')).toContain('iki kez');
    const urls = d.science.citations.map((c) => c.url);
    for (const u of [
      'https://doi.org/10.1037/0022-3514.42.1.116',
      'https://ipip.ori.org/newSingleConstructsKey.htm',
      'https://doi.org/10.1016/j.jrp.2005.08.007',
      'https://doi.org/10.7910/DVN/UF52WY',
      'https://ipip.ori.org/ESCS_TechnicalReport_January2016.pdf',
      'https://doi.org/10.3102/00346543231160474',
      'https://doi.org/10.3390/jintelligence13110142',
      'https://doi.org/10.3390/jintelligence12100103',
      'https://doi.org/10.1111/cdev.14262',
    ]) {
      expect(urls, u).toContain(u);
    }
    // Kaynaklardaki her çalışma (yazar ve yıl) kartta anılır; kartta anılan her çalışma kaynaklardadır.
    const card = JSON.stringify({ ...d.science, citations: [] }) + d.description;
    const cited = d.science.citations.flatMap((c) => {
      const m = /^([^,]+), .*?\((\d{4})\)/.exec(c.text);
      return m ? [{ name: m[1], year: m[2] }] : [];
    });
    expect(cited).toHaveLength(d.science.citations.length - 1);
    for (const c of cited) expect(card, `${c.name} ${c.year}`).toMatch(new RegExp(`${c.name}(,| ve)[^()]*?${c.year}`));
    const mentions = [...card.matchAll(/(\p{Lu}[\p{L}-]+)(?: ve (?:ark\.|\p{Lu}[\p{L}-]+)|, [^()]*?)?, (\d{4})\)/gu)];
    expect(mentions.length).toBeGreaterThanOrEqual(8);
    for (const m of mentions)
      expect(
        cited.some((c) => c.name === m[1] && c.year === m[2]),
        m[0],
      ).toBe(true);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
  });
});

describe('Düşünmeyi Sevme Ölçeği raporu', () => {
  it('tek cetvel, ölçüm payıyla; "Sonuç" başlığında önce sonuç kartı, sonra "Bilmekte yarar var"', () => {
    const r = evaluate(
      SLUG,
      body((i) => (i % 5) + 1),
    );
    const adult = evaluateAdult(SLUG, { ...body((i) => (i % 5) + 1), grade: ADULT_GRADE }).adult;
    const t = REPORT_TEMPLATES[SLUG];
    for (const rep of [r.student, r.parent, adult]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(
        rows.map((x) => x.label),
        rep.audience,
      ).toEqual(['Düşünmeyi sevme']);
      expect(rows[0].ciLow, rep.audience).not.toBeNull();
      expect(
        rep.items.map((x) => x.title),
        rep.audience,
      ).toEqual(['Düşünmeyi sevme', 'Bilmekte yarar var']);
      expect(rep.itemsTitle, rep.audience).toBe('Sonuç');
      const lead = t.insight!.lead[0].text;
      expect(rep.items[1].text, rep.audience).toBe(rep.audience === 'parent' ? lead.parent : rep.audience === 'adult' ? lead.adult : lead.student);
      expect(rep.support, rep.audience).toBeNull();
    }
  });

  it('her düzey tek tek (öğrenci, veli, yetişkin): kart metni ve rozet şablondaki; dil kuralları', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    const summaries = new Set<string>();
    for (const band of ['low', 'average', 'high'] as const) {
      const bt = t.scales.need_for_cognition[band]!;
      summaries.add(bt.summary);
      expect(bt.student, band).toContain('söylüyorsun');
      expect(bt.parent, band).toMatch(/^Çocuğunuz /);
      expect(bt.parent, band).toContain('belirtiyor');
      for (const x of [bt.student, bt.parent, bt.adult ?? bt.student]) {
        expect(x, band).toContain('zekâyı ölçmez');
        expect(x, band).toMatch(/[.]$/);
        expect(x, band).not.toMatch(/tembel|beceriksiz|yeteneksiz|zeki|aptal|yavaş kavra|geç kavra/i);
      }
      expect(schoolWords(bt.adult ?? bt.student), band).toEqual([]);
      if (bt.adult) expect(bt.adult, band).not.toBe(bt.student);
      expect(bt.support, band).toBeUndefined();
      const r = evaluate(
        SLUG,
        body(() => LEVEL[band]),
      );
      const adult = evaluateAdult(SLUG, { ...body(() => LEVEL[band]), grade: ADULT_GRADE }).adult;
      for (const [rep, text] of [
        [r.student, bt.student],
        [r.parent, bt.parent],
        [adult, bt.adult ?? bt.student],
      ] as const) {
        const card = rep.items.find((x) => x.title === 'Düşünmeyi sevme')!;
        expect(card.text, `${band} ${rep.audience}`).toBe(text);
        expect(card.badge, `${band} ${rep.audience}`).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
      }
    }
    expect(summaries.size).toBe(3);
    // Düşük ve orta düzeyde kavrama hakkındaki cümlelere değinilmez.
    for (const band of ['low', 'average'] as const) {
      const bt = t.scales.need_for_cognition[band]!;
      for (const x of [bt.student, bt.parent, bt.adult ?? '']) expect(x, band).not.toMatch(/kavra|anlatılması|soyut/);
    }
    // Hiçbir düzeyde hoşlanma ya da kaçınma için "soyut fikirler" denmez (o madde kavramayı sorar).
    for (const band of ['low', 'average', 'high'] as const) expect(JSON.stringify(t.scales.need_for_cognition[band]), band).not.toContain('soyut');
  });

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const band of ['low', 'average', 'high'] as const) {
      const adult = evaluateAdult(SLUG, { ...body(() => LEVEL[band]), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(rest)), band).toEqual([]);
      expect(roadmap?.approach, band).toBeNull();
      for (const x of roadmapTexts(roadmap!)) expect(x, band).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|kitap|lise)/iu);
    }
    expect(schoolWords([d.intro.title, ...d.intro.paragraphs, d.prompt ?? ''].join(' '))).toEqual([]);
  });

  it('PDF öğrenci, veli ve yetişkin için üretilir', async () => {
    const b = body((i) => (i % 5) + 1, 11);
    const r = evaluate(SLUG, b);
    const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);
});

describe('Düşünmeyi Sevme Ölçeği gelişim yol haritası', () => {
  it('tek boyutlu: profil ve ortamlar yok; haftalar; veliye tek öneri; sonraki testler', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe('nasıl çalışılabileceğine dair öneriler, veliye yaklaşım önerileri ve dört haftalık küçük adımlar');
    for (const band of ['low', 'average', 'high'] as const) {
      const r = evaluate(
        SLUG,
        body(() => LEVEL[band]),
      );
      const adult = evaluateAdult(SLUG, { ...body(() => LEVEL[band]), grade: ADULT_GRADE }).adult;
      for (const rep of [r.student, r.parent, adult]) {
        const label = `${band} ${rep.audience}`;
        const rm = rep.roadmap!;
        expect(rm.bars, label).toHaveLength(1);
        expect(rm.settings, label).toBeNull();
        expect(
          rm.weeks.map((w) => w.title),
          label,
        ).toEqual(['Fark et', 'Kafa yoran küçük bir deneme', 'Birlikte düşünmek', 'Gözden geçir']);
        expect(rm.study.items, label).toHaveLength(1);
        expect(
          rm.study.links.map((l) => l.href),
          label,
        ).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
        expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 1 : 0);
        expect(rm.weeks[3].text, label).toContain('Zihniyet: Zekâ ve Öğrenme İnançları');
        expect(rm.weeks[3].text, label).not.toContain('Öğrenme ve Başarı');
        for (const x of roadmapTexts(rm)) {
          expect(x, label).not.toMatch(/undefined|null|\s{2}/);
          if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
          expect(x, label).not.toMatch(/beyni çalıştır|zekânı artır|puanını yükselt/i);
        }
      }
    }
    expect(ROADMAPS[SLUG].sources.map((s) => s.url)).toEqual([
      'https://doi.org/10.1177/1529100612453266',
      'https://doi.org/10.3389/fpsyg.2021.797395',
      'https://doi.org/10.3390/jintelligence12100103',
      'https://doi.org/10.3390/jintelligence12100099',
    ]);
  });

  it('yol haritası ve veliye yaklaşım raporun kendi cümlelerini tekrar etmez', () => {
    const t = ROADMAPS[SLUG];
    const tpl = REPORT_TEMPLATES[SLUG];
    const report = Object.values(tpl.scales.need_for_cognition)
      .flatMap((b) => [b!.student, b!.parent, b!.adult ?? ''])
      .concat(Object.values(tpl.insight!.lead[0].text))
      .join(' ');
    const sc = t.scales.need_for_cognition;
    for (const g of ['low', 'average', 'high'] as const) {
      const own = [
        sc.study[g].student,
        sc.study[g].parent,
        sc.study[g].adult ?? '',
        sc.action[g].student,
        sc.action[g].parent,
        t.approach!.need_for_cognition[g],
      ];
      for (const text of own) {
        for (const sentence of text.split(/(?<=[.;:])\s+/)) {
          if (sentence.length < 25) continue;
          expect(report, `${g}: ${sentence}`).not.toContain(sentence.replace(/[.;:]$/, ''));
        }
      }
    }
  });
});

describe('Düşünmeyi Sevme Ölçeği yayında', () => {
  it('listelerde ve site haritasında; Öğrenme ve Başarı Özellikleri’nin hemen ardından', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    const order = publicInstruments().map((i) => i.slug);
    expect(order.indexOf(SLUG)).toBe(order.indexOf(OB) + 1);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır; yetişkin olarak da sınanır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /NFC_GOVDE=.*?for i in range\((\d+), (\d+)\)/.exec(yml);
    expect(m).not.toBeNull();
    const keys = Array.from({ length: Number(m![2]) - Number(m![1]) }, (_, i) => `n${String(i + Number(m![1])).padStart(2, '0')}`);
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
    expect(yml).toContain('/api/rapor/dusunmeyi-sevme-olcegi');
    expect(yml).toContain('NFC_YETISKIN');
  });
});
