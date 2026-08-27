"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { SunMark } from "@/components/SunMark";
import { aboutHref, aboutSections, type AboutSlug } from "@/data/aboutSections";

export function AboutChapter({ slug, children, showIntro = true }: { slug: AboutSlug; children: ReactNode; showIntro?: boolean }) {
  const { language } = useLanguage();
  const index = aboutSections.findIndex((item) => item.slug === slug);
  const current = aboutSections[index];
  const previous = aboutSections[index - 1];
  const next = aboutSections[index + 1];
  const text = (section: (typeof aboutSections)[number]) => language === "cn" ? section.cn : section.en;

  return <main className={`min-h-screen overflow-x-hidden text-[#F5F7FB] ${showIntro ? "bg-[#0E111A]" : "career-profile-shell"}`}>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.10] bg-[#0E111A]/95"><div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 md:px-10"><Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#AAB6CE]/20 bg-[#AAB6CE]/[.045] text-[#AAB6CE]" aria-label={language === "cn" ? "返回首页" : "Back to home"}><SunMark /></Link><LanguageSwitch /></div></header>
    <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-28 sm:px-6 md:px-10 md:pt-32">
      <Link href="/#about-index" className="inline-flex min-h-11 items-center text-[12px] text-[#C3CBDB] transition-colors hover:text-white">← {language === "cn" ? "返回首页" : "Back Home"}</Link>
      {showIntro && <header className="mt-8 border-t border-white/[.10] pt-6"><p className="font-mono text-[9px] tracking-[.16em] text-[#91A7FF]">{current.number} / {current.tag}</p><h1 className="mt-4 text-3xl font-medium tracking-[-.05em] md:text-5xl">{text(current)}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#A8AEC5]">{language === "cn" ? current.cnNote : current.enNote}</p></header>}
      <div className={`about-chapter-content ${showIntro ? "mt-12" : "mt-7"}`}>{children}</div>
      <nav className="mt-20 grid gap-3 border-t border-white/[.10] pt-6 md:grid-cols-3 md:items-stretch">
        {previous ? <Link href={aboutHref(previous.slug)} className="about-chapter-nav-link text-left">← <span>{previous.number} / {previous.tag}</span><strong>{text(previous)}</strong></Link> : <span />}
        <Link href="/#about-index" className="about-chapter-nav-link about-chapter-nav-link--index text-center"><span>{language === "cn" ? "返回首页" : "Back Home"}</span><strong>{language === "cn" ? "继续认识 Leo" : "Explore Leo"}</strong></Link>
        {next ? <Link href={aboutHref(next.slug)} className="about-chapter-nav-link text-right"><span>{next.number} / {next.tag}</span><strong>{text(next)}</strong> →</Link> : <Link href="/" className="about-chapter-nav-link text-right"><span>{language === "cn" ? "返回首页" : "Back to Home"}</span><strong>{language === "cn" ? "回到首页" : "Back to Home"}</strong> →</Link>}
      </nav>
    </div>
  </main>;
}
