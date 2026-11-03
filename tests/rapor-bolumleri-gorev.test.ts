import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { SimpleReportView } from '@/components/test/simple-report-view';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { taskScoreRows, toReportScore, type TaskInputs } from '@/lib/assessment/score-rows';
import { ADULT_GRADE } from '@/lib/config';
import { arithSpoken, arithText } from '@/lib/instruments/arithmetic';
import { lnAnswer } from '@/lib/instruments/letter-number';
import { patternText } from '@/lib/instruments/pattern';
import type { TaskInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { SAME_ITEMS, SAME_PLURAL, sameNounOf } from '@/lib/compare/tasks';
import { buildReport } from '@/lib/reports/build';
import { partCards, type PartCard, type PartRow, type ReportPart } from '@/lib/reports/parts';
import { floorVisual, type SimpleReport } from '@/lib/reports/simple';
import { QUALITY_TITLE } from '@/lib/reports/task-parts-core';
import { ITEMS_MIN_RADIUS, ITEMS_WRAP_AT, drawVisual } from '@/lib/reports/visual-draw';
import type { ItemsVisual, MeterVisual } from '@/lib/reports/visuals';
import {
  analogyChance,
  arithRead,
  assemblyChance,
  chanceAtLeast,
  cubeChance,
  hiddenChance,
  levelOneByChance,
  matrixChance,
  type ArithSectionResult,
  type ItemTrace,
} from '@/lib/scoring/tasks';
import { LONG_PART_SECONDS, reportSpeech, speakable, utterancesOf } from '@/lib/speech/report-text';
import { assemblyBody, assemblyRank, cubeBody, cubeRank, hiddenBody, hiddenRank, matrixBody, numericBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { TASK_VARIANTS } from './helpers/task-variants';
import { checkDrawn } from './helpers/visual-check';
import { pdfFlat, pdfText } from './helpers/pdf-text';

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
const CARD_ONLY = new Set(['tower:hizli', 'digit_span:en-kisa', 'spatial_span:en-kisa', 'numerical_reasoning:hizli-bilmiyorum']);

/** Çubuktaki değerin düştüğü bölge (bölgenin başı içinde, sonu dışında; son bölgenin sonu içinde). */
const zoneOf = (v: MeterVisual, value: number) => v.zones.find((z, i) => value >= z.from && (value < z.to || (i === v.zones.length - 1 && value <= z.to)));

/** Yorumlanmayan sonucun kartı nedenin yazdığı bölümü anar. */
const UNREAD = new RegExp(`nedeni “${QUALITY_TITLE.replace('?', '\\?')}” bölümünde yazıyor`);

/** Aynı soruların geldiği testlerde satırlarda cevap anahtarını ele verecek etiketler. */
const KEY_TAGS = /^(?:tür:|tuzaklı soru|tuzaksız eş soru|ilk akla gelen cevap|tuzak varmış gibi cevap|ilk listeden|ikinci listeden|.*yeni kelime$|iki ayna görüntüsü|tam ters yön|sağ ile sol karışık|haritaya göre yön)/;

/** Aynı soruların geldiği testlerde satırın yeri: düzey, bölüm ya da ekranda yazılı en az hamle sayısı; ya da hiçbir şey. */
const PLACE = /^(?:\d+\. düzey|\d+\. bölüm|\d+ hamlelik problem|\d+ (?:rakamlık|kutuluk|harflik|öğelik) dizi|\d+ kareli desen|)$/;
/** Satırın değeri yalnızca sonuçtur (testlerin doğru, yanlış ve cevapsız adları). */
const HIDDEN_VALUES = new Set([
  'Doğru',
  'Yanlış',
  '“Bilmiyorum”',
  'Doğru yöne yakın',
  'Uzak',
  'Cevap verilmedi',
  'Süre içinde cevap yok',
  'En az hamlede',
  'Fazla hamleyle',
  'Süre içinde çözülemedi',
  'Hiç top taşınmadı',
  'Boş',
  '“Geç”',
  '“Hatırlamıyorum”',
  'Tam doğru',
  'Eksik',
  'Bütün yerler boş',
]);
/** Sayı yalnızca süre etiketinde ("12 sn", "ilk top 4 sn") ve içerik anmayan sayımlarda ("3/5 harf doğru yerde"). */
const TIME_TAG = /^(?:ilk top )?\d+(?:,\d+)? sn$/;
const COUNT_TAG = /^(?:\d+\/\d+ (?:harf|kare) doğru yerde|işlemler \d+\/\d+ doğru|\d+ işlemde süre doldu|\d+ fazla kare|(?:desen|dizi) \d+ kez yeniden gösterildi)$/;

/** Aynı soruların geldiği testte bir satır: seçenek numarası, verilen ya da doğru cevap, soru yok. */
function checkHiddenRow(row: PartRow, trace: ItemTrace, at: string) {
  expect(row.text, at).toMatch(PLACE);
  expect(row.say, at).toBeUndefined();
  expect(row.spoken, at).toBeUndefined();
  expect(HIDDEN_VALUES.has(row.value), `${at}: ${row.value}`).toBe(true);
  for (const tag of row.tags) {
    expect(tag, at).not.toMatch(KEY_TAGS);
    if (tag !== 'çok hızlı' && !TIME_TAG.test(tag) && !COUNT_TAG.test(tag)) expect(tag, at).not.toMatch(/\d/);
  }
  expect([row.text, row.value, ...row.tags].join(' · '), at).not.toMatch(/\d+\.\s*seçenek|doğrusu/);
  // Verilen cevabın kendisi (sayı, harf, kelime) satırda yok (yer ve süre dışında).
  const all = [row.value, ...row.tags.filter((t) => !TIME_TAG.test(t) && !COUNT_TAG.test(t))].join(' · ');
  const given = typeof trace.response === 'string' || typeof trace.response === 'number' ? String(trace.response) : null;
  if (given && given.length > 1) expect(all, at).not.toContain(given);
}

/** Bir raporun bütün ek bölüm kartları (bölümüyle). */
const allCards = (r: SimpleReport): [ReportPart, PartCard][] => (r.parts ?? []).flatMap((p) => partCards(p).map((c) => [p, c] as [ReportPart, PartCard]));

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
          // "Günlük hayatta nerede kullanılır" (tests/gunluk-hayat.test.ts) ölçülerin anlamından hemen sonra gelir.
          expect(keys.filter((k) => k !== 'levels' && k !== 'daily'), label).toEqual(['answers', 'quality']);
          if (keys.includes('levels')) expect(keys[0], label).toBe('levels');
          const answers = partOf(r, 'answers')!;
          expect(answers.collapsed && answers.appendix, label).toBe(true);
          for (const p of r.parts!) {
            for (const g of p.groups) expect(g.cards.length, label).toBeGreaterThan(0);
            for (const c of partCards(p)) {
              const at = `${label} ${p.key} ${c.key}`;
              // Yapılamayan denetimin ve yorumlanmayan sonucun grafiği ve sözle okunan değeri yoktur; kart nedenini söyler.
              if (c.status === 'none') {
                expect(c.badge, at).toBe('Denetlenemedi');
                expect(c.visual, at).toBeUndefined();
                expect(c.spoken, at).toBeUndefined();
                continue;
              }
              if (!c.visual) {
                expect(c.text, at).toMatch(UNREAD);
                expect(c.spoken, at).toBeUndefined();
                continue;
              }
              if (c.badge === 'Yorumlanmadı') throw new Error(`${at}: yorumlanmayan kartın grafiği var`);
              checkDrawn(c.visual!, at);
              // Grafiğin değerleri sözle okunur (rozette yazıyorsa rozetle).
              if (c.visual!.type !== 'items' && c.visual!.type !== 'blocks') expect((c.spoken?.length ?? 0) > 0 || !!c.badge, at).toBe(true);
            }
          }
          // Birden çok görevli testte gruplar görevlerin adıyla.
          // (Günlük hayat bölümünün kartları becerilerdir; bir kart birkaç görevi anlatabilir.)
          if (d.tasks.length > 1 && d.slug !== 'zihinden-hesaplama-hizi') for (const p of r.parts!.filter((x) => x.key !== 'daily')) expect(p.groups.every((g) => g.title), label).toBe(true);
        }
      }
    }
  }, 300_000);

  it('soru soru cevaplar puanlamayla aynı: sayı, doğru ve yanlışlar; aynı soruların geldiği testlerde cevap yazılmaz', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        const body = make();
        const traces = tracesOf(d.slug, body);
        for (const r of reportsOf(d.slug, body)) {
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
            // Aynı soruların geldiği testlerde satırlar cevap anahtarı olmaz: soru, verilen ve doğru cevap yazılmaz; yalnızca yeri,
            // doğru mu yanlış mı (ya da cevapsız), yanlışın türü, "çok hızlı" ve süre.
            if (SAME_ITEMS.has(t.kind)) {
              expect(card!.rowsHead!.value, label).toBe('Sonuç');
              card!.rows!.forEach((row, i) => checkHiddenRow(row, ts[i], `${label} ${row.no}`));
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
        // Bölüm başlığı başlık etiketinin içinde aranır (kartların metni bölümün adını anabilir).
        const order = [at('id="ogeler"'), ...r.parts!.map((p) => at(`>${p.title}</h`)), at(r.disclaimer.title)];
        for (const i of order) expect(i, `${slug} ${r.audience}`).toBeGreaterThan(-1);
        expect([...order].sort((a, b) => a - b), `${slug} ${r.audience}`).toEqual(order);
        expect(html, slug).toContain('<details');
      }
    }
  });

  it('sesli dinleme ek bölümleri eksiksiz okur (satırlar, değerler); grafiğin görünüşü okunmaz; uzun bölüm kısalır ve süresi söylenir', () => {
    let longest = 0;
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
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
            longest = Math.max(longest, seconds);
            // Uzun listelerde doğru satırlar (çok uzunsa bütün satırlar) tek tek okunmaz: bölüm 8 dakikayı geçmez.
            expect(seconds, `${label} ${p.key}`).toBeLessThan(8 * 60);
            if (seconds > LONG_PART_SECONDS * 1.1) expect(mine.some((u) => u.text.startsWith('Bu bölüm yaklaşık')), `${label} ${p.key}`).toBe(true);
            for (const c of partCards(p)) {
              expect(segs.has(c.title), `${label} ${c.title}`).toBe(true);
              for (const s of c.spoken ?? []) expect(said(s), `${label} ${s}`).toBe(true);
              for (const row of c.rows ?? []) {
                if (row.silent) continue;
                expect(said(row.say ?? row.text), `${label} ${row.text}`).toBe(true);
                expect(said(row.value), `${label} ${row.value}`).toBe(true);
                // Bölüm özetinin satırları adlarıyla okunur ("Basit bölüm, ilk yarı"); "3. yarı:" gibi numara okunmaz.
                if (c.visual?.type === 'blocks') expect(heard, `${label} ${row.text}`).not.toContain(flat(speakable(`${row.no}. ${c.rowsHead!.item}: ${row.text}`)));
              }
              // Okunmayan satırlar kartın sözle anlatımında söylenir.
              if (c.rows?.some((x) => x.silent)) expect((c.spoken ?? []).join(' '), `${label} ${c.key}`).toMatch(/tek tek okunmaz/);
              if (c.note) expect(text, label).not.toContain(speakable(c.note).slice(0, 30));
            }
          }
          expect(text, label).not.toMatch(/kırmızı çizgi|dolu daire|içi boş daire|renkli bölge|Kutu, doğru tepkilerin/iu);
          expect(text, label).not.toMatch(/Düzeyler\. Düzeyler/);
        }
      }
    }
    expect(longest).toBeGreaterThan(0);
  }, 600_000);

  it('PDF: en uzun görev testleri makul sürede; cevaplar ekte', async () => {
    const pages = (b: Buffer) => (b.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    // Zihinden hesaplamanın "rastgele" örüntüsünde her bölümde 48 işlem gösterilir (en uzun liste).
    for (const [slug, variant] of [
      ['zihinden-hesaplama-hizi', 'rastgele'],
      ['zihinden-hesaplama-hizi', 'varsayilan'],
      ['dikkat-ve-bellek', 'varsayilan'],
      ['simge-bulma', 'varsayilan'],
      ['kelime-listesi-hatirlama', 'varsayilan'],
      ['sekil-akil-yurutme', 'varsayilan'],
      ['surekli-dikkat', 'varsayilan'],
    ]) {
      const [student, parent] = reportsOf(slug, (TASK_VARIANTS[slug][variant] as Make)());
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

describe('Bağımsız inceleme bulguları (aşama b)', () => {
  it('denetimlerde rozet ile grafik çelişmez: "Uygun" işaret uyarı bölgesinde değil, "Dikkat" en az bir işaret uyarı bölgesinde', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        for (const r of reportsOf(d.slug, make())) {
          for (const [p, c] of allCards(r)) {
            if (c.visual?.type !== 'meter' || !c.status) continue;
            const v = c.visual as MeterVisual;
            const label = `${d.slug} ${name} ${r.audience} ${p.key}/${c.key} (${v.rows.map((x) => `${x.value}:${zoneOf(v, x.value)?.label}`).join(', ')})`;
            const inWarn = v.rows.some((x) => zoneOf(v, x.value)?.warn);
            if (c.status === 'ok') expect(inWarn, label).toBe(false);
            if (c.status === 'warn') expect(inWarn, label).toBe(true);
          }
        }
      }
    }
  }, 300_000);

  it('yorumlanmayan sonucun kartı nedenini söyler, grafiği ve sözle okunan değeri yoktur; zihinden hesaplamada düzey kartları da', () => {
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        for (const r of reportsOf(d.slug, make())) {
          for (const [p, c] of allCards(r)) {
            if (c.badge !== 'Yorumlanmadı') continue;
            const label = `${d.slug} ${name} ${r.audience} ${p.key}/${c.key}`;
            expect(c.text, label).toMatch(UNREAD);
            expect(c.visual, label).toBeUndefined();
            expect(c.spoken, label).toBeUndefined();
            expect(c.levels?.some((l) => l.active) ?? false, label).toBe(false);
          }
        }
      }
    }
    // Zihinden hesaplama: bölümün düzey kartı bölümün yorumlanmasına uyar; vurgulu düzey "cevap yazılan en zor düzey"dir.
    const d = TASKS.find((x) => x.slug === 'zihinden-hesaplama-hizi')!;
    for (const [name, make] of variantsOf(d.slug)) {
      const body = make();
      if (body.data.engine !== 'tasks') continue;
      const inputs = new Map<string, TaskInputs>(Object.entries(body.data.blocks).map(([k, v]) => [k, v as TaskInputs]));
      const rows = taskScoreRows(d, inputs, body.data.seed).rows;
      for (const r of reportsOf(d.slug, body)) {
        for (const t of d.tasks) {
          const card = partCards(partOf(r, 'levels')!).find((c) => c.key === `${t.key}-duzey`);
          const sec = rows.find((x) => x.scaleKey === `zh_${{ add: 'toplama', sub: 'cikarma', mul: 'carpma', div: 'bolme' }[(t as { op: string }).op]}`);
          if (!card || !sec) continue;
          const label = `${name} ${r.audience} ${t.key}`;
          if (arithRead(sec.extra as unknown as ArithSectionResult)) {
            expect(card.badge, label).not.toBe('Yorumlanmadı');
            expect(card.activeLabel, label).toBe('Cevap yazılan en zor düzey');
          } else {
            expect(card.badge, label).toBe('Yorumlanmadı');
            expect(card.levels!.some((l) => l.active), label).toBe(false);
          }
        }
      }
    }
  }, 300_000);

  it('şans düzeyi 1. düzeyde de denetlenir: binom olasılığı en az %5 ise 1. düzey şansa bağlanır', () => {
    // Olasılıklar (p = 1 / seçenek sayısı): dört seçenekli beş sorunun üçü %10,4; dört seçenekli dört sorunun üçü %5,1; sekiz
    // seçenekli dört sorunun üçü %0,7; beş seçenekli dört sorunun üçü %2,7.
    expect(chanceAtLeast(3, 5, 4)).toBeCloseTo(0.1035, 3);
    expect(chanceAtLeast(3, 4, 4)).toBeCloseTo(0.0508, 3);
    expect(chanceAtLeast(3, 4, 8)).toBeCloseTo(0.0071, 3);
    expect(chanceAtLeast(3, 4, 5)).toBeCloseTo(0.0272, 3);
    expect(chanceAtLeast(5, 5, 4)).toBeLessThan(0.01);
    const lv = (first: [number, number]) => ({ reached: 1, levels: [{ level: 1, n: first[1], correct: first[0] }] });
    expect(levelOneByChance(lv([3, 5]), 4)).toBe(true);
    expect(levelOneByChance(lv([4, 5]), 4)).toBe(false);
    expect(levelOneByChance(lv([5, 5]), 4)).toBe(false);
    expect(levelOneByChance(lv([3, 4]), 4)).toBe(true);
    expect(levelOneByChance(lv([4, 4]), 4)).toBe(false);
    expect(levelOneByChance(lv([3, 4]), 8)).toBe(false);
    expect(levelOneByChance({ ...lv([3, 5]), reached: 2 }, 4)).toBe(false);
    const res = (correct: number, first: [number, number]) => ({ correct, ...lv(first) }) as never;
    expect(cubeChance(res(3, [3, 5]))).toBe(true);
    expect(cubeChance(res(5, [5, 5]))).toBe(false);
    expect(hiddenChance(res(3, [3, 5]))).toBe(true);
    expect(assemblyChance(res(3, [3, 4]))).toBe(true);
    expect(assemblyChance(res(4, [4, 4]))).toBe(false);
    expect(analogyChance(res(3, [3, 4]))).toBe(true);
    expect(analogyChance(res(4, [4, 4]))).toBe(false);
    expect(matrixChance(res(3, [3, 4]))).toBe(false);
    // Uçtan uca: 1. düzeyin üçü doğru, başka doğru yok (20 soruda 3 doğru) → şans; 1. düzeyin hepsi doğru → yorumlanır.
    const firstOnly = (k: number, rank: (q: { level: number; i: number }) => number) => (q: { level: number; i: number; answer: number }) => ({
      response: q.level === 1 && rank(q) < k ? q.answer : (q.answer % 4) + 1,
      rtMs: 6000,
    });
    const cases: [string, AnswersBody, boolean][] = [
      ['kup-acinimi', cubeBody(firstOnly(3, cubeRank)), true],
      ['kup-acinimi', cubeBody(firstOnly(5, cubeRank)), false],
      ['gizli-sekiller', hiddenBody(firstOnly(3, hiddenRank)), true],
      ['gizli-sekiller', hiddenBody(firstOnly(5, hiddenRank)), false],
      ['parcalardan-sekil', assemblyBody(firstOnly(3, assemblyRank)), true],
      ['parcalardan-sekil', assemblyBody(firstOnly(4, assemblyRank)), false],
    ];
    for (const [slug, body, chance] of cases) {
      for (const r of reportsOf(slug, body)) {
        const label = `${slug} ${chance ? 'şans' : 'yorumlanır'} ${r.audience}`;
        const sans = checks(r).find((c) => c.key === 'sans')!;
        expect(sans.status, label).toBe(chance ? 'warn' : 'ok');
        const levels = partCards(partOf(r, 'levels')!).find((c) => c.key === 'duzeyler')!;
        expect(levels.badge === 'Yorumlanmadı', label).toBe(chance);
        expect(levels.levels!.some((l) => l.active), label).toBe(!chance);
        // "Şansla açıklanamayacak kadar çok" yalnızca olasılık %5'ten küçükken.
        if (chance) expect(sans.text, label).not.toMatch(/açıklanamayacak/);
        else expect(sans.text, label).toMatch(/açıklanamayacak|belirgin biçimde üstünde/);
        expect(r.cautions.some((x) => /rastgele seçen/.test(x)), label).toBe(chance);
      }
    }
  }, 120_000);

  it('soru şeridinin işaretleri okunur büyüklükte: uzun listede satır satır ve en az 2,2 birim', () => {
    let wrapped = 0;
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        const [student] = reportsOf(d.slug, make());
        for (const [, c] of allCards(student)) {
          if (c.visual?.type !== 'items') continue;
          const v = c.visual as ItemsVisual;
          for (const [W, fs] of [
            [240, 10],
            [176, 7],
          ]) {
            // İşaretin dış yarıçapı (içi boş dairede çizgi dahil); sondaki iki daire açıklamanındır.
            const radii = drawVisual(v, W, fs).shapes.flatMap((x) => (x.k === 'circle' ? [x.r + (x.sw ?? 0) / 2] : []));
            const min = Math.min(...radii.slice(0, -2));
            const label = `${d.slug} ${name} ${c.key} ${W} (${v.items.length} işaret)`;
            if (v.items.length > ITEMS_WRAP_AT) {
              wrapped++;
              expect(min, label).toBeGreaterThanOrEqual(ITEMS_MIN_RADIUS);
            } else expect(min, label).toBeGreaterThanOrEqual(1.4);
          }
        }
      }
    }
    expect(wrapped).toBeGreaterThan(0);
  }, 300_000);

  it('tepki hızı: yorumlanmayan bölüm süre ve erken basış denetimlerine katılmaz; kart bunu söyler', () => {
    for (const r of reportsOf('tepki-hizi', (TASK_VARIANTS['tepki-hizi'].kacirdi as Make)())) {
      const label = `kacirdi ${r.audience}`;
      expect(checks(r).find((c) => c.key === 'gecersiz')!.status, label).toBe('warn');
      for (const key of ['kacan', 'erken']) {
        const c = checks(r).find((x) => x.key === key)!;
        expect(c.text, `${label} ${key}`).toMatch(/yorumlanmadığı için bu denetime katılmadı/);
        if (c.visual) expect((c.visual as MeterVisual).rows.map((x) => x.label), `${label} ${key}`).not.toContain('Seçmeli bölüm');
      }
    }
  });

  it('karşılaştırma bölümü aynı içeriğin geldiği testte içeriğin adını ve cevapların tek tek yazılmadığını söyler', async () => {
    const { retestNote } = await import('@/components/test/compare-panel');
    for (const items of Object.values(SAME_PLURAL)) {
      for (const you of [true, false]) {
        const t = retestNote('items', you, items);
        expect(t).toContain(`Bu testte her seferinde aynı ${items} gelir.`);
        expect(t).toMatch(you ? /Raporunda cevapların tek tek yazılmaz;/ : /Raporda çocuğunuzun cevapları tek tek yazılmaz;/);
        for (const s of sentences(t.replace(/\s*\([^()]*\d{4}\)/g, ''))) expect(s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length, s).toBeLessThanOrEqual(22);
      }
    }
    expect(retestNote('practice', true)).not.toMatch(/aynı /);
    // Raporun karşılaştırma bilgisi içeriğin adını taşır.
    for (const d of TASKS) {
      const noun = sameNounOf(d);
      const c = reportsOf(d.slug, (TASK_VARIANTS[d.slug].varsayilan as Make)())[0].compare;
      if (!c) continue;
      expect(c.retest, d.slug).toBe(noun ? 'items' : 'practice');
      expect(c.retestItems, d.slug).toBe(noun ? SAME_PLURAL[noun] : undefined);
    }
  });
});

describe('Aynı soruların geldiği testlerde rapor cevap anahtarı olmaz', () => {
  const FIXED = TASKS.filter((d) => d.tasks.some((t) => SAME_ITEMS.has(t.kind)));
  /** Kelime listesi görevinin bütün kelimeleri (iki liste ve tanıma listesi). */
  const listWords = (d: TaskInstrument) =>
    d.tasks.flatMap((t) => (t.kind === 'word_list' ? [...t.listA, ...t.listB, ...t.recognition] : [])).map((w) => w.toLocaleLowerCase('tr-TR'));
  const hasWord = (text: string, w: string) => new RegExp(`(?:^|[^\\p{L}])${w}(?:[^\\p{L}]|$)`, 'u').test(text.toLocaleLowerCase('tr-TR'));

  it('bölümün girişi içeriğin ve cevapların neden yazılmadığını söyler; soru soru kartı olan her test bu türdendir', () => {
    expect(FIXED.length).toBeGreaterThan(20);
    for (const d of TASKS) {
      for (const r of reportsOf(d.slug, (TASK_VARIANTS[d.slug].varsayilan as Make)())) {
        const at = `${d.slug} ${r.audience}`;
        const answers = partOf(r, 'answers')!;
        const intro = answers.intro ?? '';
        const noun = sameNounOf(d);
        // Soru soru (dizi dizi, işlem işlem…) kartı olan her test, içeriği her seferinde aynı gelen testtir.
        if (partCards(answers).some((c) => c.visual?.type === 'items')) expect(noun, at).not.toBeNull();
        expect(intro, at).not.toMatch(/verilen cevap,|doğrusu/);
        if (noun && partCards(answers).some((c) => c.visual?.type === 'items')) {
          expect(intro, at).toContain(`Bu testte her seferinde aynı ${SAME_PLURAL[noun]} gelir.`);
          expect(intro, at).toContain(`Bu yüzden burada ne ${SAME_PLURAL[noun]} ne de cevaplar yazılır;`);
        }
      }
    }
  });

  it('kelime listesinde yazılan kelimeler yazılmaz: ek bölümlerin hiçbir yerinde listelerin kelimeleri yok (bütün örüntüler)', () => {
    const d = TASKS.find((x) => x.slug === 'kelime-listesi-hatirlama')!;
    const words = listWords(d);
    expect(words.length).toBeGreaterThan(20);
    for (const [name, make] of variantsOf(d.slug)) {
      for (const r of reportsOf(d.slug, make())) {
        for (const [p, c] of allCards(r)) {
          const text = [c.title, c.badge, c.text, ...(c.spoken ?? []), ...(c.rows ?? []).flatMap((x) => [x.text, x.value, x.say ?? '', ...x.tags])].join(' · ');
          for (const w of words) expect(hasWord(text, w), `${name} ${r.audience} ${p.key} ${c.key}: ${w}`).toBe(false);
        }
      }
    }
  });

  /**
   * Testin her seferinde aynı gelen içeriği, yazıyla: rakam, harf-sayı ve harf dizileri (gösterilen ve doğru sıra), desenler ve
   * işlemler. `anywhere`: raporun hiçbir yerinde yok. `answersOnly`: soru soru bölümünde ve günlük hayat örneklerinde aranır
   * (işlemlerde düzeylerin adları ve iki ipucu bilerek birer örnek işlem gösterir; kişinin cevabını göstermez).
   */
  function contentOf(d: TaskInstrument): { anywhere: string[]; answersOnly: string[] } {
    const anywhere: string[] = [];
    const answersOnly: string[] = [];
    for (const t of d.tasks) {
      if (t.kind === 'digit_span')
        for (const seq of t.sequences.flat()) if (seq.length >= 3) anywhere.push(seq.join(' '), [...seq].reverse().join(' '));
      if (t.kind === 'letter_number')
        for (const seq of t.levels.flatMap((l) => l.items)) if (seq.length >= 3) anywhere.push([...seq].join(' '), lnAnswer(seq).join(' '));
      if (t.kind === 'complex_span') for (const set of t.sets) anywhere.push(set.letters.map((i) => t.letters[i]).join(' '));
      if (t.kind === 'pattern_memory') for (const it of t.levels.flatMap((l) => l.items)) anywhere.push(patternText(it));
      if (t.kind === 'mental_arithmetic') for (const it of t.items) answersOnly.push(arithText(t.op, it), arithSpoken(t.op, it));
    }
    return { anywhere: [...new Set(anywhere)], answersOnly: [...new Set(answersOnly)] };
  }
  const NEW_KINDS = new Set(['digit_span', 'letter_number', 'complex_span', 'pattern_memory', 'mental_arithmetic']);
  const CONTENT = TASKS.filter((d) => d.tasks.some((t) => NEW_KINDS.has(t.kind)));
  const norm = (x: string) => x.replace(/\s+/g, ' ');

  it('diziler, desenler ve işlemler ek bölümlerde, sesli dinlemede yazılmaz (bütün örüntüler, öğrenci, veli, yetişkin)', () => {
    expect(CONTENT.map((d) => d.slug).sort()).toEqual(['desen-hatirlama', 'dikkat-ve-bellek', 'harf-sayi-siralama', 'hesapla-ve-hatirla', 'zihinden-hesaplama-hizi']);
    for (const d of CONTENT) {
      const { anywhere, answersOnly } = contentOf(d);
      expect(anywhere.length + answersOnly.length, d.slug).toBeGreaterThanOrEqual(10);
      for (const [name, make] of variantsOf(d.slug)) {
        for (const r of reportsOf(d.slug, make())) {
          const at = `${d.slug} ${name} ${r.audience}`;
          const answersTitle = partOf(r, 'answers')!.title;
          for (const [p, c] of allCards(r)) {
            const text = norm([c.title, c.badge, c.text, ...(c.spoken ?? []), ...(c.rows ?? []).flatMap((x) => [x.text, x.value, x.say ?? '', x.spoken ?? '', ...x.tags])].join(' · '));
            // İşlemler soru soru bölümünde ve günlük hayat örneklerinde de yok (örnekler testteki işlemlerden seçilmez).
            for (const x of [...anywhere, ...(p.key === 'answers' || p.key === 'daily' ? answersOnly : [])]) expect(text, `${at} ${p.key} ${c.key}: ${x}`).not.toContain(x);
          }
          const utter = utterancesOf(reportSpeech(r).results);
          const heard = norm(utter.map((u) => u.text).join(' '));
          const dailyTitle = partOf(r, 'daily')?.title;
          const heardAnswers = norm(utter.filter((u) => u.section === answersTitle.replace(/[.:?]$/, '')).map((u) => u.text).join(' '));
          const heardDaily = dailyTitle ? norm(utter.filter((u) => u.section === dailyTitle.replace(/[.:?]$/, '')).map((u) => u.text).join(' ')) : '';
          expect(heardAnswers.length, at).toBeGreaterThan(0);
          for (const x of anywhere) expect(heard, `${at} sesli: ${x}`).not.toContain(x);
          for (const x of answersOnly) expect(`${heardAnswers} ${heardDaily}`, `${at} sesli: ${x}`).not.toContain(x);
        }
      }
    }
  }, 600_000);

  /**
   * PDF'te denenen örüntüler: olağan sonuç ve yanlışların çok olduğu bir sonuç (PDF çizimi uzun sürer; bütün örüntülerde
   * satırlar ve sesli okuma yukarıda denenir, PDF'in satırları da raporun satırlarıyla birebir aynı yazılır).
   */
  const PDF_VARIANTS: Record<string, string[]> = {
    'desen-hatirlama': ['varsayilan', 'hicbiri'],
    'dikkat-ve-bellek': ['varsayilan', 'zorlanan'],
    'harf-sayi-siralama': ['varsayilan', 'hicbiri'],
    'hesapla-ve-hatirla': ['varsayilan', 'uzunZor'],
    'zihinden-hesaplama-hizi': ['varsayilan', 'elde'],
  };

  it('PDF: diziler, desenler ve işlemler yazılmaz (öğrenci, veli, yetişkin; işlemler ekte aranır)', async () => {
    for (const d of CONTENT) {
      const { anywhere, answersOnly } = contentOf(d);
      for (const name of PDF_VARIANTS[d.slug]) {
        const make = TASK_VARIANTS[d.slug][name] as Make;
        for (const r of reportsOf(d.slug, make())) {
          const at = `${d.slug} ${name} ${r.audience}`;
          const text = norm(pdfText(await renderSimpleReportPdf(r, 'olcekhane.com')));
          // Ek (soru soru bölümü) PDF'in sonundadır: başlığının son geçtiği yerden sonrası.
          const title = partOf(r, 'answers')!.title;
          const from = text.lastIndexOf(title);
          expect(from, at).toBeGreaterThan(0);
          const appendix = text.slice(from);
          for (const x of anywhere) expect(text, `${at}: ${x}`).not.toContain(x);
          for (const x of answersOnly) expect(appendix, `${at}: ${x}`).not.toContain(x);
          // Ekin satırları raporun satırlarıyla aynı: numara, yer, sonuç.
          for (const c of partCards(partOf(r, 'answers')!))
            for (const row of c.rows ?? []) expect(pdfFlat(appendix), `${at} ${c.key} ${row.no}`).toContain(pdfFlat(`${row.no}. ${row.text ? `${row.text} · ` : ''}${row.value}`));
        }
      }
    }
  }, 900_000);

  it('PDF: satırlar yalnızca yer, sonuç, etiketler ve süre; hiçbir yerde seçenek numarası ya da listenin kelimeleri yok', async () => {
    // Dizi, desen ve işlem testlerinin PDF'i yukarıda denenir.
    for (const d of FIXED.filter((x) => !CONTENT.includes(x))) {
      const words = listWords(d);
      for (const r of reportsOf(d.slug, (TASK_VARIANTS[d.slug].varsayilan as Make)())) {
        const at = `${d.slug} ${r.audience}`;
        const text = pdfText(await renderSimpleReportPdf(r, 'olcekhane.com'));
        const flat = pdfFlat(text);
        expect(flat, at).not.toMatch(/\d+\.seçenek|doğrusu/);
        // PDF satırları raporun satırlarıyla aynı yazılır: numara, yer, sonuç (verilen cevap yok).
        for (const c of partCards(partOf(r, 'answers')!))
          for (const row of c.rows ?? []) expect(flat, `${at} ${c.key} ${row.no}`).toContain(pdfFlat(`${row.no}. ${row.text ? `${row.text} · ` : ''}${row.value}`));
        for (const w of words) expect(hasWord(text.replace(/\s+/g, ' '), w), `${at}: ${w}`).toBe(false);
      }
    }
  }, 600_000);
});

describe('Ana rapordaki görev kartları', () => {
  it('yorumlanmayan kartın (interpreted: false) grafiği yok, ölçülen en alt sonucunki kalır: bütün testler, örüntüler, kitleler', () => {
    // Ölçülen en alt sonuç (hiçbir düzeye ulaşılmadı, en kısa dizi de tekrarlanmadı) bir sonuçtur, yalnızca karşılaştırılmaz:
    // grafiği kalır (lib/reports/simple.ts, floorVisual). Ötekilerin grafiğini toSimpleReport kaldırır.
    let unread = 0;
    let floors = 0;
    for (const d of TASKS) {
      for (const [name, make] of variantsOf(d.slug)) {
        const body = make();
        if (body.data.engine !== 'tasks') continue;
        const inputs = new Map<string, TaskInputs>(Object.entries(body.data.blocks).map(([k, v]) => [k, v as TaskInputs]));
        const scores = taskScoreRows(d, inputs, body.data.seed).rows.map(toReportScore);
        const reports = reportsOf(d.slug, body);
        for (const audience of ['student', 'parent', ...(d.adults ? (['adult'] as const) : [])] as const) {
          const grade = audience === 'adult' ? ADULT_GRADE : body.grade;
          const r = reports.find((x) => x.audience === audience)!;
          for (const b of buildReport({ def: d, scores, audience, studentName: '', grade, completedAt: new Date() }).cognitive!.blocks) {
            if (b.interpreted !== false) continue;
            const at = `${d.slug} ${name} ${audience} ${b.key}`;
            const it = r.items.find((x) => x.title === b.name)!;
            expect(it, at).toBeDefined();
            if (floorVisual(b)) {
              floors++;
              expect(it.visual, at).toEqual(b.visual);
              expect(it.interpreted, at).toBeUndefined();
            } else {
              unread++;
              expect(it.visual, at).toBeUndefined();
              expect(it.interpreted, at).toBe(false);
            }
          }
        }
      }
    }
    expect(unread).toBeGreaterThan(20);
    expect(floors).toBeGreaterThan(0);
  }, 300_000);
});
