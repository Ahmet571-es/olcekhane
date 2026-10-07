import type { OralPassage } from '@/lib/instruments/types';

export const passages: OralPassage[] = [
  {
    key: 'g3-kus-yemligi',
    grade: 3,
    genre: 'narrative',
    title: 'Kerem’in Kuş Yemliği',
    paragraphs: [
      'Kış gelmişti ve bahçede kuşlar için yiyecek azalmıştı. Kerem, kuşlara yardım etmek istedi. Boş bir süt kutusunu güzelce yıkadı. Kutunun iki yanına birer pencere kesti ve içine kuş yemi doldurdu. Sonra yemliği evin kapısının yanına astı.',
      'Üç gün boyunca her sabah yemliğe baktı ama hiçbir kuş gelmedi. Kerem çok üzülmüştü. Annesi ona bir soru sordu: "Bu kapı her gün kaç kez açılıp kapanıyor?" Kerem biraz düşündü. Evdeki herkes bu kapıdan girip çıkıyordu ve kapının önü hep gürültülüydü. Kuşlar belki de bu yüzden ürküyordu.',
      'Ertesi gün Kerem yemliği bahçenin sonundaki erik ağacına astı. Orası sessiz ve gölgeli bir yerdi. Öğleden sonra pencereden dışarı baktığında iki serçe gördü. Serçeler yemliğe konmuş, yemleri gagalıyordu. Kerem sevinçle annesine seslendi. Artık her sabah kuşları izlemek için erkenden kalkıyor.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'b',
        text: 'Kerem yemliği neyden yaptı?',
        options: [
          { key: 'a', text: 'Eski bir ayakkabı kutusundan' },
          { key: 'b', text: 'Boş bir süt kutusundan' },
          { key: 'c', text: 'Plastik bir su şişesinden' },
          { key: 'd', text: 'Tahta bir meyve kasasından' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'a',
        text: 'Kerem yemliği ilk olarak nereye astı?',
        options: [
          { key: 'a', text: 'Evin kapısının yanına' },
          { key: 'b', text: 'Mutfak penceresinin önüne' },
          { key: 'c', text: 'Bahçe duvarının üstüne' },
          { key: 'd', text: 'Erik ağacının dalına' },
        ],
      },
      {
        key: 'q3', skill: 'literal', answer: 'c',
        text: 'Yemliğe hangi kuşlar geldi?',
        options: [
          { key: 'a', text: 'Güvercinler' },
          { key: 'b', text: 'Kargalar' },
          { key: 'c', text: 'Serçeler' },
          { key: 'd', text: 'Kırlangıçlar' },
        ],
      },
      {
        key: 'q4', skill: 'inference', answer: 'd',
        text: 'Annesinin sorusu Kerem’e nasıl yardım etti?',
        options: [
          { key: 'a', text: 'Yemliği nasıl yapacağını öğrenmesini sağladı.' },
          { key: 'b', text: 'Kuşlara daha çok yem koymasını sağladı.' },
          { key: 'c', text: 'Kuşların adlarını öğrenmesini sağladı.' },
          { key: 'd', text: 'Kuşların neden gelmediğini anlamasını sağladı.' },
        ],
      },
      {
        key: 'q5', skill: 'inference', answer: 'a',
        text: 'Kuşların erik ağacındaki yemliğe gelmesi neyi gösterir?',
        options: [
          { key: 'a', text: 'Kuşların sessizliği sevdiğini' },
          { key: 'b', text: 'Kerem’in yemi değiştirdiğini' },
          { key: 'c', text: 'Havanın o gün birden ısındığını' },
          { key: 'd', text: 'Annesinin yemliği onardığını' },
        ],
      },
      {
        key: 'q6', skill: 'vocabulary', answer: 'c',
        text: 'Metinde geçen "azalmıştı" sözü hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Daha çok olmuştu' },
          { key: 'b', text: 'Tamamen bozulmuştu' },
          { key: 'c', text: 'Daha az kalmıştı' },
          { key: 'd', text: 'Bir yere saklanmıştı' },
        ],
      },
      {
        key: 'q7', skill: 'vocabulary', answer: 'd',
        text: 'Metinde geçen "ürküyordu" sözü hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Çok acıkıyordu' },
          { key: 'b', text: 'Soğuktan üşüyordu' },
          { key: 'c', text: 'Yorulup dinleniyordu' },
          { key: 'd', text: 'Korkup çekiniyordu' },
        ],
      },
      {
        key: 'q8', skill: 'main_idea', answer: 'b',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Kerem’in annesiyle bahçede erik toplamasını' },
          { key: 'b', text: 'Kerem’in yemlik için doğru yeri bulmasını' },
          { key: 'c', text: 'Kuşların yuvalarını nasıl yaptığını' },
          { key: 'd', text: 'Kerem’in kışın kardan adam yapmasını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Kerem, kışın kuşlara yardım etmek ister.', core: true },
      { key: 'i2', text: 'Süt kutusundan bir yemlik yapıp içine yem koyar.', core: false },
      { key: 'i3', text: 'Yemliği evin kapısının yanına asar.', core: false },
      { key: 'i4', text: 'Günler geçer ama yemliğe hiç kuş gelmez.', core: true },
      { key: 'i5', text: 'Annesinin sorusuyla kapının önünün çok gürültülü olduğunu fark eder.', core: false },
      { key: 'i6', text: 'Yemliği sessiz bir yerdeki erik ağacına asar.', core: true },
      { key: 'i7', text: 'Serçeler yemliğe gelir ve Kerem çok sevinir.', core: true },
    ],
  },
  {
    key: 'g3-bayrak-yarisi',
    grade: 3,
    genre: 'narrative',
    title: 'Bayrak Yarışı',
    paragraphs: [
      'Okulda spor şenliği yapılacaktı. Zeynep, Emir, Ece ve Ali bayrak yarışında aynı takımda koşacaklardı. Bu yarışta her çocuk biraz koşar, sonra elindeki kısa çubuğu sıradaki arkadaşına verir. Elden ele geçen bu çubuğa bayrak denir.',
      'Ama antrenmanda bir sorun çıktı. Çubuk her seferinde yere düşüyordu. Ece çok hızlı koşuyor ama çubuğu uzatırken telaşlanıyordu. Ali de elini ya çok erken ya da çok geç açıyordu. Takım bu yüzden her turda zaman kaybediyordu.',
      'Zeynep bir gün güzel bir fikir buldu. Çubuğu veren kişi yüksek sesle "şimdi" diyecekti. Alan kişi de elini geriye uzatıp avucunu açık tutacaktı. Dört arkadaş bu yolu bütün hafta denediler. Önce yavaş yavaş koştular, sonra giderek hızlandılar.',
      'Sonunda yarış günü geldi. Çubuk yarış boyunca bir kez bile yere düşmedi. Takım yarışı ikinci sırada bitirdi. Yine de dört arkadaş sevinçle birbirlerine sarıldılar.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'c',
        text: 'Zeynep’in takımında kaç çocuk vardı?',
        options: [
          { key: 'a', text: 'İki' },
          { key: 'b', text: 'Üç' },
          { key: 'c', text: 'Dört' },
          { key: 'd', text: 'Altı' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'a',
        text: 'Antrenmanda hangi sorun vardı?',
        options: [
          { key: 'a', text: 'Çubuk sık sık yere düşüyordu.' },
          { key: 'b', text: 'Takımın koşu ayakkabısı yoktu.' },
          { key: 'c', text: 'Koşu pisti çamurla doluydu.' },
          { key: 'd', text: 'Çocuklar sıralarını unutuyordu.' },
        ],
      },
      {
        key: 'q3', skill: 'literal', answer: 'd',
        text: 'Zeynep’in fikrine göre çubuğu veren kişi ne yapacaktı?',
        options: [
          { key: 'a', text: 'Bir düdük çalacaktı.' },
          { key: 'b', text: 'Arkadaşına iki kez el sallayacaktı.' },
          { key: 'c', text: 'Çubuğu yere bırakacaktı.' },
          { key: 'd', text: 'Yüksek sesle "şimdi" diyecekti.' },
        ],
      },
      {
        key: 'q4', skill: 'inference', answer: 'b',
        text: 'Yarış günü takımın işleri neden yolunda gitti?',
        options: [
          { key: 'a', text: 'Yarışta daha hafif bir çubuk vardı.' },
          { key: 'b', text: 'Takım yeni yolu çok denemişti.' },
          { key: 'c', text: 'Öğretmen onların yanında koştu.' },
          { key: 'd', text: 'Rakip takımlar çok yavaştı.' },
        ],
      },
      {
        key: 'q5', skill: 'inference', answer: 'd',
        text: 'Takım ikinci olduğu hâlde çocuklar neden sevindi?',
        options: [
          { key: 'a', text: 'Büyük bir kupa kazanmışlardı.' },
          { key: 'b', text: 'Birinci takım yarışı bırakmıştı.' },
          { key: 'c', text: 'Yarış yarın yeniden yapılacaktı.' },
          { key: 'd', text: 'Çalıştıkları yol işe yaramıştı.' },
        ],
      },
      {
        key: 'q6', skill: 'vocabulary', answer: 'a',
        text: 'Metinde geçen "telaşlanıyordu" sözü hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Heyecanlanıp acele ediyordu' },
          { key: 'b', text: 'Hiç acele etmeden yürüyordu' },
          { key: 'c', text: 'Arkadaşlarıyla şakalaşıyordu' },
          { key: 'd', text: 'Yorulup bir yere oturuyordu' },
        ],
      },
      {
        key: 'q7', skill: 'vocabulary', answer: 'b',
        text: 'Bu metinde "bayrak" ne demektir?',
        options: [
          { key: 'a', text: 'Direğe çekilen renkli bir kumaş' },
          { key: 'b', text: 'Elden ele verilen kısa çubuk' },
          { key: 'c', text: 'Yarışın sonundaki bitiş çizgisi' },
          { key: 'd', text: 'Takımın giydiği renkli forma' },
        ],
      },
      {
        key: 'q8', skill: 'main_idea', answer: 'c',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Zeynep’in yarışı birinci bitirmesini' },
          { key: 'b', text: 'Şenlikte yapılan bütün oyunları' },
          { key: 'c', text: 'Takımın sorunu birlikte çözmesini' },
          { key: 'd', text: 'Bayrak yarışının nasıl doğduğunu' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Zeynep ve üç arkadaşı okul şenliğinde bayrak yarışında koşacaktır.', core: true },
      { key: 'i2', text: 'Bu yarışta koşucular kısa bir çubuğu elden ele verir.', core: false },
      { key: 'i3', text: 'Antrenmanda çubuk sık sık yere düşer.', core: true },
      { key: 'i4', text: 'Ece telaşlanır, Ali de elini ya erken ya da geç açar.', core: false },
      { key: 'i5', text: 'Zeynep, veren kişinin "şimdi" demesini ve alanın avucunu açık tutmasını önerir.', core: true },
      { key: 'i6', text: 'Dört arkadaş bu yolu bütün hafta dener.', core: false },
      { key: 'i7', text: 'Yarışta çubuk hiç düşmez ve takım ikinci olur.', core: true },
      { key: 'i8', text: 'Arkadaşlar sevinçle birbirine sarılır.', core: false },
    ],
  },
  {
    key: 'g3-agac-halkalari',
    grade: 3,
    genre: 'informational',
    title: 'Ağacın Yaşını Söyleyen Halkalar',
    paragraphs: [
      'Bir ağaç kütüğüne hiç yakından baktın mı? Kütüğün üstünde iç içe halkalar görürsün. Bu halkalar, ağacın nasıl büyüdüğünü anlatır. Onlara yıllık halka denir.',
      'Dört mevsimin yaşandığı yerlerde ağaçlar her yıl gövdelerine yeni bir kat ekler. İlkbaharda ağaç hızlı büyür ve açık renkli bir kat oluşur. Yaz sonunda büyüme yavaşlar ve koyu renkli bir kat oluşur. Bir açık ve bir koyu kat birlikte bir yıllık halkayı yapar.',
      'Bu yüzden halkaları sayarak ağacın yaşını bulabiliriz. Halkalar bize geçmiş yılların havasını da anlatır. Yağmurlu yıllarda ağaç bol su bulur. O yıl oluşan halka genellikle geniş olur. Kurak yıllarda ise halka dar kalır.',
      'Bilim insanları bir ağacın yaşını öğrenmek için onu kesmek zorunda değildir. Özel bir aletle gövdeden kalem kadar ince bir parça çıkarırlar. Sonra bu parçadaki yıllık halkaları sayarlar. Ağaç da yaşamaya devam eder.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'd',
        text: 'İlkbaharda ağacın gövdesinde nasıl bir kat oluşur?',
        options: [
          { key: 'a', text: 'Koyu renkli' },
          { key: 'b', text: 'Kırmızı renkli' },
          { key: 'c', text: 'Yeşil renkli' },
          { key: 'd', text: 'Açık renkli' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'b',
        text: 'Kurak yıllarda oluşan halka nasıl olur?',
        options: [
          { key: 'a', text: 'Geniş olur.' },
          { key: 'b', text: 'Dar kalır.' },
          { key: 'c', text: 'Görünmez olur.' },
          { key: 'd', text: 'Kırmızı olur.' },
        ],
      },
      {
        key: 'q3', skill: 'literal', answer: 'a',
        text: 'Bilim insanları gövdeden çıkardıkları parçada neleri sayar?',
        options: [
          { key: 'a', text: 'Yıllık halkaları' },
          { key: 'b', text: 'Kabuktaki küçük çatlakları' },
          { key: 'c', text: 'İçindeki küçük delikleri' },
          { key: 'd', text: 'Üstündeki yosun lekelerini' },
        ],
      },
      {
        key: 'q4', skill: 'inference', answer: 'c',
        text: 'Bilim insanları ağaçtan neden yalnızca ince bir parça alır?',
        options: [
          { key: 'a', text: 'Parça kolayca taşınsın diye' },
          { key: 'b', text: 'Halkalar daha renkli görünsün diye' },
          { key: 'c', text: 'Ağaç kesilmeden yaşasın diye' },
          { key: 'd', text: 'Alet daha hızlı çalışsın diye' },
        ],
      },
      {
        key: 'q5', skill: 'inference', answer: 'b',
        text: 'Kütüğünde on iki halka sayılan bir ağaç kaç yaşında kesilmiştir?',
        options: [
          { key: 'a', text: 'Altı yaşında' },
          { key: 'b', text: 'On iki yaşında' },
          { key: 'c', text: 'Yirmi dört yaşında' },
          { key: 'd', text: 'Bir yaşında' },
        ],
      },
      {
        key: 'q6', skill: 'vocabulary', answer: 'd',
        text: 'Metinde geçen "kütük" kelimesi ne demektir?',
        options: [
          { key: 'a', text: 'Ağacın en ince dalı' },
          { key: 'b', text: 'Ağacın taze yaprakları' },
          { key: 'c', text: 'Ağacın toprağın altında kalan kökleri' },
          { key: 'd', text: 'Kesilmiş ağaçtan kalan gövde' },
        ],
      },
      {
        key: 'q7', skill: 'vocabulary', answer: 'c',
        text: 'Metindeki "iç içe halkalar" sözünde "iç içe" ne demektir?',
        options: [
          { key: 'a', text: 'Yan yana uzun bir sırada' },
          { key: 'b', text: 'Üst üste yığılmış' },
          { key: 'c', text: 'Biri ötekinin içinde' },
          { key: 'd', text: 'Dağınık ve karışık' },
        ],
      },
      {
        key: 'q8', skill: 'main_idea', answer: 'a',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Ağacın halkalarının bize neler anlattığını' },
          { key: 'b', text: 'Ağaçların nasıl dikildiğini ve büyütüldüğünü' },
          { key: 'c', text: 'Bilim insanlarının hangi aletleri kullandığını' },
          { key: 'd', text: 'Ağaçların yapraklarını neden döktüğünü' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Ağaç kütüğündeki iç içe halkalar ağacın nasıl büyüdüğünü anlatır.', core: true },
      { key: 'i2', text: 'Ağaç her yıl gövdesine yeni bir kat ekler.', core: true },
      { key: 'i3', text: 'İlkbaharda açık, yaz sonunda koyu renkli bir kat oluşur.', core: false },
      { key: 'i4', text: 'Halkaları sayarak ağacın yaşını bulabiliriz.', core: true },
      { key: 'i5', text: 'Yağmurlu yıllarda halka geniş, kurak yıllarda dar olur.', core: true },
      { key: 'i6', text: 'Bilim insanları ağacı kesmeden gövdeden ince bir parça alıp halkaları sayabilir.', core: false },
    ],
  },
  {
    key: 'g4-egri-fincan',
    grade: 4,
    genre: 'narrative',
    title: 'Eğri Fincan',
    paragraphs: [
      'Nehir, yaz tatilinin bir haftasını teyzesinin çömlek atölyesinde geçirdi. Atölyenin rafları tabaklarla, vazolarla ve kâselerle doluydu. Nehir de annesi için bir fincan yapmaya karar verdi. Teyzesi onu çömlekçi çarkının başına oturttu. Çark, üstüne konan çamuru hızla döndüren yuvarlak bir tablaydı.',
      'Teyzesi çarkın ortasına bir top çamur koydu. Nehir çamuru hemen şekillendirmek istiyordu. Parmaklarıyla hızlıca bastırınca çamur bir yana yattı. İkinci denemede fincanın kenarları çatladı. Üçüncü denemede ise fincan birden çöküverdi. Nehir’in elleri, yanakları, hatta saçları bile çamur olmuştu.',
      'Teyzesi gülümseyerek yanına oturdu. Ellerini suyla ıslatmasını ve acele etmemesini söyledi. Sonra ekledi: "Çamur, sabırlı elleri sever." Nehir bu kez avuçlarını çamurun iki yanına koydu ve onu yavaşça yukarı çekti. Çamur azar azar yükseldi ve sonunda bir fincana dönüştü.',
      'Fincan biraz eğri olmuştu ama Nehir ondan çok hoşlandı. Birkaç gün kuruyan fincanın üstünü maviye boyadı, teyzesi de onu fırında pişirdi. Annesi şimdi her sabah kahvesini o eğri fincanla içiyor.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'a',
        text: 'Nehir fincanın üstünü hangi renge boyadı?',
        options: [
          { key: 'a', text: 'Maviye' },
          { key: 'b', text: 'Kırmızıya' },
          { key: 'c', text: 'Sarıya' },
          { key: 'd', text: 'Yeşile' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'c',
        text: 'Nehir’in ilk denemesinde çamura ne oldu?',
        options: [
          { key: 'a', text: 'Hemen kurudu.' },
          { key: 'b', text: 'Küçük parçalara bölündü.' },
          { key: 'c', text: 'Bir yana yattı.' },
          { key: 'd', text: 'Rengi değişti.' },
        ],
      },
      {
        key: 'q3', skill: 'literal', answer: 'b',
        text: 'Son denemesinde Nehir avuçlarını nereye koydu?',
        options: [
          { key: 'a', text: 'Çarkın iki kenarına' },
          { key: 'b', text: 'Çamurun iki yanına' },
          { key: 'c', text: 'Çamurun tam tepesine' },
          { key: 'd', text: 'Teyzesinin ellerinin üstüne' },
        ],
      },
      {
        key: 'q4', skill: 'inference', answer: 'd',
        text: 'Nehir’in ilk denemeleri neden bozuldu?',
        options: [
          { key: 'a', text: 'Çamur çok eski ve kuruydu.' },
          { key: 'b', text: 'Çark sık sık duruyordu.' },
          { key: 'c', text: 'Atölye çok karanlıktı.' },
          { key: 'd', text: 'Çamuru aceleyle bastırdı.' },
        ],
      },
      {
        key: 'q5', skill: 'inference', answer: 'c',
        text: 'Annesinin her sabah o fincanı kullanması neyi gösterir?',
        options: [
          { key: 'a', text: 'Evde başka fincan olmadığını' },
          { key: 'b', text: 'Fincanın çok büyük olduğunu' },
          { key: 'c', text: 'Hediyeyi çok sevdiğini' },
          { key: 'd', text: 'Eğriliği fark etmediğini' },
        ],
      },
      {
        key: 'q6', skill: 'vocabulary', answer: 'b',
        text: 'Metinde geçen "çöküverdi" sözü hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Hızla büyüyüp yükseldi' },
          { key: 'b', text: 'Birden yıkılıp düştü' },
          { key: 'c', text: 'Yavaşça kurudu' },
          { key: 'd', text: 'Renk değiştirdi' },
        ],
      },
      {
        key: 'q7', skill: 'vocabulary', answer: 'a',
        text: 'Teyzesinin sözündeki "sabırlı" kelimesi hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Acele etmeyen' },
          { key: 'b', text: 'Çok güçlü olan' },
          { key: 'c', text: 'Hep kuru kalan' },
          { key: 'd', text: 'Hızlı çalışan' },
        ],
      },
      {
        key: 'q8', skill: 'main_idea', answer: 'd',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Atölyede hangi eşyaların satıldığını' },
          { key: 'b', text: 'Annesinin kahveyi neden sevdiğini' },
          { key: 'c', text: 'Nehir’in yaz tatilinde gezdiği yerleri' },
          { key: 'd', text: 'Nehir’in sabırla fincan yapmasını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Nehir, yaz tatilinde teyzesinin çömlek atölyesine gider.', core: true },
      { key: 'i2', text: 'Annesi için çamurdan bir fincan yapmaya karar verir.', core: false },
      { key: 'i3', text: 'Acele ettiği için çamur her denemede bozulur.', core: true },
      { key: 'i4', text: 'Nehir’in her yeri çamur olur.', core: false },
      { key: 'i5', text: 'Teyzesi ellerini ıslatıp acele etmemesini söyler.', core: true },
      { key: 'i6', text: 'Nehir yavaş çalışır ve biraz eğri bir fincan yapar.', core: true },
      { key: 'i7', text: 'Nehir fincanı maviye boyar, teyzesi onu fırında pişirir.', core: false },
      { key: 'i8', text: 'Annesi her sabah kahvesini bu fincanla içer.', core: false },
    ],
  },
  {
    key: 'g4-deve',
    grade: 4,
    genre: 'informational',
    title: 'Çölün Yolcusu Deve',
    paragraphs: [
      'Çöller kurak yerlerdir ve gündüzleri hava genellikle çok sıcak olur. Buralarda hem yiyecek hem de su bulmak oldukça zordur. Yine de deve, bedenindeki bazı özellikler sayesinde çölde rahatça yaşayabilir.',
      'Birçok kişi devenin sırtındaki hörgüçte su sakladığını sanır. Oysa hörgüçte su değil, yağ bulunur. Deve uzun süre yiyecek bulamazsa bu yağı kullanır. Bu sırada hörgücü küçülür ve yana doğru sarkar. Deve günlerce su içmeden yol alabilir ve suya ulaştığında kısa sürede çok fazla su içer.',
      'Çölde bazen güçlü rüzgârlar kumları havaya kaldırır. Devenin uzun ve sık kirpikleri, gözlerine kum kaçmasını önler. Deve, rüzgâr çok güçlendiğinde burun deliklerini de kapatabilir. Böylece havada uçuşan kumlar burnuna dolmaz.',
      'Devenin ayakları geniş ve yumuşaktır. Bu geniş ayaklar, kumun içine kolayca batmaz. İnsanlar yüzyıllar boyunca çölde hem yolculuk etmek hem de yük taşımak için develerden yararlanmıştır. Bu yüzden deveye "çölün gemisi" de denir.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'b',
        text: 'Metne göre devenin hörgücünde ne bulunur?',
        options: [
          { key: 'a', text: 'Su' },
          { key: 'b', text: 'Yağ' },
          { key: 'c', text: 'Kum' },
          { key: 'd', text: 'Hava' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'd',
        text: 'Metne göre devenin gözlerini kumdan ne korur?',
        options: [
          { key: 'a', text: 'Kalın ve sert dudakları' },
          { key: 'b', text: 'Geniş ve yumuşak ayakları' },
          { key: 'c', text: 'Büyük ve dik kulakları' },
          { key: 'd', text: 'Uzun ve sık kirpikleri' },
        ],
      },
      {
        key: 'q3', skill: 'literal', answer: 'c',
        text: 'Rüzgâr kumları havaya kaldırınca deve burnunu nasıl korur?',
        options: [
          { key: 'a', text: 'Başını kumun içine sokar.' },
          { key: 'b', text: 'Hörgücünün arkasına saklanır.' },
          { key: 'c', text: 'Burun deliklerini kapatır.' },
          { key: 'd', text: 'Hızla koşup uzaklaşır.' },
        ],
      },
      {
        key: 'q4', skill: 'inference', answer: 'a',
        text: 'Bir devenin hörgücü küçülüp yana sarkmışsa bu neyi gösterir?',
        options: [
          { key: 'a', text: 'Bir süredir az yiyecek bulduğunu' },
          { key: 'b', text: 'Az önce çok su içtiğini' },
          { key: 'c', text: 'Kum fırtınasında yorulduğunu' },
          { key: 'd', text: 'Yeni doğmuş küçük bir yavru olduğunu' },
        ],
      },
      {
        key: 'q5', skill: 'inference', answer: 'd',
        text: 'Devenin ayakları küçük ve sert olsaydı ne olurdu?',
        options: [
          { key: 'a', text: 'Daha hızlı koşabilirdi.' },
          { key: 'b', text: 'Daha çok su içebilirdi.' },
          { key: 'c', text: 'Hörgücü daha da büyürdü.' },
          { key: 'd', text: 'Kuma kolayca batardı.' },
        ],
      },
      {
        key: 'q6', skill: 'vocabulary', answer: 'c',
        text: 'Metinde geçen "kurak" kelimesi hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Her zaman çok soğuk olan' },
          { key: 'b', text: 'Ağaçlarla dolu olan' },
          { key: 'c', text: 'Yağmuru çok az olan' },
          { key: 'd', text: 'Hiç rüzgâr almayan' },
        ],
      },
      {
        key: 'q7', skill: 'vocabulary', answer: 'b',
        text: 'Metindeki "kum kaçmasını önler" sözünde "önler" ne demektir?',
        options: [
          { key: 'a', text: 'Olmasını kolaylaştırır' },
          { key: 'b', text: 'Olmasına engel olur' },
          { key: 'c', text: 'Olmasını hızlandırır' },
          { key: 'd', text: 'Olmasını bekler' },
        ],
      },
      {
        key: 'q8', skill: 'main_idea', answer: 'a',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Devenin çöl hayatına nasıl uyduğunu' },
          { key: 'b', text: 'Çöllerde hangi bitkilerin yetiştiğini' },
          { key: 'c', text: 'Develerin yavrularını nasıl büyüttüğünü' },
          { key: 'd', text: 'İnsanların çölde nasıl yolculuk ettiğini' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Çöller sıcak ve kuraktır ama deve orada rahatça yaşayabilir.', core: true },
      { key: 'i2', text: 'Devenin hörgücünde su değil yağ vardır; deve yiyecek bulamayınca bu yağı kullanır.', core: true },
      { key: 'i3', text: 'Deve günlerce su içmeden yol alabilir, suya ulaşınca çok su içer.', core: true },
      { key: 'i4', text: 'Uzun kirpikleri gözlerini kumdan korur.', core: false },
      { key: 'i5', text: 'Rüzgâr güçlenince burun deliklerini kapatabilir.', core: false },
      { key: 'i6', text: 'Geniş ve yumuşak ayakları kuma batmaz.', core: false },
      { key: 'i7', text: 'İnsanlar çölde develerle yolculuk edip yük taşıdığı için ona "çölün gemisi" denir.', core: false },
    ],
  },
  {
    key: 'g4-pusula',
    grade: 4,
    genre: 'informational',
    title: 'Pusula Nasıl Yön Gösterir?',
    paragraphs: [
      'Pusula, yönümüzü bulmamıza yardım eden küçük bir araçtır. İçinde serbestçe dönebilen ince bir iğne bulunur. Bu iğne aslında küçük bir mıknatıstır.',
      'Dünya da dev bir mıknatıs gibidir ve pusulanın iğnesini etkiler. Bu yüzden iğne önce biraz döner, durduğunda ise bir ucu hep kuzeyi gösterir. Kuzeyi bulan biri öteki yönleri de kolayca bulabilir. Kuzeye dönen bir kişinin sağ tarafı doğu, sol tarafı batı, arkası ise güneydir.',
      'Eskiden denizciler yönlerini gece gökyüzündeki yıldızlara bakarak bulurdu. Ama bulutlu gecelerde yıldızlar görünmezdi ve denizciler yönlerini bulmakta zorlanırdı. Pusula sayesinde denizciler bu gecelerde de doğru yönde ilerleyebildi.',
      'Pusulayı kullanırken dikkat etmemiz gereken iki şey vardır. İlk olarak pusulayı mıknatısa ya da demir eşyalara yaklaştırmamalıyız. Çünkü bunlar da iğneyi kendilerine doğru çeker. O zaman pusula yanlış yönü gösterebilir. İkinci olarak pusulayı elimizde düz tutmalıyız. Böylece iğne bir yere takılmadan rahatça dönebilir ve doğru yönü gösterir.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'c',
        text: 'Pusulanın içindeki iğne aslında nedir?',
        options: [
          { key: 'a', text: 'İnce bir tahta çubuk' },
          { key: 'b', text: 'Plastik bir ok' },
          { key: 'c', text: 'Küçük bir mıknatıs' },
          { key: 'd', text: 'Cam bir boru parçası' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'a',
        text: 'Metne göre pusulanın iğnesi neden hep kuzeyi gösterir?',
        options: [
          { key: 'a', text: 'Dünya iğneyi etkilediği için' },
          { key: 'b', text: 'Kuzey her zaman daha soğuk olduğu için' },
          { key: 'c', text: 'Rüzgâr hep kuzeyden estiği için' },
          { key: 'd', text: 'İğnenin o ucu daha ağır olduğu için' },
        ],
      },
      {
        key: 'q3', skill: 'literal', answer: 'd',
        text: 'Metne göre eskiden denizciler gece yönlerini neye bakarak bulurdu?',
        options: [
          { key: 'a', text: 'Dalgaların geldiği yöne' },
          { key: 'b', text: 'Kıyıdaki deniz fenerlerine' },
          { key: 'c', text: 'Rüzgârın estiği yöne' },
          { key: 'd', text: 'Gökyüzündeki yıldızlara' },
        ],
      },
      {
        key: 'q4', skill: 'inference', answer: 'b',
        text: 'Demir bir kutunun üstüne konan bir pusula ne yapabilir?',
        options: [
          { key: 'a', text: 'Çok ısınıp bozulabilir.' },
          { key: 'b', text: 'Yanlış yönü gösterebilir.' },
          { key: 'c', text: 'Ses çıkarmaya başlayabilir.' },
          { key: 'd', text: 'Daha parlak görünebilir.' },
        ],
      },
      {
        key: 'q5', skill: 'inference', answer: 'a',
        text: 'Pusula denizciler için neden çok değerliydi?',
        options: [
          { key: 'a', text: 'Bulutlu gecelerde de yön gösterirdi.' },
          { key: 'b', text: 'Gemilerin daha hızlı gitmesini sağlardı.' },
          { key: 'c', text: 'Denizin ne kadar derin olduğunu ölçerdi.' },
          { key: 'd', text: 'Yarın havanın nasıl olacağını söylerdi.' },
        ],
      },
      {
        key: 'q6', skill: 'vocabulary', answer: 'd',
        text: 'Metinde geçen "araç" kelimesi hangi anlamdadır?',
        options: [
          { key: 'a', text: 'Taşıt' },
          { key: 'b', text: 'Oyuncak' },
          { key: 'c', text: 'Harita' },
          { key: 'd', text: 'Alet' },
        ],
      },
      {
        key: 'q7', skill: 'vocabulary', answer: 'c',
        text: 'Metindeki "Pusula sayesinde" sözünde "sayesinde" ne demektir?',
        options: [
          { key: 'a', text: 'Onu kullanmadan' },
          { key: 'b', text: 'Ona rağmen' },
          { key: 'c', text: 'Onun yardımıyla' },
          { key: 'd', text: 'Onu bir yana bırakıp' },
        ],
      },
      {
        key: 'q8', skill: 'main_idea', answer: 'b',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Gemilerin nasıl yapıldığını' },
          { key: 'b', text: 'Pusulanın nasıl yön gösterdiğini' },
          { key: 'c', text: 'Saatlerin nasıl çalıştığını' },
          { key: 'd', text: 'Haritaların nasıl çizildiğini' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Pusula, yön bulmamıza yardım eden küçük bir araçtır.', core: true },
      { key: 'i2', text: 'İçindeki dönebilen iğne küçük bir mıknatıstır.', core: true },
      { key: 'i3', text: 'Dünya dev bir mıknatıs gibi olduğu için iğnenin bir ucu hep kuzeyi gösterir.', core: true },
      { key: 'i4', text: 'Kuzeyi bulan biri öteki yönleri de bulabilir.', core: false },
      { key: 'i5', text: 'Denizciler bulutlu gecelerde pusulayla yön bulmuştur.', core: false },
      { key: 'i6', text: 'Pusula mıknatıstan ve demirden uzak tutulmalıdır, yoksa yanlış yönü gösterebilir.', core: false },
      { key: 'i7', text: 'Pusula düz tutulursa iğne rahatça döner.', core: false },
    ],
  },
];
