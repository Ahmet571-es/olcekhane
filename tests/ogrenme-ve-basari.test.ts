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
import { scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'ogrenme-ve-basari-ozellikleri';
const d = def<LikertInstrument>(SLUG);

/** Madde anahtarının ölçek kısmı → [ölçek, madde sayısı, ad]. */
const SCALES: Record<string, [string, number, string]> = {
  dili: ['diligence', 10, 'Çaba ve sebat'],
  init: ['initiative', 10, 'İşe hemen koyulma'],
  plan: ['planfulness', 9, 'Planlı ve dikkatli çalışma'],
  comp: ['competence', 8, 'Zorlukla başa çıkma'],
  ncog: ['need_for_cognition', 10, 'Düşünmekten hoşlanma'],
  open: ['openness', 9, 'Öğrenmeye açıklık'],
};
const NAMES = Object.values(SCALES).map(([, , n]) => n);
const prefix = (key: string) => key.slice(0, -2);

/**
 * Kaynak sayfalardaki maddeler, sayfadaki sırayla (her ölçekte önce artı, sonra eksi yönlü): IPIP-HEXACO Diligence,
 * TCI benzeri Initiative (P1) ve Competence (P2), MPQ benzeri Planfulness, Need for Cognition, 6FPQ benzeri
 * Intellectual Openness. Madde anahtarı "ölçek + sayfadaki sıra"dır.
 */
const SOURCE: Record<string, { plus: string[]; minus: string[] }> = {
  dili: {
    plus: ['Push myself very hard to succeed.', 'Get started quickly on doing a job.', 'Am exacting in my work.', 'Work hard.', 'Complete tasks successfully.'],
    minus: ['Do just enough work to get by.', 'Stop when work becomes too difficult.', 'Do too little work.', 'Hang around doing nothing.', 'Quickly lose interest in the tasks I start.'],
  },
  init: {
    plus: ['Get things done quickly.', 'Get chores done right away.', 'Get to work at once.', 'Plunge into tasks with all my heart.', 'Finish tasks quickly.', 'Start tasks right away.'],
    minus: ['Have difficulty starting tasks.', 'Need a push to get started.', 'Find it difficult to get down to work.', 'Put off unpleasant tasks.'],
  },
  plan: {
    plus: ['Like to plan ahead.', 'Do things by the book.', 'Am exacting in my work.', 'Pay attention to details.', 'Make plans and stick to them.'],
    minus: ['Jump into things without thinking.', 'Like to act on a whim.', 'Often make last-minute plans.', 'Make rash decisions.', 'Make a mess of things.'],
  },
  comp: {
    plus: ['Like to solve complex problems.', 'Feel up to any task.', 'Can perform a wide variety of tasks.', 'Accept challenging tasks.', 'Know how to apply my knowledge.', 'Meet challenges.'],
    minus: ['Give up easily.', "Don't put my mind on the task at hand.", "Don't see things through."],
  },
  ncog: {
    plus: [
      'Like to solve complex problems.',
      'Need things explained only once.',
      'Can handle a lot of information.',
      'Love to think up new ways of doing things.',
      'Am quick to understand things.',
      'Love to read challenging material.',
    ],
    minus: ['Have difficulty understanding abstract ideas.', 'Try to avoid complex people.', 'Avoid difficult reading material.', 'Avoid philosophical discussions.'],
  },
  open: {
    plus: ['Carry the conversation to a higher level.', 'Am interested in many things.', 'Prefer variety to routine.', 'Want to increase my knowledge.', 'Am open to change.'],
    minus: [
      'Prefer to stick with things that I know.',
      'Am not interested in abstract ideas.',
      'Am not interested in theoretical discussions.',
      'Try to avoid complex people.',
      'Rarely look for a deeper meaning in things.',
    ],
  },
};

/** İki ölçekte birden bulunan, bu testte yalnızca öteki ölçekte sorulan üç madde. */
const REMOVED = ['plan03', 'comp01', 'open09'];

/** Kaynaktaki bütün maddeler: anahtar → [İngilizce metin, eksi yönlü mü]. */
const PAGE = new Map(
  Object.entries(SOURCE).flatMap(([p, { plus, minus }]) =>
    [...plus.map((t) => [t, false] as const), ...minus.map((t) => [t, true] as const)].map(
      ([t, rev], i) => [`${p}${String(i + 1).padStart(2, '0')}`, [t, rev] as const] as const,
    ),
  ),
);

type Level = 'high' | 'low' | 'mid';
/** Her maddeye, ölçeğine göre en yüksek (5), en düşük (1) ya da orta (3) puan verecek cevap. */
function keyedAnswers(level: (scale: string) => Level) {
  return Object.fromEntries(
    d.items.map((it) => {
      const l = level(it.scale);
      const v = l === 'mid' ? 3 : (l === 'high') !== !!it.reverse ? 5 : 1;
      return [it.key, { value: v, rtMs: 2600 }];
    }),
  );
}
const body = (level: (scale: string) => Level, grade = 10) => ({ grade, data: { engine: 'likert' as const, answers: keyedAnswers(level) } });

function roadmapTexts(rm: Roadmap): string[] {
  return [
    rm.intro,
    rm.standoutNote ?? '',
    rm.study.intro,
    ...rm.study.items.map((i) => i.text),
    ...(rm.settings ? [rm.settings.title, rm.settings.intro, ...rm.settings.items, rm.settings.note] : []),
    ...rm.weeks.map((w) => `${w.title} ${w.text}`),
    ...(rm.approach?.items.map((i) => i.text) ?? []),
  ].filter(Boolean);
}

describe('Öğrenme ve Başarı Özellikleri tanımı', () => {
  it('56 madde, altı ayrı ölçek; bileşik ölçek ve toplam puan yok', () => {
    expect(d.items).toHaveLength(56);
    expect(d.scales.map((s) => s.key)).toEqual(Object.values(SCALES).map(([k]) => k));
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const [key, n] of Object.values(SCALES)) expect(d.items.filter((i) => i.scale === key), key).toHaveLength(n);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(56);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(56);
    expect(new Set(d.items.map((i) => i.source)).size).toBe(56);
    for (const it of d.items) expect(it.text, it.key).toMatch(/^[^a-z].*[.]$/);
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
    }
    expect([d.status, d.licenseStatus, d.minGrade, d.maxGrade, d.adults, d.domain]).toEqual(['active', 'public_domain', 9, 13, true, 'personality']);
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; kaynaktan yalnızca iki ölçekte birden bulunan üç madde eksik', () => {
    expect(PAGE.size).toBe(59);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.source, it.key).toBe(page![0]);
      expect(!!it.reverse, it.key).toBe(page![1]);
      expect(SCALES[prefix(it.key)]?.[0], it.key).toBe(it.scale);
    }
    expect([...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k))).toEqual(REMOVED);
    // Çıkarılan her madde, bu testte başka bir ölçekte aynı yönle sorulur.
    for (const k of REMOVED) {
      const [text, rev] = PAGE.get(k)!;
      const asked = d.items.find((i) => i.source === text);
      expect(asked, k).toBeDefined();
      expect(!!asked!.reverse, k).toBe(rev);
      expect(prefix(asked!.key), k).not.toBe(prefix(k));
    }
    expect(d.items.filter((i) => i.reverse)).toHaveLength(25);
  });

  it('siyasi görüş, inanç ya da ahlaki görüş soran madde yok; VIA ölçeği kullanılmaz', () => {
    expect(d.items.some((i) => /religio|anthem|laws?\b|vote|liberal|conservative|god\b|politic|criminal/i.test(i.source ?? ''))).toBe(false);
    const politics = /(?<!\p{L})(din|dinî|dini|inanç\p{L}*|ibadet|oy|seçim|parti|aday|siyas\p{L}*|yasa\p{L}*|marş\p{L}*)(?!\p{L})/iu;
    for (const it of d.items) expect(politics.test(it.text), it.text).toBe(false);
    expect(d.science.citations.some((c) => /VIA/.test(c.url ?? '') || /VIA/.test(c.text))).toBe(false);
  });

  it('uygulama sırası: her ölçek teste eşit aralıklarla yayılır, art arda iki madde aynı ölçekten değil', () => {
    for (let i = 1; i < d.items.length; i++) expect(d.items[i].scale, d.items[i].key).not.toBe(d.items[i - 1].scale);
    expect(new Set(d.items.slice(0, 6).map((i) => i.scale)).size).toBe(6);
    const order = Object.keys(SCALES);
    const expected: { key: string; pos: number; j: number }[] = [];
    order.forEach((p, j) => {
      const keys = [...PAGE.keys()].filter((k) => prefix(k) === p && !REMOVED.includes(k));
      const plus = keys.filter((k) => !PAGE.get(k)![1]);
      const minus = keys.filter((k) => PAGE.get(k)![1]);
      const [first, second] = j % 2 === 0 ? [plus, minus] : [minus, plus];
      const own: string[] = [];
      for (let i = 0; i < Math.max(first.length, second.length); i++) own.push(...[first[i], second[i]].filter(Boolean));
      own.forEach((key, k) => expected.push({ key, pos: (k + (j + 0.5) / order.length) / own.length, j }));
    });
    expected.sort((x, y) => x.pos - y.pos || x.j - y.j);
    expect(d.items.map((i) => i.key)).toEqual(expected.map((x) => x.key));
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri kullanılır (32 madde)', () => {
    const others = [
      'alti-boyutlu-kisilik-profili',
      'ayrintili-kisilik-profili',
      'bes-faktor-kisilik',
      'kisilerarasi-tarz',
      'duygusal-zeka-bilesenleri',
      '16-faktorlu-kisilik-profili',
    ].map((s) => def<LikertInstrument>(s));
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      // Öteki testler bir maddede ayrışıyorsa ("Have difficulty understanding abstract ideas": Beş Faktör 6. sınıftan
      // başladığı için açıklamalı) 9. sınıftan başlayan Ayrıntılı Kişilik Profili'nin çevirisi kullanılır.
      expect(same.map((x) => x.text), it.source).toContain(it.text);
      if (new Set(same.map((x) => x.text)).size > 1) {
        expect(it.text, it.source).toBe(def<LikertInstrument>('ayrintili-kisilik-profili').items.find((x) => norm(x.source) === norm(it.source))!.text);
      }
    }
    expect(shared).toBe(32);
  });

  it('düzey, raporda gösterilen (bir ondalığa yuvarlanmış) puandan belirlenir: 8 ve 9 maddelik ölçeklerde de sayı ile düzey uyuşur', () => {
    // Planlı ve dikkatli çalışma 9 maddeli: toplam 23 → 2,556 → "2,6" gösterilir ve 2,6 orta düzeyin eşiğidir.
    // Zorlukla başa çıkma 8 maddeli: toplam 27 → 3,375 → "3,4" gösterilir ve 3,4 yüksek düzeyin eşiğidir.
    const keyed = (scale: string, total: number) => {
      const own = d.items.filter((i) => i.scale === scale);
      const base = Math.floor(total / own.length);
      let extra = total - base * own.length;
      return own.map((it) => {
        const v = base + (extra-- > 0 ? 1 : 0);
        return [it.key, { value: it.reverse ? 6 - v : v, rtMs: 2600 }] as const;
      });
    };
    const answers = Object.fromEntries([
      ...keyed('planfulness', 23),
      ...keyed('competence', 27),
      ...d.items.filter((i) => i.scale !== 'planfulness' && i.scale !== 'competence').map((i) => [i.key, { value: 3, rtMs: 2600 }] as const),
    ]);
    const r = evaluate(SLUG, { grade: 10, data: { engine: 'likert', answers } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.find((x) => x.label === 'Planlı ve dikkatli çalışma')).toMatchObject({ valueLabel: '2,6 / 5', band: 'Orta' });
    expect(rows.find((x) => x.label === 'Zorlukla başa çıkma')).toMatchObject({ valueLabel: '3,4 / 5', band: 'Yüksek' });
  });

  it('ölçek puanları birbirinden bağımsız; ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'competence' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('competence')!.mean).toBe(5);
    expect(byKey.get('competence')!.nItems).toBe(8);
    expect(byKey.get('planfulness')!.mean).toBe(1);
    expect(byKey.get('planfulness')!.nItems).toBe(9);
    for (const s of d.scales) {
      expect(s.alpha, s.key).toBeUndefined();
      expect(s.sdRef, s.key).toBeUndefined();
    }
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni yazılmış; destek kutusu ve ayrı yetişkin metni yok', () => {
    const t = REPORT_TEMPLATES[SLUG];
    // Kişilik özellikleridir: "güçlü yan / geliştirilebilecek alan" ayrımı yapılmaz (reports/types.ts).
    expect(t.evaluative).toBeUndefined();
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    expect(Object.keys(t.bandLabels)).toEqual(['low', 'average', 'high']);
    for (const s of d.scales) {
      const summaries = new Set<string>();
      for (const band of ['low', 'average', 'high'] as const) {
        const label = `${s.key}/${band}`;
        const bt = t.scales[s.key]?.[band];
        expect(bt, label).toBeDefined();
        summaries.add(bt!.summary);
        expect(bt!.summary, label).not.toBe(t.bandLabels[band]);
        expect(bt!.student.length, label).toBeGreaterThan(80);
        expect(bt!.student, label).toContain('söylüyorsun');
        expect(bt!.parent, label).toMatch(/^Çocuğunuz /);
        expect(bt!.parent, label).toContain('belirtiyor');
        expect(bt!.student, label).not.toMatch(/[Çç]ocuğunuz/);
        expect(`${bt!.student} ${bt!.parent}`, label).not.toMatch(/tembel|disiplinsiz|beceriksiz|yeteneksiz|bozukluk|hastalık|dikkat eksikliği|zeki|aptal/i);
        expect(bt!.support, label).toBeUndefined();
        expect(bt!.adult, label).toBeUndefined();
        expect(schoolWords(bt!.student), label).toEqual([]);
        expect(bt!.student, label).toMatch(/[.]$/);
        expect(bt!.parent, label).toMatch(/[.]$/);
      }
      expect(summaries.size, s.key).toBe(3);
    }
    // Aynı sayfadaki kartlar çelişmesin: iş zorlaşınca bırakmak yalnızca Çaba ve sebat'ta, kendine güven yalnızca Zorlukla
    // başa çıkma'da anlatılır (bir kişi çok çalışıp yine de kendine güvenmeyebilir).
    for (const band of ['low', 'average', 'high'] as const) {
      const c = t.scales.competence[band]!;
      const g = t.scales.diligence[band]!;
      expect(`${c.student} ${c.parent}`, band).not.toMatch(/pes |bırak|sonuna kadar/);
      expect(`${g.student} ${g.parent}`, band).not.toMatch(/güven/);
    }
    for (const band of ['low', 'average', 'high'] as const) {
      expect(t.scales.need_for_cognition[band]!.student, band).toContain('zekâyı ölçmez');
      expect(t.scales.need_for_cognition[band]!.parent, band).toContain('zekâyı ölçmez');
    }
    const lengths = d.scales.map((s) => d.items.filter((i) => i.scale === s.key).length);
    expect([Math.min(...lengths), Math.max(...lengths)]).toEqual([8, 10]);
    expect(t.overview?.student).toContain('8–10 cümleyle');
    expect(t.overview?.student).toContain('toplam bir puan yoktur');
    expect(t.overview?.parent).toContain('toplam bir puan yoktur');
  });

  it('bilim kartı ve tanıtım: kaynak ölçekler, eksik maddeler, güvenirlik ve sınırlar açıkça yazılı', () => {
    expect(d.intro.paragraphs.join(' ')).toContain('56');
    expect(d.description).toContain('56 cümle');
    expect(d.description).toContain('yetenek ya da zekâ testi değildir');
    expect(d.science.basedOn).toContain('Kaynaktaki 59 maddeden');
    expect(d.science.basedOn).toContain('56 madde');
    expect(d.science.turkishVersion).toContain('32 madde');
    expect(d.science.turkishVersion).toContain('24 madde');
    expect(d.science.reliability).toContain('.75 ile .85');
    expect(d.science.reliability).toContain('ölçüm payı gösterilmez');
    expect(d.science.reliability).toContain('bir eksik maddeyle');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.normStatus).toBe('none');
    const urls = d.science.citations.map((c) => c.url);
    for (const u of [
      'https://ipip.ori.org/newHEXACO_PI_key.htm',
      'https://ipip.ori.org/newTCIKey.htm',
      'https://ipip.ori.org/newMPQKey.htm',
      'https://ipip.ori.org/new6FPQKey.htm',
      'https://ipip.ori.org/newSingleConstructsKey.htm',
      'https://doi.org/10.1037/0022-3514.42.1.116',
      'https://doi.org/10.1037/a0014996',
      'https://doi.org/10.1037/a0026838',
      'https://doi.org/10.1037/0033-2909.133.1.65',
    ]) {
      expect(urls, u).toContain(u);
    }
    // Bilim kartında anılan her çalışma kaynaklarda yer alır.
    const body = JSON.stringify({ ...d.science, citations: [] });
    for (const a of ['Ashton', 'Cacioppo', 'Poropat', 'Richardson', 'Steel']) {
      expect(body, a).toContain(a);
      expect(d.science.citations.some((c) => c.text.startsWith(a)), a).toBe(true);
    }
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
    // Ölçek sayısı ve madde sayıları kod yorumunda ve kartta aynı.
    const src = readFileSync(new URL('../src/content/instruments/ogrenme-ve-basari.ts', import.meta.url), 'utf8');
    expect(src).toContain('10 maddenin 9\'u');
    expect(src).toContain('9 maddenin 8\'i');
  });
});

describe('Öğrenme ve Başarı Özellikleri raporu', () => {
  it('genel bakışta altı özellik; her biri için düzey ve kısa yorum', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.items.map((x) => x.title)).toEqual(NAMES);
      for (const it of rep.items) expect(it.text.length, it.title).toBeGreaterThan(40);
      expect(rep.support).toBeNull();
    }
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
    expect(r.student.items[0].text).not.toContain('Çocuğunuz');
  });

  it('her özelliğin her düzeyi tek tek: kart, rozet ve yol haritası birbiriyle tutarlı (öğrenci, veli, yetişkin)', () => {
    const t = REPORT_TEMPLATES[SLUG];
    const keys = d.scales.map((s) => s.key);
    const LEVEL = { low: 'low', average: 'mid', high: 'high' } as const;
    let n = 0;
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const b = body((x) => (x === s.key ? LEVEL[band] : 'mid'));
        const r = evaluate(SLUG, b);
        const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
        const bt = t.scales[s.key][band]!;
        const label = `${s.key}/${band}`;
        for (const [rep, text] of [
          [r.student, bt.student],
          [r.parent, bt.parent],
          [adult, bt.student],
        ] as const) {
          const item = rep.items[keys.indexOf(s.key)];
          expect(item.text, label).toBe(text);
          expect(item.badge, label).toBe(`${t.bandLabels[band]} · ${bt.summary}`);
          expect(rep.items.filter((x) => x.badge?.startsWith('Orta')).length, label).toBe(band === 'average' ? 6 : 5);
          expect(rep.support, label).toBeNull();
          const rm = rep.roadmap!;
          expect(rm.bars.map((x) => x.label), label).toEqual(NAMES);
          expect(rm.study.items.map((x) => x.key), label).toEqual(keys);
          expect(rm.settings, label).toBeNull();
          expect(rm.weeks.map((w) => w.title), label).toEqual([
            'Fark et',
            'Çalışma düzeni',
            // 3. hafta en düşük puanlı özellik (Planlı ve dikkatli çalışma 2. haftada); eşitlikte profildeki ilk özellik.
            band === 'low' && s.key !== 'planfulness' ? s.name : band === 'high' && s.key === 'diligence' ? 'İşe hemen koyulma' : 'Çaba ve sebat',
            'Gözden geçir',
          ]);
          expect(rm.study.links.map((l) => l.href), label).toEqual(['/rehber/etkili-ders-calisma-yontemleri']);
          expect(rm.approach?.items.length ?? 0, label).toBe(rep.audience === 'parent' ? 6 : 0);
          for (const x of roadmapTexts(rm)) {
            expect(x, label).not.toMatch(/undefined|null|\s{2}/);
            if (rep.audience !== 'parent') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
            if (rep.audience === 'adult') expect(schoolWords(x), `${label}: ${x}`).toEqual([]);
            if (rep.audience === 'adult') expect(x, label).not.toMatch(/kitap/i);
          }
          n++;
        }
      }
    }
    expect(n).toBe(6 * 3 * 3);
  }, 120_000);

  it('yol haritası raporun kendi cümlelerini tekrar etmez; veliye yaklaşım önerileri veli metinlerinde geçmez', () => {
    const t = ROADMAPS[SLUG];
    const tpl = REPORT_TEMPLATES[SLUG];
    for (const [key, sc] of Object.entries(t.scales)) {
      for (const g of ['low', 'average', 'high'] as const) {
        const report = `${tpl.scales[key][g]!.student} ${tpl.scales[key][g]!.parent}`;
        const own = [sc.study[g].student, sc.study[g].parent, sc.action[g].student, sc.action[g].parent, t.approach![key][g]];
        for (const text of own) {
          for (const sentence of text.split(/(?<=[.;:])\s+/)) {
            if (sentence.length < 25) continue;
            expect(report, `${key} ${g}: ${sentence}`).not.toContain(sentence.replace(/[.;:]$/, ''));
          }
        }
      }
    }
  });

  it('son haftada çalışma alışkanlıkları önerilir (yalnızca sınıfına uyan öğrenciye ve veliye); yetişkine test önerilmez', () => {
    const r = evaluate(SLUG, body(() => 'mid', 10));
    expect(r.student.roadmap!.weeks[3].text).toContain('Bir sonraki adım olarak hangi çalışma yöntemlerini kullandığını görmek için Çalışma Alışkanlıkları testini çözebilirsin.');
    expect(r.parent.roadmap!.weeks[3].text).toContain('çocuğunuzun hangi çalışma yöntemlerini kullandığını görmek için Çalışma Alışkanlıkları testini önerebilirsiniz.');
    const adult = evaluateAdult(SLUG, { ...body(() => 'mid'), grade: ADULT_GRADE }).adult;
    expect(adult.roadmap!.weeks[3].text).not.toContain('testini');
  });

  it('uç ve orta cevaplar: bütün özellikler aynı düzeyde', () => {
    for (const [level, label] of [['high', 'Yüksek'], ['low', 'Düşük'], ['mid', 'Orta']] as const) {
      const r = evaluate(SLUG, body(() => level, 12));
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(rows.every((x) => x.band === label), level).toBe(true);
    }
  });

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const level of ['high', 'low', 'mid'] as const) {
      const adult = evaluateAdult(SLUG, { ...body(() => level), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      expect(adult.items).toHaveLength(6);
      const { roadmap, ...rest } = adult;
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(rest)), level).toEqual([]);
      expect(roadmap?.approach, level).toBeNull();
      expect(roadmap?.study.links.map((l) => l.label)).toEqual(['Etkili çalışma yöntemleri']);
    }
    expect(schoolWords([d.intro.title, ...d.intro.paragraphs, d.prompt ?? ''].join(' '))).toEqual([]);
    for (const it of d.items) expect(schoolWords(it.text), it.key).toEqual([]);
  });

  it('PDF öğrenci, veli ve yetişkin için üretilir', async () => {
    const b = likertBody(SLUG, 11, (i) => (i * 7) % 5);
    const r = evaluate(SLUG, b);
    const adult = evaluateAdult(SLUG, { ...b, grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('gelişim yol haritası: altı sütun, altı ayrı renk; ortamlar yok', () => {
    expect(hasPublicRoadmap(SLUG)).toBe(true);
    expect(roadmapSummary(SLUG)).toBe(
      'parmakla döndürülebilen üç boyutlu profil, nasıl çalışılabileceğine dair öneriler, veliye yaklaşım önerileri ve dört haftalık küçük adımlar',
    );
    const t = ROADMAPS[SLUG];
    expect(new Set(Object.values(t.scales).map((x) => x.color)).size).toBe(6);
    expect(Object.values(t.scales).some((x) => x.settings)).toBe(false);
    expect(t.sources.every((s) => s.url?.startsWith('https://doi.org/'))).toBe(true);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin madde anahtarlarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /OGRENME_GOVDE=.*?n=(\{[^}]*\})/.exec(yml);
    const n = JSON.parse(m![1]) as Record<string, number>;
    const skipped = /not in \(("[a-z]+\d\d"(?:, )?)+\)/.exec(yml.slice(m!.index, m!.index + 600))![0].match(/[a-z]+\d\d/g)!;
    expect(skipped).toEqual(REMOVED);
    const keys = Object.entries(n).flatMap(([k, c]) => Array.from({ length: c }, (_, i) => `${k}${String(i + 1).padStart(2, '0')}`)).filter((k) => !REMOVED.includes(k));
    expect(keys.sort()).toEqual(d.items.map((i) => i.key).sort());
  });

  it('yayında: listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });
});
