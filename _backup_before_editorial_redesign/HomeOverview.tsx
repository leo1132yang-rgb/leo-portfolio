"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { aboutHref, aboutSections } from "@/data/aboutSections";

export function HomeOverview({ onViewProjects }: { onViewProjects: () => void }) {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-[1040px] px-5 pb-10 pt-16 sm:px-6 md:px-10 md:pt-24">
      <section id="about-index" className="scroll-mt-24 border-t border-white/[.10] pt-6" aria-labelledby="about-index-title">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[9px] tracking-[.16em] text-[#91A7FF]">ABOUT LEO INDEX</p>
            <h2 id="about-index-title" className="mt-3 text-2xl font-medium tracking-[-.04em] text-[#F5F7FB] md:text-3xl">{language === "cn" ? "继续认识 Leo" : "Continue knowing Leo"}</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#A8AEC5]">{language === "cn" ? "成长、方法、系统与生活，都收录在一份更完整的个人档案里。" : "Journey, method, systems and life — collected in a closer personal archive."}</p>
        </div>
        <div className="mt-8 divide-y divide-white/[.09] border-y border-white/[.09]">
          {aboutSections.map((chapter, index) => (
            <Link key={chapter.slug} href={aboutHref(chapter.slug)} className="group grid min-h-16 grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 py-4 transition-[background-color,color] duration-200 hover:bg-white/[.025] sm:grid-cols-[52px_minmax(0,1fr)_110px_20px] sm:gap-5" style={{ transitionDelay: `${index * 60}ms` }}>
              <span className="font-mono text-[10px] text-white/35 transition-colors duration-200 group-hover:text-[#91A7FF]">{chapter.number}</span>
              <span className="min-w-0"><strong className="block text-[15px] font-medium text-[#D9DFEC] transition-colors duration-200 group-hover:text-white">{language === "cn" ? chapter.cn : chapter.en}</strong><small className="mt-1 block text-[11px] leading-5 text-[#858EA0]">{language === "cn" ? chapter.cnNote : chapter.enNote}</small></span>
              <span className="hidden font-mono text-[9px] tracking-[.12em] text-[#737D91] sm:block">{chapter.tag}</span>
              <span className="text-sm text-[#91A7FF]/70 transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-white/[.10] pt-6 md:mt-28" aria-labelledby="selected-work-title">
        <p className="font-mono text-[9px] tracking-[.16em] text-[#D6A86A]">SELECTED WORK</p>
        <div className="mt-5 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-xl"><h2 id="selected-work-title" className="text-2xl font-medium tracking-[-.04em] text-[#F5F7FB] md:text-3xl">{language === "cn" ? "查看项目作品" : "Selected Work"}</h2><p className="mt-4 text-sm leading-7 text-[#A8AEC5]">{language === "cn" ? "从品牌活动、视觉设计到视频与摄影，这里记录了我真正完成并落地的项目。" : "From brand events and visual design to video and photography — work brought into the real world."}</p></div>
          <button type="button" onClick={onViewProjects} className="shrink-0 rounded-xl border border-[#91A7FF]/30 px-4 py-3 text-[10px] tracking-[.06em] text-[#DDE5FF] transition-[transform,border-color,background-color] duration-160 hover:-translate-y-[2px] hover:border-[#91A7FF]/55 hover:bg-[#91A7FF]/[.08]">{language === "cn" ? "进入项目作品 →" : "View Projects →"}</button>
        </div>
      </section>

      <section className="mt-28 border-t border-white/[.10] py-10 text-center md:mt-36" aria-label={language === "cn" ? "最终短句" : "Final line"}>
        <p className="font-mono text-[8px] tracking-[.16em] text-[#737D91]">FINAL LINE</p>
        <p className="mt-5 text-xl font-medium leading-relaxed tracking-[-.035em] text-[#F3F1EC] md:text-2xl">{language === "cn" ? <>看不见的根系，<br />决定了看得见的繁茂。</> : <>Invisible roots<br />shape visible growth.</>}</p>
      </section>
    </div>
  );
}
