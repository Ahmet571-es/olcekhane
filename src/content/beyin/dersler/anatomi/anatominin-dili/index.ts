import type { Ders } from '../../../types';
import { durusVeYonler } from './bolum-01-yonler';
import { sinirEkseni } from './bolum-02-eksenler';
import { duzlemlerVeKesitler } from './bolum-03-duzlemler';
import { simetriVeOlcek } from './bolum-04-simetri-olcek';
import { goruntudeYon } from './bolum-05-goruntude-yon';
import { koordinatSistemleri } from './bolum-06-koordinatlar';
import { tarafHatalari } from './bolum-07-taraf-hatalari';
import { yuzeydenBeyin } from './bolum-08-yuzeyden-beyin';
import { terimlerinKokeni } from './bolum-09-terimler';
import { kaynaklar } from './kaynaklar';
import { sorular } from './sorular';
import { sozluk } from './sozluk';

/**
 * Anatomi 2: Anatominin dili: beyinde yön bulmak. Üç düzeyli ders (Temel, Lisans, Uzman); bilgiler açık erişimli ders
 * kitaplarından (Gray 1918, OpenStax, UTHealth, TA2), açık belgelerden (NiBabel, DICOM, DSÖ) ve makalelerin tam
 * metinlerinden alındı. Bölümler ayrı dosyalardadır.
 */
export const anatomininDili: Ders = {
  dal: 'anatomi',
  slug: 'anatominin-dili',
  sira: 2,
  seviye: 'temel',
  baslik: 'Anatominin dili: beyinde yön bulmak',
  aciklama:
    'Beyinde yön bulmanın dili: anatomik duruş, beynin ekseni, düzlemler ve kesitler, MR ve BT’de sağ-sol, koordinatlar, taraf hataları ve terimlerin kökeni.',
  giris:
    'Bir yapının yerini söylemek için herkesin aynı dili konuşması gerekir. Bu derste o dili öğreniyoruz. Anatomik duruş nedir? Beyinde “üst” ile “ön” neden omurilikteki gibi değildir? Beyin hangi düzlemlerde kesilir, kesite nereden bakılır? MR ve BT görüntüsünde hastanın sağı ekranın neresindedir? Bir noktanın beyindeki adresi sayıyla nasıl yazılır? Sağ ile sol karışınca ne olur? Kafanın dışından beynin yapıları nasıl bulunur? Terimler nereden gelir? Temel ile başla; hazır olduğunda Lisans ve Uzman düzeylerinde ders kitaplarının ayrıntısına, birbirini tutmayan kaynaklara, hasta vakalarına, görüntülemeye ve beyin cerrahisine geç.',
  hedefler: [
    'Anatomik duruşu ve zıt yön çiftlerini (üst–alt, ön–arka, iç yan–dış yan, yüzeysel–derin, aynı taraf–karşı taraf) doğru kullanmak',
    'Beyinde ve omurilikte rostral, kaudal, dorsal ve ventral sözcüklerinin neden farklı yönleri gösterdiğini açıklamak',
    'Sagital, koronal ve aksiyel düzlemleri ayırt etmek ve kesitleri üç boyutlu modelde bulmak',
    'MR ve BT görüntüsünde hastanın sağını ve solunu doğru okumak',
    'Bir terimi köklerine ayırarak anlamını çıkarmak ve sık geçen tekil–çoğul biçimleri tanımak',
    { metin: 'TA2’deki resmî yön ve düzlem adlarını ve Türkçe karşılıklarını kullanmak', duzey: 'lisans' },
    { metin: 'Radyolojik ve nörolojik gösterimi, klinik başvuru çizgilerini ve eğik kesitleri açıklamak', duzey: 'lisans' },
    { metin: 'RAS+ ve LPS+ koordinat kurallarını, Talairach ve MNI uzaylarını ve AC–PC çizgisini tanımak', duzey: 'lisans' },
    {
      metin: 'Taraf hatalarının sıklığını, nedenlerini ve önlemlerini (taraf işaretleme, kontrol listesi) değerlendirmek',
      duzey: 'lisans',
    },
    {
      metin: 'Kafa yüzeyinden merkezî oluğu, lateral oluğu ve karıncıkları bulma yöntemlerini ve doğruluklarını karşılaştırmak',
      duzey: 'lisans',
    },
    {
      metin: 'Forel ve Meynert eksenlerini, stereotaksik çerçeve koordinatlarını ve derin beyin uyarımı hedeflerinin yazılışını açıklamak',
      duzey: 'ileri',
    },
    { metin: 'Atlasların kesit düzlemlerini, asimetri ölçümlerini ve ölçek farklarını eleştirel okumak', duzey: 'ileri' },
    {
      metin: 'Anatomi terminolojisinin tarihini (BNA’dan TA2’ye) ve kaynaklar arasındaki tarih ve tanım çelişkilerini tartışmak',
      duzey: 'ileri',
    },
  ],
  bolumler: [
    durusVeYonler,
    sinirEkseni,
    duzlemlerVeKesitler,
    simetriVeOlcek,
    goruntudeYon,
    koordinatSistemleri,
    tarafHatalari,
    yuzeydenBeyin,
    terimlerinKokeni,
  ],
  sozluk,
  sorular,
  kaynaklar,
  yayin: '2026-10-09',
  guncelleme: '2026-10-09',
};
