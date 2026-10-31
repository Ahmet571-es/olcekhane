import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { AssessmentError, evaluateReports } from '@/lib/assessment/evaluate';
import {
  RECORD_MARK,
  compareResults,
  encodeRecords,
  gapText,
  readRecords,
  toRecord,
  type CompareInfo,
  type CompareRow,
  type ResultRecord,
} from '@/lib/compare/record';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderPackageReportPdf, renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { footerText, noneText, otherTestText, retestNote, rowText, signed, trackX, valueText, withUnit } from '@/components/test/compare-panel';
import { TASK_COMPARE, TASK_COMPARE_SINCE, specKey } from '@/lib/compare/tasks';
import { arithPct, pctValue, secondsValue, sgPct, snValue, towerTenths } from '@/lib/reports/build';
import type { TaskInstrument } from '@/lib/instruments/types';
import { likertBody, quizBody, readingBody } from './helpers/bodies';
import { TASK_VARIANTS } from './helpers/task-variants';
import { schoolWords } from './helpers/school';

const LIKERT = publicInstruments().filter((d): d is LikertInstrument => d.engine === 'likert');
const reportsOf = (slug: string, grade: number, pick: (i: number) => number) =>
  Object.values(evaluateReports(slug, likertBody(slug, grade, pick))) as SimpleReport[];
const gradeFor = (d: LikertInstrument) => (gradeAllowed(d, 9) ? 9 : d.minGrade);

const info = (scales: Partial<CompareInfo['scales'][number]>[], date = '2026-10-30T12:00:00.000Z'): CompareInfo => ({
  slug: 'deneme',
  version: 2,
  date,
  scales: scales.map((s, i) => ({ key: `k${i}`, label: `Ölçek ${i}`, value: 3, min: 1, max: 5, sem: 0.2, decimals: 1, band: 'Orta', ...s })),
});
const rec = (values: [number, string | null][], date = '2026-04-30T12:00:00.000Z', v = 2, s = 'deneme'): ResultRecord => ({
  s,
  v,
  d: date,
  r: values.map(([x, b], i) => [`k${i}`, x, b]),
});

describe('Gelişimini karşılaştır: raporlardaki bilgi', () => {
  it('her anket testinde öğrenci, veli ve yetişkin raporu ölçek ölçek puan, aralık, düzey ve (güvenirliği biliniyorsa) ölçüm payı taşır', () => {
    expect(LIKERT.length).toBeGreaterThan(20);
    for (const d of LIKERT) {
      for (const grade of [gradeFor(d), ...(gradeAllowed(d, ADULT_GRADE) ? [ADULT_GRADE] : [])]) {
        for (const r of reportsOf(d.slug, grade, (i) => (i * 3 + 1) % 5)) {
          const c = r.compare!;
          expect(c, `${d.slug} ${r.audience}`).toBeDefined();
          expect(c.slug).toBe(d.slug);
          expect(c.version).toBe(d.version);
          expect(Number.isNaN(Date.parse(c.date))).toBe(false);
          expect(c.scales.map((s) => s.key), d.slug).toEqual(d.scales.map((s) => s.key));
          for (const s of c.scales) {
            const scale = d.scales.find((x) => x.key === s.key)!;
            expect(s.label).toBe(scale.name);
            expect(s.value, `${d.slug} ${s.key}`).toBeGreaterThanOrEqual(s.min);
            expect(s.value, `${d.slug} ${s.key}`).toBeLessThanOrEqual(s.max);
            expect(s.decimals).toBe(d.scoring.method === 'mean' ? 1 : 0);
            expect(s.sem !== null, `${d.slug} ${s.key}`).toBe(!!(scale.alpha && scale.sdRef));
            if (s.sem !== null) expect(s.sem).toBeGreaterThan(0);
            expect(s.band, `${d.slug} ${s.key}`).toBeTruthy();
          }
        }
      }
    }
  });

  it('karşılaştırma yalnızca anket ve görev testlerinde: konu tarama, okuma ve sesli okumada yok', () => {
    const engines = new Set(publicInstruments().map((d) => d.engine));
    expect([...engines].sort()).toEqual(['likert', 'oral', 'quiz', 'reading', 'tasks']);
    for (const r of Object.values(evaluateReports('matematik-konu-tarama-testi', quizBody(6, 3))) as SimpleReport[]) expect(r.compare).toBeUndefined();
    for (const r of Object.values(evaluateReports('okuma-hizi-ve-anlama', readingBody(5))) as SimpleReport[]) expect(r.compare).toBeUndefined();
    // Sesli okumanın raporu kendi kurulumunda hazırlanır (karşılaştırma bilgisi eklenmeden döner).
    const src = readFileSync(new URL('../src/lib/assessment/evaluate.ts', import.meta.url), 'utf8');
    expect(src).toContain("if (def.engine === 'tasks') return taskCompareInfo(def, content, rows);");
    expect(src).toContain("if (def.engine !== 'likert') return undefined;");
    expect(src.indexOf("if (def.engine === 'oral')")).toBeLessThan(src.indexOf('const compare = compareInfo('));
  });
});

describe('Gelişimini karşılaştır: PDF', () => {
  it('tek testin PDF’i sonucun özetini taşır; dosyadan geri okunur ve aynı sonuçla karşılaştırınca her ölçek "Aynı"', async () => {
    const [student] = reportsOf('bes-faktor-kisilik', 8, (i) => i % 5);
    const pdf = await renderSimpleReportPdf(student, 'olcekhane.com');
    const records = readRecords(new Uint8Array(pdf));
    expect(records).toEqual([toRecord(student.compare!)]);
    // Özette ad, sınıf ya da cevap yok: yalnızca test, sürüm, tarih ve ölçek puanları.
    expect(Object.keys(records![0]).sort()).toEqual(['d', 'r', 's', 'v']);
    const out = compareResults(student.compare!, records!);
    expect(out.status).toBe('ok');
    if (out.status === 'ok') expect(out.rows.map((r) => r.verdict)).toEqual(student.compare!.scales.map(() => 'same'));
  }, 60_000);

  it('paket PDF’i anket testlerinin özetlerini taşır; her test kendi özetini bulur', async () => {
    const grade = 9;
    const entries = (['bes-faktor-kisilik', 'meslek-ilgi-alanlari'] as const).map((slug) => ({
      slug,
      skill: slug,
      areaName: slug,
      report: reportsOf(slug, grade, (i) => (i * 7) % 5)[0],
    }));
    const pdf = await renderPackageReportPdf({ entries, skipped: [], gradeLabel: '9. sınıf', completedAt: new Date() }, 'olcekhane.com');
    const records = readRecords(new Uint8Array(pdf))!;
    expect(records.map((r) => r.s)).toEqual(['bes-faktor-kisilik', 'meslek-ilgi-alanlari']);
    for (const e of entries) expect(compareResults(e.report.compare!, records).status).toBe('ok');
  }, 120_000);

  it('özeti olmayan, bozuk ya da başka biçimde dosyalar reddedilir', () => {
    const bytes = (s: string) => new TextEncoder().encode(s);
    expect(readRecords(bytes('%PDF-1.4 hiçbir şey yok'))).toBeNull();
    expect(readRecords(bytes(`(${RECORD_MARK}bozuk!!)`))).toBeNull();
    expect(readRecords(bytes(`(${encodeRecords([])})`))).toBeNull();
    expect(readRecords(bytes(`(${RECORD_MARK}${btoa(JSON.stringify([{ s: 'x', v: '1', d: 'tarih', r: [] }]))})`))).toBeNull();
    // Türkçe düzey adları (UTF-8) kodlanıp geri okunur.
    const r = rec([[3.4, 'Çok yüksek'], [2, null]]);
    expect(readRecords(bytes(`/Keywords (${encodeRecords([r])})`))).toEqual([r]);
  });
});

describe('Gelişimini karşılaştır: karşılaştırma', () => {
  it('güvenilir değişim: fark √2·SEM·1,96’yı aşınca belirgin; aşmayınca ölçüm payı içinde; ölçüm payı bilinmeyince yalnızca yön', () => {
    // SEM 0,2 → eşik 1,96·√2·0,2 ≈ 0,554.
    const cur = info([{ value: 3.6 }, { value: 3.5 }, { value: 2.4 }, { value: 3.5, sem: null }, { value: 3.04 }, { value: 2.5, sem: null }]);
    const out = compareResults(cur, [rec([[3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta'], [3.0, 'Orta']])]);
    expect(out.status).toBe('ok');
    if (out.status !== 'ok') return;
    expect(out.rows.map((r) => r.verdict)).toEqual(['up', 'stable', 'down', 'up-unknown', 'same', 'down-unknown']);
    expect(out.days).toBe(183);
    expect(out.known).toBe(true);
    expect(gapText(out.days)).toBe('yaklaşık 6 ay');
  });

  it('başka testin ya da başka sürümün özeti karşılaştırılmaz; pakette aynı testin özeti seçilir', () => {
    const cur = info([{ value: 3 }]);
    expect(compareResults(cur, [rec([[3, 'Orta']], undefined, 2, 'baska')])).toEqual({ status: 'other-test' });
    expect(compareResults(cur, [rec([[3, 'Orta']], undefined, 1)])).toEqual({ status: 'version' });
    expect(compareResults(cur, [rec([[3, 'Orta']], undefined, 2, 'baska'), rec([[2, 'Düşük']])]).status).toBe('ok');
    // Aralık dışındaki (bozuk) puan karşılaştırılmaz.
    const bad = compareResults(cur, [rec([[9, 'Orta']])]);
    expect(bad.status === 'ok' && bad.rows.length).toBe(0);
  });

  it('süre: aynı gün, gün, ay, yıl', () => {
    expect(gapText(0)).toBe('aynı gün');
    expect(gapText(12)).toBe('12 gün');
    expect(gapText(-12)).toBe('12 gün');
    expect(gapText(90)).toBe('yaklaşık 3 ay');
    expect(gapText(550)).toBe('yaklaşık 1,5 yıl');
  });

  it('satır metinleri: düzey değiştiyse söylenir; fark ölçüm payı içindeyken düzeyin değişmesi sınıra yakınlıkla açıklanır; çelişki yok', () => {
    const row = (verdict: CompareRow['verdict'], bandBefore: string | null, bandAfter: string | null): CompareRow => ({
      key: 'k',
      label: 'Ölçek',
      before: 3,
      after: 3.3,
      min: 1,
      max: 5,
      decimals: 1,
      bandBefore,
      bandAfter,
      verdict,
    });
    for (const v of ['up', 'down', 'stable', 'up-unknown', 'down-unknown', 'same'] as const) {
      for (const [a, b] of [['Orta', 'Orta'], ['Orta', 'Yüksek'], [null, 'Orta']] as const) {
        const t = rowText(row(v, a, b));
        expect(t, `${v} ${a} ${b}`).toMatch(/\.$/);
        expect(t.includes('“Orta” → “Yüksek”') || t.includes('“Orta” iken “Yüksek”'), `${v} ${a} ${b}`).toBe(a === 'Orta' && b === 'Yüksek');
        if (v === 'stable' && a !== b && a) expect(t).toContain('sınırına yakın');
        if (v.endsWith('unknown')) expect(t).toContain('söylenemez');
        expect(schoolWords(t)).toEqual([]);
      }
    }
  });

  it('ekran: dosya yalnızca tarayıcıda okunur; depo, çerez ya da istek yok; veli sekmesinde "siz" dili', () => {
    const ui = readFileSync(new URL('../src/components/test/compare-panel.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    expect(ui).toContain('Önceki sonuçla karşılaştırın');
    expect(ui).toContain('Jacobson ve Truax, 1991');
    for (const f of ['../src/components/test/test-session.tsx', '../src/components/paket/package-session.tsx']) {
      expect(readFileSync(new URL(f, import.meta.url), 'utf8')).toContain('<ComparePanel');
    }
  });

  it('yetişkin raporu okula özgü sözcük taşımaz; geçersiz sınıfta rapor zaten verilmez', () => {
    const d = LIKERT.find((x) => gradeAllowed(x, ADULT_GRADE))!;
    const [adult] = reportsOf(d.slug, ADULT_GRADE, (i) => i % 5);
    expect(schoolWords(JSON.stringify(adult.compare))).toEqual([]);
    expect(() => evaluateReports('oz-saygi', likertBody('oz-saygi', 2, (i) => i))).toThrow(AssessmentError);
  });
});

const TASKS = publicInstruments().filter((d): d is TaskInstrument => d.engine === 'tasks');

/** Görev testinin bir örnek sonucunun raporları: öğrenci, veli ve (açıksa) yetişkin. */
function variantReports(d: TaskInstrument, name: string): SimpleReport[] {
  const body = TASK_VARIANTS[d.slug][name]();
  const grade = Math.max(body.grade, d.minGrade);
  const school = Object.values(evaluateReports(d.slug, { ...body, grade })) as SimpleReport[];
  const adult = gradeAllowed(d, ADULT_GRADE) ? (Object.values(evaluateReports(d.slug, { ...body, grade: ADULT_GRADE })) as SimpleReport[]) : [];
  return [...school, ...adult];
}

const nf = (x: number, d: number, trim = false) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: trim ? 0 : d, maximumFractionDigits: d }).format(x);

/**
 * Bağımsız kural: özete yazılan her sayı, raporda kendi kartının başlığında, metninde ya da öne çıkan sayılarda aynı biçimde
 * yazar ("18" / "%88" / "0,73 saniye" / "1 dakika 15 saniye" / "bir saniyeden kısa" / "8,2 derece"). Sayının kartı yoksa ya
 * da kart yorumlanmamışsa (rapor "Yorumlanmadı" ya da benzerini yazıyorsa) sayı özette olmamalıdır.
 */
function writtenIn(hay: string, value: number, s: CompareInfo['scales'][number]): boolean {
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const words = (t: string) => new RegExp(`(^|[^0-9,])${esc(t)}([^0-9,]|$)`).test(hay);
  if (s.unit === '%') return hay.includes(`%${nf(value, s.decimals)}`);
  if (s.unit === 'sn') {
    if (value === 0 && (s.format === 'clock' || s.format === 'trim')) return hay.includes('bir saniyeden kısa');
    if (s.format === 'clock' && value >= 60) {
      const m = Math.floor(value / 60);
      return hay.includes(value % 60 ? `${m} dakika ${value % 60} saniye` : `${m} dakika`);
    }
    const n = nf(value, s.decimals, s.format === 'trim' || s.format === 'clock');
    return words(`${n} saniye`) || words(`${n} sn`);
  }
  if (s.unit === 'derece') return words(`${nf(value, s.decimals, true)} derece`);
  return words(nf(value, 0));
}

/** Kartında yazmayan, ama raporda başka biçimde anlatılan sayılar (bilerek). */
const NOT_IN_CARD = new Set<string>([]);

describe('Gelişimini karşılaştır: görev testleri', () => {
  it('yayındaki her görev testinin karşılaştırılan sayıları tanımlı; anahtarlar testin ölçekleri, testteki sırayla', () => {
    expect(TASKS.length).toBeGreaterThanOrEqual(28);
    expect(Object.keys(TASK_COMPARE).sort()).toEqual(TASKS.map((d) => d.slug).sort());
    for (const d of TASKS) {
      const keys = d.scales.map((s) => s.key);
      const idx = TASK_COMPARE[d.slug].map((s) => keys.indexOf(s.key));
      expect(idx.every((i) => i >= 0), d.slug).toBe(true);
      expect([...idx].sort((a, b) => a - b), d.slug).toEqual(idx);
      expect(new Set(TASK_COMPARE[d.slug].map(specKey)).size, d.slug).toBe(TASK_COMPARE[d.slug].length);
    }
  });

  it('özetteki her sayı raporda kendi kartında ya da öne çıkan sayılarda aynı biçimde yazar; kartı yorumlanmayan sayı özette yok', () => {
    const misses: string[] = [];
    for (const d of TASKS) {
      const spec = TASK_COMPARE[d.slug];
      const seen = new Set<string>();
      for (const name of Object.keys(TASK_VARIANTS[d.slug])) {
        for (const r of variantReports(d, name)) {
          const label = `${d.slug} [${name}] ${r.audience}`;
          const c = r.compare;
          if (!c) continue;
          expect(c.slug, label).toBe(d.slug);
          expect(c.version, label).toBe(d.version);
          expect(c.since, label).toBe(TASK_COMPARE_SINCE);
          expect(['items', 'practice'], label).toContain(c.retest);
          const order = spec.map(specKey);
          const idx = c.scales.map((s) => order.indexOf(s.key));
          expect(idx.every((i) => i >= 0), label).toBe(true);
          expect([...idx].sort((a, b) => a - b), label).toEqual(idx);
          for (const sc of c.scales) {
            seen.add(sc.key);
            expect(sc.value, `${label} ${sc.key}`).toBeGreaterThanOrEqual(sc.min);
            expect(sc.value, `${label} ${sc.key}`).toBeLessThanOrEqual(sc.max);
            expect(sc.sem, label).toBeNull();
            expect(!!sc.time, `${label} ${sc.key}`).toBe(sc.unit === 'sn');
            const base = sc.key.split('.')[0];
            const card = r.items.find((it) => it.title === d.scales.find((x) => x.key === base)!.name);
            expect(card, `${label} ${sc.key} kartı yok`).toBeDefined();
            // Yorumlanmayan kartın başlığı sonuç yerine durum söyler; o kartın sayısı özette olmamalı.
            expect(card!.badge ?? '', `${label} ${sc.key}`).not.toMatch(/^(Yorumlanmadı|Hesaplanamadı|Süre hesaplanamadı|Cevap verilmedi|Hiç basılmadı)$/);
            const hay = [card!.badge ?? '', card!.text, ...r.keyFigures.map((k) => `${k.label} ${k.value}`)].join(' | ');
            if (!NOT_IN_CARD.has(`${d.slug}:${sc.key}`) && !writtenIn(hay, sc.value, sc)) misses.push(`${label} ${sc.key} = ${valueText(sc.value, sc)} :: ${card!.badge}`);
          }
          if (r.audience === 'adult') expect(schoolWords(JSON.stringify(c)), label).toEqual([]);
        }
      }
      for (const k of spec.map(specKey)) expect(seen.has(k), `${d.slug} ${k} hiçbir örnekte yok`).toBe(true);
    }
    expect(misses).toEqual([]);
  }, 300_000);

  it('hiçbir sonucu yorumlanmayan örneklerde karşılaştırma bölümü yok; rastgele cevaplarda doğru sayısı özete girmez', () => {
    const NONE: Record<string, string[]> = {
      'simge-bulma': ['az', 'hic', 'tekDugme', 'rastgele'],
      'zihinden-hesaplama-hizi': ['rastgele'],
      'bakis-acisi-alma': ['cevapsiz'],
      'planlama-kule-gorevi': ['bosta'],
      'surekli-dikkat': ['cokAz'],
      'geriye-donuk-hatirlama': ['sessiz'],
      'kelime-listesi-hatirlama': ['cevapsiz'],
      'zihinde-dondurme': ['ters', 'cevapsiz', 'erken'],
      'kural-degistirme': ['cevapsiz'],
    };
    for (const [slug, names] of Object.entries(NONE)) {
      const d = TASKS.find((x) => x.slug === slug)!;
      for (const n of names) for (const r of variantReports(d, n)) expect(r.compare, `${slug} ${n}`).toBeUndefined();
    }
    const keysOf = (slug: string, v: string) => (variantReports(TASKS.find((x) => x.slug === slug)!, v)[0].compare?.scales ?? []).map((x) => x.key);
    for (const p of ['sa', 'sb', 'sz', 'kk', 'kp', 'gs', 'kb']) {
      const slug = Object.keys(TASK_COMPARE).find((k) => TASK_COMPARE[k][0].key === `${p}_dogru`)!;
      expect(keysOf(slug, 'rastgele'), slug).not.toContain(`${p}_dogru`);
      expect(keysOf(slug, 'rastgele'), slug).not.toContain(`${p}_duzey`);
    }
    for (const [slug, p] of [['sayi-dizileri', 'sd'], ['harf-dizileri', 'hd']] as const) {
      for (const v of ['bilmiyorum', 'rastgele']) {
        expect(keysOf(slug, v), `${slug} ${v}`).not.toContain(`${p}_dogru`);
        expect(keysOf(slug, v), `${slug} ${v}`).not.toContain(`${p}_duzey`);
      }
    }
    expect(keysOf('dur-git-gorevi', 'hicBasmadi')).not.toContain('dg_tepki');
    expect(keysOf('renk-kelime-gorevi', 'cevapsiz')).not.toContain('renk_dogruluk');
    expect(keysOf('kural-degistirme', 'tekDugme')).not.toContain('kd_dogruluk');
    expect(keysOf('geriye-donuk-hatirlama', 'rastgele')).toEqual([]);
    expect(keysOf('hesapla-ve-hatirla', 'rastgele')).not.toContain('hb_islem');
    // Gerçek bir sonuç olan "Düzey belirtilmedi" (kuşku yokken) özete 0 diye girer.
    const zero = TASKS.flatMap((d) =>
      Object.keys(TASK_VARIANTS[d.slug]).flatMap((n) => (variantReports(d, n)[0].compare?.scales ?? []).filter((x) => /_duzey$/.test(x.key) && x.value === 0)),
    );
    for (const z of zero) expect(z.min).toBe(0);
  }, 300_000);

  it('zihinden hesaplama: toplamlar yalnızca dört bölüm de yorumlandıysa; eksik bölümlü sonuçla toplam karşılaştırılmaz', () => {
    const d = TASKS.find((x) => x.slug === 'zihinden-hesaplama-hizi')!;
    const c = (v: string) => variantReports(d, v)[0].compare!;
    for (const v of ['bolmeYok', 'tekBolum']) {
      const keys = c(v).scales.map((x) => x.key);
      for (const k of ['zh_genel', 'zh_dogruluk', 'zh_hiz']) expect(keys, `${v} ${k}`).not.toContain(k);
    }
    expect(c('hepsi').scales.map((x) => x.key)).toEqual(['zh_genel', 'zh_toplama', 'zh_cikarma', 'zh_carpma', 'zh_bolme', 'zh_dogruluk', 'zh_hiz']);
    const out = compareResults(c('bolmeYok'), [toRecord(c('hepsi'))]);
    expect(out.status).toBe('ok');
    if (out.status === 'ok') {
      expect(out.rows.map((r) => r.key)).toEqual(['zh_toplama', 'zh_cikarma', 'zh_carpma']);
      expect(out.rows.some((r) => r.label.startsWith('Dört bölümde'))).toBe(false);
    }
  });

  it('yuvarlama raporla aynı: yüzde, saniye, Simge Bulma ve zihinden hesaplama yüzdeleri, kule süresi', () => {
    // 23/40 × 100 kayan noktada 57,4999…: raporun yüzdesi de aynı hesapla %57 yazar (pct, pctValue'yu kullanır).
    expect(pctValue(23 / 40)).toBe(57);
    expect(pctValue(0.8145)).toBe(81);
    expect(sgPct(56, 63)).toBe(88);
    expect(arithPct(199, 200)).toBe(99);
    expect(arithPct(200, 200)).toBe(100);
    expect(snValue(565)).toBe(0.57);
    expect(snValue(1005)).toBe(1.01);
    expect(secondsValue(499)).toBe(0);
    expect(secondsValue(500)).toBe(1);
    expect(secondsValue(75_400)).toBe(75);
    expect(towerTenths(4_250)).toBe(4.3);
    expect(towerTenths(12_400)).toBe(12);
    expect(towerTenths(300)).toBe(0);
    // Panel yazımı raporunkiyle aynı.
    const s = (o: Partial<CompareRow>) => ({ decimals: 0 as const, max: 100, ...o });
    expect(valueText(0.57, s({ unit: 'sn', decimals: 2 }))).toBe('0,57 sn');
    expect(valueText(0, s({ unit: 'sn', format: 'clock' }))).toBe('1 sn’den kısa');
    expect(valueText(75, s({ unit: 'sn', format: 'clock' }))).toBe('1 dk 15 sn');
    expect(valueText(120, s({ unit: 'sn', format: 'clock' }))).toBe('2 dk');
    expect(valueText(4, s({ unit: 'sn', format: 'trim', decimals: 1 }))).toBe('4 sn');
    expect(valueText(4.3, s({ unit: 'sn', format: 'trim', decimals: 1 }))).toBe('4,3 sn');
    expect(valueText(8.2, s({ unit: 'derece', format: 'trim', decimals: 1 }))).toBe('8,2 derece');
    expect(valueText(18, s({ outOf: true, max: 24 }))).toBe('18/24');
    expect(valueText(88, s({ unit: '%' }))).toBe('%88');
  });

  it('farkın yazımı: puan, saniye, derece, eksi işareti ve sıfır', () => {
    const s = (o: Partial<CompareRow>) => ({ decimals: 0 as const, max: 100, ...o });
    expect(signed(4, s({ unit: '%' }))).toBe('+4 puan');
    expect(signed(-4, s({ unit: '%' }))).toBe('−4 puan');
    expect(signed(0, s({ unit: '%' }))).toBe('0 puan');
    expect(signed(-0.25, s({ unit: 'sn', decimals: 2 }))).toBe('−0,25 sn');
    expect(signed(-65, s({ unit: 'sn', format: 'clock' }))).toBe('−1 dk 5 sn');
    expect(signed(0, s({ unit: 'sn', format: 'clock' }))).toBe('0 sn');
    expect(signed(1.5, s({ unit: 'derece', format: 'trim', decimals: 1 }))).toBe('+1,5 derece');
    expect(signed(2, s({ outOf: true, max: 24 }))).toBe('+2');
    expect(signed(-3, s({}))).toBe('−3');
    expect(signed(0, s({}))).toBe('0');
    expect(withUnit('88', '%')).toBe('%88');
    expect(withUnit('1,5', 'sn')).toBe('1,5 sn');
    expect(withUnit('18', undefined)).toBe('18');
  });

  it('çizim: aralık, sınır dışı değerler kenarda, açık aralıkta iki değerin büyüğüne göre, iki süre de sıfırsa ortada', () => {
    const W = 200;
    const fixed = { min: 0, max: 24, before: 18, after: 20 };
    expect(trackX(fixed, 0, W)).toBe(6);
    expect(trackX(fixed, 24, W)).toBe(194);
    expect(trackX(fixed, 30, W)).toBe(194);
    expect(trackX(fixed, -5, W)).toBe(6);
    expect(trackX({ min: -100, max: 100, before: 0, after: 0 }, 0, W)).toBe(100);
    const open = { min: 0, max: 100_000, before: 1.6, after: 2, open: true as const };
    expect(trackX(open, 2, W)).toBeCloseTo(6 + (2 / 2.5) * 188, 6);
    expect(trackX(open, 0, W)).toBe(6);
    expect(trackX({ ...open, before: 0, after: 0 }, 0, W)).toBe(100);
  });

  it('görev raporunun PDF’i özeti taşır; geri okunur; tek başına ve pakette', async () => {
    const [student] = Object.values(evaluateReports('simge-bulma', TASK_VARIANTS['simge-bulma'].varsayilan())) as SimpleReport[];
    const records = readRecords(new Uint8Array(await renderSimpleReportPdf(student, 'olcekhane.com')));
    expect(records).toEqual([toRecord(student.compare!)]);
    const out = compareResults(student.compare!, records!);
    expect(out.status === 'ok' && out.rows.map((r) => r.verdict)).toEqual(student.compare!.scales.map(() => 'same'));
    const grade = 9;
    const entries = [
      { slug: 'bes-faktor-kisilik', report: reportsOf('bes-faktor-kisilik', grade, (i) => (i * 7) % 5)[0] },
      { slug: 'sekil-akil-yurutme', report: (Object.values(evaluateReports('sekil-akil-yurutme', { ...TASK_VARIANTS['sekil-akil-yurutme'].varsayilan(), grade })) as SimpleReport[])[0] },
    ].map((e) => ({ ...e, skill: e.slug, areaName: e.slug }));
    const pkg = readRecords(new Uint8Array(await renderPackageReportPdf({ entries, skipped: [], gradeLabel: '9. sınıf', completedAt: new Date() }, 'olcekhane.com')))!;
    expect(pkg.map((r) => r.s)).toEqual(['bes-faktor-kisilik', 'sekil-akil-yurutme']);
    for (const e of entries) expect(compareResults(e.report.compare!, pkg).status).toBe('ok');
  }, 120_000);

  it('panelin iletileri: eski (yalnızca anketli) paket, tarih, görevde sonuç yoksa, alt not', () => {
    const t = variantReports(TASKS.find((x) => x.slug === 'sekil-akil-yurutme')!, 'varsayilan')[0].compare!;
    const likertPackage: ResultRecord[] = [
      { s: 'bes-faktor-kisilik', v: 1, d: '2026-10-30T10:00:00Z', r: [['x', 3, null]] },
      { s: 'meslek-ilgi-alanlari', v: 1, d: '2026-10-30T10:00:00Z', r: [['y', 3, null]] },
    ];
    expect(compareResults(t, likertPackage)).toEqual({ status: 'other-test', many: true });
    expect(compareResults(t, likertPackage.slice(0, 1))).toEqual({ status: 'other-test' });
    for (const you of [true, false]) {
      expect(otherTestText(t, true, you)).toBe('Bu dosyada bu testin karşılaştırma bilgisi yok (dosya başka testlerin raporu ya da 31 Ekim 2026 öncesinde indirilmiş).');
      expect(otherTestText(t, false, you)).toMatch(you ? /seç\.$/ : /seçin\.$/);
      expect(footerText(t, you)).toContain(you ? 'sonuçlarının sayısal' : 'sonuçların sayısal');
    }
    expect(noneText(t)).toBe('Bu dosyada karşılaştırma bilgisi bulunamadı: dosya 31 Ekim 2026 öncesinde indirilmiş ya da o raporda karşılaştırılabilecek bir sonuç yoktu.');
    const l = reportsOf('bes-faktor-kisilik', 8, (i) => i % 5)[0].compare!;
    expect(noneText(l)).toContain('30 Ekim 2026 ve sonrasında');
    expect(footerText(l, true)).toContain('puanlarının sayısal');
  });

  it('sürelerde "uzadı/kısaldı" denir; yargı bildiren sözcük yok', () => {
    const row = (verdict: CompareRow['verdict'], time: boolean): CompareRow => ({
      key: 'k',
      label: 'Süre',
      before: 1.5,
      after: 1.2,
      min: 0,
      max: 3600,
      decimals: 1,
      unit: 'sn',
      ...(time ? { time: true as const } : {}),
      bandBefore: null,
      bandAfter: null,
      verdict,
    });
    expect(rowText(row('up-unknown', true))).toMatch(/^Süre uzadı; .*söylenemez\.$/);
    expect(rowText(row('down-unknown', true))).toMatch(/^Süre kısaldı; .*söylenemez\.$/);
    expect(rowText(row('same', true))).toBe('Süre aynı.');
    expect(rowText(row('up-unknown', false))).toMatch(/^Arttı; /);
    const ui = readFileSync(new URL('../src/components/test/compare-panel.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/iyileşti|kötüleşti|geriledi/);
  });

  it('alıştırma etkisi notu yalnızca görev testlerinde; aynı soruların geldiği testlerde hatırlananlar da söylenir', () => {
    for (const you of [true, false]) {
      const p = retestNote('practice', you);
      const i = retestNote('items', you);
      expect(p).toContain('(Scharfen ve ark., 2018)');
      expect(p).toContain('süreler de biraz kısalabilir');
      expect(i.startsWith(p)).toBe(true);
      expect(i).toContain('aynı sorular');
      expect(p).not.toContain('aynı sorular');
      expect(p).toMatch(you ? /sayma\.$/ : /saymayın\.$/);
      expect(schoolWords(i)).toEqual([]);
    }
    // Hangi testte aynı soruların geldiği, tablodan bağımsız olarak testlerin görev türünden: soru ve kelime listesi
    // görevleri "items"; tepki, dikkat, bellek dizisi ve her seferinde yeniden üretilen görevler "practice".
    const ITEMS = ['sekil-akil-yurutme', 'sekil-benzetmeleri', 'sayi-dizileri', 'harf-dizileri', 'sozel-akil-yurutme', 'kagit-katlama', 'kup-acinimi', 'gizli-sekiller', 'kelime-bilgisi', 'mantiksal-akil-yurutme', 'sayisal-akil-yurutme', 'uc-boyutlu-zihinde-dondurme', 'dusunerek-karar-verme', 'bakis-acisi-alma', 'planlama-kule-gorevi', 'kelime-listesi-hatirlama'];
    for (const d of TASKS) {
      const c = variantReports(d, Object.keys(TASK_VARIANTS[d.slug])[0])[0].compare;
      if (c) expect(c.retest, d.slug).toBe(ITEMS.includes(d.slug) ? 'items' : 'practice');
    }
    const ui = readFileSync(new URL('../src/components/test/compare-panel.tsx', import.meta.url), 'utf8');
    expect(ui).toContain('{compare.retest && <p className="text-ink-2">{retestNote(compare.retest, you)}</p>}');
    for (const d of LIKERT) expect(reportsOf(d.slug, gradeFor(d), (i) => i % 5)[0].compare?.retest, d.slug).toBeUndefined();
    expect(readFileSync(new URL('../src/content/instruments/simge-bulma.ts', import.meta.url), 'utf8')).toContain('Scharfen, J., Peters, J. M. ve Holling, H. (2018).');
  });

  it('karşılaştırılan sayıların anahtarı, birimi, ondalığı ve adı bilerek değiştirilir (eski PDF’lerle eşleşir; anlamı değişirse testin sürümü artırılır)', () => {
    const table = Object.fromEntries(
      Object.entries(TASK_COMPARE).map(([slug, specs]) => [slug, specs.map((s) => `${specKey(s)}|${s.unit}|${s.decimals}|${s.format ?? ''}|${s.label}`)]),
    );
    expect(table).toEqual(TASK_COMPARE_SNAPSHOT);
  });
});
/** `TASK_COMPARE`ın kopyası: anahtar|birim|ondalık|yazım|ad. Bilerek değiştirilir. */
const TASK_COMPARE_SNAPSHOT: Record<string, string[]> = {
  'sekil-akil-yurutme': [
    'sa_dogru||0||Doğru cevaplar',
    'sa_duzey||0||Ulaşılan düzey',
    'sa_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'sekil-benzetmeleri': [
    'sb_dogru||0||Doğru cevaplar',
    'sb_duzey||0||Ulaşılan düzey',
    'sb_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'sayi-dizileri': [
    'sd_dogru||0||Doğru cevaplar',
    'sd_duzey||0||Ulaşılan düzey',
    'sd_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'harf-dizileri': [
    'hd_dogru||0||Doğru cevaplar',
    'hd_duzey||0||Ulaşılan düzey',
    'hd_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'sozel-akil-yurutme': [
    'sz_dogru||0||Doğru cevaplar',
    'sz_duzey||0||Ulaşılan düzey',
    'sz_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'kagit-katlama': [
    'kk_dogru||0||Doğru cevaplar',
    'kk_duzey||0||Ulaşılan düzey',
    'kk_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'kup-acinimi': [
    'kp_dogru||0||Doğru cevaplar',
    'kp_duzey||0||Ulaşılan düzey',
    'kp_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'gizli-sekiller': [
    'gs_dogru||0||Doğru cevaplar',
    'gs_duzey||0||Ulaşılan düzey',
    'gs_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'kelime-bilgisi': [
    'kb_dogru||0||Doğru cevaplar',
    'kb_duzey||0||Ulaşılan düzey',
    'kb_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'mantiksal-akil-yurutme': [
    'ma_dogru||0||Doğru cevaplar',
    'ma_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'sayisal-akil-yurutme': [
    'sy_dogru||0||Doğru cevaplar',
    'sy_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'uc-boyutlu-zihinde-dondurme': [
    'ud_dogru||0||Doğru cevaplar',
    'ud_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'dusunerek-karar-verme': [
    'dk_dogru||0||Tuzaklı sorularda doğru',
    'dk_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'bakis-acisi-alma': [
    'ba_hata|derece|1|trim|Ortalama hata',
    'ba_calisma|sn|0|clock|Soru başına tipik süre',
  ],
  'zihinden-hesaplama-hizi': [
    'zh_genel||0||Dört bölümde doğru işlem',
    'zh_toplama||0||Toplama: 60 saniyede doğru işlem',
    'zh_cikarma||0||Çıkarma: 60 saniyede doğru işlem',
    'zh_carpma||0||Çarpma: 60 saniyede doğru işlem',
    'zh_bolme||0||Bölme: 60 saniyede doğru işlem',
    'zh_dogruluk|%|0||Doğruluk (dört bölüm)',
    'zh_hiz|sn|1||Temel işlemlerde tipik süre (dört bölüm)',
  ],
  'planlama-kule-gorevi': [
    'kg_dogru||0||En az hamlede çözülen problem',
    'kg_plan|sn|1|trim|İlk hamleden önce tipik süre',
  ],
  'dikkat-ve-bellek': [
    'digit_forward||0||Sayı dizisi (ileri): en uzun dizi',
    'digit_backward||0||Sayı dizisi (geri): en uzun dizi',
    'spatial||0||Kutu dizisi: en uzun dizi',
    'attention|%|0||Ok görevi: doğruluk',
    'attention.sure|sn|2||Ok görevi: doğru cevaplarda ortalama süre',
    'speed||0||Sembol eşleştirme: doğru eşleştirme',
  ],
  'surekli-dikkat': [
    'tempo||0||Dakikada taranan harf',
    'isabet|%|0||Hedefleri bulma oranı',
    'net||0||Net doğru',
  ],
  'renk-kelime-gorevi': [
    'renk_dogruluk|%|0||Doğru cevaplar',
    'renk_hiz|sn|2||Tipik cevap süresi',
  ],
  'dur-git-gorevi': [
    'dg_durma|%|0||Durma oranı',
    'dg_tepki|%|0||Basma oranı',
    'dg_hiz|sn|2||Tipik tepki süresi',
  ],
  'sirayla-birlestirme-gorevi': [
    'iz_a|sn|1||Sayılarla birleştirme süresi',
    'iz_b|sn|1||Sayı ve harflerle birleştirme süresi',
  ],
  'geriye-donuk-hatirlama': [
    'gh_bir.yakalama|%|0||Bir geri: yakalama',
    'gh_bir.yanlisBasma|%|0||Bir geri: yanlış basma',
    'gh_iki.yakalama|%|0||İki geri: yakalama',
    'gh_iki.yanlisBasma|%|0||İki geri: yanlış basma',
  ],
  'hesapla-ve-hatirla': [
    'hb_harf||0||Doğru yerde hatırlanan harf',
    'hb_uzunluk||0||Bütün harfleri doğru dizi',
    'hb_islem|%|0||İşlem doğruluğu',
  ],
  'harf-sayi-siralama': [
    'hs_aralik||0||En uzun doğru dizi',
    'hs_dizi||0||Doğru sıralanan dizi',
    'hs_calisma|sn|0|clock|Dizi başına tipik süre',
  ],
  'desen-hatirlama': [
    'dh_aralik||0||En büyük doğru desen',
    'dh_desen||0||Doğru hatırlanan desen',
    'dh_calisma|sn|0|clock|Desen başına tipik süre',
  ],
  'kelime-listesi-hatirlama': [
    'kl_ogrenme||0||Üç denemede toplam hatırlanan kelime',
    'kl_koruma||0||Araya giren listeden sonra hatırlanan kelime',
    'kl_tanima.taninan||0||Tanıma: tanınan kelime',
    'kl_tanima.yanlisEvet||0||Tanıma: yanlış “evet”',
  ],
  'zihinde-dondurme': [
    'zd_dogruluk|%|0||Doğru cevaplar',
    'zd_hiz|sn|2||Tipik karar süresi',
  ],
  'tepki-hizi': [
    'th_basit|sn|2||Basit tepki süresi',
    'th_secmeli|sn|2||Seçmeli tepki süresi',
  ],
  'simge-bulma': [
    'sg_hiz||0||Doğru karar',
    'sg_hiz.sure|sn|1||Tipik karar süresi',
    'sg_dogruluk|%|0||Doğruluk',
  ],
  'kural-degistirme': [
    'kd_dogruluk|%|0||Doğruluk',
    'kd_calisma|sn|2||Tipik cevap süresi',
  ],
};
