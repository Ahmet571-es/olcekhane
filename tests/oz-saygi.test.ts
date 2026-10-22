import { describe, expect, it } from 'vitest';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS } from '@/content/roadmaps';
import { evaluate } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import { likertQuality } from '@/lib/scoring/likert';
import { def } from './helpers/bodies';

const SLUG = 'oz-saygi';
const d = def<LikertInstrument>(SLUG);
const t = REPORT_TEMPLATES[SLUG];
const rm = ROADMAPS[SLUG];

type Raw = Record<string, number>;
const body = (raw: Raw, grade = 8) => ({
  grade,
  data: { engine: 'likert' as const, answers: Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, { value: v, rtMs: 2600 }])) },
});
/** Bütün cümlelere aynı cevap. */
const same = (v: number): Raw => Object.fromEntries(d.items.map((it) => [it.key, v]));
/** En olumlu cevaplar (toplam 30), istenen maddeler değiştirilerek. */
const positive = (edit: Raw = {}): Raw => ({ ...Object.fromEntries(d.items.map((it) => [it.key, it.reverse ? 0 : 3])), ...edit });
const total = (raw: Raw) => d.items.reduce((s, it) => s + (it.reverse ? 3 - raw[it.key] : raw[it.key]), 0);
const band = (raw: Raw) => (total(raw) < 15 ? 'low' : total(raw) < 26 ? 'average' : 'high');
/** Destek kutusunu açan cevaplar: "Sonuçta kendimi başarısız biri gibi…" en az "Katılıyorum", "Bazen kendimi gerçekten işe yaramaz…" "Tamamen katılıyorum". */
const flagged = (raw: Raw) => raw.R9 >= 2 || raw.R6 >= 3;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sayfada yan yana okunan metinler: kart, uyarılar, destek kutusu ve yol haritası. */
function pageTexts(rep: SimpleReport): string[] {
  const r = rep.roadmap!;
  return [
    ...rep.items.map((i) => i.text),
    ...rep.cautions,
    ...(rep.support?.lines ?? []),
    r.intro,
    r.study.intro,
    ...r.study.items.map((i) => i.text),
    ...(r.approach?.items.map((i) => i.text) ?? []),
    ...r.weeks.map((w) => w.text),
  ];
}

describe('Öz-saygı Ölçeği: cevap denetimi ve madde düzeyinde destek', () => {
  it('destek kutusunu açan maddeler "işe yaramaz" ve "başarısız" cümleleridir; ters yönlüdür; bütün cümlelere aynı cevap denetlenir', () => {
    expect(d.options.map((o) => o.value)).toEqual([0, 1, 2, 3]);
    expect(d.supportItems).toEqual([
      { key: 'R6', min: 3 },
      { key: 'R9', min: 2 },
    ]);
    const text = (k: string) => d.items.find((i) => i.key === k)!;
    expect(text('R6').text).toContain('işe yaramaz');
    expect(text('R9').text).toContain('başarısız');
    for (const { key } of d.supportItems!) expect(text(key).reverse, key).toBe(true);
    // "Katılıyorum" (2) ve "Tamamen katılıyorum" (3).
    expect(d.options.find((o) => o.value === 2)!.label).toBe('Katılıyorum');
    expect(d.options.find((o) => o.value === 3)!.label).toBe('Tamamen katılıyorum');
    expect(d.sameAnswerCheck).toBe(true);
  });

  it('bütün cümlelere aynı cevap her seçenekte kalite notu verir; karışık cevaplar vermez', () => {
    for (const v of [0, 1, 2, 3]) {
      const q = likertQuality(d, Object.fromEntries(Object.entries(same(v)).map(([k, x]) => [k, { value: x, rtMs: 2600 }])));
      expect(q.sameAnswer, String(v)).toBe(true);
      const label = d.options.find((o) => o.value === v)!.label;
      expect(q.notes.join(' '), String(v)).toContain(`Bütün cümlelere aynı cevap (“${label}”) verilmiş.`);
    }
    const ok = likertQuality(d, Object.fromEntries(Object.entries(positive()).map(([k, x]) => [k, { value: x, rtMs: 2600 }])));
    expect(ok.notes).toEqual([]);
  });

  it('hep "Tamamen katılıyorum": toplam 15, "Dengeli"; uyarı gösterilir ve destek kutusu nedenini söyleyerek açılır', () => {
    const r = evaluate(SLUG, body(same(3)));
    expect(total(same(3))).toBe(15);
    expect(r.student.items[0].badge).toBe('Dengeli');
    expect(r.student.items[0].text).not.toMatch(/genel olarak olumlu/i);
    expect(r.student.cautions.join(' ')).toContain('Bütün cümlelere aynı cevap (“Tamamen katılıyorum”)');
    expect(r.parent.cautions.join(' ')).toContain('Bütün cümlelere aynı cevap (“Tamamen katılıyorum”)');
    expect(r.student.support!.lines[0]).toBe(t.itemSupport!.student);
    expect(r.parent.support!.lines[0]).toBe(t.itemSupport!.parent);
    // Öneriler düşük düzeyinkilerdir; kart "Dengeli" derken de doğru kalırlar (hüküm vermezler).
    expect(r.student.roadmap!.study.items[0].text).toBe(rm.scales.self_esteem.study.low.student);
    expect(r.parent.roadmap!.approach!.items[0].text).toBe(rm.approach!.self_esteem.low);
    for (const x of [rm.scales.self_esteem.study.low.student, rm.scales.self_esteem.study.low.parent]) {
      expect(x).toContain('eleştirel baktığ');
      expect(x).not.toMatch(/eleştirel bakış/);
    }
    // Dengeli profil cümlesi yok (tek boyutlu test); öne çıkan kart düzeyin kısa adıdır.
    expect(r.student.roadmap!.standout).toEqual([{ title: 'Öz-saygı', text: 'Dengeli' }]);
  });

  it('toplam puan yüksekken tek bir cevap da destek kutusunu açar; "bazen işe yaramaz" cümlesine yalnızca "Katılıyorum" açmaz', () => {
    const fail = evaluate(SLUG, body(positive({ R9: 2 })));
    expect(band(positive({ R9: 2 }))).toBe('high');
    expect(fail.student.items[0].badge).toBe('Olumlu · Kendine olumlu bakıyor');
    expect(fail.student.support!.lines[0]).toBe(t.itemSupport!.student);
    expect(fail.parent.support!.lines.join(' ')).toContain('112');
    const useless = evaluate(SLUG, body(positive({ R6: 3 })));
    expect(useless.student.support!.lines[0]).toBe(t.itemSupport!.student);
    const sometimes = evaluate(SLUG, body(positive({ R6: 2 })));
    expect(sometimes.student.support).toBeNull();
    expect(sometimes.parent.support).toBeNull();
    expect(evaluate(SLUG, body(positive({ R9: 1 }))).student.support).toBeNull();
  });

  it('600 rastgele cevap örüntüsünde: kart düzeye uyar, destek kutusu düşük düzeyde ya da bir cevap açınca gösterilir, sayfada tekrar yok', () => {
    const rand = mulberry32(20261022);
    const patterns: Raw[] = [same(0), same(1), same(2), same(3), positive(), positive({ R9: 2 }), positive({ R6: 3 })];
    for (let n = 0; n < 600; n++) patterns.push(Object.fromEntries(d.items.map((it) => [it.key, Math.floor(rand() * 4)])));
    const seen = { itemOnly: 0, lowAndItem: 0, low: 0 };
    for (const raw of patterns) {
      const r = evaluate(SLUG, body(raw));
      const b = band(raw);
      const f = flagged(raw);
      const label0 = d.items.map((i) => raw[i.key]).join('');
      for (const who of ['student', 'parent'] as const) {
        const rep = r[who];
        const label = `${label0} ${who}`;
        const bt = t.scales.self_esteem[b]!;
        expect(rep.items[0].text, label).toBe(who === 'parent' ? bt.parent : bt.student);
        expect(rep.support !== null, label).toBe(b === 'low' || f);
        expect(rep.support?.lines[0] === (who === 'parent' ? t.itemSupport!.parent : t.itemSupport!.student), label).toBe(f);
        const group = f ? 'low' : b;
        expect(rep.roadmap!.study.items[0].text, label).toBe(who === 'parent' ? rm.scales.self_esteem.study[group].parent : rm.scales.self_esteem.study[group].student);
        // Aynı sayfada bir cümle iki kez geçmez; "konuşmaya değer" önerisi bir kez verilir.
        const sentences = pageTexts(rep).flatMap((x) => x.split(/(?<=[.!?])\s+/)).map((x) => x.trim()).filter((x) => x.length > 20);
        expect(sentences.length - new Set(sentences).size, label).toBe(0);
        expect(pageTexts(rep).join(' ').split('konuşmaya değer').length, label).toBeLessThanOrEqual(2);
        for (const x of pageTexts(rep)) {
          expect(x, label).not.toMatch(/undefined|null|\s{2}/);
          if (who === 'student') expect(x, label).not.toMatch(/[Çç]ocuğunuz/);
        }
      }
      if (f && b !== 'low') seen.itemOnly++;
      if (f && b === 'low') seen.lowAndItem++;
      if (b === 'low') seen.low++;
    }
    expect(seen.itemOnly).toBeGreaterThan(20);
    expect(seen.lowAndItem).toBeGreaterThan(5);
    expect(seen.low).toBeGreaterThan(5);
  }, 120_000);
});

describe('Öz-saygı Ölçeği: rapor metinleri', () => {
  it('sonuç kişinin kendi görüşü olarak anlatılır; orta düzey "Dengeli", düşük düzey tanı koymaz', () => {
    const s = t.scales.self_esteem;
    for (const b of ['low', 'average', 'high'] as const) {
      expect(s[b]!.student, b).toContain('söylüyorsun');
      expect(s[b]!.parent, b).toMatch(/^Çocuğunuz .* belirtiyor/);
    }
    expect(t.bandLabels.average).toBe('Dengeli');
    expect(s.average!.summary).toBe('Dengeli');
    expect(`${s.average!.student} ${s.average!.parent}`).not.toMatch(/genel olarak olumlu/i);
    expect(s.low!.student).not.toMatch(/oldukça|son zamanlarda/i);
    expect(s.low!.parent).not.toMatch(/oldukça|dikkate alınması gereken/i);
    expect(s.low!.parent).toContain('Bu bir tanı değildir');
    expect(s.low!.support).toBe(true);
    expect(s.average!.support).toBeUndefined();
    expect(s.high!.support).toBeUndefined();
    // Destek kutusunun ilk satırı tanı koymaz ve kartın önerisini tekrar etmez.
    expect(t.itemSupport!.student).toMatch(/^Cevaplarından en az birinde/);
    expect(t.itemSupport!.parent).toMatch(/^Çocuğunuz cevaplarından en az birinde/);
    expect(t.itemSupport!.parent).not.toContain('konuşmaya değer');
  });

  it('norm notu karşılaştırma yapılmadığını sade dille söyler', () => {
    expect(d.science.normNote).toContain('karşılaştırma çalışması (norm)');
    expect(d.science.normNote).not.toMatch(/akran/);
    expect(d.science.normNote).toContain('klinik bir eşik değildir');
  });

  it('son haftada kendine ve geleceğe bakışı gösteren testler önerilir: kişinin sınıfına uyanlar', () => {
    expect(rm.nextTests).toEqual(['iyimserlik', 'zihniyet']);
    // 7. sınıf: İyimserlik 9. sınıftan itibaren olduğu için yalnızca Zihniyet; "geleceğe bakış" Zihniyet'e uymadığı için
    // amaç cümlesi yazılmaz.
    const seventh = evaluate(SLUG, body(positive(), 7));
    const w7 = seventh.student.roadmap!.weeks[3].text;
    expect(w7).not.toContain('kendine ve geleceğe bakışını');
    expect(w7).toContain('Bir sonraki adım olarak “Zihniyet: Zekâ ve Öğrenme İnançları” testini de çözebilirsin.');
    expect(w7).toContain('Zihniyet');
    expect(w7).not.toContain('İyimserlik');
    // 10. sınıf: ikisi de.
    const tenth = evaluate(SLUG, body(positive(), 10));
    expect(tenth.student.roadmap!.weeks[3].text).toContain('“İyimserlik” ve “Zihniyet: Zekâ ve Öğrenme İnançları” testlerinden birini çözebilirsin');
    expect(tenth.parent.roadmap!.weeks[3].text).toContain('çocuğunuzun kendine ve geleceğe bakışını başka yönlerden de görmek için');
    expect(tenth.parent.roadmap!.weeks[3].text).not.toMatch(/ilgi/);
  });
});
