import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { ertelemeZamanYonetimi } from '@/content/instruments/erteleme-zaman-yonetimi';
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

const SLUG = 'erteleme-ve-zaman-yonetimi';
const d = ertelemeZamanYonetimi;
const SCALES = ['start', 'planning', 'estimation', 'focus', 'control'];
const NAMES = ['Ertelemeden başlama', 'Planlama ve öncelik', 'Süreyi tahmin etme', 'Odağı koruma', 'Zamanın kontrolü'];
/** Uygulama sırasında alanların dönüşü. */
const ORDER = ['start', 'planning', 'focus', 'estimation', 'control'];
const tpl = REPORT_TEMPLATES[SLUG];
const ins = tpl.insight!;
type Aud = 'student' | 'parent' | 'adult';
const LABEL: Record<LevelGroup, string> = { low: 'Düşük', average: 'Orta', high: 'Yüksek' };
const level = (v: number): LevelGroup => (Math.round(v * 10) / 10 >= 3.5 ? 'high' : Math.round(v * 10) / 10 >= 2.5 ? 'average' : 'low');

/** Alan → ortalama (beceri yönünde, bir ondalıklı; beş maddenin toplamı tam sayı): ters maddelerde değer çevrilir. */
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

/** Beklenen birlikte yorum: ilk uyan giriş ve uyan bütün ek cümleler. */
function expectedInsight(values: Record<string, number>, aud: Aud): string {
  const fit = (when: InsightRule['when']) => Object.entries(when).every(([k, gs]) => gs.includes(level(values[k])));
  const fits = (rule: InsightRule) => fit(rule.when) && !(rule.not && fit(rule.not));
  const pick = (rule: InsightRule) => (aud === 'parent' ? rule.text.parent : aud === 'adult' ? (rule.text.adult ?? rule.text.student) : rule.text.student);
  const lead = ins.lead.find(fits)!;
  return [pick(lead), ...ins.rules.filter(fits).map(pick)].join('\n\n');
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

function strings(x: unknown): string[] {
  if (typeof x === 'string') return [x];
  if (Array.isArray(x)) return x.flatMap(strings);
  if (x && typeof x === 'object') return Object.values(x).flatMap(strings);
  return [];
}

describe('Erteleme ve zaman yönetimi: maddeler', () => {
  it('25 özgün madde; her alanda beş, alanlar sırayla döner; ters madde sayıları; beş karşıt çift', () => {
    expect(d.items).toHaveLength(25);
    expect(d.scales.map((s) => s.key)).toEqual(SCALES);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    d.items.forEach((it, i) => {
      expect(it.scale, it.key).toBe(ORDER[i % 5]);
      expect(it.source, it.key).toBeUndefined();
      expect(it.text, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
      expect(it.text.length, it.key).toBeLessThanOrEqual(100);
    });
    const rev = Object.fromEntries(SCALES.map((s) => [s, d.items.filter((i) => i.scale === s && i.reverse).length]));
    // Her alanda ters madde; toplamda 25 maddenin 11'i (evet deme eğilimi tek yöne yığılmasın).
    expect(rev).toEqual({ start: 3, planning: 1, estimation: 2, focus: 3, control: 2 });
    expect(new Set(d.items.map((i) => i.text)).size).toBe(25);
    expect(new Set(d.items.map((i) => i.key)).size).toBe(25);
    // Karşıt çiftler: aynı alanda, biri düz biri ters; her alanda bir çift.
    expect(d.oppositePairs).toHaveLength(5);
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.scale, x).toBe(b.scale);
      expect([!!a.reverse, !!b.reverse], x).toEqual([false, true]);
    }
    expect(new Set(d.oppositePairs!.map(([x]) => d.items.find((i) => i.key === x)!.scale)).size).toBe(5);
  });

  it('yetişkinlere de açık: yönerge ve soru okula özgü değil; 6. sınıftan itibaren', () => {
    expect(d.adults).toBe(true);
    expect([d.minGrade, d.maxGrade]).toEqual([6, 13]);
    for (const x of [d.intro.title, ...d.intro.paragraphs, d.prompt, ...d.items.map((i) => i.text)]) expect(schoolWords(x), x).toEqual([]);
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
  });
});

describe('Erteleme ve zaman yönetimi: puanlama', () => {
  it('ters maddeler çevrilir; düzeyler bir ondalıklı ortalamaya göre (2,4 düşük, 2,5 orta, 3,5 yüksek)', () => {
    expect(anchoredBand(2.4, d.anchoredBands)).toBe('low');
    expect(anchoredBand(2.5, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.4, d.anchoredBands)).toBe('average');
    expect(anchoredBand(3.5, d.anchoredBands)).toBe('high');
    const scores = scoreLikert(d, bodyFor({ start: 4.2, planning: 1.6, estimation: 3, focus: 2.4, control: 5 }).data.answers);
    expect(scores.map((s) => [s.scaleKey, s.value, s.band])).toEqual([
      ['start', 4.2, 'high'],
      ['planning', 1.6, 'low'],
      ['estimation', 3, 'average'],
      ['focus', 2.4, 'low'],
      ['control', 5, 'high'],
    ]);
  });

  it('her cümleye aynı uç cevap: uzun aynı cevap dizisi ve karşıt çiftlerde evet/hayır deme eğilimi uyarısı', () => {
    for (const v of [1, 5]) {
      const all = Object.fromEntries(d.items.map((i) => [i.key, { value: v, rtMs: 2500 }]));
      const q = likertQuality(d, all);
      expect(q.straightLining).toBe(true);
      expect(v === 5 ? q.oppositeAgree : q.oppositeDisagree).toBe(5);
      const r = evaluate(SLUG, { grade: 8, data: { engine: 'likert', answers: all } });
      expect(r.student.cautions.some((c) => c.includes(v === 5 ? '“Sık sık” ya da “Her zaman” denmiş' : '“Hiçbir zaman” ya da “Nadiren” denmiş'))).toBe(true);
    }
  });

  it('evet deme eğilimi: her cümleye "Sık sık" ya da "Her zaman" diyen kişiye uyarı; erteleme düşük görünmez', () => {
    // Uzun aynı cevap dizisi olmadan (4, 5, 4, 5, …): karşıt çiftlerin en az üçünde iki cümleye de katılma.
    const yes = Object.fromEntries(d.items.map((it, i) => [it.key, { value: 4 + (i % 2), rtMs: 2500 }]));
    const q = likertQuality(d, yes);
    expect(q.straightLining).toBe(false);
    expect(q.oppositeAgree).toBeGreaterThanOrEqual(3);
    const r = evaluate(SLUG, { grade: 8, data: { engine: 'likert', answers: yes } });
    expect(r.student.cautions.some((c) => c.includes('çoğuna “evet” deme eğiliminden'))).toBe(true);
    expect(r.parent.cautions.some((c) => c.includes('çoğuna “evet” deme eğiliminden'))).toBe(true);
    // Ters maddeler dengeli olduğu için evet diyen biri "sık sık erteleyen" diye yorumlanmaz.
    expect(r.student.items[1].badge).not.toContain('Düşük');
    // Ölçülü cevaplarda (karşıt çiftlerden yalnızca birine katılma) uyarı yok.
    const ok = bodyFor({ start: 4, planning: 4, estimation: 4, focus: 4, control: 4 }).data.answers;
    expect(likertQuality(d, ok).oppositeAgree).toBe(0);
  });
});

describe('Erteleme ve zaman yönetimi: rapor', () => {
  const VALUES: Record<LevelGroup, number[]> = { low: [1, 2], average: [3], high: [4, 5] };

  it('bütün düzey birleşimlerinde öğrenci, veli ve yetişkin raporu eksiksiz ve tutarlı: birlikte yorum, alanlar, yol haritası', () => {
    const levels: LevelGroup[] = ['low', 'average', 'high'];
    let n = 0;
    for (let k = 0; k < 3 ** 5; k++) {
      const combo = SCALES.map((_, i) => levels[Math.floor(k / 3 ** i) % 3]);
      const values = Object.fromEntries(SCALES.map((s, i) => [s, VALUES[combo[i]][(k + i) % VALUES[combo[i]].length]]));
      const r = evaluate(SLUG, bodyFor(values, 6 + (k % 8)));
      const adult = evaluateAdult(SLUG, bodyFor(values, ADULT_GRADE)).adult;
      for (const [aud, rep] of [
        ['student', r.student],
        ['parent', r.parent],
        ['adult', adult],
      ] as const) {
        const tag = `${combo.join('/')} ${aud}`;
        // Grafik: beş cetvel, açıklama şablondan.
        expect(rep.chart?.type, tag).toBe('rulers');
        expect(rep.chart?.type === 'rulers' ? rep.chart.rows.map((x) => x.label) : [], tag).toEqual(NAMES);
        expect(rep.chartNote, tag).toBe(aud === 'parent' ? tpl.overview!.parent : tpl.overview!.student);
        // Birlikte yorum ilk madde; ardından alanlar.
        expect(rep.itemsTitle, tag).toBe(aud === 'parent' ? 'Sonuçlar' : 'Sonuçların');
        expect(rep.items.map((i) => i.title), tag).toEqual(['Birlikte bakınca', ...NAMES]);
        expect(rep.items[0].text, tag).toBe(expectedInsight(values, aud));
        SCALES.forEach((s, i) => {
          const bt = tpl.scales[s][combo[i]]!;
          expect(rep.items[i + 1].badge, tag).toContain(LABEL[combo[i]]);
          expect(rep.items[i + 1].text, tag).toBe(aud === 'parent' ? bt.parent : aud === 'adult' ? (bt.adult ?? bt.student) : bt.student);
        });
        // Anlam denetimi: birlikte yorum alanların düzeyleriyle çelişmez.
        const txt = rep.items[0].text;
        const [st, pl, es, fo, co] = combo;
        if (st === 'low' && pl === 'high') expect(txt, tag).toContain('Niyet ile eylem');
        if (st === 'high') expect(txt, tag).not.toMatch(/erteliyorsun|erteliyor\b|ertelenen|Bunlara ek olarak/);
        expect(txt.includes('Odağı koruma puan'), tag).toBe(fo === 'low' && st !== 'high');
        expect(txt.includes('Süreyi tahmin etme puan'), tag).toBe(es === 'low' && st !== 'high');
        expect(txt.includes('Planlama puan'), tag).toBe(pl === 'low' && st !== 'high');
        expect(txt.includes('kendinde olmadığını') || txt.includes('sende olmadığını'), tag).toBe(co === 'low');
        expect(txt.includes('güçlü görünüyor'), tag).toBe(st === 'high' && pl === 'high' && co === 'high' && es !== 'low' && fo !== 'low');
        // Ertelemesi düşük ya da orta olana her zaman bir açıklama: başka bir alan düşük değilse işin kendisi, düşükse o alan.
        const none = pl !== 'low' && es !== 'low' && fo !== 'low';
        expect(txt.includes('belirgin bir güçlük görünmüyor'), tag).toBe(st !== 'high' && none);
        expect(txt.includes('Bunlara ek olarak'), tag).toBe(st === 'low' && !none);
        if (st !== 'high') expect(txt.split('\n\n').length, tag).toBeGreaterThanOrEqual(2);
        // Uyarı yok (uzun aynı cevap dizisi olağandır); destek kutusu yok.
        expect(rep.cautions.filter((x) => !x.includes('hep aynı seçenek')), tag).toEqual([]);
        expect(rep.support, tag).toBeNull();
        if (aud !== 'parent') expect(JSON.stringify(rep), tag).not.toMatch(/[Çç]ocuğunuz/);
        if (aud === 'adult') {
          const { roadmap, ...rest } = rep;
          void roadmap;
          expect(schoolWords(JSON.stringify(rest)), tag).toEqual([]);
        }
        for (const x of strings(rep)) expect(x.replaceAll('\n\n', ' '), tag).not.toMatch(/undefined|null|\s{2}|\n|\{|tembelsin/);
        // Aynı sayfada bir cümle iki kez geçmez (birlikte yorum, kartlar ve yol haritası).
        const sentences = pageTexts(rep).flatMap((x) => x.split(/(?<=[.!?])\s+/)).map((x) => x.trim()).filter((x) => x.length > 25);
        expect(sentences.filter((x, i) => sentences.indexOf(x) !== i), tag).toEqual([]);
        // Yol haritası: beş alan; 2. hafta planlama; 3. hafta zamanın kontrolü düşükse o, değilse en düşük alan.
        const rm = rep.roadmap!;
        expect(rm.bars.map((b) => b.key), tag).toEqual(SCALES);
        expect(rm.settings, tag).toBeNull();
        expect(rm.weeks[1].title, tag).toBe('Planlama');
        if (combo[4] === 'low') expect(rm.weeks[2].title, tag).toBe('Zamanın kontrolü');
        else {
          const others = SCALES.filter((s) => s !== 'planning');
          const lowest = others.reduce((m, s) => (values[s] < values[m] ? s : m));
          expect(rm.weeks[2].title, tag).toBe(NAMES[SCALES.indexOf(lowest)]);
        }
        expect(rm.approach !== null, tag).toBe(aud === 'parent');
        n++;
      }
    }
    expect(n).toBe(3 ** 5 * 3);
  }, 180_000);

  it('birlikte yorum: her düzeyde tek giriş; kurallar yalnızca testin alanlarını anar; karşıt kurallar aynı anda uymaz', () => {
    expect(ins.lead.map((x) => x.when.start)).toEqual([['low'], ['average'], ['high']]);
    for (const x of [...ins.lead, ...ins.rules]) {
      for (const k of [...Object.keys(x.when), ...Object.keys(x.not ?? {})]) expect(SCALES, k).toContain(k);
    }
    const gap = ins.rules.find((x) => x.text.student.startsWith('Plan yapıyorsun'))!;
    const noPlan = ins.rules.find((x) => x.text.student.startsWith('Planlama puanın düşük'))!;
    expect(gap.when).toEqual({ start: ['low'], planning: ['high'] });
    expect(noPlan.when).toEqual({ start: ['low', 'average'], planning: ['low'] });
    // Yetişkine giden birlikte yorum metinlerinde okula özgü sözcük yok.
    for (const x of [...ins.lead, ...ins.rules]) expect(schoolWords(x.text.adult ?? x.text.student), x.text.student).toEqual([]);
  });

  it('PDF raporu üretilir (öğrenci, veli ve yetişkin)', async () => {
    const body = bodyFor({ start: 1.6, planning: 4.2, estimation: 2, focus: 1.4, control: 2.2 });
    const r = evaluate(SLUG, body);
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult] as SimpleReport[]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar beklenen raporu verir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/erteleme-ve-zaman-yonetimi');
    const mm = /EZ_GOVDE=.*?k=(\[[^\]]+\])/.exec(yml);
    expect(JSON.parse(mm![1])).toEqual(d.items.map((i) => i.key));
    // Gövdedeki cevaplar sırayla 1, 2, 3, 4, 5, …: başlama 3,4 (orta), planlama 2,4 (düşük), odak 3,0, süre 3,2, kontrol 3,4.
    const r = evaluate(SLUG, likertBody(SLUG, 8, (i) => i % 5));
    expect(r.student.items.map((i) => i.title)[0]).toBe('Birlikte bakınca');
    expect(r.student.items[0].text).toContain('Planlama puanın düşük');
    const rm = r.parent.roadmap!;
    expect([rm.bars.length, rm.approach!.items.length, rm.settings, rm.weeks[1].title, rm.weeks[2].title, rm.preview]).toEqual([
      5,
      5,
      null,
      'Planlama',
      'Odağı koruma',
      false,
    ]);
  });
});

describe('Erteleme ve zaman yönetimi: yayın', () => {
  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; yol haritası var', () => {
    expect(d.status).toBe('pilot');
    expect(d.licenseStatus).toBe('original');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(ROADMAPS[SLUG].wellbeing).toEqual({ scale: 'control', group: 'low', link: null });
  });

  it('kaynaklar: künyeler DOI bağlantılı ve bilim kartında anılıyor', () => {
    const cites = d.science.citations;
    expect(cites).toHaveLength(6);
    expect(cites.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['Steel, 2007', 'Macan ve ark., 1990', 'Buehler, Griffin ve Ross, 1994', 'Gollwitzer ve Sheeran, 2006', 'Aeon, Faber ve Panaccio, 2021', 'Sirois ve Pychyl, 2013']) {
      expect(body, a).toContain(a);
    }
  });
});

describe('Erteleme ve zaman yönetimi: 2026-10-22 incelemesi', () => {
  const rm = ROADMAPS[SLUG];
  const levels = ['low', 'average', 'high'] as const;

  it('kartlar yol haritasındaki öneriyi tekrar etmez; veliye yaklaşım kartları, çalışma kartlarını ve haftaları tekrar etmez', () => {
    for (const s of SCALES) {
      for (const g of levels) {
        const bt = tpl.scales[s][g]!;
        const cards = `${bt.student} ${bt.parent} ${bt.adult ?? ''}`;
        expect(cards, `${s} ${g}`).not.toMatch(/Planın uzun olması gerekmez|telefonu başka bir odaya|telefonun başka bir odada|İşleri (birlikte )?yazıya dökmek|Benzer işlerin daha önce ne kadar sürdüğünü hesaba katmak|Geçen sefer benzer/);
        const approach = rm.approach![s][g];
        const same = [bt.parent, rm.scales[s].study[g].parent, rm.scales[s].action[g].parent];
        for (const part of approach.split(/;\s*/)) for (const x of same) expect(x, `${s} ${g}`).not.toContain(part.replace(/\.$/, ''));
      }
    }
    // Giriş kartı tekrar etmez; düşük düzeyde suçlamaz.
    expect(ins.lead[1].text.student).toBe('Ertelemeden başlama puanın orta.');
    expect(ins.lead[1].text.parent).toBe('Çocuğunuzun ertelemeden başlama puanı orta.');
    for (const x of [ins.lead[0].text.student, ins.lead[0].text.parent]) {
      expect(x).not.toMatch(/bedel|ödersin|öder\b/);
      expect(x).toContain('bu kaçış ise çoğu zaman sonradan sıkışmaya ve daha kötü hissetmeye yol açar');
    }
    const focusRule = ins.rules.find((x) => x.when.focus?.includes('low'))!;
    expect(focusRule.text.student).toContain('araştırmalarda ertelemeyle en güçlü ilişkili özelliklerden biri; bu yüzden Odağı koruma bölümündeki öneriyle başlamak');
    // Süre tahmini: kaynaktaki çalışma bitirme tezi yazan öğrencilerle yapıldı (%29,7); yetişkine "öğrenci" denmez.
    const es = tpl.scales.estimation.low!;
    expect(es.student).toContain('bitirme tezi yazan üniversite öğrencilerinin üçte birinden azı');
    expect(es.adult).toContain('bitirme tezi yazan kişilerin üçte birinden azı');
    expect(schoolWords(es.adult!)).toEqual([]);
    expect(tpl.scales.planning.high!.student).toContain('hem başarıyla hem de (biraz daha güçlü biçimde) kendini iyi hissetmeyle');
    expect(tpl.scales.control.low!.parent).toContain('okulun rehberlik servisinden (psikolojik danışman)');
    // Zamanın kontrolü düşükken 3. hafta dinlenmeye ayrılır; çalışma kartındaki "en önemli tek iş" önerisi tekrar edilmez.
    expect(rm.scales.control.action.low.student).toContain('20 dakikalık');
    expect(rm.scales.control.action.low.student).not.toContain('en önemli tek iş');
  });

  it('yol haritası alanlarla anlatılır; dengeli profil cümlesi ve norm notu', () => {
    expect(rm.unit).toEqual({ one: 'alan', toPlural: 'alanlara' });
    // Her alanda ortalama 3 (beceri yönünde): birbirinin tersi olan çiftlere 3, öteki üç cümleye 2, 4 ve 3; uyarı yok.
    const paired = new Set(d.oppositePairs!.flat());
    const answers = Object.fromEntries(
      SCALES.flatMap((sc) => {
        let k = 0;
        return d.items
          .filter((it) => it.scale === sc)
          .map((it) => {
            const v = paired.has(it.key) ? 3 : [2, 4, 3][k++];
            return [it.key, { value: it.reverse ? 6 - v : v, rtMs: 2500 }];
          });
      }),
    );
    const r = evaluate(SLUG, { grade: 8, data: { engine: 'likert', answers } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.map((x) => x.band)).toEqual(['Orta', 'Orta', 'Orta', 'Orta', 'Orta']);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.roadmap!.standoutNote).toBe(rm.balancedNote!.student);
    expect(r.parent.roadmap!.standoutNote).toBe(rm.balancedNote!.parent);
    expect(rm.balancedNote!.student).toContain('Beş alanda da puanın ortada');
    expect(d.science.normNote).toContain('karşılaştırma çalışması (norm)');
    expect(d.science.normNote).not.toMatch(/akran/);
  });
});
