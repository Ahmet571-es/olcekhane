import type { Metadata } from 'next';
import { ForgotForm } from './forgot-form';

export const metadata: Metadata = { title: 'Şifremi unuttum', robots: { index: false } };

export default function ForgotPage() {
  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="t-h1 mb-2">Şifremi unuttum</h1>
      <p className="mb-8 text-ink-2">E-posta adresinizi yazın; yeni şifre belirlemeniz için bir bağlantı gönderelim.</p>
      <ForgotForm />
    </div>
  );
}
