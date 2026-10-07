import { besFaktorReport } from '@/content/reports/bes-faktor';
import { besFaktorRoadmap as bf } from './bes-faktor';
import type { BandGroup, RoadmapTemplate } from './types';

/**
 * Altı Boyutlu Kişilik Profili: gelişim yol haritası.
 *
 * Dışadönüklük, Sorumluluk ve Deneyime Açıklık için hocanın onayladığı Beş Faktör metinleri kullanılır (Deneyime
 * Açıklık: Merak ve Hayal Gücü metinleri). Uyumluluk'ta "Nasıl çalışabilir?", "Bu hafta dene" ve ortam metinleri Beş
 * Faktör'ünkülerdir; bu modelde uyumluluk sabır, hoşgörü ve bağışlamayı anlattığı için veliye yaklaşım önerileri ayrı
 * yazıldı. Dürüstlük-Alçakgönüllülük ve Duygusallık bu modele özgüdür; metinleri yenidir.
 *
 * Duygusallık, Duygusal Denge'nin tersi yönündedir: yüksek düzey kaygı, korku ve destek aramayı anlatır. Bu yüzden
 * Duygusallık yüksekken 3. hafta iyi oluşa ayrılır. Düşük Dürüstlük-Alçakgönüllülük suçlamadan, görünür başarıyı
 * önemseme olarak anlatılır.
 */
const parentTip = (key: string): Record<BandGroup, string> => ({
  low: besFaktorReport.scales[key].low!.tipsParent[0],
  average: besFaktorReport.scales[key].average!.tipsParent[0],
  high: besFaktorReport.scales[key].high!.tipsParent[0],
});

export const altiBoyutluKisilikRoadmap: RoadmapTemplate = {
  ...bf,
  version: 'alti-boyutlu-kisilik-yol-haritasi-1',
  planningScale: 'conscientiousness',
  wellbeing: { scale: 'emotionality', group: 'high' },
  scales: {
    honesty_humility: {
      color: '#5a9e2f',
      study: {
        high: {
          student:
            'İçten ve adil olmak senin için önemli; kendi emeğinle öğrenmeye değer veriyorsun. Bu dürüstlüğü kendine de uygula: bir konuyu gerçekten anladın mı, yoksa yalnızca tanıdık mı geliyor? Kitabı kapatıp kendini sınamak bunun en dürüst ölçüsüdür.',
          parent:
            'Çocuğunuz içten ve adil olmaya önem veriyor; kendi emeğiyle öğrenmeye değer veriyor olabilir. Bu dürüstlüğü kendi öğrenmesine de uygulamasına destek olun: bir konuyu gerçekten anladı mı, yoksa yalnızca tanıdık mı geliyor? Kitaba bakmadan kendini sınaması bunun en dürüst ölçüsüdür.',
          adult:
            'İçten ve adil olmak senin için önemli; kendi emeğinle öğrenmeye değer veriyorsun. Bu dürüstlüğü kendine de uygula: bir konuyu gerçekten anladın mı, yoksa yalnızca tanıdık mı geliyor? Kaynağı kapatıp kendini sınamak bunun en dürüst ölçüsüdür.',
        },
        average: {
          student:
            'Hem kendi emeğine hem de görünür başarıya önem veriyorsun. İlerlemeni başkalarıyla değil kendi önceki sonuçlarınla karşılaştırmak, neyi gerçekten öğrendiğini görmeni kolaylaştırır.',
          parent:
            'Çocuğunuz hem kendi emeğine hem de görünür başarıya önem veriyor. İlerlemesini başkalarıyla değil kendi önceki sonuçlarıyla karşılaştırması, neyi gerçekten öğrendiğini görmesini kolaylaştırır.',
        },
        low: {
          student:
            'Başarının görünmesini, tanınmayı ve kazanmayı önemsiyor olabilirsin. Bu isteği öğrenmeye çevir: çalışmanı sunum, proje ya da yarışma gibi görünür bir hedefe bağla. Yine de ilerlemeni başkalarıyla değil kendi geçen haftanla karşılaştır; kalıcı öğrenme orada görünür.',
          parent:
            'Çocuğunuz başarının görünmesini, tanınmayı ve kazanmayı önemsiyor olabilir. Bu isteği öğrenmeye yönlendirebilirsiniz: çalışmasını sunum, proje ya da yarışma gibi görünür bir hedefe bağlamak. Onu başkalarıyla değil kendi geçen haftasıyla karşılaştırmak kalıcı öğrenmeyi destekler.',
        },
      },
      action: {
        high: {
          student:
            'Çalıştığın her konunun sonunda kendine sor: "Bunu kitaba bakmadan anlatabilir miyim?" Anlatamadığın yerleri işaretle ve ertesi gün yeniden çalış.',
          parent: 'Çocuğunuzdan çalıştığı bir konuyu kitaba bakmadan size anlatmasını rica edin; anlatamadığı yerleri birlikte işaretleyin.',
          adult:
            'Öğrendiğin her konunun sonunda kendine sor: "Bunu kaynağa bakmadan anlatabilir miyim?" Anlatamadığın yerleri işaretle ve ertesi gün yeniden çalış.',
        },
        average: {
          student: 'Aynı konudan beş soruyu hafta başında ve hafta sonunda çöz; farkı yaz ve kendi gelişimine bak.',
          parent: 'Çocuğunuzla, aynı konudan beş soruyu hafta başında ve hafta sonunda çözüp farkı birlikte konuşun.',
          adult: 'Aynı konuda kendini hafta başında ve hafta sonunda beş soruyla sına; farkı yaz ve kendi gelişimine bak.',
        },
        low: {
          student:
            'Görünür bir hedef seç (bir sunum, bir proje ya da bir deneme sınavı) ve ona hazırlanırken kendini geçen haftanla karşılaştırarak ilerle.',
          parent:
            'Çocuğunuzla görünür bir hedef belirleyin (bir sunum, bir proje ya da bir deneme sınavı); ilerlemesini başkalarıyla değil kendi geçen haftasıyla karşılaştırın.',
          adult: 'Görünür bir hedef seç (bir sunum ya da bir proje) ve ona hazırlanırken kendini geçen haftanla karşılaştırarak ilerle.',
        },
      },
      settings: {
        high: 'Adaletin, şeffaflığın ve güvenin öne çıktığı ortamlar',
        low: 'Rekabetin, görünür başarının ve tanınmanın öne çıktığı ortamlar',
      },
    },
    emotionality: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Duyguları yoğun yaşamak ve zor zamanlarda destek aramak senin özelliklerin. Destek istemek bir güçtür: zorlandığın konuyu bir arkadaşınla ya da öğretmeninle çalış. Sınavdan hemen önce endişelerini birkaç dakika kâğıda yazmak ve kalp çarpıntısını "vücudum bu işe hazırlanıyor" diye yorumlamak işine yarayabilir.',
          parent:
            'Çocuğunuz duyguları yoğun yaşıyor ve zor zamanlarda destek arıyor olabilir. Destek istemesi bir güçtür; zorlandığı konuyu bir arkadaşıyla ya da öğretmeniyle çalışması işine yarar. Sınavdan hemen önce endişelerini birkaç dakika yazması ve uykusunu koruması da yardımcı olabilir.',
          adult:
            'Duyguları yoğun yaşamak ve zor zamanlarda destek aramak senin özelliklerin. Destek istemek bir güçtür: zorlandığın konuyu biriyle birlikte çalış. Önemli bir sınav ya da sunumdan hemen önce endişelerini birkaç dakika kâğıda yazmak ve kalp çarpıntısını "vücudum bu işe hazırlanıyor" diye yorumlamak işine yarayabilir.',
        },
        average: {
          student:
            'Çoğu zaman sakinsin; bazı konular seni daha çok kaygılandırabilir. Seni zorlayan konulara erken başla ve gerektiğinde bir arkadaşından ya da öğretmeninden yardım iste. İyi hazırlanmış hissetmek kaygıyı azaltır.',
          parent:
            'Çocuğunuz çoğu zaman sakin; bazı konular onu daha çok kaygılandırabilir. Zorlandığı konulara erken başlaması ve gerektiğinde yardım istemesi iyi hazırlanmış hissetmesini sağlar.',
          adult:
            'Çoğu zaman sakinsin; bazı işler seni daha çok kaygılandırabilir. Seni zorlayan işlere erken başla ve gerektiğinde yardım iste. İyi hazırlanmış hissetmek kaygıyı azaltır.',
        },
        low: {
          student:
            'Baskı altında sakin kalabiliyor ve işlerini kendi başına yürütmeyi seviyorsun. Bu bağımsızlığı kendini sınamakla birleştir. Sakinliğin "Nasılsa yetişir" düşüncesine dönüşmesin; takıldığında yardım istemekten de çekinme.',
          parent:
            'Çocuğunuz baskı altında sakin kalabiliyor ve işlerini kendi başına yürütmeyi seviyor olabilir. Bu bağımsızlığa saygı gösterin; sakinliğin son ana bırakmaya dönüşmemesi için sınav tarihinden geriye doğru küçük bir plan yapmasına destek olabilirsiniz.',
        },
      },
      action: {
        high: {
          student:
            'Gergin hissettiğinde 4 saniye nefes al, 4 saniye tut, 6 saniyede ver; birkaç kez tekrarla. Zorlandığın bir konuyu güvendiğin biriyle birlikte çalış.',
          parent:
            'Çocuğunuzu dinlemek için sakin bir zaman ayırın: "Bu hafta seni en çok ne kaygılandırdı?" diye sorun ve uyku saatini birlikte koruyun.',
          adult:
            'Gergin hissettiğinde 4 saniye nefes al, 4 saniye tut, 6 saniyede ver; birkaç kez tekrarla. Seni zorlayan bir işi güvendiğin biriyle konuş.',
        },
        average: {
          student: 'Seni en çok kaygılandıran dersi belirle ve ona haftada üç kez 15 dakika ayır.',
          parent: 'Çocuğunuza onu en çok neyin kaygılandırdığını yargılamadan sorun ve o konuya erken başlaması için küçük bir plan yapın.',
          adult: 'Seni en çok kaygılandıran işi belirle ve ona haftada üç kez 15 dakika ayır.',
        },
        low: {
          student: 'Takıldığın bir konuda birinden yardım iste ve onunla birlikte bir soru çöz.',
          parent: 'Çocuğunuzla, takıldığında kimden yardım isteyebileceğini konuşun.',
          adult: 'Takıldığın bir konuda birinden yardım iste ve onunla birlikte çalış.',
        },
      },
      settings: {
        high: 'Öngörülebilir, destekleyici ve iş birliğinin bol olduğu ortamlar',
        low: 'Bağımsız çalışılan; risk almayı ve hızlı karar vermeyi gerektiren ortamlar',
      },
    },
    extraversion: bf.scales.extraversion,
    agreeableness: bf.scales.agreeableness,
    conscientiousness: bf.scales.conscientiousness,
    openness: bf.scales.intellect,
  },
  approach: {
    honesty_humility: {
      high: 'Dürüstlüğünü ve adalet duygusunu fark ettiğinizi ona söyleyin.',
      average: 'Doğruluk ve adalet üzerine günlük olaylardan örneklerle sohbet edebilirsiniz.',
      low: 'Başarıyı başkalarıyla karşılaştırmak yerine kendi gelişimi üzerinden konuşun.',
    },
    emotionality: {
      high: 'Kaygılarını küçümsemeden dinleyin ve zor zamanlarda yanında olduğunuzu hissettirin.',
      average: 'Onu neyin kaygılandırdığını yargılamadan sorun.',
      low: 'Bağımsızlığına saygı gösterin; yine de zorlandığında yardım istemenin güçlü olmak olduğunu hatırlatın.',
    },
    extraversion: parentTip('extraversion'),
    agreeableness: {
      high: 'Sabrını ve hoşgörüsünü takdir edin; kendi isteklerini de dile getirmesini destekleyin.',
      average: 'Anlaşmazlıklarda nasıl uzlaştığını birlikte konuşabilirsiniz.',
      low: 'Öfkelendiğinde önce sakinleşip sonra konuşmayı birlikte deneyin; eleştirilerini kırmadan söylemesine destek olun.',
    },
    conscientiousness: parentTip('conscientiousness'),
    openness: parentTip('intellect'),
  },
};
