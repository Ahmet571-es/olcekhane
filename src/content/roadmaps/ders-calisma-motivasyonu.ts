import { KAYNAK } from './kaynaklar';
import type { AudienceText, RoadmapTemplate } from './types';

/**
 * Ders Çalışma Motivasyonu: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öz-belirleme kuramına göre motivasyon, kişinin bir işin önemini kendisi gördüğünde ve kendini yeterli hissettiğinde
 *    "kendi isteğine" yaklaşır; anlamlı gerekçe, özerklik ve yakınlık desteği bunu kolaylaştırır (benimsemeyi artırır); başarıya bağlı somut
 *    ödüller ve baskılı değerlendirme merakı azaltabilir (Ryan ve Deci, 2000; Bureau ve ark., 2022). Öneriler bu yüzden
 *    kendi nedenini bulmaya, küçük ve başarılabilir hedeflere ve baskının yerine anlamın konmasına dayanır.
 *  - Etkili çalışma yolları herkes için aynıdır (bakmadan hatırlamak, tekrarları günlere yaymak; Dunlosky ve ark., 2013);
 *    motivasyon türleri bu yolların nasıl sürdürüleceğine ipucu verir.
 *  - 2. hafta "Neden önemli?" (önemini görme): kurama göre benimsemenin anahtarı. 3. hafta isteksizlik yüksekse ona, değilse
 *    iç baskı yüksekse ona (bağlantı: Sınav kaygısı) ayrılır; ikisi de değilse ortadan en uzak tür.
 *  - Bu test meslek ortamı anlatmadığı için ortamlar bölümü yoktur. Yetişkinlere açık değildir.
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

export const dersCalismaMotivasyonuRoadmap: RoadmapTemplate = {
  version: 'ders-calisma-motivasyonu-yol-haritasi-1',
  planningScale: 'identified',
  planningTitle: 'Neden önemli?',
  wellbeing: [
    { scale: 'amotivation', group: 'high', link: null },
    { scale: 'introjected', group: 'high' },
  ],
  studyIntro: t(
    'Araştırmalara göre herkes için en etkili çalışma yolları aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Motivasyonun, bu yolları sürdürmeni kolaylaştırabilir ya da zorlaştırabilir. Aşağıda her motivasyon türün için bir öneri var; hepsini birden değil, birer birer dene.',
    'Araştırmalara göre herkes için en etkili çalışma yolları aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Motivasyon, bu yolların sürdürülmesini kolaylaştırabilir ya da zorlaştırabilir. Aşağıda çocuğunuzun her motivasyon türü için bir öneri var; hepsini birden değil, birer birer denemesine destek olun.',
  ),
  firstWeek: t(
    'Raporundaki beş motivasyon türüne bak. Bu hafta her çalışmaya başlarken “Şu an neden çalışıyorum?” diye sor ve cevabını (merak, önemini görme, iç baskı, dış baskı ya da hiçbiri) bir deftere kısaca yaz.',
    'Raporu çocuğunuzla birlikte okuyun ve hangi cümlelerin onu anlattığını sorun. Bu hafta yalnızca gözlem yapın: onu hangi durumlarda istekle, hangilerinde baskıyla çalışırken görüyorsunuz?',
  ),
  lastWeek: t(
    'Dört haftada defterine yazdıklarına bak: hangi nedenler çoğaldı, hangileri azaldı? İşe yarayanı sürdür.',
    'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  ),
  nextTests: ['calisma-aliskanliklari', 'ogrenme-ve-basari-ozellikleri'],
  nextPurpose: { you: 'nasıl çalıştığını da görmek', parent: 'çocuğunuzun nasıl çalıştığını da görmek' },
  approach: {
    intrinsic: {
      low: 'İlgi duyduğu konuları sorun ve bu konularla dersler arasında bağ kurmasına yardım edin; başarıya bağlı ödüllerden kaçının.',
      average: 'Merak ettiği soruları ciddiye alın ve cevabını birlikte arayın.',
      high: 'Merakını ödülle değil ilgiyle karşılayın: ne öğrendiğini sorun ve dinleyin.',
    },
    identified: {
      low: 'Bir dersin neden önemli olduğunu anlamlı bir gerekçeyle paylaşın ve onun ne düşündüğünü sorun.',
      average: 'Önemini göremediği dersler hakkında, onu ikna etmeye çalışmadan düşüncesini sorun.',
      high: 'Hedeflerini onunla konuşun; bu hedeflerin onun kendi seçimi olduğunu hissettirin.',
    },
    introjected: {
      low: 'Notları onun değeriyle karıştırmadan konuşmayı sürdürün.',
      average: 'Notları ne olursa olsun onun sizin için değerli olduğunu hissettirin.',
      high: 'Hatalarına sakin yaklaşın, notları onun değeriyle karıştırmayın; kaygısı günlük hayatını zorlaştırıyorsa okulun rehberlik servisine ya da bir psikolojik danışmana başvurun.',
    },
    external: {
      low: 'Ödül ve ceza yerine anlamlı gerekçeler paylaşmayı sürdürün.',
      average: 'Ödül yerine anlamlı bir gerekçe paylaşmayı ve onun görüşüne alan bırakmayı deneyin.',
      high: 'Ödül, ceza ve denetimi azaltıp yerine anlamlı gerekçeleri ve onun seçimlerini koymayı deneyin.',
    },
    amotivation: {
      low: 'Ders çalışmanın ona kazandırabileceklerini onunla ara sıra konuşun.',
      average: 'Yapabildiği küçük şeyleri fark edin ve ona söyleyin.',
      high: 'Onu yargılamadan dinleyin; başarabileceği küçük hedefler koymasına yardım edin ve gerekirse okulun rehberlik servisiyle ya da bir psikolojik danışmanla görüşün.',
    },
  },
  scales: {
    intrinsic: {
      color: '#ee6a36',
      study: {
        high: t(
          'Merakın güçlü bir yakıt. İlgini çeken konularda derinleşirken öğrendiklerini kitaba bakmadan hatırlamaya çalışmayı da ekle; keyif aldığın konularda kendini sınamak daha kolay gelebilir. Merakını sıkıcı bulduğun derslere taşımak için onları sevdiğin konularla ilişkilendir.',
          'Çocuğunuzun merakı güçlü bir yakıt. İlgisini çeken konularda derinleşirken öğrendiklerini kitaba bakmadan hatırlamaya çalışması öğrendiklerini daha kalıcı yapabilir. Merakını ödülle değil, sorularını ciddiye alarak besleyin.',
        ),
        average: t(
          'İlgini çeken konularla başla: çalışmanın ilk dakikalarını sevdiğin bir konuya ayırmak başlamayı kolaylaştırabilir. Sıkıcı bulduğun bir konuyu çalışırken “Bu neden böyle?” diye sormak onu merak edilecek bir soruya çevirebilir.',
          'Çocuğunuz çalışmanın ilk dakikalarını sevdiği bir konuya ayırırsa başlamak ona daha kolay gelebilir. Sıkıcı bulduğu bir konuyu çalışırken “Bu neden böyle?” diye sorması, konuyu merak edilecek bir soruya çevirebilir.',
        ),
        low: t(
          'Merak, bir konuyu anlamaya başladıkça gelebilir. Kısa bir çalışmada bir konunun yalnızca bir parçasını anlamaya çalış ve “Bu neden böyle?” diye sor. Gündelik hayattan bir örnek bulmak konuyu sana yakınlaştırabilir.',
          'Merak, bir konu anlaşılmaya başladıkça gelebilir. Çocuğunuzun kısa bir çalışmada bir konunun yalnızca bir parçasını anlamaya çalışması ve konuyu gündelik hayattan bir örnekle ilişkilendirmesi, konuyu ona yakınlaştırabilir.',
        ),
      },
      action: {
        high: t(
          'Bu hafta ilgini çeken bir konuda ders kitabının ötesine geç: bir soru belirle, cevabını araştır ve öğrendiğini bir büyüğüne anlat.',
          'Bu hafta çocuğunuzdan ilgisini çeken bir konuda merak ettiği bir soruyu araştırmasını ve öğrendiğini size anlatmasını isteyin; dinleyin ve soru sorun.',
        ),
        average: t(
          'Bu hafta her çalışmaya ilgini çeken bir konudan 5 dakikayla başla; sonra öteki konulara geç.',
          'Bu hafta çocuğunuz her çalışmaya ilgisini çeken bir konudan 5 dakikayla başlasın; sonra öteki konulara geçsin.',
        ),
        low: t(
          'Bu hafta sıkıcı bulduğun bir konu için gündelik hayattan bir örnek bul ve bir büyüğüne anlat.',
          'Bu hafta çocuğunuzla sıkıcı bulduğu bir konu için gündelik hayattan bir örnek arayın ve onun anlatmasını dinleyin.',
        ),
      },
    },
    identified: {
      color: '#d28a14',
      study: {
        high: t(
          'Neden çalıştığını biliyorsun; bu, sıkıcı konularda da sürdürmeni kolaylaştırabilir. Hedefini çalışma planına bağla: haftalık planının başına, bu çalışmanın seni hedefine nasıl yaklaştırdığını tek cümleyle yaz.',
          'Çocuğunuz neden çalıştığını biliyor; bu, sıkıcı konularda da sürdürmesini kolaylaştırabilir. Haftalık planının başına, çalışmanın onu hedefine nasıl yaklaştırdığını tek cümleyle yazması bu bağı canlı tutar.',
        ),
        average: t(
          'Önemini gördüğün derslerde çalışmak sana daha kolay gelebilir. Önemini göremediğin bir derse çalışmaya başlamadan önce kendine “Bu bana ne kazandırabilir?” diye sor ve cevabını defterinin başına yaz.',
          'Önemini gördüğü derslerde çalışmak çocuğunuza daha kolay gelebilir. Önemini göremediği bir derse başlamadan önce “Bu bana ne kazandırabilir?” sorusunun cevabını defterinin başına yazması işe yarayabilir.',
        ),
        low: t(
          'Çalışmanın sana ne kazandıracağını bulmak iyi bir ilk adım olabilir. Bir dersin sana kazandırabileceklerini (bir beceri, bir hedef, bir bakış açısı) düşün ve bir kâğıda yaz. Bunu bir büyüğüne ya da öğretmenine sormak da işe yarayabilir; ama son cevap senin cevabın olmalı.',
          'Çalışmanın kendisine ne kazandıracağını bulmak, çocuğunuz için iyi bir ilk adım olabilir. Bir dersin ona kazandırabileceklerini (bir beceri, bir hedef, bir bakış açısı) birlikte konuşun; anlamlı bir gerekçe paylaşın, ama son cevabı onun bulmasına alan bırakın.',
        ),
      },
      action: {
        high: t(
          'Bu hafta hedefini tek cümleyle yaz ve çalışma yerine as; her çalışmada o cümleye bir kez bak.',
          'Bu hafta çocuğunuzdan hedefini tek cümleyle yazıp çalışma yerine asmasını isteyin.',
        ),
        average: t(
          'Bu hafta önemini göremediğin bir ders için “Bu bana ne kazandırabilir?” sorusuna üç cevap yaz.',
          'Bu hafta çocuğunuzdan önemini göremediği bir ders için “Bu bana ne kazandırabilir?” sorusuna üç cevap yazmasını isteyin; cevaplarını yargılamadan dinleyin.',
        ),
        low: t(
          'Bu hafta bir büyüğüne ya da öğretmenine bir dersin hayatta ona ne kazandırdığını sor; sonra kendi cevabını yaz.',
          'Bu hafta çocuğunuza okuldaki bir dersin hayatınızda size ne kazandırdığını anlatın; sonra onun kendi cevabını yazmasını isteyin.',
        ),
      },
    },
    introjected: {
      color: '#7a4ee6',
      study: {
        high: t(
          'İç baskı çok çalıştırabilir; ama araştırmalarda kaygıyla birlikte görülüyor. Çalışma hedefini “hata yapmamak” yerine “öğrenmek” üzerine kur: bir çalışmanın sonunda “ne kadar iyi görünüyorum?” diye değil, “ne öğrendim?” diye sor. Kendini sınarken bilemediğin sorular bir başarısızlık değil, tekrar etmen gereken yerleri gösteren işaretlerdir.',
          'İç baskı çok çalıştırabilir; ama araştırmalarda kaygıyla birlikte görülüyor. Çocuğunuzun çalışma hedefini “hata yapmamak” yerine “öğrenmek” üzerine kurmasına yardım edin: çalışmanın sonunda notunu değil, ne öğrendiğini sorun. Kendini sınarken bilemediği sorular bir başarısızlık değil, tekrar etmesi gereken yerleri gösteren işaretlerdir.',
        ),
        average: t(
          'Bazen hissettiğin iç baskıyı fark et: “çalışmalıyım” yerine “bunu öğrenmek istiyorum, çünkü…” diye başlayan bir cümle kur. Kendini sınarken bilemediğin sorular, tekrar etmen gereken yerleri gösterir.',
          'Çocuğunuzun bazen hissettiği iç baskıyı fark etmesine yardım edin: “çalışmalıyım” yerine “bunu öğrenmek istiyorum, çünkü…” diye başlayan bir cümle kurmak baskının yerine anlamı koymaya yardım edebilir.',
        ),
        low: t(
          'Kendine baskı yapmadan çalışabiliyorsun. Bunu, kendini sınarken rahatça yanlış yapabilmek için kullanabilirsin: bilemediğin sorular tekrar etmen gereken yerleri gösterir.',
          'Çocuğunuz kendine baskı yapmadan çalışabiliyor. Bu, kendini sınarken rahatça yanlış yapabilmesini kolaylaştırabilir: bilemediği sorular tekrar etmesi gereken yerleri gösterir.',
        ),
      },
      action: {
        high: t(
          'Bu hafta her çalışmanın sonunda “Ne öğrendim?” sorusuna bir cümle yaz; “Ne kadar iyi yaptım?” sorusunu bir haftalığına bırak.',
          'Bu hafta çocuğunuza notları yerine ne öğrendiğini sorun; hatalarına sakin ve meraklı yaklaşın.',
        ),
        average: t(
          'Bu hafta “çalışmalıyım” dediğin her seferde cümleyi “… öğrenmek istiyorum, çünkü …” diye yeniden kur.',
          'Bu hafta çocuğunuzla “çalışmalısın” yerine “bunu neden öğrenmek isteyebilirsin?” diye konuşmayı deneyin.',
        ),
        low: t(
          'Bu hafta kendini sınarken bilemediğin soruları bir listeye yaz; liste, tekrar etmen gereken yerleri gösterir.',
          'Bu hafta çocuğunuzdan kendini sınarken bilemediği soruları bir listeye yazmasını isteyin; liste tekrar edeceği yerleri gösterir.',
        ),
      },
    },
    external: {
      color: '#2f5ce0',
      study: {
        high: t(
          'Ödül ya da ceza için yaptığın çalışmaya kendi nedenini ekle: başlamadan önce “Bu konuyu öğrenmek bana ne kazandırır?” diye sor. Çalışmanın zamanını ve sırasını mümkün olduğunca kendin seç.',
          'Çocuğunuzun ödül ya da ceza için yaptığı çalışmaya kendi nedenini eklemesine yardım edin: başlamadan önce “Bu konuyu öğrenmek sana ne kazandırır?” diye sorun. Çalışmanın zamanını ve sırasını mümkün olduğunca onun seçmesine izin verin.',
        ),
        average: t(
          'Ödül ya da ceza bazen işe yarıyor; ama çalışmanı onlara bağlı bırakma. Haftada bir dersi yalnızca kendi nedenin için çalış ve nasıl hissettirdiğine bak.',
          'Ödül ya da ceza bazen işe yarıyor; ama çalışmanın onlara bağlı kalmaması önemli. Çocuğunuzun haftada bir dersi yalnızca kendi nedeni için çalışmasına alan açın.',
        ),
        low: t(
          'Seni çalıştıran şey dışarıdan gelmiyor; bu iyi bir zemin. Kendi nedenlerini net tutmak için hedeflerini ara sıra yazıya dök.',
          'Çocuğunuzu çalıştıran şey dışarıdan gelmiyor; bu iyi bir zemin. Hedeflerini ara sıra yazıya dökmesi kendi nedenlerini net tutmasına yardım edebilir.',
        ),
      },
      action: {
        high: t(
          'Bu hafta bir çalışmanın zamanını ve sırasını kendin seç ve planını bir büyüğüne anlat.',
          'Bu hafta çocuğunuzun bir çalışmanın zamanını ve sırasını kendisinin seçmesine izin verin; ödül ya da ceza konuşmadan planını dinleyin.',
        ),
        average: t(
          'Bu hafta bir dersi ödül ya da ceza düşünmeden, yalnızca kendi nedenin için çalış; sonunda nasıl hissettirdiğini not et.',
          'Bu hafta çocuğunuz bir dersi ödül ya da ceza konuşulmadan, yalnızca kendi nedeni için çalışsın; sonunda nasıl hissettirdiğini konuşun.',
        ),
        low: t(
          'Bu hafta kendi çalışma nedenlerini üç madde hâlinde yaz ve çalışma yerine as.',
          'Bu hafta çocuğunuzdan kendi çalışma nedenlerini üç madde hâlinde yazmasını isteyin.',
        ),
      },
    },
    amotivation: {
      color: '#0e9c8c',
      study: {
        high: t(
          'Ders çalışmak şu sıralar anlamsız geliyorsa büyük planlar yerine çok küçük bir adımla başla: bir konu, 15 dakika, sonunda kitaba bakmadan hatırladığın üç şey. Yapabildiğini görmek isteğin geri gelmesine yardım edebilir. Bu duyguyu güvendiğin bir yetişkinle ya da bir rehber öğretmenle paylaşmak da yükü hafifletebilir.',
          'Ders çalışmak çocuğunuza şu sıralar anlamsız geliyorsa büyük planlar yerine çok küçük adımlar işe yarayabilir: bir konu, 15 dakika, sonunda kitaba bakmadan hatırladığı üç şey. Yapabildiğini görmek isteğin geri gelmesine yardım edebilir; onu yargılamadan dinlemek de yükü hafifletebilir.',
        ),
        average: t(
          'Anlamı sorguladığın günlerde küçük ve başarabileceğin bir hedef koy: “Bugün şu konunun yalnızca ilk kısmını anlayacağım.” Hedefine ulaştığında bunu fark et.',
          'Çocuğunuz anlamı sorguladığı günlerde küçük ve başarabileceği bir hedef koyabilir (“Bugün şu konunun yalnızca ilk kısmını anlayacağım”). Hedefine ulaştığında bunu birlikte fark edin.',
        ),
        low: t(
          'Ders çalışmayı anlamsız bulmuyorsun. Zor günlerde hatırlamak için ders çalışmanın sana kazandırabileceği bir şeyi planının başına yazabilirsin.',
          'Çocuğunuz ders çalışmayı anlamsız bulmuyor. Zor günlerde hatırlamak için ders çalışmanın ona kazandırabileceği bir şeyi planının başına yazabilir.',
        ),
      },
      action: {
        high: t(
          'Bu hafta her gün 15 dakikalık tek bir çalışma yap: bir konu, sonunda kitaba bakmadan hatırladığın üç şey. Hafta sonunda yaptıklarını say ve bir büyüğüne anlat.',
          'Bu hafta çocuğunuzla her gün 15 dakikalık küçük bir çalışma hedefi belirleyin ve yapabildiklerini birlikte fark edin; hafta sonunda nasıl hissettiğini konuşun.',
        ),
        average: t(
          'Bu hafta her gün kesinlikle başarabileceğin küçük bir hedef koy ve akşam olunca tutup tutmadığını işaretle.',
          'Bu hafta çocuğunuz her gün başarabileceği küçük bir hedef koysun; akşamları birlikte bakın.',
        ),
        low: t(
          'Bu hafta ders çalışmanın sana kazandırabileceği bir şeyi tek cümleyle yaz; zorlandığın bir anda o cümleye bak.',
          'Bu hafta çocuğunuzdan ders çalışmanın ona kazandırabileceği bir şeyi tek cümleyle yazmasını isteyin; zorlandığı bir anda o cümleyi hatırlatın.',
        ),
      },
    },
  },
  sources: [KAYNAK.ryanDeci, KAYNAK.vansteenkiste, KAYNAK.bureau, KAYNAK.dunlosky],
};
