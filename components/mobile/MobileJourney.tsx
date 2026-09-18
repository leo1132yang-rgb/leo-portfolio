'use client';
import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeoHero } from '@/components/LeoHero';
import { EvolvingProfile } from '@/components/profile/EvolvingProfile';
import { ProjectsIndex } from '@/components/ProjectsIndex';
import { SiteNavbar } from '@/components/layout/SiteNavbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WorldInvitation } from '@/components/other-side/WorldInvitation';
import { readJourney, rememberJourney, mobileJourneyKey } from '@/lib/mobileJourney';
import styles from './MobileJourney.module.css';

export function MobileJourney() {
  const router = useRouter();
  useLayoutEffect(() => {
    const saved = readJourney();
    const hash = location.hash.slice(1);
    const restore = saved?.pending && (!hash || hash === saved.chapter || history.state?.leoMobileJourneyReturn);
    let nextFrame = 0;
    const frame = requestAnimationFrame(() => { nextFrame = requestAnimationFrame(() => {
      if (restore) {
        window.scrollTo({ top: saved.y, behavior: 'instant' });
        try { sessionStorage.setItem(mobileJourneyKey, JSON.stringify({ ...saved, pending: false })); } catch {}
      } else if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' });
      if (history.state?.leoMobileJourneyReturn) {
        const { leoMobileJourneyReturn, ...state } = history.state;
        history.replaceState(state, '');
      }
    }); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame); };
  }, []);
  return <div className={styles.journey} data-mobile-journey>
    <SiteNavbar variant="hero" />
    <main onClickCapture={event => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href="#projects"]');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); event.stopPropagation();
      history.replaceState(history.state, '', '/#projects');
      document.getElementById('projects')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }}>
      <LeoHero embedded />
      <section id="profile" className={styles.chapter} data-mobile-chapter="profile" aria-labelledby="profile-title"><div className={styles.marker}>02</div><EvolvingProfile embedded /></section>
      <section id="projects" className={`${styles.chapter} ${styles.projects}`} data-mobile-chapter="projects" aria-label="Projects"><div className={styles.marker}>03</div><ProjectsIndex embedded /></section>
      <section id="world" className={`${styles.chapter} ${styles.world}`} data-mobile-chapter="world" aria-labelledby="world-welcome-title">
        <img className={styles.worldImage} src="/room/leo-cosmic-galaxy.png" alt="" loading="lazy" width="1536" height="1024" />
        <div className={styles.worldContent}><div className={styles.worldNumber}>04</div><WorldInvitation embedded onEnter={() => {
          const previous = readJourney();
          rememberJourney('world', previous?.filter || 'all');
          router.push('/other-side?enter=1&from=mobile-home');
        }} /></div>
      </section>
    </main>
    <SiteFooter chapterLinks />
  </div>;
}
