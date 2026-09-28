import type { QuizItem, QuizOption, QuizOptionKey } from '@/lib/instruments/types';

const LETTERS: QuizOptionKey[] = ['A', 'B', 'C', 'D'];

/** Seçenek: [metin] ya da [metin, işaret]. İşaret `true` ise doğru cevap, bir metin ise yaygın hatanın anahtarıdır. */
export type OptionSpec = [string] | [string, true | string];

/**
 * Soru yazım yardımcısı. Seçenekler verildiği sırayla A–D harflerini alır. Sayısal seçenekler
 * küçükten büyüğe yazılır; doğru cevabın harfleri form içinde dengeli dağıtılır (testlerde denetlenir).
 */
export function q(
  key: string,
  domain: string,
  text: string,
  options: OptionSpec[],
  explain: string,
  extra: Pick<QuizItem, 'table' | 'chart' | 'figure'> = {},
): QuizItem {
  if (options.length !== 4) throw new Error(`${key}: dört seçenek olmalı`);
  const correct = options.filter(([, m]) => m === true);
  if (correct.length !== 1) throw new Error(`${key}: tek bir doğru cevap olmalı`);
  const opts: QuizOption[] = options.map(([t, m], i) => ({
    key: LETTERS[i],
    text: t,
    ...(typeof m === 'string' ? { misconception: m } : {}),
  }));
  const answer = LETTERS[options.findIndex(([, m]) => m === true)];
  return { key, domain, text, options: opts, answer, explain, ...extra };
}
