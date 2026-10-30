import type { TestPayload } from '@/components/test/test-session';
import { PROSODY_DIMENSIONS } from '@/content/reports/sesli-okuma';
import { likertItemNoun } from '@/lib/instruments/nouns';
import type { InstrumentDef } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import { oralPassagesFor } from '@/lib/scoring/oral';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';

/**
 * Testi çözmek için tarayıcıya gönderilenler (test sayfası ve Kendini Tanı Paketi). Cevap anahtarı ve puanlama gönderilmez.
 * `sessionNote`: yönergenin sonuna "testi tek seferde bitir" notu eklenir (pakette paketin kendi notu vardır).
 */

/** Cevaplar yalnızca sayfada tutulur: sayfa kapanırsa kaybolur. */
const SESSION_NOTE = 'Testi tek seferde bitir: sayfayı kapatır ya da yenilersen cevapların silinir ve baştan başlaman gerekir.';

/** Tarayıcıya yalnızca testi çözmek için gerekenler gider: cevap anahtarı, açıklama ve puanlama yoktur. */
export function payloadFor(def: InstrumentDef, grade: number, { sessionNote = true }: { sessionNote?: boolean } = {}): TestPayload {
  const intro = sessionNote ? { ...def.intro, paragraphs: [...def.intro.paragraphs, SESSION_NOTE] } : def.intro;
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
      // hamle sayısı ekranda zaten gösterilir, çözüm sunucuda hamleler yeniden oynatılarak denetlenir. Üç boyutlu zihinde
      // döndürmede cevap anahtarı gönderilmez. Şekillerin çizim verisi (küplerin konumları ve duruş matrisi) gönderilir;
      // doğru seçenekler hedefle aynı küp listesini taşımaz ve küpler karışık sırayla gider. Çizilen her şekilde olduğu
      // gibi, bu veriden bir seçeneğin ayna görüntüsü olup olmadığı hesaplanabilir; test bir sınav olmadığı için kabul edilir.
      // Hesapla ve hatırlada gizlenecek bir anahtar yoktur: harfler ve işlemler zaten ekranda gösterilir.
      // Zihinden hesaplamada da gizlenecek bir anahtar yoktur: işlemler ekranda gösterilir; puanlama sunucuda yapılır.
      // Desen hatırlamada da gizlenecek bir anahtar yoktur: desenler ekranda gösterilir; puanlama sunucuda yapılır.
      // Bakış açısı almada da gizlenecek bir anahtar yoktur: haritayı çizmek için nesnelerin konumları gönderilir ve doğru
      // yönler bunlardan hesaplanabilir (test bir sınav değildir); puanlama sunucuda yapılır.
      return {
        engine: 'tasks',
        intro,
        tasks: def.tasks.map((t) =>
          t.kind === 'matrix_reasoning'
            ? { ...t, answers: [], optionDistance: [] }
            : t.kind === 'number_series' || t.kind === 'letter_series'
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
                        : t.kind === 'cube_net' || t.kind === 'hidden_figures'
                          ? { ...t, answers: [], optionLures: [], levels: [] }
                          : t.kind === 'figural_analogy'
                            ? { ...t, answers: [], optionLures: [], optionMisses: [], levels: [] }
                            : t.kind === 'cognitive_reflection'
                            ? { ...t, answers: [], domains: [], roles: [], lures: [], pairs: [] }
                            : t.kind === 'mental_rotation_3d'
                              ? { ...t, answers: [] }
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
