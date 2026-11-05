import { KAYNAK } from './kaynaklar';
import type { AudienceText, RoadmapTemplate, Wellbeing } from './types';

/**
 * Sınav Kaygısı ve Baş Etme: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öneriler araştırmalarda yararlı bulunan küçük adımlardır: sınavdan önce endişeleri yazmak (Ramirez ve Beilock, 2011;
 *    bir tekrar çalışmasında aynı etki bulunamadığı için öneride bu açıkça söylenir: Camerer ve ark., 2018), heyecanın zarar vermediğini, yardım edebileceğini düşünmek (Jamieson ve ark., 2010), gevşeme ve yavaş nefes gibi
 *    davranışçı yollar (Huntley ve ark., 2019), çalışma becerilerini kaygıyla baş etme yollarıyla birleştirmek (Ergene, 2003),
 *    çalışmayı günlere yaymak ve kendini sınamak (Dunlosky ve ark., 2013). "Kaygın kaybolur" ya da "puanın yükselir" vaadi
 *    verilmez; kaygı uzun süredir günlük hayatı zorlaştırıyorsa destek almak önerilir (raporun destek kutusu da açılır).
 *  - 2. hafta sınava hazırlık; 3. hafta kaygının yüksek olan ilk yanı (takılma, endişe, beden sırasıyla; iyi oluş haftası),
 *    yoksa ortadan en uzak alan. Kaygının düşük olduğu bir yan 3. haftaya seçilmez (üzerinde çalışmayı gerektirmez). Kaygının
 *    bir yanı yüksekse rehberdeki "Sınav kaygısı" yazısına bağlantı verilir; yetişkine de verilir (yazı sınav kaygısını
 *    anlatır, öneriler yetişkine de uyar).
 *  - Aynı sayfada bir öneri bir kez verilir: yavaş nefes yalnızca bedensel tepkilerde, endişeyi yazmak yalnızca endişede,
 *    takılan soruyu geçmek takılmada ve baş etme yollarında farklı adımlarla, kendine sakinleştirici söz söylemek yalnızca
 *    baş etme yollarında. Rapordaki kartlar öneri vermez.
 *  - Öğrenci metinleri okula özgü değildir ("sınav" testin konusudur): yetişkine de aynen gösterilir.
 */
const t = (student: string, parent: string, adult?: string): AudienceText => ({ student, parent, ...(adult ? { adult } : {}) });

const LINK = { label: 'Sınav kaygısı', href: '/rehber/sinav-kaygisi' };
const wb = (scale: string): Wellbeing => ({ scale, group: 'high', link: LINK });

export const sinavKaygisiRoadmap: RoadmapTemplate = {
  version: 'sinav-kaygisi-yol-haritasi-1',
  planningScale: 'prep',
  planningTitle: 'Sınava hazırlık',
  wellbeing: [wb('block'), wb('worry'), wb('body')],
  standoutFirst: [
    { scale: 'block', group: 'high' },
    { scale: 'worry', group: 'high' },
    { scale: 'body', group: 'high' },
  ],
  thirdWeekSkip: [
    { scale: 'worry', group: 'low' },
    { scale: 'body', group: 'low' },
    { scale: 'block', group: 'low' },
  ],
  unit: { one: 'alan', toPlural: 'alanlara' },
  balancedNote: t(
    'Beş alanda da puanın ortada: ne kaygının bir yanı ne de baş etme yollarından biri belirgin biçimde öne çıkıyor.',
    'Çocuğunuzun beş alanda da puanı ortada: ne kaygının bir yanı ne de baş etme yollarından biri belirgin biçimde öne çıkıyor.',
  ),
  studyIntro: t(
    'Aşağıda her alan için bir sonraki küçük adım var. Araştırmalarda herkes için en yararlı bulunan iki hazırlık yöntemi şunlardır: çalışmayı günlere yaymak ve öğrendiğini bakmadan hatırlamaya çalışmak. Önerilerin hepsini birden değil, birer birer dene.',
    'Aşağıda çocuğunuzun her alanı için bir sonraki küçük adım var. Araştırmalarda herkes için en yararlı bulunan iki hazırlık yöntemi şunlardır: çalışmayı günlere yaymak ve öğrendiğini bakmadan hatırlamaya çalışmak. Önerilerin hepsini birden değil, birer birer denemesine destek olun.',
  ),
  firstWeek: t(
    'Raporundaki beş alana bak. Bu hafta bir sınavdan ya da soru çözdüğün bir çalışmadan önce aklından geçen düşünceleri ve bedeninde hissettiklerini kısaca not et.',
    'Raporu çocuğunuzla birlikte okuyun ve hangi cümlelerin onu anlattığını sorun. Bu hafta yalnızca gözlem yapın: sınav yaklaşınca ne söylüyor, nasıl uyuyor, siz sınav hakkında neler söylüyorsunuz?',
  ),
  lastWeek: t(
    'Dört haftada yazdıklarına bak: sınavdan önceki düşüncelerin ve bedenindeki tepkiler değişti mi, hangi yol işine yaradı? İşe yarayanı sürdür.',
    'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  ),
  nextTests: ['erteleme-ve-zaman-yonetimi', 'calisma-aliskanliklari', 'zihniyet'],
  nextPurpose: {
    you: 'çalışmanla ilgili başka yönlerini de görmek',
    parent: 'çocuğunuzun çalışmasıyla ilgili başka yönlerini de görmek',
    general: true,
  },
  approach: {
    worry: {
      low: 'Sınavlar hakkında sakin konuşmayı sürdürün; sonucu değil, nasıl hazırlandığını sorun.',
      average: 'Sınav yaklaşınca “Seni en çok ne endişelendiriyor?” diye sorun ve cevabını düzeltmeye çalışmadan dinleyin.',
      high: '“Bu sınav her şeyi belirleyecek” gibi cümlelerden kaçının; sevginizin ve güveninizin sonuca bağlı olmadığını hissettirin.',
    },
    body: {
      low: 'Sınav günlerini olabildiğince sıradan bir gün gibi geçirmeye devam edin.',
      average: 'Heyecanlandığını söylediğinde “Korkacak bir şey yok” demek yerine heyecanın olağan olduğunu söyleyin.',
      high: 'Sınavdan önceki akşamı ve sabahı sakin tutun; son dakika tekrarları ve telaşlı uyarılar heyecanı artırabilir.',
    },
    block: {
      low: 'Sınavdan sonra yalnızca notu değil, sınavda nasıl hissettiğini de sorun.',
      average: 'Takıldığı bir sınavın ardından “Nerede takıldın, o an ne yaptın?” diye birlikte bakın; suçlamadan dinleyin.',
      high: 'Evde sınav gibi bir çalışma yapmak isterse süre tutarak eşlik edin; sonucu değil, takıldığında ne yaptığını konuşun.',
    },
    prep: {
      low: 'Sınav tarihlerini birlikte takvime yazın ve sınavdan önceki günlere kısa çalışma zamanları koymasına yardım edin.',
      average: 'Son güne bıraktığı sınavlarda onu neyin zorladığını sorun; planı onun yerine değil, onunla birlikte yapın.',
      high: 'Hazırlığını sonuçtan bağımsız olarak fark edip söyleyin; çalışırken onu sık sık bölmeyin.',
    },
    calm: {
      low: 'Kaygılandığında kullanabileceği yolları birlikte düşünün; siz de zorlandığınız bir anda size iyi gelen bir yolu anlatın.',
      average: 'İşe yarayan bir yolu fark ettiğinizde ona söyleyin; örneğin “Geçen sefer konuşmak iyi gelmişti” deyin.',
      high: 'Kaygısını paylaştığında hemen çözüm sunmak yerine önce ne hissettiğini anlamaya çalışın.',
    },
  },
  scales: {
    worry: {
      color: '#7a4ee6',
      study: {
        low: t(
          'Sınavları pek kafana takmaman, sınav dönemlerini daha rahat geçirmeni sağlayabilir. Büyük bir sınav yaklaşınca endişen artarsa aklına geleni kısaca bir kâğıda yazmak işine yarayabilir.',
          'Çocuğunuzun sınavları pek kafasına takmaması, sınav dönemlerini daha rahat geçirmesini sağlayabilir. Büyük bir sınav yaklaşınca endişesi artarsa aklına geleni kısaca bir kâğıda yazması işine yarayabilir.',
        ),
        average: t(
          'Endişenin hangi sınavlarda arttığını fark et: önemli bir sınavda mı, hazırlıksız hissettiğinde mi? Bunu bilmek, nereden başlayacağını gösterebilir.',
          'Çocuğunuzla endişesinin hangi sınavlarda arttığını konuşun: önemli bir sınavda mı, hazırlıksız hissettiğinde mi? Bunu bilmek, nereden başlanacağını gösterebilir.',
        ),
        high: t(
          'Endişeli bir düşünce geldiğinde onu bir soru gibi ele al: “Bunun olma ihtimali ne? Olursa ne yapabilirim?” Cevabı yazmak, düşünceyi zihninde döndürüp durmak yerine onunla bir kez yüzleşmeni sağlayabilir.',
          'Çocuğunuz endişeli bir düşünceyi bir soru gibi ele alabilir: “Bunun olma ihtimali ne? Olursa ne yapabilirim?” Cevabı yazmak, düşünceyi zihninde döndürüp durmak yerine onunla bir kez yüzleşmesini sağlayabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta sınavı düşünmenin seni yormadığı anlarda ne yaptığını fark et ve bir cümleyle yaz.',
          'Bu hafta çocuğunuzla, sınavları dert etmediği anlarda neler yaptığını konuşun.',
        ),
        average: t(
          'Bu hafta bir sınav yaklaşınca aklına en sık gelen endişeyi yaz; yanına “Olursa ne yapabilirim?” sorusunun cevabını ekle.',
          'Bu hafta çocuğunuz bir sınav yaklaşınca aklına en sık gelen endişeyi yazsın; isterse “Olursa ne yapabilirim?” sorusunu birlikte cevaplayın.',
        ),
        high: t(
          'Bu hafta önemli bir sınavdan önceki akşam ya da sabah birkaç dakika ayır ve endişelerini bir kâğıda yaz. Bir deneyde işe yaramış, bir tekrar çalışmasında aynı etki görülmemiş; sana iyi gelip gelmediğine sen karar ver.',
          'Bu hafta çocuğunuz önemli bir sınavdan önceki akşam ya da sabah birkaç dakika ayırıp endişelerini bir kâğıda yazsın; yazdıklarını okumanız gerekmez. Bir deneyde işe yaramış, bir tekrar çalışmasında aynı etki görülmemiş; ona iyi gelip gelmediğini birlikte görün.',
        ),
      },
    },
    body: {
      color: '#df4777',
      study: {
        low: t(
          'Bedeninin sınavlarda genellikle rahat kalması sana kolaylık sağlıyor. Heyecan bir gün artarsa yavaş nefes almak gibi kısa bir yol işine yarayabilir.',
          'Çocuğunuzun bedeninin sınavlarda genellikle rahat kalması ona kolaylık sağlıyor. Heyecan bir gün artarsa yavaş nefes almak gibi kısa bir yol işine yarayabilir.',
        ),
        average: t(
          'Bedenindeki heyecan çoğu zaman bir tehlike işareti değil, bedeninin önemli bir duruma hazırlanmasıdır. Heyecanı “kötü gidecek” diye değil, “bu heyecan bana yardım edebilir” diye yorumlamayı deneyebilirsin.',
          'Çocuğunuzun bedenindeki heyecan çoğu zaman bir tehlike işareti değil, bedeninin önemli bir duruma hazırlanmasıdır. Heyecanı “kötü gidecek” diye değil, “bu heyecan bana yardım edebilir” diye yorumlamayı deneyebilir.',
        ),
        high: t(
          'Gerildiğinde yavaş nefes almak bedendeki heyecanı yatıştırmanın kısa bir yoludur: nefesini alırken değil, verirken biraz uzat ve birkaç kez tekrarla. Bunu önce sakin bir anda denemek, sınavda hatırlamanı kolaylaştırabilir.',
          'Gerildiğinde yavaş nefes almak, çocuğunuzun bedenindeki heyecanı yatıştırmanın kısa bir yoludur: nefesini verirken biraz uzatıp bunu birkaç kez tekrarlayabilir. Önce sakin bir anda denemesi, sınavda hatırlamasını kolaylaştırabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta bir sınavda bedeninin nasıl hissettiğini kısaca not et.',
          'Bu hafta çocuğunuzla, sınavda bedeninin nasıl hissettiğini kısaca konuşun.',
        ),
        average: t(
          'Bu hafta bir sınavdan önce heyecanı bedeninde hissettiğinde kendine “Bu heyecan bana yardım edebilir” de ve sonra nasıl hissettiğini yaz.',
          'Bu hafta çocuğunuz bir sınavdan önce heyecanı bedeninde hissettiğinde kendine “Bu heyecan bana yardım edebilir” desin; sonra nasıl hissettiğini konuşun.',
        ),
        high: t(
          'Bu hafta her akşam sakin bir anda üç dakika yavaş nefes almayı dene; bir sınavda gerildiğinde aynı nefesi kullan.',
          'Bu hafta çocuğunuz her akşam sakin bir anda üç dakika yavaş nefes almayı denesin; bir sınavda gerildiğinde aynı nefesi kullanabilir.',
        ),
      },
    },
    block: {
      color: '#2f5ce0',
      study: {
        low: t(
          'Sınav sırasında dikkatini sorularda tutabilmen işine yarıyor. Zor bir soruda takıldığında onu işaretleyip sonraya bırakmak bu alışkanlığı korumana yardım edebilir.',
          'Çocuğunuzun sınav sırasında dikkatini sorularda tutabilmesi işine yarıyor. Zor bir soruda takıldığında onu işaretleyip sonraya bırakması bu alışkanlığı korumasına yardım edebilir.',
        ),
        average: t(
          'Takıldığın sınavlara bak: soru mu zordu, yoksa kaygın mı arttı? Soru zorsa onu işaretleyip geçmek, kaygın arttıysa birkaç saniye kalemi bırakıp yeniden soruya dönmek işine yarayabilir.',
          'Çocuğunuzla takıldığı sınavlara bakın: soru mu zordu, yoksa kaygısı mı arttı? Soru zorsa onu işaretleyip geçmek, kaygısı arttıysa birkaç saniye kalemi bırakıp yeniden soruya dönmek işine yarayabilir.',
        ),
        high: t(
          'Sınavda aklın kaygılarına kaydığında kalemi birkaç saniye bırak, bir nefes al ve gözünü sorunun ilk satırına geri çevir. Bu kısa ara, dikkatini yeniden soruya toplamana yardım edebilir.',
          'Çocuğunuz sınavda aklı kaygılarına kaydığında kalemi birkaç saniye bırakıp bir nefes alabilir ve gözünü sorunun ilk satırına geri çevirebilir. Bu kısa ara, dikkatini yeniden soruya toplamasına yardım edebilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta bir sınavda takıldığın bir soru olursa onu işaretleyip sonraya bırakmayı dene.',
          'Bu hafta çocuğunuz bir sınavda takıldığı bir soru olursa onu işaretleyip sonraya bırakmayı denesin.',
        ),
        average: t(
          'Bu hafta soru çözerken takıldığın her soruda ne olduğunu kısaca yaz: konu muydu, dikkat miydi?',
          'Bu hafta çocuğunuz soru çözerken takıldığı her soruda ne olduğunu kısaca yazsın: konu muydu, dikkat miydi?',
        ),
        high: t(
          'Bu hafta bir kez sınav gibi çalış: süre tut, notlarına bakma, takıldığın soruyu geçip sonra ona dön.',
          'Bu hafta çocuğunuz bir kez sınav gibi çalışsın: süre tutsun, notlarına bakmasın, takıldığı soruyu geçip sonra ona dönsün.',
        ),
      },
    },
    prep: {
      color: '#0e9c8c',
      study: {
        low: t(
          'Hazırlığı küçük parçalara bölmek başlamayı kolaylaştırabilir: sınavdan önceki günlerde her gün kısa bir süre çalış. Başlamak istemediğinde “Yalnızca on dakika” diyerek masaya oturabilirsin.',
          'Hazırlığı küçük parçalara bölmek çocuğunuzun başlamasını kolaylaştırabilir: sınavdan önceki günlerde her gün kısa bir süre çalışabilir. Başlamak istemediğinde “Yalnızca on dakika” diyerek masaya oturabilir.',
        ),
        average: t(
          'Hazırlandığın sınavlarla son güne bıraktıklarını karşılaştır: fark konudan mı, o dönemdeki yoğunluktan mı geliyor? Son güne bıraktığın türden bir sınav için bir hafta önceden plan yap.',
          'Çocuğunuzla, hazırlandığı sınavlarla son güne bıraktıklarını karşılaştırın: fark konudan mı, o dönemdeki yoğunluktan mı geliyor? Son güne bıraktığı türden bir sınav için bir hafta önceden plan yapabilir.',
        ),
        high: t(
          'Hazırlık alışkanlıkların sınavlarda sana güç veriyor. Kendini sınarken yanlış yaptığın soruları ayırıp birkaç gün sonra yeniden çözmek, bu alışkanlıkları bir adım ileri taşıyabilir.',
          'Çocuğunuzun hazırlık alışkanlıkları sınavlarda ona güç veriyor. Kendini sınarken yanlış yaptığı soruları ayırıp birkaç gün sonra yeniden çözmesi, bu alışkanlıkları bir adım ileri taşıyabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta yaklaşan bir sınav için takvime üç kısa çalışma zamanı yaz ve en az birini yap.',
          'Bu hafta çocuğunuz yaklaşan bir sınav için takvime üç kısa çalışma zamanı yazsın ve en az birini yapsın.',
        ),
        average: t(
          'Bu hafta bir sınava çalışırken her çalışmanın sonunda notlarına bakmadan beş soru çöz ya da konuyu kendine anlat.',
          'Bu hafta çocuğunuz bir sınava çalışırken her çalışmanın sonunda notlarına bakmadan beş soru çözsün ya da konuyu kendine anlatsın.',
        ),
        high: t(
          'Bu hafta yanlış yaptığın soruları bir kâğıda topla ve üç gün sonra yeniden çöz.',
          'Bu hafta çocuğunuz yanlış yaptığı soruları bir kâğıda toplasın ve üç gün sonra yeniden çözsün.',
        ),
      },
    },
    calm: {
      color: '#d28a14',
      study: {
        low: t(
          'Kaygılandığında kullanabileceğin birkaç yol seç ve bir kâğıda yaz: güvendiğin biriyle konuşmak, kendine “Elimden geleni yapacağım” demek gibi. Yollar elinin altında olunca gerildiğinde hatırlamak kolaylaşır.',
          'Çocuğunuz kaygılandığında kullanabileceği birkaç yolu seçip bir kâğıda yazabilir: güvendiği biriyle konuşmak, kendine “Elimden geleni yapacağım” demek gibi. Yollar elinin altında olunca gerildiğinde hatırlamak kolaylaşır.',
        ),
        average: t(
          'Hangi yolun işine yaradığını fark et: kaygılandığında konuşmak mı, kendine sakinleştirici bir söz söylemek mi? İşe yarayanı büyük bir sınavdan önce bilerek kullanabilirsin.',
          'Çocuğunuzla hangi yolun işine yaradığını konuşun: kaygılandığında konuşmak mı, kendine sakinleştirici bir söz söylemek mi? İşe yarayanı büyük bir sınavdan önce bilerek kullanabilir.',
        ),
        high: t(
          'Baş etme yollarını sık kullanman sana güç veriyor. Bu yollardan hangisinin en çok işe yaradığını not etmek, büyük bir sınav öncesinde ona öncelik vermeni kolaylaştırabilir.',
          'Çocuğunuzun baş etme yollarını sık kullanması ona güç veriyor. Bu yollardan hangisinin en çok işe yaradığını not etmesi, büyük bir sınav öncesinde ona öncelik vermesini kolaylaştırabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta gerildiğin bir an olursa listendeki yollardan birini dene ve sonra nasıl hissettiğini yaz.',
          'Bu hafta çocuğunuz gerildiği bir an olursa listesindeki yollardan birini denesin; sonra nasıl hissettiğini konuşun.',
        ),
        average: t(
          'Bu hafta bir sınavdan önce kendine söyleyeceğin kısa, sakinleştirici bir cümle seç ve sınav sabahı onu kendine söyle.',
          'Bu hafta çocuğunuz bir sınavdan önce kendine söyleyeceği kısa, sakinleştirici bir cümle seçsin ve sınav sabahı onu kendine söylesin.',
        ),
        high: t(
          'Bu hafta seni en çok rahatlatan yolu bir sınavdan önce bilerek kullan ve sonra nasıl hissettiğini yaz.',
          'Bu hafta çocuğunuz onu en çok rahatlatan yolu bir sınavdan önce bilerek kullansın; sonra nasıl hissettiğini konuşun.',
        ),
      },
    },
  },
  sources: [KAYNAK.ramirezBeilock2011, KAYNAK.camerer2018, KAYNAK.jamieson2010, KAYNAK.huntley2019, KAYNAK.ergene2003, KAYNAK.dunlosky],
};
