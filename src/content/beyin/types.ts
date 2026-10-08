import type { Katman } from './yapilar';

export type DalId = 'anatomi' | 'nasil-calisir';

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
  /** Yapıların üzerinde gösterilecek etiketler (yapı kimliği ya da tarafsız kimlik; metin verilmezse yapının adı). */
  etiketler?: { yapi: string; metin?: string }[];
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

export type AnimasyonAdi = 'sinir-sistemi-haritasi' | 'yon-pusulasi' | 'gri-beyaz-cevher';

export type Blok =
  | { tur: 'metin'; md: string }
  | {
      tur: 'sahne';
      baslik: string;
      aciklama: string;
      sahne: Sahne;
      araclar?: SahneAraci[];
    }
  | { tur: 'animasyon'; ad: AnimasyonAdi; baslik: string; aciklama: string }
  | { tur: 'kutu'; cesit: 'aklinda-kalsin' | 'biliyor-muydun' | 'dikkat'; baslik?: string; md: string }
  | { tur: 'sayilar'; baslik: string; ogeler: { deger: string; birim?: string; aciklama: string }[]; not?: string }
  | { tur: 'tablo'; baslik: string; sutunlar: string[]; satirlar: string[][]; not?: string };

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
}

export interface Kaynak {
  /** APA biçiminde künye. */
  metin: string;
  url?: string;
}

export interface Ders {
  dal: DalId;
  slug: string;
  sira: number;
  baslik: string;
  /** Arama sonuçlarındaki açıklama (en fazla ~160 karakter). */
  aciklama: string;
  /** Başlığın altındaki giriş cümlesi. */
  giris: string;
  /** "Bu derste öğreneceklerin" listesi. */
  hedefler: string[];
  bolumler: DersBolumu[];
  sozluk: Terim[];
  sorular: Soru[];
  kaynaklar: Kaynak[];
  yayin: string;
  guncelleme: string;
}

/** Bir dalın programındaki ders: hazır olanın içeriği `ders`te durur. */
export interface ProgramDersi {
  sira: number;
  slug: string;
  baslik: string;
  ozet: string;
  ders?: Ders;
}

export interface Dal {
  id: DalId;
  ad: string;
  kisaAd: string;
  aciklama: string;
  program: ProgramDersi[];
}
