"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { getProfileArchive } from "@/data/profileArchiveCopy";
import { TimelineAtmosphere } from "./TimelineAtmosphere";
import styles from "./TimelineArchive.module.css";

export function EvolvingProfile() {
  const { language } = useLanguage();
  const { copy, timeline: entries, focus, capabilities } = getProfileArchive(language);
  const timeline = useRef<HTMLOListElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const currentStage = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const list = timeline.current;
    const root = page.current;
    if (!list || !root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stages = Array.from(list.querySelectorAll<HTMLElement>("[data-timeline-entry]"));
    let activeStage: HTMLElement | undefined;
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      const bounds = list.getBoundingClientRect();
      const readingLine = window.innerHeight * .55;
      const progress = Math.max(0, Math.min(1, (readingLine - bounds.top) / Math.max(1, bounds.height)));
      list.style.setProperty("--progress", String(progress));
      // Share the existing scroll measurement with the reading highlight.
      // CURRENT remains the employment status, independent of the stage in view.
      const nextStage = stages.find(stage => {
        const rect = stage.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      if (nextStage !== activeStage) {
        activeStage?.removeAttribute("data-reading-active");
        nextStage?.setAttribute("data-reading-active", "true");
        activeStage = nextStage;
      }
    };
    const schedule = () => {
      if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(update);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame); frame = 0;
      list.dataset.reduced = String(motion.matches);
      update();
    };
    const visibility = () => {
      root.dataset.paused = String(document.hidden);
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.entered = "true";
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    root.querySelectorAll("[data-timeline-entry], [data-reveal]").forEach(entry => reveal.observe(entry));
    const currentVisibility = new IntersectionObserver(entries => {
      root.dataset.currentVisible = String(entries[0].isIntersecting);
    }, { threshold: .2 });
    if (currentStage.current) currentVisibility.observe(currentStage.current);
    const resize = new ResizeObserver(schedule);
    resize.observe(list);
    syncMotion();
    visibility();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", syncMotion);
    return () => {
      disposed = true;
      activeStage?.removeAttribute("data-reading-active");
      cancelAnimationFrame(frame);
      reveal.disconnect(); resize.disconnect(); currentVisibility.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", syncMotion);
    };
  }, [language]);

  return <div ref={page} className={styles.page} data-profile-render="profile-editorial-archive" data-language={language} lang={language === "cn" ? "zh-CN" : "en"} data-profile-source="components/profile/EvolvingProfile.tsx">
    <TimelineAtmosphere currentStage={currentStage} />
    <SiteNavbar />
    <main className={styles.main}>
      <header className={styles.masthead}>
        <Link href="/">← {copy.home}</Link>
        <p>{copy.archive} <span>/</span> 2015 — {copy.now}</p>
        <a href="#timeline">{copy.read} <span>↓</span></a>
      </header>

      <section className={styles.intro} aria-labelledby="profile-title">
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 id="profile-title">Leo<i>.</i><span>/ 李阳</span></h1>
          <p className={styles.disciplines}>{copy.disciplines.map((word, index) => <span key={word}>{index > 0 && <i>×</i>}{word}</span>)}</p>
        </div>
        <div className={styles.introNote}>
          <span className={styles.annotation}>{copy.practice}</span>
          <p>{copy.method}</p>
          <small>{copy.introduction[0]}<br />{copy.introduction[1]}</small>
        </div>
        <div className={styles.introBottom}><span>{copy.approach}</span><a href="#coordinate-07">{copy.current} <i>·</i> CHAMP MVP / {copy.city} <b>↗</b></a></div>
      </section>

      <section id="timeline" className={styles.timelineSection} aria-labelledby="timeline-title">
        <header className={styles.sectionHeader} data-reveal>
          <div><p className={styles.eyebrow}>01 / {copy.timeline}</p><h2 id="timeline-title">{copy.journey}<span>{copy.journeyNote}</span></h2></div>
          <a href="#coordinate-07" className={styles.currentLink}>2015 <span>→</span> {copy.now} <b>↓</b></a>
        </header>
        <ol ref={timeline} className={styles.timeline} role="list">
          {entries.map((entry, index) => <li key={entry.id} id={`coordinate-${entry.number}`} ref={index === 6 ? currentStage : undefined} data-timeline-entry data-chapter={entry.number} className={`${styles.entry} ${index === 6 ? styles.current : ""}`}>
            <div className={styles.dateColumn}>
              <span className={styles.chapter}><b>{entry.number}</b> <i>/ 07</i>{index === 6 && <span className={styles.currentBadge} aria-label={copy.current}> · {copy.current}</span>}</span>
              <p className={styles.date}>{entry.date}</p>
            </div>
            <span className={styles.node} aria-hidden="true" />
            <article data-archive-number={entry.number} className={styles.entryContent} aria-labelledby={`entry-title-${entry.number}`}>
              <span className={styles.archiveNumber} aria-hidden="true">{entry.number}</span>
              <p className={styles.location}>{entry.location}</p>
              <h3 id={`entry-title-${entry.number}`}>{entry.institution}</h3>
              <p className={styles.role}>{entry.title}</p>
              <p className={styles.description}>{entry.summary}</p>
              <ul className={styles.keywords} aria-label={copy.keywords}>{entry.keywords.map(keyword => <li key={keyword}>{keyword}</li>)}</ul>
              {entry.items.length > 0 && <details className={styles.details} open={index === 6 ? true : undefined}>
                <summary><span>{index >= 5 ? copy.work : copy.notes}</span><i aria-hidden="true" /></summary>
                <ul>{entry.items.map(item => <li key={item}>{item}</li>)}</ul>
              </details>}
            </article>
          </li>)}
        </ol>
        <div className={styles.timelineEnd}><span>↳</span><p>{copy.continues}</p><small>{copy.toContinue}</small></div>
      </section>

      <section className={styles.focus} id="current-focus" aria-labelledby="focus-title">
        <div className={styles.focusIntro} data-reveal><p className={styles.eyebrow}>02 / {copy.focus}</p><h2 id="focus-title">{copy.focusTitle[0]}<br />{copy.focusTitle[1]}</h2><div className={styles.focusIdentity}><span>{entries[6].date} / {copy.city}</span><strong>CHAMP MVP</strong><p>{entries[6].title}</p></div></div>
        <ol className={styles.focusList}>{focus.map((item, index) => <li key={item.label} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.label}</h3><small>{item.category}</small></div></li>)}</ol>
      </section>

      <section className={styles.capabilities} aria-labelledby="capabilities-title">
        <header className={styles.sectionHeader} data-reveal><div><p className={styles.eyebrow}>03 / {copy.capability}</p><h2 id="capabilities-title">{copy.capabilityTitle}<span>{copy.capabilityNote}</span></h2></div></header>
        <div className={styles.capabilityList}>{capabilities.map(cluster => <div key={cluster.id} data-reveal><span className={styles.annotation}>{cluster.index}</span><h3>{cluster.name}</h3><p>{cluster.note}</p><small>{cluster.skills.slice(0, 4).join(" / ")}</small></div>)}</div>
      </section>

      <footer className={styles.ending} data-reveal>
        <p className={styles.eyebrow}>{copy.workNote}</p>
        <p className={styles.method}>{copy.method}</p>
        <div className={styles.belief}><p>{copy.belief[0]}</p><p>{copy.belief[1]}</p></div>
        <div className={styles.signoff}><span>LEO / 李阳 <i>© {new Date().getFullYear()}</i></span><p>{copy.signoff} / 2015 — {copy.now}</p><a href="#profile-title">{copy.back} ↑</a></div>
      </footer>
    </main>
  </div>;
}
