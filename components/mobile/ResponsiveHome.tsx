'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const DesktopHome = dynamic(() => import('@/components/LeoHero').then(module => module.LeoHero));
const MobileHome = dynamic(() => import('./MobileJourney').then(module => module.MobileJourney));
export function ResponsiveHome() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const media = matchMedia('(max-width: 767px)');
    const sync = () => setMobile(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  if (mobile === null) return <div style={{ minHeight: '100svh', background: '#101310' }} aria-busy="true" />;
  return mobile ? <MobileHome /> : <DesktopHome />;
}
