"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";

const links = [
  { href: "/", cn: "首页", en: "Home" },
  { href: "/projects", cn: "项目作品", en: "Projects" },
  { href: "/profile", cn: "个人履历", en: "Profile" },
  { href: "/other-side", cn: "另一面", en: "The Other Side" },
];

export function SiteNavbar({ variant = "default" }: { variant?: "default" | "hero" }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
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
      <Link href="/" className="site-nav__brand">LEO <span>/ 李阳</span></Link>
      <nav className="site-nav__links" aria-label={cn ? "主导航" : "Main navigation"}>{links.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={isActive(item.href) ? "is-active" : ""}>{cn ? item.cn : item.en}</Link>)}</nav>
      <div className="site-nav__actions"><LanguageSwitch /><a href="mailto:leoyang1132@outlook.com">{cn ? "联系我" : "Contact"}</a><button type="button" aria-label="Open navigation" onClick={() => setOpen(true)} className="site-nav__menu">≡</button></div>
    </header>
    <div className={`site-nav__mobile ${open ? "is-open" : ""}`}><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation">×</button><nav>{links.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={isActive(item.href) ? "page" : undefined}>{cn ? item.cn : item.en}</Link>)}<a href="mailto:leoyang1132@outlook.com" onClick={() => setOpen(false)}>{cn ? "联系我" : "Contact"}</a></nav></div>
  </>;
}
