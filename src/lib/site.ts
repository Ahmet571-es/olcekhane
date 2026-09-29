import 'server-only';

/**
 * Şirket bilgileri: e-ticaret ve KVKK mevzuatı gereği sitede gösterilmesi zorunlu alanlar.
 * Sunucu çalışırken ortam değişkenlerinden okunur (sayfalar istek anında üretilir, bkz. app/layout.tsx);
 * .env değişince kapsayıcının yeniden başlatılması yeterlidir.
 */
export interface CompanyInfo {
  legalName: string;
  address: string;
  mersisNo: string;
  taxOffice: string;
  taxNo: string;
  phone: string;
  email: string;
  kvkkEmail: string;
  kepAddress: string;
}

export const COMPANY_FIELDS: { key: keyof CompanyInfo; env: string; label: string }[] = [
  { key: 'legalName', env: 'COMPANY_LEGAL_NAME', label: 'Ticari unvan' },
  { key: 'address', env: 'COMPANY_ADDRESS', label: 'Açık adres' },
  { key: 'mersisNo', env: 'COMPANY_MERSIS', label: 'MERSİS numarası' },
  { key: 'taxOffice', env: 'COMPANY_TAX_OFFICE', label: 'Vergi dairesi' },
  { key: 'taxNo', env: 'COMPANY_TAX_NO', label: 'Vergi numarası' },
  { key: 'phone', env: 'COMPANY_PHONE', label: 'Telefon' },
  { key: 'email', env: 'COMPANY_EMAIL', label: 'Genel e-posta' },
  { key: 'kvkkEmail', env: 'COMPANY_KVKK_EMAIL', label: 'KVKK başvuru e-postası' },
  { key: 'kepAddress', env: 'COMPANY_KEP', label: 'KEP adresi' },
];

export function getCompany(): CompanyInfo {
  const c = {} as CompanyInfo;
  for (const f of COMPANY_FIELDS) c[f.key] = (process.env[f.env] ?? '').trim();
  return c;
}

/** Hukuki metinlerdeki {{company.alan}} yer tutucularını doldurur. Boş alanlar "—" olarak görünür. */
export function fillCompany(md: string, c: CompanyInfo = getCompany()): string {
  return md.replace(/\{\{company\.(\w+)\}\}/g, (_, k: string) => {
    const v = (c as unknown as Record<string, string>)[k];
    return v ? v : '—';
  });
}
