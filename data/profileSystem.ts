export type ProfileCopy = { cn: string; en: string };
export type ClusterId = "visual" | "brand" | "system" | "ai";
const copy = (cn: string, en: string): ProfileCopy => ({ cn, en });

export const profileClusters: { id: ClusterId; name: string; index: string; position: [number, number]; note: ProfileCopy; skills: string[]; experienceIds: string[] }[] = [
  { id: "visual", name: "VISUAL", index: "01", position: [.29, .27], note: copy("从观察，到表达", "From observation to expression"), skills: ["Photography", "Poster", "Video", "Visual System", "Editing", "Image"], experienceIds: ["2015", "2018", "2022", "2024"] },
  { id: "brand", name: "BRAND", index: "02", position: [.76, .30], note: copy("让表达与人连接", "Connecting expression and people"), skills: ["Campaign", "Event", "Content", "Communication", "Story", "Operations"], experienceIds: ["2023", "2024-brand", "2025"] },
  { id: "system", name: "SYSTEM", index: "03", position: [.73, .72], note: copy("让协作持续发生", "Making collaboration last"), skills: ["WeCom", "Learning Platform", "Knowledge Base", "Team Workflow", "Operations System", "Digital Infrastructure"], experienceIds: ["2025"] },
  { id: "ai", name: "AI", index: "04", position: [.28, .72], note: copy("向更多可能延伸", "Extending what is possible"), skills: ["AI Workflow", "AI Training", "Creative Coding", "Generative Visual", "Vibe Coding", "Knowledge", "Human × AI"], experienceIds: ["2025"] },
];

export const careerStates = [
  { id: "observer", name: "OBSERVER", date: "2015–2018", title: copy("观察世界，积累感知。", "Observe the world. Build sensitivity."), description: copy("摄影是最初的入口。学习光线与构图，也学习认真地看见。", "Photography was the first opening: learning light, composition, and how to really see."), keywords: ["Photography", "Observation", "Light", "Composition"], weights: [1, .08, .05, .04], density: .24 },
  { id: "maker", name: "MAKER", date: "2018–2023", title: copy("动手创作，建立能力。", "Make things. Develop a language."), description: copy("影像与文字开始相遇。画面之外，人物、舞台和故事也成为表达的一部分。", "Images meet words. Characters, the stage and stories become part of the same practice."), keywords: ["Photography", "Writing", "Narrative", "Stage", "Animation"], weights: [1, .36, .07, .05], density: .43 },
  { id: "operator", name: "OPERATOR", date: "2023–2025", title: copy("进入运营，连接资源。", "Enter operations. Connect resources."), description: copy("把视觉与叙事带入品牌现场，让内容、活动和团队之间产生连接。", "Visual and narrative skills enter brand work, connecting content, events and teams."), keywords: ["Brand", "Content", "Visual", "Video", "Event"], weights: [.95, 1, .28, .08], density: .65 },
  { id: "builder", name: "BUILDER", date: "2025–NOW", title: copy("搭建系统，创造长期价值。", "Build systems. Create lasting value."), description: copy("从具体执行走向系统搭建，让人的经验沉淀为团队可以持续使用的结构。", "Hands-on delivery grows into systems that help a team use and build on shared experience."), keywords: ["System", "WeCom", "500+ Users", "Knowledge Base", "Learning Platform", "Operations"], weights: [.86, .9, 1, .38], density: .85 },
  { id: "explorer", name: "EXPLORER", date: "NOW →", title: copy("继续探索，通往更多可能。", "Keep exploring. Open new possibilities."), description: copy("观察、叙事、连接与结构仍然在场。AI 与 Creative Coding，为已有的能力打开新的接口。", "Observation, narrative, connection and structure stay present. AI and creative coding open new ways to bring them together."), keywords: ["AI", "Creative Coding", "Generative Visual", "Vibe Coding", "Human × System"], weights: [.94, .88, 1, 1], density: 1 },
];

export type ProfileNode = { id: string; cluster: ClusterId; label: string; angle: number; radius: number; born: number };
export const profileNodes: ProfileNode[] = profileClusters.flatMap((cluster, c) => cluster.skills.map((label, i) => ({
  id: `${cluster.id}-${i}`, cluster: cluster.id, label, angle: i * 2.399 + c * .6,
  radius: .055 + (i % 3) * .027, born: c === 0 ? (i < 3 ? 0 : 1) : c === 1 ? (i === 4 ? 1 : 2) : c === 2 ? 3 : 4,
})));
export type ProfileEdge = { source: string; target: string; born: number };
export const profileEdges: ProfileEdge[] = [
  ...profileNodes.map(node => ({ source: node.cluster, target: node.id, born: node.born })),
  ...profileClusters.map((cluster, i) => ({ source: "leo", target: cluster.id, born: i === 0 ? 0 : i + 1 })),
  { source: "visual-0", target: "brand-4", born: 1 },
  { source: "visual-3", target: "brand-2", born: 2 },
  { source: "brand-5", target: "system-3", born: 3 },
  { source: "system-2", target: "ai-5", born: 4 },
  { source: "ai-2", target: "visual-3", born: 4 },
  { source: "ai-0", target: "brand-2", born: 4 },
];

export const experiences: { id: string; date: string; title: ProfileCopy; summary: ProfileCopy; items: ProfileCopy[]; cluster: ClusterId; state: number }[] = [
  { id: "2015", date: "2015–2018", title: copy("摄影学习 / 个人创作", "Photography study / personal practice"), summary: copy("在江西鹰潭的真兮摄影工作室学习，从光线、构图与观察开始，持续个人摄影创作。", "Studied at 真兮摄影工作室 in Yingtan, building an understanding of light and composition while continuing personal photography."), items: [copy("摄影 / 观察 / 光线 / 构图 / 视觉感知", "Photography / Observation / Light / Composition / Visual sensitivity")], cluster: "visual", state: 0 },
  { id: "2018", date: "2018.09–2022.06", title: copy("摄影本科", "Bachelor’s degree · Photography"), summary: copy("系统学习摄影、视觉、影像、构图与创作。", "Systematic study of photography, visual expression, images, composition and creation."), items: [copy("摄影实践与个人作品创作", "Photography practice and personal work")], cluster: "visual", state: 1 },
  { id: "2022", date: "2022.09–2023.09", title: copy("创意写作研究生", "Postgraduate study · Creative writing"), summary: copy("从画面进入人物与故事，扩展叙事能力。", "Expanded from images into characters, stories and narrative."), items: [copy("舞台剧 / 动画 / 剧本 / 脚本 / 人物传记 / 叙事", "Stage plays / Animation / Drama / Scripts / Biography / Narrative")], cluster: "visual", state: 1 },
  { id: "2023", date: "2023.09–2024.01", title: copy("品牌运营", "Brand operations"), summary: copy("在深圳的吾往国风首饰，将摄影、视觉与叙事带入品牌运营与国风美学的表达。", "Brought photography, visuals and narrative into brand operations and Chinese aesthetics at 吾往国风首饰 in Shenzhen."), items: [], cluster: "brand", state: 2 },
  { id: "2024", date: "2024.01–2024.06", title: copy("采风 / 个人创作 / 新媒体运营学习", "Field work / personal practice / new-media learning"), summary: copy("主动离开机构环境，在全国各地重新回到观察、摄影、创作和学习。这是一个没有固定机构的阶段。", "Stepped outside an institutional setting to observe, photograph, create and study across China. A period without a fixed institution."), items: [copy("全国采风 / 持续个人摄影创作 / 学习新媒体运营", "Field work across China / personal photography / new-media operations study")], cluster: "visual", state: 2 },
  { id: "2024-brand", date: "2024.07–2025.07", title: copy("品牌助理", "Brand assistant"), summary: copy("视觉、内容与执行，在真实的品牌现场相遇。", "Visuals, content and delivery come together in brand practice."), items: [copy("视觉摄影 / 大会摄影 / 视频剪辑", "Visual photography / Conference photography / Video editing"), copy("平台运营 / 活动视觉 / 内容输出", "Platform operations / Event visuals / Content production")], cluster: "brand", state: 2 },
  { id: "2025", date: "2025.08–NOW", title: copy("网络运营部负责人", "Head of Network Operations"), summary: copy("在香港 CHAMP MVP，从品牌与内容执行走向网络运营体系，连接团队、平台与数字基础设施。", "At CHAMP MVP in Hong Kong, connecting teams, platforms and digital infrastructure through a network operations system."), items: [
    copy("从 0 到 1 搭建 500 人企业微信后台架构", "Built WeCom backend architecture for 500 people from the ground up"),
    copy("企业微信组织 / 权限 / 日常管理与维护", "WeCom organisation, permissions, daily management and maintenance"),
    copy("线上学习系统", "Online learning system"), copy("AI 知识库", "AI knowledge base"),
    copy("团队视频 / 文章 / 公告内容协作", "Team collaboration on videos, articles and announcements"),
    copy("IT / 数字运营与系统问题处理", "IT, digital operations and system support"),
    copy("品牌活动策划", "Brand event planning"), copy("视觉海报 / 活动物料 / 线下展位与运营视觉", "Visual posters, event materials, offline booths and operational visuals"),
    copy("大型活动摄影", "Large-scale event photography"),
    copy("网络运营体系", "Network operations system"),
  ], cluster: "system", state: 3 },
];

type CoordinateDetail = {
  city: string; location: ProfileCopy; institution: string; keywords: string[];
  position: [number, number]; size: number; openField?: boolean;
  weights: number[]; density: number; spread: number; narrative: number;
  activeSkills: string[]; connections: [ClusterId, ClusterId][];
};

// These are editorial positions, not geographic coordinates. The three Hong
// Kong records remain separate because their institutions and roles differ.
const coordinateDetails: CoordinateDetail[] = [
  { city: "YINGTAN", location: copy("江西鹰潭", "Yingtan, Jiangxi"), institution: "真兮摄影工作室", keywords: ["Photography", "Observation", "Light", "Composition", "Visual Sensitivity"], position: [14, 35], size: 12, weights: [1, .07, .04, .03], density: .2, spread: .8, narrative: 0, activeSkills: ["Photography", "Light", "Observation"], connections: [] },
  { city: "WUHAN", location: copy("湖北武汉", "Wuhan, Hubei"), institution: "湖北工业大学商贸学院", keywords: ["Photography", "Visual", "Image", "Composition", "Creation"], position: [38, 19], size: 17, weights: [1, .12, .04, .03], density: .38, spread: 1.1, narrative: 0, activeSkills: ["Image", "Composition", "Creation"], connections: [] },
  { city: "HONG KONG", location: copy("香港", "Hong Kong"), institution: "香港都会大学", keywords: ["Creative Writing", "Narrative", "Stage", "Animation", "Script", "Biography"], position: [64, 29], size: 16, weights: [1, .38, .07, .04], density: .48, spread: 1.08, narrative: 1, activeSkills: ["Narrative", "Stage", "Script"], connections: [["visual", "brand"]] },
  { city: "SHENZHEN", location: copy("深圳", "Shenzhen"), institution: "吾往国风首饰", keywords: ["Brand", "Content", "Communication", "Operations", "Chinese Aesthetic"], position: [84, 50], size: 14, weights: [.9, 1, .15, .05], density: .6, spread: 1.05, narrative: .65, activeSkills: ["Brand", "Content", "Communication"], connections: [["visual", "brand"]] },
  { city: "CHINA", location: copy("全国各地", "Across China"), institution: "个人作品创作 / 学习", keywords: ["Field Research", "Photography", "Observation", "Travel", "Content", "Media"], position: [58, 69], size: 21, openField: true, weights: [1, .72, .13, .1], density: .42, spread: 1.5, narrative: .5, activeSkills: ["Photography", "Observation", "Content", "Media"], connections: [["visual", "brand"]] },
  { city: "HONG KONG", location: copy("香港", "Hong Kong"), institution: "CHAMP MVP", keywords: ["Visual", "Video", "Event", "Platform", "Content"], position: [29, 78], size: 18, weights: [1, 1, .42, .15], density: .8, spread: 1.12, narrative: .55, activeSkills: ["Visual", "Video", "Event", "Content"], connections: [["visual", "brand"], ["brand", "system"]] },
  { city: "HONG KONG", location: copy("香港", "Hong Kong"), institution: "CHAMP MVP", keywords: ["System", "Operations", "Leadership", "WeCom", "500+ Users", "Knowledge Base", "Learning Platform", "AI Workflow"], position: [23, 57], size: 26, weights: [.8, .88, 1, .74], density: 1, spread: 1.05, narrative: .6, activeSkills: ["WeCom", "Leadership", "AI Workflow"], connections: [["system", "visual"], ["system", "brand"], ["system", "ai"]] },
];

export const profileCoordinates = coordinateDetails.map((coordinate, index) => ({ ...experiences[index], ...coordinate, number: String(index + 1).padStart(2, "0") }));

export const highlights = [
  copy("品牌活动策划", "Brand event planning"), copy("视觉海报设计", "Visual poster design"), copy("大型活动摄影", "Large-scale event photography"),
  copy("500+ 人企业微信后台架构", "WeCom architecture · 500+ people"), copy("线上学习系统", "Online learning system"), copy("AI 知识库", "AI knowledge base"),
  copy("Creative Coding", "Creative Coding"), copy("Generative Visual", "Generative Visual"),
];

// The timeline uses the same verified records without the old map's visual settings.
export const profileTimeline = profileCoordinates.map(({ id, date, title, summary, items, city, location, institution, keywords, number }) => ({
  id, date, title: id === "2024" ? copy("个人作品创作 / 采风 / 学习新媒体运营", "Personal work / field practice / new-media learning") : title,
  summary: id === "2024" ? copy("在全国各地采风，持续摄影与个人作品创作，同时学习新媒体运营，让观察重新成为创作的起点。", "Travelled across China for photography and personal work, while studying new-media operations and returning to observation as a starting point.") : summary,
  items, city, location, institution: id === "2024" ? "独立创作 / INDEPENDENT PRACTICE" : institution, keywords, number,
}));

export const currentFocus = [
  { label: copy("品牌活动策划", "Brand event planning"), category: "BRAND" },
  { label: copy("视觉海报设计", "Visual poster design"), category: "VISUAL" },
  { label: copy("大型活动摄影", "Large-scale event photography"), category: "VISUAL" },
  { label: copy("500 人企业微信后台架构", "WeCom architecture for 500 people"), category: "SYSTEM" },
  { label: copy("线上学习系统", "Online learning system"), category: "SYSTEM" },
  { label: copy("AI 知识库", "AI knowledge base"), category: "SYSTEM / AI" },
  { label: copy("AI 工作流探索", "Exploring AI workflows"), category: "AI" },
];
