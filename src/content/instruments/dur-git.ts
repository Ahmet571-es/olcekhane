import { constrainedOrder, rng } from '@/lib/instruments/sequences';
import type { GoNoGoTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Dur-Git Görevi
 *
 * Git/gitme (go/no-go) düzenine dayanan özgün bir görevdir: ekranda harfler art arda belirir; her harfte düğmeye
 * basılır, yalnızca X görününce basılmaz. Harflerin dörtte üçünde basıldığı için basmak bir alışkanlığa dönüşür ve
 * X'te durmak çaba ister. Bu düzen, Donders'in (1868) tepki süresi çalışmalarındaki "yalnızca birine tepki ver"
 * görevine dayanır. Harfler, deneme sırası, süreler, puanlama ve rapor Ölçekhane'nindir; ticari sürekli performans
 * testlerinin uyaranları, puanlama kuralları ya da normları kullanılmaz.
 *
 * İki bölüm, her birinde 60 deneme: 45 bas harfi (8 harf, dengeli) ve 15 X. Bölümün ilk üç denemesinde X gelmez,
 * her X'ten önce en az iki bas harfi gelir (basma alışkanlığı her seferinde yeniden kurulsun), aynı harf art arda
 * gelmez ve en çok 8 bas harfi art arda gelir. Deneme sırası sabit bir tohumla üretilir: herkes aynı denemeleri
 * görür. Üretim kuralı değişirse testin sürüm numarası artırılmalıdır.
 */

/** Bas harfleri: X'e benzemeyen, kolay tanınan büyük harfler. */
const GO_LETTERS = ['A', 'E', 'H', 'M', 'O', 'P', 'R', 'T'];
const STOP = 'X';

type Trial = { letter: string; go: boolean };

function allowed(before: Trial[], next: Trial): boolean {
  const last = before[before.length - 1];
  if (!next.go) {
    if (before.length < 3) return false;
    if (!before[before.length - 1].go || !before[before.length - 2].go) return false;
  } else {
    if (last && last.letter === next.letter) return false;
    let run = 0;
    for (let i = before.length - 1; i >= 0 && before[i].go; i--) run++;
    if (run >= 8) return false;
  }
  return true;
}

function block(rand: () => number): Trial[] {
  const cells: Trial[] = [];
  // 45 bas harfi: sekiz harf, beşi 6'şar, üçü 5'er kez (hangi harflerin 5 kez geleceği tohumla belirlenir).
  const counts = GO_LETTERS.map((_, i) => (i < 5 ? 6 : 5));
  const order = GO_LETTERS.map((l, i) => ({ l, k: rand(), i })).sort((a, b) => a.k - b.k);
  order.forEach(({ l }, rank) => {
    for (let k = 0; k < counts[rank]; k++) cells.push({ letter: l, go: true });
  });
  for (let k = 0; k < 15; k++) cells.push({ letter: STOP, go: false });
  return constrainedOrder(cells, rand, allowed);
}

const r = rng(20261111);
const trials = [...block(r), ...block(r)];

const durGit: GoNoGoTask = {
  key: 'dur-git',
  kind: 'go_nogo',
  name: 'Dur-Git',
  measures: 'Durabilme: hızla basmaya alışmışken gerektiğinde basmadan durabilme (tepki ketlemesi).',
  instructions: [
    'Ekranda harfler tek tek, hızlıca belirecek. Her harf göründüğünde BAS düğmesine (ya da boşluk tuşuna) olabildiğince hızlı bas.',
    'Ama X harfini görürsen basma: dur ve bir sonraki harfi bekle.',
    'Hem hızlı olmaya hem de X’te durmaya çalış; ara sıra yanılmak çok normal. Önce kısa bir alıştırma yapacaksın. Görev iki bölümden oluşur; arada kısa bir mola var.',
  ],
  stop: STOP,
  stimulusMs: 600,
  responseMs: 1200,
  itiMs: [300, 700],
  blocks: 2,
  practice: [
    { letter: 'M', go: true },
    { letter: 'A', go: true },
    { letter: 'R', go: true },
    { letter: 'X', go: false },
    { letter: 'T', go: true },
    { letter: 'E', go: true },
    { letter: 'X', go: false },
    { letter: 'O', go: true },
    { letter: 'P', go: true },
    { letter: 'X', go: false },
  ],
  trials,
};

export const durGitGorevi: TaskInstrument = {
  slug: 'dur-git-gorevi',
  version: 1,
  engine: 'tasks',
  name: 'Dur-Git Görevi',
  shortName: 'Dur-git',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 5,
  sortOrder: 57,
  tagline: 'Harflere hızla tepki verirken X görününce durabilmeyi, yani alışkanlık hâline gelmiş basma tepkisini vermeden durabilmeyi ölçer.',
  description:
    'Bu görev, psikolojide tepki süresi araştırmalarından gelen “dur-git” (go/no-go) düzenine dayanır: ekranda harfler art arda belirir; her harfte düğmeye basılır, yalnızca X görününce basılmaz. Harflerin çoğunda basıldığı için basmak bir alışkanlığa dönüşür ve X’te durmak çaba ister. Görev iki bölümden oluşur ve yaklaşık 5 dakika sürer. Rapor; X’te durabilmeyi, diğer harflere kaçırmadan tepki verebilmeyi ve tepki hızını sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Bas ya da dur',
    paragraphs: [
      'Birazdan ekranda harfler tek tek belirecek. Her harfte düğmeye basacaksın; yalnızca X görünce durup basmayacaksın.',
      'Görev iki bölümden oluşur; aralarında kısa bir mola var. Başlamadan önce kısa bir alıştırma yapacaksın.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'dg_durma', name: 'Durabilme', plain: 'X görününce düğmeye basmadan durabilme oranı: alışkanlık hâline gelmiş basma tepkisini vermeden durabilme.' },
    { key: 'dg_tepki', name: 'Kaçırmadan tepki', plain: 'Diğer harflerde zamanında basma oranı: dikkati görev boyunca açık tutabilme.' },
    { key: 'dg_hiz', name: 'Tepki hızı', plain: 'Doğru basışlarda tipik tepki süresi.' },
  ],
  tasks: [durGit],
  science: {
    basedOn:
      'Dur-git (go/no-go) düzeni: Donders’in (1868) tepki süresi çalışmalarındaki “yalnızca bir uyarana tepki ver” görevinden gelen ve bugün tepki ketlemesini ölçmek için yaygın olarak kullanılan düzen. Harfler, deneme sırası, süreler, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari sürekli performans testlerinin uyaranları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Tepki ketlemesini, yani alışkanlık hâline gelmiş bir tepkiyi (basmayı) gerektiğinde vermeden durabilmeyi (X’te durma) ölçer. Diğer harflere kaçırmadan tepki verebilmek ise dikkatin görev boyunca açık tutulduğunu gösterir. Bu beceriler; sırasını beklemek, düşünmeden cevap vermemek ya da hızlı bir işin içinde bir kuralı uygulamak gibi durumlarda kullanılır.',
    turkishVersion: 'Özgün görev. Görev harflerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Dur-git görevlerinde X’te yanlışlıkla basma sayısı hızla da ilgilidir: çok hızlı çalışan biri daha sık yanılabilir. Bu yüzden raporda durabilme, tepki hızıyla birlikte yorumlanır.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Tepki ketlemesi çocukluk ve ergenlik boyunca gelişir; çocuklar bu tür görevlerde yetişkinlerden daha çok yanlışlıkla basar (Casey ve ark., 1997). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır. Dokunmatik ekranla, fareyle ya da klavyeyle (boşluk tuşu) yapılabilir; aynı kişinin sonuçları karşılaştırılacaksa aynı tür cihaz kullanılmalıdır.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Dikkat eksikliği ve hiperaktivite bozukluğu (DEHB) gibi durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Birkaç dakikalık tek bir uygulama sınırlı bilgi verir; gündelik hayattaki dürtüsellik ya da dikkat hakkında tek başına bir sonuç çıkarılmamalıdır.',
      'Sonuç; yorgunluk, isteklilik, ortamdaki gürültü ve cihaz gibi etkenlerden etkilenir. Görev yeniden yapıldığında alıştırma etkisi görülebilir.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Donders, F. C. (1969). On the speed of mental processes (W. G. Koster, Çev.). Acta Psychologica, 30, 412–431. (Özgün yayın 1868.)',
        url: 'https://doi.org/10.1016/0001-6918(69)90065-1',
      },
      {
        text: 'Casey, B. J., Trainor, R. J., Orendi, J. L., Schubert, A. B., Nystrom, L. E., Giedd, J. N., Castellanos, F. X., Haxby, J. V., Noll, D. C., Cohen, J. D., Forman, S. D., Dahl, R. E. ve Rapoport, J. L. (1997). A developmental functional MRI study of prefrontal activation during performance of a go-no-go task. Journal of Cognitive Neuroscience, 9(6), 835–847.',
        url: 'https://doi.org/10.1162/jocn.1997.9.6.835',
      },
    ],
  },
};
