import { KAYNAK } from './kaynaklar';
import type { AudienceText, InfoBox, TaskRoadmapTemplate } from './types';

/**
 * Zihinsel görevlerin gelişim yol haritası metinleri.
 *
 * İlkeler (site sahibinin 2026-10-07 seçimi):
 *  - Yol haritası becerinin günlük hayatta nerede kullanıldığını ve o işleri kolaylaştıran yolları anlatır. Puanı
 *    yükseltmeyi ya da "beyni çalıştırmayı" vaat etmez: çalışma belleği alıştırmalarının alıştırılan görevin dışına
 *    aktarıldığına dair güçlü kanıt yoktur (Melby-Lervåg ve Hulme, 2013).
 *  - Görevlerde Türkiye normu yoktur ve tek oturumluk sonuçlar kişiler arasındaki farkları ölçmekte sınırlıdır
 *    (Hedge ve ark., 2018); bu yüzden öneriler sonuca göre değişmez, sonuç "Kısaca" bölümünde raporun kendi kartlarından
 *    özetlenir. Gelişimle ilgili cümleler testin bilim kartındaki kaynaklara dayanır.
 *  - Metinler 3. sınıftan mezunlara kadar herkesin anlayacağı sadelikte yazılır. Tanı koyan dil kullanılmaz; süreğen bir
 *    endişede veliye okulun rehberlik servisi ya da bir uzman önerilir. Görevlerden yalnızca Şekil Akıl Yürütme
 *    yetişkinlere de açıktır; onun metinleri okula özgü değildir, yetişkine öğrenci metni (ya da `adult` metni) gösterilir.
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

const RENK = ['#2f5ce0', '#0e9c8c', '#d28a14', '#7a4ee6'];

/** "Bilmekte yarar var" kutusu: her görevde ortak üç bilgi ve göreve özgü bilgiler. */
function facts(student: string[], parent: string[]): InfoBox {
  return {
    title: 'Bilmekte yarar var',
    intro: t('Bu sonucu yorumlarken şunları akılda tut:', 'Bu sonucu yorumlarken şunları akılda tutun:'),
    items: {
      student: [
        'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
        ...student,
        'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
      ],
      parent: [
        'Sonuç tek bir oturuma dayanır; o günkü uyku, yorgunluk, ilgi ve kullanılan cihaz sonucu etkileyebilir.',
        ...parent,
        'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir ve görevler kişiler arasındaki farkları ölçmekte sınırlıdır; tek bir sonuçla kesin bir yargıya varılmamalıdır.',
        'Dikkat, öğrenme ya da davranışla ilgili süreğen bir endişeniz varsa bu sonuca değil, okulun rehberlik servisine ya da bir uzmana başvurun.',
      ],
    },
    note: t(
      'Bu görevler zekâ puanı vermez; her beceri ayrı anlatılır.',
      'Bu görevler zekâ puanı vermez; her beceri ayrı anlatılır ve hiçbir sonuç tek başına bir tanı ya da yargı için yeterli değildir.',
    ),
  };
}

const studyTitle = { you: 'Günlük hayatta işini ne kolaylaştırır?', parent: 'Günlük hayatta çocuğunuzun işini ne kolaylaştırır?' };

const support = (i: number, key: string, title: string, tag: string, text: AudienceText) => ({ key, title, tag, color: RENK[i], text });

const dikkatBellek: TaskRoadmapTemplate = {
  version: 'dikkat-bellek-yol-haritasi-1',
  what: {
    student: 'dikkat ve bellek gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun dikkat ve bellek gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'dikkat ve bellek gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Çalışma belleği bir bilgiyi kullanana kadar aklında tutup üzerinde işlem yapmanı, seçici dikkat önemli olana odaklanmanı, işlem hızı da basit işleri çabuk yapmanı sağlar. Herkesin çalışma belleğinin bir sınırı vardır; aşağıdaki yollar bu sınırı zorlamadan çalışmanı kolaylaştırır.',
    'Çalışma belleği bir bilgiyi kullanana kadar akılda tutup üzerinde işlem yapmayı, seçici dikkat önemli olana odaklanmayı, işlem hızı da basit işleri çabuk yapmayı sağlar. Herkesin çalışma belleğinin bir sınırı vardır; aşağıdaki yollar bu sınırı zorlamadan çocuğunuzun işini kolaylaştırır.',
  ),
  supports: [
    support(0, 'kagit', 'Aklında değil, kâğıtta tut', 'Araç', t(
      'Bir yönerge ya da ödev birden çok adımlıysa adımları duyar duymaz bir kâğıda madde madde yaz. İşlem yaparken ara sonuçları da kâğıtta tut; aklını yalnızca o anki adıma ayır.',
      'Çocuğunuza çok adımlı işleri sözle değil, kısa bir yazılı listeyle vermeyi deneyin. Ödevde ara sonuçları kâğıda yazmasını önermek, aklını o anki adıma ayırmasını kolaylaştırır.',
    )),
    support(1, 'parca', 'Parça parça ilerle', 'Yöntem', t(
      'Uzun bir bilgiyi küçük gruplara ayırarak hatırlamak daha kolaydır (ör. bir telefon numarasını üçer dörder rakamla söylemek). Uzun bir işi de birkaç küçük adıma böl ve her adımı bitirince işaretle.',
      'Uzun bir bilgiyi küçük gruplara ayırmak (ör. bir telefon numarasını üçer dörder rakamla söylemek) ve uzun işleri küçük adımlara bölmek, çocuğunuzun aynı anda aklında tutması gerekeni azaltır.',
    )),
    support(2, 'ortam', 'Dikkat dağıtıcıları azalt', 'Ortam', t(
      'Çalışırken telefonunu başka bir odaya koy, televizyonu kapat ve masanda yalnızca o işe gereken şeyleri bırak. Dikkatini dağıtan her şey, aklında tutmaya çalıştığın bilgiyle yarışır.',
      'Ödev sırasında telefonu ve televizyonu ortamdan uzaklaştırmak ve masada yalnızca o işe gereken şeyleri bırakmak, çocuğunuzun dikkatini ve belleğini asıl işe ayırmasını kolaylaştırır.',
    )),
    support(3, 'dinlen', 'Dinlenmiş bir zihin', 'Alışkanlık', t(
      'Yorgunken çoğu kişinin dikkati ve belleği zayıflar. Düzenli uyumak, uzun çalışmalara kısa molalar vermek ve zor işleri zihninin en açık olduğu saate koymak işini kolaylaştırır.',
      'Yorgunken çoğu kişinin dikkati ve belleği zayıflar. Düzenli uyku, uzun çalışmalarda kısa molalar ve zor işlerin günün dinç saatlerine konması çocuğunuzun işini kolaylaştırır.',
    )),
  ],
  facts: facts(
    [
      'Çalışma belleği çocukluk ve ergenlik boyunca gelişmeye devam eder; bugünkü sonuç ileride değişebilir.',
      'Bilgisayarda çalışma belleği alıştırması yaptıran programların derslere ve günlük işlere etkisinin olduğuna dair güçlü bir kanıt yoktur. Günlük hayattaki kolaylaştırıcılar daha yararlıdır.',
    ],
    [
      'Çalışma belleği çocukluk ve ergenlik boyunca gelişmeye devam eder; bugünkü sonuç ileride değişebilir.',
      'Çalışma belleğini bilgisayar alıştırmalarıyla geliştirmeyi vaat eden programların, alıştırılan görevin dışındaki işlere (ör. derslere) etkisinin olduğuna dair güçlü bir kanıt yoktur. Günlük hayattaki kolaylaştırıcılar daha yararlıdır.',
    ],
  ),
  approach: [
    { title: 'Kısa yönergeler', text: 'Yönergeleri kısa tutun ve bir seferde bir ya da iki adım verin; gerekirse yazılı hatırlatıcılar kullanın.' },
    { title: 'Suçlamadan', text: 'Unuttuğu bir şey için suçlamak yerine, bir dahaki sefere neyin hatırlatıcı olabileceğini birlikte bulun.' },
    { title: 'Okulla iş birliği', text: 'Gözlemlerinizi öğretmeniyle paylaşın; sınıfta da yazılı yönergeler ve kısa görevler işini kolaylaştırabilir.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta neyi unuttuğunu ya da dikkatinin nerede dağıldığını her akşam bir cümleyle bir deftere yaz (ör. "Ödevin ikinci adımını unuttum.").',
        'Bu hafta çocuğunuzun en çok hangi durumlarda bir şeyi unuttuğunu ya da dikkatinin dağıldığını birlikte gözlemleyin; hemen bir şeyi değiştirmeye çalışmayın.',
      ),
    },
    {
      title: 'Yaz ve işaretle',
      text: t(
        'Bu hafta her sabah o gün yapacağın işleri kısa bir listeye yaz ve bitirdikçe işaretle; akşam neyin işe yaradığına bak.',
        'Bu hafta çocuğunuzla her gün için kısa bir yapılacaklar listesi hazırlayın ve bitirdikçe işaretlemesini isteyin.',
      ),
    },
    {
      title: 'Sade bir çalışma köşesi',
      text: t(
        'Bu hafta her gün en az bir çalışmanı telefon başka odadayken ve masan sadeyken yap; dikkatinde bir fark olup olmadığını yaz.',
        'Bu hafta çocuğunuzla birlikte telefonsuz ve sade bir çalışma köşesi hazırlayın ve her gün en az bir çalışmasını orada yapmasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftada denediklerinden hangisinin işini en çok kolaylaştırdığını yaz ve onu bir alışkanlık hâline getir.',
    'Dört haftanın sonunda hangi düzenlemenin çocuğunuzun işini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['calisma-aliskanliklari', 'surekli-dikkat'],
  nextPurpose: { you: 'çalışma düzenini ve dikkatini uzun süre korumayı da görmek', parent: 'çocuğunuzun çalışma düzenini ve dikkatini uzun süre korumasını da görmek' },
  links: [{ label: 'Etkili ders çalışma yöntemleri', href: '/rehber/etkili-ders-calisma-yontemleri' }],
  sources: [KAYNAK.gathercole, KAYNAK.melby, KAYNAK.hedge],
};

const surekliDikkat: TaskRoadmapTemplate = {
  version: 'surekli-dikkat-yol-haritasi-1',
  what: {
    student: 'uzun ve dikkat isteyen işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun uzun ve dikkat isteyen işlerini nasıl kolaylaştırabileceği',
    summary: 'uzun ve dikkat isteyen işleri kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Dikkati sürdürmek, uzun ya da tekdüze bir işte bile odağını bir süre koruyabilmektir. Çoğu kişinin dikkati zamanla yorulur; önemli olan bunu fark edip işini buna göre düzenleyebilmek.',
    'Dikkati sürdürmek, uzun ya da tekdüze bir işte bile odağı bir süre koruyabilmektir. Çoğu kişinin dikkati zamanla yorulur; önemli olan bunu fark edip işi buna göre düzenleyebilmektir.',
  ),
  supports: [
    support(0, 'bolum', 'Kısa bölümler', 'Yöntem', t(
      'Uzun bir işi 15–20 dakikalık bölümlere ayır ve her bölümün sonunda birkaç dakika kalkıp hareket et. Bir zamanlayıcı kullanmak, ne zaman mola vereceğini düşünmeni gereksiz kılar.',
      'Uzun ödevleri 15–20 dakikalık bölümlere ayırmak ve her bölümün sonunda kısa bir hareket molası vermek çocuğunuzun odağını korumasını kolaylaştırır. Bir zamanlayıcı, molanın ne zaman geleceğini görünür kılar.',
    )),
    support(1, 'kontrol', 'Bitirince kontrol et', 'Alışkanlık', t(
      'Bir işi bitirince baştan sona bir kez gözden geçir: atladığın bir soru, eksik bir harf ya da yanlış bir işaret var mı? Acele ederken gözden kaçan ayrıntılar kontrolle yakalanır.',
      'Çocuğunuzun bitirdiği işi teslim etmeden önce bir kez baştan sona gözden geçirmesini alışkanlık hâline getirmesi, acele ederken gözden kaçan ayrıntıları yakalamasını sağlar.',
    )),
    support(2, 'takip', 'Gözünü yönlendir', 'Araç', t(
      'Okurken ya da bir listeyi tararken satırı kaybediyorsan parmağınla, bir kalemle ya da bir cetvelle takip et. Uzun bir sayfada bölüm bölüm ilerlemek de yerini kaybetmeni önler.',
      'Okurken ya da bir listeyi tararken satırı kaybediyorsa parmağıyla, bir kalemle ya da bir cetvelle takip etmesi ve uzun sayfalarda bölüm bölüm ilerlemesi çocuğunuzun yerini kaybetmesini önler.',
    )),
    support(3, 'ortam', 'Sessiz bir ortam', 'Ortam', t(
      'Dikkatini uzun süre koruman gereken işleri gürültüsüz bir yerde ve telefonun uzaktayken yap. Başlamadan önce gereken her şeyi masana koymak, kalkıp dikkatinin bölünmesini önler.',
      'Uzun süre dikkat isteyen işler için gürültüsüz bir yer ve telefonsuz bir masa çocuğunuzun işini kolaylaştırır. Başlamadan önce gereken her şeyin masada olması, kalkıp dikkatinin bölünmesini önler.',
    )),
  ],
  facts: facts(
    [
      'Dikkati uzun süre koruyabilme çocukluk boyunca gelişir; küçük yaşlarda dikkatin daha çabuk dağılması olağandır.',
      'Uzun bir görevin sonlarına doğru hız ya da doğruluk biraz düşebilir; dikkatin zamanla yorulması çoğu kişide görülür, ama herkeste aynı ölçüde olmayabilir.',
    ],
    [
      'Dikkati uzun süre koruyabilme çocukluk boyunca gelişir; küçük yaşlarda dikkatin daha çabuk dağılması olağandır.',
      'Uzun bir görevin sonlarına doğru hız ya da doğruluk biraz düşebilir; dikkatin zamanla yorulması çoğu kişide görülür, ama herkeste aynı ölçüde olmayabilir.',
    ],
  ),
  approach: [
    { title: 'Molalar', text: 'Uzun ödevleri birlikte bölümlere ayırın ve aralarda kısa molalar verin.' },
    { title: 'Eleştirmeden', text: 'Dikkatinin dağıldığını fark ettiğinizde eleştirmek yerine kısa bir ara önerin.' },
    { title: 'Gerçekçi beklenti', text: 'Yaşına uygun sürelerde odaklanmasını bekleyin; küçük çocukların dikkati daha kısa sürelidir.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta ödev yaparken dikkatinin kaçıncı dakikada dağılmaya başladığını her gün not et.',
        'Bu hafta çocuğunuzun ödev yaparken dikkatinin yaklaşık kaçıncı dakikada dağılmaya başladığını birlikte gözlemleyin.',
      ),
    },
    {
      title: 'Zamanlayıcıyla çalış',
      text: t(
        'Bu hafta ödevlerini bir zamanlayıcıyla 15–20 dakikalık bölümlere ayır; her bölümün sonunda kısa bir mola ver.',
        'Bu hafta çocuğunuzla ödevleri bir zamanlayıcıyla 15–20 dakikalık bölümlere ayırın ve her bölümün sonunda kısa bir mola verin.',
      ),
    },
    {
      title: 'Son kontrol',
      text: t(
        'Bu hafta bitirdiğin her ödevi teslim etmeden önce bir kez baştan sona kontrol et ve yakaladığın hataları say.',
        'Bu hafta çocuğunuzdan bitirdiği her ödevi teslim etmeden önce bir kez kontrol etmesini ve yakaladığı hataları saymasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftada denediklerinden hangisinin dikkatini korumana en çok yardım ettiğini yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi düzenlemenin çocuğunuzun dikkatini korumasına en çok yardım ettiğini birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['dikkat-ve-bellek', 'calisma-aliskanliklari'],
  nextPurpose: { you: 'bellek becerilerini ve çalışma düzenini de görmek', parent: 'çocuğunuzun bellek becerilerini ve çalışma düzenini de görmek' },
  links: [],
  sources: [KAYNAK.betts, KAYNAK.hedge],
};

const renkKelime: TaskRoadmapTemplate = {
  version: 'renk-kelime-yol-haritasi-1',
  what: {
    student: 'aceleyle gelen ilk cevabı durdurmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun aceleyle gelen ilk cevabı durdurmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'aceleyle gelen ilk cevabı durdurmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Bu görev, alışkanlıkla gelen cevabı durdurup doğru cevabı verebilmeyi ölçer: okumak o kadar otomatiktir ki kelimeyi değil rengini söylemek çoğu kişiye zor gelir. Günlük hayatta da aklına ilk gelen cevap her zaman doğru olmayabilir.',
    'Bu görev, alışkanlıkla gelen cevabı durdurup doğru cevabı verebilmeyi ölçer: okumak o kadar otomatiktir ki kelimeyi değil rengini söylemek çoğu kişiye zor gelir. Günlük hayatta da akla ilk gelen cevap her zaman doğru olmayabilir.',
  ),
  supports: [
    support(0, 'dur', 'Önce dur, sonra cevap ver', 'Yöntem', t(
      'Bir soruyu okur okumaz cevaplamak yerine bir an dur ve sorunun tam olarak ne istediğini kendine söyle. "Değildir", "yanlıştır" gibi kelimelerin altını çizmek, alışkanlıkla verilen yanlış cevabı önler.',
      'Çocuğunuzun bir soruyu okur okumaz cevaplamak yerine bir an durup sorunun ne istediğini kendine söylemesi ve "değildir", "yanlıştır" gibi kelimelerin altını çizmesi, alışkanlıkla verilen yanlış cevapları önler.',
    )),
    support(1, 'denge', 'Hız ve doğruluk dengesi', 'Alışkanlık', t(
      'Zor ya da dikkat isteyen işlerde biraz yavaşlamak hata yapmayı azaltabilir; özellikle emin olmadığın yerde bir an durmak işe yarar.',
      'Zor ya da dikkat isteyen işlerde biraz yavaşlamak hatayı azaltabilir; çocuğunuzun özellikle emin olmadığı yerde bir an durmasını destekleyin.',
    )),
    support(2, 'not', 'Görünür hatırlatıcılar', 'Araç', t(
      'Değiştirmek istediğin bir alışkanlık varsa (ör. soruyu sonuna kadar okumadan cevaplamak) masana küçük bir hatırlatma notu koy. Göz önündeki bir hatırlatıcı, otomatik davranışı fark etmeni kolaylaştırır.',
      'Değiştirmek istediği bir alışkanlık için (ör. soruyu sonuna kadar okumadan cevaplamak) masasına küçük bir hatırlatma notu koymak, çocuğunuzun otomatik davranışı fark etmesini kolaylaştırır.',
    )),
    support(3, 'acele', 'Aceleye bırakma', 'Ortam', t(
      'Yorgunken ya da acele ederken alışkanlıkla hareket etmek daha kolay olur. Önemli işleri dinç olduğun saatlere koymak ve son dakikaya bırakmamak işini kolaylaştırır.',
      'Yorgunken ya da acele ederken alışkanlıkla hareket etmek daha kolay olur. Önemli işlerin dinç saatlere konması ve son dakikaya bırakılmaması çocuğunuzun işini kolaylaştırır.',
    )),
  ],
  facts: facts(
    [
      'Kelime ile renk farklıyken yavaşlamak çoğu kişide görülen olağan bir etkidir; büyüklüğü kişiden kişiye değişir ve çocukluk boyunca genellikle yaşla azalır.',
    ],
    [
      'Kelime ile renk farklıyken yavaşlamak çoğu kişide görülen olağan bir etkidir ve büyüklüğü kişiden kişiye değişir; alışkanlıkla gelen cevabı durdurabilme çocukluk boyunca gelişir ve bu etki genellikle yaşla azalır.',
    ],
  ),
  approach: [
    { title: 'Sakin hatırlatma', text: 'Aceleyle hata yaptığında eleştirmek yerine "Bir dur, soruya yeniden bak" gibi kısa ve sakin bir hatırlatma yapın.' },
    { title: 'Örnek olun', text: 'Kendi kararlarınızda da "Bir dakika düşüneyim" diyerek acele etmeden düşünmenin örneğini gösterin.' },
    { title: 'Soru kökü', text: 'Sorulardaki olumsuz ifadelerin altını çizmesini hatırlatın; bu küçük alışkanlık dikkatsizlik hatalarını azaltabilir.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta aceleyle cevap verip sonra "Aslında biliyordum" dediğin anları her akşam bir cümleyle yaz.',
        'Bu hafta çocuğunuzun aceleyle cevap verip sonra doğrusunu bildiğini fark ettiği anları birlikte not edin.',
      ),
    },
    {
      title: 'Altını çiz',
      text: t(
        'Bu hafta çözdüğün her soruda "değildir", "yanlıştır" gibi önemli kelimelerin altını çiz; kaç hatayı önlediğini say.',
        'Bu hafta çocuğunuzdan çözdüğü sorularda önemli kelimelerin altını çizmesini ve kaç hatayı önlediğini saymasını isteyin.',
      ),
    },
    {
      title: 'Bir an dur',
      text: t(
        'Bu hafta bir soruya ya da bir isteğe cevap vermeden önce içinden üçe kadar saymayı dene ve nasıl hissettirdiğini yaz.',
        'Bu hafta çocuğunuzla "cevap vermeden önce üçe kadar say" oyununu birlikte deneyin ve nasıl geçtiğini konuşun.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda acele ettiğin anların azalıp azalmadığına bak ve en çok işe yarayan yolu sürdür.',
    'Dört haftanın sonunda çocuğunuzla acele ettiği anların azalıp azalmadığını konuşun ve en çok işe yarayan yolu sürdürün.',
  ),
  nextTests: ['dur-git-gorevi', 'sirayla-birlestirme-gorevi'],
  nextPurpose: { you: 'kendini durdurma ve iki iş arasında geçiş yapma becerilerini de görmek', parent: 'çocuğunuzun kendini durdurma ve iki iş arasında geçiş yapma becerilerini de görmek' },
  links: [],
  sources: [KAYNAK.comalli, KAYNAK.hedge],
};

const durGit: TaskRoadmapTemplate = {
  version: 'dur-git-yol-haritasi-1',
  what: {
    student: 'kendini durdurman gereken anları nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun kendini durdurması gereken anları nasıl kolaylaştırabileceği',
    summary: 'kendini durdurmayı gerektiren anları kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Bu görev, alışkanlık hâline gelmiş bir tepkiyi son anda durdurabilmeyi ölçer. Günlük hayatta da hızla akan işlerde "dur" demek gerekir: sözü kesmeden sıranı beklemek ya da karşıdan karşıya geçmeden önce durmak gibi.',
    'Bu görev, alışkanlık hâline gelmiş bir tepkiyi son anda durdurabilmeyi ölçer. Günlük hayatta da hızla akan işlerde "dur" demek gerekir: sözü kesmeden sırasını beklemek ya da karşıdan karşıya geçmeden önce durmak gibi.',
  ),
  supports: [
    support(0, 'nokta', 'Durma noktaları koy', 'Yöntem', t(
      'Hızlı yaptığın işlerde önceden durma noktaları belirle: bir sayfayı bitirince, bir soruyu işaretlemeden önce ya da bir mesajı göndermeden önce bir an dur ve kontrol et.',
      'Çocuğunuzla hızlı yaptığı işler için önceden durma noktaları belirleyin: bir sayfayı bitirince, bir soruyu işaretlemeden önce ya da bir mesajı göndermeden önce bir an durup kontrol etmesi gibi.',
    )),
    support(1, 'sira', 'Sıranı beklemek için', 'Alışkanlık', t(
      'Konuşurken söze girmek istediğinde aklındakini unutmamak için kısa bir not al ya da parmağını kaldırarak sıranı bekle; böylece hem fikrini korursun hem karşındakini dinlersin.',
      'Söze girmek istediğinde aklındakini unutmamak için kısa bir not alması ya da parmağını kaldırarak sırasını beklemesi, çocuğunuzun hem fikrini korumasını hem karşısındakini dinlemesini sağlar.',
    )),
    support(2, 'kural', 'Kuralları görünür kıl', 'Araç', t(
      'Uyman gereken kuralları (ör. ödevden önce oyun yok) yazıp görünür bir yere asmak, an gelince hatırlamanı kolaylaştırır.',
      'Evdeki kuralları (ör. ödevden önce oyun yok) birlikte yazıp görünür bir yere asmak, çocuğunuzun an gelince hatırlamasını kolaylaştırır.',
    )),
    support(3, 'hareket', 'Hareket ve dinlenme', 'Ortam', t(
      'Uzun süre oturduktan sonra kısa bir hareket molası vermek ve iyi uyumak, yorgunluğu azaltarak kendini durdurman gereken anlarda işini kolaylaştırır.',
      'Uzun süre oturduktan sonra kısa hareket molaları ve düzenli uyku, yorgunluğu azaltarak çocuğunuzun kendini durdurması gereken anlarda işini kolaylaştırır.',
    )),
  ],
  facts: facts(
    [
      'Bir tepkiyi son anda durdurabilme çocukluk ve ergenlik boyunca gelişir; küçük yaşta daha çok yanlışlıkla basmak olağandır.',
      'Hızlı basmaya alışınca çoğu kişi zaman zaman yanlışlıkla basar; birkaç yanlış basma olağandır.',
    ],
    [
      'Bir tepkiyi son anda durdurabilme çocukluk ve ergenlik boyunca gelişir; küçük yaşta daha çok yanlışlıkla basmak olağandır.',
      'Hızlı basmaya alışınca çoğu kişi zaman zaman yanlışlıkla basar; birkaç yanlış basma olağandır.',
    ],
  ),
  approach: [
    { title: 'Önceden konuşun', text: 'Heyecanlı olacağı durumlardan önce (ör. misafirlik, bir oyun) hangi kurallara uyacağını kısaca birlikte konuşun.' },
    { title: 'Fark edip söyleyin', text: 'Kendini durdurabildiği anları fark edip söyleyin (ör. "Sıranı beklemen çok güzeldi.").' },
    { title: 'Kısa ve sakin', text: 'Kendini durduramadığı anlarda uzun açıklamalar yerine kısa ve sakin bir hatırlatma yapın.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta "Keşke biraz bekleseydim" dediğin anları her akşam bir cümleyle yaz.',
        'Bu hafta çocuğunuzun aceleyle davrandığı ve sonra "Keşke bekleseydim" dediği anları birlikte gözlemleyin.',
      ),
    },
    {
      title: 'Göndermeden önce',
      text: t(
        'Bu hafta bir mesajı göndermeden, bir ödevi teslim etmeden ya da bir soruyu işaretlemeden önce bir kez durup kontrol et.',
        'Bu hafta çocuğunuzdan bir ödevi teslim etmeden ya da bir mesajı göndermeden önce bir kez durup kontrol etmesini isteyin.',
      ),
    },
    {
      title: 'Sıranı bekle',
      text: t(
        'Bu hafta konuşmalarda söze girmek istediğinde fikrini aklında tut ya da kısaca not et, sıran gelince söyle; nasıl geçtiğini yaz.',
        'Bu hafta aile sohbetlerinde herkesin sözünü bitirmesini bekleme kuralını çocuğunuzla birlikte deneyin ve nasıl geçtiğini konuşun.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi durma noktasının sana en çok yardım ettiğini yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi düzenlemenin çocuğunuza en çok yardım ettiğini birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['renk-kelime-gorevi', 'tepki-hizi'],
  nextPurpose: { you: 'alışkanlıkla gelen cevabı durdurmayı ve tepki hızını da görmek', parent: 'çocuğunuzun alışkanlıkla gelen cevabı durdurmasını ve tepki hızını da görmek' },
  links: [],
  sources: [KAYNAK.casey, KAYNAK.hedge],
};

const siraylaBirlestirme: TaskRoadmapTemplate = {
  version: 'sirayla-birlestirme-yol-haritasi-1',
  what: {
    student: 'iki iş arasında gidip gelmeyi gerektiren durumları nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun iki iş arasında gidip gelmeyi gerektiren durumlarını nasıl kolaylaştırabileceği',
    summary: 'iki iş arasında gidip gelmeyi gerektiren durumları kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Bu görev, bir sayfayı gözle tarayıp sırayı takip etmeyi ve iki farklı kural (sayılar ve harfler) arasında geçiş yapabilmeyi ölçer. Günlük hayatta da iki iş arasında gidip gelmek, tek bir işe odaklanmaktan genellikle daha çok zaman alır.',
    'Bu görev, bir sayfayı gözle tarayıp sırayı takip etmeyi ve iki farklı kural (sayılar ve harfler) arasında geçiş yapabilmeyi ölçer. Günlük hayatta da iki iş arasında gidip gelmek, tek bir işe odaklanmaktan genellikle daha çok zaman alır.',
  ),
  supports: [
    support(0, 'tek', 'Bir seferde bir iş', 'Yöntem', t(
      'Mümkün olduğunca bir işi bitirip sonra ötekine geç; ödev yaparken mesajlara bakmak gibi sık geçişler işi uzatır ve hatayı artırır.',
      'Çocuğunuzun mümkün olduğunca bir işi bitirip sonra ötekine geçmesini destekleyin; ödev yaparken mesajlara bakmak gibi sık geçişler işi uzatır ve hatayı artırır.',
    )),
    support(1, 'yerimi', 'Kaldığın yeri işaretle', 'Alışkanlık', t(
      'Bir işi yarıda bırakıp başka bir işe geçeceksen bıraktığın yeri ve sıradaki adımı kısa bir notla yaz; döndüğünde nereden devam edeceğini düşünmek zorunda kalmazsın.',
      'Bir işi yarıda bırakıp başka bir işe geçecekse bıraktığı yeri ve sıradaki adımı kısa bir notla yazması, çocuğunuzun döndüğünde kolayca devam etmesini sağlar.',
    )),
    support(2, 'defter', 'Düzenli bir sayfa', 'Araç', t(
      'Defterini ve çözüm sayfalarını düzenli tut: işlemleri sırayla ve aralıklı yaz. Aradığını kolay bulmak, gözünün taramasını hızlandırır.',
      'Çocuğunuzun defterini ve çözüm sayfalarını düzenli tutması (işlemleri sırayla ve aralıklı yazmak) aradığını kolay bulmasını sağlar.',
    )),
    support(3, 'masa', 'Sade bir masa', 'Ortam', t(
      'Masanda yalnızca o işe gereken şeyleri bırak; gözünün taraması gereken şey azaldıkça aradığını daha çabuk bulursun.',
      'Masada yalnızca o işe gereken şeylerin bulunması, çocuğunuzun aradığını daha çabuk bulmasını ve işine odaklanmasını kolaylaştırır.',
    )),
  ],
  facts: facts(
    [
      'İki kural arasında geçiş yapmak çoğu kişide tek kurala göre daha uzun sürer; ikinci bölümün daha uzun sürmesi olağandır, ama aradaki fark herkeste aynı olmayabilir.',
      'Bu görevde parmağın ya da farenin hızı da süreyi etkiler; telefonda ve bilgisayarda sonuçlar farklı olabilir.',
    ],
    [
      'İki kural arasında geçiş yapmak çoğu kişide tek kurala göre daha uzun sürer; ikinci bölümün daha uzun sürmesi olağandır, ama aradaki fark herkeste aynı olmayabilir.',
      'Bu görevde parmağın ya da farenin hızı da süreyi etkiler; telefonda ve bilgisayarda sonuçlar farklı olabilir.',
    ],
  ),
  approach: [
    { title: 'Tek iş', text: 'Ödev sırasında telefon ve televizyon gibi sık geçişe yol açan şeyleri ortamdan uzaklaştırın.' },
    { title: 'Geçişten önce haber', text: 'Bir işten ötekine geçmesi gerektiğinde birkaç dakika önceden haber verin; ani geçişler çoğu kişiye zor gelir.' },
    { title: 'Düzen', text: 'Defter ve masa düzenini birlikte kurun; neyin nerede olduğunu bilmek zaman kazandırır.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta ödev yaparken başka bir şeye (telefon, sohbet) kaç kez geçtiğini bir kâğıda çentik atarak say.',
        'Bu hafta çocuğunuzla ödev sırasında başka bir şeye kaç kez geçtiğini birlikte sayın; hemen bir şeyi değiştirmeye çalışmayın.',
      ),
    },
    {
      title: 'Tek iş saati',
      text: t(
        'Bu hafta her gün en az bir çalışmanı başka hiçbir şeye geçmeden, baştan sona tek iş olarak yap.',
        'Bu hafta çocuğunuzla her gün en az bir çalışmanın başka hiçbir şeye geçmeden yapıldığı bir "tek iş saati" belirleyin.',
      ),
    },
    {
      title: 'Yer imi',
      text: t(
        'Bu hafta bir işi yarıda bırakman gerektiğinde nerede kaldığını ve sıradaki adımı kısa bir notla yaz.',
        'Bu hafta çocuğunuzdan bir işi yarıda bırakması gerektiğinde nerede kaldığını ve sıradaki adımı kısa bir notla yazmasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda geçişlerin azalıp azalmadığına bak ve işine en çok yarayan düzeni sürdür.',
    'Dört haftanın sonunda çocuğunuzla geçişlerin azalıp azalmadığını konuşun ve en çok işe yarayan düzeni sürdürün.',
  ),
  nextTests: ['renk-kelime-gorevi', 'dikkat-ve-bellek'],
  nextPurpose: { you: 'alışkanlıkla gelen cevabı durdurmayı ve çalışma belleğini de görmek', parent: 'çocuğunuzun alışkanlıkla gelen cevabı durdurmasını ve çalışma belleğini de görmek' },
  links: [],
  sources: [KAYNAK.arbuthnott, KAYNAK.hedge],
};

const geriyeDonuk: TaskRoadmapTemplate = {
  version: 'geriye-donuk-hatirlama-yol-haritasi-1',
  what: {
    student: 'sürekli değişen bilgiyi takip etmeyi nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun sürekli değişen bilgiyi takip etmesini nasıl kolaylaştırabileceği',
    summary: 'sürekli değişen bilgiyi takip etmeyi kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Bu görev, sürekli değişen bilgiyi aklında güncelleyebilmeyi ölçer: her yeni harfte bir ya da iki önceki harfi hatırlaman gerekir. Günlük hayatta da bir sohbeti takip ederken ya da zihinden hesap yaparken aklındaki bilgiyi sürekli yenilersin.',
    'Bu görev, sürekli değişen bilgiyi akılda güncelleyebilmeyi ölçer: her yeni harfte bir ya da iki önceki harfi hatırlamak gerekir. Günlük hayatta da bir sohbeti takip ederken ya da zihinden hesap yaparken akıldaki bilgi sürekli yenilenir.',
  ),
  supports: [
    support(0, 'yaz', 'Aklın yerine kâğıt', 'Araç', t(
      'Takip etmen gereken bilgiler arttığında (ör. bir problemin verileri, bir oyunun skoru) onları yazarak ilerle; aklını güncellemeye değil, düşünmeye ayır.',
      'Takip etmesi gereken bilgiler arttığında (ör. bir problemin verileri) onları yazarak ilerlemesi, çocuğunuzun aklını güncellemeye değil, düşünmeye ayırmasını sağlar.',
    )),
    support(1, 'tekrar', 'Kendi cümlenle tekrar et', 'Yöntem', t(
      'Bir yönergeyi ya da açıklamayı dinledikten sonra onu kendi cümlelerinle kısaca tekrar et; böylece eksik kalan bir yer varsa hemen fark edersin.',
      'Bir yönergeyi ya da açıklamayı dinledikten sonra kendi cümleleriyle kısaca tekrar etmesi, çocuğunuzun eksik kalan bir yeri hemen fark etmesini sağlar.',
    )),
    support(2, 'isaret', 'Boşlukları işaretle', 'Alışkanlık', t(
      'Bilgi hızla gelirken (ör. hızlı bir anlatım) her şeyi yazamıyorsan kaçırdığın yere küçük bir işaret koy ve fırsat bulunca sor.',
      'Hızlı bir anlatımda her şeyi yazamıyorsa kaçırdığı yere küçük bir işaret koyması ve fırsat bulunca sorması çocuğunuzun işini kolaylaştırır.',
    )),
    support(3, 'tek', 'Tek bilgi kaynağı', 'Ortam', t(
      'Bir şeyi dinlerken ya da okurken aynı anda başka bir şey izleme ya da dinleme; iki bilgi akışı aynı anda zihnini doldurur.',
      'Dinlerken ya da okurken aynı anda başka bir şey izlememesi ya da dinlememesi, çocuğunuzun zihnini tek bir bilgi akışına ayırmasını sağlar.',
    )),
  ],
  facts: facts(
    [
      'Çalışma belleği çocukluk ve ergenlik boyunca gelişir; iki geride bir geriye göre daha çok zorlanmak çoğu kişide görülür, ama herkeste aynı olmayabilir.',
      'Bu görev, çalışma belleğini ölçen başka görevlerle yalnızca kısmen örtüşür; tek bir görev bu beceriyi bütünüyle göstermez.',
      'Bilgisayarda bu tür alıştırmaları yapmak, alıştırılan görevde puanı yükseltebilir; ama bunun derslere ve günlük işlere yansıdığına dair güçlü bir kanıt yoktur.',
    ],
    [
      'Çalışma belleği çocukluk ve ergenlik boyunca gelişir; iki geride bir geriye göre daha çok zorlanmak çoğu kişide görülür, ama herkeste aynı olmayabilir.',
      'Bu görev, çalışma belleğini ölçen başka görevlerle yalnızca kısmen örtüşür; tek bir görev bu beceriyi bütünüyle göstermez.',
      'Bilgisayarda çalışma belleği alıştırmaları yapmak, alıştırılan görevde puanı yükseltebilir; ama bunun derslere ve günlük işlere yansıdığına dair güçlü bir kanıt yoktur.',
    ],
  ),
  approach: [
    { title: 'Bir seferde bir bilgi', text: 'Bilgiyi ve yönergeleri parça parça verin; birini bitirince ötekine geçin.' },
    { title: 'Birlikte kontrol', text: 'Önemli bir yönergeden sonra kendi cümleleriyle tekrar etmesini isteyin; bunu bir sınav gibi değil, birlikte kontrol gibi yapın.' },
    { title: 'Yazılı özet', text: 'Uzun anlatımlardan sonra kısa bir yazılı özet ya da liste sağlamak işini kolaylaştırır.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta bir sohbeti ya da anlatımı takip ederken nerede koptuğunu fark ettiğin anları yaz.',
        'Bu hafta çocuğunuzun uzun bir anlatımı ya da yönergeyi takip ederken nerede koptuğunu birlikte gözlemleyin.',
      ),
    },
    {
      title: 'Kendi cümlenle',
      text: t(
        'Bu hafta her gün dinlediğin bir yönergeyi ya da açıklamayı kendi cümlelerinle birine tekrar et.',
        'Bu hafta çocuğunuzdan her gün dinlediği bir yönergeyi ya da açıklamayı size kendi cümleleriyle anlatmasını isteyin.',
      ),
    },
    {
      title: 'Not alarak dinle',
      text: t(
        'Bu hafta bir anlatımı ya da eğitici bir videoyu kısa notlar alarak dinle, sonra notlarından bir özet çıkar.',
        'Bu hafta çocuğunuzla birlikte eğitici bir video izleyin; kısa notlar almasını ve sonra notlarından size özet çıkarmasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun bilgiyi takip etmeni en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun bilgiyi takip etmesini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['dikkat-ve-bellek', 'calisma-aliskanliklari'],
  nextPurpose: { you: 'öteki bellek ve dikkat becerilerini ve çalışma düzenini de görmek', parent: 'çocuğunuzun öteki bellek ve dikkat becerilerini ve çalışma düzenini de görmek' },
  links: [],
  sources: [KAYNAK.gathercole, KAYNAK.redick, KAYNAK.melby, KAYNAK.hedge],
};

const zihindeDondurme: TaskRoadmapTemplate = {
  version: 'zihinde-dondurme-yol-haritasi-1',
  what: {
    student: 'şekillerle ve yönlerle uğraşmayı nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun şekillerle ve yönlerle uğraşmasını nasıl kolaylaştırabileceği',
    summary: 'şekillerle ve yönlerle uğraşmayı kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Bu görev, şekilleri zihninde döndürüp karşılaştırabilmeyi ölçer. Bu beceri harita okumak, bir eşyanın yerleşimini planlamak, geometri ve çizim gibi işlerde kullanılır. Şekil ne kadar çok döndürülmüşse karar vermek çoğu kişide o kadar uzun sürer; bu fark herkeste aynı ölçüde görülmeyebilir.',
    'Bu görev, şekilleri zihinde döndürüp karşılaştırabilmeyi ölçer. Bu beceri harita okumak, bir eşyanın yerleşimini planlamak, geometri ve çizim gibi işlerde kullanılır. Şekil ne kadar çok döndürülmüşse karar vermek çoğu kişide o kadar uzun sürer; bu fark herkeste aynı ölçüde görülmeyebilir.',
  ),
  supports: [
    support(0, 'ciz', 'Çizerek düşün', 'Araç', t(
      'Zihninde canlandırması zor bir şekli ya da yolu kâğıda çiz. Geometri sorularında şekli farklı açılardan yeniden çizmek işini kolaylaştırır.',
      'Zihinde canlandırması zor bir şekli ya da yolu kâğıda çizmesi, geometri sorularında şekli farklı açılardan yeniden çizmesi çocuğunuzun işini kolaylaştırır.',
    )),
    support(1, 'nesne', 'Elinle döndür', 'Yöntem', t(
      'Mümkünse nesneyi elinle döndürerek incele: bir küp, bir kutu ya da kâğıttan bir şekil, zihnindeki dönüşü somutlaştırır.',
      'Mümkünse nesneyi eliyle döndürerek incelemesi (bir küp, bir kutu ya da kâğıttan bir şekil) çocuğunuzun zihnindeki dönüşü somutlaştırır.',
    )),
    support(2, 'harita', 'Yer işaretleriyle yön bul', 'Alışkanlık', t(
      'Bir yere giderken haritayı gideceğin yöne çevirerek oku ve yol üzerindeki belirgin yerleri (bir park, bir cami, bir okul) aklına not et. Yönleri yer işaretleriyle hatırlamak sağ ve soldan daha kolaydır.',
      'Yolculuklarda haritayı gidilen yöne çevirerek okumak ve yol üzerindeki belirgin yerleri birlikte not etmek, çocuğunuzun yön bulmasını kolaylaştırır.',
    )),
    support(3, 'oyun', 'Şekil oyunları', 'Etkinlik', t(
      'Yapboz, yapı blokları, origami ve şekil yerleştirme oyunları şekillerle düşünmeyi keyifli hâle getirir.',
      'Yapboz, yapı blokları, origami ve şekil yerleştirme oyunları çocuğunuz için şekillerle düşünmeyi keyifli hâle getirir.',
    )),
  ],
  facts: facts(
    [
      'Şekilleri zihinde döndürebilme yaşla gelişir; küçük yaşta daha uzun düşünmek olağandır.',
      'Çok döndürülmüş şekillerde daha uzun düşünmek çoğu kişide görülen olağan bir etkidir; herkeste aynı ölçüde olmayabilir.',
    ],
    [
      'Şekilleri zihinde döndürebilme yaşla gelişir; küçük yaşta daha uzun düşünmek olağandır.',
      'Çok döndürülmüş şekillerde daha uzun düşünmek çoğu kişide görülen olağan bir etkidir; herkeste aynı ölçüde olmayabilir.',
    ],
  ),
  approach: [
    { title: 'Somut malzeme', text: 'Yapı blokları, yapboz ve kutu gibi malzemelerle şekillerle uğraşmasına fırsat verin.' },
    { title: 'Yön tarifleri', text: 'Yolculuklarda yön tarifini ona bırakın ve haritayı birlikte okuyun.' },
    { title: 'Çizerek çözme', text: 'Zorlandığı geometri sorularında şekli kâğıda çizmesini ya da kâğıttan kesip katlamasını önerin.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta şekillerle ya da yönlerle uğraştığın anları (harita, geometri, eşya yerleştirme) ve sana kolay ya da zor gelenleri yaz.',
        'Bu hafta çocuğunuzun şekillerle ya da yönlerle uğraştığı anları ve ona kolay ya da zor gelenleri birlikte gözlemleyin.',
      ),
    },
    {
      title: 'Çiz ve döndür',
      text: t(
        'Bu hafta bir geometri sorusunda ya da bir çizimde şekli kâğıda farklı açılardan yeniden çiz.',
        'Bu hafta çocuğunuzla kâğıttan basit bir şekil kesin ve onu döndürerek farklı açılardan nasıl göründüğünü birlikte çizin.',
      ),
    },
    {
      title: 'Yolu sen tarif et',
      text: t(
        'Bu hafta bildiğin bir yere nasıl gidileceğini yer işaretleriyle birine tarif et ya da kâğıda kroki olarak çiz.',
        'Bu hafta çocuğunuzdan bildiği bir yere nasıl gidileceğini yer işaretleriyle size tarif etmesini ya da bir kroki çizmesini isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun şekillerle uğraşmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun şekillerle uğraşmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['matematik-konu-tarama-testi', 'dikkat-ve-bellek'],
  nextPurpose: { you: 'matematik konularındaki durumunu ve bellek becerilerini de görmek', parent: 'çocuğunuzun matematik konularındaki durumunu ve bellek becerilerini de görmek' },
  links: [],
  sources: [KAYNAK.shepard, KAYNAK.frick, KAYNAK.hedge],
};

const tepkiHizi: TaskRoadmapTemplate = {
  version: 'tepki-hizi-yol-haritasi-1',
  what: {
    student: 'hızlı karar vermeyi gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun hızlı karar vermeyi gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'hızlı karar vermeyi gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle,
  studyIntro: t(
    'Bu görev, bir şeyi görür görmez ne kadar çabuk tepki verebildiğini ve iki seçenekten doğrusunu ne kadar hızlı seçebildiğini ölçer. Seçenek arttıkça karar vermek çoğu kişide biraz daha uzun sürer.',
    'Bu görev, bir şeyi görür görmez ne kadar çabuk tepki verilebildiğini ve iki seçenekten doğrusunun ne kadar hızlı seçilebildiğini ölçer. Seçenek arttıkça karar vermek çoğu kişide biraz daha uzun sürer.',
  ),
  supports: [
    support(0, 'dogru', 'Önce doğruluk', 'Yöntem', t(
      'Sınavda ve ödevde hızdan önce doğruluğa odaklan; doğru yapmaya alıştığın işler çoğu zaman kendiliğinden hızlanır.',
      'Çocuğunuzun sınavda ve ödevde hızdan önce doğruluğa odaklanmasını destekleyin; doğru yapmaya alıştığı işler çoğu zaman kendiliğinden hızlanır.',
    )),
    support(1, 'secenek', 'Seçenekleri azalt', 'Araç', t(
      'Karar vermen gereken seçenekleri azaltmak işini hızlandırır: ödevden önce gerekenleri masaya hazırlamak ya da ertesi günün kıyafetini bir gece önceden seçmek gibi.',
      'Karar verilmesi gereken seçenekleri azaltmak işleri hızlandırır: çocuğunuzla ödevden önce gerekenleri masaya hazırlamak ya da ertesi günün kıyafetini bir gece önceden seçmek gibi.',
    )),
    support(2, 'dinc', 'Dinç olmak', 'Alışkanlık', t(
      'Yorgunken çoğu kişi daha yavaş tepki verir. Düzenli uyku ve uzun çalışmalarda kısa molalar işini kolaylaştırır.',
      'Yorgunken çoğu kişi daha yavaş tepki verir. Düzenli uyku ve uzun çalışmalarda kısa molalar çocuğunuzun işini kolaylaştırır.',
    )),
    support(3, 'guvenlik', 'Dikkat dağıtıcılardan uzak', 'Ortam', t(
      'Hızlı tepki gereken işlerde (ör. bisiklet sürerken ya da karşıdan karşıya geçerken) telefon ve kulaklık gibi dikkatini dağıtan şeyleri bırak.',
      'Hızlı tepki gereken işlerde (ör. bisiklet sürerken ya da karşıdan karşıya geçerken) telefon ve kulaklık gibi dikkat dağıtıcıları bırakmanın önemini çocuğunuzla konuşun.',
    )),
  ],
  facts: facts(
    [
      'Tepki hızı çocukluk ve ergenlik boyunca belirgin biçimde artar.',
      'Tepki hızı, düşünme becerilerinin yalnızca bir parçasıdır; tek başına zekâ ya da başarı hakkında bilgi vermez.',
    ],
    [
      'Tepki hızı çocukluk ve ergenlik boyunca belirgin biçimde artar.',
      'Tepki hızı, düşünme becerilerinin yalnızca bir parçasıdır; tek başına zekâ ya da başarı hakkında bilgi vermez.',
    ],
  ),
  approach: [
    { title: 'Acele ettirmeyin', text: 'Hızlı olmasını istemek yerine doğru yapmasını övün; bir işe alıştıkça hız da çoğu zaman kendiliğinden gelir.' },
    { title: 'Güvenlik', text: 'Trafikte ve sporda dikkat dağıtıcıları (telefon, kulaklık) bırakmanın önemini konuşun.' },
    { title: 'Küçük hazırlıklar', text: 'Sabahları ve ödevden önce seçimleri azaltan küçük hazırlıkları (çanta, kıyafet) birlikte alışkanlık hâline getirin.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta acele ettiğin için hata yaptığın anları ve sakin kaldığında daha iyi giden işleri yaz.',
        'Bu hafta çocuğunuzun acele ettiği için hata yaptığı ve sakin kaldığında daha iyi giden işleri birlikte gözlemleyin.',
      ),
    },
    {
      title: 'Önceden hazırla',
      text: t(
        'Bu hafta her akşam ertesi günün çantasını ve kıyafetini hazırla; sabahların nasıl geçtiğini yaz.',
        'Bu hafta çocuğunuzla her akşam ertesi günün çantasını ve kıyafetini birlikte hazırlayın; sabahların nasıl geçtiğini konuşun.',
      ),
    },
    {
      title: 'Doğruluk önce',
      text: t(
        'Bu hafta ödevlerde önce doğru yapmaya odaklan: her soruyu bitirince kısa bir kontrol yap ve kaç hatayı yakaladığını say.',
        'Bu hafta çocuğunuzdan ödevlerde her soruyu bitirince kısa bir kontrol yapmasını ve kaç hatayı yakaladığını saymasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi düzenlemenin günlerini en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi düzenlemenin çocuğunuzun günlerini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['dur-git-gorevi', 'dikkat-ve-bellek'],
  nextPurpose: { you: 'kendini durdurmayı ve dikkatini de görmek', parent: 'çocuğunuzun kendini durdurmasını ve dikkatini de görmek' },
  links: [],
  sources: [KAYNAK.hick, KAYNAK.kail, KAYNAK.hedge],
};

const sekilBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca şekillerle yapılan yönünü gösterir.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; küçük yaşta üst düzeylerdeki sorularda zorlanmak olağandır.',
    'Bu tür bulmacalara alışkın olmak ve okul deneyimi sonucu etkileyebilir.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca şekillerle yapılan yönünü gösterir.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; küçük yaşta üst düzeylerdeki sorularda zorlanmak olağandır.',
    'Bu tür bulmacalara alışkın olmak ve okul deneyimi sonucu etkileyebilir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine eğitim ve alışkanlıkla ilgili bilgi. */
const sekilFacts: InfoBox = {
  ...sekilBase,
  items: {
    ...sekilBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca şekillerle yapılan yönünü gösterir.',
      'Bu tür bulmacalara alışkın olmak ve eğitim deneyimi sonucu etkileyebilir.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const sekilAkilYurutme: TaskRoadmapTemplate = {
  version: 'sekil-akil-yurutme-yol-haritasi-1',
  what: {
    student: 'kuralları bulmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun kuralları bulmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'kuralları bulmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Kuralları bulmayı ne kolaylaştırır?', parent: 'Çocuğunuzun kuralları bulmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, şekillerdeki kuralı bulup yeni bir duruma uygulayabilmeyi ölçer. Bu beceri; bir örüntüyü fark etmek, bir problemi adımlara ayırmak ve yeni karşılaşılan bir durumda ne yapılacağını kestirmek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım eder.',
    'Bu test, şekillerdeki kuralı bulup yeni bir duruma uygulayabilmeyi ölçer. Bu beceri; bir örüntüyü fark etmek, bir problemi adımlara ayırmak ve yeni karşılaşılan bir durumda ne yapılacağını kestirmek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım eder.',
  ),
  supports: [
    support(0, 'ozellik', 'Özellikleri tek tek izle', 'Yöntem', t(
      'Karmaşık bir soruda her şeye birden bakmak yerine özellikleri tek tek izle: önce şekle, sonra sayıya, sonra renge ve yöne bak. Her özelliğin kuralını ayrı ayrı bul; birden çok kuralı akılda tutmak böyle kolaylaşır.',
      'Karmaşık bir soruda her şeye birden bakmak yerine özellikleri tek tek izlemesini önerin: önce şekle, sonra sayıya, sonra renge ve yöne. Her özelliğin kuralını ayrı ayrı bulmak, çocuğunuzun birden çok kuralı karıştırmadan akılda tutmasını kolaylaştırır.',
    )),
    support(1, 'kur', 'Cevabı önce kendin kur', 'Yöntem', t(
      'Seçeneklere bakmadan önce eksik parçanın nasıl olması gerektiğini zihninde kur; sonra seçeneklerde onu ara. Araştırmalar, cevabı önce zihinde kurmanın seçenekleri tek tek karşılaştırmaktan daha iyi sonuç verdiğini düşündürür.',
      'Çocuğunuza seçeneklere bakmadan önce eksik parçanın nasıl olması gerektiğini zihninde kurmasını, sonra seçeneklerde onu aramasını önerin. Araştırmalar, cevabı önce zihinde kurmanın seçenekleri tek tek karşılaştırmaktan daha iyi sonuç verdiğini düşündürür.',
    )),
    support(2, 'soyle', 'Kuralı söyle ya da yaz', 'Alışkanlık', t(
      'Bir örüntünün kuralını bulduğunda onu kısa bir cümleyle söyle ya da yaz: “Her adımda bir artıyor.” Kuralı sözcüklerle söylemek, onu akılda tutmanı ve doğru olup olmadığını kontrol etmeni kolaylaştırabilir.',
      'Çocuğunuz bir örüntünün kuralını bulduğunda onu kısa bir cümleyle söylemesini isteyin: “Her adımda bir artıyor.” Kuralı sözcüklerle söylemek, onu akılda tutmasını ve doğru olup olmadığını kontrol etmesini kolaylaştırabilir.',
    )),
    support(3, 'oyun', 'Kurallı oyunlar', 'Etkinlik', t(
      'Sudoku, tangram, satranç ve örüntü tamamlama gibi kurallı oyunlar, kural aramayı keyifli bir uğraş hâline getirir. Bu oyunlarda ustalaşmak her işe kendiliğinden yansımayabilir; asıl kazanç, düşünmekten keyif almaktır.',
      'Sudoku, tangram, satranç ve örüntü tamamlama gibi kurallı oyunlar, çocuğunuz için kural aramayı keyifli bir uğraş hâline getirir. Bu oyunlarda ustalaşmak her işe kendiliğinden yansımayabilir; asıl kazanç, düşünmekten keyif almaktır.',
    )),
  ],
  facts: sekilFacts,
  approach: [
    { title: 'Acele ettirmeyin', text: 'Zor bir soruda uzun düşünmesine izin verin; hızlı olmasından çok, kuralı kendisinin bulmasını övün.' },
    { title: 'Birlikte kural arayın', text: 'Günlük hayattaki örüntüleri (takvim, döşeme desenleri, bir şarkıdaki tekrarlar) birlikte fark edin ve kuralını sözcüklerle söyleyin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Fark et',
      text: t(
        'Bu hafta karşına çıkan üç örüntüyü (bir döşeme deseni, bir sayı dizisi, bir şarkıdaki tekrar) not et ve her birinin kuralını tek cümleyle yaz.',
        'Bu hafta çocuğunuzla çevrenizdeki üç örüntüyü (bir döşeme deseni, bir sayı dizisi, bir şarkıdaki tekrar) birlikte bulun ve her birinin kuralını tek cümleyle söyleyin.',
      ),
    },
    {
      title: 'Önce kur, sonra seç',
      text: t(
        'Bu hafta bir bulmaca ya da soru çözerken, seçeneklere bakmadan önce cevabın nasıl olması gerektiğini kısaca yaz; sonra seçeneklerle karşılaştır.',
        'Bu hafta çocuğunuzdan bir bulmaca ya da soru çözerken, seçeneklere bakmadan önce cevabın nasıl olması gerektiğini söylemesini isteyin; sonra seçeneklerle birlikte karşılaştırın.',
      ),
    },
    {
      title: 'Kendi bulmacanı yap',
      text: t(
        'Bu hafta kâğıda 3 satır ve 3 sütunluk kendi şekil bulmacanı çiz: bir ya da iki kural seç, son parçayı boş bırak ve birine çözdür.',
        'Bu hafta çocuğunuzdan kâğıda 3 satır ve 3 sütunluk kendi şekil bulmacasını çizmesini, son parçayı boş bırakıp size çözdürmesini isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun kuralları bulmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun kuralları bulmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['zihinde-dondurme', 'dikkat-ve-bellek'],
  nextPurpose: {
    you: 'şekilleri zihinde döndürmeyi ve bellek becerilerini de görmek',
    parent: 'çocuğunuzun şekilleri zihinde döndürmesini ve bellek becerilerini de görmek',
  },
  links: [],
  sources: [KAYNAK.carpenter, KAYNAK.laurence, KAYNAK.ferrer],
};

/** Zihinsel görevlerin yol haritaları: becerinin günlük hayatta kullanıldığı işleri kolaylaştıran yollar (lib/reports/task-roadmap.ts). */
export const TASK_ROADMAPS: Record<string, TaskRoadmapTemplate> = {
  'dikkat-ve-bellek': dikkatBellek,
  'surekli-dikkat': surekliDikkat,
  'renk-kelime-gorevi': renkKelime,
  'dur-git-gorevi': durGit,
  'sirayla-birlestirme-gorevi': siraylaBirlestirme,
  'geriye-donuk-hatirlama': geriyeDonuk,
  'zihinde-dondurme': zihindeDondurme,
  'tepki-hizi': tepkiHizi,
  'sekil-akil-yurutme': sekilAkilYurutme,
};
