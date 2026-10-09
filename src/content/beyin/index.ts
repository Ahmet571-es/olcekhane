import { sinirSistemineIlkBakis } from './dersler/anatomi/sinir-sistemine-ilk-bakis';
import type { Dal, DalId, Ders, ProgramDersi, Seviye } from './types';

export type { Dal, DalId, Ders, Seviye } from './types';
export { SEVIYE_ADLARI, SEVIYE_KITLESI } from './types';

/**
 * Beyin Akademisi'nin programı: 8 bölüm; 2026-10-08'de onaylanan 100 derslik harita. 2026-10-09'da site sahibinin
 * kararıyla bölüm yalnızca beyni anlatır: kafatası dersleri yayından kaldırıldı (klasörleri `dersler/anatomi/kafatasi*`
 * altında saklı, istenirse geri gelir), sinir sistemi ünitesinden yalnızca "Anatominin dili" kaldı. Her işlemede bir
 * ders hazırlanır. Hazır dersin içeriği `ders` alanındadır; olmayanlar programda "Hazırlanıyor" diye görünür, kendi
 * sayfaları açılmaz ve site haritasına girmez.
 */
const HAZIR: Ders[] = [sinirSistemineIlkBakis];

type Satir = [slug: string, baslik: string, ozet: string, seviye: Seviye];

function program(dal: DalId, satirlar: Satir[]): ProgramDersi[] {
  return satirlar.map(([slug, baslik, ozet, seviye], i) => ({
    sira: i + 1,
    slug,
    baslik,
    ozet,
    seviye,
    ders: HAZIR.find((d) => d.dal === dal && d.slug === slug),
  }));
}

export const DALLAR: Dal[] = [
  {
    id: 'anatomi',
    sira: 1,
    ad: 'Beyin ve Sinir Sistemi Anatomisi',
    kisaAd: 'Anatomi',
    renk: '#4f7cf0',
    aciklama:
      'Beyni oluşturan bütün yapılar: loblar ve kıvrımlar, derin çekirdekler, beyin sapı, beyincik, karıncıklar, zarlar, damarlar, kafa sinirleri, omurilik ve sinir yolları. Her ders gerçek bir beyin modeli üzerinde.',
    program: program('anatomi', [
      ['sinir-sistemine-ilk-bakis', 'Sinir sistemine ilk bakış', 'Haritanın tamamı: sinir sistemi ne yapar, sinir dokusu, beynin bölümleri ve gelişimi, loblar, omurilik ve sinirler, beyni koruyanlar ve besleyenler.', 'temel'],
      ['anatominin-dili', 'Anatominin dili: beyinde yön bulmak', 'Yönler, beynin iki ekseni, kesit düzlemleri ve terimlerin kuruluşu; MR ve BT görüntülerinde yön bulma.', 'temel'],
      ['beyin-zarlari', 'Beyin zarları ve zarlar arası boşluklar', 'Sert zar, örümcek ağı zar ve yumuşak zar; kıvrımları ve boşlukları.', 'lisans'],
      ['karinciklar-ve-beyin-omurilik-sivisi', 'Karıncıklar ve beyin-omurilik sıvısı', 'Dört karıncık; sıvının yapılışı, dolaşımı ve emilmesi.', 'lisans'],
      ['beynin-atardamarlari', 'Beynin atardamarları ve Willis halkası', 'Karotis ve vertebrobaziler sistem; halkanın parçaları.', 'lisans'],
      ['damar-alanlari-ve-toplardamarlar', 'Atardamar alanları ve toplardamarlar', 'Hangi atardamar nereyi besler; toplardamar sinüsleri ve kan-beyin engeli.', 'ileri'],
      ['beyin-nasil-olusur', 'Beyin nasıl oluşur?', 'Sinir borusundan beyne: keseciklerin yetişkin beyindeki karşılıkları.', 'lisans'],
      ['buyuk-beyin', 'Büyük beyin: yarımküreler, yarıklar, kıvrımlar', 'Yarımkürelerin yüzleri, büyük yarıklar ve oluklar, lobların sınırları.', 'temel'],
      ['frontal-lob', 'Frontal (alın) lob', 'Hareket kabuğu, prefrontal kabuk, Broca alanı ve göz alanları.', 'lisans'],
      ['parietal-lob', 'Parietal (yan kafa) lob', 'Bedensel duyu kabuğu ve duyuların birleştirilmesi.', 'lisans'],
      ['temporal-lob', 'Temporal (şakak) lob', 'İşitme kabuğu, Wernicke alanı ve görsel tanıma.', 'lisans'],
      ['oksipital-lob', 'Oksipital (art kafa) lob', 'Birincil ve ikincil görme alanları.', 'lisans'],
      ['insula-ve-limbik-lob', 'İnsula ve limbik lob', 'Yan yarığın derinindeki lob ve iç yüzdeki kuşak.', 'lisans'],
      ['beyin-kabugunun-yapisi', 'Beyin kabuğunun yapısı', 'Altı katman, hücre tipleri, sütunlar ve Brodmann alanları.', 'ileri'],
      ['beyaz-cevher-ve-lif-yollari', 'Beyaz cevher ve lif yolları', 'Komissür, bağlantı ve projeksiyon lifleri; korpus kallozum ve iç kapsül.', 'lisans'],
      ['bazal-cekirdekler', 'Bazal çekirdekler', 'Striatum, globus pallidus, subtalamik çekirdek ve substantia nigra.', 'lisans'],
      ['talamus', 'Talamus', 'Çekirdek grupları ve kabuğa açılan kapılar.', 'ileri'],
      ['hipotalamus-hipofiz-epifiz', 'Hipotalamus, hipofiz ve epifiz', 'Vücudun iç dengesinin ve hormonların yönetim merkezi.', 'lisans'],
      ['hipokampus-ve-amigdala', 'Hipokampus ve amigdala', 'Bellek ve duygunun temporal lobdaki merkezleri.', 'lisans'],
      ['orta-beyin', 'Orta beyin', 'Tepecikler, beyin sapçıkları, substantia nigra ve kırmızı çekirdek.', 'lisans'],
      ['pons', 'Pons', 'Beyinciğe köprü; çekirdekleri ve yolları.', 'lisans'],
      ['omurilik-sogani', 'Omurilik soğanı', 'Yaşamsal merkezler, piramitler ve olivler.', 'lisans'],
      ['beyin-sapi-kesitleri', 'Beyin sapı kesitleri ve retiküler formasyon', 'Sınavların vazgeçilmezi: dört düzeyde kesit ve içlerindeki yapılar.', 'ileri'],
      ['kafa-sinirleri-1', 'Kafa sinirleri I: I–VI', 'Koku, görme ve göz hareketlerinin sinirleri.', 'lisans'],
      ['kafa-sinirleri-2', 'Kafa sinirleri II: VII–XII', 'Yüz, işitme ve denge, yutma, konuşma ve dil hareketlerinin sinirleri.', 'lisans'],
      ['beyincik', 'Beyincik', 'Lobları, katmanları, çekirdekleri ve sapçıkları.', 'lisans'],
      ['omurilik', 'Omurilik', 'Bölümleri, gri ve beyaz cevheri, kökleri ve zarları.', 'lisans'],
      ['cikan-duyu-yollari', 'Çıkan duyu yolları', 'Arka kolon, spinotalamik ve spinoserebellar yollar.', 'ileri'],
      ['inen-hareket-yollari', 'İnen hareket yolları', 'Kortikospinal ve kortikobulber yollar; üst ve alt motor nöron.', 'ileri'],
      ['kesit-anatomisi', 'Kesit anatomisi: MR ve tomografide beyin', 'Aksiyel, koronal ve sagital kesitlerde yapıları tanımak.', 'ileri'],
    ]),
  },
  {
    id: 'hucre-ve-molekul',
    sira: 2,
    ad: 'Hücreden Sinyale: Hücresel ve Moleküler Nörobilim',
    kisaAd: 'Hücre ve molekül',
    renk: '#7a4ee6',
    aciklama:
      'Nöron ve glia, iyon kanalları, sinir sinyali, sinaps, alıcılar ve kimyasal haberciler; nöronların nasıl hesap yaptığı ve sinapsların nasıl güçlendiği.',
    program: program('hucre-ve-molekul', [
      ['noron', 'Nöron: beynin temel hücresi', 'Gövde, dendritler, akson, uç düğmeleri; nöron çeşitleri.', 'temel'],
      ['glia', 'Glia hücreleri', 'Astrosit, oligodendrosit, mikroglia, ependim ve Schwann hücreleri.', 'temel'],
      ['dinlenim-gerilimi', 'Hücre zarı, iyonlar ve dinlenim gerilimi', 'Sodyum-potasyum pompası ve nöronun içindeki eksi yük.', 'lisans'],
      ['iyon-kanallari', 'İyon kanalları', 'Gerilime, kimyasala ve mekanik uyarıya duyarlı kanallar.', 'lisans'],
      ['sinir-sinyali', 'Sinir sinyali: aksiyon potansiyeli', 'Eşik, ya hep ya hiç kuralı, refrakter dönem.', 'lisans'],
      ['miyelin-ve-iletim-hizi', 'Miyelin ve iletim hızı', 'Ranvier boğumları ve sıçrayarak iletim.', 'lisans'],
      ['sinaps', 'Sinaps: nöronlar nasıl konuşur?', 'Kimyasal ve elektriksel sinapslar.', 'temel'],
      ['habercinin-salinmasi', 'Habercinin salınması', 'Kesecikler, kalsiyum ve habercinin geri alınması.', 'ileri'],
      ['alicilar', 'Alıcılar', 'İyon kanalı alıcıları ve G proteinine bağlı alıcılar.', 'ileri'],
      ['glutamat-ve-gaba', 'Glutamat ve GABA', 'Beynin ana uyarıcı ve baskılayıcı habercileri.', 'lisans'],
      ['asetilkolin-ve-monoaminler', 'Asetilkolin ve monoaminler', 'Dopamin, noradrenalin ve serotonin sistemleri.', 'lisans'],
      ['noropeptidler', 'Nöropeptidler ve diğer haberciler', 'Endorfinler, endokannabinoidler ve gaz haberciler.', 'ileri'],
      ['sinir-kas-kavsagi', 'Sinir-kas kavşağı', 'Nöronun kasa komut verdiği özel sinaps.', 'lisans'],
      ['sinaptik-butunlestirme', 'Nöron nasıl karar verir?', 'Uyarıcı ve baskılayıcı sinyallerin toplanması.', 'ileri'],
      ['sinaptik-esneklik', 'Sinaptik esneklik', 'Uzun süreli güçlenme ve zayıflama: öğrenmenin hücresel temeli.', 'ileri'],
      ['beynin-enerjisi', 'Beynin enerjisi ve metabolizması', 'Glikoz, oksijen ve beynin enerji bütçesi.', 'lisans'],
    ]),
  },
  {
    id: 'sistemler',
    sira: 3,
    ad: 'Duyular, Hareket ve Beden: Sistem Nörobilimi',
    kisaAd: 'Sistemler',
    renk: '#0e9c8c',
    aciklama:
      'Duyu almaçlarından kabuğa bütün duyular, hareketin planlanıp uygulanması, otonom sistem, hormonlar ve uyku. Sinyalin bedende izlediği yollar canlandırmalarla.',
    program: program('sistemler', [
      ['duyularin-ortak-dili', 'Duyuların ortak dili', 'Almaçlar, uyarının sinyale çevrilmesi ve kodlama.', 'lisans'],
      ['gorme-1', 'Görme I: göz ve retina', 'Işığın sinyale dönüşmesi; çubuklar ve koniler.', 'lisans'],
      ['gorme-2', 'Görme II: görme yolu ve görme kabuğu', 'Kiazmadan görme kabuğuna; görme alanı kayıpları.', 'lisans'],
      ['isitme', 'İşitme', 'Kulaktan işitme kabuğuna sesin yolculuğu.', 'lisans'],
      ['denge', 'Denge', 'İç kulak, vestibüler çekirdekler ve göz-baş uyumu.', 'lisans'],
      ['dokunma-ve-vucut-duyusu', 'Dokunma ve vücut duyusu', 'Dokunma, titreşim, konum duyusu ve bedenin kabuktaki haritası.', 'lisans'],
      ['agri', 'Ağrı ve ağrının kontrolü', 'Ağrı yolları, kapı kontrolü ve beynin kendi ağrı kesicileri.', 'lisans'],
      ['tat-ve-koku', 'Tat ve koku', 'Kimyasal duyular ve talamusu atlayan koku.', 'lisans'],
      ['omurilik-refleksleri', 'Omurilik refleksleri', 'Germe refleksi, çekme refleksi ve refleks yayı.', 'temel'],
      ['hareket-kabugu', 'Hareket kabuğu ve hareketin planlanması', 'Birincil ve ikincil hareket alanları.', 'lisans'],
      ['hareketin-ince-ayari', 'Hareketin ince ayarı', 'Bazal çekirdekler ve beyincik hareketi nasıl düzenler?', 'ileri'],
      ['goz-hareketleri', 'Göz hareketleri', 'Sıçramalar, izleme ve bakış merkezleri.', 'ileri'],
      ['otonom-sinir-sistemi', 'Otonom sinir sistemi', 'Sempatik ve parasempatik sistem; organlara etkileri.', 'temel'],
      ['hipotalamus-ve-hormonlar', 'Hipotalamus, hormonlar ve iç denge', 'Açlık, susuzluk, vücut ısısı ve stres yanıtı.', 'lisans'],
      ['uyku-ve-biyolojik-saat', 'Uyku, uyanıklık ve biyolojik saat', 'Uyku evreleri, gece-gündüz ritmi ve melatonin.', 'temel'],
    ]),
  },
  {
    id: 'zihin-ve-davranis',
    sira: 4,
    ad: 'Zihin ve Davranış: Bilişsel Nörobilim ve Psikoloji',
    kisaAd: 'Zihin ve davranış',
    renk: '#df4777',
    aciklama:
      'Dikkat, bellek, öğrenme, dil, duygular, motivasyon, karar verme, planlama, sosyal beyin ve bilinç: düşünce ve davranışın beyindeki temelleri.',
    program: program('zihin-ve-davranis', [
      ['dikkat', 'Dikkat', 'Uyanıklık, seçici dikkat ve dikkat ağları.', 'temel'],
      ['calisma-bellegi', 'Çalışma belleği', 'Aklımızda tuttuklarımız ve sınırları.', 'temel'],
      ['uzun-sureli-bellek', 'Uzun süreli bellek türleri', 'Olay, anlam ve beceri belleği.', 'temel'],
      ['bellek-nasil-olusur', 'Bellek nasıl oluşur ve pekişir?', 'Kodlama, pekiştirme, uyku ve hatırlama.', 'lisans'],
      ['ogrenme', 'Öğrenme: koşullanma, ödül ve alışkanlık', 'Öğrenmenin farklı yolları ve beyindeki karşılıkları.', 'lisans'],
      ['dil', 'Dil', 'Konuşmayı anlamak ve üretmek; dil ağları ve afaziler.', 'lisans'],
      ['duygular', 'Duygular', 'Amigdala, insula ve duyguların bedenle ilişkisi.', 'lisans'],
      ['motivasyon-ve-odul', 'Motivasyon ve ödül sistemi', 'Dopamin, istek ve hoşlanma.', 'lisans'],
      ['karar-verme', 'Karar verme', 'Değer biçme, risk ve seçim.', 'ileri'],
      ['yurutucu-islevler', 'Yürütücü işlevler', 'Planlama, kendini durdurma ve esneklik; prefrontal kabuk.', 'lisans'],
      ['sosyal-beyin', 'Sosyal beyin', 'Yüz tanıma, başkalarının zihnini anlama ve empati.', 'lisans'],
      ['bilinc', 'Bilinç', 'Uyanıklık, farkındalık ve bilincin beyindeki izleri.', 'ileri'],
    ]),
  },
  {
    id: 'yasam-boyu',
    sira: 5,
    ad: 'Yaşam Boyu Beyin',
    kisaAd: 'Yaşam boyu',
    renk: '#ee6a36',
    aciklama: 'Anne karnından yaşlılığa beynin gelişimi, değişimi ve kendini onarma gücü.',
    program: program('yasam-boyu', [
      ['anne-karninda-beyin', 'Anne karnında beyin', 'Nöronların doğuşu, göçü ve ilk bağlantılar.', 'lisans'],
      ['bebeklik-ve-cocukluk', 'Bebeklik ve çocukluk', 'Sinaps patlaması, budama ve kritik dönemler.', 'temel'],
      ['ergen-beyni', 'Ergen beyni', 'Miyelinleşme, ödül sistemi ve prefrontal kabuğun olgunlaşması.', 'temel'],
      ['yaslanan-beyin', 'Yetişkinlik ve yaşlanan beyin', 'Sağlıklı yaşlanma ve bilişsel rezerv.', 'temel'],
      ['noroplastisite', 'Beyin değişebilir mi?', 'Nöroplastisite, onarım ve rehabilitasyon.', 'lisans'],
    ]),
  },
  {
    id: 'klinik',
    sira: 6,
    ad: 'Klinik Nörobilim',
    kisaAd: 'Klinik',
    renk: '#c23a30',
    aciklama:
      'Sinir sistemi hastalıklarının anatomik ve hücresel temeli: nörolojik muayenenin mantığı, inme, epilepsi, hareket bozuklukları, bunamalar, MS ve ruhsal bozuklukların beyindeki izleri. Eğitim amaçlıdır; tanı ya da tedavi önerisi değildir.',
    program: program('klinik', [
      ['norolojik-muayene', 'Nörolojik muayenenin mantığı', 'Belirtiden yere: hasar nerede?', 'ileri'],
      ['inme', 'İnme', 'Damar tıkanması ve kanama; damar alanlarına göre belirtiler.', 'ileri'],
      ['epilepsi', 'Epilepsi', 'Nöbetin hücresel ve ağ düzeyinde temeli.', 'ileri'],
      ['bas-agrilari', 'Baş ağrıları', 'Migren ve gerilim tipi baş ağrısının mekanizmaları.', 'lisans'],
      ['beyin-travmasi', 'Beyin travması ve sarsıntı', 'Darbe beyinde ne yapar?', 'lisans'],
      ['parkinson-ve-hareket-bozukluklari', 'Parkinson hastalığı ve hareket bozuklukları', 'Bazal çekirdek devrelerinin bozulması.', 'ileri'],
      ['alzheimer-ve-bunamalar', 'Alzheimer hastalığı ve bunamalar', 'Beyinde biriken proteinler ve bellek kaybı.', 'ileri'],
      ['multipl-skleroz', 'Multipl skleroz ve beyaz cevher hastalıkları', 'Bağışıklık sisteminin miyeline saldırması.', 'ileri'],
      ['beyin-tumorleri', 'Beyin tümörlerine genel bakış', 'Hücre kökenleri ve belirtilerin yere bağlılığı.', 'ileri'],
      ['sinir-sistemi-enfeksiyonlari', 'Sinir sistemi enfeksiyonları', 'Menenjit ve ensefalit.', 'ileri'],
      ['ruhsal-bozukluklarin-beyindeki-izleri', 'Ruhsal bozuklukların beyindeki izleri', 'Depresyon, kaygı, şizofreni: bugün bildiklerimiz.', 'ileri'],
      ['bagimlilik-ve-beyin', 'Bağımlılık ve beyin', 'Ödül sisteminin ele geçirilmesi.', 'lisans'],
    ]),
  },
  {
    id: 'yontemler',
    sira: 7,
    ad: 'Beyni İnceleme Yöntemleri',
    kisaAd: 'Yöntemler',
    renk: '#2f5ce0',
    aciklama: 'Beyni nasıl görüyor ve ölçüyoruz? EEG, tomografi, MR, fonksiyonel MR, PET, beyin uyarımı ve nöropsikolojik testler.',
    program: program('yontemler', [
      ['eeg', 'EEG ve beyin dalgaları', 'Kafa derisinden beynin elektriğini dinlemek.', 'lisans'],
      ['tomografi-ve-mr', 'Tomografi ve MR', 'Beynin yapısını görüntülemek.', 'lisans'],
      ['fonksiyonel-mr-ve-pet', 'Fonksiyonel MR ve PET', 'Çalışan beyni görüntülemek ve sınırları.', 'lisans'],
      ['beyin-uyarimi', 'Beyni uyarmak', 'Manyetik uyarım ve derin beyin uyarımı.', 'ileri'],
      ['noropsikolojik-degerlendirme', 'Nöropsikolojik değerlendirme', 'Dikkat, bellek ve yürütücü işlevler nasıl ölçülür?', 'lisans'],
      ['hucre-duzeyinde-yontemler', 'Hücre düzeyinde yöntemler', 'Elektrotlar, boyamalar ve ışıkla nöron kontrolü.', 'ileri'],
    ]),
  },
  {
    id: 'tarih-ve-efsaneler',
    sira: 8,
    ad: 'Nörobilimin Tarihi, Efsaneler ve Etkili Öğrenme',
    kisaAd: 'Tarih ve efsaneler',
    renk: '#b07f22',
    aciklama: 'Beyni anlama serüveni, beynin sırlarını açan hastalar, yaygın beyin efsaneleri ve bilime göre etkili öğrenme.',
    program: program('tarih-ve-efsaneler', [
      ['norobilimin-tarihi', 'Nörobilimin tarihi', 'Antik çağdan Cajal’a ve bugüne.', 'temel'],
      ['beynin-sirlarini-acan-hastalar', 'Beynin sırlarını açan hastalar', 'Phineas Gage, Leborgne ve H.M.', 'temel'],
      ['beyin-efsaneleri', 'Beyin efsaneleri', '"Beynimizin %10’u", "sağ beyin-sol beyin" ve öğrenme stilleri.', 'temel'],
      ['bilime-gore-etkili-ogrenme', 'Bilime göre etkili öğrenme', 'Aralıklı tekrar, hatırlama pratiği ve uyku.', 'temel'],
    ]),
  },
];

export function dalBul(id: string): Dal | undefined {
  return DALLAR.find((d) => d.id === id);
}

export function hazirDersler(): Ders[] {
  return DALLAR.flatMap((d) => d.program.flatMap((p) => (p.ders ? [p.ders] : [])));
}

export function dersBul(dal: string, slug: string): Ders | undefined {
  return hazirDersler().find((d) => d.dal === dal && d.slug === slug);
}

export function toplamDers(): number {
  return DALLAR.reduce((t, d) => t + d.program.length, 0);
}

/** Aynı bölümdeki önceki ve sonraki hazır ders. */
export function komsuDersler(ders: Ders): { onceki?: Ders; sonraki?: Ders } {
  const hazir = dalBul(ders.dal)!.program.flatMap((p) => (p.ders ? [p.ders] : []));
  const i = hazir.findIndex((d) => d.slug === ders.slug);
  return { onceki: hazir[i - 1], sonraki: hazir[i + 1] };
}

export const BEYIN_YOLU = '/beyin-akademisi';
