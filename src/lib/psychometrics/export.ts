import 'server-only';
import { randomInt } from 'node:crypto';
import { plainMath } from '@/components/quiz/math-text';
import type { LikertInstrument, QuizInstrument, ReadingInstrument } from '@/lib/instruments/types';
import { toCsv, type CsvOptions } from '@/lib/csv';
import { currentVersionDef, researchSample, responsesFor, scoresFor } from './data';

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const monthFmt = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: 'Europe/Istanbul' });

/**
 * Araştırma verisi: yalnızca ölçme ve araştırma rızası geçerli öğrencilerin ilk uygulamaları. Kimlik
 * yoktur; satırlar rastgele sıralanır ve her dosyada yeniden verilen katılımcı kodlarıyla adlandırılır.
 * Tarih yalnızca ay düzeyinde verilir.
 */
export async function researchCsv(slug: string, opts: CsvOptions = {}): Promise<{ csv: string; n: number } | null> {
  const cv = await currentVersionDef(slug);
  if (!cv) return null;
  const def = cv.def;
  const sample = shuffle(await researchSample(cv.versionId));
  const ids = sample.map((s) => s.attemptId);
  const [resp, sc] = await Promise.all([responsesFor(ids), scoresFor(ids)]);

  const base = ['katilimci', 'sinif', 'cinsiyet', 'ay', 'gecerlik_uyarisi'];
  let itemCols: string[] = [];
  let itemValue: (r: Record<string, { value: number | null; text: string | null }>, key: string) => unknown = () => '';
  if (def.engine === 'likert') {
    itemCols = (def as LikertInstrument).items.map((i) => i.key);
    itemValue = (r, k) => r[k]?.value ?? '';
  } else if (def.engine === 'quiz') {
    itemCols = (def as QuizInstrument).forms.flatMap((f) => f.items.map((i) => i.key));
    itemValue = (r, k) => r[k]?.text ?? '';
  } else if (def.engine === 'reading') {
    itemCols = (def as ReadingInstrument).passages.flatMap((p) => p.questions.map((q) => `${p.key}.${q.key}`));
    itemValue = (r, k) => r[k]?.text ?? '';
  }
  const scaleKeys = [...new Set([...def.scales.map((s) => s.key), ...(def.engine === 'quiz' ? ['total'] : [])])];
  const isMeanScale = def.engine === 'likert' && (def as LikertInstrument).scoring.method === 'mean';
  const scaleCols = scaleKeys.map((k) => `puan_${k}`);

  const rows = sample.map((s, i) => {
    const r = resp.get(s.attemptId) ?? {};
    const scRow = sc.get(s.attemptId) ?? {};
    return [
      `P${String(i + 1).padStart(4, '0')}`,
      s.grade,
      s.gender === 'female' ? 'K' : s.gender === 'male' ? 'E' : '',
      // Excel “2026-09” gibi değerleri tarihe çevirdiği için Excel biçiminde ay 202609 olarak yazılır.
      opts.excel ? Number(monthFmt.format(s.completedAt).slice(0, 7).replace('-', '')) : monthFmt.format(s.completedAt).slice(0, 7),
      s.flagged ? 1 : 0,
      ...itemCols.map((k) => itemValue(r, k)),
      ...scaleKeys.map((k) => {
        const x = scRow[k];
        if (!x) return '';
        if (def.engine === 'likert') return isMeanScale ? x.mean : x.raw;
        return x.raw;
      }),
    ];
  });
  return { csv: toCsv([...base, ...itemCols, ...scaleCols], rows, opts), n: rows.length };
}

/** Değişken sözlüğü: sütunların anlamı, maddelerin metni, ters maddeler ve cevap anahtarları. */
export async function codebookCsv(slug: string, opts: CsvOptions = {}): Promise<string | null> {
  const cv = await currentVersionDef(slug);
  if (!cv) return null;
  const def = cv.def;
  const rows: unknown[][] = [
    ['katilimci', 'bilgi', '', 'Bu dosyaya özgü rastgele katılımcı kodu (başka dosyalarla eşleştirilemez)', '', '', ''],
    ['sinif', 'bilgi', '', 'Uygulamaya başlandığı sınıf düzeyi (13: mezun)', '', '', ''],
    ['cinsiyet', 'bilgi', '', 'K: kız, E: erkek, boş: belirtilmemiş', '', '', ''],
    ['ay', 'bilgi', '', opts.excel ? 'Uygulamanın tamamlandığı ay (YYYYAA, ör. 202609)' : 'Uygulamanın tamamlandığı ay (YYYY-AA)', '', '', ''],
    ['gecerlik_uyarisi', 'bilgi', '', '1: çok hızlı cevaplama ya da hep aynı seçeneği işaretleme uyarısı var (analizlere alınmaz)', '', '', ''],
  ];
  const scaleName = new Map(def.scales.map((s) => [s.key, s.name]));
  if (def.engine === 'likert') {
    const l = def as LikertInstrument;
    const opts = l.options.map((o) => `${o.value}: ${o.label}`).join(' | ');
    for (const it of l.items) rows.push([it.key, 'madde', scaleName.get(it.scale) ?? it.scale, it.text, it.reverse ? 'evet' : 'hayır', '', opts]);
    for (const s of l.scales) {
      rows.push([`puan_${s.key}`, 'ölçek puanı', s.name, l.scoring.method === 'mean' ? 'Madde ortalaması (ters maddeler çevrilmiş)' : 'Toplam puan (ters maddeler çevrilmiş)', '', '', '']);
    }
  } else if (def.engine === 'quiz') {
    const q = def as QuizInstrument;
    for (const f of q.forms) {
      const dn = new Map(f.domains.map((d) => [d.key, d.name]));
      for (const it of f.items) {
        rows.push([
          it.key,
          `madde (${f.grade}. sınıf formu)`,
          dn.get(it.domain) ?? it.domain,
          plainMath(it.text),
          '',
          it.answer,
          [...it.options.map((o) => `${o.key}: ${plainMath(o.text)}`), 'X: Bilmiyorum'].join(' | '),
        ]);
      }
    }
    rows.push(['puan_total', 'ölçek puanı', 'Toplam', 'Doğru sayısı', '', '', '']);
    for (const s of q.scales) if (s.key !== 'total') rows.push([`puan_${s.key}`, 'ölçek puanı', s.name, 'Konu alanındaki doğru sayısı', '', '', '']);
  } else if (def.engine === 'reading') {
    const r = def as ReadingInstrument;
    for (const p of r.passages) {
      for (const qq of p.questions) {
        rows.push([`${p.key}.${qq.key}`, `soru (${p.title})`, qq.skill, qq.text, '', qq.answer, qq.options.map((o) => `${o.key}: ${o.text}`).join(' | ')]);
      }
    }
    rows.push(['puan_comprehension', 'ölçek puanı', 'Anlama', 'Doğru cevap sayısı', '', '', '']);
    rows.push(['puan_speed', 'ölçek puanı', 'Okuma hızı', 'Dakikada okunan kelime', '', '', '']);
  } else {
    const units: Record<string, string> = {
      digit_forward: 'Art arda başarılan en uzun dizi',
      digit_backward: 'Art arda başarılan en uzun dizi',
      spatial: 'Art arda başarılan en uzun dizi',
      attention: 'Doğru yüzdesi',
      speed: 'Dakikada doğru eşleştirme',
    };
    for (const s of def.scales) rows.push([`puan_${s.key}`, 'görev puanı', s.name, units[s.key] ?? '', '', '', '']);
  }
  return toCsv(['degisken', 'tur', 'olcek_alan', 'aciklama_metin', 'ters', 'anahtar', 'secenekler'], rows, opts);
}
