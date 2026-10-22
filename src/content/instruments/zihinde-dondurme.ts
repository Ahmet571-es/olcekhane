import { rotationBlocks } from '@/lib/instruments/rotation';
import { rng } from '@/lib/instruments/sequences';
import type { MentalRotationTask, RotationShape, TaskInstrument } from '@/lib/instruments/types';

/**
 * Zihinde Döndürme
 *
 * Zihinsel döndürme düzenine dayanan özgün bir görevdir (Shepard ve Metzler, 1971): yan yana iki şekil gösterilir;
 * sağdaki, soldakinin döndürülmüş hâli ya da döndürülmüş ayna görüntüsüdür. Karar süresi, iki şekil arasındaki açı
 * büyüdükçe uzar. Şekiller, açılar, deneme sırası, puanlama ve rapor Ölçekhane'nindir; ticari testlerin şekilleri,
 * puanlama kuralları ya da normları kullanılmaz.
 *
 * Şekiller: altı birim kareden oluşan sekiz özgün şekil (heksomino). Hiçbirinin döndürme ya da ayna simetrisi yoktur:
 * ayna görüntüsü, döndürülerek şeklin kendisi yapılamaz (lib/instruments/rotation.ts, isAsymmetric). Alıştırmada asıl
 * görevde olmayan ayrı bir şekil (L biçimli, beş kare) kullanılır.
 *
 * Denemeler: 8 şekil × 5 döndürme farkı (0, 45, 90, 135, 180 derece) × 2 (aynı, ayna görüntüsü) = 80 deneme, iki
 * bölüm. Düzen ve sıra kuralları rotationBlocks'ta. Diziler sabit bir tohumla üretilir: herkes aynı denemeleri görür.
 * Üretim kuralı değişirse testin sürüm numarası artırılmalıdır.
 *
 * Süreler: şekiller cevap verilene kadar, en çok 7 saniye ekranda kalır; denemeler arası 0,5–0,8 saniye.
 *
 * Puanlama (lib/scoring/tasks.ts, scoreRotation): 300 ms'den kısa cevaplar ve 7 saniyede verilmeyen cevaplar doğru
 * sayılmaz. Karar süresi yalnızca doğru bulunan "aynı" şekillerden hesaplanır (bütün açılarda en az 10, açı başına en
 * az 3, az ve çok döndürülmüş gruplarda en az 6 doğru cevap). Döndürme etkisi: çok (135–180°) ve az (0–45°) döndürülmüş
 * şekillerdeki tipik sürelerin farkı; 0,25 saniyeden küçük farklar belirgin sayılmaz.
 */

/** Heksominolar, ızgaradaki kare konumlarıyla (x sağa, y aşağı doğru). */
const SHAPES: RotationShape[] = [
  // ##.
  // ###
  // #..
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [0, 2]] },
  // ##.
  // ##.
  // .##
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1], [1, 2], [2, 2]] },
  // ###
  // #..
  // ##.
  { cells: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2]] },
  // #..
  // ###
  // .#.
  // .#.
  { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]] },
  // #...
  // ####
  // ..#.
  { cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]] },
  // #..
  // ##.
  // .##
  // .#.
  { cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [1, 3]] },
  // #..
  // #..
  // ###
  // .#.
  { cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [1, 3]] },
  // #..
  // #..
  // ##.
  // .##
  { cells: [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [2, 3]] },
];

/** Alıştırma şekli: L biçimli beş kare. */
const PRACTICE_SHAPE: RotationShape = { cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]] };

const [block1, block2] = rotationBlocks(SHAPES.length, rng(20261005));

const rotation: MentalRotationTask = {
  key: 'zihinde-dondurme',
  kind: 'mental_rotation',
  name: 'Zihinde Döndürme',
  measures: 'Şekilleri zihinde döndürüp karşılaştırabilme (uzamsal beceri).',
  instructions: [
    'Ekranda yan yana iki şekil göreceksin. Sağdaki şekil, soldakinin döndürülmüş hâli ya da ayna görüntüsüdür.',
    'Sağdaki şekli zihninde döndürerek soldakiyle aynı yapabiliyorsan AYNI düğmesine (ya da sol ok tuşuna) bas.',
    'Ne kadar döndürsen de soldakiyle aynı olmuyorsa, yani sağdaki şekil soldakinin ayna görüntüsüyse AYNA GÖRÜNTÜSÜ düğmesine (ya da sağ ok tuşuna) bas.',
    'Hem doğru hem de olabildiğince hızlı cevap vermeye çalış. Önce kısa bir alıştırma yapacaksın. Görev iki bölümden oluşur; arada kısa bir mola var.',
  ],
  shapes: SHAPES,
  practiceShape: PRACTICE_SHAPE,
  practice: [
    { angle: 0, mirror: false },
    { angle: 0, mirror: true },
    { angle: 90, mirror: false },
    { angle: 135, mirror: true },
    { angle: 180, mirror: false },
    { angle: -45, mirror: true },
  ],
  trials: [...block1, ...block2],
  blocks: 2,
  timeoutMs: 7000,
  itiMs: [500, 800],
};

export const zihindeDondurme: TaskInstrument = {
  slug: 'zihinde-dondurme',
  version: 1,
  engine: 'tasks',
  name: 'Zihinde Döndürme',
  shortName: 'Zihinde döndürme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  estimatedMinutes: 7,
  sortOrder: 61,
  tagline: 'Döndürülmüş bir şeklin başka bir şeklin aynısı mı yoksa ayna görüntüsü mü olduğunu bulabilmeyi, yani şekilleri zihinde döndürüp karşılaştırabilmeyi ölçer.',
  description:
    'Bu görev, psikolojide uzamsal beceriyi ölçmek için yaygın olarak kullanılan “zihinsel döndürme” düzenine dayanır: yan yana iki şekil gösterilir; sağdaki şeklin, soldakinin döndürülmüş hâli mi yoksa ayna görüntüsü mü olduğuna karar verilir. Şekil ne kadar çok döndürülmüşse karar genellikle o kadar uzun sürer; bunun, şeklin zihinde döndürülmesinden kaynaklandığı düşünülür. Görev iki bölümden oluşur ve yaklaşık 7 dakika sürer. Rapor; doğru cevapları, karar süresini ve şekil daha çok döndürüldüğünde kararın nasıl değiştiğini sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Aynı mı, ayna görüntüsü mü?',
    paragraphs: [
      'Birazdan ekranda yan yana iki şekil göreceksin. Sağdaki şekli zihninde döndürüp soldakiyle karşılaştıracaksın.',
      'Görev iki bölümden oluşur; aralarında kısa bir mola var. Başlamadan önce kısa bir alıştırma yapacaksın.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'zd_dogruluk', name: 'Doğru cevaplar', plain: 'Döndürülmüş şeklin aynı şekil mi yoksa ayna görüntüsü mü olduğunu doğru bulma oranı.' },
    { key: 'zd_hiz', name: 'Karar süresi', plain: 'Doğru bulunan aynı şekillerde tipik karar süresi.' },
    { key: 'zd_aci', name: 'Döndürme etkisi', plain: 'Şekil daha çok döndürüldüğünde karar süresinin nasıl değiştiği.' },
  ],
  tasks: [rotation],
  science: {
    basedOn:
      'Zihinsel döndürme düzeni: Shepard ve Metzler’in (1971) iki şekli karşılaştırma çalışmasından gelen ve bugün uzamsal beceriyi ölçmek için yaygın olarak kullanılan düzen; döndürülmüş bir şeklin, öteki şeklin aynısı mı yoksa ayna görüntüsü mü olduğuna karar verilir. Şekiller (birim karelerden oluşan sekiz özgün şekil), açılar, deneme sırası, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari testlerin şekilleri, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Zihinsel döndürmeyi, yani bir şeklin görüntüsünü zihinde döndürüp başka bir şekille karşılaştırabilmeyi ölçer. Shepard ve Metzler (1971), iki şeklin aynı olup olmadığına karar verme süresinin, şekiller arasındaki döndürme açısıyla doğrusal olarak arttığını bulmuştur; bu bulgu, şeklin zihinde, gerçekte döndürülür gibi döndürüldüğü biçiminde yorumlanır. Bu beceri, bir şeklin döndürülünce nasıl görüneceğini düşünmeyi gerektiren durumlarda (ör. bir yapboz parçasının nereye oturacağını görmek) kullanılır.',
    turkishVersion: 'Özgün görev. Görev şekillerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Karar süresinin döndürme açısıyla artması ilk kez yetişkinlerde gösterilmiş (Shepard ve Metzler, 1971), 6 yaş ve üstündeki çocuklarda da bulunmuştur (Wimmer ve ark., 2017); ancak iki koşul arasındaki farka dayanan puanlarda aynı kişinin iki uygulaması arasındaki tutarlılık (test-tekrar test güvenirliği) sınırlıdır (Hedge ve ark., 2018). Bu yüzden raporda döndürme etkisi, doğruluk ve karar süresiyle birlikte ve yalnızca betimleyici olarak verilir; 0,25 saniyeden küçük farklar belirgin sayılmaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Zihinsel döndürme becerisi çocukluk boyunca gelişir (Frick, Möhring ve Newcombe, 2014). 4, 6, 8 ve 10 yaşındaki çocuklar ile yetişkinlerin karşılaştırıldığı bir çalışmada, 6 yaş ve üstündeki bütün gruplarda karar süresinin açıyla birlikte doğrusal olarak arttığı bildirilmiştir (Wimmer, Robinson ve Doherty, 2017). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '5. sınıftan itibaren uygulanır. Dokunmatik ekranla, fareyle ya da klavyeyle (sol ve sağ ok tuşları) yapılabilir; aynı kişinin sonuçları karşılaştırılacaksa aynı tür cihaz kullanılmalıdır.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Öğrenme güçlüğü ya da başka bir durum için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Birkaç dakikalık tek bir uygulama sınırlı bilgi verir; matematik ya da geometri başarısı hakkında tek başına bir sonuç çıkarılmamalıdır.',
      'Görev düz (iki boyutlu) şekillerle yapılır; üç boyutlu nesneleri zihinde döndürme becerisini doğrudan ölçmez.',
      'Sonuç; yorgunluk, isteklilik, ekranın büyüklüğü ve cihaz gibi etkenlerden etkilenir. Görev yeniden yapıldığında alıştırma etkisi görülebilir.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Shepard, R. N. ve Metzler, J. (1971). Mental rotation of three-dimensional objects. Science, 171(3972), 701–703.',
        url: 'https://doi.org/10.1126/science.171.3972.701',
      },
      {
        text: 'Frick, A., Möhring, W. ve Newcombe, N. S. (2014). Development of mental transformation abilities. Trends in Cognitive Sciences, 18(10), 536–542.',
        url: 'https://doi.org/10.1016/j.tics.2014.05.011',
      },
      {
        text: 'Wimmer, M. C., Robinson, E. J. ve Doherty, M. J. (2017). Are developments in mental scanning and mental rotation related? PLOS ONE, 12(2), e0171762.',
        url: 'https://doi.org/10.1371/journal.pone.0171762',
      },
      {
        text: 'Hedge, C., Powell, G. ve Sumner, P. (2018). The reliability paradox: Why robust cognitive tasks do not produce reliable individual differences. Behavior Research Methods, 50(3), 1166–1186.',
        url: 'https://doi.org/10.3758/s13428-017-0935-1',
      },
    ],
  },
};
