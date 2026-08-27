"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { SunMark } from "@/components/SunMark";
import { JourneySection } from "@/components/JourneySection";
import { HomeOverview } from "@/components/HomeOverview";
import { SHOW_WECHAT_PLATFORM } from "@/data/publication";

type Tab = "intro" | "projects" | "library";

const navItems: { id: Tab; cn: string; en: string }[] = [
  { id: "intro", cn: "关于我", en: "Intro" },
  { id: "projects", cn: "项目作品", en: "Projects" },
  { id: "library", cn: "AI 知识库", en: "AI Library" },
];

const identityTags = {
  cn: ["品牌运营", "视觉设计", "活动执行", "AI 工作流", "系统建设", "内容协同", "摄影师"],
  en: ["Brand Operation", "Visual Design", "Event Execution", "AI Workflow", "System Builder", "Content Collaboration", "Photographer"],
};

const heroCurrentStatuses = [
  { cn: "正在搭建属于自己的小世界。", en: "Building my own little world." },
  { cn: "最近在学游泳。", en: "Learning to swim." },
  { cn: "下一站：潜水证。", en: "Next: Diving certification." },
  { cn: "愿望清单：哈苏胶片机。", en: "Wishlist: Hasselblad." },
];

type ContactKind = "wechat" | "phone" | "email";

const contacts: {
  kind: ContactKind;
  label: string;
  value: string;
  align: "left" | "center" | "right";
}[] = [
  { kind: "wechat", label: "微信", value: "Leo1132Yang", align: "left" },
  { kind: "phone", label: "手机", value: "+86 15707010027 / +852 61069008", align: "center" },
  { kind: "email", label: "邮箱", value: "leoyang1132@outlook.com", align: "right" },
];

const tools = [
  { name: "Photoshop", src: "/icons/tools/photoshop.png" },
  { name: "Premiere Pro", src: "/icons/tools/premiere.png" },
  { name: "Illustrator", src: "/icons/tools/illustrator.png" },
  { name: "Lightroom", src: "/icons/tools/lightroom.png" },
  { name: "Animate", src: "/icons/tools/animate.png" },
  { name: "DaVinci Resolve", src: "/icons/tools/davinci-resolve.png" },
  { name: "剪映", src: "/icons/tools/jianying.png" },
  { name: "Codex", src: "/icons/tools/codex.png" },
];

const projectCategories: {
  number: string;
  cn: { title: string; summary: string; status: string };
  en: { title: string; summary: string; status: string };
  href: string;
  accent: string;
  symbol: string;
  available: boolean;
  published?: boolean;
}[] = [
  {
    number: "01",
    cn: { title: "网络运营平台搭建", summary: "整合信息、知识、课程与团队服务，搭建可持续使用的内部运营入口。", status: "1 个真实项目" },
    en: { title: "Operation Platform Setup", summary: "Integrating information, knowledge, learning and team services into a sustainable internal operation platform.", status: "1 Published Project" },
    href: "/projects/platform",
    accent: "#38D5E8",
    symbol: "◇",
    available: true,
    published: SHOW_WECHAT_PLATFORM,
  },
  {
    number: "02",
    cn: { title: "品牌活动策划", summary: "从目标、视觉、现场到传播，沉淀可复盘、可持续的活动资产。", status: "5 个项目入口" },
    en: { title: "Brand Event Planning", summary: "Turning objectives, visuals, on-site execution and communication into reusable event assets.", status: "5 Project Entries" },
    href: "/projects/brand-events",
    accent: "#D8A84E",
    symbol: "●",
    available: true,
  },
  {
    number: "03",
    cn: { title: "视觉海报设计", summary: "整理活动广告、线下物料与课程传播场景中的视觉设计。", status: "2 个子板块" },
    en: { title: "Poster Design", summary: "Visual design for event advertising, offline materials and learning communication.", status: "2 Sections" },
    href: "/projects/poster-design",
    accent: "#C084FC",
    symbol: "✦",
    available: true,
  },
  {
    number: "04",
    cn: { title: "视频项目", summary: "记录活动现场、商业传播、动画创作与日常影像表达。", status: "4 个子板块" },
    en: { title: "Video Projects", summary: "Documenting event scenes, commercial communication, animation and everyday visual stories.", status: "4 Sections" },
    href: "/projects/videos",
    accent: "#7C8CFF",
    symbol: "▶",
    available: true,
  },
  {
    number: "05",
    cn: { title: "摄影", summary: "以摄影记录大型活动现场，也持续整理个人影像观察。", status: "2 个子板块" },
    en: { title: "Photography", summary: "Photographing large-scale events while continuing personal visual observation.", status: "2 Sections" },
    href: "/projects/photography",
    accent: "#8FA36A",
    symbol: "◎",
    available: false,
  },
  {
    number: "06",
    cn: { title: "个人文章", summary: "沉淀工作思考、品牌观察、AI 学习记录、摄影文字与项目复盘。", status: "文章列表预留" },
    en: { title: "Personal Articles", summary: "Notes on brand operation, AI learning, photography and project reflection.", status: "Article Archive" },
    href: "/projects/articles",
    accent: "#E8DCC2",
    symbol: "✎",
    available: false,
  },
];

const libraryItems = [
  ["01", "AI 工具使用记录", "AI Tool Notes"],
  ["02", "提示词模板", "Prompt Templates"],
  ["03", "内容生成流程", "Content Generation Workflow"],
  ["04", "知识库搭建方法", "Knowledge Base Building"],
  ["05", "团队协作流程", "Team Collaboration Workflow"],
  ["06", "个人学习笔记", "Personal Learning Notes"],
];

const quotes = {
  cn: ["把创意落地，让系统运转。", "先了解，再动手。", "看不见的根系，决定了看得见的繁茂。", "系统会带领团队走向强大。", "先成为枢纽，再成为风。"],
  en: ["Turn ideas into execution. Let systems keep running.", "Understand first, then take action.", "Invisible roots decide visible growth.", "Systems lead teams toward strength.", "Become the hub first, then become the wind."],
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const introGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease } },
};
const welcomeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.68, ease, delay: 0.08 } },
};
const cardGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease } },
};

export function PortfolioShell() {
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  // Kept for the archived in-file content below; the public homepage no longer renders it.
  const journeyRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const syncTabWithHash = () => {
      if (window.location.hash === "#projects") {
        setActiveTab("projects");
      } else if (window.location.hash === "#ai-library") {
        setActiveTab("library");
      } else {
        setActiveTab("intro");
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    syncTabWithHash();
    window.addEventListener("hashchange", syncTabWithHash);
    return () => window.removeEventListener("hashchange", syncTabWithHash);
  }, []);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    const nextHash = tab === "projects" ? "#projects" : tab === "library" ? "#ai-library" : "";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const exploreJourney = () => { window.location.href = "/profile"; };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#161719] text-[#F1EFE9]">
      <div className="noise" />
      <div className="ambient-orb ambient-orb-cyan" />
      <div className="ambient-orb ambient-orb-violet" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#11131B]/[.97]">
        <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <motion.button
            type="button"
            onClick={() => switchTab("intro")}
            whileHover={{ y: -2, borderColor: "rgba(170,182,206,.35)", backgroundColor: "rgba(170,182,206,.045)", boxShadow: "0 0 12px rgba(170,182,206,.04)" }}
            whileTap={{ scale: 0.97 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#AAB6CE]/20 bg-[#AAB6CE]/[.045] text-[#AAB6CE]"
            aria-label="返回关于我"
          >
            <SunMark />
          </motion.button>

          <nav className="flex items-center gap-2 sm:gap-5 md:gap-8">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => switchTab(item.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-1 py-2 text-left transition ${active ? "text-[#F7F7FF]" : "text-[#74758D] hover:text-[#C7C8D8]"}`}
                >
                  <span className="block text-[10px] font-medium sm:text-xs">{language === "cn" ? item.cn : item.en}</span>
                  <span className="mt-1 hidden text-[8px] text-current opacity-55 md:block">{language === "cn" ? item.en : item.cn}</span>
                  {active && <motion.i layoutId="active-nav" transition={{ duration: 0.38, ease }} className="nav-glow-line absolute inset-x-1 -bottom-[11px] h-px bg-[#AAB6CE]" />}
                </motion.button>
              );
            })}
          </nav>

          <LanguageSwitch />
        </div>
      </header>

        {activeTab === "intro" && (
          <div className="panel-enter">
            <IntroPanel
              journeyRef={journeyRef}
              onExplore={exploreJourney}
              onViewProjects={() => switchTab("projects")}
              onViewLibrary={() => switchTab("library")}
            />
          </div>
        )}
        {activeTab === "projects" && (
          <div className="panel-enter">
            <ProjectsPanel />
          </div>
        )}
        {activeTab === "library" && (
          <div className="panel-enter">
            <LibraryPanel />
          </div>
        )}
    </main>
  );
}

function IntroPanel({
  journeyRef,
  onExplore,
  onViewProjects,
  onViewLibrary,
}: {
  journeyRef: React.RefObject<HTMLDivElement | null>;
  onExplore: () => void;
  onViewProjects: () => void;
  onViewLibrary: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState<ContactKind | null>(null);
  const [heroStatusIndex, setHeroStatusIndex] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    setHeroStatusIndex(Math.floor(Math.random() * heroCurrentStatuses.length));
  }, []);
  const contactLabels: Record<ContactKind, string> = language === "cn"
    ? { wechat: "微信", phone: "手机", email: "邮箱" }
    : { wechat: "WeChat", phone: "Phone", email: "Email" };
  const journeyItems = language === "cn"
    ? [
        ["摄影起点", "我的起点来自摄影。摄影让我学会观察，也让我开始理解画面、情绪、人物和现场之间的关系。它不只是记录，而是一种看见“看不见”的能力。后来，这种观察力逐渐延伸到视觉设计、活动现场、品牌内容和运营系统之中。"],
        ["品牌实践", "在品牌运营工作中，我开始意识到，真正重要的不是某一次灵感，而是让灵感被组织、被执行、被记录，并最终成为团队可以复用的资产。"],
        ["2025 之后", "我的工作重心进一步从“完成任务”转向“搭建系统”。我开始从 0 到 1 搭建企业微信后台，整理 AI 知识库，协同团队完成视频、文章、公告和内部内容输出，也逐渐意识到系统会带领团队走向强大。"],
        ["AI 协作", "AI 对我来说，不只是提高效率的工具，而是能力的望远镜。它可以帮助我更快整理信息、生成初稿、搭建流程，但真正决定方向、审美、情绪和判断的，仍然是人。"],
      ]
    : [
        ["Photography", "My journey started with photography. It taught me how to observe and understand the relationship between images, emotions, people and scenes. This ability gradually extended into visual design, event execution, brand content and operational systems."],
        ["Brand Practice", "Through brand operation work, I realized that what truly matters is not a single moment of inspiration, but how it can be organized, executed, recorded and turned into reusable assets for the team."],
        ["After 2025", "My focus shifted from completing tasks to building systems. I started building a WeCom backend from scratch, organizing an AI knowledge base, and coordinating videos, articles, announcements and internal content."],
        ["AI Collaboration", "AI is not only a tool for efficiency, but a telescope for ability. It helps me organize information, generate drafts and build workflows faster, while direction, taste, emotion and judgment still come from people."],
      ];
  const workSteps = language === "cn"
    ? ["理解问题", "梳理结构", "推动落地", "沉淀系统"]
    : ["Understand the problem", "Structure the information", "Push execution forward", "Build reusable systems"];

  const handlePhotoMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: x * 3.5, y: y * -3.5 });
  };

  const copyContact = async (kind: ContactKind, value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopied(kind);
      window.setTimeout(() => setCopied((current) => (current === kind ? null : current)), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section className="intro-surface">
      <div className="intro-hero mx-auto max-w-[1240px] px-5 pb-10 pt-28 sm:px-6 md:px-10 md:pb-12 md:pt-36">
        <div className="grid min-h-[calc(100vh-9rem)] items-center gap-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <motion.div variants={introGroup} initial="hidden" animate="show" className="max-w-[650px]">
            <motion.div variants={fadeUp} className="field-note-marker flex items-center gap-3 text-[9px] uppercase tracking-[.18em] text-[#748DBA]">
              <span className="h-px w-7 bg-[#748DBA]/70" />
              01 / INTRO
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-7 text-[clamp(4.8rem,10vw,9rem)] font-semibold leading-[.86] tracking-[-.075em] text-[#1B1C1E]">
              {language === "cn" ? "李阳" : "Li Yang"}
              <span className="mt-5 block text-[clamp(2.5rem,5vw,4.5rem)] font-normal tracking-[-.045em] text-[#8A867E]">Leo</span>
            </motion.h1>
            <motion.p
              variants={welcomeUp}
              className="mt-9 inline-block text-[15px] font-medium tracking-[.06em] text-[#55534E] md:text-[17px]"
            >
              {language === "cn" ? "把创意落地，让系统运转。" : "Turn ideas into execution. Let systems keep running."}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1B1C1E]/10 bg-white/[.48] px-3 py-2 text-[9px] tracking-[.1em] text-[#8A867E] backdrop-blur-[10px]">
              <i className="h-1.5 w-1.5 rounded-full bg-[#648C7E]" />
              <span className="uppercase text-[#748DBA]">{language === "cn" ? "当前" : "Currently"}</span>
              <span className="text-[#55534E]">{heroCurrentStatuses[heroStatusIndex][language]}</span>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-5 max-w-[590px] text-sm leading-8 text-[#55534E] md:text-[15px]">
              {language === "cn" ? "我帮助团队把创意、内容、活动、AI 与系统连接起来，" : "I help teams connect brand, content, events, AI and systems,"}
              <br className="hidden sm:block" />
              {language === "cn" ? "让项目真正落地，并沉淀为长期价值。" : "turning ideas into real execution and long-term value."}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
              {identityTags[language].map((tag) => (
                <motion.span whileHover={{ y: -4, borderColor: "rgba(116,141,186,.32)", color: "#1B1C1E", backgroundColor: "rgba(255,255,255,.62)" }} key={tag} className="rounded-full border border-[#1B1C1E]/10 bg-white/[.40] px-3 py-1.5 text-[8px] uppercase tracking-[.1em] text-[#8A867E]">{tag}</motion.span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7">
              <p className="mb-3 text-[8px] uppercase tracking-[.16em] text-[#8A867E]">{language === "cn" ? "常用工具" : "Tools I Use"}</p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <motion.div
                    key={tool.name}
                    whileHover={{ y: -3, borderColor: "rgba(116,141,186,.32)", backgroundColor: "rgba(255,255,255,.62)" }}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#1B1C1E]/10 bg-white/[.40]"
                  >
                    <Image src={tool.src} alt={tool.name} width={28} height={28} className="h-7 w-7 object-contain" />
                    <span className="pointer-events-none absolute bottom-[calc(100%+9px)] left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-white/10 bg-[#121225] px-3 py-2 text-[9px] text-[#F7F7FF] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,.28)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                      {tool.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7 flex items-center gap-3">
              {contacts.map((contact) => {
                const isCopied = copied === contact.kind;
                const alignClass =
                  contact.align === "left"
                    ? "left-0"
                    : contact.align === "right"
                      ? "right-0"
                      : "left-1/2 -translate-x-1/2";
                return (
                  <div key={contact.kind} className="group relative">
                    <motion.button
                      type="button"
                      aria-label={`${language === "cn" ? "复制" : "Copy"} ${contactLabels[contact.kind]}: ${contact.value}`}
                      onClick={() => copyContact(contact.kind, contact.value)}
                      whileHover={{ y: -4, borderColor: "rgba(170,182,206,.38)", color: "#D6D7D4", backgroundColor: "rgba(170,182,206,.05)" }}
                      whileTap={{ scale: 0.96 }}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1B1C1E]/10 bg-white/[.40] text-[#8A867E] transition-colors focus:outline-none focus:ring-1 focus:ring-[#748DBA]/40"
                    >
                      <ContactIcon kind={contact.kind} />
                    </motion.button>
                    <span
                      role="status"
                      className={`${alignClass} pointer-events-none absolute bottom-[calc(100%+10px)] z-20 whitespace-nowrap rounded-lg border border-white/10 bg-[#121225] px-3 py-2 text-[9px] text-[#F7F7FF] shadow-[0_8px_24px_rgba(0,0,0,.28)] transition-all duration-200 ${
                        isCopied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      }`}
                    >
                      {isCopied ? (language === "cn" ? "已复制" : "Copied") : contact.value}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <motion.button whileHover={{ y: -4, backgroundColor: "#6078AC" }} whileTap={{ scale: 0.98 }} type="button" onClick={onExplore} className="rounded-xl bg-[#536A9B] px-5 py-3 text-[10px] font-semibold text-[#F7F4ED]">
                {language === "cn" ? "查看个人履历" : "View Career Profile"} ↓
              </motion.button>
              <motion.button whileHover={{ y: -4, borderColor: "rgba(116,141,186,.42)", color: "#1B1C1E", backgroundColor: "rgba(255,255,255,.48)" }} whileTap={{ scale: 0.98 }} type="button" onClick={onViewProjects} className="rounded-xl border border-[#1B1C1E]/15 px-5 py-3 text-[10px] text-[#55534E]">
                {language === "cn" ? "查看项目作品" : "View Projects"} →
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.965, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: tilt.y, rotateY: tilt.x }}
            transition={{ duration: 0.75, delay: 0.18, ease }}
            whileHover={{ y: -4, borderColor: "rgba(27,28,30,.18)" }}
            onMouseMove={handlePhotoMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ transformPerspective: 1100 }}
            className="photo-card relative mx-auto w-full max-w-[500px] overflow-hidden rounded-[28px] border border-[#1B1C1E]/10 bg-[#EAE7E0]"
          >
            <div className="relative aspect-[4/5]">
              <Image src="/images/leo-profile.jpg" alt={language === "cn" ? "李阳 Leo 个人形象照" : "Portrait of Li Yang / Leo"} fill priority sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-[58%_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#34322E]/42 via-transparent to-transparent" />
              <div aria-hidden="true" className="pointer-events-none absolute left-5 top-5 h-5 w-5 border-l border-t border-white/40" />
              <div aria-hidden="true" className="pointer-events-none absolute right-5 top-5 h-5 w-5 border-r border-t border-white/40" />
              <div aria-hidden="true" className="pointer-events-none absolute bottom-14 left-5 h-5 w-5 border-b border-l border-white/30" />
              <div aria-hidden="true" className="pointer-events-none absolute bottom-14 right-5 h-5 w-5 border-b border-r border-white/30" />
              <span aria-hidden="true" className="absolute right-6 top-7 font-mono text-[8px] tracking-[.16em] text-white/45">35MM / ISO 400</span>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6 text-[8px] uppercase tracking-[.14em] text-white/55">
              <span>Li Yang / Leo</span>
              <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-[#86B8A8]" />{language === "cn" ? "开放合作中" : "Open to Collaboration"}</span>
            </figcaption>
          </motion.figure>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.62, ease }}
          className="field-note-transition mx-auto max-w-[760px] pb-4 pt-8 text-sm leading-8 md:pt-12"
        >
          {language === "cn"
            ? <>我最早从摄影里学会观察，<br />后来才慢慢学会表达、执行与建立系统。</>
            : <>Photography first taught me to observe.<br />Everything after that taught me to express, execute and build systems.</>}
        </motion.p>

        <HomeOverview onViewProjects={onViewProjects} />

        {false && <>
        <JourneySection
          journeyRef={journeyRef}
          onBackTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onViewProjects={onViewProjects}
          onViewLibrary={onViewLibrary}
        />

        <div className="hidden" aria-hidden="true">
          <PanelHeading eyebrow="Journey / About Me" title={language === "cn" ? "从观察开始，走向系统。" : "From observation to systems."} />

          <div className="mt-14 grid gap-10 md:grid-cols-[.7fr_1.3fr]">
            <p className="text-xl leading-[1.7] text-[#E4E4EE] md:text-2xl">
              {language === "cn"
                ? "我是一名有落地经验的品牌运营者，长期参与品牌内容、视觉设计、活动策划、现场执行、企业微信后台和 AI 工作流建设。"
                : "I am a brand operation practitioner with hands-on experience across brand content, visual design, event planning, on-site execution, WeCom platform setup and AI workflow building."}
            </p>
            <div className="space-y-6 text-sm leading-8 text-[#9293AA]">
              <p>{language === "cn" ? "我的工作并不只停留在“做一张海报”“完成一次活动”或“整理一份内容”。我更关注的是，一次创意如何被真正执行，一次活动如何被完整记录，一套流程如何被团队持续复用。" : "My work is not limited to creating a poster, completing an event, or organizing a piece of content. I care more about how an idea is executed, how an event is recorded, and how a workflow can be reused by a team over time."}</p>
              <p>{language === "cn" ? "在工作中，我经常同时连接多个角色：设计、内容、活动、现场、系统、AI 工具和团队协作。我习惯先理解业务和场景，再开始动手，因为我相信只有真正理解问题，设计、内容和执行才不会只是表面工作。" : "In my work, I often connect design, content, events, on-site execution, systems, AI tools and team collaboration. I prefer to understand the business context before taking action, because execution only becomes meaningful when it solves real problems."}</p>
              <p>{language === "cn" ? "对我来说，品牌运营不是单点输出，而是把分散的信息、素材、经验和流程整理成一个可以持续运转的系统。" : "To me, brand operation is not a single output. It is about organizing scattered information, materials, experience and workflows into a system that can keep running."}</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 0.58, ease }} className="mt-28">
            <SubHeading number="01" title={language === "cn" ? "成长路径" : "My Journey"} />
            <div className="mt-10 border-b border-white/10">
              {journeyItems.map(([title, text], index) => (
                <article key={title} className="grid gap-4 border-t border-white/10 py-7 md:grid-cols-[60px_220px_1fr]">
                  <span className="text-[8px] text-[#45D6D8]">0{index + 1}</span>
                  <h3 className="text-base font-medium text-[#DADAE6]">{title}</h3>
                  <p className="text-sm leading-7 text-[#898AA1]">{text}</p>
                </article>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 0.58, ease }} className="mt-28">
            <SubHeading number="02" title={language === "cn" ? "先了解，再动手。" : "Understand first, then take action."} />
            <div className="mt-10 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <div className="space-y-5 text-sm leading-8 text-[#9293AA]">
                <p>{language === "cn" ? "在开始设计、策划或搭建系统之前，我会先理解目标、场景、受众和实际限制。因为任何视觉、内容和工具，最终都要服务于真实问题。" : "Before starting design, planning or system building, I first try to understand the goal, scenario, audience and real constraints. Every visual output, content piece or tool should serve a real problem."}</p>
                <p>{language === "cn" ? "无论是活动策划、视觉设计、企业微信后台，还是 AI 知识库建设，我都会尽量让每一次工作不仅完成当下任务，也能为下一次协作留下可以复用的经验。" : "Whether I am working on event planning, visual design, WeCom setup or an AI knowledge base, I try to solve the current problem while leaving reusable experience for future collaboration."}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {workSteps.map((step, index) => (
                  <motion.div whileHover={{ y: -4, borderColor: "rgba(69,214,216,.3)", backgroundColor: "#15152B" }} key={step} className="rounded-2xl border border-white/10 bg-[#121225] p-5">
                    <span className="text-[8px] text-[#45D6D8]">0{index + 1}</span>
                    <p className="mt-10 text-lg text-[#E0E0EA]">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 0.58, ease }} className="mt-28">
            <SubHeading number="03" title={language === "cn" ? "个人句子" : "Personal Lines"} />
            <div className="mt-10 border-b border-white/10">
              {quotes[language].map((quote, index) => (
                <p key={quote} className={`border-t border-white/10 py-6 tracking-[-.025em] ${index === 0 ? "text-2xl text-[#F7F7FF] md:text-4xl" : "text-lg text-[#76778E] md:text-2xl"}`}>{quote}</p>
              ))}
            </div>
          </motion.div>
        </div>
        </>}
      </div>
      <Footer />
    </section>
  );
}

function ContactIcon({ kind }: { kind: ContactKind }) {
  if (kind === "phone") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8 9.6 9.6 0 0 1-4-.85L3 20l1.35-4A8.1 8.1 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8 8.4 8.4 0 0 1 9 8Z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </svg>
  );
}

function ProjectCategoryCard({
  category,
  onComingSoon,
}: {
  category: (typeof projectCategories)[number];
  onComingSoon: () => void;
}) {
  const { language } = useLanguage();
  const isAvailable = category.available;
  const status = isAvailable
    ? category[language].status
    : language === "cn"
      ? "待更新"
      : "Coming Soon";
  const action = isAvailable
    ? language === "cn"
      ? "查看项目"
      : "View Project"
    : language === "cn"
      ? "即将更新"
      : "Coming Soon";
  const className = `group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#15182A] p-6 text-left transition-[transform,border-color,background-color,opacity] duration-150 ease-out ${
    isAvailable
      ? "border-white/10 hover:-translate-y-[3px] hover:border-white/20 hover:bg-[#191C31]"
      : "border-white/[.08] opacity-75 hover:-translate-y-[2px] hover:border-white/[.16] hover:bg-[#181B2E]"
  }`;
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[9px]" style={{ color: category.accent }}>{category.number}</span>
        <div className="flex items-center gap-3">
          {!isAvailable && (
            <span className="rounded-full border border-white/[.1] bg-white/[.025] px-2 py-1 text-[8px] tracking-[.08em] text-white/55 transition-colors duration-150 group-hover:border-white/[.18] group-hover:text-white/75">
              {status}
            </span>
          )}
          <span className="text-[10px] opacity-40 transition-opacity duration-150 group-hover:opacity-75" style={{ color: category.accent }}>{category.symbol}</span>
          <span className="h-2 w-2 rounded-full opacity-45 transition-opacity duration-150 group-hover:opacity-90" style={{ backgroundColor: category.accent }} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-medium tracking-[-.035em] text-[#EEEEF6]">{category[language].title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#898AA1]">{category[language].summary}</p>
      </div>
      <div className="mt-8 flex items-center justify-between text-[9px]">
        <span className={isAvailable ? "text-white/30" : "text-white/35"}>{status}</span>
        <span className={`project-arrow transition-transform duration-150 ${isAvailable ? "group-hover:translate-x-1" : ""}`} style={{ color: category.accent }}>
          {action} {isAvailable ? "→" : ""}
        </span>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px opacity-35 transition-opacity duration-150 group-hover:opacity-75"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, ${category.accent}, transparent)` }}
      />
    </>
  );

  if (isAvailable) {
    return <Link href={category.href} prefetch={false} className={className}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onComingSoon} className={className} aria-label={`${category[language].title} — ${status}`}>
      {content}
    </button>
  );
}

function ProjectsPanel() {
  const { language } = useLanguage();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const visibleProjectCategories = projectCategories
    .filter((category) => category.published !== false)
    .map((category, index) => ({ ...category, number: String(index + 1).padStart(2, "0") }));

  useEffect(() => {
    if (!showComingSoon) return;
    const timeout = window.setTimeout(() => setShowComingSoon(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [showComingSoon]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0E1220]">
      <div className="relative mx-auto max-w-[1240px] px-5 pb-28 pt-32 sm:px-6 md:px-10 md:pt-40">
        <div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-[9px] uppercase tracking-[.18em] text-[#45D6D8]">
              {language === "cn" ? "精选项目" : "Selected Work"}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-.055em] md:text-6xl">
              {language === "cn" ? "项目作品" : "Projects"}
            </h1>
            <div className="mt-7 h-px w-full max-w-3xl bg-gradient-to-r from-[#38D5E8]/70 via-[#D8A84E]/55 to-[#C084FC]/55 sm:bg-[linear-gradient(90deg,rgba(56,213,232,.7),rgba(216,168,78,.58),rgba(192,132,252,.58),rgba(124,140,255,.58),rgba(143,163,106,.58),rgba(232,220,194,.58))]" />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-8 text-[#9FA0B8]">
            {language === "cn"
              ? "这里整理我参与和完成过的网络运营平台搭建、品牌活动策划、视觉海报设计、视频内容、摄影作品和个人文章。"
              : "This section collects my work across operation platform setup, brand event planning, poster design, video projects, photography and personal articles."}
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjectCategories.map((category) => (
            <ProjectCategoryCard key={category.href} category={category} onComingSoon={() => setShowComingSoon(true)} />
          ))}
        </div>
        {showComingSoon && (
          <div role="status" className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl border border-white/[.12] bg-[#15182A]/95 px-4 py-3 text-[10px] text-[#D7D9E5] shadow-[0_12px_30px_rgba(0,0,0,.22)]">
            {language === "cn" ? "内容正在整理中，敬请期待。" : "This project is currently being prepared."}
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
}

function LibraryPanel() {
  const { language } = useLanguage();
  return (
    <section className="panel-aura min-h-screen">
      <div className="mx-auto max-w-[1240px] px-5 pb-28 pt-32 sm:px-6 md:px-10 md:pt-40">
        <PanelHeading eyebrow="Knowledge & Practice" title={language === "cn" ? "AI Library / AI 知识库" : "AI Library"} />
        <div className="mt-10 grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div className="max-w-[520px] space-y-6 text-sm leading-8 text-[#9FA0B8]">
            <p>{language === "cn" ? "这里将整理我在 AI 工具、内容生成、知识库搭建、提示词模板和团队协作流程中的实践记录。" : "This section will organize my practice notes on AI tools, content generation, knowledge base building, prompt templates and team collaboration workflows."}</p>
            <p className="text-lg leading-8 text-[#D7D7E3]">{language === "cn" ? "我希望把 AI 不只是当作效率工具，而是作为整理经验、放大能力、沉淀方法的工作伙伴。" : "I see AI not only as an efficiency tool, but also as a working partner for organizing experience, expanding capability and building reusable methods."}</p>
          </div>
          <motion.div variants={cardGroup} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
            {libraryItems.map(([number, cn, en]) => (
              <motion.article variants={cardItem} whileHover={{ y: -4, borderColor: "rgba(69,214,216,.3)", backgroundColor: "#1A1E33" }} key={number} className="flex min-h-[190px] flex-col justify-between rounded-2xl border border-white/10 bg-[#15182A]/75 p-5 backdrop-blur-sm">
                <div className="flex justify-between"><span className="text-[8px] text-[#45D6D8]">{number}</span><span className="text-[8px] text-white/20">{language === "cn" ? "待更新" : "Coming Soon"}</span></div>
                <h2 className="text-lg font-medium text-[#DADAE6]">{language === "cn" ? cn : en}</h2>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

function PanelHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-t border-white/10 pt-6">
      <p className="text-[9px] uppercase tracking-[.18em] text-[#45D6D8]">{eyebrow}</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-.055em] md:text-6xl">{title}</h1>
    </div>
  );
}

function SubHeading({ number, title }: { number: string; title: string }) {
  return <div className="flex items-center gap-5 border-t border-white/10 pt-5"><span className="text-[8px] text-[#45D6D8]">{number}</span><h2 className="text-2xl font-medium tracking-[-.035em]">{title}</h2></div>;
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-white/10 px-5 py-7 text-[8px] uppercase tracking-[.12em] text-white/25 sm:px-6 md:flex-row md:justify-between md:px-10">
      <span>© 2026 李阳 Leo</span>
      <span>Brand Operation / Creative / AI Workflow</span>
    </footer>
  );
}
