"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type DetailSection = {
  title: string;
  paragraphs: string[];
};

type VideoProject = {
  title: string;
  projectName: string;
  type: string;
  role: string;
  summary: string;
  cover: string;
  video: string;
  sections: DetailSection[];
};

const projects: VideoProject[] = [
  {
    title: "保险公司宣传片",
    projectName: "AIA 公司宣传片",
    type: "企业宣传片 / Commercial Video",
    role: "策划 / 拍摄 / 剪辑 / 视觉包装 / 内容整理",
    summary:
      "以温度感与长期主义重塑团队品牌形象，从策划、拍摄到视觉包装完成一次从 0 到 1 的全流程制作。",
    cover: "/projects/videos/covers/01_commercial_company_promo_cover.png",
    video: "/projects/videos/files/01_commercial_company_promo.mp4",
    sections: [
      {
        title: "项目背景",
        paragraphs: [
          "在保险行业竞争日益激烈的背景下，传统的“推销员”形象已难以获得年轻高净值客户的认同。团队需要一支既能展示专业素养，也能传递温度感与长期主义价值观的视觉内容，用于年度答谢会及招募宣讲会。",
          "本项目是我个人从 0 到 1 完成全流程闭环的实践。面对预算限制与复杂协作，我以制作人的视角介入策划、统筹、拍摄与后期。",
        ],
      },
      {
        title: "核心挑战与解决",
        paragraphs: [
          "策划与脚本：针对参与者时间碎片化、镜头恐惧感强的特点，减少复杂台词，设计“动作流”与“状态感”的脚本结构，以场景叙事代替生硬口播。",
          "统筹与协调：团队规模超过 500 人、时间难以统一。我制定精确到每五分钟的拍摄计划，并通过一对一沟通前置流程，在 8 小时内完成全部外景与棚拍转场。",
          "服化道与场控：在前期方案中嵌入配色与着装规范，并在现场推动统一执行，保证成片具备金融从业者应有的秩序感与专业度。",
        ],
      },
      {
        title: "成果与意义",
        paragraphs: [
          "成片持续作为团队品牌宣传视频使用，并被多个同行作为制作参考。项目也验证了零预算条件下，通过清晰策划与强执行仍能建立完整的品牌影像表达。",
        ],
      },
    ],
  },
  {
    title: "国风沉浸式舞台剧",
    projectName: "珠宝品牌 × 深圳博物馆《丝路汉风拂岭南》",
    type: "品牌活动传播 / Commercial Video",
    role: "编剧 / 文学策划",
    summary:
      "以冬至为叙事锚点，将文物、空间动线与品牌价值连接成沉浸式传播体验。",
    cover: "/projects/videos/covers/02_commercial_shenzhen_event_promo_cover.png",
    video: "/projects/videos/files/02_commercial_shenzhen_event_promo.mp4",
    sections: [
      {
        title: "项目背景",
        paragraphs: [
          "深圳博物馆联合品牌方推出“丝路汉风拂岭南”大型夜场活动，以沉浸式舞台剧串联整座博物馆的夜间动线，让“丝路留金”“典册耀中华”“传承之道”三大展览从被观看的对象转变为叙事容器。",
        ],
      },
      {
        title: "叙事设计",
        paragraphs: [
          "我以冬至为叙事锚点，选取丝路商人、岭南原住民与守藏史官三个身份视角，将展品转化为角色手中的道具与信物，并以“围炉守岁”的核心动作表达守护、团圆与长期陪伴。",
          "剧本同时包含面向演员的文学本，以及精确标注时间、展柜与观众转场节点的动线本，使散点式叙事与真实展厅的参观逻辑相互咬合。",
        ],
      },
      {
        title: "协作与成果",
        paragraphs: [
          "项目需要同时平衡博物馆学术顾问、品牌市场部与导演组的诉求。我建立“文物—台词—品牌关键词”对照关系，以角色情感替代品牌口播。",
          "活动当晚吸引大量汉服爱好者与市民参与，沉浸式剧场环节场场满员。这也是我首次在国家级博物馆内完成编剧与空间动线规划的双重角色实践。",
        ],
      },
    ],
  },
  {
    title: "翟冠复原纪录片",
    projectName: "吾往明代命妇翟冠复原纪录片",
    type: "品牌纪录片 / Commercial Video",
    role: "策划 / 剧本 / 粗剪",
    summary:
      "记录明代命妇翟冠从学术考据到复原成品的过程，以影像呈现传统工艺与文化传承。",
    cover: "/projects/videos/covers/03_commercial_kingdom_crown_promo_cover.png",
    video: "/projects/videos/files/03_commercial_kingdom_crown_promo.mp4",
    sections: [
      {
        title: "项目描述",
        paragraphs: [
          "2026 年 1 月，中国国家博物馆“岐阳世泽”展览正式开展。依据《临淮侯夫人史氏像》复原的明代命妇翟冠，由多位老师担任学术指导，吾往承制复原。本片记录冠饰从考据到成品的完整过程。",
        ],
      },
      {
        title: "主要工作",
        paragraphs: [
          "策划视频整体结构与叙事节奏，确定“考据—工艺—入展”三段式框架。",
          "撰写解说词与字幕文案，将雕蜡、点翠、手工绣、钉珠等工艺转化为易理解的叙事语言。",
          "完成第一遍粗剪，确定全片镜头选择、情绪基调与剪辑节奏，为后续精剪建立基础。",
        ],
      },
    ],
  },
];

const englishProjects: Record<string, Omit<VideoProject, "cover" | "video">> = {
  "保险公司宣传片": {
    title: "Insurance Company Promotional Video",
    projectName: "AIA Corporate Promotional Video",
    type: "Corporate Promotional Video / Commercial Video",
    role: "Planning / Filming / Editing / Visual Packaging / Content",
    summary: "A complete production built from strategy to visual delivery, reshaping the team's image through warmth and long-term value.",
    sections: [
      { title: "Background", paragraphs: ["As traditional sales imagery became less persuasive to younger high-value audiences, the team needed a film that could communicate professionalism, warmth and long-term value for annual events and recruitment presentations.", "This was an end-to-end production completed under budget and coordination constraints, with my role spanning planning, scheduling, filming and post-production."] },
      { title: "Challenges & Solutions", paragraphs: ["Planning and script: I replaced complex dialogue with action-led scenes to reduce camera anxiety and communicate through real working states.", "Coordination: for a team of more than 500 people, I created a five-minute-level schedule and completed exterior and studio scenes within eight hours.", "Visual consistency: dress codes, color direction and on-site execution created a professional and coherent financial-service image."] },
      { title: "Outcome", paragraphs: ["The film has continued to serve as a team branding asset and has also been referenced by industry peers."] },
    ],
  },
  "国风沉浸式舞台剧": {
    title: "Immersive Chinese-style Stage Performance",
    projectName: "Jewelry Brand × Shenzhen Museum: Silk Road Story",
    type: "Brand Event Communication / Commercial Video",
    role: "Scriptwriter / Literary Planning",
    summary: "A winter-solstice narrative connecting artifacts, spatial movement and brand values into an immersive cultural experience.",
    sections: [
      { title: "Background", paragraphs: ["The night program used an immersive stage performance to connect three museum exhibitions, transforming artifacts from objects to be viewed into containers for storytelling."] },
      { title: "Narrative Design", paragraphs: ["Using the winter solstice as the narrative anchor, I connected three character perspectives with artifacts, reunion and long-term companionship.", "The project included both an actor-facing literary script and a route script specifying timing, display cases and audience movement through the real museum space."] },
      { title: "Collaboration & Outcome", paragraphs: ["I balanced academic, brand and production requirements through an artifact-dialogue-brand keyword framework.", "The immersive performances reached full attendance and became my first dual practice in scriptwriting and spatial route planning inside a national-level museum."] },
    ],
  },
  "翟冠复原纪录片": {
    title: "Zhai Crown Restoration Documentary",
    projectName: "Ming Dynasty Noblewoman's Zhai Crown Restoration",
    type: "Brand Documentary / Commercial Video",
    role: "Planning / Script / Rough Cut",
    summary: "Documenting the restoration of a Ming dynasty ceremonial crown from academic research to final craftsmanship.",
    sections: [
      { title: "Project", paragraphs: ["Created for the National Museum of China's exhibition, the documentary records the complete restoration process of a Ming dynasty noblewoman's ceremonial crown."] },
      { title: "My Work", paragraphs: ["Structured the film around research, craftsmanship and exhibition entry.", "Wrote narration and subtitles that translated wax carving, kingfisher feather art, embroidery and beadwork into accessible visual storytelling.", "Completed the first rough cut to establish shot selection, emotional tone and editing rhythm."] },
    ],
  },
};

export function CommercialVideos() {
  const [activeProject, setActiveProject] = useState<VideoProject | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const displayProject = (project: VideoProject) =>
    language === "cn" ? project : { ...project, ...englishProjects[project.title] };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setActiveProject(null);
  };

  useEffect(() => {
    if (!activeProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProject]);

  return (
    <section>
      <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[.18em] text-[#45D6D8]">
            Commercial Videos
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-.035em] text-[#F7F7FF] md:text-3xl">
            {language === "cn" ? "商业视频" : "Commercial Videos"}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#898AA1]">
            {language === "cn" ? "这里整理我的商业视频作品，包括公司宣传片、活动传播视频和品牌形象类视频内容。" : "This section includes my commercial video works, such as corporate promotional videos, event communication videos and brand image content."}
          </p>
        </div>
        <span className="shrink-0 text-[9px] uppercase tracking-[.16em] text-[#C9A86A]">
          3 Videos
        </span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {projects.map((project, index) => {
          const display = displayProject(project);
          return (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#15182A]/90 transition-colors duration-200 hover:border-[#45D6D8]/35 hover:bg-[#1A1E33]"
          >
            <button
              type="button"
              onClick={() => setActiveProject(project)}
              className="flex h-full w-full flex-1 flex-col text-left"
              aria-label={language === "cn" ? `播放并查看${project.title}详情` : `Play and view details: ${display.title}`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#090912]">
                <Image
                  src={project.cover}
                  alt={language === "cn" ? `${project.title}封面` : `${display.title} cover`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[260ms] group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B16]/55 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#0B0B16]/75 px-3 py-1.5 text-[8px] uppercase tracking-[.12em] text-[#D8D8E5] backdrop-blur-md">
                  Commercial Video
                </span>
                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0B0B16]/75 text-xs text-[#F7F7FF] backdrop-blur-md transition group-hover:border-[#45D6D8]/55 group-hover:text-[#45D6D8]">
                  ▶
                </span>
              </div>
              <div className="flex w-full flex-1 flex-col p-5">
                <p className="text-[8px] uppercase tracking-[.14em] text-[#45D6D8]">
                  {display.type}
                </p>
                <h3 className="mt-3 text-lg font-medium tracking-[-.025em] text-[#F7F7FF]">
                  {display.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#898AA1]">
                  {display.summary}
                </p>
                <span className="mt-6 flex w-full items-center justify-between border-t border-white/10 pt-4 text-left text-[9px] uppercase tracking-[.12em] text-[#45D6D8]">
                  {language === "cn" ? "查看详情" : "View Details"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </button>
          </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050509]/95 p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={language === "cn" ? `${activeProject.title}项目详情` : `${displayProject(activeProject).title} project details`}
          >
            <motion.article
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0E0E1D]"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-white/10 bg-[#0E0E1D] px-5 py-5 md:px-8">
                <div>
                  <p className="text-[8px] uppercase tracking-[.16em] text-[#45D6D8]">
                    Commercial Video / Project Detail
                  </p>
                  <h3 className="mt-2 text-xl font-medium text-[#F7F7FF] md:text-2xl">
                    {displayProject(activeProject).title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-lg text-[#9FA0B8] transition hover:border-[#45D6D8]/40 hover:text-[#F7F7FF]"
                  aria-label={language === "cn" ? "关闭详情" : "Close details"}
                >
                  ×
                </button>
              </div>

              <div className="border-b border-white/10 bg-black">
                <video
                  ref={videoRef}
                  src={activeProject.video}
                  poster={activeProject.cover}
                  controls
                  preload="metadata"
                  className="mx-auto max-h-[64vh] w-full"
                >
                  {language === "cn" ? "您的浏览器不支持视频播放。" : "Your browser does not support video playback."}
                </video>
              </div>

              <div className="grid gap-8 p-5 md:grid-cols-[.9fr_1.35fr] md:p-8">
                <div>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#090912]">
                    <Image
                      src={activeProject.cover}
                      alt={language === "cn" ? `${activeProject.title}详情封面` : `${displayProject(activeProject).title} detail cover`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                  <dl className="mt-5 space-y-4 border-t border-white/10 pt-5 text-xs leading-6">
                    <div>
                      <dt className="text-[#66677E]">{language === "cn" ? "项目名称" : "Project"}</dt>
                      <dd className="mt-1 text-[#D7D7E2]">{displayProject(activeProject).projectName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#66677E]">{language === "cn" ? "项目类型" : "Type"}</dt>
                      <dd className="mt-1 text-[#D7D7E2]">{displayProject(activeProject).type}</dd>
                    </div>
                    <div>
                      <dt className="text-[#66677E]">{language === "cn" ? "我的角色" : "My Role"}</dt>
                      <dd className="mt-1 text-[#D7D7E2]">{displayProject(activeProject).role}</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-8">
                  {displayProject(activeProject).sections.map((section) => (
                    <section key={section.title}>
                      <h4 className="text-sm font-medium text-[#F7F7FF]">{section.title}</h4>
                      <div className="mt-3 space-y-3">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="text-sm leading-7 text-[#9899AD]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
