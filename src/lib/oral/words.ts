/**
 * Sesli okuma metinlerinin kelimelere bölünmesi. Tarayıcı (işaretleme ekranı) ve sunucu (puanlama) aynı işlevi
 * kullanır: işaretler kelimenin metindeki sırasıyla (0'dan başlayarak) gönderilir ve sunucu aynı sırayı yeniden kurar.
 * Kelime: boşlukla ayrılan ve en az bir harf ya da rakam içeren parça; noktalama işaretleri kelimeye bitişik kalır
 * (ekranda öyle görünür) ama sayıya etki etmez. Başlık sayılmaz.
 */

export interface OralToken {
  /** Kelimenin metindeki sırası (bütün paragraflar boyunca, 0'dan başlar). */
  i: number;
  /** Ekranda gösterilen hâli (noktalamasıyla birlikte). */
  text: string;
}

/** Paragraf paragraf kelimeler. */
export function oralTokens(paragraphs: string[]): OralToken[][] {
  let i = 0;
  return paragraphs.map((p) =>
    p
      .split(/\s+/)
      .filter((t) => /[\p{L}\p{N}]/u.test(t))
      .map((text) => ({ i: i++, text })),
  );
}

export function oralWordCount(paragraphs: string[]): number {
  return oralTokens(paragraphs).reduce((n, p) => n + p.length, 0);
}
