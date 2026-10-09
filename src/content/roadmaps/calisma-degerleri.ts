import { KAYNAK } from './kaynaklar';
import type { InterestArea, InterestRoadmapTemplate } from './types';

/**
 * Çalışma Değerleri: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öneriler bir meslek seçmez: en önem verilen değerlerin, meslekleri tanırken hangi sorularla kullanılabileceğini
 *    anlatır (değer uyumu iş doyumuyla ilişkili bulunmuştur: Kristof-Brown, Zimmerman ve Johnson, 2005). Öne çıkan
 *    değerler raporunkilerdir (lib/reports/build.ts, rankValues).
 *  - Gelir, güvence ve çalışma saati gibi koşulların mesleğe olduğu kadar iş yerine ve döneme göre de değişebileceği
 *    söylenir; belirli meslekler hakkında kesin bilgi verilmez. Örnek meslekler yalnızca bir değerin farklı işlerde
 *    karşılanabileceğini göstermek içindir.
 *  - Test yetişkinlere de açıktır; metinler okula özgü sözcük içermez: yetişkine öğrenci metni gösterilir.
 */
const area = (color: string, x: Omit<InterestArea, 'color'>): InterestArea => ({ color, ...x });

export const calismaDegerleriRoadmap: InterestRoadmapTemplate = {
  version: 'calisma-degerleri-yol-haritasi-1',
  what: {
    student: 'en önem verdiğin değerleri meslekleri tanırken nasıl kullanabileceğin',
    parent: 'çocuğunuzun en önem verdiği değerleri meslekleri tanırken nasıl kullanabileceği',
    summary: 'en önem verilen değerleri meslekleri tanırken kullanmak için öneriler',
  },
  studyTitle: { you: 'Değerlerine göre bir işi nasıl tanıyabilirsin?', parent: 'Çocuğunuz değerlerine göre bir işi nasıl tanıyabilir?' },
  studyIntro: {
    student:
      'Bir mesleği tanırken çoğu zaman ne iş yapıldığına bakılır; o işin senin için önemli olan şeyleri sunup sunmadığı ise gözden kaçabilir. Aşağıda en önem verdiğin değerler için, bir işi tanırken sorabileceğin sorular var.',
    parent:
      'Bir mesleği tanırken çoğu zaman ne iş yapıldığına bakılır; o işin çocuğunuz için önemli olan şeyleri sunup sunmadığı ise gözden kaçabilir. Aşağıda en önem verdiği değerler için, bir işi tanırken birlikte sorabileceğiniz sorular var.',
  },
  openNote: {
    student:
      'Birçok değere aynı önemi verdiğin için hiçbir değer öne çıkarılmadı. Aşağıdaki haftalarda önceliklerini netleştirmek için küçük denemeler var.',
    parent:
      'Çocuğunuz birçok değere aynı önemi verdiği için hiçbir değer öne çıkarılmadı. Aşağıdaki haftalarda önceliklerini netleştirmek için küçük denemeler var.',
  },
  lowNote: {
    student:
      'Değerlerin hepsini az önemli bulduğunu belirttiğin için hiçbir değer öne çıkarılmadı. Aşağıdaki haftalarda senin için neyin önemli olduğunu fark etmeye yönelik küçük denemeler var.',
    parent:
      'Çocuğunuz değerlerin hepsini az önemli bulduğunu belirttiği için hiçbir değer öne çıkarılmadı. Aşağıdaki haftalarda onun için neyin önemli olduğunu fark etmeye yönelik küçük denemeler var.',
  },
  firstWeek: {
    student:
      'Raporundaki sıralamaya bir kez daha bak: sana uyuyor mu? Bu hafta tanıdığın biri işinden memnun ya da şikâyetçi olduğunda, bunun hangi değerle ilgili olduğunu bir cümleyle yaz.',
    parent:
      'Raporu çocuğunuzla birlikte okuyun ve sıralamanın ona uyup uymadığını sorun. Bu hafta kendi işinizde ya da bildiğiniz bir işte insanı neyin memnun ettiğini, neyin zorladığını ona anlatın.',
    adult:
      'Raporundaki sıralamaya bir kez daha bak: sana uyuyor mu? Bu hafta kendi işinde ya da tanıdığın birinin işinde seni memnun eden ya da zorlayan bir şey olduğunda, bunun hangi değerle ilgili olduğunu bir cümleyle yaz.',
  },
  openWeeks: [
    {
      title: 'Bir işi yakından tanı',
      text: {
        student:
          'Bu hafta tanıdığın birine işini sor: işinde en çok neyi seviyor, neyden vazgeçmek zorunda kalmış? Cevaplarını kendi değerlerinle karşılaştır.',
        parent:
          'Bu hafta çocuğunuzla birlikte tanıdığınız birine işini sorun: işinde en çok neyi seviyor, neyden vazgeçmek zorunda kalmış? Cevapları çocuğunuzun değerleriyle karşılaştırın.',
      },
    },
    {
      title: 'Önceliklerini sına',
      text: {
        student:
          'Bu hafta iki hayalî iş düşün: biri sıralamanın en üstündeki değeri sunuyor ama ikinci sıradakini sunmuyor, öteki bunun tersi. Hangisini seçerdin? Nedenini bir iki cümleyle yaz.',
        parent:
          'Bu hafta çocuğunuzla iki hayalî iş düşünün: biri sıralamanın en üstündeki değeri sunuyor ama ikinci sıradakini sunmuyor, öteki bunun tersi. Hangisini seçeceğini ve nedenini konuşun.',
      },
    },
  ],
  lastWeek: {
    student:
      'Dört haftada yazdıklarına bak: sıralaman sana hâlâ uyuyor mu? En önem verdiğin üç değeri bir kâğıda yaz ve bir mesleği tanırken bu kâğıda göz at.',
    parent:
      'Dört haftada neler öğrendiğinizi çocuğunuzla konuşun; en önem verdiği üç değeri birlikte yazın ve meslekleri tanırken bu listeye göz atın.',
  },
  nextTests: ['mesleki-ilgi-profili', 'meslek-ilgi-alanlari'],
  nextPurpose: { you: 'hangi meslekleri tanımak isteyebileceğini görmek', parent: 'çocuğunuzun hangi meslekleri tanımak isteyebileceğini görmek' },
  links: [],
  areas: {
    learning: area('#7a4ee6', {
      explore: {
        student:
          'Bir mesleği tanırken o işte sıradan bir günün nasıl geçtiğini öğren: her gün benzer işler mi yapılıyor, yoksa işler çeşitli mi? O alanda insanların ne sıklıkla yeni bir şey öğrenmek zorunda kaldığını da sor. Bu soruların cevapları, işin seni ne kadar meraklı tutabileceğini gösterebilir.',
        parent:
          'Çocuğunuzla bir mesleği tanırken o işte sıradan bir günün nasıl geçtiğine birlikte bakın: her gün benzer işler mi yapılıyor, yoksa işler çeşitli mi? O alanda ne sıklıkla yeni şeyler öğrenmek gerektiğini de konuşun.',
      },
      action: {
        student:
          'Bu hafta merak ettiğin bir mesleği seç ve o işte sıradan bir günün nasıl geçtiğini araştır; günün ne kadarının tekrar, ne kadarının yeni işlerle geçtiğini yaz.',
        parent:
          'Bu hafta çocuğunuz merak ettiği bir mesleği seçsin ve o işte sıradan bir günün nasıl geçtiğini araştırsın; bulduklarını birlikte konuşun.',
      },
      approach: 'Merak ettiği konuları sorun ve yeni şeyler öğrenebileceği fırsatları birlikte arayın.',
    }),
    income: area('#d28a14', {
      explore: {
        student:
          'Bir mesleği tanırken başlangıçtaki gelirini, yıllar içinde nasıl değiştiğini ve bu gelire ulaşmak için ne kadar eğitim ve deneyim gerektiğini öğren. Gelirin iş yerine ve şehre göre ne kadar değiştiğini de sor; tek bir ortalama sayı yanıltıcı olabilir.',
        parent:
          'Çocuğunuzla meslekleri tanırken başlangıçtaki geliri, yıllar içinde nasıl değiştiğini ve bu gelire ulaşmak için ne kadar eğitim ve deneyim gerektiğini birlikte konuşun. Gelirin iş yerine ve şehre göre değişebileceğini de hatırlatın.',
      },
      action: {
        student:
          'Bu hafta merak ettiğin iki mesleğin gelirini karşılaştır: başlangıçta ve yıllar sonra ne kazanılıyor, bu gelire ulaşmak ne kadar sürüyor?',
        parent:
          'Bu hafta çocuğunuz merak ettiği iki mesleğin gelirini karşılaştırsın; başlangıçta ve yıllar sonra ne kazanıldığını birlikte konuşun.',
      },
      approach: 'Para hakkındaki sorularını geçiştirmeyin; gelirin nelere bağlı olduğunu açıkça konuşun.',
    }),
    helping: area('#df4777', {
      explore: {
        student:
          'Bir mesleği tanırken o işin kime ve nasıl yararı dokunduğunu sor. Yardım her zaman doğrudan olmaz: bir köprü yapan mühendis de, bir ilaç geliştiren araştırmacı da, bir hastaya bakan hemşire de insanlara yararlı olur. Yararın doğrudan ya da dolaylı olmasının senin için fark edip etmediğini düşün.',
        parent:
          'Çocuğunuzla meslekleri tanırken o işin kime ve nasıl yararı dokunduğunu konuşun. Yardım her zaman doğrudan olmaz: bir köprü yapan mühendis de, bir ilaç geliştiren araştırmacı da, bir hastaya bakan hemşire de insanlara yararlı olur.',
      },
      action: {
        student:
          'Bu hafta çevrende bir işin insanlara nasıl yararı dokunduğunu gözlemle ve bir cümleyle yaz; ardından aynı yararı sağlayan başka bir işi düşün.',
        parent:
          'Bu hafta çocuğunuzla çevrenizdeki bir işin insanlara nasıl yararı dokunduğunu konuşun; aynı yararı sağlayan başka işleri birlikte düşünün.',
      },
      approach: 'Başkalarına yardım ettiği anları fark ettiğinizi söyleyin; gönüllü bir etkinliğe katılmak isterse destekleyin.',
    }),
    independence: area('#0e9c8c', {
      explore: {
        student:
          'Bir mesleği tanırken o işte kararları kimin verdiğini sor: işin ne kadarı kurallara ve başkalarının onayına bağlı, ne kadarı kişinin kendi kararına bırakılmış? Bağımsızlığın deneyimle artıp artmadığını, kendi işini kurmanın ya da serbest çalışmanın o alanda mümkün olup olmadığını da öğren.',
        parent:
          'Çocuğunuzla meslekleri tanırken o işte kararları kimin verdiğini konuşun: işin ne kadarı kurallara bağlı, ne kadarı kişinin kendi kararına bırakılmış? Kendi işini kurmanın ya da serbest çalışmanın o alanda mümkün olup olmadığına da bakın.',
      },
      action: {
        student:
          'Bu hafta bir işi baştan sona kendi planınla yap: nasıl yapacağına sen karar ver ve sonunda bunun sana nasıl hissettirdiğini yaz.',
        parent:
          'Bu hafta çocuğunuz evde bir işi baştan sona kendi planıyla yapsın; nasıl yapacağına o karar versin, sonunda nasıl hissettiğini konuşun.',
      },
      approach: 'Kendi kararlarını verebileceği küçük sorumluluklar verin ve sonuçlarını birlikte değerlendirin.',
    }),
    security: area('#3b6fd8', {
      explore: {
        student:
          'Bir mesleği tanırken o alanda iş bulmanın ne kadar kolay olduğunu, işlerin ne kadar sürekli olduğunu ve gelirin düzenli olup olmadığını sor. Güvencenin mesleğe olduğu kadar iş yerine ve sözleşmenin türüne de bağlı olabileceğini unutma.',
        parent:
          'Çocuğunuzla meslekleri tanırken o alanda iş bulmanın ne kadar kolay olduğunu, işlerin ne kadar sürekli olduğunu ve gelirin düzenli olup olmadığını konuşun. Güvencenin iş yerine ve sözleşmenin türüne de bağlı olabileceğini hatırlatın.',
      },
      action: {
        student: 'Bu hafta tanıdığın birine, işinin ne kadar güvenceli olduğunu ve bunun onun için ne anlama geldiğini sor.',
        parent:
          'Bu hafta çocuğunuzla kendi işinizin ya da tanıdığınız birinin işinin ne kadar güvenceli olduğunu ve bunun ne anlama geldiğini konuşun.',
      },
      approach: 'Gelecekle ilgili düşüncelerini dinleyin; seçeneklerin ne kadar güvenceli olduğunu birlikte, abartmadan konuşun.',
    }),
    team: area('#ee6a36', {
      explore: {
        student:
          'Bir mesleği tanırken o işte günün ne kadarının başkalarıyla, ne kadarının tek başına geçtiğini sor. Ekip çalışmasının aynı meslekte bile iş yerine göre değişebileceğini, iş yerinin havasının da önemli olduğunu unutma.',
        parent:
          'Çocuğunuzla meslekleri tanırken o işte günün ne kadarının başkalarıyla, ne kadarının tek başına geçtiğini konuşun. Ekip çalışmasının aynı meslekte bile iş yerine göre değişebileceğini hatırlatın.',
      },
      action: {
        student:
          'Bu hafta bir işi başkalarıyla birlikte yap ve birlikte çalışmanın sana neyi kolaylaştırdığını, neyi zorlaştırdığını yaz.',
        parent:
          'Bu hafta çocuğunuz bir işi başkalarıyla birlikte yapsın; birlikte çalışmanın neyi kolaylaştırdığını ve zorlaştırdığını konuşun.',
      },
      approach: 'Ekip çalışması gerektiren etkinliklere katılmasını destekleyin.',
    }),
    status: area('#8a5a2b', {
      explore: {
        student:
          'Bir mesleği tanırken o alanda nasıl ilerlendiğini sor: hangi basamaklar var, bir basamaktan ötekine geçmek ne kadar sürüyor, başarı nasıl ölçülüyor? Saygınlığın yalnızca mesleğin adından değil, işin nasıl yapıldığından da gelebileceğini unutma.',
        parent:
          'Çocuğunuzla meslekleri tanırken o alanda nasıl ilerlendiğini konuşun: hangi basamaklar var, başarı nasıl ölçülüyor? Saygınlığın yalnızca mesleğin adından değil, işin nasıl yapıldığından da gelebileceğini hatırlatın.',
      },
      action: {
        student:
          'Bu hafta ilgini çeken bir alanda tanınmış birinin o noktaya nasıl geldiğini araştır ve hangi basamaklardan geçtiğini yaz.',
        parent:
          'Bu hafta çocuğunuz ilgisini çeken bir alanda tanınmış birinin o noktaya nasıl geldiğini araştırsın; geçtiği basamakları birlikte konuşun.',
      },
      approach: 'Başardıklarını fark ettiğinizi söyleyin; yalnızca sonucu değil, o sonuca nasıl ulaştığını da takdir edin.',
    }),
    balance: area('#4c9a2a', {
      explore: {
        student:
          'Bir mesleği tanırken haftada kaç saat çalışıldığını, akşam ya da hafta sonu çalışmanın ne kadar yaygın olduğunu ve iş yükünün dönemlere göre nasıl değiştiğini sor. Aynı meslekte bile çalışma düzeni iş yerine göre çok farklı olabilir.',
        parent:
          'Çocuğunuzla meslekleri tanırken haftada kaç saat çalışıldığını, akşam ya da hafta sonu çalışmanın ne kadar yaygın olduğunu konuşun. Aynı meslekte bile çalışma düzeninin iş yerine göre değişebileceğini hatırlatın.',
      },
      action: {
        student:
          'Bu hafta bir gününü yaz: çalışmaya, dinlenmeye ve sevdiklerine ne kadar zaman ayırdın? İdeal bir günde bu sürelerin nasıl olmasını isterdin?',
        parent:
          'Bu hafta çocuğunuzla ideal bir günde çalışmaya, dinlenmeye ve sevdiklerine ne kadar zaman ayırmak istediğini konuşun.',
      },
      approach: 'İş ve dinlenme dengesini onunla konuşun; dinlenmenin de önemli olduğunu gösterin.',
    }),
  },
  sources: [KAYNAK.lechner, KAYNAK.schwartz, KAYNAK.kristofBrown],
};
