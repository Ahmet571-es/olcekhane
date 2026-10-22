import { RIASEC_TYPES, type RiasecKey } from '@/content/careers/riasec';
import type { InterestRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * İlgi testlerinin gelişim yol haritası: ders çalışma yerine ilgilerin nasıl keşfedileceği. Raporun en belirgin alanları
 * (Holland profilinde ilk üç alan, sıralı profillerde raporun öne çıkardığı alanlar) kullanılır; hiçbir şey saklanmaz.
 * Öneri niteliğindedir: meslek seçmez, kesin hüküm vermez. Ekranda ve PDF'te kişilik yol haritasıyla aynı bölümler
 * kullanılır.
 */
/**
 * Bütün alanlar düşük düzeydeyken "Kısaca" bölümündeki not (etkinlik sıklığında ve ilgi düzeyinde ayrı); şablon kendi
 * notunu (`lowNote`) verebilir.
 */
function lowNote(leisure: boolean, parent: boolean): string {
  if (leisure) {
    return parent
      ? 'Çocuğunuz son bir yılda bu etkinliklerin çoğunu pek yapmamış; bu yüzden hiçbir alan öne çıkarılmadı. Bu, zamanının ya da imkânlarının kısıtlı olmasıyla ilgili olabilir; aşağıdaki haftalarda küçük denemeler var.'
      : 'Son bir yılda bu etkinliklerin çoğunu pek yapmamışsın; bu yüzden hiçbir alan öne çıkarılmadı. Bu, zamanının ya da imkânlarının kısıtlı olmasıyla ilgili olabilir; aşağıdaki haftalarda küçük denemeler var.';
  }
  return parent
    ? 'Çocuğunuz etkinliklerin çoğundan pek hoşlanmayacağını belirttiği için hiçbir alan öne çıkarılmadı. Bu olağan bir durum; aşağıdaki haftalarda farklı alanları denemesi için küçük adımlar var.'
    : 'Etkinliklerin çoğundan pek hoşlanmayacağını belirttiğin için hiçbir alan öne çıkarılmadı. Bu olağan bir durum; aşağıdaki haftalarda farklı alanları denemen için küçük adımlar var.';
}

/**
 * Mezun (13. sınıf) için eğitim yolları: lise yolları ("Lise: …") gösterilmez, yalnızca sonraki bölüm ("Üniversite: …")
 * kalır; not okuldan ve öğretmenden söz etmez.
 */
const forGraduate = (paths: string) => paths.replace(/^Lise: .*?(?=Üniversite: )/, '');
const GRADUATE_PATHS_NOTE = {
  student:
    'İlgi tek başına meslek seçtirmez: yeteneklerin, değerlerin ve gerçek deneyimlerin de önemlidir. Bu yollar yalnızca yol gösterici örneklerdir; tercih yaparken bir rehberlik uzmanıyla konuş.',
  parent:
    'İlgi tek başına meslek seçtirmez: çocuğunuzun yetenekleri, değerleri ve gerçek deneyimleri de önemlidir. Bu yollar yalnızca yol gösterici örneklerdir; tercih döneminde bir rehberlik uzmanıyla görüşmesini öneririz.',
};

export function buildInterestRoadmap(
  r: ReportContent,
  t: InterestRoadmapTemplate,
  opts: { preview: boolean; next: NextTest[] },
): Roadmap {
  const a = r.audience;
  const parent = a === 'parent';
  const sections = r.sections.filter((s) => t.areas[s.scaleKey]);
  // Öne çıkan alanlar raporunkilerdir (Holland profilinde orta düzeyin altındaki alan girmez; bütün alanların puanı aynıysa
  // ya da hepsi düşükse öne çıkan alan yoktur).
  const topKeys = r.interests
    ? r.interests.top.map((x) => RIASEC_TYPES[x.key as RiasecKey].scaleKey)
    : (r.ranking?.top ?? []);
  // Bütün alanlar düşük düzeydeyse hiçbir alan "belirgin ilgi" diye öne çıkarılmaz: raporun kendi uyarısıyla çelişmez.
  const allLow = r.interests ? r.interests.allLow : !!r.ranking?.allLow;
  const top = allLow ? [] : topKeys.flatMap((k) => sections.filter((s) => s.scaleKey === k));
  // Yüksek düzeyde alan yoksa (yalnızca görece en yüksek alanlar) eğitim ve meslek yolları önerilmez; varsa yalnızca
  // yüksek düzeydeki alanların yolları gösterilir.
  const noneHigh = r.interests ? r.interests.noneHigh : !!r.ranking?.noneHigh;
  const highTop = top.filter((s) => s.band === 'high' || s.band === 'very_high');
  const hasPaths = Object.values(t.areas).some((x) => x.paths) && !!t.pathsNote && !noneHigh && highTop.length > 0;

  const area = (key: string) => t.areas[key];
  // Holland profilinin rapor şablonunda alanların kısa adı yoktur: o zaman düzey adı gösterilir.
  const summary = (s: (typeof sections)[number]) => s.summary || s.bandLabel;
  const badge = (s: (typeof sections)[number]) => (summary(s) === s.bandLabel ? s.bandLabel : `${s.bandLabel} · ${s.summary}`);
  // 2. ve 3. hafta: en belirgin iki alanın denemeleri; ikinci alan yoksa 3. hafta, hiç yoksa ikisi de genel denemedir.
  const week = (i: 0 | 1) =>
    top[i] ? { title: top[i].name, text: pick(area(top[i].scaleKey).action, a) } : { title: t.openWeeks[i].title, text: pick(t.openWeeks[i].text, a) };
  const second = week(0);
  const third = week(1);

  const nextSentence = nextStep(opts.next, t.nextPurpose, parent);

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
    standoutNote: top.length
      ? null
      : allLow
        ? t.lowNote
          ? pick(t.lowNote, a)
          : lowNote(!!t.leisure, parent)
        : pick(t.openNote, a),
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
            title: a === 'adult' ? 'İş ve meslek planı için' : r.graduate ? 'Eğitim ve meslek planı için' : 'Okul ve meslek planı için',
            intro: parent
              ? 'Çocuğunuzun en belirgin ilgi alanlarıyla ilişkili eğitim yolları:'
              : a === 'adult'
                ? 'En belirgin ilgi alanlarınla ilişkili alanlar ve programlar:'
                : 'En belirgin ilgi alanlarınla ilişkili eğitim yolları:',
            items: highTop.map((s) => {
              const paths = pick(area(s.scaleKey).paths!, a);
              return `${s.name}: ${r.graduate ? forGraduate(paths) : paths}`;
            }),
            note: r.graduate && a !== 'adult' ? pick(GRADUATE_PATHS_NOTE, a) : pick(t.pathsNote!, a),
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
