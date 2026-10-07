import type { ReadingPace, ReadingRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { bandGroup, joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * Okuma Hızı ve Anlama testinin gelişim yol haritası: soru türlerine (okuma becerilerine) göre nasıl çalışılacağı,
 * hız ile anlamanın dengesi, okuma alışkanlığı için öneriler ve dört haftalık plan. Beceriler en çok zorlanılandan
 * başlayarak sıralanır (doğru oranı düşük olan önce, eşitlikte testteki sıra). Her beceri bir ile üç soruyla ölçüldüğü
 * için rozet yalnızca sayıyı söyler; düzey adı verilmez. Tek bir kısa metne dayandığı için kesin hüküm verilmez.
 */
export function buildReadingRoadmap(r: ReportContent, t: ReadingRoadmapTemplate, opts: { preview: boolean; next: NextTest[] }): Roadmap | undefined {
  const rd = r.reading;
  const section = r.sections.find((s) => s.scaleKey === 'comprehension');
  if (!rd || !section) return undefined;
  const a = r.audience;
  const parent = a === 'parent';
  const skills = rd.skills.filter((s) => t.skills[s.key] && s.total > 0);
  const ratio = (s: (typeof skills)[number]) => s.correct / s.total;
  const sorted = [...skills].sort((x, y) => ratio(x) - ratio(y));
  const need = sorted.filter((s) => s.correct < s.total);
  const group = bandGroup(section.band) ?? 'average';
  const pace: ReadingPace = rd.tooFast ? 'rush' : group === 'high' ? 'extend' : 'build';
  const badge = (s: (typeof skills)[number]) =>
    s.total === 1
      ? s.correct
        ? 'Tek soru, doğru'
        : 'Tek soru, yanlış'
      : s.correct === s.total
        ? `${s.total} sorunun hepsi doğru`
        : `${s.total} sorudan ${s.correct} doğru`;

  const second = need[0]
    ? { title: need[0].label, text: pick(t.skills[need[0].key].action, a) }
    : { title: t.extraWeek.title, text: pick(t.extraWeek.text, a) };
  const third = t.pace[pace].week;

  const contents = [
    parent ? 'okuma becerilerine göre nasıl çalışılabileceği' : 'okuma becerilerine göre nasıl çalışabileceğin',
    'okuma alışkanlığı için öneriler',
    ...(parent ? ['ona nasıl destek olabileceğiniz'] : []),
    'dört haftalık küçük adımlar',
  ];

  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük okumaya taşımanız için öneriler içerir: ${joinNames(contents)}. Öneriler tek bir kısa metne dayanır; kesin hüküm değildir.`
      : `Bu bölüm sonuçlarını günlük okumana taşıman için öneriler içerir: ${joinNames(contents)}. Öneriler tek bir kısa metne dayanır; kesin hüküm değildir.`,
    bars: skills.map((s) => ({
      key: s.key,
      label: s.label,
      value: s.correct,
      min: 0,
      max: s.total,
      ciLow: null,
      ciHigh: null,
      color: t.skills[s.key].color,
      valueLabel: `${s.correct} / ${s.total}`,
      band: s.correct === s.total ? 'hepsi doğru' : '',
    })),
    standout: [
      { title: 'Anlama', text: section.summary || section.bandLabel },
      { title: 'Okuma hızı', text: `Dakikada ${rd.wpm} kelime` },
      ...(need[0] && ratio(need[0]) < 0.5 ? [{ title: 'En çok zorlanılan soru türü', text: need[0].label }] : []),
    ],
    standoutNote: null,
    study: {
      title: parent ? t.studyTitle.parent : t.studyTitle.you,
      intro: pick(t.studyIntro, a),
      items: [
        ...sorted.map((s) => ({
          key: s.key,
          title: s.label,
          badge: badge(s),
          color: t.skills[s.key].color,
          text: pick(s.correct === s.total ? t.skills[s.key].full : t.skills[s.key].need, a),
        })),
        { key: 'pace', title: 'Hız ve anlama', badge: `Dakikada ${rd.wpm} kelime`, color: '#5b6b82', text: pick(t.pace[pace].text, a) },
      ],
      links: t.links,
    },
    settings: {
      title: t.habits.title,
      intro: pick(t.habits.intro, a),
      items: parent ? t.habits.items.parent : t.habits.items.student,
      note: pick(t.habits.note, a),
    },
    approach: parent ? { title: 'Çocuğunuza nasıl destek olabilirsiniz?', items: t.approach[group] } : null,
    weeks: [
      { label: '1. hafta', title: 'Okuma günlüğü', text: pick(t.firstWeek, a) },
      { label: '2. hafta', title: second.title, text: second.text },
      { label: '3. hafta', title: third.title, text: pick(third.text, a) },
      { label: '4. hafta', title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextStep(opts.next, t.nextPurpose, parent) },
    ],
    sources: t.sources,
  };
}
