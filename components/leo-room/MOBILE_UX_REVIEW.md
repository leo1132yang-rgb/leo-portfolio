# Leo’s Room Mobile UX 检查记录

本轮仅移动端输入、UI、相机配置与渲染质量。没有修改 Homepage、Projects、Profile、Childhood/My World 核心内容，没有提交或推送。

## 主要问题与修正

1. 原手机播放器高 270px，并把画布缩短 360px；现在 62px 迷你条，歌单默认关闭、最高 45dvh，开关不再改变 Canvas 尺寸。
2. 椅子按下立即抢占相机拖动；手机改成单击后 44px 左右按钮，每次移动 0.55 个单位，沿用现有轨道限位、动画和状态。
3. 物件各自判断点击，滑动和双指操作可能漏判；画布父级统一记录位移与指针数量，移动超过 9px、双指和取消手势不生成物件点击，350ms 内重复点击被抑制。Desktop 分支不经过此门控。
4. 手机总览裁边、横纵相机过敏；手机旋转速度 .55/.42 → .32/.26，拖动阻尼 .12 → .18，平滑时间 .76 → .42；polar .92–1.43、azimuth -.85–.38，总览后移。坐下/起身时长乘 1.3，坐姿触摸观察范围为原来的 65%。
5. 固定控件争抢空间且 SOUND 隐藏面板撑宽网格；手机采用安全区边距、独立底部层级、坐姿精简控件、固定宽度 SOUND 单按钮，手机隐藏其 hover 音量面板。

## 输入与 UI

- Mini player 上一首/播放暂停/下一首/歌单均为 44×44px；进度条在歌单中提供 44px 高操作区。
- 歌单独立滚动，打开时锁 Room 相机与物件，关闭释放；迷你条本身不锁探索。
- Canvas touch-action:none，普通内容/歌单滚动保留；没有全局禁止 scroll。
- 小屏提供可收起的“探索”菜单，44px 高按钮直接复用原 handler，为小型物件提供可靠触控替代，不放大模型。
- 靠近生活柜时仅保留底部单个动作，手机隐藏 3D 浮动生活柜文字。Desktop 的阅读提示保留。
- 椅子按钮与迷你播放器可同时使用，分置上下，不重叠；坐姿隐藏导航、播放器与探索状态，只保留起身和 SOUND。
- safe-area-inset 四边均用于相应固定控件；不修改共享 Global Nav / SoundToggle 组件。
- 未新增 Walk Mode 或第二套内容状态；现有照片路径、音频源、返回 handler 不变。

## 移动端质量

- DPR 上限 1.25（Desktop 仍 1.5）。主光阴影 512（Desktop 1024），接触阴影 256（Desktop 512）。
- 移动端不绘制两层额外动态星云/薄雾，保留星空底图、星点、窗景及房间灯光。
- 不新增纹理、GLB、后处理或 RAF；帧率采样复用 R3F useFrame，仅每约两秒更新 DOM 数据，不做每帧 React state 更新。
- 银河原图为 1672×941，约 2.4MB；本轮没有增加 4K 贴图。

## 验证与限制

- 自动交互回归覆盖 1280、320、360、390、430px：灯光、防重入、椅子限位与锁定、坐姿/起身、四类内容各三次返回、打断动画与监听清理。
- 音频回归覆盖七首路径、播放/暂停切歌、SOUND 进度保留、seek、ended、错误恢复与单音频实例。
- 实际浏览器小屏操作：进入、迷你条/歌单/下一首、相机拖动、抽屉开关、灯、椅子、坐姿/起身、Childhood/My World/真实照片 Lightbox/Desk 详情的打开与返回，横竖屏切换。
- 连续约 12 秒拖动：未误开内容或移动椅子，音乐持续；该段采样约 33 FPS，常规观察约 48–60 FPS。无改前同条件基准，不能声称 FPS 已明显提升。
- 使用的是桌面浏览器小屏尺寸与指针操作，不等同真实 iPhone/Android 的多点触摸、热降频或移动 GPU；真机双指与安全区手感仍需用户体验。

## 本轮文件

- components/OtherSide.tsx
- components/LeoRoomScene.tsx
- components/leo-room/RoomTouchSurface.tsx（新增）
- components/leo-room/useRoomMobile.ts（新增）
- components/leo-room/RoomCameraControls.tsx
- components/leo-room/RoomLifeFurniture.tsx
- components/leo-room/RoomHover.tsx
- components/leo-room/RoomNavigation.module.css
- components/leo-room/VinylListeningCorner.tsx
- components/leo-room/VinylListeningCorner.module.css
- components/leo-room/CosmicBackdrop.tsx
- data/leoRoomCamera.ts
- scripts/room/verify-room-life.cjs
- components/leo-room/MOBILE_UX_REVIEW.md（本记录）

## 最终确认

- 最终 pnpm build 成功，编译、类型检查与 32 页静态生成通过。
- 最终实际测量：320/360/390/430px 的迷你条均高 62px；SOUND 均为 130×44px，右侧留 10px，没有越界；页面无横向溢出。
- 实际 SOUND 点击后 aria-pressed=false，唯一 audio 元素 paused=true；恢复开关并暂停测试播放。
- 1280×720 Desktop 进入与双面板黑胶布局实际检查，原视觉保留。最终预览无浏览器 error 日志。
- Git HEAD 仍为 6578af2；本轮未暂存、未提交、未推送。
- 体验地址：http://localhost:3016/other-side 。预览尺寸已恢复默认。
