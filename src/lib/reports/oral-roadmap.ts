import { LEVEL_TEXT, prosodyLabel } from '@/content/reports/sesli-okuma';
import type { OralAspect, OralRoadmapTemplate } from '@/content/roadmaps/sesli-okuma';
import type { OralResult } from '@/lib/scoring/oral';
import type { Audience } from './build';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * Sesli Okuma Değerlendirmesinin gelişim yol haritası: okumanın dört yönüne (doğru okuma, akıcılık, anlama, yeniden
 * anlatma) göre nasıl çalışılacağı, okuma alışkanlığı, veliye yaklaşım ve dört haftalık plan. Yönler en çok çalışılacak
 * olandan başlayarak sıralanır (oranı düşük olan önce, eşitlikte bu sırayla). Yeniden anlatma yapılmadıysa o yön yoktur.
 */

const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });

interface AspectState {
  key: OralAspect;
  /** 0–1 arası oran (sıralama için). */
  ratio: number;
  /** Bu yönde çalışmak öneriliyor mu? */
  need: boolean;
  badge: string;
  bar: { value: number; min: number; max: number; valueLabel: string; band: string };
}

export function oralAspects(r: OralResult): AspectState[] {
  const list: AspectState[] = [
    {
      key: 'accuracy',
      ratio: r.accuracyPct / 100,
      need: r.accuracyLevel !== 'easy',
      badge: `Doğru okuma %${nf1.format(r.accuracyPct)}`,
      bar: { value: r.accuracyPct, min: 0, max: 100, valueLabel: `%${nf1.format(r.accuracyPct)}`, band: LEVEL_TEXT[r.accuracyLevel].short },
    },
    {
      key: 'prosody',
      ratio: (r.prosody.total - 4) / 12,
      need: r.prosody.total < 13,
      badge: `${r.prosody.total} / 16`,
      bar: { value: r.prosody.total, min: 4, max: 16, valueLabel: `${r.prosody.total} / 16`, band: prosodyLabel(r.prosody.total) },
    },
    {
      key: 'comprehension',
      ratio: r.comprehension.correct / r.comprehension.total,
      need: r.comprehension.level !== 'easy',
      badge: `${r.comprehension.total} sorudan ${r.comprehension.correct} doğru`,
      bar: {
        value: r.comprehension.correct,
        min: 0,
        max: r.comprehension.total,
        valueLabel: `${r.comprehension.correct} / ${r.comprehension.total}`,
        band: LEVEL_TEXT[r.comprehension.level].short,
      },
    },
  ];
  if (r.retell) {
    const n = r.retell.mentioned.length;
    list.push({
      key: 'retell',
      ratio: n / r.retell.total,
      need: r.retell.core < r.retell.coreTotal,
      badge: `${r.retell.total} fikirden ${n} tanesi`,
      bar: { value: n, min: 0, max: r.retell.total, valueLabel: `${n} / ${r.retell.total}`, band: '' },
    });
  }
  // Çalışılacak yönler önce, kendi içinde oranı düşük olan önce; eşitlikte yukarıdaki sıra korunur (sort kararlıdır).
  return [...list].sort((a, b) => Number(b.need) - Number(a.need) || a.ratio - b.ratio);
}

export function buildOralRoadmap(
  r: OralResult,
  audience: Audience,
  t: OralRoadmapTemplate,
  opts: { preview: boolean; next: NextTest[] },
): Roadmap {
  const parent = audience === 'parent';
  const aspects = oralAspects(r);
  const need = aspects.filter((x) => x.need);
  const group = r.level === 'hard' ? 'low' : r.level === 'support' ? 'average' : 'high';

  const contents = [
    parent ? 'okumanın yönlerine göre nasıl çalışılabileceği' : 'okumanın yönlerine göre nasıl çalışabileceğin',
    'okuma alışkanlığı için öneriler',
    ...(parent ? ['ona nasıl destek olabileceğiniz'] : []),
    'dört haftalık küçük adımlar',
  ];
  const second = need[0] ? { title: t.aspects[need[0].key].title, text: pick(t.aspects[need[0].key].action, audience) } : { title: t.extraWeek.title, text: pick(t.extraWeek.text, audience) };
  const third = need[1]
    ? { title: t.aspects[need[1].key].title, text: pick(t.aspects[need[1].key].action, audience) }
    : { title: t.thirdWeek[r.level].title, text: pick(t.thirdWeek[r.level].text, audience) };
  const last = r.level === 'easy' && r.passageGrade < 8 ? t.lastWeek.up : t.lastWeek.same;

  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük okumaya taşımanız için öneriler içerir: ${joinNames(contents)}. Öneriler tek bir metnin sesli okunmasına dayanır; kesin hüküm değildir.`
      : `Bu bölüm sonuçlarını günlük okumana taşıman için öneriler içerir: ${joinNames(contents)}. Öneriler tek bir metnin sesli okunmasına dayanır; kesin hüküm değildir.`,
    bars: aspects.map((x) => ({ key: x.key, label: t.aspects[x.key].title, ciLow: null, ciHigh: null, color: t.aspects[x.key].color, ...x.bar })),
    standout: [
      { title: 'Metnin düzeyi', text: LEVEL_TEXT[r.level].label },
      { title: 'Dakikada doğru okunan kelime', text: String(r.wcpm) },
      ...(need[0] ? [{ title: parent ? 'Öncelikli çalışma' : 'Önce bunu çalış', text: t.aspects[need[0].key].title }] : []),
    ],
    standoutNote: null,
    study: {
      title: parent ? 'Okumanın yönlerine göre nasıl çalışılabilir?' : 'Okumanın yönlerine göre nasıl çalışabilirsin?',
      intro: parent
        ? 'Kartlar en çok çalışılacak yönden başlayarak sıralandı. Her biri tek bir metne dayandığı için yaklaşık bir fikir verir.'
        : 'Kartlar en çok çalışacağın yönden başlayarak sıralandı. Her biri tek bir metne dayandığı için yaklaşık bir fikir verir.',
      items: aspects.map((x) => ({
        key: x.key,
        title: t.aspects[x.key].title,
        badge: x.badge,
        color: t.aspects[x.key].color,
        text: pick(x.need ? t.aspects[x.key].need : t.aspects[x.key].full, audience),
      })),
      links: [{ label: 'Okuma hızı mı, okuduğunu anlama mı?', href: '/rehber/okuma-hizi-ve-okudugunu-anlama' }],
    },
    settings: {
      title: t.habits.title,
      intro: pick(t.habits.intro, audience),
      items: parent ? t.habits.items.parent : t.habits.items.student,
      note: pick(t.habits.note, audience),
    },
    approach: parent ? { title: 'Çocuğunuza nasıl destek olabilirsiniz?', items: t.approach[group] } : null,
    weeks: [
      { label: '1. hafta', title: 'Birlikte okuma', text: pick(t.firstWeek, audience) },
      { label: '2. hafta', title: second.title, text: second.text },
      { label: '3. hafta', title: third.title, text: third.text },
      { label: '4. hafta', title: 'Yeniden değerlendirme', text: pick(last, audience) + nextStep(opts.next, t.nextPurpose, parent) },
    ],
    sources: t.sources,
  };
}
