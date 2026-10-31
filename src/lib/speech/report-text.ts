import { AUDIENCE_LABELS } from '@/lib/config';
import { weeksTitle, type Roadmap } from '@/lib/reports/roadmap';
import type { SimpleChart, SimpleReport } from '@/lib/reports/simple';

/**
 * Raporu sesli dinle (site sahibinin 2026-10-31 isteği): ekrandaki raporun sesli okunacak metni. Metin DOM'dan değil,
 * raporun verisinden (SimpleReport ve yol haritası) ekrandaki sırayla kurulur. Ses yalnızca cihazdaki Türkçe sesle üretilir
 * (lib/speech/voice.ts); metin hiçbir yere gönderilmez.
 *
 * Okunuş kuralları (`speakable`): metindeki kaynak gösterimleri ("(Kail, 1991)") okunmaz; "%88" → "yüzde 88",
 * "3,4 / 5" → "5 üzerinden 3,4", "1,5 sn" → "1,5 saniye", "ve ark." → "ve arkadaşları", oklar ve tırnaklar okunmaz.
 * Bazı ses motorları uzun bir parçayı yarıda kestiği için metin kısa parçalara (cümle, gerekirse cümlenin bölümleri)
 * bölünür (`splitUtterances`).
 */

/** Bir okuma parçasının en büyük uzunluğu (karakter); bölünemeyen tek bir kelime bunu aşamaz. */
export const MAX_UTTERANCE = 200;

/** Raporun bir bölümü: durum satırında gösterilen adı ve okunacak satırları. */
export interface SpeechSegment {
  title: string;
  lines: string[];
}

/** Raporun okunacak iki kısmı: sonuçlar ve (varsa) gelişim yol haritası. */
export interface ReportSpeechText {
  results: SpeechSegment[];
  roadmap: SpeechSegment[];
}

export interface Utterance {
  text: string;
  /** Parçanın ait olduğu bölümün adı ("Okunuyor: …"). */
  segment: string;
}

/** Ayraç içindeki kaynak gösterimi: içinde bir yıl (1800–2099) ve bir harf geçen ayraç ("(Kail, 1991)", "(aktaran …)"). */
const CITATION = /\s*\((?=[^()]*\p{L})(?=[^()]*\b(?:18|19|20)\d{2}[a-z]?\b)[^()]*\)/gu;

/** Metni sesli okumaya uygun hâle getirir (bkz. dosyanın başındaki kurallar). */
export function speakable(input: string): string {
  let s = input;
  // Kesirler {3/4} → "3 bölü 4" (konu tarama testlerinde).
  s = s.replace(/\{(\d+)\/(\d+)\}/g, '$1 bölü $2');
  s = s.replace(CITATION, '');
  s = s.replace(/\bve ark\./g, 've arkadaşları');
  s = s.replace(/(?<!\p{L})([Öö])r\.\s/gu, (_, c: string) => (c === 'Ö' ? 'Örneğin ' : 'örneğin '));
  s = s.replace(/\bvb\./g, 've benzeri');
  // Yüzde: "%88", "% 88,5".
  s = s.replace(/%\s?(\d+(?:,\d+)?)/g, 'yüzde $1');
  // "3,4 / 5" ve "15/15" → "5 üzerinden 3,4".
  s = s.replace(/(\d+(?:,\d+)?)\s*\/\s*(\d+(?:,\d+)?)/g, '$2 üzerinden $1');
  // Aralıklar: "1–5", "0–30 sn" → "1 ile 5".
  s = s.replace(/(\d)\s*[–—-]\s*(\d)/g, '$1 ile $2');
  // Birimler (bir sayıdan sonra).
  s = s.replace(/(\d)\s*sn\b/g, '$1 saniye');
  s = s.replace(/(\d)\s*dk\b/g, '$1 dakika');
  s = s.replace(/(\d)\s*ms\b/g, '$1 milisaniye');
  s = s.replace(/(\d)\s*°/g, '$1 derece');
  s = s.replace(/−\s?(\d)/g, 'eksi $1');
  s = s.replace(/\+(\d)/g, 'artı $1');
  s = s.replace(/≥/g, 'en az').replace(/≤/g, 'en çok').replace(/×/g, ' çarpı ');
  // Oklar, ara noktalar ve tireler: kısa bir duraklama.
  s = s.replace(/\s*[→←↑↓·•|]\s*/g, ', ');
  s = s.replace(/\s+[–—]\s+/g, ', ');
  // Tırnaklar okunmaz; kelimenin içindeki kesme işareti ("Türkiye’de") düz kesme olur.
  s = s.replace(/(\p{L}|\d)[’'](\p{L})/gu, "$1'$2");
  s = s.replace(/[“”"‘’«»]/g, '');
  // Boşluklar ve noktalama.
  s = s.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').replace(/,\s*,/g, ',').replace(/^[,\s]+/, '');
  return s.trim();
}

/** Cümle sonunda nokta yoksa ekler (başlıklar ve kısa satırlar okunurken ses düşsün). */
function sentence(s: string): string {
  const t = s.trim();
  return t === '' || /[.!?…:]$/.test(t) ? t : `${t}.`;
}

/** Uzun bir parçayı, önce noktalı virgül ve iki noktadan, sonra virgülden, en son boşluktan böler. */
function splitLong(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  for (const sep of [/(?<=[;:])\s+/, /(?<=,)\s+/, /\s+/]) {
    const parts = text.split(sep);
    if (parts.length < 2) continue;
    const out: string[] = [];
    let cur = '';
    for (const p of parts) {
      const next = cur ? `${cur} ${p}` : p;
      if (next.length <= max) cur = next;
      else {
        if (cur) out.push(cur);
        cur = p;
      }
    }
    if (cur) out.push(cur);
    if (out.every((o) => o.length <= max)) return out;
    return out.flatMap((o) => splitLong(o, max));
  }
  return [text];
}

/** Metni okunuşa uygun hâle getirip cümlelere, uzun cümleleri de daha kısa parçalara böler. */
export function splitUtterances(text: string, max = MAX_UTTERANCE): string[] {
  return text
    .split(/\n+/)
    .map(speakable)
    .filter(Boolean)
    .flatMap((para) => para.split(/(?<=[.!?…])\s+(?=[\p{Lu}\d])/u))
    .map((s) => s.trim())
    .filter((s) => /[\p{L}\d]/u.test(s))
    .flatMap((s) => splitLong(s, max));
}

/** Bölümleri okuma parçalarına çevirir. */
export function utterancesOf(segments: SpeechSegment[], max = MAX_UTTERANCE): Utterance[] {
  return segments.flatMap((seg) => seg.lines.flatMap((l) => splitUtterances(l, max)).map((text) => ({ text, segment: seg.title })));
}

/** Grafiğin sözlü anlatımı: her satırın adı ve değeri. */
function chartLines(chart: SimpleChart): string[] {
  switch (chart.type) {
    case 'rulers':
      return chart.rows.map((r) => sentence(r.value === null ? `${r.label}: hesaplanamadı` : `${r.label}: ${r.valueLabel}${r.band ? `, ${r.band}` : ''}`));
    case 'bars':
      return chart.rows.map((r) => sentence(`${r.label}: ${r.valueLabel}`));
    case 'columns':
      return [...chart.rows.map((r) => sentence(`${r.label}: ${r.value}`)), sentence(chart.caption)];
    case 'hexagon':
    case 'circle':
      return chart.axes.filter((a) => a.value !== null).map((a) => sentence(`${a.label}: 5 üzerinden ${String(Math.round((a.value as number) * 10) / 10).replace('.', ',')}`));
    case 'quadrant':
      return chart.activeLabel ? [sentence(chart.activeLabel)] : [];
  }
}

/** Sonuçlar kısmı: ekrandaki sırayla (başlık, uyarılar, öne çıkan sayılar, grafik, kartlar, notlar). */
function resultSegments(report: SimpleReport): SpeechSegment[] {
  const you = report.audience !== 'parent';
  const out: SpeechSegment[] = [];
  const push = (title: string, lines: (string | null | undefined | false)[]) => {
    const l = lines.filter((x): x is string => !!x && x.trim() !== '');
    if (l.length > 0) out.push({ title: title.trim().replace(/[.:]$/, ''), lines: l });
  };
  const kind = report.audienceName ?? AUDIENCE_LABELS[report.audience].name;
  push(report.instrumentName, [sentence(report.instrumentName), sentence(kind), report.isPilot && 'Pilot test.']);
  if (report.cautions.length > 0) {
    const t = you ? 'Sonucunu okurken dikkat' : 'Bu sonucu dikkatle yorumlayın';
    push(t, [sentence(t), ...report.cautions.map(sentence)]);
  }
  const oral = report.oral;
  if (oral) push(oral.level.label, [sentence(oral.level.label), oral.level.text, oral.level.profile]);
  if (report.keyFigures.length > 0) {
    push(
      'Öne çıkan sayılar',
      report.keyFigures.map((f) => [sentence(`${f.label}: ${f.value}`), f.note ? sentence(f.note) : ''].filter(Boolean).join(' ')),
    );
  }
  if (report.chart) {
    push(report.chartTitle, [sentence(report.chartTitle), ...chartLines(report.chart), report.chartNote && sentence(report.chartNote)]);
  }
  push(report.itemsTitle, [sentence(report.itemsTitle), report.groupsNote && sentence(report.groupsNote)]);
  for (const it of report.items) push(it.title, [sentence(it.title), it.badge && sentence(it.badge), it.text]);
  for (const g of report.groups ?? []) {
    push(g.title, [
      sentence(g.title),
      g.badge && sentence(g.badge),
      g.text,
      ...g.facets.map((f) => [sentence(`${f.label}: ${f.valueLabel}${f.band ? `, ${f.band}` : ''}`), f.text].join(' ')),
    ]);
  }
  if (oral) {
    if (oral.prosodyTotal !== null) {
      const t = `Akıcılık: ${oral.prosodyTotal} / 16${oral.prosodyLabel ? `, ${oral.prosodyLabel}` : ''}`;
      push('Akıcılık', [sentence(t), ...oral.prosody.map((p) => `${sentence(`${p.name}: ${p.value} / 4`)} ${p.text}`)]);
    }
    push('Sıradaki değerlendirme', [oral.next]);
  }
  if (report.quiz) {
    // Soru soru inceleme (kesirli işlemler, tablolar, şekiller) sesli okunmaz; hata türleri okunur.
    const q = report.quiz;
    if (q.errors.length > 0) {
      push(q.errorsTitle, [
        sentence(q.errorsTitle),
        q.errorsNote,
        ...q.errors.map((e) => [sentence(e.name), sentence(e.seen), e.explain, `Öneri: ${e.tip}`].join(' ')),
      ]);
    }
  }
  if (report.support) push(report.support.title, [sentence(report.support.title), ...report.support.lines.map(sentence)]);
  push(report.disclaimer.title, [`${sentence(report.disclaimer.title)} ${report.disclaimer.text}`, report.normNote]);
  return out;
}

/** Yol haritası kısmı: ekrandaki sırayla (giriş, kısaca, öneriler, ortamlar, yaklaşım, haftalar); kaynaklar okunmaz. */
function roadmapSegments(rm: Roadmap, you: boolean): SpeechSegment[] {
  const out: SpeechSegment[] = [];
  const push = (title: string, lines: (string | null | undefined | false)[]) => {
    const l = lines.filter((x): x is string => !!x && x.trim() !== '');
    if (l.length > 0) out.push({ title: title.trim().replace(/[.:]$/, ''), lines: l });
  };
  const head = you ? 'Senin yol haritan' : 'Çocuğunuz için yol haritası';
  push(head, [sentence(head), rm.intro]);
  if (rm.standout.length > 0 || rm.standoutNote) {
    push('Kısaca', ['Kısaca.', ...rm.standout.map((s) => sentence(`${s.title}: ${s.text}`)), rm.standoutNote]);
  }
  push(rm.study.title, [sentence(rm.study.title), rm.study.intro]);
  for (const it of rm.study.items) push(it.title, [sentence(it.title), it.badge && sentence(it.badge), it.text]);
  if (rm.settings) push(rm.settings.title, [sentence(rm.settings.title), rm.settings.intro, ...rm.settings.items.map(sentence), rm.settings.note]);
  if (rm.approach && rm.approach.items.length > 0) {
    push(rm.approach.title, [sentence(rm.approach.title), ...rm.approach.items.map((it) => `${sentence(it.title)} ${it.text}`)]);
  }
  if (rm.weeks.length > 0) {
    const t = weeksTitle(rm.weeks.length);
    push(t, [sentence(t)]);
    for (const w of rm.weeks) push(`${w.label}: ${w.title}`, [sentence(w.label), sentence(w.title), w.text]);
  }
  return out;
}

/** Ekrandaki raporun sesli okunacak metni. */
export function reportSpeech(report: SimpleReport): ReportSpeechText {
  return {
    results: resultSegments(report),
    roadmap: report.roadmap ? roadmapSegments(report.roadmap, report.audience !== 'parent') : [],
  };
}
