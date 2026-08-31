"use client";

import Link from "next/link";
import { AnimatePresence, motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLanguage, type Language } from "@/components/LanguageProvider";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { mobileProfileSkills, mobileProfileTimeline, type MobileProfileTimelineItem } from "@/data/mobileProfileTimeline";

type Copy = { cn: string; en: string };
type Group = { title: Copy; items: Copy[] };
type Capability = { name: Copy; level: "foundation" | "developing" | "core" };
type Stage = { id: string; hash: string; heroImage: string; date: Copy; title: Copy; summary: Copy; intro: Copy[]; groups: Group[]; keywords: Copy[]; capabilities: Capability[]; tools: string[] };

const toolAssets: Record<string, string> = {
  Photoshop: "/icons/tools/photoshop.png", Premiere: "/icons/tools/premiere.png", Illustrator: "/icons/tools/illustrator.png",
  Lightroom: "/icons/tools/lightroom.png", Animate: "/icons/tools/animate.png", "DaVinci Resolve": "/icons/tools/davinci-resolve.png",
  "剪映": "/icons/tools/jianying.png", Codex: "/icons/tools/codex.png",
};

const toolSymbols: Record<string, string> = {
  "相机拍摄": "◉",
  "文稿工具": "▤",
};

const cn = (value: string): Copy => ({ cn: value, en: value });
const copy = (items: string[]) => items.map(cn);
const caps = (items: string[], levels: Capability["level"][]): Capability[] => items.map((item, i) => ({ name: cn(item), level: levels[i] }));

const stages: Stage[] = [
  {
    id: "01", hash: "2015", heroImage: "/profile/stage-01-photography-studio.webp", date: { cn: "2015—2018", en: "2015—2018" },
    title: { cn: "摄影工作室学习与个人创作", en: "Photography Studio Learning & Personal Practice" },
    summary: { cn: "进入摄影工作室学习摄影，并在学习过程中持续进行个人摄影创作，逐渐建立对画面、光线、人物与现场的观察能力。", en: "Learned photography in a studio environment while maintaining personal practice, building sensitivity to images, light, people and live scenes." },
    intro: [{ cn: "进入摄影工作室学习摄影，并在学习过程中持续进行个人创作，打下视觉基础，逐渐建立审美与表达能力。", en: "I learned photography in a studio environment while continuing personal work, building a visual foundation and an early sense of taste and expression." }],
    groups: [
      { title: { cn: "学习与探索", en: "Learning & Exploration" }, items: copy(["摄影基础学习", "光线与构图练习", "人物与现场观察", "摄影工作室实践", "持续个人摄影创作", "探索自己的视觉表达方式"]) },
      { title: { cn: "核心收获", en: "Key Takeaways" }, items: copy(["建立对摄影的基础理解", "形成画面观察习惯", "开始建立个人审美", "对作品创作流程形成初步认识"]) },
    ],
    keywords: copy(["光影感知", "构图能力", "审美建立", "个人创作", "项目执行", "视觉探索"]),
    capabilities: caps(["摄影技术", "审美与构图", "创意表达", "项目执行", "后期处理"], ["foundation", "foundation", "developing", "developing", "foundation"]), tools: ["Photoshop", "Lightroom", "Premiere", "相机拍摄"],
  },
  {
    id: "02", hash: "2018", heroImage: "/profile/stage-02-photography-degree.webp", date: { cn: "2018.09—2022.06", en: "2018.09—2022.06" }, title: { cn: "本科 · 摄影专业", en: "Bachelor’s Degree · Photography" },
    summary: { cn: "系统学习摄影、视觉表达与影像创作，持续完成摄影实践与个人作品。", en: "Studied photography, visual expression and image-making systematically through continued practice and personal work." },
    intro: [{ cn: "系统学习摄影、视觉表达与影像创作方法，在长期学习与作品实践中进一步建立完整的视觉表达能力。", en: "I built a fuller visual language through structured study in photography, visual expression and image-making." }],
    groups: [{ title: { cn: "学习内容", en: "Study Areas" }, items: copy(["创意摄影", "摄像基础", "商业产品摄影", "版式与图片处理设计", "平面广告设计", "影视摄影与剪辑", "摄影创作", "市场营销相关课程"]) }, { title: { cn: "核心收获", en: "Key Takeaways" }, items: copy(["系统摄影训练", "商业摄影基础", "视觉构成能力", "图像后期处理", "创作项目完整度", "视觉与传播意识"]) }],
    keywords: copy(["摄影", "视觉表达", "影像语言", "商业摄影", "作品制作", "画面组织"]), capabilities: caps(["摄影实践", "视觉构成", "影像表达", "商业拍摄", "后期处理"], ["core", "core", "developing", "developing", "core"]), tools: ["Photoshop", "Lightroom", "Premiere", "Illustrator", "相机拍摄"],
  },
  {
    id: "03", hash: "2022", heroImage: "/profile/stage-03-creative-writing.webp", date: { cn: "2022.09—2023.09", en: "2022.09—2023.09" }, title: { cn: "研究生 · 创意写作专业", en: "Master’s Degree · Creative Writing" },
    summary: { cn: "学习舞台剧、动画、剧本、脚本、人物传记等内容方向，进一步建立叙事、人物与内容组织能力。", en: "Studied stage plays, animation, scripts and biographies, building narrative, character and content-organisation skills." },
    intro: [{ cn: "从视觉表达进一步进入文字、人物与故事结构，通过创意写作学习建立内容组织与叙事能力。", en: "I moved from visual expression into words, characters and story structure, developing narrative and content-organisation ability." }],
    groups: [{ title: { cn: "学习内容", en: "Study Areas" }, items: copy(["舞台剧", "动画剧情", "剧本", "脚本", "人物传记", "视觉故事", "人物塑造", "内容组织", "叙事节奏"]) }, { title: { cn: "核心收获", en: "Key Takeaways" }, items: copy(["内容结构能力", "人物塑造", "故事设计", "创意写作", "视觉与文字结合", "叙事逻辑"]) }],
    keywords: copy(["创意写作", "剧本", "动画", "内容叙事", "人物塑造", "故事结构"]), capabilities: caps(["叙事结构", "人物塑造", "内容组织", "创意表达", "脚本能力"], ["core", "developing", "core", "core", "developing"]), tools: ["文稿工具", "Premiere", "Animate"],
  },
  {
    id: "04", hash: "2023", heroImage: "/profile/stage-04-brand-operations.webp", date: { cn: "2023.09—2024.01", en: "2023.09—2024.01" }, title: { cn: "开始进入品牌运营", en: "Entering Brand Operations" },
    summary: { cn: "开始将摄影、视觉与内容能力带入真实品牌场景，理解传播、执行与协作之间的关系。", en: "Brought photography, visual and content skills into real brand work, learning the relationship between communication, delivery and collaboration." },
    intro: [{ cn: "开始将摄影、视觉、内容与叙事能力带入真实品牌工作场景。", en: "I began applying photography, visual, content and narrative ability in real brand settings." }],
    groups: [{ title: { cn: "工作与探索", en: "Work & Exploration" }, items: copy(["品牌内容", "图文拍摄", "视频内容", "内容策划", "社交平台运营", "品牌传播", "活动与执行", "团队协作"]) }, { title: { cn: "核心收获", en: "Key Takeaways" }, items: copy(["理解品牌目标", "从创作走向实际业务", "学习内容传播逻辑", "理解协作和交付", "将视觉能力用于商业场景"]) }],
    keywords: copy(["品牌", "内容", "传播", "执行", "现场", "协作"]), capabilities: caps(["品牌意识", "内容执行", "现场协作", "视觉传播", "平台理解"], ["developing", "developing", "developing", "developing", "developing"]), tools: ["Photoshop", "Premiere", "Lightroom", "剪映"],
  },
  {
    id: "05", hash: "2024", heroImage: "/profile/stage-05-personal-learning.webp", date: { cn: "2024.01—2024.06", en: "2024.01—2024.06" }, title: { cn: "个人作品创作与学习", en: "Personal Creation & Learning" },
    summary: { cn: "继续整理和打磨个人作品，同时补充新媒体运营、内容传播与平台相关知识，重新梳理个人方向。", en: "Continued refining personal work while developing new-media, content-distribution and platform knowledge." },
    intro: [{ cn: "继续整理和打磨个人作品，同时补充新媒体运营、内容传播与平台相关知识，重新梳理个人方向。", en: "I continued refining personal work while building new-media, content-distribution and platform knowledge." }],
    groups: [{ title: { cn: "这一阶段", en: "This Period" }, items: copy(["整理个人摄影作品", "持续个人创作", "学习新媒体运营", "学习内容传播", "理解平台逻辑", "补充品牌运营知识"]) }, { title: { cn: "核心收获", en: "Key Takeaways" }, items: copy(["作品整理方法", "内容传播意识", "平台理解", "方向重新梳理", "个人作品持续积累"]) }],
    keywords: copy(["整理", "创作", "新媒体", "学习", "传播", "积累"]), capabilities: caps(["作品整理", "内容意识", "平台理解", "自主学习", "创作积累"], ["core", "developing", "developing", "developing", "core"]), tools: ["Photoshop", "Lightroom", "Premiere", "剪映"],
  },
  {
    id: "06", hash: "2024-brand", heroImage: "/profile/stage-06-brand-assistant.webp", date: { cn: "2024.07—2025.07", en: "2024.07—2025.07" }, title: { cn: "品牌助理", en: "Brand Assistant" },
    summary: { cn: "参与视觉摄影、大型活动摄影、视频剪辑、平台运营及品牌活动执行，积累长期品牌现场经验。", en: "Worked across visual photography, large-scale events, video editing, platform operations and brand-event delivery." },
    intro: [{ cn: "开始长期参与品牌工作现场，工作范围从单点视觉逐渐扩展到视频、平台、内容与活动执行。", en: "I began sustained brand work, expanding from visual delivery into video, platform, content and event execution." }],
    groups: [{ title: { cn: "主要工作", en: "Key Responsibilities" }, items: copy(["视觉摄影", "大型活动摄影", "大会摄影", "视频剪辑", "视觉内容制作", "平台运营", "品牌活动执行", "日常内容输出"]) }, { title: { cn: "核心收获", en: "Key Takeaways" }, items: copy(["长期品牌执行经验", "活动现场能力", "视频内容制作", "平台运营经验", "多任务协调", "团队协作"]) }],
    keywords: copy(["品牌助理", "视觉摄影", "活动摄影", "视频剪辑", "平台运营", "活动执行"]), capabilities: caps(["活动执行", "视觉摄影", "视频制作", "平台运营", "多任务协作"], ["core", "core", "core", "developing", "core"]), tools: ["Photoshop", "Premiere", "Lightroom", "DaVinci Resolve", "剪映"],
  },
  {
    id: "07", hash: "2025", heroImage: "/profile/stage-07-network-operations.webp", date: { cn: "2025.08—至今", en: "2025.08—Now" }, title: { cn: "网络运营部主管", en: "Network Operations Lead" },
    summary: { cn: "工作逐渐从单点执行走向平台管理、团队协作、活动策划、AI 工作流与系统建设。", en: "Work expanded from single-point delivery into platform management, team collaboration, event planning, AI workflows and system building." },
    intro: [{ cn: "升任网络运营部主管后，我的角色开始从单点执行进一步走向团队协作、平台管理、活动策划与系统建设。", en: "As Network Operations Lead, my role expanded from individual execution to team collaboration, platform management, event planning and system building." }, { cn: "工作重点逐渐扩展到 AI 工作流、内容协同、线上学习体系和运营架构。", en: "My focus now includes AI workflows, content coordination, online learning systems and operational architecture." }],
    groups: [
      { title: { cn: "品牌与活动", en: "Brand & Events" }, items: copy(["策划团队大小型活动", "输出视觉设计海报", "输出活动海报与现场物料", "规划办公室线下展位", "规划宣传内容", "负责大型现场活动拍摄"]) },
      { title: { cn: "内容与协作", en: "Content & Collaboration" }, items: copy(["协调团队视频输出", "协调文章输出", "协调公告输出", "整理 AI 知识库", "推动团队内容协作"]) },
      { title: { cn: "平台与系统", en: "Platform & Systems" }, items: copy(["从 0 到 1 搭建约 500 人企业微信后台架构", "负责企业微信后台日常管理", "负责平台维护", "处理日常 IT 问题", "搭建面向 500+ 前线同事的线上学习体系", "整理并推动 AI 工作流", "协调内容、平台与团队运转", "推动系统化运营协作"]) },
    ],
    keywords: copy(["团队协作", "系统建设", "AI 工作流", "活动策划", "品牌运营", "平台管理", "内容协同"]), capabilities: caps(["团队协作", "系统建设", "活动策划", "平台管理", "AI 工作流"], ["core", "core", "core", "core", "core"]), tools: ["Photoshop", "Premiere", "DaVinci Resolve", "剪映", "Codex"],
  },
];

function t(value: Copy, language: Language) { return value[language]; }

function ProfileStageDetail({ stage, active, language, onSelect }: { stage: Stage; active: number; language: Language; onSelect: (index: number) => void }) {
  const label = (value: Copy) => t(value, language);
  return <section className="profile-archive__detail" key={stage.id}>
    <header className="profile-archive__detail-head">
      <img className="profile-archive__stage-image" src={stage.heroImage} alt="" />
      <p>{label(stage.date)}</p>
      <h2>{label(stage.title)}</h2>
      {stage.intro.map((paragraph, index) => <p className="profile-archive__detail-intro" key={index}>{label(paragraph)}</p>)}
    </header>
    <div className="profile-archive__detail-groups">
      {stage.groups.map((group) => <article key={group.title.en}><h3>{label(group.title)}</h3><ul>{group.items.map((item) => <li key={item.cn}>{label(item)}</li>)}</ul></article>)}
      <section className="profile-archive__keywords">
        <p>{language === "cn" ? "代表关键词" : "KEYWORDS"}</p>
        <div>{stage.keywords.map((keyword) => <span key={keyword.cn}>{label(keyword)}</span>)}</div>
      </section>
    </div>
    <section className="profile-archive__works">
      <header><div><p>{language === "cn" ? "当时的作品（后续插入真实图片）" : "WORKS FROM THIS PERIOD"}</p></div><small>{language === "cn" ? "后续补充真实作品  →" : "Real work to be added  →"}</small></header>
      <div>{Array.from({ length: 5 }, (_, index) => <article key={index}><span>◫</span><b>{language === "cn" ? `作品 ${String(index + 1).padStart(2, "0")}` : `WORK ${String(index + 1).padStart(2, "0")}`}</b><small>{language === "cn" ? "待替换真实图片" : "Awaiting real work"}</small>{/* TODO: replace with Leo real work */}</article>)}</div>
    </section>
    <div className="profile-archive__bottom-grid">
      <section className="profile-archive__capabilities"><p>{language === "cn" ? "能力沉淀" : "CAPABILITY DEVELOPMENT"}</p><div>{stage.capabilities.map((capability) => <article key={capability.name.cn}><span>{label(capability.name)}</span><i className={`level-${capability.level}`} /></article>)}</div></section>
      <section className="profile-archive__detail-tools"><p>{language === "cn" ? "使用工具" : "TOOLS USED"}</p><div>{stage.tools.map((tool) => <span key={tool}>{toolAssets[tool] ? <img src={toolAssets[tool]} alt="" /> : <b aria-hidden="true">{toolSymbols[tool] ?? tool.slice(0, 1)}</b>}<small>{tool}</small></span>)}</div></section>
    </div>
    <footer className="profile-archive__pager"><button type="button" disabled={active === 0} onClick={() => onSelect(active - 1)}>← {language === "cn" ? "上一阶段" : "Previous"}</button><div><nav>{stages.map((item, index) => <button type="button" key={item.id} onClick={() => onSelect(index)} aria-label={`Stage ${index + 1}`} className={index === active ? "is-active" : ""} />)}</nav><span>{language === "cn" ? `第 ${active + 1} / 7 阶段` : `Stage ${active + 1} / 7`}</span></div><button type="button" disabled={active === stages.length - 1} onClick={() => onSelect(active + 1)}>{language === "cn" ? "下一阶段" : "Next"} →</button></footer>
  </section>;
}

function MobileCareerTimeline({ language }: { language: Language }) {
  const label = (value: Copy | MobileProfileTimelineItem["title"]) => value[language];
  const isCn = language === "cn";
  const coreSkills = mobileProfileSkills[language];
  const shiftWords = isCn ? ["观察", "视觉", "叙事", "品牌", "执行", "运营", "系统", "AI"] : ["Observation", "Visual", "Narrative", "Brand", "Execution", "Operations", "System", "AI"];
  const timelineRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLElement>(null);
  const stageRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollY, scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 68%", "end 72%"],
  });
  const { scrollYProgress: shiftProgress } = useScroll({
    target: shiftRef,
    offset: ["start 78%", "end 48%"],
  });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollY, "change", () => {
    if (typeof window === "undefined") return;
    const markerY = window.innerHeight * .42;
    let nextActive = 0;
    let closest = Number.POSITIVE_INFINITY;
    stageRefs.current.forEach((node, index) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * .28 - markerY);
      if (distance < closest) {
        closest = distance;
        nextActive = index;
      }
    });
    setActiveIndex((current) => current === nextActive ? current : nextActive);
  });

  return (
    <section className="profile-mobile" aria-label={isCn ? "移动端个人履历" : "Mobile career timeline"}>
      <header className="profile-mobile__hero">
        <p>{isCn ? "个人履历" : "MY PATH"}</p>
        <h1>{isCn ? "个人履历" : "My Path"}</h1>
        <span>{isCn ? "从影像开始，到系统与运营。" : "From images to systems and operations."}</span>
      </header>

      <div className="profile-mobile__timeline" ref={timelineRef}>
        <aside className="profile-mobile__rail" aria-hidden="true">
          <div className="profile-mobile__rail-track"><motion.i style={{ scaleY: progressScale }} /></div>
          <div className="profile-mobile__sticky-time">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileProfileTimeline[activeIndex]?.id ?? "01"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: .2, ease: [0.22, 1, 0.36, 1] }}
              >
                <small>{mobileProfileTimeline[activeIndex]?.id}</small>
                <b>{label(mobileProfileTimeline[activeIndex]?.time ?? mobileProfileTimeline[0].time)}</b>
              </motion.div>
            </AnimatePresence>
          </div>
          <ol>
            {mobileProfileTimeline.map((stage, index) => (
              <li key={stage.id} className={index === activeIndex ? "is-active" : index < activeIndex ? "is-past" : ""}>
                <span>{stage.current ? "NOW" : stage.time.cn.slice(0, 4)}</span>
              </li>
            ))}
          </ol>
        </aside>

        <div className="profile-mobile__stage-stack">
        {mobileProfileTimeline.map((stage, index) => {
          const isCurrent = Boolean(stage.current);
          const phase = index === activeIndex ? " is-active" : index < activeIndex ? " is-past" : " is-future";

          return (
            <Fragment key={stage.id}>
            <motion.article
              ref={(node) => { stageRefs.current[index] = node; }}
              className={`profile-mobile__stage${isCurrent ? " is-current" : ""}${phase}`}
              animate={{
                opacity: index === activeIndex ? 1 : index < activeIndex ? .58 : .74,
                y: index === activeIndex ? 0 : 10,
                scale: index === activeIndex ? 1 : .99,
              }}
              transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="profile-mobile__stage-index">
                <small>{stage.id}</small>
                <span>{isCurrent ? "NOW / CURRENT" : label(stage.keyword).toUpperCase()}</span>
              </div>
              <p className="profile-mobile__date">{label(stage.time)}</p>
              <h2>{label(stage.title)}</h2>
              <h3>{label(stage.summary)}</h3>
              <div className="profile-mobile__signals">{stage.signals.map((signal, signalIndex) => <i key={signal} style={{ transitionDelay: `${signalIndex * 70}ms` }}>{signal}</i>)}</div>
              <p className="profile-mobile__body">{label(stage.body)}</p>

              {stage.images.length > 0 && (
                <div className={`profile-mobile__media profile-mobile__media--${stage.images.length}`}>
                  {stage.images.map((image) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={label(image.alt)}
                      loading="lazy"
                      decoding="async"
                      className={image.variant === "wide" ? "is-wide" : ""}
                    />
                  ))}
                </div>
              )}

              <ul>
                {stage.duties.map((item) => <li key={`${stage.id}-${item.cn}`}>{label(item)}</li>)}
              </ul>
              <blockquote>{label(stage.reflection)}</blockquote>
            </motion.article>
            {stage.transitionAfter && (
              <p className={`profile-mobile__transition${index < activeIndex ? " is-past" : ""}`}>
                {label(stage.transitionAfter)}
              </p>
            )}
            </Fragment>
          );
        })}
        </div>
      </div>

      <section className="profile-mobile__shift" ref={shiftRef}>
        <p>THE SHIFT</p>
        <h2>{isCn ? "我的能力是怎么变化的" : "How the ability shifted"}</h2>
        <div>
          {shiftWords.map((item, index) => (
            <ShiftWord key={item} progress={shiftProgress} index={index} total={shiftWords.length} showArrow={index < shiftWords.length - 1}>
              {item}
            </ShiftWord>
          ))}
        </div>
      </section>

      <section className="profile-mobile__skills">
        <p>{isCn ? "核心能力" : "CORE SKILLS"}</p>
        <div>
          {coreSkills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </section>

      <section className="profile-mobile__now">
        <p>{isCn ? "现在的我" : "WHO I AM NOW"}</p>
        <h2>{isCn ? "我现在更关注的，不只是视觉是否好看，而是一个系统是否真的能被团队使用、持续运行，并产生结果。但我依然保留着最开始学摄影时的习惯：先观察，再动手。" : "I now care not only whether visuals look good, but whether a system can be used by a team, keep running and create results. But I still keep the habit I learned at the beginning of photography: observe first, then act."}</h2>
        <div>
          <Link href="/projects">{isCn ? "查看项目作品" : "Explore Projects"} <span>→</span></Link>
          <Link href="/other-side">{isCn ? "进入 Leo’s Room" : "Enter Leo’s Room"} <span>→</span></Link>
          <a href="mailto:leoyang1132@outlook.com">{isCn ? "联系我" : "Contact Me"} <span>→</span></a>
        </div>
      </section>
    </section>
  );
}

function ShiftWord({ children, progress, index, total, showArrow }: { children: string; progress: MotionValue<number>; index: number; total: number; showArrow: boolean }) {
  const start = Math.max(0, (index - .35) / total);
  const middle = (index + .2) / total;
  const end = Math.min(1, (index + 1.05) / total);
  const opacity = useTransform(progress, [start, middle, end], [.32, 1, .54]);
  const x = useTransform(progress, [start, middle, end], [-8, 0, 0]);
  return <motion.span style={{ opacity, x }}>{children}{showArrow && <b>→</b>}</motion.span>;
}

export function CareerProfile() {
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const stage = stages[active];
  useEffect(() => {
    const sync = () => { const index = stages.findIndex((item) => `#${item.hash}` === window.location.hash); if (index >= 0) setActive(index); };
    sync(); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync);
  }, []);
  const select = (index: number) => { setActive(index); window.history.replaceState(null, "", `#${stages[index].hash}`); };
  const label = (value: Copy) => t(value, language);

  return <div className="profile-archive">
    <SiteNavbar />
    <div className="profile-archive__topbar">
      <div><h1>{language === "cn" ? "个人履历" : "Career Profile"} <i>•</i></h1><p>{language === "cn" ? "我的成长路径：每一步探索、构建系统与能力" : "A record of exploration, systems and capability."}</p></div>
    </div>
    <main className="profile-archive__main">
      <MobileCareerTimeline language={language} />
      <div className="profile-archive__workspace">
        <section className="profile-archive__timeline" aria-label={language === "cn" ? "履历阶段" : "Career stages"}>{stages.map((item, index) => <button type="button" key={item.id} onClick={() => select(index)} className={index === active ? "is-active" : ""} aria-current={index === active ? "step" : undefined}><span>{item.id}</span><div><small>{label(item.date)}</small><strong>{label(item.title)}</strong><em>{label(item.summary)}</em></div><i>→</i></button>)}</section>
        <ProfileStageDetail stage={stage} active={active} language={language} onSelect={select} />
      </div>
    </main>
  </div>;
}
