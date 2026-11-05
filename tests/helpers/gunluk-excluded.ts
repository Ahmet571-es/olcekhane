/**
 * Günlük hayat örneklerinin ve görevlerin yol haritasının dayanamayacağı beceriler: tek yerde tutulur, iki test de buradan okur.
 */

export interface Excluded {
  pattern: RegExp;
  /** Testin sınırlılıklarında ya da `whatItMeasures` metninde geçen sözcük. */
  limitation?: string;
  /** Bu beceriyi ölçen kardeş testin adresi. */
  sibling?: string;
  /** Testin çözülüş biçiminden gelen gerekçe. */
  rule?: string;
  /**
   * Yol haritasında örüntünün kabul edildiği yerler (`supports.<anahtar>`, `weeks.<sıra>`, `approach.<sıra>`, `studyIntro`,
   * `facts.items`, `lastWeek` …; bir yer kendi alt yerlerini de kapsar: `supports.ayna` başlığı ve metni) ve nedeni. Verilmezse
   * örüntü yol haritasının hiçbir yerinde geçmez. Her yerde örüntü gerçekten geçmelidir (kullanılmayan izin kalmaz).
   */
  roadmap?: { where: string[]; why: string };
}

/**
 * Görev, okuma ve konu tarama testlerinde örneklerin dayanamayacağı beceriler (denetim listesinin 20. ve 21.
 * maddeleri): testin kendi sınırlılıklarında "bilgi vermez" dediği (`limitation`: o metinde geçen sözcük), sitede başka bir
 * testin ölçtüğü (`sibling`: o testin adresi) ya da testin çözülüş biçimine uymayan (`rule`: gerekçe) işler.
 *
 * Tablo iki yerde kullanılır: "Günlük hayatta nerede kullanılır" örnekleri (tests/gunluk-hayat.test.ts) ve zihinsel görevlerin
 * yol haritası (tests/yol-haritasi-uyum.test.ts). Yol haritası da örüntüye uymaz; uyduğu bir yer varsa `roadmap` o yeri ve
 * nedenini söyler (ör. metin testin kendisini anlatır ya da örüntüdeki sözcük orada başka bir anlamdadır).
 */
export const EXCLUDED: Record<string, Excluded[]> = {
  'sekil-akil-yurutme': [
    { pattern: /sayı dizi|sayı örüntü|sayılarla|sayısal/iu, limitation: 'sayısal akıl yürütme', sibling: 'sayi-dizileri' },
    {
      pattern: /kelime|sözel|cümle/iu,
      limitation: 'sözel',
      roadmap: {
        where: ['supports.soyle', 'weeks.0'],
        why: 'Şekillerde bulunan kuralı bir cümleyle söylemek bir çalışma yoludur; sözcüklerle akıl yürütme örneği değildir.',
      },
    },
    { pattern: /adımlara ayır|adımlarını|plan yap/iu, sibling: 'planlama-kule-gorevi' },
    { pattern: /sudoku|satranç/iu, rule: 'kurallar oyuncuya verilir: kural bulmayı değil uygulamayı ister' },
  ],
  'simge-bulma': [
    {
      pattern: /deftere geçir|yazı yaz|okuma hızı|hızlı oku|hesap|zihinden|tutarı/iu,
      limitation: 'yazma ya da okuma hızı hakkında doğrudan bilgi vermez',
      roadmap: {
        where: ['supports.akici'],
        why: 'Temel işleri akıcılaştırma önerisi, testin bilim kartının da andığı kılavuza (Gersten ve ark., 2009) dayanır ve sık yapılan işlerin (yetişkinde sık kullanılan hesaplar) tekrarla akıcılaşmasını anlatır; testin hesap ya da yazma hızını ölçtüğünü söylemez.',
      },
    },
  ],
  'okuma-hizi-ve-anlama': [
    { pattern: /bilgi(?:yi)? bul|aradığı|arayıp|tarayıp/iu, rule: 'sorular metne bakmadan cevaplanır: metinde bilgi aramak ölçülmez' },
    { pattern: /akıcı/iu, sibling: 'sesli-okuma-degerlendirmesi' },
    { pattern: /gereken süre/iu, rule: 'okuma hızı dakikada okunan kelime sayısıdır' },
  ],
  'sekil-benzetmeleri': [
    {
      pattern: /sayı|kelime|sözel|cümle/iu,
      limitation: 'sözel ve sayısal akıl yürütme',
      roadmap: {
        where: ['supports.say', 'weeks.0', 'facts.items.2'],
        why: 'Burada “sayı” testteki değişiklik türlerinden biridir (şekillerin sayısı) ya da parça ve değişiklik sayısının zorluğa etkisidir; sayılarla akıl yürütme örneği değildir.',
      },
    },
    { pattern: /sıradaki|örüntü|devamını/iu, sibling: 'sekil-akil-yurutme' },
    {
      pattern: /hızlı|çabuk/iu,
      limitation: 'bellek ve hız',
      roadmap: { where: ['approach.1'], why: 'Veliye hızlı cevabı değil farkları tek tek söylemeyi övmesini önerir: hız istenmez, hız örneği değildir.' },
    },
  ],
  'sayi-dizileri': [
    {
      pattern: /şekil|desen|kelime|sözcük/iu,
      limitation: 'Şekillerle ve sözcüklerle akıl yürütme',
      roadmap: { where: ['approach.1'], why: 'Sayı dizisinin kuralını sözcüklerle söylemek bir çalışma yoludur; sözcüklerle akıl yürütme örneği değildir.' },
    },
    { pattern: /harf|alfabe/iu, sibling: 'harf-dizileri' },
    { pattern: /adımlara ayır|plan yap/iu, sibling: 'planlama-kule-gorevi' },
    {
      pattern: /zihinden|kafadan|hızlı hesap/iu,
      sibling: 'zihinden-hesaplama-hizi',
      roadmap: {
        where: ['supports.oyna'],
        why: 'Testin sınırlılığı sonucun sayı bilgisi ve hesap rahatlığıyla da ilişkili olduğunu söyler (LeFevre ve Bisanz, 1986); kart bu rahatlığı destekleyen işleri önerir, zihinden hesaplamanın bu becerinin kullanıldığı yer olduğunu söylemez.',
      },
    },
  ],
  'harf-dizileri': [
    { pattern: /şekil|sayı|rakam/iu, limitation: 'Şekillerle ve sayılarla akıl yürütme' },
    {
      pattern: /anlam|deyim/iu,
      sibling: 'kelime-bilgisi',
      roadmap: { where: ['facts.items'], why: 'Bilgi kutusundaki “anlamına gelmez” bir deyiştir; kelimelerin anlamını bilmek örneği değildir.' },
    },
    { pattern: /sözlükte|alfabe sırasıyla diz/iu, rule: 'bilinen alfabe sırasını uygulamak kural bulmayı istemez' },
  ],
  'sozel-akil-yurutme': [
    {
      pattern: /şekil|sayı/iu,
      limitation: 'Şekillerle ve sayılarla akıl yürütme',
      roadmap: {
        where: ['supports.iliski'],
        why: 'Kart, testin bilim kartının da andığı araştırmayı (Thibaut ve ark., 2010) aktarır: şekillerle hazırlanmış benzetmelerde görünüşe benzeyen seçeneğin sık seçilmesi; şekillerle akıl yürütmeyi önermez.',
      },
    },
    { pattern: /eş anlam|zıt anlam|deyim|anlamını bil/iu, sibling: 'kelime-bilgisi' },
    // "eğer" sözcük olarak aranır ("değerlendirin" içinde de geçer).
    { pattern: /(?<!\p{L})eğer(?!\p{L})|ise …/iu, sibling: 'mantiksal-akil-yurutme' },
    // "uyan" değil: "ona uyanı ara" (ilişkiye uyan kelime) de geçer.
    { pattern: /uyand|uyanma|yaşça|daha hızlı koşar|makas/iu, rule: 'hep aynı sorular gelir: soruların konuları kullanılmaz' },
  ],
  'mantiksal-akil-yurutme': [
    { pattern: /şekil|sayı|matematik/iu, limitation: 'şekillerle ya da sayılarla akıl yürütme' },
    { pattern: /grupla|sırayı kur|ilişkiyi bul/iu, sibling: 'sozel-akil-yurutme' },
    { pattern: /ilk akla gelen|acele/iu, sibling: 'dusunerek-karar-verme' },
    { pattern: /güller|(?<!\p{L})kuşlar|kediler|köpekler/iu, rule: 'hep aynı sorular gelir: soruların konuları kullanılmaz' },
  ],
  'kagit-katlama': [
    { pattern: /döndür|çevir/iu, limitation: 'şekilleri zihinde döndürme' },
    { pattern: /yön bul|harita|kroki/iu, limitation: 'yön bulma' },
    { pattern: /açınım|küp|kutu/iu, sibling: 'kup-acinimi' },
    { pattern: /yapboz|tangram|parçaları birleştir|eşya kur/iu, sibling: 'parcalardan-sekil' },
  ],
  'sayisal-akil-yurutme': [
    { pattern: /konu bilgisi|matematik notu|karne/iu, limitation: 'matematik başarısını ya da konu bilgisini ölçmez' },
    { pattern: /dizi|örüntü/iu, sibling: 'sayi-dizileri' },
    { pattern: /zihinden|kafadan|çarpım tablosu|para üstü/iu, sibling: 'zihinden-hesaplama-hizi' },
    {
      pattern: /simit|gömlek|limonata|(?<!\p{L})kek(?!\p{L})|tarif|yemeği çoğalt|taksi|koro|fidan|kumbara|(?<!\p{L})tur(?:da|u|lar)?(?!\p{L})|terazi|boyacı|bisiklet|yaşın|yaşında|abla|fotoğraf|yolculu/iu,
      rule: 'hep aynı sorular gelir: soruların konuları kullanılmaz',
      roadmap: {
        where: ['supports.iki-kat', 'supports.terazi', 'approach.0', 'weeks.1', 'weeks.2', 'lastWeek'],
        why: 'Yol haritası raporun anlattığı iki yanılgıyı (orantı ile farkı karıştırmak, eşittir işaretini “sonuç” diye okumak) çalışmayı önerir; tarif, terazi ve veliye yaklaşımdaki günlük durumlar (mutfak, alışveriş, yolculuk) bu çalışmanın örnekleridir. Sorulardaki sayılar ve cevaplar kullanılmaz; bir sorunun neredeyse aynısı olan örnek (yaş farkı) yoktur. Becerinin kullanıldığı yerleri söyleyen giriş cümlesi soruların konularını anmaz.',
      },
    },
  ],
  'zihinden-hesaplama-hizi': [
    {
      pattern: /problem çöz/iu,
      limitation: 'problem çözmenin tamamını ölçmez',
      roadmap: { where: ['facts.items.1'], why: 'Bilgi kutusu testin sınırlılığını kendisi söyler: problem çözmenin tamamını ölçmez.' },
    },
    { pattern: /orantı|tarif/iu, sibling: 'sayisal-akil-yurutme' },
    { pattern: /dizi|örüntü/iu, sibling: 'sayi-dizileri' },
  ],
  'kup-acinimi': [
    { pattern: /döndür|çevir/iu, limitation: 'zihinde döndürme' },
    { pattern: /yön bul|harita/iu, limitation: 'yön bulma' },
    { pattern: /delik|delin|delme/iu, sibling: 'kagit-katlama' },
    { pattern: /kurulum çizim|farklı yönlerden/iu, sibling: 'uc-boyutlu-zihinde-dondurme' },
    { pattern: /yapboz|tangram/iu, sibling: 'parcalardan-sekil' },
  ],
  'parcalardan-sekil': [
    { pattern: /yön bul|harita/iu, limitation: 'yön bulma' },
    { pattern: /katla|delik/iu, sibling: 'kagit-katlama' },
    { pattern: /açınım|küp/iu, sibling: 'kup-acinimi' },
    { pattern: /gizli|saklı/iu, sibling: 'gizli-sekiller' },
    { pattern: /eşya kur|kurulum|odaya/iu, sibling: 'uc-boyutlu-zihinde-dondurme' },
    {
      pattern: /ters çevir|ayna/iu,
      rule: 'parçalar ters çevrilemez: ayna görüntüsü aynı parça sayılmaz',
      roadmap: {
        where: ['supports.ayna', 'lastWeek'],
        why: 'Kart ve son hafta testin kuralını anlatır (ayna görüntüsü aynı parça sayılmaz) ve bunu denetlemeyi önerir; parçayı çevirmeyi gerektiren bir iş önermez.',
      },
    },
  ],
  'uc-boyutlu-zihinde-dondurme': [
    { pattern: /katla|açınım/iu, limitation: 'zihinde katlama' },
    { pattern: /yön bul|harita/iu, limitation: 'yön bulma' },
    { pattern: /düz şekil|iki boyutlu|harf/iu, sibling: 'zihinde-dondurme' },
    { pattern: /bakış açısı|kendini .*yere/iu, sibling: 'bakis-acisi-alma' },
  ],
  'bakis-acisi-alma': [
    { pattern: /yol bul|yolunu|kaybol/iu, limitation: 'gerçek bir ortamda yol bulmayı doğrudan ölçmez' },
    { pattern: /duygu|hisset|düşüncesini/iu, sibling: 'empati' },
    {
      pattern: /cismi|çevir|döndür/iu,
      sibling: 'uc-boyutlu-zihinde-dondurme',
      roadmap: {
        where: ['supports.harita', 'weeks.1', 'lastWeek', 'facts.items.3'],
        why: 'Haritayı yürünen yöne çevirmek, kendini haritada bir yöne koymayı kolaylaştıran bir bakış açısı yoludur, cisim döndürme örneği değildir; veliye bilgi kutusu ise bu becerinin zihinde döndürmeden daha yavaş geliştiğini karşılaştırarak söyler.',
      },
    },
  ],
  'gizli-sekiller': [
    { pattern: /kişilik|tarz/iu, limitation: 'kişilik özelliği' },
    { pattern: /liste|tablo|farkları bul/iu, sibling: 'simge-bulma' },
    { pattern: /yapboz|birleştir/iu, sibling: 'parcalardan-sekil' },
    {
      pattern: /döndür|çevril/iu,
      sibling: 'zihinde-dondurme',
      roadmap: {
        where: ['supports.denetle'],
        why: 'Kart testin kuralını anlatır: şekil aynı yönde saklıdır, döndürülmüş ya da ters çevrilmiş bir şekil aynı şekil sayılmaz; döndürmeyi önermez.',
      },
    },
  ],
  'dusunerek-karar-verme': [
    { pattern: /bütün kararlar|hayat kararı|önemli kararlar/iu, limitation: 'günlük hayattaki bütün kararlar' },
    { pattern: /haber|iddia/iu, sibling: 'mantiksal-akil-yurutme' },
    {
      // Kısa sözcükler sözcük başında aranır ("okuyup" içinde "kuyu" geçer).
      pattern: /tavuk|horoz|koşu|yarış|makine|yosun|koyun|kuyruk|asansör|kütük|sincap|dergi|(?<!\p{L})muz|defter|(?<!\p{L})(?:kalem|usta|tren|kuyu|sopa)|ağaç dik|duvar|pembe|salyangoz|bilet|daha pahalı|çitin/iu,
      rule: 'hep aynı sorular gelir: soruların konuları kullanılmaz',
    },
  ],
  'kelime-bilgisi': [
    {
      pattern: /yazarken|konuşurken|yazım|dil bilgisi|cümle kur|kompozisyon/iu,
      limitation: 'yazım ya da dil bilgisi',
      roadmap: {
        where: ['weeks.2'],
        why: 'Yeni bir deyimle örnek cümle kurmak bir öğrenme yoludur: kelimeleri etkin biçimde kullanmak, yalnızca tanımlarını okumaktan genellikle daha etkili bulunmuştur (Wright ve Cervetti, 2017; testin bilim kartı). Testin kelimeleri kullanmayı ölçtüğünü söylemez.',
      },
    },
    { pattern: /ilişkiyi bul|grupla|gruba uymayan/iu, sibling: 'sozel-akil-yurutme' },
  ],
  'planlama-kule-gorevi': [
    { pattern: /zamana yay|zamanında|takvim|ne zaman|günlere böl/iu, limitation: 'bir işi zamana yaymak' },
    {
      pattern: /(?<!\p{L})(?:top|topu|topları|çubuk\p{L}*|kule\p{L}*)(?!\p{L})/iu,
      rule: 'her seferinde aynı problemler gelir: örnekler problemlerin konusunu (renkli toplar, çubuklar) anmaz',
      roadmap: {
        where: ['studyIntro', 'facts.items.1', 'supports.geri'],
        why: 'Bu metinler testin kendisini anlatır: ölçtüğü şey (topları en az hamlede hedef düzene getirmek; sınırlılıktaki tanım) ve görevde geriye doğru düşünmenin ne demek olduğu; günlük örnek değildir.',
      },
    },
  ],
  'dikkat-ve-bellek': [
    { pattern: /farkı bul|bir listede|karşılaştır/iu, sibling: 'simge-bulma' },
    { pattern: /alışveriş|kelime listesi/iu, sibling: 'kelime-listesi-hatirlama' },
    { pattern: /harita|yol tarif/iu, sibling: 'bakis-acisi-alma' },
    { pattern: /çizimi|deftere geçir|desen/iu, sibling: 'desen-hatirlama' },
    { pattern: /zihinden|hesap/iu, sibling: 'zihinden-hesaplama-hizi' },
  ],
  'surekli-dikkat': [{ pattern: /hata ara|hataları fark|farkı bul|bir listede/iu, sibling: 'simge-bulma' }],
  'renk-kelime-gorevi': [
    { pattern: /sıra(?:nı|sını|n|sı)? bekle|heykel|simon/iu, sibling: 'dur-git-gorevi' },
    { pattern: /kural(?:ı|lar)? değiş|iki kural/iu, sibling: 'kural-degistirme' },
  ],
  'dur-git-gorevi': [
    { pattern: /dürtü|sabırsız|aceleci/iu, limitation: 'dürtüsellik' },
    { pattern: /söz(?:ü|ün|ünü) kes|araya gir|söze gir|lafa gir|sıra(?:nı|sını|n|sı)? bekle/iu, limitation: 'dürtüsellik' },
    {
      pattern: /değildir|tersini|ters oyun|ters komut/iu,
      sibling: 'renk-kelime-gorevi',
      roadmap: { where: ['facts.note'], why: 'Ortak bilgi kutusundaki “yeterli değildir” bir yüklemdir; soru kökündeki “değildir” örneği değildir.' },
    },
  ],
  'sirayla-birlestirme-gorevi': [{ pattern: /kural/iu, sibling: 'kural-degistirme' }],
  'geriye-donuk-hatirlama': [
    { pattern: /zihinden|hesap/iu, sibling: 'zihinden-hesaplama-hizi' },
    { pattern: /unut/iu, limitation: 'gündelik hayattaki bellek' },
  ],
  'hesapla-ve-hatirla': [
    {
      pattern: /hesap|zihinden|işlem/iu,
      limitation: 'matematik becerisini ölçmek için değil',
      roadmap: {
        where: ['studyIntro', 'facts.items.1'],
        why: 'Testin kendisini anlatır: harfler akılda tutulurken araya işlemler girer. Günlük örneklerde hesap yoktur.',
      },
    },
    { pattern: /sayfa numara/iu, sibling: 'dikkat-ve-bellek' },
    { pattern: /skor/iu, sibling: 'geriye-donuk-hatirlama' },
  ],
  'harf-sayi-siralama': [
    { pattern: /söyle|duy(?:du|ul)|dinle/iu, limitation: 'Öğeler bu testte dinletilmez' },
    { pattern: /unut|doğum gün/iu, limitation: 'günlük hayattaki unutkanlık' },
    { pattern: /ters/iu, sibling: 'dikkat-ve-bellek' },
  ],
  'desen-hatirlama': [
    {
      pattern: /sırayla|sırasını|yol tarif/iu,
      limitation: 'Yerlerin sırasını hatırlamak',
      roadmap: {
        where: ['facts.items.2'],
        why: 'Veliye bilgi kutusu testin sınırlılığını kendisi söyler: desenleri hatırlamak, yerlerin sırasını hatırlamaktan ayrı bir beceridir.',
      },
    },
    { pattern: /eşini bul|ezber/iu, rule: 'kartların yerini oyun boyunca hatırlamak hareketsiz bir görüntüyü hemen ardından hatırlamak değildir' },
    { pattern: /farkı bul/iu, sibling: 'simge-bulma' },
    { pattern: /yapboz/iu, sibling: 'parcalardan-sekil' },
    {
      pattern: /kareli/iu,
      rule: 'her seferinde aynı desenler gelir: örnekler kareli desenleri anmaz',
      roadmap: {
        where: ['weeks.0'],
        why: 'Haftalık oyun kareli kâğıda oynayanların kendi çizdiği desenlerle oynanır, testteki desenler kullanılmaz; bilgi kutusu oyunun teste benzediğini ve yeniden çözünce sonucun yükselebileceğini söyler.',
      },
    },
  ],
  'kelime-listesi-hatirlama': [
    {
      pattern: /ertesi gün|bir gün sonra|hafta sonra|yarım saat/iu,
      limitation: 'uzun süre sonra',
      roadmap: {
        where: ['supports.yokla', 'supports.aralik', 'weeks.2'],
        why: 'Bakmadan hatırlama ve aralıklı tekrar öğrenileni uzun süre akılda tutmanın yollarıdır; kartlar kaynaklarının bulgularını aktarır (Roediger ve Karpicke; Cepeda ve ark.). Testin uzun süre sonra hatırlamayı ölçtüğünü söylemez.',
      },
    },
    { pattern: /duydu|duyul|söylen|dinle|tanıştı|yüz(?:ü|leri|ler)(?!\p{L})/iu, limitation: 'duyduğunu hatırlama' },
    { pattern: /anlamı|yeni kelime|eş anlam|deyim/iu, sibling: 'kelime-bilgisi' },
    {
      pattern:
        /(?<!\p{L})(?:tavşan|pencere|limon|köprü|gitar|para|gömlek|çekiç|balon|kibrit|araba|bayrak|ayna|anahtar|kulak|sabun|havuz|zarf|tabure|terazi|dürbün|mendil|yastık|pusula|heykel|kupa|sandık|şemsiye|maske|sepet|ekmek|saat|bardak)/iu,
      rule: 'her seferinde aynı kelimeler gelir: örnekler listedeki kelimeleri kullanmaz',
    },
    {
      pattern: /(?<!\p{L})(?:zincir|tuğla|portakal|kucak|ceket|otobüs|tencere|keman|çatal|yaprak|kaktüs|sincap|(?:yara|boya|salon)(?!\p{L}))/iu,
      rule: 'tanıma bölümündeki kelimeler de her seferinde aynıdır: örnekler onları kullanmaz',
    },
  ],
  'zihinde-dondurme': [
    { pattern: /üç boyut|küp|kutu|eşya|nesne|ayakkabı/iu, limitation: 'üç boyutlu nesneleri', sibling: 'uc-boyutlu-zihinde-dondurme' },
    { pattern: /harita|yön bul|yol tarif/iu, sibling: 'bakis-acisi-alma' },
    { pattern: /yapboz|parçanın|yerine otur/iu, sibling: 'parcalardan-sekil' },
    { pattern: /katla/iu, sibling: 'kagit-katlama' },
  ],
  'tepki-hizi': [
    { pattern: /spor|maç|futbol|basketbol|voleybol|tenis|kaleci|yakan top/iu, limitation: 'spordaki beceri' },
    {
      pattern: /araba|araç|sürücü|direksiyon|trafik|fren|bisiklet|karşıdan karşıya/iu,
      rule: 'araç kullanma ve trafik örneği yok: görev sürüş güvenliği hakkında bir şey söylemez',
    },
    { pattern: /heykel|kıpırda|sıra(?:nı|sını)? bekle/iu, sibling: 'dur-git-gorevi' },
    { pattern: /aniden|çarpış|kaza/iu, rule: 'güvenlik ya da kaza çerçevesi yok: görev bu konuda bir şey söylemez' },
  ],
  'kural-degistirme': [
    { pattern: /plan|uyum sağla|yeni durum|çözüm yolu/iu, limitation: 'plan değiştirebilmek' },
    { pattern: /simon/iu, sibling: 'dur-git-gorevi' },
    { pattern: /noktaları|sırayla birleştir/iu, sibling: 'sirayla-birlestirme-gorevi' },
  ],
};
