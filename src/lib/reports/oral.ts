import {
  ACCURACY_LABEL,
  ACCURACY_TEXT,
  COMPREHENSION_LABEL,
  COMPREHENSION_TEXT,
  GENRE_LABELS,
  LEVEL_TEXT,
  NEXT_TEXT,
  NEXT_TEXT_NO_OTHER,
  PROFILE_TEXT,
  PROSODY_DIMENSIONS,
  SKILL_LABELS,
  SPECIALIST,
  prosodyLabel,
} from '@/content/reports/sesli-okuma';
import { GRADE_LABELS } from '@/lib/config';
import type { OralPassage, OralReadingInstrument } from '@/lib/instruments/types';
import { ORAL_CRITERIA, type OralLevel, type OralMarkedToken, type OralResult } from '@/lib/scoring/oral';
import type { Audience } from './build';
import { disclaimerText, type SimpleItem, type SimpleReport } from './simple';

/**
 * Sesli Okuma Değerlendirmesinin raporu. Öğrenciye ("sen") ve yetişkine (veli ya da öğretmen; öğrenciyi üçüncü kişi
 * olarak anlatır) ayrı ayrı yazılır. Ekranda ve PDF'te aynı içerik gösterilir.
 */

export interface OralReportBlock {
  passage: { title: string; gradeLabel: string; genre: string; words: number };
  level: { key: OralLevel; label: string; text: string; profile: string | null };
  /** Düzeyi belirleyen iki ölçüt. */
  criteria: { label: string; value: string; level: string; rule: string }[];
  marked: OralMarkedToken[][];
  /** Hata sayılanlar ve sayılmayanlar. */
  counted: { label: string; value: number }[];
  notCounted: { label: string; value: number }[];
  /** Yanlış okunan kelimeler ve (yazıldıysa) öğrencinin söylediği. */
  substitutions: { word: string; said: string | null }[];
  timeline: { totalMs: number; contour: number[]; pauses: [number, number][]; caption: string } | null;
  prosody: { name: string; value: number; text: string }[];
  prosodyTotal: number;
  prosodyLabel: string;
  skills: { label: string; correct: number; total: number }[];
  retell: { text: string; said: boolean; core: boolean }[] | null;
  /** Bir sonraki değerlendirme önerisi (öneriler gelişim yol haritasındadır). */
  next: string;
}

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
// Doğru okuma oranı aşağı yuvarlanarak gösterilir: düzey yuvarlanmamış değere göre verildiği için %96,99 "%97" görünüp
// "destekle" yazmasın.
const accText = (x: number) => nf1.format(Math.floor(x * 10 + 1e-9) / 10);
const pick = (audience: Audience, t: { student: string; parent: string }) => (audience === 'parent' ? t.parent : t.student);

/** "1 dakika 12 saniye", "48 saniye". */
export function durationText(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  if (m === 0) return `${sec} saniye`;
  return sec === 0 ? `${m} dakika` : `${m} dakika ${sec} saniye`;
}

/** Kelimenin noktalamasız hâli (yanlış okunan kelimeler listesi için). */
const bare = (t: string) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}’']+$/gu, '');

function cautions(r: OralResult, audience: Audience): string[] {
  const parent = audience === 'parent';
  const out: string[] = [];
  if (r.flags.partialListen) {
    out.push(
      parent
        ? 'İşaretleme yapılırken kaydın tamamı dinlenmedi. Dinlenmeyen bölümlerdeki hatalar işaretlenmemiş olabilir; doğru okuma oranı olduğundan yüksek görünebilir.'
        : 'Kaydının tamamı dinlenmeden işaretleme yapıldı; bu yüzden sonuçlar tam olmayabilir.',
    );
  }
  if (r.flags.interrupted) {
    out.push(
      parent
        ? 'Kayıt sırasında bir kesinti oldu (ör. ekran kapandı ya da başka bir uygulama mikrofonu kullandı). Okuma süresi ve hız doğru ölçülmemiş olabilir.'
        : 'Kayıt sırasında bir kesinti oldu; okuma süren doğru ölçülmemiş olabilir.',
    );
  }
  if (r.flags.tooFast) {
    out.push(
      parent
        ? 'Okuma süresi metnin uzunluğuna göre çok kısa: Metnin tamamı okunmamış ya da kayıt erken bitirilmiş olabilir. Hız sonuçlarını dikkate almayın.'
        : 'Okuma süren metnin uzunluğuna göre çok kısa görünüyor; hız sonucun doğru olmayabilir.',
    );
  } else if (r.flags.manualTiming) {
    out.push(
      parent
        ? 'Kayıtta okumanın başı ve sonu ayırt edilemediği için süre, düğmelere basılan anlara göre ölçüldü; hız olduğundan biraz düşük çıkmış olabilir.'
        : 'Okuma süren, düğmelere basılan anlara göre ölçüldü; hızın olduğundan biraz düşük çıkmış olabilir.',
    );
  }
  return out;
}

function accuracyItem(r: OralResult, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  const parts = [
    parent
      ? `Metindeki ${r.wordCount} kelimenin ${r.wordsCorrect} tanesini doğru okudu; hata sayısı ${r.errors} (doğru okuma %${accText(r.accuracyPct)}).`
      : `Metindeki ${r.wordCount} kelimenin ${r.wordsCorrect} tanesini doğru okudun (doğru okuma %${accText(r.accuracyPct)}).`,
    pick(audience, ACCURACY_TEXT[r.accuracyLevel]),
  ];
  const c = r.counts;
  if (c.self > 0) {
    parts.push(
      parent
        ? `Yanlış okuduğu ${c.self} kelimeyi kendisi fark edip düzeltti: Bu, okurken anlamı takip ettiğini gösteren olumlu bir işarettir.`
        : `Yanlış okuduğun ${c.self} kelimeyi kendin fark edip düzelttin: Bu, okurken anlamı takip ettiğini gösterir. Harika!`,
    );
  }
  if (parent && c.meaningChanged + c.meaningKept > 0) {
    const s = `Yanlış okumaların ${c.meaningKept} tanesi cümlenin anlamını bozmadı, ${c.meaningChanged} tanesi bozdu.`;
    if (c.meaningKept > c.meaningChanged) parts.push(`${s} Anlamı bozmayan hatalar, metni anlamaya çalışarak okuduğunu düşündürür.`);
    else if (c.meaningChanged > c.meaningKept) parts.push(`${s} Anlamı bozan hataların ağır basması, okurken anlama dikkat etmesinin desteklenebileceğini düşündürür.`);
    else parts.push(s);
  }
  if (parent && c.kinds.suffix > 0) {
    parts.push(
      `Yanlış okumaların ${c.kinds.suffix} tanesinde kelimenin kökü doğru, eki yanlış okundu. Türkçede kelimelerin ekleri anlamı değiştirdiği için eklere dikkat ederek okumak önemlidir.`,
    );
  }
  if (parent && c.kinds.reversal > 0) {
    parts.push(`${c.kinds.reversal} kelimede harflerin ya da hecelerin yeri karıştırıldı.`);
  }
  return { title: 'Doğru okuma', badge: ACCURACY_LABEL[r.accuracyLevel], text: parts.join(' ') };
}

function rateItem(r: OralResult, def: OralReadingInstrument, grade: number, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  const parts = [
    parent
      ? `Metni ${durationText(r.readingMs)} sürede okudu: dakikada ${r.wpm} kelime; bunların ${r.wcpm} tanesi doğru okundu.`
      : `Metni ${durationText(r.readingMs)} sürede okudun: dakikada ${r.wpm} kelime; bunların ${r.wcpm} tanesini doğru okudun.`,
  ];
  const ref = def.referenceRates.find((x) => x.grade === grade);
  if (r.flags.tooFast) {
    // Süre güvenilmezse karşılaştırma yapılmaz (uyarılarda açıklanır).
  } else if (ref && r.passageGrade === grade) {
    parts.push(
      `Türkiye’de yapılan bir çalışmada ${grade}. sınıf öğrencilerinin sesli okumada dakikada ortalama ${ref.wpm} kelime okuduğu bildirilmiştir (${ref.source}). Bu değer bir sınır değildir; yalnızca kaba bir fikir verir.`,
    );
  } else if (parent && !ref) {
    parts.push('Bu sınıf düzeyi için yayımlanmış bir Türkiye karşılaştırma değeri bulunmadığından hız bir ortalamayla karşılaştırılmadı.');
  }
  if (r.pauses) {
    const p = r.pauses;
    if (p.count === 0) {
      parts.push(parent ? 'Okurken 1 saniyeden uzun bir duraklama olmadı.' : 'Okurken 1 saniyeden uzun hiç durmadın.');
    } else {
      const long = p.long > 0 ? `; bunların ${p.long} tanesi 3 saniyeden uzundu` : '';
      parts.push(
        parent
          ? `Okurken 1 saniyeden uzun ${p.count} duraklama oldu${long}. Uzun duraklamalar çoğu zaman zorlanılan bir kelimeden önce olur; işaretli metinle birlikte düşünülmelidir.`
          : `Okurken 1 saniyeden uzun ${p.count} kez durdun${long}.`,
      );
    }
  }
  if (r.counts.syl >= 3) {
    parts.push(parent ? `${r.counts.syl} kelimeyi heceleyerek okudu.` : `${r.counts.syl} kelimeyi heceleyerek okudun.`);
  }
  parts.push(
    parent
      ? 'Hız tek başına bir amaç değildir; önemli olan anlayarak, rahat bir tempoda okumaktır.'
      : 'Hızlı okumak tek başına bir amaç değil; önemli olan anlayarak, rahat bir tempoda okumak.',
  );
  return { title: 'Okuma hızı', badge: `Dakikada ${r.wcpm} doğru kelime`, text: parts.join(' ') };
}

function prosodyItem(r: OralResult, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  const rows = PROSODY_DIMENSIONS.map((d) => ({ d, v: r.prosody[d.key] }));
  const min = Math.min(...rows.map((x) => x.v));
  const weakest = rows.filter((x) => x.v === min).map((x) => x.d.name.toLocaleLowerCase('tr-TR'));
  const parts = [
    parent
      ? `Dinleyen yetişkin, okumanın dört yönünü 1 ile 4 arasında derecelendirdi; toplam ${r.prosody.total} / 16.`
      : `Okuman dört yönden 1 ile 4 arasında derecelendirildi; toplamın ${r.prosody.total} / 16.`,
  ];
  if (min === 4) {
    parts.push(parent ? 'Dört yönde de en yüksek düzeyde okudu.' : 'Dört yönde de en yüksek düzeyde okudun. Çok güzel!');
  } else {
    const list = weakest.length > 1 ? `${weakest.slice(0, -1).join(', ')} ve ${weakest[weakest.length - 1]}` : weakest[0];
    parts.push(parent ? `En çok gelişebilecek ${weakest.length > 1 ? 'yönler' : 'yön'}: ${list}.` : `En çok geliştirebileceğin ${weakest.length > 1 ? 'yönler' : 'yön'}: ${list}.`);
  }
  parts.push(
    parent
      ? 'Anlama uygun vurgu ve tonlamayla okumak, okuyanın metni anladığının da bir işaretidir.'
      : 'Anlamına uygun vurgu ve tonlamayla okumak, okuduğunu anladığını da gösterir.',
  );
  return { title: 'Akıcılık', badge: prosodyLabel(r.prosody.total), text: parts.join(' ') };
}

function comprehensionItem(r: OralResult, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  const c = r.comprehension;
  const parts = [
    parent ? `Metin kapandıktan sonra sorulan ${c.total} sorunun ${c.correct} tanesini doğru cevapladı.` : `Metin kapandıktan sonra sorulan ${c.total} sorunun ${c.correct} tanesini doğru cevapladın.`,
    pick(audience, COMPREHENSION_TEXT[c.level]),
  ];
  const weak = Object.entries(c.skills)
    .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.5)
    .map(([k]) => SKILL_LABELS[k].toLocaleLowerCase('tr-TR'));
  if (weak.length > 0 && c.level !== 'easy') {
    parts.push(parent ? `En çok zorlandığı soru ${weak.length > 1 ? 'türleri' : 'türü'}: ${weak.join(', ')}.` : `En çok zorlandığın soru ${weak.length > 1 ? 'türleri' : 'türü'}: ${weak.join(', ')}.`);
  }
  return { title: 'Okuduğunu anlama', badge: COMPREHENSION_LABEL[c.level], text: parts.join(' ') };
}

function retellItem(r: OralResult, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  const t = r.retell;
  if (!t) {
    return {
      title: 'Yeniden anlatma',
      badge: 'Yapılmadı',
      text: parent
        ? 'Bu adım atlandı. Metni kendi cümleleriyle anlatması, okuduğunu ne kadar kavradığını sorulardan farklı bir yönden gösterir; bir dahaki değerlendirmede yapmanızı öneririz.'
        : 'Bu adım atlandı. Bir dahaki sefere metni kendi cümlelerinle anlatmayı da dene.',
    };
  }
  const n = t.mentioned.length;
  const parts = [
    parent
      ? `Metni kendi cümleleriyle anlatırken metindeki ${t.total} önemli fikrin ${n} tanesini söyledi; temel fikirlerden ${t.core} / ${t.coreTotal}.`
      : `Metni kendi cümlelerinle anlatırken metindeki ${t.total} önemli fikrin ${n} tanesini söyledin.`,
  ];
  if (t.core === t.coreTotal) parts.push(parent ? 'Metnin özünü kavramış.' : 'Metnin en önemli fikirlerinin hepsini söyledin.');
  else if (t.core * 2 >= t.coreTotal)
    parts.push(parent ? 'Metnin ana hatlarını aktardı; bazı önemli noktalar eksik kaldı.' : 'Metnin ana hatlarını anlattın; bazı önemli noktaları atladın.');
  else
    parts.push(
      parent
        ? 'Metni kendi cümleleriyle anlatmakta zorlandı. Okuduktan sonra birlikte konuşmak ve "Önce ne oldu, sonra ne oldu?" diye sormak bu beceriyi geliştirir.'
        : 'Metni anlatmak biraz zor geldi. Okuduktan sonra "Önce ne oldu, sonra ne oldu?" diye düşünmek sana yardım eder.',
    );
  return { title: 'Yeniden anlatma', badge: `${n} / ${t.total} fikir`, text: parts.join(' ') };
}

/** Uzmana danışma kutusu: öğrenci kendi sınıfının (ya da daha alt sınıfın) metninde zorlandıysa, yalnızca yetişkine. */
export function needsSpecialistNote(r: OralResult, grade: number): boolean {
  return r.passageGrade <= grade && (r.level === 'hard' || r.accuracyPct < ORAL_CRITERIA.accuracy.support);
}

function timeline(r: OralResult, audience: Audience): OralReportBlock['timeline'] {
  if (!r.audio || !r.pauses || r.audio.contour.length === 0) return null;
  const parent = audience === 'parent';
  return {
    totalMs: r.readingMs,
    contour: r.audio.contour,
    pauses: r.audio.pauses.filter(([a, b]) => b - a >= 1000),
    caption: parent
      ? 'Okuma boyunca sesin yüksekliği; turuncu çizgiler 1 saniyeden uzun duraklamalardır. Grafik konuşmanın içeriğini değil, yalnızca ne zaman konuşulup ne zaman durulduğunu gösterir.'
      : 'Okurken sesinin yüksekliği; turuncu çizgiler 1 saniyeden uzun durduğun yerlerdir.',
  };
}

/**
 * Bir sonraki değerlendirme için öneri. Öğrenci kendi sınıfının ve bir alt, bir üst sınıfın metinlerini seçebilir
 * (1–8. sınıf): seçebileceği bir üst ya da alt metin yoksa onu önermeyen cümle verilir.
 */
function nextText(r: OralResult, grade: number) {
  if (r.level === 'easy' && r.passageGrade >= Math.min(8, grade + 1)) return NEXT_TEXT_NO_OTHER.easy;
  if (r.level === 'hard' && r.passageGrade <= Math.max(1, grade - 1)) return NEXT_TEXT_NO_OTHER.hard;
  return NEXT_TEXT[r.level];
}

export function buildOralReport(input: {
  def: OralReadingInstrument;
  passage: OralPassage;
  result: OralResult;
  audience: Audience;
  grade: number;
  completedAt: Date;
}): SimpleReport {
  const { def, passage, result: r, audience, grade } = input;
  const parent = audience === 'parent';
  const profileKey = `${r.accuracyLevel}-${r.comprehension.level}`;
  const c = r.counts;
  const subs = r.marked
    .flat()
    .filter((t) => t.s === 'sub')
    .map((t) => ({ word: bare(t.text), said: t.said ?? null }));

  const items: SimpleItem[] = [accuracyItem(r, audience), rateItem(r, def, grade, audience), prosodyItem(r, audience), comprehensionItem(r, audience), retellItem(r, audience)];

  const oral: OralReportBlock = {
    passage: { title: passage.title, gradeLabel: GRADE_LABELS[passage.grade] ?? `${passage.grade}. sınıf`, genre: GENRE_LABELS[passage.genre], words: r.wordCount },
    level: {
      key: r.level,
      label: LEVEL_TEXT[r.level].label,
      text: pick(audience, LEVEL_TEXT[r.level]),
      profile: PROFILE_TEXT[profileKey] ? pick(audience, PROFILE_TEXT[profileKey]) : null,
    },
    criteria: [
      {
        label: 'Doğru okuma',
        value: `%${accText(r.accuracyPct)}`,
        level: LEVEL_TEXT[r.accuracyLevel].short,
        rule: `%${ORAL_CRITERIA.accuracy.easy} ve üzeri rahat, %${ORAL_CRITERIA.accuracy.support} ile %${ORAL_CRITERIA.accuracy.easy} arası destekle, %${ORAL_CRITERIA.accuracy.support}’ın altı zor`,
      },
      {
        label: 'Anlama (sorular)',
        value: `%${nf0.format(r.comprehension.pct)}`,
        level: LEVEL_TEXT[r.comprehension.level].short,
        rule: `%${ORAL_CRITERIA.comprehension.easy} ve üzeri rahat, %${ORAL_CRITERIA.comprehension.support} ile %${ORAL_CRITERIA.comprehension.easy} arası destekle, %${ORAL_CRITERIA.comprehension.support}’ın altı zor`,
      },
    ],
    marked: r.marked,
    counted: [
      { label: 'Yanlış okuma', value: c.sub },
      { label: 'Atlama', value: c.omit },
      { label: 'Yardımla okuma', value: c.help },
      { label: 'Ekleme', value: c.ins },
    ],
    notCounted: [
      { label: 'Kendi düzeltti', value: c.self },
      { label: 'Tekrar', value: c.rep },
      { label: 'Heceleyerek okuma', value: c.syl },
      { label: 'Duraksama', value: c.hes },
    ],
    substitutions: subs,
    timeline: timeline(r, audience),
    prosody: PROSODY_DIMENSIONS.map((d) => ({ name: d.name, value: r.prosody[d.key], text: d.levels[r.prosody[d.key] - 1][parent ? 'parent' : 'student'] })),
    prosodyTotal: r.prosody.total,
    prosodyLabel: prosodyLabel(r.prosody.total),
    skills: Object.entries(r.comprehension.skills)
      .filter(([, v]) => v.total > 0)
      .map(([k, v]) => ({ label: SKILL_LABELS[k], correct: v.correct, total: v.total })),
    retell: r.retell ? passage.ideas.map((x) => ({ text: x.text, said: r.retell!.mentioned.includes(x.key), core: x.core })) : null,
    next: pick(audience, nextText(r, grade)),
  };

  return {
    instrumentName: def.name,
    audience,
    audienceName: parent ? 'Veli ve öğretmen raporu' : 'Öğrenci raporu',
    studentName: '',
    gradeLabel: GRADE_LABELS[grade] ?? `${grade}. sınıf`,
    completedAt: input.completedAt.toISOString(),
    isPilot: def.status === 'pilot',
    chartTitle: '',
    chart: null,
    keyFigures: [
      { label: 'Dakikada doğru okunan kelime', value: nf0.format(r.wcpm), note: `Okuma hızı: dakikada ${r.wpm} kelime` },
      { label: 'Doğru okuma', value: `%${accText(r.accuracyPct)}`, note: `${r.wordCount} kelimede ${r.errors} hata` },
      { label: 'Okuma süresi', value: durationText(r.readingMs).replace(' dakika', ' dk').replace(' saniye', ' sn'), note: `${r.wordCount} kelimelik metin` },
      { label: 'Anlama', value: `${r.comprehension.correct} / ${r.comprehension.total}`, note: 'doğru cevap' },
      { label: 'Yeniden anlatma', value: r.retell ? `${r.retell.mentioned.length} / ${r.retell.total}` : '—', note: r.retell ? 'fikir söylendi' : 'yapılmadı' },
      { label: 'Akıcılık', value: `${r.prosody.total} / 16`, note: prosodyLabel(r.prosody.total) },
    ],
    itemsTitle: parent ? 'Okumanın yönleri' : 'Okumanın yönleri',
    items,
    cautions: cautions(r, audience),
    support: parent && needsSpecialistNote(r, grade) ? { title: SPECIALIST.title, lines: [...SPECIALIST.lines] } : null,
    normNote: def.science.normNote,
    disclaimer: parent
      ? {
          title: 'Bu rapor bir tanı değildir.',
          text: 'Tek bir metnin sesli okunmasına ve dinleyen yetişkinin işaretlemelerine dayanır; bugünkü durumu gösterir. Öğretmenin gözlemleriyle birlikte değerlendirilmeli ve gelişimi izlemek için farklı metinlerle tekrarlanmalıdır.',
        }
      : disclaimerText({ audience, academic: undefined }),
    oral,
  };
}
