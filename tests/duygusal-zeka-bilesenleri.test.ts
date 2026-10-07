import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ADULT_GRADE } from '@/lib/config';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
import { scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';

const SLUG = 'duygusal-zeka-bilesenleri';
const d = def<LikertInstrument>(SLUG);

/** Kaynaktaki ölçek kısaltması → ölçek ve ölçeğin madde sayısı (Başkalarını önemseme: iki madde çıkarıldı). */
const SCALES: Record<string, [string, number]> = {
  pexp: ['positive_expressivity', 9],
  nexp: ['negative_expressivity', 10],
  atte: ['attending_emotions', 10],
  edec: ['emotion_decisions', 9],
  rjoy: ['responsive_joy', 10],
  rdis: ['responsive_distress', 10],
  empc: ['empathic_concern', 8],
};

/**
 * Kaynak sayfadaki (ipip.ori.org/newEmotionalIntelligenceKey.htm) 68 madde, sayfadaki sırayla: her ölçekte önce artı,
 * sonra eksi yönlü maddeler. Madde anahtarı "ölçek kısaltması + sayfadaki sıra"dır (ör. empc07: Empathic Concern'ün
 * yedinci maddesi, yani eksi yönlü ikinci madde).
 */
const SOURCE: Record<string, { plus: string[]; minus: string[] }> = {
  pexp: {
    plus: [
      'Express my affection physically.',
      'Laugh out loud if something is funny.',
      'Express my happiness in a childlike manner.',
      'Sometimes laugh out loud when reading or watching TV.',
      'Hug my close friends.',
      "Show my feelings when I'm happy.",
    ],
    minus: [
      'Find it difficult showing people that I care about them.',
      'Have difficulty showing affection.',
      'Keep my happy feelings to myself.',
    ],
  },
  nexp: {
    plus: [
      "Shout or scream when I'm angry.",
      "Can't help but look upset when something bad happens.",
      'Show my fear.',
      'Suspect that my facial expressions give me away when I feel sad.',
      'Show my sadness.',
    ],
    minus: [
      'Keep my feelings to myself, regardless of how unhappy I am.',
      "Find it difficult showing people that I'm angry with them.",
      'Keep my feelings to myself, regardless of how scared I am.',
      'Rarely show my anger.',
      'Wish I could more easily show my negative feelings.',
    ],
  },
  atte: {
    plus: [
      'Think about the causes of my emotions.',
      'Pay a lot of attention to my feelings.',
      "Am usually aware of the way that I'm feeling.",
      'Notice my emotions.',
      "Often stop to analyze how I'm feeling.",
    ],
    minus: [
      'Rarely think about how I feel.',
      'Rarely analyze my emotions.',
      'Am not in touch with my feelings.',
      'Often ignore my feelings.',
      'Rarely notice my emotional reactions.',
    ],
  },
  edec: {
    plus: [
      'Listen to my feelings when making important decisions.',
      'Base my goals in life on inspiration, rather than logic.',
      'Plan my life based on how I feel.',
      'Believe emotions give direction to life.',
      'Listen to my heart rather than my brain.',
    ],
    minus: [
      'Plan my life logically.',
      'Believe important decisions should be based on logical reasoning.',
      'Listen to my brain rather than my heart.',
      'Make decisions based on facts, not feelings.',
    ],
  },
  rjoy: {
    plus: [
      'Like to watch children open presents.',
      'Usually end up laughing if the people around me are laughing.',
      "Feel other people's joy.",
      'Get caught up in the excitement when others are celebrating.',
      'Am strongly influenced by the good moods of others.',
      'Find it hard to stay in a bad mood if the people around me are happy.',
    ],
    minus: [
      "Dislike being around happy people when I'm feeling sad.",
      "Am unaffected by other people's happiness.",
      'Rarely get caught up in the excitement.',
      "Dislike children's birthday parties.",
    ],
  },
  rdis: {
    plus: [
      "Am deeply moved by others' misfortunes.",
      'Am easily moved to tears.',
      "Suffer from others' sorrows.",
      'Am upset by the misfortunes of strangers.',
      'Would be upset if I saw an injured animal.',
    ],
    minus: [
      'Am calm even in tense situations.',
      'Am not easily disturbed by events.',
      'Am unaffected by the suffering of others.',
      'Rarely cry during sad movies.',
      'Remain calm during emergencies.',
    ],
  },
  empc: {
    plus: [
      'Am concerned about others.',
      'Feel sympathy for those who are worse off than myself.',
      'Sympathize with the homeless.',
      'Believe that criminals should receive help rather than punishment.',
      'Believe that the poor deserve our sympathy.',
    ],
    minus: [
      'Feel little concern for others.',
      'Have no sympathy for criminals.',
      'Look down on any weakness.',
      "Don't like to get involved in other people's problems.",
      'Have little sympathy for the unemployed.',
    ],
  },
};

/** Kullanılmayan iki madde (suçlulara bakış): empc04 ve empc07. */
const REMOVED = ['empc04', 'empc07'];

/** Kaynak sayfadaki bütün maddeler: anahtar → [İngilizce metin, eksi yönlü mü]. */
const PAGE = new Map(
  Object.entries(SOURCE).flatMap(([p, { plus, minus }]) =>
    [...plus.map((t) => [t, false] as const), ...minus.map((t) => [t, true] as const)].map(
      ([t, rev], i) => [`${p}${String(i + 1).padStart(2, '0')}`, [t, rev] as const] as const,
    ),
  ),
);

/** Her maddenin anahtara göre en yüksek (5) ya da en düşük (1) puan alacağı cevaplar. */
function keyedAnswers(level: (scale: string) => 'high' | 'low' | 'mid') {
  return Object.fromEntries(
    d.items.map((it) => {
      const l = level(it.scale);
      const v = l === 'mid' ? 3 : (l === 'high') !== !!it.reverse ? 5 : 1;
      return [it.key, { value: v, rtMs: 2600 }];
    }),
  );
}

const NAMES = [
  'Olumlu duyguları gösterme',
  'Olumsuz duyguları gösterme',
  'Duygularına dikkat etme',
  'Duygulara göre karar verme',
  'Başkalarının sevincine ortak olma',
  'Üzücü olaylardan etkilenme',
  'Başkalarını önemseme',
];

describe('Duygusal Zekâ Bileşenleri (Barchard, 2001) tanımı', () => {
  it('66 madde, yedi ayrı ölçek; bileşik ölçek ve toplam puan yok', () => {
    expect(d.items).toHaveLength(66);
    expect(d.scales.map((s) => s.key)).toEqual(Object.values(SCALES).map(([k]) => k));
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const [key, n] of Object.values(SCALES)) expect(d.items.filter((i) => i.scale === key), key).toHaveLength(n);
    expect(d.scales.some((s) => s.of)).toBe(false);
    expect(d.totalScale).toBeUndefined();
    expect(d.profile).toBeUndefined();
    expect(new Set(d.items.map((i) => i.key)).size).toBe(66);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(66);
    expect(new Set(d.items.map((i) => i.source)).size).toBe(66);
    for (const it of d.items) {
      expect(it.source, it.key).toBeTruthy();
      expect(it.text, it.key).toMatch(/[.]$/);
    }
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.plain.length, s.key).toBeGreaterThan(30);
    }
  });

  it('her madde kaynaktaki metni, ölçeği ve yönüyle aynı; kaynaktan yalnızca iki madde eksik', () => {
    expect(PAGE.size).toBe(68);
    for (const it of d.items) {
      const page = PAGE.get(it.key);
      expect(page, it.key).toBeDefined();
      expect(it.source, it.key).toBe(page![0]);
      expect(!!it.reverse, it.key).toBe(page![1]);
      expect(SCALES[it.key.slice(0, 4)]?.[0], it.key).toBe(it.scale);
    }
    const missing = [...PAGE.keys()].filter((k) => !d.items.some((i) => i.key === k));
    expect(missing).toEqual(REMOVED);
    expect(d.items.filter((i) => i.reverse)).toHaveLength(30);
    // Başkalarını önemseme: dört artı, dört eksi yönlü madde.
    const ec = d.items.filter((i) => i.scale === 'empathic_concern');
    expect(ec.filter((i) => i.reverse)).toHaveLength(4);
    expect(PAGE.get('empc04')![0]).toContain('criminals');
    expect(PAGE.get('empc07')![0]).toContain('criminals');
  });

  it('suçlulara nasıl davranılması gerektiğini soran iki madde kullanılmaz; siyasi görüş ya da inanç soran madde yok', () => {
    expect(d.items.map((i) => i.key)).not.toContain('empc04');
    expect(d.items.map((i) => i.key)).not.toContain('empc07');
    expect(d.items.some((i) => /criminal|punish/i.test(i.source ?? ''))).toBe(false);
    expect(d.items.some((i) => /suçlu|ceza/i.test(i.text))).toBe(false);
    const politics = /(?<!\p{L})(din|dinî|dini|inanç|ibadet|oy|seçim|parti|aday|siyas\p{L}*)(?!\p{L})/iu;
    for (const it of d.items) expect(politics.test(it.text), it.text).toBe(false);
    expect(d.items.some((i) => /vote|liberal|conservative|religio|god\b|politic/i.test(i.source ?? ''))).toBe(false);
  });

  it('uygulama sırası: art arda iki madde aynı ölçekten değil; ilk yedi madde yedi ölçeğin her birinden', () => {
    for (let i = 1; i < d.items.length; i++) expect(d.items[i].scale, d.items[i].key).not.toBe(d.items[i - 1].scale);
    expect(new Set(d.items.slice(0, 7).map((i) => i.scale)).size).toBe(7);
    expect(d.items[0].key).toBe('pexp01');
    // Her ölçekte maddeler kaynaktaki sırayla, bir artı bir eksi yönlü dizilir (biri bitince öteki sırayla devam eder);
    // ölçeklerden biri artı, sonraki eksi yönlü bir maddeyle başlar.
    Object.keys(SCALES).forEach((prefix, n) => {
      const own = d.items.filter((i) => i.key.startsWith(prefix)).map((i) => i.key);
      const plus = [...PAGE.keys()].filter((k) => k.startsWith(prefix) && !PAGE.get(k)![1] && !REMOVED.includes(k));
      const minus = [...PAGE.keys()].filter((k) => k.startsWith(prefix) && PAGE.get(k)![1] && !REMOVED.includes(k));
      const [first, second] = n % 2 === 0 ? [plus, minus] : [minus, plus];
      const expected: string[] = [];
      for (let i = 0; i < Math.max(first.length, second.length); i++) expected.push(...[first[i], second[i]].filter(Boolean));
      expect(own, prefix).toEqual(expected);
    });
    // Ölçekler sırayla birer madde verir.
    const order = Object.keys(SCALES);
    const rounds = d.items.map((it) => d.items.filter((x) => x.scale === it.scale).indexOf(it));
    for (let i = 1; i < d.items.length; i++) {
      const [a, b] = [d.items[i - 1], d.items[i]];
      const before = rounds[i - 1] < rounds[i] || (rounds[i - 1] === rounds[i] && order.indexOf(a.key.slice(0, 4)) < order.indexOf(b.key.slice(0, 4)));
      expect(before, `${a.key} → ${b.key}`).toBe(true);
    }
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri kullanılır', () => {
    const others = ['alti-boyutlu-kisilik-profili', 'ayrintili-kisilik-profili', 'bes-faktor-kisilik'].map((s) => def<LikertInstrument>(s));
    // Ayrıntılı Kişilik Profili'nde İngilizce aslı noktasız yazılmıştır.
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      for (const x of same) expect(it.text, it.source).toBe(x.text);
    }
    expect(shared).toBe(10);
  });

  it('ölçek puanları birbirinden bağımsız; güvenirlik ve standart sapma olmadığı için ölçüm payı yok', () => {
    const scores = scoreLikert(d, keyedAnswers((s) => (s === 'emotion_decisions' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('emotion_decisions')!.mean).toBe(5);
    expect(byKey.get('empathic_concern')!.mean).toBe(1);
    expect(byKey.get('empathic_concern')!.nItems).toBe(8);
    for (const s of d.scales) {
      expect(s.alpha, s.key).toBeUndefined();
      expect(s.sdRef, s.key).toBeUndefined();
    }
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni öğrenci ve veli için yazılmış; destek kutusu yok', () => {
    const t = REPORT_TEMPLATES[SLUG];
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const bt = t.scales[s.key]?.[band];
        expect(bt, `${s.key}/${band}`).toBeDefined();
        expect(bt!.summary.length, `${s.key}/${band}`).toBeGreaterThan(3);
        expect(bt!.student.length, `${s.key}/${band}`).toBeGreaterThan(50);
        expect(bt!.student, `${s.key}/${band}`).toContain('söylüyorsun');
        expect(bt!.parent, `${s.key}/${band}`).toContain('Çocuğunuz');
        expect(bt!.student, `${s.key}/${band}`).not.toContain('Çocuğunuz');
        // Klinik terimler kullanılmaz.
        expect(`${bt!.student} ${bt!.parent}`, `${s.key}/${band}`).not.toMatch(/depresyon|anksiyete|kaygı bozukluğu|hastalık|empati eksikliği/i);
        expect(bt!.support, `${s.key}/${band}`).toBeUndefined();
      }
    }
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    expect(t.overview?.student).toContain('toplam bir puan yoktur');
    expect(t.overview?.parent).toContain('toplam bir puan yoktur');
  });

  it('bilim kartı ve tanıtım: yetenek testi olmadığı, Türkçe uyarlama ve güvenirlik açıkça yazılı', () => {
    expect(d.estimatedMinutes).toBe(10);
    expect(d.intro.paragraphs.join(' ')).toContain('66');
    expect(d.description).toContain('66 cümle');
    expect(d.description).toContain('yetenek testi değildir');
    expect(d.science.whatItMeasures).toContain('yetenek testi değildir');
    expect(d.science.whatItMeasures).toContain('toplam bir “duygusal zekâ puanı” hesaplanmaz');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.turkishVersion).toContain('Tatar ve ark., 2016');
    expect(d.science.turkishVersion).toContain('suçlulara');
    expect(d.science.reliability).toContain('.59 ile .81');
    expect(d.science.reliability).toContain('.63 ile .83');
    expect(d.science.reliability).toContain('.57 ile .71');
    expect(d.science.reliability).toContain('düşük ile orta arasında');
    expect(d.science.reliability).toContain('ölçüm payı gösterilmez');
    // "8–10 cümle" açıklaması ölçeklerin gerçek uzunluğuyla aynı kalmalı.
    const lengths = d.scales.map((s) => d.items.filter((i) => i.scale === s.key).length);
    expect([Math.min(...lengths), Math.max(...lengths)]).toEqual([8, 10]);
    expect(REPORT_TEMPLATES[SLUG].overview?.student).toContain('8–10 cümleyle');
    const urls = d.science.citations.map((c) => c.url);
    expect(urls).toContain('https://ipip.ori.org/newEmotionalIntelligenceKey.htm');
    expect(urls).toContain('https://doi.org/10.5455/apd.189925');
    expect(d.domain).toBe('skills');
    // Test adında "tanı" sözcüğü kullanılmaz.
    expect(d.name.toLocaleLowerCase('tr-TR')).not.toMatch(/(?<!\p{L})tanı/u);
  });
});

describe('Duygusal Zekâ Bileşenleri raporu', () => {
  it('genel bakışta yedi bileşen; her biri için düzey ve kısa yorum', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(NAMES);
      expect(rows.every((x) => x.ciLow === null && x.ciHigh === null)).toBe(true);
      expect(rep.chartNote).toContain('toplam bir puan yoktur');
      expect(rep.chartNote).not.toContain('sarı bant');
      expect(rep.items.map((x) => x.title)).toEqual(NAMES);
      for (const it of rep.items) expect(it.text.length, it.title).toBeGreaterThan(40);
      expect(rep.groups).toBeUndefined();
    }
    expect(r.parent.chartNote).toContain('çıkarılmamalıdır');
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
    expect(r.student.items[0].text).not.toContain('Çocuğunuz');
  });

  it('uç cevaplarda bile destek kutusu çıkmaz', () => {
    for (const level of ['high', 'low'] as const) {
      const r = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers: keyedAnswers(() => level) } });
      expect(r.student.support, level).toBeNull();
      expect(r.parent.support, level).toBeNull();
      const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
      expect(rows.every((x) => x.band === (level === 'high' ? 'Yüksek' : 'Düşük')), level).toBe(true);
    }
  });

  it('orta cevaplarda bütün ölçekler orta düzeyde', () => {
    const r = evaluate(SLUG, { grade: 12, data: { engine: 'likert', answers: keyedAnswers(() => 'mid') } });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.every((x) => x.band === 'Orta' && x.value === 3)).toBe(true);
  });

  it('yetişkine tek, kişisel rapor', () => {
    const adult = evaluateAdult(SLUG, { grade: ADULT_GRADE, data: { engine: 'likert', answers: keyedAnswers(() => 'high') } }).adult;
    expect(adult.audience).toBe('adult');
    expect(adult.items).toHaveLength(7);
    expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
    expect(adult.chartNote).toContain('toplam bir puan yoktur');
    expect(adult.support).toBeNull();
    // Yetişkine giden raporda okula ya da ergenliğe özgü sözcük yok (yetiskin.test.ts ile aynı liste). Gelişim yol
    // haritasının yetişkin metinleri tests/roadmap.test.ts içinde ayrıca denetlenir: bağlantı adları rehber yazılarının
    // adlarıdır ("Etkili ders çalışma yöntemleri").
    const school = ['okul', 'öğretmen', 'sınav', 'sınıf', 'ders', 'ödev', 'öğrenci', 'lise', 'ergen', 'veli', 'ailen', 'yaşıt', 'yaşında', 'yetişkinle', 'yetişkine', 'yetişkinden'];
    for (const level of ['high', 'low', 'mid'] as const) {
      const { roadmap, ...r } = evaluateAdult(SLUG, { grade: ADULT_GRADE, data: { engine: 'likert', answers: keyedAnswers(() => level) } }).adult;
      expect(roadmap?.approach, level).toBeNull();
      const words = (JSON.stringify(r).toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? []).filter((w) => school.some((p) => w.startsWith(p)));
      expect(words, level).toEqual([]);
    }
  });

  it('hoca onayladı: yayında, listelerde ve site haritasında', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
  });
});
