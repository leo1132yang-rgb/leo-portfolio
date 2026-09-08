export const quietInsertions = [
  { at: 510, width: 360, kind: "field", title: "村外田埂" },
  { at: 900, width: 280, kind: "woodland", title: "后山小径" },
  { at: 1250, width: 320, kind: "river", title: "水边的风" },
  { at: 1800, width: 480, kind: "lane", title: "进城的路" },
  { at: 2250, width: 400, kind: "lane", title: "游戏厅后的黄昏街道" },
  { at: 2660, width: 440, kind: "lane", title: "恒源祥旁的小巷" },
  { at: 3110, width: 480, kind: "lane", title: "商城到鸭鸭之间" },
  { at: 3600, width: 360, kind: "lane", title: "新家附近" },
  { at: 4200, width: 480, kind: "woodland", title: "慢慢安静的小路" },
] as const;
export function worldX(oldX: number) { return oldX + quietInsertions.reduce((n, gap) => n + (oldX >= gap.at ? gap.width : 0), 0); }
export const WORLD_LENGTH = worldX(4800);
export const quietZones = quietInsertions.map(gap => ({ ...gap, x: worldX(gap.at) - gap.width }));
export const scenerySections = [0, ...quietInsertions.map(g => g.at), 4800].slice(0, -1).map((start, i) => ({ sourceStart: start, sourceEnd: [...quietInsertions.map(g => g.at), 4800][i], x: worldX(start) }));
