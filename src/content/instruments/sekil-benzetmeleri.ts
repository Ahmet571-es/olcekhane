import { buildAnalogyItem, el, type AnalogyOp, type AnalogySpec } from '@/lib/instruments/analogy';
import type { AnalogyFill, AnalogyLure, AnalogyPracticeItem, AnalogySlot, FiguralAnalogyTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Şekil benzetmeleri (geometrik benzetme, A : B :: C : ?): birinci şekil ikinci şekle dönüşür; üçüncü şeklin aynı biçimde
 * dönüşmüş hâli dört seçenekten seçilir. Bütün şekiller, sorular ve seçenekler Ölçekhane'nindir; zekâ ve yetenek
 * testlerinin şekil benzetmesi soruları kullanılmaz.
 *
 * Sorular A panosu, C ve A'yı B'ye götüren değişikliklerle (renk, büyüklük, döndürme, ayna görüntüsü, yer, sayı, iki parçanın
 * yer değiştirmesi) yazılır; B, doğru cevap ve yanlış seçenekler bu değişikliklerden hesaplanır (lib/instruments/analogy.ts).
 * C, A'dan biçimleriyle ve değişmeyen bazı özellikleriyle (ör. büyüklüğü ya da rengi) ayrılır; değişen özellikler C'de A'daki
 * gibi başlar. Böylece değişikliğin mutlak ("siyah oldu") ya da göreli ("koyulaştı") okunması aynı cevabı verir.
 *
 * Düzeyler değişikliklerin sayısına ve türüne göredir: 1. düzeyde tek bir renk ya da büyüklük değişikliği; 2. düzeyde tek bir
 * döndürme, ayna görüntüsü, yer ya da sayı değişikliği; 3. düzeyde bir şekilde iki değişiklik; 4. düzeyde iki parçada birer
 * değişiklik; 5. düzeyde üç değişiklik.
 *
 * Yanlış seçenekler dört türdendir (`AnalogyLure`): C'nin aynısı (değişikliklerin hiçbiri yok), eksik (bir kısmı yok), yanlış
 * (bir değişiklik yanlış yönde, yanlış ölçüde, yanlış parçada ya da başka bir özellikte) ve fazladan (doğru değişikliklerin
 * yanında, değişmemesi gereken bir özelliği ikinci şekildeki değerine getiren bir değişiklik daha). Seçenekler bir arama ve seçim betiğiyle (scratchpad'de,
 * depoda değil) bütün test için birlikte seçildi: seçeneklere bakarak soruyu çözmeden doğru cevabı bulduran kestirme yollar
 * (seçeneklerde en sık görülen özellikleri, ötekilere en çok benzeyeni, üçüncü şekilden en çok ya da en az farklı olanı,
 * ikinci şekle en çok benzeyeni ya da soruda zaten görülmeyeni seçmek) 24 soruda şans düzeyini (6 doğru) aşmaz. Değişikliklerin
 * sayısını sayıp üçüncü şekilden aynı sayıda özellikle ayrılan seçeneği seçmek yaklaşık 10 doğru verir: bu yol değişikliklerin
 * hangileri olduğunu bulmayı gerektirir ama yönünü ve yerini denetlemeyi atlar.
 *
 * tests/sekil-benzetmeleri.test.ts bunları bağımsız bir denetleyiciyle (tests/helpers/analogy-check.ts; çizimleri
 * karşılaştırır, A'yı B'ye götüren bütün yorumları arar) yeniden denetler: her sorunun tek doğru cevabı, yanlış seçeneklerin
 * türleri, seçeneklerin birbirinden ve A ile B'den farklı olması, parçaların panodan ve çerçeveden taşmaması ve görünmesi,
 * kestirme yollar.
 */

const F = (e: number, to: AnalogyFill): AnalogyOp => ({ k: 'fill', el: e, to });
const S = (e: number, to: 1 | 2 | 3): AnalogyOp => ({ k: 'size', el: e, to });
const T = (e: number, by: number): AnalogyOp => ({ k: 'turn', el: e, by });
const M = (e: number, axis: 'v' | 'h'): AnalogyOp => ({ k: 'mirror', el: e, axis });
const MV = (e: number, to: AnalogySlot): AnalogyOp => ({ k: 'move', el: e, to });
const N = (e: number, to: number): AnalogyOp => ({ k: 'count', el: e, to });
const SW: AnalogyOp = { k: 'swap', a: 0, b: 1 };
const L = (kind: AnalogyLure, ...ops: AnalogyOp[]) => ({ kind, ops });

const SPECS: AnalogySpec[] = [
  {
    key: 'sb01',
    level: 1,
    changes: ['look'],
    a: [el('square')],
    c: [el('hexagon', { size: 1 })],
    ops: [F(0, 'black')],
    lures: [L('copy'), L('wrong', S(0, 2)), L('wrong', F(0, 'gray'))],
    answer: 2,
  },
  {
    key: 'sb02',
    level: 1,
    changes: ['look'],
    a: [el('circle', { fill: 'gray' })],
    c: [el('star', { fill: 'black' })],
    ops: [S(0, 1)],
    lures: [L('extra', S(0, 1), F(0, 'gray')), L('wrong', F(0, 'gray')), L('wrong', S(0, 3))],
    answer: 4,
  },
  {
    key: 'sb03',
    level: 1,
    changes: ['look'],
    a: [el('diamond', { fill: 'black' })],
    c: [el('cross', { fill: 'black', size: 1 })],
    ops: [F(0, 'empty')],
    lures: [L('extra', F(0, 'empty'), S(0, 2)), L('copy'), L('wrong', S(0, 2))],
    answer: 1,
  },
  {
    key: 'sb04',
    level: 1,
    changes: ['look'],
    a: [el('hexagon', { size: 1 })],
    c: [el('circle', { fill: 'gray', size: 1 })],
    ops: [S(0, 2)],
    lures: [L('extra', S(0, 2), F(0, 'empty')), L('copy'), L('wrong', F(0, 'empty'))],
    answer: 3,
  },
  {
    key: 'sb05',
    level: 2,
    changes: ['turn'],
    a: [el('ell')],
    c: [el('flag', { fill: 'gray' })],
    ops: [T(0, 90)],
    lures: [L('copy'), L('wrong', F(0, 'empty')), L('wrong', T(0, 180))],
    answer: 3,
  },
  {
    key: 'sb06',
    level: 2,
    changes: ['turn'],
    a: [el('flag', { fill: 'gray' })],
    c: [el('wedge', { fill: 'black' })],
    ops: [M(0, 'v')],
    lures: [L('copy'), L('wrong', F(0, 'gray')), L('wrong', T(0, 180))],
    answer: 1,
  },
  {
    key: 'sb07',
    level: 2,
    changes: ['place'],
    a: [el('square', { size: 3 }), el('ell', { fill: 'black', size: 1, slot: 'tl' })],
    c: [el('square', { size: 3 }), el('arrow', { fill: 'gray', size: 1, slot: 'tl' })],
    ops: [MV(1, 'tr')],
    lures: [L('extra', MV(1, 'tr'), F(1, 'black')), L('copy'), L('wrong', F(1, 'black'))],
    answer: 4,
  },
  {
    key: 'sb08',
    level: 2,
    changes: ['place'],
    a: [el('square', { fill: 'black', size: 1, count: 2 })],
    c: [el('star', { fill: 'gray', size: 1, count: 2 })],
    ops: [N(0, 3)],
    lures: [L('copy'), L('wrong', F(0, 'black')), L('wrong', N(0, 1))],
    answer: 2,
  },
  {
    key: 'sb09',
    level: 2,
    changes: ['turn'],
    a: [el('wedge', { fill: 'black' })],
    c: [el('arrow')],
    ops: [T(0, 270)],
    lures: [L('copy'), L('wrong', F(0, 'black')), L('wrong', T(0, 180))],
    answer: 1,
  },
  {
    key: 'sb10',
    level: 3,
    changes: ['turn', 'look'],
    a: [el('flag')],
    c: [el('ell', { size: 1 })],
    ops: [T(0, 90), F(0, 'black')],
    lures: [L('extra', T(0, 90), F(0, 'black'), S(0, 2)), L('partial', T(0, 90)), L('wrong', T(0, 180), S(0, 2))],
    answer: 3,
  },
  {
    key: 'sb11',
    level: 3,
    changes: ['turn', 'look'],
    a: [el('ell')],
    c: [el('wedge', { fill: 'gray' })],
    ops: [M(0, 'v'), S(0, 1)],
    lures: [L('extra', M(0, 'v'), S(0, 1), F(0, 'empty')), L('partial', M(0, 'v')), L('wrong', M(0, 'h'), F(0, 'empty'))],
    answer: 2,
  },
  {
    key: 'sb12',
    level: 3,
    changes: ['place', 'look'],
    a: [el('ell', { fill: 'black', slot: 'l' })],
    c: [el('star', { fill: 'black', size: 1, slot: 'l' })],
    ops: [MV(0, 'r'), F(0, 'gray')],
    lures: [L('extra', MV(0, 'r'), F(0, 'gray'), S(0, 2)), L('wrong', F(0, 'gray'), S(0, 2)), L('wrong', MV(0, 't'), S(0, 2))],
    answer: 4,
  },
  {
    key: 'sb13',
    level: 3,
    changes: ['place', 'turn'],
    a: [el('square', { size: 3 }), el('flag', { fill: 'black', size: 1, slot: 'tl' })],
    c: [el('square', { size: 3 }), el('ell', { fill: 'gray', size: 1, slot: 'tl' })],
    ops: [MV(1, 'tr'), T(1, 180)],
    lures: [L('partial', MV(1, 'tr')), L('wrong', MV(1, 'tr'), F(1, 'black')), L('wrong', MV(1, 'bl'), M(1, 'v'))],
    answer: 4,
  },
  {
    key: 'sb14',
    level: 3,
    changes: ['place', 'turn'],
    a: [el('ell', { size: 1, count: 2 })],
    c: [el('flag', { fill: 'gray', size: 1, count: 2 })],
    ops: [N(0, 3), T(0, 90)],
    lures: [L('extra', N(0, 3), T(0, 90), F(0, 'empty')), L('partial', T(0, 90)), L('wrong', T(0, 270), F(0, 'empty'))],
    answer: 2,
  },
  {
    key: 'sb15',
    level: 4,
    changes: ['look', 'turn'],
    a: [el('square', { size: 3 }), el('ell', { fill: 'black', size: 1 })],
    c: [el('circle', { size: 3 }), el('flag', { size: 1 })],
    ops: [F(0, 'gray'), T(1, 90)],
    lures: [L('extra', F(0, 'gray'), T(1, 90), F(1, 'black')), L('wrong', F(0, 'gray'), F(1, 'black')), L('wrong', F(1, 'gray'), T(1, 90))],
    answer: 3,
  },
  {
    key: 'sb16',
    level: 4,
    changes: ['place', 'look'],
    a: [el('ell', { slot: 'l' }), el('circle', { fill: 'black', slot: 'r' })],
    c: [el('wedge', { fill: 'gray', slot: 'l' }), el('square', { fill: 'black', slot: 'r' })],
    ops: [SW, F(1, 'gray')],
    lures: [L('extra', SW, F(1, 'gray'), F(0, 'empty')), L('partial', SW), L('wrong', SW, M(0, 'v'))],
    answer: 1,
  },
  {
    key: 'sb17',
    level: 4,
    changes: ['look', 'place'],
    a: [el('square', { size: 3 }), el('ell', { fill: 'black', size: 1, slot: 'tl' })],
    c: [el('square', { size: 3 }), el('wedge', { size: 1, slot: 'tl' })],
    ops: [F(0, 'gray'), MV(1, 'br')],
    lures: [L('extra', F(0, 'gray'), MV(1, 'br'), F(1, 'black')), L('partial', MV(1, 'br')), L('wrong', MV(1, 'tr'), F(1, 'black'))],
    answer: 2,
  },
  {
    key: 'sb18',
    level: 4,
    changes: ['turn'],
    a: [el('ell', { fill: 'black', slot: 'l' }), el('flag', { slot: 'r' })],
    c: [el('flag', { fill: 'black', slot: 'l' }), el('wedge', { fill: 'gray', slot: 'r' })],
    ops: [T(0, 90), M(1, 'v')],
    lures: [L('partial', T(0, 90)), L('wrong', T(0, 90), F(1, 'empty')), L('wrong', M(0, 'v'), T(1, 90))],
    answer: 1,
  },
  {
    key: 'sb19',
    level: 4,
    changes: ['turn', 'look'],
    a: [el('ell', { slot: 't' }), el('circle', { fill: 'black', slot: 'b' })],
    c: [el('flag', { fill: 'gray', slot: 't' }), el('hexagon', { fill: 'black', slot: 'b' })],
    ops: [T(0, 180), F(1, 'gray')],
    lures: [L('extra', T(0, 180), F(1, 'gray'), F(0, 'empty')), L('wrong', T(0, 180), F(0, 'black')), L('wrong', F(1, 'gray'), F(0, 'empty'))],
    answer: 4,
  },
  {
    key: 'sb20',
    level: 5,
    changes: ['place', 'turn', 'look'],
    a: [el('flag', { slot: 'l' })],
    c: [el('wedge', { size: 1, slot: 'l' })],
    ops: [MV(0, 'r'), T(0, 90), F(0, 'black')],
    lures: [L('partial', MV(0, 'r'), F(0, 'black')), L('wrong', MV(0, 'r'), F(0, 'black'), S(0, 2)), L('copy')],
    answer: 3,
  },
  {
    key: 'sb21',
    level: 5,
    changes: ['place', 'look', 'turn'],
    a: [el('flag', { slot: 'l' }), el('square', { fill: 'gray', slot: 'r' })],
    c: [el('ell', { fill: 'gray', slot: 'l' }), el('circle', { fill: 'gray', slot: 'r' })],
    ops: [SW, F(1, 'black'), T(0, 90)],
    lures: [L('wrong', SW, F(1, 'black'), F(0, 'empty')), L('copy'), L('wrong', SW, M(0, 'v'), T(0, 90), F(0, 'empty'))],
    answer: 3,
  },
  {
    key: 'sb22',
    level: 5,
    changes: ['look', 'place', 'turn'],
    a: [el('square', { size: 3 }), el('flag', { fill: 'black', size: 1, slot: 'tl' })],
    c: [el('square', { size: 3 }), el('wedge', { size: 1, slot: 'tl' })],
    ops: [F(0, 'gray'), MV(1, 'bl'), T(1, 180)],
    lures: [L('wrong', F(0, 'gray'), MV(1, 'bl'), F(1, 'black')), L('wrong', MV(1, 'bl'), T(1, 90), F(1, 'black')), L('copy')],
    answer: 4,
  },
  {
    key: 'sb23',
    level: 5,
    changes: ['turn', 'look'],
    a: [el('flag', { slot: 'l' }), el('ell', { fill: 'gray', slot: 'r' })],
    c: [el('wedge', { slot: 'l' }), el('flag', { fill: 'black', slot: 'r' })],
    ops: [M(0, 'v'), F(0, 'black'), T(1, 270)],
    lures: [L('partial', M(0, 'v')), L('wrong', F(0, 'black'), T(1, 180), F(1, 'gray')), L('copy')],
    answer: 1,
  },
  {
    key: 'sb24',
    level: 5,
    changes: ['look', 'turn'],
    a: [el('hexagon', { size: 3 }), el('flag', { fill: 'black', size: 1 })],
    c: [el('circle', { size: 3 }), el('wedge', { size: 1 })],
    ops: [F(0, 'gray'), T(1, 90), S(1, 2)],
    lures: [L('extra', F(0, 'gray'), T(1, 90), S(1, 2), F(1, 'black')), L('wrong', F(0, 'gray'), T(1, 90), F(1, 'black')), L('partial', F(0, 'gray'))],
    answer: 2,
  },
];

/** Alıştırma: biri tek değişiklikli, öteki iki değişiklikli; yanlış seçeneklerde dört türün hepsi var. */
const PRACTICE_SPECS: (AnalogySpec & { explain: string })[] = [
  {
    key: 'sbp1',
    level: 1,
    changes: ['look'],
    a: [el('circle')],
    c: [el('triangle', { size: 1 })],
    ops: [F(0, 'black')],
    lures: [L('copy'), L('extra', F(0, 'black'), S(0, 2)), L('wrong', S(0, 2))],
    answer: 3,
    explain:
      'Birinci şekilden ikinciye yalnızca renk değişti: içi boş daire siyah oldu, büyüklüğü aynı kaldı. Üçüncü şekilde de yalnızca renk değişmeli: küçük üçgen siyah olur ama küçük kalır. B’deki büyük siyah üçgende büyüklük de değişmiş; D’deki büyük, içi boş üçgende ise renk yerine büyüklük değişmiş.',
  },
  {
    key: 'sbp2',
    level: 3,
    changes: ['turn', 'look'],
    a: [el('ell')],
    c: [el('flag')],
    ops: [T(0, 270), F(0, 'gray')],
    lures: [L('partial', F(0, 'gray')), L('wrong', T(0, 90), F(0, 'gray')), L('copy')],
    answer: 2,
    explain:
      'Burada iki şey değişti: şekil saat yönünün tersine çeyrek tur döndü ve rengi gri oldu. Bayrağa ikisini de uygulamak gerekir: B’de gri bayrak saat yönünün tersine dönmüş. A’da yalnızca renk değişmiş, dönüş eksik; C’de bayrak ters yöne, saat yönünde dönmüş; D’de hiçbir şey değişmemiş.',
  },
];

export const ANALOGY_SPECS: readonly AnalogySpec[] = SPECS;
export const ANALOGY_PRACTICE_SPECS: readonly AnalogySpec[] = PRACTICE_SPECS;

const built = SPECS.map(buildAnalogyItem);
const PRACTICE: AnalogyPracticeItem[] = PRACTICE_SPECS.map((s) => {
  const b = buildAnalogyItem(s);
  return { ...b.item, answer: b.answer, explain: s.explain };
});

const task: FiguralAnalogyTask = {
  key: 'sekil-benzetmeleri',
  kind: 'figural_analogy',
  name: 'Şekil Benzetmeleri',
  measures: 'İki şekil arasındaki ilişkiyi bulup başka bir şekle aynen uygulayabilmeyi ölçer.',
  instructions: [
    'Her soruda birinci şekil ikinci şekle dönüşüyor.',
    'Üçüncü şekil de aynı biçimde dönüşmeli: soru işaretinin yerine gelecek şekli dört seçenekten seç.',
    'Renk, büyüklük, yön (döndürme ya da ayna görüntüsü), yer ve sayı değişebilir; bazı sorularda birden çok şey değişir. Değişmeyen şeyler aynı kalmalı.',
  ],
  practice: PRACTICE,
  items: built.map((b) => b.item),
  answers: built.map((b) => b.answer),
  optionLures: built.map((b) => b.lures),
  optionMisses: built.map((b) => b.misses),
  levels: [
    { level: 1, name: 'Renk ya da büyüklük', plain: 'Bir şeklin yalnızca rengini ya da büyüklüğünü değiştiren tek bir değişikliği bulup uygulamak.' },
    { level: 2, name: 'Yön, yer ya da sayı', plain: 'Bir şeklin döndüğünü, ayna görüntüsüne çevrildiğini, yerinin ya da sayısının değiştiğini görüp aynısını uygulamak.' },
    { level: 3, name: 'Bir şekilde iki değişiklik', plain: 'Aynı şekilde birlikte olan iki değişikliği bulup ikisini de uygulamak.' },
    { level: 4, name: 'İki parçada iki değişiklik', plain: 'İki parçalı bir resimde her parçanın nasıl değiştiğini ayrı ayrı izleyip doğru parçaya uygulamak.' },
    { level: 5, name: 'Üç değişiklik', plain: 'Üç değişikliği birlikte akılda tutup hepsini doğru yönde ve doğru parçada uygulamak.' },
  ],
};

export const sekilBenzetmeleri: TaskInstrument = {
  slug: 'sekil-benzetmeleri',
  version: 1,
  engine: 'tasks',
  name: 'Şekil Benzetmeleri',
  shortName: 'Şekil benzetmeleri',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 49.05,
  tagline: 'İki şekil arasındaki ilişkiyi bulup başka bir şekle aynen uygulayabilmeyi ölçer: “Bu ona neyse, şu da …”.',
  description:
    'Bu test, iki şekil arasındaki ilişkiyi bulup başka bir şekle aynen uygulayabilmeyi, yani şekillerle benzetme kurarak akıl yürütmeyi ölçer. Her soruda birinci şekil ikinci şekle dönüşür; üçüncü şeklin aynı biçimde dönüşmüş hâli dört seçenekten seçilir. Değişiklikler renk, büyüklük, döndürme, ayna görüntüsü, yer ve sayıdır. Sorular kolaydan zora doğru beş düzeyde ilerler: tek bir değişiklikle başlar, iki ve üç değişikliğe ve iki parçalı şekillere uzanır. Bütün şekiller ve sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar soruların çoğunun doğru bulunduğunu, hangi tür değişikliklerin daha kolay geldiğini, yanlışlarda hangi tür şeklin seçildiğini ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Şekillerle benzetme kur',
    paragraphs: [
      'Birazdan her soruda üç şekil ve bir soru işareti göreceksin. Birinci şekil ikinci şekle dönüşüyor; üçüncü şeklin de aynı biçimde dönüşmüş hâlini bulacaksın.',
      `Test ${SPECS.length} sorudan oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok, ama her soruya gereğinden fazla takılıp kalma.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'sb_dogru', name: 'Doğru cevaplar', plain: 'Doğru şeklin seçildiği soruların sayısı.' },
    { key: 'sb_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    {
      key: 'sb_tur',
      name: 'Değişiklik türleri',
      plain: 'Renk ve büyüklük, döndürme ve ayna görüntüsü, yer ve sayı değişikliklerinin, geçtikleri sorularda doğru uygulanıp uygulanmadığı; her değişiklik ayrı sayılır.',
    },
    {
      key: 'sb_yanilgi',
      name: 'Yanlışlarda seçilen şekiller',
      plain: 'Yanlış cevaplarda değişikliklerin hiç uygulanmadığı, bir kısmının uygulandığı, yanlış uygulandığı ya da fazladan bir değişikliğin yapıldığı şekillerden hangisinin seçildiği.',
    },
    { key: 'sb_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve cevapların hep aynı sıradaki seçeneğe kayıp kaymadığı.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Şekil benzetmesi (geometrik ya da şekilsel analoji) düzeni: “Birinci şekil ikinciye neyse, üçüncü şekil de soru işaretine odur” (A : B :: C : ?). Birinci şekilden ikinciye olan değişiklik bir kuraldır; bu kuralı bulup üçüncü şekle uygulamak gerekir (Blum ve Holling, 2018). Sorulardaki değişiklikler (renk, büyüklük, döndürme, ayna görüntüsü, yer ve sayı), bu tür soruları inceleyen araştırmalarda kullanılan değişiklik türlerinden seçilmiştir (Novick ve Tversky, 1987; Stevenson, Alberto ve ark., 2014). Yanlış seçeneklerin ikisi, çocukların bu sorulardaki tipik cevaplarına dayanır: üçüncü şeklin hiç değişmemiş hâli ve değişikliklerin yalnızca bir kısmının uygulandığı şekil (Tunteler ve ark., 2008; Thibaut ve ark., 2010). Öteki ikisinde bir değişiklik yanlış uygulanmıştır ya da fazladan bir değişiklik yapılmıştır; böylece yanlış seçenekler hem doğru cevaba hem de birbirine benzer (Blum ve ark., 2011). Seçenekler, soruya bakmadan yalnızca seçeneklerden doğru cevabın bulunamayacağı bir düzenle seçilmiştir (Hu ve ark., 2021). Bütün şekiller, sorular ve seçenekler Ölçekhane tarafından özgün olarak hazırlanmıştır; zekâ ve yetenek testlerinin soruları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'İki şekil arasındaki ilişkiyi bulup aynı ilişkiyi başka bir şekle uygulayabilmeyi, yani şekillerle benzetme kurarak akıl yürütmeyi ölçer. Benzetme kurmak, insan düşüncesinin temel bir özelliği ve öğrenme için önemli bir beceri olarak görülür (Stevenson, Alberto ve ark., 2014). Benzetme soruları, kuralları ve düzenlilikleri bulmaya dayanan tümevarımsal akıl yürütme görevlerindendir; diziler ve matrislerle aynı aileden sayılır (Klauer ve Phye, 2008). Genel zihinsel yetenekle en güçlü ilişki gösteren soru türleri arasında yer alır (Sternberg, 1982, aktaran Blum ve Holling, 2018). Yetişkinlerde şekil benzetmelerindeki başarı, şekilleri zihinde canlandırıp değiştirmeyi ölçen uzamsal testlerle orta ile yüksek düzeyde ilişkilidir (Novick ve Tversky, 1987).\n\nBir soruyu zorlaştıran en önemli şey, akılda tutulması gereken değişikliklerin ve parçaların sayısıdır. Yetişkinlerle yapılan bir çalışmada kural sayısı arttıkça doğru cevap oranı düşmüş (r = −.60), cevap süresi uzamıştır (r = .83) (Blum ve Holling, 2018). 5–9 yaşındaki çocuklarda da her fazladan değişiklik doğru cevap olasılığını düşürmüştür (Stevenson, Hickendorff ve ark., 2013). Parça sayısı ile değişiklik sayısı birlikte arttığında zorluk, ikisinin ayrı ayrı etkisinden daha çok artar; bunun, sorunun işleyen belleğin sınırını aşmasından kaynaklandığı düşünülmektedir (Mulholland ve ark., 1980, aktaran Lovett ve Forbus, 2012). Değişikliğin türü de önemlidir: 4–12 yaşındaki 1.422 çocukla yapılan bir çalışmada renk ve büyüklük değişiklikleri, yön, yer ve sayı değişikliklerinden daha kolay çözülmüş; bu fark yaş ve işleyen bellek arttıkça azalmıştır (Stevenson, Alberto ve ark., 2014). Bu testin beş düzeyi ve raporda anlatılan değişiklik türleri bu bulgulara göre kurulmuştur.\n\nBu tür soruları çözmenin iki yolu vardır: cevabı önce zihinde kurup sonra seçeneklerde aramak ya da seçenekleri tek tek soruyla karşılaştırıp yanlışları elemek (Becker ve ark., 2016). Göz hareketleriyle yapılan araştırmalar, cevabı önce zihinde kurmanın daha iyi bir yol olduğunu düşündürmektedir (Bethell-Fox ve ark., 1984, aktaran Laurence ve ark., 2018). Sorular zorlaştıkça insanlar seçenekleri tek tek denemeye geçebilir (Bethell-Fox ve ark., 1984, aktaran Lovett ve Forbus, 2012). Üniversite öğrencileriyle yapılan bir şekil testi çalışmasında, soru ile seçenekler arasında daha az gidip gelenler daha çok soruyu doğru cevaplamıştır (r = −.68; Laurence ve ark., 2018). 5–7 yaşındaki çocuklarda da önce birinci ve ikinci şekle bakmak daha çok doğru cevapla birlikte görülmüştür (r = .71; Starr ve ark., 2018). Resimli benzetmelerle yapılan bir çalışmada, 4–6 yaşındaki çocuklara ilk iki resmi önce göstermek ya da aralarındaki ilişkiyi söyletmek doğru cevapları biraz artırmıştır (%60’tan %65–66’ya; Glady ve ark., 2017). Seçenekler eleyerek çözmeye izin verdiğinde test sonucunun genel zihinsel yetenekle ilişkisi, cevabı zihinde kurmayı gerektiren seçeneklere göre daha düşük bulunmuştur (Arendasy ve Sommer, 2013, aktaran Becker ve ark., 2016). Bu yüzden bu testin seçenekleri, eleyerek ya da seçeneklerin ortak özelliklerine bakarak cevabı bulmayı zorlaştıracak biçimde seçilmiştir.\n\nÇocukların yanlışları belli türlerde toplanır. Benzetme kuramayan çocuklar çoğu zaman şekillerden birini olduğu gibi kopyalar; benzetme kurmaya başlayan çocuklar ise bazen değişikliklerin yalnızca bir kısmını uygular (Tunteler ve ark., 2008). 1. ve 2. sınıflardaki çocuklarla yapılan bir çalışmada, soruları henüz benzetme kurarak çözmeyen çocukların çözümlerinin yaklaşık %58’i bu kopyalama türündeyken benzetme kuran çocuklarda bu oran yaklaşık %3’tür (Hosenfeld ve ark., 1997, aktaran Doumas ve ark., 2018). Seçenekler arasında birinci, ikinci ve üçüncü şeklin aynıları birlikte bulunduğunda, 6, 8 ve 14 yaşındaki çocukların yanlışlarının çoğu üçüncü şeklin aynısında toplanmıştır. 6 yaşındakiler fark ettikleri ilk benzerliği seçmiş gibi görünmektedir; 14 yaşındakiler bu tür seçeneklerden çok daha az etkilenmiştir (Thibaut ve ark., 2010). Resimli benzetmelerde de çocukların dikkat dağıtan bir nesneyi seçmesi, ilişkiyi yanlış kurmasından daha sıktır ve bu eğilim yaşla azalır (Richland ve ark., 2006). Bu testin raporu, yanlışlarda hangi tür şeklin seçildiğini bu yüzden ayrıca anlatır.\n\nAnaokulundan 2. sınıfa kadar olan çocuklarda benzetme testindeki başarı, o yılki ve sonraki matematik ve okuma başarısını işleyen bellekten ayrı olarak da yordamıştır (Stevenson, Bergwerff ve ark., 2014). Benzetme kurmak öğretilebilir: benzerlikleri ve farkları karşılaştırmayı öğreten eğitimleri birleştiren bir incelemede, bu eğitimlerin zekâ testlerindeki sonuçları ortalama yarım standart sapma kadar, okuldaki öğrenmeyi ise biraz daha fazla artırdığı bulunmuştur. Ancak bu çalışmaların çoğu küçük ve yarı deneyseldir; yarısına yakını programın yazarı ya da öğrencileri tarafından yapılmıştır (Klauer ve Phye, 2008). Aynı tür sorularla alıştırma yapmak da o sorulardaki başarıyı artırır (Tunteler ve ark., 2008); bu, genel bir yeteneğin arttığı anlamına gelmez. Bu test bir zekâ puanı (IQ) vermez; sonuç, şekillerle benzetme kurma becerisinin bugünkü durumunu anlatır.',
    turkishVersion: 'Özgün test. Şekiller, sorular ve yönergeler Ölçekhane tarafından hazırlanmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her sorunun tek doğru cevabı olduğu, bağımsız ikinci bir bilgisayar programıyla denetlenmiştir. Program şekilleri çizim olarak karşılaştırır ve birinci şekli ikinciye götüren bütün yorumları arar: döndürme, ayna görüntüsü, renk, büyüklük, yer, sayı ve iki parçanın yer değiştirmesi. En yalın yorumlar üçüncü şekle uygulandığında her soruda yalnızca doğru seçenek çıkar; yanlış seçeneklerin hiçbiri bir fazla değişiklikli bir yorumla da çıkmaz. Yanlış seçeneklerin türleri de aynı programla denetlenmiştir. Soruya bakmadan yalnızca seçeneklerden cevabı bulmaya çalışan on kestirme yol da denenmiştir: seçeneklerde en sık görülen özellikleri seçmek, ikinci şekle en çok benzeyeni seçmek, üçüncü şekilden en az ya da en çok farklı olanı seçmek gibi. Bunlardan dokuzu 24 sorunun en çok 7’sini doğru bulur; rastgele seçimde beklenen 6’dır. Değişiklik sayısını bulup üçüncü şekilden o kadar özellikle ayrılan seçeneği seçmek yaklaşık 10 doğru verir; bu yol değişikliklerin neler olduğunu bulmayı gerektirir ama nasıl uygulanacaklarını atlar. Yetişkinlerle yapılan başka bir şekil benzetmesi testinin güvenirliği yüksek bulunmuştur (Cronbach alfa = .89; Blum ve Holling, 2018); ancak bu sonuç bu teste aktarılamaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ve hangi tür değişikliklerde ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Ekim 2026’da yapılan taramada, Türkiye’de şekil benzetmeleri için Türkçe normları yayımlanmış bir test uyarlaması bulunamadı.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Şekil benzetmelerindeki başarı çocukluk boyunca artar: ortalama bir soruyu doğru çözme olasılığı 5 yaşında .42, 9 yaşında .58 bulunmuştur (Stevenson, Alberto ve ark., 2014). Dikkat dağıtan benzerliklere rağmen ilişkiyi güvenilir biçimde kurabilmek çoğu çocukta 9–11 yaşlarına doğru görülür (Richland ve ark., 2006, aktaran Vendetti ve ark., 2015). Sayı ve sözcük benzetmelerini de içeren tümevarımsal akıl yürütme testlerinde en hızlı gelişme 5. ile 9. sınıflar arasında görülmüş, 9. sınıftan sonra değişim azalmıştır (Csapó, 1997). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir. Süre sınırı yoktur. Şekiller yalnızca beyaz, gri ve siyahla çizilir; renkleri ayırt etmeyi gerektirmez. Telefonla da çözülebilir; şekillerin rahat görülmesi için büyük bir ekran önerilir.',
    license: 'Özgün test. Şekiller, sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Akıl yürütmenin yalnızca şekillerle kurulan benzetmeler yoluyla yapılan yönünü ölçer; sözel ve sayısal akıl yürütme, bilgi, bellek ve hız gibi öteki beceriler hakkında bilgi vermez.',
      'Her soruda dört seçenek olduğu için rastgele seçen biri de soruların yaklaşık dörtte birini doğru bulabilir; düşük sonuçlar bu yüzden dikkatle yorumlanmalıdır.',
      'Düzeyler değişikliklerin sayısına ve türüne göre, araştırma bulgularına dayanarak kurulmuştur; soruların bu testteki gerçek zorluk sırası henüz katılımcı verileriyle sınanmadı. Değişiklik türlerinin zorluğu yaşa göre de değişebilir: yetişkinlerle yapılan bir çalışmada döndürme ve büyüklük değişiklikleri, yer değişikliğinden daha çok yanlışa yol açmıştır (Novick ve Tversky, 1987).',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenir. Zihinsel beceri testleri yeniden çözüldüğünde sonuçlar genellikle yükselir (Scharfen ve ark., 2018); bu test yeniden çözüldüğünde soruları hatırlamak da sonucu yükseltebilir.',
      'Benzetme kurmayı öğreten ya da aynı tür sorularla alıştırma yaptıran çalışmalar bu sorulardaki sonucu yükseltir (Tunteler ve ark., 2008; Klauer ve Phye, 2008); yükselen bir sonuç tek başına genel bir yeteneğin arttığını göstermez.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Becker, N., Schmitz, F., Falk, A. M., Feldbrügge, J., Recktenwald, D. R., Wilhelm, O., Preckel, F. ve Spinath, F. M. (2016). Preventing response elimination strategies improves the convergent validity of figural matrices. Journal of Intelligence, 4(1), 2.',
        url: 'https://doi.org/10.3390/jintelligence4010002',
      },
      {
        text: 'Blum, D. ve Holling, H. (2018). Automatic generation of figural analogies with the IMak package. Frontiers in Psychology, 9, 1286.',
        url: 'https://doi.org/10.3389/fpsyg.2018.01286',
      },
      {
        text: 'Blum, G. D., Abal, F. J. P., Lozzia, G. S., Picón Janeiro, J. C. ve Attorresi, H. F. (2011). Analogías de figuras: Teoría y construcción de ítemes. Interdisciplinaria, 28(1), 131–144.',
        url: 'https://www.redalyc.org/pdf/180/18022327008.pdf',
      },
      {
        text: 'Csapó, B. (1997). The development of inductive reasoning: Cross-sectional assessments in an educational context. International Journal of Behavioral Development, 20(4), 609–626.',
        url: 'https://doi.org/10.1080/016502597385081',
      },
      {
        text: 'Doumas, L. A. A., Morrison, R. G. ve Richland, L. E. (2018). Individual differences in relational learning and analogical reasoning: A computational model of longitudinal change. Frontiers in Psychology, 9, 1235.',
        url: 'https://doi.org/10.3389/fpsyg.2018.01235',
      },
      {
        text: 'Glady, Y., French, R. M. ve Thibaut, J.-P. (2017). Children’s failure in analogical reasoning tasks: A problem of focus of attention and information integration? Frontiers in Psychology, 8, 707.',
        url: 'https://doi.org/10.3389/fpsyg.2017.00707',
      },
      {
        text: 'Hu, S., Ma, Y., Liu, X., Wei, Y. ve Bai, S. (2021). Stratified rule-aware network for abstract visual reasoning. Proceedings of the AAAI Conference on Artificial Intelligence, 35(2), 1567–1574.',
        url: 'https://doi.org/10.1609/aaai.v35i2.16248',
      },
      {
        text: 'Klauer, K. J. ve Phye, G. D. (2008). Inductive reasoning: A training approach. Review of Educational Research, 78(1), 85–123.',
        url: 'https://doi.org/10.3102/0034654307313402',
      },
      {
        text: 'Laurence, P. G., Mecca, T. P., Serpa, A., Martin, R. ve Macedo, E. C. (2018). Eye movements and cognitive strategy in a fluid intelligence test: Item type analysis. Frontiers in Psychology, 9, 380.',
        url: 'https://doi.org/10.3389/fpsyg.2018.00380',
      },
      {
        text: 'Lovett, A. ve Forbus, K. (2012). Modeling multiple strategies for solving geometric analogy problems [Bildiri]. Qualitative Reasoning Group, Northwestern University.',
        url: 'https://www.qrg.northwestern.edu/papers/Files/QRG_Dist_Files/QRG_2012/Lovett_CogSci12_GeoAnalogy_Final.pdf',
      },
      {
        text: 'Novick, L. R. ve Tversky, B. (1987). Cognitive constraints on ordering operations: The case of geometric analogies. Journal of Experimental Psychology: General, 116(1), 50–67.',
        url: 'https://www.tc.columbia.edu/faculty/bt2158/faculty-profile/files/orderingoperations_Thecaseofgeometricanalogies.pdf',
      },
      {
        text: 'Richland, L. E., Morrison, R. G. ve Holyoak, K. J. (2006). Children’s development of analogical reasoning: Insights from scene analogy problems. Journal of Experimental Child Psychology, 94(3), 249–273.',
        url: 'https://doi.org/10.1016/j.jecp.2006.02.002',
      },
      {
        text: 'Scharfen, J., Peters, J. M. ve Holling, H. (2018). Retest effects in cognitive ability tests: A meta-analysis. Intelligence, 67, 44–66.',
        url: 'https://doi.org/10.1016/j.intell.2018.01.003',
      },
      {
        text: 'Starr, A., Vendetti, M. S. ve Bunge, S. A. (2018). Eye movements provide insight into individual differences in children’s analogical reasoning strategies. Acta Psychologica, 186, 18–26.',
        url: 'https://doi.org/10.1016/j.actpsy.2018.04.002',
      },
      {
        text: 'Stevenson, C. E., Alberto, R. A., van den Boom, M. A. ve de Boeck, P. A. L. (2014). Visual relations children find easy and difficult to process in figural analogies. Frontiers in Psychology, 5, 827.',
        url: 'https://doi.org/10.3389/fpsyg.2014.00827',
      },
      {
        text: 'Stevenson, C. E., Bergwerff, C. E., Heiser, W. J. ve Resing, W. C. M. (2014). Working memory and dynamic measures of analogical reasoning as predictors of children’s math and reading achievement. Infant and Child Development, 23(1), 51–66.',
        url: 'https://doi.org/10.1002/icd.1833',
      },
      {
        text: 'Stevenson, C. E., Hickendorff, M., Resing, W. C. M., Heiser, W. J. ve de Boeck, P. A. L. (2013). Explanatory item response modeling of children’s change on a dynamic test of analogical reasoning. Intelligence, 41(3), 157–168.',
        url: 'https://doi.org/10.1016/j.intell.2013.01.003',
      },
      {
        text: 'Thibaut, J.-P., French, R. ve Vezneva, M. (2010). The development of analogy making in children: Cognitive load and executive functions. Journal of Experimental Child Psychology, 106, 1–19.',
        url: 'https://doi.org/10.1016/j.jecp.2010.01.001',
      },
      {
        text: 'Tunteler, E., Pronk, C. M. E. ve Resing, W. C. M. (2008). Inter- and intra-individual variability in the process of change in the use of analogical strategies to solve geometric tasks in children: A microgenetic analysis. Learning and Individual Differences, 18, 44–60.',
        url: 'https://doi.org/10.1016/j.lindif.2007.07.007',
      },
      {
        text: 'Vendetti, M. S., Matlen, B. J., Richland, L. E. ve Bunge, S. A. (2015). Analogical reasoning in the classroom: Insights from cognitive science. Mind, Brain, and Education, 9(2), 100–106.',
        url: 'https://doi.org/10.1111/mbe.12080',
      },
    ],
  },
};
