import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** 10. bölüm: kemikler birlikte: kalınlık haritası, güç hatları, yaşla değişim, cinsiyet izleri ve pin güvenliği. */
export const kemiklerBirlikte: DersBolumu = {
  id: 'kemikler-birlikte',
  baslik: 'Kemikler birlikte: kalınlık, yaş ve cinsiyet izleri',
  bloklar: [
    {
      tur: 'metin',
      md: `Kemikleri tek tek tanıdıktan sonra bütüne dönelim. Kafatası her yerde aynı kalınlıkta değildir. Gray bunu bir kuralla anlatır: darbeye açık yerler kalındır; kaslarla örtülü, korunaklı yerler incedir. Şakak kası altındaki şakak kemiğinin pul kısmı ve ense kaslarıyla örtülü art kafa kemiğinin alt çukurları bu yüzden ince ve kırılgandır (Gray, 1918).

Güncel bir derleme de aynı tabloyu verir: kafatası en kalın tam arkada ve tam önde, ardından arka-yanda ve ön-yanda; **en ince yeri tam yanda, şakak çukuru boyuncadır** (Bauer ve ark., 2024). Genel bakış dersindeki pterion ve orta meningeal arter ilişkisi, bu ince yan duvarın neden önemli olduğunu da açıklar.`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Yatay bir düzlemde kafatası kalınlığı',
      ogeler: [
        { deger: '3,1–3,2', birim: 'mm', aciklama: 'En ince bölge: yan bölgenin ön kısmı, sol ve sağ ortalaması' },
        { deger: '10,6–11,3', birim: 'mm', aciklama: 'En kalın bölge: arka-orta bölge, sol ve sağ ortalaması' },
        {
          deger: '15',
          aciklama:
            'Erişkin kuru kafatası; ölçüm önde göz çukuru üst kenarının, arkada dış art kafa çıkıntısının 2 cm üstünden geçen yatay düzlemde',
        },
      ],
      not: 'Doğu Hindistan’da yapılan bu çalışmada kalınlık önden yana doğru azalıyor, sonra arkaya doğru yeniden artıyordu (Gupta ve ark., 2025). Örneklem küçüktür; geniş bir erişkin BT kalınlık haritasının açık tam metnine ulaşılamadı.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Kalın:** tam önde (alın) ve tam arkada (art kafa).\n\n**İnce:** tam yanda, şakak çukurunda; şakak kemiğinin pul kısmı ve ense kaslarının örttüğü art kafa kemiğinin alt çukurları.\n\n**Neden?** Kaslarla korunan yer ince, darbeye açık yer kalın kalır.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Gray’in “direnç merkezi”.** Gray 1918’e göre kafa tabanında, ön ile orta ve orta ile arka çukurları ayıran sırtlar birer payanda gibi çalışır; kubbeye bir darbe geldiğinde titreşim bu payandalar boyunca Türk eyerine taşınır ve orada buluşur. Gray bu bölgeyi “direnç merkezi” olarak anar. Darbe kafa tabanına geldiğinde, örneğin ayak üstüne düşmede, titreşim arkada art kafa kristası, önde art kafa kemiğinin baziler kısmı ve kama gövdesi yoluyla kubbeye taşınır (Gray, 1918). Bu, yüz yıllık mekanik bir yorumdur; kafa tabanı kırıklarının güncel sınıflaması ve görüntülemesi ünitenin 6. dersinde işleniyor.`,
    },

    // ——— Yaşla ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Doğumdan yaşlılığa.** Doğumda alın ve yan kafa tümsekleri belirgindir ve kafatasının en geniş yeri yan kafa tümsekleri hizasındadır; buna karşılık glabella, kaş kemerleri ve mastoid çıkıntılar henüz gelişmemiştir (Gray, 1918). Kafatası doğumdan 7 yaşına kadar hızla büyür; bu yaşta foramen magnum ve şakak kemiklerinin kayalık kısımları erişkin boyutuna ulaşmıştır. Ergenlikteki ikinci büyüme atağı özellikle alın ve yüz bölgesinde belirgindir ve hava sinüslerinin gelişmesiyle birlikte yürür (Gray, 1918).

Gray’e göre kubbedeki dikişlerin silinmesi 30–40 yaşları arasında başlayabilir; önce iç yüzde, yaklaşık on yıl sonra dış yüzde görülür (Gray, 1918). Dikişlerin kaynaşmasına ilişkin güncel BT verileri genel bakış dersinde, gelişim ve hastalıklar ünitenin 5. dersinde.`,
    },

    // ——— Cinsiyet ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Erkek ve kadın kafatası.** Gray, erişkin kadında glabella, kaş kemerleri ve mastoid çıkıntıların daha az belirgin, karşılık gelen hava sinüslerinin daha küçük olduğunu; göz çukurunun üst kenarının keskin, alnın dik, alın ve yan kafa tümseklerinin belirgin olduğunu yazar (Gray, 1918).

Adli antropolojide yaygın kullanılan **Walker yöntemi** bu farklara dayanır: glabella, göz çukurunun üst kenarı, ense kristası, mastoid çıkıntı ve çene çıkıntısı olmak üzere beş özelliğe bakılır ve her biri 1 (en kadınsı) ile 5 (en erkeksi) arasında puanlanır (Houston ve ark., 2025). Bu beş özellik bu dersin dört ayrı bölümüne dağılır: ikisi alın kemiğinde, biri art kafa kemiğinde, biri şakak kemiğinde, biri alt çenededir. Walker standardı Kuzey Amerika ve Britanya örneklerinde %89 doğruluk sağlamıştır (Wang ve ark., 2024).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Walker’ın beş özelliği tek kafatasında',
      aciklama:
        'Kafatasına önden ve soldan, biraz yukarıdan bakıyoruz. İşaretli noktalar Walker yönteminin puanladığı beş bölgedir: glabella ve göz çukurunun üst kenarı (turuncu alın kemiği), mastoid çıkıntı (yeşil şakak kemiği), çene çıkıntısı (alt çene) ve ense kristası (mor art kafa kemiği; inion çevresi). Ense kristasının noktası arkadan görünür: kafatasını arkaya doğru döndür.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'egik',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['alt-cene-kemigi'], renk: KEMIK_RENGI.altCene },
        ],
        noktalar: [
          { nokta: 'glabella' },
          { nokta: 'supraorbital-kenar-sol' },
          { nokta: 'mastoid-cikinti-sol' },
          { nokta: 'cene-cikintisi' },
          { nokta: 'dis-art-kafa-cikintisi', metin: 'Ense kristası (inion çevresi)' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Cinsiyet tahmini neden topluma ve yaşa özgü olmalı?',
      md: `- **Toplum farkı:** İtalya’da 177 kişilik bir örnekte Walker denklemleri kadınlarda yalnızca %56–78 doğru sınıflama yaptı; o topluma özgü modellerle kadınlarda doğruluk %91,7’ye kadar çıktı ve en doğru model glabella ile mastoid çıkıntıyı birlikte kullanandı (Cappella ve ark., 2022). Güney Afrika’da 408 BT’de topluma özgü modellerle doğru sınıflama %88,0–95,7 arasındaydı (Krüger ve ark., 2024).
- **Yaş farkı:** Kadınlarda menopozdan sonra bu özellikler erkeksi yöne kayar; bu yüzden 55 yaşın üstündeki kadınlarda kafatasından cinsiyet tahmini yapılmaması önerilmiştir. Walker özelliklerinden ense kristası ilk olgunlaşır, mastoid çıkıntı en son olgunlaşanlardandır; kafa tabanı yüzden önce olgunlaştığı için cinsiyet farkı tabanda daha zayıftır (Houston ve ark., 2025).
- **Ölçüler:** Bir derlemeye göre mastoid ölçüleriyle bir İran çalışmasında %97,5 doğruluk (eğitim verisinde; sınama verisinde %96,9) bildirilirken Kore’de üç boyutlu BT ile mastoid hacmi yalnızca %73,0 doğruluk verdi; iki elmacık kemeri arasındaki genişlik Türkiye dahil birçok toplumda en güvenilir ölçülerdendir (%77,2–89,2). Bütün kafatasının yüzey modeliyle %90,6, alt çenesiz kafatasıyla %90,7, yalnızca alt çeneyle %84,1 doğruluk aktarılmıştır (Wang ve ark., 2024).`,
    },

    // ——— Pin güvenliği ———
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kafatasına pin takarken kalınlık haritası',
      md: `Boyun kırıklarında kullanılan halo ve ameliyatta başı sabitleyen üç noktalı başlık, pinleri doğrudan kafatasının dış tablasına dayar.

- **Yer:** Tam öne pin konmaz, çünkü frontal sinüs ve göz üstü siniri oradadır; arka-yan pinler alçak konursa mastoid hava hücrelerine girer (Bauer ve ark., 2024). Pinler kırığa yatkın bölgelerden, burun çevresi sinüslerinden ve venöz sinüslerden uzak tutulmalıdır (da Silva ve ark., 2024).
- **Kuvvet:** Erişkinde halo pinleri genellikle 6–8 inç-libre torkla sıkılır; çocuklarda en az 6 pin, 6 yaşın altında 8’den fazla pin önerilir (Bauer ve ark., 2024). Ameliyatta üç noktalı başlıkta erişkinde 60–80 libre kuvvet uygulanır (da Silva ve ark., 2024).
- **Delinme riski:** Japonya’da halo takılan 66 erişkinin 4’ünde (%6) pin kafatasını deldi; nedenler ileri yaş, kadın cinsiyet ve osteoporozla incelmiş dış ve iç tablalardı. Belirleyici olan toplam kalınlık değil tablaların kalınlığıydı: sağ önde dış tabla delinen grupta 1,58 mm, delinmeyen grupta 2,12 mm’ydi (Hamanaka ve ark., 2024).
- **Çocukta:** Aktarılan bir seride pin tespitli kraniotomi yapılan 766 çocuğun 5’inde (%0,65) pine bağlı çökme kırığı ve/veya epidural hematom gelişti; risk etkenleri arka çukur tümörü, şakak bölgesine pin, uzun ameliyat, hidrosefali ve 7 yaşın altı idi (da Silva ve ark., 2024).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Halo yeleğinden sonra başlayan baş ağrısı',
      oyku: '78 yaşında, osteoporozu bilinen bir kadın düşme sonrası boyun omuru kırığı nedeniyle halo yeleğiyle tedavi ediliyor. Pinlerden ikisi alnın iki yanına, ikisi kulakların arka-üstüne yerleştirilmiş. İkinci haftada sağ ön pin bölgesinde ağrı ve akıntı başlıyor; pin gevşemiş görünüyor. Hasta baş ağrısından da yakınıyor.',
      soru: 'Bu hastada pin sorununun anatomik nedeni ne olabilir ve pin yerleşiminde nelere dikkat edilmelidir?',
      cozum: `**Neden:** Halo pinleri kafatasının dış tablasına dayanır. Japonya’daki 66 erişkinlik seride pin delinmesi %6 oranında görüldü ve ileri yaş, kadın cinsiyet ve osteoporozla incelmiş dış ve iç tablalarla ilişkiliydi; belirleyici olan toplam kemik kalınlığı değil, sağ önde ölçülen dış tabla kalınlığıydı (1,58 mm’ye karşı 2,12 mm) (Hamanaka ve ark., 2024). Aynı makalenin aktardığı serilerde pin gevşemesi %36, pin yeri enfeksiyonu %20, dura delinmesi %1 bildirilmiştir (Hamanaka ve ark., 2024). Ağrı, akıntı ve gevşeme pin yeri sorununu düşündürür; baş ağrısı ise delinme açısından görüntülemeyle değerlendirilmelidir.

**Yerleşim:** Kafatası en ince tam yanda, şakak çukuru boyuncadır. Tam öne pin konmaz (frontal sinüs ve göz üstü siniri); arka-yan pinler alçak konursa mastoid hava hücrelerine girer; erişkinde tork genellikle 6–8 inç-libredir (Bauer ve ark., 2024). Yaşlı ve osteoporozlu kadınlarda dış tablanın inceliği ayrıca göz önünde tutulmalıdır (Hamanaka ve ark., 2024).

*Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
