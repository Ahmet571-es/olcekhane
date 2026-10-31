import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import type { SimpleReport } from '@/lib/reports/simple';
import { oralPassagesFor, type OralInput } from '@/lib/scoring/oral';
import { MAX_UTTERANCE, reportSpeech, speakable, splitUtterances, utterancesOf } from '@/lib/speech/report-text';
import { pickTurkishVoice, type VoiceLike } from '@/lib/speech/voice';
import { likertBody, quizBody, readingBody } from './helpers/bodies';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * Raporu sesli dinle (site sahibinin 2026-10-31 isteği): yalnızca cihazdaki Türkçe sesle, metin hiçbir yere gönderilmeden.
 * Okunacak metin raporun verisinden kurulur; sayılar ve işaretler Türkçe okunur; kaynak gösterimleri okunmaz.
 */

const reportsOf = (slug: string, body: Parameters<typeof evaluateReports>[1]) => Object.values(evaluateReports(slug, body)) as SimpleReport[];

/** Okunan her parça: kısa, harf ya da rakam içerir, okunmayacak işaret ve kaynak gösterimi taşımaz. */
function checkSpoken(r: SimpleReport, label: string) {
  const t = reportSpeech(r);
  const res = utterancesOf(t.results);
  expect(res.length, label).toBeGreaterThan(3);
  // Raporun adı ve kartların başlıkları okunur.
  expect(res[0].text, label).toContain(speakable(r.instrumentName).replace(/\.$/, ''));
  for (const it of r.items.slice(0, 3)) expect(res.some((u) => u.segment === it.title), `${label} ${it.title}`).toBe(true);
  if (r.roadmap) expect(t.roadmap.length, label).toBeGreaterThan(0);
  else expect(t.roadmap, label).toEqual([]);
  for (const u of [...res, ...utterancesOf(t.roadmap)]) {
    const at = `${label}: ${u.text}`;
    expect(u.text.length, at).toBeLessThanOrEqual(MAX_UTTERANCE);
    expect(u.text, at).toMatch(/[\p{L}\d]/u);
    expect(u.text, at).not.toMatch(/[%“”"→←·°×≥≤{}]|\s\/\s|\bsn\b|\bve ark\.|\((?=[^)]*\b(?:19|20)\d{2}\b)[^)]*\)/u);
    expect(u.segment, at).toBeTruthy();
  }
  return res;
}

describe('Raporu sesli dinle: okunuş', () => {
  it('sayılar, birimler ve işaretler Türkçe okunur; kaynak gösterimleri okunmaz', () => {
    const cases: [string, string][] = [
      ['Doğruluk: %88.', 'Doğruluk: yüzde 88.'],
      ['% 88,5 doğru', 'yüzde 88,5 doğru'],
      ['Bilgi merakı: 3,4 / 5, Orta.', 'Bilgi merakı: 5 üzerinden 3,4, Orta.'],
      ['15/15 tanındı', '15 üzerinden 15 tanındı'],
      ['Tipik karar süresi: 1,5 sn.', 'Tipik karar süresi: 1,5 saniye.'],
      ['0–30 sn', '0 ile 30 saniye'],
      ['1 dk 15 sn', '1 dakika 15 saniye'],
      ['Yön hatası 8,2°', 'Yön hatası 8,2 derece'],
      ['Yüksek · Bilgi peşine düşen', 'Yüksek, Bilgi peşine düşen'],
      ['77 → 185', '77, 185'],
      ['Puan artar (Kail, 1991).', 'Puan artar.'],
      ['Yok demek uzun sürer (Treisman ve Gelade, 1980; Wolfe, 2021). Çünkü', 'Yok demek uzun sürer. Çünkü'],
      ['2.225 çocukla (Öktem ve ark., 2016; aktaran Çelik, 2021).', '2.225 çocukla.'],
      ['Sharma ve ark. bulmuştur', 'Sharma ve arkadaşları bulmuştur'],
      ['ör. bir listede', 'örneğin bir listede'],
      ['“Var” de', 'Var de'],
      ['Türkiye’de norm yok', "Türkiye'de norm yok"],
      ['{3/4} ile {1/2}', '3 bölü 4 ile 1 bölü 2'],
      ['fark −0,8 sn', 'fark eksi 0,8 saniye'],
      ['Zekâ puanı (IQ) verilmez', 'Zekâ puanı (IQ) verilmez'],
    ];
    for (const [a, b] of cases) expect(speakable(a), a).toBe(b);
  });

  it('metin cümlelere, uzun cümleler kısa parçalara bölünür; sayıdaki nokta ve kısaltmalar cümleyi bölmez', () => {
    expect(splitUtterances('Birinci cümle. İkinci cümle! Üçüncü?')).toEqual(['Birinci cümle.', 'İkinci cümle!', 'Üçüncü?']);
    expect(splitUtterances('3. sınıftan başlar. Ör. bir liste.')).toEqual(['3. sınıftan başlar.', 'Örneğin bir liste.']);
    expect(splitUtterances('Birinci paragraf.\n\nİkinci paragraf.')).toEqual(['Birinci paragraf.', 'İkinci paragraf.']);
    const long = Array.from({ length: 30 }, (_, i) => `parça ${i + 1}`).join(', ') + '; sonra ' + 'çok uzun bir cümle devam eder '.repeat(8) + '.';
    const parts = splitUtterances(long);
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) expect(p.length).toBeLessThanOrEqual(MAX_UTTERANCE);
    expect(parts.join(' ').replace(/\s+/g, ' ')).toBe(speakable(long));
    expect(splitUtterances('   ')).toEqual([]);
    expect(splitUtterances('—')).toEqual([]);
  });
});

describe('Raporu sesli dinle: raporlardan okunacak metin', () => {
  it('anket testleri: öğrenci, veli ve yetişkin raporu; sonuçlar ve yol haritası ayrı; grafik sözle okunur', () => {
    const likert = publicInstruments().filter((d): d is LikertInstrument => d.engine === 'likert');
    expect(likert.length).toBeGreaterThan(20);
    for (const d of likert) {
      const grade = gradeAllowed(d, 9) ? 9 : d.minGrade;
      for (const g of [grade, ...(gradeAllowed(d, ADULT_GRADE) ? [ADULT_GRADE] : [])]) {
        for (const r of reportsOf(d.slug, likertBody(d.slug, g, (i) => (i * 3 + 1) % 5))) {
          const res = checkSpoken(r, `${d.slug} ${g} ${r.audience}`);
          if (r.chart?.type === 'rulers') {
            for (const row of r.chart.rows.filter((x) => x.value !== null)) {
              expect(res.some((u) => u.text.startsWith(speakable(`${row.label}:`))), `${d.slug} ${row.label}`).toBe(true);
            }
          }
          const t = reportSpeech(r);
          if (r.roadmap) {
            const head = r.audience === 'parent' ? 'Çocuğunuz için yol haritası.' : 'Senin yol haritan.';
            expect(utterancesOf(t.roadmap)[0].text).toBe(head);
            // Yol haritasının kaynak listesi okunmaz.
            for (const s of r.roadmap.sources) expect(utterancesOf(t.roadmap).some((u) => u.text.includes(speakable(s.text).slice(0, 40))), s.text).toBe(false);
          }
        }
      }
    }
  });

  it('görev testleri: bütün sonuç örüntülerinde (yorumlanmayanlar dahil)', () => {
    let n = 0;
    for (const [slug, variants] of Object.entries(TASK_VARIANTS)) {
      for (const [name, make] of Object.entries(variants)) {
        const body = make();
        for (const r of reportsOf(slug, body)) {
          checkSpoken(r, `${slug} ${name} ${r.audience}`);
          n++;
        }
      }
    }
    expect(n).toBeGreaterThan(100);
  });

  it('okuma, sesli okuma ve konu tarama raporları; konu taramada soru soru inceleme okunmaz, hata türleri okunur', () => {
    for (const g of [3, 6]) for (const r of reportsOf('okuma-hizi-ve-anlama', readingBody(g))) checkSpoken(r, `okuma ${g} ${r.audience}`);
    for (const g of [5, 8]) {
      for (const r of reportsOf('matematik-konu-tarama-testi', quizBody(g, 3))) {
        const res = checkSpoken(r, `matematik ${g} ${r.audience}`);
        expect(r.quiz).toBeDefined();
        for (const q of r.quiz!.questions) expect(res.some((u) => u.text.includes(speakable(q.text).slice(0, 30))), q.text).toBe(false);
        if (r.quiz!.errors.length > 0) expect(res.some((u) => u.segment === r.quiz!.errorsTitle)).toBe(true);
      }
    }
    const p = oralPassagesFor(sesliOkuma, 3)[0];
    const input: OralInput = {
      passageKey: p.key,
      recordMs: 70_000,
      readingMs: Math.round((oralWordCount(p.paragraphs) / 70) * 60_000),
      timingAuto: true,
      audio: { quality: 'good', pauses: [[1000, 1400]], speechMs: 40_000, contour: Array.from({ length: 60 }, (_, i) => (i * 7) % 100), interrupted: false },
      marks: {},
      listened: 1,
      retell: { recorded: true, ideas: p.ideas.slice(0, 2).map((x) => x.key) },
      answers: Object.fromEntries(p.questions.map((q) => [q.key, q.answer])),
      prosody: { expression: 3, phrasing: 2, smoothness: 4, pace: 3 },
    };
    const reps = evaluate(sesliOkuma.slug, { grade: 3, data: { engine: 'oral', ...input } });
    for (const r of [reps.student, reps.parent] as SimpleReport[]) {
      const res = checkSpoken(r, `sesli okuma ${r.audience}`);
      expect(res.some((u) => u.segment === r.oral!.level.label)).toBe(true);
      expect(res.some((u) => u.segment === 'Akıcılık')).toBe(true);
    }
  });
});

describe('Raporu sesli dinle: ses', () => {
  const v = (name: string, lang: string, localService: boolean, def = false): VoiceLike => ({ name, lang, localService, default: def });

  it('yalnızca cihazdaki Türkçe ses seçilir; ağdaki ses ya da başka dil asla', () => {
    expect(pickTurkishVoice([])).toBeNull();
    // Masaüstü Chrome: "Google Türkçe" ağdan çalışır (localService false); kullanılmaz.
    expect(pickTurkishVoice([v('Google Türkçe', 'tr-TR', false), v('Google US English', 'en-US', false)])).toBeNull();
    expect(pickTurkishVoice([v('Samantha', 'en-US', true, true), v('Anna', 'de-DE', true)])).toBeNull();
    expect(pickTurkishVoice([v('Google Türkçe', 'tr-TR', false), v('Yelda', 'tr-TR', true)])?.name).toBe('Yelda');
    expect(pickTurkishVoice([v('Microsoft Tolga - Turkish (Turkey)', 'tr-TR', true)])?.name).toBe('Microsoft Tolga - Turkish (Turkey)');
    // tr-TR öncelikli, sonra cihazın varsayılanı; alt çizgili dil kodu (Android) da Türkçe sayılır.
    expect(pickTurkishVoice([v('Genel', 'tr', true), v('Türkiye', 'tr-TR', true)])?.name).toBe('Türkiye');
    expect(pickTurkishVoice([v('A', 'tr-TR', true), v('B', 'tr-TR', true, true)])?.name).toBe('B');
    expect(pickTurkishVoice([v('Android', 'tr_TR', true)])?.name).toBe('Android');
    expect(pickTurkishVoice([v('Tatarca', 'tt-RU', true), v('Türkmen', 'tk-TM', true)])).toBeNull();
  });

  it('oynatıcı: yalnızca seçilen sesle konuşur; istek, depo ya da çerez yok; ses yoksa görünmez; sekme değişince susar', () => {
    const ui = readFileSync(new URL('../src/components/test/report-speech.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon/);
    expect(ui).toContain('pickTurkishVoice(synth.getVoices())');
    expect(ui).toContain('u.voice = voice;');
    expect(ui).toContain('u.lang = voice.lang;');
    // Ses seçilmeden konuşulmaz (tarayıcının varsayılan sesine düşmez).
    expect(ui).toMatch(/if \(!synth \|\| !voice \|\| list\.length === 0\) return;/);
    expect(ui).toMatch(/if \(!voice \|\| lists\.results\.length === 0\) return null;/);
    expect(ui).toContain("addEventListener('pagehide'");
    expect(ui).toContain("addEventListener('visibilitychange'");
    const session = readFileSync(new URL('../src/components/test/test-session.tsx', import.meta.url), 'utf8');
    expect(session).toContain('<ReportSpeech key={audience} report={report}');
    const pkg = readFileSync(new URL('../src/components/paket/package-session.tsx', import.meta.url), 'utf8');
    expect(pkg).toMatch(/open\.has\(e\.slug\) && <ReportSpeech key=\{`\$\{e\.slug\}-\$\{audience\}`\}/);
  });
});
