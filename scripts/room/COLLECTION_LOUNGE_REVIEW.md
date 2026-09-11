# Room 收藏柜 / 沙发听音乐 / 返回主视觉

## 本轮范围

在此前未提交的 Room 空间和工作台精修上继续修改。保留此前成果；本轮没有修改 Homepage、Projects、Profile、Childhood、Earth 或 Racing 的内容本体，也没有修改导航或房间壳体。先本地预览，不提交、不 push。

## 实现

- 桌右侧收藏柜：位置 [3.55,0,0.3]，宽 1.06、深 0.48、高 1.66；三层开放展示、玻璃侧板、深色细框、暖木搁板和微弱展示灯带。保留桌边至沙发区域的通道。
- 六个史迪仔主题：抱心、招手、旅行、耳机、厨师、花朵。采用统一基础造型及不同手势/配件；参考图片的分层陈列方式，避免塞满。配置独立在 data/leoRoomCollection.ts，后续参考模型可替换单个条目。
- 已移除桌面原单个史迪仔。柜体通过 Room 原 focusHotspot('collection') 接入现有相机，支持有限观察、ESC 和返回探索，增加柜体相机边界。
- 沙发沿用现有 1.8 秒坐下（手机乘 1.3）与 1.1 秒起身过渡。播放器仅在 SITTING 状态出现；过渡中退出不会出现播放器或触发自动播放。
- 坐姿保留固定眼点和有限环顾；播放器区域之外可拖动。键盘操作进度条/按钮时不会同时转动镜头。
- 音乐模式是现有 GlobalAudioProvider / AudioTransport 的另一套界面，没有新建 audio 元素或音频实例。坐稳时继续当前歌曲，未播放则请求播放；尊重全局静音。显式播放按钮可开启声音并重试浏览器阻止的播放。
- 左侧原有七首歌（桌面约六项可见并可滚动），中间 CSS 黑胶唱机，右侧播放控制；手机上唱机在上、列表与控制并排。无第二 Canvas。
- 转盘旋转绑定 vinylIsPlaying，暂停时停住当前位置；唱针回位、微弱状态灯、真实进度条。起身后音乐继续，曲目/进度与原黑胶界面保持一致。
- 中文按钮为“回到主视觉”，英文为“Back to Main View”。顺带补齐坐下、起身以及相关探索按钮的中英文。

## 自动验证

- verify-navigation.cjs：1280 / 390 / 320，七个 focus 区、近景释放、取消、重置、物体边界通过。
- verify-room-life.cjs：1280 / 320 / 360 / 390 / 430，坐姿固定眼点、拖动环顾、ESC 起身、打断坐下、恢复交互通过。
- verify-desk-props.cjs：1280 / 390，桌面单个摆件移除、六个手办落在搁板内、柜体点击与拖动防误触、原 13 个桌面交互映射通过。
- verify-vinyl-audio.cjs：七首文件路径、播放暂停、切歌、进度、结束回调、出错恢复、单一音频实例通过。
- 工作台几何 51,781 三角面；收藏柜及六个手办共 35,556 三角面（58 meshes）。没有新增下载资源、纹理或依赖。
- pnpm build：通过，33 个静态页面。原 Racing 构建资源/eval 警告保留。

## 浏览器实测

- Desktop 收藏柜近景可见六个手办；拖动后 ESC 返回 FREE_EXPLORE。320px 下六个手办及分层搁板完整可见。
- 实际点击沙发坐垫：先得到 APPROACHING_SEAT 且无播放器，之后 SITTING 才显示播放器。拖动窗外空白处可改变坐姿观察方向（记录 yaw 0 → -0.192、pitch 0 → 0.030）。
- 沙发选择“深蓝”，暂停后 audio.paused=true、唱片 data-record-playing=false；暂停时下一首保持暂停；上一首和播放继续正常。
- 起身按钮先进入 STANDING_UP，播放器立即收起；过渡后 FREE_EXPLORE，当前歌曲继续播放。原黑胶播放器打开后显示同一首“深蓝”和已累计的进度。
- 在原黑胶界面选择“山丘”，再进入手机沙发，仍为 vinyl-5。全流程 DOM 只有一个 audio 元素。
- 390px 和 320px 坐姿播放器、暂停和 ESC 起身实测通过，页面无横向溢出。320px 长曲目布局追加 min-width:0 和单行省略，避免挤压右侧控制。
- 小屏修正后再次完成 pnpm build（通过），生产版 320px 复查长歌名已截断、列表与控制区分离。测试音乐已暂停，恢复桌面预览。
- CN 显示“回到主视觉”，EN 显示“Back to Main View”，实际点击重置与切回中文正常。

## 本轮修改文件

- components/OtherSide.tsx
- components/audio/GlobalAudioProvider.tsx（仅增加幂等 playVinyl 动作，仍是原引擎）
- components/leo-room/CentralWorkspace.tsx
- components/leo-room/DeskPersonalProps.tsx
- components/leo-room/StudioInterior.tsx
- components/leo-room/StitchCollectionCabinet.tsx（新增）
- components/leo-room/LoungeMusicPlayer.tsx（新增）
- components/leo-room/LoungeMusicPlayer.module.css（新增）
- components/leo-room/RoomCameraControls.tsx
- components/leo-room/roomSpatialBounds.ts
- data/leoRoomCollection.ts（新增）
- data/leoRoomCamera.ts
- scripts/room/verify-desk-props.cjs
- scripts/room/verify-navigation.cjs
- scripts/room/verify-room-life.cjs（增加进度条键盘操作不转镜头的回归）
- scripts/room/COLLECTION_LOUNGE_REVIEW.md（本记录）
