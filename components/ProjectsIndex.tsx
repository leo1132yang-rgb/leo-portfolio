"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { InnerPage } from "@/components/layout/InnerPage";
import { ProjectTiltCard } from "@/components/projects/ProjectTiltCard";

type Copy = { cn: string; en: string };
type FilterId = "all" | "planning" | "design" | "visual" | "writing";
type ProjectCategory = {
  id: string;
  number: string;
  filter: Exclude<FilterId, "all">;
  title: Copy;
  english: string;
  description: Copy;
  href: string;
  image: string;
  imagePosition?: string;
};

const copy = (cn: string, en: string): Copy => ({ cn, en });

const filters: Array<{ id: FilterId; label: Copy }> = [
  { id: "all", label: copy("全部", "All") },
  { id: "planning", label: copy("策划", "Planning") },
  { id: "design", label: copy("设计", "Design") },
  { id: "visual", label: copy("影像", "Visual") },
  { id: "writing", label: copy("写作", "Writing") },
];

const projects: ProjectCategory[] = [
  {
    id: "platform",
    number: "01",
    filter: "planning",
    title: copy("网络运营平台搭建", "Network Platform Building"),
    english: "NETWORK PLATFORM BUILDING",
    description: copy("从需求分析到系统落地，\n打造高效稳定的运营平台。", "From requirements to delivery,\nbuilding a stable operations platform."),
    href: "/projects/platform",
    image: "/projects/ui/network_platform_building.png",
  },
  {
    id: "brand-events",
    number: "02",
    filter: "planning",
    title: copy("品牌活动策划", "Brand Event Planning"),
    english: "BRAND EVENT PLANNING",
    description: copy("洞察品牌与用户需求，\n创意策划线上线下活动。", "Understanding brands and audiences,\nshaping online and offline events."),
    href: "/projects/brand-events",
    image: "/projects/ui/brand_event_planning.png",
  },
  {
    id: "poster-design",
    number: "03",
    filter: "design",
    title: copy("视觉海报设计", "Visual Poster Design"),
    english: "VISUAL POSTER DESIGN",
    description: copy("以视觉传达核心信息，\n创造品牌与内容的记忆点。", "Communicating ideas visually,\ncreating memorable brand moments."),
    href: "/projects/poster-design",
    image: "/projects/ui/visual_poster_design.png",
  },
  {
    id: "videos",
    number: "04",
    filter: "visual",
    title: copy("视频项目", "Video Projects"),
    english: "VIDEO PROJECTS",
    description: copy("从脚本构思到拍摄剪辑，\n用影像讲述有力量的故事。", "From scripts to filming and editing,\ntelling stories through motion."),
    href: "/projects/videos",
    image: "/projects/ui/video_projects.png",
  },
  {
    id: "photography",
    number: "05",
    filter: "visual",
    title: copy("摄影", "Photography"),
    english: "PHOTOGRAPHY",
    description: copy("捕捉真实与美感，\n定格每一个动人瞬间。", "Finding truth and beauty,\nholding on to meaningful moments."),
    href: "/projects/photography",
    image: "/projects/ui/photography.png",
  },
  {
    id: "articles",
    number: "06",
    filter: "writing",
    title: copy("个人文章", "Articles"),
    english: "ARTICLES",
    description: copy("记录思考与经验，\n探索与分享的文字空间。", "A written space for reflection,\nexperience and ideas in progress."),
    href: "/projects/articles",
    image: "/projects/ui/articles.png",
  },
];

function ProjectCard({ project, cn }: { project: ProjectCategory; cn: boolean }) {
  return (
    <ProjectTiltCard className="projects-gallery__tilt">
      <Link href={project.href} className="projects-gallery__card" aria-label={cn ? project.title.cn : project.title.en}>
        <div className="projects-gallery__card-surface" aria-hidden="true" />
        <div className="projects-gallery__media" style={{ transform: "translateZ(20px)" }}>
          <img
            src={project.image}
            alt=""
            loading="eager"
            decoding="async"
            style={{ objectPosition: project.imagePosition ?? "center" }}
          />
        </div>
        <div className="projects-gallery__shade" aria-hidden="true" />
        <div className="projects-gallery__copy">
          <span className="projects-gallery__number">{project.number}</span>
          <div className="projects-gallery__text">
            <h2>{cn ? project.title.cn : project.title.en}</h2>
            <p className="projects-gallery__english">{project.english}</p>
            <p className="projects-gallery__description">{(cn ? project.description.cn : project.description.en).split("\n").map((line) => <span key={line}>{line}</span>)}</p>
          </div>
          <span className="projects-gallery__arrow" aria-hidden="true">→</span>
        </div>
      </Link>
    </ProjectTiltCard>
  );
}

export function ProjectsIndex() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [filter, setFilter] = useState<FilterId>("all");
  const visibleProjects = useMemo(
    () => filter === "all" ? projects : projects.filter((project) => project.filter === filter),
    [filter],
  );

  return (
    <InnerPage>
      <section className="projects-gallery">
        <header className="projects-gallery__hero">
          <img className="projects-gallery__hero-image" src="/projects/ui/projects_hero_background.png" alt="" loading="eager" decoding="async" />
          <div className="projects-gallery__hero-glow" aria-hidden="true" />
          <div className="projects-gallery__hero-copy">
            <h1>{cn ? "项目作品" : "Projects"}</h1>
            <p className="projects-gallery__eyebrow">PROJECTS</p>
            <i aria-hidden="true" />
            <p className="projects-gallery__intro">
              {cn ? "从系统搭建到品牌策划，从视觉设计到影像表达。" : "From systems and brand planning to visual design and moving image."}
            </p>
          </div>
          <span className="projects-gallery__ghost" aria-hidden="true">PROJECTS</span>
        </header>

        <nav className="projects-gallery__filters" aria-label={cn ? "项目分类筛选" : "Project filters"}>
          {filters.map((item) => (
            <button
              type="button"
              key={item.id}
              className={filter === item.id ? "is-active" : ""}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {cn ? item.label.cn : item.label.en}
            </button>
          ))}
        </nav>

        <div className="projects-gallery__grid" key={filter}>
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} cn={cn} />)}
        </div>
      </section>
    </InnerPage>
  );
}
