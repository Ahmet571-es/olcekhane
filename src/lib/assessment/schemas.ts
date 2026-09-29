import { z } from 'zod';

/** Harf işaretleme bölümü: bölüm sonunda işaretli harflerin sırası ve işaretlenme zamanları. */
const cancellationResponse = z.object({
  marks: z.array(z.number().int().min(0).max(4999)).max(5000),
  times: z.array(z.number().min(0).max(600_000)).max(5000),
  unmarks: z.number().int().min(0).max(100_000),
});

/** Bilişsel görevin bir denemesi (tarayıcının gönderdiği biçim); doğruluk sunucuda yeniden hesaplanır. */
export const taskTrial = z.object({
  length: z.number().int().min(1).max(20).optional(),
  index: z.number().int().min(0).max(1000),
  response: z.union([
    z.array(z.number().int().min(0).max(9)).max(12),
    z.enum(['L', 'R']),
    z.number().int().min(1).max(9),
    cancellationResponse,
    z.null(),
  ]),
  rtMs: z.number().min(0).max(120_000).nullable(),
});

const rt = z.number().min(0).max(3_600_000).nullable();
const fewKeys = (max: number) => (o: Record<string, unknown>) => Object.keys(o).length <= max;

/**
 * Testin bütün cevapları tek istekte gelir. Hiçbir şey kaydedilmez; cevaplar yalnızca raporu
 * hazırlamak için kullanılır. Ad, e-posta gibi kimlik bilgisi istenmez: cevaplar kimseye bağlanamaz.
 */
export const answersBody = z.object({
  grade: z.number().int().min(1).max(13),
  data: z.discriminatedUnion('engine', [
    z.object({
      engine: z.literal('likert'),
      answers: z.record(z.string().max(40), z.object({ value: z.number().int().min(-10).max(10), rtMs: rt })).refine(fewKeys(300)),
    }),
    z.object({
      engine: z.literal('quiz'),
      answers: z.record(z.string().max(40), z.object({ choice: z.enum(['A', 'B', 'C', 'D', 'X']), rtMs: rt })).refine(fewKeys(100)),
    }),
    z.object({
      engine: z.literal('reading'),
      passageKey: z.string().max(40),
      readingMs: z.number().min(0).max(3_600_000),
      answers: z.record(z.string().max(10), z.string().max(4)).refine(fewKeys(30)),
    }),
    z.object({
      engine: z.literal('tasks'),
      /** Harf işaretleme sayfalarının tohumu (tarayıcıda rastgele üretilir). */
      seed: z.uuid(),
      blocks: z.record(z.string().max(40), z.array(taskTrial).min(1).max(400)).refine(fewKeys(12)),
    }),
  ]),
});

/** PDF isteği: aynı cevaplar ve raporun kimin için olduğu (öğrenci ya da veli). */
export const pdfBody = answersBody.extend({ audience: z.enum(['student', 'parent']) });

export type AnswersBody = z.infer<typeof answersBody>;
