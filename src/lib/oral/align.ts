/**
 * Sesli okumada otomatik işaretleme: cihazdaki konuşma tanımanın (Whisper) yazıya döktüğü kelimeler okunan metinle
 * karşılaştırılır ve dikkatli bir okuma öğretmeninin koyacağı kelime işaretlerine çevrilir. Konuşma tanıma metni
 * bilmeden çalışır ve doğru okunan kelimelerin yaklaşık %9'unu farklı yazar (ekleri karıştırır, yumuşak g'yi düşürür,
 * kelimeleri böler ya da birleştirir, sayıları rakamla yazar). Bu yüzden temel ilke: konuşma tanımanın kendi yanlışı
 * olabilecek hiçbir şey öğrenciye hata diye yazılmaz. Emin olunamayan kelime `unclear` olur (hata sayılmaz, ayrıca
 * gösterilir). Hatada isabet, bütün hataları yakalamaktan önemlidir.
 *
 * 1. Biçim birliği
 *    - normalizeWord: NFC, Türkçe küçük harf (I → ı, İ → i), â/î/û ve yabancı aksanlar düz harfe, kesme işareti silinir
 *      (Ali'nin → alinin), öteki noktalama boşluk olur, okunuşu belli kısaltmalar açılır (Dr. → doktor). Rakamlar
 *      Türkçe okunuşuna çevrilir (17 → on yedi, 1967'de → bin dokuz yüz altmış yedide, %20 → yüzde yirmi); sonuç bu
 *      yüzden birden çok kelime olabilir.
 *    - Ses katlaması (foldWord): ğ düşer, yan yana aynı ünlüler teke iner, ötümlü/ötümsüz çiftler (b/p, c/ç, d/t, g/k)
 *      bir sayılır. Katlanmış hâlleri aynı iki kelime "yakın"dır (kütüne ≈ kütüğüne, aç ≈ ağaç, baal ≈ bal) ve kelime
 *      doğru okunmuş sayılır. Benzerlik: katlanmış hâllerin düzenleme uzaklığından (1 − uzaklık / uzun olanın boyu).
 *    - Konuşma tanımanın çıktısı önce temizlenir: kesme ya da tireyle başlayan parça önceki kelimeye eklenir
 *      (Luna + 'ya); köşeli ayraç ya da parantez içindeki notlar ([Müzik]), harfsiz parçalar (...) ve bilinen uydurma
 *      kalıplar ("abone olmayı unutmayın", "altyazı", "izlediğiniz için teşekkürler"; metinde geçmiyorsa) atılır.
 *      Rakamlar ve tireyle bölünmüş heceler ayrı kelimelere ayrılır (süre harf sayısına göre paylaştırılır).
 *      `WordAlignment.words` bu temizlenmiş listedir; işlemlerdeki kelime sıraları ona göredir.
 *
 * 2. Hizalama (alignWords): metin kelimeleri ile tanınan kelimeler arasında, toplam maliyeti en küçük olan bütünsel
 *    hizalama (dinamik programlama). Aynı kelime 0, yakın kelime 0,05, farklı kelime 0,3 + 1,4 × (1 − benzerlik),
 *    atlama 1, ekleme 1 (okumanın başındaki ve sonundaki fazla sözler 0,4). Whisper'ın bölme ve birleştirmeleri için
 *    2–3 tanınan kelime tek metin kelimesiyle (kovan + da → kovanda; hecelerde 6'ya kadar: hal, ka, lar → halkalar) ve
 *    2–3 metin kelimesi tek tanınan kelimeyle (iç içe → iççe) eşleştirilebilir: birleşik hâl en az %60 benzer
 *    olmalıdır, maliyeti her fazla parça için 0,15 ve her harf farkı için 0,5'tir (bütün bir kelimeyi yutan
 *    birleştirme, atlama ya da eklemeden pahalıya gelir); tek harf farkı kelime sınırında konuşma tanımaya özgüdür
 *    ve yakın sayılır (iççe ≈ iç içe). Satır atlama uzun bir atlama dizisi, cümleyi baştan okuma bir ekleme dizisi
 *    olarak çıkar; aşağıdaki kurallar bunları ayırt eder.
 *    İşlemler (`ops`) okuma sırasıyladır:
 *    - match / near / sub: `token` bir metin kelimesi, `words` ona düşen tanınan kelimeler. Whisper kelimeyi
 *      bölmüşse `words` birden çok öğe taşır (kovan + da). Whisper iki metin kelimesini tek kelime yazmışsa
 *      (iç içe → iççe), her metin kelimesi kendi işlemini alır ve bu işlemlerin hepsi aynı tek kelimeyi gösterir.
 *    - omit: `token` okunmamış görünen metin kelimesi (`words` yok). ins: `words` tek bir fazla tanınan kelime.
 *
 * 3. İşaretler (buildAutoMarks)
 *    - Aynı ya da yakın kelime: doğru. Tek harften fazla farklı bölme/birleştirme: `unclear`.
 *    - Farklı kelime: aday yanlış okuma; `said` tanınan kelime (en çok 40 harf), `kind`: kök aynı ve yalnızca sonu
 *      farklıysa (ortak baş en az 4 harf ya da kısa kelimede %70) `suffix`, benzerlik ≥ 0,6 ise `similar`, harfleri
 *      aynı ama sırası farklıysa `reversal`, Türkçe kelimeye benzemiyorsa (ünlüsüz, q/w/x, dört ünsüz yan yana)
 *      `nonword`; hiçbiri değilse boş. Katlanmış hâlleri tek harf farklı yanlış okumalar (bakın ↔ baktın) konuşma
 *      tanımanın sık yaptığı yanlışlardır: doğrulama aynı şeyi duysa da `unclear` kalır.
 *    - Okunmamış görünen kelime: aday atlama. Fazla tanınan kelime: önceki ya da sonraki metin kelimeleriyle aynıysa
 *      tekrar (`rep`, hata değil; cümleyi baştan okuma da böyle bulunur); doğru kelimeden hemen önce gelen yarım ya
 *      da benzer bir söyleyişse öğrencinin kendi düzeltmesi (`self`, hata değil); hece okumasının parçasıysa ya da
 *      okumanın öncesinde/sonrasındaysa (ör. "bitti") yok sayılır; yoksa aday ekleme (`ins`, önceki kelimeye).
 *      Yanlış tanınan bir kelimenin hemen yanındaki fazla kelime o tanıma yanlışının parçası olabilir: doğrulanmazsa
 *      sayılmaz.
 *    - Doğrulama (planVerification + clipWords): her aday hata bölgesi kısa bir parça olarak (iki yandan ~0,6 sn
 *      payla; yakın parçalar birleşir; toplam en çok 50 sn, önce doğrulanmadan hata sayılacak adaylar) yeniden yazıya
 *      dökülür ve parçanın kelimeleri metnin o bölümüyle yeniden hizalanır. Aday ancak parça aynı şeyi söylerse hata
 *      olur: yanlış okumada katlanmış hâli aynı kelime, atlamada kelime yine yok, eklemede kelime yine var. Parça
 *      farklı söylerse (ör. doğru kelimeyi duyarsa) kelime `unclear` olur; ekleme sayılmaz.
 *    - Doğrulama yapılamazsa (clipWords null ya da aday bir parçaya düşmedi) temkinli kurallar: ek farkı ya da çok
 *      benzer yanlış okuma `unclear`; arasında konuşma sesi bulunan atlama `unclear`; konuşma sesi olmayan 3 ve daha
 *      uzun atlama dizisi `omit`; 1–2 kelimelik atlama, komşu kelimeler kendi boylarından belirgin uzun sürmüyorsa
 *      (Whisper atladığı kelimeyi komşusuna katar) `omit`, sürüyorsa `unclear`. Konuşma süreleri bilinmiyorsa
 *      kelimeler arasında 0,3 sn'den uzun boşluk konuşma sayılır.
 *    - Sessizlik ve uydurma koruması: konuşma bölgesinin dışında ya da sessizliğin içinde kalan tanınan kelimeler
 *      (metindeki bir kelimeyle aynı değilse) yok sayılır; bunlara dayanan yanlış okuma `unclear` olur.
 *    - Duraksama (`hes`): kelimeden hemen önce en az 1000 ms boşluk varsa ve önceki kelime cümle sonu (. ! ? : ;)
 *      değilse; kelime süreleriyle ölçülür, ses çözümlemesindeki sessizliklerle denetlenir (boşlukta en az 250 ms
 *      sessizlik olmalı; Whisper sessizliği önceki kelimeye katmışsa, önceki kelimenin başından bu kelimenin başına
 *      kadar en az 1000 ms'lik bir sessizlik yeter). Ses çözümlemesi yoksa kelime süreleri yeter.
 *    - Hece hece okuma (`syl`): tanınan kelimeler virgül ya da tireyle ayrılmış (ya da kısa duraklarla gelen) kısa
 *      heceler olarak gelmişse ("kü, tü, ğü") ve birleşince metin kelimesine en az %75 benziyorsa kelime doğrudur ve
 *      `syl` alır; heceler tanınamayacak kadar bozuksa `unclear` + `syl`.
 *    - Okumanın sonu: son tanınan metin kelimesinden sonrası okunmamışsa, sonrasında konuşma sesi yoksa `omit`; varsa,
 *      ses süreleri bilinmiyorsa ya da sondaki fazla kelimeler kalan metne benziyorsa `unclear`. Okumanın başı için de
 *      aynısı. Hiçbir kelime tanınmadıysa bütün kelimeler `unclear` olur (analiz sonuç vermedi).
 *    - readingStartMs / readingEndMs: ilk ve son tanınan metin kelimesi; yoksa ses çözümlemesinin konuşma başı ve sonu.
 *
 * Ölçüm (2026-10-08, tests/sesli-okuma-hizalama.test.ts): Whisper small'ın bilerek hatalı okunmuş 22 kayıttaki
 * çıktısında doğrulamasız isabet %96, yakalama %64; doğrulama ilk yazıya dökmeyle aynı sonucu verse bile isabet %92,
 * yakalama %94. Doğru okunmuş 1181 FLEURS kelimesinde hata yazılan kelime doğrulamasız %1,6, en kötü doğrulamayla %4,9.
 */

import type { AsrWord } from './auto';
import type { OralMark, OralSubKind } from '@/lib/scoring/oral';
import { oralTokens } from './words';

/** Metin kelimesi: `i` oralTokens sırası, `text` ekrandaki hâli, `norm` normalizeWord sonucu (boşluk içerebilir). */
export interface TimedToken {
  i: number;
  text: string;
  norm: string;
}

export type AlignKind = 'match' | 'near' | 'sub' | 'omit' | 'ins';

/**
 * Hizalama işlemi. `token`: metin kelimesinin sırası (`ins`'te yok). `words`: `WordAlignment.words` içindeki sıralar
 * (`omit`'te yok). Whisper bir kelimeyi bölmüşse tek işlem birden çok kelime taşır; iki metin kelimesini tek kelime
 * yazmışsa ardışık işlemler aynı kelimeyi gösterir.
 */
export interface AlignOp {
  kind: AlignKind;
  token?: number;
  words?: number[];
}

export interface WordAlignment {
  tokens: TimedToken[];
  /** Temizlenmiş tanınan kelimeler (bkz. dosya başı); süreler kaydın başından itibaren saniye. */
  words: AsrWord[];
  ops: AlignOp[];
}

/** Yeniden yazıya dökülecek parça: kaydın içinde saniye; kapsadığı (aday) metin kelimeleri. */
export interface VerifyClip {
  start: number;
  end: number;
  tokens: number[];
}

/** Ses çözümlemesinden okuma süreleri: hepsi kaydın başından itibaren ms (duraklamalar da mutlak). */
export interface ReadingTiming {
  speechStartMs: number | null;
  speechEndMs: number | null;
  pauses: [number, number][];
}

export interface AutoMarks {
  /** Yalnızca işaretli kelimeler; anahtar metin kelimesinin sırası. */
  marks: Record<string, OralMark>;
  unclear: number;
  readingStartMs: number;
  readingEndMs: number;
  /** correct: yanlış okunmamış, atlanmamış ve `unclear` olmayan kelimeler (`self` doğru sayılır). */
  counts: { correct: number; sub: number; omit: number; ins: number; rep: number; self: number; hes: number; unclear: number };
}

// ---------------------------------------------------------------------------------------------------------------
// Biçim birliği

const ONES = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const SCALES = ['', 'bin', 'milyon', 'milyar', 'trilyon'];

function under1000(n: number): string[] {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  const out: string[] = [];
  if (h) out.push(...(h === 1 ? ['yüz'] : [ONES[h], 'yüz']));
  if (t) out.push(TENS[t]);
  if (o) out.push(ONES[o]);
  return out;
}

/** Rakamla yazılmış tam sayının Türkçe okunuşu (17 → "on yedi"). */
export function numberToTurkish(digits: string): string {
  const s = digits.replace(/^0+(?=\d)/, '');
  if (s.length > 15) return s.split('').map((d) => (d === '0' ? 'sıfır' : ONES[Number(d)])).join(' ');
  let n = Number(s);
  if (n === 0) return 'sıfır';
  const parts: string[] = [];
  for (let i = 0; n > 0 && i < SCALES.length; i++) {
    const g = n % 1000;
    if (g) parts.unshift(i === 1 && g === 1 ? 'bin' : [...under1000(g), SCALES[i]].filter(Boolean).join(' '));
    n = Math.floor(n / 1000);
  }
  return parts.join(' ');
}

function expandNumbers(s: string): string {
  s = s.replace(/%\s?(\d)/g, 'yüzde $1');
  s = s.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2').replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2');
  s = s.replace(/(\d),(\d)/g, '$1 virgül $2');
  s = s.replace(/(\d+)\s*['’]\s*(\p{L}+)/gu, (_, d: string, suf: string) => numberToTurkish(d) + suf);
  return s.replace(/\d+/g, (d) => ' ' + numberToTurkish(d) + ' ');
}

/** Okunuşu belli kısaltmalar (Dr. → doktor). */
const ABBREVIATIONS: Record<string, string> = {
  dr: 'doktor',
  prof: 'profesör',
  doç: 'doçent',
  vb: 've benzeri',
  vs: 'vesaire',
  örn: 'örneğin',
  bkz: 'bakınız',
};

/** Karşılaştırma için kelime biçimi (bkz. dosya başı). Rakamlar okunuşa döndüğünden sonuç birden çok kelime olabilir. */
export function normalizeWord(s: string): string {
  let t = s.normalize('NFC');
  if (/\d/.test(t)) t = expandNumbers(t);
  t = t.toLocaleLowerCase('tr-TR');
  t = t
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõ]/g, 'o')
    .replace(/[ùúû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/\u0307/g, '');
  t = t.replace(/['’‘`´ʼ]/g, '');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return t
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ABBREVIATIONS[w] ?? w)
    .join(' ');
}

const VOWELS = 'aeıioöuü';
const FRONT = 'eiöü';

/** k'nin solundaki (yön -1) ya da sağındaki (+1) ilk ğ olmayan harf; yoksa boş. */
function neighbour(norm: string, k: number, dir: -1 | 1): string {
  for (let j = k + dir; j >= 0 && j < norm.length; j += dir) {
    if (norm[j] !== 'ğ') return norm[j] === ' ' ? '' : norm[j];
  }
  return '';
}
const VOICE: Record<string, string> = { b: 'p', c: 'ç', d: 't', g: 'k' };

/** Ses katlaması: ğ düşer, yan yana aynı ünlüler teke iner, b/p, c/ç, d/t, g/k bir sayılır; boşluklar atılır. */
export function foldWord(norm: string): string {
  let out = '';
  let last = '';
  for (let k = 0; k < norm.length; k++) {
    let c = norm[k];
    if (c === 'ğ' || c === ' ') continue;
    // İki ince ünlü arasındaki ğ, konuşmada y gibi duyulur ("yemliği" ~ "yemliyi"); konuşma tanıma da y yazabilir.
    // Bu y de ğ gibi düşürülür.
    if (c === 'y' && FRONT.includes(neighbour(norm, k, -1)) && FRONT.includes(neighbour(norm, k, 1))) continue;
    c = VOICE[c] ?? c;
    if (c === last && VOWELS.includes(c)) continue;
    out += c;
    last = c;
  }
  return out;
}

let levBuf = new Int32Array(128);

function lev(a: string, b: string): number {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  if (levBuf.length < 2 * (lb + 1)) levBuf = new Int32Array(2 * (lb + 1));
  const d = levBuf;
  let prev = 0;
  let cur = lb + 1;
  for (let j = 0; j <= lb; j++) d[j] = j;
  for (let i = 1; i <= la; i++) {
    d[cur] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= lb; j++) {
      const s = d[prev + j - 1] + (ca === b.charCodeAt(j - 1) ? 0 : 1);
      const del = d[prev + j] + 1;
      const ins = d[cur + j - 1] + 1;
      d[cur + j] = s < del ? (s < ins ? s : ins) : del < ins ? del : ins;
    }
    const t = prev;
    prev = cur;
    cur = t;
  }
  return d[prev + lb];
}

/** İki (katlanmış) kelimenin benzerliği: 1 − düzenleme uzaklığı / uzun olanın boyu. */
export function similarity(a: string, b: string): number {
  const m = Math.max(a.length, b.length);
  return m === 0 ? 1 : 1 - lev(a, b) / m;
}

/** Hızlı düzenleme uzaklığı için önceden hazırlanmış kelime (Myers'in bit paralel yöntemi, en çok 31 harf). */
interface Pat {
  s: string;
  peq: Map<number, number>;
}

function pattern(s: string): Pat {
  const peq = new Map<number, number>();
  if (s.length <= 31) for (let i = 0; i < s.length; i++) peq.set(s.charCodeAt(i), (peq.get(s.charCodeAt(i)) ?? 0) | (1 << i));
  return { s, peq };
}

function levPat(p: Pat, b: string): number {
  const m = p.s.length;
  if (m === 0) return b.length;
  if (m > 31 || p.s === b) return p.s === b ? 0 : lev(p.s, b);
  const last = 1 << (m - 1);
  let pv = -1;
  let mv = 0;
  let score = m;
  for (let k = 0; k < b.length; k++) {
    const eq = p.peq.get(b.charCodeAt(k)) ?? 0;
    const xv = eq | mv;
    const xh = ((((eq & pv) + pv) | 0) ^ pv) | eq;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    if (ph & last) score++;
    else if (mh & last) score--;
    ph = (ph << 1) | 1;
    mh = mh << 1;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  return score;
}

function commonPrefix(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let k = 0;
  while (k < n && a[k] === b[k]) k++;
  return k;
}

function looksNonword(norm: string): boolean {
  if (!/[aeıioöuü]/.test(norm)) return true;
  if (/[qwx]/.test(norm)) return true;
  if (/(^|[^aeıioöuü])ğ/.test(norm)) return true;
  if (/[^aeıioöuü]{4,}/.test(norm)) return true;
  return /(.)\1\1/.test(norm);
}

/** Yanlış okumanın türü: metin kelimesi ve söylenen (katlanmış ve katlanmamış hâlleri). */
function subKind(tok: string, said: string, tokNorm: string, saidNorm: string): OralSubKind | undefined {
  if (tok.length >= 2 && tok.length === said.length && [...tok].sort().join('') === [...said].sort().join('')) {
    return 'reversal';
  }
  const cp = commonPrefix(tok, said);
  const longer = Math.max(tok.length, said.length);
  if ((cp >= 4 || (cp >= 2 && cp >= 0.7 * tok.length)) && cp >= 0.5 * longer) return 'suffix';
  if (Math.max(similarity(tok, said), similarity(tokNorm, saidNorm)) >= 0.6) return 'similar';
  if (looksNonword(saidNorm)) return 'nonword';
  return undefined;
}

// ---------------------------------------------------------------------------------------------------------------
// Tanınan kelimelerin temizlenmesi

/** Whisper'ın sessizlikte ya da gürültüde uydurduğu bilinen kalıplar (normalizeWord biçiminde). */
const HALLUCINATIONS: string[][] = [
  'abone olmayı unutmayın',
  'abone olmayı unutmayınız',
  'kanalıma abone olun',
  'kanalımıza abone olun',
  'abone olun',
  'videoyu beğenmeyi unutmayın',
  'beğenmeyi unutmayın',
  'izlediğiniz için teşekkür ederim',
  'izlediğiniz için teşekkür ederiz',
  'izlediğiniz için teşekkürler',
  'bir sonraki videoda görüşmek üzere',
  'sonraki videoda görüşmek üzere',
  'altyazı m k',
  'altyazı mk',
  'alt yazı',
  'altyazılar',
  'altyazı',
]
  .map((p) => p.split(' '))
  .sort((a, b) => b.length - a.length);

/** Önceki kelimenin devamı olan parça (kesme ya da tireyle başlıyor: Luna + 'ya, t + -shirt). */
const APOSTROPHE_START = /^['’‘`´ʼ\-]/;
/** Hece ayırıcı: virgül, tire, üç nokta. */
const SEP_END = /[,\-–—…]$/;

function cleanWords(words: AsrWord[], passageNorm: string): AsrWord[] {
  const sorted = words
    .filter((w) => w && typeof w.text === 'string' && Number.isFinite(w.start))
    .map((w) => (Number.isFinite(w.end) ? w : { ...w, end: w.start }))
    .map((w, k) => ({ w, k }))
    .sort((a, b) => a.w.start - b.w.start || a.k - b.k)
    .map(({ w }) => w);
  // Ayraç içindeki notlar, harfsiz parçalar; kesmeyle başlayan ek önceki kelimeye.
  const merged: AsrWord[] = [];
  let bracket = 0;
  for (const w of sorted) {
    const t = w.text.trim();
    if (bracket > 0 || /^[[(]/.test(t)) {
      bracket = /[\])][.,!?]*$/.test(t) || bracket >= 6 ? 0 : bracket + 1;
      continue;
    }
    if (/[♪*]/.test(t) || !/[\p{L}\p{N}]/u.test(t)) continue;
    const prev = merged[merged.length - 1];
    if (APOSTROPHE_START.test(t) && prev && w.start - prev.end < 0.4) {
      merged[merged.length - 1] = { text: prev.text.trim() + t, start: prev.start, end: Math.max(prev.end, w.end) };
      continue;
    }
    merged.push({ text: t, start: w.start, end: Math.max(w.start, w.end) });
  }
  // Rakamlar ve tireyle bölünmüş heceler ayrı kelimelere.
  const units: AsrWord[] = [];
  for (const w of merged) {
    const parts = normalizeWord(w.text).split(' ').filter(Boolean);
    if (parts.length === 0) continue;
    if (parts.length === 1) {
      units.push(w);
      continue;
    }
    const digits = /\d/.test(w.text);
    const total = parts.reduce((n, p) => n + p.length, 0);
    let t0 = w.start;
    parts.forEach((p, k) => {
      const t1 = k === parts.length - 1 ? w.end : t0 + ((w.end - w.start) * p.length) / total;
      units.push({ text: digits || k === parts.length - 1 ? p : p + '-', start: t0, end: t1 });
      t0 = t1;
    });
  }
  // Uydurma kalıplar (metinde geçmiyorsa).
  const norms = units.map((u) => normalizeWord(u.text));
  const drop = new Array<boolean>(units.length).fill(false);
  const passage = ` ${passageNorm} `;
  for (let j = 0; j < units.length; j++) {
    for (const ph of HALLUCINATIONS) {
      if (j + ph.length > units.length) continue;
      if (!ph.every((p, k) => norms[j + k] === p)) continue;
      if (passage.includes(` ${ph.join(' ')} `)) continue;
      for (let k = 0; k < ph.length; k++) drop[j + k] = true;
      break;
    }
  }
  return units.filter((_, j) => !drop[j]);
}

// ---------------------------------------------------------------------------------------------------------------
// Hizalama

interface Tok {
  ns: string;
  key: string;
  parts: number;
  pat: Pat;
}

interface Unit {
  text: string;
  ns: string;
  key: string;
  sep: boolean;
  /** Hece gibi: kısa ve arkasında ayırıcı ya da kısa bir durak var. */
  syl: boolean;
  start: number;
  end: number;
}

function tokInfo(norm: string): Tok {
  const ns = norm.replace(/ /g, '');
  const key = foldWord(ns);
  return { ns, key, parts: norm ? norm.split(' ').length : 1, pat: pattern(key) };
}

function unitInfos(words: AsrWord[]): Unit[] {
  const us: Unit[] = words.map((w) => {
    const ns = normalizeWord(w.text).replace(/ /g, '');
    return { text: w.text, ns, key: foldWord(ns), sep: SEP_END.test(w.text.trim()), syl: false, start: w.start, end: w.end };
  });
  for (let j = 0; j < us.length; j++) {
    const gap = j + 1 < us.length ? us[j + 1].start - us[j].end : 0;
    us[j].syl = us[j].ns.length <= 4 && (us[j].sep || gap >= 0.1);
  }
  return us;
}

const C_OMIT = 1;
const C_INS = 1;
const C_EDGE_INS = 0.4;
/** Okunmamış baş ve son: eşit maliyetli seçenekler arasında okunan kelimeyi metindeki ilk yerine koyar. */
const C_EDGE_OMIT = 0.99;
const MIN_BOUNDARY_SIM = 0.6;
const MAX_JOIN = 6;
const MAX_SPLIT = 3;

const B_DIAG = 1;
const B_OMIT = 2;
const B_INS = 3;
const B_JOIN = 10;
const B_SPLIT = 20;
const KINDS: AlignKind[] = ['match', 'near', 'sub'];

const subCost = (sim: number) => 0.3 + 1.4 * (1 - sim);
/** Bölme/birleştirme: her fazla parça 0,15; her harf farkı 0,5 (tam bir kelimeyi yutan birleştirme, atlama ya da
 * eklemeden pahalı olsun). */
const boundaryCost = (dist: number, extra: number) => 0.15 * extra + 0.5 * dist;

/** Birleşik biçimin (`ns`, katlanmış `key`) metin kelimesiyle karşılaştırılması: [maliyet, tür] ya da uygun değilse null. */
function boundaryCompare(ns: string, key: string, tns: string, tpat: Pat, extra: number): [number, number] | null {
  if (ns === tns) return [0.1 * extra, 0];
  const tkey = tpat.s;
  if (key === tkey) return [0.1 * extra + 0.05, 1];
  const longer = Math.max(key.length, tkey.length);
  // Benzerlik en çok 1 − boy farkı / uzun olanın boyu olabilir.
  if (Math.abs(key.length - tkey.length) > (1 - MIN_BOUNDARY_SIM) * longer) return null;
  const dist = levPat(tpat, key);
  if (1 - dist / longer < MIN_BOUNDARY_SIM) return null;
  // Tek harflik fark, kelime sınırında konuşma tanımaya özgüdür (iç içe → iççe): yakın sayılır.
  if (dist === 1 && longer >= 4) return [0.1 * extra + 0.3, 1];
  return [boundaryCost(dist, extra), 2];
}

/** Ardışık parçaların birleşik biçimleri: [son parçanın sırası][parça sayısı]. */
interface Joined {
  ns: string[][];
  key: string[][];
  pat: Pat[][];
}

function joinedForms(items: { ns: string }[], maxK: number, withPat: boolean): Joined {
  const ns: string[][] = [];
  const key: string[][] = [];
  const pat: Pat[][] = [];
  for (let e = 0; e < items.length; e++) {
    const a: string[] = [];
    const b: string[] = [];
    const c: Pat[] = [];
    let s = items[e].ns;
    for (let k = 2; k <= maxK && e - k + 1 >= 0; k++) {
      s = items[e - k + 1].ns + s;
      a[k] = s;
      b[k] = foldWord(s);
      if (withPat) c[k] = pattern(b[k]);
    }
    ns.push(a);
    key.push(b);
    pat.push(c);
  }
  return { ns, key, pat };
}

/**
 * Bütünsel hizalama; işlemlerdeki sıralar T ve U içindedir. `edgeOmit`: tanınan kelimelerden önceki ve sonraki metin
 * kelimelerinin atlanma maliyeti (doğrulama parçasında parçanın dışında kalan kelimeler için ucuzdur).
 */
function alignCore(T: Tok[], U: Unit[], edgeOmit = C_EDGE_OMIT): AlignOp[] {
  const m = T.length;
  const n = U.length;
  const W = n + 1;
  const cost = new Float64Array((m + 1) * W);
  const back = new Int16Array((m + 1) * W);
  const kind = new Int8Array((m + 1) * W);
  const UJ = joinedForms(U, MAX_JOIN, false);
  const TJ = joinedForms(T, MAX_SPLIT, true);
  for (let j = 1; j <= n; j++) {
    cost[j] = cost[j - 1] + C_EDGE_INS;
    back[j] = B_INS;
  }
  for (let i = 1; i <= m; i++) {
    cost[i * W] = cost[(i - 1) * W] + edgeOmit;
    back[i * W] = B_OMIT;
  }
  for (let i = 1; i <= m; i++) {
    const t = T[i - 1];
    const row = i * W;
    const prow = (i - 1) * W;
    const insCost = i === m ? C_EDGE_INS : C_INS;
    for (let j = 1; j <= n; j++) {
      const u = U[j - 1];
      // Bire bir.
      let c: number;
      let kd: number;
      if (t.ns === u.ns) {
        c = 0;
        kd = 0;
      } else if (t.key === u.key) {
        c = 0.05;
        kd = 1;
      } else {
        c = subCost(1 - levPat(t.pat, u.key) / Math.max(t.key.length, u.key.length, 1));
        kd = 2;
      }
      let best = cost[prow + j - 1] + c;
      let bk = B_DIAG;
      let bkind = kd;
      // Whisper kelimeyi bölmüş: k tanınan kelime → 1 metin kelimesi.
      let allSyl = true;
      for (let k = 2; k <= MAX_JOIN && j - k >= 0; k++) {
        allSyl = allSyl && U[j - k].syl;
        if (k > 3 && k > t.parts && !allSyl) break;
        const ns = UJ.ns[j - 1][k];
        if (ns.length > 1.6 * t.ns.length + 3) break;
        const r = boundaryCompare(ns, UJ.key[j - 1][k], t.ns, t.pat, k - 1);
        if (!r) continue;
        const v = cost[prow + j - k] + r[0];
        if (v < best) {
          best = v;
          bk = B_JOIN + k;
          bkind = r[1];
        }
      }
      // Whisper kelimeleri birleştirmiş: k metin kelimesi → 1 tanınan kelime.
      for (let k = 2; k <= MAX_SPLIT && i - k >= 0; k++) {
        const tns = TJ.ns[i - 1][k];
        if (tns.length > 1.6 * u.ns.length + 3) break;
        const r = boundaryCompare(u.ns, u.key, tns, TJ.pat[i - 1][k], k - 1);
        if (!r) continue;
        const v = cost[(i - k) * W + j - 1] + r[0];
        if (v < best) {
          best = v;
          bk = B_SPLIT + k;
          bkind = r[1];
        }
      }
      const vo = cost[prow + j] + (j === n ? edgeOmit : C_OMIT);
      if (vo < best) {
        best = vo;
        bk = B_OMIT;
      }
      const vi = cost[row + j - 1] + insCost;
      if (vi < best) {
        best = vi;
        bk = B_INS;
      }
      cost[row + j] = best;
      back[row + j] = bk;
      kind[row + j] = bkind;
    }
  }
  const ops: AlignOp[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    const b = back[i * W + j];
    const kd = KINDS[kind[i * W + j]];
    if (b === B_DIAG) {
      ops.push({ kind: kd, token: i - 1, words: [j - 1] });
      i--;
      j--;
    } else if (b === B_OMIT) {
      ops.push({ kind: 'omit', token: i - 1 });
      i--;
    } else if (b === B_INS) {
      ops.push({ kind: 'ins', words: [j - 1] });
      j--;
    } else if (b > B_SPLIT) {
      const k = b - B_SPLIT;
      for (let t = 1; t <= k; t++) ops.push({ kind: kd, token: i - t, words: [j - 1] });
      i -= k;
      j--;
    } else {
      const k = b - B_JOIN;
      ops.push({ kind: kd, token: i - 1, words: Array.from({ length: k }, (_, t) => j - k + t) });
      i--;
      j -= k;
    }
  }
  return ops.reverse();
}

/** Metin ile tanınan kelimeleri hizalar (bkz. dosya başı, 2). */
export function alignWords(paragraphs: string[], words: AsrWord[]): WordAlignment {
  const tokens: TimedToken[] = oralTokens(paragraphs)
    .flat()
    .map((t) => ({ i: t.i, text: t.text, norm: normalizeWord(t.text) }));
  const clean = cleanWords(words, tokens.map((t) => t.norm).join(' '));
  const ops = alignCore(tokens.map((t) => tokInfo(t.norm)), unitInfos(clean));
  return { tokens, words: clean, ops };
}

// ---------------------------------------------------------------------------------------------------------------
// Sınıflandırma

const SENTENCE_END = /[.!?:;…]["'”’»)\]]*$/;
const PAD_SEC = 0.6;
const MERGE_GAP_SEC = 0.5;
const DEFAULT_MAX_CLIP_SEC = 50;
const HES_MS = 1000;

type Fallback = 'error' | 'unclear';

interface Cand {
  type: 'sub' | 'omit' | 'ins';
  /** sub: [kelime]; omit: dizi; ins: [eklemenin bağlandığı kelime]. */
  tokens: number[];
  /** sub: tanınan kelimeler; ins: [fazla kelime]. */
  words: number[];
  /** Doğrulanacak çekirdek aralık (saniye). */
  start: number;
  end: number;
  fallback: Fallback;
  said?: string;
  kind?: OralSubKind;
  /** Okumanın sonundaki atlama: parça kaydın sonunda kısalabilir, başını kapsaması yeter. */
  tail?: boolean;
  /** Yanlış okuma tek harf farkla: doğrulama aynı şeyi söylese de hata yazılmaz. */
  minor?: boolean;
  /** Eklemenin iki yanındaki metin kelimeleri. */
  p?: number;
  q?: number;
}

interface TokState {
  op: AlignKind;
  words: number[];
  /** Tam olmayan bölme/birleştirme ya da başka bir nedenle emin olunamadı. */
  unclear: boolean;
  syl: boolean;
  rep: boolean;
  self: boolean;
}

interface Analysis {
  T: Tok[];
  U: Unit[];
  st: TokState[];
  ignored: boolean[];
  cands: Cand[];
  /** Hiçbir metin kelimesi tanınmadı. */
  empty: boolean;
}

type Segs = [number, number][];

function speechSegments(t: ReadingTiming | null): Segs | null {
  if (!t || t.speechStartMs == null || t.speechEndMs == null || !(t.speechEndMs > t.speechStartMs)) return null;
  const ps = t.pauses.filter((p) => p[1] > p[0]).sort((a, b) => a[0] - b[0]);
  const segs: Segs = [];
  let cur = t.speechStartMs;
  for (const [a, b] of ps) {
    if (b <= cur) continue;
    if (a > cur) segs.push([cur, Math.min(a, t.speechEndMs)]);
    cur = Math.max(cur, b);
    if (cur >= t.speechEndMs) break;
  }
  if (cur < t.speechEndMs) segs.push([cur, t.speechEndMs]);
  return segs;
}

function overlap(segs: Segs, a: number, b: number): number {
  let s = 0;
  for (const [x, y] of segs) {
    const v = Math.min(b, y) - Math.max(a, x);
    if (v > 0) s += v;
  }
  return s;
}

const stripEdges = (s: string) => s.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

function saidOf(U: Unit[], ws: number[]): string {
  return ws
    .map((w) => stripEdges(U[w].text))
    .join(' ')
    .slice(0, 40);
}

const same = (a: string, b: string) => a === b || similarity(a, b) >= 0.75;
function partial(u: string, t: string): boolean {
  if (!u) return false;
  const cp = commonPrefix(u, t);
  return (cp >= 2 && cp >= 0.6 * u.length) || similarity(u, t) >= 0.6;
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** Adayları ve kesin durumları çıkarır. `timing` yoksa sessizlik koruması ve konuşma sesi denetimi yapılmaz. */
function analyze(al: WordAlignment, timing: ReadingTiming | null): Analysis {
  const T = al.tokens.map((t) => tokInfo(t.norm));
  const U = unitInfos(al.words);
  const m = T.length;
  const segs = speechSegments(timing);
  const st: TokState[] = T.map(() => ({ op: 'omit', words: [], unclear: false, syl: false, rep: false, self: false }));
  const tokOps = new Map<number, AlignOp>();
  const wordUse = new Array<number>(U.length).fill(0);
  const wordMatched = new Array<boolean>(U.length).fill(false);
  for (const op of al.ops) {
    if (op.token === undefined) continue;
    tokOps.set(op.token, op);
    for (const w of op.words ?? []) {
      wordUse[w]++;
      if (op.kind === 'match' || op.kind === 'near') wordMatched[w] = true;
    }
  }
  // Sessizlik ve uydurma koruması: metinle aynı olmayan ve konuşma sesine düşmeyen kelimeler.
  const ignored = U.map((u, j) => {
    if (!segs || wordMatched[j]) return false;
    const a = u.start * 1000 - 150;
    const b = u.end * 1000 + 150;
    const dur = Math.max(1, b - a);
    const sp = overlap(segs, a, b);
    return sp < 80 && sp / dur < 0.2;
  });
  // Hece bölgeleri: ayırıcıyla bağlı, en az ikisi kısa, araları duraklı kelime dizileri.
  const inSyl = new Array<boolean>(U.length).fill(false);
  for (let j = 0; j < U.length; ) {
    let k = j;
    while (k < U.length - 1 && U[k].sep) k++;
    if (k > j) {
      const idx = Array.from({ length: k - j + 1 }, (_, t) => j + t);
      const shorts = idx.filter((x) => U[x].ns.length <= 4).length;
      const gaps = idx.slice(1).map((x) => U[x].start - U[x - 1].end);
      if (shorts >= 2 && gaps.reduce((s, g) => s + g, 0) / gaps.length >= 0.1) for (const x of idx) inSyl[x] = true;
    }
    j = k + 1;
  }
  const sylJoin = (ws: number[]) =>
    ws.length >= 2 &&
    ws.slice(0, -1).every((w, t) => U[w].sep || U[ws[t + 1]].start - U[w].end >= 0.15) &&
    ws.some((w) => U[w].ns.length <= 4);

  // Kelime durumları.
  const cands: Cand[] = [];
  for (const [t, op] of tokOps) {
    const s = st[t];
    s.op = op.kind;
    s.words = op.words ?? [];
    if (op.kind === 'omit') continue;
    const boundary = s.words.length > 1 || s.words.some((w) => wordUse[w] > 1);
    const syl = sylJoin(s.words) || s.words.some((w) => inSyl[w]);
    if (op.kind === 'match' || op.kind === 'near') {
      if (sylJoin(s.words)) s.syl = true;
      continue;
    }
    // Hece hece okunmuş ve heceler birleşince kelimeye benziyor: doğru.
    if (sylJoin(s.words) && similarity(foldWord(s.words.map((w) => U[w].ns).join('')), T[t].key) >= 0.75) {
      s.syl = true;
      s.op = 'near';
      continue;
    }
    if (boundary || syl || s.words.every((w) => ignored[w])) {
      s.unclear = true;
      if (syl) s.syl = true;
      continue;
    }
    const w = s.words[0];
    const kind = subKind(T[t].key, U[w].key, T[t].ns, U[w].ns);
    cands.push({
      type: 'sub',
      tokens: [t],
      words: [w],
      start: U[w].start,
      end: U[w].end,
      fallback: kind === 'suffix' || kind === 'similar' ? 'unclear' : 'error',
      said: saidOf(U, [w]),
      kind,
      minor: lev(T[t].key, U[w].key) <= 1,
    });
  }
  const aligned = (t: number) => t >= 0 && t < m && st[t].op !== 'omit';
  const anyAligned = st.some((s) => s.op !== 'omit');

  // Fazla kelime dizileri.
  const runs: { units: number[]; p: number; q: number }[] = [];
  let pending: number[] = [];
  let lastTok = -1;
  for (const op of al.ops) {
    if (op.kind === 'ins') {
      for (const w of op.words ?? []) if (!ignored[w]) pending.push(w);
      continue;
    }
    if (pending.length) runs.push({ units: pending, p: lastTok, q: op.token! });
    pending = [];
    lastTok = op.token!;
  }
  if (pending.length) runs.push({ units: pending, p: lastTok, q: m });
  let firstAligned = -1;
  let lastAligned = -1;
  for (let t = 0; t < m; t++) {
    if (!aligned(t)) continue;
    if (firstAligned < 0) firstAligned = t;
    lastAligned = t;
  }
  for (const run of runs) {
    const R = run.units;
    const { p, q } = run;
    // Geriye tekrar: az önce okunan kelimeler yeniden.
    let a = 0;
    for (let k = Math.min(R.length, p + 1); k >= 1; k--) {
      let ok = true;
      for (let x = 0; x < k && ok; x++) ok = same(U[R[x]].key, T[p - k + 1 + x].key);
      if (ok) {
        a = k;
        break;
      }
    }
    for (let x = 0; x < a; x++) st[p - a + 1 + x].rep = true;
    // İleriye tekrar: baştan alma ya da yarım bırakılıp düzeltilen kelime.
    let b = 0;
    let lastPartial = false;
    for (let k = Math.min(R.length - a, m - q); k >= 1; k--) {
      let ok = true;
      let part = false;
      for (let x = 0; x < k && ok; x++) {
        const u = U[R[R.length - k + x]].key;
        const tk = T[q + x].key;
        if (same(u, tk)) continue;
        if (x === k - 1 && partial(u, tk)) part = true;
        else ok = false;
      }
      if (ok) {
        b = k;
        lastPartial = part;
        break;
      }
    }
    for (let x = 0; x < b; x++) {
      const t = q + x;
      if (x === b - 1 && lastPartial) {
        if (st[t].op === 'match' || st[t].op === 'near') st[t].self = true;
      } else st[t].rep = true;
    }
    // Geriye kalanlar.
    const leading = !anyAligned || (firstAligned >= 0 && q <= firstAligned && !aligned(p));
    const trailing = !anyAligned || p >= lastAligned;
    for (const w of R.slice(a, R.length - b)) {
      const u = U[w].key;
      if (p >= 0 && p < m && partial(u, T[p].key)) continue;
      if (q >= 0 && q < m && partial(u, T[q].key)) continue;
      if (inSyl[w]) continue;
      if (leading || trailing) continue;
      const garbled = [p, q].some((t) => t >= 0 && t < m && (st[t].op === 'sub' || st[t].unclear));
      cands.push({
        type: 'ins',
        tokens: [p],
        words: [w],
        start: U[w].start,
        end: U[w].end,
        fallback: garbled ? 'unclear' : 'error',
        said: saidOf(U, [w]),
        p,
        q,
      });
    }
  }

  // Atlama dizileri.
  if (anyAligned) {
    const rate = median(
      st.flatMap((s) =>
        (s.op === 'match' || s.op === 'near') && s.words.length === 1 && U[s.words[0]].ns.length >= 3
          ? [(U[s.words[0]].end - U[s.words[0]].start) / U[s.words[0]].ns.length]
          : [],
      ),
    );
    const stretched = (w: number) => {
      if (w < 0 || w >= U.length || !rate) return false;
      const u = U[w];
      return u.end - u.start > 1.7 * rate * Math.max(2, u.ns.length) + 0.15;
    };
    for (let t = 0; t < m; ) {
      if (st[t].op !== 'omit') {
        t++;
        continue;
      }
      let e = t;
      while (e + 1 < m && st[e + 1].op === 'omit') e++;
      const run = Array.from({ length: e - t + 1 }, (_, x) => t + x);
      const head = t < firstAligned;
      const tail = e > lastAligned;
      const prevW = head ? -1 : Math.max(...st[t - 1].words);
      const nextW = tail ? -1 : Math.min(...st[e + 1].words);
      let start: number;
      let end: number;
      let fallback: Fallback;
      if (head || tail) {
        // Okumanın başı ya da sonu: bitişik olmayan fazla kelimeler bu kelimelere benziyorsa ya da orada konuşma
        // sesi varsa emin olunamaz.
        const extra = U.map((_, w) => w).filter((w) => !ignored[w] && wordUse[w] === 0 && (head ? w < nextW : w > prevW));
        const resembles = extra.some((w) => run.slice(0, 6).some((x) => similarity(U[w].key, T[x].key) >= 0.5));
        if (head) {
          start = Math.max(0, U[nextW].start - 3);
          end = U[nextW].start;
        } else {
          start = U[prevW].end;
          end = U[prevW].end + 4;
        }
        if (!segs || resembles) fallback = 'unclear';
        else {
          let sp = head ? overlap(segs, -Infinity, U[nextW].start * 1000 - 150) : overlap(segs, U[prevW].end * 1000 + 150, Infinity);
          for (const w of extra) sp -= overlap(segs, U[w].start * 1000, U[w].end * 1000);
          fallback = sp >= 300 ? 'unclear' : 'error';
        }
      } else {
        start = U[prevW].end;
        end = U[nextW].start;
        let lastBefore = prevW;
        for (let w = prevW + 1; w < nextW; w++) if (!ignored[w]) lastBefore = w;
        const gapA = U[lastBefore].end;
        const gapB = U[nextW].start;
        const stretch = stretched(lastBefore) || stretched(nextW);
        if (segs) {
          const sp = overlap(segs, gapA * 1000 + 80, gapB * 1000 - 80);
          if (sp >= 150) fallback = 'unclear';
          else if (run.length >= 3) fallback = 'error';
          else fallback = stretch ? 'unclear' : 'error';
        } else {
          fallback = gapB - gapA >= 0.3 || stretch ? 'unclear' : 'error';
        }
      }
      cands.push({ type: 'omit', tokens: run, words: [], start, end: Math.max(start, end), fallback, tail: tail && !head });
      t = e + 1;
    }
  }
  return { T, U, st, ignored, cands, empty: !anyAligned };
}

// ---------------------------------------------------------------------------------------------------------------
// Doğrulama

function mergeWindows(ws: { start: number; end: number; tokens: number[] }[]): VerifyClip[] {
  const s = [...ws].sort((a, b) => a.start - b.start);
  const out: VerifyClip[] = [];
  for (const w of s) {
    const last = out[out.length - 1];
    if (last && w.start - last.end < MERGE_GAP_SEC) {
      last.end = Math.max(last.end, w.end);
      last.tokens = [...new Set([...last.tokens, ...w.tokens])].sort((a, b) => a - b);
    } else out.push({ start: w.start, end: w.end, tokens: [...new Set(w.tokens)].sort((a, b) => a - b) });
  }
  return out;
}

const totalSec = (cs: VerifyClip[]) => cs.reduce((n, c) => n + (c.end - c.start), 0);

/**
 * Doğrulanacak parçalar: her aday hata bölgesi iki yandan ~0,6 sn payla; yakın parçalar birleşir. Toplam süre
 * `maxTotalSec`'i aşarsa önce doğrulanmadan hata sayılacak adaylar (öğrencinin aleyhine olanlar), sonra öteki adaylar
 * okuma sırasıyla alınır. Doğrulamada her parça ayrı yazıya dökülür; süreler parçanın başından itibaren saniyedir.
 */
export function planVerification(al: WordAlignment, durationSec: number, maxTotalSec = DEFAULT_MAX_CLIP_SEC): VerifyClip[] {
  const { cands } = analyze(al, null);
  const dur = Number.isFinite(durationSec) && durationSec > 0 ? durationSec : Infinity;
  const order = [...cands].sort((a, b) => (a.fallback === b.fallback ? a.start - b.start : a.fallback === 'error' ? -1 : 1));
  let chosen: { start: number; end: number; tokens: number[] }[] = [];
  let clips: VerifyClip[] = [];
  for (const c of order) {
    const start = Math.max(0, c.start - PAD_SEC);
    const end = Math.min(dur, c.end + PAD_SEC);
    if (!(end > start)) continue;
    const next = [...chosen, { start, end, tokens: c.tokens.filter((t) => t >= 0) }];
    const merged = mergeWindows(next);
    if (totalSec(merged) > maxTotalSec) continue;
    chosen = next;
    clips = merged;
  }
  return clips;
}

type Verdict = 'confirm' | 'reject' | 'none';

function verify(al: WordAlignment, an: Analysis, clips: VerifyClip[], clipWords: AsrWord[][] | null): Verdict[] {
  const out: Verdict[] = an.cands.map(() => 'none');
  if (!clipWords) return out;
  const passageNorm = al.tokens.map((t) => t.norm).join(' ');
  clips.forEach((clip, k) => {
    const words = clipWords[k];
    if (!Array.isArray(words)) return;
    const inside = an.cands
      .map((c, x) => ({ c, x }))
      .filter(({ c }) => clip.start <= c.start + 0.01 && clip.end >= (c.tail ? Math.min(c.end, c.start + 0.5) : c.end) - 0.01);
    if (!inside.length) return;
    // Parçaya düşen metin kelimeleri (iki yandan birer kelime payla).
    const toks = new Set<number>();
    for (const { c } of inside) for (const t of [...c.tokens, c.p ?? -1, c.q ?? -1]) if (t >= 0 && t < an.T.length) toks.add(t);
    an.st.forEach((s, t) => {
      if (s.words.some((w) => an.U[w].end > clip.start && an.U[w].start < clip.end)) toks.add(t);
    });
    if (!toks.size) return;
    const lo = Math.max(0, Math.min(...toks) - 1);
    const hi = Math.min(an.T.length - 1, Math.max(...toks) + 1);
    const abs = cleanWords(
      words.map((w) => ({ text: w.text, start: w.start + clip.start, end: w.end + clip.start })),
      passageNorm,
    );
    const CU = unitInfos(abs);
    const ops = alignCore(an.T.slice(lo, hi + 1), CU, 0.2);
    const byTok = new Map<number, AlignOp>();
    const insKeys: { key: string; start: number }[] = [];
    for (const op of ops) {
      if (op.token !== undefined) byTok.set(op.token + lo, op);
      else for (const w of op.words ?? []) insKeys.push({ key: CU[w].key, start: CU[w].start });
    }
    for (const { c, x } of inside) {
      if (c.type === 'sub') {
        const op = byTok.get(c.tokens[0]);
        if (!op || op.kind !== 'sub') {
          out[x] = 'reject';
          continue;
        }
        const said = foldWord((op.words ?? []).map((w) => CU[w].ns).join(''));
        const orig = an.U[c.words[0]].key;
        out[x] = said === orig ? 'confirm' : 'reject';
      } else if (c.type === 'omit') {
        out[x] = c.tokens.every((t) => byTok.get(t)?.kind === 'omit') ? 'confirm' : 'reject';
      } else {
        const key = an.U[c.words[0]].key;
        out[x] = insKeys.some((w) => (w.key === key || similarity(w.key, key) >= 0.8) && Math.abs(w.start - c.start) <= 1.5)
          ? 'confirm'
          : 'reject';
      }
    }
  });
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// İşaretler

/**
 * Hizalamadan kelime işaretleri (bkz. dosya başı, 3). `clips` planVerification'ın döndürdüğü parçalar, `clipWords`
 * her parçanın ayrı yazıya dökülmüş kelimeleri (süreler parçanın başından itibaren); doğrulama yapılmadıysa null.
 */
export function buildAutoMarks(
  al: WordAlignment,
  clips: VerifyClip[],
  clipWords: AsrWord[][] | null,
  timing: ReadingTiming,
): AutoMarks {
  const an = analyze(al, timing);
  const { T, U, st, ignored } = an;
  const m = T.length;
  const status: (OralMark['s'] | undefined)[] = new Array(m).fill(undefined);
  const said: (string | undefined)[] = new Array(m).fill(undefined);
  const kinds: (OralSubKind | undefined)[] = new Array(m).fill(undefined);
  const ins = new Array<number>(m).fill(0);

  if (an.empty) {
    status.fill('unclear');
  } else {
    const verdicts = verify(al, an, clips, clipWords);
    an.cands.forEach((c, x) => {
      const v = verdicts[x];
      const isError = (v === 'confirm' && !c.minor) || (v === 'none' && c.fallback === 'error');
      if (c.type === 'sub') {
        const t = c.tokens[0];
        if (isError) {
          status[t] = 'sub';
          said[t] = c.said;
          kinds[t] = c.kind;
        } else status[t] = 'unclear';
      } else if (c.type === 'omit') {
        for (const t of c.tokens) status[t] = isError ? 'omit' : 'unclear';
      } else if (isError && c.tokens[0] >= 0) ins[c.tokens[0]] += 1;
    });
    st.forEach((s, t) => {
      if (s.unclear) status[t] = 'unclear';
      else if (!status[t] && s.self) status[t] = 'self';
    });
  }

  // Duraksama.
  const pauses = (timing.pauses ?? []).filter((p) => p[1] > p[0]);
  const haveTiming = timing.speechStartMs != null && timing.speechEndMs != null;
  const hes = new Array<boolean>(m).fill(false);
  if (!an.empty) {
    for (let t = 1; t < m; t++) {
      const s = st[t];
      const prev = st[t - 1];
      if (s.op === 'omit' || prev.op === 'omit' || !s.words.length) continue;
      if (SENTENCE_END.test(al.tokens[t - 1].text)) continue;
      const first = Math.min(...s.words);
      if (prev.words.includes(first)) continue;
      let pw = first - 1;
      while (pw >= 0 && ignored[pw]) pw--;
      if (pw < 0) continue;
      const gapMs = (U[first].start - U[pw].end) * 1000;
      if (!haveTiming) {
        hes[t] = gapMs >= HES_MS;
        continue;
      }
      // Kelime boşluğu ses çözümlemesinde de sessiz olmalı; Whisper sessizliği önceki kelimeye katmışsa, önceki
      // kelimenin başı ile bu kelimenin başı arasındaki en az 1000 ms'lik sessizlik yeter.
      const gapA = U[pw].end * 1000;
      const gapB = U[first].start * 1000;
      const winA = U[pw].start * 1000;
      const winB = gapB + 250;
      let inGap = 0;
      let longest = 0;
      for (const [a, b] of pauses) {
        inGap += Math.max(0, Math.min(b, gapB) - Math.max(a, gapA));
        longest = Math.max(longest, Math.min(b, winB) - Math.max(a, winA));
      }
      hes[t] = (gapMs >= HES_MS && inGap >= 250) || longest >= HES_MS;
    }
  }

  const marks: Record<string, OralMark> = {};
  const counts = { correct: 0, sub: 0, omit: 0, ins: 0, rep: 0, self: 0, hes: 0, unclear: 0 };
  for (let t = 0; t < m; t++) {
    const mk: OralMark = {};
    const s = status[t];
    if (s) mk.s = s;
    if (s === 'sub') {
      if (said[t]) mk.said = said[t];
      if (kinds[t]) mk.kind = kinds[t];
    }
    if (st[t].rep && s !== 'omit') mk.rep = true;
    if (st[t].syl && s !== 'omit') mk.syl = true;
    if (hes[t] && s !== 'omit') mk.hes = true;
    if (ins[t]) mk.ins = ins[t];
    if (s === 'sub' || s === 'omit' || s === 'unclear') counts[s] += 1;
    else counts.correct += 1;
    if (s === 'self') counts.self += 1;
    if (mk.rep) counts.rep += 1;
    if (mk.hes) counts.hes += 1;
    counts.ins += ins[t];
    if (Object.keys(mk).length) marks[String(al.tokens[t].i)] = mk;
  }

  let startMs: number | null = null;
  let endMs: number | null = null;
  for (let t = 0; t < m; t++) {
    const ws = st[t].words.filter((w) => !ignored[w]);
    if (st[t].op === 'omit' || !ws.length) continue;
    const a = Math.min(...ws.map((w) => U[w].start)) * 1000;
    const b = Math.max(...ws.map((w) => U[w].end)) * 1000;
    if (startMs === null || a < startMs) startMs = a;
    if (endMs === null || b > endMs) endMs = b;
  }
  const readingStartMs = Math.round(startMs ?? timing.speechStartMs ?? 0);
  const readingEndMs = Math.round(Math.max(readingStartMs, endMs ?? timing.speechEndMs ?? readingStartMs));
  return { marks, unclear: counts.unclear, readingStartMs, readingEndMs, counts };
}
