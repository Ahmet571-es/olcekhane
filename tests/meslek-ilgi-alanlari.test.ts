import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, isSolvable, publicInstruments, solvableInstruments } from '@/content/instruments';
import { ORVIS_ADAPTED, ORVIS_REMOVED } from '@/content/instruments/meslek-ilgi-alanlari';
import { REPORT_TEMPLATES } from '@/content/reports';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import nextConfig from '../next.config';
import sitemap from '../src/app/sitemap';
import { def, likertBody } from './helpers/bodies';

const SLUG = 'meslek-ilgi-alanlari';
const d = def<LikertInstrument>(SLUG);

/** Kaynaktaki (ORVIS) ölçek başına madde sayıları; din görevliliği maddesi (35) Yardım ölçeğinden çıkarıldı. */
const EXPECTED_COUNTS: Record<string, number> = {
  leadership: 12,
  organization: 13,
  altruism: 12,
  creativity: 14,
  analysis: 10,
  production: 10,
  adventure: 10,
  erudition: 10,
};

describe('Meslek İlgi Alanları (ORVIS) tanımı', () => {
  it('91 madde, 8 ölçek; ölçek başına madde sayıları kaynakla aynı', () => {
    expect(d.items).toHaveLength(91);
    expect(d.scales.map((s) => s.key).sort()).toEqual(Object.keys(EXPECTED_COUNTS).sort());
    for (const [scale, n] of Object.entries(EXPECTED_COUNTS)) {
      expect(d.items.filter((i) => i.scale === scale), scale).toHaveLength(n);
    }
  });

  it('anahtarlar ve metinler benzersiz; her maddenin İngilizce aslı belgelenmiş', () => {
    expect(new Set(d.items.map((i) => i.key)).size).toBe(d.items.length);
    expect(new Set(d.items.map((i) => i.text)).size).toBe(d.items.length);
    for (const it of d.items) {
      expect(it.source, it.key).toBeTruthy();
      expect(it.reverse).toBeFalsy();
      expect(it.text.length).toBeGreaterThan(5);
    }
  });

  it('uyarlanan maddeler yerinde, çıkarılan madde testte yok', () => {
    const keys = new Set(d.items.map((i) => i.key));
    for (const n of ORVIS_ADAPTED) expect(keys.has(`o${String(n).padStart(2, '0')}`)).toBe(true);
    for (const n of ORVIS_REMOVED) expect(keys.has(`o${String(n).padStart(2, '0')}`)).toBe(false);
    expect(d.items.some((i) => /priest|minister|rabbi|religious/i.test(i.source ?? ''))).toBe(false);
  });

  it('din ve inançla ilgili bilgi istenmez', () => {
    const religious = /\b(din|dinî|dini|imam|müezzin|rahip|papaz|haham|vaiz|ibadet)\b/i;
    for (const it of d.items) expect(religious.test(it.text), it.text).toBe(false);
  });

  it('her ölçeğin düşük, orta ve yüksek düzey metni öğrenci ve veli için yazılmış', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t).toBeDefined();
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const bt = t.scales[s.key]?.[band];
        expect(bt, `${s.key}/${band}`).toBeDefined();
        expect(bt!.student.length).toBeGreaterThan(80);
        expect(bt!.parent.length).toBeGreaterThan(80);
        expect(bt!.parent).toContain('Çocuğunuz');
        expect(bt!.tipsStudent.length).toBeGreaterThanOrEqual(2);
        expect(bt!.tipsParent.length).toBeGreaterThanOrEqual(2);
      }
      // Yüksek düzey metni ilgiyle ilişkili alanlara örnek verir.
      expect(t.scales[s.key]!.high!.student).toContain('alanlarla ilişkilidir');
    }
  });
});

describe('Meslek İlgi Alanları raporu', () => {
  // Seçenek sırası (0–4 → 1–5 puan): Bilim 5, Sanat 4 (ikisi de belirgin), Liderlik ve Dil 3 (orta), diğerleri düşük.
  const level: Record<string, number> = {
    analysis: 4,
    creativity: 3,
    erudition: 2,
    leadership: 2,
    organization: 1,
    altruism: 1,
    production: 0,
    adventure: 0,
  };
  const body = likertBody(SLUG, 10, (i) => level[d.items[i].scale]);

  it('alanlar en yüksekten en düşüğe sıralanır; en belirgin alanlar ayrıca açıklanır', () => {
    const r = evaluate(SLUG, body);
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows).toHaveLength(8);
    const values = rows.map((row) => row.value ?? 0);
    expect([...values].sort((a, b) => b - a)).toEqual(values);
    expect(rows[0].label).toBe('Bilim ve Analiz');
    expect(rows[1].label).toBe('Sanat ve Yaratıcılık');
    expect(r.student.itemsTitle).toBe('En belirgin ilgi alanların');
    expect(r.parent.itemsTitle).toBe('En belirgin ilgi alanları');
    // Yalnızca "belirgin" (yüksek) düzeydeki iki alan + diğer alanlar satırı.
    expect(r.student.items.map((i) => i.title)).toEqual(['1. Bilim ve Analiz', '2. Sanat ve Yaratıcılık', 'Diğer alanların']);
    expect(r.student.items[0].badge).toBe('Belirgin ilgi');
    expect(r.student.items[0].text).toContain('alanlarla ilişkilidir');
    expect(r.parent.items[0].text).toContain('Çocuğunuz');
    expect(r.student.items[2].text).toContain('Dil ve Edebiyat (orta düzeyde ilgi)');
    expect(r.student.items[2].text).toContain('Alan örnekleri yol göstermek içindir; bir meslek seçimi önerisi değildir.');
    expect(r.student.keyFigures[0]).toMatchObject({ label: 'En belirgin ilgi alanın', value: 'Bilim ve Analiz' });
    // Grafiğin altındaki açıklama ilginin yetenek olmadığını hatırlatır.
    expect(r.student.chartNote).toContain('İlgi, yetenek demek değildir');
    expect(r.parent.chartNote).toContain('çocuğunuzun');
    expect(r.student.isPilot).toBe(false);
    expect(r.student.cautions).toEqual([]);
  });

  it('hiçbir alan belirgin değilse orta düzeydeki en yüksek alanlar gösterilir; düşük düzeydeki alan hiçbir zaman', () => {
    // Bilim orta düzeyde (3,0), ötekiler düşük (2,0): yalnızca Bilim gösterilir; başlık ve not tekil.
    const one = evaluate(SLUG, likertBody(SLUG, 11, (i) => (d.items[i].scale === 'analysis' ? 2 : 1)));
    expect(one.student.itemsTitle).toBe('En yüksek çıkan alanın');
    expect(one.parent.itemsTitle).toBe('En yüksek çıkan alan');
    expect(one.student.items.map((i) => i.title)).toEqual(['1. Bilim ve Analiz', 'Diğer alanların']);
    expect(one.student.items[0].badge).toBe('Orta düzeyde ilgi');
    expect(one.student.cautions.join(' ')).toContain('belirgin bir ilgi çıkmadı; aşağıda en yüksek çıkan alanı görüyorsun.');
    expect(one.parent.cautions.join(' ')).toContain('aşağıda en yüksek çıkan alan yer alıyor.');
    // Belirgin alan olmadığı için "alan örnekleri" notu yazılmaz (orta düzey metinleri örnek vermez).
    expect(one.student.items.at(-1)!.text).not.toContain('Alan örnekleri');
    // Yol haritası da yalnızca bu alanı öne çıkarır: 3. hafta genel deneme.
    const rm = one.student.roadmap!;
    expect(rm.standout.map((s) => s.title)).toEqual(['Bilim ve Analiz']);
    expect(rm.study.items.map((i) => i.key)).toEqual(['analysis']);
    expect(rm.weeks[2].title).toBe('Bir meslek sahibiyle konuş');
    // İki alan orta düzeyde (3,0 ve 2,8): ikisi de gösterilir.
    const two = evaluate(SLUG, byScale({ analysis: [3], creativity: [3, 3, 3, 2] }, [2]));
    expect(two.student.itemsTitle).toBe('En yüksek çıkan alanların');
    expect(two.student.items.map((i) => i.title)).toEqual(['1. Bilim ve Analiz', '2. Sanat ve Yaratıcılık', 'Diğer alanların']);
    expect(two.student.cautions.join(' ')).toContain('aşağıda en yüksek çıkan iki alanı görüyorsun.');
  });

  it('bütün alanlar düşükse (puanlar eşit olmasa da) hiçbir alan öne çıkmaz; not ve yol haritası bunu söyler', () => {
    // Puanlar 1,0 ile 2,0 arasında, hepsi "Az ilgi": en yükseği "en yüksek çıkan alan" diye gösterilmez.
    const r = evaluate(SLUG, likertBody(SLUG, 12, (i) => (['leadership', 'altruism'].includes(d.items[i].scale) ? 1 : 0)));
    for (const rep of [r.student, r.parent]) {
      expect(rep.keyFigures).toEqual([]);
      expect(rep.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
      expect(rep.cautions.join(' ')).toContain('bu yüzden hiçbir alan öne çıkarılmadı');
      expect(rep.roadmap!.standout).toEqual([]);
      expect(rep.roadmap!.study.items).toEqual([]);
    }
    expect(r.student.cautions[0]).toMatch(/^İşlerin çoğundan pek hoşlanmayacağını belirtmişsin; bu yüzden hiçbir alan öne çıkarılmadı\. Bu olağan bir durum: henüz/);
    expect(r.student.roadmap!.standoutNote).toBe(
      'İşlerin çoğundan pek hoşlanmayacağını belirttiğin için hiçbir alan öne çıkarılmadı. Bu olağan bir durum; aşağıdaki haftalarda farklı alanları denemen için küçük adımlar var.',
    );
    expect(r.parent.roadmap!.standoutNote).toMatch(/^Çocuğunuz işlerin çoğundan pek hoşlanmayacağını belirttiği için hiçbir alan öne çıkarılmadı\./);
    const adult = evaluateAdult(SLUG, { ...likertBody(SLUG, 12, () => 0), grade: ADULT_GRADE }).adult;
    expect(adult.cautions.join(' ')).toContain('belirtmişsin; bu yüzden hiçbir alan öne çıkarılmadı');
    expect(adult.roadmap!.standoutNote).not.toContain('olağan');
  });

  it('bütün alanlar düşükse yalnızca deneyim notu gösterilir', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 12, () => 0));
    expect(r.student.cautions.some((c) => c.includes('İşlerin çoğundan'))).toBe(true);
    expect(r.parent.cautions.some((c) => c.includes('Çocuğunuz işlerin çoğundan'))).toBe(true);
    // Bütün alanlar düşükken "belirgin ilgi çıkmadı" ve "farklar küçük" notları ayrıca eklenmez.
    expect(r.student.cautions.some((c) => c.includes('belirgin bir ilgi çıkmadı') || c.includes('farklar küçük'))).toBe(false);
    // Her işe aynı cevap verildiği için alanların hepsi aynı puanda: "en yüksek çıkan" bir alan seçilmez.
    expect(r.student.keyFigures).toEqual([]);
    expect(r.student.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
    expect(r.parent.itemsTitle).toBe('Alanlar');
  });

  it('her işe "çok hoşlanırım" denirse öne çıkan alan seçilmez; alan örnekleri notu ve "en üstteki alanlar" önerisi yazılmaz', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 12, () => 4));
    expect(r.student.keyFigures).toEqual([]);
    expect(r.student.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
    expect(r.student.items[0].text).not.toContain('Alan örnekleri');
    const notes = [...r.student.cautions, ...r.parent.cautions].join(' ');
    expect(notes).toContain('Bütün alanlarda aynı puan çıktı; bu yüzden hiçbir alan öne çıkarılmadı.');
    expect(notes).toContain('Farklı alanları denemek');
    expect(notes).toContain('Farklı alanlarda deneyim fırsatları');
    expect(notes).not.toContain('En üstteki');
    expect(notes).not.toContain('farklar küçük');
    const adult = evaluateAdult(SLUG, { ...likertBody(SLUG, 12, () => 4), grade: ADULT_GRADE }).adult;
    expect(adult.cautions.join(' ')).toContain('Farklı alanları yakından tanımak iyi bir adım olur.');
  });

  it('farklar küçükken not "belirgin ilgi" rozetiyle çelişmez: en üstteki alanların ötekilerden pek ayrılmadığını söyler', () => {
    // Bilim 4,0 (belirgin), ötekiler 3,5–3,9: hepsi belirgin ama farklar küçük.
    const r = evaluate(SLUG, byScale({ analysis: [4] }, [4, 4, 3, 4, 4]));
    const c = r.student.cautions.join(' ');
    expect(c).toContain('Alanlar arasındaki farklar küçük: en üstteki alanlar ötekilerden pek ayrılmıyor');
    expect(c).not.toContain('belirgin bir yöne');
    expect(r.parent.cautions.join(' ')).toContain('ilgiler henüz tek bir yönde toplanmamış');
  });
});

/** Her alanın maddelerine sırayla verilecek cevaplar (1–5); verilmeyen alanlara `other`. */
function byScale(level: Record<string, number[]>, other: number[] = [1], grade = 10): AnswersBody {
  const seen = new Map<string, number>();
  const answers = Object.fromEntries(
    d.items.map((it) => {
      const list = level[it.scale] ?? other;
      const k = seen.get(it.scale) ?? 0;
      seen.set(it.scale, k + 1);
      return [it.key, { value: list[k % list.length], rtMs: 2600 }];
    }),
  );
  return { grade, data: { engine: 'likert', answers } };
}

const tops = (r: SimpleReport) => r.items.filter((i) => /^\d\. /.test(i.title));

describe('Meslek İlgi Alanları raporu: eşit ve neredeyse eşit puanlar', () => {
  it('dördüncü alan üçüncüyle birebir eşitse ikisi de gösterilir: aynı sıra numarası ve "eşit puan" rozeti, ayrıca not yok', () => {
    // Bilim 5,0; Sanat 4,5; Liderlik ve Macera 4,0 (ikisi de belirgin); ötekiler düşük.
    const r = evaluate(SLUG, byScale({ analysis: [5], creativity: [5, 4], leadership: [4], adventure: [4] }));
    for (const rep of [r.student, r.parent]) {
      expect(tops(rep).map((i) => [i.title, i.badge])).toEqual([
        ['1. Bilim ve Analiz', 'Belirgin ilgi'],
        ['2. Sanat ve Yaratıcılık', 'Belirgin ilgi'],
        ['3. Liderlik ve İkna', 'Belirgin ilgi · eşit puan'],
        ['3. Macera ve Hareket', 'Belirgin ilgi · eşit puan'],
      ]);
      expect(rep.items.at(-1)!.text).not.toContain('belirgin ilgi');
      expect(rep.cautions).toEqual([]);
      expect(rep.roadmap!.study.items.map((i) => i.key)).toEqual(['analysis', 'creativity', 'leadership', 'adventure']);
    }
    // Dört alan en yüksek puanda: dördü de birinci; anahtar rakam hepsini anar.
    const four = evaluate(SLUG, byScale({ analysis: [5], creativity: [5], leadership: [5], adventure: [5] })).student;
    expect(tops(four).map((i) => i.title)).toEqual(['1. Liderlik ve İkna', '1. Sanat ve Yaratıcılık', '1. Bilim ve Analiz', '1. Macera ve Hareket']);
    expect(four.keyFigures).toEqual([
      { label: 'En belirgin ilgi alanların', value: 'Liderlik ve İkna · Sanat ve Yaratıcılık · Bilim ve Analiz · Macera ve Hareket', note: 'eşit puanla' },
    ]);
  });

  it('daha büyük bir eşitlik kesimi aşarsa üç alan gösterilir ve eşit alanların hepsi notta anılır (adlar tırnak içinde)', () => {
    const r = evaluate(SLUG, byScale({ analysis: [5], creativity: [5], leadership: [5], adventure: [5], erudition: [5] }));
    expect(tops(r.student)).toHaveLength(3);
    expect(r.student.cautions).toContain(
      '“Liderlik ve İkna”, “Sanat ve Yaratıcılık”, “Bilim ve Analiz”, “Macera ve Hareket” ve “Dil ve Edebiyat” alanlarındaki puanların aynı ya da neredeyse aynı; bu yüzden öne çıkan alanlarının seçimi kesin değil, bu alanların hepsini birlikte düşünebilirsin.',
    );
    expect(r.parent.cautions.join(' ')).toContain('alanlarındaki puanlar aynı ya da neredeyse aynıdır; bu yüzden öne çıkan alanların seçimi kesin değildir');
    // Öne çıkan iki alan, ardından kesimi aşan eşitlik: son gösterilen alan bu alanlardan herhangi biri olabilir.
    const cut = evaluate(SLUG, byScale({ analysis: [5], creativity: [5, 4], leadership: [4], adventure: [4], erudition: [4] })).student;
    expect(tops(cut).map((i) => i.title)).toEqual(['1. Bilim ve Analiz', '2. Sanat ve Yaratıcılık', '3. Liderlik ve İkna']);
    expect(cut.cautions).toContain(
      '“Liderlik ve İkna”, “Macera ve Hareket” ve “Dil ve Edebiyat” alanlarındaki puanların aynı ya da neredeyse aynı; öne çıkan alanlarından birini bu alanlardan herhangi biri olarak düşünebilirsin.',
    );
  });

  it('neredeyse eşit puanlar (en çok 0,15 fark): öne çıkan alanların içinde sıra notu, kesimde "herhangi biri" notu', () => {
    // Sanat 5,0; Bilim 4,9 (on maddeden biri 4): sıraları yer değiştirebilir; rozet "eşit puan" demez.
    const within = evaluate(SLUG, byScale({ creativity: [5], analysis: [5, 5, 5, 5, 5, 5, 5, 5, 5, 4] })).student;
    expect(tops(within).map((i) => [i.title, i.badge])).toEqual([
      ['1. Sanat ve Yaratıcılık', 'Belirgin ilgi'],
      ['2. Bilim ve Analiz', 'Belirgin ilgi'],
    ]);
    expect(within.cautions).toEqual([
      '“Sanat ve Yaratıcılık” ve “Bilim ve Analiz” alanlarındaki puanların aynı ya da neredeyse aynı; bu alanların sırası yer değiştirebilir.',
    ]);
    // Üçüncü alan 4,0, dördüncü 3,9: dördüncü de belirgin ve neredeyse eşit.
    const edge = evaluate(SLUG, byScale({ analysis: [5], creativity: [5, 4], leadership: [4], adventure: [4, 4, 4, 4, 4, 4, 4, 4, 4, 3] })).parent;
    expect(tops(edge).map((i) => i.title)).toEqual(['1. Bilim ve Analiz', '2. Sanat ve Yaratıcılık', '3. Liderlik ve İkna']);
    expect(edge.cautions).toEqual([
      '“Liderlik ve İkna” ve “Macera ve Hareket” alanlarındaki puanlar aynı ya da neredeyse aynıdır; öne çıkan alanlardan biri bu alanlardan herhangi biri olarak düşünülebilir.',
    ]);
  });
});

describe('Meslek İlgi Alanları: rapor metinleri', () => {
  const t = REPORT_TEMPLATES[SLUG];
  it('yüksek düzey metni deneme fırsatlarını tekrar etmez (yol haritasındadır); düşük düzey metni meslek sonucu öngörmez', () => {
    for (const s of d.scales) {
      const high = t.scales[s.key]!.high!;
      for (const x of [high.student, high.parent, high.adult ?? high.student]) {
        expect(x, s.key).not.toMatch(/denemen için|denemesi için|iyi fırsat|iyi bir başlangıç/);
        expect(x.trim(), s.key).toMatch(/alanlarla ilişkilidir\.$/);
      }
      const low = t.scales[s.key]!.low!;
      for (const x of [low.student, low.parent, low.adult ?? low.student]) expect(x, s.key).not.toContain('meslek olarak');
      // Kısa adlar kişisiz: öğrenci, veli ve yetişkin raporunda aynı ("…hoşlanıyor" gibi üçüncü kişi yok).
      for (const b of ['low', 'average', 'high'] as const) expect(t.scales[s.key]![b]!.summary, `${s.key}/${b}`).not.toMatch(/hoşlanıyor$|önemsiyor$/);
    }
    expect(t.scales.analysis!.low!.student).toContain('Bu sonuç, fen ve matematik derslerinde başarılı olamayacağın anlamına gelmez');
    expect(t.scales.analysis!.low!.parent).toContain('Bu sonuç, fen ve matematik derslerinde başarılı olamayacağı anlamına gelmez');
    expect(t.scales.leadership!.high!.summary).toBe('Yön vermek ve ikna etmek çekici geliyor');
  });
});

describe('Yayın durumu', () => {
  it('hoca onayladı: yayında; uzman incelemesindeki testler ise listelerde ve site haritasında yer almaz', () => {
    expect(isSolvable(d)).toBe(true);
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    const urls = sitemap().map((u) => u.url);
    expect(urls.some((u) => u.endsWith(`/testler/${SLUG}`))).toBe(true);
    for (const i of INSTRUMENTS.filter((x) => x.status === 'review')) {
      expect(urls.some((u) => u.endsWith(`/testler/${i.slug}`))).toBe(false);
    }
  });
});

describe('Ad değişiklikleri', () => {
  it('Matematik Tanı Testi’nin eski adresi yeni adrese kalıcı olarak yönlenir', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const r = redirects.find((x) => x.source === '/testler/matematik-tani-testi');
    expect(r).toMatchObject({ destination: '/testler/matematik-konu-tarama-testi', permanent: true });
    expect(redirects.some((x) => x.source === '/testler/matematik-tani-testi/:rest*')).toBe(true);
    expect(def('matematik-konu-tarama-testi')).toBeDefined();
  });

  it('test adlarında "tanı" sözcüğü geçmez', () => {
    for (const i of INSTRUMENTS) expect(/tanı/i.test(i.name), i.name).toBe(false);
  });
});
