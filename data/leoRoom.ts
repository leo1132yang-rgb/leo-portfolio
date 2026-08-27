export type Vector3Tuple = [number, number, number];

export type RoomObject = {
  id: string;
  geometry: "monitor" | "blackboard" | "photos" | "television" | "bookshelf" | "board" | "dog-bed" | "window" | "skateboard" | "camera-cabinet";
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  title: { cn: string; en: string };
  kicker: { cn: string; en: string };
  description: { cn: string; en: string };
  destination?: string;
  destinationLabel?: { cn: string; en: string };
  camera: { position: Vector3Tuple; target: Vector3Tuple };
};

export const cameraPositions = {
  overview: { position: [9.7, 8.35, 12.2] as Vector3Tuple, target: [0, 1.55, -0.75] as Vector3Tuple },
};

// Replace only `geometry` with future GLB components; IDs, copy, navigation and camera focus remain stable.
export const interactiveObjects: RoomObject[] = [
  { id: "monitor", geometry: "monitor", position: [0, 2.08, -0.4], title: { cn: "项目作品", en: "Projects" }, kicker: { cn: "工作台", en: "Workstation" }, description: { cn: "视觉、活动、视频与项目现场的真实输出。", en: "Visual, event, video and on-site project work." }, destination: "/projects", destinationLabel: { cn: "进入项目作品", en: "Explore projects" }, camera: { position: [2.8, 3.2, 5.8], target: [0, 1.75, -0.45] } },
  { id: "blackboard", geometry: "blackboard", position: [-5.95, 2.8, -2.5], rotation: [0, Math.PI / 2, 0], title: { cn: "个人履历", en: "Profile" }, kicker: { cn: "时间轴黑板", en: "Timeline board" }, description: { cn: "从摄影、表达与现场，走向协作、运营与系统建设。", en: "From photography and expression to operations, collaboration and systems." }, destination: "/profile", destinationLabel: { cn: "查看个人履历", en: "View profile" }, camera: { position: [-4.6, 3.25, 2.4], target: [-5.55, 2.55, -2.35] } },
  { id: "photos", geometry: "photos", position: [-1.45, 3.2, -3.88], title: { cn: "照片墙", en: "Photo Wall" }, kicker: { cn: "生活与摄影", en: "Photography & life" }, description: { cn: "留给摄影、生活片段与未来个人影像项目的空间。", en: "A space for photography, life fragments and future visual projects." }, destination: "/projects#photography", destinationLabel: { cn: "查看摄影作品", en: "View photography" }, camera: { position: [-1.1, 3.0, 2.1], target: [-1.45, 3.05, -3.7] } },
  { id: "television", geometry: "television", position: [3.5, 3.0, -3.83], title: { cn: "数字内容", en: "Digital Content" }, kicker: { cn: "墙挂电视", en: "Screen" }, description: { cn: "视频、AI、数字内容与新的表达实验。", en: "Video, AI, digital content and new experiments in expression." }, destination: "/projects/videos", destinationLabel: { cn: "查看视频项目", en: "View videos" }, camera: { position: [4.1, 3.25, 2.1], target: [3.5, 2.9, -3.7] } },
  { id: "bookshelf", geometry: "bookshelf", position: [5.5, 2.25, -3.45], title: { cn: "兴趣与收藏", en: "Interests & Collection" }, kicker: { cn: "书架", en: "Bookshelf" }, description: { cn: "书、相机、音乐与那些持续影响我的小东西。", en: "Books, cameras, music and small things that keep influencing me." }, destination: "/leo-pocket", destinationLabel: { cn: "打开 Leo Pocket", en: "Open Leo Pocket" }, camera: { position: [6.4, 3.1, 1.3], target: [5.45, 2.25, -3.1] } },
  { id: "board", geometry: "board", position: [5.98, 2.95, -0.2], rotation: [0, -Math.PI / 2, 0], title: { cn: "思考与方法", en: "Thinking & Method" }, kicker: { cn: "灵感板", en: "Idea board" }, description: { cn: "正在被整理的想法、方法、笔记与工作流。", en: "Ideas, methods, notes and workflows in the process of being organized." }, destination: "/method", destinationLabel: { cn: "进入我的工作方式", en: "View method" }, camera: { position: [4.5, 3.15, 2.25], target: [5.75, 2.7, -0.2] } },
  { id: "dog-bed", geometry: "dog-bed", position: [-4.55, 0.52, 1.9], title: { cn: "童年记忆", en: "Childhood Memory" }, kicker: { cn: "狗窝", en: "Dog bed" }, description: { cn: "一扇暂时留给童年、旧地方与尚未写完的故事的门。", en: "A door reserved for childhood, old places and stories not yet written." }, camera: { position: [-3.4, 2.0, 4.1], target: [-4.55, .55, 1.9] } },
  { id: "window", geometry: "window", position: [5.95, 3.2, 1.9], rotation: [0, -Math.PI / 2, 0], title: { cn: "另一面", en: "The Other Side" }, kicker: { cn: "窗户", en: "Window" }, description: { cn: "向外看，也向自己的另一面看。", en: "Looking outward — and toward another side of myself." }, camera: { position: [4.45, 3.3, 3.7], target: [5.8, 3.2, 1.85] } },
  { id: "skateboard", geometry: "skateboard", position: [-5.15, 0.5, .25], rotation: [0, .4, .25], title: { cn: "兴趣与日常", en: "Off-hours" }, kicker: { cn: "滑板", en: "Skateboard" }, description: { cn: "工作之外的节奏，也同样构成这个房间。", en: "The rhythms beyond work also make up this room." }, destination: "/leo-pocket", destinationLabel: { cn: "看看 Leo Pocket", en: "See Leo Pocket" }, camera: { position: [-3.7, 1.6, 3.1], target: [-5.0, .45, .25] } },
  { id: "camera-cabinet", geometry: "camera-cabinet", position: [5.5, 1.15, 2.95], rotation: [0, -Math.PI / 2, 0], title: { cn: "相机与影像", en: "Camera & Image" }, kicker: { cn: "展示柜", en: "Camera cabinet" }, description: { cn: "摄影仍然是我理解光线、人物和现场的起点。", en: "Photography remains where I learned to see light, people and place." }, destination: "/projects#photography", destinationLabel: { cn: "进入摄影作品", en: "Explore photography" }, camera: { position: [4.3, 2.1, 4.3], target: [5.3, 1.15, 2.9] } },
];

export const roomObjects = [
  { id: "floor", kind: "floor" },
  { id: "back-wall", kind: "back-wall" },
  { id: "left-wall", kind: "left-wall" },
  { id: "right-wall", kind: "right-wall" },
  { id: "rug", kind: "rug" },
  { id: "desk", kind: "desk" },
  { id: "chair", kind: "chair" },
  { id: "lamp", kind: "lamp" },
] as const;
