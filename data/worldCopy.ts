// Keep the main world and the travel-globe submodule distinct in both languages.
export const worldName = { cn: "我的世界", en: "Leo’s World" } as const;
export const travelGlobeName = { cn: "旅行地球", en: "Travel Globe" } as const;

export const worldIntroCopy = {
  cn: {
    title: "欢迎来到我的世界",
    paragraphs: [
      "这个空间承载了我最核心、也最喜欢的内容。",
      "我大约花了整个作品集 90% 的制作时间来完成它，\n所以也希望你可以慢慢走、慢慢看、慢慢探索。",
      "因为我还是新手，过程中也许还会有一些不够完善的地方。\n如果你在体验时遇到 bug 或任何问题，也欢迎告诉我。",
      "谢谢你来到这里。",
    ],
    enter: "进入我的世界",
    waiting: "正在进入我的世界…",
    retry: "加载未完成，点击重试",
    feedback: "告诉我你的发现",
  },
  en: {
    title: "Welcome to Leo’s World",
    paragraphs: [
      "This space holds the work closest to my heart.",
      "I spent around 90% of this portfolio’s production time making it.\nI hope you’ll take your time, look around, and explore at your own pace.",
      "I’m still learning, so some things may not be quite right yet.\nIf you run into a bug or anything that feels off, please let me know.",
      "Thank you for being here.",
    ],
    enter: "Enter Leo’s World",
    waiting: "Entering Leo’s World…",
    retry: "Loading interrupted — retry",
    feedback: "Share what you find",
  },
} as const;
