import type { AcademicRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { cautionText } from './reading-roadmap';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';
import { basisCaption, graphic, weeksGraphic } from './roadmap-graphics';
import { domainDots, quizGauge } from './simple';
import type { DotsVisual } from './visuals';

/**
 * Konu tarama testlerinin (ör. matematik) gelişim yol haritası: konu alanlarına göre nasıl çalışılacağı, haftalık
 * çalışma düzeni, veliye destek önerileri ve yanlış yapılan sorulardan başlayan dört haftalık plan. Alanlar en çok
 * çalışılması gerekenden başlayarak sıralanır (öncelikli, pekiştirilmeli, sağlam; aynı düzeyde doğru oranı düşük olan
 * önce, eşitlikte formdaki sıra). Öneriler öğretmenin planının yerine geçmez.
 */
export function buildAcademicRoadmap(r: ReportContent, t: AcademicRoadmapTemplate, opts: { preview: boolean; next: NextTest[] }): Roadmap | undefined {
  const ac = r.academic;
  const texts = ac ? t.forms[ac.contentGrade] : undefined;
  if (!ac || !texts) return undefined;
  const a = r.audience;
  const parent = a === 'parent';
  const rank = { low: 0, average: 1, high: 2 } as const;
  const level = (b: string) => (b === 'high' || b === 'average' ? b : 'low');
  const ratio = (d: (typeof ac.domains)[number]) => (d.n ? d.correct / d.n : 0);
  const domains = ac.domains.filter((d) => texts[d.key]);
  // Sonuç yorumlanmadıysa (cevaplar tahmin olabilir ya da bütün sorularda "Bilmiyorum") alanların düzeyi yoktur: alanlar
  // testteki sırayla verilir, öncelik sırası anlatılmaz, üç boyutlu profil çizilmez.
  const notRead = !ac.interpreted;
  const sorted = notRead ? domains : [...domains].sort((x, y) => rank[level(x.band)] - rank[level(y.band)] || ratio(x) - ratio(y));
  const need = notRead ? [] : sorted.filter((d) => level(d.band) !== 'high');
  // Düzeyi ve doğru oranı aynı olan alanlar testteki sırayla verilir: bu söylenir.
  const ties = !notRead && sorted.some((d, i) => i > 0 && level(d.band) === level(sorted[i - 1].band) && ratio(d) === ratio(sorted[i - 1]));
  const missed = ac.n - ac.correct;
  const caution = (r.qualityNotes?.length ?? 0) > 0 ? cautionText(parent) : '';
  const notReadLead = ac.guessed
    ? parent
      ? 'Cevapların bir kısmı tahmin olabileceği için bu alanın düzeyi belirlenemedi. Önerileri öğretmeniyle birlikte gözden geçirin.'
      : 'Cevapların bir kısmı tahmin olabileceği için bu alanın düzeyi belirlenemedi. Önerileri öğretmeninle birlikte gözden geçir.'
    : parent
      ? 'Bütün sorularda “Bilmiyorum” denildiği için bu alanın düzeyi belirlenemedi. Konular okulda henüz işlenmemiş de olabilir; önerileri öğretmeniyle birlikte gözden geçirin.'
      : 'Bütün sorularda “Bilmiyorum” dediğin için bu alanın düzeyi belirlenemedi. Konular okulda henüz işlenmemiş de olabilir; önerileri öğretmeninle birlikte gözden geçir.';

  // Birkaç alanın soruları satır satır (kartlardaki grafiğin aynısı, her alan bir satır).
  const domainsDots = (label: string, ds: typeof domains): DotsVisual => ({
    type: 'dots',
    label,
    rows: ds.map((d) => ({ label: d.name, filled: d.correct, total: d.n, valueLabel: `${d.correct}/${d.n}` })),
    legend: ['doğru', 'yanlış ya da “Bilmiyorum”'],
  });
  // Kısaca: genel sonuç ve düzeylerine göre alanlar (öncelikli, pekiştirilmeli, sağlam); grafikleri genel sonucun düzey
  // çubuğu ve gruptaki alanların soruları. Sonuç yorumlanmadıysa grafik yoktur.
  const groups = (notRead ? [] : (['low', 'average', 'high'] as const))
    .map((g) => domains.filter((d) => level(d.band) === g))
    .filter((ds) => ds.length > 0)
    // Alan adlarında virgül ve "ve" geçtiği için (ör. "Kesirler, ondalık gösterim ve yüzde") noktalı virgülle ayrılır.
    .map((ds) => ({
      title: ds[0].bandLabel,
      text: ds.map((d) => d.name).join('; '),
      keys: ds.map((d) => d.key),
      graphic: graphic(ds.length === 1 ? domainDots(ds[0]) : domainsDots(ds[0].bandLabel, ds))!,
    }));
  // Genel sonucun düzey çubuğu; doğru sayısı satırda okunduğu için sesli dinlemede yalnızca düzey.
  const gauge = !notRead && ac.bandNames ? quizGauge(ac) : undefined;
  const overall = gauge ? graphic(gauge, gauge.active === null ? [] : [`Düzey: ${gauge.zones[gauge.active].label}.`]) : undefined;

  const week = (i: 0 | 1) => {
    const d = need[i];
    if (d) return { title: d.name, text: pick(texts[d.key].action, a), fromResult: true };
    // Sonuç yorumlanmadıysa ikinci hafta öğretmenle hangi konulardan başlanacağı konuşulur.
    if (notRead && i === 0) {
      return {
        title: parent ? 'Öğretmenle konuşmak' : 'Öğretmenle konuş',
        text: parent
          ? 'Bu hafta raporu matematik öğretmeniyle paylaşın ve hangi konulardan başlanacağını birlikte seçin.'
          : 'Bu hafta raporunu öğretmeninle paylaş ve hangi konulardan başlaman gerektiğini birlikte seçin.',
        fromResult: false,
      };
    }
    return { title: t.extraWeeks[notRead ? 1 : i].title, text: pick(t.extraWeeks[notRead ? 1 : i].text, a), fromResult: false };
  };
  const second = week(0);
  const third = week(1);

  // 1. hafta yanlış soruların (ya da hepsi doğruysa bir adım ilerinin) haftasıdır: sonuca göre seçilir. Sonuç
  // yorumlanmadıysa her zaman hata defteridir (genel öneri).
  const weeks = [
    {
      label: '1. hafta',
      title: missed ? 'Hata defteri' : 'Bir adım ileri',
      // Hatanın nedeni yalnızca yanlış cevap varsa ve cevaplar tahmin değilse sorulur.
      text: missed ? `${pick(t.firstWeek.wrong, a)}${ac.wrong > 0 && !ac.guessed ? ` ${pick(t.firstWeek.reason, a)}` : ''}` : pick(t.firstWeek.none, a),
      fromResult: !notRead,
    },
    { label: '2. hafta', ...second },
    { label: '3. hafta', ...third },
    { label: '4. hafta', title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextStep(opts.next, t.nextPurpose, parent), fromResult: false },
  ];
  const contents = [
    parent ? 'konu alanlarına göre nasıl çalışılabileceği' : 'konu alanlarına göre nasıl çalışabileceğin',
    'haftalık çalışma düzeni',
    ...(parent ? ['evde nasıl destek olabileceğiniz'] : []),
    'dört haftalık küçük adımlar',
  ];

  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölümde sonuçları çocuğunuzun derslerine taşımak için öneriler var: ${joinNames(contents)}. Öneriler öğretmenin planının yerine geçmez; onunla birlikte kullanın.${caution}`
      : `Bu bölümde sonuçlarını derslerine taşıman için öneriler var: ${joinNames(contents)}. Öneriler öğretmeninin planının yerine geçmez; onunla birlikte kullan.${caution}`,
    bars: (notRead ? [] : domains).map((d) => ({
      key: d.key,
      label: d.name,
      value: d.correct,
      min: 0,
      max: d.n,
      ciLow: null,
      ciHigh: null,
      color: t.colors[d.key] ?? '#5b6b82',
      valueLabel: `${d.correct} / ${d.n}`,
      band: d.bandLabel,
    })),
    standout: [
      {
        title: 'Genel sonuç',
        text: notRead ? `${ac.correct} / ${ac.n} doğru; yorumlanmadı` : `${ac.correct} / ${ac.n} doğru`,
        keys: ['overall'],
        ...(overall ? { graphic: overall } : {}),
      },
      ...groups,
    ],
    standoutNote: null,
    study: {
      title: parent ? t.studyTitle.parent : t.studyTitle.you,
      intro: notRead
        ? parent
          ? 'Sonuç yorumlanmadığı için alanlar testteki sırayla verildi; hangisinden başlanacağını öğretmeniyle birlikte seçebilirsiniz. Her alanda yalnızca soru çözmek değil, konunun anlamını şekil, sayı doğrusu ya da gerçek nesnelerle görmek de önemlidir.'
          : 'Sonuç yorumlanmadığı için alanlar testteki sırayla verildi; hangisinden başlayacağını öğretmeninle birlikte seçebilirsin. Her alanda yalnızca soru çözmek değil, konunun anlamını şekil, sayı doğrusu ya da gerçek nesnelerle görmek de önemli.'
        : `${pick(t.studyIntro, a)}${
            ties
              ? parent
                ? ' Düzeyi aynı olan alanlar testteki sırayla verildi; hangisinden başlanacağını öğretmenle birlikte seçebilirsiniz.'
                : ' Düzeyi aynı olan alanlar testteki sırayla verildi; hangisinden başlayacağını öğretmeninle birlikte seçebilirsin.'
              : ''
          }`,
      items: sorted.map((d) => {
        const g = level(d.band);
        return {
          key: d.key,
          title: d.name,
          badge: notRead ? `Yorumlanmadı · ${d.correct} / ${d.n} doğru` : `${d.bandLabel} · ${d.correct} / ${d.n} doğru`,
          color: t.colors[d.key] ?? '#5b6b82',
          text: notRead ? `${notReadLead} ${pick(texts[d.key].need, a)}` : g === 'high' ? pick(t.solid[d.key], a) : `${pick(t.lead[g], a)} ${pick(texts[d.key].need, a)}`,
          // Kartın grafiği alanın soruları (raporun alan kartındakiyle aynı); yorumlanmayan sonuçta yok. Doğru sayısı rozette
          // okunduğu için sesli dinlemede yinelenmez.
          ...(notRead ? {} : { graphic: graphic(domainDots(d), [])! }),
        };
      }),
      links: t.links,
    },
    settings: {
      title: t.routine.title,
      intro: pick(t.routine.intro, a),
      items: parent ? t.routine.items.parent : t.routine.items.student,
      note: pick(t.routine.note, a),
    },
    // Bölümün grafiği önerilerin seçildiği alanların soruları: pekiştirilmeli ve öncelikli alanlar; hepsi sağlamsa öneriler bu
    // yüzden seçildiği için bütün alanlar (sesli dinlemede adları; doğru sayıları öneri kartlarında okundu). Sonuç
    // yorumlanmadıysa, öneriler bölümündeki gibi, bütün alanların önerileri testteki sırayla ve başta öğretmenle konuşma
    // önerisi; "hepsi sağlam" önerileri verilmez, grafik yoktur.
    approach: parent
      ? notRead
        ? {
            title: 'Evde nasıl destek olabilirsiniz?',
            items: [
              {
                title: 'Önce öğretmeniyle konuşun',
                text: ac.guessed
                  ? 'Cevapların bir kısmı tahmin olabileceği için alanların düzeyi belirlenemedi. Hangi alandan başlanacağını öğretmeniyle birlikte seçin; aşağıda her alan için öneriler var.'
                  : 'Bütün sorularda “Bilmiyorum” denildiği için alanların düzeyi belirlenemedi. Hangi alandan başlanacağını öğretmeniyle birlikte seçin; aşağıda her alan için öneriler var.',
              },
              ...domains.map((d) => ({ title: d.name, text: texts[d.key].approach, keys: [d.key] })),
            ],
          }
        : {
            title: 'Evde nasıl destek olabilirsiniz?',
            items: need.length ? need.map((d) => ({ title: d.name, text: texts[d.key].approach, keys: [d.key] })) : t.approachSolid,
            keys: (need.length ? need : domains).map((d) => d.key),
            graphic: basisCaption(
              graphic(need.length === 1 ? domainDots(need[0]) : domainsDots('Konu alanları', need.length ? need : domains)),
              need.length !== 1,
              (need.length ? need : domains).map((d) => d.name),
            )!,
          }
      : null,
    weeks,
    weeksGraphic: weeksGraphic(weeks, parent),
    sources: t.sources,
  };
}
