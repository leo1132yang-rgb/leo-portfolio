'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMobileViewport } from '@/hooks/useMobileViewport';

// Existing category return links remain valid URLs. On mobile their normal
// same-tab click returns to the continuous Projects chapter, including direct visits.
export function MobileJourneyNavigation() {
  const mobile = useMobileViewport();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!mobile || !/^\/(projects\/|cases\/|work\/)/.test(pathname)) return;
    const handle = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== '/projects' || url.search) return;
      event.preventDefault(); event.stopPropagation();
      router.push('/#projects', { scroll: false });
    };
    document.addEventListener('click', handle, true);
    return () => document.removeEventListener('click', handle, true);
  }, [mobile, pathname, router]);
  return null;
}
