import { RIASEC_ORDER, RIASEC_TYPES } from '@/content/careers/riasec';
import type { Audience, InterestProfile, InterestRanking, ReportContent } from './build';

/**
 * Basit rapor: test bitince ekranda gösterilen ve PDF olarak indirilen ücretsiz rapor (hiçbir yerde
 * saklanmaz). Tam rapordan (ReportContent) türetilir: teste uygun tek bir grafik, her ölçek ya da alan için
 * düzey ve kısa yorum. Öneriler, ayrıntılı açıklamalar ve soru soru inceleme kapsamlı rapordadır.
 */

export type SimpleChart =
  /** Her ölçek kendi aralığında bir cetvel; işaret puanı, bant (varsa) ölçüm payını gösterir. */
  | {
      type: 'rulers';
      rows: { label: string; value: number | null; min: number; max: number; ciLow: number | null; ciHigh: number | null; valueLabel: string; band: string }[];
    }
  /** Holland altıgeni: altı ilgi alanının ortalaması (1–5). */
  | { type: 'hexagon'; highlight: string[]; axes: { key: string; label: string; value: number | null }[] }
  /** Yatay çubuklar: değer / en çok (ör. doğru / soru). */
  | { type: 'bars'; rows: { label: string; value: number; max: number; valueLabel: string }[] }
  /** Dikey sütunlar: eşit süreli bölümler (harf işaretleme). */
  | { type: 'columns'; rows: { label: string; value: number }[]; caption: string };

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

export interface SimpleReport {
  instrumentName: string;
  audience: Audience;
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
}

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** Cümle sonunda nokta yoksa ekler ("141 harf bulundu · 0 yanlış işaret" gibi satırlar metne eklenirken). */
const sentence = (s: string) => (/[.!?…]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

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

export function supportText(audience: Audience): { title: string; lines: string[] } {
  const { title, lines } = SUPPORT[audience];
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
          'Etkinliklerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu olağan bir durum: Henüz pek çok şeyi denememiş olabilirsin. Farklı etkinlikleri denedikçe ilgilerin netleşecek.',
        parent:
          'Çocuğunuz etkinliklerin çoğundan pek hoşlanmayacağını belirtmiş. Bu durum, henüz yeterince deneyim fırsatı olmamasından ya da o dönemdeki isteksizlikten kaynaklanabilir. Farklı etkinlikleri denemesi için fırsat yaratmanızı öneririz.',
        adult:
          'Etkinliklerin çoğundan pek hoşlanmayacağını belirtmişsin. Bu, listedeki etkinliklerin sana uzak gelmesinden ya da o anki isteksizlikten kaynaklanabilir. Keyif aldığın işleri düşünerek testi başka bir gün yeniden çözmek ilgilerini daha net gösterebilir.',
      }),
    );
  } else if (p.flat) {
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
  if (p.closeCall) notes.push(p.closeCall);
  return notes;
}

/** Sıralı ilgi profilinde yorumu etkileyen durumlar. */
export function rankingNotes(p: InterestRanking, audience: Audience): string[] {
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
  if (p.noneHigh) {
    notes.push(
      byAudience(audience, {
        student: 'Hiçbir alanda belirgin bir ilgi çıkmadı; aşağıda en yüksek çıkan iki alanı görüyorsun. İlgiler denedikçe netleşir.',
        parent: 'Hiçbir alanda belirgin bir ilgi çıkmadı; aşağıda en yüksek çıkan iki alan yer alıyor. İlgiler yeni deneyimlerle netleşir.',
      }),
    );
  }
  if (p.flat) {
    notes.push(
      byAudience(audience, {
        student:
          'Alanlar arasındaki farklar küçük; yani ilgilerin henüz belirgin bir yöne ayrışmamış. Bu çok olağan. En üstteki alanları denemeye başlamak iyi bir adım olur.',
        parent:
          'Alanlar arasındaki farklar küçüktür; ilgiler henüz belirgin bir yöne ayrışmamış görünüyor. Bu olağandır. En üstteki alanlarda deneyim fırsatları yaratmak ilgilerin netleşmesine yardım eder.',
        adult: FLAT_ADULT,
      }),
    );
  }
  return notes;
}

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
    support: r.support ? supportText(r.audience) : null,
    normNote: r.normNote,
    disclaimer: disclaimerText(r),
  };

  if (r.interests) {
    const p = r.interests;
    return {
      ...base,
      chartTitle: you ? 'İlgi profilin' : 'İlgi profili',
      chartNote: 'Altıgende yan yana duran alanlar birbirine benzer. Değerler 1 ile 5 arasındadır.',
      chart: {
        type: 'hexagon',
        highlight: p.code.split(''),
        axes: RIASEC_ORDER.map((k) => ({ key: k, label: RIASEC_TYPES[k].name, value: p.types.find((t) => t.key === k)?.mean ?? null })),
      },
      keyFigures: [{ label: 'İlgi kodu', value: p.code, note: p.top.map((t) => t.name).join(' · ') }],
      itemsTitle: you ? 'En belirgin ilgi alanların' : 'En belirgin ilgi alanları',
      items: [
        ...p.top.map((t, i) => ({ title: `${i + 1}. ${t.name}`, text: t.plain })),
        ...(p.occupations.length
          ? [
              {
                title: you ? 'Sana uyabilecek örnek meslekler' : 'Profile uyan örnek meslekler',
                text: `${p.occupations.map((o) => o.name).join(' · ')}. Liste, meslekleri en çok hitap ettikleri ilgi alanlarına göre sınıflandıran Holland kodlarına dayanır; yol göstermek içindir, bir meslek seçimi önerisi değildir.`,
              },
            ]
          : []),
      ],
      cautions: [...base.cautions, ...interestNotes(p, r.audience)],
    };
  }

  if (r.ranking) {
    const p = r.ranking;
    const top = p.top.map((k) => r.sections.find((s) => s.scaleKey === k)).filter((s): s is NonNullable<typeof s> => !!s);
    const rest = r.sections.filter((s) => s.value !== null && !p.top.includes(s.scaleKey));
    return {
      ...base,
      chartTitle: you ? 'İlgi alanların' : 'İlgi alanları',
      // Şablonun genel açıklaması "ilgi, yetenek demek değildir" uyarısını da taşır.
      chartNote: r.overview ?? 'Alanlar en yüksekten en düşüğe sıralandı. Değerler 1 (hiç hoşlanmam) ile 5 (çok hoşlanırım) arasındadır.',
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
        ? [
            {
              label: p.noneHigh ? (you ? 'En yüksek çıkan alanın' : 'En yüksek çıkan alan') : you ? 'En belirgin ilgi alanın' : 'En belirgin ilgi alanı',
              value: top[0].name,
              note: top.length > 1 ? `Ardından: ${top.slice(1).map((s) => s.name).join(' · ')}` : undefined,
            },
          ]
        : [],
      itemsTitle: p.noneHigh ? (you ? 'En yüksek çıkan alanların' : 'En yüksek çıkan alanlar') : you ? 'En belirgin ilgi alanların' : 'En belirgin ilgi alanları',
      items: [
        ...top.map((s, i) => ({ title: `${i + 1}. ${s.name}`, badge: s.bandLabel, text: s.text })),
        ...(rest.length
          ? [
              {
                title: you ? 'Diğer alanların' : 'Diğer alanlar',
                text: `${rest.map((s) => `${s.name} (${s.bandLabel.toLocaleLowerCase('tr-TR')})`).join(' · ')}. Alan örnekleri yol göstermek içindir; bir meslek seçimi önerisi değildir.`,
              },
            ]
          : []),
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
        { label: 'Anlayarak okuma', value: nf0.format(x.effectiveWpm), note: 'hız × anlama oranı' },
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
    return {
      ...base,
      chartTitle: 'Konu alanlarına göre',
      chartNote: `${a.contentGrade}. sınıf konuları`,
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
        ...(a.misconceptions.length
          ? [
              {
                title: you ? 'Dikkat etmen gereken hata türleri' : 'Görülen hata türleri',
                text: a.misconceptions
                  .slice(0, 4)
                  .map((m) => m.name)
                  .join(' · '),
              },
            ]
          : []),
      ],
    };
  }

  if (r.cognitive) {
    const blocks = r.cognitive.blocks;
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
      itemsTitle: sections ? (you ? 'Sonuçların' : 'Sonuçlar') : 'Görevler',
      items: blocks.map((b) => ({ title: b.name, badge: b.headline, text: [b.detail, b.text].filter((x): x is string => !!x).map(sentence).join(' ') })),
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
      groupsNote:
        'Her boyut, dörder cümleyle ölçülen alt özelliklerden oluşur. Alt özellikler daha az cümleye dayandığı için boyutlardan daha az kesindir; sarı bantların daha geniş olması bundandır.',
    };
  }

  return {
    ...base,
    chartTitle: one ? r.sections[0].name : 'Genel bakış',
    chartNote: one ? marks || undefined : [you ? 'Her satır bir özellik.' : 'Her satır bir boyut.', marks, poles].filter(Boolean).join(' '),
    chart: { type: 'rulers', rows: r.sections.map(ruler) },
    keyFigures: [],
    itemsTitle: one ? 'Sonuç' : 'Boyutlar',
    items: r.sections.map((s) => ({ title: s.name, badge: badge(s), text: s.text })),
  };
}

export const formatMean = (v: number | null) => (v === null ? '—' : nf1.format(v));
