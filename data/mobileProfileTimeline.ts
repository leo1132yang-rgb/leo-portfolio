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
  body: LocalizedText;
  duties: LocalizedText[];
  signals: string[];
  reflection: LocalizedText;
  images: MobileProfileTimelineImage[];
  transitionAfter?: LocalizedText;
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
      { cn: "对画面的敏感", en: "Sensitivity to images" },
      { cn: "对人与环境关系的理解", en: "Understanding people and environments" },
    ],
    signals: ["LIGHT", "FRAME", "FOCUS"],
    reflection: {
      cn: "在决定表达什么之前，我先学会了怎么看。",
      en: "Before deciding what to express, I first learned how to look.",
    },
    images: [
      { src: "/profile/stage-01-photography-studio.webp", alt: { cn: "摄影工作室阶段视觉", en: "Photography studio period visual" }, variant: "wide" },
      { src: "/projects/ui/photography.png", alt: { cn: "摄影项目封面", en: "Photography project cover" } },
    ],
    transitionAfter: {
      cn: "后来，我开始觉得，只有画面还不够。",
      en: "Later, I began to feel that an image alone was not enough.",
    },
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
      { cn: "摄影史、灯光、人像与纪实训练", en: "Photo history, lighting, portrait and documentary training" },
      { cn: "创意摄影与商业摄影", en: "Creative and commercial photography" },
      { cn: "版式与图片处理设计", en: "Layout and image editing" },
      { cn: "影视摄影与剪辑", en: "Cinematography and editing" },
      { cn: "完整视觉项目创作", en: "Complete visual project creation" },
    ],
    signals: ["VISUAL", "LIGHT", "FRAME", "EXPRESSION"],
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
    summary: { cn: "从画面，走进故事。", en: "From images into stories." },
    body: {
      cn: "学习舞台剧、动画、剧本、脚本、人物传记与故事结构，让画面背后开始拥有叙事。",
      en: "I studied stage plays, animation, scripts, biographies and story structure, bringing narrative behind the image.",
    },
    duties: [
      { cn: "舞台剧 / 动画 / 剧本", en: "Stage plays / animation / scripts" },
      { cn: "人物传记与故事结构", en: "Biography and story structure" },
      { cn: "脚本与叙事节奏", en: "Scriptwriting and pacing" },
      { cn: "人物、冲突、情绪与记忆", en: "Character, conflict, emotion and memory" },
    ],
    signals: ["STORY", "NARRATIVE", "RHYTHM"],
    reflection: {
      cn: "后来我才发现，一张照片和一个故事，都在回答同一个问题：为什么值得被记住？",
      en: "I later realized a photograph and a story both answer the same question: why is this worth remembering?",
    },
    transitionAfter: {
      cn: "故事开始进入真实世界。",
      en: "The story began to enter the real world.",
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
      { cn: "从“我喜欢什么”转向“用户需要什么”", en: "From what I like to what users need" },
      { cn: "品牌内容与传播", en: "Brand content and communication" },
      { cn: "图文拍摄与视频内容", en: "Photo, copy and video content" },
      { cn: "社交平台运营", en: "Social platform operations" },
      { cn: "商业视觉与用户沟通", en: "Commercial visuals and user communication" },
    ],
    signals: ["BRAND", "USER", "COMMUNICATION"],
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
    summary: { cn: "重新整理自己的表达方式。", en: "Rebuilding my way of expression." },
    body: {
      cn: "继续整理摄影作品、个人项目与新媒体运营学习，把之前散落的能力重新归档。",
      en: "I kept refining photography work, personal projects and new media learning, reorganizing scattered abilities.",
    },
    duties: [
      { cn: "摄影作品创作", en: "Photography creation" },
      { cn: "个人项目整理", en: "Personal project archiving" },
      { cn: "新媒体运营学习", en: "New media operation learning" },
      { cn: "内容策划与平台逻辑", en: "Content planning and platform logic" },
      { cn: "摄影、写作、运营逐渐连接", en: "Photography, writing and operations gradually connected" },
    ],
    signals: ["RESET", "REBUILD", "CREATE"],
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
      { cn: "在时间、预算、现场与沟通限制里完成工作", en: "Delivering inside time, budget, site and communication limits" },
    ],
    signals: ["EXECUTION", "SITE", "DELIVERY"],
    reflection: {
      cn: "真正的执行力，是让想法最后出现在现场。",
      en: "Real execution means making the idea appear on site.",
    },
    images: [
      { src: "/profile/stage-06-brand-assistant.webp", alt: { cn: "品牌助理阶段视觉", en: "Brand assistant period visual" }, variant: "wide" },
      { src: "/projects/ui/video_projects.png", alt: { cn: "视频项目封面", en: "Video projects cover" } },
    ],
    transitionAfter: {
      cn: "直到有一天，我的工作不再只是完成自己的任务。",
      en: "Until one day, my work was no longer just about finishing my own tasks.",
    },
  },
  {
    id: "07",
    time: { cn: "2025.08—至今", en: "2025.08—Now" },
    title: { cn: "网络运营部主管", en: "Network Operations Lead" },
    keyword: { cn: "系统", en: "System" },
    summary: { cn: "从执行者，走到系统搭建者。", en: "From executor to system builder." },
    body: {
      cn: "职位晋升以后，工作开始从单点执行，转向整个团队的运营系统。目前我负责把内容、平台、活动与 AI 工作流连接起来，让复杂的协作能够长期运转。",
      en: "After stepping into this role, my work moved from single-point execution toward the operating system of a team. I now connect content, platforms, events and AI workflows so complex collaboration can keep running.",
    },
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
