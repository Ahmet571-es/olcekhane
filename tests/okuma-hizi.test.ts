import { describe, expect, it } from 'vitest';
import { okumaHizi } from '@/content/instruments/okuma-hizi';
import { evaluate } from '@/lib/assessment/evaluate';
import { countWords, passageForGrade, scoreReading } from '@/lib/scoring/reading';

/**
 * Okuma Hızı ve Anlama: sorular birbirinin cevabını ele vermez. Bir sorunun doğru seçeneğindeki ayırt edici kelimeler
 * (en az beş harfli; Türkçe ekler yüzünden ilk beş harfleriyle karşılaştırılır; sorunun kendi kökünde, metnin adında ya
 * da en az üç sorunun kökünde geçen konu kelimeleri sayılmaz) başka bir sorunun kökünde ya da seçeneklerinde ikiden çok
 * geçmemeli ve hepsi birden geçmemeli. Ana fikir sorusunun cevabı ayrıntıları özetlediği için kaynak olarak denetlenmez;
 * ama onun seçenekleri öteki soruların cevabını ele vermemeli.
 */
const STOP = new Set(['metne', 'metin', 'metni', 'hangi', 'nedir', 'olduğ', 'kelim', 'anlam', 'büyük', 'olası', 'neden', 'kolay', 'önce', 'sonra', 'birbi', 'yalnı']);
const norm = (s: string) =>
  s
    .toLocaleLowerCase('tr-TR')
    .replace(/[’'"“”.,;:!?()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 5)
    .map((w) => w.slice(0, 5))
    .filter((w) => !STOP.has(w));

describe('Okuma Hızı ve Anlama: sorular', () => {
  for (const p of okumaHizi.passages) {
    it(`${p.key}: bir sorunun cevabı başka bir soruda geçmiyor`, () => {
      const qs = p.questions;
      const found: string[] = [];
      // Konu kelimeleri: metnin adındakiler ve en az üç sorunun kökünde geçenler.
      const stemCount = new Map<string, number>();
      for (const q of qs) for (const w of new Set(norm(q.text))) stemCount.set(w, (stemCount.get(w) ?? 0) + 1);
      const topic = new Set([...norm(p.title), ...[...stemCount].filter(([, n]) => n >= 3).map(([w]) => w)]);
      for (const a of qs) {
        if (a.skill === 'main_idea') continue;
        const key = a.options.find((o) => o.key === a.answer)!.text;
        const own = new Set(norm(a.text));
        const distinct = [...new Set(norm(key))].filter((w) => !own.has(w) && !topic.has(w));
        if (distinct.length === 0) continue;
        for (const b of qs) {
          if (b === a) continue;
          const words = new Set([...norm(b.text), ...b.options.flatMap((o) => norm(o.text))]);
          const hits = distinct.filter((w) => words.has(w));
          if (hits.length >= 2 || hits.length === distinct.length) found.push(`${a.key} cevabı (${key}) → ${b.key}: ${hits.join(', ')}`);
        }
      }
      expect(found).toEqual([]);
    });

    it(`${p.key}: doğru cevaplar harflere dengeli dağılmış ve tekrar eden bir örüntü yok`, () => {
      const keys = p.questions.map((q) => q.answer);
      for (const l of ['a', 'b', 'c', 'd']) expect(keys.filter((k) => k === l), l).toHaveLength(2);
      expect(keys.slice(0, 4).join('')).not.toBe(keys.slice(4).join(''));
      const skills = p.questions.map((q) => q.skill);
      expect(skills.filter((s) => s === 'literal')).toHaveLength(3);
      expect(skills.filter((s) => s === 'inference')).toHaveLength(2);
      expect(skills.filter((s) => s === 'vocabulary')).toHaveLength(2);
      expect(skills.filter((s) => s === 'main_idea')).toHaveLength(1);
    });
  }

  it('cevap anahtarlarındaki örüntü metinler arasında da tekrar etmiyor', () => {
    const patterns = okumaHizi.passages.map((p) => p.questions.map((q) => q.answer).join(''));
    expect(new Set(patterns).size).toBe(patterns.length);
  });
});

describe('Okuma Hızı ve Anlama: puanlama ve rapor', () => {
  const answersWith = (p: (typeof okumaHizi.passages)[number], correct: number) =>
    Object.fromEntries(p.questions.map((q, i) => [q.key, i < correct ? q.answer : q.options.find((o) => o.key !== q.answer)!.key]));
  const msFor = (p: (typeof okumaHizi.passages)[number], wpm: number) => (countWords(p.paragraphs) / wpm) * 60_000;

  it('"Anlayarak okuma" göz gezdirip tahmin edeni ödüllendirmez', () => {
    const p = passageForGrade(okumaHizi, 10);
    const careful = scoreReading(p, msFor(p, 150), answersWith(p, 8));
    expect(careful.effectiveWpm).toBe(150);
    // Hızlı okuyup 4/8 yapan: anlama 6/8'in altında, yorumlanmaz.
    const skim = scoreReading(p, msFor(p, 400), answersWith(p, 4));
    expect(skim.effectiveWpm).toBeNull();
    // 7/8 ile hızlı okuyan: şansla düzeltilmiş oran (7 − 1/3) / 8.
    const quick = scoreReading(p, msFor(p, 300), answersWith(p, 7));
    expect(quick.effectiveWpm).toBe(Math.round(300 * ((7 - 1 / 3) / 8)));
    // Göz gezdirme sınırının üstü: yorumlanmaz.
    const tooFast = scoreReading(p, msFor(p, 600), answersWith(p, 8));
    expect(tooFast.flags.tooFast).toBe(true);
    expect(tooFast.effectiveWpm).toBeNull();
  });

  it('hız sınırları metnin sınıf düzeyine göre', () => {
    const g3 = passageForGrade(okumaHizi, 3);
    const g10 = passageForGrade(okumaHizi, 10);
    // 3. sınıf metninde dakikada 350 kelime göz gezdirmedir; lise metninde değildir.
    expect(scoreReading(g3, msFor(g3, 350), answersWith(g3, 8)).flags.tooFast).toBe(true);
    expect(scoreReading(g10, msFor(g10, 350), answersWith(g10, 8)).flags.tooFast).toBe(false);
    expect(scoreReading(g3, msFor(g3, 50), answersWith(g3, 8)).pace).toBe('slow');
    expect(scoreReading(g10, msFor(g10, 300), answersWith(g10, 8)).pace).toBe('fast');
    // Çok uzun süre: ara verilmiş olabilir.
    const slow = scoreReading(g10, msFor(g10, 10), answersWith(g10, 8));
    expect(slow.flags.tooSlow).toBe(true);
    expect(slow.effectiveWpm).toBeNull();
  });

  it('raporda sesli okuma ortalaması sessiz okumayla karşılaştırılmaz, yalnızca bağlam olarak verilir', () => {
    const p = passageForGrade(okumaHizi, 4);
    const r = evaluate('okuma-hizi-ve-anlama', {
      grade: 4,
      data: { engine: 'reading', passageKey: p.key, readingMs: msFor(p, 100), answers: answersWith(p, 8) },
    });
    const speed = r.parent.items.find((i) => i.title === 'Okuma hızı')!.text;
    expect(speed).toContain('kelimeyi doğru okuduğu');
    expect(speed).toContain('doğrudan karşılaştırılamaz');
    expect(speed).not.toContain('Sessiz okuma genellikle sesli okumadan hızlıdır');
    // Doğru ve yavaş okuyan lise öğrencisine akıcılık (tekrarlı okuma) önerilir, "yeni türler" değil.
    const g10 = passageForGrade(okumaHizi, 10);
    const slow = evaluate('okuma-hizi-ve-anlama', {
      grade: 10,
      data: { engine: 'reading', passageKey: g10.key, readingMs: msFor(g10, 60), answers: answersWith(g10, 8) },
    });
    expect(slow.student.roadmap!.weeks[2].title).toBe('Tekrarlı okuma');
    const low = evaluate('okuma-hizi-ve-anlama', {
      grade: 10,
      data: { engine: 'reading', passageKey: g10.key, readingMs: msFor(g10, 300), answers: answersWith(g10, 3) },
    });
    expect(low.student.roadmap!.weeks[2].title).toBe('Yavaşla ve anla');
    expect(low.student.keyFigures.find((f) => f.label === 'Anlayarak okuma')!.value).toBe('—');
  });
});
