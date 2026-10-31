import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Liderlik Eğilimleri: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak;
 *    Dunlosky ve ark., 2013; Roediger ve Karpicke, 2006). Üç eğilim yalnızca bu yöntemleri tek başına mı, bir grupla mı
 *    kullanmanın kolay geleceğine ipucu verir; kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
 *  - 2. hafta "Dene ve geri bildirim al"dır (Öne çıkıp yön verme): her düzeyde bir grupta küçük bir liderlik denemesi ve
 *    ardından birine nasıl geçtiğini sormak. Yetişkinlerle yapılan liderlik eğitimlerinde uygulama ve geri bildirim içerenler
 *    daha etkili bulunmuştur (Lacerenza ve ark., 2017; bilim kartında). Gençlerdeki programların kanıtı sınırlı olduğu için
 *    "lider olursun", "liderlik becerin artar" gibi bir sonuç vaat edilmez.
 *  - Öneriler gençler için güvenlidir: arkadaş grubu, aile, takım ya da küçük bir proje; yetişkin gözetimi gerektiren ya
 *    da riskli bir etkinlik önerilmez.
 *  - Ortamlar bugünkü duruma göre bir ipucudur, sınır değildir (`settingsNote`); bir meslek önerisi değildir.
 *  - Düşük düzeyde kişi suçlanmaz; veliye zorlamak ya da sürekli hatırlatmak yerine küçük fırsatlar tanımak ve onu olduğu
 *    gibi kabul etmek önerilir.
 *  - Aynı eğilim ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar
 *    etmez; veliye yaklaşım önerileri de birbirini tekrar etmez (tests/liderlik-egilimleri.test.ts ortak söz öbeklerini arar).
 *  - Test yetişkinlere de açıktır: öğrenci metni okula özgü olduğunda ya da kitaptan söz ettiğinde yetişkin metni yazılır.
 */
export const liderlikEgilimleriRoadmap: RoadmapTemplate = {
  version: 'liderlik-egilimleri-yol-haritasi-1',
  planningScale: 'lead',
  planningTitle: 'Dene ve geri bildirim al',
  unit: { one: 'eğilim', toPlural: 'eğilimlere' },
  balancedNote: {
    student: 'Üç eğilimde de puanın orta düzeyde; hiçbir eğilim ötekilerden belirgin biçimde ayrılmıyor.',
    parent: 'Çocuğunuzun puanı üç eğilimde de orta düzeyde; hiçbir eğilim ötekilerden belirgin biçimde ayrılmıyor.',
  },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Bu üç eğilim, bu yöntemleri tek başına mı yoksa bir grupla mı kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun üç eğilimi, bu yöntemleri tek başına mı yoksa bir grupla mı kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
  },
  settingsNote: {
    student:
      'Bu ortamlar yalnızca bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'Bu ortamlar yalnızca çocuğunuzun bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Bu hafta içinde bulunduğun gruplara (aile, arkadaşlar, bir takım ya da bir proje) bak. Her gün bir grupta üstlendiğin rolü bir cümleyle yaz: yön veren, fikir öneren, işi yürüten ya da destekleyen.',
    parent:
      'Bu hafta raporu çocuğunuzla birlikte okuyun ve ona içinde bulunduğu gruplarda üstlendiği rolleri fark etmesini önerin. Anlatırsa yargılamadan dinleyin; hemen bir şeyi değiştirmeye çalışmayın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['kisilerarasi-tarz', 'empati'],
  nextPurpose: {
    you: 'insanlarla ilişkilerdeki tarzını ve başkalarını anlama eğilimini de görmek',
    parent: 'çocuğunuzun insanlarla ilişkilerdeki tarzını ve başkalarını anlama eğilimini de görmek',
  },
  approach: {
    lead: {
      low: 'Bir grupta yönü başkalarına bırakmasını eleştirmeyin; ailede bir şey planlanırken onun da fikrini sorun ve önerisini ciddiye alın.',
      average: 'Yön vermediği zamanlarda da gruba ne kattığını fark edin ve bunu ona söyleyin.',
      high: 'Yönettiği işlerde ara sıra başkalarının da yön vermesine fırsat tanımasını konuşun.',
    },
    bold: {
      low: 'Kalabalık ortamlarda konuşması için ısrar etmeyin; sessiz kalmayı seçmesini olağan karşılayın ve anlattıklarını sözünü kesmeden dinleyin.',
      average: 'Hangi ortamlarda kendini rahat hissettiğini merak edin; bunu düzeltilecek bir şey gibi değil, tanınacak bir özellik gibi ele alın.',
      high: 'Kalabalıkta rahat olmasını olağan karşılayın; onu daha sessiz kardeşleri ya da arkadaşlarıyla karşılaştırmayın.',
    },
    purpose: {
      low: 'Sürekli hatırlatmak yerine, işlerini hangi saatlerde yapacağını kendisinin seçmesine fırsat verin; seçtiği zamana saygı gösterin.',
      average: 'Zorlandığı bir işte nasıl bir yardım istediğini ona sorun; işi onun yerine yapmayın.',
      high: 'Üstlendiği işleri kendi düzeniyle yürütmesine alan bırakın; dinlenmeye de zaman ayırmasını önemseyin.',
    },
  },
  scales: {
    lead: {
      color: '#ee6a36',
      study: {
        high: {
          student:
            'Grupla çalışırken yön verme isteğini öğrenmeye çevir: grubu kitaba bakmadan soru sorma turlarına yönlendir. Herkes sırayla bir soru sorsun ve cevaplasın; tekrarları da birkaç güne yayın.',
          parent:
            'Çocuğunuz grupla çalışırken yön verme isteğini öğrenmeye çevirebilir: grubu kitaba bakmadan soru sorma turlarına yönlendirebilir. Herkesin sırayla soru sorup cevaplaması ve tekrarların birkaç güne yayılması ona uyabilir.',
          adult:
            'Birlikte öğrendiğin gruplarda yön verme isteğini öğrenmeye çevir: grubu kaynağa bakmadan soru sorma turlarına yönlendir. Herkes sırayla bir soru sorsun ve cevaplasın; tekrarları da birkaç güne yayın.',
        },
        average: {
          student:
            'Bazen tek başına, bazen bir grupla çalış. Grupla çalıştığın günlerde konuyu kitaba bakmadan anlatma sırasını sen başlat; tek başına çalıştığın günlerde kendine sorular sor.',
          parent:
            'Çocuğunuz bazen tek başına, bazen bir grupla çalışabilir. Grupla çalıştığı günlerde konuyu kitaba bakmadan anlatma sırasını başlatması, tek başına çalıştığı günlerde kendine sorular sorması ona uyabilir.',
          adult:
            'Bazen tek başına, bazen bir grupla öğren. Grupla çalıştığın günlerde konuyu kaynağa bakmadan anlatma sırasını sen başlat; tek başına çalıştığın günlerde kendine sorular sor.',
        },
        low: {
          student:
            'Grup çalışmalarında yönü başkası belirlese de kendi payını netleştir: hangi soruları senin cevaplayacağını önceden konuşun. Çalışmanın sonunda kitaba bakmadan hatırladıklarını yaz.',
          parent:
            'Grup çalışmalarında yönü başkası belirlese de çocuğunuz kendi payını netleştirebilir: hangi soruları onun cevaplayacağı önceden konuşulabilir. Çalışmanın sonunda kitaba bakmadan hatırladıklarını yazması ona uyabilir.',
          adult:
            'Birlikte öğrendiğin gruplarda yönü başkası belirlese de kendi payını netleştir: hangi soruları senin cevaplayacağını önceden konuşun. Sonunda kaynağa bakmadan hatırladıklarını yaz.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta yön verdiğin bir işte, karar vermeden önce herkesin önerisini sor ve en az birini kullan. İş bitince ekiptekilere, önerilerinin sorulmasını nasıl bulduklarını sor.',
          parent:
            'Bu hafta çocuğunuza, yön verdiği bir işte karar vermeden önce herkesin önerisini sormasını ve en az birini kullanmasını önerin. İş bitince ekiptekilere, önerilerinin sorulmasını nasıl bulduklarını sorsun.',
        },
        average: {
          student:
            'Bu hafta yön verdiğin bir işte görevleri paylaştırmayı dene: kim neyi yapacak? İş bitince birinden kısa bir geri bildirim iste: ne iyi gitti, ne farklı olabilirdi?',
          parent:
            'Bu hafta çocuğunuza, yön verdiği bir işte görevleri paylaştırmayı denemesini önerin. İş bitince birinden kısa bir geri bildirim istesin: ne iyi gitti, ne farklı olabilirdi?',
        },
        low: {
          student:
            'İstersen bu hafta bir arkadaş grubunda küçük bir işin düzenini üstlen (bir buluşmanın saatini ya da yerini belirlemek gibi). Sonra birine nasıl geçtiğini sor.',
          parent:
            'Bu hafta çocuğunuza bir arkadaş grubunda küçük bir işin düzenini üstlenmesini önerin (bir buluşmanın saatini ya da yerini belirlemek gibi). Neyi üstleneceğini o seçsin; sonra birine nasıl geçtiğini sorsun.',
        },
      },
      settings: {
        high: 'Bir işin yönetimini üstlenmeye fırsat veren, fikirlerin açıkça konuşulduğu ortamlar',
        low: 'Görevlerin açıkça belirlendiği, işbirliğine dayalı ortamlar',
      },
    },
    bold: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Topluluk içinde rahat olduğun için konuyu sesli anlatmak sana kolay gelebilir: öğrendiğini kitaba bakmadan birine anlat. Takıldığın yerleri not et ve ertesi gün önce o yerlere dön.',
          parent:
            'Topluluk içinde rahat olduğu için konuyu sesli anlatmak çocuğunuza kolay gelebilir: öğrendiğini kitaba bakmadan birine anlatabilir. Takıldığı yerleri not edip ertesi gün önce o yerlere dönmesi ona uyabilir.',
          adult:
            'Topluluk içinde rahat olduğun için konuyu sesli anlatmak sana kolay gelebilir: öğrendiğini kaynağa bakmadan birine anlat. Takıldığın yerleri not et ve ertesi gün önce o yerlere dön.',
        },
        average: {
          student:
            'Öğrendiklerini önce kendi kendine, sonra küçük bir gruba kitaba bakmadan anlat. Tekrarları birkaç güne yayarak sürdür.',
          parent:
            'Çocuğunuz öğrendiklerini önce kendi kendine, sonra küçük bir gruba kitaba bakmadan anlatabilir. Tekrarları birkaç güne yayarak sürdürmesi ona uyabilir.',
          adult:
            'Öğrendiklerini önce kendi kendine, sonra küçük bir gruba kaynağa bakmadan anlat. Tekrarları birkaç güne yayarak sürdür.',
        },
        low: {
          student:
            'Sessiz bir ortamda çalışmak sana uyabilir: kendine sorular yaz ve kitaba bakmadan cevapla. Tekrarları günlere yay; istersen bir arkadaşınla yalnızca soru ve cevap çalış.',
          parent:
            'Sessiz bir ortamda çalışmak çocuğunuza uyabilir: kendine sorular yazıp kitaba bakmadan cevaplayabilir. Tekrarları günlere yayması, isterse bir arkadaşıyla yalnızca soru ve cevap çalışması ona uyabilir.',
          adult:
            'Sessiz bir ortamda öğrenmek sana uyabilir: kendine sorular yaz ve kaynağa bakmadan cevapla. Tekrarları günlere yay; istersen biriyle yalnızca soru ve cevap çalış.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta ilgini çeken bir konuyu üç dakikada anlatan kısa bir konuşma hazırla. Bu konuşmayı tanıdığın birkaç kişinin önünde yap.',
          parent:
            'Bu hafta çocuğunuza, ilgisini çeken bir konuyu üç dakikada anlatan kısa bir konuşma hazırlamasını önerin. İsterse bu konuşmayı ailenin önünde yapsın.',
        },
        average: {
          student: 'Bu hafta genelde sessiz kaldığın bir ortamda bir kez söz al; bir soru sormak bile yeter.',
          parent: 'Bu hafta çocuğunuza, genelde sessiz kaldığı bir ortamda bir kez söz almasını önerin; bir soru sormak bile yeter.',
        },
        low: {
          student:
            'Bu hafta küçük ve tanıdık bir grupta (ör. iki üç arkadaşınla) bir konudaki fikrini bir kez söyle. Nasıl hissettiğini bir cümleyle yaz.',
          parent:
            'Bu hafta çocuğunuza, küçük ve tanıdık bir grupta (ör. iki üç arkadaşıyla) bir konudaki fikrini bir kez söylemesini önerin. Ne zaman ve nerede söyleyeceğini o seçsin.',
        },
      },
      settings: {
        high: 'İnsanlarla sık konuşulan, sunum ve tartışmaların olduğu ortamlar',
        low: 'Sakin, küçük ekiplerin ve yazılı iletişimin ağırlıkta olduğu ortamlar',
      },
    },
    purpose: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Plan yapma alışkanlığına tekrar günlerini de ekle: her konu için bir ilk çalışma, birkaç gün sonra bir tekrar günü yaz. Tekrar günlerinde önce kitaba bakmadan hatırlamaya çalış.',
          parent:
            'Çocuğunuz plan yapma alışkanlığına tekrar günlerini de ekleyebilir: her konu için bir ilk çalışma, birkaç gün sonra bir tekrar günü yazabilir. Tekrar günlerinde önce kitaba bakmadan hatırlamaya çalışması ona uyabilir.',
          adult:
            'Plan yapma alışkanlığına tekrar günlerini de ekle: her konu için bir ilk çalışma, birkaç gün sonra bir tekrar günü yaz. Tekrar günlerinde önce kaynağa bakmadan hatırlamaya çalış.',
        },
        average: {
          student:
            'Çalışmayı kısa ve belli bir zamana bağla (ör. her gün aynı saatte yirmi beş dakika). Her oturumu kitaba bakmadan hatırladıklarını yazarak bitir.',
          parent:
            'Çocuğunuz çalışmayı kısa ve belli bir zamana bağlayabilir (ör. her gün aynı saatte yirmi beş dakika). Her oturumu kitaba bakmadan hatırladıklarını yazarak bitirmesi ona uyabilir.',
          adult:
            'Öğrenmeyi kısa ve belli bir zamana bağla (ör. her gün aynı saatte yirmi beş dakika). Her oturumu kaynağa bakmadan hatırladıklarını yazarak bitir.',
        },
        low: {
          student:
            'Çalışmayı küçük parçalara böl ve her parçaya bir zaman yaz. Çalışırken dikkatini dağıtan şeyleri (ör. telefonu) başka bir odada bırak. Her parçayı kitaba bakmadan hatırlayarak bitir.',
          parent:
            'Çocuğunuz çalışmayı küçük parçalara bölüp her parçaya bir zaman yazabilir. Çalışırken dikkatini dağıtan şeyleri (ör. telefonu) başka bir odada bırakması ve her parçayı kitaba bakmadan hatırlayarak bitirmesi ona uyabilir.',
          adult:
            'Öğrenmeyi küçük parçalara böl ve her parçaya bir zaman yaz. Bu sırada dikkatini dağıtan şeyleri (ör. telefonu) başka bir odada bırak. Her parçayı kaynağa bakmadan hatırlayarak bitir.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta yeni bir sorumluluk almadan önce, ona ayıracak zamanın olup olmadığına bak. Gerekirse bir işe nazikçe “hayır” demeyi dene.',
          parent:
            'Bu hafta çocuğunuza, yeni bir sorumluluk almadan önce ona ayıracak zamanı olup olmadığına bakmasını önerin. Gerekirse bir işe nazikçe “hayır” diyebileceğini hatırlatın.',
        },
        average: {
          student:
            'Bu hafta genelde geciktirdiğin bir işi seç ve ona bir gün önceden başla. Hafta sonunda farkı bir cümleyle yaz.',
          parent:
            'Bu hafta çocuğunuza, genelde geciktirdiği bir işi seçip ona bir gün önceden başlamasını önerin. İsterse farkı size anlatsın.',
        },
        low: {
          student: 'Bu hafta üstlendiğin tek bir işi seç ve onu üç küçük adıma böl. Her adımı bitirince işaretle.',
          parent:
            'Bu hafta çocuğunuzla, üstlendiği tek bir işi seçip onu üç küçük adıma bölün. Her adımı bitirince kendisi işaretlesin.',
        },
      },
      settings: {
        high: 'Planlı, takvimi belli ve sorumlulukların açıkça paylaşıldığı ortamlar',
        low: 'Kısa süreli işlerin ve hızlı geri bildirimin olduğu ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.roediger, KAYNAK.lacerenza2017],
};
