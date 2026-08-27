"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { aboutHref, aboutSections } from "@/data/aboutSections";

export function AboutIndex() {
  const { language } = useLanguage();
  return <div className="mt-10 divide-y divide-white/[.09] border-y border-white/[.09]">
    {aboutSections.map((section) => <Link key={section.slug} href={aboutHref(section.slug)} className="group grid min-h-[72px] grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 py-4 transition-[background-color,color] duration-200 hover:bg-white/[.025] sm:grid-cols-[58px_minmax(0,1fr)_110px_24px] sm:gap-5">
      <span className="font-mono text-[10px] text-white/35 transition-colors group-hover:text-[#91A7FF]">{section.number}</span>
      <span><strong className="block text-[15px] font-medium text-[#D9DFEC] transition-colors group-hover:text-white">{language === "cn" ? section.cn : section.en}</strong><small className="mt-1 block text-[11px] leading-5 text-[#858EA0]">{language === "cn" ? section.cnNote : section.enNote}</small></span>
      <span className="hidden font-mono text-[9px] tracking-[.12em] text-[#737D91] sm:block">{section.tag}</span><span className="text-[#91A7FF]/70 transition-transform group-hover:translate-x-[3px]">→</span>
    </Link>)}
  </div>;
}
