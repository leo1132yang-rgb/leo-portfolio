# Room 精修与检查记录

2026-09-09。仅提交 Room 及其音频、交互依赖，包含此前尚未提交的 Living Shelf / 本地黑胶功能。

1. 原 hover：Desk 的 Html 标签与缩放反馈，生活角浮动文字，Lounge 的坐下文字。
2. 新反馈：桌面交互物件、椅子、Lounge、右书架及生活柜灯具、唱片、抽屉、书籍、植物使用暖色材质反馈；照片墙、Childhood、My World 保留已有视觉反馈。
3. 实现：RoomHover 对标准材质原色做轻微暖色混合与阻尼过渡，无新增灯光、后处理或轮廓渲染；局部灯发光材质保留独立控制。
4. 保留文字：导航、内容、播放控制、移动端必要提示、打开书籍后的阅读提示；原 E / ESC handler 保留。
5. 全屋台灯：增加可见的黄铜拉链与末端拉珠，保留原开关区域和全屋灯光状态。
6. 控制件：拉链与梨形拉珠，无第二套开关逻辑。
7. 动作：随现有照明状态变化短暂下拉与衰减摆动；灯光继续原过渡。
8. 两盆植物：左侧挺拔雕塑感叶簇，右侧柔和伸展叶簇，采用弯曲、折叠叶片。
9. 花盆：哑光米白与暖灰褐，圆润盆口、土壤与底座。
10. 摆放：保留原桌面位置与比例，不移动电脑、水瓶或手办。
11. 原黑胶不明显：深色圆盘与同心结构缺少易追踪的非对称参照。
12. 改善：金属盘沿、对比标签、偏心弧形标记与条纹；沿用播放驱动旋转和暂停惯性。
13. 唱机：紧凑木黑底座、金属转盘与轴心，保留唱臂，不扩大生活柜占地。
14. 性能：实例化叶片、合并枝条；没有第二 Canvas、renderer 或大贴图。浏览器进入、点击与转动正常，无控制台错误；未做量化 FPS 基准，不能据此保证所有设备帧率。
15. 修改文件：见下方实际暂存清单。
16. 验证：pnpm build 通过；verify-room-life.cjs 与 verify-vinyl-audio.cjs 通过。浏览器确认全屋灯关闭时局部球灯仍亮、黑胶播放与角度持续变化、仅一个 audio。检查 390×844 小屏布局，并恢复默认尺寸。
17. 提交范围：Room 组件、OtherSide、Room 相机数据、统一音频实现、本地七首歌曲及对应检查脚本。七首音频源文件未改写。
18. 排除：Homepage、components/homepage、data/homepageMedia.ts、public/images/homepage、首页脚本与版本资料；Profile 改动、tsconfig.json、next.config.mjs 及无关截图均未暂存。
19. Commit hash：由完成后的 Git 提交记录及交付消息提供，避免在提交自身中循环写入 hash。
20. Push 结果：由实际远程校验后在交付消息中提供。

此前 LIVING_SHELF_REVIEW.md 是历史轮次记录，其中“未提交或推送”描述的是当时状态。

## 本次暂存文件

- components/OtherSide.tsx
- components/audio/GlobalAudioProvider.tsx
- components/leo-room/CentralWorkspace.tsx
- components/leo-room/DeskInteractiveItem.tsx
- components/leo-room/LIVING_SHELF_REVIEW.md
- components/leo-room/LampPullChain.tsx
- components/leo-room/LivingShelf.tsx
- components/leo-room/RoomHover.tsx
- components/leo-room/RoomLifeFurniture.tsx
- components/leo-room/RoomLightingScope.tsx
- components/leo-room/RoomNavigation.module.css
- components/leo-room/SculptedDeskPlant.tsx
- components/leo-room/StudioInterior.tsx
- components/leo-room/TelevisionScreen.tsx
- components/leo-room/VinylListeningCorner.module.css
- components/leo-room/VinylListeningCorner.tsx
- components/leo-room/WallDisplays.tsx
- components/leo-room/useRoomInteractionController.ts
- data/leoRoomCamera.ts
- data/vinylTracks.ts
- lib/audio/AudioTransport.ts
- public/audio/vinyl/Ella Bright - Baby Now That I Found You.mp3
- public/audio/vinyl/二珂 - 孤独她呀.mp3
- public/audio/vinyl/后海大鲨鱼 - Bling Bling Bling.mp3
- public/audio/vinyl/李宗盛 - 山丘.mp3
- public/audio/vinyl/欧阳娜娜 - 青春呐 (Live).mp3
- public/audio/vinyl/痛仰乐队 - 为你唱首歌.mp3
- public/audio/vinyl/陈婧霏 - 深蓝.mp3
- scripts/room/verify-room-life.cjs
- scripts/room/verify-vinyl-audio.cjs
- components/leo-room/ROOM_POLISH_REVIEW.md
