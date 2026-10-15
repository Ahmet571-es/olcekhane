'use client';

import { useState } from 'react';
import { Secenekler, useGorunur, useHareketAzaltilmis } from './ortak';

/**
 * Sert zarın toplardamar sinüsleri. Üç görünüm:
 * 1. Yandan (soldan bakış): beyin orağı ve beyincik çadırı ince hatlarla; üst ve alt sagital sinüs, büyük beyin
 *    toplardamarı (Galen), düz sinüs, birleşme yeri, enine ve sigmoid sinüs, iç juguler toplardamar. Oklar ve akan
 *    noktalar kanın yönünü gösterir.
 * 2. Köprü toplardamarları (soldan bakış): beyin yüzeyinden üst sagital sinüse açılan birkaç toplardamar; dağılımları
 *    nasion–bregma–lambda–inion bölümlerine göre (Juskys ve ark., 2022) yaklaşık çizildi.
 * 3. Kafa tabanı (yukarıdan bakış): kavernöz ve interkavernöz sinüsler (hipofiz çevresindeki halka), üst ve alt petrozal
 *    sinüs, baziler ağ, sfenoparietal sinüs (varlığı tartışmalı; kesik çizgi), enine ve sigmoid sinüs.
 * Her yapı seçilince yeri, kanı nereden alıp nereye verdiği, ölçüleri ve kişiden kişiye değişen yanları kaynağıyla yazar.
 * Kaynaklar arasında farklı değerler varsa hepsi yöntemiyle birlikte verilir. Kafatası yalnızca sade bir dış hattır.
 * Kaynaklar: Gray (1918); FIPAT (2019, TA2); Juskys ve ark. (2022); Zhao ve ark. (2024); Zedde ve Pascarella (2025b);
 * Paudel ve ark. (2024); Kamaşak Arpaçay ve Aycan (2026); Rai ve ark. (2018); Anand ve ark. (2022); Zhou ve Yu (2024);
 * Alper ve ark. (2004); Medişoğlu ve Öçbe (2026); Tunç ve ark. (2024); Doğan ve Apaydın (2022); Munakomi ve Jozsa (2026);
 * Tatarli ve ark. (2013); Ishikawa ve ark. (2026); Balik ve ark. (2019); Ngnitewe Massa ve ark. (2023); San Millán Ruíz
 * ve ark. (2004); Posey ve ark. (2023); Serioli ve ark. (2026); El Youssef ve ark. (2024); Joost ve ark. (2026);
 * Cheshire ve ark. (2018); Mosteiro ve ark. (2024).
 */

type Gorunum = 'yandan' | 'taban' | 'kopru';
type Yapi =
  | 'ust-sagital'
  | 'alt-sagital'
  | 'galen'
  | 'duz'
  | 'birlesme'
  | 'enine'
  | 'sigmoid'
  | 'juguler'
  | 'kavernoz'
  | 'interkavernoz'
  | 'sfenoparietal'
  | 'ust-petrozal'
  | 'alt-petrozal'
  | 'baziler'
  | 'kopru';

type Kart = {
  ad: string;
  la?: string;
  kisa: string;
  satirlar: { b: string; m: string }[];
  olcu?: string[];
  cesit?: string[];
};

const KART: Record<Yapi, Kart> = {
  'ust-sagital': {
    ad: 'Üst sagital sinüs',
    la: 'sinus sagittalis superior',
    kisa: 'Üst sagital sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Beyin orağının kafatasına tutunan üst kenarında uzanır. Önde kör delikte (foramen cecum) başlar, kafanın tepesi boyunca arkaya gider. Kesiti üçgendir: önde dardır, arkaya doğru genişler (Gray, 1918).',
      },
      {
        b: 'Kanı nereden alır',
        m: 'Beyin yüzeyinden gelen üst beyin toplardamarları buraya açılır. Kafatası kemiğinin ve sert zarın toplardamarları da gelir (Gray, 1918). Sert zarın birçok toplardamarı önce sinüsün yanındaki ceplere açılır; bunlara yan lakünalar denir (Gray, 1918).',
      },
      {
        b: 'Kanı nereye verir',
        m: 'Arkada, iç art kafa çıkıntısının yanında bir yana sapar. Çoğu kez sağdaki enine sinüse devam eder. Genişlemiş ucu sinüslerin birleşme yeridir (Gray, 1918).',
      },
    ],
    olcu: [
      'Uzunluğu: 500 kişinin BT anjiyografisinde (damarları gösteren tomografi) kıvrımı boyunca ortalama 26,4 cm idi; en kısa 14,3, en uzun 33,4 cm (Zhao ve ark., 2024).',
      'Genişliği ölçülen yere ve yönteme göre değişir; tek bir sayı yoktur. 10 kadavrada önden arkaya doğru genişliyordu (ortanca): nasion ile bregmanın ortasında 7,3 mm, bregmada 10,2 mm, lambdada 13 mm, inionda 15,6 mm (Juskys ve ark., 2022).',
      'BT anjiyografide bregmada 5,2 mm, lambdada 8,6 mm, inionda 7,7 mm ölçüldü (Zhao ve ark., 2024).',
      'MR venografide (toplardamarları gösteren MR) ortalama çap 6,4 mm idi (Paudel ve ark., 2024).',
    ],
    cesit: [
      'Son kısmı çoğu kez sağa sapar. 500 kişinin 351’inde sağa, 79’unda sola sapıyordu; 70’inde ortadaydı (Zhao ve ark., 2024).',
      '100 hastalık bir çalışmada hastaların %7’sinde ön kısmı az gelişmişti (Zedde ve Pascarella, 2025b).',
    ],
  },
  'alt-sagital': {
    ad: 'Alt sagital sinüs',
    la: 'sinus sagittalis inferior',
    kisa: 'Alt sagital sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Beyin orağının serbest alt kenarında uzanır; bu kenarın arka yarısını ya da arka üçte ikisini kaplar (Gray, 1918). Bu kenar, iki yarımküreyi bağlayan nasırlı cismin (corpus callosum) hemen üstündedir (Munakomi ve Jozsa, 2026).',
      },
      {
        b: 'Kanı nereden alır',
        m: 'Beyin orağının içinde ince bir toplardamar ağı vardır. 16 olguda orağın arka üçte birindeki sık ağ alt sagital sinüsle bağlantılıydı (Tatarli ve ark., 2013).',
      },
      { b: 'Kanı nereye verir', m: 'Arkaya doğru genişler ve düz sinüse açılır (Gray, 1918).' },
    ],
    olcu: [
      'Görüntülemede her zaman seçilmez. Anatomide hemen herkeste vardır; ama faz kontrast MR venografi (bir tür toplardamar MR’ı) onu 136 hastanın yalnızca %41,2’sinde gösterdi (Doğan ve Apaydın, 2022).',
      'BT anjiyografide (damarları gösteren tomografi) 500 kişinin 249’unda görülmedi. Yaş ilerledikçe giderek kapandığı bulundu (Zhao ve ark., 2024).',
    ],
    cesit: [
      'Kadavrada 76 olgunun 1’inde hiç yoktu (Saxena ve ark.; Zedde ve Pascarella, 2025b içinde). Beyin orağı yoksa alt sagital sinüs de yoktur (Ishikawa ve ark., 2026).',
    ],
  },
  galen: {
    ad: 'Büyük beyin toplardamarı (Galen toplardamarı)',
    la: 'vena magna cerebri',
    kisa: 'Galen toplardamarı',
    satirlar: [
      { b: 'Nerede', m: 'Düz sinüsün başladığı yere gelir; burası alt sagital sinüsün bittiği noktadır (Gray, 1918).' },
      { b: 'Nedir', m: 'Bir sinüs değil, bir toplardamardır; Latince adındaki “vena” sözcüğü de bunu söyler (FIPAT, 2019).' },
      { b: 'Kanı nereye verir', m: 'Düz sinüse açılır. Düz sinüs onu alt sagital sinüsle birlikte alır (Gray, 1918).' },
    ],
  },
  duz: {
    ad: 'Düz sinüs',
    la: 'sinus rectus',
    kisa: 'Düz sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Beyin orağı ile beyincik çadırının birleştiği çizgide uzanır. Kesiti üçgendir. Alt sagital sinüsün ucundan başlar, aşağı ve arkaya iner (Gray, 1918).',
      },
      {
        b: 'Kanı nereden alır',
        m: 'Alt sagital sinüsü, büyük beyin toplardamarını (Galen) ve beyinciğin üst toplardamarlarını alır (Gray, 1918).',
      },
      {
        b: 'Kanı nereye verir',
        m: 'Gray (1918) onu, üst sagital sinüsün gitmediği yandaki enine sinüse bağlar. 109 kişilik bir MR venografi (toplardamar MR’ı) çalışmasında düz sinüs kişilerin %65,1’inde birleşme yerine, %18,3’ünde sol enine sinüse açılıyordu (Paudel ve ark., 2024).',
      },
    ],
    olcu: [
      'Uzunluğu: 108 kişide ortalama 51 ± 5,2 mm (Hasegawa ve ark.; Zedde ve Pascarella, 2025b içinde).',
      'Çapı çalışmaya göre farklı ölçüldü: MR venografide 3 ± 0,8 mm (Paudel ve ark., 2024); başka bir MR çalışmasının 67 sağlıklı kişisinde 4 ± 0,7 mm (Tunç ve ark., 2024).',
    ],
    cesit: ['43 kadavrada düz sinüslerin %13,85’i çiftti (Saxena ve ark.; Zedde ve Pascarella, 2025b içinde).'],
  },
  birlesme: {
    ad: 'Sinüslerin birleşme yeri',
    la: 'confluens sinuum',
    kisa: 'Birleşme yeri',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Üst sagital sinüsün genişlemiş ucudur. İç art kafa çıkıntısının bir yanında, çoğu kez sağında durur (Gray, 1918).',
      },
      { b: 'Adı', m: 'Eski adı torcular Herophili’dir; Herophilos’un adını taşır (Gray, 1918; FIPAT, 2019).' },
      {
        b: 'Kanı nereden alır',
        m: 'Üst sagital sinüs buraya gelir; küçük oksipital sinüsün kanı da buraya açılır (Gray, 1918). Düz sinüs de çoğu kişide buraya açılır (Paudel ve ark., 2024).',
      },
      { b: 'Kanı nereye verir', m: 'Sağ ve sol enine sinüslere (Gray, 1918).' },
    ],
    olcu: ['Kemiğe bakan duvarı, arka kafa çukurundaki sinüsler arasında en kalın yerdir (59 sinüs; Balik ve ark., 2019).'],
    cesit: [
      'Sinüslerin tek bir yerde tam birleşmesi herkeste görülmez. Bu düzenin sıklığı çalışmaya göre çok değişir: %20 (Fukusumi; Paudel ve ark., 2024 içinde), %32,7 (Kobayashi; Zedde ve Pascarella, 2025b içinde), %65,1 (Paudel ve ark., 2024).',
      '15 Türk kadavrasının %20’sinde birleşme yeri hiç yoktu. Böyle kişilerde sinüsler ayrı ayrı ya da başka kanallarla boşalır (Kamaşak Arpaçay ve Aycan, 2026).',
      'Oksipital sinüsün görülme sıklığı da çok değişir: toplardamar MR’ında %13,8 (Paudel ve ark., 2024); 15 Türk kadavrasının 11’inde vardı (Kamaşak Arpaçay ve Aycan, 2026).',
    ],
  },
  enine: {
    ad: 'Enine sinüs',
    la: 'sinus transversus',
    kisa: 'Enine sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'İç art kafa çıkıntısında başlar. Beyincik çadırının kafatasına tutunan kenarı içinde yana ve öne gider (Gray, 1918).',
      },
      {
        b: 'Kanı nereden alır',
        m: 'Biri (çoğu kez sağdaki) üst sagital sinüsün, öteki düz sinüsün devamıdır (Gray, 1918). Üst petrozal sinüs de kavernöz sinüsün kanını buraya getirir (Gray, 1918).',
      },
      {
        b: 'Kanı nereye verir',
        m: 'Çadırdan ayrılınca aşağı ve içe kıvrılır. Bu kıvrık kısma sigmoid sinüs denir (Gray, 1918).',
      },
    ],
    olcu: [
      'Uzunluğu yönteme göre farklı bulundu. Üç boyutlu toplardamar filminde 60,2 mm idi (Anand ve ark., 2022). Toplardamar MR’ında solda 78,3 mm, sağda 72,9 mm idi (Zhou ve Yu, 2024).',
      'Başlangıçtaki çapı solda 6,4 mm, sağda 7,9 mm (Zhou ve Yu, 2024). Kesit alanı sinüsün ortasında en küçüktür: 21,3 mm² (Anand ve ark., 2022).',
    ],
    cesit: [
      'Sağ ve sol çoğu kez eşit değildir. Üst sagital sinüsün devamı olan yan, genellikle sağdaki, daha büyüktür (Gray, 1918; Rai ve ark., 2018).',
      'Browder ve Kaplan’ın örneklerinde sağ baskın %33, eşit %16, sol baskın %8 idi (Zedde ve Pascarella, 2025b içinde).',
      'Nepal’de 109 kişinin toplardamar MR’ında sinüsler %73,4 kişide simetrikti. Sol sinüs %18,35, sağ sinüs %4,59 kişide az gelişmişti (hipoplazi) (Paudel ve ark., 2024).',
      'Erzurum’da 105 MR’da sol sinüs %20 kişide hiç gelişmemişti (aplazi), %39 kişide az gelişmişti. Sinüsler %31 kişide simetrikti (Alper ve ark., 2004).',
      'Her çalışma sağ baskınlık bulmadı: 15 Türk kadavrasında ortalama genişlik solda 5,71 mm, sağda 5,33 mm idi (Kamaşak Arpaçay ve Aycan, 2026).',
      'MR’da enine sinüste akım boşluğu ya da aplazi, normal kişilerin yaklaşık %24’ünde görülebilir. Bu görünüm pıhtı (tromboz) sanılabilir (Alper ve ark., 2004).',
    ],
  },
  sigmoid: {
    ad: 'Sigmoid sinüs',
    la: 'sinus sigmoideus',
    kisa: 'Sigmoid sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Enine sinüsün devamıdır. Şakak kemiğinin arka (mastoid) kısmındaki olukta S gibi kıvrılır; aşağı ve içe iner (Gray, 1918).',
      },
      { b: 'Kanı nereden alır', m: 'Yukarıda enine sinüsten (FIPAT, 2019).' },
      { b: 'Kanı nereye verir', m: 'Juguler delikte iç juguler toplardamara açılır (Gray, 1918; FIPAT, 2019).' },
      {
        b: 'Adı',
        m: 'Gray (1918) onu ayrı bir sinüs saymaz; enine sinüsün mastoid oluğundaki parçası olarak anlatır. Ayrı adı resmî terim listesine 1955’te eklendi (FIPAT, 2019).',
      },
    ],
    olcu: [
      'Uzunluğu: üç boyutlu toplardamar filminde 55,1 mm (Anand ve ark., 2022).',
      'Sonundaki genişlemenin (juguler ampul) çapı: solda 5,9 mm, sağda 7,3 mm (100 kişinin toplardamar MR’ı; Zhou ve Yu, 2024).',
      'Kocaeli’de 241 kişinin şakak kemiği BT’sinde derinliği sağda 6,57 mm, solda 6,33 mm idi. Genişliği sağda 14,55 mm, solda 15,18 mm idi; sol taraf anlamlı olarak genişti (Medişoğlu ve Öçbe, 2026).',
    ],
    cesit: ['Az gelişmesi ya da hiç olmaması çoğunlukla sol yanda görülür (Zedde ve Pascarella, 2025b).'],
  },
  juguler: {
    ad: 'İç juguler toplardamar',
    la: 'vena jugularis interna',
    kisa: 'İç juguler toplardamar',
    satirlar: [
      { b: 'Nerede', m: 'Kafatası tabanındaki juguler delikte başlar. Bir sinüs değil, toplardamardır (Gray, 1918).' },
      {
        b: 'Kanı nereden alır',
        m: 'Sigmoid sinüs juguler delikte buna açılır. Alt petrozal sinüs de başındaki genişlemeye (üst ampul) açılır (Gray, 1918).',
      },
    ],
  },
  kavernoz: {
    ad: 'Kavernöz sinüs',
    la: 'sinus cavernosus',
    kisa: 'Kavernöz sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Kama kemiğinin gövdesinin iki yanında, hipofizin sağında ve solunda durur. Önde üst göz yarığından, arkada şakak kemiğinin kayalık kısmının ucuna uzanır (Gray, 1918).',
      },
      { b: 'Adı', m: 'Adını ağsı yapısından alır: içinden çok sayıda ince iplik geçer (Gray, 1918).' },
      {
        b: 'İçinde ve duvarında neler var',
        m: 'İç karotis atardamarı ve hemen yanında abdusens siniri (VI) sinüsün içinden geçer (Mosteiro ve ark., 2024). Gray (1918) bu ikisini iç duvarda anlatır; bu tarihsel bir anlatımdır. Yan duvarında dört sinir yolu vardır: okülomotor (III) ve troklear (IV) sinirler, trigeminal sinirin oftalmik ve maksiller dalları (Gray, 1918; Mosteiro ve ark., 2024).',
      },
      {
        b: 'Kanı nereden alır',
        m: 'Küçük sfenoparietal sinüs buraya açılır (Gray, 1918). Hipofizin toplardamar ağı da kavernöz ve interkavernöz sinüslerle doğrudan birleşir (Ishikawa ve ark., 2026).',
      },
      {
        b: 'Kanı nereye verir',
        m: 'Üst petrozal sinüsle enine sinüse, alt petrozal sinüsle iç juguler toplardamara bağlanır. Kafa tabanındaki küçük deliklerden kafatası dışındaki pterigoid toplardamar ağına da bağlanır (Gray, 1918).',
      },
    ],
    olcu: ['Bir klinik kaynağa göre yaklaşık 1 cm genişliğinde, 2 cm uzunluğundadır (Ngnitewe Massa ve ark., 2023).'],
    cesit: [
      'Hipofize bakan iç duvarı, birçok ders kitabındaki çizimin aksine sert zar değildir; lifli bir dokudur (hipofiz kapsülü) (Ishikawa ve ark., 2026).',
    ],
  },
  interkavernoz: {
    ad: 'İnterkavernöz sinüsler',
    la: 'sinus intercavernosi',
    kisa: 'İnterkavernöz sinüsler',
    satirlar: [
      {
        b: 'Nerede',
        m: 'İki tanedir: biri hipofizin önünden, öteki arkasından geçer. İki kavernöz sinüsü orta hattan birbirine bağlarlar (Gray, 1918).',
      },
      {
        b: 'Bağlantıları',
        m: 'Kavernöz sinüslerle birlikte hipofizin çevresinde bir toplardamar halkası yaparlar; buna dairesel sinüs denir (Gray, 1918). Hipofizin toplardamar ağı bu sinüslerle doğrudan birleşir (Ishikawa ve ark., 2026).',
      },
    ],
    cesit: [
      'Öndeki çoğu kez daha büyüktür; ikisinden biri ara sıra hiç yoktur (Gray, 1918).',
      'Küçük bir alt interkavernöz sinüs olguların %17’sinde bulundu (Tubbs ve ark., 2014, aktaran FIPAT, 2019).',
    ],
  },
  sfenoparietal: {
    ad: 'Sfenoparietal sinüs',
    la: 'sinus sphenoparietalis',
    kisa: 'Sfenoparietal sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Gray’e (1918) göre kama kemiğinin küçük kanadının alt yüzü boyunca uzanır ve kavernöz sinüse açılır.',
      },
      { b: 'Adı', m: 'İlk kez 1829’da Breschet çizdi; bu yüzden Breschet sinüsü de denir (Serioli ve ark., 2026; FIPAT, 2019).' },
      {
        b: 'Tartışma',
        m: 'Varlığı tartışmalıdır; çizimde kesik çizgiyle gösterildi. San Millán Ruíz ve arkadaşları (2004) 15 örneği inceledi. Onlara göre bu “sinüs”, iki ayrı toplardamar yapısının yanlışlıkla tek yapı sayılmasıdır. Posey ve arkadaşları (2023) ise 20 yanın %70’inde belirgin bir sfenoparietal sinüs buldu. Dokusu incelenen örneklerin %85’i toplardamar değil, sert zar sinüsü yapısındaydı. Serioli ve arkadaşları (2026) iki görüşü uzlaştıran bir açıklama önerir.',
      },
    ],
  },
  'ust-petrozal': {
    ad: 'Üst petrozal sinüs',
    la: 'sinus petrosus superior',
    kisa: 'Üst petrozal sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Küçük ve dar bir sinüstür. Şakak kemiğinin kayalık kısmının üst kenarında, beyincik çadırının tutunduğu kenar içinde uzanır. Yolu üzerinde trigeminal sinirin üstünden geçer (Gray, 1918).',
      },
      { b: 'Kanı nereden alır', m: 'Kavernöz sinüsün arka ucundan (Gray, 1918).' },
      { b: 'Kanı nereye verir', m: 'Enine sinüse (Gray, 1918).' },
    ],
    cesit: [
      'İstanbul’da 30 kadavra başında ölçülen oluklar, sağ ve sol yandaki sinüslerin çapta ve orta hatta uzaklıkta eşit olmadığını gösterdi (El Youssef ve ark., 2024).',
    ],
  },
  'alt-petrozal': {
    ad: 'Alt petrozal sinüs',
    la: 'sinus petrosus inferior',
    kisa: 'Alt petrozal sinüs',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Şakak kemiğinin kayalık kısmı ile art kafa kemiğinin taban kısmı arasındaki olukta uzanır (Gray, 1918).',
      },
      { b: 'Kanı nereden alır', m: 'Kavernöz sinüsten (Gray, 1918; FIPAT, 2019).' },
      {
        b: 'Kanı nereye verir',
        m: 'Juguler deliğin ön kısmından geçer ve iç juguler toplardamarın başındaki genişlemeye (üst ampul) açılır (Gray, 1918).',
      },
    ],
    olcu: ['Toplardamar MR’ında 200 yanın %59,5’inde kesintisiz, iyi gelişmiş bir kanal olarak görüldü (Zhou ve Yu, 2024).'],
    cesit: ['İki yandaki alt petrozal sinüsü baziler ağ birbirine bağlar (Gray, 1918).'],
  },
  baziler: {
    ad: 'Baziler ağ',
    la: 'plexus venosus basilaris',
    kisa: 'Baziler ağ',
    satirlar: [
      {
        b: 'Nerede',
        m: 'Art kafa kemiğinin taban kısmı (klivus) üzerinde, sert zarın katları arasındadır. Birbirine örülmüş birkaç toplardamar kanalından oluşur (Gray, 1918).',
      },
      {
        b: 'Bağlantıları',
        m: 'İki alt petrozal sinüsü birbirine bağlar. Ön omurga toplardamar ağıyla da bağlantılıdır (Gray, 1918).',
      },
    ],
  },
  kopru: {
    ad: 'Köprü toplardamarları',
    kisa: 'Köprü toplardamarları',
    satirlar: [
      {
        b: 'Nedir',
        m: 'Beyin yüzeyindeki toplardamarlar, örümcek ağı zarın altındaki boşlukta birleşir. Sonra sert zarı geçip sinüse açılırlar (Joost ve ark., 2026). Bu geçiş parçasına köprü toplardamarı denir; çizimde seçilince turuncu görünür.',
      },
      {
        b: 'Sinüse nasıl girer',
        m: 'Gray (1918) üst beyin toplardamarlarını 8–12 tane sayar. Öndekiler sinüse dik açıyla açılır. Arkadaki büyük toplardamarlar öne doğru eğik gider; sinüse, içindeki akıma az çok karşı yönde girer (Gray, 1918).',
      },
    ],
    olcu: [
      'Sayı: 10 kadavrada üst sagital sinüse açılan 191 köprü toplardamarı sayıldı; kişi başına ortalama 19,1 ± 2,5 (Juskys ve ark., 2022).',
      '500 kişinin BT anjiyografisinde (damarları gösteren tomografi) her yanda ortalama 5,6 toplardamar gövdesi görüldü (Zhao ve ark., 2024).',
      'Yer: toplardamarların %41,9’u nasion ile bregma, %53,3’ü bregma ile lambda, %4,7’si lambda ile inion arasında sinüse açılıyordu (Juskys ve ark., 2022).',
      'Çap: ortalama sağda 1,4 mm, solda 1,1 mm (Juskys ve ark., 2022).',
    ],
    cesit: [
      'Bebek ve küçük çocukta daha çoktur: 43 otopside beyin başına ortalama 54,1, en çok 94 köprü toplardamarı bulundu (Cheshire ve ark., 2018).',
    ],
  },
};

const GORUNUM: Record<Gorunum, { ad: string; baslik: string; metin: string; bakis: string; yapilar: Yapi[]; ilk: Yapi }> = {
  yandan: {
    ad: 'Yandan',
    baslik: 'Yandan: sinüsler ve kanın yolu',
    metin:
      'Sinüsler, sert zarın iki katı arasındaki kapakçıksız toplardamar kanallarıdır (Gray, 1918). Çoğu, beyin orağının ve beyincik çadırının kenarlarında uzanır (Gray, 1918). Oklar kanın yönünü gösterir: kan önden arkaya akar, birleşme yerinde toplanır, enine ve sigmoid sinüslerden iç juguler toplardamara iner. Orta hattaki ve yandaki yapılar üst üste çizildi.',
    bakis: 'Soldan bakış: yüz solda, tepe yukarıda. Şema; oranlar yaklaşıktır.',
    yapilar: ['ust-sagital', 'alt-sagital', 'galen', 'duz', 'birlesme', 'enine', 'sigmoid', 'juguler'],
    ilk: 'ust-sagital',
  },
  kopru: {
    ad: 'Köprü toplardamarları',
    baslik: 'Beyinden sinüse: köprü toplardamarları',
    metin:
      'Sol yarımküreye yandan bakıyorsun. Beyin yüzeyindeki toplardamarlar yukarı çıkar, sert zarı geçer ve üst sagital sinüse açılır (Joost ve ark., 2026). Çizimde yalnızca birkaç tanesi var; 10 kadavrada kişi başına ortalama 19,1 tane sayıldı (Juskys ve ark., 2022). Arkadakiler sinüse öne doğru eğik girer (Gray, 1918).',
    bakis: 'Soldan bakış: yüz solda, tepe yukarıda. Şema; oranlar yaklaşıktır.',
    yapilar: ['kopru', 'ust-sagital'],
    ilk: 'kopru',
  },
  taban: {
    ad: 'Kafa tabanı',
    baslik: 'Kafa tabanı: hipofizin çevresi',
    metin:
      'Kafa tabanına yukarıdan bakıyorsun; beyin kaldırılmış gibi düşün. Hipofizin iki yanındaki kavernöz sinüsler, interkavernöz sinüslerle birlikte bir halka yapar (Gray, 1918). Bu halkanın kanı üst petrozal sinüsle enine sinüse, alt petrozal sinüsle iç juguler toplardamara gider (Gray, 1918). Kesik çizgi, varlığı tartışmalı olan sfenoparietal sinüstür.',
    bakis: 'Yukarıdan bakış: kafa tabanının içi; ön yukarıda, hastanın solu solda. Şema; oranlar yaklaşıktır.',
    yapilar: ['kavernoz', 'interkavernoz', 'sfenoparietal', 'ust-petrozal', 'alt-petrozal', 'baziler', 'enine', 'sigmoid', 'birlesme'],
    ilk: 'kavernoz',
  },
};

// ——— Renkler ———
const MAVI = '#3f83c9';
const SECILI = '#ef6c2f';
const ZAR = '#c9a46e';
const ZAR_KENAR = '#a8834f';
const BEYIN = '#e86f86';
const BEYIN_KENAR = '#cf6a80';

// ——— Geometri: kübik Bézier zincirleri (ilk nokta, ardından her parça için üç nokta) ———
type P = readonly [number, number];
type Zincir = readonly P[];
type N = { x: number; y: number };

const f = (v: number) => Math.round(v * 10) / 10;

function yolYaz(z: Zincir): string {
  let s = `M${f(z[0][0])},${f(z[0][1])}`;
  for (let i = 1; i + 2 < z.length; i += 3) {
    s += `C${f(z[i][0])},${f(z[i][1])} ${f(z[i + 1][0])},${f(z[i + 1][1])} ${f(z[i + 2][0])},${f(z[i + 2][1])}`;
  }
  return s;
}

/** Zincir boyunca t (0–1, parçalara eşit bölünmüş) noktası ve yön açısı. */
function zincirNoktasi(z: Zincir, t: number): N & { a: number } {
  const n = (z.length - 1) / 3;
  const k = Math.min(n - 1, Math.max(0, Math.floor(t * n)));
  const u = t * n - k;
  const [p0, p1, p2, p3] = [z[3 * k], z[3 * k + 1], z[3 * k + 2], z[3 * k + 3]];
  const v = 1 - u;
  const x = v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0];
  const y = v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1];
  const dx = 3 * v * v * (p1[0] - p0[0]) + 6 * v * u * (p2[0] - p1[0]) + 3 * u * u * (p3[0] - p2[0]);
  const dy = 3 * v * v * (p1[1] - p0[1]) + 6 * v * u * (p2[1] - p1[1]) + 3 * u * u * (p3[1] - p2[1]);
  return { x, y, a: Math.atan2(dy, dx) };
}

/** Zinciri sık noktalarla örnekler (yay uzunluğu hesapları için). */
function ornekle(z: Zincir, adim = 40): N[] {
  const n = (z.length - 1) / 3;
  const c: N[] = [];
  for (let i = 0; i <= n * adim; i++) c.push(zincirNoktasi(z, i / (n * adim)));
  return c;
}

/** Örneklenmiş çizgide, baştan yay uzunluğunun `oran` kadarındaki nokta ve yön. */
function boyNoktasi(n: N[], oran: number): N & { a: number } {
  const t = [0];
  for (let i = 1; i < n.length; i++) t.push(t[i - 1] + Math.hypot(n[i].x - n[i - 1].x, n[i].y - n[i - 1].y));
  const d = oran * t[t.length - 1];
  let i = 1;
  while (i < t.length - 1 && t[i] < d) i++;
  const u = (d - t[i - 1]) / (t[i] - t[i - 1] || 1);
  return {
    x: n[i - 1].x + (n[i].x - n[i - 1].x) * u,
    y: n[i - 1].y + (n[i].y - n[i - 1].y) * u,
    a: Math.atan2(n[i].y - n[i - 1].y, n[i].x - n[i - 1].x),
  };
}

const ayna = (z: Zincir): Zincir => z.map(([x, y]) => [400 - x, y] as const);
const ters = (z: Zincir): Zincir => [...z].reverse();

// ——— Çizim parçaları ———
function Yazi({
  x,
  y,
  children,
  bas = 'start',
  kalin = false,
  renk = 'var(--ink)',
  egik = false,
  onClick,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  bas?: 'start' | 'middle' | 'end';
  kalin?: boolean;
  renk?: string;
  egik?: boolean;
  onClick?: () => void;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={bas}
      fontSize={10.5}
      fontWeight={kalin ? 700 : 500}
      fontStyle={egik ? 'italic' : undefined}
      fill={renk}
      stroke="var(--surface)"
      strokeWidth={3}
      strokeLinejoin="round"
      paintOrder="stroke"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </text>
  );
}

function Gosterge({ a, b }: { a: P; b: P }) {
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink-3)" strokeWidth={0.9} />;
}

function Ok({ x, y, a, renk, boy }: { x: number; y: number; a: number; renk: string; boy: number }) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const h = boy * 0.6;
  const uc = [x + c * boy * 0.55, y + s * boy * 0.55];
  const t = [x - c * boy * 0.45, y - s * boy * 0.45];
  const d = `M${f(uc[0])},${f(uc[1])}L${f(t[0] - s * h)},${f(t[1] + c * h)}L${f(t[0] + s * h)},${f(t[1] - c * h)}Z`;
  return <path d={d} fill={renk} stroke="var(--surface)" strokeWidth={1} strokeLinejoin="round" />;
}

/** Bir sinüs ya da toplardamar: dokununca seçilir; seçiliyse turuncu. Oklar akış yönündedir. */
function Damar({
  z,
  w,
  secili,
  akis,
  kesik = false,
  oklar = [0.5],
  onSec,
}: {
  z: Zincir;
  w: number;
  secili: boolean;
  akis: boolean;
  kesik?: boolean;
  oklar?: number[];
  onSec: () => void;
}) {
  const d = yolYaz(z);
  const renk = secili ? SECILI : MAVI;
  return (
    <g onClick={onSec} style={{ cursor: 'pointer' }}>
      <path d={d} fill="none" stroke="transparent" strokeWidth={w + 12} />
      {secili && <path d={d} fill="none" stroke={SECILI} strokeOpacity={0.28} strokeWidth={w + 7} strokeLinecap="round" />}
      <path d={d} fill="none" stroke="var(--surface)" strokeWidth={w + 2.4} strokeLinecap="round" />
      <path d={d} fill="none" stroke={renk} strokeWidth={w} strokeLinecap="round" strokeDasharray={kesik ? '5 4' : undefined} />
      {akis && !kesik && (
        <path
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.9}
          strokeWidth={Math.max(1.3, w * 0.42)}
          strokeLinecap="round"
          strokeDasharray="0.01 10"
        >
          <animate attributeName="stroke-dashoffset" from="10.01" to="0" dur="0.9s" repeatCount="indefinite" />
        </path>
      )}
      {oklar.map((t) => {
        const p = zincirNoktasi(z, t);
        return <Ok key={t} x={p.x} y={p.y} a={p.a} renk={renk} boy={Math.max(7, w + 4)} />;
      })}
    </g>
  );
}

type CizimProps = { secili: Yapi; sec: (y: Yapi) => void; akis: boolean };

// ——— Yan görünüş (soldan bakış; yüz solda) ———
/** Kafanın üst ve arka dış hattı: nasion (60,144) → tepe → inion (290,190) → ense. */
const KUBBE: Zincir = [
  [60, 144],
  [52, 124],
  [52, 100],
  [66, 78],
  [84, 50],
  [118, 34],
  [160, 32],
  [200, 30],
  [244, 40],
  [270, 70],
  [292, 96],
  [302, 140],
  [290, 190],
  [290, 212],
  [280, 232],
  [270, 248],
  [262, 262],
  [258, 276],
  [258, 292],
];
/** Yüz: nasiondan çeneye ve boynun önüne. */
const YUZ: Zincir = [
  [60, 144],
  [56, 152],
  [52, 158],
  [48, 166],
  [44, 174],
  [38, 184],
  [36, 192],
  [38, 198],
  [44, 200],
  [50, 200],
  [48, 206],
  [50, 212],
  [48, 216],
  [50, 220],
  [50, 224],
  [48, 228],
  [50, 236],
  [50, 244],
  [54, 252],
  [58, 262],
  [72, 264],
  [90, 262],
  [110, 258],
  [128, 256],
  [140, 262],
  [146, 272],
  [146, 282],
  [146, 292],
];
const SILUET: Zincir = [...ters(YUZ), ...KUBBE.slice(1)];
const SILUET_DOLGU = `${yolYaz(SILUET)}Z`;

/** Kafatası noktaları: nasion–inion yayı; bregma ve lambda Juskys ve ark. (2022) ortanca uzaklıklarıyla (132,7 / 123,1 / 82,3 mm). */
const KUBBE_ORNEK = ornekle(KUBBE.slice(0, 13));
const KAFA_NOKTALARI: { ad: string; oran: number }[] = [
  { ad: 'nasion', oran: 0 },
  { ad: 'bregma', oran: 132.7 / 338.1 },
  { ad: 'lambda', oran: 255.8 / 338.1 },
  { ad: 'inion', oran: 1 },
];

const USS: Zincir = [
  [76, 140],
  [66, 124],
  [64, 104],
  [72, 86],
  [88, 58],
  [120, 42],
  [162, 40],
  [204, 38],
  [244, 48],
  [266, 76],
  [286, 100],
  [292, 132],
  [288, 160],
  [286, 172],
  [282, 182],
  [276, 190],
];
const ORAK_SERBEST_ON: Zincir = [
  [76, 140],
  [88, 130],
  [108, 118],
  [130, 112],
];
const ASS: Zincir = [
  [130, 112],
  [168, 102],
  [214, 104],
  [238, 128],
];
const DUZ: Zincir = [
  [238, 128],
  [250, 146],
  [264, 170],
  [276, 190],
];
const GALEN: Zincir = [
  [212, 154],
  [224, 152],
  [233, 143],
  [238, 128],
];
const ENINE_YAN: Zincir = [
  [276, 190],
  [262, 184],
  [240, 188],
  [226, 198],
];
const SIGMOID_YAN: Zincir = [
  [226, 198],
  [218, 208],
  [222, 220],
  [224, 228],
  [226, 238],
  [218, 248],
  [206, 250],
];
const JUGULER: Zincir = [
  [206, 250],
  [202, 262],
  [202, 278],
  [202, 292],
];
/** Çadırın serbest kenarı (çentik): ön klinoid hizasından (156,168) tepeye. */
const CADIR_SERBEST: Zincir = [
  [156, 168],
  [182, 170],
  [216, 158],
  [238, 128],
];

const ORAK_YOL = `${yolYaz(USS)}${yolYaz(ters(DUZ)).replace(/^M[^C]+/, '')}${yolYaz(ters(ASS)).replace(/^M[^C]+/, '')}${yolYaz(
  ters(ORAK_SERBEST_ON),
).replace(/^M[^C]+/, '')}Z`;
const CADIR_YOL = `${yolYaz(DUZ)}${yolYaz(ENINE_YAN).replace(/^M[^C]+/, '')}L156,168${yolYaz(CADIR_SERBEST).replace(/^M[^C]+/, '')}Z`;

const BEYIN_YAN =
  'M84,150 C76,132 74,110 82,94 C96,66 126,52 164,50 C204,48 240,58 260,82 C278,104 284,132 280,160 C278,172 272,180 264,186 C250,184 236,182 224,180 C206,184 190,190 172,192 C150,194 132,188 120,178 C108,168 94,158 84,150 Z';
const BEYINCIK_YAN = 'M212,192 C228,184 254,184 270,194 C280,202 280,222 268,234 C254,246 230,248 214,240 C204,232 202,202 212,192 Z';
/** Beyin sapı: orta beyin çadır çentiğinde, köprü önde şişkin; aşağıda büyük delik hizasında solarak biter. */
const SAP_YAN =
  'M180,160 C176,172 170,184 170,198 C170,212 176,220 180,230 C182,240 184,250 186,262 L200,262 C200,248 200,236 202,226 C204,214 206,200 204,186 C202,176 198,166 196,160 Z';

function KafaNoktalari({ yazilar }: { yazilar: Record<string, { x: number; y: number; bas: 'start' | 'middle' | 'end' }> }) {
  return (
    <g>
      {KAFA_NOKTALARI.map((k) => {
        const p = boyNoktasi(KUBBE_ORNEK, k.oran);
        const nx = Math.sin(p.a);
        const ny = -Math.cos(p.a);
        const y = yazilar[k.ad];
        return (
          <g key={k.ad}>
            <line
              x1={f(p.x - nx * 5)}
              y1={f(p.y - ny * 5)}
              x2={f(p.x + nx * 5)}
              y2={f(p.y + ny * 5)}
              stroke="var(--ink)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {y && (
              <Yazi x={y.x} y={y.y} bas={y.bas} renk="var(--ink-2)">
                {k.ad}
              </Yazi>
            )}
          </g>
        );
      })}
    </g>
  );
}

function YanZemin() {
  return (
    <g>
      <path d={SILUET_DOLGU} fill="var(--surface-2)" />
      <path d={yolYaz(SILUET)} fill="none" stroke="var(--ink-3)" strokeWidth={1.5} strokeLinejoin="round" />
      <path d={BEYIN_YAN} fill={BEYIN} fillOpacity={0.13} />
      <path d={BEYINCIK_YAN} fill={BEYIN} fillOpacity={0.16} stroke={BEYIN_KENAR} strokeOpacity={0.45} strokeWidth={1} />
    </g>
  );
}

function YandanCizim({ secili, sec, akis }: CizimProps) {
  const s = (y: Yapi) => ({ secili: secili === y, akis, onSec: () => sec(y) });
  const yazi = (y: Yapi) => ({ kalin: secili === y, renk: secili === y ? 'var(--ink)' : 'var(--ink-2)', onClick: () => sec(y) });
  return (
    <g>
      <YanZemin />
      <defs>
        <linearGradient id="sinus-haritasi-sap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.7" stopColor={BEYIN} stopOpacity={0.18} />
          <stop offset="1" stopColor={BEYIN} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={SAP_YAN} fill="url(#sinus-haritasi-sap)" />
      {/* Sert zarın kıvrımları */}
      <path d={ORAK_YOL} fill={ZAR} fillOpacity={0.24} stroke={ZAR_KENAR} strokeWidth={1} strokeLinejoin="round" />
      <path d={CADIR_YOL} fill={ZAR} fillOpacity={0.34} stroke={ZAR_KENAR} strokeWidth={1} strokeLinejoin="round" />
      {/* Sinüsler: akış yönünde */}
      <Damar z={JUGULER} w={6.5} oklar={[0.6]} {...s('juguler')} />
      <Damar z={SIGMOID_YAN} w={5.5} oklar={[0.5]} {...s('sigmoid')} />
      <Damar z={ENINE_YAN} w={5.5} oklar={[0.5]} {...s('enine')} />
      <Damar z={GALEN} w={3.6} oklar={[0.4]} {...s('galen')} />
      <Damar z={ASS} w={3.2} oklar={[0.5]} {...s('alt-sagital')} />
      <Damar z={DUZ} w={4.4} oklar={[0.5]} {...s('duz')} />
      <Damar z={USS} w={5} oklar={[0.2, 0.52, 0.86]} {...s('ust-sagital')} />
      <g onClick={() => sec('birlesme')} style={{ cursor: 'pointer' }}>
        {secili === 'birlesme' && <circle cx={276} cy={190} r={12} fill={SECILI} fillOpacity={0.28} />}
        <circle cx={276} cy={190} r={7.5} fill={secili === 'birlesme' ? SECILI : MAVI} stroke="var(--surface)" strokeWidth={1.6} />
      </g>
      {secili === 'ust-sagital' && (
        <KafaNoktalari
          yazilar={{
            nasion: { x: 50, y: 136, bas: 'end' },
            bregma: { x: 150, y: 20, bas: 'middle' },
            lambda: { x: 296, y: 86, bas: 'start' },
            inion: { x: 298, y: 178, bas: 'start' },
          }}
        />
      )}
      {/* Etiketler */}
      <Yazi x={232} y={24} bas="middle" {...yazi('ust-sagital')}>
        üst sagital sinüs
      </Yazi>
      <Yazi x={176} y={76} bas="middle" renk="var(--ink-3)" egik>
        beyin orağı
      </Yazi>
      <Yazi x={172} y={127} bas="middle" {...yazi('alt-sagital')}>
        alt sagital sinüs
      </Yazi>
      <Yazi x={207} y={150} bas="end" {...yazi('galen')}>
        Galen toplardamarı
      </Yazi>
      <Gosterge a={[251, 112]} b={[251, 145]} />
      <Yazi x={250} y={108} bas="middle" {...yazi('duz')}>
        düz sinüs
      </Yazi>
      <Yazi x={222} y={171} bas="middle" renk="var(--ink-3)" egik>
        beyincik
      </Yazi>
      <Yazi x={220} y={183} bas="middle" renk="var(--ink-3)" egik>
        çadırı
      </Yazi>
      <Gosterge a={[302, 194]} b={[284, 191]} />
      <Yazi x={304} y={198} {...yazi('birlesme')}>
        birleşme yeri
      </Yazi>
      <Gosterge a={[302, 214]} b={[254, 191]} />
      <Yazi x={304} y={218} {...yazi('enine')}>
        enine sinüs
      </Yazi>
      <Gosterge a={[302, 236]} b={[229, 234]} />
      <Yazi x={304} y={240} {...yazi('sigmoid')}>
        sigmoid sinüs
      </Yazi>
      <Gosterge a={[302, 266]} b={[205, 270]} />
      <Yazi x={304} y={264} {...yazi('juguler')}>
        iç juguler
      </Yazi>
      <Yazi x={304} y={277} {...yazi('juguler')}>
        toplardamar
      </Yazi>
    </g>
  );
}

// ——— Kafa tabanı (yukarıdan bakış; ön yukarıda, hastanın solu solda) ———
const TABAN_DIS =
  'M200,22 C262,22 304,64 310,128 C315,180 310,220 294,244 C274,268 238,276 200,276 C162,276 126,268 106,244 C90,220 85,180 90,128 C96,64 138,22 200,22 Z';
const KAVERNOZ_SOL = 'M183,95 C188,100 189,118 188,128 C187,134 180,137 175,133 C171,124 173,104 177,97 C179,94 181,94 183,95 Z';
const ON_INTERKAVERNOZ: Zincir = [
  [187, 102],
  [193, 97],
  [207, 97],
  [213, 102],
];
const ARKA_INTERKAVERNOZ: Zincir = [
  [188, 125],
  [194, 130],
  [206, 130],
  [212, 125],
];
const SFENOPARIETAL_SOL: Zincir = [
  [116, 84],
  [140, 86],
  [164, 90],
  [178, 97],
];
const UST_PETROZAL_SOL: Zincir = [
  [178, 132],
  [160, 146],
  [132, 170],
  [108, 196],
];
const ALT_PETROZAL_SOL: Zincir = [
  [182, 134],
  [176, 156],
  [160, 184],
  [148, 202],
];
const ENINE_SOL: Zincir = [
  [200, 262],
  [168, 266],
  [132, 258],
  [114, 240],
  [104, 228],
  [103, 212],
  [108, 196],
];
const SIGMOID_SOL: Zincir = [
  [108, 196],
  [104, 214],
  [116, 228],
  [128, 226],
  [138, 224],
  [142, 214],
  [146, 206],
];
/** Baziler ağ: iki alt petrozal sinüs arasında örülü kanallar (yalnızca şema). */
const BAZILER = [
  'M178,150 C190,146 196,154 200,150 C204,146 210,154 222,150',
  'M171,166 C184,162 194,170 200,166 C206,162 216,170 229,166',
  'M163,180 C178,177 192,184 200,180 C208,176 222,183 237,180',
  'M190,148 C194,156 186,166 192,174 M210,148 C206,156 214,166 208,174',
];

function TabanCizim({ secili, sec, akis }: CizimProps) {
  const s = (y: Yapi) => ({ secili: secili === y, akis, onSec: () => sec(y) });
  const yazi = (y: Yapi) => ({ kalin: secili === y, renk: secili === y ? 'var(--ink)' : 'var(--ink-2)', onClick: () => sec(y) });
  const iki = (z: Zincir, y: Yapi, w: number, ek: { kesik?: boolean; oklar?: number[] } = {}) => (
    <>
      <Damar z={z} w={w} {...ek} {...s(y)} />
      <Damar z={ayna(z)} w={w} {...ek} {...s(y)} />
    </>
  );
  const kavRenk = secili === 'kavernoz' ? SECILI : MAVI;
  const bazRenk = secili === 'baziler' ? SECILI : MAVI;
  return (
    <g>
      <path d={TABAN_DIS} fill="var(--surface-2)" stroke="var(--ink-3)" strokeWidth={1.5} />
      {/* Baziler ağ */}
      <g onClick={() => sec('baziler')} style={{ cursor: 'pointer' }}>
        {BAZILER.map((d) => (
          <path key={d} d={d} fill="none" stroke="transparent" strokeWidth={8} />
        ))}
        {BAZILER.map((d) => (
          <path key={`g${d}`} d={d} fill="none" stroke={bazRenk} strokeWidth={1.7} strokeLinecap="round" opacity={0.9} />
        ))}
      </g>
      {iki(SFENOPARIETAL_SOL, 'sfenoparietal', 2.6, { kesik: true, oklar: [0.55] })}
      {iki(ALT_PETROZAL_SOL, 'alt-petrozal', 3, { oklar: [0.55] })}
      {iki(UST_PETROZAL_SOL, 'ust-petrozal', 3, { oklar: [0.5] })}
      {iki(ENINE_SOL, 'enine', 5.5, { oklar: [0.25, 0.75] })}
      {iki(SIGMOID_SOL, 'sigmoid', 5, { oklar: [0.6] })}
      {/* Juguler delikler */}
      <ellipse cx={149} cy={204} rx={6} ry={4} transform="rotate(-35 149 204)" fill="var(--ink-2)" />
      <ellipse cx={251} cy={204} rx={6} ry={4} transform="rotate(35 251 204)" fill="var(--ink-2)" />
      {/* Hipofiz ve çevresindeki halka */}
      <circle cx={200} cy={113.5} r={9.5} fill="#f2a7b8" stroke="#d77a92" strokeWidth={1} />
      {/* İnterkavernöz sinüsler iki kavernöz sinüsü birbirine bağlar; çizimde yön oku ve akan nokta konmadı. */}
      <Damar z={ON_INTERKAVERNOZ} w={3.2} oklar={[]} {...s('interkavernoz')} akis={false} />
      <Damar z={ARKA_INTERKAVERNOZ} w={2.4} oklar={[]} {...s('interkavernoz')} akis={false} />
      <g onClick={() => sec('kavernoz')} style={{ cursor: 'pointer' }}>
        {[false, true].map((ay) => (
          <g key={String(ay)} transform={ay ? 'translate(400,0) scale(-1,1)' : undefined}>
            {secili === 'kavernoz' && <path d={KAVERNOZ_SOL} fill="none" stroke={SECILI} strokeOpacity={0.3} strokeWidth={6} />}
            <path d={KAVERNOZ_SOL} fill={kavRenk} stroke="var(--surface)" strokeWidth={1.4} />
          </g>
        ))}
      </g>
      <g onClick={() => sec('birlesme')} style={{ cursor: 'pointer' }}>
        {secili === 'birlesme' && <circle cx={200} cy={262} r={12} fill={SECILI} fillOpacity={0.28} />}
        <circle cx={200} cy={262} r={7.5} fill={secili === 'birlesme' ? SECILI : MAVI} stroke="var(--surface)" strokeWidth={1.6} />
      </g>
      {/* Yönler ve açıklama */}
      <Yazi x={200} y={14} bas="middle" renk="var(--ink-3)">
        ön
      </Yazi>
      <Yazi x={14} y={150} renk="var(--ink-3)">
        sol
      </Yazi>
      <Yazi x={386} y={150} bas="end" renk="var(--ink-3)">
        sağ
      </Yazi>
      <g>
        <circle cx={14} cy={14} r={5} fill="#f2a7b8" stroke="#d77a92" />
        <Yazi x={24} y={18}>
          hipofiz
        </Yazi>
        <ellipse cx={14} cy={32} rx={5.5} ry={3.6} fill="var(--ink-2)" />
        <Yazi x={24} y={36}>
          juguler delik
        </Yazi>
        <line x1={6} y1={50} x2={22} y2={50} stroke={MAVI} strokeWidth={2.6} strokeDasharray="5 4" />
        <Yazi x={26} y={54}>
          tartışmalı
        </Yazi>
      </g>
      {/* Etiketler */}
      <Gosterge a={[200, 84]} b={[200, 95]} />
      <Yazi x={200} y={80} bas="middle" {...yazi('interkavernoz')}>
        interkavernöz
      </Yazi>
      <Yazi x={168} y={118} bas="end" {...yazi('kavernoz')}>
        kavernöz
      </Yazi>
      <Gosterge a={[96, 85]} b={[114, 84]} />
      <Yazi x={94} y={89} bas="end" {...yazi('sfenoparietal')}>
        sfenoparietal
      </Yazi>
      <Yazi x={270} y={138} bas="middle" {...yazi('ust-petrozal')}>
        üst petrozal
      </Yazi>
      <Gosterge a={[238, 231]} b={[245, 194]} />
      <Yazi x={240} y={241} bas="middle" {...yazi('alt-petrozal')}>
        alt petrozal
      </Yazi>
      <Yazi x={200} y={199} bas="middle" {...yazi('baziler')}>
        baziler ağ
      </Yazi>
      <Gosterge a={[88, 213]} b={[103, 212]} />
      <Yazi x={86} y={217} bas="end" {...yazi('sigmoid')}>
        sigmoid
      </Yazi>
      <Gosterge a={[112, 266]} b={[133, 255]} />
      <Yazi x={110} y={272} bas="end" {...yazi('enine')}>
        enine
      </Yazi>
      <Gosterge a={[200, 283]} b={[200, 270]} />
      <Yazi x={200} y={294} bas="middle" {...yazi('birlesme')}>
        birleşme yeri
      </Yazi>
    </g>
  );
}

// ——— Köprü toplardamarları (soldan bakış) ———
/** Yarımkürenin yan yüzü (dış hat); üst kenarı sinüsün birkaç birim altında kalır. */
const YARIMKURE =
  'M86,150 C78,132 77,110 84,95 C98,68 128,55 165,53 C205,51 240,61 259,84 C276,105 281,132 278,158 C276,172 270,180 262,186 C248,184 232,186 216,190 C198,196 180,200 160,198 C138,196 122,186 112,174 C102,164 92,158 86,150 Z';
const USS_ORNEK = ornekle(USS);
/**
 * Sinüse açılış yerleri, üst sagital sinüs yayı boyunca oran olarak. Bu yayda bregma ~0,38, lambda ~0,74'e düşer;
 * 4 / 5 / 1 dağılımı Juskys ve ark. (2022) yüzdelerine (%41,9 / %53,3 / %4,7) yaklaşır.
 */
const KOPRU_ORAN = [0.12, 0.2, 0.27, 0.34, 0.42, 0.49, 0.56, 0.63, 0.7, 0.8];

/** Her toplardamar iki parça: beyin yüzeyindeki kısım ve sert zarı geçen kısa köprü. Arkadakiler öne doğru eğik girer. */
function kopru(oran: number): { yuzey: Zincir; kopru: Zincir } {
  const e = boyNoktasi(USS_ORNEK, oran);
  const tx = Math.cos(e.a);
  const ty = Math.sin(e.a);
  const nx = -ty;
  const ny = tx;
  const geri = Math.max(0, oran - 0.45) * 30;
  const egim = Math.max(0, oran - 0.4) * 90;
  const boy = oran < 0.18 || oran > 0.75 ? 34 : 44;
  const q: P = [e.x + nx * 14 + tx * geri, e.y + ny * 14 + ty * geri];
  const b: P = [q[0] + nx * boy * (egim ? 0.8 : 1) + tx * egim, q[1] + ny * boy * (egim ? 0.8 : 1) + ty * egim];
  const k1: P = [b[0] + (q[0] - b[0]) * 0.4 + nx * 3, b[1] + (q[1] - b[1]) * 0.4 - nx * 2];
  const k2: P = [q[0] + nx * 10 + tx * geri * 0.5, q[1] + ny * 10 + ty * geri * 0.5];
  const yuzey: Zincir = [b, k1, k2, q];
  const kopru: Zincir = [
    q,
    [q[0] + (e.x - q[0]) / 3, q[1] + (e.y - q[1]) / 3],
    [q[0] + ((e.x - q[0]) * 2) / 3, q[1] + ((e.y - q[1]) * 2) / 3],
    [e.x, e.y],
  ];
  return { yuzey, kopru };
}
const KOPRULER = KOPRU_ORAN.map(kopru);

function KopruCizim({ secili, sec, akis }: CizimProps) {
  const s = (y: Yapi) => ({ secili: secili === y, akis, onSec: () => sec(y) });
  const yazi = (y: Yapi) => ({ kalin: secili === y, renk: secili === y ? 'var(--ink)' : 'var(--ink-2)', onClick: () => sec(y) });
  return (
    <g>
      <path d={SILUET_DOLGU} fill="var(--surface-2)" />
      <path d={yolYaz(SILUET)} fill="none" stroke="var(--ink-3)" strokeWidth={1.5} strokeLinejoin="round" />
      <path d={BEYINCIK_YAN} fill={BEYIN} fillOpacity={0.16} stroke={BEYIN_KENAR} strokeOpacity={0.45} strokeWidth={1} />
      <path d={YARIMKURE} fill={BEYIN} fillOpacity={0.2} stroke={BEYIN_KENAR} strokeOpacity={0.55} strokeWidth={1.1} />
      {KOPRULER.map((k) => (
        <g key={k.kopru[3].join()}>
          <Damar z={k.yuzey} w={1.9} oklar={[0.5]} secili={false} akis={akis} onSec={() => sec('kopru')} />
          <Damar z={k.kopru} w={2.6} oklar={[]} {...s('kopru')} />
        </g>
      ))}
      <Damar z={USS} w={5} oklar={[0.2, 0.52, 0.86]} {...s('ust-sagital')} />
      <circle cx={276} cy={190} r={6} fill={MAVI} stroke="var(--surface)" strokeWidth={1.4} />
      <KafaNoktalari
        yazilar={{
          nasion: { x: 50, y: 136, bas: 'end' },
          bregma: { x: 150, y: 20, bas: 'middle' },
          lambda: { x: 296, y: 86, bas: 'start' },
          inion: { x: 298, y: 194, bas: 'start' },
        }}
      />
      <Yazi x={232} y={24} bas="middle" {...yazi('ust-sagital')}>
        üst sagital sinüs
      </Yazi>
      <Gosterge a={[194, 140]} b={[172, 50]} />
      <Yazi x={194} y={152} bas="middle" {...yazi('kopru')}>
        köprü toplardamarları
      </Yazi>
    </g>
  );
}

export function SinusHaritasi() {
  const azalt = useHareketAzaltilmis();
  const [ref, gorunur] = useGorunur<SVGSVGElement>();
  const [gorunum, setGorunum] = useState<Gorunum>('yandan');
  const [secim, setSecim] = useState<Record<Gorunum, Yapi>>(() => ({
    yandan: GORUNUM.yandan.ilk,
    kopru: GORUNUM.kopru.ilk,
    taban: GORUNUM.taban.ilk,
  }));
  const [akisIstegi, setAkisIstegi] = useState<boolean | null>(null);
  const akisAcik = akisIstegi ?? !azalt;
  const akis = akisAcik && gorunur;
  const g = GORUNUM[gorunum];
  const secili = secim[gorunum];
  const k = KART[secili];
  const sec = (y: Yapi) => setSecim((o) => ({ ...o, [gorunum]: y }));
  const ozellik: CizimProps = { secili, sec, akis };

  return (
    <div className="flex flex-col gap-4">
      <Secenekler
        etiket="Görünüm"
        deger={gorunum}
        onDegis={setGorunum}
        secenekler={(Object.keys(GORUNUM) as Gorunum[]).map((d) => ({ d, ad: GORUNUM[d].ad }))}
      />
      <svg
        ref={ref}
        viewBox={gorunum === 'taban' ? '0 0 400 300' : '0 0 400 296'}
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label={`${g.baslik}. ${g.bakis} Seçili yapı: ${k.ad}.`}
      >
        {gorunum === 'yandan' && <YandanCizim {...ozellik} />}
        {gorunum === 'kopru' && <KopruCizim {...ozellik} />}
        {gorunum === 'taban' && <TabanCizim {...ozellik} />}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="t-meta">{g.bakis}</p>
        <button type="button" className="beyin-secenek" onClick={() => setAkisIstegi(!akisAcik)}>
          {akisAcik ? 'Akışı durdur' : 'Akışı oynat'}
        </button>
      </div>
      <div aria-live="polite">
        <p className="font-semibold">{g.baslik}</p>
        <p className="text-[0.98rem]">{g.metin}</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Yapı seç">
        {g.yapilar.map((y) => (
          <button key={y} type="button" className="beyin-secenek" aria-pressed={secili === y} onClick={() => sec(y)}>
            {KART[y].kisa}
          </button>
        ))}
      </div>
      <div className="beyin-kutu flex flex-col gap-2" aria-live="polite">
        <p className="font-bold leading-snug">
          {k.ad}
          {k.la && (
            <span className="font-normal text-ink-3">
              {' '}
              · <i lang="la">{k.la}</i>
            </span>
          )}
        </p>
        {k.satirlar.map((s) => (
          <p key={s.b} className="text-[0.98rem]">
            <b>{s.b}:</b> {s.m}
          </p>
        ))}
        {k.olcu && (
          <div className="flex flex-col gap-1">
            <p className="t-small font-semibold">Ölçüler ve sayılar</p>
            <ul className="t-small flex list-disc flex-col gap-1 pl-5">
              {k.olcu.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        )}
        {k.cesit && (
          <div className="flex flex-col gap-1">
            <p className="t-small font-semibold">Kişiden kişiye</p>
            <ul className="t-small flex list-disc flex-col gap-1 pl-5">
              {k.cesit.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
