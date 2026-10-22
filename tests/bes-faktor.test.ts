import { describe, expect, it } from 'vitest';
import { REPORT_TEMPLATES } from '@/content/reports';
import { ROADMAPS } from '@/content/roadmaps';
import { evaluate } from '@/lib/assessment/evaluate';
import type { LikertInstrument } from '@/lib/instruments/types';
import { likertQuality } from '@/lib/scoring/likert';
import { def } from './helpers/bodies';

const SLUG = 'bes-faktor-kisilik';
const d = def<LikertInstrument>(SLUG);

/** Beş Faktör'ün metinlerini kullanan ya da aynı ilkelerle yazılan kişilik testleri. */
const PERSONALITY = [
  SLUG,
  'hizli-kisilik-testi',
  'ayrintili-kisilik-profili',
  'kisiligin-10-yonu',
  'alti-boyutlu-kisilik-profili',
  '16-faktorlu-kisilik-profili',
];

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

describe('Beş Faktör Kişilik Profili: cevap kalitesi', () => {
  it('birbirinin tersini söyleyen beş çift: aynı boyutta, önce düz sonra ters madde; çoğuna aynı uç cevap uyarı verir', () => {
    expect(d.oppositePairs).toHaveLength(5);
    const scales = new Set<string>();
    for (const [x, y] of d.oppositePairs!) {
      const a = d.items.find((i) => i.key === x)!;
      const b = d.items.find((i) => i.key === y)!;
      expect(a.scale, x).toBe(b.scale);
      expect(!!a.reverse, x).toBe(false);
      expect(!!b.reverse, y).toBe(true);
      scales.add(a.scale);
    }
    // Sorumlulukta birbirinin tam tersi olan çift yok; dışadönüklükte iki çift.
    expect([...scales].sort()).toEqual(['agreeableness', 'emotional_stability', 'extraversion', 'intellect']);
    // Hüzün: "nadiren" ve "sık sık" aynı cümlenin iki ucu.
    expect(d.oppositePairs).toContainEqual(['ES4', 'ES10']);

    // Bütün cümlelere "Tamamen doğru": raporun başında karşıt çift uyarısı çıkar.
    const all5 = Object.fromEntries(d.items.map((it) => [it.key, { value: 5, rtMs: 2600 }]));
    const q = likertQuality(d, all5);
    expect(q.oppositeAgree).toBe(5);
    expect(q.notes.some((n) => n.includes('Birbirinin tersini söyleyen 5 cümle çiftinden 5 tanesinde'))).toBe(true);
    const r = evaluate(SLUG, { grade: 9, data: { engine: 'likert', answers: all5 } });
    for (const rep of [r.student, r.parent]) expect(rep.cautions.join(' ')).toContain('çoğuna “evet” deme');
    // Anahtara uygun tutarlı cevaplarda uyarı yok.
    for (const level of ['high', 'low'] as const) {
      const plain = likertQuality(d, keyedAnswers(() => level));
      expect(plain.oppositeAgree, level).toBe(0);
      expect(plain.oppositeDisagree, level).toBe(0);
    }
    // Öteki yönde: iki cümleye de "Hiç doğru değil" ya da "Pek doğru değil".
    const keys = d.oppositePairs!.flat();
    const no = likertQuality(d, Object.fromEntries(d.items.map((it, i) => [it.key, { value: keys.includes(it.key) ? 2 : (i % 5) + 1, rtMs: 2600 }])));
    expect(no.oppositeDisagree).toBe(5);
    expect(no.notes.some((n) => n.includes('çoğuna “hayır” deme'))).toBe(true);
  });
});

describe('Beş Faktör Kişilik Profili: rapor metinleri', () => {
  const t = REPORT_TEMPLATES[SLUG];

  it('Merak ve Hayal Gücü düşükken zekâyı ölçmediği söylenir; metinler düzgün Türkçe', () => {
    for (const band of ['low', 'very_low'] as const) {
      const bt = t.scales.intellect[band]!;
      expect(bt.student, band).toContain('Bu boyut zekâyı ölçmez; kendini nasıl gördüğünü gösterir.');
      expect(bt.parent, band).toContain('Bu boyut zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir.');
    }
    expect(t.scales.intellect.very_low!.student).not.toContain('çok daha çok');
  });

  it('uçlar başarı ya da beceri diye anlatılmaz; öğrenciye öz bildirim dili', () => {
    for (const [key, levels] of Object.entries(t.scales)) {
      for (const [band, bt] of Object.entries(levels)) {
        const label = `${key}/${band}`;
        for (const x of [bt!.student, bt!.parent]) {
          expect(x, label).not.toMatch(/avantaj|güçlü yan|eleştirel düşünme|[Bb]ağımsız düşünmek bir güç/);
        }
      }
    }
    // Yüksek uç öğrencinin kendi söylediği olarak anlatılır, bir gerçek gibi değil.
    expect(t.scales.conscientiousness.high!.student).toMatch(/^Sorumluluklarını ciddiye aldığını ve işlerini planlı yürüttüğünü söylüyorsun\./);
    expect(t.scales.conscientiousness.very_high!.student).toMatch(/^Kendini çok planlı, düzenli ve kararlı biri olarak görüyorsun\./);
    expect(t.scales.agreeableness.low!.student).toMatch(/söylüyorsun/);
    expect(t.scales.agreeableness.very_high!.student).not.toContain('İnsanlar yanında kendilerini rahat hissediyor');
    // Veli metninde belirsiz "Bu" yok: neyin öğrenilebilir olduğu söylenir.
    expect(t.scales.conscientiousness.low!.parent).toContain('Planlama ergenlikte hâlâ gelişen ve öğrenilebilen bir beceridir.');
  });

  it('kısa adlar (rozetler) kişisizdir: öğrenci, veli ve yetişkin raporunda aynı rozet okunur', () => {
    for (const slug of PERSONALITY) {
      const tpl = REPORT_TEMPLATES[slug];
      const summaries = [
        ...Object.entries(tpl.scales).flatMap(([k, v]) => Object.entries(v).map(([b, bt]) => [`${k}/${b}`, bt!.summary] as const)),
        ...Object.entries(tpl.facetSplit ?? {}).map(([k, v]) => [`${k}/ayrışma`, v.summary] as const),
      ];
      for (const [label, summary] of summaries) {
        expect(summary, `${slug} ${label}`).not.toMatch(/belirt|söylü|tanımlı|hoşlanıyor|seviyor|hissediyor|[Çç]ocuğunuz/);
      }
    }
    expect(t.scales.emotional_stability.very_low!.summary).toBe('Sık sık stres ya da üzüntü');
  });

  it('norm notu yetişkine de uyar: akranlarla karşılaştırmadan söz etmez', () => {
    for (const slug of PERSONALITY) {
      const note = def<LikertInstrument>(slug).science.normNote;
      expect(note, slug).toContain('Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı');
      expect(note, slug).toContain('1–5 cevap aralığına göre');
      expect(note, slug).not.toMatch(/akran|öğrenci/);
    }
  });
});

describe('Beş Faktör yol haritası: kişilik testlerinin ortak metinleri', () => {
  const t = ROADMAPS[SLUG];

  it('ortamlar notu, gösterilmeyen bir listeden söz etmez; ilk hafta dengeli profille çelişmez', () => {
    for (const x of [t.settingsNote!.student, t.settingsNote!.parent]) {
      expect(x).toContain('Bu bölüm yalnızca');
      expect(x).not.toContain('liste');
    }
    for (const x of [t.firstWeek.student, t.firstWeek.parent]) expect(x).not.toMatch(/en belirgin/);
    // Dengeli profil: ortam listesi boş, not "Bu bölüm" der.
    const r = evaluate(SLUG, { grade: 9, data: { engine: 'likert', answers: keyedAnswers(() => 'mid') } });
    for (const rep of [r.student, r.parent]) {
      expect(rep.roadmap!.settings!.items).toEqual([]);
      expect(rep.roadmap!.settings!.note).toContain('Bu bölüm yalnızca');
      expect(rep.roadmap!.weeks[0].text).toContain(rep.audience === 'parent' ? 'Raporu çocuğunuzla birlikte okuyun' : 'seni en iyi anlattığını düşündüğün');
    }
    // Aynı notu ve ilk haftayı kullanan testler.
    for (const slug of PERSONALITY.filter((s) => s !== SLUG)) {
      expect(ROADMAPS[slug].settingsNote, slug).toBe(t.settingsNote);
      expect(ROADMAPS[slug].firstWeek, slug).toBe(t.firstWeek);
    }
  });

  it('öneri kartları bir ucu avantaj ya da beceri diye anlatmaz; orta düzey kişiye bir özellik yüklemez', () => {
    for (const [key, sc] of Object.entries(t.scales)) {
      for (const g of ['low', 'average', 'high'] as const) {
        const x = sc.study[g];
        for (const text of [x.student, x.parent, x.adult ?? '']) {
          expect(text, `${key} ${g}`).not.toMatch(/avantaj|güçlü yan|eleştirel bakmak/);
        }
      }
    }
    expect(t.scales.conscientiousness.study.high.student.startsWith('Planlı çalışmak sana kolay geliyor; bu, öğrenirken işine yarar.')).toBe(true);
    expect(t.scales.agreeableness.study.low.student.startsWith('Fikirleri sorgulamak sana doğal geliyor olabilir.')).toBe(true);
    expect(t.scales.intellect.study.low.student.startsWith('Somut ve işe yarar konular ilgini daha çok çekiyor.')).toBe(true);
    // Orta düzey: Ayrıntılı ve Altı Boyutlu'da alt özellikleri ayrışan boyutta da gösterilir; "Çoğu zaman sakinsin" ya da
    // "İlgini çeken işlerde düzenlisin" gibi bir hüküm bir alt özelliğin kartıyla çelişirdi.
    for (const key of ['conscientiousness', 'emotional_stability']) {
      const x = t.scales[key].study.average;
      for (const text of [x.student, x.parent, x.adult!]) expect(text, key).not.toMatch(/[Çç]oğu zaman sakin|İlgini çeken|ilgisini çeken/);
    }
  });
});
