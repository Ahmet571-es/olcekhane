import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LogoMark } from '@/components/site/logo';
import { PageGuide } from '@/components/site/page-guide';
import { TestSession, type TestPayload } from '@/components/test/test-session';
import { PROSODY_DIMENSIONS } from '@/content/reports/sesli-okuma';
import { ROADMAP_IN_REVIEW, ROADMAP_PREVIEW_PARAM, hasRoadmap } from '@/content/roadmaps';
import { solvableInstrument } from '@/lib/assessment/evaluate';
import { ADULT_GRADE, ADULT_PARAM, GRADE_LABELS, gradeAllowed, gradeRangeLabel, parseGradeParam } from '@/lib/config';
import { likertItemNoun } from '@/lib/instruments/nouns';
import type { InstrumentDef } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import { oralPassagesFor } from '@/lib/scoring/oral';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';

export async function generateMetadata(props: PageProps<'/testler/[slug]/coz'>): Promise<Metadata> {
  const { slug } = await props.params;
  const def = solvableInstrument(slug);
  return { title: def ? `${def.name}: testi çöz` : 'Testi çöz' };
}

/**
 * Sesli okumada öğrencinin tek başına okuduğu, okumayı cihazdaki yapay zekânın incelediği akışın önizlemesi
 * (`?onizleme=otomatik`). Bağlantı olmadan herkes yetişkinin kaydı dinlediği sürümü görür.
 */
const ORAL_AUTO_PREVIEW_PARAM = 'otomatik';

/** Cevaplar yalnızca sayfada tutulur: sayfa kapanırsa kaybolur. */
const SESSION_NOTE = 'Testi tek seferde bitir: sayfayı kapatır ya da yenilersen cevapların silinir ve baştan başlaman gerekir.';

/** Tarayıcıya yalnızca testi çözmek için gerekenler gider: cevap anahtarı, açıklama ve puanlama yoktur. */
function payloadFor(def: InstrumentDef, grade: number): TestPayload {
  const intro = { ...def.intro, paragraphs: [...def.intro.paragraphs, SESSION_NOTE] };
  switch (def.engine) {
    case 'likert':
      return {
        engine: 'likert',
        intro,
        prompt: def.prompt,
        options: def.options,
        items: def.items.map((i) => ({ key: i.key, text: i.text })),
        itemNoun: likertItemNoun(def),
        minAnswered: Math.ceil(def.items.length * def.scoring.minAnsweredRatio),
      };
    case 'quiz': {
      const form = formForGrade(def, grade);
      return {
        engine: 'quiz',
        intro,
        contentGrade: form.contentGrade,
        items: form.items.map((it) => ({
          key: it.key,
          text: it.text,
          table: it.table,
          chart: it.chart,
          figure: it.figure,
          options: it.options.map((o) => ({ key: o.key, text: o.text })),
        })),
      };
    }
    case 'reading': {
      const p = passageForGrade(def, grade);
      return {
        engine: 'reading',
        intro,
        passage: { key: p.key, title: p.title, paragraphs: p.paragraphs, questions: p.questions.map((q) => ({ key: q.key, text: q.text, options: q.options })) },
      };
    }
    case 'tasks':
      // Şekil akıl yürütmenin, sayı dizilerinin ve sözel akıl yürütmenin cevap anahtarı (seçeneklerin doğru cevaba
      // uzaklığı, tuzak cevaplar, çeldiriciler) tarayıcıya gönderilmez. Sözel akıl yürütmede düzeylerin anlatımı da
      // gönderilmez: bazı soruların ipucunu verir (ör. "durduranlar") ve çözme ekranında kullanılmaz. Kâğıt katlamada da
      // çeldiriciler, yanılgı türleri ve düzey anlatımları gönderilmez. Kelime listesinde tanıma bölümünün anahtarı,
      // mantıksal akıl yürütmede de sorunun türü (cevabı ele verir) gönderilmez. Sayısal akıl yürütmede cevap anahtarı, soru
      // türleri ve yanılgı cevapları gönderilmez. Küp açınımında cevap anahtarı, seçeneklerin yanılgı türleri ve düzey
      // anlatımları gönderilmez. Düşünerek karar vermede cevap anahtarı, soruların türü (sayısal ya da sözel, tuzaklı ya da
      // tuzaksız), tuzak seçenekleri ve eşler gönderilmez. Kule görevinde gizlenecek bir anahtar yoktur: problemlerin en az
      // hamle sayısı ekranda zaten gösterilir, çözüm sunucuda hamleler yeniden oynatılarak denetlenir.
      return {
        engine: 'tasks',
        intro,
        tasks: def.tasks.map((t) =>
          t.kind === 'matrix_reasoning'
            ? { ...t, answers: [], optionDistance: [] }
            : t.kind === 'number_series'
              ? { ...t, answers: [], traps: [] }
              : t.kind === 'verbal_reasoning'
                ? { ...t, answers: [], lures: [], levels: [] }
                : t.kind === 'paper_folding' || t.kind === 'vocabulary'
                  ? { ...t, answers: [], lures: [], lureKinds: [], levels: [] }
                  : t.kind === 'word_list'
                    ? { ...t, recognitionKey: [] }
                    : t.kind === 'logical_reasoning'
                      ? { ...t, answers: [], forms: [] }
                      : t.kind === 'numerical_reasoning'
                        ? { ...t, answers: [], kinds: [], ratios: [], lures: [] }
                        : t.kind === 'cube_net'
                          ? { ...t, answers: [], optionLures: [], levels: [] }
                          : t.kind === 'cognitive_reflection'
                            ? { ...t, answers: [], domains: [], roles: [], lures: [], pairs: [] }
                            : t,
        ),
      };
    case 'oral':
      return {
        engine: 'oral',
        intro: def.intro,
        passages: oralPassagesFor(def, grade).map((p) => ({
          key: p.key,
          grade: p.grade,
          genre: p.genre,
          title: p.title,
          paragraphs: p.paragraphs,
          words: oralWordCount(p.paragraphs),
          questions: p.questions.map((q) => ({ key: q.key, text: q.text, options: q.options })),
          ideas: p.ideas,
        })),
        prosody: PROSODY_DIMENSIONS.map((d) => ({ key: d.key, name: d.name, question: d.question, levels: d.levels.map((l) => l.parent) })),
      };
  }
}

export default async function SolvePage(props: PageProps<'/testler/[slug]/coz'>) {
  const { slug } = await props.params;
  const q = await props.searchParams;
  const def = solvableInstrument(slug);
  if (!def) notFound();
  // Sınıf düzeyi ya da (yetişkinlere de uygun testlerde) "Yetişkinim" seçimi.
  const grade = parseGradeParam(typeof q.sinif === 'string' ? q.sinif : undefined);
  const ready = grade !== null && gradeAllowed(def, grade);
  // Yaş grubu sayfasında seçilen sınıf (`?secili=`) seçim kutusunda hazır gelir; test yine "Teste başla" ile başlar.
  const preset = parseGradeParam(typeof q.secili === 'string' ? q.secili : undefined);
  const presetValue = preset !== null && gradeAllowed(def, preset) ? (preset === ADULT_GRADE ? ADULT_PARAM : String(preset)) : '';
  const adultRefused = grade === ADULT_GRADE && !def.adults;
  const grades = Array.from({ length: def.maxGrade - def.minGrade + 1 }, (_, i) => def.minGrade + i);
  const backUrl = `/testler/${def.slug}`;
  // İncelemedeki gelişim yol haritası yalnızca önizleme bağlantısıyla eklenir; seçim sınıf formunda da korunur.
  const roadmapPreview = q.onizleme === ROADMAP_PREVIEW_PARAM && hasRoadmap(def.slug) && ROADMAP_IN_REVIEW.has(def.slug);
  const oralAuto = def.engine === 'oral' && q.onizleme === ORAL_AUTO_PREVIEW_PARAM;
  const preview = roadmapPreview ? ROADMAP_PREVIEW_PARAM : oralAuto ? ORAL_AUTO_PREVIEW_PARAM : null;

  return (
    <>
      <header className="border-b border-rule bg-surface">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark size={28} />
            <span className="truncate font-bold">{def.name}</span>
          </div>
          {/* Tam sayfa geçişi: test sürerken ayrılmak cevapları sildiği için tarayıcı uyarısı çıksın. */}
          <a href={backUrl} className="btn btn-quiet min-h-10">
            Vazgeç
          </a>
        </div>
      </header>
      <main id="icerik" className="container-page flex flex-1 flex-col py-8 md:py-12">
        {ready ? (
          <TestSession
            slug={def.slug}
            grade={grade}
            gradeLabel={GRADE_LABELS[grade] ?? `${grade}. sınıf`}
            payload={payloadFor(def, grade)}
            roadmapPreview={roadmapPreview}
            oralAuto={oralAuto}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
            <div className="flex flex-col gap-3">
              <p className="t-meta">
                {def.isFree ? 'Ücretsiz · ' : ''}yaklaşık {def.estimatedMinutes} dakika · {gradeRangeLabel(def.minGrade, def.maxGrade, def.adults)}
              </p>
              <h1 className="t-h1">{def.name}</h1>
              <p className="t-lede">
                {oralAuto ? 'Bir metni sesli oku; okumanı bu cihazdaki yapay zekâ incelesin. Sonra soruları cevapla ve raporunu gör.' : def.tagline}
              </p>
            </div>

            {oralAuto ? (
              <PageGuide plain title="Nasıl ilerler?">
                <p>Okumayı öğrenci tek başına yapar; kaydı kimse dinlemez:</p>
                <ol className="flex list-decimal flex-col gap-1 pl-5 text-ink-2">
                  <li>Sınıfını seç ve “Teste başla” düğmesine bas; sonra metni seç ve mikrofonu dene.</li>
                  <li>Metni sesli oku. İstersen okumanı bu cihazdaki yapay zekâ inceler; sen bu sırada soruları cevaplarsın.</li>
                  <li>İnceleme bitince ses kaydın silinir ve raporun ekranda açılır. Yapay zekâ ilk seferde yaklaşık 250 MB indirir.</li>
                </ol>
              </PageGuide>
            ) : def.engine === 'oral' ? (
              <PageGuide plain title="Nasıl ilerler?">
                <p>Değerlendirmeyi öğrenci ve bir yetişkin (öğretmen ya da veli) birlikte yapar:</p>
                <ol className="flex list-decimal flex-col gap-1 pl-5 text-ink-2">
                  <li>Öğrencinin sınıfını seçin ve “Teste başla” düğmesine basın; sonra metni seçip mikrofonu deneyin.</li>
                  <li>Öğrenci metni sesli okur, kendi cümleleriyle anlatır ve soruları cevaplar.</li>
                  <li>Siz kaydı dinleyerek hataları işaretler, anlatmayı ve akıcılığı değerlendirirsiniz; rapor ekranda açılır. Yaklaşık {def.estimatedMinutes} dakika sürer.</li>
                </ol>
              </PageGuide>
            ) : (
              <PageGuide plain title="Nasıl ilerler?">
                <p>Test üç adımda biter:</p>
                <ol className="flex list-decimal flex-col gap-1 pl-5 text-ink-2">
                  <li>{def.adults ? 'Testi kimin çözdüğünü seç' : 'Sınıfını seç'} ve “Teste başla” düğmesine bas.</li>
                  <li>Yönergeyi oku ve testi tek seferde bitir; yaklaşık {def.estimatedMinutes} dakika sürer.</li>
                  <li>Bitince raporun ekranda açılır. Saklamak için PDF olarak indir.</li>
                </ol>
              </PageGuide>
            )}

            <div className="notice notice-ok flex flex-col gap-2">
              <p className="font-bold">Hiçbir bilgin saklanmaz.</p>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                <li>Hesap açman gerekmez; ad, e-posta ya da telefon istemiyoruz.</li>
                <li>Cevapların yalnızca raporu hazırlamak için kullanılır, hiçbir yere kaydedilmez.</li>
                <li>Rapor ekranda gösterilir ve PDF olarak sana verilir. Sayfayı kapatınca cevapların ve rapor kaybolur; saklamak istersen PDF’i indir.</li>
                {def.engine === 'oral' &&
                  (oralAuto ? (
                    <li>Ses kaydı yalnızca bu cihazda durur ve bu cihazda incelenir; sunucumuza ya da başka bir yere gönderilmez, inceleme bitince silinir.</li>
                  ) : (
                    <li>Ses kaydı yalnızca bu cihazda, açık olan sayfada durur; sunucumuza ya da başka bir yere gönderilmez ve sayfa kapanınca silinir.</li>
                  ))}
              </ul>
              <p className="t-small">
                Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
              </p>
            </div>

            {roadmapPreview && (
              <p className="notice notice-info">
                <strong>Önizleme:</strong> Raporun sonunda uzman incelemesindeki gelişim yol haritası da gösterilecek.
              </p>
            )}
            {oralAuto && (
              <p className="notice notice-info">
                <strong>Önizleme:</strong> Okumayı yetişkin yerine bu cihazdaki yapay zekâ inceler. Bu sürüm deneme aşamasındadır.
              </p>
            )}

            {adultRefused && (
              <p className="notice notice-warn">
                Bu test yetişkinler için hazırlanmadı. Testi bir öğrenci çözecekse aşağıdan sınıfını seçin.
              </p>
            )}

            <form method="get" className="panel flex flex-col gap-5 p-6">
              {preview && <input type="hidden" name="onizleme" value={preview} />}
              <div className="field">
                <label htmlFor="sinif" className="field-label">
                  {def.adults ? 'Testi kim çözüyor?' : 'Testi çözen öğrencinin sınıfı'}
                </label>
                <select id="sinif" name="sinif" className="input" defaultValue={presetValue} required aria-describedby="sinif-ipucu">
                  <option value="" disabled>
                    {def.adults ? 'Seç' : 'Sınıf seçin'}
                  </option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {GRADE_LABELS[g] ?? `${g}. sınıf`}
                    </option>
                  ))}
                  {def.adults && <option value={ADULT_PARAM}>Yetişkinim (18 yaş ve üzeri)</option>}
                </select>
                <p id="sinif-ipucu" className="field-hint">
                  {def.adults
                    ? 'Okula gidiyorsan ya da mezun olup üniversiteye hazırlanıyorsan sınıfını seç: sana ve veline ayrı ayrı yazılmış iki rapor hazırlanır. 18 yaşını doldurduysan ve testi kendin için çözüyorsan “Yetişkinim”i seç: sana yazılmış tek bir rapor hazırlanır, veli raporu olmaz.'
                    : 'Sorular ve rapor sınıf düzeyine göre hazırlanır.'}
                </p>
              </div>
              <div>
                <button type="submit" className="btn btn-primary btn-lg">
                  Teste başla
                </button>
              </div>
            </form>

            <p className="t-small text-ink-2">
              Test bir çocuk içinse bir yetişkinin yanında çözmesini öneririz. Bu test bir tanı koymaz; sonuçları nasıl yorumlayacağınız raporda
              yazıyor. <Link href={`${backUrl}#bilim-karti`}>Testin bilimsel dayanağı</Link>
            </p>
          </div>
        )}
      </main>
    </>
  );
}
