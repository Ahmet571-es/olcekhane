import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { SimpleReportView } from '@/components/test/simple-report-view';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { taskScoreRows, type TaskInputs } from '@/lib/assessment/score-rows';
import { ADULT_GRADE } from '@/lib/config';
import type { TaskInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { partCards, type ReportPart } from '@/lib/reports/parts';
import type { SimpleReport } from '@/lib/reports/simple';
import type { ItemsVisual } from '@/lib/reports/visuals';
import type { ItemTrace } from '@/lib/scoring/tasks';
import { LONG_PART_SECONDS, reportSpeech, speakable, utterancesOf } from '@/lib/speech/report-text';
import { matrixBody, numericBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { TASK_VARIANTS } from './helpers/task-variants';
import { checkDrawn } from './helpers/visual-check';

/**
 * Görev (zekâ ve dikkat) testlerinin ek rapor bölümleri (site sahibinin 2026-10-31 isteği; aşama b; lib/reports/task-parts.ts):
 * "Düzeylerin ve ölçülerin anlamı", "Soru soru cevapların" (hızlı görevlerde "Deneme deneme sonuçların") ve "Sonuca ne kadar
 * güvenebiliriz?". Yayındaki her görev testi, her sonuç örüntüsüyle (tests/helpers/task-variants.ts) öğrenci, veli ve yetişkin
 * raporunda denenir.
 */

const TASKS = publicInstruments().filter((d): d is TaskInstrument => d.engine === 'tasks');
type Make = () => AnswersBody;
const variantsOf = (slug: string) => Object.entries(TASK_VARIANTS[slug] as Record<string, Make>);

function reportsOf(slug: string, body: AnswersBody): SimpleReport[] {
  const d = TASKS.find((x) => x.slug === slug)!;
  const r = evaluate(slug, body);
  return [r.student, r.parent, ...(d.adults ? [evaluateAdult(slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
}

/** Puanlamanın soru soru (deneme deneme) sonuçları: raporun kurulduğu kaynakla aynı. */
function tracesOf(slug: string, body: AnswersBody): Record<string, ItemTrace[]> {
  const d = TASKS.find((x) => x.slug === slug)!;
  if (body.data.engine !== 'tasks') throw new Error('görev testi değil');
  const inputs = new Map<string, TaskInputs>(Object.entries(body.data.blocks).map(([k, v]) => [k, v as TaskInputs]));
  return taskScoreRows(d, inputs, body.data.seed).traces;
}

const partOf = (r: SimpleReport, key: ReportPart['key']) => r.parts?.find((p) => p.key === key);
const checks = (r: SimpleReport) => partCards(partOf(r, 'quality')!);

/** Bölümün kendi metinleri (sorunun metni ve testin düzey anlatımları hariç: onlar testin metinleridir). */
function ownTexts(p: ReportPart): string[] {
  return [
    p.title,
    p.intro,
    p.introNote ?? '',
    ...p.groups.map((g) => g.title ?? ''),
    ...partCards(p).flatMap((c) => [
      c.title,
      c.badge ?? '',
      c.text ?? '',
      c.note ?? '',
      ...(c.spoken ?? []),
      ...(c.rows ?? []).flatMap((r) => [r.value, ...r.tags]),
    ]),
  ].filter(Boolean);
}

/** Cümleler; tırnak içindeki seçenek tek sözcük sayılır. */
function sentences(text: string): string[] {
  return text
    .replace(/“[^”]*”/g, 'X')
    .split(/(?<=[.!?])\s+(?=[\p{Lu}\d“])/u)
    .filter((s) => s.trim());
}

/** Sonuç kartlarından biri yorumlanmadı ya da hesaplanamadı (raporun kendi kartları). */
const notInterpreted = (r: SimpleReport) => r.items.some((i) => /Yorumlanmadı|Hesaplanamadı|Süre hesaplanamadı/.test(i.badge ?? '') || /yorumlanmadı|yorumlanmamalıdır/i.test(i.text));

/**
 * Uyarı kutusunda notu olmayan ama denetimde "Dikkat" yazan durumlar: sonucu yorumlanmayan kart (kartın kendisi söyler; ör. en
 * kısa diziler, çok az doğru) ya da çalışma biçimi kartında söylenen gözlem (kule görevinde düşünmeden başlanan uzun problemler).
 */
const CARD_ONLY = new Set(['tower:hizli', 'digit_span:en-kisa', 'spatial_span:en-kisa']);

describe('Görev testlerinin ek bölümleri: bütün testler, bütün örüntüler', () => {
  it('yayındaki her görev testinin örüntüleri var', () => {
    for (const d of TASKS) expect(TASK_VARIANTS[d.slug], d.slug).toBeDefined();
  });

  it('üç bölüm doğru sırada; cevaplar kapalı ve ekte, veli raporunda da var; her kartın grafiği var (yapılamayan denetim hariç) ve taşmaz', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        for (const r of reportsOf(d.slug, make())) {
          const label = `${d.slug} ${name} ${r.audience}`;
          const keys = (r.parts ?? []).map((p) => p.key);
          expect(keys.filter((k) => k !== 'levels'), label).toEqual(['answers', 'quality']);
          if (keys.includes('levels')) expect(keys[0], label).toBe('levels');
          const answers = partOf(r, 'answers')!;
          expect(answers.collapsed && answers.appendix, label).toBe(true);
          for (const p of r.parts!) {
            for (const g of p.groups) expect(g.cards.length, label).toBeGreaterThan(0);
            for (const c of partCards(p)) {
              const at = `${label} ${p.key} ${c.key}`;
              if (c.status === 'none') {
                expect(c.badge, at).toBe('Denetlenemedi');
                continue;
              }
              expect(c.visual, at).toBeDefined();
              checkDrawn(c.visual!, at);
              if (c.visual!.type !== 'items' && c.visual!.type !== 'blocks') expect(c.spoken?.length ?? 0, at).toBeGreaterThan(0);
            }
          }
          // Birden çok görevli testte gruplar görevlerin adıyla.
          if (d.tasks.length > 1 && d.slug !== 'zihinden-hesaplama-hizi') for (const p of r.parts!) expect(p.groups.every((g) => g.title), label).toBe(true);
        }
      }
    }
  }, 300_000);

  it('soru soru cevaplar puanlamayla aynı: sayı, doğru ve yanlışlar, verilen cevaplar', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        const body = make();
        const traces = tracesOf(d.slug, body);
        const [student, parent] = reportsOf(d.slug, body);
        for (const r of [student, parent]) {
          const cards = partCards(partOf(r, 'answers')!);
          for (const t of d.tasks) {
            const ts = traces[t.key];
            if (!ts?.length) continue;
            const card = cards.find((c) => c.key === t.key || c.key === `${t.key}-tanima`);
            const label = `${d.slug} ${name} ${r.audience} ${t.key}`;
            expect(card, label).toBeDefined();
            if (card!.visual?.type !== 'items') continue;
            const v = card!.visual as ItemsVisual;
            const count = (s: ItemTrace['status']) => ts.filter((x) => x.status === s).length;
            expect(card!.rows!.length, label).toBe(ts.length);
            expect(v.items.length, label).toBe(ts.length);
            expect(v.items.filter((x) => x.mark === 'ok').length, label).toBe(count('correct'));
            expect(v.items.filter((x) => x.mark === 'wrong').length, label).toBe(count('wrong'));
            expect(card!.badge, label).toBe(`${ts.length} ${card!.rowsHead!.item}`);
            // Doğru ve yanlış satırlar soluk değil; cevapsızlar soluk.
            expect(card!.rows!.filter((x) => !x.muted).length, label).toBe(count('correct') + count('wrong'));
            // Seçenekli sorularda verilen cevap satırda (karmaşık dizide sıralama farklı).
            if ('options' in t || t.kind === 'matrix_reasoning') {
              ts.forEach((x, i) => {
                if (typeof x.response === 'number') expect(card!.rows![i].value, `${label} ${i}`).toMatch(new RegExp(`^${x.response}\\. seçenek`));
              });
            }
          }
        }
      }
    }
  }, 300_000);
});

describe('Sonuca ne kadar güvenebiliriz: uyarı kutusuyla ve sonuç kartlarıyla aynı', () => {
  it('uyarı varsa bir denetimde "Dikkat"; "Dikkat" varsa uyarı ya da yorumlanmayan kart; özet cümle sayıyla aynı', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        for (const r of reportsOf(d.slug, make())) {
          const label = `${d.slug} ${name} ${r.audience}`;
          const all = checks(r);
          const warns = all.filter((c) => c.status === 'warn');
          if (r.cautions.length) expect(warns.length, `${label}: ${r.cautions.join(' | ')}`).toBeGreaterThan(0);
          for (const c of warns) {
            const kind = d.tasks.find((t) => partOf(r, 'quality')!.groups.some((g) => g.cards.includes(c) && (!g.title || g.title === t.name)))?.kind;
            if (CARD_ONLY.has(`${kind}:${c.key}`)) continue;
            expect(r.cautions.length > 0 || notInterpreted(r), `${label} ${c.key}`).toBe(true);
          }
          const intro = partOf(r, 'quality')!.intro;
          if (!warns.length) expect(intro, label).toMatch(/uygun çıktı/);
          else expect(intro, label).toMatch(/“Dikkat” yazıyor/);
        }
      }
    }
  }, 300_000);

  /** Elle kurulan örüntüler: şans, çok hızlı, hep aynı yer, hep "Bilmiyorum", boş ve hiç basmama. */
  const CRAFTED: { slug: string; name: string; body: () => AnswersBody; warn: string[] }[] = [
    { slug: 'sekil-akil-yurutme', name: 'şans ve çok hızlı', body: TASK_VARIANTS['sekil-akil-yurutme'].rastgele as Make, warn: ['sans', 'hizli'] },
    { slug: 'sekil-akil-yurutme', name: 'hep aynı yer', body: () => matrixBody(() => ({ choice: 1, rtMs: 5000 })), warn: ['ayni-yer'] },
    { slug: 'sayi-dizileri', name: 'hep "Bilmiyorum"', body: TASK_VARIANTS['sayi-dizileri'].bilmiyorum as Make, warn: ['bilmiyorum'] },
    { slug: 'mantiksal-akil-yurutme', name: 'hep evet', body: TASK_VARIANTS['mantiksal-akil-yurutme'].hepEvet as Make, warn: ['ayni-cevap'] },
    { slug: 'mantiksal-akil-yurutme', name: 'çok hızlı', body: TASK_VARIANTS['mantiksal-akil-yurutme'].hizli as Make, warn: ['hizli'] },
    { slug: 'sayisal-akil-yurutme', name: 'hep "Bilmiyorum"', body: () => numericBody(() => ({ response: null, rtMs: 9000 })), warn: ['bilmiyorum'] },
    { slug: 'sayisal-akil-yurutme', name: 'çok hızlı', body: TASK_VARIANTS['sayisal-akil-yurutme'].hizli as Make, warn: ['hizli'] },
    { slug: 'dusunerek-karar-verme', name: 'çok hızlı', body: TASK_VARIANTS['dusunerek-karar-verme'].hizli as Make, warn: ['hizli'] },
    { slug: 'simge-bulma', name: 'tek düğme', body: TASK_VARIANTS['simge-bulma'].tekDugme as Make, warn: ['ayni-dugme'] },
    { slug: 'simge-bulma', name: 'hiç cevap yok', body: TASK_VARIANTS['simge-bulma'].hic as Make, warn: ['az'] },
    { slug: 'zihinde-dondurme', name: 'cevapsız', body: TASK_VARIANTS['zihinde-dondurme'].cevapsiz as Make, warn: ['gecersiz'] },
    { slug: 'kural-degistirme', name: 'cevapsız', body: TASK_VARIANTS['kural-degistirme'].cevapsiz as Make, warn: ['sure-doldu'] },
    { slug: 'kural-degistirme', name: 'tek düğme', body: TASK_VARIANTS['kural-degistirme'].tekDugme as Make, warn: ['ayni-dugme'] },
    { slug: 'dur-git-gorevi', name: 'hiç basmadı', body: TASK_VARIANTS['dur-git-gorevi'].hicBasmadi as Make, warn: ['basma'] },
    { slug: 'geriye-donuk-hatirlama', name: 'sessiz', body: TASK_VARIANTS['geriye-donuk-hatirlama'].sessiz as Make, warn: ['sessiz'] },
    { slug: 'tepki-hizi', name: 'ters taraf', body: TASK_VARIANTS['tepki-hizi'].ters as Make, warn: ['taraf'] },
    { slug: 'hesapla-ve-hatirla', name: 'rastgele işlemler', body: TASK_VARIANTS['hesapla-ve-hatirla'].rastgele as Make, warn: ['islem-sans'] },
    { slug: 'hesapla-ve-hatirla', name: 'yavaş işlemler', body: TASK_VARIANTS['hesapla-ve-hatirla'].islemYavas as Make, warn: ['islem-sure'] },
    { slug: 'desen-hatirlama', name: 'hiçbiri', body: TASK_VARIANTS['desen-hatirlama'].hicbiri as Make, warn: ['en-kucuk'] },
    { slug: 'kelime-listesi-hatirlama', name: 'cevapsız', body: TASK_VARIANTS['kelime-listesi-hatirlama'].cevapsiz as Make, warn: ['bos'] },
    { slug: 'planlama-kule-gorevi', name: 'boşta', body: TASK_VARIANTS['planlama-kule-gorevi'].bosta as Make, warn: ['bosta'] },
    { slug: 'renk-kelime-gorevi', name: 'cevapsız', body: TASK_VARIANTS['renk-kelime-gorevi'].cevapsiz as Make, warn: ['yarida'] },
    { slug: 'surekli-dikkat', name: 'çok az', body: TASK_VARIANTS['surekli-dikkat'].cokAz as Make, warn: ['az'] },
    { slug: 'uc-boyutlu-zihinde-dondurme', name: 'bir doğru bir ayna', body: TASK_VARIANTS['uc-boyutlu-zihinde-dondurme'].yarim as Make, warn: ['yarim'] },
    { slug: 'bakis-acisi-alma', name: 'rastgele', body: TASK_VARIANTS['bakis-acisi-alma'].rastgele as Make, warn: ['sans'] },
  ];

  it('elle kurulan örüntülerde beklenen denetim "Dikkat" ve uyarı kutusunda not var; olağan cevaplarda bu denetimler "Uygun"', () => {
    for (const x of CRAFTED) {
      for (const r of reportsOf(x.slug, x.body())) {
        const label = `${x.slug} ${x.name} ${r.audience}`;
        for (const key of x.warn) {
          const c = checks(r).find((y) => y.key === key);
          expect(c, `${label} ${key}`).toBeDefined();
          expect(c!.status, `${label} ${key}: ${c!.text}`).toBe('warn');
          expect(c!.text, `${label} ${key}`).toMatch(/(yeniden|Yeniden|ok tuşlarıyla|kafanda|kafasında|bakmasını|hatırlat)/);
        }
        expect(r.cautions.length > 0 || notInterpreted(r), label).toBe(true);
      }
    }
    // Olağan örüntülerde bu denetimler uygun.
    for (const slug of [...new Set(CRAFTED.map((x) => x.slug))]) {
      const ok = (TASK_VARIANTS[slug].hepsi ?? TASK_VARIANTS[slug].varsayilan) as Make;
      for (const r of reportsOf(slug, ok())) {
        for (const key of CRAFTED.filter((x) => x.slug === slug).flatMap((x) => x.warn)) {
          expect(checks(r).find((y) => y.key === key)?.status, `${slug} olağan ${r.audience} ${key}`).toBe('ok');
        }
      }
    }
  }, 120_000);

  it('denetlenemeyen kart "Denetlenemedi" der ve grafiği yoktur; süre ölçülmezse süreye dayanan denetimler yapılamaz', () => {
    for (const slug of ['sekil-akil-yurutme', 'sayi-dizileri', 'mantiksal-akil-yurutme', 'sayisal-akil-yurutme', 'kelime-bilgisi']) {
      for (const r of reportsOf(slug, (TASK_VARIANTS[slug].suresiz as Make)())) {
        const label = `${slug} ${r.audience}`;
        expect(checks(r).find((c) => c.key === 'hizli')?.status, label).toBe('none');
        expect(checks(r).find((c) => c.key === 'sure')?.status, label).toBe('none');
        for (const c of checks(r).filter((y) => y.status === 'none')) expect(c.visual, label).toBeUndefined();
      }
    }
  }, 120_000);
});

describe('Görev testlerinin ek bölümlerinin dili', () => {
  it('öğrenciye ve yetişkine "sen", veliye "çocuğunuz"; yetişkinde okul sözcüğü yok; tanı, zekâ puanı ve norm yok; nicelik sözleri; cümleler kısa', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        for (const r of reportsOf(d.slug, make())) {
          for (const p of r.parts!) {
            const texts = ownTexts(p);
            const joined = texts.join(' ');
            const label = `${d.slug} ${name} ${r.audience} ${p.key}`;
            expect(joined, label).not.toMatch(/(?<!\p{L})(?:tanı|teşhis|IQ|hastalık|bozukluk|zekâ puanı|norm|akranların|yaşıtların)(?!\p{L})/iu);
            expect(joined, label).not.toMatch(/\b(\d+) \S+ \1 tanes|(^|\s)[01] tanes|(?<!\p{L})yok (?:doğru|yanlış|geçilen|basış)/u);
            if (r.audience === 'parent') {
              expect(joined, label).not.toMatch(
                /(?<!\p{L})(?:senin|sen|verdin|bastın|ettin|ulaştın|yazdın|cevapladın|çözersen|çözebilirsin|yaparsan|indirdiğin|yazdıkların|edebilirsin|bakabilirsin)(?!\p{L})/iu,
              );
            } else {
              expect(joined, label).not.toMatch(/Çocuğunuz|çocuğunuz/);
            }
            if (r.audience === 'adult') expect(schoolWords(joined.replace(/“[^”]*”/g, '')), label).toEqual([]);
            for (const t of texts)
              for (const s of sentences(t)) {
                const words = s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
                expect(words, `${label}: ${s}`).toBeLessThanOrEqual(22);
              }
          }
        }
      }
    }
  }, 300_000);

  it('bölümler başka kişilerle karşılaştırma yapmadığını söyler; düzeyli testlerde düzey kartı raporun düzeyiyle aynı', () => {
    for (const d of TASKS) {
      const [student, parent] = reportsOf(d.slug, (TASK_VARIANTS[d.slug].varsayilan as Make)());
      for (const r of [student, parent]) {
        const levels = partOf(r, 'levels');
        if (!levels) continue;
        expect(levels.intro, d.slug).toMatch(/karşılaştırılmaz/);
        for (const c of partCards(levels).filter((x) => x.levels?.length)) {
          const active = c.levels!.filter((l) => l.active);
          expect(active.length, `${d.slug} ${c.key}`).toBeLessThanOrEqual(1);
          // Rozet raporun "ulaşılan düzey" kartıyla aynı yazılır.
          if (active.length && c.key === 'duzeyler') expect(r.items.map((i) => i.badge), d.slug).toContain(c.badge);
        }
      }
    }
  });
});

describe('Görev testlerinin ek bölümleri ekranda, PDF’te ve sesli dinlemede', () => {
  it('ekranda sıra: sonuç kartları, ek bölümler, "tanı değildir" notu; cevaplar kapalı kutularda; veli raporunda da var', () => {
    for (const slug of ['sekil-akil-yurutme', 'dikkat-ve-bellek', 'zihinden-hesaplama-hizi', 'tepki-hizi', 'kelime-listesi-hatirlama']) {
      for (const r of reportsOf(slug, (TASK_VARIANTS[slug].varsayilan as Make)())) {
        const html = renderToStaticMarkup(createElement(SimpleReportView, { report: r }));
        const at = (s: string) => html.indexOf(s);
        const order = [at('id="ogeler"'), ...r.parts!.map((p) => at(p.title.replace('?', ''))), at(r.disclaimer.title)];
        for (const i of order) expect(i, `${slug} ${r.audience}`).toBeGreaterThan(-1);
        expect([...order].sort((a, b) => a - b), `${slug} ${r.audience}`).toEqual(order);
        expect(html, slug).toContain('<details');
      }
    }
  });

  it('sesli dinleme ek bölümleri eksiksiz okur (satırlar, değerler); grafiğin görünüşü okunmaz; uzun bölümün süresi söylenir', () => {
    for (const d of TASKS) {
      const variants = variantsOf(d.slug);
      for (const [name, make] of [variants[0], variants[variants.length - 1]]) {
        const [student, parent] = reportsOf(d.slug, make());
        for (const r of [student, parent]) {
          const label = `${d.slug} ${name} ${r.audience}`;
          const utter = utterancesOf(reportSpeech(r).results);
          const text = utter.map((u) => u.text).join(' ');
          // Konuşma cümle cümle bölünür ve sondaki sayıdan sonra nokta okunmaz: noktalama dışında karşılaştırılır.
          const flat = (x: string) => x.replace(/[.!?]/g, '').replace(/\s+/g, ' ').trim();
          const heard = flat(text);
          const said = (x: string) => heard.includes(flat(speakable(x)));
          const segs = new Set(utter.map((u) => u.segment));
          for (const p of r.parts!) {
            const title = p.title.replace(/[.:?]$/, '');
            const mine = utter.filter((u) => u.section === title);
            expect(mine.length, `${label} ${p.key}`).toBeGreaterThan(0);
            const seconds = mine.reduce((n, u) => n + u.text.length, 0) / 15;
            if (seconds > LONG_PART_SECONDS * 1.1) expect(mine.some((u) => u.text.startsWith('Bu bölüm yaklaşık')), `${label} ${p.key}`).toBe(true);
            for (const c of partCards(p)) {
              expect(segs.has(c.title), `${label} ${c.title}`).toBe(true);
              for (const s of c.spoken ?? []) expect(said(s), `${label} ${s}`).toBe(true);
              for (const row of c.rows ?? []) {
                expect(said(row.say ?? row.text), `${label} ${row.text}`).toBe(true);
                expect(said(row.value), `${label} ${row.value}`).toBe(true);
              }
              if (c.note) expect(text, label).not.toContain(speakable(c.note).slice(0, 30));
            }
          }
          expect(text, label).not.toMatch(/kırmızı çizgi|dolu daire|içi boş daire|renkli bölge/iu);
        }
      }
    }
  }, 300_000);

  it('PDF: en uzun görev testleri makul sürede; cevaplar ekte', async () => {
    const pages = (b: Buffer) => (b.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    for (const slug of ['zihinden-hesaplama-hizi', 'dikkat-ve-bellek', 'simge-bulma', 'kelime-listesi-hatirlama', 'sekil-akil-yurutme', 'surekli-dikkat']) {
      const [student, parent] = reportsOf(slug, (TASK_VARIANTS[slug].varsayilan as Make)());
      const t0 = performance.now();
      const pdf = await renderSimpleReportPdf(student, 'olcekhane.com');
      // Yerelde birkaç saniye; GitHub'da daha yavaş olabilir.
      expect(performance.now() - t0, slug).toBeLessThan(40_000);
      expect(pdf.subarray(0, 5).toString(), slug).toBe('%PDF-');
      expect(pages(pdf), slug).toBeGreaterThan(pages(await renderSimpleReportPdf({ ...student, parts: undefined }, 'olcekhane.com')));
      expect((await renderSimpleReportPdf(parent, 'olcekhane.com')).subarray(0, 5).toString(), slug).toBe('%PDF-');
    }
  }, 300_000);
});
