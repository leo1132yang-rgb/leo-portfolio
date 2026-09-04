type Copy = { cn: string; en: string };
type Group = { title: Copy; items: Copy[] };
type Capability = { name: Copy; level: "foundation" | "developing" | "core" };
export type Stage = { id: string; hash: string; heroImage: string; date: Copy; title: Copy; summary: Copy; intro: Copy[]; groups: Group[]; keywords: Copy[]; capabilities: Capability[]; tools: string[] };

const cn = (value: string): Copy => ({ cn: value, en: value });
const copy = (items: string[]) => items.map(cn);
const caps = (items: string[], levels: Capability["level"][]): Capability[] => items.map((item, i) => ({ name: cn(item), level: levels[i] }));

export const careerStages: Stage[] = [
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
