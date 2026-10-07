import { reactionTrials } from '@/lib/instruments/reaction';
import { rng } from '@/lib/instruments/sequences';
import type { ReactionTimeTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Tepki Hızı
 *
 * Klasik tepki süresi ölçümüne dayanan özgün bir görevdir. Donders'in (1868) basit ve seçmeli tepki süresi ayrımını
 * izler; düzeni, bilgisayarda uygulanan Deary-Liewald görevine (Deary, Liewald ve Nissan, 2011) benzer: boş bir kutuda
 * değişken bir beklemeden sonra bir daire belirir ve olabildiğince hızlı tepki verilir. Bu görevde seçmeli bölüm dört
 * değil iki kutuyla yapılır: dokunmatik ekranda iki başparmak iki düğmenin üstünde, bilgisayarda iki parmak sol ve sağ
 * ok tuşlarının üstünde durabilsin; parmağın ya da imlecin düğmeler arasında yol alması tepki süresine karışmasın.
 * Yönerge bunu söyler; fareyle verilen cevaplar ayrıca işaretlenir (raporda seçimin etkisi yorumlanmaz). Bekleme
 * süreleri, deneme sırası, puanlama ve rapor Ölçekhane'nindir; ticari testlerin uyaranları, puanlama kuralları ya da
 * normları kullanılmaz.
 *
 * Bölümler: basit tepki (tek kutu, 20 deneme) ve seçmeli tepki (iki kutu, 40 deneme: her kutuda 20). Her bölümden
 * önce geri bildirimli alıştırma. Dairenin belirmesinden önceki bekleme 1 ile 3 saniye arasındadır (dört aralığa
 * dengeli dağılır, aralık içinde rastgele); kurallar reactionTrials'ta. Diziler sabit bir tohumla üretilir: herkes aynı
 * denemeleri görür. Üretim kuralı değişirse testin sürüm numarası artırılmalıdır.
 *
 * Süreler: daire tepki verilene kadar, en çok 2 saniye kutuda kalır. Bekleme sırasında basılırsa deneme biter ve "çok
 * erken" sayılır (alıştırmada ve asıl bölümde kısa bir uyarı gösterilir); bir tepkiden sonraki ilk 0,5 saniyedeki
 * basışlar (ör. çift dokunuş) yok sayılır.
 *
 * Puanlama (lib/scoring/tasks.ts, scoreReaction): 150 ms'den kısa tepkiler (daire belirmeden basışlar dahil) "çok
 * erken", 2 saniyede verilmeyenler "süre aşımı" sayılır. Tipik tepki süresi, geçerli ve (seçmelide) doğru tepkilerin
 * ortancasıdır; en az 10 tepki gerekir. Seçimin etkisi: seçmeli ile basit bölümün tipik süreleri arasındaki fark.
 */

const r = rng(20261007);
const simpleTrials = reactionTrials(1, 5, r);
const choiceTrials = reactionTrials(2, 5, r);

const reaction: ReactionTimeTask = {
  key: 'tepki-hizi',
  kind: 'reaction_time',
  name: 'Tepki Hızı',
  measures: 'Tepki hızı: bir şeyi görür görmez tepki verebilme ve iki seçenekten doğrusunu hızla seçebilme.',
  instructions: [
    'Görev iki bölümden oluşur. Birinci bölümde ekranda bir kutu göreceksin. Kutuda bir daire belirdiği anda BAS düğmesine (ya da boşluk tuşuna) olabildiğince hızlı bas.',
    'İkinci bölümde yan yana iki kutu göreceksin. Daire hangi kutuda belirirse o taraftaki düğmeye olabildiğince hızlı bas. Telefonda ya da tablette iki başparmağını iki düğmenin üstünde tut; bilgisayarda fare yerine sol ve sağ ok tuşlarını kullan.',
    'Daireyi bekle: daire belirmeden basarsan o deneme sayılmaz. Hem hızlı hem doğru olmaya çalış. Her bölümden önce kısa bir alıştırma yapacaksın.',
  ],
  parts: [
    {
      key: 'simple',
      boxes: 1,
      practice: [
        { waitMs: 1600, box: 0 },
        { waitMs: 2400, box: 0 },
        { waitMs: 1200, box: 0 },
        { waitMs: 2900, box: 0 },
        { waitMs: 1900, box: 0 },
      ],
      trials: simpleTrials,
    },
    {
      key: 'choice',
      boxes: 2,
      practice: [
        { waitMs: 1700, box: 1 },
        { waitMs: 2200, box: 0 },
        { waitMs: 1100, box: 0 },
        { waitMs: 2600, box: 1 },
        { waitMs: 2900, box: 0 },
        { waitMs: 1400, box: 1 },
      ],
      trials: choiceTrials,
    },
  ],
  timeoutMs: 2000,
};

export const tepkiHizi: TaskInstrument = {
  slug: 'tepki-hizi',
  version: 1,
  engine: 'tasks',
  name: 'Tepki Hızı',
  shortName: 'Tepki hızı',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 5,
  sortOrder: 62,
  tagline: 'Ekranda bir daire belirir belirmez tepki verebilmeyi ve iki seçenekten doğrusunu hızla seçebilmeyi, yani tepki hızını ölçer.',
  description:
    'Bu görev, psikolojideki en eski ölçümlerden biri olan tepki süresi ölçümüne dayanır: boş bir kutuda bir daire belirdiği anda olabildiğince hızlı tepki verilir. Birinci bölümde tek kutu vardır (basit tepki); ikinci bölümde daire iki kutudan birinde belirir ve o taraftaki düğmeye basılır (seçmeli tepki). Görev yaklaşık 5 dakika sürer. Rapor; iki bölümdeki tipik tepki süresini, tepkilerin ne kadar tutarlı olduğunu ve seçim yapmanın tepkiyi ne kadar uzattığını sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Daire belirince bas!',
    paragraphs: [
      'Birazdan ekranda kutular göreceksin. Kutuda bir daire belirdiği anda düğmeye olabildiğince hızlı basacaksın.',
      'Görev iki bölümden oluşur. Her bölümden önce kısa bir alıştırma yapacaksın.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'th_basit', name: 'Basit tepki', plain: 'Tek kutuda daire belirince düğmeye basma süresi.' },
    { key: 'th_secmeli', name: 'Seçmeli tepki', plain: 'İki kutudan hangisinde daire belirdiğine göre doğru taraftaki düğmeye basma süresi ve doğruluğu.' },
    { key: 'th_fark', name: 'Seçimin etkisi', plain: 'İki seçenekten birini seçmenin tepki süresine eklediği süre.' },
  ],
  tasks: [reaction],
  science: {
    basedOn:
      'Klasik tepki süresi ölçümü: Donders’in (1868) basit ve seçmeli tepki süresi ayrımına dayanan düzen. Deary, Liewald ve Nissan’ın (2011) bilgisayarda uygulanan basit ve dört seçenekli tepki süresi görevine benzer biçimde, boş bir kutuda değişken bir beklemeden sonra beliren işarete olabildiğince hızlı tepki verilir; bu görevde seçmeli bölüm iki kutuyla yapılır. Bekleme süreleri, deneme sırası, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari testlerin uyaranları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Tepki süresini ölçer: basit bölümde bir şeyi görür görmez tepki verme hızını (basit tepki süresi), seçmeli bölümde iki seçenekten doğrusunu seçip tepki verme hızını ve doğruluğunu (seçmeli tepki süresi). Seçmeli tepki basit tepkiden daha uzun sürer; Donders (1868), aradaki farkı uyaranı ayırt etmek ve tepkiyi seçmek için gereken süre olarak yorumlamıştır. Seçenek sayısı arttıkça tepki süresi uzar (Hick, 1952). Tepki süresi, bilgiyi işleme hızının en temel göstergelerinden biridir.',
    turkishVersion: 'Özgün görev. Görev şekillerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Benzer bir görevde (Deary-Liewald; klavyeyle yapılan, seçmeli bölümü dört seçenekli bir görev), 18–80 yaşlarındaki 150 yetişkinde iç tutarlılık basit tepkide .94, seçmeli tepkide .97 bulunmuş; görevin süreleri, yerleşik bir tepki süresi aletiyle ölçülenlerle basit tepkide .68, seçmeli tepkide .82 düzeyinde ilişkili çıkmıştır (Deary, Liewald ve Nissan, 2011). İki bölüm arasındaki farka dayanan puanlar ise daha az güvenilirdir (Hedge ve ark., 2018); bu yüzden raporda seçimin etkisi yalnızca betimleyici olarak verilir ve 0,05 saniyeden küçük farklar belirgin sayılmaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Çocuklar büyüdükçe bilgiyi daha hızlı işler; 116 çocuğun 9 ve 14 yaşında on farklı hız göreviyle ölçüldüğü bir çalışmada işleme hızındaki gelişim gösterilmiştir (Kail ve Miller, 2006). Bu yüzden bir norm yaş gruplarına göre ayrı ayrı oluşturulmalıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır. Telefonda ya da tablette dokunarak, bilgisayarda klavyeyle (boşluk, sol ve sağ ok tuşları) yapılır; seçmeli bölüm fareyle yapılırsa süreye imlecin düğmeler arasındaki yolu da eklenir. Tarayıcıda ölçülen tepki süreleri gerçek süreden daha uzun çıkar ve bu fark cihazdan cihaza onlarca milisaniye değişebilir (Bridges ve ark., 2020; Pronk ve ark., 2020); bu yüzden aynı kişinin sonuçları karşılaştırılacaksa aynı cihaz kullanılmalıdır. İki bölüm arasındaki fark (seçimin etkisi) cihazın bu gecikmesinden daha az etkilenir.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Dikkat ya da öğrenmeyle ilgili durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Birkaç dakikalık tek bir uygulama sınırlı bilgi verir; okul başarısı ya da spordaki beceri hakkında tek başına bir sonuç çıkarılmamalıdır.',
      'Ölçülen süreler, cihazın, ekranın ve tarayıcının gecikmesini de içerir; farklı cihazlarda ölçülen süreler birbiriyle doğrudan karşılaştırılmamalıdır.',
      'Seçmeli bölüm tek parmakla ya da fareyle yapılırsa, süreye parmağın ya da imlecin düğmeler arasındaki yolu da eklenir.',
      'Sonuç; yorgunluk, isteklilik ve ortamdaki dikkat dağıtıcılar gibi etkenlerden etkilenir. Görev yeniden yapıldığında alıştırma etkisi görülebilir.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Donders, F. C. (1969). On the speed of mental processes (W. G. Koster, Çev.). Acta Psychologica, 30, 412–431. (Özgün yayın 1868.)',
        url: 'https://doi.org/10.1016/0001-6918(69)90065-1',
      },
      {
        text: 'Hick, W. E. (1952). On the rate of gain of information. Quarterly Journal of Experimental Psychology, 4(1), 11–26.',
        url: 'https://doi.org/10.1080/17470215208416600',
      },
      {
        text: 'Deary, I. J., Liewald, D. ve Nissan, J. (2011). A free, easy-to-use, computer-based simple and four-choice reaction time programme: The Deary-Liewald reaction time task. Behavior Research Methods, 43(1), 258–268.',
        url: 'https://doi.org/10.3758/s13428-010-0024-1',
      },
      {
        text: 'Kail, R. V. ve Miller, C. A. (2006). Developmental change in processing speed: Domain specificity and stability during childhood and adolescence. Journal of Cognition and Development, 7(1), 119–137.',
        url: 'https://doi.org/10.1207/s15327647jcd0701_6',
      },
      {
        text: 'Hedge, C., Powell, G. ve Sumner, P. (2018). The reliability paradox: Why robust cognitive tasks do not produce reliable individual differences. Behavior Research Methods, 50(3), 1166–1186.',
        url: 'https://doi.org/10.3758/s13428-017-0935-1',
      },
      {
        text: 'Bridges, D., Pitiot, A., MacAskill, M. R. ve Peirce, J. W. (2020). The timing mega-study: Comparing a range of experiment generators, both lab-based and online. PeerJ, 8, e9414.',
        url: 'https://doi.org/10.7717/peerj.9414',
      },
      {
        text: 'Pronk, T., Wiers, R. W., Molenkamp, B. ve Murre, J. (2020). Mental chronometry in the pocket? Timing accuracy of web applications on touchscreen and keyboard devices. Behavior Research Methods, 52(3), 1371–1382.',
        url: 'https://doi.org/10.3758/s13428-019-01321-2',
      },
    ],
  },
};
