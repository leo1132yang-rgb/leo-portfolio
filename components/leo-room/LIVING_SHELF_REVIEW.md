# Living Shelf / 生活互动角

本轮只增加后墙低柜局部互动，未提交或推送。

1. 模型结构：原 Credenza 位于 [-3.05, 0, -3.43]，柜体约 4.05 × 0.79 × 0.63。保持柜体、分隔板、脚和左右实例化书籍；原独立球灯、唱片、植物接入互动，原实心抽屉替换为空心盒体。
2. 互动对象：球灯、唱片/唱机、抽屉/把手、柜面一本《论摄影》、小植物。没有整个柜子的 INTERACT 按钮，也没有新增页面或模态窗口。
3. 球灯：保留原球灯尺寸与位置；2700–3200K 观感的暖米白 emissive + 原有局部 pointLight，0.45 秒 smoothstep 过渡。通过独立灯具标记排除全屋灯光注册，未建立另一套全屋灯光系统。全屋关灯时仍可单独打开。
4. 黑胶：既有圆盘与标签一起绕 Y 轴旋转，目标约 33⅓ RPM，Three useFrame 内 damping 启停，不按帧更新 React state。增加少量细沟槽与偏心标签标记，便于感知旋转和高光。
5. SOUND：在已有 GlobalAudioProvider 增加 room track 的播放/暂停入口，复用现有 HTMLAudioElement 和 SOUND 总开关，不创建 AudioContext 或第二个播放器。暂停保留当前音频位置；Childhood 使用原有换轨规则，回房间按唱片状态恢复。切换曲目本身沿用原架构，因此跨 Childhood 不承诺保持音频的精确秒数。
6. 音频素材：已有 /audio/room.mp3，直接复用，未下载音乐。显示 Room ambience，不虚构曲名或艺术家。若希望换成特定黑胶曲目，仍需提供该素材。
7. 抽屉：盒体深 0.42，沿 +Z 拉出 0.21（50%），0.7 秒 smoothstep，可反向连续过渡；柜体不移动。前板、底板、侧板、背板、把手和内容一起移动。
8. 抽屉内容：一卷胶卷、一支笔、两张现有真实照片；照片复用 photoWallImages 的 thumbnailSrc，无构造图片路径，无剧情事件。
9. 正在读：只挑选现有书单中的《论摄影》／苏珊·桑塔格。书脊排字复用书单信息，抽出 4.5cm。再次点击、空白点击或 ESC 收回；显示小标签，不创建 Reader。
10. 植物：叶片实例组极轻 idle sway，点击后 2 秒内衰减回位，不显示文字或奖励。其它植物外观和行为保持不变。
11. 控制：所有状态归现有 useRoomInteractionController，复用它的 E / ESC 和空白点击入口。一次最多一个提示，由 hover、距离和视野筛选；这些互动不锁相机。黑胶与球灯状态不会因 focus 变化重置。
12. Mobile：390 × 844 浏览器尺寸下实际点按五类物件通过；提示按钮至少 44px 高，无 E 提示，不依赖 hover。未使用实体手机测试。
13. 本轮文件：LivingShelf.tsx（新增模型与互动）；StudioInterior.tsx（接入低柜、植物局部摆动）；useRoomInteractionController.ts（轻量状态和现有键盘入口）；RoomLightingScope.tsx（独立灯具排除标记）；RoomNavigation.module.css（小提示样式）；GlobalAudioProvider.tsx（原 room 通道播放控制）；OtherSide.tsx（连接 SOUND 与状态）；scripts/room/verify-room-life.cjs（回归）；本报告。保留上一轮尚未提交的修复及其它任务工作。
14. 验证：pnpm build 通过。控制器在 1280px、390px 下通过相机/内容返回/坐下/全屋灯/抽屉 ESC/书空白关闭/黑胶状态连续性检查。浏览器实际测试球灯与全屋灯独立、唱片启停与停止后角度稳定、抽屉开关、书抽出/返回、植物点击，以及手机尺寸逐项点击。浏览器实际视觉检查不等于实体设备音频听感验收。
