"use client";

import { motion } from "framer-motion";
import { type RefObject, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { PersonalSide } from "@/components/PersonalSide";
import { JourneyMethodBridge, PersonalEndBridge } from "@/components/ChapterBridges";

type Localized = { cn: string; en: string };

type JourneyNode = {
  time: Localized;
  ability: Localized;
  title: Localized;
  summary: Localized;
  compact: Localized;
  body: Localized[];
  tags: string[];
  accent: "cyan" | "violet" | "gold";
  color: string;
};

const nodes: JourneyNode[] = [
  {
    time: { cn: "2015 - 2018", en: "2015 - 2018" },
    ability: { cn: "观察", en: "Observation" },
    title: { cn: "摄影工作室学习与个人创作", en: "Photography Studio Learning & Personal Practice" },
    summary: { cn: "摄影让我开始用画面理解世界。", en: "Photography taught me to understand the world through images." },
    compact: {
      cn: "摄影工作室学习让我接触拍摄、光线、构图、人物与现场观察，并在学习中持续进行个人摄影创作。",
      en: "Photography studio learning introduced me to shooting, light, composition, people and observation on location, alongside an ongoing personal photography practice.",
    },
    body: [
      {
        cn: "2015 年开始进入摄影工作室学习摄影，并在学习过程中持续进行个人摄影创作。那段时间让我接触拍摄、光线、构图、人物与现场观察，也让我逐渐意识到，摄影不只是按下快门，而是一种观察世界的方式。",
        en: "In 2015, I began learning photography in a studio environment while continuing personal photography practice. I encountered shooting, light, composition, people and live scenes, and came to see photography as a way of observing the world.",
      },
      {
        cn: "这段经历让我建立了最早的视觉感知能力，也成为我后来进入设计、活动、品牌内容和影像创作的基础。",
        en: "This experience built my earliest visual sensitivity and became the foundation for my later work in design, events, brand content and visual creation.",
      },
    ],
    tags: ["Photography", "Visual Sense", "Observation"],
    accent: "cyan",
    color: "#6F86B8",
  },
  {
    time: { cn: "2018.09 - 2022.06", en: "2018.09 - 2022.06" },
    ability: { cn: "表达", en: "Expression" },
    title: { cn: "本科 / 摄影专业", en: "Bachelor's Degree / Photography" },
    summary: { cn: "系统学习让我把摄影从技术变成表达。", en: "Systematic study turned photography from technique into expression." },
    compact: {
      cn: "本科阶段的摄影学习，让我从影像语言、视觉表达和作品创作中，逐渐把摄影从技术转化为表达。",
      en: "My undergraduate photography training helped me move from technique to expression through image language, visual communication and project creation.",
    },
    body: [
      {
        cn: "本科阶段，我系统学习摄影专业，从影像语言、视觉表达、拍摄方法到作品创作，逐步建立起对画面、叙事、人物和场景的理解。",
        en: "During my undergraduate studies, I systematically studied photography, from image language, visual expression and shooting methods to personal project creation.",
      },
      {
        cn: "这段学习让我不再只把摄影看成技术，而是把它看作一种表达方式：它可以记录现场，也可以传达情绪、关系和观点。",
        en: "I learned to see photography not just as a technique, but as a form of expression that can document a scene while conveying emotion, relationships and perspective.",
      },
    ],
    tags: ["Photography", "Visual Expression", "Storytelling"],
    accent: "violet",
    color: "#6F86B8",
  },
  {
    time: { cn: "2022.09 - 2023.09", en: "2022.09 - 2023.09" },
    ability: { cn: "叙事", en: "Narrative" },
    title: { cn: "研究生 / 创意写作专业", en: "Master's Degree / Creative Writing" },
    summary: { cn: "创意写作让我理解内容、结构和叙事节奏。", en: "Creative writing helped me understand content, structure and narrative rhythm." },
    compact: {
      cn: "创意写作训练让我关注故事结构、人物关系和叙事节奏，也让我理解内容需要情绪、结构和记忆点。",
      en: "Creative writing trained me to think about story structure, character relationships and narrative rhythm, helping me understand that content needs emotion, structure and memorability.",
    },
    body: [
      {
        cn: "研究生阶段，我系统学习创意写作，内容包括舞台剧、动画、剧本、脚本、人物传记等多个方向。",
        en: "During my postgraduate studies, I systematically studied creative writing, including stage plays, animation, scripts, screenplays, biographies and other forms of writing.",
      },
      {
        cn: "这段经历拓展了我对内容的理解。它让我开始关注故事结构、人物关系、叙事节奏和表达方式，也让我意识到，好的内容不只是信息传递，而是要有情绪、有结构、有记忆点。",
        en: "This expanded my understanding of content and made me pay attention to story structure, character relationships, narrative rhythm and expression. Good content needs emotion, structure and memorability.",
      },
    ],
    tags: ["Creative Writing", "Script", "Narrative"],
    accent: "gold",
    color: "#6F86B8",
  },
  {
    time: { cn: "2023.09 - 2024.01", en: "2023.09 - 2024.01" },
    ability: { cn: "现场", en: "Scene" },
    title: { cn: "开始进入品牌运营", en: "Entering Brand Operation" },
    summary: { cn: "品牌运营让我把视觉和内容放进真实业务场景。", en: "Brand operation brought visual work and content into real business scenarios." },
    compact: {
      cn: "进入品牌运营后，我开始把视觉、内容和执行放进真实业务场景，理解品牌如何通过持续体验建立认知。",
      en: "Entering brand operation brought visual work, content and execution into real business scenarios, showing me how brands build recognition through continuous experience.",
    },
    body: [
      {
        cn: "从这一阶段开始，我进入品牌运营相关工作，开始把视觉、内容和执行放到真实业务场景中理解。",
        en: "At this stage, I entered brand operation work and began to understand visual design, content and execution in real business scenarios.",
      },
      {
        cn: "我逐渐意识到，品牌不是单独的一张海报、一篇文章或一次活动，而是通过持续的内容、视觉和现场体验，让别人形成稳定认知的过程。",
        en: "I realized that a brand is not just a poster, an article or an event. It is a process of building stable recognition through continuous content, visuals and on-site experiences.",
      },
    ],
    tags: ["Brand Operation", "Content", "Execution"],
    accent: "cyan",
    color: "#6F86B8",
  },
  {
    time: { cn: "2024.01 - 2024.06", en: "2024.01 - 2024.06" },
    ability: { cn: "打磨", en: "Refinement" },
    title: { cn: "个人作品创作 / 新媒体运营学习", en: "Personal Work / New Media Learning" },
    summary: { cn: "个人创作与新媒体学习让我连接表达与传播。", en: "Personal creation and new media learning connected expression with communication." },
    compact: {
      cn: "个人创作和新媒体学习，让我在影像表达与传播逻辑之间建立连接，理解内容如何被发布、传播和运营。",
      en: "Personal creation and new media learning helped me connect visual expression with communication logic, understanding how content is published, distributed and operated.",
    },
    body: [
      {
        cn: "这一阶段，我继续进行个人作品创作，打磨自己的摄影作品，同时开始系统学习市面上的各类新媒体运营知识。",
        en: "I continued creating personal work and refining my photography projects, while systematically learning different forms of new media operation.",
      },
      {
        cn: "这段时间让我在个人表达和传播逻辑之间建立连接：一方面保持影像创作的敏感度，另一方面理解内容如何被发布、传播、转化和持续运营。",
        en: "This period connected personal expression with communication logic: keeping visual sensitivity while understanding how content is published, distributed, converted and operated over time.",
      },
    ],
    tags: ["Personal Work", "New Media", "Content Operation"],
    accent: "violet",
    color: "#6F86B8",
  },
  {
    time: { cn: "2024.07 - 2025.07", en: "2024.07 - 2025.07" },
    ability: { cn: "执行", en: "Execution" },
    title: { cn: "品牌助理 / 从视觉到平台运营", en: "Brand Assistant / From Visual Work to Platform Operation" },
    summary: { cn: "品牌助理经历让我进入品牌工作的日常现场。", en: "The brand assistant role brought me into the daily reality of brand work." },
    compact: {
      cn: "品牌助理阶段让我参与摄影、视频剪辑和平台运营，也让我理解品牌工作是由大量细节共同支撑的持续执行。",
      en: "As a brand assistant, I worked across photography, video editing and platform operation, learning that brand work is sustained by many details of execution.",
    },
    body: [
      {
        cn: "担任品牌助理期间，我参与视觉摄影、大会摄影、视频剪辑以及平台运营工作。",
        en: "As a brand assistant, I worked on visual photography, conference photography, video editing and platform operation.",
      },
      {
        cn: "这一阶段让我真正进入品牌工作的日常现场：从活动拍摄、视觉素材整理，到视频内容输出和平台维护，我开始理解品牌运营并不是单点创作，而是由大量细节共同支撑的持续工作。",
        en: "This stage brought me into the daily reality of brand work. I learned that brand operation is not a single creative output, but a continuous system supported by many details.",
      },
    ],
    tags: ["Brand Assistant", "Video Editing", "Platform Operation"],
    accent: "gold",
    color: "#6F86B8",
  },
  {
    time: { cn: "2025.08 - 至今", en: "2025.08 - Present" },
    ability: { cn: "系统", en: "System" },
    title: { cn: "网络运营主管 / 从执行走向系统", en: "Network Operation Lead / From Execution to Systems" },
    summary: { cn: "网络运营主管阶段让我从执行走向系统建设。", en: "The network operation lead role moved me from execution toward system building." },
    compact: {
      cn: "晋升网络运营主管后，我的工作重心从完成任务走向搭建系统，包括企业微信后台、AI 知识库和团队内容协同。",
      en: "After becoming Network Operation Lead, my focus shifted from completing tasks to building systems, including WeCom backend setup, AI knowledge base and team content collaboration.",
    },
    body: [
      {
        cn: "2025 年 8 月，我晋升为网络运营主管，开始承担更多系统搭建、AI 工作流、活动执行和品牌运营相关工作。",
        en: "In August 2025, I was promoted to Network Operation Lead and began taking on more responsibilities in system building, AI workflows, event execution and brand operation.",
      },
      {
        cn: "我的工作重心从完成任务进一步转向搭建系统。我开始从 0 到 1 搭建企业微信后台，整理 AI 知识库，协同团队完成视频、文章、公告和内部内容输出，也更加明确地意识到：系统会带领团队走向强大。",
        en: "My focus shifted from completing tasks to building systems. I built a WeCom backend from scratch, organized an AI knowledge base and coordinated team content production. This made one thing clear: systems lead teams toward strength.",
      },
    ],
    tags: ["System Building", "AI Workflow", "WeCom Platform", "Brand Operation"],
    accent: "cyan",
    color: "#6F86B8",
  },
];

const connectionCards = [
  {
    title: { cn: "连接创意与执行", en: "Connect Ideas with Execution" },
    text: { cn: "把想法变成可以落地的内容、活动和视觉结果。", en: "Turn ideas into content, events and visual outcomes that can actually land." },
  },
  {
    title: { cn: "连接内容与系统", en: "Connect Content with Systems" },
    text: { cn: "把分散的信息、素材和经验整理成可复用结构。", en: "Organize scattered information, materials and experience into reusable structures." },
  },
  {
    title: { cn: "连接人与工具", en: "Connect People with Tools" },
    text: { cn: "用 AI、企业微信和知识库提升团队协作效率。", en: "Use AI, WeCom and knowledge bases to improve team collaboration." },
  },
];

const capabilities = [
  { title: { cn: "观察力", en: "Observation" }, text: { cn: "来自摄影训练，帮助我理解画面、现场和人物。", en: "Built through photography training, helping me understand images, scenes and people." } },
  { title: { cn: "叙事力", en: "Narrative" }, text: { cn: "来自创意写作，帮助我组织故事、内容和表达。", en: "Built through creative writing, helping me organize stories, content and expression." } },
  { title: { cn: "执行力", en: "Execution" }, text: { cn: "来自品牌运营，帮助我把创意推进到真实落地。", en: "Built through brand operation, helping me push ideas into real outcomes." } },
  { title: { cn: "协同力", en: "Collaboration" }, text: { cn: "来自平台运营，帮助我连接内容、团队和流程。", en: "Built through platform operation, helping me connect content, teams and workflows." } },
  { title: { cn: "结构力", en: "Structure" }, text: { cn: "来自系统搭建，帮助我把经验沉淀为可复用方法。", en: "Built through system building, helping me turn experience into reusable methods." } },
  { title: { cn: "整合力", en: "Integration" }, text: { cn: "来自 AI 工作流，帮助我放大整理、生成和协作能力。", en: "Built through AI workflows, helping me expand the ability to organize, generate and collaborate." } },
];

const workSteps = [
  { title: { cn: "理解问题", en: "Understand the Problem" }, text: { cn: "理解目标、场景、受众和限制。", en: "Understand goals, scenarios, audiences and constraints." } },
  { title: { cn: "梳理结构", en: "Structure the Information" }, text: { cn: "把分散的信息变成清楚结构。", en: "Turn scattered information into a clear structure." } },
  { title: { cn: "推动落地", en: "Push Execution Forward" }, text: { cn: "让内容、活动和项目真正发生。", en: "Make content, events and projects actually happen." } },
  { title: { cn: "沉淀系统", en: "Build Reusable Systems" }, text: { cn: "把经验留下来，让下一次协作更容易。", en: "Leave experience behind so the next collaboration becomes easier." } },
];

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 border-t border-white/10 pt-5">
      <span className="text-[8px] text-[#8FD3FF]">{number}</span>
      <h2 className="text-2xl font-medium tracking-[-.035em] md:text-3xl">{title}</h2>
    </div>
  );
}

export function JourneySection({
  journeyRef,
  onBackTop,
  onViewProjects,
  onViewLibrary,
  view = "all",
}: {
  journeyRef: RefObject<HTMLDivElement | null>;
  onBackTop: () => void;
  onViewProjects: () => void;
  onViewLibrary: () => void;
  view?: "all" | "journey";
}) {
  const { language } = useLanguage();
  const t = (value: Localized) => value[language];
  const [activeChapter, setActiveChapter] = useState(0);
  const [displayedChapter, setDisplayedChapter] = useState(0);
  const [isStageChanging, setIsStageChanging] = useState(false);
  const activeNode = nodes[displayedChapter];
  const nearbyChapters = [displayedChapter - 1, displayedChapter + 1].filter((index) => index >= 0 && index < nodes.length);

  useEffect(() => {
    if (activeChapter === displayedChapter) return;

    setIsStageChanging(true);
    const timeout = window.setTimeout(() => {
      setDisplayedChapter(activeChapter);
      setIsStageChanging(false);
    }, 160);

    return () => window.clearTimeout(timeout);
  }, [activeChapter, displayedChapter]);

  return (
    <div ref={journeyRef} id="journey" className={`journey-world journey-world--${view} scroll-mt-24 px-4 pb-8 pt-10 md:px-8 md:pb-12 md:pt-14`}>
      <motion.section {...reveal} className="light-editorial about-warmth mt-10 rounded-[26px] border border-white/[.07] p-6 md:mt-14 md:p-9">
        <div className="grid gap-10 border-t border-white/10 pt-6 lg:grid-cols-[.6fr_1.4fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span className="field-note-marker text-[8px] text-[#8FD3FF]">02 / JOURNEY</span>
              <h2 className="text-2xl font-medium tracking-[-.035em] md:text-3xl">{language === "cn" ? "从观察到系统" : "From Observation to Systems"}</h2>
            </div>
            <p className="mt-7 max-w-sm text-xl font-medium leading-[1.65] tracking-[-.025em] text-[#F5F1E8] md:text-2xl">
              {language === "cn" ? "我连接创意、内容、现场、工具与系统。" : "I connect ideas, content, scenes, tools and systems."}
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            className="max-w-[680px] space-y-5 text-sm leading-8 text-[#B7B2A8]"
          >
            {[
              {
                cn: "我是一名有落地经验的品牌运营者，长期参与品牌内容、视觉设计、活动策划、现场执行、企业微信后台和 AI 工作流建设。",
                en: "I am a brand operation practitioner with hands-on experience across brand content, visual design, event planning, on-site execution, WeCom backend setup and AI workflow building.",
              },
              {
                cn: "我关注的不只是把事情完成，而是让一次创意如何被真正执行，一次活动如何被完整记录，一套流程如何被团队持续复用。",
                en: "I care not only about completing tasks, but also about how an idea is executed, how an event is recorded, and how a workflow can be reused by a team over time.",
              },
              {
                cn: "我经常同时连接设计、内容、活动、现场、系统、AI 工具和团队协作。我习惯先理解业务和场景，再开始动手。",
                en: "I often connect design, content, events, on-site execution, systems, AI tools and team collaboration. I prefer to understand the real context before taking action.",
              },
              {
                cn: "对我来说，品牌运营不是单点输出，而是把分散的信息、素材、经验和流程整理成一个可以持续运转的系统。",
                en: "To me, brand operation is not a single output. It is about organizing scattered information, materials, experience and workflows into a system that can keep running.",
              },
            ].map((paragraph) => (
              <motion.p key={paragraph.cn} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
                {t(paragraph)}
              </motion.p>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {connectionCards.map((card, index) => (
            <motion.article
              key={card.title.cn}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.48 } } }}
              whileHover={{
                y: -4,
                borderColor: index === 2 ? "rgba(216,163,106,.34)" : "rgba(143,211,255,.25)",
              }}
              className="motion-soft-hover group relative min-h-[176px] overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-6 hover:bg-white/[.07]"
            >
              <span
                className="text-[8px]"
                style={{ color: index === 2 ? "#D8A36A" : "#8FD3FF" }}
              >
                0{index + 1}
              </span>
              <h3 className="mt-7 text-lg font-medium text-[#E7E7F0]">{t(card.title)}</h3>
              <p className="mt-3 text-sm leading-7 text-[#85869C]">{t(card.text)}</p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px opacity-35 transition-opacity group-hover:opacity-90"
                style={{
                  backgroundImage: `linear-gradient(90deg, transparent, ${index === 2 ? "#D8A36A" : "#8FD3FF"}, transparent)`,
                }}
              />
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <section className="journey-grid relative mt-32 overflow-hidden rounded-[28px] border border-white/[.06] p-5 md:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 hidden h-80 w-80 rounded-full bg-black/[.015] md:block"
        />

        <div className="relative grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <aside>
            <span className="text-[8px] uppercase tracking-[.18em] text-[#8FD3FF]">02 / Journey</span>
            <span className="mt-4 block font-mono text-[8px] tracking-[.16em] text-white/30">FRAME 24 / OBSERVE FIRST</span>
            <h2 className="mt-5 text-3xl font-medium leading-[1.12] tracking-[-.045em] text-[#F1EFE9] md:text-4xl">
              {language === "cn" ? "从观察到系统" : "From Observation to Systems"}
            </h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#B3B0A9]">
              {language === "cn"
                ? "我的经历不是一条直线，\n而是一次次能力的叠加。"
                : "My journey is not a straight line,\nbut a continuous layering of abilities."}
            </p>

            <div className="journey-stage-nav mt-8 rounded-[18px] border border-white/[.08] bg-white/[.02] p-3">
              <p className="mb-3 px-1 font-mono text-[8px] uppercase tracking-[.14em] text-[#737D91]">
                {language === "cn" ? "点击切换成长阶段" : "Select a stage to explore"}
              </p>
              {nodes.map((node, index) => (
                <button
                  key={node.ability.cn}
                  type="button"
                  aria-pressed={activeChapter === index}
                  aria-label={`${language === "cn" ? "查看" : "View"}${t(node.ability)}：${t(node.time)}`}
                  onClick={() => setActiveChapter(index)}
                  className={`journey-index-item ${activeChapter === index ? "is-active" : ""}`}
                >
                  <span className="journey-index-dot" style={{ backgroundColor: node.color }} />
                  <span className="journey-index-number">0{index + 1}</span>
                  <span className="journey-index-copy">
                    <strong>{t(node.ability)}</strong>
                    <small>{t(node.time)}</small>
                  </span>
                  <span aria-hidden="true" className="journey-index-arrow">→</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="journey-stage space-y-4">
            <article
              key={displayedChapter}
              className={`journey-stage-content journey-card journey-card--active relative flex min-h-[330px] flex-col overflow-hidden rounded-[24px] border border-white/[.09] bg-white/[.04] p-7 md:p-8 ${isStageChanging ? "is-leaving" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[8px] uppercase tracking-[.16em] opacity-70" style={{ color: activeNode.color }}>0{activeChapter + 1} / {t(activeNode.ability)}</span>
                  <div className="mt-3 flex flex-wrap items-center gap-3"><h3 className="text-3xl font-medium tracking-[-.04em]" style={{ color: activeNode.color }}>{t(activeNode.ability)}</h3><span className="text-[11px] tracking-[.02em] text-white/48">{t(activeNode.time)}</span></div>
                </div>
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: activeNode.color }} />
              </div>
              <h4 className="mt-9 text-xl font-medium leading-snug text-[#F5F7FB]">{t(activeNode.title)}</h4>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B8C0D0]">{t(activeNode.compact)}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-7">{activeNode.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border bg-white/[.025] px-2.5 py-1.5 text-[7px] uppercase tracking-[.08em] text-[#85889E]" style={{ borderColor: `${activeNode.color}25` }}>{tag}</span>)}</div>
              <span aria-hidden="true" className="absolute inset-x-8 bottom-0 h-px opacity-60" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${activeNode.color}, transparent)` }} />
            </article>
            {nearbyChapters.length > 0 && <div className="grid gap-4 sm:grid-cols-2">{nearbyChapters.map((index) => { const node = nodes[index]; return <button type="button" key={node.time.cn} onClick={() => setActiveChapter(index)} className="journey-preview text-left"><span className="text-[8px] tracking-[.14em]" style={{ color: node.color }}>0{index + 1} / {t(node.time)}</span><strong className="mt-3 block text-sm font-medium text-[#F5F7FB]">{t(node.ability)}</strong><span className="mt-2 block text-[11px] leading-5 text-[#B8C0D0]">{t(node.summary)}</span></button>; })}</div>}
          </div>
        </div>

        <motion.div
          {...reveal}
          className="relative mt-8 rounded-[18px] border border-white/[.08] bg-white/[.03] px-6 py-6 md:ml-[328px] md:px-8"
        >
          <p className="max-w-3xl text-sm leading-8 text-[#B7B2A8]">
            {language === "cn"
              ? "这些阶段共同塑造了我现在的工作方式：用观察理解问题，用创意组织表达，用系统推动长期运转。"
              : "Together, these chapters shaped how I work today: understanding problems through observation, organizing expression through creativity, and using systems to support long-term operation."}
          </p>
        </motion.div>
      </section>

      <motion.section {...reveal} className="mt-28">
        <SectionLabel number="02 / JOURNEY" title={language === "cn" ? "这段路径塑造了什么" : "What This Journey Built"} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, index) => (
            <motion.article
              key={item.title.cn}
              className="capability-index motion-soft-hover min-h-[190px] rounded-2xl border border-white/10 bg-white/[.04] p-6 hover:border-[#8FD3FF]/25 hover:bg-white/[.07]"
            >
              <span className="text-[8px] text-white/25">0{index + 1}</span>
              <h3 className="mt-9 text-xl font-medium text-[#F5F1E8]">{t(item.title)}</h3>
              <p className="mt-3 text-sm leading-7 text-[#B7B2A8]">{t(item.text)}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <JourneyMethodBridge language={language} />

      <PersonalSide />

      <div id="end" className="scroll-mt-28">
      <PersonalEndBridge language={language}>
        <section className="final-light">
          <p className="final-quote">
            {language === "cn" ? <><span>看不见的根系，</span><strong>决定了看得见的繁茂。</strong></> : <><span>Invisible roots</span><strong>shape visible growth.</strong></>}
          </p>
          <div className="final-actions">
          {[
            {
              label: language === "cn" ? "回到首页 ↑" : "Back to Top ↑",
              action: onBackTop,
              className: "border-white/12 text-[#B3B0A9] hover:border-white/25 hover:text-[#F1EFE9]",
            },
            {
              label: language === "cn" ? "查看项目作品 →" : "View Projects →",
              action: onViewProjects,
              className: "border-[#AAB6CE]/25 text-[#C7CFDE] hover:border-[#AAB6CE]/50 hover:bg-[#AAB6CE]/[.045]",
            },
            {
              label: language === "cn" ? "进入 AI 知识库 →" : "Enter AI Library →",
              action: onViewLibrary,
              className: "border-[#C69A68]/25 text-[#DDC096] hover:border-[#C69A68]/50 hover:bg-[#C69A68]/[.045]",
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`rounded-xl border bg-white/[.018] px-4 py-2.5 text-[9px] tracking-[.04em] transition-colors duration-300 ${item.className}`}
            >
              {item.label}
            </button>
          ))}
          </div>
        </section>
      </PersonalEndBridge>
      </div>
    </div>
  );
}
