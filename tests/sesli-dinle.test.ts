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
import { MAX_UTTERANCE, reportSpeech, speakable, splitUtterances, spokenNote, utterancesOf } from '@/lib/speech/report-text';
import { PAUSE_GUARD_MS, SpeechHub, SpeechPlayer, WATCHDOG_MS, type PlayerEnv, type SynthLike, type UtteranceLike } from '@/lib/speech/player';
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
    expect(u.text, at).not.toMatch(/[%“”"→←·°×≥≤{}/÷□]|\bsn\b|\bve ark\.|\((?=[^)]*\b(?:19|20)\d{2}\b)[^)]*\)|\s[=+]\s|\([A-ZÇĞİÖŞÜ]{1,2}\)/u);
    expect(u.text, at).not.toMatch(/^\d+\.$/);
    // Parçanın sonundaki sayı sıra sayısı gibi okunmasın.
    expect(u.text, at).not.toMatch(/\d\.$/);
    expect(u.segment, at).toBeTruthy();
  }
  // Öne çıkan sayılarda "72. dört bölümde" gibi sıra sayısı okunuşu olmaz.
  // (Değerin kendisindeki sıra sayısı, ör. "3. düzey", olağandır.)
  const ordinals = r.keyFigures.flatMap((f) => f.value.match(/\d+\.\s+\p{Ll}+/gu) ?? []);
  for (const u of res.filter((x) => x.segment === 'Öne çıkan sayılar')) {
    const rest = ordinals.reduce((t, o) => t.split(o).join(''), u.text);
    expect(rest, `${label}: ${u.text}`).not.toMatch(/\d\.\s+\p{Ll}/u);
  }
  // Bölümler ekrandaki görünme koşullarıyla okunur.
  if (r.roadmap) {
    const segs = t.roadmap.map((x) => x.title);
    expect(segs.includes(r.roadmap.study.title), label).toBe(r.roadmap.study.items.length > 0);
    expect(segs.includes(r.roadmap.approach?.title ?? '∅'), label).toBe(!!r.roadmap.approach && r.roadmap.approach.items.length > 0);
    const kisaca = t.roadmap.find((x) => x.title === 'Kısaca');
    if (r.roadmap.standout.length > 0) for (const st of r.roadmap.standout) expect(kisaca?.lines.join(' '), label).toContain(st.text);
    else if (r.roadmap.standoutNote) expect(kisaca?.lines.join(' '), label).toContain(r.roadmap.standoutNote);
  }
  // Grafiğin görünüşünü anlatan cümleler okunmaz.
  for (const u of res) expect(u.text, `${label}: ${u.text}`).not.toMatch(/(?<!\p{L})(?:kırmızı|sarı bant|kesikli)/iu);
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
      ['Zekâ puanı (IQ) verilmez', 'Zekâ puanı verilmez'],
      ['Sanatçı (A), Girişimci (E)', 'Sanatçı, Girişimci'],
      ['Okuma hızı: 62, kelime/dakika.', 'Okuma hızı: dakikada 62 kelime.'],
      ['Okuma hızı: 62 kelime/dk', 'Okuma hızı: dakikada 62 kelime'],
      ['5–8. sınıf öğrencileri', '5. ile 8. sınıf öğrencileri'],
      ['48 ÷ 6 = □', '48 bölü 6 eşittir boş kutu'],
      ['3 + 4 = 7', '3 artı 4 eşittir 7'],
      ['a=b kalır', 'a=b kalır'],
    ];
    for (const [a, b] of cases) expect(speakable(a), a).toBe(b);
  });

  it('metin cümlelere, uzun cümleler kısa parçalara bölünür; sayıdaki nokta ve kısaltmalar cümleyi bölmez', () => {
    expect(splitUtterances('Birinci cümle. İkinci cümle! Üçüncü?')).toEqual(['Birinci cümle.', 'İkinci cümle!', 'Üçüncü?']);
    expect(splitUtterances('3. sınıftan başlar. Ör. bir liste.')).toEqual(['3. sınıftan başlar.', 'Örneğin bir liste.']);
    expect(splitUtterances('Birinci paragraf.\n\nİkinci paragraf.')).toEqual(['Birinci paragraf.', 'İkinci paragraf.']);
    // Sıra numarasından sonra bölünmez; sondaki sayı noktasız okunur.
    expect(splitUtterances('1. Kazanç: yüksek ücret. 2. Saygınlık.')).toEqual(['1. Kazanç: yüksek ücret.', '2. Saygınlık.']);
    expect(splitUtterances('Doğru: 8/8.')).toEqual(['Doğru: 8 üzerinden 8']);
    expect(splitUtterances('Bilmiyorum: 0.')).toEqual(['Bilmiyorum: 0']);
    // Grafiğin görünüşünü anlatan cümle ya da cümle bölümü okunmaz.
    expect(spokenNote('Her satır bir boyut. Kırmızı işaret senin puanın, sarı bant ölçümün doğal payı.')).toBe('Her satır bir boyut.');
    expect(spokenNote('Alt özellikler daha az kesindir; sarı bantların daha geniş olması bundandır.')).toBe('Alt özellikler daha az kesindir.');
    expect(spokenNote('Altıgende yan yana duran alanlar birbirine benzer.')).toBeNull();
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
    expect(ui).toContain('setVoice(pickTurkishVoice(synth.getVoices()))');
    // Ses yoksa (ya da kaybolursa) oynatıcı görünmez.
    expect(ui).toMatch(/if \(!voice \|\| lists\.results\.length === 0\) return null;/);
    expect(ui).toContain("addEventListener('pagehide'");
    expect(ui).toContain("addEventListener('visibilitychange'");
    expect(ui).toContain('Site raporunu hiçbir yere göndermez');
    const player = readFileSync(new URL('../src/lib/speech/player.ts', import.meta.url), 'utf8');
    expect(player).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon/);
    expect(player).toContain('u.voice = live;');
    expect(player).toContain('u.lang = live.lang;');
    const session = readFileSync(new URL('../src/components/test/test-session.tsx', import.meta.url), 'utf8');
    expect(session).toContain('<ReportSpeech key={audience} report={report}');
    const pkg = readFileSync(new URL('../src/components/paket/package-session.tsx', import.meta.url), 'utf8');
    expect(pkg).toMatch(/open\.has\(e\.slug\) && <ReportSpeech key=\{`\$\{e\.slug\}-\$\{audience\}`\}/);
  });
});

describe('Raporu sesli dinle: okuma kuyruğu', () => {
  type V = VoiceLike & { voiceURI: string };
  type U = UtteranceLike<V>;
  const tr = (local = true): V => ({ name: 'Yelda', lang: 'tr-TR', localService: local, voiceURI: 'yelda' });

  /** Sahte konuşma özelliği. `style`: iptal edilen konuşmanın olayı ("error": interrupted, "end": onend). */
  class FakeSynth implements SynthLike<V> {
    speaking = false;
    pending = false;
    spoken: U[] = [];
    cancels = 0;
    current: U | null = null;
    constructor(
      public voices: V[],
      public style: 'error' | 'end' = 'error',
    ) {}
    getVoices() {
      return this.voices;
    }
    speak(u: U) {
      this.spoken.push(u);
      this.current = u;
      this.speaking = true;
    }
    cancel() {
      this.cancels++;
      const u = this.current;
      this.current = null;
      this.speaking = false;
      if (!u) return;
      if (this.style === 'error') u.onerror?.({ error: 'interrupted' });
      else u.onend?.();
    }
    /** Okunan parça bitti. */
    finish() {
      const u = this.current;
      this.current = null;
      this.speaking = false;
      u?.onend?.();
    }
  }

  function setup(style: 'error' | 'end' = 'error', n = 5) {
    const synth = new FakeSynth([tr()], style);
    let t = 0;
    let timers: { at: number; fn: () => void; id: number }[] = [];
    let nextId = 1;
    const env: PlayerEnv<V> = {
      synth,
      utterance: (text) => ({ text, voice: null, lang: '', rate: 1, onend: null, onerror: null }),
      setTimeout: (fn, ms) => {
        const id = nextId++;
        timers.push({ at: t + ms, fn, id });
        return id;
      },
      clearTimeout: (id) => {
        timers = timers.filter((x) => x.id !== id);
      },
      now: () => t,
    };
    const tick = (ms: number) => {
      t += ms;
      for (;;) {
        const due = timers.filter((x) => x.at <= t).sort((a, b) => a.at - b.at)[0];
        if (!due) break;
        timers = timers.filter((x) => x !== due);
        due.fn();
      }
    };
    const lists = {
      results: Array.from({ length: n }, (_, i) => ({ text: `Sonuç ${i + 1}`, segment: `Bölüm ${i + 1}` })),
      roadmap: [{ text: 'Yol haritası', segment: 'Yol haritası' }],
    };
    const hub = new SpeechHub();
    const player = new SpeechPlayer(env, lists, tr(), hub);
    return { synth, env, player, tick, hub, lists };
  }

  it('ilk parça düğmeye basılınca hemen okunur; her parça cihazdaki Türkçe sesle; bitince "done"', () => {
    const { synth, player, tick } = setup();
    player.play('results');
    expect(synth.spoken.map((u) => u.text)).toEqual(['Sonuç 1']);
    expect(player.getState()).toMatchObject({ status: 'playing', current: 'Bölüm 1' });
    // Ses listesi yenilenince (yeni nesne, aynı ses) yeni nesne kullanılır.
    synth.voices = [{ ...tr() }];
    for (let i = 0; i < 5; i++) {
      tick(500);
      synth.finish();
    }
    expect(synth.spoken.map((u) => u.text)).toEqual(['Sonuç 1', 'Sonuç 2', 'Sonuç 3', 'Sonuç 4', 'Sonuç 5']);
    for (const u of synth.spoken) {
      expect(u.voice?.localService).toBe(true);
      expect(u.voice?.voiceURI).toBe('yelda');
      expect(u.lang).toBe('tr-TR');
    }
    expect(synth.spoken[1].voice).toBe(synth.voices[0]);
    expect(player.getState()).toMatchObject({ status: 'done', current: null });
  });

  it('ses kaybolursa ya da ağdan çalışan sese dönüşürse okuma durur, başka sese geçilmez', () => {
    const { synth, player } = setup();
    player.play('results');
    synth.voices = [{ ...tr(), localService: false }, { name: 'Samantha', lang: 'en-US', localService: true, voiceURI: 'sam' }];
    synth.finish();
    expect(synth.spoken).toHaveLength(1);
    expect(player.getState().status).toBe('error');
    synth.voices = [];
    player.resume();
    expect(synth.spoken).toHaveLength(1);
    expect(player.getState().status).toBe('error');
  });

  for (const style of ['error', 'end'] as const) {
    it(`iptal edilen konuşmanın geç gelen olayları yok sayılır (${style === 'error' ? 'onerror' : 'onend'}); devam aynı parçadan`, () => {
      const { synth, player, tick } = setup(style);
      player.play('results');
      tick(PAUSE_GUARD_MS + 1);
      synth.finish();
      expect(synth.spoken).toHaveLength(2);
      player.pause();
      expect(player.getState().status).toBe('paused');
      expect(synth.cancels).toBe(1);
      // İptal olayı sonraki parçaya geçirmedi.
      expect(synth.spoken).toHaveLength(2);
      tick(WATCHDOG_MS * 3);
      expect(synth.spoken).toHaveLength(2);
      player.resume();
      expect(synth.spoken.map((u) => u.text)).toEqual(['Sonuç 1', 'Sonuç 2', 'Sonuç 2']);
      expect(player.getState().status).toBe('playing');
    });
  }

  it('dışarıdan kesinti duraklatır; başka bir hata okumayı "error"la durdurur', () => {
    const { synth, player } = setup();
    player.play('results');
    synth.current!.onerror!({ error: 'interrupted' });
    expect(player.getState().status).toBe('paused');
    player.resume();
    synth.current!.onerror!({ error: 'synthesis-failed' });
    expect(player.getState()).toMatchObject({ status: 'error', current: null });
    // Eski parçanın geç gelen "bitti" olayı bir şey başlatmaz.
    synth.spoken[1].onend!();
    expect(synth.spoken).toHaveLength(2);
  });

  it('"bitti" olayı gelmezse konuşma bitmiş görününce sonraki parçaya geçilir', () => {
    const { synth, player, tick } = setup();
    player.play('results');
    tick(WATCHDOG_MS);
    expect(synth.spoken).toHaveLength(1);
    synth.speaking = false;
    tick(WATCHDOG_MS);
    expect(synth.spoken.map((u) => u.text)).toEqual(['Sonuç 1', 'Sonuç 2']);
  });

  it('başlattıktan hemen sonraki (çift dokunma) duraklatma yok sayılır', () => {
    const { synth, player, tick } = setup();
    player.play('results');
    player.pause();
    expect(player.getState().status).toBe('playing');
    expect(synth.cancels).toBe(0);
    tick(PAUSE_GUARD_MS);
    player.pause();
    expect(player.getState().status).toBe('paused');
  });

  it('başka bir oynatıcı başlayınca bu oynatıcı duraklar; eski olayları yok sayılır', () => {
    const a = setup();
    const b = new SpeechPlayer(a.env, a.lists, tr(), a.hub);
    a.player.play('results');
    b.play('roadmap');
    expect(a.player.getState().status).toBe('paused');
    expect(b.getState().status).toBe('playing');
    expect(a.synth.spoken.map((u) => u.text)).toEqual(['Sonuç 1', 'Yol haritası']);
    a.synth.spoken[0].onend!();
    expect(a.synth.spoken).toHaveLength(2);
    a.synth.finish();
    expect(b.getState().status).toBe('done');
    expect(a.player.getState().status).toBe('paused');
  });

  it('okurken hız değişince okunan parça yeni hızla bir kez baştan okunur', () => {
    const { synth, player, tick } = setup();
    player.play('results');
    synth.finish();
    synth.finish();
    expect(synth.spoken).toHaveLength(3);
    player.setRate(0.8);
    expect(synth.spoken.map((u) => [u.text, u.rate])).toEqual([
      ['Sonuç 1', 1],
      ['Sonuç 2', 1],
      ['Sonuç 3', 1],
      ['Sonuç 3', 0.8],
    ]);
    player.setRate(0.8);
    expect(synth.spoken).toHaveLength(4);
    tick(PAUSE_GUARD_MS);
    player.pause();
    player.setRate(1);
    expect(synth.spoken).toHaveLength(4);
  });

  it('sayfa gizlenince ya da sayfadan çıkılırken duraklar; kaldırılınca ve durdurulunca susar', () => {
    const { synth, player } = setup();
    player.play('results');
    player.hide();
    expect(player.getState().status).toBe('paused');
    expect(synth.cancels).toBe(1);
    player.resume();
    player.stop();
    expect(player.getState()).toMatchObject({ status: 'idle', part: 'results', current: null });
    expect(synth.cancels).toBe(2);
    player.play('results');
    player.destroy();
    expect(synth.cancels).toBe(3);
    synth.spoken.at(-1)!.onend!();
    expect(synth.spoken).toHaveLength(3);
  });
});
