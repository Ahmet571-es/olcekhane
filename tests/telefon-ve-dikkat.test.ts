import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { telefonVeDikkat } from '@/content/instruments/telefon-ve-dikkat';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { InsightRule, LevelGroup } from '@/content/reports/types';
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

const SLUG = 'ders-calisirken-telefon-ve-dikkat';
const d = telefonVeDikkat;
const SCALES = ['notify', 'switching', 'pull', 'control'];
const NAMES = ['Bildirimlerin çekimi', 'Ekranlar arası geçiş', 'Telefona dönme isteği', 'Kendini durdurma yolları'];
/** Bölünmenin yanları: yüksek uç zor uçtur (kendini durdurma yollarında düşük uç). */
const SPLIT = ['notify', 'switching', 'pull'];
/** Uygulama sırası: kendini durdurma, bildirimler, geçiş, dönme isteği. */
const ORDER = ['control', 'notify', 'switching', 'pull'];
const tpl = REPORT_TEMPLATES[SLUG];
const ins = tpl.insight!;
const rm = ROADMAPS[SLUG];
type Aud = 'student' | 'parent' | 'adult';
const LEVELS: LevelGroup[] = ['low', 'average', 'high'];
const LABEL: Record<LevelGroup, string> = { low: 'Düşük', average: 'Orta', high: 'Yüksek' };
const level = (v: number): LevelGroup => (Math.round(v * 10) / 10 >= 3.5 ? 'high' : Math.round(v * 10) / 10 >= 2.5 ? 'average' : 'low');
/** Okula özgü ya da bağımlılık, tanı gibi klinik sözcükler (yetişkin metinlerinde okul sözcükleri ayrıca aranır). */
const CLINICAL = /bağımlı|bağımlılık|tanı(?!\p{L})|bozukluk|hastalık|dehb|kusur|başarısız|normal(?!\p{L})|tembel/iu;

/** Alan → ortalama (alanın yönünde; altı maddenin toplamı tam sayı): ters maddelerde değer çevrilir. */
function bodyFor(values: Record<string, number>, grade = 8) {
  const answers: Record<string, { value: number; rtMs: number }> = {};
  for (const s of SCALES) {
    const sum = Math.round(values[s] * 6);
    d.items
      .filter((i) => i.scale === s)
      .forEach((it, j) => {
        const v = Math.floor(sum / 6) + (j < sum % 6 ? 1 : 0);
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

describe('Ders Çalışırken Telefon ve Dikkat: maddeler', () => {
  it('24 özgün madde; her alanda altı; alanlar sırayla döner; her alanda bir ters madde ve üç karşıt çift', () => {
    expect(d.items).toHaveLength(24);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    d.items.forEach((it, i) => {
      expect(it.scale, it.key).toBe(ORDER[i % 4]);
      expect(it.source, it.key).toBeUndefined();
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
      expect(it.text.length, it.key).toBeLessThanOrEqual(90);
    });
    for (const s of SCALES) expect(d.items.filter((i) => i.scale === s), s).toHaveLength(6);
    expect(d.items.filter((i) => i.reverse).map((i) => i.key).sort()).toEqual(['K6', 'N6', 'R6', 'S6']);
    // Telefonu çalışmasını pek bölmeyen birinin "Her zaman" diyeceği ters cümleler (N6, S6, R6) diziyi böler: böyle biri en çok altı
    // cümle üst üste aynı seçeneği işaretler ("hep aynı seçenek" uyarısı 12'de başlar).
    const breaks = ['N6', 'S6', 'R6'].map((k) => d.items.findIndex((i) => i.key === k)).sort((a, b) => a - b);
    const gaps = [breaks[0], ...breaks.slice(1).map((x, i) => x - breaks[i] - 1), d.items.length - 1 - breaks[breaks.length - 1]];
    expect(Math.max(...gaps)).toBeLessThanOrEqual(6);
    // Sıklık ölçeğiyle çakışan sözler yok ("… olur", "pek", "hep"); bağımlılık ya da klinik bir sözcük yok.
    for (const it of d.items) {
      expect(it.text, it.key).not.toMatch(/ olur\.$|(?<!\p{L})(?:pek|hep|hiç)(?!\p{L})/u);
      expect(it.text, it.key).not.toMatch(CLINICAL);
    }
    expect(new Set(d.items.map((i) => i.text)).size).toBe(24);
    expect(d.oppositePairs).toEqual([
      ['N2', 'N6'],
      ['S1', 'S6'],
      ['R1', 'R6'],
    ]);
    const at = (k: string) => d.items.findIndex((i) => i.key === k);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items[at(x)];
      const b = d.items[at(y)];
      expect(a.scale, x).toBe(b.scale);
      expect([!!a.reverse, !!b.reverse], x).toEqual([false, true]);
      // Birbirinin tersini söyleyen cümleler birbirinden uzaktır.
      expect(Math.abs(at(x) - at(y)), x).toBeGreaterThanOrEqual(12);
    }
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(JSON.stringify(d)).not.toMatch(/\bIQ\b|zekâ puanı/);
    // "Bağımlılık" yalnızca testin bir bağımlılık testi olmadığını söylerken geçer.
    expect(JSON.stringify({ ...d, science: null }).match(/\p{L}*bağımlı\p{L}* \p{L}+ \p{L}+/gu)).toEqual(['bağımlılık testi değildir']);
  });

  it('telefonu çalışmasını pek bölmeyen ve bu yolları kullanmayan biri (düz cümlelere "Hiçbir zaman", N6, S6, R6\'ya "Her zaman"): dört alan düşük, uyarı yok', () => {
    const answers = Object.fromEntries(d.items.map((it) => [it.key, { value: it.reverse && it.key !== 'K6' ? 5 : 1, rtMs: 2500 }]));
    expect(scoreLikert(d, answers).map((s) => s.band)).toEqual(['low', 'low', 'low', 'low']);
    expect(likertQuality(d, answers).oppositeAgree).toBe(0);
    const r = evaluate(SLUG, { grade: 5, data: { engine: 'likert', answers } });
    expect(r.student.cautions).toEqual([]);
    expect(r.student.items[0].text).toContain('ya da yanında telefon veya tablet olmuyorsa bu beklenen bir durumdur.');
  });

  it('telefonu başka bir odada duran ama bildirimden sonra aklı dağılabilen biri: bir karşıt çift uyuşmasa da uyarı yok', () => {
    const answers = Object.fromEntries(
      d.items.map((it) => [it.key, { value: it.scale === 'control' ? (it.reverse ? 1 : 5) : it.key === 'N6' ? 2 : it.reverse ? 5 : 1, rtMs: 2500 }]),
    );
    const q = likertQuality(d, answers);
    expect([q.oppositeAgree, q.oppositeDisagree]).toEqual([0, 1]);
    expect(evaluate(SLUG, { grade: 9, data: { engine: 'likert', answers } }).student.cautions).toEqual([]);
  });

  it('yetişkinlere de açık: yönerge, soru ve maddelerde okula özgü sözcük yok; 5. sınıftan itibaren', () => {
    expect(d.adults).toBe(true);
    expect([d.minGrade, d.maxGrade]).toEqual([5, 13]);
    for (const x of [d.intro.title, ...d.intro.paragraphs, d.prompt, ...d.items.map((i) => i.text)]) expect(schoolWords(x), x).toEqual([]);
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.intro.paragraphs.join(' ')).toContain('Kendi telefonun yoksa');
    // Yaşanmayan durumda "Hiçbir zaman" demeyi önermez: ters cümleler de "Hiçbir zaman" alır, karşıt çiftler çelişirdi.
    expect(d.intro.paragraphs.join(' ')).not.toContain('Hiçbir zaman');
    // Testin adı site sahibinin seçtiği addır; yalnızca adında "ders" geçer.
    expect(schoolWords(d.name)).toEqual(['ders']);
  });
});

describe('Ders Çalışırken Telefon ve Dikkat: puanlama', () => {
  it('ters maddeler çevrilir; düzeyler bir ondalıklı ortalamaya göre', () => {
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('low');
    expect(anchoredBand(2.5, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.5, d.anchoredBands)).toBe('high');
    const scores = scoreLikert(d, bodyFor({ notify: 4.5, switching: 2, pull: 3, control: 1 }).data.answers);
    expect(scores.map((s) => [s.scaleKey, s.value, s.band])).toEqual([
      ['notify', 4.5, 'high'],
      ['switching', 2, 'low'],
      ['pull', 3, 'average'],
      ['control', 1, 'low'],
    ]);
  });

  it('evet deme eğilimi: her cümleye "Sık sık" ya da "Her zaman" diyen kişiye uyarı; tutarlı cevaplarda yok', () => {
    const yes = Object.fromEntries(d.items.map((it, i) => [it.key, { value: 4 + (i % 2), rtMs: 2500 }]));
    expect(likertQuality(d, yes).oppositeAgree).toBeGreaterThanOrEqual(2);
    const r = evaluate(SLUG, { grade: 9, data: { engine: 'likert', answers: yes } });
    expect(r.student.cautions.length).toBeGreaterThan(0);
    expect(likertQuality(d, bodyFor({ notify: 5, switching: 5, pull: 5, control: 5 }).data.answers).oppositeAgree).toBe(0);
    expect(likertQuality(d, bodyFor({ notify: 1, switching: 1, pull: 1, control: 1 }).data.answers).oppositeAgree).toBe(0);
  });
});

describe('Ders Çalışırken Telefon ve Dikkat: rapor', () => {
  const VALUES: Record<LevelGroup, number[]> = { low: [1, 2, 7 / 3], average: [2.5, 3, 10 / 3], high: [3.5, 4, 5] };

  it('bütün düzey birleşimlerinde öğrenci, veli ve yetişkin raporu eksiksiz ve tutarlı', () => {
    let n = 0;
    for (let k = 0; k < 3 ** 4; k++) {
      for (const variant of [0, 1, 2]) {
        const combo = SCALES.map((_, i) => LEVELS[Math.floor(k / 3 ** i) % 3]);
        const values = Object.fromEntries(SCALES.map((s, i) => [s, VALUES[combo[i]][(variant + i) % 3]]));
        const g = Object.fromEntries(SCALES.map((s, i) => [s, combo[i]])) as Record<string, LevelGroup>;
        expect(SCALES.map((s) => level(values[s])), combo.join('/')).toEqual(combo);
        const anyHigh = SPLIT.some((s) => g[s] === 'high');
        const allLow = SPLIT.every((s) => g[s] === 'low');
        const r = evaluate(SLUG, bodyFor(values, 5 + ((k + variant) % 9)));
        const adult = evaluateAdult(SLUG, bodyFor(values, ADULT_GRADE)).adult;
        for (const [aud, rep] of [
          ['student', r.student],
          ['parent', r.parent],
          ['adult', adult],
        ] as const) {
          const tag = `${combo.join('/')} #${variant} ${aud}`;
          expect(rep.chart?.type === 'rulers' ? rep.chart.rows.map((x) => x.label) : [], tag).toEqual(NAMES);
          expect(rep.chartNote, tag).toBe(aud === 'parent' ? tpl.overview!.parent : tpl.overview!.student);
          expect(rep.items.map((i) => i.title), tag).toEqual(['Birlikte bakınca', ...NAMES]);
          expect(rep.items[0].text, tag).toBe(expectedInsight(values, aud));
          SCALES.forEach((s, i) => {
            const bt = tpl.scales[s][combo[i]]!;
            expect(rep.items[i + 1].badge, tag).toContain(LABEL[combo[i]]);
            expect(rep.items[i + 1].text, tag).toBe(aud === 'parent' ? bt.parent : aud === 'adult' ? (bt.adult ?? bt.student) : bt.student);
          });
          // Birlikte yorum: giriş, bölünmenin yüksek her yanı için bir cümle (hiçbiri yüksek değilse tam bir cümle), kendini durdurma
          // yollarının kuralları koşullarında.
          const paras = rep.items[0].text.split('\n\n');
          const highs = SPLIT.filter((s) => g[s] === 'high').length;
          const pattern = ins.rules.slice(0, 5).filter((x) => fires(values, x));
          expect(pattern, tag).toHaveLength(anyHigh ? highs : 1);
          if (!anyHigh) expect(ins.rules.indexOf(pattern[0]), tag).toBe(allLow ? 3 : 4);
          const extra = anyHigh ? (g.control !== 'average' ? 1 : 0) : g.control === 'high' || (allLow && g.control === 'low') ? 1 : 0;
          expect(paras, tag).toHaveLength(1 + pattern.length + extra);
          // Bir araştırma bulgusu bir kez: "Bir deneyde", "gözlenen" en çok birer kez.
          const all = rep.items.map((i) => i.text).join(' ');
          expect(all.split('Bir deneyde').length - 1, tag).toBeLessThanOrEqual(1);
          expect(all.split('gözlenen').length - 1, tag).toBeLessThanOrEqual(1);
          // Telefon kullanımı kusur, az kullanım başarı gibi anlatılmaz; bağımlılık ya da klinik bir sözcük yok (kartlar ve yol haritası).
          expect(pageTexts(rep).join(' '), tag).not.toMatch(CLINICAL);
          // Destek kutusu yok (bir sağlık ölçümü değildir).
          expect(rep.support, tag).toBeNull();
          // Aynı sayfada bir cümle iki kez geçmez (kartlar, birlikte yorum ve yol haritası).
          const sentences = pageTexts(rep).flatMap(sentencesOf).filter((x) => x.length > 25);
          expect(sentences.filter((x, i) => sentences.indexOf(x) !== i), tag).toEqual([]);
          for (const s of sentences) expect(words(s), `${tag}: ${s}`).toBeLessThanOrEqual(26);
          expect(rep.cautions.filter((x) => !x.includes('hep aynı seçenek')), tag).toEqual([]);
          if (aud !== 'parent') expect(JSON.stringify(rep), tag).not.toMatch(/[Çç]ocuğunuz/);
          if (aud === 'adult') {
            const { roadmap, ...rest } = rep;
            void roadmap;
            // Testin adı ("Ders Çalışırken …") ve adresi site sahibinin seçtiğidir; yetişkine giden öteki metinlerde okul sözcüğü yok.
            expect(schoolWords(JSON.stringify({ ...rest, instrumentName: '' }).replaceAll(SLUG, '')), tag).toEqual([]);
            for (const x of strings(roadmap).filter((y) => !y.startsWith('/') && !y.startsWith('http') && y !== 'Etkili çalışma yöntemleri'))
              expect(x, tag).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|öğrenci|sınav)/iu);
          }
          for (const x of strings(rep)) expect(x.replaceAll('\n\n', ' '), tag).not.toMatch(/undefined|null|\s{2}|\n|\{/);
          // Yol haritası.
          const road = rep.roadmap!;
          expect(road.bars.map((b) => b.key), tag).toEqual(SCALES);
          expect(road.settings, tag).toBeNull();
          expect(road.weeks.map((w) => w.label), tag).toEqual(['1. hafta', '2. hafta', '3. hafta', '4. hafta']);
          expect(road.weeks[1].title, tag).toBe('Odaklı çalışma düzeni');
          // 3. hafta: bölünmenin ortadan en uzak yanı (düşük yanları hariç; eşitlikte testteki sıra); üçü de düşükse ek deneme.
          const cand = SPLIT.filter((s) => g[s] !== 'low');
          const dist = (s: string) => Math.abs(Math.round(values[s] * 10) / 10 - 3);
          if (cand.length === 0) expect(road.weeks[2].title, tag).toBe('Odağını koru');
          else {
            const best = cand.reduce((m, s) => (dist(s) > dist(m) ? s : m));
            expect(road.weeks[2].title, tag).toBe(NAMES[SCALES.indexOf(best)]);
          }
          expect(road.study.links.map((l) => l.href), tag).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
          // Kısaca: bölünmenin yüksek yanları önce.
          const firstStandout = road.standout[0]?.keys?.[0];
          if (anyHigh) expect(SPLIT.filter((s) => g[s] === 'high'), tag).toContain(firstStandout);
          expect(road.approach !== null, tag).toBe(aud === 'parent');
          n++;
        }
      }
    }
    expect(n).toBe(3 ** 4 * 3 * 3);
  }, 300_000);

  it('birlikte yorum: tek giriş; kurallar yalnızca testin alanlarını anar; yetişkin metinleri okula özgü değil', () => {
    expect(ins.lead).toHaveLength(1);
    expect(ins.lead[0].when).toEqual({});
    for (const x of [...ins.lead, ...ins.rules]) {
      for (const k of [...Object.keys(x.when), ...Object.keys(x.not ?? {})]) expect(SCALES, k).toContain(k);
      expect(schoolWords(x.text.adult ?? x.text.student), x.text.student).toEqual([]);
      expect(x.text.parent, x.text.student).toMatch(/[Çç]ocuğunuz/);
      expect(x.text.student, x.text.student).not.toMatch(/[Çç]ocuğunuz/);
    }
    // Öğrenci metnindeki "öğrenciler" yetişkine "gençler" olur.
    const obs = ins.rules.find((x) => x.text.student.includes('gözlenen'))!;
    expect(obs.text.adult).toContain('gözlenen gençler');
  });

  it('kartlar öneri vermez; destek kutusu yok; yetişkin metni okula özgü değil', () => {
    for (const s of SCALES) {
      for (const lv of LEVELS) {
        const bt = tpl.scales[s][lv]!;
        expect(bt.summary, `${s} ${lv}`).not.toBe(LABEL[lv]);
        expect(bt.support, `${s} ${lv}`).toBeUndefined();
        expect(`${bt.student} ${bt.parent}`, `${s} ${lv}`).not.toMatch(/deneyin|deneyebilirsin|yapın|edin\.|sorun\.|koy\.|al\./u);
        expect(schoolWords(bt.adult ?? bt.student), `${s} ${lv}`).toEqual([]);
        expect(bt.parent, `${s} ${lv}`).toMatch(/^Çocuğunuz/);
        for (const x of [bt.student, bt.parent]) for (const sen of sentencesOf(x)) expect(words(sen), `${s} ${lv}: ${sen}`).toBeLessThanOrEqual(30);
      }
    }
  });

  it('PDF raporu üretilir (öğrenci, veli ve yetişkin)', async () => {
    const body = bodyFor({ notify: 4.5, switching: 2, pull: 3.5, control: 1.5 });
    const r = evaluate(SLUG, body);
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult] as SimpleReport[]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain(`/api/rapor/${SLUG}`);
    const mm = /TD_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(mm![1])).toEqual(d.items.map((i) => i.key));
    expect(yml).toContain('"value": (i * 3 + 1) % 5 + 1');
    // Gövdedeki cevaplar sırayla (3i + 1) mod 5 + 1: bildirimler 4,0 (yüksek), geçiş 2,3, dönme isteği 2,3 ve kendini durdurma
    // 2,2 (düşük).
    const r = evaluate(SLUG, likertBody(SLUG, 8, (i) => (i * 3 + 1) % 5));
    expect(r.student.chart?.type === 'rulers' ? r.student.chart.rows.map((x) => x.band) : []).toEqual(['Yüksek', 'Düşük', 'Düşük', 'Düşük']);
    expect(r.student.items[0].text.split('\n\n')).toHaveLength(3);
    expect(r.student.items[0].title).toBe('Birlikte bakınca');
    expect(r.student.items[0].text).toContain('Bildirimlerin çekimi puanın yüksek');
    expect(r.student.items[0].text).toContain('Kendini durdurma yollarını az kullandığını söylüyorsun');
    expect(r.student.support).toBeNull();
    expect(r.student.cautions).toEqual([]);
    const m = r.parent.roadmap!;
    expect([m.bars.length, m.approach!.items.length, m.settings, m.weeks[1].title, m.weeks[2].title, m.preview]).toEqual([
      4,
      4,
      null,
      'Odaklı çalışma düzeni',
      'Bildirimlerin çekimi',
      false,
    ]);
  });
});

describe('Ders Çalışırken Telefon ve Dikkat: yol haritası', () => {
  it('her alanda öneriler; veli metinleri çocuğu anlatır; yetişkine okula özgü sözcük yok; öneriler birbirini yinelemez', () => {
    const seen = new Map<string, string>();
    for (const s of SCALES) {
      for (const lv of LEVELS) {
        for (const part of ['study', 'action'] as const) {
          const x = rm.scales[s][part][lv];
          const at = `${s} ${part} ${lv}`;
          expect(x.parent, at).toMatch(/[Çç]ocuğunuz/);
          expect(x.student, at).not.toMatch(/[Çç]ocuğunuz/);
          expect(x.adult ?? x.student, at).not.toMatch(/(?<!\p{L})(ders|öğretmen|okul|sınıf|ödev|kitap|öğrenci|sınav)/iu);
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
    // Bir öneri bir alanda: sessize alıp toplu bakmak bildirimlerde, kısa çalışma parçaları geçişte, eğer-o zaman planı dönme
    // isteğinde.
    const text = (s: string) => JSON.stringify(rm.scales[s]);
    for (const s of SCALES.filter((x) => x !== 'notify')) expect(text(s), s).not.toMatch(/toplu olarak/);
    for (const s of SCALES.filter((x) => x !== 'switching')) expect(text(s), s).not.toMatch(/dakikalık parçalar/);
    for (const s of SCALES.filter((x) => x !== 'pull')) expect(text(s), s).not.toMatch(/şu olursa şunu yapacağım/);
    expect(rm.planningScale).toBe('control');
    expect(rm.unit).toEqual({ one: 'alan', toPlural: 'alanlara' });
    expect(rm.wellbeing).toBeUndefined();
    // Telefonu yasaklamak, elinden almak ya da vaat yok.
    expect(JSON.stringify(rm)).not.toMatch(/yasakla(?!\p{L})|elinden alın|cezalandır|notların yükselir|puanın yükselir|dikkatin artar|garanti/u);
  });

  it('kaynaklar: künyeler DOI bağlantılı', () => {
    expect(rm.sources.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    expect(rm.sources.map((c) => c.text.split(' ')[0])).toEqual(['Stothart,', 'Kushlev,', 'Fitz,', 'Rosen,', 'May,', 'Duckworth,', 'Gollwitzer,']);
  });
});

describe('Ders Çalışırken Telefon ve Dikkat: yayın', () => {
  it('pilot olarak yayında: listelerde ve site haritasında; yol haritası var; test seçiciyle bağlı', () => {
    expect(d.status).toBe('pilot');
    expect(d.licenseStatus).toBe('original');
    expect(d.domain).toBe('academic');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    const slot = SECICI_GOALS.find((g) => g.key === 'calisma')!.slots.find((s) => s.candidates.includes(SLUG));
    expect(slot?.skill).toBe('Telefon ve dikkat');
  });

  it('kaynaklar: künyeler DOI bağlantılı ve bilim kartında anılıyor', () => {
    const cites = d.science.citations;
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    expect(new Set(cites.map((c) => c.url)).size).toBe(cites.length);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const c of cites) {
      const author = c.text.split(/[,(]/)[0].trim();
      const year = /\((\d{4})\)/.exec(c.text)![1];
      expect(body, c.text).toContain(author);
      expect(body, c.text).toContain(year);
    }
    // Sınırlılık: test başarıyı ölçmez; tanı koymaz; bağımlılık ölçeği değildir.
    expect(d.science.limitations.join(' ')).toContain('çalışma başarısını ölçmez');
    expect(d.science.limitations.join(' ')).toContain('Tanı koymaz');
    expect(d.science.limitations.join(' ')).toContain('Bir bağımlılık ölçeği değildir');
  });
});
