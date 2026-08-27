"use client";

import Link from "next/link";
import { AboutIndex } from "@/components/AboutIndex";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { SunMark } from "@/components/SunMark";

export function AboutShell() {
  const { language } = useLanguage();
  return <main className="min-h-screen bg-[#0E111A] text-[#F5F7FB]">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.10] bg-[#0E111A]/95"><div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-4 sm:px-6 md:px-10"><Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#AAB6CE]/20 bg-[#AAB6CE]/[.045] text-[#AAB6CE]" aria-label={language === "cn" ? "返回首页" : "Back to home"}><SunMark /></Link><LanguageSwitch /></div></header>
    <section className="mx-auto max-w-[980px] px-5 pb-20 pt-32 sm:px-6 md:pt-40">
      <Link href="/" className="inline-flex min-h-11 items-center text-[11px] text-[#A8AEC5] transition-colors hover:text-white">← {language === "cn" ? "返回首页" : "Back to Home"}</Link>
      <p className="mt-10 font-mono text-[9px] tracking-[.16em] text-[#91A7FF]">ABOUT LEO</p>
      <h1 className="mt-4 text-3xl font-medium tracking-[-.05em] md:text-5xl">{language === "cn" ? "关于 Leo" : "About Leo"}</h1>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A8AEC5]">{language === "cn" ? "这里记录了我如何从观察、表达与执行，逐渐走向系统，也记录了一些工作之外的我。" : "A closer look at how observation, expression and execution gradually became systems — and what exists beyond the work."}</p>
      <AboutIndex />
    </section>
  </main>;
}
