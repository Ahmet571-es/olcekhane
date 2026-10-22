import type { InterestArea, InterestRoadmapTemplate } from './types';

/**
 * Hobi ve Serbest Zaman İlgileri (16 alan): gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Puan, bir alandaki etkinliklerin son bir yılda ne sıklıkla yapıldığıdır; rapordaki gibi "zaman ayırmışsın" dili
 *    kullanılır, "ilgin var" ya da "yeteneğin var" denmez. Öne çıkan alanlar raporun en sık zaman ayrılan alanlarıdır
 *    (sık yapılan alan yoksa ara sıra yapılanlar; hepsi az yapılıyorsa öne çıkan alan yoktur).
 *  - Öneriler bir uğraşı biraz ileri taşımak içindir; meslek önerisi değildir, bir şey satın almayı gerektirmez.
 *    Güvenlik gerektiren etkinliklerde (spor, açık hava) eğitmen ya da deneyimli biri anılır.
 *  - Test yetişkinlere de açıktır ve rapor metinleri gibi bu metinler de okula ya da ergenliğe özgü sözcük içermez:
 *    yetişkine öğrenci metni gösterilir.
 *  - Sağlık ya da başarı üzerine kesin yargı yoktur.
 *  - Öne çıkan alan yoksa ve alanların hepsi az yapılmıyorsa bütün alanların puanı aynıdır (`openNote`): zaman birçok alana
 *    benzer ölçüde ayrılmıştır; imkânların kısıtlı olması yalnızca hepsi az yapılırken anılır (lib/reports/interest-roadmap.ts).
 */
const area = (color: string, x: Omit<InterestArea, 'color'>): InterestArea => ({ color, ...x });

export const hobiIlgileriRoadmap: InterestRoadmapTemplate = {
  version: 'hobi-ilgileri-yol-haritasi-1',
  leisure: true,
  what: {
    student: 'boş zamanını nasıl değerlendirebileceğin',
    parent: 'çocuğunuzun boş zamanını nasıl değerlendirebileceği',
    summary: 'en sık zaman ayrılan alanları ileri taşımak için öneriler',
  },
  studyTitle: { you: 'Uğraşlarını nasıl ileri taşıyabilirsin?', parent: 'Çocuğunuz uğraşlarını nasıl ileri taşıyabilir?' },
  studyIntro: {
    student:
      'İnsanlar ilgi duydukları etkinliklere daha çok zaman ayırır; ama bir etkinliği ne sıklıkla yaptığın zamanına ve imkânlarına da bağlıdır. Aşağıda en sık zaman ayırdığın alanları biraz daha ileri taşımak için öneriler var; hiçbiri bir zorunluluk değil.',
    parent:
      'İnsanlar ilgi duydukları etkinliklere daha çok zaman ayırır; ama bir etkinliğin ne sıklıkla yapıldığı zamana ve ailenin imkânlarına da bağlıdır. Aşağıda çocuğunuzun en sık zaman ayırdığı alanları biraz daha ileri taşıması için öneriler var; hangilerinin ona uyduğunu birlikte seçebilirsiniz.',
  },
  openNote: {
    student:
      'Son bir yılda hiçbir alan ötekilerden öne çıkmıyor: zamanını birçok alana benzer ölçüde ayırmışsın. Aşağıdaki haftalarda küçük denemeler var.',
    parent:
      'Son bir yılda yapılan etkinliklerde hiçbir alan ötekilerden öne çıkmıyor: çocuğunuz zamanını birçok alana benzer ölçüde ayırmış. Aşağıdaki haftalarda küçük denemeler var.',
  },
  firstWeek: {
    student:
      'Raporundaki alanlara bir kez daha göz at. Bu hafta her akşam boş zamanını neyle geçirdiğini bir cümleyle bir deftere yaz: hangi etkinlik sana iyi geldi, hangisi seni yordu?',
    parent:
      'Raporu çocuğunuzla birlikte okuyun ve sonuçların ona uyup uymadığını sorun. Bu hafta boş zamanında hangi etkinliklerin ona iyi geldiğini birlikte gözlemleyin.',
  },
  openWeeks: [
    {
      title: 'Yeni bir etkinlik dene',
      text: {
        student:
          'Bu hafta raporunda daha az öne çıkan ya da hiç denemediğin alanlardan birini seç ve o alandan küçük bir etkinliği bir kez dene (ör. bir doğa yürüyüşü, bir masa oyunu ya da bir müze); sana nasıl geldiğini yaz.',
        parent:
          'Bu hafta raporda daha az öne çıkan ya da çocuğunuzun hiç denemediği alanlardan birini onunla birlikte seçin ve o alandan küçük bir etkinliği birlikte bir kez deneyin.',
      },
    },
    {
      title: 'Birlikte bir etkinlik',
      text: {
        student: 'Bu hafta sevdiğin bir etkinliği bir arkadaşınla ya da yakınlarınla birlikte yap; birlikte yapmanın onu nasıl değiştirdiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte, onun seçeceği bir boş zaman etkinliğine bir saat ayırın.',
      },
    },
  ],
  lastWeek: {
    student: 'Dört haftada hangi etkinliğin sana en iyi geldiğini yaz ve onu sürdürmek için haftada küçük ama düzenli bir zaman ayır.',
    parent: 'Dört haftada hangi etkinliğin ona en iyi geldiğini çocuğunuzla konuşun ve onu sürdürmesi için haftada küçük ama düzenli bir zamanı birlikte belirleyin.',
  },
  nextTests: ['mesleki-ilgi-profili', 'meslek-ilgi-alanlari'],
  nextPurpose: { you: 'meslek ilgilerini de görmek', parent: 'çocuğunuzun meslek ilgilerini de görmek' },
  links: [],
  areas: {
    children: area('#df4777', {
      explore: {
        student:
          'Küçük çocuklarla vakit geçirmekten keyif alıyorsan bunu biraz ileri taşıyabilirsin: onların yaşına uygun oyunlar ve hikâyeler öğrenmek, bir çocuk kitabını farklı seslerle okumayı denemek ya da güvenli bir ortamda çocuklarla yapılan gönüllü bir etkinliğe katılmak gibi. Çocuklarla çalışan meslekleri merak ediyorsan o işi yapan biriyle konuşabilirsin.',
        parent:
          'Çocuğunuzun küçük çocuklarla kurduğu ilişkiyi fark edip takdir edebilirsiniz. Ona yaşına uygun ve güvenli sorumluluklar vermek (ör. bir büyüğün yanında küçük bir akrabasına kitap okumak) ve bu sırada neler hissettiğini konuşmak bu uğraşı destekler.',
      },
      action: {
        student: 'Bu hafta küçük bir çocuğa onun seçtiği bir kitabı oku ya da ona yeni bir oyun öğret; çocuğun en çok neye güldüğünü yaz.',
        parent: 'Bu hafta çocuğunuzdan, bir aile buluşmasında küçük çocuklar için kısa bir oyun ya da etkinlik hazırlamasını isteyin.',
      },
      approach: 'Küçüklere gösterdiği ilgiyi fark edin; bakım işlerinin ona bir yük olarak kalmamasına ve kendi zamanını almamasına dikkat edin.',
    }),
    collecting: area('#b7791f', {
      explore: {
        student:
          'Koleksiyonunu bir adım ileri taşımak için parçalarını bir düzene göre sıralayıp küçük bir katalog hazırlayabilir, topladığın şeylerin tarihini ve hikâyesini araştırabilirsin. Aynı şeyi toplayan insanlarla tanışmak ya da bir koleksiyon sergisini gezmek yeni şeyler öğrenmeni sağlar.',
        parent:
          'Çocuğunuzun koleksiyonunu anlatmasını dinlemek ve ona soru sormak bu uğraşı destekler. Koleksiyonunu sergileyebileceği bir raf ya da kutu ayırmak, bir müzede benzer koleksiyonları birlikte görmek merakını derinleştirebilir. Harcamaları birlikte belirlediğiniz bir sınır içinde tutmak da iyi bir alışkanlıktır.',
      },
      action: {
        student: 'Bu hafta koleksiyonundaki en ilginç üç parçayı seç ve her birinin hikâyesini birkaç cümleyle yaz.',
        parent: 'Bu hafta çocuğunuzdan koleksiyonunu size baştan sona tanıtmasını isteyin; en sevdiği parçayı neden sevdiğini sorun.',
      },
      approach: 'Koleksiyonunu önemseyin; sabrına ve bir konuyu derinlemesine tanıma isteğine değer verin.',
    }),
    creativity: area('#7a4ee6', {
      explore: {
        student:
          'Yaratıcı etkinliklerini ileri taşımak için ürettiklerini bir dosyada ya da defterde biriktirebilir, kendine küçük bir proje belirleyebilirsin (ör. bir ay boyunca her hafta bir çizim ya da bir şiir). Bir atölyeye, bir koroya ya da bir tiyatro topluluğuna katılmak ve ürettiklerini güvendiğin insanlarla paylaşmak yeni fikirler getirir.',
        parent:
          'Çocuğunuzun yaratıcı etkinlikleri için evde küçük bir köşe, zaman ve basit malzemeler ayırabilirsiniz. Ürettiklerini değerlendirmek yerine onları nasıl yaptığını sormak, bir atölyeye ya da koroya katılmasını desteklemek merakını besler.',
      },
      action: {
        student: 'Bu hafta yaratıcı bir işe en az bir saat ayır, ortaya çıkanı biriktirdiğin dosyaya ekle ve bir sonraki denemende neyi değiştirmek istediğini not et.',
        parent: 'Bu hafta çocuğunuzun yaptığı yaratıcı bir işi evde görünür bir yere koyun ve onu nasıl yaptığını anlatmasını isteyin.',
      },
      approach: 'Yaratıcı denemelerini sonuca göre değil, emeğe ve merakına göre takdir edin.',
    }),
    culture: area('#2f5ce0', {
      explore: {
        student:
          'Kültür ve sanat etkinliklerini ileri taşımak için gittiğin bir sergi, konser ya da oyun hakkında kısa notlar tutabilir, bir sanatçının ya da bir dönemin hikâyesini araştırabilirsin. Belediyelerin kültür etkinlikleri gibi ücretsiz ya da indirimli etkinlikleri takip etmek yeni fırsatlar bulmanı kolaylaştırır.',
        parent:
          'Çocuğunuzla birlikte bir sergi, konser ya da tiyatro oyunu seçip gidebilir, sonrasında en çok neyin aklında kaldığını konuşabilirsiniz. Ücretsiz ya da indirimli etkinlikler (ör. belediyelerin kültür etkinlikleri) bu fırsatları çoğaltır.',
      },
      action: {
        student: 'Bu hafta bir müze, sergi ya da gösteri seç (çevrim içi bir müze turu da olur) ve en çok etkilendiğin şeyi birkaç cümleyle yaz.',
        parent: 'Bu hafta çocuğunuzla bir kültür ya da sanat etkinliği seçin; dönüşte ona en çok neyin dikkatini çektiğini sorun.',
      },
      approach: 'Gördüklerini ve dinlediklerini yorumlamasına alan açın; beğenilerinin sizinkinden farklı olabileceğini kabul edin.',
    }),
    exercise: area('#0e9c8c', {
      explore: {
        student:
          'Egzersizi ileri taşımak için kendine ulaşılabilir bir hedef koyabilir (ör. her hafta biraz daha uzun yürümek ya da koşmak) ve yaptıklarını bir çizelgede işaretleyebilirsin. Yeni bir hareket türüne başlarken doğru tekniği bir eğitmenden ya da güvenilir bir kaynaktan öğrenmek sakatlanmayı önlemeye yardım eder.',
        parent:
          'Çocuğunuzun egzersize ayırdığı zamanı takdir edebilir, ona güvenli bir ortam ve uygun ekipman sağlamaya yardım edebilirsiniz. Yeni bir hareket türüne başlarken bir eğitmenin ya da güvenilir bir kaynağın rehberliği önemlidir; dinlenmeye ve uykuya da yer kalmasını birlikte gözetin.',
      },
      action: {
        student: 'Bu hafta yaptığın egzersizleri her gün bir çizelgeye işaretle ve hafta sonunda kendine bir sonraki hafta için küçük bir hedef koy.',
        parent: 'Bu hafta çocuğunuzla birlikte bir yürüyüş ya da bisiklet turu gibi kısa bir egzersize zaman ayırın.',
      },
      approach: 'Kendini başkalarıyla değil, kendi ilerlemesiyle karşılaştırmasını destekleyin; dinlenmenin de egzersizin parçası olduğunu hatırlatın.',
    }),
    fashion: area('#c2459b', {
      explore: {
        student:
          'Moda ve giyimle uğraşını ileri taşımak için beğendiğin kombinleri bir defterde ya da panoda biriktirebilir, renk uyumu ve kumaşlar hakkında okuyabilirsin. Eski bir kıyafeti yeniden düzenlemek, dikiş ya da moda çizimi denemek bu uğraşı yaratıcı bir beceriye dönüştürebilir.',
        parent:
          'Çocuğunuzun giyimle ilgili seçimlerine saygı göstermek ve tarzını anlatmasını dinlemek onu destekler. Bu uğraşı harcamadan çok üretmeye yönlendirebilirsiniz: eski kıyafetleri birlikte yeniden düzenlemek, dikiş ya da moda çizimi denemek gibi.',
      },
      action: {
        student: 'Bu hafta yeni bir şey almadan, dolabındaki parçalarla üç farklı kombin oluştur ve hangisinde kendini en rahat hissettiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte eski bir kıyafeti onarmayı ya da yeniden düzenlemeyi deneyin.',
      },
      approach: 'Giyimle kendini ifade etmesine saygı gösterin; görünüşüyle ilgili yorumlarda nazik olun.',
    }),
    games: area('#ee6a36', {
      explore: {
        student:
          'Masa ve kart oyunlarını ileri taşımak için yeni bir oyunun kurallarını öğrenip başkalarına öğretebilir ya da sevdiğin bir oyunda farklı stratejiler deneyebilirsin. Satranç gibi oyunlarda bir kulübe katılmak ya da kendi küçük oyununu tasarlamak da keyifli bir sonraki adım olabilir.',
        parent:
          'Çocuğunuzla düzenli bir oyun akşamı belirlemek hem birlikte vakit geçirmenizi hem de onun oyunları anlatmasını sağlar. Satranç gibi oyunlarda bir kulübe katılmasını ya da kendi oyununu tasarlamayı denemesini destekleyebilirsiniz.',
      },
      action: {
        student: 'Bu hafta yeni bir masa ya da kart oyunu öğren ve onu en az bir kişiye öğret.',
        parent: 'Bu hafta çocuğunuzdan size sevdiği bir oyunu öğretmesini isteyin ve birlikte oynayın.',
      },
      approach: 'Kazanmaktan çok düşünmeye ve birlikte oynamaya odaklanın; kaybettiğinde nasıl hissettiğini konuşun.',
    }),
    gardening: area('#5a9e2f', {
      explore: {
        student:
          'Bitkilerle uğraşını ileri taşımak için tohumdan bir bitki yetiştirip büyümesini fotoğraflarla takip edebilir, yaşadığın yerin iklimine uygun bitkileri araştırabilirsin. Bir balkon ya da pencere önü bile küçük bir bahçe için yeterli olabilir.',
        parent:
          'Çocuğunuza kendi bakacağı bir saksı ya da balkonda küçük bir alan ayırmak bu uğraşı destekler. Bir botanik bahçesini, bir fidanlığı ya da bir köy bahçesini birlikte gezmek yeni şeyler öğrenmesini sağlar.',
      },
      action: {
        student: 'Bu hafta bir tohum ek ya da bir bitkiye bakmaya başla; her gün neyin değiştiğini bir cümleyle yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte bir saksı hazırlayın ve bitkinin bakımını ona bırakın.',
      },
      approach: 'Bir şeyi sabırla büyütmesine değer verin; bir bitki kuruduğunda bunun da öğrenmenin parçası olduğunu söyleyin.',
    }),
    gatherings: area('#e0a10b', {
      explore: {
        student:
          'Kutlama ve buluşmalarla uğraşını ileri taşımak için küçük bir buluşmayı baştan sona planlayabilirsin: davetlileri, yiyecekleri, bir oyun ya da etkinliği ve bütçeyi düşünmek gibi. Bu, insanları bir araya getirme ve düzenleme becerisi kazandırır.',
        parent:
          'Çocuğunuza aile buluşmalarında ya da kutlamalarda bir görev vermek (ör. bir etkinliği ya da sofrayı hazırlamak) bu uğraşı destekler. Misafir ağırladıktan sonra nelerin iyi gittiğini birlikte konuşmak planlama becerisini geliştirebilir.',
      },
      action: {
        student: 'Bu hafta yakınlarınla ya da arkadaşlarınla küçük bir buluşma planla: kimlerin geleceğini, ne yapacağınızı ve neler gerektiğini bir listeye yaz.',
        parent: 'Bu hafta küçük bir aile buluşmasının bir bölümünü (ör. bir oyun ya da ikramlar) çocuğunuza bırakın.',
      },
      approach: 'İnsanları bir araya getirme isteğini takdir edin; kalabalıktan sonra dinlenmeye de zaman ayırmasını önerin.',
    }),
    pets: area('#9a5b34', {
      explore: {
        student:
          'Hayvanlarla uğraşını ileri taşımak için baktığın ya da merak ettiğin bir hayvanın ihtiyaçlarını (beslenme, sağlık, davranış) güvenilir kaynaklardan araştırabilirsin. Hayvan barınaklarının gönüllü etkinliklerini araştırmak ya da hayvanlarla çalışan meslekleri yakından tanımak da bir sonraki adım olabilir.',
        parent:
          'Çocuğunuza evcil hayvanın bakımında yaşına uygun ve düzenli görevler vermek sorumluluk duygusunu destekler. Hayvanlarla ilgili bir belgeseli birlikte izlemek ya da bir veteriner hekimle konuşma fırsatı yaratmak merakını derinleştirebilir.',
      },
      action: {
        student: 'Bu hafta bir hayvan türünün (kendi evcil hayvanın ya da merak ettiğin bir hayvan) ihtiyaçlarını araştır ve öğrendiğin üç şeyi yaz.',
        parent:
          'Bu hafta evcil hayvanınızın bakımındaki bir görevi bir hafta boyunca çocuğunuza bırakın ve hafta sonunda nasıl geçtiğini konuşun; evcil hayvanınız yoksa hayvanlarla ilgili bir belgeseli birlikte izleyin.',
      },
      approach: 'Hayvanlara gösterdiği özeni fark edin; bakım sorumluluğunu evde birlikte paylaştırın.',
    }),
    reading: area('#1d7fc2', {
      explore: {
        student:
          'Okumayı ileri taşımak için okuduğun kitaplardan kısa notlar tutabilir, sevdiğin bir yazarın başka kitaplarını ya da hiç okumadığın bir türü deneyebilirsin. Bir okuma grubuna katılmak ya da okuduğun bir kitabı biriyle konuşmak kitabı farklı açılardan görmeni sağlar. Halk kütüphanelerinden ücretsiz kitap ödünç alabilirsin.',
        parent:
          'Çocuğunuzun okuduklarını merak etmek ve anlatmasını dinlemek okumayı destekler. Birlikte kütüphaneye gitmek, kitap seçimini ona bırakmak ve evde okumaya sessiz bir zaman ayırmak bu alışkanlığı güçlendirir.',
      },
      action: {
        student: 'Bu hafta daha önce okumadığın türden bir kitaba başla (ör. bilim kurgu, biyografi ya da şiir) ve ilk izlenimlerini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte bir kütüphaneye ya da kitapçıya gidin; seçimi ona bırakın.',
      },
      approach: 'Ne okuduğunu yargılamadan merak edin; okumayı bir görev değil, keyif olarak görmesini destekleyin.',
    }),
    self_improvement: area('#4b47b8', {
      explore: {
        student:
          'Kendini geliştirme isteğini ileri taşımak için öğrenmek istediğin bir beceriyi seçip küçük ve ölçülebilir bir hedef koyabilirsin (ör. bir ayda yeni bir dilde yüz sözcük ya da bir müzik aletinde bir parça). Ücretsiz çevrim içi kurslar ve halk eğitim merkezleri yeni beceriler için iyi başlangıç noktalarıdır.',
        parent:
          'Çocuğunuzun kendi isteğiyle bir şey öğrenmesini takdir etmek ve öğrendiklerini anlatmasını dinlemek bu isteği destekler. Ücretsiz çevrim içi kurslar ya da halk eğitim merkezlerinin kursları yeni beceriler için iyi fırsatlardır; hedefleri onun koymasına alan açın.',
      },
      action: {
        student: 'Bu hafta öğrenmek istediğin bir beceri seç ve her gün ona on beş dakika ayır; hafta sonunda neyi öğrendiğini yaz.',
        parent: 'Bu hafta çocuğunuza öğrenmek istediği bir beceriyi sorun ve onun için her gün kısa bir zaman ayırmasına yardım edin.',
      },
      approach: 'Öğrenme isteğine değer verin; hedeflerin çok yüklenip keyfini kaçırmamasına dikkat edin.',
    }),
    sports: area('#d33a3a', {
      explore: {
        student:
          'Sporu ileri taşımak için düzenli antrenman yapan bir takıma ya da bir spor kulübüne katılabilir, sevdiğin sporun kurallarını ve tekniklerini daha ayrıntılı öğrenebilirsin. Belediyelerin spor kursları ücretsiz ya da düşük ücretli olabilir.',
        parent:
          'Çocuğunuzu bir takıma ya da düzenli bir spor etkinliğine katılmaya teşvik ederek bu uğraşı destekleyebilirsiniz. Maçlarına ya da antrenmanlarına zaman zaman eşlik etmek ve sonucu değil çabasını konuşmak onu yüreklendirir.',
      },
      action: {
        student: 'Bu hafta sevdiğin sporda geliştirmek istediğin bir hareketi seç ve her gün birkaç dakika onun üzerinde çalış; hafta sonunda nasıl değiştiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte bir spor karşılaşmasını izleyin ya da birlikte bir top oyunu oynayın.',
      },
      approach: 'Sonuca değil, çabaya ve takım ruhuna odaklanın; kaybettiği bir maçtan neyi öğrendiğini sorun.',
    }),
    outdoors: area('#2e8b57', {
      explore: {
        student:
          'Açık hava etkinliklerini ileri taşımak için yakınındaki doğa yürüyüşü yollarını keşfedebilir, kuşları ya da bitkileri tanımayı öğrenebilirsin. Kamp ya da yüzme gibi etkinliklerde güvenlik kurallarını öğrenmek ve deneyimli biriyle gitmek önemlidir.',
        parent:
          'Çocuğunuzla birlikte düzenli doğa yürüyüşleri ya da piknikler planlamak bu uğraşı destekler. Yüzme ve kamp gibi etkinliklerde güvenlik kurallarını birlikte konuşmak ve deneyimli bir rehber eşliğinde katılmak önemlidir.',
      },
      action: {
        student: 'Bu hafta açık havada en az bir saat geçir (bir park, bir sahil ya da bir doğa yolu) ve gördüğün üç canlıyı ya da yeri yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte yakındaki bir parka, sahile ya da doğa yoluna gidin ve rotayı ona seçtirin.',
      },
      approach: 'Doğada geçirdiği zamanı destekleyin; güvenlik konusunda net ve sakin olun.',
    }),
    travel: area('#139fb5', {
      explore: {
        student:
          'Gezilerini bir adım ileri taşımak için gideceğin yerlerin tarihini ve kültürünü önceden araştırabilir, küçük bir gezi defteri tutabilirsin. Uzaklara gitmek gerekmez: yaşadığın şehirde hiç görmediğin bir semti, bir tarihî yeri ya da bir müzeyi keşfetmek de bir gezidir.',
        parent:
          'Çocuğunuza bir gezinin planlanmasında görev vermek (rota, gezilecek yerler, bütçe) bu uğraşı destekler. Yakındaki tarihî yerleri ve semtleri birlikte keşfetmek, uzun yolculuklar gerektirmeden yeni yerler görmesini sağlar.',
      },
      action: {
        student: 'Bu hafta yaşadığın yerde daha önce görmediğin bir yeri araştır ve mümkünse gez; orada öğrendiğin bir şeyi yaz.',
        parent: 'Bu hafta çocuğunuzdan yakındaki bir yere yapacağınız kısa bir gezinin rotasını hazırlamasını isteyin.',
      },
      approach: 'Yeni yerleri keşfetme merakını besleyin; gezileri planlarken ona söz hakkı verin.',
    }),
    writing: area('#8e5bb5', {
      explore: {
        student:
          'Yazmayı ve anı biriktirmeyi ileri taşımak için düzenli bir günlük tutabilir, fotoğraflarını ve hatıralarını bir albümde ya da defterde düzenleyebilirsin. Sevdiğin birine elle bir mektup ya da teşekkür notu yazmak da bu uğraşa yeni bir boyut katar.',
        parent:
          'Çocuğunuza güzel bir defter ya da albüm hediye etmek bu uğraşı destekler. Aile fotoğraflarını birlikte düzenlemek ve onların hikâyelerini anlatmak anı biriktirmeyi ortak bir etkinliğe dönüştürür.',
      },
      action: {
        student: 'Bu hafta her gün o güne dair üç cümle yaz ve hafta sonunda bir anını bir fotoğraf ya da çizimle birlikte sayfaya ekle.',
        parent: 'Bu hafta çocuğunuzla birlikte eski aile fotoğraflarına bakın ve birinin hikâyesini birlikte yazın.',
      },
      approach: 'Yazdıklarının özel olduğuna saygı gösterin; okumanızı istemediği şeyleri okumayın.',
    }),
  },
  sources: [
    {
      text: 'Goldberg, L. R. (2010). Personality, demographics, and self-reported behavioral acts: The development of avocational interest scales from estimates of the amount of time spent in interest-related activities. C. R. Agnew, D. E. Carlston, W. G. Graziano ve J. R. Kelly (Ed.), Then a miracle occurs: Focusing on behavior in social psychological theory and research. Oxford University Press.',
      url: 'https://doi.org/10.1093/acprof:oso/9780195377798.003.0011',
    },
  ],
};
