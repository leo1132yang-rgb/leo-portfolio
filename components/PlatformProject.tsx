"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteNavbar } from "@/components/layout/SiteNavbar";

type Copy = { cn: string; en: string };

const stages: Array<{ title: Copy; body: Copy }> = [
  { title: { cn: "需求梳理", en: "Discovery" }, body: { cn: "组织结构与使用场景整理", en: "Organisation and use-case mapping" } },
  { title: { cn: "架构设计", en: "Architecture" }, body: { cn: "企业微信后台与学习体系规划", en: "WeCom and learning-system planning" } },
  { title: { cn: "系统搭建", en: "Implementation" }, body: { cn: "权限、内容、知识库与功能配置", en: "Permissions, content and feature setup" } },
  { title: { cn: "上线运营", en: "Operations" }, body: { cn: "日常管理、IT 支持与问题处理", en: "Daily management and IT support" } },
  { title: { cn: "持续迭代", en: "Iteration" }, body: { cn: "内容协作、AI 工作流与系统优化", en: "Content, AI workflows and optimisation" } },
];

const responsibilities: Copy[] = [
  { cn: "企业微信后台架构与日常管理", en: "WeCom architecture and administration" },
  { cn: "500+ 人线上学习体系搭建", en: "Learning system for 500+ colleagues" },
  { cn: "AI 知识库整理与维护", en: "AI knowledge-base curation" },
  { cn: "视频 / 文章 / 公告内容协作", en: "Video, article and notice coordination" },
  { cn: "IT 问题处理与平台支持", en: "IT troubleshooting and platform support" },
  { cn: "AI 工作流与系统化运营推进", en: "AI workflow and systematic operations" },
];

const deliveries: Copy[] = [
  { cn: "约 500 人企业微信后台架构", en: "WeCom architecture for about 500 people" },
  { cn: "面向 500+ 前线同事的线上学习体系", en: "Online learning for 500+ frontline colleagues" },
  { cn: "AI 知识库与内容整理机制", en: "AI knowledge and content system" },
  { cn: "日常平台管理与 IT 支持流程", en: "Platform administration and IT support process" },
  { cn: "视频 / 文章 / 公告协作机制", en: "Video, article and notice workflow" },
  { cn: "持续迭代的 AI 工作流", en: "Continuously evolving AI workflows" },
];

const selectedProjects = [
  { number: "01", title: { cn: "企业微信后台架构搭建", en: "WeCom Architecture" }, body: { cn: "从 0 到 1 搭建约 500 人组织架构，负责权限、通讯录、后台管理与日常维护。", en: "Built an organisation of about 500 people from scratch, including permissions, contacts and daily administration." }, image: "/cases/wechat-system/01_selected-images/01_terminal-office-system.png" },
  { number: "02", title: { cn: "线上学习系统", en: "Online Learning System" }, body: { cn: "为 500+ 前线同事提供课程、学习与知识获取入口，降低培训与信息传递成本。", en: "Created a learning and knowledge entry point for 500+ frontline colleagues." }, image: "/cases/wechat-system/01_selected-images/03_online-classroom.png" },
  { number: "03", title: { cn: "AI 知识库与运营支持", en: "AI Knowledge & Support" }, body: { cn: "整理 AI 知识内容，协调视频、文章、公告及日常 IT 支持。", en: "Curated AI knowledge and coordinated content publishing and daily IT support." }, image: "/cases/wechat-system/01_selected-images/02_ai-knowledge-base.png" },
];

const platformOverviewImage = "/projects/network-platform/enterprise-operation-hub-overview.png";

function LineIcon({ type }: { type: "structure" | "learning" | "knowledge" | "support" | "content" | "workflow" }) {
  const paths = {
    structure: <><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
    learning: <><path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M6 9v6c3 3 9 3 12 0V9M21 7v6"/></>,
    knowledge: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z"/></>,
    support: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2M4.5 4.5 7 7M19.5 4.5 17 7"/></>,
    content: <><path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5M8 12h8M8 16h6"/></>,
    workflow: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4M8 18h4a4 4 0 0 0 4-4"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

export function PlatformProject() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const text = (value: Copy) => value[language];

  return (
    <main className="platform-case">
      <SiteNavbar />
      <div className="platform-case__shell">
        <header className="platform-case__topline">
          <Link href="/projects">← <span>{cn ? "项目作品" : "Projects"}</span></Link>
          <p>{cn ? "网络运营平台搭建" : "Network Platform Building"}</p>
          <b>02 <i>/ 07</i></b>
        </header>

        <div className="platform-case__columns">
          <section className="platform-case__visual" aria-label={cn ? "系统整体概览" : "System overview"}>
            <img
              className="platform-case__visual-image"
              src={platformOverviewImage}
              alt={cn ? "企业运营中台系统概览" : "Enterprise operation hub system overview"}
            />
          </section>

          <section className="platform-case__story">
            <header className="platform-case__intro"><p>PLATFORM BUILDING</p><h2>{cn ? "网络运营平台搭建" : "Network Platform Building"}</h2><span>{cn ? "围绕约 500 人企业微信后台架构，搭建线上学习系统、AI 知识库与日常运营支持体系，让内容、平台与团队协作能够稳定运转。" : "A WeCom architecture for about 500 people, connecting online learning, AI knowledge and daily operational support into one stable working system."}</span></header>
            <dl className="platform-case__meta">
              <div><dt>ROLE</dt><dd>{cn ? "网络运营部主管" : "Network Operations Lead"}<small>Platform &amp; Operations</small></dd></div>
              <div><dt>YEAR</dt><dd>2025 — NOW</dd></div>
              <div><dt>SCALE</dt><dd>500+ USERS</dd></div>
            </dl>
            <div className="platform-case__tags">{[cn ? "企业微信后台" : "WeCom Backend", cn ? "学习系统" : "Learning System", cn ? "AI 知识库" : "AI Knowledge", cn ? "IT 支持" : "IT Support"].map((tag) => <span key={tag}>{tag}</span>)}</div>
            <section className="platform-case__selected">
              <header><p>{cn ? "精选项目" : "SELECTED SYSTEMS"}</p><span>03 / SYSTEM MODULES</span></header>
              <div>{selectedProjects.map((project) => <article key={project.number}><div className="platform-case__project-image"><img src={project.image} alt="" /></div><span>{project.number}</span><h3>{text(project.title)}</h3><p>{text(project.body)}</p></article>)}</div>
            </section>
          </section>

          <aside className="platform-case__details">
            <section className="platform-case__timeline"><h2>{cn ? "项目详情" : "PROJECT STAGES"}</h2><ol>{stages.map((stage, index) => <li key={stage.title.en} className={index === 0 ? "is-current" : ""}><i /><div><b>{text(stage.title)}</b><span>{text(stage.body)}</span></div></li>)}</ol></section>
            <section className="platform-case__list"><h2>{cn ? "我的职责" : "MY ROLE"}</h2><ul>{responsibilities.map((item, index) => <li key={item.cn}><LineIcon type={(["structure","learning","knowledge","content","support","workflow"] as const)[index]} /><span>{text(item)}</span></li>)}</ul></section>
            <section className="platform-case__list platform-case__list--delivery"><h2>{cn ? "交付成果" : "DELIVERABLES"}</h2><ul>{deliveries.map((item) => <li key={item.cn}><i>✓</i><span>{text(item)}</span></li>)}</ul></section>
          </aside>
        </div>

        <footer className="platform-case__pager">
          <Link href="/projects">← <span>{cn ? "上一页" : "Previous"}</span></Link>
          <div><b>02</b><i /><i className="is-current" /><i /><i /><i /><i /><small>/ 07</small></div>
          <Link href="/projects/brand-events"><span>{cn ? "下一页" : "Next"}</span> →</Link>
        </footer>
      </div>
    </main>
  );
}
