import { LEVEL_TEXT, prosodyLabel } from '@/content/reports/sesli-okuma';
import type { OralAspect, OralRoadmapTemplate } from '@/content/roadmaps/sesli-okuma';
import type { OralReadingInstrument } from '@/lib/instruments/types';
import type { OralLevel, OralResult } from '@/lib/scoring/oral';
import { countOf } from '@/lib/scoring/tasks';
import type { Audience } from './build';
import { levelText, oralVisuals } from './oral';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';
import { basisCaption, graphic, weeksGraphic, type RoadmapGraphic } from './roadmap-graphics';
import type { StepsVisual } from './visuals';

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

/** Metnin düzeyinin basamakları (kolaydan zora değil, metnin okura uygunluğuna göre: şimdilik zor, destekle, rahat). */
const LEVEL_ORDER: OralLevel[] = ['hard', 'support', 'easy'];

export function buildOralRoadmap(
  r: OralResult,
  audience: Audience,
  t: OralRoadmapTemplate,
  opts: { preview: boolean; next: NextTest[]; grade: number; def: OralReadingInstrument },
): Roadmap {
  const parent = audience === 'parent';
  const aspects = oralAspects(r);
  const need = aspects.filter((x) => x.need);
  // Grafikler raporun kartlarındakiyle aynıdır (lib/reports/oral.ts). Metnin düzeyi, doğru okuma ile anlamanın düşük olanıdır:
  // üç basamakta gösterilir.
  const v = oralVisuals(r, audience, opts.def, opts.grade);
  const nf = (x: number) => nf0.format(x);
  // Kartta rozet değeri zaten söylüyorsa ("5 sorudan 2 doğru") grafiğin sözlü anlatımı yinelenmez; akıcılıkta dört yön okunur.
  const aspectGraphic = (key: OralAspect, inCard: boolean): RoadmapGraphic | undefined => graphic(v[key], inCard && key === 'comprehension' ? [] : undefined);
  // Doğru okuyup iyi anlayan ama akıcılığı gelişen öğrenci (raporda "Doğru okuyor, akıcılığı gelişiyor"): basamaklarda doğru
  // okuma ve anlamanın düzeyi (rahat) gösterilir, işaretin adı ve alttaki açıklama akıcılığın geliştiğini söyler; öneriler
  // "rahat okuyor" önerileri değildir (daha zor metinlere geçmekte acele edilmez).
  const fluencyEasy = r.level === 'easy' && r.flags.fluencyConcern;
  const levelSteps: StepsVisual = {
    type: 'steps',
    label: 'Metnin düzeyi',
    steps: LEVEL_ORDER.map((l) => LEVEL_TEXT[l].short),
    reached: LEVEL_ORDER.indexOf(r.level) + 1,
    valueLabel: levelText(r).short,
    caption: fluencyEasy ? 'Doğru okuma ve anlama rahat; akıcılık gelişiyor' : 'Doğru okuma ve anlama sonuçlarının düşük olanı',
  };
  const levelWhy = fluencyEasy
    ? 'Doğru okuma ve anlama rahat düzeyde; okuma yavaş ya da yer yer kesik olduğu için akıcılık gelişiyor.'
    : 'Düzeyi, doğru okuma ve anlama sonuçlarının düşük olanı belirler.';
  // Kısacada düzeyin adı satırda okunur; grafiğin sözlü anlatımı düzeyin nasıl belirlendiği.
  const level = graphic(levelSteps, [levelWhy])!;
  // Dakikada doğru okunan kelime satırda okunur; grafiğin sözlü anlatımı bütün kelimeler ve (varsa) sınıf ortalaması.
  const ref = v.rate?.type === 'bars' ? v.rate.reference : undefined;
  const rate = r.flags.tooFast
    ? undefined
    : graphic(v.rate, [`Dakikada okunan bütün kelime: ${nf(r.wpm)}.`, ...(ref ? [`${ref.label}: ${nf(ref.value)}.`] : [])]);
  const group = r.level === 'hard' ? 'low' : r.level === 'support' || fluencyEasy ? 'average' : 'high';

  const contents = [
    parent ? 'okumanın yönlerine göre nasıl çalışılabileceği' : 'okumanın yönlerine göre nasıl çalışabileceğin',
    'okuma alışkanlığı için öneriler',
    ...(parent ? ['ona nasıl destek olabileceğiniz'] : []),
    'dört haftalık küçük adımlar',
  ];
  // Doğru ve anlayarak okuyup okuması yavaş ya da akıcı olmayan öğrenci: tekrarlı okuma haftası, bir üst düzey önerilmez.
  const fluency = r.flags.fluencyConcern;
  const fluencyWeek = { title: t.fluencyWeek.title, text: pick(t.fluencyWeek.text, audience) };
  const extraWeek = { title: t.extraWeek.title, text: pick(t.extraWeek.text, audience) };
  const second = need[0]
    ? { title: t.aspects[need[0].key].title, text: pick(t.aspects[need[0].key].action, audience) }
    : fluency
      ? fluencyWeek
      : extraWeek;
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
  // Haftaların hepsi okumanın sonucundan seçilir; yalnızca 1. hafta (birlikte okuma) ve hiçbir yön çalışma gerektirmediğinde
  // 2. hafta (ek deneme) herkes için aynıdır. 4. hafta metnin düzeyine göre (bir üst, bir alt ya da aynı düzey).
  const weeks = [
    { label: '1. hafta', title: 'Birlikte okuma', text: pick(t.firstWeek, audience), fromResult: false },
    { label: '2. hafta', ...second, fromResult: second !== extraWeek },
    { label: '3. hafta', ...third, fromResult: true },
    { label: '4. hafta', title: 'Yeniden değerlendirme', text: pick(last, audience) + nextStep(opts.next, t.nextPurpose, parent), fromResult: true },
  ];
  // Veli ve öğretmen raporu öğrenciden üçüncü kişi olarak söz eder.
  const whose = parent ? 'öğrencinin sonucuna' : undefined;

  // Otomatik analizde öneriler yapay zekânın yaklaşık sonuçlarına dayanır; bu, girişte söylenir.
  const basis = r.flags.auto ? pick(t.autoBasis, audience) : 'Öneriler tek bir metnin sesli okunmasına dayanır; kesin hüküm değildir.';
  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük okumaya taşımanız için öneriler içerir: ${joinNames(contents)}. ${basis}`
      : `Bu bölüm sonuçlarını günlük okumana taşıman için öneriler içerir: ${joinNames(contents)}. ${basis}`,
    bars: aspects.map((x) => ({ key: x.key, label: t.aspects[x.key].title, ciLow: null, ciHigh: null, color: t.aspects[x.key].color, ...x.bar })),
    standout: [
      { title: 'Metnin düzeyi', text: parent ? levelText(r).label : levelText(r).you, keys: ['level'], graphic: level },
      // Süre metne göre çok kısaysa hız hesaplanmaz (raporda da gösterilmez).
      ...(r.flags.tooFast ? [] : [{ title: 'Dakikada doğru okunan kelime', text: nf0.format(r.wcpm), keys: ['rate'], ...(rate ? { graphic: rate } : {}) }]),
      ...(need[0]
        ? [
            (() => {
              const g = aspectGraphic(need[0].key, false);
              return { title: parent ? 'Öncelikli çalışma' : 'Önce bunu çalış', text: t.aspects[need[0].key].title, keys: [need[0].key], ...(g ? { graphic: g } : {}) };
            })(),
          ]
        : []),
    ],
    standoutNote: null,
    study: {
      title: parent ? 'Okumanın yönlerine göre nasıl çalışılabilir?' : 'Okumanın yönlerine göre nasıl çalışabilirsin?',
      intro: parent
        ? 'Kartlar en çok çalışılacak yönden başlayarak sıralandı. Her biri tek bir metne dayandığı için yaklaşık bir fikir verir.'
        : 'Kartlar en çok çalışacağın yönden başlayarak sıralandı. Her biri tek bir metne dayandığı için yaklaşık bir fikir verir.',
      items: aspects.map((x) => {
        const g = aspectGraphic(x.key, true);
        return {
          key: x.key,
          title: t.aspects[x.key].title,
          badge: x.badge,
          color: t.aspects[x.key].color,
          text: pick(x.need ? t.aspects[x.key].need : t.aspects[x.key].full, audience),
          ...(g ? { graphic: g } : {}),
        };
      }),
      links: [{ label: 'Okuma hızı mı, okuduğunu anlama mı?', href: '/rehber/okuma-hizi-ve-okudugunu-anlama' }],
    },
    settings: {
      title: t.habits.title,
      intro: pick(t.habits.intro, audience),
      items: parent ? t.habits.items.parent : t.habits.items.student,
      note: pick(t.habits.note, audience),
    },
    // Veliye öneriler metnin düzeyine göre seçilir: bölümün grafiği metnin düzeyi (sesli dinlemede adı; düzey Kısaca'da okundu).
    approach: parent
      ? { title: 'Çocuğunuza nasıl destek olabilirsiniz?', items: t.approach[group], keys: ['level'], graphic: basisCaption(level, false, ['Metnin düzeyi'])! }
      : null,
    weeks,
    weeksGraphic: weeksGraphic(weeks, parent, whose),
    sources: t.sources,
  };
}
