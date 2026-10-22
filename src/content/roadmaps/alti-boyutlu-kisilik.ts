import { besFaktorReport } from '@/content/reports/bes-faktor';
import { besFaktorRoadmap as bf } from './bes-faktor';
import type { BandGroup, RoadmapTemplate } from './types';

/**
 * Altı Boyutlu Kişilik Profili: gelişim yol haritası.
 *
 * Dışadönüklük, Sorumluluk ve Deneyime Açıklık için hocanın onayladığı Beş Faktör metinleri kullanılır (Deneyime
 * Açıklık: Merak ve Hayal Gücü metinleri). Bu modelde Uyumluluk yardımseverliği değil bağışlamayı, yumuşaklığı,
 * esnekliği ve sabrı anlatır (rapor: "Hoşgörülü ve sabırlı" / "Tepkilerini saklamayan"); bu yüzden bütün metinleri bu
 * modele göre ayrı yazıldı. Dürüstlük-Alçakgönüllülük ve Duygusallık da bu modele özgüdür; metinleri yenidir.
 *
 * Duygusallık bir kaygı ölçüsü değildir: duyguları yoğun yaşamayı, sevdiklerine bağlılığı ve zor zamanlarda destek
 * aramayı da kapsar; rapordaki gibi bir sorun belirtisi olarak anlatılmaz. Duygusallık yüksekken 3. hafta iyi oluşa
 * ayrılır: duyguları fark etmek, dinlenmek, uyku ve güvenilen biriyle konuşmak. Sınav kaygısı önerisi verilmez ve
 * "Sınav kaygısı" yazısına bağlantı verilmez. Düşük Dürüstlük-Alçakgönüllülük suçlamadan, görünür başarıyı önemseme
 * olarak anlatılır.
 *
 * Metinler bir alt özelliğin kartıyla çelişen bir hüküm vermez: ör. Uyumluluk yüksekken "sabırlısın" denmez (Sabırlılık
 * orta olabilir), Duygusallık düşükken "baskı altında sakin kalabiliyorsun" denmez (Endişelenme orta olabilir). Alt
 * özellikleri ayrışan (biri yüksek, öteki düşük) bir boyutta orta düzeyin önerileri verilir (rapor şablonu: facetSplit);
 * bu yüzden Dışadönüklük'te veliye yaklaşımın orta düzeyi Beş Faktör'deki gibi "bu dengeyi" demez.
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
  wellbeing: { scale: 'emotionality', group: 'high', link: null },
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
            'Başarının görünmesini, tanınmayı ve kazanmayı önemsiyor olabilirsin. Bu isteği öğrenmeye çevir: çalışmanı sunum, proje ya da yarışma gibi görünür bir hedefe bağla. Hazırlanırken kendini sorularla sınamak, neyi gerçekten öğrendiğini görmeni kolaylaştırır.',
          parent:
            'Çocuğunuz başarının görünmesini, tanınmayı ve kazanmayı önemsiyor olabilir. Bu isteği öğrenmeye yönlendirebilirsiniz: çalışmasını sunum, proje ya da yarışma gibi görünür bir hedefe bağlamak. Hazırlanırken kendini sorularla sınaması, neyi gerçekten öğrendiğini görmesini kolaylaştırabilir ve kalıcı öğrenmeyi destekleyebilir.',
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
            'Çocuğunuzla görünür bir hedef belirleyin (bir sunum, bir proje ya da bir deneme sınavı); hafta sonunda o hedef için neleri tamamladığını birlikte bir listeye yazın.',
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
            'Duygularını yoğun yaşıyor ve zor zamanlarda destek arıyorsun. Destek istemek bir güçtür: zorlandığın bir konuyu bir arkadaşınla ya da öğretmeninle birlikte çalışmak işini kolaylaştırabilir. Duygularının seni yorduğu günlerde planını küçült ama bırakma; kısa bir tekrar bile işe yarayabilir.',
          parent:
            'Çocuğunuz duygularını yoğun yaşıyor ve zor zamanlarda destek arıyor olabilir. Destek istemesi bir güçtür; zorlandığı bir konuyu bir arkadaşıyla ya da öğretmeniyle birlikte çalışması işini kolaylaştırabilir. Duygularının onu yorduğu günlerde planını küçültmesine ama bırakmamasına destek olabilirsiniz.',
          adult:
            'Duygularını yoğun yaşıyor ve zor zamanlarda destek arıyorsun. Destek istemek bir güçtür: zorlandığın bir konuyu güvendiğin biriyle birlikte çalışmak işini kolaylaştırabilir. Duygularının seni yorduğu günlerde planını küçült ama bırakma; kısa bir çalışma bile işe yarayabilir.',
        },
        average: {
          student:
            'Duygularının yoğunluğu duruma göre değişiyor. Seni zorlayan konulara erken başla ve gerektiğinde bir arkadaşından ya da öğretmeninden yardım iste; iyi hazırlanmış hissetmek zor anları kolaylaştırabilir.',
          parent:
            'Çocuğunuzun duygularının yoğunluğu duruma göre değişiyor olabilir. Zorlandığı konulara erken başlaması ve gerektiğinde yardım istemesi, kendini iyi hazırlanmış hissetmesine yardım edebilir.',
          adult:
            'Duygularının yoğunluğu duruma göre değişiyor. Seni zorlayan işlere erken başla ve gerektiğinde yardım iste; iyi hazırlanmış hissetmek zor anları kolaylaştırabilir.',
        },
        low: {
          student:
            'İşlerini kendi başına yürütmeyi seviyor olabilirsin. Bu bağımsızlığı kendini sınamakla birleştir. Kendi başına çalışırken işi son güne bırakmamak için küçük ara hedefler koy; takıldığında yardım istemekten de çekinme.',
          parent:
            'Çocuğunuz işlerini kendi başına yürütmeyi seviyor olabilir. Bu bağımsızlığa saygı gösterin; işleri son ana bırakmaması için sınav tarihinden geriye doğru küçük bir plan yapmasına destek olabilirsiniz.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta her akşam günün sende en çok iz bırakan duygusunu tek cümleyle yaz. Yorgun hissettiğin günlerde kısa bir mola ver, uyku saatini koru ve seni zorlayan bir şeyi güvendiğin biriyle konuş.',
          parent:
            'Bu hafta çocuğunuzla akşamları kısa bir sohbet zamanı ayırın ve günün onda en çok iz bırakan duygusunu sorun. Yorgun günlerinde dinlenmesine fırsat verin ve uyku saatini birlikte koruyun.',
        },
        average: {
          student: 'Seni en çok zorlayan dersi belirle ve ona haftada üç kez 15 dakika ayır.',
          parent: 'Çocuğunuzla, onu en çok zorlayan derse erken başlaması için küçük bir plan yapın.',
          adult: 'Seni en çok zorlayan işi belirle ve ona haftada üç kez 15 dakika ayır.',
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
    agreeableness: {
      color: bf.scales.agreeableness.color,
      study: {
        high: {
          student:
            'Genel olarak insanlara hoşgörüyle yaklaştığını söylüyorsun. Bu sakin tutumu kendi öğrenmene de uygula: zor bir konuda hemen sonuç beklemeden aynı konuya birkaç gün arayla kısa tekrarlarla dön. Ortak çalışmalarda katılmadığın bir noktayı sakin bir dille söylemek de işin daha iyi olmasına katkı sağlayabilir.',
          parent:
            'Çocuğunuz insanlara hoşgörüyle yaklaştığını belirtiyor. Bu sakin tutumu kendi öğrenmesine de uygulayabilir: zor bir konuda hemen sonuç beklemeden aynı konuya birkaç gün arayla kısa tekrarlarla dönmesi işine yarayabilir. Ortak çalışmalarda uzlaşırken kendi payına düşen işi baştan netleştirmesini önerebilirsiniz.',
        },
        average: {
          student:
            'Bazı durumlarda uzlaşmayı, bazılarında kendi doğrunu savunmayı seçiyorsun. Bu dengeyi öğrenirken de kullan: bir arkadaşınla birbirinize soru sorarken yanlışları sakin bir dille düzeltin; emin olmadığınız bir noktada tartışmayı uzatmak yerine kaynağa birlikte bakın.',
          parent:
            'Çocuğunuz bazı durumlarda uzlaşmayı, bazılarında kendi doğrusunu savunmayı seçiyor olabilir. Bir arkadaşıyla birbirlerine soru sorarak çalışırken yanlışları sakin bir dille düzeltmeleri ve emin olmadıkları bir noktada kaynağa birlikte bakmaları bu dengeyi öğrenmeye taşır.',
        },
        low: {
          student:
            'Eleştiriye ve hatalara çabuk tepki veriyor, doğru bildiğinde ısrar ediyorsun. Bu kararlılığı öğrenmeye çevirebilirsin: doğru olduğunu düşündüğün bir cevabın gerekçesini yazarak açıkla; yazamadığın yer, yeniden bakman gereken yerdir. Bir yanlış sinirini bozduğunda soruyu hemen bırakma; kısa bir ara verip sakinleşince yeniden dene.',
          parent:
            'Çocuğunuz eleştiriye ve hatalara çabuk tepki veriyor, doğru bildiğinde ısrar ediyor olabilir. Doğru olduğunu düşündüğü bir cevabın gerekçesini yazarak açıklamasını isteyerek bu kararlılığı öğrenmeye çevirebilirsiniz. Bir yanlış sinirini bozduğunda soruyu bırakmak yerine kısa bir ara verip sakinleşince yeniden denemesini önerebilirsiniz.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta zorlandığın bir konuyu tek oturumda bitirmeye çalışma: üç ayrı günde 15’er dakika çalış ve üçüncü günün sonunda kendini beş soruyla sına.',
          parent:
            'Bu hafta çocuğunuzla, zorlandığı bir konuyu üç ayrı günde kısa sürelerle çalışmasını planlayın; üçüncü gün kendini birkaç soruyla sınamasını önerin.',
        },
        average: {
          student: 'Bu hafta bir anlaşmazlıkta önce karşındakinin haklı olabileceği bir noktayı söyle, sonra kendi görüşünü gerekçesiyle ekle.',
          parent:
            'Bu hafta çocuğunuzla bir film ya da kitaptaki bir anlaşmazlığı konuşun: karakterler nerede uzlaşabilirdi, nerede kendi görüşlerinde durmaları doğruydu?',
        },
        low: {
          student:
            'Bu hafta bir tartışmada sinirlendiğinde hemen cevap verme: kısa bir ara ver (biraz yürü ya da birkaç derin nefes al), sakinleşince konuya dön ve görüşünü gerekçesiyle söyle.',
          parent:
            'Bu hafta çocuğunuzla, bir tartışmada sinirlendiğinde kısa bir ara verip sakinleşince konuşmayı birlikte deneyin; siz de aynı yolu kullanın.',
        },
      },
      settings: {
        high: 'Sabrın, hoşgörünün ve uzlaşmanın değer gördüğü ortamlar',
        low: 'Açık sözlülüğün olağan karşılandığı, görüşlerin doğrudan söylendiği ortamlar',
      },
    },
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
      high: 'Duygularını küçümsemeden dinleyin ve zor zamanlarda yanında olduğunuzu hissettirin.',
      average: 'Hangi durumların onu daha çok etkilediğini yargılamadan sorun.',
      low: 'Bağımsızlığına saygı gösterin; yine de zorlandığında yardım istemenin de bir güç olduğunu hatırlatın.',
    },
    extraversion: {
      ...parentTip('extraversion'),
      average: 'Hem grup hem de bireysel etkinliklere yer açmak, farklı ortamlarda rahat edebilmesini destekler.',
    },
    agreeableness: {
      high: 'Hoşgörülü tavrını takdir edin; kendi isteklerini de dile getirmesini destekleyin.',
      average: 'Anlaşmazlıklarda nasıl uzlaştığını birlikte konuşabilirsiniz.',
      low: 'Bir kırgınlığı uzun süre aklında tuttuğunda onu dinleyin; kendi hatalarınızı kabul edip özür dileyerek bağışlamanın nasıl göründüğünü gösterin.',
    },
    conscientiousness: parentTip('conscientiousness'),
    openness: parentTip('intellect'),
  },
  // Jamieson ve ark. (2010) ile Ramirez ve Beilock (2011) sınav kaygısı önerilerinin kaynaklarıdır; bu testte kullanılmaz.
  sources: bf.sources.filter((s) => !/^(Jamieson|Ramirez)/.test(s.text)),
};
