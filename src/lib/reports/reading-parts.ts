import { REPORT_TEMPLATES } from '@/content/reports';
import { ACCURACY_LABEL, ACCURACY_LABEL_YOU, COMPREHENSION_LABEL, COMPREHENSION_LABEL_YOU, SKILL_LABELS, prosodyLabel } from '@/content/reports/sesli-okuma';
import type { Band, OralPassage, OralReadingInstrument, ReadingInstrument, ReadingPassage, ReadingQuestion } from '@/lib/instruments/types';
import { MIN_MATCH_SHARE } from '@/lib/oral/auto';
import { oralTokens } from '@/lib/oral/words';
import {
  LONG_PAUSE_MS,
  MIN_LISTENED,
  ORAL_MAX_WPM,
  PAUSE_MS,
  UNCLEAR_HIGH,
  UNCLEAR_MAX,
  UNFINISHED_MIN,
  comprehensionLevel,
  type OralLevel,
  type OralMarkedToken,
  type OralResult,
} from '@/lib/scoring/oral';
import { EFFECTIVE_MIN_RATIO, READING_TOO_SLOW, chanceLike, comprehensionBand, readingPace, type ReadingResult } from '@/lib/scoring/reading';
import { DEFAULT_BAND_LABELS } from './bands';
import type { Audience, ReportContent } from './build';
import { accuracyGauge, halfUnread, rateCompared } from './oral';
import { NUMBER_WORDS, WARN_MEANING, cap, checkCard, checksSummary, countText, hasWarn, nf0, nf1, spokenCount } from './part-kit';
import type { PartCard, PartRow, ReportPart } from './parts';
import { niceMax } from './visual-draw';
import { cellRange, type CellsVisual, type GridMark, type GridVisual, type WordMapVisual, type WordMark } from './visual-cells';
import type { BarsVisual, GaugeVisual, MeterVisual, StackVisual, StripVisual, Zone } from './visuals';

/**
 * Okuma Hızı ve Anlama ile Sesli Okuma Değerlendirmesinin ek rapor bölümleri (site sahibinin 2026-10-31 isteği; model
 * lib/reports/parts.ts):
 *  1. "Düzeylerin ve ölçülerin anlamı": her ölçünün (anlama, soru türleri, okuma hızı, anlayarak okuma hızı; sesli okumada
 *     doğru okuma oranı, anlama, dakikada doğru kelime, akıcılık, yeniden anlatma, duraklamalar) ne anlattığı ve nasıl
 *     hesaplandığı; kişinin değeri testin kendi sınırlarıyla grafikte. Türkiye normu olmayan yerde karşılaştırma yapılmaz;
 *     sesli okumada hız yalnızca raporun zaten kullandığı Erden ve ark. (2002) ortalamasıyla, aynı koşullarda karşılaştırılır.
 *  2. Soru soru (sesli okumada cümle cümle) cevaplar: her soru, verilen ve doğru cevap, soru türü; sesli okumada metin
 *     haritası (her kelimenin durumu), işaretli cümleler, sorular ve yeniden anlatmada söylenen fikirler. Bunlar kişisel
 *     ifadeler değil, performanstır: veli raporunda da vardır. Ekranda kapalı kutular, PDF'te ek.
 *  3. "Sonuca ne kadar güvenebiliriz?": uyarı kutusundaki denetimler kart kart, grafikle; sınırlar uyarılarla ortaktır
 *     (READING_PACE, READING_TOO_SLOW, chanceLike; UNCLEAR_HIGH, UNCLEAR_MAX, MIN_MATCH_SHARE, MIN_LISTENED, ORAL_MAX_WPM,
 *     UNFINISHED_MIN). Kart ve uyarı hiçbir zaman çelişmez (tests/rapor-bolumleri-okuma.test.ts).
 * Dil: öğrenciye "sen", veliye "çocuğunuz"; sesli okumanın veli ve öğretmen raporu raporun geri kalanı gibi öğrenciden
 * üçüncü kişi olarak söz eder. Tanı ya da kesin hüküm yok; cümleler kısa.
 */

type Voice = { you: string; parent: string };
const v2 = (audience: Audience, t: Voice) => (audience === 'parent' ? t.parent : t.you);

/** Grafikteki sayı (Türkçe, binlik ayraçsız). */
const n0 = (x: number) => nf0.format(x).replace(/\./g, '');

/** Sayımın düzeyleri: art arda aynı düzeydeki değerler tek bölge (tam sayı aralığı). */
function cellZones<K extends string>(min: number, max: number, level: (k: number) => K, label: (l: K) => string): { zones: CellsVisual['zones']; keys: K[] } {
  const zones: CellsVisual['zones'] = [];
  const keys: K[] = [];
  for (let k = min; k <= max; k++) {
    const l = level(k);
    if (keys[keys.length - 1] === l) zones[zones.length - 1].to = k;
    else {
      zones.push({ from: k, to: k, label: label(l) });
      keys.push(l);
    }
  }
  return { zones, keys };
}

/** Düzeylerin sınırlarının sözle okunuşu ("Zorlandı 0–3 doğru; …"). */
const zonesSpoken = (zones: CellsVisual['zones'], unit: string) => `Düzeylerin sınırları: ${zones.map((z) => `${z.label} ${cellRange(z)} ${unit}`).join('; ')}.`;

/** Soru kutuları: satırlar soru türleri (sorunun testteki sırası kutuda). */
function questionGrid(label: string, questions: Pick<ReadingQuestion, 'skill'>[], mark: (i: number) => GridMark): GridVisual {
  const order: ReadingQuestion['skill'][] = ['literal', 'inference', 'vocabulary', 'main_idea'];
  const rows = order
    .map((skill) => ({ label: SKILL_LABELS[skill], cells: questions.flatMap((q, i) => (q.skill === skill ? [{ text: String(i + 1), mark: mark(i) }] : [])) }))
    .filter((r) => r.cells.length > 0);
  const used = new Set(rows.flatMap((r) => r.cells.map((c) => c.mark)));
  const legend: GridVisual['legend'] = [
    { mark: 'on', text: 'doğru' },
    { mark: 'off', text: 'yanlış' },
    { mark: 'skip', text: 'boş' },
  ];
  return { type: 'grid', label, rows, legend: legend.filter((l) => l.mark === 'on' || used.has(l.mark)) };
}

/** Bir sorunun satırı: soru, verilen cevap, doğru ya da yanlış, (yanlışsa) doğru cevap ve sorunun türü. */
function questionRow(q: ReadingQuestion | OralPassage['questions'][number], no: number, chosen: string | undefined): PartRow {
  const opt = (k: string) => q.options.find((o) => o.key === k)?.text ?? '';
  const correct = chosen === q.answer;
  const skill = SKILL_LABELS[q.skill];
  if (chosen === undefined) return { no, text: q.text, value: 'Cevaplanmadı', tags: [`doğru cevap: ${opt(q.answer)}`, skill], muted: true };
  return { no, text: q.text, value: opt(chosen), tags: [correct ? 'doğru' : 'yanlış', ...(correct ? [] : [`doğru cevap: ${opt(q.answer)}`]), skill] };
}

const SKILL_MEANING: Record<ReadingQuestion['skill'], string> = {
  literal: 'Metinde açıkça yazan bir bilgiyi hatırlamayı ister.',
  inference: 'Metinde açıkça yazmayanı ipuçlarından bulmayı ister.',
  vocabulary: 'Bir kelimenin metindeki anlamını sorar.',
  main_idea: 'Metnin bütün olarak ne anlattığını sorar.',
};

/** Soru türlerinin anlamı ve sonuçları (okuma ve sesli okuma). */
function skillsCard(skills: Record<ReadingQuestion['skill'], { correct: number; total: number }>): PartCard {
  const rows = (Object.keys(SKILL_MEANING) as ReadingQuestion['skill'][]).filter((k) => skills[k].total > 0);
  const visual: BarsVisual = {
    type: 'bars',
    label: 'Soru türlerine göre doğru cevaplar',
    scale: 'share',
    rows: rows.map((k) => ({ label: SKILL_LABELS[k], value: skills[k].correct, max: skills[k].total, valueLabel: `${skills[k].correct}/${skills[k].total}` })),
  };
  return {
    key: 'skills',
    title: 'Soru türleri',
    text: [
      ...rows.map((k) => `${SKILL_LABELS[k]}: ${SKILL_MEANING[k].charAt(0).toLocaleLowerCase('tr-TR')}${SKILL_MEANING[k].slice(1)}`),
      'Her türde az soru var; tek bir soru sonucu çok değiştirir. Bu yüzden türler arasındaki farklar kaba bir fikir verir.',
    ].join('\n\n'),
    note: 'Her çubuk bir soru türüdür; dolu kısım doğru cevapların payını gösterir.',
    visual,
    spoken: rows.map((k) => `${SKILL_LABELS[k]}: ${skills[k].correct} / ${skills[k].total}.`),
  };
}

/** Seçenek sayısının sözle yazılışı ve tahminle doğru bulma şansı ("dörtte birdir"). */
const CHANCE_WORDS: Record<number, string> = { 2: 'yarıdır', 3: 'üçte birdir', 4: 'dörtte birdir', 5: 'beşte birdir' };

/* ======================= Okuma Hızı ve Anlama ======================= */

/** "Çok uzun okuma süresi" çubuğunun ekseninin en çoğu (dakikada kelime): daha genişte "15" ile "0" üst üste biner. */
export const SLOW_AXIS_MAX = 450;

export function readingParts(input: {
  def: ReadingInstrument;
  passage: ReadingPassage;
  answers: Record<string, string>;
  result: ReadingResult;
  content: ReportContent;
}): ReportPart[] {
  const { def, passage, answers, result: rr, content } = input;
  const a = content.audience;
  const v = (t: Voice) => v2(a, t);
  const lim = readingPace(passage);
  const tooFast = rr.flags.tooFast;
  const tooSlow = rr.flags.tooSlow;
  const speedRead = !tooFast && !tooSlow;
  const wpm = rr.wpm;
  const top = niceMax(lim.max * 1.25);

  /* ---------- 3. Sonuca ne kadar güvenebiliriz? (önce: düzeyler bölümü "Dikkat"i anar) ---------- */
  // Çubuğun ekseni hızı içine alır (çok yüksek hızda en çok dört katına kadar; daha ötesi sağ uçta).
  const fastTop = Math.min(top * 4, Math.max(top, niceMax(wpm * 1.05)));
  const fastVisual: MeterVisual = {
    type: 'meter',
    label: 'Dakikada okunan kelime',
    min: 0,
    max: fastTop,
    zones: [
      { from: 0, to: lim.max, label: 'Uygun', warn: false },
      { from: lim.max, to: fastTop, label: 'Çok hızlı', warn: true },
    ],
    rows: [{ label: v({ you: 'Okuma hızın', parent: 'Okuma hızı' }), value: wpm, valueLabel: `${n0(wpm)} kelime` }],
  };
  const knew = tooFast && rr.correct >= rr.total * EFFECTIVE_MIN_RATIO - 1e-9;
  const fastCard = checkCard('fast', 'Çok kısa okuma süresi', tooFast ? 'warn' : 'ok', {
    text: [
      'Metnin düzeyine göre çok kısa bir sürede metnin hepsini okumak mümkün değildir.',
      'O zaman metin göz gezdirilerek geçilmiş sayılır ve hız yorumlanmaz.',
      tooFast
        ? v({ you: 'Metni çok kısa sürede geçtin; bu yüzden hızın yorumlanmadı.', parent: 'Metin çok kısa sürede geçildi; bu yüzden hız yorumlanmadı.' })
        : v({
            you: 'Hızın, çok hızlı sayılan sınırın altında kaldı; metni okumaya yetecek kadar zaman ayırmışsın.',
            parent: 'Hız, çok hızlı sayılan sınırın altında kaldı; metni okumaya yetecek kadar zaman ayrılmış.',
          }),
      ...(knew
        ? [
            v({
              you: 'Buna rağmen soruların çoğu doğru; konuyu önceden biliyor olabilirsin. O zaman anlama sonucu, metinden çok önceki bilgini gösterebilir.',
              parent: 'Buna rağmen soruların çoğu doğru; konu önceden biliniyor olabilir. O zaman anlama sonucu, metinden çok önceki bilgiyi gösterebilir.',
            }),
          ]
        : []),
    ].join(' '),
    note: 'Kırmızı çizgi hızı, renkli bölge çok hızlı geçmeyi gösterir.',
    visual: fastVisual,
    spoken: [`${v({ you: 'Okuma hızın', parent: 'Okuma hızı' })}: dakikada ${n0(wpm)} kelime.`, `Çok hızlı sayılan: dakikada ${lim.max} kelimenin üstü.`],
  });
  // Eksen hızı içine alır; ama en çok 450: daha geniş eksende sınırın sayısı (15) sıfırın üstüne biner. Çok hızlı geçilen
  // metinde (bu denetim zaten uygun) hız sağ uçta kalabilir.
  const slowTop = Math.min(top, SLOW_AXIS_MAX, Math.max(60, lim.slow, niceMax(wpm * 1.1)));
  const slowCard = checkCard('slow', 'Çok uzun okuma süresi', tooSlow ? 'warn' : 'ok', {
    text: [
      'Çok yavaş bir okuma, okurken uzun bir ara verildiğini düşündürür.',
      'O zaman ölçülen süre okumayı yansıtmaz ve hız yorumlanmaz.',
      tooSlow
        ? v({
            you: 'Okuma süren çok uzun ölçüldü; ara vermiş olabilirsin ya da metni okumak uzun sürmüş olabilir. Bu yüzden hızın yorumlanmadı.',
            parent: 'Okuma süresi çok uzun ölçüldü; okurken ara verilmiş olabilir ya da metni okumak uzun sürmüş olabilir. Bu yüzden hız yorumlanmadı.',
          })
        : v({ you: 'Okumana ara verilmiş gibi görünmüyor.', parent: 'Okumaya ara verilmiş gibi görünmüyor.' }),
    ].join(' '),
    note: 'Kırmızı çizgi hızı, renkli bölge çok yavaş okumayı gösterir.',
    visual: {
      type: 'meter',
      label: 'Dakikada okunan kelime',
      min: 0,
      max: slowTop,
      zones: [
        { from: 0, to: READING_TOO_SLOW, label: 'Çok yavaş', warn: true },
        { from: READING_TOO_SLOW, to: slowTop, label: 'Uygun', warn: false },
      ],
      rows: [{ label: v({ you: 'Okuma hızın', parent: 'Okuma hızı' }), value: wpm, valueLabel: `${n0(wpm)} kelime` }],
    },
    spoken: [`Çok yavaş sayılan: dakikada ${READING_TOO_SLOW} kelimenin altı.`],
  });
  const k = Math.max(...passage.questions.map((q) => q.options.length));
  const chance = chanceLike(rr.correct, rr.total);
  const chanceMax = Math.floor((rr.total * 3) / 8 + 1e-9);
  const chanceCard = checkCard('chance', 'Tahminle gelebilecek doğrular', chance ? 'warn' : 'ok', {
    text: [
      `${cap(NUMBER_WORDS[k] ?? String(k))} seçenekli bir soruda tahminle doğruyu bulma şansı ${CHANCE_WORDS[k] ?? `${k}'de birdir`}.`,
      'Bu yüzden birkaç doğru, soruları okumadan işaretleyerek de gelebilir.',
      chance
        ? v({
            you: 'Doğru cevap sayın tahminle de çıkabilecek kadar az; bu yüzden sonuç, neyi anlayıp neyi anlamadığını tam göstermez.',
            parent: 'Doğru cevap sayısı tahminle de çıkabilecek kadar az; bu yüzden sonuç, çocuğunuzun neyi anlayıp neyi anlamadığını tam göstermez.',
          })
        : rr.correct >= chanceMax + 2
          ? v({ you: 'Doğru cevapların tahminle beklenenin belirgin biçimde üstünde.', parent: 'Doğru cevaplar tahminle beklenenin belirgin biçimde üstünde.' })
          : v({ you: 'Doğru cevapların tahminle beklenenin üstünde; ama sınıra yakın.', parent: 'Doğru cevaplar tahminle beklenenin üstünde; ama sınıra yakın.' }),
      ...(rr.correct === 0 ? ['Hiçbir soru doğru değil; sorular dikkatle okunmadan işaretlenmiş olabilir.'] : []),
    ].join(' '),
    note: 'Kırmızı çizgi doğru sayısını, renkli bölge tahminle de çıkabilecek sonuçları gösterir.',
    visual: {
      type: 'meter',
      label: 'Doğru cevaplar',
      min: 0,
      max: rr.total,
      zones: [
        { from: 0, to: chanceMax + 0.5, label: 'Tahmin olabilir', warn: true },
        { from: chanceMax + 0.5, to: rr.total, label: 'Tahminin üstünde', warn: false },
      ],
      rows: [{ label: v({ you: 'Doğru cevapların', parent: 'Doğru cevaplar' }), value: rr.correct, valueLabel: `${rr.correct} doğru` }],
      discrete: true,
    },
    spoken: [`${v({ you: 'Doğru cevapların', parent: 'Doğru cevaplar' })}: ${spokenCount(rr.correct)}.`, `Tahminle de çıkabilecek sonuç: ${chanceMax} doğruya kadar.`],
  });
  const checks = [fastCard, slowCard, chanceCard];
  const quality: ReportPart = {
    key: 'quality',
    title: 'Sonuca ne kadar güvenebiliriz?',
    intro: [
      v({ you: 'Bu bölüm, sonucun okumanı ne kadar iyi yansıttığını denetler.', parent: 'Bu bölüm, sonucun çocuğunuzun okumasını ne kadar iyi yansıttığını denetler.' }),
      WARN_MEANING,
      checksSummary(checks, v({ you: 'Senin sonucunda denetimlerin hepsi uygun çıktı.', parent: 'Çocuğunuzun sonucunda denetimlerin hepsi uygun çıktı.' })),
    ].join(' '),
    groups: [{ cards: checks }],
  };

  /* ---------- 1. Düzeylerin ve ölçülerin anlamı ---------- */
  const labels = REPORT_TEMPLATES[def.slug]?.bandLabels ?? {};
  const bandName = (b: Band) => labels[b] ?? DEFAULT_BAND_LABELS[b];
  const comp = cellZones(0, rr.total, (x) => comprehensionBand(x, rr.total), bandName);
  const COMP_TEXT: Partial<Record<Band, string>> = {
    low: 'Metnin önemli bölümleri anlaşılmamış olabilir.',
    average: 'Metnin bir kısmı anlaşılmış, bazı noktalar kaçmış.',
    high: 'Metin büyük ölçüde anlaşılmış.',
    very_high: 'Bütün sorular doğru: metin çok iyi anlaşılmış.',
  };
  const compActive = comp.keys.indexOf(rr.band);
  const compCard: PartCard = {
    key: 'comprehension',
    title: 'Anlama',
    badge: content.sections[0]?.bandLabel ?? bandName(rr.band),
    text: [
      v({
        you: 'Metin kapandıktan sonra sorulan sorulardan kaç tanesini doğru cevapladığına bakılır.',
        parent: 'Metin kapandıktan sonra sorulan sorulardan kaç tanesinin doğru cevaplandığına bakılır.',
      }),
      'Düzeyi doğru sayısı belirler. Sorular az olduğu için tek bir soru düzeyi değiştirebilir.',
    ].join(' '),
    note: v({ you: 'Her kutu bir doğru sayısıdır; dolu kutu senin sonucun, vurgulu kutular düzeyin.', parent: 'Her kutu bir doğru sayısıdır; dolu kutu çocuğunuzun sonucu, vurgulu kutular düzeyidir.' }),
    visual: { type: 'cells', label: 'Anlama: doğru cevaplar', min: 0, max: rr.total, value: rr.correct, valueLabel: `${rr.correct}/${rr.total}`, zones: comp.zones, active: compActive >= 0 ? compActive : null },
    levels: comp.keys.map((b, i) => ({ label: comp.zones[i].label, text: COMP_TEXT[b] ?? '', active: i === compActive })),
    spoken: [`${v({ you: 'Doğru cevapların', parent: 'Doğru cevaplar' })}: ${rr.correct} / ${rr.total}.`, zonesSpoken(comp.zones, 'doğru')],
  };

  const paceZones: Zone[] = [
    { from: 0, to: lim.slow, label: 'Yavaş', band: 'low' },
    { from: lim.slow, to: lim.fast, label: 'Olağan', band: 'average' },
    { from: lim.fast, to: lim.max, label: 'Hızlı', band: 'high' },
    { from: lim.max, to: top, label: 'Çok hızlı', band: 'very_high' },
  ];
  const paceActive = tooSlow ? null : tooFast ? 3 : rr.pace === 'slow' ? 0 : rr.pace === 'ok' ? 1 : 2;
  const PACE_TEXT = [
    'Metnin düzeyine göre yavaş. Dikkatli okumaktan da kaynaklanabilir; akıcılık çalışması yararlı olabilir.',
    'Metnin düzeyine göre olağan bir hız.',
    'Metnin düzeyine göre hızlı. Anlama da iyiyse güzel bir işaret; anlama zayıfsa yavaşlamak iyi gelir.',
    'Bu sürede metnin hepsi okunamaz; hız yorumlanmaz.',
  ];
  const paceGauge: GaugeVisual = {
    type: 'gauge',
    label: 'Dakikada okunan kelime',
    value: tooSlow ? null : wpm,
    min: 0,
    max: top,
    ciLow: null,
    ciHigh: null,
    valueLabel: n0(wpm),
    zones: paceZones,
    active: paceActive,
  };
  const speedCard: PartCard = {
    key: 'speed',
    title: 'Okuma hızı',
    badge: speedRead ? `Dakikada ${n0(wpm)} kelime` : 'Yorumlanmadı',
    text: [
      'Hız, metindeki kelime sayısının okuma süresine bölünmesiyle bulunur.',
      'Süre “Okumaya başla” ile “Okudum” düğmeleri arasında ölçülür; başka sekmede geçen süre sayılmaz.',
      'Sınırlar metnin düzeyine göre değişir ve Ölçekhane’nin deneme ölçütleridir.',
      v({
        you: 'Bildiğimiz kadarıyla sessiz okuma hızı için Türkiye’yi temsil eden bir ölçüt yayımlanmadı; bu yüzden hızın başka öğrencilerle karşılaştırılmaz.',
        parent: 'Bildiğimiz kadarıyla sessiz okuma hızı için Türkiye’yi temsil eden bir ölçüt yayımlanmadı; bu yüzden hız başka çocuklarla karşılaştırılmaz.',
      }),
      ...(tooSlow ? [v({ you: 'Okuma süren çok uzun ölçüldüğü için hızın yorumlanmadı.', parent: 'Okuma süresi çok uzun ölçüldüğü için hız yorumlanmadı.' })] : []),
      ...(tooFast ? [v({ you: 'Metni çok kısa sürede geçtiğin için hızın yorumlanmadı.', parent: 'Metin çok kısa sürede geçildiği için hız yorumlanmadı.' })] : []),
    ].join(' '),
    note: v({ you: 'Vurgulu bölge hızının bölgesi, kırmızı işaret hızındır.', parent: 'Vurgulu bölge hızın bölgesini, kırmızı işaret hızı gösterir.' }),
    visual: paceGauge,
    levels: paceZones.map((z, i) => ({ label: z.label, text: PACE_TEXT[i], active: i === paceActive })),
    activeLabel: v({ you: 'Senin hızın', parent: 'Çocuğunuzun hızı' }),
    spoken: [
      ...(tooSlow ? [] : [`${v({ you: 'Okuma hızın', parent: 'Okuma hızı' })}: dakikada ${n0(wpm)} kelime.`]),
      `Sınırlar: Yavaş, dakikada ${lim.slow} kelimenin altı; Olağan, ${lim.slow}–${lim.fast}; Hızlı, ${lim.fast}–${lim.max}; Çok hızlı, ${lim.max} kelimenin üstü.`,
    ],
  };

  const eff = rr.effectiveWpm;
  const effCard: PartCard = {
    key: 'effective',
    title: 'Anlayarak okuma hızı',
    badge: eff !== null ? `Dakikada ${n0(eff)} kelime` : 'Hesaplanmadı',
    text: [
      'Okuma hızını anlamayla birlikte gösterir: okuma hızı, şansla düzeltilmiş anlama oranıyla çarpılır.',
      'Şansla düzeltmede her üç yanlış ya da boş cevaba karşılık bir doğrunun tahminle gelmiş olabileceği kabul edilir.',
      'Bütün sorular doğruysa okuma hızına eşittir; yanlışlar arttıkça küçülür.',
      'Yalnızca hız yorumlanıyorsa ve soruların en az dörtte üçü doğruysa hesaplanır.',
      ...(eff === null
        ? [
            !speedRead
              ? 'Bu sefer hız yorumlanmadığı için hesaplanmadı.'
              : v({ you: 'Bu sefer doğru cevapların bu sınırın altında kaldığı için hesaplanmadı.', parent: 'Bu sefer doğru cevaplar bu sınırın altında kaldığı için hesaplanmadı.' }),
          ]
        : []),
    ].join(' '),
    // Hesaplanmayan ölçünün grafiği olmaz (CLAUDE.md "Kart grafikleri").
    ...(speedRead && eff !== null
      ? {
          visual: {
            type: 'bars',
            label: 'Dakikada kelime',
            scale: 'scale',
            unit: 'kelime',
            rows: [
              { label: 'Okuma hızı', value: wpm, valueLabel: n0(wpm) },
              { label: 'Anlayarak okuma hızı', value: eff, valueLabel: n0(eff) },
            ],
          } satisfies BarsVisual,
          // Anlayarak okuma hızı rozette okunur; burada yalnızca karşılaştırılan okuma hızı.
          spoken: [`Okuma hızı: dakikada ${n0(wpm)} kelime.`],
        }
      : {}),
  };

  const levels: ReportPart = {
    key: 'levels',
    title: 'Düzeylerin ve ölçülerin anlamı',
    intro: [
      v({
        you: 'Bu bölüm her ölçünün ne anlattığını ve nasıl hesaplandığını anlatır; senin sonucun grafiklerde işaretli.',
        parent: 'Bu bölüm her ölçünün ne anlattığını ve nasıl hesaplandığını anlatır; çocuğunuzun sonucu grafiklerde işaretli.',
      }),
      v({
        you: 'Sınırlar Ölçekhane’nin deneme ölçütleridir; sonucun başka öğrencilerle karşılaştırılmaz.',
        parent: 'Sınırlar Ölçekhane’nin deneme ölçütleridir; sonuç başka çocuklarla karşılaştırılmaz.',
      }),
      ...(hasWarn(quality)
        ? [v({ you: 'Güven denetimlerinde “Dikkat” olduğu için sonuçlarını dikkatle oku.', parent: 'Güven denetimlerinde “Dikkat” olduğu için sonuçları dikkatle okuyun.' })]
        : []),
    ].join(' '),
    groups: [{ cards: [compCard, skillsCard(rr.skills), speedCard, effCard] }],
  };

  /* ---------- 2. Cevaplar soru soru ---------- */
  const qs = passage.questions;
  const grid = questionGrid('Sorular', qs, (i) => (answers[qs[i].key] === undefined ? 'skip' : answers[qs[i].key] === qs[i].answer ? 'on' : 'off'));
  const answersPart: ReportPart = {
    key: 'answers',
    title: v({ you: 'Cevapların soru soru', parent: 'Çocuğunuzun cevapları soru soru' }),
    intro: [
      v({
        you: 'Metin kapandıktan sonra sorulan her soru, verdiğin cevap ve sorunun türü aşağıda. Yanlış cevaplarda doğru cevap da yazıyor.',
        parent: 'Metin kapandıktan sonra sorulan her soru, çocuğunuzun cevabı ve sorunun türü aşağıda. Yanlış cevaplarda doğru cevap da yazıyor.',
      }),
      v({
        you: 'Testi yeniden çözersen aynı metin ve sorular gelir; doğru cevapları gördüğün için sonuç yüksek çıkabilir.',
        parent: 'Test yeniden çözülürse aynı metin ve sorular gelir; doğru cevaplar görüldüğü için sonuç yüksek çıkabilir.',
      }),
      v({
        you: 'Cevapların yalnızca bu sayfada ve indirdiğin PDF dosyasında görünür; hiçbir yerde saklanmaz.',
        parent: 'Cevaplar yalnızca bu sayfada ve indirilen PDF dosyasında görünür; hiçbir yerde saklanmaz.',
      }),
    ].join(' '),
    groups: [
      {
        cards: [
          {
            key: 'questions',
            title: 'Sorular',
            badge: `${rr.correct}/${rr.total} doğru`,
            note: 'Her kutu bir sorudur; kutudaki sayı sorunun sırasıdır. Satırlar soru türleridir.',
            visual: grid,
            rows: qs.map((q, i) => questionRow(q, i + 1, answers[q.key])),
            rowsHead: { item: 'soru', value: v({ you: 'Cevabın', parent: 'Verilen cevap' }) },
          },
        ],
      },
    ],
    collapsed: true,
    appendix: true,
  };

  return [levels, answersPart, quality];
}

/* ======================= Sesli Okuma Değerlendirmesi ======================= */

/** Kelimenin noktalamasız hâli. */
const bare = (t: string) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}’']+$/gu, '');

interface SentenceWord {
  /** Kelimenin metindeki sırası (0'dan). */
  i: number;
  text: string;
  m: OralMarkedToken;
}

/**
 * Metnin cümleleri: nokta, ünlem, soru ya da üç noktayla (ardından tırnak ya da ayraç gelebilir) biten kelimeden sonra, bir
 * sonraki kelime büyük harfle, rakamla ya da açılan tırnak veya tireyle başlıyorsa yeni cümle başlar; paragraf sonu da cümleyi
 * bitirir ("“Hadi!” dedi Ali." tek cümledir).
 */
export function oralSentences(passage: Pick<OralPassage, 'paragraphs'>, marked: OralMarkedToken[][]): SentenceWord[][] {
  const out: SentenceWord[][] = [];
  oralTokens(passage.paragraphs).forEach((para, p) => {
    let cur: SentenceWord[] = [];
    para.forEach((t, j) => {
      cur.push({ i: t.i, text: t.text, m: marked[p]?.[j] ?? { text: t.text } });
      const next = para[j + 1];
      const ends = /[.!?…]["”’»)]*$/u.test(t.text) && (!next || /^["“‘«(—–-]?[\p{Lu}\d]|^["“‘«—–-]/u.test(next.text));
      if (ends || !next) {
        out.push(cur);
        cur = [];
      }
    });
  });
  return out;
}

export function oralParts(input: {
  def: OralReadingInstrument;
  passage: OralPassage;
  result: OralResult;
  audience: Audience;
  grade: number;
  /** Soruların cevapları (soru anahtarı → seçenek). */
  answers: Record<string, string>;
  /** Yetişkinin işaretlediği sürümde kaydın dinlenen oranı (0–1). */
  listened?: number;
}): ReportPart[] {
  const { def, passage, result: r, audience: a, grade } = input;
  const you = a !== 'parent';
  const v = (t: Voice) => v2(a, t);
  const auto = r.flags.auto;
  const c = r.counts;

  /* ---------- 3. Sonuca ne kadar güvenebiliriz? ---------- */
  const checks: PartCard[] = [];
  if (auto) {
    const pct = (c.unclear / r.wordCount) * 100;
    const shown = Math.round(pct * 10) / 10;
    checks.push(
      checkCard('unclear', 'Yapay zekânın okumayı anlaması', r.flags.unclearHigh ? 'warn' : 'ok', {
        text: [
          'Yapay zekâ okumayı yazıya döker ve metindeki kelimelerle karşılaştırır.',
          'Net ayırt edemediği kelimeler hata sayılmaz; ama çok olursa sonuç yaklaşık olur.',
          `Okuma metinle eşleşmeseydi rapor verilmezdi: tanınan kelimelerin en az %${Math.round(MIN_MATCH_SHARE * 100)}’u metinde olmalı.`,
          'Net anlaşılamayan kelime çok olsaydı da rapor verilmez, yeniden okuma istenirdi.',
          r.flags.unclearHigh
            ? v({
                you: 'Yapay zekâ okumanda birçok kelimeyi net ayırt edemedi; bu yüzden sonuçların yaklaşık. Sessiz bir yerde yeniden okursan daha net bir sonuç alırsın.',
                parent: 'Yapay zekâ bu okumada birçok kelimeyi net ayırt edemedi; doğru okuma oranı ve dakikada doğru okunan kelime olduğundan yüksek görünebilir.',
              })
            : v({ you: 'Net anlaşılamayan kelimeler az; bu açıdan bir sorun görünmüyor.', parent: 'Net anlaşılamayan kelimeler az; bu açıdan bir sorun görünmüyor.' }),
        ].join(' '),
        note: 'Kırmızı çizgi net anlaşılamayan kelimelerin payını, renkli bölgeler uyarı ve rapor verilmeyen bölgeyi gösterir.',
        visual: {
          type: 'meter',
          label: 'Net anlaşılamayan kelimeler',
          min: 0,
          max: Math.round(UNCLEAR_MAX * 100) + 10,
          zones: [
            { from: 0, to: UNCLEAR_HIGH * 100, label: 'Uygun', warn: false },
            { from: UNCLEAR_HIGH * 100, to: UNCLEAR_MAX * 100, label: 'Dikkat', warn: true },
            { from: UNCLEAR_MAX * 100, to: Math.round(UNCLEAR_MAX * 100) + 10, label: 'Rapor yok', warn: true },
          ],
          rows: [{ label: 'Kelimelerin payı', value: pct, valueLabel: `%${nf1.format(shown)}` }],
        },
        spoken: [
          `Net anlaşılamayan kelimeler: ${spokenCount(c.unclear, 'kelime')}, yüzde ${nf1.format(shown)}.`,
          `Dikkat sınırı: yüzde ${Math.round(UNCLEAR_HIGH * 100)}'un üstü. Yüzde ${Math.round(UNCLEAR_MAX * 100)}'un üstünde rapor verilmez.`,
        ],
      }),
    );
  } else if (input.listened !== undefined) {
    const heard = Math.floor(input.listened * 100 + 1e-9);
    checks.push(
      checkCard('listen', 'Kaydın dinlenmesi', r.flags.partialListen ? 'warn' : 'ok', {
        text: [
          'Hataları işaretleyen yetişkin kaydı dinler.',
          'Kaydın bir kısmı dinlenmeden işaretlenirse o kısımdaki hatalar gözden kaçabilir.',
          r.flags.partialListen
            ? v({
                you: 'Kaydının bir kısmı dinlenmeden işaretleme yapıldı; bu yüzden sonuçlar tam olmayabilir.',
                parent: 'Kaydın bir kısmı dinlenmeden işaretleme yapıldı; doğru okuma oranı olduğundan yüksek görünebilir.',
              })
            : 'Kaydın tamamı ya da tamamına yakını dinlendi.',
        ].join(' '),
        note: 'Kırmızı çizgi kaydın dinlenen kısmını, renkli bölge uyarı bölgesini gösterir.',
        visual: {
          type: 'meter',
          label: 'Kaydın dinlenen kısmı',
          min: 0,
          max: 100,
          zones: [
            { from: 0, to: MIN_LISTENED * 100, label: 'Dikkat', warn: true },
            { from: MIN_LISTENED * 100, to: 100, label: 'Uygun', warn: false },
          ],
          rows: [{ label: 'Dinlenen kısım', value: heard, valueLabel: `%${heard}` }],
        },
        spoken: [`Kaydın dinlenen kısmı: yüzde ${heard}.`, `Uyarı: dinlenen kısım yüzde ${Math.round(MIN_LISTENED * 100)}'ın altındaysa.`],
      }),
    );
  }
  const timingWarn = r.flags.tooFast || r.flags.manualTiming || r.flags.interrupted;
  const timingTop = niceMax(ORAL_MAX_WPM * 1.2);
  checks.push(
    checkCard('timing', 'Okuma süresi', timingWarn ? 'warn' : 'ok', {
      text: [
        r.flags.manualTiming
          ? r.flags.tooFast
            ? 'Süre, düğmelere basılan anlara göre ölçüldü.'
            : 'Kayıtta okumanın başı ve sonu ayırt edilemediği için süre, düğmelere basılan anlara göre ölçüldü. Bu yüzden hız olduğundan biraz düşük çıkmış olabilir.'
          : 'Süre, kayıttaki ilk sesten son sese ölçüldü; baştaki ve sondaki sessizlik sayılmadı.',
        ...(r.flags.interrupted ? ['Kayıt sırasında bir kesinti oldu (ör. ekran kapandı); süre ve hız doğru ölçülmemiş olabilir.'] : []),
        'Sesli okumada çok yüksek bir hız inandırıcı değildir; metnin tamamı okunmamış ya da kayıt erken bitirilmiş olabilir.',
        r.flags.tooFast
          ? v({
              you: 'Okuma süren metnin uzunluğuna göre çok kısa; bu yüzden hızın hesaplanmadı.',
              parent: 'Okuma süresi metnin uzunluğuna göre çok kısa; bu yüzden hız hesaplanmadı.',
            })
          : v({ you: 'Hızın inandırıcı sınırlar içinde.', parent: 'Hız inandırıcı sınırlar içinde.' }),
      ].join(' '),
      note: 'Kırmızı çizgi hızı, renkli bölge inandırıcı olmayan hızı gösterir.',
      visual: {
        type: 'meter',
        label: 'Dakikada okunan kelime',
        min: 0,
        max: timingTop,
        zones: [
          { from: 0, to: ORAL_MAX_WPM, label: 'Uygun', warn: false },
          { from: ORAL_MAX_WPM, to: timingTop, label: 'Çok hızlı', warn: true },
        ],
        rows: [{ label: v({ you: 'Okuma hızın', parent: 'Okuma hızı' }), value: r.wpm, valueLabel: `${n0(r.wpm)} kelime` }],
      },
      spoken: [`Dakikada okunan bütün kelime: ${n0(r.wpm)}.`, `İnandırıcı olmayan hız: dakikada ${ORAL_MAX_WPM} kelimenin üstü.`],
    }),
  );
  const read = r.wordCount - r.unread;
  const fromRead = r.readWords < r.wordCount;
  checks.push(
    checkCard('finish', 'Metnin sonuna kadar okuma', r.flags.unfinished ? 'warn' : 'ok', {
      text: [
        'Okuma metin bitmeden durursa sonuç metnin bir kısmına dayanır.',
        `Metnin sonunda en az ${NUMBER_WORDS[UNFINISHED_MIN]} kelime art arda atlanırsa okuma orada durmuş sayılır.`,
        !r.flags.unfinished
          ? v({ you: 'Metni sonuna kadar okudun.', parent: 'Metin sonuna kadar okundu.' })
          : fromRead
            ? v({
                you: 'Metnin son kısmını okumadın; doğru okuma oranın ve hızın okuduğun kısımdan hesaplandı.',
                parent: 'Metnin son kısmı okunmadı; doğru okuma oranı ve hız okunan kısımdan hesaplandı.',
              })
            : v({
                you: 'Metnin yarısından azını okuduğun için okumadığın kelimeler atlama sayıldı.',
                parent: 'Metnin yarısından azı okunduğu için okunmayan kelimeler atlama sayıldı; doğru okuma oranı bu yüzden düşük çıktı.',
              }),
      ].join(' '),
      visual: {
        type: 'stack',
        label: 'Metnin okunan kısmı',
        total: r.wordCount,
        parts: [
          { label: 'Okunan kelime', value: read },
          { label: 'Okunmayan kelime', value: r.unread },
        ],
      } satisfies StackVisual,
      spoken: [`Okunan kelime: ${spokenCount(read)}. Okunmayan kelime: ${spokenCount(r.unread)}.`],
    }),
  );
  const quality: ReportPart = {
    key: 'quality',
    title: 'Sonuca ne kadar güvenebiliriz?',
    intro: [
      v({ you: 'Bu bölüm, sonucun okumanı ne kadar iyi yansıttığını denetler.', parent: 'Bu bölüm, sonucun öğrencinin okumasını ne kadar iyi yansıttığını denetler.' }),
      WARN_MEANING,
      checksSummary(checks, v({ you: 'Senin sonucunda denetimlerin hepsi uygun çıktı.', parent: 'Bu okumada denetimlerin hepsi uygun çıktı.' })),
    ].join(' '),
    groups: [{ cards: checks }],
  };

  /* ---------- 1. Düzeylerin ve ölçülerin anlamı ---------- */
  const order: OralLevel[] = ['hard', 'support', 'easy'];
  const whose = you ? undefined : 'Öğrencinin düzeyi';
  const accLabels = you ? ACCURACY_LABEL_YOU : ACCURACY_LABEL;
  const ACC_TEXT: Record<OralLevel, string> = {
    hard: 'Kelimelerin bir kısmında zorlanma var; bu metin şimdilik zor.',
    support: 'Bazı kelimelerde takılma var; metin destekle okunabilir.',
    easy: 'Kelimelerin hemen hepsi doğru; metin tek başına okunabilir.',
  };
  const accValue = nf1.format(Math.floor(r.accuracyPct * 10 + 1e-9) / 10);
  const accCard: PartCard = {
    key: 'accuracy',
    title: 'Doğru okuma oranı',
    badge: accLabels[r.accuracyLevel],
    text: [
      'Metindeki kelime sayısından hatalar çıkarılır; kalan, kelime sayısına bölünür.',
      ...(r.readWords < r.wordCount ? ['Okuma metin bitmeden durduğu için yalnızca okunan kısım sayıldı.'] : []),
      `Yanlış okuma, atlama${auto ? '' : ', yardımla okuma'} ve metne kelime ekleme hata sayılır.`,
      v({ you: 'Kendi düzeltmen, tekrar, heceleme ve duraksama hata sayılmaz.', parent: 'Öğrencinin kendi düzelttiği okuma, tekrar, heceleme ve duraksama hata sayılmaz.' }),
      ...(auto ? ['Yapay zekânın net anlayamadığı kelimeler hata sayılmaz; doğru okunmuş gibi hesaba katılır.'] : []),
    ].join(' '),
    note: v({ you: 'Vurgulu bölge düzeyin, kırmızı işaret doğru okuma oranındır.', parent: 'Vurgulu bölge düzeyi, kırmızı işaret doğru okuma oranını gösterir.' }),
    visual: accuracyGauge(r, accLabels),
    levels: order.map((l) => ({ label: accLabels[l], text: ACC_TEXT[l], active: l === r.accuracyLevel })),
    ...(whose ? { activeLabel: whose } : {}),
    spoken: [`Doğru okuma oranı: %${accValue}.`, 'Sınırlar: %90 ve %97.'],
  };

  const cm = r.comprehension;
  const compLabels = you ? COMPREHENSION_LABEL_YOU : COMPREHENSION_LABEL;
  const compZones = cellZones(0, cm.total, (k) => comprehensionLevel((k / cm.total) * 100), (l) => compLabels[l]);
  const COMP_TEXT: Record<OralLevel, string> = {
    hard: 'Soruların önemli bir kısmında zorlanma var.',
    support: 'Metin büyük ölçüde anlaşılmış; bazı noktalar kaçmış.',
    easy: 'Metin iyi anlaşılmış.',
  };
  const compActive = compZones.keys.indexOf(cm.level);
  const compCard: PartCard = {
    key: 'comprehension',
    title: 'Okuduğunu anlama',
    badge: compLabels[cm.level],
    text: [
      v({
        you: 'Metin kapandıktan sonra sorulan sorulardan kaç tanesini doğru cevapladığına bakılır.',
        parent: 'Metin kapandıktan sonra sorulan sorulardan kaç tanesinin doğru cevaplandığına bakılır.',
      }),
      'Sorular az olduğu için tek bir soru düzeyi değiştirebilir.',
      v({
        you: 'Soru türlerine göre sonuçların yukarıda, “Okuduğunu anlaman” bölümünde.',
        parent: 'Soru türlerine göre sonuçlar yukarıda, “Okuduğunu anlama” bölümünde.',
      }),
    ].join(' '),
    note: v({ you: 'Her kutu bir doğru sayısıdır; dolu kutu senin sonucun, vurgulu kutular düzeyin.', parent: 'Her kutu bir doğru sayısıdır; dolu kutu öğrencinin sonucu, vurgulu kutular düzeyidir.' }),
    visual: { type: 'cells', label: 'Anlama: doğru cevaplar', min: 0, max: cm.total, value: cm.correct, valueLabel: `${cm.correct}/${cm.total}`, zones: compZones.zones, active: compActive >= 0 ? compActive : null },
    levels: compZones.keys.map((l, i) => ({ label: compZones.zones[i].label, text: COMP_TEXT[l], active: i === compActive })),
    ...(whose ? { activeLabel: whose } : {}),
    spoken: [`Doğru cevaplar: ${cm.correct} / ${cm.total}.`, zonesSpoken(compZones.zones, 'doğru')],
  };

  // Soru türlerinin sonuçları sesli okuma bölümünde ("Okuduğunu anlama") zaten var: burada yinelenmez.
  const levelCards: PartCard[] = [accCard, compCard];
  const sources: NonNullable<ReportPart['sources']> = [];
  const ref = def.referenceRates.find((x) => x.grade === grade);
  if (r.flags.tooFast) {
    levelCards.push({
      key: 'rate',
      title: 'Dakikada doğru okunan kelime',
      badge: 'Hesaplanmadı',
      text: [
        'Doğru okunan kelimelerin okuma süresine bölünmesiyle bulunur; hem doğruluğu hem hızı birlikte gösterir.',
        v({ you: 'Okuma süren metnin uzunluğuna göre çok kısa olduğu için hesaplanmadı.', parent: 'Okuma süresi metnin uzunluğuna göre çok kısa olduğu için hesaplanmadı.' }),
      ].join(' '),
    });
  } else {
    const compared = rateCompared(r, def, grade);
    const lo = ref ? Math.max(0, ref.wpm - ref.sd) : 0;
    const hi = ref ? ref.wpm + ref.sd : 0;
    const parts = [
      'Doğru okunan kelimelerin okuma süresine bölünmesiyle bulunur; hem doğruluğu hem hızı birlikte gösterir.',
      ...(c.unclear > 0 ? ['Net anlaşılamayan kelimeler de doğru okunmuş gibi sayılır.'] : []),
    ];
    if (compared && ref) {
      parts.push(
        'Karşılaştırma, Ankara’da yapılmış bir çalışmanın ders yılı sonundaki sonuçlarıyla yapılır (Erden ve ark., 2002).',
        'Çalışma eskidir ve tek bir ile aittir; yalnızca kaba bir fikir verir.',
        'Ders yılının başında daha düşük hızlar olağandır.',
        r.fluency.slowRate
          ? v({ you: 'Dakikada doğru okuduğun kelime sayın, o çalışmadaki öğrencilerin çoğundan az.', parent: 'Dakikada doğru okuduğu kelime sayısı, o çalışmadaki öğrencilerin çoğundan az.' })
          : r.wcpm > hi
            ? v({ you: 'Dakikada doğru okuduğun kelime sayın, o çalışmadaki öğrencilerin çoğundan fazla.', parent: 'Dakikada doğru okuduğu kelime sayısı, o çalışmadaki öğrencilerin çoğundan fazla.' })
            : v({ you: 'Dakikada doğru okuduğun kelime sayın, o çalışmadaki öğrencilerin çoğunun aralığında.', parent: 'Dakikada doğru okuduğu kelime sayısı, o çalışmadaki öğrencilerin çoğunun aralığında.' }),
      );
    } else if (!ref) {
      parts.push('Karşılaştırmada kullanılabilecek çalışma yalnızca 1–5. sınıfları kapsıyor; bu yüzden karşılaştırma yapılmadı.');
    } else if (r.flags.interrupted) {
      parts.push('Kayıt sırasında kesinti olduğu için karşılaştırma yapılmadı.');
    } else {
      parts.push(v({ you: 'Karşılaştırma yalnızca kendi sınıfının metninde yapılır; bu metin başka bir sınıfın metniydi.', parent: 'Karşılaştırma yalnızca kendi sınıfının metninde yapılır; bu metin başka bir sınıfın metniydi.' }));
      if (r.fluency.slowRate) {
        parts.push(
          v({
            you: 'Yine de daha kolay bir metinde dakikada doğru okuduğun kelime sayın, o çalışmadaki aynı sınıf öğrencilerinin çoğundan az (Erden ve ark., 2002).',
            parent: 'Yine de daha kolay bir metinde dakikada doğru okuduğu kelime sayısı, o çalışmadaki aynı sınıf öğrencilerinin çoğundan az (Erden ve ark., 2002).',
          }),
        );
      }
    }
    // Düğmeyle ölçülen süre hızı biraz düşük gösterebilir: karşılaştırma ya da "çoğundan az" yorumu varsa söylenir.
    if (r.flags.manualTiming && ((compared && ref) || r.fluency.slowRate)) {
      parts.push('Süre düğmelere göre ölçüldüğü için hız olduğundan biraz düşük çıkmış olabilir.');
    }
    if ((compared && ref) || r.fluency.slowRate) {
      const erden = def.science.citations?.find((s) => s.text.startsWith('Erden'));
      if (erden) sources.push(erden);
    }
    const visual: StripVisual | BarsVisual =
      compared && ref
        ? {
            type: 'strip',
            label: 'Dakikada doğru okunan kelime',
            min: 0,
            max: niceMax(Math.max(hi * 1.1, r.wcpm * 1.05)),
            unit: 'kelime',
            points: [],
            marker: { value: r.wcpm, label: `${n0(r.wcpm)} doğru kelime` },
            zone: { from: lo, to: hi, label: 'Öğrencilerin çoğu' },
            reference: { value: ref.wpm, label: `${grade}. sınıf ortalaması` },
          }
        : {
            type: 'bars',
            label: 'Dakikada kelime',
            scale: 'scale',
            unit: 'kelime',
            rows: [
              { label: 'Okunan kelime', value: r.wpm, valueLabel: n0(r.wpm) },
              { label: c.unclear > 0 ? 'Hata sayılmayan kelime' : 'Doğru okunan kelime', value: r.wcpm, valueLabel: n0(r.wcpm) },
            ],
          };
    levelCards.push({
      key: 'rate',
      title: 'Dakikada doğru okunan kelime',
      badge: `Dakikada ${n0(r.wcpm)} doğru kelime`,
      text: parts.join(' '),
      ...(compared && ref
        ? {
            note: v({
              you: 'Kırmızı çizgi senin sonucun, kesikli çizgi sınıf ortalaması; renkli bölge çalışmadaki öğrencilerin çoğunun aralığıdır.',
              parent: 'Kırmızı çizgi öğrencinin sonucu, kesikli çizgi sınıf ortalaması; renkli bölge çalışmadaki öğrencilerin çoğunun aralığıdır.',
            }),
          }
        : {}),
      visual,
      // Dakikada doğru kelime rozette okunur; burada bütün kelimeler ve (varsa) karşılaştırma.
      spoken: [
        `Dakikada okunan bütün kelime: ${n0(r.wpm)}.`,
        ...(compared && ref ? [`${grade}. sınıf ortalaması: ${ref.wpm}. Öğrencilerin çoğu ${lo}–${hi} arasında.`] : []),
      ],
    });
  }

  if (r.prosody) {
    const total = r.prosody.total;
    const pz = cellZones(4, 16, (k) => prosodyLabel(k), (l) => l);
    const P_TEXT: Record<string, string> = {
      'Desteğe ihtiyaç var': 'Okuma sık sık takılıyor ya da kelime kelime ilerliyor; tekrarlı okuma yararlı olabilir.',
      Gelişiyor: 'Akıcılık gelişiyor; bazı yönler henüz oturmadı.',
      'Akıcı ve anlamlı': 'Konuşur gibi, anlama uygun vurgu ve tonlamayla okunuyor.',
    };
    const active = pz.keys.indexOf(prosodyLabel(total));
    levelCards.push({
      key: 'prosody',
      title: 'Akıcılık',
      badge: prosodyLabel(total),
      text: [
        v({
          you: 'Seni dinleyen yetişkin okumanın dört yönünü derecelendirdi: vurgu ve tonlama, öbekleme, düzgünlük ve tempo.',
          parent: 'Dinleyen yetişkin okumanın dört yönünü derecelendirdi: vurgu ve tonlama, öbekleme, düzgünlük ve tempo.',
        }),
        'Her yön birden dörde kadar puan alır; toplam bu dört puanın toplamıdır.',
        'Sınırlar Ölçekhane’nin deneme ölçütleridir.',
      ].join(' '),
      note: v({ you: 'Her kutu bir toplam puandır; dolu kutu senin toplamın, vurgulu kutular düzeyin.', parent: 'Her kutu bir toplam puandır; dolu kutu öğrencinin toplamı, vurgulu kutular düzeyidir.' }),
      visual: { type: 'cells', label: 'Akıcılık toplamı', min: 4, max: 16, value: total, valueLabel: `${total}/16`, zones: pz.zones, active: active >= 0 ? active : null },
      levels: pz.keys.map((l, i) => ({ label: l, text: P_TEXT[l] ?? '', active: i === active })),
      ...(whose ? { activeLabel: whose } : {}),
      spoken: [`Akıcılık toplamı: ${total} / 16.`, zonesSpoken(pz.zones, 'puan')],
    });
  }

  const t = r.retell;
  if (t && !auto) {
    type RL = 'low' | 'half' | 'all';
    const RL_LABEL: Record<RL, string> = { low: 'Temel fikirlerin azı', half: 'Ana hatlar', all: 'Temel fikirlerin hepsi' };
    const RL_TEXT: Record<RL, string> = {
      low: 'Metni anlatmak zor gelmiş; önemli fikirlerin çoğu söylenmemiş.',
      half: 'Metnin ana hatları aktarılmış; bazı önemli noktalar eksik.',
      all: 'Metnin özü kavranmış: önemli fikirlerin hiçbiri atlanmamış.',
    };
    const lvl = (k: number): RL => (k === t.coreTotal ? 'all' : k * 2 >= t.coreTotal ? 'half' : 'low');
    const rz = cellZones(0, t.coreTotal, lvl, (l) => RL_LABEL[l]);
    const active = rz.keys.indexOf(lvl(t.core));
    const details = t.mentioned.length - t.core;
    levelCards.push({
      key: 'retell',
      title: 'Yeniden anlatma',
      badge: RL_LABEL[lvl(t.core)],
      text: [
        v({
          you: 'Metni kendi cümlelerinle anlatırken söylediğin fikirler sayılır.',
          parent: 'Öğrencinin metni kendi cümleleriyle anlatırken söylediği fikirler sayılır.',
        }),
        'Temel fikirler, metnin özünü taşıyan fikirlerdir; düzeyi onlar belirler.',
        'Ayrıntılar ayrıca sayılır ama düzeyi değiştirmez.',
      ].join(' '),
      note: v({ you: 'Her kutu bir sayıdır; dolu kutu söylediğin temel fikirlerin sayısı, vurgulu kutular düzeyin.', parent: 'Her kutu bir sayıdır; dolu kutu söylenen temel fikirlerin sayısı, vurgulu kutular düzeyidir.' }),
      visual: { type: 'cells', label: 'Söylenen temel fikirler', min: 0, max: t.coreTotal, value: t.core, valueLabel: `${t.core}/${t.coreTotal}`, zones: rz.zones, active: active >= 0 ? active : null },
      levels: rz.keys.map((l, i) => ({ label: rz.zones[i].label, text: RL_TEXT[l], active: i === active })),
      ...(whose ? { activeLabel: whose } : {}),
      spoken: [
        `Söylenen temel fikirler: ${t.core} / ${t.coreTotal}.`,
        ...(t.total > t.coreTotal ? [`Söylenen ayrıntılar: ${spokenCount(details)}.`] : []),
        zonesSpoken(rz.zones, 'temel fikir'),
      ],
    });
  }

  if (r.pauses && r.audio) {
    const p = r.pauses;
    const lens = r.audio.pauses.map(([s, e]) => Math.round((e - s) / 100) / 10);
    const max = Math.max(4, niceMax(Math.max(0, ...lens)));
    levelCards.push({
      key: 'pauses',
      title: 'Duraklamalar',
      badge: p.count === 0 ? 'Duraklama yok' : `${p.count === 1 ? 'Bir' : p.count} duraklama`,
      text: [
        'Okurken kısa bir an susmak olağandır; yalnızca belirgin duraklamalar sayılır.',
        'Cümle sonlarında durmak doğaldır; cümlenin ortasındaki duraklama bir kelimede zorlanıldığını gösterebilir.',
        'Duraklamalar yalnızca sesin yüksekliğinden ölçülür; konuşmanın içeriği incelenmez.',
        'Duraklama sayısı için bir ölçüt yok; başka öğrencilerle karşılaştırılmaz.',
      ].join(' '),
      note: 'Her nokta bir sessizliktir; renkli bölge sayılmayan kısa susmalar, kesikli çizgi uzun duraklama sınırıdır.',
      visual: {
        type: 'strip',
        label: 'Okurken sessizlikler',
        min: 0,
        max,
        unit: 'sn',
        points: lens,
        zone: { from: 0, to: PAUSE_MS / 1000, label: 'Sayılmayan kısa susmalar' },
        reference: { value: LONG_PAUSE_MS / 1000, label: 'Uzun duraklama' },
        caption: lens.some((x) => x > max) ? `Her nokta bir sessizlik; ${max} sn’den uzunlar sağ uçta` : 'Her nokta bir sessizlik',
      },
      spoken: [
        `Sayılan duraklamalar ${PAUSE_MS / 1000} saniyeden uzun olanlardır.`,
        `${LONG_PAUSE_MS / 1000} saniyeden uzun duraklama: ${spokenCount(p.long)}.`,
      ],
    });
  }

  const levels: ReportPart = {
    key: 'levels',
    title: 'Düzeylerin ve ölçülerin anlamı',
    intro: [
      v({
        you: 'Bu bölüm her ölçünün ne anlattığını ve nasıl hesaplandığını anlatır; senin sonucun grafiklerde işaretli.',
        parent: 'Bu bölüm her ölçünün ne anlattığını ve nasıl hesaplandığını anlatır; öğrencinin sonucu grafiklerde işaretli.',
      }),
      `Sınırlar Ölçekhane’nin deneme ölçütleridir; ${r.prosody ? 'doğru okuma, anlama ve akıcılık' : 'doğru okuma ve anlama'} başka öğrencilerle karşılaştırılmaz.`,
      'Metnin düzeyinin nasıl belirlendiği yukarıda, “Düzey nasıl belirlendi?” bölümünde.',
      ...(hasWarn(quality)
        ? [v({ you: 'Güven denetimlerinde “Dikkat” olduğu için sonuçlarını dikkatle oku.', parent: 'Güven denetimlerinde “Dikkat” olduğu için sonuçları dikkatle okuyun.' })]
        : []),
    ].join(' '),
    groups: [{ cards: levelCards }],
    ...(sources.length ? { sources } : {}),
  };

  /* ---------- 2. Okuma ve cevaplar tek tek ---------- */
  const sentences = oralSentences(passage, r.marked);
  const unreadFrom = r.unread > 0 ? r.wordCount - r.unread : Number.POSITIVE_INFINITY;
  const unreadCounted = halfUnread(r);
  const said = you ? 'dedin' : 'dedi';
  const markOf = (w: SentenceWord): WordMark => {
    if (w.i >= unreadFrom) return unreadCounted ? 'error' : 'unread';
    const s = w.m.s;
    if (s === 'sub' || s === 'omit' || s === 'help') return 'error';
    if (s === 'unclear') return 'unclear';
    if (s === 'self' || w.m.rep || w.m.syl || w.m.hes) return 'note';
    return 'ok';
  };
  const NAMES = { sub: 'yanlış okuma', omit: 'atlama', help: 'yardımla okuma', unclear: 'net anlaşılamadı' } as const;
  const rows: PartRow[] = [];
  const map: WordMapVisual['rows'] = [];
  // Hiç okunmayan art arda cümleler tek satırda ("7.–18. cümleler okunmadı"); hata sayısı olarak yazılmaz.
  let run: { from: number; to: number; words: number } | null = null;
  const flush = () => {
    if (!run) return;
    const one = run.from === run.to;
    rows.push({
      no: run.from,
      label: one ? `${run.from}.` : `${run.from}.–${run.to}.`,
      text: one ? 'cümle okunmadı' : 'cümleler okunmadı',
      spoken: one ? `${run.from}. cümle okunmadı` : `${run.from}. ile ${run.to}. cümleler okunmadı`,
      value: countText(run.words, 'kelime'),
      tags: unreadCounted ? ['metnin yarısından azı okunduğu için atlama sayıldı'] : [],
      muted: true,
    });
    run = null;
  };
  sentences.forEach((sent, k) => {
    const no = k + 1;
    map.push({ label: String(no), words: sent.map((w) => ({ len: Math.max(1, bare(w.text).length), mark: markOf(w), ...(w.m.ins ? { ins: w.m.ins } : {}) })) });
    if (sent.every((w) => w.i >= unreadFrom)) {
      if (run) {
        run.to = no;
        run.words += sent.length;
      } else run = { from: no, to: no, words: sent.length };
      return;
    }
    flush();
    const tags: string[] = [];
    // Satırın hata sayısı okunan kelimelerindendir; okunmayan kelimeler ayrı etikette.
    let errors = 0;
    let unread = 0;
    for (const w of sent) {
      const word = bare(w.text);
      if (w.i >= unreadFrom) {
        unread++;
        continue;
      }
      const notes: string[] = [];
      const s = w.m.s;
      if (s === 'sub') {
        errors++;
        if (w.m.said) tags.push(auto ? `“${word}” yerine “${w.m.said}” duyuldu` : `“${word}” yerine “${w.m.said}” ${said}`);
        else notes.push(NAMES.sub);
      } else if (s === 'omit' || s === 'help') {
        errors++;
        notes.push(NAMES[s]);
      } else if (s === 'unclear') notes.push(NAMES.unclear);
      else if (s === 'self') notes.push(you ? 'kendin düzelttin' : 'kendisi düzeltti');
      if (w.m.hes) notes.push('duraksama');
      if (w.m.syl) notes.push('heceleme');
      if (w.m.rep) notes.push('tekrar');
      if (notes.length) tags.push(`“${word}”: ${notes.join(', ')}`);
      if (w.m.ins) {
        errors += w.m.ins;
        tags.push(`“${word}” sonrasında ${countText(w.m.ins, 'ekleme')}`);
      }
    }
    if (unread) tags.push(`${countText(unread, 'kelime')} okunmadı${unreadCounted ? ' (atlama sayıldı)' : ''}`);
    if (tags.length === 0) return;
    rows.push({ no, text: sent.map((w) => w.text).join(' '), value: errors === 0 ? 'Hata yok' : errors === 1 ? 'Bir hata' : `${errors} hata`, tags });
  });
  flush();
  const usedMarks = new Set(map.flatMap((m) => m.words.map((w) => w.mark)));
  const WORD_LEGEND: { mark: WordMark; text: string }[] = [
    { mark: 'ok', text: 'doğru' },
    { mark: 'error', text: 'hata sayılan' },
    { mark: 'note', text: 'hata sayılmayan gözlem' },
    { mark: 'unclear', text: 'net anlaşılamadı' },
    { mark: 'unread', text: 'okunmadı' },
  ];
  const wordmap: WordMapVisual = {
    type: 'wordmap',
    label: 'Metin cümle cümle',
    rows: map,
    legend: WORD_LEGEND.filter((l) => l.mark === 'ok' || usedMarks.has(l.mark) || (l.mark === 'error' && map.some((m) => m.words.some((w) => w.ins)))),
  };
  const unmarked = sentences.length - rows.length;
  const textCard: PartCard = {
    key: 'text',
    title: 'Metin cümle cümle',
    badge: `${sentences.length} cümle`,
    text: [
      rows.length === 0
        ? v({ you: 'Bütün cümleleri işaretsiz okudun.', parent: 'Bütün cümleler işaretsiz okundu.' })
        : unmarked > 0
          ? 'Aşağıda yalnızca işaret olan cümleler yazıyor; işaretsiz okunan cümleler haritada görünür.'
          : 'Her cümlede en az bir işaret var.',
      ...(auto ? ['Net anlaşılamayan kelimeler hata sayılmadı.'] : []),
      v({
        you: 'Kelimelerin işaretleri yukarıda, “Okuman, kelime kelime” bölümünde de var.',
        parent: 'Kelimelerin işaretleri yukarıda, “Okuma, kelime kelime” bölümünde de var.',
      }),
    ].join(' '),
    note: 'Her satır bir cümle, her kutu bir kelimedir; kutunun genişliği kelimenin uzunluğuna göredir. Dar dolu kutu bir eklemedir.',
    visual: wordmap,
    ...(rows.length ? { rows, rowsHead: { item: 'cümle', value: v({ you: 'Okuman', parent: 'Okuma' }) } } : {}),
  };
  const qs = passage.questions;
  const answers = input.answers;
  const questionsCard: PartCard = {
    key: 'questions',
    title: 'Sorular',
    badge: `${cm.correct}/${cm.total} doğru`,
    note: 'Her kutu bir sorudur; kutudaki sayı sorunun sırasıdır. Satırlar soru türleridir.',
    visual: questionGrid('Sorular', qs, (i) => (answers[qs[i].key] === undefined ? 'skip' : answers[qs[i].key] === qs[i].answer ? 'on' : 'off')),
    rows: qs.map((q, i) => questionRow(q, i + 1, answers[q.key])),
    rowsHead: { item: 'soru', value: v({ you: 'Cevabın', parent: 'Verilen cevap' }) },
  };
  const answerCards: PartCard[] = [textCard, questionsCard];
  if (t && !auto) {
    const ideas = passage.ideas;
    const saidSet = new Set(t.mentioned);
    const cell = (i: number) => ({ text: String(i + 1), mark: (saidSet.has(ideas[i].key) ? 'on' : 'off') as GridMark });
    const gridRows = [
      { label: 'Temel fikirler', cells: ideas.flatMap((x, i) => (x.core ? [cell(i)] : [])) },
      { label: 'Ayrıntılar', cells: ideas.flatMap((x, i) => (x.core ? [] : [cell(i)])) },
    ].filter((g) => g.cells.length > 0);
    answerCards.push({
      key: 'retell',
      title: 'Yeniden anlatma',
      badge: `${t.mentioned.length}/${t.total} fikir`,
      text: v({
        you: 'Metni anlatırken söylediğin fikirleri seni dinleyen yetişkin işaretledi.',
        parent: 'Öğrencinin metni anlatırken söylediği fikirleri dinleyen yetişkin işaretledi.',
      }),
      note: 'Her kutu bir fikirdir; kutudaki sayı fikrin sırasıdır. Dolu kutu söylenen fikirdir.',
      visual: {
        type: 'grid',
        label: 'Yeniden anlatmada söylenen fikirler',
        rows: gridRows,
        legend: [
          { mark: 'on', text: 'söylendi' },
          { mark: 'off', text: 'söylenmedi' },
        ],
      },
      rows: ideas.map((x, i) => ({
        no: i + 1,
        text: x.text,
        value: saidSet.has(x.key) ? v({ you: 'Söyledin', parent: 'Söyledi' }) : v({ you: 'Söylemedin', parent: 'Söylemedi' }),
        tags: [x.core ? 'temel fikir' : 'ayrıntı'],
        ...(saidSet.has(x.key) ? {} : { muted: true }),
      })),
      rowsHead: { item: 'fikir', value: v({ you: 'Anlatman', parent: 'Anlatma' }) },
    });
  }
  const answersPart: ReportPart = {
    key: 'answers',
    title: v({ you: 'Okuman ve cevapların tek tek', parent: 'Okuma ve cevaplar tek tek' }),
    intro: [
      t && !auto
        ? v({
            you: 'Bu bölüm okumanı cümle cümle, soruları ve metni anlatmanı tek tek gösterir.',
            parent: 'Bu bölüm okumayı cümle cümle, soruları ve metnin anlatılmasını tek tek gösterir.',
          })
        : v({ you: 'Bu bölüm okumanı cümle cümle ve soruları tek tek gösterir.', parent: 'Bu bölüm okumayı cümle cümle ve soruları tek tek gösterir.' }),
      v({
        you: 'Aynı metni yeniden okursan soruların cevaplarını gördüğün için sonuç yüksek çıkabilir; başka bir metin seçmek daha doğru olur.',
        parent: 'Aynı metinle yeniden değerlendirme yapılırsa cevaplar görüldüğü için sonuç yüksek çıkabilir; başka bir metin seçmek daha doğru olur.',
      }),
      v({
        you: 'Bu bilgiler yalnızca bu sayfada ve indirdiğin PDF dosyasında görünür; hiçbir yerde saklanmaz.',
        parent: 'Bu bilgiler yalnızca bu sayfada ve indirilen PDF dosyasında görünür; hiçbir yerde saklanmaz.',
      }),
    ].join(' '),
    groups: [{ cards: answerCards }],
    collapsed: true,
    appendix: true,
  };

  return [levels, answersPart, quality];
}
