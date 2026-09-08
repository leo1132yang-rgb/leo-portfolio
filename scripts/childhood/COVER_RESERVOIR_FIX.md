# Childhood：入口封面、重影与水库修复

- 房间童年入口的旧书页封面，换为实际游戏首页截图。`WallDisplays.tsx` 与 `preloadRoomAssets.tsx` 同步引用 `/room/childhood-wall/childhood-game-home.webp`。原封面保留在原路径，没有覆盖。
- 取消自然场景中不同背景的半透明叠加与矩形裁切拼贴。背景现在沿连续像素边缘连接，保持原有像素比例；田野与后山的新增探索距离保持不变。
- 新增独立水库场景：ACT 02 路边“水库 →”路牌附近按 E 进入，可沿岸走动；靠近“下水处”按 E 游泳。有伙伴、水面反光、划水、涟漪、入水溅水和回岸动作。
- 水库增加往返通路，相机在游泳时跟随 Leo，兼顾手机视野。游泳时存档保留岸上位置，重新进入不会困在水里。
- 原 `reservoir` Memory ID 和第 6 页解锁保留；仍为 24 段记忆、18 页故事，新增后共有 10 个出入口。旧存档中的已完成记忆不变。

## 资源与生成记录

游戏封面：`public/room/childhood-wall/childhood-game-home.webp`，直接来自运行中的游戏首页，不是概念图。源截图：同目录 `childhood-game-home-source.png`。

水库背景：`public/childhood-game/reservoir.png`、`reservoir.webp`。使用内置 imagegen 工具生成，已复制到项目中。最终提示词如下：

> Create a new background for a refined 32-bit pixel-art side-scrolling childhood game set in 1990s rural Jiangxi China. Wide landscape 2:1 composition. A quiet countryside RESERVOIR in warm late-summer afternoon: blue-green broad still water fills the middle and lower middle from 45% to 78% of the picture, clearly a large swimming reservoir, layered distant forested jade mountains, warm clouds, reeds and a low stone embankment. A small worn timber swimming jetty at the LEFT edge extends into water. An uninterrupted dry walking path spans the full width at 84% image height, rugged stone foundation beneath. Side view, level horizon, cinematic warm nostalgic sunlight, intricate naturalistic pixel clusters and fine texture, crisp opaque edges, restrained warm ochre/olive/blue palette. NO people, NO characters, NO text, NO signs, NO UI, NO ghosting, NO transparent overlaps, NO collage seams, NO double-exposure. This is a background asset, characters and water ripple animation will be rendered separately.

角色、标牌和动态水面由实际游戏渲染，没有写进背景图片。

## 本地验证

- `pnpm build` 通过。
- `verify-engine.cjs`：全部 24 段记忆、10 个门、18 页解锁、存档及移动检查通过。
- `verify-art.cjs`：自然区域以及入水/游泳/回岸关键帧检查。
- `verify-cover-reservoir.cjs`：实际入口封面、进入水库、桌面/手机游泳、记忆保留和返回小路。
- 未执行 git push。
