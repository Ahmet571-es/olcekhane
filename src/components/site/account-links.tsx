'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

/**
 * Tanıtım sayfaları statik sunulduğu için oturum bilgisini sunucuda okumayız. Girişte ayarlanan,
 * hiçbir kişisel bilgi taşımayan "olc_var" çerezine bakarak doğru bağlantıyı gösteririz.
 */
function subscribe() {
  return () => {};
}
function hasSession() {
  return document.cookie.split('; ').some((c) => c.startsWith('olc_var='));
}

export function AccountLinks({ compact = false }: { compact?: boolean }) {
  const loggedIn = useSyncExternalStore(subscribe, hasSession, () => false);
  if (loggedIn) {
    // Giriş sayfası, oturumu açık kullanıcıyı kendi paneline (veli, okul ya da yönetim) yönlendirir.
    return (
      <Link href="/giris" className="btn btn-primary whitespace-nowrap">
        Panelim
      </Link>
    );
  }
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <Link href="/giris" className="btn btn-quiet whitespace-nowrap">
        Giriş yap
      </Link>
      <Link href="/kayit" className="btn btn-primary whitespace-nowrap">
        Ücretsiz başla
      </Link>
    </div>
  );
}
