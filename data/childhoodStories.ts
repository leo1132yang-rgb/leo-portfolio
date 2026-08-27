export type ChildhoodStoryBlock =
  | { type: "paragraph"; text: string }
  | { type: "divider"; label?: string };

export type ChildhoodTasteArchive = {
  id: string;
  title: string;
  archive: string;
  keywords: string[];
  location: string;
  temperature: string;
  body: ChildhoodStoryBlock[];
};

export type ChildhoodStory = {
  id: string;
  slug: string;
  chapter: string;
  title: string;
  subtitle: string;
  tags: string[];
  quote: string;
  body: ChildhoodStoryBlock[];
  images: string[];
  subStories?: ChildhoodTasteArchive[];
};

export const childhoodStories: ChildhoodStory[] = [
  {
    id: "01",
    slug: "baima-lijia",
    chapter: "CHAPTER 01",
    title: "白马李家",
    subtitle: "从这里出发",
    tags: ["鹰潭", "白马李家", "童年"],
    quote: "有些地方消失以后，\n才真正开始存在于记忆里。",
    body: [
      { type: "paragraph", text: "白马李家，是我和爷爷奶奶一起长大的地方，也是这组童年记忆的起点。" },
      { type: "paragraph", text: "家门口的石头路沿、村里的伙伴、后山和水库，构成了我最早认识世界的方式。那些地方后来慢慢离开了日常，却一直留在记忆里。" },
    ],
    images: [],
  },
  {
    id: "02",
    slug: "xiaohei",
    chapter: "CHAPTER 02",
    title: "我吃肉，它吃骨头",
    subtitle: "小黑",
    tags: ["小黑", "家门口", "陪伴"],
    quote: "我吃肉，\n它吃骨头。",
    body: [
      { type: "paragraph", text: "我经常端着碗坐在家门口的石头路沿上，身边是小黑。" },
      { type: "paragraph", text: "我吃肉，它吃骨头。没有特别安排过什么，这只是每天自然发生的小事。后来再想起家门口，记忆里总有它的位置。" },
    ],
    images: [],
  },
  {
    id: "03",
    slug: "the-hill-behind-home",
    chapter: "CHAPTER 03",
    title: "后山是我们的世界",
    subtitle: "夏天没有边界",
    tags: ["后山", "水库", "夏天"],
    quote: "小时候觉得后山很大，\n大到像世界的边界。",
    body: [
      { type: "paragraph", text: "后山、水库、树和河，是童年最自由的空间。我们去水库游泳，爬树抓知了，也去河里钓小龙虾。" },
      { type: "paragraph", text: "隔壁加油站的板栗、菜地里的红薯、和伙伴们一起吃的辣条，也都属于同一个漫长的夏天。" },
    ],
    images: [],
  },
  {
    id: "04",
    slug: "grandmothers-voice",
    chapter: "CHAPTER 04",
    title: "奶奶的叫骂声穿透一切",
    subtitle: "声音留下的家",
    tags: ["奶奶", "家人", "声音"],
    quote: "以前最想躲开的声音，\n后来反而最容易想念。",
    body: [
      { type: "paragraph", text: "小时候，奶奶的声音总能穿过屋子、院子和正在发生的一切。" },
      { type: "paragraph", text: "那时只觉得熟悉，后来离开得久了，才发现有些声音会替一个地方保留温度。" },
    ],
    images: [],
  },
  {
    id: "05",
    slug: "fathers-changing-shops",
    chapter: "CHAPTER 05",
    title: "父亲的店一直在变",
    subtitle: "从村里走进城市",
    tags: ["父亲", "店铺", "城市"],
    quote: "父亲的店在变化，\n我的童年也跟着一起搬家。",
    body: [
      { type: "paragraph", text: "离开村里以后，记忆跟着父亲的店走进城市。游戏机厅里最深的印象不是游戏，而是无数硬币碰撞的声音，偶尔还有警车声。" },
      { type: "paragraph", text: "后来是恒源祥保暖内衣的小店。店不大，之后又搬了两次。空间一直在变，生活也跟着重新安放。" },
    ],
    images: [],
  },
  {
    id: "06",
    slug: "sleeping-on-fathers-belly",
    chapter: "CHAPTER 06",
    title: "睡在父亲肚子上的下午",
    subtitle: "赣东商城圆盘",
    tags: ["父亲", "赣东商城", "竹床"],
    quote: "小时候不懂什么叫安全感，\n只是知道睡在那里不会掉下去。",
    body: [
      { type: "paragraph", text: "赣东商城圆盘附近的服装批发市场、公用天桥和一张竹床，是关于父亲的一段清楚记忆。" },
      { type: "paragraph", text: "父亲把竹床搬到公用的天桥上。我最喜欢睡在他的肚皮上，那是当时最安心的位置。" },
    ],
    images: [],
  },
  {
    id: "07",
    slug: "shop-downstairs-home-upstairs",
    chapter: "CHAPTER 07",
    title: "楼下卖衣服，楼上是家",
    subtitle: "银座广场 · 鸭鸭羽绒服",
    tags: ["银座广场", "鸭鸭羽绒服", "生活"],
    quote: "楼下是生意，\n楼上是家。",
    body: [
      { type: "paragraph", text: "银座广场的鸭鸭羽绒服店，一楼是店铺，二楼是我们的生活。楼下有客人和忙碌的父母，楼上吃饭、做饭、睡觉，也看电视。" },
      { type: "paragraph", text: "晚上七八点看少儿频道；早上七点，父亲会做桂圆鸡蛋汤。遇上很多年难遇的大雪时，羽绒服生意很好，父母从早忙到晚，奶奶有时会来照顾我。" },
      { type: "paragraph", text: "忙的时候，中午常去隔壁饭馆吃炒菜。对小时候的我来说，下馆子是一件特别开心的事。" },
    ],
    images: [],
  },
  {
    id: "08",
    slug: "the-taste-of-yingtan",
    chapter: "CHAPTER 08",
    title: "鹰潭的味道",
    subtitle: "味觉档案",
    tags: ["鹰潭", "食物", "家乡"],
    quote: "所有回不去的，\n最后都变成了一碗粉的温度。",
    body: [
      { type: "paragraph", text: "关于鹰潭的记忆，常常会先从味道回来。米粉、炒西瓜皮和夜里的牛骨粉，各自保存着不同的时间。" },
      { type: "divider", label: "TASTE ARCHIVE" },
    ],
    images: [],
    subStories: [
      {
        id: "08.1",
        title: "关于米粉的记忆",
        archive: "味觉档案 01 · 鹰潭米粉",
        keywords: ["捺菜", "黄豆", "猪油", "爷爷", "清晨"],
        location: "鹰潭 · 白马李家",
        temperature: "热气腾腾",
        body: [
          { type: "paragraph", text: "关于鹰潭米粉的记忆，总和清晨、爷爷，以及捺菜、黄豆和猪油的味道连在一起。" },
        ],
      },
      {
        id: "08.2",
        title: "炒西瓜皮",
        archive: "味觉档案 02 · 炒西瓜皮",
        keywords: ["西瓜皮", "家常菜", "夏天"],
        location: "鹰潭",
        temperature: "刚刚出锅",
        body: [
          { type: "paragraph", text: "炒西瓜皮，是这组童年味觉里必须单独留下的一道家常菜。" },
        ],
      },
      {
        id: "08.3",
        title: "牛骨粉 / 鹰潭的夜",
        archive: "味觉档案 03 · 牛骨粉",
        keywords: ["牛骨粉", "鹰潭", "夜晚"],
        location: "鹰潭",
        temperature: "夜里的热汤",
        body: [
          { type: "paragraph", text: "牛骨粉连着鹰潭的夜。热汤端上来时，一座城市也重新有了具体的温度。" },
        ],
      },
    ],
  },
];

export type ChildhoodStoryId = (typeof childhoodStories)[number]["id"];
