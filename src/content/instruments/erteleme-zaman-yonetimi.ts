import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Erteleme ve Zaman Yönetimi
 * Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; başka bir ölçeğin (ör. Tuckman, Lay ya da Steel erteleme
 * ölçekleri, Macan'ın Zaman Yönetimi Davranışı Ölçeği) maddeleri kullanılmamıştır. Beş alan:
 *  - Ertelemeden başlama: ertelemenin tersi. Erteleme, "bir işi, ertelemenin zarar vereceğini bilerek isteyerek sonraya
 *    bırakmak"tır (Steel, 2007); maddeler bu tanımı, son ana sıkışmayı ve niyet ile eylem arasındaki boşluğu sorar.
 *  - Planlama ve öncelik: yapılacakları yazma, önem sırasına koyma, ara hedefler (Macan ve ark., 1990'daki hedef ve öncelik
 *    belirleme ile planlama) ve "ne zaman, nerede" planı (Gollwitzer ve Sheeran, 2006).
 *  - Süreyi tahmin etme: bir işin süresini isabetli tahmin etme, geçmiş deneyimi hesaba katma, pay bırakma, zamanın nereye
 *    gittiğinin farkında olma (sürenin kısa tahmin edilmesi: Buehler, Griffin ve Ross, 1994).
 *  - Odağı koruma: dikkat dağıtıcılara ve anlık isteklere kapılmamak (Steel, 2007'de ertelemeyle en güçlü ilişkili
 *    özelliklerden dikkat dağınıklığı ve dürtüsellik).
 *  - Zamanın kontrolü: zamanının kontrolünün kendisinde olduğu duygusu (Macan ve ark., 1990'da stres ve doyumla en güçlü
 *    ilişkili etken).
 * Bütün alanlarda yüksek puan becerinin sık kullanıldığını gösterir (değerlendirici). Her alanda ters yönlü madde var
 * (25 maddenin 11'i); birbirinin tersi beş çiftin en az üçünde iki cümleye de uçtaki iki seçenekten biri verilirse uyarı
 * gösterilir (evet deme eğilimi olan biri ertelemeyi çok, planlamayı yüksek göstermesin diye). Maddeler okula özgü değildir ("iş"
 * kişinin sorumluluğundaki her şeyi kapsar): yetişkinlere de açıktır. Durum: pilot.
 */

const S = 'start';
const P = 'planning';
const E = 'estimation';
const F = 'focus';
const C = 'control';

/** Uygulama sırası: alanlar sırayla döner (başlama, planlama, odak, süre, kontrol). */
const RAW: { key: string; scale: string; text: string; reverse?: boolean }[] = [
  { key: 'S1', scale: S, reverse: true, text: 'Bir işi, sonra sıkışacağımı bile bile ertelerim.' },
  { key: 'P1', scale: P, text: 'Yapacaklarımı aklımda tutmaya çalışmak yerine bir yere not ederim.' },
  { key: 'F1', scale: F, reverse: true, text: 'Bir işle uğraşırken kendimi telefona, tablete ya da başka bir ekrana bakarken bulurum.' },
  { key: 'E1', scale: E, text: 'Bir işin ne kadar süreceğini isabetli tahmin ederim.' },
  { key: 'C1', scale: C, text: 'Gün içinde işlerimi ben yönlendiririm.' },

  { key: 'S2', scale: S, reverse: true, text: 'Yapmam gereken bir iş varken “önce şunu da halledeyim” diyerek vakit geçiririm.' },
  { key: 'P2', scale: P, text: 'Yapacaklarımı ne kadar önemli ve acil olduklarına göre sıraya koyarım.' },
  { key: 'F2', scale: F, reverse: true, text: 'Bir işin ortasında aklıma gelen başka bir şeye geçiveririm.' },
  { key: 'E2', scale: E, reverse: true, text: 'İşlerim tahmin ettiğimden uzun sürer.' },
  { key: 'C2', scale: C, reverse: true, text: 'Yetiştirmem gereken işlerin altında ezildiğimi hissederim.' },

  { key: 'S3', scale: S, reverse: true, text: 'Teslimine bol zaman olan bir işi son güne bırakırım.' },
  { key: 'P3', scale: P, text: 'Uzun süren bir iş için kendime ara hedefler ve tarihler koyarım.' },
  { key: 'F3', scale: F, reverse: true, text: 'Daha eğlenceli bir şey çıkınca yaptığım işi yarıda bırakırım.' },
  { key: 'E3', scale: E, text: 'Bir işe ayıracağım zamanı planlarken benzer işlerin daha önce ne kadar sürdüğünü hesaba katarım.' },
  { key: 'C3', scale: C, text: 'Önemli işlerime yetecek zamanı bulurum.' },

  { key: 'S4', scale: S, text: 'Bana bir iş verildiğinde ona aynı gün başlarım.' },
  { key: 'P4', scale: P, text: 'Bir işi ne zaman ve nerede yapacağımı önceden kararlaştırırım.' },
  { key: 'F4', scale: F, text: 'Bir işe oturduğumda, bitirene kadar dikkatimi dağıtan şeyleri uzak tutarım.' },
  { key: 'E4', scale: E, text: 'Bir işe ayıracağım süreye, beklenmedik durumlar için biraz pay eklerim.' },
  { key: 'C4', scale: C, reverse: true, text: 'İşler üst üste binince ne yapacağımı şaşırırım.' },

  { key: 'S5', scale: S, text: 'Yapmam gereken işlere, zamanı geldiğinde hemen başlarım.' },
  { key: 'P5', scale: P, reverse: true, text: 'Güne bir plan yapmadan, aklıma estiği gibi başlarım.' },
  { key: 'F5', scale: F, text: 'Sıkıcı bir işte de dikkatimi işin üzerinde tutarım.' },
  { key: 'E5', scale: E, reverse: true, text: 'Gün içinde zamanın nereye gittiğini anlamadan akşam olur.' },
  { key: 'C5', scale: C, text: 'Yapmam gerekenlerin yanında dinlenmeye ve sevdiğim şeylere de zaman ayırırım.' },
];

export const ertelemeZamanYonetimi: LikertInstrument = {
  slug: 'erteleme-ve-zaman-yonetimi',
  version: 1,
  engine: 'likert',
  name: 'Erteleme ve Zaman Yönetimi',
  shortName: 'Erteleme ve zaman yönetimi',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 6,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 35.6,
  tagline: 'İşleri ne kadar ertelediğini ve zamanını nasıl yönettiğini gösterir; ertelemenin hangi alışkanlıklarla birlikte görüldüğünü yorumlar.',
  description:
    'Bu test beş alanı inceler: işlere ertelemeden başlama, planlama ve öncelik belirleme, bir işin süresini tahmin etme, dikkat dağıtıcılara karşı odağı koruma ve zamanının kontrolünün kendinde olduğu duygusu. Rapor her alanı ayrı ayrı anlatır, ardından alanları birlikte yorumlar: ertelemenin hangi zaman yönetimi alışkanlıklarıyla birlikte görüldüğünü (araştırmalarda ertelemeyle ilişkili bulunan plan eksikliği ve dikkat dağıtıcılar, sürenin kısa tahmin edilmesi, zamanın kontrolünü kaybetmiş hissetme) gösterir. Maddeler sıfırdan yazılmıştır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Zamanını nasıl kullanıyorsun?',
    paragraphs: [
      'Birazdan işlere başlama, plan yapma ve zamanı kullanma ile ilgili 25 cümle göreceksin. Her birinin senin için ne sıklıkla doğru olduğunu seç.',
      'Cümlelerdeki “iş” sözcüğü, sorumluluğundaki her şeyi kapsar: çalışmak, görevler, ev işleri gibi.',
      'Doğru ya da yanlış cevap yok. Olması gerekeni değil, genellikle nasıl olduğunu seçersen rapor sana en çok yarar.',
    ],
  },
  prompt: 'Bu senin için ne sıklıkla doğru?',
  options: [
    { value: 1, label: 'Hiçbir zaman' },
    { value: 2, label: 'Nadiren' },
    { value: 3, label: 'Bazen' },
    { value: 4, label: 'Sık sık' },
    { value: 5, label: 'Her zaman' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.8 },
  // Bir ondalıklı ortalamaya göre: 1,0–2,4 düşük (beceri en çok "nadiren" kullanılıyor), 2,5–3,4 orta ("bazen"), 3,5–5,0
  // yüksek ("sık sık" ve daha sık).
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'low', min: 1 },
      { band: 'average', min: 2.5 },
      { band: 'high', min: 3.5 },
    ],
  },
  oppositePairs: [
    ['S5', 'S1'],
    ['P4', 'P5'],
    ['E1', 'E2'],
    ['F4', 'F1'],
    ['C1', 'C2'],
  ],
  scales: [
    {
      key: S,
      name: 'Ertelemeden başlama',
      plain: 'Yapılması gereken işlere ertelemeden, zamanında başlama. Puan düşükse işler sık sık ertelenir.',
      poles: { low: 'İşleri sık sık erteleyen', high: 'İşlere zamanında başlayan' },
    },
    {
      key: P,
      name: 'Planlama ve öncelik',
      plain: 'Yapılacakları yazma, önem sırasına koyma, ara hedefler belirleme ve bir işi ne zaman, nerede yapacağına önceden karar verme.',
      poles: { low: 'Plan yapmadan, aklına geldiği gibi', high: 'Planlı, öncelik belirleyen' },
    },
    {
      key: E,
      name: 'Süreyi tahmin etme',
      plain: 'Bir işin ne kadar süreceğini isabetli tahmin etme ve gün içinde zamanın nereye gittiğinin farkında olma.',
      poles: { low: 'Süreyi kısa tahmin eden', high: 'Süreyi gerçekçi tahmin eden' },
    },
    {
      key: F,
      name: 'Odağı koruma',
      plain: 'Bir işle uğraşırken telefon gibi dikkat dağıtıcılara ve anlık isteklere kapılmadan işi sürdürme.',
      poles: { low: 'Dikkat dağıtıcılara kolay kapılan', high: 'Odağını koruyabilen' },
    },
    {
      key: C,
      name: 'Zamanın kontrolü',
      plain: 'Zamanının kontrolünün kendinde olduğunu, işlere ve dinlenmeye yetecek zamanı bulabildiğini hissetme.',
      poles: { low: 'İşlerin altında ezilmiş hisseden', high: 'Zamanını yönettiğini hisseden' },
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; başka bir ölçeğin maddeleri kullanılmamıştır. Dayanakları: ertelemenin tanımı ve ertelemeyle ilişkili özellikler (Steel, 2007), zaman yönetimi davranışları ve zamanı kontrol edebilme duygusu (Macan ve ark., 1990), bir işin süresinin kısa tahmin edilmesi (Buehler, Griffin ve Ross, 1994) ve “ne zaman, nerede” planları (Gollwitzer ve Sheeran, 2006).',
    whatItMeasures:
      'Beş alanı ölçer: işlere ertelemeden başlama, planlama ve öncelik belirleme, bir işin süresini tahmin etme, dikkat dağıtıcılara karşı odağı koruma ve zamanın kontrolünün kişide olduğu duygusu. Her alanda yüksek puan o becerinin sık kullanıldığını gösterir; “Ertelemeden başlama” puanının düşük olması işlerin sık ertelendiği anlamına gelir. Rapor alanları ayrıca birlikte yorumlar: ertelemenin hangi zaman yönetimi alışkanlıklarıyla birlikte görüldüğünü gösterir. Erteleme tembellikle açıklanamaz: araştırmacılar onu çoğu zaman zor ya da sıkıcı bir işin o an verdiği kötü duygudan kaçmak olarak açıklar; bu kaçış sonradan çoğu zaman daha kötü hissettirir (Sirois ve Pychyl, 2013). Kişilik değil davranış ölçer; araştırmalarda zaman yönetimi başarıyla ve ondan biraz daha güçlü biçimde kendini iyi hissetmeyle ilişkili bulunmuştur (Aeon, Faber ve Panaccio, 2021).',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Her alanda ters yönlü maddeler vardır (toplam 25 maddenin 11’i); birbirinin tersini söyleyen beş cümle çiftinden en az üçünde iki cümleye de uçtaki seçeneklerden biri (“Sık sık” ya da “Her zaman”; “Hiçbir zaman” ya da “Nadiren”) verilirse raporda “evet ya da hayır deme eğilimi” uyarısı gösterilir.',
    reliability: 'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar, her davranışın ne sıklıkla görüldüğüne göre (1: hiçbir zaman, 5: her zaman) yorumlanır; kişi başkalarıyla karşılaştırılmaz.',
    ageNote:
      '6. sınıftan itibaren; mezunlar ve yetişkinler de çözebilir. Maddeler okula özgü değildir: “iş” sözcüğü, ödevden işteki görevlere kadar kişinin sorumluluğundaki her şeyi kapsar.',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Kişinin kendi bildirimine dayanır; insanlar zamanlarını nasıl kullandıklarını olduğundan farklı değerlendirebilir.',
      'Erteleme işe ve döneme göre değişir; bu test genel eğilimi sorar.',
      'Erteleme bir tanı değildir, ama sıkıntılı bir dönemle birlikte görülebilir: araştırmalarda çökkünlükle (depresyon) de ilişkili bulunmuştur (Steel, 2007). Erteleme hayatı belirgin biçimde zorlaştırıyorsa bir uzmanla görüşmek gerekir.',
      'Bulgular çoğunlukla ilişkiseldir: bir alışkanlığın ertelemeyle birlikte görülmesi, ertelemenin tek nedeni olduğu anlamına gelmez.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. Psychological Bulletin, 133(1), 65–94.',
        url: 'https://doi.org/10.1037/0033-2909.133.1.65',
      },
      {
        text: 'Macan, T. H., Shahani, C., Dipboye, R. L. ve Phillips, A. P. (1990). College students’ time management: Correlations with academic performance and stress. Journal of Educational Psychology, 82(4), 760–768.',
        url: 'https://doi.org/10.1037/0022-0663.82.4.760',
      },
      {
        text: 'Buehler, R., Griffin, D. ve Ross, M. (1994). Exploring the “planning fallacy”: Why people underestimate their task completion times. Journal of Personality and Social Psychology, 67(3), 366–381.',
        url: 'https://doi.org/10.1037/0022-3514.67.3.366',
      },
      {
        text: 'Gollwitzer, P. M. ve Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69–119.',
        url: 'https://doi.org/10.1016/S0065-2601(06)38002-1',
      },
      {
        text: 'Aeon, B., Faber, A. ve Panaccio, A. (2021). Does time management work? A meta-analysis. PLOS ONE, 16(1), e0245066.',
        url: 'https://doi.org/10.1371/journal.pone.0245066',
      },
      {
        text: 'Sirois, F. M. ve Pychyl, T. A. (2013). Procrastination and the priority of short-term mood regulation: Consequences for future self. Social and Personality Psychology Compass, 7(2), 115–127.',
        url: 'https://doi.org/10.1111/spc3.12011',
      },
    ],
  },
};
