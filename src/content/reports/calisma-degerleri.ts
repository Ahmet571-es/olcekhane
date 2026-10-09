import type { ReportTemplate } from './types';

/**
 * Çalışma Değerleri: rapor metinleri.
 *
 * Dayanaklar (araştırma cümlelerinin her biri bunlardan birine dayanır):
 *  - Lechner ve ark. (2017): Almanya ve Finlandiya'da 20–21 yaşından 25–26 yaşına kadar dört yıl izlenen gençler; iç değerler
 *    (ilginç, çeşitli, anlamlı iş) iki ülkede de ölçeğin en üstüne yakın puanlandı; değerler dört yılda büyük ölçüde korundu.
 *  - Schwartz (2012): değerler kişinin öncelik sırasıdır; bir değeri gözeten davranış bazı değerlerle çatışır, bazılarıyla
 *    uyuşur; yarışan değerler arasındaki denge tutum ve davranışı yönlendirir. Güvenlik (koruma) ile kendi yönünü belirleme
 *    ve yenilik (değişime açıklık); başarı ve güç (kendini öne çıkarma; güç zenginliği de kapsar) ile iyilikseverlik
 *    (kendini aşma) karşıt kutuplardadır.
 *  - Twenge ve ark. (2010): ABD'de lise son sınıf öğrencilerinin %82–88'i ilginç bir işi çok önemli buldu.
 *  - Kristof-Brown, Zimmerman ve Johnson (2005, meta-analiz): kişi ile kurum arasındaki uyum (çoğunlukla değer uyumu
 *    olarak ölçülür) iş doyumuyla (ρ = .44) ve kuruma bağlılıkla (ρ = .51) ilişkili, işten ayrılma niyetiyle ters yönde
 *    ilişkili (ρ = −.35). İlişkiseldir.
 * Yarışan değer çiftleri Schwartz'ın kuramındaki karşıt kutuplara dayanır (güvenlik ile kendi yönünü belirleme ve yenilik;
 * başarı ile iyilikseverlik); iş değerleriyle eşleştirme bizimdir, bu yüzden metinler "değer kuramına göre ... çekebilir"
 * der. Kazanç ile yardım çifti kullanılmaz: iş değerleri araştırmasında kazanç, yardımın değil iç değerlerin karşısındadır.
 * İlkeler: değerlerin doğrusu ya da yanlışı yoktur, hiçbiri öteki değerlerden üstün anlatılmaz; değerler meslek seçmez
 * (meslek için ilgi testlerine yönlendirilir); yarışan değerlerde biri doğru sayılmaz, karar kişiye bırakılır. Gelir,
 * güvence ve çalışma saati gibi koşulların mesleğe, iş yerine ve döneme göre değişebileceği söylenir; belirli meslekler
 * hakkında kesin bilgi verilmez. Metinler okula özgü değildir; yetişkine öğrenci metni gösterilir.
 */

const p = (summary: string, student: string, parent: string, tipsStudent: string[], tipsParent: string[]) => ({
  summary,
  student,
  parent,
  tipsStudent,
  tipsParent,
});

const OVERVIEW =
  'Değerler en önemliden en az önemliye sıralandı; puanlar 1 (hiç önemli değil) ile 5 (son derece önemli) arasındadır. Çoğu kişi birçok değeri önemli bulur; bu yüzden asıl bilgi değerlerin kendi içindeki sırasıdır. Değerlerin doğrusu ya da yanlışı yoktur.';

export const calismaDegerleriReport: ReportTemplate = {
  version: 'calisma-degerleri-1',
  bandLabels: { low: 'Az önemli', average: 'Orta derecede önemli', high: 'Çok önemli' },
  overview: { student: OVERVIEW, parent: OVERVIEW },
  values: {
    tradeoffs: [
      {
        a: 'security',
        b: 'independence',
        title: 'Güvence ile bağımsızlık arasında',
        text: {
          student:
            'Güvence de bağımsızlık da senin için en önemli değerler arasında. Değer kuramına göre güvenliği öne çıkaran seçimlerle kendi kararlarını vermeyi öne çıkaran seçimler farklı yönlere çekebilir: birini öne alan bir seçim, ötekinden biraz vazgeçmeyi gerektirebilir. Bazı işler ikisini birlikte sunabilir; ama iki seçenek arasında kaldığında hangisinin senin için ağır basacağını şimdiden düşünmek işine yarayabilir.',
          parent:
            'Güvence de bağımsızlık da çocuğunuz için en önemli değerler arasında. Değer kuramına göre güvenliği öne çıkaran seçimlerle kendi kararlarını vermeyi öne çıkaran seçimler farklı yönlere çekebilir: birini öne alan bir seçim, ötekinden biraz vazgeçmeyi gerektirebilir. Bazı işler ikisini birlikte sunabilir; iki seçenek arasında kalsa hangisinin ağır basacağını onunla konuşabilirsiniz.',
        },
      },
      {
        a: 'security',
        b: 'learning',
        title: 'Güvence ile yenilik arasında',
        text: {
          student:
            'Güvence de ilgi ve öğrenme de senin için en önemli değerler arasında. Değer kuramına göre yeniliği ve çeşitliliği aramak ile güvenliği ve öngörülebilirliği aramak farklı yönlere çekebilir. Bazı işler ikisini birlikte sunabilir; ama yeni ve belirsiz bir fırsat ile güvenli bir seçenek arasında kaldığında hangisinin ağır basacağını düşünmek işine yarayabilir.',
          parent:
            'Güvence de ilgi ve öğrenme de çocuğunuz için en önemli değerler arasında. Değer kuramına göre yeniliği ve çeşitliliği aramak ile güvenliği ve öngörülebilirliği aramak farklı yönlere çekebilir. Bazı işler ikisini birlikte sunabilir; yeni ve belirsiz bir fırsat ile güvenli bir seçenek arasında kalsa hangisinin ağır basacağını onunla konuşabilirsiniz.',
        },
      },
      {
        a: 'status',
        b: 'helping',
        title: 'Saygınlık ile yardım arasında',
        text: {
          student:
            'Saygınlık ve ilerleme de başkalarına yardım da senin için en önemli değerler arasında. Değer kuramına göre kendi başarısını öne çıkarmak ile başkalarının iyiliğini öne çıkarmak çoğu zaman farklı yönlere çeker. Bu ikisi birçok işte bir arada bulunabilir; ama bir seçimde çatıştıklarında hangisinin ağır basacağını düşünmek işine yarayabilir.',
          parent:
            'Saygınlık ve ilerleme de başkalarına yardım da çocuğunuz için en önemli değerler arasında. Değer kuramına göre kendi başarısını öne çıkarmak ile başkalarının iyiliğini öne çıkarmak çoğu zaman farklı yönlere çeker. Bu ikisi birçok işte bir arada bulunabilir; bir seçimde çatışsalar hangisinin ağır basacağını onunla konuşabilirsiniz.',
        },
      },
    ],
    lower: {
      student:
        'Sıralamanın sonunda {değerler} yer alıyor. Bu, {o} senin için önemsiz olduğu anlamına gelmez; ama iki iş arasında seçim yaparken en önem verdiğin değerler daha ağır basabilir. Hangi değerden ne kadar vazgeçebileceğini bilmek seçenekleri karşılaştırmayı kolaylaştırır.',
      parent:
        'Sıralamanın sonunda {değerler} yer alıyor. Bu, {o} çocuğunuz için önemsiz olduğu anlamına gelmez; ama iki iş arasında seçim yaparken en önem verdiği değerler daha ağır basabilir.',
    },
    note: {
      title: { you: 'Bu sonucu nasıl kullanabilirsin?', parent: 'Bu sonuç nasıl kullanılabilir?' },
      text: {
        student:
          'Değerler bir meslek seçmez; meslekleri tanırken neye bakacağını gösterir. Aynı değer farklı mesleklerde, aynı meslekte de farklı iş yerlerinde karşılanabilir. Araştırmalarda kişinin değerleriyle çalıştığı kurum arasındaki uyum, daha yüksek iş doyumu ve kuruma bağlılıkla ilişkili bulunmuş. Hangi meslekleri tanımak isteyebileceğini görmek için ilgi testlerinden de yararlanabilirsin.',
        parent:
          'Değerler bir meslek seçmez; meslekleri tanırken neye bakılabileceğini gösterir. Aynı değer farklı mesleklerde, aynı meslekte de farklı iş yerlerinde karşılanabilir. Araştırmalarda kişinin değerleriyle çalıştığı kurum arasındaki uyum, daha yüksek iş doyumu ve kuruma bağlılıkla ilişkili bulunmuş. Çocuğunuzun hangi meslekleri tanımak isteyebileceğini görmek için ilgi testlerinden de yararlanabilirsiniz.',
        adult:
          'Değerler bir meslek seçmez; bir mesleği, bir iş teklifini ya da bugünkü işini değerlendirirken neye bakacağını gösterir. Aynı değer farklı mesleklerde, aynı meslekte de farklı iş yerlerinde karşılanabilir. Araştırmalarda kişinin değerleriyle çalıştığı kurum arasındaki uyum, daha yüksek iş doyumu ve kuruma bağlılıkla ilişkili bulunmuş. Hangi meslekleri tanımak isteyebileceğini görmek için ilgi testlerinden de yararlanabilirsin.',
      },
    },
  },
  scales: {
    learning: {
      high: p(
        'İlginç ve öğretici bir işi önemsiyor',
        'Bir işte ilginç şeylerle uğraşmak, çeşitli işler yapmak ve sürekli yeni şeyler öğrenmek senin için çok önemli. Tekdüze bir iş, başka koşulları iyi olsa bile seni zamanla sıkabilir. Araştırmalarda gençlerin ve genç erişkinlerin çoğu ilginç bir işi çok önemli bulmuş; bu değerin sıralamanın üstünde olması yaygındır; bir işi seçerken sıralamadaki öteki değerlerine de bakmak işine yarayabilir.',
        'Çocuğunuz için bir işte ilginç şeylerle uğraşmak, çeşitli işler yapmak ve sürekli yeni şeyler öğrenmek çok önemli. Tekdüze bir iş, başka koşulları iyi olsa bile onu zamanla sıkabilir. Araştırmalarda gençlerin ve genç erişkinlerin çoğu ilginç bir işi çok önemli bulmuş; bu değerin sıralamanın üstünde olması yaygındır; meslekleri tanırken sıralamadaki öteki değerlere de bakmak yararlı olabilir.',
        ['Bir işte bir günün nasıl geçtiğini öğren.'],
        ['Tanıdığınız işlerde bir günün nasıl geçtiğini birlikte konuşun.'],
      ),
      average: p(
        'İlgi ve öğrenmeye orta derecede önem veriyor',
        'İşin ilginç olması ve yeni şeyler öğretmesi senin için orta derecede önemli; bir işi değerlendirirken tek başına belirleyici olmayabilir.',
        'İşin ilginç olması ve yeni şeyler öğretmesi çocuğunuz için orta derecede önemli; bir işi değerlendirirken tek başına belirleyici olmayabilir.',
        ['Seni bir işte en çok neyin sıkacağını düşün.'],
        ['Bir işte onu en çok neyin sıkacağını sorun.'],
      ),
      low: p(
        'İşin ilginç olmasını öncelik saymıyor',
        'İşin ilginç ya da öğretici olması senin için öncelikli değil. Bu, öğrenmeyi sevmediğin anlamına gelmez; bir işi değerlendirirken başka şeylere daha çok bakıyorsun.',
        'İşin ilginç ya da öğretici olması çocuğunuz için öncelikli değil. Bu, öğrenmeyi sevmediği anlamına gelmez; bir işi değerlendirirken başka şeylere daha çok bakıyor.',
        ['Bir işi değerlendirirken önce neye baktığını fark et.'],
        ['Bir işi değerlendirirken önce neye baktığını sorun.'],
      ),
    },
    income: {
      high: p(
        'İyi kazanmayı önemsiyor',
        'Emeğinin karşılığını iyi bir gelirle almak ve gelirinin zamanla artması senin için çok önemli. Gelir, insanın hayatını nasıl kurabileceğini de etkiler. Gelir yalnızca mesleğe göre değil; iş yerine, deneyime ve şehre göre de değişebilir; bu yüzden bir mesleğin yalnızca ortalama gelirine değil, bu farklara da bakmak işine yarayabilir.',
        'Çocuğunuz için emeğinin karşılığını iyi bir gelirle almak ve gelirinin zamanla artması çok önemli. Gelir, insanın hayatını nasıl kurabileceğini de etkiler. Gelir yalnızca mesleğe göre değil; iş yerine, deneyime ve şehre göre de değişebilir; meslekleri birlikte araştırırken bu farklara da bakabilirsiniz.',
        ['Bir mesleğin başlangıçtaki ve yıllar sonraki gelirini karşılaştır.'],
        ['Meslekleri araştırırken gelirin nelere göre değiştiğini birlikte konuşun.'],
      ),
      average: p(
        'Kazanca orta derecede önem veriyor',
        'İyi kazanmak senin için orta derecede önemli; bir işi değerlendirirken tek ölçütün olmayabilir.',
        'İyi kazanmak çocuğunuz için orta derecede önemli; bir işi değerlendirirken tek ölçütü olmayabilir.',
        ['Kazançtan hangi koşulda vazgeçebileceğini düşün.'],
        ['Kazancın yanında neyi önemsediğini sorun.'],
      ),
      low: p(
        'Kazancı öncelik saymıyor',
        'Çok kazanmak senin için öncelikli değil. Bu, paranın önemsiz olduğu anlamına gelmez; bir işi değerlendirirken başka şeyler daha ağır basıyor.',
        'Çok kazanmak çocuğunuz için öncelikli değil. Bu, paranın önemsiz olduğu anlamına gelmez; bir işi değerlendirirken başka şeyler daha ağır basıyor.',
        ['Bir işte senin için paradan önce neyin geldiğini yaz.'],
        ['Bir işte onun için paradan önce neyin geldiğini sorun.'],
      ),
    },
    helping: {
      high: p(
        'Başkalarına yararlı olmayı önemsiyor',
        'Yaptığın işle insanların hayatını kolaylaştırmak, ihtiyacı olanlara destek olmak ve topluma yararlı olmak senin için çok önemli. Başkalarına yararlı olmak tek bir meslek türüyle sınırlı değildir: insanlarla doğrudan çalışılan işlerde olduğu kadar, insanların hayatını kolaylaştıran ürün ve hizmetler üreten işlerde de mümkündür.',
        'Çocuğunuz için yaptığı işle insanların hayatını kolaylaştırmak, ihtiyacı olanlara destek olmak ve topluma yararlı olmak çok önemli. Başkalarına yararlı olmak tek bir meslek türüyle sınırlı değildir: insanlarla doğrudan çalışılan işlerde olduğu kadar, insanların hayatını kolaylaştıran ürün ve hizmetler üreten işlerde de mümkündür.',
        ['Bir işin kime ve nasıl yararı dokunduğunu sor.'],
        ['Tanıdığınız işlerin kime yararı dokunduğunu birlikte konuşun.'],
      ),
      average: p(
        'Başkalarına yardıma orta derecede önem veriyor',
        'Yaptığın işin başkalarına yararlı olması senin için orta derecede önemli; bir işi değerlendirirken tek başına belirleyici olmayabilir.',
        'Yaptığı işin başkalarına yararlı olması çocuğunuz için orta derecede önemli; bir işi değerlendirirken tek başına belirleyici olmayabilir.',
        ['Bir işin kime yararı dokunduğunu düşün.'],
        ['Bir işin kime yararı dokunduğunu birlikte konuşun.'],
      ),
      low: p(
        'Başkalarına yardımı öncelik saymıyor',
        'İşinin başkalarına yararlı olması senin için öncelikli değil. Bu, başkalarını önemsemediğin anlamına gelmez; bir işi değerlendirirken başka şeylere daha çok bakıyorsun.',
        'İşinin başkalarına yararlı olması çocuğunuz için öncelikli değil. Bu, başkalarını önemsemediği anlamına gelmez; bir işi değerlendirirken başka şeylere daha çok bakıyor.',
        ['Bir işi değerlendirirken önce neye baktığını fark et.'],
        ['Bir işi değerlendirirken önce neye baktığını sorun.'],
      ),
    },
    independence: {
      high: p(
        'Kendi kararlarını vermeyi önemsiyor',
        'İşini nasıl yapacağına kendin karar vermek, her adımda onay beklememek ve sürekli denetlenmemek senin için çok önemli. Birçok işte bağımsızlık deneyimle artabilir: başlangıçta kurallara ve denetime daha çok uyulan işlerde bile zamanla daha çok söz sahibi olunabilir. Kendi işini kurmak ya da serbest çalışmak da bu değerin karşılanabileceği yollardan biridir.',
        'Çocuğunuz için işini nasıl yapacağına kendisi karar vermek, her adımda onay beklememek ve sürekli denetlenmemek çok önemli. Birçok işte bağımsızlık deneyimle artabilir: başlangıçta kurallara ve denetime daha çok uyulan işlerde bile zamanla daha çok söz sahibi olunabilir. Kendi işini kurmak ya da serbest çalışmak da bu değerin karşılanabileceği yollardan biridir.',
        ['Bir işte ne kadar kendi başına karar verildiğini sor.'],
        ['Kendi kararlarını verebileceği küçük sorumluluklar verin.'],
      ),
      average: p(
        'Bağımsızlığa orta derecede önem veriyor',
        'Kendi kararlarını verebilmek senin için önemli ama belirli kurallar ve yönlendirmeyle çalışmak da sana uyabilir.',
        'Kendi kararlarını verebilmek çocuğunuz için önemli ama belirli kurallar ve yönlendirmeyle çalışmak da ona uyabilir.',
        ['Hangi işlerde yönlendirilmek istediğini fark et.'],
        ['Hangi işlerde yönlendirilmek istediğini sorun.'],
      ),
      low: p(
        'Bağımsızlığı öncelik saymıyor',
        'Her kararı kendin vermek senin için öncelikli değil; açık kuralları ve yönlendirmesi olan bir işte de rahat edebilirsin.',
        'Her kararı kendisi vermek çocuğunuz için öncelikli değil; açık kuralları ve yönlendirmesi olan bir işte de rahat edebilir.',
        ['Yönlendirmenin sana nasıl yardım ettiğini fark et.'],
        ['Hangi durumlarda yönlendirilmeyi sevdiğini sorun.'],
      ),
    },
    security: {
      high: p(
        'Güvenceli bir işi önemsiyor',
        'İşini kaybetme kaygısı taşımamak, düzenli bir gelirin olması ve geleceğini güvenle planlayabilmek senin için çok önemli. Bir işin güvencesi yalnızca mesleğe değil, iş yerine, sözleşmenin türüne ve o alanda ne kadar iş bulunduğuna da bağlı olabilir.',
        'Çocuğunuz için işini kaybetme kaygısı taşımamak, düzenli bir gelirinin olması ve geleceğini güvenle planlayabilmek çok önemli. Bir işin güvencesi yalnızca mesleğe değil, iş yerine, sözleşmenin türüne ve o alanda ne kadar iş bulunduğuna da bağlı olabilir.',
        ['Bir alanda iş bulmanın ne kadar kolay olduğunu sor.'],
        ['Güvencenin nelere bağlı olduğunu birlikte konuşun.'],
      ),
      average: p(
        'Güvenceye orta derecede önem veriyor',
        'Güvenceli bir iş senin için orta derecede önemli; biraz belirsizliği de göze alabilirsin.',
        'Güvenceli bir iş çocuğunuz için orta derecede önemli; biraz belirsizliği de göze alabilir.',
        ['Ne kadar belirsizliği göze alabileceğini düşün.'],
        ['Belirsizlik hakkında ne düşündüğünü sorun.'],
      ),
      low: p(
        'Güvenceyi öncelik saymıyor',
        'Güvence senin için öncelikli değil; belirsizliği olan ama başka açılardan sana uyan bir işi göze alabilirsin.',
        'Güvence çocuğunuz için öncelikli değil; belirsizliği olan ama başka açılardan ona uyan bir işi göze alabilir.',
        ['Belirsizliği hangi koşulda göze alacağını düşün.'],
        ['Belirsizliği hangi koşulda göze alacağını sorun.'],
      ),
    },
    team: {
      high: p(
        'Birlikte çalışmayı önemsiyor',
        'Bir ekiple çalışmak, çalışma arkadaşlarınla iyi ilişkiler kurmak ve kendini bir topluluğun parçası gibi hissetmek senin için çok önemli. Aynı meslekte bile bazı işler günün çoğunu başkalarıyla, bazıları tek başına geçirmeyi gerektirebilir; bu yüzden bu değer, iş yerini seçerken de yol gösterebilir.',
        'Çocuğunuz için bir ekiple çalışmak, çalışma arkadaşlarıyla iyi ilişkiler kurmak ve kendini bir topluluğun parçası gibi hissetmek çok önemli. Aynı meslekte bile bazı işler günün çoğunu başkalarıyla, bazıları tek başına geçirmeyi gerektirebilir; bu yüzden bu değer, iş yerini seçerken de yol gösterebilir.',
        ['Bir işte günün ne kadarının başkalarıyla geçtiğini sor.'],
        ['Ekip çalışması gerektiren etkinlikleri destekleyin.'],
      ),
      average: p(
        'Birlikte çalışmaya orta derecede önem veriyor',
        'Başkalarıyla birlikte çalışmak senin için önemli ama tek başına çalışmak da sana uyabilir.',
        'Başkalarıyla birlikte çalışmak çocuğunuz için önemli ama tek başına çalışmak da ona uyabilir.',
        ['Hangi işleri tek başına, hangilerini birlikte sevdiğini fark et.'],
        ['Hangi işleri tek başına yapmayı sevdiğini sorun.'],
      ),
      low: p(
        'Birlikte çalışmayı öncelik saymıyor',
        'Bir ekibin parçası olmak senin için öncelikli değil; kendi başına çalışabileceğin işlerde de rahat edebilirsin.',
        'Bir ekibin parçası olmak çocuğunuz için öncelikli değil; kendi başına çalışabileceği işlerde de rahat edebilir.',
        ['Tek başına çalışırken neyin iyi gittiğini fark et.'],
        ['Tek başına mı, başkalarıyla mı çalışmayı sevdiğini sorun.'],
      ),
    },
    status: {
      high: p(
        'Saygınlık ve ilerlemeyi önemsiyor',
        'Yaptığın işin saygı görmesi, başardıklarının fark edilmesi ve zamanla daha üst görevlere yükselmek senin için çok önemli. İlerlemenin yolu işten işe değişir: bazı alanlarda belirli basamaklarla, bazılarında deneyimle ve ortaya konan işlerle yükselinir.',
        'Çocuğunuz için yaptığı işin saygı görmesi, başardıklarının fark edilmesi ve zamanla daha üst görevlere yükselmek çok önemli. İlerlemenin yolu işten işe değişir: bazı alanlarda belirli basamaklarla, bazılarında deneyimle ve ortaya konan işlerle yükselinir.',
        ['Bir alanda nasıl ilerlendiğini sor.'],
        ['Başardıklarını fark ettiğinizi söyleyin.'],
      ),
      average: p(
        'Saygınlığa orta derecede önem veriyor',
        'Takdir edilmek ve ilerlemek senin için orta derecede önemli; bir işi değerlendirirken tek başına belirleyici olmayabilir.',
        'Takdir edilmek ve ilerlemek çocuğunuz için orta derecede önemli; bir işi değerlendirirken tek başına belirleyici olmayabilir.',
        ['İlerlemenin senin için ne anlama geldiğini düşün.'],
        ['İlerlemenin onun için ne anlama geldiğini sorun.'],
      ),
      low: p(
        'Saygınlığı öncelik saymıyor',
        'Tanınmak ya da üst görevlere yükselmek senin için öncelikli değil; işin kendisi ya da başka koşulları daha ağır basıyor.',
        'Tanınmak ya da üst görevlere yükselmek çocuğunuz için öncelikli değil; işin kendisi ya da başka koşulları daha ağır basıyor.',
        ['Bir işte seni neyin memnun edeceğini düşün.'],
        ['Bir işte onu neyin memnun edeceğini sorun.'],
      ),
    },
    balance: {
      high: p(
        'İş dışındaki hayatını önemsiyor',
        'İş dışında sevdiklerine, hobilerine ve dinlenmeye zaman ayırabilmek senin için çok önemli. Çalışma saatleri ve iş yükü mesleğe, iş yerine ve dönemlere göre çok değişebilir; bu yüzden bir işi değerlendirirken ne kadar ve ne zaman çalışıldığına da bakmak işine yarayabilir.',
        'Çocuğunuz için iş dışında sevdiklerine, hobilerine ve dinlenmeye zaman ayırabilmek çok önemli. Çalışma saatleri ve iş yükü mesleğe, iş yerine ve dönemlere göre çok değişebilir; bu yüzden bir işi değerlendirirken ne kadar ve ne zaman çalışıldığına da bakılabilir.',
        ['Bir işte haftada kaç saat çalışıldığını sor.'],
        ['İş ve dinlenme dengesini onunla konuşun.'],
      ),
      average: p(
        'Yaşam dengesine orta derecede önem veriyor',
        'İş dışındaki hayatına zaman kalması senin için önemli ama yeri geldiğinde daha yoğun çalışmayı da göze alabilirsin.',
        'İş dışındaki hayatına zaman kalması çocuğunuz için önemli ama yeri geldiğinde daha yoğun çalışmayı da göze alabilir.',
        ['Hangi koşulda yoğun çalışmayı göze alacağını düşün.'],
        ['Yoğun dönemler hakkında ne düşündüğünü sorun.'],
      ),
      low: p(
        'Yaşam dengesini öncelik saymıyor',
        'İş dışında çok zaman kalması senin için öncelikli değil; sana uyan bir iş için uzun saatler çalışmayı göze alabilirsin. Yine de dinlenmeye zaman ayırmak herkes için önemlidir.',
        'İş dışında çok zaman kalması çocuğunuz için öncelikli değil; ona uyan bir iş için uzun saatler çalışmayı göze alabilir. Yine de dinlenmeye zaman ayırmak herkes için önemlidir.',
        ['Dinlenmeye de zaman ayırmayı unutma.'],
        ['Dinlenmeye de zaman ayırmasını hatırlatın.'],
      ),
    },
  },
};
