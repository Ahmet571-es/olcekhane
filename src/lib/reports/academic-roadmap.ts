import type { AcademicRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { cautionText } from './reading-roadmap';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

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

  // Kısaca: genel sonuç ve düzeylerine göre alanlar (öncelikli, pekiştirilmeli, sağlam).
  const groups = (notRead ? [] : (['low', 'average', 'high'] as const))
    .map((g) => domains.filter((d) => level(d.band) === g))
    .filter((ds) => ds.length > 0)
    // Alan adlarında virgül ve "ve" geçtiği için (ör. "Kesirler, ondalık gösterim ve yüzde") noktalı virgülle ayrılır.
    .map((ds) => ({ title: ds[0].bandLabel, text: ds.map((d) => d.name).join('; ') }));

  const week = (i: 0 | 1) => {
    const d = need[i];
    if (d) return { title: d.name, text: pick(texts[d.key].action, a) };
    // Sonuç yorumlanmadıysa ikinci hafta öğretmenle hangi konulardan başlanacağı konuşulur.
    if (notRead && i === 0) {
      return {
        title: parent ? 'Öğretmenle konuşmak' : 'Öğretmenle konuş',
        text: parent
          ? 'Bu hafta raporu matematik öğretmeniyle paylaşın ve hangi konulardan başlanacağını birlikte seçin.'
          : 'Bu hafta raporunu öğretmeninle paylaş ve hangi konulardan başlaman gerektiğini birlikte seçin.',
      };
    }
    return { title: t.extraWeeks[notRead ? 1 : i].title, text: pick(t.extraWeeks[notRead ? 1 : i].text, a) };
  };
  const second = week(0);
  const third = week(1);

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
    standout: [{ title: 'Genel sonuç', text: notRead ? `${ac.correct} / ${ac.n} doğru; yorumlanmadı` : `${ac.correct} / ${ac.n} doğru` }, ...groups],
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
    approach: parent
      ? {
          title: 'Evde nasıl destek olabilirsiniz?',
          items: need.length ? need.map((d) => ({ title: d.name, text: texts[d.key].approach })) : t.approachSolid,
        }
      : null,
    weeks: [
      {
        label: '1. hafta',
        title: missed ? 'Hata defteri' : 'Bir adım ileri',
        // Hatanın nedeni yalnızca yanlış cevap varsa ve cevaplar tahmin değilse sorulur.
        text: missed ? `${pick(t.firstWeek.wrong, a)}${ac.wrong > 0 && !ac.guessed ? ` ${pick(t.firstWeek.reason, a)}` : ''}` : pick(t.firstWeek.none, a),
      },
      { label: '2. hafta', title: second.title, text: second.text },
      { label: '3. hafta', title: third.title, text: third.text },
      { label: '4. hafta', title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextStep(opts.next, t.nextPurpose, parent) },
    ],
    sources: t.sources,
  };
}
