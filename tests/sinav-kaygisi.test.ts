import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { sinavKaygisiBasEtme } from '@/content/instruments/sinav-kaygisi';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { InsightRule, LevelGroup } from '@/content/reports/types';
import { guidesForTest } from '@/content/rehber';
import { ROADMAPS, hasPublicRoadmap } from '@/content/roadmaps';
import { SECICI_GOALS } from '@/content/test-secici';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { anchoredBand, likertQuality, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'sinav-kaygisi-ve-bas-etme';
const d = sinavKaygisiBasEtme;
const SCALES = ['worry', 'body', 'block', 'prep', 'calm'];
const NAMES = ['Endişeli düşünceler', 'Bedensel tepkiler', 'Sınav sırasında takılma', 'Sınava hazırlık', 'Baş etme yolları'];
/** Kaygının yanları: yüksek uç zor uçtur. */
const ANXIETY = ['worry', 'body', 'block'];
/** Uygulama sırası: hazırlık, endişe, beden, takılma, baş etme. */
const ORDER = ['prep', 'worry', 'body', 'block', 'calm'];
const tpl = REPORT_TEMPLATES[SLUG];
const ins = tpl.insight!;
const rm = ROADMAPS[SLUG];
type Aud = 'student' | 'parent' | 'adult';
const LEVELS: LevelGroup[] = ['low', 'average', 'high'];
const LABEL: Record<LevelGroup, string> = { low: 'Düşük', average: 'Orta', high: 'Yüksek' };
const level = (v: number): LevelGroup => (Math.round(v * 10) / 10 >= 3.5 ? 'high' : Math.round(v * 10) / 10 >= 2.5 ? 'average' : 'low');

/** Alan → ortalama (alanın yönünde; beş maddenin toplamı tam sayı): ters maddelerde değer çevrilir. */
function bodyFor(values: Record<string, number>, grade = 8) {
  const answers: Record<string, { value: number; rtMs: number }> = {};
  for (const s of SCALES) {
    const sum = Math.round(values[s] * 5);
    d.items
      .filter((i) => i.scale === s)
      .forEach((it, j) => {
        const v = Math.floor(sum / 5) + (j < sum % 5 ? 1 : 0);
        answers[it.key] = { value: it.reverse ? 6 - v : v, rtMs: 2500 };
      });
  }
  return { grade, data: { engine: 'likert' as const, answers } };
}

const fitsWhen = (values: Record<string, number>, when: InsightRule['when']) => Object.entries(when).every(([k, gs]) => gs.includes(level(values[k])));
const fires = (values: Record<string, number>, rule: InsightRule) => fitsWhen(values, rule.when) && !(rule.not && fitsWhen(values, rule.not));
const pickText = (rule: InsightRule, aud: Aud) => (aud === 'parent' ? rule.text.parent : aud === 'adult' ? (rule.text.adult ?? rule.text.student) : rule.text.student);

function expectedInsight(values: Record<string, number>, aud: Aud): string {
  return [pickText(ins.lead.find((r) => fires(values, r))!, aud), ...ins.rules.filter((r) => fires(values, r)).map((r) => pickText(r, aud))].join('\n\n');
}

function strings(x: unknown): string[] {
  if (typeof x === 'string') return [x];
  if (Array.isArray(x)) return x.flatMap(strings);
  if (x && typeof x === 'object') return Object.values(x).flatMap(strings);
  return [];
}

/** Sayfada yan yana okunan metinler: kartlar (birlikte yorumun paragrafları ayrı) ve yol haritasının bölümleri. */
function pageTexts(rep: SimpleReport): string[] {
  const r = rep.roadmap!;
  return [
    ...rep.items.flatMap((i) => i.text.split('\n\n')),
    r.standoutNote ?? '',
    r.study.intro,
    ...r.study.items.map((i) => i.text),
    ...(r.approach?.items.map((i) => i.text) ?? []),
    ...r.weeks.map((w) => w.text),
  ].filter(Boolean);
}

const sentencesOf = (text: string) => text.split(/(?<=[.!?])\s+(?=[\p{Lu}“])/u).map((x) => x.trim()).filter(Boolean);
const words = (s: string) => s.replace(/“[^”]*”/g, 'X').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;

describe('Sınav Kaygısı ve Baş Etme: maddeler', () => {
  it('25 özgün madde; her alanda beş; alanlar sırayla döner; ters maddeler ve beş karşıt çift', () => {
    expect(d.items).toHaveLength(25);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    d.items.forEach((it, i) => {
      expect(it.scale, it.key).toBe(ORDER[i % 5]);
      expect(it.source, it.key).toBeUndefined();
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
      expect(it.text.length, it.key).toBeLessThanOrEqual(90);
    });
    for (const s of SCALES) expect(d.items.filter((i) => i.scale === s), s).toHaveLength(5);
    expect(d.items.filter((i) => i.reverse).map((i) => i.key).sort()).toEqual(['B4', 'B5', 'C5', 'P4', 'P5', 'T5', 'W5']);
    // Ters maddeler 2.–5. beşliklere dağılır (ilk beşlikte ters madde yok, her sonrakinde en az bir).
    for (let b = 1; b < 5; b++) expect(d.items.slice(b * 5, b * 5 + 5).some((i) => i.reverse), `beşlik ${b + 1}`).toBe(true);
    // Sıklık ölçeğiyle çakışan sözler yok ("… olur", "pek"); baş etme cümleleri kaygıyı varsaymaz.
    for (const it of d.items) expect(it.text, it.key).not.toMatch(/ olur\.$|(?<!\p{L})pek(?!\p{L})/u);
    for (const it of d.items.filter((i) => i.scale === 'calm')) expect(it.text, it.key).not.toMatch(/gerildiğimde|kaygım|kaygılarımı/u);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(25);
    expect(d.oppositePairs).toHaveLength(5);
    const at = (k: string) => d.items.findIndex((i) => i.key === k);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items[at(x)];
      const b = d.items[at(y)];
      expect(a.scale, x).toBe(b.scale);
      expect([!!a.reverse, !!b.reverse], x).toEqual([false, true]);
      // Birbirinin tersini söyleyen cümleler birbirinden uzaktır.
      expect(Math.abs(at(x) - at(y)), x).toBeGreaterThanOrEqual(10);
    }
    expect(new Set(d.oppositePairs!.map(([x]) => d.items[at(x)].scale)).size).toBe(5);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(JSON.stringify(d)).not.toMatch(/\bIQ\b|zekâ puanı/);
  });

  it('yetişkinlere de açık: yönerge, soru ve maddelerde okula özgü sözcük yok ("sınav" testin konusudur); 5. sınıftan itibaren', () => {
    expect(d.adults).toBe(true);
    expect([d.minGrade, d.maxGrade]).toEqual([5, 13]);
    for (const x of [d.intro.title, ...d.intro.paragraphs, d.prompt, ...d.items.map((i) => i.text)]) {
      expect(schoolWords(x, SLUG), x).toEqual([]);
      // İstisna yalnızca "sınav" sözcüğüdür.
      expect(schoolWords(x).every((w) => w.startsWith('sınav')), x).toBe(true);
    }
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(schoolWords('Sınav öncesi ders çalışmak', SLUG)).toEqual(['ders']);
    expect(schoolWords('Sınav öncesi', ['sinav-kaygisi-ve-bas-etme', 'zihniyet'])).toEqual(['sınav']);
  });
});

describe('Sınav Kaygısı ve Baş Etme: puanlama', () => {
  it('ters maddeler çevrilir; düzeyler bir ondalıklı ortalamaya göre', () => {
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('low');
    expect(anchoredBand(2.5, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.5, d.anchoredBands)).toBe('high');
    const scores = scoreLikert(d, bodyFor({ worry: 4.6, body: 2, block: 3, prep: 1, calm: 5 }).data.answers);
    expect(scores.map((s) => [s.scaleKey, s.value, s.band])).toEqual([
      ['worry', 4.6, 'high'],
      ['body', 2, 'low'],
      ['block', 3, 'average'],
      ['prep', 1, 'low'],
      ['calm', 5, 'high'],
    ]);
  });

  it('evet deme eğilimi: her cümleye "Sık sık" ya da "Her zaman" diyen kişiye uyarı; tutarlı cevaplarda yok', () => {
    const yes = Object.fromEntries(d.items.map((it, i) => [it.key, { value: 4 + (i % 2), rtMs: 2500 }]));
    expect(likertQuality(d, yes).oppositeAgree).toBeGreaterThanOrEqual(3);
    const r = evaluate(SLUG, { grade: 9, data: { engine: 'likert', answers: yes } });
    expect(r.student.cautions.length).toBeGreaterThan(0);
    expect(likertQuality(d, bodyFor({ worry: 5, body: 5, block: 5, prep: 5, calm: 5 }).data.answers).oppositeAgree).toBe(0);
    expect(likertQuality(d, bodyFor({ worry: 1, body: 1, block: 1, prep: 1, calm: 1 }).data.answers).oppositeAgree).toBe(0);
  });
});

describe('Sınav Kaygısı ve Baş Etme: rapor', () => {
  const VALUES: Record<LevelGroup, number[]> = { low: [1, 2, 2.4], average: [2.6, 3, 3.4], high: [3.6, 4, 5] };

  it('bütün düzey birleşimlerinde öğrenci, veli ve yetişkin raporu eksiksiz ve tutarlı', () => {
    let n = 0;
    for (let k = 0; k < 3 ** 5; k++) {
      const combo = SCALES.map((_, i) => LEVELS[Math.floor(k / 3 ** i) % 3]);
      const values = Object.fromEntries(SCALES.map((s, i) => [s, VALUES[combo[i]][(k + i) % 3]]));
      const g = Object.fromEntries(SCALES.map((s, i) => [s, combo[i]])) as Record<string, LevelGroup>;
      const anyHigh = ANXIETY.some((s) => g[s] === 'high');
      const r = evaluate(SLUG, bodyFor(values, 5 + (k % 9)));
      const adult = evaluateAdult(SLUG, bodyFor(values, ADULT_GRADE)).adult;
      for (const [aud, rep] of [
        ['student', r.student],
        ['parent', r.parent],
        ['adult', adult],
      ] as const) {
        const tag = `${combo.join('/')} ${aud}`;
        expect(rep.chart?.type === 'rulers' ? rep.chart.rows.map((x) => x.label) : [], tag).toEqual(NAMES);
        expect(rep.chartNote, tag).toBe(aud === 'parent' ? tpl.overview!.parent : tpl.overview!.student);
        expect(rep.items.map((i) => i.title), tag).toEqual(['Birlikte bakınca', ...NAMES]);
        expect(rep.items[0].text, tag).toBe(expectedInsight(values, aud));
        SCALES.forEach((s, i) => {
          const bt = tpl.scales[s][combo[i]]!;
          expect(rep.items[i + 1].badge, tag).toContain(LABEL[combo[i]]);
          expect(rep.items[i + 1].text, tag).toBe(aud === 'parent' ? bt.parent : aud === 'adult' ? (bt.adult ?? bt.student) : bt.student);
        });
        // Birlikte yorum: giriş ve kaygının yanlarına göre tam bir kural; baş etme ve hazırlık kuralları koşullarında.
        const paras = rep.items[0].text.split('\n\n');
        const pattern = ins.rules.slice(0, 6).filter((x) => fires(values, x));
        expect(pattern, tag).toHaveLength(1);
        const which =
          g.block === 'high' ? 0 : g.worry === 'high' ? (g.prep === 'low' ? 2 : 1) : g.body === 'high' ? 3 : ANXIETY.every((s) => g[s] === 'low') ? 4 : 5;
        expect(ins.rules.indexOf(pattern[0]), tag).toBe(which);
        const extra = (g.block === 'high' && g.prep === 'low' ? 1 : 0) + (anyHigh && g.calm !== 'average' ? 1 : 0);
        expect(paras, tag).toHaveLength(2 + extra);
        // Bir araştırma bulgusu bir kez: "Bir araştırmada", "Başka bir araştırmada", "Bir deneyde" en çok birer kez.
        const all = rep.items.map((i) => i.text).join(' ');
        expect(all.split('Bir araştırmada').length - 1, tag).toBeLessThanOrEqual(1);
        expect(all.split('Bir deneyde').length - 1, tag).toBeLessThanOrEqual(1);
        // Kaygı kusur, düşük kaygı başarı gibi anlatılmaz.
        expect(all, tag).not.toMatch(/başarısız|kusur|normal|tanı(?!\p{L})|bozukluk|panik|atak/u);
        // Destek kutusu: kaygının en az bir yanı yüksekse.
        expect(rep.support !== null, tag).toBe(anyHigh);
        // Aynı sayfada bir cümle iki kez geçmez (kartlar, birlikte yorum ve yol haritası).
        const sentences = pageTexts(rep).flatMap(sentencesOf).filter((x) => x.length > 25);
        expect(sentences.filter((x, i) => sentences.indexOf(x) !== i), tag).toEqual([]);
        for (const s of sentences) expect(words(s), `${tag}: ${s}`).toBeLessThanOrEqual(26);
        expect(rep.cautions.filter((x) => !x.includes('hep aynı seçenek')), tag).toEqual([]);
        if (aud !== 'parent') expect(JSON.stringify(rep), tag).not.toMatch(/[Çç]ocuğunuz/);
        if (aud === 'adult') {
          const { roadmap, ...rest } = rep;
          void roadmap;
          expect(schoolWords(JSON.stringify(rest), SLUG), tag).toEqual([]);
          for (const x of strings(roadmap).filter((y) => !y.startsWith('/') && !y.startsWith('http'))) expect(x, tag).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|öğrenci)/iu);
        }
        for (const x of strings(rep)) expect(x.replaceAll('\n\n', ' '), tag).not.toMatch(/undefined|null|\s{2}|\n|\{/);
        // Yol haritası.
        const road = rep.roadmap!;
        expect(road.bars.map((b) => b.key), tag).toEqual(SCALES);
        expect(road.settings, tag).toBeNull();
        expect(road.weeks.map((w) => w.title)[1], tag).toBe('Sınava hazırlık');
        const stress = ['block', 'worry', 'body'].find((s) => g[s] === 'high');
        if (stress) expect(road.weeks[2].title, tag).toBe(NAMES[SCALES.indexOf(stress)]);
        else {
          // Ortadan en uzak alan (hazırlık ve kaygının düşük yanları hariç); eşitlikte testteki sıra.
          const cand = SCALES.filter((s) => s !== 'prep' && !(ANXIETY.includes(s) && g[s] === 'low'));
          const best = cand.reduce((m, s) => (Math.abs(values[s] - 3) > Math.abs(values[m] - 3) ? s : m));
          expect(road.weeks[2].title, tag).toBe(NAMES[SCALES.indexOf(best)]);
        }
        expect(road.study.links.map((l) => l.href), tag).toEqual(['/rehber/etkili-ders-calisma-yontemleri', ...(anyHigh ? ['/rehber/sinav-kaygisi'] : [])]);
        // Kısaca: kaygının yüksek yanları önce.
        const firstStandout = road.standout[0]?.keys?.[0];
        if (anyHigh) expect(ANXIETY.filter((s) => g[s] === 'high'), tag).toContain(firstStandout);
        expect(road.approach !== null, tag).toBe(aud === 'parent');
        n++;
      }
    }
    expect(n).toBe(3 ** 5 * 3);
  }, 300_000);

  it('birlikte yorum: tek giriş; kurallar yalnızca testin alanlarını anar; yetişkin metinleri okula özgü değil', () => {
    expect(ins.lead).toHaveLength(1);
    expect(ins.lead[0].when).toEqual({});
    for (const x of [...ins.lead, ...ins.rules]) {
      for (const k of [...Object.keys(x.when), ...Object.keys(x.not ?? {})]) expect(SCALES, k).toContain(k);
      expect(schoolWords(x.text.adult ?? x.text.student, SLUG), x.text.student).toEqual([]);
      expect(x.text.parent, x.text.student).toMatch(/[Çç]ocuğunuz/);
      expect(x.text.student, x.text.student).not.toMatch(/[Çç]ocuğunuz/);
    }
  });

  it('kartlar öneri vermez; destek yalnızca kaygının yüksek düzeylerinde; yetişkin metni gerekirse ayrı', () => {
    for (const s of SCALES) {
      for (const lv of LEVELS) {
        const bt = tpl.scales[s][lv]!;
        expect(bt.summary, `${s} ${lv}`).not.toBe(LABEL[lv]);
        expect(!!bt.support, `${s} ${lv}`).toBe(ANXIETY.includes(s) && lv === 'high');
        expect(`${bt.student} ${bt.parent}`, `${s} ${lv}`).not.toMatch(/deneyin|deneyebilirsin|yapın|edin\.|sorun\./u);
        expect(schoolWords(bt.adult ?? bt.student, SLUG), `${s} ${lv}`).toEqual([]);
        expect(bt.parent, `${s} ${lv}`).toMatch(/^Çocuğunuz/);
        for (const x of [bt.student, bt.parent]) for (const sen of sentencesOf(x)) expect(words(sen), `${s} ${lv}: ${sen}`).toBeLessThanOrEqual(30);
      }
    }
  });

  it('PDF raporu üretilir (öğrenci, veli ve yetişkin)', async () => {
    const body = bodyFor({ worry: 4.4, body: 2, block: 3.6, prep: 1.4, calm: 2 });
    const r = evaluate(SLUG, body);
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult] as SimpleReport[]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain(`/api/rapor/${SLUG}`);
    const mm = /SK_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(mm![1])).toEqual(d.items.map((i) => i.key));
    // Gövdedeki cevaplar sırayla 1, 2, 3, 4, 5, …: hazırlık 2,6 (orta), endişe 2,4 (düşük), beden 3,0, takılma 3,6 (yüksek),
    // baş etme 4,2 (yüksek).
    const r = evaluate(SLUG, likertBody(SLUG, 8, (i) => i % 5));
    expect(r.student.chart?.type === 'rulers' ? r.student.chart.rows.map((x) => x.band) : []).toEqual(['Düşük', 'Orta', 'Yüksek', 'Orta', 'Yüksek']);
    expect(r.student.items[0].title).toBe('Birlikte bakınca');
    expect(r.student.items[0].text).toContain('Sınav sırasında takılma puanın yüksek');
    expect(r.student.support).not.toBeNull();
    const m = r.parent.roadmap!;
    expect([m.bars.length, m.approach!.items.length, m.settings, m.weeks[1].title, m.weeks[2].title, m.preview]).toEqual([
      5,
      5,
      null,
      'Sınava hazırlık',
      'Sınav sırasında takılma',
      false,
    ]);
  });
});

describe('Sınav Kaygısı ve Baş Etme: yol haritası', () => {
  it('her alanda öneriler; veli metinleri çocuğu anlatır; yetişkine okula özgü sözcük yok; öneriler birbirini yinelemez', () => {
    const seen = new Map<string, string>();
    for (const s of SCALES) {
      for (const lv of LEVELS) {
        for (const part of ['study', 'action'] as const) {
          const x = rm.scales[s][part][lv];
          const at = `${s} ${part} ${lv}`;
          expect(x.parent, at).toMatch(/[Çç]ocuğunuz/);
          expect(x.student, at).not.toMatch(/[Çç]ocuğunuz/);
          expect(x.adult ?? x.student, at).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|kitap|öğrenci)/iu);
          for (const [who, txt] of [['student', x.student], ['parent', x.parent]] as const) {
            for (const sen of sentencesOf(txt)) {
              expect(words(sen), `${at}: ${sen}`).toBeLessThanOrEqual(26);
              if (sen.length > 30) {
                expect(seen.get(`${who} ${sen}`), `${at}: ${sen}`).toBeUndefined();
                seen.set(`${who} ${sen}`, at);
              }
            }
          }
        }
        expect(rm.approach![s][lv], `${s} ${lv}`).toMatch(/\.$/);
      }
    }
    // Yavaş nefes yalnızca bedensel tepkilerde ve (düşük düzeyde dayanak olarak) orada; endişeyi yazmak yalnızca endişede.
    const text = (s: string) => JSON.stringify(rm.scales[s]);
    for (const s of SCALES.filter((x) => x !== 'body')) expect(text(s), s).not.toMatch(/yavaş nefes/);
    for (const s of SCALES.filter((x) => x !== 'worry')) expect(text(s), s).not.toMatch(/endişelerini bir kâğıda/);
    expect(rm.planningScale).toBe('prep');
    expect(rm.unit).toEqual({ one: 'alan', toPlural: 'alanlara' });
    // Kaygının yüksek yanı 3. haftaya; bağlantı yetişkine de verilir.
    expect([rm.wellbeing].flat().map((w) => [w!.scale, w!.group, w!.link?.href])).toEqual([
      ['block', 'high', '/rehber/sinav-kaygisi'],
      ['worry', 'high', '/rehber/sinav-kaygisi'],
      ['body', 'high', '/rehber/sinav-kaygisi'],
    ]);
    // Hiçbir öneri kaygının kaybolacağını ya da puanın yükseleceğini vaat etmez.
    expect(JSON.stringify(rm)).not.toMatch(/kaygın (geçer|kaybolur)|puanın yükselir|garanti/u);
  });

  it('kaynaklar: künyeler DOI bağlantılı', () => {
    expect(rm.sources.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    expect(rm.sources.map((c) => c.text.split(' ')[0])).toEqual(['Ramirez,', 'Camerer,', 'Jamieson,', 'Huntley,', 'Ergene,', 'Dunlosky,']);
  });
});

describe('Sınav Kaygısı ve Baş Etme: yayın', () => {
  it('pilot olarak yayında: listelerde ve site haritasında; yol haritası var; rehber yazısıyla ve test seçiciyle bağlı', () => {
    expect(d.status).toBe('pilot');
    expect(d.licenseStatus).toBe('original');
    expect(d.domain).toBe('academic');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(guidesForTest(SLUG).map((g) => g.slug)).toEqual(['sinav-kaygisi']);
    const guide = guidesForTest(SLUG)[0];
    expect(guide.body).toContain(`(/testler/${SLUG})`);
    expect(guide.body).not.toContain('hazırlık aşamasındadır');
    const slot = SECICI_GOALS.find((g) => g.key === 'calisma')!.slots.find((s) => s.candidates.includes(SLUG));
    expect(slot?.skill).toBe('Sınav kaygısı');
  });

  it('kaynaklar: künyeler DOI bağlantılı ve bilim kartında anılıyor', () => {
    const cites = d.science.citations;
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    expect(new Set(cites.map((c) => c.url)).size).toBe(cites.length);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const c of cites) {
      const author = c.text.split(',')[0];
      const year = /\((\d{4})\)/.exec(c.text)![1];
      expect(body, c.text).toContain(author);
      expect(body, c.text).toContain(year);
    }
    // Sınırlılık: test başarıyı ölçmez; tanı koymaz.
    expect(d.science.limitations.join(' ')).toContain('sınav başarısını ölçmez');
    expect(d.science.limitations.join(' ')).toContain('Tanı koymaz');
  });
});
