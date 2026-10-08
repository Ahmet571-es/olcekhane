import type { ReadingInstrument } from '@/lib/instruments/types';

/**
 * Okuma Hızı ve Anlama
 * Özgün görev: metinler ve sorular Ölçekhane tarafından yazılmıştır.
 * Öğrenci kendi sınıf düzeyine uygun metni sessiz okur; süre ölçülür (sayfa gizliyken geçen süre sayılmaz). Metin
 * kapandıktan sonra 8 soru cevaplar (3 bilgi, 2 çıkarım, 2 kelime, 1 ana fikir). Metne ve geçilen sorulara geri
 * dönülemez. Sorular birbirinin cevabını ele vermeyecek biçimde yazılır (tests/okuma-hizi.test.ts denetler); çıkarım
 * soruları metinde açıkça yazmayanı sorar.
 */
export const okumaHizi: ReadingInstrument = {
  slug: 'okuma-hizi-ve-anlama',
  version: 1,
  engine: 'reading',
  name: 'Okuma Hızı ve Anlama',
  shortName: 'Okuma',
  domain: 'reading',
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
      'Bitirince "Okudum" düğmesine bas. Metin kapanacak ve sana metinle ilgili 8 soru sorulacak. Sorulara geçtikten sonra metne geri dönemezsin; sorular da birer birer gelir, bir soruyu geçince ona geri dönülmez.',
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
    // Sesli okumada 1 dakikada doğru okunan kelime: ortalama ve standart sapma (Tablo 3).
    { grade: 1, wpm: 45, sd: 27, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 2, wpm: 73, sd: 31, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 3, wpm: 91, sd: 31, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 4, wpm: 97, sd: 46, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
    { grade: 5, wpm: 121, sd: 53, mode: 'oral', source: 'Erden, Kurdoğlu ve Uslu (2002), Türk Psikiyatri Dergisi 13(1)' },
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
        'Yiyeceğe ulaşan her karınca da dönüş yolunda aynı izi tazeler. Böylece iz güçlenir ve daha çok karınca yola çıkar. Yiyecek bitince yeni iz bırakılmaz. Bir süre sonra koku uçup gider, karıncalar da başka yerlere dağılır.',
        'Bilim insanları bu kokulara "feromon" adını verir. Karıncalar feromonlarla yalnızca yol göstermez, tehlikeyi haber vermek için de başka kokular kullanır. Yani küçücük karıncalar, gözle görülmeyen bir dille konuşur.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'c',
          text: 'Metne göre biz insanlar, karıncanın yere bıraktığı kokuyu neden alamayız?',
          options: [
            { key: 'a', text: 'Toprağın altında kaldığı için' },
            { key: 'b', text: 'Yalnızca gece bırakıldığı için' },
            { key: 'c', text: 'Çok hafif olduğu için' },
            { key: 'd', text: 'Karıncalar onu bizden sakladığı için' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'a',
          text: 'Bilim insanları karıncaların kullandığı kokulara ne ad verir?',
          options: [
            { key: 'a', text: 'Feromon' },
            { key: 'b', text: 'Polen' },
            { key: 'c', text: 'Nektar' },
            { key: 'd', text: 'Mikrop' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'd',
          text: 'Yiyecek bittiğinde ne olur?',
          options: [
            { key: 'a', text: 'Karıncalar yeni yiyecek gelene kadar orada bekler.' },
            { key: 'b', text: 'Karıncalar yolu taşlarla işaretler.' },
            { key: 'c', text: 'Karıncalar yuvayı başka bir yere taşır.' },
            { key: 'd', text: 'Yeni iz bırakılmaz ve karıncalar başka yerlere dağılır.' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'b',
          text: 'Yiyecek bulan karınca yuvaya dönerken hiç iz bırakmasaydı büyük olasılıkla ne olurdu?',
          options: [
            { key: 'a', text: 'Kırıntıya daha çok karınca gelirdi.' },
            { key: 'b', text: 'Öteki karıncalar yiyeceğin yerini kolayca bulamazdı.' },
            { key: 'c', text: 'Kırıntı kendiliğinden yuvaya taşınırdı.' },
            { key: 'd', text: 'Karıncalar birbirini hiç tanıyamazdı.' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'b',
          text: 'Yazar, karıncaların izlediği yolu neden bir haritaya benzetiyor?',
          options: [
            { key: 'a', text: 'İkisi de kâğıttan yapıldığı için' },
            { key: 'b', text: 'İkisi de gidilecek yolu gösterdiği için' },
            { key: 'c', text: 'İkisi de uzaktan kolayca görülebildiği için' },
            { key: 'd', text: 'İkisi de yalnızca bilim insanlarının kullandığı şeyler olduğu için' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'd',
          text: '"Dönüş yolunda aynı izi tazeler" cümlesinde "tazeler" kelimesi hangi anlamda kullanılmıştır?',
          options: [
            { key: 'a', text: 'Temizler' },
            { key: 'b', text: 'Soğutur' },
            { key: 'c', text: 'Siler' },
            { key: 'd', text: 'Yeniler' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'a',
          text: '"Öteki karıncalar onu kolayca algılar" cümlesinde "algılar" ne demektir?',
          options: [
            { key: 'a', text: 'Fark eder' },
            { key: 'b', text: 'Yok eder' },
            { key: 'c', text: 'Taşır' },
            { key: 'd', text: 'Unutur' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'c',
          text: 'Bu metin en çok neyi anlatıyor?',
          options: [
            { key: 'a', text: 'Karınca yuvalarının nasıl yapıldığını' },
            { key: 'b', text: 'Karıncaların en çok hangi yiyecekleri sevdiğini' },
            { key: 'c', text: 'Karıncaların yiyeceğe giden yolu birbirine nasıl gösterdiğini' },
            { key: 'd', text: 'Karıncaların tehlikeden nasıl kaçtığını' },
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
        'Çatalhöyük’ün evleri kerpiçten, yani çamurla samanın karıştırılıp güneşte kurutulmasıyla yapılan tuğlalardan inşa edilmişti. Evler öyle bitişikti ki aralarında sokak yoktu. İnsanlar damların üzerinde yürüyor, evlerine çatıdaki bir açıklıktan tahta merdivenle iniyordu. Araştırmacılara göre bu düzen, evleri hem soğuktan hem de dışarıdan gelebilecek tehlikelerden korumuş olabilir.',
        'Bazı evlerin iç duvarları sıvanmış ve üzerlerine av sahneleri, hayvanlar ve geometrik desenler çizilmişti. Kazılarda buğday ve arpa taneleri, hayvan kemikleri ve obsidyen denen volkanik camdan yapılmış keskin aletler bulundu. Bu buluntular, Çatalhöyük’te yaşayanların hem tarım yaptığını hem de avlandığını gösteriyor.',
        'Bilim insanları Çatalhöyük’ü, insanların göçebe yaşamdan yerleşik yaşama geçtiği dönemi anlamak için çok önemli bir yer olarak görüyor. Bu yüzden Çatalhöyük, 2012 yılında UNESCO Dünya Mirası Listesi’ne alındı. Bugün ziyaretçiler, arkeologların yıllardır süren çalışmalarını yerinde görebiliyor.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'c',
          text: 'Çatalhöyük’te insanlar evlerine nasıl giriyordu?',
          options: [
            { key: 'a', text: 'Sokağa açılan kapılardan' },
            { key: 'b', text: 'Yer altındaki tünellerden' },
            { key: 'c', text: 'Çatıdaki bir açıklıktan, merdivenle' },
            { key: 'd', text: 'Bahçeye açılan pencerelerden' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'b',
          text: 'Kazılarda bulunan keskin aletler neyden yapılmıştı?',
          options: [
            { key: 'a', text: 'Demirden' },
            { key: 'b', text: 'Volkanik bir camdan' },
            { key: 'c', text: 'Hayvan boynuzundan' },
            { key: 'd', text: 'Pişmiş topraktan' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'a',
          text: 'Çatalhöyük nerededir?',
          options: [
            { key: 'a', text: 'Konya Ovası’nda, Çumra yakınlarında' },
            { key: 'b', text: 'Karadeniz kıyısında, Samsun yakınlarında' },
            { key: 'c', text: 'Çukurova’da, Adana yakınlarında' },
            { key: 'd', text: 'Van Gölü kıyısında' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'b',
          text: 'Duvarlara av sahnelerinin çizilmiş olması, orada yaşayanlar hakkında en çok neyi düşündürür?',
          options: [
            { key: 'a', text: 'Hiç avlanmadıklarını' },
            { key: 'b', text: 'Avın hayatlarında önemli bir yer tuttuğunu' },
            { key: 'c', text: 'Resim yapmayı başka şehirlerden öğrendiklerini' },
            { key: 'd', text: 'Evlerinde vahşi hayvan beslediklerini' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'd',
          text: 'Metinde iki tepenin uzaktan “sıradan birer tepe gibi” göründüğü söyleniyor. Bundan ne anlaşılır?',
          options: [
            { key: 'a', text: 'Tepelerde bugün de insanlar yaşamaktadır.' },
            { key: 'b', text: 'Tepeler yakın zamanda insanlar tarafından yapılmıştır.' },
            { key: 'c', text: 'Çatalhöyük’te hiç ev bulunmamıştır.' },
            { key: 'd', text: 'Eski yerleşimin kalıntıları zamanla toprakla örtülmüştür.' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'c',
          text: 'Metinde "kerpiç" ne anlama geliyor?',
          options: [
            { key: 'a', text: 'Ovada yetişen bir tahıl' },
            { key: 'b', text: 'Duvara yapılan resim' },
            { key: 'c', text: 'Çamur ve samanla yapılıp güneşte kurutulan tuğla' },
            { key: 'd', text: 'Taştan yapılmış bir alet' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'd',
          text: '"Yerleşik yaşam" ifadesi ne anlama gelir?',
          options: [
            { key: 'a', text: 'Sürekli yer değiştirerek yaşamak' },
            { key: 'b', text: 'Büyük bir şehirde yaşamak' },
            { key: 'c', text: 'Tek başına yaşamak' },
            { key: 'd', text: 'Bir yerde sürekli kalarak yaşamak' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'a',
          text: 'Metnin ana fikri nedir?',
          options: [
            { key: 'a', text: 'Çatalhöyük, insanların yerleşik yaşama geçişini anlamamızı sağlayan çok eski bir yerleşimdir.' },
            { key: 'b', text: 'Eski çağlarda insanlar yalnızca avlanarak geçinirdi.' },
            { key: 'c', text: 'Arkeologlar her yıl yeni tepeler bulur.' },
            { key: 'd', text: 'Dünya Mirası Listesi’ne giren yerler turistlerle dolar.' },
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
        'Dansı izleyen arılar bu bilgiyi kullanarak, daha önce hiç görmedikleri çiçeklerin bulunduğu bölgeye yönelebiliyordu. Von Frisch bu buluşuyla 1973 yılında, hayvan davranışları üzerine çalışan iki bilim insanıyla birlikte Nobel Fizyoloji veya Tıp Ödülü’nü aldı.',
        'Bugün bilim insanları, arıların dansını izleyerek hangi bölgelerde yeterli çiçek bulunduğunu anlamaya çalışıyor. Minik bir böceğin dansı, doğayı korumak için bize yol gösteriyor.',
      ],
      questions: [
        {
          key: 'q1', skill: 'literal', answer: 'b',
          text: 'Arıların dansının anlamını çözen bilim insanı kimdir?',
          options: [
            { key: 'a', text: 'Charles Darwin' },
            { key: 'b', text: 'Karl von Frisch' },
            { key: 'c', text: 'Gregor Mendel' },
            { key: 'd', text: 'Louis Pasteur' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'd',
          text: 'Yiyecek kovana yakınsa arı nasıl bir hareket yapar?',
          options: [
            { key: 'a', text: 'Düz bir çizgide sallanarak ilerler.' },
            { key: 'b', text: 'Kovandan hiç çıkmaz.' },
            { key: 'c', text: 'Kanatlarını hızla çırparak ses çıkarır.' },
            { key: 'd', text: 'Daireler çizerek döner.' },
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
          key: 'q5', skill: 'inference', answer: 'a',
          text: 'Yiyecek kovana yakınken arının yön anlatan salınım dansını yapmamasının en olası nedeni nedir?',
          options: [
            { key: 'a', text: 'Yakındaki yiyeceği bulmak için ayrıntılı yön bilgisine gerek olmaması' },
            { key: 'b', text: 'Arının yakın yerlere gitmekten yorulması' },
            { key: 'c', text: 'Kovandaki arıların yakın yerleri hiç sevmemesi' },
            { key: 'd', text: 'Yakındaki çiçeklerin hiç bal vermemesi' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'b',
          text: '"Dansın rastgele olmadığı" anlaşıldı. Burada "rastgele" ne anlama gelir?',
          options: [
            { key: 'a', text: 'Çok hızlı biçimde' },
            { key: 'b', text: 'Belirli bir kurala bağlı olmadan' },
            { key: 'c', text: 'Her gün aynı saatte' },
            { key: 'd', text: 'Yalnızca bir kez' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'd',
          text: '"Yıllarca cam kovanlarda arıları gözlemledi" cümlesinde "gözlemledi" ne demektir?',
          options: [
            { key: 'a', text: 'Hayal etti' },
            { key: 'b', text: 'Kitaplardan okudu' },
            { key: 'c', text: 'Görmezden geldi' },
            { key: 'd', text: 'Dikkatle izleyip inceledi' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'c',
          text: 'Metnin ana fikri nedir?',
          options: [
            { key: 'a', text: 'Arılar güneşin yönünü bilmezse kovana dönemez.' },
            { key: 'b', text: 'Bal üretmek çok uzun bir iştir.' },
            { key: 'c', text: 'Arılar yiyeceğin yerini birbirlerine dansla anlatır.' },
            { key: 'd', text: 'Bilim insanları en çok arıları inceler.' },
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
          key: 'q1', skill: 'literal', answer: 'b',
          text: 'Metinde hipokampus neye benzetiliyor?',
          options: [
            { key: 'a', text: 'Bilgilerin sonsuza dek saklandığı bir kasaya' },
            { key: 'b', text: 'Bilgilerin kısa süreliğine bırakıldığı bir masaya' },
            { key: 'c', text: 'Gereksiz bilgilerin atıldığı bir çöp kutusuna' },
            { key: 'd', text: 'Bilgileri sıraya koyan bir kütüphaneciye' },
          ],
        },
        {
          key: 'q2', skill: 'literal', answer: 'a',
          text: 'Metne göre bilgiler uyku sırasında beynin hangi bölümüne aktarılır?',
          options: [
            { key: 'a', text: 'Beynin dış katmanı olan kortekse' },
            { key: 'b', text: 'Omuriliğe' },
            { key: 'c', text: 'Beyinciğe' },
            { key: 'd', text: 'Göz sinirlerine' },
          ],
        },
        {
          key: 'q3', skill: 'literal', answer: 'c',
          text: 'Anlatılan deneylerde katılımcılar bir şey öğrendikten sonra hangi iki gruba ayrılıyor?',
          options: [
            { key: 'a', text: 'Kelime öğrenenler ve beceri öğrenenler' },
            { key: 'b', text: 'Sabah sınava girenler ve akşam sınava girenler' },
            { key: 'c', text: 'Uyuyanlar ve aynı süre uyanık kalanlar' },
            { key: 'd', text: 'Tek başına çalışanlar ve grupla çalışanlar' },
          ],
        },
        {
          key: 'q4', skill: 'inference', answer: 'd',
          text: 'Metindeki bilgilere göre sınavdan önceki geceyi hiç uyumadan çalışarak geçiren bir öğrenci için hangisi en olasıdır?',
          options: [
            { key: 'a', text: 'Sınavda her zamankinden daha dikkatli olması' },
            { key: 'b', text: 'O gece çalıştıklarını hiç unutmaması' },
            { key: 'c', text: 'Ertesi gün yeni bilgileri daha kolay öğrenmesi' },
            { key: 'd', text: 'O gece çalıştıklarının bir kısmını sınavda hatırlayamaması' },
          ],
        },
        {
          key: 'q5', skill: 'inference', answer: 'a',
          text: '16 yaşındaki Ece okul günleri gece 23.30’da uyuyup sabah 6.30’da kalkıyor. Metindeki bilgilere göre Ece için hangisi söylenebilir?',
          options: [
            { key: 'a', text: 'Uzmanların önerdiğinden daha az uyuyor.' },
            { key: 'b', text: 'Uzmanların önerdiğinden daha çok uyuyor.' },
            { key: 'c', text: 'Uzmanların önerdiği kadar uyuyor.' },
            { key: 'd', text: 'Uyku süresi öğrenmesini hiç etkilemez.' },
          ],
        },
        {
          key: 'q6', skill: 'vocabulary', answer: 'c',
          text: '"Gençler akşamları daha geç uykuya dalma eğilimindedir" cümlesinde "eğilimindedir" ne anlama gelir?',
          options: [
            { key: 'a', text: 'Bunu yapmak zorundadır' },
            { key: 'b', text: 'Bunu hiç yapmaz' },
            { key: 'c', text: 'Buna yatkındır, çoğu zaman böyle olur' },
            { key: 'd', text: 'Bunu yapmaktan korkar' },
          ],
        },
        {
          key: 'q7', skill: 'vocabulary', answer: 'b',
          text: '"Öğrendiklerimizin kalıcı hâle gelmesi" ifadesine anlamca en yakın seçenek hangisidir?',
          options: [
            { key: 'a', text: 'Hızla unutulması' },
            { key: 'b', text: 'Uzun süre akılda kalması' },
            { key: 'c', text: 'Yanlış öğrenilmesi' },
            { key: 'd', text: 'Başkasına anlatılması' },
          ],
        },
        {
          key: 'q8', skill: 'main_idea', answer: 'd',
          text: 'Metnin ana fikri nedir?',
          options: [
            { key: 'a', text: 'Sınavdan önceki gece sabaha kadar çalışmak en verimli yöntemdir.' },
            { key: 'b', text: 'Uyku yalnızca ezber bilgilerin hatırlanmasına yardım eder.' },
            { key: 'c', text: 'Gençler sabahları daha erken kalkmalıdır.' },
            { key: 'd', text: 'Uyku, öğrenmenin ayrılmaz bir parçasıdır.' },
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
      'Türkiye’de 1–5. sınıflar için sesli okuma hızı çalışmaları vardır (ör. 1–5. sınıflarda dakikada ortalama 45, 73, 91, 97 ve 121 kelimenin doğru okunduğu bildirilmiştir); bu test sessiz okumayı ölçtüğü için 3–5. sınıf raporlarında bu değerler doğrudan karşılaştırma için değil, yalnızca bağlam olarak verilir. 6. sınıf ve üzeri ile sessiz okuma için yayımlanmış bir Türkiye normu bulunmamaktadır. Bu nedenle hız bir norma göre değerlendirilmez; anlama düzeyiyle birlikte yorumlanır. Hızın "çok hızlı" ya da "yavaş" sayıldığı sınırlar Ölçekhane’nin pilot ölçütüdür.',
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
