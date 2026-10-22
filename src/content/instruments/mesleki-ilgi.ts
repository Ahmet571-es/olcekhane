import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Mesleki İlgi Profili
 * Kuram: Holland’ın RIASEC modeli (Holland, 1997).
 * Maddeler: Ölçekhane tarafından Türkiye’deki ortaokul ve lise öğrencileri için özgün olarak yazılmıştır;
 * herhangi bir ticari ya da lisanslı envanterden çeviri değildir. Her alan için 8 etkinlik maddesi vardır.
 * Durum: pilot. Güvenirlik ve yapı geçerliği henüz incelenmedi.
 */

const R = 'realistic';
const I = 'investigative';
const A = 'artistic';
const S = 'social';
const E = 'enterprising';
const C = 'conventional';

const BY_TYPE: Record<string, string[]> = {
  [R]: [
    'Bozulan bir eşyayı söküp tamir etmek',
    'Bir mobilyayı ya da maketi parçalarından birleştirmek',
    'Bahçede fide dikip sebze ya da çiçek yetiştirmek',
    'Bir bisikletin ya da motorun nasıl çalıştığını kurcalayarak anlamak',
    'Tahtadan, metalden ya da kumaştan bir şey yapmak',
    'Kamp kurmak, yön bulmak gibi açık havada yapılan işler',
    'Bir robotu ya da elektronik devreyi kablolarını bağlayarak kurmak',
    'Bir aracın lastiğini değiştirmek ya da bakımını yapmak',
  ],
  [I]: [
    'Bir bilim deneyi tasarlayıp sonuçlarını incelemek',
    'Zor bir matematik problemi üzerinde uzun süre düşünmek',
    'Hastalıkların nasıl yayıldığını araştırmak',
    'Mikroskopla hücreleri incelemek',
    'Uzay, gezegenler ve yıldızlar hakkında okumak',
    'Bir bilgisayar programındaki hatayı bulup düzeltmek',
    'Farklı kaynakları karşılaştırarak bir bilginin doğru olup olmadığını araştırmak',
    'Bir tablodaki verileri inceleyip bir örüntü bulmak',
  ],
  [A]: [
    'Resim, çizim ya da karikatür yapmak',
    'Öykü, şiir ya da senaryo yazmak',
    'Bir müzik aleti çalmak ya da şarkı bestelemek',
    'Bir tiyatro oyununda ya da kısa filmde rol almak',
    'Bir afiş, logo ya da internet sayfası tasarlamak',
    'Fotoğraf çekip düzenlemek',
    'Bir odanın dekorasyonunu tasarlamak',
    'Kıyafet ya da aksesuar tasarlamak',
  ],
  [S]: [
    'Bir arkadaşına anlamadığı bir konuyu anlatmak',
    'Küçük çocuklarla oyun ve etkinlik yapmak',
    'Bir yardım kampanyasında gönüllü çalışmak',
    'Üzgün bir arkadaşını dinleyip ona destek olmak',
    'Yaşlı ya da hasta birinin bakımına yardım etmek',
    'Arkadaşlar arasındaki bir anlaşmazlığın çözülmesine yardım etmek',
    'Okula yeni gelen bir öğrencinin alışmasına yardım etmek',
    'İnsanlara sağlıklı yaşam hakkında bilgi vermek',
  ],
  [E]: [
    'Bir okul etkinliğini baştan sona organize etmek',
    'Bir grubun liderliğini üstlenmek',
    'Kendi ürettiğin bir şeyi satmak',
    'Bir tartışmada insanları kendi görüşüne ikna etmek',
    'Küçük bir iş kurmak için plan yapmak',
    'Okul meclisi seçimlerinde aday olmak',
    'Bir ürünün nasıl daha çok satılacağına dair plan yapmak',
    'Bir toplantıyı yönetmek',
  ],
  [C]: [
    'Bir etkinliğin bütçesini hesaplayıp harcamaları takip etmek',
    'Dosyaları, belgeleri ya da fotoğrafları sistemli biçimde düzenlemek',
    'Bir hesap tablosuna (Excel gibi) veri girip düzenlemek',
    'Bir yazıdaki yazım ve noktalama hatalarını düzeltmek',
    'Bir kütüphanedeki kitapları konularına göre sınıflandırmak',
    'Ayrıntılı bir plan ve takvim hazırlamak',
    'Bir depodaki ürünlerin sayımını yapıp kayıt tutmak',
    'Bir formun doğru ve eksiksiz doldurulup doldurulmadığını kontrol etmek',
  ],
};

const LETTER: Record<string, string> = { [R]: 'R', [I]: 'I', [A]: 'A', [S]: 'S', [E]: 'E', [C]: 'C' };
const ORDER = [R, I, A, S, E, C];

/** Maddeler alanlar arasında sırayla dağıtılır; aynı alandan iki madde art arda gelmez. */
function interleave(): LikertItemDef[] {
  const items: LikertItemDef[] = [];
  for (let i = 0; i < 8; i++) {
    // Her turda başlangıç alanını kaydırarak sıralamanın örüntüsünü kır.
    for (let j = 0; j < ORDER.length; j++) {
      const scale = ORDER[(j + i * 2) % ORDER.length];
      items.push({ key: `${LETTER[scale]}${i + 1}`, scale, text: BY_TYPE[scale][i] });
    }
  }
  return items;
}

export const meslekiIlgi: LikertInstrument = {
  slug: 'mesleki-ilgi-profili',
  version: 1,
  engine: 'likert',
  profile: 'riasec',
  name: 'Mesleki İlgi Profili',
  shortName: 'Mesleki ilgi',
  domain: 'career',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 8,
  maxGrade: 13,
  estimatedMinutes: 8,
  sortOrder: 30,
  tagline: 'Altı ilgi alanında hangi etkinliklerden hoşlandığını ölçer ve bu ilgilerle ilişkili örnek meslekleri gösterir.',
  description:
    'Holland’ın RIASEC modeline dayanan bu profil, öğrencinin gerçekçi, araştırmacı, sanatçı, sosyal, girişimci ve düzenli olmak üzere altı ilgi alanında hangi etkinliklerden ne kadar hoşlandığını ölçer. Sonuçta en belirgin üç ilgi alanını ve bu ilgilerle ilişkili örnek meslekleri görürsünüz.',
  intro: {
    title: 'Hangi etkinlikler sana göre?',
    paragraphs: [
      'Birazdan 48 farklı etkinlik göreceksin. Her birini yapmaktan ne kadar hoşlanacağını seç.',
      'O işi yapıp yapamayacağını, ne kadar para kazandıracağını ya da başkalarının ne düşüneceğini düşünme. Yalnızca hoşlanıp hoşlanmayacağını düşün.',
      'Daha önce hiç denemediğin bir etkinlikse, deneseydin nasıl hissedeceğini hayal et.',
    ],
  },
  prompt: 'Bunu yapmaktan ne kadar hoşlanırsın?',
  options: [
    { value: 1, label: 'Hiç hoşlanmam' },
    { value: 2, label: 'Pek hoşlanmam' },
    { value: 3, label: 'Kararsızım' },
    { value: 4, label: 'Hoşlanırım' },
    { value: 5, label: 'Çok hoşlanırım' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.75 },
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'very_low', min: 1 },
      { band: 'low', min: 1.8 },
      { band: 'average', min: 2.6 },
      { band: 'high', min: 3.4 },
      { band: 'very_high', min: 4.2 },
    ],
  },
  scales: [
    { key: R, name: 'Gerçekçi', plain: 'Elle, aletlerle, makinelerle ya da doğada somut işler yapmaktan hoşlanmak.' },
    { key: I, name: 'Araştırmacı', plain: 'Gözlem yapmaktan, araştırmaktan ve karmaşık problemleri çözmekten hoşlanmak.' },
    { key: A, name: 'Sanatçı', plain: 'Kendini ifade etmekten, yaratıcı ve özgün işler ortaya koymaktan hoşlanmak.' },
    { key: S, name: 'Sosyal', plain: 'İnsanlara yardım etmekten, öğretmekten ve onlarla birlikte çalışmaktan hoşlanmak.' },
    { key: E, name: 'Girişimci', plain: 'İkna etmekten, liderlik etmekten, organize etmekten ve risk almaktan hoşlanmak.' },
    { key: C, name: 'Düzenli', plain: 'Düzenden, belirli kurallarla ilerleyen işlerden, verilerle ve ayrıntılarla çalışmaktan hoşlanmak.' },
  ],
  items: interleave(),
  science: {
    basedOn:
      'Holland’ın RIASEC kuramı (Holland, 1997). Maddeler Ölçekhane tarafından Türkiye’deki ortaokul ve lise öğrencileri için özgün olarak yazılmıştır.',
    whatItMeasures:
      'Öğrencinin altı ilgi alanına ait etkinliklerden ne kadar hoşlandığını ölçer: Gerçekçi, Araştırmacı, Sanatçı, Sosyal, Girişimci ve Düzenli. Mesleki ilgiler, iş ve okul performansını yordayan ve kişilikten ayrı, görece kalıcı eğilimlerdir.',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Maddeler öğrencilerin gündelik hayatından ve okul ortamından tanıdık etkinlikler olarak yazılmış, meslek adları kullanılmamıştır.',
    reliability:
      'Pilot aşamasındadır: iç tutarlılık, yapı geçerliği ve altıgen yapısı henüz incelenmedi. Karşılaştırma için: benzer yapıdaki O*NET İlgi Profili kısa formunda her alanın güvenirliği .78–.87 arasındadır.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok. Puanlar ölçeğin kendi aralığına göre ve öğrencinin kendi profili içinde, en yüksekten en düşüğe sıralanarak yorumlanır.',
    ageNote:
      '8. sınıftan itibaren uygulanır. İlgiler ergenlik boyunca gelişmeye devam eder ve asıl olarak üniversite yıllarında kararlı hâle gelir; bu yüzden özellikle 8. ve 9. sınıflarda sonuçlar bir keşif aracı olarak sunulur.',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'İlgi, yetenek demek değildir. Bir alana ilgi duymak o alanda şimdiden başarılı olmak anlamına gelmez; tersi de doğrudur.',
      'İlgiler ergenlikte değişebilir. Testi bir iki yılda bir tekrarlamak önerilir.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı.',
      'Meslek örnekleri yol gösterici niteliktedir; kesin bir eşleştirme değildir. Meslek seçiminde değerler, beceriler ve yaşam koşulları da önemlidir.',
    ],
    citations: [
      {
        text: 'Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3. baskı). Psychological Assessment Resources.',
      },
      {
        text: 'Low, K. S. D., Yoon, M., Roberts, B. W. ve Rounds, J. (2005). The stability of vocational interests from early adolescence to middle adulthood. Psychological Bulletin, 131(5), 713–737.',
        url: 'https://doi.org/10.1037/0033-2909.131.5.713',
      },
      {
        text: 'Nye, C. D., Su, R., Rounds, J. ve Drasgow, F. (2012). Vocational interests and performance: A quantitative summary of over 60 years of research. Perspectives on Psychological Science, 7(4), 384–403.',
        url: 'https://doi.org/10.1177/1745691612449021',
      },
      {
        text: 'Rounds, J. ve Su, R. (2014). The nature and power of interests. Current Directions in Psychological Science, 23(2), 98–103.',
        url: 'https://doi.org/10.1177/0963721414522812',
      },
      {
        text: 'National Center for O*NET Development. O*NET Interest Profiler Short Form: Psychometric characteristics (karşılaştırma için).',
        url: 'https://www.onetcenter.org/dl_files/IPSF_Psychometric.pdf',
      },
    ],
  },
};
