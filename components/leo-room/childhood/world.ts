import { worldX, WORLD_LENGTH } from "./layout";
export type SceneId = "street" | "home" | "shop" | "kitchen" | "bedroom" | "reservoir" | "playground" | "orchard" | "grove" | "station" | "outskirts" | "town" | "market" | "arcade" | "heng" | "gandong" | "schoolroad";
export type Actor = "leo" | "father" | "grandfather" | "grandmother" | "friend" | "friend2" | "dog";
export type EventKind = "greet" | "cook" | "share" | "dog" | "play" | "climb" | "harvest" | "swim" | "fish" | "snack" | "photo" | "trade" | "belly" | "sleep" | "breakfast" | "ending";
export type MemoryEvent = {
  id: string; title: string; scene: SceneId; x: number; kind: EventKind;
  pages: number[]; line: string; duration: number; requires?: string[];
};
export type Door = { id: string; title: string; scene: SceneId; x: number; to: SceneId; spawn: number; requires?: string[] };
export type Npc = { id: string; actor: Actor; scene: SceneId; x: number; facing?: number };
export const GROUND = 504;
export const WORLD_HEIGHT = 600;
export const parallaxLayers = { distantClouds: .22, midground: .66, landscape: 1, foreground: 1.18 };
export const scenes: Record<SceneId, { width: number; title: string; act: number; outdoor?: boolean }> = {
  street: { width: 3600, title: "从白马李家出发", act: 1, outdoor: true },
  playground: { width: 1800, title: "树荫下的空地", act: 2, outdoor: true },
  orchard: { width: 1800, title: "后山果园与菜地", act: 2, outdoor: true },
  grove: { width: 1800, title: "林间的知了与篝火", act: 2, outdoor: true },
  station: { width: 1200, title: "加油站旁的香蕉树", act: 2, outdoor: true },
  outskirts: { width: 1800, title: "从田野走向县城", act: 3, outdoor: true },
  town: { width: 1800, title: "老街 · 游戏厅与恒源祥", act: 3, outdoor: true },
  market: { width: 1800, title: "商城街 · 赣东商城与鸭鸭", act: 3, outdoor: true },
  arcade: { width: 1800, title: "游戏机厅 · 父亲的第一间店", act: 3, outdoor: true },
  heng: { width: 1800, title: "恒源祥 · 整理衣服的父亲", act: 3, outdoor: true },
  gandong: { width: 1800, title: "赣东商城 · 白天与打烊以后", act: 3, outdoor: true },
  schoolroad: { width: 1800, title: "新的家与学校", act: 4, outdoor: true },
  reservoir: { width: 1200, title: "水库 · 夏天很长", act: 2, outdoor: true },
  home: { width: 720, title: "白马李家 · 爷爷的厨房", act: 1 },
  shop: { width: 720, title: "鸭鸭羽绒服 · 一楼店铺", act: 3 },
  kitchen: { width: 720, title: "鸭鸭羽绒服 · 二楼厨房", act: 3 },
  bedroom: { width: 720, title: "厨房门后 · 睡觉的地方，也是仓库", act: 3 },
};
export const acts = [
  { start: 0, end: 510, title: "白马李家", subtitle: "ACT 01 / 家门口的夏天" },
  { start: 510, end: 1800, title: "伙伴与自然", subtitle: "ACT 02 / 夏天没有边界" },
  { start: 1800, end: 3600, title: "跟着父亲", subtitle: "ACT 03 / 店铺变了，家还在" },
  { start: 3600, end: 4200, title: "新的家与学校", subtitle: "ACT 04 / 再往前一点" },
  { start: 4200, end: 4800, title: "慢慢长大", subtitle: "ACT 05 / 那些日子，一直都在" },
];
export const memoryEvents: MemoryEvent[] = [
  { id: "arrival", title: "童年的原点", scene: "street", x: 220, kind: "greet", pages: [1], line: "爷爷：回来啦。", duration: 4 },
  { id: "grandpa-cooks", title: "爷爷的厨房", scene: "home", x: 270, kind: "cook", pages: [2], line: "爷爷：土豆烧肉，蒸蛋……饭好了。", duration: 7 },
  { id: "grandpa-shares", title: "爷爷把肉留给你", scene: "home", x: 460, kind: "share", pages: [3, 11], line: "爷爷：我不爱吃，你吃。", duration: 6, requires: ["grandpa-cooks"] },
  { id: "xiaohei", title: "我吃肉，它吃骨头", scene: "street", x: 345, kind: "dog", pages: [4], line: "这块骨头，给你。", duration: 6 },
  { id: "grandma", title: "奶奶的声音", scene: "street", x: 460, kind: "greet", pages: [], line: "奶奶：别跑远了，记得回来吃饭！", duration: 4 },
  { id: "marbles", title: "石头路上的弹珠", scene: "street", x: 590, kind: "play", pages: [5], line: "伙伴：该你了！", duration: 5 },
  { id: "cards", title: "圆卡、斗鸡与瞎子摸拐子", scene: "street", x: 700, kind: "play", pages: [], line: "伙伴：这回轮到你来找我们。", duration: 6 },
  { id: "chestnuts", title: "捅树上的栗子", scene: "street", x: 810, kind: "climb", pages: [], line: "再高一点……掉下来啦！", duration: 5 },
  { id: "sweet-potato", title: "去菜地偷红薯", scene: "street", x: 930, kind: "harvest", pages: [7], line: "把红薯埋进余烬里，慢慢等。", duration: 6 },
  { id: "oranges", title: "后山的橘子", scene: "street", x: 1040, kind: "climb", pages: [9], line: "伙伴：接住！", duration: 5 },
  { id: "reservoir", title: "从岸边下水，游一会儿", scene: "reservoir", x: 310, kind: "swim", pages: [6], line: "水面一圈圈荡开，夏天很长。", duration: 10 },
  { id: "crayfish", title: "水渠旁的小龙虾", scene: "street", x: 1280, kind: "fish", pages: [8], line: "别急着提，它咬住了。", duration: 6 },
  { id: "cicada", title: "树上的知了", scene: "street", x: 1410, kind: "climb", pages: [10], line: "蝉鸣就在头顶。", duration: 5 },
  { id: "campfire", title: "后山的一小堆火", scene: "street", x: 1510, kind: "snack", pages: [], line: "烤知了、烤鸡，大家围在一起。", duration: 5 },
  { id: "bananas", title: "隔壁加油站的香蕉", scene: "street", x: 1640, kind: "climb", pages: [], line: "伙伴：那边还有一串。", duration: 5 },
  { id: "spicy-strips", title: "一起分一包辣条", scene: "street", x: 1750, kind: "snack", pages: [], line: "一人一点，刚刚好。", duration: 5 },
  { id: "arcade", title: "父亲的第一间游戏厅", scene: "street", x: 2010, kind: "photo", pages: [12], line: "父亲：来，站到我旁边。", duration: 6 },
  { id: "hengyuanxiang", title: "恒源祥门口", scene: "street", x: 2420, kind: "photo", pages: [13], line: "店在变。我跟着父亲，一起走。", duration: 6 },
  { id: "gandong-day", title: "赣东商城 · 打烊之前", scene: "street", x: 2810, kind: "trade", pages: [], line: "父亲：把这件衣服放好，我们歇一会儿。", duration: 6 },
  { id: "fathers-belly", title: "睡在父亲的肚皮上", scene: "street", x: 2870, kind: "belly", pages: [14], line: "", duration: 12, requires: ["gandong-day"] },
  { id: "warehouse", title: "楼下是店，楼上是家", scene: "bedroom", x: 375, kind: "sleep", pages: [15], line: "厨房的门后，是床铺，也是仓库。", duration: 7 },
  { id: "snow-morning", title: "大雪那天的早晨", scene: "bedroom", x: 480, kind: "breakfast", pages: [16], line: "父亲：Leo，起床啦。汤和小笼包都热着。", duration: 13, requires: ["warehouse"] },
  { id: "school", title: "离学校很近的新家", scene: "street", x: 3860, kind: "greet", pages: [17], line: "从家门口走一小段，就到二二三队学校。", duration: 6 },
  { id: "ending", title: "那些日子，一直都在", scene: "street", x: 4580, kind: "ending", pages: [18], line: "童年就这样慢慢结束了。", duration: 14 },
];
export const doors: Door[] = [
  { id: "reservoir-in", title: "沿小路去水库", scene: "street", x: 1160, to: "reservoir", spawn: 110 },
  { id: "reservoir-out", title: "回到后山小路", scene: "reservoir", x: 50, to: "street", spawn: 1120 },
  { id: "home-in", title: "走进爷爷的厨房", scene: "street", x: 85, to: "home", spawn: 110 },
  { id: "home-out", title: "回到院子", scene: "home", x: 55, to: "street", spawn: 135 },
  { id: "yaya-in", title: "走进鸭鸭羽绒服", scene: "street", x: 3320, to: "shop", spawn: 95 },
  { id: "shop-out", title: "回到街道", scene: "shop", x: 40, to: "street", spawn: 3380 },
  { id: "stairs-up", title: "沿楼梯上二楼", scene: "shop", x: 605, to: "kitchen", spawn: 120 },
  { id: "stairs-down", title: "下楼到店里", scene: "kitchen", x: 55, to: "shop", spawn: 540 },
  { id: "bedroom-in", title: "推开厨房的门", scene: "kitchen", x: 610, to: "bedroom", spawn: 125 },
  { id: "bedroom-out", title: "穿过门回到厨房", scene: "bedroom", x: 55, to: "kitchen", spawn: 550 },
];
export const npcs: Npc[] = [
  { id: "grandpa-out", actor: "grandfather", scene: "street", x: 235 },
  { id: "grandma-out", actor: "grandmother", scene: "street", x: 475, facing: -1 },
  { id: "dog-out", actor: "dog", scene: "street", x: 375, facing: -1 },
  { id: "grandpa-in", actor: "grandfather", scene: "home", x: 315 },
  { id: "friend-a", actor: "friend", scene: "street", x: 615, facing: -1 },
  { id: "friend-b", actor: "friend2", scene: "street", x: 680 },
  { id: "swimmer", actor: "friend2", scene: "reservoir", x: 650 },
  { id: "snack-friend", actor: "friend", scene: "street", x: 1730 },
  { id: "arcade-father", actor: "father", scene: "street", x: 2050, facing: -1 },
  { id: "heng-father", actor: "father", scene: "street", x: 2460, facing: -1 },
  { id: "gandong-father", actor: "father", scene: "street", x: 2850, facing: -1 },
  { id: "shop-father", actor: "father", scene: "shop", x: 300 },
  { id: "kitchen-father", actor: "father", scene: "kitchen", x: 260 },
  { id: "morning-father", actor: "father", scene: "bedroom", x: 530, facing: -1 },
];
export const platforms = [
  { x: 750, y: 453, w: 90 }, { x: 1020, y: 454, w: 80 }, { x: 1380, y: 451, w: 80 },
];
// Keep all existing event IDs, page mappings and artwork. Only their world positions move.
for (const event of memoryEvents) if (event.scene === "street") event.x = worldX(event.x);
for (const npc of npcs) if (npc.scene === "street") npc.x = worldX(npc.x);
for (const door of doors) { if (door.scene === "street") door.x = worldX(door.x); if (door.to === "street") door.spawn = worldX(door.spawn); }
for (const act of acts) { act.start = worldX(act.start); act.end = worldX(act.end); }
for (const platform of platforms) platform.x = worldX(platform.x);

// Memories now live in their own places. Their IDs, text and story pages remain stable.
const memoryPlaces: Record<string, [SceneId, number]> = {
  marbles: ['playground', 450], cards: ['playground', 1350],
  chestnuts: ['orchard', 380], oranges: ['orchard', 1000], 'sweet-potato': ['orchard', 1630],
  crayfish: ['reservoir', 1080], cicada: ['grove', 420], campfire: ['grove', 1350],
  bananas: ['station', 830], 'spicy-strips': ['station', 260],
  arcade: ['arcade', 900], hengyuanxiang: ['heng', 900],
  'gandong-day': ['gandong', 700], 'fathers-belly': ['gandong', 1350],
  school: ['schoolroad', 480], ending: ['schoolroad', 1530],
};
for (const event of memoryEvents) if (memoryPlaces[event.id]) [event.scene, event.x] = memoryPlaces[event.id];
const npcPlaces: Record<string, [SceneId, number]> = {
  'friend-a': ['playground', 480], 'friend-b': ['playground', 1380],
  'snack-friend': ['station', 290], 'arcade-father': ['arcade', 940],
  'heng-father': ['heng', 940], 'gandong-father': ['gandong', 740],
};
for (const npc of npcs) if (npcPlaces[npc.id]) [npc.scene, npc.x] = npcPlaces[npc.id];
for (const door of doors) {
  if (door.id === 'reservoir-in') door.x = 2150;
  if (door.id === 'reservoir-out') door.spawn = 2110;
  if (door.id === 'yaya-in') { door.scene = 'market'; door.x = 1540; }
  if (door.id === 'shop-out') { door.to = 'market'; door.spawn = 1580; }
}
for (const [id, from, x, to] of [
  ['playground', 'street', 950, 'playground'], ['orchard', 'street', 1600, 'orchard'],
  ['grove', 'street', 2900, 'grove'], ['station', 'outskirts', 1180, 'station'],
  ['arcade', 'town', 265, 'arcade'], ['heng', 'town', 1530, 'heng'], ['gandong', 'market', 340, 'gandong'],
] as const) {
  doors.push({ id: `${id}-in`, title: `走进${scenes[to].title.split(' · ')[0]}`, scene: from, x, to, spawn: 130 });
  doors.push({ id: `${id}-out`, title: '沿来时的路返回', scene: to, x: 50, to: from, spawn: x - 45 });
}
export const routeLinks: Partial<Record<SceneId, { left?: SceneId; right?: SceneId }>> = {
  street: { right: 'outskirts' }, outskirts: { left: 'street', right: 'town' },
  town: { left: 'outskirts', right: 'market' }, market: { left: 'town', right: 'schoolroad' },
  schoolroad: { left: 'market' },
};

// Both ends of an entered place lead back to its parent entrance.
export const placeReturns: Partial<Record<SceneId, Door>> = Object.fromEntries(
  ['home-out', 'shop-out', 'stairs-down', 'bedroom-out', 'reservoir-out',
    'playground-out', 'orchard-out', 'grove-out', 'station-out', 'arcade-out', 'heng-out', 'gandong-out']
    .map(id => doors.find(door => door.id === id)!)
    .map(door => [door.scene, door]),
);

export type SmallInteraction = { id: string; title: string; scene: SceneId; x: number; kind: "pet" | "stone" | "tree" | "water" | "sit" | "shelf" | "arcade"; requires?: string[] };
export const smallInteractions: SmallInteraction[] = [
  { id: "pet-dog", title: "摸摸小黑", scene: "street", x: 375, kind: "pet", requires: ["xiaohei"] },
  { id: "doorstep", title: "在门槛坐一会儿", scene: "street", x: 125, kind: "sit" },
  { id: "pebble", title: "踢一下石头", scene: "street", x: 660, kind: "stone" },
  { id: "leaves", title: "碰一碰树枝", scene: "street", x: 810 + 90, kind: "tree" },
  { id: "river-watch", title: "看看水面", scene: "street", x: 1160 + 70, kind: "water" },
  { id: "arcade-screen", title: "看看街机", scene: "street", x: 1950, kind: "arcade" },
  { id: "clothes", title: "摸摸衣服", scene: "street", x: 2520, kind: "shelf" },
  { id: "carton", title: "看看纸箱", scene: "street", x: 2970, kind: "shelf" },
].map(item => ({ ...item, scene: item.scene as SceneId, kind: item.kind as SmallInteraction["kind"], x: worldX(item.x) }));
smallInteractions.push(
  { id: "shop-coats", title: "看看羽绒服", scene: "shop", x: 410, kind: "shelf" },
  { id: "kitchen-stool", title: "坐一小会儿", scene: "kitchen", x: 400, kind: "sit" },
  { id: "warehouse-box", title: "碰一碰箱子", scene: "bedroom", x: 625, kind: "shelf" },
);
const smallPlaces: Record<string, [SceneId, number]> = {
  pebble: ['playground', 900], leaves: ['orchard', 700], 'river-watch': ['reservoir', 740],
  'arcade-screen': ['arcade', 1400], clothes: ['heng', 1400], carton: ['gandong', 1050],
};
for (const item of smallInteractions) if (smallPlaces[item.id]) [item.scene, item.x] = smallPlaces[item.id];
export function unlockedPages(ids: string[]) {
  return [...new Set(memoryEvents.filter(e => ids.includes(e.id)).flatMap(e => e.pages))].sort((a, b) => a - b);
}
export function available(event: { requires?: string[] }, completed: string[]) {
  return !event.requires || event.requires.every(id => completed.includes(id));
}
