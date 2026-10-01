import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ADULT_GRADE } from '@/lib/config';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
import { scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { def, likertBody } from './helpers/bodies';

const SLUG = 'kisilerarasi-tarz';
const d = def<LikertInstrument>(SLUG);

/** Kaynaktaki tarz kısaltması → ölçek ve çemberdeki açısı (Markey ve Markey, 2009). */
const OCTANTS: Record<string, [string, number]> = {
  PA: ['assured_dominant', 90],
  BC: ['arrogant_calculating', 135],
  DE: ['cold_hearted', 180],
  FG: ['aloof_introverted', 225],
  HI: ['unassured_submissive', 270],
  JK: ['unassuming_ingenuous', 315],
  LM: ['warm_agreeable', 0],
  NO: ['gregarious_extraverted', 45],
};

/** IPIP anahtar sayfasındaki (ipip.ori.org/newIPIP-IPCScoringKey.htm) 32 madde, sırayla; hepsi düz yönlü. */
const SOURCE: [string, string][] = [
  ['FG', 'Am quiet around strangers.'],
  ['HI', 'Speak softly.'],
  ['JK', 'Tolerate a lot from others.'],
  ['LM', 'Am interested in people.'],
  ['NO', 'Feel comfortable around people.'],
  ['PA', 'Demand to be the center of interest.'],
  ['BC', 'Cut others to pieces.'],
  ['DE', 'Believe people should fend for themselves.'],
  ['FG', 'Am a very private person.'],
  ['HI', 'Let others finish what they are saying.'],
  ['JK', 'Take things as they come.'],
  ['LM', 'Reassure others.'],
  ['NO', 'Start conversations.'],
  ['PA', 'Do most of the talking.'],
  ['BC', 'Contradict others.'],
  ['DE', "Don't fall for sob-stories."],
  ['FG', "Don't talk a lot."],
  ['HI', 'Seldom toot my own horn.'],
  ['JK', 'Think of others first.'],
  ['LM', "Inquire about others' well-being."],
  ['NO', 'Talk to a lot of different people at parties.'],
  ['PA', 'Speak loudly.'],
  ['BC', 'Snap at people.'],
  ['DE', "Don't put a lot of thought into things."],
  ['FG', 'Have little to say.'],
  ['HI', 'Dislike being the center of attention.'],
  ['JK', 'Seldom stretch the truth.'],
  ['LM', 'Get along well with others.'],
  ['NO', 'Love large parties.'],
  ['PA', 'Demand attention.'],
  ['BC', 'Have a sharp tongue.'],
  ['DE', "Am not interested in other people's problems."],
];

/** Çemberde üstten başlayıp saat yönünde: grafik ve metinler bu sırayla. */
const CLOCKWISE = ['Öne çıkan', 'Girişken', 'Sıcak', 'Uysal', 'Geri planda', 'Sessiz', 'Mesafeli', 'Sert'];
const NAMES = [
  'Öne çıkma',
  'Sosyal ve girişken olma',
  'Sıcak ve uyumlu olma',
  'Hoşgörülü ve uysal olma',
  'Geri planda kalma',
  'Sessiz ve içe dönük olma',
  'Başkalarının derdine mesafeli olma',
  'Sert ve eleştirel olma',
];

/** Seçilen tarzlara 5, ötekilere 1 (ya da hepsine 3) veren cevaplar. */
function answers(level: (scale: string) => 'high' | 'low' | 'mid') {
  return Object.fromEntries(
    d.items.map((it) => {
      const l = level(it.scale);
      return [it.key, { value: l === 'mid' ? 3 : l === 'high' ? 5 : 1, rtMs: 2600 }];
    }),
  );
}

describe('Kişilerarası Tarz (IPIP-IPC) tanımı', () => {
  it('32 madde, sekiz tarz, her tarz dört madde; maddeler kaynaktaki metin, sıra ve tarzla aynı; hepsi düz yönlü', () => {
    expect(d.items).toHaveLength(32);
    expect(d.profile).toBe('circumplex');
    d.items.forEach((it, i) => {
      const [oct, en] = SOURCE[i];
      expect(it.key, en).toBe(`ipc${String(i + 1).padStart(2, '0')}`);
      expect(it.source, it.key).toBe(en);
      expect(it.scale, it.key).toBe(OCTANTS[oct][0]);
      expect(it.reverse, it.key).toBeUndefined();
      expect(it.text, it.key).toMatch(/[.]$/);
    });
    for (const [key] of Object.values(OCTANTS)) expect(d.items.filter((i) => i.scale === key), key).toHaveLength(4);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(32);
    for (let i = 1; i < d.items.length; i++) expect(d.items[i].scale).not.toBe(d.items[i - 1].scale);
  });

  it('her tarzın çemberdeki açısı kaynaktaki gibi; adlar ve kısa adlar çember sırasıyla', () => {
    for (const [key, angle] of Object.values(OCTANTS)) expect(d.scales.find((s) => s.key === key)?.angle, key).toBe(angle);
    expect(d.scales.map((s) => s.short)).toEqual(CLOCKWISE);
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
    for (const s of d.scales) {
      expect(s.poles, s.key).toBeDefined();
      expect(s.alpha, s.key).toBeUndefined();
      expect(s.sdRef, s.key).toBeUndefined();
    }
  });

  it('öteki kişilik testlerindeki aynı maddelerle aynı çeviri kullanılır', () => {
    const others = ['alti-boyutlu-kisilik-profili', 'ayrintili-kisilik-profili', 'bes-faktor-kisilik', 'duygusal-zeka-bilesenleri'].map((s) =>
      def<LikertInstrument>(s),
    );
    const norm = (s?: string) => (s ?? '').replace(/[.]$/, '').trim();
    let shared = 0;
    for (const it of d.items) {
      const same = others.flatMap((o) => o.items.filter((x) => norm(x.source) === norm(it.source)));
      if (same.length === 0) continue;
      shared++;
      for (const x of same) expect(it.text, it.source).toBe(x.text);
    }
    expect(shared).toBe(12);
    // "Parti" yerine kalabalık ortamlar (öteki testlerle aynı uyarlama).
    expect(d.items.some((i) => /parti/i.test(i.text))).toBe(false);
  });

  it('her tarz kendi dört maddesinin ortalamasıyla puanlanır', () => {
    const scores = scoreLikert(d, answers((s) => (s === 'warm_agreeable' ? 'high' : 'low')));
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    expect(byKey.get('warm_agreeable')!.mean).toBe(5);
    expect(byKey.get('cold_hearted')!.mean).toBe(1);
    expect(byKey.get('warm_agreeable')!.nItems).toBe(4);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('her tarzın düşük, orta ve yüksek düzey metni öğrenci ve veli için yazılmış; destek kutusu yok', () => {
    const t = REPORT_TEMPLATES[SLUG];
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const bt = t.scales[s.key]?.[band];
        expect(bt, `${s.key}/${band}`).toBeDefined();
        expect(bt!.summary.length, `${s.key}/${band}`).toBeGreaterThan(3);
        expect(bt!.student, `${s.key}/${band}`).toContain('söylüyorsun');
        expect(bt!.parent, `${s.key}/${band}`).toContain('Çocuğunuz');
        expect(bt!.student, `${s.key}/${band}`).not.toContain('Çocuğunuz');
        expect(`${bt!.student} ${bt!.parent}`, `${s.key}/${band}`).not.toMatch(/narsis|antisosyal|bozukluk|hastalık|psikopat/i);
        expect(bt!.support, `${s.key}/${band}`).toBeUndefined();
      }
    }
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    expect(t.overview?.student).toContain('dört cümlesiyle ayrı ölçüldüğü');
    expect(t.overview?.student).toContain('katılımcılar');
  });

  it('bilim kartı: düşük güvenirlik ve boyut puanının neden verilmediği açıkça yazılı', () => {
    expect(d.estimatedMinutes).toBe(5);
    expect(d.description).toContain('32 cümle');
    expect(d.intro.paragraphs.join(' ')).toContain('32 kısa cümle');
    expect(d.science.reliability).toContain('.46');
    expect(d.science.reliability).toContain('.77');
    expect(d.science.reliability).toContain('.80–.89');
    expect(d.science.reliability).not.toContain('Cronbach');
    expect(d.science.reliability).toContain('boyut puanı verilmez');
    expect(d.science.turkishVersion).toContain('ulaşılamadı');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.citations.map((c) => c.url)).toContain('https://ipip.ori.org/newIPIP-IPCScoringKey.htm');
  });
});

describe('Kişilerarası Tarz raporu', () => {
  it('çember grafiği: sekiz tarz kendi açısında, üstten saat yönünde; metinler aynı sırayla', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 10, (i) => i % 5));
    for (const rep of [r.student, r.parent]) {
      expect(rep.chart?.type).toBe('circle');
      const axes = rep.chart?.type === 'circle' ? rep.chart.axes : [];
      expect(axes.map((a) => a.label)).toEqual(CLOCKWISE);
      expect(axes.map((a) => a.angle)).toEqual([90, 45, 0, 315, 270, 225, 180, 135]);
      expect(axes.every((a) => a.value !== null && a.value >= 1 && a.value <= 5)).toBe(true);
      expect(rep.items.map((it) => it.title)).toEqual(NAMES);
      for (const it of rep.items) expect(it.text.length, it.title).toBeGreaterThan(40);
      expect(rep.chartNote).toContain('yan yana duran tarzlar');
      expect(rep.support).toBeNull();
    }
    expect(r.student.chartTitle).toBe('Kişilerarası tarzın');
    expect(r.parent.chartTitle).toBe('Kişilerarası tarzı');
    expect(r.parent.chartNote).toContain('çıkarılmamalıdır');
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
  });

  it('düzeyler 1–5 cevap aralığına göre: seçilen tarz yüksek, ötekiler düşük; orta cevaplarda hepsi orta', () => {
    const r = evaluate(SLUG, { grade: 11, data: { engine: 'likert', answers: answers((s) => (s === 'gregarious_extraverted' ? 'high' : 'low')) } });
    const item = (title: string) => r.student.items.find((i) => i.title === title)!;
    expect(item('Sosyal ve girişken olma').badge).toBe('Yüksek · Sosyal ve girişken');
    expect(item('Sert ve eleştirel olma').badge).toBe('Düşük · Yumuşak dilli');
    const mid = evaluate(SLUG, { grade: 12, data: { engine: 'likert', answers: answers(() => 'mid') } });
    expect(mid.student.items.every((i) => i.badge?.startsWith('Orta'))).toBe(true);
  });

  it('cümlelerin çoğuna katılma ya da katılmama eğilimi: karşı karşıya duran tarzlar birlikte yüksek (düşük) çıkınca uyarı', () => {
    const body = (pick: (i: number) => number) => ({
      grade: 10,
      data: { engine: 'likert' as const, answers: Object.fromEntries(d.items.map((it, i) => [it.key, { value: pick(i), rtMs: 2600 }])) },
    });
    // Düz çizgi uyarısı çıkmasın diye 4 ve 5 (ya da 1 ve 2) sırayla.
    const yes = evaluate(SLUG, body((i) => (i % 2 ? 4 : 5)));
    expect(yes.student.cautions.join(' ')).toContain('katılma eğiliminden');
    expect(yes.parent.cautions.join(' ')).toContain('dikkatle yorumlanmalıdır');
    const no = evaluate(SLUG, body((i) => (i % 2 ? 1 : 2)));
    expect(no.student.cautions.join(' ')).toContain('katılmama eğiliminden');
    // Olağan bir profil: sıcak ve uysal yüksek, sert ve mesafeli düşük, ötekiler orta: uyarı yok.
    const usual = evaluate(SLUG, {
      grade: 10,
      data: {
        engine: 'likert',
        answers: answers((s) => (s === 'warm_agreeable' || s === 'unassuming_ingenuous' ? 'high' : s === 'arrogant_calculating' || s === 'cold_hearted' ? 'low' : 'mid')),
      },
    });
    expect(usual.student.cautions.join(' ')).not.toContain('eğiliminden');
  });

  it('yeterince cevaplanmayan tarz çemberde çizilmez; rapor ve PDF yine hazırlanır', async () => {
    const skipped = new Set(['ipc06', 'ipc14']);
    const r = evaluate(SLUG, {
      grade: 10,
      data: { engine: 'likert', answers: Object.fromEntries(d.items.filter((it) => !skipped.has(it.key)).map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 2600 }])) },
    });
    const axes = r.student.chart?.type === 'circle' ? r.student.chart.axes : [];
    expect(axes.find((a) => a.key === 'assured_dominant')?.value).toBeNull();
    expect(axes.filter((a) => a.value !== null)).toHaveLength(7);
    expect(r.student.items[0].text).toContain('hesaplanamadı');
    const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    const school = ['okul', 'öğretmen', 'sınav', 'sınıf', 'ders', 'ödev', 'öğrenci', 'lise', 'ergen', 'veli', 'ailen', 'yaşıt', 'yaşında', 'yetişkinle', 'yetişkine', 'yetişkinden'];
    for (const level of ['high', 'low', 'mid'] as const) {
      const adult = evaluateAdult(SLUG, { grade: ADULT_GRADE, data: { engine: 'likert', answers: answers(() => level) } }).adult;
      expect(adult.audience).toBe('adult');
      expect(adult.chart?.type).toBe('circle');
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      const words = (JSON.stringify(adult).toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? []).filter((w) => school.some((p) => w.startsWith(p)));
      expect(words, level).toEqual([]);
    }
  });

  it('uzman incelemesinde: bağlantıyla çözülür, listelerde ve site haritasında yok', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(false);
    expect(sitemap().some((u) => u.url.includes(`/testler/${SLUG}`))).toBe(false);
  });
});
