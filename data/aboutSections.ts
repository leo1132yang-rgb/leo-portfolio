export const aboutSections = [
  { number: "02", slug: "profile", cn: "个人履历", en: "Career Profile", tag: "PROFILE", cnNote: "从摄影与创意写作，到品牌运营与系统建设，查看我的学习与职业进程。", enNote: "From photography and creative writing to brand operations and system building." },
  { number: "03", slug: "method", cn: "我的工作方式", en: "How I Work", tag: "METHOD", cnNote: "在属于工作的时间里，追求绝对效率。", enNote: "A clear method for focused, effective work." },
  { number: "04", slug: "system", cn: "Leo OS", en: "Leo OS", tag: "SYSTEM", cnNote: "看看我如何整理工作、状态、工具与方法。", enNote: "How I organize work, status, tools and methods." },
  { number: "05", slug: "personal", cn: "Leo Pocket", en: "Leo Pocket", tag: "PERSONAL", cnNote: "一些没有放进简历里的兴趣、近况与个人想法。", enNote: "Interests, recent notes and thoughts beyond the résumé." },
  { number: "06", slug: "end", cn: "仍在观察，也仍在路上", en: "Still Observing, Still Moving", tag: "END", cnNote: "个人语言与最终注释。", enNote: "A personal line and a final note." },
] as const;

export type AboutSlug = (typeof aboutSections)[number]["slug"];
export const aboutHref = (slug: AboutSlug) => ({
  profile: "/profile",
  method: "/method",
  system: "/leo-os",
  personal: "/leo-pocket",
  end: "/end",
})[slug];
