/**
 * Sözel akıl yürütmenin sıralama ve mantıksal çıkarım soruları için bağımsız denetleyici (tests/sozel-akil-yurutme.test.ts).
 * Her soru burada biçimsel olarak yeniden yazılır; denetleyici verilen bilgilere uyan BÜTÜN olasılıkları (sıralamalarda
 * bütün dizilişleri, çıkarımlarda bütün küme durumlarını) tek tek dener ve her seçeneğin her olasılıkta mı (kesinlikle
 * doğru), bazısında mı (olabilir) yoksa hiçbirinde mi (kesinlikle yanlış) doğru olduğunu bulur. Bir sorunun tek doğru
 * cevabı, kesinlikle doğru olan tek seçenektir.
 *
 * Biçimsel yazımın sorunun Türkçe metniyle aynı şeyi söylediği gözle denetlenir: her kaydın yanında sorunun bilgileri ve
 * seçenekleri yazılıdır.
 */

export type Verdict = 'kesin' | 'olabilir' | 'yanlış';

const verdict = (truths: boolean[]): Verdict => (truths.every(Boolean) ? 'kesin' : truths.some(Boolean) ? 'olabilir' : 'yanlış');

/* ---------- Sıralamalar ---------- */

/** n kişinin bütün dizilişleri: pos[kişi] = sıra (0'dan başlar; hepsi farklı). */
function permutations(n: number): number[][] {
  if (n === 0) return [[]];
  return permutations(n - 1).flatMap((p) => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)]));
}

type Pos = Record<string, number>;

interface OrderingSpec {
  people: string[];
  /** Bilgiler, sorudaki sırayla (her biri bir koşul). */
  facts: ((p: Pos) => boolean)[];
  /** "Kim" soruları: o dizilişte cevap olan kişi. Seçenekler kişilerin adı ve sonda "bilinemez"dir. */
  who?: (p: Pos, among: string[]) => string;
  /** "Hangisi kesinlikle doğrudur" soruları: her seçeneğin o dizilişte doğru olup olmadığı. */
  statements?: ((p: Pos) => boolean)[];
  /** Seçeneklerin sırası ("kim" sorularında kişilerin adları; sonuncusu bilinemez). */
  options?: string[];
}

function orderings(spec: OrderingSpec, facts = spec.facts, people = spec.people): Pos[] {
  return permutations(people.length)
    .map((perm) => Object.fromEntries(people.map((name, i) => [name, perm[i]])) as Pos)
    .filter((p) => facts.every((f) => f(p)));
}

const lowest = (p: Pos, among: string[]) => among.reduce((a, b) => (p[b] < p[a] ? b : a));
const highest = (p: Pos, among: string[]) => among.reduce((a, b) => (p[b] > p[a] ? b : a));

/**
 * Sıralama soruları. Sıra numarası 0'dan başlar: koşuda 0 en hızlı, kalemlerde 0 en uzun, uyanmada 0 ilk uyanan,
 * fotoğrafta 0 en sol, yaşta 0 en büyük, apartmanda 0 1. kat.
 */
export const ORDERING: Record<string, OrderingSpec> = {
  // Alıştırma: mavi kutu kırmızıdan ağır; kırmızı kutu sarıdan ağır (0 en ağır). En hafif? Dördüncü seçenek ("Üç kutu aynı
  // ağırlıktadır") bilgilerle çelişir.
  szp3: {
    people: ['Mavi', 'Kırmızı', 'Sarı'],
    facts: [(p) => p.Mavi < p.Kırmızı, (p) => p.Kırmızı < p.Sarı],
    statements: [(p) => highest(p, ['Mavi', 'Kırmızı', 'Sarı']) === 'Mavi', (p) => highest(p, ['Mavi', 'Kırmızı', 'Sarı']) === 'Kırmızı', (p) => highest(p, ['Mavi', 'Kırmızı', 'Sarı']) === 'Sarı', () => false, () => false],
  },
  // Kerem > Defne > Umut > Sena (hız). En yavaş?
  sz02: {
    people: ['Defne', 'Kerem', 'Sena', 'Umut'],
    facts: [(p) => p.Kerem < p.Defne, (p) => p.Defne < p.Umut, (p) => p.Umut < p.Sena],
    who: highest,
    options: ['Defne', 'Kerem', 'Sena', 'Umut'],
  },
  // Kırmızı mavi'den uzun; yeşil kırmızıdan uzun; sarı maviden kısa. En uzun?
  sz08: {
    people: ['Kırmızı', 'Mavi', 'Sarı', 'Yeşil'],
    facts: [(p) => p.Kırmızı < p.Mavi, (p) => p.Yeşil < p.Kırmızı, (p) => p.Mavi < p.Sarı],
    who: lowest,
    options: ['Kırmızı', 'Mavi', 'Sarı', 'Yeşil'],
  },
  // Deniz, Zeynep'ten önce; Murat, Deniz'den önce; Selin, Deniz'den sonra.
  sz10: {
    people: ['Deniz', 'Zeynep', 'Murat', 'Selin'],
    facts: [(p) => p.Deniz < p.Zeynep, (p) => p.Murat < p.Deniz, (p) => p.Selin > p.Deniz],
    statements: [
      (p) => p.Zeynep === 3, // Zeynep en son uyanan kardeştir.
      (p) => p.Selin > p.Zeynep, // Selin, Zeynep'ten sonra uyandı.
      (p) => p.Deniz === 0, // Deniz ilk uyanan kardeştir.
      (p) => p.Selin < p.Murat, // Selin, Murat'tan önce uyandı.
      (p) => p.Murat < p.Selin, // Murat, Selin'den önce uyandı.
    ],
  },
  // Fotoğrafta soldan sağa 0–4. Tolga tam ortada; Ceren, Tolga'nın hemen solunda; Okan, Pelin'in hemen solunda. En solda?
  sz16: {
    people: ['Ceren', 'Duru', 'Okan', 'Pelin', 'Tolga'],
    facts: [(p) => p.Tolga === 2, (p) => p.Ceren === p.Tolga - 1, (p) => p.Okan === p.Pelin - 1],
    who: lowest,
    options: ['Ceren', 'Duru', 'Okan', 'Pelin'],
  },
  // Yaş: 0 en büyük. Melis Ozan'dan büyük; Nehir Ozan'dan büyük; Tuna Melis'ten büyük. En büyük?
  sz19: {
    people: ['Melis', 'Nehir', 'Ozan', 'Tuna'],
    facts: [(p) => p.Melis < p.Ozan, (p) => p.Nehir < p.Ozan, (p) => p.Tuna < p.Melis],
    who: lowest,
    options: ['Melis', 'Nehir', 'Ozan', 'Tuna'],
  },
  // Kat: 0 = 1. kat. Arda, Begüm'ün bir üst katında; Cansu, Arda'dan üstte; Efe, Begüm'den altta; Doruk 1. katta değil.
  sz22: {
    people: ['Arda', 'Begüm', 'Cansu', 'Doruk', 'Efe'],
    facts: [(p) => p.Arda === p.Begüm + 1, (p) => p.Cansu > p.Arda, (p) => p.Efe < p.Begüm, (p) => p.Doruk !== 0],
    statements: [
      (p) => p.Arda === 2, // Arda 3. katta oturuyor.
      (p) => p.Doruk > p.Cansu, // Doruk, Cansu'dan daha üst bir katta oturuyor.
      (p) => p.Efe === 0, // Efe 1. katta oturuyor.
      (p) => p.Begüm > p.Arda, // Begüm, Arda'dan daha üst bir katta oturuyor.
      (p) => p.Cansu === 4, // Cansu en üst katta oturuyor.
    ],
  },
};

/** Bir sıralama sorusunun seçeneklerinin hükmü (kim sorularında sonuncu seçenek "bilinemez"). */
export function orderingVerdicts(key: string): { verdicts: Verdict[]; models: number } {
  const spec = ORDERING[key];
  const models = orderings(spec);
  if (spec.statements) return { verdicts: spec.statements.map((s) => verdict(models.map((m) => s(m)))), models: models.length };
  const answers = models.map((m) => spec.who!(m, spec.people));
  const names = spec.options!.map((name) => verdict(answers.map((a) => a === name)));
  const known = names.some((v) => v === 'kesin');
  return { verdicts: [...names, known ? 'yanlış' : 'kesin'], models: models.length };
}

/**
 * Bilgilerin yalnızca ilk k tanesine ve bu bilgilerde adı geçen kişilere bakılınca bulunan cevap (kim sorularında
 * çeldiricinin nasıl bulunduğu): her dizilişte aynı kişi çıkıyorsa o kişi, yoksa null.
 */
export function partialWho(key: string, k: number, mentioned: string[]): string | null {
  const spec = ORDERING[key];
  const answers = new Set(orderings(spec, spec.facts.slice(0, k)).map((m) => spec.who!(m, mentioned)));
  return answers.size === 1 ? [...answers][0] : null;
}

/* ---------- Mantıksal çıkarım ---------- */

/**
 * Bir "dünya": k özelliğin (küme) birleşimlerinden hangilerinin dolu olduğu (bölge = bit maskesi), adı geçen
 * bireylerin hangi bölgede olduğu ve konuyla ilgisiz serbest önermelerin doğruluğu. Tek yerli yüklemlerle kurulan
 * cümlelerin doğruluğu yalnızca bunlara bağlıdır; bu yüzden bütün dünyalar sınırlı sayıdadır ve tek tek denenebilir.
 */
interface World {
  regions: Set<number>;
  at: Record<string, number>;
  free: boolean[];
}

interface DeductionSpec {
  sets: string[];
  individuals: string[];
  /** Konuyla ilgisiz serbest önermelerin sayısı (ör. "Kaan'ın takımı maçı kazandı"). */
  free: number;
  /** Dünya bilgisi (ör. bir top hem kırmızı hem mavi olamaz) ve sorunun bilgileri. */
  facts: ((w: Q) => boolean)[];
  options: ((w: Q) => boolean)[];
}

/** Bir dünyada cümle kurmaya yarayan sözcükler. */
export interface Q {
  all: (a: string, b: string) => boolean;
  no: (a: string, b: string) => boolean;
  some: (a: string, b: string) => boolean;
  someNot: (a: string, b: string) => boolean;
  is: (x: string, a: string) => boolean;
  free: (i: number) => boolean;
  /** Bütün bireyler (alanın tamamı) bu özelliği taşır. */
  every: (a: string) => boolean;
}

function query(spec: DeductionSpec, w: World): Q {
  const bit = (a: string) => {
    const i = spec.sets.indexOf(a);
    if (i < 0) throw new Error(`Bilinmeyen küme: ${a}`);
    return 1 << i;
  };
  const occupied = [...w.regions];
  return {
    all: (a, b) => occupied.every((r) => !(r & bit(a)) || !!(r & bit(b))),
    no: (a, b) => occupied.every((r) => !(r & bit(a)) || !(r & bit(b))),
    some: (a, b) => occupied.some((r) => !!(r & bit(a)) && !!(r & bit(b))),
    someNot: (a, b) => occupied.some((r) => !!(r & bit(a)) && !(r & bit(b))),
    is: (x, a) => !!(w.at[x] & bit(a)),
    free: (i) => w.free[i],
    every: (a) => occupied.every((r) => !!(r & bit(a))),
  };
}

function* worlds(spec: DeductionSpec): Generator<World> {
  const k = spec.sets.length;
  if (k > 4) throw new Error('En çok dört küme: dünya sayısı hızla büyür.');
  const nRegions = 1 << k;
  for (let mask = 1; mask < 1 << nRegions; mask++) {
    const regions = new Set(Array.from({ length: nRegions }, (_, r) => r).filter((r) => mask & (1 << r)));
    // Adı geçen her özellik en az bir şeyde vardır (günlük dilde "bütün balıklar" balıkların var olduğunu varsayar).
    if (spec.sets.some((_, i) => ![...regions].some((r) => r & (1 << i)))) continue;
    const places = [...regions];
    const assign = (i: number, at: Record<string, number>): Record<string, number>[] =>
      i === spec.individuals.length ? [at] : places.flatMap((r) => assign(i + 1, { ...at, [spec.individuals[i]]: r }));
    for (const at of assign(0, {})) {
      for (let f = 0; f < 1 << spec.free; f++) {
        yield { regions, at, free: Array.from({ length: spec.free }, (_, i) => !!(f & (1 << i))) };
      }
    }
  }
}

export const DEDUCTION: Record<string, DeductionSpec> = {
  // Bir kutudaki bütün toplar kırmızıydı. Ela bu kutudan bir top aldı. (top: Ela'nın aldığı top)
  sz04: {
    sets: ['kutudakiTop', 'kırmızı', 'mavi', 'kutudakiOyuncak'],
    individuals: ['top'],
    free: 2,
    facts: [
      (q) => q.no('kırmızı', 'mavi'), // dünya bilgisi: bir şey hem kırmızı hem mavi olamaz
      (q) => q.all('kutudakiTop', 'kutudakiOyuncak'), // dünya bilgisi: top bir oyuncaktır
      (q) => q.all('kutudakiTop', 'kırmızı'),
      (q) => q.is('top', 'kutudakiTop'),
    ],
    options: [
      (q) => q.free(0), // Ela kırmızı rengi sever.
      (q) => q.free(1), // Ela'nın aldığı top büyüktür. (büyüklük bilgilerde geçmez)
      (q) => q.some('kutudakiTop', 'mavi'), // Kutuda mavi bir top vardı.
      (q) => q.all('kutudakiOyuncak', 'kutudakiTop'), // Kutudaki bütün oyuncaklar toptu.
      (q) => q.is('top', 'kırmızı'), // Ela'nın aldığı top kırmızıdır.
    ],
  },
  // Yusuf, yağmur yağan her gün şemsiyesini yanına alır. Dün yağmur yağdı. (Alan: günler.)
  sz07: {
    sets: ['yağmurlu', 'şemsiyeli'],
    individuals: ['dün', 'bugün'],
    free: 1,
    facts: [(q) => q.all('yağmurlu', 'şemsiyeli'), (q) => q.is('dün', 'yağmurlu')],
    options: [
      (q) => q.is('dün', 'şemsiyeli'), // Yusuf dün şemsiyesini yanına aldı.
      (q) => q.free(0), // Yusuf dün evden çıkmadı.
      (q) => q.all('şemsiyeli', 'yağmurlu'), // Yağmur yağmayan günlerde Yusuf şemsiyesini yanına almaz.
      (q) => q.every('şemsiyeli'), // Yusuf her gün şemsiyesini yanına alır.
      (q) => q.is('bugün', 'yağmurlu'), // Bugün de yağmur yağacak.
    ],
  },
  // Alıştırma: Bütün kuşların tüyü vardır. Maviş bir kuştur.
  szp4: {
    sets: ['kuş', 'tüylü', 'kedi'],
    individuals: ['Maviş'],
    free: 2,
    facts: [(q) => q.no('kuş', 'kedi'), (q) => q.all('kuş', 'tüylü'), (q) => q.is('Maviş', 'kuş')],
    options: [
      (q) => q.free(0), // Maviş şarkı söyler.
      (q) => q.is('Maviş', 'kedi'), // Maviş bir kedidir.
      (q) => q.every('tüylü'), // Bütün hayvanların tüyü vardır.
      (q) => q.is('Maviş', 'tüylü'), // Maviş'in tüyü vardır.
      (q) => q.free(1), // Maviş'in rengi mavidir.
    ],
  },
  // Bütün balıklar ağaçlara tırmanabilir. Hamsi bir balıktır.
  sz13: {
    sets: ['balık', 'tırmanır', 'yüzer', 'denizde'],
    individuals: ['hamsi'],
    free: 0,
    facts: [(q) => q.all('balık', 'tırmanır'), (q) => q.is('hamsi', 'balık')],
    options: [
      (q) => q.someNot('balık', 'tırmanır'), // Bazı balıklar ağaçlara tırmanamaz.
      (q) => q.is('hamsi', 'denizde'), // Hamsi denizde yaşar.
      (q) => !q.is('hamsi', 'balık'), // Hamsi bir balık değildir.
      (q) => q.is('hamsi', 'tırmanır'), // Hamsi ağaçlara tırmanabilir.
      (q) => q.no('balık', 'yüzer'), // Hiçbir balık yüzemez.
    ],
  },
  // Bu maçta kırmızı kart gören her oyuncu oyundan atıldı. Kaan bu maçta oynadı ve maçın sonuna kadar sahada kaldı.
  // (Alan: bu maçta oynayanlar.)
  sz17: {
    sets: ['kırmızıKart', 'atıldı', 'sahadanÇıktı', 'sarıKart'],
    individuals: ['Kaan'],
    free: 1,
    facts: [
      (q) => q.all('atıldı', 'sahadanÇıktı'), // dünya bilgisi: oyundan atılan sahadan çıkar
      (q) => q.all('kırmızıKart', 'atıldı'),
      (q) => !q.is('Kaan', 'sahadanÇıktı'),
    ],
    options: [
      (q) => q.is('Kaan', 'kırmızıKart'), // Kaan bu maçta kırmızı kart gördü.
      (q) => q.is('Kaan', 'sarıKart'), // Kaan bu maçta sarı kart gördü.
      (q) => q.free(0), // Kaan'ın takımı maçı kazandı.
      (q) => !q.is('Kaan', 'kırmızıKart'), // Kaan bu maçta kırmızı kart görmedi.
      (q) => q.all('sahadanÇıktı', 'kırmızıKart'), // Bu maçta sahadan çıkan her oyuncu kırmızı kart görmüştü.
    ],
  },
  // Bir masal ülkesinde: Hiçbir su ejderhası ateş püskürmez. Bütün dağ ejderhaları ateş püskürür.
  sz20: {
    sets: ['su', 'dağ', 'ateş', 'uçar'],
    individuals: [],
    free: 0,
    facts: [(q) => q.no('su', 'ateş'), (q) => q.all('dağ', 'ateş')],
    options: [
      (q) => q.no('dağ', 'su'), // Hiçbir dağ ejderhası su ejderhası değildir.
      (q) => q.some('su', 'dağ'), // Bazı su ejderhaları dağ ejderhasıdır.
      (q) => q.all('ateş', 'dağ'), // Ateş püskürenlerin hepsi dağ ejderhasıdır.
      (q) => q.no('su', 'uçar'), // Su ejderhaları uçamaz.
      (q) => q.someNot('dağ', 'ateş'), // Bazı dağ ejderhaları ateş püskürmez.
    ],
  },
  // Hiçbir böceğin kemiği yoktur. Bütün arılar böcektir. Bazı uçan hayvanların kemiği vardır.
  sz24: {
    sets: ['böcek', 'kemikli', 'arı', 'uçan'],
    individuals: [],
    free: 0,
    facts: [(q) => q.no('böcek', 'kemikli'), (q) => q.all('arı', 'böcek'), (q) => q.some('uçan', 'kemikli')],
    options: [
      (q) => q.all('arı', 'kemikli'), // Arıların kemiği vardır.
      (q) => q.some('uçan', 'böcek'), // Bazı uçan hayvanlar böcektir.
      (q) => q.all('uçan', 'kemikli'), // Bütün uçan hayvanların kemiği vardır.
      (q) => q.no('arı', 'uçan'), // Hiçbir arı uçamaz.
      (q) => q.someNot('uçan', 'arı'), // Bazı uçan hayvanlar arı değildir.
    ],
  },
};

/** Bir çıkarım sorusunun seçeneklerinin hükmü ve bilgilere uyan dünya sayısı. */
export function deductionVerdicts(key: string): { verdicts: Verdict[]; models: number } {
  const spec = DEDUCTION[key];
  const truths: boolean[][] = spec.options.map(() => []);
  let models = 0;
  for (const w of worlds(spec)) {
    const q = query(spec, w);
    if (!spec.facts.every((f) => f(q))) continue;
    models++;
    spec.options.forEach((o, i) => truths[i].push(o(q)));
  }
  return { verdicts: truths.map(verdict), models };
}

/** Herhangi bir biçimsel kümeyle bir cümlenin hükmü (denetleyicinin kendisini sınamak için). */
export function judge(spec: Omit<DeductionSpec, 'options'>, sentence: (q: Q) => boolean): Verdict {
  const t: boolean[] = [];
  for (const w of worlds({ ...spec, options: [] })) {
    const q = query({ ...spec, options: [] }, w);
    if (spec.facts.every((f) => f(q))) t.push(sentence(q));
  }
  return verdict(t);
}
