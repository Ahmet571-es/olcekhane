import type { ReadingInstrument } from '@/lib/instruments/types';

/**
 * Okuma Hızı ve Anlama
 * Özgün görev: metinler ve sorular Ölçekhane tarafından yazılmıştır.
 * Öğrenci kendi sınıf düzeyine uygun metni sessiz okur; süre ölçülür. Metin kapandıktan sonra
 * 8 soru cevaplar (3 bilgi, 2 çıkarım, 2 kelime, 1 ana fikir). Metne geri dönülemez.
 */
export const okumaHizi: ReadingInstrument = {
  slug: 'okuma-hizi-ve-anlama',
  version: 1,
  engine: 'reading',
  name: 'Okuma Hızı ve Anlama',
  shortName: 'Okuma',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 7,
  sortOrder: 40,
  tagline: 'Sınıf düzeyine uygun bir metni ne kadar hızlı okuyup ne kadarını anladığını birlikte ölçer.',
  description:
    'Hızlı okumak tek başına bir beceri değildir; önemli olan anlayarak okumaktır. Bu görevde öğrenci kendi sınıf düzeyine göre yazılmış bir metni sessizce okur, ardından metne bakmadan sekiz soruyu cevaplar. Rapor, okuma hızını ve anlama oranını birlikte değerlendirir.',
  intro: {
    title: 'Okuma görevi',
    paragraphs: [
      'Birazdan kısa bir metin göreceksin. "Okumaya başla" düğmesine bastığında süre başlar.',
      'Metni her zamanki gibi, sessizce ve anlayarak oku. Acele etmene gerek yok; hızdan çok anlamak önemli.',
      'Bitirince "Okudum" düğmesine bas. Metin kapanacak ve sana metinle ilgili 8 soru sorulacak. Sorulara geçtikten sonra metne geri dönemezsin.',
    ],
  },
  scales: [
    {
      key: 'comprehension',
      name: 'Anlama',
      plain: 'Okunan metindeki bilgileri, çıkarımları ve ana fikri kavrayabilme.',
    },
    {
      key: 'speed',
      name: 'Okuma hızı',
      plain: 'Bir dakikada okunan kelime sayısı.',
    },
  ],
  referenceRates: [
    { grade: 1, wpm: 45, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 2, wpm: 73, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 3, wpm: 91, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 4, wpm: 97, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
  ],
  passages: [
    {
      key: 'karincalar',
      title: 'Karıncalar Yolu Nasıl Bulur?',
      minGrade: 3,
      maxGrade: 4,
      paragraphs: [
        'Bir karıncanın ekmek kırıntısını bulup yuvasına taşıdığını görmüşsündür. Peki kısa süre sonra aynı kırıntıya uzun bir karınca sırasının ulaşması nasıl oluyor?',
        'Yiyecek bulan karınca, yuvaya dönerken yere çok küçük damlalar hâlinde özel bir koku bırakır. Bu koku, insanların burnunun fark edemeyeceği kadar hafiftir ama öteki karıncalar onu kolayca algılar. Karıncalar bu koku izini, bizim bir haritayı izlememiz gibi takip eder.',
        'Yiyeceğe ulaşan her karınca da dönüş yolunda aynı izi tazeler. Böylece iz güçlenir ve daha çok karınca yola çıkar. Yiyecek bitince yeni iz bırakılmaz. Koku birkaç dakika içinde uçup gider, karıncalar da başka yerlere dağılır.',
        'Bilim insanları bu kokulara "feromon" adını verir. Karıncalar feromonlarla yalnızca yol göstermez, tehlikeyi haber vermek için de başka kokular kullanır. Yani küçücük karıncalar, gözle görülmeyen bir dille konuşur.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'c',
          text: 'Yiyecek bulan karınca yuvaya dönerken ne yapar?',
          options: [
            { key: 'a', text: 'Arkadaşlarını çağırmak için ses çıkarır.' },
            { key: 'b', text: 'Yiyeceği yolda bir yere saklar.' },
            { key: 'c', text: 'Yere özel bir koku bırakır.' },
            { key: 'd', text: 'Yolu toprak yığınlarıyla işaretler.' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'a',
          text: 'Bilim insanları karıncaların bıraktığı kokulara ne ad verir?',
          options: [
            { key: 'a', text: 'Feromon' },
            { key: 'b', text: 'Polen' },
            { key: 'c', text: 'Nektar' },
            { key: 'd', text: 'Mikrop' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'd',
          text: 'Yiyecek bitince koku izine ne olur?',
          options: [
            { key: 'a', text: 'İz daha da güçlenir.' },
            { key: 'b', text: 'Karıncalar izi ayaklarıyla siler.' },
            { key: 'c', text: 'İz haftalarca yerde kalır.' },
            { key: 'd', text: 'Koku birkaç dakika içinde uçup gider.' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'b',
          text: 'Bir kırıntıya kısa sürede uzun bir karınca sırasının gelmesinin nedeni nedir?',
          options: [
            { key: 'a', text: 'Bütün karıncaların kırıntıyı uzaktan görmesi' },
            { key: 'b', text: 'Yiyecekten dönen her karıncanın izi yeniden güçlendirmesi' },
            { key: 'c', text: 'Rüzgârın kokuyu yuvaya taşıması' },
            { key: 'd', text: 'Yuvanın kırıntıya çok yakın olması' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'c',
          text: 'Metne göre biz insanlar karıncaların bıraktığı kokuyu neden fark etmeyiz?',
          options: [
            { key: 'a', text: 'Karıncalar kokuyu bizden saklar.' },
            { key: 'b', text: 'Koku yalnızca gece ortaya çıkar.' },
            { key: 'c', text: 'Koku, burnumuzun fark edemeyeceği kadar hafiftir.' },
            { key: 'd', text: 'Koku toprağın altında kalır.' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'a',
          text: '"Aynı izi tazeler" cümlesinde "tazeler" kelimesi hangi anlamda kullanılmıştır?',
          options: [
            { key: 'a', text: 'Yeniler, güçlendirir' },
            { key: 'b', text: 'Temizler' },
            { key: 'c', text: 'Soğutur' },
            { key: 'd', text: 'Siler' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'd',
          text: '"Öteki karıncalar onu kolayca algılar" cümlesinde "algılar" ne demektir?',
          options: [
            { key: 'a', text: 'Unutur' },
            { key: 'b', text: 'Yok eder' },
            { key: 'c', text: 'Taşır' },
            { key: 'd', text: 'Fark eder' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'b',
          text: 'Bu metin en çok neyi anlatıyor?',
          options: [
            { key: 'a', text: 'Karınca yuvalarının nasıl yapıldığını' },
            { key: 'b', text: 'Karıncaların kokuyla nasıl haberleştiğini' },
            { key: 'c', text: 'Karıncaların en çok hangi yiyecekleri sevdiğini' },
            { key: 'd', text: 'Ekmek kırıntılarının nasıl oluştuğunu' },
          ],
        },
      ],
    },
    {
      key: 'catalhoyuk',
      title: 'Dokuz Bin Yıl Önce Bir Kasaba: Çatalhöyük',
      minGrade: 5,
      maxGrade: 6,
      paragraphs: [
        'Konya Ovası’nda, bugünkü Çumra ilçesi yakınlarında iki alçak tepe yükselir. Uzaktan bakınca sıradan birer tepe gibi görünürler. Oysa bu tepelerin içinde, yaklaşık dokuz bin yıl önce binlerce insanın yaşadığı bir yerleşim saklıdır: Çatalhöyük.',
        'Çatalhöyük’ün evleri kerpiçten, yani çamurla samanın karıştırılıp güneşte kurutulmasıyla yapılan tuğlalardan inşa edilmişti. Evler öyle bitişikti ki aralarında sokak yoktu. İnsanlar damların üzerinde yürüyor, evlerine çatıdaki bir açıklıktan tahta merdivenle iniyordu. Bu düzen, evleri hem soğuktan hem de dışarıdan gelebilecek tehlikelerden koruyordu.',
        'Evlerin iç duvarları sıvanmış ve üzerlerine av sahneleri, hayvanlar ve geometrik desenler çizilmişti. Kazılarda buğday ve arpa taneleri, hayvan kemikleri ve obsidyen denen volkanik camdan yapılmış keskin aletler bulundu. Bu buluntular, Çatalhöyük’te yaşayanların hem tarım yaptığını hem de avlandığını gösteriyor.',
        'Bilim insanları Çatalhöyük’ü, insanların göçebe yaşamdan yerleşik yaşama geçtiği dönemi anlamak için çok önemli bir yer olarak görüyor. Bu yüzden Çatalhöyük, 2012 yılında UNESCO Dünya Mirası Listesi’ne alındı. Bugün ziyaretçiler, arkeologların yıllardır süren çalışmalarını yerinde görebiliyor.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'b',
          text: 'Çatalhöyük hangi ovada yer alır?',
          options: [
            { key: 'a', text: 'Çukurova' },
            { key: 'b', text: 'Konya Ovası' },
            { key: 'c', text: 'Bafra Ovası' },
            { key: 'd', text: 'Muş Ovası' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'd',
          text: 'Çatalhöyük’te insanlar evlerine nasıl giriyordu?',
          options: [
            { key: 'a', text: 'Sokağa açılan kapılardan' },
            { key: 'b', text: 'Yer altındaki tünellerden' },
            { key: 'c', text: 'Geniş pencerelerden' },
            { key: 'd', text: 'Çatıdaki bir açıklıktan merdivenle' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'a',
          text: 'Çatalhöyük UNESCO Dünya Mirası Listesi’ne hangi yıl alındı?',
          options: [
            { key: 'a', text: '2012' },
            { key: 'b', text: '1985' },
            { key: 'c', text: '1999' },
            { key: 'd', text: '2020' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'c',
          text: 'Kazılarda hem tahıl taneleri hem de hayvan kemikleri bulunması neyi gösterir?',
          options: [
            { key: 'a', text: 'İnsanların yalnızca avlanarak geçindiğini' },
            { key: 'b', text: 'Evlerin hayvan barınağı olarak kullanıldığını' },
            { key: 'c', text: 'İnsanların hem tarım yaptığını hem avlandığını' },
            { key: 'd', text: 'Tahılların başka ülkelerden getirildiğini' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'b',
          text: 'Metne göre evlerin bitişik olmasının ve aralarında sokak bulunmamasının bir yararı nedir?',
          options: [
            { key: 'a', text: 'Daha çok tarla açılmasını sağlamak' },
            { key: 'b', text: 'Evleri soğuktan ve dış tehlikelerden korumak' },
            { key: 'c', text: 'Pazar kurmayı kolaylaştırmak' },
            { key: 'd', text: 'Evlerin içini daha aydınlık yapmak' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'd',
          text: 'Metinde "kerpiç" ne anlama geliyor?',
          options: [
            { key: 'a', text: 'Volkanik camdan yapılmış alet' },
            { key: 'b', text: 'Tahta merdiven' },
            { key: 'c', text: 'Duvara yapılan resim' },
            { key: 'd', text: 'Çamur ve samanla yapılıp güneşte kurutulan tuğla' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'a',
          text: '"Yerleşik yaşam" ifadesi ne anlama gelir?',
          options: [
            { key: 'a', text: 'Bir yerde sürekli kalarak yaşamak' },
            { key: 'b', text: 'Sürekli yer değiştirerek yaşamak' },
            { key: 'c', text: 'Büyük bir şehirde yaşamak' },
            { key: 'd', text: 'Tek başına yaşamak' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'c',
          text: 'Metnin ana fikri nedir?',
          options: [
            { key: 'a', text: 'Konya’da çok sayıda alçak tepe vardır.' },
            { key: 'b', text: 'Obsidyen çok keskin bir taştır.' },
            { key: 'c', text: 'Çatalhöyük, yerleşik yaşama geçişi anlamamızı sağlayan önemli bir yerleşimdir.' },
            { key: 'd', text: 'UNESCO her yıl listesine yeni yerler ekler.' },
          ],
        },
      ],
    },
    {
      key: 'arilar',
      title: 'Arıların Dansı',
      minGrade: 7,
      maxGrade: 8,
      paragraphs: [
        'Bir bal arısı çiçeklerle dolu bir tarla bulduğunda, bu haberi kovandaki binlerce arkadaşına nasıl iletir? Arıların konuşamadığını düşünürsek bu soru bir bilmece gibi görünür. Bilmeceyi çözen, Avusturyalı bilim insanı Karl von Frisch oldu.',
        'Von Frisch yıllarca cam kovanlarda arıları gözlemledi. Yiyecek bulup dönen arıların petek üzerinde garip hareketler yaptığını fark etti. Yiyecek kovana yakınsa arı daireler çizerek dönüyordu. Yiyecek uzaktaysa hareket değişiyordu: Arı önce düz bir çizgi boyunca gövdesini sağa sola sallayarak ilerliyor, sonra bir yandan dönüp başa geliyor, ardından öbür yandan dönüp aynı çizgiyi tekrarlıyordu. Bu harekete "salınım dansı" dendi.',
        'Von Frisch, dansın rastgele olmadığını gösterdi. Dans çizgisinin yönü, yiyeceğin güneşe göre hangi tarafta olduğunu anlatıyordu. Arı çizgiyi petek üzerinde dik yukarı doğru yapıyorsa yiyecek güneşin tam yönündeydi. Çizgi yukarıdan sağa doğru eğikse yiyecek de güneşin o kadar sağındaydı. Sallanma süresi ise mesafeyi gösteriyordu: Sallanma ne kadar uzun sürerse yiyecek o kadar uzaktı.',
        'Dansı izleyen arılar bu bilgiyi kullanarak, daha önce hiç görmedikleri çiçeklere doğrudan uçabiliyordu. Von Frisch bu buluşuyla 1973 yılında, hayvan davranışları üzerine çalışan iki bilim insanıyla birlikte Nobel Fizyoloji veya Tıp Ödülü’nü aldı.',
        'Bugün bilim insanları, arıların dansını izleyerek hangi bölgelerde yeterli çiçek bulunduğunu anlamaya çalışıyor. Minik bir böceğin dansı, doğayı korumak için bize yol gösteriyor.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'd',
          text: 'Arıların dansının anlamını çözen bilim insanı kimdir?',
          options: [
            { key: 'a', text: 'Charles Darwin' },
            { key: 'b', text: 'Gregor Mendel' },
            { key: 'c', text: 'Louis Pasteur' },
            { key: 'd', text: 'Karl von Frisch' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'b',
          text: 'Yiyecek kovana yakınsa arı nasıl bir hareket yapar?',
          options: [
            { key: 'a', text: 'Düz bir çizgide sallanarak ilerler.' },
            { key: 'b', text: 'Daireler çizerek döner.' },
            { key: 'c', text: 'Kovandan hiç çıkmaz.' },
            { key: 'd', text: 'Kanatlarını hızla çırparak ses çıkarır.' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'a',
          text: 'Salınım dansında sallanmanın süresi neyi gösterir?',
          options: [
            { key: 'a', text: 'Yiyeceğin ne kadar uzakta olduğunu' },
            { key: 'b', text: 'Çiçeklerin rengini' },
            { key: 'c', text: 'Tarladaki çiçek sayısını' },
            { key: 'd', text: 'Havanın sıcaklığını' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'c',
          text: 'Bir arı dans çizgisini petek üzerinde dik yukarı doğru yapıyorsa, dansı izleyen arılar hangi yöne uçar?',
          options: [
            { key: 'a', text: 'Güneşin tam tersi yönüne' },
            { key: 'b', text: 'Kovanın hemen altına' },
            { key: 'c', text: 'Güneşin bulunduğu yöne' },
            { key: 'd', text: 'Rastgele bir yöne' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'd',
          text: 'Metne göre dans, onu izleyen arılara en çok hangi kolaylığı sağlar?',
          options: [
            { key: 'a', text: 'Kovanın içini ısıtmayı' },
            { key: 'b', text: 'Kraliçe arıyı korumayı' },
            { key: 'c', text: 'Daha çok bal yemeyi' },
            { key: 'd', text: 'Daha önce görmedikleri çiçeklere doğrudan gidebilmeyi' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'b',
          text: '"Von Frisch, dansın rastgele olmadığını gösterdi" cümlesi neyi anlatıyor?',
          options: [
            { key: 'a', text: 'Dansın çok hızlı yapıldığını' },
            { key: 'b', text: 'Dansın belirli bir anlamı ve kuralı olduğunu' },
            { key: 'c', text: 'Dansın her gün değiştiğini' },
            { key: 'd', text: 'Dansı yalnızca bir arının yapabildiğini' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'c',
          text: '"Arıları gözlemledi" ifadesindeki "gözlemledi" ne demektir?',
          options: [
            { key: 'a', text: 'Hayal etti' },
            { key: 'b', text: 'Kitaplardan okudu' },
            { key: 'c', text: 'Dikkatle izleyip inceledi' },
            { key: 'd', text: 'Görmezden geldi' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'a',
          text: 'Metnin ana fikri nedir?',
          options: [
            { key: 'a', text: 'Arılar yiyeceğin yerini birbirlerine dansla anlatır.' },
            { key: 'b', text: 'Arılar güneşten korkar.' },
            { key: 'c', text: 'Nobel Ödülü her yıl verilir.' },
            { key: 'd', text: 'Bal üretmek çok zordur.' },
          ],
        },
      ],
    },
    {
      key: 'uyku',
      title: 'Uyurken Öğrenmeye Devam Ediyoruz',
      minGrade: 9,
      maxGrade: 13,
      paragraphs: [
        'Sınavdan önceki gece sabaha kadar çalışmak birçok öğrenciye mantıklı gelir: Ne kadar çok saat, o kadar çok bilgi. Beyin araştırmaları ise bu hesabın önemli bir parçayı atladığını gösteriyor: Öğrendiklerimizin kalıcı hâle gelmesi büyük ölçüde uykuda gerçekleşiyor.',
        'Gün içinde öğrendiğimiz bilgiler önce beynin hipokampus adı verilen bölgesinde geçici olarak tutulur. Hipokampusu, bilgilerin kısa süreliğine bırakıldığı bir masa gibi düşünebiliriz. Uyku sırasında, özellikle derin uyku evrelerinde, bu bilgiler tekrar tekrar canlandırılır ve beynin dış katmanı olan kortekste daha uzun süre kalacakları yerlere aktarılır. Bilim insanları bu sürece "bellek pekiştirme" diyor.',
        'Bu sürecin önemini gösteren deneyler oldukça basit bir düzene sahip. Katılımcılar önce yeni kelimeler ya da bir beceri öğreniyor. Ardından bir grup uyuyor, diğer grup aynı süre uyanık kalıyor. Sonraki testte uyuyan grubun, öğrendiklerini genellikle daha iyi hatırladığı görülüyor. Uykusuz geçen bir gecenin ardından ise yeni bilgi öğrenmek de zorlaşıyor; çünkü dinlenmemiş beyin yeni bilgiyi kaydetmekte güçlük çekiyor.',
        'Uyku yalnızca ezber bilgiler için değil, problem çözme için de önemli. Bazı çalışmalarda, zor bir problemi çözemeden uyuyan kişilerin bir kısmı uyandıktan sonra çözümü daha kolay buldu. Beyin, uyku sırasında bilgiler arasında yeni bağlantılar kuruyor olabilir.',
        'Ergenlik döneminde vücudun uyku saati biraz ileri kayar; gençler akşamları daha geç uykuya dalma eğilimindedir. Uzmanlar 13–18 yaş arasındaki gençler için gecede 8 ila 10 saat uyku öneriyor. Oysa okul sabahları erken başladığında bu süreye ulaşmak zorlaşıyor.',
        'Bu bilgilerden çıkan sonuç açık: Çalışma programı yaparken uyku, kaybedilen zaman değil, öğrenmenin bir parçasıdır. Sınavdan önceki geceyi uykusuz geçirmek yerine konuları günlere yaymak ve düzenli uyumak, hem hatırlamayı hem de sınavdaki dikkati destekler.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'c',
          text: 'Metne göre gün içinde öğrenilen bilgiler önce beynin hangi bölgesinde geçici olarak tutulur?',
          options: [
            { key: 'a', text: 'Beyincik' },
            { key: 'b', text: 'Omurilik' },
            { key: 'c', text: 'Hipokampus' },
            { key: 'd', text: 'Göz siniri' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'a',
          text: 'Uzmanlar 13–18 yaş arasındaki gençler için gecede ne kadar uyku öneriyor?',
          options: [
            { key: 'a', text: '8 ila 10 saat' },
            { key: 'b', text: '5 ila 6 saat' },
            { key: 'c', text: '6 ila 7 saat' },
            { key: 'd', text: '11 ila 12 saat' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'd',
          text: 'Anlatılan deneylerde, öğrendikten sonra uyuyan grupta genellikle ne görülüyor?',
          options: [
            { key: 'a', text: 'Öğrendiklerini tamamen unutuyorlar.' },
            { key: 'b', text: 'Hiç yeni bilgi öğrenemiyorlar.' },
            { key: 'c', text: 'Uyanık kalan gruptan hiçbir farkları olmuyor.' },
            { key: 'd', text: 'Öğrendiklerini daha iyi hatırlıyorlar.' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'b',
          text: 'Metne göre sınavdan önceki geceyi uykusuz geçiren bir öğrenci için hangisi en olasıdır?',
          options: [
            { key: 'a', text: 'Sınavda daha dikkatli olması' },
            { key: 'b', text: 'Çalıştıklarını kalıcı hâle getirmekte zorlanması' },
            { key: 'c', text: 'Hipokampusunun büyümesi' },
            { key: 'd', text: 'Bir süre uykuya hiç ihtiyaç duymaması' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'c',
          text: 'Metne göre gençlerin okul sabahları önerilen uyku süresine ulaşması neden zorlaşıyor?',
          options: [
            { key: 'a', text: 'Gençler uyumaktan hoşlanmadığı için' },
            { key: 'b', text: 'Ödevler çok az olduğu için' },
            { key: 'c', text: 'Vücut saatleri ileri kaydığı ve okul erken başladığı için' },
            { key: 'd', text: 'Hipokampus gece çalışmadığı için' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'a',
          text: 'Metinde "bellek pekiştirme" ifadesi neyi anlatıyor?',
          options: [
            { key: 'a', text: 'Bilgilerin uykuda daha kalıcı yerlere aktarılmasını' },
            { key: 'b', text: 'Çok hızlı ezber yapmayı' },
            { key: 'c', text: 'Bilgilerin zamanla unutulmasını' },
            { key: 'd', text: 'Sınav öncesi duyulan kaygıyı' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'd',
          text: '"Öğrendiklerimizin kalıcı hâle gelmesi" ifadesine anlamca en yakın seçenek hangisidir?',
          options: [
            { key: 'a', text: 'Hızla unutulması' },
            { key: 'b', text: 'Yanlış öğrenilmesi' },
            { key: 'c', text: 'Başkasına anlatılması' },
            { key: 'd', text: 'Uzun süre akılda kalması' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'b',
          text: 'Metnin ana fikri nedir?',
          options: [
            { key: 'a', text: 'Gençler çok uyumamalıdır.' },
            { key: 'b', text: 'Uyku, öğrenmenin ayrılmaz bir parçasıdır.' },
            { key: 'c', text: 'Hipokampus beynin en büyük bölgesidir.' },
            { key: 'd', text: 'Sınavlar sabah yapılmamalıdır.' },
          ],
        },
      ],
    },
  ],
  science: {
    basedOn: 'Özgün görev: sınıf düzeyine göre yazılmış bilgilendirici metinler ve 8 anlama sorusu (Ölçekhane, 2026).',
    whatItMeasures:
      'Sessiz okuma hızı (dakikada kelime) ve okunan metni anlama düzeyi: bilgiyi bulma, çıkarım yapma, kelime anlamı ve ana fikir.',
    turkishVersion: 'Metinler doğrudan Türkçe yazılmıştır; çeviri değildir.',
    reliability:
      'Görev pilot aşamasındadır. Anlama sorularının madde analizi ve metinlerin sınıf düzeyine uygunluğu henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye’de 1–4. sınıflar için sesli okuma hızı çalışmaları vardır (ör. 1–4. sınıflarda dakikada ortalama 45, 73, 91 ve 97 kelime); bu test sessiz okumayı ölçtüğü için 3. ve 4. sınıf raporlarında bu ortalama yalnızca kaba bir fikir olarak verilir. 5. sınıf ve üzeri ile sessiz okuma için yayımlanmış bir Türkiye normu bulunmamaktadır. Bu nedenle hız bir norma göre değerlendirilmez; anlama düzeyiyle birlikte yorumlanır.',
    ageNote: '3. sınıftan itibaren uygundur. Her sınıf grubu kendi düzeyine göre yazılmış farklı bir metin okur.',
    license: 'Özgün içerik: metinler ve sorular Ölçekhane’ye aittir.',
    limitations: [
      'Tek bir metne dayanır; konu ilgisi ve o günkü yorgunluk sonucu etkileyebilir.',
      '8 soru, anlama düzeyi hakkında yalnızca kaba bir fikir verir; tek başına karar için kullanılmamalıdır.',
      'Okuma güçlüğü (disleksi) gibi bir durumu teşhis etmez. Kalıcı zorluk görülürse okulun rehberlik servisiyle görüşülmelidir.',
    ],
    citations: [
      {
        text: 'Erden, G., Kurdoğlu, F. ve Uslu, R. (2002). İlköğretim okullarına devam eden Türk çocuklarının sınıf düzeylerine göre okuma hızı ve yazım hataları normlarının geliştirilmesi. Türk Psikiyatri Dergisi, 13(1), 5–13.',
      },
      {
        text: 'Yıldırım, K. ve Rasinski, T. (2014). Reading fluency beyond English: Investigations into reading fluency in Turkish elementary students. International Electronic Journal of Elementary Education, 7(1), 97–106.',
        url: 'https://files.eric.ed.gov/fulltext/EJ1053598.pdf',
      },
    ],
  },
};
