"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteNavbar } from "@/components/layout/SiteNavbar";

type IconName = "arrow" | "menu" | "close";
function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, "aria-hidden": true };
  if (name === "menu") return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === "close") return <svg {...props}><path d="M6 6l12 12M18 6 6 18" /></svg>;
  return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

const tools = [
  { name: "Photoshop", icon: "/icons/tools/photoshop.png" }, { name: "Premiere", icon: "/icons/tools/premiere.png" },
  { name: "Illustrator", icon: "/icons/tools/illustrator.png" }, { name: "Lightroom", icon: "/icons/tools/lightroom.png" },
  { name: "DaVinci Resolve", icon: "/icons/tools/davinci-resolve.png" }, { name: "剪映", icon: "/icons/tools/jianying.png" }, { name: "Codex", icon: "/icons/tools/codex.png" },
];

export function LeoHero() {
  const { language } = useLanguage(); const cn = language === "cn";
  return <main id="home" className="relative h-screen w-full overflow-hidden bg-black font-geist">
    <video autoPlay muted loop playsInline preload="metadata" className="pointer-events-none absolute h-full w-full object-cover object-[70%_center]" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[.16] via-black/[.08] to-black/[.38]" aria-hidden="true" /><div className="leo-hero__readability" aria-hidden="true" />
    <SiteNavbar variant="hero" />
    <section className="leo-hero__content" aria-label={cn ? "李阳个人介绍" : "Leo personal introduction"}>
      <div className="leo-hero__identity">
        <div className="leo-hero__portrait leo-hero__portrait--illustration animate-[portraitReveal_0.8s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]"><img src="/images/leo-portal-portrait.png" alt={cn ? "李阳 Leo 的深海舷窗头像" : "Leo Li ocean porthole portrait"} /></div>
        <div className="leo-hero__identity-text animate-[fadeSlideUp_0.8s_ease_0.4s_both]">
          <p className="leo-hero__label animate-[fadeSlideUp_0.8s_ease_0.15s_both]"><i />{cn ? "品牌思维 × 视觉表达 × AI 工作流" : "Brand Thinking × Visual Expression × AI Workflow"}</p>
          <h1>{cn ? <>李阳 <span>/</span> Leo</> : "Leo Li"}</h1>
          <p>{cn ? "品牌运营 / 视觉设计 / AI 工作流搭建" : "Brand Operations / Visual Design / AI Workflow"}</p>
          <small className="leo-hero__identity-meta">{cn ? "摄影摄像 · 跨境身份 · 境外留学" : "Photography & Video · Cross-Border Background · Overseas Study"}</small>
        </div>
      </div>
      <div className="leo-hero__copy"><h2 className="animate-[fadeSlideUp_0.8s_ease_0.68s_both]">{cn ? "我从摄影、内容与活动现场出发，逐步走向品牌运营与系统搭建，擅长把创意、内容与执行整合成可持续运转的工作方式。" : "I began with photography, content and live events, and moved toward brand operations and systems—integrating ideas, content and delivery into ways of working that last."}</h2><p className="leo-hero__bio leo-hero__bio--support animate-[fadeSlideUp_0.8s_ease_0.8s_both]">{cn ? "擅长品牌内容、活动执行、视觉设计、系统搭建与 AI 协作。" : "Working across brand content, event execution, visual design, systems and AI collaboration."}</p>
        <div className="leo-hero__tools animate-[fadeSlideUp_0.8s_ease_0.92s_both]"><p>{cn ? "常用工具" : "TOOLS I USE"}</p><div>{tools.map((tool) => <span key={tool.name}><img src={tool.icon} alt="" /><b>{tool.name}</b></span>)}</div></div><div className="leo-hero__actions animate-[fadeSlideUp_0.8s_ease_1s_both]"><Link href="/projects" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.035] sm:px-6 sm:py-3">{cn ? "查看项目作品" : "Explore Work"}<Icon name="arrow" size={16} /></Link><a href="mailto:leoyang1132@outlook.com">{cn ? "联系我" : "Contact"} <span>→</span></a></div></div>
    </section>
  </main>;
}
