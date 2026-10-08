import { sinirSistemineIlkBakis } from './dersler/anatomi/sinir-sistemine-ilk-bakis';
import type { Dal, DalId, Ders, ProgramDersi } from './types';

export type { Dal, DalId, Ders } from './types';

/**
 * Beyin Akademisi'nin iki dalı ve programları. Hazır olan dersin içeriği `ders` alanındadır; olmayanlar programda
 * "hazırlanıyor" diye görünür, kendi sayfaları açılmaz ve site haritasına girmez.
 */
const HAZIR: Ders[] = [sinirSistemineIlkBakis];

function program(dal: DalId, satirlar: [string, string, string][]): ProgramDersi[] {
  return satirlar.map(([slug, baslik, ozet], i) => ({
    sira: i + 1,
    slug,
    baslik,
    ozet,
    ders: HAZIR.find((d) => d.dal === dal && d.slug === slug),
  }));
}

export const DALLAR: Dal[] = [
  {
    id: 'anatomi',
    ad: 'Beyin Anatomisi',
    kisaAd: 'Anatomi',
    aciklama:
      'Beyni oluşturan bütün yapılar, sıfırdan ve adım adım: loblar ve kıvrımlar, derin çekirdekler, beyin sapı, beyincik, karıncıklar, damarlar ve sinirler. Her ders gerçek bir beyin modeli üzerinde.',
    program: program('anatomi', [
      ['sinir-sistemine-ilk-bakis', 'Sinir sistemine ilk bakış ve anatominin dili', 'Merkezî ve çevresel sinir sistemi, beynin dört ana bölümü, gri ve beyaz cevher, yönler ve kesitler.'],
      ['beyni-koruyan-yapilar', 'Beyni koruyanlar', 'Kafatası kemikleri, beyin zarları, beyin-omurilik sıvısı ve kan-beyin engeli.'],
      ['beyin-nasil-olusur', 'Beyin nasıl oluşur?', 'Sinir borusundan beyne: ön, orta ve arka beyin keseciklerinin yetişkindeki karşılıkları.'],
      ['buyuk-beyin', 'Büyük beyin: yarımküreler, kıvrımlar ve oluklar', 'Yarımküreler, büyük yarıklar, girus ve sulkuslar; beyin kabuğunun genel planı.'],
      ['frontal-lob', 'Frontal (alın) lob', 'Hareket kabuğu, prefrontal kabuk ve Broca alanı.'],
      ['parietal-lob', 'Parietal (yan kafa) lob', 'Bedensel duyu kabuğu ve duyuların birleştirilmesi.'],
      ['temporal-lob', 'Temporal (şakak) lob', 'İşitme kabuğu, Wernicke alanı, görsel tanıma ve iç yüzdeki bellek yapıları.'],
      ['oksipital-lob-ve-insula', 'Oksipital (art kafa) lob ve insula', 'Görme kabuğu ve yan yarığın derinindeki gizli lob.'],
      ['beyin-kabugunun-haritalari', 'Beyin kabuğunun haritaları', 'Kabuğun katmanları, Brodmann alanları ve bedenin kabuktaki haritası.'],
      ['beyaz-cevher-ve-lif-yollari', 'Beyaz cevher ve lif yolları', 'Korpus kallozum, iç kapsül, komissürler ve bağlantı demetleri.'],
      ['bazal-cekirdekler', 'Bazal çekirdekler', 'Kaudat çekirdek, putamen, globus pallidus ve hareketin düzenlenmesi.'],
      ['ara-beyin', 'Ara beyin', 'Talamus, hipotalamus, epifiz ve hipofiz bezi.'],
      ['limbik-sistem', 'Limbik sistem', 'Hipokampus, amigdala, singulat girus, forniks ve mamiller cisimler.'],
      ['beyin-sapi', 'Beyin sapı', 'Orta beyin, pons ve omurilik soğanı; yaşamsal merkezler.'],
      ['kafa-ciftleri', '12 kafa çifti siniri', 'Kokudan dil hareketlerine on iki kafa sinirinin yolları ve görevleri.'],
      ['beyincik', 'Beyincik', 'Beyinciğin bölümleri, katmanları, bağlantıları ve hareketteki rolü.'],
      ['karinciklar', 'Karıncıklar ve beyin-omurilik sıvısı', 'Dört karıncık, sıvının yapılışı ve dolaşımı.'],
      ['beynin-damarlari', 'Beynin damarları ve Willis halkası', 'Karotis ve vertebral sistem, beyin arterleri ve toplardamar sinüsleri.'],
      ['omurilik-ve-sinir-yollari', 'Omurilik ve sinir yolları', 'Omuriliğin yapısı, çıkan duyu yolları ve inen hareket yolları.'],
      ['goruntulemede-beyin', 'MR ve tomografide beyin', 'Kesit görüntülerinde yapıları tanımak.'],
    ]),
  },
  {
    id: 'nasil-calisir',
    ad: 'Beyin Nasıl Çalışır?',
    kisaAd: 'İşleyiş',
    aciklama:
      'Nöronlardan düşünceye: sinir sinyali, sinaps, kimyasal haberciler, duyular, hareket, uyku, dikkat, bellek, duygular ve öğrenmenin beyindeki temeli. Sade bir dille, hareketli çizimlerle.',
    program: program('nasil-calisir', [
      ['noron', 'Nöron: beynin temel hücresi', 'Gövde, dendritler, akson ve uç düğmeleri; nöron çeşitleri.'],
      ['glia', 'Glia: beynin yardımcı hücreleri', 'Astrositler, oligodendrositler, mikroglia ve diğerleri.'],
      ['dinlenim-gerilimi', 'Hücre zarı, iyonlar ve dinlenim gerilimi', 'İyon kanalları, pompalar ve nöronun içindeki eksi yük.'],
      ['sinir-sinyali', 'Sinir sinyali nasıl doğar ve iletilir?', 'Aksiyon potansiyeli, eşik ve miyelinli aksonda sıçrayarak iletim.'],
      ['sinaps', 'Sinaps: nöronlar nasıl konuşur?', 'Kimyasal ve elektriksel sinapslar; habercinin salınması ve alınması.'],
      ['kimyasal-haberciler', 'Kimyasal haberciler', 'Glutamat, GABA, dopamin, serotonin, asetilkolin, noradrenalin ve diğerleri.'],
      ['noron-aglari-ve-refleksler', 'Nöron ağları ve refleksler', 'Uyarıcı ve baskılayıcı bağlantılar, devreler ve refleks yayı.'],
      ['gorme', 'Görme: gözden beyne', 'Retina, görme yolu ve görme kabuğunda görüntünün kurulması.'],
      ['diger-duyular', 'İşitme, denge, dokunma, ağrı, tat ve koku', 'Duyu almaçlarından kabuğa diğer duyular.'],
      ['hareket', 'Hareket: plandan kasa', 'Hareket kabuğu, bazal çekirdekler, beyincik ve omurilik birlikte.'],
      ['uyku-ve-biyolojik-saat', 'Uyku ve biyolojik saat', 'Uyku evreleri, gece-gündüz ritmi ve melatonin.'],
      ['dikkat-ve-bilinc', 'Dikkat ve bilinç', 'Uyanıklık, dikkat ağları ve bilincin beyindeki izleri.'],
      ['bellek-turleri', 'Bellek türleri', 'Çalışma belleği, olay belleği, anlam belleği ve beceri belleği.'],
      ['ogrenmenin-hucresel-temeli', 'Öğrenmenin hücresel temeli', 'Sinapsların güçlenmesi: "birlikte ateşlenen birlikte bağlanır".'],
      ['bellek-nasil-kalici-olur', 'Bellek nasıl kalıcı olur?', 'Pekiştirme, tekrar ve uykunun bellekteki rolü.'],
      ['duygular-odul-ve-motivasyon', 'Duygular, ödül ve motivasyon', 'Amigdala, ödül sistemi ve dopamin.'],
      ['dil-ve-beyin', 'Dil ve beyin', 'Konuşmayı anlamak ve üretmek; dil ağları.'],
      ['planlama-ve-kendini-kontrol', 'Planlama ve kendini kontrol', 'Prefrontal kabuk ve yürütücü işlevler.'],
      ['gelisen-beyin', 'Bebeklikten ergenliğe gelişen beyin', 'Sinaps budaması, miyelinleşme ve kritik dönemler.'],
      ['etkili-ogrenme-ve-beyin-efsaneleri', 'Bilime göre etkili öğrenme ve beyin efsaneleri', 'Aralıklı tekrar, hatırlama pratiği; "%10 efsanesi" gibi yanlışlar.'],
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

/** Aynı daldaki önceki ve sonraki hazır ders. */
export function komsuDersler(ders: Ders): { onceki?: Ders; sonraki?: Ders } {
  const hazir = dalBul(ders.dal)!.program.flatMap((p) => (p.ders ? [p.ders] : []));
  const i = hazir.findIndex((d) => d.slug === ders.slug);
  return { onceki: hazir[i - 1], sonraki: hazir[i + 1] };
}

export const BEYIN_YOLU = '/beyin-akademisi';
