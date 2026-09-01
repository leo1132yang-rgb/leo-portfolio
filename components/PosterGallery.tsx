"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { ProjectBackButton } from "@/components/ProjectBackButton";
import { ProjectTiltCard } from "@/components/projects/ProjectTiltCard";

export type PosterItem = { src: string; previewSrc: string };
type PosterGroup = "event" | "course";

type PosterCopy = {
  title: { cn: string; en: string };
  eyebrow: string;
  description: { cn: string; en: string };
  tags: { cn: string[]; en: string[] };
  info: Array<{
    title: { cn: string; en: string };
    items: { cn: string[]; en: string[] };
  }>;
};

const copy: Record<PosterGroup, PosterCopy> = {
  event: {
    title: { cn: "活动及广告海报设计", en: "Event & Advertising Posters" },
    eyebrow: "EVENT & ADVERTISING",
    description: {
      cn: "用于活动宣传、品牌广告、节日传播、线下物料与主题视觉推广，强调信息传达与视觉记忆点的统一。",
      en: "Visual communication for events, brand campaigns, seasonal promotions and offline materials, balancing clear information with memorable imagery.",
    },
    tags: {
      cn: ["活动宣传", "品牌广告", "节日传播", "KV 视觉", "线下物料"],
      en: ["Campaigns", "Brand Ads", "Seasonal", "Key Visual", "Print"],
    },
    info: [
      { title: { cn: "项目类型", en: "Project Types" }, items: { cn: ["活动主视觉", "品牌广告", "节日海报", "推广物料"], en: ["Event key visuals", "Brand advertising", "Seasonal posters", "Campaign materials"] } },
      { title: { cn: "设计关注点", en: "Design Focus" }, items: { cn: ["信息层级", "品牌调性", "传播效率", "视觉冲击力"], en: ["Information hierarchy", "Brand character", "Communication", "Visual impact"] } },
      { title: { cn: "交付内容", en: "Deliverables" }, items: { cn: ["主视觉海报", "横版延展", "线上传播图", "线下物料视觉"], en: ["Key visual poster", "Landscape adaptations", "Social assets", "Offline materials"] } },
    ],
  },
  course: {
    title: { cn: "课程海报设计", en: "Course Posters" },
    eyebrow: "COURSE POSTERS",
    description: {
      cn: "用于课程推广、讲师包装、培训宣传与知识传播场景，强调课程信息清晰、视觉吸引与内容专业感。",
      en: "Poster systems for courses, speakers, training and knowledge sharing, designed for clarity, attraction and professional credibility.",
    },
    tags: {
      cn: ["课程推广", "讲师包装", "培训宣传", "知识传播", "教育视觉"],
      en: ["Courses", "Speakers", "Training", "Knowledge", "Education"],
    },
    info: [
      { title: { cn: "应用场景", en: "Applications" }, items: { cn: ["课程招生", "讲师宣传", "培训活动", "系列课程推广"], en: ["Course enrolment", "Speaker promotion", "Training events", "Course series"] } },
      { title: { cn: "设计重点", en: "Design Focus" }, items: { cn: ["信息清晰", "课程卖点提炼", "专业可信度", "视觉统一性"], en: ["Information clarity", "Value proposition", "Credibility", "Visual consistency"] } },
      { title: { cn: "交付内容", en: "Deliverables" }, items: { cn: ["单张课程海报", "系列课程海报", "讲师推广图", "培训传播图"], en: ["Course posters", "Poster series", "Speaker assets", "Training assets"] } },
    ],
  },
};

function representativeItems(items: PosterItem[], count: number) {
  if (items.length <= count) return items.map((item, index) => ({ item, index }));
  const seen = new Set<number>();
  return Array.from({ length: count }, (_, position) => Math.round((position * (items.length - 1)) / (count - 1)))
    .filter((index) => !seen.has(index) && seen.add(index))
    .map((index) => ({ item: items[index], index }));
}

function PosterStack({ items, group }: { items: PosterItem[]; group: PosterGroup }) {
  return (
    <div className={`poster-category-stack poster-category-stack--${group}`} aria-hidden="true">
      {representativeItems(items, 5).map(({ item }, index) => (
        <img key={item.src} src={item.previewSrc} alt="" loading="lazy" decoding="async" className={`poster-category-stack__sheet poster-category-stack__sheet--${index + 1}`} />
      ))}
    </div>
  );
}

function PosterCategoryCard({ group, items }: { group: PosterGroup; items: PosterItem[] }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  const info = copy[group];
  const href = group === "event" ? "/projects/poster-design/event-ad-posters" : "/projects/poster-design/course-posters";

  return (
    <ProjectTiltCard className={`poster-category-tilt poster-category-tilt--${group}`}>
      <Link href={href} className="poster-category-card">
        <div className="poster-category-card__media"><PosterStack group={group} items={items} /><span className="poster-category-card__halo" /></div>
        <div className="poster-category-card__copy">
          <div className="poster-category-card__meta"><span>{group === "event" ? "01" : "02"}</span><i>{items.length} {cn ? "张海报" : "POSTERS"}</i></div>
          <h2>{info.title[language]}</h2>
          <p>{info.eyebrow}</p>
          <span className="poster-category-card__action">{cn ? "查看作品" : "View Collection"} <b>→</b></span>
        </div>
      </Link>
    </ProjectTiltCard>
  );
}

export function PosterDesignLanding({ eventPosters, coursePosters }: { eventPosters: PosterItem[]; coursePosters: PosterItem[] }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  return (
    <main className="poster-design-page poster-design-landing">
      <SiteNavbar />
      <ProjectBackButton fallbackHref="/projects" />
      <div className="poster-design-atmosphere" aria-hidden="true" />
      <section className="poster-design-landing__inner">
        <Link href="/projects" className="poster-design-breadcrumb">← {cn ? "返回项目作品" : "Back to Projects"}</Link>
        <header className="poster-design-heading">
          <div><span>03 / SELECTED WORK</span><h1>{cn ? "视觉海报设计" : "Poster Design"}</h1><p>POSTER DESIGN</p></div>
          <p className="poster-design-heading__intro">{cn ? "活动传播、品牌广告与课程推广的视觉表达。" : "Visual expression for campaigns, brand advertising and course promotion."}</p>
        </header>
        <section className="poster-category-grid" aria-label={cn ? "海报作品分类" : "Poster collections"}>
          <PosterCategoryCard group="event" items={eventPosters} />
          <PosterCategoryCard group="course" items={coursePosters} />
        </section>
      </section>
    </main>
  );
}

function PosterLightbox({ items, index, onChange, onClose }: { items: PosterItem[]; index: number; onChange: (index: number) => void; onClose: () => void }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") onChange((index + 1) % items.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [index, items.length, onChange, onClose]);

  return (
    <motion.div className="poster-lightbox" role="dialog" aria-modal="true" aria-label={cn ? "海报大图预览" : "Poster preview"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <button type="button" className="poster-lightbox__close" onClick={onClose} aria-label={cn ? "关闭" : "Close"}>×</button>
      <button type="button" className="poster-lightbox__previous" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label={cn ? "上一张" : "Previous"}>←</button>
      <motion.img key={items[index].src} src={items[index].src} alt={cn ? `海报作品 ${String(index + 1).padStart(2, "0")}` : `Poster ${String(index + 1).padStart(2, "0")}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} />
      <span className="poster-lightbox__count">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
      <button type="button" className="poster-lightbox__next" onClick={() => onChange((index + 1) % items.length)} aria-label={cn ? "下一张" : "Next"}>→</button>
    </motion.div>
  );
}

export function PosterCollectionPage({ group, items }: { group: PosterGroup; items: PosterItem[] }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  const info = copy[group];
  const [selectedIndex, setSelectedIndex] = useState(group === "course" ? Math.min(5, items.length - 1) : 0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const featured = useMemo(() => representativeItems(items, 6), [items]);

  return (
    <main className="poster-design-page poster-collection-page">
      <SiteNavbar />
      <ProjectBackButton fallbackHref="/projects/poster-design" />
      <div className="poster-design-atmosphere" aria-hidden="true" />
      <section className="poster-collection-page__inner">
        <div className="poster-collection-topline"><Link href="/projects/poster-design" className="poster-design-breadcrumb">← {cn ? "返回视觉海报设计" : "Back to Poster Design"}</Link><span>{group === "event" ? "01" : "02"} / {String(items.length).padStart(2, "0")}</span></div>
        <section className="poster-collection-columns">
          <div className="poster-viewer-column">
            <button type="button" className="poster-main-viewer" onClick={() => setLightboxIndex(selectedIndex)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.img key={items[selectedIndex].previewSrc} src={items[selectedIndex].previewSrc} alt={cn ? `当前海报 ${selectedIndex + 1}` : `Current poster ${selectedIndex + 1}`} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.22 }} />
              </AnimatePresence>
              <span>{cn ? "点击查看大图" : "View full size"} ↗</span>
            </button>
            <div className="poster-thumbnail-rail" aria-label={cn ? "选择海报" : "Select poster"}>
              {items.map((item, index) => <button type="button" key={item.src} className={selectedIndex === index ? "is-active" : ""} onClick={() => setSelectedIndex(index)} aria-label={cn ? `选择第 ${index + 1} 张海报` : `Select poster ${index + 1}`}><img src={item.previewSrc} alt="" loading="lazy" decoding="async" /><i>{String(index + 1).padStart(2, "0")}</i></button>)}
            </div>
          </div>
          <div className="poster-collection-story">
            <span className="poster-collection-story__number">{group === "event" ? "01" : "02"}</span>
            <p className="poster-collection-story__eyebrow">{info.eyebrow}</p>
            <h1>{info.title[language]}</h1>
            <p className="poster-collection-story__description">{info.description[language]}</p>
            <div className="poster-collection-tags">{info.tags[language].map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="poster-featured-heading"><div><span>{cn ? "精选作品" : "Selected Works"}</span><p>SELECTED POSTERS / 06</p></div><i /></div>
            <div className="poster-featured-grid">
              {featured.map(({ item, index }, position) => <button type="button" key={item.src} onClick={() => setSelectedIndex(index)} className={selectedIndex === index ? "is-active" : ""}><img src={item.previewSrc} alt="" loading="lazy" decoding="async" /><span><b>{cn ? "代表作品" : "Selected work"} {String(position + 1).padStart(2, "0")}</b><i>{cn ? "查看大图" : "View poster"} →</i></span></button>)}
            </div>
          </div>
          <aside className="poster-collection-info">
            <div className="poster-collection-info__head"><span>ARCHIVE</span><b>{String(items.length).padStart(2, "0")}</b><p>{cn ? "张真实海报作品" : "Original poster works"}</p></div>
            {info.info.map((section, sectionIndex) => <section key={section.title.cn}><h2><span>0{sectionIndex + 1}</span>{section.title[language]}</h2><ul>{section.items[language].map((item) => <li key={item}>{item}</li>)}</ul></section>)}
          </aside>
        </section>
        <section className="poster-full-gallery">
          <header><div><span>{cn ? "全部作品" : "Complete Archive"}</span><h2>{info.title[language]}</h2></div><p>{String(items.length).padStart(2, "0")} / POSTERS</p></header>
          <div className="poster-full-gallery__grid">{items.map((item, index) => <button type="button" key={item.src} onClick={() => setLightboxIndex(index)}><span><img src={item.previewSrc} alt="" loading="lazy" decoding="async" /></span><i>{String(index + 1).padStart(2, "0")}</i></button>)}</div>
        </section>
      </section>
      <AnimatePresence>{lightboxIndex !== null && <PosterLightbox items={items} index={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />}</AnimatePresence>
    </main>
  );
}
