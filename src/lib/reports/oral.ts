import {
  ACCURACY_LABEL,
  ACCURACY_LABEL_YOU,
  ACCURACY_TEXT,
  AUTO_TEXT,
  COMPREHENSION_ALL,
  COMPREHENSION_LABEL,
  COMPREHENSION_LABEL_YOU,
  COMPREHENSION_TEXT,
  GENRE_LABELS,
  LEVEL_TEXT,
  NEXT_TEXT,
  FLUENCY_LEVEL_TEXT,
  NEXT_TEXT_DOWN,
  NEXT_TEXT_FLUENCY,
  NEXT_TEXT_NO_OTHER,
  NEXT_TEXT_UNCLEAR,
  NEXT_TEXT_UNFINISHED,
  NEXT_TEXT_UP,
  PROFILE_TEXT,
  PROSODY_DIMENSIONS,
  SKILL_LABELS,
  SPECIALIST,
  prosodyLabel,
} from '@/content/reports/sesli-okuma';
import { GRADE_LABELS } from '@/lib/config';
import type { OralPassage, OralReadingInstrument } from '@/lib/instruments/types';
import { ORAL_CRITERIA, type OralLevel, type OralMarkedToken, type OralResult } from '@/lib/scoring/oral';
import { countOf } from '@/lib/scoring/tasks';
import type { Audience } from './build';
import type { SimpleItem, SimpleReport } from './simple';
import type { BarsVisual, DotsVisual, GaugeVisual } from './visuals';

/**
 * Sesli Okuma Değerlendirmesinin raporu. Öğrenciye ("sen") ve yetişkine (veli ya da öğretmen; öğrenciyi üçüncü kişi
 * olarak anlatır) ayrı ayrı yazılır. Ekranda ve PDF'te aynı içerik gösterilir.
 *
 * Otomatik analizde (cihazdaki yapay zekâ işaretledi) akıcılık derecelendirmesi ve yeniden anlatma yoktur: o bölümler
 * çıkarılır, yerine okumanın ritmi (duraklamalar) ve net anlaşılamayan kelimelerin sayısı gösterilir. Raporun başında
 * okumanın nasıl incelendiği bir kez anlatılır.
 */

export interface OralReportBlock {
  /** Otomatik analiz (cihazdaki yapay zekâ işaretledi). */
  auto: boolean;
  /** Okumanın nasıl incelendiği (yalnızca otomatik analizde). */
  method: { title: string; text: string } | null;
  passage: { title: string; gradeLabel: string; genre: string; words: number };
  level: { key: OralLevel; label: string; text: string; profile: string | null };
  /** Düzeyi belirleyen iki ölçüt ve tablonun altındaki not (düzeyin nasıl belirlendiği). */
  criteria: { label: string; value: string; level: string; rule: string }[];
  criteriaNote: string;
  marked: OralMarkedToken[][];
  /** Hata sayılanlar ve sayılmayanlar. */
  counted: { label: string; value: number }[];
  notCounted: { label: string; value: number }[];
  /** Otomatik analizde net anlaşılamayan kelimeler: gösterge adı ve sayı (hata sayılmaz). */
  unclear: { label: string; value: number } | null;
  /** Yanlış okunan kelimeler ve (yazıldıysa) öğrencinin söylediği. */
  substitutions: { word: string; said: string | null }[];
  timeline: { totalMs: number; contour: number[]; pauses: [number, number][]; caption: string } | null;
  /** Akıcılık derecelendirmesi; otomatik analizde yoktur (boş liste, toplam ve etiket null). */
  prosody: { name: string; value: number; text: string }[];
  prosodyTotal: number | null;
  prosodyLabel: string | null;
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
  if (r.flags.unclearHigh) out.push(pick(audience, AUTO_TEXT.unclearHigh(r.counts.unclear, r.wordCount)));
  if (r.flags.partialListen) {
    out.push(
      parent
        ? 'İşaretleme yapılırken kaydın tamamı dinlenmedi. Dinlenmeyen bölümlerdeki hatalar işaretlenmemiş olabilir; doğru okuma oranı olduğundan yüksek görünebilir.'
        : 'Kaydının tamamı dinlenmeden işaretleme yapıldı; bu yüzden sonuçlar tam olmayabilir.',
    );
  }
  if (r.flags.unfinished) {
    // Metnin en az yarısı okunduysa doğru okuma oranı okunan kısımdan hesaplanır; yarısından azı okunduysa okunmayan
    // kelimeler atlama sayılır.
    const fromRead = r.readWords < r.wordCount;
    out.push(
      parent
        ? fromRead
          ? `Metnin son ${r.unread} kelimesi okunmadı (okuma metin bitmeden durdu ya da kayıt erken bitirildi). Doğru okuma oranı ve okuma hızı okunan ${r.readWords} kelimeden hesaplandı. Metnin tamamının okunduğu bir değerlendirme daha doğru bir sonuç verir.`
          : `Metnin son ${r.unread} kelimesi okunmadı (okuma metin bitmeden durdu ya da kayıt erken bitirildi). Metnin yarısından azı okunduğu için bu kelimeler atlama sayıldı; doğru okuma oranı bu yüzden düşük çıktı. Okuma hızı okunan ${r.wordCount - r.unread} kelimeden hesaplandı. Metnin tamamının okunduğu bir değerlendirme daha doğru bir sonuç verir.`
        : fromRead
          ? `Metnin son ${r.unread} kelimesini okumadın. Doğru okuma oranın ve hızın okuduğun kısımdan hesaplandı.`
          : `Metnin son ${r.unread} kelimesini okumadın; bu kelimeler atlama sayıldı. Okuma hızın, okuduğun kısımdan hesaplandı.`,
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
  const c = r.counts;
  // Otomatik analizde net anlaşılamayan kelimeler hata sayılmaz ama "doğru okundu" diye de anlatılmaz.
  const u = c.unclear;
  const clear = r.wordsCorrect - u;
  // Okuma metin bitmeden durduysa ve metnin en az yarısı okunduysa oran okunan kısımdan hesaplanır.
  const fromRead = r.readWords < r.wordCount;
  const whole = fromRead ? (parent ? `Okunan ${r.readWords} kelimenin` : `Okuduğun ${r.readWords} kelimenin`) : `Metindeki ${r.wordCount} kelimenin`;
  const okCount = (k: number) => countOf(k, r.readWords, 'ini');
  const parts = [
    u > 0
      ? parent
        ? `${whole} ${okCount(clear)} doğru okudu, ${u} kelime net anlaşılamadı; hata sayısı ${r.errors}. Net anlaşılamayan kelimeler hata sayılmadı.`
        : `${whole} ${okCount(clear)} doğru okudun; ${u} kelime net anlaşılamadı ve hata sayılmadı.`
      : parent
        ? `${whole} ${okCount(r.wordsCorrect)} doğru okudu; hata sayısı ${r.errors}.`
        : `${whole} ${okCount(r.wordsCorrect)} doğru okudun.`,
    // Kelimelerin çoğu net anlaşılamadıysa oran yaklaşıktır: "kelimeleri çözmekte zorlanmıyor" denmez. Metnin yarısından
    // azı okunduysa oran okunmayan kelimelerle düşmüştür: kelimelerde zorlanma diye yorumlanmaz.
    r.flags.unclearHigh
      ? parent
        ? 'Net anlaşılamayan kelime çok olduğu için bu sonuç yaklaşıktır.'
        : 'Net anlaşılamayan kelime çok olduğu için bu sonuç yaklaşık.'
      : halfUnread(r)
        ? parent
          ? 'Metnin yarısından azı okunduğu için okunmayan kelimeler de hata sayıldı. Okumanın neden yarıda kaldığını onunla konuşmak yararlı olur.'
          : 'Metnin yarısından azını okuduğun için okumadığın kelimeler de hata sayıldı.'
        : pick(audience, ACCURACY_TEXT[r.accuracyLevel]),
  ];
  if (c.ins > 0) {
    parts.splice(
      1,
      0,
      parent ? `Ayrıca metinde olmayan ${c.ins} kelime ekledi; eklemeler de hata sayıldı.` : `Ayrıca metinde olmayan ${c.ins} kelime ekledin; bunlar da hata sayıldı.`,
    );
  }
  if (r.unread > 0) {
    parts.splice(
      1,
      0,
      fromRead
        ? parent
          ? `Metnin son ${r.unread} kelimesi okunmadı; doğru okuma oranı okunan kısımdan hesaplandı.`
          : `Metnin son ${r.unread} kelimesini okumadın; doğru okuma oranın okuduğun kısımdan hesaplandı.`
        : // Metnin yarısından azı okunduysa okunmayan kelimeler atlama sayılır: düşük oranın nedeni söylenir.
          parent
          ? `Hataların ${countOf(r.unread, r.errors, 'i')} metnin sonundaki okunmayan kelimelerdir (okuma metin bitmeden durdu).`
          : `Hataların ${countOf(r.unread, r.errors, 'i')}, metnin sonunda okumadığın kelimeler.`,
    );
  }
  if (c.self > 0) {
    parts.push(
      parent
        ? `Yanlış okuduğu ${c.self} kelimeyi kendisi fark edip düzeltti: Bu, okurken anlamı takip ettiğini gösteren olumlu bir işarettir.`
        : `Yanlış okuduğun ${c.self} kelimeyi kendin fark edip düzelttin: Bu, okurken anlamı takip ettiğini gösterir. Harika!`,
    );
  }
  // Anlamı bozan ve bozmayan yanlış okumalar yalnızca en az dört işaret varken yorumlanır.
  const marked = c.meaningChanged + c.meaningKept;
  if (parent && marked >= 4) {
    const kept = countOf(c.meaningKept, marked, 'i');
    const changed = countOf(c.meaningChanged, marked, 'i');
    const s =
      c.meaningKept === 0
        ? `Yanlış okumaların ${changed} cümlenin anlamını bozdu.`
        : c.meaningChanged === 0
          ? `Yanlış okumaların ${kept} cümlenin anlamını bozmadı.`
          : `Yanlış okumaların ${kept} cümlenin anlamını bozmadı, ${changed} bozdu.`;
    if (c.meaningKept > c.meaningChanged) parts.push(`${s} Anlamı bozmayan hatalar, metni anlamaya çalışarak okuduğunu düşündürür.`);
    else if (c.meaningChanged > c.meaningKept) parts.push(`${s} Anlamı bozan hataların ağır basması, okurken anlama dikkat etmesinin desteklenebileceğini düşündürür.`);
    else parts.push(s);
  }
  // Ek hatası ve harflerin yer değiştirmesi yalnızca yetişkinin işaretlediği okumada anlatılır: otomatik analizde bu türleri
  // konuşma tanıma belirler ve en çok burada yanılır.
  if (parent && !r.flags.auto && c.kinds.suffix > 0) {
    parts.push(
      `Yanlış okumaların ${countOf(c.kinds.suffix, c.sub, 'inde')} kelimenin kökü doğru, eki yanlış okundu. Türkçede kelimelerin ekleri anlamı değiştirdiği için eklere dikkat ederek okumak önemlidir.`,
    );
  }
  if (parent && !r.flags.auto && c.kinds.reversal > 0) {
    parts.push(`${c.kinds.reversal === 1 ? 'Bir' : c.kinds.reversal} kelimede harflerin ya da hecelerin yeri karıştırıldı.`);
  }
  const labels = parent ? ACCURACY_LABEL : ACCURACY_LABEL_YOU;
  return { title: 'Doğru okuma', badge: labels[r.accuracyLevel], text: parts.join(' '), visual: accuracyGauge(r, labels) };
}

/** Okuma metnin yarısına varmadan durdu: okunmayan kelimeler atlama sayıldı (lib/scoring/oral.ts, readWords). */
const halfUnread = (r: OralResult) => r.unread > 0 && r.readWords === r.wordCount;

/** Okunan kısımdaki doğru okuma oranı (metnin sonundaki okunmayan kelimeler sayılmadan). */
const readPartAccuracy = (r: OralResult) => {
  const read = r.wordCount - r.unread;
  return read > 0 ? ((read - (r.errors - r.unread)) / read) * 100 : 0;
};

/**
 * Doğru okuma oranı, düzeyin eşikleriyle (%90 ve %97) üç bölgeli çubukta. Eksen %80'den başlar (eşikler arası okunur
 * kalsın); oran daha düşükse eksen onu da içine alacak kadar aşağıdan başlar.
 */
function accuracyGauge(r: OralResult, labels: Record<OralLevel, string>): GaugeVisual {
  const value = Math.floor(r.accuracyPct * 10 + 1e-9) / 10;
  const min = Math.min(80, Math.floor(value / 10) * 10);
  const { easy, support } = ORAL_CRITERIA.accuracy;
  return {
    type: 'gauge',
    label: 'Doğru okuma oranı',
    value,
    min,
    max: 100,
    ciLow: null,
    ciHigh: null,
    valueLabel: `%${accText(r.accuracyPct)}`,
    zones: [
      { from: min, to: support, label: labels.hard, band: 'low' },
      { from: support, to: easy, label: labels.support, band: 'average' },
      { from: easy, to: 100, label: labels.easy, band: 'high' },
    ],
    active: r.accuracyLevel === 'easy' ? 2 : r.accuracyLevel === 'support' ? 1 : 0,
  };
}

function rateItem(r: OralResult, def: OralReadingInstrument, grade: number, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  // Süre güvenilmezse (metne göre çok kısa) hız hesaplanmaz: sayı, grafik ve karşılaştırma yok (uyarılarda açıklanır).
  if (r.flags.tooFast) {
    return {
      title: 'Okuma hızı',
      badge: 'Hız hesaplanmadı',
      text: parent
        ? 'Okuma süresi metnin uzunluğuna göre çok kısa olduğu için hız hesaplanmadı.'
        : 'Okuma süren metnin uzunluğuna göre çok kısa olduğu için hızın hesaplanmadı.',
    };
  }
  // Okuma metin bitmeden durduysa süre okunan kısmındır.
  const what = r.unread > 0 ? `Metnin ${r.wordCount - r.unread} kelimesini` : 'Metni';
  // Dakikada okunan ve doğru okunan kelime kartın grafiğindedir; metin süreyi ve grafiğin nasıl okunacağını söyler.
  const parts = [
    `${what} ${durationText(r.readingMs)} sürede ${parent ? 'okudu' : 'okudun'}.`,
    r.counts.unclear > 0
      ? 'Grafikteki iki çubuk, dakikada okunan bütün kelimeleri ve hata sayılanlar çıkarılınca kalanları gösterir.'
      : parent
        ? 'Grafikteki iki çubuk, dakikada okunan bütün kelimeleri ve bunların doğru okunanlarını gösterir.'
        : 'Grafikteki iki çubuk, dakikada okuduğun bütün kelimeleri ve bunların doğru okunanlarını gösterir.',
  ];
  const ref = def.referenceRates.find((x) => x.grade === grade);
  // Karşılaştırma (ve grafikteki ortalama çizgisi) yalnızca kendi sınıfının metninde ve kayıt kesintisizken yapılır.
  const compared = !!ref && r.passageGrade === grade && !r.flags.interrupted;
  const lo = ref ? Math.max(0, ref.wpm - ref.sd) : 0;
  const hi = ref ? ref.wpm + ref.sd : 0;
  const manual = r.flags.manualTiming ? ' Süre düğmelere göre ölçüldüğü için hız olduğundan biraz düşük çıkmış olabilir; bu karşılaştırmayı temkinle yorumlayın.' : '';
  if (compared && ref) {
    // Erden, Kurdoğlu ve Uslu (2002): Ankara, ders yılının sonu (nisan–mayıs), sınıfa uygun metinde 1 dakikada doğru okunan kelime.
    parts.push(
      parent
        ? `Ankara’da 2002’de yayımlanan bir çalışmada ${grade}. sınıf öğrencileri, ders yılının sonunda (nisan–mayıs), sınıflarına uygun bir metinde dakikada ortalama ${ref.wpm} kelimeyi doğru okumuştu. Öğrencilerin çoğu ${lo} ile ${hi} arasındaydı (Erden ve ark., 2002). Grafikteki kesikli çizgi bu ortalamadır. Bu çalışma eskidir ve tek bir ile aittir; ders yılının başında daha düşük hızlar olağandır.`
        : `Bir çalışmada ${grade}. sınıflar dakikada ortalama ${ref.wpm} kelimeyi doğru okumuş. Çoğu ${lo} ile ${hi} arasında. Grafikteki kesikli çizgi bu ortalamadır.`,
    );
    if (r.fluency.slowRate) {
      parts.push(
        parent
          ? `Dakikada doğru okuduğu kelime sayısı bu aralığın altında kaldı: Bu çalışmadaki ${grade}. sınıf öğrencilerinin çoğundan yavaş okudu.${manual}`
          : 'Dakikada doğru okuduğun kelime sayısı bu aralığın altında. Kolay metinleri birkaç kez sesli okumak hızını adım adım artırır.',
      );
    }
  } else if (ref && r.passageGrade === grade && r.flags.interrupted) {
    if (parent) parts.push('Kayıt sırasında kesinti olduğu için hız sınıf ortalamasıyla karşılaştırılmadı.');
  } else if (r.fluency.slowRate && ref) {
    parts.push(
      parent
        ? `Daha kolay bir metinde dakikada doğru okuduğu kelime sayısı, aynı çalışmadaki ${grade}. sınıfların çoğunun kendi sınıf metinlerinde okuduğundan (yaklaşık ${lo}–${hi}) azdı (Erden ve ark., 2002).${manual}`
        : `Okuman, ${grade}. sınıfların çoğunun okuma hızından yavaştı. Kolay metinleri birkaç kez sesli okumak hızını adım adım artırır.`,
    );
  } else if (parent && !ref) {
    parts.push('Karşılaştırmada kullanılan çalışma yalnızca 1–5. sınıfları kapsadığı için hız bir ortalamayla karşılaştırılmadı.');
  }
  if (r.pauses) {
    const p = r.pauses;
    if (p.count === 0) {
      parts.push(parent ? 'Okurken 1 saniyeden uzun bir duraklama olmadı.' : 'Okurken 1 saniyeden uzun hiç durmadın.');
    } else {
      const long = p.long > 0 ? `; bunların ${countOf(p.long, p.count, 'i')} 3 saniyeden uzundu` : '';
      parts.push(
        parent
          ? `Okurken 1 saniyeden uzun ${p.count} duraklama oldu${long}. Duraklamalar cümle sonlarında doğaldır; cümlenin ortasındaysa bir kelimede zorlanıldığını gösterebilir. İşaretli metindeki “Duraksama” işaretlerine birlikte bakın.`
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
  // Otomatik analizde net anlaşılamayan kelimeler hata sayılmadığı için ikinci çubuk "hata sayılmayan" kelimedir.
  const visual: BarsVisual = {
    type: 'bars',
    label: 'Dakikada kelime',
    scale: 'scale',
    unit: 'kelime',
    rows: [
      { label: 'Okunan kelime', value: r.wpm, valueLabel: nf0.format(r.wpm) },
      { label: r.counts.unclear > 0 ? 'Hata sayılmayan kelime' : 'Doğru okunan kelime', value: r.wcpm, valueLabel: nf0.format(r.wcpm) },
    ],
    ...(compared && ref ? { reference: { value: ref.wpm, label: `${grade}. sınıf ortalaması (doğru kelime)` } } : {}),
  };
  return { title: 'Okuma hızı', badge: `Dakikada ${nf0.format(r.wcpm)} doğru kelime`, text: parts.join(' '), visual };
}

function prosodyItem(r: OralResult, audience: Audience): SimpleItem | null {
  if (!r.prosody) return null;
  const parent = audience === 'parent';
  const prosody = r.prosody;
  const rows = PROSODY_DIMENSIONS.map((d) => ({ d, v: prosody[d.key] }));
  const min = Math.min(...rows.map((x) => x.v));
  const weakest = rows.filter((x) => x.v === min).map((x) => x.d.name.toLocaleLowerCase('tr-TR'));
  const parts = [
    parent
      ? `Dinleyen yetişkin, okumanın dört yönünü 1 ile 4 arasında derecelendirdi; toplam ${prosody.total} / 16.`
      : `Okuman dört yönden 1 ile 4 arasında derecelendirildi; toplamın ${prosody.total} / 16.`,
  ];
  if (min === 4) {
    parts.push(parent ? 'Dört yönde de en yüksek düzeyde okudu.' : 'Dört yönde de en yüksek düzeyde okudun. Çok güzel!');
  } else if (weakest.length === rows.length) {
    parts.push('Dört yön de aynı düzeyde; hepsi birlikte gelişebilir.');
  } else {
    // Yön adlarında "ve" geçtiği için liste noktalı virgülle ayrılır.
    const list = weakest.join('; ');
    parts.push(parent ? `En çok gelişebilecek ${weakest.length > 1 ? 'yönler' : 'yön'}: ${list}.` : `En çok geliştirebileceğin ${weakest.length > 1 ? 'yönler' : 'yön'}: ${list}.`);
  }
  // Tempo derecelendirmesi dinleyenin izlenimidir; ölçülen hız sınıf aralığının altındaysa ikisi uzlaştırılır.
  if (parent && r.fluency.slowRate && prosody.pace >= 3) {
    parts.push('Tempo derecelendirmesi dinleyenin izlenimidir; ölçülen hız sınıf aralığının altında kaldığı için tempoyu kaydı yeniden dinleyerek değerlendirmek yararlı olabilir.');
  }
  parts.push(
    prosody.expression >= 3
      ? parent
        ? 'Metnin anlamına uygun vurgu ve tonlamayla okuması, okuduğunu takip ettiğini gösterir.'
        : 'Metnin anlamına uygun vurgu ve tonlamayla okuman, okuduğunu takip ettiğini gösterir.'
      : 'Metnin anlamına uygun vurgu ve tonlama, okudukça ve iyi bir okuyucuyu dinledikçe gelişir.',
  );
  const visual: BarsVisual = {
    type: 'bars',
    label: 'Akıcılığın dört yönü (1–4)',
    scale: 'share',
    rows: rows.map((x) => ({ label: x.d.name, value: x.v, max: 4, valueLabel: `${x.v}/4` })),
  };
  return { title: 'Akıcılık', badge: prosodyLabel(prosody.total), text: parts.join(' '), visual };
}

function comprehensionItem(r: OralResult, audience: Audience): SimpleItem {
  const parent = audience === 'parent';
  const c = r.comprehension;
  // Doğru cevap sayısı kartın grafiğindedir (dolu kare doğru cevap).
  const parts = ['Sorular metin kapandıktan sonra soruldu.', pick(audience, c.correct === c.total ? COMPREHENSION_ALL : COMPREHENSION_TEXT[c.level])];
  // Soru türü yalnızca o türde en az iki soru varken ve en az iki yanlış o türdeyse anılır (her tür bir ile üç soruyla
  // ölçülür; tek soru bir tür hakkında yorum için yetmez).
  const wrong = Object.entries(c.skills)
    .filter(([, v]) => v.total >= 2)
    .map(([k, v]) => ({ k, w: v.total - v.correct }));
  const most = Math.max(0, ...wrong.map((x) => x.w));
  const weak = most >= 2 ? wrong.filter((x) => x.w === most).map((x) => SKILL_LABELS[x.k].toLocaleLowerCase('tr-TR')) : [];
  if (weak.length > 0) {
    const list = weak.join('; ');
    parts.push(
      parent
        ? `Yanlış cevapladığı sorular en çok şu ${weak.length > 1 ? 'türlerdendi' : 'türdendi'}: ${list}.`
        : `Yanlış cevapladığın sorular en çok şu ${weak.length > 1 ? 'türlerdendi' : 'türdendi'}: ${list}.`,
    );
  }
  // Sorular ile yeniden anlatma ayrıştığında (yalnızca yetişkin raporunda) iki ölçüm birlikte yorumlanır.
  const t = r.retell;
  if (parent && t && c.level === 'hard' && t.core === t.coreTotal) {
    parts.push('Sorularda zorlansa da metni anlatırken temel fikirlerin hepsini söyledi; sorulardaki zorluk soru türünden ya da dikkatten kaynaklanmış olabilir.');
  }
  const visual: DotsVisual = {
    type: 'dots',
    label: 'Anlama soruları',
    rows: [{ label: 'Sorular', filled: c.correct, total: c.total, valueLabel: `${c.correct}/${c.total}` }],
    legend: ['doğru', 'yanlış'],
  };
  return { title: 'Okuduğunu anlama', badge: (parent ? COMPREHENSION_LABEL : COMPREHENSION_LABEL_YOU)[c.level], text: parts.join(' '), visual };
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
  // Söylenen fikirler kartın grafiğindedir: temel fikirler ve ayrıntılar ayrı satırlarda.
  const parts = [
    parent
      ? 'Metni kendi cümleleriyle anlatması, okuduğunu ne kadar kavradığını sorulardan farklı bir yönden gösterir. Grafiğin üst satırı metnin temel fikirleridir.'
      : 'Metni kendi cümlelerinle anlatman, okuduğunu ne kadar aklında tuttuğunu gösterir.',
  ];
  if (t.core === t.coreTotal) parts.push(parent ? 'Metnin özünü kavramış: Temel fikirlerin hepsini söyledi.' : 'Metnin en önemli fikirlerinin hepsini söyledin.');
  else if (t.core * 2 >= t.coreTotal)
    parts.push(parent ? 'Metnin ana hatlarını aktardı; bazı önemli noktalar eksik kaldı.' : 'Metnin ana hatlarını anlattın; bazı önemli noktaları atladın.');
  else
    parts.push(
      parent
        ? `${r.comprehension.level === 'hard' ? 'Metni kendi cümleleriyle anlatmakta zorlandı.' : 'Soruların çoğunu doğru cevapladı ama metni anlatırken temel fikirleri söylemekte zorlandı.'} Okuduktan sonra birlikte konuşmak ve “Önce ne oldu, sonra ne oldu?” diye sormak bu beceriyi geliştirir.`
        : 'Metni anlatmak biraz zor geldi. Okuduktan sonra “Önce ne oldu, sonra ne oldu?” diye düşünmek sana yardım eder.',
    );
  const core = t.core;
  const visual: DotsVisual = {
    type: 'dots',
    label: 'Anlatmada söylenen fikirler',
    rows: [
      { label: 'Temel fikirler', filled: core, total: t.coreTotal, valueLabel: `${core}/${t.coreTotal}` },
      ...(t.total > t.coreTotal ? [{ label: 'Ayrıntılar', filled: n - core, total: t.total - t.coreTotal, valueLabel: `${n - core}/${t.total - t.coreTotal}` }] : []),
    ],
    legend: ['söylendi', 'söylenmedi'],
  };
  return { title: 'Yeniden anlatma', badge: `${n} / ${t.total} fikir`, text: parts.join(' '), visual };
}

/**
 * Uzmana danışma kutusu (yalnızca yetişkine): öğrenci kendi sınıfının (ya da daha alt sınıfın) metninde kelimelerde sık
 * zorlandıysa ya da hem sorularda hem metni anlatırken zorlandıysa. Anlama düzeyi 5 ya da 8 soruya dayandığı için
 * sorulardaki zorluk tek başına kutuyu açmaz; metin bitmeden duran okumada doğru okuma oranı okunan kısımdan hesaplanır.
 */
export function needsSpecialistNote(r: OralResult, grade: number): boolean {
  if (r.passageGrade > grade) return false;
  const retellLow = !!r.retell && r.retell.core * 2 < r.retell.coreTotal;
  // Metnin yarısından azı okunduysa okunan kısımdaki oran esas alınır (okunmayan kelimeler zorlanma kanıtı değildir).
  const accuracy = halfUnread(r) ? readPartAccuracy(r) : r.accuracyPct;
  return accuracy < ORAL_CRITERIA.accuracy.support || (r.comprehension.level === 'hard' && retellLow);
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
 * (1–8. sınıf): seçebileceği bir üst ya da alt metin yoksa onu önermeyen cümle verilir. Okuma metin bitmeden durduysa ya
 * da kelimelerin çoğu net anlaşılamadıysa sonuç eksik ya da yaklaşık olduğu için üst ya da alt düzey önerilmez.
 */
function nextText(r: OralResult, grade: number) {
  if (r.flags.unfinished) return NEXT_TEXT_UNFINISHED;
  if (r.flags.unclearHigh) return NEXT_TEXT_UNCLEAR;
  if (r.level === 'easy' && r.flags.fluencyConcern) return NEXT_TEXT_FLUENCY;
  if (r.level === 'easy') return r.passageGrade >= Math.min(8, grade + 1) ? NEXT_TEXT_NO_OTHER.easy : NEXT_TEXT_UP(r.passageGrade + 1);
  if (r.level === 'hard') return r.passageGrade <= Math.max(1, grade - 1) ? NEXT_TEXT_NO_OTHER.hard : NEXT_TEXT_DOWN(r.passageGrade - 1);
  return NEXT_TEXT.support;
}

/**
 * Metnin öğrenci için düzeyinin metni. Doğru ve anlayarak okuyan ama akıcılık işareti olan öğrenciye "rahat okuyor"
 * denmez (FLUENCY_LEVEL_TEXT).
 */
export function levelText(r: OralResult) {
  return r.level === 'easy' && r.flags.fluencyConcern ? FLUENCY_LEVEL_TEXT : LEVEL_TEXT[r.level];
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

  const auto = r.flags.auto;
  const prosody = r.prosody;
  // Otomatik analizde akıcılık derecelendirmesi ve yeniden anlatma yoktur; o kartlar çıkarılır.
  const items: SimpleItem[] = [
    accuracyItem(r, audience),
    rateItem(r, def, grade, audience),
    prosodyItem(r, audience),
    comprehensionItem(r, audience),
    auto ? null : retellItem(r, audience),
  ].filter((x): x is SimpleItem => x !== null);

  const oral: OralReportBlock = {
    auto,
    method: auto ? { ...AUTO_TEXT.method[parent ? 'parent' : 'student'] } : null,
    passage: { title: passage.title, gradeLabel: GRADE_LABELS[passage.grade] ?? `${passage.grade}. sınıf`, genre: GENRE_LABELS[passage.genre], words: r.wordCount },
    level: {
      key: r.level,
      label: parent ? levelText(r).label : levelText(r).you,
      // Metin öğrencinin sınıfından daha alt bir sınıfınsa bu söylenir: "rahat" sınıf düzeyinde rahat diye anlaşılmasın.
      text:
        pick(audience, levelText(r)) +
        (r.passageGrade < grade ? ` Bu metin bir alt sınıfın (${GRADE_LABELS[r.passageGrade] ?? `${r.passageGrade}. sınıf`}) metniydi.` : '') +
        (halfUnread(r)
          ? parent
            ? ' Ancak metnin yarısından azı okundu; bu sonuç, metnin tamamının okunduğu yeni bir değerlendirmeyle doğrulanmalı.'
            : ' Ama metnin yarısından azını okudun; metni sonuna kadar okuduğunda sonuç değişebilir.'
          : ''),
      // Metnin yarısından azı okunduysa doğru okuma oranı okunmayan kelimelerle düştüğü için profil (kelimelerde mi,
      // anlamada mı zorlandı) verilmez.
      profile: PROFILE_TEXT[profileKey] && !halfUnread(r) ? pick(audience, PROFILE_TEXT[profileKey]) : null,
    },
    criteria: [
      {
        label: 'Doğru okuma',
        value: `%${accText(r.accuracyPct)}`,
        level: LEVEL_TEXT[r.accuracyLevel].short,
        rule: `%${ORAL_CRITERIA.accuracy.easy} ve üzeri: rahat; %${ORAL_CRITERIA.accuracy.support}–${ORAL_CRITERIA.accuracy.easy}: zaman zaman zorlanıyor (destekle okunur); %${ORAL_CRITERIA.accuracy.support}’ın altı: sık zorlanıyor (şimdilik zor)`,
      },
      {
        label: 'Anlama (sorular)',
        value: `%${nf0.format(r.comprehension.pct)}`,
        level: LEVEL_TEXT[r.comprehension.level].short,
        rule: `%${ORAL_CRITERIA.comprehension.easy} ve üzeri: iyi anlıyor (rahat); %${ORAL_CRITERIA.comprehension.support}–${ORAL_CRITERIA.comprehension.easy}: büyük ölçüde anlıyor (destekle okunur); %${ORAL_CRITERIA.comprehension.support}’ın altı: sorularda zorlanıyor (şimdilik zor)`,
      },
    ],
    criteriaNote: [
      'Metnin düzeyi, iki ölçütten düşük olanıdır.',
      `Doğru okuma ve anlama rahat olsa bile okuma belirgin biçimde yavaşsa${auto ? '' : ' ya da akıcılık puanı düşükse'} düzey “${parent ? FLUENCY_LEVEL_TEXT.label : FLUENCY_LEVEL_TEXT.you}” olarak verilir.`,
      `Anlama ${r.comprehension.total} soruya dayanır; bir sorudaki fark düzeyi değiştirebilir.`,
      'Eşikler Ölçekhane’nin pilot ölçütleridir; bir norm değildir.',
    ].join(' '),
    marked: r.marked,
    // Otomatik analizde yanında yetişkin olmadığı için "yardımla okuma" yoktur.
    counted: [
      { label: 'Yanlış okuma', value: c.sub },
      { label: 'Atlama', value: c.omit },
      ...(auto ? [] : [{ label: 'Yardımla okuma', value: c.help }]),
      { label: 'Ekleme', value: c.ins },
    ],
    notCounted: [
      { label: 'Kendi düzeltti', value: c.self },
      { label: 'Tekrar', value: c.rep },
      { label: 'Heceleyerek okuma', value: c.syl },
      { label: 'Duraksama', value: c.hes },
    ],
    unclear: auto ? { label: AUTO_TEXT.legend, value: c.unclear } : null,
    substitutions: subs,
    timeline: timeline(r, audience),
    prosody: prosody
      ? PROSODY_DIMENSIONS.map((d) => ({ name: d.name, value: prosody[d.key], text: d.levels[prosody[d.key] - 1][parent ? 'parent' : 'student'] }))
      : [],
    prosodyTotal: prosody ? prosody.total : null,
    prosodyLabel: prosody ? prosodyLabel(prosody.total) : null,
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
      // Süre metne göre çok kısaysa hız hesaplanmaz. Otomatik analizde net anlaşılamayan kelimeler hata sayılmaz.
      r.flags.tooFast
        ? { label: 'Dakikada doğru okunan kelime', value: '—', note: 'süre güvenilir değil' }
        : {
            label: 'Dakikada doğru okunan kelime',
            value: nf0.format(r.wcpm),
            note: c.unclear > 0 ? `net anlaşılamayan ${c.unclear} kelime dahil` : `Dakikada okunan bütün kelime: ${nf0.format(r.wpm)}`,
          },
      {
        label: 'Doğru okuma',
        value: `%${accText(r.accuracyPct)}`,
        note: r.flags.unclearHigh ? `${c.unclear} kelime net anlaşılamadı` : `${r.readWords} kelimede ${r.errors} hata`,
      },
      {
        label: 'Okuma süresi',
        value: durationText(r.readingMs).replace(' dakika', ' dk').replace(' saniye', ' sn'),
        note: r.unread > 0 ? `${r.wordCount} kelimenin ${r.wordCount - r.unread} tanesi okundu` : `${r.wordCount} kelimelik metin`,
      },
      { label: 'Anlama', value: `${r.comprehension.correct} / ${r.comprehension.total}`, note: 'doğru cevap' },
      // Otomatik analizde akıcılık ve yeniden anlatmanın yerine okumanın ritmi ve net anlaşılamayan kelimeler.
      ...(auto
        ? [
            { label: 'Duraklama', value: r.pauses ? String(r.pauses.count) : '—', note: r.pauses ? '1 saniyeden uzun' : 'ölçülemedi' },
            { label: 'Net anlaşılamadı', value: String(c.unclear), note: 'kelime; hata sayılmadı' },
          ]
        : [
            { label: 'Yeniden anlatma', value: r.retell ? `${r.retell.mentioned.length} / ${r.retell.total}` : '—', note: r.retell ? 'fikir söylendi' : 'yapılmadı' },
            ...(prosody ? [{ label: 'Akıcılık', value: `${prosody.total} / 16`, note: prosodyLabel(prosody.total) }] : []),
          ]),
    ],
    itemsTitle: parent ? 'Okumanın yönleri' : 'Okumanın yönleri',
    items,
    cautions: cautions(r, audience),
    support: parent && needsSpecialistNote(r, grade) ? { title: SPECIALIST.title, lines: [...SPECIALIST.lines] } : null,
    normNote: def.science.normNote,
    disclaimer: auto
      ? { title: 'Bu rapor bir tanı değildir.', text: pick(audience, AUTO_TEXT.disclaimer) }
      : parent
        ? {
            title: 'Bu rapor bir tanı değildir.',
            text: 'Tek bir metnin sesli okunmasına ve dinleyen yetişkinin işaretlemelerine dayanır; bugünkü durumu gösterir. Öğretmenin gözlemleriyle birlikte değerlendirilmeli ve gelişimi izlemek için farklı metinlerle tekrarlanmalıdır.',
          }
        : {
            title: 'Bu rapor bir tanı değildir.',
            text: 'Tek bir metni sesli okumana ve seni dinleyen yetişkinin işaretlerine dayanır; bugünkü okumanı gösterir. Okudukça okuman da gelişir.',
          },
    oral,
  };
}
