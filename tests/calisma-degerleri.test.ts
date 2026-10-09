import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { calismaDegerleri } from '@/content/instruments/calisma-degerleri';
import { REPORT_TEMPLATES } from '@/content/reports';
import { INTEREST_ROADMAPS, hasPublicRoadmap } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { likertItemNoun } from '@/lib/instruments/nouns';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { anchoredBand, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'calisma-degerleri';
const d = calismaDegerleri;
const SCALES = ['learning', 'income', 'helping', 'independence', 'security', 'team', 'status', 'balance'];
const NAMES = ['İlgi ve öğrenme', 'Kazanç', 'Başkalarına yardım', 'Bağımsızlık', 'Güvence', 'Birlikte çalışma', 'Saygınlık ve ilerleme', 'Yaşam dengesi'];
const tpl = REPORT_TEMPLATES[SLUG];
const vt = tpl.values!;
const rt = INTEREST_ROADMAPS[SLUG];
const round1 = (v: number) => Math.round(v * 10) / 10;
const band = (v: number) => (round1(v) >= 3.5 ? 'high' : round1(v) >= 2.5 ? 'average' : 'low');
const nameOf = (k: string) => NAMES[SCALES.indexOf(k)];

/** Değer → ortalama (dört ifadenin toplamı tam sayı). */
function bodyFor(values: Record<string, number>, grade = 9) {
  const answers: Record<string, { value: number; rtMs: number }> = {};
  for (const s of SCALES) {
    const sum = Math.round(values[s] * 4);
    d.items
      .filter((i) => i.scale === s)
      .forEach((it, j) => {
        answers[it.key] = { value: Math.floor(sum / 4) + (j < sum % 4 ? 1 : 0), rtMs: 2500 };
      });
  }
  return { grade, data: { engine: 'likert' as const, answers } };
}

/** Raporun beklenen en önemli ve daha az önemli değerleri (build.ts'teki kuralın bağımsız yazımı). */
function expected(values: Record<string, number>) {
  const order = [...SCALES].sort((a, b) => values[b] - values[a]);
  const v = order.map((k) => values[k]);
  const notLow = order.filter((k) => band(values[k]) !== 'low');
  let top: string[] = [];
  if (v[0] !== v.at(-1)) {
    for (const cut of [v[2], v[1], v[0]]) {
      top = notLow.filter((k) => values[k] >= cut);
      if (top.length <= 4) break;
    }
    if (top.length > 4) top = [];
  }
  let bottom: string[] = [];
  if (top.length) {
    const rest = order.filter((k) => !top.includes(k));
    bottom = rest.filter((k) => values[k] <= v[v.length - 2]);
    if (bottom.length > 3) bottom = rest.filter((k) => values[k] === v.at(-1));
    if (bottom.length > 3) bottom = [];
    bottom = bottom.filter((k) => values[k] <= v[0] - 1);
  }
  // Eşit puanlılar aynı sıra numarasını alır.
  const ranks = top.map((k) => 1 + top.filter((x) => values[x] > values[k]).length);
  return { order, top, bottom, ranks };
}

function strings(x: unknown): string[] {
  if (typeof x === 'string') return [x];
  if (Array.isArray(x)) return x.flatMap(strings);
  if (x && typeof x === 'object') return Object.values(x).flatMap(strings);
  return [];
}

/** Basit sözde rastgele sayı üreteci (tekrarlanabilir). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

describe('Çalışma Değerleri: ifadeler', () => {
  it('32 özgün ifade; sekiz değer, her birinde dört; değerler sırayla döner; ters ifade yok', () => {
    expect(d.items).toHaveLength(32);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    const rotation = ['learning', 'income', 'helping', 'independence', 'security', 'team', 'status', 'balance'];
    d.items.forEach((it, i) => {
      expect(it.scale, it.key).toBe(rotation[i % 8]);
      expect(it.reverse, it.key).toBeFalsy();
      expect(it.source, it.key).toBeUndefined();
      // İfade bir işin özelliğidir: büyük harfle başlar, noktasızdır, kısadır.
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ][^.]*[^.\s]$/);
      expect(it.text.length, it.key).toBeLessThanOrEqual(70);
    });
    for (const s of SCALES) expect(d.items.filter((i) => i.scale === s), s).toHaveLength(4);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(32);
    expect(d.oppositePairs ?? []).toEqual([]);
    expect(likertItemNoun(d)).toBe('ifade');
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
  });

  it('yetişkinlere de açık: yönerge, soru ve ifadeler okula özgü değil; 7. sınıftan itibaren', () => {
    expect(d.adults).toBe(true);
    expect([d.minGrade, d.maxGrade]).toEqual([7, 13]);
    for (const x of [d.intro.title, ...d.intro.paragraphs, d.prompt, ...d.items.map((i) => i.text), ...d.options.map((o) => o.label)]) {
      expect(schoolWords(x), x).toEqual([]);
    }
    expect(d.intro.paragraphs[0]).toContain(`${d.items.length} şey`);
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
  });
});

describe('Çalışma Değerleri: puanlama ve sıralama', () => {
  it('düzeyler bir ondalıklı ortalamaya göre; önem derecesi doğrudan puandır', () => {
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('low');
    expect(anchoredBand(2.5, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.5, d.anchoredBands)).toBe('high');
    const values = { learning: 5, income: 2.25, helping: 3, independence: 4.5, security: 1, team: 3.75, status: 2, balance: 4 };
    const scores = scoreLikert(d, bodyFor(values).data.answers);
    expect(scores.map((s) => [s.scaleKey, s.value])).toEqual(SCALES.map((k) => [k, values[k as keyof typeof values]]));
  });

  it('en önemli değerler: üçüncü en yüksek puana kadar; eşitlikte en çok dört; düşük düzeydeki değer girmez', () => {
    const base = Object.fromEntries(SCALES.map((k) => [k, 2])) as Record<string, number>;
    const top = (v: Record<string, number>) => evaluate(SLUG, bodyFor(v)).student.items.filter((i) => /^\d\. /.test(i.title)).map((i) => i.title);
    // Üç değer belirgin biçimde yukarıda.
    expect(top({ ...base, learning: 5, income: 4.5, helping: 4 })).toEqual(['1. İlgi ve öğrenme', '2. Kazanç', '3. Başkalarına yardım']);
    // Üçüncü sırada eşitlik: dört değer, eşitler aynı numarayla.
    expect(top({ ...base, learning: 5, income: 4.5, helping: 4, team: 4 })).toEqual(['1. İlgi ve öğrenme', '2. Kazanç', '3. Başkalarına yardım', '3. Birlikte çalışma']);
    // Üçüncü sırada üç değer eşit: ikinci en yüksek puana kadar olanlar.
    expect(top({ ...base, learning: 5, income: 4.5, helping: 4, team: 4, status: 4 })).toEqual(['1. İlgi ve öğrenme', '2. Kazanç']);
    // İkinci sırada da dörtten çok değer: yalnızca en yüksek puandaki.
    expect(top({ ...base, learning: 5, income: 4, helping: 4, team: 4, status: 4 })).toEqual(['1. İlgi ve öğrenme']);
    // En yüksekte beş değer eşit: sıralama yapılamaz.
    expect(top({ ...base, learning: 5, income: 5, helping: 5, team: 5, status: 5 })).toEqual([]);
    // Düşük düzeydeki değer en önemliler arasına girmez.
    expect(top({ ...base, learning: 3, income: 1, helping: 1, independence: 1, security: 1, team: 1, status: 1, balance: 1 })).toEqual(['1. İlgi ve öğrenme']);
    // En yüksek puanı paylaşan değerler birlikte anılır; sıra testteki sıraya göre bozulmaz.
    const tie = evaluate(SLUG, bodyFor({ ...base, learning: 5, income: 5, helping: 4 })).student;
    expect(tie.items.slice(0, 3).map((i) => [i.title, i.badge])).toEqual([
      ['1. İlgi ve öğrenme', 'Çok önemli · eşit puan'],
      ['1. Kazanç', 'Çok önemli · eşit puan'],
      ['3. Başkalarına yardım', 'Çok önemli'],
    ]);
    expect(tie.keyFigures).toEqual([{ label: 'En önem verdiğin değerler', value: 'İlgi ve öğrenme · Kazanç', note: 'Ardından: Başkalarına yardım' }]);
    // Tek en önemli değer: başlık tekil.
    expect(evaluate(SLUG, bodyFor({ ...base, learning: 5 })).parent.itemsTitle).toBe('En önem verdiği değer');
  });

  it('rastgele 3000 profilde: sıralama, en önemliler, yarışan değerler, daha az önem verilenler ve notlar tutarlı', () => {
    const r = rng(20261009);
    const quarter = () => 1 + Math.floor(r() * 17) / 4;
    for (let n = 0; n < 3000; n++) {
      const values = Object.fromEntries(SCALES.map((k) => [k, n % 5 === 0 ? 3 + Math.floor(r() * 9) / 4 : quarter()])) as Record<string, number>;
      const { order, top, bottom, ranks } = expected(values);
      const rep = evaluate(SLUG, bodyFor(values, 7 + (n % 7)));
      for (const [aud, x] of [
        ['student', rep.student],
        ['parent', rep.parent],
      ] as const) {
        const tag = `${n} ${JSON.stringify(values)} ${aud}`;
        expect(x.chart?.type === 'rulers' ? x.chart.rows.map((row) => row.label) : [], tag).toEqual(order.map(nameOf));
        const titles = x.items.map((i) => i.title);
        expect(titles.filter((t) => /^\d\. /.test(t)), tag).toEqual(top.map((k, i) => `${ranks[i]}. ${nameOf(k)}`));
        const trade = vt.tradeoffs.filter((t) => top.includes(t.a) && top.includes(t.b)).map((t) => t.title);
        expect(titles.filter((t) => vt.tradeoffs.some((x) => x.title === t)), tag).toEqual(trade);
        const lower = x.items.find((i) => i.title.startsWith('Daha az önem'));
        expect(!!lower, tag).toBe(bottom.length > 0);
        if (lower) {
          for (const k of bottom) expect(lower.text, tag).toContain(`“${nameOf(k)}” (`);
          expect(lower.title.endsWith('değerler'), tag).toBe(bottom.length > 1);
          expect(lower.text, tag).toContain(bottom.length > 1 ? 'o değerlerin' : 'o değerin ');
        }
        // Hiçbir değer iki kez anlatılmaz: en önemliler, daha az önemliler ve ötekiler ayrıdır.
        const rest = x.items.find((i) => i.title.startsWith('Diğer') || i.title === 'Bütün değerler');
        for (const k of [...top, ...bottom]) expect(rest?.text ?? '', tag).not.toContain(`${nameOf(k)} (`);
        expect(titles.at(-1), tag).toBe(aud === 'parent' ? vt.note.title.parent : vt.note.title.you);
        // Uyarılar: hepsi düşükse, sıralama yapılamadıysa, hiçbiri çok önemli değilse, farklar küçükse.
        const allLow = SCALES.every((k) => band(values[k]) === 'low');
        const c = x.cautions.join(' ');
        expect(c.includes('az önemli bulduğunu'), tag).toBe(allLow);
        expect(c.includes('aynı önemi'), tag).toBe(!allLow && top.length === 0);
        expect(c.includes('“çok önemli” bulmadı'), tag).toBe(!allLow && top.length > 0 && !SCALES.some((k) => band(values[k]) === 'high'));
        const spread = Math.max(...Object.values(values)) - Math.min(...Object.values(values));
        expect(c.includes('farklar küçük'), tag).toBe(!allLow && top.length > 0 && spread < 0.8);
        // Anahtar rakam en önemli değerdir (en yüksek puanı paylaşanlar birlikte).
        expect(x.keyFigures.map((k) => k.value), tag).toEqual(top.length ? [top.filter((_, i) => ranks[i] === 1).map(nameOf).join(' · ')] : []);
        if (aud === 'student') expect(JSON.stringify(x), tag).not.toMatch(/[Çç]ocuğunuz/);
        for (const s of strings(x)) expect(s, tag).not.toMatch(/undefined|null|\{|\s{2}/);
        // Yol haritası: keşif kartları raporun en önemli değerleridir (hepsi düşükse hiçbiri).
        const rm = x.roadmap!;
        expect(rm.study.items.map((i) => i.key), tag).toEqual(allLow ? [] : top);
        expect(rm.bars.map((b) => b.key).sort(), tag).toEqual([...SCALES].sort());
        expect(rm.settings, tag).toBeNull();
        expect(rm.approach !== null, tag).toBe(aud === 'parent' && top.length > 0 && !allLow);
      }
    }
  }, 300_000);

  it('yetişkin raporu: okula özgü sözcük ve "çocuğunuz" yok; aynı sıralama', () => {
    const r = rng(7);
    for (let n = 0; n < 200; n++) {
      const values = Object.fromEntries(SCALES.map((k) => [k, 1 + Math.floor(r() * 17) / 4])) as Record<string, number>;
      const adult = evaluateAdult(SLUG, bodyFor(values, ADULT_GRADE)).adult;
      const tag = JSON.stringify(values);
      expect(schoolWords(JSON.stringify(adult)), tag).toEqual([]);
      expect(JSON.stringify(adult), tag).not.toMatch(/[Çç]ocuğunuz/);
      expect(adult.items.filter((i) => /^\d\. /.test(i.title)).map((i) => i.title.slice(3)), tag).toEqual(expected(values).top.map(nameOf));
      expect(adult.roadmap!.approach, tag).toBeNull();
    }
  });

  it('şablon: her değerin üç düzey metni; veli metinleri çocuğunuzu anar; yarışan değer çiftleri testin değerleri', () => {
    for (const k of SCALES) {
      for (const b of ['low', 'average', 'high'] as const) {
        const t = tpl.scales[k][b]!;
        expect(t.summary.length, `${k}/${b}`).toBeGreaterThan(5);
        expect(t.student, `${k}/${b}`).not.toMatch(/[Çç]ocuğunuz/);
        expect(t.parent, `${k}/${b}`).toMatch(/[Çç]ocuğunuz/);
        expect(schoolWords(t.student), `${k}/${b}`).toEqual([]);
        expect(t.student, `${k}/${b}`).toMatch(/[.!?]$/);
      }
      // Yüksek düzey metni değerin adını taşıyan "çok önemli" cümlesidir.
      expect(tpl.scales[k].high!.student, k).toContain('çok önemli');
    }
    for (const t of vt.tradeoffs) {
      expect(SCALES, t.a).toContain(t.a);
      expect(SCALES, t.b).toContain(t.b);
      expect(t.text.parent).toMatch(/çocuğunuz/i);
      expect(schoolWords(t.text.adult ?? t.text.student)).toEqual([]);
    }
    for (const x of [vt.lower.student, vt.lower.parent]) {
      expect(x).toContain('{değerler}');
      expect(x).toContain('{o}');
    }
    // Kazanç ile yardım karşıt çift sayılmaz (iş değerleri araştırmasında kazanç iç değerlerin karşısındadır).
    expect(vt.tradeoffs.map((t) => [t.a, t.b])).toEqual([
      ['security', 'independence'],
      ['security', 'learning'],
      ['status', 'helping'],
    ]);
    for (const x of [vt.lower.student, vt.note.text.student]) expect(schoolWords(x)).toEqual([]);
    expect(Object.keys(rt.areas).sort()).toEqual([...SCALES].sort());
  });

  it('PDF raporu üretilir (öğrenci, veli ve yetişkin)', async () => {
    const values = { learning: 5, income: 3, helping: 4, independence: 5, security: 5, team: 3, status: 2, balance: 4 };
    const r = evaluate(SLUG, bodyFor(values));
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, bodyFor(values, ADULT_GRADE)).adult] as SimpleReport[]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/calisma-degerleri');
    const mm = /CD_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(mm![1])).toEqual(d.items.map((i) => i.key));
    // Cevaplar sırayla 1, 2, 3, 4, 5, …: bağımsızlık 3,5; güvence 3,3; ilgi ve öğrenme 3; birlikte çalışma 3 (eşit
    // puanla üçüncü); yardım ve yaşam dengesi 2,5 (en sonda).
    const r = evaluate(SLUG, likertBody(SLUG, 8, (i) => i % 5));
    const s = r.student;
    expect(s.chart?.type === 'rulers' ? s.chart.rows[0].label : '').toBe('Bağımsızlık');
    expect(s.items.map((i) => i.title)).toEqual([
      '1. Bağımsızlık',
      '2. Güvence',
      '3. İlgi ve öğrenme',
      '3. Birlikte çalışma',
      'Güvence ile bağımsızlık arasında',
      'Güvence ile yenilik arasında',
      'Daha az önem verdiğin değerler',
      'Diğer değerlerin',
      'Bu sonucu nasıl kullanabilirsin?',
    ]);
    const rm = r.parent.roadmap!;
    expect([rm.bars.length, rm.approach!.items.length, rm.settings, rm.weeks[1].title, rm.weeks[2].title, rm.preview]).toEqual([
      8,
      4,
      null,
      'Bağımsızlık',
      'Güvence',
      false,
    ]);
  });
});

describe('Çalışma Değerleri: yayın', () => {
  it('pilot olarak yayında: listelerde ve site haritasında; yol haritası var', () => {
    expect(d.status).toBe('pilot');
    expect(d.licenseStatus).toBe('original');
    expect(d.profile).toBe('values');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(hasPublicRoadmap(SLUG)).toBe(true);
  });

  it('kaynaklar: künyeler DOI bağlantılı ve bilim kartında anılıyor', () => {
    const cites = d.science.citations;
    expect(cites).toHaveLength(5);
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['Busque-Carrier, Ratelle ve Le Corff, 2022', 'Lechner ve ark., 2017', 'Twenge ve ark., 2010', 'Schwartz, 2012', 'Kristof-Brown, Zimmerman ve Johnson, 2005']) {
      expect(body, a).toContain(a);
    }
  });
});
