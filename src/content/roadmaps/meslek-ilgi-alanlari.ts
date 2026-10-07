import { meslekIlgiAlanlariReport } from '@/content/reports/meslek-ilgi-alanlari';
import { meslekiIlgiProfiliRoadmap as riasec } from './mesleki-ilgi-profili';
import type { AudienceText, InterestArea, InterestRoadmapTemplate } from './types';

/**
 * Meslek İlgi Alanları (sekiz alan): gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Raporda her belirgin alanın ilişkili meslek alanları ve deneme fırsatları zaten yazılıdır; yol haritası onları
 *    tekrar etmez, eğitim yolları bölümü de yoktur. Keşif kartları, rapor şablonundaki (ücretsiz raporda gösterilmeyen)
 *    öğrenci ve veli önerileridir; haftalık denemeler ve yaklaşım önerileri bu dosyada yazılır.
 *  - İlgi, yetenek ya da başarı demek değildir; ilgiler denedikçe netleşir (Low ve ark., 2005). Öneriler meslek seçmez.
 *  - Test yetişkinlere açıktır: öğrenci metni okula özgüyse yetişkin metni yazılır.
 */
const tips = (key: string) => {
  const h = meslekIlgiAlanlariReport.scales[key].high!;
  return { student: h.tipsStudent.join(' '), parent: h.tipsParent.join(' ') };
};

const area = (key: string, color: string, x: { adultExplore?: string; action: AudienceText; approach: string }): InterestArea => ({
  color,
  explore: { ...tips(key), ...(x.adultExplore ? { adult: x.adultExplore } : {}) },
  action: x.action,
  approach: x.approach,
});

export const meslekIlgiAlanlariRoadmap: InterestRoadmapTemplate = {
  version: 'meslek-ilgi-alanlari-yol-haritasi-1',
  what: riasec.what,
  studyTitle: riasec.studyTitle,
  studyIntro: {
    ...riasec.studyIntro,
    adult: 'İlgiler denedikçe netleşir. Aşağıda en belirgin ilgi alanların için keşif önerileri var; yalnızca okuyarak değil, deneyerek karar ver.',
  },
  openNote: {
    ...riasec.openNote,
    adult: 'İlgilerin henüz belirgin biçimde ayrışmamış. Farklı alanları denemek için iyi bir zaman.',
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
    leadership: area('leadership', '#ee6a36', {
      adultExplore:
        'Bir projede ya da gönüllü bir ekipte sorumluluk üstlenmeyi dene. Sunum yaparak ve müzakere ederek ikna etme becerini geliştir; iyi bir lider önce iyi dinler.',
      action: {
        student: 'Bu hafta bir grup çalışmasında ya da kulüpte küçük bir sorumluluk üstlen (ör. toplantıyı yönetmek ya da görevleri dağıtmak) ve nasıl geçtiğini yaz.',
        parent: 'Bu hafta çocuğunuzdan bir konuda sizi ikna etmesini isteyin (ör. bir aile gezisinin rotası); gerekçelerini dinleyip birlikte değerlendirin.',
        adult: 'Bu hafta işte ya da gönüllü bir ekipte küçük bir sorumluluk üstlen (ör. bir toplantıyı yönetmek ya da görevleri dağıtmak) ve nasıl geçtiğini yaz.',
      },
      approach: 'Fikirlerini savunmasına alan açın; başkalarını dinlemenin de liderliğin parçası olduğunu konuşun.',
    }),
    organization: area('organization', '#d28a14', {
      adultExplore:
        'Ev bütçen ya da bir proje için basit bir bütçe tablosu hazırla. Hesap tablosu kullanmayı ileri düzeyde öğrenmek bu ilgiyi güçlü bir beceriye dönüştürür.',
      action: {
        student: 'Bu hafta bir haftalık harcamalarını ya da zamanını bir tabloya kaydet; hafta sonunda neyi fark ettiğini yaz.',
        parent: 'Bu hafta çocuğunuzla bir haftalık aile alışverişinin listesini ve bütçesini birlikte hazırlayın.',
      },
      approach: 'Planlama ve düzen becerisini takdir edin; aile işlerinde bu beceriyi kullanabileceği görevler verin.',
    }),
    altruism: area('altruism', '#df4777', {
      adultExplore: 'Bir sivil toplum kuruluşunda gönüllü olmayı dene. İnsanlarla çalışan meslekleri yakından tanımak için bir meslek sahibiyle konuş.',
      action: {
        student: 'Bu hafta birine bildiğin bir şeyi öğret ya da küçük bir yardımda bulun; bunun sana nasıl hissettirdiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte katılabileceğiniz güvenli bir gönüllülük etkinliği araştırın.',
      },
      approach: 'Yardım etme isteğini takdir edin; kendi ihtiyaçlarını da gözetmesini hatırlatın.',
    }),
    creativity: area('creativity', '#7a4ee6', {
      adultExplore:
        'Yaptığın çalışmaları düzenli olarak sakla; zamanla bir portfolyoya dönüşür. Sanat ve tasarım alanındaki kursları ve atölyeleri araştır; bu alanda bir eğitim programına başvurmayı düşünüyorsan çoğunun yetenek değerlendirmesi ya da portfolyo istediğini erkenden öğren.',
      action: {
        student: 'Bu hafta yaratıcı bir işe en az iki saat ayır ve ortaya çıkanı portfolyo klasörüne ekle.',
        parent: 'Bu hafta çocuğunuzun yaptığı bir çalışmayı evde görünür bir yere koyun ve onunla bu çalışma hakkında konuşun.',
      },
      approach: 'Yaratıcı denemelerini sonuca göre değil, emeğe göre takdir edin.',
    }),
    analysis: area('analysis', '#2f5ce0', {
      action: {
        student: 'Bu hafta merak ettiğin bir soruyu seç ve küçük bir deney ya da araştırmayla cevaplamaya çalış; sonucu bir sayfada yaz.',
        parent: 'Bu hafta çocuğunuzla bir bilim merkezini ya da çevrim içi bir bilim etkinliğini birlikte keşfedin.',
      },
      approach: 'Bilime ve matematiğe ilgisini takdir edin; zorlandığı problemlerde pes etmeden denemesini cesaretlendirin.',
    }),
    production: area('production', '#5a9e2f', {
      adultExplore:
        'Evde ya da çevrende bir tamir, bahçe ya da yapım projesi üstlen. Bu alandaki kursları ve sertifika programlarını tanımak için bir atölyeyi ya da eğitim merkezini ziyaret et.',
      action: {
        student: 'Bu hafta elle yapılan küçük bir proje seç (bir bitki yetiştirmek, bir eşyayı tamir etmek ya da bir maket yapmak) ve adım adım ilerle.',
        parent: 'Bu hafta çocuğunuzla güvenli koşullarda birlikte yapabileceğiniz bir tamir ya da bahçe işi seçin.',
      },
      approach: 'Elle yapılan işlerin ve teknik mesleklerin değerli olduğunu hissettirin.',
    }),
    adventure: area('adventure', '#0e9c8c', {
      adultExplore:
        'Heyecan veren etkinlikleri her zaman eğitmen eşliğinde ve güvenlik kurallarına uyarak dene. Spor ya da güvenlik alanındaki işlerin giriş koşullarını (fiziksel yeterlik, başvuru şartları) araştır.',
      action: {
        student: 'Bu hafta eğitmen eşliğinde yeni bir spor ya da doğa etkinliği dene ve sana nasıl geldiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte katılabileceğiniz düzenli bir spor ya da doğa etkinliği araştırın.',
      },
      approach: 'Enerjisini takdir edin; güvenlik kurallarının neden önemli olduğunu birlikte konuşun.',
    }),
    erudition: area('erudition', '#b5459b', {
      action: {
        student: 'Bu hafta her gün on dakika yaz (bir günlük, bir öykü ya da okuduğun bir şeyin özeti) ve hafta sonunda en sevdiğin yazını seç.',
        parent: 'Bu hafta çocuğunuzla birlikte bir kütüphaneye gidin ya da bir okuma kulübü araştırın.',
      },
      approach: 'Okuduklarını ve yazdıklarını dinlemeye zaman ayırın.',
    }),
  },
  sources: riasec.sources.slice(1),
};
