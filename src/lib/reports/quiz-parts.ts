import type { QuizInstrument } from '@/lib/instruments/types';
import {
  DONT_KNOW,
  QUIZ_LETTER_MIN_CHOSEN,
  QUIZ_LETTER_SHARE,
  QUIZ_SPEED_MIN_CHOSEN,
  QUIZ_THRESHOLDS,
  QUIZ_TOO_FAST_MS,
  manyDontKnow,
  type QuizResult,
} from '@/lib/scoring/quiz';
import type { AcademicReport, ReportContent } from './build';
import { WARN_MEANING, checkCard, checksSummary, hasWarn, nf1, secondsText, spokenCount } from './part-kit';
import type { PartCard, PartRow, ReportPart } from './parts';
import { misconceptionBars, quizGauge, type SimpleReport } from './simple';
import { niceMax } from './visual-draw';
import type { GridMark, GridVisual } from './visual-cells';
import type { CompareVisual, MeterVisual, StackVisual, StripVisual, Zone } from './visuals';

/**
 * Konu tarama testlerinin (Matematik Konu Tarama Testi) ek rapor bölümleri (site sahibinin 2026-10-31 isteği; model
 * lib/reports/parts.ts):
 *  1. "Düzeylerin ve ölçülerin anlamı": genel sonucun ve konu alanlarının düzeyleri testin kendi eşikleriyle (doğruların
 *     %50'si ve %75'i; QUIZ_THRESHOLDS), doğru, yanlış ve "Bilmiyorum"un nasıl sayıldığı, hata türlerinin nasıl bulunduğu.
 *     Sonuç başka öğrencilerle karşılaştırılmaz.
 *  2. Soru soru cevaplar: her soru konu alanına göre, verilen ve doğru cevap, hata türü ve soruya ayrılan süre. Yanlış
 *     soruların çözümleri raporun soru soru incelemesindedir (SimpleQuizReview): burada yinelenmez, oraya gönderilir. Soru
 *     metinleri (kesirler, tablolar, şekiller) sesli okunmaz (`PartRow.spoken`). Kişisel ifade değil, performanstır: veli
 *     raporunda da vardır. Ekranda kapalı kutular, PDF'te ek.
 *  3. "Sonuca ne kadar güvenebiliriz?": cevap hızı, hep aynı seçenek ve "Bilmiyorum" denetimleri; sınırlar uyarılarla
 *     ortaktır (QUIZ_TOO_FAST_MS, QUIZ_SPEED_MIN_CHOSEN, QUIZ_LETTER_MIN_CHOSEN, QUIZ_LETTER_SHARE, manyDontKnow).
 * Dil: öğrenciye "sen", veliye "çocuğunuz"; cümleler kısa; tanı ya da kesin hüküm yok.
 */

type Voice = { you: string; parent: string };

/** Seçeneğin yazılışı: "B) 102 450". */
const option = (it: AcademicReport['review'][number], key: string) => `${key}) ${it.options.find((o) => o.key === key)?.text ?? ''}`;

export function quizParts(input: { def: QuizInstrument; result: QuizResult; content: ReportContent; report: SimpleReport }): ReportPart[] {
  const { result: q, content, report } = input;
  const a = content.academic;
  if (!a) return [];
  const aud = content.audience;
  const v = (t: Voice) => (aud === 'parent' ? t.parent : t.you);
  const n = a.n;

  /* ---------- 3. Sonuca ne kadar güvenebiliriz? ---------- */
  const chosen = q.items.filter((i) => i.choice !== null && i.choice !== DONT_KNOW);
  const rts = chosen.map((i) => i.rtMs).filter((x): x is number => typeof x === 'number' && x > 0);
  const fast = QUIZ_TOO_FAST_MS / 1000;
  let speed: PartCard;
  if (chosen.length < QUIZ_SPEED_MIN_CHOSEN || q.medianRtMs === null) {
    speed = checkCard('speed', 'Cevap hızı', 'none', {
      text: v({
        you: `Bu denetim için en az ${QUIZ_SPEED_MIN_CHOSEN} soruda bir seçenek işaretlenmiş ve süreler ölçülmüş olmalı; bu sefer yapılamadı.`,
        parent: `Bu denetim için en az ${QUIZ_SPEED_MIN_CHOSEN} soruda bir seçenek işaretlenmiş ve süreler ölçülmüş olmalı; bu sefer yapılamadı.`,
      }),
    });
  } else {
    const secs = rts.map((ms) => Math.round(ms / 100) / 10);
    const sorted = [...secs].sort((x, y) => x - y);
    const p90 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))] ?? fast;
    const max = Math.max(fast * 4, niceMax(p90));
    const median = q.medianRtMs / 1000;
    const visual: StripVisual = {
      type: 'strip',
      label: 'Sorulara ayrılan süreler',
      min: 0,
      max,
      unit: 'sn',
      points: secs,
      marker: { value: median, label: `Tipik ${nf1.format(Math.round(median * 10) / 10)} sn` },
      zone: { from: 0, to: fast, label: `Çok hızlı: ${fast} sn altı` },
      caption: secs.some((s) => s > max) ? `Her nokta bir soru; ${max} sn’den uzunlar sağ uçta` : 'Her nokta bir soru',
    };
    speed = checkCard('speed', 'Cevap hızı', q.flags.tooFast ? 'warn' : 'ok', {
      text: [
        'Bir matematik sorusunu okuyup çözmek genellikle birkaç saniyeden uzun sürer.',
        'Tipik süre, sürelerin ortasındaki değerdir: soruların yarısı daha kısa, yarısı daha uzun sürede cevaplanır.',
        '“Bilmiyorum” denen sorular bu denetime girmez.',
        q.flags.tooFast
          ? v({
              you: 'Tipik süren çok kısa; bazı sorular okunmadan ya da tahminle cevaplanmış olabilir.',
              parent: 'Tipik süre çok kısa; bazı sorular okunmadan ya da tahminle cevaplanmış olabilir.',
            })
          : v({ you: 'Tipik süren, çok hızlı sayılan sürenin üstünde.', parent: 'Çocuğunuzun tipik süresi, çok hızlı sayılan sürenin üstünde.' }),
      ].join(' '),
      note: 'Her nokta bir sorunun süresidir. Kırmızı çizgi tipik süreyi, renkli bölge çok hızlı cevapları gösterir.',
      visual,
      spoken: [
        `${v({ you: 'Tipik cevap süren', parent: 'Tipik cevap süresi' })}: ${nf1.format(Math.round(median * 10) / 10)} sn.`,
        `Çok hızlı sayılan süre: ${fast} sn altı.`,
      ],
    });
  }

  const letters = ['A', 'B', 'C', 'D'] as const;
  const letterCount = letters.map((l) => chosen.filter((i) => i.choice === l).length);
  let letter: PartCard;
  if (chosen.length < QUIZ_LETTER_MIN_CHOSEN) {
    letter = checkCard('letter', 'Hep aynı seçenek', 'none', {
      text: `Bu denetim için en az ${QUIZ_LETTER_MIN_CHOSEN} soruda bir seçenek işaretlenmiş olmalı; bu sefer yapılamadı.`,
    });
  } else {
    const top = Math.max(...letterCount);
    const which = letters[letterCount.indexOf(top)];
    const pct = Math.round((top / chosen.length) * 100);
    const keys = input.def.forms.find((f) => f.key === q.formKey)?.items.map((i) => i.answer) ?? [];
    const even = keys.length > 0 && letters.every((l) => keys.filter((k) => k === l).length * letters.length === keys.length);
    const visual: MeterVisual = {
      type: 'meter',
      label: 'En sık seçilen seçenek',
      min: 0,
      max: 100,
      zones: [
        { from: 0, to: QUIZ_LETTER_SHARE * 100, label: 'Uygun', warn: false },
        { from: QUIZ_LETTER_SHARE * 100, to: 100, label: 'Dikkat', warn: true },
      ],
      rows: [{ label: `${which} seçeneğinin payı`, value: pct, valueLabel: `%${pct}` }],
    };
    letter = checkCard('letter', 'Hep aynı seçenek', q.flags.sameLetter ? 'warn' : 'ok', {
      text: [
        even ? 'Bu testte doğru cevaplar dört seçeneğe eşit dağıtıldı.' : 'Bu testte doğru cevaplar dört seçeneğe dağıtıldı.',
        'Cevapların çoğu aynı seçenekte toplanırsa bazı sorular rastgele işaretlenmiş olabilir.',
        '“Bilmiyorum” cevapları bu denetimde sayılmaz.',
        q.flags.sameLetter
          ? v({
              you: 'Cevaplarının çoğu aynı seçenekte toplandı; bazı sorular rastgele işaretlenmiş olabilir.',
              parent: 'Cevapların çoğu aynı seçenekte toplandı; bazı sorular rastgele işaretlenmiş olabilir.',
            })
          : v({ you: 'Cevapların seçeneklere dağılmış.', parent: 'Cevaplar seçeneklere dağılmış.' }),
        ...(q.flags.sameLetter && q.correct === n ? ['Bütün sorular doğru olduğu için sonuç yine de yorumlandı.'] : []),
      ].join(' '),
      note: 'Kırmızı çizgi en sık seçilen seçeneğin payını, renkli bölge uyarı bölgesini gösterir.',
      visual,
      spoken: [...letters.map((l, i) => `${l} seçeneği: ${spokenCount(letterCount[i], 'soru')}.`), `Uyarı sınırı: yüzde ${Math.round(QUIZ_LETTER_SHARE * 100)}.`],
    });
  }

  const need = Math.floor(n / 2) + 1;
  const dkWarn = manyDontKnow(a.dontKnow, n);
  const allDk = a.dontKnow === n;
  const dk: PartCard = checkCard('dontknow', '“Bilmiyorum” cevapları', dkWarn ? 'warn' : 'ok', {
    text: [
      '“Bilmiyorum” demek dürüst bir cevaptır; tahmin etmekten iyidir.',
      'Ama soruların yarısından çoğunda “Bilmiyorum” denirse konuların bir kısmı okulda henüz işlenmemiş olabilir.',
      allDk
        ? v({ you: 'Bütün sorularda “Bilmiyorum” dediğin için sonuç yorumlanmadı.', parent: 'Bütün sorularda “Bilmiyorum” denildiği için sonuç yorumlanmadı.' })
        : dkWarn
          ? v({ you: 'Soruların yarısından çoğunda “Bilmiyorum” dedin; sonuç dikkatle okunmalı.', parent: 'Soruların yarısından çoğunda “Bilmiyorum” denildi; sonuç dikkatle okunmalı.' })
          : v({ you: '“Bilmiyorum” cevapların uyarı sınırının altında.', parent: '“Bilmiyorum” cevapları uyarı sınırının altında.' }),
    ].join(' '),
    note: 'Kırmızı çizgi “Bilmiyorum” sayısını, renkli bölge uyarı bölgesini gösterir.',
    visual: {
      type: 'meter',
      label: '“Bilmiyorum” cevapları',
      min: 0,
      max: n,
      zones: [
        { from: 0, to: need - 0.5, label: 'Uygun', warn: false },
        { from: need - 0.5, to: n, label: 'Dikkat', warn: true },
      ],
      rows: [{ label: v({ you: '“Bilmiyorum” dediğin soru', parent: '“Bilmiyorum” denen soru' }), value: a.dontKnow, valueLabel: `${a.dontKnow} soru` }],
      discrete: true,
    },
    spoken: [`“Bilmiyorum” cevapları: ${spokenCount(a.dontKnow)}.`, `Uyarı sınırı: ${need} soru.`],
  });

  const checks = [speed, letter, dk];
  const quality: ReportPart = {
    key: 'quality',
    title: 'Sonuca ne kadar güvenebiliriz?',
    intro: [
      v({
        you: 'Bu bölüm, cevaplarının bildiklerini ne kadar iyi yansıttığını denetler.',
        parent: 'Bu bölüm, çocuğunuzun cevaplarının bildiklerini ne kadar iyi yansıttığını denetler.',
      }),
      WARN_MEANING,
      checksSummary(checks, v({ you: 'Senin cevaplarında denetimlerin hepsi uygun çıktı.', parent: 'Çocuğunuzun cevaplarında denetimlerin hepsi uygun çıktı.' })),
      ...(a.guessed ? ['Cevaplar tahmin olabileceği için genel sonuç, konu alanları ve hata türleri yorumlanmadı.'] : []),
    ].join(' '),
    groups: [{ cards: checks }],
  };

  /* ---------- 1. Düzeylerin ve ölçülerin anlamı ---------- */
  const LEVEL_TEXT: Record<'low' | 'average' | 'high', string> = {
    low: 'Soruların yarısından azı doğru; birçok konu pekiştirilmeli. Bazı konular henüz işlenmemiş olabilir.',
    average: 'Temel konuların bir kısmı sağlam, bir kısmı pekiştirilmeli.',
    high: 'Soruların çoğu doğru; temel konular büyük ölçüde sağlam görünüyor.',
  };
  const order = ['low', 'average', 'high'] as const;
  const gauge = a.interpreted ? quizGauge(a) : null;
  const range = (z: Zone, last: boolean) => {
    const to = last ? z.to : z.to - 1;
    return to === z.from ? String(z.from) : `${z.from}–${to}`;
  };
  const zoneSpoken = (zs: Zone[], unit: string) => `Düzeylerin sınırları: ${zs.map((z, i) => `${z.label} ${range(z, i === zs.length - 1)} ${unit}`).join('; ')}.`;
  const notRead = a.guessed
    ? 'Cevapların bir kısmı tahmin olabileceği için düzey bu sefer verilmedi.'
    : v({ you: 'Bütün sorularda “Bilmiyorum” dediğin için düzey bu sefer verilmedi.', parent: 'Bütün sorularda “Bilmiyorum” denildiği için düzey bu sefer verilmedi.' });
  const overall: PartCard = {
    key: 'total',
    title: 'Genel sonuç',
    badge: a.interpreted ? a.bandLabel : 'Yorumlanmadı',
    text: [
      'Puan, doğru cevaplanan soruların sayısıdır. Yanlış ve “Bilmiyorum” cevapları puan getirmez, puandan da düşmez.',
      'Sınırlar soruların yarısı ve dörtte üçüdür; testin kendi ölçütleridir.',
      ...(a.interpreted ? [] : [notRead]),
    ].join(' '),
    ...(gauge
      ? {
          note: v({ you: 'Vurgulu bölge düzeyin, kırmızı işaret doğru sayındır.', parent: 'Vurgulu bölge düzeyi, kırmızı işaret doğru sayısını gösterir.' }),
          visual: gauge,
          spoken: [`${v({ you: 'Doğru cevapların', parent: 'Doğru cevaplar' })}: ${a.correct} / ${n}.`, zoneSpoken(gauge.zones, 'doğru')],
        }
      : {}),
    levels: order.map((b) => ({ label: a.bandNames[b], text: LEVEL_TEXT[b], active: a.interpreted && a.band === b })),
  };
  const per = Math.max(...a.domains.map((d) => d.n));
  const avg = Math.ceil(per * QUIZ_THRESHOLDS.average - 1e-9);
  const high = Math.ceil(per * QUIZ_THRESHOLDS.high - 1e-9);
  const domainZones: Zone[] = [
    { from: 0, to: avg, label: a.bandNames.low, band: 'low' },
    { from: avg, to: high, label: a.bandNames.average, band: 'average' },
    { from: high, to: per, label: a.bandNames.high, band: 'high' },
  ];
  const sameN = a.domains.every((d) => d.n === per);
  const domainCard: PartCard = {
    key: 'domains',
    title: 'Konu alanları',
    text: [
      'Her alan aynı sınırlarla okunur. Ama bir alanda az soru var; tek bir dikkatsizlik ya da şansla gelen bir doğru düzeyi değiştirir.',
      'Bu yüzden alan düzeyleri kaba bir göstergedir.',
      ...(a.interpreted ? [] : ['Bu sefer alanlar da yorumlanmadı.']),
    ].join(' '),
    ...(a.interpreted && sameN
      ? {
          note: 'Her satır bir alan; kırmızı nokta doğru sayısını, vurgulu bölge alanın düzeyini gösterir.',
          visual: {
            type: 'compare',
            min: 0,
            max: per,
            zones: domainZones,
            rows: a.domains.map((d) => ({ label: d.name, value: d.correct, valueLabel: `${d.correct}/${d.n}`, active: d.band === 'high' ? 2 : d.band === 'average' ? 1 : 0 })),
          } satisfies CompareVisual,
          spoken: [...a.domains.map((d) => `${d.name}: ${d.correct} / ${d.n}, ${d.bandLabel}.`), zoneSpoken(domainZones, 'doğru')],
        }
      : {}),
  };
  const kinds: StackVisual = {
    type: 'stack',
    label: 'Soruların cevapları',
    total: n,
    parts: [
      { label: 'Doğru', value: a.correct },
      { label: 'Yanlış', value: a.wrong },
      { label: '“Bilmiyorum”', value: a.dontKnow },
    ],
  };
  const answerKinds: PartCard = {
    key: 'kinds',
    title: 'Doğru, yanlış ve “Bilmiyorum”',
    text: [
      'Yanlış seçeneklerin çoğu, öğrencilerin sık yaptığı bir hataya göre yazıldı.',
      v({
        you: 'Bu yüzden yanlış cevapların, hangi hatayı yapmış olabileceğini gösterir.',
        parent: 'Bu yüzden yanlış cevaplar, hangi hatanın yapılmış olabileceğini gösterir.',
      }),
      '“Bilmiyorum” hata sayılmaz ve hata türü göstermez; o konunun henüz öğrenilmemiş olabileceğini gösterir.',
      v({
        you: 'Bilmediğin soruda tahmin etmek yerine “Bilmiyorum” demek, raporun daha doğru olmasını sağlar.',
        parent: 'Bilinmeyen soruda tahmin etmek yerine “Bilmiyorum” demek, raporun daha doğru olmasını sağlar.',
      }),
    ].join(' '),
    visual: kinds,
    spoken: [`Doğru: ${spokenCount(a.correct)}. Yanlış: ${spokenCount(a.wrong)}. Bilmiyorum: ${spokenCount(a.dontKnow)}.`],
  };
  const levelCards: PartCard[] = [overall, domainCard, answerKinds];
  if (a.misconceptions.length > 0) {
    levelCards.push({
      key: 'errors',
      title: 'Hata türleri',
      text: [
        'Seçilen yanlış seçenek, o soruda hangi hatanın yapılmış olabileceğini gösterir.',
        'Bir hata türü birden çok soruda görülürse daha dikkate değer bir işarettir.',
        'Tek soruda görülen hata dikkatsizlik ya da tahmin de olabilir.',
        ...(report.quiz?.errorsTitle ? [`Her hata türünün açıklaması ve önerisi yukarıda, “${report.quiz.errorsTitle.replace(/\?$/, '')}” bölümünde.`] : []),
      ].join(' '),
      note: 'Her çubuk bir hata türü; uzunluğu, görüldüğü soru sayısıdır. Eksenin sonu yanlış cevaplanan soruların sayısıdır.',
      visual: misconceptionBars(a.misconceptions, a.wrong),
      spoken: a.misconceptions.map((m) => `${m.name}: ${spokenCount(m.count, 'soru')}.`),
    });
  }
  const levels: ReportPart = {
    key: 'levels',
    title: 'Düzeylerin ve ölçülerin anlamı',
    intro: [
      'Bu bölüm sonuçların nasıl hesaplandığını ve düzeylerin ne anlattığını gösterir.',
      v({
        you: 'Düzeyi doğru cevapların oranı belirler; sonucun başka öğrencilerle karşılaştırılmaz.',
        parent: 'Düzeyi doğru cevapların oranı belirler; sonuç başka çocuklarla karşılaştırılmaz.',
      }),
      ...(hasWarn(quality)
        ? [v({ you: 'Güven denetimlerinde “Dikkat” olduğu için sonuçlarını dikkatle oku.', parent: 'Güven denetimlerinde “Dikkat” olduğu için sonuçları dikkatle okuyun.' })]
        : []),
    ].join(' '),
    groups: [{ cards: levelCards }],
  };

  /* ---------- 2. Cevaplar soru soru ---------- */
  const byKey = new Map(q.items.map((i) => [i.key, i]));
  const missed = a.review.filter((it) => !it.correct).length;
  const cards: PartCard[] = a.domains.map((d) => {
    const items = a.review.filter((it) => it.domain === d.key);
    const markOf = (it: (typeof items)[number]): GridMark => (it.correct ? 'on' : it.choice === null || it.choice === DONT_KNOW ? 'skip' : 'off');
    const used = new Set(items.map(markOf));
    const grid: GridVisual = {
      type: 'grid',
      label: d.name,
      rows: [{ label: '', cells: items.map((it) => ({ text: String(it.no), mark: markOf(it) })) }],
      legend: [
        { mark: 'on' as const, text: 'doğru' },
        { mark: 'off' as const, text: 'yanlış' },
        { mark: 'skip' as const, text: '“Bilmiyorum”' },
      ].filter((l) => l.mark === 'on' || used.has(l.mark)),
    };
    const rows: PartRow[] = items.map((it) => {
      const rt = byKey.get(it.key)?.rtMs ?? null;
      const time = rt && rt > 0 ? [secondsText(rt)] : [];
      const answer = `doğru cevap: ${option(it, it.answer)}`;
      if (it.choice === null) return { no: it.no, text: it.text, spoken: '', value: 'Cevaplanmadı', tags: [answer, ...time], muted: true };
      if (it.choice === DONT_KNOW) return { no: it.no, text: it.text, spoken: '', value: '“Bilmiyorum”', tags: [answer, ...time], muted: true };
      return {
        no: it.no,
        text: it.text,
        spoken: '',
        value: option(it, it.choice),
        tags: it.correct ? ['doğru', ...time] : ['yanlış', answer, ...(it.misconception ? [`hata türü: ${it.misconception}`] : []), ...time],
      };
    });
    return {
      key: d.key,
      title: d.name,
      badge: `${d.correct}/${d.n} doğru`,
      visual: grid,
      rows,
      rowsHead: { item: 'soru', value: v({ you: 'Cevabın', parent: 'Verilen cevap' }) },
    };
  });
  const answers: ReportPart = {
    key: 'answers',
    title: v({ you: 'Cevapların soru soru', parent: 'Çocuğunuzun cevapları soru soru' }),
    intro: [
      v({
        you: 'Testteki her soru, verdiğin cevap ve soruya ayırdığın süre aşağıda; sorular konu alanlarına göre gruplu.',
        parent: 'Testteki her soru, çocuğunuzun cevabı ve soruya ayırdığı süre aşağıda; sorular konu alanlarına göre gruplu.',
      }),
      ...(missed > 0
        ? [
            v({
              you: 'Yanlış yaptığın ve “Bilmiyorum” dediğin soruların çözümleri yukarıda, soruların incelendiği bölümde.',
              parent: 'Yanlış cevaplanan ve “Bilmiyorum” denen soruların çözümleri yukarıda, soruların incelendiği bölümde.',
            }),
          ]
        : []),
      v({
        you: 'Testi yeniden çözersen aynı sorular gelir; doğru cevapları gördüğün için sonuç yüksek çıkabilir.',
        parent: 'Test yeniden çözülürse aynı sorular gelir; doğru cevaplar görüldüğü için sonuç yüksek çıkabilir.',
      }),
      v({
        you: 'Cevapların yalnızca bu sayfada ve indirdiğin PDF dosyasında görünür; hiçbir yerde saklanmaz.',
        parent: 'Cevaplar yalnızca bu sayfada ve indirilen PDF dosyasında görünür; hiçbir yerde saklanmaz.',
      }),
    ].join(' '),
    introNote: 'Grafikte her kutu bir sorudur; kutudaki sayı sorunun sırasıdır.',
    groups: [{ cards }],
    collapsed: true,
    appendix: true,
  };

  return [levels, answers, quality];
}
