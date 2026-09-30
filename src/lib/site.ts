import 'server-only';

/**
 * Site sahibinin bilgileri. Ölçekhane'yi bir gerçek kişi bireysel olarak işletir: sitenin içerik
 * sağlayıcısı ve KVKK kapsamında veri sorumlusu bu kişidir.
 *
 * 5651 sayılı Kanun'a dayanan Usul ve Esaslar Yönetmeliği'nin 5. maddesi, ticari ya da ekonomik amaçlı
 * içerik sağlayıcıların adı ve soyadını, yerleşim yerini, e-posta adresini ve telefon numarasını ana
 * sayfadan doğrudan ulaşılan "İletişim" başlığı altında; yer sağlayıcının (barındırma hizmeti) tanıtıcı
 * bilgilerini de bunlarla birlikte ana sayfada göstermesini ister. Bu yüzden ilk dört alan zorunludur:
 * sunucu/kur.sh, bunlar boşken sitenin arama motorlarına açılmasına izin vermez. KVKK başvuruları için ayrı
 * e-posta ve KEP adresi isteğe bağlıdır; vergi bilgileri, ücretli rapor satışına başlamadan önce yapılacak
 * vergi kaydından sonra doldurulur. İsteğe bağlı alanlar boşken sitede gösterilmez.
 *
 * Sunucu çalışırken ortam değişkenlerinden okunur (sayfalar istek anında üretilir, bkz. app/layout.tsx);
 * .env değişince kapsayıcının yeniden başlatılması yeterlidir.
 */
export interface OwnerInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  /** KVKK başvuruları için e-posta; ayrıca verilmediyse genel e-posta adresi. */
  kvkkEmail: string;
  kepAddress: string;
  taxOffice: string;
  taxNo: string;
}

export const OWNER_FIELDS: { key: keyof OwnerInfo; env: string; required: boolean }[] = [
  { key: 'name', env: 'OWNER_NAME', required: true },
  { key: 'address', env: 'OWNER_ADDRESS', required: true },
  { key: 'phone', env: 'OWNER_PHONE', required: true },
  { key: 'email', env: 'OWNER_EMAIL', required: true },
  { key: 'kvkkEmail', env: 'OWNER_KVKK_EMAIL', required: false },
  { key: 'kepAddress', env: 'OWNER_KEP', required: false },
  { key: 'taxOffice', env: 'OWNER_TAX_OFFICE', required: false },
  { key: 'taxNo', env: 'OWNER_TAX_NO', required: false },
];

export function ownerFromEnv(env: Record<string, string | undefined>): OwnerInfo {
  const o = {} as OwnerInfo;
  for (const f of OWNER_FIELDS) o[f.key] = (env[f.env] ?? '').trim();
  if (!o.kvkkEmail) o.kvkkEmail = o.email;
  return o;
}

export function getOwner(): OwnerInfo {
  return ownerFromEnv(process.env);
}

/** "Çankaya Vergi Dairesi, 1234567890"; vergi dairesi ya da numarası yoksa boş. */
export function taxLine(o: OwnerInfo): string {
  return o.taxOffice && o.taxNo ? `${o.taxOffice} Vergi Dairesi, ${o.taxNo}` : '';
}

/**
 * Yer sağlayıcı (barındırma hizmeti). 5651 Yönetmeliği m.5/2 gereği site sahibinin bilgileriyle birlikte
 * gösterilir: her sayfanın altbilgisinde (ana sayfa dahil) ve İletişim sayfasında. Hostinger'ın hizmet
 * koşullarına göre Türkiye'deki müşterilerin sözleşme tarafı Kıbrıs'taki Hostinger International
 * Limited'dir; faturadaki satıcı farklıysa burası güncellenmelidir.
 */
export const HOSTING_PROVIDER = {
  name: 'Hostinger International Limited',
  address: '61 Lordou Vironos str., 6023 Larnaca, Cyprus',
  website: 'https://www.hostinger.com',
  serverLocation: 'Almanya (Avrupa Birliği)',
} as const;

const PLACEHOLDER = /\{\{owner\.(\w+)\}\}/g;

/** Değerin Markdown biçimlendirmesi (vurgu, bağlantı, tablo) olarak yorumlanmaması için. */
function escapeMarkdown(v: string): string {
  return v.replace(/[\\`*_[\]|<>]/g, '\\$&');
}

/** Yayındaki sitede de boş kalabilen alanlar: KEP adresi ve (vergi kaydına kadar) vergi bilgileri. */
const OMITTABLE: ReadonlySet<string> = new Set<keyof OwnerInfo>(['kepAddress', 'taxOffice', 'taxNo']);

/**
 * Hukuki metinlerdeki {{owner.alan}} yer tutucularını site sahibinin bilgileriyle doldurur. Yalnızca boş
 * kalabilen alanları anan satır, bu alanlar boşken metinden çıkarılır (ör. KEP adresi yoksa "KEP adresi: …"
 * satırı görünmez). Zorunlu bir alan henüz girilmediyse yerinde "—" görünür.
 */
export function fillOwner(md: string, o: OwnerInfo = getOwner()): string {
  const value = (k: string): string => (Object.hasOwn(o, k) ? o[k as keyof OwnerInfo] : '');
  return md
    .split('\n')
    .filter((line) => {
      const keys = Array.from(line.matchAll(PLACEHOLDER), (m) => m[1]);
      return keys.length === 0 || keys.some((k) => value(k) || !OMITTABLE.has(k));
    })
    .map((line) => line.replace(PLACEHOLDER, (_, k: string) => (value(k) ? escapeMarkdown(value(k)) : '—')))
    .join('\n');
}
