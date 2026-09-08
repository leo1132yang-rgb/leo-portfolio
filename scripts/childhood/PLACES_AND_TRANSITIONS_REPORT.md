# Childhood 场景与过渡调整

2026-09-08。本次沿用现有角色、暖色像素风格、回头看动作、故事与 Room 入口。

## 空间调整

- 主线改为白马李家小路 → 郊外 → 老街 → 商城街 → 学校路。郊外有田野、石桥、候车亭和远处县城，取消原先横向拼图的硬接缝；走到道路边缘会短暂淡出，再进入下一段完整画面。
- 删除重复房屋模板。老街使用游戏厅、修车院子和恒源祥；商城街使用批发店、晾衣巷道和两层鸭鸭店，各段建筑不同。
- 主路的伙伴空地、后山果园、水库、林间空地入口相隔至少 550 个世界单位，沿路留出安静行走空间。
- 弹珠与圆卡移入伙伴空地；栗子、橘子与红薯移入果园；知了与篝火移入树林；香蕉和辣条移入加油站旁。水库保留独立游泳与钓虾位置。
- 游戏厅、恒源祥、赣东商城都有可进入的完整店内画面和父亲。赣东商城白天记忆与睡在父亲肚皮上的记忆分开布置；鸭鸭的一楼、楼上、厨房、睡觉/仓库连接保留。
- 24 段原记忆、18 页故事、事件前置条件与已解锁进度保持；旧布局存档转换到新路线，不要求清档。

## 画面素材

以下均通过内置 ImageGen 生成，最终 PNG 原图和 WebP 运行素材保存于 `public/childhood-game/`。无外部 API / CLI 调用。

### nature-places.png / .webp

Square pixel-art atlas. Three panoramic 3:1 strips stacked vertically, no borders, no text, no people. Refined naturalistic 32-bit pixel art for a nostalgic side-view 1990s Jiangxi childhood game. Warm afternoon light. Walkable ground at 84% of each strip. TOP: village children's play clearing with flat earth, marbles, stone wall and shade tree. MIDDLE: large orchard, chestnuts left, orange trees center, sweet potato vegetable plot right. BOTTOM: woodland clearing, tall cicada tree left, empty path middle, campfire circle and sitting logs right. Each strip complete, spacious, richly detailed and distinct. Crisp pixel clusters, no collage or blur.

### outskirts.png / .webp

Wide 3:1 pixel art landscape for a side-scrolling game: one continuous 1990s rural Jiangxi road gradually entering a small Chinese town. Rice fields and trees on left, old stone bridge and bus shelter in middle, distant low town buildings and telephone poles on right. Warm nostalgic sunset, detailed naturalistic 32-bit pixel art, flat walking road near bottom. No people, no text, no seams.

### town-block.png / .webp

Wide 3:1 detailed naturalistic 32-bit pixel art side-scrolling game background, nostalgic small Chinese county town in the 1990s, warm dusk. One continuous quiet street. LEFT a humble open arcade with visible arcade machines and blank red signboard. CENTER a spacious bicycle-repair courtyard with parked bicycles, a mature tree and low stone wall, lots of empty road. RIGHT a warm textile shop with clothing shelves and blank red signboard. Different buildings, no repeated façades. Consistent warm sky, clear horizontal pavement at 84% image height, stone foundation below. No people, no text, no UI, no collage seams.

### market-block.png / .webp

Wide 3:1 detailed naturalistic 32-bit pixel-art background for a side-scrolling game in a 1990s Chinese county town. One continuous warm nostalgic dusk market street. LEFT a large open wholesale-clothing warehouse with clothing racks, sacks and stacked cardboard cartons; plain red signboard. CENTER a spacious quiet brick alley, hanging laundry, wooden handcart, low wall and a glimpse of houses behind. RIGHT a distinct two-storey down-jacket shop, lit upstairs windows, puffy coats visible on ground floor and plain red signboard. No duplicated buildings. Clear uninterrupted pavement at 84% image height, stone foundation underneath. No people, no words, no UI, no collage seams, no blurry overlays.

### arcade-room.png / .webp

Wide 3:1 refined naturalistic 32-bit pixel art, interior of a modest 1990s Chinese county-town arcade. Old CRT arcade cabinets along left and right walls, warm dim tungsten bulbs, worn plaster, simple wooden stools, a clear spacious floor in the middle for a father and child. Side-view game background, walkable floor at 84% image height. No people, no text, no neon, no UI. Rich detailed nostalgic earthy pixel texture.

### heng-room.png / .webp

Wide 3:1 refined naturalistic 32-bit pixel-art game background: inside a modest 1990s Chinese thermal-underwear clothing shop. Wooden shelves of folded cream and pastel undershirts, neatly packaged clothes, simple metal clothes rails, wooden sales counter toward right, warm ceiling bulb, aged beige plaster, a large clear walking floor in front. Side-on view, floor line at 84% image height. Cozy nostalgic earthy colors and fine crisp pixel texture. No people, no lettering, no UI. A complete coherent interior, not a collage.

### gandong-room.png / .webp

Wide 3:1 refined naturalistic 32-bit pixel-art game background: inside a modest 1990s Chinese wholesale clothing shop. Rolled metal shutter at far left, deep wooden shelves stacked with clothes and cardboard cartons toward left and center, large clear quiet floor space on right for a father and child's evening memory. Old concrete floor, warm hanging tungsten bulbs, muted earthy nostalgic colors, richly detailed crisp pixel texture. Side-on game view, walking floor at 84% image height. No people, no bed, no lettering, no UI, no collage.

## 检查

- 引擎检查：24 段记忆、24 个出入口、18 页故事解锁，碰撞、存档及新旧布局转换。
- 生活细节检查：普通互动、对白、稀有回头动作、移动立即中断、路线双向切换及水库镜头。
- 画面检查：12 个场景和游泳不同阶段的实际渲染截图。
- 生产构建通过。
- 实际浏览器通过：主线跨场景、进入独立地点、游戏厅原记忆解锁、手机果园、学校路与返回 Room。
- 回归通过：中文逐字对白、先补全后继续、故事阅读、父亲肚皮记忆、结尾回头及移动中断、手机两句早餐对白，无浏览器异常。
- 触屏通过：移动与同时跳跃、松手停步、横竖屏退出、键盘监听移除、背景焦点恢复。修正横竖屏切换时镜头滞后，立即保持 Leo 在画面内。
