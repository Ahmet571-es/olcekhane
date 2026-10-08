import type { TaskRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * Zihinsel görevlerin gelişim yol haritası: becerinin günlük hayatta nerede kullanıldığı ve o işleri kolaylaştıran
 * yollar. Görevlerde Türkiye normu olmadığı ve tek oturumluk sonuçlar güvenilir bir düzey sınıflaması vermediği için
 * öneriler sonuca göre değişmez; "Kısaca" bölümü raporun kendi kartlarının başlıklarını özetler. Puanı yükseltmeyi ya da
 * beyni çalıştırmayı vaat etmez. Üç boyutlu grafik yalnızca sonuçları aynı birimde olan görevlerde vardır (şekil akıl
 * yürütmede ve sayı dizilerinde kural türlerine, sözel akıl yürütmede soru türlerine göre doğru cevap oranı); öteki görevlerde
 * sonuçlar farklı birimlerde olduğu için yoktur.
 */
export function buildTaskRoadmap(r: ReportContent, t: TaskRoadmapTemplate, opts: { preview: boolean; next: NextTest[] }): Roadmap | undefined {
  const blocks = r.cognitive?.blocks ?? [];
  if (blocks.length === 0) return undefined;
  const a = r.audience;
  const parent = a === 'parent';
  const contents = [pick(t.what, a), 'bilmekte yarar olanlar', ...(parent ? ['ona nasıl yaklaşabileceğiniz'] : []), 'dört haftalık küçük adımlar'];

  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük hayata taşımanız için öneriler içerir: ${joinNames(contents)}. Öneriler puanı yükseltmek için değil, bu becerinin gerektiği işleri kolaylaştırmak içindir.`
      : `Bu bölüm sonuçlarını günlük hayata taşıman için öneriler içerir: ${joinNames(contents)}. Öneriler puanı yükseltmek için değil, bu becerinin gerektiği işleri kolaylaştırmak içindir.`,
    bars: (r.cognitive?.profile?.bars ?? []).map((b) => ({ ...b, ciLow: null, ciHigh: null })),
    ...(r.cognitive?.profile ? { barsTitle: r.cognitive.profile.title, barsNote: r.cognitive.profile.note } : {}),
    standout: blocks.map((b) => ({ title: b.name, text: b.headline })),
    standoutNote: null,
    study: {
      title: parent ? t.studyTitle.parent : t.studyTitle.you,
      intro: pick(t.studyIntro, a),
      items: t.supports.map((s) => ({ key: s.key, title: s.title, badge: s.tag, color: s.color, text: pick(s.text, a) })),
      links: t.links,
    },
    settings: {
      title: t.facts.title,
      intro: pick(t.facts.intro, a),
      items: parent ? t.facts.items.parent : a === 'adult' ? (t.facts.items.adult ?? t.facts.items.student) : t.facts.items.student,
      note: pick(t.facts.note, a),
    },
    approach: parent ? { title: 'Çocuğunuza nasıl yaklaşabilirsiniz?', items: t.approach } : null,
    weeks: [
      ...t.weeks.map((w, i) => ({ label: `${i + 1}. hafta`, title: w.title, text: pick(w.text, a) })),
      { label: '4. hafta', title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextStep(opts.next, t.nextPurpose, parent) },
    ],
    sources: t.sources,
  };
}
