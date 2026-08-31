import { photoWallImages, type PhotoWallImage } from "@/data/photoWall";

export type TravelWorldPlace = {
  id: string;
  nameZh: string;
  nameEn: string;
  countryZh: string;
  countryEn: string;
  lat: number;
  lng: number;
  date: string;
  caption: string;
  photoIds: string[];
};

export type TravelWorldArc = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

const GOLD = "#d6b46a";
const SOFT_GOLD = "#e4d1a1";
const BLUE = "#6ea6b8";

export const travelWorldPlaces: TravelWorldPlace[] = [
  { id: "hong-kong", nameZh: "香港", nameEn: "Hong Kong", countryZh: "中国", countryEn: "China", lat: 22.3193, lng: 114.1694, date: "2023.12 / 2024.01 / 2024.08", caption: "毕业、露营、重新回到这里工作。香港像一段反复出现的章节。", photoIds: ["pw-11", "pw-15", "pw-20"] },
  { id: "shenzhen", nameZh: "深圳", nameEn: "Shenzhen", countryZh: "中国", countryEn: "China", lat: 22.5431, lng: 114.0579, date: "2026.03", caption: "第一次从这个高度看深圳的灯光秀，熟悉的城市突然有点陌生。", photoIds: ["pw-07"] },
  { id: "macau", nameZh: "澳门", nameEn: "Macau", countryZh: "中国", countryEn: "China", lat: 22.1987, lng: 113.5439, date: "2024.03 / 2024.09", caption: "红发、烟花、热闹和值得特意去看一次的夜晚。", photoIds: ["pw-04", "pw-09"] },
  { id: "zhuhai", nameZh: "珠海", nameEn: "Zhuhai", countryZh: "中国", countryEn: "China", lat: 22.2711, lng: 113.5767, date: "2024.02", caption: "第一次拍到这样的古今同框，好像也重新认识了一次珠海。", photoIds: ["pw-02"] },
  { id: "guangzhou", nameZh: "广州", nameEn: "Guangzhou", countryZh: "中国", countryEn: "China", lat: 23.1291, lng: 113.2644, date: "2024.12", caption: "为了吃也值得。广州真的很好吃。", photoIds: ["pw-23"] },
  { id: "yingtan", nameZh: "鹰潭", nameEn: "Yingtan", countryZh: "中国", countryEn: "China", lat: 28.2602, lng: 117.0692, date: "2024.04 / 2025.02 / 2026.02", caption: "家里的晚霞、春节限定见面，还有又要出门打工的时刻。", photoIds: ["pw-13", "pw-22", "pw-27"] },
  { id: "jingdezhen", nameZh: "景德镇", nameEn: "Jingdezhen", countryZh: "中国", countryEn: "China", lat: 29.2688, lng: 117.1784, date: "2024.02", caption: "和几个傻大儿一起去捏泥巴，好笑就已经很值得记住。", photoIds: ["pw-24"] },
  { id: "sanya-lingshui", nameZh: "三亚 · 陵水", nameEn: "Sanya · Lingshui", countryZh: "中国", countryEn: "China", lat: 18.2528, lng: 109.5120, date: "2024.04", caption: "淡季、不上班、人又少。安静下来的三亚也可以这么美。", photoIds: ["pw-05"] },
  { id: "shantou-nanao", nameZh: "汕头 · 南澳岛", nameEn: "Shantou · Nan'ao", countryZh: "中国", countryEn: "China", lat: 23.4217, lng: 117.0234, date: "2025.12", caption: "2025 年最后一次旅行，南澳岛给了我很多惊喜。", photoIds: ["pw-06"] },
  { id: "shanwei", nameZh: "汕尾", nameEn: "Shanwei", countryZh: "中国", countryEn: "China", lat: 22.7862, lng: 115.3751, date: "2024.03", caption: "一路从长沙走到汕尾，也算是在旅途中把这个年过了。", photoIds: ["pw-25"] },
  { id: "tiger-leaping-gorge", nameZh: "云南 · 虎跳峡", nameEn: "Yunnan · Tiger Leaping Gorge", countryZh: "中国", countryEn: "China", lat: 27.1924, lng: 100.1222, date: "2023.09", caption: "两天徒步，累是真的累，美也是真的美。", photoIds: ["pw-26"] },
  { id: "yulong-snow-mountain", nameZh: "玉龙雪山", nameEn: "Yulong Snow Mountain", countryZh: "中国", countryEn: "China", lat: 27.1000, lng: 100.1730, date: "2023.09", caption: "穿着洞洞鞋上了玉龙雪山，现在回头看还是挺佩服当时的自己。", photoIds: ["pw-12"] },
  { id: "qinghai-lake", nameZh: "青海湖", nameEn: "Qinghai Lake", countryZh: "中国", countryEn: "China", lat: 36.8965, lng: 100.1746, date: "2021.10", caption: "疫情里的国庆，一个人出发去大西北。第一次站在青海湖边，只觉得真的太美了。", photoIds: ["pw-01"] },
  { id: "chaerhan-salt-lake", nameZh: "察尔汗盐湖", nameEn: "Chaerhan Salt Lake", countryZh: "中国", countryEn: "China", lat: 36.7137, lng: 95.1950, date: "2021.10", caption: "一个人出发，拼车遇见了一群有趣的人。旅途中最好的惊喜，有时候不是风景。", photoIds: ["pw-08"] },
  { id: "altay", nameZh: "新疆 · 阿勒泰", nameEn: "Xinjiang · Altay", countryZh: "中国", countryEn: "China", lat: 47.8456, lng: 88.1318, date: "2025.01", caption: "新疆的美拍下来了很多，但还是觉得无法用言语形容。", photoIds: ["pw-10"] },
  { id: "taipei", nameZh: "台北", nameEn: "Taipei", countryZh: "中国台湾", countryEn: "Taiwan, China", lat: 25.0330, lng: 121.5654, date: "2025.04", caption: "第一次来台湾就喜欢上了这里，温柔、安静、热情、善良。", photoIds: ["pw-16"] },
  { id: "hualien", nameZh: "花莲", nameEn: "Hualien", countryZh: "中国台湾", countryEn: "Taiwan, China", lat: 23.9872, lng: 121.6015, date: "2025.05", caption: "太美了，真的太美了。台湾二刷，花莲一定还会再来。", photoIds: ["pw-21"] },
  { id: "kaohsiung", nameZh: "高雄", nameEn: "Kaohsiung", countryZh: "中国台湾", countryEn: "Taiwan, China", lat: 22.6273, lng: 120.3014, date: "2026.07", caption: "高雄旅行的核心内容：疯狂吃吃吃吃吃。", photoIds: ["pw-18"] },
  { id: "kenting", nameZh: "垦丁", nameEn: "Kenting", countryZh: "中国台湾", countryEn: "Taiwan, China", lat: 21.9469, lng: 120.7798, date: "2026.07", caption: "从台南一路到垦丁，宝岛依然是宝岛。", photoIds: ["pw-17"] },
  { id: "pattaya", nameZh: "芭提雅", nameEn: "Pattaya", countryZh: "泰国", countryEn: "Thailand", lat: 12.9236, lng: 100.8825, date: "2023.02", caption: "起跳前是害怕，跳下去以后脑子里只剩一句：太刺激了。", photoIds: ["pw-03"] },
  { id: "thailand-islands", nameZh: "泰国海岛", nameEn: "Thai Islands", countryZh: "泰国", countryEn: "Thailand", lat: 7.8804, lng: 98.3923, date: "2023.02", caption: "没什么大道理，就是狠狠出片。", photoIds: ["pw-14", "pw-29"] },
  { id: "koh-samet", nameZh: "沙美岛", nameEn: "Koh Samet", countryZh: "泰国", countryEn: "Thailand", lat: 12.5684, lng: 101.4578, date: "2023.08", caption: "四个人去泰国，照片里只有三个人，全员不拍照大队实锤。", photoIds: ["pw-19"] },
  { id: "maldives", nameZh: "马尔代夫", nameEn: "Maldives", countryZh: "马尔代夫", countryEn: "Maldives", lat: 3.2028, lng: 73.2207, date: "2026.04", caption: "看海算是大圆满了——但肯定还要二刷别的岛。", photoIds: ["pw-28"] },
];

const placeById = new Map(travelWorldPlaces.map((place) => [place.id, place]));
const arc = (order: number, start: string, end: string, arcAlt: number, color: string): TravelWorldArc => {
  const from = placeById.get(start);
  const to = placeById.get(end);
  if (!from || !to) throw new Error(`Missing travel place for arc: ${start} -> ${end}`);
  return { order, startLat: from.lat, startLng: from.lng, endLat: to.lat, endLng: to.lng, arcAlt, color };
};

export const travelWorldArcs: TravelWorldArc[] = [
  arc(1, "hong-kong", "macau", .08, GOLD),
  arc(1, "hong-kong", "shenzhen", .08, SOFT_GOLD),
  arc(2, "hong-kong", "taipei", .14, GOLD),
  arc(2, "hong-kong", "hualien", .16, BLUE),
  arc(3, "hong-kong", "kaohsiung", .15, GOLD),
  arc(3, "hong-kong", "kenting", .16, SOFT_GOLD),
  arc(4, "hong-kong", "pattaya", .21, GOLD),
  arc(4, "hong-kong", "thailand-islands", .24, SOFT_GOLD),
  arc(5, "hong-kong", "koh-samet", .22, BLUE),
  arc(5, "hong-kong", "maldives", .34, GOLD),
  arc(6, "yingtan", "qinghai-lake", .24, SOFT_GOLD),
  arc(6, "yingtan", "chaerhan-salt-lake", .28, BLUE),
  arc(7, "yingtan", "tiger-leaping-gorge", .18, GOLD),
  arc(7, "yingtan", "yulong-snow-mountain", .16, SOFT_GOLD),
  arc(8, "hong-kong", "altay", .32, GOLD),
  arc(8, "hong-kong", "sanya-lingshui", .18, SOFT_GOLD),
  arc(9, "hong-kong", "shantou-nanao", .12, GOLD),
  arc(9, "hong-kong", "shanwei", .1, BLUE),
];

export const getTravelPlacePhotos = (place: TravelWorldPlace) =>
  place.photoIds
    .map((photoId) => photoWallImages.find((photo) => photo.id === photoId))
    .filter((photo): photo is PhotoWallImage => Boolean(photo));
