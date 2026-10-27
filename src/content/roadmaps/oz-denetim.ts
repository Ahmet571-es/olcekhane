import { besFaktorRoadmap as bf } from './bes-faktor';
import { KAYNAK } from './kaynaklar';
import type { RoadmapTemplate } from './types';

/**
 * Öz-denetim: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili öğrenme yöntemleri herkes için aynıdır (kaynağa bakmadan hatırlamaya çalışmak, tekrarları günlere yaymak;
 *    Dunlosky ve ark., 2013; Roediger ve Karpicke, 2006). Öz-denetimin alanları yalnızca bu yöntemleri hangi düzende
 *    kullanmanın kolay geleceğine ipucu verir; kişiliğe göre "öğrenme stili" eşleştirmesi vaat edilmez.
 *  - Öneriler bilim kartındaki bulgulara dayanır: öz-denetim çoğu zaman dişini sıkmaktan çok ortamı düzenlemek ve alışkanlık
 *    kurmaktır (Duckworth ve ark., 2016); "şu durum olursa şunu yapacağım" biçimindeki eğer-o zaman planları hedefe
 *    ulaşmayı kolaylaştırır (Gollwitzer ve Sheeran, 2006). 2. hafta bu yüzden "Eğer-o zaman planı"dır (Öz-disiplin).
 *    "İradenin tükenmesi" düşüncesi kullanılmaz (büyük tekrar çalışmalarında desteklenmedi); öz-denetim eğitimine dair bir
 *    sonuç vaat edilmez (etkisi küçük).
 *  - Ortamlar bugünkü duruma göre bir ipucudur, sınır değildir (`settingsNote`); bir meslek önerisi değildir.
 *  - Düşük düzeyde kişi suçlanmaz; veliye eleştirmek ya da sürekli hatırlatmak yerine birlikte düzen kurmak önerilir.
 *  - Aynı alan ve düzeyde rapor kartı, "Nasıl çalışabilirsin?" kartı, "Bu hafta dene" ve veliye yaklaşım aynı fikri tekrar
 *    etmez; veliye yaklaşım önerileri de birbirini tekrar etmez (tests/oz-denetim.test.ts ortak söz öbeklerini arar).
 *  - Test yetişkinlere de açıktır: öğrenci metni okula özgü olduğunda ya da kitaptan söz ettiğinde yetişkin metni yazılır.
 */
export const ozDenetimRoadmap: RoadmapTemplate = {
  version: 'oz-denetim-yol-haritasi-1',
  planningScale: 'discipline',
  planningTitle: 'Eğer-o zaman planı',
  unit: { one: 'alan', toPlural: 'alanlara' },
  balancedNote: {
    student: 'Üç alanda da öz-denetimin orta düzeyde; duruma ve işe göre değişiyor olabilir.',
    parent: 'Çocuğunuzun üç alanda da öz-denetimi orta düzeyde; duruma ve işe göre değişiyor olabilir.',
  },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Öz-denetiminin alanları, bu yöntemleri hangi düzende kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili öğrenme yöntemleri aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun öz-denetiminin alanları, bu yöntemleri hangi düzende kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
  },
  settingsNote: {
    student:
      'Bu ortamlar yalnızca bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir; öz-denetim alışkanlıklarla ve ortamla değişebilir. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'Bu ortamlar yalnızca çocuğunuzun bugün nerede daha rahat edebileceğine dair bir ipucudur, bir sınır değildir; öz-denetim alışkanlıklarla ve ortamla değişebilir. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Raporundaki üç alana bak. Bu hafta her gün, düşünmeden davrandığın, bir işi ertelediğin ya da bir isteğe kapıldığın (ya da tam tersine kendini tutabildiğin) bir anı bir cümleyle yaz: ne oluyordu, neredeydin ve kiminleydin?',
    parent:
      'Bu hafta raporu çocuğunuzla birlikte okuyun; hangi cümlelerin onu anlattığını sorun. Hemen bir şeyi değiştirmeye çalışmayın, yalnızca birlikte gözlem yapın.',
  },
  lastWeek: bf.lastWeek,
  nextTests: ['erteleme-ve-zaman-yonetimi', 'heyecan-arayisi'],
  nextPurpose: {
    you: 'işleri ne kadar ertelediğini ve heyecan arayışını da görmek',
    parent: 'çocuğunuzun işleri erteleme eğilimini ve heyecan arayışını da görmek',
  },
  approach: {
    deliberation: {
      low: 'Bir karar verdikten sonra onu eleştirmek yerine merakla “Bu kararı verirken aklından neler geçti?” diye sorun ve yargılamadan dinleyin.',
      average: 'Önemli bir karar öncesinde seçenekleri birlikte konuşmak için zaman ayırın; kararı yine de ona bırakın.',
      high: 'Düşünerek karar vermesine değer verdiğinizi gösterin; bir konuda çok uzun düşündüğünde bir sonuca varması için ona destek olun.',
    },
    discipline: {
      low: 'Başlamakta zorlandığı bir işte sürekli hatırlatmak yerine işin zamanını onunla birlikte seçin; başladığında bunu fark ettiğinizi söyleyin.',
      average: 'Hangi işlere kolay, hangilerine zor başladığını birlikte konuşun; zor başladığı işlerde başlangıcı küçültmesine yardım edin.',
      high: 'Kendi işlerini planlayıp yürütmesine güvendiğinizi gösterin; dinlenmeye de zaman ayırmasını hatırlatın.',
    },
    restraint: {
      low: 'Kendini tutamadığı anlarda suçlamak yerine, evde herkes için geçerli küçük düzenlemeler kararlaştırın (ör. akşamları telefonların şarj olacağı ortak bir yer); bu düzene siz de uyun.',
      average: 'Hangi isteklerin onu daha çok zorladığını yargılamadan konuşun; birlikte bir iki küçük kural koyun.',
      high: 'Kendini tutabildiğini fark ettiğinizde bunu somut olarak söyleyin; ara sıra keyif almanın da olağan olduğunu hatırlatın.',
    },
  },
  scales: {
    deliberation: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Düşünerek davranman çalışırken de işine yarayabilir: bir konuya başlamadan önce neyi bildiğini ve neyi bilmediğini kısaca yaz; çalıştıktan sonra kitaba bakmadan kendine soru sorarak tahminini sına.',
          parent:
            'Çocuğunuzun düşünerek davranması çalışırken de işine yarayabilir: bir konuya başlamadan önce neyi bildiğini ve neyi bilmediğini kısaca yazabilir, çalıştıktan sonra kitaba bakmadan kendine soru sorarak tahminini sınayabilir.',
          adult:
            'Düşünerek davranman öğrenirken de işine yarayabilir: bir konuya başlamadan önce neyi bildiğini ve neyi bilmediğini kısaca yaz; öğrendikten sonra kaynağa bakmadan kendine soru sorarak tahminini sına.',
        },
        average: {
          student:
            'Önemli bir sınavdan önce neyi hangi gün çalışacağını birkaç cümleyle planla; çalışmayı günlere yay ve her oturumun sonunda kitaba bakmadan hatırladıklarını yaz.',
          parent:
            'Çocuğunuz önemli bir sınavdan önce neyi hangi gün çalışacağını birkaç cümleyle planlayabilir; çalışmayı günlere yayması ve her oturumun sonunda kitaba bakmadan hatırladıklarını yazması ona uyabilir.',
          adult:
            'Öğrenmek istediğin bir konuda neyi hangi gün çalışacağını birkaç cümleyle planla; çalışmayı günlere yay ve her oturumun sonunda kaynağa bakmadan hatırladıklarını yaz.',
        },
        low: {
          student:
            'Çalışmaya hemen dalmak yerine ilk iki dakikayı plana ayır: bugün neyi bitireceğini ve sonunda kendine hangi soruları soracağını yaz. Sonra kitabı kapatıp o soruları cevapla.',
          parent:
            'Çocuğunuz çalışmaya hemen dalmak yerine ilk iki dakikayı plana ayırabilir: o gün neyi bitireceğini ve sonunda kendine hangi soruları soracağını yazıp, sonra kitabı kapatarak o soruları cevaplayabilir.',
          adult:
            'Öğrenmeye hemen dalmak yerine ilk iki dakikayı plana ayır: bugün neyi bitireceğini ve sonunda kendine hangi soruları soracağını yaz. Sonra kaynağı kapatıp o soruları cevapla.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir karar vermeden önce iki seçeneği bir kâğıda yaz ve her birinin bir artısını, bir eksisini not et.',
          parent: 'Bu hafta çocuğunuza, bir karar vermeden önce iki seçeneği bir kâğıda yazmasını ve her birinin bir artısını, bir eksisini not etmesini önerin.',
        },
        average: {
          student: 'Bu hafta acele ettiğini fark ettiğin bir anda içinden üçe kadar say, sonra ne yapacağına karar ver; bunu günde bir kez dene.',
          parent: 'Bu hafta çocuğunuza, acele ettiğini fark ettiği bir anda içinden üçe kadar saymasını, sonra ne yapacağına karar vermesini önerin; günde bir kez denesin.',
        },
        low: {
          student: 'Bu hafta acele etmeden vermek istediğin bir karar seç (ne alacağın ya da bir davete ne diyeceğin gibi) ve onu bir gece beklet; ertesi gün bekleyince bir şeyin değişip değişmediğine bak.',
          parent: 'Bu hafta çocuğunuza, acele etmeden vermek istediği bir kararı (ne alacağı ya da bir davete ne diyeceği gibi) bir gece bekletmesini önerin; ertesi gün isterse bekleyince ne değiştiğini anlatsın.',
        },
      },
      settings: {
        high: 'Dikkatle karar vermenin ve özenli çalışmanın önemli olduğu ortamlar',
        low: 'Hızlı karar vermenin ve anında harekete geçmenin değerli olduğu ortamlar',
      },
    },
    discipline: {
      color: '#d28a14',
      study: {
        high: {
          student:
            'Zamanında başlama alışkanlığını tekrarları günlere yaymak için kullanabilirsin: bir konuyu çalıştıktan bir gün ve bir hafta sonra kısa tekrarlar planla, her tekrarda kitaba bakmadan kendine soru sor.',
          parent:
            'Çocuğunuz zamanında başlama alışkanlığını tekrarları günlere yaymak için kullanabilir: bir konuyu çalıştıktan bir gün ve bir hafta sonra kısa tekrarlar planlayıp her tekrarda kitaba bakmadan kendine soru sorabilir.',
          adult:
            'Zamanında başlama alışkanlığını tekrarları günlere yaymak için kullanabilirsin: bir konuyu öğrendikten bir gün ve bir hafta sonra kısa tekrarlar planla, her tekrarda kaynağa bakmadan kendine soru sor.',
        },
        average: {
          student:
            'Çalışmaya başlamayı kolaylaştırmak için her gün aynı saati ve aynı yeri seç; ilk beş dakikada kitaba bakmadan bir önceki günün konusunu hatırlamaya çalış.',
          parent:
            'Çocuğunuzun çalışmaya başlamasını kolaylaştırmak için her gün aynı saat ve aynı yer seçilebilir; ilk beş dakikada kitaba bakmadan bir önceki günün konusunu hatırlamaya çalışması ona uyabilir.',
          adult:
            'Öğrenmeye başlamayı kolaylaştırmak için her gün aynı saati ve aynı yeri seç; ilk beş dakikada kaynağa bakmadan bir önceki günün konusunu hatırlamaya çalış.',
        },
        low: {
          student:
            'Bir çalışmayı bitirirken bir sonrakinin ilk adımını yaz (“Yarın 3. sorudan başlayacağım.” gibi); böylece neye başlayacağını düşünmek zorunda kalmazsın. Başlarken ilk iş olarak kitaba bakmadan dünkü konudan hatırladığın üç şeyi yaz.',
          parent:
            'Çocuğunuz bir çalışmayı bitirirken bir sonrakinin ilk adımını yazabilir (“Yarın 3. sorudan başlayacağım.” gibi); böylece neye başlayacağını düşünmek zorunda kalmaz. Başlarken ilk iş olarak kitaba bakmadan dünkü konudan hatırladığı üç şeyi yazması ona uyabilir.',
          adult:
            'Bir çalışmayı bitirirken bir sonrakinin ilk adımını yaz (“Yarın 3. bölümden başlayacağım.” gibi); böylece neye başlayacağını düşünmek zorunda kalmazsın. Başlarken ilk iş olarak kaynağa bakmadan dünkü konudan hatırladığın üç şeyi yaz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir hedefin için bir eğer-o zaman planı yaz (“Akşam yemeğinden sonra masaya oturunca ilk iş ...”) ve hafta boyunca uygula; hafta sonunda planın işe yarayıp yaramadığına bak.',
          parent: 'Bu hafta çocuğunuzla, onun bir hedefi için bir eğer-o zaman planı yazın (“Akşam yemeğinden sonra masaya oturunca ilk iş ...”); hafta sonunda planın işe yarayıp yaramadığına birlikte bakın.',
        },
        average: {
          student: 'Bu hafta ertelediğin bir iş için bir eğer-o zaman planı kur (“Eve gelip üstümü değiştirince ... başlayacağım.”); planı bir kâğıda yazıp görebileceğin bir yere as.',
          parent: 'Bu hafta çocuğunuza, ertelediği bir iş için bir eğer-o zaman planı kurmasını önerin (“Eve gelip üstümü değiştirince ... başlayacağım.”); planı görebileceği bir yere assın.',
        },
        low: {
          student: 'Bu hafta günde tek bir küçük iş seç ve onu bir eğer-o zaman planına bağla (“Kahvaltıdan sonra beş dakika ... yapacağım.”); yaptığın günleri bir takvimde işaretle.',
          parent: 'Bu hafta çocuğunuzla günde tek bir küçük iş seçin ve onu bir eğer-o zaman planına bağlayın (“Kahvaltıdan sonra beş dakika ... yapacağım.”); yaptığı günleri bir takvimde işaretlesin.',
        },
      },
      settings: {
        high: 'Kendi işlerini planlayıp yürütmenin beklendiği ortamlar',
        low: 'Başlangıçların ve ara hedeflerin belli olduğu, düzenin dışarıdan da desteklendiği ortamlar',
      },
    },
    restraint: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'İsteklere karşı koyabilmen çalışırken dikkatini korumana yardım edebilir. Kısa ve odaklı oturumlar planla; her oturumun sonunda kitaba bakmadan öğrendiklerini yaz ve tekrarlarını günlere yay.',
          parent:
            'Çocuğunuzun isteklere karşı koyabilmesi çalışırken dikkatini korumasına yardım edebilir. Kısa ve odaklı oturumlar planlayıp her oturumun sonunda kitaba bakmadan öğrendiklerini yazması ve tekrarlarını günlere yayması ona uyabilir.',
          adult:
            'İsteklere karşı koyabilmen öğrenirken dikkatini korumana yardım edebilir. Kısa ve odaklı oturumlar planla; her oturumun sonunda kaynağa bakmadan öğrendiklerini yaz ve tekrarlarını günlere yay.',
        },
        average: {
          student:
            'Çalışma oturumlarının arasına kısa molalar koy ve molada ne yapacağını önceden belirle; böylece mola uzamaz. Oturum bitince kitaba bakmadan hatırladıklarını yaz.',
          parent:
            'Çocuğunuz çalışma oturumlarının arasına kısa molalar koyup molada ne yapacağını önceden belirleyebilir; böylece mola uzamaz. Oturum bitince kitaba bakmadan hatırladıklarını yazması ona uyabilir.',
          adult:
            'Öğrenme oturumlarının arasına kısa molalar koy ve molada ne yapacağını önceden belirle; böylece mola uzamaz. Oturum bitince kaynağa bakmadan hatırladıklarını yaz.',
        },
        low: {
          student:
            'Çalışmaya oturmadan önce seni en çok çeken şeyi ulaşamayacağın bir yere bırak; kısa oturumlar planla ve her oturumun sonunda kitaba bakmadan hatırladıklarını yaz.',
          parent:
            'Çocuğunuz çalışmaya oturmadan önce onu en çok çeken şeyi ulaşamayacağı bir yere bırakabilir; kısa oturumlar planlayıp her oturumun sonunda kitaba bakmadan hatırladıklarını yazması ona uyabilir.',
          adult:
            'Öğrenmeye oturmadan önce seni en çok çeken şeyi ulaşamayacağın bir yere bırak; kısa oturumlar planla ve her oturumun sonunda kaynağa bakmadan hatırladıklarını yaz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta kendini kolayca tutabildiğin bir durumda bunu neyin kolaylaştırdığını düşün (ortam, saat, yanındakiler); aynı düzeni zorlandığın başka bir durumda dene.',
          parent: 'Bu hafta çocuğunuzla, kendini kolayca tutabildiği bir durumda bunu neyin kolaylaştırdığını konuşun (ortam, saat, yanındakiler); aynı düzeni zorlandığı başka bir durumda denemesini önerin.',
        },
        average: {
          student: 'Bu hafta seni en çok zorlayan bir isteği seç ve onu uyandıran şeyi gözünün önünden kaldır (bir oyun uygulamasını telefonun ana ekranından kaldırmak gibi).',
          parent: 'Bu hafta çocuğunuzla, onu en çok zorlayan bir isteği seçin ve onu uyandıran şeyi gözünün önünden kaldırmanın bir yolunu bulun (bir oyun uygulamasını telefonun ana ekranından kaldırmak gibi).',
        },
        low: {
          student: 'Bu hafta bir isteğin en sık geldiği anı seç ve o anda yapacağın kısa bir başka şeyi önceden belirle (kalkıp biraz yürümek ya da su içmek gibi); hafta sonunda bunun ne kadar işe yaradığına bak.',
          parent: 'Bu hafta çocuğunuza, bir isteğin en sık geldiği anı seçmesini ve o anda yapacağı kısa bir başka şeyi önceden belirlemesini önerin (kalkıp biraz yürümek ya da su içmek gibi); hafta sonunda isterse nasıl geçtiğini anlatsın.',
        },
      },
      settings: {
        high: 'Uzun vadeli hedeflerin ve sabrın önemli olduğu ortamlar',
        low: 'Dikkat dağıtan şeylerin az olduğu, düzeni belli ortamlar',
      },
    },
  },
  sources: [KAYNAK.dunlosky, KAYNAK.roediger, KAYNAK.gollwitzer, KAYNAK.duckworth2016],
};
