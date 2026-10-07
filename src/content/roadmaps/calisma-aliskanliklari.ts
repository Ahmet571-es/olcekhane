import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * Çalışma Alışkanlıkları Envanteri: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Bu test kişilik değil davranış ölçer; her alışkanlık için bir sonraki küçük adım önerilir. Öneriler, rapor
 *    şablonundaki (ekranda gösterilmeyen) öğrenci ve veli önerilerine ve öğrenme araştırmalarına dayanır (kendini
 *    sınama, aralıklı tekrar, "Bu neden böyle?" diye sorma; Dunlosky ve ark., 2013; Roediger ve Karpicke, 2006;
 *    Cepeda ve ark., 2006). Ekranda gösterilen rapor metinleri tekrar edilmez.
 *  - Alışkanlıklar meslek ortamı anlatmadığı için ortamlar bölümü yoktur.
 *  - 2. hafta "Çalışma düzeni" (Planlama); 3. hafta en düşük puanlı alışkanlık: en çok geliştirilebilecek olan.
 *  - Test yetişkinlere açık değildir; yetişkin metni yoktur.
 */
export const calismaAliskanliklariRoadmap: RoadmapTemplate = {
  version: 'calisma-aliskanliklari-yol-haritasi-1',
  planningScale: 'planning',
  thirdWeek: 'lowest',
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Aşağıda her alışkanlığın için bir sonraki küçük adım var; hepsini birden değil, birer birer dene.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Aşağıda çocuğunuzun her alışkanlığı için bir sonraki küçük adım var; hepsini birden değil, birer birer denemesine destek olun.',
  },
  firstWeek: {
    student: 'Raporundaki beş alışkanlığa bak. Bu hafta çalışırken hangisini ne zaman kullandığını her gün bir cümleyle bir deftere yaz.',
    parent: bf.firstWeek.parent,
  },
  lastWeek: bf.lastWeek,
  nextTests: bf.nextTests,
  approach: {
    planning: {
      low: 'Yaptığı küçük planları ve planına uyduğu günleri fark ettiğinizi ona söyleyin.',
      average: 'Sonuçtan çok düzenli çabayı övün.',
      high: 'Planların esnek olabileceğini, aksayan günlerin de normal olduğunu hatırlatın.',
    },
    retrieval: {
      low: 'Soru kartları hazırlamasına yardım edin ve arada bir onu sınayın.',
      average: 'Sınavdan önceki son akşam yerine günlere yayılmış kısa tekrarları destekleyin.',
      high: 'Zorlandığı sorularda pes etmeden yeniden denemesini cesaretlendirin.',
    },
    understanding: {
      low: 'Konuları gündelik hayattan örneklerle ilişkilendirmesine yardım edin.',
      average: 'Anlamadığı bir yeri geçmek yerine üzerinde durmasını destekleyin.',
      high: 'Onun anlattıklarını dinlemeye zaman ayırın; sorularını ciddiye alın.',
    },
    focus: {
      low: 'Sessiz ve düzenli bir çalışma köşesini birlikte kurun.',
      average: 'Çalışırken onu sık sık bölmemeye özen gösterin.',
      high: 'Dikkatini toplayabildiğini fark ettiğinizi söyleyin; ekran dışı dinlenme zamanlarını destekleyin.',
    },
    help: {
      low: 'Soru sormanın bir zayıflık değil, güçlü bir öğrenme davranışı olduğunu söyleyin.',
      average: 'Hatalarını paylaştığında sakin ve meraklı bir tutum gösterin.',
      high: 'Soru sorup araştırma tutumunu takdir ettiğinizi söyleyin.',
    },
  },
  scales: {
    planning: {
      color: '#2f5ce0',
      study: {
        low: {
          student:
            'Çalışmaya genellikle plansız başlıyorsun; bu çok yaygın ve küçük adımlarla değişir. İşe en kısa planla başla: her akşam beş dakika ayırıp ertesi gün neyi çalışacağını üç madde olarak yaz. Büyük bir ödevi parçalara bölüp her parçaya bir gün vermek, son güne kalan işi azaltır.',
          parent:
            'Çocuğunuz çalışmaya genellikle plansız başlıyor olabilir; bu yaygındır ve küçük adımlarla değişir. Her akşam beş dakika ayırıp ertesi gün neyi çalışacağını üç madde olarak yazmasını önerebilirsiniz. Bunu birkaç hafta birlikte sürdürmek alışkanlığa dönüşmesini kolaylaştırır.',
        },
        average: {
          student:
            'Bazen planlı çalışıyorsun, bazen işler son güne kalıyor. Sınav ve ödev tarihlerini öğrenir öğrenmez takvimine yaz ve geriye doğru çalışma günleri belirle. Gün sonunda planının ne kadarını yaptığına bakıp kalanı ertesi güne aktarmak, planı alışkanlığa çevirir.',
          parent:
            'Çocuğunuz bazen planlı çalışıyor, bazen işler son güne kalıyor. Sınav ve ödev tarihlerini öğrenir öğrenmez takvime yazıp geriye doğru çalışma günleri belirlemesi, planlamayı alışkanlığa çevirir.',
        },
        high: {
          student:
            'Çalışmanı önceden planlıyorsun. Planını bir adım ileri taşı: öğrendiğin konulara birkaç gün ve bir hafta sonra dönen kısa tekrarlar ekle. Planına dinlenme ve boş zamanları da yazmak, temponu uzun süre korumanı sağlar.',
          parent:
            'Çocuğunuz çalışmasını önceden planlıyor. Planına öğrendiği konulara birkaç gün sonra dönen kısa tekrarlar eklemesi ve dinlenme zamanlarına da yer ayırması bu alışkanlığı daha da verimli kılar.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her akşam beş dakika ayır ve ertesi gün çalışacağın üç şeyi bir kâğıda yaz; ertesi akşam hangilerini yaptığını işaretle.',
          parent: 'Bu hafta çocuğunuzla her akşam beş dakika oturup ertesi gün çalışacağı üç şeyi yazmasına eşlik edin; planı onun yapmasına fırsat verin.',
        },
        average: {
          student: 'Bu hafta yaklaşan bir sınavın ya da ödevin tarihini takvimine yaz ve o güne kadar hangi gün neyi çalışacağını geriye doğru planla.',
          parent: 'Bu hafta çocuğunuzla yaklaşan bir sınavın tarihini takvime yazın ve o güne kadar hangi gün neyi çalışacağını birlikte planlayın.',
        },
        high: {
          student: 'Bu hafta planına, geçen hafta öğrendiğin iki konu için 10’ar dakikalık tekrar ekle ve bu tekrarları kitaba bakmadan yap.',
          parent: 'Bu hafta çocuğunuzdan planına geçen hafta öğrendiği konular için kısa tekrarlar eklemesini isteyin.',
        },
      },
    },
    retrieval: {
      color: '#7a4ee6',
      study: {
        low: {
          student:
            'Tekrar yaparken daha çok notlarını yeniden okuyorsun. Bunu küçük bir değişiklikle güçlendirebilirsin: bir konuyu okuduktan sonra kitabı kapat, hatırladığın her şeyi boş bir kâğıda yaz ve sonra kitapla karşılaştır. Aynı konuyu tek günde üç kez okumak yerine üç ayrı günde kısaca tekrar etmek de daha kalıcıdır.',
          parent:
            'Çocuğunuz tekrar yaparken daha çok notlarını yeniden okuyor olabilir. Okuduğu bir konudan sonra kitabı kapatıp hatırladıklarını boş bir kâğıda yazması ve sonra kitapla karşılaştırması, aynı süreyle çok daha kalıcı öğrenmesini sağlar.',
        },
        average: {
          student:
            'Bazen kendini sınıyor, bazen yalnızca yeniden okuyorsun. Her çalışma oturumunu kitaba bakmadan cevaplayacağın birkaç soruyla bitir. Öğrendiğin konulara ertesi gün, birkaç gün sonra ve bir hafta sonra kısaca dönmek, aynı sürede daha kalıcı öğrenmeni sağlar.',
          parent:
            'Çocuğunuz bazen kendini sınıyor, bazen yalnızca yeniden okuyor. Her çalışmayı kitaba bakmadan cevaplayacağı birkaç soruyla bitirmesi ve konulara ertesi gün, birkaç gün sonra ve bir hafta sonra dönmesi daha kalıcı öğrenmesini sağlar.',
        },
        high: {
          student:
            'Kendini sınamak ve tekrarı günlere yaymak zaten alışkanlığın. Bir adım ileri git: farklı konulardan soruları karışık sırayla çöz. Takıldığın soruları ayrı bir yere not edip birkaç gün sonra yeniden denemek, eksiklerini kapatmanın en kısa yoludur.',
          parent:
            'Kendini sınamak ve tekrarı günlere yaymak çocuğunuzun alışkanlığı. Farklı ünitelerden soruları karışık sırayla çözmesi ve takıldığı soruları birkaç gün sonra yeniden denemesi bu güçlü alışkanlığı bir adım ileri taşır.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta çalıştığın her konudan sonra kitabı kapat ve hatırladıklarını iki dakikada bir kâğıda yaz; sonra kitapla karşılaştır.',
          parent: 'Bu hafta çocuğunuza “Ders çalıştın mı?” yerine “Bugün öğrendiğin bir şeyi bana anlatır mısın?” diye sorun.',
        },
        average: {
          student: 'Bu hafta bir konuyu üç ayrı günde (bugün, iki gün sonra ve hafta sonunda) beşer soruyla tekrar et; her seferinde kaç soruyu bildiğini yaz.',
          parent: 'Bu hafta çocuğunuzla, öğrendiği bir konuyu üç ayrı günde kısa sorularla tekrar etmesi için bir plan yapın.',
        },
        high: {
          student: 'Bu hafta iki farklı dersin konularından karışık sırayla on soru çöz; yanlış yaptıklarını not edip üç gün sonra yeniden dene.',
          parent: 'Bu hafta çocuğunuzla farklı ünitelerden karışık sorular bulun; takıldığı soruları birkaç gün sonra yeniden çözmesini önerin.',
        },
      },
    },
    understanding: {
      color: '#0e9c8c',
      study: {
        low: {
          student:
            'Konuları çoğu zaman ezberleyerek çalışıyorsun. Anlamaya geçmenin en kolay yolu soru sormaktır: her yeni bilgi için kendine “Bu neden böyle?” diye sor ve cevabını bir cümleyle yaz. Öğrendiğin konuyu kendi cümlelerinle birine anlatmak da nerede anlamadığını gösterir.',
          parent:
            'Çocuğunuz konuları çoğu zaman ezberleyerek çalışıyor olabilir. Anlamaya geçmenin en kolay yolu soru sormaktır: her yeni bilgi için kendine “Bu neden böyle?” diye sormasını ve cevabını bir cümleyle yazmasını önerebilirsiniz.',
        },
        average: {
          student:
            'Bazen konuları anlamaya çalışıyor, bazen ezberliyorsun. Yeni bir konuyu daha önce bildiğin bir şeye benzetmeye çalış; bir problemin çözüm adımlarını da kendine sesli açıkla. Bu iki alışkanlık, öğrendiğin bilgileri birbirine bağlar.',
          parent:
            'Çocuğunuz bazen konuları anlamaya çalışıyor, bazen ezberliyor. Yeni bir konuyu daha önce bildiği bir şeye benzetmesi ve çözüm adımlarını sesli açıklaması anlamaya dayalı çalışmayı güçlendirir.',
        },
        high: {
          student:
            'Konuları anlamaya ve bildiklerinle ilişkilendirmeye çalışıyorsun. Anlamak ile hatırlamak birbirini tamamlar: anladığın konuları kendini sınayarak pekiştir. Merak ettiğin konularda ders kitabının ötesine geçen kaynaklar aramak da öğrenmeni derinleştirir.',
          parent:
            'Çocuğunuz konuları anlamaya ve bildikleriyle ilişkilendirmeye çalışıyor. Anladığı konuları kendini sınayarak pekiştirmesi önemlidir; merak ettiği konularda farklı kaynaklara ulaşmasına da destek olabilirsiniz.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her gün öğrendiğin bir bilgi için “Bu neden böyle?” diye sor ve cevabını bir cümleyle yaz.',
          parent: 'Bu hafta çocuğunuzdan her gün öğrendiği bir şeyi size anlatmasını isteyin ve merakla “Neden?” diye sorun.',
        },
        average: {
          student: 'Bu hafta zorlandığın bir problemin çözümünü adım adım sesli açıkla ya da yaz; açıklayamadığın adımı yeniden çalış.',
          parent: 'Bu hafta çocuğunuzdan çözdüğü bir problemi adım adım size açıklamasını isteyin; doğru cevaptan çok akıl yürütmesini takdir edin.',
        },
        high: {
          student: 'Bu hafta merak ettiğin bir konuda ders kitabı dışında bir kaynak bul ve öğrendiklerini beş cümleyle özetle.',
          parent: 'Bu hafta çocuğunuzla merak ettiği bir konu hakkında bir belgesel izleyin ya da bir kitap bulun ve sonra birlikte konuşun.',
        },
      },
    },
    focus: {
      color: '#d28a14',
      study: {
        low: {
          student:
            'Ders çalışırken dikkatin sık sık dağılıyor; bu çok yaygın. Kendini zorlamak yerine ortamı değiştir: çalışırken telefonunu başka bir odaya koy ve yalnızca molada bak. 25 dakika çalışıp 5 dakika mola vermek de dikkatini toplamayı kolaylaştırır.',
          parent:
            'Çocuğunuz ders çalışırken dikkatinin sık sık dağıldığını belirtiyor. Telefonun çalışma süresince başka bir odada durması ve 25 dakika çalışıp 5 dakika mola vermesi odaklanmasını kolaylaştırabilir.',
        },
        average: {
          student:
            'Bazen dikkatini toplayabiliyor, bazen dağılıyorsun. Çalışmaya başlamadan önce masandan ilgisiz her şeyi kaldır ve bildirimleri kapat. Zor konuları günün dikkatinin en iyi olduğu saatlerine koymak da işini kolaylaştırır.',
          parent:
            'Çocuğunuz bazen dikkatini toplayabiliyor, bazen dağılıyor. Çalışmaya başlamadan masasını düzenlemesi, bildirimleri kapatması ve zor konuları dikkatinin en iyi olduğu saatlere koyması odaklanmasını destekler.',
        },
        high: {
          student:
            'Dikkat dağıtıcıları uzak tutabiliyorsun. Bu gücü en zor işlere ayır: yeni ve zor konuları dikkatinin taze olduğu saatlerde çalış. Uzun çalışmalarda düzenli mola vermek ve yeterince uyumak, odaklanmanı gün boyu korur.',
          parent:
            'Çocuğunuz dikkat dağıtıcıları uzak tutabiliyor. Yeterli uyku ve düzenli molalar bu gücü korur; yeni ve zor konuları dikkatinin taze olduğu saatlerde çalışmasını önerebilirsiniz.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta her çalışmada telefonunu başka bir odaya koy ve 25 dakika çalışıp 5 dakika mola ver; günde kaç tur yaptığını yaz.',
          parent: 'Bu hafta çocuğunuzun çalışma saatlerinde evdeki bütün telefonların bir yerde toplandığı küçük bir aile kuralı deneyin.',
        },
        average: {
          student: 'Bu hafta çalışmaya başlamadan önce iki dakika ayırıp masanı topla ve bildirimleri kapat; dikkatinin nasıl değiştiğini gözle.',
          parent: 'Bu hafta çocuğunuzun çalışma saatlerinde evdeki gürültüyü azaltmaya çalışın ve molalarını ekran yerine hareketle geçirmesini önerin.',
        },
        high: {
          student: 'Bu hafta en zor dersini dikkatinin en taze olduğu saate koy ve uzun bir çalışmayı 25 dakikalık bölümlere ayırıp aralarda kısa molalar ver.',
          parent: 'Bu hafta çocuğunuzla uyku saatini birlikte gözden geçirin; yeterli uyku odaklanmayı destekler.',
        },
      },
    },
    help: {
      color: '#df4777',
      study: {
        low: {
          student:
            'Takıldığında ya da yanlış yaptığında çoğu zaman üzerinde durmadan geçiyorsun. Yanlışların, neyi yeniden çalışman gerektiğini gösteren en iyi rehberdir: her sınavdan ya da denemeden sonra yanlışlarını bir deftere yaz ve nedenini not et. Anlamadığın bir şeyi aynı gün öğretmenine ya da bir arkadaşına sormak da konuların birikmesini önler.',
          parent:
            'Çocuğunuz takıldığında ya da yanlış yaptığında çoğu zaman üzerinde durmadan geçiyor olabilir. Her sınavdan sonra yanlışlarını bir deftere yazıp nedenini not etmesi ve anlamadığını aynı gün sorması konuların birikmesini önler.',
        },
        average: {
          student:
            'Bazen yanlışlarını inceliyor ve yardım istiyorsun. Takıldığında önce ne bildiğini yaz, sonra soruyu sor; böylece aldığın yardım daha çok işine yarar. Bir yanlışın nedenini tek cümleyle not etmek de aynı hatayı tekrarlamanı önler.',
          parent:
            'Çocuğunuz bazen yanlışlarını inceliyor ve yardım istiyor. Takıldığında önce ne bildiğini yazıp sonra soru sorması ve yanlışlarının nedenini tek cümleyle not etmesi bu alışkanlığı güçlendirir.',
        },
        high: {
          student:
            'Takıldığında soruyor, farklı kaynaklara başvuruyor ve yanlışlarından öğreniyorsun. Öğrendiğini başkalarına anlatmak hem onlara yardım eder hem de seni sınar. Kaynak seçerken güvenilir olanları tercih etmeyi de unutma.',
          parent:
            'Çocuğunuz takıldığında soru soruyor, farklı kaynaklara başvuruyor ve yanlışlarından öğreniyor. Öğrendiğini başkalarına anlatması kendi öğrenmesini de pekiştirir; güvenilir kaynakları ayırt etmeyi birlikte konuşabilirsiniz.',
        },
      },
      action: {
        low: {
          student: 'Bu hafta bir sınavda, denemede ya da ödevde yaptığın üç yanlışı bir deftere yaz: neyi yanlış yaptın, doğrusu ne ve neden?',
          parent: 'Bu hafta çocuğunuz bir yanlışını paylaştığında “Buradan ne öğrendin?” diye sakin ve meraklı bir şekilde sorun.',
        },
        average: {
          student: 'Bu hafta geçen hafta yanlış yaptığın soruları yeniden çöz ve hâlâ takıldıklarını birine sor.',
          parent: 'Bu hafta çocuğunuzla takıldığında soru sorabileceği kişileri ve kaynakları birlikte bir listeye yazın.',
        },
        high: {
          student: 'Bu hafta bir arkadaşına takıldığı bir konuyu anlat; anlatırken senin de eksik kaldığın yerleri not et.',
          parent: 'Bu hafta çocuğunuzla, bir bilginin kaynağının güvenilir olup olmadığını nasıl anlayabileceğini birlikte konuşun.',
        },
      },
    },
  },
  sources: [
    bf.sources[0],
    {
      text: 'Roediger, H. L. ve Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.',
      url: 'https://doi.org/10.1111/j.1467-9280.2006.01693.x',
    },
    {
      text: 'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T. ve Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.',
      url: 'https://doi.org/10.1037/0033-2909.132.3.354',
    },
  ],
};
