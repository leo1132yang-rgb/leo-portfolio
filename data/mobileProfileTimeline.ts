type LocalizedText = {
  cn: string;
  en: string;
};

export type MobileProfileTimelineImage = {
  src: string;
  alt: LocalizedText;
  variant?: "wide" | "square";
};

export type MobileProfileTimelineItem = {
  id: string;
  time: LocalizedText;
  title: LocalizedText;
  keyword: LocalizedText;
  summary: LocalizedText;
  body: LocalizedText[];
  duties: LocalizedText[];
  signals: string[];
  reflection: LocalizedText;
  images: MobileProfileTimelineImage[];
  current?: boolean;
};

export const mobileProfileTimeline: MobileProfileTimelineItem[] = [
  {
    id: "01",
    time: { cn: "2015—2018", en: "2015—2018" },
    title: { cn: "摄影工作室", en: "Photography Studio" },
    keyword: { cn: "观察", en: "Observation" },
    summary: { cn: "第一次真正开始观察世界。", en: "The first time I truly began to observe the world." },
    body: [
      { cn: "2015 年开始进入摄影工作室学习摄影。", en: "In 2015, I entered a photography studio and began learning photography." },
      { cn: "那时候还没有明确的职业规划，更多是在学习：如何看一张画面，如何理解光线，如何观察人物和空间。", en: "At that time, I did not yet have a clear career plan. I was mostly learning how to read an image, understand light, and observe people and space." },
      { cn: "从构图、光线、人物，到第一次理解一张照片为什么成立。", en: "From composition, light and people, I slowly began to understand why a photograph works." },
    ],
    duties: [
      { cn: "摄影基础学习", en: "Photography fundamentals" },
      { cn: "光线与构图练习", en: "Light and composition practice" },
      { cn: "人物与现场观察", en: "Observing people and scenes" },
      { cn: "对画面的敏感", en: "Sensitivity to images" },
      { cn: "对人与环境关系的理解", en: "Understanding people and environments" },
    ],
    signals: ["OBSERVATION", "LIGHT", "FRAME"],
    reflection: {
      cn: "在决定表达什么之前，我先学会了怎么看。",
      en: "Before deciding what to express, I first learned how to look.",
    },
    images: [
      { src: "/profile/stage-01-photography-studio.webp", alt: { cn: "摄影工作室阶段视觉", en: "Photography studio period visual" }, variant: "wide" },
      { src: "/projects/ui/photography.png", alt: { cn: "摄影项目封面", en: "Photography project cover" } },
    ],
  },
  {
    id: "02",
    time: { cn: "2018.09—2022.06", en: "2018.09—2022.06" },
    title: { cn: "摄影本科", en: "Bachelor of Photography" },
    keyword: { cn: "表达", en: "Expression" },
    summary: { cn: "从会拍，到开始建立自己的表达。", en: "From knowing how to shoot to building my own expression." },
    body: [
      { cn: "进入摄影专业系统学习以后，摄影不再只是“拍得好看”。", en: "After entering photography as a major, photography was no longer just about making something look good." },
      { cn: "开始接触摄影史、商业摄影、人像、纪实、灯光、后期和完整视觉项目。", en: "I began studying photo history, commercial photography, portraiture, documentary work, lighting, post-production and complete visual projects." },
      { cn: "也开始进行自己的摄影创作。", en: "I also started creating my own photography work." },
    ],
    duties: [
      { cn: "摄影史、灯光、人像与纪实训练", en: "Photo history, lighting, portrait and documentary training" },
      { cn: "创意摄影与商业摄影", en: "Creative and commercial photography" },
      { cn: "版式与图片处理设计", en: "Layout and image editing" },
      { cn: "影视摄影与剪辑", en: "Cinematography and editing" },
      { cn: "完整视觉项目创作", en: "Complete visual project creation" },
    ],
    signals: ["VISUAL", "EXPRESSION", "TECHNIQUE"],
    reflection: {
      cn: "技术解决画面，表达决定作品。",
      en: "Technique solves the image; expression defines the work.",
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
    summary: { cn: "我开始从画面走进故事。", en: "I began moving from images into stories." },
    body: [
      { cn: "研究生阶段进入创意写作。", en: "During graduate school, I entered creative writing." },
      { cn: "学习内容包括舞台剧、动画、剧本、脚本、人物传记和故事结构。", en: "The work included stage plays, animation, scripts, screenwriting, biography and story structure." },
      { cn: "这段经历让我意识到：视觉只是表达的一种方式。一个真正留下来的作品，通常来自人物、冲突、节奏、情绪和故事。", en: "This experience made me realize that visuals are only one form of expression. Work that stays with people often comes from character, conflict, rhythm, emotion and story." },
    ],
    duties: [
      { cn: "舞台剧 / 动画 / 剧本", en: "Stage plays / animation / scripts" },
      { cn: "人物传记与故事结构", en: "Biography and story structure" },
      { cn: "脚本与叙事节奏", en: "Scriptwriting and pacing" },
      { cn: "人物、冲突、情绪与记忆", en: "Character, conflict, emotion and memory" },
    ],
    signals: ["STORY", "NARRATIVE", "CHARACTER"],
    reflection: {
      cn: "后来我才发现，一张照片和一个故事，都在回答同一个问题：为什么值得被记住？",
      en: "I later realized a photograph and a story both answer the same question: why is this worth remembering?",
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
    body: [
      { cn: "开始接触品牌运营以后，第一次需要从“我喜欢什么”，转向“用户需要什么”“品牌需要表达什么”“内容怎样才能被看到”。", en: "After entering brand operations, I had to shift for the first time from what I liked to what users needed, what the brand needed to express, and how content could actually be seen." },
      { cn: "开始接触内容运营、品牌传播、商业视觉、平台运营和用户沟通。", en: "I began working with content operations, brand communication, commercial visuals, platform operations and user communication." },
    ],
    duties: [
      { cn: "从“我喜欢什么”转向“用户需要什么”", en: "From what I like to what users need" },
      { cn: "品牌内容与传播", en: "Brand content and communication" },
      { cn: "图文拍摄与视频内容", en: "Photo, copy and video content" },
      { cn: "社交平台运营", en: "Social platform operations" },
      { cn: "商业视觉与用户沟通", en: "Commercial visuals and user communication" },
    ],
    signals: ["BRAND", "CONTENT", "COMMUNICATION"],
    reflection: {
      cn: "好的表达，不只是自己喜欢，而是能够准确抵达别人。",
      en: "Good expression is not only what I like; it is what can accurately reach others.",
    },
    images: [
      { src: "/profile/stage-04-brand-operations.webp", alt: { cn: "品牌运营阶段视觉", en: "Brand operations period visual" }, variant: "wide" },
      { src: "/projects/ui/brand_event_planning.png", alt: { cn: "品牌活动策划封面", en: "Brand event planning cover" } },
    ],
  },
  {
    id: "05",
    time: { cn: "2024.01—2024.06", en: "2024.01—2024.06" },
    title: { cn: "个人创作", en: "Personal Creation" },
    keyword: { cn: "重建", en: "Rebuild" },
    summary: { cn: "停下来，重新整理自己的表达方式。", en: "Stopping for a moment to rebuild my way of expression." },
    body: [
      { cn: "这一阶段重新投入个人摄影与内容创作。", en: "During this period, I returned to personal photography and content creation." },
      { cn: "同时补充新媒体运营、内容策划、平台逻辑和商业内容表达。", en: "At the same time, I studied new media operations, content planning, platform logic and commercial content expression." },
      { cn: "摄影、写作和运营，开始慢慢连接起来。", en: "Photography, writing and operations slowly began to connect." },
    ],
    duties: [
      { cn: "摄影作品创作", en: "Photography creation" },
      { cn: "个人项目整理", en: "Personal project archiving" },
      { cn: "新媒体运营学习", en: "New media operation learning" },
      { cn: "内容策划与平台逻辑", en: "Content planning and platform logic" },
      { cn: "摄影、写作、运营逐渐连接", en: "Photography, writing and operations gradually connected" },
    ],
    signals: ["RESET", "CREATE", "REBUILD"],
    reflection: {
      cn: "有时候停下来，不是为了离开，而是为了重新确认方向。",
      en: "Sometimes stopping is not leaving; it is how you confirm direction again.",
    },
    images: [
      { src: "/profile/stage-05-personal-learning.webp", alt: { cn: "个人创作阶段视觉", en: "Personal creation period visual" }, variant: "wide" },
      { src: "/projects/ui/visual_poster_design.png", alt: { cn: "视觉海报设计封面", en: "Poster design cover" } },
    ],
  },
  {
    id: "06",
    time: { cn: "2024.07—2025.07", en: "2024.07—2025.07" },
    title: { cn: "品牌助理", en: "Brand Assistant" },
    keyword: { cn: "执行", en: "Execution" },
    summary: { cn: "创意开始真正落到现场。", en: "Creative work began landing in real sites." },
    body: [
      { cn: "这一阶段开始承担大量真实执行工作：视觉摄影、大型活动摄影、视频剪辑、平台运营、活动物料、海报视觉和内容发布。", en: "During this period, I took on a large amount of real execution work: visual photography, large event photography, video editing, platform operations, event materials, poster visuals and content publishing." },
      { cn: "开始习惯在时间、预算、现场、沟通和执行这些真实限制里完成工作。", en: "I became used to finishing work under real constraints: time, budget, site conditions, communication and delivery." },
    ],
    duties: [
      { cn: "视觉摄影 / 大型活动摄影", en: "Visual and event photography" },
      { cn: "视频剪辑与内容输出", en: "Video editing and content delivery" },
      { cn: "平台运营与活动执行", en: "Platform operations and event execution" },
      { cn: "视觉设计与现场协作", en: "Visual design and on-site collaboration" },
      { cn: "在时间、预算、现场与沟通限制里完成工作", en: "Delivering inside time, budget, site and communication limits" },
    ],
    signals: ["EXECUTION", "VISUAL", "DELIVERY"],
    reflection: {
      cn: "真正的执行力，是让想法最后出现在现场。",
      en: "Real execution means making the idea appear on site.",
    },
    images: [
      { src: "/profile/stage-06-brand-assistant.webp", alt: { cn: "品牌助理阶段视觉", en: "Brand assistant period visual" }, variant: "wide" },
      { src: "/projects/ui/video_projects.png", alt: { cn: "视频项目封面", en: "Video projects cover" } },
    ],
  },
  {
    id: "07",
    time: { cn: "2025.08—至今", en: "2025.08—Now" },
    title: { cn: "网络运营部主管", en: "Network Operations Lead" },
    keyword: { cn: "系统", en: "System" },
    summary: { cn: "从执行者，走到系统搭建者。", en: "From executor to system builder." },
    body: [
      { cn: "职位晋升以后，工作开始从单点执行，转向整个团队的运营系统。", en: "After stepping into this role, my work moved from single-point execution toward the operating system of a team." },
      { cn: "目前我负责把内容、平台、活动与 AI 工作流连接起来，让复杂的协作能够长期运转。", en: "I now connect content, platforms, events and AI workflows so complex collaboration can keep running." },
    ],
    duties: [
      { cn: "SYSTEM：从 0 到 1 搭建约 500 人企业微信后台架构", en: "SYSTEM: Built a WeCom backend architecture for around 500 people" },
      { cn: "LEARNING：为 500+ 前线同事提供线上学习系统", en: "LEARNING: Built online learning access for 500+ frontline colleagues" },
      { cn: "AI：整理 AI 知识库与 AI 工作流", en: "AI: Organized AI knowledge base and workflows" },
      { cn: "OPERATIONS：活动策划、视觉输出、内容协调、平台运营与 IT 支持", en: "OPERATIONS: Events, visuals, content coordination, platform operations and IT support" },
      { cn: "持续承担线下执行、视觉设计与大型活动拍摄", en: "Continuing offline execution, visual design and major event photography" },
    ],
    signals: ["SYSTEM", "AI", "OPERATIONS"],
    reflection: {
      cn: "系统不是为了让事情看起来复杂，而是让复杂的事情变得可以持续。",
      en: "A system is not meant to make things look complex; it makes complex things sustainable.",
    },
    images: [
      { src: "/profile/stage-07-network-operations.webp", alt: { cn: "网络运营阶段视觉", en: "Network operations period visual" }, variant: "wide" },
      { src: "/projects/network-platform/enterprise-operation-hub-overview.png", alt: { cn: "企业运营中台视觉图", en: "Enterprise operation hub visual" }, variant: "wide" },
    ],
    current: true,
  },
];

export const mobileProfileSkills = {
  cn: ["品牌运营", "视觉表达", "企业系统搭建", "AI 工作流", "活动策划", "内容协调", "摄影与视频"],
  en: ["Brand Operations", "Visual Expression", "Enterprise Systems", "AI Workflows", "Event Planning", "Content Coordination", "Photo & Video"],
};
