// Physical book measurements in metres; the existing 3.25-high shelf uses
// an enlarged studio scale. One consistent conversion preserves proportions.
export const BOOK_SCALE = 1.65;
export const SHELF_ROWS = [2.2825, 1.5825, .8825, .1925] as const;
export type ShelfBook = {
  title: string; author: string; row: number; height: number; thickness: number;
  depth: number; color: string; ink: string; accent: string;
  finish: 0 | 1 | 2 | 3; layout: number; wear: number; volume?: string;
  x: number; stacked?: number; faceOut?: boolean; lean?: number;
};
const book = (title: string, author: string, row: number, x: number, height: number, thickness: number, depth: number, color: string, ink: string, accent: string, finish: ShelfBook['finish'], layout: number, wear: number, extra: Partial<ShelfBook> = {}): ShelfBook =>
  ({title,author,row,x,height,thickness,depth,color,ink,accent,finish,layout,wear,...extra});

export const SHELF_BOOKS: ShelfBook[] = [
  ...['#d2bd85','#c9ac75','#bca078','#d8c597','#c3b394','#bda389','#cbb896'].map((color,i) => book('明朝那些事儿','当年明月',0,-.465+i*.079,.238,.043+(i%3)*.002,.166,color,'#342d26',['#793f32','#7c5134','#674239'][i%3],3,0,.18+i*.035,{volume:String(i+1).padStart(2,'0')})),
  book('平原上的摩西','双雪涛',1,-.555,.215,.033,.145,'#c9cbc0','#303d40','#617c83',0,1,.22),
  book('飞行家','双雪涛',1,-.488,.223,.035,.152,'#546d79','#e7e0cf','#a99a70',3,2,.17),
  book('猎人','双雪涛',1,-.414,.212,.037,.145,'#8c463e','#e7decb','#363d39',0,3,.25),
  book('聋哑时代','双雪涛',1,-.335,.23,.041,.15,'#c3c1b4','#393934','#60695c',0,4,.3),
  book('翅鬼','双雪涛',1,-.259,.205,.03,.14,'#677267','#eeead8','#35434a',1,2,.13),
  book('天吾手记','双雪涛',1,-.192,.218,.035,.148,'#3d444c','#e4ddcc','#97675b',0,1,.24),
  book('不间断的人','双雪涛',1,-.117,.225,.038,.15,'#d7d2c3','#3c4344','#71838c',1,3,.08),
  book('白色绵羊里的黑色绵羊','双雪涛',1,.042,.215,.026,.145,'#d9d7cd','#373b3c','#788075',3,4,.12,{faceOut:true}),
  book('论摄影','苏珊·桑塔格',2,-.55,.215,.024,.146,'#ccc6b5','#303a3d','#865149',0,2,.27),
  book('明室','罗兰·巴特',2,-.49,.203,.018,.143,'#d6d3c5','#404946','#71807b',0,1,.23),
  book('观看之道','约翰·伯格',2,-.432,.235,.022,.168,'#526573','#e6e1d4','#99988a',1,3,.15),
  book('雕刻时光','安德烈·塔可夫斯基',2,-.365,.25,.033,.175,'#40433f','#ded8c7','#8b694c',2,2,.12),
  book('设计中的设计','原研哉',2,-.282,.248,.038,.185,'#d8d2c0','#49483e','#9a7159',3,4,.08,{lean:-.045}),
  book('电影语言的语法','丹尼艾尔·阿里洪',2,.01,.25,.04,.19,'#6a756d','#ebe4d3','#a8997a',2,1,.14,{stacked:0}),
  book('写给大家看的设计书','罗宾·威廉姆斯',2,.01,.235,.025,.18,'#bcb8aa','#353d3f','#986a57',1,3,.1,{stacked:.066}),
  book('我与地坛','史铁生',3,-.55,.21,.027,.145,'#c7b99a','#484435','#7c6554',0,0,.34),
  book('一句顶一万句','刘震云',3,-.475,.228,.045,.15,'#686e65','#e5decb','#b2a17d',0,1,.26),
  book('活着','余华',3,-.394,.205,.023,.145,'#8b5347','#e7dcc5','#43443e',0,4,.3),
  book('额尔古纳河右岸','迟子建',3,-.324,.235,.034,.155,'#c9c5b4','#3f514c','#75887e',3,2,.25,{lean:.065}),
  book('定位','艾·里斯 / 杰克·特劳特',3,.025,.23,.033,.16,'#d5cbb3','#3c4241','#8a5645',1,1,.2,{stacked:0}),
  book('金字塔原理','芭芭拉·明托',3,.025,.245,.037,.18,'#4c5d65','#e0d9c7','#96815f',2,3,.16,{stacked:.05445}),
  book('创意行为','里克·鲁宾',3,.025,.233,.039,.16,'#c9c8bb','#444b45','#909884',3,4,.11,{stacked:.1155}),
];
