import { describe, expect, it } from 'vitest';
import { solvableInstruments } from '@/content/instruments';
import { ACADEMIC_ROADMAPS, READING_ROADMAPS, TASK_ROADMAPS, hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import type { AudienceText } from '@/content/roadmaps/types';
import { PARENT_TITLES } from '@/content/roadmaps/veli-basliklari';
import { evaluate } from '@/lib/assessment/evaluate';
import type { Band, QuizInstrument, ReadingInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { buildAcademicRoadmap } from '@/lib/reports/academic-roadmap';
import type { Audience, ReportContent } from '@/lib/reports/build';
import { buildReadingRoadmap } from '@/lib/reports/reading-roadmap';
import { pick, type Roadmap } from '@/lib/reports/roadmap';
import { quizBand } from '@/lib/scoring/quiz';
import {
  cancellationBody,
  colorWordBody,
  def,
  goNoGoBody,
  memoryTasksBody,
  nBackBody,
  quizBody,
  matrixBody,
  numberSeriesBody,
  verbalBody,
  logicBody,
  numericBody,
  cubeBody,
  rotation3dBody,
  reflectionBody,
  towerBody,
  complexSpanBody,
  perspectiveBody,
  hiddenBody,
  analogyBody,
  patternBody,
  letterSeriesBody,
  foldingBody,
  vocabularyBody,
  ruleSwitchBody,
  wordListBody,
  reactionBody,
  readingBody,
  rotationBody,
  trailBody,
  arithBody,
} from './helpers/bodies';

const MAT = 'matematik-konu-tarama-testi';
const OKUMA = 'okuma-hizi-ve-anlama';
const AUDIENCES = ['student', 'parent'] as const;
const NEXT = [{ name: 'Çalışma Alışkanlıkları Envanteri', href: '/testler/calisma-aliskanliklari' }];

/** Yol haritasındaki bütün metinler (boş metin, kalmış yer tutucu ya da "undefined" olmamalı). */
function texts(rm: Roadmap): string[] {
  return [
    rm.intro,
    ...rm.standout.flatMap((s) => [s.title, s.text]),
    rm.study.title,
    rm.study.intro,
    ...rm.study.items.flatMap((i) => [i.title, i.badge, i.text]),
    ...(rm.settings ? [rm.settings.title, rm.settings.intro, ...rm.settings.items, rm.settings.note] : []),
    ...(rm.approach?.items.flatMap((i) => [i.title, i.text]) ?? []),
    ...rm.weeks.flatMap((w) => [w.title, w.text]),
  ];
}

/** Boş metin, kalmış yer tutucu, çift boşluk, yinelenen hafta ya da kart metni. */
function problems(rm: Roadmap): string[] {
  const out = texts(rm).flatMap((x) => (x.trim() === '' || /undefined|null|NaN|\{k\}|  /.test(x) ? [`metin: "${x.slice(0, 40)}"`] : []));
  if (new Set(rm.weeks.map((w) => w.text)).size !== 4) out.push('haftalar yineleniyor');
  if (new Set(rm.study.items.map((i) => i.text)).size !== rm.study.items.length) out.push('kartlar yineleniyor');
  return out;
}

function expectClean(rm: Roadmap, what: string) {
  expect(problems(rm), what).toEqual([]);
}

function* product(sizes: number[]): Generator<number[]> {
  const total = sizes.reduce((a, b) => a * b, 1);
  for (let k = 0; k < total; k++) {
    let rest = k;
    yield sizes.map((n) => {
      const v = rest % n;
      rest = Math.floor(rest / n);
      return v;
    });
  }
}

describe('matematik konu tarama: yol haritası şablonu', () => {
  const t = ACADEMIC_ROADMAPS[MAT];
  const d = def<QuizInstrument>(MAT);

  it('her formun her konu alanı için metin, renk ve sağlam alan önerisi var; veli metinleri çocuğunuzu anar', () => {
    for (const form of d.forms) {
      const texts = t.forms[form.contentGrade];
      expect(Object.keys(texts).sort(), form.key).toEqual(form.domains.map((x) => x.key).sort());
      for (const dom of form.domains) {
        const x = texts[dom.key];
        expect(t.colors[dom.key], dom.key).toMatch(/^#[0-9a-f]{6}$/);
        expect(t.solid[dom.key], dom.key).toBeDefined();
        for (const a of [x.need, x.action, t.solid[dom.key]]) {
          expect(a.student, dom.key).not.toMatch(/çocuğunuz/i);
          expect(a.parent, dom.key).not.toBe(a.student);
        }
        expect(x.action.parent, `${form.key} ${dom.key}`).toMatch(/çocuğunuz/i);
        expect(x.approach.length).toBeGreaterThan(30);
      }
      for (const a of AUDIENCES) {
        const unique = (xs: string[], what: string) => expect(new Set(xs).size, `${form.key} ${a} ${what}`).toBe(xs.length);
        unique(form.domains.map((x) => pick(texts[x.key].need, a)), 'çalışma');
        unique(form.domains.map((x) => pick(texts[x.key].action, a)), 'deneme');
      }
      expect(new Set(form.domains.map((x) => texts[x.key].approach)).size, form.key).toBe(form.domains.length);
    }
    expect(t.routine.items.student).toHaveLength(t.routine.items.parent.length);
  });

  it('bütün formlarda her doğru sayısı birleşiminde bölümler eksiksiz ve birbiriyle tutarlı', () => {
    // 25 000 birleşim: her biri için ayrı expect yavaş olduğundan sorunlar toplanıp en sonda karşılaştırılır.
    const bad: string[] = [];
    const check = (ok: boolean, what: string, msg: string) => {
      if (!ok && bad.length < 20) bad.push(`${what}: ${msg}`);
    };
    const labels: Record<string, string> = { high: 'Sağlam', average: 'Pekiştirilmeli', low: 'Öncelikli' };
    const rank: Record<string, number> = { low: 0, average: 1, high: 2 };
    let n = 0;
    for (const form of d.forms) {
      for (const counts of product(form.domains.map(() => 5))) {
        const domains = form.domains.map((dom, i) => {
          const band = quizBand(counts[i] / 4);
          return { key: dom.key, name: dom.name, plain: dom.plain, correct: counts[i], n: 4, dontKnow: 0, band, bandLabel: labels[band] };
        });
        const correct = counts.reduce((x, y) => x + y, 0);
        for (const audience of AUDIENCES) {
          const content = {
            audience,
            academic: { contentGrade: form.contentGrade, n: 20, correct, wrong: 20 - correct, domains, interpreted: true, guessed: false },
          } as unknown as ReportContent;
          const rm = buildAcademicRoadmap(content, t, { preview: false, next: NEXT })!;
          const what = `${form.key} ${counts.join('')} ${audience}`;
          n++;
          const byKey = (k: string) => domains.find((x) => x.key === k)!;
          check(rm.bars.length === 5 && rm.study.items.length === 5, what, 'beş alan');
          // Alanlar öncelik sırasıyla (öncelikli, pekiştirilmeli, sağlam); aynı düzeyde doğru sayısı az olan önce.
          const order = rm.study.items.map((i) => rank[byKey(i.key).band] * 10 + byKey(i.key).correct);
          check(order.every((x, i) => i === 0 || order[i - 1] <= x), what, 'sıra');
          const need = rm.study.items.filter((i) => byKey(i.key).band !== 'high');
          for (const it of rm.study.items) {
            const dom = byKey(it.key);
            check(it.badge === `${dom.bandLabel} · ${dom.correct} / 4 doğru`, what, `rozet ${it.badge}`);
            const ok = dom.band === 'high' ? it.text === pick(t.solid[dom.key], audience) : it.text.startsWith(pick(t.lead[dom.band as 'low' | 'average'], audience));
            check(ok, what, `kart ${it.key}`);
          }
          const titles = [correct < 20 ? 'Hata defteri' : 'Bir adım ileri', need[0]?.title ?? t.extraWeeks[0].title, need[1]?.title ?? t.extraWeeks[1].title, 'Gözden geçir'];
          check(rm.weeks.map((w) => w.title).join('|') === titles.join('|'), what, 'haftalar');
          check(correct === 20 || (rm.weeks[0].text.startsWith(pick(t.firstWeek.wrong, audience)) && rm.weeks[0].text.endsWith(pick(t.firstWeek.reason, audience))), what, '1. hafta');
          check(rm.standout[0].title === 'Genel sonuç' && rm.standout[0].text === `${correct} / 20 doğru`, what, 'genel sonuç');
          const groups = (['low', 'average', 'high'] as const).filter((b) => domains.some((x) => x.band === b)).map((b) => labels[b]);
          check(rm.standout.slice(1).map((x) => x.title).join('|') === groups.join('|'), what, 'kısaca');
          if (audience === 'parent') {
            const want = need.length ? need.map((i) => i.title) : t.approachSolid.map((i) => i.title);
            check(rm.approach?.items.map((i) => i.title).join('|') === want.join('|'), what, 'yaklaşım');
            check(rm.intro.includes('evde nasıl destek olabileceğiniz'), what, 'giriş');
          } else {
            check(rm.approach === null && !/çocuğunuz/i.test(texts(rm).join(' ')), what, 'öğrenci metni');
          }
          // Addaki "Envanteri" cümledeki "testini" ile yinelenmez.
          check(rm.weeks[3].text.includes('Çalışma Alışkanlıkları testini'), what, 'sonraki test');
          for (const p of problems(rm)) check(false, what, p);
        }
      }
    }
    expect(bad).toEqual([]);
    expect(n).toBe(4 * 5 ** 5 * 2);
  });

  it('rapora eklenir: her sınıfta öğrenci ve veli raporunda; PDF yol haritasıyla üretilir', async () => {
    expect(hasPublicRoadmap(MAT)).toBe(true);
    for (const grade of [5, 6, 7, 8]) {
      const r = evaluate(MAT, quizBody(grade, 4));
      for (const a of AUDIENCES) {
        const rm = r[a].roadmap!;
        expect(rm.preview, String(grade)).toBe(false);
        expect(rm.bars, String(grade)).toHaveLength(5);
        expect(rm.sources.length).toBe(4);
      }
    }
    const r = evaluate(MAT, quizBody(8, 2));
    const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(roadmapSummary(MAT)).toContain('yanlış yapılan sorulardan başlayan dört haftalık plan');
  }, 60_000);

  it('son haftada önerilen testin adında "Testi" ya da "Görevi" sözcüğü "testini" ile yinelenmez', () => {
    const rm = evaluate(OKUMA, readingBody(6)).student.roadmap!;
    expect(rm.weeks[3].text).not.toMatch(/Testi test/);
    const task = evaluate('renk-kelime-gorevi', colorWordBody()).student.roadmap!;
    expect(task.weeks[3].text).toContain('Dur-Git ve Sırayla Birleştirme testlerinden birini');
  });

  it('önerilen testlerden biri sınıfa uymayınca amaç cümlesi kalan teste uymuyorsa yazılmaz', () => {
    // Dikkat ve Bellek: "çalışma düzenini ve dikkatini uzun süre korumayı" (Çalışma Alışkanlıkları 6. sınıftan itibaren).
    const g4 = evaluate('dikkat-ve-bellek', { ...memoryTasksBody(), grade: 4 });
    expect(g4.student.roadmap!.weeks[3].text).toContain('Bir sonraki adım olarak “Sürekli Dikkat: Harf İşaretleme” testini de çözebilirsin.');
    expect(g4.parent.roadmap!.weeks[3].text).toContain('Bir sonraki adım olarak “Sürekli Dikkat: Harf İşaretleme” testini de önerebilirsiniz.');
    expect(g4.student.roadmap!.weeks[3].text).not.toContain('çalışma düzenini');
    const g7 = evaluate('dikkat-ve-bellek', { ...memoryTasksBody(), grade: 7 });
    expect(g7.student.roadmap!.weeks[3].text).toContain('çalışma düzenini ve dikkatini uzun süre korumayı da görmek için');
    // Amaç her teste tek başına da uyuyorsa yazılır (Kelime Listesi: "belleğinin ve sözel becerilerinin başka yönlerini").
    expect(TASK_ROADMAPS['kelime-listesi-hatirlama'].nextPurpose.general).toBe(true);
  });
});

describe('okuma hızı ve anlama: yol haritası şablonu', () => {
  const t = READING_ROADMAPS[OKUMA];
  const d = def<ReadingInstrument>(OKUMA);

  it('bütün soru türlerinin metinleri var; her metnin soruları bu türlerden', () => {
    for (const p of d.passages) for (const q of p.questions) expect(t.skills[q.skill], `${p.key} ${q.key}`).toBeDefined();
    for (const [key, s] of Object.entries(t.skills)) {
      for (const x of [s.need, s.full, s.action] as AudienceText[]) {
        expect(x.student, key).not.toMatch(/çocuğunuz/i);
        expect(x.parent, key).not.toBe(x.student);
      }
      expect(s.action.parent, key).toMatch(/çocuğunuz/i);
    }
    for (const g of ['low', 'average', 'high'] as const) expect(t.approach[g].length, g).toBeGreaterThan(1);
  });

  it('her doğru sayısı, anlama düzeyi ve hız birleşiminde bölümler eksiksiz ve tutarlı', () => {
    const keys = ['literal', 'inference', 'vocabulary', 'main_idea'];
    const totals = [3, 2, 2, 1];
    const labels: Record<string, string> = { literal: 'Metindeki bilgiyi hatırlama', inference: 'Çıkarım yapma', vocabulary: 'Kelime anlamı', main_idea: 'Ana fikir' };
    let n = 0;
    for (const counts of product(totals.map((x) => x + 1))) {
      for (const band of ['low', 'average', 'high', 'very_high'] as Band[]) {
        for (const speed of ['ok', 'slow', 'fast', 'tooFast', 'tooSlow'] as const) {
          for (const audience of AUDIENCES) {
            const skills = keys.map((k, i) => ({ key: k, label: labels[k], correct: counts[i], total: totals[i] }));
            const tooFast = speed === 'tooFast';
            const tooSlow = speed === 'tooSlow';
            const pace = tooFast ? 'fast' : tooSlow ? 'slow' : speed;
            const content = {
              audience: audience as Audience,
              sections: [{ scaleKey: 'comprehension', band, summary: 'Özet', bandLabel: 'Düzey' }],
              reading: { wpm: 1234, skills, tooFast, tooSlow, pace },
            } as unknown as ReportContent;
            const rm = buildReadingRoadmap(content, t, { preview: false, next: NEXT })!;
            const what = `${counts.join('')} ${band} ${speed} ${audience}`;
            n++;
            expect(rm.bars, what).toHaveLength(4);
            expect(rm.study.items, what).toHaveLength(5);
            const ratios = rm.study.items.slice(0, 4).map((i) => skills.find((s) => s.key === i.key)!).map((s) => s.correct / s.total);
            expect(ratios, what).toEqual([...ratios].sort((x, y) => x - y));
            // Hız yorumlanmadıysa hız sayısı gösterilmez; çok kısa sürede anlama iyiyse "ön bilgi", değilse "yavaşla";
            // süre çok uzunsa ya da hız yavaşsa akıcılık; hız olağan ve anlama zayıfsa anlama önerisi; hızlı ve zayıfsa yavaşla.
            const high = band === 'high' || band === 'very_high';
            const want = tooFast ? (high ? 'skim' : 'rush') : tooSlow ? 'build' : pace === 'fast' && !high ? 'quick' : high ? (pace === 'slow' ? 'build' : 'extend') : pace === 'slow' ? 'build' : 'understand';
            expect(rm.study.items[4].text.endsWith(pick(t.pace[want].text, audience)), what).toBe(true);
            const shown = JSON.stringify(rm);
            if (tooFast || tooSlow) expect(shown, what).not.toContain('1.234');
            else expect(rm.standout[1].text, what).toBe('Dakikada 1.234 kelime');
            const weakest = skills.filter((s) => s.correct < s.total).sort((x, y) => x.correct / x.total - y.correct / y.total)[0];
            expect(rm.weeks.map((w) => w.title), what).toEqual([
              'Okuma günlüğü',
              weakest ? weakest.label : t.extraWeek.title,
              t.pace[want].week.title,
              'Gözden geçir',
            ]);
            expect(rm.standout.length, what).toBe(weakest && weakest.correct / weakest.total < 0.5 ? 3 : 2);
            if (audience === 'parent') {
              const g = band === 'low' ? 'low' : band === 'average' ? 'average' : 'high';
              expect(rm.approach!.items, what).toEqual(t.approach[g]);
            } else {
              expect(rm.approach, what).toBeNull();
              expect(texts(rm).join(' '), what).not.toMatch(/çocuğunuz/i);
            }
            expectClean(rm, what);
          }
        }
      }
    }
    expect(n).toBe(4 * 3 * 3 * 2 * 4 * 5 * 2);
  });

  it('rapora eklenir: her metinde öğrenci ve veli raporunda; PDF yol haritasıyla üretilir', async () => {
    expect(hasPublicRoadmap(OKUMA)).toBe(true);
    for (const grade of [3, 5, 7, 10, 13]) {
      const r = evaluate(OKUMA, readingBody(grade));
      for (const a of AUDIENCES) {
        const rm = r[a].roadmap!;
        expect(rm.preview).toBe(false);
        expect(rm.bars, String(grade)).toHaveLength(4);
        expect(rm.standout[1].text).toMatch(/^Dakikada \d+ kelime$/);
      }
    }
    const pdf = await renderSimpleReportPdf(evaluate(OKUMA, readingBody(4)).parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(roadmapSummary(OKUMA)).toContain('okuma becerilerine göre çalışma önerileri');
  }, 60_000);
});

describe('zihinsel görevler: yol haritası şablonları', () => {
  const BODIES: Record<string, () => ReturnType<typeof reactionBody>> = {
    'dikkat-ve-bellek': memoryTasksBody,
    'surekli-dikkat': cancellationBody,
    'renk-kelime-gorevi': colorWordBody,
    'dur-git-gorevi': goNoGoBody,
    'sirayla-birlestirme-gorevi': trailBody,
    'geriye-donuk-hatirlama': nBackBody,
    'zihinde-dondurme': rotationBody,
    'tepki-hizi': reactionBody,
    'sekil-akil-yurutme': matrixBody,
    'sayi-dizileri': numberSeriesBody,
    'sozel-akil-yurutme': verbalBody,
    'mantiksal-akil-yurutme': () => logicBody(),
    'sayisal-akil-yurutme': () => numericBody(),
    'kup-acinimi': () => cubeBody(),
    'uc-boyutlu-zihinde-dondurme': () => rotation3dBody(),
    'dusunerek-karar-verme': () => reflectionBody(),
    'planlama-kule-gorevi': () => towerBody(),
    'hesapla-ve-hatirla': () => complexSpanBody(),
    'bakis-acisi-alma': () => perspectiveBody(),
    'gizli-sekiller': () => hiddenBody(),
    'sekil-benzetmeleri': () => analogyBody(),
    'desen-hatirlama': () => patternBody(),
    'harf-dizileri': letterSeriesBody,
    'kagit-katlama': foldingBody,
    'kelime-bilgisi': vocabularyBody,
    'kural-degistirme': ruleSwitchBody,
    'kelime-listesi-hatirlama': wordListBody,
    'zihinden-hesaplama-hizi': () => arithBody(),
  };

  it('her zihinsel görevin yol haritası var; metinler eksiksiz, veli metinleri çocuğunuzu anar, öğrenci metinleri anmaz', () => {
    const tasks = solvableInstruments().filter((d) => d.engine === 'tasks').map((d) => d.slug);
    expect(Object.keys(TASK_ROADMAPS).sort()).toEqual([...tasks].sort());
    expect(Object.keys(BODIES).sort()).toEqual([...tasks].sort());
    for (const [slug, t] of Object.entries(TASK_ROADMAPS)) {
      const all: AudienceText[] = [t.what, t.studyIntro, t.lastWeek, t.facts.intro, t.facts.note, ...t.supports.map((x) => x.text), ...t.weeks.map((w) => w.text)];
      for (const x of all) expect(x.student, slug).not.toMatch(/çocuğunuz/i);
      for (const w of [...t.weeks.map((x) => x.text), ...t.supports.map((x) => x.text)]) expect(w.parent, slug).toMatch(/çocuğunuz/i);
      expect(t.supports, slug).toHaveLength(4);
      expect(new Set(t.supports.map((x) => x.key)).size, slug).toBe(4);
      for (const a of AUDIENCES) {
        const unique = (xs: string[], what: string) => expect(new Set(xs).size, `${slug} ${a} ${what}`).toBe(xs.length);
        unique(t.supports.map((x) => pick(x.text, a)), 'kartlar');
        unique([...t.weeks.map((x) => pick(x.text, a)), pick(t.lastWeek, a)], 'haftalar');
        unique(a === 'parent' ? t.facts.items.parent : t.facts.items.student, 'bilgiler');
      }
      expect(new Set(t.approach.map((x) => x.text)).size, slug).toBe(t.approach.length);
      // Puanı yükseltme ya da beyni çalıştırma vaadi yoktur.
      expect(JSON.stringify(t), slug).not.toMatch(/beyni(ni)? çalıştır|puanını yükselt|zekânı geliştir/i);
      expect(roadmapSummary(slug), slug).toContain('bilmekte yarar olanlar');
    }
  });

  it('öneri ve hafta başlıkları veli raporunda "sen"e seslenmez: her başlığın veli biçimi var ya da başlık zaten ad öbeği', () => {
    // İki kitlede de aynı kalan başlıklar (ad öbeği ya da soru); yeni bir başlık eklenince buraya ya da PARENT_TITLES'a yazılır.
    const SAME = new Set([
      'Aklın yerine kâğıt', 'Bir seferde bir iş', 'Bir seferde tek iş', 'Dikkat dağıtıcılardan uzak', 'Dinlenmiş bir zihin', 'Dinç olmak',
      'Düzenli bir sayfa', 'Görsel bellek oyunları', 'Görünür hatırlatıcılar', 'Gözlem oyunları', 'Hareket ve dinlenme', 'Hız ve doğruluk dengesi',
      'Kelime defteri ve sözlük', 'Kelime ve mantık oyunları', 'Kimin sağı?', 'Kurallı oyunlar', 'Kuralı değişen oyunlar', 'Kısa bölümler',
      'Sade bir masa', 'Sessiz bir ortam', 'Tek bilgi kaynağı', 'Uzamsal oyunlar', 'Yön oyunları', 'Önce doğruluk', 'İki katı sorusu',
      'Şekil oyunları', '“Kesin mi, olabilir mi?”',
      'Anlamı değiştiren sözcükler', 'Aralıklı tekrar', 'Bir hamle sonrası', 'Deyim haftası', 'Doğruluk önce', 'Geriye doğru',
      'Gerçek mi, çıkarım mı?', 'Gizli nesneler', 'Göndermeden önce', 'Hangisi aynı?', 'Karşı örnek avı', 'Kelime avı', 'Kuralı değişen oyun',
      'Orantı mı, değil mi?', 'Parçalardan bütüne', 'Sade bir çalışma köşesi', 'Son kontrol', 'Tek iş', 'Tek iş saati', 'Terazi bulmacaları',
      'Tuzaklı bilmeceler', 'Yer imi', 'Zarın açınımı', 'İçinden tekrar', '“Kesin mi?” oyunu', 'Kısa ve sık', 'Türetme oyunu',
      'Benzetme oyunları', 'Fark avı', 'Sözcüklerle benzetme',
    ]);
    const titles = new Set(['Gözden geçir']);
    for (const t of Object.values(TASK_ROADMAPS)) for (const x of [...t.supports, ...t.weeks]) titles.add(x.title);
    for (const x of titles) expect(x in PARENT_TITLES || SAME.has(x), x).toBe(true);
    for (const x of titles) expect(x in PARENT_TITLES && SAME.has(x), x).toBe(false);
    // Kullanılmayan veli başlığı kalmaz.
    for (const x of Object.keys(PARENT_TITLES)) expect(titles.has(x), x).toBe(true);
    // Veli biçimi gerçekten başkadır ve "sen"e seslenen sözcük taşımaz.
    for (const [k, x] of Object.entries(PARENT_TITLES)) {
      expect(x, k).not.toBe(k);
      expect(x, k).not.toMatch(/(^|\s)(kendin|kafanda|gözünü|yoluna|kaldığın|cümlenle|sıranı|bulmacanı|dizini|elinle|sen)(\s|,|$)/);
    }
  });

  it('veli raporunda başlıklar veli biçimiyle; sonuç yorumlanmadıysa giriş önerilerin genel olduğunu söyler', () => {
    const r = evaluate('dikkat-ve-bellek', memoryTasksBody());
    const titles = (rm: Roadmap) => [...rm.study.items.map((x) => x.title), ...rm.weeks.map((w) => w.title)];
    expect(titles(r.parent.roadmap!)).toContain('Gözden geçirmek');
    expect(titles(r.student.roadmap!)).toContain('Gözden geçir');
    expect(titles(r.parent.roadmap!).filter((x) => x in PARENT_TITLES)).toEqual([]);
    expect(r.parent.roadmap!.intro).toContain('çocuğunuzun dikkat ve bellek gerektiren işlerini nasıl kolaylaştırabileceğiniz');
    expect(r.student.roadmap!.intro).toMatch(/^Bu bölüm sonuçlarını günlük hayata taşıman için/);
    const same = evaluate('mantiksal-akil-yurutme', logicBody(() => ({ response: 1, rtMs: 9000 })));
    expect(same.student.roadmap!.intro).toMatch(/^Sonucun yorumlanmadığı için bu bölümdeki öneriler herkes için yazılmış genel önerilerdir: /);
    expect(same.parent.roadmap!.intro).toMatch(/^Sonuç yorumlanmadığı için bu bölümdeki öneriler/);
  });

  it('rapora eklenir: Kısaca raporun kartlarını özetler, üç boyutlu grafik yalnızca soru ya da kural türü olan görevlerde; PDF yol haritasıyla üretilir', async () => {
    for (const [slug, body] of Object.entries(BODIES)) {
      expect(hasPublicRoadmap(slug), slug).toBe(true);
      const r = evaluate(slug, body());
      for (const a of AUDIENCES) {
        const rm = r[a].roadmap!;
        expect(rm, `${slug} ${a}`).toBeDefined();
        expect(rm.preview).toBe(false);
        if (slug === 'kagit-katlama') {
          expect(rm.bars.map((b) => b.key)).toEqual(['half', 'partial', 'diagonal']);
          expect(rm.barsTitle).toMatch(/^Katlama türlerine göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('katlama türüdür');
        } else if (slug === 'kelime-listesi-hatirlama') {
          // Listenin başından, ortasından ve sonundan hatırlananlar (aynı birim): üç sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['begin', 'middle', 'end']);
          expect(rm.barsTitle).toMatch(/^Listenin hangi kısm(ını daha çok hatırladın|ı daha çok hatırlandı)$/);
          expect(rm.barsNote).toContain('listenin bir kısmıdır');
        } else if (slug === 'kelime-bilgisi') {
          expect(rm.bars.map((b) => b.key)).toEqual(['synonym', 'antonym', 'context', 'idiom']);
          expect(rm.barsTitle).toMatch(/^Soru türlerine göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('soru türüdür');
        } else if (slug === 'sozel-akil-yurutme') {
          // Soru türlerine göre doğru cevap oranı (aynı birim): dört sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['analogy', 'classification', 'ordering', 'deduction']);
          expect(rm.barsTitle).toMatch(/^Soru türlerine göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('soru türüdür');
        } else if (slug === 'planlama-kule-gorevi') {
          // Her uzunlukta (3–7 hamle) dört problemde en az hamlede çözülenlerin oranı (aynı birim): beş sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['h3', 'h4', 'h5', 'h6', 'h7']);
          expect(rm.barsTitle).toMatch(/^Problem uzunluğuna göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('dört problemdir');
        } else if (slug === 'hesapla-ve-hatirla') {
          // Her uzunlukta (3–7 harf) iki dizide doğru yerde hatırlanan harflerin oranı (aynı birim): beş sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['d3', 'd4', 'd5', 'd6', 'd7']);
          expect(rm.barsTitle).toMatch(/^Dizi uzunluğuna göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('iki dizidir');
        } else if (slug === 'dusunerek-karar-verme') {
          expect(rm.bars.map((b) => b.key)).toEqual(['numLure', 'verbLure', 'control']);
          expect(rm.barsTitle).toMatch(/^Soru gruplarına göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('sekiz soruluk bir gruptur');
        } else if (slug === 'sayisal-akil-yurutme') {
          // Sekiz soruluk üç grupta doğru cevap oranı (aynı birim): üç sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['prop', 'nonProp', 'equal']);
          expect(rm.barsTitle).toMatch(/^Soru gruplarına göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('sekiz soruluk bir gruptur');
        } else if (slug === 'zihinden-hesaplama-hizi') {
          // Dört işlemin 60 saniyelik bölümlerinde doğru işlem sayısı (aynı birim): dört sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['add', 'sub', 'mul', 'div']);
          expect(rm.barsTitle).toMatch(/^Dört işlemde doğru işlem(lerin|ler)$/);
          expect(rm.barsNote).toContain('bir işlemin 60 saniyelik bölümünde');
        } else if (slug === 'mantiksal-akil-yurutme') {
          // Sekiz soruluk dört grupta doğru cevap oranı (aynı birim): dört sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['condValid', 'condInvalid', 'noConflict', 'conflict']);
          expect(rm.barsTitle).toMatch(/^Soru gruplarına göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('sekiz soruluk bir gruptur');
        } else if (slug === 'sekil-benzetmeleri') {
          // Değişiklik türlerine göre doğru cevap oranı (aynı birim): üç sütun.
          expect(rm.bars.map((b) => b.key)).toEqual(['look', 'turn', 'place']);
          expect(rm.barsTitle).toMatch(/^Değişiklik türlerine göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('değişiklik türüdür');
        } else if (slug === 'sekil-akil-yurutme' || slug === 'sayi-dizileri' || slug === 'harf-dizileri') {
          // Kural türlerine göre doğru cevap oranı (aynı birim): beş sütun, kendi başlığı ve açıklamasıyla.
          expect(rm.bars.map((b) => b.key)).toEqual(
            slug === 'sekil-akil-yurutme'
              ? ['constant', 'progression', 'distribution', 'addition', 'xor']
              : slug === 'sayi-dizileri'
                ? ['step', 'ratio', 'growing', 'alternating', 'combined']
                : ['next', 'repeat', 'interleaved', 'group', 'growing'],
          );
          expect(rm.barsTitle).toMatch(/^Kural türlerine göre (sonucun|sonuç)$/);
          expect(rm.barsNote).toContain('kural türüdür');
        } else expect(rm.bars).toEqual([]);
        expect(rm.standout.map((x) => x.title), slug).toEqual(r[a].items.map((i) => i.title));
        expect(rm.study.items, slug).toHaveLength(4);
        expect(rm.settings?.title, slug).toBe('Bilmekte yarar var');
        expect(rm.intro, slug).toContain('puanı yükseltmek için değil');
        if (a === 'parent') expect(rm.approach!.items.length, slug).toBe(3);
        else expect(texts(rm).join(' '), slug).not.toMatch(/çocuğunuz/i);
        expectClean(rm, `${slug} ${a}`);
      }
    }
    const pdf = await renderSimpleReportPdf(evaluate('dikkat-ve-bellek', memoryTasksBody()).parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 120_000);
});

describe('bütün testlerde yol haritası', () => {
  it('çözülebilen her testin herkese açık bir yol haritası var', () => {
    for (const d of solvableInstruments()) expect(hasPublicRoadmap(d.slug), d.slug).toBe(true);
  });
});
