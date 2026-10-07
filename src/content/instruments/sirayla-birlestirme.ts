import { mirrorLayout, rng, trailLayout } from '@/lib/instruments/sequences';
import type { TaskInstrument, TrailTask } from '@/lib/instruments/types';

/**
 * Sırayla Birleştirme Görevi
 *
 * İz sürme (Trail Making) düzenine dayanan özgün bir görevdir: ekrana dağılmış daireler sırayla dokunularak
 * birleştirilir. Birinci bölümde sayılar (1–16), ikinci bölümde sayılar ve harfler sırayla (1, A, 2, B … 8, G).
 * Harfler Türk alfabesinin sırasını izler (A, B, C, Ç, D, E, F, G). Kâğıt üzerinde kalemle çizmek yerine daireler
 * sırayla dokunulur; dokunulan daireler bir çizgiyle birleşir. Yerleşimler, bölümlerin uzunluğu, puanlama ve rapor
 * Ölçekhane'nindir; satılan İz Sürme Testi formlarının yerleşimleri ve normları kullanılmaz.
 *
 * Yerleşim sabit bir tohumla üretilir (src/lib/instruments/sequences.ts, trailLayout): sıradaki iki daire ne yan
 * yana ne de çok uzaktır, birleştirme çizgileri başka bir dairenin üstünden geçmez ve birbirini kesmez. İki bölümün
 * karşılaştırılabilmesi için ikisinde de 16 daire vardır ve ikinci bölümün yerleşimi, birinci bölümün yerleşiminin
 * ayna görüntüsüdür (mirrorLayout): izlenecek yolun uzunluğu ve daireler arasındaki uzaklıklar birebir aynıdır;
 * değişen, yerleşimin yönü ve dairelerdeki sayı ve harflerdir. Herkes aynı yerleşimi görür.
 */

const NUMBERS = Array.from({ length: 16 }, (_, i) => String(i + 1));
const MIXED = ['1', 'A', '2', 'B', '3', 'C', '4', 'Ç', '5', 'D', '6', 'E', '7', 'F', '8', 'G'];

const layout = trailLayout(NUMBERS.length, rng(20261121));
const practiceLayout = trailLayout(6, rng(20261122));

const sirayla: TrailTask = {
  key: 'sirayla',
  kind: 'trail',
  name: 'Sırayla Birleştirme',
  measures: 'Görsel tarama, hız ve sayılarla harfler arasında geçiş yapabilme.',
  instructions: [
    'Ekranda içinde sayı olan daireler göreceksin. 1’den başlayarak dairelere sırayla dokun (bilgisayarda tıkla): 1, 2, 3… Dokunduğun daireler bir çizgiyle birleşecek.',
    'İkinci bölümde sayılar ve harfler birlikte olacak. Bir sayıya, bir harfe sırayla dokun: 1, A, 2, B, 3, C… Harfler alfabe sırasıyla ilerler: A, B, C, Ç, D, E, F, G.',
    'Yanlış daireye dokunursan daire kısa bir süre işaretlenir; doğru daireyi bulup devam et. Olabildiğince hızlı ve dikkatli ol.',
    'Her bölümden önce kısa bir alıştırma yapacaksın. Asıl bölümde daireler ekrana gelince süre başlar.',
  ],
  parts: [
    {
      key: 'a',
      name: 'Sayılar',
      labels: NUMBERS,
      points: layout,
      practice: { labels: ['1', '2', '3', '4', '5', '6'], points: practiceLayout },
    },
    {
      key: 'b',
      name: 'Sayılar ve harfler',
      labels: MIXED,
      points: mirrorLayout(layout),
      practice: { labels: ['1', 'A', '2', 'B', '3', 'C'], points: mirrorLayout(practiceLayout) },
    },
  ],
  maxMs: 120_000,
  generator: 1,
};

export const siraylaBirlestirme: TaskInstrument = {
  slug: 'sirayla-birlestirme-gorevi',
  version: 1,
  engine: 'tasks',
  name: 'Sırayla Birleştirme Görevi',
  shortName: 'Sırayla birleştirme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 5,
  sortOrder: 58,
  tagline: 'Dairelere sırayla dokunarak görsel taramayı, hızı ve sayılarla harfler arasında geçiş yapabilmeyi ölçer.',
  description:
    'Bu görev, psikolojide 1940’lardan beri kullanılan iz sürme düzenine dayanır: ekrana dağılmış daireler sırayla birleştirilir. Birinci bölümde yalnızca sayılar (1, 2, 3…), ikinci bölümde sayılar ve harfler sırayla (1, A, 2, B…) vardır. İkinci bölüm iki sırayı birlikte izlemeyi gerektirdiği için genellikle daha uzun sürer. Görev yaklaşık 5 dakika sürer. Rapor; iki bölümün sürelerini, yanlış dokunuşları ve sayılarla harfler arasında geçiş yapmanın getirdiği ek süreyi sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Daireleri sırayla birleştir',
    paragraphs: [
      'Birazdan ekranda içinde sayı ya da harf olan daireler göreceksin. Görevin, dairelere doğru sırayla, olabildiğince hızlı dokunmak (bilgisayarda tıklamak).',
      'Görev iki bölümden oluşur: önce yalnızca sayılar, sonra sayılar ve harfler. Her bölümden önce kısa bir alıştırma yapacaksın.',
      'Tablet ya da bilgisayarla (fareyle) yapman önerilir; telefonda daireler küçük kalır. Görev klavyeyle yapılamaz. Sessiz bir yerde yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'iz_a', name: 'Sayılarla birleştirme', plain: 'Birinci bölümün süresi ve yanlış dokunuşları: görsel tarama ve hız.' },
    {
      key: 'iz_b',
      name: 'Sayı ve harflerle birleştirme',
      plain: 'İkinci bölümün süresi ve yanlış dokunuşları: tarama ve hıza ek olarak iki sırayı akılda tutup aralarında gidip gelme.',
    },
    {
      key: 'iz_gecis',
      name: 'Sayılarla harfler arasında geçiş',
      plain: 'İkinci bölümün birinci bölüme göre ne kadar uzun sürdüğü: iki sırayı akılda tutup aralarında geçiş yapmanın getirdiği ek süre.',
    },
  ],
  tasks: [sirayla],
  science: {
    basedOn:
      'İz sürme (Trail Making) düzeni: 1944’te ABD ordusunun bireysel test bataryasında kullanılan ve Reitan’ın (1958) çalışmalarıyla yaygınlaşan görev. Yerleşimler, bölümlerin uzunluğu, dokunmalı uygulama biçimi, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; satılan formların yerleşimleri ve normları kullanılmaz.',
    whatItMeasures:
      'Birinci bölüm görsel taramayı ve işlem hızını ölçer. İkinci bölüm bunlara ek olarak iki sırayı (sayılar ve harfler) aynı anda akılda tutmayı ve aralarında geçiş yapabilmeyi gerektirir; ikinci bölümün süresi en çok çalışma belleğiyle, ardından geçiş becerisiyle ilişkili bulunmuştur (Sánchez-Cubillo ve ark., 2009). Rapor iki bölümü iki yolla karşılaştırır: ikinci bölümün birinci bölüme oranı, görevler arasında geçiş yapmanın getirdiği ek yükle ilişkili bulunmuştur (Arbuthnott ve Frank, 2000); iki bölümün süreleri arasındaki fark ise görsel tarama ve el hızının etkisini azaltır (Sánchez-Cubillo ve ark., 2009). Bu beceriler; bir işten ötekine geçerken toparlanmak ya da birden çok kuralı aynı anda izlemek gibi durumlarda kullanılır.',
    turkishVersion: 'Özgün görev. Harfler Türk alfabesinin sırasını izler (A, B, C, Ç, D, E, F, G); yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. İki bölümün karşılaştırılabilmesi için ikisinde de 16 daire vardır ve ikinci bölümün yerleşimi, birinci bölümün yerleşiminin ayna görüntüsüdür: izlenecek yolun uzunluğu ve daireler arasındaki uzaklıklar birebir aynıdır; değişen, yerleşimin yönü ve dairelerdeki sayı ve harflerdir. Süreler cihazdan (ekran boyutu, dokunmatik ekran ya da fare) belirgin biçimde etkilenir; bu yüzden aynı kişinin sonuçları yalnızca aynı tür cihazla karşılaştırılmalıdır. İki bölümün oranı ve farkı, bölüm sürelerinin kendisinden daha az kesindir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Süreler çocukluk boyunca yaşla birlikte belirgin biçimde kısalır; bir norm yaş gruplarına ve cihaz türüne göre ayrı ayrı oluşturulmalıdır. Sonuçlar kâğıt-kalem iz sürme testlerinin süreleri ve normlarıyla karşılaştırılamaz: daire sayısı, yerleşim ve uygulama biçimi farklıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır: rakamları ve alfabe sırasını bilmek gerekir. Tablet ya da bilgisayarla (fareyle) yapılması önerilir; telefonda daireler küçük kalır. Görev klavyeyle yapılamaz. Süre, daireler ekrana geldiği anda başlar; ilk daireyi (1) bulma süresi de sürenin içindedir.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Tanı koymaz; dikkat, öğrenme ya da gelişimle ilgili bir endişe için uzman değerlendirmesi gerekir.',
      'Süreler; cihaz, ekran boyutu, dokunmatik ekran ya da fare kullanımı ve el becerisinden etkilenir.',
      'Alfabe sırasını henüz akıcı bilmeyen çocuklarda ikinci bölümün süresi, geçiş becerisinden çok alfabe bilgisini yansıtabilir.',
      'Görev yeniden yapıldığında alıştırma etkisiyle süreler kısalır; iki uygulama arasındaki küçük farklar yorumlanmamalıdır.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Reitan, R. M. (1958). Validity of the Trail Making Test as an indicator of organic brain damage. Perceptual and Motor Skills, 8(3), 271–276.',
        url: 'https://doi.org/10.2466/pms.1958.8.3.271',
      },
      {
        text: 'Arbuthnott, K. ve Frank, J. (2000). Trail Making Test, Part B as a measure of executive control: Validation using a set-switching paradigm. Journal of Clinical and Experimental Neuropsychology, 22(4), 518–528.',
        url: 'https://doi.org/10.1076/1380-3395(200008)22:4;1-0;FT518',
      },
      {
        text: 'Bowie, C. R. ve Harvey, P. D. (2006). Administration and interpretation of the Trail Making Test. Nature Protocols, 1(5), 2277–2281.',
        url: 'https://doi.org/10.1038/nprot.2006.390',
      },
      {
        text: 'Sánchez-Cubillo, I., Periáñez, J. A., Adrover-Roig, D., Rodríguez-Sánchez, J. M., Ríos-Lago, M., Tirapu, J. ve Barceló, F. (2009). Construct validity of the Trail Making Test: Role of task-switching, working memory, inhibition/interference control, and visuomotor abilities. Journal of the International Neuropsychological Society, 15(3), 438–450.',
        url: 'https://doi.org/10.1017/S1355617709090626',
      },
    ],
  },
};
