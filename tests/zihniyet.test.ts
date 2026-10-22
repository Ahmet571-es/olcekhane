import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { zihniyet } from '@/content/instruments/zihniyet';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { InsightRule, LevelGroup } from '@/content/reports/types';
import { ROADMAPS, hasPublicRoadmap } from '@/content/roadmaps';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { anchoredBand, likertQuality, scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'zihniyet';
const d = zihniyet;
const SCALES = ['intelligence', 'effort', 'failure', 'challenge'];
const NAMES = ['Zekâya bakış', 'Çabaya bakış', 'Hataya bakış', 'Zorluğa yaklaşım'];
const tpl = REPORT_TEMPLATES[SLUG];
const ins = tpl.insight!;
type Aud = 'student' | 'parent' | 'adult';
const LABEL: Record<LevelGroup, string> = { low: 'Düşük', average: 'Orta', high: 'Yüksek' };
const level = (v: number): LevelGroup => (Math.round(v * 10) / 10 >= 3.5 ? 'high' : Math.round(v * 10) / 10 >= 2.5 ? 'average' : 'low');

/** Alan → ortalama (gelişim yönünde; altı maddenin toplamı tam sayı): ters maddelerde değer çevrilir. */
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

function expectedInsight(values: Record<string, number>, aud: Aud): string {
  const fit = (when: InsightRule['when']) => Object.entries(when).every(([k, gs]) => gs.includes(level(values[k])));
  const fits = (rule: InsightRule) => fit(rule.when) && !(rule.not && fit(rule.not));
  const pick = (rule: InsightRule) => (aud === 'parent' ? rule.text.parent : aud === 'adult' ? (rule.text.adult ?? rule.text.student) : rule.text.student);
  return [pick(ins.lead.find(fits)!), ...ins.rules.filter(fits).map(pick)].join('\n\n');
}

function strings(x: unknown): string[] {
  if (typeof x === 'string') return [x];
  if (Array.isArray(x)) return x.flatMap(strings);
  if (x && typeof x === 'object') return Object.values(x).flatMap(strings);
  return [];
}

describe('Zihniyet: maddeler', () => {
  it('24 özgün madde; her alanda altı, üçü ters yönlü; alanlar sırayla döner; beş karşıt çift', () => {
    expect(d.items).toHaveLength(24);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    d.items.forEach((it, i) => {
      expect(it.scale, it.key).toBe(SCALES[i % 4]);
      expect(it.source, it.key).toBeUndefined();
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
      expect(it.text.length, it.key).toBeLessThanOrEqual(90);
    });
    for (const s of SCALES) {
      expect(d.items.filter((i) => i.scale === s), s).toHaveLength(6);
      expect(d.items.filter((i) => i.scale === s && i.reverse), s).toHaveLength(3);
    }
    expect(new Set(d.items.map((i) => i.text)).size).toBe(24);
    expect(d.oppositePairs).toHaveLength(5);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.scale, x).toBe(b.scale);
      expect([!!a.reverse, !!b.reverse], x).toEqual([false, true]);
    }
    // Adında "tanı" yok; zekâ puanı vaadi yok.
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(JSON.stringify(d)).not.toMatch(/\bIQ\b|zekâ puanı/);
  });

  it('yetişkinlere de açık: yönerge, soru ve maddeler okula özgü değil; 5. sınıftan itibaren', () => {
    expect(d.adults).toBe(true);
    expect([d.minGrade, d.maxGrade]).toEqual([5, 13]);
    for (const x of [d.intro.title, ...d.intro.paragraphs, d.prompt, ...d.items.map((i) => i.text)]) expect(schoolWords(x), x).toEqual([]);
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
  });
});

describe('Zihniyet: puanlama', () => {
  it('ters maddeler çevrilir; düzeyler bir ondalıklı ortalamaya göre', () => {
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('low');
    expect(anchoredBand(2.5, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.5, d.anchoredBands)).toBe('high');
    const scores = scoreLikert(d, bodyFor({ intelligence: 4.5, effort: 2, failure: 3, challenge: 1 }).data.answers);
    expect(scores.map((s) => [s.scaleKey, s.value, s.band])).toEqual([
      ['intelligence', 4.5, 'high'],
      ['effort', 2, 'low'],
      ['failure', 3, 'average'],
      ['challenge', 1, 'low'],
    ]);
  });

  it('evet deme eğilimi: her cümleye "Katılıyorum" ya da "Tamamen katılıyorum" diyen kişiye uyarı', () => {
    const yes = Object.fromEntries(d.items.map((it, i) => [it.key, { value: 4 + (i % 2), rtMs: 2500 }]));
    expect(likertQuality(d, yes).oppositeAgree).toBeGreaterThanOrEqual(3);
    const r = evaluate(SLUG, { grade: 9, data: { engine: 'likert', answers: yes } });
    expect(r.student.cautions.some((c) => c.includes('“Katılıyorum” ya da “Tamamen katılıyorum” denmiş'))).toBe(true);
    // Tutarlı bir gelişim zihniyetinde uyarı yok.
    expect(likertQuality(d, bodyFor({ intelligence: 5, effort: 5, failure: 5, challenge: 5 }).data.answers).oppositeAgree).toBe(0);
  });
});

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

describe('Zihniyet: rapor', () => {
  const VALUES: Record<LevelGroup, number[]> = { low: [1, 2], average: [3], high: [4, 5] };

  it('bütün düzey birleşimlerinde öğrenci, veli ve yetişkin raporu eksiksiz ve tutarlı', () => {
    const levels: LevelGroup[] = ['low', 'average', 'high'];
    let n = 0;
    for (let k = 0; k < 3 ** 4; k++) {
      const combo = SCALES.map((_, i) => levels[Math.floor(k / 3 ** i) % 3]);
      const values = Object.fromEntries(SCALES.map((s, i) => [s, VALUES[combo[i]][(k + i) % VALUES[combo[i]].length]]));
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
        // Anlam denetimi.
        const txt = rep.items[0].text;
        const [zk, cb, ht, zr] = combo;
        expect(txt.includes(aud === 'adult' ? 'Bir not: zihniyet tek başına belirleyici değildir' : 'Bir not: zihniyet başarının küçük bir parçasıdır'), tag).toBe(true);
        expect(txt.includes('birbiriyle pek uyuşmuyor'), tag).toBe(zk === 'high' && cb === 'low');
        // Birlikte yorum kartlardaki cümleleri tekrar etmez: yalnızca hangi alanın düşük olduğunu söyler.
        expect(txt.includes('Ancak çabaya bakış puan'), tag).toBe(zk === 'high' && cb === 'low');
        expect(txt.includes('Öte yandan hataya bakış puan'), tag).toBe(zk === 'high' && ht === 'low');
        expect(txt.includes('Buna karşın zorluğa yaklaşım puan'), tag).toBe(zk === 'high' && zr === 'low');
        expect(txt, tag).not.toMatch(/geri götüren şeyler olarak|yeteneksizlik işareti gibi|kaçınma eğilim/);
        // Kısa bir çevrim içi çalışmanın notları yükselttiği söylenmez (okuyanın notlarının düşük olduğunu ima ederdi).
        expect(txt, tag).not.toMatch(/notları düşük|çevrim içi/);
        expect(/[Dd]ört alanda da/.test(txt), tag).toBe(combo.every((x) => x === 'high'));
        const anyHigh = [cb, ht, zr].includes('high');
        expect(txt.includes('gelişime açık bir bakış'), tag).toBe(zk === 'low' && anyHigh);
        expect(txt.includes('Bende bu yetenek yok'), tag).toBe(zk === 'low' && !anyHigh);
        expect(txt.includes('örtüşüyor ya da ona yakın'), tag).toBe(zk === 'high' && ![cb, ht, zr].includes('low') && !combo.every((x) => x === 'high'));
        expect(txt.includes('bu üç alandaki'), tag).toBe(zk === 'average' && [cb, ht, zr].every((x) => x === 'high'));
        expect(txt.includes('düşük çıkanlarda sabitlik yönünde'), tag).toBe(zk === 'average' && [cb, ht, zr].includes('low'));
        // Aynı bulgu bir raporda bir kez anılır.
        const all = rep.items.map((i) => i.text).join(' ');
        expect(all.split('başarısız olunan anlarda görülüyor').length - 1, tag).toBeLessThanOrEqual(1);
        expect(all.split('anne babanın hatalara bakış').length - 1, tag).toBeLessThanOrEqual(1);
        // Aynı sayfada bir cümle iki kez geçmez (kartlar, birlikte yorum ve yol haritası).
        const sentences = pageTexts(rep).flatMap((x) => x.split(/(?<=[.!?])\s+/)).map((x) => x.trim()).filter((x) => x.length > 25);
        expect(sentences.filter((x, i) => sentences.indexOf(x) !== i), tag).toEqual([]);
        expect(rep.cautions.filter((x) => !x.includes('hep aynı seçenek')), tag).toEqual([]);
        expect(rep.support, tag).toBeNull();
        if (aud !== 'parent') expect(JSON.stringify(rep), tag).not.toMatch(/[Çç]ocuğunuz/);
        if (aud === 'adult') {
          const { roadmap, ...rest } = rep;
          void roadmap;
          expect(schoolWords(JSON.stringify(rest)), tag).toEqual([]);
        }
        for (const x of strings(rep)) expect(x.replaceAll('\n\n', ' '), tag).not.toMatch(/undefined|null|\s{2}|\n|\{/);
        const rm = rep.roadmap!;
        expect(rm.bars.map((b) => b.key), tag).toEqual(SCALES);
        expect(rm.settings, tag).toBeNull();
        expect(rm.weeks[1].title, tag).toBe('Hatadan öğrenmek');
        const others = SCALES.filter((s) => s !== 'failure');
        const lowest = others.reduce((m, s) => (values[s] < values[m] ? s : m));
        expect(rm.weeks[2].title, tag).toBe(NAMES[SCALES.indexOf(lowest)]);
        expect(rm.approach !== null, tag).toBe(aud === 'parent');
        n++;
      }
    }
    expect(n).toBe(3 ** 4 * 3);
  }, 180_000);

  it('birlikte yorum: her düzeyde tek giriş; kurallar yalnızca testin alanlarını anar; yetişkin metinleri okula özgü değil', () => {
    expect(ins.lead.map((x) => x.when.intelligence)).toEqual([['low'], ['average'], ['high']]);
    for (const x of [...ins.lead, ...ins.rules]) {
      for (const k of [...Object.keys(x.when), ...Object.keys(x.not ?? {})]) expect(SCALES, k).toContain(k);
      expect(schoolWords(x.text.adult ?? x.text.student), x.text.student).toEqual([]);
    }
    // Yetişkine: zihniyetle akademik başarı ilişkisinin erişkinlerde neredeyse olmadığı söylenir.
    expect(ins.rules.at(-1)!.text.adult).toContain('erişkinlerde ise neredeyse yok');
  });

  it('PDF raporu üretilir (öğrenci, veli ve yetişkin)', async () => {
    const body = bodyFor({ intelligence: 4.5, effort: 2, failure: 2.5, challenge: 1.5 });
    const r = evaluate(SLUG, body);
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult] as SimpleReport[]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/zihniyet');
    const mm = /ZH_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(mm![1])).toEqual(d.items.map((i) => i.key));
    // Gövdedeki cevaplar sırayla 1, 2, 3, 4, 5, …: zekâ 3,3 (orta), çaba 3,5, hata 2,7, zorluk 3,5.
    const r = evaluate(SLUG, likertBody(SLUG, 8, (i) => i % 5));
    expect(r.student.items[0].title).toBe('Birlikte bakınca');
    expect(r.student.items[0].text).toContain('Zekâya bakış puanın orta');
    const rm = r.parent.roadmap!;
    expect([rm.bars.length, rm.approach!.items.length, rm.settings, rm.weeks[1].title, rm.weeks[2].title, rm.preview]).toEqual([
      4,
      4,
      null,
      'Hatadan öğrenmek',
      'Zekâya bakış',
      false,
    ]);
  });
});

describe('Zihniyet: 2026-10-22 incelemesi', () => {
  const rm = ROADMAPS[SLUG];

  it('kartlar öneri vermez; veliye yaklaşım önerileri ve çalışma kartları kartları ve birbirini tekrar etmez', () => {
    const levels = ['low', 'average', 'high'] as const;
    for (const s of SCALES) {
      for (const g of levels) {
        const bt = tpl.scales[s][g]!;
        const approach = rm.approach![s][g];
        for (const part of approach.split(/[;:]\s*/)) expect(bt.parent, `${s} ${g}`).not.toContain(part.replace(/[.”“]/g, '').trim());
        // Rapordaki veli kartında "takdir edin", "tepki vermeniz", "fark ettiğinizi söylemek" gibi öneri yok.
        expect(bt.parent, `${s} ${g}`).not.toMatch(/takdir et|tepki vermeniz|fark ettiğinizi söyle|yaklaşmak bu yüzden|birlikte bakabilirsiniz/);
        expect(`${bt.student} ${bt.adult ?? ''}`, `${s} ${g}`).not.toMatch(/“Bu bana ne öğretti\?”|hatırlamak, bu düşünceyi sınamana/);
        // Yetişkin metni yalnızca öğrenci metninden farklıysa yazılır.
        if (bt.adult) expect(bt.adult, `${s} ${g}`).not.toBe(bt.student);
      }
    }
    // "Bundan ne öğrendin?" veli sayfasında yalnızca 2. haftada.
    expect(rm.scales.failure.study.low.parent).not.toContain('Bundan ne öğrendin');
    expect(rm.approach!.failure.low).not.toContain('Bundan ne öğrendin');
    expect(tpl.scales.failure.low!.parent).not.toContain('Bundan ne öğrendin');
    // Zekâya bakış düşükken: çalışma kartı kişinin kendi örneği, 3. hafta düşünceyi yeniden yazmak, veliye yaklaşım anne babanın örneği.
    expect(rm.scales.intelligence.action.low.student).toContain('“Henüz öğrenmedim” diye yeniden yaz');
    expect(rm.approach!.intelligence.low).toContain('Kendi hayatınızdan');
    // Blackwell bulgusu bir raporda bir kez (Zekâya bakış düşük kartında); "Bir not" her raporda zihniyetin küçük etkisini söyler.
    expect(JSON.stringify(tpl.scales.effort)).not.toContain('Bir araştırmada');
    expect(tpl.scales.intelligence.low!.student).not.toContain('tek ya da en önemli belirleyicisi');
  });

  it('yol haritası alanlarla anlatılır; genel bakış ters cümleleri örnekle açıklar; norm notu', () => {
    expect(rm.unit).toEqual({ one: 'alan', toPlural: 'alanlara' });
    expect(rm.balancedNote!.student).toContain('Dört alanda da puanın ortada');
    expect(rm.balancedNote!.parent).toContain('Çocuğunuzun dört alanda da puanı ortada');
    expect(tpl.overview!.student).toContain('gibi cümlelere katılmamak puanı yükseltir');
    expect(tpl.overview!.student).not.toContain('ters çevrilerek');
    expect(d.items.some((i) => i.reverse && i.text === 'Zekâ boy gibidir: çalışarak artırılamaz.')).toBe(true);
    expect(d.science.normNote).toContain('karşılaştırma çalışması (norm)');
    expect(d.science.normNote).not.toMatch(/akran/);
  });
});

describe('Zihniyet: yayın', () => {
  it('pilot olarak yayında: listelerde ve site haritasında; yol haritası var', () => {
    expect(d.status).toBe('pilot');
    expect(d.licenseStatus).toBe('original');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(hasPublicRoadmap(SLUG)).toBe(true);
  });

  it('kaynaklar: künyeler DOI bağlantılı ve bilim kartında anılıyor; zihniyetin küçük etkisi açıkça söyleniyor', () => {
    const cites = d.science.citations;
    expect(cites).toHaveLength(6);
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['Burnette ve ark., 2013', 'Blackwell, Trzesniewski ve Dweck, 2007', 'Haimovitz ve Dweck, 2016', 'Sisk ve ark., 2018', 'Burgoyne, Hambrick ve Macnamara, 2020', 'Yeager ve ark., 2019']) {
      expect(body, a).toContain(a);
    }
    expect(d.science.limitations.join(' ')).toContain('r = .10');
  });
});
