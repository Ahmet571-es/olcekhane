import { RIASEC_ORDER, RIASEC_TYPES } from '@/content/careers/riasec';
import type { QuizChart, QuizFigure, QuizTable } from '@/lib/instruments/types';
import type { Audience, InterestProfile, InterestRanking, ReportContent } from './build';
import type { OralReportBlock } from './oral';
import type { Roadmap } from './roadmap';

/**
 * Basit rapor: test bitince ekranda gösterilen ve PDF olarak indirilen ücretsiz rapor (hiçbir yerde
 * saklanmaz). Tam rapordan (ReportContent) türetilir: teste uygun tek bir grafik, her ölçek ya da alan için
 * düzey ve kısa yorum; konu tarama testlerinde ayrıca yanlış yapılan soruların incelemesi ve hata türleri.
 */

export type SimpleChart =
  /** Her ölçek kendi aralığında bir cetvel; işaret puanı, bant (varsa) ölçüm payını gösterir. */
  | {
      type: 'rulers';
      rows: { label: string; value: number | null; min: number; max: number; ciLow: number | null; ciHigh: number | null; valueLabel: string; band: string }[];
    }
  /** Holland altıgeni: altı ilgi alanının ortalaması (1–5). */
  | { type: 'hexagon'; highlight: string[]; axes: { key: string; label: string; value: number | null }[] }
  /** Kişilerarası çember: her tarzın ortalaması (1–5) kendi açısında (derece; 0 = sağ, 90 = üst). */
  | { type: 'circle'; axes: { key: string; label: string; value: number | null; angle: number }[] }
  /** Yatay çubuklar: değer / en çok (ör. doğru / soru). */
  | { type: 'bars'; rows: { label: string; value: number; max: number; valueLabel: string }[] }
  /** Dikey sütunlar: eşit süreli bölümler (harf işaretleme). */
  | { type: 'columns'; rows: { label: string; value: number }[]; caption: string }
  /**
   * Motivasyon haritası: iki bileşik ölçek (ortalama, `min`–`max`) bir düzlemde. `cuts` düşük, orta ve yüksek düzeylerin
   * sınırlarıdır (düzlem dokuz hücreye bölünür); köşe hücrelerinde araştırmalardaki dört profilin adı, `active` kişinin
   * bulunduğu hücre ("<yatay>-<dikey>", ör. "high-low").
   */
  | {
      type: 'quadrant';
      x: { label: string; value: number | null };
      y: { label: string; value: number | null };
      min: number;
      max: number;
      cuts: [number, number];
      corners: { x: 'low' | 'high'; y: 'low' | 'high'; label: string }[];
      active: string | null;
      /** Kişinin bulunduğu hücrenin profil adı (köşede olmasa da; ekran okuyucu için). */
      activeLabel: string | null;
    };

export type RulerRow = Extract<SimpleChart, { type: 'rulers' }>['rows'][number];

export interface SimpleItem {
  title: string;
  /** Düzey adı ya da kısa sonuç ("Olumlu", "Dakikada 127 harf"). */
  badge?: string;
  text: string;
}

/** Ayrıntılı profilde bir boyut: boyutun yorumu ve alt özelliklerinin cetvelleri (her cetvelin altında kısa yorum). */
export interface SimpleGroup {
  title: string;
  badge: string;
  text: string;
  facets: (RulerRow & { text: string })[];
}

/** Konu tarama testinde yanlış yapılan, "Bilmiyorum" denen ya da boş bırakılan bir soru. */
export interface SimpleQuizQuestion {
  /** Formdaki sıra numarası (1'den başlar). */
  no: number;
  domainName: string;
  /** Soru metni; kesirler {3/4} biçimindedir (ekranda alt alta, PDF'te 3/4 olarak yazılır). */
  text: string;
  table?: QuizTable;
  chart?: QuizChart;
  figure?: QuizFigure;
  status: 'wrong' | 'dontKnow' | 'missing';
  /** Seçilen yanlış seçenek, ör. "B) 0,125" (yanlış cevapta). */
  chosen: string | null;
  /** Doğru seçenek, ör. "D) 0,7". */
  answer: string;
  explain: string;
  /** Seçilen seçeneğin işaret ettiği hata türünün adı (varsa). */
  misconception: string | null;
}

/** Konu tarama testinin soru soru incelemesi ve hata türleri. */
export interface SimpleQuizReview {
  title: string;
  intro: string;
  questions: SimpleQuizQuestion[];
  errorsTitle: string;
  /** Hata türlerinin nasıl okunacağı (tek soruda görülen, yorumlanmayan). */
  errorsNote: string;
  errors: { name: string; seen: string; explain: string; tip: string }[];
}

export interface SimpleReport {
  instrumentName: string;
  audience: Audience;
  /** Raporun adı ("Öğrenci raporu" gibi) testin kendi adlandırmasıysa (ör. sesli okumada "Veli ve öğretmen raporu"). */
  audienceName?: string;
  studentName: string;
  gradeLabel: string;
  completedAt: string;
  isPilot: boolean;
  chartTitle: string;
  chartNote?: string;
  chart: SimpleChart | null;
  /** Öne çıkan sayılar (okuma hızı, doğru sayısı, ilgi kodu gibi). */
  keyFigures: { label: string; value: string; note?: string }[];
  itemsTitle: string;
  items: SimpleItem[];
  /** Ayrıntılı profil: boyut boyut alt özellikler (varsa `items` yerine gösterilir). */
  groups?: SimpleGroup[];
  /** `groups` başlığının altındaki açıklama. */
  groupsNote?: string;
  /** Sonucu dikkatle yorumlamayı gerektiren durumlar. */
  cautions: string[];
  support: { title: string; lines: string[] } | null;
  normNote: string;
  disclaimer: { title: string; text: string };
  /** Gelişim yol haritası (yalnızca şablonu olan testlerde; incelemedeyken yalnızca önizlemede). */
  roadmap?: Roadmap;
  /** Sesli okuma değerlendirmesinin bölümleri (işaretli metin, hata türleri, duraklamalar, akıcılık, anlama, öneriler). */
  oral?: OralReportBlock;
  /** Konu tarama testinde yanlış yapılan soruların incelemesi ve hata türleri. */
  quiz?: SimpleQuizReview;
}

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** Cümle sonunda nokta yoksa ekler ("141 harf bulundu · 0 yanlış işaret" gibi satırlar metne eklenirken). */
const sentence = (s: string) => (/[.!?…]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** Üleştirme sayıları: "dörder cümleyle", "onar cümleyle". */
const DISTRIBUTIVE: Record<number, string> = { 3: 'üçer', 4: 'dörder', 5: 'beşer', 6: 'altışar', 8: 'sekizer', 10: 'onar' };

/** Ayrıntılı profilde alt özelliklerin boyutlardan daha az kesin olduğunu anlatan not. */
function facetNote(facetItems: number, margin: boolean): string {
  const each = DISTRIBUTIVE[facetItems];
  const first = each ? `Her boyut, ${each} cümleyle ölçülen alt özelliklerden oluşur.` : 'Her boyut, birkaç alt özellikten oluşur.';
  return margin
    ? `${first} Alt özellikler daha az cümleye dayandığı için boyutlardan daha az kesindir; sarı bantların daha geniş olması bundandır.`
    : `${first} Alt özellikler daha az cümleye dayandığı için boyutlardan daha az kesindir; tek bir alt özelliğe bakarak sonuç çıkarılmamalıdır.`;
}

/**
 * Kişilerarası çemberde karşı karşıya duran (180° arayla) iki tarzın ikisi de yüksek ya da ikisi de düşük çıkan en az iki
 * çift varsa uyarı. Maddelerin hepsi düz yönlü olduğu için cümlelerin çoğuna katılma (ya da katılmama) eğilimi bütün
 * tarzları birlikte yükseltir (ya da düşürür); olağan cevaplarda iki çiftin birden böyle çıkması seyrektir.
 */
function circumplexNotes(
  axes: { key: string; angle: number }[],
  byKey: Map<string, ReportContent['sections'][number]>,
  audience: Audience,
): string[] {
  const band = (key: string) => byKey.get(key)?.band ?? null;
  let bothHigh = 0;
  let bothLow = 0;
  for (const a of axes.filter((x) => x.angle < 180)) {
    const b = axes.find((x) => x.angle === a.angle + 180);
    if (!b) continue;
    const [x, y] = [band(a.key), band(b.key)];
    if ((x === 'high' || x === 'very_high') && (y === 'high' || y === 'very_high')) bothHigh++;
    if ((x === 'low' || x === 'very_low') && (y === 'low' || y === 'very_low')) bothLow++;
  }
  const notes: string[] = [];
  const note = (level: string, tendency: string) =>
    byAudience(audience, {
      student: `Birbirinin tersi olan bazı tarzlarda ikisi de ${level} çıktı. Bu, cümlelerin çoğuna ${tendency} eğiliminden kaynaklanabilir; bu tarzları yorumlarken dikkatli ol.`,
      parent: `Birbirinin tersi olan bazı tarzlarda ikisi de ${level} çıktı. Bu, cümlelerin çoğuna ${tendency} eğiliminden kaynaklanabilir; bu tarzlar dikkatle yorumlanmalıdır.`,
    });
  if (bothHigh >= 2) notes.push(note('yüksek', 'katılma'));
  if (bothLow >= 2) notes.push(note('düşük', 'katılmama'));
  return notes;
}

/** "Destek almak isterseniz" kutusu (tam raporla aynı metin). */
const SUPPORT: Record<Audience, { title: string; lines: string[] }> = {
  student: {
    title: 'Konuşmak istersen',
    lines: [
      'Kendini zor hissettiğinde bunu tek başına taşımak zorunda değilsin. Ailenle, okulundaki rehber öğretmeninle ya da güvendiğin bir yetişkinle konuşabilirsin. Acil bir durumda 112’yi arayabilirsin.',
    ],
  },
  parent: {
    title: 'Destek almak isterseniz',
    lines: [
      'Okulun rehberlik servisi (psikolojik danışman) ilk başvuru adresidir ve ücretsizdir.',
      'Aile hekiminiz, gerekirse çocuk ve ergen ruh sağlığı uzmanına yönlendirebilir.',
      'Acil bir durum olduğunu düşünüyorsanız 112’yi arayın.',
    ],
  },
  adult: {
    title: 'Destek almak istersen',
    lines: [
      'Kendini zor hissettiğinde bunu tek başına taşımak zorunda değilsin; güvendiğin biriyle konuşmak iyi gelir.',
      'Aile hekimine başvurabilirsin; gerekirse seni bir ruh sağlığı uzmanına yönlendirebilir. Üniversitede okuyorsan kampüsteki psikolojik danışmanlık biriminden de destek alabilirsin.',
      'Acil bir durum olduğunu düşünüyorsan 112’yi ara.',
    ],
  },
};

/**
 * Yalnızca küçük çocuklara (en çok 5. sınıf) açık testlerde öğrenciye: 8–11 yaşındaki bir çocuğa acil durum numarası
 * vermek orantısız ve korkutucu olabilir; acil durum bilgisi veli raporundadır.
 */
const SUPPORT_YOUNG = {
  title: 'Konuşmak istersen',
  lines: [
    'Kendini çok üzgün, kızgın ya da endişeli hissettiğinde bunu tek başına taşımak zorunda değilsin. Ailene, öğretmenine ya da okuldaki rehber öğretmenine anlatabilirsin.',
  ],
};

export function supportText(audience: Audience, young = false): { title: string; lines: string[] } {
  const { title, lines } = young && audience === 'student' ? SUPPORT_YOUNG : SUPPORT[audience];
  return { title, lines: [...lines] };
}

/** Kime yazıldığına göre metin; yetişkin metni verilmezse öğrenci metni kullanılır (ikisi de "sen" diliyle). */
function byAudience(audience: Audience, t: { student: string; parent: string; adult?: string }): string {
  if (audience === 'parent') return t.parent;
  return audience === 'adult' ? (t.adult ?? t.student) : t.student;
}

/** Raporun sonundaki "bu bir tanı değildir" notu (tam raporla aynı metin). */
export function disclaimerText(report: Pick<ReportContent, 'audience' | 'academic'>): { title: string; text: string } {
  if (report.academic) {
    return {
      title: 'Bu rapor bir sınav notu değildir.',
      text: byAudience(report.audience, {
        student: 'Tek bir testteki cevaplarına dayanır ve bugün neyi bildiğini gösterir. Eksikler çalışarak tamamlanır.',
        parent:
          'Tek bir testteki cevaplara dayanır ve bugünkü durumu gösterir. Öğretmenin gözlemleriyle birlikte değerlendirilmeli; sınıf geçme ya da okul seçimi gibi kararlarda tek başına dayanak olarak kullanılmamalıdır.',
      }),
    };
  }
  return {
    title: 'Bu rapor bir tanı değildir.',
    text: byAudience(report.audience, {
      student: 'Senin cevaplarına dayanır ve bugünkü hâlini anlatır. İnsanlar zamanla değişir ve gelişir.',
      parent:
        'Çocuğunuzun kendi cevaplarına ya da görevdeki performansına dayanır; bugünkü hâlini anlatır. Eğitim ve kariyer kararlarında tek başına dayanak olarak kullanılmamalıdır.',
      adult:
        'Senin cevaplarına dayanır ve bugünkü hâlini anlatır; insanlar zamanla değişir ve gelişir. Eğitim, iş ve kariyer kararlarında tek başına dayanak olarak kullanılmamalıdır.',
    }),
  };
}

/** Yetişkinde ilgilerin ayrışmamış olması (iki ilgi profilinde de aynı metin). */
const FLAT_ADULT =
  'Alanlar arasındaki farklar küçük: ilgilerin belirgin bir yönde toplanmıyor. Bu, ilgilerinin geniş bir alana yayıldığını ya da henüz netleşmediğini gösterebilir. En üstteki alanları yakından tanımak iyi bir adım olur.';

/** İlgi profilinde yorumu etkileyen durumlar (tam raporla aynı metinler). */
export function interestNotes(p: InterestProfile, audience: Audience): string[] {
  const notes: string[] = [];
  if (p.allLow) {
    notes.push(
      byAudience(audience, {
        student:
          'Etkinliklerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu olağan bir durum: Henüz pek çok şeyi denememiş olabilirsin. Farklı etkinlikleri denedikçe ilgilerin netleşebilir. Bu yüzden hiçbir alan öne çıkarılmadı; ilgi kodu ve örnek meslekler verilmedi.',
        parent:
          'Çocuğunuz etkinliklerin çoğundan pek hoşlanmayacağını belirtmiş. Bu durum, henüz yeterince deneyim fırsatı olmamasından ya da o dönemdeki isteksizlikten kaynaklanabilir. Farklı etkinlikleri denemesi için fırsat yaratmanızı öneririz. Bu yüzden hiçbir alan öne çıkarılmadı; ilgi kodu ve örnek meslekler verilmedi.',
        adult:
          'Etkinliklerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu, listedeki etkinliklerin sana uzak gelmesinden ya da o anki isteksizlikten kaynaklanabilir. Keyif aldığın işleri düşünerek testi başka bir gün yeniden çözmek ilgilerini daha net gösterebilir.',
      }),
    );
  } else if (p.flat && !p.top.length) {
    // Bütün alanların puanı aynı (ör. her etkinliğe aynı cevap): öne çıkan alan yoktur.
    notes.push(
      byAudience(audience, {
        student:
          'Bütün alanlarda aynı puan çıktı; bu yüzden hiçbir alan öne çıkarılmadı, ilgi kodu ve örnek meslekler verilmedi. Farklı alanlardaki etkinlikleri denemek ilgilerinin netleşmesine yardım edebilir.',
        parent:
          'Bütün alanlarda aynı puan çıktı; bu yüzden hiçbir alan öne çıkarılmadı, ilgi kodu ve örnek meslekler verilmedi. Farklı alanlarda deneyim fırsatları yaratmak ilgilerin netleşmesine yardım edebilir.',
      }),
    );
  } else {
    if (p.noneHigh && p.top.length) {
      notes.push(
        byAudience(audience, {
          student:
            'Hiçbir alanda belirgin (yüksek düzeyde) bir ilgi çıkmadı; aşağıda en yüksek çıkan alanları görüyorsun. İlgi kodu ve örnek meslekler yalnızca belirgin bir ilgi olduğunda verilir. İlgiler denedikçe netleşir.',
          parent:
            'Hiçbir alanda belirgin (yüksek düzeyde) bir ilgi çıkmadı; aşağıda en yüksek çıkan alanlar yer alıyor. İlgi kodu ve örnek meslekler yalnızca belirgin bir ilgi olduğunda verilir. İlgiler yeni deneyimlerle netleşir.',
        }),
      );
    }
    if (p.flat) {
      notes.push(
        byAudience(audience, {
          student:
            'Alanlar arasındaki farklar küçük; yani ilgilerin henüz belirgin bir yöne ayrışmamış. Bu senin yaşında çok olağan. En üstteki alanları denemeye başlamak iyi bir adım olur.',
          parent:
            'Alanlar arasındaki farklar küçüktür; ilgiler henüz belirgin bir yöne ayrışmamış görünüyor. Bu yaşta olağandır. En üstteki alanlarda deneyim fırsatları yaratmak ilgilerin netleşmesine yardım eder.',
          adult: FLAT_ADULT,
        }),
      );
    }
  }
  notes.push(...p.closeCalls);
  return notes;
}

/** Sıralı etkinlik profilinde (serbest zaman) yorumu etkileyen durumlar: sıklık, ilgiyle birlikte imkânlara da bağlıdır. */
function activityNotes(p: InterestRanking, audience: Audience): string[] {
  if (p.allLow) {
    return [
      byAudience(audience, {
        student:
          'Son bir yılda bu etkinliklerin çoğunu pek yapmamışsın. Bu, ilgi duymadığın anlamına gelmeyebilir: etkinlikler zamana, imkânlara ve çevrende nelerin bulunduğuna bağlıdır. İlgini çeken bir alanı seçip küçük bir adımla denemeye başlayabilirsin.',
        parent:
          'Çocuğunuz son bir yılda bu etkinliklerin çoğunu pek yapmadığını belirtmiş. Bu, ilgi duymadığı anlamına gelmeyebilir: etkinlikler zamana, imkânlara ve çevrede nelerin bulunduğuna bağlıdır. İlgisini çeken alanları onunla konuşmanızı ve denemesi için fırsat yaratmanızı öneririz.',
        adult:
          'Son bir yılda bu etkinliklerin çoğunu pek yapmamışsın. Bu, yoğunluktan, imkânlardan ya da listedeki etkinliklerin sana uzak olmasından kaynaklanabilir. Merak ettiğin ya da eskiden keyif aldığın bir alanı seçip küçük bir adım atmak iyi bir başlangıç olabilir.',
      }),
    ];
  }
  const notes: string[] = [];
  // Sık yapılan alan yoksa yalnızca ara sıra yapılan (en çok iki) alan açıklanır.
  if (p.noneHigh && p.top.length) {
    const two = p.top.length > 1;
    notes.push(
      byAudience(audience, {
        student: `Hiçbir alanda sık yapılan etkinlikler çıkmadı; aşağıda ara sıra yapılan ${two ? 'iki alanı' : 'alanı'} görüyorsun.`,
        parent: `Hiçbir alanda sık yapılan etkinlikler çıkmadı; aşağıda ara sıra yapılan ${two ? 'iki alan' : 'alan'} yer alıyor.`,
      }),
    );
  }
  if (p.flat) {
    notes.push(
      byAudience(audience, {
        student: 'Alanlar arasındaki farklar küçük: hiçbir alan ötekilerden belirgin biçimde ayrılmıyor.',
        parent: 'Alanlar arasındaki farklar küçüktür: hiçbir alan ötekilerden belirgin biçimde ayrılmıyor.',
      }),
    );
  }
  return notes;
}

/** Değer sıralamasının uyarıları: hepsi az önemli, sıralama yapılamadı, hiçbiri çok önemli değil, farklar küçük. */
function valueNotes(p: InterestRanking, audience: Audience): string[] {
  if (p.allLow) {
    return [
      byAudience(audience, {
        student:
          'Bir işte önemli olabilecek şeylerin hepsini az önemli bulduğunu belirtmişsin; bu yüzden hiçbir değer öne çıkarılmadı. Bu, iş ve meslek hakkında henüz pek düşünmemiş olmandan ya da o anki isteksizlikten kaynaklanabilir. Hayal ettiğin bir işi düşünerek testi başka bir gün yeniden çözmek önceliklerini daha net gösterebilir.',
        parent:
          'Çocuğunuz bir işte önemli olabilecek şeylerin hepsini az önemli bulduğunu belirtmiş; bu yüzden hiçbir değer öne çıkarılmadı. Bu, iş ve meslek hakkında henüz pek düşünmemiş olmasından ya da o anki isteksizlikten kaynaklanabilir.',
        adult:
          'Bir işte önemli olabilecek şeylerin hepsini az önemli bulduğunu belirtmişsin; bu yüzden hiçbir değer öne çıkarılmadı. Bu, listedeki şeylerin sana uzak gelmesinden ya da o anki isteksizlikten kaynaklanabilir. Şu anki ya da geçmişteki bir işini düşünerek testi başka bir gün yeniden çözmek önceliklerini daha net gösterebilir.',
      }),
    ];
  }
  const notes: string[] = [];
  if (!p.top.length) {
    notes.push(
      byAudience(audience, {
        student:
          'Birçok değere aynı önemi verdin; bu yüzden hiçbir değer öne çıkarılmadı. Gerçek seçimlerde değerler çoğu zaman birbiriyle yarışır: iki iş arasında kalsan hangisinden vazgeçebileceğini düşünmek önceliklerini netleştirebilir.',
        parent:
          'Çocuğunuz birçok değere aynı önemi verdi; bu yüzden hiçbir değer öne çıkarılmadı. Gerçek seçimlerde değerler çoğu zaman birbiriyle yarışır: iki iş arasında kalsa hangisinden vazgeçebileceğini onunla konuşmak önceliklerini netleştirebilir.',
      }),
    );
    return notes;
  }
  if (p.noneHigh) {
    notes.push(
      byAudience(audience, {
        student:
          p.top.length > 1
            ? 'Hiçbir değeri “çok önemli” bulmadın; aşağıda en yüksek çıkan değerlerini görüyorsun.'
            : 'Hiçbir değeri “çok önemli” bulmadın; aşağıda en yüksek çıkan değerini görüyorsun.',
        parent:
          p.top.length > 1
            ? 'Çocuğunuz hiçbir değeri “çok önemli” bulmadı; aşağıda en yüksek çıkan değerleri yer alıyor.'
            : 'Çocuğunuz hiçbir değeri “çok önemli” bulmadı; aşağıda en yüksek çıkan değeri yer alıyor.',
      }),
    );
  }
  if (p.flat) {
    notes.push(
      byAudience(audience, {
        student:
          'Değerler arasındaki farklar küçük: birçok şeye benzer önem veriyorsun. Bu yaygındır; ama gerçek seçimlerde değerler çoğu zaman birbiriyle yarışır. İki seçenek arasında kaldığında hangisinden vazgeçebileceğini düşünmek önceliklerini netleştirebilir.',
        parent:
          'Değerler arasındaki farklar küçük: çocuğunuz birçok şeye benzer önem veriyor. Bu yaygındır; ama gerçek seçimlerde değerler çoğu zaman birbiriyle yarışır. İki seçenek arasında kalsa hangisinden vazgeçebileceğini onunla konuşmak önceliklerini netleştirebilir.',
      }),
    );
  }
  return notes;
}

/** Sıralı ilgi profilinde yorumu etkileyen durumlar. */
export function rankingNotes(p: InterestRanking, audience: Audience): string[] {
  if (p.kind === 'activities') return activityNotes(p, audience);
  if (p.kind === 'values') return valueNotes(p, audience);
  if (p.allLow) {
    return [
      byAudience(audience, {
        student:
          'İşlerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu olağan bir durum: Henüz pek çok şeyi denememiş olabilirsin. Farklı etkinlikleri denedikçe ilgilerin netleşecek.',
        parent:
          'Çocuğunuz işlerin çoğundan pek hoşlanmayacağını belirtmiş. Bu durum, henüz yeterince deneyim fırsatı olmamasından ya da o dönemdeki isteksizlikten kaynaklanabilir. Farklı etkinlikleri denemesi için fırsat yaratmanızı öneririz.',
        adult:
          'İşlerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu, listedeki işlerin sana uzak gelmesinden ya da o anki isteksizlikten kaynaklanabilir. Keyif aldığın işleri ve etkinlikleri düşünerek testi başka bir gün yeniden çözmek ilgilerini daha net gösterebilir.',
      }),
    ];
  }
  const notes: string[] = [];
  if (p.noneHigh && p.top.length) {
    notes.push(
      byAudience(audience, {
        student: 'Hiçbir alanda belirgin bir ilgi çıkmadı; aşağıda en yüksek çıkan iki alanı görüyorsun. İlgiler denedikçe netleşir.',
        parent: 'Hiçbir alanda belirgin bir ilgi çıkmadı; aşağıda en yüksek çıkan iki alan yer alıyor. İlgiler yeni deneyimlerle netleşir.',
      }),
    );
  }
  if (p.flat) {
    // Bütün alanlar aynı puandaysa (öne çıkan alan gösterilmez) "en üstteki alanlar" yerine farklı alanlar önerilir.
    const top = p.top.length > 0;
    notes.push(
      byAudience(audience, {
        student: `Alanlar arasındaki farklar küçük; yani ilgilerin henüz belirgin bir yöne ayrışmamış. Bu çok olağan. ${top ? 'En üstteki alanları denemeye başlamak' : 'Farklı alanları denemek'} iyi bir adım olur.`,
        parent: `Alanlar arasındaki farklar küçüktür; ilgiler henüz belirgin bir yöne ayrışmamış görünüyor. Bu olağandır. ${top ? 'En üstteki alanlarda' : 'Farklı alanlarda'} deneyim fırsatları yaratmak ilgilerin netleşmesine yardım eder.`,
        adult: top ? FLAT_ADULT : FLAT_ADULT.replace('En üstteki alanları', 'Farklı alanları'),
      }),
    );
  }
  return notes;
}

/**
 * Sıralı profillerin başlıkları ([öğrenciye ya da yetişkine, veliye]): meslek ilgilerinde puan işlerden ne kadar
 * hoşlanıldığı, serbest zaman etkinliklerinde etkinliklerin son bir yılda ne sıklıkla yapıldığıdır.
 */
const RANKING_TEXT: Record<
  InterestRanking['kind'],
  {
    chartTitle: [string, string];
    chartNote: string;
    topLabel: [string, string];
    itemsTitle: [string, string];
    restNote: string;
    /** Sıralanan şeyin adıyla başlıklar: öne çıkan yokken, en yüksekler (belirgin düzeyde değilken), ötekiler. */
    all: [string, string];
    allTitle: string;
    highestOne: [string, string];
    highest: [string, string];
    rest: [string, string];
  }
> = {
  interests: {
    chartTitle: ['İlgi alanların', 'İlgi alanları'],
    chartNote: 'Alanlar en yüksekten en düşüğe sıralandı. Değerler 1 (hiç hoşlanmam) ile 5 (çok hoşlanırım) arasındadır.',
    topLabel: ['En belirgin ilgi alanın', 'En belirgin ilgi alanı'],
    itemsTitle: ['En belirgin ilgi alanların', 'En belirgin ilgi alanları'],
    restNote: 'Alan örnekleri yol göstermek içindir; bir meslek seçimi önerisi değildir.',
    all: ['Alanların', 'Alanlar'],
    allTitle: 'Bütün alanlar',
    highestOne: ['En yüksek çıkan alanın', 'En yüksek çıkan alan'],
    highest: ['En yüksek çıkan alanların', 'En yüksek çıkan alanlar'],
    rest: ['Diğer alanların', 'Diğer alanlar'],
  },
  activities: {
    chartTitle: ['Serbest zaman etkinliklerin', 'Serbest zaman etkinlikleri'],
    chartNote:
      'Alanlar, o alandaki etkinliklerin son bir yılda ne sıklıkla yapıldığına göre sıralandı. Değerler, o alandaki cevapların ortalamasıdır: 1 hiç yapmadım, 2 son bir yılda yapmadım, 3 son bir yılda 1 ya da 2 kez, 4 son bir yılda 3 ile 10 kez arası, 5 son bir yılda 10 kezden fazla.',
    topLabel: ['En sık uğraştığın alan', 'En sık uğraşılan alan'],
    itemsTitle: ['En sık uğraştığın alanlar', 'En sık uğraşılan alanlar'],
    restNote: '',
    all: ['Alanların', 'Alanlar'],
    allTitle: 'Bütün alanlar',
    highestOne: ['En yüksek çıkan alanın', 'En yüksek çıkan alan'],
    highest: ['En yüksek çıkan alanların', 'En yüksek çıkan alanlar'],
    rest: ['Diğer alanların', 'Diğer alanlar'],
  },
  values: {
    chartTitle: ['Değerlerin', 'Çocuğunuzun değerleri'],
    chartNote: 'Değerler en önemliden en az önemliye sıralandı. Puanlar 1 (hiç önemli değil) ile 5 (son derece önemli) arasındadır.',
    topLabel: ['En önem verdiğin değer', 'En önem verdiği değer'],
    itemsTitle: ['En önem verdiğin değerler', 'En önem verdiği değerler'],
    restNote: '',
    all: ['Değerlerin', 'Değerler'],
    allTitle: 'Bütün değerler',
    highestOne: ['En yüksek çıkan değerin', 'En yüksek çıkan değer'],
    highest: ['En yüksek çıkan değerlerin', 'En yüksek çıkan değerler'],
    rest: ['Diğer değerlerin', 'Diğer değerler'],
  },
};

export function toSimpleReport(r: ReportContent): SimpleReport {
  const you = r.audience !== 'parent';
  const base = {
    instrumentName: r.instrumentName,
    audience: r.audience,
    studentName: r.studentName,
    gradeLabel: r.gradeLabel,
    completedAt: r.completedAt,
    isPilot: r.isPilot,
    cautions: [...r.qualityNotes],
    support: r.support ? supportText(r.audience, r.young) : null,
    normNote: r.normNote,
    disclaimer: disclaimerText(r),
  };

  if (r.interests) {
    const p = r.interests;
    const pick = ([forYou, forParent]: [string, string]) => (you ? forYou : forParent);
    const shown = new Set(p.top.map((t) => t.key));
    // Öne çıkan alanların dışındakiler düzeyleriyle tek satırda (öne çıkan alan yoksa bütün alanlar).
    const rest = r.sections
      .filter((s) => s.value !== null && !p.top.some((t) => RIASEC_TYPES[t.key].scaleKey === s.scaleKey))
      .sort((a, b) => b.value! - a.value!);
    return {
      ...base,
      chartTitle: you ? 'İlgi profilin' : 'İlgi profili',
      chartNote: 'Altıgende yan yana duran alanlar birbirine benzer. Değerler 1 ile 5 arasındadır.',
      chart: {
        type: 'hexagon',
        highlight: RIASEC_ORDER.filter((k) => shown.has(k)),
        axes: RIASEC_ORDER.map((k) => ({ key: k, label: RIASEC_TYPES[k].name, value: p.types.find((t) => t.key === k)?.mean ?? null })),
      },
      keyFigures: p.code
        ? [{ label: 'İlgi kodu', value: p.code, note: p.top.map((t) => t.name).join(' · ') }]
        : p.top.length
          ? [
              {
                label: pick(['En yüksek çıkan alanın', 'En yüksek çıkan alan']),
                value: p.top[0].name,
                note: p.top.length > 1 ? `Ardından: ${p.top.slice(1).map((t) => t.name).join(' · ')}` : undefined,
              },
            ]
          : [],
      itemsTitle: !p.top.length
        ? pick(['Alanların', 'Alanlar'])
        : p.code
          ? pick(['En belirgin ilgi alanların', 'En belirgin ilgi alanları'])
          : pick(['En yüksek çıkan alanların', 'En yüksek çıkan alanlar']),
      items: [
        ...p.top.map((t, i) => ({ title: `${i + 1}. ${t.name}`, badge: t.bandLabel, text: t.text })),
        ...(p.occupations.length
          ? [
              {
                title: you ? 'Sana uyabilecek örnek meslekler' : 'Profile uyan örnek meslekler',
                text: `${p.occupations.map((o) => o.name).join(' · ')}. Liste, meslekleri en çok hitap ettikleri ilgi alanlarına göre sınıflandıran Holland kodlarına dayanır; yol göstermek içindir, bir meslek seçimi önerisi değildir.`,
              },
            ]
          : []),
        ...(rest.length
          ? [
              {
                title: p.top.length ? pick(['Diğer alanların', 'Diğer alanlar']) : 'Bütün alanlar',
                text: `${rest.map((s) => `${s.name} (${s.bandLabel.toLocaleLowerCase('tr-TR')})`).join(' · ')}.`,
              },
            ]
          : []),
      ],
      cautions: [...base.cautions, ...interestNotes(p, r.audience)],
    };
  }

  if (r.ranking) {
    const p = r.ranking;
    const t = RANKING_TEXT[p.kind];
    const pick = ([forYou, forParent]: [string, string]) => (you ? forYou : forParent);
    const top = p.top.map((k) => r.sections.find((s) => s.scaleKey === k)).filter((s): s is NonNullable<typeof s> => !!s);
    // Sona kalan değerler yalnızca kendi maddelerinde anılıyorsa ötekilerin listesinden çıkarılır.
    const bottom = p.lowerText ? (p.bottom ?? []) : [];
    const rest = r.sections.filter((s) => s.value !== null && !p.top.includes(s.scaleKey) && !bottom.includes(s.scaleKey));
    // Değer sıralamasında eşit puanlılar aynı sıra numarasını alır; en yüksek puanı paylaşanlar birlikte anılır.
    const ranks = p.ranks ?? top.map((_, i) => i + 1);
    const tiedFirst = top.filter((_, i) => ranks[i] === 1);
    const tied = (i: number) => ranks.filter((x) => x === ranks[i]).length > 1;
    const one = p.kind === 'values' && top.length === 1;
    return {
      ...base,
      chartTitle: pick(t.chartTitle),
      // Şablonun genel açıklaması ("ilgi, yetenek demek değildir" ya da "sıklık imkânlara da bağlıdır") önceliklidir.
      chartNote: r.overview ?? t.chartNote,
      chart: {
        type: 'rulers',
        rows: r.sections.map((s) => ({
          label: s.name,
          value: s.value,
          min: s.min,
          max: s.max,
          ciLow: s.ciLow,
          ciHigh: s.ciHigh,
          valueLabel: s.valueLabel,
          band: s.bandLabel,
        })),
      },
      keyFigures: top.length
        ? tiedFirst.length > 1
          ? [
              {
                label: p.noneHigh ? pick(t.highest) : pick(t.itemsTitle),
                value: tiedFirst.map((s) => s.name).join(' · '),
                note: top.length > tiedFirst.length ? `Ardından: ${top.slice(tiedFirst.length).map((s) => s.name).join(' · ')}` : 'eşit puanla',
              },
            ]
          : [
              {
                label: p.noneHigh ? pick(t.highestOne) : pick(t.topLabel),
                value: top[0].name,
                note: top.length > 1 ? `Ardından: ${top.slice(1).map((s) => s.name).join(' · ')}` : undefined,
              },
            ]
        : [],
      // Bütün alanların puanı aynıysa öne çıkan alan yoktur: alanlar düzeyleriyle tek listede gösterilir.
      itemsTitle: !top.length
        ? pick(t.all)
        : one
          ? p.noneHigh
            ? pick(t.highestOne)
            : pick(t.topLabel)
          : p.noneHigh
            ? pick(t.highest)
            : pick(t.itemsTitle),
      items: [
        ...top.map((s, i) => ({ title: `${ranks[i]}. ${s.name}`, badge: tied(i) ? `${s.bandLabel} · eşit puan` : s.bandLabel, text: s.text })),
        // Değer sıralaması: ikisi de en önemliler arasında olan, birbirine ters yönde çekebilen değerler.
        ...(p.tradeoffs ?? []).map((x) => ({ title: x.title, badge: 'Birbiriyle yarışabilir', text: x.text })),
        ...(bottom.length && p.lowerText
          ? [
              {
                title:
                  bottom.length > 1
                    ? pick(['Daha az önem verdiğin değerler', 'Daha az önem verdiği değerler'])
                    : pick(['Daha az önem verdiğin değer', 'Daha az önem verdiği değer']),
                text: p.lowerText,
              },
            ]
          : []),
        ...(rest.length
          ? [
              {
                title: top.length ? pick(t.rest) : t.allTitle,
                // Alan örnekleri öne çıkan alanların metinlerindedir; öne çıkan alan yoksa not da yazılmaz.
                text: [`${rest.map((s) => `${s.name} (${s.bandLabel.toLocaleLowerCase('tr-TR')})`).join(' · ')}.`, top.length ? t.restNote : '']
                  .filter(Boolean)
                  .join(' '),
              },
            ]
          : []),
        ...(p.note ? [p.note] : []),
      ],
      cautions: [...base.cautions, ...rankingNotes(p, r.audience)],
    };
  }

  if (r.reading) {
    const x = r.reading;
    const comp = r.sections[0];
    return {
      ...base,
      chartTitle: 'Soru türlerine göre',
      chart: {
        type: 'bars',
        rows: x.skills.map((s) => ({ label: s.label, value: s.correct, max: s.total, valueLabel: `${s.correct}/${s.total}` })),
      },
      keyFigures: [
        { label: 'Anlama', value: `${x.correct}/${x.total}`, note: 'doğru cevap' },
        { label: 'Okuma hızı', value: nf0.format(x.wpm), note: 'kelime/dakika' },
        // Anlama 6/8'in altındaysa ya da süre güvenilmezse yorumlanmaz: göz gezdirip tahminle cevaplayan yüksek görünmesin.
        x.effectiveWpm === null
          ? { label: 'Anlayarak okuma', value: '—', note: 'anlama 6/8’in altında ya da süre güvenilmez: yorumlanmadı' }
          : { label: 'Anlayarak okuma', value: nf0.format(x.effectiveWpm), note: 'hız × şansla düzeltilmiş anlama' },
      ],
      itemsTitle: x.passageTitle ? `“${x.passageTitle}” metni` : 'Okuma sonucu',
      items: [
        ...(comp ? [{ title: 'Anlama', badge: comp.bandLabel, text: comp.text }] : []),
        { title: 'Okuma hızı', text: x.referenceNote ? `${x.speedNote} ${x.referenceNote}` : x.speedNote },
      ],
    };
  }

  if (r.academic) {
    const a = r.academic;
    const perDomain = Math.max(...a.domains.map((d) => d.n));
    const optionText = (it: (typeof a.review)[number], key: string) => `${key}) ${it.options.find((o) => o.key === key)?.text ?? ''}`;
    const missed = a.review.filter((it) => !it.correct);
    const questions: SimpleQuizQuestion[] = missed.map((it) => ({
      no: it.no,
      domainName: it.domainName,
      text: it.text,
      ...(it.table ? { table: it.table } : {}),
      ...(it.chart ? { chart: it.chart } : {}),
      ...(it.figure ? { figure: it.figure } : {}),
      status: it.choice === null ? 'missing' : it.choice === 'X' ? 'dontKnow' : 'wrong',
      chosen: it.choice && it.choice !== 'X' ? optionText(it, it.choice) : null,
      answer: optionText(it, it.answer),
      explain: it.explain,
      misconception: it.misconception,
    }));
    const quiz: SimpleQuizReview = {
      title: you ? 'Yanlış yaptığın ve bilmediğin sorular' : 'Yanlış yapılan ve bilinmeyen sorular',
      intro: missed.length
        ? you
          ? `${missed.length} sorunun her birinde doğru cevabı ve kısa çözümünü görüyorsun. Çözümü okuduktan birkaç gün sonra soruyu kâğıda bakmadan yeniden çözmeye çalış.`
          : `${missed.length} sorunun her birinde doğru cevap ve kısa çözüm yer alıyor. Soruları çocuğunuzla birlikte, çözümü ona anlattırarak gözden geçirebilirsiniz.`
        : you
          ? 'Bütün soruları doğru yaptın; incelenecek yanlış soru yok.'
          : 'Bütün sorular doğru cevaplandı; incelenecek yanlış soru yok.',
      questions,
      errorsTitle: you ? 'Yanlışların neyi gösteriyor?' : 'Yanlışlar neyi gösteriyor?',
      errorsNote: a.misconceptionNote,
      errors: a.misconceptions.map((m) => ({
        name: m.name,
        seen:
          m.count > 1
            ? `${m.count} soruda görüldü (${m.itemNumbers.join(', ')}. sorular)`
            : `1 soruda görüldü (${m.itemNumbers[0]}. soru)`,
        explain: m.explain,
        tip: m.tip,
      })),
    };
    return {
      ...base,
      chartTitle: 'Konu alanlarına göre',
      // Her alan birkaç soruya dayanır: alan düzeyleri kaba bir göstergedir.
      chartNote: `${a.contentGrade}. sınıf konuları. Her alan ${perDomain} soruya dayanır; alan düzeyleri kaba bir göstergedir, bir iki sorudaki dikkatsizlik düzeyi değiştirebilir.`,
      quiz,
      chart: {
        type: 'bars',
        rows: a.domains.map((d) => ({ label: d.name, value: d.correct, max: d.n, valueLabel: `${d.correct}/${d.n}` })),
      },
      keyFigures: [
        { label: 'Doğru', value: `${a.correct}/${a.n}` },
        { label: 'Bilmiyorum', value: String(a.dontKnow) },
        { label: 'Genel sonuç', value: a.bandLabel },
      ],
      itemsTitle: 'Konu alanları',
      items: [
        { title: 'Genel sonuç', badge: a.bandLabel, text: a.text },
        ...a.domains.map((d) => ({ title: d.name, badge: d.bandLabel, text: `${d.correct}/${d.n} doğru${d.dontKnow ? `, ${d.dontKnow} soruda “Bilmiyorum”` : ''}. ${d.plain}` })),
      ],
    };
  }

  if (r.cognitive) {
    const blocks = r.cognitive.blocks;
    const items = blocks.map((b) => ({ title: b.name, badge: b.headline, text: [b.detail, b.text].filter((x): x is string => !!x).map(sentence).join(' ') }));
    // Tek görevli testler (renk-kelime, dur-git, sırayla birleştirme, geriye dönük hatırlama, zihinde döndürme, tepki
    // hızı, şekil akıl yürütme): sonucu görevin kendi grafiği özetler.
    const own = r.cognitive.chart;
    if (own) {
      return {
        ...base,
        chartTitle: own.title,
        chartNote: own.note,
        chart: { type: 'bars', rows: own.rows },
        keyFigures: r.cognitive.figures ?? [],
        itemsTitle: you ? 'Sonuçların' : 'Sonuçlar',
        items,
      };
    }
    const sections = blocks.find((b) => b.sections)?.sections;
    return {
      ...base,
      chartTitle: sections ? 'Bölüm bölüm net doğru' : 'Görev sonuçları',
      chartNote: sections ? 'Her sütun bir bölüm; bölümlerin süresi eşittir.' : undefined,
      chart: sections
        ? { type: 'columns', rows: sections, caption: 'net doğru' }
        : blocks.some((b) => b.flanker)
          ? {
              type: 'bars',
              rows: blocks
                .filter((b) => b.flanker)
                .flatMap((b) => [
                  { label: 'Oklar aynı yöne bakarken', value: Math.round(b.flanker!.accCongruent * 100), max: 100, valueLabel: `%${Math.round(b.flanker!.accCongruent * 100)}` },
                  { label: 'Oklar farklı yöne bakarken', value: Math.round(b.flanker!.accIncongruent * 100), max: 100, valueLabel: `%${Math.round(b.flanker!.accIncongruent * 100)}` },
                ]),
            }
          : null,
      keyFigures: [],
      // Tek görevli testlerde kartlar görevin sonuçlarıdır; çok görevli testte her kart bir görevdir.
      itemsTitle: sections || blocks.some((b) => /^(renk|dg|iz|gh|zd|th|sa|sd|sz|kk|kb|kd|kl|ma)_/.test(b.key)) ? (you ? 'Sonuçların' : 'Sonuçlar') : 'Görevler',
      items,
    };
  }

  // Likert ölçekleri
  const one = r.sections.length === 1;
  const margin = r.sections.some((s) => s.value !== null && s.ciLow !== null && s.ciHigh !== null);
  const marks = margin
    ? you
      ? 'Kırmızı işaret senin puanın, sarı bant ölçümün doğal payı.'
      : 'Kırmızı işaret puanı, sarı bant ölçümün doğal payını gösterir.'
    : '';
  const poles = you
    ? 'Uçlardan biri iyi, öteki kötü değil; her tarzın kendine özgü güçlü yanları var.'
    : 'Uçlardan biri iyi, öteki kötü değildir; her tarzın kendine özgü güçlü yanları vardır.';
  const ruler = (s: ReportContent['sections'][number]): RulerRow => ({
    label: s.name,
    value: s.value,
    min: s.min,
    max: s.max,
    ciLow: s.ciLow,
    ciHigh: s.ciHigh,
    valueLabel: s.valueLabel,
    band: s.bandLabel,
  });
  const badge = (s: ReportContent['sections'][number]) => (s.summary && s.summary !== s.bandLabel ? `${s.bandLabel} · ${s.summary}` : s.bandLabel);

  // Motivasyon haritası: kendi isteğiyle ve baskıyla çalışma bir düzlemde; profil ve yorumu; ardından bileşik ölçekler
  // (ve isteksizlik) grup grup, alt ölçeklerinin cetvelleri ve yorumlarıyla.
  if (r.motivation) {
    const m = r.motivation;
    const byKey = new Map(r.sections.map((s) => [s.scaleKey, s]));
    const groups = m.groups.flatMap((g) => {
      const head = byKey.get(g.key);
      if (!head) return [];
      const facets = g.scales.flatMap((k) => byKey.get(k) ?? []).map((f) => ({ ...ruler(f), text: f.text }));
      return [{ title: head.name, badge: head.value === null ? head.bandLabel : `${head.bandLabel} · ${head.valueLabel}`, text: g.text, facets }];
    });
    return {
      ...base,
      chartTitle: you ? 'Motivasyon haritan' : 'Motivasyon haritası',
      chartNote: m.chartNote,
      chart: {
        type: 'quadrant',
        x: { label: m.x.name, value: m.x.value },
        y: { label: m.y.name, value: m.y.value },
        min: r.sections[0]?.min ?? 1,
        max: r.sections[0]?.max ?? 5,
        cuts: m.cuts,
        corners: m.corners,
        active: m.pattern,
        activeLabel: m.name,
      },
      keyFigures: [],
      itemsTitle: you ? 'Sonuçların' : 'Sonuçlar',
      items: [{ title: you ? 'Motivasyon profilin' : 'Motivasyon profili', ...(m.name ? { badge: m.name } : {}), text: m.text }],
      groups,
    };
  }

  // Kişilerarası çember: tarzlar çemberde üstten (öne çıkma) başlayarak saat yönünde sıralanır; grafik ve metinler
  // aynı sırayla. Genel açıklama şablondan gelir (çemberin nasıl okunacağı ve sonuçların yaklaşık olduğu).
  if (r.circumplex) {
    const byKey = new Map(r.sections.map((s) => [s.scaleKey, s]));
    const clockwise = (angle: number) => (((90 - angle) % 360) + 360) % 360;
    const order = [...r.circumplex].sort((a, b) => clockwise(a.angle) - clockwise(b.angle));
    return {
      ...base,
      cautions: [...base.cautions, ...circumplexNotes(r.circumplex, byKey, r.audience)],
      chartTitle: you ? 'Kişilerarası tarzın' : 'Kişilerarası tarzı',
      chartNote: r.overview,
      chart: { type: 'circle', axes: order.map((a) => ({ key: a.key, label: a.short, value: byKey.get(a.key)?.value ?? null, angle: a.angle })) },
      keyFigures: [],
      itemsTitle: 'Tarzlar',
      items: order.flatMap((a) => byKey.get(a.key) ?? []).map((s) => ({ title: s.name, badge: badge(s), text: s.text })),
    };
  }

  // Ayrıntılı profil: genel bakışta boyutlar, ardından her boyutun altında alt özellikleri.
  if (r.facetGroups) {
    const byKey = new Map(r.sections.map((s) => [s.scaleKey, s]));
    const domains = r.facetGroups.flatMap((g) => byKey.get(g.domain) ?? []);
    const groups = r.facetGroups.flatMap((g) => {
      const d = byKey.get(g.domain);
      if (!d) return [];
      const facets = g.facets.flatMap((k) => byKey.get(k) ?? []).map((f) => ({ ...ruler(f), text: f.text }));
      return [{ title: d.name, badge: badge(d), text: d.text, facets }];
    });
    return {
      ...base,
      chartTitle: 'Genel bakış',
      chartNote: ['Her satır bir boyut.', marks, poles].filter(Boolean).join(' '),
      chart: { type: 'rulers', rows: domains.map(ruler) },
      keyFigures: [],
      itemsTitle: 'Boyut boyut ayrıntılar',
      items: [],
      groups,
      groupsNote: facetNote(r.facetGroups[0]?.facetItems ?? 0, margin),
    };
  }

  // Şablonun kendi genel açıklaması varsa o kullanılır: değerlendirici ölçeklerde "uçlardan biri iyi, öteki kötü değil"
  // cümlesi yanlış olur (çalışma alışkanlıkları); bazı testler de toplam puan olmadığını ya da ölçeklerin kısa olduğunu
  // söylemelidir (duygusal zekâ bileşenleri). Açıklama kırmızı işareti zaten anlatabildiği için ölçüm payı varsa
  // yalnızca sarı bant cümlesi eklenir.
  const band = margin ? (you ? 'Sarı bant ölçümün doğal payı.' : 'Sarı bant ölçümün doğal payını gösterir.') : '';
  const overview = r.overview ? [r.overview, band].filter(Boolean).join(' ') : undefined;
  // Ölçeklerin birlikte yorumu (varsa) ilk madde olarak.
  const lead = r.insight ? [{ title: r.insight.title, text: r.insight.text }] : [];
  return {
    ...base,
    chartTitle: one ? r.sections[0].name : 'Genel bakış',
    chartNote: one
      ? marks || undefined
      : (overview ?? [you ? 'Her satır bir özellik.' : 'Her satır bir boyut.', marks, poles].filter(Boolean).join(' ')),
    chart: { type: 'rulers', rows: r.sections.map(ruler) },
    keyFigures: [],
    itemsTitle: one ? 'Sonuç' : lead.length ? (you ? 'Sonuçların' : 'Sonuçlar') : 'Boyutlar',
    items: [...lead, ...r.sections.map((s) => ({ title: s.name, badge: badge(s), text: s.text }))],
  };
}

export const formatMean = (v: number | null) => (v === null ? '—' : nf1.format(v));

export type QuadrantChart = Extract<SimpleChart, { type: 'quadrant' }>;

/** Profil adını iki satıra böler (uzunlukları en yakın olacak boşluktan): "Hem istek" / "hem baskı". */
export function twoLines(label: string): string[] {
  const words = label.split(' ');
  if (words.length < 2) return [label];
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) {
      best = i;
      bestDiff = diff;
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

/**
 * Motivasyon haritasının çizimi (ekranda ve PDF'te aynı hesap). Düzlem `box` içindedir: sol üst köşe (left, top), kenar
 * `size`. Dokuz hücre (düşük, orta, yüksek × düşük, orta, yüksek), köşe hücrelerindeki profil adlarının dayanacağı köşe,
 * 1'den 5'e ölçek işaretleri ve kişinin noktası (bir eksen hesaplanamadıysa yok). Adlar hücrenin dış kenarına (düzlemin
 * köşesine) yazılır; kişinin noktası adın kapladığı şeride düşüyorsa (uç cevaplarda) ad hücrenin iç kenarına alınır,
 * nokta yazının üstüne binmez. Şeridin yüksekliği iki satır yazı ve noktanın yarıçapı kadardır (kenarın %18'i).
 */
export function quadrantGeometry(chart: QuadrantChart, box: { left: number; top: number; size: number }) {
  const { left: L, top: T, size: S } = box;
  const span = chart.max - chart.min || 1;
  const clamp = (v: number) => Math.min(chart.max, Math.max(chart.min, v));
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const px = (v: number) => r2(L + ((clamp(v) - chart.min) / span) * S);
  const py = (v: number) => r2(T + ((chart.max - clamp(v)) / span) * S);
  const edges = [chart.min, chart.cuts[0], chart.cuts[1], chart.max];
  const levels = ['low', 'average', 'high'] as const;
  const cells = levels.flatMap((lx, i) =>
    levels.map((ly, j) => ({
      key: `${lx}-${ly}`,
      x: px(edges[i]),
      y: py(edges[j + 1]),
      w: r2(px(edges[i + 1]) - px(edges[i])),
      h: r2(py(edges[j]) - py(edges[j + 1])),
      active: chart.active === `${lx}-${ly}`,
    })),
  );
  const point = chart.x.value !== null && chart.y.value !== null ? { x: px(chart.x.value), y: py(chart.y.value) } : null;
  const band = S * 0.18;
  const corners = chart.corners.map((c) => {
    const cell = cells.find((k) => k.key === `${c.x}-${c.y}`)!;
    const right = c.x === 'high';
    const inCell = !!point && point.x >= cell.x && point.x <= cell.x + cell.w && point.y >= cell.y && point.y <= cell.y + cell.h;
    const outerTop = c.y === 'high';
    const covered = inCell && (outerTop ? point!.y - cell.y < band : cell.y + cell.h - point!.y < band);
    const top = covered ? !outerTop : outerTop;
    return {
      key: cell.key,
      lines: twoLines(c.label),
      anchor: right ? ('end' as const) : ('start' as const),
      /** Yazının dayandığı köşe: sağdaki hücrelerde sağ kenar, soldakilerde sol kenar; üstteki hücrelerde üst, alttakilerde alt kenar. */
      x: right ? r2(cell.x + cell.w) : cell.x,
      y: top ? cell.y : r2(cell.y + cell.h),
      top,
      active: cell.active,
    };
  });
  const ticks: { v: number; x: number; y: number }[] = [];
  for (let v = Math.ceil(chart.min); v <= chart.max + 1e-9; v++) ticks.push({ v, x: px(v), y: py(v) });
  return { cells, corners, ticks, point, cuts: chart.cuts.map((c) => ({ x: px(c), y: py(c) })) };
}
