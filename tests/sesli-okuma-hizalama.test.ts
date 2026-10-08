import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AsrWord } from '@/lib/oral/auto';
import {
  alignWords,
  buildAutoMarks,
  foldWord,
  normalizeWord,
  planVerification,
  type ReadingTiming,
  type VerifyClip,
  type WordAlignment,
} from '@/lib/oral/align';
import { oralTokens } from '@/lib/oral/words';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';

/**
 * Sesli okumada otomatik işaretleme (lib/oral/align.ts). Önce her kural yapay örneklerle, sonra cihazdaki konuşma
 * tanımanın (Whisper small) gerçek çıktılarıyla denenir: bilerek hatalı okunmuş 22 kayıt ve doğru okunmuş 70 FLEURS
 * cümlesi (tests/fixtures). Ölçüt: doğru okunan kelimeye hata yazılmaması (isabet), sonra hataların yakalanması.
 */

const PASSAGE = [
  'Bir ağaç kütüğüne hiç yakından baktın mı? Kütüğün üstünde iç içe halkalar görürsün. Bu halkalar, ağacın nasıl büyüdüğünü anlatır. Onlara yıllık halka denir.',
];
// 0 Bir 1 ağaç 2 kütüğüne 3 hiç 4 yakından 5 baktın 6 mı? 7 Kütüğün 8 üstünde 9 iç 10 içe 11 halkalar 12 görürsün.
// 13 Bu 14 halkalar, 15 ağacın 16 nasıl 17 büyüdüğünü 18 anlatır. 19 Onlara 20 yıllık 21 halka 22 denir.
const READ = PASSAGE[0];
const N = 23;

const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** "a b |1.5 c": her kelime 0,35 sn, aralarda 0,05 sn; "|x" x saniye sessizlik; "_" bir kelimenin içinde boşluk. */
function say(script: string, t0 = 0.5): AsrWord[] {
  const out: AsrWord[] = [];
  let t = t0;
  for (const p of script.split(/\s+/).filter(Boolean)) {
    if (p.startsWith('|')) {
      t += Number(p.slice(1));
      continue;
    }
    out.push({ text: p.replace(/_/g, ' '), start: r3(t), end: r3(t + 0.35) });
    t += 0.4;
  }
  return out;
}

/** Kelimelerden ses çözümlemesi: konuşma kelimelerin olduğu yerde, 250 ms'den uzun boşluklar duraklama (mutlak ms). */
function timingOf(ws: AsrWord[], extra: Partial<ReadingTiming> = {}): ReadingTiming {
  const pauses: [number, number][] = [];
  for (let k = 1; k < ws.length; k++) {
    const a = ws[k - 1].end * 1000;
    const b = ws[k].start * 1000;
    if (b - a >= 250) pauses.push([Math.round(a), Math.round(b)]);
  }
  return {
    speechStartMs: ws.length ? Math.round(ws[0].start * 1000) : null,
    speechEndMs: ws.length ? Math.round(ws[ws.length - 1].end * 1000) : null,
    pauses,
    ...extra,
  };
}

/** Doğrulama parçalarının, verilen kelimelerden (yoksa ilk yazıya dökmeden) kesilmiş hâli. */
function clipWordsOf(clips: VerifyClip[], words: AsrWord[]): AsrWord[][] {
  return clips.map((c) =>
    words
      .filter((w) => (w.start + w.end) / 2 >= c.start && (w.start + w.end) / 2 <= c.end)
      .map((w) => ({ text: w.text, start: r3(w.start - c.start), end: r3(w.end - c.start) })),
  );
}

interface RunOpts {
  timing?: ReadingTiming;
  /** Doğrulama: true → parçalar ilk yazıya dökmenin aynısı; dizi → parçalar bu kelimelerden kesilir. */
  verify?: true | AsrWord[];
  paragraphs?: string[];
  duration?: number;
}

function run(words: AsrWord[], o: RunOpts = {}) {
  const al = alignWords(o.paragraphs ?? PASSAGE, words);
  const last = words.length ? words[words.length - 1].end : 0;
  const clips = planVerification(al, o.duration ?? last + 2);
  const clipWords = o.verify ? clipWordsOf(clips, o.verify === true ? al.words : o.verify) : null;
  const res = buildAutoMarks(al, clips, clipWords, o.timing ?? timingOf(words));
  return { al, clips, ...res };
}

const errorsOf = (m: Record<string, { s?: string; ins?: number }>) =>
  Object.entries(m)
    .filter(([, x]) => x.s === 'sub' || x.s === 'omit' || x.ins)
    .map(([k]) => Number(k));

describe('biçim birliği', () => {
  it('Türkçe küçük harf, kesme, noktalama, şapka ve kısaltmalar', () => {
    expect(normalizeWord('İSTANBUL’da')).toBe('istanbulda');
    expect(normalizeWord('IŞIK')).toBe('ışık');
    expect(normalizeWord('"Kâse,')).toBe('kase');
    expect(normalizeWord('rüzgâr.')).toBe('rüzgar');
    expect(normalizeWord('Dr.')).toBe('doktor');
    expect(normalizeWord('kü-tü-ğü')).toBe('kü tü ğü');
  });

  it('rakamlar Türkçe okunuşa çevrilir', () => {
    expect(normalizeWord('17')).toBe('on yedi');
    expect(normalizeWord("1967'de")).toBe('bin dokuz yüz altmış yedide');
    expect(normalizeWord('%20')).toBe('yüzde yirmi');
    expect(normalizeWord("40.000'in")).toBe('kırk binin');
    expect(normalizeWord('3,5')).toBe('üç virgül beş');
    expect(normalizeWord('1000')).toBe('bin');
    expect(normalizeWord('0')).toBe('sıfır');
  });

  it('ses katlaması: ğ, çift ünlü, ötümlü/ötümsüz çiftler', () => {
    expect(foldWord('kütüğüne')).toBe(foldWord('kütüne'));
    expect(foldWord('ağaç')).toBe(foldWord('aç'));
    expect(foldWord('baal')).toBe(foldWord('bal'));
    expect(foldWord('nispeten')).toBe(foldWord('nispeden'));
    expect(foldWord('yıllık')).not.toBe(foldWord('yıllar'));
    // İnce ünlüler arasındaki ğ, y gibi duyulur.
    expect(foldWord(normalizeWord("Yemli'yi"))).toBe(foldWord(normalizeWord('yemliği')));
    expect(foldWord('değil')).toBe(foldWord('deyil'));
    // Kalın ünlüler arasındaki y korunur: "ayı" ile "aı" aynı sayılmaz.
    expect(foldWord('ayı')).not.toBe(foldWord('aı'));
  });
});

describe('hizalama ve işaretler (yapay örnekler)', () => {
  it('doğru okuma: işaret yok, bütün kelimeler doğru', () => {
    const r = run(say(READ));
    expect(r.marks).toEqual({});
    expect(r.counts.correct).toBe(N);
    expect(r.al.ops.every((o) => o.kind === 'match')).toBe(true);
    expect(r.clips).toEqual([]);
  });

  it('konuşma tanımanın ğ ve ünlü karışıklıkları yakın sayılır (doğru)', () => {
    const r = run(say(READ.replace('ağaç', 'aç').replace('kütüğüne', 'kütüne').replace('Kütüğün', 'Kütün')));
    expect(r.marks).toEqual({});
    expect(r.al.ops.filter((o) => o.kind === 'near').map((o) => o.token)).toEqual([1, 2, 7]);
  });

  it('ek farkı: doğrulama yoksa unclear, doğrulama aynı kelimeyi duyarsa yanlış okuma (suffix)', () => {
    const ws = say(READ.replace('görürsün.', 'görürsünüz.'));
    expect(run(ws).marks).toEqual({ 12: { s: 'unclear' } });
    expect(run(ws, { verify: true }).marks).toEqual({ 12: { s: 'sub', said: 'görürsünüz', kind: 'suffix' } });
  });

  it('benzer kelime: doğrulama yoksa unclear, doğrulanırsa similar; tek harf farkı hiçbir zaman hata değil', () => {
    const ws = say(READ.replace('yakından', 'yokundan'));
    expect(run(ws).marks).toEqual({ 4: { s: 'unclear' } });
    expect(run(ws, { verify: true }).marks).toEqual({ 4: { s: 'sub', said: 'yokundan', kind: 'similar' } });
    const one = say(READ.replace('baktın', 'bakın'));
    expect(run(one).marks).toEqual({ 5: { s: 'unclear' } });
    expect(run(one, { verify: true }).marks).toEqual({ 5: { s: 'unclear' } });
  });

  it('farklı kelime: doğrulama olmadan da yanlış okuma; doğrulama doğru kelimeyi duyarsa unclear', () => {
    const ws = say(READ.replace('üstünde', 'üzerinde'));
    expect(run(ws).marks).toEqual({ 8: { s: 'sub', said: 'üzerinde' } });
    expect(run(ws, { verify: true }).marks).toEqual({ 8: { s: 'sub', said: 'üzerinde' } });
    expect(run(ws, { verify: say(READ) }).marks).toEqual({ 8: { s: 'unclear' } });
  });

  it('yanlış okumanın türü: harf yer değiştirmesi ve Türkçeye benzemeyen söyleyiş', () => {
    expect(run(say(READ.replace('nasıl', 'sanıl'))).marks[16]).toMatchObject({ s: 'sub', kind: 'reversal' });
    expect(run(say(READ.replace('yakından', 'ykndşrt'))).marks[4]).toMatchObject({ s: 'sub', said: 'ykndşrt', kind: 'nonword' });
  });

  it('atlama: boşluk ve konuşma sesi yoksa omit; arada konuşma sesi varsa unclear', () => {
    const ws = say(READ.replace('hiç ', ''));
    expect(run(ws).marks).toEqual({ 3: { s: 'omit' } });
    expect(run(ws, { verify: true }).marks).toEqual({ 3: { s: 'omit' } });
    // Doğrulama kelimeyi duyarsa unclear.
    expect(run(ws, { verify: say(READ) }).marks).toEqual({ 3: { s: 'unclear' } });
    // Kelimeler arasında 0,4 sn boşluk ama ses çözümlemesine göre orada konuşma var: tanıma kelimeyi kaçırmış olabilir.
    const gap = say(READ.replace('hiç ', '|0.4 '));
    const t = timingOf(gap);
    expect(run(gap, { timing: { ...t, pauses: [] } }).marks).toEqual({ 3: { s: 'unclear' } });
    expect(run(gap).marks).toEqual({ 3: { s: 'omit' } });
  });

  it('atlama: komşu kelime belirgin uzun sürerse (Whisper atladığı kelimeyi komşusuna katmış) unclear', () => {
    const ws = say(READ.replace('iç içe ', ''));
    expect(run(ws).marks).toEqual({ 9: { s: 'omit' }, 10: { s: 'omit' } });
    const k = ws.findIndex((w) => w.text === 'üstünde');
    const stretched = ws.map((w, j) => (j === k ? { ...w, start: r3(w.start - 0.9) } : j < k ? { ...w, start: r3(w.start - 0.9), end: r3(w.end - 0.9) } : w));
    expect(run(stretched).marks).toEqual({ 9: { s: 'unclear' }, 10: { s: 'unclear' } });
  });

  it('satır atlama: uzun atlama dizisi omit, gerisi doğru', () => {
    const ws = say(READ.replace('Bu halkalar, ağacın nasıl büyüdüğünü anlatır. ', ''));
    const r = run(ws);
    expect(r.marks).toEqual(Object.fromEntries([13, 14, 15, 16, 17, 18].map((t) => [t, { s: 'omit' }])));
    expect(r.counts).toMatchObject({ correct: N - 6, omit: 6, sub: 0, ins: 0 });
  });

  it('ekleme: önceki kelimeye ins; doğrulama kelimeyi duymazsa sayılmaz', () => {
    const ws = say(READ.replace('içe halkalar', 'içe güzel halkalar'));
    expect(run(ws).marks).toEqual({ 10: { ins: 1 } });
    expect(run(ws, { verify: true }).marks).toEqual({ 10: { ins: 1 } });
    expect(run(ws, { verify: say(READ) }).marks).toEqual({});
  });

  it('tekrar: aynı kelime ya da cümleyi baştan okuma rep (hata değil)', () => {
    expect(run(say(READ.replace('üstünde', 'üstünde üstünde'))).marks).toEqual({ 8: { rep: true } });
    expect(run(say(READ.replace('Kütüğün', 'Kütüğün,_kütüğün'))).marks).toEqual({ 7: { rep: true } });
    const restart = run(say(READ.replace('yakından', 'Bir ağaç kütüğüne hiç yakından')));
    expect(restart.marks).toEqual({ 0: { rep: true }, 1: { rep: true }, 2: { rep: true }, 3: { rep: true } });
    expect(restart.counts).toMatchObject({ rep: 4, ins: 0, correct: N });
    const back = run(say(READ.replace('ağacın nasıl', 'ağacın Bu halkalar ağacın nasıl')));
    expect(back.marks).toEqual({ 13: { rep: true }, 14: { rep: true }, 15: { rep: true } });
  });

  it('kendi düzeltmesi: yarım ya da benzer söyleyişin ardından doğru kelime self (hata değil)', () => {
    expect(run(say(READ.replace('yıllık', 'yıl yıllık'))).marks).toEqual({ 20: { s: 'self' } });
    const r = run(say(READ.replace('yıllık', 'yıllar yıllık')));
    expect(r.marks).toEqual({ 20: { s: 'self' } });
    expect(r.counts).toMatchObject({ self: 1, correct: N, ins: 0 });
  });

  it('duraksama: cümle içinde 1 sn ve üstü hes; cümle başında değil; ses çözümlemesiyle denetlenir', () => {
    const ws = say(READ.replace('içe halkalar', 'içe |1.5 halkalar').replace('mı? Kütüğün', 'mı? |1.5 Kütüğün'));
    expect(run(ws).marks).toEqual({ 11: { hes: true } });
    // Kelimeler arasında boşluk var ama ses çözümlemesi orada sessizlik bulmadı: duraksama yazılmaz.
    expect(run(ws, { timing: { ...timingOf(ws), pauses: [] } }).marks).toEqual({});
    // Ses çözümlemesi olmadan kelime süreleri yeter.
    expect(run(ws, { timing: { speechStartMs: null, speechEndMs: null, pauses: [] } }).marks).toEqual({ 11: { hes: true } });
    // Whisper sessizliği önceki kelimeye katmış (boşluk yok), ses çözümlemesi 1,2 sn sessizlik buldu.
    const k = ws.findIndex((w) => w.text === 'halkalar');
    const glued = ws.map((w, j) => (j === k - 1 ? { ...w, end: ws[k].start } : w));
    const t = timingOf(ws);
    expect(run(glued, { timing: t }).marks).toEqual({ 11: { hes: true } });
    // 0,8 sn duraksama yazılmaz.
    expect(run(say(READ.replace('içe halkalar', 'içe |0.8 halkalar'))).marks).toEqual({});
  });

  it('hece hece okuma: heceler birleşince kelimeyse doğru + syl; bozuksa unclear + syl', () => {
    const syl = say(READ.replace('kütüğüne', 'kü, |0.2 tü, |0.2 ğü, |0.2 ne'));
    const r = run(syl);
    expect(r.marks).toEqual({ 2: { syl: true } });
    expect(r.al.ops.find((o) => o.token === 2)?.words).toHaveLength(4);
    expect(run(say(READ.replace('halkalar görürsün', 'hal-ka-lar görürsün'))).marks).toEqual({ 11: { syl: true } });
    const bad = run(say(READ.replace('kütüğüne', 'kü, |0.2 tıh, |0.2 bıh, |0.2 ne')));
    expect(bad.marks).toEqual({ 2: { s: 'unclear', syl: true } });
    // "Kovan da" gibi bölme hece okuması değildir.
    const kovan = run(say('Bir kovan da binlerce arı yaşar.'), { paragraphs: ['Bir kovanda binlerce arı yaşar.'] });
    expect(kovan.marks).toEqual({});
  });

  it('sayılar: rakamla yazılan sayı metindeki okunuşla eşleşir (ve tersi)', () => {
    const p1 = ['Kazada on yedi kişi yaralandı.'];
    expect(run(say('Kazada 17 kişi yaralandı.'), { paragraphs: p1 }).marks).toEqual({});
    const p2 = ["Köprü 1967'de açıldı."];
    expect(run(say('Köprü bin dokuz yüz altmış yedide açıldı.'), { paragraphs: p2 }).marks).toEqual({});
    expect(run(say("Köprü 1967'de açıldı."), { paragraphs: ['Köprü bin dokuz yüz altmış yedide açıldı.'] }).marks).toEqual({});
  });

  it('bölme ve birleştirme: kovan + da tek işlem iki kelime; iççe iki işlem aynı kelime; kesmeyle bölünen ek birleşir', () => {
    const p = ['Bir kovanda binlerce arı yaşar.'];
    const a = run(say('Bir kovan da binlerce arı yaşar.'), { paragraphs: p });
    expect(a.al.ops[1]).toEqual({ kind: 'match', token: 1, words: [1, 2] });
    const b = run(say(READ.replace('iç içe', 'iççe')));
    expect(b.marks).toEqual({});
    const ops = b.al.ops.filter((o) => o.token === 9 || o.token === 10);
    expect(ops.map((o) => o.kind)).toEqual(['near', 'near']);
    expect(ops[0].words).toEqual(ops[1].words);
    expect(ops[0].words).toHaveLength(1);
    const c = run(say("Bal kovan 'a taşınır."), { paragraphs: ["Bal kovana taşınır."] });
    expect(c.marks).toEqual({});
    expect(c.al.words.map((w) => w.text)).toEqual(['Bal', "kovan'a", 'taşınır.']);
    // Bitişi bilinmeyen kelime (Whisper bazen null verir) atılmaz.
    const ws = say(READ);
    ws[3] = { ...ws[3], end: null as unknown as number };
    expect(run(ws).marks).toEqual({});
  });

  it('uydurma ve sessizlik koruması', () => {
    const ws = [...say(READ), ...say('Altyazı M.K. [Müzik] Abone olmayı unutmayın.', 12)];
    const r = run(ws, { timing: timingOf(say(READ)) });
    expect(r.marks).toEqual({});
    expect(r.al.words).toHaveLength(N);
    // Uzun sessizliğin içinde metinle ilgisiz bir kelime: yok sayılır; konuşma sesinin içindeyse ekleme.
    const mid = say(READ.replace('içe halkalar', 'içe |0.9 elma |0.9 halkalar'));
    const silent = timingOf(say(READ.replace('içe halkalar', 'içe |2.2 halkalar')));
    expect(run(mid, { timing: silent }).marks).toEqual({ 11: { hes: true } });
    expect(run(mid).marks).toEqual({ 10: { ins: 1 } });
    // Okumanın öncesindeki ve sonrasındaki sözler (mikrofon denemesi, "bitti") ekleme sayılmaz.
    expect(run(say('Tamam başlıyorum ' + READ + ' bitti')).marks).toEqual({});
  });

  it('okumayı erken bırakma: sonrasında konuşma yoksa kalan kelimeler omit, varsa unclear', () => {
    const ws = say('Bir ağaç kütüğüne hiç yakından baktın mı? Kütüğün üstünde iç içe halkalar');
    const r = run(ws);
    expect(Object.keys(r.marks).map(Number)).toEqual([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
    expect(Object.values(r.marks).every((m) => m.s === 'omit')).toBe(true);
    const t = timingOf(ws);
    const spoken = run(ws, { timing: { ...t, speechEndMs: (t.speechEndMs ?? 0) + 3000 } });
    expect(Object.values(spoken.marks).every((m) => m.s === 'unclear')).toBe(true);
    expect(spoken.counts).toMatchObject({ unclear: 11, omit: 0 });
  });

  it('hiçbir kelime tanınmadıysa her kelime unclear; okuma süresi ses çözümlemesinden', () => {
    const r = run([], { timing: { speechStartMs: 400, speechEndMs: 9000, pauses: [] } });
    expect(r.counts).toMatchObject({ unclear: N, correct: 0, sub: 0, omit: 0 });
    expect([r.readingStartMs, r.readingEndMs]).toEqual([400, 9000]);
  });

  it('okuma süresi ilk ve son tanınan metin kelimesinden', () => {
    const ws = say('Merhaba ' + READ + ' tamam', 1);
    const r = run(ws);
    expect(r.readingStartMs).toBe(1400);
    expect(r.readingEndMs).toBe(Math.round(ws[ws.length - 2].end * 1000));
  });
});

describe('doğrulama planı', () => {
  it('parçalar iki yandan 0,6 sn pay alır, yakınlar birleşir, kaydın içinde kalır', () => {
    const ws = say(READ.replace('Bir', 'Biz').replace('ağaç', 'avuç').replace('denir.', 'deniz.'));
    const al = alignWords(PASSAGE, ws);
    const clips = planVerification(al, ws[ws.length - 1].end + 0.2);
    expect(clips[0].start).toBe(0);
    expect(clips[0].tokens).toEqual([0, 1]);
    const last = clips[clips.length - 1];
    expect(last.end).toBeCloseTo(ws[ws.length - 1].end + 0.2, 5);
    expect(last.tokens).toEqual([22]);
    for (const c of clips) expect(c.end).toBeGreaterThan(c.start);
  });

  it('toplam süre sınırı aşılmaz; önce doğrulanmadan hata sayılacak adaylar alınır', () => {
    // Her ikinci kelime metinle ilgisiz: 11 aday yanlış okuma, aralarında 1 sn.
    const words = READ.split(' ').map((w, k) => (k % 2 ? 'xq' + 'abcdefghjkm'[(k - 1) / 2] : w));
    const ws = say(words.join(' |1 '));
    const al = alignWords(PASSAGE, ws);
    const clips = planVerification(al, 60, 5);
    const total = clips.reduce((n, c) => n + c.end - c.start, 0);
    expect(total).toBeLessThanOrEqual(5);
    expect(clips.length).toBeGreaterThan(0);
    // Parçaya düşmeyen adaylarda temkinli kurallar uygulanır.
    const r = buildAutoMarks(al, clips, clipWordsOf(clips, al.words), timingOf(ws));
    expect(r.counts.sub + r.counts.unclear).toBe(11);
  });
});

describe('hız', () => {
  it('en uzun metin (≈215 kelime) ve 400 tanınan kelime hızlı hizalanır', () => {
    const longest = [...sesliOkuma.passages].sort(
      (a, b) => oralTokens(b.paragraphs).flat().length - oralTokens(a.paragraphs).flat().length,
    )[0];
    const toks = oralTokens(longest.paragraphs).flat().map((t) => t.text);
    // Okuma: bazı kelimeler değişik, bir cümle baştan, bir satır atlanmış; 400 kelimeye kadar tekrarlarla doldurulmuş.
    const spoken = [...toks.slice(0, 120), ...toks.slice(100, 130), ...toks.slice(140)].map((w, k) => (k % 17 === 0 ? w + 'ler' : w));
    while (spoken.length < 400) spoken.push(toks[spoken.length % toks.length]);
    const ws = say(spoken.join(' '));
    const t0 = performance.now();
    const al = alignWords(longest.paragraphs, ws);
    const clips = planVerification(al, ws[ws.length - 1].end + 1);
    const r = buildAutoMarks(al, clips, clipWordsOf(clips, al.words), timingOf(ws));
    const ms = performance.now() - t0;
    expect(r.counts.correct + r.counts.sub + r.counts.omit + r.counts.unclear).toBe(toks.length);
    expect(ms).toBeLessThan(1000);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Gerçek konuşma tanıma çıktıları

interface MisCase {
  id: string;
  passage: number;
  duration: number;
  spoken: string;
  edits: { type: string; passage?: string; spoken?: string; note?: string; before?: string }[];
  timing: ReadingTiming;
  words: [string, number, number][];
}
interface FleursItem {
  ref: string;
  duration: number;
  timing: ReadingTiming;
  words: [string, number, number][];
}

const FIX = path.join(import.meta.dirname, 'fixtures');
const mis = JSON.parse(fs.readFileSync(path.join(FIX, 'sesli-okuma-whisper-hatalar.json'), 'utf8')) as {
  passages: string[];
  cases: MisCase[];
};
const fleurs = JSON.parse(fs.readFileSync(path.join(FIX, 'sesli-okuma-whisper-fleurs.json'), 'utf8')) as {
  items: FleursItem[];
};
const asWords = (ws: [string, number, number][]): AsrWord[] => ws.map(([text, start, end]) => ({ text, start, end }));

function runReal(paragraphs: string[], words: AsrWord[], duration: number, timing: ReadingTiming, verify: boolean) {
  const al: WordAlignment = alignWords(paragraphs, words);
  const clips = planVerification(al, duration);
  return { al, clips, ...buildAutoMarks(al, clips, verify ? clipWordsOf(clips, al.words) : null, timing) };
}

/** Manifestteki bilinçli hatalar: hata olması gereken kelimeler ve eklemelerin bağlandığı kelimeler. */
function intended(c: MisCase) {
  const passage = mis.passages[c.passage];
  const norms = alignWords([passage], []).tokens.map((t) => t.norm);
  const err = new Map<number, 'sub' | 'omit'>();
  for (const e of c.edits) {
    if (e.type !== 'sub' && e.type !== 'del') continue;
    const t = norms.indexOf(normalizeWord(e.passage!));
    expect(t, e.passage).toBeGreaterThanOrEqual(0);
    expect(norms.lastIndexOf(normalizeWord(e.passage!))).toBe(t);
    err.set(t, e.type === 'sub' ? 'sub' : 'omit');
  }
  // Eklemelerin yeri: okunan metin (yapay ses metni) ile hizalanarak.
  const spoken = c.spoken
    .replace(/\[\[[^\]]*\]\]/g, ' ')
    .split(/\s+/)
    .filter((x) => /[\p{L}\p{N}]/u.test(x));
  const al = alignWords([passage], spoken.map((text, k) => ({ text, start: k * 0.4, end: k * 0.4 + 0.35 })));
  const ins = new Map<number, number>();
  let last = -1;
  for (const op of al.ops) {
    if (op.token !== undefined) {
      last = op.token;
      continue;
    }
    const w = normalizeWord(al.words[op.words![0]].text);
    if (c.edits.some((e) => e.type === 'ins' && !e.note && normalizeWord(e.spoken!) === w)) ins.set(last, (ins.get(last) ?? 0) + 1);
  }
  return { err, ins };
}

interface Score {
  tp: number;
  fp: number;
  fn: number;
  correctWords: number;
  falseOnCorrect: number;
  unclear: number;
  tokens: number;
}

function scoreCase(c: MisCase, verify: boolean, sc: Score) {
  const r = runReal([mis.passages[c.passage]], asWords(c.words), c.duration, c.timing, verify);
  const { err, ins } = intended(c);
  const n = r.al.tokens.length;
  sc.tokens += n;
  for (let t = 0; t < n; t++) {
    const m = r.marks[String(t)] ?? {};
    const pred = m.s === 'sub' || m.s === 'omit';
    if (m.s === 'unclear') sc.unclear++;
    if (!err.has(t)) sc.correctWords++;
    if (pred && err.has(t)) sc.tp++;
    else if (pred) {
      sc.fp++;
      sc.falseOnCorrect++;
    } else if (err.has(t)) sc.fn++;
  }
  // Eklemeler: aynı yerde ya da en çok iki kelime ötede.
  const pred = new Map<number, number>();
  for (let t = 0; t < n; t++) if (r.marks[String(t)]?.ins) pred.set(t, r.marks[String(t)].ins!);
  for (const d of [0, -1, 1, -2, 2]) {
    for (const [t, k] of [...pred]) {
      const e = ins.get(t + d) ?? 0;
      const v = Math.min(k, e);
      if (!v) continue;
      sc.tp += v;
      pred.set(t, k - v);
      ins.set(t + d, e - v);
    }
  }
  for (const v of pred.values()) {
    sc.fp += v;
    sc.falseOnCorrect += v;
  }
  for (const v of ins.values()) sc.fn += v;
  return r;
}

const emptyScore = (): Score => ({ tp: 0, fp: 0, fn: 0, correctWords: 0, falseOnCorrect: 0, unclear: 0, tokens: 0 });

describe('Whisper small çıktıları: bilerek hatalı okunmuş kayıtlar', () => {
  const byId = (id: string) => mis.cases.find((c) => c.id === id)!;
  const marksOf = (id: string, verify = false) => {
    const c = byId(id);
    const r = runReal([mis.passages[c.passage]], asWords(c.words), c.duration, c.timing, verify);
    return { r, at: (w: string) => r.marks[String(r.al.tokens.findIndex((t) => t.norm === normalizeWord(w)))] };
  };

  it('22 kayıt yüklü', () => {
    expect(mis.cases).toHaveLength(22);
  });

  // Ölçüm (2026-10-08): doğrulamasız isabet 23/24, yakalama 23/36, doğru kelimeye hata %0,14;
  // doğrulama ilk yazıya dökmenin aynısını söylerse isabet 34/37, yakalama 34/36, doğru kelimeye hata %0,43.
  it('doğrulama olmadan: hata dediği neredeyse hep hata, doğru kelimeye hata yazılmıyor', () => {
    const sc = emptyScore();
    for (const c of mis.cases) scoreCase(c, false, sc);
    expect(sc.tp / (sc.tp + sc.fp)).toBeGreaterThanOrEqual(0.9);
    expect(sc.tp / (sc.tp + sc.fn)).toBeGreaterThanOrEqual(0.55);
    expect(sc.falseOnCorrect / sc.correctWords).toBeLessThan(0.01);
  });

  it('doğrulama ilk yazıya dökmeyle aynı sonucu verse bile (en kötü durum) isabet yüksek', () => {
    const sc = emptyScore();
    for (const c of mis.cases) scoreCase(c, true, sc);
    expect(sc.tp / (sc.tp + sc.fp)).toBeGreaterThanOrEqual(0.85);
    expect(sc.tp / (sc.tp + sc.fn)).toBeGreaterThanOrEqual(0.85);
    expect(sc.falseOnCorrect / sc.correctWords).toBeLessThan(0.01);
  });

  it('doğru okunan uzun metinde doğrulamasız hiç hata yok', () => {
    for (const id of ['c8_long_exact_adult', 'c8_long_exact_child', 'c10_trailing_silence_adult', 'c10_trailing_silence_child']) {
      const { r } = marksOf(id);
      expect(errorsOf(r.marks), id).toEqual([]);
      expect(r.counts.unclear, id).toBeLessThanOrEqual(2);
    }
  });

  it('tekrar ve yarım bırakılıp düzeltilen kelime hata değil', () => {
    for (const v of ['adult', 'child']) {
      const { r, at } = marksOf('c5_repetition_' + v);
      expect(errorsOf(r.marks)).toEqual([]);
      expect(at('üstünde')).toMatchObject({ rep: true });
      expect(at('ağacın')).toMatchObject({ rep: true });
      expect(at('yıllık')).toMatchObject({ s: 'self' });
    }
    const { at } = marksOf('c7_long_mixed_adult');
    expect(at('Kovanın')).toMatchObject({ rep: true });
  });

  it('cümle içindeki uzun duraklamalar hes', () => {
    for (const v of ['adult', 'child']) {
      const { r } = marksOf('c6_long_pause_' + v);
      const hes = Object.entries(r.marks)
        .filter(([, m]) => m.hes)
        .map(([k]) => r.al.tokens[+k].text);
      expect(hes).toEqual(['halkalar', 'büyüdüğünü', 'denir.']);
      expect(errorsOf(r.marks)).toEqual([]);
    }
    const { at } = marksOf('c7_long_mixed_child');
    expect(at('polenleri')).toMatchObject({ hes: true });
  });

  it('hece hece okunan kelimeler hata değil, syl alır', () => {
    for (const v of ['adult', 'child']) {
      const { r, at } = marksOf('c9_syllables_' + v);
      expect(errorsOf(r.marks)).toEqual([]);
      expect(at('kütüğüne')).toMatchObject({ syl: true });
      expect(at('halkalar')).toMatchObject({ syl: true });
    }
  });

  it('eklemeler ve atlamalar bulunur', () => {
    for (const v of ['adult', 'child']) {
      const ins = marksOf('c4_insertion_' + v);
      expect(ins.r.counts.ins).toBe(3);
      expect(ins.at('büyüdüğünü')).toMatchObject({ ins: 1 });
      const om = marksOf('c3_omission_' + v);
      for (const w of ['hiç', 'iç', 'içe', 'nasıl']) expect(om.at(w), w).toMatchObject({ s: 'omit' });
    }
  });

  it('ses yoksa (yalnızca gürültü) hiçbir kelimeye hata yazılmaz', () => {
    const { r } = marksOf('c11_noise_only_adult');
    expect(r.counts).toMatchObject({ sub: 0, omit: 0, ins: 0, unclear: r.al.tokens.length });
  });
});

describe('Whisper small çıktıları: doğru okunmuş FLEURS cümleleri', () => {
  // Ölçüm (2026-10-08, 1181 kelime): doğrulamasız %1,6 hata (çoğu yabancı özel ad), %10 unclear; doğrulama ilk yazıya
  // dökmenin aynısını söylerse %4,9 hata.
  function rate(verify: boolean) {
    let tokens = 0;
    let errors = 0;
    let flags = 0;
    for (const it of fleurs.items) {
      const r = runReal([it.ref], asWords(it.words), it.duration, it.timing, verify);
      tokens += r.al.tokens.length;
      errors += r.counts.sub + r.counts.omit + r.counts.ins;
      flags += r.counts.hes + r.counts.rep + r.counts.self;
    }
    return { tokens, errors: errors / tokens, flags };
  }

  it('doğrulama olmadan doğru okunan kelimelerin %3\'ünden azına hata yazılır', () => {
    const r = rate(false);
    expect(r.tokens).toBeGreaterThan(1100);
    expect(r.errors).toBeLessThan(0.03);
    expect(r.flags).toBe(0);
  });

  it('doğrulama ilk yazıya dökmenin aynısını söylese bile %6\'dan azı', () => {
    expect(rate(true).errors).toBeLessThan(0.06);
  });
});
