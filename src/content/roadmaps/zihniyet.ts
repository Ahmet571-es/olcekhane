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
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

export const zihniyetRoadmap: RoadmapTemplate = {
  version: 'zihniyet-yol-haritasi-1',
  planningScale: 'failure',
  planningTitle: 'Hatadan öğrenmek',
  thirdWeek: 'lowest',
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
  nextPurpose: { you: 'öğrenmeyle ilgili başka yönlerini de görmek', parent: 'çocuğunuzun öğrenmeyle ilgili başka yönlerini de görmek' },
  approach: {
    intelligence: {
      low: 'Bir zamanlar zorlandığı ama şimdi rahatça yaptığı bir şeyi ona hatırlatın.',
      average: 'Zorlandığında neler düşündüğünü sorun ve dinleyin.',
      high: 'Çabasını ve yöntem değiştirmesini fark ettiğinizi söyleyin.',
    },
    effort: {
      low: 'Yeteneğini değil, çabasını ve denediği yolları övün.',
      average: 'Takıldığında başka bir yol denemesini cesaretlendirin.',
      high: 'Çabasını etkili çalışma yöntemleriyle birleştirmesini destekleyin.',
    },
    failure: {
      low: 'Hatalarına “Bundan ne öğrendin, bir dahaki sefere neyi farklı yaparsın?” diye yaklaşın.',
      average: 'Hatalarına yetenek kaygısıyla değil, öğrenmeye odaklanarak tepki verin.',
      high: 'Hatalarına öğrenmeye odaklanarak tepki vermeyi sürdürün.',
    },
    challenge: {
      low: 'Sonucu değil, yeni bir şeyi denemesini takdir edin.',
      average: 'Hangi durumlarda zorluktan kaçındığını birlikte konuşun.',
      high: 'Denemelerini ve öğrendiklerini takdir edin.',
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
          'Zekânın gelişebileceğine inanıyorsun. Bu inancı davranışa çevirmek için takıldığında yeni bir yol dene ve neyin işe yaradığını not et.',
          'Çocuğunuz zekânın gelişebileceğine inanıyor. Bu inancı davranışa çevirmesi için takıldığında yeni bir yol denemesini ve neyin işe yaradığını not etmesini destekleyin.',
        ),
      },
      action: {
        low: t(
          'Bu hafta bir zamanlar zorlandığın ama şimdi rahatça yaptığın bir şeyi yaz ve onu nasıl öğrendiğini anlat.',
          'Bu hafta çocuğunuzla bir zamanlar zorlandığı ama şimdi rahatça yaptığı bir şeyi ve onu nasıl öğrendiğini konuşun.',
        ),
        average: t(
          'Bu hafta zorlandığın üç anı ve o an aklına gelen düşünceyi yaz.',
          'Bu hafta çocuğunuzun zorlandığı anlarda ne düşündüğünü sorun ve dinleyin.',
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
          'Emeğin seni ilerletiyor. Çabanı etkili yöntemlerle birleştir: öğrendiğini bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak.',
          'Çocuğunuzun emeği onu ilerletiyor. Çabasını etkili yöntemlerle birleştirmesini destekleyin: öğrendiğini bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak.',
        ),
      },
      action: {
        low: t(
          'Bu hafta zorlandığın bir işte çalışma yöntemini değiştir ve farkı not et.',
          'Bu hafta çocuğunuz zorlandığı bir işte çalışma yöntemini değiştirsin; farkı birlikte konuşun.',
        ),
        average: t(
          'Bu hafta takıldığın her seferde başka bir yöntem dene.',
          'Bu hafta çocuğunuz takıldığında başka bir yöntem denesin.',
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
          'Bir hatanın ardından “Bu bana ne öğretti, bir dahaki sefere neyi farklı yaparım?” sorusuna iki cümleyle cevap yaz. Hatayı bir işaret olarak okumak zamanla alışkanlık hâline gelebilir.',
          'Çocuğunuzun hatalarına yeteneğini sorgulayarak değil, “Bundan ne öğrendin, bir dahaki sefere neyi farklı yaparsın?” diye sorarak yaklaşın. Araştırmalara göre anne babanın başarısızlığa tepkisi, çocuğun zekâ hakkındaki inancıyla ilişkili.',
        ),
        average: t(
          'Hata yaptığında onu bir işaret olarak okumayı dene: neyi henüz öğrenmediğini gösteriyor?',
          'Çocuğunuz hata yaptığında ona neyi henüz öğrenmediğini gösterdiğini birlikte konuşun; yetenek kaygısıyla değil, öğrenmeye odaklanarak tepki verin.',
        ),
        high: t(
          'Hatalarından öğrenebiliyorsun. Önemli hatalarını ve onlardan öğrendiklerini kısa bir listede topla; zor bir dönemde bu liste sana güç verebilir.',
          'Çocuğunuz hatalarından öğrenebiliyor. Önemli hatalarını ve onlardan öğrendiklerini kısa bir listede toplaması zor bir dönemde ona güç verebilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her hatanın ardından “Bundan ne öğrendim?” sorusunu tek cümleyle yanıtla.',
          'Bu hafta çocuğunuzun her hatasının ardından ona “Bundan ne öğrendin?” diye sorun.',
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
          'Zorluktan kaçınmak yerine küçük bir zorlukla başla: hata yapabileceğin ama başaramazsan bir şey kaybetmeyeceğin küçük bir iş seç. Sonucu değil, ne öğrendiğini değerlendir.',
          'Çocuğunuzun zorluktan kaçınması yerine küçük bir zorlukla başlamasını destekleyin: hata yapabileceği ama başaramazsa bir şey kaybetmeyeceği küçük bir iş. Sonucu değil, ne öğrendiğini konuşun.',
        ),
        average: t(
          'Hangi durumlarda zorluktan kaçındığını fark et; o durumlardan birinde, küçük bir adımla zorluğu seç.',
          'Çocuğunuzun hangi durumlarda zorluktan kaçındığını birlikte fark edin; o durumlardan birinde küçük bir adımla zorluğu seçmesini cesaretlendirin.',
        ),
        high: t(
          'Zorlayıcı işleri seçiyorsun. Zorlandığın işlerde nasıl ilerlediğini not etmek, hangi yolların işine yaradığını görmeni kolaylaştırır.',
          'Çocuğunuz zorlayıcı işleri seçiyor. Zorlandığı işlerde nasıl ilerlediğini not etmesi, hangi yolların işine yaradığını görmesini kolaylaştırır.',
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
          'Bu hafta zorlandığın bir işte hangi yolların işine yaradığını not et.',
          'Bu hafta çocuğunuz zorlandığı bir işte hangi yolların işine yaradığını not etsin.',
        ),
      },
    },
  },
  sources: [KAYNAK.burnette, KAYNAK.haimovitz, KAYNAK.sisk, KAYNAK.dunlosky],
};
