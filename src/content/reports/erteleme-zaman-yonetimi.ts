import type { InsightRule, ReportTemplate } from './types';

/**
 * Erteleme ve Zaman Yönetimi: rapor metinleri.
 *
 * Dayanaklar (araştırma cümlelerinin her biri bunlardan birine dayanır):
 *  - Steel (2007, meta-analiz): erteleme "bir işi, ertelemenin zarar vereceğini bilerek isteyerek sonraya bırakmak";
 *    üniversite öğrencilerinin neredeyse yarısı sürekli ve sorun yaratacak ölçüde, yetişkinlerin %15–20'si süregiden
 *    biçimde erteliyor; ertelemeyle ilişkiler: dikkat dağınıklığı r = .45, dürtüsellik .41, işi tatsız bulma .40,
 *    öz-yeterlik −.38, düzenlilik −.36, niyet ile eylem arasındaki boşluk .52 (niyetlerin kendisi −.03), başarı −.19,
 *    çökkünlük .28. Öneriler: yakın ara hedefler, dikkat dağıtıcıları sınırlamak, öz-yeterliği artırmak.
 *  - Sirois ve Pychyl (2013): erteleme, o anki kötü duygudan kaçmak (kısa vadeli duygu onarımı); bedelini "sonraki ben"
 *    öder ve çoğu zaman daha kötü hissettirir; geçmiş ertelemeyi affetmek sonraki ertelemeyi azaltabiliyor.
 *  - Macan ve ark. (1990): zamanı kontrol edebilme duygusu, zaman yönetimi etkenleri arasında stres ve doyumla en güçlü
 *    ilişkili olan.
 *  - Buehler, Griffin ve Ross (1994): öğrencilerin %29,7'si tezini kendi tahmin ettiği sürede bitirdi; geçmiş benzer
 *    deneyimleri tahminle ilişkilendirenlerde iyimser yanılgı ortadan kalktı.
 *  - Gollwitzer ve Sheeran (2006): "ne zaman, nerede, nasıl" planları (eğer-o zaman planları) hedefe ulaşmayı orta-büyük
 *    düzeyde kolaylaştırıyor (94 test, d = .65).
 *  - Aeon, Faber ve Panaccio (2021, 158 çalışma): zaman yönetimi başarıyla (r ≈ .26) ve daha güçlü biçimde iyi oluşla
 *    (r ≈ .31; yaşam doyumu .43) ilişkili.
 * Bulgular ilişkiseldir: metinler "neden olur" demez; öneriler "-abilir" diye yazılır. Hiçbir metin suçlamaz.
 *
 * Birlikte yorum (`insight`): giriş ertelemenin düzeyine göre; ek cümleler ertelemeyle birlikte görülen alanları (plan,
 * odak, süre tahmini, kontrol duygusu) bağlar. Ayrıntı ve öneriler alanların kendi metinlerindedir; birlikte yorum
 * onları tekrar etmez, ilgili bölüme işaret eder. Süre tahmini ve kontrol duygusu kaynaklarda ertelemeyle ilişkilendirilmez:
 * onlar "zaman yönetimi alışkanlığı" diye anılır. Öğrenci metinleri okula özgü değilse yetişkine de aynen gösterilir.
 * Kartlar, yol haritasının çalışma kartlarında ve haftalarında verilen öneriyi tekrar etmez (2026-10-22 incelemesi): aynı
 * öneri (ör. telefonu başka odaya koymak, işleri yazıya dökmek) bir sayfada bir kez verilir.
 */

const p = (
  summary: string,
  student: string,
  parent: string,
  tipsStudent: string[],
  tipsParent: string[],
  adult?: string,
) => ({ summary, student, parent, tipsStudent, tipsParent, ...(adult ? { adult } : {}) });

const r = (when: InsightRule['when'], student: string, parent: string, adult?: string): InsightRule => ({
  when,
  text: { student, parent, ...(adult ? { adult } : {}) },
});

export const ertelemeZamanYonetimiReport: ReportTemplate = {
  version: 'erteleme-zaman-yonetimi-1',
  bandLabels: { low: 'Düşük', average: 'Orta', high: 'Yüksek' },
  evaluative: true,
  overview: {
    student:
      'Her satır bir alan; yüksek puan, o becerinin sık kullanıldığını gösterir. “Ertelemeden başlama” düşükse işler sık sık erteleniyor demektir. Değerler 1 (hiçbir zaman) ile 5 (her zaman) arasındadır.',
    parent:
      'Her satır bir alan; yüksek puan, o becerinin sık kullanıldığını gösterir. “Ertelemeden başlama” düşükse işler sık sık erteleniyor demektir. Değerler 1 (hiçbir zaman) ile 5 (her zaman) arasındadır.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Alanların birlikte yorumu: ertelemenin hangi zaman yönetimi alışkanlıklarıyla birlikte görüldüğü',
    lead: [
      r(
        { start: ['low'] },
        'Ertelemeden başlama puanın düşük. Erteleme tembellikle açıklanamaz ve tek bir nedeni yoktur: araştırmacılar onu çoğu zaman zor ya da sıkıcı bir işin o an verdiği kötü duygudan kaçmak olarak açıklar; bu kaçış ise çoğu zaman sonradan sıkışmaya ve daha kötü hissetmeye yol açar. Ertelemenin sende hangi alışkanlıklarla birlikte görüldüğü aşağıda.',
        'Çocuğunuzun ertelemeden başlama puanı düşük. Erteleme tembellikle açıklanamaz ve tek bir nedeni yoktur: araştırmacılar onu çoğu zaman zor ya da sıkıcı bir işin o an verdiği kötü duygudan kaçmak olarak açıklar; bu kaçış ise çoğu zaman sonradan sıkışmaya ve daha kötü hissetmeye yol açar. Ertelemenin onda hangi alışkanlıklarla birlikte görüldüğü aşağıda.',
      ),
      r(
        { start: ['average'] },
        'Ertelemeden başlama puanın orta.',
        'Çocuğunuzun ertelemeden başlama puanı orta.',
      ),
      r(
        { start: ['high'] },
        'Ertelemeden başlama puanın yüksek. Araştırmalarda erteleme daha düşük başarı ve daha çok stresle ilişkili bulunuyor; bu alışkanlık sana zaman ve rahatlık kazandırabilir.',
        'Çocuğunuzun ertelemeden başlama puanı yüksek. Araştırmalarda erteleme daha düşük başarı ve daha çok stresle ilişkili bulunuyor; bu alışkanlık ona zaman ve rahatlık kazandırabilir.',
      ),
    ],
    rules: [
      r(
        { start: ['low', 'average'], planning: ['average', 'high'], focus: ['average', 'high'], estimation: ['average', 'high'] },
        'Planlama, odak ve süre tahmini alanlarında belirgin bir güçlük görünmüyor. Ertelemenin kaynağı daha çok işin kendisinde olabilir: araştırmalarda bir iş ne kadar tatsız bulunursa o kadar çok erteleniyor; yapabileceğine inanmamak da ertelemeyle ilişkili. Ertelediğin işlerin ortak yanı ne: sıkıcı mı, zor mu, nereden başlanacağı belli değil mi?',
        'Planlama, odak ve süre tahmini alanlarında belirgin bir güçlük görünmüyor. Ertelemenin kaynağı daha çok işin kendisinde olabilir: araştırmalarda bir iş ne kadar tatsız bulunursa o kadar çok erteleniyor; yapabileceğine inanmamak da ertelemeyle ilişkili. Ertelediği işlerin ortak yanını (sıkıcı mı, zor mu, nereden başlanacağı belli değil mi) onunla birlikte konuşabilirsiniz.',
      ),
      r(
        { start: ['low'], planning: ['high'] },
        'Plan yapıyorsun ama planladığın işe başlamakta zorlanıyorsun. Niyet ile eylem arasındaki bu boşluk ertelemenin özüdür: araştırmalarda niyetlerin kendisi değil, plana uymayan davranış ertelemeyle ilişkili bulunmuş. Planına bir de engel planı eklemek işe yarayabilir; örneğin “Canım istemese de ilk 10 dakikayı yapacağım” diye önceden karar vermek.',
        'Çocuğunuz plan yapıyor ama planladığı işe başlamakta zorlanıyor. Niyet ile eylem arasındaki bu boşluk ertelemenin özüdür: araştırmalarda niyetlerin kendisi değil, plana uymayan davranış ertelemeyle ilişkili bulunmuş. Planına bir de engel planı eklemesi işe yarayabilir; örneğin “Canım istemese de ilk 10 dakikayı yapacağım” diye önceden karar vermek.',
      ),
      r(
        { start: ['low', 'average'], planning: ['low'] },
        'Planlama puanın düşük: işler yazıya dökülmeyince hangisinden başlanacağı belirsizleşebilir ve bazıları kolayca ertelenebilir. Planlama ve öncelik bölümündeki öneri iyi bir ilk adım olabilir.',
        'Planlama puanı düşük: işler yazıya dökülmeyince hangisinden başlanacağı belirsizleşebilir ve bazıları kolayca ertelenebilir. Planlama ve öncelik bölümündeki öneri iyi bir ilk adım olabilir.',
      ),
      r(
        { start: ['low', 'average'], focus: ['low'] },
        'Odağı koruma puanın düşük. Dikkatin kolay dağılması, araştırmalarda ertelemeyle en güçlü ilişkili özelliklerden biri; bu yüzden Odağı koruma bölümündeki öneriyle başlamak iyi bir seçenek olabilir.',
        'Odağı koruma puanı düşük. Dikkatin kolay dağılması, araştırmalarda ertelemeyle en güçlü ilişkili özelliklerden biri; bu yüzden Odağı koruma bölümündeki öneriyle başlamak iyi bir seçenek olabilir.',
      ),
      r(
        { start: ['low', 'average'], estimation: ['low'] },
        'Süreyi tahmin etme puanın düşük: bir işin süresini kısa tahmin edince “daha çok vaktim var” düşüncesi başlamayı geciktirebilir. Süreyi tahmin etme bölümündeki öneri, ne zaman başlaman gerektiğini daha gerçekçi görmene yardım edebilir.',
        'Süreyi tahmin etme puanı düşük: bir işin süresini kısa tahmin edince “daha çok vaktim var” düşüncesi başlamayı geciktirebilir. Süreyi tahmin etme bölümündeki öneri, ne zaman başlaması gerektiğini daha gerçekçi görmesine yardım edebilir.',
      ),
      r(
        { start: ['high'], planning: ['low'] },
        'Plan yapmadan da işlere zamanında başlayabiliyorsun. İşler çoğaldığında kısa bir liste bu düzeni korumanı kolaylaştırabilir.',
        'Çocuğunuz plan yapmadan da işlere zamanında başlayabiliyor. İşler çoğaldığında kısa bir liste bu düzeni korumasını kolaylaştırabilir.',
      ),
      r(
        { start: ['low', 'average'], control: ['low'] },
        'Zamanının kontrolünün sende olmadığını hissediyorsun; ertelenen ya da biriken işler bu duyguyu artırabilir. Zamanın kontrolü bölümündeki küçük adım, kontrolü geri kazanmana yardım edebilir.',
        'Çocuğunuz zamanının kontrolünün kendinde olmadığını hissediyor; ertelenen ya da biriken işler bu duyguyu artırabilir. Zamanın kontrolü bölümündeki küçük adım, kontrolü geri kazanmasına yardım edebilir.',
      ),
      r(
        { start: ['high'], control: ['low'] },
        'Zamanının kontrolünün sende olmadığını hissediyorsun; işlere zamanında başlasan da işlerin çokluğu bu duyguyu doğurabilir. Zamanın kontrolü bölümündeki küçük adım işine yarayabilir.',
        'Çocuğunuz zamanının kontrolünün kendinde olmadığını hissediyor; işlere zamanında başlasa da işlerin çokluğu bu duyguyu doğurabilir. Zamanın kontrolü bölümündeki küçük adım işine yarayabilir.',
      ),
      r(
        { start: ['high'], planning: ['high'], control: ['high'], estimation: ['average', 'high'], focus: ['average', 'high'] },
        'Başlama, planlama ve zamanın kontrolü güçlü görünüyor. Dinlenmeye ayırdığın zamanı da planının bir parçası saymak bu dengeyi korumana yardım edebilir.',
        'Başlama, planlama ve zamanın kontrolü güçlü görünüyor. Dinlenmeye ayırdığı zamanı da planının bir parçası saymak bu dengeyi korumasına yardım edebilir.',
      ),
      {
        when: { start: ['low'] },
        // Planlama, odak ve süre tahmininden en az biri düşükse (hepsi orta ya da yüksekse ilk kural aynı şeyi söyler).
        not: { planning: ['average', 'high'], focus: ['average', 'high'], estimation: ['average', 'high'] },
        text: {
          student:
            'Bunlara ek olarak, araştırmalarda ertelemeyle ilişkili iki etken daha var: işi tatsız bulmak ve yapabileceğine inanmamak. Ertelediğin işlerin ortak yanına bakmak, hangi adımın işe yarayabileceğini gösterebilir.',
          parent:
            'Bunlara ek olarak, araştırmalarda ertelemeyle ilişkili iki etken daha var: işi tatsız bulmak ve yapabileceğine inanmamak. Ertelediği işlerin ortak yanına onunla birlikte bakmak, hangi adımın işe yarayabileceğini gösterebilir.',
        },
      },
    ],
  },
  scales: {
    start: {
      low: p(
        'İşleri sık sık erteleme',
        'İşlere başlamayı sık sık erteliyorsun; çoğu zaman bunun sana zarar vereceğini bilsen de. Bu durumda yalnız değilsin: araştırmalara göre üniversite öğrencilerinin neredeyse yarısı sürekli ve sorun yaratacak ölçüde erteliyor. Ertelediğin için kendini suçlamak yerine bir sonraki küçük adıma bakmak daha yararlı olabilir: bir araştırmada geçmiş ertelemeyi affetmenin sonraki ertelemeyi azaltabildiği görülmüş.',
        'Çocuğunuz işlere başlamayı sık sık erteliyor; çoğu zaman bunun kendisine zarar vereceğini bilse de. Bu yaygın bir durumdur: araştırmalara göre üniversite öğrencilerinin neredeyse yarısı sürekli ve sorun yaratacak ölçüde erteliyor. Suçlamak, ertelemenin ardındaki kötü duyguyu artırabilir; işe başlamayı kolaylaştıran küçük adımlar daha yararlı olabilir: bir araştırmada geçmiş ertelemeyi affetmenin sonraki ertelemeyi azaltabildiği görülmüş.',
        ['Ertelediğin bir işin yalnızca ilk beş dakikasını yap.'],
        ['Suçlamak yerine işin ilk küçük adımını birlikte belirleyin.'],
        'İşlere başlamayı sık sık erteliyorsun; çoğu zaman bunun sana zarar vereceğini bilsen de. Bu durumda yalnız değilsin: araştırmalara göre erişkinlerin %15–20’si ertelemeyi süregiden bir sorun olarak yaşıyor. Ertelediğin için kendini suçlamak yerine bir sonraki küçük adıma bakmak daha yararlı olabilir: bir araştırmada geçmiş ertelemeyi affetmenin sonraki ertelemeyi azaltabildiği görülmüş.',
      ),
      average: p(
        'Bazen erteleme',
        'Bazı işlere zamanında başlıyor, bazılarını erteliyorsun.',
        'Çocuğunuz bazı işlere zamanında başlıyor, bazılarını erteliyor.',
        ['Bu hafta ertelediğin işleri not et ve ortak yanlarına bak.'],
        ['Hangi işleri ertelediğini, yargılamadan birlikte konuşun.'],
      ),
      high: p(
        'İşlere zamanında başlama',
        'İşlere çoğunlukla ertelemeden, zamanında başlıyorsun. Zor ya da sıkıcı bir işte de ilk küçük adımı atmayı sürdürmek bu alışkanlığı korumana yardım edebilir.',
        'Çocuğunuz işlere çoğunlukla ertelemeden, zamanında başlıyor. Zor ya da sıkıcı bir işte de ilk küçük adımı atmayı sürdürmesi bu alışkanlığı korumasına yardım edebilir; bu çabasını fark ettiğinizi ona söyleyin.',
        ['Zor bir işte de ilk küçük adımla başlamayı sürdür.'],
        ['Zamanında başlama çabasını fark ettiğinizi söyleyin.'],
      ),
    },
    planning: {
      low: p(
        'Plan yapmadan çalışma',
        'Yapacaklarını çoğunlukla plan yapmadan, aklına geldiği sırayla yapıyorsun. Araştırmalarda düzenli ve planlı olmak daha az ertelemeyle ilişkili; uzak bir hedefi yakın ara hedeflere bölmek de işe başlamayı kolaylaştırabilir.',
        'Çocuğunuz yapacaklarını çoğunlukla plan yapmadan, aklına geldiği sırayla yapıyor. Araştırmalarda düzenli ve planlı olmak daha az ertelemeyle ilişkili; uzak bir hedefi yakın ara hedeflere bölmek de işe başlamayı kolaylaştırabilir.',
        ['Yarın yapacağın tek bir işin ne zaman ve nerede yapılacağını yaz.'],
        ['Haftanın başında birlikte kısa bir yapılacaklar listesi hazırlayın.'],
      ),
      average: p(
        'Bazen plan yapma',
        'Bazen plan yapıyor, bazen işleri akışına bırakıyorsun. Araştırmalarda bir işi ne zaman ve nerede yapacağına önceden karar vermek, hedefe ulaşmayı kolaylaştıran yollardan biri.',
        'Çocuğunuz bazen plan yapıyor, bazen işleri akışına bırakıyor. Araştırmalarda bir işi ne zaman ve nerede yapacağına önceden karar vermek, hedefe ulaşmayı kolaylaştıran yollardan biri.',
        ['Yoğun günlerde işlerini önem sırasına koy.'],
        ['Yoğun dönemlerde neyin önce yapılacağını birlikte konuşun.'],
      ),
      high: p(
        'Planlı çalışma',
        'Yapacaklarını çoğunlukla planlıyor ve önem sırasına koyuyorsun. Araştırmalarda zaman yönetimi hem başarıyla hem de (biraz daha güçlü biçimde) kendini iyi hissetmeyle ilişkili. Planlarının esnek olabileceğini, aksayan günlerin de olağan olduğunu unutma.',
        'Çocuğunuz yapacaklarını çoğunlukla planlıyor ve önem sırasına koyuyor. Araştırmalarda zaman yönetimi hem başarıyla hem de (biraz daha güçlü biçimde) kendini iyi hissetmeyle ilişkili. Planların esnek olabileceğini, aksayan günlerin de olağan olduğunu ona hatırlatabilirsiniz.',
        ['Planına dinlenme zamanını da ekle.'],
        ['Planlarının esnek olabileceğini hatırlatın.'],
      ),
    },
    estimation: {
      low: p(
        'Süreyi kısa tahmin etme',
        'İşlerin ne kadar süreceğini çoğu zaman olduğundan kısa tahmin ediyor ve gün içinde zamanın nereye gittiğini fark etmekte zorlanıyorsun. Bu çok insani bir yanılgı: bir araştırmada bitirme tezi yazan üniversite öğrencilerinin üçte birinden azı, tezini kendi tahmin ettiği sürede bitirebildi.',
        'Çocuğunuz işlerin ne kadar süreceğini çoğu zaman olduğundan kısa tahmin ediyor ve gün içinde zamanın nereye gittiğini fark etmekte zorlanıyor. Bu çok insani bir yanılgıdır: bir araştırmada bitirme tezi yazan üniversite öğrencilerinin üçte birinden azı, tezini kendi tahmin ettiği sürede bitirebildi.',
        ['Bir işin süresini tahmin et, sonra gerçek süreyi ölç.'],
        ['Bir işin ne kadar süreceğini birlikte tahmin edip sonra karşılaştırın.'],
        'İşlerin ne kadar süreceğini çoğu zaman olduğundan kısa tahmin ediyor ve gün içinde zamanın nereye gittiğini fark etmekte zorlanıyorsun. Bu çok insani bir yanılgı: bir araştırmada bitirme tezi yazan kişilerin üçte birinden azı, tezini kendi tahmin ettiği sürede bitirebildi.',
      ),
      average: p(
        'Süreyi bazen isabetli tahmin etme',
        'Bazı işlerin süresini isabetli tahmin ediyor, bazılarında yanılıyorsun. Özellikle uzun ya da yeni işlerde süre kolayca kısa tahmin edilebilir.',
        'Çocuğunuz bazı işlerin süresini isabetli tahmin ediyor, bazılarında yanılıyor. Özellikle uzun ya da yeni işlerde süre kolayca kısa tahmin edilebilir.',
        ['Uzun işlerde tahmin ettiğin süreye pay ekle.'],
        ['Uzun işlerde süreyi birlikte, pay bırakarak planlayın.'],
      ),
      high: p(
        'Süreyi gerçekçi tahmin etme',
        'Bir işin ne kadar süreceğini çoğunlukla isabetli tahmin ediyor ve zamanın nereye gittiğinin farkında oluyorsun. İnsanların çoğu süreyi kısa tahmin etme eğilimindedir; geçmiş deneyimlerini hesaba katman bu yanılgıdan korunmana yardım edebilir.',
        'Çocuğunuz bir işin ne kadar süreceğini çoğunlukla isabetli tahmin ediyor ve zamanın nereye gittiğinin farkında oluyor. İnsanların çoğu süreyi kısa tahmin etme eğilimindedir; geçmiş deneyimlerini hesaba katması bu yanılgıdan korunmasına yardım edebilir.',
        ['Yeni ve büyük işlerde de geçmiş deneyimini hesaba katmayı sürdür.'],
        ['Gerçekçi planlarını fark ettiğinizi söyleyin.'],
      ),
    },
    focus: {
      low: p(
        'Dikkat dağıtıcılara kolay kapılma',
        'Bir işle uğraşırken telefon, aklına gelen başka bir şey ya da daha eğlenceli bir seçenek dikkatini kolayca dağıtıyor. Araştırmalarda dikkatin kolay dağılması ve anlık isteklere kapılma, ertelemeyle en güçlü ilişkili özellikler arasında.',
        'Çocuğunuz bir işle uğraşırken telefon, aklına gelen başka bir şey ya da daha eğlenceli bir seçenek yüzünden dikkatini kolayca kaybediyor. Araştırmalarda dikkatin kolay dağılması ve anlık isteklere kapılma, ertelemeyle en güçlü ilişkili özellikler arasında.',
        ['Bir işe başlamadan telefonunu başka bir odaya koy.'],
        ['Çalışma saatlerinde telefonun başka bir odada durmasını birlikte kararlaştırın.'],
      ),
      average: p(
        'Bazen dikkat dağılması',
        'Bazen bir işe odaklanabiliyor, bazen dikkat dağıtıcılara kapılıyorsun.',
        'Çocuğunuz bazen bir işe odaklanabiliyor, bazen dikkat dağıtıcılara kapılıyor.',
        ['Dikkatinin en çok ne zaman dağıldığını bir hafta not et.'],
        ['Dikkatinin ne zaman dağıldığını yargılamadan birlikte gözlemleyin.'],
      ),
      high: p(
        'Odağı koruyabilme',
        'Bir işe oturduğunda dikkat dağıtıcıları çoğunlukla uzak tutabiliyorsun. Araştırmalarda dikkatin kolay dağılması ertelemeyle güçlü biçimde ilişkili bulunuyor; odağını koruyabilmen işlerini zamanında yürütmeni kolaylaştıran bir beceri.',
        'Çocuğunuz bir işe oturduğunda dikkat dağıtıcıları çoğunlukla uzak tutabiliyor. Araştırmalarda dikkatin kolay dağılması ertelemeyle güçlü biçimde ilişkili bulunuyor; odağını koruyabilmesi işlerini zamanında yürütmesini kolaylaştıran bir beceri.',
        ['Dikkat dağıtıcıları uzak tutma alışkanlığını sürdür.'],
        ['Çalışırken onu bölmemeye özen gösterin.'],
      ),
    },
    control: {
      low: p(
        'İşlerin altında ezilmiş hissetme',
        'Yetiştirmen gereken işlerin altında ezildiğini, zamanının kontrolünün sende olmadığını sık sık hissediyorsun. Araştırmalarda zamanı kontrol edebilme duygusu, zaman yönetimi özellikleri arasında daha az stres ve daha yüksek doyumla en çok ilişkili olanı. Bu yük seni çok zorluyorsa güvendiğin biriyle ya da bir rehber öğretmenle konuşmak iyi gelebilir.',
        'Çocuğunuz yetiştirmesi gereken işlerin altında ezildiğini, zamanının kontrolünün kendinde olmadığını sık sık hissediyor. Araştırmalarda zamanı kontrol edebilme duygusu, zaman yönetimi özellikleri arasında daha az stres ve daha yüksek doyumla en çok ilişkili olanı. Bu yük onu çok zorluyorsa okulun rehberlik servisinden (psikolojik danışman) destek alabilirsiniz.',
        ['Bütün işlerini bir kâğıda yaz ve en önemli tek işi seç.'],
        ['İşlerini birlikte yazıya döküp en önemli tek işi seçmesine yardım edin.'],
        'Yetiştirmen gereken işlerin altında ezildiğini, zamanının kontrolünün sende olmadığını sık sık hissediyorsun. Araştırmalarda zamanı kontrol edebilme duygusu, zaman yönetimi özellikleri arasında daha az stres ve daha yüksek doyumla en çok ilişkili olanı. Bu yük seni çok zorluyorsa güvendiğin biriyle konuşmak ya da bir uzmandan destek almak iyi gelebilir.',
      ),
      average: p(
        'Zaman zaman kontrol duygusu',
        'Bazen zamanının kontrolünün sende olduğunu, bazen işlerin üst üste bindiğini hissediyorsun. Araştırmalarda bu kontrol duygusu, zaman yönetimi özellikleri arasında stresle en çok ilişkili olanı.',
        'Çocuğunuz bazen zamanının kontrolünün kendinde olduğunu, bazen işlerin üst üste bindiğini hissediyor. Araştırmalarda bu kontrol duygusu, zaman yönetimi özellikleri arasında stresle en çok ilişkili olanı.',
        ['Yoğun günlerde işlerini yazıya dök.'],
        ['Yoğun dönemlerde işleri birlikte önem sırasına koyun.'],
      ),
      high: p(
        'Zamanını yönettiğini hissetme',
        'Zamanının kontrolünün çoğunlukla sende olduğunu hissediyor, dinlenmeye ve sevdiğin şeylere de zaman ayırabiliyorsun. Araştırmalarda bu duygu, zaman yönetimi özellikleri arasında daha az stres ve daha yüksek doyumla en çok ilişkili olanı.',
        'Çocuğunuz zamanının kontrolünün çoğunlukla kendinde olduğunu hissediyor, dinlenmeye ve sevdiği şeylere de zaman ayırabiliyor. Araştırmalarda bu duygu, zaman yönetimi özellikleri arasında daha az stres ve daha yüksek doyumla en çok ilişkili olanı.',
        ['Dinlenme zamanını korumayı sürdür.'],
        ['Dinlenmeye ayırdığı zamana saygı gösterin.'],
      ),
    },
  },
};
