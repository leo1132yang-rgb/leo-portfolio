import { currentFocus, profileClusters, profileTimeline } from "./profileSystem";

type Language = "cn" | "en";

// Profile's reading copy lives here; the seven verified records remain the source of truth.
export const profileArchiveCopy = {
  cn: {
    home: "返回首页", archive: "个人档案", read: "阅览履历", now: "至今",
    eyebrow: "LEO / 个人履历", disciplines: ["视觉", "品牌", "系统", "AI"],
    practice: "持续实践中", method: "先了解，再动手。", introduction: ["从影像出发，", "逐渐走向品牌、系统与 AI。"],
    approach: "观察 · 创作 · 连接 · 构建", current: "当前阶段", city: "香港",
    timeline: "成长时间轴", journey: "一路走来", journeyNote: "七段经历，一条持续生长的线。",
    keywords: "阶段能力关键词", work: "工作内容", notes: "阶段实践",
    continues: "经历持续，探索未完。", toContinue: "未完待续",
    focus: "当前重点", focusTitle: ["现在，", "正在做的事。"],
    capability: "核心能力", capabilityTitle: "沿途积累", capabilityNote: "经历留下的能力，继续进入下一段实践。",
    workNote: "关于我的工作方式", belief: ["有落地经验的品牌运营。", "相信系统会带领团队走向强大。"],
    signoff: "时间档案", back: "回到开篇",
  },
  en: {
    home: "Back to home", archive: "Personal archive", read: "Read the timeline", now: "Present",
    eyebrow: "LEO / Timeline archive", disciplines: ["Visual", "Brand", "System", "AI"],
    practice: "A practice in progress", method: "Understand first. Then act.", introduction: ["Starting with images.", "Growing into brand, systems and AI."],
    approach: "Observe. Create. Connect. Build.", current: "Current", city: "Hong Kong",
    timeline: "The timeline", journey: "The journey", journeyNote: "Seven chapters. A continuing practice.",
    keywords: "Stage capabilities", work: "Scope of work", notes: "Practice notes",
    continues: "The practice continues.", toContinue: "To be continued",
    focus: "Current focus", focusTitle: ["Work,", "in progress."],
    capability: "Capability summary", capabilityTitle: "What stays", capabilityNote: "Capabilities carried into the next chapter.",
    workNote: "A note on the way I work", belief: ["Brand operations, grounded in practice.", "I believe systems help teams grow stronger."],
    signoff: "Timeline archive", back: "Back to the beginning",
  },
};

const terms: Record<string, string> = {
  Photography: "摄影", Observation: "观察", Light: "光线", Composition: "构图", "Visual Sensitivity": "视觉感知",
  Visual: "视觉", Image: "影像", Creation: "创作", "Creative Writing": "创意写作", Narrative: "叙事",
  Stage: "舞台", Animation: "动画", Script: "剧本", Biography: "人物传记", Brand: "品牌", Content: "内容",
  Communication: "传播", Operations: "运营", "Chinese Aesthetic": "国风美学", "Field Research": "采风",
  Travel: "行旅", Media: "新媒体", Video: "视频", Event: "活动", Platform: "平台", System: "系统",
  Leadership: "团队管理", WeCom: "企业微信", "500+ Users": "500+ 人", "Knowledge Base": "知识库",
  "Learning Platform": "学习平台", "AI Workflow": "AI 工作流", Poster: "海报", "Visual System": "视觉系统",
  Campaign: "品牌策划", "Team Workflow": "团队工作流", "AI Training": "AI 培训", "Creative Coding": "创意编程",
  "Generative Visual": "生成视觉", VISUAL: "视觉", BRAND: "品牌", SYSTEM: "系统", AI: "AI / 人工智能",
  "SYSTEM / AI": "系统 / AI",
};

const places = ["Yingtan", "Wuhan", "Hong Kong", "Shenzhen", "Across China", "Hong Kong", "Hong Kong"];
// Brand names retain their original spelling. University names are translated for English reading.
const institutions = ["真兮摄影工作室", "Business College of Hubei University of Technology", "Hong Kong Metropolitan University", "吾往国风首饰", "Independent practice", "CHAMP MVP", "CHAMP MVP"];

export function getProfileArchive(language: Language) {
  const term = (value: string) => language === "cn" ? (terms[value] ?? value) : value;
  return {
    copy: profileArchiveCopy[language],
    timeline: profileTimeline.map((entry, index) => ({
      ...entry,
      date: entry.date.replace("–", " — ").replace("NOW", profileArchiveCopy[language].now),
      location: language === "cn" ? entry.location.cn : places[index],
      institution: language === "cn" ? (index === 4 ? "独立创作与采风" : entry.institution) : institutions[index],
      title: entry.title[language], summary: entry.summary[language],
      keywords: entry.keywords.map(term), items: entry.items.map(item => item[language]),
    })),
    focus: currentFocus.map(item => ({ label: item.label[language], category: term(item.category) })),
    capabilities: profileClusters.map(cluster => ({ ...cluster, name: term(cluster.name), note: cluster.note[language], skills: cluster.skills.slice(0, 4).map(term) })),
  };
}
