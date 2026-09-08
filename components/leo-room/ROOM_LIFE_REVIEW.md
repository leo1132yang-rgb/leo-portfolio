# Leo’s Room 生活化交互验收

本轮仅本地完成，未 commit、未 push。保留上一轮桌面物件 2 倍尺寸及电视文案“真的做不过来了，持续更新中”。房间建筑、家具造型和内容素材没有重做。

## 按需求逐项汇报

1. **原台灯**：已有 `desk-lamp` 模型、暖色发光材质和实用灯，点击走通用 Desk 详情选择。现在保留原模型与点击手势判断，把该物件接到统一灯光切换；其他 Desk 物件继续使用原选择 handler。
2. **灯光状态**：在原 `useRoomInteractionController` 中增加 `lightingMode`、`lightingBusy`，初始 `ROOM_LIGHT_ON`。同步 ref 防止连续事件读到旧状态，过渡期间忽略重复切换。
3. **统一控制范围**：`RoomLightingScope` 注册现有室内 ambient、hemisphere、directional、point、spot、rect-area lights，以及台灯灯泡、灯带、书架/装饰灯等 emissive 材质。统一保存初始强度；开灯恢复原值。没有第二套灯光或 renderer。
4. **夜间保留**：原窗外宇宙完全保留；窗边 area light 保持 1.6，冷色 hemisphere 0.4、ambient 0.16、directional 0.2。显示器发光保留 70%，其 area light 保留 0.2；电视内容降低亮度，照片降低自亮。暖色实用灯和灯带发光关闭，仍能辨认地毯、椅子和窗边植物。
5. **过渡**：0.8 秒 smoothstep，在现有 R3F 帧循环内修改灯强、颜色、emissive，完成后保持目标值。没有每帧 React setState。沿用现有 SOUND，未增加音频系统或素材。
6. **办公椅轨道**：沿工作台局部 X 轴移动，固定 Y/Z；以桌宽两端各留 0.9m 得到范围。拖动只改变椅子的外层 transform，没有物理引擎。
7. **左右范围**：`[-1.505, +1.505]m`，初始约 `+0.818m`；达到边界后夹紧。椅子位于桌前的原 Z 位置，沿轨道不进入桌腿、Lounge Chair 或墙体区域。
8. **物理反馈**：位置 damping 14，轻微 yaw 最多 ±0.045rad（约 2.58°），旋转 damping 9，停止后回到原朝向。桌面 pointer capture 拖动期间同步锁住相机，松手恢复。
9. **坐姿位置**：从现有 Lounge Chair 的组位置、局部偏移、朝向和坐垫顶面计算；坐垫中心 0.48m、厚 0.27m、组高 0.03m，再加眼高 0.83m。实际眼位约 `[4.6717, 1.4750, 0.0854]`，不是椅子上方俯视。
10. **坐姿目标**：朝向原右窗 `[6.61, 1.58, 1.45]`。1.8 秒分段缓动先靠近、再降低视线并转向窗外。使用原星空贴图，仅扩大原窗外平面的覆盖尺寸，避免斜视角看到平面边缘；没有新宇宙场景，未修改 My World。
11. **转头范围**：固定眼位，yaw ±22°、pitch ±10°；鼠标/触摸滑动以及方向键均可有限转头，采用阻尼。画面保留窗框，桌面宽度下还能看到右侧植物。
12. **起身与解锁**：ESC 或小型“起身”按钮进入 `STANDING_UP`，1.1 秒到 `[3.8, 1.75, 1.5]`，随后原相机驱动 unlock、清空热点并回到 `FREE_EXPLORE`。没有路由跳转；坐下途中也能取消起身。
13. **会话连续性**：灯光状态、椅子 X 在 Room 控制器中保存。进入 Childhood / My World 等内容再返回保持原值，RESET VIEW 只复位相机；重新载入页面才初始化生活状态。
14. **统一相机状态**：扩展既有 `FREE_EXPLORE / FOCUSING / FOCUSED / CONTENT_OPEN / RESTORING`，增加 `APPROACHING_SEAT / SITTING / STANDING_UP`。沿用唯一 CameraControls 与异步命令令牌；坐姿期间停止其他 3D 热点拾取，起身恢复；改变屏幕宽度不会取消坐姿动画或丢失控制器。
15. **手机操作**：点击台灯切换；点办公椅显示小型左右按钮，每次移动约 0.7525m；点击 Lounge Chair 坐下，点击明确的“起身”按钮返回。390×844 浏览器尺寸实测通过。未连接实体手机，多指触摸硬件仍需真机体验。
16. **原模块**：Childhood、My World 的实际打开/返回正常，灯光和椅子位置保持。实际打开 Desk 中央控制台，原 `/leo-os` 链接保留，ESC 返回后 controls=true；实际打开照片墙“阿勒泰”照片、切换下一张并 ESC 返回正常。Desk 和照片继续走原状态及 handler。四种内容分别循环开关 3 次的相机回归通过；照片路径仍来自原 `photo.src / thumbnailSrc / previewSrc`。SOUND、FREE EXPLORE 和 RESET VIEW 保留。
17. **文件**：见下面清单。其他任务已有的首页/履历改动未改动或提交；临时构建路径配置在验证后恢复。
18. **构建**：最终 `pnpm build` 通过：编译、类型检查、32 个静态页面生成。使用独立缓存 `.tools/room-life-build` 避免覆盖并行预览；本地生产预览更新到 `http://localhost:3015/other-side`。

## 16 个验收场景

| 场景 | 结果与证据 |
| --- | --- |
| 1. 点击 Lamp：ON → OFF | 实际浏览器通过，暖灯渐暗，原窗景保留 |
| 2. 再点 Lamp：OFF → ON | 实际浏览器通过，恢复暖灯 |
| 3. 快速连续点击 | 双击只切一次；较长连续点击后状态正常；自动检查过渡中 10 次切换被忽略 |
| 4. Chair 左右拖动及边界 | 实际左右拖动，夹紧到 ±1.505m；观察仍在桌前轨道 |
| 5. 拖椅子不拖相机 | 实际拖动前后相机位置、target 不变；自动检查拖动时 controls=false |
| 6. Chair → Childhood → 返回 | 实际返回后 chairX=1.505、夜间 OFF 保留 |
| 7. 点击 Lounge Chair 坐下 | 实际进入 APPROACHING_SEAT → SITTING |
| 8. 坐姿看宇宙 | 实际检查窗框/植物构图，修正原窗景平面边缘 |
| 9. 有限转头 | 实际鼠标拖动、390px 滑动；自动验证固定眼位及角度限制 |
| 10. ESC / 起身 → FREE | 桌面 ESC、手机按钮均通过 |
| 11. 起身不去 Profile | 实际 pathname 始终 /other-side |
| 12. LIGHT_OFF + SITTING | 实际浏览器检查夜间坐姿窗景 |
| 13. 起身仍关灯 | 实际 DOM lighting=ROOM_LIGHT_OFF |
| 14. Mobile Lamp | 390×844 实际点击从 OFF → ON |
| 15. Mobile Chair | 点椅子显示左右按钮，左右操作通过，相机保持不变 |
| 16. Mobile Sit / Stand | 手机宽度下点击椅子坐下、点击起身通过 |

额外检查：坐下途中 ESC；坐姿期间 RESET、其他模块入口被忽略；坐姿切换手机/桌面宽度；键盘监听卸载清理；原四模块返回相机解锁；上一轮 13 个 Desk 物件的几何尺寸、贴桌位置和原选择绑定。

自动检查：`node scripts/room/verify-room-life.cjs`、`node scripts/room/verify-desk-props.cjs`。相机检查使用真实 React、R3F 和 camera-controls，DOM 层为测试替身；实际浏览器检查另行执行。

## 本轮文件清单

- `data/leoRoomLife.ts`：过渡时长、轨道边界、坐姿/起身与转头参数。
- `components/leo-room/useRoomInteractionController.ts`：生活状态、事件优先级、切灯防连点、起身/取消。
- `components/leo-room/RoomLifeContext.tsx`：既有控制器传入室内树。
- `components/leo-room/RoomLightingScope.tsx`：原灯光和材质注册、平滑过渡与清理。
- `components/leo-room/RoomLifeFurniture.tsx`：办公椅轨道、移动按钮、Lounge 坐下事件。
- `components/leo-room/RoomCameraControls.tsx`：坐姿动画、有限转头、起身、响应式保持。
- `components/leo-room/DeskInteractiveItem.tsx`：原台灯接统一切灯 handler 和悬停提示。
- `components/leo-room/CentralWorkspace.tsx`：原椅子接移动层，保留显示器夜间微光。
- `components/leo-room/StudioInterior.tsx`：原 Lounge Chair 接坐下事件与共享坐垫参数。
- `components/leo-room/CosmicBackdrop.tsx`：扩大原窗外平面覆盖范围。
- `components/LeoRoomScene.tsx`：统一上下文、灯光作用范围和夜间基础光参数。
- `components/OtherSide.tsx`：坐姿时隐藏导航，显示小型起身提示。
- `components/leo-room/RoomNavigation.module.css`：椅子按钮和坐姿提示。
- `components/leo-room/StudioDisplay.module.css`：夜间电视内容平滑降低亮度。
- `scripts/room/verify-room-life.cjs`：生活交互及原相机回归检查。
- `components/leo-room/ROOM_LIFE_REVIEW.md`：本记录。
