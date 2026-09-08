# Leo’s Room 相机与返回交互验收

本轮仅本地修改，未执行 git commit 或 git push。房间建模、家具、材质、灯光、照片素材、童年故事和旅行内容保持原样。

1. **原相机问题**：`focusRequest`、`activeTarget`、`roomMode`、阅读/照片状态与 `DeskFocusController` 分别控制焦点或恢复动画。关闭内容只清理其中一部分，热点状态和未完成过渡可能继续影响相机。
2. **原返回问题**：共享的 `returnFromRoom` 在没有匹配到内容状态时调用 `router.back()`，浏览历史上一页为 Profile 时便会离开房间。
3. **统一状态**：`FREE_EXPLORE → FOCUSING → FOCUSED → CONTENT_OPEN`；中断聚焦或主动重置时使用 `RESTORING`。`activeHotspot`、内容、`focusTarget`、`controlsEnabled` 由同一个控制器派生。
4. **相机快照**：保存当前实际 position、rotation quaternion、target、up、zoom、fov，以及 controls 的启用状态、距离/角度边界和 smoothTime。中途取消可以平滑恢复之前的快照。
5. **正常关闭**：冻结实际当前视角，停止过渡，立即启用 controls；清空内容和热点并进入 `FREE_EXPLORE`。不重建 Room Canvas，不自动回默认机位。相机库的 `stop()` 本身会跳到动画终点，所以先把动画目标改成当前实际取景，再停止。
6. **ESC**：由 Room 的 window capture 监听器统一处理。内容打开时关闭内容；聚焦时取消；自由探索时不导航。过滤连发与 keyup 的重复关闭；过期异步回调通过递增令牌失效。Childhood 仅更新了两处 ESC 返回提示，故事、游戏和菜单内容没有变化。
7. **返回与退出**：左上“返回房间”只关闭模块；“返回探索”取消临时聚焦；“退出房间”是独立的首页链接。Room 不再调用 `router.back()`。My World 在房间内以模块打开，其独立 `/other-side/world` route 仍保留。原有 Desk / Digital Lab 内容链接保留。
8. **Childhood**：桌面与手机尺寸均实际打开并返回，房间保持挂载、能立即拖动；启动游戏后按 ESC 也返回房间。进入前的聚焦取消、进入后关闭、随后转向 My World 均通过。
9. **My World**：打开时 URL 始终为 `/other-side`，Room Canvas 数量保持 1；关闭后立即恢复拖动。手机尺寸下返回按钮可见，模块尚在加载时也可返回。
10. **Desk**：桌面与手机尺寸均实际打开中央控制台，关闭详情/点击左上返回后能继续旋转。近景不被强制重置，原内容链接仍可见。
11. **Photo Wall**：点击真实照片、Lightbox 切换、ESC 与返回按钮关闭均通过；关闭后可拖动。继续使用现有 `photo.previewSrc`，未构造任何新照片路径。
12. **Mobile**：390×844 浏览器尺寸完成四个模块返回及拖动检查；1280px / 390px 的真实 camera-controls 回归测试均通过。此处为浏览器尺寸和指针操作验证，未连接实体手机验证多指触摸硬件。
13. **修改文件**：见下方清单。临时构建缓存配置已恢复，不保留本轮对 `next.config.mjs`、`next-env.d.ts`、`tsconfig.json` 的测试路径改动；原有其他任务改动保留。
14. **构建**：`pnpm build` 通过，包括类型检查与 32 个静态页面生成。最终构建输出使用独立 `.tools/room-navigation-build`，避免覆盖其他预览缓存。之前一次构建曾因当时首页缺少 `Homepage.module.css` 失败；该文件出现后重新构建通过，本轮未修改首页。

## 验收场景

| 场景 | 结果 |
| --- | --- |
| Childhood 聚焦后 ESC 取消并继续看房间 | 通过 |
| Childhood 内容关闭后立即转视角 | 通过 |
| Childhood 返回后转向并进入 My World | 通过 |
| My World 关闭后相机可操作 | 通过 |
| Desk 关闭后相机可操作 | 通过 |
| Photo Lightbox 关闭后相机可操作 | 通过 |
| 连续进入多个模块 | 浏览器连续操作通过；自动回归每个宽度四模块循环 3 次通过 |
| 左上返回房间不跳 Profile | 通过，仍为 `/other-side` |
| 自由探索 ESC 不退出，主动退出才离开 | 通过，退出到 `/` |
| RESET VIEW 返回默认机位 | 通过，使用原桌面/手机预设 |

自动回归还覆盖：聚焦中断恢复、Desk 动画中途关闭保持实际取景、过期动画不重新激活内容、背景取消、拖动接管、组件卸载后的键盘监听器清理。

运行：`node scripts/room/verify-navigation.cjs`。测试使用真实 React hook、R3F 和 camera-controls，模拟渲染帧；DOM 连接层使用测试替身，浏览器验收另行完成。

## 文件清单

- `components/OtherSide.tsx`：模块与返回入口接到统一控制器。
- `components/LeoRoomScene.tsx`：接入统一相机、背景取消；内容打开期间按需绘制房间。
- `components/leo-room/useRoomInteractionController.ts`：统一状态、快照、取消、ESC、异步命令清理。
- `components/leo-room/RoomCameraControls.tsx`：唯一相机驱动，沿用原相机手感参数。
- `components/leo-room/RoomModuleOverlay.tsx`：My World 模块容器、返回、焦点和 inert 恢复。
- `components/leo-room/RoomNavigation.module.css`：克制的返回、退出、状态与 RESET VIEW 控制。
- `components/leo-room/DeskInteractiveItem.tsx`：移除独立相机控制器；恢复时清理手势状态。
- `components/leo-room/DeskDetailOverlay.tsx`：关闭入口与提示。
- `components/leo-room/PhotoLightbox.tsx`：明确返回按钮与焦点恢复，ESC 交给 Room。
- `components/leo-room/childhood/ChildhoodGame.tsx`：仅两处 ESC 导航提示文字。
- `components/my-world/MyWorldPage.tsx`：可嵌入模式，独立页面行为保留。
- `components/other-side/OtherSideEntry.tsx`：预加载返回控制样式，避免按钮被画布遮挡。
- `scripts/room/verify-navigation.cjs`：相机与状态回归检查。
- `components/leo-room/ROOM_NAVIGATION_REVIEW.md`：本验收记录。

本地生产体验入口：http://localhost:3013/other-side
