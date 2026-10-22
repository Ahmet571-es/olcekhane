import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * 16 Faktörlü Kişilik Profili: gelişim yol haritası metinleri.
 *
 * İlkeler (Beş Faktör yol haritasıyla ve bu testin rapor metinleriyle aynı):
 *  - Etkili çalışma yöntemleri herkes için aynıdır (kendini sınamak, tekrarları günlere yaymak, karışık çalışmak, "neden?"
 *    diye sorup kendine açıklamak; Dunlosky ve ark., 2013). Kişilik özellikleri bu yöntemlerin hangi düzende ve hangi
 *    ortamda kullanılacağını seçmeye yardım eder; "kişiliğe uygun öğrenme yolu" gibi bir eşleştirme vaat edilmez.
 *  - 16 özellik olduğu için "Nasıl çalışabilirsin?" kartları, ortamlar ve veliye yaklaşım önerileri yalnızca en belirgin
 *    altı özellik için verilir (`focus`); üç boyutlu grafik 16 özelliğin hepsini gösterir. Bu yüzden her metin tek
 *    başına okunabilir ve aynı raporda yan yana gelebilecek öteki özelliklerin metinlerini tekrar etmez (ör. insanlarla
 *    birlikte olmayı anlatan Sıcaklık, Atılganlık, Neşe ve canlılık, Sosyal rahatlık, Kendini kolay açmama ve Kendi
 *    başına olmayı sevme kartları ayrı yöntemler önerir).
 *  - 2. hafta "Çalışma düzeni": Düzen ve titizlik özelliğinin denemesi.
 *  - Duygusal denge düşük ya da Endişeye yatkınlık yüksekken (bu sırayla) 3. hafta iyi oluşa ayrılır ve öğrenciye ve
 *    veliye "Sınav kaygısı" yazısına bağlantı verilir (yetişkine verilmez); öneriler uyku, kısa molalar, güvenilen biriyle konuşmak ve sınavdan önce endişeleri
 *    yazmak gibi araştırmayla desteklenen yollardır (Ramirez ve Beilock, 2011).
 *  - Düşünsel özgüven zekâyı ölçmez; metinler zekâ hakkında hüküm vermez, puanı yükseltme vaadi vermez.
 *  - Bir uç güçlü yan ya da avantaj diye anlatılmaz ("Düzen ve titizlik senin güçlü yanın" yerine "sana kolay geliyor").
 *  - Ölçekler raporun her yerindeki gibi "özellik" diye anılır (`unit`; ör. dengeli profil cümlesi "hiçbir özellik belirgin
 *    biçimde öne çıkmıyor").
 *  - Veliye yaklaşım önerileri rapordaki veli metinlerini ve aynı raporda yan yana okunan "Bu hafta dene" metinlerini
 *    tekrar etmez.
 *  - Renkler 16 özelliği birbirinden ayırmak için seçildi (çember üzerinde yan yana gelen sütunlar belirgin biçimde farklı
 *    renktedir); bir rengin iyi ya da kötü anlamı yoktur.
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir. Düşünsel özgüven ve Duyarlılık için
 *    ortam yazılmaz: birincisi kendine bakıştır (ortam önerisi beceriye göre yönlendirme gibi okunur), ikincisinin
 *    maddeleri sanat ve edebiyat zevkini sorar, ortam tercihini değil.
 *  - Öneri kartları seçilirken önce orta düzeyde olmayan özellikler gelir (eşiğe eşit uzaklıktaki bir orta puan, yüksek ya
 *    da düşük bir puanın önüne geçmez); hiçbir özellik uçta değilse kartlar puanı ortadan en uzak altı özelliğe verilir.
 *  - Yetişkin metni yalnızca öğrenci metni okula özgü olduğunda yazılır.
 */
const ramirez = bf.sources.find((s) => s.text.startsWith('Ramirez'))!;

export const onAltiFaktorKisilikRoadmap: RoadmapTemplate = {
  version: '16-faktorlu-kisilik-yol-haritasi-1',
  planningScale: 'orderliness',
  wellbeing: [
    { scale: 'emotional_stability', group: 'low' },
    { scale: 'anxiety', group: 'high' },
  ],
  focus: {
    count: 6,
    note: {
      student:
        'Aşağıda en belirgin {n} özelliğin (puanı orta noktadan en çok uzaklaşanlar) için öneriler var; öteki özelliklerin raporun önceki bölümünde anlatıldı.',
      parent:
        'Aşağıda çocuğunuzun en belirgin {n} özelliği (puanı orta noktadan en çok uzaklaşanlar) için öneriler var; öteki özellikleri raporun önceki bölümünde anlatıldı.',
    },
  },
  unit: { one: 'özellik', toPlural: 'özelliklere' },
  studyIntro: bf.studyIntro,
  settingsNote: bf.settingsNote,
  firstWeek: bf.firstWeek,
  lastWeek: bf.lastWeek,
  nextTests: bf.nextTests,
  approach: {
    warmth: {
      low: 'Öğüt vermek yerine, bir yakınınızı ziyaret ederken ya da birine yardım ederken onu da yanınıza alın.',
      average: 'Başkalarına ilgi gösterdiği anları fark ettiğinizi kısaca ona söyleyin.',
      high: 'Sıcaklığını takdir edin; başkalarına yardım ederken kendi ihtiyaçlarını da gözetmesini hatırlatın.',
    },
    intellect: {
      low: 'Onu başkalarıyla karşılaştırmayın; sonucu değil çabasını ve kullandığı yolu övün ("Bunu parçalara bölerek çözdün" gibi).',
      average: 'Bildiği bir konuyu size anlatmasını isteyin; sizin bilmediğiniz bir şeyi ondan öğrenmek kendine güvenini destekler.',
      high: 'Sorularını ve fikirlerini ciddiye alın; yanıldığı durumları da öğrenmenin olağan bir parçası olarak konuşun.',
    },
    emotional_stability: {
      low: 'Duygularını küçümsemeden dinleyin; hemen çözüm önermek yerine önce ne hissettiğini anlatmasına fırsat verin.',
      average: 'Yoğun dönemlerde ona dinlenmek için de zaman bırakın; zorlandığında konuşmaya hazır olduğunuzu hissettirin.',
      high: 'Sakinliğini takdir edin; zor bir dönemden geçen bir arkadaşına nasıl destek olabileceğini birlikte konuşabilirsiniz.',
    },
    assertiveness: {
      low: 'Fikrini sorduğunuzda cevap vermesi için ona zaman tanıyın; söylediğini hemen düzeltmek yerine önce sonuna kadar dinleyin.',
      average: 'Fikrini söylediği anlarda onu dinleyin; söz başkasındayken beklemesini de takdir edin.',
      high: 'Fikirlerini ciddiye alın; tartışmalarda karşısındakini sonuna kadar dinlemenin de bir güç olduğunu kendi davranışınızla gösterin.',
    },
    gregariousness: {
      low: 'Sevdiği sakin etkinlikleri (bir yürüyüş, bir film ya da bir kutu oyunu gibi) birlikte yapmak için zaman ayırın.',
      average: 'Hem hareketli hem sakin etkinliklere yer açan bir hafta düzeni ona iyi gelebilir.',
      high: 'Neşesini takdir edin; odaklanması gereken zamanlarla eğlence zamanlarını onunla birlikte ayırın.',
    },
    dutifulness: {
      low: 'Bir kurala uymadığında önce nedenini dinleyin; sonuçları önceden birlikte konuşup belirlemek tartışmayı azaltır.',
      average: 'Kuralları sorguladığında bunu saygılı bir dille yapmasını destekleyin; gerekçeli itirazını dinleyin.',
      high: 'Kurallara uymadaki güvenilirliğini fark ettiğinizi söyleyin; bir kural işe yaramadığında bunu konuşmanın da olağan olduğunu gösterin.',
    },
    friendliness: {
      low: 'Yeni bir ortama girmeden önce (bir kursun ilk günü gibi) neyle karşılaşacağını birlikte konuşmak, çekingenliğini hafifletebilir.',
      average: 'Hem tanıdık hem yeni ortamlarda bulunabileceği fırsatlar yaratın; yeni ortamlara alışması için ona zaman tanıyın.',
      high: 'Sosyal rahatlığını takdir edin; arkadaşlarıyla geçirdiği zamanla dinlenme zamanı arasında denge kurmasına yardım edin.',
    },
    sensitivity: {
      low: 'Sanata ve edebiyata ilgi duyması için onu zorlamayın; sevdiği etkinliklerde (bir tamir, bir spor ya da bir deney gibi) ona eşlik edin.',
      average: 'Birlikte bir film izleyip ya da bir kitap okuyup üzerine konuşmak ilgisini besleyebilir.',
      high: 'Okuduklarını ve izlediklerini sizinle paylaştığında ilgiyle dinleyin; duygusal tepkilerini olağan karşılayın.',
    },
    distrust: {
      low: 'Güvenini takdir edin; birinin davranışı içine sinmediğinde bunu size rahatça anlatabileceğini bilsin.',
      average: 'Bir arkadaşlık sorununu anlattığında hemen taraf tutmadan, olayın farklı yanlarını birlikte düşünün.',
      high: 'Kuşkularını küçümsemeyin; "Başka nasıl açıklanabilir?" sorusuyla olaylara farklı açılardan bakmasına yardım edin.',
    },
    imagination: {
      low: 'Gerçekçi ve ayakları yere basan bakışını takdir edin; adımları belli işlerde ona sorumluluk verin.',
      average: 'Hem hayal kurmasına hem de planlı işlere yer açın; ikisinin de değerli olduğunu gösterin.',
      high: 'Farklı fikirlerini ilgiyle dinleyin; dalgın görünmesini hemen ilgisizlik olarak yorumlamayın.',
    },
    reserve: {
      low: 'Paylaştıklarını ilgiyle dinleyin; anlattıklarını başkalarına aktarmadan önce ondan izin alın.',
      average: 'Hangi konuları size, hangilerini arkadaşlarına anlattığını doğal karşılayın; sizinle konuştuğunda sözünü kesmeden dinleyin.',
      high: 'Soru yağmuruna tutmak yerine, yolculukta ya da birlikte yemek hazırlarken olduğu gibi yan yana olduğunuz rahat anlarda sohbete fırsat verin.',
    },
    anxiety: {
      low: 'Rahatlığını takdir edin; önemli işlerde nasıl hazırlandığını sorup ilgi gösterin.',
      average: 'Yoğun dönemlerde plan yapmasına yardım edin; neyin ne zaman yapılacağını bilmek endişesini azaltabilir.',
      high: 'Hatalarını büyütmeden konuşun; bir yanlışın ardından "Bundan ne öğrendin?" diye sormak, hata yapma korkusunu hafifletebilir.',
    },
    complexity: {
      low: 'Alışkın olduğu yöntemlere saygı gösterin; yeni bir şeyi küçük ve somut adımlarla denemesine fırsat verin.',
      average: 'Yeni bir yeri, yemeği ya da etkinliği birlikte denemek için arada bir fırsat yaratın.',
      high: 'Felsefi ve "neden" sorularını ciddiye alın; cevabını bilmediğinizde birlikte araştırın.',
    },
    introversion: {
      low: 'Arkadaşlarıyla birlikte olma ihtiyacını anlayışla karşılayın; tek başına yapması gereken işlerde kısa hedefler koymasına yardım edin.',
      average: 'Bazen yalnız kalmak, bazen arkadaşlarıyla olmak istemesini olağan karşılayın.',
      high: 'Yalnız geçirdiği zamanı kısıtlamadan, haftada bir iki kez birlikte yapacağınız ve onun sevdiği bir etkinlik belirleyin.',
    },
    orderliness: {
      low: 'Dağınıklığı her gün eleştirmek yerine, tek bir alanda (çalışma masası gibi) küçük bir düzen kuralı üzerinde anlaşın.',
      average: 'Düzenli olduğu işleri fark ettiğinizi söyleyin; bu düzeni öteki işlere nasıl taşıyabileceğini birlikte düşünün.',
      high: 'Özenini takdir edin; bir işi "yeterince iyi" olduğunda bırakmanın da bir beceri olduğunu hatırlatın.',
    },
    emotionality: {
      low: 'Hoşgörüsünü takdir edin; onu rahatsız eden şeyleri de size söyleyebileceğini hissettirin.',
      average: 'Sabrının zorlandığı anlarda ona kısa bir mola vermeyi önerin; sakinleştiğinde konuya birlikte dönün.',
      high: 'Başkalarını yargıladığında hemen karşı çıkmak yerine "Sence o neden öyle yaptı?" diye sorun.',
    },
  },
  scales: {
    warmth: {
      color: '#f07aa0',
      study: {
        high: {
          student:
            'İnsanlarla ilgilenmek ve onlara yardım etmek sana iyi geliyor. Bunu etkili bir yöntemle birleştirebilirsin: bir arkadaşına yardım ederken hazır cevap vermek yerine ipucu ver ve onun kitaba bakmadan hatırlamasına fırsat tanı; ertesi gün aynı soruları birbirinize yeniden sorun. Yardım ederken kendi çalışma planını ertelememeye dikkat et.',
          parent:
            'Çocuğunuz insanlarla ilgilenmekten ve onlara yardım etmekten hoşlanıyor olabilir. Bir arkadaşına yardım ederken hazır cevap vermek yerine ipucu vermesi ve ertesi gün aynı soruları birbirlerine yeniden sormaları, ikisinin de öğrendiğini pekiştirir. Başkalarına yardım ederken kendi çalışma planını ertelememesine destek olun.',
          adult:
            'İnsanlarla ilgilenmek ve onlara yardım etmek sana iyi geliyor. Bunu etkili bir yöntemle birleştirebilirsin: birine yardım ederken hazır cevap vermek yerine ipucu ver ve onun kaynağa bakmadan hatırlamasına fırsat tanı; ertesi gün aynı soruları birbirinize yeniden sorun. Yardım ederken kendi planını ertelememeye dikkat et.',
        },
        average: {
          student:
            'Başkalarıyla ilgilenmekle kendi işine odaklanmak arasında denge kurabiliyorsun. Bir arkadaşınla çalışırken önce herkesin soruları tek başına çözmesi, sonra çözümleri karşılaştırması hem yardımlaşmayı hem de kendini sınamayı sağlar.',
          parent:
            'Çocuğunuz başkalarıyla ilgilenmekle kendi işine odaklanmak arasında denge kurabiliyor olabilir. Bir arkadaşıyla çalışırken önce soruları tek başlarına çözmeleri, sonra çözümleri karşılaştırmaları hem yardımlaşmayı hem de kendini sınamayı sağlar.',
        },
        low: {
          student:
            'Kendi işine odaklanmak sana kolay geliyor. Bu odağı en etkili yöntemle birleştir: çalışmanın sonunda kitabı kapat, hatırladıklarını yaz ve sonra kitapla karşılaştır. Takıldığın bir konuda birine danışmak da işini hızlandırır; yardım istemek bir zayıflık değildir.',
          parent:
            'Çocuğunuz kendi işine odaklanmayı kolay buluyor olabilir. Çalışmanın sonunda kitabı kapatıp hatırladıklarını yazması ve sonra kitapla karşılaştırması bu odağı en etkili yöntemle birleştirir. Takıldığı bir konuda birine danışmanın işini kolaylaştırdığını hatırlatabilirsiniz.',
          adult:
            'Kendi işine odaklanmak sana kolay geliyor. Bu odağı en etkili yöntemle birleştir: çalışmanın sonunda kaynağı kapat, hatırladıklarını yaz ve sonra karşılaştır. Takıldığın bir konuda birine danışmak da işini hızlandırır; yardım istemek bir zayıflık değildir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta önce kendi planındaki işi bitir, sonra zorlandığı bir konuda bir arkadaşına 10 dakika yardım et.',
          parent: 'Bu hafta çocuğunuzun bir arkadaşına ya da kardeşine bir konuyu anlatmasına fırsat verin; önce kendi işini bitirmesini önerin.',
        },
        average: {
          student: 'Bu hafta bir arkadaşınla aynı beş soruyu önce ayrı ayrı çözün, sonra çözümlerinizi karşılaştırın.',
          parent: 'Bu hafta çocuğunuzun bir arkadaşıyla aynı soruları önce ayrı ayrı çözüp sonra karşılaştırmasını önerin.',
        },
        low: {
          student: 'Bu hafta takıldığın bir konuda birine en az bir soru sor ve aldığın cevabı kendi cümlelerinle not al.',
          parent: 'Bu hafta çocuğunuzun takıldığı bir konuda birine danışmasını önerin; danıştığında bunu takdir edin.',
        },
      },
      settings: {
        high: 'İnsanlara yardım etmenin, bakımın ve desteğin öne çıktığı ortamlar',
        low: 'İşin kendisine odaklanılan, nesnel ölçütlerle çalışılan ortamlar',
      },
    },
    intellect: {
      color: '#911eb4',
      study: {
        high: {
          student:
            'Düşünme becerine güveniyorsun ve zor konulardan çekinmiyorsun. Bu güveni kendini sınayarak destekle: bir konuyu anladığını düşündüğünde kitabı kapatıp onu kendi cümlelerinle açıklamaya çalış. "Anladım" duygusu bazen yanıltıcıdır; açıklayamadığın yer, tekrar etmen gereken yerdir.',
          parent:
            'Çocuğunuz düşünme becerisine güveniyor ve zor konulardan çekinmiyor olabilir. Bir konuyu anladığını düşündüğünde kitabı kapatıp onu kendi cümleleriyle açıklamasını önerin: "Anladım" duygusu bazen yanıltıcıdır, açıklayamadığı yer tekrar etmesi gereken yerdir.',
          adult:
            'Düşünme becerine güveniyorsun ve zor konulardan çekinmiyorsun. Bu güveni kendini sınayarak destekle: bir konuyu anladığını düşündüğünde kaynağı kapatıp onu kendi cümlelerinle açıklamaya çalış. "Anladım" duygusu bazen yanıltıcıdır; açıklayamadığın yer, tekrar etmen gereken yerdir.',
        },
        average: {
          student:
            'Bazı konularda kendine güveniyor, bazılarında zorlanıyorsun. Zorlandığın konularda "Bu neden böyle?" diye sorup cevabını kendine açıklamak ve konuyu birkaç güne yayarak tekrar etmek, anlamanı derinleştirir.',
          parent:
            'Çocuğunuz bazı konularda kendine güveniyor, bazılarında zorlanıyor olabilir. Zorlandığı konularda "Bu neden böyle?" diye sorup cevabı kendine açıklaması ve konuyu birkaç güne yayarak tekrar etmesi, anlamasını derinleştirir.',
        },
        low: {
          student:
            'Kafanın karıştığı konular olabilir; bu herkesin yaşadığı bir şeydir ve zekân hakkında bir hüküm değildir. Zor bir konuyu küçük parçalara böl, her parçadan sonra kitaba bakmadan bir iki cümleyle anlat ve takıldığın parçaya ertesi gün yeniden dön. Küçük ilerlemelerini not etmek, ne kadar yol aldığını görmeni sağlar.',
          parent:
            'Çocuğunuzun kafasının karıştığı konular olabilir; bu herkesin yaşadığı bir şeydir ve zekâsı hakkında bir hüküm değildir. Zor bir konuyu küçük parçalara bölmesine, her parçadan sonra kitaba bakmadan bir iki cümleyle anlatmasına ve takıldığı parçaya ertesi gün yeniden dönmesine destek olabilirsiniz.',
          adult:
            'Kafanın karıştığı konular olabilir; bu herkesin yaşadığı bir şeydir ve zekân hakkında bir hüküm değildir. Zor bir konuyu küçük parçalara böl, her parçadan sonra kaynağa bakmadan bir iki cümleyle anlat ve takıldığın parçaya ertesi gün yeniden dön. Küçük ilerlemelerini not etmek, ne kadar yol aldığını görmeni sağlar.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta anladığını düşündüğün bir konuyu kitabı kapatıp bir kâğıda anlat; sonra kitapla karşılaştırıp eksik kalan yerleri işaretle.',
          parent: 'Bu hafta çocuğunuzdan anladığını düşündüğü bir konuyu size kitaba bakmadan anlatmasını isteyin; eksik kalan yerleri birlikte not alın.',
          adult: 'Bu hafta anladığını düşündüğün bir konuyu kaynağı kapatıp bir kâğıda anlat; sonra karşılaştırıp eksik kalan yerleri işaretle.',
        },
        average: {
          student: 'Bu hafta zorlandığın bir konu seç ve onunla ilgili üç "neden?" sorusunun cevabını kendi cümlelerinle yaz.',
          parent: 'Bu hafta çocuğunuzla zorlandığı bir konu hakkında "Bu neden böyle?" diye birlikte düşünün; cevabı ona anlattırın.',
        },
        low: {
          student: 'Bu hafta zorlandığın bir konuyu üç küçük parçaya böl; her gün bir parçayı çalış ve sonunda kitaba bakmadan bir cümleyle anlat.',
          parent: 'Bu hafta çocuğunuzun zorlandığı bir konuyu üç küçük parçaya bölmesine yardım edin; her parçayı bitirdiğinde bunu fark ettiğinizi söyleyin.',
          adult: 'Bu hafta zorlandığın bir konuyu üç küçük parçaya böl; her gün bir parçayı çalış ve sonunda kaynağa bakmadan bir cümleyle anlat.',
        },
      },
    },
    emotional_stability: {
      color: '#469990',
      study: {
        high: {
          student:
            'Zor anlarda sakin kalabiliyorsun. Bu sakinliği zor konuların üstüne gitmek için kullan: en çok zorlandığın konuyu günün en dinç saatinde çalış ve sonunda kendini birkaç soruyla sına. Yanlışlarını sakin bir gözle incelemek, neyi tekrar edeceğini gösterir.',
          parent:
            'Çocuğunuz zor anlarda sakin kalabiliyor olabilir. Bu sakinliği zor konuların üstüne gitmek için kullanabilir: en çok zorlandığı konuyu günün en dinç saatinde çalışıp sonunda kendini birkaç soruyla sınaması işine yarar.',
        },
        average: {
          student:
            'Bazı dönemler seni ötekilerden daha çok zorlayabilir. Yoğun dönemlerde çalışmayı küçük ve düzenli parçalara bölmek son güne yığılmayı önler ve stresi azaltır; dinlenmeyi de planına yazmayı unutma.',
          parent:
            'Bazı dönemler çocuğunuzu ötekilerden daha çok zorlayabilir. Yoğun dönemlerde çalışmayı küçük ve düzenli parçalara bölmesi son güne yığılmayı önler ve stresi azaltır; dinlenmeyi de planına yazmasına destek olun.',
        },
        low: {
          student:
            'Duyguların sık iniş çıkış yaptığında çalışmak zorlaşabilir. Önce kendine iyi bak: düzenli uyku, hareket ve kısa molalar öğrenmeyi de destekler. Çalışmayı küçük parçalara böl ve her parçanın sonunda kendini kısa sorularla sına; küçük başarılar görmek iyi gelir. Seni üzen şeyleri güvendiğin bir yetişkinle konuşmak yükünü hafifletir.',
          parent:
            'Çocuğunuzun duyguları sık iniş çıkış yapıyorsa çalışmak onun için zorlaşabilir. Düzenli uyku, hareket ve kısa molalar öğrenmeyi de destekler. Çalışmayı küçük parçalara bölmesi ve her parçada küçük bir başarı görmesi ona iyi gelebilir; zorlandığında sonuç yerine emeğini konuşun.',
          adult:
            'Duyguların sık iniş çıkış yaptığında çalışmak zorlaşabilir. Önce kendine iyi bak: düzenli uyku, hareket ve kısa molalar öğrenmeyi de destekler. Çalışmayı küçük parçalara böl ve her parçanın sonunda kendini kısa sorularla sına; küçük başarılar görmek iyi gelir. Seni üzen şeyleri güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak yükünü hafifletir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta en çok zorlandığın konuyu günün en dinç saatine koy; çalışmanın sonunda kendini beş soruyla sına.',
          parent: 'Bu hafta çocuğunuzla en çok zorlandığı konuyu günün hangi saatinde çalışabileceğini birlikte belirleyin.',
        },
        average: {
          student: 'Bu hafta seni en çok zorlayan işi üç güne böl; her gün yalnızca o günün parçasını bitir ve bir akşamı tamamen dinlenmeye ayır.',
          parent: 'Bu hafta çocuğunuzla onu en çok zorlayan işi üç güne bölün; her günün parçası bitince bunu fark ettiğinizi söyleyin.',
        },
        low: {
          student:
            'Bu hafta her akşam seni zorlayan bir şeyi ve iyi giden bir şeyi birer cümleyle yaz. Uyku saatini her gün aynı tutmaya çalış; kendini çok kötü hissettiğinde bunu tek başına taşıma, güvendiğin bir yetişkinle konuş.',
          parent:
            'Bu hafta çocuğunuzla her gün kısa ve sakin bir sohbet zamanı ayırın; gününün nasıl geçtiğini yargılamadan dinleyin. Uyku saatinin düzenli olmasına birlikte dikkat edin.',
          adult:
            'Bu hafta her akşam seni zorlayan bir şeyi ve iyi giden bir şeyi birer cümleyle yaz. Uyku saatini her gün aynı tutmaya çalış; kendini çok kötü hissettiğinde bunu tek başına taşıma, güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuş.',
        },
      },
      settings: {
        high: 'Zorlu ve stresli durumlarda soğukkanlılığın önemli olduğu ortamlar',
        low: 'Temponun dengeli olduğu, desteğin kolay bulunduğu ortamlar',
      },
    },
    assertiveness: {
      color: '#e6194b',
      study: {
        high: {
          student:
            'Sözünü söylemekten ve yön vermekten çekinmiyorsun. Grup çalışmalarında bu enerjiyi işe yarar biçimde kullan: çalışmanın başında hedefi ve süreyi sen öner, sonunda herkesten öğrendiğini kitaba bakmadan bir iki cümleyle özetlemesini iste. Kendi fikrini savunurken "Bunun kanıtı ne?" sorusunu kendine de sormak, düşünceni sağlamlaştırır.',
          parent:
            'Çocuğunuz sözünü söylemekten ve yön vermekten çekinmiyor olabilir. Grup çalışmalarında hedefi ve süreyi önermesi, sonunda herkesten öğrendiğini kitaba bakmadan özetlemesini istemesi bu enerjiyi işe yarar biçimde kullanmasını sağlar. Kendi fikrini savunurken "Bunun kanıtı ne?" diye kendine de sormasını önerebilirsiniz.',
          adult:
            'Sözünü söylemekten ve yön vermekten çekinmiyorsun. Birlikte öğrenirken bu enerjiyi işe yarar biçimde kullan: toplantının başında hedefi ve süreyi sen öner, sonunda herkesten öğrendiğini kaynağa bakmadan bir iki cümleyle özetlemesini iste. Kendi fikrini savunurken "Bunun kanıtı ne?" sorusunu kendine de sormak, düşünceni sağlamlaştırır.',
        },
        average: {
          student:
            'Bazen öne çıkıyor, bazen geri durmayı seçiyorsun. Çalışma planını kendin yapıp hafta sonunda neyin işe yaradığına bakmak, hem kendi kararlarına güvenmeni hem de hangi yöntemlerin sana uyduğunu görmeni sağlar.',
          parent:
            'Çocuğunuz bazen öne çıkıyor, bazen geri durmayı seçiyor. Çalışma planını kendisinin yapması ve hafta sonunda neyin işe yaradığına bakması, kararlarına güvenmesini ve hangi yöntemlerin ona uyduğunu görmesini sağlar.',
        },
        low: {
          student:
            'Kararları başkalarına bırakmak sana daha kolay gelebilir. Öğrenirken küçük kararları kendin vermeyi dene: hangi konuyu, ne zaman ve hangi yöntemle çalışacağını sen seç ve hafta sonunda bu seçimlerin nasıl sonuç verdiğine bak. Kendi kararlarının işe yaradığını görmek, onlara güvenmeni kolaylaştırır.',
          parent:
            'Çocuğunuz kararları başkalarına bırakmayı daha kolay buluyor olabilir. Hangi konuyu, ne zaman ve hangi yöntemle çalışacağını kendisinin seçmesine fırsat verin; hafta sonunda bu seçimlerin nasıl sonuç verdiğine birlikte bakın. Kendi kararlarının işe yaradığını görmek, onlara güvenmesini kolaylaştırır.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir grup çalışmasında sözü önce başkalarına ver; herkes konuştuktan sonra kendi fikrini gerekçesiyle söyle.',
          parent: 'Bu hafta aile içinde bir karar verirken (hafta sonu planı gibi) çocuğunuzdan önce herkesi dinlemesini, sonra kendi önerisini gerekçesiyle söylemesini isteyin.',
        },
        average: {
          student: 'Bu hafta kendi çalışma planını kendin yap; hafta sonunda planın hangi bölümünün işe yaradığını iki cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzun kendi çalışma planını yapmasına fırsat verin; hafta sonunda neyin işe yaradığını ona sorun.',
        },
        low: {
          student: 'Bu hafta hangi gün hangi konuyu çalışacağını kendin seç; bir kez de olsa bir grup içinde fikrini kısa bir cümleyle söyle.',
          parent: 'Bu hafta çocuğunuzun hangi gün hangi konuyu çalışacağını kendisinin seçmesine fırsat verin; seçimini değiştirmeden nasıl gittiğini sorun.',
        },
      },
      settings: {
        high: 'Sorumluluk üstlenmenin, karar vermenin ve yön vermenin öne çıktığı ortamlar',
        low: 'Görevlerin ve rollerin açıkça paylaşıldığı, iş birliğine dayalı ortamlar',
      },
    },
    gregariousness: {
      color: '#f2c80f',
      study: {
        high: {
          student:
            'Hareketli ve neşeli ortamlar seni canlı tutuyor. Çalışmayı kısa ve hareketli bloklara böl: 25 dakika odaklan, 5 dakika kalkıp hareket et. Kendini sınamayı bir oyuna çevirebilirsin: bir arkadaşınla süre tutarak birbirinize kitaba bakmadan soru sorun. Çalışırken telefonu başka bir odaya bırakmak dikkatini korur.',
          parent:
            'Çocuğunuzu hareketli ve neşeli ortamlar canlı tutuyor olabilir. Çalışmayı kısa bloklara bölmesi (25 dakika odaklanma, 5 dakika hareket) ve kendini sınamayı bir arkadaşıyla süre tutarak oynanan bir soru oyununa çevirmesi işine yarayabilir. Çalışırken telefonun başka bir odada durması dikkatini korur.',
          adult:
            'Hareketli ve neşeli ortamlar seni canlı tutuyor. Çalışmayı kısa ve hareketli bloklara böl: 25 dakika odaklan, 5 dakika kalkıp hareket et. Kendini sınamayı bir oyuna çevirebilirsin: biriyle süre tutarak birbirinize kaynağa bakmadan soru sorun. Çalışırken telefonu başka bir odaya bırakmak dikkatini korur.',
        },
        average: {
          student:
            'Bazen hareketli, bazen sakin ortamlarda rahatsın. Enerjinin yüksek olduğu saatleri kendini sınama ve soru çözme gibi etkin işlere, sakin saatleri ise yeni konuları okumaya ayırmak işine yarayabilir.',
          parent:
            'Çocuğunuz bazen hareketli, bazen sakin ortamlarda rahat ediyor. Enerjisinin yüksek olduğu saatleri soru çözme gibi etkin işlere, sakin saatleri yeni konuları okumaya ayırması işine yarayabilir.',
        },
        low: {
          student:
            'Sakin ve ciddi bir çalışma ortamı sana iyi geliyor. Gürültüden uzak, sabit bir çalışma köşesi oluştur ve tekrarlarını orada günlere yayarak yap: bir konuyu çalıştığın gün, iki gün sonra ve bir hafta sonra kendini birkaç kısa soruyla yeniden sına.',
          parent:
            'Çocuğunuza sakin ve ciddi bir çalışma ortamı iyi geliyor olabilir. Evde gürültüden uzak, sabit bir çalışma köşesi bunu destekler. Tekrarlarını günlere yayması (bir konuyu çalıştığı gün, iki gün sonra ve bir hafta sonra kısa sorularla yeniden sınaması) bu sakin düzeni en etkili yöntemle birleştirir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta çalışmanı 25 dakikalık bloklara böl; her bloktan sonra 5 dakika hareket et ve bloklar boyunca telefonunu başka bir odada tut.',
          parent: 'Bu hafta çocuğunuzla 25 dakikalık çalışma bloklarını deneyin; bloklar boyunca telefonun başka bir odada durmasını birlikte kararlaştırın.',
        },
        average: {
          student: 'Bu hafta günün en enerjik saatinde kendini sınamaya, en sakin saatinde yeni bir konu okumaya 20’şer dakika ayır.',
          parent: 'Bu hafta çocuğunuzla enerjisinin en yüksek ve en düşük olduğu saatleri gözlemleyin; çalışmayı bu saatlere göre birlikte planlayın.',
        },
        low: {
          student: 'Bu hafta sabit bir çalışma köşesi hazırla; bir konuyu çalıştığın günden iki gün sonra o köşede kendini beş soruyla yeniden sına.',
          parent: 'Bu hafta çocuğunuzla birlikte evde sessiz ve sabit bir çalışma köşesi hazırlayın.',
        },
      },
      settings: {
        high: 'Hareketli, canlı ve insanlarla iç içe ortamlar',
        low: 'Ölçülü ve ciddi bir havanın olduğu, ayrıntıya özen gösterilen ortamlar',
      },
    },
    dutifulness: {
      color: '#2e3d9e',
      study: {
        high: {
          student:
            'Kurallara ve yönergelere uymak sana kolay geliyor. Bunu öğrenirken bir adım öteye taşı: öğrendiğin kuralların ve bilgilerin neden böyle olduğunu kendine açıklamaya çalış; ezberlemek yerine anlamak, bilgiyi kalıcı kılar. Bir yönergede belirsiz bir yer görürsen sormak da kurallara özen göstermenin bir parçasıdır.',
          parent:
            'Çocuğunuza kurallara ve yönergelere uymak kolay geliyor olabilir. Öğrendiği kuralların ve bilgilerin neden böyle olduğunu kendine açıklamaya çalışması, ezberlemek yerine anlamasını ve bilgiyi kalıcı kılmasını sağlar.',
        },
        average: {
          student:
            'Kurallara çoğu zaman uyuyor, bazılarını sorguluyorsun. Planına uymakta zorlandığın günlerde planı küçültmek hiç çalışmamaktan iyidir: 40 dakika yerine 15 dakika kendini sınamak bile tekrarı sürdürür.',
          parent:
            'Çocuğunuz kurallara çoğu zaman uyuyor, bazılarını sorguluyor. Planına uymakta zorlandığı günlerde planı küçültmesi hiç çalışmamasından iyidir: kısa bir tekrar bile alışkanlığı sürdürür.',
        },
        low: {
          student:
            'Kendi yolunu bulmayı ve kuralları sorgulamayı seviyorsun. Bu bağımsızlığı çalışma düzenine de taşı: dışarıdan konan bir plan yerine kendi kurallarını kendin koy ("Her akşam 20 dakika kendimi sınayacağım" gibi). Kendi koyduğun kurala uymak, başkasının koyduğuna uymaktan daha kolay olabilir.',
          parent:
            'Çocuğunuz kendi yolunu bulmayı ve kuralları sorgulamayı seviyor olabilir. Dışarıdan konan bir plan yerine kendi çalışma kurallarını kendisinin koymasına fırsat verin ("Her akşam 20 dakika kendimi sınayacağım" gibi); kendi koyduğu kurala uymak ona daha kolay gelebilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta öğrendiğin bir kuralın ya da bilginin neden doğru olduğunu iki cümleyle kendine açıkla ve bir deftere yaz.',
          parent: 'Bu hafta çocuğunuzdan öğrendiği bir kuralın ya da bilginin neden doğru olduğunu size kısaca açıklamasını isteyin.',
        },
        average: {
          student: 'Bu hafta planına uyamadığın bir gün olursa planı yarıya indir ama bırakma; hafta sonunda kaç gün çalıştığını say.',
          parent: 'Bu hafta çocuğunuz planına uyamadığı bir gün yaşarsa planı küçültmesini önerin; hafta sonunda kaç gün çalıştığını birlikte sayın.',
        },
        low: {
          student: 'Bu hafta kendi çalışma kuralını kendin koy ve bir kâğıda yaz; hafta sonunda kaç gün uyduğuna bak.',
          parent: 'Bu hafta çocuğunuzun kendi çalışma kuralını koymasına fırsat verin; kurala uyduğu günleri fark ettiğinizi söyleyin.',
        },
      },
      settings: {
        high: 'Kuralların ve sorumlulukların açık olduğu, güvenilirliğin önemli olduğu ortamlar',
        low: 'Bağımsız çalışmanın ve kendi yolunu bulmanın mümkün olduğu esnek ortamlar',
      },
    },
    friendliness: {
      color: '#f58231',
      study: {
        high: {
          student:
            'İnsanların arasında rahatsın ve konuşmaktan çekinmiyorsun. Bunu öğrenmek için kullan: derste anlamadığın yeri hemen sor ve öğrendiğin konuları kısa sunumlar hâlinde birine anlatmayı dene; anlatırken takıldığın yer, tekrar etmen gereken yerdir.',
          parent:
            'Çocuğunuz insanların arasında rahat ve konuşmaktan çekinmiyor olabilir. Derste anlamadığı yeri hemen sorması ve öğrendiği konuları size kısa bir sunum gibi anlatması bu rahatlığı öğrenmeye dönüştürür: anlatırken takıldığı yer, tekrar etmesi gereken yerdir.',
          adult:
            'İnsanların arasında rahatsın ve konuşmaktan çekinmiyorsun. Bunu öğrenmek için kullan: bir eğitimde ya da toplantıda anlamadığın yeri hemen sor ve öğrendiğin konuları kısa sunumlar hâlinde birine anlatmayı dene; anlatırken takıldığın yer, tekrar etmen gereken yerdir.',
        },
        average: {
          student:
            'Bazı durumlarda insanların arasında rahatsın, bazılarında geri planda kalıyorsun. Tanıdığın bir arkadaşınla düzenli bir çalışma ortaklığı kurmak işine yarar: her hafta aynı gün buluşup bir önceki haftanın konularını birbirinize kitaba bakmadan sorarak tekrar edin.',
          parent:
            'Çocuğunuz bazı durumlarda insanların arasında rahat, bazılarında geri planda kalıyor olabilir. Tanıdığı bir arkadaşıyla düzenli bir çalışma ortaklığı kurması işine yarar: her hafta aynı gün buluşup bir önceki haftanın konularını birbirlerine kitaba bakmadan sorarak tekrar edebilirler.',
          adult:
            'Bazı durumlarda insanların arasında rahatsın, bazılarında geri planda kalıyorsun. Tanıdığın biriyle düzenli bir çalışma ortaklığı kurmak işine yarar: her hafta aynı gün buluşup bir önceki haftanın konularını birbirinize kaynağa bakmadan sorarak tekrar edin.',
        },
        low: {
          student:
            'Kalabalıkta soru sormak sana zor gelebilir; bu, öğrenmeni engellemek zorunda değil. Sorularını bir kâğıda yazıp öğretmenine ders sonunda birebir sorabilir ya da yazılı olarak iletebilirsin. Kendini sınamak için bir gruba ihtiyacın yok: konuyu yüksek sesle kendine anlatmak çok işe yarar.',
          parent:
            'Çocuğunuza kalabalıkta soru sormak zor gelebilir; bu, öğrenmesini engellemek zorunda değil. Sorularını bir kâğıda yazıp öğretmenine ders sonunda birebir sormasını önerebilirsiniz. Konuyu yüksek sesle kendine anlatması da kendini sınamanın etkili bir yoludur.',
          adult:
            'Kalabalıkta soru sormak sana zor gelebilir; bu, öğrenmeni engellemek zorunda değil. Sorularını bir kâğıda yazıp sonra birebir sorabilir ya da yazılı olarak iletebilirsin. Kendini sınamak için bir gruba ihtiyacın yok: konuyu yüksek sesle kendine anlatmak çok işe yarar.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta öğrendiğin bir konuyu birine 5 dakikalık kısa bir sunum gibi anlat; anlatamadığın yerleri not al ve ertesi gün yeniden çalış.',
          parent: 'Bu hafta çocuğunuz öğrendiği bir konuyu size ya da bir kardeşine 5 dakikada anlatsın; takıldığı yerleri birlikte not alın.',
        },
        average: {
          student: 'Bu hafta tanıdığın bir arkadaşınla 20 dakikalık bir soru-cevap çalışması yapın; kitaplar kapalı, sırayla birbirinize soru sorun.',
          parent: 'Bu hafta çocuğunuzun tanıdığı bir arkadaşıyla 20 dakikalık bir soru-cevap çalışması yapmasını önerin.',
          adult: 'Bu hafta tanıdığın biriyle 20 dakikalık bir soru-cevap çalışması yapın; kaynaklar kapalı, sırayla birbirinize soru sorun.',
        },
        low: {
          student: 'Bu hafta aklına takılan bir soruyu kâğıda yaz ve birine birebir sor; sorduktan sonra nasıl hissettiğini not et.',
          parent: 'Bu hafta çocuğunuzun aklına takılan bir soruyu kâğıda yazıp öğretmenine birebir sormasını önerin.',
        },
      },
      settings: {
        high: 'İnsanlarla tanışmanın, sunum yapmanın ve iletişim kurmanın sık olduğu ortamlar',
        low: 'Küçük ve tanıdık ekiplerle, birebir iletişimle çalışılan ortamlar',
      },
    },
    sensitivity: {
      color: '#d72fc9',
      study: {
        high: {
          student:
            'Kitaplardan ve hikâyelerden etkileniyorsun. Bunu öğrenirken kullan: bir konuyu bir hikâyeye ya da somut bir örneğe bağlayarak kendine anlat, sonra bu anlatımı kitaba bakmadan hatırlamaya çalış. Okuduğun bir metni kapattıktan sonra kendi cümlelerinle özetleyip metinle karşılaştırmak hem anlamanı hem hatırlamanı güçlendirir.',
          parent:
            'Çocuğunuz kitaplardan ve hikâyelerden etkileniyor olabilir. Bir konuyu bir hikâyeye ya da somut bir örneğe bağlayarak anlatması ve okuduğu bir metni kapattıktan sonra kendi cümleleriyle özetleyip metinle karşılaştırması, hem anlamasını hem hatırlamasını güçlendirir.',
          adult:
            'Okumaktan ve hikâyelerden etkileniyorsun. Bunu öğrenirken kullan: bir konuyu bir hikâyeye ya da somut bir örneğe bağlayarak kendine anlat, sonra bu anlatımı kaynağa bakmadan hatırlamaya çalış. Okuduğun bir metni kapattıktan sonra kendi cümlelerinle özetleyip metinle karşılaştırmak hem anlamanı hem hatırlamanı güçlendirir.',
        },
        average: {
          student:
            'Bazı kitap ve filmlerden etkileniyor, bazılarına ilgi duymuyorsun. Okuman gereken metinlerde ilgini çeken bir soru bul ve metni o sorunun cevabını arayarak oku; okuduktan sonra metni kapatıp cevabı yaz.',
          parent:
            'Çocuğunuz bazı kitap ve filmlerden etkileniyor, bazılarına ilgi duymuyor olabilir. Okuması gereken metinlerde ilgisini çeken bir soru bulup metni o sorunun cevabını arayarak okuması, okumayı daha anlamlı kılar.',
          adult:
            'Bazı okumalardan ve filmlerden etkileniyor, bazılarına ilgi duymuyorsun. Okuman gereken metinlerde ilgini çeken bir soru bul ve metni o sorunun cevabını arayarak oku; okuduktan sonra metni kapatıp cevabı yaz.',
        },
        low: {
          student:
            'Okumayı bir amaca bağlamak işini kolaylaştırabilir. Okuman gereken metinleri bir amaçla oku: önce başlıklara bakıp bir iki soru çıkar, sonra okurken cevaplarını ara. Konuları kendi elinle deneyerek ya da bir model, bir çizim gibi somut bir şey yaparak pekiştirmek, ilgini canlı tutar.',
          parent:
            'Okumayı bir amaca bağlamak çocuğunuzun işini kolaylaştırabilir. Okuması gereken metinlere önce başlıklara bakıp bir iki soru çıkararak başlaması, okumayı amaçlı hâle getirir. Konuları deneyerek ya da somut bir şey yaparak pekiştirmesine fırsat verebilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta okuduğun bir metni bir gün sonra kitaba bakmadan beş cümleyle özetle; sonra metinle karşılaştır.',
          parent: 'Bu hafta çocuğunuzdan okuduğu bir kitabı ya da izlediği bir filmi size beş cümleyle anlatmasını isteyin.',
          adult: 'Bu hafta okuduğun bir metni bir gün sonra ona bakmadan beş cümleyle özetle; sonra metinle karşılaştır.',
        },
        average: {
          student: 'Bu hafta okuman gereken bir metne başlamadan önce kendine bir soru sor; okuduktan sonra cevabını metne bakmadan yaz.',
          parent: 'Bu hafta çocuğunuzla okuduğu bir metin hakkında "En çok neyi merak ettin?" diye konuşun.',
        },
        low: {
          student: 'Bu hafta okuman gereken bir metnin başlıklarına bakıp iki soru çıkar; okurken cevaplarını ara ve altını çiz.',
          parent: 'Bu hafta çocuğunuzla günlük hayattan bir konuyu (bir aletin nasıl çalıştığı ya da bir yemeğin nasıl yapıldığı gibi) birlikte deneyerek öğrenin.',
        },
      },
    },
    distrust: {
      color: '#8b929e',
      study: {
        high: {
          student:
            'Kolay kolay ikna olmuyorsun; bu temkin öğrenirken de işine yarayabilir. Okuduğun bir bilgide "Kaynağı ne? Kanıtı ne?" diye sor ve bilgiyi güvenilir bir kaynakla karşılaştır. Grup çalışmalarında görevleri ve kimin neyi yapacağını baştan yazılı olarak paylaşmak, belirsizlikleri azaltır.',
          parent:
            'Çocuğunuz kolay kolay ikna olmuyor olabilir; bu temkin öğrenirken de işine yarayabilir. Okuduğu bir bilgide "Kaynağı ne? Kanıtı ne?" diye sorması ve bilgiyi güvenilir bir kaynakla karşılaştırması bu sorgulayıcılığı işe yarar hâle getirir. Grup çalışmalarında görevlerin baştan yazılı olarak paylaşılması belirsizliği azaltır.',
        },
        average: {
          student:
            'Çoğu zaman güveniyor, gerektiğinde sorguluyorsun. Bu dengeyi bilgiye de uygula: internette okuduğun bir bilgiyi en az iki güvenilir kaynakla karşılaştır ve öğrendiğini kendi cümlelerinle not et.',
          parent:
            'Çocuğunuz çoğu zaman güveniyor, gerektiğinde sorguluyor. İnternette okuduğu bir bilgiyi en az iki güvenilir kaynakla karşılaştırması, bu dengeyi bilgiye de uygulamasını sağlar.',
        },
        low: {
          student:
            'İnsanlara ve söylenenlere kolayca güveniyorsun; bu, birlikte öğrenmeyi kolaylaştırır. Bir arkadaşının ya da internetteki bir kaynağın söylediğini öğrenirken onu ders kitabınla ya da güvenilir bir kaynakla karşılaştırmayı alışkanlık hâline getir. Kendini sınamak, neyi gerçekten bildiğini görmenin en sağlam yoludur.',
          parent:
            'Çocuğunuz insanlara ve söylenenlere kolayca güveniyor olabilir; bu, birlikte öğrenmeyi kolaylaştırır. Bir arkadaşından ya da internetten öğrendiği bilgiyi ders kitabıyla ya da güvenilir bir kaynakla karşılaştırmayı alışkanlık hâline getirmesine destek olabilirsiniz.',
          adult:
            'İnsanlara ve söylenenlere kolayca güveniyorsun; bu, birlikte öğrenmeyi kolaylaştırır. Birinin ya da internetteki bir kaynağın söylediğini öğrenirken onu güvenilir bir kaynakla karşılaştırmayı alışkanlık hâline getir. Kendini sınamak, neyi gerçekten bildiğini görmenin en sağlam yoludur.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir grup çalışmasında herkesin görevini baştan yazılı olarak paylaşmayı öner ve sonunda işin nasıl gittiğine bak.',
          parent: 'Bu hafta çocuğunuzla bir işi (bir aile planı gibi) görevleri baştan yazarak paylaşın ve sonunda nasıl gittiğini konuşun.',
        },
        average: {
          student: 'Bu hafta internette okuduğun bir bilgiyi iki güvenilir kaynakla karşılaştır ve sonucu bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla internette gördüğü bir bilginin doğru olup olmadığını birlikte araştırın.',
        },
        low: {
          student: 'Bu hafta bir arkadaşından ya da internetten öğrendiğin bir bilgiyi güvenilir bir kaynakla karşılaştır; farklı çıkarsa hangisinin neden doğru olduğunu yaz.',
          parent: 'Bu hafta çocuğunuzla bir haberin ya da iddianın doğru olup olmadığını nasıl anlayabileceğinizi birlikte deneyin.',
        },
      },
      settings: {
        high: 'Dikkatin, denetimin ve bilgiyi doğrulamanın önemli olduğu ortamlar',
        low: 'Güvene ve iş birliğine dayalı, insanların birbirine destek olduğu ortamlar',
      },
    },
    imagination: {
      color: '#2bb5d8',
      study: {
        high: {
          student:
            'Hayal gücün ve farklı düşünmen öğrenirken sana yardım edebilir. Bir konuyu çalıştıktan sonra "Bu olmasaydı ne olurdu?", "Bunu başka nerede görürüm?" gibi sorular sor ve cevaplarını kitaba bakmadan yaz; sonra kitapla karşılaştır. Çalışırken aklına gelen fikirleri bir kenara not etmek, hem fikirlerini kaybetmemeni hem de işe geri dönmeni sağlar.',
          parent:
            'Çocuğunuzun hayal gücü ve farklı düşünmesi öğrenirken ona yardım edebilir. Bir konuyu çalıştıktan sonra "Bu olmasaydı ne olurdu?", "Bunu başka nerede görürüm?" gibi sorular sorup cevaplarını kitaba bakmadan yazmasını, sonra kitapla karşılaştırmasını önerin. Çalışırken aklına gelen fikirleri bir kenara not etmesi, işine geri dönmesini kolaylaştırır.',
          adult:
            'Hayal gücün ve farklı düşünmen öğrenirken sana yardım edebilir. Bir konuyu çalıştıktan sonra "Bu olmasaydı ne olurdu?", "Bunu başka nerede görürüm?" gibi sorular sor ve cevaplarını kaynağa bakmadan yaz; sonra karşılaştır. Çalışırken aklına gelen fikirleri bir kenara not etmek, hem fikirlerini kaybetmemeni hem de işe geri dönmeni sağlar.',
        },
        average: {
          student:
            'Bazen hayallere dalıyor, çoğu zaman işleri alışılmış yoldan yapıyorsun. Planlı tekrarlar için alışılmış yolu, konuları kendi örneklerinle açıklamak için hayal gücünü kullanabilirsin.',
          parent:
            'Çocuğunuz bazen hayallere dalıyor, çoğu zaman işleri alışılmış yoldan yapıyor. Planlı tekrarlar için alışılmış yolu, konuları kendi örnekleriyle açıklamak için hayal gücünü kullanması iyi bir denge kurar.',
        },
        low: {
          student:
            'İşleri usulüne uygun ve adım adım yapmak sana kolay geliyor. Konuları adım adım özetleyen kısa listeler hazırla ve kendini bu listelere bakmadan sına. Ara sıra "Bu bilgi başka nerede işe yarar?" diye sormak, öğrendiklerini birbirine bağlamanı sağlar.',
          parent:
            'Çocuğunuza işleri usulüne uygun ve adım adım yapmak kolay geliyor olabilir. Konuları adım adım özetleyen kısa listeler hazırlaması ve kendini bu listelere bakmadan sınaması işine yarayabilir. Ara sıra "Bu bilgi başka nerede işe yarar?" diye sormanız, öğrendiklerini birbirine bağlamasına yardım eder.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta çalışırken aklına gelen fikirleri bir "sonra" listesine yaz ve çalışma bitince listeye 5 dakika ayır.',
          parent: 'Bu hafta çocuğunuzla öğrendiği bir konu hakkında "Bu olmasaydı ne olurdu?" diye birlikte düşünün; cevabını size kendisi anlatsın.',
        },
        average: {
          student: 'Bu hafta bir konuyu kendi uydurduğun bir örnekle anlat; iki gün sonra o örneği kullanarak konuyu bakmadan hatırla.',
          parent: 'Bu hafta çocuğunuzdan öğrendiği bir konuya günlük hayattan kendi bulduğu bir örnek vermesini isteyin.',
        },
        low: {
          student: 'Bu hafta bir konunun adımlarını kısa bir liste hâlinde yaz; ertesi gün listeye bakmadan adımları sırayla hatırla.',
          parent: 'Bu hafta çocuğunuzla bir işi ya da bir tarifi alışılmışın dışında bir yoldan yapmayı birlikte deneyin.',
        },
      },
      settings: {
        high: 'Yeni fikirlerin, tasarımın ve özgün çözümlerin değer gördüğü ortamlar',
        low: 'Adımların ve yöntemlerin açık olduğu, uygulamaya dönük ortamlar',
      },
    },
    reserve: {
      color: '#9a6324',
      study: {
        high: {
          student:
            'Düşüncelerini ve duygularını kendine saklamayı tercih ediyorsun; bu, takıldığın yerde yardım istemeyi zorlaştırabilir. Kendine küçük bir kural koy: bir konuda 15 dakikadan uzun takılırsan güvendiğin tek bir kişiye sor. Kendini sınamak için kimseye anlatman gerekmez: konunun sonunda birkaç deneme sorusu çözmek de en etkili yöntemlerden biridir.',
          adult:
            'Düşüncelerini ve duygularını kendine saklamayı tercih ediyorsun; bu, takıldığın yerde yardım istemeyi zorlaştırabilir. Kendine küçük bir kural koy: bir konuda 15 dakikadan uzun takılırsan güvendiğin tek bir kişiye sor. Kendini sınamak için kimseye anlatman gerekmez: konunun sonunda kendine birkaç kısa soru sorup bakmadan cevaplamak da en etkili yöntemlerden biridir.',
          parent:
            'Çocuğunuz düşüncelerini ve duygularını kendine saklamayı tercih ediyor olabilir; bu, takıldığı yerde yardım istemesini zorlaştırabilir. Bir konuda uzun süre takıldığında güvendiği tek bir kişiye sormayı küçük bir kural hâline getirmesini önerebilirsiniz. Konunun sonunda birkaç deneme sorusu çözmesi, kimseye anlatmadan kendini sınamanın etkili bir yoludur.',
        },
        average: {
          student:
            'Kime ne kadar açılacağını seçiyorsun. Zorlandığın bir konuyu güvendiğin birine sormak, tek başına uğraşırken kaybettiğin zamanı kısaltır; kimi zaman tek bir soru, saatlerce aramaktan daha çok işe yarar.',
          parent:
            'Çocuğunuz kime ne kadar açılacağını seçiyor. Zorlandığı bir konuyu güvendiği birine sorması, tek başına uğraşırken kaybettiği zamanı kısaltır; kimi zaman tek bir soru, saatlerce aramaktan daha çok işe yarar.',
        },
        low: {
          student:
            'Kendini kolayca ifade ediyorsun; bu, öğrenirken de işine yarayabilir. Öğrendiğin bir konuyu sesli anlatmak hem anlamanı hem hatırlamanı güçlendirir. Takıldığın yeri açıkça söylemen, yardım almanı da kolaylaştırır.',
          parent:
            'Çocuğunuz kendini kolayca ifade ediyor olabilir; bu, öğrenirken de işine yarayabilir. Öğrendiği bir konuyu sesli anlatması hem anlamasını hem hatırlamasını güçlendirir; takıldığı yeri açıkça söylemesi yardım almasını kolaylaştırır.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta takıldığın bir soruyu yazılı olarak birine ilet; çalışmanın sonunda da kendini birkaç deneme sorusuyla sına.',
          adult: 'Bu hafta takıldığın bir soruyu yazılı olarak birine ilet; çalışmanın sonunda da kendini birkaç kısa soruyla sına.',
          parent: 'Bu hafta çocuğunuza, size yüz yüze anlatmak istemediği bir şeyi yazarak ya da mesajla da iletebileceğini söyleyin.',
        },
        average: {
          student: 'Bu hafta 15 dakikadan uzun takıldığın bir soruyu bırak ve güvendiğin birine sor.',
          parent: 'Bu hafta çocuğunuzla zorlandığı bir konuyu kime sorabileceğini birlikte düşünün; sorduğunda bunu fark ettiğinizi söyleyin.',
        },
        low: {
          student: 'Bu hafta bir konudaki en zor noktayı bir arkadaşınla konuşun; birbirinize nasıl anladığınızı anlatın.',
          parent: 'Bu hafta yemekte ya da yolda çocuğunuza o gün öğrendiği en ilginç şeyi sorun ve dinleyin.',
        },
      },
      settings: {
        high: 'Kişisel alana saygı gösterilen, iletişimin yazılı ve planlı yürüdüğü ortamlar',
        low: 'Açık iletişimin, paylaşmanın ve geri bildirimin sık olduğu ortamlar',
      },
    },
    anxiety: {
      color: '#9b1c1c',
      study: {
        high: {
          student:
            'Endişelenmek, iyi yapmayı önemsediğini de gösterebilir; ama çok yoğun olduğunda çalışmayı zorlaştırabilir. Kendini sık sık kısa sorularla sınamak, sınavdan önce neyi bildiğini görmeni sağlar ve belirsizliği azaltır. Sınavdan hemen önce endişelerini 10 dakika kadar bir kâğıda yazmak da işe yarayabilir. Hatalarını bir başarısızlık değil, neyi tekrar edeceğini gösteren bir ipucu olarak gör.',
          parent:
            'Çocuğunuzun endişeleri, iyi yapmayı önemsediğini de gösterebilir; ama çok yoğun olduğunda çalışmasını zorlaştırabilir. Kendini sık sık kısa sorularla sınaması, sınavdan önce neyi bildiğini görmesini sağlar ve belirsizliği azaltır. Sınavdan hemen önce endişelerini 10 dakika kadar yazması da işe yarayabilir.',
          adult:
            'Endişelenmek, iyi yapmayı önemsediğini de gösterebilir; ama çok yoğun olduğunda çalışmayı zorlaştırabilir. Kendini sık sık kısa sorularla sınamak, önemli bir işten önce neyi bildiğini görmeni sağlar ve belirsizliği azaltır. Önemli bir işten hemen önce endişelerini 10 dakika kadar bir kâğıda yazmak da işe yarayabilir. Hatalarını bir başarısızlık değil, neyi tekrar edeceğini gösteren bir ipucu olarak gör.',
        },
        average: {
          student:
            'Bazı konularda endişelenebiliyorsun. Çalışmayı günlere yaymak ve sınava yakın günlerde yalnızca kendini sınamaya odaklanmak, son dakika endişesini azaltır.',
          parent:
            'Çocuğunuz bazı konularda endişelenebiliyor. Çalışmayı günlere yayması ve sınava yakın günlerde kendini sınamaya odaklanması, son dakika endişesini azaltır.',
          adult:
            'Bazı konularda endişelenebiliyorsun. Hazırlığını günlere yaymak ve önemli bir işe yakın günlerde yalnızca kendini sınamaya odaklanmak, son dakika endişesini azaltır.',
        },
        low: {
          student:
            'Kolay kolay endişelenmiyorsun; bu sakinlik baskı altında işine yarar. Rahatlığın "Nasılsa biliyorum" düşüncesine dönüşmesin diye kendini düzenli olarak sına: bildiğini sandığın ile gerçekten bildiğin arasındaki farkı görmek, hazırlığını sağlamlaştırır.',
          parent:
            'Çocuğunuz kolay kolay endişelenmiyor; bu sakinlik baskı altında işine yarar. Rahatlığın "Nasılsa biliyorum" düşüncesine dönüşmemesi için kendini düzenli olarak sınamasına destek olun: bildiğini sandığı ile gerçekten bildiği arasındaki farkı görmek hazırlığını sağlamlaştırır.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta seni endişelendiren bir işten önce 10 dakika boyunca endişelerini bir kâğıda yaz; ardından o işle ilgili kendini üç kısa soruyla sına. Endişen çok yoğunsa bunu tek başına taşıma, güvendiğin bir yetişkinle konuş.',
          parent:
            'Bu hafta çocuğunuzla onu endişelendiren bir konuyu sakin bir anda konuşun; endişelerini 10 dakika yazmasını ve ardından kendini birkaç soruyla sınamasını önerin.',
          adult:
            'Bu hafta seni endişelendiren bir işten önce 10 dakika boyunca endişelerini bir kâğıda yaz; ardından o işle ilgili kendini üç kısa soruyla sına. Endişen çok yoğunsa bunu tek başına taşıma, güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuş.',
        },
        average: {
          student: 'Bu hafta yaklaşan bir iş için tekrarlarını üç güne yay; son gün yalnızca kendini sına.',
          parent: 'Bu hafta çocuğunuzun yaklaşan bir iş için tekrarlarını üç güne yaymasına yardım edin.',
        },
        low: {
          student: 'Bu hafta "biliyorum" dediğin bir konuda kendini kitaba bakmadan 10 soruyla sına; bilemediklerini yeniden çalış.',
          parent: 'Bu hafta çocuğunuzdan "biliyorum" dediği bir konuda kitaba bakmadan birkaç soru cevaplamasını isteyin.',
          adult: 'Bu hafta "biliyorum" dediğin bir konuda kendini kaynağa bakmadan 10 soruyla sına; bilemediklerini yeniden çalış.',
        },
      },
      settings: {
        high: 'Hata yapmanın öğrenmenin parçası sayıldığı, yapıcı geri bildirimin verildiği ortamlar',
        low: 'Eleştiriye açık olmanın ve belirsizlikle rahat çalışabilmenin önemli olduğu ortamlar',
      },
    },
    complexity: {
      color: '#9ccc2e',
      study: {
        high: {
          student:
            'Yeni fikirler ve soyut konular ilgini çekiyor. Bu merakı öğrenmeye dönüştür: bir konuyu çalışırken nedenlerini kendine açıklamak, bilgiyi kalıcı kılar. Çok farklı konuya aynı anda dalmak yerine birini bitirip kendini sınadıktan sonra ötekine geç.',
          parent:
            'Çocuğunuzun ilgisini yeni fikirler ve soyut konular çekiyor olabilir. Bir konuyu çalışırken nedenlerini kendine açıklaması bu merakı öğrenmeye dönüştürür. Çok farklı konuya aynı anda dalmak yerine birini bitirip kendini sınadıktan sonra ötekine geçmesine destek olun.',
        },
        average: {
          student:
            'Yeniye de alışılmışa da açıksın. Farklı türde soruları karıştırarak çalışmak (matematikte farklı konulardan soruları art arda çözmek gibi) hem çeşitlilik sağlar hem de araştırmalara göre öğrenmeyi güçlendirir.',
          parent:
            'Çocuğunuz yeniye de alışılmışa da açık. Farklı türde soruları karıştırarak çalışması (matematikte farklı konulardan soruları art arda çözmek gibi) hem çeşitlilik sağlar hem de araştırmalara göre öğrenmeyi güçlendirir.',
          adult:
            'Yeniye de alışılmışa da açıksın. Farklı türde soruları ya da konuları karıştırarak çalışmak hem çeşitlilik sağlar hem de araştırmalara göre öğrenmeyi güçlendirir.',
        },
        low: {
          student:
            'Soyut ve kuramsal konular sana pek çekici gelmiyor olabilir. Soyut bir konuyu çalışırken önce somut bir örnekle başla, sonra kuralı çıkar. Her konunun sonunda "Bunu nerede kullanırım?" diye sormak öğrendiklerini anlamlı kılar.',
          parent:
            'Çocuğunuza soyut ve kuramsal konular pek çekici gelmiyor olabilir. Soyut bir konuya önce somut bir örnekle başlaması, sonra kuralı çıkarması işine yarar.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta merak ettiğin bir konuyu seç ve bitirdiğinde kendini beş soruyla sına; ancak ondan sonra yeni bir konuya geç.',
          parent: 'Bu hafta çocuğunuzla merak ettiği bir konu üzerine bir sohbet açın ve fikirlerini ilgiyle dinleyin.',
        },
        average: {
          student: 'Bu hafta bir çalışmanda üç farklı konudan ya da soru türünden soruları karıştırarak çöz.',
          parent: 'Bu hafta çocuğunuzun bir çalışmasında farklı konulardan soruları karıştırarak çözmesini önerin.',
        },
        low: {
          student: 'Bu hafta soyut bulduğun bir konu için günlük hayattan iki somut örnek bul ve yaz.',
          parent: 'Bu hafta çocuğunuzla soyut bulduğu bir konuya günlük hayattan birlikte örnek arayın.',
        },
      },
      settings: {
        high: 'Değişimin, yeni fikirlerin ve karmaşık sorunların öne çıktığı ortamlar',
        low: 'Denenmiş yöntemlerle somut sonuçlar alınan, istikrarlı ortamlar',
      },
    },
    introversion: {
      color: '#4363d8',
      study: {
        high: {
          student:
            'Kendi başına çalışmak sana iyi geliyor. Yalnız çalışırken kendini sınamanın bir yolu, konunun sonunda kendine öğretmen gibi sorular yazıp ertesi gün bakmadan cevaplamaktır. Kendine sabit ve sessiz bir çalışma saati belirlemek, bu zamanı en verimli hâle getirir.',
          parent:
            'Çocuğunuza kendi başına çalışmak iyi geliyor olabilir. Konunun sonunda kendine sorular yazıp ertesi gün bakmadan cevaplaması, yalnız çalışırken kendini sınamanın etkili bir yoludur. Sabit ve sessiz bir çalışma saati bu zamanı verimli kılar.',
          adult:
            'Kendi başına çalışmak sana iyi geliyor. Yalnız çalışırken kendini sınamanın bir yolu, konunun sonunda kendine sorular yazıp ertesi gün bakmadan cevaplamaktır. Kendine sabit ve sessiz bir çalışma saati belirlemek, bu zamanı en verimli hâle getirir.',
        },
        average: {
          student:
            'Hem tek başına hem bir grupla çalışabiliyorsun. İşin türüne göre seç: derin düşünmeyi gerektiren işleri tek başına, fikir alışverişi gerektiren işleri birlikte yapmak iki ortamın da iyi yanını kullanır.',
          parent:
            'Çocuğunuz hem tek başına hem bir grupla çalışabiliyor. Derin düşünmeyi gerektiren işleri tek başına, fikir alışverişi gerektiren işleri birlikte yapması iki ortamın da iyi yanını kullanır.',
        },
        low: {
          student:
            'Bir grubun içinde olmak sana enerji veriyor. Küçük bir çalışma grubunda herkesin bir konuyu üstlenip ötekilere anlattığı bir düzen kurmak, hem birlikte olmayı hem de anlatarak öğrenmeyi sağlar. Buluşmaları haftanın belli günlerine yaymak, tekrarları da düzenli hâle getirir.',
          parent:
            'Çocuğunuza bir grubun içinde olmak enerji veriyor olabilir. Küçük bir çalışma grubunda herkesin bir konuyu üstlenip ötekilere anlattığı bir düzen, hem birlikte olmayı hem de anlatarak öğrenmeyi sağlar. Buluşmaları haftanın belli günlerine yaymaları, tekrarları da düzenli hâle getirir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta her gün aynı saatte 30 dakikalık sessiz bir çalışma zamanı ayır; sonunda kendine üç soru yaz ve ertesi gün bakmadan cevapla.',
          parent: 'Bu hafta çocuğunuzla evde onun kendi başına çalışabileceği sessiz bir saati birlikte belirleyin ve bu saate saygı gösterin.',
        },
        average: {
          student: 'Bu hafta bir işi tek başına, bir işi de birlikte yap; hangisinde neyin işe yaradığını iki cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla hangi işleri tek başına, hangilerini birlikte yapmayı sevdiğini konuşun.',
        },
        low: {
          student: 'Bu hafta küçük bir çalışma grubu kur ya da bir gruba katıl; her buluşmada bir konuyu sen anlat.',
          parent: 'Bu hafta çocuğunuzun bir arkadaşıyla ya da küçük bir grupla düzenli çalışabileceği bir zaman ayarlamasına yardım edin.',
        },
      },
      settings: {
        high: 'Bağımsız ve sessiz çalışılabilen, derinlemesine odaklanmayı gerektiren ortamlar',
        low: 'Takım hâlinde çalışılan, insanlarla birlikte üretilen ortamlar',
      },
    },
    orderliness: {
      color: '#808000',
      study: {
        high: {
          student:
            'Düzen ve titizlik sana kolay geliyor. Bu düzeni en etkili yöntemlere ayır: tekrarlarını takvime yaz, her tekrarda kendini kitaba bakmadan sına. Her şeyin kusursuz olmasını beklemek bazen işi uzatabilir; bir işe ayıracağın süreyi baştan belirlemek bunu dengeler.',
          parent:
            'Düzen ve titizlik çocuğunuza kolay geliyor olabilir. Tekrarlarını takvime yazması ve her tekrarda kendini kitaba bakmadan sınaması bu düzeni en etkili yöntemlere ayırır. Her şeyin kusursuz olmasını beklemek işi uzatabilir; bir işe ayıracağı süreyi baştan belirlemesine yardım edin.',
          adult:
            'Düzen ve titizlik sana kolay geliyor. Bu düzeni en etkili yöntemlere ayır: tekrarlarını takvime yaz, her tekrarda kendini kaynağa bakmadan sına. Her şeyin kusursuz olmasını beklemek bazen işi uzatabilir; bir işe ayıracağın süreyi baştan belirlemek bunu dengeler.',
        },
        average: {
          student:
            'Bazı işlerde düzenli, bazılarında daha rahatsın. Haftada bir kez 10 dakika ayırıp önümüzdeki haftanın işlerini ve tekrar günlerini planlamak, düzenini ihtiyacın olan işlere taşır.',
          parent:
            'Çocuğunuz bazı işlerde düzenli, bazılarında daha rahat. Haftada bir kez 10 dakika ayırıp önümüzdeki haftanın işlerini ve tekrar günlerini planlaması, düzenini ihtiyacı olan işlere taşır.',
        },
        low: {
          student:
            'Esnek ve rahatsın; ama hoşuna gitmeyen işleri ertelemek son güne yığılmaya yol açabilir. Çalışmayı küçük ve belirli parçalara böl ("20 dakika, 10 soru" gibi) ve ilk parçaya hemen başla. Tekrarları günlere yaymak, son gece çalışmaktan çok daha fazla hatırlamanı sağlar.',
          parent:
            'Çocuğunuz esnek ve rahat; ama hoşuna gitmeyen işleri ertelemesi son güne yığılmaya yol açabilir. Çalışmayı küçük ve belirli parçalara bölmesine ("20 dakika, 10 soru" gibi) ve ilk parçaya hemen başlamasına destek olun. Tekrarları günlere yayması, son gece çalışmaktan çok daha fazla hatırlamasını sağlar.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta her işe başlamadan önce ne kadar süre ayıracağını yaz; süre bitince iş yeterince iyiyse bırak.',
          parent: 'Bu hafta çocuğunuzla bir işe ayıracağı süreyi baştan belirleyin; süre bitince yaptığını birlikte değerlendirin.',
        },
        average: {
          student: 'Bu hafta pazar günü 10 dakika ayırıp önümüzdeki haftanın tekrar günlerini takvime yaz.',
          parent: 'Bu hafta pazar günü çocuğunuzla 10 dakika ayırıp önümüzdeki haftanın planını birlikte yapın.',
        },
        low: {
          student: 'Bu hafta ertelediğin bir işi "20 dakika, 10 soru" gibi küçük bir parçaya böl ve ilk parçayı hemen yap.',
          parent: 'Bu hafta çocuğunuzla ertelediği bir işi küçük parçalara bölün ve ilk parçaya başlama zamanını birlikte belirleyin.',
        },
      },
      settings: {
        high: 'Özenin, doğruluğun ve düzenin önemli olduğu ortamlar',
        low: 'Esnekliğin ve değişen planlara uyum sağlamanın gerektiği ortamlar',
      },
    },
    emotionality: {
      color: '#3cb44b',
      study: {
        high: {
          student:
            'İşlerin doğru yapılmasını önemsiyor olabilirsin; ama sinirlendiğinde odaklanmak zorlaşabilir. Çalışırken bir şey seni sinirlendirdiğinde 2–3 dakikalık bir mola ver, birkaç derin nefes al ve sonra kaldığın yerden devam et. Grup çalışmalarında başkalarının hatalarını düzeltirken önce iyi giden bir şeyi söylemek, işi kolaylaştırır.',
          parent:
            'Çocuğunuz işlerin doğru yapılmasını önemsiyor olabilir; ama sinirlendiğinde odaklanması zorlaşabilir. Çalışırken bir şey onu sinirlendirdiğinde kısa bir mola verip birkaç derin nefesle devam etmesini önerebilirsiniz. Grup çalışmalarında başkalarının hatalarını düzeltirken önce iyi giden bir şeyi söylemesi işi kolaylaştırır.',
        },
        average: {
          student:
            'Çoğu zaman sakinsin, bazı durumlar ise sabrını zorlayabilir. Bir soruda uzun süre takılıp sinirlenmeye başladığında onu işaretleyip sonraya bırakmak ve öteki sorulara geçmek, hem zamanını hem sabrını korur.',
          parent:
            'Çocuğunuz çoğu zaman sakin; bazı durumlar ise sabrını zorlayabilir. Bir soruda uzun süre takılıp sinirlenmeye başladığında onu işaretleyip sonraya bırakması ve öteki sorulara geçmesi, hem zamanını hem sabrını korur.',
        },
        low: {
          student:
            'Sakin ve hoşgörülüsün; bu, birlikte çalışmayı kolaylaştırır. Grup çalışmalarında farklı fikirleri bir araya getiren kişi olabilirsin. Hoşgörünü kendine de göster: zor bir soruda yanlış yaptığında kendini suçlamadan, çözümünü okuyup bir gün sonra yeniden dene.',
          parent:
            'Çocuğunuz sakin ve hoşgörülü; bu, birlikte çalışmayı kolaylaştırır. Grup çalışmalarında farklı fikirleri bir araya getiren kişi olabilir. Zor bir soruda yanlış yaptığında kendini suçlamadan çözümünü okuyup bir gün sonra yeniden denemesini önerebilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta seni sinirlendiren bir an olduğunda konuşmadan önce üç derin nefes al; akşam o anı ve sonra ne yaptığını bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzla bir tartışma kızışmaya başladığında "Biraz sakinleşip sonra konuşalım" diyerek ona örnek olun.',
        },
        average: {
          student: 'Bu hafta takıldığın bir soruyu işaretleyip sonraya bırak; ötekileri bitirdikten sonra ona taze bir gözle dön.',
          parent: 'Bu hafta çocuğunuza takıldığı bir soruyu sonraya bırakıp ötekilere geçmesini önerin.',
        },
        low: {
          student: 'Bu hafta yanlış yaptığın bir sorunun çözümünü oku ve bir gün sonra çözüme bakmadan yeniden çöz.',
          parent: 'Bu hafta çocuğunuzun yanlış yaptığı bir soruyu bir gün sonra çözümüne bakmadan yeniden denemesini önerin.',
        },
      },
      settings: {
        high: 'Standartların ve beklentilerin net olduğu, sonuca odaklanılan ortamlar',
        low: 'Uyumun, sabrın ve insanlarla iyi geçinmenin önemli olduğu ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.roediger, KAYNAK.cepeda, KAYNAK.rohrer, ramirez],
};
