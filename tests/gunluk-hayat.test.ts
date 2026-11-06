import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path, { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { DAILY } from '@/content/gunluk';
import type { AdultLines, DailyLines, SkillDaily, SkillsDaily, SurveyDaily } from '@/content/gunluk/types';
import { PACKAGE_AREAS, packageTests } from '@/content/paket';
import { REPORT_TEMPLATES } from '@/content/reports';
import { SimpleReportView } from '@/components/test/simple-report-view';
import { evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import { likertRows, toReportScore } from '@/lib/assessment/score-rows';
import { ADULT_GRADE } from '@/lib/config';
import type { InstrumentDef, LikertInstrument, OralReadingInstrument, QuizInstrument } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import { renderPackageReportPdf, renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { buildReport, type Audience } from '@/lib/reports/build';
import {
  GRADUATE_SCHOOL_CONTEXT,
  SKILL_CONTEXTS,
  SURVEY_CONTEXTS,
  dailyScales,
  dailySources,
  linesOf,
  lowerFirst,
  nearGroups,
  scaleTone,
  skillInForm,
  skillsDailyPart,
  surveyDailyPart,
} from '@/lib/reports/daily-parts';
import type { PackageEntry } from '@/lib/reports/package';
import { partCards, type PartCard, type ReportPart } from '@/lib/reports/parts';
import { bandGroup } from '@/lib/reports/roadmap';
import { gaugeOf, type SimpleReport } from '@/lib/reports/simple';
import {
  BRANCH_MAX_CHARS,
  CENTER_MAX_CHARS,
  CENTER_WORD_MAX_CHARS,
  DAILY_MIN_TEXT,
  POLE_MAX_CHARS,
  type ContextsVisual,
  type DailyKindVisual,
  type PolesVisual,
} from '@/lib/reports/visual-daily';
import { drawVisual } from '@/lib/reports/visual-draw';
import type { GaugeVisual } from '@/lib/reports/visuals';
import { likertItemFlags, scoreLikert, type LikertAnswer } from '@/lib/scoring/likert';
import { oralPassagesFor } from '@/lib/scoring/oral';
import { allSegments, reportSpeech, speakable, utterancesOf } from '@/lib/speech/report-text';
import { likertBody, readingBody } from './helpers/bodies';
import { schoolWords } from './helpers/school';
import { TASK_VARIANTS } from './helpers/task-variants';
import { HAS_PDFTOTEXT, pdfOverlaps } from './helpers/pdf-overlap';
import { EXCLUDED } from './helpers/gunluk-excluded';
import { VISUAL_SIZES, checkDrawn } from './helpers/visual-check';

/**
 * "Günlük hayatta nasıl görünür" (site sahibinin 2026-10-31 isteği; aşama d; lib/reports/daily-parts.ts, metinler
 * src/content/gunluk/). Metni yazılmış her testte: metnin eksiksiz olması (her ölçek, düzey grubu, ortam ve kitle; görevlerde
 * her görev ya da konu alanı), raporda öğrenci, veli ve yetişkin için doğru yerde ve kartla aynı düzeyle görünmesi, ekran,
 * PDF ve sesli dinleme, Kendini Tanı Paketi, dil kuralları ve grafiklerin taşmaması.
 */

/**
 * Henüz metni yazılmamış yayındaki testler. Bir testin dosyası eklenince adresi bu listeden silinir; liste yalnızca küçülür
 * ve aşama d'nin sonunda boş olur (yeni yayına giren test metniyle birlikte gelir).
 */
export const DAILY_PENDING: string[] = [
  // Anket testleri

  // Görev testleri

];
/** Listenin örnek dosyalardan sonraki uzunluğu: liste bundan uzun olamaz (her yeni dosyada bu sayı da küçültülebilir). */
const PENDING_AT_START = 55;

const LIVE = publicInstruments();
const WITH_CONTENT = LIVE.filter((d) => DAILY[d.slug]);
const PART_TITLE = { survey: 'Günlük hayatta nasıl görünür', skills: 'Günlük hayatta nerede kullanılır' } as const;

const lower = (s: string) => s.toLocaleLowerCase('tr-TR');

/* ---------- İstek gövdeleri ---------- */

type Answers = Record<string, { value: number; rtMs: number | null }>;
const values = (d: LikertInstrument) => d.options.map((o) => o.value);
const lo = (d: LikertInstrument) => Math.min(...values(d));
const hi = (d: LikertInstrument) => Math.max(...values(d));
const all = (d: LikertInstrument, v: number): Answers => Object.fromEntries(d.items.map((it) => [it.key, { value: v, rtMs: 3000 }]));
/**
 * Kart kart yukarı ya da aşağı (ters maddeler çevrilerek): düzeyler uçlarda. Alt özelliğin maddesi boyutunun sırasını alır
 * (ayrıntılı profilde boyutun bütün alt özellikleri aynı yöne gider; yoksa boyut hep ortada kalırdı).
 */
const keyed = (d: LikertInstrument, up: (si: number) => boolean): Answers => {
  const cards = dailyScales(d).map((s) => s.key);
  const top = (k: string) => d.scales.find((s) => s.of?.includes(k) && cards.includes(s.key))?.key ?? k;
  return Object.fromEntries(
    d.items.map((it) => {
      const si = Math.max(0, cards.indexOf(top(it.scale)));
      return [it.key, { value: up(si) !== !!it.reverse ? hi(d) : lo(d), rtMs: 3100 }];
    }),
  );
};
const middle = (d: LikertInstrument) => values(d)[Math.floor(values(d).length / 2)];
/**
 * Düz maddeler en altta, ters maddeler ortanın hemen altında (beş seçenekte ortada): ters bir maddesi destek kutusunu açan
 * ölçeklerde düşük düzey işaretsiz de görünsün (İyimserlik'te kendine bakış ve ruh hâli, Öz-saygı). Öteki örüntülerde bu
 * ölçeklerin düşük düzeyi ya ters maddenin işaretiyle (örnek yok) ya da hiç görünmez.
 */
const softLow = (d: LikertInstrument): Answers =>
  Object.fromEntries(d.items.map((it) => [it.key, { value: it.reverse ? values(d)[Math.floor((values(d).length - 1) / 2)] : lo(d), rtMs: 3200 }]));

/** Testin bir dizi sonuç örüntüsü (her ölçek her düzey grubuna en az bir kez düşsün). */
function bodiesFor(d: InstrumentDef): AnswersBody[] {
  switch (d.engine) {
    case 'likert': {
      const grade = d.minGrade;
      const mixed = (likertBody(d.slug, grade, (i) => (i * 3 + 1) % 5).data as { answers: Answers }).answers;
      const sets = [all(d, lo(d)), all(d, hi(d)), all(d, middle(d)), keyed(d, (i) => i % 2 === 0), keyed(d, (i) => i % 2 === 1), softLow(d), mixed];
      // Sonuncusu mezun (13. sınıf) olarak da: ilk ortamın adı değişir.
      return [
        ...sets.map((answers) => ({ grade, data: { engine: 'likert' as const, answers } })),
        ...(d.maxGrade >= 13 ? [{ grade: 13, data: { engine: 'likert' as const, answers: mixed } }] : []),
      ];
    }
    case 'tasks': {
      const variants = Object.values(TASK_VARIANTS[d.slug] as Record<string, () => AnswersBody>).map((make) => {
        const body = make();
        return { ...body, grade: Math.max(body.grade, d.minGrade) };
      });
      return d.maxGrade >= 13 ? [...variants, { ...variants[0], grade: 13 }] : variants;
    }
    case 'reading':
      return [3, 6, 9, 12, 13].filter((g) => g >= d.minGrade && g <= d.maxGrade).map((g) => readingBody(g));
    case 'oral':
      return [1, 4, 8].map((g) => oralBody(d, g));
    default:
      throw new Error(`${(d as InstrumentDef).slug}: bu türün örnek gövdesi testte yok`);
  }
}

/** Sesli okuma: sınıfın kendi metni, yetişkinin işaretlediği sürüm (tests/rapor-bolumleri-okuma.test.ts'teki girdiye benzer). */
function oralBody(d: OralReadingInstrument, grade: number): AnswersBody {
  const p = oralPassagesFor(d, grade).find((x) => x.grade === grade)!;
  const words = oralWordCount(p.paragraphs);
  return {
    grade,
    data: {
      engine: 'oral',
      passageKey: p.key,
      recordMs: 120_000,
      readingMs: Math.round((words / 70) * 60_000),
      timingAuto: true,
      audio: { quality: 'good', pauses: [[1000, 1400]], speechMs: 40_000, contour: Array.from({ length: 60 }, (_, i) => (i * 7) % 100), interrupted: false },
      marks: {},
      listened: 1,
      retell: { recorded: true, ideas: p.ideas.filter((_, i) => i % 2 === 0).map((x) => x.key) },
      answers: Object.fromEntries(p.questions.map((q) => [q.key, q.answer])),
      prosody: { expression: 3, phrasing: 2, smoothness: 3, pace: 3 },
    },
  };
}

function reportsOf(d: InstrumentDef, body: AnswersBody): SimpleReport[] {
  const r = evaluate(d.slug, body);
  return [r.student, r.parent, ...(d.adults ? [evaluateAdult(d.slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
}

const partOf = (r: SimpleReport, key: ReportPart['key']) => r.parts?.find((p) => p.key === key);

/* ---------- Dil ---------- */

/** Cümleler; tırnak içindeki ifade tek sözcük sayılır. */
const sentences = (text: string) =>
  text
    .replace(/“[^”]*”/g, 'X')
    .split(/(?<=[.!?])\s+(?=[\p{Lu}\d“])/u)
    .filter((s) => s.trim());
const wordCount = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;

/** Tanı koyan, yargılayan, karşılaştıran ya da varsayımda bulunan sözcükler (sözcük başı, büyük-küçük harf duyarsız). */
const BANNED =
  /(?<!\p{L})(?:tanı|teşhis|iq|zekâ puanı|zeka puanı|hastalık|bozukluk|normal|anormal|seviye|depresyon|anksiyete|dehb|disleksi|tembel|aptal|zeki|yetersiz|başarısız|kusur|sorunlu|beceriksiz|akranların|yaşıtların|arkadaşlarından daha|diğer çocuklardan|çoğu çocuktan|anne|annen|annesi|baba|baban|babası|kız|erkek|her zaman|asla|kesinlikle)(?!\p{L})/iu;
/** Kesin yargı bildiren sözcükler. */
const ABSOLUTE = /(?<!\p{L})(?:hiçbir zaman|daima|mutlaka|her seferinde|hiç)(?!\p{L})/iu;
/** Başkalarıyla karşılaştırma ("arkadaşlarından daha", "sınıftakilerden daha"). */
const PEER = /\p{L}+(?:dan|den|tan|ten) daha(?!\p{L})/iu;
/**
 * Yaygınlık ve gruptaki rol ("bu düzeydeki birçok kişide", "çoğu çocuk", "ortamı sakinleştiren kişi sen olabilirsin").
 * "Birçok kişi" yalın, -de ya da ilgi hâlindeyse yaygınlık söyler; "birçok kişiyle", "birçok kişiye" bir sahnedir.
 */
const PREVALENCE =
  /(?:kişi|biri) (?:sen|o) olabil|(?:birçok|çoğu) (?:kişi|çocuk|öğrenci|genç|insan)(?:ler|lar)?(?:de|da|te|ta|in|ın|nin|nın)?(?!\p{L})|bu düzeydeki|herkes gibi/iu;
/** Klinik ya da korkutan sözcükler. */
const CLINICAL = /(?<!\p{L})(?:panik|atak|travma|kendine zarar|intihar|ilaç|tedavi|terapi|psikolog|psikiyatr|semptom|belirti)/iu;
/** Yetenek ya da zekâ söyleyen sözcükler ("zekâ oyunu" bir oyunun adıdır). */
const TALENT = /(?<!\p{L})(?:yetenek|kabiliyet|üstün(?!\p{L})|üstünlü|deha|zeki|zekâ(?! oyun)|zeka(?! oyun))/iu;
/** Kapsayıcılık: herkesin hayatında olmayan şeyler (denetim listesinin 14. maddesi). */
const INCLUSION = /(?<!\p{L})(?:asansör|kendi odan|kendi odası|özel ders|yurt dışı|bahçe|araba|otomobil|tatile|kardeş|yakın arkadaş|en iyi arkadaş|bir iki yakın)/iu;
/** 1–4. sınıfa açık testlerde telefon, mesaj ve internet varsayılmaz. */
const DEVICES = /(?<!\p{L})(?:telefon|mesaj|tablet|internet|bilgisayar|sosyal medya)/iu;
/** Uçlarda değer taşıyan sözcükler (denetim listesinin 23. maddesi). */
const POLE_BANNED = /(?<!\p{L})(?:yüzeysel|yetin|kaçın|zayıf|eksik|yetersiz|tembel|dağınık|pasif|sıkıcı|pratik)/iu;

/* ---------- İkinci kişi ("sen") ---------- */

/**
 * Satırdaki ikinci tekil kişi ("sen") işaretleri. Öğrenci ve yetişkin satırı en az birini taşır; veli satırı hiçbir kesin
 * işaret taşımaz. Metin tırnak içinden arındırılır (tırnak içi birinin sözüdür: “kalemler bırakılsın”), tr-TR küçük harfe
 * çevrilir ("Seni") ve virgül, noktalı virgül gibi işaretlerde yan cümlelere bölünür; her sözcüğe bakılır.
 *
 * Kesin işaretler (yalnızca "sen" dilinde yazılır):
 *  - zamirler: sen, senin, sana, seni, sende, senden, seninle, sence; dönüşlü kendin, kendinle, kendinin;
 *  - kişi eki -sın ("edebilirsin", "alamayacakmışsın"): ama "herkesin", "olsun", "… -sın diye" (üçüncü kişi istek:
 *    "sığsın diye") ve "-sa … -sın" ("ne yaparsa yapsın"; ikinci kişide "ne yaparsan yap") değil; s ile biten adın ilgi
 *    hâli ("dersin sonunda") de değil;
 *  - dilek-şart -san ("çalışsan", "zorlanırsan"): sözcüğün kendisi -san/-sen ile biten adlar ve -an ortacı ("insan",
 *    "kesen", "küsen") değil;
 *  - mastar + iyelik -man ("yapman", "duymanı"): "zaman", "hemen", "öğretmen" gibi kendisi -man ile bitenler değil; ilgi
 *    hâli ("yapmanın yolu") herkes için aynı yazıldığı için aranmaz;
 *  - sıfat-fiil + iyelik, yalın: -dığın, -acağın ("tanımadığın", "yapacağın"); çoğulu -dıkların, -acakların;
 *  - iyelik + vasıta -ınla ("arkadaşlarınla"): kökü n ile bitenler ("sorunla", "oyunla") ve "onunla", "bununla",
 *    "şununla" değil;
 *  - ünlüyle biten adların -n'li iyeliği (üçüncü kişide -sı gelir: kafan/kafası): kafan, ilgini, çantanı, ailene… ("karşın"
 *    bir bağlaç, "bilgin" bir addır);
 *  - yalın iyelikli adlar (canın, moralin, dikkatin, eşyaların, sözlerin, arkadaşların…).
 * Sıfat-fiilin çoğulu ve yalın iyelikli adlar ilgi hâliyle aynı yazılır ("eşyaların yerini", "duyduğu sözlerin
 * bazılarına"): aynı yan cümlede ardından gelen iki sözcükten biri üçüncü kişi iyeliği taşıyorsa ilgi hâli sayılır.
 *
 * Belirsiz işaretler (üçüncü kişide de aynı yazılır: "onun hoşuna", "ne yapacağını"): hoşuna, aklına, aklında, kendini,
 * kendine, -dığını, -acağına… Öğrenci satırında "sen" işareti sayılır, veli satırında aranmaz.
 *
 * Bilinen sınır: geçmiş zamanın -dın eki ("yaptın") ve ikinci kişi emir aranmaz (temkinli örneklerde kullanılmaz); sözlükte
 * olmayan bir adın yalın iyeliği ("işin") ilgi hâliyle karıştığı için aranmaz. Örnek tablosu "dil denetimlerinin kendisi"
 * testindedir.
 */
const YOU_PRONOUN = /^(?:sen|senin|sana|seni|sende|senden|seninle|sence|kendin|kendinle|kendinin)$/u;
const YOU_VERB = /^\p{L}{3,}(?:sın|sin|sun|sün)$/u;
const YOU_VERB_NOT = new Set(['herkesin', 'olsun']);
/** S ile biten adların ilgi hâli ("dersin sonunda", "sesin geldiği"). */
const S_GENITIVE = new Set(['dersin', 'sesin', 'hissin', 'kasın', 'otobüsün', 'kursun']);
const YOU_IF = /^\p{L}{2,}(?:san|sen)$/u;
const YOU_IF_NOT = new Set(['insan', 'nisan', 'kesen', 'küsen', 'basan', 'susan', 'esen', 'asan', 'kısan']);
const YOU_INF = /^\p{L}{2,}(?:ma|me)n(?:ı|i|a|e|da|de|dan|den|la|le)?$/u;
const YOU_INF_NOT = /^(?:zaman|hemen|roman|pişman|öğretmen|eğitmen|yönetmen|uzman|düşman|tamamen|orman|kahraman|liman|duman|yaman|harman|derman|çimen)/u;
const YOU_PART = /\p{L}(?:[dt][ıiuü]ğ[ıiuü]n|[ae]c[ae]ğ[ıi]n)$/u;
const YOU_PART_PLURAL = /\p{L}(?:[dt][ıiuü]kl[ae]r[ıi]n|[ae]c[ae]kl[ae]r[ıi]n)$/u;
const YOU_WITH = /\p{L}(?:ınla|inle|unla|ünle)$/u;
const YOU_WITH_NOT = new Set(['onunla', 'bununla', 'şununla', 'sorunla', 'oyunla', 'düğünle', 'koyunla', 'burunla', 'boyunla']);
const YOU_VOWEL_STEM = /^(?!(?:karşın|bilgin)$)(?:kafa|ilgi|aile|çanta|tempo|sevgi|öneri|bilgi|uyku|karşı|oda)n(?:ı|i|u|ü|a|e|da|de|dan|den|la|le)?$/u;
const YOU_POSSESSED = new Set([
  'canın', 'sinirin', 'moralin', 'hâlin', 'halin', 'cesaretin', 'keyfin', 'dikkatin', 'emeğin', 'düzenin', 'planın', 'aklın', 'arkadaşın',
  'yakının', 'sözün', 'evin', 'arkadaşların', 'eşyaların', 'gözlerin', 'sözlerin', 'duyguların', 'düşüncelerin', 'yakınların', 'nedenlerin',
  'günlerin',
]);
/** Üçüncü kişi iyeliği (ilgi hâlindeki adın baş adı): yerini, kısmını, listesi, bazılarına, derdi, gittiği… */
const HEAD_3 =
  /(?:[ıiuü]n(?:[ıiuü]|[ae]|d[ae]|d[ae]n|[ıiuü]n)|s[ıiuü](?:n(?:[ıiuü]|[ae]|d[ae]|d[ae]n|[ıiuü]n))?|l[ae]r[ıi](?:n(?:[ıiuü]|[ae]|d[ae]|d[ae]n|[ıiuü]n))?|[ıiuü]yl[ae]|[^aeıioöuül][ıiuü])$/u;
/** Baş ad olmayan zamirler ve niceleyiciler. */
const NOT_HEAD = /^(?:buna|şuna|ona|bunu|şunu|onu|bunda|onda|bundan|ondan|bunun|onun|kendi|bazı|iyi|biri|birini|birine|hepsi|ne|neyi|neye|çoğu|birçoğu)$/u;
const YOU_WEAK =
  /^(?:hoşuna|hoşunu|aklına|aklında|aklından|aklını|kendini|kendine|kendinde|kendinden)$|(?:[dt][ıiuü]ğ|[ae]c[ae]ğ)[ıiuü]n(?:[ıiuü]|[ae]|d[ae]|d[ae]n)$/u;

/** "Ne yaparsa yapsın", "ne olursa olsun": aynı kökün -sa'lı biçiminden sonra gelen -sın üçüncü kişidir. */
const concessive = (prev: string | undefined, w: string) => !!prev && /s[ae]$/u.test(prev) && prev.startsWith(w.slice(0, -3));

function youMarks(text: string): { word: string; sure: boolean }[] {
  const clauses = text
    .replace(/“[^”]*”/g, ' ')
    .toLocaleLowerCase('tr-TR')
    .split(/[,;:.!?()–—]/u)
    .map((c) => c.match(/\p{L}+/gu) ?? []);
  const out: { word: string; sure: boolean }[] = [];
  for (const ws of clauses) {
    const head = (w: string | undefined) => !!w && w.length >= 4 && !NOT_HEAD.test(w) && HEAD_3.test(w);
    const genitive = (i: number) => head(ws[i + 1]) || head(ws[i + 2]);
    ws.forEach((w, i) => {
      let sure = false;
      if (YOU_PRONOUN.test(w)) sure = true;
      else if (YOU_VERB.test(w)) sure = !YOU_VERB_NOT.has(w) && ws[i + 1] !== 'diye' && !concessive(ws[i - 1], w) && !(S_GENITIVE.has(w) && genitive(i));
      else if (YOU_IF.test(w)) sure = !YOU_IF_NOT.has(w);
      else if (YOU_INF.test(w)) sure = !YOU_INF_NOT.test(w);
      else if (YOU_PART.test(w)) sure = true;
      else if (YOU_PART_PLURAL.test(w)) sure = !genitive(i);
      else if (YOU_WITH.test(w)) sure = !YOU_WITH_NOT.has(w);
      else if (YOU_VOWEL_STEM.test(w)) sure = true;
      else if (YOU_POSSESSED.has(w)) sure = !genitive(i);
      if (sure || YOU_WEAK.test(w)) out.push({ word: w, sure });
    });
  }
  return out;
}
/** Öğrenci ve yetişkin satırı: "sen" dilinde (kesin ya da belirsiz bir işaret). */
const addressesYou = (t: string) => youMarks(t).length > 0;
/** Veli satırı ve kişisiz metinler: kesin bir "sen" işareti yok. */
const hasSecondPerson = (t: string) => youMarks(t).some((m) => m.sure);
/** Öğrenciye "siz" denmez. */
const PLURAL_YOU = /(?<!\p{L})(?:siz|size|sizi|sizin|sizinle|sizde)(?!\p{L})|\p{L}{3,}(?:sınız|siniz|sunuz|sünüz)(?!\p{L})|\p{L}+(?:dığınız|diğiniz|duğunuz|düğünüz|tığınız|tiğiniz|tuğunuz|tüğünüz)/iu;
/** Anket örneklerinde olasılık bildiren biçimler (her cümlede). */
const HEDGE = /abilir|ebilir|bazen|çoğu zaman|genellikle|yatkın/u;
/** Görev, okuma ve konu tarama metinlerinde sonuca, puana ya da geliştirmeye bağlanan sözcükler. */
const RESULT_WORDS = /zorlan|başarı|sonucun|puanın|daha iyi|geliştir|güçlendir|(?<!\p{L})test/iu;
const CONTEXT_PREFIX = /^(?:Okulda|Arkadaşlarla|Evde|İşte|Oyunda|Boş zamanda)\b/u;

/**
 * Evde başka birini varsayan sözcükler (yetişkin yalnız yaşıyor olabilir; denetim listesinin 16. maddesi): evdekiler, evdeki
 * biri, aile ve akrabalar. "Evdeki bir iş", "evdeki bir sorun" herkesin evinde olur: aranmaz.
 */
const OTHERS_AT_HOME =
  /(?<!\p{L})(?:evdekiler|evdeki (?:biri|kimse|herkes|büyükler|küçükler)|aile|kardeş|ebeveyn|anne|baba|büyükanne|dede|teyze|amca|dayı|kuzen)/iu;
/**
 * Hobi ve serbest zaman testi ilgiyi değil sıklığı sorar: satırlar beğeni ("keyifli gelebilir", "hoşuna gidebilir",
 * "isteyebilirsin") ya da ailenin imkânıyla ("pahalı", "harçlık") anlatmaz (denetim listesinin 13. maddesi).
 */
const ACTIVITY_NOT = /keyif|hoşuna|hoşlan|isteyebil|sevebil|çekici gel|imkân|imkan|pahalı|harçlık/iu;
/** Mezunun (13. sınıf) hayatında olmayabilecek okul sahneleri ("sınıflama" bir soru türüdür; denetim listesinin 17. maddesi). */
const CLASSROOM = /(?<!\p{L})(?:sınıf(?!lama)|teneffüs)/iu;

/* ---------- Maddeler aynen aktarılmaz ---------- */

/**
 * Anket satırı testin hiçbir maddesinin bütününü ve bir maddeden art arda dört sözcüğü içermez (denetim listesinin 3.
 * maddesi). Sözcükler büyük-küçük harf ve noktalama gözetilmeden, ekleriyle birlikte karşılaştırılır ("sakinimdir" ile
 * "sakin" farklıdır). Örnek maddenin konusundan bir günlük sahnedir: maddeyi yineleyen satır o maddeye verilen cevabı
 * anlatıyormuş gibi okunur (oysa düzeye göre seçilir; kişinin o maddeye cevabı tersi olabilir). Dört sözcüğün en çok birinin
 * içerik sözcüğü olduğu diziler gündelik dilin kalıplarıdır ("ne zaman ve nerede", "bir konu için çok"): sayılmaz.
 */
const VERBATIM_RUN = 4;
const FUNCTION_WORDS = new Set(
  (
    'bir ve ya da de ile ne neyi neye nerede nereye nasıl neden kadar için gibi göre çok az pek daha en bu şu o onu ona her hep hiç bazen ' +
    'bazı çoğu birçok şey şeyi şeyler şeyleri zaman sonra önce ki mi mı ama ancak olan diye kendi başka'
  ).split(' '),
);
const tokens = (s: string) => s.toLocaleLowerCase('tr-TR').match(/\p{L}+/gu) ?? [];
/** Satırda geçen madde dizileri: bütün madde ("madde: …") ya da art arda dört sözcük ("dizi: …"). */
function verbatimRuns(line: string, items: { key: string; text: string }[]): string[] {
  const words = ` ${tokens(line).join(' ')} `;
  const found: string[] = [];
  for (const it of items) {
    const w = tokens(it.text);
    if (words.includes(` ${w.join(' ')} `)) found.push(`${it.key} madde: ${it.text}`);
    for (let i = 0; i + VERBATIM_RUN <= w.length; i++) {
      const run = w.slice(i, i + VERBATIM_RUN);
      if (run.filter((x) => !FUNCTION_WORDS.has(x)).length <= 1) continue;
      if (words.includes(` ${run.join(' ')} `)) found.push(`${it.key} dizi: ${run.join(' ')}`);
    }
  }
  return found;
}

interface Line {
  where: string;
  audience: 'student' | 'parent' | 'adult';
  text: string;
}

/** Bir kitlenin üç satırı (yetişkinde öğrenci satırlarıyla tamamlanmış hâli). */
function allLines(t: { student: DailyLines; parent: DailyLines; adult?: AdultLines }, where: string, adults: boolean): Line[][] {
  const out: Line[][] = [];
  for (const audience of ['student', 'parent', ...(adults ? (['adult'] as const) : [])] as const) {
    out.push(linesOf(t, audience).map((text) => ({ where: `${where} ${audience}`, audience, text })));
  }
  return out;
}

function checkLine(l: Line, kind: 'survey' | 'skills', d: InstrumentDef) {
  const at = `${l.where}: ${l.text}`;
  expect(l.text.trim(), at).toBe(l.text);
  expect(l.text, at).toMatch(/[.!?]$/);
  expect(l.text, at).not.toMatch(CONTEXT_PREFIX);
  for (const re of [BANNED, ABSOLUTE, PEER, PREVALENCE, CLINICAL, TALENT, INCLUSION]) expect(l.text, `${at} (${re.source.slice(0, 30)}…)`).not.toMatch(re);
  if (d.minGrade <= 4) expect(l.text, at).not.toMatch(DEVICES);
  expect(sentences(l.text).length, at).toBeLessThanOrEqual(2);
  for (const s of sentences(l.text)) expect(wordCount(s), `${at} (${s})`).toBeLessThanOrEqual(22);
  if (l.audience === 'parent') {
    expect(youMarks(l.text).filter((m) => m.sure), `${at} (veliye "sen")`).toEqual([]);
  } else {
    expect(l.text, at).not.toMatch(/çocuğunuz/iu);
    expect(l.text, at).not.toMatch(PLURAL_YOU);
  }
  // Sınav Kaygısı ve Baş Etme'de "sınav" testin konusudur (tests/helpers/school.ts, EXAM_TESTS).
  if (l.audience === 'adult') expect(schoolWords(l.text.replace(/“[^”]*”/g, ''), d.slug), at).toEqual([]);
  if (kind === 'survey') {
    // Her cümle bir olasılık söyler; öğrenci ve yetişkin satırı "sen" der.
    for (const s of sentences(l.text)) expect(s, `${at} (temkinli değil)`).toMatch(HEDGE);
    if (l.audience !== 'parent') expect(addressesYou(l.text), `${at} ("sen" yok)`).toBe(true);
  } else expect(l.text, at).not.toMatch(RESULT_WORDS);
}

/** 2–4 sözcük, büyük harfle başlar, noktasız, en çok `max` karakter. */
function checkShort(text: string, max: number, at: string, words: [number, number] = [2, 4]) {
  expect(text.length, `${at}: ${text}`).toBeLessThanOrEqual(max);
  expect(wordCount(text), `${at}: ${text}`).toBeGreaterThanOrEqual(words[0]);
  expect(wordCount(text), `${at}: ${text}`).toBeLessThanOrEqual(words[1]);
  expect(text, at).toMatch(/^\p{Lu}/u);
  expect(text, at).not.toMatch(/[.!?:;]$/);
  for (const re of [BANNED, CLINICAL, TALENT, INCLUSION]) expect(text, at).not.toMatch(re);
}

/** Kartın ilk sözcüğü (büyük-küçük harf duyarsız; noktalama atılır). */
const firstWord = (t: string) => lower(t.match(/\p{L}+/u)?.[0] ?? '');

/* ---------- Kapsam ---------- */

describe('Günlük hayat: kapsam', () => {
  it('yayındaki her testin ya metni var ya da bekleyenler listesinde; liste yalnızca küçülür', () => {
    const live = LIVE.map((d) => d.slug);
    expect(new Set(DAILY_PENDING).size).toBe(DAILY_PENDING.length);
    expect(DAILY_PENDING.length).toBeLessThanOrEqual(PENDING_AT_START);
    for (const s of DAILY_PENDING) {
      expect(DAILY[s], `${s} metni yazıldı: bekleyenler listesinden sil`).toBeUndefined();
      expect(live, `${s} yayında değil`).toContain(s);
    }
    for (const s of live) expect(!!DAILY[s] || DAILY_PENDING.includes(s), `${s}: metin yok ve bekleyenler listesinde de değil`).toBe(true);
    for (const s of Object.keys(DAILY)) expect(live, s).toContain(s);
    // Her dosyanın adı testin adresidir; her dosya kayıtlıdır.
    const dir = path.join(import.meta.dirname, '../src/content/gunluk');
    const files = readdirSync(dir).filter((f) => f !== 'index.ts' && f !== 'types.ts').map((f) => f.replace(/\.ts$/, ''));
    expect(files.sort()).toEqual(Object.keys(DAILY).sort());
  });

  it('anket testleri: sonuç kartı olan her ölçek, üç düzey grubu, üç ortam ve gereken her kitle', () => {
    for (const d of WITH_CONTENT.filter((x): x is LikertInstrument => x.engine === 'likert')) {
      const c = DAILY[d.slug] as SurveyDaily;
      expect(c.kind, d.slug).toBe('survey');
      expect(c.version, d.slug).toMatch(/^[a-z0-9-]+-gunluk-\d+$/);
      const wanted = dailyScales(d).map((s) => s.key);
      expect(Object.keys(c.scales).sort(), d.slug).toEqual([...wanted].sort());
      const evaluative = !!REPORT_TEMPLATES[d.slug]?.evaluative;
      for (const key of wanted) {
        const s = c.scales[key];
        const at = `${d.slug} ${key}`;
        checkShort(s.poles.low, POLE_MAX_CHARS, `${at} düşük uç`);
        checkShort(s.poles.high, POLE_MAX_CHARS, `${at} yüksek uç`);
        expect(lower(s.poles.low), at).not.toBe(lower(s.poles.high));
        // Uçlarda değer taşıyan sözcük yok; değerlendirici testte düşük uç "Henüz" diye başlar.
        for (const pole of [s.poles.low, s.poles.high]) expect(pole, at).not.toMatch(POLE_BANNED);
        if (evaluative) expect(s.poles.low, at).toMatch(/^Henüz /u);
        // Örneklerin dayandığı maddeler: testte var ve bu ölçeğin (ya da boyutun alt özelliklerinin) maddesi.
        const scale = d.scales.find((x) => x.key === key)!;
        if (s.pointer) {
          // Örnek yerine yönlendirme (denetim listesinin 5. maddesi): yalnızca alt ölçekleri kendi kartlarında örneklenen bileşik ölçekte.
          expect(s.bands, at).toBeUndefined();
          expect(scale.of?.length, `${at}: yönlendirme yalnızca bileşik ölçekte`).toBeGreaterThan(0);
          for (const k of scale.of!) expect(wanted, `${at}: ${k} kendi kartında örneklenmiyor`).toContain(k);
          for (const k of scale.of!) expect(c.scales[k]?.bands, `${at}: ${k} örneksiz`).toBeDefined();
          expect(s.pointer.student && s.pointer.parent, at).toBeTruthy();
          continue;
        }
        const own = new Set([key, ...(scale.of ?? [])]);
        for (const g of ['low', 'average', 'high'] as const) {
          const b = s.bands[g];
          for (const lines of [b.student, b.parent]) for (const k of ['school', 'friends', 'home'] as const) expect(lines[k], `${at} ${g} ${k}`).toBeTruthy();
          // Yetişkine açık testte iş satırı zorunlu; yetişkine açık olmayan testte yetişkin metni yazılmaz.
          expect(!!b.adult?.work, `${at} ${g} yetişkin`).toBe(!!d.adults);
          if (!d.adults) expect(b.adult, at).toBeUndefined();
          const contexts = ['school', 'friends', 'home', ...(b.adult ? (['work'] as const) : [])] as const;
          expect(Object.keys(b.from).sort(), `${at} ${g} from`).toEqual([...contexts].sort());
          for (const k of contexts) {
            const keys = b.from[k] ?? [];
            expect(keys.length, `${at} ${g} ${k}: dayandığı madde`).toBeGreaterThan(0);
            expect(new Set(keys).size, `${at} ${g} ${k}`).toBe(keys.length);
            for (const ik of keys) {
              const item = d.items.find((it) => it.key === ik);
              expect(item, `${at} ${g} ${k}: ${ik} testte yok`).toBeDefined();
              expect(own.has(item!.scale), `${at} ${g} ${k}: ${ik} bu ölçeğin maddesi değil (${item!.scale})`).toBe(true);
              // Destek kutusunu açan madde örneğe dayanak olmaz (kutuyu açtıysa örnek yok; açmadıysa cevap örnekle çelişirdi).
              expect(d.supportItems?.some((x) => x.key === ik) ?? false, `${at} ${g} ${k}: ${ik} destek kutusunu açan madde`).toBe(false);
            }
          }
        }
      }
    }
  });

  it('görev, okuma ve konu tarama testleri: her sonuç parçası (her formda) tam bir kartla anlatılır', () => {
    for (const d of WITH_CONTENT.filter((x) => x.engine !== 'likert')) {
      const c = DAILY[d.slug] as SkillsDaily;
      expect(c.kind, d.slug).toBe('skills');
      expect(c.version, d.slug).toMatch(/^[a-z0-9-]+-gunluk-\d+$/);
      const grades = d.engine === 'quiz' ? (d as QuizInstrument).forms.map((f) => f.grade) : [d.minGrade];
      const used = new Set<SkillDaily>();
      for (const g of grades) {
        const { sources, form } = dailySources(d, g);
        expect(sources.length, d.slug).toBeGreaterThan(0);
        const here = c.skills.filter((s) => skillInForm(s, form));
        for (const src of sources) {
          const covering = here.filter((s) => (s.covers ?? [s.key]).includes(src.key));
          expect(covering.length, `${d.slug} ${form ?? ''} ${src.key}`).toBe(1);
          used.add(covering[0]);
        }
        expect(new Set(here.map((s) => s.key)).size, `${d.slug} ${form ?? ''}`).toBe(here.length);
      }
      // Hiçbir kart boşta kalmaz.
      for (const s of c.skills) expect(used.has(s), `${d.slug} ${s.key} ${s.forms?.join(',') ?? ''}`).toBe(true);
      const limits = [...d.science.limitations, d.science.whatItMeasures].join(' ');
      for (const s of c.skills) {
        const at = `${d.slug} ${s.key}`;
        checkShort(s.short, CENTER_MAX_CHARS, `${at} kısa ad`, [1, 3]);
        for (const w of s.short.split(/\s+/)) expect(w.length, `${at} kısa ad: ${w}`).toBeLessThanOrEqual(CENTER_WORD_MAX_CHARS);
        for (const k of ['school', 'friends', 'home'] as const) checkShort(s.branches[k], BRANCH_MAX_CHARS, `${at} dal ${k}`);
        expect(!!s.branches.work, `${at} iş dalı`).toBe(!!d.adults);
        if (s.branches.work) checkShort(s.branches.work, BRANCH_MAX_CHARS, `${at} dal work`);
        expect(!!s.adult?.work, `${at} yetişkin`).toBe(!!d.adults);
        if (s.title) checkShort(s.title, 40, `${at} başlık`, [1, 6]);
        // Yetişkinin gördüğü kısa ad, başlık ve dallarda okul sözcüğü yok.
        if (d.adults) for (const t of [s.short, s.title ?? '', s.branches.work!, s.branches.friends, s.branches.home]) expect(schoolWords(t), `${at}: ${t}`).toEqual([]);
        // 1–4. sınıfa açık testte dallarda, kısa adda ve başlıkta da telefon ya da mesaj yok.
        if (d.minGrade <= 4) for (const t of [...Object.values(s.branches), s.short, s.title ?? '']) expect(t, at).not.toMatch(DEVICES);
        // Kartın metni başlığıyla başlamaz (başlığın hemen altında yinelenirdi).
        const title = s.title ?? dailySources(d, d.engine === 'quiz' ? (d as QuizInstrument).forms.find((f) => !s.forms || s.forms.includes(f.key))!.grade : d.minGrade).sources.find((x) => (s.covers ?? [s.key]).includes(x.key))!.name;
        expect(firstWord(s.text), `${at}: ${s.text}`).not.toBe(firstWord(title));
        // Testin "bilgi vermez" dediği ya da başka bir testin ölçtüğü beceriye dayanan örnek yok.
        const all = [s.text, s.short, s.title ?? '', ...Object.values(s.branches), ...Object.values(s.student), ...Object.values(s.parent), ...Object.values(s.adult ?? {})].join(' ');
        for (const x of EXCLUDED[d.slug] ?? []) {
          expect(all, `${at}: ${x.pattern}`).not.toMatch(x.pattern);
          if (x.limitation) expect(limits, `${d.slug} sınırlılıklarında “${x.limitation}” yok`).toContain(x.limitation);
          if (x.sibling) expect(LIVE.map((t) => t.slug), `${x.sibling} yayında değil`).toContain(x.sibling);
          expect(!!(x.limitation || x.sibling || x.rule), `${d.slug} ${x.pattern}: gerekçe yok`).toBe(true);
        }
      }
    }
  });
});

/* ---------- Dil ---------- */

describe('Günlük hayat: dil', () => {
  it('satırlar: bir ya da iki cümle, en çok 22 sözcük; sen/çocuğunuz; yetişkinde okul sözcüğü yok; temkinli ve yargısız', () => {
    for (const d of WITH_CONTENT) {
      const c = DAILY[d.slug];
      const groups: { kind: 'survey' | 'skills'; lines: Line[][] }[] = [];
      if (c.kind === 'survey') {
        for (const [key, s] of Object.entries(c.scales)) {
          if (s.pointer) {
            // Örnek yerine yönlendirme: kartın kendi metni gibi (kısa, yargısız; veliye ikinci kişi yok, yetişkine okul yok).
            const at = `${d.slug} ${key} yönlendirme`;
            const texts = { student: s.pointer.student, parent: s.pointer.parent, adult: s.pointer.adult ?? s.pointer.student };
            for (const t of Object.values(texts)) {
              for (const re of [BANNED, ABSOLUTE, PEER, PREVALENCE, CLINICAL, TALENT, INCLUSION]) expect(t, at).not.toMatch(re);
              expect(sentences(t).length, at).toBeLessThanOrEqual(2);
              for (const x of sentences(t)) expect(wordCount(x), `${at}: ${x}`).toBeLessThanOrEqual(22);
            }
            expect(texts.student, at).not.toMatch(/çocuğunuz/iu);
            expect(hasSecondPerson(texts.parent), at).toBe(false);
            if (d.adults) expect(schoolWords(texts.adult, d.slug), at).toEqual([]);
            continue;
          }
          for (const g of ['low', 'average', 'high'] as const) groups.push({ kind: 'survey', lines: allLines(s.bands[g], `${d.slug} ${key} ${g}`, !!d.adults) });
        }
      } else {
        for (const s of c.skills) {
          groups.push({ kind: 'skills', lines: allLines(s, `${d.slug} ${s.key}`, !!d.adults) });
          const at = `${d.slug} ${s.key} tanım`;
          // Tanım herkese aynıdır: kişisiz.
          for (const re of [BANNED, RESULT_WORDS, ABSOLUTE, PEER, PREVALENCE, CLINICAL, TALENT, INCLUSION]) expect(s.text, at).not.toMatch(re);
          if (d.minGrade <= 4) expect(s.text, at).not.toMatch(DEVICES);
          expect(s.text, at).not.toMatch(/çocuğunuz/iu);
          expect(hasSecondPerson(s.text), at).toBe(false);
          if (d.adults) expect(schoolWords(s.text), at).toEqual([]);
          expect(sentences(s.text).length, at).toBeLessThanOrEqual(2);
          for (const x of sentences(s.text)) expect(wordCount(x), `${at}: ${x}`).toBeLessThanOrEqual(22);
        }
      }
      const words: number[] = [];
      for (const { kind, lines } of groups) {
        for (const set of lines) {
          for (const l of set) {
            checkLine(l, kind, d);
            words.push(...sentences(l.text).map(wordCount));
          }
          // Veli satırları çocuğunuzdan (sesli okumanın veli ve öğretmen raporunda öğrenciden) söz eder.
          const audience = set[0].audience;
          if (audience === 'parent') expect(set.some((l) => (d.engine === 'oral' ? /öğrenci/iu : /çocuğunuz/iu).test(l.text)), set[0].where).toBe(true);
          if (audience === 'parent' && d.engine === 'oral') for (const l of set) expect(l.text, l.where).not.toMatch(/çocuğunuz/iu);
        }
        // Veli satırı öğrencininkiyle ancak "sen" demeyen (kişisiz) bir örnekse aynı olabilir; ankette hiçbir zaman.
        const [student, parent] = lines;
        student.forEach((l, i) => {
          if (l.text !== parent[i].text) return;
          expect(kind, `${l.where}: veli satırı öğrencininkiyle aynı`).toBe('skills');
          expect(hasSecondPerson(l.text), `${l.where}: ${l.text}`).toBe(false);
        });
      }
      // Bir ölçeğin aynı kitledeki satırları düzeyden düzeye kopyalanmaz (dokuz satır, yetişkinde iş satırları da farklı).
      if (c.kind === 'survey') {
        for (const [key, s] of Object.entries(c.scales)) {
          if (!s.bands) continue;
          const bands = s.bands;
          for (const audience of ['student', 'parent', ...(d.adults ? (['adult'] as const) : [])] as const) {
            const texts = (['low', 'average', 'high'] as const).flatMap((g) => linesOf(bands[g], audience));
            const own = audience === 'adult' ? (['low', 'average', 'high'] as const).map((g) => bands[g].adult!.work) : texts;
            expect(new Set(own).size, `${d.slug} ${key} ${audience}: aynı satır birden çok düzeyde`).toBe(own.length);
            expect(new Set(texts).size, `${d.slug} ${key} ${audience}`).toBe(texts.length);
          }
        }
      }
      // Ortalama cümle uzunluğu sade dilin sınırında.
      const mean = words.reduce((a, b) => a + b, 0) / words.length;
      expect(mean, `${d.slug} ortalama ${mean.toFixed(1)} sözcük`).toBeLessThanOrEqual(13);
    }
  });

  it('bölümün kendi metinleri: kısa cümleler, sen/çocuğunuz, yetişkinde okul sözcüğü yok, tanı ve karşılaştırma yok', () => {
    for (const d of WITH_CONTENT) {
      for (const r of reportsOf(d, bodiesFor(d)[0])) {
        const p = partOf(r, 'daily')!;
        const own = [p.title, p.intro, p.introNote ?? '', ...partCards(p).flatMap((c) => [c.title, c.badge ?? '', c.text ?? '', ...(c.spoken ?? [])])].filter(Boolean);
        const label = `${d.slug} ${r.audience}`;
        // Anket kartının başlığı ölçeğin testteki adıdır (Zihniyet'te "Zekâya bakış"): bölümün kendi yazdığı bir yetenek ya da
        // zekâ iddiası değildir; yetenek sözcükleri yalnızca ölçek adlarında aranmaz (öteki sözcükler aranır). Görev ve okuma
        // kartlarının başlığını yazar verir (SkillDaily.title); orada aranır.
        const titles = new Set(d.engine === 'likert' ? d.scales.map((s) => s.name) : []);
        for (const t of own) {
          for (const re of [BANNED, PREVALENCE, PEER, CLINICAL, ...(titles.has(t) ? [] : [TALENT])]) expect(t, label).not.toMatch(re);
          for (const s of sentences(t)) expect(wordCount(s), `${label}: ${s}`).toBeLessThanOrEqual(22);
        }
        const joined = own.join(' ');
        if (r.audience === 'parent') expect(hasSecondPerson(joined.replace(/“[^”]*”/g, '')), `${label}: ${joined}`).toBe(false);
        else expect(joined, label).not.toMatch(/çocuğunuz/iu);
        if (r.audience === 'adult') expect(schoolWords(joined.replace(/“[^”]*”/g, ''), d.slug), label).toEqual([]);
      }
    }
  });

  it('anket: hiçbir satır bir maddeyi bütünüyle ya da bir maddeden art arda dört sözcüğü aktarmaz', () => {
    const found: string[] = [];
    for (const d of WITH_CONTENT.filter((x): x is LikertInstrument => x.engine === 'likert')) {
      const c = DAILY[d.slug] as SurveyDaily;
      for (const [key, s] of Object.entries(c.scales)) {
        const texts = s.pointer
          ? Object.values(s.pointer)
          : (['low', 'average', 'high'] as const).flatMap((g) => [...Object.values(s.bands[g].student), ...Object.values(s.bands[g].parent), ...Object.values(s.bands[g].adult ?? {})]);
        for (const t of texts) found.push(...verbatimRuns(t, d.items).map((x) => `${d.slug} ${key}: ${x} → ${t}`));
      }
    }
    expect(found).toEqual([]);
  });
});

/* ---------- Kapsayıcılık ---------- */

/** Bir testin bütün satır takımları (anket: ölçek × düzey grubu; görev: kart). */
function lineSets(d: InstrumentDef): { where: string; t: { student: DailyLines; parent: DailyLines; adult?: AdultLines } }[] {
  const c = DAILY[d.slug];
  if (c.kind === 'skills') return c.skills.map((s) => ({ where: `${d.slug} ${s.key}`, t: s }));
  return Object.entries(c.scales).flatMap(([key, s]) => {
    const bands = s.bands;
    return bands ? (['low', 'average', 'high'] as const).map((g) => ({ where: `${d.slug} ${key} ${g}`, t: bands[g] })) : [];
  });
}

describe('Günlük hayat: kapsayıcılık', () => {
  it('yetişkine açık testte yetişkinin gördüğü satırlar evde başka birini varsaymaz (öğrencinin ev satırı varsayıyorsa adult.home)', () => {
    const found: string[] = [];
    for (const d of WITH_CONTENT.filter((x) => x.adults)) {
      for (const { where, t } of lineSets(d)) {
        // Yetişkin, kendi satırı yazılmamış ortamda öğrencinin satırını görür (linesOf).
        linesOf(t, 'adult').forEach((text, i) => {
          if (OTHERS_AT_HOME.test(text)) found.push(`${where} ${SURVEY_CONTEXTS.adult[i]}${t.adult?.[(['work', 'friends', 'home'] as const)[i]] ? '' : ' (öğrenci satırı)'}: ${text}`);
        });
      }
    }
    expect(found).toEqual([]);
  });

  it('hobi ve serbest zaman (etkinlik profili): satırlar sıklığı anlatır; beğeni ve imkân sözcükleri yok', () => {
    const found: string[] = [];
    const tests = WITH_CONTENT.filter((x): x is LikertInstrument => x.engine === 'likert' && x.profile === 'activities');
    expect(tests.length).toBeGreaterThan(0);
    for (const d of tests) for (const { where, t } of lineSets(d)) for (const x of [...Object.values(t.student), ...Object.values(t.parent), ...Object.values(t.adult ?? {})]) if (ACTIVITY_NOT.test(x)) found.push(`${where}: ${x}`);
    expect(found).toEqual([]);
  });

  it('mezuna (13. sınıf) açık testte öğrenci ve veli metinlerinde sınıf ve teneffüs yok', () => {
    const found: string[] = [];
    for (const d of WITH_CONTENT.filter((x) => x.maxGrade >= 13)) {
      const c = DAILY[d.slug];
      const texts: [string, string][] = lineSets(d).flatMap(({ where, t }) => [...Object.values(t.student), ...Object.values(t.parent)].map((x) => [where, x] as [string, string]));
      if (c.kind === 'skills') for (const s of c.skills) for (const x of [s.text, s.short, s.title ?? '', s.branches.school, s.branches.friends, s.branches.home]) texts.push([`${d.slug} ${s.key}`, x]);
      else for (const [key, s] of Object.entries(c.scales)) if (s.pointer) texts.push([`${d.slug} ${key}`, s.pointer.student], [`${d.slug} ${key}`, s.pointer.parent]);
      for (const [where, x] of texts) if (CLASSROOM.test(x)) found.push(`${where}: ${x}`);
    }
    expect(found).toEqual([]);
  });
});

/* ---------- Dil denetimlerinin kendisi ---------- */

describe('Günlük hayat: dil denetimlerinin kendisi', () => {
  it('"sen" işaretleri: öğrenci satırında bulunur, veli satırında yanlışlıkla bulunmaz (örnek tablosu)', () => {
    // Öğrenci ve yetişkin satırı olarak "sen" der.
    const YOU = [
      'Seni üzen bir şey olunca biriyle konuşmak iyi gelebilir.',
      'Yapacağın işi önceden düşünmek iyi gelebilir.',
      'Yeni bir konu açılınca kafan karışabilir.',
      'Sözlerin bazen bir arkadaşını kırabilir.',
      'Eşyaların bazen derli toplu olabilir.',
      'Arkadaşlarınla buluşmak keyifli gelebilir.',
      'Çalışsan da sonucun değişmeyeceğini düşünebilirsin.',
      'Yapman gereken bir işi unutabilir.',
      'Merak ettiğin bir soruyu araştırabilir.',
      'Konusu ilgini çekince sonuna kadar okuyabilir.',
      // "-sa … -sın" yalnızca aynı kökte üçüncü kişidir: "kursa" bir addır.
      'Sık sık bir kursa katılabilirsin.',
    ];
    // Yalnızca öğrenci satırında "sen" sayılır (üçüncü kişide de aynı yazılır).
    const WEAK = ['Böyle bir oyun hoşuna gidebilir.', 'Ne yapacağını önceden düşünmek iyi gelebilir.'];
    // "Sen" yok: üçüncü kişi, ilgi hâli, kökü n ya da s ile biten ad, tırnak içi.
    const NOT_YOU = [
      'Bir arkadaşın derdini dinlemek ona iyi gelebilir.',
      'Eşyaların yerini değiştirmek ona keyifli gelebilir.',
      'Eşyaların yeri bazen değişebilir.',
      'Dersin sonunda soru sormak isteyebilir.',
      'Her şey yolunda olsun diye çalışabilir.',
      'Mektup zarfa sığsın diye katlanabilir.',
      'Öğretmen “Sen de gel” deyince sevinebilir.',
      'Bununla ya da şununla ilgilenmek ona keyifli gelebilir.',
      'Bir sorunla karşılaşınca önce kendi başına çözmeyi deneyebilir.',
      'Duyduğu sözlerin bazılarına hemen inanabilir.',
      'Sınav bitince “kalemler bırakılsın” uyarısını bekleyebilir.',
      'Herkesin önünde konuşmak çocuğunuza zor gelebilir.',
      'Çocuğunuz işlerin bir kısmını sonraya bırakabilir.',
      'Bir buluşmanın saatini önceden ayarlamak isteyebilir.',
      'Zamanla bu duygu hafifleyebilir; öğretmeni de yardım edebilir.',
      'Küsen iki arkadaşı barıştırmak ona anlamlı gelebilir.',
      'Yorgun olmasına karşın işini bitirebilir.',
    ];
    // Veli satırında doğru (belirsiz biçimler üçüncü kişidir).
    const PARENT_OK = [
      ...WEAK,
      'İnsanların iyi niyetli olduğuna inanabilir.',
      'Çocuğunuz ne yapacağını önceden düşünebilir; bu ona güven verebilir.',
      'Ne yaparsa yapsın sonucun değişmeyeceğini düşünebilir.',
    ];
    for (const t of [...YOU, ...WEAK]) expect(addressesYou(t), t).toBe(true);
    for (const t of YOU) expect(hasSecondPerson(t), `veliye: ${t}`).toBe(true);
    for (const t of PARENT_OK) expect(hasSecondPerson(t), `veliye: ${t}`).toBe(false);
    for (const t of NOT_YOU) {
      expect(addressesYou(t), `öğrenciye: ${t}`).toBe(false);
      expect(hasSecondPerson(t), `veliye: ${t}`).toBe(false);
    }
  });

  it('yaygınlık, maddeyi aktarma, evde başka biri ve okul sahnesi: örnek tablosu', () => {
    for (const t of ['Bu düzeydeki birçok kişide görülebilir.', 'Çoğu çocuk böyle hissedebilir.', 'Çoğu öğrencinin aklına gelebilir.', 'Ortamı neşelendiren kişi sen olabilirsin.'])
      expect(t).toMatch(PREVALENCE);
    for (const t of ['Birçok kişiyle tanışmak sana keyifli gelebilir.', 'Birçok kişiye aynı anda bir şey anlatmak zor gelebilir.']) expect(t).not.toMatch(PREVALENCE);
    const items = [
      { key: 'a', text: 'Bir konuyu ayrıntısıyla araştırmak bana sıkıcı gelir.' },
      { key: 'b', text: 'Bir işi ne zaman ve nerede yapacağımı önceden kararlaştırırım.' },
      { key: 'c', text: 'Pikniğe gitmek' },
    ];
    expect(verbatimRuns('Derste bir konuyu ayrıntısıyla araştırmak sana pek çekici gelmeyebilir.', items)).toEqual(['a dizi: bir konuyu ayrıntısıyla araştırmak']);
    expect(verbatimRuns('Arkadaşlarınla pikniğe gitmek hoşuna gidebilir.', items)).toEqual(['c madde: Pikniğe gitmek']);
    for (const t of ['Arkadaşlarınla bir işin ne zaman ve nerede yapılacağını konuşabilirsin.', 'Bir konuyu araştırırken ayrıntılara inmek sana sıkıcı gelebilir.', 'Pikniğe gitmekten hoşlanabilirsin.'])
      expect(verbatimRuns(t, items), t).toEqual([]);
    for (const t of ['Evdekilerle sohbet etmek sana iyi gelebilir.', 'Ailenle bir plan yapabilirsin.', 'Evdeki biri yardım isteyince hemen koşabilirsin.']) expect(t).toMatch(OTHERS_AT_HOME);
    for (const t of ['Evdeki bir işi hemen halledebilirsin.', 'Evdeki bir sorun karşısında sakin kalabilirsin.', 'Yakınlarınla bir plan yapabilirsin.']) expect(t).not.toMatch(OTHERS_AT_HOME);
    for (const t of ['Sınıfta söz almak sana zor gelebilir.', 'Üzgün bir sınıf arkadaşının yanına gidebilirsin.', 'Teneffüste oynayabilirsin.']) expect(t).toMatch(CLASSROOM);
    for (const t of ['Derste söz almak sana zor gelebilir.', 'Kelimeleri sınıflamak bu tür bir iştir.']) expect(t).not.toMatch(CLASSROOM);
  });
});

/* ---------- Raporda ---------- */

/** Bölüm "Düzeylerin anlamı"nın hemen ardında, cevaplardan ve denetimlerden önce. */
function checkOrder(r: SimpleReport, label: string) {
  const keys = (r.parts ?? []).map((p) => p.key);
  const i = keys.indexOf('daily');
  expect(i, `${label}: ${keys.join(',')}`).toBeGreaterThan(-1);
  if (keys.includes('levels')) expect(keys[i - 1], label).toBe('levels');
  else expect(i, label).toBe(0);
  expect(keys.slice(i + 1), label).toEqual(keys.filter((k) => k === 'answers' || k === 'quality'));
}

/** Yazılar en küçük boyun altına inmez (PDF'te ≈ 7,5 punto); iki ucun adı aynı boyda. */
function checkSizes(v: DailyKindVisual, at: string) {
  for (const { width, font } of VISUAL_SIZES) {
    const texts = drawVisual(v, width, font).shapes.filter((x) => x.k === 'text');
    for (const t of texts) expect(t.size, `${at} (${width}): ${t.text}`).toBeGreaterThanOrEqual(font * DAILY_MIN_TEXT - 0.011);
    if (v.type === 'poles') expect(new Set(texts.filter((t) => t.weight === 600).map((t) => t.size)).size, `${at} (${width}): iki uç aynı boyda`).toBe(1);
  }
}

const GROWTH_INTRO = 'Örnekler bugünkü durumu anlatır; bu durum zamanla değişebilir.';
const TRAIT_INTRO = 'Örnekler bir ucu iyi, ötekini kötü diye anlatmaz; günlük hayatta neyin öne çıkabileceğini gösterir.';

/**
 * Motivasyon profilinde bileşik ölçeğin iki parçasından biri yüksek, öteki düşük mü: parçaların düzeyi "Düzeylerin
 * anlamı"ndaki kartlarından okunur (bölümün kendi hesabından bağımsız).
 */
function motivationSplit(levels: Map<string, PartCard>, of: string[]): boolean {
  const groups = of.map((k) => {
    const g = levels.get(k)?.visual as GaugeVisual | undefined;
    return g && g.active !== null ? bandGroup(g.zones[g.active].band) : null;
  });
  return groups.includes('high') && groups.includes('low');
}

function checkSurvey(d: LikertInstrument, r: SimpleReport, grade: number, flagged: string[], label: string, seen: Map<string, Set<string>>) {
  const content = DAILY[d.slug] as SurveyDaily;
  const p = partOf(r, 'daily')!;
  expect(p.title, label).toBe(PART_TITLE.survey);
  const levels = new Map(partCards(partOf(r, 'levels')!).map((c) => [c.key, c]));
  const cards = partCards(p);
  expect(cards.map((c) => c.key).sort(), label).toEqual(dailyScales(d).map((s) => s.key).sort());
  // Sıra "Düzeylerin anlamı"ndaki gibi.
  const order = [...levels.keys()];
  expect(cards.map((c) => order.indexOf(c.key)), label).toEqual(cards.map((c) => order.indexOf(c.key)).sort((a, b) => a - b));
  // Mezun (13): ilk ortam "Okulda ya da derslerde".
  const graduate = grade === 13 && r.audience !== 'adult';
  const contexts = r.audience === 'adult' ? [...SURVEY_CONTEXTS.adult] : [graduate ? GRADUATE_SCHOOL_CONTEXT : SURVEY_CONTEXTS.you[0], ...SURVEY_CONTEXTS.you.slice(1)];
  expect(p.intro, label).toContain(`günlük hayatta nasıl görünebileceğine dair örnekler var: ${lowerFirst(contexts[0])}, `);
  // Giriş her kart için doğrudur: hepsi gelişim tonundaysa bugünkü durumu, değilse iki ucun eşitliğini anlatır; karışık
  // testte gelişim tonundaki kart bunu kendisi söyler.
  const tones = dailyScales(d).map((x) => scaleTone(d, x.key));
  const mixed = new Set(tones).size > 1;
  if (!['riasec', 'interests', 'activities', 'values'].includes(d.profile ?? '')) expect(p.intro, label).toContain(tones.every((t) => t === 'growth') ? GROWTH_INTRO : TRAIT_INTRO);
  for (const c of cards) {
    const at = `${label} ${c.key}`;
    const scale = d.scales.find((s) => s.key === c.key)!;
    const lc = levels.get(c.key)!;
    const g = lc.visual as GaugeVisual;
    const v = c.visual as PolesVisual;
    expect(c.title, at).toBe(scale.name);
    // Rozet "Düzeylerin anlamı"ndaki kartın rozetiyle (ve dolayısıyla sonuç kartıyla, genel bakışla) aynıdır.
    expect(c.badge, at).toBe(lc.badge);
    expect(v.type, at).toBe('poles');
    expect([v.label, v.low, v.high, v.min, v.max], at).toEqual([scale.name, content.scales[c.key].poles.low, content.scales[c.key].poles.high, g.min, g.max]);
    checkDrawn(v, at);
    checkSizes(v, at);
    const spoken = (c.spoken ?? []).join(' ');
    expect(spoken, at).toContain(`Bir uç: “${lowerFirst(v.low)}”. Öbür uç: “${lowerFirst(v.high)}”.`);
    if (g.value === null || g.active === null) {
      expect([v.value, v.zone, c.lines], at).toEqual([null, null, undefined]);
      expect(c.badge, at).toBe('Hesaplanamadı');
      expect(c.text, at).toMatch(/düzey belirlenemedi/);
      continue;
    }
    const zone = g.zones[g.active];
    expect(v.zone, at).toEqual({ from: zone.from, to: zone.to, label: zone.label });
    expect(v.zone!.label, at).toBe(c.badge);
    // İşaret kişinin bölgesinde; puandan en çok yuvarlama payı kadar uzak.
    expect(v.value!, at).toBeGreaterThanOrEqual(zone.from - 1e-9);
    expect(v.value!, at).toBeLessThanOrEqual(zone.to + 1e-9);
    expect(Math.abs(v.value! - g.value), at).toBeLessThanOrEqual(0.051);
    const group = bandGroup(zone.band)!;
    expect(spoken, at).toContain(group === 'average' ? 'iki ucun arasında' : `şu uca daha yakın: “${lowerFirst(group === 'low' ? v.low : v.high)}”.`);
    if (/ayrı(ş|l)/.test(c.text ?? '')) {
      // Cevaplar iki uca ayrıldıysa örnek seçilmez (kart da düzeyin genel anlatımı yerine ayrışmayı anlatır).
      expect(c.lines, at).toBeUndefined();
      continue;
    }
    if (d.profile === 'motivation' && scale.of?.length === 2 && motivationSplit(levels, scale.of)) {
      // Motivasyon profilinde bileşik ölçeğin iki parçası biri yüksek, öteki düşük: örnek yok; kart profil yorumuna (ya da
      // profil hesaplanamadıysa parçaların ayrı sonuçlarına) yönlendirir.
      expect(c.lines, at).toBeUndefined();
      expect(c.text, at).toMatch(/^Bu türün iki parçasının düzeyi birbirinden çok farklı olduğu için düzeye göre örnek seçilmedi\. /);
      continue;
    }
    if (flagged.includes(c.key)) {
      // Destek önerisini bu ölçekteki bir cevap açtı: örnek yok; kart destek kutusunu gösterir (rapor da kutuyu gösterir).
      expect(c.lines, at).toBeUndefined();
      expect(c.text, at).toMatch(/örnek gösterilmedi; .*destek kutusunda ayrıca ele alınıyor\./);
      expect(r.support, at).not.toBeNull();
      continue;
    }
    const daily = content.scales[c.key];
    if (daily.pointer) {
      // Örnek yerine yönlendirme: rozet ve iki uç kalır, satır yok; metin kitleye göre yönlendirmedir.
      const p = daily.pointer;
      expect(c.lines, at).toBeUndefined();
      expect(c.text, at).toBe(r.audience === 'parent' ? p.parent : r.audience === 'adult' ? (p.adult ?? p.student) : p.student);
      continue;
    }
    expect(c.lines?.map((l) => l.label), at).toEqual(contexts);
    expect(c.lines?.map((l) => l.text), at).toEqual(linesOf(daily.bands[group], r.audience as Audience));
    // "Bu da uyabilir" yazan komşu düzey başka bir gruptaysa kart onun örneklerinin de uyabileceğini söyler.
    const near = (lc.levels ?? [])
      .filter((l) => l.near)
      .flatMap((l) => l.label.split(' · ').map((x) => bandGroup(g.zones.find((z) => z.label === x)!.band)))
      .filter((x) => x !== group);
    expect(/komşu düzey(?:in|lerin) sınırına yakın/.test(c.text ?? ''), `${at}: ${c.text} (${near.join(',')})`).toBe(near.length > 0);
    expect(/bugünkü durumu anlatır/.test(c.text ?? ''), at).toBe(mixed && scaleTone(d, c.key) === 'growth');
    if (!seen.has(c.key)) seen.set(c.key, new Set());
    seen.get(c.key)!.add(group);
  }
}

function checkSkills(d: InstrumentDef, r: SimpleReport, grade: number, label: string) {
  const content = DAILY[d.slug] as SkillsDaily;
  const p = partOf(r, 'daily')!;
  expect(p.title, label).toBe(PART_TITLE.skills);
  const { sources, form } = dailySources(d, grade);
  const expected = content.skills.filter((s) => skillInForm(s, form) && (s.covers ?? [s.key]).some((k) => sources.some((x) => x.key === k)));
  const cards = partCards(p);
  expect(cards.map((c) => c.key).sort(), label).toEqual(expected.map((s) => s.key).sort());
  const adult = r.audience === 'adult';
  const contexts = adult ? [...SKILL_CONTEXTS.adult] : [grade === 13 ? GRADUATE_SCHOOL_CONTEXT : SKILL_CONTEXTS.you[0], ...SKILL_CONTEXTS.you.slice(1)];
  for (const c of cards) {
    const s = expected.find((x) => x.key === c.key)!;
    const at = `${label} ${c.key}`;
    const v = c.visual as ContextsVisual;
    expect(v.type, at).toBe('contexts');
    expect(c.title, at).toBe(s.title ?? sources.find((x) => (s.covers ?? [s.key]).includes(x.key))!.name);
    expect(v.center, at).toBe(s.short);
    expect(v.branches, at).toEqual(contexts.map((context, i) => ({ context, label: [adult ? s.branches.work! : s.branches.school, s.branches.friends, s.branches.home][i] })));
    expect(c.text, at).toBe(s.text);
    expect(c.badge, at).toBeUndefined();
    expect(c.spoken, at).toEqual([`Kullanıldığı yerler: ${v.branches.map((b) => `${lowerFirst(b.context)}, ${lowerFirst(b.label)}`).join('; ')}.`]);
    expect(c.lines?.map((l) => l.label), at).toEqual(contexts);
    expect(c.lines?.map((l) => l.text), at).toEqual(linesOf(s, r.audience as Audience));
    checkDrawn(v, at);
    checkSizes(v, at);
  }
}

/**
 * Sesli dinleme bölümü eksiksiz okur: başlık, giriş, her kartın adı, grafiğin sözle anlatımı ve her satır "Okulda: …". Raporu
 * baştan sona okuyan listede (ilk cümle raporun yaklaşık süresi) bölümün bütün parçaları art arda ve tek bölümdür.
 */
function checkSpeech(r: SimpleReport, label: string) {
  const p = partOf(r, 'daily')!;
  const utter = utterancesOf(allSegments(reportSpeech(r)));
  expect(utter[0].text, label).toMatch(/^Rapor yaklaşık \d+ dakika sürer\.$/);
  const mine = utter.filter((u) => u.section === p.title);
  expect(mine.length, label).toBeGreaterThan(0);
  const first = utter.indexOf(mine[0]);
  expect(utter.slice(first, first + mine.length), label).toEqual(mine);
  const text = mine.map((u) => u.text).join(' ');
  expect(text, label).toContain(speakable(p.title));
  for (const c of partCards(p)) {
    expect(mine.some((u) => u.segment === c.title), `${label} ${c.title}`).toBe(true);
    for (const s of c.spoken ?? []) expect(text, `${label} ${s}`).toContain(speakable(s).replace(/\.$/, ''));
    for (const l of c.lines ?? []) expect(text, `${label} ${l.label}`).toContain(speakable(`${l.label}: ${l.text}`).replace(/\.$/, ''));
    if (c.text) expect(text, label).toContain(speakable(c.text).replace(/\.$/, ''));
  }
  // Grafiğin nasıl okunacağı sesli okunmaz.
  if (p.introNote) expect(text, label).not.toContain(speakable(p.introNote).slice(0, 30));
  expect(text, label).not.toMatch(/(?<!\p{L})(?:kırmızı|vurgulu bölge)/iu);
}

describe('Günlük hayat: raporda', () => {
  it('öğrenci, veli ve yetişkin raporunda doğru yerde; kartlar ölçeklerle, rozetler kartın düzeyiyle aynı; her düzey grubu görünür', () => {
    let cards = 0;
    for (const d of WITH_CONTENT) {
      const seen = new Map<string, Set<string>>();
      for (const body of bodiesFor(d)) {
        for (const r of reportsOf(d, body)) {
          const label = `${d.slug} ${r.audience} (${body.grade})`;
          checkOrder(r, label);
          const p = partOf(r, 'daily')!;
          expect(p.intro, label).toBeTruthy();
          expect(p.collapsed ?? false, label).toBe(partCards(p).length > 8);
          if (d.engine === 'likert') {
            const answers = (body.data as { answers: Record<string, LikertAnswer> }).answers;
            checkSurvey(d, r, r.audience === 'adult' ? ADULT_GRADE : body.grade, likertItemFlags(d, answers).flagged, label, seen);
          } else checkSkills(d, r, r.audience === 'adult' ? ADULT_GRADE : body.grade, label);
          cards += partCards(p).length;
        }
      }
      // Anket testlerinde her ölçeğin üç düzey grubunun da örnekleri raporda göründü.
      // (Örnek yerine yönlendirme taşıyan bileşik ölçek hariç.)
      if (d.engine === 'likert')
        for (const s of dailyScales(d).filter((x) => !(DAILY[d.slug] as SurveyDaily).scales[x.key].pointer))
          expect([...(seen.get(s.key) ?? [])].sort(), `${d.slug} ${s.key}`).toEqual(['average', 'high', 'low']);
    }
    expect(cards).toBeGreaterThan(100);
  }, 240_000);

  it('sesli dinleme bölümü eksiksiz okur (raporu baştan sona okuyan listede, metni olan her testte)', () => {
    expect(WITH_CONTENT.length).toBeGreaterThanOrEqual(49);
    for (const d of WITH_CONTENT) for (const body of bodiesFor(d).slice(0, 2)) for (const r of reportsOf(d, body)) checkSpeech(r, `${d.slug} ${r.audience}`);
  }, 120_000);

  it('ekranda: bölüm "Düzeylerin anlamı"ndan sonra, cevaplardan önce; satırlar ve grafik sayfada', () => {
    const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
    for (const d of WITH_CONTENT) {
      for (const r of reportsOf(d, bodiesFor(d)[0])) {
        const html = renderToStaticMarkup(createElement(SimpleReportView, { report: r }));
        const label = `${d.slug} ${r.audience}`;
        const at = (key: ReportPart['key']) => html.indexOf(`id="bolum-${key}"`);
        expect(at('daily'), label).toBeGreaterThan(at('levels'));
        expect(at('daily'), label).toBeLessThan(at('answers'));
        const p = partOf(r, 'daily')!;
        for (const c of partCards(p)) {
          for (const l of c.lines ?? []) expect(html, `${label} ${l.text}`).toContain(esc(l.text));
          expect(html, label).toContain(esc(c.title));
        }
        expect(html.slice(at('daily'), at('answers')), label).toContain('<svg');
      }
    }
  });

  // Her testin her kitle için PDF'i tests/pdf-ust-uste.test.ts'te çizilir ve denetlenir (bölüm de içinde); burada yalnızca
  // paket. (Bütün testler bölümü alınca her şeyi iki kez çizmek testleri çok uzatıyordu.)
  it('PDF: Kendini Tanı Paketi bölümleri içerir', async () => {
    // Paket: 7. sınıfta Beş Faktör ve Şekil Akıl Yürütme pakette; yetişkinde Şekil Akıl Yürütme.
    for (const [grade, audience] of [
      [7, 'student'],
      [7, 'parent'],
      [ADULT_GRADE, 'adult'],
    ] as const) {
      const entries: PackageEntry[] = packageTests(grade).map(({ slot, def }) => {
        const body = def.engine === 'likert' ? likertBody(def.slug, grade, (i) => (i * 3 + 1) % 5) : { ...(Object.values(TASK_VARIANTS[def.slug])[0] as () => AnswersBody)(), grade };
        const reports = evaluateReports(def.slug, { ...body, grade }) as Partial<Record<Audience, SimpleReport>>;
        return { slug: def.slug, skill: slot.skill, areaName: PACKAGE_AREAS.find((a) => a.key === slot.area)!.name, report: reports[audience]! };
      });
      const withDaily = entries.filter((e) => DAILY[e.slug]);
      expect(withDaily.length, `${grade} ${audience}`).toBeGreaterThan(0);
      for (const e of entries) expect(!!partOf(e.report, 'daily'), `${e.slug} ${audience}`).toBe(!!DAILY[e.slug]);
      for (const e of withDaily) checkOrder(e.report, `paket ${e.slug} ${audience}`);
      const pdf = await renderPackageReportPdf({ entries, skipped: [], gradeLabel: String(grade), completedAt: new Date() }, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 240_000);

  // tests/pdf-ust-uste.test.ts her testin bir raporunu dener; burada bölümü olan testler birkaç sonuç örüntüsüyle (düşük,
  // yüksek, orta, mezun; her form ve sınıf) ve bütün kitlelerle.
  it.skipIf(!HAS_PDFTOTEXT)('PDF: bölümün olduğu raporlarda yazılar üst üste binmez (her testte ikinci bir örüntü; okuma ve matematikte her form)', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'gunluk-pdf-'));
    const found: string[] = [];
    let n = 0;
    // Süre sınırlı kalsın diye örneklem: tests/pdf-ust-uste.test.ts her testin ilk örüntüsünü bütün kitlelerle çizer; burada
    // her testin son örüntüsü (yüksek uç, mezun ya da son görev örüntüsü) sırayla tek bir kitleyle, okuma, sesli okuma ve konu
    // taramada ise her form ve sınıf.
    let k = 0;
    for (const d of WITH_CONTENT) {
      const bodies = bodiesFor(d);
      const many = d.engine === 'reading' || d.engine === 'quiz' || d.engine === 'oral';
      const pick = many ? bodies : [bodies[bodies.length - 1]];
      for (const body of pick) {
        const reports = reportsOf(d, body);
        const chosen = many ? reports : [reports[k++ % reports.length]];
        for (const r of chosen) {
          const file = join(dir, `${d.slug}-${r.audience}-${body.grade}-${n++}.pdf`);
          writeFileSync(file, await renderSimpleReportPdf(r, 'olcekhane.com'));
          found.push(...pdfOverlaps(file).slice(0, 3).map((x) => `${d.slug} ${r.audience} (${body.grade}) ${x}`));
        }
      }
    }
    expect(n).toBeGreaterThan(30);
    expect(found).toEqual([]);
  }, 300_000);
});

/* ---------- Özel durumlar ---------- */

/** Anket raporunun içeriği (evaluate'in kurduğu gibi): durumları elle değiştirip bölümü yeniden kurmak için. */
function surveyContent(d: LikertInstrument, answers: Record<string, LikertAnswer>, audience: Audience) {
  const scores = likertRows(scoreLikert(d, answers, {})).map(toReportScore);
  return buildReport({ def: d, scores, audience, studentName: '', grade: audience === 'adult' ? ADULT_GRADE : d.minGrade, completedAt: new Date(), qualityNotes: [], items: likertItemFlags(d, answers) });
}

/** Ölçeğin düzey bölgeleri (kartın düzey çubuğundaki gibi). */
const gaugeOfZones = (sec: Parameters<typeof nearGroups>[0]) => gaugeOf(sec)!.zones;

describe('Günlük hayat: özel durumlar', () => {
  const merak = LIVE.find((d) => d.slug === 'merak') as LikertInstrument;
  const answers = Object.fromEntries(merak.items.map((it, i) => [it.key, { value: [2, 3, 4, 5][i % 4], rtMs: 3000 }]));

  it('puan hesaplanamadıysa örnek yok, grafikte işaret yok, nedeni yazar; ayrışmada ve destek önerisini açan cevapta örnek yok', () => {
    for (const audience of ['student', 'parent', 'adult'] as const) {
      const content = surveyContent(merak, answers, audience);
      const sec = content.sections.find((s) => s.scaleKey === 'knowledge')!;
      const run = (patch: Partial<typeof sec>) => {
        const c = { ...content, sections: content.sections.map((s) => (s === sec ? { ...s, ...patch } : s)) };
        return partCards(surveyDailyPart({ def: merak, content: c, parts: [] })!).find((x) => x.key === 'knowledge')!;
      };
      const none = run({ value: null, band: null });
      expect([none.badge, none.lines, (none.visual as PolesVisual).value, (none.visual as PolesVisual).zone], audience).toEqual(['Hesaplanamadı', undefined, null, null]);
      expect(none.text, audience).toContain('düzey belirlenemedi; bu yüzden örnek seçilmedi');
      expect(none.spoken, audience).toContain('Yer belirlenemedi.');
      checkDrawn(none.visual!, `hesaplanamadı ${audience}`);
      const split = run({ split: true });
      expect(split.lines, audience).toBeUndefined();
      expect(split.text, audience).toMatch(/iki uca ayrıl/);
      // Destek önerisini bu ölçekteki bir cevap açtı: rozet ve iki uç kalır, örnek yok; kart yalnızca destek kutusunu gösterir.
      const flagged = run({ flagged: true });
      expect(flagged.lines, audience).toBeUndefined();
      expect(flagged.badge, audience).toBe(sec.bandLabel);
      expect((flagged.visual as PolesVisual).zone?.label, audience).toBe(sec.bandLabel);
      expect(flagged.text, audience).toBe(
        audience === 'parent'
          ? 'Bu yönde örnek gösterilmedi; çocuğunuzun cevaplarından biri yukarıdaki destek kutusunda ayrıca ele alınıyor.'
          : 'Bu yönde örnek gösterilmedi; cevaplarından biri yukarıdaki destek kutusunda ayrıca ele alınıyor.',
      );
      for (const c of [none, split, flagged]) {
        for (const s of sentences(c.text ?? '')) expect(wordCount(s), s).toBeLessThanOrEqual(22);
        if (audience === 'parent') expect(hasSecondPerson(c.text ?? ''), c.text).toBe(false);
      }
    }
  });

  it('puanın ölçüm payı başka bir düzey grubuna uzanıyorsa kart o düzeyin örneklerinin de uyabileceğini söyler', () => {
    // Beş Faktör: beş düzey üç grupta. Düşük düzeyin payı "belirgin biçimde düşük"e uzanırsa grup aynıdır (cümle yok); ortaya
    // uzanırsa cümle var. İkisine birden uzanırsa "komşu düzeylerin".
    const bes = LIVE.find((d) => d.slug === 'bes-faktor-kisilik') as LikertInstrument;
    for (const audience of ['student', 'parent'] as const) {
      const content = surveyContent(bes, (likertBody(bes.slug, 7, (i) => (i * 3 + 1) % 5).data as { answers: Record<string, LikertAnswer> }).answers, audience);
      const sec = content.sections.find((s) => s.scaleKey === 'extraversion')!;
      const zones = gaugeOfZones(sec);
      const lowZone = zones.find((z) => z.band === 'low')!;
      const run = (ciLow: number, ciHigh: number) => {
        const value = (lowZone.from + lowZone.to) / 2;
        const patched = { ...sec, value, band: 'low' as const, bandLabel: lowZone.label, ciLow, ciHigh };
        const c = { ...content, sections: content.sections.map((s) => (s === sec ? patched : s)) };
        return { card: partCards(surveyDailyPart({ def: bes, content: c, parts: [] })!).find((x) => x.key === 'extraversion')!, near: nearGroups(patched) };
      };
      const inside = run(lowZone.from + 0.01, lowZone.to - 0.01);
      expect([inside.near, inside.card.text], audience).toEqual([[], undefined]);
      const sameGroup = run(lowZone.from - 0.2, lowZone.to - 0.01);
      expect([sameGroup.near, sameGroup.card.text], audience).toEqual([[], undefined]);
      const up = run(lowZone.from + 0.01, lowZone.to + 0.2);
      expect(up.near, audience).toEqual(['average']);
      expect(up.card.text, audience).toBe(
        audience === 'parent' ? 'Çocuğunuzun puanı komşu düzeyin sınırına yakın; o düzeyin örnekleri de uyabilir.' : 'Puanın komşu düzeyin sınırına yakın; o düzeyin örnekleri de uyabilir.',
      );
      expect(up.card.lines?.length, audience).toBe(3);
      const avgZone = zones.find((z) => z.band === 'average')!;
      const both = { ...sec, value: (avgZone.from + avgZone.to) / 2, band: 'average' as const, bandLabel: avgZone.label, ciLow: avgZone.from - 0.2, ciHigh: avgZone.to + 0.2 };
      expect(nearGroups(both), audience).toEqual(['low', 'high']);
    }
  });

  it('mezun (13. sınıf): ilk ortam "Okulda ya da derslerde"; yetişkin raporu kendi ortamlarını kullanır', () => {
    const bes = LIVE.find((d) => d.slug === 'bes-faktor-kisilik') as LikertInstrument;
    const r = evaluate(bes.slug, likertBody(bes.slug, 13, (i) => (i * 3 + 1) % 5));
    for (const rep of [r.student, r.parent]) {
      const p = partOf(rep, 'daily')!;
      expect(p.intro).toContain('örnekler var: okulda ya da derslerde, arkadaşlarla ve evde.');
      for (const c of partCards(p)) if (c.lines) expect(c.lines[0].label).toBe(GRADUATE_SCHOOL_CONTEXT);
    }
    const okuma = LIVE.find((d) => d.slug === 'okuma-hizi-ve-anlama')!;
    const o = evaluate(okuma.slug, readingBody(13));
    for (const c of partCards(partOf(o.student, 'daily')!)) expect(c.lines![0].label).toBe(GRADUATE_SCHOOL_CONTEXT);
    const sekil = LIVE.find((d) => d.slug === 'sekil-akil-yurutme')!;
    const variant = Object.values(TASK_VARIANTS[sekil.slug] as Record<string, () => AnswersBody>)[0]();
    const adult = evaluateAdult(sekil.slug, { ...variant, grade: ADULT_GRADE }).adult;
    for (const c of partCards(partOf(adult, 'daily')!)) expect(c.lines![0].label).toBe(SKILL_CONTEXTS.adult[0]);
  });

  it('düz profil: değer, ilgi ve etkinlik sıralamasında farklar küçükse giriş örneklerin birbirine benzeyebileceğini söyler', () => {
    const FLAT = {
      values: ['Değerler arasındaki farklar küçük olduğu için', 'Çocuğunuzun değerleri arasındaki farklar küçük olduğu için'],
      other: ['Alanlar arasındaki farklar küçük olduğu için', 'Çocuğunuzun alanları arasındaki farklar küçük olduğu için'],
    };
    for (const slug of ['calisma-degerleri', 'mesleki-ilgi-profili', 'hobi-ve-serbest-zaman-ilgileri']) {
      const d = LIVE.find((x) => x.slug === slug) as LikertInstrument;
      const [you, parent] = d.profile === 'values' ? FLAT.values : FLAT.other;
      const run = (answers: Answers) => {
        const body = { grade: d.minGrade, data: { engine: 'likert' as const, answers } };
        const r = evaluate(slug, body);
        return [r.student, r.parent, ...(d.adults ? [evaluateAdult(slug, { ...body, grade: ADULT_GRADE }).adult] : [])];
      };
      // Bütün cevaplar aynı: profil düz. Ölçekler sırayla uçlarda: profil düz değil.
      for (const r of run(all(d, middle(d)))) {
        const intro = partOf(r, 'daily')!.intro;
        expect(intro, `${slug} ${r.audience}`).toContain(r.audience === 'parent' ? parent : you);
        if (r.audience === 'parent') expect(hasSecondPerson(intro), intro).toBe(false);
      }
      for (const r of run(keyed(d, (i) => i % 2 === 0))) expect(partOf(r, 'daily')!.intro, `${slug} ${r.audience}`).not.toContain('arasındaki farklar küçük');
    }
  });

  it('ölçeklerin tonu: özellik ya da gelişim (yayındaki her anket testi)', () => {
    // Gelişim tonundaki ölçekler; listede olmayan her ölçek özellik tonundadır ("hepsi": testin bütün kartları).
    const GROWTH: Record<string, string[] | 'hepsi'> = {
      'cocuk-kisilik-profili': ['emotional_stability'],
      'bes-faktor-kisilik': ['emotional_stability'],
      'hizli-kisilik-testi': ['emotional_stability'],
      'ayrintili-kisilik-profili': ['emotional_stability'],
      'kisiligin-10-yonu': ['emotional_stability'],
      'alti-boyutlu-kisilik-profili': ['emotionality'],
      '16-faktorlu-kisilik-profili': ['emotional_stability', 'anxiety', 'intellect', 'emotionality'],
      iyimserlik: 'hepsi',
      empati: 'hepsi',
      'oz-yeterlik': 'hepsi',
      'oz-denetim': 'hepsi',
      'oz-saygi': 'hepsi',
      'calisma-aliskanliklari': 'hepsi',
      'ders-calisma-motivasyonu': ['amotivation'],
      'ogrenme-ve-basari-ozellikleri': ['competence'],
      'liderlik-egilimleri': ['purpose'],
      'erteleme-ve-zaman-yonetimi': 'hepsi',
      zihniyet: 'hepsi',
      'sinav-kaygisi-ve-bas-etme': 'hepsi',
      'ders-calisirken-telefon-ve-dikkat': 'hepsi',
      'duygusal-zeka-bilesenleri': 'hepsi',
    };
    for (const d of LIVE.filter((x): x is LikertInstrument => x.engine === 'likert')) {
      const want = GROWTH[d.slug] ?? [];
      for (const s of dailyScales(d)) expect(scaleTone(d, s.key), `${d.slug} ${s.key}`).toBe(want === 'hepsi' || want.includes(s.key) ? 'growth' : 'trait');
    }
    for (const slug of Object.keys(GROWTH)) expect(LIVE.map((d) => d.slug), slug).toContain(slug);
  });

  it('motivasyon profili: bileşik ölçeğin parçalarından biri yüksek, öteki düşükse örnek yok; profil yorumu bu farkı anlatır', () => {
    const dcm = LIVE.find((d) => d.slug === 'ders-calisma-motivasyonu') as LikertInstrument;
    // Parça başına cevaplar (her parçanın beş maddesine sırayla); verilmeyen ölçek 3, null verilen ölçek boş.
    const answersOf = (per: Record<string, readonly number[] | null>) =>
      Object.fromEntries(
        dcm.items.flatMap((it) => {
          const vs = per[it.scale] === undefined ? [3, 3, 3, 3, 3] : per[it.scale];
          if (vs === null) return [];
          const i = dcm.items.filter((x) => x.scale === it.scale).indexOf(it);
          return [[it.key, { value: vs[i], rtMs: 3000 }]];
        }),
      );
    const SPLIT = 'Bu türün iki parçasının düzeyi birbirinden çok farklı olduğu için düzeye göre örnek seçilmedi.';
    const cases = [
      // (a) Merak ve keyif yüksek (3,6), önemini görme düşük (1,2): bileşik düşük (2,4); profilde `hidden` cümlesi.
      { per: { intrinsic: [4, 4, 3, 4, 3], identified: [1, 1, 1, 1, 2] }, key: 'autonomous', groups: ['high', 'low'], says: 'merak ve keyif tek başına yüksek' },
      // (b) Merak ve keyif düşük (2), önemini görme yüksek (5): bileşik yüksek (3,5); profilde `lean` cümlesi.
      { per: { intrinsic: [2, 2, 2, 2, 2], identified: [5, 5, 5, 5, 5] }, key: 'autonomous', groups: ['low', 'high'], says: 'önemini görme, merak ve keyiften daha güçlü' },
      // Baskıyla çalışma: iç baskı yüksek, dış baskı ve ödül düşük: bileşik orta; profilde `hidden` cümlesi.
      { per: { introjected: [5, 5, 5, 5, 5], external: [1, 1, 1, 1, 1] }, key: 'controlled', groups: ['high', 'low'], says: 'iç baskı tek başına yüksek' },
      // Öbür bileşik ölçek hesaplanamadı (cevapsız): profil yok; kart parçaların ayrı sonuçlarına yönlendirir.
      { per: { intrinsic: [4, 4, 3, 4, 3], identified: [1, 1, 1, 1, 2], introjected: null, external: null }, key: 'autonomous', groups: ['high', 'low'], says: null },
    ] as const;
    for (const audience of ['student', 'parent'] as const) {
      for (const c of cases) {
        const content = surveyContent(dcm, answersOf(c.per), audience);
        const at = `${audience} ${JSON.stringify(c.per)}`;
        const scale = dcm.scales.find((s) => s.key === c.key)!;
        expect(scale.of!.map((k) => bandGroup(content.sections.find((s) => s.scaleKey === k)!.band)), at).toEqual(c.groups);
        const card = partCards(surveyDailyPart({ def: dcm, content, parts: [] })!).find((x) => x.key === c.key)!;
        expect(card.lines, at).toBeUndefined();
        // Rozet ve iki uç kalır.
        expect(card.badge, at).toBe(content.sections.find((s) => s.scaleKey === c.key)!.bandLabel);
        expect((card.visual as PolesVisual).type, at).toBe('poles');
        if (c.says) {
          expect(card.text, at).toBe(`${SPLIT} Motivasyon profilindeki açıklama bu farkı anlatıyor.`);
          // build.ts profil yorumuna baskın parçayı anlatan cümleyi ekledi: kartın sözü doğru.
          expect(content.motivation!.pattern, at).not.toBeNull();
          expect(content.motivation!.text.split('\n\n').slice(1).join(' '), at).toContain(c.says);
        } else {
          expect(card.text, at).toBe(`${SPLIT} Raporda iki parçanın sonucu ayrı ayrı gösteriliyor.`);
          expect(content.motivation!.pattern, at).toBeNull();
        }
        for (const s of sentences(card.text!)) expect(wordCount(s), s).toBeLessThanOrEqual(22);
        if (audience === 'parent') expect(hasSecondPerson(card.text!), card.text).toBe(false);
        // Öbür bileşik ölçeğin kartı (parçaları ayrışmadıysa) örneklerini gösterir.
        const other = partCards(surveyDailyPart({ def: dcm, content, parts: [] })!).find((x) => x.key === (c.key === 'autonomous' ? 'controlled' : 'autonomous'))!;
        if (other.badge !== 'Hesaplanamadı') expect(other.lines?.length, at).toBe(3);
      }
    }
  });

  it('metni olmayan testte bölüm yok; sesli okumanın veli raporu öğrenciden söz eder', () => {
    // Yayındaki her testin metni var: dalı denemek için bir anket ve bir görev testinin metni geçici olarak kayıttan
    // çıkarılır (yeni yayına giren testin metni de böyle bir an için eksik kalabilir).
    for (const slug of ['oz-saygi', 'simge-bulma']) {
      const d = LIVE.find((x) => x.slug === slug)!;
      const saved = DAILY[slug];
      expect(saved, slug).toBeDefined();
      delete DAILY[slug];
      try {
        const reports = reportsOf(d, bodiesFor(d)[0]);
        expect(reports.length, slug).toBeGreaterThanOrEqual(2);
        for (const r of reports) {
          expect(partOf(r, 'daily'), `${slug} ${r.audience}`).toBeUndefined();
          // Öteki ek bölümler yerinde.
          expect(partOf(r, 'levels'), `${slug} ${r.audience}`).toBeDefined();
        }
      } finally {
        DAILY[slug] = saved;
      }
      expect(partOf(reportsOf(d, bodiesFor(d)[0])[0], 'daily'), slug).toBeDefined();
    }
    const oral = LIVE.find((d) => d.engine === 'oral')!;
    const fake: SkillsDaily = {
      kind: 'skills',
      version: 'deneme-gunluk-1',
      skills: [
        {
          key: 'oral',
          covers: ['accuracy', 'rate', 'prosody'],
          title: 'Sesli okuma',
          short: 'Sesli okuma',
          text: 'Sesli okuma, bir metni doğru ve akıcı okumayı gerektiren işlerde kullanılır.',
          branches: { school: 'Sınıfta okumak', friends: 'Oyun yönergesi', home: 'Masal okumak' },
          student: { school: 'a.', friends: 'b.', home: 'c.' },
          parent: { school: 'd.', friends: 'e.', home: 'f.' },
        },
        {
          key: 'comprehension',
          covers: ['comprehension', 'retell'],
          title: 'Okuduğunu anlama',
          short: 'Anlama',
          text: 'Anlama.',
          branches: { school: 'A b', friends: 'C d', home: 'E f' },
          student: { school: 'a.', friends: 'b.', home: 'c.' },
          parent: { school: 'd.', friends: 'e.', home: 'f.' },
        },
      ],
    };
    const p = skillsDailyPart({ def: oral, audience: 'parent', grade: 3, daily: fake })!;
    expect(p.intro).toContain('Örnekler öğrencinin sonucuna göre seçilmedi');
    expect(p.intro).not.toMatch(/çocuğunuz/i);
    expect(partCards(p).map((c) => c.title)).toEqual(['Sesli okuma', 'Okuduğunu anlama']);
  });
});

/* ---------- Grafikler ---------- */

describe('Günlük hayat: grafikler', () => {
  it('iki uç: uzun adlar, uç değerler ve hesaplanamayan puan taşmaz; yazılar üst üste binmez', () => {
    const long = 'Kendini ve duygularını saklar'.slice(0, POLE_MAX_CHARS);
    const base: PolesVisual = { type: 'poles', label: 'Deneme', low: long, high: 'Başkalarına zaman ayırır', min: 1, max: 5, value: 3, zone: { from: 2.6, to: 3.4, label: 'Orta' }, marker: 'Çocuğunuzun yeri' };
    for (const value of [1, 1.4, 3, 4.6, 5]) {
      const zone = value < 2.6 ? { from: 1, to: 2.6, label: 'Düşük' } : value < 3.4 ? { from: 2.6, to: 3.4, label: 'Orta' } : { from: 3.4, to: 5, label: 'Yüksek' };
      for (const v of [
        { ...base, value, zone },
        { ...base, low: 'Önce dinler', high: 'Uzun soluklu bir konunun derinine'.slice(0, POLE_MAX_CHARS), value, zone },
        { ...base, low: 'Somut konuları tercih eder', high: 'Planlı ve düzenli ilerler', value, zone },
      ]) {
        checkDrawn(v, `iki uç ${v.low} ${value}`);
        checkSizes(v, `iki uç ${v.low} ${value}`);
      }
    }
    checkDrawn({ ...base, value: null, zone: null }, 'iki uç hesaplanamadı');
    checkSizes({ ...base, value: null, zone: null }, 'iki uç hesaplanamadı');
    checkDrawn({ ...base, min: 10, max: 50, value: 10, zone: { from: 10, to: 25, label: 'Düşük' } }, 'toplam puan');
  });

  it('kullanıldığı yerler: en uzun ortam adları ve dallar, iki satırlık kısa ad taşmaz', () => {
    const branch = 'Uzun bir listede bir ad bulmak'.slice(0, BRANCH_MAX_CHARS);
    const longWord = 'Karşılaştırmalar'.slice(0, CENTER_WORD_MAX_CHARS);
    for (const contexts of [SKILL_CONTEXTS.you, SKILL_CONTEXTS.adult, [GRADUATE_SCHOOL_CONTEXT, ...SKILL_CONTEXTS.you.slice(1)]]) {
      for (const center of ['Veri', 'Okuduğunu anlama', 'Ortalama, olasılık', longWord, `${longWord} ${longWord}`.slice(0, CENTER_MAX_CHARS)]) {
        const v: ContextsVisual = { type: 'contexts', label: 'Deneme', center, branches: contexts.map((context) => ({ context, label: branch })) };
        const short: ContextsVisual = { ...v, branches: contexts.map((context) => ({ context, label: 'Kısa iş' })) };
        for (const [x, at] of [
          [v, `dallar ${center} ${contexts[0]}`],
          [short, `kısa dallar ${center}`],
        ] as const) {
          checkDrawn(x, at);
          checkSizes(x, at);
        }
      }
    }
  });
});
