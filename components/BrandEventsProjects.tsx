"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { localize, type LocalizedText, useLanguage } from "@/components/LanguageProvider";

type EventProjectKey = "okx" | "futu";

type VisualProject = {
  key: EventProjectKey;
  title: LocalizedText;
  description: LocalizedText;
  images: string[];
  cover: string;
};

type ActiveImage = {
  project: EventProjectKey;
  index: number;
};

const visualProjects: VisualProject[] = [
  {
    key: "okx",
    title: {
      cn: "OKX 香港线下活动",
      en: "OKX Hong Kong Offline Event",
    },
    description: {
      cn: "围绕 OKX 香港线下活动场景，整理活动视觉物料、现场传播图与品牌宣传设计，呈现线下活动中的视觉执行能力。",
      en: "A visual material set created for the OKX Hong Kong offline event, covering campaign visuals, on-site communication graphics and brand promotion design.",
    },
    images: Array.from({ length: 6 }, (_, index) => `/projects/visual-materials/OKX/${String(index + 1).padStart(2, "0")}_visual.png`),
    cover: "/projects/visual-materials/OKX/01_visual.png",
  },
  {
    key: "futu",
    title: {
      cn: "FUTU 线下开户活动",
      en: "FUTU Offline Account Opening Campaign",
    },
    description: {
      cn: "围绕 FUTU 线下开户活动，整理活动宣传、流程展示与现场推广视觉物料，呈现品牌活动从传播到落地的视觉支持。",
      en: "A visual material set created for the FUTU offline account opening campaign, covering promotion graphics, process visuals and on-site campaign materials.",
    },
    images: Array.from({ length: 6 }, (_, index) => `/projects/visual-materials/FUTU/${String(index + 1).padStart(2, "0")}_visual.png`),
    cover: "/projects/visual-materials/FUTU/01_visual.png",
  },
];

function CardCover({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 z-0 h-full w-full scale-[1.03] object-cover object-center opacity-[.16] transition-opacity duration-[180ms] group-hover:opacity-[.2]"
    />
  );
}

function CardShade() {
  return (
    <>
      <span className="absolute inset-0 z-10 bg-gradient-to-br from-[#111522]/95 via-[#15182A]/88 to-[#05070D]/96" />
      <span className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070D]/55 via-transparent to-transparent" />
    </>
  );
}

function VisualImage({
  src,
  onOpen,
}: {
  src: string;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="motion-soft-hover group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-[#101424] text-left hover:border-[#45D6D8]/35"
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="block h-auto w-full object-contain transition-transform duration-[220ms] group-hover:scale-[1.01]"
      />
    </button>
  );
}

export function BrandEventsProjects() {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<EventProjectKey | null>(null);
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);

  const project = useMemo(
    () => visualProjects.find((item) => item.key === selectedProject) ?? null,
    [selectedProject],
  );

  const activeProject = useMemo(
    () => visualProjects.find((item) => item.key === activeImage?.project) ?? null,
    [activeImage],
  );

  const activeSrc = activeProject && activeImage ? activeProject.images[activeImage.index] : null;

  const closePreview = () => setActiveImage(null);
  const previous = () => {
    setActiveImage((current) => {
      if (!current) return current;
      const currentProject = visualProjects.find((item) => item.key === current.project);
      if (!currentProject) return current;
      return {
        ...current,
        index: (current.index - 1 + currentProject.images.length) % currentProject.images.length,
      };
    });
  };
  const next = () => {
    setActiveImage((current) => {
      if (!current) return current;
      const currentProject = visualProjects.find((item) => item.key === current.project);
      if (!currentProject) return current;
      return {
        ...current,
        index: (current.index + 1) % currentProject.images.length,
      };
    });
  };

  useEffect(() => {
    if (!activeImage) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage]);

  if (project) {
    return (
      <>
        <section>
          <button
            type="button"
            onClick={() => {
              setSelectedProject(null);
              setActiveImage(null);
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
            className="motion-button text-[10px] text-[#9FA0B8] hover:text-[#F7F7FF]"
          >
            {language === "cn" ? "← 返回品牌活动策划" : "← Back to Brand Events"}
          </button>

          <div className="mt-7 border-t border-white/10 pt-7">
            <p className="text-[8px] uppercase tracking-[.16em] text-[#C9A86A]">
              Brand Event Case / {project.images.length}
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-.035em] text-[#F7F7FF] md:text-3xl">
              {localize(project.title, language)}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#8F91A6]">
              {localize(project.description, language)}
            </p>
          </div>

          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {project.images.map((src, index) => (
              <VisualImage
                key={src}
                src={src}
                onOpen={() => setActiveImage({ project: project.key, index })}
              />
            ))}
          </div>
        </section>

        <AnimatePresence>
          {activeSrc && activeProject && activeImage && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={language === "cn" ? "视觉物料预览" : "Visual material preview"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-[#050509]/95 p-4 md:p-8"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closePreview();
              }}
            >
              <button
                type="button"
                onClick={closePreview}
                className="motion-button absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0E1020] text-xl text-[#D7D8E3] hover:border-white/35 md:right-7 md:top-7"
                aria-label={language === "cn" ? "关闭预览" : "Close preview"}
              >
                ×
              </button>

              {activeProject.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previous}
                    className="motion-button absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0E1020]/95 text-lg text-white hover:border-white/35 md:left-7"
                    aria-label={language === "cn" ? "上一张" : "Previous image"}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="motion-button absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0E1020]/95 text-lg text-white hover:border-white/35 md:right-7"
                    aria-label={language === "cn" ? "下一张" : "Next image"}
                  >
                    →
                  </button>
                </>
              )}

              <motion.div
                key={activeSrc}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex max-h-[90vh] max-w-[90vw] items-center justify-center overflow-auto bg-[#111522]"
              >
                <img
                  src={activeSrc}
                  alt=""
                  onError={closePreview}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link
        href="/cases/annual-dinner"
        className="motion-soft-hover group relative flex min-h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-[#15182A]/90 p-6 hover:border-[#45D6D8]/30 hover:bg-[#1A1E33]"
      >
        <CardCover src="/cases/annual-dinner/02_key-visual/打卡位1.png" />
        <CardShade />
        <div className="relative z-20 flex min-h-[182px] flex-col justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-[-.025em] text-[#F7F7FF]">
              {language === "cn" ? "公司年会晚宴" : "Company Annual Dinner"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#A7A9BC]">
              {language === "cn"
                ? "围绕公司年会晚宴进行活动策划、视觉物料、现场记录与传播素材沉淀。"
                : "Event planning, visual materials, on-site documentation and communication assets for a company annual dinner."}
            </p>
          </div>
          <div className="mt-10 flex items-center justify-between text-[9px]">
            <span className="text-[#C9A86A]">{language === "cn" ? "真实项目" : "Published"}</span>
            <span className="project-arrow text-[#45D6D8]">
              {language === "cn" ? "查看项目详情" : "View Project"} →
            </span>
          </div>
        </div>
      </Link>

      {visualProjects.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => {
            setSelectedProject(item.key);
            window.scrollTo({ top: 0, behavior: "auto" });
          }}
          className="motion-soft-hover group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-[#15182A]/90 p-6 text-left hover:border-[#45D6D8]/30 hover:bg-[#1A1E33]"
        >
          <CardCover src={item.cover} />
          <CardShade />
          <div className="relative z-20 flex min-h-[182px] flex-col justify-between">
            <div>
              <h2 className="text-xl font-medium tracking-[-.025em] text-[#F7F7FF]">
                {localize(item.title, language)}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#A7A9BC]">
                {localize(item.description, language)}
              </p>
            </div>
            <div className="mt-10 flex items-center justify-between text-[9px]">
              <span className="text-[#C9A86A]">{language === "cn" ? "视觉物料 / 6 张" : "Visual Materials / 6 Images"}</span>
              <span className="project-arrow text-[#45D6D8]">
                {language === "cn" ? "查看项目详情" : "View Project"} →
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
