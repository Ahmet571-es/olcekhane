import type { AudienceText, BandGroup, RoadmapTemplate } from '@/content/roadmaps/types';
import type { Band } from '@/lib/instruments/types';
import type { Audience, ReportContent } from './build';

/**
 * Gelişim yol haritası: raporun sonundaki öneri bölümleri. Puanlardan ve şablondaki metinlerden kurulur; hiçbir şey
 * saklanmaz. Öneri niteliğindedir: tanı koymaz, kesin hüküm vermez, meslek seçmez.
 */

export interface RoadmapBar {
  key: string;
  label: string;
  value: number | null;
  min: number;
  max: number;
  ciLow: number | null;
  ciHigh: number | null;
  color: string;
  valueLabel: string;
  band: string;
}

export interface Roadmap {
  /** Uzman incelemesinde: yalnızca önizleme bağlantısıyla gösterilir. */
  preview: boolean;
  intro: string;
  bars: RoadmapBar[];
  standout: { title: string; text: string }[];
  /** Hiçbir boyut belirgin biçimde öne çıkmıyorsa gösterilen cümle. */
  standoutNote: string | null;
  study: {
    title: string;
    intro: string;
    items: { key: string; title: string; badge: string; color: string; text: string }[];
    links: { label: string; href: string }[];
  };
  settings: { title: string; intro: string; items: string[]; note: string };
  /** Yalnızca veli raporunda. */
  approach: { title: string; items: { title: string; text: string }[] } | null;
  weeks: { label: string; title: string; text: string }[];
  sources: { text: string; url?: string }[];
}

/** Yol haritasının son haftasında önerilecek test (kişinin sınıfına uyan, yayındaki bir test). */
export interface NextTest {
  name: string;
  href: string;
}

export function bandGroup(band: Band | null): BandGroup | null {
  if (band === null) return null;
  if (band === 'very_low' || band === 'low') return 'low';
  if (band === 'high' || band === 'very_high') return 'high';
  return 'average';
}

export function pick(t: AudienceText, audience: Audience): string {
  if (audience === 'parent') return t.parent;
  if (audience === 'adult') return t.adult ?? t.student;
  return t.student;
}

/** "Ayrıntılı Kişilik Profili ve Meslek İlgi Alanları" gibi. */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} ve ${names[names.length - 1]}`;
}

export function buildRoadmap(
  r: ReportContent,
  t: RoadmapTemplate,
  opts: { preview: boolean; next: NextTest[] },
): Roadmap {
  const a = r.audience;
  const parent = a === 'parent';
  const sections = r.sections.filter((s) => t.scales[s.scaleKey]);
  const mid = (s: (typeof sections)[number]) => (s.min + s.max) / 2;
  const distance = (s: (typeof sections)[number]) => (s.value === null ? -1 : Math.abs(s.value - mid(s)));

  const bars: RoadmapBar[] = sections.map((s) => ({
    key: s.scaleKey,
    label: s.name,
    value: s.value,
    min: s.min,
    max: s.max,
    ciLow: s.ciLow,
    ciHigh: s.ciHigh,
    color: t.scales[s.scaleKey].color,
    valueLabel: s.valueLabel,
    band: s.bandLabel,
  }));

  // Öne çıkanlar: ortadan en uzak, orta düzeyde olmayan en çok iki boyut.
  const notable = sections
    .filter((s) => {
      const g = bandGroup(s.band);
      return g !== null && g !== 'average';
    })
    .sort((x, y) => distance(y) - distance(x))
    .slice(0, 2);
  const standout = notable.map((s) => ({ title: s.name, text: s.summary }));
  const standoutNote =
    standout.length > 0
      ? null
      : parent
        ? 'Çocuğunuzun profili dengeli: hiçbir boyut belirgin biçimde öne çıkmıyor. Duruma göre farklı yönlerini kullanabiliyor.'
        : 'Profilin dengeli: hiçbir boyut belirgin biçimde öne çıkmıyor. Duruma göre farklı yönlerini kullanabiliyorsun.';

  const study = sections.flatMap((s) => {
    const g = bandGroup(s.band);
    if (!g) return [];
    return [
      {
        key: s.scaleKey,
        title: s.name,
        badge: `${s.bandLabel} · ${s.summary}`,
        color: t.scales[s.scaleKey].color,
        text: pick(t.scales[s.scaleKey].study[g], a),
      },
    ];
  });
  const stress = t.wellbeing ? sections.find((s) => s.scaleKey === t.wellbeing!.scale && bandGroup(s.band) === t.wellbeing!.group) : undefined;
  const links = [{ label: 'Etkili ders çalışma yöntemleri', href: '/rehber/etkili-ders-calisma-yontemleri' }];
  if (stress) links.push({ label: 'Sınav kaygısı', href: '/rehber/sinav-kaygisi' });

  const settingItems = sections.flatMap((s) => {
    const g = bandGroup(s.band);
    const text = g ? t.scales[s.scaleKey].settings[g] : undefined;
    return text ? [text] : [];
  });

  // Dört hafta: fark et → çalışma düzeni (ör. sorumluluk) → iyi oluş ya da en belirgin boyut → gözden geçir.
  const action = (key: string) => {
    const s = sections.find((x) => x.scaleKey === key);
    const g = s ? bandGroup(s.band) : null;
    return s && g ? { name: s.name, text: pick(t.scales[key].action[g], a) } : null;
  };
  const planning = action(t.planningScale);
  const thirdKey =
    stress?.scaleKey ??
    sections
      .filter((s) => s.scaleKey !== t.planningScale && s.value !== null)
      .sort((x, y) => distance(y) - distance(x))[0]?.scaleKey;
  const third = thirdKey ? action(thirdKey) : null;
  const nextNames = opts.next.map((n) => n.name);
  const nextSentence =
    nextNames.length === 0
      ? ''
      : parent
        ? ` Bir sonraki adım olarak çocuğunuzun ilgilerini görmek için ${joinNames(nextNames)} ${nextNames.length > 1 ? 'testlerini' : 'testini'} önerebilirsiniz.`
        : ` Bir sonraki adım olarak ilgilerini görmek için ${joinNames(nextNames)} ${nextNames.length > 1 ? 'testlerinden birini' : 'testini'} çözebilirsin.`;
  const weeks = [
    { label: '1. hafta', title: 'Fark et', text: pick(t.firstWeek, a) },
    ...(planning ? [{ label: '2. hafta', title: 'Çalışma düzeni', text: planning.text }] : []),
    ...(third ? [{ label: `${planning ? 3 : 2}. hafta`, title: third.name, text: third.text }] : []),
  ];
  weeks.push({ label: `${weeks.length + 1}. hafta`, title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextSentence });

  return {
    preview: opts.preview,
    intro: parent
      ? 'Bu bölüm sonuçları günlük hayata taşımanız için öneriler içerir: çocuğunuzun nasıl çalışabileceği, hangi ortamlarda rahat edebileceği, ona nasıl yaklaşabileceğiniz ve dört haftalık küçük adımlar. Öneriler bir tanı ya da kesin hüküm değildir; çocuğunuza uyanları birlikte seçin.'
      : 'Bu bölüm sonuçlarını günlük hayata taşıman için öneriler içerir: nasıl çalışabileceğin, hangi ortamlarda rahat edebileceğin ve dört haftalık küçük adımlar. Öneriler bir tanı ya da kesin hüküm değildir; sana uyanları seç.',
    bars,
    standout,
    standoutNote,
    study: {
      title: parent ? 'Çocuğunuz nasıl çalışabilir?' : 'Nasıl çalışabilirsin?',
      intro: pick(t.studyIntro, a),
      items: study,
      links,
    },
    settings: {
      title: a === 'adult' ? 'İş ve meslek planı için' : 'Okul ve meslek planı için',
      intro:
        settingItems.length === 0
          ? parent
            ? 'Çocuğunuzun profili dengeli olduğu için tek bir ortam öne çıkmıyor; farklı ortamlarda rahat edebilir.'
            : 'Profilin dengeli olduğu için tek bir ortam öne çıkmıyor; farklı ortamlarda rahat edebilirsin.'
          : parent
            ? 'Çocuğunuzun kendini daha rahat hissedebileceği ortamlar:'
            : 'Kendini daha rahat hissedebileceğin ortamlar:',
      items: settingItems,
      note: pick(t.settingsNote, a),
    },
    approach: parent
      ? {
          title: 'Çocuğunuza nasıl yaklaşabilirsiniz?',
          items: sections.flatMap((s) => {
            const g = bandGroup(s.band);
            const text = (g && t.approach?.[s.scaleKey]?.[g]) || s.tips[0];
            return text ? [{ title: s.name, text }] : [];
          }),
        }
      : null,
    weeks,
    sources: t.sources,
  };
}

