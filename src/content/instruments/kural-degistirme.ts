import { mixedTrials, pureTrials } from '@/lib/instruments/rule-switch';
import { rng } from '@/lib/instruments/sequences';
import type { RuleSwitchTask, RuleSwitchTrial, TaskInstrument } from '@/lib/instruments/types';

/**
 * Kural Değiştirme
 *
 * Görev değiştirme (task switching) düzenine dayanan özgün bir görevdir. Her denemede mavi ya da turuncu bir daire ya da
 * kare görünür; şeklin üstündeki işaret (RENK ya da ŞEKİL) kuralı söyler: RENK kuralında mavi şekle sol, turuncu şekle
 * sağ düğme; ŞEKİL kuralında daireye sol, kareye sağ düğme (lib/instruments/rule-switch.ts). İşaret şekilden 0,6 saniye
 * önce belirir ve şekille birlikte ekranda kalır; şekil en çok 4 saniye bekler.
 *
 * Bölümler: yalnızca renk kuralı (16 deneme), yalnızca şekil kuralı (16 deneme), iki kuralın karıştığı iki bölüm (her
 * biri 33 deneme: ilk denemeden sonra kuralın değiştiği 16 ve sürdüğü 16 deneme). Her bölümden önce geri bildirimli
 * alıştırma (renk 8, şekil 8, karışık 10 deneme). Diziler sabit bir tohumla üretilir: herkes aynı denemeleri görür.
 *
 * Puanlama (lib/scoring/tasks.ts, scoreRuleSwitch): 0,2 saniyeden kısa cevaplar ve süre aşımları doğru sayılmaz. Tipik
 * süreler geçerli doğru cevapların ortancasıdır; bölümün ilk denemesi ve bir hatadan hemen sonraki deneme süreye katılmaz.
 * Kural değiştirmenin bedeli: kuralın değiştiği ve sürdüğü denemelerin tipik süreleri arasındaki fark; iki kuralı akılda
 * tutmanın bedeli: karışık bölümde kuralın sürdüğü denemeler ile tek kurallı bölümler arasındaki fark.
 */

const r = rng(20261009);
const trials: RuleSwitchTrial[] = [...pureTrials('color', 0, 4, r), ...pureTrials('shape', 1, 4, r), ...mixedTrials(2, 'color', r), ...mixedTrials(3, 'shape', r)];

const practiceMixed: RuleSwitchTrial[] = (
  [
    ['color', 0, 1],
    ['color', 1, 1],
    ['shape', 1, 0],
    ['shape', 0, 1],
    ['color', 1, 0],
    ['shape', 0, 0],
    ['shape', 1, 1],
    ['color', 0, 1],
    ['color', 1, 0],
    ['shape', 1, 0],
  ] as const
).map(([rule, color, shape]) => ({ rule, color, shape, block: 2 }));

const task: RuleSwitchTask = {
  key: 'kural-degistirme',
  kind: 'rule_switch',
  name: 'Kural Değiştirme',
  measures: 'Bilişsel esneklik: bir kuraldan ötekine geçebilme ve iki kuralı birlikte akılda tutabilme.',
  instructions: [
    'Ekranda mavi ya da turuncu bir daire ya da kare göreceksin. Şeklin üstündeki işaret, hangi kurala göre basacağını söyler.',
    'RENK işaretinde şeklin rengine bak: mavi ise sol, turuncu ise sağ düğmeye bas. ŞEKİL işaretinde şeklin biçimine bak: daire ise sol, kare ise sağ düğmeye bas.',
    'Önce yalnızca renk kuralıyla, sonra yalnızca şekil kuralıyla birer bölüm yapacaksın; sonra iki kural karışacak. Her bölümden önce kısa bir alıştırma var. Hem hızlı hem doğru olmaya çalış.',
    'Telefonda ya da tablette iki başparmağını iki düğmenin üstünde tut; bilgisayarda sol ve sağ ok tuşlarını kullan.',
  ],
  practice: { color: pureTrials('color', 0, 2, r), shape: pureTrials('shape', 1, 2, r), mixed: practiceMixed },
  trials,
  cueMs: 600,
  timeoutMs: 4000,
  itiMs: [500, 800],
};

export const kuralDegistirme: TaskInstrument = {
  slug: 'kural-degistirme',
  version: 1,
  engine: 'tasks',
  name: 'Kural Değiştirme',
  shortName: 'Kural değiştirme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 7,
  sortOrder: 62.5,
  tagline: 'Bir kuraldan ötekine geçebilmeyi ve iki kuralı birlikte akılda tutabilmeyi, yani bilişsel esnekliği ölçer.',
  description:
    'Bu görev, psikolojide bilişsel esnekliği incelemek için kullanılan görev değiştirme düzenine dayanır: ekrandaki şekle, üstündeki işaretin söylediği kurala göre (rengine ya da biçimine bakarak) cevap verilir. Önce iki kural ayrı ayrı denenir, sonra kurallar karışır ve işaret her denemede değişebilir. Görev yaklaşık 7 dakika sürer. Rapor; doğruluğu, kural değiştiğinde cevabın ne kadar yavaşladığını, iki kuralı birlikte akılda tutmanın etkisini ve hataların türünü sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Kurala bak, doğru düğmeye bas!',
    paragraphs: [
      'Birazdan ekranda renkli şekiller göreceksin. Şeklin üstündeki işaret, şekle rengine mi yoksa biçimine mi bakarak cevap vereceğini söyleyecek.',
      'Görev dört bölümden oluşur. Her bölümden önce kısa bir alıştırma yapacaksın.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'kd_dogruluk', name: 'Doğruluk', plain: 'Şekillere, işaretin söylediği kurala göre doğru düğmeyle cevap verme oranı.' },
    { key: 'kd_degisim', name: 'Kural değiştirme', plain: 'Kural değiştiğinde cevabın, aynı kural sürerkenkine göre ne kadar yavaşladığı.' },
    { key: 'kd_karisik', name: 'İki kuralı akılda tutma', plain: 'İki kuralın karıştığı bölümde, kural değişmese bile cevabın tek kurallı bölümlere göre ne kadar yavaşladığı.' },
    { key: 'kd_calisma', name: 'Çalışma biçimi', plain: 'Tipik cevap süresi; süre içinde basılmayan, çok erken basılan ya da hep aynı düğmeye basılan denemeler.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Görev değiştirme düzeni: iki kural arasında gidip gelirken, kural değiştikten sonra verilen cevaplar, kural sürerken verilenlerden daha yavaştır ve daha çok hata içerir; bu fark çok uzun alıştırmalardan sonra bile ortadan kalkmaz (Stoet ve Snyder, 2007). Bu görevde kurallar renk ve şekildir; hangi kurala göre cevap verileceğini her denemede şeklin üstündeki işaret söyler. Şekiller, deneme sırası, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari testlerin uyaranları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Bilişsel esnekliği, yani bir kuraldan ötekine geçebilmeyi ölçer: kural değiştiğinde cevabın ne kadar yavaşladığını (kural değiştirmenin bedeli) ve iki kuralın karıştığı bölümde, kural değişmese bile cevabın ne kadar yavaşladığını (iki kuralı akılda tutmanın bedeli). Bu ikinci fark, iki görevin kurallarını birlikte akılda tutabilmenin daha genel bir göstergesi olarak yorumlanır (Zinke ve ark., 2012). Doğruluk ve hataların türü (iki kuralın farklı düğmeyi istediği şekillerde öteki kurala göre basmak) ayrıca anlatılır.',
    turkishVersion: 'Özgün görev. Görev şekillerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Kural değiştirmenin bedeli gibi iki koşul arasındaki farka dayanan puanlar, görevin kendisi güçlü bir etki gösterse bile kişiler arasındaki farkları güvenilir biçimde ölçmekte zorlanır (Hedge ve ark., 2018); bu yüzden raporda farklar yalnızca betimleyici olarak verilir ve 0,05 saniyeden küçük farklar belirgin sayılmaz. Deneme sırası sabittir: herkes aynı denemeleri görür; kuralın değiştiği ve sürdüğü denemelerde şekiller ve düğmeler dengelidir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Kural değiştirme gibi kendini yönetme becerilerinin (yürütücü beceriler) gelişimi gençlik yıllarına kadar sürer (Zinke ve ark., 2012); bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Telefonda ya da tablette dokunarak, bilgisayarda sol ve sağ ok tuşlarıyla yapılır. Tarayıcıda ölçülen süreler cihazdan cihaza değişebilir; kural değiştirmenin bedeli iki koşul arasındaki fark olduğu için bu gecikmeden daha az etkilenir. Görev mavi ile turuncuyu ayırt etmeyi gerektirir; bu iki rengi ayırt etmekte zorlanan biri için sonuç geçerli değildir.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Dikkat ya da öğrenmeyle ilgili durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Bilişsel esnekliğin yalnızca bir yönünü (iki basit kural arasında geçiş) ölçer; günlük hayatta plan değiştirebilmek ya da yeni durumlara uyum sağlamak hakkında tek başına bir sonuç çıkarılmamalıdır.',
      'İki kuralın karıştığı bölümler görevin sonunda geldiği için iki kuralı akılda tutmanın bedeli, göreve alışmanın etkisiyle birlikte ölçülür.',
      'Ölçülen süreler cihazın, ekranın ve tarayıcının gecikmesini de içerir; farklı cihazlarda ölçülen süreler birbiriyle doğrudan karşılaştırılmamalıdır.',
      'Sonuç; yorgunluk, isteklilik ve ortamdaki dikkat dağıtıcılardan etkilenir. Görev yeniden yapıldığında alıştırma etkisi görülebilir.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Stoet, G. ve Snyder, L. H. (2007). Extensive practice does not eliminate human switch costs. Cognitive, Affective, & Behavioral Neuroscience, 7(3), 192–197.',
        url: 'https://doi.org/10.3758/CABN.7.3.192',
      },
      {
        text: 'Zinke, K., Einert, M., Pfennig, L. ve Kliegel, M. (2012). Plasticity of executive control through task switching training in adolescents. Frontiers in Human Neuroscience, 6, 41.',
        url: 'https://doi.org/10.3389/fnhum.2012.00041',
      },
      {
        text: 'Hedge, C., Powell, G. ve Sumner, P. (2018). The reliability paradox: Why robust cognitive tasks do not produce reliable individual differences. Behavior Research Methods, 50(3), 1166–1186.',
        url: 'https://doi.org/10.3758/s13428-017-0935-1',
      },
    ],
  },
};
