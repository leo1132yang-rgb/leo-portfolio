type LocalizedText = {
  cn: string;
  en: string;
};

export type MobileProfileTimelineImage = {
  src: string;
  alt: LocalizedText;
  variant?: "wide" | "square";
};

export type MobileProfileTimelineLink = {
  href: string;
  label: LocalizedText;
};

export type MobileProfileTimelineItem = {
  id: string;
  time: LocalizedText;
  title: LocalizedText;
  keyword: LocalizedText;
  summary: LocalizedText;
  body: LocalizedText;
  duties: LocalizedText[];
  reflection: LocalizedText;
  images: MobileProfileTimelineImage[];
  links?: MobileProfileTimelineLink[];
  current?: boolean;
};

export const mobileProfileTimeline: MobileProfileTimelineItem[] = [
  {
    id: "01",
    time: { cn: "2015—2018", en: "2015—2018" },
    title: { cn: "摄影工作室", en: "Photography Studio" },
    keyword: { cn: "观察", en: "Observation" },
    summary: { cn: "从观察世界开始。", en: "It began with learning how to observe." },
    body: {
      cn: "进入摄影工作室学习摄影，开始接触影像、构图、光线与视觉表达。",
      en: "I entered a photography studio, learning images, composition, light and visual expression.",
    },
    duties: [
      { cn: "摄影基础学习", en: "Photography fundamentals" },
      { cn: "光线与构图练习", en: "Light and composition practice" },
      { cn: "人物与现场观察", en: "Observing people and scenes" },
    ],
    reflection: {
      cn: "这一阶段，我学会了先看见，再表达。",
      en: "What changed: I learned to see before trying to express.",
    },
    images: [
      { src: "/profile/stage-01-photography-studio.webp", alt: { cn: "摄影工作室阶段视觉", en: "Photography studio period visual" }, variant: "wide" },
      { src: "/projects/ui/photography.png", alt: { cn: "摄影项目封面", en: "Photography project cover" } },
    ],
    links: [{ href: "/projects/photography", label: { cn: "查看摄影作品 →", en: "View photography →" } }],
  },
  {
    id: "02",
    time: { cn: "2018.09—2022.06", en: "2018.09—2022.06" },
    title: { cn: "摄影本科", en: "Bachelor of Photography" },
    keyword: { cn: "表达", en: "Expression" },
    summary: { cn: "从拍摄，走向完整的视觉表达。", en: "From taking photos to building visual expression." },
    body: {
      cn: "系统学习摄影专业，逐渐形成自己的视觉语言和创作方法。",
      en: "I studied photography systematically and gradually formed my own visual language.",
    },
    duties: [
      { cn: "创意摄影与商业摄影", en: "Creative and commercial photography" },
      { cn: "版式与图片处理设计", en: "Layout and image editing" },
      { cn: "影视摄影与剪辑", en: "Cinematography and editing" },
    ],
    reflection: {
      cn: "这一阶段，我开始理解作品不是单张图，而是一套表达方式。",
      en: "What changed: I began to see work as a system of expression, not a single image.",
    },
    images: [
      { src: "/profile/stage-02-photography-degree.webp", alt: { cn: "摄影本科阶段视觉", en: "Photography degree period visual" }, variant: "wide" },
    ],
  },
  {
    id: "03",
    time: { cn: "2022.09—2023.09", en: "2022.09—2023.09" },
    title: { cn: "创意写作研究生", en: "MA Creative Writing" },
    keyword: { cn: "叙事", en: "Narrative" },
    summary: { cn: "从画面，走进故事。", en: "From images into stories." },
    body: {
      cn: "学习舞台剧、动画、剧本、脚本、人物传记与故事结构，让画面背后开始拥有叙事。",
      en: "I studied stage plays, animation, scripts, biographies and story structure, bringing narrative behind the image.",
    },
    duties: [
      { cn: "舞台剧 / 动画 / 剧本", en: "Stage plays / animation / scripts" },
      { cn: "人物传记与故事结构", en: "Biography and story structure" },
      { cn: "脚本与叙事节奏", en: "Scriptwriting and pacing" },
    ],
    reflection: {
      cn: "这一阶段，我学会了让内容有起点、转折和余味。",
      en: "What changed: I learned to give content a beginning, a turn and an aftertaste.",
    },
    images: [
      { src: "/profile/stage-03-creative-writing.webp", alt: { cn: "创意写作阶段视觉", en: "Creative writing period visual" }, variant: "wide" },
    ],
  },
  {
    id: "04",
    time: { cn: "2023.09—2024.01", en: "2023.09—2024.01" },
    title: { cn: "品牌运营", en: "Brand Operations" },
    keyword: { cn: "品牌", en: "Brand" },
    summary: { cn: "第一次把创意放进真实商业环境。", en: "The first time I placed creativity inside a business context." },
    body: {
      cn: "开始接触品牌运营、内容、传播和商业视觉，把摄影与叙事能力放进真实协作里。",
      en: "I began working with brand operations, content, communication and commercial visuals.",
    },
    duties: [
      { cn: "品牌内容与传播", en: "Brand content and communication" },
      { cn: "图文拍摄与视频内容", en: "Photo, copy and video content" },
      { cn: "社交平台运营", en: "Social platform operations" },
    ],
    reflection: {
      cn: "这一阶段，我意识到好创意也需要被组织、被交付。",
      en: "What changed: I realized good ideas also need structure and delivery.",
    },
    images: [
      { src: "/profile/stage-04-brand-operations.webp", alt: { cn: "品牌运营阶段视觉", en: "Brand operations period visual" }, variant: "wide" },
      { src: "/projects/ui/brand_event_planning.png", alt: { cn: "品牌活动策划封面", en: "Brand event planning cover" } },
    ],
    links: [{ href: "/projects/brand-events", label: { cn: "查看品牌活动 →", en: "View brand events →" } }],
  },
  {
    id: "05",
    time: { cn: "2024.01—2024.06", en: "2024.01—2024.06" },
    title: { cn: "个人创作", en: "Personal Creation" },
    keyword: { cn: "重建", en: "Rebuild" },
    summary: { cn: "重新整理自己的表达方式。", en: "Rebuilding my way of expression." },
    body: {
      cn: "继续整理摄影作品、个人项目与新媒体运营学习，把之前散落的能力重新归档。",
      en: "I kept refining photography work, personal projects and new media learning, reorganizing scattered abilities.",
    },
    duties: [
      { cn: "摄影作品创作", en: "Photography creation" },
      { cn: "个人项目整理", en: "Personal project archiving" },
      { cn: "新媒体运营学习", en: "New media operation learning" },
    ],
    reflection: {
      cn: "这一阶段，我开始把经历整理成可以继续生长的系统。",
      en: "What changed: I started turning experience into something that could keep growing.",
    },
    images: [
      { src: "/profile/stage-05-personal-learning.webp", alt: { cn: "个人创作阶段视觉", en: "Personal creation period visual" }, variant: "wide" },
      { src: "/projects/ui/visual_poster_design.png", alt: { cn: "视觉海报设计封面", en: "Poster design cover" } },
    ],
    links: [{ href: "/projects/poster-design", label: { cn: "查看视觉作品 →", en: "View visual work →" } }],
  },
  {
    id: "06",
    time: { cn: "2024.07—2025.07", en: "2024.07—2025.07" },
    title: { cn: "品牌助理", en: "Brand Assistant" },
    keyword: { cn: "执行", en: "Execution" },
    summary: { cn: "把创意真正落地。", en: "Turning creative work into real delivery." },
    body: {
      cn: "参与视觉摄影、大型活动摄影、视频剪辑、平台运营、视觉设计与活动执行，积累长期品牌现场经验。",
      en: "I worked across photography, large events, video editing, platform operations, visual design and event execution.",
    },
    duties: [
      { cn: "视觉摄影 / 大型活动摄影", en: "Visual and event photography" },
      { cn: "视频剪辑与内容输出", en: "Video editing and content delivery" },
      { cn: "平台运营与活动执行", en: "Platform operations and event execution" },
      { cn: "视觉设计与现场协作", en: "Visual design and on-site collaboration" },
    ],
    reflection: {
      cn: "这一阶段，我学会了现场没有彩排，执行力就是作品的一部分。",
      en: "What changed: I learned there is no rehearsal on site; execution is part of the work.",
    },
    images: [
      { src: "/profile/stage-06-brand-assistant.webp", alt: { cn: "品牌助理阶段视觉", en: "Brand assistant period visual" }, variant: "wide" },
      { src: "/projects/ui/video_projects.png", alt: { cn: "视频项目封面", en: "Video projects cover" } },
    ],
    links: [
      { href: "/projects/videos", label: { cn: "查看视频项目 →", en: "View videos →" } },
      { href: "/projects/brand-events", label: { cn: "查看活动案例 →", en: "View events →" } },
    ],
  },
  {
    id: "07",
    time: { cn: "2025.08—至今", en: "2025.08—Now" },
    title: { cn: "网络运营部主管", en: "Network Operations Lead" },
    keyword: { cn: "系统", en: "System" },
    summary: { cn: "从执行者，走到系统搭建者。", en: "From executor to system builder." },
    body: {
      cn: "负责团队数字化运营系统与品牌执行，把内容、平台、活动与 AI 工作流连接起来。",
      en: "I now connect content, platforms, events and AI workflows into a working operational system.",
    },
    duties: [
      { cn: "SYSTEM：从 0 到 1 搭建约 500 人企业微信后台架构", en: "SYSTEM: Built a WeCom backend architecture for around 500 people" },
      { cn: "LEARNING：为 500+ 前线同事提供线上学习系统", en: "LEARNING: Built online learning access for 500+ frontline colleagues" },
      { cn: "AI：整理 AI 知识库与 AI 工作流", en: "AI: Organized AI knowledge base and workflows" },
      { cn: "OPERATIONS：活动策划、视觉输出、内容协调、平台运营与 IT 支持", en: "OPERATIONS: Events, visuals, content coordination, platform operations and IT support" },
    ],
    reflection: {
      cn: "真正有效的运营，不是把事情做完，而是让系统能够持续运转。",
      en: "What changed: effective operations are not about finishing tasks, but keeping systems running.",
    },
    images: [
      { src: "/profile/stage-07-network-operations.webp", alt: { cn: "网络运营阶段视觉", en: "Network operations period visual" }, variant: "wide" },
      { src: "/projects/network-platform/enterprise-operation-hub-overview.png", alt: { cn: "企业运营中台视觉图", en: "Enterprise operation hub visual" }, variant: "wide" },
    ],
    links: [{ href: "/projects/platform", label: { cn: "查看系统案例 →", en: "View platform case →" } }],
    current: true,
  },
];

export const mobileProfileSkills = {
  cn: ["品牌运营", "视觉表达", "企业系统搭建", "AI 工作流", "活动策划", "内容协调", "摄影与视频"],
  en: ["Brand Operations", "Visual Expression", "Enterprise Systems", "AI Workflows", "Event Planning", "Content Coordination", "Photo & Video"],
};
