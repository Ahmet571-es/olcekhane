import { AUDIENCE_LABELS } from '@/lib/config';
import { weeksTitle, type Roadmap } from '@/lib/reports/roadmap';
import type { ReportPart } from '@/lib/reports/parts';
import type { SimpleChart, SimpleReport } from '@/lib/reports/simple';

/**
 * Raporu sesli dinle (site sahibinin 2026-10-31 isteği): ekrandaki raporun sesli okunacak metni. Metin DOM'dan değil,
 * raporun verisinden (SimpleReport ve yol haritası) ekrandaki sırayla kurulur. Ses yalnızca cihazdaki Türkçe sesle üretilir
 * (lib/speech/voice.ts); metin hiçbir yere gönderilmez.
 *
 * Okunuş kuralları (`speakable`): metindeki kaynak gösterimleri ("(Kail, 1991)") ve tek ya da iki büyük harfli ayraçlar
 * ("(A)", "(IQ)") okunmaz; "%88" → "yüzde 88", "3,4 / 5" → "5 üzerinden 3,4", "62 kelime/dakika" → "dakikada 62 kelime",
 * "5–8. sınıf" → "5. ile 8. sınıf", "1,5 sn" → "1,5 saniye", "÷" → "bölü", "□" → "boş kutu", " = " → "eşittir",
 * "ve ark." → "ve arkadaşları"; oklar ve tırnaklar okunmaz. Grafiğin görünüşünü anlatan cümleler (renk, işaret, bant…)
 * okunmaz (`spokenNote`); değerler grafiğin satırlarından sözle okunur. Bazı ses motorları uzun bir parçayı yarıda
 * kestiği için metin kısa parçalara (cümle, gerekirse cümlenin bölümleri) bölünür (`splitUtterances`); sıra numarasından
 * ("1. Kazanç") sonra bölünmez, parçanın sonundaki "8." sıra sayısı gibi okunmasın diye noktasız okunur. Bölümler
 * ekrandaki görünme koşullarıyla okunur (ör. yol haritasında öneri yoksa öneriler bölümü yok).
 */

/** Bir okuma parçasının en büyük uzunluğu (karakter); bölünemeyen tek bir kelime bunu aşamaz. */
export const MAX_UTTERANCE = 200;

/** Raporun bir bölümü: durum satırında gösterilen adı ve okunacak satırları. */
export interface SpeechSegment {
  title: string;
  lines: string[];
  /** Bölümün adı ("Bölümü geç" bütün bölümü atlar): ek bölümün kartlarında bölümün başlığı; verilmezse `title`. */
  section?: string;
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
  /** "Bölümü geç" düğmesinin atladığı bölüm (ek bölümlerde bütün bölüm; ötekilerde `segment`). */
  section?: string;
}

/** Sesli okumanın yaklaşık hızı (karakter/saniye): uzun bölümün süresi bununla tahmin edilir. */
export const SPEECH_CHARS_PER_SECOND = 15;
/** Bundan uzun sürecek ek bölümün başında yaklaşık süresi söylenir (saniye). */
export const LONG_PART_SECONDS = 180;

/** Ayraç içindeki kaynak gösterimi: içinde bir yıl (1800–2099) ve bir harf geçen ayraç ("(Kail, 1991)", "(aktaran …)"). */
const CITATION = /\s*\((?=[^()]*\p{L})(?=[^()]*\b(?:18|19|20)\d{2}[a-z]?\b)[^()]*\)/gu;

/** Metni sesli okumaya uygun hâle getirir (bkz. dosyanın başındaki kurallar). */
export function speakable(input: string): string {
  let s = input;
  // Kesirler {3/4} → "3 bölü 4", tam sayılı kesirler {1 3/4} → "1 tam 3 bölü 4" (konu tarama testlerinde).
  s = s.replace(/\{(\d+) (\d+)\/(\d+)\}/g, '$1 tam $2 bölü $3');
  s = s.replace(/\{(\d+)\/(\d+)\}/g, '$1 bölü $2');
  // Üçerli gruplanmış sayılar ("102 045") tek sayı olarak okunsun.
  s = s.replace(/(?<![\d,])\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?![\d,])/g, (m) => m.replace(/[ \u00a0\u202f]/g, ''));
  s = s.replace(CITATION, '');
  // Tek ya da iki büyük harfli ayraçlar ("(A)", "(IQ)") okunmaz.
  s = s.replace(/\s*\((?:[A-ZÇĞİÖŞÜ]{1,2})\)/g, '');
  s = s.replace(/\bve ark\./g, 've arkadaşları');
  s = s.replace(/(?<!\p{L})([Öö])r\.\s/gu, (_, c: string) => (c === 'Ö' ? 'Örneğin ' : 'örneğin '));
  s = s.replace(/\bvb\./g, 've benzeri');
  // Yüzde: "%88", "% 88,5".
  s = s.replace(/%\s?(\d+(?:,\d+)?)/g, 'yüzde $1');
  // "62 kelime/dakika" → "dakikada 62 kelime".
  s = s.replace(/(\d+(?:,\d+)?),?\s*kelime\/(?:dakika|dk)\b/g, 'dakikada $1 kelime');
  // "3,4 / 5" ve "15/15" → "5 üzerinden 3,4".
  s = s.replace(/(\d+(?:,\d+)?)\s*\/\s*(\d+(?:,\d+)?)/g, '$2 üzerinden $1');
  // Sıra sayısı aralıkları: "5–8. sınıf" → "5. ile 8. sınıf".
  s = s.replace(/(\d+)\s*[–—-]\s*(\d+)\.(?=\s+\p{Ll})/gu, '$1. ile $2.');
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
  // İşlem işaretleri (konu taramada).
  s = s.replace(/÷/g, ' bölü ').replace(/□/g, ' boş kutu ').replace(/\s\+\s/g, ' artı ').replace(/(^|\s)=(?=\s|[.,;)]|$)/g, '$1eşittir');
  // Boşluklar ve noktalama.
  s = s.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').replace(/,\s*,/g, ',').replace(/^[,\s]+/, '');
  return s.trim();
}

/** Cümle sonunda nokta yoksa ekler (başlıklar ve kısa satırlar okunurken ses düşsün). */
function sentence(s: string): string {
  const t = s.trim();
  return t === '' || /[.!?…:]["”’»)]*$/.test(t) ? t : `${t}.`;
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
    // "1. Kazanç" gibi bir sıra numarasından sonra bölünmez.
    .flatMap((para) => para.split(/(?<=[.!?…])(?<!(?:^|[.!?…]\s+)\d{1,3}\.)\s+(?=[\p{Lu}\d])/u))
    .map((s) => s.trim())
    .filter((s) => /[\p{L}\d]/u.test(s))
    .flatMap((s) => splitLong(s, max))
    // Sondaki "8." sıra sayısı gibi okunmasın: "8 üzerinden 8." → "8 üzerinden 8".
    .map((s) => s.replace(/(\d)\.$/, '$1'));
}

/** Bölümleri okuma parçalarına çevirir. */
export function utterancesOf(segments: SpeechSegment[], max = MAX_UTTERANCE): Utterance[] {
  return segments.flatMap((seg) => seg.lines.flatMap((l) => splitUtterances(l, max)).map((text) => ({ text, segment: seg.title, section: seg.section ?? seg.title })));
}

const nf1 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Grafiğin görünüşünü anlatan cümleler (renk, işaret, bant, nokta, çizgi, eksen, köşe, harita…) sesle bir şey anlatmaz:
 * okunmaz. Değerler grafiğin satırlarından sözle okunur.
 */
const VISUAL = /(?<!\p{L})(?:kırmızı|sarı|mavi|yeşil|turuncu|gri|renk|işaret|bant|nokta|çizgi|eksen|köşe|altıgen|harita|sütun|çubu|daire|kesikli)|(?<!\p{L})mor(?!\p{L})/iu;

/** Bir grafik notunun sesle anlam taşıyan cümleleri. */
export function spokenNote(note: string | undefined): string | null {
  if (!note) return null;
  // Görünüşü anlatan cümlenin noktalı virgülle ayrılmış öteki bölümleri (ör. "…daha az kesindir; sarı bantların…") kalır.
  const kept = note
    .split(/(?<=[.!?])\s+(?=[\p{Lu}\d])/u)
    .map((x) => {
      if (!VISUAL.test(x)) return x;
      const clauses = x.replace(/[.!?]$/, '').split(/;\s*/).filter((c) => !VISUAL.test(c));
      return clauses.length > 0 ? `${clauses.join('; ')}.` : '';
    })
    .filter(Boolean)
    .join(' ')
    .trim();
  return kept || null;
}

/** Grafiğin sözlü anlatımı: her satırın adı ve değeri. */
function chartLines(chart: SimpleChart): string[] {
  switch (chart.type) {
    case 'rulers':
      return chart.rows.map((r) => sentence(r.value === null ? `${r.label}: hesaplanamadı` : `${r.label}: ${r.valueLabel}${r.band ? `, ${r.band}` : ''}`));
    case 'bars':
      return chart.rows.map((r) => sentence(`${r.label}: ${r.valueLabel}`));
    case 'columns':
      return [...chart.rows.map((r) => sentence(`${r.label}: ${r.value}`)), spokenNote(chart.caption) ?? ''].filter(Boolean);
    case 'hexagon':
    case 'circle':
      return chart.axes.filter((a) => a.value !== null).map((a) => sentence(`${a.label}: 5 üzerinden ${nf1.format(a.value as number)}`));
    case 'quadrant':
      return [
        ...[chart.x, chart.y].filter((a) => a.value !== null).map((a) => sentence(`${a.label}: ${chart.max} üzerinden ${nf1.format(a.value as number)}`)),
        ...(chart.activeLabel ? [sentence(chart.activeLabel)] : []),
      ];
  }
}

/**
 * Öne çıkan sayı: ad, değer ve (varsa) not. Not küçük harf ya da rakamla başlıyorsa değerin devamıdır ("72, dört
 * bölümde"; "72. dört bölümde" sıra sayısı gibi okunmasın); büyük harfle başlıyorsa ayrı cümledir. Büyük harfli kodlar
 * ("IAE") harf harf okunur.
 */
function keyFigureLine(f: { label: string; value: string; note?: string }): string {
  const value = /^[A-ZÇĞİÖŞÜ]{2,4}$/.test(f.value) ? [...f.value].join(', ') : f.value;
  const note = f.note?.trim();
  if (!note) return sentence(`${f.label}: ${value}`);
  return /^[\p{Ll}\d]/u.test(note) ? sentence(`${f.label}: ${value}, ${note}`) : `${sentence(`${f.label}: ${value}`)} ${sentence(note)}`;
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
  if (report.keyFigures.length > 0) push('Öne çıkan sayılar', report.keyFigures.map(keyFigureLine));
  if (report.chart) {
    const note = spokenNote(report.chartNote);
    push(report.chartTitle, [sentence(report.chartTitle), ...chartLines(report.chart), note && sentence(note)]);
  }
  const groupsNote = spokenNote(report.groupsNote);
  push(report.itemsTitle, [sentence(report.itemsTitle), groupsNote && sentence(groupsNote)]);
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
  // Ek bölümler (düzeylerin anlamı, cevaplar tek tek, cevap kalitesi): ekrandaki sırayla, eksiksiz.
  for (const part of report.parts ?? []) out.push(...partSegments(part, you));
  push(report.disclaimer.title, [`${sentence(report.disclaimer.title)} ${report.disclaimer.text}`, report.normNote]);
  return out;
}

/**
 * Ek bir bölüm (lib/reports/parts.ts): başlık ve giriş (grafiğin görünüşünü anlatan cümleleri okunmaz); her kartın adı,
 * rozeti, açıklaması, düzeyleri ("Düşük: …"; puanın sınırına yakın olduğu komşu düzeyin ardından o düzeyin de uyabileceği),
 * madde madde cevapları ("12. cümle: …. Cevabın: Oldukça doğru. Ters puanlanır.") ve grafiğinin değerleri (`spoken`).
 * Grafiğin nasıl okunacağını anlatan notlar okunmaz; kaynakların varlığı söylenir. Bölüm uzun sürecekse (`LONG_PART_SECONDS`)
 * girişte yaklaşık süresi ve "Bölümü geç" düğmesi söylenir. Bütün parçalar aynı bölümdedir: düğme bölümün hepsini atlar.
 */
function partSegments(part: ReportPart, you: boolean): SpeechSegment[] {
  const section = part.title.trim().replace(/[.:?]$/, '');
  const out: SpeechSegment[] = [];
  const push = (title: string, lines: (string | null | undefined | false)[]) => {
    const l = lines.filter((x): x is string => !!x && x.trim() !== '');
    if (l.length > 0) out.push({ title: title.trim().replace(/[.:?]$/, ''), lines: l, section });
  };
  push(part.title, [sentence(part.title), spokenNote(part.intro)]);
  for (const g of part.groups) {
    if (g.title) push(g.title, [sentence(g.title)]);
    for (const c of g.cards) {
      const levels = (c.levels ?? []).flatMap((l) => [l.text ? sentence(`${l.label}: ${l.text}`) : sentence(l.label), ...(l.spoken ? [l.spoken] : [])]);
      const active = c.levels?.find((l) => l.active);
      const rows = (c.rows ?? []).map((r) => {
        // Satırın sesli okunuşu metninden farklıysa o okunur: `spoken` (konu taramada soru metni okunmaz: boş) ya da `say`.
        const said = r.spoken ?? r.say ?? r.text;
        const head =
          r.label !== undefined ? sentence(said) : said ? `${r.no}. ${c.rowsHead?.item ?? 'madde'}: ${sentence(said)}` : sentence(`${r.no}. ${c.rowsHead?.item ?? 'madde'}`);
        const value = r.muted ? sentence(r.value) : sentence(`${c.rowsHead?.value ?? 'Cevap'}: ${r.value}`);
        return [head, value, ...r.tags.map((t) => sentence(t.charAt(0).toLocaleUpperCase('tr-TR') + t.slice(1)))].join(' ');
      });
      // Düzey kartında önce düzeyler, sonra kişinin düzeyi (rozetteki ad; birleşik düzeyde de tek ad), puanı ve açıklama.
      push(
        c.title,
        levels.length
          ? [
              sentence(c.title),
              sentence('Düzeyler'),
              ...levels,
              // Kişinin düzeyi rozetteki adla okunur; kendi etiketi olan kartta (`activeLabel`, ör. "Senin hızın") rozet bir değerdir
              // ("Dakikada 90 kelime"): düzeyin adı okunur ("Senin hızın: Olağan"; birleşik düzeyde yine rozetteki tek ad).
              active && (c.badge || c.activeLabel)
                ? sentence(
                    `${c.activeLabel ?? (you ? 'Senin düzeyin' : 'Çocuğunuzun düzeyi')}: ${c.activeLabel && !(active.label.includes(' · ') && c.badge) ? active.label : c.badge}`,
                  )
                : c.badge && sentence(c.badge),
              ...(c.spoken ?? []),
              c.text,
            ]
          : [sentence(c.title), c.badge && sentence(c.badge), c.text, ...(c.spoken ?? []), ...rows],
      );
    }
  }
  if (part.sources?.length) push('Kaynak', [part.sources.length > 1 ? 'Kaynaklar ekranda ve PDF dosyasında yazılıdır.' : 'Kaynak ekranda ve PDF dosyasında yazılıdır.']);
  const seconds = out.reduce((n, seg) => n + seg.lines.join(' ').length, 0) / SPEECH_CHARS_PER_SECOND;
  if (seconds > LONG_PART_SECONDS && out.length > 0) {
    const minutes = Math.round(seconds / 60);
    out[0].lines.push(`Bu bölüm yaklaşık ${minutes} dakika sürer. Geçmek için “Bölümü geç” düğmesine ${you ? 'basabilirsin' : 'basabilirsiniz'}.`);
  }
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
  // Ekrandaki gibi: öne çıkanlar varsa onlar, yoksa not.
  push('Kısaca', ['Kısaca.', ...(rm.standout.length > 0 ? rm.standout.map((s) => sentence(`${s.title}: ${s.text}`)) : [rm.standoutNote])]);
  // Öneriler bölümü ekranda yalnızca öneri varsa görünür.
  if (rm.study.items.length > 0) {
    push(rm.study.title, [sentence(rm.study.title), rm.study.intro]);
    for (const it of rm.study.items) push(it.title, [sentence(it.title), it.badge && sentence(it.badge), it.text]);
  }
  if (rm.settings) push(rm.settings.title, [sentence(rm.settings.title), rm.settings.intro, ...rm.settings.items.map(sentence), rm.settings.note]);
  // Yaklaşım önerileri ekranda yalnızca öneri varsa görünür.
  if (rm.approach && rm.approach.items.length > 0) {
    push(rm.approach.title, [sentence(rm.approach.title), ...rm.approach.items.map((it) => `${sentence(it.title)} ${it.text}`)]);
  }
  // Haftalar bölümü ekranda her zaman görünür.
  {
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
