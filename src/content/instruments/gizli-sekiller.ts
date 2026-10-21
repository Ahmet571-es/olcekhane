import { parseSegs, type HiddenLure } from '@/lib/instruments/hidden';
import type { HiddenFiguresTask, HiddenItem, HiddenPracticeItem, TaskInstrument } from '@/lib/instruments/types';

/**
 * Gizli şekiller (saklı şekil testi; Gottschaldt düzeni): üstte basit bir şekil, altında dört karmaşık çizim gösterilir;
 * şeklin aynı büyüklükte ve aynı yönde saklandığı tek çizim seçilir. Bütün şekiller ve çizimler Ölçekhane'nindir; ticari
 * testlerin (Gömülü Şekiller Testi, Grup Gömülü Şekiller Testi, Gizli Şekiller Testi) şekilleri kullanılmaz.
 *
 * Çizimler 6 × 6'lık bir ızgaranın noktaları arasındaki yatay, dikey ve 45° çapraz çizgilerdir (lib/instruments/hidden.ts).
 * Aranan şekiller, ızgarada çizilebilen ve hiçbir döndürmede ya da aynada kendisiyle örtüşmeyen dört, beş ya da altı
 * köşeli çokgenlerdir; testteki 22 şeklin hepsi birbirinden farklıdır ve hiçbiri başka bir şeklin (herhangi bir yönüyle)
 * bir köşesi farklı benzeri değildir (bir soruda yanlış seçenekte görülen benzer, başka bir soruda aranan şekil olmaz;
 * bir sorunun yanlış seçeneklerinde sonraki soruların aranan şekilleri de yoktur). Çizimler bir üreticiyle hazırlandı (scratchpad'de,
 * depoda değil): şekil ızgaraya yerleştirildi, ardından çizime değen çizgiler ve küçük çokgenler eklendi (çizim tek
 * parça kalır). Her soruda:
 *  - doğru seçenekte şekil tam bir yerde vardır; şeklin döndürülmüş ya da ayna görüntüsü olan yedi biçiminden hiçbiri,
 *    aynı büyüklükte bir köşesi farklı benzerleri ve iki kat büyüğü yoktur; şeklin bir birim parçası eksik bulunduğu bir
 *    yer de yoktur (dört soruda, şeklin kendisiyle üst üste binen başka büyüklükte bir benzeri vardır; şekil zaten orada
 *    olduğu için çözene etkisi yoktur);
 *  - "döndürülmüş" yanlış seçenekte (`turned`) şeklin kendisi ve köşesi farklı benzerleri yoktur, döndürülmüş ya da ayna
 *    görüntüsü olan bir biçimi tam bir yerde vardır;
 *  - "köşesi farklı" yanlış seçenekte (`changed`) şeklin kendisi ve döndürülmüş biçimleri yoktur; bir köşesi bir birim
 *    kaydırılmış benzeri (aynı büyüklükte, aynı köşe sayısında) tam bir yerde vardır.
 * Her soruda bir türden iki, ötekinden bir yanlış seçenek vardır (20 soruda her türden 30). Doğru seçeneklerin yeri
 * dengelidir (her harf beş kez). Dört seçeneğin çizgi miktarı birbirine yakındır (en çok 4 birim parça fark).
 *
 * Düzeyler şeklin ne kadar gizlendiğine göredir. Şekli gizleyen en önemli etkenlerden biri kenarlarının çizimde aynı
 * doğrultuda devam etmesidir (de-Wit ve ark., 2017); devam eden kenarların payı, şeklin köşelerine değen yabancı çizgiler
 * ve çizimdeki birim parça sayısı (asıl sorularda 1. düzey 23–27, 4. düzey 36–41; alıştırmalar 19–22) düzeyle artar
 * (testte denetlenir). 1. düzeydeki asıl sorularda yanlış seçeneklerin hiçbirinde şeklin yalnızca bir birim parçası
 * eksik bir benzeri yoktur; köşesi farklı benzerler kolay düzeyde şekilden en az iki birim parça farklıdır. Asıl
 * sorulardaki şekiller birbirinden, alıştırmalardaki şekillerden ve yönergedeki örnekten (hangi yöne çevrilip nereye
 * kaydırılırsa kaydırılsın) en az dört birim parça farklıdır.
 *
 * tests/gizli-sekiller.test.ts bütün bu koşulları bağımsız bir yolla (çizgileri geometrik olarak örterek) yeniden
 * denetler ve kestirme yolların (en çok ya da en az çizgili seçeneği seçmek gibi) doğru seçeneği bulamadığını gösterir.
 */

interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4;
  /** Aranan şekil: çizgiler (her biri dört rakam: x1 y1 x2 y2). */
  target: string;
  /** Dört karmaşık çizim. */
  options: [string, string, string, string];
  /** Seçeneklerin yanılgı türü; doğru seçenekte `null`. */
  lures: (HiddenLure | null)[];
}

interface PracticeSpec extends Spec {
  /** Geri bildirimde her seçenekte vurgulanan şekil (doğru seçenekte aranan şekil, ötekilerde benzeri). */
  marks: string[];
  explain: string;
}

const SPECS: Spec[] = [
  {
    key: 'gs01',
    level: 1,
    target: '0001 0011 0112 1131 1222 2231',
    options: [
      '0110 1014 1131 1256 2333 2526 2565 2646 3142 3342 3536 4446 4455',
      '1112 1166 1223 2242 2333 2526 2565 2656 3342 3435 3464 5556 5665 6465',
      '0444 2666 3443 4146 4152 4453 4565 4655 5253 5556 5665 6566',
      '0205 0252 0545 1216 2223 2231 2332 3141 4152 4245',
    ],
    lures: ['changed', null, 'turned', 'turned'],
  },
  {
    key: 'gs02',
    level: 1,
    target: '0002 0030 0222 2233 3033',
    options: [
      '0001 0156 0312 2123 2151 3454 3536 3545 3646 4546 5154 5556 5565 5665 5666 6566',
      '0005 0252 0413 0514 0525 1314 2026 2433 3355 5255',
      '0005 0111 0112 0313 0413 1011 1032 1122 1222 2124 2454 3252 5254',
      '0104 0212 1113 1120 1141 1333 2030 2130 3344 3663 4146 4565',
    ],
    lures: ['changed', 'changed', 'turned', null],
  },
  {
    key: 'gs03',
    level: 1,
    target: '0001 0030 0123 2332 3032',
    options: [
      '0005 0111 0213 0220 0252 0515 1115 2223 2345 4554 5254',
      '0121 0555 1032 2425 2442 3233 3241 4042 4050 4151 4264 5051 5355',
      '1464 2231 2255 3151 3436 3445 3646 3654 4365 4453 4546 5153',
      '0235 0336 0405 0414 0515 1215 1242 3161 3336 3351 6063',
    ],
    lures: [null, 'turned', 'changed', 'changed'],
  },
  {
    key: 'gs04',
    level: 1,
    target: '0001 0020 0121 2031 2122 2231',
    options: [
      '0003 0040 0111 0343 2024 2444 4043 4354 4455 5455',
      '0252 2225 2332 2535 3164 3243 3335 3343 4163 5054',
      '0363 1112 1120 1221 1314 1434 2021 2053 3344 3435 3544 4243 4251 5153 5162 6263',
      '1322 1324 2223 2363 2444 4142 4150 4151 4260 4262 4344 5055 5463 5464 5564 6264',
    ],
    lures: ['changed', 'turned', null, 'turned'],
  },
  {
    key: 'gs05',
    level: 1,
    target: '0001 0030 0121 2132 3032',
    options: [
      '0304 0333 0434 1155 1161 2232 3243 3334 4143 4150 5060 6061',
      '0312 0333 0444 1214 1223 2425 2555 3234 3241 3342 4142 4453 5356',
      '0102 0134 0213 0406 0413 0424 1214 1323 1425 2226 2252 3454 5254',
      '0336 0545 1415 1444 2324 2353 3536 3544 3645 4043 4445 4455 5355',
    ],
    lures: ['changed', 'turned', 'changed', null],
  },
  {
    key: 'gs06',
    level: 2,
    target: '0001 0040 0111 1122 2240',
    options: [
      '0633 1115 1133 1525 2226 2252 2454 2646 3164 4446 4556 5154',
      '0321 0424 1314 1363 2030 2031 2123 2141 2435 3031 3241 3252 3342 3562 4143 4352',
      '0506 0515 0616 1316 1363 1425 2042 2535 2653 3133 3161 4246 6163',
      '0426 1113 1222 1346 1353 1416 1542 1656 2231 2434 3136 3153',
    ],
    lures: ['turned', null, 'changed', 'turned'],
  },
  {
    key: 'gs07',
    level: 2,
    target: '0001 0020 0112 1221 2031 2131',
    options: [
      '1324 1333 2125 2161 2534 2565 3132 3140 3242 3344 3444 4042 5354 5363 5464 6165',
      '0104 0111 0252 0333 0415 1015 2022 2030 2131 2332 3034 3344 4453 5253',
      '0232 0330 1054 1114 1161 1363 1425 2122 2244 2444 2534 6366',
      '0224 0440 1011 1030 1131 2021 2130 2232 2433 3031 3052 3243 3343 4346 5056',
    ],
    lures: ['changed', 'turned', null, 'changed'],
  },
  {
    key: 'gs08',
    level: 2,
    target: '0002 0011 0213 1131 1331',
    options: [
      '0550 1214 1223 1425 2353 2552 3031 3040 3141 4041 4345 4454 4555 5055',
      '1120 1131 2064 2224 2231 2356 2433 3353 3435 3443 3454 3544 3555 4345 5455 6164',
      '0001 0010 0111 1016 1122 1262 1444 2042 2442 4466 6266',
      '1331 1363 3142 3151 3344 3565 4244 4262 4464 5364 5456 5666 6264 6566',
    ],
    lures: [null, 'turned', 'changed', 'turned'],
  },
  {
    key: 'gs09',
    level: 2,
    target: '0002 0020 0211 1122 2031 2231',
    options: [
      '0305 0313 0464 0515 1015 1131 1222 2244 3153 3342 4246 5253 5262 5363 6263',
      '0550 1315 1335 1343 1424 1524 2022 2040 2141 2232 3132 3544 4041 4344 4354 4454',
      '0252 2224 2442 3366 3536 3565 3656 4142 4152 4264 4453 4655 5464 5465 5556 5665 6465',
      '0141 0262 0516 1223 1416 1423 1436 2534 3034 3060 5160 5161 5261 6062',
    ],
    lures: ['changed', 'changed', null, 'turned'],
  },
  {
    key: 'gs10',
    level: 2,
    target: '0011 0040 1121 2122 2240',
    options: [
      '0232 1113 1161 3034 3351 3454 3553 3555 4262 4445 4554 5155 6162',
      '1415 1464 1551 1555 2425 3161 3334 4142 4150 4252 4445 4455 5052 5354 5363 6364',
      '0123 1252 1434 1652 2324 3032 3060 3161 3363 4042 5051 6061',
      '0055 1151 1416 1444 1646 2232 3033 3052 3351 4446 4555 4556 5456',
    ],
    lures: ['changed', 'turned', 'changed', null],
  },
  {
    key: 'gs11',
    level: 3,
    target: '0110 0123 1011 1141 2341',
    options: [
      '0110 0131 0304 0343 0424 0514 0525 1014 1222 1223 1335 2021 2030 2225 3033 3553 4243 4253',
      '0004 0040 0444 1314 1322 1335 2225 2363 3562 4044 5152 5161 5262 6162',
      '0422 1346 2233 2662 3353 3536 3565 3666 4243 4252 4352 4464 4664 5051 5060 5161 5665 6066',
      '0305 0313 0515 1112 1131 1232 1315 1331 1335 3134 3454 3562 4046 4554 4666 5456 5665 6566',
    ],
    lures: ['turned', null, 'changed', 'turned'],
  },
  {
    key: 'gs12',
    level: 3,
    target: '0003 0011 0343 1121 2143',
    options: [
      '0002 0010 0212 0555 1015 1065 1122 1464 2232 2332 2333 3233 3544 4455 5455 5564',
      '0203 0212 0333 1216 1221 1331 1424 1533 1545 1626 2126 2232 2350 3133 4145',
      '0204 0232 0323 0444 1014 1030 1043 2125 2565 3034 3343 4346 4455',
      '0030 0055 0454 1014 1121 2021 2425 2435 2535 2561 3033 3254 4142 4151 4252 5152',
    ],
    lures: [null, 'turned', 'turned', 'changed'],
  },
  {
    key: 'gs13',
    level: 3,
    target: '0002 0020 0222 1122 1131 2031',
    options: [
      '0330 1013 1050 1252 1343 2325 2464 2565 3254 3335 4344 5052',
      '1215 1252 1353 1555 1661 2233 2526 2636 3142 3161 3536 5056 5060 6061',
      '0506 0525 0550 0615 0616 1516 1625 2023 2030 2141 2262 2353 3031 4244 4352 4455 5155 5161 6162',
      '0262 1012 1121 2125 2444 2534 2535 3344 3363 3435 4143 4161 4253 5052 5060 6063',
    ],
    lures: ['changed', 'turned', 'turned', null],
  },
  {
    key: 'gs14',
    level: 3,
    target: '0003 0040 0321 2131 3140',
    options: [
      '0262 0405 0413 0415 0514 1215 1324 1424 1533 3236 3461 3546 3646 4151 4163 5153 5363 6263',
      '0055 0333 0413 0414 1012 1020 1256 1262 1314 2022 3032 5255 5464 5565 6465',
      '0066 1215 1223 1262 1533 2123 2161 3132 3353 4344 4361 5152 5160 5355 6062',
      '0363 1216 1262 1525 1533 1646 2223 2526 3233 3645 4146 4151 5153',
    ],
    lures: ['changed', 'turned', null, 'changed'],
  },
  {
    key: 'gs15',
    level: 3,
    target: '0001 0033 0112 0312 0333',
    options: [
      '0156 1113 1122 1232 1324 1524 1555 2122 2151 3134 3454 4144 4252 4353 5152 5354',
      '0103 0111 0323 0406 0454 0515 0516 0523 0636 1113 1144 1415 3233 3242 3343 3436 4246',
      '0002 0055 0156 0212 0506 0516 0525 0616 1114 1323 1324 1424 2026 3435 3555',
      '0003 0020 0323 0406 0413 0424 0515 0541 0616 1314 1516 2024 2433 3344 4144 4161 4363 6163',
    ],
    lures: [null, 'changed', 'changed', 'turned'],
  },
  {
    key: 'gs16',
    level: 4,
    target: '0003 0030 0343 2130 2143',
    options: [
      '0506 0555 0616 1316 1343 1424 1425 2026 2130 2131 2143 2232 2636 3031 3236 4345 4352 4454 5255',
      '0004 0010 0161 0212 0454 1015 1450 3031 3050 3254 4041 4051 4152 4445 4555 5052 5455',
      '0252 0406 0414 0555 0616 1116 2223 2233 2240 2343 3133 3141 3241 3342 3444 3445 4046 4466',
      '0405 0414 0515 1112 1121 1234 1262 1416 1524 1661 2122 2425 2555 3435 3544 4345 4353 4454 5056 5161 5162 6162',
    ],
    lures: ['turned', null, 'changed', 'turned'],
  },
  {
    key: 'gs17',
    level: 4,
    target: '0001 0040 0112 1213 1340',
    options: [
      '0102 0110 0211 0550 1015 1141 1223 1444 1555 2325 2446 2635 2636 3436 4146 4455',
      '0235 0413 0464 0506 0516 0616 1016 1032 1120 1121 1242 1425 1560 2022 2425 4151 4152 5152',
      '0123 0151 1115 1242 1545 2022 2030 2326 2333 2434 2451 3032 3241 3334 4145',
      '0105 0131 0211 0262 0516 0525 1114 1122 1444 1516 2126 2552 3132 3243 4243',
    ],
    lures: ['turned', 'turned', null, 'changed'],
  },
  {
    key: 'gs18',
    level: 4,
    target: '0010 0011 1043 1113 1343',
    options: [
      '0022 0405 0464 0515 1015 1050 1054 1120 1131 2224 3140 4344 4353 5055 5261 5262 5565 6162 6465',
      '0066 0626 0660 1065 1151 2122 2232 2464 3132 4445 4453 4556 4565 5364 5456 5666 6566',
      '0624 1555 1661 2024 2040 2130 2161 2231 2262 3031 4044 4454 5154 5160 6062',
      '0002 0010 0066 0252 0325 1014 2526 2555 2636 3241 3336 3343 4161 4345 4454 5261 5455',
    ],
    lures: [null, 'changed', 'turned', 'changed'],
  },
  {
    key: 'gs19',
    level: 4,
    target: '0001 0030 0121 2123 2341 3041',
    options: [
      '0431 0506 0535 0633 0636 1314 1346 1363 1464 2224 2233 3036 5356',
      '0102 0112 0213 0440 1014 1122 1232 1363 1444 2126 2535 2636 3036 3141 3153 3241 4344',
      '0203 0262 0313 1015 1161 1555 2561 3034 3353 3444 4453 5155',
      '0110 0141 1020 1112 1120 1252 2122 3136 3353 3461 3555 4152 4446 4462 4563 4656 5256 6263',
    ],
    lures: ['turned', 'turned', 'changed', null],
  },
  {
    key: 'gs20',
    level: 4,
    target: '0030 0033 3031 3142 3342',
    options: [
      '0145 1262 1416 1464 1646 2324 2363 3334 3344 4253 4446 4554 5152 5162 5263 5355 6264',
      '0111 0145 0312 0313 1012 1020 1252 1322 2026 2435 2545 2636 3241 3536 4161 4245 4354 4563 5261',
      '0001 0010 0111 0145 1011 1054 1230 1416 1423 1425 1464 1636 2224 2526 2534 2545 3336 3343 4345',
      '0066 0413 0434 1161 1324 1333 2225 2232 2451 2535 2662 3035 3164',
    ],
    lures: ['changed', null, 'turned', 'changed'],
  },
];

/** Alıştırma: ikisinde de yanılgı türlerinin ikisi de var. */
const PRACTICE_SPECS: PracticeSpec[] = [
  {
    key: 'gsp1',
    level: 1,
    target: '0002 0010 0232 1032',
    options: [
      '0656 1112 1133 1141 1222 1256 3343 4143',
      '0405 0414 0426 0515 0550 1415 2123 2131 2353 3153 4151 5051',
      '0141 1065 1112 1122 1222 2442 2454 4252 5254',
      '0550 1424 1425 1516 1525 1626 2353 2426 3132 3153 5060',
    ],
    marks: ['1133 1141 3343 4143', '2123 2131 2353 3153', '2442 2454 4252 5254', '2332 2353 3132 3153'],
    explain:
      'Şekil B’de saklı: yeşille gösterilen yerde. Uzun çapraz bir çizgi şeklin bir köşesinden geçip içini kesiyor. Turuncuyla gösterilenler doğru cevap değil: A’da şeklin baş aşağı çevrilmiş, C’de ayna görüntüsü gibi ters çevrilmiş biçimi var; D’deki şeklin bir köşesi farklı.',
    lures: ['turned', null, 'turned', 'changed'],
  },

  {
    key: 'gsp2',
    level: 1,
    target: '0002 0020 0232 2021 2132',
    options: [
      '0304 0312 0313 0454 0514 1015 2224 2233 3343 4354',
      '1113 1141 1363 3241 3243 4352 5263 5356 5464 5666 6366',
      '0246 0304 0353 0414 1214 1222 2123 2141 4142 4253',
      '1114 1122 1434 2232 3236 3562 4252 4253 5054',
    ],
    marks: ['2224 2233 2454 3343 4354', '1113 1141 1343 3241 3243', '2123 2141 2353 4142 4253', '1114 1122 1434 2232 3234'],
    explain:
      'Şekil C’de saklı: yeşille gösterilen yerde. Alt kenarı, çizimdeki daha uzun bir yatay çizginin parçası. Turuncuyla gösterilenler doğru cevap değil: A’daki ve B’deki şekillerin birer köşesi farklı; D’de şeklin döndürülmüş ve ters çevrilmiş biçimi var.',
    lures: ['changed', 'changed', null, 'turned'],
  },
];

export const HIDDEN_SPECS: readonly Spec[] = SPECS;
export const HIDDEN_PRACTICE_SPECS: readonly PracticeSpec[] = PRACTICE_SPECS;

const build = (s: Spec): HiddenItem => ({
  key: s.key,
  level: s.level,
  target: parseSegs(s.target),
  options: s.options.map(parseSegs),
});

const PRACTICE: HiddenPracticeItem[] = PRACTICE_SPECS.map((s) => ({
  ...build(s),
  answer: s.lures.indexOf(null) + 1,
  explain: s.explain,
  marks: s.marks.map(parseSegs),
}));

const task: HiddenFiguresTask = {
  key: 'gizli-sekiller',
  kind: 'hidden_figures',
  name: 'Gizli Şekiller',
  measures: 'Karmaşık bir çizimin içine saklanmış basit bir şekli bulabilmeyi ölçer.',
  instructions: [
    'Her soruda üstte basit bir şekil, altında dört karmaşık çizim göreceksin.',
    'Şekil, dört çizimden yalnızca birinin içinde saklı. Onu bul.',
    'Şekil çizimde aynı büyüklükte ve aynı yönde durur: döndürülmemiş, ters çevrilmemiştir. Kenarları çizimdeki daha uzun çizgilerin parçası olabilir.',
  ],
  grid: 6,
  practice: PRACTICE,
  items: SPECS.map(build),
  answers: SPECS.map((s) => s.lures.indexOf(null) + 1),
  optionLures: SPECS.map((s) => [...s.lures]),
  levels: [
    { level: 1, name: 'Az gizlenmiş', plain: 'Kenarlarının çoğu açıkta duran bir şekli, az çizgili bir çizimde bulmak.' },
    { level: 2, name: 'Kısmen gizlenmiş', plain: 'Köşelerine başka çizgilerin değdiği ya da kenarları uzayan bir şekli bulmak.' },
    { level: 3, name: 'İyice gizlenmiş', plain: 'Kenarları başka şekillerin kenarlarıyla birleşmiş bir şekli çevresindeki çizgilerden ayırmak.' },
    { level: 4, name: 'Çok gizlenmiş', plain: 'Kalabalık bir çizimde, kenarlarının çoğu başka çizgilere karışmış bir şekli ayırmak.' },
  ],
};

export const gizliSekiller: TaskInstrument = {
  slug: 'gizli-sekiller',
  version: 1,
  engine: 'tasks',
  name: 'Gizli Şekiller',
  shortName: 'Gizli şekiller',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 10,
  sortOrder: 49.88,
  tagline: 'Karmaşık bir çizimin içine saklanmış basit bir şekli bulabilmeyi ölçer: parçayı bütünün içinden ayırmayı.',
  description:
    'Bu test, karmaşık bir çizimin içine saklanmış basit bir şekli bulabilmeyi, yani bir parçayı onu saran bütünün içinden ayırabilmeyi ölçer. Her soruda üstte basit bir şekil, altında dört karmaşık çizim vardır; şeklin aynı büyüklükte ve aynı yönde saklandığı tek çizim seçilir. Yanlış seçeneklerde şeklin döndürülmüş ya da ters çevrilmiş biçimi ya da bir köşesi farklı benzeri saklıdır. Sorular kolaydan zora doğru dört düzeyde ilerler: şeklin kenarları çizimdeki başka çizgilerle giderek daha çok birleşir. Bütün şekiller ve çizimler Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar soruların çoğunun doğru bulunduğunu, yanlışlarda hangi tür şeklin seçildiğini ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Saklanan şekli bul',
    paragraphs: [
      'Birazdan üstte basit bir şekil, altında dört karmaşık çizim göreceksin. Şekil, çizimlerden yalnızca birinin içinde saklı; onu bulacaksın.',
      `Test ${SPECS.length} sorudan oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok, ama her soruya gereğinden fazla takılıp kalma.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'gs_dogru', name: 'Doğru cevaplar', plain: 'Şeklin saklandığı çizimin bulunduğu soruların sayısı.' },
    { key: 'gs_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'gs_yanilgi', name: 'Yanlışlarda seçilen şekiller', plain: 'Yanlış cevaplarda şeklin döndürülmüş ya da ters çevrilmiş biçiminin mi, bir köşesi farklı benzerinin mi seçildiği.' },
    { key: 'gs_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve cevapların hep aynı sıradaki seçeneğe kayıp kaymadığı.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Gizli şekil (saklı şekil) görevleri: Gottschaldt’ın (1926) karmaşık çizimlere gizlenmiş basit şekilleri, Witkin’in (1950) Gömülü Şekiller Testi ve bir hedef şekil ile birkaç karmaşık çizimin gösterildiği eşleştirme düzeni (de-Wit ve ark., 2017). Bu testteki bütün şekiller ve çizimler Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı test setlerinin (Gömülü Şekiller Testi, Grup Gömülü Şekiller Testi, ETS’nin Gizli Şekiller Testi [Hidden Figures Test], Leuven Gömülü Şekiller Testi) şekilleri, puanlama kuralları ya da normları kullanılmaz. Leuven testinden farklı olarak bu testin yanlış seçeneklerinde şeklin döndürülmüş ya da ters çevrilmiş biçimleri ve bir köşesi farklı benzerleri de saklıdır; böylece yanlış cevaplar da yorumlanabilir.',
    whatItMeasures:
      'Karmaşık bir çizimin içine saklanmış basit bir şekli bulabilmeyi, yani bir parçayı onu saran bütünün içinden ayırabilmeyi ölçer. Bu beceri araştırmalarda “kapanma esnekliği” diye anılır: bilinen bir şekli, dikkati dağıtan çizgilere rağmen akılda tutup bulabilmek (French ve ark., 1963; Carroll, 1993, aktaran Milne ve Szczerbinski, 2009). Witkin bu tür testleri kişinin algı tarzını (alan bağımlılığı ve bağımsızlığı) anlamak için kullanmıştır. Sonraki araştırmalar ise bu testlerin daha çok bir beceri ölçtüğünü düşündürmektedir; yine de bu konu tartışmalıdır (Evans ve ark., 2013). Grup Gömülü Şekiller Testi yetenek testleriyle anlamlı düzeyde ilişkili bulunmuştur (Widiger ve ark., 1980). 60 üniversite öğrencisiyle yapılan küçük bir çalışmada, Gömülü Şekiller Testi ve Çubuk-Çerçeve Testi ile ölçülen alan bağımsızlığının uzamsal beceriyle ilişkisi, ölçüm hatası ayıklandığında neredeyse tam bulunmuştur (MacLeod ve ark., 1986). Yetişkinlerle yapılan bir araştırmada şekil ayırma becerisi, bütünü algılama becerisiyle anlamlı bir ilişki göstermemiştir; yani parçayı ayırabilmek bütünü görememek anlamına gelmez (Milne ve Szczerbinski, 2009). Üniversite öğrencileriyle yapılan bir çalışmada bu tür bir testteki başarı akıl yürütme ve kısa süreli görsel bellek ölçümleriyle küçük ölçüde ilişkili bulunmuş, genel bir algı tarzını yansıtmadığı sonucuna varılmıştır (Huygelier ve ark., 2018). Bir şeklin bulunmasını zorlaştıran en önemli etkenlerden biri, kenarlarının çizimdeki başka çizgilerle aynı doğrultuda devam etmesidir; böyle devam eden kenarlar azaldıkça şekil çok daha kolay bulunmuştur (de-Wit ve ark., 2017). Bu testin düzeyleri de buna göre kurulmuştur. Şekli parçalarına ayırarak arayan kişilerin gömülü şekilleri daha hızlı bulduğu da gösterilmiştir (Hock ve ark., 1974). Okul başarısıyla ilişkisini inceleyen bir meta analizde alan bağımsızlığı testleriyle başarı arasında orta düzeyde bir ilişki bulunmuştur (r ≈ .31); bu ilişki neden-sonuç anlamına gelmez (Xie ve ark., 2025). Bu test bir zekâ puanı (IQ) vermez; sonuç, şekil bulma becerisinin bugünkü durumunu anlatır.',
    turkishVersion: 'Özgün test. Şekiller, çizimler ve yönergeler Ölçekhane tarafından hazırlanmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her sorunun yalnızca bir doğru cevabı olduğu, bağımsız ikinci bir hesapla (çizgiler geometrik olarak örtüştürülerek) doğrulanmıştır: şekil yalnızca doğru seçenekte ve orada tek bir yerde vardır; yanlış seçeneklerde şeklin kendisi yoktur. Benzer kısa testlerin güvenirliği orta düzeydedir: Leuven Gömülü Şekiller Testi’nde doğru cevaplarda testin iki yarısı arasındaki ilişki .56–.76, test iki hafta ile üç ay arayla yeniden çözüldüğünde iki sonuç arasındaki ilişki .46–.55 bulunmuştur (Huygelier ve ark., 2018).',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Grup Gömülü Şekiller Testi’nin Türkçe biçimiyle Türkiye’de üniversitede okuyan gençlerle yapılan bir çalışmada sonuçlar test kitapçığındaki Amerikan normlarından anlamlı ölçüde farklı çıkmış ve testin başka kültürlerde dikkatle kullanılması gerektiği belirtilmiştir (Çakan, 2003a); ortaokulun son yılındaki gençlerle yapılan çalışmada sonuçlar, Amerika’da üç yıl alttaki bir eğitim düzeyinden bir grubunkine benzer bulunmuştur (Çakan, 2003b).',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Şekil bulma becerisi çocukluk boyunca gelişir: 7–11 yaşındaki 403 çocukla yapılan bir çalışmada doğru cevaplar yaşla düzenli olarak artmış, kızlarla erkekler arasında fark bulunmamıştır (Conson ve ark., 2022); Türkiye’de 8. sınıf öğrencileriyle yapılan bir çalışmada da kızlarla erkekler arasında fark görülmemiştir (Çakan, 2003b). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir. Süre sınırı yoktur. Çizimler ince siyah çizgilerden oluşur ve renk ayırt etmeyi gerektirmez; gözlük kullanan kişi gözlüğüyle çözmelidir.',
    license: 'Özgün test. Şekiller, çizimler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Görsel algının ve uzamsal becerilerin yalnızca bir yönünü (karmaşık bir çizimde bir şekli bulmayı) ölçer. Sonuç bir kişilik özelliği ya da genel bir düşünme tarzı olarak yorumlanmamalıdır (Evans ve ark., 2013; Huygelier ve ark., 2018).',
      'Her soruda dört seçenek olduğu için rastgele seçen biri de soruların yaklaşık dörtte birini doğru bulabilir.',
      'Benzer kısa testlerin güvenirliği orta düzeydedir; tek bir sonuç kesin bir yargı için yeterli değildir.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve ekranın büyüklüğünden etkilenebilir (telefonda çizimler küçük görünür). Uzamsal görevlerde tekrar tekrar test çözmek de sonucu yükseltebilir (Uttal ve ark., 2013); test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Düzeyler çizimlerin özelliklerine göre (şeklin kenarlarının başka çizgilerle ne kadar devam ettiği ve şekle ne kadar çizgi değdiği) kurulmuştur; soruların gerçek zorluğu henüz katılımcı verileriyle sınanmadı.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Carroll, J. B. (1993). Human cognitive abilities: A survey of factor-analytic studies. Cambridge University Press.',
        url: 'https://doi.org/10.1017/CBO9780511571312',
      },
      {
        text: 'Conson, M., Siciliano, M., Trojano, L., Zoccolotti, P., Zappullo, I., Baiano, C. ve ark. (2022). Figure disembedding: The Gottschaldt’s Hidden Figure Test in children with typical development and autism. Journal of Autism and Developmental Disorders, 52(9), 3790–3799.',
        url: 'https://doi.org/10.1007/s10803-021-05259-3',
      },
      {
        text: 'Çakan, M. (2003a). Psychometric data on the Group Embedded Figures Test for Turkish undergraduate students. Perceptual and Motor Skills, 96(3), 993–1004.',
        url: 'https://doi.org/10.2466/pms.2003.96.3.993',
      },
      {
        text: 'Çakan, M. (2003b). Cross-cultural aspect of the Group Embedded Figures Test: Norms for Turkish eighth graders. Perceptual and Motor Skills, 97(2), 499–509.',
        url: 'https://doi.org/10.2466/pms.2003.97.2.499',
      },
      {
        text: 'de-Wit, L., Huygelier, H., Van der Hallen, R., Chamberlain, R. ve Wagemans, J. (2017). Developing the Leuven Embedded Figures Test (L-EFT): Testing the stimulus features that influence embedding. PeerJ, 5, e2862.',
        url: 'https://doi.org/10.7717/peerj.2862',
      },
      {
        text: 'Evans, C., Richardson, J. T. E. ve Waring, M. (2013). Field independence: Reviewing the evidence. British Journal of Educational Psychology, 83(2), 210–224.',
        url: 'https://doi.org/10.1111/bjep.12015',
      },
      {
        text: 'French, J. W., Ekstrom, R. B. ve Price, L. A. (1963). Manual for kit of reference tests for cognitive factors (Revised 1963). Educational Testing Service.',
        url: 'https://apps.dtic.mil/sti/pdfs/AD0410915.pdf',
      },
      {
        text: 'Gottschaldt, K. (1926). Über den Einfluß der Erfahrung auf die Wahrnehmung von Figuren. Psychologische Forschung, 8, 261–317.',
        url: 'https://doi.org/10.1007/BF02411523',
      },
      {
        text: 'Hock, H. S., Gordon, G. P. ve Marcus, N. A. (1974). Individual differences in the detection of embedded figures. Perception & Psychophysics, 15(1), 47–52.',
        url: 'https://doi.org/10.3758/BF03205826',
      },
      {
        text: 'Huygelier, H., Van der Hallen, R., Wagemans, J., de-Wit, L. ve Chamberlain, R. (2018). The Leuven Embedded Figures Test (L-EFT): Measuring perception, intelligence or executive function? PeerJ, 6, e4524.',
        url: 'https://doi.org/10.7717/peerj.4524',
      },
      {
        text: 'MacLeod, C. M., Jackson, R. A. ve Palmer, J. C. (1986). On the relation between spatial ability and field dependence. Intelligence, 10(2), 141–151.',
        url: 'https://doi.org/10.1016/0160-2896(86)90011-5',
      },
      {
        text: 'Milne, E. ve Szczerbinski, M. (2009). Global and local perceptual style, field-independence, and central coherence: An attempt at concept validation. Advances in Cognitive Psychology, 5, 1–26.',
        url: 'https://doi.org/10.2478/v10053-008-0062-8',
      },
      {
        text: 'Uttal, D. H., Meadow, N. G., Tipton, E., Hand, L. L., Alden, A. R., Warren, C. ve Newcombe, N. S. (2013). The malleability of spatial skills: A meta-analysis of training studies. Psychological Bulletin, 139(2), 352–402.',
        url: 'https://doi.org/10.1037/a0028446',
      },
      {
        text: 'Widiger, T. A., Knudson, R. M. ve Rorer, L. G. (1980). Convergent and discriminant validity of measures of cognitive styles and abilities. Journal of Personality and Social Psychology, 39(1), 116–129.',
        url: 'https://doi.org/10.1037/0022-3514.39.1.116',
      },
      {
        text: 'Witkin, H. A. (1950). Individual differences in ease of perception of embedded figures. Journal of Personality, 19(1), 1–15.',
        url: 'https://doi.org/10.1111/j.1467-6494.1950.tb01084.x',
      },
      {
        text: 'Xie, Q., Yang, K., Ji, R., Qian, Y., Tong, L., Chao, C. N. G. ve Sin, K. F. (2025). Cognitive style and students’ academic achievement: A meta-analysis. Frontiers in Education, 10, 1634732.',
        url: 'https://doi.org/10.3389/feduc.2025.1634732',
      },
    ],
  },
};
