import { RIASEC_TYPES, type RiasecKey } from '@/content/careers/riasec';
import type { InterestRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { joinNames, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * İlgi testlerinin gelişim yol haritası: ders çalışma yerine ilgilerin nasıl keşfedileceği. Raporun en belirgin alanları
 * (Holland profilinde ilk üç alan, sıralı profillerde raporun öne çıkardığı alanlar) kullanılır; hiçbir şey saklanmaz.
 * Öneri niteliğindedir: meslek seçmez, kesin hüküm vermez. Ekranda ve PDF'te kişilik yol haritasıyla aynı bölümler
 * kullanılır.
 */
export function buildInterestRoadmap(
  r: ReportContent,
  t: InterestRoadmapTemplate,
  opts: { preview: boolean; next: NextTest[] },
): Roadmap {
  const a = r.audience;
  const parent = a === 'parent';
  const sections = r.sections.filter((s) => t.areas[s.scaleKey]);
  // Holland kodu her zaman üç harflidir; bütün alanların puanı aynıysa (ör. her maddeye aynı cevap) öne çıkan alan yoktur.
  const topKeys = r.interests
    ? r.interests.differentiation === 0
      ? []
      : r.interests.top.map((x) => RIASEC_TYPES[x.key as RiasecKey].scaleKey)
    : (r.ranking?.top ?? []);
  const top = topKeys.flatMap((k) => sections.filter((s) => s.scaleKey === k));
  const hasPaths = Object.values(t.areas).some((x) => x.paths) && !!t.pathsNote;

  const area = (key: string) => t.areas[key];
  // Holland profilinin rapor şablonunda alanların kısa adı yoktur: o zaman düzey adı gösterilir.
  const summary = (s: (typeof sections)[number]) => s.summary || s.bandLabel;
  const badge = (s: (typeof sections)[number]) => (summary(s) === s.bandLabel ? s.bandLabel : `${s.bandLabel} · ${s.summary}`);
  // 2. ve 3. hafta: en belirgin iki alanın denemeleri; ikinci alan yoksa 3. hafta, hiç yoksa ikisi de genel denemedir.
  const week = (i: 0 | 1) =>
    top[i] ? { title: top[i].name, text: pick(area(top[i].scaleKey).action, a) } : { title: t.openWeeks[i].title, text: pick(t.openWeeks[i].text, a) };
  const second = week(0);
  const third = week(1);

  const nextNames = opts.next.map((n) => n.name);
  const nextSentence =
    nextNames.length === 0
      ? ''
      : parent
        ? ` Bir sonraki adım olarak ${t.nextPurpose.parent} için ${joinNames(nextNames)} ${nextNames.length > 1 ? 'testlerini' : 'testini'} önerebilirsiniz.`
        : ` Bir sonraki adım olarak ${t.nextPurpose.you} için ${joinNames(nextNames)} ${nextNames.length > 1 ? 'testlerinden birini' : 'testini'} çözebilirsin.`;

  // Öne çıkan alan yoksa keşif, eğitim yolları ve yaklaşım bölümleri de yoktur; giriş yalnızca olanları sayar.
  const contents = top.length
    ? [pick(t.what, a), ...(hasPaths ? [parent ? 'bu ilgilerle ilişkili eğitim yolları' : 'bu ilgilerle ilişkili yollar'] : []), ...(parent ? ['ona nasıl yaklaşabileceğiniz'] : [])]
    : [];
  contents.push('dört haftalık küçük adımlar');
  const notVerdict = t.leisure ? 'Öneriler kesin hüküm değildir' : 'Öneriler bir meslek seçimi ya da kesin hüküm değildir';

  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük hayata taşımanız için öneriler içerir: ${joinNames(contents)}. ${notVerdict}; çocuğunuza uyanları birlikte seçin.`
      : `Bu bölüm sonuçlarını günlük hayata taşıman için öneriler içerir: ${joinNames(contents)}. ${notVerdict}; sana uyanları seç.`,
    bars: sections.map((s) => ({
      key: s.scaleKey,
      label: s.name,
      value: s.value,
      min: s.min,
      max: s.max,
      ciLow: s.ciLow,
      ciHigh: s.ciHigh,
      color: area(s.scaleKey).color,
      valueLabel: s.valueLabel,
      band: s.bandLabel,
    })),
    standout: top.map((s) => ({ title: s.name, text: summary(s) })),
    standoutNote: top.length ? null : pick(t.openNote, a),
    study: {
      title: parent ? t.studyTitle.parent : t.studyTitle.you,
      intro: pick(t.studyIntro, a),
      items: top.map((s) => ({
        key: s.scaleKey,
        title: s.name,
        badge: badge(s),
        color: area(s.scaleKey).color,
        text: pick(area(s.scaleKey).explore, a),
      })),
      links: t.links,
    },
    settings:
      !hasPaths || top.length === 0
        ? null
        : {
            title: a === 'adult' ? 'İş ve meslek planı için' : 'Okul ve meslek planı için',
            intro: parent
              ? 'Çocuğunuzun en belirgin ilgi alanlarıyla ilişkili eğitim yolları:'
              : a === 'adult'
                ? 'En belirgin ilgi alanlarınla ilişkili alanlar ve programlar:'
                : 'En belirgin ilgi alanlarınla ilişkili eğitim yolları:',
            items: top.map((s) => `${s.name}: ${pick(area(s.scaleKey).paths!, a)}`),
            note: pick(t.pathsNote!, a),
          },
    approach:
      parent && top.length
        ? { title: 'Çocuğunuza nasıl yaklaşabilirsiniz?', items: top.map((s) => ({ title: s.name, text: area(s.scaleKey).approach })) }
        : null,
    weeks: [
      { label: '1. hafta', title: 'Fark et', text: pick(t.firstWeek, a) },
      { label: '2. hafta', title: second.title, text: second.text },
      { label: '3. hafta', title: third.title, text: third.text },
      { label: '4. hafta', title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextSentence },
    ],
    sources: t.sources,
  };
}
