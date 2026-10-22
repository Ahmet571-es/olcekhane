import { describe, expect, it } from 'vitest';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS } from '@/content/roadmaps';
import { evaluate } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
import { def } from './helpers/bodies';

/**
 * Çalışma Alışkanlıkları Envanteri: rapor dili ve yol haritası. Düzey adları bir sıklık dizisidir; kısa adlar emir gibi
 * okunmaz; öneriler söz vermez; bütün alışkanlıklar ara sıra kullanılıyorsa "dengeli profil" denmez.
 */
const SLUG = 'calisma-aliskanliklari';
const d = def<LikertInstrument>(SLUG);
const tpl = REPORT_TEMPLATES[SLUG];
const rt = ROADMAPS[SLUG];

/** Alışkanlık → hedef ortalama (ters maddeler dikkate alınarak, her maddeye aynı yönde cevap). */
function bodyFor(target: Record<string, number[]>, grade = 8) {
  const seen = new Map<string, number>();
  const answers = Object.fromEntries(
    d.items.map((it) => {
      const k = seen.get(it.scale) ?? 0;
      seen.set(it.scale, k + 1);
      const list = target[it.scale];
      const v = list[k % list.length];
      return [it.key, { value: it.reverse ? 6 - v : v, rtMs: 2600 }];
    }),
  );
  return { grade, data: { engine: 'likert' as const, answers } };
}

describe('Çalışma Alışkanlıkları: rapor dili', () => {
  it('düzey adları bir sıklık dizisidir ("Geliştirilmeli" gibi bir hüküm yok)', () => {
    expect(tpl.bandLabels).toEqual({
      very_low: 'Çok az kullanılıyor',
      low: 'Az kullanılıyor',
      average: 'Ara sıra kullanılıyor',
      high: 'Sık kullanılıyor',
      very_high: 'Çok sık kullanılıyor',
    });
  });

  it('kısa adlar kişisiz ve emir gibi okunmaz; öneriler söz vermez', () => {
    for (const [scale, bands] of Object.entries(tpl.scales)) {
      for (const [band, bt] of Object.entries(bands)) {
        expect(bt!.summary, `${scale}/${band}`).not.toMatch(/(geçme|isteme|sınama|yönetiyor)$/);
        for (const x of [bt!.student, bt!.parent]) {
          expect(x, `${scale}/${band}`).not.toMatch(/zaman kazandırır|büyük bir rahatlık sağlar|daha kalıcı yapar\.|en etkili yol,|tekrarlamanı önler|kolaylaştırır\.|irade gücüne güvenmekten çok daha|ise kalıcıdır/);
        }
      }
    }
    expect(tpl.scales.help.low!.summary).toBe('Takılınca çoğu zaman sormadan geçen');
    expect(tpl.scales.help.average!.summary).toBe('Zaman zaman yardım isteyen');
    expect(tpl.scales.retrieval.average!.summary).toBe('Zaman zaman kendini sınayan');
    expect(tpl.scales.planning.low!.student).toBe(
      'Çalışmaya genellikle plansız başlıyorsun ve işler çoğu zaman son güne kalıyor. Bu çok yaygın bir durum ve küçük adımlarla değiştirilebilir.',
    );
    expect(tpl.scales.planning.low!.parent).toContain('işlerin çoğu zaman son güne kaldığını belirtiyor. Planlama, birlikte çalışılarak geliştirilebilecek');
  });

  it('rapordaki güçlü yanlar ve geliştirilebilecek alanlar kısa adları küçük harfle anar; rozet düzey adıyla başlar', () => {
    const r = evaluate(SLUG, bodyFor({ planning: [1], retrieval: [5], understanding: [3], focus: [2], help: [4] })).student;
    const rows = r.chart?.type === 'rulers' ? r.chart.rows : [];
    expect(rows.find((x) => x.label === d.scales.find((s) => s.key === 'planning')!.name)!.band).toBe('Çok az kullanılıyor');
    expect(rows.find((x) => x.label === d.scales.find((s) => s.key === 'retrieval')!.name)!.band).toBe('Çok sık kullanılıyor');
  });
});

describe('Çalışma Alışkanlıkları: yol haritası', () => {
  it('bütün alışkanlıklar ara sıra kullanılıyorsa "Kısaca" bölümü alışkanlıklara özgü not der', () => {
    // Her alışkanlık 3,0 civarında (2,8–3,2); cevaplar tek düze değil (kalite uyarısı yok).
    const r = evaluate(SLUG, bodyFor({ planning: [3, 3, 4, 3, 2], retrieval: [3, 4, 3, 3, 3], understanding: [3, 2, 3, 3, 3], focus: [4, 3, 2, 3, 3], help: [3, 3, 3, 4, 3] }));
    expect(r.student.cautions).toEqual([]);
    expect(r.student.roadmap!.standout).toEqual([]);
    expect(r.student.roadmap!.standoutNote).toBe(rt.balancedNote!.student);
    expect(r.parent.roadmap!.standoutNote).toBe(rt.balancedNote!.parent);
    expect(r.student.roadmap!.standoutNote).not.toContain('dengeli');
  });

  it('veliye ilk hafta alışkanlıkları gözlemlemeyi önerir; son haftada motivasyon ve erteleme testleri önerilir', () => {
    expect(rt.firstWeek.parent).toBe(
      'Raporu çocuğunuzla birlikte okuyun ve hangi alışkanlıkların onu anlattığını sorun. Bu hafta hangi alışkanlığı ne zaman kullandığını birlikte fark edin.',
    );
    expect(rt.studyIntro.parent).toContain('öğrenileni kitaba bakmadan hatırlamaya çalışmak');
    expect(rt.nextTests).toEqual(['ders-calisma-motivasyonu', 'erteleme-ve-zaman-yonetimi', 'ogrenme-ve-basari-ozellikleri']);
    const r = evaluate(SLUG, bodyFor({ planning: [1], retrieval: [5], understanding: [3], focus: [2], help: [4] }));
    expect(r.student.roadmap!.weeks[3].text).toContain(
      'Bir sonraki adım olarak neden ve nasıl çalıştığını daha yakından görmek için “Ders Çalışma Motivasyonu” ve “Erteleme ve Zaman Yönetimi” testlerinden birini çözebilirsin.',
    );
    expect(r.parent.roadmap!.weeks[3].text).toContain('çocuğunuzun neden ve nasıl çalıştığını daha yakından görmek için');
    const focusAverage = rt.scales.focus.study.average.student;
    expect(focusAverage).toContain('Zor konuları dikkatinin en iyi olduğu saatlere koymak da işini kolaylaştırabilir.');
  });
});
