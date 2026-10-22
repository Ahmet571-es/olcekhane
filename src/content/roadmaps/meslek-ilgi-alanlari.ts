import { meslekiIlgiProfiliRoadmap as riasec } from './mesleki-ilgi-profili';
import type { AudienceText, InterestArea, InterestRoadmapTemplate } from './types';

/**
 * Meslek İlgi Alanları (sekiz alan): gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Raporda her belirgin alanın ilişkili meslek alanları zaten yazılıdır; deneme fırsatları (kulüp, kurs, gönüllülük)
 *    yalnızca yol haritasının keşif kartlarında ve haftalarında yazılır, rapordaki kartlar onları tekrar etmez. Eğitim
 *    yolları bölümü yoktur.
 *  - Belirgin alan yoksa raporun orta düzeydeki en üstteki (en çok iki) alanı gösterilir; düşük düzeydeki alan hiçbir
 *    zaman öne çıkarılmaz. Bu alanlar belirgin olmadığı için keşif kartları ve yaklaşım önerileri ilgiyi var saymaz:
 *    alanı denemeyi ve tanımayı önerir ("bu alanı denemek istersen").
 *  - İlgi, yetenek ya da başarı demek değildir; ilgiler denedikçe netleşir (Low ve ark., 2005). Öneriler meslek seçmez.
 *  - Test yetişkinlere açıktır: öğrenci metni okula özgüyse yetişkin metni yazılır.
 */
const area = (color: string, x: { explore: AudienceText; action: AudienceText; approach: string }): InterestArea => ({
  color,
  explore: x.explore,
  action: x.action,
  approach: x.approach,
});

export const meslekIlgiAlanlariRoadmap: InterestRoadmapTemplate = {
  version: 'meslek-ilgi-alanlari-yol-haritasi-1',
  what: riasec.what,
  studyTitle: riasec.studyTitle,
  studyIntro: {
    ...riasec.studyIntro,
    adult: 'İlgiler denedikçe netleşir. Aşağıda en üstte çıkan ilgi alanların için keşif önerileri var; yalnızca okuyarak değil, deneyerek karar ver.',
  },
  openNote: {
    ...riasec.openNote,
    adult: 'İlgilerin belirgin bir yönde toplanmıyor; geniş bir alana yayılmış olabilir. Farklı alanları denemek için iyi bir zaman.',
  },
  lowNote: {
    student:
      'İşlerin çoğundan pek hoşlanmayacağını belirttiğin için hiçbir alan öne çıkarılmadı. Bu olağan bir durum; aşağıdaki haftalarda farklı alanları denemen için küçük adımlar var.',
    parent:
      'Çocuğunuz işlerin çoğundan pek hoşlanmayacağını belirttiği için hiçbir alan öne çıkarılmadı. Bu olağan bir durum; aşağıdaki haftalarda farklı alanları denemesi için küçük adımlar var.',
    adult: 'İşlerin çoğundan pek hoşlanmayacağını belirttiğin için hiçbir alan öne çıkarılmadı. Aşağıdaki haftalarda farklı alanları denemen için küçük adımlar var.',
  },
  firstWeek: riasec.firstWeek,
  openWeeks: [
    {
      title: riasec.openWeeks[0].title,
      text: {
        ...riasec.openWeeks[0].text,
        adult: 'Bu hafta daha önce hiç denemediğin bir etkinliğe katıl (bir atölye, bir kurs ya da bir gönüllü çalışma) ve sana nasıl hissettirdiğini yaz.',
      },
    },
    riasec.openWeeks[1],
  ],
  lastWeek: riasec.lastWeek,
  nextTests: ['ayrintili-kisilik-profili', 'kisilerarasi-tarz', 'bes-faktor-kisilik'],
  nextPurpose: riasec.nextPurpose,
  links: riasec.links,
  areas: {
    leadership: area('#ee6a36', {
      explore: {
        student:
          'Bu alanı yakından tanımak istersen okulda bir kulüp ya da proje ekibinde küçük bir sorumluluk üstlenmeyi dene. Münazara ya da sunum gibi etkinlikler ikna etmenin sana nasıl geldiğini görmeni sağlar; iyi bir lider önce iyi dinler.',
        parent:
          'Bu alanı tanıması için bir aile gezisi ya da doğum günü gibi küçük bir etkinliğin planlanmasını ona bırakabilirsiniz. Münazara, Model Birleşmiş Milletler ya da öğrenci meclisi gibi etkinlikler de bu alanı denemesi için iyi fırsatlardır.',
        adult:
          'Bu alanı yakından tanımak istersen bir sunum hazırlamayı ya da bir tartışmada bir görüşü savunmayı dene; ikna etmenin ve yön vermenin sana nasıl geldiğini görürsün. Yöneticilik yapan biriyle işinin nasıl geçtiğini konuşmak da fikir verir.',
      },
      action: {
        student: 'Bu hafta bir grup çalışmasında ya da kulüpte küçük bir sorumluluk üstlen (ör. toplantıyı yönetmek ya da görevleri dağıtmak) ve nasıl geçtiğini yaz.',
        parent: 'Bu hafta çocuğunuzdan bir konuda sizi ikna etmesini isteyin (ör. bir aile gezisinin rotası); gerekçelerini dinleyip birlikte değerlendirin.',
        adult: 'Bu hafta işte ya da gönüllü bir ekipte küçük bir sorumluluk üstlen (ör. bir toplantıyı yönetmek ya da görevleri dağıtmak) ve nasıl geçtiğini yaz.',
      },
      approach: 'Fikirlerini savunmasına alan açın; başkalarını dinlemenin de liderliğin parçası olduğunu konuşun.',
    }),
    organization: area('#d28a14', {
      explore: {
        student:
          'Bu alanı denemek istersen kendi harçlığın ya da bir okul etkinliği için basit bir bütçe tablosu hazırla. Hesap tablosu (Excel gibi) kullanmayı öğrenmek, düzenleme ve kayıt tutma işlerinin sana ne kadar keyif verdiğini görmenin kolay bir yoludur; bu beceri pek çok işte de yararlıdır.',
        parent:
          'Harçlık ya da aile bütçesiyle ilgili küçük planlamalara onu da katabilirsiniz. Hesap tablosu kullanmayı ve temel finans okuryazarlığını öğrenmesi, düzen ve planlama işlerinin ona nasıl geldiğini görmesini sağlar.',
        adult:
          'Bu alanı denemek istersen ev bütçen ya da bir proje için basit bir bütçe tablosu hazırla. Hesap tablosu kullanmayı biraz daha ileri düzeyde öğrenmek, düzenleme ve kayıt tutma işlerinin sana ne kadar keyif verdiğini görmeni sağlar.',
      },
      action: {
        student: 'Bu hafta bir haftalık harcamalarını ya da zamanını bir tabloya kaydet; hafta sonunda neyi fark ettiğini yaz.',
        parent: 'Bu hafta çocuğunuzla bir haftalık aile alışverişinin listesini ve bütçesini birlikte hazırlayın.',
      },
      approach: 'Aile işlerinde planlama ve düzen gerektiren görevler verin; nasıl gittiğini birlikte konuşun.',
    }),
    altruism: area('#df4777', {
      explore: {
        student:
          'Bu alanı yakından tanımak istersen bir gönüllülük projesinde ya da akran öğretmenliğinde görev almayı dene. İnsanlarla çalışan meslekleri merak ediyorsan bir öğretmenle, hemşireyle ya da danışmanla işi üzerine konuşabilirsin.',
        parent:
          'Güvenli gönüllülük etkinliklerine (sivil toplum, okul projeleri) katılmasını destekleyebilirsiniz. Tanıdığınız bir öğretmen, hemşire ya da danışmanla bir meslek sohbeti ayarlamak da insanlarla çalışan işleri yakından görmesini sağlar.',
        adult:
          'Bu alanı yakından tanımak istersen bir sivil toplum kuruluşunda gönüllü olmayı dene. İnsanlarla çalışan meslekleri merak ediyorsan bu işi yapan biriyle konuş.',
      },
      action: {
        student: 'Bu hafta birine bildiğin bir şeyi öğret ya da küçük bir yardımda bulun; bunun sana nasıl hissettirdiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte katılabileceğiniz güvenli bir gönüllülük etkinliği araştırın.',
      },
      approach: 'Başkalarına yardım ettiği anları fark edin; kendi ihtiyaçlarını da gözetmesini hatırlatın.',
    }),
    creativity: area('#7a4ee6', {
      explore: {
        student:
          'Bu alanı denemek istersen kısa bir kursta ya da bir kulüpte bir sanat dalını dene ve yaptığın çalışmaları sakla; ileride bir portfolyo için temel olabilir. Sanatla ilgili bölümleri merak ediyorsan çoğunda yetenek sınavı ya da portfolyo istendiğini erkenden araştır.',
        parent:
          'Sanat, müzik ya da tasarım kurslarını ve kulüplerini birlikte araştırabilirsiniz. Yaptığı çalışmaları görünür kılmak ve sergilemesi için fırsat yaratmak, bu alanın ona ne kadar keyif verdiğini görmesini sağlar.',
        adult:
          'Bu alanı denemek istersen sanat ve tasarım alanındaki kısa kursları ya da atölyeleri araştır ve yaptığın çalışmaları sakla; zamanla bir portfolyoya dönüşebilir. Bu alanda bir eğitim programına başvurmayı düşünüyorsan çoğunun yetenek değerlendirmesi ya da portfolyo istediğini erkenden öğren.',
      },
      action: {
        student: 'Bu hafta yaratıcı bir işe en az iki saat ayır ve ortaya çıkanı portfolyo klasörüne ekle.',
        parent: 'Bu hafta çocuğunuzun yaptığı bir çalışmayı evde görünür bir yere koyun ve onunla bu çalışma hakkında konuşun.',
      },
      approach: 'Yaratıcı denemelerini sonuca göre değil, emeğe göre takdir edin.',
    }),
    analysis: area('#2f5ce0', {
      explore: {
        student:
          'Bu alanı denemek istersen merak ettiğin bir soruyu küçük bir araştırma projesine dönüştür. Kodlama ya da veri analizi üzerine kısa bir çevrim içi kurs, bilimsel düşünmenin sana nasıl geldiğini görmenin kolay bir yoludur.',
        parent:
          'Bilim merkezleri, bilim kulüpleri ve proje yarışmaları gibi fırsatları birlikte araştırabilirsiniz. Sorularına hemen cevap vermek yerine cevabı birlikte araştırmayı önermek de bu alanı denemesi için iyi bir yoldur.',
      },
      action: {
        student: 'Bu hafta merak ettiğin bir soruyu seç ve küçük bir deney ya da araştırmayla cevaplamaya çalış; sonucu bir sayfada yaz.',
        parent: 'Bu hafta çocuğunuzla bir bilim merkezini ya da çevrim içi bir bilim etkinliğini birlikte keşfedin.',
      },
      approach: 'Bilimle ve matematikle ilgili sorularını ciddiye alın; zorlandığı problemlerde pes etmeden denemesini cesaretlendirin.',
    }),
    production: area('#5a9e2f', {
      explore: {
        student:
          'Bu alanı denemek istersen evde ya da okulda bir tamir, bahçe ya da yapım projesi üstlen. Meslek liselerini ve teknik bölümleri merak ediyorsan birini ziyaret ederek orada neler yapıldığını görebilirsin.',
        parent:
          'Güvenli koşullarda alet kullanmayı öğrenebileceği fırsatlar yaratmak, elle yapılan işlerin ona nasıl geldiğini görmesini sağlar. Merak ederse meslek liselerini ve teknik bölümleri önyargısız biçimde birlikte araştırabilirsiniz.',
        adult:
          'Bu alanı denemek istersen evde ya da çevrende bir tamir, bahçe ya da yapım projesi üstlen. Bu alandaki kursları ve sertifika programlarını tanımak için bir atölyeyi ya da eğitim merkezini ziyaret et.',
      },
      action: {
        student: 'Bu hafta elle yapılan küçük bir proje seç (bir bitki yetiştirmek, bir eşyayı tamir etmek ya da bir maket yapmak) ve adım adım ilerle.',
        parent: 'Bu hafta çocuğunuzla güvenli koşullarda birlikte yapabileceğiniz bir tamir ya da bahçe işi seçin.',
      },
      approach: 'Elle yapılan işlerin ve teknik mesleklerin değerli olduğunu hissettirin.',
    }),
    adventure: area('#0e9c8c', {
      explore: {
        student:
          'Bu alanı denemek istersen heyecan veren etkinlikleri her zaman eğitmen eşliğinde ve güvenlik kurallarına uyarak dene. Spor ya da güvenlik alanındaki meslekleri merak ediyorsan giriş koşullarını (fiziksel yeterlik, sınavlar) erkenden araştır.',
        parent:
          'Güvenli ve düzenli bir spor ya da doğa etkinliğine katılmasını destekleyebilirsiniz. Spor ya da güvenlik alanındaki meslekleri merak ederse giriş koşullarını birlikte araştırın.',
        adult:
          'Bu alanı denemek istersen heyecan veren etkinlikleri her zaman eğitmen eşliğinde ve güvenlik kurallarına uyarak dene. Spor ya da güvenlik alanındaki işleri merak ediyorsan giriş koşullarını (fiziksel yeterlik, başvuru şartları) araştır.',
      },
      action: {
        student: 'Bu hafta eğitmen eşliğinde yeni bir spor ya da doğa etkinliği dene ve sana nasıl geldiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte katılabileceğiniz düzenli bir spor ya da doğa etkinliği araştırın.',
      },
      approach: 'Yeni ve hareketli etkinlikleri denemesine fırsat verin; güvenlik kurallarının neden önemli olduğunu birlikte konuşun.',
    }),
    erudition: area('#b5459b', {
      explore: {
        student:
          'Bu alanı denemek istersen okuduklarını kısa yazılarla özetlemeyi ya da bir blog tutmayı dene. Bir yabancı dili düzenli olarak çalışmak da dil ve yazı işlerinin sana ne kadar keyif verdiğini görmeni sağlar.',
        parent:
          'Kütüphane üyeliği, kitap kulüpleri ve yazı yarışmaları gibi fırsatları destekleyebilirsiniz. Yabancı dil öğrenmek isterse düzenli bir çalışma planı yapmasına yardım etmek de dil ve yazı işlerini denemesini sağlar.',
      },
      action: {
        student: 'Bu hafta her gün on dakika yaz (bir günlük, bir öykü ya da okuduğun bir şeyin özeti) ve hafta sonunda en sevdiğin yazını seç.',
        parent: 'Bu hafta çocuğunuzla birlikte bir kütüphaneye gidin ya da bir okuma kulübü araştırın.',
      },
      approach: 'Okuduklarını ve yazdıklarını dinlemeye zaman ayırın.',
    }),
  },
  sources: riasec.sources.slice(1),
};
