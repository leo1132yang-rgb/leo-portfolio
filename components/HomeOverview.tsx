"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { aboutHref, aboutSections } from "@/data/aboutSections";

export function HomeOverview({ onViewProjects, onViewLibrary }: { onViewProjects: () => void; onViewLibrary?: () => void }) {
  const { language } = useLanguage();
  const cn = language === "cn";

  return <>
    <section id="about-index" className="editorial-chapter-index">
      <header><p className="editorial-kicker">02—06 / PERSONAL INDEX</p><h2>{cn ? "继续认识 Leo" : "Continue Knowing Leo"}</h2><p>{cn ? "从学习与职业现场，到方法、系统与个人生活。" : "From learning and professional practice to method, systems and the personal side."}</p></header>
      <div className="editorial-chapter-list">
        {aboutSections.map((chapter) => <Link key={chapter.slug} href={aboutHref(chapter.slug)}>
          <span>{chapter.number}</span><strong>{cn ? chapter.cn : chapter.en}</strong><p>{cn ? chapter.cnNote : chapter.enNote}</p><em>{chapter.tag}</em><i>→</i>
        </Link>)}
      </div>
    </section>
    <section className="editorial-work-split">
      <div><p className="editorial-kicker">SELECTED WORK</p><h2>{cn ? "把想法带到真实现场。" : "Bring ideas into the real world."}</h2><button type="button" onClick={onViewProjects}>{cn ? "查看项目作品" : "View Projects"} →</button></div>
      <div><p>LEO / WORK INDEX</p><span>{cn ? "活动、视觉、视频与持续整理中的项目档案。" : "Events, visual work, moving images and an evolving project archive."}</span></div>
    </section>
    <section className="editorial-final-note">
      <p>{cn ? <>看不见的根系，<br />决定了看得见的繁茂。</> : <>Invisible roots<br />shape visible growth.</>}</p>
      <div><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{cn ? "回到首页" : "Back to Top"} ↑</button><button type="button" onClick={onViewProjects}>{cn ? "查看项目作品" : "View Projects"} →</button>{onViewLibrary && <button type="button" onClick={onViewLibrary}>{cn ? "进入 AI 知识库" : "Enter AI Library"} →</button>}</div>
    </section>
  </>;
}
