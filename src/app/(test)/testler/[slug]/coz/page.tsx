import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LogoMark } from '@/components/site/logo';
import { TestSession, type TestPayload } from '@/components/test/test-session';
import { solvableInstrument } from '@/lib/assessment/evaluate';
import { GRADE_LABELS, gradeRangeLabel } from '@/lib/config';
import type { InstrumentDef } from '@/lib/instruments/types';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';

export async function generateMetadata(props: PageProps<'/testler/[slug]/coz'>): Promise<Metadata> {
  const { slug } = await props.params;
  const def = solvableInstrument(slug);
  return { title: def ? `${def.name}: testi çöz` : 'Testi çöz' };
}

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
      return { engine: 'tasks', intro, tasks: def.tasks };
  }
}

export default async function SolvePage(props: PageProps<'/testler/[slug]/coz'>) {
  const { slug } = await props.params;
  const q = await props.searchParams;
  const def = solvableInstrument(slug);
  if (!def) notFound();
  const grade = Number(typeof q.sinif === 'string' ? q.sinif : NaN);
  const ready = Number.isInteger(grade) && grade >= def.minGrade && grade <= def.maxGrade;
  const grades = Array.from({ length: def.maxGrade - def.minGrade + 1 }, (_, i) => def.minGrade + i);
  const backUrl = `/testler/${def.slug}`;

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
          <TestSession slug={def.slug} grade={grade} gradeLabel={GRADE_LABELS[grade] ?? `${grade}. sınıf`} payload={payloadFor(def, grade)} />
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
            <div className="flex flex-col gap-3">
              <p className="t-meta">
                {def.isFree ? 'Ücretsiz · ' : ''}yaklaşık {def.estimatedMinutes} dakika · {gradeRangeLabel(def.minGrade, def.maxGrade)}
              </p>
              <h1 className="t-h1">{def.name}</h1>
              <p className="t-lede">{def.tagline}</p>
            </div>

            <div className="notice notice-ok flex flex-col gap-2">
              <p className="font-bold">Hiçbir bilgin saklanmaz.</p>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                <li>Hesap açman gerekmez; ad, e-posta ya da telefon istemiyoruz.</li>
                <li>Cevapların yalnızca raporu hazırlamak için kullanılır, hiçbir yere kaydedilmez.</li>
                <li>Rapor ekranda gösterilir ve PDF olarak sana verilir. Sayfayı kapatınca cevapların ve rapor kaybolur; saklamak istersen PDF’i indir.</li>
              </ul>
              <p className="t-small">
                Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
              </p>
            </div>

            <form method="get" className="panel flex flex-col gap-5 p-6">
              <div className="field">
                <label htmlFor="sinif" className="field-label">
                  Testi çözen öğrencinin sınıfı
                </label>
                <select id="sinif" name="sinif" className="input" defaultValue="" required>
                  <option value="" disabled>
                    Sınıf seçin
                  </option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {GRADE_LABELS[g] ?? `${g}. sınıf`}
                    </option>
                  ))}
                </select>
                <p className="field-hint">Sorular ve rapor sınıf düzeyine göre hazırlanır.</p>
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
