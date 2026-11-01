import type { SurveyDaily } from './types';

/**
 * Kişiliğin 10 Yönü: günlük hayatta nasıl görünür (9. sınıftan yetişkine).
 * Sonuç kartı olan ölçekler beş boyuttur (lib/reports/daily-parts.ts, dailyScales: yönlerin kendi kartı yoktur). Bir boyutun
 * örnekleri iki yönünün maddelerinden yazılır ve iki yöne de yayılır; iki yön ayrıştığında kart örnek göstermez.
 * Dört boyut özellik tonundadır (src/content/reports/kisiligin-10-yonu.ts): düşük ve yüksek düzeyin örneklerinden en az biri
 * bir kolaylık, en az biri yumuşak bir zorluk söyler. Duygusal Denge gelişim tonundadır (düşük düzeyi ya da İç rahatlık yönü
 * destek kutusunu açar): düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz; zor anı anlatan her örneğin
 * yanında bir dayanak vardır; "Duygularımı kontrol altında tutarım" (vol08) maddesine dayanılmadı: yüksek uç duyguyu saklamak
 * gibi okunmasın. Düşünsel merakın beceri ve hız bildiren maddelerine (int01, int02, int04, int05, int06, int07, int10) ve
 * "İnsanları etkileme yeteneğim yoktur" (ass08) maddesine dayanılmadı: örnekler zekâ ya da yetenek gibi okunmasın; düşünsel
 * merakın örnekleri karmaşık problemlerden, felsefi tartışmalardan ve okuması zor metinlerden hoşlanmayı anlatır.
 * Yetişkinin iş satırı `work`; arkadaş ve ev satırlarında okul sözcüğü olmadığı için yetişkin de onları görür.
 * Maddeye doğrudan dayanmayan, raporun kendi metninden gelen uzantılar: dışadönüklükte yüksek düzeyde "başkalarının fikrini
 * sormayı unutabilirsin" (ass01'in bedeli), uyumlulukta düşük düzeyde "düşündüğünü dolandırmadan söyleyebilirsin" (pol05'in
 * olumlu yanı), deneyime açıklıkta yüksek düzeyde "zamanın nasıl geçtiğini fark etmeyebilirsin" (opn03'ün bedeli) ve duygusal
 * dengedeki dayanaklar.
 */
export const kisiligin10YonuDaily: SurveyDaily = {
  kind: 'survey',
  version: 'kisiligin-10-yonu-gunluk-1',
  scales: {
    /*
     * Dışadönüklük. Coşku: ent01 "Kolayca arkadaş edinirim", ent02 "İnsanlara çabuk ısınırım", ent03, ent04 "Çok eğlenirim",
     * ent05 "Çok gülerim"; ters ent06 "Beni tanımak zordur", ent07 "İnsanlara karşı mesafeli dururum", ent08, ent09
     * "Çevremdeki coşkuya pek kapılmam", ent10. Atılganlık: ass01 "İdareyi ele alırım", ass02, ass03, ass04, ass05
     * "Başkalarını bir şeyler yapmaya ikna edebilirim", ass06 "Harekete ilk geçen ben olurum"; ters ass07, ass08, ass09 "Yolu
     * başkalarının göstermesini beklerim", ass10 "Fikirlerimi kendime saklarım".
     */
    extraversion: {
      poles: { low: 'Yavaş ısınır, geride durur', high: 'Çabuk ısınır, öne çıkar' },
      bands: {
        low: {
          from: { school: ['ass09', 'ass10'], friends: ['ent02', 'ent06'], home: ['ent09'], work: ['ass09', 'ass10'] },
          student: {
            school: 'Grup çalışmasında yolu başkalarının göstermesini bekleyebilir, fikrini kendine saklayabilirsin.',
            friends: 'Yeni tanıştığın insanlara ısınman biraz zaman alabilir.',
            home: 'Evdeki kalabalık bir kutlamada coşkuya kapılmadan kendi temponu koruyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında yolu başkalarının göstermesini bekleyebilir, fikrini kendine saklayabilir.',
            friends: 'Yeni tanıştığı insanlara ısınması biraz zaman alabilir.',
            home: 'Evdeki kalabalık bir kutlamada coşkuya kapılmadan kendi temposunu koruyabilir.',
          },
          adult: {
            work: 'Bir toplantıda fikrini kendine saklayıp yolu başkalarının göstermesini bekleyebilirsin.',
          },
        },
        average: {
          from: { school: ['ass06', 'ass09'], friends: ['ent02', 'ent07'], home: ['ent05', 'ent04'], work: ['ass01', 'ass10'] },
          student: {
            school: 'Grup çalışmasında bazen harekete hemen geçebilir, bazen başkalarını bekleyebilirsin.',
            friends: 'Bazı insanlara çabuk ısınabilir, bazılarına karşı önce biraz mesafeli durabilirsin.',
            home: 'Bazı günler çok gülüp eğlenebilir, bazı günler daha sakin olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bazen harekete hemen geçebilir, bazen başkalarını bekleyebilir.',
            friends: 'Bazı insanlara çabuk ısınabilir, bazılarına karşı önce biraz mesafeli durabilir.',
            home: 'Bazı günler çok gülüp eğlenebilir, bazı günler daha sakin olabilir.',
          },
          adult: {
            work: 'Bazı işlerde idareyi alabilir, bazılarında fikrini kendine saklayabilirsin.',
          },
        },
        high: {
          from: { school: ['ass01', 'ass05'], friends: ['ent01', 'ent02'], home: ['ass01'], work: ['ass01', 'ass06'] },
          student: {
            school: 'Grup çalışmasında idareyi ele alıp arkadaşlarını bir plana ikna etmeye çalışabilirsin.',
            friends: 'Yeni bir ortamda insanlara çabuk ısınıp kolayca arkadaş edinebilirsin.',
            home: 'Evdeki bir işte idareyi ele alabilir, bazen başkalarının fikrini sormayı unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında idareyi ele alıp arkadaşlarını bir plana ikna etmeye çalışabilir.',
            friends: 'Yeni bir ortamda insanlara çabuk ısınıp kolayca arkadaş edinebilir.',
            home: 'Evdeki bir işte idareyi ele alabilir, bazen başkalarının fikrini sormayı unutabilir.',
          },
          adult: {
            work: 'Bir işte idareyi ele alıp harekete geçmek isteyebilirsin.',
          },
        },
      },
    },
    /*
     * Uyumluluk. Şefkat: com01 "Başkalarının ne hissettiğini içimde hissederim", com02 "Başkalarının hâlini hatırını sorarım",
     * com03 "Başkalarının duygularını anlar, onlara ortak olurum", com04 "Başka insanların hayatlarına ilgi duyarım", com05
     * "Başkaları için bir şeyler yapmayı severim"; ters com06 "Başkalarının sorunları beni ilgilendirmez", com07 "Başkalarının
     * ihtiyaçlarıyla uğraşmak istemem", com08, com09 "Başkalarına zaman ayırmam", com10. Nezaket: pol01, pol02 "Israrcı biri
     * gibi görünmekten hiç hoşlanmam", pol03 "İsteklerimi başkalarına dayatmaktan kaçınırım", pol04 "İnsanları nadiren baskı
     * altına alırım"; ters pol05 "Başkalarını kıracak sözler söylerim", pol06–pol10 (kullanılmadı: suçlayıcı okunmasın).
     */
    agreeableness: {
      poles: { low: 'Kendi isteğini savunur', high: 'Başkalarını gözetir' },
      bands: {
        low: {
          from: { school: ['pol03', 'pol02'], friends: ['pol05'], home: ['com07', 'com06'], work: ['com09', 'com07'] },
          student: {
            school: 'Grup çalışmasında kendi isteğini ısrarla savunmaktan çekinmeyebilirsin.',
            friends: 'Bir arkadaşına düşündüğünü dolandırmadan söyleyebilirsin; bu bazen onu kırabilir.',
            home: 'Evdekilerin dertleri yerine çoğu zaman kendi işlerinle ilgilenmeyi seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında kendi isteğini ısrarla savunmaktan çekinmeyebilir.',
            friends: 'Bir arkadaşına düşündüğünü dolandırmadan söyleyebilir; bu bazen onu kırabilir.',
            home: 'Evdekilerin dertleri yerine çoğu zaman kendi işleriyle ilgilenmeyi seçebilir.',
          },
          adult: {
            work: 'Bir işte önce kendi hedefini gözetip başkalarının ihtiyaçlarına daha az zaman ayırabilirsin.',
          },
        },
        average: {
          from: { school: ['pol03', 'pol05'], friends: ['com02', 'com09'], home: ['com05'], work: ['pol04', 'pol03'] },
          student: {
            school: 'Grup çalışmasında çoğu zaman kırmadan konuşabilir, bazen isteğinde ısrar edebilirsin.',
            friends: 'Bazı arkadaşlarının hâlini hatırını sık sorabilir, bazılarına daha az zaman ayırabilirsin.',
            home: 'Evdekiler için bazen bir şeyler yapmak isteyebilir, bazen önce kendi işini bitirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında çoğu zaman kırmadan konuşabilir, bazen isteğinde ısrar edebilir.',
            friends: 'Bazı arkadaşlarının hâlini hatırını sık sorabilir, bazılarına daha az zaman ayırabilir.',
            home: 'Evdekiler için bazen bir şeyler yapmak isteyebilir, bazen önce kendi işini bitirebilir.',
          },
          adult: {
            work: 'Bir işte çoğu zaman kimseyi baskı altına almadan çalışabilir, bazen isteğinde ısrar edebilirsin.',
          },
        },
        high: {
          from: { school: ['com03', 'com01'], friends: ['com02', 'com04'], home: ['pol02', 'pol03'], work: ['com05', 'com01'] },
          student: {
            school: 'Üzgün bir sınıf arkadaşının duygularına ortak olup yanında durabilirsin.',
            friends: 'Arkadaşlarının hâlini hatırını sorup hayatlarıyla ilgilenebilirsin.',
            home: 'Israrcı görünmemek için evdekilere bir isteğini söylemeyi erteleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz üzgün bir sınıf arkadaşının duygularına ortak olup yanında durabilir.',
            friends: 'Arkadaşlarının hâlini hatırını sorup hayatlarıyla ilgilenebilir.',
            home: 'Israrcı görünmemek için evdekilere bir isteğini söylemeyi erteleyebilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişiler için bir şeyler yapmak sana iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Sorumluluk. Çalışkanlık: ind01 "Yaptığım planları uygularım", ind02 "Başladığım işi bitiririm", ind03 "İşleri çabuk
     * bitiririm", ind04; ters ind05–ind10 (ind06 ve ind10 kullanılmadı: işe başlayamama ya da dikkat gibi okunmasın).
     * Düzenlilik: ord01 "Düzeni severim", ord02 "Eşyalarımı derli toplu tutarım", ord03 "Bir plana ya da programa göre
     * hareket ederim", ord04, ord05, ord06 "Her ayrıntının halledilmiş olmasını isterim"; ters ord07 "Eşyalarımı ortada
     * bırakırım", ord08 "Dağınık insanlar beni rahatsız etmez", ord09, ord10 "Rutinden hoşlanmam".
     */
    conscientiousness: {
      poles: { low: 'Akışına göre ilerler', high: 'Planlı ve düzenli ilerler' },
      bands: {
        low: {
          from: { school: ['ind02', 'ind01'], friends: ['ord08'], home: ['ord10'], work: ['ind02', 'ind01'] },
          student: {
            school: 'Bir ödeve başlayıp yarıda bırakabilir ya da planını uygulamayı erteleyebilirsin.',
            friends: 'Bir arkadaşının ortalığı dağıtması seni pek rahatsız etmeyebilir.',
            home: 'Her gün aynı düzende geçen bir program sana sıkıcı gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir ödeve başlayıp yarıda bırakabilir ya da planını uygulamayı erteleyebilir.',
            friends: 'Bir arkadaşının ortalığı dağıtması onu pek rahatsız etmeyebilir.',
            home: 'Her gün aynı düzende geçen bir program ona sıkıcı gelebilir.',
          },
          adult: {
            work: 'Bir işe başlayıp yarıda bırakabilir, planladığın adımları erteleyebilirsin.',
          },
        },
        average: {
          from: { school: ['ind03'], friends: ['ord03'], home: ['ord02', 'ord07'], work: ['ind01', 'ord03'] },
          student: {
            school: 'Bazı ödevleri çabuk bitirebilir, bazılarını sonraya bırakabilirsin.',
            friends: 'Arkadaşlarınla bir buluşmayı bazen önceden programlayabilir, bazen o an karar verebilirsin.',
            home: 'Eşyalarını bazen derli toplu tutabilir, yoğun günlerde ortada bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevleri çabuk bitirebilir, bazılarını sonraya bırakabilir.',
            friends: 'Arkadaşlarıyla bir buluşmayı bazen önceden programlayabilir, bazen o an karar verebilir.',
            home: 'Eşyalarını bazen derli toplu tutabilir, yoğun günlerde ortada bırakabilir.',
          },
          adult: {
            work: 'Bazı işlerde bir programa göre ilerleyebilir, bazılarında akışına bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['ind02', 'ind01'], friends: ['ord03'], home: ['ord02', 'ord01'], work: ['ind03', 'ord06'] },
          student: {
            school: 'Başladığın bir ödevi çoğu zaman bitirip yaptığın planı uygulayabilirsin.',
            friends: 'Arkadaşlarınla bir buluşmanın programı son anda değişince canın sıkılabilir.',
            home: 'Eşyalarını derli toplu tutmak ve düzeni korumak sana iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz başladığı bir ödevi çoğu zaman bitirip yaptığı planı uygulayabilir.',
            friends: 'Arkadaşlarıyla bir buluşmanın programı son anda değişince canı sıkılabilir.',
            home: 'Eşyalarını derli toplu tutmak ve düzeni korumak ona iyi gelebilir.',
          },
          adult: {
            work: 'Bir işi çabuk bitirip her ayrıntının halledildiğinden emin olmak isteyebilirsin.',
          },
        },
      },
    },
    /*
     * Duygusal Denge (gelişim tonu; kaynakta Nevrotiklik, ters yönde puanlanır). Soğukkanlılık: ters vol01 "Çabuk öfkelenirim",
     * vol02, vol03 "Ruh hâlim sık sık değişir", vol04 "Ruh hâli kolayca inip çıkan biriyim", vol05 "Sinirlerim çabuk gerilir",
     * vol06; vol07 "Sinirim nadiren bozulur", vol08 (kullanılmadı), vol09 "Soğukkanlılığımı nadiren kaybederim", vol10 "Kolay
     * kolay sinirlenmem". İç rahatlık: ters wit01, wit02, wit03 "Birçok şey için endişelenirim", wit04 "Cesaretim çabuk
     * kırılır", wit05 "Yaşadığım olaylar karşısında bunalırım", wit06; wit07 "Kendimi nadiren hüzünlü hissederim", wit08
     * "Kendimle barışığım", wit09 "Nadiren kendimi moralsiz hissederim", wit10. Düşük düzey "sık sık" demez.
     */
    emotional_stability: {
      poles: { low: 'Duygularını yoğun yaşar', high: 'Çoğu zaman sakin kalır' },
      bands: {
        low: {
          from: { school: ['wit04'], friends: ['vol01', 'vol05'], home: ['vol03', 'vol04'], work: ['wit03', 'wit05'] },
          student: {
            school: 'Bir sınav istediğin gibi geçmeyince cesaretin çabuk kırılabilir; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            friends: 'Bir tartışmada çabuk öfkelenebilirsin; sonra olanı sakin bir anda konuşmak rahatlatabilir.',
            home: 'Gün içinde ruh hâlin değişebilir; seni düşündüren şeyleri biriyle paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Bir sınav istediği gibi geçmeyince çocuğunuzun cesareti çabuk kırılabilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            friends: 'Bir tartışmada çabuk öfkelenebilir; sonra olanı sakin bir anda konuşmak onu rahatlatabilir.',
            home: 'Gün içinde ruh hâli değişebilir; onu düşündüren şeyleri biriyle paylaşmak iyi gelebilir.',
          },
          adult: {
            work: 'Yoğun bir dönemde birçok şey için endişelenebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['wit03'], friends: ['vol10', 'vol01'], home: ['wit09', 'wit08'], work: ['wit03'] },
          student: {
            school: 'Çoğu gün sakin olabilirsin; yine de bazı sınavlardan önce endişelenebilirsin.',
            friends: 'Bir tartışmada bazen kolay kolay sinirlenmeyebilir, bazen çabuk öfkelenebilirsin.',
            home: 'Bazı günler moralin bozulabilir, çoğu gün kendinle barışık olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz çoğu gün sakin olabilir; yine de bazı sınavlardan önce endişelenebilir.',
            friends: 'Bir tartışmada bazen kolay kolay sinirlenmeyebilir, bazen çabuk öfkelenebilir.',
            home: 'Bazı günler morali bozulabilir, çoğu gün kendisiyle barışık olabilir.',
          },
          adult: {
            work: 'Çoğu iş gününde sakin olabilir, belirsiz bir durumda endişelenebilirsin.',
          },
        },
        high: {
          from: { school: ['wit04'], friends: ['vol09', 'vol07'], home: ['wit09', 'wit07'], work: ['vol09', 'wit05'] },
          student: {
            school: 'Bir sınav istediğin gibi geçmese de cesaretin çoğu zaman kolay kolay kırılmayabilir.',
            friends: 'Gergin bir tartışmada da çoğu zaman soğukkanlılığını koruyabilirsin.',
            home: 'Çoğu gün moralin yerinde olabilir; yine de seni üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Bir sınav istediği gibi geçmese de çocuğunuzun cesareti çoğu zaman kolay kolay kırılmayabilir.',
            friends: 'Gergin bir tartışmada da çoğu zaman soğukkanlılığını koruyabilir.',
            home: 'Çoğu gün morali yerinde olabilir; yine de onu üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          adult: {
            work: 'Sıkışık bir iş gününde de çoğu zaman sakin kalıp işine devam edebilirsin.',
          },
        },
      },
    },
    /*
     * Deneyime Açıklık. Düşünsel merak: int03 "Karmaşık problemleri çözmeyi severim"; ters int08 "Felsefi tartışmalardan
     * kaçınırım", int09 "Okuması zor metinlerden kaçınırım" (beceri ve hız bildiren öteki maddeler kullanılmadı). Sanat ve
     * hayal gücü: opn01 "Doğanın güzelliğinden keyif alırım", opn02 "Sanatın önemli olduğuna inanırım", opn03 "Bir şeyler
     * üzerine düşünüp taşınmayı çok severim", opn04 "Kendimi müziğe tamamen kaptırırım", opn05, opn06; ters opn07 "Şiiri
     * sevmem", opn08 "Pek düşüncelere dalıp gitmem", opn09 "Pek hayal kurmam", opn10. Düşük ucun örnekleri ilgiyi anlatır.
     */
    openness: {
      poles: { low: 'Somut konuları tercih eder', high: 'Fikirlere ve sanata açık' },
      bands: {
        low: {
          from: { school: ['int08'], friends: ['opn07', 'opn02'], home: ['opn09', 'opn08'], work: ['int09'] },
          student: {
            school: 'Derste felsefi bir tartışma açılınca ilgin azalabilir; somut konular sana daha çekici gelebilir.',
            friends: 'Arkadaşların bir şiir ya da sergi konuşurken sen başka bir konuya geçmeyi seçebilirsin.',
            home: 'Hayallere ya da düşüncelere dalmak yerine çoğu zaman o an yaptığın işle ilgilenebilirsin.',
          },
          parent: {
            school: 'Derste felsefi bir tartışma açılınca çocuğunuzun ilgisi azalabilir; somut konular ona daha çekici gelebilir.',
            friends: 'Arkadaşları bir şiir ya da sergi konuşurken o başka bir konuya geçmeyi seçebilir.',
            home: 'Hayallere ya da düşüncelere dalmak yerine çoğu zaman o an yaptığı işle ilgilenebilir.',
          },
          adult: {
            work: 'Bir işte okuması zor, uzun bir metin sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['int03'], friends: ['opn04', 'opn02'], home: ['opn03', 'opn08'], work: ['int03'] },
          student: {
            school: 'Bazı karmaşık problemler ilgini çekebilir, bazıları sana uzak gelebilir.',
            friends: 'Arkadaşlarınla bazen müzik ve sanat konuşabilir, bazen başka konuları seçebilirsin.',
            home: 'Bazen bir şey üzerine düşünüp taşınabilir, bazen hemen işe koyulabilirsin.',
          },
          parent: {
            school: 'Bazı karmaşık problemler çocuğunuzun ilgisini çekebilir, bazıları ona uzak gelebilir.',
            friends: 'Arkadaşlarıyla bazen müzik ve sanat konuşabilir, bazen başka konuları seçebilir.',
            home: 'Bazen bir şey üzerine düşünüp taşınabilir, bazen hemen işe koyulabilir.',
          },
          adult: {
            work: 'Bir işte bazı karmaşık sorunlar ilgini çekebilir, bazılarını başkasına bırakmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['int03', 'int09'], friends: ['opn04', 'opn01'], home: ['opn03'], work: ['int03'] },
          student: {
            school: 'Karmaşık bir problemle uğraşmak ya da okuması zor bir metni okumak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla bir şarkıya ya da doğadaki bir manzaraya kendini kaptırabilirsin.',
            home: 'Bir şey üzerine düşünüp taşınırken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Karmaşık bir problemle uğraşmak ya da okuması zor bir metni okumak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla bir şarkıya ya da doğadaki bir manzaraya kendini kaptırabilir.',
            home: 'Bir şey üzerine düşünüp taşınırken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Bir işte karmaşık bir sorunla uğraşmak sana keyifli gelebilir.',
          },
        },
      },
    },
  },
};
