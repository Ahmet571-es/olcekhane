import type { SurveyDaily } from './types';

/**
 * Kişilerarası Tarz: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Çemberin sekiz tarzının her biri bir kart alır
 * (`dailyScales`: çember profilinde bütün ölçekler). Ton: özellik (hiçbir tarzın iyi ya da kötü ucu yoktur;
 * lib/reports/daily-parts.ts). Rapor metinlerindeki ilkeler burada da geçerlidir (src/content/reports/kisilerarasi-tarz.ts):
 *  - Her tarz kendi dört maddesiyle ayrı ölçülür; karşı karşıya duran iki tarz aynı raporda birlikte düşük ya da birlikte
 *    yüksek çıkabilir. Bu yüzden düşük düzeyin örnekleri yalnızca o tarzın maddelerinin düşük cevabını anlatır, karşıt tarzın
 *    davranışını söylemez (öne çıkmada düşük düzey "ilgi odağı olmakta ısrar etmeyebilirsin" der, "geri planda kalırsın"
 *    demez; sıcaklıkta düşük düzey ilgisizlik ya da kavga anlatmaz: "iyi geçinirim" maddesinin düşük cevabına dayanılmadı).
 *  - Hiçbir satır bir tarzı karşıtından üstün göstermez; sert ve mesafeli tarzların yüksek düzeyi suçlamadan, gerçek bir
 *    kolaylık (açıkça karşı çıkabilmek, acındıran hikâyelere kanmamak) ve yumuşak bir zorlukla anlatılır.
 *  - "Bir şeylere pek kafa yormam" (ipc24) ve "Bir şey anlatırken nadiren abartırım" (ipc27) maddelerine dayanılmadı: ilki
 *    mesafeli tarzın konusundan, ikincisinin düşük cevabı yargılayıcı okunabileceği için.
 * Her satırın dayandığı maddeler `from`'dadır. Maddeye doğrudan dayanmayan, raporun metninden gelen uzantılar: öne çıkmada
 * "başkalarına söz bırakmak onların fikrini duymanı sağlayabilir" ve düşük düzeyde "başkalarının fikirlerine de yer
 * açabilir" (raporun yüksek düzey metni), sıcaklıkta "işin kendisine odaklanabilirsin" (Beş Faktör'ün uyumluluk örneğiyle
 * aynı yorum), uysallıkta düşük düzeyde "dile getirebilirsin" (raporun "sınır çizebildiğini" anlatımı), girişkenlikte uzun süre
 * kimseyle görüşmemenin çekici gelmemesi (kalabalık ortamları sevmenin öbür yüzü), sessizlikte özel hayatın "kendine ait bir
 * alan" bırakması ve çok özel şeyler için kişiyi tanımak (16 Faktörlü Kişilik Profili'nin raporundaki anlatım).
 */
export const kisilerarasiTarzDaily: SurveyDaily = {
  kind: 'survey',
  version: 'kisilerarasi-tarz-gunluk-1',
  scales: {
    /*
     * Öne çıkma: ipc06 "İlgi odağı olmakta ısrar ederim", ipc14 "Sohbetlerde en çok ben konuşurum", ipc22 "Yüksek sesle
     * konuşurum", ipc30 "İlgiyi üzerime çekmeye çalışırım".
     */
    assured_dominant: {
      poles: { low: 'İlgi odağı olmayı aramayan', high: 'İlgi odağı olmak isteyen' },
      bands: {
        low: {
          from: { school: ['ipc06', 'ipc14'], friends: ['ipc22'], home: ['ipc14'], work: ['ipc06', 'ipc14'] },
          student: {
            school: 'Bir grup çalışmasında ilgi odağı olmakta ısrar etmeyebilirsin; bu başkalarının fikirlerine de yer açabilir.',
            friends: 'Kalabalık ve gürültülü bir ortamda yüksek sesle konuşmadığın için sesin pek duyulmayabilir.',
            home: 'Evdekilerle bir sohbette sözü uzun süre elinde tutmak istemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir grup çalışmasında ilgi odağı olmakta ısrar etmeyebilir; bu başkalarının fikirlerine de yer açabilir.',
            friends: 'Kalabalık ve gürültülü bir ortamda yüksek sesle konuşmadığı için sesi pek duyulmayabilir.',
            home: 'Evdekilerle bir sohbette sözü uzun süre elinde tutmak istemeyebilir.',
          },
          adult: {
            work: 'Ortak bir işte ilgi odağı olmakta ısrar etmeyebilirsin; bu başkalarının fikirlerine de yer açabilir.',
          },
        },
        average: {
          from: { school: ['ipc14'], friends: ['ipc22'], home: ['ipc30', 'ipc06'], work: ['ipc14'] },
          student: {
            school: 'Bazı grup çalışmalarında çok konuşabilir, bazılarında sözü başkalarına bırakabilirsin.',
            friends: 'Arkadaşlarınla konuşurken bazen yüksek sesle, bazen daha sakin konuşabilirsin.',
            home: 'Evdekilerin arasında bazen ilgiyi üzerine çekmeye çalışabilir, bazen buna gerek duymayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı grup çalışmalarında çok konuşabilir, bazılarında sözü başkalarına bırakabilir.',
            friends: 'Arkadaşlarıyla konuşurken bazen yüksek sesle, bazen daha sakin konuşabilir.',
            home: 'Evdekilerin arasında bazen ilgiyi üzerine çekmeye çalışabilir, bazen buna gerek duymayabilir.',
          },
          adult: {
            work: 'Bazı işlerde çok konuşup öne çıkabilir, bazılarında sözü başkalarına bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['ipc14', 'ipc22'], friends: ['ipc06', 'ipc30'], home: ['ipc14'], work: ['ipc14', 'ipc22'] },
          student: {
            school: 'Bir grup çalışmasında çok konuşmak ve fikrini yüksek sesle söylemek sana kolay gelebilir.',
            friends: 'Arkadaşlarınla bir aradayken ilgi odağı olmak hoşuna gidebilir.',
            home: 'Evdekilerle bir sohbette çok konuşabilirsin; başkalarına söz bırakmak onların fikrini duymanı sağlayabilir.',
          },
          parent: {
            school: 'Bir grup çalışmasında çok konuşmak ve fikrini yüksek sesle söylemek çocuğunuza kolay gelebilir.',
            friends: 'Arkadaşlarıyla bir aradayken ilgi odağı olmak hoşuna gidebilir.',
            home: 'Evdekilerle bir sohbette çok konuşabilir; başkalarına söz bırakmak onların fikrini duymasını sağlayabilir.',
          },
          adult: {
            work: 'Ortak bir işte çok konuşmak ve fikrini yüksek sesle söylemek sana kolay gelebilir.',
          },
        },
      },
    },
    /*
     * Sosyal ve girişken olma: ipc05 "İnsanların arasında kendimi rahat hissederim", ipc13 "Sohbeti genellikle ben
     * başlatırım", ipc21 "Kalabalık ortamlarda birçok farklı kişiyle konuşurum", ipc29 "Kalabalık kutlamaları ve eğlenceleri
     * çok severim".
     */
    gregarious_extraverted: {
      poles: { low: 'Kalabalığı pek aramayan', high: 'Sosyal ve girişken' },
      bands: {
        low: {
          from: { school: ['ipc13'], friends: ['ipc29'], home: ['ipc21', 'ipc29'], work: ['ipc13', 'ipc21'] },
          student: {
            school: 'Yeni bir sınıfta sohbeti başkası başlatınca katılmak sana daha rahat gelebilir.',
            friends: 'Kalabalık bir kutlama yerine az kişiyle buluşmak sana daha keyifli gelebilir.',
            home: 'Kalabalık bir misafirlikte pek çok kişiyle sohbet etmek sana pek keyifli gelmeyebilir.',
          },
          parent: {
            school: 'Yeni bir sınıfta sohbeti başkası başlatınca katılmak çocuğunuza daha rahat gelebilir.',
            friends: 'Kalabalık bir kutlama yerine az kişiyle buluşmak ona daha keyifli gelebilir.',
            home: 'Kalabalık bir misafirlikte pek çok kişiyle sohbet etmek ona pek keyifli gelmeyebilir.',
          },
          adult: {
            work: 'Yeni bir iş ortamında sohbeti başlatmak için acele etmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['ipc13'], friends: ['ipc29'], home: ['ipc21'], work: ['ipc05', 'ipc13'] },
          student: {
            school: 'Sınıfta bazen sohbeti başlatabilir, bazen başkasının başlatmasını bekleyebilirsin.',
            friends: 'Bazen kalabalık bir kutlamadan keyif alabilir, bazen az kişiyle buluşmayı seçebilirsin.',
            home: 'Kalabalık bir misafirlikte bazen pek çok kişiyle konuşabilir, bazen birkaç kişiyle sohbet edebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta bazen sohbeti başlatabilir, bazen başkasının başlatmasını bekleyebilir.',
            friends: 'Bazen kalabalık bir kutlamadan keyif alabilir, bazen az kişiyle buluşmayı seçebilir.',
            home: 'Kalabalık bir misafirlikte bazen pek çok kişiyle konuşabilir, bazen birkaç kişiyle sohbet edebilir.',
          },
          adult: {
            work: 'Bazı iş ortamlarında rahatça sohbet başlatabilir, bazılarında daha sakin kalabilirsin.',
          },
        },
        high: {
          from: { school: ['ipc13', 'ipc05'], friends: ['ipc29', 'ipc21'], home: ['ipc29'], work: ['ipc13', 'ipc21'] },
          student: {
            school: 'Yeni bir sınıfta ya da kulüpte sohbeti başlatmak sana kolay gelebilir.',
            friends: 'Kalabalık bir kutlamada birçok farklı kişiyle konuşmak sana keyifli gelebilir.',
            home: 'Uzun süre kimseyle görüşmeden evde kalmak sana pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Yeni bir sınıfta ya da kulüpte sohbeti başlatmak çocuğunuza kolay gelebilir.',
            friends: 'Kalabalık bir kutlamada birçok farklı kişiyle konuşmak ona keyifli gelebilir.',
            home: 'Uzun süre kimseyle görüşmeden evde kalmak ona pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Yeni bir iş ortamında pek çok kişiyle tanışıp sohbet başlatmak sana kolay gelebilir.',
          },
        },
      },
    },
    /*
     * Sıcak ve uyumlu olma: ipc04 "İnsanlara ilgi duyarım", ipc12 "Başkalarının içini rahatlatırım", ipc20 "Başkalarının
     * hâlini hatırını sorarım", ipc28 "Başkalarıyla iyi geçinirim".
     */
    warm_agreeable: {
      poles: { low: 'İnsanlarla az ilgilenen', high: 'Sıcak ve uyumlu' },
      bands: {
        low: {
          from: { school: ['ipc20'], friends: ['ipc12'], home: ['ipc04'], work: ['ipc20', 'ipc04'] },
          student: {
            school: 'Grup çalışmasında herkesin hâlini sormak yerine işin kendisine odaklanabilirsin.',
            friends: 'Bir arkadaşın üzgünken onun içini rahatlatmaya çalışmayı bazen düşünmeyebilirsin.',
            home: 'Evdekilerin günlük hayatıyla pek ilgilenmeden kendi işlerine dönebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında herkesin hâlini sormak yerine işin kendisine odaklanabilir.',
            friends: 'Bir arkadaşı üzgünken onun içini rahatlatmaya çalışmayı bazen düşünmeyebilir.',
            home: 'Evdekilerin günlük hayatıyla pek ilgilenmeden kendi işlerine dönebilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın kişilerin hâlini sormak yerine işin kendisine odaklanabilirsin.',
          },
        },
        average: {
          from: { school: ['ipc12'], friends: ['ipc04', 'ipc20'], home: ['ipc20'], work: ['ipc04', 'ipc12'] },
          student: {
            school: 'Bazen üzgün bir sınıf arkadaşının içini rahatlatmaya çalışabilir, bazen kendi işine dönebilirsin.',
            friends: 'Bazı arkadaşlarının hâlini sık sık sorabilir, bazılarıyla daha az ilgilenebilirsin.',
            home: 'Evdekilerin hâlini bazen sorabilir, yoğun günlerde bunu atlayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazen üzgün bir sınıf arkadaşının içini rahatlatmaya çalışabilir, bazen kendi işine dönebilir.',
            friends: 'Bazı arkadaşlarının hâlini sık sık sorabilir, bazılarıyla daha az ilgilenebilir.',
            home: 'Evdekilerin hâlini bazen sorabilir, yoğun günlerde bunu atlayabilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın kişilerle bazen yakından ilgilenebilir, bazen işine odaklanabilirsin.',
          },
        },
        high: {
          from: { school: ['ipc12', 'ipc20'], friends: ['ipc28', 'ipc04'], home: ['ipc12'], work: ['ipc28', 'ipc20'] },
          student: {
            school: 'Üzgün görünen bir sınıf arkadaşının hâlini sorup içini rahatlatmaya çalışabilirsin.',
            friends: 'Arkadaşlarınla çoğu zaman iyi geçinebilir, onların hayatıyla ilgilenebilirsin.',
            home: 'Evdekilerden birinin içini rahatlatmaya çalışırken kendi işini bir kenara bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz üzgün görünen bir sınıf arkadaşının hâlini sorup içini rahatlatmaya çalışabilir.',
            friends: 'Arkadaşlarıyla çoğu zaman iyi geçinebilir, onların hayatıyla ilgilenebilir.',
            home: 'Evdekilerden birinin içini rahatlatmaya çalışırken kendi işini bir kenara bırakabilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın kişilerle çoğu zaman iyi geçinebilir, hâllerini sorabilirsin.',
          },
        },
      },
    },
    /*
     * Hoşgörülü ve uysal olma: ipc03 "İnsanların pek çok davranışına katlanırım", ipc11 "Olayları geldiği gibi karşılarım",
     * ipc19 "Önce başkalarını düşünürüm", ipc27 "Bir şey anlatırken nadiren abartırım" (kullanılmadı).
     */
    unassuming_ingenuous: {
      poles: { low: 'Her şeye katlanmayan', high: 'Hoşgörülü ve uysal' },
      bands: {
        low: {
          from: { school: ['ipc03'], friends: ['ipc19'], home: ['ipc11'], work: ['ipc03'] },
          student: {
            school: 'Grup çalışmasında seni rahatsız eden bir davranışa katlanmak yerine bunu dile getirebilirsin.',
            friends: 'Arkadaşlarınla bir şey seçerken kendi isteğini de hesaba katabilirsin.',
            home: 'Evdeki bir plan birden değişince bunu olduğu gibi kabullenmek sana zor gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında onu rahatsız eden bir davranışa katlanmak yerine bunu dile getirebilir.',
            friends: 'Arkadaşlarıyla bir şey seçerken kendi isteğini de hesaba katabilir.',
            home: 'Evdeki bir plan birden değişince bunu olduğu gibi kabullenmek ona zor gelebilir.',
          },
          adult: {
            work: 'Ortak bir işte seni rahatsız eden bir davranışa uzun süre katlanmayabilirsin.',
          },
        },
        average: {
          from: { school: ['ipc03'], friends: ['ipc19'], home: ['ipc11'], work: ['ipc19'] },
          student: {
            school: 'Grup çalışmasında bazı davranışlara katlanabilir, bazılarını dile getirebilirsin.',
            friends: 'Arkadaşlarınla bir şey seçerken bazen önce onları düşünebilir, bazen kendi isteğini öne koyabilirsin.',
            home: 'Evdeki küçük değişiklikleri bazen geldiği gibi karşılayabilir, bazen kabullenmek için zaman isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bazı davranışlara katlanabilir, bazılarını dile getirebilir.',
            friends: 'Arkadaşlarıyla bir şey seçerken bazen önce onları düşünebilir, bazen kendi isteğini öne koyabilir.',
            home: 'Evdeki küçük değişiklikleri bazen geldiği gibi karşılayabilir, bazen kabullenmek için zaman isteyebilir.',
          },
          adult: {
            work: 'Bazı işlerde önce başkalarını düşünebilir, bazılarında kendi isteğini öne koyabilirsin.',
          },
        },
        high: {
          from: { school: ['ipc03'], friends: ['ipc19'], home: ['ipc11'], work: ['ipc19', 'ipc03'] },
          student: {
            school: 'Grup çalışmasında bir arkadaşının seni rahatsız eden davranışlarına çoğu zaman katlanabilirsin.',
            friends: 'Arkadaşlarınla bir şey seçerken önce onları düşünüp kendi isteğini geri plana atabilirsin.',
            home: 'Evdeki bir plan birden değişince bunu çoğu zaman geldiği gibi karşılayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bir arkadaşının onu rahatsız eden davranışlarına çoğu zaman katlanabilir.',
            friends: 'Arkadaşlarıyla bir şey seçerken önce onları düşünüp kendi isteğini geri plana atabilir.',
            home: 'Evdeki bir plan birden değişince bunu çoğu zaman geldiği gibi karşılayabilir.',
          },
          adult: {
            work: 'Ortak bir işte önce başkalarını düşünüp kendi isteklerini sona bırakabilirsin.',
          },
        },
      },
    },
    /*
     * Geri planda kalma: ipc02 "Alçak sesle konuşurum", ipc10 "Başkalarının sözünü bitirmesine izin veririm", ipc18 "Kendimi
     * pek övmem", ipc26 "İlgi odağı olmaktan hoşlanmam".
     */
    unassured_submissive: {
      poles: { low: 'Geri planda kalmayan', high: 'Geri planda kalan' },
      bands: {
        low: {
          from: { school: ['ipc18'], friends: ['ipc26'], home: ['ipc10'], work: ['ipc18'] },
          student: {
            school: 'Bir projede yaptığın işi anlatmaktan çekinmeyebilirsin.',
            friends: 'Arkadaşlarınla bir aradayken ilgi odağı olmak seni rahatsız etmeyebilir.',
            home: 'Evdekilerle konuşurken onların sözünü bitirmesini bazen beklemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir projede yaptığı işi anlatmaktan çekinmeyebilir.',
            friends: 'Arkadaşlarıyla bir aradayken ilgi odağı olmak onu rahatsız etmeyebilir.',
            home: 'Evdekilerle konuşurken onların sözünü bitirmesini bazen beklemeyebilir.',
          },
          adult: {
            work: 'Yaptığın işi ve başarılarını anlatmaktan çekinmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['ipc10'], friends: ['ipc26'], home: ['ipc02'], work: ['ipc18', 'ipc26'] },
          student: {
            school: 'Derste bazen başkalarının sözünü bitirmesini bekleyebilir, bazen hemen söz alabilirsin.',
            friends: 'Arkadaşlarınla bazen ilgi odağı olmaktan hoşlanabilir, bazen geri planda kalmayı seçebilirsin.',
            home: 'Evdekilerle bazen alçak sesle, bazen daha yüksek sesle konuşabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bazen başkalarının sözünü bitirmesini bekleyebilir, bazen hemen söz alabilir.',
            friends: 'Arkadaşlarıyla bazen ilgi odağı olmaktan hoşlanabilir, bazen geri planda kalmayı seçebilir.',
            home: 'Evdekilerle bazen alçak sesle, bazen daha yüksek sesle konuşabilir.',
          },
          adult: {
            work: 'Bazı işlerde başarılarını anlatabilir, bazılarında geri planda kalmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['ipc10'], friends: ['ipc18'], home: ['ipc02'], work: ['ipc10', 'ipc18'] },
          student: {
            school: 'Derste başkalarının sözünü bitirmesini bekleyip onları dikkatle dinleyebilirsin.',
            friends: 'Arkadaşlarınla konuşurken kendini pek övmeyebilirsin.',
            home: 'Evdekilerle alçak sesle konuşabilirsin; söylediklerin bazen duyulmayabilir.',
          },
          parent: {
            school: 'Çocuğunuz derste başkalarının sözünü bitirmesini bekleyip onları dikkatle dinleyebilir.',
            friends: 'Arkadaşlarıyla konuşurken kendini pek övmeyebilir.',
            home: 'Evdekilerle alçak sesle konuşabilir; söyledikleri bazen duyulmayabilir.',
          },
          adult: {
            work: 'Bir toplantıda başkalarının sözünü bitirmesini bekleyebilir, başarılarını pek anlatmayabilirsin.',
          },
        },
      },
    },
    /*
     * Sessiz ve içe dönük olma: ipc01 "Tanımadığım insanların yanında sessiz olurum", ipc09 "Özel hayatımı pek kimseyle
     * paylaşmam", ipc17 "Çok konuşmam", ipc25 "Genellikle söyleyecek pek bir şeyim olmaz".
     */
    aloof_introverted: {
      poles: { low: 'Konuşmaktan çekinmeyen', high: 'Sessiz ve içe dönük' },
      bands: {
        low: {
          from: { school: ['ipc01'], friends: ['ipc09'], home: ['ipc25', 'ipc17'], work: ['ipc01'] },
          student: {
            school: 'Yeni bir sınıfta tanımadığın kişilerle konuşmak sana zor gelmeyebilir.',
            friends: 'Özel hayatını arkadaşlarınla paylaşmaktan çekinmeyebilirsin; çok özel şeyler için kişiyi biraz tanımak iyi gelebilir.',
            home: 'Evdekilerle konuşurken çoğu zaman anlatacak bir şey bulabilirsin.',
          },
          parent: {
            school: 'Yeni bir sınıfta tanımadığı kişilerle konuşmak çocuğunuza zor gelmeyebilir.',
            friends: 'Özel hayatını arkadaşlarıyla paylaşmaktan çekinmeyebilir; çok özel şeyler için kişiyi biraz tanıması iyi gelebilir.',
            home: 'Evdekilerle konuşurken çoğu zaman anlatacak bir şey bulabilir.',
          },
          adult: {
            work: 'Yeni tanıştığın kişilerle konuşmak sana zor gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['ipc17'], friends: ['ipc09'], home: ['ipc01'], work: ['ipc17', 'ipc01'] },
          student: {
            school: 'Bazı derslerde çok konuşabilir, bazılarında sessiz kalmayı seçebilirsin.',
            friends: 'Özel hayatını bazı arkadaşlarınla paylaşabilir, bazılarına pek bir şey anlatmayabilirsin.',
            home: 'Eve gelen tanımadığın misafirlerin yanında bazen sessiz kalabilir, bazen rahatça konuşabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde çok konuşabilir, bazılarında sessiz kalmayı seçebilir.',
            friends: 'Özel hayatını bazı arkadaşlarıyla paylaşabilir, bazılarına pek bir şey anlatmayabilir.',
            home: 'Eve gelen tanımadığı misafirlerin yanında bazen sessiz kalabilir, bazen rahatça konuşabilir.',
          },
          adult: {
            work: 'Bazı iş ortamlarında rahatça konuşabilir, bazılarında az konuşmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['ipc17'], friends: ['ipc01'], home: ['ipc09'], work: ['ipc17', 'ipc01'] },
          student: {
            school: 'Derste çok konuşmak yerine dinlemeyi seçebilirsin.',
            friends: 'Tanımadığın birinin yanında sessiz kalabilir, sohbete katılmak için zaman isteyebilirsin.',
            home: 'Özel hayatını pek kimseyle paylaşmayabilirsin; bu sana kendine ait bir alan bırakabilir.',
          },
          parent: {
            school: 'Çocuğunuz derste çok konuşmak yerine dinlemeyi seçebilir.',
            friends: 'Tanımadığı birinin yanında sessiz kalabilir, sohbete katılmak için zaman isteyebilir.',
            home: 'Özel hayatını pek kimseyle paylaşmayabilir; bu ona kendine ait bir alan bırakabilir.',
          },
          adult: {
            work: 'Tanımadığın kişilerle çalışırken çoğu zaman az konuşabilirsin.',
          },
        },
      },
    },
    /*
     * Başkalarının derdine mesafeli olma: ipc08 "Herkesin kendi başının çaresine bakması gerektiğine inanırım", ipc16
     * "Acındırmak için anlatılan hikâyelere kanmam", ipc24 "Bir şeylere pek kafa yormam" (kullanılmadı), ipc32 "Başkalarının
     * sorunları beni ilgilendirmez".
     */
    cold_hearted: {
      poles: { low: 'Dertlere kayıtsız kalmayan', high: 'Dertlere mesafeli duran' },
      bands: {
        low: {
          from: { school: ['ipc08'], friends: ['ipc16'], home: ['ipc32'], work: ['ipc08'] },
          student: {
            school: 'Grup çalışmasında işinde zorlanan bir arkadaşına yardım etmeyi düşünebilirsin.',
            friends: 'Bir arkadaşın seni acındırmak için bir hikâye anlatınca buna kolayca inanabilirsin.',
            home: 'Evdekilerden biri derdini anlatınca onu dinlemek isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında işinde zorlanan bir arkadaşına yardım etmeyi düşünebilir.',
            friends: 'Bir arkadaşı onu acındırmak için bir hikâye anlatınca buna kolayca inanabilir.',
            home: 'Evdekilerden biri derdini anlatınca onu dinlemek isteyebilir.',
          },
          adult: {
            work: 'Ortak bir işte zorda kalan birine yardım etmeyi düşünebilirsin.',
          },
        },
        average: {
          from: { school: ['ipc08'], friends: ['ipc16'], home: ['ipc32'], work: ['ipc08'] },
          student: {
            school: 'Grup çalışmasında bazen herkesin kendi işini yapmasını bekleyebilir, bazen bir arkadaşına yardım edebilirsin.',
            friends: 'Bir arkadaşın seni acındırmaya çalışınca bazen inanabilir, bazen mesafeli durabilirsin.',
            home: 'Evdekilerin sorunlarıyla bazen ilgilenebilir, bazen kendi işine dönebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bazen herkesin kendi işini yapmasını bekleyebilir, bazen bir arkadaşına yardım edebilir.',
            friends: 'Bir arkadaşı onu acındırmaya çalışınca bazen inanabilir, bazen mesafeli durabilir.',
            home: 'Evdekilerin sorunlarıyla bazen ilgilenebilir, bazen kendi işine dönebilir.',
          },
          adult: {
            work: 'Bazı işlerde herkesin kendi işini halletmesini bekleyebilir, bazılarında yardıma koşabilirsin.',
          },
        },
        high: {
          from: { school: ['ipc08'], friends: ['ipc16'], home: ['ipc32'], work: ['ipc08', 'ipc32'] },
          student: {
            school: 'Grup çalışmasında herkesin kendi işini halletmesi gerektiğini düşünebilirsin.',
            friends: 'Acındırmak için anlatılan bir hikâyeye kolay kolay kanmayabilirsin.',
            home: 'Evdekilerden biri derdini anlatınca dinlemek sana pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında herkesin kendi işini halletmesi gerektiğini düşünebilir.',
            friends: 'Acındırmak için anlatılan bir hikâyeye kolay kolay kanmayabilir.',
            home: 'Evdekilerden biri derdini anlatınca dinlemek ona pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Ortak bir işte herkesin kendi sorununu çözmesini bekleyebilirsin.',
          },
        },
      },
    },
    /*
     * Sert ve eleştirel olma: ipc07 "Başkalarını acımasızca eleştiririm", ipc15 "Başkalarının söylediklerine karşı çıkarım",
     * ipc23 "İnsanlara terslenirim", ipc31 "Sivri dilli biriyim".
     */
    arrogant_calculating: {
      poles: { low: 'Yumuşak dilli', high: 'Sert ve eleştirel' },
      bands: {
        low: {
          from: { school: ['ipc07'], friends: ['ipc15'], home: ['ipc23'], work: ['ipc07', 'ipc31'] },
          student: {
            school: 'Bir arkadaşının ödevini eleştirirken yumuşak bir dil kullanabilirsin.',
            friends: 'Arkadaşlarının söylediği bir şeye katılmasan da bazen karşı çıkmayabilirsin.',
            home: 'Evdekilerle bir anlaşmazlıkta çoğu zaman terslenmeden konuşabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir arkadaşının ödevini eleştirirken yumuşak bir dil kullanabilir.',
            friends: 'Arkadaşlarının söylediği bir şeye katılmasa da bazen karşı çıkmayabilir.',
            home: 'Evdekilerle bir anlaşmazlıkta çoğu zaman terslenmeden konuşabilir.',
          },
          adult: {
            work: 'Birinin işini eleştirirken çoğu zaman yumuşak bir dil kullanabilirsin.',
          },
        },
        average: {
          from: { school: ['ipc15'], friends: ['ipc07'], home: ['ipc23'], work: ['ipc15'] },
          student: {
            school: 'Derste bazen bir görüşe karşı çıkabilir, bazen katılmasan da sessiz kalabilirsin.',
            friends: 'Arkadaşlarını bazen sert bir dille eleştirebilir, bazen yumuşak bir dil seçebilirsin.',
            home: 'Evdekilere bazen terslenebilir, çoğu zaman sakin konuşabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bazen bir görüşe karşı çıkabilir, bazen katılmasa da sessiz kalabilir.',
            friends: 'Arkadaşlarını bazen sert bir dille eleştirebilir, bazen yumuşak bir dil seçebilir.',
            home: 'Evdekilere bazen terslenebilir, çoğu zaman sakin konuşabilir.',
          },
          adult: {
            work: 'Bazı konularda başkalarına karşı çıkabilir, bazılarında yumuşak bir dil seçebilirsin.',
          },
        },
        high: {
          from: { school: ['ipc15'], friends: ['ipc07', 'ipc31'], home: ['ipc23'], work: ['ipc15', 'ipc07'] },
          student: {
            school: 'Derste katılmadığın bir görüşe açıkça karşı çıkabilirsin.',
            friends: 'Bir arkadaşını eleştirirken bazen sert ya da kırıcı sözler kullanabilirsin.',
            home: 'Evdekilerle konuşurken bazen terslenebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste katılmadığı bir görüşe açıkça karşı çıkabilir.',
            friends: 'Bir arkadaşını eleştirirken bazen sert ya da kırıcı sözler kullanabilir.',
            home: 'Evdekilerle konuşurken bazen terslenebilir.',
          },
          adult: {
            work: 'Katılmadığın bir fikre açıkça karşı çıkabilirsin; eleştirin bazen sert gelebilir.',
          },
        },
      },
    },
  },
};
