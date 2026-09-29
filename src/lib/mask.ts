/** E-posta adresini ekranda kısmen gizler: ayse.yilmaz@ornek.com → a•••@ornek.com */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at < 1) return '•••';
  return `${email[0]}•••${email.slice(at)}`;
}
