import { LEVEL_TEXT, prosodyLabel } from '@/content/reports/sesli-okuma';
import type { OralAspect, OralRoadmapTemplate } from '@/content/roadmaps/sesli-okuma';
import type { OralResult } from '@/lib/scoring/oral';
import { countOf } from '@/lib/scoring/tasks';
import type { Audience } from './build';
import { levelText } from './oral';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * Sesli Okuma Değerlendirmesinin gelişim yol haritası: okumanın dört yönüne (doğru okuma, akıcılık, anlama, yeniden
 * anlatma) göre nasıl çalışılacağı, okuma alışkanlığı, veliye yaklaşım ve dört haftalık plan. Çalışılacak yönler önce
 * gelir; aralarında öncelik, metnin düzeyini belirleyen ölçütlerindir: önce doğru okuma (kelimeleri çözmek anlamanın
 * temelidir; Gough ve Tunmer, 1986), sonra anlama, sonra akıcılık, en son yeniden anlatma. Yeniden anlatma yapılmadıysa o
 * yön yoktur; otomatik analizde akıcılık derecelendirilmediği için akıcılık yönü de yoktur.
 */

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
/** Çalışılacak yönler arasında öncelik (küçük önce). */
const PRIORITY: Record<OralAspect, number> = { accuracy: 0, comprehension: 1, prosody: 2, retell: 3 };
// Doğru okuma oranı aşağı yuvarlanarak gösterilir: düzey yuvarlanmamış değere göre verildiği için %96,99 "%97" görünüp
// "destekle" yazmasın.
const accText = (x: number) => nf1.format(Math.floor(x * 10 + 1e-9) / 10);

interface AspectState {
  key: OralAspect;
  /** Bu yönde çalışmak öneriliyor mu? */
  need: boolean;
  badge: string;
  bar: { value: number; min: number; max: number; valueLabel: string; band: string };
}

export function oralAspects(r: OralResult): AspectState[] {
  const p = r.prosody;
  const list: AspectState[] = [
    {
      key: 'accuracy',
      need: r.accuracyLevel !== 'easy',
      badge: `Doğru okuma %${accText(r.accuracyPct)}`,
      bar: { value: r.accuracyPct, min: 0, max: 100, valueLabel: `%${accText(r.accuracyPct)}`, band: LEVEL_TEXT[r.accuracyLevel].short },
    },
    ...(p
      ? [
          {
            key: 'prosody' as const,
            need: p.total < 13,
            badge: `${p.total} / 16`,
            bar: { value: p.total, min: 4, max: 16, valueLabel: `${p.total} / 16`, band: prosodyLabel(p.total) },
          },
        ]
      : []),
    {
      key: 'comprehension',
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
      need: r.retell.core < r.retell.coreTotal,
      badge: `${r.retell.total} fikrin ${countOf(n, r.retell.total, 'i')}`,
      bar: { value: n, min: 0, max: r.retell.total, valueLabel: `${n} / ${r.retell.total}`, band: '' },
    });
  }
  // Çalışılacak yönler önce; kendi aralarında ve ötekiler arasında PRIORITY sırası.
  return [...list].sort((a, b) => Number(b.need) - Number(a.need) || PRIORITY[a.key] - PRIORITY[b.key]);
}

export function buildOralRoadmap(
  r: OralResult,
  audience: Audience,
  t: OralRoadmapTemplate,
  opts: { preview: boolean; next: NextTest[]; grade: number },
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
  // Doğru ve anlayarak okuyup okuması yavaş ya da akıcı olmayan öğrenci: tekrarlı okuma haftası, bir üst düzey önerilmez.
  const fluency = r.flags.fluencyConcern;
  const fluencyWeek = { title: t.fluencyWeek.title, text: pick(t.fluencyWeek.text, audience) };
  const second = need[0]
    ? { title: t.aspects[need[0].key].title, text: pick(t.aspects[need[0].key].action, audience) }
    : fluency
      ? fluencyWeek
      : { title: t.extraWeek.title, text: pick(t.extraWeek.text, audience) };
  const levelKey = fluency && r.level === 'easy' ? 'support' : r.level;
  // Metin zorsa üçüncü hafta her zaman kolay metinlerle çalışmadır (raporun önerisiyle aynı).
  const third = r.level === 'hard'
    ? { title: t.thirdWeek.hard.title, text: pick(t.thirdWeek.hard.text, audience) }
    : need[1]
    ? { title: t.aspects[need[1].key].title, text: pick(t.aspects[need[1].key].action, audience) }
    : fluency && second !== fluencyWeek
      ? fluencyWeek
      : { title: t.thirdWeek[levelKey].title, text: pick(t.thirdWeek[levelKey].text, audience) };
  // Dördüncü hafta raporun "Sonraki değerlendirme" önerisiyle aynıdır (lib/reports/oral.ts, nextText). Öğrenci yalnızca
  // kendi sınıfının ve bir alt, bir üst sınıfın metinlerini seçebilir: seçebileceği metin yoksa o düzey önerilmez. Okuma
  // metin bitmeden durduysa ya da kelimelerin çoğu net anlaşılamadıysa aynı düzeyden başka bir metin önerilir.
  const settled = !r.flags.unfinished && !r.flags.unclearHigh;
  const last =
    settled && r.level === 'easy' && !fluency && r.passageGrade < Math.min(8, opts.grade + 1)
      ? t.lastWeek.up
      : settled && r.level === 'hard' && r.passageGrade > Math.max(1, opts.grade - 1)
        ? t.lastWeek.down
        : t.lastWeek.same;

  // Otomatik analizde öneriler yapay zekânın yaklaşık sonuçlarına dayanır; bu, girişte söylenir.
  const basis = r.flags.auto ? pick(t.autoBasis, audience) : 'Öneriler tek bir metnin sesli okunmasına dayanır; kesin hüküm değildir.';
  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük okumaya taşımanız için öneriler içerir: ${joinNames(contents)}. ${basis}`
      : `Bu bölüm sonuçlarını günlük okumana taşıman için öneriler içerir: ${joinNames(contents)}. ${basis}`,
    bars: aspects.map((x) => ({ key: x.key, label: t.aspects[x.key].title, ciLow: null, ciHigh: null, color: t.aspects[x.key].color, ...x.bar })),
    standout: [
      { title: 'Metnin düzeyi', text: parent ? levelText(r).label : levelText(r).you },
      // Süre metne göre çok kısaysa hız hesaplanmaz (raporda da gösterilmez).
      ...(r.flags.tooFast ? [] : [{ title: 'Dakikada doğru okunan kelime', text: nf0.format(r.wcpm) }]),
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
