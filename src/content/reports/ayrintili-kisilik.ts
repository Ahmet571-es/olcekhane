import type { BandText, ReportTemplate } from './types';

/**
 * Ayrıntılı Kişilik Profili rapor metinleri.
 * İlkeler (Beş Faktör Kişilik Profili ile aynı): kişilik boyutlarında "iyi" ya da "kötü" uç yoktur; her tarzın güçlü
 * yanı anlatılır. Etiketleme yapılmaz; sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye
 * "Çocuğunuz ... belirtiyor" dili kullanılır. Adil davranma, uzlaşmacılık ve görev bilinci gibi değer yüklü alt
 * özelliklerde düşük düzey suçlamadan, gelişime açık bir dille anlatılır.
 * Boyut metinleri iki üç cümle, alt özellik metinleri tek cümledir. Öneri listeleri (kapsamlı rapor için) bu testte
 * henüz yazılmadı; basit raporda gösterilmez.
 * Destek kutusu: Duygusal Denge boyutu ve İç huzuru alt özelliği düşük düzeydeyse gösterilir.
 * Yetişkin raporu öğrenci metinlerini kullanır; öğrenci metni okula ya da ergenliğe özgü olduğunda yetişkin metni
 * (`adult`) ayrıca yazılmıştır.
 */
const t = (summary: string, student: string, parent: string, extra?: { support?: boolean; adult?: string }): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(extra?.adult ? { adult: extra.adult } : {}),
  ...(extra?.support ? { support: true } : {}),
});

export const ayrintiliKisilikReport: ReportTemplate = {
  version: 'ayrintili-kisilik-rapor-2',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  scales: {
    /* ---------- Boyutlar ---------- */
    extraversion: {
      high: t(
        'Sosyal ve enerjik',
        'Genel olarak insanlarla birlikte olmaktan, hareketten ve heyecandan enerji aldığını söylüyorsun. Hangi yönlerinin öne çıktığını aşağıdaki alt özelliklerde görebilirsin.',
        'Çocuğunuz genel olarak insanlarla birlikte olmaktan, hareketten ve heyecandan enerji aldığını belirtiyor. Hangi yönlerinin öne çıktığı aşağıdaki alt özelliklerde görülüyor.',
      ),
      average: t(
        'Duruma göre sosyal',
        'İnsanlarla birlikte olmakla kendi başına kalmak arasında dengeli bir yerdesin; duruma göre ikisinden de keyif alabiliyorsun. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz insanlarla birlikte olmakla kendi başına kalmak arasında dengeli bir tarz tanımlıyor; duruma göre ikisinden de keyif alabildiğini belirtiyor.',
      ),
      low: t(
        'Sakin, kendi alanını seven',
        'Genel olarak kalabalık ve hareketli ortamlar yerine sakin ortamları ya da kendi başına olmayı tercih ettiğini söylüyorsun. Bu bir eksiklik değil; sakin ortamlar birçok kişiye odaklanmak ve düşünmek için alan açar.',
        'Çocuğunuz genel olarak kalabalık ve hareketli ortamlar yerine sakin ortamları ya da kendi başına olmayı tercih ettiğini belirtiyor. Bu bir eksiklik değildir; birçok kişi sakin ortamlarda daha iyi odaklanır.',
      ),
    },
    agreeableness: {
      high: t(
        'Anlayışlı ve uyumlu',
        'Genel olarak insanlarla güvene dayalı, anlayışlı ve uyumlu ilişkiler kurduğunu söylüyorsun. Hangi yönlerinin öne çıktığını aşağıdaki alt özelliklerde görebilirsin.',
        'Çocuğunuz genel olarak insanlarla güvene dayalı, anlayışlı ve uyumlu ilişkiler kurduğunu belirtiyor.',
      ),
      average: t(
        'Duruma göre uzlaşan',
        'Başkalarını gözetmekle kendi ihtiyaçlarını gözetmek arasında dengeli bir yerdesin; duruma göre uzlaşabiliyorsun. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz başkalarını gözetmekle kendi ihtiyaçlarını gözetmek arasında dengeli bir tarz tanımlıyor; duruma göre uzlaşabildiğini belirtiyor.',
      ),
      low: t(
        'Kendi bakış açısını gözeten',
        'Genel olarak ilişkilerde önce kendi bakış açını ve ihtiyaçlarını gözettiğini söylüyorsun. Karşındakinin bakış açısını da hesaba kattığında ilişkilerin daha da güçlenir.',
        'Çocuğunuz ilişkilerde genel olarak önce kendi bakış açısını ve ihtiyaçlarını gözettiğini belirtiyor; karşısındakinin duygularını da gözetmesi için onu destekleyebilirsiniz.',
      ),
    },
    conscientiousness: {
      high: t(
        'Planlı ve kararlı',
        'Genel olarak planlı, güvenilir ve işlerini bitirmeye kararlı olduğunu söylüyorsun. Bu eğilim okulda ve hedeflerine ulaşmada sana güç verir. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz genel olarak planlı, güvenilir ve işlerini bitirmeye kararlı olduğunu belirtiyor.',
        {
          adult:
            'Genel olarak planlı, güvenilir ve işlerini bitirmeye kararlı olduğunu söylüyorsun. Bu eğilim işinde, eğitiminde ve hedeflerine ulaşmada sana güç verir. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        },
      ),
      average: t(
        'Çoğu zaman planlı',
        'Çoğu zaman planlı ve sorumlu davranıyor, bazı durumlarda ise daha esnek hareket ediyorsun. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz çoğu zaman planlı ve sorumlu davrandığını, bazı durumlarda ise daha esnek hareket ettiğini belirtiyor.',
      ),
      low: t(
        'Esnek, anlık hareket eden',
        'Genel olarak planlara bağlı kalmak yerine esnek ve anlık hareket etmeyi tercih ettiğini söylüyorsun. Bu esneklik bazı durumlarda avantaj olabilir; önemli işlerde küçük planlar ve hatırlatıcılar ise işini epey kolaylaştırır.',
        'Çocuğunuz genel olarak planlara bağlı kalmak yerine esnek ve anlık hareket etmeyi tercih ettiğini belirtiyor. Ödev ve sınav gibi önemli işlerde birlikte küçük planlar yapmak ona destek olabilir.',
      ),
    },
    emotional_stability: {
      high: t(
        'Sakin, kolay sarsılmayan',
        'Genel olarak stresli ve zor anlarda sakin kalabildiğini ve çabuk toparlandığını söylüyorsun. Bu, sınav gibi baskılı durumlarda sana güç veren bir özellik. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz genel olarak stresli ve zor anlarda sakin kalabildiğini ve çabuk toparlandığını belirtiyor.',
        {
          adult:
            'Genel olarak stresli ve zor anlarda sakin kalabildiğini ve çabuk toparlandığını söylüyorsun. Bu, baskı altında kaldığın dönemlerde sana güç veren bir özellik. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        },
      ),
      average: t(
        'Çoğu zaman dengeli',
        'Çoğu zaman dengelisin; bazı durumlar ise seni daha çok gerebiliyor ya da üzebiliyor. Bu herkes için olağan. Seni en çok neyin zorladığını aşağıdaki alt özelliklerde görebilirsin.',
        'Çocuğunuz çoğu zaman dengeli olduğunu, bazı durumlarda ise daha çok gerildiğini ya da üzüldüğünü belirtiyor. Bu, ergenlikte olağan bir durumdur.',
      ),
      low: t(
        'Stresten kolay etkilenen',
        'Endişe, öfke ya da hüzün gibi duyguları sık yaşadığını ve stresli durumlardan kolayca etkilendiğini söylüyorsun. Bu duygularla baş etmeyi öğrenmek mümkün; seni zorluyorsa güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz endişe, öfke ya da hüzün gibi duyguları sık yaşadığını ve stresli durumlardan kolayca etkilendiğini belirtiyor. Bu sonuç bir tanı değildir; ancak bu duyguların ne kadar süredir devam ettiğini ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir.',
        {
          support: true,
          adult:
            'Endişe, öfke ya da hüzün gibi duyguları sık yaşadığını ve stresli durumlardan kolayca etkilendiğini söylüyorsun. Bu duygularla baş etmeyi öğrenmek mümkün; seni zorluyorsa güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
    },
    openness: {
      high: t(
        'Meraklı ve yeniliğe açık',
        'Genel olarak hayal gücüne, sanata, duygulara, yeniliklere ve fikirlere açık olduğunu söylüyorsun. Bu merak öğrenmede ve yaratıcı işlerde sana güç verir. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz genel olarak hayal gücüne, sanata, yeni deneyimlere ve fikirlere açık olduğunu belirtiyor. Bu merak öğrenmede ve yaratıcı işlerde önemli bir güçtür.',
      ),
      average: t(
        'Yeniyle bilineni dengeleyen',
        'Yeni deneyimlerle bildiğin yollar arasında dengeli bir yerdesin: bazı alanlarda meraklı ve yeniliğe açıksın, bazılarında ise alışık olduğun yolları tercih ediyorsun. Hangi yönlerinin öne çıktığını aşağıda görebilirsin.',
        'Çocuğunuz yeni deneyimlere ve fikirlere belli ölçüde açık olduğunu, bazı alanlarda ise alışık olduğu yolları tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Somut ve pratik',
        'Genel olarak soyut fikirler ve yenilikler yerine somut, pratik ve bildiğin konuları tercih ettiğini söylüyorsun. Gerçekçi ve ayağı yere basan bir bakış birçok işte işe yarar.',
        'Çocuğunuz genel olarak soyut fikirler ve yenilikler yerine somut, pratik ve bildiği konuları tercih ettiğini belirtiyor. Gerçekçi ve ayağı yere basan bu tarz birçok alanda işe yarar.',
      ),
    },

    /* ---------- Dışadönüklük alt özellikleri ---------- */
    friendliness: {
      high: t(
        'Kolayca yakınlık kuran',
        'Kolayca arkadaş edindiğini ve insanların arasında rahat olduğunu söylüyorsun.',
        'Çocuğunuz kolayca arkadaş edindiğini ve insanların arasında rahat olduğunu belirtiyor.',
      ),
      average: t(
        'Duruma göre yakınlık kuran',
        'İnsanlarla yakınlık kurmak senin için ne çok kolay ne de zor; duruma ve kişiye göre değişiyor.',
        'Çocuğunuz insanlarla yakınlık kurmanın onun için duruma ve kişiye göre değiştiğini belirtiyor.',
      ),
      low: t(
        'Zamanla açılan',
        'İnsanlarla yakınlık kurmak için zamana ihtiyaç duyduğunu ve başkalarıyla arana biraz mesafe koymayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz insanlarla yakınlık kurmak için zamana ihtiyaç duyduğunu ve biraz mesafeli durmayı tercih ettiğini belirtiyor.',
      ),
    },
    gregariousness: {
      high: t(
        'Kalabalığı seven',
        'Kalabalık ortamlardan, kutlamalardan ve birçok farklı insanla bir arada olmaktan hoşlandığını söylüyorsun.',
        'Çocuğunuz kalabalık ortamlardan ve birçok farklı insanla bir arada olmaktan hoşlandığını belirtiyor.',
      ),
      average: t(
        'Kalabalığa da yalnızlığa da açık',
        'Kalabalık ortamlardan da kendi başına kalmaktan da duruma göre keyif alabiliyorsun.',
        'Çocuğunuz kalabalık ortamlardan da kendi başına kalmaktan da duruma göre keyif alabildiğini belirtiyor.',
      ),
      low: t(
        'Sakin ortamları seven',
        'Kalabalık yerine sakin ortamları ya da kendi başına olmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz kalabalık yerine sakin ortamları ya da kendi başına olmayı tercih ettiğini belirtiyor.',
      ),
    },
    assertiveness: {
      high: t(
        'İdareyi ele alan',
        'Bir grupta idareyi ele almaktan ve başkalarını yönlendirmekten hoşlandığını söylüyorsun.',
        'Çocuğunuz bir grupta idareyi ele almaktan ve başkalarını yönlendirmekten hoşlandığını belirtiyor.',
      ),
      average: t(
        'Gerektiğinde öne çıkan',
        'Gerektiğinde öne çıkıp yönlendirebildiğini, bazen de yönlendirmeyi başkalarına bırakmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz gerektiğinde öne çıkıp yönlendirebildiğini, bazen de bunu başkalarına bıraktığını belirtiyor.',
      ),
      low: t(
        'Destekleyen rolü seçen',
        'Yönlendirme işini başkalarına bırakmayı ve ekipte destekleyen bir rol üstlenmeyi tercih ettiğini söylüyorsun.',
        'Çocuğunuz yönlendirme işini başkalarına bırakmayı ve ekipte destekleyen bir rol üstlenmeyi tercih ettiğini belirtiyor.',
      ),
    },
    activity: {
      high: t(
        'Hep hareket hâlinde',
        'Hareketli ve dolu bir tempoyu sevdiğini, boş zamanlarında da birçok şeyle meşgul olduğunu söylüyorsun.',
        'Çocuğunuz hareketli ve dolu bir tempoyu sevdiğini, boş zamanlarında da birçok şeyle meşgul olduğunu belirtiyor.',
      ),
      average: t(
        'Dengeli bir tempo',
        'Hareketli dönemlerle dinlenme zamanları arasında dengeli bir tempoda yaşıyorsun.',
        'Çocuğunuz hareketli dönemlerle dinlenme zamanları arasında dengeli bir tempo tanımlıyor.',
      ),
      low: t(
        'Sakin bir tempoyu seven',
        'Acele etmeden, sakin ve rahat bir tempoda yaşamayı sevdiğini söylüyorsun.',
        'Çocuğunuz acele etmeden, sakin ve rahat bir tempoda yaşamayı sevdiğini belirtiyor.',
      ),
    },
    excitement: {
      high: t(
        'Heyecan ve macera arayan',
        'Heyecanı ve macerayı sevdiğini, sıradan olmayan deneyimler aradığını söylüyorsun; heyecan ararken güvenliğini de gözetmek önemli.',
        'Çocuğunuz heyecanı ve macerayı sevdiğini belirtiyor; bu enerjiyi spor ya da eğitmen eşliğinde doğa etkinlikleri gibi güvenli alanlara yöneltmesine destek olabilirsiniz.',
      ),
      average: t(
        'Ölçülü heyecan seven',
        'Zaman zaman heyecan ve yenilik arıyorsun, ama bunu ölçülü bir düzeyde tutmayı tercih ediyorsun.',
        'Çocuğunuz zaman zaman heyecan ve yenilik aradığını, ancak bunu ölçülü bir düzeyde tuttuğunu belirtiyor.',
      ),
      low: t(
        'Sakinlik ve güven arayan',
        'Heyecan ve risk yerine sakin, güvenli ve öngörülebilir deneyimleri tercih ettiğini söylüyorsun.',
        'Çocuğunuz heyecan ve risk yerine sakin, güvenli ve öngörülebilir deneyimleri tercih ettiğini belirtiyor.',
      ),
    },
    cheerfulness: {
      high: t(
        'Neşeli ve keyifli',
        'Sık sık neşeli ve keyifli hissettiğini, hayatın iyi tarafına bakmayı sevdiğini söylüyorsun.',
        'Çocuğunuz sık sık neşeli ve keyifli hissettiğini, hayatın iyi tarafına bakmayı sevdiğini belirtiyor.',
      ),
      average: t(
        'Çoğu zaman keyifli',
        'Neşeli ve keyifli anların var; bazen de daha sakin ya da ciddi bir ruh hâlinde oluyorsun.',
        'Çocuğunuz neşeli anlarının yanında zaman zaman daha sakin ya da ciddi bir ruh hâlinde olduğunu belirtiyor.',
      ),
      low: t(
        'Ciddi ve sakin',
        'Kendini coşkulu ya da çok neşeli biri olarak görmediğini, daha sakin ve ciddi bir tarzın olduğunu söylüyorsun.',
        'Çocuğunuz kendini coşkulu biri olarak görmediğini, daha sakin ve ciddi bir tarzı olduğunu belirtiyor.',
      ),
    },

    /* ---------- Uyumluluk alt özellikleri ---------- */
    trust: {
      high: t(
        'İnsanlara güvenen',
        'İnsanların genellikle iyi niyetli olduğuna inandığını ve onlara kolayca güvendiğini söylüyorsun.',
        'Çocuğunuz insanların genellikle iyi niyetli olduğuna inandığını ve onlara kolayca güvendiğini belirtiyor; güvenin yanında sağlıklı sınırlar koymayı da onunla konuşabilirsiniz.',
      ),
      average: t(
        'Temkinli güvenen',
        'İnsanlara güvenmekle temkinli olmak arasında dengeli bir yerdesin; güvenini zamanla veriyorsun.',
        'Çocuğunuz insanlara güvenmekle temkinli olmak arasında dengeli bir tutum tanımlıyor.',
      ),
      low: t(
        'Kolay güvenmeyen',
        'İnsanlara kolay kolay güvenmediğini ve karşındakini tanıyana kadar temkinli durmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz insanlara kolay kolay güvenmediğini ve temkinli durmayı tercih ettiğini belirtiyor.',
      ),
    },
    morality: {
      high: t(
        'Adil davranan',
        'Başkalarını kendi çıkarın için kullanmadığını ve öne geçmek için hileye başvurmadığını söylüyorsun.',
        'Çocuğunuz başkalarını kendi çıkarı için kullanmadığını ve öne geçmek için hileye başvurmadığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman adil',
        'Çoğu zaman adil davrandığını, bazı durumlarda ise kendi çıkarını öne alabildiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman adil davrandığını, bazı durumlarda ise kendi çıkarını öne alabildiğini belirtiyor.',
      ),
      low: t(
        'Kendi çıkarını öne alabilen',
        'Kazanmak ya da öne geçmek için zaman zaman kendi çıkarını başkalarınınkinin önüne koyabildiğini söylüyorsun; bunun karşındakileri nasıl etkilediğini düşünmek ilişkilerini güçlendirir.',
        'Çocuğunuz öne geçmek için zaman zaman kendi çıkarını başkalarınınkinin önüne koyabildiğini belirtiyor; bunu suçlamadan, farklı durumlar üzerinden birlikte konuşmanız yararlı olabilir.',
      ),
    },
    altruism: {
      high: t(
        'Yardımsever',
        'Başkalarına yardım etmekten hoşlandığını ve onların iyi olup olmadığını önemsediğini söylüyorsun.',
        'Çocuğunuz başkalarına yardım etmekten hoşlandığını ve onların iyi olup olmadığını önemsediğini belirtiyor.',
      ),
      average: t(
        'Gerektiğinde yardım eden',
        'Gerektiğinde başkalarına yardım ediyorsun; bunu kendi işlerinle dengelemeye de özen gösteriyorsun.',
        'Çocuğunuz gerektiğinde başkalarına yardım ettiğini ve bunu kendi işleriyle dengelediğini belirtiyor.',
      ),
      low: t(
        'Kendi işine odaklanan',
        'Başkalarının işlerine ve dertlerine zaman ayırmak yerine kendi işlerine odaklanmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz başkalarının işlerine ve dertlerine zaman ayırmak yerine kendi işlerine odaklanmayı tercih ettiğini belirtiyor.',
      ),
    },
    cooperation: {
      high: t(
        'Uzlaşmacı',
        'Kavga ve çekişmeden kaçındığını, anlaşmazlıkları kırıcı olmadan çözmeye çalıştığını söylüyorsun.',
        'Çocuğunuz kavga ve çekişmeden kaçındığını, anlaşmazlıkları kırıcı olmadan çözmeye çalıştığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman uzlaşan',
        'Çoğu zaman uzlaşmayı tercih ediyorsun; bazen ise tartışmalarda sesin yükselebiliyor.',
        'Çocuğunuz çoğu zaman uzlaşmayı tercih ettiğini, bazen ise tartışmalarda sesinin yükselebildiğini belirtiyor.',
      ),
      low: t(
        'Çekişmekten çekinmeyen',
        'Tartışma ve çekişmelerden kaçınmadığını, öfkelendiğinde kırıcı olabildiğini söylüyorsun; sakinleştikten sonra konuşmak ilişkilerini korur.',
        'Çocuğunuz tartışma ve çekişmelerden kaçınmadığını, öfkelendiğinde kırıcı olabildiğini belirtiyor; sakin bir anda, anlaşmazlıkları çözmenin başka yollarını birlikte konuşabilirsiniz.',
      ),
    },
    modesty: {
      high: t(
        'Alçakgönüllü',
        'Kendini başkalarından üstün görmediğini ve övünmekten kaçındığını söylüyorsun; alçakgönüllü olmak kendi değerini görmene engel olmamalı.',
        'Çocuğunuz kendini başkalarından üstün görmediğini ve övünmekten kaçındığını belirtiyor; başarılarını da görebilmesi için onu takdir etmeye devam edin.',
      ),
      average: t(
        'Ölçülü özgüvenli',
        'Kendine güvenmekle alçakgönüllü olmak arasında dengeli bir yerdesin.',
        'Çocuğunuz kendine güvenmekle alçakgönüllü olmak arasında dengeli bir tutum tanımlıyor.',
      ),
      low: t(
        'Kendine çok güvenen',
        'Kendine yüksek bir değer biçtiğini ve iyi yönlerini açıkça ortaya koyduğunu söylüyorsun; özgüven bir güçtür, başkalarının katkısını da görmek bu gücü artırır.',
        'Çocuğunuz kendine yüksek bir değer biçtiğini ve iyi yönlerini açıkça ortaya koyduğunu belirtiyor; özgüvenini korurken başkalarının katkılarını da görmesini destekleyebilirsiniz.',
      ),
    },
    sympathy: {
      high: t(
        'Şefkatli',
        'Zor durumdaki insanların hâline duyarlı olduğunu ve onlar için üzüldüğünü söylüyorsun.',
        'Çocuğunuz zor durumdaki insanların hâline duyarlı olduğunu ve onlar için üzüldüğünü belirtiyor.',
      ),
      average: t(
        'Duruma göre duyarlı',
        'Zor durumdaki insanlara duyarlısın; bu duyarlılık duruma ve kişiye göre değişiyor.',
        'Çocuğunuz zor durumdaki insanlara duyarlı olduğunu, bu duyarlılığın duruma göre değiştiğini belirtiyor.',
      ),
      low: t(
        'Kolay etkilenmeyen',
        'Zor durumdaki insanların hâlinin seni çok fazla etkilemediğini ve bu konulara pek kafa yormadığını söylüyorsun.',
        'Çocuğunuz zor durumdaki insanların hâlinin onu çok fazla etkilemediğini ve bu konulara pek kafa yormadığını belirtiyor.',
      ),
    },

    /* ---------- Sorumluluk alt özellikleri ---------- */
    self_efficacy: {
      high: t(
        'İşlerin üstesinden gelen',
        'Üstlendiğin işlerin üstesinden gelebildiğine ve işleri nasıl yoluna koyacağını bildiğine inanıyorsun.',
        'Çocuğunuz üstlendiği işlerin üstesinden gelebildiğine ve işleri nasıl yoluna koyacağını bildiğine inandığını belirtiyor.',
      ),
      average: t(
        'Çoğu işte kendine güvenen',
        'Çoğu işin üstesinden gelebildiğine inanıyorsun; bazı işlerde ise kendinden daha az emin oluyorsun.',
        'Çocuğunuz çoğu işin üstesinden gelebildiğine inandığını, bazı işlerde ise kendinden daha az emin olduğunu belirtiyor.',
      ),
      low: t(
        'Kendinden emin olmayan',
        'İşlerin üstesinden gelebileceğinden pek emin olmadığını söylüyorsun; küçük adımlarla başardığın işler bu duyguyu zamanla güçlendirir.',
        'Çocuğunuz işlerin üstesinden gelebileceğinden pek emin olmadığını belirtiyor; küçük ve ulaşılabilir hedeflerle başarı deneyimleri yaşaması bu duyguyu güçlendirebilir.',
      ),
    },
    orderliness: {
      high: t(
        'Derli toplu',
        'Eşyalarını ve çevreni derli toplu tutmayı sevdiğini söylüyorsun.',
        'Çocuğunuz eşyalarını ve çevresini derli toplu tutmayı sevdiğini belirtiyor.',
      ),
      average: t(
        'Duruma göre düzenli',
        'Düzen konusunda ne çok titiz ne de çok dağınıksın; duruma göre değişiyor.',
        'Çocuğunuz düzen konusunda ne çok titiz ne de çok dağınık olduğunu, bunun duruma göre değiştiğini belirtiyor.',
      ),
      low: t(
        'Dağınıklığa aldırmayan',
        'Eşyalarını ortada bırakabildiğini ve düzenin senin için pek öncelik olmadığını söylüyorsun; sık kullandığın şeyler için sabit bir yer belirlemek işini kolaylaştırır.',
        'Çocuğunuz eşyalarını ortada bırakabildiğini ve düzenin onun için pek öncelik olmadığını belirtiyor; sık kullandığı şeyler için birlikte sabit yerler belirlemek işe yarayabilir.',
      ),
    },
    dutifulness: {
      high: t(
        'Sözünün eri',
        'Verdiğin sözleri tuttuğunu, doğruyu söylediğini ve kurallara uyduğunu söylüyorsun.',
        'Çocuğunuz verdiği sözleri tuttuğunu, doğruyu söylediğini ve kurallara uyduğunu belirtiyor.',
      ),
      average: t(
        'Çoğu zaman kurala uyan',
        'Çoğu zaman sözünü tutuyor ve kurallara uyuyorsun; bazen ise kuralları esnettiğin olabiliyor.',
        'Çocuğunuz çoğu zaman sözünü tuttuğunu ve kurallara uyduğunu, bazen ise kuralları esnettiğini belirtiyor.',
      ),
      low: t(
        'Kuralları esneten',
        'Kuralları zaman zaman esnetebildiğini ve verdiğin sözleri her zaman tutamadığını söylüyorsun; sözlerini tutmak, insanların sana güvenmesini kolaylaştırır.',
        'Çocuğunuz kuralları zaman zaman esnetebildiğini ve verdiği sözleri her zaman tutamadığını belirtiyor; kuralların nedenlerini onunla birlikte konuşmak, kurala uymayı bir zorunluluktan çok kendi seçimi hâline getirebilir.',
      ),
    },
    achievement: {
      high: t(
        'Çalışkan ve azimli',
        'Çok çalıştığını ve senden beklenenden fazlasını yapmaya çalıştığını söylüyorsun; dinlenmeye de zaman ayırmak bu çabayı sürdürmeni kolaylaştırır.',
        'Çocuğunuz çok çalıştığını ve kendisinden beklenenden fazlasını yapmaya çalıştığını belirtiyor; çabasının yanında dinlenmesine de alan açmak önemlidir.',
      ),
      average: t(
        'Çoğu zaman emek veren',
        'Çoğu zaman emek veriyorsun; özellikle önemli bulduğun işlerde daha fazla çaba gösteriyorsun.',
        'Çocuğunuz çoğu zaman emek verdiğini, özellikle önemli bulduğu işlerde daha fazla çaba gösterdiğini belirtiyor.',
      ),
      low: t(
        'İdare edecek kadar çalışan',
        'Çoğu işte idare edecek kadar çaba gösterdiğini söylüyorsun; seni gerçekten ilgilendiren bir hedef bulmak çabanı artırabilir.',
        'Çocuğunuz çoğu işte idare edecek kadar çaba gösterdiğini belirtiyor; onu gerçekten ilgilendiren hedefler bulmak motivasyonunu artırabilir.',
      ),
    },
    self_discipline: {
      high: t(
        'Planını uygulayan',
        'İşlere zamanında başladığını ve yaptığın planları uyguladığını söylüyorsun.',
        'Çocuğunuz işlere zamanında başladığını ve yaptığı planları uyguladığını belirtiyor.',
      ),
      average: t(
        'Bazen erteleyen',
        'Çoğu zaman planlarını uyguluyorsun; bazı işlere başlamak ise sana zor gelebiliyor.',
        'Çocuğunuz çoğu zaman planlarını uyguladığını, bazı işlere başlamakta ise zorlanabildiğini belirtiyor.',
      ),
      low: t(
        'Başlamakta zorlanan',
        'İşlere başlamakta zorlandığını ve zamanının bazen boşa gittiğini söylüyorsun; işi küçük parçalara bölmek başlamayı kolaylaştırır.',
        'Çocuğunuz işlere başlamakta zorlandığını ve zamanının bazen boşa gittiğini belirtiyor; işleri küçük parçalara bölmek ve kısa çalışma süreleri başlamayı kolaylaştırabilir.',
      ),
    },
    cautiousness: {
      high: t(
        'Düşünerek davranan',
        'Karar vermeden ve harekete geçmeden önce düşünmeyi tercih ettiğini söylüyorsun.',
        'Çocuğunuz karar vermeden ve harekete geçmeden önce düşünmeyi tercih ettiğini belirtiyor.',
      ),
      average: t(
        'Duruma göre temkinli',
        'Çoğu zaman düşünerek karar veriyorsun; bazen ise anlık hareket ettiğin oluyor.',
        'Çocuğunuz çoğu zaman düşünerek karar verdiğini, bazen ise anlık hareket ettiğini belirtiyor.',
      ),
      low: t(
        'Hızlı karar veren',
        'Hızlı ve anlık kararlar verdiğini, bazen düşünmeden harekete geçtiğini söylüyorsun; önemli kararlardan önce kısa bir mola vermek işine yarar.',
        'Çocuğunuz hızlı ve anlık kararlar verdiğini, bazen düşünmeden harekete geçtiğini belirtiyor; önemli kararlardan önce durup seçenekleri birlikte düşünmek ona destek olabilir.',
      ),
    },

    /* ---------- Duygusal Denge alt özellikleri (yüksek puan = daha dengeli) ---------- */
    calm: {
      high: t(
        'Kolay endişelenmeyen',
        'Kolay kolay endişelenmediğini ve kötü ihtimallere takılmadığını söylüyorsun.',
        'Çocuğunuz kolay kolay endişelenmediğini ve kötü ihtimallere takılmadığını belirtiyor.',
      ),
      average: t(
        'Ara sıra endişelenen',
        'Bazı konularda endişelendiğin oluyor, ama çoğu zaman bununla baş edebiliyorsun.',
        'Çocuğunuz bazı konularda endişelendiğini, ancak çoğu zaman bununla baş edebildiğini belirtiyor.',
      ),
      low: t(
        'Sık endişelenen',
        'Birçok şey için endişelendiğini ve kolayca strese girdiğini söylüyorsun; endişelerini güvendiğin biriyle paylaşmak yükünü hafifletir.',
        'Çocuğunuz birçok şey için endişelendiğini ve kolayca strese girdiğini belirtiyor; endişelerini küçümsemeden dinlemek ona iyi gelir.',
      ),
    },
    patience: {
      high: t(
        'Kolay kızmayan',
        'Kolay kolay sinirlenmediğini ve öfkelendiğinde de kendini kontrol edebildiğini söylüyorsun.',
        'Çocuğunuz kolay kolay sinirlenmediğini ve öfkelendiğinde kendini kontrol edebildiğini belirtiyor.',
      ),
      average: t(
        'Ara sıra sinirlenen',
        'Bazı durumlarda sinirlendiğin oluyor, ama çoğu zaman sakin kalabiliyorsun.',
        'Çocuğunuz bazı durumlarda sinirlendiğini, ancak çoğu zaman sakin kalabildiğini belirtiyor.',
      ),
      low: t(
        'Çabuk öfkelenen',
        'Çabuk sinirlendiğini ve öfkeni kontrol etmekte zorlanabildiğini söylüyorsun; öfkeni fark ettiğin anda kısa bir ara vermek işine yarar.',
        'Çocuğunuz çabuk sinirlendiğini ve öfkesini kontrol etmekte zorlanabildiğini belirtiyor; sakin bir anda, öfkesini fark etmenin ve yönetmenin yollarını birlikte konuşabilirsiniz.',
      ),
    },
    contentment: {
      high: t(
        'Kendiyle barışık',
        'Kendinle barışık olduğunu ve çoğu zaman iyi bir ruh hâlinde olduğunu söylüyorsun.',
        'Çocuğunuz kendiyle barışık olduğunu ve çoğu zaman iyi bir ruh hâlinde olduğunu belirtiyor.',
      ),
      average: t(
        'Çoğu zaman huzurlu',
        'Çoğu zaman kendinle barışıksın; zaman zaman moralinin bozulduğu ya da kendinden hoşnut olmadığın olabiliyor.',
        'Çocuğunuz çoğu zaman kendiyle barışık olduğunu, zaman zaman ise moralinin bozulduğunu belirtiyor.',
      ),
      low: t(
        'Sık sık hüzünlenen',
        'Sık sık hüzünlü hissettiğini ya da kendinden hoşnut olmadığını söylüyorsun; bu duygularla tek başına baş etmek zorunda değilsin, güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz sık sık hüzünlü hissettiğini ya da kendinden hoşnut olmadığını belirtiyor; bu bir tanı değildir, ancak bu duyguların ne kadar süredir devam ettiğini onunla konuşmanız ve gerekirse okulun rehber öğretmeninden destek almanız önemlidir.',
        {
          support: true,
          adult:
            'Sık sık hüzünlü hissettiğini ya da kendinden hoşnut olmadığını söylüyorsun; bu duygularla tek başına baş etmek zorunda değilsin, güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
    },
    social_ease: {
      high: t(
        'Sosyal ortamlarda rahat',
        'Yeni insanlara yaklaşırken ve dikkatler üzerindeyken rahat olduğunu söylüyorsun.',
        'Çocuğunuz yeni insanlara yaklaşırken ve dikkatler üzerindeyken rahat olduğunu belirtiyor.',
      ),
      average: t(
        'Duruma göre rahat',
        'Tanıdık ortamlarda rahatsın; yeni insanlara yaklaşırken ya da dikkatler üzerindeyken bazen çekinebiliyorsun.',
        'Çocuğunuz tanıdık ortamlarda rahat olduğunu, yeni insanlara yaklaşırken ise bazen çekindiğini belirtiyor.',
      ),
      low: t(
        'Çekingen',
        'Yeni insanlara yaklaşmakta zorlandığını ve dikkatleri üzerine çekmekten çekindiğini söylüyorsun; küçük adımlarla pratik yapmak bunu zamanla kolaylaştırır.',
        'Çocuğunuz yeni insanlara yaklaşmakta zorlandığını ve dikkatleri üzerine çekmekten çekindiğini belirtiyor; onu zorlamadan, güvendiği küçük gruplarda deneyim kazanmasına fırsat verebilirsiniz.',
      ),
    },
    moderation: {
      high: t(
        'Kendini tutabilen',
        'Canının çektiği şeylere karşı kendini tutabildiğini ve nadiren aşırıya kaçtığını söylüyorsun.',
        'Çocuğunuz canının çektiği şeylere karşı kendini tutabildiğini ve nadiren aşırıya kaçtığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman ölçülü',
        'Çoğu zaman ölçülüsün; bazen ise kendini kaptırıp aşırıya kaçtığın olabiliyor.',
        'Çocuğunuz çoğu zaman ölçülü olduğunu, bazen ise kendini kaptırıp aşırıya kaçabildiğini belirtiyor.',
      ),
      low: t(
        'Kendini kaptıran',
        'Canının çektiği şeylere direnmekte zorlandığını ve kendini kaptırıp aşırıya kaçabildiğini söylüyorsun; sınırları önceden belirlemek kendini tutmayı kolaylaştırır.',
        'Çocuğunuz canının çektiği şeylere direnmekte zorlandığını ve kendini kaptırıp aşırıya kaçabildiğini belirtiyor; ekran süresi gibi konularda sınırları birlikte ve önceden belirlemek ona destek olabilir.',
      ),
    },
    resilience: {
      high: t(
        'Baskı altında sakin',
        'Baskı altında sakin kalabildiğini ve zorluklar karşısında kolayca paniğe kapılmadığını söylüyorsun.',
        'Çocuğunuz baskı altında sakin kalabildiğini ve zorluklar karşısında kolayca paniğe kapılmadığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman toparlanan',
        'Zorluklar karşısında bazen bunaldığın oluyor, ama çoğu zaman toparlanabiliyorsun.',
        'Çocuğunuz zorluklar karşısında bazen bunaldığını, ancak çoğu zaman toparlanabildiğini belirtiyor.',
      ),
      low: t(
        'Zorluklar karşısında bunalan',
        'Zorluklar üst üste gelince kolayca bunaldığını ve paniğe kapılabildiğini söylüyorsun; zor anlarda yavaş nefes almak ve yardım istemek işini kolaylaştırır.',
        'Çocuğunuz zorluklar karşısında kolayca bunaldığını ve paniğe kapılabildiğini belirtiyor; zor dönemlerde onu yalnız bırakmamak ve birlikte adım adım plan yapmak ona iyi gelir.',
      ),
    },

    /* ---------- Deneyime Açıklık alt özellikleri ---------- */
    imagination: {
      high: t(
        'Hayal gücü zengin',
        'Hayal kurmayı ve düşüncelere dalıp gitmeyi sevdiğini söylüyorsun.',
        'Çocuğunuz hayal kurmayı ve düşüncelere dalıp gitmeyi sevdiğini belirtiyor.',
      ),
      average: t(
        'Ara sıra hayale dalan',
        'Zaman zaman hayallere dalıyor, zaman zaman da somut işlere odaklanıyorsun.',
        'Çocuğunuz zaman zaman hayallere daldığını, zaman zaman da somut işlere odaklandığını belirtiyor.',
      ),
      low: t(
        'Gerçekçi ve somut',
        'Hayaller yerine somut ve gerçek olanla ilgilenmeyi tercih ettiğini söylüyorsun.',
        'Çocuğunuz hayaller yerine somut ve gerçek olanla ilgilenmeyi tercih ettiğini belirtiyor.',
      ),
    },
    artistic: {
      high: t(
        'Sanata ve güzelliğe duyarlı',
        'Sanatı önemsediğini ve başkalarının fark etmeyebileceği şeylerde güzellik gördüğünü söylüyorsun.',
        'Çocuğunuz sanatı önemsediğini ve başkalarının fark etmeyebileceği şeylerde güzellik gördüğünü belirtiyor.',
      ),
      average: t(
        'Bazı sanatlara ilgili',
        'Sanatın bazı türleri ilgini çekiyor; bazıları ise sana pek hitap etmiyor.',
        'Çocuğunuz sanatın bazı türlerine ilgi duyduğunu, bazılarının ise ona pek hitap etmediğini belirtiyor.',
      ),
      low: t(
        'Sanata pek ilgi duymayan',
        'Şiirin ve sanat sergilerinin sana pek hitap etmediğini söylüyorsun.',
        'Çocuğunuz şiirin ve sanat sergilerinin ona pek hitap etmediğini belirtiyor.',
      ),
    },
    emotionality: {
      high: t(
        'Duygularını derin yaşayan',
        'Duygularını yoğun yaşadığını ve başkalarının ne hissettiğini kolayca fark ettiğini söylüyorsun.',
        'Çocuğunuz duygularını yoğun yaşadığını ve başkalarının ne hissettiğini kolayca fark ettiğini belirtiyor.',
      ),
      average: t(
        'Duygularını fark eden',
        'Duygularını ve başkalarının duygularını çoğu zaman fark ediyorsun; bunları her zaman yoğun yaşamıyorsun.',
        'Çocuğunuz kendi duygularını ve başkalarının duygularını çoğu zaman fark ettiğini belirtiyor.',
      ),
      low: t(
        'Olaylara mantıkla bakan',
        'Duygular yerine düşüncelere ve olaylara odaklandığını, duygusal tepkilerini pek fark etmediğini söylüyorsun.',
        'Çocuğunuz duygular yerine düşüncelere ve olaylara odaklandığını, duygusal tepkilerini pek fark etmediğini belirtiyor.',
      ),
    },
    adventurousness: {
      high: t(
        'Çeşitliliği seven',
        'Hep aynı şeyleri yapmak yerine çeşitliliği ve değişikliği sevdiğini söylüyorsun.',
        'Çocuğunuz hep aynı şeyleri yapmak yerine çeşitliliği ve değişikliği sevdiğini belirtiyor.',
      ),
      average: t(
        'Değişikliğe ölçülü açık',
        'Yeniliklere açıksın, ama alışık olduğun düzenin de sana iyi geldiğini düşünüyorsun.',
        'Çocuğunuz yeniliklere açık olduğunu, ancak alışık olduğu düzenin de ona iyi geldiğini belirtiyor.',
      ),
      low: t(
        'Alışık olduğu düzeni seven',
        'Bildiğin yolları ve alışık olduğun düzeni değişikliğe tercih ettiğini söylüyorsun; düzenin sana güven veriyor.',
        'Çocuğunuz bildiği yolları ve alışık olduğu düzeni değişikliğe tercih ettiğini belirtiyor; büyük değişikliklerden önce onu hazırlamak uyum sağlamasını kolaylaştırır.',
      ),
    },
    intellect: {
      high: t(
        'Fikirlerle uğraşmayı seven',
        'Soyut fikirlerle, felsefi ve teorik konularla uğraşmaktan hoşlandığını söylüyorsun.',
        'Çocuğunuz soyut fikirlerle, felsefi ve teorik konularla uğraşmaktan hoşlandığını belirtiyor.',
      ),
      average: t(
        'Konuya göre meraklı',
        'İlgini çeken konularda fikirler üzerine düşünmekten hoşlanıyorsun; her soyut konu ise sana çekici gelmiyor.',
        'Çocuğunuz ilgisini çeken konularda fikirler üzerine düşünmekten hoşlandığını belirtiyor.',
      ),
      low: t(
        'Pratik konuları seven',
        'Soyut ve teorik tartışmalar yerine pratik ve somut konuları tercih ettiğini söylüyorsun.',
        'Çocuğunuz soyut ve teorik tartışmalar yerine pratik ve somut konuları tercih ettiğini belirtiyor.',
      ),
    },
  },
};
