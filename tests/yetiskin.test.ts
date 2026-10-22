import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '@/content/instruments';
import { REPORT_TEMPLATES } from '@/content/reports';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE, GRADE_LABELS, gradeAllowed, gradeRangeLabel, parseGradeParam } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import type { SimpleReport } from '@/lib/reports/simple';
import { def, likertBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const KISILIK = 'ayrintili-kisilik-profili';
const ALTI = 'alti-boyutlu-kisilik-profili';
const DUYGU = 'duygusal-zeka-bilesenleri';
const TARZ = 'kisilerarasi-tarz';
const HOBI = 'hobi-ve-serbest-zaman-ilgileri';
const ILGI = 'meslek-ilgi-alanlari';
const SEKIL = 'sekil-akil-yurutme';
const ONALTI = '16-faktorlu-kisilik-profili';
const SAYI = 'sayi-dizileri';
const SOZEL = 'sozel-akil-yurutme';
const KATLAMA = 'kagit-katlama';
const KELIME = 'kelime-bilgisi';
const KURAL = 'kural-degistirme';
const LISTE = 'kelime-listesi-hatirlama';
const OGRENME = 'ogrenme-ve-basari-ozellikleri';
const ERTELEME = 'erteleme-ve-zaman-yonetimi';
const ZIHNIYET = 'zihniyet';
const DEGER = 'calisma-degerleri';
const MANTIK = 'mantiksal-akil-yurutme';
const SAYISAL = 'sayisal-akil-yurutme';
const ZIHINDEN = 'zihinden-hesaplama-hizi';
const KUP = 'kup-acinimi';
const DUSUNEREK = 'dusunerek-karar-verme';
const ON_YON = 'kisiligin-10-yonu';
const KULE = 'planlama-kule-gorevi';
const HIZLI = 'hizli-kisilik-testi';
const NFC = 'dusunmeyi-sevme-olcegi';
const UC_BOYUT = 'uc-boyutlu-zihinde-dondurme';
const HESAPLA = 'hesapla-ve-hatirla';
const BAKIS = 'bakis-acisi-alma';
const TARZ_DC = 'dusunme-ve-calisma-tarzi';
const HEYECAN = 'heyecan-arayisi';
const EMPATI = 'empati';
const IYIMSER = 'iyimserlik';
const GIZLI = 'gizli-sekiller';
const DESEN = 'desen-hatirlama';
const HARF = 'harf-dizileri';

/** Raporda kişiye gösterilen bütün metinler. */
function reportText(r: SimpleReport): string {
  return JSON.stringify(r);
}

/**
 * Gelişim yol haritası dışındaki rapor metni. Yol haritasının yetişkin metinleri `tests/roadmap.test.ts` içinde ayrıca
 * denetlenir: orada "önemli bir sınav ya da sunum" bilerek geçer ve bağlantı adları rehber yazılarının adlarıdır.
 */
function reportTextWithoutRoadmap(r: SimpleReport): string {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
}

/** Her maddeye aynı cevabı veren gövde (yetişkin olarak). */
function adultBody(slug: string, pick: (i: number) => number) {
  return { ...likertBody(slug, 10, pick), grade: ADULT_GRADE };
}

describe('yetişkinler', () => {
  it('sınıf seçenekleri ve etiketler', () => {
    expect(GRADE_LABELS[ADULT_GRADE]).toBe('Yetişkin');
    expect(gradeRangeLabel(9, 13, true)).toBe('9. sınıftan yetişkinlere');
    expect(gradeRangeLabel(9, 13)).toBe('9. sınıf ve üzeri');
    expect(gradeRangeLabel(5, 8)).toBe('5.–8. sınıf');
    const t = { minGrade: 9, maxGrade: 13 };
    expect(gradeAllowed(t, 9)).toBe(true);
    expect(gradeAllowed(t, 8)).toBe(false);
    expect(gradeAllowed(t, ADULT_GRADE)).toBe(false);
    expect(gradeAllowed({ ...t, adults: true }, ADULT_GRADE)).toBe(true);
    expect(gradeAllowed(t, 9.5)).toBe(false);
    // Çözme sayfasının adresindeki seçim: yalnızca 1–13 ya da "yetiskin".
    expect(parseGradeParam('yetiskin')).toBe(ADULT_GRADE);
    expect(parseGradeParam('9')).toBe(9);
    expect(parseGradeParam('13')).toBe(13);
    for (const bad of ['14', '0', '9.0', ' 9', '1e1', '0x9', '', 'Yetiskin', undefined]) expect(parseGradeParam(bad), String(bad)).toBeNull();
  });

  it('yalnızca maddeleri ve rapor metinleri yetişkinlere uyan testler yetişkinlere açık', () => {
    expect(INSTRUMENTS.filter((d) => d.adults).map((d) => d.slug).sort()).toEqual([KISILIK, ALTI, DUYGU, TARZ, HOBI, ILGI, SEKIL, ONALTI, SAYI, SOZEL, KATLAMA, KELIME, KURAL, LISTE, OGRENME, ERTELEME, ZIHNIYET, DEGER, MANTIK, SAYISAL, KUP, DUSUNEREK, ON_YON, KULE, HIZLI, NFC, UC_BOYUT, HESAPLA, TARZ_DC, BAKIS, HEYECAN, GIZLI, IYIMSER, DESEN, HARF, EMPATI, ZIHINDEN].sort());
    for (const d of INSTRUMENTS.filter((x) => x.adults)) {
      // Yetişkinlere de açılan test lise ve mezunlara kadar uzanır; bilim kartı yetişkinleri anar.
      expect(d.maxGrade, d.slug).toBe(13);
      expect(d.science.ageNote, d.slug).toContain('yetişkinler de çözebilir');
      // Sınıfa göre form ya da metin seçen testlerde (konu tarama, okuma) ve Holland profilinde (lise ve üniversite
      // yolları) yetişkin kipi henüz yok: bu testler açılmadan önce yetişkin için ayrı hazırlık gerekir. Görevlerden
      // yalnızca şekil akıl yürütme, sayı dizileri, sözel akıl yürütme, mantıksal akıl yürütme, sayısal akıl yürütme, zihinden hesaplama, kâğıt katlama, kelime bilgisi, kural değiştirme ve kelime listesi hatırlama yetişkinlere açıktır: soruları sınıfa göre değişmez, rapor metinleri okula
      // özgü değildir.
      if (d.engine === 'tasks') expect([['matrix_reasoning'], ['number_series'], ['verbal_reasoning'], ['logical_reasoning'], ['numerical_reasoning'], ['cube_net'], ['mental_rotation_3d'], ['complex_span'], ['perspective'], ['hidden_figures'], ['pattern_memory'], ['letter_series'], ['cognitive_reflection'], ['tower'], ['paper_folding'], ['vocabulary'], ['rule_switch'], ['word_list'], ['mental_arithmetic', 'mental_arithmetic', 'mental_arithmetic', 'mental_arithmetic']], d.slug).toContainEqual(d.tasks.map((t) => t.kind));
      else expect(d.engine, d.slug).toBe('likert');
      if (d.engine === 'likert') expect(d.profile, d.slug).not.toBe('riasec');
    }
  });

  it('yetişkine giden rapor metinlerinde okula ya da ergenliğe özgü sözcük yok', () => {
    for (const d of INSTRUMENTS.filter((x) => x.adults)) {
      const t = REPORT_TEMPLATES[d.slug];
      for (const [scale, bands] of Object.entries(t.scales)) {
        for (const [band, bt] of Object.entries(bands)) {
          if (!bt) continue;
          const text = bt.adult ?? bt.student;
          expect(schoolWords(text), `${d.slug} ${scale}/${band}`).toEqual([]);
          expect(text, `${d.slug} ${scale}/${band}`).not.toContain('Çocuğunuz');
          // Yetişkin metni, öğrenci metninin yerine geçer; aynı olması gereksizdir.
          if (bt.adult) expect(bt.adult, `${d.slug} ${scale}/${band}`).not.toBe(bt.student);
        }
      }
      if (t.overview) expect(schoolWords(t.overview.adult ?? t.overview.student), d.slug).toEqual([]);
      // Norm notu yetişkin raporunda da görünür.
      expect(schoolWords(d.science.normNote), `${d.slug} norm notu`).toEqual([]);
    }
  });

  it('yetişkinin çözerken gördüğü yönerge ve soru metninde okula özgü sözcük yok', () => {
    // Tanıtım metni (description) öğrenci ve veli raporlarını da anlattığı için burada aranmaz; maddeler de aranmaz,
    // çünkü ilgi testinde "ilkokul öğretmeni olmak" gibi meslekler yetişkin için de doğrudur.
    for (const d of INSTRUMENTS.filter((x) => x.adults)) {
      const texts = [d.intro.title, ...d.intro.paragraphs, d.engine === 'likert' ? d.prompt : ''];
      for (const text of texts) expect(schoolWords(text), `${d.slug}: ${text}`).toEqual([]);
    }
  });

  it('kişilik profili: yetişkine tek, kişisel rapor', () => {
    const r = evaluateAdult(KISILIK, adultBody(KISILIK, (i) => i % 5));
    expect(Object.keys(r)).toEqual(['adult']);
    expect(r.adult.audience).toBe('adult');
    expect(r.adult.gradeLabel).toBe('Yetişkin');
    expect(r.adult.groups?.map((g) => g.facets.length)).toEqual([6, 6, 6, 6, 5]);
    expect(reportText(r.adult)).not.toContain('Çocuğunuz');
    expect(schoolWords(reportTextWithoutRoadmap(r.adult))).toEqual([]);
    expect(r.adult.roadmap?.approach).toBeNull();
    expect(r.adult.disclaimer.text).toContain('iş ve kariyer');
  });

  it('kişilik profili: okula özgü cümleler yetişkin raporunda yetişkine göre yazılı; destek kutusu yetişkine göre', () => {
    const d = def<LikertInstrument>(KISILIK);
    const domainOf = (facet: string) => d.scales.find((s) => s.of?.includes(facet))?.key;
    // Sorumluluk yüksek, duygusal denge düşük.
    const answers = Object.fromEntries(
      d.items.map((it) => {
        const high = domainOf(it.scale) !== 'emotional_stability';
        return [it.key, { value: high !== !!it.reverse ? 5 : 1, rtMs: 2600 }];
      }),
    );
    const body = { grade: ADULT_GRADE, data: { engine: 'likert' as const, answers } };
    const adult = evaluateAdult(KISILIK, body).adult;
    const student = evaluate(KISILIK, { ...body, grade: 12 }).student;
    const text = (r: SimpleReport, title: string) => r.groups!.find((g) => g.title === title)!.text;
    expect(text(student, 'Sorumluluk')).toContain('okulda');
    expect(text(adult, 'Sorumluluk')).toContain('işinde, eğitiminde');
    expect(text(student, 'Duygusal Denge')).toContain('güvendiğin bir yetişkinle');
    expect(text(adult, 'Duygusal Denge')).toContain('ruh sağlığı uzmanıyla');
    expect(adult.support?.title).toBe('Destek almak istersen');
    expect(adult.support?.lines.join(' ')).toContain('Aile hekimine');
    expect(adult.support?.lines.join(' ')).toContain('112');
    expect(schoolWords(reportTextWithoutRoadmap(adult))).toEqual([]);
  });

  it('meslek ilgi alanları: yetişkin raporunda okul etkinlikleri yerine yetişkinlere uygun örnekler', () => {
    for (const pick of [() => 4, () => 0, (i: number) => i % 5, (i: number) => (i * 3) % 5]) {
      const r = evaluateAdult(ILGI, adultBody(ILGI, pick)).adult;
      expect(r.audience).toBe('adult');
      expect(reportText(r)).not.toContain('Çocuğunuz');
      expect(schoolWords(reportText(r)), reportText(r)).toEqual([]);
    }
    // Bütün alanlar düşük: yetişkin notu "henüz denememiş olabilirsin" demez.
    const low = evaluateAdult(ILGI, adultBody(ILGI, () => 0)).adult;
    expect(low.cautions.join(' ')).toContain('başka bir gün yeniden çözmek');
    expect(low.cautions.join(' ')).not.toContain('Henüz pek çok şeyi');
  });

  it('seçime göre raporlar: sınıf seçildiyse öğrenci ve veli, "Yetişkinim" seçildiyse kişisel rapor', () => {
    expect(Object.keys(evaluateReports(ILGI, adultBody(ILGI, (i) => i % 5)))).toEqual(['adult']);
    expect(Object.keys(evaluateReports(ILGI, likertBody(ILGI, 11, (i) => i % 5))).sort()).toEqual(['parent', 'student']);
  });

  it('yetişkinlere açık olmayan testte yetişkin seçimi reddedilir; kişisel rapor yalnızca yetişkine', () => {
    const oz = { ...likertBody('oz-saygi', 8, () => 1), grade: ADULT_GRADE };
    expect(() => evaluateAdult('oz-saygi', oz)).toThrow('yetişkinler için uygun değil');
    expect(() => evaluateReports('oz-saygi', oz)).toThrow(AssessmentError);
    expect(() => evaluate(KISILIK, adultBody(KISILIK, () => 2))).toThrow(AssessmentError);
    expect(() => evaluateAdult(KISILIK, likertBody(KISILIK, 10, () => 2))).toThrow('yalnızca yetişkinler');
  });
});
