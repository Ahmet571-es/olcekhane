import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * Kişilerarası Tarz: gelişim yol haritası metinleri.
 *
 * İlkeler (Beş Faktör yol haritasıyla ve bu testin rapor metinleriyle aynı):
 *  - Etkili çalışma yöntemleri herkes için aynıdır (kendini sınamak, tekrarları günlere yaymak, "Bu neden doğru?" diye
 *    sormak; Dunlosky ve ark., 2013). Kişilerarası tarz, bu yöntemleri tek başına mı yoksa başkalarıyla birlikte mi
 *    kullanmanın kolay olacağını seçmeye yardım eder; "tarza uygun öğrenme yolu" gibi bir eşleştirme vaat edilmez.
 *  - Her tarz kendi dört maddesiyle ayrı ölçüldüğü için düşük düzey metinleri maddelerin söylediğinin ötesine geçmez
 *    ("ilgi odağı olmayı aramıyorsun" der, "geri planda kalıyorsun" demez). Sessiz ve geri planda kalan tarzlar bir
 *    eksiklik gibi anlatılmaz; sert ve mesafeli tarzların yüksek düzeyi suçlamadan, küçük bir öneriyle anlatılır.
 *  - 2. hafta "Birlikte çalışırken": bu testte çalışma düzenini ölçen bir ölçek yoktur; Öne çıkma tarzının denemesi
 *    grup içinde söz alma ile söz bırakma arasındaki dengeye bakar. Çemberde karşısındaki tarzın (Geri planda kalma)
 *    denemeleri 3. haftada aynı şeyi tekrar etmesin diye başka bir konuya (emeğini fark etme, kısa sunum) bakar.
 *  - Ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmediği için iyi oluş haftası yoktur.
 *  - Bu testin rapor şablonunda veli önerileri yazılmadığından veliye yaklaşım önerileri burada verilir; rapordaki veli
 *    metinlerinde geçen öneriler tekrar edilmez.
 *  - Çemberde yan yana ya da karşı karşıya duran tarzlar çoğu zaman birlikte uçta çıkar (ör. sıcak yüksek, mesafeli
 *    düşük); bunların metinleri ve ortamları aynı raporda yan yana okunacağı için birbirini tekrar etmez.
 *  - Renkler çember boyunca tayfı izler: yan yana duran tarzlar komşu renklerdedir. Renk bir tarzı tanıtır; iyi ya da
 *    kötü anlamı taşımaz.
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir.
 *  - Yetişkin metni yalnızca öğrenci metni okula özgü olduğunda yazılır.
 */
export const kisilerarasiTarzRoadmap: RoadmapTemplate = {
  version: 'kisilerarasi-tarz-yol-haritasi-1',
  planningScale: 'assured_dominant',
  planningTitle: 'Birlikte çalışırken',
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. İnsanlarla ilişkilerdeki tarzın, bu yöntemleri tek başına mı yoksa başkalarıyla birlikte mi kullanmanın sana kolay geleceğini gösterebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun insanlarla ilişkilerdeki tarzı, bu yöntemleri tek başına mı yoksa başkalarıyla birlikte mi kullanmanın ona kolay geleceğini gösterebilir.',
    adult:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. İnsanlarla ilişkilerdeki tarzın, bu yöntemleri tek başına mı yoksa başkalarıyla birlikte mi kullanmanın sana kolay geleceğini gösterebilir.',
  },
  settingsNote: {
    student:
      'İnsanlarla ilişkilerdeki tarzın tek başına meslek seçtirmez: aynı meslekte çok farklı insanlar başarılı olur. Bu liste yalnızca hangi ortamlarda kendini daha rahat hissedebileceğine dair bir ipucudur. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'İnsanlarla ilişkilerdeki tarz tek başına meslek seçtirmez: aynı meslekte çok farklı insanlar başarılı olur. Bu liste, çocuğunuzun hangi ortamlarda kendini daha rahat hissedebileceğine dair bir ipucudur. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Raporundaki en belirgin tarzlarını düşün. Bu hafta insanlarla bir arada olduğun iki üç durumda nasıl davrandığını ve bunun sana nasıl geldiğini kısaca bir deftere yaz.',
    parent: bf.firstWeek.parent,
  },
  lastWeek: bf.lastWeek,
  nextTests: bf.nextTests,
  approach: {
    assured_dominant: {
      low: 'İlgi odağı olmasını beklemeden, fikirlerini birebir konuşmalarda sorun ve dinleyin.',
      average: 'Sohbetlerde hem konuşmaya hem dinlemeye yer olduğunu kendi davranışlarınızla gösterebilirsiniz.',
      high: 'Fikirlerini ilgiyle dinleyin; aile sohbetlerinde herkesin sırayla konuştuğu küçük bir alışkanlık deneyebilirsiniz.',
    },
    gregarious_extraverted: {
      low: 'Kalabalık yerine az sayıda insanla vakit geçirmesine saygı gösterin; yakın arkadaşlıklarını destekleyin.',
      average: 'Hem arkadaşlarıyla hem de kendi başına geçireceği zamana yer açın.',
      high: 'Sosyal enerjisini takdir edin; arkadaşlarıyla geçirdiği zamanla dinlenme zamanı arasında denge kurmasına yardım edin.',
    },
    warm_agreeable: {
      low: 'Onu insanlarla ilgilenmeye zorlamayın; bir yakınınızın hâlini sorarken ya da birine teşekkür ederken siz örnek olun.',
      average: 'Başkalarıyla ilgilendiği anları fark ettiğinizi ona söyleyin.',
      high: 'Sıcaklığını ve başkalarına gösterdiği ilgiyi fark ettiğinizi ona söyleyin.',
    },
    unassuming_ingenuous: {
      low: 'Kendi isteklerini savunmasına saygı gösterin; aile içinde bir plan yaparken (ör. hafta sonu) başkalarının isteklerini de hesaba katan bir çözüm önermesini isteyin.',
      average: 'Ne zaman başkalarına uyduğunu, ne zaman kendi isteğini söylediğini yargılamadan konuşabilirsiniz.',
      high: 'Hoşgörüsünü takdir edin; evde kendi isteğini söylediğinde bunu dikkate aldığınızı gösterin.',
    },
    unassured_submissive: {
      low: 'Kendine güvenini takdir edin; başarılarını anlatırken başkalarının emeğini de anmasını önerebilirsiniz.',
      average: 'Düşüncesini söylediği anlarda onu dikkatle dinleyin; sessiz kaldığı anları da doğal karşılayın.',
      high: 'Onu konuşmaya zorlamadan düşüncelerini sorun ve ilgiyle dinleyin; emeğini fark ettiğinizi söyleyin.',
    },
    aloof_introverted: {
      low: 'Kendini rahatça açmasını destekleyin; özel konuları kimlerle paylaşacağını da birlikte konuşabilirsiniz.',
      average: 'Konuşmak istediği zamanları kollayın; sessiz kalmak istediğinde de buna saygı gösterin.',
      high: 'Onu konuşmaya zorlamayın; birlikte yürümek ya da bir iş yapmak gibi rahat anlarda konuşmaya fırsat verin.',
    },
    cold_hearted: {
      low: 'Başkalarına duyarlılığını takdir edin; yardım ederken kendini yormamasını da hatırlatın.',
      average: 'Bir arkadaşı zor durumdayken neler yapılabileceğini birlikte konuşabilirsiniz.',
      high: 'Başkalarının zor durumları hakkında ne düşündüğünü yargılamadan sorun; kendi bakışınızı öğüt vermeden, yaşadığınız bir örnekle anlatın.',
    },
    arrogant_calculating: {
      low: 'Nazik dilini takdir edin; katılmadığı konularda görüşünü söylemesini de destekleyin.',
      average: 'Farklı görüşleri saygıyla tartışabildiğiniz aile sohbetleri bu dengeyi destekler.',
      high: 'Eleştirilerini sonuna kadar dinleyin ve haklı olduğu yanları açıkça kabul edin; bir tartışma sertleştiğinde ara verip ikiniz de sakinleşince konuya dönün.',
    },
  },
  scales: {
    assured_dominant: {
      color: '#ee6a36',
      study: {
        high: {
          student:
            'Sözü almaktan ve kendini ortaya koymaktan çekinmiyorsun; bu, sınıfta soru sormanı ve fikrini savunmanı kolaylaştırabilir. Bu gücü öğrenmeye çevir: bir konuyu çalıştıktan sonra arkadaşlarınla kısa bir tartışma aç ve görüşünü kitaba bakmadan gerekçeleriyle savun. Tartışmada başkalarını da dinlersen, onların itirazlarından da öğrenebilirsin.',
          parent:
            'Çocuğunuz sözü almaktan ve kendini ortaya koymaktan çekinmiyor olabilir; bu, soru sormasını ve fikrini savunmasını kolaylaştırabilir. Çalıştığı bir konuda görüşünü kitaba bakmadan gerekçeleriyle savunmasını isteyerek bu gücü öğrenmeye çevirebilirsiniz. Tartışırken başkalarını da dinlemesini önerebilirsiniz.',
          adult:
            'Sözü almaktan ve kendini ortaya koymaktan çekinmiyorsun; bu, soru sormanı ve fikrini savunmanı kolaylaştırabilir. Bu gücü öğrenmeye çevir: bir konuyu çalıştıktan sonra birileriyle kısa bir tartışma aç ve görüşünü kaynağa bakmadan gerekçeleriyle savun. Tartışmada başkalarını da dinlersen, onların itirazlarından da öğrenebilirsin.',
        },
        average: {
          student:
            'Bazı ortamlarda sözü alıyor, bazılarında ilgiyi başkalarına bırakıyorsun. Grup çalışmalarında iki rolü de deneyebilirsin: bir gün konuyu anlatan, bir gün soru soran ol. İki rol de öğrendiğini sınamanın bir yoludur.',
          parent:
            'Çocuğunuz bazı ortamlarda sözü alıyor, bazılarında ilgiyi başkalarına bırakıyor. Arkadaşlarıyla çalışırken bir gün konuyu anlatan, bir gün soru soran olması iki yönünü de kullanır; iki rol de öğrendiğini sınamanın bir yoludur.',
        },
        low: {
          student:
            'İlgi odağı olmayı aramıyorsun. Etkili çalışmak için sahneye çıkman gerekmez: konuyu soru kartlarına yazıp kendini bu kartlarla sınamak sessiz ama etkili bir yoldur. Öğrendiğini birine anlatmak istersen bunu birebir yapabilirsin; kalabalığın önüne çıkman gerekmez.',
          parent:
            'Çocuğunuz ilgi odağı olmayı aramıyor olabilir. Etkili çalışmak için sahneye çıkması gerekmez: konuyu soru kartlarına yazıp kendini bu kartlarla sınaması sessiz ama etkili bir yoldur. Öğrendiklerini size birebir anlatmasına da fırsat verebilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir grup çalışmasında kendi fikrini söylemeden önce en az iki kişinin fikrini dinle ve birine soru sor.',
          parent: 'Bu hafta çocuğunuzla, bir grup çalışmasında kendi fikrini söylemeden önce başkalarını dinlemenin ve onlara soru sormanın neler kazandırabileceğini konuşun.',
        },
        average: {
          student: 'Bu hafta bir grup çalışmasında bir kez sözü al, bir kez de sözü başkasına bırak; ikisinin sana ne kazandırdığını iki cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla, bir grup içinde ne zaman söz almanın, ne zaman dinlemenin işe yaradığını konuşun.',
        },
        low: {
          student:
            'Bu hafta derste ya da bir grup çalışmasında en az bir fikrini söyle ya da bir soru sor. Dinlerken aklına gelenleri kısaca not etmek, söylemek istediğini seçmeni kolaylaştırır.',
          parent: 'Bu hafta çocuğunuzla, bir grup içinde söylemek istediği bir fikri önceden bir cümleyle not etmesini konuşun; söylemesi için onu zorlamayın.',
          adult:
            'Bu hafta bir toplantıda ya da ortak bir işte en az bir fikrini söyle ya da bir soru sor. Dinlerken aklına gelenleri kısaca not etmek, söylemek istediğini seçmeni kolaylaştırır.',
        },
      },
      settings: {
        high: 'Söz almanın, tartışmayı yönetmenin ve yön vermenin öne çıktığı ortamlar',
        low: 'Herkesin eşit söz hakkı olduğu, kimsenin öne çıkmak zorunda olmadığı ortamlar',
      },
    },
    gregarious_extraverted: {
      color: '#d28a14',
      study: {
        high: {
          student:
            'İnsanların arasında rahatsın ve sohbet başlatmayı seviyorsun. Bu enerjiyi çalışmaya taşıyabilirsin: arkadaşlarınla kısa bir çalışma grubu kur ve birbirinize soru sorun. Grubun sohbete dönmemesi için süreyi baştan belirleyin; tek başına yapacağın tekrarları da planına ekle.',
          parent:
            'Çocuğunuz insanların arasında rahat ve sohbet başlatmayı seviyor olabilir. Arkadaşlarıyla kısa bir çalışma grubu kurup birbirlerine soru sormaları bu enerjiyi çalışmaya taşır. Grubun sohbete dönmemesi için süreyi baştan belirlemelerini önerebilirsiniz.',
        },
        average: {
          student:
            'Bazen kalabalıktan keyif alıyor, bazen sakin kalmayı tercih ediyorsun. Çalışırken de iki yolu birleştirebilirsin: konuyu önce tek başına çalış, sonra bir arkadaşınla birbirinize soru sorarak pekiştirin.',
          parent:
            'Çocuğunuz bazen kalabalıktan keyif alıyor, bazen sakin kalmayı tercih ediyor. Konuyu önce tek başına çalışıp sonra bir arkadaşıyla birbirlerine soru sorarak pekiştirmesi iki yolu birleştirir.',
        },
        low: {
          student:
            'Kalabalık ortamları pek aramıyorsun. Sessiz bir yerde tek başına çalışmak sana kolay gelebilir: aynı konuya birkaç gün arayla dönmek, tek seferde uzun çalışmaktan çoğu zaman daha kalıcıdır. Bir konuda takılırsan, güvendiğin tek bir kişiyle birlikte çalışmak kalabalık bir gruptan daha rahat olabilir.',
          parent:
            'Çocuğunuz kalabalık ortamları pek aramıyor olabilir. Sessiz bir yerde tek başına çalışmak ona kolay gelebilir; aynı konuya birkaç gün arayla dönmesi, tek seferde uzun çalışmaktan çoğu zaman daha kalıcıdır. Takıldığı konularda kalabalık bir grup yerine güvendiği tek bir arkadaşıyla çalışması daha rahat olabilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir arkadaşınla 25 dakikalık bir çalışma yapın: ilk 20 dakikada birbirinize soru sorun, son 5 dakikada sohbet edin.',
          parent: 'Bu hafta çocuğunuzla, arkadaşlarıyla çalışırken süreyi çalışma ve sohbet diye nasıl bölebileceklerini konuşun.',
          adult: 'Bu hafta öğrendiğin bir konuyu biriyle 25 dakika birlikte tekrar edin: ilk 20 dakikada birbirinize soru sorun, son 5 dakikada sohbet edin.',
        },
        average: {
          student: 'Bu hafta bir konuyu önce tek başına çalış, ertesi gün bir arkadaşınla birbirinize beşer soru sorun.',
          parent: 'Bu hafta çocuğunuza bir konuyu önce tek başına çalışıp ertesi gün bir arkadaşıyla birbirlerine soru sormalarını önerin.',
        },
        low: {
          student: 'Bu hafta güvendiğin bir kişiyle 20 dakika birlikte çalışın ya da birbirinize soru sorun; nasıl geçtiğini kendine not et.',
          parent: 'Bu hafta çocuğunuza güvendiği tek bir arkadaşıyla kısa bir çalışma yapmasını önerin; istemezse zorlamayın.',
        },
      },
      settings: {
        high: 'Hareketli, kalabalık ve insanlarla sık iletişim kurulan ortamlar',
        low: 'Küçük gruplarla, sakin bir tempoda çalışılan ortamlar',
      },
    },
    warm_agreeable: {
      color: '#5a9e2f',
      study: {
        high: {
          student:
            'İnsanlarla ilgileniyor ve onlarla iyi geçiniyorsun. Bu sıcaklık birlikte çalışmayı kolaylaştırabilir: bir arkadaşınla birbirinize konu anlatıp soru sormak hem ilişkinizi hem öğrenmenizi besler. Zorlandığın bir konuda sana destek olabilecek insanları bulmakta zorlanmazsın; onlardan yardım istemekten çekinme.',
          parent:
            'Çocuğunuz insanlarla ilgileniyor ve onlarla iyi geçiniyor olabilir. Bu sıcaklık birlikte çalışmayı kolaylaştırır: bir arkadaşıyla birbirlerine konu anlatmaları ikisinin de öğrenmesini pekiştirir. Zorlandığı bir konuda çevresindeki insanlardan yardım istemesini de destekleyebilirsiniz.',
        },
        average: {
          student:
            'Bazı durumlarda insanlarla yakından ilgileniyor, bazen bu ilgiyi daha az gösteriyorsun. Çalışırken de bu dengeyi kullanabilirsin: tekrarlarını tek başına yap, takıldığın yerde bir arkadaşınla birlikte çalış.',
          parent:
            'Çocuğunuz bazı durumlarda insanlarla yakından ilgileniyor, bazen bu ilgiyi daha az gösteriyor. Tekrarlarını tek başına yapıp takıldığı yerde bir arkadaşıyla birlikte çalışması bu dengeyi iyi kullanır.',
        },
        low: {
          student:
            'İnsanlara ilgini çok göstermiyorsun. Çalışırken ilerlemeni sorularla izlemek işini kolaylaştırır: bir konuyu bitirdiğinde kendine üç soru sor ve cevaplarını kontrol et. Takıldığın bir konuda birine sormak zaman kazandırabilir; yardım istemek bir ilişkiyi de güçlendirebilir.',
          parent:
            'Çocuğunuz insanlara ilgisini çok göstermiyor olabilir. Bir konuyu bitirdiğinde kendine birkaç soru sorup cevaplarını kontrol etmesi, ilerlemesini görmesini kolaylaştırır. Takıldığı yerde birine sormanın hem zaman kazandırabileceğini hem de ilişkileri güçlendirebileceğini onunla konuşabilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir arkadaşınla birbirinize birer konu anlatın; anlatırken takıldığınız yerleri ikiniz de not alın.',
          parent: 'Çocuğunuza bu hafta bir arkadaşıyla birbirlerine birer konu anlatmalarını ve takıldıkları yerleri not almalarını önerin.',
        },
        average: {
          student: 'Bu hafta takıldığın bir konuda bir arkadaşına ya da öğretmenine danış ve birlikte bir soru çöz.',
          parent: 'Bu hafta çocuğunuzla, takıldığı bir konuda kime danışabileceğini konuşun.',
          adult: 'Bu hafta takıldığın bir konuda birine danış ve onunla birlikte çalış.',
        },
        low: {
          student: 'Bu hafta her gün çevrendeki bir kişinin hâlini sor ya da ona küçük bir yardımda bulun; hafta sonunda nasıl geçtiğini yaz.',
          parent: 'Bu hafta çocuğunuzla birlikte birine küçük bir iyilik yapabileceğiniz bir fırsat yaratın (ör. bir komşuya yardım).',
        },
      },
      settings: {
        high: 'İnsanlarla yakın ve sıcak ilişkilerin kurulduğu ortamlar',
        low: 'Görev odaklı çalışılan, nesnel ölçütlerin belirleyici olduğu ortamlar',
      },
    },
    unassuming_ingenuous: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Hoşgörülüsün ve çoğu zaman önce başkalarını düşünüyorsun. Grup çalışmalarında uyumu sağlayan kişi olabilirsin; yine de kendi çalışma zamanını korumak için gerektiğinde hayır demek önemli. Haftalık planına önce kendi tekrarlarını yaz, başkalarına yardımı sonra ekle.',
          parent:
            'Çocuğunuz hoşgörülü ve çoğu zaman önce başkalarını düşünüyor olabilir. Grup çalışmalarında uyumu sağlayan kişi olabilir; kendi çalışma zamanını korumak için gerektiğinde hayır diyebilmesini destekleyin. Haftalık planına önce kendi tekrarlarını yazmasını önerebilirsiniz.',
        },
        average: {
          student:
            'Bazı durumlarda başkalarına hoşgörüyle uyuyor, bazılarında kendi isteklerini öne koyuyorsun. Ortak çalışmalarda da bu dengeyi kullan: hem başkalarının önerilerini dinle hem de sana uyan çalışma düzenini savun.',
          parent:
            'Çocuğunuz bazı durumlarda başkalarına hoşgörüyle uyuyor, bazılarında kendi isteklerini öne koyuyor. Ortak çalışmalarda hem başkalarını dinlemesi hem de kendine uyan düzeni savunabilmesi iyi bir dengedir.',
        },
        low: {
          student:
            'Başkalarının her davranışına katlanmıyor ve kendi ihtiyaçlarını gözetiyorsun. Bu, çalışma zamanını korumanı kolaylaştırabilir: dikkatini dağıtan bir ortamı değiştirmekten çekinme. Grup çalışmalarında herkesin ne istediğini baştan konuşmak, anlaşmazlıkları azaltır.',
          parent:
            'Çocuğunuz başkalarının her davranışına katlanmıyor ve kendi ihtiyaçlarını gözetiyor olabilir. Bu, çalışma zamanını korumasını kolaylaştırabilir. Grup çalışmalarında herkesin ne istediğini baştan konuşmanın anlaşmazlıkları azalttığını onunla konuşabilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta sana uymayan bir istek geldiğinde nazikçe ama açıkça hayır de ya da başka bir zaman öner.',
          parent: 'Çocuğunuzla, ona uymayan bir isteğe nazikçe nasıl hayır diyebileceğini birlikte canlandırın.',
        },
        average: {
          student: 'Bu hafta ortak bir işte bir kez başkasının önerisine uy, bir kez de kendi önerini savun; ikisinin sonucunu karşılaştır.',
          parent: 'Bu hafta çocuğunuzla, ne zaman başkalarına uymanın, ne zaman kendi isteğini söylemenin doğru olduğunu konuşun.',
        },
        low: {
          student: 'Bu hafta bir anlaşmazlıkta önce karşındakinin ne istediğini kendi cümlelerinle özetle, sonra kendi isteğini söyle.',
          parent: 'Bu hafta çocuğunuzla, bir anlaşmazlıkta önce karşısındakinin ne istediğini özetleyip sonra kendi isteğini söylemeyi deneyin.',
        },
      },
      settings: {
        high: 'Hoşgörünün, sabrın ve karşılıklı desteğin öne çıktığı ortamlar',
        low: 'Herkesin ihtiyaçlarının açıkça konuşulduğu, sınırların net olduğu ortamlar',
      },
    },
    unassured_submissive: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Dinlemeyi biliyor, sözü başkalarına bırakıyor ve kendini pek övmüyorsun. Dikkatle dinlemek öğrenmenin güçlü bir başlangıcıdır. Soru sormayı kolaylaştırmak için sorularını önceden not al; derste soramazsan dersten sonra birebir sor. Yaptığın işleri bir yere yazmak, ilerlemeni kendine göstermenin sakin bir yoludur.',
          parent:
            'Çocuğunuz dinlemeyi biliyor, sözü başkalarına bırakıyor ve kendini pek övmüyor olabilir. Dikkatle dinlemek öğrenmenin güçlü bir başlangıcıdır. Sorularını önceden not edip dersten sonra öğretmenine birebir sorabileceğini hatırlatabilirsiniz.',
          adult:
            'Dinlemeyi biliyor, sözü başkalarına bırakıyor ve kendini pek övmüyorsun. Dikkatle dinlemek öğrenmenin güçlü bir başlangıcıdır. Soru sormayı kolaylaştırmak için sorularını önceden not al; toplantıda soramazsan sonra birebir sor. Yaptığın işleri bir yere yazmak, ilerlemeni kendine göstermenin sakin bir yoludur.',
        },
        average: {
          student:
            'Bazı ortamlarda dinliyor, bazılarında kendini ortaya koyuyorsun. Bu iki yolu çalışırken de kullan: derste dikkatle dinleyip not al, sonra notlarını kapatıp konuyu birine ya da kendine anlatmaya çalış.',
          parent:
            'Çocuğunuz bazı ortamlarda dinliyor, bazılarında kendini ortaya koyuyor. Derste dikkatle dinleyip not alması, sonra notlarına bakmadan konuyu size anlatmaya çalışması hem dinlemeyi hem anlatmayı işe katar.',
          adult:
            'Bazı ortamlarda dinliyor, bazılarında kendini ortaya koyuyorsun. Bu iki yolu öğrenirken de kullan: dikkatle dinleyip not al, sonra notlarını kapatıp konuyu birine ya da kendine anlatmaya çalış.',
        },
        low: {
          student:
            'Yaptığın işi göstermekten ve ilgi odağı olmaktan rahatsızlık duymuyorsun. Bunu geri bildirim almak için kullanabilirsin: çözdüğün soruları ya da bir çalışmanı öğretmenine veya bir arkadaşına göster ve nerede hata yaptığını sor. Hatalarını görmek, neyi yeniden çalışman gerektiğini gösterir.',
          parent:
            'Çocuğunuz yaptığı işi göstermekten ve ilgi odağı olmaktan rahatsızlık duymuyor olabilir. Bunu geri bildirim almak için kullanabilir: çözdüğü soruları ya da bir çalışmasını öğretmenine göstermesi ve nerede hata yaptığını sorması, neyi yeniden çalışması gerektiğini görmesini sağlar.',
          adult:
            'Yaptığın işi göstermekten ve ilgi odağı olmaktan rahatsızlık duymuyorsun. Bunu geri bildirim almak için kullanabilirsin: bir çalışmanı birine göster ve nerede hata yaptığını sor. Hatalarını görmek, neyi yeniden çalışman gerektiğini gösterir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta her gün iyi yaptığın ya da emek verdiğin bir işi tek cümleyle yaz; hafta sonunda listeni güvendiğin biriyle paylaş.',
          parent: 'Bu hafta çocuğunuzun emek verdiği bir işi fark ettiğinizde ona söyleyin ve başarılarını sizinle paylaşmasına fırsat verin.',
        },
        average: {
          student: 'Bu hafta dinleyip not aldığın bir konuyu, notlarını kapattıktan sonra aklında kalanlarla birine anlat.',
          parent: 'Bu hafta çocuğunuzdan dinleyip not aldığı bir konuyu notlarına bakmadan size anlatmasını isteyin.',
        },
        low: {
          student: 'Bu hafta çözdüğün birkaç soruyu ya da yaptığın bir işi birine göster ve en az bir geri bildirim iste; söylenenleri bir sonraki çalışmanda dene.',
          parent: 'Bu hafta çocuğunuza çözdüğü birkaç soruyu ya da yaptığı bir işi size veya öğretmenine gösterip geri bildirim istemesini önerin.',
        },
      },
      settings: {
        high: 'Dikkatli dinlemenin ve özenli çalışmanın değer gördüğü ortamlar',
        low: 'Kendini ve yapılan işi başkalarına tanıtmanın önemli olduğu ortamlar',
      },
    },
    aloof_introverted: {
      color: '#7a4ee6',
      study: {
        high: {
          student:
            'Az konuşuyor ve özel hayatını kolay paylaşmıyorsun. Düşüncelerini yazıya dökmek senin için rahat bir yol olabilir: her oturumun sonunda kitabı kapatıp hatırladıklarını yazmak, kendini sınamanın etkili bir yoludur. Sormak istediklerini önce yazmak, onları sormanı da kolaylaştırır.',
          parent:
            'Çocuğunuz az konuşuyor ve özel hayatını kolay paylaşmıyor olabilir. Düşüncelerini yazıya dökmek onun için rahat bir yol olabilir: kitaba bakmadan hatırladıklarını yazması, kendini sınamanın etkili bir yoludur. Sormak istediklerini önce yazmasını önerebilirsiniz.',
          adult:
            'Az konuşuyor ve özel hayatını kolay paylaşmıyorsun. Düşüncelerini yazıya dökmek senin için rahat bir yol olabilir: her oturumun sonunda kaynağı kapatıp hatırladıklarını yazmak, kendini sınamanın etkili bir yoludur. Sormak istediklerini önce yazmak, onları sormanı da kolaylaştırır.',
        },
        average: {
          student:
            'Bazı ortamlarda rahatça konuşuyor, bazılarında sessiz kalıyorsun. Bu esnekliği çalışırken de kullanabilirsin: bir konuyu bazen yazarak, bazen sesli anlatarak tekrar et ve hangisinden sonra daha çok hatırladığını gözle.',
          parent:
            'Çocuğunuz bazı ortamlarda rahatça konuşuyor, bazılarında sessiz kalıyor. Bir konuyu bazen yazarak, bazen sesli anlatarak tekrar etmesi iki yolu da kullanır.',
        },
        low: {
          student:
            'Konuşmaktan ve kendini açmaktan çekinmiyorsun. Bu, öğrendiklerini sesli anlatarak tekrar etmeni kolaylaştırabilir: bir konuyu kitaba bakmadan birine anlatmak, nerede eksiğin olduğunu hemen gösterir. Anlatırken kitaptaki cümleleri tekrar etmek yerine kendi sözlerini ve örneklerini kullanmak, konuyu daha iyi anlamanı sağlayabilir.',
          parent:
            'Çocuğunuz konuşmaktan ve kendini açmaktan çekinmiyor olabilir. Öğrendiklerini kitaba bakmadan size anlatması, nerede eksiği olduğunu hemen gösterir. Anlatırken kendi sözlerini ve örneklerini kullanmasını isteyebilirsiniz; bu, konuyu daha iyi anlamasını sağlayabilir.',
          adult:
            'Konuşmaktan ve kendini açmaktan çekinmiyorsun. Bu, öğrendiklerini sesli anlatarak tekrar etmeni kolaylaştırabilir: bir konuyu kaynağa bakmadan birine anlatmak, nerede eksiğin olduğunu hemen gösterir. Anlatırken kaynaktaki cümleleri tekrar etmek yerine kendi sözlerini ve örneklerini kullanmak, konuyu daha iyi anlamanı sağlayabilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta her çalışmanın sonunda kitabı kapatıp hatırladıklarını beş cümleyle yaz; anlamadığın bir yeri de yazıyla birine sor.',
          parent: 'Bu hafta çocuğunuza çalıştığı bir konuyu kitaba bakmadan beş cümleyle yazmasını önerin; anlamadığı bir yeri yazıyla da sorabileceğini hatırlatın.',
          adult: 'Bu hafta her çalışmanın sonunda kaynağı kapatıp hatırladıklarını beş cümleyle yaz; anlamadığın bir yeri de yazıyla birine sor.',
        },
        average: {
          student: 'Bu hafta bir konuyu bir gün yazarak, başka bir gün sesli anlatarak tekrar et; hafta sonunda kendini sınayarak hangisinden sonra daha çok hatırladığını karşılaştır.',
          parent: 'Bu hafta çocuğunuzla, bir konuyu yazarak mı yoksa sesli anlatarak mı daha iyi hatırladığını birlikte gözlemleyin.',
        },
        low: {
          student: 'Bu hafta öğrendiğin bir konuyu 5 dakikada birine anlat; anlatamadığın yerleri not al ve ertesi gün yeniden çalış.',
          parent: 'Bu hafta çocuğunuzdan öğrendiği bir konuyu size 5 dakikada anlatmasını isteyin; anlatamadığı yerleri birlikte not alın.',
        },
      },
      settings: {
        high: 'Sessiz, odaklanmaya elverişli ve tek başına derinleşilebilen ortamlar',
        low: 'Konuşmanın, tanışmanın ve fikir paylaşmanın bol olduğu ortamlar',
      },
    },
    cold_hearted: {
      color: '#b5459b',
      study: {
        high: {
          student:
            'Herkesin kendi başının çaresine bakması gerektiğini düşünüyor, başkalarının sorunlarına mesafeli duruyorsun. Kendi işine odaklanmak, tek başına düzenli çalışmanı kolaylaştırabilir. Yine de ortak çalışmalarda görevleri yazılı paylaşmak işin adil yürümesini sağlar; bir arkadaşının sorusunu yanıtlamak da konuyu senin için pekiştirir.',
          parent:
            'Çocuğunuz herkesin kendi başının çaresine bakması gerektiğini düşünüyor ve başkalarının sorunlarına mesafeli duruyor olabilir. Kendi işine odaklanmak tek başına düzenli çalışmasını kolaylaştırabilir. Bir arkadaşının sorusunu yanıtlamanın konuyu kendisi için de pekiştirdiğini onunla konuşabilirsiniz.',
        },
        average: {
          student:
            'Bazı durumlarda başkalarının sorunlarıyla ilgileniyor, bazen mesafeli duruyorsun. Çalışırken bu dengeyi koru: kendi tekrarlarını önce bitir, sonra bir arkadaşının sorusuna yardım et; anlatmak senin öğrenmeni de pekiştirir.',
          parent:
            'Çocuğunuz bazı durumlarda başkalarının sorunlarıyla ilgileniyor, bazen mesafeli duruyor. Kendi tekrarlarını bitirdikten sonra bir arkadaşına yardım etmesi, anlatarak kendi öğrenmesini de pekiştirir.',
        },
        low: {
          student:
            'Başkalarının sorunlarına kayıtsız kalmıyorsun. Bu duyarlılık, bir konuyu farklı insanların gözünden düşünmeni kolaylaştırabilir: tarih ya da edebiyat gibi derslerde olayları farklı kişilerin bakışıyla anlatmayı dene; bu, konuyu farklı yönleriyle görmeni sağlar.',
          parent:
            'Çocuğunuz başkalarının sorunlarına kayıtsız kalmıyor olabilir. Bu duyarlılık, bir konuyu farklı insanların gözünden düşünmesini kolaylaştırabilir: okuduğu bir hikâyeyi ya da tarihî bir olayı farklı kişilerin bakışıyla anlatmasını isteyebilirsiniz; bu, konuyu farklı yönleriyle görmesini sağlar.',
          adult:
            'Başkalarının sorunlarına kayıtsız kalmıyorsun. Bu duyarlılık, bir konuyu farklı insanların gözünden düşünmeni kolaylaştırabilir: öğrendiğin bir olayı ya da vereceğin bir kararı farklı kişilerin bakışıyla anlatmayı dene; bu, konuyu farklı yönleriyle görmeni sağlar.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir arkadaşının derslerle ilgili bir sorusunu yanıtla; anlatırken senin de neyi pekiştirdiğini not et.',
          parent: 'Bu hafta çocuğunuzdan bir arkadaşının sorusunu yanıtlamasını ve anlatırken neyi pekiştirdiğini size söylemesini isteyin.',
          adult: 'Bu hafta birinin işle ilgili bir sorusunu yanıtla; anlatırken senin de neyi pekiştirdiğini not et.',
        },
        average: {
          student: 'Bu hafta önce kendi tekrarını bitir, sonra bir arkadaşına takıldığı bir konuda 10 dakika yardım et.',
          parent: 'Bu hafta çocuğunuzla, kendi işini bitirdikten sonra bir arkadaşına nasıl yardım edebileceğini konuşun.',
        },
        low: {
          student: 'Bu hafta okuduğun ya da izlediğin bir olayı, içindeki iki farklı kişinin gözünden üçer cümleyle anlat.',
          parent: 'Bu hafta çocuğunuzla izlediğiniz bir filmde ya da okuduğunuz bir hikâyede iki farklı karakterin olaya nasıl baktığını konuşun.',
        },
      },
      settings: {
        high: 'Bağımsız çalışılan, herkesin kendi işinden sorumlu olduğu ortamlar',
        low: 'İnsanlara destek olmanın ve yardımlaşmanın değerli olduğu ortamlar',
      },
    },
    arrogant_calculating: {
      color: '#df4777',
      study: {
        high: {
          student:
            'Düşündüğünü açıkça söylüyor ve başkalarına karşı çıkmaktan çekinmiyorsun. Eleştirel bakış öğrenirken bir güçtür: bir konuyu çalışırken "Bu neden doğru?" diye sor ve cevabını kitaba bakmadan açıklamaya çalış. Grup çalışmalarında eleştirini, önce neyin iyi olduğunu söyleyip sonra önerini ekleyerek yaparsan sözlerin daha kolay kabul görebilir.',
          parent:
            'Çocuğunuz düşündüğünü açıkça söylüyor ve başkalarına karşı çıkmaktan çekinmiyor olabilir. Eleştirel bakış öğrenirken bir güçtür: çalıştığı bir konuda "Bu neden doğru?" diye sorup cevabını kitaba bakmadan açıklamasını isteyebilirsiniz. Eleştirisini önce iyi olanı söyleyip sonra önerisini ekleyerek yapmasının, sözlerinin kabul görmesini kolaylaştırdığını konuşabilirsiniz.',
          adult:
            'Düşündüğünü açıkça söylüyor ve başkalarına karşı çıkmaktan çekinmiyorsun. Eleştirel bakış öğrenirken bir güçtür: bir konuyu çalışırken "Bu neden doğru?" diye sor ve cevabını kaynağa bakmadan açıklamaya çalış. Ortak çalışmalarda eleştirini, önce neyin iyi olduğunu söyleyip sonra önerini ekleyerek yaparsan sözlerin daha kolay kabul görebilir.',
        },
        average: {
          student:
            'Bazı durumlarda başkalarına karşı çıkıp eleştiriyor, bazen yumuşak bir dil kullanıyorsun. Bu dengeyi öğrenirken de kullan: bir konuyu çalışırken hem "Bu neden doğru?" diye sorgula hem de farklı görüşlerin haklı olabileceği yerleri düşün.',
          parent:
            'Çocuğunuz bazı durumlarda başkalarına karşı çıkıp eleştiriyor, bazen yumuşak bir dil kullanıyor. Bir konuyu çalışırken hem sorgulaması hem de farklı görüşlerin haklı olabileceği yerleri düşünmesi, eleştirel bakışını dengeli kullanmasını sağlar.',
        },
        low: {
          student:
            'Başkalarını sert bir dille eleştirmiyor ve onlara terslenmiyorsun. Bu yumuşak dil, ortak çalışmalarda herkesin rahatça fikir söylemesine yardım edebilir. Öğrenirken sorgulamaktan da çekinme: bir bilginin neden doğru olduğunu kendine sormak ve katılmadığın bir noktayı nazikçe söylemek, konuyu daha derin anlamanı sağlar.',
          parent:
            'Çocuğunuz başkalarını sert bir dille eleştirmiyor ve onlara terslenmiyor olabilir. Bu yumuşak dil, ortak çalışmalarda herkesin rahatça fikir söylemesine yardım edebilir. Öğrenirken bir bilginin neden doğru olduğunu sorgulamasını ve katılmadığı bir noktayı nazikçe söylemesini destekleyebilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta birine bir eleştiri yapmadan önce beğendiğin bir yanı söyle; sonra eleştirini bir öneriyle birlikte dile getir.',
          parent: 'Bu hafta çocuğunuzla, bir eleştiriyi önce iyi olanı söyleyip sonra bir öneriyle dile getirmeyi deneyin; siz de aynı yolu kullanarak örnek olun.',
        },
        average: {
          student: 'Bu hafta çalıştığın bir konuda kendine üç kez "Bu neden doğru?" diye sor ve cevaplarını kitaba bakmadan yaz.',
          parent: 'Bu hafta çocuğunuzdan çalıştığı bir konuda "Bu neden doğru?" sorusunu kitaba bakmadan cevaplamasını isteyin.',
          adult: 'Bu hafta öğrendiğin bir konuda kendine üç kez "Bu neden doğru?" diye sor ve cevaplarını kaynağa bakmadan yaz.',
        },
        low: {
          student: 'Bu hafta katılmadığın bir konuda görüşünü nazikçe ama açıkça söyle; nasıl karşılandığını kendine not et.',
          parent: 'Bu hafta çocuğunuzla, katılmadığı bir konuda görüşünü nazikçe ama açıkça nasıl söyleyebileceğini konuşun.',
        },
      },
      settings: {
        high: 'Fikirlerin açıkça tartışıldığı, eleştirel düşünmenin önemsendiği ortamlar',
        low: 'Nazik ve saygılı iletişimin hâkim olduğu ortamlar',
      },
    },
  },
  sources: [
    bf.sources[0],
    {
      text: 'Markey, P. M. ve Markey, C. N. (2009). A brief assessment of the interpersonal circumplex: The IPIP-IPC. Assessment, 16(4), 352–361.',
    },
  ],
};
