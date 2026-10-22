import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * Kişiliğin 10 Yönü: gelişim yol haritası metinleri. Yol haritası on yönle kurulur (boyutlar raporun önceki bölümündedir).
 *
 * İlkeler (Beş Faktör ve 16 Faktörlü Kişilik yol haritalarıyla aynı):
 *  - Etkili çalışma yöntemleri herkes için aynıdır (kendini sınamak, tekrarları günlere yaymak, karışık çalışmak, "neden?"
 *    diye sorup kendine açıklamak; Dunlosky ve ark., 2013). Yönler bu yöntemlerin hangi düzende ve hangi ortamda
 *    kullanılacağını seçmeye yardım eder; "kişiliğe uygun öğrenme yolu" gibi bir eşleştirme vaat edilmez.
 *  - On yön olduğu için "Nasıl çalışabilirsin?" kartları, ortamlar ve veliye yaklaşım önerileri yalnızca en belirgin beş
 *    yön için verilir (`focus`); üç boyutlu grafik on yönün hepsini gösterir. Her metin tek başına okunabilir ve aynı
 *    boyutun öteki yönünün metnini tekrar etmez (ör. Çalışkanlık işe koyulmayı ve bitirmeyi, Düzenlilik programı ve
 *    tekrar takvimini anlatır).
 *  - 2. hafta "Çalışma düzeni": Çalışkanlık yönünün denemesi (işe koyulmak ve kendini sınamak).
 *  - İç rahatlık düşükken 3. hafta iyi oluşa ayrılır ve öğrenciye ve veliye "Sınav kaygısı" yazısına bağlantı verilir
 *    (yetişkine verilmez); öneriler uyku, kısa molalar, güvenilen biriyle konuşmak ve önemli bir işten önce endişeleri
 *    yazmak gibi araştırmayla desteklenen yollardır (Ramirez ve Beilock, 2011). İç rahatlık düşük değil de Soğukkanlılık
 *    düşükse 3. hafta Soğukkanlılık'a ayrılır; öfke bir kaygı konusu olmadığı için bağlantı verilmez.
 *  - Düşünsel merak zekâyı ölçmez; metinler zekâ hakkında hüküm vermez, puanı yükseltme vaadi vermez.
 *  - Veliye yaklaşım önerileri rapordaki veli metinlerini ve aynı raporda yan yana okunan "Bu hafta dene" metinlerini
 *    tekrar etmez.
 *  - Renkler: her boyutun iki yönü o boyutun rengini paylaşır (sitedeki beş boyut renkleri, `--dim-*`); ikinci yön aynı
 *    rengin açık tonudur. Bir rengin iyi ya da kötü anlamı yoktur.
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir.
 *  - Yetişkin metni yalnızca öğrenci metni okula özgü olduğunda ya da kitaptan, dersten söz ettiğinde yazılır.
 */
const ramirez = bf.sources.find((s) => s.text.startsWith('Ramirez'))!;
const dunlosky = bf.sources.find((s) => s.text.startsWith('Dunlosky'))!;

export const kisiligin10YonuRoadmap: RoadmapTemplate = {
  version: 'kisiligin-10-yonu-yol-haritasi-1',
  planningScale: 'industriousness',
  wellbeing: [
    { scale: 'security', group: 'low' },
    { scale: 'composure', group: 'low', link: null },
  ],
  focus: {
    count: 5,
    note: {
      student: 'On yönünün hepsi raporun önceki bölümünde anlatıldı; burada en belirgin {n} yönün (puanı orta noktadan en çok uzaklaşanlar) için öneriler var.',
      parent: 'Çocuğunuzun on yönünün hepsi raporun önceki bölümünde anlatıldı; burada en belirgin {n} yönü (puanı orta noktadan en çok uzaklaşanlar) için öneriler var.',
    },
  },
  unit: { one: 'yön', toPlural: 'yönlere' },
  studyIntro: bf.studyIntro,
  settingsNote: bf.settingsNote,
  firstWeek: bf.firstWeek,
  lastWeek: bf.lastWeek,
  nextTests: bf.nextTests,
  approach: {
    enthusiasm: {
      low: 'Arkadaşlarının sayısını değil, ilişkilerinin yakınlığını önemseyin; az ama yakın arkadaşı varsa bunu bir sorun saymayın.',
      average: 'Hem kalabalık hem sakin etkinliklere yer açın; hangisinde daha rahat olduğunu ona sorun.',
      high: 'Neşesini ve sıcaklığını takdir edin; arkadaşlarıyla geçen zamanla dinlenme ve çalışma zamanını birlikte dengeleyin.',
    },
    assertiveness: {
      low: 'Başkalarının yanında onun yerine konuşmayın; fikrini söylediğinde, söylemiş olmasını değerli bulduğunuzu gösterin.',
      average: 'Fikrini söylediği anları fark ettiğinizi ona söyleyin.',
      high: 'Yönlendirme isteğini takdir edin; başkalarının fikirlerini dinlemenin de liderliğin bir parçası olduğunu kendi davranışınızla gösterin.',
    },
    compassion: {
      low: 'Birine yardım ettiği ya da birini düşündüğü küçük anları fark edip bunu ona söyleyin.',
      average: 'Ailede birinin ihtiyacı olduğunda ondan da küçük bir katkı isteyin.',
      high: 'Duyarlılığını takdir edin; gerektiğinde “hayır” diyebilmenin de olağan olduğunu ona söyleyin.',
    },
    politeness: {
      low: 'Evdeki anlaşmazlıklarda kırmadan ve sesinizi yükseltmeden konuşarak ona örnek olun; sınırları önceden birlikte konuşun.',
      average: 'Fikrini saygılı bir dille savunduğu anlarda bunu gördüğünüzü ona söyleyin.',
      high: 'Saygılı tavrını takdir edin; kendi isteğini açıkça söylemenin de saygısızlık olmadığını gösterin.',
    },
    industriousness: {
      low: 'Ertelediğinde onu tembellikle suçlamayın; işe başlamayı neyin zorlaştırdığını (konunun zorluğu, yorgunluk ya da dikkat dağıtıcılar gibi) birlikte bulmaya çalışın.',
      average: 'İşini bitirdiği günleri fark ettiğinizi söyleyin; o günlerde neyin işe yaradığını ona sorun.',
      high: 'Kararlılığını takdir edin; çok çalıştığı dönemlerde uyku ve dinlenmeye de zaman ayırmasını hatırlatın.',
    },
    orderliness: {
      low: 'Dağınıklığı kişiliğine bağlamayın: "Dağınıksın" demek yerine "Masa dağılmış" deyin.',
      average: 'Düzenli tuttuğu bir işi ya da eşyasını örnek gösterip bu düzeni başka bir işe nasıl taşıyabileceğini birlikte düşünün.',
      high: 'Planlar değiştiğinde bunu birlikte konuşun; değişikliğe uyum sağlamak da düzen kadar değerli bir beceridir.',
    },
    composure: {
      low: 'Kendi öfkenizi nasıl yatıştırdığınızı ona anlatın; örnek olmak çoğu zaman öğütten daha etkili olur.',
      average: 'Gerildiği dönemleri önceden konuşun ve bu dönemlerde ona biraz daha alan tanıyın.',
      high: 'Sakin görünse de zorlandığında size anlatabileceğini bilsin; arada bir nasıl hissettiğini sorun.',
    },
    security: {
      low: 'Bir hatasından sonra onu suçlamak yerine "Bundan ne öğrendin?" diye sorun; hatalar karşısındaki sakin tavrınız ona örnek olur.',
      average: 'Zorlandığı bir işi başardığında, sonucu değil gösterdiği çabayı ve kullandığı yolu takdir edin.',
      high: 'Kendine güvenini takdir edin; zorlanan arkadaşlarına nasıl destek olabileceğini onunla konuşabilirsiniz.',
    },
    intellect: {
      low: 'Onu başkalarıyla karşılaştırmayın; ilgisini çeken alanlarda sorduğu soruları ciddiye alın.',
      average: 'Bildiği bir konuyu size anlatmasını isteyin; sizin ondan bir şey öğrenmeniz kendine güvenini destekleyebilir.',
      high: 'Sorularını ciddiye alın; cevabını bilmediğinizde birlikte araştırın.',
    },
    aesthetics: {
      low: 'Sanata ilgi duyması için onu zorlamayın; sevdiği etkinliklerde ona eşlik edin.',
      average: 'Birlikte bir film izleyip ya da bir kitap okuyup üzerine konuşun.',
      high: 'Hayal kurmasını ve yaratıcı uğraşlarını destekleyin; dalgın görünmesini hemen ilgisizlik olarak yorumlamayın.',
    },
  },
  scales: {
    enthusiasm: {
      color: '#ee6a36',
      study: {
        high: {
          student:
            'İnsanlarla birlikte olmak seni canlandırıyor. Bunu etkili bir yöntemle birleştir: bir arkadaşınla kitapları kapatıp birbirinize sırayla soru sorun. Sohbete kaymamak için başta süreyi belirleyin; molada eğlenceye de yer açın.',
          parent:
            'Çocuğunuzu insanlarla birlikte olmak canlandırıyor olabilir. Bir arkadaşıyla kitapları kapatıp birbirlerine sırayla soru sormaları etkili bir yoldur; başta süreyi belirlemeleri sohbete kaymayı önler.',
          adult:
            'İnsanlarla birlikte olmak seni canlandırıyor. Bunu etkili bir yöntemle birleştir: öğrendiğin bir konuyu biriyle konuş ya da birbirinize kaynağa bakmadan soru sorun. Başta süreyi belirlemek sohbete kaymayı önler.',
        },
        average: {
          student:
            'Bazı konuları tek başına, bazılarını biriyle birlikte çalışmak sana iyi gelebilir. Yeni bir konuyu önce kendin çalış, sonra bir arkadaşına anlatarak ya da ona soru sorarak pekiştir.',
          parent:
            'Çocuğunuz bazı konuları tek başına, bazılarını biriyle birlikte çalışmaktan hoşlanabilir. Önce kendi başına çalışıp sonra size ya da bir arkadaşına anlatması öğrendiğini pekiştirir.',
          adult:
            'Bazı işleri tek başına, bazılarını biriyle birlikte yapmak sana iyi gelebilir. Yeni bir konuyu önce kendin çalış, sonra birine anlatarak pekiştir.',
        },
        low: {
          student:
            'Sessiz ve tek başına çalışmak sana daha rahat gelebilir. Bu düzende kendini sınamak için konuyu kapatıp aklında kalanları bir kâğıda yaz; sonra kitaba bakıp eksiklerini tamamla.',
          parent:
            'Çocuğunuz sessiz ve tek başına çalışmayı daha rahat bulabilir. Konuyu kapatıp aklında kalanları bir kâğıda yazması, sonra kitaba bakıp eksiklerini tamamlaması bu düzende etkili bir yoldur.',
          adult:
            'Sessiz ve tek başına çalışmak sana daha rahat gelebilir. Bu düzende kendini sınamak için kaynağı kapatıp aklında kalanları yaz; sonra kaynağa bakıp eksiklerini tamamla.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir arkadaşınla iki kısa çalışma buluşması ayarlayın (salı ve cuma gibi); ikincisinde, ilkinde çalıştığınız konuyu kitaba bakmadan birbirinize sorun.',
          parent: 'Bu hafta çocuğunuza bir arkadaşıyla iki kısa çalışma buluşması ayarlamasını önerin (salı ve cuma gibi); ikincisinde, ilkinde çalıştıkları konuyu kitaba bakmadan birbirlerine sorsunlar.',
          adult: 'Bu hafta biriyle iki kısa buluşma ayarlayın (salı ve cuma gibi); ikincisinde, ilkinde konuştuğunuz konuyu kaynağa bakmadan birbirinize sorun.',
        },
        average: {
          student: 'Bu hafta yeni öğrendiğin bir konuyu ertesi gün bir arkadaşına kitaba bakmadan anlat; takıldığın yerleri yeniden çalış.',
          parent: 'Bu hafta çocuğunuz yeni öğrendiği bir konuyu ertesi gün size ya da bir arkadaşına kitaba bakmadan anlatsın; takıldığı yerleri yeniden çalışsın.',
          adult: 'Bu hafta yeni öğrendiğin bir konuyu ertesi gün birine kaynağa bakmadan anlat; takıldığın yerleri yeniden çalış.',
        },
        low: {
          student: 'Bu hafta seni yormayan küçük bir sosyal adım seç: tanıdığın birine bir konuda fikrini sor ya da sevdiğin bir şeyi ona anlat.',
          parent: 'Bu hafta çocuğunuzu zorlamadan, tanıdığı biriyle sevdiği bir konuyu paylaşabileceği küçük bir fırsat yaratın.',
        },
      },
      settings: {
        high: 'İnsanlarla sık iletişim kurulan, sıcak ve canlı ortamlar',
        low: 'İlişkilerin zamanla kurulduğu, sakin ve küçük gruplu ortamlar',
      },
    },
    assertiveness: {
      color: '#ff8a5c',
      study: {
        high: {
          student:
            'Sorumluluk almak seni harekete geçiriyor. Bir çalışma grubunda düzeni sen kurabilirsin: konuları paylaştırın, herkes kendi konusunu ötekilere anlatsın ve sonunda kitaba bakmadan birbirinize soru sorun.',
          parent:
            'Çocuğunuzu sorumluluk almak harekete geçiriyor olabilir. Bir çalışma grubunda konuları paylaştırıp herkesin kendi konusunu ötekilere anlatması ve sonunda birbirlerine soru sormaları etkili bir düzendir.',
          adult:
            'Sorumluluk almak seni harekete geçiriyor. Öğrendiğini birine anlatmayı ya da küçük bir öğrenme grubunu yönlendirmeyi dene; anlatırken takıldığın yer, tekrar etmen gereken yerdir.',
        },
        average: {
          student:
            'Bazı işlerde öne çıkmak, bazılarında başkalarını izlemek sana uyabilir. Grupla çalışırken bir gün soruları sen hazırla, bir gün başkasınınkini cevapla.',
          parent:
            'Çocuğunuz bazı işlerde öne çıkmayı, bazılarında başkalarını izlemeyi tercih edebilir. Grupla çalışırken soru hazırlama ve cevaplama rollerini sırayla üstlenmesi iki yönünü de kullanır.',
        },
        low: {
          student:
            'Kendi hızında çalışmak sana rahat gelebilir. Derste anlamadığın bir yeri hemen soramıyorsan bir kenara not al; sonra öğretmenine ya da bir arkadaşına sor. Soru sormak öğrenmenin olağan bir parçasıdır.',
          parent:
            'Çocuğunuz kendi hızında çalışmayı rahat bulabilir. Anlamadığı yerleri not alıp sonra öğretmenine sorması, sorusunu sınıfta söylemekten daha kolay gelebilir.',
          adult:
            'Kendi hızında çalışmak sana rahat gelebilir. Anlamadığın bir yeri hemen soramıyorsan not al; sonra ilgili kişiye yazılı olarak sor. Soru sormak öğrenmenin olağan bir parçasıdır.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir grup işinde herkesin söz alabileceği bir düzen kur ve en son sen konuş.',
          parent: 'Bu hafta çocuğunuzdan bir grup işinde herkesin söz alabileceği bir düzen kurmasını ve en son kendisinin konuşmasını isteyin.',
        },
        average: {
          student: 'Bu hafta fikrini söylemekte tereddüt ettiğin bir anda, fikrini kısa bir cümleyle söyle.',
          parent: 'Bu hafta çocuğunuzu tereddüt ettiği bir konuda fikrini kısa bir cümleyle söylemeye cesaretlendirin.',
        },
        low: {
          student: 'Bu hafta küçük bir konuda (ne yeneceği ya da ne izleneceği gibi) ilk öneriyi sen yap.',
          parent: 'Bu hafta küçük bir konuda (akşam ne yeneceği ya da ne izleneceği gibi) ilk öneriyi çocuğunuzun yapmasını isteyin.',
        },
      },
      settings: {
        high: 'Sorumluluk alınabilen, karar verilen ve insanları bir araya getirmenin önemli olduğu ortamlar',
        low: 'Görevlerin açıkça paylaşıldığı, herkesin kendi işine odaklanabildiği ortamlar',
      },
    },
    compassion: {
      color: '#df4777',
      study: {
        high: {
          student:
            'Başkalarına yardım etmek seni motive ediyor olabilir. Bir arkadaşına konuyu anlatmak hem ona yardım eder hem senin öğrenmeni pekiştirir; anlatmadan önce konuyu kitaba bakmadan kendin hatırlamayı dene.',
          parent:
            'Çocuğunuzu başkalarına yardım etmek motive ediyor olabilir. Bir arkadaşına konu anlatması hem ona yardım eder hem kendi öğrenmesini pekiştirir.',
          adult:
            'Başkalarına yardım etmek seni motive ediyor olabilir. Öğrendiğini birine anlatmak hem ona yardım eder hem senin öğrenmeni pekiştirir; anlatmadan önce kaynağa bakmadan hatırlamayı dene.',
        },
        average: {
          student:
            'Başkalarına yardım etmekle kendi işlerini dengelemek sana uyabilir. Çalışma zamanını önceden ayırırsan, birine yardım ettiğinde kendi işin geride kalmaz.',
          parent:
            'Çocuğunuz başkalarına yardım etmekle kendi işlerini dengelemeyi seçebilir. Çalışma zamanını önceden ayırması, birine yardım ettiğinde kendi işinin geride kalmamasını sağlar.',
        },
        low: {
          student:
            'Kendi işine odaklanmayı seviyorsan bunu iyi kullan: çalışmaya başlamadan önce kendine bir hedef koy ("Bu konunun beş temel kavramını kitaba bakmadan açıklayabilmek" gibi). Sonunda kendini sınayarak hedefe ulaşıp ulaşmadığını kontrol et.',
          parent:
            'Çocuğunuz kendi işine odaklanmayı seviyor olabilir. Çalışmaya başlamadan önce kendine bir hedef koyması ("Bu konunun beş temel kavramını kitaba bakmadan açıklayabilmek" gibi) ve sonunda kendini sınaması bu odağı iyi kullanır.',
          adult:
            'Kendi işine odaklanmayı seviyorsan bunu iyi kullan: çalışmaya başlamadan önce kendine bir hedef koy ("Bu konunun beş temel kavramını kaynağa bakmadan açıklayabilmek" gibi). Sonunda kendini sınayarak hedefe ulaşıp ulaşmadığını kontrol et.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta birine yardım ederken işi onun için yapma; nasıl yapabileceğini ona göster.',
          parent: 'Bu hafta çocuğunuza, birine yardım ederken işi onun için yapmak yerine nasıl yapılacağını göstermesini önerin.',
        },
        average: {
          student: 'Bu hafta bir arkadaşına ya da bir aile üyene nasıl olduğunu sor ve cevabını dikkatle dinle.',
          parent: 'Bu hafta akşam yemeğinde herkesin gününden bir şey anlattığı kısa bir sohbet yapın; çocuğunuz da başkalarına nasıl olduklarını sorsun.',
        },
        low: {
          student: 'Bu hafta çevrendeki birinin ne hissettiğini tahmin etmeye çalış, sonra ona sorarak tahminini kontrol et.',
          parent: 'Bu hafta çocuğunuzla birlikte izlediğiniz bir filmde ya da yaşadığınız bir olayda ona "Sence o kişi ne hissetti?" diye sorun.',
        },
      },
      settings: {
        high: 'İnsanlarla ilgilenmenin, yardım etmenin ve birbirini dinlemenin önemli olduğu ortamlar',
        low: 'Kişisel hedeflerin ve bireysel çalışmanın ön planda olduğu ortamlar',
      },
    },
    politeness: {
      color: '#ff6b98',
      study: {
        high: {
          student:
            'Uyumlu bir ortamda daha rahat çalışıyor olabilirsin. Grup çalışmalarında fikrin farklıysa bunu saygılı bir dille söylemekten çekinme; farklı görüşleri tartışmak konuyu daha iyi anlamanı sağlayabilir.',
          parent:
            'Çocuğunuz uyumlu bir ortamda daha rahat çalışıyor olabilir. Grup çalışmalarında farklı fikrini saygılı bir dille söylemesi için onu cesaretlendirebilirsiniz; farklı görüşleri tartışmak konuyu daha iyi anlamasını sağlayabilir.',
        },
        average: {
          student:
            'Çoğu zaman uyumlusun, bazen de fikrini ısrarla savunuyorsun. Bir konuyu biriyle tartışırken önce onun görüşünü kendi cümlelerinle özetle, sonra kendi görüşünü söyle; bu hem öğrenmeyi hem ilişkiyi güçlendirir.',
          parent:
            'Çocuğunuz çoğu zaman uyumlu, bazen de fikrini ısrarla savunuyor olabilir. Bir konuyu tartışırken önce karşısındakinin görüşünü özetlemesi hem öğrenmeyi hem ilişkiyi güçlendirir.',
        },
        low: {
          student:
            'İsteklerini açıkça savunuyorsun. Biriyle birlikte çalışırken tartışma çıkarsa, kimin haklı olduğu yerine doğru cevabı kaynakta birlikte aramayı dene; tartışma böylece öğrenmeye dönüşür.',
          parent:
            'Çocuğunuz isteklerini açıkça savunuyor. Biriyle çalışırken tartışma çıkarsa, kimin haklı olduğu yerine doğru cevabı kaynakta birlikte aramaları tartışmayı öğrenmeye çevirir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta katılmadığın bir konuda fikrini kibarca ama açıkça söyle: "Ben farklı düşünüyorum, çünkü..." diye başla.',
          parent: 'Bu hafta çocuğunuzu, katılmadığı bir konuda fikrini kibarca ama açıkça söylemeye cesaretlendirin.',
        },
        average: {
          student: 'Bu hafta bir anlaşmazlıkta sesini yükseltmeden konuşmayı dene ve ikinizin de kabul edebileceği bir çözüm ara.',
          parent: 'Bu hafta evdeki bir anlaşmazlıkta çocuğunuzla birlikte, ikinizin de kabul edebileceği bir çözüm bulmayı deneyin.',
        },
        low: {
          student: 'Bu hafta tartışmak istediğin bir anda konuşmadan önce kendine "Bunu nasıl söylersem karşımdaki kırılmaz?" diye sor.',
          parent: 'Bu hafta çocuğunuz kırıcı olduğu bir anda onu eleştirmek yerine, sakinleştiğinde aynı şeyi nasıl söyleyebileceğini birlikte düşünün.',
        },
      },
      settings: {
        high: 'İş birliğinin, karşılıklı saygının ve uyumun önemli olduğu ortamlar',
        low: 'Fikirlerin açıkça tartışıldığı, görüşlerin savunulabildiği ortamlar',
      },
    },
    industriousness: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'İşe koyulmak ve bitirmek sana kolay geliyor; bu gücü etkili yöntemlerle birleştir. Çalıştığın konuyu yalnızca okumakla bırakma: bitirdiğinde kitabı kapatıp hatırladıklarını yaz ve tekrarları birkaç güne yay.',
          parent:
            'Çocuğunuza işe koyulmak ve bitirmek kolay geliyor. Okumakla yetinmeyip kitabı kapatarak hatırladıklarını yazması ve tekrarları birkaç güne yayması bu gücü daha verimli kılar.',
          adult:
            'İşe koyulmak ve bitirmek sana kolay geliyor; bu gücü etkili yöntemlerle birleştir. Öğrendiğini yalnızca okumakla bırakma: bitirdiğinde kaynağı kapatıp hatırladıklarını yaz ve tekrarları birkaç güne yay.',
        },
        average: {
          student:
            'Çoğu zaman işini bitiriyorsun. Zorlandığın günlerde işe başlamak için çalışmayı kısa parçalara böl: 25 dakika çalış, 5 dakika dinlen. Her parçanın sonunda kendine iki soru sor.',
          parent:
            'Çocuğunuz çoğu zaman işini bitiriyor. Zorlandığı günlerde çalışmayı kısa parçalara bölmesi (25 dakika çalışma, 5 dakika mola) işe başlamasını kolaylaştırabilir.',
        },
        low: {
          student:
            'İşe başlamak zor geliyorsa ilk adımı çok küçük tut: yalnızca kitabı açıp ilk soruyu çöz. Çalışırken telefonu göremeyeceğin bir yere koymayı dene. Çalışmayı kısa parçalara böl ve her parçadan sonra kendini sına.',
          parent:
            'Çocuğunuza işe başlamak zor geliyorsa ilk adımı çok küçük tutmasına yardım edin: yalnızca kitabı açıp ilk soruyu çözmek gibi. Çalışırken telefonunu göremeyeceği bir yere koymasını önerebilirsiniz.',
          adult:
            'İşe başlamak zor geliyorsa ilk adımı çok küçük tut: yalnızca dosyayı açıp ilk satırı yaz. Çalışırken telefonu göremeyeceğin bir yere koymayı dene. İşi kısa parçalara böl.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta her çalışmanın sonunda 5 dakika ayırıp kitaba bakmadan kendine soru sor; yanlış yaptıklarını ertesi gün yeniden dene.',
          parent: 'Bu hafta çocuğunuz her çalışmanın sonunda 5 dakika ayırıp kendine soru sorsun; yanlış yaptıklarını ertesi gün yeniden denesin.',
          adult: 'Bu hafta her çalışmanın sonunda 5 dakika ayırıp kaynağa bakmadan kendine soru sor; hatırlayamadıklarını ertesi gün yeniden dene.',
        },
        average: {
          student: 'Bu hafta her gün aynı saatte 25 dakikalık bir çalışmayla başla; ilk 5 dakikada yalnızca bir önceki gün öğrendiklerini hatırlamaya çalış.',
          parent: 'Bu hafta çocuğunuz her gün aynı saatte 25 dakikalık bir çalışmayla başlasın; ilk 5 dakikada bir önceki gün öğrendiklerini hatırlamaya çalışsın.',
        },
        low: {
          student: 'Bu hafta "Önce 5 dakika" kuralını dene: her gün bir işe 5 dakikalığına başla; 5 dakika sonra bırakmak serbest.',
          parent: 'Bu hafta çocuğunuzla "Önce 5 dakika" kuralını deneyin: bir işe 5 dakikalığına başlasın; sonra bırakmak serbest olsun.',
        },
      },
      settings: {
        high: 'Hedeflerin net olduğu ve emeğin sonucunun görüldüğü ortamlar',
        low: 'Kısa süreli, çeşitli işlerin olduğu ve hızlı geri bildirim alınan ortamlar',
      },
    },
    orderliness: {
      color: '#7597ff',
      study: {
        high: {
          student:
            'Düzenli bir program sana güven veriyor. Programına tekrar günleri ekle: bir konuyu çalıştıktan bir gün, bir hafta ve bir ay sonra kısa birer kendini sınama yap.',
          parent:
            'Çocuğunuza düzenli bir program güven veriyor olabilir. Programına tekrar günleri eklemesi (bir gün, bir hafta ve bir ay sonra kısa sınamalar) öğrendiklerinin kalıcı olmasına yardım eder.',
        },
        average: {
          student: 'Düzene belli ölçüde önem veriyorsun. Tek bir haftalık liste tutmak sana yetebilir: neyi ne zaman tekrar edeceğini oraya yaz.',
          parent: 'Çocuğunuz düzene belli ölçüde önem veriyor. Neyi ne zaman tekrar edeceğini yazdığı tek bir haftalık liste ona yetebilir.',
        },
        low: {
          student:
            'Sıkı bir program sana göre olmayabilir. Onun yerine esnek bir liste kullan: o gün çalışacağın iki üç konuyu yaz, sırasını sen seç; yeter ki her konunun sonunda kendini sına.',
          parent:
            'Sıkı bir program çocuğunuza uygun olmayabilir. O gün çalışacağı iki üç konuyu yazdığı esnek bir liste işini kolaylaştırabilir. Sırayı kendisi seçebilir; yeter ki her konunun sonunda kendini sınasın.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta programına bir "esnek saat" ekle: o saatte planda olmayan, merak ettiğin bir şeyi yap.',
          parent: 'Bu hafta çocuğunuzun programına, planda olmayan ve merak ettiği bir şeyi yapabileceği bir "esnek saat" ekleyin.',
        },
        average: {
          student: 'Bu hafta pazar akşamı 10 dakika ayırıp gelecek haftanın tekrar listesini çıkar.',
          parent: 'Bu hafta pazar akşamı çocuğunuzla 10 dakika ayırıp gelecek haftanın tekrar listesini çıkarın.',
        },
        low: {
          student: 'Bu hafta yalnızca tek bir alanı (çantan ya da masan gibi) düzene sok ve hafta boyunca öyle tut.',
          parent: 'Bu hafta çocuğunuzla yalnızca tek bir alanın (çantası ya da masası gibi) düzenli kalması üzerinde anlaşın.',
        },
      },
      settings: {
        high: 'Kuralların, adımların ve sorumlulukların açık olduğu, düzenli ortamlar',
        low: 'Esnek, değişken ve kişinin kendi düzenini kurabildiği ortamlar',
      },
    },
    composure: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Kolay kolay sinirlenmemen, zor bir soruda takıldığında da çalışmayı sürdürmeni kolaylaştırabilir. Bunu kullanmak için gerçek bir sınav gibi süre tut ve kitaba bakmadan soru çöz; takıldığın soruları işaretleyip sonra yeniden çalış.',
          parent:
            'Çocuğunuz kolay kolay sinirlenmediğini belirtiyor. Süre tutarak ve kitaba bakmadan soru çözmesi, takıldığı soruları işaretleyip sonra yeniden çalışması etkili bir yoldur.',
          adult:
            'Kolay kolay sinirlenmemen, zor bir yerde takıldığında da çalışmayı sürdürmeni kolaylaştırabilir. Bunu kullanmak için öğrendiğini süre tutarak ve kaynağa bakmadan sına; takıldığın yerleri işaretleyip sonra yeniden çalış.',
        },
        average: {
          student:
            'Çoğu zaman sakinsin; seni geren anlar için önceden küçük bir plan yap. Çalışırken sinirlendiğinde kısa bir mola ver ve dönünce önce daha kolay bir soruyla başla.',
          parent:
            'Çocuğunuz çoğunlukla sakin kalabiliyor. Çalışırken sinirlendiğinde kısa bir mola vermesi ve dönünce önce daha kolay bir soruyla başlaması işini kolaylaştırabilir.',
        },
        low: {
          student:
            'Çalışırken sinirin bozulduğunda kendini zorlamak yerine birkaç dakika ara ver, sonra kaldığın yerden değil bir önceki adımdan başla. Kısa çalışma bölümleri seni daha az yorabilir.',
          parent:
            'Çocuğunuz çalışırken sinirlendiğinde ona birkaç dakika ara vermesini önerin; döndüğünde bir önceki adımdan başlaması gerginliği azaltabilir. Kısa çalışma bölümleri onu daha az yorabilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta seni zorlayan bir işte sakin kalabildiğin bir anı fark et ve o an ne yaptığını not et.',
          parent: 'Bu hafta çocuğunuzun zor bir durumda sakin kaldığı bir anı fark edip bunu ona söyleyin.',
        },
        average: {
          student: 'Bu hafta seni geren üç durumu not et; her birinin yanına bir dahaki sefere ne yapabileceğini yaz.',
          parent: 'Bu hafta çocuğunuzla onu geren durumları ve bu durumlarda neyin işe yaradığını konuşun.',
        },
        low: {
          student: 'Bu hafta seni öfkelendiren durumları bir kâğıda yaz; hafta sonunda bakıp hangilerinde sakin kalmanın bir yolunu bulduğunu işaretle.',
          parent: 'Bu hafta onu sakinleştiren şeyleri (kısa bir yürüyüş, müzik ya da mola gibi) çocuğunuzla birlikte bir listeye yazın.',
        },
      },
      settings: {
        high: 'Gerginlik ve anlaşmazlık anlarında soğukkanlı kalmanın önemli olduğu ortamlar',
        low: 'Gerginliğin az olduğu, işlerin önceden planlandığı ve mola verilebilen ortamlar',
      },
    },
    security: {
      color: '#3ccab7',
      study: {
        high: {
          student:
            'Kendine güvenin yeni ve zor konulara başlamanı kolaylaştırabilir. Bu güveni denetlemenin iyi bir yolu kendini sınamaktır: "biliyorum" dediğin konuları kitaba bakmadan anlatmayı dene.',
          parent:
            'Çocuğunuzun kendine güveni yeni ve zor konulara başlamasını kolaylaştırabilir. "Biliyorum" dediği konuları kitaba bakmadan anlatmasını istemek, bu güvenin yerinde olup olmadığını görmesini sağlar.',
          adult:
            'Kendine güvenin yeni ve zor konulara başlamanı kolaylaştırabilir. "Biliyorum" dediğin konuları kaynağa bakmadan anlatmayı dene; güveninin yerinde olup olmadığını böyle görürsün.',
        },
        average: {
          student:
            'Bazı konular seni endişelendirebilir. Bu konuları çalışmayı erteleme; küçük parçalarla başla ve her parçadan sonra ne kadarını bildiğini kendini sınayarak gör. Bildiğini görmek endişeyi azaltabilir.',
          parent:
            'Çocuğunuzu bazı konular endişelendirebilir. Bu konulara küçük parçalarla başlaması ve her parçadan sonra kendini sınaması, bildiğini görmesini ve endişesinin azalmasını sağlayabilir.',
        },
        low: {
          student:
            'Endişe çalışmayı zorlaştırabilir. Önemli bir sınavdan önce seni kaygılandıran düşünceleri yaklaşık 10 dakika bir kâğıda yaz; sonra işi küçük adımlara böl. Hata yapmak öğrenmenin bir parçasıdır.',
          parent:
            'Çocuğunuzu endişe zorlayabilir. Önemli bir sınavdan önce kaygılarını yaklaşık 10 dakika yazması, araştırmalara göre performansını destekleyebilir. İşleri küçük adımlara bölmesine de yardım edin.',
          adult:
            'Endişe işini zorlaştırabilir. Önemli bir işten önce seni kaygılandıran düşünceleri yaklaşık 10 dakika bir kâğıda yaz; sonra işi küçük adımlara böl. Hata yapmak öğrenmenin bir parçasıdır.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta daha önce denemediğin zor bir işe başla; ilk denemede kusursuz olması gerekmiyor.',
          parent: 'Bu hafta çocuğunuzu ilk kez deneyeceği zor bir işe cesaretlendirin.',
        },
        average: {
          student: 'Bu hafta seni endişelendiren bir işi küçük parçalara böl ve ilk parçasını hemen yap.',
          parent: 'Bu hafta çocuğunuzla onu endişelendiren bir işi küçük parçalara bölüp ilk parçayı birlikte belirleyin.',
        },
        low: {
          student:
            'Gergin hissettiğinde yavaşça nefes al; nefes verişini, nefes alışından biraz daha uzun tut ve birkaç kez tekrarla. Bu hafta endişelerinden birini güvendiğin bir yetişkinle paylaş ve uykuna dikkat et.',
          parent:
            'Bu hafta çocuğunuzun uyku saatini birlikte koruyun ve yargılamadan onu neyin endişelendirdiğini konuşabileceğiniz sakin bir zaman ayırın.',
          adult:
            'Gergin hissettiğinde yavaşça nefes al; nefes verişini, nefes alışından biraz daha uzun tut ve birkaç kez tekrarla. Bu hafta endişelerinden birini güvendiğin biriyle paylaş ve uykuna dikkat et.',
        },
      },
      settings: {
        high: 'Yeni ve zorlu işlerin denendiği, cesaret gerektiren ortamlar',
        low: 'Beklentilerin açık olduğu, destek istenebilen ve geri bildirimin nazikçe verildiği ortamlar',
      },
    },
    intellect: {
      color: '#7a4ee6',
      study: {
        high: {
          student:
            'Zor sorunlarla uğraşmak sana keyif veriyor. Bunu öğrenmede kullan: bir konuyu çalışırken kendine "neden böyle?" ve "nasıl?" diye sor ve cevabı kitaba bakmadan açıkla. Konuları karışık sırayla çalışmak da seni zorlar ve öğrendiğini daha kalıcı kılabilir.',
          parent:
            'Çocuğunuza zor sorunlarla uğraşmak keyif veriyor. Çalışırken "neden böyle?" sorusunu sorup cevabını kendi cümleleriyle açıklaması ve konuları karışık sırayla çalışması bu merakı iyi kullanır.',
          adult:
            'Zor sorunlarla uğraşmak sana keyif veriyor. Bunu öğrenmede kullan: bir konuyu çalışırken kendine "neden böyle?" ve "nasıl?" diye sor ve cevabı kaynağa bakmadan açıkla. Konuları karışık sırayla çalışmak da seni zorlar ve öğrendiğini daha kalıcı kılabilir.',
        },
        average: {
          student:
            'Bazı konular seni daha çok meraklandırıyor. Seni az ilgilendiren konularda ilgini çeken bir bağlantı bul: o konu sevdiğin bir alanla nasıl ilişkili? Sonra öğrendiğini kendi cümlelerinle anlat.',
          parent:
            'Çocuğunuzu bazı konular daha çok meraklandırıyor. Az ilgilendiği konuları sevdiği bir alanla ilişkilendirmesi ve öğrendiğini kendi cümleleriyle anlatması işini kolaylaştırır.',
        },
        low: {
          student:
            'Soyut konular sana daha az çekici gelebilir. Bu konuları somut örneklerle çalış: her yeni kavram için günlük hayattan bir örnek bul ve kitaba bakmadan bir arkadaşına anlat.',
          parent:
            'Çocuğunuza soyut konular daha az çekici gelebilir. Her yeni kavram için günlük hayattan bir örnek bulması ve onu size anlatması konuyu somutlaştırır.',
          adult:
            'Soyut konular sana daha az çekici gelebilir. Bu konuları somut örneklerle çalış: her yeni kavram için günlük hayattan bir örnek bul ve onu birine anlat.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta seni zorlayan bir konuyu seç ve onu hiç bilmeyen birine 5 dakikada anlatmaya çalış.',
          parent: 'Bu hafta çocuğunuzdan merak ettiği zor bir konuyu size 5 dakikada anlatmasını isteyin.',
        },
        average: {
          student: 'Bu hafta merak ettiğin bir soruyu yaz ve hafta boyunca cevabını araştır.',
          parent: 'Bu hafta çocuğunuzla birlikte merak ettiğiniz bir soruyu seçip cevabını araştırın.',
        },
        low: {
          student: 'Bu hafta sevdiğin bir alanda (spor, oyun ya da müzik gibi) "Bu nasıl çalışıyor?" diye sorduğun bir şeyi seç ve cevabını araştır.',
          parent: 'Bu hafta çocuğunuzun sevdiği bir alanda "Bu nasıl çalışıyor?" sorusunu birlikte araştırın.',
        },
      },
      settings: {
        high: 'Karmaşık sorunların çözüldüğü, fikirlerin tartışıldığı ve sürekli yeni şeyler öğrenilen ortamlar',
        low: 'Bilginin hemen uygulandığı, adımları belli işlerin yapıldığı ortamlar',
      },
    },
    aesthetics: {
      color: '#a78bff',
      study: {
        high: {
          student:
            'Hayal gücün öğrenmeyi keyifli kılabilir: konuyu kitaba bakmadan bir şema olarak çiz, sonra kitapla karşılaştırıp eksiklerini tamamla. Düşüncelere dalıp gidiyorsan, kısa bölümlerle çalışmak odaklanmanı kolaylaştırabilir.',
          parent:
            'Çocuğunuzun hayal gücü öğrenmeyi keyifli kılabilir. Konuyu kitaba bakmadan bir şema olarak çizmesi, sonra kitapla karşılaştırıp eksiklerini tamamlaması etkili bir yoldur.',
          adult:
            'Hayal gücün öğrenmeyi keyifli kılabilir: konuyu kaynağa bakmadan bir şema olarak çiz, sonra kaynakla karşılaştırıp eksiklerini tamamla. Düşüncelere dalıp gidiyorsan, kısa bölümlerle çalışmak odaklanmanı kolaylaştırabilir.',
        },
        average: {
          student:
            'Bir konuyu çalıştıktan sonra kitaba bakmadan kendi cümlelerinle anlat ya da şemasını çiz; sonra kitapla karşılaştırıp eksiklerini tamamla.',
          parent:
            'Çocuğunuz bir konuyu çalıştıktan sonra kitaba bakmadan kendi cümleleriyle anlatabilir ya da şemasını çizebilir; sonra kitapla karşılaştırıp eksiklerini tamamlaması önemlidir.',
          adult:
            'Bir konuyu çalıştıktan sonra kaynağa bakmadan kendi cümlelerinle anlat ya da şemasını çiz; sonra kaynakla karşılaştırıp eksiklerini tamamla.',
        },
        low: {
          student:
            'Öğrendiğini kısa bir sınamayla kontrol et: konunun sonunda kitaba bakmadan beş soru cevapla ve yanlışlarını not al. Birkaç gün sonra aynı soruları yeniden dene.',
          parent:
            'Çocuğunuz öğrendiğini kısa bir sınamayla kontrol edebilir: konunun sonunda kitaba bakmadan beş soru cevaplayıp yanlışlarını not alması ve birkaç gün sonra aynı soruları yeniden denemesi etkili bir yoldur.',
          adult:
            'Öğrendiğini kısa bir sınamayla kontrol et: konunun sonunda kaynağa bakmadan beş soru cevapla ve hatırlayamadıklarını not al. Birkaç gün sonra aynı soruları yeniden dene.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta yaratıcılığını ortaya koyabileceğin küçük bir şey üret: bir çizim, kısa bir yazı ya da bir melodi.',
          parent: 'Bu hafta çocuğunuzun yaratıcılığını ortaya koyabileceği küçük bir uğraşa (çizim, yazı ya da müzik gibi) zaman ayırın.',
        },
        average: {
          student: 'Bu hafta daha önce denemediğin bir sanat ya da doğa etkinliğine (bir sergi, bir yürüyüş ya da bir konser gibi) katıl.',
          parent: 'Bu hafta çocuğunuzla daha önce denemediğiniz bir sanat ya da doğa etkinliğine katılın.',
        },
        low: {
          student: 'Bu hafta sevdiğin bir şarkıyı dikkatle dinle ya da bir filmi dikkatle izle ve sende uyandırdığı bir duyguyu tek cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla birlikte izlediğiniz bir filmde ona en çok neyi beğendiğini sorun.',
        },
      },
      settings: {
        high: 'Tasarımın, sanatın ve yaratıcı fikirlerin öne çıktığı ortamlar',
        low: 'Gerçekçi ve somut sonuçların önemli olduğu ortamlar',
      },
    },
  },
  sources: [dunlosky, ramirez],
};
