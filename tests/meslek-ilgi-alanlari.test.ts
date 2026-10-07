import { describe, expect, it } from 'vitest';
import { INSTRUMENTS, isSolvable, publicInstruments, solvableInstruments } from '@/content/instruments';
import { ORVIS_ADAPTED, ORVIS_REMOVED } from '@/content/instruments/meslek-ilgi-alanlari';
import { REPORT_TEMPLATES } from '@/content/reports';
import { evaluate } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
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

  it('hiçbir alan belirgin değilse en yüksek iki alan gösterilir ve not düşülür', () => {
    const r = evaluate(SLUG, likertBody(SLUG, 11, (i) => (d.items[i].scale === 'analysis' ? 2 : 1)));
    expect(r.student.itemsTitle).toBe('En yüksek çıkan alanların');
    expect(r.student.items[0].title).toBe('1. Bilim ve Analiz');
    expect(r.student.items).toHaveLength(3);
    expect(r.student.cautions.join(' ')).toContain('belirgin bir ilgi çıkmadı');
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
    expect(notes).toContain('Farklı alanları denemek');
    expect(notes).toContain('Farklı alanlarda deneyim fırsatları');
    expect(notes).not.toContain('En üstteki');
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
