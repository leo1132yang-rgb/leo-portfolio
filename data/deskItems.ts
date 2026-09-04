export type DeskItemId = "central-monitor" | "keyboard" | "mouse" | "desk-lamp" | "fuji-xt5" | "phone" | "notebook" | "watch" | "coffee" | "runtian-water" | "plant-left" | "plant-right" | "desktop-pc";

export type DeskSelection = {
  id: DeskItemId;
  center: [number, number, number];
  size: [number, number, number];
};

type Item = { title: string; en: string; tag: string; cn: string; body: string; href?: string; cta?: string; ctaEn?: string };

export const deskItems: Record<DeskItemId, Item> = {
  "central-monitor": { title: "中央控制台", en: "Central Console", tag: "DESIGN / SYSTEMS / AI", cn: "把视觉、内容与系统工作连接在一起。进入数字工作室，看看这些工具如何成为工作方法。", body: "Where visual, content and systems work come together. Explore the tools and methods in the digital workspace.", href: "/leo-os", cta: "进入数字工作室", ctaEn: "Open digital workspace" },
  keyboard: { title: "键盘", en: "Keyboard", tag: "WORDS INTO ACTION", cn: "写作、设计与 AI 工作流的输入端。想法从这里开始成为可以执行的内容。", body: "The input for writing, design and AI workflows. Where ideas become something actionable.", href: "/leo-os", cta: "查看工作方法", ctaEn: "Explore the workflow" },
  mouse: { title: "鼠标", en: "Mouse", tag: "ATTENTION TO DETAIL", cn: "选择、移动、微调。让视觉和系统里的细节准确落位。", body: "Select, move, refine. A small tool for getting the details right.", href: "/leo-os", cta: "进入数字工作室", ctaEn: "Open digital workspace" },
  "desk-lamp": { title: "桌边的暖光", en: "A pool of warm light", tag: "AFTER HOURS", cn: "屏幕之外，给工作台留一小束温暖的光。", body: "A small pool of warm light beyond the screen." },
  "fuji-xt5": { title: "FUJIFILM X-T5", en: "FUJIFILM X-T5", tag: "MY CAMERA / OBSERVATION", cn: "摄影是观察光线、人物和现场的方式。把看见的东西留住，再用影像讲述。", body: "Photography is a way of noticing light, people and places. Keep what you see, then tell it through images.", href: "/projects/photography", cta: "查看摄影作品", ctaEn: "Explore photography" },
  phone: { title: "保持联系", en: "Stay in touch", tag: "DAILY DEVICE", cn: "日常沟通、记录与现场协作。关于项目或合作，欢迎联系我。", body: "Communication, notes and on-site collaboration. Get in touch about a project or collaboration.", href: "mailto:leoyang1132@outlook.com", cta: "给 Leo 写邮件", ctaEn: "Email Leo" },
  notebook: { title: "先把想法写下来", en: "Start with a note", tag: "IDEAS / ARTICLES", cn: "想法、结构与待办，先留在纸上，再整理成可以分享的内容。", body: "Ideas, outlines and things to do. First on paper, then shaped into something worth sharing.", href: "/projects/articles", cta: "阅读文章", ctaEn: "Read articles" },
  watch: { title: "时间与成长", en: "Time & growth", tag: "KEEP MOVING", cn: "关于时间、节奏与现场。回看经历，也看见工作方法如何慢慢形成。", body: "Time, rhythm and presence. A look back at how experience becomes a way of working.", href: "/profile", cta: "查看个人履历", ctaEn: "View profile" },
  coffee: { title: "短暂停顿", en: "A small pause", tag: "DAILY RITUAL", cn: "工作台上的一杯咖啡。给正在进行的事，留一点停顿和思考的空间。", body: "A cup of coffee on the desk. A little space to pause and think." },
  "runtian-water": { title: "润田 · 家乡记忆", en: "Runtian / Home", tag: "JIANGXI / EVERYDAY MEMORY", cn: "一瓶润田，带着江西家乡的记忆。熟悉的绿色瓶盖和标签，也是工作台上的生活线索。", body: "A bottle of Runtian, a small reminder of home in Jiangxi. Its familiar green cap and label belong on this desk." },
  "plant-left": { title: "一点自然", en: "A little nature", tag: "ROOM TO BREATHE", cn: "木纹、纸张、屏幕之外，留一点绿色，让工作台也能呼吸。", body: "Beyond wood, paper and screens, a little green gives the desk room to breathe." },
  "plant-right": { title: "屏幕旁的绿色", en: "Green beside the screen", tag: "SLOW GROWTH", cn: "冷蓝屏幕旁的一点自然气息。慢下来，再继续。", body: "A little nature beside the cool screen. Slow down, then continue." },
  "desktop-pc": { title: "幕后工作站", en: "The workstation", tag: "EDIT / DESIGN / BUILD", cn: "承担设计、剪辑与数字工作的主机。工具不抢镜，把算力留给创作。", body: "The machine behind design, editing and digital work. Keeping the tools quiet and the work moving.", href: "/leo-os", cta: "查看工具与 AI 工作流", ctaEn: "Explore tools & AI workflows" },
};
