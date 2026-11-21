import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import type { LikertInstrument, TaskInstrument } from '@/lib/instruments/types';

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
    // "Seni anlatan 50 cümle göreceksin" (ya da "ilişkilerini anlatan 32 cümle") dedikten sonra "seni ne kadar doğru
    // anlatıyor?" diye sormak çelişir.
    for (const d of LIKERT) for (const p of d.intro.paragraphs) expect(/(seni|\S+(?:ını|ini|unu|ünü)) anlatan \d+/.test(p), `${d.slug}: ${p}`).toBe(false);
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
    const activity = LIKERT.filter((d) => /hoşlan/.test(d.prompt));
    expect(activity.map((d) => d.slug)).toEqual(expect.arrayContaining(['mesleki-ilgi-profili', 'meslek-ilgi-alanlari']));
    const found: string[] = [];
    for (const d of activity) for (const it of d.items) if (!/m[ae]k$/.test(it.text.trim())) found.push(`${d.slug} ${it.key}: ${it.text}`);
    expect(found).toEqual([]);
  });

  it('soru ve şıklar aynı kipte: "hoşlanırdın?" diye sorulup "hoşlanırım" diye cevaplanmaz', () => {
    const found: string[] = [];
    for (const d of LIKERT) {
      const hypothetical = /(rd[ıiuü]n|rd[ıiuü]n[ıiuü]z)\?$/.test(d.prompt.trim());
      const present = d.options.some((o) => /(r[ıiuü]m|m[ae]m)$/.test(o.label.trim()));
      if (hypothetical && present) found.push(`${d.slug}: ${d.prompt}`);
    }
    expect(found).toEqual([]);
  });

  it('yönergede yazan süre sınırı görevin ayarıyla aynı', () => {
    // Süre sınırı yönergede söylenir (kişi sınırı süre dolunca öğrenmesin); ayar değişirse cümle de değişmeli.
    const tasks = (publicInstruments().filter((d) => d.engine === 'tasks') as TaskInstrument[]).flatMap((d) => d.tasks);
    const colorWord = tasks.find((t) => t.kind === 'color_word');
    const trail = tasks.find((t) => t.kind === 'trail');
    const rotation = tasks.find((t) => t.kind === 'mental_rotation');
    const reaction = tasks.find((t) => t.kind === 'reaction_time');
    const ruleSwitch = tasks.find((t) => t.kind === 'rule_switch');
    if (colorWord?.kind !== 'color_word' || trail?.kind !== 'trail' || rotation?.kind !== 'mental_rotation' || reaction?.kind !== 'reaction_time' || ruleSwitch?.kind !== 'rule_switch')
      throw new Error('görev bulunamadı');
    expect(colorWord.instructions.join(' ')).toContain(`en çok ${colorWord.timeoutMs / 1000} saniye`);
    expect(trail.instructions.join(' ')).toContain(`en çok ${trail.maxMs / 60_000} dakika`);
    expect(rotation.instructions.join(' ')).toContain(`en çok ${rotation.timeoutMs / 1000} saniye`);
    expect(reaction.instructions.join(' ')).toContain(`en çok ${reaction.timeoutMs / 1000} saniye`);
    expect(ruleSwitch.instructions.join(' ')).toContain(`en çok ${ruleSwitch.timeoutMs / 1000} saniye`);
  });

  it('aynı İngilizce madde bütün testlerde aynı Türkçeyle yazılır', () => {
    // Çocuk Kişilik Profili maddeleri küçük yaşa göre yeniden yazar; karşılaştırmaya girmez.
    const byPlain = new Map<string, Map<string, string[]>>();
    for (const d of LIKERT) {
      if (CHILD_ADAPTED.has(d.slug)) continue;
      for (const it of d.items) {
        if (!it.source) continue;
        const key = plainSource(it.source);
        const texts = byPlain.get(key) ?? new Map<string, string[]>();
        texts.set(it.text, [...(texts.get(it.text) ?? []), `${d.slug}:${it.key}`]);
        byPlain.set(key, texts);
      }
    }
    const different = [...byPlain].filter(([, texts]) => texts.size > 1);
    const found = different
      .filter(([key]) => !(key in KNOWN_DIFFERENT))
      .map(([key, texts]) => `"${key}": ${[...texts].map(([text, where]) => `${text} [${where.join(', ')}]`).join(' / ')}`);
    expect(found).toEqual([]);
    // Listede kalmış ama artık farklı olmayan madde olmasın.
    expect(Object.keys(KNOWN_DIFFERENT).filter((key) => !different.some(([k]) => k === key))).toEqual([]);
  });
});

/** Maddeleri küçük yaşa göre uyarlayan testler. */
const CHILD_ADAPTED = new Set(['cocuk-kisilik-profili']);

/** Bilerek farklı bırakılan çeviriler ve nedeni (yeni fark buraya ancak nedeniyle yazılır). */
const KNOWN_DIFFERENT: Record<string, string> = {
  'have a vivid imagination': 'Beş Faktör 6. sınıftan açık: daha kısa cümle ("Hayal gücüm çok canlıdır").',
  'have difficulty understanding abstract ideas': 'Beş Faktör 6. sınıftan açık: "soyut" sözcüğü cümlenin içinde açıklanır.',
  'get upset easily':
    'Beş Faktör duygusal denge ölçeğinde üzülmeyi, öteki testler çabuk bozulmayı sorar; hangisinin kalacağı hocaya sorulacak (DURUM.md).',
};

function plainSource(source: string): string {
  return source
    .toLocaleLowerCase('en-US')
    .replace(/[.’'"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
