"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { worldName } from "@/data/worldCopy";
import { useMobileViewport } from '@/hooks/useMobileViewport';
import { chapterPaths } from '@/lib/mobileJourney';

const links = [
  { href: "/", cn: "首页", en: "Home" },
  { href: "/projects", cn: "项目作品", en: "Projects" },
  { href: "/profile", cn: "个人履历", en: "Profile" },
  { href: "/other-side", ...worldName },
];

export function SiteNavbar({ variant = "default" }: { variant?: "default" | "hero" }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const mobile = useMobileViewport();
  const items = mobile ? [links[0], links[2], links[1], links[3]] : links;
  const navHref = (href: string) => mobile ? chapterPaths[href] || href : href;
  const navigateChapter = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (!mobile || pathname !== '/' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = chapterPaths[href]?.split('#')[1];
    const chapter = hash ? document.getElementById(hash) : null;
    if (!chapter) return;
    event.preventDefault();
    history.replaceState(history.state, '', `/#${hash}`);
    chapter.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateNavigation = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 16);
      if (open || currentY < 72) setVisible(true);
      else if (delta > 8) setVisible(false);
      else if (delta < -5) setVisible(true);

      lastScrollY.current = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateNavigation);
    };

    lastScrollY.current = window.scrollY;
    setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setVisible(true);
  }, [pathname]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return <>
    <header className={`site-nav ${variant === "hero" ? "site-nav--hero" : ""} ${visible ? "is-visible" : "is-hidden"} ${scrolled ? "is-scrolled" : ""}`}>
      <Link href={navHref('/')} onClick={event => navigateChapter(event, '/')} className="site-nav__brand">LEO <span>/ 李阳</span></Link>
      <nav className="site-nav__links" aria-label={cn ? "主导航" : "Main navigation"}>{items.map((item) => <Link key={item.href} href={navHref(item.href)} onClick={event => navigateChapter(event, item.href)} aria-current={isActive(item.href) ? "page" : undefined} className={isActive(item.href) ? "is-active" : ""}>{cn ? item.cn : item.en}</Link>)}</nav>
      <div className="site-nav__actions"><LanguageSwitch /><a href="mailto:leoyang1132@outlook.com">{cn ? "联系我" : "Contact"}</a><button type="button" aria-label={cn ? "打开探索导航" : "Open explore navigation"} onClick={() => setOpen(true)} className="site-nav__menu"><span className="site-nav__menu-label">{cn ? "探索" : "Explore"}</span><span aria-hidden="true">≡</span></button></div>
    </header>
    <div className={`site-nav__mobile ${open ? "is-open" : ""}`}>
      <div className="site-nav__mobile-head">
        <p>{cn ? "探索目录" : "Explore Index"}</p>
        <button type="button" onClick={() => setOpen(false)} aria-label={cn ? "关闭导航" : "Close navigation"}>×</button>
      </div>
      <nav>{items.map((item, index) => {
        const active = isActive(item.href);
        return <Link key={item.href} href={navHref(item.href)} onClick={event => navigateChapter(event, item.href)} aria-current={active ? "page" : undefined} className={active ? "is-active" : ""}><small>{String(index + 1).padStart(2, "0")}</small><span>{cn ? item.cn : item.en}</span>{active && <b>{cn ? "当前" : "NOW"}</b>}</Link>;
      })}<a href="mailto:leoyang1132@outlook.com" onClick={() => setOpen(false)}><small>05</small><span>{cn ? "联系我" : "Contact"}</span></a></nav>
    </div>
  </>;
}
