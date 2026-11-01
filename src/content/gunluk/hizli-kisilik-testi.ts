import type { SurveyDaily } from './types';

/**
 * Hızlı Kişilik Testi: günlük hayatta nasıl görünür (9. sınıftan yetişkine).
 * Her boyut dört maddeyle ölçülür (Mini-IPIP); örnekler yalnızca o dört maddenin sorduğu davranışlardan yazılır
 * (src/content/reports/hizli-kisilik-testi.ts ile aynı ilke): Dışadönüklük kalabalıkta konuşkan ve görünür olmayı; Uyumluluk
 * başkalarının duygularına ve sorunlarına ilgiyi; Sorumluluk işleri hemen halletmeyi ve düzeni; Duygusal Denge çoğu zaman
 * rahat olmayı, duyguların inip çıkmamasını, küçük şeylere bozulmamayı ve hüzünlü hissetmemeyi; Merak ve Hayal Gücü hayal
 * gücünü ve soyut fikirlere ilgiyi anlatır. Dört boyut özellik tonundadır: düşük ve yüksek düzeyin örneklerinden en az
 * biri bir kolaylık, en az biri yumuşak bir zorluk söyler. Duygusal Denge gelişim tonundadır (düşük düzeyi destek kutusunu
 * açar): düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz; zor anı anlatan her örneğin yanında bir
 * dayanak vardır; şablondaki gibi düşük düzey "sık sık" demez (3, 3, 2, 2 gibi cevaplar da bu düzeye düşer). "Soyut fikirleri
 * anlamakta zorlanırım" (m15) maddesine bilerek dayanılmadı: düşük uç bir beceri gibi okunmasın.
 * Yetişkinin iş satırı `work`; arkadaş ve ev satırlarında okul sözcüğü olmadığı için yetişkin de onları görür.
 * Maddeye doğrudan dayanmayan, testin ya da raporun kendi metninden gelen uzantılar: dışadönüklükte yüksek düzeyde
 * "başkalarına söz bırakmayı unutabilirsin" (m06'nın bedeli; raporun "sessiz kalan birine de konuşma fırsatı vermek"
 * önerisi), uyumlulukta yüksek düzeyde "bu duygu seni de yorabilir" (raporun metni), sorumlulukta yüksek düzeyde "düzen
 * bozulunca canın sıkılabilir" (m13'ün bedeli), merakta yüksek düzeyde "zamanın nasıl geçtiğini fark etmeyebilirsin" (m05'in
 * bedeli) ve duygusal dengedeki dayanaklar.
 */
export const hizliKisilikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'hizli-kisilik-gunluk-1',
  scales: {
    /*
     * Dışadönüklük: m01 "Arkadaş ortamlarında havayı canlandıran kişi genellikle benim", m11 "Kalabalık ortamlarda birçok
     * farklı kişiyle konuşurum"; ters: m06 "Çok konuşmam", m16 "Kalabalıkta geri planda kalmayı tercih ederim".
     */
    extraversion: {
      poles: { low: 'Geri planda kalır', high: 'Ortamı canlandırır' },
      bands: {
        low: {
          from: { school: ['m06'], friends: ['m16', 'm11'], home: ['m11'], work: ['m06'] },
          student: {
            school: 'Grup çalışmasında çok konuşmak yerine çoğu zaman başkalarını dinlemeyi seçebilirsin.',
            friends: 'Kalabalık bir ortamda geri planda kalıp az kişiyle konuşmak sana daha rahat gelebilir.',
            home: 'Misafir gelince herkesle tek tek sohbet etmek sana zor gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında çok konuşmak yerine çoğu zaman başkalarını dinlemeyi seçebilir.',
            friends: 'Kalabalık bir ortamda geri planda kalıp az kişiyle konuşmak ona daha rahat gelebilir.',
            home: 'Misafir gelince herkesle tek tek sohbet etmek ona zor gelebilir.',
          },
          adult: {
            work: 'Bir toplantıda çok konuşmak yerine çoğu zaman başkalarını dinlemeyi seçebilirsin.',
          },
        },
        average: {
          from: { school: ['m06'], friends: ['m01', 'm16'], home: ['m11'], work: ['m06'] },
          student: {
            school: 'Bazı derslerde çok konuşabilir, bazılarında sessiz kalmayı seçebilirsin.',
            friends: 'Arkadaş ortamında bazen havayı sen canlandırabilir, bazen geri planda kalabilirsin.',
            home: 'Misafir gelince bazı kişilerle uzun uzun konuşabilir, bazılarıyla az konuşabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde çok konuşabilir, bazılarında sessiz kalmayı seçebilir.',
            friends: 'Arkadaş ortamında bazen havayı o canlandırabilir, bazen geri planda kalabilir.',
            home: 'Misafir gelince bazı kişilerle uzun uzun konuşabilir, bazılarıyla az konuşabilir.',
          },
          adult: {
            work: 'Bir toplantıda bazen söz alıp konuşabilir, bazen dinlemeyi seçebilirsin.',
          },
        },
        high: {
          from: { school: ['m16', 'm06'], friends: ['m01', 'm11'], home: ['m06'], work: ['m16', 'm06'] },
          student: {
            school: 'Grup çalışmasında geri planda kalmak yerine çoğu zaman öne çıkıp konuşabilirsin.',
            friends: 'Arkadaş ortamında havayı canlandırabilir, pek çok farklı kişiyle sohbet edebilirsin.',
            home: 'Sofrada çok konuşabilir, bazen başkalarına söz bırakmayı unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında geri planda kalmak yerine çoğu zaman öne çıkıp konuşabilir.',
            friends: 'Arkadaş ortamında havayı canlandırabilir, pek çok farklı kişiyle sohbet edebilir.',
            home: 'Sofrada çok konuşabilir, bazen başkalarına söz bırakmayı unutabilir.',
          },
          adult: {
            work: 'Bir toplantıda geri planda kalmak yerine çoğu zaman söz alıp konuşabilirsin.',
          },
        },
      },
    },
    /*
     * Uyumluluk: m02 "Başkalarının duygularını anlar, onlara ortak olurum", m12 "Başkalarının ne hissettiğini içimde
     * hissederim"; ters: m07 "Başkalarının sorunları beni ilgilendirmez", m17 "Aslında diğer insanlara pek ilgi duymam".
     * Dört madde de başkalarının duygularına ve sorunlarına ilgiyi sorar; kırıcı söz ya da yardım etme gibi davranışlar
     * (öteki kişilik testlerindeki uyumluluk maddeleri) burada anılmaz.
     */
    agreeableness: {
      poles: { low: 'Kendi işine odaklanır', high: 'Duygulara ortak olur' },
      bands: {
        low: {
          from: { school: ['m17', 'm07'], friends: ['m07'], home: ['m12'], work: ['m17', 'm07'] },
          student: {
            school: 'Grup çalışmasında arkadaşlarının dertlerinden çok işin kendisiyle ilgilenebilirsin.',
            friends: 'Bir arkadaşın derdini uzun uzun anlatınca dinlemek sana zor gelebilir.',
            home: 'Evdekilerden biri üzgün olduğunda onun duygusuna kapılmadan kendi işini sürdürebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında arkadaşlarının dertlerinden çok işin kendisiyle ilgilenebilir.',
            friends: 'Bir arkadaşı derdini uzun uzun anlatınca dinlemek ona zor gelebilir.',
            home: 'Evdekilerden biri üzgün olduğunda onun duygusuna kapılmadan kendi işini sürdürebilir.',
          },
          adult: {
            work: 'Bir iş üzerinde çalışırken insanların dertlerinden çok işin kendisiyle ilgilenebilirsin.',
          },
        },
        average: {
          from: { school: ['m02', 'm07'], friends: ['m07', 'm17'], home: ['m12'], work: ['m02', 'm07'] },
          student: {
            school: 'Grup çalışmasında bazen arkadaşlarının duygularını gözetebilir, bazen yalnızca işe odaklanabilirsin.',
            friends: 'Bazı arkadaşlarının dertlerine yakından ilgi gösterebilir, bazılarına daha mesafeli kalabilirsin.',
            home: 'Evdekilerden birinin üzüntüsünü bazen içinde hissedebilir, bazen pek etkilenmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bazen arkadaşlarının duygularını gözetebilir, bazen yalnızca işe odaklanabilir.',
            friends: 'Bazı arkadaşlarının dertlerine yakından ilgi gösterebilir, bazılarına daha mesafeli kalabilir.',
            home: 'Evdekilerden birinin üzüntüsünü bazen içinde hissedebilir, bazen pek etkilenmeyebilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişilerin duygularını bazen gözetebilir, bazen yalnızca işe odaklanabilirsin.',
          },
        },
        high: {
          from: { school: ['m02'], friends: ['m07', 'm02'], home: ['m12'], work: ['m02'] },
          student: {
            school: 'Üzgün bir sınıf arkadaşının ne hissettiğini anlamaya çalışıp yanında olabilirsin.',
            friends: 'Bir arkadaşın derdini anlatınca onu dinlemeye zaman ayırabilirsin.',
            home: 'Evdekilerden birinin üzüntüsünü içinde hissedebilirsin; bu duygu seni de yorabilir.',
          },
          parent: {
            school: 'Çocuğunuz üzgün bir sınıf arkadaşının ne hissettiğini anlamaya çalışıp yanında olabilir.',
            friends: 'Bir arkadaşı derdini anlatınca onu dinlemeye zaman ayırabilir.',
            home: 'Evdekilerden birinin üzüntüsünü içinde hissedebilir; bu duygu onu da yorabilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın biri zor bir gün geçirince onun duygularına ortak olabilirsin.',
          },
        },
      },
    },
    /*
     * Sorumluluk: m03 "Yapmam gereken işleri hemen hallederim", m13 "Düzeni severim"; ters: m08 "Kullandığım şeyleri yerine
     * koymayı sık sık unuturum", m18 "İşleri birbirine karıştırırım".
     */
    conscientiousness: {
      poles: { low: 'Akışına göre ilerler', high: 'Düzenli, işini hemen yapar' },
      bands: {
        low: {
          from: { school: ['m03', 'm18'], friends: ['m13'], home: ['m08'], work: ['m03', 'm18'] },
          student: {
            school: 'Bir ödevi hemen yapmak yerine sonraya bırakabilirsin; sonra işler üst üste binebilir.',
            friends: 'Arkadaşlarınla buluştuğun yer biraz dağınık olsa da bu seni pek rahatsız etmeyebilir.',
            home: 'Kullandığın bir şeyi yerine koymayı unutabilir, sonra onu aramak zorunda kalabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevi hemen yapmak yerine sonraya bırakabilir; sonra işler üst üste binebilir.',
            friends: 'Arkadaşlarıyla buluştuğu yer biraz dağınık olsa da bu onu pek rahatsız etmeyebilir.',
            home: 'Kullandığı bir şeyi yerine koymayı unutabilir, sonra onu aramak zorunda kalabilir.',
          },
          adult: {
            work: 'Yapman gereken bir işi sonraya bırakabilirsin; sonra işler birbirine karışabilir.',
          },
        },
        average: {
          from: { school: ['m03'], friends: ['m13'], home: ['m08'], work: ['m03'] },
          student: {
            school: 'Bazı ödevleri hemen yapabilir, bazılarını sonraya bırakabilirsin.',
            friends: 'Arkadaşlarınla bir iş yaparken bazen düzeni sen kurabilir, bazen akışına bırakabilirsin.',
            home: 'Kullandığın şeyleri bazen hemen yerine koyabilir, bazen ortada bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevleri hemen yapabilir, bazılarını sonraya bırakabilir.',
            friends: 'Arkadaşlarıyla bir iş yaparken bazen düzeni o kurabilir, bazen akışına bırakabilir.',
            home: 'Kullandığı şeyleri bazen hemen yerine koyabilir, bazen ortada bırakabilir.',
          },
          adult: {
            work: 'Bazı işleri hemen halledebilir, bazılarını sonraya bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['m03'], friends: ['m13'], home: ['m08', 'm13'], work: ['m03', 'm18'] },
          student: {
            school: 'Bir ödev verilince onu çoğu zaman hemen halledebilirsin.',
            friends: 'Arkadaşlarınla bir iş yaparken düzen bozulunca canın sıkılabilir.',
            home: 'Kullandığın şeyleri çoğu zaman yerine koyup düzeni koruyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödev verilince onu çoğu zaman hemen halledebilir.',
            friends: 'Arkadaşlarıyla bir iş yaparken düzen bozulunca canı sıkılabilir.',
            home: 'Kullandığı şeyleri çoğu zaman yerine koyup düzeni koruyabilir.',
          },
          adult: {
            work: 'Yapman gereken işleri çoğu zaman hemen halledip birbirine karıştırmadan yürütebilirsin.',
          },
        },
      },
    },
    /*
     * Duygusal Denge (gelişim tonu): m09 "Çoğu zaman rahat ve sakinimdir", m19 "Kendimi nadiren hüzünlü hissederim"; ters:
     * m04 "Duygularım gün içinde sık sık iniş çıkış yapar", m14 "Küçük şeylere kolayca bozulurum". Yüksek ucun örnekleri
     * gerçekten rahat kalmayı anlatır (duyguyu saklamayı değil).
     */
    emotional_stability: {
      poles: { low: 'Duyguları çabuk değişir', high: 'Çoğu zaman rahat kalır' },
      bands: {
        low: {
          from: { school: ['m14'], friends: ['m14'], home: ['m04', 'm19'], work: ['m14'] },
          student: {
            school: 'Derste küçük bir aksilik olunca moralin çabuk bozulabilir; bunu sonra biriyle konuşmak iyi gelebilir.',
            friends: 'Bir arkadaşının küçük bir sözüne çabuk bozulabilirsin; sonra bunu ona söylemek seni rahatlatabilir.',
            home: 'Gün içinde duyguların inip çıkabilir; seni üzen şeyi güvendiğin biriyle konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Derste küçük bir aksilik olunca çocuğunuzun morali çabuk bozulabilir; bunu sonra biriyle konuşmak iyi gelebilir.',
            friends: 'Bir arkadaşının küçük bir sözüne çabuk bozulabilir; sonra bunu ona söylemek onu rahatlatabilir.',
            home: 'Gün içinde duyguları inip çıkabilir; onu üzen şeyi güvendiği biriyle konuşmak iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte küçük bir aksilik olunca moralin çabuk bozulabilir; bunu biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['m09', 'm14'], friends: ['m14'], home: ['m19', 'm09'], work: ['m09', 'm14'] },
          student: {
            school: 'Çoğu gün rahat olabilirsin; yine de bazen küçük bir aksilik canını sıkabilir.',
            friends: 'Bir arkadaşının şakasına bazen gülüp geçebilir, bazen bozulabilirsin.',
            home: 'Bazı günler hüzünlü hissedebilir, bazı günler rahat olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz çoğu gün rahat olabilir; yine de bazen küçük bir aksilik canını sıkabilir.',
            friends: 'Bir arkadaşının şakasına bazen gülüp geçebilir, bazen bozulabilir.',
            home: 'Bazı günler hüzünlü hissedebilir, bazı günler rahat olabilir.',
          },
          adult: {
            work: 'Çoğu iş gününde rahat olabilirsin; bazen küçük bir aksilik canını sıkabilir.',
          },
        },
        high: {
          from: { school: ['m09'], friends: ['m14'], home: ['m04', 'm19'], work: ['m09', 'm14'] },
          student: {
            school: 'Sınav haftasında da çoğu zaman rahat ve sakin kalabilirsin.',
            friends: 'Bir arkadaşının küçük bir sözüne çoğu zaman bozulmadan gülüp geçebilirsin.',
            home: 'Gün içinde duyguların pek inip çıkmayabilir; yine de seni üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınav haftasında da çoğu zaman rahat ve sakin kalabilir.',
            friends: 'Bir arkadaşının küçük bir sözüne çoğu zaman bozulmadan gülüp geçebilir.',
            home: 'Gün içinde duyguları pek inip çıkmayabilir; yine de onu üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          adult: {
            work: 'Yoğun bir iş gününde de çoğu zaman rahat ve sakin kalabilirsin.',
          },
        },
      },
    },
    /*
     * Merak ve Hayal Gücü: m05 "Canlı bir hayal gücüm vardır"; ters: m10 "Soyut fikirler ilgimi çekmez", m15 "Soyut
     * fikirleri anlamakta zorlanırım" (kullanılmadı), m20 "Hayal gücüm pek güçlü değildir". Soyut fikir örneği testin kendi
     * anlatımından: "adalet ya da sonsuzluk gibi elle tutulamayan kavramlar". Düşük ucun örnekleri ilgiyi anlatır.
     */
    intellect: {
      poles: { low: 'Somut konuları tercih eder', high: 'Hayal kurar, fikir sever' },
      bands: {
        low: {
          from: { school: ['m10'], friends: ['m10'], home: ['m05', 'm20'], work: ['m10'] },
          student: {
            school: 'Derste adalet ya da sonsuzluk gibi soyut konular açılınca ilgin azalabilir.',
            friends: 'Arkadaşlarınla soyut bir konuyu uzun uzun tartışmak yerine somut konuları konuşmayı seçebilirsin.',
            home: 'Hayal kurmak yerine çoğu zaman elindeki işe odaklanabilirsin.',
          },
          parent: {
            school: 'Derste adalet ya da sonsuzluk gibi soyut konular açılınca çocuğunuzun ilgisi azalabilir.',
            friends: 'Arkadaşlarıyla soyut bir konuyu uzun uzun tartışmak yerine somut konuları konuşmayı seçebilir.',
            home: 'Hayal kurmak yerine çoğu zaman elindeki işe odaklanabilir.',
          },
          adult: {
            work: 'Soyut bir konu konuşulunca ilgin azalabilir; somut konular sana daha çekici gelebilir.',
          },
        },
        average: {
          from: { school: ['m10'], friends: ['m05', 'm10'], home: ['m05', 'm20'], work: ['m10'] },
          student: {
            school: 'Derste bazı soyut konular ilgini çekebilir, bazıları çekmeyebilir.',
            friends: 'Arkadaşlarınla bazen hayal kurup fikirlerini paylaşabilir, bazen somut konuları konuşmayı seçebilirsin.',
            home: 'Bazen hayallere dalabilir, bazen elindeki işle ilgilenebilirsin.',
          },
          parent: {
            school: 'Derste bazı soyut konular çocuğunuzun ilgisini çekebilir, bazıları çekmeyebilir.',
            friends: 'Arkadaşlarıyla bazen hayal kurup fikirlerini paylaşabilir, bazen somut konuları konuşmayı seçebilir.',
            home: 'Bazen hayallere dalabilir, bazen elindeki işle ilgilenebilir.',
          },
          adult: {
            work: 'Bazı soyut konular ilgini çekebilir, bazılarında somut konulara dönmeyi seçebilirsin.',
          },
        },
        high: {
          from: { school: ['m10'], friends: ['m05', 'm10'], home: ['m05'], work: ['m10'] },
          student: {
            school: 'Derste adalet ya da sonsuzluk gibi soyut bir konu açılınca ilgin artabilir.',
            friends: 'Arkadaşlarınla konuşurken aklındaki hayalleri ve fikirleri anlatmak sana keyifli gelebilir.',
            home: 'Hayallere dalıp zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Derste adalet ya da sonsuzluk gibi soyut bir konu açılınca çocuğunuzun ilgisi artabilir.',
            friends: 'Arkadaşlarıyla konuşurken aklındaki hayalleri ve fikirleri anlatmak ona keyifli gelebilir.',
            home: 'Hayallere dalıp zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Bir işte soyut bir fikir konuşulunca ilgin artabilir.',
          },
        },
      },
    },
  },
};
