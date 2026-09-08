# 厨房、指示牌与返回路线修正

2026-09-08

- 爷爷厨房改用完整夏日农家厨房画面，取消借用鸭鸭厨房后再覆盖窗景、放大菜碗的拼贴。土豆烧肉与蒸蛋直接摆在背景桌上；做饭和分享记忆保留，去掉菜品上的悬浮文字。
- 指示牌改成低饱和旧木牌，加入不规则边缘、木纹、钉子、杆体明暗、地面投影和方向箭头。缩短地点名，水库下水处使用同一套样式；门口原有的平面色块坐凳改为石块素材。
- 12 个进入区域的左右两端都能步行返回各自入口：爷爷厨房、鸭鸭一楼、二楼厨房、卧室/仓库、水库、伙伴空地、果园、树林、加油站、游戏厅、恒源祥、赣东商城。原有 E 互动入口和上下楼通道保留。
- 移除父子整理衣物、日常人物手边及摸衣服互动的占位矩形，保留角色动作与现有场景物品。
- 24 段记忆、18 页故事、原进度与前置条件保留。

## 新厨房素材

使用内置 ImageGen；项目文件为 `public/childhood-game/grandpa-kitchen.png` 和 `public/childhood-game/grandpa-kitchen.webp`。

最终提示词：

A 6:5 landscape naturalistic 32-bit pixel art background for a side-view 1990s rural Jiangxi childhood game. A complete humble grandfather's farmhouse kitchen, warm summer daylight. Old wood-fired stove and black iron pot at left, worn plaster and simple shelves, small wooden window onto a green vegetable garden at center, a modest wooden table against the back wall at right with two normal small dishes: braised pork with potatoes and steamed eggs. Clear spacious earthen walking floor across the foreground, ground line at 84% height. Consistent furniture scale and perspective. Nostalgic muted earthy colors, richly detailed crisp pixel texture. No people, no writing, no UI, no giant food, no collage, no floating objects, no snow.

## 验证

- 引擎：全部 24 段记忆、24 个交互入口、18 页解锁，以及 12 个区域的左右边界回程和进度保留。
- 生活细节回归：对白、回头动作、移动中断、镜头、水库游泳和旧存档迁移。
- 渲染：正常厨房、做饭/分享、旧木牌、父子整理衣物及水库画面检查。
- 生产构建通过；实际浏览器通过厨房做饭、四类右侧出口的入口位置与进度保存、人物互动、木牌、手机步行返回，无浏览器错误。
- 触屏移动与同时跳跃、松手停止、横竖屏返回、资源延迟加载、退出监听清理通过。
