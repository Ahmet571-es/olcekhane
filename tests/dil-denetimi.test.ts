import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import type { LikertInstrument } from '@/lib/instruments/types';

/**
 * Dil ve mantık denetiminden (2026-11-20'de başladı; ilerleme DURUM.md'de) çıkan kalıcı kurallar. Denetimde bulunan bir
 * hata türü bütün testlerde aranabiliyorsa buraya yazılır: sonradan eklenen test de aynı hatayı yapmasın.
 */

const LIKERT = publicInstruments().filter((d) => d.engine === 'likert') as LikertInstrument[];

/** Şıkları sıklık soran testler ("Hiçbir zaman" … "Her zaman"). */
const FREQUENCY_OPTION = /hiçbir zaman|nadiren|bazen|ara sıra|sık sık|çoğu zaman|her zaman/i;
const frequencyTests = LIKERT.filter((d) => d.options.filter((o) => FREQUENCY_OPTION.test(o.label)).length >= 3);

/** Maddenin içinde sıklık bildiren sözcükler. */
const FREQUENCY_WORD =
  /(^|\s)(sık sık|sıklıkla|genellikle|çoğu zaman|çoğunlukla|her zaman|hiçbir zaman|nadiren|bazen|ara sıra|arada bir|zaman zaman|sürekli|hep|asla)(?=\s|[.,;:!?]|$)/i;

describe('dil ve mantık denetimi: kalıcı kurallar', () => {
  it('sıklık soran şıkların olduğu testte maddenin içinde ayrıca sıklık sözcüğü yok', () => {
    // "Ders çalışırken sık sık mesajlarıma bakarım" cümlesine "Nadiren" demek iki ayrı sıklık bildirir.
    expect(frequencyTests.length).toBeGreaterThanOrEqual(4);
    const found: string[] = [];
    for (const d of frequencyTests) for (const it of d.items) if (FREQUENCY_WORD.test(it.text)) found.push(`${d.slug} ${it.key}: ${it.text}`);
    expect(found).toEqual([]);
  });

  it('giriş, cümlelerin hepsi kişiyi anlatıyormuş gibi başlamaz', () => {
    // "Seni anlatan 50 cümle göreceksin" dedikten sonra "seni ne kadar doğru anlatıyor?" diye sormak çelişir.
    for (const d of LIKERT) for (const p of d.intro.paragraphs) expect(/seni anlatan \d+/.test(p), `${d.slug}: ${p}`).toBe(false);
  });

  it('gereksiz yineleme yok: "yeniden tekrar", "tekrar yeniden", "geri iade"', () => {
    const found: string[] = [];
    for (const d of LIKERT) {
      for (const text of [...d.intro.paragraphs, d.prompt, ...d.items.map((x) => x.text)]) {
        if (/yeniden tekrar|tekrar yeniden|geri iade|ilk önce\b/i.test(text)) found.push(`${d.slug}: ${text}`);
      }
    }
    expect(found).toEqual([]);
  });

  it('etkinlikten ne kadar hoşlanıldığını soran testte her madde bir eylemle biter', () => {
    // "Bunu yapmaktan ne kadar hoşlanırsın?" sorusuna "… açık havada yapılan işler" gibi ad öbeği uymaz.
    const activity = LIKERT.filter((d) => /yapmaktan/.test(d.prompt));
    expect(activity.map((d) => d.slug)).toContain('mesleki-ilgi-profili');
    const found: string[] = [];
    for (const d of activity) for (const it of d.items) if (!/m[ae]k$/.test(it.text.trim())) found.push(`${d.slug} ${it.key}: ${it.text}`);
    expect(found).toEqual([]);
  });
});
