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
 *    endişede veliye okulun rehberlik servisi ya da bir uzman önerilir. Görevlerden yalnızca Şekil Akıl Yürütme, Sayı
 *    Dizileri, Sözel Akıl Yürütme, Kâğıt Katlama, Kelime Bilgisi, Kural Değiştirme, Kelime Listesi Hatırlama, Mantıksal Akıl Yürütme, Sayısal Akıl Yürütme, Küp Açınımı, Üç Boyutlu Zihinde Döndürme, Düşünerek Karar Verme, Kule Görevi, Hesapla ve Hatırla, Bakış Açısı Alma, Gizli Şekiller, Desen Hatırlama ve Harf Dizileri yetişkinlere de açıktır; onların metinleri okula özgü değildir, yetişkine
 *    öğrenci metni (ya da `adult` metni) gösterilir.
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
    'Bu görev, alışkanlıkla gelen cevabı durdurup doğru cevabı verebilmeyi ölçer: okumak o kadar otomatiktir ki kelimeye değil yazının rengine bakmak çoğu kişiye zor gelir. Günlük hayatta da aklına ilk gelen cevap her zaman doğru olmayabilir.',
    'Bu görev, alışkanlıkla gelen cevabı durdurup doğru cevabı verebilmeyi ölçer: okumak o kadar otomatiktir ki kelimeye değil yazının rengine bakmak çoğu kişiye zor gelir. Günlük hayatta da akla ilk gelen cevap her zaman doğru olmayabilir.',
  ),
  supports: [
    support(0, 'dur', 'Önce dur, sonra cevap ver', 'Yöntem', t(
      'Bir soruyu okur okumaz cevaplamak yerine bir an dur ve sorunun tam olarak ne istediğini kendine söyle. "Değildir", "yanlıştır" gibi kelimelerin altını çizmek, alışkanlıkla verilen yanlış cevapları azaltabilir.',
      'Çocuğunuzun bir soruyu okur okumaz cevaplamak yerine bir an durup sorunun ne istediğini kendine söylemesi ve "değildir", "yanlıştır" gibi kelimelerin altını çizmesi, alışkanlıkla verilen yanlış cevapları azaltabilir.',
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
    parent: 'çocuğunuz için iki iş arasında gidip gelmeyi gerektiren durumların nasıl kolaylaştırılabileceği',
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
    'Bu görev, şekilleri zihninde döndürüp karşılaştırabilmeyi ölçer. Bu beceri harita okumak, bir eşyanın yerleşimini planlamak, geometri ve çizim gibi işlerde kullanılır.',
    'Bu görev, şekilleri zihinde döndürüp karşılaştırabilmeyi ölçer. Bu beceri harita okumak, bir eşyanın yerleşimini planlamak, geometri ve çizim gibi işlerde kullanılır.',
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
      'Bir yere giderken haritayı gideceğin yöne çevirerek oku ve yol üzerindeki belirgin yerleri (bir park, bir cami, bir okul) aklına not et. Yönleri yer işaretleriyle hatırlamak, yalnızca “sağ” ve “sol” ile hatırlamaktan sana daha kolay gelebilir.',
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
      'Seçeneklere bakmadan önce eksik parçanın nasıl olması gerektiğini zihninde kur; sonra seçeneklerde onu ara. Bir araştırmada, cevabı önce zihinde kurup seçenekler arasında daha az gidip gelenlerin daha çok soruyu doğru cevapladığı görülmüştür.',
      'Çocuğunuza seçeneklere bakmadan önce eksik parçanın nasıl olması gerektiğini zihninde kurmasını, sonra seçeneklerde onu aramasını önerin. Bir araştırmada, cevabı önce zihinde kurup seçenekler arasında daha az gidip gelenlerin daha çok soruyu doğru cevapladığı görülmüştür.',
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

const sayiBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca sayılarla yapılan yönünü gösterir.',
    'Sayı dizilerinde sayı bilgisi ve hesap rahatlığı da rol oynar; henüz rahatça yapamadığın işlemlerin gerektiği sorularda zorlanmak olağandır.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; küçük yaşta üst düzeylerdeki sorularda zorlanmak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca sayılarla yapılan yönünü gösterir.',
    'Sayı dizilerinde sayı bilgisi ve hesap rahatlığı da rol oynar; çocuğunuzun henüz rahatça yapamadığı işlemlerin gerektiği sorularda zorlanması olağandır.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine alışkanlıkla ilgili bilgi. */
const sayiFacts: InfoBox = {
  ...sayiBase,
  items: {
    ...sayiBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca sayılarla yapılan yönünü gösterir.',
      'Sayı dizilerinde sayı bilgisi, hesap rahatlığı ve bu tür sorulara alışkın olmak da rol oynar.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const sayiDizileri: TaskRoadmapTemplate = {
  version: 'sayi-dizileri-yol-haritasi-1',
  what: {
    student: 'sayılarla kural bulmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun sayılarla kural bulmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'sayılarla kural bulmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Sayılarla kural bulmayı ne kolaylaştırır?', parent: 'Çocuğunuzun sayılarla kural bulmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, sayı dizilerindeki kuralı bulup sürdürebilmeyi ölçer. Bu beceri; bir sayı örüntüsünü fark etmek, bir tablodaki ya da grafikteki değişimi yorumlamak ve bir problemi adımlara ayırmak gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım eder.',
    'Bu test, sayı dizilerindeki kuralı bulup sürdürebilmeyi ölçer. Bu beceri; bir sayı örüntüsünü fark etmek, bir tablodaki ya da grafikteki değişimi yorumlamak ve bir problemi adımlara ayırmak gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım eder.',
  ),
  supports: [
    support(0, 'fark', 'Farkları yaz', 'Yöntem', t(
      'Bir sayı dizisinde kuralı ararken ardışık sayıların arasına farkı ya da işlemi yaz: “+3”, “×2” gibi. Farklar da bir düzen oluşturuyorsa onların altına yeni bir satır aç. Yirmili yaşlardaki gençlerle yapılan bir araştırmada, farkları böyle yazarak çözülen soru sayısı arttıkça doğru cevapların da arttığı görülmüştür.',
      'Çocuğunuza bir sayı dizisinde kuralı ararken ardışık sayıların arasına farkı ya da işlemi yazmasını önerin: “+3”, “×2” gibi. Farklar da bir düzen oluşturuyorsa onların altına yeni bir satır açabilir. Yirmili yaşlardaki gençlerle yapılan bir araştırmada, farkları böyle yazarak çözülen soru sayısı arttıkça doğru cevapların da arttığı görülmüştür.',
    )),
    support(1, 'dene', 'Kuralı bütün dizide dene', 'Alışkanlık', t(
      'Bir kural bulduğunda cevabı yazmadan önce onu dizinin başından sonuna dene. Yalnızca son iki sayıya uyan bir kural çoğu zaman yanlış çıkar: örneğin 3, 4, 6, 9, 13 dizisinde son artışı (4) aynen eklemek 17 verir; oysa artışlar her adımda 1 büyüyor ve sıradaki sayı 18’dir.',
      'Çocuğunuza bir kural bulduğunda cevabı yazmadan önce onu dizinin başından sonuna denemesini önerin. Yalnızca son iki sayıya uyan bir kural çoğu zaman yanlış çıkar: örneğin 3, 4, 6, 9, 13 dizisinde son artışı (4) aynen eklemek 17 verir; oysa artışlar her adımda 1 büyüyor ve sıradaki sayı 18’dir.',
    )),
    support(2, 'ayir', 'İki diziye ayır', 'Yöntem', t(
      'Sayılar bir büyüyüp bir küçülüyorsa ya da düzen bir türlü bulunamıyorsa birinci, üçüncü, beşinci sayıları ve ikinci, dördüncü, altıncı sayıları ayrı ayrı yaz: bazen iç içe geçmiş iki basit dizi ortaya çıkar. Sayıların arasına yazdığın işlemler sırayla değişiyorsa (ör. önce +3, sonra ×2) kural iki işlemin sırayla uygulanması olabilir.',
      'Sayılar bir büyüyüp bir küçülüyorsa ya da düzen bir türlü bulunamıyorsa çocuğunuza birinci, üçüncü, beşinci sayıları ve ikinci, dördüncü, altıncı sayıları ayrı ayrı yazmasını önerin: bazen iç içe geçmiş iki basit dizi ortaya çıkar. Sayıların arasına yazdığı işlemler sırayla değişiyorsa (ör. önce +3, sonra ×2) kural iki işlemin sırayla uygulanması olabilir.',
    )),
    support(3, 'oyna', 'Sayılarla rahat ol', 'Etkinlik', t(
      'Bir araştırmada, sayı dizilerinde başarılı olanların tanıdık sayı dizilerini daha kolay tanıdığı ve hesabı daha verimli yaptığı görülmüştür. Zihinden işlem yapmak, çarpım tablosunu rahat bilmek ve kakuro gibi toplama gerektiren sayı bulmacaları bu rahatlığı destekleyebilir; bu bulmacalarda ustalaşmak her işe kendiliğinden yansımayabilir, asıl kazanç sayılarla düşünmekten keyif almaktır.',
      'Bir araştırmada, sayı dizilerinde başarılı olanların tanıdık sayı dizilerini daha kolay tanıdığı ve hesabı daha verimli yaptığı görülmüştür. Zihinden işlem yapmak, çarpım tablosunu rahat bilmek ve kakuro gibi toplama gerektiren sayı bulmacaları çocuğunuzun bu rahatlığını destekleyebilir; bu bulmacalarda ustalaşmak her işe kendiliğinden yansımayabilir, asıl kazanç sayılarla düşünmekten keyif almaktır.',
    )),
  ],
  facts: sayiFacts,
  approach: [
    { title: 'Acele ettirmeyin', text: 'Zor bir dizide uzun düşünmesine ve kâğıt kalem kullanmasına izin verin; hızlı olmasından çok, kuralı kendisinin bulmasını övün.' },
    { title: 'Sayı oyunları oynayın', text: '“Bir kural düşündüm: 2, 5, 8… Sıradaki sayı ne?” gibi kısa sayı oyunlarını sırayla kural koyarak oynayın; kuralı sözcüklerle söylemesini isteyin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki matematik çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Farkları yaz',
      text: t(
        'Bu hafta karşına çıkan ya da kendin yazdığın üç kısa sayı dizisinde sayıların arasına farkları yaz ve her birinin kuralını tek cümleyle söyle.',
        'Bu hafta çocuğunuzla üç kısa sayı dizisi bulun ya da yazın; sayıların arasına farkları yazıp her birinin kuralını tek cümleyle söyleyin.',
      ),
    },
    {
      title: 'Kendi dizini yap',
      text: t(
        'Bu hafta bir kural seç (ör. “iki katının bir eksiği”), o kurala göre beş sayı yaz, altıncıyı boş bırak ve birine çözdür; sonra onun nasıl düşündüğünü sor.',
        'Bu hafta çocuğunuzdan bir kural seçip (ör. “her adımda 4 fazla”) beş sayılık bir dizi yazmasını, altıncı sayıyı boş bırakıp size çözdürmesini isteyin; sonra rolleri değiştirin.',
      ),
    },
    {
      title: 'Kontrol et',
      text: t(
        'Bu hafta bir sayı bulmacası ya da problem çözerken, cevabı yazmadan önce bulduğun kuralı baştan sona bir kez dene ve kaç hatayı böyle yakaladığını say.',
        'Bu hafta çocuğunuzdan bir sayı bulmacası ya da problem çözerken cevabı yazmadan önce bulduğu kuralı baştan sona bir kez denemesini ve kaç hatayı böyle yakaladığını saymasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun sayılarla kural bulmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun sayılarla kural bulmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['sekil-akil-yurutme', 'dikkat-ve-bellek'],
  nextPurpose: {
    you: 'şekillerle akıl yürütmeyi ve bellek becerilerini de görmek',
    parent: 'çocuğunuzun şekillerle akıl yürütmesini ve bellek becerilerini de görmek',
  },
  links: [],
  sources: [KAYNAK.schneider, KAYNAK.lefevre, KAYNAK.ferrer],
};

const sozelBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca sözcüklerle yapılan yönünü gösterir.',
    'Sözel sorularda kelime bilgisi ve okuma rahatlığı da rol oynar; bilmediğin bir kelimenin geçtiği soruda zorlanmak olağandır.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; küçük yaşta üst düzeylerdeki sorularda zorlanmak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca sözcüklerle yapılan yönünü gösterir.',
    'Sözel sorularda kelime bilgisi ve okuma rahatlığı da rol oynar; çocuğunuzun bilmediği bir kelimenin geçtiği soruda zorlanması olağandır.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine alışkanlıkla ilgili bilgi. */
const sozelFacts: InfoBox = {
  ...sozelBase,
  items: {
    ...sozelBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca sözcüklerle yapılan yönünü gösterir.',
      'Sözel sorularda kelime bilgisi, okuma rahatlığı ve bu tür sorulara alışkın olmak da rol oynar.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const sozelAkilYurutme: TaskRoadmapTemplate = {
  version: 'sozel-akil-yurutme-yol-haritasi-1',
  what: {
    student: 'sözcüklerle akıl yürütmeyi gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun sözcüklerle akıl yürütmeyi gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'sözcüklerle akıl yürütmeyi gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Sözcüklerle akıl yürütmeyi ne kolaylaştırır?', parent: 'Çocuğunuzun sözcüklerle akıl yürütmesini ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, kelimeler arasındaki ilişkileri bulmayı ve verilen bilgilerden kesin sonuç çıkarmayı ölçer. Bu beceri; bir metindeki fikirler arasındaki bağı görmek, bir konuşmada hangi sonucun gerçekten söylenenlerden çıktığını ayırt etmek ve bir problemi adım adım çözmek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım eder.',
    'Bu test, kelimeler arasındaki ilişkileri bulmayı ve verilen bilgilerden kesin sonuç çıkarmayı ölçer. Bu beceri; bir metindeki fikirler arasındaki bağı görmek, bir konuşmada hangi sonucun gerçekten söylenenlerden çıktığını ayırt etmek ve bir problemi adım adım çözmek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım eder.',
  ),
  supports: [
    support(0, 'iliski', 'İlişkiyi cümleyle söyle', 'Yöntem', t(
      'İki kelime arasındaki ilişkiyi ararken onu bir cümleyle söyle: “Anahtar kilidi açar.” Sonra aynı cümleyi yeni kelimeyle kur ve ona uyanı ara. Çocuklarla yapılan bir araştırmada, şekillerle hazırlanmış benzetme sorularında sorudaki üçüncü şekle benzeyen yanlış seçeneğin sık seçildiği görülmüştür; ilişkiyi açıkça söylemek, yalnızca benzerliğe bakmamana yardım edebilir.',
      'Çocuğunuza iki kelime arasındaki ilişkiyi ararken onu bir cümleyle söylemesini önerin: “Anahtar kilidi açar.” Sonra aynı cümleyi yeni kelimeyle kurup ona uyanı arayabilir. Çocuklarla yapılan bir araştırmada, şekillerle hazırlanmış benzetme sorularında sorudaki üçüncü şekle benzeyen yanlış seçeneğin sık seçildiği görülmüştür; ilişkiyi açıkça söylemek, yalnızca benzerliğe bakmamasına yardım edebilir.',
    )),
    support(1, 'ciz', 'Bilgileri çiz', 'Yöntem', t(
      'Sıralama sorularında kişileri bir çizgi üzerine yerleştir ve her bilgiyi tek tek ekle. Bilgiler tek bir sıralamaya yetmiyorsa olası sıralamaların hepsini ayrı ayrı çiz: hepsinde doğru olan cevap kesindir, yalnızca birinde doğru olan ise yalnızca olabilir.',
      'Çocuğunuza sıralama sorularında kişileri bir çizgi üzerine yerleştirmesini ve her bilgiyi tek tek eklemesini önerin. Bilgiler tek bir sıralamaya yetmiyorsa olası sıralamaların hepsini ayrı ayrı çizebilir: hepsinde doğru olan cevap kesindir, yalnızca birinde doğru olan ise yalnızca olabilir.',
    )),
    support(2, 'kesin', '“Kesin mi, olabilir mi?”', 'Alışkanlık', t(
      'Bir sonucu doğru saymadan önce kendine sor: “Bu, verilen bilgilerden kesinlikle çıkıyor mu, yoksa yalnızca olabilir mi?” İnsanlar inandırıcı buldukları sonuçları, verilen bilgilerden çıkmasalar bile kabul etmeye yatkındır; bu soruyu sormak bu yanılgıyı fark etmene yardım edebilir.',
      'Çocuğunuza bir sonucu doğru saymadan önce kendine şunu sormasını önerin: “Bu, verilen bilgilerden kesinlikle çıkıyor mu, yoksa yalnızca olabilir mi?” İnsanlar inandırıcı buldukları sonuçları, verilen bilgilerden çıkmasalar bile kabul etmeye yatkındır; bu soruyu sormak bu yanılgıyı fark etmesine yardım edebilir.',
    )),
    support(3, 'oyun', 'Kelime ve mantık oyunları', 'Etkinlik', t(
      '“Hangisi gruba uymuyor?” oyunu, bilmeceler ve mantık bulmacaları kelimelerle düşünmeyi keyifli bir uğraş hâline getirir. Bu oyunlarda ustalaşmak her işe kendiliğinden yansımayabilir; asıl kazanç kelimelerle düşünmekten keyif almaktır.',
      '“Hangisi gruba uymuyor?” oyunu, bilmeceler ve mantık bulmacaları çocuğunuz için kelimelerle düşünmeyi keyifli bir uğraş hâline getirir. Bu oyunlarda ustalaşmak her işe kendiliğinden yansımayabilir; asıl kazanç kelimelerle düşünmekten keyif almaktır.',
    )),
  ],
  facts: sozelFacts,
  approach: [
    { title: 'Acele ettirmeyin', text: 'Uzun sorularda bilgileri kâğıda yazmasına izin verin; hızlı olmasından çok, cevabının nedenini söyleyebilmesini övün.' },
    { title: '“Nereden biliyoruz?” diye sorun', text: 'Bir sonuca vardığında “Bunu nereden biliyoruz?” diye sorun; kesin olanla yalnızca olabilecek olanı birlikte ayırın.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'İlişkiyi söyle',
      text: t(
        'Bu hafta üç kelime çifti bul (ör. “anahtar — kilit”), aralarındaki ilişkiyi bir cümleyle yaz ve aynı ilişkiye uyan yeni bir çift kur.',
        'Bu hafta çocuğunuzla üç kelime çifti bulun (ör. “anahtar — kilit”); aralarındaki ilişkiyi bir cümleyle söyleyin ve aynı ilişkiye uyan yeni bir çift kurun.',
      ),
    },
    {
      title: 'Çiz ve sırala',
      text: t(
        'Bu hafta kendi sıralama bulmacanı yaz (ör. evde kimin kimden önce uyandığı): üç bilgi ver, birine çözdür ve onun bilgileri nasıl çizdiğine bak.',
        'Bu hafta çocuğunuzdan kendi sıralama bulmacasını yazmasını isteyin (ör. evde kimin kimden önce uyandığı): üç bilgi versin, siz çözün; sonra rolleri değiştirin.',
      ),
    },
    {
      title: '“Kesin mi?” oyunu',
      text: t(
        'Bu hafta okuduğun ya da duyduğun üç cümle için kendine sor: “Bu kesin mi, yoksa yalnızca olabilir mi?” Nedenini bir cümleyle yaz.',
        'Bu hafta çocuğunuzla okuduğunuz ya da duyduğunuz üç cümle için “Bu kesin mi, yoksa yalnızca olabilir mi?” diye konuşun; nedenini bir cümleyle söyleyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun sözcüklerle düşünmeni en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun sözcüklerle düşünmesini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['sekil-akil-yurutme', 'sayi-dizileri'],
  nextPurpose: {
    you: 'şekillerle ve sayılarla akıl yürütmeyi de görmek',
    parent: 'çocuğunuzun şekillerle ve sayılarla akıl yürütmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.thibaut, KAYNAK.evans, KAYNAK.ferrer],
};

const katlamaBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (zihinde katlama ve canlandırma) gösterir.',
    'Bu tür sorulara alışkın olmak (ör. origami, yapı oyunları) sonucu etkileyebilir.',
    'Uzamsal beceriler yaşla ve deneyimle değişir; küçük yaşta üç katlamalı sorularda zorlanmak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (zihinde katlama ve canlandırma) gösterir.',
    'Bu tür sorulara alışkın olmak (ör. origami, yapı oyunları) sonucu etkileyebilir.',
    'Uzamsal beceriler yaşla ve deneyimle değişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine alışkanlıkla ilgili bilgi. */
const katlamaFacts: InfoBox = {
  ...katlamaBase,
  items: {
    ...katlamaBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (zihinde katlama ve canlandırma) gösterir.',
      'Bu tür sorulara alışkın olmak (ör. origami, yapı oyunları, teknik çizim) sonucu etkileyebilir.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const kagitKatlama: TaskRoadmapTemplate = {
  version: 'kagit-katlama-yol-haritasi-1',
  what: {
    student: 'şekilleri zihinde canlandırmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun şekilleri zihinde canlandırmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'şekilleri zihinde canlandırmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Şekilleri zihinde canlandırmayı ne kolaylaştırır?', parent: 'Çocuğunuzun şekilleri zihinde canlandırmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, katlanan bir kâğıdı zihninde açabilmeyi, yani şekilleri zihinde canlandırıp dönüştürebilmeyi ölçer. Bu beceri; bir kutunun açınımını düşünmek, bir haritayı ya da krokiyi okumak, bir eşyayı kurmak ve geometri problemleri çözmek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım eder.',
    'Bu test, katlanan bir kâğıdı zihinde açabilmeyi, yani şekilleri zihinde canlandırıp dönüştürebilmeyi ölçer. Bu beceri; bir kutunun açınımını düşünmek, bir haritayı ya da krokiyi okumak, bir eşyayı kurmak ve geometri problemleri çözmek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım eder.',
  ),
  supports: [
    support(0, 'adim', 'Adım adım aç', 'Yöntem', t(
      'Katlanmış bir kâğıdı zihninde açarken son katlamadan başla ve her seferinde tek bir katlamayı aç. Her açışta deliğin bir eşi, katlama çizgisinin öbür yanında ve çizgiye aynı uzaklıkta açılır; ama yalnızca katlanan parça o deliğe ulaşmışsa.',
      'Çocuğunuza katlanmış bir kâğıdı zihninde açarken son katlamadan başlamasını ve her seferinde tek bir katlamayı açmasını önerin. Her açışta deliğin bir eşi, katlama çizgisinin öbür yanında ve çizgiye aynı uzaklıkta açılır; ama yalnızca katlanan parça o deliğe ulaşmışsa.',
    )),
    support(1, 'dene', 'Gerçek kâğıtla dene', 'Etkinlik', t(
      'Bir kâğıdı bir iki kez katla, delik açacağın yeri seç ve açmadan önce deliklerin nerede olacağını kâğıda çizerek tahmin et. Sonra kurşun kalemin ucuyla küçük bir delik açıp kâğıdı aç ve tahminini kontrol et.',
      'Çocuğunuzla bir kâğıdı bir iki kez katlayın, delik açılacak yeri seçin ve açmadan önce deliklerin nerede olacağını tahmin etmesini isteyin. Sonra kurşun kalemin ucuyla küçük bir delik açıp kâğıdı açın ve tahmini birlikte kontrol edin.',
    )),
    support(2, 'ciz', 'Çiz ve aynala', 'Yöntem', t(
      'Kâğıda bir kare çiz, katlama çizgisini ve deliği işaretle. Deliğin çizgiye uzaklığını ölç ve öbür yana aynı uzaklıkta yeni bir delik çiz; çapraz katlamada da aynı kural geçerlidir.',
      'Çocuğunuza kâğıda bir kare çizip katlama çizgisini ve deliği işaretlemesini, sonra deliğin çizgiye uzaklığını ölçüp öbür yana aynı uzaklıkta yeni bir delik çizmesini önerin; çapraz katlamada da aynı kural geçerlidir.',
    )),
    support(3, 'oyun', 'Uzamsal oyunlar', 'Etkinlik', t(
      'Origami, tangram, yapı oyunları ve harita okumak, şekillerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; yine de bir oyunda ustalaşmanın her işe kendiliğinden yansıyacağı söylenemez, asıl kazanç şekillerle düşünmekten keyif almaktır.',
      'Origami, tangram, yapı oyunları ve harita okumak, çocuğunuz için şekillerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; yine de bir oyunda ustalaşmanın her işe kendiliğinden yansıyacağı söylenemez, asıl kazanç şekillerle düşünmekten keyif almaktır.',
    )),
  ],
  facts: katlamaFacts,
  approach: [
    { title: 'Birlikte katlayın', text: 'Bir kâğıdı birlikte katlayıp delmeden önce deliklerin nerede olacağını tahmin edin; sonra açıp bakın ve tahmini konuşun.' },
    { title: 'Acele ettirmeyin', text: 'Zor bir soruda uzun düşünmesine izin verin; hızlı olmasından çok, kâğıdı adım adım açarak düşünmesini övün.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Tahmin et ve aç',
      text: t(
        'Bu hafta bir kâğıdı üç farklı biçimde katla; her seferinde delikleri önce tahmin et, sonra kâğıdı açıp kontrol et.',
        'Bu hafta çocuğunuzla bir kâğıdı üç farklı biçimde katlayın; her seferinde delikleri önce tahmin etmesini, sonra kâğıdı açıp kontrol etmesini isteyin.',
      ),
    },
    {
      title: 'Kendi sorunu yap',
      text: t(
        'Bu hafta bir kâğıt katlama sorusu çiz: katlama adımlarını ve deliği göster, birine çözdür ve onun nasıl düşündüğünü sor.',
        'Bu hafta çocuğunuzdan bir kâğıt katlama sorusu çizmesini ve size çözdürmesini isteyin; sonra rolleri değiştirin.',
      ),
    },
    {
      title: 'Adım adım aç',
      text: t(
        'Bu hafta bir şekli zihninde değiştirmen gereken bir işte (ör. bir kutunun açınımı, bir krokiyi okumak) her adımı kâğıda kısaca çiz ve sonucu kontrol et.',
        'Bu hafta çocuğunuzla bir şekli zihinde değiştirmeyi gerektiren bir işte (ör. bir kutunun açınımı, bir krokiyi okumak) her adımı kâğıda kısaca çizin ve sonucu kontrol edin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun şekilleri zihninde canlandırmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun şekilleri zihninde canlandırmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['zihinde-dondurme', 'sekil-akil-yurutme'],
  nextPurpose: {
    you: 'şekilleri zihinde döndürmeyi ve şekillerle akıl yürütmeyi de görmek',
    parent: 'çocuğunuzun şekilleri zihinde döndürmesini ve şekillerle akıl yürütmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.uttal, KAYNAK.wai],
};

const kelimeBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; Türkçe kelime bilgisinin küçük bir örneğini gösterir.',
    'Kelime bilgisi okudukça ve yeni kelimelerle karşılaştıkça gelişir; küçük yaşta üst düzeylerdeki kelimeleri bilmemek olağandır.',
    'Evde başka bir dil de konuşuluyorsa ya da Türkçeyi sonradan öğrendiysen sonuç, düşünme becerini değil Türkçe kelime bilgini gösterir.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; Türkçe kelime bilgisinin küçük bir örneğini gösterir.',
    'Kelime bilgisi okudukça ve yeni kelimelerle karşılaştıkça gelişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
    'Evde başka bir dil de konuşuluyorsa ya da Türkçe sonradan öğrenildiyse sonuç, düşünme becerisini değil Türkçe kelime bilgisini gösterir.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine okuma alışkanlığıyla ilgili bilgi. */
const kelimeFacts: InfoBox = {
  ...kelimeBase,
  items: {
    ...kelimeBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; Türkçe kelime bilgisinin küçük bir örneğini gösterir.',
      'Kelime bilgisi okuma alışkanlığıyla ve yeni kelimelerle karşılaştıkça hayat boyu gelişir.',
      'Türkçeyi sonradan öğrendiysen sonuç, düşünme becerini değil Türkçe kelime bilgini gösterir.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const kelimeBilgisi: TaskRoadmapTemplate = {
  version: 'kelime-bilgisi-yol-haritasi-1',
  what: {
    student: 'yeni kelimeler öğrenmeyi ve okurken bilmediğin bir kelimenin anlamını bulmayı nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun yeni kelimeler öğrenmesini ve okurken bilmediği bir kelimenin anlamını bulmasını nasıl kolaylaştırabileceği',
    summary: 'yeni kelimeler öğrenmeyi ve bilinmeyen bir kelimenin anlamını bulmayı kolaylaştıran yollar',
  },
  studyTitle: { you: 'Yeni kelimeler öğrenmeyi ne kolaylaştırır?', parent: 'Çocuğunuzun yeni kelimeler öğrenmesini ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, Türkçe kelimelerin ve deyimlerin anlamlarını bilmeyi ölçer. Kelime bilgisi okuduğunu anlamakla yakından ilişkilidir ve okudukça gelişir. Aşağıdaki yollar, yeni kelimeler öğrenmeyi ve okurken bilmediğin bir kelimenin anlamını bulmayı kolaylaştırır.',
    'Bu test, Türkçe kelimelerin ve deyimlerin anlamlarını bilmeyi ölçer. Kelime bilgisi okuduğunu anlamakla yakından ilişkilidir ve okudukça gelişir. Aşağıdaki yollar, çocuğunuzun yeni kelimeler öğrenmesini ve okurken bilmediği bir kelimenin anlamını bulmasını kolaylaştırır.',
  ),
  supports: [
    support(0, 'oku', 'Düzenli ve çeşitli oku', 'Alışkanlık', t(
      'Her gün biraz ve farklı türlerde (hikâye, bilgilendirici yazı, gazete) okumak, yeni kelimelerle karşılaşmanın en doğal yoludur. Araştırmalar, okumanın yeni kelimeler öğrenmenin temel yollarından biri olduğunu gösteriyor.',
      'Çocuğunuzun her gün biraz ve farklı türlerde (hikâye, bilgilendirici yazı, gazete) okuması, yeni kelimelerle karşılaşmasının en doğal yoludur. Araştırmalar, okumanın yeni kelimeler öğrenmenin temel yollarından biri olduğunu gösteriyor.',
    )),
    support(1, 'cumle', 'Önce cümleye bak', 'Yöntem', t(
      'Bilmediğin bir kelimeyle karşılaşınca önce cümlenin ve paragrafın bütününe bak, anlamını tahmin et; sonra sözlükten kontrol et. Birden çok anlamı olan kelimelerde hangi anlamın kastedildiğini cümle gösterir.',
      'Çocuğunuza bilmediği bir kelimeyle karşılaşınca önce cümlenin ve paragrafın bütününe bakıp anlamını tahmin etmesini, sonra sözlükten kontrol etmesini önerin. Birden çok anlamı olan kelimelerde hangi anlamın kastedildiğini cümle gösterir.',
    )),
    support(2, 'kullan', 'Yeni kelimeyi kullan', 'Yöntem', t(
      'Öğrendiğin bir kelimeyi kendi cümlelerinde kullan ve biriyle üzerine konuş. Araştırmalarda kelimeleri böyle etkin biçimde işlemek, yalnızca tanımlarını okumaktan genellikle daha etkili bulunmuştur.',
      'Çocuğunuzu öğrendiği bir kelimeyi kendi cümlelerinde kullanmaya ve üzerine sizinle konuşmaya teşvik edin. Araştırmalarda kelimeleri böyle etkin biçimde işlemek, yalnızca tanımlarını okumaktan genellikle daha etkili bulunmuştur.',
    )),
    support(3, 'sozluk', 'Kelime defteri ve sözlük', 'Araç', t(
      'Yeni kelimeleri ve deyimleri anlamı ve bir örnek cümleyle bir deftere yaz; anlamlarını Türk Dil Kurumunun Güncel Türkçe Sözlüğü’nden (sozluk.gov.tr) kontrol et. Deyimlerin anlamı, içindeki kelimelerden çoğu zaman tahmin edilemez.',
      'Çocuğunuza yeni kelimeleri ve deyimleri anlamı ve bir örnek cümleyle bir deftere yazmasını, anlamlarını Türk Dil Kurumunun Güncel Türkçe Sözlüğü’nden (sozluk.gov.tr) kontrol etmesini önerin. Deyimlerin anlamı, içindeki kelimelerden çoğu zaman tahmin edilemez.',
    )),
  ],
  facts: kelimeFacts,
  approach: [
    { title: 'Birlikte okuyun', text: 'Birlikte okurken bilmediği bir kelimeyi sorduğunda hemen söylemek yerine önce cümleden tahmin etmesini isteyin; sonra birlikte sözlüğe bakın.' },
    { title: 'Sohbette yeni kelimeler', text: 'Günlük konuşmada yeni kelimeler ve deyimler kullanın, anlamlarını birlikte konuşun; bilmediği bir kelimeyi sormasını cesaretlendirin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Kelime avı',
      text: t(
        'Bu hafta okuduğun yazılarda bilmediğin beş kelimeyi işaretle; her birinin anlamını önce cümleden tahmin et, sonra sözlükten kontrol et ve deftere yaz.',
        'Bu hafta çocuğunuzla okuduğunuz yazılarda bilmediği beş kelimeyi işaretleyin; anlamlarını önce cümleden tahmin etmesini, sonra sözlükten kontrol etmesini isteyin.',
      ),
    },
    {
      title: 'Kullan ve konuş',
      text: t(
        'Bu hafta deftere yazdığın kelimelerden her gün birini kendi cümlende kullan ve birine anlat.',
        'Bu hafta çocuğunuzun deftere yazdığı kelimelerden her gün birini birlikte bir cümle içinde kullanın.',
      ),
    },
    {
      title: 'Deyim haftası',
      text: t(
        'Bu hafta duyduğun ya da okuduğun üç deyimi yaz; anlamlarını sözlükten bul ve her biri için bir örnek cümle kur.',
        'Bu hafta çocuğunuzla günlük konuşmada geçen üç deyimi bulun; anlamlarını konuşun ve birlikte örnek cümleler kurun.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda defterindeki kelimelere bak; hangilerini artık kendiliğinden kullandığını işaretle ve en çok işine yarayan yolu sürdür.',
    'Dört haftanın sonunda çocuğunuzla defterdeki kelimelere bakın; hangilerini artık kendiliğinden kullandığını konuşun ve en çok işe yarayan yolu sürdürün.',
  ),
  nextTests: ['sozel-akil-yurutme', 'sekil-akil-yurutme'],
  nextPurpose: {
    you: 'kelimelerle ve şekillerle akıl yürütmeyi de görmek',
    parent: 'çocuğunuzun kelimelerle ve şekillerle akıl yürütmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.nation, KAYNAK.wright, KAYNAK.tdk],
};

const kuralBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; bilişsel esnekliğin yalnızca bir yönünü (iki basit kural arasında geçiş) gösterir.',
    'Kural değiştiğinde biraz yavaşlamak herkeste görülür; çok uzun alıştırmalardan sonra bile bu yavaşlama tamamen kaybolmaz.',
    'Bu tür beceriler ergenlik boyunca gelişmeyi sürdürür; küçük yaşta kurallar karışınca zorlanmak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; bilişsel esnekliğin yalnızca bir yönünü (iki basit kural arasında geçiş) gösterir.',
    'Kural değiştiğinde biraz yavaşlamak herkeste görülür; çok uzun alıştırmalardan sonra bile bu yavaşlama tamamen kaybolmaz.',
    'Bu tür beceriler ergenlik boyunca gelişmeyi sürdürür; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine cihazla ilgili bilgi. */
const kuralFacts: InfoBox = {
  ...kuralBase,
  items: {
    ...kuralBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; bilişsel esnekliğin yalnızca bir yönünü (iki basit kural arasında geçiş) gösterir.',
      'Kural değiştiğinde biraz yavaşlamak herkeste görülür; çok uzun alıştırmalardan sonra bile bu yavaşlama tamamen kaybolmaz.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const kuralDegistirme: TaskRoadmapTemplate = {
  version: 'kural-degistirme-yol-haritasi-1',
  what: {
    student: 'bir işten ötekine ya da bir kuraldan ötekine geçmeyi gerektiren durumları nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun bir işten ötekine ya da bir kuraldan ötekine geçmesini nasıl kolaylaştırabileceği',
    summary: 'bir işten ötekine geçmeyi kolaylaştıran yollar',
  },
  studyTitle: { you: 'Bir işten ötekine geçmeyi ne kolaylaştırır?', parent: 'Çocuğunuzun bir işten ötekine geçmesini ne kolaylaştırır?' },
  studyIntro: t(
    'Bu görev, bir kuraldan ötekine geçebilmeyi (bilişsel esneklik) ölçer. Bu beceri; bir işten ötekine geçmek, bir problemin çözüm yolunu değiştirmek ya da kuralları değişen bir oyuna uyum sağlamak gibi durumlarda kullanılır. Aşağıdaki yollar, bu geçişleri kolaylaştırmaya yardım eder.',
    'Bu görev, bir kuraldan ötekine geçebilmeyi (bilişsel esneklik) ölçer. Bu beceri; bir işten ötekine geçmek, bir problemin çözüm yolunu değiştirmek ya da kuralları değişen bir oyuna uyum sağlamak gibi durumlarda kullanılır. Aşağıdaki yollar, çocuğunuzun bu geçişleri kolaylaştırmasına yardım eder.',
  ),
  supports: [
    support(0, 'isaret', 'Geçişi fark et', 'Yöntem', t(
      'Bir işten ötekine geçerken bir an dur ve yeni işin kuralını kendine kısaca söyle (ör. “Şimdi renge bakıyorum.”). Kural değişince zihnin kendini yeniden ayarlaması zaman alır; geçişi fark edip hazırlanmak için kendine bir an tanımak işini kolaylaştırabilir.',
      'Çocuğunuza bir işten ötekine geçerken bir an durmasını ve yeni işin kuralını kendine kısaca söylemesini önerin (ör. “Şimdi renge bakıyorum.”). Kural değişince zihnin kendini yeniden ayarlaması zaman alır; geçişi fark edip hazırlanmak için bir an tanımak işini kolaylaştırabilir.',
    )),
    support(1, 'tek', 'Bir seferde tek iş', 'Alışkanlık', t(
      'Mümkün olduğunda işleri sırayla yap: birini bitirip ötekine geç. Araştırmalar, iş değiştirdikten hemen sonra daha yavaş ve daha çok hatayla çalışıldığını gösteriyor; sık sık iş değiştirmek bu kaybı çoğaltır.',
      'Çocuğunuzu mümkün olduğunda işleri sırayla yapmaya, birini bitirip ötekine geçmeye teşvik edin. Araştırmalar, iş değiştirdikten hemen sonra daha yavaş ve daha çok hatayla çalışıldığını gösteriyor; sık sık iş değiştirmek bu kaybı çoğaltır.',
    )),
    support(2, 'liste', 'Kuralları görünür kıl', 'Araç', t(
      'Kuralların ya da adımların değiştiği işlerde (ör. bir oyunun kuralları, bir tarifin adımları) kuralları kısa bir listeye yaz ve göz önünde tut; böylece hepsini aynı anda akılda tutmak zorunda kalmazsın.',
      'Çocuğunuza kuralların ya da adımların değiştiği işlerde (ör. bir oyunun kuralları, bir tarifin adımları) kuralları kısa bir listeye yazıp göz önünde tutmasını önerin; böylece hepsini aynı anda akılda tutmak zorunda kalmaz.',
    )),
    support(3, 'oyun', 'Kuralı değişen oyunlar', 'Etkinlik', t(
      '“Simon der” gibi ya da oyunun ortasında kuralı değişen kart oyunları, esnek düşünmeyi keyifli bir uğraş hâline getirir. Bir çalışmada kural değiştirme alıştırması yapan gençlerin alıştırılan görevdeki yavaşlaması azalmış, ama bu kazanç başka işlere sınırlı yansımıştır; asıl kazanç bu oyunlardan keyif almaktır.',
      '“Simon der” gibi ya da oyunun ortasında kuralı değişen kart oyunları, çocuğunuz için esnek düşünmeyi keyifli bir uğraş hâline getirir. Bir çalışmada kural değiştirme alıştırması yapan gençlerin alıştırılan görevdeki yavaşlaması azalmış, ama bu kazanç başka işlere sınırlı yansımıştır; asıl kazanç bu oyunlardan keyif almaktır.',
    )),
  ],
  facts: kuralFacts,
  approach: [
    { title: 'Geçişleri önceden haber verin', text: 'Bir işten ötekine geçmeden birkaç dakika önce haber verin; bu, yeni işe hazırlanmasına yardım eder.' },
    { title: 'Kuralları tek tek söyleyin', text: 'Yeni kuralları ya da adımları tek tek söyleyin; gerekiyorsa kısa, yazılı bir liste verin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Geçişi söyle',
      text: t(
        'Bu hafta bir işten ötekine her geçişinde, yeni işin kuralını ya da ilk adımını kendine bir cümleyle söyle.',
        'Bu hafta çocuğunuzla, bir işten ötekine her geçişte yeni işin kuralını ya da ilk adımını bir cümleyle söyleme alışkanlığı edinmeye çalışın.',
      ),
    },
    {
      title: 'Tek iş',
      text: t(
        'Bu hafta günde bir kez, yarım saat boyunca tek bir işle uğraş; bildirimleri kapat ve işi bitirmeden başka işe geçme.',
        'Bu hafta çocuğunuzla günde bir kez, yarım saat boyunca tek bir işle uğraşmayı deneyin; dikkat dağıtıcıları kaldırın ve işi bitirmeden başka işe geçmeyin.',
      ),
    },
    {
      title: 'Kuralı değişen oyun',
      text: t(
        'Bu hafta “Simon der” ya da kart eşleştirme gibi bir oyunu, oyunun ortasında kuralı değiştirerek birileriyle oyna.',
        'Bu hafta çocuğunuzla “Simon der” ya da kart eşleştirme gibi bir oyunu, oyunun ortasında kuralı değiştirerek oynayın.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun bir işten ötekine geçmeni en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun bir işten ötekine geçmesini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['renk-kelime-gorevi', 'dur-git-gorevi'],
  nextPurpose: {
    you: 'dikkatini yönetme becerilerinin başka yönlerini de görmek',
    parent: 'çocuğunuzun dikkatini yönetme becerilerinin başka yönlerini de görmek',
    general: true,
  },
  links: [],
  sources: [KAYNAK.stoet, KAYNAK.zinke, KAYNAK.hedge],
};

const mantiksalBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca bir yönünü (sözel bilgilerden kesin sonuç çıkarmayı) gösterir.',
    '“Eğer–ise” kurallarını iki yönlü düşünmek ve gerçek hayattaki bilgiye göre karar vermek yetişkinlerde de çok yaygındır; bu yanılgılar düşünme biçimini fark etmek için birer fırsattır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca bir yönünü (sözel bilgilerden kesin sonuç çıkarmayı) gösterir.',
    'Sonucun gerçek hayatla çatıştığı sorulardaki başarının 12 yaşından genç yetişkinliğe doğru arttığı görülmüştür; yani bu beceri ergenlik boyunca gelişmeye devam eder.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine yanılgıların çok yaygın olduğu bilgisi. */
const mantiksalFacts: InfoBox = {
  ...mantiksalBase,
  items: {
    ...mantiksalBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca bir yönünü (sözel bilgilerden kesin sonuç çıkarmayı) gösterir.',
      '“Eğer–ise” kurallarını iki yönlü düşünmek ve gerçek hayattaki bilgiye göre karar vermek çok yaygındır; araştırmalarda yetişkin katılımcılar da bu yanılgılara sık düşmüştür.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const mantiksalAkilYurutme: TaskRoadmapTemplate = {
  version: 'mantiksal-akil-yurutme-yol-haritasi-1',
  what: {
    student: 'bilgilerden kesin sonuç çıkarmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun bilgilerden kesin sonuç çıkarmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'bilgilerden kesin sonuç çıkarmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: {
    you: 'Kesin sonuç çıkarmayı ne kolaylaştırır?',
    parent: 'Çocuğunuzun kesin sonuç çıkarmasını ne kolaylaştırır?',
  },
  studyIntro: t(
    'Bu test, verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt edebilmeyi ölçer. Bu beceri; bir kuralı ya da yönergeyi doğru uygulamak, matematikte ve bilimde bir sonucun gerçekten kanıtlanıp kanıtlanmadığına bakmak, bir haberi ya da iddiayı değerlendirmek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım edebilir.',
    'Bu test, verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt edebilmeyi ölçer. Bu beceri; bir kuralı ya da yönergeyi doğru uygulamak, matematikte ve bilimde bir sonucun gerçekten kanıtlanıp kanıtlanmadığına bakmak, bir haberi ya da iddiayı değerlendirmek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım edebilir.',
  ),
  supports: [
    support(
      0,
      'karsi',
      'Karşı örnek ara',
      'Yöntem',
      t(
        'Bir sonucun kesin olup olmadığını anlamak için kendine şunu sor: “Bilgilerin hepsi doğru olduğu hâlde bu sonucun yanlış olduğu bir durum olabilir mi?” Böyle bir durum, yani bir karşı örnek bulabiliyorsan sonuç kesin değildir. Örneğin “Yağmur yağarsa yer ıslanır” kuralında yer ıslaksa, yağmur yağmadan da ıslanmış olabilir: biri su dökmüş olabilir.',
        'Çocuğunuza bir sonucun kesin olup olmadığını anlamak için şunu sormasını önerin: “Bilgilerin hepsi doğru olduğu hâlde bu sonucun yanlış olduğu bir durum olabilir mi?” Böyle bir durum, yani bir karşı örnek bulunabiliyorsa sonuç kesin değildir. Örneğin “Yağmur yağarsa yer ıslanır” kuralında yer ıslaksa, yağmur yağmadan da ıslanmış olabilir: biri su dökmüş olabilir.',
      ),
    ),
    support(
      1,
      'yon',
      'Kuralın yönüne dikkat et',
      'Yöntem',
      t(
        '“Eğer A ise B” kuralı tek yönlüdür: A olunca B de olur; B yoksa A da yoktur. Ama kural, B olunca A’nın da olduğunu ya da A yokken B’nin de olmadığını söylemez. Bir kuralı okurken “Bu kural tersini de söylüyor mu?” diye kendine sor.',
        '“Eğer A ise B” kuralı tek yönlüdür: A olunca B de olur; B yoksa A da yoktur. Ama kural, B olunca A’nın da olduğunu ya da A yokken B’nin de olmadığını söylemez. Çocuğunuzla bir kuralı okurken “Bu kural tersini de söylüyor mu?” diye birlikte sorun.',
      ),
    ),
    support(
      2,
      'gercek',
      'Gerçeği bir kenara bırak',
      'Yöntem',
      t(
        'Bir sonucu gerçek hayatta doğru ya da yanlış bulduğun için kabul etme ya da reddetme; yalnızca bilgilerden çıkıp çıkmadığına bak. Cümledeki adların yerine uydurma sözcükler koymak (ör. “Bütün kuşlar” yerine “Bütün mopalar”) bunu kolaylaştırabilir.',
        'Çocuğunuza bir sonucu gerçek hayatta doğru ya da yanlış bulduğu için kabul etmemesini ya da reddetmemesini, yalnızca bilgilerden çıkıp çıkmadığına bakmasını önerin. Cümledeki adların yerine uydurma sözcükler koymak (ör. “Bütün kuşlar” yerine “Bütün mopalar”) bunu kolaylaştırabilir.',
      ),
    ),
    support(
      3,
      'ciz',
      'Çizerek düşün',
      'Araç',
      t(
        '“Bütün”, “bazı” ve “hiçbir” cümlelerini iç içe ya da yan yana çemberlerle çiz: “Bütün güller çiçektir” cümlesinde güller çemberi, çiçekler çemberinin içindedir. Bilgiler çoğu zaman birden çok çizime izin verir: aklına gelen bütün çizimleri yap. Sonuç bu çizimlerden birinde bile tutmuyorsa kesin değildir.',
        'Çocuğunuza “bütün”, “bazı” ve “hiçbir” cümlelerini iç içe ya da yan yana çemberlerle çizmesini önerin: “Bütün güller çiçektir” cümlesinde güller çemberi, çiçekler çemberinin içindedir. Bilgiler çoğu zaman birden çok çizime izin verir: akla gelen bütün çizimleri yapmak gerekir. Sonuç bu çizimlerden birinde bile tutmuyorsa kesin değildir.',
      ),
    ),
  ],
  facts: mantiksalFacts,
  approach: [
    {
      title: 'Nedenini sorun',
      text: 'Bir sonuca vardığında “Bunu nereden biliyoruz, başka türlü olabilir mi?” diye sorun; doğru ya da yanlış demek yerine birlikte bir karşı örnek arayın.',
    },
    {
      title: 'Kuralları birlikte inceleyin',
      text: 'Günlük konuşmalardaki “eğer … ise …” cümlelerini birlikte inceleyin ve kuralın tersini de söyleyip söylemediğini konuşun.',
    },
    {
      title: 'Karşılaştırmayın',
      text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.',
    },
  ],
  weeks: [
    {
      title: 'Karşı örnek avı',
      text: t(
        'Bu hafta duyduğun ya da okuduğun üç “eğer … ise …” cümlesini yaz; her biri için kuralın tersinin doğru olmayabileceğini gösteren bir örnek bul.',
        'Bu hafta çocuğunuzla duyduğunuz ya da okuduğunuz üç “eğer … ise …” cümlesini yazın; her biri için kuralın tersinin doğru olmayabileceğini gösteren bir örnek bulun.',
      ),
    },
    {
      title: 'Gerçek mi, çıkarım mı?',
      text: t(
        'Bu hafta gerçeğe uymayan bilgilerle (ör. “Bütün kediler uçabilir”) iki soru yaz ve birine sor; sonucun bilgilerden mi yoksa gerçek hayattan mı geldiğini onunla konuş.',
        'Bu hafta çocuğunuz gerçeğe uymayan bilgilerle (ör. “Bütün kediler uçabilir”) iki soru yazsın ve size sorsun; sonucun bilgilerden mi yoksa gerçek hayattan mı geldiğini birlikte konuşun.',
      ),
    },
    {
      title: 'Çiz ve gör',
      text: t(
        'Bu hafta “bütün, bazı, hiçbir” sözcükleriyle kurulmuş iki cümleyi çemberler çizerek incele ve hangi sonuçların kesin olarak çıktığını bul.',
        'Bu hafta çocuğunuzla “bütün, bazı, hiçbir” sözcükleriyle kurulmuş iki cümleyi çemberler çizerek inceleyin ve hangi sonuçların kesin olarak çıktığını bulun.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (karşı örnek aramak, kuralın yönüne bakmak, gerçeği bir kenara bırakmak ya da çizmek) kesin sonuç çıkarmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun kesin sonuç çıkarmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['sozel-akil-yurutme', 'sekil-akil-yurutme'],
  nextPurpose: {
    you: 'sözcüklerle ve şekillerle akıl yürütmeyi de görmek',
    parent: 'çocuğunuzun sözcüklerle ve şekillerle akıl yürütmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.markovits2014, KAYNAK.evansThompsonOver, KAYNAK.trippas, KAYNAK.deNeys],
};

const sayisalBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; sayılarla akıl yürütmenin yalnızca iki yönünü (orantı ile farkı ayırt etmeyi ve eşitliği dengelemeyi) gösterir.',
    'Orantı kurulacak yerde farkı korumak ya da orantılı olmayan bir durumda orantı kurmak araştırmalarda sık görülmüştür; bu yanılgılar düşünme biçimini fark etmek için birer fırsattır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; sayılarla akıl yürütmenin yalnızca iki yönünü (orantı ile farkı ayırt etmeyi ve eşitliği dengelemeyi) gösterir.',
    'Araştırmalarda orantılı durumlarda farkı koruma yanılgısının ilkokulda yaygın olduğu ve lise yıllarında azaldığı, orantılı olmayan durumlarda orantı kurma yanılgısının ise orantının öğretildiği yıllarda arttığı görülmüştür; bu yüzden aynı yanılgı farklı yaşlarda farklı anlama gelir.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine yanılgıların neyle ilişkili olabileceği. */
const sayisalFacts: InfoBox = {
  ...sayisalBase,
  items: {
    ...sayisalBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; sayılarla akıl yürütmenin yalnızca iki yönünü (orantı ile farkı ayırt etmeyi ve eşitliği dengelemeyi) gösterir.',
      'Orantı kurulacak yerde farkı korumak ya da orantılı olmayan bir durumda orantı kurmak araştırmalarda sık görülmüştür; araştırmacılar orantılı olmayan durumda orantı kurmayı, durumu düşünmek yerine öğrenilmiş bir yöntemi uygulamaya bağlamıştır.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const sayisalAkilYurutme: TaskRoadmapTemplate = {
  version: 'sayisal-akil-yurutme-yol-haritasi-1',
  what: {
    student: 'sayılar arasındaki ilişkiyi kurmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun sayılar arasındaki ilişkiyi kurmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'sayılar arasındaki ilişkiyi kurmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: {
    you: 'Sayılarla düşünmeyi ne kolaylaştırır?',
    parent: 'Çocuğunuzun sayılarla düşünmesini ne kolaylaştırır?',
  },
  studyIntro: t(
    'Bu test, bir durumdaki sayıların birbiriyle nasıl ilişkili olduğunu görebilmeyi ölçer. Bu beceri; bir tarifi kalabalık bir sofraya göre büyütmek, fiyatları karşılaştırmak, bir haritada uzaklığı hesaplamak, bir yolculuğun ne kadar süreceğini kestirmek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım edebilir.',
    'Bu test, bir durumdaki sayıların birbiriyle nasıl ilişkili olduğunu görebilmeyi ölçer. Bu beceri; bir tarifi kalabalık bir sofraya göre büyütmek, fiyatları karşılaştırmak, bir haritada uzaklığı hesaplamak, bir yolculuğun ne kadar süreceğini kestirmek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım edebilir.',
  ),
  supports: [
    support(0, 'iki-kat', 'İki katı sorusu', 'Yöntem', t(
      'Bir durumda orantı kurmadan önce kendine sor: “Biri iki katına çıkınca öteki de iki katına çıkar mı?” Çıkıyorsa durum orantılıdır. Çıkmıyorsa aradaki fark korunuyor, bir başlangıç miktarı var ya da sonuç hiç değişmiyor olabilir. Örneğin bir tarifteki un iki katına çıkınca şeker de iki katına çıkar; ama pişme süresi iki katına çıkmaz.',
      'Çocuğunuza bir durumda orantı kurmadan önce şunu sormasını önerin: “Biri iki katına çıkınca öteki de iki katına çıkar mı?” Çıkıyorsa durum orantılıdır; çıkmıyorsa aradaki fark korunuyor, bir başlangıç miktarı var ya da sonuç hiç değişmiyor olabilir. Örneğin bir tarifteki un iki katına çıkınca şeker de iki katına çıkar; ama pişme süresi iki katına çıkmaz.',
    )),
    support(1, 'tablo', 'Tablo yap', 'Araç', t(
      'İki niceliği yan yana küçük bir tabloya yaz (ör. kişi sayısı ile pilav için bardak pirinç: 2 – 1, 4 – 2, 6 – 3). Satırdan satıra neyin aynı kaldığına bak: iki sayının oranı mı, aradaki fark mı? Tablo, durumun hangi türden olduğunu görmeni kolaylaştırabilir.',
      'Çocuğunuza iki niceliği yan yana küçük bir tabloya yazmasını önerin (ör. kişi sayısı ile pilav için bardak pirinç: 2 – 1, 4 – 2, 6 – 3). Satırdan satıra neyin aynı kaldığına bakmak (iki sayının oranı mı, aradaki fark mı) durumun hangi türden olduğunu görmesini kolaylaştırabilir.',
    )),
    support(2, 'terazi', 'Eşittir işaretini terazi gibi düşün', 'Yöntem', t(
      '“=” işaretini “sonuç şudur” diye değil, “iki yan aynı ağırlıkta” diye oku. Bir yanda bir sayı değişince, terazi dengede kalsın diye öbür yanda neyin değişmesi gerektiğini düşün.',
      'Çocuğunuza “=” işaretini “sonuç şudur” diye değil, “iki yan aynı ağırlıkta” diye okumasını önerin. Bir yanda bir sayı değişince terazi dengede kalsın diye öbür yanda neyin değişmesi gerektiğini birlikte konuşabilirsiniz.',
    )),
    support(3, 'kontrol', 'Cevabı durumla karşılaştır', 'Yöntem', t(
      'Bir sayı bulunca durumu yeniden oku ve cevabın mantıklı olup olmadığına bak. Örneğin iki kardeşten küçüğü 5’ten 10 yaşına geldiğinde büyüğü 8’den 16’ya değil, 13 yaşına gelir: küçüğün yaşı iki katına çıktı diye büyüğün yaşı da iki katına çıkmaz, aradaki fark hep aynı kalır.',
      'Çocuğunuza bir sayı bulunca durumu yeniden okuyup cevabın mantıklı olup olmadığına bakmasını önerin. Örneğin iki kardeşten küçüğü 5’ten 10 yaşına geldiğinde büyüğü 8’den 16’ya değil, 13 yaşına gelir: küçüğün yaşı iki katına çıktı diye büyüğün yaşı da iki katına çıkmaz, aradaki fark hep aynı kalır.',
    )),
  ],
  facts: sayisalFacts,
  approach: [
    { title: 'Günlük durumlardan sorun', text: 'Mutfakta, alışverişte ya da yolculukta “Bu iki katına çıkınca şu da iki katına çıkar mı?” diye sorun: tarif büyüyünce malzemeler artar ama pişme süresi aynı kalabilir.' },
    { title: 'Nasıl bulduğunu sorun', text: 'Cevabın doğru olup olmadığından önce nasıl bulunduğunu sorun; farkı mı, oranı mı kullandığını birlikte konuşun.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Orantı mı, değil mi?',
      text: t(
        'Bu hafta günlük hayatta iki niceliğin birlikte değiştiği üç durum bul ve her biri için “Biri iki katına çıkınca öteki de iki katına çıkar mı?” sorusunu cevapla. En az birinin orantılı olmamasına dikkat et.',
        'Bu hafta çocuğunuzla günlük hayatta iki niceliğin birlikte değiştiği üç durum bulun ve her biri için “Biri iki katına çıkınca öteki de iki katına çıkar mı?” sorusunu birlikte cevaplayın. En az birinin orantılı olmamasına dikkat edin.',
      ),
    },
    {
      title: 'Tarifi büyüt',
      text: t(
        'Bu hafta sevdiğin bir tarifi iki ya da üç katına göre yeniden yaz. Hangi malzemenin orantılı arttığını, hangi şeyin (ör. fırının ısısı) değişmediğini not et.',
        'Bu hafta çocuğunuzla sevdiği bir tarifi iki ya da üç katına göre yeniden yazın. Hangi malzemenin orantılı arttığını, hangi şeyin (ör. fırının ısısı) değişmediğini birlikte not edin.',
      ),
    },
    {
      title: 'Terazi bulmacaları',
      text: t(
        'Bu hafta “7 + 5 = □ + 4” gibi iki yanı dengede olan üç eşitlik yaz ve birine sor; cevabı terazi gibi düşünerek açıkla.',
        'Bu hafta çocuğunuz “7 + 5 = □ + 4” gibi iki yanı dengede olan üç eşitlik yazsın ve size sorsun; cevabı terazi gibi düşünerek açıklasın.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (iki katı sorusu, tablo, terazi ya da cevabı durumla karşılaştırmak) sayılarla düşünmeni en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun sayılarla düşünmesini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['sayi-dizileri', 'mantiksal-akil-yurutme'],
  nextPurpose: {
    you: 'sayılarla ve sözcüklerle akıl yürütmenin başka yönlerini de görmek',
    parent: 'çocuğunuzun sayılarla ve sözcüklerle akıl yürütmesinin başka yönlerini de görmek',
  },
  links: [],
  sources: [KAYNAK.fernandez2012, KAYNAK.vanDooren2004, KAYNAK.knuth2006],
};

const kupBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (düz bir açınımı zihinde katlamayı) gösterir.',
    'Bu tür sorulara alışkın olmak (ör. kutu ya da kâğıttan küp yapmak, yapı oyunları) sonucu etkileyebilir.',
    'Uzamsal beceriler yaşla ve deneyimle değişir; zikzak açınımlarda zorlanmak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (düz bir açınımı zihinde katlamayı) gösterir.',
    'Bu tür sorulara alışkın olmak (ör. kutu ya da kâğıttan küp yapmak, yapı oyunları) sonucu etkileyebilir.',
    '7–11 yaşındaki çocuklarla yapılan bir çalışmada zihinde katlama, yaş ve sözel beceri hesaba katıldıktan sonra da fen başarısıyla ilişkili bulunmuştur; bu bir ilişkidir, tek başına neden sonuç anlamına gelmez.',
    'Uzamsal beceriler yaşla ve deneyimle değişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine alışkanlıkla ilgili bilgi. */
const kupFacts: InfoBox = {
  ...kupBase,
  items: {
    ...kupBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (düz bir açınımı zihinde katlamayı) gösterir.',
      'Bu tür sorulara alışkın olmak (ör. ambalaj ya da maket yapmak, teknik çizim, yapı oyunları) sonucu etkileyebilir.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const kupAcinimi: TaskRoadmapTemplate = {
  version: 'kup-acinimi-yol-haritasi-1',
  what: {
    student: 'cisimleri zihinde katlayıp canlandırmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun cisimleri zihinde katlayıp canlandırmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'cisimleri zihinde katlayıp canlandırmayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Açınımları zihinde katlamayı ne kolaylaştırır?', parent: 'Çocuğunuzun açınımları zihinde katlamasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, düz bir açınımı zihninde katlayıp oluşan küpün nasıl görüneceğini bulabilmeyi ölçer. Bu beceri; bir kutunun ya da ambalajın nasıl katlanacağını düşünmek, bir eşyayı kurulum çizimine bakarak kurmak, bir cismin farklı yönlerden nasıl göründüğünü kestirmek ve geometride cisimlerin açınımlarıyla çalışmak gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım edebilir.',
    'Bu test, düz bir açınımı zihinde katlayıp oluşan küpün nasıl görüneceğini bulabilmeyi ölçer. Bu beceri; bir kutunun ya da ambalajın nasıl katlanacağını düşünmek, bir eşyayı kurulum çizimine bakarak kurmak, bir cismin farklı yönlerden nasıl göründüğünü kestirmek ve geometride cisimlerin açınımlarıyla çalışmak gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım edebilir.',
  ),
  supports: [
    support(0, 'sabitle', 'Bir yüzü sabitle', 'Yöntem', t(
      'Açınımda bir kareyi küpün önü say ve komşu kareleri onun çevresine tek tek katla. Her adımda yalnızca bir kareyi düşünmek, uzaktaki yüzlerin nereye geleceğini izlemeyi kolaylaştırabilir.',
      'Çocuğunuza açınımda bir kareyi küpün önü saymasını ve komşu kareleri onun çevresine tek tek katlamasını önerin. Her adımda yalnızca bir kareyi düşünmek, uzaktaki yüzlerin nereye geleceğini izlemeyi kolaylaştırabilir.',
    )),
    support(1, 'karsilikli', 'Önce karşılıklı yüzleri bul', 'Yöntem', t(
      'Açınımda düz bir sırada aralarında tek bir kare bulunan iki kare küpte karşı karşıya gelir; düz bir sıranın bir yanına bağlı bir kare ile öbür yanına bağlı bir kare de öyle (Z ya da S biçiminin iki ucu gibi). Karşılıklı iki yüz bir küpte hiçbir zaman yan yana görünmez; seçeneklere bakmadan önce karşılıklı yüzleri bulmak, olamayacak küpleri ayırmana yardım edebilir.',
      'Çocuğunuza şunu gösterebilirsiniz: açınımda düz bir sırada aralarında tek bir kare bulunan iki kare küpte karşı karşıya gelir; düz bir sıranın bir yanına bağlı bir kare ile öbür yanına bağlı bir kare de öyle (Z ya da S biçiminin iki ucu gibi). Karşılıklı iki yüz bir küpte hiçbir zaman yan yana görünmez; seçeneklere bakmadan önce karşılıklı yüzleri bulmak, olamayacak küpleri ayırmasına yardım edebilir.',
    )),
    support(2, 'kes-katla', 'Kes, katla, kontrol et', 'Etkinlik', t(
      'Kareli kâğıda bir küp açınımı çiz ve karelere farklı şekiller, bir tanesine de ok çiz. Kesip katlamadan önce hangi yüzlerin yan yana geleceğini ve okun nereyi göstereceğini tahmin et; sonra katlayıp tahminini kontrol et.',
      'Çocuğunuzla kareli kâğıda bir küp açınımı çizin; karelere farklı şekiller, bir tanesine de ok çizin. Kesip katlamadan önce hangi yüzlerin yan yana geleceğini ve okun nereyi göstereceğini tahmin etmesini isteyin; sonra katlayıp tahmini birlikte kontrol edin.',
    )),
    support(3, 'oyun', 'Uzamsal oyunlar', 'Etkinlik', t(
      'Origami, yapı oyunları, maket yapmak ve kutu katlamak, şekillerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; yine de bir oyunda ustalaşmanın her işe kendiliğinden yansıyacağı söylenemez, asıl kazanç şekillerle düşünmekten keyif almaktır.',
      'Origami, yapı oyunları, maket yapmak ve kutu katlamak, çocuğunuz için şekillerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; yine de bir oyunda ustalaşmanın her işe kendiliğinden yansıyacağı söylenemez, asıl kazanç şekillerle düşünmekten keyif almaktır.',
    )),
  ],
  facts: kupFacts,
  approach: [
    { title: 'Birlikte katlayın', text: 'Kâğıttan bir küp açınımını birlikte kesip katlayın; katlamadan önce hangi yüzlerin karşı karşıya geleceğini tahmin etmesini isteyin ve sonra birlikte bakın.' },
    { title: 'Acele ettirmeyin', text: 'Zor bir soruda uzun düşünmesine izin verin; hızlı olmasından çok, açınımı adım adım katlayarak düşünmesini övün.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Kutuyu aç',
      text: t(
        'Bu hafta boş bir karton kutuyu açmadan önce, kenarlarından açılınca nasıl bir açınım çıkacağını kâğıda çizerek tahmin et. Sonra kutuyu kenarlarından açıp düz bir yere ser ve çizimini kontrol et.',
        'Bu hafta çocuğunuzla boş bir karton kutuyu açmadan önce, kenarlarından açılınca nasıl bir açınım çıkacağını kâğıda çizerek tahmin etmesini isteyin. Sonra kutuyu birlikte açıp düz bir yere serin ve çizimi kontrol edin.',
      ),
    },
    {
      title: 'Zarın açınımı',
      text: t(
        'Bu hafta bir zarı al; kareli kâğıda bir küp açınımı çiz ve zarın her yüzündeki noktaları açınımda doğru kareye yerleştirmeye çalış. Sonra açınımı kesip katla ve zarla karşılaştır.',
        'Bu hafta çocuğunuzla bir zarı alın; kareli kâğıda bir küp açınımı çizip zarın her yüzündeki noktaları açınımda doğru kareye yerleştirmeye çalışın. Sonra açınımı kesip katlayın ve zarla karşılaştırın.',
      ),
    },
    {
      title: 'Kendi sorunu yap',
      text: t(
        'Bu hafta bir açınım çiz ve yüzlerine şekiller koy; altına biri doğru, biri yanlış iki küp çiz. Birine çözdür ve nasıl düşündüğünü sor.',
        'Bu hafta çocuğunuzdan bir açınım çizip yüzlerine şekiller koymasını ve altına biri doğru, biri yanlış iki küp çizerek size çözdürmesini isteyin; sonra rolleri değiştirin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (bir yüzü sabitlemek, karşılıklı yüzleri bulmak ya da kâğıtla denemek) açınımları zihninde katlamanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun açınımları zihinde katlamasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['kagit-katlama', 'zihinde-dondurme'],
  nextPurpose: {
    you: 'katlanan bir kâğıdı zihinde açmayı ve şekilleri zihinde döndürmeyi de görmek',
    parent: 'çocuğunuzun katlanan bir kâğıdı zihinde açmasını ve şekilleri zihinde döndürmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.uttal, KAYNAK.hodgkiss2018, KAYNAK.wai],
};

const ucBoyutluBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (üç boyutlu şekilleri zihinde döndürmeyi) gösterir.',
    'Bu tür sorulara alışkın olmak (ör. yapı oyunları, maket yapmak) sonucu etkileyebilir; zihinde döndürme testleri yeniden çözüldüğünde sonuçlar yükselebilir.',
    'Uzamsal beceriler yaşla ve deneyimle değişir. Yan yatırılmış şekillerde zorlanmak şaşırtıcı değildir.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (üç boyutlu şekilleri zihinde döndürmeyi) gösterir.',
    'Bu tür sorulara alışkın olmak (ör. yapı oyunları, maket yapmak) sonucu etkileyebilir; zihinde döndürme testleri yeniden çözüldüğünde sonuçlar yükselebilir.',
    'Zihinde döndürme becerisinin matematik başarısıyla ilişkisi çocuklukta gösterilmiştir ama bu ilişki yaşa ve matematik konusuna göre değişir; bu bir ilişkidir, tek başına neden sonuç anlamına gelmez.',
    'Uzamsal beceriler yaşla ve deneyimle değişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine yaşla ve alışkanlıkla ilgili bilgi. */
const ucBoyutluFacts: InfoBox = {
  ...ucBoyutluBase,
  items: {
    ...ucBoyutluBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (üç boyutlu şekilleri zihinde döndürmeyi) gösterir.',
      'Bu tür sorulara alışkın olmak (ör. maket yapmak, teknik çizim, yapı oyunları) sonucu etkileyebilir; zihinde döndürme testleri yeniden çözüldüğünde sonuçlar yükselebilir.',
      'Bu tür testlerin sonuçları, 20 yaşın üstündeki yaş gruplarında yaş ilerledikçe düşme eğilimindedir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const ucBoyutluZihindeDondurme: TaskRoadmapTemplate = {
  version: 'uc-boyutlu-zihinde-dondurme-yol-haritasi-1',
  what: {
    student: 'cisimleri zihinde döndürmeyi gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun cisimleri zihinde döndürmeyi gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'cisimleri zihinde döndürmeyi gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Şekilleri zihinde döndürmeyi ne kolaylaştırır?', parent: 'Çocuğunuzun şekilleri zihinde döndürmesini ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, küplerden yapılmış bir şekli zihninde döndürüp başka bir yönden nasıl görüneceğini bulabilmeyi ve onu ayna görüntüsünden ayırabilmeyi ölçer. Bu beceri; bir eşyanın parçalarını kurulum çizimine bakarak birleştirmek, bir cismin arkadan ya da yandan nasıl görüneceğini kestirmek ve geometride cisimlerle çalışmak gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım edebilir.',
    'Bu test, küplerden yapılmış bir şekli zihinde döndürüp başka bir yönden nasıl görüneceğini bulabilmeyi ve onu ayna görüntüsünden ayırabilmeyi ölçer. Bu beceri; bir eşyanın parçalarını kurulum çizimine bakarak birleştirmek, bir cismin arkadan ya da yandan nasıl görüneceğini kestirmek ve geometride cisimlerle çalışmak gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım edebilir.',
  ),
  supports: [
    support(0, 'elle', 'Kur, tahmin et, çevir', 'Etkinlik', {
      student:
        'Küçük küplerden ya da yapı bloklarından bu testteki gibi kollu bir şekil yap. Şekli çevirmeden önce başka bir yönden nasıl görüneceğini tahmin et. Sonra çevirip bak. Tahminini gördüğünle karşılaştırmak, şekillerin dönünce nasıl değiştiğini fark etmeni kolaylaştırabilir.',
      parent:
        'Çocuğunuzla küçük küplerden ya da yapı bloklarından bu testteki gibi kollu bir şekil yapın. Şekli çevirmeden önce başka bir yönden nasıl görüneceğini tahmin etmesini isteyin. Sonra birlikte çevirip bakın. Tahminini gördüğüyle karşılaştırmak, şekillerin dönünce nasıl değiştiğini fark etmesini kolaylaştırabilir.',
      adult:
        'Küçük küplerden ya da yapı bloklarından bu testteki gibi kollu bir şekil yap. Şekli çevirmeden önce başka bir yönden nasıl görüneceğini tahmin et. Sonra çevirip bak. Tahminini gördüğünle karşılaştırmak, şekillerin dönünce nasıl değiştiğini fark etmeni kolaylaştırabilir.',
    }),
    support(1, 'kol', 'Kolları eşleştir', 'Yöntem', t(
      'Bir şekli ayna görüntüsünden ayırmak için bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirdiğini düşün, sonra kalan iki kola bak: döndürülmüş şekilde onlar da aynı yönlere uzanır, ayna görüntüsünde ise biri öbür yana uzanır. Bazı kişiler şeklin bütününü birden döndürür, bazıları parça parça karşılaştırır; ikisi de kullanılabilir.',
      'Çocuğunuza şunu gösterebilirsiniz: bir şekli ayna görüntüsünden ayırmak için bir uçtaki kolu ve ona bağlı kolu üstteki şekildeki yerlerine getirdiğini düşünüp kalan iki kola bakabilir; döndürülmüş şekilde onlar da aynı yönlere uzanır, ayna görüntüsünde ise biri öbür yana uzanır. Bazı kişiler şeklin bütününü birden döndürür, bazıları parça parça karşılaştırır; ikisi de kullanılabilir.',
    )),
    support(2, 'ciz', 'Farklı yönlerden çiz', 'Araç', t(
      'Kurduğun bir şekli önden, yandan ve üstten bakarak kâğıda çiz. Noktalı ya da kareli kâğıt, küplerin kenarlarını düzgün çizmeni kolaylaştırır.',
      'Çocuğunuzdan kurduğu bir şekli önden, yandan ve üstten bakarak kâğıda çizmesini isteyin. Noktalı ya da kareli kâğıt, küplerin kenarlarını düzgün çizmeyi kolaylaştırır.',
    )),
    support(3, 'oyun', 'Uzamsal oyunlar', 'Etkinlik', t(
      'Yapı oyunları, maket ve üç boyutlu yapbozlar şekillerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür. Öte yandan 4 haftada 10 saat Tetris oynamak, aynı süre bir kart oyunu (solitaire) oynamaya göre zihinde döndürmeyi daha çok geliştirmemiştir. Bir oyunda ustalaşmak her işe kendiliğinden yansımaz; asıl kazanç şekillerle düşünmekten keyif almaktır.',
      'Yapı oyunları, maket ve üç boyutlu yapbozlar çocuğunuz için şekillerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür. Öte yandan 4 haftada 10 saat Tetris oynamak, aynı süre bir kart oyunu (solitaire) oynamaya göre zihinde döndürmeyi daha çok geliştirmemiştir. Bir oyunda ustalaşmak her işe kendiliğinden yansımaz; asıl kazanç şekillerle düşünmekten keyif almaktır.',
    )),
  ],
  facts: ucBoyutluFacts,
  approach: [
    { title: 'Birlikte kurun', text: 'Küplerden bir şekil kurun ve çevirmeden önce başka bir yönden nasıl görüneceğini tahmin etmesini isteyin; sonra birlikte çevirip bakın.' },
    { title: 'Acele ettirmeyin', text: 'Zor bir soruda uzun düşünmesine izin verin; hızlı olmasından çok, şekli adım adım düşünerek karşılaştırmasını övün.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Şekil kur',
      text: t(
        'Bu hafta 8–10 küçük küpten ya da yapı bloğundan bu testteki gibi kollu bir şekil yap: kolları üç ayrı yöne (sağa, yukarı ve öne) uzansın, iki uçtaki kolu farklı uzunlukta olsun. Şekli masada çevirmeden önce başka bir yönden nasıl görüneceğini tahmin et, sonra çevirip bak.',
        'Bu hafta çocuğunuzla 8–10 küçük küpten ya da yapı bloğundan bu testteki gibi kollu bir şekil yapın: kolları üç ayrı yöne (sağa, yukarı ve öne) uzansın, iki uçtaki kolu farklı uzunlukta olsun. Şekli masada çevirmeden önce başka bir yönden nasıl görüneceğini tahmin etmesini isteyin, sonra birlikte çevirip bakın.',
      ),
    },
    {
      title: 'Aynasını kur',
      text: t(
        'Bu hafta kurduğun şekli bir aynanın önüne koy ve aynadaki görüntüsünü de küplerle kur. İki şekli ne kadar çevirirsen çevir çakışmadığını kendin gör. (Masaya düz yatabilen bir şeklin ayna görüntüsü ise çevrilince şekille çakışır; bu yüzden kolların üç ayrı yöne uzanması gerekir.)',
        'Bu hafta çocuğunuzla kurduğunuz şekli bir aynanın önüne koyun ve aynadaki görüntüsünü de küplerle kurun. İki şeklin ne kadar çevrilirse çevrilsin çakışmadığını birlikte görün. (Masaya düz yatabilen bir şeklin ayna görüntüsü ise çevrilince şekille çakışır; bu yüzden kolların üç ayrı yöne uzanması gerekir.)',
      ),
    },
    {
      title: 'Hangisi aynı?',
      text: t(
        'Bu hafta kurduğun iki şeklin (şekil ve ayna görüntüsü) farklı yönlerden birkaç fotoğrafını çek ya da çiz. Birine gösterip hangilerinin aynı şekil olduğunu buldur ve nasıl düşündüğünü sor.',
        'Bu hafta çocuğunuzdan kurduğu iki şeklin (şekil ve ayna görüntüsü) farklı yönlerden birkaç fotoğrafını çekmesini ya da çizmesini isteyin; sonra hangilerinin aynı şekil olduğunu size buldursun ve rolleri değiştirin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (şekli elle kurmak, kolları eşleştirmek ya da çizmek) şekilleri zihninde döndürmeni en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun şekilleri zihinde döndürmesini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['zihinde-dondurme', 'kup-acinimi'],
  nextPurpose: {
    you: 'düz şekilleri zihinde döndürmeyi ve bir açınımı zihinde katlamayı da görmek',
    parent: 'çocuğunuzun düz şekilleri zihinde döndürmesini ve bir açınımı zihinde katlamasını da görmek',
  },
  links: [],
  sources: [KAYNAK.gilligan2020, KAYNAK.uttal, KAYNAK.timm2024],
};

const bakisBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (kendini zihinde başka bir yere ve yöne koymayı) gösterir.',
    'Bu tür testler ikinci kez çözüldüğünde hatalar azalabilir; sorulara ve cevap çemberine alışmak sonucu etkiler.',
    'Kendini zihinde başka bir yöne koyma becerisi gençlik yıllarında da gelişmeye devam eder; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (kendini zihinde başka bir yere ve yöne koymayı) gösterir.',
    'Bu tür testler ikinci kez çözüldüğünde hatalar azalabilir; sorulara ve cevap çemberine alışmak sonucu etkiler.',
    'Bakış açısı alma, çocuklukta zihinde döndürmeden daha yavaş gelişir ve ergenlikte de gelişmeye devam eder; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine sonucun akranlarla karşılaştırılmadığı bilgisi. */
const bakisFacts: InfoBox = {
  ...bakisBase,
  items: {
    ...bakisBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; uzamsal becerilerin yalnızca bir yönünü (kendini zihinde başka bir yere ve yöne koymayı) gösterir.',
      'Bu tür testler ikinci kez çözüldüğünde hatalar azalabilir; sorulara ve cevap çemberine alışmak sonucu etkiler.',
      'Sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const MILNE_FACT =
  'Yetişkinlerle yapılan bir araştırmada, bir parçayı bütünün içinden ayırma becerisiyle bütünü görme becerisi arasında anlamlı bir ilişki bulunmamıştır; parçayı ayırabilmek bütünü görememek anlamına gelmez.';
const MILNE_FACT_ADULT =
  'Bir araştırmada, bir parçayı bütünün içinden ayırma becerisiyle bütünü görme becerisi arasında anlamlı bir ilişki bulunmamıştır; parçayı ayırabilmek bütünü görememek anlamına gelmez.';
const gizliBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; görsel algının yalnızca bir yönünü (karmaşık bir çizimde bir şekli bulmayı) gösterir.',
    'Şekil bulma çocukluk boyunca gelişir; kenarları başka çizgilere karışmış şekillerde zorlanmak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; görsel algının yalnızca bir yönünü (karmaşık bir çizimde bir şekli bulmayı) gösterir.',
    MILNE_FACT,
    'Bu tür testlerle okul başarısı arasında orta düzeyde bir ilişki bulunmuştur; bu bir ilişkidir, tek başına neden sonuç anlamına gelmez.',
    'Şekil bulma çocukluk boyunca gelişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine alışkanlıkla ilgili bilgi. */
const gizliFacts: InfoBox = {
  ...gizliBase,
  items: {
    ...gizliBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; görsel algının yalnızca bir yönünü (karmaşık bir çizimde bir şekli bulmayı) gösterir.',
      MILNE_FACT_ADULT,
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const gizliSekiller: TaskRoadmapTemplate = {
  version: 'gizli-sekiller-yol-haritasi-1',
  what: {
    student: 'karmaşık bir görüntünün içinde aradığın bir şekli ya da ayrıntıyı bulmayı nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun karmaşık bir görüntünün içinde aradığı bir şekli ya da ayrıntıyı bulmayı nasıl kolaylaştırabileceği',
    summary: 'karmaşık bir görüntünün içinde bir şekli ya da ayrıntıyı bulmayı kolaylaştıran yollar',
  },
  studyTitle: { you: 'Saklı bir şekli bulmayı ne kolaylaştırır?', parent: 'Çocuğunuzun saklı bir şekli bulmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, karmaşık bir çizimin içine saklanmış basit bir şekli bulabilmeyi ölçer. Bu beceri; iç içe geçmiş geometrik şekilleri birbirinden ayırmak, bir haritada ya da grafikte aradığın bilgiyi bulmak, kalabalık bir tabloda bir sayıyı ya da bir resimde bir ayrıntıyı seçmek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde aramanı düzenlemeye yardım edebilir.',
    'Bu test, karmaşık bir çizimin içine saklanmış basit bir şekli bulabilmeyi ölçer. Bu beceri; iç içe geçmiş geometrik şekilleri birbirinden ayırmak, bir haritada ya da grafikte aranan bilgiyi bulmak, kalabalık bir tabloda bir sayıyı ya da bir resimde bir ayrıntıyı seçmek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde aramasını düzenlemeye yardım edebilir.',
  ),
  supports: [
    support(0, 'parca', 'Ayırt edici bir parçayla başla', 'Yöntem', t(
      'Şeklin en kolay ayırt edilen parçasını (ör. eğik bir kenarı ya da sivri bir köşesini) seç ve önce onu ara; bulunca şeklin öteki kenarlarının da orada olup olmadığına bak. Bir çalışmada şekli parçalarına ayırarak arayan kişilerin saklı şekilleri daha hızlı bulduğu görülmüştür.',
      'Çocuğunuza şunu önerebilirsiniz: şeklin en kolay ayırt edilen parçasını (ör. eğik bir kenarı ya da sivri bir köşesini) seçsin ve önce onu arasın; bulunca şeklin öteki kenarlarının da orada olup olmadığına baksın. Bir çalışmada şekli parçalarına ayırarak arayan kişilerin saklı şekilleri daha hızlı bulduğu görülmüştür.',
    )),
    support(1, 'denetle', 'Yönünü ve köşelerini denetle', 'Alışkanlık', t(
      'Şekle benzeyen bir yer bulunca hemen karar verme: şekil üstteki şekille aynı yöne mi bakıyor, her köşesi ve kenarı yerinde mi? Döndürülmüş, ters çevrilmiş ya da bir köşesi farklı bir şekil aynı şekil sayılmaz. Bu kısa denetim, benzerine aldanmayı önleyebilir.',
      'Çocuğunuza, şekle benzeyen bir yer bulunca hemen karar vermek yerine şeklin üstteki şekille aynı yöne bakıp bakmadığını ve her köşesinin yerinde olup olmadığını denetlemesini önerin. Döndürülmüş, ters çevrilmiş ya da bir köşesi farklı bir şekil aynı şekil sayılmaz. Bu kısa denetim, benzerine aldanmayı önleyebilir.',
    )),
    support(2, 'uzun', 'Uzun çizgilerin içine bak', 'Bilgi', t(
      'Bir şekli saklayan en önemli etkenlerden biri, kenarlarının çizimdeki başka çizgilerle aynı doğrultuda devam etmesidir; bir araştırmada bu tür devam eden kenarlar azaldıkça şekiller çok daha kolay bulunmuştur. Bu yüzden uzun bir çizginin yalnızca bir parçasının şeklin kenarı olabileceğini akılda tutmak işine yarayabilir.',
      'Bir şekli saklayan en önemli etkenlerden biri, kenarlarının çizimdeki başka çizgilerle aynı doğrultuda devam etmesidir; bir araştırmada bu tür devam eden kenarlar azaldıkça şekiller çok daha kolay bulunmuştur. Çocuğunuza, uzun bir çizginin yalnızca bir parçasının şeklin kenarı olabileceğini hatırlatabilirsiniz.',
    )),
    support(3, 'oyun', 'Gözlem oyunları', 'Etkinlik', t(
      'Gizli nesne bulmacaları, iki resim arasındaki farkları bulmak, tangram ve yapboz, görsel ayrıntılarla uğraşmayı keyifli bir etkinliğe dönüştürür. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; yine de bir oyunda ustalaşmanın her işe kendiliğinden yansıyacağı söylenemez, asıl kazanç görsel ayrıntılarla uğraşmaktan keyif almaktır.',
      'Gizli nesne bulmacaları, iki resim arasındaki farkları bulmak, tangram ve yapboz çocuğunuz için görsel ayrıntılarla uğraşmayı keyifli bir etkinliğe dönüştürür. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; yine de bir oyunda ustalaşmanın her işe kendiliğinden yansıyacağı söylenemez, asıl kazanç görsel ayrıntılarla uğraşmaktan keyif almaktır.',
    )),
  ],
  facts: gizliFacts,
  approach: [
    { title: 'Günlük hayatta birlikte arayın', text: 'Bir haritada, krokide ya da kalabalık bir resimde bir şeyi birlikte bulmaya çalışın; bulduğunda nasıl bulduğunu merak edin.' },
    { title: 'Acele ettirmeyin', text: 'Kalabalık bir görüntüde uzun bakmasına izin verin; hızlı olmasından çok, dikkatle ve sabırla bakmasını övün.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Gizli nesneler',
      text: t(
        'Bu hafta bir gizli nesne bulmacası çöz ya da iki resim arasındaki farkları bul. Her birinde nasıl aradığını (önce neye baktığını) bir cümleyle yaz.',
        'Bu hafta çocuğunuzla bir gizli nesne bulmacası çözün ya da iki resim arasındaki farkları bulun. Her birinde nasıl aradığını, önce neye baktığını anlatmasını isteyin.',
      ),
    },
    {
      title: 'Kendi gizli şeklini çiz',
      text: t(
        'Bu hafta kareli kâğıda basit bir şekil çiz, sonra onu kenarlarını uzatan ve içinden geçen başka çizgilerle sakla. Birine bulmasını söyle ve nasıl aradığını sor; sonra rolleri değiştirin.',
        'Bu hafta çocuğunuzdan kareli kâğıda basit bir şekil çizip onu kenarlarını uzatan ve içinden geçen başka çizgilerle saklamasını isteyin. Siz bulmaya çalışın; sonra rolleri değiştirin.',
      ),
    },
    {
      title: 'Parçalardan bütüne',
      text: t(
        'Bu hafta kâğıttan kestiğin birkaç üçgen ve kareyle (ya da bir tangramla) basit bir resim yap; sonra bitmiş resme bakıp hangi parçanın nerede olduğunu göstermeye çalış.',
        'Bu hafta çocuğunuzla kâğıttan kestiğiniz birkaç üçgen ve kareyle (ya da bir tangramla) basit bir resim yapın; sonra bitmiş resme bakıp hangi parçanın nerede olduğunu göstermesini isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (ayırt edici bir parçayla başlamak, yönü ve köşeleri denetlemek ya da uzun çizgilerin içine bakmak) saklı şekilleri bulmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun saklı şekilleri bulmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['kagit-katlama', 'sekil-akil-yurutme'],
  nextPurpose: {
    you: 'katlanan bir kâğıdı zihinde açmayı ve şekillerle akıl yürütmeyi de görmek',
    parent: 'çocuğunuzun katlanan bir kâğıdı zihinde açmasını ve şekillerle akıl yürütmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.hock1974, KAYNAK.deWit2017, KAYNAK.milne2009, KAYNAK.xie2025, KAYNAK.uttal],
};

const bakisAcisiAlma: TaskRoadmapTemplate = {
  version: 'bakis-acisi-alma-yol-haritasi-1',
  what: {
    student: 'kendini zihinde başka bir yere ve yöne koymayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun kendini zihinde başka bir yere ve yöne koymayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'kendini zihinde başka bir yere ve yöne koymayı gerektiren işleri kolaylaştıran yollar',
  },
  studyTitle: { you: 'Yön bulmayı ne kolaylaştırır?', parent: 'Çocuğunuzun yön bulmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, kendini zihinde başka bir yere ve yöne koyup çevredeki nesnelerin oradan hangi yönde kaldığını kestirebilmeyi ölçer. Bu beceri; bir haritaya bakarak hangi yöne yürüyeceğini bulmak, birine yol tarif etmek ya da karşındaki birinin “sağımdaki” dediği şeyi bulmak gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde yönleri karıştırmamana yardım edebilir.',
    'Bu test, kendini zihinde başka bir yere ve yöne koyup çevredeki nesnelerin oradan hangi yönde kaldığını kestirebilmeyi ölçer. Bu beceri; bir haritaya bakarak hangi yöne yürüyeceğini bulmak, birine yol tarif etmek ya da karşısındaki birinin “sağımdaki” dediği şeyi bulmak gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde yönleri karıştırmamasına yardım edebilir.',
  ),
  supports: [
    support(0, 'kendini', 'Kendini oraya koy', 'Yöntem', t(
      'Bir haritada ya da krokide kendini bir yerde hayal ederken o nesnenin yanında durduğunu ve yüzünün bakılan yöne dönük olduğunu düşün, sonra “önüm, arkam, sağım, solum” diye sor. Bu tür testleri çözen kişilerin çoğu, kendini haritanın içinde o nesnenin yanında hayal ederek çözdüğünü söylemiştir.',
      'Çocuğunuza şunu önerebilirsiniz: bir haritada ya da krokide kendini bir yerde hayal ederken o nesnenin yanında durduğunu ve yüzünün bakılan yöne dönük olduğunu düşünsün, sonra “önüm, arkam, sağım, solum” diye sorsun. Bu tür testleri çözen kişilerin çoğu, kendini haritanın içinde o nesnenin yanında hayal ederek çözdüğünü söylemiştir.',
    )),
    support(1, 'harita', 'Haritayı yoluna çevir', 'Araç', t(
      'İnsanlar bir haritanın yukarısını kendi baktıkları yön sanma eğilimindedir; harita başka bir yöne dönükse yönleri karıştırmak kolaylaşır. Bir haritayı kullanırken onu, yürüdüğün yön haritanın yukarısında kalacak biçimde çevirmek bu karışıklığı azaltabilir. Gerçek bir yolda yön bulurken haritayı ya da telefonu çevirmekte hiçbir sakınca yoktur; testte ise beceri ölçüldüğü için ekran çevrilmez.',
      'İnsanlar bir haritanın yukarısını kendi baktıkları yön sanma eğilimindedir; harita başka bir yöne dönükse yönleri karıştırmak kolaylaşır. Çocuğunuza bir haritayı kullanırken onu, yürüdüğü yön haritanın yukarısında kalacak biçimde çevirmesini önerebilirsiniz. Gerçek bir yolda yön bulurken haritayı ya da telefonu çevirmekte hiçbir sakınca yoktur; testte ise beceri ölçüldüğü için ekran çevrilmez.',
    )),
    support(2, 'kimin', 'Kimin sağı?', 'Alışkanlık', t(
      'Biri “sağdaki” dediğinde kendi sağını mı yoksa senin sağını mı kastettiğini sor; sen tarif ederken de kimin sağını söylediğini belirt (“senin sağında”). Bir çalışmada, karşısındakinin “sağdaki” sözünü daha çok onun bakış açısından anlayan kişilerin bakış açısı alma testindeki hataları daha küçük bulunmuştur. Bu bir ilişki bulgusudur; bu alışkanlığın beceriyi geliştirdiği gösterilmemiştir.',
      'Çocuğunuza, biri “sağdaki” dediğinde konuşanın kendi sağını mı yoksa onun sağını mı kastettiğini sormasını, kendisi tarif ederken de kimin sağını söylediğini belirtmesini (“senin sağında”) önerin. Bir çalışmada, karşısındakinin “sağdaki” sözünü daha çok onun bakış açısından anlayan kişilerin bakış açısı alma testindeki hataları daha küçük bulunmuştur. Bu bir ilişki bulgusudur; bu alışkanlığın beceriyi geliştirdiği gösterilmemiştir.',
    )),
    support(3, 'oyun', 'Yön oyunları', 'Etkinlik', t(
      'Bir yerin krokisini çizip yönleri tahmin etmek, gözü kapalı bir eşyanın yerini göstermek ya da harita kullanılan oyunlar, yönlerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; öte yandan bir oyunda ustalaşmak her işe kendiliğinden yansımaz.',
      'Bir yerin krokisini çizip yönleri tahmin etmek, gözü kapalı bir eşyanın yerini göstermek ya da harita kullanılan oyunlar çocuğunuz için yönlerle düşünmeyi keyifli bir uğraş hâline getirir. Pek çok araştırmayı birlikte inceleyen bir çalışmada uzamsal becerilerin alıştırmayla gelişebildiği görülmüştür; öte yandan bir oyunda ustalaşmak her işe kendiliğinden yansımaz.',
    )),
  ],
  facts: bakisFacts,
  approach: [
    { title: 'Haritayı ona verin', text: 'Bir gezide ya da yeni bir yerde haritayı ona verin; nerede olduğunuzu ve hangi yöne yürüyeceğinizi birlikte bulun.' },
    { title: 'Acele ettirmeyin', text: 'Sağ ile solu karıştırdığında hemen düzeltmek yerine kendini o yöne dönmüş hayal etmesini ve yeniden düşünmesini isteyin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Krokiyle tahmin et',
      text: t(
        'Bu hafta yaşadığın evin ya da bir odanın basit bir krokisini (yukarıdan görünüşünü) çiz ve üç eşyayı işaretle. Krokide bir eşyanın yanında durup başka bir eşyaya baktığını hayal et; üçüncüsünün hangi yönde kaldığını önce tahmin et, sonra gerçekten o yere gidip bak.',
        'Bu hafta çocuğunuzla evin ya da bir odanın basit bir krokisini (yukarıdan görünüşünü) çizin ve üç eşyayı işaretleyin. Krokide bir eşyanın yanında durup başka bir eşyaya baktığını hayal etmesini, üçüncüsünün hangi yönde kaldığını önce tahmin etmesini isteyin; sonra birlikte o yere gidip bakın.',
      ),
    },
    {
      title: 'Haritayla yürü',
      text: t(
        'Bu hafta bildiğin, trafikten uzak ve güvenli bir yolda kâğıttaki ya da telefondaki haritayı aç ve her dönemeçte sağa mı sola mı döneceğini haritaya bakarak tahmin et. Haritanın yukarısı yürüdüğün yön değilken ve haritayı yürüdüğün yöne çevirdiğinde işin nasıl değiştiğine dikkat et.',
        'Bu hafta çocuğunuzla bildiğiniz, trafikten uzak ve güvenli bir yolda kâğıttaki ya da telefondaki haritayı açın; her dönemeçte sağa mı sola mı döneceğinizi haritaya bakarak tahmin etmesini isteyin. Haritanın yukarısı yürüdüğünüz yön değilken ve harita yürüdüğünüz yöne çevrildiğinde işin nasıl değiştiğini birlikte konuşun.',
      ),
    },
    {
      title: 'Karşıdan tarif et',
      text: t(
        'Bu hafta biriyle karşılıklı otur ve aranıza birkaç eşya koy. Sırayla bir eşyanın yerini karşındakinin bakış açısıyla tarif edin (“senin sağ önünde”); karşındaki eşyayı bulsun, sonra rolleri değiştirin.',
        'Bu hafta çocuğunuzla karşılıklı oturun ve aranıza birkaç eşya koyun. Sırayla bir eşyanın yerini karşıdakinin bakış açısıyla tarif edin (“senin sağ önünde”); karşıdaki eşyayı bulsun, sonra rolleri değiştirin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (kendini o yöne koymak, haritayı yoluna çevirmek ya da kimin sağı olduğunu söylemek) yön bulmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun yön bulmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['uc-boyutlu-zihinde-dondurme', 'zihinde-dondurme'],
  nextPurpose: {
    you: 'şekilleri zihinde döndürme becerisini de görmek',
    parent: 'çocuğunuzun şekilleri zihinde döndürme becerisini de görmek',
  },
  links: [],
  sources: [KAYNAK.gunalp2021, KAYNAK.he2022, KAYNAK.loy2023, KAYNAK.friedman2020, KAYNAK.frick2023, KAYNAK.brucato2022, KAYNAK.uttal],
};

const dusunerekBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; düşünerek karar vermenin yalnızca bir yönünü (kısa sorulardaki tuzakları fark etmeyi) gösterir.',
    'Bu tür sorularda ilk akla gelen cevap çok güçlüdür; birçok kişi bu cevabı verir.',
    'Bu tür soruları ya da benzerlerini daha önce görmüş olmak sonucu yükseltebilir.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; düşünerek karar vermenin yalnızca bir yönünü (kısa sorulardaki tuzakları fark etmeyi) gösterir.',
    'Okul çağındaki çocuklarla yapılan bir çalışmada bu tür sorulardaki sonuçlar, yaş hesaba katıldıktan sonra da fen ve matematik kavramlarını anlamayla ilişkili bulunmuştur; bu bir ilişkidir, tek başına neden sonuç anlamına gelmez.',
    'Bu tür soruları ya da benzerlerini daha önce görmüş olmak sonucu yükseltebilir.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine sonucun zaman içindeki kararlılığı. */
const dusunerekFacts: InfoBox = {
  ...dusunerekBase,
  items: {
    ...dusunerekBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; düşünerek karar vermenin yalnızca bir yönünü (kısa sorulardaki tuzakları fark etmeyi) gösterir.',
      'Bu tür sorularda ilk akla gelen cevap çok güçlüdür; birçok kişi bu cevabı verir. Bu tür soruları ya da benzerlerini daha önce görmüş olmak sonucu yükseltebilir.',
      'Bu tür sorulardaki sonuçlar yıllar içinde oldukça kararlı bulunmuştur; yine de tek bir oturuma dayanarak kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const dusunerekKararVerme: TaskRoadmapTemplate = {
  version: 'dusunerek-karar-verme-yol-haritasi-1',
  what: {
    student: 'ilk akla gelen cevabı denetlemeyi gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun ilk akla gelen cevabı denetlemeyi gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'ilk akla gelen cevabı denetlemeyi kolaylaştıran yollar',
  },
  studyTitle: { you: 'İlk akla gelen cevabı denetlemeyi ne kolaylaştırır?', parent: 'Çocuğunuzun ilk akla gelen cevabı denetlemesini ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, ilk akla gelen ama yanlış olan cevabı fark edip durup düşünerek doğru cevaba ulaşabilmeyi ölçer. Bu beceri; bir indirimin gerçekten ucuz olup olmadığını hesaplamak, bir haberin ya da iddianın doğru olup olmadığını sorgulamak, bir yönergeyi yanlış anlamamak ve aceleyle karar vermemek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım edebilir.',
    'Bu test, ilk akla gelen ama yanlış olan cevabı fark edip durup düşünerek doğru cevaba ulaşabilmeyi ölçer. Bu beceri; bir indirimin gerçekten ucuz olup olmadığını hesaplamak, bir haberin ya da iddianın doğru olup olmadığını sorgulamak, bir yönergeyi yanlış anlamamak ve aceleyle karar vermemek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım edebilir.',
  ),
  supports: [
    support(0, 'sina', 'Cevabı sına', 'Yöntem', t(
      'Bir cevap çok çabuk geldiyse onu vermeden önce sorudaki bilgilere geri koy ve uyuyor mu diye bak. Örneğin bir sopa ile bir top birlikte 110 lira ve sopa toptan 100 lira pahalıysa “top 10 lira” cevabını sınamak için sopanın fiyatını bul: 110 lira olur ve ikisi birlikte 120 lira eder; demek ki cevap yanlış.',
      'Çocuğunuza, bir cevap çok çabuk geldiyse onu vermeden önce sorudaki bilgilere geri koyup uyup uymadığına bakmasını önerin. Örneğin bir sopa ile bir top birlikte 110 lira ve sopa toptan 100 lira pahalıysa “top 10 lira” cevabını sınamak için sopanın fiyatı bulunur: 110 lira olur ve ikisi birlikte 120 lira eder; demek ki cevap yanlış.',
    )),
    support(1, 'oku', 'Soruyu sonuna kadar oku', 'Yöntem', t(
      'Kısa sorularda tuzak bazen tek bir sözcüktedir: “hariç”, “en az”, “daha fazla” gibi. Soruyu sonuna kadar oku ve sorunun gerçekten ne istediğini kendi cümlelerinle söyle; bazen soru, olmayan bir şeyi varmış gibi de sorabilir.',
      'Çocuğunuza kısa sorularda tuzağın bazen tek bir sözcükte (“hariç”, “en az”, “daha fazla” gibi) olduğunu gösterin. Soruyu sonuna kadar okuyup sorunun ne istediğini kendi cümleleriyle söylemesi yardımcı olabilir; bazen soru, olmayan bir şeyi varmış gibi de sorabilir.',
    )),
    support(2, 'suphe', 'Şüphe sesini dinle', 'Bilgi', t(
      'Bir araştırmada ilk akla gelen yanlış cevabı verenlerin bile bu cevaba, tuzaksız eş sorudaki cevaplarından daha az güvendiği görülmüştür. Bir cevaptan tam emin değilsen bu his bir şeyin gözden kaçtığını gösterebilir: soruyu bir kez daha oku.',
      'Bir araştırmada ilk akla gelen yanlış cevabı verenlerin bile bu cevaba, tuzaksız eş sorudaki cevaplarından daha az güvendiği görülmüştür. Çocuğunuza, bir cevaptan tam emin olmadığında bu hissin bir şeyin gözden kaçtığını gösterebileceğini ve soruyu bir kez daha okumasını söyleyebilirsiniz.',
    )),
    support(3, 'ciz', 'Çiz ya da tablo yap', 'Araç', t(
      'Sayılarla ilgili kısa sorularda küçük bir çizim (ör. bir çitin direkleri ve aralarındaki boşluklar) ya da birkaç satırlık bir tablo, ilk akla gelen cevabın soruya uyup uymadığını görmeyi kolaylaştırabilir.',
      'Sayılarla ilgili kısa sorularda küçük bir çizim (ör. bir çitin direkleri ve aralarındaki boşluklar) ya da birkaç satırlık bir tablo, çocuğunuzun ilk akla gelen cevabın soruya uyup uymadığını görmesini kolaylaştırabilir.',
    )),
  ],
  facts: dusunerekFacts,
  approach: [
    { title: 'Hemen düzeltmeyin, sorun', text: 'Çocuğunuz bir bilmecede ilk akla gelen cevabı verdiğinde hemen düzeltmek yerine “Bu cevabı nasıl sınarsın?” diye sorun.' },
    { title: 'Yanılmayı olağan görün', text: 'Tuzaklı bilmeceleri birlikte çözün ve yanılmanın herkesin başına geldiğini konuşun; önemli olan cevabı sınamayı alışkanlık edinmektir.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Tuzaklı bilmeceler',
      text: t(
        'Bu hafta üç tuzaklı bilmece bul ya da kendin uydur; her birinde önce ilk akla gelen cevabı yaz, sonra cevabı sorudaki bilgilerle sına.',
        'Bu hafta çocuğunuzla üç tuzaklı bilmece bulun ya da uydurun; her birinde önce ilk akla gelen cevabı yazmasını, sonra cevabı sorudaki bilgilerle sınamasını isteyin.',
      ),
    },
    {
      title: 'Cevabı geri koy',
      text: t(
        'Bu hafta sayılarla ilgili kısa bir soruyu çözünce cevabını sorudaki bilgilere geri koy ve her bilgiye uyup uymadığına bak.',
        'Bu hafta çocuğunuz sayılarla ilgili kısa bir soruyu çözünce cevabını sorudaki bilgilere geri koysun ve her bilgiye uyup uymadığına birlikte bakın.',
      ),
    },
    {
      title: 'Anlamı değiştiren sözcükler',
      text: t(
        'Bu hafta okuduğun yönergelerde ve sorularda anlamı değiştiren sözcükleri (“hariç”, “en az”, “daha fazla” gibi) bul ve altını çiz.',
        'Bu hafta çocuğunuzla okuduğunuz yönergelerde ve sorularda anlamı değiştiren sözcükleri (“hariç”, “en az”, “daha fazla” gibi) bulup altını çizin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (cevabı sınamak, soruyu sonuna kadar okumak, şüphe sesini dinlemek ya da çizmek) ilk akla gelen cevabı denetlemeni en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun ilk akla gelen cevabı denetlemesini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['mantiksal-akil-yurutme', 'sayisal-akil-yurutme'],
  nextPurpose: {
    you: 'akıl yürütmenin başka yönlerini de görmek',
    parent: 'çocuğunuzun akıl yürütmesinin başka yönlerini de görmek',
    general: true,
  },
  links: [],
  sources: [KAYNAK.deNeysBats, KAYNAK.youngShtulman2020, KAYNAK.stagnaro2018, KAYNAK.bialek2018],
};

const kuleBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; planlamanın yalnızca bir yönünü (topları en az hamlede hedef düzene getirmeyi) gösterir.',
    'Problemler uzadıkça en kısa yolu bulmak genellikle zorlaşır; uzun problemlerde fazla hamle yapmak olağandır.',
    'Planlama becerisi ergenlik boyunca gelişmeyi sürdürür; en zor problemlerde bu gelişme 20’li yaşların başına kadar sürebilir.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; planlamanın yalnızca bir yönünü (topları en az hamlede hedef düzene getirmeyi) gösterir.',
    'Planlama becerisi ergenlik boyunca gelişmeyi sürdürür: kolay problemlerde 17 yaş dolayında yetişkin düzeyine ulaşılırken en zor problemlerde 20’li yaşların başına kadar ilerleme görülmüştür. Sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
    'Bu görevi daha önce çözmüş olmak sonucu etkileyebilir; tekrar uygulamada süreler kısalır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine yaşla, eğitimle ve tekrarla ilgili bilgi. */
const kuleFacts: InfoBox = {
  ...kuleBase,
  items: {
    ...kuleBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; planlamanın yalnızca bir yönünü (topları en az hamlede hedef düzene getirmeyi) gösterir.',
      '40–80 yaş arasındaki kişilerle yapılan geniş bir çalışmada bu tür bir görevdeki sonuçlar yaş ilerledikçe düşmüş ve eğitim düzeyiyle ilişkili bulunmuştur. Bu görevi daha önce çözmüş olmak da sonucu etkileyebilir.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const planlamaKuleGorevi: TaskRoadmapTemplate = {
  version: 'planlama-kule-gorevi-yol-haritasi-1',
  what: {
    student: 'birkaç adımı önceden düşünmeyi gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun birkaç adımı önceden düşünmeyi gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'birkaç adımı önceden düşünmeyi kolaylaştıran yollar',
  },
  studyTitle: { you: 'Önceden plan yapmayı ne kolaylaştırır?', parent: 'Çocuğunuzun önceden plan yapmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Planlama, bir hedefe ulaşmak için gereken adımları başlamadan önce kafada sıraya koyabilmektir. Bir yolculuğa hazırlanmak, bir tarifin adımlarını sıraya koymak ya da bir oyunda birkaç hamle sonrasını düşünmek de planlama ister. Bu test planlamanın yalnızca bir yönünü, topları en az hamleyle hedef düzene getirmeyi ölçer. Aşağıdaki yollar, birkaç adımlı işlerde plan yapmayı kolaylaştırmaya yardım edebilir.',
    'Planlama, bir hedefe ulaşmak için gereken adımları başlamadan önce kafada sıraya koyabilmektir. Bir yolculuğa hazırlanmak, bir tarifin adımlarını sıraya koymak ya da bir oyunda birkaç hamle sonrasını düşünmek de planlama ister. Bu test planlamanın yalnızca bir yönünü, topları en az hamleyle hedef düzene getirmeyi ölçer. Aşağıdaki yollar, çocuğunuzun birkaç adımlı işlerde plan yapmasını kolaylaştırmaya yardım edebilir.',
  ),
  supports: [
    support(0, 'once', 'Önce kafanda dene', 'Yöntem', t(
      'Birkaç adımlı bir işe başlamadan önce ilk iki üç adımı kafanda sırayla dene: “Önce bunu yaparsam ne olur, sonra ne yapmam gerekir?” Bir çalışmada, başlamadan önce tam plan yapması söylenen kişiler bu tür problemlerin daha çoğunu çözmüştür; başka bir çalışmada bu fark görülmemiştir. Araştırmalar farklı sonuçlar bulduğu için bunu kendin dene ve birkaç adımı önceden düşünmenin sana yardım edip etmediğine bak.',
      'Çocuğunuza birkaç adımlı bir işe başlamadan önce ilk iki üç adımı kafasında sırayla denemesini önerin: “Önce bunu yaparsam ne olur, sonra ne yapmam gerekir?” Bir çalışmada, başlamadan önce tam plan yapması söylenen kişiler bu tür problemlerin daha çoğunu çözmüştür; başka bir çalışmada bu fark görülmemiştir. Araştırmalar farklı sonuçlar bulduğu için bunu birlikte deneyin ve birkaç adımı önceden düşünmenin ona yardım edip etmediğine bakın.',
    )),
    support(1, 'geri', 'Hedeften geriye bak', 'Yöntem', t(
      'Bazen hedefe bakıp geriye doğru düşünmek yolu kısaltır: “Hedefe ulaşmadan hemen önce ne olmalı?” Kule görevinde, hedefte bir çubuğun en altındaki top, üstündekilerden önce yerine konmalıdır. Günlük işlerde de en son ne olacağını düşünüp oradan geriye doğru adımları sıralamak işe yarayabilir; örneğin bir yere zamanında varmak için ne zaman yola çıkman gerektiğini bulmak gibi.',
      'Bazen hedefe bakıp geriye doğru düşünmek yolu kısaltır: “Hedefe ulaşmadan hemen önce ne olmalı?” Kule görevinde, hedefte bir çubuğun en altındaki top, üstündekilerden önce yerine konmalıdır. Çocuğunuza günlük işlerde de en son ne olacağını düşünüp oradan geriye doğru adımları sıralamasını önerebilirsiniz; örneğin bir yere zamanında varmak için ne zaman yola çıkmak gerektiğini bulmak gibi.',
    )),
    support(2, 'ara', 'Ara hedefler koy', 'Yöntem', t(
      'Uzun bir işi birkaç ara hedefe böl ve bir seferde yalnızca bir sonraki ara hedefi düşün. Bir araştırmada çoğu kişinin kafasında iki ara adımı doğru planlayabildiği, üçüncü adımda zorlandığı görülmüştür; çok adımlı işleri küçük parçalara bölmek kafadaki yükü azaltabilir.',
      'Çocuğunuza uzun bir işi birkaç ara hedefe bölmesini ve bir seferde yalnızca bir sonraki ara hedefi düşünmesini önerin. Bir araştırmada çoğu kişinin kafasında iki ara adımı doğru planlayabildiği, üçüncü adımda zorlandığı görülmüştür; çok adımlı işleri küçük parçalara bölmek kafadaki yükü azaltabilir.',
    )),
    support(3, 'yaz', 'Planı yaz', 'Araç', t(
      'Çok adımlı bir işte adımları kısa bir listeye yaz ve bitirdikçe işaretle. Plan kâğıtta durunca hepsini aynı anda aklında tutmak zorunda kalmazsın; bir adım aksarsa listeye bakıp planı değiştirebilirsin.',
      'Çocuğunuza çok adımlı bir işte adımları kısa bir listeye yazmasını ve bitirdikçe işaretlemesini önerin. Plan kâğıtta durunca hepsini aynı anda aklında tutmak zorunda kalmaz; bir adım aksarsa listeye bakıp planı değiştirebilir.',
    )),
  ],
  facts: kuleFacts,
  approach: [
    { title: 'Çözümü söylemeyin, sorun', text: 'Çocuğunuz bir bulmacada ya da bir işte takıldığında çözümü göstermek yerine “İlk adımın ne olur, sonra ne olur?” diye sorun.' },
    { title: 'Düşünmeye zaman tanıyın', text: 'Plan yapmak zaman ister; çok adımlı bir işe başlamadan önce düşünmesine fırsat verin ve acele ettirmeyin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Adımları söyle',
      text: t(
        'Bu hafta birkaç adımlı bir işe (ör. bir çanta hazırlamak, bir tarifi uygulamak ya da bir oyunu kurmak) başlamadan önce adımları sırayla yüksek sesle söyle, sonra başla.',
        'Bu hafta çocuğunuzla birkaç adımlı bir işe (ör. bir çanta hazırlamak, bir tarifi uygulamak ya da bir oyunu kurmak) başlamadan önce adımları sırayla yüksek sesle söylemeyi deneyin.',
      ),
    },
    {
      title: 'Geriye doğru',
      text: t(
        'Bu hafta bir yere zamanında varman gereken bir gün, varış saatinden geriye doğru giderek ne zaman hazırlanmaya ve yola çıkmaya başlaman gerektiğini hesapla.',
        'Bu hafta bir yere zamanında varmanız gereken bir gün, çocuğunuzla varış saatinden geriye doğru giderek ne zaman hazırlanmaya ve yola çıkmaya başlamak gerektiğini birlikte hesaplayın.',
      ),
    },
    {
      title: 'Bir hamle sonrası',
      text: t(
        'Bu hafta dama ya da satranç gibi bir oyunda her hamleden önce “Bunu yaparsam sonra ne olur?” diye bir sonraki hamleyi de düşün.',
        'Bu hafta çocuğunuzla dama ya da satranç gibi bir oyun oynayın; her hamleden önce “Bunu yaparsan sonra ne olur?” diye sorun.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (önce kafanda denemek, hedeften geriye bakmak, ara hedefler koymak ya da planı yazmak) birkaç adımlı işlerde işini en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun birkaç adımlı işlerini en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['kural-degistirme', 'dur-git-gorevi'],
  nextPurpose: {
    you: 'planlamayla birlikte çalışan başka zihinsel becerileri de görmek',
    parent: 'çocuğunuzun planlamayla birlikte çalışan başka zihinsel becerilerini de görmek',
    general: true,
  },
  links: [],
  sources: [KAYNAK.unterrainer2003, KAYNAK.phillips2001, KAYNAK.albertSteinberg2011, KAYNAK.unterrainer2019, KAYNAK.schumacher2026],
};

const kelimeListesiBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; belleğin yalnızca bir yönünü (yazılı bir kelime listesini birkaç dakika içinde öğrenip hatırlamayı) gösterir.',
    'On beş kelimenin hepsini hatırlamak herkes için zordur; ilk denemede kelimelerin bir kısmını unutmak olağandır.',
    'Liste öğrenme çocukluk boyunca gelişir; küçük yaşta daha az kelime hatırlamak olağandır.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; belleğin yalnızca bir yönünü (yazılı bir kelime listesini birkaç dakika içinde öğrenip hatırlamayı) gösterir.',
    'On beş kelimenin hepsini hatırlamak herkes için zordur; ilk denemede kelimelerin bir kısmını unutmak olağandır.',
    'Liste öğrenme çocukluk boyunca gelişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle olmadan. */
const kelimeListesiFacts: InfoBox = {
  ...kelimeListesiBase,
  items: {
    ...kelimeListesiBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; belleğin yalnızca bir yönünü (yazılı bir kelime listesini birkaç dakika içinde öğrenip hatırlamayı) gösterir.',
      'On beş kelimenin hepsini hatırlamak herkes için zordur; ilk denemede kelimelerin bir kısmını unutmak olağandır.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const kelimeListesi: TaskRoadmapTemplate = {
  version: 'kelime-listesi-yol-haritasi-1',
  what: {
    student: 'bir şeyi öğrenip aklında tutmayı nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun bir şeyi öğrenip aklında tutmasını nasıl kolaylaştırabileceği',
    summary: 'öğrendiğini aklında tutmayı kolaylaştıran yollar',
  },
  studyTitle: { you: 'Öğrendiğini aklında tutmayı ne kolaylaştırır?', parent: 'Çocuğunuzun öğrendiğini aklında tutmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu görev, tekrarlarla bir kelime listesini öğrenebilmeyi ve öğrendiğini hatırlayabilmeyi ölçer. Bu beceri; bir alışveriş listesini, yeni tanıştığın kişilerin adlarını ya da yeni öğrendiğin kelimeleri akılda tutmak gibi durumlarda kullanılır. Aşağıdaki yollar, öğrendiklerini aklında tutmana yardım edebilir.',
    'Bu görev, tekrarlarla bir kelime listesini öğrenebilmeyi ve öğrendiğini hatırlayabilmeyi ölçer. Bu beceri; bir alışveriş listesini, yeni tanışılan kişilerin adlarını ya da yeni öğrenilen kelimeleri akılda tutmak gibi durumlarda kullanılır. Aşağıdaki yollar, çocuğunuzun öğrendiklerini aklında tutmasına yardım edebilir.',
  ),
  supports: [
    support(0, 'tekrar', 'İçinden tekrar et', 'Yöntem', {
      ...t(
        'Bir liste ya da art arda gelen bilgiler öğrenirken her yeni bilgiyi öncekilerle birlikte içinden tekrar et (ör. “ekmek, süt”; sonra “ekmek, süt, yumurta”). Araştırmalar, listenin başındaki bilgileri hatırlamanın bu tür tekrarla ilgili olduğunu ve bu tekrarın çocukluk boyunca geliştiğini gösteriyor.',
        'Çocuğunuza bir liste ya da art arda gelen bilgiler öğrenirken her yeni bilgiyi öncekilerle birlikte içinden tekrar etmesini önerin (ör. “ekmek, süt”; sonra “ekmek, süt, yumurta”). Araştırmalar, listenin başındaki bilgileri hatırlamanın bu tür tekrarla ilgili olduğunu ve bu tekrarın çocukluk boyunca geliştiğini gösteriyor.',
      ),
      adult:
        'Bir liste ya da art arda gelen bilgiler öğrenirken her yeni bilgiyi öncekilerle birlikte içinden tekrar et (ör. “ekmek, süt”; sonra “ekmek, süt, yumurta”). Araştırmalar, listenin başındaki bilgileri hatırlamanın bu tür tekrarla ilgili olduğunu gösteriyor.',
    }),
    support(1, 'yokla', 'Bakmadan hatırla', 'Alışkanlık', t(
      'Bir şeyi öğrenmek istediğinde yalnızca yeniden okumak yerine bakmadan hatırlamaya çalış, sonra kontrol et. 18–24 yaş arası kişilerle yapılan bir araştırmada, bir metni okuduktan sonra bakmadan hatırlamaya çalışanlar metni yeniden okuyanlardan iki gün ve bir hafta sonra daha çok şey hatırladı; beş dakika sonra yapılan ölçümde ise yeniden okumak biraz daha iyiydi.',
      'Çocuğunuza öğrenmek istediği bir şeyi yalnızca yeniden okumak yerine bakmadan hatırlamaya çalışmasını, sonra kontrol etmesini önerin. 18–24 yaş arası kişilerle yapılan bir araştırmada, bir metni okuduktan sonra bakmadan hatırlamaya çalışanlar metni yeniden okuyanlardan iki gün ve bir hafta sonra daha çok şey hatırladı; beş dakika sonra yapılan ölçümde ise yeniden okumak biraz daha iyiydi.',
    )),
    support(2, 'aralik', 'Tekrarları günlere yay', 'Alışkanlık', t(
      'Bir şeyi uzun süre aklında tutmak istiyorsan tekrarlarını art arda değil, aralıklı yap (ör. bugün, iki gün sonra ve bir hafta sonra). Kelime ve bilgi hatırlama üzerine yapılmış birçok çalışmayı birleştiren bir inceleme, aralıklı tekrarın art arda tekrardan tutarlı biçimde daha iyi sonuç verdiğini gösteriyor.',
      'Çocuğunuzun akılda tutmak istediği bir şeyi art arda değil, aralıklı tekrar etmesine destek olun (ör. bugün, iki gün sonra ve bir hafta sonra). Kelime ve bilgi hatırlama üzerine yapılmış birçok çalışmayı birleştiren bir inceleme, aralıklı tekrarın art arda tekrardan tutarlı biçimde daha iyi sonuç verdiğini gösteriyor.',
    )),
    support(3, 'not', 'Önemli listeleri yaz', 'Araç', t(
      'Bir alışveriş listesi, yapılacak işler ya da bir tarifin malzemeleri gibi kesin hatırlanması gereken listeleri yaz ya da telefonuna not al. Böylece aklını ezberlemeye değil, işin kendisine ayırırsın; not almak bir eksiklik değil, akıllıca bir yoldur.',
      'Çocuğunuzu, yapılacak işler ya da bir etkinlik için gerekenler gibi kesin hatırlanması gereken listeleri yazmaya teşvik edin. Böylece aklını ezberlemeye değil, işin kendisine ayırır; not almak bir eksiklik değil, akıllıca bir yoldur.',
    )),
  ],
  facts: kelimeListesiFacts,
  approach: [
    { title: 'Anlatmasını isteyin', text: 'Gün sonunda okuduğu ya da öğrendiği bir şeyi size kendi sözleriyle anlatmasını isteyin; bakmadan hatırlamak, öğrendiğini pekiştirir.' },
    { title: 'Kısa ve aralıklı', text: 'Ezberlemesi gereken bir şeyi tek seferde uzun uzun değil, birkaç güne yayılmış kısa tekrarlarla çalışmasına destek olun.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'İçinden tekrar',
      text: t(
        'Bu hafta bir alışveriş listesini ya da yapılacak üç dört işi, her yeni maddeyi öncekilerle birlikte içinden tekrar ederek aklında tut; sonra listeye bakıp kontrol et.',
        'Bu hafta çocuğunuzla bir alışveriş listesini ya da yapılacak üç dört işi, her yeni maddeyi öncekilerle birlikte tekrar ederek akılda tutmayı deneyin; sonra listeye bakıp birlikte kontrol edin.',
      ),
    },
    {
      title: 'Bakmadan hatırla',
      text: t(
        'Bu hafta her gün, o gün okuduğun ya da öğrendiğin bir şeyi bakmadan birkaç cümleyle hatırlamaya çalış; sonra bakıp kontrol et.',
        'Bu hafta çocuğunuzdan her gün, o gün okuduğu ya da öğrendiği bir şeyi bakmadan birkaç cümleyle anlatmasını isteyin.',
      ),
    },
    {
      title: 'Aralıklı tekrar',
      text: t(
        'Bu hafta aklında tutmak istediğin bir şeyi (ör. yeni kelimeler ya da bir şiir) seç; bugün, iki gün sonra ve bir hafta sonra kısa kısa tekrar et.',
        'Bu hafta çocuğunuzla akılda tutmak istediği bir şeyi (ör. yeni kelimeler ya da bir şiir) seçin; bugün, iki gün sonra ve bir hafta sonra kısa kısa tekrar etmeyi deneyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun bir şeyi aklında tutmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun bir şeyi aklında tutmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['geriye-donuk-hatirlama', 'dikkat-ve-bellek', 'kelime-bilgisi'],
  nextPurpose: {
    you: 'belleğinin ve sözel becerilerinin başka yönlerini de görmek',
    parent: 'çocuğunuzun belleğinin ve sözel becerilerinin başka yönlerini de görmek',
    general: true,
  },
  links: [],
  sources: [KAYNAK.oliveira, KAYNAK.lehmann, KAYNAK.roediger, KAYNAK.cepeda],
};

const hesaplaBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; çalışma belleğinin yalnızca bir yönünü (araya işlemler girerken harfleri sırasıyla akılda tutmayı) gösterir.',
    'Tek bir görevin sonucu, çalışma belleğinin yanında o göreve özgü etkileri de taşır; çalışma belleğini daha iyi görmek için farklı türden görevler birlikte kullanılır.',
    '10–86 yaş arası kişilerle yapılan bir çalışmada bu tür bir görevdeki sonuçlar 10 ile 30 yaş arasında biraz yükselmiştir.',
    'Harf ya da sayı dizilerini akılda tutmaya dayalı bilgisayar alıştırmaları alıştırılan görevde sonucu yükseltebilir; ama bunun başka türden görevlere ve günlük işlere yansıdığına dair güvenilir bir kanıt yoktur.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; çalışma belleğinin yalnızca bir yönünü (araya işlemler girerken harfleri sırasıyla akılda tutmayı) gösterir.',
    'Tek bir görevin sonucu, çalışma belleğinin yanında o göreve özgü etkileri de taşır; çalışma belleğini daha iyi görmek için farklı türden görevler birlikte kullanılır.',
    '10–86 yaş arası kişilerle yapılan bir çalışmada bu tür bir görevdeki sonuçlar 10 ile 30 yaş arasında biraz yükselmiştir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
    'Harf ya da sayı dizilerini akılda tutmaya dayalı bilgisayar alıştırmaları alıştırılan görevde sonucu yükseltebilir; ama bunun başka türden görevlere, derslere ve günlük işlere yansıdığına dair güvenilir bir kanıt yoktur.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine yaşla ilgili bilgi. */
const hesaplaFacts: InfoBox = {
  ...hesaplaBase,
  items: {
    ...hesaplaBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; çalışma belleğinin yalnızca bir yönünü (araya işlemler girerken harfleri sırasıyla akılda tutmayı) gösterir.',
      'Tek bir görevin sonucu, çalışma belleğinin yanında o göreve özgü etkileri de taşır; çalışma belleğini daha iyi görmek için farklı türden görevler birlikte kullanılır.',
      '10–86 yaş arası kişilerle yapılan bir çalışmada bu tür bir görevdeki sonuçlar 30 yaşa kadar biraz yükselmiş, 30 yaşın üstünde ise yaş ilerledikçe düşmüştür; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
      'Harf ya da sayı dizilerini akılda tutmaya dayalı bilgisayar alıştırmaları alıştırılan görevde sonucu yükseltebilir; ama bunun başka türden görevlere ve günlük işlere yansıdığına dair güvenilir bir kanıt yoktur.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const hesaplaVeHatirla: TaskRoadmapTemplate = {
  version: 'hesapla-ve-hatirla-yol-haritasi-1',
  what: {
    student: 'bir yandan iş yaparken bir yandan bilgiyi aklında tutmayı nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun bir yandan iş yaparken bir yandan bilgiyi aklında tutmasını nasıl kolaylaştırabileceği',
    summary: 'iş yaparken bilgiyi akılda tutmayı kolaylaştıran yollar',
  },
  studyTitle: { you: 'İş yaparken bilgiyi aklında tutmayı ne kolaylaştırır?', parent: 'Çocuğunuzun iş yaparken bilgiyi aklında tutmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, araya işlemler girerken harfleri sırasıyla aklında tutabilmeyi, yani çalışma belleğini ölçer. Çalışma belleği; zihinden hesap yaparken ara sonuçları akılda tutmak, birini dinlerken söylenenleri aklında tutup bir yandan not almak ya da birkaç adımlı bir tarifi uygularken sıradaki adımı unutmamak gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde aklındaki yükü hafifletmeye yardım edebilir.',
    'Bu test, araya işlemler girerken harfleri sırasıyla akılda tutabilmeyi, yani çalışma belleğini ölçer. Çalışma belleği; zihinden hesap yaparken ara sonuçları akılda tutmak, öğretmeni dinlerken bir yandan not almak ya da çok adımlı bir yönergeyi uygularken sıradaki adımı unutmamak gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde aklındaki yükü hafifletmeye yardım edebilir.',
  ),
  supports: [
    support(0, 'yaz', 'Ara sonuçları yaz', 'Araç', t(
      'Zihinden işlem yaparken ya da birkaç bilgiyi aynı anda kullanman gerektiğinde ara sonuçları kâğıda ya da telefona yaz. Bilgi kâğıtta durunca hepsini aynı anda aklında tutmak zorunda kalmazsın; aklını hesaba ve düşünmeye ayırırsın.',
      'Çocuğunuza zihinden işlem yaparken ya da birkaç bilgiyi aynı anda kullanması gerektiğinde ara sonuçları kâğıda yazmasını önerin. Bilgi kâğıtta durunca hepsini aynı anda aklında tutmak zorunda kalmaz; aklını hesaba ve düşünmeye ayırır.',
    )),
    support(1, 'tek', 'Bir seferde bir iş', 'Ortam', t(
      'Önemli bir şeyi dinlerken ya da okurken aynı anda başka bir işe (ör. mesajlara bakmaya) geçme. Bu testte olduğu gibi, araya başka bir iş girince akılda tutulan bilgiyi korumak çoğu kişi için zorlaşır.',
      'Önemli bir şeyi dinlerken ya da okurken aynı anda başka bir işe (ör. telefona bakmaya) geçmemesi çocuğunuzun işini kolaylaştırır. Bu testte olduğu gibi, araya başka bir iş girince akılda tutulan bilgiyi korumak çoğu kişi için zorlaşır.',
    )),
    support(2, 'parca', 'Parçalara böl', 'Yöntem', t(
      'Akılda tutman gereken uzun bir bilgiyi (ör. bir numara ya da birkaç adımlı bir yol tarifi) küçük parçalara böl ve bir parçayı bitirmeden ötekine geçme. Uzun bir bilgiyi tek seferde değil, parça parça kullanmak aklındaki yükü azaltabilir.',
      'Çocuğunuza akılda tutması gereken uzun bir bilgiyi (ör. bir numara ya da çok adımlı bir yönerge) küçük parçalara bölmesini ve bir parçayı bitirmeden ötekine geçmemesini önerin. Uzun bir bilgiyi tek seferde değil, parça parça kullanmak aklındaki yükü azaltabilir.',
    )),
    support(3, 'liste', 'Adımları listeye dök', 'Alışkanlık', t(
      'Birkaç adımlı bir iş ya da yönerge aldığında adımları kısa bir listeye yaz ve bitirdikçe işaretle. Liste, sıradaki adımı aklında tutma işini senin yerine yapar; bir adımı unutursan listeye bakman yeter.',
      'Çocuğunuza birkaç adımlı bir iş ya da yönerge aldığında adımları kısa bir listeye yazmasını ve bitirdikçe işaretlemesini önerin. Liste, sıradaki adımı aklında tutma işini onun yerine yapar; bir adımı unutursa listeye bakması yeter.',
    )),
  ],
  facts: hesaplaFacts,
  approach: [
    { title: 'Yönergeleri parça parça verin', text: 'Çok adımlı yönergeleri birer birer verin ya da kısa bir liste olarak yazın; birini bitirince ötekine geçmesini bekleyin.' },
    { title: 'Ortamı sadeleştirin', text: 'Ödev ve ders çalışma sırasında televizyon ve telefon gibi dikkati bölen şeyleri ortamdan uzaklaştırın; bir seferde bir işe odaklanmasına destek olun.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Ara sonucu yaz',
      text: t(
        'Bu hafta birbirine benzeyen, birkaç adımlı iki hesap seç (ör. iki ayrı alışverişin toplam tutarı). Birini ara sonuçları yazarak, ötekini yazmadan yap; hangisinin daha kolay ve doğru olduğunu karşılaştır.',
        'Bu hafta çocuğunuzla birbirine benzeyen, birkaç adımlı iki hesap seçin (ör. iki ayrı alışverişin toplam tutarı). Birini ara sonuçları yazarak, ötekini yazmadan yapın; hangisinin daha kolay ve doğru olduğunu birlikte konuşun.',
      ),
    },
    {
      title: 'Tek iş',
      text: t(
        'Bu hafta önemli bir şeyi dinlerken ya da okurken telefonunu başka bir yere koy. Sonra dinlediğin ya da okuduğun şeyi ne kadar aklında tuttuğuna bak.',
        'Bu hafta çocuğunuza önemli bir şeyi dinlerken ya da okurken telefonunu başka bir yere koymasını önerin. Sonra dinlediği ya da okuduğu şeyi ne kadar aklında tuttuğunu birlikte konuşun.',
      ),
    },
    {
      title: 'Listeye dök',
      text: t(
        'Bu hafta birkaç adımlı bir işi (ör. bir tarifi uygulamak ya da bir eşyayı kurmak) adımları kısa bir listeye yazarak yap ve bitirdikçe işaretle.',
        'Bu hafta çocuğunuzla birkaç adımlı bir işi (ör. bir tarifi uygulamak ya da bir oyunu kurmak) adımları kısa bir listeye yazarak yapın ve bitirdikçe işaretlemesini isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (ara sonuçları yazmak, bir seferde bir iş yapmak, parçalara bölmek ya da listeye dökmek) iş yaparken bilgiyi aklında tutmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun iş yaparken bilgiyi aklında tutmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['geriye-donuk-hatirlama', 'kelime-listesi-hatirlama', 'kural-degistirme'],
  nextPurpose: {
    you: 'belleğinin ve dikkatinin başka yönlerini de görmek',
    parent: 'çocuğunuzun belleğinin ve dikkatinin başka yönlerini de görmek',
    general: true,
  },
  links: [],
  sources: [KAYNAK.ferguson2021, KAYNAK.fu2026, KAYNAK.schmiedek2014, KAYNAK.melby, KAYNAK.hedge],
};

const desenBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; görsel belleğin yalnızca bir yönünü (kısa bir süre gösterilen bir deseni hemen ardından hatırlamayı) gösterir.',
    'Desen hatırlama çocuklukta hızla gelişir: bir araştırmada 5 ile 11 yaş arasında hızla artmış, 11 yaşına gelindiğinde yetişkinlerin düzeyine ulaşmıştır.',
    'Kolay ad verilebilen desenler daha iyi hatırlanır; bu testin desenleri bu yüzden kolay ad verilebilecek biçimlerden kaçınılarak seçildi.',
    'Yol haritasındaki haftalık oyunlar bu teste benzer; testi yeniden çözdüğünde sonucun yükselebilir. Bu, görsel belleğinin genel olarak geliştiği anlamına gelmez.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; görsel belleğin yalnızca bir yönünü (kısa bir süre gösterilen bir deseni hemen ardından hatırlamayı) gösterir.',
    'Desenleri hatırlamak, yerlerin sırasını hatırlamaktan (ör. kutuların sırayla yandığı görevler) büyük ölçüde ayrı bir beceri olarak görülür; bir araştırmada sağlıklı yetişkinlerde ikisinin sonuçları arasındaki ilişki zayıf bulunmuştur.',
    'Desen hatırlama çocuklukta hızla gelişir: bir araştırmada 5 ile 11 yaş arasında hızla artmış, 11 yaşına gelindiğinde yetişkinlerin düzeyine ulaşmıştır. Sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
    'Bellek alıştırmaları alıştırılan göreve benzer görevlerde sonucu kısa vadede yükseltebilir; ama bunun zekâ testlerine, derslere ve günlük işlere yansıdığına dair güvenilir bir kanıt yoktur.',
    'Yol haritasındaki haftalık oyunlar bu teste benzer; çocuğunuz testi yeniden çözdüğünde sonucu yükselebilir. Bu, görsel belleğin genel olarak geliştiği anlamına gelmez.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine yaşla ilgili bilgi. */
const desenFacts: InfoBox = {
  ...desenBase,
  items: {
    ...desenBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; görsel belleğin yalnızca bir yönünü (kısa bir süre gösterilen bir deseni hemen ardından hatırlamayı) gösterir.',
      'Desen hatırlama yetişkinlikte yaş ilerledikçe azalır; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
      'Kolay ad verilebilen desenler daha iyi hatırlanır; bu testin desenleri bu yüzden kolay ad verilebilecek biçimlerden kaçınılarak seçildi.',
      'Bellek alıştırmaları alıştırılan göreve benzer görevlerde sonucu kısa vadede yükseltebilir; ama bunun başka becerilere yansıdığına dair güvenilir bir kanıt yoktur.',
      'Yol haritasındaki haftalık oyunlar bu teste benzer; testi yeniden çözdüğünde sonucun yükselebilir. Bu, görsel belleğinin genel olarak geliştiği anlamına gelmez.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const desenHatirlama: TaskRoadmapTemplate = {
  version: 'desen-hatirlama-yol-haritasi-1',
  what: {
    student: 'bir şeklin ya da çizimin görünüşünü kısa bir bakıştan sonra aklında tutmayı nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun bir şeklin ya da çizimin görünüşünü kısa bir bakıştan sonra aklında tutmasını nasıl kolaylaştırabileceği',
    summary: 'bir görüntüyü kısa bir bakıştan sonra akılda tutmayı kolaylaştıran yollar',
  },
  studyTitle: { you: 'Bir görüntüyü aklında tutmayı ne kolaylaştırır?', parent: 'Çocuğunuzun bir görüntüyü aklında tutmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, kısa bir süre gösterilen bir deseni akılda tutabilmeyi, yani kısa süreli görsel belleği ölçer. Bu beceri; bir çizime bakıp onu kâğıda çizmek, bir tablonun ya da bir sayfanın düzenini aklında tutmak, bir geometri şeklinin görünüşünü hatırlamak gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde bir görüntüyü aklında tutmayı kolaylaştırabilir.',
    'Bu test, kısa bir süre gösterilen bir deseni akılda tutabilmeyi, yani kısa süreli görsel belleği ölçer. Bu beceri; tahtadaki bir şekli deftere çizmek, bir tablonun ya da bir sayfanın düzenini akılda tutmak, bir geometri şeklinin görünüşünü hatırlamak gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde bir görüntüyü aklında tutmasını kolaylaştırabilir.',
  ),
  supports: [
    support(0, 'ad', 'Görüntüye bir ad ver', 'Yöntem', t(
      'Bir şekli ya da çizimi aklında tutman gerektiğinde ona kısa bir ad vermeyi dene (ör. “merdiven gibi”, “iki köşesi dolu”). Araştırmalarda kolay ad verilebilen desenler daha iyi hatırlanmıştır. Görüntüyü bir sözcükle birlikte aklında tuttuğunu söyleyenler de daha başarılı bulunmuştur. Bu bir ilişkidir; ad vermenin sana yardım edip etmediğini kendin dene.',
      'Çocuğunuza, bir şekli ya da çizimi aklında tutması gerektiğinde ona kısa bir ad vermesini (ör. “merdiven gibi”, “iki köşesi dolu”) önerebilirsiniz. Araştırmalarda kolay ad verilebilen desenler daha iyi hatırlanmıştır. Görüntüyü bir sözcükle birlikte aklında tuttuğunu söyleyenler de daha başarılı bulunmuştur. Bu bir ilişkidir; ad vermenin ona yardım edip etmediğini birlikte deneyin.',
    )),
    support(1, 'parca', 'Bölümlere ayırarak bak', 'Yöntem', t(
      'Kalabalık bir görüntüye bir bütün olarak bakmak yerine onu bölümlere ayır: önce üst yarısına, sonra alt yarısına bak; her bölümde neyin nerede olduğunu fark et. Bölümlere ayırmak, neye bakacağını düzenlemene ve aklında tutman gereken şeyi küçük parçalara bölmene yardım edebilir.',
      'Çocuğunuza, kalabalık bir görüntüye bir bütün olarak bakmak yerine onu bölümlere ayırmasını önerin: önce üst yarısına, sonra alt yarısına baksın; her bölümde neyin nerede olduğunu fark etsin. Bölümlere ayırmak, neye bakacağını düzenlemesine ve aklında tutması gereken şeyi küçük parçalara bölmesine yardım edebilir.',
    )),
    support(2, 'aktar', 'Görüntüyü kâğıda aktar', 'Araç', t(
      'Kısa süreli görsel bellek sınırlıdır; bir bakışta aklında tutabileceğin şey azdır. Önemli bir çizimi, tabloyu ya da şemayı aklında tutmaya çalışmak yerine kabaca kâğıda çiz ya da kaynağa yeniden bakmaktan çekinme. Bir şeyi kopyalarken her seferinde küçük bir bölümüne bakıp onu aktarmak, hepsini birden aklında tutmaktan daha kolaydır.',
      'Kısa süreli görsel bellek sınırlıdır; bir bakışta akılda tutulabilecek şey azdır. Çocuğunuza, önemli bir çizimi ya da şemayı aklında tutmaya çalışmak yerine kabaca kâğıda çizmesini ya da kaynağa yeniden bakmaktan çekinmemesini önerin. Tahtadan bir şeyi kopyalarken her seferinde küçük bir bölümüne bakıp onu aktarmak, hepsini birden aklında tutmaktan daha kolaydır.',
    )),
    support(3, 'oyun', 'Görsel bellek oyunları', 'Etkinlik', t(
      'Eşini bul (hafıza kartları), “Ne değişti?” ve bir çizime bakıp onu aklından çizmek gibi oyunlar, görüntüleri aklında tutmayı keyifli bir etkinliğe dönüştürür. Bellek alıştırmaları alıştırılan oyunda sonucu yükseltebilir; ama bunun başka işlere kendiliğinden yansıdığına dair güvenilir bir kanıt yoktur. Asıl kazanç, görüntülere dikkatle bakmaktan keyif almaktır.',
      'Eşini bul (hafıza kartları), “Ne değişti?” ve bir çizime bakıp onu aklından çizmek gibi oyunlar, çocuğunuz için görüntüleri aklında tutmayı keyifli bir etkinliğe dönüştürür. Bellek alıştırmaları alıştırılan oyunda sonucu yükseltebilir; ama bunun derslere ve başka işlere kendiliğinden yansıdığına dair güvenilir bir kanıt yoktur. Asıl kazanç, görüntülere dikkatle bakmaktan keyif almaktır.',
    )),
  ],
  facts: desenFacts,
  approach: [
    { title: 'Kaynağa yeniden baksın', text: 'Tahtadan ya da kitaptan bir şekli kopyalarken kaynağa yeniden bakmasını doğal karşılayın; tek bakışta aklında tutmasını beklemeyin.' },
    { title: 'Keyif için oynayın', text: 'Eşini bul gibi görsel bellek oyunlarını kazanmak için değil, birlikte vakit geçirmek için oynayın; kartların yerini nasıl aklında tuttuğunu merak edin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Bak ve çiz',
      text: t(
        'Bu hafta kareli kâğıda 3 × 4’lük bir tablo çiz ve birinden birkaç kareyi boyamasını iste. Desene 3 saniye bak, kapat ve kendi kâğıdına çiz; sonra karşılaştırın ve rolleri değiştirin.',
        'Bu hafta kareli kâğıda 3 × 4’lük bir tablo çizin ve birkaç kareyi boyayın. Çocuğunuz desene 3 saniye baksın, kapatın ve kendi kâğıdına çizmesini isteyin; sonra karşılaştırın ve rolleri değiştirin.',
      ),
    },
    {
      title: 'Ad ver',
      text: t(
        'Bu hafta aynı oyunu iki biçimde oyna: bir desene yalnızca bakarak, ötekine bir ad vererek (ör. “yamuk merdiven”). Hangisinde daha çok kareyi doğru hatırladığını bir cümleyle yaz.',
        'Bu hafta aynı oyunu iki biçimde oynayın: çocuğunuz bir desene yalnızca baksın, ötekine bir ad versin (ör. “yamuk merdiven”). Hangisinde daha çok kareyi doğru hatırladığını birlikte konuşun.',
      ),
    },
    {
      title: 'Eşini bul',
      text: t(
        'Bu hafta yakınlarınla ya da arkadaşlarınla eşini bul (hafıza kartları) oyna. Oyunun sonunda kartların yerini nasıl aklınızda tuttuğunuzu (ör. köşelere göre ya da ad vererek) birbirinize anlatın.',
        'Bu hafta çocuğunuzla eşini bul (hafıza kartları) oynayın. Oyunun sonunda kartların yerini nasıl aklınızda tuttuğunuzu (ör. köşelere göre ya da ad vererek) birbirinize anlatın.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun (görüntüye ad vermek, bölümlere ayırarak bakmak ya da görüntüyü kâğıda aktarmak) bir görüntüyü aklında tutmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun bir görüntüyü aklında tutmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['kelime-listesi-hatirlama', 'hesapla-ve-hatirla', 'gizli-sekiller'],
  nextPurpose: {
    you: 'belleğinin ve görsel becerilerinin başka yönlerini de görmek',
    parent: 'çocuğunuzun belleğinin ve görsel becerilerinin başka yönlerini de görmek',
    general: true,
  },
  links: [],
  sources: [KAYNAK.dellaSala1999, KAYNAK.wilson1987, KAYNAK.brown2006, KAYNAK.brownWesley2013, KAYNAK.melby2016],
};

const harfBase = facts(
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca harf dizileriyle yapılan yönünü gösterir.',
    'Harf dizilerinde alfabenin sırasını rahat bilmek ve alfabede ileri geri sayabilmek de rol oynar.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; küçük yaşta üst düzeylerdeki sorularda zorlanmak olağandır.',
    'Bu tür soruları çözme yollarını öğrenmek ve aynı testi yeniden çözmek sonucu yükseltebilir; bu, akıl yürütmenin genel olarak geliştiği anlamına gelmez.',
  ],
  [
    'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca harf dizileriyle yapılan yönünü gösterir.',
    'Harf dizilerinde alfabenin sırasını rahat bilmek ve alfabede ileri geri sayabilmek de rol oynar; küçük sınıflarda bu rahatlık henüz gelişiyor olabilir.',
    'Akıl yürütme becerisi çocukluk ve ergenlik boyunca gelişir; sonuç akranlarla karşılaştırılmadığı için tek başına yorumlanmamalıdır.',
    'Bu tür soruları çözme yollarını öğrenmek ve aynı testi yeniden çözmek sonucu yükseltebilir; bu, akıl yürütmenin genel olarak geliştiği anlamına gelmez.',
  ],
);
/** Yetişkine: gelişimle ilgili cümle yerine alışkanlıkla ilgili bilgi. */
const harfFacts: InfoBox = {
  ...harfBase,
  items: {
    ...harfBase.items,
    adult: [
      'Bu sonuç tek bir oturuma dayanır: o günkü uyku, yorgunluk, ilgi ve kullandığın cihaz sonucu etkileyebilir.',
      'Bu sonuç bir zekâ puanı (IQ) değildir; akıl yürütmenin yalnızca harf dizileriyle yapılan yönünü gösterir.',
      'Harf dizilerinde alfabenin sırasını rahat bilmek ve bu tür sorulara alışkın olmak da rol oynar.',
      'Bu tür soruları çözme yollarını öğrenmek ve aynı testi yeniden çözmek sonucu yükseltebilir; bu, akıl yürütmenin genel olarak geliştiği anlamına gelmez.',
      'Bu tür görevlerde aynı kişinin sonucu bir günden ötekine değişebilir; tek bir sonuçla kendin hakkında kesin bir yargıya varma.',
    ],
  },
};

const harfDizileri: TaskRoadmapTemplate = {
  version: 'harf-dizileri-yol-haritasi-1',
  what: {
    student: 'bir dizideki kuralı bulmayı gerektiren işleri nasıl kolaylaştırabileceğin',
    parent: 'çocuğunuzun bir dizideki kuralı bulmayı gerektiren işlerini nasıl kolaylaştırabileceği',
    summary: 'bir dizideki kuralı bulmayı kolaylaştıran yollar',
  },
  studyTitle: { you: 'Bir dizideki kuralı bulmayı ne kolaylaştırır?', parent: 'Çocuğunuzun bir dizideki kuralı bulmasını ne kolaylaştırır?' },
  studyIntro: t(
    'Bu test, harf dizilerindeki kuralı bulup sürdürebilmeyi ölçer. Bu beceri; bir örüntüyü fark etmek, örneklerden bir kural çıkarmak ve bulduğun kuralı yeni durumlarda denemek gibi işlerde kullanılır. Aşağıdaki yollar, bu tür işlerde düşünmeni düzenlemeye yardım eder.',
    'Bu test, harf dizilerindeki kuralı bulup sürdürebilmeyi ölçer. Bu beceri; bir örüntüyü fark etmek, örneklerden bir kural çıkarmak ve bulunan kuralı yeni durumlarda denemek gibi işlerde kullanılır. Aşağıdaki yollar, çocuğunuzun bu tür işlerde düşünmesini düzenlemeye yardım eder.',
  ),
  supports: [
    support(0, 'adim', 'Adımları yaz', 'Yöntem', t(
      'Bir harf dizisinde kuralı ararken ardışık harflerin arasına alfabede kaç harf ilerlendiğini ya da geri gidildiğini yaz: “+1”, “+2”, “−1”; aynı harf tekrarlanıyorsa “=”. Bu sayılar da bir düzen oluşturuyorsa onların altına yeni bir satır aç. Harfleri sayarken alfabeyi önüne koymak işini kolaylaştırır. Bir araştırmada, harfler arasındaki ilişkileri ve dizinin kaç harfte bir tekrarlandığını aramayı birkaç kısa oturumda öğrenen çocukların hataları, bu eğitimi almayanlarınkinden daha çok azalmıştır (yanlışlar bu yolu öğrenenlerde yaklaşık %32, öğrenmeyenlerde yaklaşık %13 azalmıştır).',
      'Çocuğunuza bir harf dizisinde kuralı ararken ardışık harflerin arasına alfabede kaç harf ilerlendiğini ya da geri gidildiğini yazmasını önerin: “+1”, “+2”, “−1”; aynı harf tekrarlanıyorsa “=”. Bu sayılar da bir düzen oluşturuyorsa onların altına yeni bir satır açabilir. Harfleri sayarken alfabeyi önüne koymak işini kolaylaştırır. Bir araştırmada, harfler arasındaki ilişkileri ve dizinin kaç harfte bir tekrarlandığını aramayı birkaç kısa oturumda öğrenen çocukların hataları, bu eğitimi almayanlarınkinden daha çok azalmıştır (yanlışlar bu yolu öğrenenlerde yaklaşık %32, öğrenmeyenlerde yaklaşık %13 azalmıştır).',
    )),
    support(1, 'dene', 'Kuralı bütün dizide dene', 'Alışkanlık', t(
      'Bir araştırmada bu tür sorulardaki en sık hatanın, doğru kural bulunduktan sonra onu sürdürürken yapıldığı görülmüştür. Cevabı vermeden önce adımları alfabede bir kez daha say. Bulduğun kuralı dizinin başından sonuna da dene: yalnızca son iki harfe uyan bir kural yanlış çıkabilir. Örneğin K, L, N, P dizisinde son adımı (+3) aynen sürdürmek Ş verir; oysa adımlar her seferinde 1 büyüyor (+1, +2, +3) ve sıradaki harf T’dir.',
      'Bir araştırmada bu tür sorulardaki en sık hatanın, doğru kural bulunduktan sonra onu sürdürürken yapıldığı görülmüştür. Çocuğunuza cevabı vermeden önce adımları alfabede bir kez daha saymasını ve bulduğu kuralı dizinin başından sonuna denemesini önerin: yalnızca son iki harfe uyan bir kural yanlış çıkabilir. Örneğin K, L, N, P dizisinde son adımı (+3) aynen sürdürmek Ş verir; oysa adımlar her seferinde 1 büyüyor (+1, +2, +3) ve sıradaki harf T’dir.',
    )),
    support(2, 'ayir', 'Gruplara ve iki diziye ayır', 'Yöntem', t(
      'Harfler bir ileri bir geri gidiyorsa ya da düzen bir türlü bulunamıyorsa birinci, üçüncü, beşinci harfleri ve ikinci, dördüncü, altıncı harfleri ayrı ayrı yaz: bazen iç içe geçmiş iki basit dizi ortaya çıkar. Bir harf belli aralıklarla tekrarlanıyorsa diziyi iki, üç ya da dört harflik gruplara böl ve grupları alt alta yazıp karşılaştır.',
      'Harfler bir ileri bir geri gidiyorsa ya da düzen bir türlü bulunamıyorsa çocuğunuza birinci, üçüncü, beşinci harfleri ve ikinci, dördüncü, altıncı harfleri ayrı ayrı yazmasını önerin: bazen iç içe geçmiş iki basit dizi ortaya çıkar. Bir harf belli aralıklarla tekrarlanıyorsa diziyi iki, üç ya da dört harflik gruplara bölüp grupları alt alta yazarak karşılaştırabilir.',
    )),
    support(3, 'alfabe', 'Alfabede rahat ol', 'Etkinlik', t(
      'Harf dizilerinde alfabenin sırasını rahat bilmek ve alfabede ileri geri saymak işi kolaylaştırır. Türk alfabesini ileri ve geri söylemek, “Ğ’den iki önceki harf hangisi?” gibi kısa sorularla oynamak ve kelime bulmacaları çözmek bu rahatlığı destekleyebilir; bu oyunlarda ustalaşmak her işe kendiliğinden yansımayabilir, asıl kazanç harflerle düşünmekten keyif almaktır.',
      'Harf dizilerinde alfabenin sırasını rahat bilmek ve alfabede ileri geri saymak işi kolaylaştırır. Türk alfabesini ileri ve geri söylemek, “Ğ’den iki önceki harf hangisi?” gibi kısa sorularla oynamak ve kelime bulmacaları çözmek çocuğunuzun bu rahatlığını destekleyebilir; bu oyunlarda ustalaşmak her işe kendiliğinden yansımayabilir, asıl kazanç harflerle düşünmekten keyif almaktır.',
    )),
  ],
  facts: harfFacts,
  approach: [
    { title: 'Acele ettirmeyin', text: 'Zor bir dizide uzun düşünmesine ve kâğıt kalem kullanmasına izin verin; hızlı olmasından çok, kuralı kendisinin bulmasını övün.' },
    { title: 'Harf oyunları oynayın', text: '“Bir kural düşündüm: K, L, M… Sıradaki harf ne?” gibi kısa oyunları sırayla kural koyarak oynayın; kuralı sözcüklerle söylemesini isteyin.' },
    { title: 'Karşılaştırmayın', text: 'Bu sonucu kardeşleriyle ya da arkadaşlarıyla karşılaştırmayın; okuldaki çalışmaları ve öğretmen gözlemleriyle birlikte değerlendirin.' },
  ],
  weeks: [
    {
      title: 'Adımları yaz',
      text: t(
        'Bu hafta kendin yazdığın ya da bir bulmacada gördüğün üç kısa harf dizisinde harflerin arasına adımları (“+1”, “+2”, “=”) yaz ve her birinin kuralını tek cümleyle söyle.',
        'Bu hafta çocuğunuzla üç kısa harf dizisi yazın; harflerin arasına adımları (“+1”, “+2”, “=”) yazıp her birinin kuralını tek cümleyle söyleyin.',
      ),
    },
    {
      title: 'Kendi dizini yap',
      text: t(
        'Bu hafta bir kural seç (ör. “bir harf atla, sonra hep aynı harfi yaz”), o kurala göre altı harf yaz, yedinciyi boş bırak ve birine çözdür; sonra onun nasıl düşündüğünü sor.',
        'Bu hafta çocuğunuzdan bir kural seçip (ör. “her seferinde bir harf atla”) altı harflik bir dizi yazmasını, yedinci harfi boş bırakıp size çözdürmesini isteyin; sonra rolleri değiştirin.',
      ),
    },
    {
      title: 'Kontrol et',
      text: t(
        'Bu hafta bir bulmaca ya da problem çözerken, cevabı vermeden önce bulduğun kuralı baştan sona bir kez dene ve kaç hatayı böyle yakaladığını say.',
        'Bu hafta çocuğunuzdan bir bulmaca ya da problem çözerken cevabı vermeden önce bulduğu kuralı baştan sona bir kez denemesini ve kaç hatayı böyle yakaladığını saymasını isteyin.',
      ),
    },
  ],
  lastWeek: t(
    'Dört haftanın sonunda hangi yolun dizilerdeki kuralı bulmanı en çok kolaylaştırdığını yaz ve onu sürdür.',
    'Dört haftanın sonunda hangi yolun çocuğunuzun dizilerdeki kuralı bulmasını en çok kolaylaştırdığını birlikte konuşun ve onu sürdürün.',
  ),
  nextTests: ['sayi-dizileri', 'sekil-akil-yurutme'],
  nextPurpose: {
    you: 'sayılarla ve şekillerle akıl yürütmeyi de görmek',
    parent: 'çocuğunuzun sayılarla ve şekillerle akıl yürütmesini de görmek',
  },
  links: [],
  sources: [KAYNAK.simon1963, KAYNAK.holzman1976, KAYNAK.willis2013, KAYNAK.ferrer],
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
  'sayi-dizileri': sayiDizileri,
  'sozel-akil-yurutme': sozelAkilYurutme,
  'kagit-katlama': kagitKatlama,
  'kelime-bilgisi': kelimeBilgisi,
  'kural-degistirme': kuralDegistirme,
  'kelime-listesi-hatirlama': kelimeListesi,
  'mantiksal-akil-yurutme': mantiksalAkilYurutme,
  'sayisal-akil-yurutme': sayisalAkilYurutme,
  'kup-acinimi': kupAcinimi,
  'uc-boyutlu-zihinde-dondurme': ucBoyutluZihindeDondurme,
  'dusunerek-karar-verme': dusunerekKararVerme,
  'planlama-kule-gorevi': planlamaKuleGorevi,
  'hesapla-ve-hatirla': hesaplaVeHatirla,
  'bakis-acisi-alma': bakisAcisiAlma,
  'gizli-sekiller': gizliSekiller,
  'desen-hatirlama': desenHatirlama,
  'harf-dizileri': harfDizileri,
};
