import type { Katman } from './yapilar';

/** Programın sekiz bölümü (adreste görünür: /beyin-akademisi/<bölüm>/<ders>). */
export type DalId =
  | 'anatomi'
  | 'hucre-ve-molekul'
  | 'sistemler'
  | 'zihin-ve-davranis'
  | 'yasam-boyu'
  | 'klinik'
  | 'yontemler'
  | 'tarih-ve-efsaneler';

/**
 * Dersin seviyesi: temel (meraklı herkes, lise ve sağlık lisesi), lisans (tıp, psikoloji ve nörobilimin ilk
 * yılları), ileri (ayrıntılı nöroanatomi, klinik bağlantılar). Her ders katmanlıdır: temel anlatımın yanında
 * "Derinleş", "Klinik bağlantı" ve "Sınav notu" kutuları tıp ve nörobilim düzeyindeki ayrıntıyı taşır.
 */
export type Seviye = 'temel' | 'lisans' | 'ileri';

/**
 * Üç boyutlu sahnenin ayarı. Seçiciler: yapı kimliği (`talamus-sol`), tarafsız kimlik (`talamus`: iki yanı birden),
 * `bolge:serebrum`, `lob:frontal`, `katman:derin`, `taraf:sol`.
 */
export interface Sahne {
  /** İndirilecek ve gösterilecek model paketleri. */
  katmanlar: Katman[];
  /** Verilirse yalnızca bunlara uyan yapılar görünür. */
  goster?: string[];
  /** Görünmeyecek yapılar. */
  gizle?: string[];
  /** Öne çıkan yapılar: parlak renkte kalır, ötekiler soluklaşır. */
  vurgula?: string[];
  /** Yarı saydam gösterilen yapılar (içeriyi görmek için). */
  saydam?: string[];
  /** Renklendirme: lob, bölge, her yapıya kendi rengi ya da doğal (gerçeğe yakın) renkler. */
  renk?: 'lob' | 'bolge' | 'yapi' | 'dogal';
  /**
   * Bu sahneye özel boya: seçicilere uyan yapılar verilen renkte çizilir (ör. komissür lifleri bir renk, projeksiyon
   * lifleri başka bir renk). Renk şemasının üstüne uygulanır; açıklamada renklerin anlamı söylenir.
   */
  boya?: { secici: string[]; renk: string }[];
  /** Yapıların üzerinde gösterilecek etiketler (yapı kimliği ya da tarafsız kimlik; metin verilmezse yapının adı). */
  etiketler?: { yapi: string; metin?: string }[];
  /**
   * Kemiklerin üzerindeki işaret noktaları (`noktalar.ts`: çıkıntı ucu, delik ağzı, çukur, köşe). Nokta yerinde
   * sabittir; önü kapalıysa ya da kesitle kaldırıldıysa etiketi gizlenir. Metin verilmezse noktanın adı yazar.
   */
  noktalar?: { nokta: string; metin?: string }[];
  bakis?: Bakis;
  /** Yalnızca bir yarımküre: orta hattan kesilir (iç yüzü görmek için). */
  yarim?: 'sol' | 'sag';
  /** Kesit düzlemi; konum -1 (bir uç) ile 1 (öteki uç) arasında. */
  kesit?: { duzlem: KesitDuzlemi; konum: number };
  /** Parçalara ayırma miktarı (0–1). */
  ayristir?: number;
  /** Kullanıcı dokunana kadar yavaşça döner (hareketi azaltmayı seçenlerde dönmez). */
  donme?: boolean;
}

export type Bakis = 'sol' | 'sag' | 'on' | 'arka' | 'ust' | 'alt' | 'egik' | 'ic-sol' | 'ic-sag';
export type KesitDuzlemi = 'sagital' | 'koronal' | 'aksiyel';

/** Sahnenin altında gösterilecek araçlar. */
export type SahneAraci = 'bakis' | 'katman' | 'kesit' | 'ayristir' | 'yarim' | 'renk' | 'liste';

export type AnimasyonAdi =
  | 'sinir-sistemi-haritasi'
  | 'yon-pusulasi'
  | 'gri-beyaz-cevher'
  | 'otonom-terazi'
  | 'omurilik-sinirleri'
  | 'mr-gosterimi'
  | 'koordinat-eksenleri'
  | 'yon-ciftleri'
  | 'eksen-acilari'
  | 'olcek-merdiveni'
  | 'ac-pc-izgarasi'
  | 'kafa-beyin-cizgileri'
  | 'otonom-cikis'
  | 'kafa-ici-kanamalar'
  | 'monro-kellie'
  | 'kafatasi-tabani'
  | 'bingildaklar'
  | 'kraniosinostoz'
  | 'kafa-derisi-katmanlari'
  | 'kafatasi-kiriklari'
  | 'kraniotomi'
  | 'kemik-isaretleri'
  | 'yuz-siniri-kanali'
  | 'kama-sinusu-tipleri';

/**
 * Kutu çeşitleri. "aklinda-kalsin", "biliyor-muydun" ve "dikkat" temel katmandadır. "derinles", "klinik",
 * "sinav-notu" ve "goruntuleme" lisans katmanında (tıp, nörobilim ve psikoloji öğrencisi); "cerrahi" ve "arastirma"
 * uzman katmanındadır (asistan hekim, cerrah, araştırmacı). Blokta `duzey` verilirse çeşidin varsayılanının yerine geçer.
 */
export type KutuCesidi =
  | 'aklinda-kalsin'
  | 'biliyor-muydun'
  | 'dikkat'
  | 'derinles'
  | 'klinik'
  | 'sinav-notu'
  | 'goruntuleme'
  | 'cerrahi'
  | 'arastirma';

export const KUTU_DUZEYI: Record<KutuCesidi, Seviye> = {
  'aklinda-kalsin': 'temel',
  'biliyor-muydun': 'temel',
  dikkat: 'temel',
  derinles: 'lisans',
  klinik: 'lisans',
  'sinav-notu': 'lisans',
  goruntuleme: 'lisans',
  cerrahi: 'ileri',
  arastirma: 'ileri',
};

/**
 * Bloklar. `duzey` verilmezse blok temel katmandadır (kutularda çeşidin varsayılanı). Okuyucu "Temel" seçince
 * yalnızca temel bloklar, "Lisans" seçince temel ve lisans blokları, "Uzman" seçince hepsi görünür.
 */
export type Blok =
  | { tur: 'metin'; md: string; duzey?: Seviye }
  | {
      tur: 'sahne';
      baslik: string;
      aciklama: string;
      sahne: Sahne;
      araclar?: SahneAraci[];
      duzey?: Seviye;
    }
  | { tur: 'animasyon'; ad: AnimasyonAdi; baslik: string; aciklama: string; duzey?: Seviye }
  | { tur: 'kutu'; cesit: KutuCesidi; baslik?: string; md: string; duzey?: Seviye }
  | { tur: 'sayilar'; baslik: string; ogeler: { deger: string; birim?: string; aciklama: string }[]; not?: string; duzey?: Seviye }
  | { tur: 'tablo'; baslik: string; sutunlar: string[]; satirlar: string[][]; not?: string; duzey?: Seviye }
  /**
   * Klinik vaka: öykü ve bulgular, okuyucuya soru, "Çözümü göster" ile açılan akıl yürütme. Vakalar eğitim için
   * kurgulanmıştır; gerçek bir hastayı anlatmaz.
   */
  | { tur: 'vaka'; baslik: string; oyku: string; soru: string; cozum: string; duzey?: Seviye };

/** Bloğun katmanı. */
export function blokDuzeyi(b: Blok): Seviye {
  if (b.duzey) return b.duzey;
  if (b.tur === 'kutu') return KUTU_DUZEYI[b.cesit];
  return 'temel';
}

export interface DersBolumu {
  /** Sayfa içi bağlantı kimliği. */
  id: string;
  baslik: string;
  bloklar: Blok[];
}

export interface Terim {
  terim: string;
  latince?: string;
  tanim: string;
}

export interface Soru {
  soru: string;
  secenekler: string[];
  /** Doğru seçeneğin sırası (0'dan başlar). */
  dogru: number;
  aciklama: string;
  seviye: Seviye;
}

export interface Kaynak {
  /** APA biçiminde künye. */
  metin: string;
  url?: string;
}

/** Ulusal Çekirdek Eğitim Programı (UÇEP 2020) çekirdek hastalık/klinik problem maddesi ve öğrenme düzeyi. */
export interface UcepMaddesi {
  no: number;
  ad: string;
  duzey: string;
}

export interface Ders {
  dal: DalId;
  slug: string;
  sira: number;
  seviye: Seviye;
  baslik: string;
  /** Arama sonuçlarındaki açıklama (en fazla ~160 karakter). */
  aciklama: string;
  /** Başlığın altındaki giriş cümlesi. */
  giris: string;
  /** "Bu derste öğreneceklerin" listesi; katmanı verilmeyen hedef temeldir. */
  hedefler: (string | { metin: string; duzey: Seviye })[];
  bolumler: DersBolumu[];
  sozluk: Terim[];
  sorular: Soru[];
  kaynaklar: Kaynak[];
  /** Bu dersin temel bilgisinin kullanıldığı UÇEP 2020 maddeleri (Sinir–Davranış sistemi). */
  ucep?: UcepMaddesi[];
  yayin: string;
  guncelleme: string;
}

/** Bir dalın programındaki ders: hazır olanın içeriği `ders`te durur. */
export interface ProgramDersi {
  sira: number;
  slug: string;
  baslik: string;
  ozet: string;
  seviye: Seviye;
  ders?: Ders;
}

export interface Dal {
  id: DalId;
  sira: number;
  ad: string;
  kisaAd: string;
  aciklama: string;
  /** Bölümün tanıtım rengi (yalnızca tanıtır; anlam taşımaz). */
  renk: string;
  program: ProgramDersi[];
}

export const SEVIYE_ADLARI: Record<Seviye, string> = {
  temel: 'Temel',
  lisans: 'Lisans',
  ileri: 'Uzman',
};

/** Katmanların kime seslendiği (okuma düzeyi seçicisinde ve ders başında). */
export const SEVIYE_KITLESI: Record<Seviye, string> = {
  temel: 'meraklı herkes, lise ve sağlık lisesi',
  lisans: 'tıp, nörobilim ve psikoloji öğrencisi',
  ileri: 'asistan hekim, beyin cerrahı, araştırmacı ve akademisyen',
};
