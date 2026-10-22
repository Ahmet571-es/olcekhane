import { KAYNAK } from './kaynaklar';
import type { AudienceText, RoadmapTemplate } from './types';

/**
 * Zihniyet: Zekâ ve Öğrenme İnançları: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öneriler inancı davranışa çevirmeye yöneliktir: zorlanınca yöntem değiştirmek (ustalık odaklı yollar), hatadan ne
 *    öğrenildiğini sormak, küçük zorlukları denemek (Burnette ve ark., 2013); anne babanın hatalara öğrenmeye odaklanarak
 *    tepki vermesi (Haimovitz ve Dweck, 2016). Etkili çalışma yöntemleri herkes için aynıdır (Dunlosky ve ark., 2013).
 *  - Zihniyetin başarıyla ilişkisi küçüktür (Sisk ve ark., 2018): "zihniyetini değiştir, başarın artsın" vaadi verilmez.
 *  - 2. hafta hataya bakış ("Hatadan öğrenmek"); 3. hafta en düşük puanlı alan. Ortamlar bölümü yoktur.
 *  - Öğrenci metinleri okula özgü değildir: yetişkine de aynen gösterilir.
 *  - Aynı sayfada bir öneri bir kez verilir (2026-10-22 incelemesi): rapordaki kartlar öneri vermez; çalışma kartı, "Bu
 *    hafta dene" ve veliye yaklaşım aynı alanda farklı bir adım önerir (ör. Hataya bakış düşükken çalışma kartı
 *    takıldığı yeri incelemeyi, 2. hafta "Bundan ne öğrendim?" sorusunu, veliye yaklaşım önce duyguyu dinlemeyi önerir).
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

export const zihniyetRoadmap: RoadmapTemplate = {
  version: 'zihniyet-yol-haritasi-1',
  planningScale: 'failure',
  planningTitle: 'Hatadan öğrenmek',
  thirdWeek: 'lowest',
  unit: { one: 'alan', toPlural: 'alanlara' },
  balancedNote: t(
    'Dört alanda da puanın ortada: ne sabitlik ne de gelişim yönünde belirgin bir inanç öne çıkıyor.',
    'Çocuğunuzun dört alanda da puanı ortada: ne sabitlik ne de gelişim yönünde belirgin bir inanç öne çıkıyor.',
  ),
  studyIntro: t(
    'Zihniyet bir inançtır; asıl fark, zorlandığın anlarda ne yaptığında ortaya çıkar. Aşağıda her alan için inancını davranışa çevirecek bir sonraki küçük adım var; hepsini birden değil, birer birer dene.',
    'Zihniyet bir inançtır; asıl fark, zorlanılan anlarda ne yapıldığında ortaya çıkar. Aşağıda çocuğunuzun her alanı için inancını davranışa çevirecek bir sonraki küçük adım var; hepsini birden değil, birer birer denemesine destek olun.',
  ),
  firstWeek: t(
    'Raporundaki dört alana bak. Bu hafta zorlandığın anlarda aklından geçen düşünceyi (ör. “Bende bu yetenek yok” ya da “Henüz öğrenmedim”) bir kâğıda kısaca yaz.',
    'Raporu çocuğunuzla birlikte okuyun ve hangi cümlelerin onu anlattığını sorun. Bu hafta yalnızca gözlem yapın: zorlandığında ya da hata yaptığında ne söylüyor, siz nasıl tepki veriyorsunuz?',
  ),
  lastWeek: t(
    'Dört haftada yazdıklarına bak: zorlandığında aklına gelen düşünceler ve yaptıkların değişti mi? İşe yarayanı sürdür.',
    'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  ),
  nextTests: ['ders-calisma-motivasyonu', 'erteleme-ve-zaman-yonetimi', 'ogrenme-ve-basari-ozellikleri'],
  nextPurpose: { you: 'öğrenmeyle ilgili başka yönlerini de görmek', parent: 'çocuğunuzun öğrenmeyle ilgili başka yönlerini de görmek', general: true },
  approach: {
    intelligence: {
      low: 'Kendi hayatınızdan, önce zorlanıp sonra öğrendiğiniz bir şeyi (araba kullanmak, yeni bir iş gibi) ona anlatın.',
      average: '“Sen bunu yapamazsın” gibi sabit sözler yerine “Henüz öğrenmedin” demeyi deneyin.',
      high: 'Zorlandığında hemen yardım etmek yerine biraz uğraşmasına fırsat verin.',
    },
    effort: {
      low: 'Yeteneğini değil, çabasını ve denediği yolları övün.',
      average: 'Takıldığında çözümü hemen söylemek yerine “Başka hangi yolu deneyebilirsin?” diye sorun.',
      high: '“Bugün hangi yöntemi denedin?” gibi sorularla ne kadar değil, nasıl çalıştığını sorun.',
    },
    failure: {
      low: 'Bir hatanın ardından önce duygusunu dinleyin; ne öğrendiğini konuşmayı biraz sonraya bırakın.',
      average: 'Hata yaptığında hayal kırıklığınızı değil, merakınızı gösterin; örneğin “Nerede takıldın, birlikte bakalım mı?” diye sorun.',
      high: 'Zorlu bir işte hata yapmasına izin verin; her hatayı hemen düzeltmeyin.',
    },
    challenge: {
      low: 'Yeni bir şeyi denediğinde, sonucu ne olursa olsun denemesini takdir edin.',
      average: 'Kaçındığı türden küçük bir işi siz de onunla birlikte deneyin.',
      high: 'Zorlandığı işlerde ilerlemesini sonuçtan bağımsız olarak fark edip söyleyin.',
    },
  },
  scales: {
    intelligence: {
      color: '#7a4ee6',
      study: {
        low: t(
          'Araştırmalardaki kısa çalışmalarda katılımcılara, zihinsel becerilerin öğrenerek geliştirilebileceği anlatılmış. Kendi hayatından bir örnek bul: bir zamanlar zorlandığın ama şimdi rahatça yaptığın bir şey. Onu nasıl öğrendiğini düşünmek, zorlandığın yeni bir işe bakışını değiştirebilir.',
          'Araştırmalardaki kısa çalışmalarda katılımcılara, zihinsel becerilerin öğrenerek geliştirilebileceği anlatılmış. Çocuğunuzla, bir zamanlar zorlandığı ama şimdi rahatça yaptığı bir şeyi ve onu nasıl öğrendiğini konuşun; bu, zorlandığı yeni bir işe bakışını değiştirebilir.',
        ),
        average: t(
          'Zorlandığın anlarda aklına gelen düşünceyi fark et: “Bende bu yetenek yok” mu, “Henüz öğrenmedim” mi? Fark etmek, hangi düşüncenin seni ilerlettiğini görmeni kolaylaştırır.',
          'Çocuğunuzun zorlandığı anlarda aklına gelen düşünceyi birlikte fark edin: “Bende bu yetenek yok” mu, “Henüz öğrenmedim” mi? Fark etmek, hangi düşüncenin onu ilerlettiğini görmeyi kolaylaştırır.',
        ),
        high: t(
          'Zekânın gelişebileceği inancını kendi deneyiminle sınamanın bir yolu, ilk denemede başaramadığın bir işe birkaç gün sonra geri dönmektir: ikinci denemede neyin değiştiğini görebilirsin.',
          'Çocuğunuzun ilk denemede başaramadığı bir işe birkaç gün sonra geri dönmesi, zekânın gelişebileceği inancını kendi deneyimiyle sınamasını sağlayabilir: ikinci denemede neyin değiştiğini görebilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta zorlandığın bir anda aklına gelen “Bende bu yetenek yok” düşüncesini “Henüz öğrenmedim” diye yeniden yaz.',
          'Bu hafta çocuğunuz zorlandığında “Bende bu yetenek yok” derse, “Henüz öğrenmedin” diye karşılık verin ve nasıl öğrenebileceğini birlikte düşünün.',
        ),
        average: t(
          'Bu hafta zorlandığın bir anda aklına gelen düşünceden sonra ne yaptığını yaz: vazgeçtin mi, başka bir yol mu denedin?',
          'Bu hafta çocuğunuz zorlandığında, aklına gelen düşünceden sonra ne yaptığını konuşun: vazgeçti mi, başka bir yol mu denedi?',
        ),
        high: t(
          'Bu hafta takıldığın bir işte en az iki farklı yol dene.',
          'Bu hafta çocuğunuz takıldığı bir işte en az iki farklı yol denesin; denediklerini birlikte konuşun.',
        ),
      },
    },
    effort: {
      color: '#d28a14',
      study: {
        low: t(
          'Çok çalışmak gerekmesi, yeteneksizliğin değil, o konunun senin için henüz yeni olduğunun işareti olabilir. Takıldığında aynı şeyi daha çok yapmak yerine yöntem değiştir: notlara bakmadan hatırlamaya çalışmak ya da tekrarları günlere yaymak gibi.',
          'Çok çalışmak gerekmesi, yeteneksizliğin değil, o konunun çocuğunuz için henüz yeni olduğunun işareti olabilir. Takıldığında aynı şeyi daha çok yapmak yerine yöntem değiştirmesini destekleyin: notlara bakmadan hatırlamaya çalışmak ya da tekrarları günlere yaymak gibi.',
        ),
        average: t(
          'Çabanın yanında yöntem de önemlidir: takıldığında aynı şeyi tekrarlamak yerine başka bir yol dene.',
          'Çabanın yanında yöntem de önemlidir: çocuğunuz takıldığında aynı şeyi tekrarlamak yerine başka bir yol denemesi için cesaretlendirilebilir.',
        ),
        high: t(
          'Çabanı etkili yöntemlerle birleştirmek işine yarayabilir: öğrendiğini bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak, araştırmalarda en yararlı bulunan yöntemler arasında.',
          'Çocuğunuzun çabasını etkili yöntemlerle birleştirmesi işine yarayabilir: öğrendiğini bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak, araştırmalarda en yararlı bulunan yöntemler arasında.',
        ),
      },
      action: {
        low: t(
          'Bu hafta çok çalışman gereken bir işte, her çalışmanın sonunda neyi yeni öğrendiğini tek cümleyle yaz.',
          'Bu hafta çocuğunuz çok çalışması gereken bir işte, her çalışmanın sonunda neyi yeni öğrendiğini size tek cümleyle söylesin.',
        ),
        average: t(
          'Bu hafta her akşam ne kadar çalıştığını değil, hangi yöntemle çalıştığını tek cümleyle yaz.',
          'Bu hafta akşamları çocuğunuzla, o gün ne kadar değil, hangi yöntemle çalıştığını konuşun.',
        ),
        high: t(
          'Bu hafta öğrendiğin bir şeyi ertesi gün bakmadan hatırlamayı dene.',
          'Bu hafta çocuğunuz öğrendiği bir şeyi ertesi gün bakmadan hatırlamayı denesin.',
        ),
      },
    },
    failure: {
      color: '#ee6a36',
      study: {
        low: t(
          'Hata yaptığında önce sonuca değil, nerede takıldığına bak: hangi adımda yanlış yola girdin? Hatayı bir işaret olarak okumak zamanla alışkanlık hâline gelebilir.',
          'Çocuğunuz hata yaptığında önce sonucu değil, nerede takıldığını birlikte inceleyin; hatayı bir işaret olarak okumak zamanla alışkanlık hâline gelebilir.',
        ),
        average: t(
          'Hata yaptığında onu bir işaret olarak okumayı dene: neyi henüz öğrenmediğini gösteriyor?',
          'Çocuğunuz hata yaptığında, hatanın ona neyi henüz öğrenmediğini gösterdiğini birlikte konuşun.',
        ),
        high: t(
          'Hatalarını türlerine göre ayır: dikkatsizlikten mi, yoksa henüz bilmediğin bir şeyden mi? Hangi türün daha sık olduğunu görmek, nereye odaklanacağını gösterebilir.',
          'Çocuğunuzun hatalarını türlerine göre ayırması (dikkatsizlikten mi, henüz bilmediği bir şeyden mi?), hangi türün daha sık olduğunu ve nereye odaklanacağını görmesini sağlayabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her hatanın ardından “Bundan ne öğrendim?” sorusunu tek cümleyle yanıtla.',
          'Bu hafta çocuğunuz bir hata yaptığında, sakinleştikten sonra ona “Bundan ne öğrendin?” diye sorun.',
        ),
        average: t(
          'Bu hafta yaptığın bir hatayı ve ondan öğrendiğin şeyi bir yakınına anlat.',
          'Bu hafta siz de yaptığınız bir hatayı ve ondan ne öğrendiğinizi çocuğunuza anlatın.',
        ),
        high: t(
          'Bu hafta önemli bir hatanı ve ondan öğrendiğini kısa bir listeye yaz.',
          'Bu hafta çocuğunuz önemli bir hatasını ve ondan öğrendiğini kısa bir listeye yazsın.',
        ),
      },
    },
    challenge: {
      color: '#0e9c8c',
      study: {
        low: t(
          'Zorlayıcı bir işe “Yeteneğimi göstermeliyim” diye değil, “Bunu öğrenmek istiyorum” diye bakmak, onu denemeyi kolaylaştırabilir. İlk denemeleri başkalarının önünde değil, tek başına yapmak da baskıyı azaltabilir.',
          'Zorlayıcı bir işe “Yeteneğimi göstermeliyim” diye değil, “Bunu öğrenmek istiyorum” diye bakması, çocuğunuzun onu denemesini kolaylaştırabilir. İlk denemeleri başkalarının önünde değil, evde ya da tek başına yapması da baskıyı azaltabilir.',
        ),
        average: t(
          'Zorlayıcı bir işi seçtiğin durumlarla kaçındığın durumları karşılaştır: kaçındığında başkalarının önünde miydin, yoksa hata yapma ihtimali mi vardı? Bu fark, nereden başlayabileceğini gösterebilir.',
          'Çocuğunuzla, zorlayıcı bir işi seçtiği durumlarla kaçındığı durumları karşılaştırın: kaçındığında başkalarının önünde miydi, yoksa hata yapma ihtimali mi vardı? Bu fark, nereden başlanabileceğini gösterebilir.',
        ),
        high: t(
          'Zorlandığın işlerde nasıl ilerlediğini not etmek, hangi yolların işine yaradığını görmeni kolaylaştırabilir.',
          'Zorlandığı işlerde nasıl ilerlediğini not etmesi, çocuğunuzun hangi yolların işine yaradığını görmesini kolaylaştırabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta zorlanacağını bildiğin küçük bir işi dene ve sonucunu değil, ne öğrendiğini yaz.',
          'Bu hafta çocuğunuz zorlanacağını bildiği küçük bir işi denesin; sonucunu değil, ne öğrendiğini konuşun.',
        ),
        average: t(
          'Bu hafta genellikle kaçındığın türden küçük bir zorluğu seç.',
          'Bu hafta çocuğunuz genellikle kaçındığı türden küçük bir zorluğu seçsin.',
        ),
        high: t(
          'Bu hafta seni biraz aşan yeni bir iş seç ve ilk denemende nerede zorlandığını yaz.',
          'Bu hafta çocuğunuz onu biraz aşan yeni bir iş seçsin; ilk denemede nerede zorlandığını birlikte konuşun.',
        ),
      },
    },
  },
  sources: [KAYNAK.burnette, KAYNAK.haimovitz, KAYNAK.sisk, KAYNAK.dunlosky],
};
