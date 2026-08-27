"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { HomeOverview } from "@/components/HomeOverview";
import { SHOW_WECHAT_PLATFORM } from "@/data/publication";

type Tab = "intro" | "projects" | "library";
type Localized = { cn: string; en: string };

const tools = [
  ["Photoshop", "/icons/tools/photoshop.png"], ["Premiere Pro", "/icons/tools/premiere.png"],
  ["Illustrator", "/icons/tools/illustrator.png"], ["Lightroom", "/icons/tools/lightroom.png"],
  ["Animate", "/icons/tools/animate.png"], ["DaVinci Resolve", "/icons/tools/davinci-resolve.png"],
  ["剪映", "/icons/tools/jianying.png"], ["Codex", "/icons/tools/codex.png"],
] as const;

const projects = [
  { href: "/projects/platform", published: SHOW_WECHAT_PLATFORM, cn: "网络运营平台搭建", en: "Operation Platform Setup", noteCn: "内部运营系统与知识协同。", noteEn: "Internal operations and knowledge systems." },
  { href: "/projects/brand-events", published: true, cn: "品牌活动策划", en: "Brand Event Planning", noteCn: "从策划到现场传播的活动实践。", noteEn: "From planning to on-site communication." },
  { href: "/projects/poster-design", published: true, cn: "视觉海报设计", en: "Poster Design", noteCn: "活动、广告与课程视觉作品。", noteEn: "Event, advertising and course visual work." },
  { href: "/projects/videos", published: true, cn: "视频项目", en: "Video Projects", noteCn: "商业传播、活动现场与个人影像。", noteEn: "Commercial, event and personal moving images." },
  { href: "/projects/photography", published: false, cn: "摄影", en: "Photography", noteCn: "内容正在整理中。", noteEn: "Currently being prepared." },
  { href: "/projects/articles", published: false, cn: "个人文章", en: "Personal Articles", noteCn: "内容正在整理中。", noteEn: "Currently being prepared." },
];

const libraryItems: Localized[] = [
  { cn: "AI 工作流", en: "AI Workflows" }, { cn: "内容协同", en: "Content Collaboration" },
  { cn: "知识管理", en: "Knowledge Management" }, { cn: "系统搭建", en: "System Building" },
];

function copyText(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

export function PortfolioShell() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  const [copied, setCopied] = useState<string | null>(null);
  const cn = language === "cn";

  useEffect(() => {
    const sync = () => setActiveTab(window.location.hash === "#projects" ? "projects" : window.location.hash === "#ai-library" ? "library" : "intro");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    const hash = tab === "projects" ? "#projects" : tab === "library" ? "#ai-library" : "";
    if (hash) window.location.hash = hash;
    else window.history.pushState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const copy = async (key: string, value: string) => { await copyText(value); setCopied(key); window.setTimeout(() => setCopied(null), 1500); };

  return <main className="editorial-site">
    <header className="editorial-nav">
      <button type="button" className="editorial-brand" onClick={() => switchTab("intro")} aria-label="Leo">LEO<span>.</span></button>
      <nav aria-label={cn ? "主导航" : "Main navigation"}>
        {([ ["intro", cn ? "首页" : "Home"], ["projects", cn ? "项目作品" : "Projects"], ["library", "AI Library"] ] as const).map(([id, label]) => <button key={id} type="button" className={activeTab === id ? "is-active" : ""} onClick={() => switchTab(id)}>{label}</button>)}
      </nav>
      <LanguageSwitch />
    </header>

    {activeTab === "intro" && <>
      <section className="editorial-hero">
        <div className="editorial-hero-copy editorial-reveal">
          <p className="editorial-kicker">01 / LEO</p>
          <p className="editorial-name">{cn ? "李阳 / Leo" : "Li Yang / Leo"}</p>
          <h1>{cn ? <>把创意<br />落地，<br />让系统<br />运转。</> : <>Make ideas<br />real.<br />Keep systems<br />running.</>}</h1>
          <p className="editorial-hero-intro">{cn ? "品牌运营 · 网络运营 · 视觉设计 · 活动执行 · AI 工作流 · 系统建设" : "Brand operations · Network operations · Visual design · Event delivery · AI workflows · System building"}</p>
          <div className="editorial-contact-index">
            {[ ["微信", "Leo1132Yang"], ["电话", "+86 15707010027 / +852 61069008"], ["邮箱", "leoyang1132@outlook.com"] ].map(([label, value]) => <button type="button" key={label} onClick={() => copy(label, value)}><span>{label}</span><b>{copied === label ? (cn ? "已复制" : "Copied") : value}</b></button>)}
          </div>
        </div>
        <div className="editorial-hero-portrait editorial-reveal editorial-reveal--late">
          <div className="editorial-blue-block" /><div className="editorial-orange-bar" />
          <Image src="/images/leo-profile.jpg" alt={cn ? "李阳 Leo 个人形象照" : "Portrait of Li Yang / Leo"} fill priority sizes="(max-width: 900px) 100vw, 48vw" className="object-cover object-[58%_center]" />
          <p>LEO / 01</p>
        </div>
        <div className="editorial-tools"><span>TOOLS I USE</span>{tools.map(([name, src]) => <span title={name} key={name}><Image src={src} alt={name} width={26} height={26} /></span>)}</div>
      </section>
      <HomeOverview onViewProjects={() => switchTab("projects")} onViewLibrary={() => switchTab("library")} />
    </>}

    {activeTab === "projects" && <section id="projects" className="editorial-project-index">
      <header><p className="editorial-kicker">PROJECTS / SELECTED WORK</p><h1>{cn ? "项目作品" : "Projects"}</h1><p>{cn ? "正在完成的项目、视觉与现场实践。" : "Projects, visual work and moments brought into the real world."}</p></header>
      <div className="editorial-project-list">{projects.filter((item) => item.published !== false || item.href !== "/projects/platform").map((item, index) => item.published ? <Link href={item.href} key={item.href}><span>0{index + 1}</span><strong>{cn ? item.cn : item.en}</strong><p>{cn ? item.noteCn : item.noteEn}</p><i>{cn ? "查看项目" : "View Project"} →</i></Link> : <div className="is-soon" key={item.href}><span>0{index + 1}</span><strong>{cn ? item.cn : item.en}</strong><p>{cn ? item.noteCn : item.noteEn}</p><i>{cn ? "待更新" : "Coming Soon"}</i></div>)}</div>
    </section>}

    {activeTab === "library" && <section id="ai-library" className="editorial-library">
      <p className="editorial-kicker">AI LIBRARY / NOTES</p><h1>AI Library</h1><p>{cn ? "把工作中的学习、方法和可复用流程慢慢整理成档案。" : "An evolving archive of learning, methods and reusable working processes."}</p>
      <div>{libraryItems.map((item, index) => <article key={item.en}><span>0{index + 1}</span><h2>{cn ? item.cn : item.en}</h2><p>{cn ? "待更新" : "Coming Soon"}</p></article>)}</div>
    </section>}
  </main>;
}
