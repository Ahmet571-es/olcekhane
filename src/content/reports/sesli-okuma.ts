import type { OralLevel } from '@/lib/scoring/oral';

/**
 * Sesli Okuma Değerlendirmesi rapor metinleri. Öğrenci raporu "sen" diliyle; yetişkin raporu (veli ya da öğretmen
 * okur) öğrenciyi üçüncü kişi olarak anlatır. Bütün durum birleşimleri tests/sesli-okuma.test.ts içinde denenir.
 * Otomatik analizde (cihazdaki yapay zekâ; yetişkin dinlemez) AUTO_TEXT kullanılır; o raporda yetişkinin dinlediğini ya
 * da işaretlediğini anlatan bir söz geçmez.
 */

type Two = { student: string; parent: string };

/** Akıcılık derecelendirmesinin boyutları: yetişkin kaydı dinleyip her biri için dört düzeyden birini seçer. */
export const PROSODY_DIMENSIONS = [
  {
    key: 'expression',
    name: 'Vurgu ve tonlama',
    question: 'Öğrenci metni ne kadar anlamına uygun bir sesle okudu?',
    levels: [
      {
        parent: 'Düz, tekdüze bir sesle okudu; sesi çok kısıktı ya da anlaşılması güçtü.',
        student: 'Düz, tekdüze bir sesle okudun; sesin kısıktı ya da anlaşılması güçtü.',
      },
      {
        parent: 'Çoğunlukla düz okudu; yer yer vurgu ve tonlama kullandı.',
        student: 'Çoğunlukla düz okudun; yer yer vurgu ve tonlama kullandın.',
      },
      {
        parent: 'Çoğu yerde anlama uygun vurgu ve tonlama kullandı; sesi rahatça duyuluyordu.',
        student: 'Çoğu yerde anlama uygun vurgu ve tonlama kullandın; sesin rahatça duyuluyordu.',
      },
      {
        parent: 'Konuşur gibi, anlama uygun vurgu ve tonlamayla okudu; soru ve ünlem cümlelerini sesine yansıttı.',
        student: 'Konuşur gibi, anlama uygun vurgu ve tonlamayla okudun; soru ve ünlem cümlelerini sesine yansıttın.',
      },
    ],
  },
  {
    key: 'phrasing',
    name: 'Öbekleme ve noktalama',
    question: 'Kelimeleri anlamlı gruplar hâlinde okuyup noktalama işaretlerine uydu mu?',
    levels: [
      {
        parent: 'Kelime kelime okudu; noktalama işaretlerinde durmadı.',
        student: 'Kelime kelime okudun; noktalama işaretlerinde durmadın.',
      },
      {
        parent: 'Çoğunlukla ikişer üçer kelimelik parçalarla okudu; cümle sonlarında her zaman durmadı.',
        student: 'Çoğunlukla ikişer üçer kelimelik parçalarla okudun; cümle sonlarında her zaman durmadın.',
      },
      {
        parent: 'Çoğu yerde anlamlı kelime gruplarıyla okudu; noktalama işaretlerine genellikle uydu.',
        student: 'Çoğu yerde anlamlı kelime gruplarıyla okudun; noktalama işaretlerine genellikle uydun.',
      },
      {
        parent: 'Anlamlı kelime gruplarıyla, cümle sonlarında ve virgüllerde uygun duraklarla okudu.',
        student: 'Anlamlı kelime gruplarıyla, cümle sonlarında ve virgüllerde uygun duraklarla okudun.',
      },
    ],
  },
  {
    key: 'smoothness',
    name: 'Düzgünlük',
    question: 'Okuma ne kadar takılmadan, kesintisiz sürdü?',
    levels: [
      {
        parent: 'Sık sık takıldı; uzun duraklamalar ve tekrarlar oldu.',
        student: 'Sık sık takıldın; uzun duraklamalar ve tekrarlar oldu.',
      },
      {
        parent: 'Zorlandığı birkaç yerde takıldı, duraksadı ya da tekrar etti.',
        student: 'Zorlandığın birkaç yerde takıldın, duraksadın ya da tekrar ettin.',
      },
      {
        parent: 'Genellikle akıcıydı; takıldığı kelimeleri çabuk çözdü.',
        student: 'Genellikle akıcıydın; takıldığın kelimeleri çabuk çözdün.',
      },
      {
        parent: 'Akıcı okudu; takıldığı az sayıdaki yerde kendini kolayca toparladı.',
        student: 'Akıcı okudun; takıldığın az sayıdaki yerde kendini kolayca toparladın.',
      },
    ],
  },
  {
    key: 'pace',
    name: 'Tempo',
    question: 'Okuma hızı metni anlamaya uygun muydu?',
    levels: [
      { parent: 'Çok yavaş ve zorlanarak okudu.', student: 'Çok yavaş ve zorlanarak okudun.' },
      {
        parent: 'Yavaş okudu ya da yer yer gereğinden hızlı okudu.',
        student: 'Yavaş okudun ya da yer yer gereğinden hızlı okudun.',
      },
      { parent: 'Çoğunlukla uygun bir hızda okudu.', student: 'Çoğunlukla uygun bir hızda okudun.' },
      { parent: 'Baştan sona konuşur gibi, uygun bir hızda okudu.', student: 'Baştan sona konuşur gibi, uygun bir hızda okudun.' },
    ],
  },
] as const;

export type ProsodyKey = (typeof PROSODY_DIMENSIONS)[number]['key'];

/** Metnin öğrenci için düzeyi. */
export const LEVEL_TEXT: Record<OralLevel, { label: string; short: string } & Two> = {
  easy: {
    label: 'Rahat okuyor',
    short: 'Rahat',
    student:
      'Bu metni rahatça okudun ve iyi anladın. Bu düzeydeki metinleri tek başına okuyabilirsin. Kendini biraz zorlamak istersen bir üst düzeydeki metinleri de deneyebilirsin.',
    parent:
      'Öğrenci bu metni hem doğru okudu hem de iyi anladı: Bu düzeydeki metinleri tek başına okuyabilir. Bu düzey, kendi başına keyifle okuyacağı kitaplar için uygundur.',
  },
  support: {
    label: 'Destekle okuyor',
    short: 'Destekle',
    student:
      'Bu metni okudun ama bazı yerlerde zorlandın. Bu düzeydeki metinler gelişimin için çok uygun: Bir yetişkinle birlikte okursan ilerlemen kolaylaşır.',
    parent:
      'Öğrenci bu metni okudu ve büyük ölçüde anladı, ama bazı yerlerde zorlandı. Bu, bir yetişkinin desteğiyle çalışmak için uygun bir düzeydir: Metin ne çok kolay ne de çok zor. Okuma çalışmaları bu düzeydeki metinlerle, birlikte okuyarak yapılabilir.',
  },
  hard: {
    label: 'Bu metin şimdilik zor',
    short: 'Zor',
    student:
      'Bu metin senin için şimdilik zordu. Bu çok olağan bir durum: Herkes kendi hızında gelişir. Daha kısa ve kolay metinlerle çalışarak adım adım ilerleyebilirsin.',
    parent:
      'Bu metin öğrenci için şu an zor: Okurken ya da okuduğunu anlarken belirgin biçimde zorlandı. Zor metinlerle yapılan çalışmalar okumayı sevimsiz hâle getirebilir; daha kısa ve kolay metinlerle başlamak daha uygundur.',
  },
};

/**
 * Doğru ve anlayarak okuyan ama okuması belirgin biçimde yavaş ya da akıcı olmayan öğrenci (bkz. FLUENCY_LOW_TOTAL,
 * lib/scoring/oral.ts): metin "rahat" sayılmaz, bir üst düzey önerilmez; çalışma aynı düzeyde tekrarlı okumadır.
 */
export const FLUENCY_LEVEL_TEXT: { label: string; short: string } & Two = {
  label: 'Doğru okuyor, akıcılığı gelişiyor',
  short: 'Akıcılık gelişiyor',
  student:
    'Bu metni doğru okudun ve iyi anladın; ama okuman yavaştı ya da yer yer kesik kesikti. Kelimeleri doğru okuman çok iyi bir temel. Şimdi aynı düzeydeki metinleri birkaç kez sesli okuyarak daha akıcı okumayı çalışabilirsin; okudukça hızın da artar.',
  parent:
    'Öğrenci bu metni doğru okudu ve iyi anladı; ancak okuması yaşıtlarına göre belirgin biçimde yavaş ya da akıcılıktan uzaktı. Kelimeleri doğru çözmesi iyi bir temeldir; akıcılık ise bu düzeydeki metinlerle yapılan tekrarlı okumayla (aynı metni birkaç kez, her seferinde biraz daha akıcı okumak) gelişir. Daha zor metinlere geçmek için acele etmeyin ve sonucu sınıf öğretmeniyle paylaşın.',
};

/** Akıcılığı gelişen öğrenci için bir sonraki değerlendirme önerisi. */
export const NEXT_TEXT_FLUENCY: Two = {
  student: 'Birkaç hafta aynı düzeydeki metinleri tekrar tekrar sesli okuduktan sonra aynı düzeyden başka bir metni dene; ne kadar akıcılaştığını görürsün.',
  parent:
    'Dört ila altı hafta tekrarlı okuma çalıştıktan sonra aynı sınıf düzeyinden başka bir metinle yeniden değerlendirin. Okuma hızının (dakikada doğru okunan kelime) artışı gelişimin en açık göstergesidir.',
};

/**
 * Doğru okuma ile anlamanın birlikte okunuşu: zorluk kelimeleri çözmekte mi, okuduğunu anlamakta mı? Anahtar
 * "<doğruluk>-<anlama>" düzeyleridir. Aynı düzeydeyse ayrıca açıklanmaz (boş).
 */
export const PROFILE_TEXT: Record<string, Two> = {
  'easy-support': {
    student: 'Kelimeleri doğru ve rahat okuyorsun; biraz daha çalışabileceğin yer okuduğunu anlamak.',
    parent: 'Kelimeleri doğru ve rahat okuyor; biraz daha desteklenebilecek yön, okuduğunu anlamak.',
  },
  'easy-hard': {
    student: 'Kelimeleri doğru ve rahat okuyorsun, ama okuduğunu anlamakta zorlandın. Okurken anlamı takip etmeye odaklanmak sana çok yardımcı olur.',
    parent:
      'Kelimeleri doğru ve rahat okuyor, ama okuduğunu anlamakta zorlandı. Zorluk kelimeleri çözmekte değil; kelime bilgisi ve okuduğunu anlama stratejileri üzerinde durmak daha yararlı olur.',
  },
  'support-easy': {
    student: 'Bazı kelimelerde zorlandın ama metni iyi anladın. Kelimeleri daha rahat okudukça anlamak da kolaylaşır.',
    parent: 'Bazı kelimelerde zorlansa da metni iyi anladı. Kelimeleri daha rahat çözmeye yönelik çalışmalar okumasını kolaylaştıracaktır.',
  },
  'support-hard': {
    student: 'Bazı kelimelerde zorlandın ve okuduğunu anlamak da zor geldi. Önce biraz daha kolay metinlerle çalışmak sana iyi gelir.',
    parent:
      'Bazı kelimelerde zorlandı ve okuduğunu anlamakta da güçlük çekti. Kelimeleri çözmek dikkatinin bir kısmını aldığı için anlamaya daha az yer kalmış olabilir.',
  },
  'hard-easy': {
    student: 'Kelimeleri okumakta zorlandın ama metni anladın. Bu güzel bir işaret: Kelimeleri çözmeye çalıştıkça okuman da rahatlayacak.',
    parent:
      'Kelimeleri çözmekte belirgin biçimde zorlansa da metni anladı. Anlama becerisi iyi görünüyor; öncelik, kelimeleri doğru ve rahat çözmeye yönelik çalışmalardır.',
  },
  'hard-support': {
    student: 'Kelimeleri okumakta zorlandın ama metnin çoğunu anladın. Kelimeleri daha rahat okudukça anlaman da artacak.',
    parent:
      'Kelimeleri çözmekte belirgin biçimde zorlansa da metni büyük ölçüde anladı. Öncelik, kelimeleri doğru ve rahat çözmeye yönelik çalışmalardır; bu kolaylaştıkça anlama da güçlenir.',
  },
};

export const ACCURACY_LABEL: Record<OralLevel, string> = {
  easy: 'Rahat',
  support: 'Zaman zaman zorlanıyor',
  hard: 'Sık zorlanıyor',
};

export const COMPREHENSION_LABEL: Record<OralLevel, string> = {
  easy: 'İyi anlıyor',
  support: 'Büyük ölçüde anlıyor',
  hard: 'Anlamakta zorlanıyor',
};

export const ACCURACY_TEXT: Record<OralLevel, Two> = {
  easy: {
    student: 'Kelimeleri çözmekte zorlanmıyorsun.',
    parent: 'Kelimeleri çözmekte zorlanmıyor.',
  },
  support: {
    student: 'Bazı kelimelerde takıldın. İşaretli metinde hangi kelimelerde zorlandığını görebilirsin.',
    parent:
      'Bazı kelimelerde takıldı. İşaretli metinde hangi kelimelerde zorlandığını görebilirsiniz; bu kelimelerin ortak bir özelliği (uzunluk, ekler, benzer harfler) olup olmadığına bakmak çalışmaya yön verir.',
  },
  hard: {
    student: 'Kelimelerin bir kısmında zorlandın. Kelimeleri çözmek zaman alınca anlamak da zorlaşır; bu yüzden kolay metinlerle çalışmak önemli.',
    parent:
      'Her on kelimeden en az birinde zorlandı. Kelimeleri çözmek dikkatinin büyük kısmını alıyor olabilir; bu da okuduğunu anlamayı zorlaştırır.',
  },
};

export const COMPREHENSION_TEXT: Record<OralLevel, Two> = {
  easy: {
    student: 'Metinle ilgili soruların çoğunu doğru cevapladın: Okuduğunu iyi anlamışsın.',
    parent: 'Metinle ilgili soruların çoğunu doğru cevapladı: Okuduğunu iyi anlamış.',
  },
  support: {
    student: 'Soruların çoğunu doğru cevapladın; bazı noktaları kaçırdın. Okurken "Burada ne anlatılıyor?" diye düşünmek anlamanı güçlendirir.',
    parent: 'Soruların çoğunu doğru cevapladı; metni büyük ölçüde anladı ama bazı noktaları kaçırdı.',
  },
  hard: {
    student: 'Soruların en az yarısında zorlandın. Bir metni okuduktan sonra birlikte konuşmak anlamanı geliştirir.',
    parent: 'Soruların en az yarısında zorlandı: Metni anlamakta güçlük çekti.',
  },
};

export const SKILL_LABELS: Record<string, string> = {
  literal: 'Metindeki bilgiyi bulma',
  inference: 'Çıkarım yapma',
  vocabulary: 'Kelime anlamı',
  main_idea: 'Ana fikir',
};

/** Akıcılık toplamının (4–16) düzeyi. */
export function prosodyLabel(total: number): string {
  if (total >= 13) return 'Akıcı ve anlamlı';
  if (total >= 9) return 'Gelişiyor';
  return 'Desteğe ihtiyaç var';
}

export const GENRE_LABELS = { narrative: 'Öykü', informational: 'Bilgilendirici metin' } as const;

/** Bir sonraki değerlendirme önerisi. */
export const NEXT_TEXT: Record<OralLevel, Two> = {
  easy: {
    student: 'Bir dahaki sefere bir üst sınıfın metinlerinden birini deneyebilirsin.',
    parent:
      'Rahat okuduğu en üst düzeyi bulmak için bir üst sınıfın metinlerinden biriyle de değerlendirme yapabilirsiniz. Gelişimini izlemek için birkaç hafta sonra başka bir metinle yeniden değerlendirin.',
  },
  support: {
    student: 'Birkaç hafta birlikte okuyarak çalıştıktan sonra aynı düzeyden başka bir metni dene; ne kadar ilerlediğini görürsün.',
    parent:
      'Bu düzeydeki metinlerle birlikte okumaya devam edin. Dört ila altı hafta sonra aynı sınıf düzeyinden başka bir metinle yeniden değerlendirerek gelişimi izleyebilirsiniz.',
  },
  hard: {
    student: 'Bir dahaki sefere bir alt sınıfın metinlerinden biriyle başla.',
    parent:
      'Bir alt sınıfın metinlerinden biriyle yeniden değerlendirme yaparak rahat ya da destekle okuduğu düzeyi bulun ve çalışmaları o düzeydeki metinlerle sürdürün.',
  },
};

/**
 * Öğrenci yalnızca kendi sınıfının ve bir alt, bir üst sınıfın metinlerini seçebilir (1–8. sınıf). Seçebileceği bir üst
 * (rahat okuduysa) ya da alt (zorlandıysa) metin yoksa bu cümleler kullanılır.
 */
export const NEXT_TEXT_NO_OTHER: Record<'easy' | 'hard', Two> = {
  easy: {
    student: 'Bir dahaki sefere aynı düzeyden başka bir metinle kendini dene.',
    parent: 'Gelişimini izlemek için birkaç hafta sonra aynı düzeyden başka bir metinle yeniden değerlendirin.',
  },
  hard: {
    student: 'Birkaç hafta kısa ve kolay metinlerle çalıştıktan sonra yeniden dene.',
    parent: 'Birkaç hafta kısa ve kolay metinlerle birlikte çalıştıktan sonra yeniden değerlendirin.',
  },
};

/**
 * Otomatik analiz: okumayı, öğrencinin cihazında (tarayıcıda) çalışan bir konuşma tanıma modeli inceler. Ses cihazdan
 * çıkmaz; analiz bitince silinir. Model bazı kelimeleri yanlış duyabilir; net ayırt edemediği kelimeler hata sayılmaz.
 */
export const AUTO_TEXT = {
  /** Raporun başında, bir kez: okumanın nasıl incelendiği. */
  method: {
    student: {
      title: 'Okuman nasıl incelendi?',
      text: 'Okuman, senin cihazında çalışan bir yapay zekâ modeliyle otomatik olarak incelendi: Yapay zekâ okuduklarını yazıya döktü ve metindeki kelimelerle tek tek karşılaştırdı. Ses kaydın cihazından hiç çıkmadı ve inceleme biter bitmez silindi. Yapay zekâ bazı kelimeleri yanlış duyabilir. Net ayırt edemediği kelimeler metinde “net anlaşılamadı” diye gösterilir ve hata sayılmaz. Bu değerlendirme deneme aşamasında olduğu için sonuçların yaklaşıktır.',
    },
    parent: {
      title: 'Okuma nasıl incelendi?',
      text: 'Kayıt, okumanın yapıldığı cihazda (tarayıcıda) çalışan bir yapay zekâ modeliyle (konuşma tanıma) otomatik olarak incelendi: Model okunanları yazıya döktü, yazıya dökülen kelimeler metindeki kelimelerle tek tek karşılaştırıldı. Ses kaydı cihazdan çıkmadı ve inceleme biter bitmez silindi; sunucumuza yalnızca kelime işaretleri, süre ve duraklama ölçümleri ve cevaplar gönderildi, bunlar da saklanmadı. Yapay zekâ, özellikle çocuk seslerinde ve gürültülü ortamlarda, bazı kelimeleri yanlış duyabilir: Doğru okunmuş bir kelimeyi hata sayabilir ya da bir hatayı fark etmeyebilir. Net ayırt edemediği kelimeler metinde “net anlaşılamadı” diye gösterilir ve hata sayılmaz. Değerlendirme pilot aşamadadır; otomatik analizin bir öğretmenin değerlendirmesiyle ne kadar uyuştuğu henüz ölçülmedi. Sonuçları yaklaşık olarak yorumlayın.',
    },
  },
  /** İşaretli metindeki gösterge. */
  legend: 'Net anlaşılamadı (hata sayılmadı)',
  /** Kelimelerin %10'undan çoğu net anlaşılamadıysa (uyarılarda, raporun başında). */
  unclearHigh: (unclear: number, words: number): Two => ({
    student: `Yapay zekâ metindeki ${words} kelimenin ${unclear} tanesini net anlayamadı. Bu kelimeler hata sayılmadığı için sonuçların yaklaşık. Sessiz bir yerde, cihaza yakın durup net bir sesle yeniden okursan daha doğru bir sonuç alırsın.`,
    parent: `Yapay zekâ metindeki ${words} kelimenin ${unclear} tanesini net ayırt edemedi (ortam gürültülü ya da ses kısık olabilir). Bu kelimeler hata sayılmadığı için doğru okuma oranı ve dakikada doğru okunan kelime sayısı olduğundan yüksek görünebilir; sonuçları yaklaşık olarak yorumlayın. Sessiz bir ortamda yeniden yapılacak bir değerlendirme daha net bir sonuç verir.`,
  }),
  disclaimer: {
    student: 'Tek bir metni sesli okumana ve yapay zekânın otomatik analizine dayanır; bugünkü okumanı yaklaşık olarak gösterir. Okudukça okuman da gelişir.',
    parent:
      'Tek bir metnin sesli okunmasına ve cihazdaki yapay zekânın otomatik analizine dayanır; bugünkü durumu yaklaşık olarak gösterir. Öğretmenin gözlemleriyle birlikte değerlendirilmeli ve gelişimi izlemek için farklı metinlerle tekrarlanmalıdır.',
  },
} as const;

/** Okumadaki zorluk sürdüğünde (yalnızca yetişkin raporunda). */
export const SPECIALIST = {
  title: 'Ne zaman bir uzmana danışmalı?',
  lines: [
    'Okumadaki zorluk sürüyorsa önce sınıf öğretmeniyle ve okulun rehberlik servisiyle görüşmenizi öneririz.',
    'Gerekli görülürse Rehberlik ve Araştırma Merkezi (RAM) eğitsel değerlendirme yapabilir.',
    'Özgül öğrenme güçlüğü (disleksi) gibi durumların tanısı bir test sonucuyla değil, uzmanların kapsamlı değerlendirmesiyle konur. Bu değerlendirme bir tanı aracı değildir.',
  ],
};
