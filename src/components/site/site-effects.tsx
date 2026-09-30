'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Tanıtım sayfalarının hareketli ayrıntıları; hepsi tek bir yerde ve isteğe bağlı:
 *  - [data-reveal]: yalnızca sayfa açıldığında ekranın altında kalan öğeler gizlenir, görünür alana
 *    girince belirir. İlk görünümdeki öğeler hiç gizlenmez; JS yoksa içerik zaten görünür.
 *  - [data-tilt]: fareyle üzerine gelinince kart hafifçe eğilir ve ışık imleci izler.
 *  - [data-magnet]: düğme imlece doğru birkaç piksel çekilir.
 *  - #site-ust: aşağı kaydırınca üst menü gizlenir, yukarı kaydırınca geri gelir.
 * Hareketi azaltmayı seçenlerde yalnızca üst menü davranışı çalışır. Hiçbiri veri saklamaz.
 */
export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const cleanups: (() => void)[] = [];

    const frame = requestAnimationFrame(() => {
      if (!reduced && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              const el = e.target as HTMLElement;
              el.classList.add('reveal-gorundu');
              el.classList.remove('reveal-bekliyor');
              io.unobserve(el);
            }
          },
          { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
        );
        const limit = window.innerHeight * 0.94;
        document.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-gorundu)').forEach((el) => {
          if (el.getBoundingClientRect().top < limit) return;
          el.classList.add('reveal-bekliyor');
          io.observe(el);
        });
        cleanups.push(() => io.disconnect());
      }

      if (!reduced && fine) {
        document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            el.style.setProperty('--egim-y', `${(x * 7).toFixed(2)}deg`);
            el.style.setProperty('--egim-x', `${(-y * 7).toFixed(2)}deg`);
            el.style.setProperty('--isik-x', `${((x + 0.5) * 100).toFixed(1)}%`);
            el.style.setProperty('--isik-y', `${((y + 0.5) * 100).toFixed(1)}%`);
          };
          const leave = () => {
            el.style.removeProperty('--egim-x');
            el.style.removeProperty('--egim-y');
          };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          });
        });

        document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            el.style.transform = `translate3d(${(x * 0.18).toFixed(1)}px, ${(y * 0.28).toFixed(1)}px, 0)`;
          };
          const leave = () => {
            el.style.transform = '';
          };
          el.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)';
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          });
        });
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanups.forEach((c) => c());
    };
  }, [pathname]);

  // Üst menü: aşağı kaydırırken gizlenir, yukarı kaydırınca ya da sayfanın başında görünür.
  useEffect(() => {
    const header = document.getElementById('site-ust');
    if (!header) return;
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const open = header.dataset.menuAcik === '1';
      const hide = !open && y > 160 && y > last + 4;
      const show = y < last - 4 || y <= 160 || open;
      if (hide) header.dataset.gizli = '1';
      else if (show) header.dataset.gizli = '0';
      header.dataset.kaydi = y > 12 ? '1' : '0';
      last = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
