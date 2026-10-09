import { KAYNAK } from './kaynaklar';
import type { AudienceText, RoadmapTemplate } from './types';

/**
 * Çocuk Kişilik Profili (3–5. sınıf): gelişim yol haritası metinleri.
 *
 * İlkeler (Beş Faktör yol haritasıyla aynı, 8–11 yaşındaki çocuklara ve velilerine göre):
 *  - Etkili çalışma yolları herkes için aynıdır (bakmadan hatırlamak, tekrarları günlere yaymak; Dunlosky ve ark., 2013).
 *    Kişilik bu yolların hangi düzende kullanılacağına ipucu verir; "kişiliğine uygun öğrenme yolu" vaat edilmez.
 *  - Bu yaşta okul ve meslek planı konuşulmaz: ortamlar bölümü yoktur.
 *  - Sakinlik düşükken 3. hafta iyi oluşa ayrılır (her akşam gününü bir yetişkinle konuşmak); rehber yazısı bağlantısı
 *    verilmez (sitedeki sınav kaygısı yazısı daha büyük öğrencilere yazılmıştır).
 *  - Öneriler çocuğun yalnız başına değil, ailesiyle birlikte yapabileceği küçük adımlardır. Uçlar iyi ya da kötü değildir.
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

export const cocukKisilikRoadmap: RoadmapTemplate = {
  version: 'cocuk-kisilik-yol-haritasi-1',
  planningScale: 'conscientiousness',
  wellbeing: { scale: 'emotional_stability', group: 'low', link: null },
  studyIntro: t(
    'Araştırmalara göre herkes için en işe yarayan çalışma yolları aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Kişiliğin, bu yolları nasıl kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    'Araştırmalara göre herkes için en işe yarayan çalışma yolları aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun kişiliği, bu yolları nasıl kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
  ),
  firstWeek: t(
    'Raporunu ailenle birlikte oku. Bu hafta hangi cümlelerin seni gerçekten anlattığını düşün ve aklına gelen bir örneği ailene anlat.',
    'Raporu çocuğunuzla birlikte okuyun ve ona hangi cümlelerin kendisini anlattığını sorun. Bu hafta yalnızca birlikte gözlem yapın; hemen bir şeyi değiştirmeye çalışmayın.',
  ),
  lastWeek: t(
    'Dört haftada neyin işine yaradığını ailenle konuş; işe yarayanı sürdür.',
    'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  ),
  nextTests: ['kelime-listesi-hatirlama', 'sekil-akil-yurutme'],
  nextPurpose: { you: 'kendini başka yönlerden de tanımak', parent: 'çocuğunuzu başka yönlerden de tanımak' },
  scales: {
    extraversion: {
      color: '#ee6a36',
      study: {
        high: t(
          'Başkalarıyla birlikte olmak seni canlandırıyor. Bunu çalışırken de kullanabilirsin: ailenden biriyle ya da bir arkadaşınla kitapları kapatıp birbirinize sırayla soru sorun. Cevabını bilemediğin soru, tekrar etmen gereken yerdir.',
          'Çocuğunuzu başkalarıyla birlikte olmak canlandırıyor olabilir. Bunu çalışırken de kullanabilir: kitaplar kapalıyken birbirinize sırayla soru sormanız ya da öğrendiğini size anlatması, onun için keyifli bir tekrar olabilir.',
        ),
        average: t(
          'Bazen yalnız, bazen birileriyle çalışmak sana iyi gelebilir. Yeni bir konuyu önce tek başına çalış, sonra kitabı kapatıp ailenden birine anlatarak tekrar et.',
          'Çocuğunuza bazen yalnız, bazen birileriyle çalışmak iyi gelebilir. Yeni bir konuyu önce tek başına çalışıp sonra kitabı kapatarak size anlatması iyi bir tekrar olur.',
        ),
        low: t(
          'Sessiz bir köşede çalışmak sana iyi gelebilir. Kendine hep aynı, sakin bir çalışma yeri seç. Çalışmanın sonunda kitabı kapatıp öğrendiklerini kendine yüksek sesle anlatmak, tek başına tekrar etmenin iyi bir yoludur.',
          'Çocuğunuza sessiz bir köşede çalışmak iyi gelebilir. Evde hep aynı, sakin bir çalışma yeri bunu destekler. Çalışmanın sonunda kitabı kapatıp öğrendiklerini kendine yüksek sesle anlatması, tek başına tekrar etmenin iyi bir yoludur.',
        ),
      },
      action: {
        high: t(
          'Bu hafta ailenden biriyle ya da bir arkadaşınla 10 dakikalık bir soru-cevap oyunu oyna: kitaplar kapalı, sırayla birbirinize soru sorun.',
          'Bu hafta çocuğunuzla 10 dakikalık bir soru-cevap oyunu oynayın: kitaplar kapalı, o gün öğrendiği konudan sırayla birbirinize soru sorun.',
        ),
        average: t(
          'Bu hafta bir konuyu önce tek başına çalış, sonra kitabı kapatıp ailenden birine 5 dakikada anlat.',
          'Bu hafta çocuğunuzdan bir konuyu önce tek başına çalışmasını, sonra kitabı kapatıp size 5 dakikada anlatmasını isteyin.',
        ),
        low: t(
          'Bu hafta az konuştuğun bir arkadaşına küçük bir soru sor (örneğin “En sevdiğin oyun hangisi?”); akşam ailene nasıl geçtiğini anlat.',
          'Bu hafta çocuğunuzu az konuştuğu bir arkadaşına küçük bir soru sormaya (ör. “En sevdiğin oyun hangisi?”) cesaretlendirin ve akşam nasıl geçtiğini birlikte konuşun.',
        ),
      },
    },
    agreeableness: {
      color: '#df4777',
      study: {
        high: t(
          'Başkalarına yardım etmeyi seviyorsun. Bir arkadaşına zorlandığı bir konuyu anlatmak ona yardım eder; bakmadan anlatmak senin için de iyi bir tekrar olur.',
          'Çocuğunuz başkalarına yardım etmeyi seviyor. Bir arkadaşına zorlandığı bir konuyu anlatması ona yardım eder; bakmadan anlatmak çocuğunuz için de iyi bir tekrar olur.',
        ),
        average: t(
          'Bir arkadaşınla birlikte çalışırken önce ikiniz de kitaba bakmadan hatırladıklarınızı yazın, sonra karşılaştırın. Birbirinize yardım ederken öğrendiklerinizi de tekrar etmiş olursunuz.',
          'Çocuğunuz bir arkadaşıyla birlikte çalışırken önce ikisi de kitaba bakmadan hatırladıklarını yazıp sonra karşılaştırabilir. Birbirlerine yardım ederken öğrendiklerini de tekrar etmiş olurlar.',
        ),
        low: t(
          'Kendi başına çalışmak sana kolay gelebilir. Çalışmanın sonunda kitabı kapat ve öğrendiklerini kısaca bir kâğıda yaz; bakmadan hatırlamak en işe yarayan tekrar yollarından biridir.',
          'Çocuğunuza kendi başına çalışmak kolay gelebilir. Çalışmanın sonunda kitabı kapatıp öğrendiklerini kısaca bir kâğıda yazması, bakmadan hatırlamanın kolay bir yoludur.',
        ),
      },
      action: {
        high: t(
          'Bu hafta bir arkadaşına ya da kardeşine zorlandığı bir işte yardım et; ama bir gün de senin yapmak istediğin şeyi ona söylemeyi dene.',
          'Bu hafta çocuğunuzun bir arkadaşına ya da kardeşine yardım ettiği anları fark edip söyleyin; bir gün de kendi isteğini açıkça söylemesini cesaretlendirin.',
        ),
        average: t(
          'Bu hafta her gün birine küçük bir iyilik yap ve akşam ailene ne yaptığını anlat.',
          'Bu hafta çocuğunuzla her gün birine küçük bir iyilik yapmayı deneyin ve akşam ne yaptığını birlikte konuşun.',
        ),
        low: t(
          'Bu hafta her gün ailenle, bir kitaptaki ya da çizgi filmdeki bir karakterin o an ne hissettiğini konuş.',
          'Bu hafta çocuğunuzla her gün bir kitaptaki ya da çizgi filmdeki bir karakterin ne hissettiğini konuşun; “Sence o şimdi ne hissediyor?” diye sorun.',
        ),
      },
    },
    conscientiousness: {
      color: '#2f5ce0',
      study: {
        high: t(
          'Düzenli olmak işini kolaylaştırıyor. Bir adım daha atabilirsin: bir konuyu bir günde uzun uzun değil, birkaç güne yayarak kısa kısa tekrar et.',
          'Düzenli olmak çocuğunuzun işini kolaylaştırıyor. Bir adım daha atabilir: bir konuyu bir günde uzun uzun değil, birkaç güne yayarak kısa kısa tekrar edebilir.',
        ),
        average: t(
          'Bazı işlerde düzenlisin. Bu düzeni çalışmaya da taşıyabilirsin: her gün aynı saatte, kısa bir süre çalış ve sonunda kitabı kapatıp neler öğrendiğini hatırlamaya çalış.',
          'Çocuğunuz bazı işlerde düzenli. Bu düzeni çalışmaya da taşıyabilir: her gün aynı saatte, kısa bir süre çalışması ve sonunda kitabı kapatıp öğrendiklerini hatırlamaya çalışması işe yarar.',
        ),
        low: t(
          'Çalışmaya başlamak zor geliyorsa işi küçült: 10 dakika çalış, sonra kısa bir mola ver. Neyi ne zaman yapacağını bir kâğıda yazıp görünür bir yere asmak da işine yarayabilir.',
          'Çocuğunuza çalışmaya başlamak zor geliyorsa işi küçültmesine yardım edin: 10 dakika çalışma, sonra kısa bir mola. Neyin ne zaman yapılacağını bir kâğıda yazıp görünür bir yere asmak da işe yarayabilir.',
        ),
      },
      action: {
        high: t(
          'Bu hafta öğrendiğin bir konuyu bir günde değil, üç ayrı günde kısa kısa tekrar et.',
          'Bu hafta çocuğunuzla öğrendiği bir konuyu bir günde değil, üç ayrı günde kısa kısa tekrar etmeyi deneyin.',
        ),
        average: t(
          'Bu hafta her akşam ertesi günün çantasını hazırla ve yaptığın her akşam bir kâğıda işaret koy.',
          'Bu hafta çocuğunuzla her akşam ertesi günün çantasını hazırlamayı deneyin; yaptığı her akşam bir kâğıda işaret koysun.',
        ),
        low: t(
          'Bu hafta her gün yalnızca bir işi hemen yap; örneğin eve gelince çantanı yerine koy. Yaptığın her gün bir kâğıda işaret koy.',
          'Bu hafta çocuğunuzla her gün hemen yapılacak tek bir iş seçin (ör. eve gelince çantasını yerine koymak); yaptığı her günü bir kâğıda işaretleyin ve küçük adımlarını övün.',
        ),
      },
    },
    emotional_stability: {
      color: '#0e9c8c',
      study: {
        high: t(
          'Sakin kalabilmek çalışırken de işine yarar. Zor bir konuda takıldığında bir mola verip sonra yeniden denemek, sakinliğini korumanı sağlar.',
          'Sakin kalabilmek çocuğunuza çalışırken de yardım eder. Zor bir konuda takıldığında bir mola verip sonra yeniden denemesi, sakinliğini korumasını sağlar.',
        ),
        average: t(
          'Bazı günler çalışmak daha zor gelebilir. Böyle günlerde önce kolay bir işle başla; zor bir konuda takılırsan yardım istemek de bir çalışma yoludur.',
          'Çocuğunuza bazı günler çalışmak daha zor gelebilir. Böyle günlerde önce kolay bir işle başlaması işini kolaylaştırır; zor bir konuda takılınca yardım istemek de bir çalışma yoludur.',
        ),
        low: t(
          'Endişelendiğinde ya da üzüldüğünde çalışmak zor gelebilir. Çalışmaya başlamadan önce seni neyin düşündürdüğünü ailene anlatmak ya da bir kâğıda yazmak işini kolaylaştırabilir. Takıldığın yerde yardım istemekten çekinme.',
          'Çocuğunuz endişelendiğinde ya da üzüldüğünde çalışmak ona zor gelebilir. Çalışmaya başlamadan önce onu neyin düşündürdüğünü size anlatması ya da bir kâğıda yazması işini kolaylaştırabilir. Takıldığı yerde yardım isteyebileceğini bilmesi önemlidir.',
        ),
      },
      action: {
        high: t(
          'Bu hafta seni sakinleştiren şeyleri (örneğin yürüyüş, müzik, resim yapmak) bir listeye yaz; zor bir günde bu listeye bak.',
          'Bu hafta çocuğunuzla onu sakinleştiren şeylerin (ör. yürüyüş, müzik, resim yapmak) bir listesini hazırlayın; zor bir günde birlikte bu listeye bakın.',
        ),
        average: t(
          'Bu hafta seni üzen ya da kızdıran bir anı ailene anlat ve o anda ne yapabileceğini birlikte düşünün.',
          'Bu hafta çocuğunuzla onu üzen ya da kızdıran bir anı konuşun ve o anda ne yapabileceğini birlikte düşünün.',
        ),
        low: t(
          'Bu hafta her akşam ailenle 5 dakika konuş: günün en güzel ve en zor anı neydi? Zorlandığın şeyleri anlatmak, onları tek başına taşımaktan daha kolaydır.',
          'Bu hafta her akşam çocuğunuzla 5 dakika konuşun: günün en güzel ve en zor anı neydi? Yargılamadan dinlemeniz, duygularını anlatmasını kolaylaştırır.',
        ),
      },
    },
    intellect: {
      color: '#7a4ee6',
      study: {
        high: t(
          'Merakın sana yardım eder. Öğrendiğin bir konuda “Bu neden böyle?” diye sor ve cevabını kendi cümlelerinle açıklamaya çalış.',
          'Çocuğunuzun merakı ona yardım eder. Öğrendiği bir konuda “Bu neden böyle?” diye sorup cevabını kendi cümleleriyle açıklamaya çalışması konuyu pekiştirir.',
        ),
        average: t(
          'İlgini çeken konular çalışmayı kolaylaştırır. Sevmediğin bir konuyu sevdiğin bir şeye bağlamaya çalış; örneğin bir matematik sorusunu sevdiğin bir oyunla anlat.',
          'İlgisini çeken konular çocuğunuz için çalışmayı kolaylaştırır. Sevmediği bir konuyu sevdiği bir şeyle ilişkilendirmesine yardım edebilirsiniz (ör. bir matematik sorusunu sevdiği bir oyunla anlatmak).',
        ),
        low: t(
          'Somut örnekler sana iyi gelebilir. Bir konuyu çalışırken onu resimle, nesnelerle ya da günlük hayattan bir örnekle göstermeye çalış.',
          'Çocuğunuza somut örnekler iyi gelebilir. Bir konuyu çalışırken onu resimle, nesnelerle ya da günlük hayattan bir örnekle göstermek işini kolaylaştırır.',
        ),
      },
      action: {
        high: t(
          'Bu hafta merak ettiğin bir konuyu seç; bir kitaptan ya da bir yetişkinle birlikte araştır ve öğrendiklerini bir sayfaya çiz ya da yaz.',
          'Bu hafta çocuğunuzun merak ettiği bir konuyu birlikte araştırın; öğrendiklerini bir sayfaya çizmesini ya da yazmasını isteyin.',
        ),
        average: t(
          'Bu hafta seni ilgilendiren bir konuda “Neden?” diye başlayan üç soru yaz ve cevaplarını bir yetişkinle birlikte ara.',
          'Bu hafta çocuğunuzdan ilgisini çeken bir konuda “Neden?” diye başlayan üç soru yazmasını isteyin ve cevaplarını birlikte arayın.',
        ),
        low: t(
          'Bu hafta sevdiğin bir konuda kısa ve resimli bir kitap ya da yazı oku ve en ilginç bulduğun şeyi ailene anlat.',
          'Bu hafta çocuğunuzla sevdiği bir konuda kısa ve resimli bir kitap ya da yazı okuyun ve en ilginç bulduğu şeyi size anlatmasını isteyin.',
        ),
      },
    },
  },
  approach: {
    extraversion: {
      high: 'Konuşma ve arkadaşlık enerjisini destekleyin; başkalarını sonuna kadar dinlemeyi de birlikte konuşun.',
      average: 'Hem arkadaşlarıyla hem de tek başına vakit geçirme isteğine saygı gösterin.',
      low: 'Onu konuşmaya zorlamayın; yeni ortamlara önceden hazırlayın ve attığı küçük adımları fark edip söyleyin.',
    },
    agreeableness: {
      high: 'Yardımseverliğini fark edip söyleyin; gerektiğinde “hayır” diyebileceğini de hatırlatın.',
      average: 'Başkalarını düşündüğü anları fark edip söyleyin.',
      low: 'Günlük olaylarda başkalarının ne hissedebileceğini birlikte konuşun; kırıcı bir söz söylediğinde bunun karşısındakini nasıl etkilediğini sakin bir dille anlatın.',
    },
    conscientiousness: {
      high: 'Her şeyin kusursuz olması gerekmediğini, hata yapmanın da öğrenmenin parçası olduğunu hatırlatın.',
      average: 'Sevdiği işlerdeki düzenini fark edin ve bu düzeni öteki işlerine de taşımasına yardım edin.',
      low: 'Tek bir küçük alışkanlıkla başlayın ve her gün aynı saatte tekrarlayın; suçlamak yerine attığı küçük adımları övün.',
    },
    emotional_stability: {
      high: 'Sakinliğini fark edin; yine de duygularını paylaşabileceği bir ortam sunmaya devam edin.',
      average: 'Onu zorlayan durumları yargılamadan dinleyin ve o anlarda ne yapabileceğini birlikte düşünün.',
      low: 'Duygularını yargılamadan dinleyin; bu duygular uzun sürüyor ya da günlük hayatını etkiliyorsa okulun rehber öğretmeninden destek alın.',
    },
    intellect: {
      high: 'Sorularını ciddiye alın ve cevapları birlikte arayın.',
      average: 'İlgisini çeken konuları fark edin ve o konularda kitap ve etkinlik önerin.',
      low: 'Deney, yapım ve gezi gibi somut, elle tutulur etkinliklerle merakını besleyin.',
    },
  },
  sources: [KAYNAK.dunlosky],
};
