import type { OralPassage } from '@/lib/instruments/types';

export const passages: OralPassage[] = [
  {
    key: 'g1-kardan-adam',
    grade: 1,
    genre: 'narrative',
    title: 'Kardan Adamın Burnu',
    paragraphs: [
      'Sabah kar yağdı. Elif hemen bahçeye koştu. Büyük bir kardan adam yaptı. Yerden iki küçük taş buldu. Taşlar adamın gözleri oldu.',
      'Ama adamın burnu yoktu. Elif biraz düşündü. Sonra eve koştu. Annesi ona bir havuç verdi.',
      'Elif havucu burun yerine taktı. Adamın boynuna da kırmızı bir atkı sardı. Kardan adam çok güzel oldu. Elif ona el salladı.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'b',
        text: 'Elif kardan adamın boynuna ne sardı?',
        options: [
          { key: 'a', text: 'Mavi bir şal' },
          { key: 'b', text: 'Kırmızı bir atkı' },
          { key: 'c', text: 'Sarı bir kurdele' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'c',
        text: 'Elif adamın gözlerini neyle yaptı?',
        options: [
          { key: 'a', text: 'Düğmeyle' },
          { key: 'b', text: 'Kömürle' },
          { key: 'c', text: 'Taşla' },
        ],
      },
      {
        key: 'q3', skill: 'inference', answer: 'a',
        text: 'Elif neden eve koştu?',
        options: [
          { key: 'a', text: 'Burun bulmak için' },
          { key: 'b', text: 'Elini yıkamak için' },
          { key: 'c', text: 'Isınmak için' },
        ],
      },
      {
        key: 'q4', skill: 'vocabulary', answer: 'c',
        text: 'Metinde "el salladı" ne demek?',
        options: [
          { key: 'a', text: 'Elini yıkadı' },
          { key: 'b', text: 'Ellerini ısıttı' },
          { key: 'c', text: 'Selam verdi' },
        ],
      },
      {
        key: 'q5', skill: 'main_idea', answer: 'b',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Kış gelince kuşların nereye gittiğini' },
          { key: 'b', text: 'Elif’in kardan adam yapmasını' },
          { key: 'c', text: 'Annesinin mutfakta yemek yapmasını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Kar yağınca Elif bahçede kardan adam yapar.', core: true },
      { key: 'i2', text: 'Taşlardan adama göz yapar.', core: false },
      { key: 'i3', text: 'Kardan adamın burnu yoktur.', core: true },
      { key: 'i4', text: 'Elif eve koşar, annesi ona havuç verir.', core: false },
      { key: 'i5', text: 'Elif havucu adama burun yapar.', core: true },
      { key: 'i6', text: 'Adamın boynuna atkı sarar ve ona el sallar.', core: false },
    ],
  },
  {
    key: 'g1-kacan-top',
    grade: 1,
    genre: 'narrative',
    title: 'Kaçan Top',
    paragraphs: [
      'Emir bahçede top oynuyordu. Topa çok sert vurdu. Top çitin üstünden uçtu. Komşunun bahçesine düştü.',
      'Emir çitin önüne koştu. Ama çit çok yüksekti. Emir topu göremedi.',
      'Birden komşu kızı Defne seslendi. Defne topu çitin üstünden geri attı. Emir topu tuttu. Komşu kızına teşekkür etti.',
      'Sonra Defne de Emir ile oynamaya geldi. İki çocuk birlikte oynadı.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'a',
        text: 'Top nereye düştü?',
        options: [
          { key: 'a', text: 'Komşunun bahçesine' },
          { key: 'b', text: 'Okulun önüne' },
          { key: 'c', text: 'Sokaktaki arabanın altına' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'b',
        text: 'Emir topu neden göremedi?',
        options: [
          { key: 'a', text: 'Hava çok karanlıktı' },
          { key: 'b', text: 'Çit çok yüksekti' },
          { key: 'c', text: 'Top çok küçüktü' },
        ],
      },
      {
        key: 'q3', skill: 'inference', answer: 'c',
        text: 'Emir neden Defne’ye teşekkür etti?',
        options: [
          { key: 'a', text: 'Ona şeker verdiği için' },
          { key: 'b', text: 'Ona yeni bir top aldığı için' },
          { key: 'c', text: 'Topunu geri verdiği için' },
        ],
      },
      {
        key: 'q4', skill: 'vocabulary', answer: 'b',
        text: 'Metinde "sert vurdu" ne demek?',
        options: [
          { key: 'a', text: 'Yavaş yavaş itti' },
          { key: 'b', text: 'Çok güçlü vurdu' },
          { key: 'c', text: 'Eliyle tuttu' },
        ],
      },
      {
        key: 'q5', skill: 'main_idea', answer: 'a',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Emir’in topunu geri almasını' },
          { key: 'b', text: 'Defne’nin evini ve oyuncaklarını' },
          { key: 'c', text: 'Bir çitin nasıl yapıldığını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Emir bahçede top oynar.', core: true },
      { key: 'i2', text: 'Topa sert vurur, top komşunun bahçesine düşer.', core: true },
      { key: 'i3', text: 'Çit yüksektir, Emir topu göremez.', core: false },
      { key: 'i4', text: 'Komşu kızı Defne topu geri atar.', core: true },
      { key: 'i5', text: 'Emir, Defne’ye teşekkür eder.', core: false },
      { key: 'i6', text: 'İki çocuk birlikte oynar.', core: true },
    ],
  },
  {
    key: 'g1-salyangoz',
    grade: 1,
    genre: 'informational',
    title: 'Evini Taşıyan Salyangoz',
    paragraphs: [
      'Salyangoz küçük bir hayvandır. Sırtında sert bir kabuk taşır. Bu kabuk onun evidir. Salyangoz evini her yere götürür.',
      'Salyangoz çok yavaş gider. Arkasında parlak bir iz kalır. Bu izi bazen taşların üstünde görürsün.',
      'Salyangoz ıslak yerleri sever. Yağmurdan sonra sık sık ortaya çıkar. Yeşil yaprakları yer.',
      'Ona bir şey değerse hemen kabuğuna girer. Orada bir süre saklanır.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'c',
        text: 'Salyangozun evi neresidir?',
        options: [
          { key: 'a', text: 'Bir taşın altı' },
          { key: 'b', text: 'Bahçedeki bir yuva' },
          { key: 'c', text: 'Sırtındaki kabuk' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'a',
        text: 'Salyangozun arkasında ne kalır?',
        options: [
          { key: 'a', text: 'Parlak bir iz' },
          { key: 'b', text: 'Küçük delikler' },
          { key: 'c', text: 'Yaprak parçaları' },
        ],
      },
      {
        key: 'q3', skill: 'inference', answer: 'b',
        text: 'Salyangoz, ona bir şey değince neden saklanır?',
        options: [
          { key: 'a', text: 'Uyumak için' },
          { key: 'b', text: 'Korunmak için' },
          { key: 'c', text: 'Yemek yemek için' },
        ],
      },
      {
        key: 'q4', skill: 'vocabulary', answer: 'a',
        text: 'Metinde "ortaya çıkar" ne demek?',
        options: [
          { key: 'a', text: 'Görünür' },
          { key: 'b', text: 'Saklanır' },
          { key: 'c', text: 'Uyur' },
        ],
      },
      {
        key: 'q5', skill: 'main_idea', answer: 'c',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Yağmurun nasıl yağdığını' },
          { key: 'b', text: 'Bahçede hangi çiçeklerin açtığını' },
          { key: 'c', text: 'Salyangozun nasıl yaşadığını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Salyangoz evini, yani kabuğunu sırtında taşır.', core: true },
      { key: 'i2', text: 'Salyangoz çok yavaş gider.', core: true },
      { key: 'i3', text: 'Arkasında parlak bir iz bırakır.', core: false },
      { key: 'i4', text: 'Islak yerleri sever, yağmurdan sonra çok görülür.', core: false },
      { key: 'i5', text: 'Yeşil yaprakları yer.', core: false },
      { key: 'i6', text: 'Ona bir şey değince kabuğuna girip saklanır.', core: true },
    ],
  },
  {
    key: 'g2-unutulan-liste',
    grade: 2,
    genre: 'narrative',
    title: 'Unutulan Liste',
    paragraphs: [
      'Cumartesi sabahı Can ile babası pazara gitti. Pazar çok kalabalıktı. Tezgâhlar renk renk meyve ve sebzeyle doluydu.',
      'Babası alışveriş listesini aradı. Ceplerine baktı, çantasını açtı. Ama liste yoktu! Evde, masanın üstünde kalmıştı.',
      'Can bir an düşündü. Sabah listeyi annesiyle birlikte yazmıştı. Her şeyi renklerine göre aklında tutmuştu. Sonra tek tek saydı: "Kırmızı domates, sarı limon, yeşil biber, beyaz peynir."',
      'Babası hepsini aldı. Eve dönünce listeye baktılar. Hiçbir şey eksik değildi. Babası gülerek Can’a sarıldı: "Artık listemiz sensin!"',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'a',
        text: 'Can ile babası nereye gitti?',
        options: [
          { key: 'a', text: 'Pazara' },
          { key: 'b', text: 'Markete' },
          { key: 'c', text: 'Parka' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'c',
        text: 'Liste nerede kalmıştı?',
        options: [
          { key: 'a', text: 'Babasının cebinde' },
          { key: 'b', text: 'Babasının çantasında' },
          { key: 'c', text: 'Evdeki masada' },
        ],
      },
      {
        key: 'q3', skill: 'inference', answer: 'b',
        text: 'Babası neden "Artık listemiz sensin!" dedi?',
        options: [
          { key: 'a', text: 'Can listeyi yolda düşürdüğü için' },
          { key: 'b', text: 'Can her şeyi hatırladığı için' },
          { key: 'c', text: 'Can torbaları taşıdığı için' },
        ],
      },
      {
        key: 'q4', skill: 'vocabulary', answer: 'c',
        text: 'Metinde "aklında tutmuştu" ne demek?',
        options: [
          { key: 'a', text: 'Eline almıştı' },
          { key: 'b', text: 'Resmini çizmişti' },
          { key: 'c', text: 'Unutmamıştı' },
        ],
      },
      {
        key: 'q5', skill: 'main_idea', answer: 'a',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Can’ın listeyi hatırlamasını' },
          { key: 'b', text: 'Sebzelerin tarlada nasıl yetiştiğini' },
          { key: 'c', text: 'Can’ın annesiyle yemek yapmasını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Can ile babası cumartesi sabahı pazara gider.', core: true },
      { key: 'i2', text: 'Pazar kalabalıktır, tezgâhlar meyve ve sebzeyle doludur.', core: false },
      { key: 'i3', text: 'Babası alışveriş listesini evde unutmuştur.', core: true },
      { key: 'i4', text: 'Can listeyi sabah annesiyle birlikte yazmıştır.', core: false },
      { key: 'i5', text: 'Can her şeyi renklerine göre hatırlayıp tek tek sayar.', core: true },
      { key: 'i6', text: 'Eve dönünce hiçbir şeyin eksik olmadığını görürler.', core: false },
    ],
  },
  {
    key: 'g2-mavi-leke',
    grade: 2,
    genre: 'narrative',
    title: 'Mavi Leke',
    paragraphs: [
      'Zeynep resim yapmayı çok severdi. Bir gün masasına oturdu ve bir bahçe çizmeye başladı. Önce yeşil otları, sonra sarı güneşi boyadı.',
      'Tam o sırada kolu mavi boya şişesine çarptı. Şişe devrildi. Boya kâğıdın ortasına döküldü. Kâğıtta kocaman bir leke oldu. Zeynep çok üzüldü. Resmi atmak istedi.',
      'Ağabeyi Kerem yanına geldi. Lekeye uzun uzun baktı. Sonra gülümsedi: "Bu leke bir kelebek kanadına benziyor!"',
      'Zeynep de lekeye baktı. Gerçekten benziyordu! Lekenin yanına bir kanat daha çizdi. Sonra ince bir gövde ve iki anten ekledi. Mavi kelebek resmin en güzel yeri oldu.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'b',
        text: 'Zeynep ne çizmeye başladı?',
        options: [
          { key: 'a', text: 'Bir okul' },
          { key: 'b', text: 'Bir bahçe' },
          { key: 'c', text: 'Bir deniz kıyısı' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'a',
        text: 'Lekenin kelebeğe benzediğini kim söyledi?',
        options: [
          { key: 'a', text: 'Ağabeyi' },
          { key: 'b', text: 'Annesi' },
          { key: 'c', text: 'Arkadaşı' },
        ],
      },
      {
        key: 'q3', skill: 'inference', answer: 'c',
        text: 'Hikâyenin sonunda Zeynep nasıl hissetmiş olabilir?',
        options: [
          { key: 'a', text: 'Kızgın' },
          { key: 'b', text: 'Uykulu' },
          { key: 'c', text: 'Mutlu' },
        ],
      },
      {
        key: 'q4', skill: 'vocabulary', answer: 'a',
        text: 'Metinde "devrildi" ne demek?',
        options: [
          { key: 'a', text: 'Yan yatıp düştü' },
          { key: 'b', text: 'İçi boyayla doldu' },
          { key: 'c', text: 'Kapağı açıldı' },
        ],
      },
      {
        key: 'q5', skill: 'main_idea', answer: 'b',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Kelebeklerin bahçede nasıl uçtuğunu' },
          { key: 'b', text: 'Bir lekenin kelebeğe dönüşmesini' },
          { key: 'c', text: 'Boyaların nasıl yapıldığını' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Zeynep resim yapmayı sever ve bir bahçe çizer.', core: true },
      { key: 'i2', text: 'Kolu boya şişesine çarpar, kâğıda mavi boya dökülür.', core: true },
      { key: 'i3', text: 'Kâğıtta büyük bir leke olur, Zeynep üzülüp resmi atmak ister.', core: false },
      { key: 'i4', text: 'Ağabeyi Kerem lekenin kelebek kanadına benzediğini söyler.', core: true },
      { key: 'i5', text: 'Zeynep bir kanat, gövde ve anten ekleyip kelebek çizer.', core: true },
      { key: 'i6', text: 'Mavi kelebek resmin en güzel yeri olur.', core: false },
    ],
  },
  {
    key: 'g2-ayin-isigi',
    grade: 2,
    genre: 'informational',
    title: 'Ay’ın Işığı',
    paragraphs: [
      'Çoğu gece gökyüzüne bakınca Ay’ı görürüz. Ay bize çok parlak görünür. Ama Ay’ın kendi ışığı yoktur. Güneş’in ışığı Ay’a vurur. Ay da bu ışıkla parlar.',
      'Ay, Dünya’nın çevresinde döner. Ay’ın biçimi aslında hiç değişmez. Biz onun yalnızca ışık alan kısmını görürüz. Ay döndükçe bu kısım bize bazen büyük, bazen küçük görünür. Bu yüzden Ay kimi gece tam yuvarlak, kimi gece ince bir hilal gibi görünür.',
      'Ay’da hava yoktur. Bu yüzden orada rüzgâr esmez. Ay’a giden insanlar Ay’ın tozlu toprağında ayak izleri bıraktı. Rüzgâr olmadığı için bu izler uzun yıllar kalabilir.',
    ],
    questions: [
      {
        key: 'q1', skill: 'literal', answer: 'c',
        text: 'Ay’da neden rüzgâr esmez?',
        options: [
          { key: 'a', text: 'Çok soğuk olduğu için' },
          { key: 'b', text: 'Çok küçük olduğu için' },
          { key: 'c', text: 'Hava olmadığı için' },
        ],
      },
      {
        key: 'q2', skill: 'literal', answer: 'b',
        text: 'Metne göre Ay’ın biçimi değişir mi?',
        options: [
          { key: 'a', text: 'Her gece biraz küçülür' },
          { key: 'b', text: 'Aslında hiç değişmez' },
          { key: 'c', text: 'Yalnızca kışın değişir' },
        ],
      },
      {
        key: 'q3', skill: 'inference', answer: 'a',
        text: 'Güneş’in ışığı Ay’a vurmasaydı ne olurdu?',
        options: [
          { key: 'a', text: 'Ay’ı göremezdik' },
          { key: 'b', text: 'Ay daha parlak olurdu' },
          { key: 'c', text: 'Ay’da rüzgâr eserdi' },
        ],
      },
      {
        key: 'q4', skill: 'vocabulary', answer: 'b',
        text: 'Metinde "hilal" ne demek?',
        options: [
          { key: 'a', text: 'Top gibi yuvarlak bir şekil' },
          { key: 'b', text: 'Muz gibi ince bir şekil' },
          { key: 'c', text: 'Kutu gibi köşeli bir şekil' },
        ],
      },
      {
        key: 'q5', skill: 'main_idea', answer: 'c',
        text: 'Bu metin en çok neyi anlatıyor?',
        options: [
          { key: 'a', text: 'Güneş’in nasıl doğup battığını' },
          { key: 'b', text: 'Yıldızların nasıl parladığını' },
          { key: 'c', text: 'Ay’ın ışığını ve görünüşünü' },
        ],
      },
    ],
    ideas: [
      { key: 'i1', text: 'Ay’ın kendi ışığı yoktur, Güneş’in ışığıyla parlar.', core: true },
      { key: 'i2', text: 'Ay, Dünya’nın çevresinde döner.', core: true },
      { key: 'i3', text: 'Ay’ın biçimi değişmez, biz yalnızca ışık alan kısmını görürüz.', core: true },
      { key: 'i4', text: 'Bu yüzden Ay bazen yuvarlak, bazen hilal gibi görünür.', core: false },
      { key: 'i5', text: 'Ay’da hava olmadığı için rüzgâr esmez.', core: false },
      { key: 'i6', text: 'Ay’a giden insanların ayak izleri uzun yıllar kalabilir.', core: false },
    ],
  },
];
