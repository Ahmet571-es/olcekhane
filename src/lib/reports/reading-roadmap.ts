import type { ReadingPace, ReadingRoadmapTemplate } from '@/content/roadmaps/types';
import type { ReportContent } from './build';
import { bandGroup, joinNames, nextStep, pick, type NextTest, type Roadmap } from './roadmap';

/**
 * Okuma Hızı ve Anlama testinin gelişim yol haritası: soru türlerine (okuma becerilerine) göre nasıl çalışılacağı,
 * hız ile anlamanın dengesi, okuma alışkanlığı için öneriler ve dört haftalık plan. Beceriler en çok zorlanılandan
 * başlayarak sıralanır (doğru oranı düşük olan önce, eşitlikte testteki sıra). Her beceri bir ile üç soruyla ölçüldüğü
 * için rozet yalnızca sayıyı söyler; düzey adı verilmez. Tek bir kısa metne dayandığı için kesin hüküm verilmez.
 */
/**
 * Sessiz okumada yetişkinlerin tipik hızının biraz üstü (Brysbaert, 2019: İngilizce kurgu dışı metinlerde dakikada ~238
 * kelime). Türkçe kelimeler ortalamada daha uzun olduğu için bu eşik Türkçede daha da yüksek bir hıza denk gelir.
 */
const RUSH_WPM = 250;

/** Rapordaki kalite uyarıları varken yol haritası da aynı dikkatle okunmalı (konu tarama ve okuma testlerinde). */
export function cautionText(parent: boolean): string {
  return parent
    ? ' Raporda sonucun dikkatle yorumlanmasını gerektiren uyarılar var; bu öneriler de aynı dikkatle okunmalı.'
    : ' Raporunda sonucunu dikkatle yorumlamayı gerektiren uyarılar var; bu önerileri de buna göre oku.';
}

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
  // Hız metnin sınıf düzeyine göre değerlendirilir (lib/scoring/reading.ts, READING_PACE): anlama zayıfken hız belirgin
  // yüksekse "yavaşla ve anla"; anlama iyiyken hız belirgin düşükse "bol okuma" yerine akıcılık (tekrarlı okuma) önerilir.
  // Eski raporlarda sınıfa göre hız bilgisi yoksa yetişkinlerin tipik sessiz okuma hızı kullanılır.
  // Metin çok kısa sürede geçildiyse hız ölçülemez: anlama iyiyse "skim" (ön bilgi), değilse "rush". Süre çok uzunsa hız
  // bilinmez: akıcılık önerisi ("build") verilir, "bol okuma" ("extend") verilmez. Hız olağan ama anlama zayıf ya da
  // ortaysa zorluk anlamadadır ("understand"); akıcılık çalışması yalnızca hız yavaşken önerilir.
  const fast = rd.pace ? rd.pace === 'fast' : rd.wpm >= RUSH_WPM;
  const slow = rd.pace === 'slow' && !rd.tooSlow;
  const pace: ReadingPace = rd.tooFast
    ? group === 'high'
      ? 'skim'
      : 'rush'
    : rd.tooSlow
      ? 'build'
      : group !== 'high' && fast
        ? 'quick'
        : group === 'high'
          ? slow
            ? 'build'
            : 'extend'
          : slow
            ? 'build'
            : 'understand';
  const speedRead = !rd.tooFast && !rd.tooSlow;
  const wpm = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(rd.wpm);
  // Anlama iyi ama hız Ölçekhane'nin deneme ölçütüne göre yavaş: akıcılık önerisinin nedeni söylenir.
  const slowNote =
    pace === 'build' && group === 'high' && slow
      ? parent
        ? 'Okuma hızı bu metinde Ölçekhane’nin deneme ölçütüne göre düşük çıktı; bu, metnin dikkatle okunmasından da kaynaklanabilir. '
        : 'Okuma hızın bu metinde Ölçekhane’nin deneme ölçütüne göre düşük çıktı; bu, metni dikkatle okumandan da kaynaklanabilir. '
      : '';
  const caution = (r.qualityNotes?.length ?? 0) > 0 || rd.tooFast ? cautionText(parent) : '';
  const all = rd.skills;
  const sum = (f: (s: (typeof all)[number]) => number) => all.reduce((n, s) => n + f(s), 0);
  const badge = (s: (typeof skills)[number]) =>
    s.total === 1
      ? s.correct
        ? 'Tek soru, doğru'
        : 'Tek soru, yanlış'
      : s.correct === s.total
        ? s.total === 2
          ? 'İki sorunun ikisi de doğru'
          : `${s.total} sorunun hepsi doğru`
        : s.correct === 0
          ? `${s.total} sorunun hiçbiri doğru değil`
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
      ? `Bu bölüm sonuçları günlük okumaya taşımanız için öneriler içerir: ${joinNames(contents)}. Öneriler tek bir kısa metne dayanır; kesin hüküm değildir.${caution}`
      : `Bu bölüm sonuçlarını günlük okumana taşıman için öneriler içerir: ${joinNames(contents)}. Öneriler tek bir kısa metne dayanır; kesin hüküm değildir.${caution}`,
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
      // Rapor şablonundaki özet üçüncü kişiyle yazılmıştır ("Anlamakta zorlandı"): öğrenciye doğru sayısı gösterilir.
      { title: 'Anlama', text: parent ? section.summary || section.bandLabel : `${sum((x) => x.total)} sorudan ${sum((x) => x.correct)} doğru` },
      { title: 'Okuma hızı', text: speedRead ? `Dakikada ${wpm} kelime` : 'Yorumlanmadı' },
      ...(need[0] && ratio(need[0]) < 0.5 ? [{ title: parent ? 'En çok zorlandığı soru türü' : 'En çok zorlandığın soru türü', text: need[0].label }] : []),
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
        { key: 'pace', title: 'Hız ve anlama', badge: speedRead ? `Dakikada ${wpm} kelime` : 'Hız yorumlanmadı', color: '#5b6b82', text: slowNote + pick(t.pace[pace].text, a) },
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
