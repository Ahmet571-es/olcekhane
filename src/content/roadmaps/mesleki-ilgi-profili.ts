import { RIASEC_TYPES, type RiasecKey } from '@/content/careers/riasec';
import { besFaktorRoadmap as bf } from './bes-faktor';
import type { InterestArea, InterestRoadmapTemplate } from './types';

/**
 * Mesleki İlgi Profili (Holland'ın altı ilgi alanı): gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öğrenciye keşif önerileri ve Türkiye'deki eğitim yolları careers/riasec.ts'teki metinlerdir (ücretsiz raporda
 *    gösterilmezler); veliye, haftalık denemelere ve yaklaşım önerilerine bu dosyada yazılanlar kullanılır.
 *  - İlgi, yetenek ya da başarı demek değildir; ilgiler denedikçe netleşir (Low ve ark., 2005). Öneriler meslek
 *    seçmez; eğitim yolları yol gösterici örneklerdir.
 *  - Renkler altıgenin sırasını izler: komşu alanlar komşu renklerdedir.
 *  - Test yetişkinlere açık değildir; yetişkin metni yoktur.
 */
const area = (key: RiasecKey, color: string, x: { parent: string; action: { student: string; parent: string }; approach: string }): InterestArea => {
  const t = RIASEC_TYPES[key];
  const paths = `Lise: ${t.paths.lise} Üniversite: ${t.paths.universite}`;
  return {
    color,
    explore: { student: t.explore.join(' '), parent: x.parent },
    action: x.action,
    approach: x.approach,
    paths: { student: paths, parent: paths },
  };
};

export const meslekiIlgiProfiliRoadmap: InterestRoadmapTemplate = {
  version: 'mesleki-ilgi-profili-yol-haritasi-1',
  what: {
    student: 'ilgilerini nasıl keşfedebileceğin',
    parent: 'çocuğunuzun ilgilerini nasıl keşfedebileceği',
    summary: 'en belirgin ilgileri keşfetmek için öneriler',
  },
  studyTitle: { you: 'Nasıl keşfedebilirsin?', parent: 'Çocuğunuz nasıl keşfedebilir?' },
  studyIntro: {
    student:
      'İlgiler denedikçe netleşir: ergenlikte belli bir tutarlılık gösterir ama asıl kararlılık üniversite yıllarında artar. Aşağıda en belirgin ilgi alanların için keşif önerileri var; yalnızca okuyarak değil, deneyerek karar ver.',
    parent:
      'İlgiler denedikçe netleşir: ergenlikte belli bir tutarlılık gösterir ama asıl kararlılık üniversite yıllarında artar. Aşağıda çocuğunuzun en belirgin ilgi alanları için keşif önerileri var; ona bu alanları deneyebileceği fırsatlar sunabilirsiniz.',
  },
  openNote: {
    student: 'İlgilerin henüz belirgin biçimde ayrışmamış; bu yaşta çok yaygın. Farklı alanları denemek için iyi bir zaman.',
    parent: 'Çocuğunuzun ilgileri henüz belirgin biçimde ayrışmamış; bu yaşta çok yaygındır. Farklı alanları denemesi için iyi bir zaman.',
  },
  pathsNote: {
    student:
      'İlgi tek başına meslek seçtirmez: yeteneklerin, değerlerin ve gerçek deneyimlerin de önemlidir. Bu yollar yalnızca yol gösterici örneklerdir; tercih yaparken öğretmenlerinle ve rehber öğretmeninle konuş.',
    parent:
      'İlgi tek başına meslek seçtirmez: çocuğunuzun yetenekleri, değerleri ve gerçek deneyimleri de önemlidir. Bu yollar yalnızca yol gösterici örneklerdir; tercih döneminde okulun rehber öğretmeniyle görüşmenizi öneririz.',
  },
  firstWeek: {
    student: 'Raporundaki ilgi alanlarına bir kez daha göz at. Bu hafta hangi işleri yaparken zamanın nasıl geçtiğini fark etmediğini her gün bir cümleyle bir deftere yaz.',
    parent: bf.firstWeek.parent,
  },
  openWeeks: [
    {
      title: 'Yeni bir alan dene',
      text: {
        student: 'Bu hafta daha önce hiç denemediğin bir etkinliğe katıl (bir kulüp, bir atölye ya da çevrim içi bir ders) ve sana nasıl hissettirdiğini yaz.',
        parent: 'Bu hafta çocuğunuzla daha önce denemediği bir etkinlik seçin (bir kulüp, bir atölye ya da bir müze gezisi) ve sonra nasıl hissettirdiğini konuşun.',
      },
    },
    {
      title: 'Bir meslek sahibiyle konuş',
      text: {
        student: 'Bu hafta merak ettiğin bir mesleği yapan biriyle konuş: bir gününün nasıl geçtiğini ve işinde en çok neyi sevdiğini sor.',
        parent: 'Bu hafta çocuğunuzun merak ettiği bir mesleği yapan bir tanıdığınızla konuşmasına fırsat yaratın.',
      },
    },
  ],
  lastWeek: {
    student: 'Dört haftada hangi denemenin seni en çok heyecanlandırdığını yaz ve o alanda bir sonraki adımı seç.',
    parent: 'Dört haftada hangi denemenin onu en çok heyecanlandırdığını çocuğunuzla konuşun ve o alanda bir sonraki adımı birlikte seçin.',
  },
  nextTests: ['bes-faktor-kisilik', 'kisilerarasi-tarz'],
  nextPurpose: { you: 'kişilik özelliklerini de görmek', parent: 'çocuğunuzun kişilik özelliklerini de görmek' },
  links: [{ label: 'Meslek seçiminde ilgi envanterleri', href: '/rehber/meslek-seciminde-ilgi-envanterleri' }],
  areas: {
    realistic: area('R', '#5a9e2f', {
      parent:
        'Çocuğunuzun bu alanı yaparak tanıması için robotik, maket ya da tasarım-beceri atölyeleri iyi fırsatlar olabilir. Evdeki bir tamir işine katılması, bir bitki yetiştirmesi ya da bir atölyeyi veya çiftliği görmesi de bu alanı somutlaştırır.',
      action: {
        student: 'Bu hafta evde bozuk bir eşyayı bir büyüğünle birlikte tamir etmeyi dene ya da basit bir maket yap; en çok hangi aşamadan keyif aldığını yaz.',
        parent: 'Bu hafta çocuğunuzla evde birlikte yapabileceğiniz küçük bir tamir ya da yapım işi seçin ve işin bir bölümünü ona bırakın.',
      },
      approach: 'Yaparak öğrenme fırsatlarını destekleyin; elle yapılan işlerin teorik işler kadar değerli olduğunu hissettirin.',
    }),
    investigative: area('I', '#0e9c8c', {
      parent:
        'Bu alanı denemesi için çocuğunuzun bir bilim fuarı projesi hazırlamasını ya da TÜBİTAK proje yarışmalarını incelemesini destekleyebilirsiniz. Kodlama ya da veri analizi üzerine ücretsiz bir çevrim içi kurs, bir bilim merkezi ya da üniversite laboratuvarı ziyareti de iyi fırsatlardır.',
      action: {
        student: 'Bu hafta merak ettiğin bir soruyu seç; en az üç farklı kaynaktan araştır ve öğrendiklerini bir sayfada özetle.',
        parent: 'Bu hafta çocuğunuzdan merak ettiği bir soruyu araştırmasını ve bulduklarını size anlatmasını isteyin.',
      },
      approach: 'Sorularını ciddiye alın; cevabı hemen vermek yerine birlikte araştırın.',
    }),
    artistic: area('A', '#2f5ce0', {
      parent:
        'Çocuğunuzun sanat, müzik, tiyatro ya da dergi kulübüne katılmasını destekleyebilirsiniz. Bir kısa film, podcast ya da fotoğraf serisi hazırlaması; bir sergiyi, konseri ya da atölyeyi görmesi de bu alanı denemesi için iyi fırsatlardır.',
      action: {
        student: 'Bu hafta bir saatini kendi tasarımın olan bir işe ayır: bir çizim, bir kısa yazı, bir fotoğraf serisi ya da bir müzik denemesi.',
        parent: 'Bu hafta çocuğunuza yaratıcı bir iş için bir saat ve basit malzemeler ayırın; ortaya çıkanı yargılamadan birlikte konuşun.',
      },
      approach: 'Yaratıcı denemelerini sonuca göre değil, emeğe göre takdir edin.',
    }),
    social: area('S', '#7a4ee6', {
      parent:
        'Çocuğunuzun akran yardımında, küçük sınıflara okuma desteğinde ya da bir sosyal sorumluluk projesinde gönüllü olmasını destekleyebilirsiniz. Bir öğretmenle, hemşireyle ya da psikolojik danışmanla işleri üzerine konuşması da bu alanı tanımasına yardım eder.',
      action: {
        student: 'Bu hafta okulda ya da çevrende birine bir konuda yardım et (ör. bir arkadaşına konu anlat) ve bunun sana nasıl hissettirdiğini yaz.',
        parent: 'Bu hafta çocuğunuzla birlikte birine yardım edebileceğiniz küçük bir gönüllü iş bulun.',
      },
      approach: 'Başkalarına yardım ettiği anları fark edip takdir edin; kendi ihtiyaçlarını da gözetmesini hatırlatın.',
    }),
    enterprising: area('E', '#df4777', {
      parent:
        'Çocuğunuzun bir okul etkinliğinin ya da kulübünün organizasyonunu üstlenmesini, münazara ya da Model Birleşmiş Milletler gibi etkinliklere katılmasını destekleyebilirsiniz. Küçük bir girişim fikrinin maliyet ve fiyat hesabını birlikte yapmak da bu alanı denemesi için iyi bir fırsattır.',
      action: {
        student: 'Bu hafta küçük bir etkinliği baştan sona organize et (ör. bir sınıf etkinliği ya da aile gezisi): planla, görev dağıt ve sonucu değerlendir.',
        parent: 'Bu hafta küçük bir aile etkinliğinin (bir gezi ya da bir doğum günü) planlanmasını çocuğunuza bırakın.',
      },
      approach: 'Sorumluluk alabileceği projelere fırsat verin; bir şey yolunda gitmediğinde neyi öğrendiğini konuşun.',
    }),
    conventional: area('C', '#d28a14', {
      parent:
        'Çocuğunuzun bir okul etkinliğinin bütçesini ya da kayıtlarını tutmayı üstlenmesini destekleyebilirsiniz. Kendi harcamaları için bir tablo hazırlayıp bir ay takip etmesi ya da bir hesap tablosu programını ileri düzeyde öğrenmesi de bu alanı denemesi için iyi fırsatlardır.',
      action: {
        student: 'Bu hafta harcamaların ya da çalışma saatlerin için basit bir tablo oluştur ve her gün doldur; hafta sonunda neler gördüğünü yaz.',
        parent: 'Bu hafta çocuğunuzun kendi harcamaları ya da ders programı için bir tablo hazırlamasını ve bir hafta takip etmesini destekleyin.',
      },
      approach: 'Düzen ve ayrıntı gerektiren işlerde ona görev verin; bu becerilerin pek çok meslekte değerli olduğunu hatırlatın.',
    }),
  },
  sources: [
    {
      text: 'Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3. baskı). Psychological Assessment Resources.',
    },
    {
      text: 'Low, K. S. D., Yoon, M., Roberts, B. W. ve Rounds, J. (2005). The stability of vocational interests from early adolescence to middle adulthood: A quantitative review of longitudinal studies. Psychological Bulletin, 131(5), 713–737.',
      url: 'https://doi.org/10.1037/0033-2909.131.5.713',
    },
    {
      text: 'Nye, C. D., Su, R., Rounds, J. ve Drasgow, F. (2012). Vocational interests and performance: A quantitative summary of over 60 years of research. Perspectives on Psychological Science, 7(4), 384–403.',
      url: 'https://doi.org/10.1177/1745691612449021',
    },
  ],
};
